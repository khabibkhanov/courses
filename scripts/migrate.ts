/** db/schema.sql ni bazaga qo'llaydi. DATABASE_URL bo'lmasa (lokal build) o'tkazib yuboradi. */
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";

async function main(url: string) {
  const sql = postgres(url, { max: 1, prepare: false });
  await sql.unsafe(fs.readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8"));
  await sql.end();
  console.log("migrate: sxema qo'llandi");
}

// DDL to'g'ridan-to'g'ri ulanish orqali (pooler emas), bo'lmasa oddiy URL.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.log("migrate: DATABASE_URL yo'q, o'tkazib yuborildi");
} else {
  main(url).catch((err) => {
    console.error("migrate:", err);
    process.exit(1);
  });
}
