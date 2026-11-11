---
n: 84
slug: dast-fuzzing
title: "DAST va fuzzing"
summary: "Ishga tushirilgan ilovani tashqaridan sinash (DAST) va tasodifiy kirishlar bilan invariantlarni sinash (fuzzing): ikkalasi statik tahlil ko'rmaydigan nuqsonlarni topadi, lekin o'z chegaralari va xavfsiz ishlatish qoidalari bor."
duration: 45
sources:
  - id: wstg
    note: "WSTG: Testing Framework bo'limi (DAST vositalari ilovani crawl va fuzz qiladi; penetration testing exploitability'ni tasdiqlaydi; staging yoki production'da bo'lishi mumkin; CI/CD bosqichlari), Appendix D Fuzzing (wordlist asosida so'rov fuzzing, ZAP passiv va faol skan), Kirish bo'limi (hech bir texnika yetarli emas)"
  - id: nist-ssdf
    note: "NIST SP 800-218 SSDF lokal korpusda yo'q; dars undan faqat umumiy g'oya (sinovni ishlab chiqish jarayoniga kiritish) sifatida foydalanadi"
  - id: asvs
    note: "ASVS 5.0.0: sinov topilmasini talab raqamiga bog'lash uchun ishlatiladi (masalan V15.2.2 resurs talab qiladigan funksiyalardan mavjudlikni himoya qilish); boshqa bo'limlar tekshirilmagan"
quiz:
  - q: "DAST va SAST orasidagi farq qaysi gapda to'g'ri?"
    options:
      - "DAST kodni ishga tushirmay o'qiydi, SAST ishlayotgan ilovaga so'rov yuboradi"
      - "DAST ishlayotgan ilovaga tashqaridan so'rov yuborib javobni baholaydi, SAST kodni ishga tushirmay tahlil qiladi"
      - "Ikkalasi bir xil, faqat nomi boshqa"
      - "DAST faqat ma'lumotlar bazasini, SAST faqat frontend'ni tekshiradi"
    answer: 1
    explain: "DAST ishlayotgan tizimning tashqi xatti-harakatini ko'radi (konfiguratsiya, autentifikatsiya, javob). SAST esa ishga tushirmay kod strukturasini tahlil qiladi (83-dars)."
  - q: "Fuzz harness'da faqat 'funksiya xato tashlamadimi' tekshiriladi, invariant tekshirilmaydi. Qaysi xatti-harakat o'tib ketadi?"
    options:
      - "Funksiya xato tashlaydigan kirish"
      - "Funksiya xato tashlamay, ruxsat etilmagan maydon yoki cheksiz qiymatni qabul qilib qaytaradigan kirish"
      - "Bo'sh satr kirishi"
      - "Hech qaysi, crash tekshiruvi hamma narsani ushlaydi"
    answer: 1
    explain: "Crash faqat bir turdagi nuqson. Jimgina noto'g'ri qiymat qabul qilish (masalan, tenant maydoni bo'yicha filtr) xato tashlamaydi, uni faqat invariant ('qabul qilingan natija doim xavfsiz') ushlaydi."
  - q: "Fuzzer bir xil seed bilan har ishga tushganda bir xil kirish ketma-ketligini beradi. Nima uchun bu foydali?"
    options:
      - "Bu hujumni tezlashtiradi"
      - "Seed hash qiymatini yashiradi"
      - "Topilgan crash'ni qayta ishlab chiqarish (reproduce) va tuzatishni regression test sifatida saqlash mumkin"
      - "Seed bo'lsa, kirishlar soni cheksiz bo'ladi"
    answer: 2
    explain: "Qayta ishlab chiqarilmaydigan topilmani tuzatib bo'lmaydi. Seed (yoki saqlangan crash kirishi) topilmani sinov holatiga aylantiradi."
  - q: "Jamoa DAST skanerini production muhitga, real mijoz ma'lumotlari bilan, ruxsatsiz ishga tushirmoqchi. Nima noto'g'ri?"
    options:
      - "Hech narsa: skaner zararsiz"
      - "Faqat skaner sekin ishlaydi"
      - "Skaner doim yolg'on natija beradi"
      - "Skaner yaratish, o'zgartirish va o'chirish so'rovlari yuborib real ma'lumot va xizmatga zarar yetkazishi mumkin; sinov alohida muhitda, ruxsat bilan o'tkaziladi"
    answer: 3
    explain: "Faol sinov yon ta'sir qiladi: yozuv yaratadi, bildirishnoma jo'natadi, yuklamani oshiradi. Staging'da sinovga tegishli ma'lumot bilan va yozma ruxsat bilan ishlash kerak (9-dars huquqiy chegaralari)."
  - q: "Fuzz natijasida 2000 kirishdan 0 ta crash chiqdi. To'g'ri xulosa qaysi?"
    options:
      - "Funksiya xavfsiz"
      - "Berilgan kirish taqsimoti va invariantlar bo'yicha 2000 ta sinovda nuqson topilmadi; boshqa kirishlar va boshqa invariantlar sinalmagan"
      - "Funksiya hech qachon xato tashlamaydi"
      - "Fuzzing kerak emas"
    answer: 1
    explain: "Fuzzing nuqson borligini isbotlashi mumkin, yo'qligini isbotlay olmaydi. Natija generatorning sifatiga va tekshirilgan invariantlarga bog'liq."
  - q: "Parser kirishning 80% ini darhol rad etadi (format mos kelmaydi), qolgan 20% haqiqiy mantiqqa yetadi. Fuzz generatori sof tasodifiy belgilardan iborat. Nima bo'ladi?"
    options:
      - "Sinov samarali, chunki hamma yo'l qamrab olinadi"
      - "Ko'pchilik kirish parser eshigidan o'tmaydi, chuqur mantiq kam sinaladi; generator kirish tuzilmasini hisobga olishi kerak"
      - "Parser tezlashadi"
      - "Xato topish ehtimoli oshadi"
    answer: 1
    explain: "Tuzilmasiz tasodifiy kirish yuzaki tekshiruvdan o'tmay qoladi. Strukturali generator (format elementlarini tasodifiy aralashtirish) chuqurroq qatlamlarga yetadi."
task:
  title: "Fuzz harness: crash va invariant buzilishini yo'qotish"
  prompt: |
    `parseFilter(s)` "maydon:operator:qiymat" shaklidagi filtrni tahlil qiladi. Deterministik fuzz harness (seed 42, 2000 kirish) hozir ham crash, ham invariant buzilishini topadi.

    Funksiyani tuzating:
    1. Format mos kelmasa `null` qaytarsin (xato tashlamasin).
    2. Maydon faqat `fuel` yoki `speed` bo'lsin; boshqasi (`tenant`, `x`, bo'sh) uchun `null`.
    3. Operator faqat `eq`, `gt`, `lt`; `ge` kabi boshqasi uchun `null`.
    4. Qiymat 0 dan 1000 gacha butun son bo'lsin (`-5`, `abc`, `1e999`, bo'sh uchun `null`).

    Harness o'zgarmaydi. Kutilgan natija: `crash: 0 buzilgan invariant: 0`.
  lang: ts
  starter: |
    // Deterministik PRNG: bir xil seed har doim bir xil kirish ketma-ketligini beradi
    function rng(seed: number) {
      return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    const pick = <T,>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];
    // "maydon:operator:qiymat" shaklidagi, ba'zan buzilgan kirishlar
    function gen(r: () => number): string {
      const s = [pick(r, ["fuel", "speed", "tenant", "x", ""]), pick(r, ["eq", "gt", "lt", "ge", ""]), pick(r, ["10", "-5", "abc", "1e999", "", "250"])];
      return r() < 0.15 ? s.join("") : s.join(":");
    }

    // "maydon:operator:qiymat" filtri. Xato kirishda null qaytarsin, qabul qilinganlari xavfsiz bo'lsin
    function parseFilter(s: string) {
      const m = s.match(/^(\w*):(eq|gt|lt|ge)?:(.*)$/) ?? s.match(/^(\w+)$/);
      return { field: m![1], op: m![2], value: Number(m![3]) };
    }

    const FIELDS = ["fuel", "speed"];
    const r = rng(42);
    let crashes = 0, violations = 0, accepted = 0;
    let firstCrash: string | null = null, firstViolation: string | null = null;
    for (let i = 0; i < 2000; i++) {
      const input = gen(r);
      try {
        const f = parseFilter(input) as { field: string; op: string; value: number } | null;
        if (f) {
          accepted++;
          // Invariant: qabul qilingan natija doim ruxsat etilgan maydon va 0..1000 butun qiymat
          if (!FIELDS.includes(f.field) || !Number.isInteger(f.value) || f.value < 0 || f.value > 1000) { violations++; firstViolation ??= input; }
        }
      } catch { crashes++; firstCrash ??= input; }
    }
    console.log("sinovlar: 2000, crash:", crashes, "buzilgan invariant:", violations);
    console.log("birinchi crash:", JSON.stringify(firstCrash), "birinchi invariant buzilishi:", JSON.stringify(firstViolation));
    console.log("to'g'ri filtr:", JSON.stringify(parseFilter("fuel:lt:10")), accepted > 0);
  solution: |
    // Deterministik PRNG: bir xil seed har doim bir xil kirish ketma-ketligini beradi
    function rng(seed: number) {
      return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    const pick = <T,>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];
    // "maydon:operator:qiymat" shaklidagi, ba'zan buzilgan kirishlar
    function gen(r: () => number): string {
      const s = [pick(r, ["fuel", "speed", "tenant", "x", ""]), pick(r, ["eq", "gt", "lt", "ge", ""]), pick(r, ["10", "-5", "abc", "1e999", "", "250"])];
      return r() < 0.15 ? s.join("") : s.join(":");
    }

    const FIELDS = ["fuel", "speed"];
    // Tuzatilgan: xato kirishda null, maydon va operator allowlist, qiymat 0..1000 butun
    function parseFilter(s: string): { field: string; op: string; value: number } | null {
      const m = s.match(/^(\w+):(eq|gt|lt):(.+)$/);
      if (!m) return null;
      const value = Number(m[3]);
      if (!FIELDS.includes(m[1])) return null;
      if (!Number.isInteger(value) || value < 0 || value > 1000) return null;
      return { field: m[1], op: m[2], value };
    }

    const r = rng(42);
    let crashes = 0, violations = 0, accepted = 0;
    let firstCrash: string | null = null, firstViolation: string | null = null;
    for (let i = 0; i < 2000; i++) {
      const input = gen(r);
      try {
        const f = parseFilter(input) as { field: string; op: string; value: number } | null;
        if (f) {
          accepted++;
          // Invariant: qabul qilingan natija doim ruxsat etilgan maydon va 0..1000 butun qiymat
          if (!FIELDS.includes(f.field) || !Number.isInteger(f.value) || f.value < 0 || f.value > 1000) { violations++; firstViolation ??= input; }
        }
      } catch { crashes++; firstCrash ??= input; }
    }
    console.log("sinovlar: 2000, crash:", crashes, "buzilgan invariant:", violations);
    console.log("birinchi crash:", JSON.stringify(firstCrash), "birinchi invariant buzilishi:", JSON.stringify(firstViolation));
    console.log("to'g'ri filtr:", JSON.stringify(parseFilter("fuel:lt:10")), accepted > 0);
  solutionNotes: |
    - Eng muhim qoida: xato kirish exception emas, oddiy `null`. Exception tashlash server tomonda 500 yoki unhandled rejection bo'lib mavjudlikka (A) zarar qiladi.
    - Allowlist (maydon, operator) tenant kabi ichki maydonlar bo'yicha filtrlashni yopadi: fuzz buni crash emas, invariant buzilishi sifatida topdi.
    - `Number("1e999")` `Infinity` beradi; `Number.isInteger` va chegara tekshiruvi bunday qiymatni rad etadi.
    - Harness faqat shu ikki invariantni tekshiradi (crash va qabul qilingan natijaning xavfsizligi). Mantiqiy to'g'rilikni (masalan, `lt` ni to'g'ri qo'llash) bu sinov isbotlamaydi.
    - Natija 2000 ta kirish, bitta seed uchun. Boshqa seed yoki generator boshqa nuqson topishi mumkin.
  checklist:
    - "Noto'g'ri formatli kirish uchun exception tashlanmaydi"
    - "Faqat fuel va speed maydonlari qabul qilinadi"
    - "Faqat eq, gt, lt operatorlari qabul qilinadi"
    - "Qiymat 0..1000 butun son ekani tekshiriladi, Infinity va manfiy rad etiladi"
    - "Fuzzing 'nuqson yo'q' ni isbotlamasligini ayta olasiz"
---

## Muammo

SAST (83-dars) kodni ishga tushirmay o'qiydi. Ammo ko'p nuqsonlar kodning o'zida ko'rinmaydi: ular ilova ishga tushganda, muayyan konfiguratsiya va ma'lumot bilan paydo bo'ladi. Header noto'g'ri sozlangan, bitta endpoint autentifikatsiyasiz qolgan, parser kutilmagan kirishda yiqiladi. Bunday nuqsonlarni topishning yagona yo'li ilovani ishlatib ko'rish.

Bu darsda ikki usul: DAST (Dynamic Application Security Testing), ya'ni ishlayotgan ilovaga tashqaridan so'rov yuborib javoblarni baholash, va fuzzing, ya'ni funksiya yoki servisga ko'p miqdordagi avtomatik yaratilgan kirish berib, kutilmagan xatti-harakatni qidirish. OWASP WSTG'ning Testing Framework bo'limi dinamik sinovni shunday ta'riflaydi: statik tahlil yoki qo'lda review o'tkazib yuborgan nuqsonlarni topish uchun ishlayotgan ilovani sinash; DAST vositalari (ZAP, Burp Suite) ilovani crawl qiladi va fuzz qiladi, manual penetration testing esa exploitability'ni tasdiqlaydi va biznes mantiqni sinaydi. WSTG shuningdek hech bir texnika yetarli emasligini yozadi: yetuk dastur threat modeling, manual kod review, penetration testing va avtomatik skanerlashni (SAST, DAST, SCA) birga ishlatadi. NIST SSDF xavfsizlik sinovlarini ishlab chiqish jarayoniga kiritishni umumiy g'oya sifatida qo'yadi (90-dars); SSDF matni lokal korpusda yo'q, shuning uchun uning amaliyot raqamlarini keltirmaymiz.

Ikkita tipik og'riq bor. Birinchisi, "testlar o'tdi, demak xavfsiz": unit testlarni biz yozamiz va kutilgan kirishlarni sinaymiz; hujumchi esa kutilmagan kirishlarni yuboradi. Ikkinchisi, "DAST skaneri 400 ta topilma berdi": ko'pi shovqin, jamoa o'qimay qo'yadi, yoki skaner production'ga ruxsatsiz yuboriladi va real ma'lumotni buzadi.

## Asosiy g'oya

### DAST: tashqi ko'rinish

DAST ilovani qora quti sifatida ko'radi. U HTTP so'rovlar yuboradi (navigatsiya, forma, API chaqiruvlari), javoblarni tahlil qiladi: xavfsizlik header'lari bormi, xato xabari ichki ma'lumotni sizdiryaptimi, kirishdagi qiymat javobda qayta ko'rinyaptimi (XSS belgisi), autentifikatsiyasiz endpoint ochiqmi. Kuchi shundaki, u haqiqiy konfiguratsiya, reverse proxy va deploy muhitini ham ko'radi. Zaifligi: ilovaning ichki mantiqini tushunmaydi. U "foydalanuvchi A foydalanuvchi B ning ma'lumotini ko'ryaptimi" kabi biznes mantiq savollarini (52-dars, IDOR) o'zi hal qila olmaydi, chunki rollar va ma'lumotlar o'rtasidagi bog'liqlikni bilmaydi.

### Fuzzing: kirish makonini tasodifiy kezish

Fuzzing funksiya yoki servisga ko'p va xilma-xil kirishlar beradi va ikki turdagi signalni kuzatadi. Birinchisi, crash: exception, qotish, xotira buzilishi (Node.js'da ko'pincha unhandled exception yoki cheksiz tsikl). Ikkinchisi, invariant buzilishi: dastur xato bermadi, lekin qaytargan natija kafolatdan chiqdi. Invariantga misol: "qabul qilingan filtrning maydoni doim ruxsat etilganlardan biri". Ikkinchi signal ko'pincha unutiladi, lekin xavfsizlik uchun aynan u muhim: ruxsatsiz maydonni qabul qilish ham crash bermaydi.

Qayta ishlab chiqarilish (reproducibility) uchun fuzzer deterministik tasodifiy generator (seed) ishlatadi. Bir xil seed bir xil kirishlarni beradi, demak topilgan crash'ni qayta olish, tuzatish va keyin regression testga aylantirish mumkin:

```ts run
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const a = rng(7), b = rng(7), c = rng(8);
const take = (r: () => number) => Array.from({ length: 4 }, () => Math.floor(r() * 1000));
console.log("seed 7 :", take(a).join(" "));
console.log("seed 7 :", take(b).join(" "));
console.log("seed 8 :", take(c).join(" "));
```

```text
seed 7 : 11 61 976 699
seed 7 : 11 61 976 699
seed 8 : 156 625 300 695
```

## Chuqurroq: generator sifati va chegaralar

### "Fuzzing" ning ikki ma'nosi

Bu atama ikki xil ishni nomlaydi va ularni ajratish foydali. WSTG Appendix D fuzzing'ni veb-saytga ma'lum vaqt oralig'ida ko'p so'rov yuborish jarayoni sifatida ta'riflaydi (brute force'ga o'xshash): vosita (Wfuzz, ffuf, GoBuster, ZAP fuzzer) maqsad URL, parametr va kirish ro'yxatini (wordlist) oladi va placeholder o'rniga ro'yxat qiymatlarini qo'yib so'rovlar yaratadi. Bu tashqi, HTTP darajasidagi fuzzing: yashirin yo'llarni, parametr qiymatlarini, ID'larni topish uchun. Appendix wordlist sifati muhimligini ta'kidlaydi: tayyor ro'yxat sizning stsenariyingizga mos kelmasa, o'zingizniki yaratiladi.

Ikkinchi ma'no, bu darsdagi misollarda ishlatilgani: funksiya yoki parser darajasidagi (property-based) fuzzing. Kirish makoni dasturiy generator bilan hosil qilinadi, tekshiruv esa invariantlar orqali bajariladi. Bu ichki, kod darajasidagi sinov, tarmoq yo'q va yon ta'siri yo'q. Ikkalasi ham nuqsonlarni kutilmagan kirish bilan topadi, lekin birinchisi ishlayotgan servisni, ikkinchisi sizning kodingizni sinaydi. WSTG dagi ZAP tavsifi yana bir farqni beradi: passiv skan ilova va foydalanuvchi o'rtasidagi trafikni kuzatadi, faol skan esa ilovaga sinov payload'larini yuboradi. Faqat ikkinchisi yon ta'sir qila oladi.

### Strukturali generator

Sof tasodifiy belgilar ketma-ketligi ko'pgina parserlarda birinchi tekshiruvdan o'tmaydi va chuqur mantiqqa yetmaydi. Shuning uchun kirish formati (maydon, operator, qiymat) ma'lum bo'lsa, generator uning elementlarini tasodifiy aralashtiradi va ba'zan ataylab buzadi (ikki nuqtani tushirib qoldirish). Bu "grammatikaga asoslangan" fuzzing: u rad etilgan kirishlar ulushini kamaytiradi. Murakkabroq vositalar kodning qaysi qismlari qamrab olinganini kuzatib, generatorni shu tomonga yo'naltiradi (coverage-guided fuzzing). Bu darsdagi o'quv harness'i ularning soddalashtirilgan ko'rinishi, chunki u qamrovni kuzatmaydi.

### Oracle: nimani to'g'ri deb hisoblaymiz

Fuzzing "nima noto'g'ri" ni bilmaydi: bu sizning vazifangiz. Oracle (to'g'rilikni baholovchi qoida) quyidagilardan iborat bo'lishi mumkin: funksiya exception tashlamasligi kerak; xavfsiz tarmoqlar (allowlist) ichida qolishi; natija bir xil kirishda bir xil bo'lishi; kodlash-dekodlash qaytarilishi (round-trip). Oracle qancha aniq bo'lsa, fuzz shuncha ko'p topadi. Oracle yo'q bo'lsa, faqat crash topiladi.

### Topilmani qanday qayta ishlash

Fuzz topilmasi odatda uzun, tushunarsiz kirish bo'ladi. Uni ishlatishdan oldin qisqartiriladi (shrinking): kirishdan belgilarni birma-bir olib tashlab, nuqson saqlanib qolgan eng qisqa variant qidiriladi. Qisqa kirish sababni ko'rsatadi: masalan, "ikki nuqta yo'q" yoki "qiymat bo'sh". Keyin topilma regression testga aylanadi va tuzatishdan so'ng hamma seed'lar qayta ishga tushiriladi. Muhim intizom: bitta topilmani tuzatib to'xtamang, sababni sinfga bog'lang (masalan, "parser xato kirishda exception tashlaydi") va shu sinfdagi boshqa funksiyalarni ham tekshiring. Aks holda xuddi shu nuqson qo'shni parserda qayta chiqadi.

### Qaysi bosqichda nima ishlaydi

WSTG CI/CD pipeline uchun bosqichma-bosqich bo'linishni tavsiya qiladi: build vaqtida SAST, SCA va secret scanning; staging'da DAST hamda IaC va konteyner image skanerlash; release oldidan xavfsizlik sign-off va deploy'ni to'xtatish chegaralari (threshold). Bu 83 va 84-darslarni bog'laydi: statik vositalar har commit va PR'da tez ishlaydi, dinamik sinov esa ishlayotgan muhit talab qilgani uchun staging'ga tushadi. WSTG yana sinovni doimiy faoliyat deb ataydi: kod o'zgarishi, bog'liqliklar yangilanishi yoki infratuzilma siljishi tufayli paydo bo'ladigan yangi zaifliklarni ushlash uchun SAST/DAST/SCA qayta ishga tushiriladi, davriy penetration test va bug bounty dasturlari esa doimiy qamrov beradi. Fuzz harness (yuqoridagi turdagi) esa unit test bilan bir xil joyda, ya'ni build bosqichida, har PR'da ishlay oladi, chunki u tarmoqsiz va soniyalarda tugaydi.

### DAST'ni xavfsiz ishlatish

DAST faol sinov: u POST/PUT/DELETE so'rovlar yuborishi, yozuv yaratishi, bildirishnoma jo'natishi, yuklamani oshirishi mumkin. Shuning uchun uni ruxsatsiz va real ma'lumot bilan production'da yuborish xato; WSTG production sinovini istisno qilmaydi, lekin kelishilgan doira va ehtiyotni talab qiladi. Amaliy qoidalar: alohida staging muhit, sinov uchun yaratilgan akkauntlar va tenant, yozma ruxsat, so'rovlar tezligi cheklangan, sinovdan keyin ma'lumotni tozalash. WSTG DAST va penetration testing staging yoki production muhitida bo'lishi mumkinligini, ichki jamoa, tashqi konsultant yoki bug bounty dasturi orqali o'tkazilishini yozadi. Ya'ni production sinovi mumkin, lekin faqat kelishilgan doira, ruxsat va ehtiyot bilan; ruxsatsiz sinash qonuniy javobgarlik keltirib chiqarishi mumkin (9-dars). Bu kursdagi sinovlar faqat o'zingizning yoki o'quv laboratoriyasidagi ilovaga qarshi. Bu kursdagi barcha sinovlar faqat o'zingizning yoki o'quv laboratoriyasidagi ilovaga qarshi.

## Misol: xato tashlaydigan va noto'g'ri qabul qiladigan parser

Fuzz harness'ning o'zi "hujum": u kutilmagan kirishlarni yuboradi. Model server va tarmoqsiz, sof funksiya.

### 1. Zaif kod va 2. Hujum

Parser filtr satrini regex bilan ajratadi va natijani tekshirmay qaytaradi. Harness 2000 kirishni yuboradi va ikkita narsani sanaydi: exception va qabul qilingan natijaning buzilgan invarianti (ruxsat etilmagan maydon yoki 0..1000 butun bo'lmagan qiymat).

```ts run
// Deterministik PRNG: bir xil seed har doim bir xil kirish ketma-ketligini beradi
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];
// "maydon:operator:qiymat" shaklidagi, ba'zan buzilgan kirishlar
function gen(r: () => number): string {
  const s = [pick(r, ["fuel", "speed", "tenant", "x", ""]), pick(r, ["eq", "gt", "lt", "ge", ""]), pick(r, ["10", "-5", "abc", "1e999", "", "250"])];
  return r() < 0.15 ? s.join("") : s.join(":");
}

// ZAIF: "maydon:operator:qiymat" filtrini tahlil qiladi
function parseFilter(s: string) {
  const m = s.match(/^(\w*):(eq|gt|lt|ge)?:(.*)$/) ?? s.match(/^(\w+)$/);
  return { field: m![1], op: m![2], value: Number(m![3]) };
}

const FIELDS = ["fuel", "speed"];
const r = rng(42);
let crashes = 0, violations = 0, accepted = 0;
let firstCrash: string | null = null, firstViolation: string | null = null;
for (let i = 0; i < 2000; i++) {
  const input = gen(r);
  try {
    const f = parseFilter(input) as { field: string; op: string; value: number } | null;
    if (f) {
      accepted++;
      // Invariant: qabul qilingan natija doim ruxsat etilgan maydon va 0..1000 butun qiymat
      if (!FIELDS.includes(f.field) || !Number.isInteger(f.value) || f.value < 0 || f.value > 1000) { violations++; firstViolation ??= input; }
    }
  } catch { crashes++; firstCrash ??= input; }
}
console.log("sinovlar: 2000, crash:", crashes, "buzilgan invariant:", violations);
console.log("birinchi crash:", JSON.stringify(firstCrash), "birinchi invariant buzilishi:", JSON.stringify(firstViolation));
console.log("to'g'ri filtr:", JSON.stringify(parseFilter("fuel:lt:10")), accepted > 0);
```

```text
sinovlar: 2000, crash: 56 buzilgan invariant: 1601
birinchi crash: "speedeq-5" birinchi invariant buzilishi: "x:lt:250"
to'g'ri filtr: {"field":"fuel","op":"lt","value":10} true
```

Natija: 56 ta kirish exception'ga olib keldi (masalan `speedeq-5`: format mos kelmadi, `m![1]` `null` ga murojaat qildi). Undan ham muhimi, 1601 ta kirish xato bermay, buzilgan natija qaytardi: `x:lt:250` maydon `x` ni qabul qildi, boshqalari `Infinity` yoki `NaN` qiymatni. Real tizimda `field` so'rov quruvchiga uzatilsa, bu ichki maydonlar bo'yicha filtrlash (`tenant`) demak. Crash tekshiruvining o'zi bu 1601 ta nuqsonni ko'rmagan bo'lardi.

### 3. Tuzatilgan kod

```ts run
// Deterministik PRNG: bir xil seed har doim bir xil kirish ketma-ketligini beradi
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];
// "maydon:operator:qiymat" shaklidagi, ba'zan buzilgan kirishlar
function gen(r: () => number): string {
  const s = [pick(r, ["fuel", "speed", "tenant", "x", ""]), pick(r, ["eq", "gt", "lt", "ge", ""]), pick(r, ["10", "-5", "abc", "1e999", "", "250"])];
  return r() < 0.15 ? s.join("") : s.join(":");
}

const FIELDS = ["fuel", "speed"];
// Tuzatilgan: xato kirishda null, maydon va operator allowlist, qiymat 0..1000 butun
function parseFilter(s: string): { field: string; op: string; value: number } | null {
  const m = s.match(/^(\w+):(eq|gt|lt):(.+)$/);
  if (!m) return null;
  const value = Number(m[3]);
  if (!FIELDS.includes(m[1])) return null;
  if (!Number.isInteger(value) || value < 0 || value > 1000) return null;
  return { field: m[1], op: m[2], value };
}

const r = rng(42);
let crashes = 0, violations = 0, accepted = 0;
let firstCrash: string | null = null, firstViolation: string | null = null;
for (let i = 0; i < 2000; i++) {
  const input = gen(r);
  try {
    const f = parseFilter(input) as { field: string; op: string; value: number } | null;
    if (f) {
      accepted++;
      // Invariant: qabul qilingan natija doim ruxsat etilgan maydon va 0..1000 butun qiymat
      if (!FIELDS.includes(f.field) || !Number.isInteger(f.value) || f.value < 0 || f.value > 1000) { violations++; firstViolation ??= input; }
    }
  } catch { crashes++; firstCrash ??= input; }
}
console.log("sinovlar: 2000, crash:", crashes, "buzilgan invariant:", violations);
console.log("birinchi crash:", JSON.stringify(firstCrash), "birinchi invariant buzilishi:", JSON.stringify(firstViolation));
console.log("to'g'ri filtr:", JSON.stringify(parseFilter("fuel:lt:10")), accepted > 0);
```

```text
sinovlar: 2000, crash: 0 buzilgan invariant: 0
birinchi crash: null birinchi invariant buzilishi: null
to'g'ri filtr: {"field":"fuel","op":"lt","value":10} true
```

Nima yopildi: har qanday noto'g'ri formatli kirish `null` bo'ladi (crash yo'q), maydon va operator allowlist bilan cheklangan, qiymat chekli butun son. Harness bu kafolatni 2000 ta kirish uchun tasdiqladi. Nima yopilmadi: bu faqat ikki invariant va bitta seed. Boshqa generator (masalan, uzun satrlar, Unicode) boshqa muammo topishi mumkin; ReDoS (30-dars) kabi ishlash vaqti nuqsonlarini bu harness o'lchamaydi; va mantiqiy to'g'rilik (`lt` ni to'g'ri qo'llash) tekshirilmagan.

Amaliy qoida: fuzz natijasi takrorlanishi uchun har ishga tushirishda seed va topilgan crash kirishi log'ga yozilsin. Shunda CI'da topilgan xatoni dasturchi o'z kompyuterida bir xil kirish bilan qayta chiqaradi, tuzatadi va o'sha kirishni regression testga aylantiradi. Seed'siz fuzz xatoni topadi, lekin uni tasdiqlash va tuzatilganini isbotlash qiyin bo'ladi.

## Qachon qo'llamaslik kerak

- Fuzzing'ni hamma kodga qo'llash. U tashqi kirishni qayta ishlaydigan joylarda (parser, deserializer, validator) eng foydali. Ichki, kirishsiz hisob-kitob uchun unit test yaxshiroq.
- DAST'ni production'da ruxsatsiz va real ma'lumot bilan ishga tushirish. Yuqorida ko'rdik: faol so'rovlar yon ta'sir qiladi.
- DAST natijasini avtomatik bloklovchi qilish, tekshiruvsiz. Shovqinli topilmalar jamoa ishonchini yo'qotadi; avval triage, keyin ishonchli qoidalar bloklaydi.
- "0 ta topilma" ni xavfsizlik isboti deb o'qish. Fuzzing va DAST nuqsonning borligini ko'rsatadi, yo'qligini kafolatlamaydi.
- Dinamik sinovning qimmat va sekin ekanini unutish: har PR'da to'liq DAST ko'pincha foydasiz. Yengil smoke-tekshiruv PR'da, to'liq skan esa kechasi yoki staging'da.

## Stack'da: Node.js, NestJS, Next.js

- Validatsiya funksiyalari (72-dars: sxema validatsiya) va parserlar uchun property-based/fuzz testlar: kirish xato bermasligi va natija invariantda qolishi. Bu test `ts` fayl sifatida unit test infratuzilmangizda ishlaydi.
- NestJS DTO validatsiyasi va Next.js route handler kirishlari uchun xuddi shunday harness: noto'g'ri tipdagi body, juda uzun satr, ichma-ich ob'ekt.
- DAST uchun staging muhit: alohida tenant va sinov ma'lumotlari, autentifikatsiya qilingan sinov akkaunti bilan, chunki ko'p zaiflik login'dan keyin paydo bo'ladi.
- Topilma ASVS talabiga bog'lansin (8-dars): "bu talab bajarilmayapti" ko'rinishida qayd qilinsa, tuzatish va qayta tekshirish aniq bo'ladi.
- Topilgan crash kirishi regression testga qo'shiladi: seed yoki to'g'ridan-to'g'ri kirish bilan.

## Xulosa

- DAST ishlayotgan ilovani tashqaridan sinaydi va konfiguratsiya hamda deploy xatolarini ko'radi; biznes mantiqni o'zi tushunmaydi.
- Fuzzing ikki signal qidiradi: crash va invariant buzilishi. Ikkinchisi xavfsizlik uchun ko'pincha muhimroq.
- Deterministik seed topilmani qayta ishlab chiqarish va regression testga aylantirish imkonini beradi.
- Strukturali generator va aniq oracle fuzzing samarasini belgilaydi; "0 ta crash" xavfsizlik isboti emas.
- DAST faqat ruxsat bilan, staging'da, sinov ma'lumotlari bilan ishlatiladi.
