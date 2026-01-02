"use client";

const STORAGE_KEY = "ielts_journey_progress_v1";

export interface UserProgress {
  completedLevels: number[]; // Array of Level IDs done
  maxLevel: number; // Highest unlocked level ID
}

// Default: Only Level 1 is unlocked
const defaultProgress: UserProgress = { completedLevels: [], maxLevel: 1 };

export const getProgress = (): UserProgress => {
  if (typeof window === "undefined") return defaultProgress;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProgress;
  } catch (e) {
    console.error("Failed to load progress", e);
    return defaultProgress;
  }
};

export const saveLevelComplete = (levelId: number): UserProgress => {
  const current = getProgress();

  // 1. Mark as completed (if not already)
  if (!current.completedLevels.includes(levelId)) {
    current.completedLevels.push(levelId);
  }

  // 2. Unlock next level logic
  // If we just finished the max level, unlock the next one
  if (levelId === current.maxLevel) {
    current.maxLevel = levelId + 1;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return current;
};

export const resetProgress = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

