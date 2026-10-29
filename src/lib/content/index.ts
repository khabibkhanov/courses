import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { courseSchema, type Course, type Lesson, type SyllabusLesson } from "./schema";
import { lessonsMd } from "./loaders/lessons-md";
import { cleanCode } from "./loaders/clean-code";

export type { Course, CourseModule, Lesson, Quiz, QuizQuestion, Task, LessonSource } from "./schema";

const CONTENT = path.join(process.cwd(), "content");

/** Har bir dars fayli formati uchun bitta yuklovchi. */
export type LessonLoader = {
  exists(dir: string, entry: SyllabusLesson): boolean;
  load(dir: string, course: Course, entry: SyllabusLesson): Omit<Lesson, "course" | "n" | "title">;
};

const LOADERS: Record<Course["format"], LessonLoader> = {
  "lessons-md": lessonsMd,
  "clean-code": cleanCode,
};

const courseCache = new Map<string, Course>();

function courseDir(slug: string) {
  return path.join(CONTENT, slug);
}

export function getCourse(slug: string): Course | null {
  const cached = courseCache.get(slug);
  if (cached) return cached;
  const file = path.join(courseDir(slug), "course.yaml");
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  const course = courseSchema.parse(YAML.parse(fs.readFileSync(file, "utf8")));
  if (course.slug !== slug) throw new Error(`${file}: slug "${course.slug}" papka nomiga mos emas`);
  courseCache.set(slug, course);
  return course;
}

export function listCourses(): Course[] {
  return fs
    .readdirSync(CONTENT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => getCourse(d.name))
    .filter((c): c is Course => c !== null)
    .sort((a, b) => a.order - b.order);
}

export function syllabus(course: Course) {
  return course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m })));
}

export function lessonCount(course: Course) {
  return syllabus(course).length;
}

export function publishedNumbers(course: Course): number[] {
  const loader = LOADERS[course.format];
  const dir = courseDir(course.slug);
  return syllabus(course)
    .filter((l) => loader.exists(dir, l))
    .map((l) => l.n);
}

export function getLesson(course: Course, n: number): Lesson | null {
  const entry = syllabus(course).find((l) => l.n === n);
  if (!entry) return null;
  const loader = LOADERS[course.format];
  const dir = courseDir(course.slug);
  if (!loader.exists(dir, entry)) return null;
  return { course: course.slug, n, title: entry.title, ...loader.load(dir, course, entry) };
}

/** Qidiruv tizimlari va ulashish uchun qisqa tavsif: summary yoki matnning birinchi xatboshisi. */
export function lessonDescription(lesson: Lesson, max = 200): string {
  const para =
    lesson.summary ??
    lesson.body
      .replace(/```[\s\S]*?```/g, "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .find((p) => p && !/^(#|\||-|\*|>|\d+\.|!\[)/.test(p)) ??
    "";
  const text = para
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length <= max ? text : text.slice(0, text.lastIndexOf(" ", max)) + "...";
}
