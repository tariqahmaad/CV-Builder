"use client";

import React from "react";
import { useFieldArray, useFormContext, Controller, Control, UseFieldArrayRemove } from "react-hook-form";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData, Education } from "@/lib/types";

import { Reorder, useDragControls, AnimatePresence, motion } from "framer-motion";

export function EducationForm() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "education",
    keyName: "_id",
  });
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const handleAdd = () => {
    append({
      id: crypto.randomUUID(),
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setExpandedIndex(fields.length);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Reorder.Group 
          axis="y" 
          values={fields} 
          onReorder={(newFields) => replace(newFields)}
          className="space-y-6"
        >
          {fields.map((field, index) => (
            <EducationItem
              key={field.id}
              field={field}
              index={index}
              remove={remove}
              control={control}
              isExpanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            />
          ))}
        </Reorder.Group>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleAdd}
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

function EducationItem({
  field,
  index,
  remove,
  control,
  isExpanded,
  onToggle,
}: {
  field: Education;
  index: number;
  remove: UseFieldArrayRemove;
  control: Control<CVData>;
  isExpanded: boolean;
  onToggle: () => void;
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
      className="space-y-4 border rounded-lg p-4 bg-muted/20 relative"
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="p-1 h-auto"
            onClick={onToggle}
          >
             {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold">
              {field.school ? `${field.school} ${field.degree ? `- ${field.degree}` : ''}` : `School #${index + 1}`}
            </h4>
          </div>
        </div>
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

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School/University</Label>
                  <Controller
                    control={control}
                    name={`education.${index}.school`}
                    render={({ field }) => (
                      <Input placeholder="University or school name" {...field} />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Controller
                    control={control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <Input placeholder="Degree or certificate earned" {...field} />
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
                      <Input placeholder="MM/YYYY or Present" {...field} />
                    )}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
