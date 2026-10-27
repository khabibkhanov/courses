# Kurslar

O'zbek tilidagi kurslar hub'i. Har bir kurs alohida Next.js ilova va Vercel loyihasi, hub ularni bitta domen ostida Next.js multi-zones rewrites orqali ulaydi.

| Yo'l | Kurs | Repo |
|---|---|---|
| `/system-design` | System Design | khabibkhanov/systen-design (`basePath: "/system-design"`) |
| `/clean-code` | Clean Code | khabibkhanov/clean-code (`assetPrefix: "/clean-code-static"`) |
| `/cs50` | CS50 | khabibkhanov/lessons, Vercel `cs50-uz` (`NEXT_PUBLIC_COURSE=cs50`, `basePath: "/cs50"`) |

## Yangi kurs qo'shish
1. Kurs ilovasida `basePath: "/<slug>"` (yoki sahifalar allaqachon `/<slug>` ostida bo'lsa `assetPrefix`).
2. Hub'dan qaytish uchun `<a href="/">` (zonalar orasida `<Link>` emas).
3. `src/courses.ts` ga bitta yozuv. Bosh sahifa ham, rewrites ham shundan quriladi.
4. Kurs production'i ochiq bo'lishi kerak (Vercel SSO faqat preview uchun).
