# Kurslar

O'zbek tilidagi chuqur dasturlash kurslari - bitta Next.js ilova, bitta Vercel loyiha. Reja va qarorlar: claude.ai "Lessons" loyihasidagi `claude/02-platforma-reja.md`.

## Kurslar

| Yo'l | Kurs | Dars formati | Yozish standarti |
|---|---|---|---|
| `/cs50` | CS50 asosida computer science, 60 dars | `lessons-md` | `docs/cs50/lesson-spec.md` |
| `/clean-code` | Clean Code, 100 dars | `clean-code` | `content/clean-code/AUTHORING.md` |
| `/system-design` | System Design, 100 dars | `lessons-md` | `docs/system-design/lesson-spec.md`, `case-study.md`, `verification-pass.md` |

## Tuzilma

```
content/<kurs>/course.yaml     kurs tavsifi, "Kim uchun", rang, format, syllabus (yagona manba)
content/<kurs>/NNN.md          lessons-md: dars (frontmatter: title, minutes) + NNN.quiz.json
content/<kurs>/lessons/        clean-code: NNN-slug.md (frontmatter ichida test va topshiriq) + sources.yaml
src/lib/content/               sxema va har format uchun yuklovchi (loaders/)
src/lib/markdown.ts            markdown -> HTML (Shiki ikki mavzuli, mermaid brauzerda)
src/lib/progress.ts            progress (localStorage, kalit progress:<kurs>; eski kalitlar avtomatik ko'chadi)
scripts/validate.ts            kontent tekshiruvi (build oldidan ishlaydi)
scripts/check-render.py        ishlab turgan saytda diagrammalar va JS xatolarni tekshirish
```

Yangi kurs: `content/<slug>/course.yaml` va darslar. Sahifalar, xarita va bosh sahifa avtomatik yangilanadi.

Eski manzillar `next.config.ts` da yo'naltiriladi: `/clean-code/<slug>` -> `/clean-code/dars/<n>`, `/dars/<n>` -> `/system-design/dars/<n>`.

## Buyruqlar

```bash
npm run dev                                   # lokal server
npm run validate                              # barcha kurslar
npm run validate -- system-design 1 10        # bitta kurs, oraliq
npm run build                                 # tekshiruv + production build
python3 scripts/check-render.py http://localhost:3000 [kurs] [from] [to]
```
