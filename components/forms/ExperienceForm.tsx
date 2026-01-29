"use client";

import React from "react";
import { useFieldArray, useFormContext, Controller, Control, UseFieldArrayRemove } from "react-hook-form";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData, Experience } from "@/lib/types";

import { Reorder, useDragControls, AnimatePresence, motion } from "framer-motion";

export function ExperienceForm() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "experience",
    keyName: "_id",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Reorder.Group 
          axis="y" 
          values={fields} 
          onReorder={(newFields) => replace(newFields)}
          className="space-y-6"
        >
          {fields.map((field, index) => (
            <ExperienceItem 
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

function ExperienceItem({ 
  field, 
  index, 
  remove, 
  control 
}: { 
  field: Experience, 
  index: number, 
  remove: UseFieldArrayRemove, 
  control: Control<CVData> 
}) {
  const dragControls = useDragControls();
  const [isExpanded, setIsExpanded] = React.useState(false);

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
            onClick={() => setIsExpanded(!isExpanded)}
          >
             {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <div className="flex flex-col">
            <h4 className="text-sm font-semibold">
              {field.company ? `${field.company} ${field.role ? `- ${field.role}` : ''}` : `Job #${index + 1}`}
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
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
