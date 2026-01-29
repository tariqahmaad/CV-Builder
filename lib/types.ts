export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  summary: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  date: string;
  techStack: string; // "Skill: React, ..."
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // "Native", "Fluent", etc.
}

// Keeping Skills simple for now, but maybe splitting into categories later if needed
export interface Skill {
  id: string;
  name: string;
  description?: string; // The skill values like "C, C++, Java, Python"
  category?: 'technical' | 'professional'; // "Technical Skills" or "Professional Attributes"
}

export interface CVData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  achievements: Achievement[];
  languages: Language[];
  skills: Skill[]; // We can use this for "Technical Skills" list
  references: string; // "Available upon request" etc.
}

export const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    jobTitle: "",
    summary: "",
    linkedin: "",
    github: "",
    website: "",
  },
  experience: [],
  education: [],
  projects: [],
  achievements: [],
  languages: [],
  skills: [],
  references: "Available upon request.",
};
