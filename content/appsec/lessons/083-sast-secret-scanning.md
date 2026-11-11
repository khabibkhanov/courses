---
n: 83
slug: sast-secret-scanning
title: "SAST va secret scanning"
summary: "Kod va git tarixini avtomatik tekshirish: SAST qoidalari nimani ushlaydi va nimani o'tkazib yuboradi, secret scanning (prefiks va entropiya), tarixga tushgan sirni o'chirish yetarli emasligi, rotatsiya va false positive boshqaruvi."
duration: 45
sources:
  - id: cs-secrets
    note: "OWASP Secrets Management Cheat Sheet: 8-bo'lim (detection: pre-commit, bir nechta vosita, entropiya va format muvozanati, test secret'lar), 9-bo'lim (incident response: revocation, rotation, deletion, logging; tarixni qayta yozish oqibatlari), 3-bo'lim (CI/CD'da sirlar, OIDC)"
  - id: wstg
    note: "WSTG kirish bo'limi: SAST, DAST va SCA avtomatik skanerlash sifatida tilga olinadi va hech bir texnika yetarli emasligi aytiladi; manual kod review vositalar o'tkazib yuboradigan nozik nuqsonlar uchun"
  - id: asvs
    note: "ASVS 5.0.0 V13.3: sirlar uchun secrets management yechimi (13.3.1), minimal huquq (13.3.2), sirlarning muddati va rotatsiyasi (13.3.4)"
  - id: nist-ssdf
    note: "NIST SP 800-218 SSDF lokal korpusda yo'q; dars undan faqat umumiy g'oya (xavfsizlik tekshiruvlarini ishlab chiqish jarayoniga kiritish) sifatida foydalanadi va aniq amaliyot raqamlarini keltirmaydi"
quiz:
  - q: "Dasturchi SMS kalitini commit qildi, keyingi commit'da uni kodda `process.env` ga almashtirdi. Joriy holatda (HEAD) kalit yo'q. Kalit xavfsizmi?"
    options:
      - "Ha, chunki HEAD'da yo'q"
      - "Ha, agar repozitoriy private bo'lsa"
      - "Yo'q: kalit git tarixida qoldi, uni ko'rishi mumkin bo'lgan har kim ishlata oladi; kalitni almashtirish (rotatsiya) kerak"
      - "Faqat kalit qimmat bo'lsa"
    answer: 2
    explain: "Git tarixi o'zgarmas yozuv; klon qilgan, fork qilgan yoki eski backup'ni olgan kishi eski commit'ni ochadi. Private repozitoriy ham kirish huquqi bor hamma uchun ochiq, shuning uchun kalit o'zgartirilmaguncha xavf qoladi."
  - q: "Secret scanner `fleet_sk_live_` prefiksini tekshiradi va EXAMPLE so'zi bor qiymatlarni o'tkazib yuboradi. Qaysi sirni u o'tkazib yuboradi?"
    options:
      - "Prefiksi bor haqiqiy kalitni"
      - "Prefiksi yo'q, boshqa servisning tasodifiy tokenini"
      - "Commit tarixidagi kalitni"
      - "Hech qaysini"
    answer: 1
    explain: "Prefiksga asoslangan qoida faqat ma'lum shaklni ushlaydi. Boshqa formatdagi token uchun entropiya kabi umumiy qoida kerak, u ko'proq false positive beradi. Tarix skanerlash esa alohida masala."
  - q: "SAST qoidasi `.query(` ichida shablon literal `${...}` qidiradi. Quyidagi kodning qaysi biri qoidadan o'tib ketadi?"
    options:
      - "db.query(`... WHERE id = ${id}`)"
      - "const q = \"SELECT \" + col + \" FROM t\"; db.query(q)"
      - "db.query(\"... WHERE id = $1\", [id])"
      - "Uchalasi ham ushlanadi"
    answer: 1
    explain: "Oddiy naqsh qidirish ma'lumot oqimini kuzatmaydi: so'rov avval o'zgaruvchiga yig'ilsa, qoida uni ko'rmaydi. Bu SAST'ning false negative chegarasi. Parametrlangan so'rov (3-variant) esa to'g'ri kod."
  - q: "SAST ko'p false positive beradi va jamoa natijalarni e'tiborsiz qoldira boshladi. Eng to'g'ri chora qaysi?"
    options:
      - "Skanerni o'chirish"
      - "Faqat yuqori ishonchli qoidalarni PR'ni bloklaydigan qilish, qolganini ma'lumot sifatida ko'rsatish va qoidalarni kuzatuv natijasiga qarab sozlash"
      - "Barcha topilmalarni avtomatik yopish"
      - "Skanerni faqat chorak oxirida ishga tushirish"
    answer: 1
    explain: "Shovqin ishonchni yo'q qiladi. Bloklaydigan tekshiruv ishonchli bo'lishi kerak; past ishonchli topilmalar ma'lumot sifatida qolsa, ular ham foydalidir, lekin jarayonni to'xtatmaydi."
  - q: "Scanner `// scan:allow` izohi bor qatorlarni o'tkazib yuboradi. Bu mexanizmning asosiy xavfi qaysi?"
    options:
      - "Izoh kodni sekinlashtiradi"
      - "Hech qanday xavf yo'q"
      - "Har qanday dasturchi haqiqiy sirni shu izoh bilan yashirib, review'siz o'tkaza oladi"
      - "Izoh git tarixini buzadi"
    answer: 2
    explain: "Istisno mexanizmi ham hujum sirti: izoh PR'da ko'rinishi va sababi so'ralishi kerak (masalan, test-vektor yoki ro'yxatdagi istisno). Aks holda u qoidani chetlab o'tish yo'liga aylanadi."
  - q: "Secret scanning va SAST o'rtasidagi asosiy farq qaysi?"
    options:
      - "Ikkalasi bir xil"
      - "SAST ishga tushirilgan ilovani tekshiradi, secret scanning esa faqat kodni"
      - "Secret scanning kod ichidagi sirlarni (kalit, token) qidiradi, SAST esa kod strukturasi va ma'lumot oqimidagi xavfli naqshlarni (masalan, injection) qidiradi; ikkalasi ham ishga tushirilmagan kodni tekshiradi"
      - "SAST faqat Java uchun"
    answer: 2
    explain: "Ikkalasi statik: kodni ishga tushirmay o'qiydi. Ishga tushirilgan ilovani tekshirish DAST'ga (84-dars) tegishli."
task:
  title: "Secret scanner: prefiks, entropiya va istisno"
  prompt: |
    `findSecrets(src)` kod qatorlaridan gumon qilingan sirlar joylashgan qator raqamlarini (1 dan) qaytaradi. Hozir u `fleet_sk_live_` prefiksini topadi, lekin placeholder (`EXAMPLE`) ni ham sir deb hisoblaydi va boshqa shakldagi tokenni topmaydi.

    Tuzating:
    1. Prefiksli qiymat `EXAMPLE` so'zini o'z ichiga olsa, o'tkazib yuboring.
    2. Prefikssiz, qo'shtirnoq ichidagi 24 va undan ko'p harf-raqamli satrni entropiyasi 4 dan yuqori bo'lsa sir deb belgilang (past entropiyali `aaaa...` ni emas).
    3. `process.env` o'qiydigan qatorni o'tkazing.
    4. `scan:allow` izohi bor qatorni o'tkazing.

    Kutilgan chiqish: `topilgan qatorlar: [1,3]`.
  lang: ts
  starter: |
    const entropy = (s: string) => {
      const freq = new Map<string, number>();
      for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
      return [...freq.values()].reduce((h, n) => h - (n / s.length) * Math.log2(n / s.length), 0);
    };

    const lines = [
      'const a = "fleet_sk_live_9fQ2xT7LmB4ZaP81KdVe";',
      'const b = "fleet_sk_live_EXAMPLEEXAMPLEEXAMPLE";',
      'const c = "x9Kq2Lm7Zt4Vb8Rw3NcYp6Hs1Dj5Fg0A";',
      "const d = process.env.TOKEN;",
      'const e = "aaaaaaaaaaaaaaaaaaaaaaaaaaaa";',
      'const f = "Qw8Rt2Yu6Io0Pa4Sd9Fg3Hj7Kl1Zx5C"; // scan:allow test-vektor',
    ];

    // Gumon qilingan sirlar joylashgan qator raqamlarini (1 dan) qaytaring.
    function findSecrets(src: string[]): number[] {
      const out: number[] = [];
      src.forEach((line, i) => {
        if (/fleet_sk_live_[A-Za-z0-9]{16,}/.test(line)) out.push(i + 1);
      });
      return out;
    }

    console.log("topilgan qatorlar:", JSON.stringify(findSecrets(lines)));
  solution: |
    const entropy = (s: string) => {
      const freq = new Map<string, number>();
      for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
      return [...freq.values()].reduce((h, n) => h - (n / s.length) * Math.log2(n / s.length), 0);
    };

    const lines = [
      'const a = "fleet_sk_live_9fQ2xT7LmB4ZaP81KdVe";',
      'const b = "fleet_sk_live_EXAMPLEEXAMPLEEXAMPLE";',
      'const c = "x9Kq2Lm7Zt4Vb8Rw3NcYp6Hs1Dj5Fg0A";',
      "const d = process.env.TOKEN;",
      'const e = "aaaaaaaaaaaaaaaaaaaaaaaaaaaa";',
      'const f = "Qw8Rt2Yu6Io0Pa4Sd9Fg3Hj7Kl1Zx5C"; // scan:allow test-vektor',
    ];

    // Gumon qilingan sirlar joylashgan qator raqamlarini (1 dan) qaytaring.
    function findSecrets(src: string[]): number[] {
      const out: number[] = [];
      src.forEach((line, i) => {
        if (line.includes("scan:allow") || line.includes("process.env")) return;
        const prefixed = line.match(/fleet_sk_live_[A-Za-z0-9]{16,}/);
        if (prefixed) {
          if (!prefixed[0].includes("EXAMPLE")) out.push(i + 1);
          return;
        }
        const quoted = line.match(/"([A-Za-z0-9]{24,})"/);
        if (quoted && entropy(quoted[1]) > 4) out.push(i + 1);
      });
      return out;
    }

    console.log("topilgan qatorlar:", JSON.stringify(findSecrets(lines)));
  solutionNotes: |
    - Prefiks qoidasi ishonchli, entropiya qoidasi esa ehtimoliy: u ko'proq false positive va ba'zan false negative beradi. Shuning uchun u prefiks topilmagan holda ishlaydi va chegarasi (4) loyihaga qarab sozlanadi.
    - Placeholder va `process.env` istisnolari shovqinni kamaytiradi. `scan:allow` esa hujum sirti: u qoidani chetlab o'tadi, shuning uchun real tizimda istisno sababi yozilishi va review qilinishi kerak.
    - Skaner faqat joriy qatorlarni ko'radi. Git tarixida allaqachon bo'lgan sirni u topmaydi va topsa ham o'chirish yetarli emas: kalit almashtiriladi.
    - Topilgan qiymatning bir qismini ko'rsatish (redact) ham ma'lumotni sizdiradi: qisqa kalitlarda bu muhim.
  checklist:
    - "Prefiksli haqiqiy kalit topiladi, EXAMPLE placeholder topilmaydi"
    - "Prefikssiz yuqori entropiyali token topiladi"
    - "Past entropiyali takroriy satr topilmaydi"
    - "process.env va scan:allow qatorlari o'tkaziladi"
    - "Skaner nimani topmasligini (tarix, boshqa shakllar) ayta olasiz"
---

## Muammo

Kodni qo'lda review qilish zarur, lekin yetmaydi. Review qiluvchi 800 qatorli diff'da bitta `.query(`${id}`)` ni o'tkazib yuboradi va bitta qo'yilgan `API_KEY = "..."` ni ko'rmaydi. Ikkalasi ham mexanik xato: odam charchaydi, mashina charchamaydi. Shu sababli jamoa review'ni avtomatik tekshiruvlar bilan to'ldiradi.

Bu darsda ikkita tur: SAST (Static Application Security Testing), ya'ni kodni ishga tushirmay o'qib, xavfli naqshlarni qidirish, va secret scanning, ya'ni kod va git tarixida kalit, token, parol qidirish. WSTG kirish bo'limi sinov texnikalarini aralashtirishni tavsiya qiladi: threat modeling, manual kod review, penetration testing va avtomatik skanerlash (SAST, DAST, SCA). U avtomatik skanerlashni umumiy, ma'lum zaifliklarni katta hajmda topish uchun deb ta'riflaydi, manual kod review esa vositalar o'tkazib yuboradigan nozik nuqsonlar (biznes mantiq, kriptografik zaifliklar, race condition) uchun deydi. Ya'ni SAST kod review o'rnini bosmaydi, uni to'ldiradi. NIST SSDF (SP 800-218) xavfsizlik tekshiruvlarini ishlab chiqish jarayoniga kiritish g'oyasini umumiy ma'noda qo'yadi (90-dars); SSDF matni lokal korpusda yo'q, shuning uchun uning amaliyot raqamlarini keltirmaymiz.

Og'riqlar ikkita. Birinchisi, sirning commit'ga tushib qolishi: dasturchi sinov uchun kalitni kodga yozadi, keyin uni `process.env` ga ko'chiradi va "tuzatdim" deb o'ylaydi. Ikkinchisi, SAST shovqini: skaner 300 ta topilma beradi, 280 tasi bo'sh, jamoa natijani o'qishni to'xtatadi va 20 ta haqiqiysi ham yo'qoladi.

## Asosiy g'oya

### SAST: kod ko'rinishiga qarab qidirish

SAST kodni ishga tushirmaydi. U kodni daraxtga (AST) aylantiradi yoki oddiy naqsh qidiradi va xavfli konstruksiyalarni topadi: so'rovga qo'shib yozilgan o'zgaruvchi, `eval`, shell buyrug'iga interpolyatsiya. Murakkabroq vositalar ma'lumot oqimini kuzatadi: foydalanuvchi kiritgan qiymat (source) funksiyalar orqali xavfli joyga (sink) yetib boradimi. Bu 21-darsda ko'rgan "ma'lumot va kod chegarasi" ning avtomatik tekshiruvi.

Uning kuchi tezlik va qamrov: har PR'da butun kodni sekundlarda o'qiydi. Kuchsizligi: ish vaqti haqidagi ma'lumot yo'q. U sizning konfiguratsiyangizni, deploy muhitini, ikki servis orasidagi mantiqni ko'rmaydi. Ishga tushirilgan ilovani tashqaridan sinash DAST (84-dars) ishi.

### Secret scanning: kod ichidagi kalit

Secret scanner ikki usulda ishlaydi. Birinchisi, ma'lum shakl: ko'p servis kalitlari taniladigan prefiks yoki format bilan beriladi. Prefiks + uzunlik qoidasi yuqori ishonchli, chunki shakl noyob. Ikkinchisi, entropiya: tasodifiy ko'rinishdagi uzun satr (parol, token) tabiiy matndan yuqori entropiyaga ega. Bu qoida har qanday formatni ushlaydi, lekin ko'proq false positive beradi (hash'lar, UUID'lar, bundle qilingan fayllar).

OWASP Secrets Management Cheat Sheet detection bo'yicha shunday tavsiyalar beradi: tashkilot bo'ylab standart test sirlardan foydalanish (false positive kamayadi, chunki har tur uchun bitta test sirni kuzatish kifoya); sirni commit'dan oldin ushlash uchun IDE, test jarayoni yoki pre-commit hook darajasida detection; sirlarni threat model'ga hujum sirtining qismi sifatida kiritish; bir nechta detection vositasini ishlatib natijalarni solishtirish; va entropiya hamda aniqlash osonligi o'rtasida muvozanat: izchil formatli sirlar kam false positive bilan topiladi, lekin odam yozgan parol formatga mos kelmagani uchun o'tib ketmasligi kerak. Shu manba aniqlanishi kerak bo'lgan turlarni ham sanaydi: API kalitlari, ulanish satrlari, parollar, private key'lar (masalan SSH), session token'lar, 2FA kalitlari va platformaga xos sirlar.

Eng muhim qoida, 3-bo'limdagi misolda ko'rinadi: sir bir marta git tarixiga tushsa, kodni tuzatish uni qaytarmaydi. Tarixni qayta yozish (rebase, filter) lokal repozitoriyni o'zgartiradi, lekin boshqa klonlar, fork'lar, CI keshlari va backup'lar eski nusxani saqlaydi. Xavfsiz xulosa: topilgan sirni oshkor bo'lgan deb hisoblash va uni almashtirish (rotatsiya), keyin tozalash.

## Chuqurroq: ishonch, shovqin va chegaralar

### SAST qoidasining false negative'i

SAST'ning eng oddiy shakli regex bilan naqsh qidirish. Quyidagi kod to'rt qatorni tekshiradi. Birinchi va to'rtinchi qator ushlanadi. Ikkinchisi parametrlangan (to'g'ri) kod, uchinchisi esa zaif: so'rov avval satr sifatida yig'iladi, keyin `db.query(q)` ga beriladi. Naqsh uni ko'rmaydi.

```ts run
type Rule = { id: string; re: RegExp; msg: string };

// Juda sodda SAST qoidalari: har biri faqat naqsh qidiradi
const rules: Rule[] = [
  { id: "sqli", re: /\.query\(\s*`[^`]*\$\{/, msg: "SQL so'rovida shablon interpolyatsiyasi (22-dars)" },
  { id: "eval", re: /\beval\(/, msg: "eval chaqiruvi" },
  { id: "exec", re: /\bexec\(\s*`[^`]*\$\{/, msg: "shell buyrug'iga interpolyatsiya (25-dars)" },
];

const source = [
  'const rows = await db.query(`SELECT * FROM vehicles WHERE id = ${req.params.id}`);',
  'const ok = await db.query("SELECT * FROM vehicles WHERE id = $1", [id]);',
  'const col = "fuel"; const q = "SELECT " + col + " FROM readings"; await db.query(q);',
  "exec(`ping ${host}`);",
];

source.forEach((line, i) => {
  const hit = rules.find((r) => r.re.test(line));
  console.log(`${i + 1}: ${hit ? `${hit.id} - ${hit.msg}` : "topilmadi"}`);
});
```

```text
1: sqli - SQL so'rovida shablon interpolyatsiyasi (22-dars)
2: topilmadi
3: topilmadi
4: exec - shell buyrug'iga interpolyatsiya (25-dars)
```

Natija: uchinchi qator `topilmadi`, garchi `col` foydalanuvchidan kelsa, bu ham injection. Ya'ni "SAST sukut saqlasa, kod toza" degan xulosa xato. Ma'lumot oqimini kuzatuvchi vositalar bunday qatorlarni ko'proq ushlaydi, lekin ular ham hamma yo'lni ko'rmaydi (dinamik chaqiruvlar, framework sehri). Qoidalar to'plamini haqiqiy zaifliklaringiz bilan to'ldirib borish kerak.

### Topilmalarni boshqarish

Skaner natijasi uch toifaga bo'linadi: bloklovchi (yuqori ishonch, tuzatmasdan merge qilib bo'lmaydi), ogohlantiruvchi (ko'rinadi, merge'ni to'xtatmaydi) va yopilgan (sabab bilan). Istisnoning o'zi xavfsizlik nazorati: `// scan:allow` kabi izoh PR'da ko'rinadi, sababi yoziladi va ro'yxat vaqti-vaqti bilan ko'rib chiqiladi. Aks holda istisno hamma narsani yashiradigan teshikka aylanadi.

### Entropiya nimani o'lchaydi

Shannon entropiyasi satrdagi belgilar qanchalik tekis taqsimlanganini o'lchaydi. `EXAMPLEEXAMPLEEXAMPLE` kabi takrorlanuvchi satrda bir necha xil belgi bor va entropiya past (quyidagi misolda 2.52), tasodifiy token esa deyarli har belgi turlicha (5.00). Bu o'lchov satr "tasodifiy ko'rinadimi"ni aytadi, lekin "sirmi"ni aytmaydi: git commit hash'i, UUID yoki base64 bilan kodlangan rasm ham yuqori ball oladi. Aksincha, odam tanlagan uzun, lekin tabiiy so'zlardan iborat parol past ball oladi va o'tib ketadi. Shuning uchun entropiya qoidasi prefiks qoidasining o'rnini emas, uni to'ldirishini yodda tuting va uning chegarasini o'z kodingizdagi misollar bilan sinab sozlang.

### Topilgandan keyin: revocation, rotation, deletion, logging

Secrets Management Cheat Sheet sirning oshkor bo'lishiga javobni to'rt qadamli tartib sifatida beradi. Birinchi, revocation: oshkor bo'lgan kalit zudlik bilan bekor qilinadi, buning uchun sirni tez de-avtorizatsiya qilish va bekor qilinganlik holatini aniqlash imkoniyati oldindan bo'lishi kerak. Ikkinchi, rotation: yangi sir tez va afzalroq avtomatik yaratiladi (takrorlanuvchan, xato ehtimoli kam, odam o'qiy olmaydigan). Uchinchi, deletion: bekor qilingan va almashtirilgan sirlar kod va loglardan darhol olib tashlanadi; manba tarixni sir paydo bo'lishidan oldingi holatga siqish mumkinligini, lekin bu git tarixini qayta yozishi va o'sha commit'larga bo'lgan havolalarni sindirishini ochiq aytadi, shuning uchun oqibatini bilib qaror qilish kerak. To'rtinchi, logging: kim kirish huquqiga ega bo'lgan, qachon ishlatgan, oxirgi marta qachon rotatsiya qilingan, bu savollarga javob beradigan yozuvlar. Tartib muhim: revocation va rotation tarixni tozalashdan oldin keladi, chunki tozalash allaqachon olingan nusxalarga ta'sir qilmaydi.

Shu manbaning 3-bo'limi CI/CD tomonini qo'shadi: CI vositasida saqlanadigan sirlar pipeline job'lariga va loyiha maintainer'lariga ochiq, shuning uchun yuqori qiymatli, uzoq muddatli yoki keng qamrovli credential'larni CI o'zgaruvchilarida saqlamaslik, fork'lar sirlarni nusxalamasligini tekshirish va aniq rotatsiya jadvali tavsiya qilinadi. Eng kuchli variant sifatida pipeline'ga runtime sirlarini umuman bermaslik ko'rsatiladi: pipeline platforma identifikatori (masalan, Kubernetes service account yoki cloud IAM role) bilan deploy qiladi, ilovaning o'zi sirlarni ish vaqtida secrets manager'dan oladi. ASVS V13.3.1 secrets management yechimi (masalan key vault) ishlatilishini, V13.3.2 sirlarga kirish minimal huquq printsipida bo'lishini, V13.3.4 sirlar muddati tugashi va rotatsiya qilinishini talab qiladi (85-dars CI/CD ni batafsil ko'radi).

### Skanerlash qaerda bo'ladi

Uch nuqta: dasturchi noutbugida (commit'dan oldin: eng arzon, chunki sir hali tarixga tushmagan), PR/CI'da (hammaga majburiy, chetlab o'tib bo'lmaydi) va repozitoriy tarixida davriy (yangi qoidalar bilan eski commit'larni tekshirish). Birinchi nuqta chetlab o'tilishi mumkin (lokal hook o'chirib qo'yiladi), shuning uchun u qulaylik, majburiy nazorat esa CI.

## Misol: tarixda qolgan kalit

Model tarmoqsiz: "repozitoriy" shunchaki commit ro'yxati. Kalit sinov uchun to'qilgan, hech qaysi servisga tegishli emas.

### 1. Zaif kod

Jamoa "tozalash" tekshiruvini faqat joriy holatga qaratadi. `c2` commit kalitni `.env` ga ko'chirgan.

```ts run
type Commit = { id: string; added: string[] };

const history: Commit[] = [
  { id: "c1", added: ['const SMS_KEY = "fleet_sk_live_9fQ2xT7LmB4ZaP81KdVe";', "sendSms(SMS_KEY, phone)"] },
  { id: "c2", added: ["// kalit .env ga ko'chirildi", "const SMS_KEY = process.env.SMS_KEY;"] },
  { id: "c3", added: ["export const port = 3000;"] },
];

// ZAIF: faqat joriy holat (HEAD) tekshiriladi. "c2" kalitni olib tashladi, demak toza.
const head = ["// kalit .env ga ko'chirildi", "const SMS_KEY = process.env.SMS_KEY;", "export const port = 3000;"];
const leakedInHead = head.some((l) => l.includes("fleet_sk_live_"));
console.log("HEAD tekshiruvi:", leakedInHead ? "kalit topildi" : "toza");

// HUJUM: repozitoriyni klon qilgan kishi tarixni o'qiydi
const found = history.flatMap((c) => c.added.filter((l) => l.includes("fleet_sk_live_")).map((l) => `${c.id}: ${l}`));
console.log("tarix:", found.length ? found[0] : "toza");
```

### 2. Hujum

Repozitoriyni klon qilgan kishi (hamkasb, sobiq xodim, fork egasi) tarixni o'qiydi. Joriy holat toza, tarix esa kalitni saqlaydi:

```text
HEAD tekshiruvi: toza
tarix: c1: const SMS_KEY = "fleet_sk_live_9fQ2xT7LmB4ZaP81KdVe";
```

### 3. Tuzatilgan kod

Skaner har commit'ning qo'shilgan qatorlarini tekshiradi: prefiks qoidasi (placeholder'siz) va entropiya qoidasi. Topilgan qiymat to'liq emas, qisqartirilgan ko'rinishda chop etiladi.

```ts run
type Commit = { id: string; added: string[] };
type Finding = { commit: string; rule: string; preview: string };

const history: Commit[] = [
  { id: "c1", added: ['const SMS_KEY = "fleet_sk_live_9fQ2xT7LmB4ZaP81KdVe";', "sendSms(SMS_KEY, phone)"] },
  { id: "c2", added: ["// kalit .env ga ko'chirildi", "const SMS_KEY = process.env.SMS_KEY;"] },
  { id: "c3", added: ['const sample = "fleet_sk_live_EXAMPLEEXAMPLEEXAMPLE";', 'const token = "x9Kq2Lm7Zt4Vb8Rw3NcYp6Hs1Dj5Fg0A";'] },
];

const entropy = (s: string) => {
  const freq = new Map<string, number>();
  for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  return [...freq.values()].reduce((h, n) => h - (n / s.length) * Math.log2(n / s.length), 0);
};
const redact = (s: string) => s.slice(0, 4) + "..." + s.slice(-2);

function scan(history: Commit[]): Finding[] {
  const out: Finding[] = [];
  for (const c of history) {
    for (const line of c.added) {
      const prefixed = line.match(/fleet_sk_live_[A-Za-z0-9]{16,}/);
      if (prefixed && !prefixed[0].includes("EXAMPLE")) out.push({ commit: c.id, rule: "ma'lum prefiks", preview: redact(prefixed[0]) });
      const quoted = line.match(/"([A-Za-z0-9]{24,})"/);
      if (!prefixed && quoted && entropy(quoted[1]) > 4) out.push({ commit: c.id, rule: "yuqori entropiya", preview: redact(quoted[1]) });
    }
  }
  return out;
}

for (const f of scan(history)) console.log(`${f.commit} [${f.rule}] ${f.preview}`);
console.log("entropiya EXAMPLE:", entropy("EXAMPLEEXAMPLEEXAMPLE").toFixed(2));
console.log("entropiya tasodifiy:", entropy("x9Kq2Lm7Zt4Vb8Rw3NcYp6Hs1Dj5Fg0A").toFixed(2));
```

```text
c1 [ma'lum prefiks] flee...Ve
c3 [yuqori entropiya] x9Kq...0A
entropiya EXAMPLE: 2.52
entropiya tasodifiy: 5.00
```

Nima yopildi: tarixga tushgan va keyin "olib tashlangan" kalit topiladi (`c1`), placeholder (`EXAMPLE`) shovqin bermaydi, va boshqa shakldagi tasodifiy token ham (`c3`, entropiya 5.00 chegara 4 dan yuqori). Nima yopilmadi: topilma sirni o'chirmaydi. Kalit rotatsiya qilinmaguncha xavf saqlanadi; entropiya qoidasi ham yolg'on ogohlantirish berishi mumkin; qisqartirilgan ko'rinish (4 va 2 belgi) ham qisqa sirlarda ko'p ma'lumot sizdiradi. Tuzatish faqat shu uch commit modeli uchun to'g'ri.

## Qachon qo'llamaslik kerak

- SAST'ni yagona nazorat sifatida qabul qilish. Yuqorida ko'rdik: u ma'lumot oqimini ko'rmasa, zaiflikni o'tkazadi, va bo'sh natija toza kod degani emas.
- Barcha qoidalarni bloklovchi qilish. Past ishonchli qoida PR'ni to'xtatsa, jamoa uni o'chirib qo'yadi yoki istisno bilan o'tkazadi, natijada ishonchli qoidalar ham ahamiyatini yo'qotadi.
- Tarixni qayta yozishni rotatsiya o'rniga ishlatish. Bu faqat keyingi klonlarga yordam beradi; oldin nusxa olganlar uchun hech narsa o'zgarmaydi.
- Entropiya chegarasini sinovsiz qo'yish. Test fixture, hash va generatsiya qilingan fayllar ko'p false positive beradi; bunday papkalar uchun alohida konfiguratsiya kerak (va u ham istisno ekanini unutmang).
- Skanerning topilmasini "xavf yo'q" deb o'qish: skaner yangi shakldagi kalitni bilmasa, topmaydi.

## Stack'da: Node.js/TypeScript loyihasi

- Pre-commit hook (lokal) va CI qadami (majburiy): ikkalasi ham secret scanner ishga tushiradi; CI nusxasi bloklaydi. Konkret vositani tanlash va sozlash jamoa qarori: bu darsda hech bir vositaning buyruqlari berilmaydi, chunki korpusda ular tekshirilmagan. Cheat sheet bir nechta vositani birga ishlatib natijalarni solishtirishni maslahat beradi.
- SAST uchun TypeScript/Node.js'ni tushunadigan vosita tanlang va ilovangizning haqiqiy zaifliklaridan (22, 25-darslar) o'zingiz qoidalar yozing: bu eng arzon "regression" himoyasi.
- Topilmalarni PR'da annotatsiya sifatida ko'rsating; alohida portal ochilmasa, hech kim ochmaydi.
- Sirlar `process.env` ga tashqi secret manager'dan keladi (69-dars); koddagi `.env.example` faqat nomlarni saqlasin, qiymatlarni emas.
- NestJS/Next.js: `NEXT_PUBLIC_` kabi brauzerga chiqadigan o'zgaruvchilarga sir qo'ymang (19, 35-darslar kontekstida), skaner buni nom bo'yicha tekshirishi mumkin.
- Topilma bo'lsa tartib (cheat sheet): revocation, rotation, deletion, logging; tarixni tozalash faqat oqibatini bilib qaror qilinadi. Skaner qoidasini yangilang va hodisani 93-darsdagi jarayonga bog'lang.

## Xulosa

- SAST kod naqshlarini ishga tushirmay topadi; bo'sh natija toza kod degani emas (ma'lumot oqimi ko'rinmasa, o'tkazib yuboradi).
- Secret scanner prefiks (ishonchli) va entropiya (kengroq, shovqinli) usullarini birga ishlatadi.
- Sir git tarixiga tushsa, uni o'chirish yetarli emas: rotatsiya qilinadi, keyin tozalanadi.
- Skaner shovqini nazoratni o'ldiradi: bloklovchi qoidalar ishonchli bo'lsin, istisnolar sabab bilan review qilinsin.
- Ikkalasi ham statik; ishga tushirilgan ilovani tekshirish DAST va fuzzing ishi (84-dars).
