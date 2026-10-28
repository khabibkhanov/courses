import { NextResponse, type NextRequest } from "next/server";

/** /admin - Basic Auth, parol ADMIN_PASSWORD env'da. Env bo'lmasa sahifa umuman ochilmaydi. */
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("Not found", { status: 404 });

  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = atob(encoded);
    const given = decoded.slice(decoded.indexOf(":") + 1);
    if (decoded.includes(":") && timingSafeEqual(given, password)) return NextResponse.next();
  }
  return new NextResponse("Kirish uchun parol kerak", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin", charset="UTF-8"' },
  });
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
