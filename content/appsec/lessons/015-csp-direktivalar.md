---
n: 15
slug: csp-direktivalar
title: "Content Security Policy: direktivalar, nonce va strict-dynamic"
summary: "CSP qanday ishlaydi, asosiy direktivalar (script-src, object-src, base-uri, frame-ancestors, form-action), host ro'yxatining zaifligi, nonce va strict-dynamic bilan qat'iy siyosat, Report-Only rejimi va CSP ning chegaralari."
duration: 45
sources:
  - id: csp3
    note: "Content Security Policy Level 3: direktivalar, source expression'lar, nonce, hash va 'strict-dynamic' semantikasi"
  - id: mdn-csp
    note: "MDN CSP qo'llanmasi: direktivalar ro'yxati, Report-Only va meta teg cheklovlari"
  - id: cs-csp
    note: "OWASP CSP Cheat Sheet: nonce va strict-dynamic asosidagi qat'iy siyosat tavsiyasi, Report-Only orqali joriy qilish"
quiz:
  - q: "Siyosat: `script-src 'self' 'unsafe-inline'`. Sahifaga XSS orqali `<script>alert(1)</script>` kiritildi. Natija?"
    options:
      - "Brauzer bloklaydi, chunki skript 'self' emas"
      - "Skript bajariladi: 'unsafe-inline' inline skriptga ruxsat beradi"
      - "Faqat nonce bo'lsa bajariladi"
      - "Brauzer ogohlantiradi, lekin bajaradi"
    answer: 1
    explain: "'unsafe-inline' har qanday inline skriptga ruxsat beradi, shu jumladan hujumchi kiritganiga. Bu siyosat XSS'dan deyarli himoya qilmaydi. Nonce yoki hash qo'yilganda CSP3 brauzerlari 'unsafe-inline' ni e'tiborsiz qoldiradi."
  - q: "Nonce asosidagi CSP'da nonce qanday bo'lishi kerak?"
    options:
      - "Har deploy'da bir marta yaratilgan doimiy qiymat"
      - "Foydalanuvchi ID'sining hash'i"
      - "Har javob (response) uchun yangi, tasodifiy va oldindan bilib bo'lmaydigan qiymat"
      - "Sayt nomi, hamma sahifada bir xil"
    answer: 2
    explain: "Nonce har javobda yangilanadi va CSPRNG bilan yaratiladi. Doimiy yoki taxmin qilinadigan nonce bo'lsa, hujumchi uni o'z inline skriptiga qo'yadi va siyosat ma'nosini yo'qotadi. Boshqa variantlar taxmin qilinadigan qiymatlar."
  - q: "`script-src https://cdn.example.com` ro'yxatida CDN umumiy kutubxonalarni (masalan, eski Angular) xizmat qiladi. Nima uchun bu xavfli bo'lishi mumkin?"
    options:
      - "CDN domeni HTTPS emas"
      - "CSP host ro'yxatini umuman qo'llamaydi"
      - "Nonce ishlamay qoladi"
      - "Hujumchi ruxsat etilgan hostdagi zaif yoki ixtiyoriy kod bajaruvchi skriptdan (masalan, JSONP yoki shablon kutubxonasi) foydalanib siyosatni aylanib o'tadi"
    answer: 3
    explain: "Host ro'yxati faqat 'qaysi manzildan' degan savolga javob beradi, 'qaysi kod' ga emas. Ruxsat etilgan hostdagi har skript sizning sahifangizda ishlaydi, shu jumladan hujumchi uchun foydali bo'lgani. Shu sababli OWASP va CSP3 nonce/hash va strict-dynamic ni afzal ko'radi."
  - q: "`'strict-dynamic'` bilan nonce'li skript boshqa skriptni dinamik yuklaydi (`document.createElement('script')`). CSP3 brauzerida natija?"
    options:
      - "Dinamik skript yuklanadi: ishonchli skript yaratgan skript ishonchli, host ro'yxati esa e'tiborsiz"
      - "Bloklanadi: dinamik skriptda ham nonce kerak"
      - "Faqat 'self' hostdan yuklanadi"
      - "Brauzer 'strict-dynamic' ni qo'llab-quvvatlamaydi"
    answer: 0
    explain: "strict-dynamic ishonchni nonce'li skriptdan u yaratgan skriptlarga o'tkazadi, host ro'yxati va 'self' esa e'tiborsiz qoldiriladi. Bu ko'p bo'lak ilovalar (bundler, lazy-load) uchun qulay. Eski brauzerlar uchun fallback qo'shiladi."
  - q: "Yangi CSP'ni production'da joriy qilish uchun eng xavfsiz birinchi qadam qaysi?"
    options:
      - "Darhol `Content-Security-Policy` ni majburiy rejimda yoqish"
      - "`Content-Security-Policy-Report-Only` bilan yuborib, buzilishlar hisobotini yig'ish"
      - "Faqat `<meta>` tegida e'lon qilish"
      - "`default-src *` bilan boshlash"
    answer: 1
    explain: "Report-Only siyosatni bloklamasdan baholaydi va buzilishlarni hisobot qiladi. Majburiy rejim noma'lum inline skriptlar tufayli ilovani sindirishi mumkin. `default-src *` deyarli cheklov bermaydi."
  - q: "Nonce'li CSP bor, lekin sahifa kodida `element.innerHTML = userInput` bor va ilova boshqa joyda `eval` ni ishlatmaydi. Qaysi gap to'g'ri?"
    options:
      - "CSP DOM XSS'ni to'liq bartaraf etadi"
      - "CSP faqat server tomonni himoya qiladi"
      - "Inline event handler va nonce'siz `<script>` bloklanadi, lekin boshqa vektorlar (masalan, ma'lumot o'zgartirish, sahifani buzish) qolishi mumkin; CSP chuqur himoya qatlami, XSS tuzatishning o'rni emas"
      - "innerHTML CSP bilan ishlamaydi"
    answer: 2
    explain: "CSP skript bajarilishini cheklaydi, lekin HTML kiritish, formani qayta yo'naltirish (form-action cheklanmasa), tarkibni o'zgartirish kabi zararlar qoladi. Birlamchi himoya output encoding va xavfsiz API (31-34-darslar), CSP esa ikkinchi qatlam."
task:
  title: "Qat'iy CSP siyosatini yig'ish"
  prompt: |
    `buildCsp(nonce)` response header qiymatini qaytaradi. Hozir u `'unsafe-inline'` va keng hostga tayanadi.

    Funksiyani tuzating. Siyosat quyidagilarni o'z ichiga olsin:

    1. `script-src 'nonce-<nonce>' 'strict-dynamic'` (`'unsafe-inline'` va host ro'yxati yo'q).
    2. `object-src 'none'`.
    3. `base-uri 'none'`.
    4. `frame-ancestors 'none'`.
    5. `nonce` faqat `[A-Za-z0-9+/=]{16,}` ga mos bo'lsa qabul qilinadi, aks holda `Error` tashlansin (header injection oldini olish).
    6. Imzoni o'zgartirmang. Oxirgi `console.log` natijalari: `true`, `true`, `true`, `true`, `false`, `xato`.
  lang: ts
  starter: |
    // ZAIF: unsafe-inline va keng host
    function buildCsp(nonce: string): string {
      return "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com";
    }

    const csp = buildCsp("r4nd0mR4nd0mAbCd==");
    console.log(csp.includes("script-src 'nonce-r4nd0mR4nd0mAbCd==' 'strict-dynamic'"));
    console.log(csp.includes("object-src 'none'"));
    console.log(csp.includes("base-uri 'none'"));
    console.log(csp.includes("frame-ancestors 'none'"));
    console.log(csp.includes("unsafe-inline"));
    try { buildCsp("x'; script-src *"); console.log("qabul qilindi"); } catch { console.log("xato"); }
  solution: |
    const NONCE_RE = /^[A-Za-z0-9+/=]{16,}$/;

    function buildCsp(nonce: string): string {
      if (!NONCE_RE.test(nonce)) throw new Error("noto'g'ri nonce");
      return [
        `script-src 'nonce-${nonce}' 'strict-dynamic'`,
        "object-src 'none'",
        "base-uri 'none'",
        "frame-ancestors 'none'",
      ].join("; ");
    }

    const csp = buildCsp("r4nd0mR4nd0mAbCd==");
    console.log(csp.includes("script-src 'nonce-r4nd0mR4nd0mAbCd==' 'strict-dynamic'"));
    console.log(csp.includes("object-src 'none'"));
    console.log(csp.includes("base-uri 'none'"));
    console.log(csp.includes("frame-ancestors 'none'"));
    console.log(csp.includes("unsafe-inline"));
    try { buildCsp("x'; script-src *"); console.log("qabul qilindi"); } catch { console.log("xato"); }
  solutionNotes: |
    - `'strict-dynamic'` bilan host ro'yxati keraksiz: CSP3 brauzerlari uni baribir e'tiborsiz qoldiradi.
    - `object-src 'none'` va `base-uri 'none'`: plagin orqali kod va `<base>` bilan nisbiy URL'larni boshqa hostga burish yo'llari yopiladi.
    - `frame-ancestors 'none'` sahifani boshqa saytga joylashtirishni taqiqlaydi (37-dars).
    - Nonce qiymatini validatsiya qilish header'ga `;` yoki qo'shtirnoq kirishini to'sadi. Nonce'ning o'zi har javobda CSPRNG bilan yaratiladi (67-dars).
    - Bu siyosat XSS tuzatishning o'rnini bosmaydi va nonce'siz eski brauzerlar uchun alohida fallback talab qilishi mumkin.
  checklist:
    - "`script-src` nonce va strict-dynamic bilan, unsafe-inline yo'q"
    - "`object-src`, `base-uri`, `frame-ancestors` 'none'"
    - "Yaroqsiz nonce xato tashlaydi"
    - "Imzo o'zgarmagan"
    - "CSP XSS'ni tuzatmasligini ayta olasiz"
---

## Muammo

Saytda XSS bo'lsa, hujumchi kiritgan skript sahifa kontekstida ishlaydi: cookie'ga (HttpOnly bo'lmasa), DOM'ga, foydalanuvchi nomidan so'rov yuborishga to'liq ega. Output encoding va xavfsiz API (31-34-darslar) asosiy himoya, lekin 100 ming qatorlik kodda bitta joy unutilishi mumkin. Content Security Policy (CSP) shu holat uchun chuqur himoya qatlami: brauzerga qaysi skriptlar bajarilishi mumkinligini oldindan aytib qo'yasiz, shunda kiritilgan skript ruxsat ro'yxatidan o'tmasa bajarilmaydi.

Muammo shundaki, CSP'ning ko'p joriy qilingan versiyalari aslida himoya bermaydi. Eng keng tarqalgan xato: `script-src 'self' 'unsafe-inline' https://cdn.example.com`. Bunday siyosat tashqi tomondan "CSP bor" ko'rinadi, auditor tekshiruvdan o'tadi, lekin `'unsafe-inline'` har qanday inline skriptga ruxsat beradi, host ro'yxati esa ruxsat berilgan hostdagi har skriptga. Hujumchi uchun siyosat mavjud emasdek.

Bu dars CSP mexanizmini va qat'iy siyosat shaklini beradi: nonce, hash va `'strict-dynamic'`. Next.js'da joriy qilish (35-dars) va uning clickjacking bilan aloqasi (`frame-ancestors`, 37-dars) alohida. Bu yerda siyosatning o'zi nima ekanini va nima uchun host ro'yxati o'rniga nonce afzal ekanini ko'ramiz.

## Asosiy g'oya

### Siyosat nima

CSP `Content-Security-Policy` HTTP header'i orqali (yoki cheklangan holda `<meta>` orqali) beriladi. U direktivalar ro'yxati: `nom qiymat1 qiymat2; nom2 ...`. Har direktiva ma'lum turdagi resurs uchun qayerdan yuklash mumkinligini belgilaydi. Asosiylari (CSP3 va MDN):

| Direktiva | Nimani boshqaradi |
|---|---|
| `default-src` | Boshqa fetch direktivalari berilmaganda standart |
| `script-src` | JavaScript: tashqi fayl, inline, `eval` |
| `style-src`, `img-src`, `font-src`, `media-src` | Tegishli resurs turlari |
| `connect-src` | `fetch`, XHR, WebSocket manzillari |
| `object-src` | `<object>`, `<embed>` (plaginlar) |
| `base-uri` | `<base>` elementi qiymati |
| `form-action` | Forma yuboriladigan manzillar |
| `frame-ancestors` | Sahifani kim iframe'ga joylashtira oladi |
| `frame-src` | Sahifaga joylashtiriladigan iframe manbalari |
| `report-to`, `report-uri` | Buzilish hisobotlari qayerga yuboriladi |

Qiymatlar: `'self'` (shu origin), `'none'`, host yoki sxema (`https:`), `'unsafe-inline'`, `'unsafe-eval'`, `'nonce-...'`, `'sha256-...'`, `'strict-dynamic'`. Maxsus qiymatlar qo'shtirnoq bilan yoziladi.

### Nega host ro'yxati yetmaydi

Host ro'yxati "skript qayerdan kelishi mumkin" deb javob beradi. XSS hujumchisi esa ko'pincha skriptni o'zi kiritadi (inline) yoki ruxsat berilgan hostdagi kodni ishlatadi. Ikkala holat ham host ro'yxatidan o'tadi:

- Inline skriptni to'sish uchun `'unsafe-inline'` ni olib tashlash kerak. Ko'p ilova uni inline skriptlarga tayanib qo'yadi, natijada saqlanib qoladi va siyosat ma'nosiz.
- Ruxsat berilgan hostda JSONP endpoint yoki bajariladigan shablon kutubxonasi bo'lsa, hujumchi uni sahifangiz kontekstida chaqiradi. Ommaviy CDN'lar hostida bunday skriptlar ko'p. OWASP CSP Cheat Sheet va CSP3 allowlist yondashuvining shu zaifligi sababli nonce yoki hash asosidagi siyosatni tavsiya etadi.

### Nonce va hash

**Nonce**: server har javobda tasodifiy qiymat yaratadi, header'ga `'nonce-<qiymat>'` qo'yadi va o'zi yozgan har `<script>` ga `nonce="<qiymat>"` atributini qo'shadi. Brauzer faqat nonce mos kelgan skriptni bajaradi. Hujumchi nonce'ni oldindan bilmaydi (u har javobda yangi), shuning uchun kiritgan `<script>` nonce'siz qoladi va bloklanadi. Shart: nonce CSPRNG bilan yaratilishi, har javobda yangi bo'lishi va taxmin qilinmasligi kerak (67-dars). Doimiy nonce yoki javobda ko'rinadigan taxmin qilinadigan nonce siyosatni yo'q qiladi. Cheat Sheet yana ogohlantiradi: barcha `<script>` teglariga nonce qo'shadigan middleware yozmang, chunki hujumchi kiritgan skript ham nonce oladi; nonce haqiqiy shablon mexanizmi orqali qo'shiladi.

**Hash**: header'ga skript matnining `'sha256-<base64>'` qiymati qo'yiladi; brauzer matn mos kelgan inline skriptni bajaradi. Statik, o'zgarmas inline skriptlar uchun qulay; matn o'zgarsa hash qayta hisoblanadi.

CSP3 bo'yicha nonce yoki hash berilsa, brauzerlar `'unsafe-inline'` ni e'tiborsiz qoldiradi. Shuning uchun nonce'li siyosatga eski brauzerlar uchun `'unsafe-inline'` fallback qo'shish mumkin: yangi brauzer uni e'tiborsiz qoldiradi, eski brauzer esa (nonce'ni bilmagan) fallbackdan foydalanadi. Bu fallbackning kamchiligi: eski brauzerda himoya yo'q.

### strict-dynamic

Zamonaviy ilova skriptni boshqa skriptdan yuklaydi (bundler, lazy-load, analitika). Har yuklanadigan manzil uchun nonce yozib bo'lmaydi. `'strict-dynamic'` ishonchni zanjir bo'yicha uzatadi: nonce'li (yoki hash'li) skript yaratgan skriptlar ham ishonchli. Shu bilan birga host ro'yxati va `'self'` e'tiborsiz qoldiriladi. Natijada bitta qisqa siyosat yetarli:

```
script-src 'nonce-R4nd0m...' 'strict-dynamic'; object-src 'none'; base-uri 'none'
```

OWASP CSP Cheat Sheet qat'iy (Strict) CSP'ni nonce yoki hash va ixtiyoriy `strict-dynamic` bilan tuzishni, hamda `object-src 'none'` va `base-uri 'none'` bilan to'ldirishni misollarida ko'rsatadi. Bu yerda `object-src 'none'` plaginlar orqali kod bajarilishini, `base-uri 'none'` esa `<base>` yordamida nisbiy skript manzillarini hujumchi hostiga burishni to'sadi.

## Chuqurroq: qaror qanday qabul qilinadi

Quyidagi `run` bloki `script-src` qarorining soddalashtirilgan modelini beradi: nonce, `'unsafe-inline'`ning nonce bilan o'zaro ta'siri, `'strict-dynamic'` va host ro'yxati. Bu to'liq CSP3 algoritmi emas (hash, `'unsafe-eval'`, redirect'lar, `report-*` yo'q), faqat qaror tuzilishini ko'rsatadi.

```ts run
type Script = { inline: boolean; nonce?: string; src?: string; byTrusted?: boolean };

// O'quv modeli: CSP script-src qarorining soddalashtirilgan ko'rinishi
function parseCsp(policy: string): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const part of policy.split(";").map((s) => s.trim()).filter(Boolean)) {
    const [name, ...vals] = part.split(/\s+/);
    m.set(name.toLowerCase(), vals);
  }
  return m;
}

function allowScript(policy: string, s: Script): boolean {
  const p = parseCsp(policy);
  const srcs = p.get("script-src") ?? p.get("default-src");
  if (!srcs) return true; // direktiva yo'q: cheklov yo'q
  const nonces = srcs.filter((v) => v.startsWith("'nonce-")).map((v) => v.slice(7, -1));
  const strict = srcs.includes("'strict-dynamic'");
  if (s.nonce && nonces.includes(s.nonce)) return true; // nonce mos: inline ham, tashqi ham
  if (strict && s.byTrusted) return true; // ishonchli skript yaratgan skript
  if (s.inline) return srcs.includes("'unsafe-inline'") && nonces.length === 0;
  if (strict) return false; // strict-dynamic: host ro'yxati e'tiborsiz
  const u = new URL(s.src!);
  const self = srcs.includes("'self'") && u.origin === "https://app.fleet.example";
  return self || srcs.includes(u.origin) || srcs.includes(u.hostname);
}

const weak = "script-src 'self' 'unsafe-inline' https://cdn.example.com";
const strict = "script-src 'nonce-r4nd0mR4nd0m' 'strict-dynamic'; object-src 'none'; base-uri 'none'";

const cases: [string, Script][] = [
  ["inline, nonce yo'q", { inline: true }],
  ["inline, nonce mos", { inline: true, nonce: "r4nd0mR4nd0m" }],
  ["tashqi, cdn.example.com", { inline: false, src: "https://cdn.example.com/lib.js" }],
  ["tashqi, hujumchi hosti", { inline: false, src: "https://evil.example/x.js" }],
  ["ishonchli skript yaratgan", { inline: false, src: "https://evil.example/x.js", byTrusted: true }],
];
for (const [name, s] of cases) {
  console.log(name.padEnd(28), "zaif:", String(allowScript(weak, s)).padEnd(5), "qat'iy:", allowScript(strict, s));
}
```

```text
inline, nonce yo'q           zaif: true  qat'iy: false
inline, nonce mos            zaif: true  qat'iy: true
tashqi, cdn.example.com      zaif: true  qat'iy: false
tashqi, hujumchi hosti       zaif: false qat'iy: false
ishonchli skript yaratgan    zaif: false qat'iy: true
```

Birinchi qatorga e'tibor bering: nonce'siz inline skript zaif siyosatda bajariladi, qat'iy siyosatda esa yo'q. Uchinchi qator: zaif siyosat `cdn.example.com` dagi har skriptga ruxsat beradi, qat'iy siyosat host ro'yxatini e'tiborsiz qoldiradi. Oxirgi qatordagi `byTrusted` bayrog'i skriptni ishonchli skript yaratganini bildiradi (model buni bayroq bilan ko'rsatadi, brauzer esa chaqiruv zanjiridan biladi).

### Report-Only va joriy qilish

Qat'iy siyosatni birdan majburiy yoqish ilovani sindiradi: noma'lum inline skript, uchinchi tomon vidjeti, eski `onclick=` atributlari. Shuning uchun `Content-Security-Policy-Report-Only` header'i bor: brauzer siyosatni baholaydi, buzilishlarni `report-to`/`report-uri` ga yuboradi, lekin bloklamaydi. OWASP cheat sheet shu yo'lni tavsiya etadi: avval Report-Only, hisobotlarni tahlil qilish, keyin majburiy rejim. Bir vaqtda ikkala header'ni yuborish mumkin: majburiy yumshoqroq siyosat va Report-Only qat'iyroq siyosat.

### Chegaralar

- `<meta http-equiv="Content-Security-Policy">` barcha imkoniyatni qo'llab-quvvatlamaydi: MDN bo'yicha `frame-ancestors`, `report-uri` va `sandbox` direktivalari meta orqali ishlamaydi, Report-Only esa meta orqali yuborilmaydi. Header ishlatish afzal.
- CSP faqat siyosatga qarab skript bajarilishini cheklaydi. HTML kiritish, kontentni o'zgartirish, formani boshqa manzilga yuborish (`form-action` bo'lmasa) kabi zararlar qolishi mumkin.
- Inline event handler (`onclick="..."`) va `javascript:` URL qat'iy siyosatda bloklanadi; ularni `addEventListener` ga ko'chirish kerak.
- Nonce'li siyosat har javob dinamik bo'lishini talab qiladi: to'liq statik, keshlanadigan sahifalarda nonce har so'rovda o'zgarmaydi. Bunday sahifalarda hash yoki o'zgaruvchan qismni alohida yuklash kerak (35-dars).

## Misol: unsafe-inline va host ro'yxati

Quyidagi kod yuqoridagi modelni bevosita qo'llaydi. Hujum faqat shu darsning o'quv modeliga qarshi: biz "sahifaga skript kiritildi" holatini `Script` obyekti bilan ifodalaymiz.

### 1. Zaif kod

```ts run
type Script = { inline: boolean; nonce?: string; src?: string; byTrusted?: boolean };

// O'quv modeli: CSP script-src qarorining soddalashtirilgan ko'rinishi
function parseCsp(policy: string): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const part of policy.split(";").map((s) => s.trim()).filter(Boolean)) {
    const [name, ...vals] = part.split(/\s+/);
    m.set(name.toLowerCase(), vals);
  }
  return m;
}

function allowScript(policy: string, s: Script): boolean {
  const p = parseCsp(policy);
  const srcs = p.get("script-src") ?? p.get("default-src");
  if (!srcs) return true; // direktiva yo'q: cheklov yo'q
  const nonces = srcs.filter((v) => v.startsWith("'nonce-")).map((v) => v.slice(7, -1));
  const strict = srcs.includes("'strict-dynamic'");
  if (s.nonce && nonces.includes(s.nonce)) return true; // nonce mos: inline ham, tashqi ham
  if (strict && s.byTrusted) return true; // ishonchli skript yaratgan skript
  if (s.inline) return srcs.includes("'unsafe-inline'") && nonces.length === 0;
  if (strict) return false; // strict-dynamic: host ro'yxati e'tiborsiz
  const u = new URL(s.src!);
  const self = srcs.includes("'self'") && u.origin === "https://app.fleet.example";
  return self || srcs.includes(u.origin) || srcs.includes(u.hostname);
}

// ZAIF: unsafe-inline va umumiy CDN hosti
const WEAK = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com";

const legit: Script = { inline: true };
console.log("o'z inline skriptimiz:", allowScript(WEAK, legit));
console.log("o'z fayl:", allowScript(WEAK, { inline: false, src: "https://app.fleet.example/app.js" }));
```

```text
o'z inline skriptimiz: true
o'z fayl: true
```

### 2. Hujum

Hujumchi XSS orqali sahifaga `<script>alert(1)</script>` kiritdi. Bu nonce'siz inline skript:

```ts run
type Script = { inline: boolean; nonce?: string; src?: string; byTrusted?: boolean };

// O'quv modeli: CSP script-src qarorining soddalashtirilgan ko'rinishi
function parseCsp(policy: string): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const part of policy.split(";").map((s) => s.trim()).filter(Boolean)) {
    const [name, ...vals] = part.split(/\s+/);
    m.set(name.toLowerCase(), vals);
  }
  return m;
}

function allowScript(policy: string, s: Script): boolean {
  const p = parseCsp(policy);
  const srcs = p.get("script-src") ?? p.get("default-src");
  if (!srcs) return true; // direktiva yo'q: cheklov yo'q
  const nonces = srcs.filter((v) => v.startsWith("'nonce-")).map((v) => v.slice(7, -1));
  const strict = srcs.includes("'strict-dynamic'");
  if (s.nonce && nonces.includes(s.nonce)) return true; // nonce mos: inline ham, tashqi ham
  if (strict && s.byTrusted) return true; // ishonchli skript yaratgan skript
  if (s.inline) return srcs.includes("'unsafe-inline'") && nonces.length === 0;
  if (strict) return false; // strict-dynamic: host ro'yxati e'tiborsiz
  const u = new URL(s.src!);
  const self = srcs.includes("'self'") && u.origin === "https://app.fleet.example";
  return self || srcs.includes(u.origin) || srcs.includes(u.hostname);
}

const WEAK = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com";
const injected: Script = { inline: true };
const viaCdn: Script = { inline: false, src: "https://cdn.example.com/jsonp?callback=alert" };

console.log("kiritilgan inline:", allowScript(WEAK, injected));
console.log("ruxsatli hostdagi skript:", allowScript(WEAK, viaCdn));
```

```text
kiritilgan inline: true
ruxsatli hostdagi skript: true
```

Kiritilgan skript bajarildi, chunki `'unsafe-inline'` ruxsat berdi. Ikkinchi qator: ruxsat berilgan hostdagi har qanday skript (bu yerda jsonp o'xshash URL) o'tadi, mazmuni tekshirilmaydi.

### 3. Tuzatilgan kod

```ts run
type Script = { inline: boolean; nonce?: string; src?: string; byTrusted?: boolean };

// O'quv modeli: CSP script-src qarorining soddalashtirilgan ko'rinishi
function parseCsp(policy: string): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const part of policy.split(";").map((s) => s.trim()).filter(Boolean)) {
    const [name, ...vals] = part.split(/\s+/);
    m.set(name.toLowerCase(), vals);
  }
  return m;
}

function allowScript(policy: string, s: Script): boolean {
  const p = parseCsp(policy);
  const srcs = p.get("script-src") ?? p.get("default-src");
  if (!srcs) return true; // direktiva yo'q: cheklov yo'q
  const nonces = srcs.filter((v) => v.startsWith("'nonce-")).map((v) => v.slice(7, -1));
  const strict = srcs.includes("'strict-dynamic'");
  if (s.nonce && nonces.includes(s.nonce)) return true; // nonce mos: inline ham, tashqi ham
  if (strict && s.byTrusted) return true; // ishonchli skript yaratgan skript
  if (s.inline) return srcs.includes("'unsafe-inline'") && nonces.length === 0;
  if (strict) return false; // strict-dynamic: host ro'yxati e'tiborsiz
  const u = new URL(s.src!);
  const self = srcs.includes("'self'") && u.origin === "https://app.fleet.example";
  return self || srcs.includes(u.origin) || srcs.includes(u.hostname);
}

function makeNonce(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return btoa(String.fromCharCode(...b));
}

const nonce = makeNonce();
console.log("nonce uzunligi (base64):", nonce.length);

// Namoyish uchun deterministik qiymat bilan siyosat
const FIXED = "r4nd0mR4nd0mAbCd==";
const STRICT = `script-src 'nonce-${FIXED}' 'strict-dynamic'; object-src 'none'; base-uri 'none'`;

console.log("o'z skriptimiz (nonce):", allowScript(STRICT, { inline: true, nonce: FIXED }));
console.log("kiritilgan inline:", allowScript(STRICT, { inline: true }));
console.log("taxmin qilingan nonce:", allowScript(STRICT, { inline: true, nonce: "guess" }));
console.log("hujumchi hostidan tashqi:", allowScript(STRICT, { inline: false, src: "https://evil.example/x.js" }));
console.log("cdn hostidagi tashqi:", allowScript(STRICT, { inline: false, src: "https://cdn.example.com/jsonp?callback=alert" }));
```

```text
nonce uzunligi (base64): 24
o'z skriptimiz (nonce): true
kiritilgan inline: false
taxmin qilingan nonce: false
hujumchi hostidan tashqi: false
cdn hostidagi tashqi: false
```

Tuzatish nima uchun yetarli. Invariant: bajariladigan har skript yo nonce'ni tashiydi, yo nonce'li skript tomonidan yaratilgan. Hujumchi har javobda o'zgaradigan nonce'ni bilmaydi, shuning uchun kiritilgan inline skript va uning tashqi manzillari bloklanadi; host ro'yxati yo'qligi sabab CDN hostidagi JSONP yo'li ham yopiladi. Ko'rsatilgan to'rtta hujum (nonce'siz inline, taxmin qilingan nonce, hujumchi hosti, ruxsatli hostdagi skript) yopilgan.

Yopilmagani. Birinchidan, nonce'li skriptning o'zida DOM XSS bo'lsa (masalan, `innerHTML` ga ishonchsiz ma'lumot), CSP buni to'xtatmaydi (34-dars: Trusted Types). Ikkinchidan, nonce sizib chiqsa (masalan, nonce'li sahifa keshlansa va nonce qayta ishlatilsa, yoki hujumchi javobdagi nonce'ni o'qiy olsa) siyosat yo'qoladi. Uchinchidan, `strict-dynamic` ishonchli skript yaratgan har skriptga ishonadi: ishonchli skript hujumchi ma'lumotidan skript yaratsa (`script.src = userInput`), siyosat chetlab o'tiladi. Model hash va `eval` ni ham qamramaydi.

## Qachon qo'llamaslik kerak

- Ilova uchun to'liq nazorat yo'q joyda (uchinchi tomon CMS, ko'p marketing skripti) qat'iy CSP doim sinadi. Bunday holatda avval Report-Only bilan nima yuklanayotganini inventarizatsiya qiling; majburiy rejimni skriptlar ro'yxati barqaror bo'lgandan keyin yoqing.
- Qat'iy CSP'ni "CSP bor, demak XSS tuzatish shart emas" deb ishlatish xato. U chuqur himoya qatlami. Output encoding va xavfsiz API birlamchi (31-34-darslar).
- Statik hosting va CDN keshlash nonce bilan to'qnashadi: bir xil keshlangan sahifa hammaga bir nonce beradi va nonce taxmin qilinadigan bo'lib qoladi. Bunday joylarda hash'li siyosat yoki nonce'ni edge'da qo'shish kerak.
- `'unsafe-inline'` fallback eski brauzer uchun himoya yo'qligini anglatadi. Auditoriyangizda eski brauzerlar ulushi katta bo'lmasa, fallbackdan voz kechish mumkin; qaror auditoriyaga bog'liq.
- Juda kichik, faqat server-render qilingan va hech qanday inline skriptsiz sayt uchun oddiy `script-src 'self'; object-src 'none'; base-uri 'none'` kifoya: murakkab nonce infratuzilmasi ortiqcha.

## Stack'da: Next.js va Fastify

Next.js'da nonce'li CSP odatda middleware (yoki proxy) orqali har so'rovda yaratiladi va header'ga qo'yiladi; Next.js framework skriptlariga nonce'ni o'zi qo'shadi. Bu dinamik rendering talab qiladi, ya'ni to'liq statik sahifalar bunday nonce ishlata olmaydi. To'liq joriy qilish 35-darsda. Fastify yoki NestJS'da (server-render shablon bilan) `@fastify/helmet` `contentSecurityPolicy` opsiyasida nonce funksiyasini qabul qiladi. Quyidagi kod ishga tushirilmaydi (kutubxona kerak), sintaksis jihatidan to'g'ri TypeScript.

```ts
import Fastify from "fastify";
import helmet from "@fastify/helmet";
import { randomBytes } from "node:crypto";

const app = Fastify();

app.addHook("onRequest", async (req, reply) => {
  // Har javob uchun yangi nonce (CSPRNG)
  (reply as any).cspNonce = randomBytes(16).toString("base64");
});

await app.register(helmet, {
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      scriptSrc: ["'strict-dynamic'", (req: any, res: any) => `'nonce-${res.cspNonce}'`],
      objectSrc: ["'none'"],
      baseUri: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
});
```

Helmet opsiyalarining aniq shakli versiyaga bog'liq; funksiya argumentlari va `reply` obyektidagi nonce xossasi sizning versiyangizda boshqacha bo'lishi mumkin (bu kod parchasi yo'nalishni ko'rsatadi, versiyangiz hujjatini tekshiring). Nonce'ni shablonda `<script nonce="...">` ga qo'yishni unutmang.

## Xulosa

- CSP brauzerga qaysi skriptlar ishlashini aytadi; u XSS uchun chuqur himoya qatlami, XSS tuzatishning o'rni emas.
- `'unsafe-inline'` va keng host ro'yxati siyosatni deyarli ma'nosiz qiladi: birinchisi har inline skriptga, ikkinchisi ruxsatli hostdagi har skriptga ruxsat beradi.
- Qat'iy shakl: `script-src 'nonce-...' 'strict-dynamic'; object-src 'none'; base-uri 'none'`, nonce har javobda yangi va CSPRNG bilan.
- Joriy qilishni `Content-Security-Policy-Report-Only` bilan boshlang, hisobotlarni tahlil qilib, keyin majburiy rejimga o'ting.
- Meta teg cheklangan; `frame-ancestors` va hisobot direktivalari uchun header ishlating.
- Nonce sizishi, ishonchli skriptdagi DOM XSS va keshlangan sahifalar siyosatni buzadigan qoldiq risklar.
