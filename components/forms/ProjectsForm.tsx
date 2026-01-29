"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData } from "@/lib/types";

export function ProjectsForm() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projects</CardTitle>

      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 border rounded-lg p-4 bg-muted/20"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">Project #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Controller
                  control={control}
                  name={`projects.${index}.title`}
                  render={({ field }) => (
                    <Input
                      placeholder="Personal Budget Application"
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Date/Duration</Label>
                <Controller
                  control={control}
                  name={`projects.${index}.date`}
                  render={({ field }) => (
                    <Input placeholder="Sep 2024 – July 2025" {...field} />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tech Stack / Skills Used</Label>
              <Controller
                control={control}
                name={`projects.${index}.techStack`}
                render={({ field }) => (
                  <Input
                    placeholder="Skill: React Native, Firebase..."
                    {...field}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Controller
                control={control}
                name={`projects.${index}.description`}
                render={({ field }) => (
                  <Textarea
                    placeholder="Brief description of the project..."
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              title: "",
              date: "",
              techStack: "",
              description: "",
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No projects added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
