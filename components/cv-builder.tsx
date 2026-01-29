"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  FileDown,
  Eye,
  PenTool,
  User,
  LogOut,
  Cloud,
  CloudOff,
  Loader2,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/ui/AuthModal";
import { PersonalDetailsForm } from "@/components/forms/PersonalDetailsForm";
import { ExperienceForm } from "@/components/forms/ExperienceForm";
import { EducationForm } from "@/components/forms/EducationForm";
import { ProjectsForm } from "@/components/forms/ProjectsForm";
import { AchievementsForm } from "@/components/forms/AchievementsForm";
import { LanguagesForm } from "@/components/forms/LanguagesForm";
import { SkillsForm } from "@/components/forms/SkillsForm";
import { CVPreview } from "@/components/preview/CVPreview";
import { PDFDocument } from "@/components/preview/PDFDocument";
import { initialCVData, CVData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { saveCV, loadCV } from "@/lib/cvService";

export function CVBuilder() {
  const { user, loading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth();

  const methods = useForm<CVData>({
    defaultValues: initialCVData,
    mode: "onChange",
  });

  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [isClient, setIsClient] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dataLoaded, setDataLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Client-side check - this pattern is intentional for hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Load saved CV data when user signs in
  useEffect(() => {
    async function loadUserData() {
      if (user && !dataLoaded) {
        try {
          const savedData = await loadCV(user.uid);
          if (savedData) {
            methods.reset(savedData);
          }
          setDataLoaded(true);
        } catch (error) {
          console.error("Error loading CV data:", error);
          setDataLoaded(true);
        }
      }
    }
    loadUserData();
  }, [user, dataLoaded, methods]);

  // Reset dataLoaded flag when user signs out
  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDataLoaded(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaveStatus("idle");
    }
  }, [user]);

  // Save function
  const handleSave = useCallback(
    async (data: CVData) => {
      if (!user) return;

      setSaveStatus("saving");

      try {
        await saveCV(user.uid, data);
        setSaveStatus("saved");

        // Reset to idle after 2 seconds
        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      } catch (error) {
        console.error("Error saving CV:", error);
        setSaveStatus("error");
      }
    },
    [user]
  );

  // Manual save function - triggered by button click
  const handleManualSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    await handleSave(methods.getValues());
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      methods.reset(initialCVData);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex h-screen flex-col overflow-hidden bg-muted/10 text-foreground">
        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSignIn={signIn}
          onSignUp={signUp}
          onResetPassword={resetPassword}
        />

        {/* Top Header Bar */}
        <header className="w-full bg-background border-b border-border px-4 py-3 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CV Generator
            </h1>

            {/* Save Status Indicator */}
            {user && (
              <div className="flex items-center gap-1.5 text-xs">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    <span className="text-gray-500 dark:text-gray-400">Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">Saved</span>
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <CloudOff className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">Error</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Manual Save Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={saveStatus === "saving"}
              className="gap-1.5"
            >
              {saveStatus === "saving" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Save</span>
            </Button>

            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full border border-border">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground max-w-[150px] truncate">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        </header>

        {/* Mobile Tab Toggle */}
        <div className="md:hidden flex border-b border-border bg-background p-2 gap-2 shrink-0">
          <Button
            variant={activeTab === "editor" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setActiveTab("editor")}
          >
            <PenTool className="w-4 h-4 mr-2" /> Editor
          </Button>
          <Button
            variant={activeTab === "preview" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setActiveTab("preview")}
          >
            <Eye className="w-4 h-4 mr-2" /> Preview
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* LEFT: Editor Panel */}
          <div
            className={cn(
              "w-full md:w-1/2 lg:w-5/12 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800",
              activeTab === "preview" ? "hidden md:block" : "block"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">CV Editor</h2>
              {!user && (
                <p className="text-xs text-muted-foreground">
                  Sign in to save your progress
                </p>
              )}
            </div>

            <PersonalDetailsForm />
            <ExperienceForm />
            <EducationForm />
            <ProjectsForm />
            <AchievementsForm />
            <LanguagesForm />
            <SkillsForm />
          </div>

          {/* RIGHT: Preview Panel */}
          <div
            className={cn(
              "w-full md:w-1/2 lg:w-7/12 bg-muted/30 p-4 md:p-8 overflow-y-auto flex flex-col items-center border-t md:border-t-0 md:border-l border-border",
              activeTab === "editor" ? "hidden md:flex" : "flex"
            )}
          >
            <div className="w-full max-w-[210mm] flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground/80">Live Preview</h2>
              {isClient && <PreviewActionButtons control={methods.control} />}
            </div>

            <div className="border border-border shadow-2xl bg-white w-full max-w-[210mm] min-h-[297mm]">
              <LivePreviewWrapper
                control={methods.control}
                userId={user?.uid}
                onSave={handleSave}
                saveTimeoutRef={saveTimeoutRef}
              />
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

// Separate component to use useWatch hook with auto-save
function LivePreviewWrapper({
  control,
  userId,
  onSave,
  saveTimeoutRef,
}: {
  control: ReturnType<typeof useForm<CVData>>["control"];
  userId?: string;
  onSave: (data: CVData) => Promise<void>;
  saveTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}) {
  const data = useWatch({ control });
  const isFirstRender = useRef(true);

  // Auto-save effect with debounce (disabled - using manual save button instead)
  useEffect(() => {
    // Skip first render and when no user
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Copy ref value to avoid stale closure in cleanup
    const timeoutId = saveTimeoutRef.current;
    // Clear existing timeout on cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [data, userId, onSave]);

  return <CVPreview data={data as CVData} />;
}

// Download Button Component
function PreviewActionButtons({ control }: { control: ReturnType<typeof useForm<CVData>>["control"] }) {
  const data = useWatch({ control });

  return (
    <PDFDownloadLink
      document={<PDFDocument data={data as CVData} />}
      fileName="cv.pdf"
    >
      {({ loading }: { loading: boolean }) => (
        <Button disabled={loading}>
          <FileDown className="w-4 h-4 mr-2" />
          {loading ? "Preparing..." : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
