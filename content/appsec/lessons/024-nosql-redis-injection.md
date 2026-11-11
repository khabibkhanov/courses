---
n: 24
slug: nosql-redis-injection
title: "NoSQL va Redis injection"
summary: "NoSQL'da injection operator obyektlari orqali (`$ne`, `$gt`), Redis'da esa protokol, kalit nomlari va skriptlar orqali yuz beradi. Dars ikkala mexanizmni mini-modellarda ishga tushiradi va tuzatishni (tur tekshiruvi, RESP kodlash, kalit kodlash, tarmoq va ACL) ko'rsatadi."
duration: 45
sources:
  - id: t10-a05
    note: "A05 Injection: SQL, NoSQL, OS command, ORM, LDAP va EL/OGNL injection 'ning umumiy ro'yxati; tushuncha barcha interpreter'larda bir xil"
  - id: redis-security
    note: "Redis security: ishonchli muhitdagi ishonchli klientlar, bind va protected mode, ACL, String escaping and NoSQL injection bo'limi (protokol uzunlik prefiksli, oddiy klient bilan injection yo'q; Lua skript matnini ishonchsiz satrlardan yig'ma), CONFIG orqali fayl yo'llarini o'zgartirish xavfi"
  - id: cs-input
    note: "Input Validation Cheat Sheet: noto'g'ri so'rovni rad etish, faqat mo'ljallangan maydonlarni obyektga bog'lash"
quiz:
  - q: "Refresh endpoint `sessions.findOne({ refreshToken: req.body.refreshToken })` ni chaqiradi. Hujumchi JSON body'da `{\"refreshToken\": {\"$ne\": null}}` yubordi. Nima bo'ladi?"
    options:
      - "Hech narsa: token satr emas, shuning uchun xato"
      - "Filtr 'refreshToken null emas' ga aylanadi va birinchi mavjud session qaytadi"
      - "Kompilyatsiya xatosi"
      - "Faqat hujumchining o'z sessioni qaytadi"
    answer: 1
    explain: "Driver obyektni operator sifatida talqin qiladi, shuning uchun shart 'bo'sh emas' bo'ladi. TypeScript turlari run-time'da yordam bermaydi, chunki body `unknown` yoki `any`."
  - q: "Quyidagilardan qaysi biri NoSQL operator in'ektsiyasini mexanizm darajasida yopadi?"
    options:
      - "Qiymat uzunligini cheklash"
      - "Kiritishdagi `'` va `\"` belgilarini olib tashlash"
      - "Kiritishni klient tomonda tekshirish"
      - "Server tomonda har maydonning turini tekshirish (satr kutilgan joyda faqat satr qabul qilish)"
    answer: 3
    explain: "Operator hujumi qiymat o'rniga obyekt kelishiga tayanadi. Turni qat'iy tekshirish obyektni filtrga yetkazmaydi. Qo'shtirnoq belgilari bu hujumda ishtirok etmaydi, klient tekshiruvi hujumchi uchun mavjud emas."
  - q: "Ilova Redis'ga qo'lda yig'ilgan inline buyruqni yuboradi: `SET key ${value}\\r\\n`. `value` ichida `\\r\\nFLUSHALL` bo'lsa nima bo'ladi va qanday yopiladi?"
    options:
      - "Hech narsa; Redis faqat birinchi buyruqni o'qiydi"
      - "Ikkinchi buyruq ham bajariladi; yopish: argumentlarni uzunligi bilan kodlaydigan RESP massivi (klient kutubxonasi shuni qiladi)"
      - "Ikkinchi buyruq bajariladi; yopish: `\\r\\n` ni bo'sh joyga almashtirish"
      - "Redis xato beradi va ulanishni yopadi"
    answer: 1
    explain: "Inline protokolda qator oxiri buyruq chegarasi, shuning uchun qiymat ichidagi CRLF yangi buyruq boshlaydi. RESP massivida har argument uzunligi bilan beriladi va ichidagi CRLF ma'lumot bo'lib qoladi. Belgini almashtirish bitta ko'rinishni yopadi, uzunlik bilan kodlash esa sababni."
  - q: "Kalit `report:${tenant}:${name}` ko'rinishida, `tenant` sessiyadan, `name` foydalanuvchidan. Foydalanuvchi `name = \"*\"` yuboradi va kod `KEYS report:${tenant}:${name}` bajaradi. Asosiy xavf nima?"
    options:
      - "Glob naqsh ishlaydi: o'sha tenant'ning hamma hisobotlari qaytadi va `KEYS` butun keyspace'ni skanerlaydi (resurs sarfi)"
      - "Boshqa tenant kalitlari qaytadi, chunki `*` prefiksni almashtiradi"
      - "Hech qanday xavf yo'q"
      - "Redis ulanishni uzadi"
    answer: 0
    explain: "Prefiks qattiq turgani uchun boshqa tenant kalitlari qaytmaydi, lekin glob belgilari qiymatda ma'noga ega va `KEYS` O(N) ishlaydi. Production'da `SCAN` va kalitni kodlash yoki aniq kalit bilan GET kerak."
  - q: "Redis `bind 0.0.0.0` bilan, parolsiz, firewall'siz ishga tushirilgan. Ilovada hech qanday injection yo'q. Nima uchun baribir jiddiy xavf?"
    options:
      - "Xavf yo'q: injection bo'lmasa hujum ham yo'q"
      - "Faqat xotira sarfi ko'payadi"
      - "Redis ishonchli klientlar uchun mo'ljallangan; ochiq va autentifikatsiyasiz instansga har kim buyruq yubora oladi"
      - "Faqat sekinlashadi"
    answer: 2
    explain: "Redis'ning xavfsizlik modeli ishonchli muhitga tayanadi (redis-security). Tarmoqdan ochiq, parolsiz instansda hujumchiga injection kerak emas: buyruqlar to'g'ridan-to'g'ri qabul qilinadi. Tarmoq izolyatsiyasi, autentifikatsiya va ACL kerak."
  - q: "`$where` kabi JavaScript ifodalariga ruxsat beradigan MongoDB so'rovlarida foydalanuvchi kiritishi ifodaga qo'shilsa, qo'shimcha qanday xavf bor?"
    options:
      - "Xavf yo'q, faqat sekin ishlaydi"
      - "Kiritish baza ichida kod sifatida bajariladi, ya'ni oddiy filtr in'ektsiyasidan kengroq imkoniyat; shuning uchun server tomonda JS ifodalarni o'chirish yoki ishlatmaslik tavsiya etiladi"
      - "Faqat o'qish operatsiyalariga ta'sir qiladi"
      - "Faqat Mongo shell'da ishlaydi"
    answer: 1
    explain: "Server tomonda JS ifodasi baza ichida bajariladi, shuning uchun ifodaga kiritilgan qiymat filtr emas, kodning bir qismi. Sababiy chora: JS ifodalardan voz kechish (tegishli server sozlamasi) va oddiy so'rov operatorlaridan foydalanish. Aniq sozlama nomi uchun MongoDB hujjatiga qarang (bu darsda tekshirilmagan)."
task:
  title: "Redis kalit quruvchi: ajratkich va glob belgilari"
  prompt: |
    `cacheKey(tenant, resource)` Redis kaliti yasaydi: `cache:<tenant>:<resource>`. Ikkala qism ham `:` ni o'z ichiga olishi mumkin, shuning uchun `("a:b", "c")` va `("a", "b:c")` bir xil kalitga aylanadi (collision: bir tenant boshqasining kesh yozuvini ko'ra yoki yozib qo'ya oladi). Bundan tashqari `resource` ichidagi `*`, `?`, `[` kabi glob belgilari `KEYS` yoki `SCAN MATCH` naqshlarida ma'noga ega.

    Funksiyani tuzating: har qism kodlansin, shunda kalit aniq uchta `:` bilan ajratilgan qism bo'lsin, qismlar ichida `:` va glob belgilari (`* ? [ ] \`) qolmasin, va turli (tenant, resource) juftlari turli kalit bersin. Imzoni o'zgartirmang. Kutilgan chiqish: `collision: false`, `glob qolgan: true`, `qismlar soni: 3`.
  lang: ts
  starter: |
    function cacheKey(tenant: string, resource: string): string {
      return `cache:${tenant}:${resource}`;
    }

    const k1 = cacheKey("a:b", "c");
    const k2 = cacheKey("a", "b:c");
    console.log("collision:", k1 === k2);

    const k3 = cacheKey("alfa", "report-*");
    console.log("glob qolgan:", /[*?\[\]\\]/.test(k3.slice("cache:alfa:".length)) === false);
    console.log("qismlar soni:", cacheKey("a:b", "c").split(":").length);
  solution: |
    // Kodlash: ":" va glob belgilari %XX ga aylanadi, "%" ning o'zi ham kodlanadi
    const enc = (s: string) =>
      encodeURIComponent(s).replace(/[*!'()~?\[\]\\]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

    function cacheKey(tenant: string, resource: string): string {
      return `cache:${enc(tenant)}:${enc(resource)}`;
    }

    const k1 = cacheKey("a:b", "c");
    const k2 = cacheKey("a", "b:c");
    console.log("collision:", k1 === k2);

    const k3 = cacheKey("alfa", "report-*");
    console.log("glob qolgan:", /[*?\[\]\\]/.test(k3.slice("cache:alfa:".length)) === false);
    console.log("qismlar soni:", cacheKey("a:b", "c").split(":").length);
  solutionNotes: |
    - Ajratkich (`:`) ma'lumot ichida ham uchrashi mumkin bo'lgani uchun har qism kodlanadi. `encodeURIComponent` `:` ni `%3A` ga aylantiradi, `%` ni esa `%25` ga, shuning uchun kodlash qaytariladigan (injective): turli kirishlar turli chiqish beradi.
    - `encodeURIComponent` `* ! ' ( ) ~` ni qoldiradi, `? [ ] \` ni kodlaydi. Glob uchun muhim `*` va boshqa belgilar qo'shimcha almashtiriladi.
    - Qoldiq risk: tenant kodlangan bo'lsa ham `tenant` qiymati sessiyadan kelishi shart, aks holda foydalanuvchi o'zi boshqa tenant nomini bera oladi (55-dars). `KEYS` o'rniga `SCAN` ishlating va foydalanuvchi naqshini kalit sifatida emas, aniq GET bilan ishlating.
    - Redis ACL'da kalit naqshlari (`~cache:alfa:*`) bilan tenant kalit maydonini cheklash mumkin, lekin bu ilova qatlamidagi kodlashni almashtirmaydi.
  checklist:
    - "`(\"a:b\", \"c\")` va `(\"a\", \"b:c\")` turli kalit beradi"
    - "Qismlar ichida `:` yo'q, kalit aniq uch qismdan iborat"
    - "`*`, `?`, `[`, `]`, `\\` qismlar ichida qolmaydi"
    - "Kodlash qaytariladigan: ma'lumot yo'qolmaydi"
    - "Redis ACL va `SCAN` ning bu tuzatishdagi o'rnini tushuntira olasiz"
---

## Muammo

NoSQL bazalarida SQL yo'q, shuning uchun "bizda injection yo'q" degan taassurot paydo bo'ladi. Aslida mexanizm o'zgarmaydi: har bazaning o'z so'rov tili bor va u kiritilgan qiymat bilan aralashishi mumkin. MongoDB'da bu til JSON'ga o'xshash obyektlar va operatorlar (`$ne`, `$gt`, `$regex`), Redis'da buyruq protokoli, kalit nomlari va Lua skriptlari. Node.js'da JSON body avtomatik obyektga aylanadi, shuning uchun "satr kutgan joyga obyekt keldi" holati JavaScript ekotizimida SQL'dagi apostrofdan ham oson yuz beradi.

Ikkinchi muammo: Redis ko'pincha "faqat kesh" deb qaraladi, shuning uchun xavfsizlik e'tiboridan chetda qoladi. Lekin Redis'da sessiyalar, rate limit hisoblagichlar, navbatlar va tenant keshi turadi. Kesh kaliti noto'g'ri yasalsa, bir tenant boshqasining yozuvini ko'radi (maxfiylik), hisoblagich buzilsa rate limit ishlamaydi (mavjudlik), sessiya yozuvini o'zgartirish esa to'g'ridan-to'g'ri autentifikatsiyani buzadi.

Bu dars ikki mexanizmni ishga tushiriladigan mini-modellarda ko'rsatadi: Mongo uslubidagi operator in'ektsiyasi va Redis protokolidagi buyruq qo'shilishi. Keyin kalit nomlari, skriptlar va tarmoq darajasidagi choralarni ko'rib chiqamiz. Model sodda, real MongoDB va Redis serveri emas; maqsad mexanizmni ko'rsatish.

## Asosiy g'oya

### Operator in'ektsiyasi

MongoDB so'rovi oddiy tenglik uchun `{ field: value }` ko'rinishida, boshqa shartlar uchun `{ field: { $ne: value } }` ko'rinishida yoziladi. Ya'ni qiymat joyida turgan obyekt operator sifatida talqin qilinadi. Agar ilova `findOne({ refreshToken: req.body.refreshToken })` desa va body JSON bo'lsa, `refreshToken` ning turi hujumchi qo'lida: u satr o'rniga `{ "$ne": null }` yuborishi mumkin. Filtr "token mavjud bo'lgan har qanday yozuv" ga aylanadi. Bu 21-darsdagi modelga aniq mos: qiymat ma'lumot kanalidan chiqib, so'rov tuzilishiga (operatorga) aylandi. OWASP Top 10:2025 da NoSQL ham A05 Injection oilasida ko'riladi.

Himoya SQL'dagi kabi kanallarni ajratishga yaqin: filtrga faqat tekshirilgan turdagi qiymat kiradi. Satr kutilgan joyda `typeof v === "string"` bo'lmasa, so'rov bazaga umuman bormaydi. Bu parametrlashning NoSQL'dagi ekvivalenti: struktura (qaysi operator) kodda, qiymat (satr) tashqarida.

### Redis: protokol, kalit va skript

Redis'ning xavfsizlik modeli ishonchli muhitdagi ishonchli klientlarga tayanadi. Bu Redis hujjatining (security sahifasi) boshidagi g'oya: Redis internetga yoki ishonchsiz muhitga to'g'ridan-to'g'ri ochilmasligi kerak, ishonchsiz klientlar ACL va kiritishni tekshiradigan qatlam orqali ulanishi lozim. Shu sahifaning "String escaping and NoSQL injection" bo'limi esa protokol uzunlik prefiksli va binary-safe bo'lgani uchun oddiy klient kutubxonasi bilan injection mumkin emasligini, Lua skript matnini ishonchsiz satrlardan yig'masligingiz kerakligini aytadi. Ilova darajasidagi injection uchta joyda bo'ladi:

1. Protokol. Redis klienti buyruqni RESP formatida jo'natadi: massiv va uzunlik prefiksli bulk string'lar. Qo'lda yig'ilgan "inline" buyruqda qator oxiri (CRLF) buyruq chegarasi, shuning uchun qiymatdagi CRLF yangi buyruq boshlaydi. Ioredis va node-redis kabi kutubxonalar argumentlarni massiv sifatida beradi va RESP bilan kodlaydi, shuning uchun bunday xato odatda faqat qo'lda socket bilan ishlaganda yoki boshqa tizimdan (HTTP orqali Redis'ga so'rov yuboradigan proksi) kelganda uchraydi.
2. Kalit nomlari. Kalit foydalanuvchi qiymati bilan yig'iladi. Ajratkich (`:`) qiymat ichida ham bo'lishi mumkin, glob belgilari (`*`, `?`) esa `KEYS` va `SCAN MATCH` da ma'noga ega.
3. Lua skriptlari. `EVAL` skriptini matn qo'shish bilan yig'ish SQL'dagi kabi injection beradi; kalitlar `KEYS[]`, qiymatlar `ARGV[]` orqali uzatilishi kerak.

## Chuqurroq: nozik holatlar

### Qaysi kirish obyekt bo'lib kelishi mumkin

- JSON body: `{"token": {"$ne": null}}`.
- Query string. Express'ning `qs` parser'i (extended rejim) `?token[$ne]=x` ni obyektga aylantiradi. Qaysi rejim default ekani Express versiyasiga bog'liq; versiyangizni tekshiring va tur tekshiruvini rejimga tayanmay yozing.
- Header va cookie'lar odatda satr, lekin ba'zi framework'lar ularni ham massivga yoki obyektga aylantiradi.

### Qora ro'yxat va `$` ni olib tashlash

Ba'zi kutubxonalar kirish obyektidan `$` bilan boshlanadigan kalitlarni olib tashlaydi. Bu ma'qul qo'shimcha qatlam, lekin asosiy himoya emas: u faqat operatorlarni yopadi, turni emas (masalan, massiv yoki ichma-ich obyekt baribir o'tishi mumkin), va ilovaning mantiqiy talabi (token satr bo'lishi kerak) tekshirilmay qoladi. Sxema bilan tur tekshiruvi (72-dars) ham mantiqni, ham xavfsizlikni qoplaydi.

### `$where` va server tomonda JavaScript

MongoDB'ning ba'zi operatorlari (`$where`) ifodani baza ichida JavaScript sifatida bajaradi. Bunday ifodaga kiritilgan qiymat filtr emas, kod bo'lib qoladi: oddiy operator in'ektsiyasidan ko'ra kengroq imkoniyat. Tavsiya: bunday operatorlardan foydalanmang va server tomonda JS ifodalarini o'chirish sozlamasini baza hujjatidan tekshiring (bu darsda tekshirilmagan).

### Redis: kalit kollizyasi va `KEYS`

Qismlarni `:` bilan birlashtirish qaytarilmas (non-injective) kodlash: `("a:b", "c")` va `("a", "b:c")` bir xil kalit beradi. Agar qismlardan biri foydalanuvchi qo'lida bo'lsa, u boshqa tenant kalitiga tushishi mumkin. Shuningdek `KEYS pattern` butun keyspace'ni skanerlaydi (O(N)) va production'da blokirovka beradi; foydalanuvchi naqshi bilan bu yanada xavfli. Foydalanuvchi qiymati bilan `KEYS` o'rniga aniq kalit bilan `GET` yoki cheklangan `SCAN` ishlating.

### Redis: tarmoq, autentifikatsiya, ACL

Ilovada injection bo'lmasa ham, tarmoqdan ochiq Redis hujumchi uchun tayyor interfeys. Hujjat: Redis'ni ishonchli tarmoqda saqlash, kerakli interfeysga bog'lash (`bind 127.0.0.1`), protected mode (3.2.0 dan, default sozlama va parolsiz holat uchun), autentifikatsiya va ACL bilan klient huquqlarini cheklash. `CONFIG` buyrug'i orqali ish papkasi va dump fayl nomini o'zgartirib RDB faylini ixtiyoriy yo'lga yozish mumkinligi hujjatda alohida xavf sifatida ko'rsatilgan; `rename-command` usuli eskirgan, o'rniga ACL qoidalari tavsiya etiladi. SSRF orqali ichki Redis'ga so'rov yuborish ehtimoli 27-darsda ko'riladi.  Aniq direktivalar 89-darsda.

### Redis ACL bilan zararni cheklash

Redis hujjatida ACL qoidalari tavsiflangan: foydalanuvchi uchun buyruq toifalari (`+@<category>`, `-@<category>`) va kalit naqshlari (`~<pattern>`) beriladi. Standart `default` foydalanuvchi parolsiz va hamma kalit va buyruqqa ruxsat bilan keladi (`on nopass ~* &* +@all`). Ilova uchun alohida foydalanuvchi yarating: faqat kerakli kalit naqshlari va buyruq toifalari, xavfli toifalar (`-@dangerous`) yopilgan. Misol (hujjatdagi qoida sintaksisiga mos, qiymatlarni o'zingizga moslang): `ACL SETUSER app on >parol ~cache:* +get +set +del`. Shunda ilova xatosi (yoki injection) bo'lsa ham, jarayon `cache:` bo'lmagan kalitlarga yoki `FLUSHALL` kabi buyruqlarga yetmaydi. Sessiya va keshni alohida foydalanuvchilar yoki instanslarga ajratish bu g'oyani kuchaytiradi.

### Mongo uslubidagi bazalarda qo'shimcha qatlamlar

Operator hujumiga qarshi asosiy chora tur tekshiruvi, ammo unga qo'shimcha qatlamlar bor. Bazaga ulanish roli faqat kerakli to'plamlarga o'qish va yozish huquqiga ega bo'lishi; `$where` va server tomonda JavaScript ishlatadigan operatorlar o'chirilgan bo'lishi; so'rovlarga `maxTimeMS` kabi vaqt chegarasi qo'yilishi (aniq nomlar uchun baza hujjatiga qarang, bu darsda tekshirilmagan). Bu choralar ham ilova darajasidagi tur tekshiruvini almashtirmaydi: ular zararni cheklaydi, tekshiruv esa hujumning o'zini to'xtatadi.

### Kalitni kodlash va kalit maydoni

Redis'da tenant izolyatsiyasi kalit nomiga tayanadi: `cache:alfa:...`. Shuning uchun kalit yasovchi funksiya bitta bo'lishi, tenant qiymati sessiyadan olinishi va foydalanuvchi qismi kodlanishi kerak (yuqoridagi topshiriq). ACL kalit naqshi bilan birga ishlaganda, ilova roli faqat o'z maydoniga yeta oladi. Tenant soni ko'p bo'lsa, har tenant uchun alohida ACL foydalanuvchisi amaliy bo'lmasligi mumkin: bu holda kodlangan kalit va markaziy yordamchi funksiya asosiy himoya, ACL esa umumiy chegara.

## Misol: operator in'ektsiyasi va protokol

### 1. Zaif kod

Birinchi model Mongo uslubidagi filtr: tenglik va `$ne` operatori. Ikkinchi model Redis ning inline va RESP formatlarini parse qiladi.

```ts run
type Doc = Record<string, unknown>;

// Mongo uslubidagi filtr: obyekt qiymat operator deb talqin qilinadi
function match(doc: Doc, f: Doc): boolean {
  return Object.entries(f).every(([k, c]) => {
    const v = doc[k];
    if (c !== null && typeof c === "object") {
      const op = c as Record<string, unknown>;
      if ("$ne" in op) return v !== op.$ne;
      return false;
    }
    return v === c;
  });
}
const sessions: Doc[] = [
  { refreshToken: "rt-admin-9f3", user: "admin", tenant: "beta" },
  { refreshToken: "rt-ali-71c", user: "ali", tenant: "alfa" },
];
const findOne = (f: Doc) => sessions.find((s) => match(s, f)) ?? null;

// ZAIF: body maydoni turi tekshirilmaydi
function refreshWeak(body: Doc) {
  return findOne({ refreshToken: body.refreshToken });
}

// Redis inline buyruq: qator oxiri = buyruq chegarasi
const buildInline = (key: string, value: string) => `SET ${key} ${value}\r\n`;
const parseInline = (s: string) => s.split("\r\n").filter(Boolean).map((l) => l.split(" "));

console.log("oddiy:", refreshWeak({ refreshToken: "rt-ali-71c" })?.user);
console.log("inline:", JSON.stringify(parseInline(buildInline("name", "ali"))));
```

```text
oddiy: ali
inline: [["SET","name","ali"]]
```

### 2. Hujum

Hujumchi "alfa" foydalanuvchisi o'z tokenini bilmaydi. U JSON body'da satr o'rniga operator yuboradi. Redis tomonda esa qiymatga yangi buyruq qo'shishga harakat qiladi. Ikkalasi ham faqat shu o'quv modellariga qarshi.

```ts run
type Doc = Record<string, unknown>;
function match(doc: Doc, f: Doc): boolean {
  return Object.entries(f).every(([k, c]) => {
    const v = doc[k];
    if (c !== null && typeof c === "object") {
      const op = c as Record<string, unknown>;
      if ("$ne" in op) return v !== op.$ne;
      return false;
    }
    return v === c;
  });
}
const sessions: Doc[] = [
  { refreshToken: "rt-admin-9f3", user: "admin", tenant: "beta" },
  { refreshToken: "rt-ali-71c", user: "ali", tenant: "alfa" },
];
const findOne = (f: Doc) => sessions.find((s) => match(s, f)) ?? null;
function refreshWeak(body: Doc) {
  return findOne({ refreshToken: body.refreshToken });
}
const buildInline = (key: string, value: string) => `SET ${key} ${value}\r\n`;
const parseInline = (s: string) => s.split("\r\n").filter(Boolean).map((l) => l.split(" "));

const hit = refreshWeak(JSON.parse('{"refreshToken": {"$ne": null}}'));
console.log("operator hujumi:", hit?.user, hit?.tenant);
console.log("inline hujumi:", JSON.stringify(parseInline(buildInline("name", "ali\r\nFLUSHALL"))));
```

```text
operator hujumi: admin beta
inline hujumi: [["SET","name","ali"],["FLUSHALL"]]
```

Birinchi natijada hujumchi birinchi session egasi (`admin`, boshqa tenant) sifatida tan olindi: refresh token oqimi shu sessiya uchun yangi access token berar edi. Ikkinchi natijada bitta `SET` o'rniga ikkita buyruq paydo bo'ldi: ikkinchisi `FLUSHALL`.

### 3. Tuzatilgan kod

```ts run
type Doc = Record<string, unknown>;
function match(doc: Doc, f: Doc): boolean {
  return Object.entries(f).every(([k, c]) => {
    const v = doc[k];
    if (c !== null && typeof c === "object") {
      const op = c as Record<string, unknown>;
      if ("$ne" in op) return v !== op.$ne;
      return false;
    }
    return v === c;
  });
}
const sessions: Doc[] = [
  { refreshToken: "rt-admin-9f3", user: "admin", tenant: "beta" },
  { refreshToken: "rt-ali-71c", user: "ali", tenant: "alfa" },
];
const findOne = (f: Doc) => sessions.find((s) => match(s, f)) ?? null;

function refresh(body: Doc) {
  const t = body.refreshToken;
  if (typeof t !== "string" || t.length < 8 || t.length > 200) return null; // tur va shakl
  return findOne({ refreshToken: t });
}

// RESP: massiv, har argument uzunligi bilan
const enc = new TextEncoder();
const encodeResp = (args: string[]) =>
  `*${args.length}\r\n` + args.map((a) => `$${enc.encode(a).length}\r\n${a}\r\n`).join("");
function parseResp(s: string): string[] {
  const b = enc.encode(s), dec = new TextDecoder(), out: string[] = [];
  const eol = (from: number) => { let k = from; while (!(b[k] === 13 && b[k + 1] === 10)) k++; return k; };
  let end = eol(0), i = end + 2; // "*N\r\n" dan keyin
  while (i < b.length) {
    end = eol(i);
    const len = Number(dec.decode(b.slice(i + 1, end))); // "$len"
    out.push(dec.decode(b.slice(end + 2, end + 2 + len)));
    i = end + 2 + len + 2;
  }
  return out;
}

console.log("operator hujumi:", refresh(JSON.parse('{"refreshToken": {"$ne": null}}')));
console.log("oddiy:", refresh({ refreshToken: "rt-ali-71c" })?.user);
const wire = encodeResp(["SET", "name", "ali\r\nFLUSHALL"]);
console.log("RESP:", JSON.stringify(wire));
console.log("argumentlar:", JSON.stringify(parseResp(wire)));
```

```text
operator hujumi: null
oddiy: ali
RESP: "*3\r\n$3\r\nSET\r\n$4\r\nname\r\n$13\r\nali\r\nFLUSHALL\r\n"
argumentlar: ["SET","name","ali\r\nFLUSHALL"]
```

Nima uchun yetarli: invariant "filtrga faqat kutilgan turdagi qiymat kiradi" tur tekshiruvi bilan ta'minlandi, shuning uchun `{"$ne": null}` bazaga yetmaydi. RESP'da `ali\r\nFLUSHALL` bitta 13 baytlik argument bo'lib uzatiladi (uzunligi oldindan aytilgan), uni buyruq chegarasi deb o'qib bo'lmaydi. Yopilmagan: tenant tekshiruvi (token to'g'ri bo'lsa ham u kimniki ekani session yozuvidan olinishi kerak), tokenning o'zi tasodifiy va vaqti cheklangan bo'lishi (46-dars), Redis'ning tarmoq va ACL himoyasi. `parseResp` bu yerda faqat model: u bitta massivni o'qiydi va xato kirishlarni tekshirmaydi.

## Qachon qo'llamaslik kerak

- Hamma maydonga `$` filtri qo'yish (mongo-sanitize tipidagi) kutubxonani yagona himoya qilib qo'ymang. U foydali qatlam, lekin tur va shakl tekshiruvi o'rnini bosmaydi.
- Redis'ni "xavfli" deb ilovadan butunlay olib tashlash shart emas. Kesh va rate limit uchun u qulay. Muhimi, sessiya va xavfsizlikka bog'liq ma'lumotlar uchun alohida instans yoki ACL bilan ajratilgan kalit maydoni, tarmoq izolyatsiyasi va autentifikatsiya.
- Har kalitni kodlash zarurati yo'q joyda kodlash ortiqcha. Agar kalit qismlari serverda yaratilgan UUID'lar bo'lsa, ajratkich muammosi yo'q. Kodlash foydalanuvchi matni kalit qismi bo'lgan joyda kerak.
- `EVAL` ni to'liq taqiqlash kerak emas. Skript statik bo'lsa va qiymatlar `KEYS`/`ARGV` orqali uzatilsa, u xavfsiz va atomar amal beradi (race condition uchun 60-dars).

## Stack'da: Mongoose, ioredis, zod

Quyidagi kod ishga tushirilmaydi (Mongoose va ioredis brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi tekshirilgan.

```ts
import { z } from "zod";
import Redis from "ioredis";
import { Model } from "mongoose";

const redis = new Redis(process.env.REDIS_URL!, { username: "app", password: process.env.REDIS_PASSWORD });

const RefreshBody = z.object({ refreshToken: z.string().min(8).max(200) }).strict();

export async function refresh(
  Session: Model<{ refreshToken: string; userId: string }>,
  body: unknown,
) {
  const parsed = RefreshBody.safeParse(body);
  if (!parsed.success) return null; // obyekt token, massiv, qo'shimcha maydon: hammasi rad
  return Session.findOne({ refreshToken: parsed.data.refreshToken }).lean();
}

const enc = (s: string) =>
  encodeURIComponent(s).replace(/[*!'()~?\[\]\\]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());

export const cacheKey = (tenantId: string, name: string) => `cache:${enc(tenantId)}:${enc(name)}`;

export async function remember(tenantId: string, name: string, value: string) {
  // kutubxona argumentlarni RESP massivi sifatida yuboradi; qiymatdagi CRLF buyruq bo'la olmaydi
  await redis.set(cacheKey(tenantId, name), value, "EX", 300);
}
```

Mongoose'da `strictQuery` va `sanitizeFilter` kabi sozlamalar bor (aniq xatti-harakat versiyaga bog'liq, hujjatni tekshiring: bu yerda tekshirilmagan). Ular qo'shimcha qatlam; asosiy chora `zod` kabi sxema bilan tur va shakl tekshiruvi. Redis uchun `username/password` ACL foydalanuvchisi, ilova roli esa faqat kerakli buyruqlar va kalit naqshlariga cheklanadi.

## Xulosa

- NoSQL injection - qiymat o'rniga operator obyektining kelishi. Mexanizm SQL bilan bir xil: ma'lumot so'rov tuzilishiga aylanadi.
- Himoya: har kirish maydonining turini va shaklini server tomonda sxema bilan tekshirish. `$` kalitlarini olib tashlash qo'shimcha qatlam.
- `$where` kabi server tomonda JavaScript bajaradigan operatorlardan foydalanmang.
- Redis'da injection protokol (inline buyruq), kalit nomi (ajratkich, glob) va skript (matn qo'shilgan `EVAL`) orqali kelishi mumkin. Kutubxona argumentlarni RESP bilan kodlaydi, kalit va skript uchun esa mas'uliyat sizda.
- Tarmoqqa ochiq, parolsiz Redis injection'siz ham zaif: tarmoq izolyatsiyasi, autentifikatsiya va ACL majburiy.
- Har tuzatish nimani qoplamasligini yozing: tenant manbai, token sifati, instans izolyatsiyasi.
