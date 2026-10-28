import { z } from "zod";
import { db } from "@/lib/db";
import { getCourse, publishedNumbers } from "@/lib/content";
import { COMMENT_MAX, RATE_LIMIT_PER_HOUR, RATING_TAGS } from "@/lib/rating";
import { fail, ipHash, overHourlyLimit } from "@/lib/request";

const body = z.object({
  course: z.string(),
  lesson: z.number().int().positive(),
  deviceId: z.uuid(),
  stars: z.number().int().min(1).max(5),
  tags: z.array(z.enum(RATING_TAGS)).max(RATING_TAGS.length),
  comment: z.string().trim().max(COMMENT_MAX).optional(),
});

export async function POST(request: Request) {
  const sql = db();
  if (!sql) return fail(503, "Baho qabul qilish hali yoqilmagan.");

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return fail(400, "Ma'lumot noto'g'ri.");
  const { course, lesson, deviceId, stars, comment } = parsed.data;
  const tags = [...new Set(parsed.data.tags)];

  const c = getCourse(course);
  if (!c || !publishedNumbers(c).includes(lesson)) return fail(404, "Bunday dars yo'q.");

  const hash = ipHash(request);
  if (await overHourlyLimit(sql, "lesson_rating", hash, RATE_LIMIT_PER_HOUR))
    return fail(429, "Juda ko'p so'rov. Birozdan keyin urinib ko'ring.");

  await sql`
    insert into lesson_rating (course, lesson, device_id, stars, tags, comment, ip_hash)
    values (${course}, ${lesson}, ${deviceId}, ${stars}, ${tags}, ${comment || null}, ${hash})
    on conflict (course, lesson, device_id) do update
      set stars = excluded.stars, tags = excluded.tags, comment = excluded.comment,
          ip_hash = excluded.ip_hash, updated_at = now()`;

  return Response.json({ ok: true });
}
