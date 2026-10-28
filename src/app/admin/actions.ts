"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { FEEDBACK_STATUSES } from "@/lib/feedback";

/** Izoh holatini o'zgartirish. /admin yo'li proxy.ts'da parol bilan himoyalangan. */
export async function setFeedbackStatus(formData: FormData) {
  const sql = db();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!sql || !Number.isInteger(id) || !(status in FEEDBACK_STATUSES)) return;
  await sql`update lesson_feedback set status = ${status}, updated_at = now() where id = ${id}`;
  revalidatePath("/admin/izohlar");
}
