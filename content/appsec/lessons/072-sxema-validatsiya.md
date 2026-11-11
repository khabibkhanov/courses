---
n: 72
slug: sxema-validatsiya
title: "Sxema asosida kirish validatsiyasi"
summary: "Kirishni qo'lda if'lar bilan emas, sxema bilan tekshirish: sintaksis va semantika, allowlist, noma'lum maydonlarni rad etish, o'lcham chegaralari, type coercion tuzog'i va validatsiya nimani almashtirmasligi."
duration: 40
sources:
  - id: cs-input
    note: "Input Validation Cheat Sheet: validatsiya sintaksis va semantikani tekshiradi; maydon turiga qarab qoidalar (fixed choices, numbers, strings, objects, arrays); allowlist va denylist farqi; so'rov hajmi chegarasi parse qilishdan oldin qo'yilishi; JSON uchun required va additional properties aniq sozlanishi; validatsiya parametrlangan so'rov, output encoding va avtorizatsiyani almashtirmaydi"
  - id: api-top10
    note: "API4:2023 'How To Prevent': kiruvchi parametr va payload'lar uchun maksimal o'lcham (satr uzunligi, massiv elementlari soni, fayl hajmi) va qaytariladigan yozuvlar sonini boshqaruvchi parametrni server tomonda tekshirish; API3:2023 xossa darajasidagi avtorizatsiya"
  - id: asvs
    note: "ASVS 5.0.0 V2 Validation and Business Logic va V4 API and Web Service bo'limlari mavzuga yaqin; dars aniq talab raqamlarini keltirmaydi"
  - id: fastify-validation
    note: "Fastify Validation and Serialization: baseline Ajv sozlamalari coerceTypes: 'array', useDefaults: true, removeAdditional: true, allErrors: false (true bo'lsa DoS mumkin)"
  - id: nestjs-validation
    note: "NestJS Validation: ValidationPipe opsiyalari (whitelist, forbidNonWhitelisted, forbidUnknownValues, transform, disableErrorMessages); auto-transformation primitiv turlarni o'giradi; Zod sxemalari uchun z.object strip, z.strictObject rad etish, z.looseObject saqlash"
quiz:
  - q: "Kiruvchi JSON'da `{\"vehicleId\":\"v1\",\"fuel\":55,\"tenantId\":\"beta\"}` bor, sxemada `tenantId` yo'q. Eng xavfsiz xatti-harakat qaysi?"
    options:
      - "Noma'lum maydonni jimgina tashlab yuborib, so'rovni qabul qilish"
      - "Maydonni qabul qilib, keyin bazada tekshirish"
      - "Maydonni logga yozib, baribir saqlash"
      - "So'rovni 400 bilan rad etish; tenant esa faqat autentifikatsiya kontekstidan olinadi"
    answer: 3
    explain: "Noma'lum maydon odatda xato yoki hujum belgisi. Rad etish buni ko'rinadigan qiladi. Tashlab yuborish ham bu maydonni ishlatmaydi, ammo kod keyin maydonni qo'shsa, ehtiyotsizlik bilan ochilib qoladi. Tenant hech qachon kiruvchi tanadan olinmaydi."
  - q: "`Number(\"1e9\")` va `Number(\"\")` mos ravishda nima qaytaradi va bundan qanday xulosa kelib chiqadi?"
    options:
      - "1000000000 va 0: `Number()` bilan o'girishdan keyin ham tur va diapazon alohida tekshirilishi shart"
      - "NaN va NaN: `Number()` har doim xavfsiz"
      - "1000000000 va NaN: bo'sh satr rad etiladi"
      - "NaN va 0: ilmiy yozuv qo'llab-quvvatlanmaydi"
    answer: 0
    explain: "`Number(\"1e9\")` 1000000000, `Number(\"\")` esa 0. Ikkalasi ham xatosiz o'tadi, shuning uchun o'girishning o'zi validatsiya emas: kirish turi (number yoki satr) va qiymat diapazoni alohida tekshiriladi."
  - q: "Nega `/'|--|;/` kabi 'xavfli belgilar' ro'yxati (denylist) bilan SQL injection'dan himoyalanish ishonchsiz?"
    options:
      - "Regex sekin ishlaydi"
      - "Hujumchi har doim yangi belgi topadi, shu bilan birga ro'yxat legitim kirishni (masalan, O'tkir ismini) rad etadi; haqiqiy himoya parametrlangan so'rov"
      - "Denylist faqat JavaScript'da ishlamaydi"
      - "SQL injection faqat raqam maydonlarida bo'ladi"
    answer: 1
    explain: "Cheat sheet yondashuvi: nima qabul qilinishini belgilash va undan tashqarisini rad etish, zararli satrlarni tanishga urinmaslik. Apostrof bloklansa, legitim ismlar rad etiladi, so'rov esa baribir xavfsiz bo'lmaydi. SQL uchun himoya parametrlash (22-dars)."
  - q: "`limit` parametri tekshirildi: butun son va 1..100. Lekin `GET /vehicles/:id` da `id` uchun faqat 'bo'sh emas' tekshiriladi. Qaysi xavf qoladi?"
    options:
      - "Hech qaysi, chunki `limit` tekshirilgan"
      - "Validatsiya ID formatini tekshirsa ham, ID'ning shu foydalanuvchiga tegishli ekanini tekshirmaydi: bu alohida avtorizatsiya"
      - "Faqat Content-Type xavfi"
      - "ID ni parametrlash kerak emas"
    answer: 1
    explain: "To'g'ri formatdagi ID bu ID ga ruxsat degani emas. Cheat sheet ham buni alohida ta'kidlaydi: valid hisob identifikatori ushbu hisobga kirish huquqini bermaydi. Egalik tekshiruvi 52-darsning mavzusi."
  - q: "Massiv maydon `points: [[lat, lon], ...]` uchun qaysi validatsiya to'liq hisoblanadi?"
    options:
      - "Har element turini tekshirish, elementlar soniga chegara qo'ymasdan"
      - "Faqat `Array.isArray` tekshiruvi"
      - "Elementlar soniga chegara (masalan, eng ko'pi 500) va har elementni (ichki massivlarni ham) tekshirish"
      - "Faqat tana hajmini tekshirish"
    answer: 2
    explain: "Cheat sheet massiv uchun eng kam va eng ko'p elementlar soni hamda har element, ichki obyektlar bilan birga, tekshirilishini aytadi. API4 ham massiv elementlari soniga chegarani tavsiya qiladi. Chegarasiz massiv resurs sarfini cheklamaydi."
  - q: "Fastify yoki Zod kabi kutubxona turni 'qulaylik uchun' o'zgartirsa (`\"55\"` ni `55` ga), bu nega xavfsizlik nuqtai nazaridan sinab ko'rilishi kerak?"
    options:
      - "Chunki o'zgartirish ilovani sekinlashtiradi"
      - "Chunki o'zgartirish JSON'ni buzadi"
      - "Chunki kutubxonalar tur o'zgartirmaydi"
      - "Chunki o'zgartirilgan qiymat kiruvchi qiymatdan farq qiladi va chegara tekshiruvlari, imzo yoki kesh kalitlari kutilmagan ishlashi mumkin; kerak bo'lmasa o'girishni o'chiring"
    answer: 3
    explain: "Coercion qabul qilinadigan kirishlar to'plamini kengaytiradi: kod `\"55\"` ni ham, `55` ni ham ko'radi. NestJS hujjatiga ko'ra, auto-transformation yoqilganda `ValidationPipe` path va query parametrlarini e'lon qilingan turga o'giradi, coercing sxema (`z.coerce.number()`) ham xuddi shunday. Qat'iy sxema API shartnomangizni aniq qiladi."
task:
  title: "Telemetriya paketini qat'iy sxema bilan tekshirish"
  prompt: |
    `parseTelemetry(body)` qurilmadan kelgan paketni tekshirishi kerak. Hozir u hamma narsani `Number()` bilan o'girib qabul qiladi.

    Qoidalar:
    1. `body` oddiy obyekt bo'lishi shart (massiv, `null`, satr rad etiladi).
    2. Faqat `vehicleId`, `fuel`, `ts` maydonlari ruxsat etiladi; boshqa maydon bo'lsa rad etiladi.
    3. `vehicleId` - satr, `^v[0-9]{1,6}$` ga mos.
    4. `fuel` - tur `number` (satr emas), chekli, 0 dan 100 gacha.
    5. `ts` - tur `number`, butun, 1 dan katta yoki teng.

    Natija: `{ ok: true, value }` yoki `{ ok: false, error }`. Oxirgi besh `console.log` uchun kutilgan qiymatlar: true, false, false, false, false.
  lang: ts
  starter: |
    type Result = { ok: true; value: { vehicleId: string; fuel: number; ts: number } } | { ok: false; error: string };

    function parseTelemetry(body: any): Result {
      return { ok: true, value: { vehicleId: String(body.vehicleId), fuel: Number(body.fuel), ts: Number(body.ts) } };
    }

    console.log("to'g'ri:", parseTelemetry({ vehicleId: "v12", fuel: 55.5, ts: 1700000000 }).ok);
    console.log("satr fuel:", parseTelemetry({ vehicleId: "v12", fuel: "55", ts: 1700000000 }).ok);
    console.log("diapazondan tashqari:", parseTelemetry({ vehicleId: "v12", fuel: -500, ts: 1700000000 }).ok);
    console.log("ortiqcha maydon:", parseTelemetry({ vehicleId: "v12", fuel: 50, ts: 1700000000, tenant: "beta" }).ok);
    console.log("massiv:", parseTelemetry([1, 2, 3]).ok);
  solution: |
    type Result = { ok: true; value: { vehicleId: string; fuel: number; ts: number } } | { ok: false; error: string };

    const ALLOWED = new Set(["vehicleId", "fuel", "ts"]);

    function parseTelemetry(body: unknown): Result {
      if (typeof body !== "object" || body === null || Array.isArray(body)) return { ok: false, error: "tana obyekt emas" };
      const o = body as Record<string, unknown>;
      for (const k of Object.keys(o)) if (!ALLOWED.has(k)) return { ok: false, error: `noma'lum maydon: ${k}` };
      const { vehicleId, fuel, ts } = o;
      if (typeof vehicleId !== "string" || !/^v[0-9]{1,6}$/.test(vehicleId)) return { ok: false, error: "vehicleId" };
      if (typeof fuel !== "number" || !Number.isFinite(fuel) || fuel < 0 || fuel > 100) return { ok: false, error: "fuel" };
      if (typeof ts !== "number" || !Number.isInteger(ts) || ts < 1) return { ok: false, error: "ts" };
      return { ok: true, value: { vehicleId, fuel, ts } };
    }

    console.log("to'g'ri:", parseTelemetry({ vehicleId: "v12", fuel: 55.5, ts: 1700000000 }).ok);
    console.log("satr fuel:", parseTelemetry({ vehicleId: "v12", fuel: "55", ts: 1700000000 }).ok);
    console.log("diapazondan tashqari:", parseTelemetry({ vehicleId: "v12", fuel: -500, ts: 1700000000 }).ok);
    console.log("ortiqcha maydon:", parseTelemetry({ vehicleId: "v12", fuel: 50, ts: 1700000000, tenant: "beta" }).ok);
    console.log("massiv:", parseTelemetry([1, 2, 3]).ok);
  solutionNotes: |
    - Kirish turi `unknown`: kompilyator tekshiruvni unutishga yo'l qo'ymaydi. `any` esa tekshiruvni xotirjam o'tkazib yuboradi.
    - Noma'lum maydonlar qaytariladi emas, rad etiladi. Shunda `tenant` kabi maydon kod keyin o'zgarganda ham jimgina ishlamaydi.
    - `typeof fuel !== "number"` o'girishdan oldin: `"55"` satr rad etiladi. Agar API shartnomasi satrni ruxsat etsa, buni ochiq yozing, `Number()` ga yashirmang.
    - Bu tuzatish formatni va diapazonni tekshiradi. `vehicleId` ning shu tenant'ga tegishli ekanini tekshirmaydi (52-dars).
    - Tana hajmi cheklovi (JSON parser darajasida) va `__proto__` kabi kalitlar bilan ishlash bu funksiyadan tashqarida hal qilinadi (29-dars).
  checklist:
    - "To'g'ri paket `ok: true` beradi"
    - "Satr ko'rinishidagi `fuel` rad etiladi"
    - "Diapazondan tashqari `fuel` va noma'lum `tenant` maydoni rad etiladi"
    - "Massiv, `null` va satr tana sifatida rad etiladi"
    - "Tuzatish egalik tekshiruvini qamramasligini ayta olasiz"
---

## Muammo

Kirish tekshiruvi odatda "kerak bo'lganda qo'shiladi": handler ichida bir-ikki `if`, qolgan maydonlar esa `body.radius` deb to'g'ridan-to'g'ri ishlatiladi. Bir yildan keyin endpoint o'n besh maydonli, ichma-ich obyektli bo'ladi, tekshiruvlar esa turli joylarda, turlicha. Natija: bir endpoint `limit` ni tekshiradi, ikkinchisi tekshirmaydi; birida noma'lum maydon jimgina saqlanadi; uchinchisida `"Infinity"` satr hisoblash sikliga tushadi.

Bu kichik nuqsonlar OWASP API Security Top 10 (2023) dagi bir nechta kategoriyaning kirish eshigi: API3 (ortiqcha maydonni qabul qilish orqali mass assignment), API4 (cheklanmagan o'lcham yoki son) va API10 (tashqi API javobiga ishonish). Input Validation Cheat Sheet validatsiya nimaga xizmat qilishini shunday ta'riflaydi: u ma'lumot ilova ishlatishidan oldin talablarga javob berishini tekshiradi va noto'g'ri shakldagi ma'lumot, yaroqsiz biznes amallari va ortiqcha resurs sarfi xavfini kamaytiradi.

Yechim: tekshiruvni handler ichidan chiqarib, har endpoint uchun bitta deklarativ sxemaga aylantirish. Sxema shartnoma hujjati ham, tekshiruv kodi ham bo'ladi. Bu dars shu yondashuvni mexanizm darajasida ko'radi: sxema nimani tekshirishi, qaysi tuzoqlar sxemaning o'zida qolishi (coercion, noma'lum maydon, chegarasiz massiv) va validatsiya nimani almashtirolmasligi.

## Asosiy g'oya

### Sintaksis va semantika

Cheat sheet validatsiyani ikki qatlamga ajratadi: sintaksis (kutilgan tur va format) va semantika (qiymat shu amal uchun mantiqiymi). Misol sifatida bron qilishda sanalar to'g'ri formatda bo'lishi kerak (sintaksis), tugash sanasi boshlanishdan keyin bo'lishi kerak (semantika). Bizning domenimizda: `fuel` son bo'lishi sintaksis, 0..100 oralig'ida bo'lishi semantika, `fromTs < toTs` sharti esa ikki maydon orasidagi semantika. Sxema kutubxonalari sintaksisni deyarli bepul beradi; semantikaning bir qismi (maydonlararo munosabat) sizning kodingizda qoladi.

### Maydon turiga qarab qoidalar

Cheat sheet har maydon turi uchun qoidalarni sanaydi. Mohiyati shunday:

| Tur | Nima tekshiriladi |
|---|---|
| Fixed choices | Ruxsat etilgan to'plamga aniq a'zolik (dropdown'dan kelgan qiymat ham) |
| Number, date | Kutilgan tur, qabul qilinadigan format, minimum va maksimum |
| String | Uzunlik chegarasi, maydon talab qiladigan belgilar yoki tuzilma |
| Object | Ruxsat etilgan maydonlar, majburiy maydonlar, yo'q yoki null qiymat qoidalari |
| Array | Elementlarning eng kam va eng ko'p soni, har element (ichki obyektlar bilan) tekshiruvi |

Eng ko'p unutiladigani chegara: satr uzunligi va massiv elementlari soni. OWASP API4 aynan shuni aytadi: barcha kiruvchi parametr va payload'lar uchun maksimal o'lcham, jumladan satr uzunligi, massiv elementlari soni va fayl hajmi belgilanishi va majburiy qilinishi kerak. Shuningdek yozuvlar sonini boshqaradigan parametr (`limit`, `pageSize`) server tomonda tekshiriladi (73-dars).

### Allowlist, denylist emas

Cheat sheet'ning asosiy qoidasi: nima qabul qilinishini belgilang va undan tashqaridagini rad eting; har xavfli satrni tanishga urinmang. Misol sifatida u apostrofni bloklash legitim ismlarni rad etishini, lekin ma'lumotlar bazasi so'rovini xavfsiz qilmasligini yozadi. Bu ikki sababni ko'rsatadi: denylist to'liq bo'lmaydi va u keraksiz zarar qiladi. Erkin matn (izoh, ism) uchun allowlist keng Unicode oralig'iga ruxsat berib, uzunlikni cheklashi mumkin; hamma maydonni `[a-z0-9]` ga siqish shart emas.

### Validatsiya nimani almashtirmaydi

Cheat sheet yana bir muhim chegarani aniq qo'yadi: validatsiya qo'shimcha himoyalarni almashtirmaydi. SQL uchun parametrlangan so'rov, XSS uchun kontekstga mos output encoding kerak, avtorizatsiya esa alohida tekshiriladi, chunki to'g'ri formatdagi hisob identifikatori shu hisobga kirishga ruxsat degani emas. Amalda: `^v[0-9]{1,6}$` ga mos `vehicleId` hali begona tenant'ning mashinasi bo'lishi mumkin. Validatsiya birinchi eshik, oxirgisi emas.

## Chuqurroq: sxemadagi tuzoqlar

### Noma'lum maydonlar

Sxema kutilgan maydonlarni tavsiflaydi, lekin kiruvchi obyektda ko'proq kalit bo'lishi mumkin. Uch xatti-harakat bor: noma'lum maydonni o'tkazib yuborish (kod keyin `...body` qilsa, mass assignment), jimgina tashlab yuborish (strip) va rad etish. Birinchisi eng xavfli. Strip mijozlarni sindirmaydi, rad etish esa xatoni ko'rinadigan qiladi va hujum belgisi sifatida logga yozish imkonini beradi (79-dars). Cheat sheet bu yerda aniq: JSON uchun required va additional properties ni ochiq sozlang, chunki xossani sxemada sanash uni majburiy ham, noma'lum maydonlarni rad etuvchi ham qilmaydi. NestJS'da bu `ValidationPipe` ning `whitelist: true` (dekoratorsiz xossalarni olib tashlaydi) va unga qo'shimcha `forbidNonWhitelisted: true` (olib tashlash o'rniga xato beradi) sozlamalari; Zod'da `z.object()` noma'lum xossani olib tashlaydi, `z.strictObject()` rad etadi, `z.looseObject()` saqlab qoladi (NestJS hujjati, validation bo'limi). Qoida xavfsiz tomonga: xavfli maydonlar (`tenantId`, `role`, `isAdmin`, `createdBy`) hech qachon kiruvchi tanadan olinmaydi, ular autentifikatsiya kontekstidan keladi (54-dars).

### Type coercion

Ko'p kutubxona ("qulaylik uchun") `"55"` ni `55` ga o'zgartiradi. Query string'da hamma narsa satr bo'lgani uchun bu ba'zan kerak, lekin u qabul qilinadigan kirishlar to'plamini kengaytiradi va JavaScript'ning o'zida tuzoqlar bor: `Number("")` 0, `Number("1e9")` 1000000000, `Number(" 7 ")` 7, `Number("Infinity")` Infinity, `Number([])` 0. Qoida: o'girish bo'lsa, u sxemada ochiq e'lon qilingan, uning ustidan esa tur va diapazon tekshiruvi turadi. JSON tanada esa o'girishni umuman yoqmang: `fuel` sonmi, satrmi, API shartnomasida aniq bo'lsin.

### Chegara va ichma-ich

Sxema tekshiruvi ham resurs sarflaydi: 100 000 elementli massivni element-element tekshirish ham CPU yeydi. Shuning uchun tana hajmi cheklovi parser darajasida (tekshiruvdan oldin), massiv va satr chegaralari esa sxema ichida bo'ladi. Cheat sheet parser chegaralarini, masalan ichma-ich chuqurlikning maksimumini, sozlashni ham aytadi; aniq raqamni esa biznes talabi va parser belgilaydi. Regex'li maydonlarda esa ReDoS xavfi bor: murakkab regex'ni kirishga qo'llashdan oldin 30-darsga qarang.

### Avval parse, keyin validatsiya

Cheat sheet tartibni aniq qo'yadi: so'rov hajmi chegarasi tanani buferga olish yoki parse qilishdan oldin qo'llanadi. Parse qilingandan keyingi sxema tekshiruvi allaqachon resursini tugatgan parserni qutqara olmaydi. Parser'dan keyin esa qiymat qaysi shaklda ishlatilsa, aynan shu shaklni tekshiring: protokol bo'yicha decode qilinadi, keyin qoidalar qo'llanadi va keyingi qatlamda qayta decode qilinmaydi, aks holda bir qatlam "toza" deb bilgan qiymatni boshqa qatlam o'zgartirib yuboradi. Yana bir qoida: matnni butun songa o'girish faqat turni belgilaydi, qabul qilinadigan miqdorni emas, shuning uchun `Number(x)` dan keyin ham min/max kerak.

Rad etilgan so'rov bilan nima qilinishi ham muhim. Cheat sheet aniq xato bilan rad etishni va qisman tekshirilgan ma'lumot bilan ishni davom ettirmaslikni talab qiladi. Rad etilgan kirishni logga yozganda esa uni so'zma-so'z yozmang: xato turi va metama'lumotni yozing, saqlanadigan begona qiymatlarni log formatiga mos escape qiling, aks holda log injection ochiladi (79-dars). Va tekshiruvlarni sinashda faqat noto'g'ri sintaksisni emas, rad etilishi kerak bo'lgan diapazonlarni, yetishmayotgan maydonlarni, ichki elementlardagi xatoni va juda katta massivni ham yuboring.

### Chiqish ham sxema bilan

API3 ning ikkinchi yuzi: javobda ortiqcha maydon. Xuddi kirish kabi chiqishni ham sxema bilan cheklang: javob DTO'si ruxsat etilgan maydonlarni ro'yxatdan oladi, ORM obyektini to'g'ridan-to'g'ri `return` qilmang. Aks holda bazaga yangi ustun (masalan, `internalNote`) qo'shilishi bilan u API javobida paydo bo'ladi.

## Misol: geofence yaratish endpoint'i

Platformada mijoz geofence (maydon chegarasi) yaratadi: nom, radius (metr) va nuqtalar ro'yxati. Kod in-memory, real tizim yo'q.

### 1. Zaif kod

```ts run
type Ctx = { tenant: string };
const store: Record<string, unknown>[] = [];

// ZAIF: tana tekshirilmaydi, `...body` hamma narsani ustiga yozadi, chegara yo'q
function createWeak(ctx: Ctx, body: any) {
  const g = { id: "g" + (store.length + 1), tenant: ctx.tenant, ...body, radiusM: Number(body.radiusM) };
  store.push(g);
  return g;
}

const points = Array.from({ length: 20000 }, (_, i) => [41 + i / 1e6, 69]);
const raw = JSON.stringify({ name: "depo", radiusM: "1e9", points, tenant: "beta" });

const g = createWeak({ tenant: "alfa" }, JSON.parse(raw));
console.log("tenant:", g.tenant);
console.log("radiusM:", g.radiusM);
console.log("nuqtalar soni:", g.points.length);
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu validatsiyasiz maydonlar orqali yuborish usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-4-moddasi (Kompyuter axborotini modifikatsiyalashtirish) va 278-5-moddasi (Kompyuter sabotaji) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

"alfa" tenant foydalanuvchisi o'z so'rovida uchta narsani qo'shdi: `tenant: "beta"` (yozuvni boshqa tenant'ga yozish), `radiusM: "1e9"` (mantiqsiz radius) va 20 000 nuqta. Natija:

```text
tenant: beta
radiusM: 1000000000
nuqtalar soni: 20000
```

`...body` `tenant` ni ustidan yozdi (API3 turidagi mass assignment, shuningdek tenant izolyatsiyasi buzildi), `Number("1e9")` radiusni milliard metrga aylantirdi, nuqtalar soni esa hech narsa bilan cheklanmadi (API4). Bu uch alohida `if` o'rniga bitta yo'qolgan sxemaning belgisi.

### 3. Tuzatilgan kod

Kichik deklarativ sxema: har maydon uchun qoida, noma'lum maydon rad etiladi, tenant faqat kontekstdan olinadi.

```ts run
type Rule =
  | { kind: "string"; max: number; re?: RegExp }
  | { kind: "number"; min: number; max: number; int?: boolean }
  | { kind: "array"; max: number; item: Rule }
  | { kind: "tuple2"; a: Rule; b: Rule };
type Schema = Record<string, Rule>;
type Parsed = { ok: true; value: Record<string, unknown> } | { ok: false; error: string };

function check(r: Rule, v: unknown, path: string): string | null {
  switch (r.kind) {
    case "string":
      if (typeof v !== "string" || v.length === 0 || v.length > r.max) return `${path}: satr 1..${r.max}`;
      if (r.re && !r.re.test(v)) return `${path}: format`;
      return null;
    case "number":
      if (typeof v !== "number" || !Number.isFinite(v) || v < r.min || v > r.max) return `${path}: son ${r.min}..${r.max}`;
      if (r.int && !Number.isInteger(v)) return `${path}: butun son`;
      return null;
    case "array": {
      if (!Array.isArray(v) || v.length === 0 || v.length > r.max) return `${path}: massiv 1..${r.max}`;
      for (let i = 0; i < v.length; i++) {
        const e = check(r.item, v[i], `${path}[${i}]`);
        if (e) return e;
      }
      return null;
    }
    case "tuple2":
      if (!Array.isArray(v) || v.length !== 2) return `${path}: juftlik`;
      return check(r.a, v[0], `${path}[0]`) ?? check(r.b, v[1], `${path}[1]`);
  }
}

function parse(schema: Schema, input: unknown): Parsed {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return { ok: false, error: "tana obyekt emas" };
  const o = input as Record<string, unknown>;
  for (const k of Object.keys(o)) if (!(k in schema)) return { ok: false, error: `noma'lum maydon: ${k}` };
  const value: Record<string, unknown> = {};
  for (const [k, rule] of Object.entries(schema)) {
    const e = check(rule, o[k], k);
    if (e) return { ok: false, error: e };
    value[k] = o[k];
  }
  return { ok: true, value };
}

const geofenceSchema: Schema = {
  name: { kind: "string", max: 60 },
  radiusM: { kind: "number", min: 10, max: 50000, int: true },
  points: { kind: "array", max: 500, item: { kind: "tuple2", a: { kind: "number", min: -90, max: 90 }, b: { kind: "number", min: -180, max: 180 } } },
};

const bigPoints = Array.from({ length: 20000 }, (_, i) => [41 + i / 1e6, 69]);
const attacks: [string, unknown][] = [
  ["tenant maydoni", { name: "depo", radiusM: 500, points: [[41, 69]], tenant: "beta" }],
  ["radius satr", { name: "depo", radiusM: "1e9", points: [[41, 69]] }],
  ["20000 nuqta", { name: "depo", radiusM: 500, points: bigPoints }],
  ["to'g'ri", { name: "depo", radiusM: 500, points: [[41.3, 69.2], [41.31, 69.21]] }],
];
for (const [label, body] of attacks) {
  const r = parse(geofenceSchema, body);
  console.log(label + ":", r.ok ? "qabul" : "rad - " + r.error);
}
```

```text
tenant maydoni: rad - noma'lum maydon: tenant
radius satr: rad - radiusM: son 10..50000
20000 nuqta: rad - points: massiv 1..500
to'g'ri: qabul
```

### Tuzatish nima uchun yetarli

Endi uchta invariant saqlanadi. Birinchisi, sxemada bo'lmagan kalit (`tenant`) so'rovni rad etadi, shuning uchun tenant faqat kontekstdan (`ctx.tenant`) olinadi. Ikkinchisi, `radiusM` faqat son turida va 10..50000 oralig'ida qabul qilinadi; satr yoki `1e9` o'tmaydi. Uchinchisi, massiv uzunligi 500 dan oshmaydi, shuning uchun tekshiruv xarajati va saqlanadigan hajm cheklangan. Chegara qiymatlari (60, 50000, 500) bizning o'quv qarorimiz; real qiymat biznes talabidan olinadi.

Yopilmagan narsalar: sxema tana parse qilingandan keyin ishlaydi, shuning uchun juda katta JSON tanani parser darajasida alohida cheklash kerak. Kalit nomlari (`__proto__`) bilan bog'liq muammolar bu mini-validator'da alohida ko'rilmagan (29-dars). Maydonlararo semantika (masalan, nuqtalar o'z-o'zini kesmasligi) bu yerda yo'q. Eng muhimi, `name` ichidagi matn keyin HTML'ga chiqarilsa, XSS'dan validatsiya emas, output encoding himoya qiladi (32-dars).

### Mashq

Quyidagi funksiya `limit` va `offset` ni tekshirishi kerak, lekin ikkita xatosi bor. Testlarga qarab tuzating: qoidalar `limit` 1..100 butun, `offset` 0 dan katta yoki teng butun, satr kelsa rad etiladi.

```ts run
type Page = { ok: true; limit: number; offset: number } | { ok: false };

function parsePage(q: Record<string, unknown>): Page {
  const limit = Number(q.limit);
  const offset = Number(q.offset ?? 0);
  if (limit > 100 || offset < 0) return { ok: false };
  return { ok: true, limit, offset };
}
```

```ts test
check("limit=50 qabul qilinadi", () => parsePage({ limit: 50 }).ok === true);
check("limit=0 rad etiladi", () => parsePage({ limit: 0 }).ok === false);
check("limit='Infinity' rad etiladi", () => parsePage({ limit: "Infinity" }).ok === false);
check("limit='abc' (NaN) rad etiladi", () => parsePage({ limit: "abc" }).ok === false);
check("limit=2.5 rad etiladi", () => parsePage({ limit: 2.5 }).ok === false);
check("offset=-1 rad etiladi", () => parsePage({ limit: 10, offset: -1 }).ok === false);
check("limit='10' (satr) rad etiladi", () => parsePage({ limit: "10" }).ok === false);
```

## Qachon qo'llamaslik kerak

- Sxema hamma narsani hal qiladigan vosita emas. U formatni tekshiradi, lekin ruxsatni, parametrlashni va encoding'ni emas. "Validatsiya bor, demak SQL injection yo'q" degan xulosa xavfli.
- Haddan tashqari qat'iy sxema legitim kirishni rad etadi: ism maydonini `[A-Za-z]` ga siqish o'zbek, rus yoki turk ismlarini sindiradi. Qat'iylik maydon talabiga mos bo'lsin.
- Sxema bor-yo'q tekshiruvlarini ikki joyda yuritmang. Frontend va backend sxemasi alohida yozilib, bir-biridan chetga chiqsa, ikkinchisida xato qoladi. Bitta manbadan (masalan, umumiy TypeScript paketi) hosil qiling; backend baribir frontend tekshiruviga tayanmaydi.
- Ichki servislararo chaqiruvlarda to'liq validatsiya ba'zan ortiqcha ko'rinadi. Lekin ichki servis ham buzilgan yoki xato mijozdan ma'lumot olishi mumkin; kamida turlar va chegaralarni tekshiring.

## Stack'da: NestJS, Fastify va Prisma

NestJS'da kirish DTO va `app.useGlobalPipes(new ValidationPipe(...))` orqali tekshiriladi; pipe `class-validator` va `class-transformer` ustida ishlaydi, dekoratorlar esa sxema vazifasini bajaradi. Dekoratorlar o'zi tekshirmaydi: `ValidationPipe` ulanishi shart, NestJS hujjati uni ilova darajasida (`app.useGlobalPipes(new ValidationPipe())`) bog'lashni tavsiya qiladi, shunda har endpoint himoyalanadi; pipe ulanmagan route'da DTO faqat tur annotatsiyasi bo'lib qoladi. Xavfsizlik uchun muhim sozlamalar: `whitelist: true` (validatsiya dekoratori yo'q xossalar olib tashlanadi), `forbidNonWhitelisted: true` (olib tashlash o'rniga xato; `whitelist` bilan birga beriladi), `transform: true` (payload DTO sinfiga aylanadi va primitiv turlar o'giriladi, masalan `@Param('id') id: number` uchun satr songa o'giriladi; bu coercion, ya'ni uni bilib yoqing). Sinovda (NestJS 12) `/n/abc` uchun `@Param('id') id: number` xatosiz `NaN` bo'ldi (JSON'da `null`), `limit=1e9` esa `1000000000` ga aylandi: o'girib bo'lmasa so'rov rad etilmaydi, shuning uchun parametrga `ParseIntPipe` (`abc` va `5.5` uchun 400 beradi, lekin `1e9` va bo'sh `limit=` ni o'tkazadi: u 0 bo'ladi) yoki DTO bilan `@IsInt() @Min() @Max()` qo'shing. `disableErrorMessages: true` validatsiya xabarlarini mijozga qaytarmaydi (78-dars). `forbidUnknownValues` noma'lum obyektni tekshirishga urinish darhol muvaffaqiyatsiz bo'lishini belgilaydi; class-validator hujjati uning sukut bo'yicha `true` ekanini aytadi va `false` qilsa noma'lum obyektlar tekshiruvdan o'tib ketishi haqida ogohlantiradi. Zod kabi sxema kutubxonalari uchun NestJS `StandardSchemaValidationPipe` beradi: unda `z.object()` noma'lum xossalarni olib tashlaydi (`whitelist` kabi), `z.strictObject()` rad etadi (`forbidNonWhitelisted` kabi). Fastify JSON Schema bilan ishlaydi: sxema route'ga beriladi, tekshiruvdan o'tmagan so'rov handler'ga yetmaydi; Fastify hujjatiga ko'ra uning baseline Ajv sozlamasi `coerceTypes: 'array'` (qiymat sxemadagi `type` ga o'giriladi), `useDefaults: true` (yo'q xossa `default` bilan to'ldiriladi) va `removeAdditional: true` (sxemada `additionalProperties: false` bo'lsa, qo'shimcha xossalar rad etilmay, jimgina olib tashlanadi) qiymatlarini beradi; hujjat o'zi bu xatti-harakatni loyiha talabiga mosligini tekshirishni tavsiya qiladi. Shuning uchun o'z shartnomangizga mos holda test yozing: noma'lum maydon, satr o'rniga son va juda uzun massiv yuboring.

```ts
import { IsInt, IsNumber, IsString, Max, MaxLength, Min, ValidateNested, ArrayMaxSize, ArrayNotEmpty } from "class-validator";
import { Type } from "class-transformer";

class PointDto {
  @IsNumber() @Min(-90) @Max(90) lat!: number;
  @IsNumber() @Min(-180) @Max(180) lon!: number;
}

export class CreateGeofenceDto {
  @IsString() @MaxLength(60) name!: string;
  @IsInt() @Min(10) @Max(50000) radiusM!: number;

  @ArrayNotEmpty() @ArrayMaxSize(500)
  @ValidateNested({ each: true }) @Type(() => PointDto)
  points!: PointDto[];
}
```

`tenantId` DTO'da yo'q: u controller'da `req.user` dan olinadi va servisga alohida argument sifatida beriladi. Prisma bilan ishlaganda ham DTO'dan olingan obyektni `data` ga to'g'ridan-to'g'ri `...dto` qilib bermang, maydonlarni ro'yxatdan aniq ko'chiring.

## Xulosa

- Kirishni deklarativ sxema bilan tekshiring: tur, format, diapazon, uzunlik, massiv elementlari soni va ichma-ich elementlar.
- Allowlist ishlating: nima qabul qilinishini belgilang. Denylist to'liq bo'lmaydi va legitim kirishni rad etadi.
- Noma'lum maydonni rad eting yoki ongli ravishda tashlab yuboring; `tenantId`, `role` kabi maydonlar hech qachon tanadan olinmasin.
- Coercion qabul qilinadigan kirishlarni kengaytiradi: `Number("")` 0 va `Number("1e9")` 1000000000. O'girish ochiq e'lon qilinsin va uning ustidan tur va diapazon tekshirilsin.
- Validatsiya parametrlangan so'rov, output encoding va avtorizatsiyani almashtirmaydi: to'g'ri formatdagi identifikator hali ruxsat emas.
- Chiqishni ham sxema bilan cheklang: javob DTO'si maydonlarni ro'yxatdan oladi.
