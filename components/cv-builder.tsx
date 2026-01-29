"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // If using zod validation later
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, Eye, PenTool } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export function CVBuilder() {
  const methods = useForm<CVData>({
    defaultValues: initialCVData,
    mode: "onChange",
  });

  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <FormProvider {...methods}>
      <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-muted/10">
        
        {/* Mobile Tab Toggle */}
        <div className="md:hidden flex border-b bg-background p-2 gap-2">
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

        {/* LEFT: Editor Panel */}
        <div
          className={cn(
            "w-full md:w-1/2 lg:w-5/12 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-8",
            activeTab === "preview" ? "hidden md:block" : "block"
          )}
        >
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-2xl font-bold tracking-tight">CV Editor</h2>
                 <div className="md:hidden">
                    {/* Placeholder for small screen actions */}
                 </div>
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
            "w-full md:w-1/2 lg:w-7/12 bg-gray-100/50 p-4 md:p-8 overflow-y-auto flex flex-col items-center",
            activeTab === "editor" ? "hidden md:flex" : "flex"
          )}
        >
          <div className="w-full max-w-[210mm] flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Live Preview</h2>
            {isClient && (
               <PreviewActionButtons control={methods.control} />
            )}
          </div>

          <div className="border shadow-2xl bg-white w-full max-w-[210mm] min-h-[297mm]">
            <LivePreviewWrapper />
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

// Separate component to use useWatch hook nicely
function LivePreviewWrapper() {
  const data = useWatch<CVData>();
  // We need to fallback to initial data structure if useWatch returns partial
  // (Though with FormProvider it usually returns full structure if defaultValues is set)
  return <CVPreview data={data as CVData} />;
}

// Download Button Component
function PreviewActionButtons({ control }: { control: any }) {
    // We watch data to re-render the PDF document when it changes
    const data = useWatch({ control });

    return (
        <PDFDownloadLink
            document={<PDFDocument data={data as CVData} />}
            fileName="cv.pdf"
        >
            {/* @ts-ignore - blob signature mismatch sometimes happens with react-pdf */}
            {({ loading }: { loading: boolean }) => (
                <Button disabled={loading}>
                    <FileDown className="w-4 h-4 mr-2" />
                    {loading ? "Preparing..." : "Download PDF"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
