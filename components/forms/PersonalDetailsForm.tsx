"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData } from "@/lib/types";

export function PersonalDetailsForm() {
  const { register } = useFormContext<CVData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Tariq Ahmad"
              {...register("personalInfo.fullName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title (Optional)</Label>
            <Input
              id="jobTitle"
              placeholder=""
              {...register("personalInfo.jobTitle")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tariq@example.com"
              {...register("personalInfo.email")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+90 53 454 ..."
              {...register("personalInfo.phone")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address (City, Country)</Label>
          <Input
            id="address"
            placeholder="Istanbul, Turkey"
            {...register("personalInfo.address")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              placeholder="linkedin.com/in/..."
              {...register("personalInfo.linkedin")}
            />
          </div>
           <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              placeholder="github.com/..."
              {...register("personalInfo.github")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Portfolio URL</Label>
            <Input
              id="website"
              placeholder="tariqahmad.dev"
              {...register("personalInfo.website")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Career Objective / Summary</Label>
          <Textarea
            id="summary"
            placeholder="Ambitious Computer Engineering student..."
            className="min-h-[100px]"
            {...register("personalInfo.summary")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
