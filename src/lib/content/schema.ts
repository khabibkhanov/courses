import { z } from "zod";

/** content/<kurs>/course.yaml - har bir kursning yagona tavsifi va syllabus'i. */
export const courseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  audience: z.string().min(1),
  order: z.number().int(),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  /** Dars fayllari formati: qarang `loaders/`. */
  format: z.enum(["lessons-md", "clean-code"]),
  passScore: z.number().gt(0).lte(1),
  library: z.array(z.object({ title: z.string(), by: z.string(), href: z.url() })).default([]),
  modules: z
    .array(
      z.object({
        n: z.number().int().positive(),
        title: z.string().min(1),
        goal: z.string().optional(),
        lessons: z
          .array(
            z.object({
              n: z.number().int().positive(),
              title: z.string().min(1),
              slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
              sources: z.array(z.string()).optional(),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});

export type Course = z.infer<typeof courseSchema>;
export type CourseModule = Course["modules"][number];
export type SyllabusLesson = CourseModule["lessons"][number];

export const quizQuestionSchema = z
  .object({
    q: z.string().min(1),
    options: z.array(z.string().min(1)).min(3).max(5),
    answer: z.number().int().nonnegative(),
    why: z.string().min(1),
  })
  .refine((x) => x.answer < x.options.length, { message: "answer index is out of range" });

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type Quiz = { passScore: number; questions: QuizQuestion[] };

export type Task = {
  title: string;
  prompt: string;
  lang: string;
  starter: string;
  solution: string;
  solutionNotes: string;
  checklist: string[];
};

export type LessonSource = { title: string; author: string; year: number; url: string; note: string };

/** Ikkala format ham shu umumiy ko'rinishga keltiriladi. */
export type Lesson = {
  course: string;
  n: number;
  title: string;
  minutes: number;
  summary: string | null;
  body: string;
  quiz: Quiz | null;
  task: Task | null;
  sources: LessonSource[];
};
