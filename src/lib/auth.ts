import "server-only";
import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { ipHash } from "./request";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 30;
const MAX_FAILED = 10; // 15 daqiqada bitta IP'dan
export const PASSWORD_MIN = 10;

// Parol: scrypt, tasodifiy salt bilan. Saqlash formati: scrypt$<salt>$<hash> (base64).
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scrypt(password, Buffer.from(salt, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

async function startSession() {
  const sql = db()!;
  const token = randomBytes(32).toString("base64url");
  await sql`
    insert into admin_session (token_hash, expires_at)
    values (${sha256(token)}, now() + ${`${SESSION_DAYS} days`}::interval)`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 3600,
  });
}

/** Kirgan admin'ning login'i yoki null. */
export async function currentAdmin(): Promise<string | null> {
  const sql = db();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sql || !token) return null;
  const [row] = await sql<{ username: string }[]>`
    select u.username from admin_session s, admin_user u
    where s.token_hash = ${sha256(token)} and s.expires_at > now()`;
  return row?.username ?? null;
}

/** Admin sahifa va action'lar boshida: kirilmagan bo'lsa login sahifasiga. */
export async function requireAdmin(): Promise<string> {
  const user = await currentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(username: string, password: string): Promise<LoginResult> {
  const sql = db();
  if (!sql) return { ok: false, error: "Baza ulanmagan." };
  const ip = ipHash(await headers());

  const [{ failed }] = await sql<{ failed: number }[]>`
    select count(*)::int as failed from admin_login_attempt
    where ip_hash = ${ip} and at > now() - interval '15 minutes'`;
  if (failed >= MAX_FAILED) return { ok: false, error: "Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring." };

  const [user] = await sql<{ username: string; password_hash: string }[]>`
    select username, password_hash from admin_user where id = 1`;

  let ok = false;
  if (user) {
    ok = safeEqual(username, user.username) && (await verifyPassword(password, user.password_hash));
  } else {
    // Birinchi kirish: hali admin yo'q. "admin" va ADMIN_PASSWORD env bilan kirib, foydalanuvchi yaratiladi.
    const initial = process.env.ADMIN_PASSWORD;
    ok = Boolean(initial) && username === "admin" && safeEqual(password, initial!);
    if (ok) {
      await sql`
        insert into admin_user (id, username, password_hash) values (1, 'admin', ${await hashPassword(password)})
        on conflict (id) do nothing`;
    }
  }

  if (!ok) {
    await sql`insert into admin_login_attempt (ip_hash) values (${ip})`;
    return { ok: false, error: "Login yoki parol noto'g'ri." };
  }
  await sql`delete from admin_login_attempt where ip_hash = ${ip} or at < now() - interval '1 day'`;
  await sql`delete from admin_session where expires_at < now()`;
  await startSession();
  return { ok: true };
}

export async function logout() {
  const sql = db();
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (sql && token) await sql`delete from admin_session where token_hash = ${sha256(token)}`;
  jar.delete(SESSION_COOKIE);
}

/** Login va/yoki parolni o'zgartirish. Joriy parol shart; parol o'zgarsa boshqa sessiyalar yopiladi. */
export async function changeCredentials(current: string, username: string, next: string): Promise<LoginResult> {
  const sql = db()!;
  const [user] = await sql<{ password_hash: string }[]>`select password_hash from admin_user where id = 1`;
  if (!user || !(await verifyPassword(current, user.password_hash))) return { ok: false, error: "Joriy parol noto'g'ri." };

  if (next) {
    await sql`update admin_user set username = ${username}, password_hash = ${await hashPassword(next)}, updated_at = now() where id = 1`;
    await sql`delete from admin_session`;
    await startSession();
  } else {
    await sql`update admin_user set username = ${username}, updated_at = now() where id = 1`;
  }
  return { ok: true };
}
