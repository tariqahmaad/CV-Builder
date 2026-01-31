"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  ChevronDown,
  Settings,
  FileText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";

interface UserMenuProps {
  user: FirebaseUser;
  onSignOut: () => Promise<void>;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const getUserInitials = () => {
    if (user.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user.displayName) {
      return user.displayName;
    }
    if (user.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full",
          "bg-slate-800 hover:bg-slate-700",
          "border border-slate-700 hover:border-slate-600",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-indigo-400/30",
          isOpen && "ring-2 ring-indigo-400/30 bg-slate-700 border-slate-600"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
            "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
          )}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getUserInitials()
          )}
        </div>

        {/* Name - hidden on small screens */}
        <span className="hidden sm:block text-sm font-medium text-slate-200 max-w-[120px] truncate">
          {getUserDisplayName()}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={cn(
          "absolute right-0 mt-2 w-64 rounded-xl",
          "bg-slate-900 dark:bg-slate-950",
          "border border-slate-700 dark:border-slate-800",
          "shadow-xl shadow-black/30",
          "transform origin-top-right",
          "transition-all duration-200 ease-out",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        )}
      >
        {/* User Info Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                "bg-gradient-to-br from-indigo-400 to-purple-500 text-white"
              )}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getUserInitials()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Account
          </div>

          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
              "text-sm text-slate-300",
              "hover:bg-slate-800 hover:text-white",
              "transition-colors"
            )}
            onClick={() => setIsOpen(false)}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            My Resumes
          </button>

          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
              "text-sm text-slate-300",
              "hover:bg-slate-800 hover:text-white",
              "transition-colors"
            )}
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            Settings
          </button>

          <div className="my-2 border-t border-slate-800" />

          <button
            onClick={async () => {
              setIsOpen(false);
              await onSignOut();
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg",
              "text-sm text-red-400",
              "hover:bg-red-950/50",
              "transition-colors"
            )}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        {/* Pro Badge */}
        <div className="p-3 bg-slate-800/50 rounded-b-xl border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-medium text-slate-300">
              Free Plan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
