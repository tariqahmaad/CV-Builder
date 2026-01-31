"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, HardDrive, GitMerge, AlertCircle, X, Check, Shield, AlertTriangle, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVData } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/utils";

interface ConflictDialogProps {
  isOpen: boolean;
  localDate: Date;
  serverDate: Date;
  localData: CVData;
  serverData: CVData;
  onKeepLocal: () => void;
  onKeepServer: () => void;
  onMerge: () => void;
  onClose: () => void;
}

export function ConflictDialog({
  isOpen,
  localDate,
  serverDate,
  localData,
  serverData,
  onKeepLocal,
  onKeepServer,
  onMerge,
  onClose,
}: ConflictDialogProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleKeepLocalClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmKeepLocal = async () => {
    setIsBackingUp(true);
    // Small delay to show backup is happening
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsBackingUp(false);
    setShowConfirmation(false);
    onKeepLocal();
  };

  const handleCancelKeepLocal = () => {
    setShowConfirmation(false);
  };
  // Format dates for display
  const localTimeAgo = formatDistanceToNow(localDate, { addSuffix: true });
  const serverTimeAgo = formatDistanceToNow(serverDate, { addSuffix: true });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Unsaved Changes Detected
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        You have changes that weren&apos;t saved to the cloud
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  We found different versions of your CV. Choose which version to keep:
                </p>

                <div className="grid gap-3">
                  {/* Cloud Version Option - RECOMMENDED */}
                  <button
                    onClick={onKeepServer}
                    className="group relative flex items-start gap-4 p-4 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all text-left shadow-sm"
                  >
                    {/* Recommended Badge */}
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-medium flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3" />
                      Recommended
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Cloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          Keep Cloud Version
                        </h3>
                        <Shield className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-medium">
                        Last synced {serverTimeAgo}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        Your cloud data is protected and will be preserved. Local changes will be backed up.
                      </p>
                    </div>
                  </button>

                  {/* Local Version Option */}
                  <button
                    onClick={handleKeepLocalClick}
                    className="group relative flex items-start gap-4 p-4 rounded-xl border-2 border-border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <HardDrive className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          Keep Local Version
                        </h3>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-medium">
                          Overwrites Cloud
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Saved {localTimeAgo}
                      </p>
                      <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-2">
                        Warning: This will overwrite your cloud data. A backup will be created first.
                      </p>
                    </div>
                  </button>

                  {/* Merge Option */}
                  <button
                    onClick={onMerge}
                    className="group relative flex items-start gap-4 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                      <GitMerge className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        Compare & Merge
                      </h3>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Manually select which sections to keep from each version
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                      Coming Soon
                    </span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Closing this dialog will keep the cloud version by default.
                </p>
                <Button variant="ghost" onClick={onClose}>
                  Keep Cloud Version
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Confirmation Dialog for Keep Local */}
          <AnimatePresence>
            {showConfirmation && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
                  onClick={handleCancelKeepLocal}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[60]"
                >
                  <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                    {/* Confirmation Header */}
                    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 px-6 py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            Overwrite Cloud Data?
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            This action cannot be undone
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Confirmation Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Archive className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            A backup will be created
                          </p>
                          <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
                            Your current cloud data will be backed up before being overwritten. You can restore it later if needed.
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        You are about to replace your cloud data with local changes from {localTimeAgo}.
                      </p>

                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={handleCancelKeepLocal}
                          disabled={isBackingUp}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleConfirmKeepLocal}
                          disabled={isBackingUp}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          {isBackingUp ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Backing up...
                            </>
                          ) : (
                            "Yes, Overwrite Cloud"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
