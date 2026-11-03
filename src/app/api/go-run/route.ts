import { fail } from "@/lib/request";

// Go kodi o'quvchi brauzerida ishlamaydi: rasmiy Go Playground (go.dev) ishga tushiradi.
// go.dev CORS ruxsat bermaydi, shuning uchun so'rov shu route orqali o'tadi.
const PLAYGROUND = "https://go.dev/_/compile?backend=";
const CODE_MAX = 20_000;
const TIMEOUT_MS = 20_000;

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const code = typeof payload?.code === "string" ? payload.code : "";
  if (!code.trim() || code.length > CODE_MAX) return fail(400, "Kod bo'sh yoki juda uzun.");

  try {
    const res = await fetch(PLAYGROUND, {
      method: "POST",
      body: new URLSearchParams({ version: "2", body: code, withVet: "true" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return fail(502, `Go Playground ${res.status} qaytardi.`);
    return Response.json(await res.json());
  } catch {
    return fail(502, "Go Playground bilan aloqa bo'lmadi.");
  }
}
