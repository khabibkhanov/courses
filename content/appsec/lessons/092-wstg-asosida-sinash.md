---
n: 92
slug: wstg-asosida-sinash
title: "O'z ilovangizni xavfsizlik bo'yicha sinash (WSTG asosida)"
summary: "O'z ilovangizni sinash tartibi: WSTG toifalari bo'yicha reja, ASVS bilan qamrovni belgilash, avtorizatsiya matritsasi va javob auditi kodda, topilmani regression test'ga aylantirish, ruxsat va chegaralar, Juice Shop bilan mashq."
duration: 45
sources:
  - id: wstg
    note: "WSTG repozitoriyasi (master): 4-bo'lim toifalari 4.1 Information Gathering dan 4.13 WebAssembly Testing gacha; Testing Framework matni: build vaqtida SAST/SCA/secret scanning, staging'da DAST va IaC/image skanerlash, release oldidan blokirovka chegaralari"
  - id: asvs
    note: "ASVS 5.0.0: talablar V1-V17 bo'limlarida; L1 qariyb 20%, L2 qariyb 50% talab, daraja tashkilot riskiga qarab tanlanadi"
  - id: juice-shop
    note: "OWASP Juice Shop loyiha sahifasi: Node.js, Express va Angular'da yozilgan ataylab zaif ilova, o'quv va CTF uchun, flagship loyiha, MIT litsenziya, score board orqali kuzatiladigan topshiriqlar"
quiz:
  - q: "Jamoa yiliga bir marta tashqi pentest buyurtma qiladi va qolgan vaqt hech narsa sinamaydi. Ilova har hafta o'zgaradi. Bu yondashuvning asosiy kamchiligi nima?"
    options:
      - "Pentest umuman foydasiz"
      - "Pentest tugaganidan keyingi o'zgarishlar sinalmay qoladi; sinov yangi kod bilan birga takrorlanishi kerak"
      - "Tashqi pentester doim ichki jamoadan yomonroq ishlaydi"
      - "Pentest faqat kod ko'rishni o'z ichiga oladi"
    answer: 1
    explain: "Pentest ma'lum paytdagi holatni ko'rsatadi. WSTG sinovni CI/CD'ga qo'shishni tavsiya qiladi: build'da SAST/SCA/secret scanning, staging'da DAST. Pentest foydali, lekin yagona nazorat sifatida yetarli emas."
  - q: "Authorization matritsa testida 'alfa' foydalanuvchisi `GET /vehicles/v2` (v2 'beta'ga tegishli) so'raydi. Qaysi natija test o'tdi degani?"
    options:
      - "200 va mashina ma'lumoti"
      - "200 va bo'sh obyekt"
      - "404 (yoki 403) va javob tanasida mashina ma'lumoti yo'q"
      - "500 va xato matni"
    answer: 2
    explain: "Begona obyektga kirish rad etilishi kerak va javob obyekt mavjudligini ham oshkor qilmasligi kerak. 200 (bo'sh obyekt ham) mavjudlik signali yoki sizish bo'lishi mumkin, 500 esa boshqa nuqson (xato boshqaruvi) belgisi."
  - q: "Reviewer API'da `X-Powered-By: Express 4.x` va to'liq stack trace qaytayotganini ko'rdi. Bu WSTG toifalaridan qaysilariga tegishli?"
    options:
      - "Faqat Business Logic"
      - "Configuration and Deployment Management hamda Error Handling"
      - "Faqat Weak Cryptography"
      - "Hech qaysisi: bu zaiflik emas"
    answer: 1
    explain: "Texnologiya haqidagi header sozlama (konfiguratsiya) masalasi, stack trace esa xatolarni boshqarish masalasi. Ikkalasi hujumchiga ma'lumot beradi va ayrim ilovalarda ichki yo'llar yoki so'rov matnini ham oshkor qiladi."
  - q: "Topilma tuzatildi. Qaysi qadam eng ko'p qiymat beradi?"
    options:
      - "Topilmani 'yopildi' deb belgilab, hisobotni arxivlash"
      - "Hujum so'rovini avtomatik testga aylantirish, shunda keyingi o'zgarishda regressiya darhol ko'rinadi"
      - "Faqat kodni qayta formatlash"
      - "Shu endpoint'ni o'chirish"
    answer: 1
    explain: "Qo'lda topilgan har nuqson test sifatida saqlanmasa, keyingi refaktoringda qaytib keladi. Test hujum kirishini qayta ishlatadi va tuzatish ishlashda qolishini kafolatlaydi. Endpoint'ni o'chirish har doim mumkin emas."
  - q: "Siz Juice Shop'ni lokal ishga tushirib, skaner va qo'lda sinov mashq qilmoqchisiz. Nima to'g'ri?"
    options:
      - "Juice Shop'ni internetga ochiq serverga qo'yib, hamma tekshirsin"
      - "Faqat o'zingiz boshqaradigan izolyatsiyalangan muhitda ishga tushirish: u ataylab zaif ilova"
      - "Real mijoz ma'lumotini Juice Shop'ga yuklab, sinash"
      - "Juice Shop'ni production'ning yoniga qo'yish"
    answer: 1
    explain: "Juice Shop ataylab zaif, shuning uchun uni ochiq tarmoqqa yoki production yoniga qo'ymang. Real ma'lumot ham kerak emas. Mashq muhiti izolyatsiyalangan va butunlay sizniki bo'lishi shart."
  - q: "Probe kodida `expect(res.status === 404 || res.status === 403)` o'rniga `expect(res.status !== 200)` yozildi. Bu nima uchun xavfli?"
    options:
      - "Xavfsiz: farq yo'q"
      - "500 yoki 401 kabi noto'g'ri kodlar ham 'o'tdi' hisoblanadi va haqiqiy nuqson yashirinadi"
      - "Test hech qachon o'tmaydi"
      - "Faqat HTTP/2'da ishlamaydi"
    answer: 1
    explain: "Aniq kutilgan natijani tekshirmaydigan probe ilova crash bo'lganda ham yashil bo'ladi. Xavfsizlik testi 'nima bo'lmasligi kerak' va 'nima bo'lishi kerak' ikkalasini ham aniq yozadi."
task:
  title: "Javob auditi: header va cookie nuqsonlarini topish"
  prompt: |
    Quyidagi `auditResponse(res)` javob sarlavhalarini tekshiradi, lekin faqat `x-content-type-options` ni biladi. Uni kengaytiring. Funksiya topilmalar ro'yxatini (satrlar massivi) qaytaradi, har javob uchun:

    1. `x-content-type-options` `nosniff` bo'lmasa: `"nosniff yo'q"`.
    2. `strict-transport-security` yo'q bo'lsa: `"HSTS yo'q"`.
    3. `x-powered-by` bor bo'lsa: `"texnologiya header'i oshkor"`.
    4. `set-cookie` bor bo'lsa, undagi har cookie uchun `HttpOnly`, `Secure` va `SameSite` atributlari tekshiriladi; yetishmagani uchun `"cookie: HttpOnly yo'q"`, `"cookie: Secure yo'q"`, `"cookie: SameSite yo'q"` (register muhim emas).

    Header nomlari kichik harfda keladi. Imzoni o'zgartirmang. Oxirgi uchta `console.log` kutilgan sonlarni chiqarsin: 0, 6, 2.
  lang: ts
  starter: |
    type Res = { status: number; headers: Record<string, string | string[]> };

    function auditResponse(res: Res): string[] {
      const findings: string[] = [];
      if (res.headers["x-content-type-options"] !== "nosniff") findings.push("nosniff yo'q");
      return findings;
    }

    const good: Res = {
      status: 200,
      headers: {
        "x-content-type-options": "nosniff",
        "strict-transport-security": "max-age=31536000",
        "set-cookie": ["sid=1; HttpOnly; Secure; SameSite=Lax"],
      },
    };
    const weak: Res = {
      status: 200,
      headers: {
        "x-powered-by": "Express",
        "set-cookie": ["sid=1; Path=/"],
      },
    };
    const partial: Res = {
      status: 200,
      headers: {
        "x-content-type-options": "nosniff",
        "strict-transport-security": "max-age=31536000",
        "set-cookie": ["a=1; HttpOnly; Secure", "b=2; Secure; SameSite=Strict"],
      },
    };
    console.log("good:", auditResponse(good).length);
    console.log("weak:", auditResponse(weak).length);
    console.log("partial:", auditResponse(partial).length);
  solution: |
    type Res = { status: number; headers: Record<string, string | string[]> };

    function auditResponse(res: Res): string[] {
      const findings: string[] = [];
      const h = res.headers;
      if (h["x-content-type-options"] !== "nosniff") findings.push("nosniff yo'q");
      if (!h["strict-transport-security"]) findings.push("HSTS yo'q");
      if (h["x-powered-by"]) findings.push("texnologiya header'i oshkor");
      const raw = h["set-cookie"];
      const cookies = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
      for (const c of cookies) {
        const lc = c.toLowerCase();
        if (!lc.includes("httponly")) findings.push("cookie: HttpOnly yo'q");
        if (!/;\s*secure/.test(lc)) findings.push("cookie: Secure yo'q");
        if (!lc.includes("samesite=")) findings.push("cookie: SameSite yo'q");
      }
      return findings;
    }

    const good: Res = {
      status: 200,
      headers: {
        "x-content-type-options": "nosniff",
        "strict-transport-security": "max-age=31536000",
        "set-cookie": ["sid=1; HttpOnly; Secure; SameSite=Lax"],
      },
    };
    const weak: Res = {
      status: 200,
      headers: {
        "x-powered-by": "Express",
        "set-cookie": ["sid=1; Path=/"],
      },
    };
    const partial: Res = {
      status: 200,
      headers: {
        "x-content-type-options": "nosniff",
        "strict-transport-security": "max-age=31536000",
        "set-cookie": ["a=1; HttpOnly; Secure", "b=2; Secure; SameSite=Strict"],
      },
    };
    console.log("good:", auditResponse(good).length);
    console.log("weak:", auditResponse(weak).length);
    console.log("partial:", auditResponse(partial).length);
  solutionNotes: |
    - `set-cookie` massiv yoki satr bo'lishi mumkin; ikkala shakl `cookies` massiviga keltiriladi. Aks holda ikkinchi cookie tekshirilmay qoladi.
    - Atributlar kichik harfga keltirilgan matn bo'yicha tekshiriladi, chunki cookie atribut nomlari registrga bog'liq emas (13-dars). `Secure` uchun `;` dan keyingi so'z qidiriladi, shunda `insecure=1` kabi nom noto'g'ri mos kelmaydi.
    - Audit faqat belgilarni ko'radi: header bor, lekin qiymati to'g'ri sozlanganmi (masalan HSTS `max-age` yetarlimi, 16-dars), bu yerda tekshirilmaydi.
    - Bunday audit haqiqiy xavfsizlik testi emas, tez tekshiruv: avtorizatsiya, session va biznes mantiq nuqsonlarini u topmaydi.
  checklist:
    - "`good` javob uchun topilma yo'q (0)"
    - "`weak` javob uchun HSTS, nosniff, texnologiya header'i va cookie atributlari topiladi"
    - "Ikkita cookie'li javobda har cookie alohida tekshiriladi"
    - "Imzo o'zgarmagan, funksiya xato tashlamaydi"
    - "Auditning nimani tekshirmasligini ayta olasiz"
---

## Muammo

Ko'p jamoada xavfsizlik sinovi hodisa: yiliga bir marta tashqi pentest, yoki release oldidan bir martalik skaner. Ilova esa har hafta o'zgaradi. Pentest hisoboti olingan kuni yangi endpoint, yangi rol yoki yangi integratsiya qo'shiladi va hisobot eskiradi. Ikkinchi og'riq: sinovning qamrovi aniq emas. "Pentest o'tdi" degan gap qaysi endpoint, qaysi rol va qaysi tenant bilan sinalganini aytmasa, qancha ishonch berishi noma'lum.

Uchinchi muammo: dasturchi o'z ilovasini sinashga "hujumchi ko'zi bilan" qarashni bilmaydi va qayerdan boshlashni topolmaydi. OWASP Web Security Testing Guide (WSTG) aynan shu bo'shliq uchun: u sinov toifalari va har toifada nimani tekshirishni tizimlashtiradi. Bu dars WSTG'ni reja sifatida qanday ishlatishni, sinovni kodga aylantirishni va tuzatilgan narsa qaytib kelmasligi uchun regression test yozishni ko'rsatadi.

Bu dars faqat o'zingiz boshqaradigan ilova va muhitni sinash haqida. Boshqa birovning tizimini ruxsatsiz sinash qonuniy va etik chegaradan chiqadi (9-dars).

## Asosiy g'oya

### WSTG sinovni toifalarga bo'ladi

WSTG repozitoriyasining 4-bo'limi (Web Application Security Testing) toifalar ro'yxatidan iborat: 4.1 Information Gathering, 4.2 Configuration and Deployment Management, 4.3 Identity Management, 4.4 Authentication, 4.5 Authorization, 4.6 Session Management, 4.7 Injection, 4.8 Error Handling, 4.9 Weak Cryptography, 4.10 Business Logic, 4.11 Client-side, 4.12 API Testing va 4.13 WebAssembly Testing. Bu repozitoriyning master tarmog'idagi tarkib (2026-11-11 da o'qilgan); hujjat yangilanib turadi, shuning uchun hisobotda qaysi WSTG tarmog'i yoki versiyasiga tayanganingizni yozing.

Bu ro'yxat kursning modullariga yaxshi mos tushadi: Authentication (5-modul), Authorization (6-modul), Injection (3-modul), Client-side (4-modul), API Testing (8-modul). Demak sinov rejasini tuzish uchun har toifa bo'yicha "bizda bu nimaga tegishli va qanday tekshirish mumkin" degan savolga javob topiladi.

### Sinov qatlamlari

WSTG Testing Framework matni sinovni bosqichlarga ajratadi va ularni CI/CD ga qo'shishni tavsiya qiladi. Matnga ko'ra build vaqtida SAST, SCA va secret scanning ishlaydi, staging muhitida DAST va IaC hamda container image skanerlash, release oldidan esa xavfsizlik tasdig'i va deployni to'xtatish chegaralari belgilanadi. Dinamik sinov bo'limida DAST asboblari (ZAP, Burp Suite) ilovani aylanib chiqadi va fuzz qiladi, qo'lda pentest esa ekspluatatsiya qilish mumkinligini va biznes mantiqni tekshiradi. Bu faoliyatlar staging yoki production'ga qarshi bo'lishi, ichki jamoa, tashqi maslahatchi yoki bug bounty tomonidan bajarilishi mumkinligi ham aytilgan.

Amaliy xulosa: sinov bitta voqea emas, qatlamli jarayon. Kod ko'rish (91-dars) va SAST nuqsonni ish vaqtidan oldin topadi, DAST va fuzzing (84-dars) ishlayotgan tizimdagi sozlama va oqimlarni tekshiradi, qo'lda sinov esa avtomat topolmaydigan mantiq va avtorizatsiya nuqsonlariga qaratiladi.

### Qamrovni ASVS bilan belgilash

WSTG "qanday sinash" ni aytadi, ASVS esa "nimani sinash kerak" (qaysi talab bajarilishi kerak) ni. ASVS 5.0.0 talablari V1 dan V17 gacha bo'limlarga bo'lingan va uch darajaga ajratilgan: L1 talablarning qariyb 20 foizi, L2 qariyb 50 foizi. Standart darajani tashkilot o'z riskidan kelib chiqib tanlashini yozadi. Shuning uchun test rejasi shunday boshlanadi: qaysi ASVS darajasiga intilamiz, shu daraja talablaridan qaysilarini WSTG toifasi sinab ko'radi, va nima qamrovdan tashqarida (masalan, "WebRTC bizda yo'q"). Qamrovdan tashqari narsani yozib qo'yish sinovning halol chegarasini beradi.

## Chuqurroq: sinovni kodga aylantirish

### Avtorizatsiya matritsasi

Authorization toifasi eng ko'p qimmat nuqson topadigan joy va u eng yomon avtomatlashtirilgan. Skaner "kim nimani ko'rishi kerak" ni bilmaydi. Yechim: matritsa. Qatorlar rollar va tenant'lar, ustunlar endpoint'lar, katakda kutilgan natija. Matritsa kodda yoziladi va har release'da ishlaydi. Har katak uchun aniq kutilgan status tekshiriladi: begona obyekt uchun 404 yoki 403, tokensiz so'rov uchun 401, oddiy foydalanuvchining admin funksiyasi uchun 403. "200 emas" kabi bo'sh shart ishlatmang: 500 ham "200 emas".

### Probe: kirish, kutilgan natija, toifa

Har sinov (probe) uch narsadan iborat: so'rov, kutilgan natija va WSTG toifasi. Toifa hisobotda topilmani aniq joylashtiradi. Sinov destruktiv bo'lmasligi kerak: o'qish so'rovlari va o'zingiz yaratgan test ma'lumoti. Yozish va o'chirish sinovlari faqat alohida test tenant'ida o'tkaziladi.

### Ruxsat va chegara

Sinashdan oldin qamrov (qaysi muhit, qaysi tenant, qaysi vaqtda), ruxsat (kim yozma ruxsat bergan) va aloqa kanali (nimadir buzilsa kimga xabar beriladi) belgilanadi. Production'ga qarshi sinovlar eng ehtiyotkor bo'lishi kerak: avval staging. Real mijoz ma'lumoti sinovga ishlatilmaydi. Agar sinov davomida kutilmagan ma'lumotga duch kelsangiz, uni saqlamang va ko'chirmang, jamoaga xabar bering. Huquqiy tafsilotlar 9-darsda.

### Topilmani regression test'ga aylantiring

Qo'lda topilgan nuqson tuzatilgach, o'sha hujum kirishi avtomatik testga aylantiriladi. Aks holda kelajakdagi refaktoring uni qaytaradi. Test tuzatish PR'iga qo'shiladi va CI'da ishlaydi. Shu tarzda topilmalar bazasi ishchi himoyaga aylanadi.

## Misol: probe matritsasi

Misol faqat o'quv modelimizga qarshi: `app` funksiyasi HTTP serverining soddalashtirilgan ko'rinishi (so'rov oladi, javob qaytaradi). Probe majmuasi shu funksiyaga qarshi ishlaydi, hech qaysi real tizimga emas.

### 1. Zaif kod

```ts run
type User = { id: string; tenant: string; role: "user" | "admin" };
type Req = { path: string; user?: User };
type Res = { status: number; headers: Record<string, string>; body: unknown };
const vehicles = [{ id: "v1", tenant: "alfa" }, { id: "v2", tenant: "beta" }];

// ZAIF: autentifikatsiya yo'q, tenant tekshirilmaydi, rol tekshirilmaydi,
// xato matni mijozga qaytadi, himoya header'lari yo'q
function app(req: Req): Res {
  try {
    const m = req.path.match(/^\/vehicles\/(\w+)$/);
    if (m) {
      const v = vehicles.find((x) => x.id === m[1]);
      return v ? { status: 200, headers: {}, body: v } : { status: 404, headers: {}, body: null };
    }
    if (req.path === "/admin/users") return { status: 200, headers: {}, body: ["u1", "u2"] };
    if (req.path === "/crash") throw new Error("connect failed: password=hunter2@db.internal");
    return { status: 404, headers: {}, body: null };
  } catch (e) {
    return { status: 500, headers: {}, body: { error: (e as Error).message } };
  }
}

const alfa: User = { id: "u1", tenant: "alfa", role: "user" };
const probes: { cat: string; name: string; run: () => boolean }[] = [
  { cat: "4.4", name: "tokensiz so'rov 401 oladi", run: () => app({ path: "/vehicles/v1" }).status === 401 },
  { cat: "4.5", name: "begona tenant mashinasi 404/403", run: () => [403, 404].includes(app({ path: "/vehicles/v2", user: alfa }).status) },
  { cat: "4.5", name: "oddiy user admin funksiyasiga 403 oladi", run: () => app({ path: "/admin/users", user: alfa }).status === 403 },
  { cat: "4.8", name: "xato javobida ichki matn yo'q", run: () => !JSON.stringify(app({ path: "/crash", user: alfa }).body).includes("password") },
  { cat: "4.2", name: "nosniff header bor", run: () => app({ path: "/vehicles/v1", user: alfa }).headers["x-content-type-options"] === "nosniff" },
];
for (const p of probes) console.log(`${p.run() ? "PASS" : "FAIL"} [${p.cat}] ${p.name}`);
```

### 2. Hujum

Bu yerda "hujum" probe majmuasining o'zi: u hujumchi ko'zi bilan to'rtta oddiy so'rovni yuboradi (tokensiz, begona identifikator bilan, admin yo'liga oddiy foydalanuvchi sifatida, xatoni chaqirib). Zaif ilovada natija:

```text
FAIL [4.4] tokensiz so'rov 401 oladi
FAIL [4.5] begona tenant mashinasi 404/403
FAIL [4.5] oddiy user admin funksiyasiga 403 oladi
FAIL [4.8] xato javobida ichki matn yo'q
FAIL [4.2] nosniff header bor
```

Beshta probe'ning beshtasi ham yiqildi. Har qator bitta WSTG toifasiga tegishli: tokensiz kirish (Authentication), begona mashina va admin yo'li (Authorization), xato matnida parol (Error Handling) va header yo'qligi (Configuration). `/crash` javobida parol bo'lagi ko'rinishi 4.8 toifasidagi sizish: real ilovada bu ma'lumotlar bazasi manzili yoki so'rov matni bo'lishi mumkin.

### 3. Tuzatilgan kod

```ts run
type User = { id: string; tenant: string; role: "user" | "admin" };
type Req = { path: string; user?: User };
type Res = { status: number; headers: Record<string, string>; body: unknown };
const vehicles = [{ id: "v1", tenant: "alfa" }, { id: "v2", tenant: "beta" }];
const SAFE = { "x-content-type-options": "nosniff", "cache-control": "no-store" };

function app(req: Req): Res {
  try {
    if (!req.user) return { status: 401, headers: SAFE, body: { error: "unauthorized" } };
    const m = req.path.match(/^\/vehicles\/(\w+)$/);
    if (m) {
      const v = vehicles.find((x) => x.id === m[1] && x.tenant === req.user!.tenant);
      return v ? { status: 200, headers: SAFE, body: v } : { status: 404, headers: SAFE, body: null };
    }
    if (req.path === "/admin/users") {
      if (req.user.role !== "admin") return { status: 403, headers: SAFE, body: { error: "forbidden" } };
      return { status: 200, headers: SAFE, body: ["u1", "u2"] };
    }
    if (req.path === "/crash") throw new Error("connect failed: password=hunter2@db.internal");
    return { status: 404, headers: SAFE, body: null };
  } catch {
    return { status: 500, headers: SAFE, body: { error: "internal_error" } }; // tafsilot logga, mijozga emas
  }
}

const alfa: User = { id: "u1", tenant: "alfa", role: "user" };
const probes: { cat: string; name: string; run: () => boolean }[] = [
  { cat: "4.4", name: "tokensiz so'rov 401 oladi", run: () => app({ path: "/vehicles/v1" }).status === 401 },
  { cat: "4.5", name: "begona tenant mashinasi 404/403", run: () => [403, 404].includes(app({ path: "/vehicles/v2", user: alfa }).status) },
  { cat: "4.5", name: "oddiy user admin funksiyasiga 403 oladi", run: () => app({ path: "/admin/users", user: alfa }).status === 403 },
  { cat: "4.8", name: "xato javobida ichki matn yo'q", run: () => !JSON.stringify(app({ path: "/crash", user: alfa }).body).includes("password") },
  { cat: "4.2", name: "nosniff header bor", run: () => app({ path: "/vehicles/v1", user: alfa }).headers["x-content-type-options"] === "nosniff" },
  { cat: "4.5", name: "o'z mashinasi ishlaydi (regressiya)", run: () => app({ path: "/vehicles/v1", user: alfa }).status === 200 },
];
for (const p of probes) console.log(`${p.run() ? "PASS" : "FAIL"} [${p.cat}] ${p.name}`);
```

```text
PASS [4.4] tokensiz so'rov 401 oladi
PASS [4.5] begona tenant mashinasi 404/403
PASS [4.5] oddiy user admin funksiyasiga 403 oladi
PASS [4.8] xato javobida ichki matn yo'q
PASS [4.2] nosniff header bor
PASS [4.5] o'z mashinasi ishlaydi (regressiya)
```

Tuzatish nima uchun yetarli: har probe aniq kutilgan natijaga o'tdi; tenant sharti obyekt qidiruvining ichida turibdi, shuning uchun begona va mavjud bo'lmagan mashina bir xil 404 oladi; xato javobida umumiy kod qaytadi. Oltinchi probe regressiya uchun: tuzatish haqiqiy foydalanuvchini bloklamasligini tekshiradi. Yopilmagan narsa: probe'lar faqat beshta xatti-harakatni tekshiradi, ya'ni bu ilovaning to'liq xavfsizligi emas; HSTS va CSP kabi header'lar (15 va 16-darslar), session va rate limit (73-dars) yo'q; `x.tenant === req.user.tenant` ning to'g'riligi `req.user` ni to'g'ri aniqlashga bog'liq.

### Mashq: javob auditi

Quyidagi funksiya javob sarlavhalarida faqat `nosniff` ni tekshiradi. Uni kengaytiring: HSTS, texnologiya header'i va cookie atributlarini ham tekshirsin.

```ts run
type Res = { status: number; headers: Record<string, string | string[]> };

function auditResponse(res: Res): string[] {
  const findings: string[] = [];
  if (res.headers["x-content-type-options"] !== "nosniff") findings.push("nosniff yo'q");
  return findings;
}
```

```ts test
const ok = { "x-content-type-options": "nosniff", "strict-transport-security": "max-age=31536000" };
check("to'g'ri javob toza", () => auditResponse({ status: 200, headers: ok }).length === 0);
check("HSTS yo'qligi topiladi", () => auditResponse({ status: 200, headers: { "x-content-type-options": "nosniff" } }).includes("HSTS yo'q"));
check("x-powered-by topiladi", () => auditResponse({ status: 200, headers: { ...ok, "x-powered-by": "Express" } }).includes("texnologiya header'i oshkor"));
check("cookie HttpOnly yo'qligi topiladi", () => auditResponse({ status: 200, headers: { ...ok, "set-cookie": ["a=1; Secure; SameSite=Lax"] } }).includes("cookie: HttpOnly yo'q"));
check("har cookie alohida tekshiriladi", () => auditResponse({ status: 200, headers: { ...ok, "set-cookie": ["a=1; HttpOnly; Secure; SameSite=Lax", "b=2"] } }).length === 3);
check("to'g'ri cookie topilma bermaydi", () => auditResponse({ status: 200, headers: { ...ok, "set-cookie": "a=1; HttpOnly; Secure; SameSite=Lax" } }).length === 0);
```

## Qachon qo'llamaslik kerak

To'liq WSTG qamrovi har loyiha uchun kerak emas: ichki, kam ahamiyatli utilita uchun uch-to'rt toifa (Authentication, Authorization, Injection, Configuration) yetarli bo'lishi mumkin. Sinov narxi riskka mos bo'lishi kerak va qamrovdan tashqarisi yozilishi kerak.

Production'ga qarshi avtomatik skaner (agressiv fuzzing) ehtiyotsiz ishlatilsa, mavjudlikka zarar qiladi: ma'lumot yaratadi, rate limit'ni qo'zg'atadi, hatto bildirishnomalar yuboradi. Birinchi navbatda staging va alohida test tenant'i. Ruxsat bo'lmagan tizimni, jumladan hamkor yoki mijoz tizimini, "faqat ko'rib qo'yish" uchun sinab ko'rmang.

Avtomatik probe'lar xavfsizlikka yolg'on ishonch ham berishi mumkin: ularning hammasi o'tishi ilova xavfsiz degani emas, faqat shu tekshiruvlar o'tdi degani. Yangi turdagi nuqsonni probe oldindan bilmaydi. Shuning uchun qo'lda sinovni ham jadvalga kiriting.

Va nihoyat, sinovdan chiqqan topilmalar tuzatilmasa, sinov faqat hisobot yaratadi. Topilmalarni backlog'ga ustuvorlik bilan kiriting (90-dars) va tuzatish muddatini belgilang.

## Stack'da: NestJS, Next.js va CI

NestJS'da probe majmuasi `supertest` va Jest/Vitest bilan e2e test sifatida yoziladi: har rol uchun JWT yoki session yaratiladi, matritsa jadvali `it.each` bilan aylanadi. Next.js'da Playwright test serveri bilan ham route handler, ham server action oqimlari sinaladi. CI'da bu testlar har PR'da, DAST (masalan ZAP) esa staging'ga deploydan keyin ishga tushadi. Quyidagi parcha matritsa testining shakli (ishga tushirilmaydi: NestJS, supertest va Jest brauzer worker'ida yo'q; sintaksis tekshirilgan):

```ts
import request from "supertest";

declare const app: any;
declare function tokenFor(user: string): string;

const matrix: [string, string, string, number][] = [
  // [kim, metod, yo'l, kutilgan status]
  ["alfa-user", "GET", "/vehicles/v1", 200],
  ["alfa-user", "GET", "/vehicles/v2", 404], // begona tenant
  ["alfa-user", "GET", "/admin/users", 403],
  ["anonymous", "GET", "/vehicles/v1", 401],
];

describe("authorization matrix", () => {
  it.each(matrix)("%s %s %s -> %i", async (who, method, path, status) => {
    const req = (request(app.getHttpServer()) as any)[method.toLowerCase()](path);
    if (who !== "anonymous") req.set("Authorization", `Bearer ${tokenFor(who)}`);
    await req.expect(status);
  });
});
```

Mashq uchun Juice Shop (Node.js, Express va Angular'da yozilgan ataylab zaif ilova) loyiha sahifasiga ko'ra o'quv, CTF va xavfsizlik asboblarini sinash uchun mo'ljallangan; uning topshiriqlari score board orqali kuzatiladi. Uni faqat izolyatsiyalangan lokal muhitda ishga tushiring, ishga tushirish ko'rsatmasi loyiha README'sida.

## Xulosa

- Sinovni hodisa emas, jarayon qiling: build'da SAST/SCA/secret scanning, staging'da DAST, release oldidan chegara, qo'lda sinov esa mantiq va avtorizatsiya uchun.
- WSTG toifalari (4.1-4.13) rejaning skeleti, ASVS esa qamrov va darajani belgilaydi. Qamrovdan tashqarini yozing.
- Avtorizatsiyani matritsa bilan kodda sinang va aniq kutilgan status yozing; "200 emas" kabi shartlar yolg'on yashil beradi.
- Sinovdan oldin qamrov, ruxsat va aloqa kanalini belgilang; real ma'lumot va ruxsatsiz tizimlardan uzoq turing.
- Har topilmani regression test'ga aylantiring: tuzatish PR'iga hujum kirishi bilan test qo'shiladi.
- Juice Shop kabi ataylab zaif ilovada mashq qiling, faqat izolyatsiyalangan muhitda.
