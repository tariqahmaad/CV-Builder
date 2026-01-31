"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CVData } from "@/lib/types";

export function PersonalDetailsForm() {
  const { control } = useFormContext<CVData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Controller
              control={control}
              name="personalInfo.fullName"
              render={({ field }) => (
                <Input id="fullName" placeholder="Your full name" {...field} />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title (Optional)</Label>
            <Controller
              control={control}
              name="personalInfo.jobTitle"
              render={({ field }) => (
                <Input id="jobTitle" placeholder="Your job title" {...field} />
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Controller
              control={control}
              name="personalInfo.email"
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Controller
              control={control}
              name="personalInfo.phone"
              render={({ field }) => (
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address (City, Country)</Label>
          <Controller
            control={control}
            name="personalInfo.address"
            render={({ field }) => (
              <Input
                id="address"
                placeholder="City, Country"
                {...field}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Controller
              control={control}
              name="personalInfo.linkedin"
              render={({ field }) => (
                <Input
                  id="linkedin"
                  placeholder="linkedin.com/in/username"
                  {...field}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Controller
              control={control}
              name="personalInfo.github"
              render={({ field }) => (
                <Input
                  id="github"
                  placeholder="github.com/username"
                  {...field}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Portfolio URL</Label>
            <Controller
              control={control}
              name="personalInfo.website"
              render={({ field }) => (
                <Input
                  id="website"
                  placeholder="yourwebsite.com"
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Career Objective / Summary</Label>
          <Controller
            control={control}
            name="personalInfo.summary"
            render={({ field }) => (
              <Textarea
                id="summary"
                placeholder="Brief summary of your experience and career goals"
                className="min-h-[100px]"
                {...field}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
