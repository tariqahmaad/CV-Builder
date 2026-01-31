import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { CVData, initialCVData } from "./types";
import { validateCVData } from "./validation";

/**
 * Deep merge two objects, with source values taking priority
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

const CV_COLLECTION = "cvs";
const BACKUP_COLLECTION = "cv_backups";
const MAX_BACKUPS = 5; // Keep last 5 backups per user

export interface CVDocument {
  data: CVData;
  updatedAt: Date;
  createdAt: Date;
}

export interface BackupDocument {
  data: CVData;
  originalUpdatedAt: Date;
  backedUpAt: Date;
  reason: string;
}

/**
 * Save CV data to Firestore
 */
export async function saveCV(userId: string, data: CVData): Promise<void> {
  const docRef = doc(db, CV_COLLECTION, userId);
  const existingDoc = await getDoc(docRef);

  if (existingDoc.exists()) {
    // Update existing document
    await setDoc(
      docRef,
      {
        data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } else {
    // Create new document
    await setDoc(docRef, {
      data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Load CV data from Firestore
 * Validates and sanitizes loaded data using Zod schema
 * Returns null if document doesn't exist or data is invalid
 */
export async function loadCV(userId: string): Promise<CVData | null> {
  const docRef = doc(db, CV_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const document = docSnap.data();
    const loadedData = document.data;
    
    // Validate data with Zod schema
    const validatedData = validateCVData(loadedData);
    
    if (validatedData) {
      // Deep merge with initial values to ensure all fields are present
      return deepMerge(
        initialCVData as unknown as Record<string, unknown>,
        validatedData as unknown as Record<string, unknown>
      ) as unknown as CVData;
    }
    
    console.warn("Loaded CV data failed validation, returning null");
    return null;
  }

  return null;
}

/**
 * Delete CV data from Firestore
 */
export async function deleteCV(userId: string): Promise<void> {
  const docRef = doc(db, CV_COLLECTION, userId);
  await deleteDoc(docRef);
}

/**
 * Create a backup of the current cloud CV data before overwriting
 * This protects user data during conflict resolution
 */
export async function backupCV(
  userId: string,
  reason: string = "manual_backup"
): Promise<boolean> {
  try {
    const docRef = doc(db, CV_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // No data to backup
      return false;
    }

    const currentData = docSnap.data();

    // Create backup document
    const backupData = {
      data: currentData.data,
      originalUpdatedAt: currentData.updatedAt || serverTimestamp(),
      backedUpAt: serverTimestamp(),
      reason: reason,
    };

    // Generate unique backup ID with timestamp
    const backupId = `${userId}_${Date.now()}`;
    const backupRef = doc(db, BACKUP_COLLECTION, backupId);
    await setDoc(backupRef, backupData);

    // Clean up old backups (keep only MAX_BACKUPS most recent)
    await cleanupOldBackups(userId);

    return true;
  } catch (error) {
    console.error("[cvService] Failed to create backup:", error);
    return false;
  }
}

/**
 * Clean up old backups, keeping only the most recent MAX_BACKUPS
 */
async function cleanupOldBackups(userId: string): Promise<void> {
  try {
    const backupsQuery = query(
      collection(db, BACKUP_COLLECTION),
      orderBy("backedUpAt", "desc")
    );

    const snapshot = await getDocs(backupsQuery);
    const userBackups: { id: string }[] = [];

    snapshot.forEach((doc) => {
      if (doc.id.startsWith(userId)) {
        userBackups.push({ id: doc.id });
      }
    });

    // Delete backups beyond MAX_BACKUPS
    if (userBackups.length > MAX_BACKUPS) {
      const backupsToDelete = userBackups.slice(MAX_BACKUPS);
      for (const backup of backupsToDelete) {
        await deleteDoc(doc(db, BACKUP_COLLECTION, backup.id));
      }
    }
  } catch (error) {
    console.error("[cvService] Failed to cleanup old backups:", error);
  }
}

/**
 * Get the most recent backup for a user
 */
export async function getMostRecentBackup(
  userId: string
): Promise<BackupDocument | null> {
  try {
    const backupsQuery = query(
      collection(db, BACKUP_COLLECTION),
      orderBy("backedUpAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(backupsQuery);

    if (snapshot.empty) {
      return null;
    }

    const backupDoc = snapshot.docs[0];
    // Only return if it belongs to this user
    if (!backupDoc.id.startsWith(userId)) {
      return null;
    }

    const data = backupDoc.data();
    return {
      data: data.data as CVData,
      originalUpdatedAt: data.originalUpdatedAt?.toDate() || new Date(),
      backedUpAt: data.backedUpAt?.toDate() || new Date(),
      reason: data.reason || "unknown",
    };
  } catch (error) {
    console.error("[cvService] Failed to get most recent backup:", error);
    return null;
  }
}

/**
 * List all backups for a user
 */
export async function listBackups(
  userId: string
): Promise<BackupDocument[]> {
  try {
    const backupsQuery = query(
      collection(db, BACKUP_COLLECTION),
      orderBy("backedUpAt", "desc")
    );

    const snapshot = await getDocs(backupsQuery);
    const backups: BackupDocument[] = [];

    snapshot.forEach((doc) => {
      if (doc.id.startsWith(userId)) {
        const data = doc.data();
        backups.push({
          data: data.data as CVData,
          originalUpdatedAt: data.originalUpdatedAt?.toDate() || new Date(),
          backedUpAt: data.backedUpAt?.toDate() || new Date(),
          reason: data.reason || "unknown",
        });
      }
    });

    return backups;
  } catch (error) {
    console.error("[cvService] Failed to list backups:", error);
    return [];
  }
}

/**
 * Restore CV from a backup
 */
export async function restoreFromBackup(
  userId: string,
  backupData: CVData
): Promise<boolean> {
  try {
    // First backup current data before restoring
    await backupCV(userId, "pre_restore_backup");

    // Restore the backup data
    await saveCV(userId, backupData);

    return true;
  } catch (error) {
    console.error("[cvService] Failed to restore from backup:", error);
    return false;
  }
}
