"use client";

/** Anonim qurilma identifikatori: bitta brauzer bitta darsga bitta baho berishi uchun. */
export function deviceId(): string {
  try {
    let id = localStorage.getItem("device-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("device-id", id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/** JSON POST va server xatosi matnini olish. */
export async function postJson(url: string, body: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? "Yuborib bo'lmadi. Keyinroq urinib ko'ring." };
  } catch {
    return { ok: false, error: "Internet aloqasini tekshirib, qayta urinib ko'ring." };
  }
}
