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
                <Input id="fullName" placeholder="Tariq Ahmad" {...field} />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title (Optional)</Label>
            <Controller
              control={control}
              name="personalInfo.jobTitle"
              render={({ field }) => (
                <Input id="jobTitle" placeholder="" {...field} />
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
                  placeholder="tariq@example.com"
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
                  placeholder="+90 53 454 ..."
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
                placeholder="Istanbul, Turkey"
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
                  placeholder="linkedin.com/in/..."
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
                  placeholder="github.com/..."
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
                  placeholder="tariqahmad.dev"
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
                placeholder="Ambitious Computer Engineering student..."
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
