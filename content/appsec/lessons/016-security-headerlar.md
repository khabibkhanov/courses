---
n: 16
slug: security-headerlar
title: "Security header'lar: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy"
summary: "HSTS qanday SSL stripping'ni to'sadi va uning chegaralari, X-Content-Type-Options nosniff, Referrer-Policy bilan URL sizib chiqishini cheklash, Permissions-Policy, ortiqcha ma'lumot beruvchi header'lar va Helmet bilan joriy qilish."
duration: 40
sources:
  - id: rfc6797
    note: "HSTS spetsifikatsiyasi: Strict-Transport-Security header'i, max-age va includeSubDomains, xavfsiz bo'lmagan transport orqali kelgan header'ning e'tiborsiz qoldirilishi"
  - id: mdn-hsts
    note: "MDN HSTS sahifasi: HTTP orqali kelgan header e'tiborsiz, birinchi tashrif zaifligi, preload shartlari (max-age kamida 1 yil, includeSubDomains), max-age=0, sertifikat xatosini chetlab o'tib bo'lmasligi"
  - id: mdn-nosniff
    note: "MDN X-Content-Type-Options sahifasi: script va style so'rovlarida MIME mos kelmasa bloklash, boshqa javoblarda sniffing o'chiriladi"
  - id: mdn-referrer-policy
    note: "MDN Referrer-Policy sahifasi: standart qiymat strict-origin-when-cross-origin (2020-yil noyabr o'zgarishi), vergul bilan fallback ro'yxati"
  - id: mdn-permissions-policy
    note: "MDN Permissions-Policy sahifasi: allowlist sintaksisi (*, (), self), iframe allow atributi bilan moslik, eksperimental holat, report-to"
  - id: nestjs-helmet
    note: "NestJS hujjati: useSecurityHeaders() (NestJS v12.1 dan), standart header'lar jadvali, opsiyalar, eski versiya va to'g'ridan-to'g'ri Helmet ulash usuli"
  - id: t10-a02
    note: "A02:2025 Security Misconfiguration: server xavfsizlik header'larini yubormasa yoki ular xavfsiz qiymatda bo'lmasa, bu sozlama xatosi sifatida sanaladi"
quiz:
  - q: "Foydalanuvchi `http://fleet.example` ni birinchi marta ochadi, server HTTPS'ga redirect qiladi va javobda `Strict-Transport-Security: max-age=31536000` beradi. Keyingi haftada u yana `http://fleet.example` ni yozsa nima bo'ladi?"
    options:
      - "Yana HTTP so'rov tarmoqqa chiqadi, keyin redirect keladi"
      - "Brauzer manzilni o'zi https:// ga almashtiradi va HTTP so'rov yuborilmaydi"
      - "Hech narsa: HSTS faqat sessiya davomida ishlaydi"
      - "Brauzer saytni bloklaydi"
    answer: 1
    explain: "HSTS xotirada qolgach, brauzer max-age davomida shu host uchun http:// ni ichki yangilaydi. Lekin eng birinchi tashrifda (HSTS hali ma'lum emas) so'rov HTTP orqali chiqadi: HSTS faqat keyingi tashriflarni himoya qiladi."
  - q: "Hujumchi ochiq Wi-Fi'da `http://fleet.example` so'rovini ushlab, javobga `Strict-Transport-Security: max-age=0` qo'shib qo'ydi. Brauzer nima qiladi?"
    options:
      - "HSTS xotirasini o'chiradi"
      - "Siyosatni 0 sekundga o'rnatadi va saytni ochmaydi"
      - "Qabul qilmaydi: HSTS header'i HTTP orqali kelganda e'tiborsiz qoldiriladi"
      - "Foydalanuvchiga ogohlantirish ko'rsatadi"
    answer: 2
    explain: "RFC 6797 va MDN: HSTS header'i faqat HTTPS orqali kelgandagina hisobga olinadi, HTTP orqali kelsa brauzer uni e'tiborsiz qoldiradi. Aks holda ochiq tarmoqdagi hujumchi siyosatni o'zgartira olardi. Shuning uchun max-age=0 HTTP orqali ta'sir qilmaydi."
  - q: "Foydalanuvchi yuklagan fayl `Content-Type: text/plain` bilan beriladi, lekin ichida `<script>...</script>` bor. `X-Content-Type-Options: nosniff` nima beradi?"
    options:
      - "Fayl HTML sifatida talqin qilinishining oldini oladi: brauzer e'lon qilingan turga amal qiladi"
      - "Faylni shifrlaydi"
      - "Faylni yuklashni bloklaydi"
      - "Skript bajarilishini CSP kabi cheklaydi"
    answer: 0
    explain: "nosniff brauzerga Content-Type'ga ishonish va tarkibdan boshqa tur taxmin qilmaslikni buyuradi. Bu fayl yuklash yo'li bilan XSS'ni qiyinlashtiradi. Boshqa variantlar nosniff vazifasi emas."
  - q: "`Referrer-Policy: no-referrer` ni qaysi holatda ehtiyotkorlik bilan qo'llash kerak?"
    options:
      - "Hech qachon: u xavfsizlikni pasaytiradi"
      - "URL'da sezgir parametr (token) bo'lgan sahifalarda o'rnatish shart emas"
      - "Tashqi saytlarga havola bo'lmasa kerak emas"
      - "Analitika yoki Referer'ga tayanadigan CSRF tekshiruvi bo'lsa, bu tekshiruv ishlamay qolishi mumkin"
    answer: 3
    explain: "no-referrer Referer header'ini umuman yubormaydi. Bu maxfiylikni oshiradi, lekin Referer'ga tayanadigan analitika yoki Origin/Referer asosidagi himoya (36-dars) buziladi. Sezgir qiymatni URL'dan olib tashlash esa alohida va undan yaxshiroq chora."
  - q: "`Permissions-Policy: camera=(), geolocation=(self)` nimani anglatadi?"
    options:
      - "Sahifa va uning iframe'lari kameradan foydalana olmaydi; geolokatsiya faqat shu origin'ga ruxsat"
      - "Kamera hamma uchun ruxsat, geolokatsiya taqiqlangan"
      - "Foydalanuvchidan ruxsat so'ralmaydi"
      - "Faqat iframe'larga ta'sir qiladi"
    answer: 0
    explain: "Bo'sh ro'yxat `()` funksiyani hamma uchun, jumladan o'z sahifa va iframe'lar uchun o'chiradi. `(self)` faqat shu origin'ga ruxsat beradi. Maqsad: kerak bo'lmagan imkoniyatni o'chirib, XSS yoki uchinchi tomon iframe'dan suiiste'mol qilishni cheklash."
  - q: "Ilova javobida `X-Powered-By: Express` va `Server: nginx/1.18.0` bor. Eng to'g'ri baho qaysi?"
    options:
      - "Jiddiy zaiflik: darhol tuzatish shart"
      - "Zaiflik emas, lekin hujumchiga texnologiya va versiyani oshkor qiladi; olib tashlash ma'lumot oqishini kamaytiradi, ammo asosiy himoya yangilashdir"
      - "Zararsiz: hujumchi baribir bilib oladi, shuning uchun ahamiyatsiz"
      - "Faqat HTTPS'da muammo"
    answer: 1
    explain: "Versiya oshkor bo'lishi o'z-o'zidan zaiflik emas, lekin hujumchining ishini osonlashtiradi. Header'ni olib tashlash arzon va foydali, ammo xavfsizlik patch'larni o'z vaqtida o'rnatishga tayanadi, yashirishga emas."
task:
  title: "Javob header'larini yig'ish"
  prompt: |
    `securityHeaders()` har javobga qo'shiladigan xavfsizlik header'larini qaytaradi. Hozir u bo'sh obyekt qaytaradi.

    Funksiyani tuzating. Quyidagilar bo'lsin:

    1. `Strict-Transport-Security`: `max-age=31536000; includeSubDomains`.
    2. `X-Content-Type-Options`: `nosniff`.
    3. `Referrer-Policy`: `strict-origin-when-cross-origin`.
    4. `Permissions-Policy`: `camera=(), microphone=(), geolocation=(self)`.
    5. `X-Powered-By` va `Server` header'lari bo'lmasin (funksiya `base` parametrida kelgan obyektdan ularni olib tashlab qaytarsin).
    6. Imzoni o'zgartirmang. Oxirgi `console.log` natijasi kutilgan: 4 ta header nomi va `Server`/`X-Powered-By` yo'qligi (`false`, `false`).
  lang: ts
  starter: |
    type H = Record<string, string>;

    // base: ilova yoki framework qo'ygan boshlang'ich header'lar
    function securityHeaders(base: H): H {
      return { ...base };
    }

    const out = securityHeaders({ "X-Powered-By": "Express", Server: "nginx/1.18.0", "Content-Type": "application/json" });
    console.log(Object.keys(out).sort().join(", "));
    console.log("X-Powered-By bor:", "X-Powered-By" in out);
    console.log("Server bor:", "Server" in out);
  solution: |
    type H = Record<string, string>;

    // base: ilova yoki framework qo'ygan boshlang'ich header'lar
    function securityHeaders(base: H): H {
      const out: H = { ...base };
      delete out["X-Powered-By"];
      delete out["Server"];
      return {
        ...out,
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
      };
    }

    const out = securityHeaders({ "X-Powered-By": "Express", Server: "nginx/1.18.0", "Content-Type": "application/json" });
    console.log(Object.keys(out).sort().join(", "));
    console.log("X-Powered-By bor:", "X-Powered-By" in out);
    console.log("Server bor:", "Server" in out);
  solutionNotes: |
    - `max-age=31536000` (bir yil) va `includeSubDomains` kursning tanlovi. `includeSubDomains` ni yoqishdan oldin barcha subdomenlar HTTPS'ni qo'llab-quvvatlashini tekshiring, aks holda ular ochilmay qoladi.
    - HSTS header'i faqat HTTPS javobda e'tiborga olinadi; HTTP javobga qo'yish foyda bermaydi.
    - `nosniff` fayl yuklash yo'li bilan XSS'ni qiyinlashtiradi, lekin to'g'ri Content-Type berishning o'rnini bosmaydi.
    - `Referrer-Policy` qiymati kelishuv: `no-referrer` maxfiyroq, lekin Referer'ga tayanadigan mantiqni buzishi mumkin.
    - Versiya ma'lumotini olib tashlash patch qilishning o'rnini bosmaydi.
    - Header'lar CSP, cookie atributlari va avtorizatsiyani almashtirmaydi (15, 13-darslar).
  checklist:
    - "Barcha to'rtta xavfsizlik header'i qo'yilgan"
    - "`X-Powered-By` va `Server` olib tashlangan"
    - "Boshqa header'lar (`Content-Type`) saqlanib qoladi"
    - "Imzo o'zgarmagan"
    - "`includeSubDomains` xavfini ayta olasiz"
---

## Muammo

Server javob yuborganda brauzer shunchaki ko'rsatmaydi: u javob header'larini o'qiydi va ularga qarab o'zini boshqaradi. Bir qancha xavfsizlik xususiyatlari faqat header orqali yoqiladi. Header yuborilmasa, brauzer standart (ko'pincha kamroq himoyalangan) xatti-harakatga qaytadi. Dasturchi bu header'larni qo'yishni unutadi, chunki ilova ularsiz ham "ishlaydi". Natijada ichki tekshiruvdan o'tgan ilova ham brauzer darajasidagi hujumlarga ochiq qoladi.

Uchta tipik og'riq. Birinchisi, foydalanuvchi manzilni `http://` bilan yoki sxemasiz yozadi, birinchi so'rov shifrlanmagan ketadi va ochiq tarmoqdagi hujumchi uni ushlab oladi (SSL stripping). Ikkinchisi, foydalanuvchi yuklagan fayl noto'g'ri tur bilan beriladi va brauzer uni boshqa tur deb talqin qiladi. Uchinchisi, URL manzilida sezgir qiymatlar (tiklash tokeni, mijoz identifikatori) `Referer` header'i orqali tashqi saytlarga sizib chiqadi. Bularning hammasi bir qatorlik header bilan kamaytiriladi, lekin har birining chegarasi bor va bu darsning asosiy mazmuni.

OWASP Top 10:2025 da security header'larning yo'qligi A02 Security Misconfiguration kategoriyasiga kiradi. Bu darsda to'rtta header'ni (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) va ortiqcha ma'lumot beruvchi header'larni ko'ramiz. CSP va `frame-ancestors` 15 va 37-darslarda, cross-origin izolyatsiya header'lari esa 17-darsda.

## Asosiy g'oya

### HSTS

HTTP Strict Transport Security (RFC 6797) serverga brauzerga shu host bilan faqat HTTPS orqali bog'lanishni buyurish imkonini beradi. Header: `Strict-Transport-Security: max-age=<sekund>; includeSubDomains`. Brauzer qiymatni xotirasiga yozadi va `max-age` davomida shu host uchun:

- `http://` manzillarni so'rov yuborishdan oldin o'zi `https://` ga yangilaydi.
- Sertifikat xatosini foydalanuvchi "baribir davom ettirish" bilan chetlab o'ta olmaydi (MDN: brauzer foydalanuvchiga xatoni chetlab o'tish yo'lini bermaydi).
- `includeSubDomains` bo'lsa, qoida barcha subdomenlarga ham tarqaladi.

MDN joriy qilish tartibini shunday beradi: server `http://` so'rovga doimiy redirect (masalan, 301) qaytaradi va bu redirect javobida HSTS header'i bo'lmasligi kerak, chunki header faqat HTTPS orqali yuborilishi shart. Brauzer redirectga ergashib HTTPS so'rov yuborgach, o'sha javobda `Strict-Transport-Security` bo'ladi va keyingi tashriflar redirectsiz to'g'ridan-to'g'ri HTTPS bo'ladi. Muhim cheklovlar (RFC 6797):

1. HSTS header'i faqat xavfsiz transport orqali kelganda hisobga olinadi. HTTP javobdagi header e'tiborsiz qoldiriladi, aks holda tarmoqdagi hujumchi siyosatni o'zgartira olardi.
2. Eng birinchi tashrifda brauzer hali HSTS'ni bilmaydi, shuning uchun birinchi so'rov shifrlanmagan ketishi mumkin. Brauzerlar bu bo'shliqni oldindan yuklangan (preload) ro'yxatlar bilan yopadi; preload RFC 6797 ning bir qismi emas, MDN uni nostandart deb belgilaydi: ro'yxatni Google yuritadi (hstspreload.org), kiritish uchun `max-age` kamida bir yil va `includeSubDomains` bo'lishi shart.
3. `max-age=0` xotirani o'chiradi: noto'g'ri sozlangan siyosatdan chiqish yo'li shu. MDN aniqlashtiradi: `max-age=0` bilan `includeSubDomains` ta'sirsiz, chunki faqat shu domen yozuvi o'chadi, har subdomenning o'z HSTS siyosati o'chmaydi. Lekin preload ro'yxatiga kiritilgan domendan chiqish ancha uzoq jarayon, shuning uchun preload'ga shoshilmang.

Quyidagi `run` bloki HSTS xotirasi va navigatsiya qarorini modellaydi.

```ts run
type H = Record<string, string>;

// HSTS xotirasi: host -> amal qilish tugash vaqti (sekund), subdomenlarni ham qamrab olish bayrog'i
type Hsts = Map<string, { until: number; sub: boolean }>;

function rememberHsts(store: Hsts, host: string, h: H, now: number): void {
  const v = h["strict-transport-security"];
  if (!v) return;
  const m = /max-age=(\d+)/i.exec(v);
  if (!m) return;
  const age = Number(m[1]);
  if (age === 0) store.delete(host);
  else store.set(host, { until: now + age, sub: /includeSubDomains/i.test(v) });
}

// Brauzer http:// manzilga o'tadi: tarmoqqa HTTP so'rov chiqadimi?
function navigate(store: Hsts, url: string, now: number): string {
  const u = new URL(url);
  if (u.protocol === "https:") return "https (shifrlangan)";
  for (const [h, e] of store) {
    const covers = u.hostname === h || (e.sub && u.hostname.endsWith("." + h));
    if (covers && e.until > now) return "https (brauzer o'zi yangiladi, HTTP so'rov chiqmadi)";
  }
  return "HTTP so'rov tarmoqqa chiqdi (tinglovchi ko'radi)";
}

// MIME sniffing modeli: nosniff yo'q bo'lsa, tana HTML'ga o'xshasa HTML deb olinishi mumkin
function effectiveType(contentType: string, body: string, nosniff: boolean): string {
  if (nosniff) return contentType;
  return /^\s*<(!doctype html|html|script)/i.test(body) ? "text/html" : contentType;
}

const store: Hsts = new Map();
const t0 = 1_000_000;

console.log("1) birinchi tashrif:", navigate(store, "http://fleet.example/login", t0));
rememberHsts(store, "fleet.example", { "strict-transport-security": "max-age=31536000; includeSubDomains" }, t0);
console.log("2) keyingi tashrif:", navigate(store, "http://fleet.example/login", t0 + 86_400));
console.log("3) subdomen:", navigate(store, "http://api.fleet.example/", t0 + 86_400));
console.log("4) muddat o'tgach:", navigate(store, "http://fleet.example/", t0 + 40_000_000));
```

```text
1) birinchi tashrif: HTTP so'rov tarmoqqa chiqdi (tinglovchi ko'radi)
2) keyingi tashrif: https (brauzer o'zi yangiladi, HTTP so'rov chiqmadi)
3) subdomen: https (brauzer o'zi yangiladi, HTTP so'rov chiqmadi)
4) muddat o'tgach: HTTP so'rov tarmoqqa chiqdi (tinglovchi ko'radi)
```

### X-Content-Type-Options

`X-Content-Type-Options: nosniff` brauzerga javobdagi `Content-Type` qiymatiga ishonishni va tarkibdan boshqa tur taxmin qilmaslikni buyuradi. Bu foydalanuvchi yuklagan kontent bo'lgan sahifalarda muhim: `text/plain` deb berilgan, lekin ichida HTML yoki skript bo'lgan fayl boshqa tur deb talqin qilinsa, XSS paydo bo'ladi. MDN nosniff ning ikki ta'sirini ajratadi. Birinchisi, so'rov maqsadi `script` yoki `style` bo'lsa, javob MIME turi kutilganga (JavaScript MIME turi yoki `text/css`) mos kelmasa brauzer javobni bloklaydi. Ikkinchisi, boshqa javob turlarida (HTML hujjatga navigatsiya ham) brauzer tarkibni tekshirib tur taxmin qilmaydi va e'lon qilingan `Content-Type` ni o'zgartirmasdan ishlatadi: `text/plain` bilan berilgan fayl ichida HTML belgilari bo'lsa ham HTML sifatida talqin qilinmaydi. Amaliy xulosa: `nosniff` yoqilgach, JavaScript fayllaringiz to'g'ri `Content-Type` bilan berilishi shart, aks holda skript yuklanmaydi; shuning uchun uni joriy qilishdan oldin statik fayllarning turlarini tekshiring. Shu bilan birga to'g'ri `Content-Type` berish asosiy chora, nosniff uni almashtirmaydi (fayl yuklash, 74-dars).

### Referrer-Policy

Brauzer sahifadan boshqa sahifaga o'tganda yoki resurs yuklaganda `Referer` header'ida manba URL'ni yuboradi. `Referrer-Policy` qancha ma'lumot yuborilishini belgilaydi. Asosiy qiymatlar: `no-referrer` (yubormaydi), `same-origin` (faqat shu origin ichida), `strict-origin` (faqat origin, HTTPS'dan HTTP'ga yubormaydi), `strict-origin-when-cross-origin` (shu origin ichida to'liq URL, cross-origin'ga faqat origin, HTTPS'dan HTTP'ga umuman yubormaydi). MDN bo'yicha qiymat berilmasa yoki noto'g'ri bo'lsa standart `strict-origin-when-cross-origin` (2020-yil noyabr spetsifikatsiya o'zgarishidan oldin `no-referrer-when-downgrade` edi). Uni aniq yozib qo'yish xatti-harakatni brauzer versiyasidan mustaqil qiladi. MDN yana bir imkoniyatni ko'rsatadi: header'ga vergul bilan bir nechta qiymat berish mumkin (`no-referrer, strict-origin-when-cross-origin`), brauzer eng oxirgi tushunadigan qiymatni oladi; shunday qilib yangi qiymatni eskisiga fallback bilan birga yozasiz.

Referer sizib chiqishi URL'da nima borligiga bog'liq: tiklash tokeni, qidiruv so'zi, tenant identifikatori. Asosiy chora sezgir qiymatni URL'ga qo'ymaslik (50-dars); `Referrer-Policy` ikkinchi qatlam.

### Permissions-Policy

`Permissions-Policy` brauzer imkoniyatlarini (kamera, mikrofon, geolokatsiya va boshqalar) sahifa va uning iframe'lari uchun yoqadi yoki o'chiradi. Sintaksis: `camera=(), geolocation=(self)`: bo'sh ro'yxat hamma uchun taqiqlaydi, `(self)` faqat shu origin'ga ruxsat beradi. Maqsad: ilova ishlatmaydigan imkoniyatni o'chirib, XSS yoki uchinchi tomon iframe'dan suiiste'mol qilishni cheklash. MDN bu header sahifasini hozircha eksperimental deb belgilaydi, shuning uchun qaysi imkoniyat nomlari qo'llab-quvvatlanishi brauzerga bog'liq va ro'yxat o'zgarib turadi. Sintaksis qoidalari: bir nechta imkoniyat vergul bilan ajratiladi; `*` va `()` faqat yolg'iz yoziladi, `self` esa aniq origin'lar bilan birga bo'lishi mumkin; iframe uchun ekvivalenti `allow` atributi (`()` uchun `'none'`). Header o'z hujjati va ichki iframe'lar uchun siyosatni belgilaydi, iframe'ni joylashtiruvchi sahifa esa `allow` atributi bilan faqat header ruxsat bergan imkoniyatni o'z iframe'iga uzata oladi. Buzilishlarni Reporting API orqali (`report-to`) yig'ish mumkin.

## Chuqurroq: ma'lumot oshkor qilish va mexanizmlar

### Versiya header'lari

`X-Powered-By: Express` (Express standart holatda yuboradi) va `Server: nginx/1.18.0` kabi qiymatlar texnologiya va versiyani oshkor qiladi. Bu o'zi zaiflik emas, lekin hujumchi skanerlash vaqtini qisqartiradi. Olib tashlash arzon (Express'da `app.disable("x-powered-by")`, Helmet buni o'zi qiladi), lekin xavfsizlik yashirishga emas, patch'larga tayanadi.

### MIME sniffing modeli

Quyidagi blok sniffing mexanizmini juda sodda modelda ko'rsatadi: nosniff yo'q bo'lsa, tarkib HTML'ga o'xshaganda tur o'zgaradi. Haqiqiy brauzer algoritmi murakkabroq va resurs turiga bog'liq (bu model uni to'liq aks ettirmaydi).

```ts run
type H = Record<string, string>;

// HSTS xotirasi: host -> amal qilish tugash vaqti (sekund), subdomenlarni ham qamrab olish bayrog'i
type Hsts = Map<string, { until: number; sub: boolean }>;

function rememberHsts(store: Hsts, host: string, h: H, now: number): void {
  const v = h["strict-transport-security"];
  if (!v) return;
  const m = /max-age=(\d+)/i.exec(v);
  if (!m) return;
  const age = Number(m[1]);
  if (age === 0) store.delete(host);
  else store.set(host, { until: now + age, sub: /includeSubDomains/i.test(v) });
}

// Brauzer http:// manzilga o'tadi: tarmoqqa HTTP so'rov chiqadimi?
function navigate(store: Hsts, url: string, now: number): string {
  const u = new URL(url);
  if (u.protocol === "https:") return "https (shifrlangan)";
  for (const [h, e] of store) {
    const covers = u.hostname === h || (e.sub && u.hostname.endsWith("." + h));
    if (covers && e.until > now) return "https (brauzer o'zi yangiladi, HTTP so'rov chiqmadi)";
  }
  return "HTTP so'rov tarmoqqa chiqdi (tinglovchi ko'radi)";
}

// MIME sniffing modeli: nosniff yo'q bo'lsa, tana HTML'ga o'xshasa HTML deb olinishi mumkin
function effectiveType(contentType: string, body: string, nosniff: boolean): string {
  if (nosniff) return contentType;
  return /^\s*<(!doctype html|html|script)/i.test(body) ? "text/html" : contentType;
}

const body = "<script>alert(1)</script>";
console.log("nosniff yo'q:", effectiveType("text/plain", body, false));
console.log("nosniff bor:", effectiveType("text/plain", body, true));
console.log("oddiy matn:", effectiveType("text/plain", "salom", false));
```

```text
nosniff yo'q: text/html
nosniff bor: text/plain
oddiy matn: text/plain
```

### Header'lar to'plami va audit

Header'larni qo'lda tekshirish xatoga moyil, shuning uchun ularni avtomatik tekshirish foydali. Quyidagi audit funksiyasi kerakli header'lar yo'qligini va ortiqcha ma'lumot beruvchilarni topadi. Bu minimal tekshiruv, to'liq skaner emas; chegaralar (masalan, 1 yillik `max-age`) kursning tanlovi.

```ts run
type H = Record<string, string>;

function audit(h: H): string[] {
  const low = Object.fromEntries(Object.entries(h).map(([k, v]) => [k.toLowerCase(), v]));
  const out: string[] = [];
  const hsts = low["strict-transport-security"];
  if (!hsts) out.push("HSTS yo'q");
  else if (Number(/max-age=(\d+)/.exec(hsts)?.[1] ?? 0) < 31536000) out.push("HSTS max-age bir yildan kam");
  if (low["x-content-type-options"]?.toLowerCase() !== "nosniff") out.push("nosniff yo'q");
  if (!low["referrer-policy"]) out.push("Referrer-Policy yo'q");
  if (low["x-powered-by"]) out.push("X-Powered-By oshkor");
  if (/\d/.test(low["server"] ?? "")) out.push("Server versiyani oshkor qiladi");
  return out;
}

console.log(audit({ "X-Powered-By": "Express", Server: "nginx/1.18.0" }));
console.log(audit({
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
}));
```

```text
[
  "HSTS yo'q",
  "nosniff yo'q",
  "Referrer-Policy yo'q",
  'X-Powered-By oshkor',
  'Server versiyani oshkor qiladi'
]
[]
```

## Misol: HTTP'ga tushirish va sniffing

Quyidagi misol HSTS va nosniff mexanizmini yuqoridagi modelda ko'rsatadi. Hujum faqat shu o'quv modeliga qarshi.

### 1. Zaif kod

Server header'larni umuman qo'ymaydi:

```ts run
type H = Record<string, string>;

// HSTS xotirasi: host -> amal qilish tugash vaqti (sekund), subdomenlarni ham qamrab olish bayrog'i
type Hsts = Map<string, { until: number; sub: boolean }>;

function rememberHsts(store: Hsts, host: string, h: H, now: number): void {
  const v = h["strict-transport-security"];
  if (!v) return;
  const m = /max-age=(\d+)/i.exec(v);
  if (!m) return;
  const age = Number(m[1]);
  if (age === 0) store.delete(host);
  else store.set(host, { until: now + age, sub: /includeSubDomains/i.test(v) });
}

// Brauzer http:// manzilga o'tadi: tarmoqqa HTTP so'rov chiqadimi?
function navigate(store: Hsts, url: string, now: number): string {
  const u = new URL(url);
  if (u.protocol === "https:") return "https (shifrlangan)";
  for (const [h, e] of store) {
    const covers = u.hostname === h || (e.sub && u.hostname.endsWith("." + h));
    if (covers && e.until > now) return "https (brauzer o'zi yangiladi, HTTP so'rov chiqmadi)";
  }
  return "HTTP so'rov tarmoqqa chiqdi (tinglovchi ko'radi)";
}

// MIME sniffing modeli: nosniff yo'q bo'lsa, tana HTML'ga o'xshasa HTML deb olinishi mumkin
function effectiveType(contentType: string, body: string, nosniff: boolean): string {
  if (nosniff) return contentType;
  return /^\s*<(!doctype html|html|script)/i.test(body) ? "text/html" : contentType;
}

// ZAIF: HSTS ham, nosniff ham yo'q
const headers: H = { "content-type": "text/plain" };
const store: Hsts = new Map();
rememberHsts(store, "fleet.example", headers, 0);

console.log("foydalanuvchi http:// ochadi:", navigate(store, "http://fleet.example/login", 100));
console.log("yuklangan fayl turi:", effectiveType("text/plain", "<script>alert(1)</script>", false));
```

```text
foydalanuvchi http:// ochadi: HTTP so'rov tarmoqqa chiqdi (tinglovchi ko'radi)
yuklangan fayl turi: text/html
```

### 2. Hujum

Ochiq Wi-Fi'da tinglovchi `http://` so'rovni ko'radi va redirectni o'zgartirib, foydalanuvchini soxta sahifaga olib borishi mumkin (SSL stripping). Ikkinchi qatorda foydalanuvchi yuklagan "matn fayli" brauzerda HTML sifatida talqin qilinadi: ichidagi skript sahifa kontekstida ishlaydi. Natija (1-qismdagi kodning chiqishi):

```text
foydalanuvchi http:// ochadi: HTTP so'rov tarmoqqa chiqdi (tinglovchi ko'radi)
yuklangan fayl turi: text/html
```

Birinchi qator tarmoqqa HTTP so'rov chiqqanini, ikkinchisi turning `text/html` ga o'zgarganini ko'rsatadi.

### 3. Tuzatilgan kod

```ts run
type H = Record<string, string>;

// HSTS xotirasi: host -> amal qilish tugash vaqti (sekund), subdomenlarni ham qamrab olish bayrog'i
type Hsts = Map<string, { until: number; sub: boolean }>;

function rememberHsts(store: Hsts, host: string, h: H, now: number): void {
  const v = h["strict-transport-security"];
  if (!v) return;
  const m = /max-age=(\d+)/i.exec(v);
  if (!m) return;
  const age = Number(m[1]);
  if (age === 0) store.delete(host);
  else store.set(host, { until: now + age, sub: /includeSubDomains/i.test(v) });
}

// Brauzer http:// manzilga o'tadi: tarmoqqa HTTP so'rov chiqadimi?
function navigate(store: Hsts, url: string, now: number): string {
  const u = new URL(url);
  if (u.protocol === "https:") return "https (shifrlangan)";
  for (const [h, e] of store) {
    const covers = u.hostname === h || (e.sub && u.hostname.endsWith("." + h));
    if (covers && e.until > now) return "https (brauzer o'zi yangiladi, HTTP so'rov chiqmadi)";
  }
  return "HTTP so'rov tarmoqqa chiqdi (tinglovchi ko'radi)";
}

// MIME sniffing modeli: nosniff yo'q bo'lsa, tana HTML'ga o'xshasa HTML deb olinishi mumkin
function effectiveType(contentType: string, body: string, nosniff: boolean): string {
  if (nosniff) return contentType;
  return /^\s*<(!doctype html|html|script)/i.test(body) ? "text/html" : contentType;
}

const headers: H = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "content-type": "text/plain",
};
const store: Hsts = new Map();
rememberHsts(store, "fleet.example", headers, 0); // HTTPS javobdan olingan deb hisoblaymiz

console.log("foydalanuvchi http:// ochadi:", navigate(store, "http://fleet.example/login", 100));
console.log("yuklangan fayl turi:", effectiveType("text/plain", "<script>alert(1)</script>", headers["x-content-type-options"] === "nosniff"));
```

```text
foydalanuvchi http:// ochadi: https (brauzer o'zi yangiladi, HTTP so'rov chiqmadi)
yuklangan fayl turi: text/plain
```

Tuzatish nima uchun yetarli. HSTS bilan brauzer `http://` ni tarmoqqa chiqarmasdan oldin yangilaydi, shuning uchun o'rtadagi hujumchi birinchi HTTP so'rovni ko'rmaydi. `nosniff` bilan e'lon qilingan tur o'zgarmaydi, skript sifatida bajarilmaydi. Ko'rsatilgan ikki hujum yopildi.

Yopilmagani. Eng birinchi tashrifda HSTS hali xotirada yo'q: birinchi so'rov HTTP orqali chiqishi mumkin (preload ro'yxati buni yopadi, lekin uning shartlarini alohida o'rganish kerak). `includeSubDomains` bo'lsa, barcha subdomen HTTPS qo'llab-quvvatlashi shart. `nosniff` to'g'ri `Content-Type` va fayl yuklashdagi boshqa tekshiruvlarni almashtirmaydi. Hech bir header serverdagi zaiflikni tuzatmaydi.

## Qachon qo'llamaslik kerak

- `includeSubDomains` va uzoq `max-age` HTTPS'ni qo'llamaydigan eski ichki subdomenlari bor kompaniyada xavfli: ular ochilmay qoladi. Avval qisqa `max-age` (masalan, 5 daqiqa) bilan sinab, keyin oshiring.
- Preload bir tomonlama yo'nalishga o'xshaydi: ro'yxatdan chiqish oylar oladi. Barcha subdomenlarga ishonch hosil qilmay turib unga shoshilmang.
- `Referrer-Policy: no-referrer` Referer'ga tayanadigan analitika, affiliate hisoblash va ba'zi CSRF tekshiruvlarini buzadi. Bu kelishuv: maxfiylik yoki funksional.
- `Permissions-Policy` ni ko'p imkoniyat bilan to'ldirish qo'llab-quvvatlanmaydigan nomlarda jim xato beradi; ro'yxatni MDN bilan solishtiring va sinab ko'ring.
- Header'lar faqat javobni oladigan brauzerga ta'sir qiladi. API mijozi (mobil ilova, server) ularni e'tiborsiz qoldiradi. Ular API'ni emas, brauzerdagi foydalanuvchini himoya qiladi.
- Header'larni nginx va ilova ikkalasida qo'yish dublikatga olib keladi (ba'zi header'lar ikki marta, qarama-qarshi qiymat bilan keladi). Bitta joyni tanlang.

## Stack'da: Helmet, NestJS va Next.js

Helmet (Express va Fastify uchun `@fastify/helmet`) bir nechta xavfsizlik header'ini birdan o'rnatadigan middleware. NestJS hujjatiga ko'ra NestJS v12.1 dan boshlab `app.useSecurityHeaders()` Helmet 8 bilan bir xil standart qiymatlarni qo'shimcha paketsiz o'rnatadi (Express va Fastify'da bir xil), `X-Powered-By` ni olib tashlaydi. Hujjatdagi standart jadvalda `Referrer-Policy: no-referrer`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff` va `X-XSS-Protection: 0` bor (oxirgisi eski brauzerlarning XSS auditorini o'chiradi, hujjat uni o'zi zaiflik manbai bo'lgan deb izohlaydi). Standart CSP qat'iy emas (`script-src 'self'`, lekin `style-src` da `'unsafe-inline'` bor), shuning uchun uni 15-darsdagi siyosat bilan almashtiring; hujjatdagi `contentSecurityPolicy.reportOnly` opsiyasi Report-Only bosqichi uchun. Direktiva qiymatlari faqat satr, ro'yxat, boolean yoki `null` bo'lishi mumkin va `;`, `,` belgilari rad etiladi, ya'ni qiymat orqali yangi direktiva qo'shib bo'lmaydi. Hujjat yana ikki amaliy ogohlantirish beradi: `useSecurityHeaders()` ni `NestFactory.create()` dan so'ng darhol chaqiring (undan oldin `app.use()` bilan ro'yxatdan o'tgan middleware o'z javoblarini header'siz yuborishi mumkin), va Fastify'da `reply.removeHeader()` bu metod qo'ygan header'ni o'chira olmaydi. Eski NestJS versiyalarida `helmet` paketini `app.use(helmet())` bilan ulaysiz. Quyidagi kod ishga tushirilmaydi (kutubxona kerak), sintaksis tekshirilgan.

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // NestJS v12.1+ (hujjatdagi opsiyalar nomlari bilan)
  app.useSecurityHeaders({
    strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    // CSP ni 15-darsdagi nonce'li siyosat bilan alohida sozlang
  });
  await app.listen(3000);
}
bootstrap();
```

Next.js'da shu header'lar `next.config` dagi `headers()` funksiyasi orqali beriladi (yoki middleware orqali). `Permissions-Policy` NestJS hujjatidagi standart jadvalda yo'q, shuning uchun uni qo'lda qo'shing. Eng muhimi: kodga ishonmasdan, tayyor stack'dan `curl -I` bilan haqiqiy javobni tekshiring va natijani CI'ga test sifatida qo'shing.

## Xulosa

- Xavfsizlik header'lari brauzerga qo'shimcha qoidalarni yoqadi; ular yo'q bo'lsa brauzer kamroq himoyalangan standartga qaytadi.
- HSTS keyingi tashriflarda `http://` ni brauzerning o'zi yangilashini ta'minlaydi, lekin faqat HTTPS javobda hisobga olinadi va birinchi tashrifni (preload'siz) himoya qilmaydi.
- `nosniff` e'lon qilingan `Content-Type` ga amal qilishni buyuradi va yuklangan kontent orqali XSS ni qiyinlashtiradi; to'g'ri `Content-Type` berishning o'rnini bosmaydi.
- `Referrer-Policy` URL sizib chiqishini cheklaydi, lekin sezgir qiymatni URL'ga qo'ymaslik undan yaxshiroq. `Permissions-Policy` ishlatilmaydigan imkoniyatni o'chiradi.
- `includeSubDomains` va preload kuchli, lekin qaytarib bo'lmaydigan oqibatlarga olib kelishi mumkin; qisqa `max-age` bilan boshlang.
- Header'larni bitta joyda qo'ying va `curl -I` yoki test bilan tekshiring; ular server zaifliklarini tuzatmaydi.
