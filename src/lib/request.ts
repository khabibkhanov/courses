import { createHash } from "node:crypto";
import type postgres from "postgres";

/** Mijoz IP'si o'rniga uning qisqa hash'i saqlanadi: rate limit uchun yetarli, IP o'zi saqlanmaydi. */
export function ipHash(headers: Headers): string {
  const ip = headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

/** Oxirgi bir soatda shu IP'dan jadvalga nechta yozuv tushganini tekshiradi. */
export async function overHourlyLimit(
  sql: postgres.Sql,
  table: "lesson_rating" | "lesson_feedback",
  hash: string,
  limit: number,
): Promise<boolean> {
  const column = table === "lesson_rating" ? "updated_at" : "created_at";
  const [{ n }] = await sql<{ n: number }[]>`
    select count(*)::int as n from ${sql(table)}
    where ip_hash = ${hash} and ${sql(column)} > now() - interval '1 hour'`;
  return n >= limit;
}

export const fail = (status: number, error: string) => Response.json({ error }, { status });
