"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData } from "@/lib/types";

export function LanguagesForm() {
  const { register, control } = useFormContext<CVData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Languages</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              name: "",
              proficiency: "",
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">
              <div className="flex-1">
                 <Input
                    {...register(`languages.${index}.name`)}
                    placeholder="Language (e.g. English)"
                 />
              </div>
               <div className="flex-1">
                 <Input
                    {...register(`languages.${index}.proficiency`)}
                    placeholder="Proficiency (e.g. Fluent)"
                 />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add languages you speak.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
