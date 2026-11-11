---
n: 38
slug: open-redirect
title: "Open redirect va URL validatsiyasi"
summary: "Open redirect mexanizmi: login'dan keyingi next parametri orqali ishonchli domendan hujumchi saytiga yo'naltirish, qo'lda yozilgan startsWith/includes tekshiruvlari nega buziladi, parser asosidagi origin tekshiruvi, server tomonida ID xaritasi va boshqa zaifliklar bilan zanjiri."
duration: 40
sources:
  - id: cs-redirect
    note: "OWASP Unvalidated Redirects and Forwards Cheat Sheet: xavfli kod namunalari, oldini olish yo'llari va URL'ni parser bilan tekshirish tavsiyasi"
  - id: cs-input
    note: "Input Validation Cheat Sheet: kirishni allowlist bilan tekshirish va sintaktik hamda semantik validatsiyani ajratish bo'yicha umumiy yo'riqnoma (yo'naltirish manzili uchun aniq qoidalar cs-redirect'da)"
  - id: t10-a01
    note: "OWASP Top 10:2025 A01 ro'yxatida CWE-601 (Open Redirect) bog'liq weakness sifatida sanalgan"
  - id: whatwg-url
    note: "URL Standard, basic URL parser: kirishdan boshidagi va oxiridagi C0 control/bo'shliq hamda barcha ASCII tab va yangi qator olib tashlanadi; maxsus sxemada teskari slash (U+005C) validation error beradi, lekin slash sifatida tahlil qilinadi; shuning uchun `//host`, `/\\host` va tab bilan yashirilgan yozuvlar `new URL` da ochiladi"
quiz:
  - q: "Login'dan keyin `next` parametriga yo'naltirish bor. Tekshiruv: `next.startsWith('/')`. Hujumchi qaysi qiymatni yuboradi?"
    options:
      - "`https://evil.example`"
      - "`//evil.example`"
      - "`javascript:alert(1)`"
      - "`/kabinet`"
    answer: 1
    explain: "`//evil.example` '/' bilan boshlanadi, lekin brauzer uni protokolga nisbiy (protocol-relative) manzil deb o'qib, evil.example ga olib boradi. `https://...` va `javascript:` bu tekshiruvdan o'tmaydi, `/kabinet` esa qonuniy qiymat."
  - q: "Tekshiruv: `next.startsWith('https://app.example')`. Qaysi qiymat uni aylanib o'tadi?"
    options:
      - "`https://app.example/kabinet`"
      - "`/kabinet`"
      - "`https://app.example.evil.com/` yoki `https://app.example@evil.example/`"
      - "`https://APP.example/`"
    answer: 2
    explain: "Prefiks mos kelishi domen chegarasini isbotlamaydi: `app.example.evil.com` shu matn bilan boshlanadi, `app.example@evil.example` da esa `app.example` userinfo qismi, haqiqiy host `evil.example`. Cheat sheet xom prefiks/suffiks solishtirishdan ogohlantiradi va parsed komponentlarni solishtirishni tavsiya qiladi."
  - q: "Eng ishonchli dizayn qaysi: tashqi sahifaga yo'naltirish kerak bo'lgan ilovada?"
    options:
      - "`next` ni regex bilan tekshirish"
      - "URL'ni kodlab yuborish"
      - "Hamma yo'naltirishdan keyin 200 kodini qaytarish"
      - "Foydalanuvchidan URL emas, qisqa ID olish va uni serverda ruxsat etilgan manzilga xaritalash"
    answer: 3
    explain: "Cheat sheet foydalanuvchidan URL o'rniga ID/token olib, serverda to'liq manzilga xaritalashni eng yuqori himoya deb ataydi. Ehtiyot chorasi: ID ketma-ket bo'lsa, hammasini sanab chiqish mumkin (enumeration)."
  - q: "Open redirect 'faqat phishing' degan fikr nega to'liq emas?"
    options:
      - "U OAuth `redirect_uri` kabi oqimlarda kod/token'ni begona manzilga olib ketishi va boshqa filtrlarni (masalan SSRF allowlist) aylanib o'tishga yordam berishi mumkin"
      - "Open redirect umuman xavfli emas"
      - "Faqat HTTP sahifalarda uchraydi"
      - "U faqat mobil ilovalarga tegishli"
    answer: 0
    explain: "Ishonchli domen redirect'i boshqa zaifliklar bilan zanjirlanadi: OAuth oqimlarida (48-dars) yo'naltirish manzili tekshiruvini aylanib o'tish, allowlist'li filtrlarni yengish. Cheat sheet forward'lar kirish nazoratini aylanib o'tishi mumkinligini ham yozadi."
  - q: "Kod `isSafe(next)` ni tekshiradi, lekin keyin `res.redirect(next.trim().replace(/\\\\/g, '/'))` qiladi. Nima uchun bu xavfli?"
    options:
      - "Tekshirilgan qiymat bilan yo'naltirilgan qiymat farq qiladi: tekshiruvdan keyingi o'zgartirish natijani boshqa manzilga aylantirishi mumkin"
      - "trim() sekin ishlaydi"
      - "replace() xato tashlaydi"
      - "Xavfsiz, chunki tekshiruv bor"
    answer: 0
    explain: "Cheat sheet: tekshirilgan URL bilan yo'naltiring, undan keyin qayta o'zgartirmang. Qiymatni tekshiruvdan keyin o'zgartirsangiz, tekshirilgan narsa va brauzerga yuboriladigan narsa farq qilishi mumkin (TOCTOU, 60-dars)."
  - q: "Sizning platformada hisobotni tashqi hamkor portaliga yo'naltirish kerak va manzillar ro'yxati kichik. Eng yaxshi kombinatsiya?"
    options:
      - "Har qanday https URL'ni qabul qilish"
      - "Parsed origin'ni allowlist bilan solishtirish (sxema, host, port) va foydalanuvchiga 'saytdan chiqyapsiz' oralig'ini ko'rsatish"
      - "Faqat host nomida 'example' so'zi borligini tekshirish"
      - "Hamma tashqi yo'naltirishni jim bajarish"
    answer: 1
    explain: "Cheat sheet tashqi manzillar kerak bo'lsa parsed komponentlarni aniq allowlist bilan solishtirishni va foydalanuvchini tashqariga chiqayotgani haqida ogohlantiruvchi sahifa orqali o'tkazishni tavsiya qiladi."
task:
  title: "Parser asosidagi safeRedirect"
  prompt: |
    Login'dan keyingi yo'naltirish `next` parametrini qabul qiladi. Hozirgi `safeRedirect` `startsWith("/")` ga tayanadi va `//evil.example`, `/\evil.example` kabi qiymatlarni o'tkazib yuboradi.

    Vazifa: `safeRedirect(next, fallback)` ni yozing. `next` ni `new URL(next, APP_ORIGIN)` bilan tahlil qiling; faqat natija `origin` i `APP_ORIGIN` ga teng bo'lsa, `pathname + search + hash` ni qaytaring (yo'naltirish tekshirilgan qiymat bilan). Tahlil xato bersa, `next` satr bo'lmasa yoki origin boshqa bo'lsa, `fallback` qaytariladi. Natija doim `/` bilan boshlanadigan nisbiy yo'l bo'lsin.
  lang: ts
  starter: |
    const APP_ORIGIN = "https://app.example";

    function safeRedirect(next: unknown, fallback = "/kabinet"): string {
      if (typeof next === "string" && next.startsWith("/")) return next; // TUZATING
      return fallback;
    }

    const attacks = [
      "//evil.example",
      "/\\evil.example",
      "/\t/evil.example",
      "///evil.example",
      "https://app.example@evil.example/",
      "https://app.example.evil.com/",
      "javascript:alert(1)",
      "http:/evil.example",
      42,
    ];

    console.log("hujumlar fallback'ga tushdi:", attacks.every((a) => safeRedirect(a) === "/kabinet"));
    console.log("oddiy yo'l:", safeRedirect("/mashinalar/7?tab=gps#xarita") === "/mashinalar/7?tab=gps#xarita");
    console.log("o'z origin'i to'liq manzil:", safeRedirect("https://app.example/hisobot") === "/hisobot");
    console.log("nisbiy natija:", attacks.concat(["/a", "https://app.example/b"]).every((a) => safeRedirect(a).startsWith("/") && !safeRedirect(a).startsWith("//")));
  solution: |
    const APP_ORIGIN = "https://app.example";

    function safeRedirect(next: unknown, fallback = "/kabinet"): string {
      if (typeof next !== "string") return fallback;
      let u: URL;
      try {
        u = new URL(next, APP_ORIGIN);
      } catch {
        return fallback;
      }
      if (u.origin !== APP_ORIGIN) return fallback;
      const target = u.pathname + u.search + u.hash;
      return target.startsWith("//") ? fallback : target;
    }

    const attacks = [
      "//evil.example",
      "/\\evil.example",
      "/\t/evil.example",
      "///evil.example",
      "https://app.example@evil.example/",
      "https://app.example.evil.com/",
      "javascript:alert(1)",
      "http:/evil.example",
      42,
    ];

    console.log("hujumlar fallback'ga tushdi:", attacks.every((a) => safeRedirect(a) === "/kabinet"));
    console.log("oddiy yo'l:", safeRedirect("/mashinalar/7?tab=gps#xarita") === "/mashinalar/7?tab=gps#xarita");
    console.log("o'z origin'i to'liq manzil:", safeRedirect("https://app.example/hisobot") === "/hisobot");
    console.log("nisbiy natija:", attacks.concat(["/a", "https://app.example/b"]).every((a) => safeRedirect(a).startsWith("/") && !safeRedirect(a).startsWith("//")));
  solutionNotes: |
    - Tekshiruv matn ustida emas, URL parser natijasida: brauzer ham shu qoidalar bilan tahlil qiladi, shuning uchun `//host`, `/\host`, tab bilan yashirilgan yozuvlar parser tomonidan ochiladi va origin farqi ko'rinadi.
    - Qaytariladigan qiymat kiritish emas, parser hosil qilgan `pathname + search + hash`: tekshirilgan narsa va yuboriladigan narsa bir xil (TOCTOU yo'q).
    - Oxirgi `startsWith("//")` tekshiruvi qo'shimcha xavfsizlik: yo'l `//` bilan boshlansa, uni `Location` ga qo'yish yana protokolga nisbiy manzilga aylanishi mumkin.
    - Tashqi domenga yo'naltirish kerak bo'lsa, bu funksiya mos emas: u alohida server tomoni ID xaritasi va oraliq ogohlantirish sahifasini talab qiladi.
    - Bu faqat yo'naltirish manzilini yopadi. Login oqimining boshqa qismlari (CSRF, session fixation) alohida (36 va 46-darslar).
  checklist:
    - "Tekshiruv `new URL` natijasidagi `origin` bo'yicha"
    - "Yo'naltirish tekshirilgan `pathname + search + hash` bilan"
    - "Xato va satr bo'lmagan kirishda `fallback`"
    - "`//host`, `/\\host`, userinfo va prefiksli domen hiylalari fallback'ga tushadi"
    - "Tashqi manzillar uchun ID xaritasi nega kerakligini tushuntira olasiz"
---

## Muammo

Login sahifasida `https://app.example/login?next=/hisobot/7` ko'rinishidagi havola odatiy: foydalanuvchi himoyalangan sahifaga kirmoqchi bo'ldi, tizim uni loginga yubordi va kirgandan keyin qaytaradi. Server `next` qiymatini o'qib `302 Location: <next>` qaytaradi. Agar `next` tekshirilmasa, hujumchi `https://app.example/login?next=https://evil.example/kirish` havolasini tarqatadi. Havola domeni haqiqiy `app.example`, shuning uchun foydalanuvchi va hatto pochta filtri ham unga ishonadi. U parol kiritadi, tizim uni `evil.example` ga yo'naltiradi, u yerda "sessiya tugadi, qayta kiring" sahifasi parolni yig'adi.

Bu open redirect (unvalidated redirect): ilova ishonchsiz kirishdagi URL'ga yo'naltiradi. OWASP Unvalidated Redirects and Forwards Cheat Sheet xavfni shunday tasvirlaydi: havolada server nomi asl sayt bilan bir xil, shuning uchun phishing ishonchliroq ko'rinadi. OWASP Top 10:2025 ning A01 Broken Access Control toifasiga bog'langan CWE'lar orasida CWE-601 (URL Redirection to Untrusted Site, ya'ni Open Redirect) ham sanalgan.

Bitta open redirect "faqat phishing" bo'lib ko'rinadi, lekin u zanjir halqasi bo'lishi mumkin: OAuth oqimida `redirect_uri` tekshiruvini aylanib o'tish (48-dars), ruxsat ro'yxatidagi domen orqali ichki filtrlarni yengish (SSRF, 27-dars). Cheat sheet forward'lar haqida ham ogohlantiradi: server ichida foydalanuvchi kiritgan manzilga forward qilish kirish nazorati tekshiruvini aylanib o'tib, administrator funksiyasiga olib borishi mumkin. Shu sababli bu mavzu faqat havola tozaligi emas, ishonch chegarasi masalasi.

## Asosiy g'oya

Qoida: foydalanuvchi bergan qiymat yo'naltirish manzilini belgilamasligi kerak. Cheat sheet bir necha daraja beradi, eng yaxshisidan boshlab:

1. Yo'naltirishdan butunlay qochish.
2. Manzilni foydalanuvchi kiritishidan olmaslik.
3. Foydalanuvchidan qisqa nom, ID yoki token olib, serverda to'liq manzilga xaritalash. Cheat sheet buni manzilni o'zgartirishga qarshi eng yuqori himoya deb ataydi; faqat ID'lar ketma-ket bo'lib, hamma maqsadni sanab chiqishga yo'l qo'ymasin.
4. Foydalanuvchi qiymatini baribir qabul qilish kerak bo'lsa, uni tekshirish: manzil ilova uchun mos va foydalanuvchi uchun ruxsat etilgan bo'lishi kerak.
5. Lokal qaytish manzillari uchun framework yordamchisi: lokal bo'lmagan manzilni rad etuvchi funksiya.
6. Tashqi manzillar kerak bo'lsa, aniq tasdiqlangan manzillarni parsed komponentlar bo'yicha allowlist qilish.
7. Tashqi yo'naltirishdan oldin foydalanuvchiga "saytdan chiqyapsiz" sahifasini ko'rsatib, manzilni aniq yozib, bosish bilan tasdiqlatish.

Tekshirish tafsiloti uchun cheat sheet: URL'ni yo'naltirish API bilan va brauzer sharhi bilan mos keladigan parser orqali tahlil qiling; parsed sxema, kanonik host va samarali portni aniq allowlist bilan solishtiring, yo'l faqat ma'lum endpoint'lar uchun cheklansin; userinfo va noaniq kirishni rad eting; yo'naltirishni tekshirilgan URL bilan bajaring, undan keyin o'zgartirmang. Xom prefiks yoki suffiks bo'yicha solishtirish bypass qilinadi: cheat sheet GitLab misolida userinfo va chalg'ituvchi host nomlari bunday tekshiruvlarni qanday yengishini ko'rsatadi.

## Chuqurroq: nega qo'lda tekshiruvlar buziladi

Quyidagi natijalar `new URL(x, "https://app.example")` chaqiruvidan olingan: Node.js `URL` sinfi WHATWG URL standartini amalga oshiradi va brauzerlar ham shu standartga tayanadi, shuning uchun parser natijasi brauzer qarori bilan mos keladi.

### Nisbiy ko'rinishdagi tashqi manzillar

`startsWith("/")` tekshiruvi "ichki yo'l" deb o'ylaydi. Lekin: `//evil.example` (protokolga nisbiy manzil), `/\evil.example` (maxsus sxemalarda teskari slash `/` kabi o'qiladi), `/\t/evil.example` (parser tab va yangi qator belgilarini olib tashlaydi), `///evil.example` (ortiqcha slash'lar). Bularning hammasi Node'ning `new URL(x, "https://app.example")` chaqiruvida `https://evil.example/` ga aylanadi. `/%2f%2fevil.example` esa oddiy yo'l bo'lib qoladi (kodlangan slash'lar yo'l ichida), shuning uchun parser buni to'g'ri ajratadi.

### Prefiks, includes va suffiks

`startsWith("https://app.example")` quyidagilarga yechiladi: `https://app.example.evil.com/` (domen chegarasi tekshirilmagan) va `https://app.example@evil.example/` (`app.example` bu userinfo, haqiqiy host `evil.example`). `includes("app.example")` yoki `endsWith("app.example")` ham shunday: `https://evilapp.example` suffiksga mos keladi, `https://evil.example/?app.example` esa `includes` ga. Hujumchi bu mantiqni test qilib topadi; tuzatish matn bilan emas, parsed host bilan solishtirishda.

### Sxema va boshqa URL turlari

`javascript:alert(1)` va `data:` yo'naltirish manzili bo'lsa, `Location` sarlavhasida brauzerlar ularni odatda bajarmaydi, lekin yo'naltirishni HTML (`<a href>`, `window.location = next`) orqali qilsangiz, `javascript:` ishlaydi (32 va 33-darslardagi sxema allowlist qoidasi). Client-side redirect (`location.href = new URLSearchParams(location.search).get("next")`) 31-darsdagi DOM-based XSS manbasi va sinkining aynan o'zi: shu sababli `javascript:` ni to'sish majburiy. Server tomonidagi `Location` uchun ham, klient tomonidagi uchun ham bir xil parser asosidagi funksiyadan foydalaning (DRY).

### Tekshirilgan va yuborilgan qiymat bir xil bo'lsin

Eng ko'p uchraydigan ikkinchi xato: `isSafe(next)` true qaytardi, keyin kod `next.trim()`, `decodeURIComponent(next)` yoki boshqa o'zgartirish qiladi. Natijada tekshirilgan satr bilan yuborilgan satr farq qiladi. Kod qiymatni bir marta tahlil qilib, parsed qismlardan yangi nisbiy yo'l yig'sin va faqat shuni ishlatsin. Bu "validate, so'ng transform" naqshining TOCTOU shakli (60-dars).

### Yo'naltirishdan keyin kod davom etadi

Cheat Sheet PHP misolida muhim nozik joyni qayd etadi: `header("Location: ...")` dan keyingi kod ishlashda davom etadi, shuning uchun foydalanuvchi brauzerini yo'naltirishni e'tiborsiz qoldirsa (masalan `curl`), sahifaning qolgan qismiga yetib borishi mumkin. Node.js'da ham xuddi shunday: `res.redirect(...)` dan keyin funksiya tugamaydi. Himoyalangan sahifada "tekshir va yo'naltir" naqshida har doim `return res.redirect(...)` yozing, aks holda yo'naltirishdan keyingi kod (ma'lumot yuklash, yozish) baribir bajariladi. Bu open redirect emas, lekin yo'naltirish orqali "kirish nazorati" qilinadigan hamma joyga tegishli. Yo'naltirish brauzerga tavsiya, server tomonidagi to'siq emas.

### Manzil qiymati va ruxsat

Cheat Sheet foydalanuvchi kiritishini qabul qilishda uch shartni sanaydi: qiymat yaroqli, ilova uchun mos va foydalanuvchi uchun ruxsat etilgan bo'lishi kerak. `safeRedirect` birinchi ikki shartning bir qismini (tashqi domenni) yopadi, lekin uchinchisi ilova mantig'iga tegishli: login'dan keyin `next=/admin/foydalanuvchilar` bo'lsa, oddiy dispetcher shu sahifaga yo'naltirilishi mumkin va sahifaning o'zi avtorizatsiyani tekshirishi kerak (51-dars). Yo'naltirish orqali "forward" qilinadigan ichki marshrutlarda esa bu tekshiruv yo'naltiruvchi kodning o'zida bo'lmasa, hujumchi kirish nazorati filtridan o'tgan URL orqali administrator funksiyasiga yetadi.

### OAuth: aniq tenglik

OAuth oqimida `redirect_uri` ni tekshirish open redirect bilan bir oilada, lekin qoida qattiqroq. ASVS 5.0.0 ning 10.4.1 talabi (1-daraja) authorization server redirect URI'larni mijozga xos, oldindan ro'yxatdan o'tkazilgan allowlist bilan aniq satr solishtirish (exact string comparison) orqali tekshirishini talab qiladi. OWASP OAuth2 Cheat Sheet esa mijoz va authorization server tasodifiy URI'ga yo'naltiradigan "open redirector" endpoint'larni ochmasligi kerakligini yozadi, chunki ular authorization code va access token'ni chiqarib ketishga imkon beradi. Demak `safeRedirect` dagi kabi "origin teng bo'lsa yo'l ixtiyoriy" mantiq OAuth uchun yetarli emas: u yerda butun URI oldindan ro'yxatda turishi kerak (48 va 49-darslar).

### Mashq: redirect_uri uchun aniq tenglik

Quyidagi funksiya hozir prefiks bo'yicha solishtiradi. Uni ro'yxatdan o'tgan URI'larga aniq tenglik bilan almashtiring: kiritish parser orqali o'tsin, parser hosil qilgan `href` ro'yxatdagi yozuv bilan teng bo'lsin, so'rov satri, prefiks, userinfo va boshqa yo'l qabul qilinmasin.

```ts run
const REGISTERED = ["https://app.example/oauth/callback", "https://portal.alfa.example/cb"];

function isRegisteredRedirect(uri: string): boolean {
  return REGISTERED.some((r) => uri.startsWith(r)); // TUZATING: aniq tenglik
}

console.log(isRegisteredRedirect("https://app.example/oauth/callback"));
console.log(isRegisteredRedirect("https://app.example/oauth/callback/../../x"));
console.log(isRegisteredRedirect("https://app.example/oauth/callback.evil.example/x"));
```

```ts test
check("ro'yxatdagi aniq URI qabul qilinadi", () => isRegisteredRedirect("https://app.example/oauth/callback") === true);
check("prefiksli yo'l rad etiladi", () => isRegisteredRedirect("https://app.example/oauth/callback/x") === false);
check("so'rov satri qo'shilgani rad etiladi", () => isRegisteredRedirect("https://app.example/oauth/callback?next=//evil.example") === false);
check("userinfo bilan yashirilgan host rad etiladi", () => isRegisteredRedirect("https://app.example@evil.example/oauth/callback") === false);
check("../ bilan chiqib ketish rad etiladi", () => isRegisteredRedirect("https://app.example/oauth/callback/../../x") === false);
check("bo'sh va yaroqsiz kirish rad etiladi", () => isRegisteredRedirect("") === false && isRegisteredRedirect("not a url") === false);
```

Yechim g'oyasi: `new URL(uri)` xato bersa `false`; aks holda `REGISTERED.includes(u.href)` va bundan tashqari `u.href === uri` (kiritish parser tomonidan o'zgartirilmagan, ya'ni normalizatsiyasiz aniq tenglik). Ikkinchi shart muhim: `https://app.example/oauth/callback` va `https://APP.example/oauth/callback` parser ostida bir xil `href` beradi, lekin ASVS satrni aynan solishtirishni talab qiladi.

### Server tomonidagi forward

Server ichida `forward` (masalan ichki marshrutlash `req.url = fwd`) foydalanuvchi qiymati bilan bo'lsa, cheat sheet bu holda foydalanuvchi bu manzilga kirishga haqli ekanini tekshirishni talab qiladi. Node.js ilovalarida buning o'xshashi: foydalanuvchi kiritgan yo'lni ichki `fetch` yoki `res.sendFile` ga uzatish (26 va 27-darslar). Shuning uchun open redirect bilan ichki forward bir oilaga mansub: ishonchsiz manzil ishonchli kontekstga yetadi.

## Misol: login'dan keyingi yo'naltirish

Misol faqat shu darsning o'quv funksiyasiga qarshi; hamma narsa mahalliy, tarmoq yo'q.

### 1. Zaif kod

Uchta odatiy "tekshiruv" va ularni sinash:

```ts run
const APP = "https://app.example";

// ZAIF: matn bo'yicha tekshiruvlar
const weak: Record<string, (n: string) => boolean> = {
  "startsWith('/')": (n) => n.startsWith("/"),
  "startsWith(APP)": (n) => n.startsWith(APP),
  "includes('app.example')": (n) => n.includes("app.example"),
};

// Brauzer haqiqatda qayerga olib borishini parser aytadi
const dest = (n: string) => new URL(n, APP).origin;

const inputs = [
  "/kabinet",
  "//evil.example",
  "/\\evil.example",
  "https://app.example.evil.com/",
  "https://app.example@evil.example/",
  "https://evil.example/?x=app.example",
];

for (const n of inputs) {
  const passed = Object.entries(weak).filter(([, f]) => f(n)).map(([name]) => name);
  console.log(JSON.stringify(n), "->", dest(n), "| o'tgan:", passed.length ? passed.join(", ") : "-");
}
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu open redirect usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi `next` qiymatini tanlaydi. Jadvalda har bir qiymat uchun brauzer olib boradigan haqiqiy origin va qaysi zaif tekshiruv uni o'tkazgani ko'rinadi (origin parser hisoblagan, shuning uchun brauzerning haqiqiy qarori bilan mos):

```text
"/kabinet" -> https://app.example | o'tgan: startsWith('/')
"//evil.example" -> https://evil.example | o'tgan: startsWith('/')
"/\\evil.example" -> https://evil.example | o'tgan: startsWith('/')
"https://app.example.evil.com/" -> https://app.example.evil.com | o'tgan: startsWith(APP), includes('app.example')
"https://app.example@evil.example/" -> https://evil.example | o'tgan: startsWith(APP), includes('app.example')
"https://evil.example/?x=app.example" -> https://evil.example | o'tgan: includes('app.example')
```

Har bir zaif tekshiruv kamida bitta tashqi manzilni o'tkazdi, va `/kabinet` kabi qonuniy qiymat ham bor: tekshiruvlar "ishlayotgandek" ko'rinadi, shuning uchun xato ko'p vaqt sezilmaydi.

### 3. Tuzatilgan kod

Parser, origin solishtirish va yo'naltirishda tekshirilgan qiymat; tashqi manzillar uchun ID xaritasi:

```ts run
const APP_ORIGIN = "https://app.example";

function safeRedirect(next: unknown, fallback = "/kabinet"): string {
  if (typeof next !== "string") return fallback;
  let u: URL;
  try {
    u = new URL(next, APP_ORIGIN);
  } catch {
    return fallback;
  }
  if (u.origin !== APP_ORIGIN) return fallback;
  const target = u.pathname + u.search + u.hash;
  return target.startsWith("//") ? fallback : target;
}

// Tashqi manzillar: foydalanuvchi ID yuboradi, URL serverda
const EXTERNAL: Record<string, string> = {
  "alfa-portal": "https://portal.alfa.example/kirish",
  "beta-portal": "https://hisobot.beta.example/",
};
function externalRedirect(id: unknown): string | null {
  return typeof id === "string" && Object.hasOwn(EXTERNAL, id) ? EXTERNAL[id] : null;
}

const inputs = [
  "/hisobot/7?tab=gps#xarita",
  "https://app.example/hisobot",
  "//evil.example",
  "/\\evil.example",
  "https://app.example.evil.com/",
  "https://app.example@evil.example/",
  "javascript:alert(1)",
];
for (const n of inputs) console.log(JSON.stringify(n), "->", safeRedirect(n));

console.log("alfa-portal ->", externalRedirect("alfa-portal"));
console.log("evil ->", externalRedirect("evil"));
console.log("__proto__ ->", externalRedirect("__proto__"));
```

```text
"/hisobot/7?tab=gps#xarita" -> /hisobot/7?tab=gps#xarita
"https://app.example/hisobot" -> /hisobot
"//evil.example" -> /kabinet
"/\\evil.example" -> /kabinet
"https://app.example.evil.com/" -> /kabinet
"https://app.example@evil.example/" -> /kabinet
"javascript:alert(1)" -> /kabinet
alfa-portal -> https://portal.alfa.example/kirish
evil -> null
__proto__ -> null
```

### Tuzatish nima uchun yetarli

Invariant: `Location` ga faqat parser hosil qilgan, origin'i `APP_ORIGIN` ga teng bo'lgan nisbiy yo'l tushadi. Ko'rsatilgan oltita hujum (protokolga nisbiy, teskari slash, prefiksli domen, userinfo, `javascript:`) hammasi `fallback` ga tushdi. Tashqi manzillar uchun foydalanuvchi faqat ID beradi; `Object.hasOwn` tekshiruvi `__proto__` kabi kalitlar orqali prototip xususiyatlariga chiqishni to'sadi (29-dars). Tekshirilgan va yuborilgan qiymat bir xil.

Yopilmagan narsalar: (1) funksiya ilova ichidagi, lekin foydalanuvchi uchun mos bo'lmagan yo'lga yo'naltirishni to'smaydi (masalan, boshqa tenant sahifasi, ruxsat tekshiruvini sahifaning o'zi bajarishi kerak, 51-dars); (2) ID xaritasi ketma-ket ID'larda enumeration xavfini tug'diradi; (3) ichki sahifalardagi boshqa open redirect'lar (`/go?url=...` kabi yordamchi endpoint'lar) alohida tekshiriladi; (4) brauzerlar va server URL parserlari orasidagi nozik farqlar qoladi, shuning uchun bitta parser asosiy bo'lsin va tekshirilgan qiymat uzatilsin; (5) tashqi manzillarga o'tishda oraliq ogohlantirish sahifasi bu kodda yo'q.

## Qachon qo'llamaslik kerak

- Hamma yo'naltirishni to'liq taqiqlash ba'zan ortiqcha: login'dan keyin qaytish, SSO callback kabi funksiyalar kerak. Muammo yo'naltirishda emas, uni foydalanuvchi boshqarishida. Qaytish manzilini sessiyada yoki imzolangan holatda (state) saqlash `next` parametridan xavfsizroq.
- Faqat nisbiy yo'l funksiyasi (`safeRedirect`) tashqi domenlarga yo'naltirish kerak bo'lgan oqimlar uchun yaroqsiz. OAuth/OIDC `redirect_uri` uchun aniq, oldindan ro'yxatdan o'tgan manzillar bilan to'liq tenglik tekshiruvi kerak (48 va 49-darslar), prefiks yoki wildcard emas.
- Oraliq "saytdan chiqyapsiz" sahifasi foydalanuvchi tajribasini yomonlashtiradi. Bu faqat foydalanuvchi kiritgan tashqi manzillar uchun kerak; ichki va oldindan ro'yxatdagi manzillarda keraksiz.
- Regex bilan "yaxshilangan" tekshiruv (`^/[^/\\]`) qo'shimcha qatlam bo'lishi mumkin, lekin parserni almashtirmaydi: ayrim holatlarni o'tkazib yuboradi (masalan, tab bilan yashirilgan yozuvlar).
- Open redirect'ning xavfi kontekstga bog'liq: login oqimida yuqori, ommaviy blogdagi tashqi havola hisoblagichida past. Risk darajasini threat model (4-dars) bilan asoslang, lekin bu "tuzatmaslik" uchun bahona emas: parser asosidagi funksiya arzon.

## Stack'da: NestJS, Fastify va Next.js

Login controller'ida `next` ni olish va tekshirish bitta funksiyada bo'lsin (DRY), controller faqat natijani ishlatadi. Quyidagi kod ishga tushirilmaydi (NestJS muhiti kerak), faqat sintaksis jihatidan tekshirilgan:

```ts
import { Body, Controller, Post, Query, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";

const APP_ORIGIN = "https://app.example";

function safeRedirect(next: unknown, fallback = "/kabinet"): string {
  if (typeof next !== "string") return fallback;
  try {
    const u = new URL(next, APP_ORIGIN);
    const target = u.pathname + u.search + u.hash;
    return u.origin === APP_ORIGIN && !target.startsWith("//") ? target : fallback;
  } catch {
    return fallback;
  }
}

@Controller("auth")
export class AuthController {
  @Post("login")
  async login(@Body() body: { login: string; parol: string }, @Query("next") next: unknown, @Res() reply: FastifyReply) {
    // ... autentifikatsiya (41-50 darslar)
    return reply.redirect(safeRedirect(next), 302);
  }
}
```

Next.js'da `redirect()` (server) va `router.push()` (klient) ga foydalanuvchi qiymatini bevosita bermang; ikkalasi uchun ham shu funksiyani ishlating. Middleware/Proxy'da `NextResponse.redirect(new URL(path, request.url))` yo'lni parser orqali yig'adi; `path` ishonchsiz bo'lsa uni ham tekshiring. Reverse proxy yoki CDN darajasida kengaytirilgan redirect qoidalari (wildcard, regex) ham bir xil xatolarga moyil. Xavfsizlik testlarida (92-dars) `next`, `returnUrl`, `redirect`, `url`, `dest` kabi parametr nomlarini qidirib, yuqoridagi qiymatlar to'plamini sinab ko'ring, faqat o'z ilovangizda.

## Xulosa

- Open redirect: ishonchli domen havolasi orqali foydalanuvchini hujumchi saytiga olib o'tish; phishing, OAuth oqimlari va filtrlarni aylanib o'tish bilan zanjirlanadi.
- Eng yaxshi dizayn: foydalanuvchi URL emas, ID beradi va server manzilni o'zi tanlaydi; tashqi manzil kerak bo'lsa allowlist va oraliq ogohlantirish.
- Matn bo'yicha tekshiruvlar (`startsWith('/')`, `startsWith(domen)`, `includes`) buziladi: `//host`, `/\host`, prefiksli domen va userinfo ularni o'tkazadi.
- URL'ni parser bilan tahlil qiling, parsed origin'ni aniq tenglik bilan solishtiring va yo'naltirishda aynan tekshirilgan qiymatdan foydalaning.
- Klient tomonidagi yo'naltirishda `javascript:` sxemasi DOM XSS vektori; server va klient bir xil funksiyadan foydalansin. Qoldiq risklarni (ruxsat tekshiruvi, yordamchi endpoint'lar) alohida ko'ring.
