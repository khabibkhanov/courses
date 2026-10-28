import { z } from "zod";
import { db } from "@/lib/db";
import { getCourse, publishedNumbers } from "@/lib/content";
import { CONTEXT_LEN, FEEDBACK_COMMENT_MAX, FEEDBACK_KIND_KEYS, FEEDBACK_PER_HOUR, QUOTE_MAX } from "@/lib/feedback";
import { fail, ipHash, overHourlyLimit } from "@/lib/request";

const body = z.object({
  course: z.string(),
  lesson: z.number().int().positive(),
  deviceId: z.uuid(),
  kind: z.enum(FEEDBACK_KIND_KEYS),
  quote: z.string().trim().min(1).max(QUOTE_MAX),
  prefix: z.string().max(CONTEXT_LEN * 2),
  suffix: z.string().max(CONTEXT_LEN * 2),
  section: z.string().trim().max(200).optional(),
  comment: z.string().trim().max(FEEDBACK_COMMENT_MAX).optional(),
  lessonHash: z.string().regex(/^[0-9a-f]{16}$/),
});

export async function POST(request: Request) {
  const sql = db();
  if (!sql) return fail(503, "Izoh qabul qilish hali yoqilmagan.");

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(400, "Ma'lumot noto'g'ri.");
  const f = parsed.data;

  const c = getCourse(f.course);
  if (!c || !publishedNumbers(c).includes(f.lesson)) return fail(404, "Bunday dars yo'q.");

  const hash = ipHash(request);
  if (await overHourlyLimit(sql, "lesson_feedback", hash, FEEDBACK_PER_HOUR))
    return fail(429, "Juda ko'p izoh. Birozdan keyin urinib ko'ring.");

  await sql`
    insert into lesson_feedback
      (course, lesson, kind, quote, prefix, suffix, section, comment, lesson_hash, device_id, ip_hash)
    values
      (${f.course}, ${f.lesson}, ${f.kind}, ${f.quote}, ${f.prefix}, ${f.suffix}, ${f.section || null},
       ${f.comment || null}, ${f.lessonHash}, ${f.deviceId}, ${hash})`;

  return Response.json({ ok: true });
}
