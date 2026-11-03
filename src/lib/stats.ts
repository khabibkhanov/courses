import { glossary } from "./glossary";
import { listCourses, publishedNumbers, syllabus } from "./content";

/** Sayt bo'yicha umumiy sonlar: bosh sahifa, "Haqida" va FAQ bir xil manbadan oladi. */
export function siteStats() {
  const courses = listCourses();
  const lessons = courses.reduce((s, c) => s + syllabus(c).length, 0);
  const published = courses.reduce((s, c) => s + publishedNumbers(c).length, 0);
  return { courses: courses.length, lessons, published, terms: glossary().length };
}

/** Darsdagi kodni brauzerning o'zida ishga tushirish mumkin bo'lgan tillar (src/components/playground). */
export const RUNNABLE_LANGUAGES = ["Python", "SQL", "JavaScript", "TypeScript", "C"] as const;
