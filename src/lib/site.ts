// Sayt nomi (2026-10-29 tanlandi): o'zgartirish uchun faqat shu yer.
export const SITE = {
  name: "Enth Academy",
  description: "O'zbek tilidagi chuqur dasturlash kurslari: computer science, toza kod va system design.",
  /** Mutlaq manzil (sitemap, ulashish rasmlari). Domen ulanganda NEXT_PUBLIC_SITE_URL bilan beriladi. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
};
