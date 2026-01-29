"use client";

import React from "react";
import { useFieldArray, useFormContext, Controller, Control, UseFieldArrayRemove } from "react-hook-form";
import { Plus, GripVertical, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData, Skill } from "@/lib/types";

import { Reorder, useDragControls, AnimatePresence, motion } from "framer-motion";

export function SkillsForm() {
  const { control } = useFormContext<CVData>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "skills",
    keyName: "_id",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <Reorder.Group 
          axis="y"
          values={fields} 
          onReorder={(newFields) => replace(newFields)}
          className="space-y-4"
        >
          {fields.map((field, index) => (
            <SkillItem
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

function SkillItem({
  field,
  index,
  remove,
  control,
}: {
  field: Skill;
  index: number;
  remove: UseFieldArrayRemove;
  control: Control<CVData>;
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
      className="grid gap-3 p-4 border rounded-lg relative bg-card text-card-foreground shadow-sm"
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="flex justify-between items-start">
         <div className="flex items-center gap-2 mb-2">
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
          <span className="text-sm font-semibold text-muted-foreground">
            {field.name ? field.name : `Skill #${index + 1}`}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 h-6 w-6"
          onClick={() => remove(index)}
        >
          <X className="h-4 w-4" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
