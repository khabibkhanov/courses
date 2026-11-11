---
n: 67
slug: csprng-token
title: "Tasodifiylik: CSPRNG va token generatsiyasi"
summary: "Oddiy PRNG va CSPRNG farqi, bashorat qilinadigan manba (vaqt, hisoblagich, Math.random) bilan yaratilgan reset tokenining buzilishi, entropiya talablari (ASVS), UUID chegarasi, modulo bias, tokenni bazada hash ko'rinishida saqlash."
duration: 45
sources:
  - id: t10-a04
    note: "A04:2025 fon qismi: zaif PRNG bilan bog'liq CWE-331, CWE-338, CWE-1241; tekshiriladigan savollar: dizayn kriptografik talablarga javob bermaydigan tasodifiylik, seed past entropiyali; 'How to prevent': zamonaviy API'larda CSPRNG'ni seed qilish shart emas"
  - id: cs-session
    note: "Session Management cheat sheet: Session ID Entropy (kamida 64 bit, o'z identifikatoringizda kamida 128 bit CSPRNG), 64 bit uchun 585 yillik hisob, tokenni bazada hash ko'rinishida saqlash bo'limi"
  - id: node-security
    note: "Node.js hujjatlari: crypto.randomBytes, crypto.randomInt, crypto.randomUUID (CSPRNG asosida), crypto.getRandomValues; Math.random xavfsizlik maqsadida emas (A04/Cryptographic Storage jadvali bilan mos)"
  - id: asvs
    note: "ASVS 5.0.0 11.5.1 (CSPRNG va kamida 128 bit entropiya, UUID bu shartni qondirmaydi), 11.5.2, 7.2.3 (sessiya tokeni), 6.5.4 va 6.6.3 (bir martalik kodlar), Appendix C Random Values jadvali"
  - id: cs-crypto-storage
    note: "Cryptographic Storage cheat sheet: Secure Random Number Generation bo'limi (tillar bo'yicha xavfsiz va xavfli funksiyalar jadvali, Node.js uchun Math.random xavfli) va UUIDs and GUIDs bo'limi"
quiz:
  - q: "Parolni tiklash tokeni `Math.random().toString(36).slice(2)` bilan yaratiladi. Eng aniq muammo qaysi?"
    options:
      - "Token juda uzun"
      - "Math.random xavfsizlik uchun mo'ljallanmagan PRNG: chiqishlar bashorat qilinishi mumkin, token CSPRNG'dan kelishi kerak"
      - "toString(36) tokenni shifrlaydi"
      - "Token faqat brauzerda ishlaydi"
    answer: 1
    explain: "OWASP Cryptographic Storage jadvali Node.js uchun Math.random'ni xavfli, crypto.randomBytes, randomInt va randomUUID'ni xavfsiz deb ko'rsatadi. A04 zaif PRNG'ni (CWE-338) asosiy sabablardan biri sifatida sanaydi."
  - q: "Token generatori `seed = Date.now()` dan boshlanadi. Hujumchi o'z tokenini oldi va qurbonning so'rovi taxminan bir daqiqa ichida bo'lganini biladi. Nima uchun xavfli?"
    options:
      - "Vaqt mavhum, ahamiyatsiz"
      - "Seed makoni juda kichik (ming millisekund yoki bir necha ming qiymat): hujumchi barcha kandidat seed'lardan tokenlar hosil qilib, qurbon tokenini topadi"
      - "Date.now() faqat server soatini ko'rsatadi"
      - "Seed token uzunligini qisqartiradi"
    answer: 1
    explain: "Entropiya token uzunligi emas, hujumchiga noma'lum bo'lgan holatlar soni. Vaqt asosidagi seed bir necha ming variantga tushadi (CWE-331, CWE-1241 yo'nalishi)."
  - q: "`byte % 10` bilan 6 xonali kod yaratiladi, `byte` 0 dan 255 gacha bir tekis. Nima uchun raqamlar bir tekis taqsimlanmaydi?"
    options:
      - "256 ni 10 ga bo'lganda qoldiq bor: 0-5 raqamlari 26 marta, 6-9 esa 25 marta chiqadi (modulo bias)"
      - "Modulo faqat tub sonlar bilan ishlaydi"
      - "Baytlar tasodifiy emas"
      - "Raqam 9 hech qachon chiqmaydi"
    answer: 0
    explain: "256 = 25*10 + 6, shuning uchun kichik qoldiqlar bir marta ko'proq uchraydi. Yechim: 250 va undan katta baytlarni rad etish (rejection sampling) yoki crypto.randomInt."
  - q: "ASVS 5.0.0 11.5.1 bo'yicha UUID haqida nima deyiladi?"
    options:
      - "Har qanday UUID kalit uchun yaroqli"
      - "UUID kamida 128 bit entropiya talabini qondirmaydi: ularni taxmin qilib bo'lmaydigan qiymat sifatida ishlatmang"
      - "Faqat UUID v1 yaroqli"
      - "UUID doimo CSPRNG'dan keladi, shuning uchun token sifatida yetarli"
    answer: 1
    explain: "ASVS 11.5.1 aniq yozadi: UUID bu shartni qondirmaydi. Cryptographic Storage cheat sheet: v1 vaqt va MAC manzildan iborat, v4'ning tasodifiyligi implementatsiyaga bog'liq. Taxmin qilinmaydigan token uchun CSPRNG bayt qatoridan foydalaning."
  - q: "Reset tokeni bazada ochiq matnda saqlanadi. Nima uchun faqat yuqori entropiya yetmaydi?"
    options:
      - "Entropiya taxmin qilishdan himoya qiladi, lekin bazani o'qigan odam tokenlarni ishlatishi mumkin; tokenning hash'ini saqlash bu xavfni kamaytiradi"
      - "Yuqori entropiya bazani shifrlaydi"
      - "Baza ochiq matnni avtomatik hash qiladi"
      - "Tokenlar bazada saqlanmaydi"
    answer: 0
    explain: "Session Management cheat sheet: yuqori entropiya taxmin qilishdan himoyalaydi, ochilib qolgan tokendan emas. Tokenning to'liq SHA-256 hash'ini saqlash va kelganini hash qilib qidirish ochiq bazadan foydalanishni qiyinlashtiradi."
  - q: "Servis yuqori yuk ostida bir nechta soniya ichida minglab token yaratadi. Qaysi yondashuv to'g'ri?"
    options:
      - "Tezlik uchun Math.random'ga o'tish"
      - "Har soniya CSPRNG o'rniga oldingi tokenni +1 qilish"
      - "Operatsion tizimning CSPRNG'iga tayangan tayyor API (crypto.randomBytes yoki getRandomValues) ishlatish; ASVS 11.5.2 generator yuk ostida ham xavfsiz ishlashi kerakligini talab qiladi"
      - "Seed'ni qo'lda har daqiqa yangilash"
    answer: 2
    explain: "Zamonaviy API'larda CSPRNG o'zini seed qiladi (A04). Yuk ostida tezlik uchun xavfsizlikdan voz kechish yoki hisoblagich ishlatish tokenni bashorat qilinadigan qiladi."
task:
  title: "Modulo bias'siz raqamli kod"
  prompt: |
    Bir martalik tasdiqlash kodi raqamlari `digit(nextByte)` funksiyasi bilan yaratiladi: u tasodifiy bayt manbasidan (0..255) bitta raqam (0..9) qaytaradi. Hozir `nextByte() % 10` ishlatiladi va 0-5 raqamlari 6-9 ga qaraganda ko'proq chiqadi.

    Tuzating (rejection sampling): 250 va undan katta baytlarni rad eting va yangisini oling; qolgan baytlardan `byte % 10` oling. Manba tugasa `RangeError` tashlaydi, uni ushlamang.

    Test manba 0..255 baytlarni bir martadan beradi. Funksiya imzosini va pastdagi sikl/`console.log`ni o'zgartirmang. Kutilgan chiqish: har raqam uchun 25 ta (`[25,25,25,25,25,25,25,25,25,25]`) va 256 bayt sarflangan.
  lang: ts
  starter: |
    // Tasodifiy bayt manbasidan (0..255) bitta raqam (0..9) oladi.
    function digit(nextByte: () => number): number {
      return nextByte() % 10;
    }

    // Sinov manbasi: 0..255 baytlar bir martadan.
    let pos = 0;
    const next = (): number => {
      if (pos >= 256) throw new RangeError("manba tugadi");
      return pos++;
    };

    const counts: number[] = Array(10).fill(0);
    try {
      while (true) counts[digit(next)]++;
    } catch (e) {
      if (!(e instanceof RangeError)) throw e;
    }

    console.log(JSON.stringify(counts));
    console.log("sarflangan baytlar:", pos);
  solution: |
    // 256 = 25 * 10 + 6: 250..255 baytlari rad etiladi, shunda 0..249 har raqam uchun aynan 25 ta.
    function digit(nextByte: () => number): number {
      while (true) {
        const b = nextByte();
        if (b < 250) return b % 10;
      }
    }

    // Sinov manbasi: 0..255 baytlar bir martadan.
    let pos = 0;
    const next = (): number => {
      if (pos >= 256) throw new RangeError("manba tugadi");
      return pos++;
    };

    const counts: number[] = Array(10).fill(0);
    try {
      while (true) counts[digit(next)]++;
    } catch (e) {
      if (!(e instanceof RangeError)) throw e;
    }

    console.log(JSON.stringify(counts));
    console.log("sarflangan baytlar:", pos);
  solutionNotes: |
    - 256 baytni 10 ga bo'lib bo'lmaydi (256 = 25*10 + 6). `% 10` birinchi 6 raqamga bir martadan ortiq vazn beradi. Rad etish chegarasi `250` = `floor(256 / 10) * 10`.
    - Sikl rad etilgan baytdan keyin yangisini oladi. Ketma-ket rad etilish ehtimoli kichik (6/256), shuning uchun kutilgan sarf bir raqamga bir baytdan bir oz ko'p.
    - Real kodda baytlar CSPRNG'dan keladi; `crypto.randomInt(0, 10)` (Node) bu ishni o'zi qiladi. Qo'lda yozish faqat mexanizmni ko'rsatish uchun.
    - Bu faqat taqsimotni tuzatadi. 6 raqamli kod atigi taxminan 20 bit entropiya beradi (ASVS 6.5.4 buni minimal deb hisoblaydi), shuning uchun brute force'dan rate limit (73-dars) va qisqa muddat himoya qiladi (6.6.3).
  checklist:
    - "250 va undan katta baytlar rad etiladi, yangisi olinadi"
    - "Har raqam uchun hisob teng (25 tadan)"
    - "`RangeError` ushlanmaydi, funksiya imzosi o'zgarmagan"
    - "Modulo bias sababini 256 = 25*10 + 6 bilan tushuntira olasiz"
    - "Raqamli kod entropiyasi kichikligini va qo'shimcha nazoratlarni ayta olasiz"
---

## Muammo

Tasodifiylik kriptografiyaning eng arzon va eng sezilmaydigan zaif nuqtasi. AEAD kalitini to'g'ri tanlagan, TLS 1.3 yoqqan jamoa ham parolni tiklash tokenini `Math.random()` yoki `Date.now()` dan yasashi mumkin, va hech bir test buni topmaydi: token tasodifiy ko'rinadi, noyob chiqadi, hamma narsa ishlaydi. Zaiflik hujumchi nuqtai nazaridan ko'rinadi: u tokenlarni bashorat qila oladimi.

OWASP Top 10:2025 A04 fon qismi ochiq aytadi: kategoriyadagi eng ko'p uchraydigan CWE'lardan uchtasi zaif pseudo-random generator bilan bog'liq: CWE-331 (yetarli bo'lmagan entropiya), CWE-1241 (tasodifiy son generatorida bashorat qilinadigan algoritm) va CWE-338 (kriptografik jihatdan zaif PRNG). Tekshiriladigan savollar ham mos: kriptografik talablarga mo'ljallanmagan tasodifiylik ishlatilyaptimi; to'g'ri funksiya tanlangan bo'lsa ham u dasturchi tomonidan past entropiyali seed bilan qayta yozilmaganmi.

Avtopark platformasida tasodifiy qiymatlar ko'p: parolni tiklash tokeni, qurilma ro'yxatdan o'tish kodi, API kalit, sessiya identifikatori, haydovchining bir martalik kirish kodi, fayl yuklash havolasi. Har biri uchun savol bitta: kimdir bir qiymatni ko'rib, boshqasini taxmin qila oladimi. Dars shu savolga mexanizm darajasida javob beradi: PRNG va CSPRNG farqi, entropiya hisobi, UUID chegarasi, modulo bias va tokenlarni saqlash.

## Asosiy g'oya

### PRNG va CSPRNG

Pseudo-random number generator (PRNG) boshlang'ich holatdan (seed) deterministik ketma-ketlik yaratadi. Seed va algoritmni bilgan yoki ketma-ketlikning bir qismidan holatni tiklay olgan hujumchi qolganini hisoblaydi. Cryptographically secure PRNG (CSPRNG) esa bunga qarshi mo'ljallangan: chiqishning bir qismini ko'rish keyingi chiqishni bashorat qilishga yordam bermasligi kerak, boshlang'ich holat esa operatsion tizimning entropiya manbasidan olinadi.

Cryptographic Storage cheat sheet'i buni aniq ajratadi: oddiy PRNG kam sifatli tasodifiylik beradi, tez va xavfsizlikka aloqasi yo'q maqsadlar (sahifada natijalarni aralashtirish, UI elementlari) uchun yaroqli; xavfsizlik uchun ahamiyatli joyda (kalit, IV, sessiya ID, CSRF token, parol tiklash tokeni) ishlatilmaydi. CSPRNG sekinroq va CPU'ni ko'proq ishlatadi, shuning uchun xavfsizlikka aloqasi yo'q katta hajmdagi tasodifiylik uchun mos kelmasligi mumkin. Jadvalda Node.js uchun xavfli funksiya `Math.random()`, xavfsizlari esa `crypto.randomBytes()`, `crypto.randomInt()` va `crypto.randomUUID()`. Node.js hujjatida `randomBytes` "kriptografik jihatdan kuchli pseudorandom ma'lumot" yaratishi, `randomUUID` esa RFC 4122 v4 UUID'ni kriptografik PRNG yordamida hosil qilishi yozilgan. Brauzer va edge runtime'da (shu jumladan Next.js) `crypto.getRandomValues` bor.

ASVS Appendix C "Random Values" jadvalida approved manbalar: Linux `/dev/random` va `/dev/urandom`, `getentropy()`, hamda NIST SP 800-90A DRBG'lar (AES-CTR-DRBG, HMAC-DRBG, Hash-DRBG). Amalda siz bularni to'g'ridan-to'g'ri chaqirmaysiz: platforma API'si (`crypto.randomBytes`, `getRandomValues`) tizim manbasiga tayanadi. A04 'How to prevent' ro'yxati ham shuni yozadi: zamonaviy API'larning ko'pi CSPRNG'ni dasturchidan seed qilishni talab qilmaydi. Shuning uchun yaxshi qoida: seed bilan o'ynamang.

### Qancha entropiya kerak

Entropiya - hujumchi uchun noma'lum bo'lgan variantlar sonining logarifmi (bitlarda). ASVS 5.0.0 11.5.1: taxmin qilib bo'lmasligi kerak bo'lgan barcha tasodifiy son va satrlar CSPRNG'dan kelishi va kamida 128 bit entropiyaga ega bo'lishi kerak; standart alohida eslatadi: UUID bu shartga javob bermaydi. Sessiya tokeni uchun 7.2.3 ham xuddi shuni (CSPRNG va kamida 128 bit) talab qiladi. Session Management cheat sheet kamida 64 bit minimum deydi va hisob keltiradi: 64 bitli sessiya ID'si bilan, hujumchi sekundiga 10 000 taxmin qiladi va 100 000 faol sessiya bor deb faraz qilinsa, o'rtacha taxminan 585 yil kerak. O'z identifikatoringizni yaratsangiz, cheat sheet 128 bit va CSPRNG tavsiya etadi; kod mavjud sessiya ID'sini framework'dan olish afzal.

Entropiya uzunlik emas. 32 belgilik token, uning yarmi qat'iy yoki bashorat qilinadigan bo'lsa, effektiv entropiya yarmiga tushadi (cheat sheet shu misolni beradi). Bir martalik kodlarda talab pastroq, chunki ular qisqa muddatli va rate limit ostida: ASVS 6.5.4 lookup secret va out-of-band kodlar uchun kamida 20 bit (4 ta tasodifiy alfanumerik belgi yoki 6 ta raqam) deydi, 6.6.3 esa kodni brute force'dan rate limiting bilan himoyalashni va kamida 64 bit entropiyali kodni ko'rib chiqishni tavsiya qiladi.

### UUID tuzog'i

Dasturchilar tez-tez UUID'ni "tasodifiy token" deb ishlatadi. Cryptographic Storage cheat sheet: UUID v1 yuqori aniqlikdagi vaqt tamg'asi va mashinaning MAC manzilidan iborat, demak tasodifiy emas; v4 tasodifiy yaratiladi, lekin CSPRNG ishlatilgani framework'ga bog'liq, shuning uchun noma'lum bo'lsa uning tasodifiyligiga tayanib bo'lmaydi. ASVS 11.5.1 esa umuman UUID 128 bit talabiga javob bermaydi, deydi. Sabab: UUID v4 formatida versiya va variant uchun bir nechta bit qat'iy (bu RFC 4122 bo'yicha umumiy bilim, bu darsda spetsifikatsiyadan tekshirilmagan), shuning uchun tasodifiy bitlar 128 tadan kam. Xulosa: ob'ekt identifikatori sifatida UUID yaxshi, lekin "bilgan odamgina kira oladi" tipidagi token sifatida emas (52-dars: IDOR'da noma'lum identifikator avtorizatsiya o'rnini bosmaydi).

```ts run
// randomUUID: format va qat'iy belgilar (versiya "4", variant 8/9/a/b).
const ids = Array.from({ length: 1000 }, () => crypto.randomUUID());
console.log("hammasi v4 formatida:", ids.every((u) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(u)));
console.log("noyob:", new Set(ids).size === ids.length);
```

```text
hammasi v4 formatida: true
noyob: true
```

## Chuqurroq: bashorat qilinadigan manba va modulo bias

### Seed makoni

PRNG'ning kuchi holatlar sonida. Agar seed `Date.now()` bo'lsa, hujumchi uchun noma'lum bo'lgan narsa faqat taxminan millisekund (yoki sekund) bo'yicha vaqt oynasi: bir necha ming yoki o'n ming variant. Bu 128 bit emas, 13-16 bitga yaqin. Hujumchi o'z tokenini oladi, vaqt oynasini taxmin qiladi va oynadagi har bir kandidat seed'dan token hosil qilib ko'radi. Xuddi shu muammo `process.pid`, hisoblagich, `userId + vaqt` kabi manbalarda ham bor. Bu A04 savollaridagi "tasodifiylik seed qilingan bo'lsa, seed yetarli entropiyaga ega emasmi" nuqtasi.

### Modulo bias

Tasodifiy baytni raqamga aylantirish ham xato manbai. Baytda 256 qiymat bor, 10 ga bo'lganda 256 = 25*10 + 6. `byte % 10` bilan 0-5 raqamlari 26 marta, 6-9 esa 25 marta uchraydi. Farq kichik, lekin bir martalik kodlarda hujumchi taxmin qilish tartibini optimallashtirishi mumkin va xatoning o'zi to'g'ri sxema o'rniga "taxminan to'g'ri" yechim ishlatilganini ko'rsatadi. Yechim: rejection sampling (250 va undan katta baytlarni tashlab, qolganini olish) yoki tayyor `crypto.randomInt`.

```ts run
const counts = Array(10).fill(0);
for (let b = 0; b < 256; b++) counts[b % 10]++;
console.log("byte % 10:", JSON.stringify(counts));

const fixed = Array(10).fill(0);
for (let b = 0; b < 250; b++) fixed[b % 10]++;
console.log("250 dan kichik baytlar:", JSON.stringify(fixed));
```

```text
byte % 10: [26,26,26,26,26,26,25,25,25,25]
250 dan kichik baytlar: [25,25,25,25,25,25,25,25,25,25]
```

### Tokenni saqlash

Yuqori entropiya tokenni taxmin qilishdan himoyalaydi, lekin bazaga o'qish huquqi olgan (SQL injection, zaxira nusxa, noto'g'ri sozlangan o'qish huquqi) hujumchi ochiq matnda saqlangan faol tokenlarni to'g'ridan-to'g'ri ishlatadi. Session Management cheat sheet shuni alohida yozadi: yuqori entropiya taxmin qilishdan himoyalaydi, lekin ochilib qolgan tokenlardan emas; agar baza o'qilishi tahdid modelida bo'lsa, tokenning to'liq SHA-256 hash'ini saqlang va kelgan tokenni hash qilib qidiring. 128 bit va undan yuqori entropiyali tokenlar uchun tez hash yetarli, chunki sanash imkoni yo'q (parollardan farqli, 42-dars). Sessiya tokenlari tafsiloti 46-darsda, reset tokenlari 50-darsda.

## Misol: vaqtga bog'liq reset tokeni

### Zaif kod

Jamoa reset tokenini "tezkor" yig'di: oddiy chiziqli kongruent generator (LCG), seed sifatida so'rov vaqti (sekundlarda). Token noyob ko'rinadi va ishlaydi.

```ts run
// ZAIF: seed - sekundlarda vaqt (taxmin qilinadigan), generator - oddiy LCG (CSPRNG emas).
function weakToken(seedSeconds: number): string {
  let state = seedSeconds >>> 0;
  let out = "";
  for (let i = 0; i < 4; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    out += state.toString(16).padStart(8, "0");
  }
  return out; // 32 hex belgi: 128 bit "ko'rinadi"
}

const t0 = 1_700_000_000; // hujumchining o'z so'rovi vaqti
const victimAt = t0 + 37; // qurbon so'rovi (hujumchi bilmaydi)
console.log("hujumchi tokeni:", weakToken(t0));
console.log("qurbon tokeni uzunligi:", weakToken(victimAt).length);
```

```text
hujumchi tokeni: 5cb8305f0e564232cc123be9b6fbd434
qurbon tokeni uzunligi: 32
```

32 hex belgi 128 bit ko'rinishini beradi, lekin generator holati bitta 32 bitli seed bilan belgilanadi, seed esa sekund bo'yicha vaqt.

### Hujum

Hujumchi o'z hisobi uchun reset so'raydi va tokenining vaqtini biladi. Qurbonning so'rovi taxminan bir daqiqa ichida yuborilganini bilib, u keyingi 60 sekund uchun tokenlarni hisoblaydi va qurbon tokenini topadi. Bu faqat shu o'quv generatoriga qarshi.

```ts run
function weakToken(seedSeconds: number): string {
  let state = seedSeconds >>> 0;
  let out = "";
  for (let i = 0; i < 4; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    out += state.toString(16).padStart(8, "0");
  }
  return out;
}

const t0 = 1_700_000_000;
const victimToken = weakToken(t0 + 37); // hujumchi bu qiymatni ko'rmaydi

let found = -1;
let tries = 0;
for (let dt = 0; dt <= 60; dt++) {
  tries++;
  if (weakToken(t0 + dt) === victimToken) {
    found = dt;
    break;
  }
}
console.log("urinishlar:", tries);
console.log("qurbon so'rovi hujumchidan keyin (sekund):", found);
```

```text
urinishlar: 38
qurbon so'rovi hujumchidan keyin (sekund): 37
```

38 ta urinish bilan (har biri bitta kandidat sekund) qurbonning tokeni topildi, bu "128 bit" emas. Haqiqiy tizimda urinish soni ancha katta bo'lishi mumkin, lekin kichik ko'rinishdagi vaqt oynasi (millisekund, jarayon ID) odatda sanash uchun qulay.

### Tuzatilgan kod

Tuzatish: token 32 bayt CSPRNG'dan, base64url kodlanadi, bazada faqat SHA-256 hash va muddat saqlanadi, tekshirishda kelgan token hash qilinadi.

```ts run
const enc = new TextEncoder();
const b64url = (u: Uint8Array) => btoa(String.fromCharCode(...u)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));

// "Baza": tokenning hash'i -> { userId, expires }.
const db = new Map<string, { userId: string; expires: number }>();

async function issueReset(userId: string, now: number): Promise<string> {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32))); // 256 bit CSPRNG
  db.set(await sha256(token), { userId, expires: now + 900 });
  return token; // foydalanuvchiga yuboriladi; bazada faqat hash
}

async function consumeReset(token: string, now: number): Promise<string | null> {
  const key = await sha256(token);
  const row = db.get(key);
  if (!row || now > row.expires) return null;
  db.delete(key); // bir martalik
  return row.userId;
}

const now = 1_700_000_000;
const token = await issueReset("driver-17", now);
console.log("uzunlik:", token.length, "| bazada ochiq token bormi:", db.has(token));

// Eski hujum: keyingi 60 sekund uchun taxminlar.
const guesses = Array.from({ length: 61 }, (_, dt) => (now + dt).toString(16).padStart(32, "0"));
let hits = 0;
for (const g of guesses) if ((await consumeReset(g, now + 10)) !== null) hits++;
console.log("vaqt asosidagi taxminlar:", hits);

console.log("haqiqiy token:", await consumeReset(token, now + 60));
console.log("qayta ishlatish:", await consumeReset(token, now + 61));
console.log("muddati o'tgan:", await consumeReset(await issueReset("driver-17", now), now + 1000));
```

```text
uzunlik: 43 | bazada ochiq token bormi: false
vaqt asosidagi taxminlar: 0
haqiqiy token: driver-17
qayta ishlatish: null
muddati o'tgan: null
```

Nima uchun yetarli: token 256 bit CSPRNG qiymati va hujumchi uchun hech qanday kichik makon yo'q, shuning uchun vaqt asosidagi sanash hech narsa topmaydi. Bazada faqat hash bor, ya'ni faqat bazani o'qigan hujumchi tokenni ishlatolmaydi. Token bir martalik va muddatli.

Nimani yopmaydi. Birinchidan, tokenni foydalanuvchiga yetkazish kanali (email) xavfsizligi bu kodda yo'q (50-dars). Ikkinchidan, token havolada URL orqali yuborilsa, u log, `Referer` va brauzer tarixiga tushishi mumkin (16 va 69-darslar). Uchinchidan, rate limit va umumiy javob xabarlari (foydalanuvchi mavjudligi sizmasligi) alohida nazorat. To'rtinchidan, operatsion tizimning entropiya manbasi buzuq bo'lgan muhitlarda (klonlangan virtual mashina holati kabi) CSPRNG ham zaif bo'lishi mumkin; bu platforma masalasi, bu darsda manbadan tekshirilmagan.

## Qachon qo'llamaslik kerak

CSPRNG har joyda kerak emas. Sahifadagi ro'yxatni aralashtirish, A/B test uchun tasodifiy tanlov, simulyatsiya yoki testlar uchun takrorlanadigan ketma-ketlik kerak bo'lsa, oddiy PRNG (va tasodifiy emas, ataylab deterministik seed) mos: Cryptographic Storage cheat sheet ham oddiy PRNG'ni xavfsizlikka aloqasi yo'q joyda ishlatishga ruxsat beradi. Ko'p hajmli xavfsizlikka aloqasiz tasodifiylik uchun CSPRNG keraksiz yuk bo'lishi mumkin. Teskarisi xavfli: testni takrorlanadigan qilish uchun ishlab chiqarish kodida seed'ni qat'iy qilib qo'ymang. Test uchun generatorni parametr qilib uzating (yuqoridagi mashq `nextByte` manbasini shunday qabul qiladi).

Shuningdek, tasodifiy token har doim to'g'ri tanlov emas. Bir martalik havola o'rniga imzolangan va muddatli token (HMAC, 62-dars) bazani talab qilmaydi, lekin bekor qilish qiyin; bazadagi tasodifiy token esa bekor qilish va bir martalik ishlatishni osonlashtiradi, lekin holat saqlaydi. Tanlov arxitektura qarori (46-47 darslar).

## Stack'da: Node.js, Next.js, PostgreSQL, Redis

Node.js'da token: `crypto.randomBytes(32).toString("base64url")`. Sonli kod: `crypto.randomInt(0, 1_000_000)` va uni chapdan nol bilan to'ldirish. Edge/brauzer: `crypto.getRandomValues(new Uint8Array(32))`. `uuid` kutubxonasining versiyasi va uning tasodifiy manbasi (CSPRNG ekanligi) ni tekshiring, ammo sir sifatida UUID ishlatmang. NestJS'da token yaratishni bitta provayderga (`TokenService`) yig'ing va testda `RandomSource` interfeysini mock qiling.

PostgreSQL'da tokenning SHA-256 hash'i uchun oddiy `bytea`/`text` ustuni va unique indeks yetadi; muddatni `expires_at` ustunida saqlang va tozalash vazifasini rejalashtiring (79-darsdagi audit logda token qiymatini emas, identifikatorini yozing). Redis'da token hash'i TTL bilan kalit bo'lishi mumkin, bu bir martalik tokenlar uchun qulay; `GETDEL` kabi atomik o'qib-o'chirish race condition'ni yopadi (60-dars), buyruq nomi va xatti-harakatini Redis hujjatidan tekshiring (bu darsda manbadan tekshirilmagan). `Math.random` ni qidiruv bilan koddan topib, xavfsizlik konteksti bor joylarni ro'yxatlang: bu SAST qoidasi sifatida oson (83-dars).

## Xulosa

- Xavfsizlik uchun tasodifiy qiymat har doim CSPRNG'dan: Node'da `crypto.randomBytes`, `randomInt`, `randomUUID`; brauzerda `crypto.getRandomValues`. `Math.random` xavfsizlik maqsadida taqiqlangan.
- Entropiya seed makoni va chiqish xossalarini bildiradi, token uzunligini emas: vaqt, hisoblagich va PID asosidagi seed bir necha ming variantga tushadi.
- ASVS 11.5.1: bashorat qilinmasligi kerak bo'lgan qiymat CSPRNG'dan va kamida 128 bit; UUID bu talabni qondirmaydi. Bir martalik kodlar qisqa bo'lishi mumkin, lekin rate limit va qisqa muddat bilan.
- Baytni raqamga aylantirishda modulo bias'dan qoching: rejection sampling yoki `crypto.randomInt`.
- Yuqori entropiya ochilib qolgan tokendan himoya qilmaydi: bazada tokenning hash'ini saqlang, tokenni bir martalik va muddatli qiling.
- Seed bilan o'ynamang, takrorlanadigan test uchun manbani parametr qiling, ishlab chiqarishda platforma CSPRNG'iga tayaning.
