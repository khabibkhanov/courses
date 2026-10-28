"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FEEDBACK_STATUSES } from "@/lib/feedback";
import { PASSWORD_MIN, changeCredentials, login, logout, requireAdmin } from "@/lib/auth";

export type FormState = { error?: string; ok?: string } | undefined;

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const res = await login(String(form.get("username") ?? "").trim(), String(form.get("password") ?? ""));
  if (!res.ok) return { error: res.error };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

export async function changeCredentialsAction(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const username = String(form.get("username") ?? "").trim();
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const repeat = String(form.get("repeat") ?? "");

  if (!/^[A-Za-z0-9._-]{3,64}$/.test(username)) return { error: "Login 3-64 belgi: lotin harflari, raqam, . _ -" };
  if (next && next.length < PASSWORD_MIN) return { error: `Yangi parol kamida ${PASSWORD_MIN} belgi bo'lsin.` };
  if (next !== repeat) return { error: "Yangi parol va takrori bir xil emas." };

  const res = await changeCredentials(current, username, next);
  if (!res.ok) return { error: res.error };
  revalidatePath("/admin", "layout");
  return { ok: next ? "Login va parol saqlandi. Boshqa qurilmalardagi sessiyalar yopildi." : "Login saqlandi." };
}

/** Matnga izoh holatini o'zgartirish. */
export async function setFeedbackStatus(formData: FormData) {
  await requireAdmin();
  const sql = db();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!sql || !Number.isInteger(id) || !(status in FEEDBACK_STATUSES)) return;
  await sql`update lesson_feedback set status = ${status}, updated_at = now() where id = ${id}`;
  revalidatePath("/admin/izohlar");
}
