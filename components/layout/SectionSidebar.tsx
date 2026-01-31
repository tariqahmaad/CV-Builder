"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Trophy,
  Languages,
  Code2,
  ChevronLeft,
  PanelLeft,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CVData } from "@/lib/types";

export type SectionId =
  | "personal"
  | "experience"
  | "education"
  | "projects"
  | "achievements"
  | "languages"
  | "skills";

interface SectionSidebarProps {
  activeSection?: SectionId;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  data?: CVData;
}

interface Section {
  id: SectionId;
  label: string;
  icon: React.ElementType;
}

const sections: Section[] = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "skills", label: "Skills", icon: Code2 },
];

// Professional color palette using CSS variables for consistency
const sectionColors: Record<SectionId, { primary: string; light: string; bg: string; border: string; shadow: string; glow: string }> = {
  personal: { 
    primary: "hsl(var(--color-section-personal))", 
    light: "hsl(var(--color-section-personal) / 0.7)", 
    bg: "hsl(var(--color-section-personal) / 0.08)", 
    border: "hsl(var(--color-section-personal) / 0.2)", 
    shadow: "hsl(var(--color-section-personal) / 0.15)", 
    glow: "hsl(var(--color-section-personal) / 0.3)" 
  },
  experience: { 
    primary: "hsl(var(--color-section-experience))", 
    light: "hsl(var(--color-section-experience) / 0.7)", 
    bg: "hsl(var(--color-section-experience) / 0.08)", 
    border: "hsl(var(--color-section-experience) / 0.2)", 
    shadow: "hsl(var(--color-section-experience) / 0.15)", 
    glow: "hsl(var(--color-section-experience) / 0.3)" 
  },
  education: { 
    primary: "hsl(var(--color-section-education))", 
    light: "hsl(var(--color-section-education) / 0.7)", 
    bg: "hsl(var(--color-section-education) / 0.08)", 
    border: "hsl(var(--color-section-education) / 0.2)", 
    shadow: "hsl(var(--color-section-education) / 0.15)", 
    glow: "hsl(var(--color-section-education) / 0.3)" 
  },
  projects: { 
    primary: "hsl(var(--color-section-projects))", 
    light: "hsl(var(--color-section-projects) / 0.7)", 
    bg: "hsl(var(--color-section-projects) / 0.08)", 
    border: "hsl(var(--color-section-projects) / 0.2)", 
    shadow: "hsl(var(--color-section-projects) / 0.15)", 
    glow: "hsl(var(--color-section-projects) / 0.3)" 
  },
  achievements: { 
    primary: "hsl(var(--color-section-achievements))", 
    light: "hsl(var(--color-section-achievements) / 0.7)", 
    bg: "hsl(var(--color-section-achievements) / 0.08)", 
    border: "hsl(var(--color-section-achievements) / 0.2)", 
    shadow: "hsl(var(--color-section-achievements) / 0.15)", 
    glow: "hsl(var(--color-section-achievements) / 0.3)" 
  },
  languages: { 
    primary: "hsl(var(--color-section-languages))", 
    light: "hsl(var(--color-section-languages) / 0.7)", 
    bg: "hsl(var(--color-section-languages) / 0.08)", 
    border: "hsl(var(--color-section-languages) / 0.2)", 
    shadow: "hsl(var(--color-section-languages) / 0.15)", 
    glow: "hsl(var(--color-section-languages) / 0.3)" 
  },
  skills: { 
    primary: "hsl(var(--color-section-skills))", 
    light: "hsl(var(--color-section-skills) / 0.7)", 
    bg: "hsl(var(--color-section-skills) / 0.08)", 
    border: "hsl(var(--color-section-skills) / 0.2)", 
    shadow: "hsl(var(--color-section-skills) / 0.15)", 
    glow: "hsl(var(--color-section-skills) / 0.3)" 
  },
};

// Menu width constant
const MENU_WIDTH = 280;

// Helper function to check if a section has content
function hasSectionContent(sectionId: SectionId, data?: CVData): boolean {
  if (!data) return false;

  switch (sectionId) {
    case "personal":
      return Object.values(data.personalInfo).some(value =>
        typeof value === "string" && value.trim().length > 0
      );
    case "experience":
      return data.experience.length > 0;
    case "education":
      return data.education.length > 0;
    case "projects":
      return data.projects.length > 0;
    case "achievements":
      return data.achievements.length > 0;
    case "languages":
      return data.languages.length > 0;
    case "skills":
      return data.skills.length > 0;
    default:
      return false;
  }
}

export function SectionSidebar({
  className,
  isOpen = true,
  onToggle,
  data
}: SectionSidebarProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [hoveredSection, setHoveredSection] = useState<SectionId | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const isManualScrolling = useRef(false);
  const manualScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const scrollToSection = useCallback((id: SectionId) => {
    const element = document.getElementById(id);
    const container = document.getElementById("editor-scroll-container");

    // Clear any existing timeout and set manual scrolling flag
    if (manualScrollTimeout.current) {
      clearTimeout(manualScrollTimeout.current);
    }
    isManualScrolling.current = true;

    if (element && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const offset = elementRect.top - containerRect.top + container.scrollTop - 24;
      container.scrollTo({ top: offset, behavior: prefersReducedMotion ? "auto" : "smooth" });
      setActiveSection(id);
    } else if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      setActiveSection(id);
    }

    // Clear the manual scrolling flag after scroll animation completes
    manualScrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, prefersReducedMotion ? 0 : 600);
  }, [prefersReducedMotion]);

  // Optimized Intersection Observer for scroll spy
  useEffect(() => {
    const container = document.getElementById("editor-scroll-container");
    if (!container) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Skip observer updates during manual scroll operations
      if (isManualScrolling.current) return;

      // Filter to valid, intersecting sections with adequate visibility
      const validEntries = entries.filter(
        (entry) =>
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.1 &&
          sections.some((s) => s.id === entry.target.id)
      );

      if (validEntries.length === 0) return;

      // Select the entry with highest intersection ratio (most visible)
      // If tie, use the one closer to viewport center
      const bestEntry = validEntries.reduce((best, current) => {
        if (current.intersectionRatio > best.intersectionRatio) {
          return current;
        }
        if (current.intersectionRatio === best.intersectionRatio) {
          // Calculate distance from center of detection zone
          const container = document.getElementById("editor-scroll-container");
          if (container) {
            const containerCenter = container.clientHeight / 2;
            const bestRect = best.target.getBoundingClientRect();
            const currentRect = current.target.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const bestCenter = bestRect.top + bestRect.height / 2 - containerRect.top;
            const currentCenter = currentRect.top + currentRect.height / 2 - containerRect.top;
            return Math.abs(currentCenter - containerCenter) < Math.abs(bestCenter - containerCenter)
              ? current
              : best;
          }
        }
        return best;
      });

      setActiveSection(bestEntry.target.id as SectionId);
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: container,
      threshold: [0, 0.25, 0.5, 0.75],
      rootMargin: "-20% 0px -20% 0px"
    });

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      if (manualScrollTimeout.current) {
        clearTimeout(manualScrollTimeout.current);
      }
    };
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (index < sections.length - 1) {
          setFocusedIndex(index + 1);
          itemRefs.current[index + 1]?.focus();
        } else {
          setFocusedIndex(0);
          itemRefs.current[0]?.focus();
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (index > 0) {
          setFocusedIndex(index - 1);
          itemRefs.current[index - 1]?.focus();
        } else {
          setFocusedIndex(sections.length - 1);
          itemRefs.current[sections.length - 1]?.focus();
        }
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        itemRefs.current[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(sections.length - 1);
        itemRefs.current[sections.length - 1]?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        scrollToSection(sections[index].id);
        break;
      case "Escape":
        if (onToggle && isOpen) {
          e.preventDefault();
          onToggle();
        }
        break;
    }
  }, [isOpen, onToggle, scrollToSection]);

  // Calculate progress based on sections that have content
  const completedSectionsCount = sections.filter(s => hasSectionContent(s.id, data)).length;
  const progress = Math.round((completedSectionsCount / sections.length) * 100);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.nav
          ref={navRef}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: MENU_WIDTH, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0 : 0.4, 
            ease: [0.32, 0.72, 0, 1] 
          }}
          className={cn("shrink-0 relative overflow-hidden", className)}
          aria-label="CV Sections Navigation"
          role="navigation"
        >
          <div className="relative w-full h-full">
            {/* Glassmorphism card background */}
            <div
              className="absolute inset-0 rounded-2xl border bg-card/95 backdrop-blur-sm shadow-xl"
              style={{
                borderColor: "hsl(var(--border) / 0.4)",
                boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
              }}
            />

            <div className="relative h-full flex flex-col">
              {/* Elegant header */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.15, duration: 0.35, ease: "easeOut" }}
                className="flex items-center justify-between px-5 pt-5 pb-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-primary via-primary/80 to-primary/60" />
                  <span className="text-[11px] font-semibold text-foreground/70 uppercase tracking-[0.2em]">
                    Sections
                  </span>
                </div>
                {onToggle && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                    onClick={onToggle}
                    aria-label="Collapse sidebar"
                  >
                    <motion.div
                      whileHover={{ rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </motion.div>
                  </Button>
                )}
              </motion.div>

              {/* Progress bar */}
              <div className="px-5 pb-3">
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="px-5">
                <div className="h-px bg-gradient-to-r from-border via-muted to-transparent" />
              </div>

              {/* Menu items */}
              <motion.div
                className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  staggerChildren: prefersReducedMotion ? 0 : 0.04, 
                  delayChildren: prefersReducedMotion ? 0 : 0.1 
                }}
                role="tablist"
                aria-orientation="vertical"
              >
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  const isHovered = hoveredSection === section.id;
                  const isVisited = hasSectionContent(section.id, data);
                  const colors = sectionColors[section.id];

                  return (
                    <motion.button
                      key={section.id}
                      ref={(el) => { itemRefs.current[index] = el; }}
                      onClick={() => scrollToSection(section.id)}
                      onMouseEnter={() => setHoveredSection(section.id)}
                      onMouseLeave={() => setHoveredSection(null)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className={cn(
                        "group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left mb-1",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                        "transition-colors duration-200",
                        isActive ? "focus-visible:ring-primary/50" : "focus-visible:ring-muted-foreground/30"
                      )}
                      style={{
                        backgroundColor: isActive ? colors.bg : "transparent",
                        boxShadow: isActive ? `0 2px 8px ${colors.shadow}, 0 0 0 1px ${colors.border}` : "none"
                      }}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`section-${section.id}`}
                      tabIndex={focusedIndex === index ? 0 : -1}
                      whileHover={prefersReducedMotion ? {} : { x: 3 }}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.995 }}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: prefersReducedMotion ? 0 : index * 0.04,
                        duration: prefersReducedMotion ? 0 : 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                    >
                      {/* Left accent bar */}
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: isActive ? 24 : isHovered ? 16 : 0, 
                          opacity: isActive || isHovered ? 1 : 0 
                        }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        style={{
                          width: isActive ? 3 : 2,
                          backgroundColor: colors.primary,
                          boxShadow: isActive ? `0 0 10px ${colors.glow}` : "none"
                        }}
                      />

                      {/* Icon container */}
                      <div
                        className={cn(
                          "relative flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all duration-200",
                          isActive ? "bg-white/60" : isHovered ? "bg-muted" : "bg-transparent"
                        )}
                        style={{
                          boxShadow: isActive ? `0 1px 3px ${colors.shadow}` : "none"
                        }}
                      >
                        <Icon
                          className="w-[18px] h-[18px]"
                          style={{
                            color: isActive ? colors.primary : isHovered ? colors.light : "hsl(var(--muted-foreground))",
                            filter: isActive ? `drop-shadow(0 1px 1px ${colors.shadow})` : "none"
                          }}
                          aria-hidden="true"
                        />
                      </div>

                      {/* Label */}
                      <span
                        className={cn(
                          "relative flex-1 text-[13px] tracking-wide transition-all duration-200",
                          isActive ? "font-semibold" : "font-medium",
                          isActive ? "text-foreground" : isHovered ? "text-foreground/70" : "text-foreground/60"
                        )}
                      >
                        {section.label}
                      </span>

                      {/* Status indicator */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isVisited && !isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-4 h-4 rounded-full bg-muted flex items-center justify-center"
                          >
                            <Check className="w-2.5 h-2.5 text-foreground/50" />
                          </motion.div>
                        )}
                        
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: colors.primary,
                              boxShadow: `0 0 6px ${colors.glow}`
                            }}
                          />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Bottom section */}
              <div className="px-5 pb-5 pt-2">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

                {/* Progress indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-foreground/60 uppercase tracking-wider">
                    CV Builder
                  </span>
                  <motion.div
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-success"
                      style={{ boxShadow: "0 0 8px hsl(var(--success) / 0.6)" }}
                    />
                    <span className="text-[10px] text-foreground/60 font-medium">
                      {progress}%
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.nav>
      )}
      
      {/* Collapsed state toggle button */}
      {!isOpen && onToggle && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: -10 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={cn("pt-4 px-2 hidden md:block", className)}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card hover:shadow-md border border-transparent hover:border-border transition-all duration-200"
            aria-label="Expand sidebar"
            aria-expanded="false"
          >
            <motion.div
              whileHover={{ rotate: 90, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <PanelLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
