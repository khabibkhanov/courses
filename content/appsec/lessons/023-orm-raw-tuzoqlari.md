---
n: 23
slug: orm-raw-tuzoqlari
title: "ORM va query builder tuzoqlari: Prisma va Kysely raw so'rovlari"
summary: "ORM va query builder oddiy API orqali qiymatlarni parametrlaydi, lekin raw API'lar, dinamik identifikatorlar, `undefined` filtrlari va foydalanuvchi obyekti to'g'ridan-to'g'ri `where` ga uzatilishi injection va kirish nazoratini buzishi mumkin. Dars tuzoqlarni mini-model yordamida ko'rsatadi."
duration: 45
sources:
  - id: prisma-raw
    note: "Prisma Raw queries hujjati (v7): $queryRaw/$executeRaw tagged template qiymatlarni prepared statement parametri qiladi, $queryRawUnsafe/$executeRawUnsafe 'significant risk' deb belgilangan; o'zgaruvchi faqat qiymat o'rnida (identifikator, kalit so'z va string literal ichida emas); metodlar bir vaqtda bitta so'rov bajaradi; Prisma.sql, Prisma.join, Prisma.empty; Prisma.raw va yasalgan tagged template zaif misollari; SQL injection prevention bo'limi. Qo'shimcha: Null and undefined sahifasi (undefined = filtr yo'q, strictUndefinedChecks)"
  - id: kysely-raw
    note: "Kysely Raw SQL retsepti: sql tag qiymatlarni parametr qiladi; sql.ref, sql.table, sql.id identifikatorni quote qiladi lekin Database turiga qarshi tekshirmaydi; sql.raw matnni bog'lamaydi va tekshirmaydi, ishonchsiz qiymat bilan ishlatilmaydi. Kysely manba kodi (src/raw-builder/sql.ts, PostgreSQL query compiler) ham ishlatilgan"
  - id: cs-sqli
    note: "SQL Injection Prevention Cheat Sheet: parametrlash va allow-list tavsiyasi (22-darsdagi umumiy yo'nalish)"
quiz:
  - q: "Prisma'da quyidagilardan qaysi biri qiymatni parametr sifatida yuboradi?"
    options:
      - "prisma.$queryRawUnsafe(`SELECT * FROM \"Vehicle\" WHERE plate = '${plate}'`)"
      - "prisma.$queryRaw`SELECT * FROM \"Vehicle\" WHERE plate = ${plate}`"
      - "prisma.$queryRawUnsafe(\"SELECT ... WHERE plate = '\" + plate + \"'\")"
      - "Hech biri: raw so'rovlar hech qachon parametrlanmaydi"
    answer: 1
    explain: "Tagged template (`$queryRaw` va backtick darhol keyin) qiymatlarni alohida parametr sifatida jo'natadi. Unsafe variantlarga allaqachon yig'ilgan matn beriladi, shuning uchun qiymat sintaksis bo'lib qoladi."
  - q: "`where: { email, resetToken: req.query.token }` kodida token so'rovda berilmadi (`undefined`). Prisma'da nima bo'ladi va nega xavfli?"
    options:
      - "Xato tashlanadi, shuning uchun xavfsiz"
      - "Hech narsa topilmaydi"
      - "`undefined` bo'lgan shart filtrdan tushib qoladi; foydalanuvchi faqat email bo'yicha topiladi va tokensiz parol tiklash mumkin bo'ladi"
      - "`resetToken IS NULL` sharti qo'shiladi"
    answer: 2
    explain: "Prisma `undefined` qiymatni 'shart yo'q' deb talqin qiladi (`null` esa IS NULL). Shuning uchun majburiy maydonni qo'lda tekshirmasangiz, filtr jimgina kuchsizlanadi. Bu injection emas, ammo authorization/autentifikatsiyani chetlab o'tadi."
  - q: "Kyselyda foydalanuvchi ustun nomini beradi va kod `sql.ref(userColumn)` ishlatadi. Nima kafolatlanadi va nima kafolatlanmaydi?"
    options:
      - "`sql.ref` nomni quote qiladi, lekin tekshirmaydi: foydalanuvchi har qanday ustunni (masalan, `password_hash`) tanlay oladi va hujjat ishonchsiz kiritish bilan ishlatmaslikni aytadi, shuning uchun allow-list kerak"
      - "Hech narsa kafolatlanmaydi, `sql.ref` xavfsiz emas"
      - "Hamma narsa kafolatlanadi, allow-list kerak emas"
      - "Faqat raqamli ustunlar tanlanadi"
    answer: 0
    explain: "Kysely retsepti `sql.ref` identifikatorni quote qilishini, lekin `Database` turiga qarshi tekshirmasligini yozadi. Kimga qaysi ustun ruxsat etilganini kutubxona hal qilmaydi: bu ma'lumot sizishi (authorization) masalasi, uni kodda yozilgan allow-list yopadi. Allow-list'siz ishonchsiz nomni berish hujjat bo'yicha ham mumkin emas."
  - q: "Kod `req.body` ni to'g'ridan-to'g'ri `prisma.vehicle.findMany({ where: req.body })` ga beradi. Qaysi xavf bor?"
    options:
      - "Xavf yo'q: Prisma parametrlaydi, demak xavfsiz"
      - "Klient `where` ichiga operatorlar va munosabat filtrlarini (masalan, `{ tenantId: { not: 'alfa' } }`) yuborib, mo'ljallangan filtrni o'zgartira oladi"
      - "Faqat SQL injection xavfi bor"
      - "Faqat sekinlashish xavfi bor"
    answer: 1
    explain: "SQL parametrlangan, lekin filtrning mantiqiy tuzilishini mijoz boshqaradi. Bu 'obyekt in'ektsiyasi': qiymat o'rniga operator obyekti keladi. Tuzatish: kiritishni sxema bilan tekshirish va `where` ni serverda yig'ish."
  - q: "`ORDER BY ${sort}` ni tagged template bilan yozdingiz: sql`... ORDER BY ${sort}`. Natija nima?"
    options:
      - "Injection ishlaydi, chunki sort matn"
      - "Bu to'g'ri va xavfsiz tartiblash"
      - "Kompilyatsiya xatosi"
      - "Qiymat parametrga aylanadi (`ORDER BY $1`); injection yo'q, lekin parametr ustun nomi o'rnini egallay olmaydi (Prisma hujjati ham bunday so'rov ishlamasligini yozadi). Ustun uchun allow-list va identifikator yordamchisi kerak"
    answer: 3
    explain: "Tagged template har interpolatsiyani parametr qiladi. Parametr faqat qiymat o'rnida turadi, identifikator va kalit so'z o'rnida emas, shuning uchun to'g'ri yechim - allow-list orqali tanlangan ustunni identifikator sifatida qo'shish."
  - q: "Quyidagi tuzatishlardan qaysi biri `$queryRawUnsafe` ishlatadigan kodda eng ishonchli?"
    options:
      - "Qiymatdan `'` belgilarini olib tashlash"
      - "Qiymatni `JSON.stringify` qilib qo'shish"
      - "So'rovni tagged template ($queryRaw) shakliga o'tkazish; identifikator kerak bo'lsa allow-list"
      - "Qiymat uzunligini 50 belgi bilan cheklash"
    answer: 2
    explain: "Mexanizmni yopish - qiymatni parametr qilish. Belgi o'chirish, JSON kodlash va uzunlik cheklovi bitta kontekstga moslangan yamoqlar, ularni chetlab o'tish yo'llari bor."
task:
  title: "Parol tiklash: undefined filtri va obyekt in'ektsiyasi"
  prompt: |
    Mini-ORM `findFirst(where)` Prisma kabi ishlaydi: qiymati `undefined` bo'lgan kalitlar filtrdan tushadi, `{ not: x }` operatori "x ga teng emas" degan ma'noni beradi. `findResetUser(email, token)` parol tiklash tokenini tekshirish uchun foydalanuvchini qidiradi, lekin ikki holatda tokensiz foydalanuvchini qaytaradi: token berilmasa (`undefined`) va token satr o'rniga `{ not: "" }` obyekti bo'lsa (JSON body'dan kelganda).

    Funksiyani tuzating: token faqat bo'sh bo'lmagan satr bo'lsa qidirilsin, aks holda `null` qaytsin. Imzoni o'zgartirmang. Oxirgi uch `console.log` kutilgan: `null`, `null`, va to'g'ri token uchun foydalanuvchi emaili.
  lang: ts
  starter: |
    type Row = { email: string; resetToken: string };
    const users: Row[] = [
      { email: "ali@alfa.test", resetToken: "t-111" },
      { email: "vali@alfa.test", resetToken: "t-222" },
    ];

    // Prisma kabi: undefined - "shart yo'q", { not: x } - "x ga teng emas"
    function findFirst(where: Record<string, unknown>): Row | null {
      return (
        users.find((u) =>
          Object.entries(where).every(([k, v]) => {
            if (v === undefined) return true;
            const cell = (u as Record<string, string>)[k];
            if (v !== null && typeof v === "object" && "not" in v) return cell !== (v as { not: string }).not;
            return cell === v;
          }),
        ) ?? null
      );
    }

    function findResetUser(email: string, token: unknown): Row | null {
      return findFirst({ email, resetToken: token });
    }

    console.log("token yo'q:", findResetUser("ali@alfa.test", undefined)?.email ?? null);
    console.log("obyekt token:", findResetUser("ali@alfa.test", { not: "" })?.email ?? null);
    console.log("to'g'ri token:", findResetUser("ali@alfa.test", "t-111")?.email ?? null);
  solution: |
    type Row = { email: string; resetToken: string };
    const users: Row[] = [
      { email: "ali@alfa.test", resetToken: "t-111" },
      { email: "vali@alfa.test", resetToken: "t-222" },
    ];

    // Prisma kabi: undefined - "shart yo'q", { not: x } - "x ga teng emas"
    function findFirst(where: Record<string, unknown>): Row | null {
      return (
        users.find((u) =>
          Object.entries(where).every(([k, v]) => {
            if (v === undefined) return true;
            const cell = (u as Record<string, string>)[k];
            if (v !== null && typeof v === "object" && "not" in v) return cell !== (v as { not: string }).not;
            return cell === v;
          }),
        ) ?? null
      );
    }

    function findResetUser(email: string, token: unknown): Row | null {
      if (typeof email !== "string" || typeof token !== "string" || token.length === 0) return null;
      return findFirst({ email, resetToken: token });
    }

    console.log("token yo'q:", findResetUser("ali@alfa.test", undefined)?.email ?? null);
    console.log("obyekt token:", findResetUser("ali@alfa.test", { not: "" })?.email ?? null);
    console.log("to'g'ri token:", findResetUser("ali@alfa.test", "t-111")?.email ?? null);
  solutionNotes: |
    - Majburiy filtr qiymati so'rov chegarasida turi va mazmuni bo'yicha tekshiriladi: faqat bo'sh bo'lmagan `string` o'tadi. `undefined` va operator obyekti `findFirst` ga umuman yetib bormaydi.
    - Bu injection emas, lekin sababi bir xil: kiritilgan qiymat ma'lumot o'rniga so'rovning tuzilishiga (qaysi shartlar bor, qaysi operator) ta'sir qildi.
    - Real kodda tekshiruv sxema kutubxonasi bilan (72-dars) bajariladi, token esa vaqti bilan cheklangan va bir martalik bo'lishi kerak (50-dars).
    - Tuzatish qoplamaydi: tokenni vaqt bo'yicha solishtirish xavfi, urinishlar chastotasi cheklovi (73-dars) va tokenning o'zi xesh sifatida saqlanishi.
  checklist:
    - "`undefined` token `null` qaytaradi"
    - "Token sifatida obyekt kelsa `null` qaytadi"
    - "To'g'ri token foydalanuvchini qaytaradi"
    - "Filtr qiymatlari `findFirst` ga turi tekshirilgandan keyin uzatiladi"
    - "Bu injection emas, tuzilma o'zgarishi ekanini tushuntira olasiz"
---

## Muammo

"Biz ORM ishlatamiz, SQL injection bizga tegishli emas." Bu gap yarim to'g'ri. Prisma `findMany` va Kysely `where("plate", "=", value)` qiymatlarni parametr sifatida yuboradi va oddiy yo'lda SQL injection yo'q (22-dars). Lekin real loyihada ORM bilan birga doim chetga chiqish nuqtalari bo'ladi: murakkab hisobot uchun raw so'rov, dinamik saralash, qidiruv filtri, bulk operatsiya. Xavfsizlik shu chetga chiqish nuqtalarida buziladi, chunki ularda dasturchi yana matn yig'adi.

Ikkinchi muammo: ORM tilida yangi turdagi xato paydo bo'ladi. Qiymat o'rniga obyekt kelishi, `undefined` ning "shart yo'q" deb talqin qilinishi, `where` ni mijoz obyekti bilan to'ldirish. Bularda SQL buzilmaydi: so'rovning mantiqi o'zgaradi. Bu 21-darsdagi umumiy modelning ORM variantidir: foydalanuvchi qiymati ma'lumot kanalidan chiqib, so'rov tuzilishiga (boshqaruv kanaliga) ta'sir qiladi.

Dars Prisma va Kysely raw API'lari qanday ishlashini, qaysi shakl xavfsiz va qaysi xavfsiz emasligini, hamda ORM-ga xos "mantiqiy in'ektsiya" tuzoqlarini ko'rsatadi. Prisma va Kysely kodi brauzer worker'ida ishlamaydi, shuning uchun mexanizmni oddiy mini-modelda ishga tushiramiz, real API ko'rinishini esa alohida kod blokida beramiz.

## Asosiy g'oya

### ORM nimani kafolatlaydi

ORM va query builder oddiy (non-raw) API'da quyidagini kafolatlaydi: qiymatlar parametr sifatida uzatiladi va identifikatorlar (jadval, ustun nomlari) kutubxona ichidagi sxema yoki kodda yozilgan nomlardan keladi. Ular quyidagini kafolatlamaydi:

- Raw API'ga berilgan matn tekshirilmaydi.
- Dasturchi tomonidan berilgan obyektning mazmuni (qaysi maydon, qaysi operator) tekshirilmaydi.
- Qaysi foydalanuvchi qaysi ma'lumotga ega bo'lishi (authorization) hal qilinmaydi.

### Prisma: tagged template va Unsafe

Prisma hujjatiga ko'ra raw so'rovlar uchun ikki oila API bor: tagged template shakli (`$queryRaw`, `$executeRaw`) va "Unsafe" shakli (`$queryRawUnsafe`, `$executeRawUnsafe`). Prisma hujjati ularni shunday ajratadi: tagged template shakli oddiy foydalanishda xavfsiz, "Unsafe" nomli metodlar esa ancha moslashuvchan, lekin SQL injection xavfi sezilarli. Quyidagi jadval hujjatning raw queries va "SQL injection prevention" bo'limlariga tayanadi:

| Shakl | Qiymatlar | Xavf |
|---|---|---|
| ``prisma.$queryRaw`... ${x}` `` | `${x}` prepared statement parametri bo'ladi | Past; identifikator, kalit so'z va string literal ichida ishlamaydi |
| `prisma.$queryRawUnsafe(text, ...values)` | `text` tayyor matn, `values` `$1`, `$2` bilan bog'lanadi | Matn foydalanuvchi qiymati bilan yig'ilsa, injection; qiymatlarni ikkinchi argumentdan bering |
| `Prisma.sql`, `Prisma.join`, `Prisma.empty` | Parametrli bo'laklarni yig'ish, ro'yxatni ulash, shartli bo'lakni qo'shmaslik | Past, agar `Prisma.sql` ga beriladigan matn bo'laklari ishonchli bo'lsa |
| `Prisma.raw(str)` | `str` matn sifatida qo'shiladi | Hujjatda `Prisma.raw` ga kiritishni berish zaif misollar qatorida; faqat kodda yozilgan yoki allow-list'dan tanlangan qiymat |

Eng muhim qoida: `Unsafe` va `Prisma.raw` ga hech qachon foydalanuvchi qiymati bilan yig'ilgan matn bermang. `Unsafe` kerak bo'lsa (dinamik tuzilma), qiymatlarni `$1, $2` bilan ikkinchi argumentdan uzating: hujjat shu shaklni (PostgreSQL uchun `$1`, MySQL uchun `?`) xavfsiz deb ko'rsatadi, matnga qo'shib yasalgan shaklni esa zaif deb.

Hujjat tagged template uchun ham ogohlantiradi: `$queryRaw` faqat tagged template yoki `Prisma.sql` qabul qiladi, lekin tagged template'ni qo'lda "taqlid qilish" (matn massivini yasab, unga `raw` xossasini berish) yoki `Prisma.raw` ga ishonchsiz matn berish uni ham zaif qiladi. Ya'ni xavfsizlik metod nomida emas, so'rov matni qayerda yig'ilganida: so'rov matni chaqiruv joyida, kodda yozilgan holda turishi kerak, qiymatlar esa faqat `${}` orqali kirishi kerak.

### Kysely: `sql` tag va yordamchilar

Kysely'da raw bo'lak `sql` tagged template bilan yoziladi. `${value}` interpolatsiyasi parametrga aylanadi. Yordamchilar: Kysely Raw SQL retseptiga ko'ra `sql.ref`, `sql.table` va `sql.id` identifikatorlarni quote qiladi, lekin `Database` turiga nisbatan tekshirmaydi; `sql.raw` matnni bog'lamasdan va tekshirmasdan qo'shadi va ishonchsiz qiymat bilan ishlatilmasligi kerak. Kysely manba kodidagi izohlar ham `sql.ref`, `sql.table`, `sql.id`, `sql.lit` va `sql.raw` uchun ogohlantiradi: ishonchsiz kiritish bilan ishlatish SQL injection'ga olib keladi. Manba kodida PostgreSQL uchun identifikator ichidagi `"` belgisi ikkilantiriladi, shuning uchun qo'shtirnoqdan chiqib ketish yopilgan; lekin bu "nom to'g'ri va ruxsat etilgan" degani emas, kutubxona nomni hech narsaga solishtirmaydi. Qo'shimcha: `sql.join(array)` ro'yxat elementlarini parametr qilib vergul bilan ulaydi; `sql.lit` qiymatni parametr emas, matn sifatida SQL'ga yozadi. Taqqoslash:

| Yordamchi | Nimaga mo'ljallangan | Foydalanuvchi qiymati bilan |
|---|---|---|
| `sql\`${v}\`` | Qiymat (parametr) | Xavfsiz |
| `sql.ref(name)`, `sql.id(name)` | Identifikator (quote qilinadi, tekshirilmaydi) | Kutubxona ishonchsiz kiritish bilan ishlatmaslikni aytadi; ixtiyoriy ustun tanlanadi: allow-list kerak |
| `sql.lit(v)` | Literal (matnga yoziladi, parametr emas) | Faqat parametr yubora olmaydigan joyda va ishonchli qiymat bilan |
| `sql.raw(text)` | Matn o'zgarishsiz qo'shiladi | Foydalanuvchi qiymati bilan hech qachon |

## Chuqurroq: ORM-ga xos tuzoqlar

### 1. Dinamik identifikator

Eng ko'p uchraydigan xato: ``sql`ORDER BY ${sort}` ``. Bu injection emas, chunki `sort` parametrga aylanadi (`ORDER BY $1`), lekin so'rov o'ylangan ishni bajarmaydi. Prisma hujjati buni aniq yozadi: tagged template o'zgaruvchilari faqat qiymat o'rnida ishlatiladi, ustun, jadval va baza nomi yoki SQL kalit so'zi (masalan, `ORDER BY ${ordering}` dagi `desc`) o'rnida emas. Dasturchi "ishlamayapti" deb `Unsafe` yoki `sql.raw`ga o'tadi va injection shu paytda paydo bo'ladi. Hujjat dinamik jadval nomi uchun ham aynan shu yo'lni (`$queryRawUnsafe`) ko'rsatadi va uni foydalanuvchi kiritishi bilan ishlatish xavfini eslatadi; demak bu yerda allow-list majburiy. To'g'ri yo'l: ruxsat etilgan ustunlar xaritasi, kalit mijozdan, qiymat koddan (22-dars).

### 2. `undefined` va `null`

Prisma hujjatining "Null and undefined" sahifasiga ko'ra filtrda `undefined` "bu ustun uchun filtr belgilanmagan" degani: `where: { name: undefined }` butun jadvalni qaytaradi, `null` esa bo'sh (`IS NULL`) qiymatlarni qidiradi. Sahifa boshida hujjat o'zi ogohlantiradi: `undefined` so'rovga kiritilmaydi, bu kutilmagan natija va ma'lumot yo'qolishiga olib kelishi mumkin. Shu sababli `where: { email, resetToken: token }` da `token` kelmasa (`undefined`), so'rov faqat email bo'yicha ishlaydi. Tekshirilmagan HTTP kiritish `undefined` bo'lishi mumkin (parametr yo'q), shuning uchun majburiy maydonlarni oldin tekshirish kerak.

Hujjat bu uchun `strictUndefinedChecks` preview imkoniyatini ham tasvirlaydi: yoqilsa, filtrda aniq `undefined` berish runtime xatosiga aylanadi, maydonni ataylab o'tkazib yuborish uchun esa `Prisma.skip` ishlatiladi. Bu foydali qo'shimcha qatlam, lekin preview ekani va u faqat `undefined` ni yopishi (operator obyektini emas) sababli sxema tekshiruvini almashtirmaydi. Mini-modelda `undefined` va `{ not: x }` xatti-harakatini soddalashtirib ko'rsatamiz. `not` operatori Prisma filtrida haqiqatan mavjud ("qiymat n ga teng emas").

### 3. Obyekt in'ektsiyasi

JSON body'da `token` satr o'rniga `{ "not": "" }` kelsa va kod uni `where` ga o'zgarishsiz uzatsa, shart "token bo'sh emas" ga aylanadi. Express'da `qs` parser bilan `?token[not]=x` ham xuddi shunday obyekt hosil qiladi. Bu NoSQL injection bilan bir xil mexanizm (24-dars), faqat SQL ORM'da. Himoya: har kirishni sxema bilan (72-dars) turiga tekshirish va `where` ni serverda, ruxsat etilgan maydonlar bilan yig'ish.

### 4. To'g'ridan-to'g'ri `where`, `select`, `include`, `orderBy`

`prisma.vehicle.findMany({ where: req.body.filter, orderBy: req.body.orderBy, include: req.body.include })` mijozga hamma narsani beradi: munosabatlar orqali boshqa tenant ma'lumotini filtrlash, `include` bilan sezgir munosabatlarni olish, `orderBy` bilan yashirin maydon qiymatlarini tartib farqi orqali aniqlash. Bu xavf 54-darsda (mass assignment) va 52-darsda (IDOR) ham uchraydi: asosiy qoida, DTO sxemasi va serverda yig'ilgan so'rov.

### 5. Natijaga qarab filtrlash va select

ORM natijasi ko'pincha to'g'ridan-to'g'ri JSON bo'lib mijozga qaytadi. `select` ni mijoz belgilasa (`?fields=id,passwordHash`), ORM parametrlangan va xavfsiz so'rov yasaydi, lekin ruxsat etilmagan maydon qaytadi. Bu yana SQL injection emas, ma'lumot sizishi (54-dars). Tuzatish: qaytariladigan maydonlar ro'yxati serverda, har tur uchun alohida DTO.

### 6. Prisma raw API'ning cheklovlari va ulardan kelib chiqadigan vasvasalar

Hujjatda keltirilgan cheklovlar tez-tez "shu yerda Unsafe kerak" degan xulosaga olib boradi. Ularni bilish xavfsiz yechimni topishga yordam beradi:

- O'zgaruvchi SQL string literali ichida ishlamaydi: ``$queryRaw`SELECT 'Ism: ${name}'` `` kutilgandek bo'lmaydi. To'g'ri shakl: butun satrni o'zgaruvchi qilish yoki `'Ism: ' || ${name}` deb ulash. Ya'ni qiymat literal ichiga matn sifatida emas, alohida parametr sifatida kiradi.
- `LIKE`/`ILIKE` bilan `%` belgisi o'zgaruvchining ichida bo'lishi kerak (hujjat `` `%${fragment}` `` shaklini ko'rsatadi, `%$2` ishlamaydi). Bunda foydalanuvchi qiymatidagi `%` va `_` baribir wildcard bo'lib qoladi (22-dars).
- Bir nechta shartni dinamik qo'shish kerak bo'lsa, `Prisma.sql` va `Prisma.empty` bilan bo'laklar yig'iladi: shart bor bo'lsa ``Prisma.sql`WHERE name = ${n}` ``, yo'q bo'lsa `Prisma.empty` (hujjat bu joyga `""` yoki `NULL` qo'yib bo'lmasligini ta'kidlaydi). Matn bo'laklari esa faqat kodda yozilgan bo'ladi.
- So'rovni bir necha joyda bosqichma-bosqich yig'ish kerak bo'lsa, hujjat `Prisma.sql([bo'lak1, bo'lak2, ""], qiymat1, qiymat2)` shaklini xavfsiz deb ko'rsatadi, agar bo'laklar ishonchli bo'lsa; massivning oxirida bo'sh satr bo'lishi shart, chunki bo'laklar soni parametrlar sonidan bittaga ko'p.
- PostgreSQL'da `ALTER USER ... PASSWORD` kabi `ALTER` buyruqlari prepared statement'da ishlamaydi; hujjat `$executeRawUnsafe` yo'lini ko'rsatadi va uni xavfsiz emas deb belgilaydi. Bunday buyruq ilova kodiga emas, migratsiya skriptiga tegishli.

Bu ro'yxatning umumiy xulosasi: "parametr bilan bo'lmayapti" holati deyarli doim identifikator, kalit so'z yoki DDL bilan bog'liq; bunday qismlar kodda statik variant yoki allow-list sifatida yoziladi, qiymatlar esa parametr bo'lib qoladi.

### 7. Review va linter

Raw API'ning har chaqiruvi alohida review nuqtasi bo'lishi uchun loyihada ularni sanab chiqish kerak: `$queryRawUnsafe`, `$executeRawUnsafe`, `Prisma.raw`, `sql.raw`. Bu nomlar linter qoidasi yoki oddiy qidiruv bilan topiladi (83-dars) va ro'yxat har releasdan oldin ko'rib chiqiladi. Qoida: `Unsafe` yoki `raw` chaqiruvi yonida nima uchun kerakligi va qiymatlar qaerdan kelishi izohlangan bo'lishi kerak. Kysely'da `sql.raw` ga yuboriladigan har satr kodda yozilgan doimiy yoki allow-list natijasi bo'lishi shart, ya'ni uning manbasini fayl ichidan bir qarashda ko'rish mumkin bo'lishi kerak.

### 8. Tenant sharti va ORM

ORM'ni to'g'ri ishlatgan kod ham tenant shartini unutishi mumkin: `findUnique({ where: { id } })` boshqa tenant satrini qaytaradi. Bu injection emas, authorization (52-dars), lekin ORM xavfsizligi haqidagi suhbatda tez-tez shu bilan aralashtiriladi. Ikki qatlam foydali: tenant shartini so'rovga qo'shuvchi yagona yordamchi funksiya (yoki Prisma extension) va ma'lumotlar bazasidagi row-level security (56-dars).

## Misol: mini-model

Prisma va Kysely'ning raw API mexanizmini ikki kichik funksiya bilan modellashtiramiz: `sql` tagged template (`{ text, values }` qaytaradi) va "unsafe" funksiyasi (tayyor matn qabul qiladi). Bu haqiqiy kutubxona emas, faqat mexanizm modeli.

### 1. Zaif kod

```ts run
type Q = { text: string; values: unknown[] };

// Tagged template: har ${} parametr bo'ladi
function sql(strings: TemplateStringsArray, ...vals: unknown[]): Q {
  let text = strings[0];
  vals.forEach((_, i) => { text += `$${i + 1}` + strings[i + 1]; });
  return { text, values: vals };
}
// "Unsafe": tayyor matnni qabul qiladi
function queryRawUnsafe(text: string, ...values: unknown[]): Q {
  return { text, values };
}

// ZAIF 1: tayyor matn yig'ilgan, qiymat matnning ichida
function searchWeak(plate: string): Q {
  return queryRawUnsafe(`SELECT id FROM vehicles WHERE plate = '${plate}'`);
}
// ZAIF 2: "ishlamayapti" deb identifikator ham matnga qo'shilgan
function listWeak(sort: string): Q {
  return queryRawUnsafe(`SELECT id FROM vehicles ORDER BY ${sort}`);
}
// Tagged shakl identifikatorni parametr qiladi: injection yo'q, lekin ishlamaydi
function listBroken(sort: string): Q {
  return sql`SELECT id FROM vehicles ORDER BY ${sort}`;
}

console.log(searchWeak("01 A 111 AA").text);
console.log(listWeak("plate").text);
console.log(listBroken("plate"));
```

```text
SELECT id FROM vehicles WHERE plate = '01 A 111 AA'
SELECT id FROM vehicles ORDER BY plate
{
  "text": "SELECT id FROM vehicles ORDER BY $1",
  "values": [
    "plate"
  ]
}
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu raw so'rovdagi injection usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) va 278-4-moddasi (Kompyuter axborotini modifikatsiyalashtirish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi "alfa" foydalanuvchisi, o'quv funksiyalariga qarshi. Davlat raqami maydoniga `x' OR '1'='1` yuboriladi. Saralash maydoniga `id; DROP TABLE vehicles` (o'quv modelda faqat matn chiqadi).

```ts run
type Q = { text: string; values: unknown[] };
function queryRawUnsafe(text: string, ...values: unknown[]): Q {
  return { text, values };
}
function searchWeak(plate: string): Q {
  return queryRawUnsafe(`SELECT id FROM vehicles WHERE plate = '${plate}'`);
}
function listWeak(sort: string): Q {
  return queryRawUnsafe(`SELECT id FROM vehicles ORDER BY ${sort}`);
}

console.log(searchWeak("x' OR '1'='1").text);
console.log(listWeak("id; DROP TABLE vehicles").text);
```

```text
SELECT id FROM vehicles WHERE plate = 'x' OR '1'='1'
SELECT id FROM vehicles ORDER BY id; DROP TABLE vehicles
```

Birinchi so'rovda shart `'1'='1'` bilan har doim to'g'ri bo'ladi va hamma tenant'ning mashinalari qaytadi. Ikkinchisida ikkinchi buyruq (`DROP`) ishlashi bazaga va drayverga bog'liq: Prisma hujjatiga ko'ra uning raw metodlari bir vaqtda faqat bitta so'rov bajaradi, shuning uchun Prisma'da ikkinchi buyruq bajarilmaydi. Bu yo'qotish emas, yengillik xolos: bitta so'rov ichida `UNION` yoki shartli ifoda qo'shish baribir mumkin, ya'ni o'qish hujumi saqlanadi. Tagged shaklda esa bu payload'lar parametr bo'lib qolardi, shuning uchun "ishlamaydi" degan dasturchi `Unsafe` ga o'tgan edi.

### 3. Tuzatilgan kod

Qiymat tagged template bilan, identifikator esa allow-list orqali tanlangan va alohida "identifikator" bo'lagi sifatida. Modelda `ident` faqat allow-list'dan nom chiqaradi va uni quote qiladi (Kysely'da `sql.ref`, Prisma'da `Prisma.raw` ga allow-list natijasi beriladi).

```ts run
type Q = { text: string; values: unknown[] };
type Ident = { ident: string };

function sql(strings: TemplateStringsArray, ...vals: unknown[]): Q {
  let text = strings[0];
  const values: unknown[] = [];
  vals.forEach((v, i) => {
    if (v && typeof v === "object" && "ident" in v) text += (v as Ident).ident + strings[i + 1];
    else { values.push(v); text += `$${values.length}` + strings[i + 1]; }
  });
  return { text, values };
}

const SORTABLE: Record<string, string> = { plate: "plate", lastSeen: "last_seen_at" };
function sortIdent(name: string): Ident {
  const col = Object.hasOwn(SORTABLE, name) ? SORTABLE[name] : SORTABLE.plate;
  return { ident: `"${col}"` };
}

function search(tenant: string, plate: string): Q {
  return sql`SELECT id FROM vehicles WHERE tenant_id = ${tenant} AND plate = ${plate}`;
}
function list(tenant: string, sort: string): Q {
  return sql`SELECT id FROM vehicles WHERE tenant_id = ${tenant} ORDER BY ${sortIdent(sort)}`;
}

console.log(search("alfa", "x' OR '1'='1"));
console.log(list("alfa", "lastSeen"));
console.log(list("alfa", "id; DROP TABLE vehicles"));
```

```text
{
  "text": "SELECT id FROM vehicles WHERE tenant_id = $1 AND plate = $2",
  "values": [
    "alfa",
    "x' OR '1'='1"
  ]
}
{
  "text": "SELECT id FROM vehicles WHERE tenant_id = $1 ORDER BY \"last_seen_at\"",
  "values": [
    "alfa"
  ]
}
{
  "text": "SELECT id FROM vehicles WHERE tenant_id = $1 ORDER BY \"plate\"",
  "values": [
    "alfa"
  ]
}
```

Nima uchun yetarli: qiymatlar hamma joyda `values` massivida, matnga faqat kodda yozilgan bo'laklar tushadi. Identifikator uchun yagona yo'l `sortIdent`: u kiritishdan nom emas, faqat kalit sifatida foydalanadi, shuning uchun `lastSeen` `last_seen_at` ga, `id; DROP ...` esa standart `plate` ga aylanadi. Qoldiq risk: allow-list noto'g'ri to'ldirilsa (masalan, ichida sezgir ustun), ma'lumot sizadi; tenant qiymati sessiyadan kelishi kerak; `Object.hasOwn` `"__proto__"` kabi kalitlarni to'g'ri rad etadi (29-dars).

## Qachon qo'llamaslik kerak

- Hamma narsani raw'ga o'tkazmang yoki aksincha. Oddiy CRUD uchun ORM API xavfsizroq va qisqaroq. Raw faqat ORM ifodalay olmaydigan so'rovlar (window funksiyalar, murakkab hisobotlar, PostgreSQL xususiyatlari) uchun. Har raw so'rov alohida review nuqtasi.
- Kysely `sql.raw` ga allow-list'siz hech narsa bermang, lekin allow-list ham ortiqcha murakkablik bo'lsa, so'rovni bir necha statik variantga ajrating: `if (sort === "plate") ... else ...`. Statik variantlarni tekshirish allow-list xaritasidan oson.
- `Unsafe` ni "o'chirish" ni maqsad qilmang. Ba'zan u qulay (migratsiya skriptlari, ichki admin buyruqlar), faqat unga hech qachon foydalanuvchi qiymati kirmasligi kerak. Linter qoidasi (83-dars) bunday chaqiruvlarni topib beradi.
- Sxema bilan tekshirishni ORM filtrining o'rniga qo'ymang. Sxema kirishni toraytiradi (72-dars), authorization esa alohida qatlam (51-58-darslar).

## Stack'da: Prisma va Kysely

Quyidagi kod real API'larni ko'rsatadi. U ishga tushirilmaydi (Prisma va Kysely mijozlari brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi jihatidan tekshirilgan.

```ts
import { Prisma, PrismaClient } from "@prisma/client";
import { Kysely, sql } from "kysely";

const prisma = new PrismaClient();

const SORT = { plate: "plate", lastSeen: "last_seen_at" } as const;
type SortKey = keyof typeof SORT;

// Prisma: qiymat - tagged template, ro'yxat - Prisma.join, identifikator - allow-list + Prisma.raw
export async function listWithPrisma(tenantId: string, ids: string[], sort: string) {
  const key: SortKey = Object.hasOwn(SORT, sort) ? (sort as SortKey) : "plate";
  return prisma.$queryRaw`
    SELECT id, plate FROM "Vehicle"
    WHERE "tenantId" = ${tenantId}
      AND id IN (${Prisma.join(ids)})
    ORDER BY ${Prisma.raw(`"${SORT[key]}"`)}
    LIMIT 100`;
}

// Kysely: qiymat - oddiy API, identifikator - sql.ref faqat allow-list natijasiga
export async function listWithKysely(db: Kysely<any>, tenantId: string, sort: string) {
  const key: SortKey = Object.hasOwn(SORT, sort) ? (sort as SortKey) : "plate";
  return db
    .selectFrom("vehicles")
    .select(["id", "plate"])
    .where("tenant_id", "=", tenantId)
    .orderBy(sql.ref(SORT[key]))
    .limit(100)
    .execute();
}

// Obyekt in'ektsiyasidan himoya: where serverda yig'iladi
export async function findByToken(email: unknown, token: unknown) {
  if (typeof email !== "string" || typeof token !== "string" || token === "") return null;
  return prisma.user.findFirst({ where: { email, resetToken: token } });
}
```

Bo'sh ro'yxat uchun `IN ()` to'g'ri SQL emas, shuning uchun `ids.length === 0` holatini so'rovdan oldin alohida ko'ring (bo'sh natija qaytaring). Kodda `Prisma.raw` ga faqat allow-list qiymati beriladi, `findByToken` esa `undefined` va obyekt tokenlarni filtr yaratilishidan oldin rad etadi.

## Xulosa

- ORM oddiy API'da qiymatni parametrlaydi. Xavf raw API'larda (`$queryRawUnsafe`, `sql.raw`, `Prisma.raw`) va mijoz obyektini `where` ga uzatishda.
- Qiymat uchun tagged template, ro'yxat uchun `Prisma.join` yoki massiv parametri, identifikator uchun allow-list.
- `ORDER BY ${sort}` tagged shaklda injection bermaydi, lekin ishlamaydi; shuning uchun `Unsafe` ga o'tmang, allow-list yozing.
- `undefined` filtr shartini yo'qotadi va operator obyekti mantiqni o'zgartiradi: majburiy filtr qiymatlari sxema bilan tekshiriladi.
- `sql.ref` kabi quote qiladigan yordamchilar sintaksisni yopadi, lekin qaysi ustun tanlanishi authorization masalasi bo'lib qoladi.
- Har tuzatishning chegarasini yozing: allow-list tarkibi, tenant manbai va sxema tekshiruvi.
