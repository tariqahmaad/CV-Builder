"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CVData, initialCVData } from "@/lib/types";
import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  hasDataChanged,
} from "@/lib/localStorage";
import { loadCV, saveCV } from "@/lib/cvService";
import { User } from "firebase/auth";

interface UseCVDraftOptions {
  user: User | null;
  isAuthLoading: boolean;
}

interface UseCVDraftReturn {
  isLoading: boolean;
  hasPendingSave: boolean;
  saveToDraft: () => void;
  saveToCloud: () => Promise<boolean>;
  checkForConflicts: () => Promise<{
    hasConflict: boolean;
    localData?: CVData;
    serverData?: CVData;
    localDate?: Date;
    serverDate?: Date;
  }>;
  syncAfterAuth: (newUser: User) => Promise<void>;
}

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds for more immediate saves
const SAVE_STATUS_TIMEOUT = 2000;

export function useCVDraft({
  user,
  isAuthLoading,
}: UseCVDraftOptions): UseCVDraftReturn {
  const { getValues, reset } = useFormContext<CVData>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasPendingSave, setHasPendingSave] = useState(false);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<CVData | null>(null);
  const hasLoadedRef = useRef(false);

  /**
   * Save current form data to localStorage draft
   */
  const saveToDraft = useCallback(() => {
    const currentData = getValues();

    // Only save if data has changed from last save
    if (
      !lastSavedDataRef.current ||
      hasDataChanged(lastSavedDataRef.current, currentData)
    ) {
      saveDraft(currentData);
      lastSavedDataRef.current = currentData;
    }
  }, [getValues]);

  /**
   * Save current form data to cloud (Firebase)
   */
  const saveToCloud = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    const currentData = getValues();

    try {
      await saveCV(user.uid, currentData);
      clearDraft(); // Clear local draft after successful cloud save
      lastSavedDataRef.current = currentData;
      setHasPendingSave(false);
      return true;
    } catch (error) {
      console.error("[CVDraft] Failed to save to cloud:", error);
      return false;
    }
  }, [user, getValues]);

  /**
   * Check for conflicts between local and server data
   */
  const checkForConflicts = useCallback(async () => {
    if (!user || !hasDraft()) {
      return { hasConflict: false };
    }

    const localDraft = loadDraft();
    const serverData = await loadCV(user.uid);

    if (!localDraft || !serverData) {
      return { hasConflict: false };
    }

    // Check if data is different
    const isDifferent = hasDataChanged(localDraft.data, serverData);

    if (!isDifferent) {
      // Data is the same, no conflict - clear local draft
      clearDraft();
      return { hasConflict: false };
    }

    return {
      hasConflict: true,
      localData: localDraft.data,
      serverData,
      localDate: new Date(localDraft.savedAt),
      serverDate: new Date(),
    };
  }, [user]);

  /**
   * Sync data after authentication
   * This is called immediately after login/signup
   */
  const syncAfterAuth = useCallback(
    async (newUser: User): Promise<void> => {
      const localDraft = loadDraft();
      const currentData = getValues();

      if (localDraft || hasDataChanged(initialCVData, currentData)) {
        // User has local data - check for conflicts with server
        const serverData = await loadCV(newUser.uid);

        if (serverData) {
          // Server has data - check if different from local
          const dataToCompare = localDraft?.data || currentData;
          const isDifferent = hasDataChanged(dataToCompare, serverData);

          if (isDifferent) {
            // Conflict detected - let the component handle it
            setHasPendingSave(true);
            return;
          }
          // Data is the same, no action needed
        } else {
          // No server data - upload local data immediately
          const dataToUpload = localDraft?.data || currentData;
          await saveCV(newUser.uid, dataToUpload);
          clearDraft();
          lastSavedDataRef.current = dataToUpload;
        }
      }

      setHasPendingSave(false);
    },
    [getValues]
  );

  /**
   * Load data on mount - ONLY ONCE
   */
  useEffect(() => {
    // Skip if still loading auth or already loaded
    if (isAuthLoading || hasLoadedRef.current) return;

    const loadInitialData = async () => {
      setIsLoading(true);

      try {
        if (user) {
          // User is logged in - load from server first
          const serverData = await loadCV(user.uid);
          const localDraft = loadDraft();

          if (serverData) {
            // Server data exists - use it
            reset(serverData);
            lastSavedDataRef.current = serverData;

            // If local draft also exists and is different, mark pending
            if (localDraft && hasDataChanged(localDraft.data, serverData)) {
              setHasPendingSave(true);
            } else {
              // Clear any stale draft
              clearDraft();
            }
          } else if (localDraft) {
            // Only local draft exists - use it and upload to server
            reset(localDraft.data);
            lastSavedDataRef.current = localDraft.data;
            await saveCV(user.uid, localDraft.data);
            clearDraft();
          }
          // If neither exists, keep default empty form
        } else {
          // Guest user - load from localStorage only
          const draft = loadDraft();
          if (draft) {
            reset(draft.data);
            lastSavedDataRef.current = draft.data;
          }
        }
      } catch (error) {
        console.error("[CVDraft] Failed to load data:", error);
      } finally {
        setIsLoading(false);
        hasLoadedRef.current = true;
      }
    };

    loadInitialData();
  }, [user, isAuthLoading, reset]);

  /**
   * Reset loaded flag when user signs out
   */
  useEffect(() => {
    if (!user && !isAuthLoading) {
      hasLoadedRef.current = false;
    }
  }, [user, isAuthLoading]);

  /**
   * Auto-save interval for draft
   */
  useEffect(() => {
    // Clear existing interval
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }

    // Start auto-save for both guest and logged-in users
    autoSaveIntervalRef.current = setInterval(() => {
      const currentData = getValues();

      // Only save if there's actual content (avoid saving empty forms)
      const hasContent =
        Object.values(currentData.personalInfo).some(
          (v) => typeof v === "string" && v.trim().length > 0
        ) ||
        currentData.experience.length > 0 ||
        currentData.education.length > 0 ||
        currentData.projects.length > 0 ||
        currentData.achievements.length > 0 ||
        currentData.languages.length > 0 ||
        currentData.skills.length > 0;

      if (hasContent) {
        saveToDraft();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [getValues, saveToDraft]);

  /**
   * Save before unload
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentData = getValues();
      const hasContent =
        Object.values(currentData.personalInfo).some(
          (v) => typeof v === "string" && v.trim().length > 0
        ) ||
        currentData.experience.length > 0 ||
        currentData.education.length > 0 ||
        currentData.projects.length > 0 ||
        currentData.achievements.length > 0 ||
        currentData.languages.length > 0 ||
        currentData.skills.length > 0;

      if (hasContent) {
        saveToDraft();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [getValues, saveToDraft]);

  return {
    isLoading,
    hasPendingSave,
    saveToDraft,
    saveToCloud,
    checkForConflicts,
    syncAfterAuth,
  };
}
