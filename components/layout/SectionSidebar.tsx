"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Trophy, 
  Languages, 
  Code2,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";

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
}

const sections = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "skills", label: "Skills", icon: Code2 },
];

export function SectionSidebar({ 
  className,
  isOpen = true,
  onToggle
}: SectionSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>("personal");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    const container = document.getElementById("editor-scroll-container");
    
    if (element && container) {
      // Calculate offset relative to container
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const offset = elementRect.top - containerRect.top + container.scrollTop - 20; // 20px padding

      container.scrollTo({
        top: offset,
        behavior: "smooth"
      });
      setActiveSection(id);
    } else if (element) {
        // Fallback to window scroll
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(id);
    }
  };

  // Scroll spy
  useEffect(() => {
    const container = document.getElementById("editor-scroll-container");
    const handleScroll = () => {
      // Use container scroll or window scroll
      const scrollPosition = container ? container.scrollTop + 100 : window.scrollY + 100;
      
      // If we are using a container, we need to calculate offsets relative to the container content start
      // But getElementById(id).offsetTop provides offset relative to closest positioned ancestor. 
      // Guaranteed to work if container is relative.
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
            // Simple check: is this section close to the top?
            // Since we are scrolling the container, we can check the element's position relative to viewport/container
            const rect = element.getBoundingClientRect();
            const containerRect = container ? container.getBoundingClientRect() : { top: 0, height: window.innerHeight };
            
            // If the element is near the top of the container (e.g., within top 30%)
            // Or if it's the first one and we are at top
            if (rect.top >= containerRect.top - 50 && rect.top < containerRect.top + containerRect.height / 2) {
                 setActiveSection(section.id);
                 break; 
            }
        }
      }
    };

    const target = container || window;
    target.addEventListener("scroll", handleScroll);
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.nav
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("shrink-0 relative group", className)}
        >
          <div className="w-64 pr-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                CV Sections
              </h3>
              {onToggle && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={onToggle}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors relative",
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute left-0 w-1 h-full bg-primary rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {section.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
      {!isOpen && onToggle && (
         <div className={cn("pt-6 px-2 hidden md:block", className ? "" : "")}> 
             {/* Use a wrapper or similar to position the open button */}
             <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="text-muted-foreground hover:text-primary"
                title="Open Sidebar"
             >
                <div className="rotate-180">
                    <ChevronLeft className="h-4 w-4" />
                </div>
             </Button>
         </div>
      )}
    </AnimatePresence>
  );
}
