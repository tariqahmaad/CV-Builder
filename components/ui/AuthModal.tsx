"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  User,
  Check,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
}

type AuthMode = "signin" | "signup" | "reset";

const features = [
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "AES-256 encryption for your data",
    color: "text-emerald-400",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Access from any device instantly",
    color: "text-amber-400",
  },
  {
    icon: Check,
    title: "ATS-Friendly Templates",
    description: "Pass resume screening systems",
    color: "text-blue-400",
  },
];

export function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  onResetPassword,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen && !isVisible) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6 && mode !== "reset") {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        await onSignIn(email, password);
        onClose();
      } else if (mode === "signup") {
        await onSignUp(email, password);
        onClose();
      } else if (mode === "reset") {
        await onResetPassword(email);
        setResetSent(true);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      // Prettify Firebase error messages
      if (errorMessage.includes("auth/invalid-credential")) {
        setError("Invalid email or password");
      } else if (errorMessage.includes("auth/email-already-in-use")) {
        setError("An account with this email already exists");
      } else if (errorMessage.includes("auth/weak-password")) {
        setError("Password is too weak. Use at least 6 characters");
      } else if (errorMessage.includes("auth/invalid-email")) {
        setError("Please enter a valid email address");
      } else if (errorMessage.includes("auth/user-not-found")) {
        setError("No account found with this email");
      } else if (errorMessage.includes("auth/too-many-requests")) {
        setError("Too many attempts. Please try again later");
      } else {
        setError("Something went wrong. Please try again.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setResetSent(false);
    if (newMode !== "reset") {
      setPassword("");
      setConfirmPassword("");
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setResetSent(false);
    setMode("signin");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case "signin":
        return "Welcome back";
      case "signup":
        return "Create your account";
      case "reset":
        return "Reset password";
      default:
        return "";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "signin":
        return "Sign in to continue building your professional CV";
      case "signup":
        return "Join thousands of professionals who trust our platform";
      case "reset":
        return "Enter your email and we'll send you a reset link";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "transition-all duration-300 ease-out",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop with enhanced blur */}
      <div
        className={cn(
          "absolute inset-0 bg-slate-950/60 backdrop-blur-sm",
          "transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          "relative w-full max-w-5xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden",
          "flex flex-col md:flex-row",
          "transform transition-all duration-300 ease-out",
          isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"
        )}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={cn(
            "absolute top-4 right-4 z-20 p-2 rounded-full",
            "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
            "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
            "border border-slate-200 dark:border-slate-700",
            "transition-all duration-200 hover:scale-105",
            "md:hidden"
          )}
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT PANE: Visual & Value Prop - Always Dark Theme */}
        <div className="hidden md:flex flex-col w-5/12 bg-slate-950 relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
            <div
              className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"
              style={{ transform: "translate(-50%, -50%)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
              style={{ transform: "translate(50%, 50%)" }}
            />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full p-8">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CV Pro</span>
            </div>

            {/* Main message */}
            <div className="my-auto">
              <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                Build your
                <br />
                professional future
              </h2>
              <p className="text-slate-400 text-sm">
                Create stunning, ATS-friendly resumes that get you hired faster.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mt-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <feature.icon className={cn("w-5 h-5", feature.color)} />
                  <div>
                    <p className="font-medium text-white text-sm">
                      {feature.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p className="mt-6 text-xs text-slate-600">
              © {new Date().getFullYear()} CV Pro. All rights reserved.
            </p>
          </div>
        </div>

        {/* RIGHT PANE: Form Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
          {/* Desktop close button */}
          <button
            onClick={handleClose}
            className={cn(
              "absolute top-4 right-4 z-20 p-2 rounded-full hidden md:flex",
              "text-slate-400 hover:text-white",
              "hover:bg-slate-800",
              "transition-all duration-200"
            )}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-2 p-6 pb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              CV Pro
            </span>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <div className="max-w-sm mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {getTitle()}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {getSubtitle()}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div
                  className={cn(
                    "mb-6 flex items-start gap-3 p-4 rounded-xl",
                    "bg-destructive/10 border border-destructive/30",
                    "animate-in fade-in slide-in-from-top-2 duration-200"
                  )}
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-destructive">
                    {error}
                  </span>
                </div>
              )}

              {/* Success Alert */}
              {resetSent && (
                <div
                  className={cn(
                    "mb-6 flex items-start gap-3 p-4 rounded-xl",
                    "bg-success/10 border border-success/30",
                    "animate-in fade-in slide-in-from-top-2 duration-200"
                  )}
                  role="alert"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-success">
                    Password reset email sent! Check your inbox for further
                    instructions.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className={cn(
                        "block w-full pl-10 pr-3 py-2.5 rounded-lg",
                        "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600",
                        "text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500",
                        "transition-all duration-200"
                      )}
                    />
                  </div>
                </div>

                {/* Password Field */}
                {mode !== "reset" && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() => switchMode("reset")}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password (min 6 characters)"
                        required
                        minLength={6}
                        className={cn(
                          "block w-full pl-10 pr-10 py-2.5 rounded-lg",
                          "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600",
                          "text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400",
                          "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500",
                          "transition-all duration-200"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {mode === "signup" && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Must be at least 6 characters
                      </p>
                    )}
                  </div>
                )}

                {/* Confirm Password Field */}
                {mode === "signup" && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Confirm password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        required
                        minLength={6}
                        className={cn(
                          "block w-full pl-10 pr-10 py-2.5 rounded-lg",
                          "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600",
                          "text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400",
                          "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500",
                          "transition-all duration-200"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || (mode === "reset" && resetSent)}
                  className={cn(
                    "w-full py-5 text-sm font-semibold rounded-lg",
                    "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
                    "text-white",
                    "transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "shadow-lg shadow-indigo-500/25"
                  )}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : mode === "signin" ? (
                    "Sign in"
                  ) : mode === "signup" ? (
                    "Create account"
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              {/* Divider */}
              {mode !== "reset" && (
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                      {mode === "signin" ? "New to CV Pro?" : "Already have an account?"}
                    </span>
                  </div>
                </div>
              )}

              {/* Mode Switch */}
              <div className="text-center">
                {mode === "signin" ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : mode === "signup" ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className={cn(
                      "flex items-center justify-center w-full gap-2 px-4 py-2.5 text-sm font-medium rounded-lg",
                      "text-slate-900 dark:text-white",
                      "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700",
                      "transition-colors"
                    )}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </button>
                )}
              </div>

              {/* Terms */}
              {mode === "signup" && (
                <p className="mt-6 text-xs text-center text-slate-500 dark:text-slate-400">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
