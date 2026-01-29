"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData } from "@/lib/types";

export function EducationForm() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>

      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 border rounded-lg p-4 bg-muted/20"
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">School #{index + 1}</h4>
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
                <Label>School/University</Label>
                <Controller
                  control={control}
                  name={`education.${index}.school`}
                  render={({ field }) => (
                    <Input placeholder="University Name" {...field} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Degree</Label>
                <Controller
                  control={control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <Input placeholder="Bachelor's in..." {...field} />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Controller
                  control={control}
                  name={`education.${index}.startDate`}
                  render={({ field }) => (
                    <Input placeholder="MM/YYYY" {...field} />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Controller
                  control={control}
                  name={`education.${index}.endDate`}
                  render={({ field }) => (
                    <Input placeholder="MM/YYYY" {...field} />
                  )}
                />
              </div>
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
              school: "",
              degree: "",
              startDate: "",
              endDate: "",
              description: "",
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No education added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
