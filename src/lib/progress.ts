"use client";

import { useSyncExternalStore } from "react";

/**
 * Dars progressi brauzerda (localStorage), kalit `progress:<kurs>`.
 * Keyin akkaunt qo'shilganda faqat shu modul almashadi.
 */
export type LessonProgress = {
  passed: boolean;
  score: number;
  answer?: string;
  checklist?: number[];
  /** Oxirgi yuborilgan baho (server ham saqlaydi, bu - formani to'ldirish uchun). */
  rating?: { stars: number; tags: string[]; comment: string };
  /** Darsdagi testli mashqlar: blok tartib raqami bo'yicha o'quvchi kodi va natijasi. */
  exercises?: Record<string, { code: string; passed: boolean }>;
};
export type CourseProgress = Record<string, LessonProgress>;

const EMPTY: CourseProgress = Object.freeze({}) as CourseProgress;
const key = (course: string) => `progress:${course}`;

// Eski alohida saytlardagi kalitlar: birinchi o'qishda yangi kalitga ko'chiriladi.
const LEGACY: Record<string, string> = { "system-design": "sd-uz-progress", cs50: "cs50-uz-progress" };

const cache = new Map<string, CourseProgress>();
const listeners = new Set<() => void>();

function parse(raw: string | null): CourseProgress | null {
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    // Clean Code eski formati: tugatilgan dars raqamlari massivi.
    if (Array.isArray(v)) {
      return Object.fromEntries(
        v.filter((n): n is number => Number.isInteger(n)).map((n) => [String(n), { passed: true, score: 1 }]),
      );
    }
    return v && typeof v === "object" ? (v as CourseProgress) : null;
  } catch {
    return null;
  }
}

function read(course: string): CourseProgress {
  const hit = cache.get(course);
  if (hit) return hit;
  let value = EMPTY;
  try {
    const current = localStorage.getItem(key(course));
    const legacy = LEGACY[course] ? localStorage.getItem(LEGACY[course]) : null;
    value = parse(current) ?? parse(legacy) ?? EMPTY;
    const migrated = value !== EMPTY && (current === null || current.trimStart().startsWith("["));
    if (migrated) localStorage.setItem(key(course), JSON.stringify(value));
  } catch {
    value = EMPTY;
  }
  cache.set(course, value);
  return value;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key?.startsWith("progress:")) {
      cache.clear();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(course: string): CourseProgress {
  return useSyncExternalStore(subscribe, () => read(course), () => EMPTY);
}

export function saveProgress(course: string, n: number, patch: Partial<LessonProgress>) {
  const store = read(course);
  const prev = store[n] ?? { passed: false, score: 0 };
  const exercises = patch.exercises ? { ...prev.exercises, ...patch.exercises } : prev.exercises;
  const next = { ...store, [n]: { ...prev, ...patch, exercises, passed: prev.passed || Boolean(patch.passed) } };
  try {
    localStorage.setItem(key(course), JSON.stringify(next));
  } catch {
    // Saqlab bo'lmasa ham sessiya davomida ishlayveradi.
  }
  cache.set(course, next);
  listeners.forEach((l) => l());
}

export const passedCount = (p: CourseProgress) => Object.values(p).filter((x) => x.passed).length;

/** Birinchi o'tilmagan ochiq dars. */
export const nextLesson = (published: number[], p: CourseProgress) => published.find((n) => !p[n]?.passed);
