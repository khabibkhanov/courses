import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { quizQuestionSchema } from "../schema";
import type { LessonLoader } from "..";

// Format: NNN.md (frontmatter: title, minutes) + NNN.quiz.json. Manbalar matn ichida, "## Manbalar".

const pad = (n: number) => String(n).padStart(3, "0");

const frontmatter = z.object({ title: z.string(), minutes: z.number().int().positive() });
const quizFile = z.object({ passScore: z.number().gt(0).lte(1), questions: z.array(quizQuestionSchema).min(1) });

export const lessonsMd: LessonLoader = {
  exists: (dir, entry) => fs.existsSync(path.join(dir, `${pad(entry.n)}.md`)),

  load(dir, _course, entry) {
    const { data, content } = matter(fs.readFileSync(path.join(dir, `${pad(entry.n)}.md`), "utf8"));
    const fm = frontmatter.parse(data);
    const qPath = path.join(dir, `${pad(entry.n)}.quiz.json`);
    const quiz = fs.existsSync(qPath) ? quizFile.parse(JSON.parse(fs.readFileSync(qPath, "utf8"))) : null;
    return { minutes: fm.minutes, summary: null, body: content, quiz, task: null, sources: [] };
  },
};
