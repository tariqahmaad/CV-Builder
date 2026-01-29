"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData } from "@/lib/types";

export function SkillsForm() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skills</CardTitle>

      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid gap-3 p-4 border rounded-lg relative bg-card text-card-foreground shadow-sm"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 h-6 w-6"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Skill Name
                  </label>
                  <Controller
                    control={control}
                    name={`skills.${index}.name`}
                    render={({ field }) => (
                      <Input placeholder="e.g. Languages" {...field} />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Category
                  </label>
                  <Controller
                    control={control}
                    name={`skills.${index}.category`}
                    render={({ field }) => (
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="technical">Technical Skill</option>
                        <option value="professional">
                          Professional Attribute
                        </option>
                      </select>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description / Values
                </label>
                <Controller
                  control={control}
                  name={`skills.${index}.description`}
                  render={({ field }) => (
                    <Input placeholder="e.g. Python, Java, C++" {...field} />
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full mt-4"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              name: "",
              description: "",
              category: "technical",
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add your key skills (languages, tools, soft skills)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
