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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Match transition duration
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Modern Premium Layout
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container - Dual Pane */}
      <div
        className={cn(
          "relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 scale-95",
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        {/* Close Button (Absolute) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT PANE: Visual & Value Prop (Hidden on small mobile) */}
        <div className="hidden md:flex flex-col justify-between w-full md:w-5/12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

          {/* Logo / Brand */}
          <div className="relative z-10">
            <div className="bg-white/20 p-2 w-fit rounded-xl backdrop-blur-md mb-6">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Build Your Future</h2>
            <p className="text-blue-100">
              Create a professional CV that stands out in minutes.
            </p>
          </div>

          {/* Features List */}
          <div className="relative z-10 space-y-4 mt-8">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-5 h-5 text-blue-200" />
              <div>
                <p className="font-semibold text-sm">Secure Storage</p>
                <p className="text-xs text-blue-200">
                  Your data is encrypted and safe
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <Zap className="w-5 h-5 text-yellow-200" />
              <div>
                <p className="font-semibold text-sm">Instant Sync</p>
                <p className="text-xs text-blue-200">
                  Access from any device, anytime
                </p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="relative z-10 mt-8 text-xs text-blue-200/80">
            © {new Date().getFullYear()} CV Generator. Start your journey today.
          </div>
        </div>

        {/* RIGHT PANE: Form Area */}
        <div className="w-full md:w-7/12 p-6 md:p-12 bg-white dark:bg-gray-900 overflow-y-auto">
          <div className="max-w-sm mx-auto flex flex-col justify-center h-full min-h-[400px]">
            {/* Header Content */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {mode === "signin" && "Welcome Back"}
                {mode === "signup" && "Create an Account"}
                {mode === "reset" && "Reset Password"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {mode === "signin" && "Enter your details to access your account"}
                {mode === "signup" && "Join thousands of professionals today"}
                {mode === "reset" &&
                  "Enter your email and we'll send you a link"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message (Password Reset) */}
            {resetSent && (
              <div
                className="mb-6 flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm animate-in fade-in slide-in-from-top-2"
                role="alert"
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  Password reset email sent! Please check your inbox and follow
                  the instructions.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className={cn(
                      "block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl",
                      "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                      "bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                      "transition-all duration-200"
                    )}
                  />
                </div>
              </div>

              {/* Password Field */}
              {mode !== "reset" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => switchMode("reset")}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className={cn(
                        "block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl",
                        "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                        "bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                        "transition-all duration-200"
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Confirm Password (Sign Up) */}
              {mode === "signup" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className={cn(
                        "block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl",
                        "text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500",
                        "bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                        "transition-all duration-200"
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || (mode === "reset" && resetSent)}
                  className={cn(
                    "w-full py-6 text-base font-semibold shadow-lg shadow-blue-500/25",
                    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                    "transition-all duration-300 transform hover:-translate-y-0.5"
                  )}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : mode === "signin" ? (
                    "Sign In"
                  ) : mode === "signup" ? (
                    "Create Account"
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                  {mode === "reset" ? "Or go back to" : "Or"}
                </span>
              </div>
            </div>

            <div className="text-center">
              {mode === "signin" ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline transition-all"
                  >
                    Sign up now
                  </button>
                </p>
              ) : mode === "signup" ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline transition-all"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
