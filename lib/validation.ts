import { z } from "zod";

// Personal Info Schema
export const PersonalInfoSchema = z.object({
  fullName: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  address: z.string().default(""),
  jobTitle: z.string().default(""),
  summary: z.string().default(""),
  website: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  github: z.string().optional().default(""),
});

// Experience Schema
export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().default(""),
  role: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
});

// Education Schema
export const EducationSchema = z.object({
  id: z.string(),
  school: z.string().default(""),
  degree: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  description: z.string().default(""),
});

// Project Schema
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  date: z.string().default(""),
  techStack: z.string().default(""),
  description: z.string().default(""),
});

// Achievement Schema
export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  organization: z.string().default(""),
  date: z.string().default(""),
});

// Language Schema
export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  proficiency: z.string().default(""),
});

// Skill Schema
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  description: z.string().optional().default(""),
  category: z.enum(["technical", "professional"]).optional(),
});

// Full CV Data Schema
export const CVDataSchema = z.object({
  personalInfo: PersonalInfoSchema.default({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    jobTitle: "",
    summary: "",
    website: "",
    linkedin: "",
    github: "",
  }),
  experience: z.array(ExperienceSchema).default([]),
  education: z.array(EducationSchema).default([]),
  projects: z.array(ProjectSchema).default([]),
  achievements: z.array(AchievementSchema).default([]),
  languages: z.array(LanguageSchema).default([]),
  skills: z.array(SkillSchema).default([]),
  references: z.string().default("Available upon request."),
});

// Type inference from schema
export type ValidatedCVData = z.infer<typeof CVDataSchema>;

/**
 * Validates and sanitizes CV data from external sources (e.g., Firestore).
 * Returns validated data with defaults for missing fields, or null if validation fails.
 */
export function validateCVData(data: unknown): ValidatedCVData | null {
  try {
    const result = CVDataSchema.safeParse(data);
    if (result.success) {
      return result.data;
    }
    console.error("CV data validation failed:", result.error.issues);
    return null;
  } catch (error) {
    console.error("CV data validation error:", error);
    return null;
  }
}

/**
 * Validates CV data and returns it with defaults filled in.
 * Throws an error if the data is fundamentally invalid.
 */
export function parseAndValidateCVData(data: unknown): ValidatedCVData {
  return CVDataSchema.parse(data);
}
