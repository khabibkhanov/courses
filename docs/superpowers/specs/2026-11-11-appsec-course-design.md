# Application Security kursi - dizayn (spec)

Sana: 2026-11-11. Holat: foydalanuvchi ko'rib chiqishi kutilmoqda.

## Maqsad

Enth Academy saytiga (repo `khabibkhanov/courses`) yangi 100 darslik "Application Security" kursini qo'shish. Bu Security yo'nalishining birinchi kursi. Keyingi kurslar (alohida spec bilan, bu ish doirasiga kirmaydi): Offensive (pentest), Defensive (SOC, incident response, forensics), tarmoq va OS xavfsizligi asoslari.

Muvaffaqiyat mezoni:
- `/appsec` da 100 dars ochiladi, har birida test va amaliy topshiriq bor.
- `npm run build` (validator bilan) xatosiz o'tadi.
- Har dars mustaqil fact-check'dan o'tgan, barcha `run` bloklari ishga tushirilgan.
- Lug'at va loyiha hujjatlari yangilangan.

## Foydalanuvchi aytgani va taxminlar

Aytilgan: cyber security darslari kerak; mavjud kurslar modeliga mos; avval AppSec, keyin qolgan yo'nalishlar; darslar soni, modullar va mavzular mavjud kurslarga o'xshab tanlansin; tekshirilgan holda topshirilsin.

Taxmin (tasdiqlangan dizayndan): 100 dars, 10 modul, Go kursi formati, parallel yozuvchi agentlar va mustaqil tekshiruvchilar, `main`ga push va Vercel production deploy.

## Kurs parametrlari

| Parametr | Qiymat |
|---|---|
| slug / yo'l | `appsec` / `/appsec` |
| title | Application Security |
| Joy | `content/appsec/` (`course.yaml`, `sources.yaml`, `AUTHORING.md`, `lessons/NNN-slug.md`) |
| format | `clean-code` (frontmatter ichida `quiz` va `task`) |
| passScore | 1 (hamma savol to'g'ri) |
| order | 5 |
| color | `#7c3aed` |
| Lug'at | `content/glossary/appsec-mNN.yaml`, `course: appsec` |

O'quvchi: backend/fullstack dasturchi (Node.js/TypeScript, PostgreSQL, Redis tajribasi bor). Dasturlash asoslari tushuntirilmaydi; har mavzu mexanizm darajasida beriladi.

Misollar: Node.js (NestJS/Fastify/Express), Next.js/React, PostgreSQL, Prisma/Kysely, Redis. O'quv misoli - neytral "avtopark monitoring platformasi" (GPS telemetriya, yoqilg'i datchiklari, video, haydovchilar). Kompaniya nomi yo'q.

## Dars standarti

Go kursining `AUTHORING.md` asosida, AppSec'ga moslangan `content/appsec/AUTHORING.md` yoziladi.

Majburiy `##` bo'limlar (validator `clean-code` qoidasi): Muammo; Asosiy g'oya; Chuqurroq: ...; Misol: ...; Qachon qo'llamaslik kerak; Xulosa. Tavsiya etiladigan qo'shimcha: `## Stack'da: ...`.

AppSec'ga xos qoidalar:
- "Misol" bo'limi uch qismli: zaif kod, hujum (kirish ma'lumoti va natija), tuzatilgan kod. Tuzatish nima uchun yetarli ekani tushuntiriladi.
- Hujum namunalari faqat darsning o'zidagi o'quv kodiga qarshi. Real tizimlarga qarshi tayyor exploit, zararli dastur yoki real maqsadga yo'naltirilgan ko'rsatma yozilmaydi.
- Kamida 1100 so'z (kodsiz), maqsad 1500-2200. Kamida bitta `ts` kod bloki.
- Test: 5-6 savol, vaziyat va kod asosida; to'g'ri javob o'rni aralash. Topshiriq: `lang: ts`, `starter` (zaif, lekin ishlaydigan kod), `solution`, `solutionNotes`, `checklist`.
- Til qoidalari: o'zbek lotin, terminlar inglizcha, em-dash va en-dash yo'q, "deylik"/"taxminan" yo'q, emoji yo'q.
- Manbalar: faqat `sources.yaml`dagi id'lar; versiya, sana va raqamlar birlamchi manbadan tekshiriladi. Web tekshiruvi Kernel brauzeri orqali.

### Interaktiv bloklar

Repo'dagi runner'lar tekshirildi (`src/components/playground/runners.ts`, `src/lib/playground.ts`):
- `ts run` / `js run`: Web Worker ichida, async o'ram bilan. Top-level `await` ishlaydi. Tarmoq va Node API yo'q.
- `python run`: Pyodide; sqlite3, bcrypt, argon2, cryptography yuklanadi. `hashlib.scrypt` va `pbkdf2_hmac` yo'q (ma'lum cheklov).
- `sql run`: SQLite (sql.js).
- `html run`: sandbox iframe, `js test` bilan DOM testlari.
- Testli mashq: `python`, `js`, `ts`, `html` uchun `check("nom", fn)`.

Ishlatilishi:
- Injection demolari: `python run` + sqlite3 yoki `sql run`; parser va validatsiya demolari `ts run`.
- XSS, CSP va DOM demolari: `html run`.
- Kriptografiya: `ts run` ichida WebCrypto (`crypto.subtle`) yoki `python run` + cryptography. Worker'da `crypto.subtle` mavjudligi 1-namuna darsni yozishda haqiqiy brauzerda tekshiriladi; ishlamasa kriptografiya demolari Python'da bo'ladi.
- Server, tarmoq yoki fayl tizimiga bog'liq kod (NestJS guard, Prisma, Redis, Docker) `run` qilinmaydi; u TypeScript kompilyatsiyasidan o'tkaziladi, imkon bo'lsa mexanizm sof funksiya sifatida `run` blokida ko'rsatiladi.
- Maqsad: har darsda kamida bitta `run` bloki (iloji bo'lmagan darslar hisobotda ro'yxatlanadi), modul boshiga 1-2 testli mashq.

## Asosiy manbalar

2026-11-11 da rasmiy sahifadan tekshirilgan: OWASP Top 10 - joriy versiya 2025; OWASP ASVS 5.0.0 (30.05.2025); CWE Top 25 - 2025; OWASP Top 10 for LLM Applications - 2025.

Tekshirilishi kerak (sources.yaml bosqichida, har biri URL bilan): OWASP Top 10 2025 kategoriyalari ro'yxati; OWASP API Security Top 10 (2023); OWASP WSTG, Cheat Sheet Series, SAMM; NIST SP 800-63 (joriy tahrir), SP 800-218 (SSDF), FIPS 203/204; CVSS, EPSS, CISA KEV; RFC'lar (HTTP, cookie, TLS 1.3, OAuth 2.0 va security BCP, JWT va JWT BCP, WebAuthn - W3C); MDN va WHATWG (Fetch, HTML) spetsifikatsiyalari; Node.js, Next.js, NestJS, Prisma, PostgreSQL, Redis rasmiy xavfsizlik hujjatlari; SLSA, Sigstore, npm provenance; lex.uz (kiberxavfsizlik va shaxsiy ma'lumotlar bo'yicha qonunlar); case study'lar uchun rasmiy hisobotlar (CVE yozuvlari, sud va regulyator hujjatlari, loyihalarning o'z post-mortem'lari).

Kitoblar faqat nashriyot sahifasidan mundarijasi tasdiqlansa manba sifatida kiritiladi.

## Syllabus

Dars nomlari yakuniy emas: manbalar tekshirilganda aniqlashtiriladi (masalan, Top 10 2025 kategoriya nomlari), lekin modul tarkibi va tartibi shu.

### 1-modul. Asoslar va threat modeling
1. Xavfsizlik nima: CIA, tahdid, zaiflik va risk
2. Hujumchi modeli va attack surface
3. Secure design tamoyillari: least privilege, defense in depth, fail-safe defaults
4. Threat modeling: data flow diagram, trust boundary va STRIDE
5. Threat modeling amaliyotda: avtopark platformasi modeli
6. OWASP Top 10 2025: xarita va undan qanday foydalanish
7. CWE, CVE, CVSS, EPSS va KEV
8. ASVS 5.0: xavfsizlik talablarini yozish va tekshirish
9. Huquqiy va etik chegaralar: O'zbekiston qonunchiligi va responsible disclosure
10. Xavfsiz laboratoriya muhiti va kurs bo'ylab ishlatiladigan zaif ilova

### 2-modul. Web platforma xavfsizlik modeli
11. HTTP xavfsizlik nuqtai nazaridan: request, header va parser farqlari
12. Origin, site va same-origin policy
13. Cookie: Secure, HttpOnly, SameSite va prefikslar
14. CORS: preflight, credentials va xato sozlamalar
15. Content Security Policy: direktivalar, nonce va strict-dynamic
16. Security header'lar: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
17. Fetch Metadata va cross-origin izolyatsiya (COOP, COEP, CORP)
18. HTTPS amaliyotda: TLS sozlamalari, sertifikat va mixed content
19. Brauzer storage: token qayerda saqlanadi
20. Request smuggling, cache poisoning va proxy zanjiri

### 3-modul. Injection
21. Injection'ning umumiy modeli: ma'lumot va kod chegarasi
22. SQL injection: turlari va parametrlangan so'rovlar
23. ORM va query builder tuzoqlari: Prisma va Kysely raw so'rovlari
24. NoSQL va Redis injection
25. Command injection va child_process
26. Path traversal va fayl yo'llari
27. SSRF: ichki tarmoq va cloud metadata
28. Server-side template injection
29. Deserialization va prototype pollution
30. ReDoS va kirish validatsiyasi strategiyasi

### 4-modul. Client-side hujumlar
31. XSS turlari: reflected, stored va DOM-based
32. Output encoding: HTML, atribut, JavaScript va URL kontekstlari
33. React va Next.js'da XSS tuzoqlari
34. Sanitization va Trusted Types
35. CSP'ni Next.js ilovasida joriy qilish
36. CSRF: mexanizm va himoya usullari
37. Clickjacking va frame siyosati
38. Open redirect va URL validatsiyasi
39. postMessage va iframe orasidagi aloqa
40. Uchinchi tomon skriptlari va Subresource Integrity

### 5-modul. Authentication
41. Authentication modeli: faktorlar va ishonch darajalari
42. Parol saqlash: Argon2id, scrypt, bcrypt
43. Parol siyosati, credential stuffing va brute force himoyasi
44. Multi-factor authentication: TOTP, push va SMS xavflari
45. Passkey va WebAuthn
46. Session boshqaruvi: identifikator, muddat, bekor qilish
47. JWT: tuzilishi, tuzoqlari va qachon kerak emas
48. OAuth 2.0: oqimlar, PKCE va security best practice
49. OpenID Connect va tashqi provayder orqali kirish
50. Account recovery va email tasdiqlash

### 6-modul. Authorization
51. Access control modellari: RBAC, ABAC, ReBAC
52. IDOR va object-level authorization
53. Funksiya darajasidagi authorization va admin funksiyalari
54. Mass assignment va property-level authorization
55. Multi-tenancy: tenant izolyatsiyasi
56. PostgreSQL row-level security
57. Policy engine'lar va markazlashgan authorization
58. NestJS va Next.js'da authorization: guard, middleware, server action
59. Business logic zaifliklari
60. Race condition va TOCTOU

### 7-modul. Amaliy kriptografiya
61. Kriptografiya xaritasi: primitive'lar va o'zingiz yozmaslik qoidasi
62. Hash funksiyalari va HMAC
63. Simmetrik shifrlash va AEAD
64. Asimmetrik kriptografiya: kalit almashish va raqamli imzo
65. TLS 1.3 handshake
66. PKI, sertifikatlar va mTLS
67. Tasodifiylik: CSPRNG va token generatsiyasi
68. Kalit boshqaruvi: KMS, envelope encryption, rotatsiya
69. Secrets management
70. Ma'lumotni shifrlab saqlash va post-quantum kriptografiyaga o'tish

### 8-modul. API va backend xavfsizligi
71. OWASP API Security Top 10: xarita
72. Sxema asosida kirish validatsiyasi
73. Rate limiting va resurs iste'molini cheklash
74. Fayl yuklash xavfsizligi
75. Webhook'lar: imzo, replay va idempotency
76. GraphQL xavfsizligi
77. WebSocket va real-time kanallar
78. Xatolarni boshqarish va fail-safe xatti-harakat
79. Security logging, audit log va alerting
80. LLM asosidagi ilovalar xavfsizligi

### 9-modul. Supply chain va DevSecOps
81. Bog'liqliklar xavfi: npm ekotizimi
82. Lockfile, provenance, SBOM va SLSA
83. SAST va secret scanning
84. DAST va fuzzing
85. CI/CD xavfsizligi
86. Konteyner xavfsizligi: Docker
87. Kubernetes xavfsizligi asoslari
88. Cloud IAM va noto'g'ri konfiguratsiya
89. PostgreSQL va Redis'ni mustahkamlash
90. Secure SDLC va zaifliklarni boshqarish

### 10-modul. Amaliyot
91. Security code review metodikasi
92. O'z ilovangizni xavfsizlik bo'yicha sinash (WSTG asosida)
93. Incident response asoslari
94. Shaxsiy ma'lumotlar: O'zbekiston qonunchiligi va privacy by design
95. Compliance xaritasi: PCI DSS, ISO/IEC 27001, SOC 2
96. Case study: Log4Shell
97. Case study: SSRF va cloud IAM orqali ma'lumot sizishi
98. Case study: supply chain hujumlari
99. Case study: avtopark platformasining to'liq xavfsizlik auditi
100. Capstone: zaif servisni mustahkamlash

Boshqa kurslar bilan kesishish: CS50 50-51-darslar va Go 87-dars xavfsizlikka kirish darajasida; System Design 8-moduli infratuzilma darajasida. AppSec ularni takrorlamaydi, kerak joyda havola beradi.

## Kod o'zgarishlari (kontentdan tashqari)

Minimal. Kutilayotgan o'zgarishlar:
- `content/appsec/` va `content/glossary/appsec-m01..10.yaml` (yangi fayllar).
- Kurs reestri avtomatik (`listCourses` `content/*/course.yaml`ni o'qiydi) - reja bosqichida tasdiqlanadi. Bosh sahifa, sitemap, qidiruv indeksi va OG rasm yangi kursni o'zi olishi kerak; olmasa, shu joylarga bitta yozuv qo'shiladi.
- `scripts/validate.ts`: o'zgarish kutilmaydi (`clean-code` qoidasi `ts` blokni talab qiladi, AppSec bunga mos).
- Runner'larga o'zgarish kiritilmaydi. Biror demo runner cheklovi sababli ishlamasa, demo o'zgartiriladi, runner emas.

## Jarayon

1. `sources.yaml`: har manba Kernel brauzerida ochilib tekshiriladi.
2. `course.yaml` (yakuniy dars nomlari, slug'lar, manba id'lari), `AUTHORING.md`, 1-dars namuna. 1-dars production brauzerida emas, lokal `next start`da ko'riladi.
3. 10 ta parallel yozuvchi agent (har biri bitta modul). Agent faqat o'z dars fayllari va o'z modul lug'atini yozadi; git, npm, build ishga tushirmaydi; oxirida hisobot beradi.
4. 5 ta mustaqil tekshiruvchi agent (har biri 20 dars): faktlar, versiyalar, kod, test javoblari, manbalar. Tuzatishlar kiritiladi.
5. `scripts/run-blocks.py` bilan barcha `run` va `test` bloklari; TypeScript bloklari kompilyatsiyasi; `npm run validate -- appsec 1 100`; `npm run build`.
6. Modul bo'yicha commit, `main`ga push, Vercel deploy; production'da sahifalar va run bloklari tekshiriladi.
7. Loyiha hujjatlari: `claude/00-loyiha-umumiy.md` yangilanadi, `claude/05-appsec-kursi.md` yoziladi (ochiq cheklovlar bilan).

## Xavflar va cheklovlar

- Tekshirib bo'lmagan fakt matnga kirmaydi yoki ochiq belgilanadi; ro'yxati yakuniy hisobotda.
- Tashqi kutubxona kodi (NestJS, Prisma, Redis mijozlari) sandbox'da ishga tushirilmasligi mumkin: bunday bloklar "ishga tushirilmagan" deb hisobotda ko'rsatiladi.
- Huquqiy darslar (9, 94) faqat lex.uz'dagi amaldagi matnlarga tayanadi.
- Hajm: taxminan 100 fayl, 150-220 ming so'z. Bitta sessiyada tugamasa, modul chegarasida to'xtatiladi va holat `claude/05-appsec-kursi.md`ga yoziladi.

## Doiradan tashqari

Offensive, Defensive va tarmoq/OS kurslari; yangi runner yoki platforma funksiyalari; server tomonda ishlaydigan laboratoriya (zaif ilovani hosting qilish).
