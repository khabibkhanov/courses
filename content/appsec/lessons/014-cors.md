---
n: 14
slug: cors
title: "CORS: preflight, credentials va xato sozlamalar"
summary: "CORS same-origin policy'ni qanday yumshatishi, simple va preflight so'rovlar, Access-Control-Allow-Origin va Allow-Credentials qoidalari, Origin'ni aks ettirish xatosi, Vary: Origin va to'g'ri ruxsat ro'yxati."
duration: 45
sources:
  - id: mdn-cors
    note: "MDN CORS qo'llanmasi: simple so'rov, preflight, credentials va header'lar ro'yxati"
  - id: whatwg-fetch
    note: "Fetch Standard: CORS protokoli, CORS-safelisted metod va header'lar, credentials bilan wildcard taqiqi"
  - id: t10-a02
    note: "A02:2025 Security Misconfiguration: noto'g'ri sozlangan CORS siyosati misollar qatorida"
quiz:
  - q: "API `Access-Control-Allow-Origin: *` qaytaradi va ma'lumot cookie bilan himoyalangan. Tashqi sahifadan `fetch(url, {credentials: 'include'})` chaqirildi. Natija?"
    options:
      - "Brauzer javobni skriptga beradi, chunki * hammaga ruxsat"
      - "Brauzer javobni skriptga bermaydi: credentials bilan wildcard qabul qilinmaydi"
      - "Server 403 qaytaradi"
      - "Cookie yuboriladi, lekin javob bo'sh keladi"
    answer: 1
    explain: "Fetch Standard credentials bilan so'rov uchun `*` ni yaroqsiz deb hisoblaydi: aniq origin va `Access-Control-Allow-Credentials: true` kerak. Shuning uchun wildcard cookie ishlatadigan ma'lumotni ochmaydi. Xavfli sozlama aynan shu cheklovni aylanib o'tish: kelgan Origin'ni aks ettirish."
  - q: "Quyidagi middleware nima uchun xavfli?\n\n```ts\nres.setHeader(\"Access-Control-Allow-Origin\", req.headers.origin);\nres.setHeader(\"Access-Control-Allow-Credentials\", \"true\");\n```"
    options:
      - "Origin header'i har doim bo'sh bo'ladi"
      - "Hech narsa xavfli emas: brauzer cheklaydi"
      - "Har qanday sayt foydalanuvchi cookie'si bilan javobni o'qiy oladi"
      - "Faqat GET so'rovlarga ta'sir qiladi"
    answer: 2
    explain: "Origin aks ettirilsa, har qanday hujumchi sahifasi ruxsat oladi, credentials esa foydalanuvchi cookie'sini qo'shadi. Natija: boshqa saytdan autentifikatsiya qilingan javobni o'qish. Cheklov brauzerda emas, server siyosatida bo'lishi kerak."
  - q: "Qaysi so'rov preflight (OPTIONS) talab qiladi?"
    options:
      - "`GET` + `Accept: application/json`"
      - "`POST` + `Content-Type: text/plain`"
      - "`POST` + `Content-Type: application/x-www-form-urlencoded`"
      - "`POST` + `Content-Type: application/json`"
    answer: 3
    explain: "CORS-safelisted Content-Type qiymatlari: application/x-www-form-urlencoded, multipart/form-data, text/plain. `application/json` bu ro'yxatda yo'q, shuning uchun preflight yuboriladi. Qolgan uchtasi oddiy (simple) so'rov."
  - q: "CORS siyosatiga ko'ra tashqi sahifadan `POST` form (simple so'rov) yuborildi, server CORS ruxsat bermagan. Nima bo'ladi?"
    options:
      - "So'rov serverga yetib boradi va bajariladi; brauzer faqat javobni skriptga bermaydi"
      - "Brauzer so'rovni yubormaydi"
      - "Server avtomatik rad etadi"
      - "Preflight yuboriladi va rad etiladi"
    answer: 0
    explain: "Simple so'rovda preflight yo'q: so'rov yuboriladi, CORS faqat javobni o'qishni boshqaradi. Shuning uchun CORS CSRF himoyasi emas. Yon ta'sirli POST ni CSRF token yoki SameSite/Fetch Metadata bilan himoya qilish kerak."
  - q: "Server `Access-Control-Allow-Origin` ni so'rovdagi Origin'ga qarab o'zgartiradi (ruxsat ro'yxatidan). Nega `Vary: Origin` kerak?"
    options:
      - "Brauzer uni talab qiladi, aks holda xato beradi"
      - "Preflight natijasini saqlash uchun"
      - "Cookie yuborilishi uchun"
      - "Oraliq cache bir origin uchun saqlangan javobni boshqa origin'ga bermasligi uchun"
    answer: 3
    explain: "Javob Origin'ga bog'liq bo'lsa, CDN yoki brauzer cache'i bir origin uchun saqlangan javobni boshqasiga berishi mumkin (noto'g'ri ACAO bilan). Vary: Origin cache kalitiga Origin'ni qo'shadi (20-dars). Brauzer uni talab qilmaydi, lekin cache xatosi real."
  - q: "Ruxsat ro'yxatiga `null` origin'ni qo'shish nega xavfli?"
    options:
      - "Sandbox iframe va ba'zi boshqa begona kontekstlar `Origin: null` yuboradi, ya'ni hujumchi shu qiymatni ishlab chiqara oladi"
      - "`null` qiymati brauzerlarda mavjud emas"
      - "Server `null` ni o'qiy olmaydi"
      - "Faqat HTTP'da muammo"
    answer: 0
    explain: "Opaque origin'li kontekstlar (sandbox iframe va h.k.) `null` yuboradi; hujumchi shunday kontekst yaratib `null` ruxsatidan foydalanadi. Boshqa variantlar mexanizmga mos kelmaydi."
task:
  title: "CORS ruxsat ro'yxati va Vary"
  prompt: |
    `corsHeaders(origin)` har so'rovda qaytariladigan CORS header'larini hosil qiladi. Hozir u kelgan Origin'ni aks ettiradi va credentials'ni doim yoqadi.

    Funksiyani tuzating:

    1. Ruxsat etilgan origin'lar: `https://app.fleet.example` va `https://admin.fleet.example` (aniq tenglik).
    2. Ruxsat etilgan origin uchun: `Access-Control-Allow-Origin` shu origin, `Access-Control-Allow-Credentials: true`.
    3. Boshqa origin, `undefined` yoki `"null"` uchun: ruxsat header'lari qaytmasin.
    4. Har holda `Vary: Origin` qaytsin.
    5. Imzoni o'zgartirmang. Oxirgi uchta `console.log` natijasi: ruxsat etilgan uchun 3 ta header, begona uchun faqat `Vary`, `null` uchun faqat `Vary`.
  lang: ts
  starter: |
    // ZAIF: Origin aks ettiriladi, credentials har doim yoqilgan
    function corsHeaders(origin: string | undefined): Record<string, string> {
      return {
        "Access-Control-Allow-Origin": origin ?? "*",
        "Access-Control-Allow-Credentials": "true",
      };
    }

    console.log(corsHeaders("https://app.fleet.example"));
    console.log(corsHeaders("https://evil.example"));
    console.log(corsHeaders("null"));
  solution: |
    const ALLOWED = new Set(["https://app.fleet.example", "https://admin.fleet.example"]);

    function corsHeaders(origin: string | undefined): Record<string, string> {
      const h: Record<string, string> = { Vary: "Origin" };
      if (origin && ALLOWED.has(origin)) {
        h["Access-Control-Allow-Origin"] = origin;
        h["Access-Control-Allow-Credentials"] = "true";
      }
      return h;
    }

    console.log(corsHeaders("https://app.fleet.example"));
    console.log(corsHeaders("https://evil.example"));
    console.log(corsHeaders("null"));
  solutionNotes: |
    - Aniq tenglik (`Set.has`): satr funksiyalari (`endsWith`, `includes`) 12-darsdagi xatolarni qaytaradi.
    - Begona origin uchun ACAO umuman qaytmaydi, `*` ham emas: credentials'li API'da wildcard kerak emas.
    - `Vary: Origin` har javobda bor, ruxsat berilmaganda ham: cache ruxsatsiz javobni ruxsat etilgan origin'ga bermasligi uchun.
    - `"null"` ro'yxatda yo'q, shuning uchun opaque origin'lar ruxsat olmaydi.
    - CORS server himoyasi emas: simple so'rovlar baribir serverga yetadi, CSRF himoyasi alohida (36-dars).
  checklist:
    - "Faqat ro'yxatdagi origin ACAO va Allow-Credentials oladi"
    - "Begona va `null` origin ruxsat header'ini olmaydi"
    - "`Vary: Origin` har holda qaytadi"
    - "Wildcard (`*`) credentials bilan ishlatilmaydi"
    - "CORS CSRF'dan himoya qilmasligini ayta olasiz"
---

## Muammo

Frontend `app.fleet.example` da, API `api.fleet.example` da. Brauzer same-origin policy tufayli sahifa skriptiga API javobini bermaydi (12-dars). Dasturchi birinchi marta konsolda "blocked by CORS policy" xatosini ko'radi va internetdan topgan "tuzatish"ni qo'yadi: `Access-Control-Allow-Origin: *` yoki eng yomoni, kelgan `Origin`ni aks ettiruvchi middleware. Xato yo'qoladi, ilova ishlaydi, lekin xavfsizlik chegarasi ham yo'qoladi.

CORS (Cross-Origin Resource Sharing) SOP'ni o'chirmaydi. U serverga brauzerga "bu origin mening javobimni o'qishi mumkin" deb aytish imkonini beradi. Qaror serverda, ijrochi brauzerda. Shuning uchun noto'g'ri sozlangan CORS, ayniqsa credentials (cookie) bilan, tashqi saytga foydalanuvchi nomidan autentifikatsiyalangan javobni o'qish imkonini beradi. OWASP Top 10:2025 da bu A02 Security Misconfiguration ostida keladigan tipik xato.

Ikkinchi nomuvofiqlik: dasturchilar CORS'ni "tashqi saytdan so'rov yuborishni taqiqlash" deb tushunadi. Aslida CORS so'rov yuborishni emas, javobni o'qishni boshqaradi, va ko'p so'rovlar serverga baribir yetib boradi. Bu darsda biz mexanizmni aniq ko'ramiz: simple va preflight so'rovlar, header'lar, credentials qoidalari va xato sozlamaning aniq hujumi.

## Asosiy g'oya

### Oqim

Brauzer cross-origin so'rov yuborganda `Origin` header'ini qo'shadi. Server javobda `Access-Control-Allow-Origin` (ACAO) bilan o'sha origin'ni (yoki `*` ni) ko'rsatsa, brauzer javobni skriptga beradi. Ko'rsatmasa, so'rov (simple holatda) allaqachon yuborilgan bo'ladi, lekin javob skriptga berilmaydi. Asosiy header'lar (MDN):

| Header | Kim yuboradi | Ma'nosi |
|---|---|---|
| `Origin` | Brauzer | So'rov qaysi origin'dan |
| `Access-Control-Allow-Origin` | Server | Javobni o'qishi mumkin bo'lgan origin yoki `*` |
| `Access-Control-Allow-Credentials` | Server | `true` bo'lsa, cookie bilan so'rovning javobi o'qiladi |
| `Access-Control-Request-Method`, `-Headers` | Brauzer (preflight) | Haqiqiy so'rovda ishlatiladigan metod va header'lar |
| `Access-Control-Allow-Methods`, `-Headers` | Server (preflight) | Ruxsat etilgan metod va header'lar |
| `Access-Control-Max-Age` | Server | Preflight natijasi qancha saqlanadi |
| `Access-Control-Expose-Headers` | Server | Skript o'qiy oladigan qo'shimcha javob header'lari |

### Simple va preflight

Fetch Standard "CORS-safelisted" metodlar (`GET`, `HEAD`, `POST`), ba'zi header'lar va `Content-Type` qiymatlari (`application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`) ro'yxatini belgilaydi. Shu ro'yxatdan chiqmaydigan so'rov "simple" bo'ladi: u to'g'ridan-to'g'ri yuboriladi. Ro'yxatdan chiqsa (masalan, `PUT`, `DELETE`, `Authorization` header'i yoki `Content-Type: application/json`) brauzer avval `OPTIONS` preflight yuboradi va serverdan ruxsat so'raydi. Ruxsat bo'lmasa, haqiqiy so'rov yuborilmaydi.

Bu qoida tarixiy: HTML formalar CORS'dan oldin ham cross-origin `POST` yubora olgan, shuning uchun formaga o'xshash so'rovlar preflight talab qilmaydi. Natija muhim: **JSON API'ning preflight talab qilishi tasodifan ba'zi CSRF hujumlarini to'sadi, lekin bunga tayanmang.** Server `Content-Type` ni tekshirmasdan `text/plain` bilan kelgan JSON body'ni qabul qilsa, "JSON uchun preflight bor" himoyasi yo'qoladi.

### Credentials

Standart holatda cross-origin `fetch` cookie yubormaydi. `credentials: "include"` bilan yuborilsa, brauzer cookie qo'shadi, lekin javobni berish uchun server `Access-Control-Allow-Credentials: true` qaytarishi va ACAO aniq origin bo'lishi kerak. `*` credentials bilan yaroqsiz: Fetch Standard buni rad etadi. Shu cheklov sababli dasturchilar "wildcard ishlamayapti" deb Origin'ni aks ettiradigan kod yozadi, va xavfsizlik chegarasi shu yerda yo'qoladi.

## Chuqurroq: aks ettirish, null va cache

### Origin'ni aks ettirish

Quyidagi middleware ko'p loyihada uchraydi:

```ts
res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
res.setHeader("Access-Control-Allow-Credentials", "true");
```

Bu "ro'yxat: hamma" degani. Har qanday hujumchi sahifasi `fetch(api, {credentials:"include"})` qiladi, foydalanuvchi cookie'si bilan javob keladi va skript uni o'qiydi. Ma'lumotni o'qish uchun foydalanuvchi hujumchi sahifasini ochishi yetarli.

### `null` origin

`Origin: null` ruxsat etilsa, sandbox iframe yoki `data:` hujjat kabi begona kontekst ruxsat oladi (12-dars). Ko'p tuzoqli ruxsat ro'yxatlarida `null` "lokal fayl bilan test qilish uchun" qo'shiladi va unutilib qoladi.

### Vary: Origin va cache

Agar javobdagi ACAO so'rovdagi Origin'ga bog'liq bo'lsa, oraliq cache bir origin uchun saqlangan javobni boshqasiga berishi mumkin. Natija ikki xil: ruxsat etilgan origin noto'g'ri javob oladi (xizmat buziladi) yoki ruxsatsiz origin ruxsatli javobni oladi. Yechim: javobga `Vary: Origin` qo'shish. Cache zaharlanishining umumiy mexanizmi 20-darsda.

### Preflight va autentifikatsiya

Preflight so'rovida brauzer cookie va `Authorization` yubormaydi, shuning uchun preflight endpoint'ni autentifikatsiya orqasiga yopmang: u 401 qaytarsa, haqiqiy so'rov hech qachon yuborilmaydi. Preflight javobi ruxsat berishi mumkin, haqiqiy so'rovning o'zi esa autentifikatsiya va avtorizatsiyadan o'tadi. CORS ruxsati autorizatsiya emas: u faqat "brauzer skriptiga javob berish" qarori.

Quyidagi `run` bloki preflight kerakligini aniqlash qoidasini soddalashtirilgan ko'rinishda beradi. Bu to'liq Fetch algoritmi emas (unda boshqa header cheklovlari ham bor), mexanizmni ko'rsatish uchun.

```ts run
const SAFE_METHODS = new Set(["GET", "HEAD", "POST"]);
const SAFE_CT = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
const SAFE_HEADERS = new Set(["accept", "accept-language", "content-language", "content-type"]);

function needsPreflight(method: string, headers: Record<string, string>): boolean {
  if (!SAFE_METHODS.has(method)) return true;
  for (const [k, v] of Object.entries(headers)) {
    const name = k.toLowerCase();
    if (!SAFE_HEADERS.has(name)) return true;
    if (name === "content-type" && !SAFE_CT.has(v.split(";")[0].trim().toLowerCase())) return true;
  }
  return false;
}

const cases: [string, Record<string, string>][] = [
  ["GET", { Accept: "application/json" }],
  ["POST", { "Content-Type": "text/plain" }],
  ["POST", { "Content-Type": "application/json" }],
  ["DELETE", {}],
  ["GET", { Authorization: "Bearer x" }],
];
for (const [m, h] of cases) {
  console.log(m.padEnd(6), JSON.stringify(h).padEnd(36), needsPreflight(m, h) ? "preflight" : "simple");
}
```

```text
GET    {"Accept":"application/json"}        simple
POST   {"Content-Type":"text/plain"}        simple
POST   {"Content-Type":"application/json"}  preflight
DELETE {}                                   preflight
GET    {"Authorization":"Bearer x"}         preflight
```

## Misol: aks ettirilgan Origin

Quyidagi kod server CORS siyosatini va brauzerning o'qish qarorini sof funksiyalar sifatida modellaydi. `browserCanRead` Fetch Standard qoidalarining soddalashtirilgan ko'rinishi. Hammasi o'quv kodi.

### 1. Zaif kod

```ts run
type Res = { headers: Record<string, string>; body: string };

// ZAIF: Origin aks ettiriladi va credentials har doim yoqilgan
function serverWeak(origin: string | undefined, sessionUser: string | null): Res {
  return {
    headers: {
      "Access-Control-Allow-Origin": origin ?? "*",
      "Access-Control-Allow-Credentials": "true",
    },
    body: sessionUser ? `{"user":"${sessionUser}","vehicles":42}` : `{"error":"login"}`,
  };
}

// Brauzer qarori: javob skriptga beriladimi (soddalashtirilgan)
function browserCanRead(origin: string, withCreds: boolean, r: Res): boolean {
  const acao = r.headers["Access-Control-Allow-Origin"];
  if (withCreds) return acao === origin && r.headers["Access-Control-Allow-Credentials"] === "true";
  return acao === origin || acao === "*";
}

const r = serverWeak("https://app.fleet.example", "dispatcher-alfa");
console.log(browserCanRead("https://app.fleet.example", true, r), r.body);
```

```text
true {"user":"dispatcher-alfa","vehicles":42}
```

Ilovaning o'z frontendi uchun hamma narsa ishlaydi.

### 2. Hujum

Foydalanuvchi tizimga kirgan va hujumchi sahifasini ochadi. Hujumchi skripti `fetch(api, {credentials: "include"})` chaqiradi; brauzer foydalanuvchi cookie'sini qo'shadi, server esa `Origin: https://evil.example` ni aks ettiradi.

```ts run
type Res = { headers: Record<string, string>; body: string };

function serverWeak(origin: string | undefined, sessionUser: string | null): Res {
  return {
    headers: {
      "Access-Control-Allow-Origin": origin ?? "*",
      "Access-Control-Allow-Credentials": "true",
    },
    body: sessionUser ? `{"user":"${sessionUser}","vehicles":42}` : `{"error":"login"}`,
  };
}
function browserCanRead(origin: string, withCreds: boolean, r: Res): boolean {
  const acao = r.headers["Access-Control-Allow-Origin"];
  if (withCreds) return acao === origin && r.headers["Access-Control-Allow-Credentials"] === "true";
  return acao === origin || acao === "*";
}

const evil = "https://evil.example";
const r = serverWeak(evil, "dispatcher-alfa"); // cookie brauzer tomonidan qo'shilgan
const ok = browserCanRead(evil, true, r);
console.log("hujumchi skripti o'qiy oladi:", ok);
if (ok) console.log("o'qilgan:", r.body);
```

```text
hujumchi skripti o'qiy oladi: true
o'qilgan: {"user":"dispatcher-alfa","vehicles":42}
```

Hujumchi sahifasi foydalanuvchi nomidan autentifikatsiyalangan javobni oldi. Bu faqat shu o'quv modelida; real tizimda javob foydalanuvchi ma'lumotlariga ega bo'lardi.

### 3. Tuzatilgan kod

```ts run
type Res = { headers: Record<string, string>; body: string };

const ALLOWED = new Set(["https://app.fleet.example", "https://admin.fleet.example"]);

function server(origin: string | undefined, sessionUser: string | null): Res {
  const headers: Record<string, string> = { Vary: "Origin" };
  if (origin && ALLOWED.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }
  return { headers, body: sessionUser ? `{"user":"${sessionUser}","vehicles":42}` : `{"error":"login"}` };
}

function browserCanRead(origin: string, withCreds: boolean, r: Res): boolean {
  const acao = r.headers["Access-Control-Allow-Origin"];
  if (withCreds) return acao === origin && r.headers["Access-Control-Allow-Credentials"] === "true";
  return acao === origin || acao === "*";
}

for (const o of ["https://app.fleet.example", "https://evil.example", "null"]) {
  const r = server(o, "dispatcher-alfa");
  console.log(o.padEnd(28), "o'qiydi:", browserCanRead(o, true, r), "Vary:", r.headers["Vary"]);
}
```

```text
https://app.fleet.example    o'qiydi: true Vary: Origin
https://evil.example         o'qiydi: false Vary: Origin
null                         o'qiydi: false Vary: Origin
```

Tuzatish nima uchun yetarli. Invariant: javobni o'qish ruxsati faqat aniq ro'yxatdagi origin'larga beriladi, ro'yxat konfiguratsiyada, tenglik aniq. Hujumchi origin'i ACAO olmaydi, shuning uchun brauzer javobni skriptga bermaydi. `Vary: Origin` cache aralashuvining oldini oladi.

Yopilmagani. Birinchidan, serverga hujum so'rovi baribir yetib boradi: bu misolda `server()` chaqirildi va, agar u yon ta'sirli bo'lsa, bajariladi. CORS CSRF'ni to'xtatmaydi (36-dars). Ikkinchidan, ro'yxatdagi origin'ning o'zida XSS bo'lsa, hujumchi o'sha origin'dan o'qiydi: ro'yxatni qisqa tuting. Uchinchidan, CORS faqat brauzerni cheklaydi; `curl` bilan cookie yoki token ega bo'lgan har kim API'ga murojaat qila oladi, ya'ni avtorizatsiya server tomonda alohida tekshiriladi.

## Qachon qo'llamaslik kerak

- CORS umuman kerak bo'lmasligi mumkin. Frontend va API bir origin'da (reverse proxy orqali `/api` yo'li) bo'lsa, cross-origin so'rov yo'q va CORS o'chirib qo'yiladi. Bu eng xavfsiz sozlama: konfiguratsiya yo'q, xato yo'q. Next.js'da API yo'llari yoki rewrite shu uchun mos.
- Haqiqatan ommaviy, autentifikatsiyasiz API (ochiq ma'lumot) uchun `Access-Control-Allow-Origin: *` to'g'ri tanlov. Faqat cookie, token yoki foydalanuvchiga xos ma'lumot yo'qligiga ishonch hosil qiling va hech qachon `*` ni credentials bilan aralashtirmang.
- Dinamik ruxsat ro'yxati (har mijoz o'z domenini qo'shadi) murakkab: ro'yxatni bazadan olish, domenga egalikni tasdiqlash va kesh siyosatini hisobga olish kerak. Bu holda har domen uchun tekshirilgan yozuv yetarli; keng `endsWith` qoidasi yo'q.
- Preflight natijasini uzoq keshlash (`Access-Control-Max-Age`) siyosat o'zgarishini kechiktiradi. MDN: standart qiymat 5 sekund, brauzerlar esa o'zlarining ichki yuqori chegarasini qo'llaydi (u `Access-Control-Max-Age` qiymatidan ustun). Qisqa qiymat qo'ying.
- CORS xatosini "tuzatish" uchun brauzer kengaytmasi yoki `--disable-web-security` ishlatish faqat lokal sinov uchun; production xatolari bunday yo'qolmaydi.

## Stack'da: NestJS va Fastify

NestJS'da `app.enableCors({...})`, Fastify'da `@fastify/cors` (`origin`, `credentials`, `methods`, `allowedHeaders`, `maxAge` opsiyalari). Ikkalasida ham `origin` uchun massiv yoki funksiya berasiz; massiv aniq tenglik beradi. Kod ishga tushirilmaydi (framework kerak), sintaksis tekshirilgan.

```ts
import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify();

await app.register(cors, {
  origin: ["https://app.fleet.example", "https://admin.fleet.example"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600, // sekund; qisqa qiymat
});

app.get("/vehicles", async (req) => {
  // CORS ruxsat emas: avtorizatsiya alohida (51-58 darslar)
  return { ok: true };
});
```

NestJS hujjati ogohlantiradi: Fastify'da cross-origin `PUT`, `PATCH` yoki `DELETE` preflight bosqichida rad etiladi, agar `methods` ni o'zingiz ko'rsatmasangiz (Express'da shu kod ishlaydi). Kutubxona standart qiymatlari versiyaga qarab o'zgaradi, shuning uchun `origin`, `credentials` va `Vary` xatti-harakatini integratsiya testi bilan tekshiring: begona `Origin` bilan so'rov yuborib, ACAO header'i yo'qligini tasdiqlang. Nest'da `app.enableCors({ origin: [...], credentials: true })` ham shu ma'noda ishlaydi.

## Xulosa

- CORS SOP'ni yumshatish mexanizmi: qaror serverda (ACAO), ijrochi brauzer. U so'rov yuborilishini emas, javob o'qilishini boshqaradi.
- Simple so'rov serverga preflightsiz yetib boradi; shuning uchun CORS CSRF himoyasi emas.
- `*` credentials bilan ishlamaydi, Origin'ni aks ettirish esa credentials bilan "hamma ruxsat" degani. Aniq ruxsat ro'yxati va aniq tenglik ishlating.
- `null` origin'ni ruxsat etmang. Javob Origin'ga bog'liq bo'lsa, `Vary: Origin` qo'shing.
- Frontend va API bir origin'da bo'lsa CORS kerak emas: bu eng sodda va xavfsiz variant.
- CORS ruxsati avtorizatsiya emas; har endpoint serverda alohida tekshiriladi.
