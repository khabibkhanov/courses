# Dars yozish qoidalari (Clean Code kursi)

Bu fayl har bir darsni yozish uchun yagona standart. Namuna: `lessons/001-clean-code-nima.md`.

## Fayl

- Yo'l: `content/clean-code/lessons/NNN-slug.md` (NNN - uch xonali raqam, slug - `course.yaml`dagi bilan bir xil).
- Frontmatter sxemasi: `src/lib/content/schema.ts` (`lessonFrontmatterSchema`).
- Tekshiruv: `npx tsx scripts/validate-content.ts --partial --from N --to M`. Xatosiz o'tishi shart.

## Til va uslub

- O'zbek tili, lotin yozuvi. Apostrof oddiy `'` (o', g', ma'no).
- Texnik terminlar inglizcha qoladi: refactoring, coupling, dependency injection, side effect, code smell. Birinchi uchraganda qisqa o'zbekcha izoh berish mumkin.
- **Em-dash (—) va en-dash (–) taqiqlangan.** Faqat oddiy defis `-`. Validator buni tekshiradi.
- Emoji yo'q. Maqtov, "ajoyib", "kuchli" kabi bo'sh so'zlar yo'q. To'g'ridan-to'g'ri, aniq.
- O'quvchi: 5 yillik tajribali full-stack dasturchi (Node.js/NestJS, React/Next.js, TypeScript, PostgreSQL). Boshlang'ich narsalarni tushuntirmang, lekin har bir mavzuni chuqur bering.

## Aniqlik va manbalar

- Har bir dars `course.yaml`dagi manbalarga tayanadi. Qo'shimcha manba kerak bo'lsa, faqat `sources.yaml`da bor id'lardan foydalaning.
- Manbaga biror fikrni nisbat bersangiz, u haqiqatan o'sha manbada bo'lishi shart. Bob raqami yoki nomini aniq bilmasangiz, uni yozmang (`note` maydonida umumiyroq yozing, masalan "funksiyalar haqidagi bob").
- Web manbalardagi (martinfowler.com, refactoring.com, docs) aniq da'volarni WebFetch bilan tekshiring.
- Taxmin yoki munozarali fikr bo'lsa, buni ochiq ayting ("bu muallifning tajribaviy bahosi", "bu borada fikrlar turlicha").
- Mualliflar o'rtasida kelishmovchilik bo'lsa (Martin va Ousterhout, TDD tarafdorlari va tanqidchilari), ikkala tomonni adolatli bering.
- Mualliflik huquqi: kitoblardan uzun iqtibos keltirmang. Bitta manbadan ko'pi bilan bitta, 15 so'zdan qisqa iqtibos. Qolgani o'z so'zlaringiz bilan.

## Tuzilma (majburiy `##` bo'limlar, shu tartibda)

1. `## Muammo` - bu mavzu qanday real og'riqni hal qiladi.
2. `## Asosiy g'oya` - qoidaning o'zi, manbalarga tayangan holda.
3. `## Chuqurroq: ...` - mexanika, nozik holatlar, turli mualliflar qarashi. Kerak bo'lsa `###` kichik bo'limlar.
4. `## Misol: ...` - yomon va yaxshi kod, TypeScript. Har o'zgarish nega qilinganini tushuntiring.
5. `## Qachon qo'llamaslik kerak` - qoida zarar qiladigan holatlar, trade-off'lar. Halol va aniq.
6. `## Stack'da: ...` (tavsiya etiladi) - TS/Node/NestJS/React/Next.js'dagi aniq qo'llanilishi.
7. `## Xulosa` - 4-6 ta qisqa band.

- Matn hajmi: kamida 1100 so'z (kod bloklarisiz), maqsad 1400-2000.
- Kamida bitta ` ```ts ` yoki ` ```tsx ` blok. Kod real, kompilyatsiya bo'ladigan, `any`siz (agar `any` o'zi yomon misol bo'lmasa).
- Misollar domeni real bo'lsin: buyurtmalar, to'lovlar, transport parki (GPS, yoqilg'i), foydalanuvchilar, ijara. Foo/bar yo'q.
- Boshqa darslarga havola: "(23-dars)" ko'rinishida, faqat `course.yaml`dagi raqam va mavzuga mos.

## Mashqlar

- `quiz`: 5-6 savol. Faktni yodlash emas, tushunishni tekshirsin (vaziyat, kod parchasi, "qaysi holatda..."). Noto'g'ri variantlar ishonarli bo'lsin. `answer` - 0 dan boshlanadigan indeks. **To'g'ri javob o'rnini aralashtiring** (0, 1, 2, 3 hammasi uchrasin). `explain` nega to'g'ri va nega boshqalari noto'g'ri ekanini aytadi.
- `task`: amaliy topshiriq. `starter` - muammoli, lekin ishlaydigan kod (real hajmda, 15-50 qator). `solution` - to'liq yechim. `solutionNotes` - markdown ro'yxat, nima va nega. `checklist` - 3-6 ta tekshiriladigan band. `lang`: odatda `ts` yoki `tsx`.

## YAML ehtiyotkorligi

- `: ` yoki `#` bor, yoki `"`/`'`/`[`/`{`/`-` bilan boshlanadigan qiymatlarni qo'shtirnoqqa oling.
- Qo'shtirnoq ichida `"` bo'lsa `\"` qiling.
- Kod va ko'p qatorli matn uchun `|` block scalar, bir xil chekinish bilan.
