import { CVData, initialCVData } from "./types";
import { validateCVData } from "./validation";

const STORAGE_KEY = "cv-draft";
const TIMESTAMP_KEY = "cv-draft-timestamp";

export interface DraftData {
  data: CVData;
  savedAt: string;
}

/**
 * Save CV draft to localStorage
 */
export function saveDraft(data: CVData): void {
  try {
    const draft: DraftData = {
      data,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
}

/**
 * Load CV draft from localStorage
 * Returns null if no draft or data is invalid
 */
export function loadDraft(): DraftData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const draft = JSON.parse(stored) as DraftData;

    // Validate the data structure
    const validatedData = validateCVData(draft.data);
    if (!validatedData) {
      console.warn("Draft data failed validation, clearing");
      clearDraft();
      return null;
    }

    return {
      data: validatedData,
      savedAt: draft.savedAt,
    };
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
}

/**
 * Check if a draft exists in localStorage
 */
export function hasDraft(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Clear CV draft from localStorage
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
}

/**
 * Get the timestamp of the last draft save
 */
export function getDraftTimestamp(): number | null {
  try {
    const timestamp = localStorage.getItem(TIMESTAMP_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch {
    return null;
  }
}

/**
 * Compare two CVData objects to check if they're different
 * Returns true if data has meaningful differences
 */
export function hasDataChanged(a: CVData, b: CVData): boolean {
  // Compare arrays by checking if they have different lengths or different items
  const arraysDiffer = <T extends { id: string }>(arrA: T[], arrB: T[]): boolean => {
    if (arrA.length !== arrB.length) return true;
    return JSON.stringify(arrA) !== JSON.stringify(arrB);
  };

  // Compare personal info
  const personalA = JSON.stringify(a.personalInfo);
  const personalB = JSON.stringify(b.personalInfo);
  if (personalA !== personalB) return true;

  // Compare arrays
  if (arraysDiffer(a.experience, b.experience)) return true;
  if (arraysDiffer(a.education, b.education)) return true;
  if (arraysDiffer(a.projects, b.projects)) return true;
  if (arraysDiffer(a.achievements, b.achievements)) return true;
  if (arraysDiffer(a.languages, b.languages)) return true;
  if (arraysDiffer(a.skills, b.skills)) return true;

  return false;
}

/**
 * Deep merge two CVData objects, preferring source values
 * Used for conflict resolution - "keep local" option
 */
export function mergeCVData(target: CVData, source: CVData): CVData {
  return {
    personalInfo: { ...target.personalInfo, ...source.personalInfo },
    experience: source.experience.length > 0 ? source.experience : target.experience,
    education: source.education.length > 0 ? source.education : target.education,
    projects: source.projects.length > 0 ? source.projects : target.projects,
    achievements: source.achievements.length > 0 ? source.achievements : target.achievements,
    languages: source.languages.length > 0 ? source.languages : target.languages,
    skills: source.skills.length > 0 ? source.skills : target.skills,
    references: source.references || target.references,
  };
}
