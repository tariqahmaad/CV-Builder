"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch, useFormContext } from "react-hook-form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { motion } from "framer-motion";
import {
  FileDown,
  Eye,
  PenTool,
  User,
  Cloud,
  CloudOff,
  Loader2,
  Save,
  Sparkles,
  Check,
  CheckCircle,
  Info,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/ui/AuthModal";
import { UserMenu } from "@/components/ui/UserMenu";
import { ConflictDialog } from "@/components/ui/ConflictDialog";
import { PersonalDetailsForm } from "@/components/forms/PersonalDetailsForm";
import { ExperienceForm } from "@/components/forms/ExperienceForm";
import { EducationForm } from "@/components/forms/EducationForm";
import { ProjectsForm } from "@/components/forms/ProjectsForm";
import { AchievementsForm } from "@/components/forms/AchievementsForm";
import { LanguagesForm } from "@/components/forms/LanguagesForm";
import { SkillsForm } from "@/components/forms/SkillsForm";
import { CVPreview } from "@/components/preview/CVPreview";
import { PDFDocument } from "@/components/preview/PDFDocument";
import { SectionSidebar } from "@/components/layout/SectionSidebar";
import { initialCVData, CVData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { saveCV, backupCV } from "@/lib/cvService";
import { clearDraft } from "@/lib/localStorage";
import { useCVDraft } from "@/hooks/useCVDraft";
import { User as FirebaseUser } from "firebase/auth";

// Inner component that has access to FormContext
function CVBuilderContent() {
  const {
    user,
    loading: authLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    setPostAuthCallback,
  } = useAuth();

  const methods = useFormContext<CVData>();

  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [isClient, setIsClient] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Conflict resolution state
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictData, setConflictData] = useState<{
    localData: CVData;
    serverData: CVData;
    localDate: Date;
    serverDate: Date;
  } | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "error";
    visible: boolean;
  } | null>(null);

  // Clear all confirmation state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const showToast = (message: string, type: "success" | "info" | "error") => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, 4000);
  };

  // Use the new draft hook - now inside FormProvider context
  const {
    isLoading: draftLoading,
    hasPendingSave,
    saveToDraft,
    saveToCloud,
    checkForConflicts,
    syncAfterAuth,
  } = useCVDraft({
    user,
    isAuthLoading: authLoading,
  });

  // Client-side check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle post-auth callback (save draft after login/signup)
  useEffect(() => {
    setPostAuthCallback(async (newUser) => {
      // First, try automatic sync
      await syncAfterAuth(newUser);

      // Check if there's a conflict that needs user resolution
      const conflict = await checkForConflicts();

      if (conflict.hasConflict && conflict.localData && conflict.serverData) {
        // Show conflict dialog for user to decide
        setConflictData({
          localData: conflict.localData,
          serverData: conflict.serverData,
          localDate: conflict.localDate!,
          serverDate: conflict.serverDate!,
        });
        setShowConflictDialog(true);
      } else if (!conflict.hasConflict) {
        // Sync completed successfully
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    });

    return () => setPostAuthCallback(null);
  }, [setPostAuthCallback, syncAfterAuth, checkForConflicts]);

  // Manual save function - triggered by button click
  const handleManualSave = async () => {
    // First, always save to localStorage as backup
    saveToDraft();

    if (!user) {
      // Guest user: show auth modal with message
      setShowAuthModal(true);
      return;
    }

    // Authenticated user: save to cloud
    setSaveStatus("saving");

    const success = await saveToCloud();

    if (success) {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } else {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  // Handle conflict resolution
  const handleKeepLocal = async () => {
    if (!user || !conflictData) return;

    setShowConflictDialog(false);
    setSaveStatus("saving");

    try {
      // First, backup the current cloud data before overwriting
      const backupSuccess = await backupCV(user.uid, "conflict_resolution_keep_local");

      if (backupSuccess) {
        console.log("[CVBuilder] Cloud data backed up successfully before overwrite");
      }

      // Now save local data to cloud
      await saveCV(user.uid, conflictData.localData);
      clearDraft();
      setSaveStatus("saved");
      showToast(
        backupSuccess
          ? "Local version saved. Cloud backup created."
          : "Local version saved to cloud.",
        "success"
      );
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      showToast("Failed to save local version. Please try again.", "error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleKeepServer = () => {
    setShowConflictDialog(false);
    clearDraft();
    // Server data is already loaded by useCVDraft
    showToast("Kept cloud version. Your data is safe.", "success");
  };

  const handleCloseDialog = () => {
    // Default to keeping cloud data when dialog is closed without choosing
    setShowConflictDialog(false);
    // Don't clear local draft - preserve it as backup
    showToast("Kept cloud version. Local changes preserved in backup.", "info");
  };

  const handleMerge = () => {
    // Future: implement merge UI
    setShowConflictDialog(false);
  };

  // Handle clearing all data
  const handleClearAll = () => {
    setShowClearConfirm(false);
    // Reset form to initial empty state
    methods.reset(initialCVData);
    // Clear localStorage draft
    clearDraft();
    showToast("All fields cleared. Starting fresh.", "info");
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      // Save current work to localStorage before signing out
      saveToDraft();

      await signOut();
      methods.reset(initialCVData);
      setSaveStatus("idle");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get save button state
  const getSaveButtonIcon = () => {
    switch (saveStatus) {
      case "saving":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "saved":
        return <Check className="w-4 h-4" />;
      case "error":
        return <CloudOff className="w-4 h-4" />;
      default:
        return <Save className="w-4 h-4" />;
    }
  };

  const getSaveButtonText = () => {
    if (!user) return "Save";
    switch (saveStatus) {
      case "saving":
        return "Saving...";
      case "saved":
        return "Saved";
      case "error":
        return "Failed";
      default:
        return "Save";
    }
  };

  const isLoading = authLoading || draftLoading;

  return (
    <>
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={signIn}
        onSignUp={signUp}
        onResetPassword={resetPassword}
      />

      {/* Conflict Resolution Dialog */}
      {conflictData && (
        <ConflictDialog
          isOpen={showConflictDialog}
          localDate={conflictData.localDate}
          serverDate={conflictData.serverDate}
          localData={conflictData.localData}
          serverData={conflictData.serverData}
          onKeepLocal={handleKeepLocal}
          onKeepServer={handleKeepServer}
          onMerge={handleMerge}
          onClose={handleCloseDialog}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300",
            toast.type === "success" && "bg-emerald-500 text-white",
            toast.type === "info" && "bg-blue-500 text-white",
            toast.type === "error" && "bg-red-500 text-white",
            toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          {toast.type === "success" && <CheckCircle className="w-5 h-5" />}
          {toast.type === "info" && <Info className="w-5 h-5" />}
          {toast.type === "error" && <CloudOff className="w-5 h-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Clear All Confirmation Dialog */}
      {showClearConfirm && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={() => setShowClearConfirm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[60] px-4"
          >
            <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-2xl shadow-red-500/20 dark:shadow-red-900/30 overflow-hidden">
              {/* Warning Banner */}
              <div className="bg-red-500 px-6 py-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm uppercase tracking-wide">
                  Warning
                </span>
              </div>

              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center ring-4 ring-red-50 dark:ring-red-900/20">
                    <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100">
                  Clear All Data?
                </h2>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">
                  This action <span className="font-semibold text-red-600 dark:text-red-400">cannot be undone</span>
                </p>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-3">
                    The following will be permanently deleted:
                  </p>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-red-600 dark:text-red-400 text-xs font-bold">×</span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        All personal information, work experience, education, and projects
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-red-600 dark:text-red-400 text-xs font-bold">×</span>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Local draft saved on this device
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm text-emerald-800 dark:text-emerald-200">
                    Your cloud data (if signed in) will remain safe
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 h-11 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClearAll}
                    className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Top Header Bar */}
      <header className="w-full bg-slate-900 dark:bg-slate-950 border-b border-slate-800 dark:border-slate-900 px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">CV Pro</h1>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-slate-700 dark:bg-slate-800 mx-1" />

          {/* Save Status Indicator */}
          {user && (
            <div className="flex items-center gap-1.5 text-xs">
              {saveStatus === "saving" && (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  <span className="text-slate-400">Saving...</span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Saved</span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-red-400">Error</span>
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
            className={cn(
              "gap-1.5 border-slate-600 text-white hover:text-white",
              "bg-slate-800/50 hover:bg-slate-800",
              "hover:border-slate-500",
              saveStatus === "saved" && "border-emerald-600/50 bg-emerald-900/20",
              saveStatus === "error" && "border-red-600/50 bg-red-900/20"
            )}
          >
            {getSaveButtonIcon()}
            <span className="hidden sm:inline">{getSaveButtonText()}</span>
          </Button>

          {isLoading ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          ) : user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <Button
              onClick={() => setShowAuthModal(true)}
              className={cn(
                "gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white",
                "shadow-lg shadow-indigo-500/25"
              )}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign in</span>
              <span className="sm:hidden">Sign in</span>
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
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row min-h-0">
        {/* LEFT: Editor Panel with Sidebar */}
        <div
          className={cn(
            "w-full md:w-1/2 lg:w-5/12 flex flex-col min-h-0",
            activeTab === "preview" ? "hidden md:flex" : "flex"
          )}
        >
          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar - Collapsible */}
            <SectionSidebar
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              data={methods.watch()}
              className="hidden md:flex h-full pt-6"
            />

            {/* Scrollable Form Area */}
            <div
              id="editor-scroll-container"
              className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  CV Editor
                </h2>
                <div className="flex items-center gap-2">
                  {/* Clear All Button */}
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                      "text-red-600 dark:text-red-400",
                      "hover:bg-red-50 dark:hover:bg-red-900/20",
                      "border border-red-200 dark:border-red-800",
                      "transition-colors"
                    )}
                    title="Clear all fields and start fresh"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>

                  {!user && (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                        "bg-indigo-600 text-white",
                        "dark:bg-indigo-500 dark:text-white",
                        "hover:bg-indigo-700 dark:hover:bg-indigo-600",
                        "transition-colors"
                      )}
                    >
                      <CloudOff className="w-3.5 h-3.5 text-white" />
                      Sign in to save
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-12 pb-32 max-w-2xl mx-auto">
                <section id="personal" className="scroll-mt-6">
                  <PersonalDetailsForm />
                </section>

                <section id="experience" className="scroll-mt-6">
                  <ExperienceForm />
                </section>

                <section id="education" className="scroll-mt-6">
                  <EducationForm />
                </section>

                <section id="projects" className="scroll-mt-6">
                  <ProjectsForm />
                </section>

                <section id="achievements" className="scroll-mt-6">
                  <AchievementsForm />
                </section>

                <section id="languages" className="scroll-mt-6">
                  <LanguagesForm />
                </section>

                <section id="skills" className="scroll-mt-6">
                  <SkillsForm />
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview Panel */}
        <div
          className={cn(
            "w-full md:w-1/2 lg:w-7/12 bg-muted/30 p-4 md:p-8 flex flex-col items-center border-t md:border-t-0 md:border-l border-border min-h-0 overflow-hidden",
            activeTab === "editor" ? "hidden md:flex" : "flex"
          )}
        >
          {/* Desktop scrollable preview */}
          <div className="hidden md:flex flex-col w-full h-full overflow-hidden">
            <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-semibold text-foreground/80">
                Live Preview
              </h2>
              {isClient && (
                <PreviewActionButtons control={methods.control} />
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="border border-border shadow-2xl bg-white w-full max-w-[210mm] min-h-[297mm]">
                <LivePreviewWrapper control={methods.control} />
              </div>
            </div>
          </div>

          {/* Mobile scrollable preview */}
          <div className="md:hidden flex flex-col w-full h-full overflow-hidden">
            <div className="w-full max-w-[210mm] flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-semibold text-foreground/80">
                Live Preview
              </h2>
              {isClient && (
                <PreviewActionButtons control={methods.control} />
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="flex justify-center">
                <div
                  className="border border-border shadow-2xl bg-white origin-top"
                  style={{
                    width: "210mm",
                    minHeight: "297mm",
                    transform: "scale(0.45)",
                    transformOrigin: "top center",
                  }}
                >
                  <LivePreviewWrapper control={methods.control} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Main export component
export function CVBuilder() {
  const methods = useForm<CVData>({
    defaultValues: initialCVData,
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <div className="flex h-screen flex-col overflow-hidden bg-muted/10 text-foreground">
        <CVBuilderContent />
      </div>
    </FormProvider>
  );
}

// Separate component to use useWatch hook
function LivePreviewWrapper({
  control,
}: {
  control: ReturnType<typeof useForm<CVData>>["control"];
}) {
  const data = useWatch({ control });
  return <CVPreview data={data as CVData} />;
}

// Download Button Component
function PreviewActionButtons({
  control,
}: {
  control: ReturnType<typeof useForm<CVData>>["control"];
}) {
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
