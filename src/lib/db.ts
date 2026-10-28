import postgres from "postgres";

let client: postgres.Sql | null = null;

/** Baza ulanmagan bo'lsa null: reyting va admin shunda "ulanmagan" holatini ko'rsatadi. */
export function db(): postgres.Sql | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  // Neon pooler (PgBouncer) bilan prepared statement ishlatilmaydi; serverless'da bitta ulanish yetadi.
  client ??= postgres(url, { max: 1, prepare: false, idle_timeout: 20 });
  return client;
}
