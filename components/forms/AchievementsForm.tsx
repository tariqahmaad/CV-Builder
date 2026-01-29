"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData } from "@/lib/types";

export function AchievementsForm() {
  const { register, control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Achievements & Certifications</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              title: "",
              organization: "",
              date: "",
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 border rounded-lg p-4 bg-muted/20">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">Achievement #{index + 1}</h4>
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
                <Label>Title</Label>
                <Input {...register(`achievements.${index}.title`)} placeholder="IELTS – Overall Band: 6.0" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input {...register(`achievements.${index}.date`)} placeholder="Feb 2025" />
              </div>
            </div>
             <div className="space-y-2">
                <Label>Organization / Details</Label>
                <Input {...register(`achievements.${index}.organization`)} placeholder="IDP Education" />
              </div>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No achievements added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
