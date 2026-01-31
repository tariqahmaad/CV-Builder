import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 */
export function formatDistanceToNow(
  date: Date,
  options: { addSuffix?: boolean } = {}
): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  let result: string;

  if (diffInSecs < 60) {
    result = "just now";
  } else if (diffInMins < 60) {
    result = `${diffInMins} minute${diffInMins === 1 ? "" : "s"} ago`;
  } else if (diffInHours < 24) {
    result = `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else if (diffInDays < 30) {
    result = `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  } else {
    result = date.toLocaleDateString();
  }

  return options.addSuffix ? result : result.replace(" ago", "");
}
