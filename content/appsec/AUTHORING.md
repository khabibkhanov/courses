# Dars yozish qoidalari (Application Security kursi)

Bu fayl AppSec kursidagi har bir darsni yozish uchun yagona standart. Format Clean Code va Go kurslari bilan bir xil (`format: clean-code`): har dars bitta `.md` fayl, test va topshiriq frontmatter ichida. Namuna: `lessons/001-xavfsizlik-asoslari.md`. Kurs dizayni: `docs/superpowers/specs/2026-11-11-appsec-course-design.md`.

## Fayl

- Yo'l: `content/appsec/lessons/NNN-slug.md` (NNN - uch xonali raqam, slug - `course.yaml`dagi bilan bir xil).
- Frontmatter sxemasi: `src/lib/content/loaders/clean-code.ts` (`n`, `slug`, `title`, `summary`, `duration`, `sources`, `quiz`, `task`).
- Tekshiruv: `npm run validate -- appsec N M` (yoki `npx tsx scripts/validate.ts appsec N M`). Xatosiz o'tishi shart. Hali yozilmagan darslar validator tomonidan o'tkazib yuboriladi.
- Agent faqat o'z dars fayllarini yozadi. `course.yaml`, `sources.yaml`, validator va boshqa darslarga tegmaydi. Yangi manba kerak bo'lsa, hisobotda so'raydi (id, sarlavha, muallif, yil, kind, tekshirilgan URL).
- Lug'at atamalari: `content/glossary/appsec-mNN.yaml` (NN - modul raqami, masalan `appsec-m01.yaml`). Faqat o'z modulingiz fayli, `course: appsec`.
- Git, npm install va build ishga tushirilmaydi.

## Til va uslub

- O'zbek tili, lotin yozuvi. Apostrof oddiy `'` (o', g', ma'no).
- Texnik terminlar inglizcha: attack surface, threat model, trust boundary, nonce, CSRF token. Birinchi uchraganda qisqa o'zbekcha izoh berish mumkin.
- **Em-dash (—) va en-dash (–) taqiqlangan.** Faqat oddiy defis `-`. Validator buni tekshiradi.
- Emoji yo'q. Maqtov va bo'sh so'zlar yo'q. To'g'ridan-to'g'ri, aniq. "deylik", "taxminan", "xotiradan" yo'q.
- O'quvchi: 5 yillik tajribali backend/fullstack dasturchi (Node.js/TypeScript, PostgreSQL, Redis, NestJS, Next.js). Dasturlash asoslarini tushuntirmang, lekin har bir xavfsizlik mavzusini mexanizm darajasida bering: nima uchun ishlaydi, qayerda buziladi, nima uchun tuzatish yetarli.
- Misollar stack'i: Node.js (NestJS, Fastify, Express), Next.js/React, PostgreSQL, Prisma, Kysely, Redis, TypeScript. Foo/bar yo'q.
- O'quv misollari domeni: neytral "avtopark monitoring platformasi" (GPS telemetriya, yoqilg'i datchiklari, video, haydovchilar, bir nechta mijoz kompaniyasi - tenant). Tenant nomlari shartli (`alfa`, `beta`). Haqiqiy kompaniya nomi yo'q (validator `iquarix` matnini rad etadi).
- Case study darslarida (96-99) real hodisalar nomi bilan yoziladi (Log4Shell, xz, npm hodisalari, Capital One), lekin faqat birlamchi manbalarga (CVE yozuvi, regulyator hujjati, loyiha post-mortem'i) tayanib.

## Xavfsizlik va axloq qoidalari

- Hujum namunalari **faqat darsning o'zidagi o'quv kodiga** qarshi bo'ladi. Real tizimlarga qarshi tayyor exploit, zararli dastur, real maqsadga yo'naltirilgan ko'rsatma yoki skaner buyruqlari yozilmaydi.
- Payload'lar mexanizmni ko'rsatish uchun yetarli darajada minimal: `' OR 1=1 --`, `<script>alert(1)</script>`, `../../etc/passwd` kabi darslik namunalari. Ish tutadigan "qurol" yasamang.
- Muhim: hujum ko'rsatilsa, shu darsda uni to'sadigan tuzatish ham ko'rsatiladi.
- Real zaiflik (CVE) haqida yozilganda faqat ommaviy advisory va tuzatilgan versiyalar haqida gap boradi.

## Aniqlik va manbalar

- Birlamchi manbalar ustun: spetsifikatsiya (RFC, W3C, WHATWG), standartlar (NIST, OWASP ASVS), rasmiy hujjatlar. Dars faqat `sources.yaml`dagi id'larga tayanadi.
- Versiya, sana, raqam va kategoriya nomlari (masalan OWASP Top 10:2025 kategoriyalari, ASVS 5.0.0 bo'limlari, NIST SP 800-63-4) rasmiy sahifadan tekshiriladi. Matnda aniq yoziladi ("OWASP Top 10:2025 da A05 Injection").
- Manbaga fikr nisbat berilsa, u haqiqatan o'sha manbada bo'lishi shart. Aniq bo'lim nomini bilmasangiz yozmang (`note`da umumiyroq yozing).
- Web tekshiruvi: Kernel cloud brauzeri (`mcp__Kernel__*` vositalari, ularni `ToolSearch` bilan yuklang). Har agent o'z sessiyasini ochadi (`manage_browsers` create, nom: `appsec-lesson-<dars raqamlari>`, `timeout_seconds` 900), sahifalarni `execute_playwright_code` bilan o'qiydi (kerakli bo'limni qidirib, qisqa natija qaytaring; `waitUntil: 'domcontentloaded'`, timeout 20 soniya), tugagach sessiyani o'chiradi. Maslahat: ko'p URL'ni tez tekshirish uchun `page.request.get(url)` ishlatish mumkin (parallel `Promise.all`, 8-20 ta URL), lekin sahifa matnini o'qish uchun `page.goto` kerak bo'lishi mumkin. Kernel ketma-ket ikki marta ishlamasa, `WebSearch`/`WebFetch` ga o'ting va buni hisobotda yozing. URL'ni o'ylab topmang.
- O'qib bo'lmagan sahifa (Access Denied, JavaScript talab qiladigan SPA) haqida da'vo yozmang.
- Tekshirib bo'lmagan narsa matnga kirmaydi yoki ochiq belgilanadi ("bu muallifning tajribaviy bahosi", "bu qism tekshirilmagan"). Raqamlar (ms, MB, foiz, hujum statistikasi) faqat o'zingiz o'lchagan yoki manbada aniq yozilgan bo'lsa beriladi.
- Mualliflik huquqi: manbalardan uzun iqtibos yo'q. Bitta manbadan ko'pi bilan bitta, 15 so'zdan qisqa iqtibos. Qolgani o'z so'zlaringiz bilan.
- Huquqiy darslar (9 va 94) faqat lex.uz'dagi amaldagi matnlarga tayanadi: O'RQ-764 (15.04.2022, Kiberxavfsizlik to'g'risida) va O'RQ-547 (02.07.2019, Shaxsga doir ma'lumotlar to'g'risida). Modda raqami va mazmunini lex.uz'da ochib tekshirmay yozmang.

## Tuzilma (majburiy `##` bo'limlar, shu tartibda)

1. `## Muammo` - bu mavzu production'da qanday real og'riqni hal qiladi yoki qaysi xatoga olib keladi.
2. `## Asosiy g'oya` - qoida yoki mexanizmning o'zi, manbalarga tayangan holda.
3. `## Chuqurroq: ...` - ichki mexanika, nozik holatlar, versiyalar o'rtasidagi farq. Kerak bo'lsa `###` kichik bo'limlar.
4. `## Misol: ...` - uch qismli (pastga qarang).
5. `## Qachon qo'llamaslik kerak` - qoida/vosita zarar qiladigan holatlar, trade-off'lar. Halol va aniq.
6. `## Stack'da: ...` (tavsiya etiladi) - NestJS/Fastify/Next.js/Prisma/Kysely/PostgreSQL/Redis'dagi aniq qo'llanilishi.
7. `## Xulosa` - 4-6 ta qisqa band.

- Matn hajmi: kamida 1100 so'z (kod bloklarisiz), maqsad 1500-2200. Chuqur mavzularda ko'proq.
- Kamida bitta ` ```ts ` (yoki `js`, `tsx`) blok: validator shuni talab qiladi.
- Boshqa darslarga havola: "(23-dars)" ko'rinishida, faqat `course.yaml`dagi raqam va mavzuga mos.
- Boshqa kurslar bilan kesishish: CS50 50-51-darslar va Go 87-dars xavfsizlikka kirish darajasida, System Design 8-moduli infratuzilma darajasida. Ularni takrorlamang, kerak joyda havola bering.

### "Misol" bo'limi: zaif kod, hujum, tuzatilgan kod

Har dars "Misol" bo'limi uch qismdan iborat (`###` sarlavhalar bilan):

1. **Zaif kod.** Real ko'rinishdagi, ishlaydigan, lekin zaif TypeScript kodi. Zaiflik kodda ataylab izohlanadi (`// ZAIF: ...`).
2. **Hujum.** Kirish ma'lumoti (payload yoki so'rov) va natija. Hujum faqat shu darsning o'quv kodiga qarshi. Natija `text` blokida, haqiqiy chiqish bilan bir xil.
3. **Tuzatilgan kod.** Tuzatish va **nima uchun yetarli ekani** tushuntiriladi: qaysi invariant endi saqlanadi, qaysi hujumlar yopildi, nima yopilmadi (qoldiq risk). "Tuzatish yetarli" degan gap faqat ko'rsatilgan hujumlar uchun to'g'ri ekanini yozing.

Imkon bo'lsa uchala qism ham ` ```ts run ` (yoki mos til) bloki bo'lsin, shunda o'quvchi o'zi sinab ko'radi.

## Interaktiv bloklar (`run` va `test`)

Maqsad: har darsda kamida bitta ishlaydigan `run` bloki, modul boshiga 1-2 testli mashq. Iloji bo'lmagan darslar hisobotda ro'yxatlanadi (sabab bilan).

### Qaysi til nima qiladi

- ` ```ts run ` / ` ```js run `: brauzerda Web Worker ichida, async o'ram bilan ishlaydi. Qoidalar:
  - `import`, `require`, tarmoq (`fetch` real serverga), Node API'lar (`fs`, `child_process`, `process`, `Buffer` va h.k.) **yo'q**.
  - Global `crypto.subtle` (WebCrypto), `crypto.getRandomValues`, `TextEncoder`, `URL` va top-level `await` ishlaydi. `crypto.subtle` Worker'da faqat secure context'da (https yoki localhost) mavjud; bu 2026-11-11 da haqiqiy Chromium'da Worker ichida SHA-256 va HMAC bilan tekshirilgan.
  - Natija `console.log` bilan chiqariladi. Vaqt chegarasi 5 soniya.
  - Lokal tekshiruv `node` + `sucrase` bilan ishlaydi; Node'da bor, lekin brauzerda yo'q API'ga (masalan `Buffer`, `require("node:crypto")`) tayanmang: lokal ishlaydi, brauzerda ishlamaydi.
- ` ```python run `: Pyodide. `sqlite3`, `bcrypt`, `argon2`, `cryptography` mavjud. **`hashlib.scrypt` va `hashlib.pbkdf2_hmac` mavjud emas** (ma'lum cheklov): ular kerak bo'lsa, `argon2`/`bcrypt` yoki `cryptography` ishlating, yoki `ts run` ichida WebCrypto (`PBKDF2`). Vaqt chegarasi 15 soniya.
- ` ```sql run `: SQLite (sql.js). Jadval va ma'lumot shu blok ichida yaratiladi.
- ` ```html run `: sandbox iframe; XSS, CSP va DOM demolari uchun. Ixtiyoriy ` ```js test ` bloki sahifa yuklangandan keyin DOM'ni tekshiradi.
- Server, tarmoq yoki fayl tizimiga bog'liq kod (NestJS controller/guard, Prisma, Kysely, Redis, Docker, Kubernetes manifestlari) `run` bloki **bo'lmaydi**. Bunday kod oddiy ` ```ts ` bloki bo'lib qoladi, sintaksis jihatidan to'g'ri TypeScript bo'lishi shart (tekshirish: `typescript` paketi bilan `ts.transpileModule`; tashqi modul tiplari yo'qligi xato emas) va hisobotda "ishga tushirilmagan" deb ro'yxatga kiritiladi. Imkon bo'lsa, mexanizmni sof funksiya sifatida `run` blokida ham ko'rsating (masalan tenant filtri, imzo tekshiruvi, URL tahlili).
- Natijani kod blokidan keyin oddiy ` ```text ` blokida bering. U `run-blocks.py` ning haqiqiy chiqishi bilan bir xil bo'lishi shart. Tasodifiy yoki vaqtga bog'liq chiqishni (`Date.now()`, `Math.random()`, `crypto.randomUUID()`) chop etmang; kerak bo'lsa deterministik qiymat bering.

### Ishga tushirish va tekshirish

Har `run` va `test` bloki lokal ishga tushiriladi:

```
python3 scripts/run-blocks.py content/appsec/lessons/NNN-slug.md
```

Natija darsdagi `text` bloki bilan solishtiriladi. Testli mashqning boshlang'ich kodi `TEST XATO` beradi (bu kutilgan), namunaviy yechim esa hamma testdan o'tadi: yechimni vaqtincha alohida faylda `run-blocks.py` bilan tekshiring. `html run` bloklari uchun lokal `playwright` kerak; u yo'q bo'lsa, blokni hisobotda "lokal tekshirilmagan" deb belgilang.

### Testli mashq (`test` bloki)

`run` blokidan darhol keyin shu tildagi ` ```<til> test ` bloki qo'yilsa, u o'quvchiga ko'rinmaydi va blok mashqqa aylanadi:

````
```ts run
function riskScore(l: number, i: number): number {
  return l + i; // tuzating
}
```

```ts test
check("3 x 5 = 15", () => riskScore(3, 5) === 15);
```
````

- Tillar: `python`, `js`, `ts`, `html` (`html` uchun test tili `js`). `check("nom", fn)`: `fn` `false` qaytarsa yoki xato tashlasa test o'tmaydi; `fn` `async` bo'lishi mumkin.
- Test nomi o'quvchi nimani tuzatishi kerakligini aytsin.
- Ikki blok orasida matn bo'lmasin, tillar bir xil bo'lsin (validator tekshiradi).
- **Boshlang'ich kod testlardan o'tmasligi, yechim esa hammasidan o'tishi kerak.**
- Xavfsizlik mashqlarida faqat "to'g'ri javob"ni emas, hujum kiritishlarini ham tekshiring (masalan, `' OR 1=1 --` kiritishi bo'sh natija berishi kerak).

## Mashqlar (frontmatter)

- `quiz`: 5-6 savol. Faktni yodlash emas, tushunishni tekshirsin (vaziyat, kod parchasi, "bu hujum ishlaydimi", "qaysi tuzatish yetarli"). Noto'g'ri variantlar ishonarli bo'lsin. `answer` - 0 dan boshlanadigan indeks. **To'g'ri javob o'rnini aralashtiring** (0, 1, 2, 3 hammasi uchrasin; hammasi bir indeksda bo'lmasin). `explain` nega to'g'ri va nega boshqalari noto'g'ri ekanini aytadi.
- `task`: amaliy topshiriq. `lang: ts`. `starter` - zaif, lekin ishlaydigan kod (15-60 qator), oxirida natijani chop etuvchi `console.log`lar bilan. `solution` - to'liq yechim. `solutionNotes` - markdown ro'yxat, nima va nega, shuningdek tuzatish nimani qoplamasligi. `checklist` - 3-6 ta tekshiriladigan band. Boshlang'ich kod va yechimni `run-blocks.py` bilan ishga tushiring (kodni vaqtincha ` ```ts run ` blokiga o'rab); yechim topshiriq shartini bajarishini chiqish bilan tasdiqlang.
- Topshiriq ishga tushiriladigan sof TypeScript bo'lsin (import yo'q). Server kodini topshiriq qilmang; mexanizmni sof funksiyaga ajrating.

## YAML ehtiyotkorligi

- `: ` yoki `#` bor, yoki `"`/`'`/`[`/`{`/`-` bilan boshlanadigan qiymatlarni qo'shtirnoqqa oling.
- Qo'shtirnoq ichida `"` bo'lsa `\"` qiling. TypeScript kodida `"` ko'p: kod va ko'p qatorli matn uchun `|` block scalar, bir xil chekinish bilan.
- Frontmatter ichidagi kodda tab o'rniga bo'shliq ishlating (YAML tab'ni taqiqlaydi).
- Quiz savoli ichida kod bloki kerak bo'lsa, qo'shtirnoqli qatorda `\n` bilan yozing yoki `|` block scalar ishlating.

## Atamalar lug'ati

Dars yangi texnik atamani tushuntirsa, uni `content/glossary/appsec-mNN.yaml`ga qo'shing:

```yaml
- term: CIA triadasi
  aliases: ["CIA triad", "CIA"]
  uz: "Xavfsizlikning uch asosiy xususiyati: maxfiylik, yaxlitlik va mavjudlik."
  course: appsec
  lesson: 1
```

- `term` va `aliases` - darslar matnida aynan shu ko'rinishda uchraydigan shakllar. Atama faqat o'z kursi darslarida bog'lanadi. Katta harfli qisqartmalar faqat katta harf bilan topiladi. Validator atama o'z darsida (`lesson`) matnda uchrashini talab qiladi.
- `uz` - 1-2 gap, oddiy matn (10-400 belgi). `lesson` - atama batafsil tushuntirilgan dars.
- Umumiy so'zlarni (data, server, token, request) qo'shmang. Takror yo'q: boshqa fayllardagi (system-design, clean-code, cs50, go, boshqa appsec-mNN) atamalarni tekshiring. Bir atama boshqa kursda ham bor bo'lsa, `course: appsec` bilan qo'shish mumkin (validator kurslar bo'yicha ajratadi), lekin ta'rif shu kurs kontekstida yozilsin.

## Hisobot (agent oxirida, qisqa, inglizcha)

- Yozilgan fayllar ro'yxati va har birining so'z soni (kodsiz).
- `run`/`test` bloklari: nechta, hammasi `run-blocks.py` dan o'tdimi; ishga tushirilmagan kod (sabab bilan: server/tarmoq yoki tashqi modul).
- Ishonchsiz yoki tekshirib bo'lmagan faktlar.
- Qo'shilishi so'ralgan yangi manbalar (id, sarlavha, muallif, yil, kind, tekshirilgan URL).
- Dars sarlavhasiga kiritilgan o'zgartirish (agar kerak bo'lsa) va sababi.
- Validator natijasi (`npm run validate -- appsec N M`).
