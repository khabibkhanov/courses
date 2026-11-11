---
n: 100
slug: capstone
title: "Capstone: zaif servisni mustahkamlash"
summary: "Kursning yakuniy darsi: bitta kichik servisda bir nechta moduldan kelgan nuqsonlarni topish, tuzatish va tuzatishni tekshiruv bilan mustahkamlash. Hisobot tuzilishi, ustuvorlik, rivojlanish yo'li (SSDF va SAMM bilan xaritalash) va keyingi qadamlar."
duration: 55
sources:
  - id: asvs
    note: "ASVS 5.0.0 (lokal korpus): talablar bo'limlar bo'yicha tuzilgan; daraja (L1, L2, L3) tashkilot riskiga qarab tanlanadi; verifikatsiya hisoboti qamrov, tekshirilgan talablar, istisnolar va hal qilish yo'riqnomasini o'z ichiga oladi (99-dars bilan bir xil bo'lim)"
  - id: nist-ssdf
    note: "NIST SP 800-218 (SSDF) v1.1: xavfsiz dasturiy ta'minot ishlab chiqish amaliyotlari to'plami; to'rt guruh: tashkilotni tayyorlash, dasturni himoya qilish, himoyalangan dastur ishlab chiqarish, zaifliklarga javob berish. Bu manba lokal korpusda yo'q, shuning uchun faqat umumiy tuzilma keltiriladi va tekshirilmagan deb belgilanadi"
  - id: samm
    note: "OWASP SAMM: yetuklik modeli; beshta biznes funksiya (Governance, Design, Implementation, Verification, Operations) va har funksiya amaliyotlari yetuklik darajalariga ega. Bu manba lokal korpusda yo'q, shuning uchun faqat umumiy tuzilma keltiriladi va tekshirilmagan deb belgilanadi"
quiz:
  - q: "Capstone'da servis to'rtta nuqsonni tuzatgandan keyin barcha probe'lar o'tdi. Keyingi eng to'g'ri qadam qaysi?"
    options:
      - "Ishni tugatilgan deb e'lon qilish"
      - "Probe'larni o'chirish, chunki ular o'tdi"
      - "Faqat kodni qayta formatlash"
      - "Probe'larni CI'ga qo'shish, qoldiq riskni yozish va tuzatilmagan sohalarni (qamrovdan tashqarisini) hisobotda ko'rsatish"
    answer: 3
    explain: "Probe'lar o'tishi faqat tekshirilgan xatti-harakatlar haqida gapiradi. Ularni CI'ga qo'yish regressiyani ushlaydi, qoldiq risk va qamrovdan tashqarisi esa hisobotning halol qismi (99-dars)."
  - q: "`ORDER BY` ustuniga foydalanuvchi qiymati to'g'ridan-to'g'ri qo'shilgan. Parametrlangan so'rov (placeholder) nega bu yerda yetarli emas?"
    options:
      - "Placeholder qiymatni himoya qiladi, ammo identifikatorni (ustun nomi, tartib yo'nalishi) emas; identifikatorlar allowlist orqali tanlanadi"
      - "Placeholder faqat raqamlar uchun ishlaydi"
      - "Placeholder sekin"
      - "Yetarli, muammo yo'q"
    answer: 0
    explain: "SQL placeholder'lari qiymatlar uchun mo'ljallangan. Ustun nomi, jadval yoki yo'nalish so'rov tuzilishining bir qismi, ularni ruxsat etilgan ro'yxatdan kodning o'zi tanlashi kerak (91-dars)."
  - q: "Hisobotdagi topilma: 'path traversal, fayl nomi tekshirilmaydi'. Eng ishonchli tuzatish qaysi?"
    options:
      - "Nomdagi `..` ni bo'sh satr bilan almashtirish"
      - "Faqat kichik harflarga o'tkazish"
      - "Foydalanuvchi qiymatini yo'l qurishda umuman ishlatmaslik yoki faqat qat'iy allowlist (regex yoki ma'lum ro'yxat) orqali o'tkazish"
      - "Xatoni foydalanuvchiga ko'rsatish"
    answer: 2
    explain: "`..` ni olib tashlash usullari (masalan `....//` kabi qayta qurilishlar) o'tib ketadi. Allowlist esa ruxsat etilganni belgilaydi va qolganini rad etadi: fail-safe default."
  - q: "Log yozuvida parol maydoni ochiq turibdi. Qaysi yondashuv to'g'ri?"
    options:
      - "Logni faqat adminlarga ko'rsatish"
      - "Logga yozishdan oldin maxfiy maydonlarni (password, token, authorization) redaksiya qilish; logda ular hech qachon bo'lmasligi kerak"
      - "Logni o'chirish"
      - "Parolni base64 ga o'tkazib yozish"
    answer: 1
    explain: "Log ko'pincha ko'p odam va tizimga yetadi (agregator, backup). Maxfiy qiymat logga umuman tushmasligi kerak; base64 shifrlash emas."
  - q: "SSDF va SAMM bilan ishlashda to'g'ri munosabat qaysi?"
    options:
      - "Ular sertifikat: olsangiz, ilova xavfsiz"
      - "Faqat katta kompaniyalar uchun"
      - "Kod yozishning o'rnini bosadi"
      - "Ular mavjud amaliyotlaringiz xaritasi va yaxshilash yo'nalishi: qaysi sohalarda yetuk, qaysilarida bo'shliq borligini ko'rsatadi"
    answer: 3
    explain: "Bular jarayon va yetuklik doiralari. Ular nima qilish kerakligini yo'naltiradi, lekin xavfsizlikni kafolatlamaydi; haqiqiy dalil baribir tekshiruvlar va ishlaydigan nazoratlar."
  - q: "Capstone tugadi. Jamoa keyingi chorakda nimaga e'tibor qaratsa eng samarali?"
    options:
      - "Yangi nuqsonlarni qidirmaslik"
      - "Faqat eng yangi asbobni sotib olish"
      - "Topilmalar toifasi bo'yicha takrorlanishni tahlil qilish va ildiz sababni (jarayon, kutubxona, shablon) tuzatish: nuqson sinfini yo'qotish"
      - "Hamma kodni qayta yozish"
    answer: 2
    explain: "Bitta nuqsonni tuzatish bir marta ishlaydi. Sinfni yo'qotish (xavfsiz default'li yordamchi funksiya, yaxshi shablon, CI qoidasi) takrorlanishni to'xtatadi."
task:
  title: "Fayl nomini xavfsiz birlashtirish (safeJoin)"
  prompt: |
    `safeJoin(base, name)` hisobotlar katalogi ichidagi faylga yo'l qaytarishi kerak. Hozir u ikki qiymatni oddiy birlashtiradi va `../` orqali katalogdan chiqib ketadi.

    Talablar: `name` `/` yoki `\` bo'yicha bo'laklarga bo'linadi; bo'sh bo'lak, `.`, `..`, NUL belgisi (`\0`) bo'lsa yoki `name` mutlaq yo'l bo'lsa (`/` bilan boshlansa), `RangeError` tashlanadi. Aks holda `base + "/" + bo'laklar` qaytariladi. Imzoni o'zgartirmang. Oxirgi qatorlar kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    function safeJoin(base: string, name: string): string {
      return base + "/" + name;
    }

    function attempt(name: string): string {
      try {
        return safeJoin("reports", name);
      } catch (e) {
        return (e as Error).name;
      }
    }
    for (const n of ["q1.csv", "sub/q2.csv", "../secrets/key.txt", "a\\..\\b", "/etc/passwd", "a//b", "x\0y"]) {
      console.log(JSON.stringify(n), "->", attempt(n));
    }
  solution: |
    function safeJoin(base: string, name: string): string {
      if (name.startsWith("/") || name.includes("\0")) throw new RangeError("noto'g'ri nom");
      const parts = name.split(/[\\/]/);
      for (const p of parts) {
        if (p === "" || p === "." || p === "..") throw new RangeError("noto'g'ri nom");
      }
      return base + "/" + parts.join("/");
    }

    function attempt(name: string): string {
      try {
        return safeJoin("reports", name);
      } catch (e) {
        return (e as Error).name;
      }
    }
    for (const n of ["q1.csv", "sub/q2.csv", "../secrets/key.txt", "a\\..\\b", "/etc/passwd", "a//b", "x\0y"]) {
      console.log(JSON.stringify(n), "->", attempt(n));
    }
  solutionNotes: |
    - Tekshiruv bo'laklar bo'yicha qilinadi, shuning uchun `a/../b` va `a\..\b` ikkalasi ham rad etiladi; `..` ni qirqish ishlatilmaydi.
    - NUL belgisi va mutlaq yo'l alohida holat sifatida rad etiladi.
    - Qoldiq risk: bu funksiya faqat satr darajasida ishlaydi. Fayl tizimida symlink'lar, katta-kichik harf va Unicode normalizatsiya alohida masala; real kodda yo'l hal qilingandan keyin ham asosiy katalog ichida ekani tekshiriladi, yoki foydalanuvchi qiymati o'rniga allowlist ishlatiladi (bu darsdagi tuzatilgan kod kabi).
  checklist:
    - "Oddiy nom va ichki katalogli nom o'tadi"
    - "`..` bo'lagi, mutlaq yo'l, bo'sh bo'lak va NUL rad etiladi"
    - "`\\` ajratuvchisi ham tekshiriladi"
    - "Xato turi `RangeError`"
    - "Qoldiq riskni (symlink, Unicode) ayta olasiz"
---

## Muammo

Yuz dars davomida har xavf alohida o'rganildi: injection, authorization, kriptografiya, supply chain, hodisaga javob. Real loyihada esa ular alohida kelmaydi. Bitta kichik servis ichida bitta yo'l tekshirilmaydi, bitta so'rovda identifikator ulanadi, log parolni saqlaydi, CORS sozlamasi hammaga ochiq. Har biri o'z darsida tanish, lekin birgalikda ko'rilganda qiyinlik boshqacha: qaysi birini birinchi tuzatish, tuzatishni qanday tasdiqlash, hisobotni kimga va qanday yozish.

Capstone shu uchun. Bu yangi mavzu emas, o'rganilganlarni bitta ishda qo'llash: kichik zaif servisni ko'ring, topilmalarni yozing, tuzating, tuzatishni tekshiruv bilan mustahkamlang va qolgan riskni halol ayting. Bu darsdagi barcha kod o'quv modeli; hech qaysi real tizimga tegishli emas va hujum faqat shu darsning o'z kodiga qaratilgan.

## Asosiy g'oya

### Ish tartibi

Capstone ishi uch bosqichli takrorlanuvchi sikl, 91, 92 va 99-darslardagi usullarning davomi. Birinchi bosqich: servisni o'qing (kod ko'rish) va har endpoint uchun besh savol bering: kim chaqiradi, qaysi obyektga tegadi, qanday kirish oladi, qayerga boradi, nima qaytaradi. Ikkinchi bosqich: har shubha uchun kichik probe yozing; probe yiqilsa, topilma tasdiqlangan. Uchinchi bosqich: tuzating, probe o'tishini va regressiya probe'lari buzilmaganini tekshiring.

### Ustuvorlik va kamchilikka tayyor bo'lish

Hammasini bir kunda tuzatib bo'lmaydi va shart ham emas. 99-darsdagi ishchi formula (ekspluatatsiya osonligi, nazorat yetishmasligi, ta'sir, tuzatish narxi) bu yerda ham ishlaydi, lekin ikki qoida qo'shiladi. Birinchi: tuzatish bir qatorli bo'lsa va ta'siri yuqori bo'lsa, muhokama qilmasdan qiling. Ikkinchi: tuzatilmay qoladigan narsa hisobotda egasi va muddati bilan yozilsin. Yozilmagan risk unutilgan risk.

### Natija: dalil bilan hisobot

Capstone natijasi tuzatilgan kod emas, balki kod, probe majmuasi va hisobot uchligi. Kod nimani o'zgartirganingizni, probe majmuasi uning ishlashini, hisobot esa qamrovni va qoldiqni ko'rsatadi. 99-darsdagi hisobot skeleti (qamrov, metodika, topilmalar, tekshirilgan sohalar, qo'llanilmaydigan talablar, qayta tekshiruv) shu yerda ham ishlatiladi.

## Chuqurroq: nuqson sinflari va jarayon

### Namuna emas, sinf

Capstone'dagi to'rt nuqson tasodifan tanlanmagan; ular butun kurs uchun tipik to'rt sinf. Foydalanuvchi qiymati fayl yo'liga tushadi (path traversal, kirish validatsiyasi). Foydalanuvchi qiymati so'rov tuzilishiga tushadi (identifikator injection'i, placeholder bu yerda yordam bermaydi). Maxfiy qiymat logga tushadi (ma'lumot sizishi). Brauzer ishonchi keng ochiladi (CORS). Har sinf uchun tuzatish naqshi bir xil: foydalanuvchi qiymatini xavfli joyga hech qachon to'g'ridan-to'g'ri qo'ymaslik, qiymat tanlanadigan joyda allowlist, xato bo'lsa rad etish (fail-safe default).

### Tuzatishni mustahkamlash

Tuzatish ikki bosqichli bo'lishi kerak. Birinchi: nuqson yopiladi. Ikkinchi: shu sinfning takrorlanishiga qarshi nazorat qo'yiladi. Masalan, fayl nomini tekshiruvchi yordamchi funksiyani har joyda ishlatish va uni probe majmuasiga qo'shish; yoki logger'ni yagona joyda sozlab, maxfiy kalitlarni markaziy ro'yxat bo'yicha redaksiya qilish. Aks holda ertaga yangi endpoint yana shu xatoni qaytaradi.

### Tartib: nimadan boshlash

To'rt topilma bir xil og'irlikda emas va bir xil narxda ham emas. Fayl nomi allowlist'i va identifikator allowlist'i bir necha qator kod; CORS ro'yxati bitta konfiguratsiya o'zgarishi; log redaksiyasi esa logger'ni yagona joyda sozlashni talab qiladi, shuning uchun biroz ko'proq vaqt oladi. Lekin ta'sir bo'yicha tartib boshqacha: fayl o'qish va so'rovga qo'shimcha buyruq kiritish ma'lumot yoki yaxlitlikka bevosita tegadi, log esa sizish yo'li, CORS esa boshqa nazoratlarga (cookie bayroqlari, CSRF himoyasi) bog'liq. Shuning uchun amaliy tartib: avval yo'l va so'rov tuzilishi, ularning ketidan log, oxirida CORS. Tartibni hisobotda ham asoslab yozing: "nima uchun bu birinchi" degan savolga javob bo'lmasa, tartib o'zboshimchalik bo'lib qoladi.

### Qamrov chegarasi

Capstone servisida autentifikatsiya, sessiya, parol saqlash va ma'lumotlar bazasi bor deb faraz qilinmaydi: ular alohida modullarda ko'rilgan. Hisobotda aynan shuni yozing: bu ish to'rt sinfni qamraydi, qolganlari (masalan, 41-46 va 52-55-darslar mavzulari) boshqa tekshiruvlarga qoldirilgan. Bu 99-darsdagi qoida: tekshirilmagan soha "xavfsiz" degani emas, "ko'rilmagan" degani.

### Jarayon doiralari: SSDF va SAMM

Kurs oxirida o'zingizdan so'rang: bitta servis tuzatildi, keyin nima? Bu savol amaliyot darajasidan jarayon darajasiga o'tadi. NIST SSDF xavfsiz dasturiy ta'minot ishlab chiqish amaliyotlarini to'rt guruhga ajratadi: tashkilotni tayyorlash, dasturni himoya qilish, himoyalangan dastur ishlab chiqarish va zaifliklarga javob berish. OWASP SAMM esa beshta biznes funksiya bo'yicha yetuklikni baholaydi: Governance, Design, Implementation, Verification, Operations. Bu ikki manba lokal korpusda tekshirilmagan; faqat umumiy tuzilma keltirilgan. Ularning foydasi qoidada emas, xaritada: ayting, kurs qaysi sohalarni qamraydi (kod ko'rish, sinash, hodisa), qaysilari sizning jamoada yo'q (masalan, rasmiy tahdid modeli yoki dasturchilar o'qitishi), va keyingi chorakda qaysi birini kuchaytirasiz.

## Misol: zaif servis

Servis xotiradagi sodda model. Hisobot fayllari, safar jadvali, so'rov logi va CORS javobi bor; real tarmoq yoki fayl tizimi yo'q.

### 1. Zaif kod

```ts run
type Req = { origin: string; body: Record<string, string> };

const files = new Map<string, string>([
  ["reports/q1.csv", "id,km\n1,120"],
  ["secrets/key.txt", "KEY-DEMO-0001"], // o'quv uchun to'qima qiymat
]);

function normalize(path: string): string {
  const out: string[] = [];
  for (const s of path.split("/")) {
    if (s === "" || s === ".") continue;
    if (s === "..") out.pop();
    else out.push(s);
  }
  return out.join("/");
}

// ZAIF 1: foydalanuvchi nomi yo'lga to'g'ridan-to'g'ri qo'shiladi
function readReport(name: string): string | undefined {
  return files.get(normalize("reports/" + name));
}

// ZAIF 2: ustun nomi so'rovga to'g'ridan-to'g'ri ulanadi
function tripsQuery(sort: string): string {
  return `SELECT id, km FROM trips ORDER BY ${sort}`;
}

// ZAIF 3: butun tana, parol bilan, logga tushadi
function logRequest(req: Req): string {
  return JSON.stringify({ at: "2026-01-01T00:00:00Z", origin: req.origin, body: req.body });
}

// ZAIF 4: har qanday origin aks ettiriladi va credentials ruxsat etiladi
function corsHeaders(origin: string): Record<string, string> {
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Credentials": "true" };
}

console.log("1:", readReport("../secrets/key.txt"));
console.log("2:", tripsQuery("km; DROP TABLE trips"));
console.log("3:", logRequest({ origin: "https://app.example.test", body: { user: "aziz", password: "s3cret-demo" } }));
console.log("4:", JSON.stringify(corsHeaders("https://evil.example.test")));
```

### 2. Hujum

Hujumchi kirishlari to'rttasi ham servisning o'z kodiga qaratilgan: `../secrets/key.txt` nomi, `km; DROP TABLE trips` ustun nomi, oddiy kirish so'rovi (logda ko'rinadigan parol) va begona origin. Natija:

```text
1: KEY-DEMO-0001
2: SELECT id, km FROM trips ORDER BY km; DROP TABLE trips
3: {"at":"2026-01-01T00:00:00Z","origin":"https://app.example.test","body":{"user":"aziz","password":"s3cret-demo"}}
4: {"Access-Control-Allow-Origin":"https://evil.example.test","Access-Control-Allow-Credentials":"true"}
```

Birinchi qatorda `reports` katalogidan tashqaridagi fayl o'qildi. Ikkinchisida so'rovga ikkinchi buyruq qo'shildi; bu o'quv modelida faqat satr, lekin real DB drayverida aynan shu tuzilma xavfli. Uchinchida parol logga yozildi, ya'ni log o'qiy oladigan har kim parolni oladi. To'rtinchida begona sayt cookie bilan so'rov yuborib, javobni o'qiy oladi (brauzer qoidalari bilan, 14-dars).

### 3. Tuzatilgan kod

```ts run
type Req = { origin: string; body: Record<string, string> };

const files = new Map<string, string>([
  ["reports/q1.csv", "id,km\n1,120"],
  ["secrets/key.txt", "KEY-DEMO-0001"],
]);

// 1: allowlist, faqat oddiy .csv nomi
function readReport(name: string): string | undefined {
  if (!/^[a-z0-9_-]+\.csv$/.test(name)) return undefined;
  return files.get("reports/" + name);
}

// 2: identifikatorni kod tanlaydi, foydalanuvchi emas
const SORTABLE = new Map<string, string>([["id", "id"], ["km", "km"]]);
function tripsQuery(sort: string, dir: string): string | undefined {
  const col = SORTABLE.get(sort);
  if (!col) return undefined;
  return `SELECT id, km FROM trips ORDER BY ${col} ${dir === "desc" ? "DESC" : "ASC"}`;
}

// 3: maxfiy maydonlar logga tushmaydi
const SECRET_KEYS = new Set(["password", "token", "authorization"]);
function logRequest(req: Req): string {
  const body: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.body)) body[k] = SECRET_KEYS.has(k) ? "[REDACTED]" : v;
  return JSON.stringify({ at: "2026-01-01T00:00:00Z", origin: req.origin, body });
}

// 4: origin allowlist; boshqalarga sarlavha yo'q
const ALLOWED = new Set(["https://app.example.test"]);
function corsHeaders(origin: string): Record<string, string> {
  return ALLOWED.has(origin)
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Credentials": "true" }
    : {};
}

console.log("1:", readReport("../secrets/key.txt"), "|", readReport("q1.csv"));
console.log("2:", tripsQuery("km; DROP TABLE trips", "asc"), "|", tripsQuery("km", "desc"));
console.log("3:", logRequest({ origin: "https://app.example.test", body: { user: "aziz", password: "s3cret-demo" } }));
console.log("4:", JSON.stringify(corsHeaders("https://evil.example.test")), "|", JSON.stringify(corsHeaders("https://app.example.test")));
```

```text
1: undefined | id,km
1,120
2: undefined | SELECT id, km FROM trips ORDER BY km DESC
3: {"at":"2026-01-01T00:00:00Z","origin":"https://app.example.test","body":{"user":"aziz","password":"[REDACTED]"}}
4: {} | {"Access-Control-Allow-Origin":"https://app.example.test","Access-Control-Allow-Credentials":"true"}
```

Har tuzatishda oddiy ishlash ham tekshirildi (ikkinchi qiymat): `q1.csv` o'qiladi, `km desc` tartibi ishlaydi, ruxsat etilgan origin sarlavha oladi. Qoldiq risk: regex nom shakli ruxsat etilgan fayl ichidagi mazmunni tekshirmaydi; logdagi redaksiya faqat kalitlar ro'yxatiga tayanadi, shuning uchun yangi nomli maxfiy maydon ro'yxatga qo'shilmasa o'tib ketadi, kalit ro'yxati kod ko'rishda yangilanadi; origin allowlist `Origin` sarlavhasi to'g'riligiga tayanadi, autentifikatsiya va CSRF himoyasini almashtirmaydi.

### Mashq: safeJoin

Quyidagi funksiya hozir `../` ni o'tkazib yuboradi. Talabga ko'ra bo'laklarni tekshiring.

```ts run
function safeJoin(base: string, name: string): string {
  return base + "/" + name;
}
```

```ts test
const thrown = (n: string) => { try { safeJoin("r", n); return false; } catch (e) { return e instanceof RangeError; } };
check("oddiy nom", () => safeJoin("r", "q1.csv") === "r/q1.csv");
check("ichki katalog", () => safeJoin("r", "a/b.csv") === "r/a/b.csv");
check(".. rad etiladi", () => thrown("../x"));
check("o'rtadagi .. rad etiladi", () => thrown("a/../b"));
check("teskari slesh ham", () => thrown("a\\..\\b"));
check("mutlaq yo'l rad etiladi", () => thrown("/etc/passwd"));
check("NUL rad etiladi", () => thrown("x\0y"));
```

## Qachon qo'llamaslik kerak

Capstone yondashuvi, ya'ni o'z qo'lingiz bilan topib tuzatish, ayrim holatlarda noo'rin. Birinchisi, ma'lum zaif ichki kutubxonada: nuqsonni qo'lda hamma joyda tuzatish o'rniga, kutubxonaning o'zini yangilash yoki almashtirish tezroq va ishonchliroq. Ikkinchisi, to'xtatib bo'lmaydigan darajada ko'p nuqsonli eski tizimda: bu yerda har nuqsonni "mustahkamlash" emas, tizimni izolyatsiya qilish, maydonini qisqartirish va asta almashtirish rejasi kerak.

Allowlist yondashuvi ham hamma narsaga mos kelmaydi: foydalanuvchi qiymatlari cheksiz xilma-xil bo'lgan joyda (masalan, erkin matn qidiruv) allowlist emas, boshqa nazorat kerak: kodlash, hajm cheklovi, kontekstga mos chiqarish. Va nihoyat, bu darsdagi tuzatishlar o'quv modelida isbotlandi, real tizimda bir xil natija kafolatlanmaydi: real DB drayveri, fayl tizimi, brauzer qo'shimcha holatlar kiritadi. Real tizimda tuzatishlar o'z muhitida sinaladi.

Va nihoyat, capstone ishining o'zi ham foyda va xarajatni solishtirishni talab qiladi. Kichik ichki skriptga to'liq hisobot yozish ortiqcha; u yerda ikki qatorlik izoh va bitta probe yetadi. Katta, mijozlarga ochiq servisda esa hisobotning o'zi shartnoma yoki audit uchun dalil bo'ladi.

## Stack'da: capstone'ni haqiqiy repozitoriyga ko'chirish

NestJS'da fayl nomi va sort parametri uchun DTO validatsiyasi (`class-validator` ning `Matches` va `IsIn` dekoratorlari) tuzatish naqshini ifodalaydi; logger'da maxfiy kalitlar markaziy interceptor'da redaksiya qilinadi; CORS `enableCors` ga aniq origin ro'yxati beriladi. Next.js'da Route Handler'lar ham xuddi shu yordamchi funksiyalarni ishlatadi; server tomonidagi kodni mijoz bundle'idan ajratish 36-darsdagi CSRF himoyasi va 14-darsdagi CORS qoidalari bilan birga ko'rib chiqiladi. Har tuzatish uchun probe 92-darsdagi usulda yoziladi va CI'da ishlaydi. Quyidagi parcha capstone hisobotidagi bitta topilma yozuvining tuzilmasini ko'rsatadi (ishga tushirilmaydi, faqat sintaksis tekshirilgan):

```ts
export interface CapstoneFinding {
  id: string;                       // masalan "C-01"
  title: string;                    // "Path traversal: reports/ dan tashqariga chiqish"
  weaknessClass: "input-to-path" | "input-to-query" | "secret-in-log" | "broad-trust";
  evidence: string;                 // probe nomi va kutilgan/haqiqiy natija
  fix: string;                      // nima o'zgargan
  prevention: string;               // sinfni takrorlanishdan nima himoya qiladi
  residualRisk: string;             // qolgan xavf va egasi
  retest: { probe: string; passedAt: string };
}
```

## Xulosa

- Capstone bitta servisda bir nechta moduldan kelgan nuqsonlarni birlashtiradi: yo'l, so'rov tuzilishi, log va ishonch chegarasi.
- Ish tartibi: kod ko'rish, probe bilan tasdiqlash, tuzatish, qayta tekshiruv; natija kod, probe majmuasi va hisobot uchligi.
- Tuzatishning kuchi allowlist va fail-safe default'da: ruxsat etilganni belgilang, qolganini rad eting. Placeholder qiymatni himoya qiladi, identifikatorni emas.
- Tuzatish nuqsonni yopadi, nazorat esa sinfning takrorlanishini to'xtatadi: yordamchi funksiya, markaziy redaksiya, CI probe.
- Hisobotda qoldiq risk, qamrovdan tashqarisi va tuzatilmagan narsaning egasi va muddati ochiq yoziladi.
- SSDF va SAMM kafolat emas, xarita: qaysi sohada yetuksiz ekaningizni ko'rsatib, keyingi qadamni tanlashga yordam beradi.

Keyingi qadamlar oddiy. Birinchisi, o'z loyihangizda shu darsdagi uchlikni (kod, probe, hisobot) bitta endpoint uchun takrorlang. Ikkinchisi, topilmalarni sinf bo'yicha sanang: ikki-uch oydan keyin qaysi sinf eng ko'p takrorlanayotgani ko'rinadi va ildiz sabab (shablon, yordamchi funksiya, o'qitish) aniq bo'ladi. Uchinchisi, SSDF va SAMM xaritasida bir sohani tanlab, uni bir chorakda bir pog'ona yuqoriga ko'taring; hammasini birdan ko'tarishga urinish odatda hech narsa o'zgartirmaydi.
