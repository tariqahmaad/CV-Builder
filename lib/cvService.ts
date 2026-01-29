import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { CVData, initialCVData } from "./types";
import { validateCVData } from "./validation";

/**
 * Deep merge two objects, with source values taking priority
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }
  
  return result;
}

const CV_COLLECTION = "cvs";

export interface CVDocument {
  data: CVData;
  updatedAt: Date;
  createdAt: Date;
}

/**
 * Save CV data to Firestore
 */
export async function saveCV(userId: string, data: CVData): Promise<void> {
  const docRef = doc(db, CV_COLLECTION, userId);
  const existingDoc = await getDoc(docRef);

  if (existingDoc.exists()) {
    // Update existing document
    await setDoc(
      docRef,
      {
        data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } else {
    // Create new document
    await setDoc(docRef, {
      data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Load CV data from Firestore
 * Validates and sanitizes loaded data using Zod schema
 * Returns null if document doesn't exist or data is invalid
 */
export async function loadCV(userId: string): Promise<CVData | null> {
  const docRef = doc(db, CV_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const document = docSnap.data();
    const loadedData = document.data;
    
    // Validate data with Zod schema
    const validatedData = validateCVData(loadedData);
    
    if (validatedData) {
      // Deep merge with initial values to ensure all fields are present
      return deepMerge(
        initialCVData as unknown as Record<string, unknown>,
        validatedData as unknown as Record<string, unknown>
      ) as unknown as CVData;
    }
    
    console.warn("Loaded CV data failed validation, returning null");
    return null;
  }

  return null;
}

/**
 * Delete CV data from Firestore
 */
export async function deleteCV(userId: string): Promise<void> {
  const docRef = doc(db, CV_COLLECTION, userId);
  await deleteDoc(docRef);
}
