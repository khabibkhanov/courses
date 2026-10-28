import { NextResponse, type NextRequest } from "next/server";

/**
 * /admin: sessiya cookie'si bo'lmasa login sahifasiga. Bu faqat tez yo'l -
 * haqiqiy tekshiruv har bir admin sahifa va action'da (requireAdmin, src/lib/auth.ts).
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (request.cookies.has("admin_session")) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
