"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData } from "@/lib/types";

export function ExperienceForm() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>

      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 border rounded-lg p-4 bg-muted/20"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">Job #{index + 1}</h4>
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
                <Label>Company</Label>
                <Controller
                  control={control}
                  name={`experience.${index}.company`}
                  render={({ field }) => (
                    <Input placeholder="Company Name" {...field} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Controller
                  control={control}
                  name={`experience.${index}.role`}
                  render={({ field }) => (
                    <Input placeholder="Job Title" {...field} />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Controller
                  control={control}
                  name={`experience.${index}.startDate`}
                  render={({ field }) => (
                    <Input placeholder="MM/YYYY" {...field} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Controller
                  control={control}
                  name={`experience.${index}.endDate`}
                  render={({ field }) => (
                    <Input placeholder="MM/YYYY" {...field} />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Controller
                control={control}
                name={`experience.${index}.description`}
                render={({ field }) => (
                  <Textarea
                    placeholder="Responsibilities and achievements..."
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
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No experience added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
