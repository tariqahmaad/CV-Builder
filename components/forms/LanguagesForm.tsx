"use client";

import { useFieldArray, useFormContext, Controller, Control, UseFieldArrayRemove } from "react-hook-form";
import { Plus, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData, Language } from "@/lib/types";

import { Reorder, useDragControls } from "framer-motion";

export function LanguagesForm() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "languages",
    keyName: "_id",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <Reorder.Group 
          axis="y" 
          values={fields} 
          onReorder={(newFields) => replace(newFields)}
          className="space-y-4"
        >
          {fields.map((field, index) => (
            <LanguageItem
              key={field.id}
              field={field}
              index={index}
              remove={remove}
              control={control}
            />
          ))}
        </Reorder.Group>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full mt-4"
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
        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add languages you speak.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function LanguageItem({
  field,
  index,
  remove,
  control,
}: {
  field: Language;
  index: number;
  remove: UseFieldArrayRemove;
  control: Control<CVData>;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={field}
      id={field.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileDrag={{ scale: 1.02, zIndex: 50, cursor: "grabbing", boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      layout
      className="flex gap-2 items-center bg-muted/20 p-2 rounded-md"
      dragListener={false}
      dragControls={dragControls}
    >
      <div
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded self-center"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="flex-1">
        <Controller
          control={control}
          name={`languages.${index}.name`}
          render={({ field }) => (
            <Input placeholder="Language" {...field} />
          )}
        />
      </div>
      <div className="flex-1">
        <Controller
          control={control}
          name={`languages.${index}.proficiency`}
          render={({ field }) => (
            <Input placeholder="Proficiency level" {...field} />
          )}
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
    </Reorder.Item>
  );
}
