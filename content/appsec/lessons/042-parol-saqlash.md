---
n: 42
slug: parol-saqlash
title: "Parol saqlash: Argon2id, scrypt, bcrypt"
summary: "Parol bazasi sizib chiqqanda hujumchi nima qila olishi, tuz (salt), ish omili (work factor) va memory-hard funksiyalar mexanikasi, OWASP va RFC 9106 parametrlari, bcrypt cheklovlari, pepper va eski hash'larni kirish paytida yangilash."
duration: 45
sources:
  - id: cs-password
    note: "Password Storage Cheat Sheet: eng kam parametrlar (Argon2id 19 MiB / t=2 / p=1 va unga teng boshqa kombinatsiyalar; scrypt N=2^17, r=8, p=1; bcrypt work factor 10 va 72 bayt chegarasi; PBKDF2 uchun HMAC-SHA-256 600 000, SHA-512 220 000 iteratsiya), pepper talablari, work factor'ni kirishda yangilash va eski hash'larni yangilash usullari"
  - id: rfc9106
    note: "4-bo'lim (Parameter Choice): Argon2 parametrlarini tanlash tartibi; birinchi tavsiya (Argon2id, t=1, p=4, m=2^21 ya'ni 2 GiB) va xotira kam bo'lganda ikkinchi tavsiya (t=3, p=4, m=2^16 ya'ni 64 MiB); salt 128 bit, tag 256 bit"
  - id: nist-63-4
    note: "Parol tekshiruvchisi parollarni oflayn hujumga chidamli shaklda saqlashi, ya'ni tuzlangan va hash qilingan holda; parolning minimal uzunligi 15 (yagona faktor) va maksimal uzunlikka kamida 64 belgi ruxsat berilishi"
quiz:
  - q: "Bazadagi `password_hash` ustuni `sha256(parol)` ni saqlaydi. Baza sizib chiqdi. Hujumchi nima qila oladi?"
    options:
      - "Hech narsa: SHA-256 qaytarib bo'lmaydigan funksiya"
      - "Eng ko'p uchraydigan parollar ro'yxatini hash qilib, sizgan qiymatlar bilan solishtiradi; bir xil parolli foydalanuvchilar bir xil hash ko'rsatadi"
      - "Hash'dan parolni matematik teskari hisoblaydi"
      - "Faqat adminning parolini topa oladi"
    answer: 1
    explain: "Hash qaytarilmaydi, lekin tez va tuzsiz hash tez-tez uchraydigan parollar uchun oldindan hisoblangan jadval bilan oson solishtiriladi. Teskari hisoblash kerak emas: nomzodni hash qilib tekshirish yetarli."
  - q: "Nima uchun parol hash'i uchun 'sekin' funksiya tanlanadi, umumiy maqsadli tez hash esa emas?"
    options:
      - "Sekin funksiya xavfsizroq algoritm bo'lgani uchun"
      - "Sekinlik foydalanuvchi uchun qo'shimcha to'siq bo'lgani uchun"
      - "Hujumchi sizgan hash'ni oflayn taxmin qilganda har bir nomzod qimmatga tushadi; legitim tekshiruv esa bir marta bajariladi"
      - "Sekin funksiya tuz talab qilmagani uchun"
    answer: 2
    explain: "Asimmetriya: server har kirishda bitta hash hisoblaydi, hujumchi esa milliardlab nomzodni. Ish omili bu nisbatni sizning foydangizga o'zgartiradi. Sekin funksiya algoritm sifatida 'xavfsizroq' emas, tuzga ehtiyojni ham bekor qilmaydi."
  - q: "Argon2id va PBKDF2 o'rtasidagi muhim farq nima va u hujumchiga qanday ta'sir qiladi?"
    options:
      - "Argon2id xotira ham talab qiladi, shuning uchun GPU/ASIC'da parallel taxmin qilish arzonlashmaydi; PBKDF2 faqat hisoblash vaqtiga tayanadi"
      - "Argon2id tuz ishlatadi, PBKDF2 ishlatmaydi"
      - "PBKDF2 qaytariladigan funksiya"
      - "Argon2id faqat 8 belgigacha parolni qabul qiladi"
    answer: 0
    explain: "Memory-hard funksiya har hisoblash uchun ma'lum xotira talab qiladi, shu sababli ko'plab parallel yadro bor qurilmada ham xotira tor joyga aylanadi. PBKDF2 ham tuz ishlatadi va qaytarilmaydi; xotira talabi esa yo'q."
  - q: "Quyidagi qaysi holat bcrypt bilan bog'liq xavf?\n\n```ts\nconst h = await bcrypt.hash(userPassword, 12);\n```"
    options:
      - "Cost 12 juda past"
      - "bcrypt tuz ishlatmaydi"
      - "bcrypt 72 bayt dan uzun kirishni qirqadi; 72-baytdan keyin farq qiladigan parollar bir xil hash beradi, bu uzun parollar uchun kutilmagan xatti-harakat"
      - "bcrypt faqat raqamli parollar bilan ishlaydi"
    answer: 2
    explain: "Cheat sheet bcrypt uchun 72 bayt chegarasini eslatadi. Uzun parol yoki pre-hash qilinmagan kirish ma'lum qismi e'tiborsiz qolishiga olib keladi; chegarani biladigan tekshiruv yoki Argon2id bunday xatti-harakatdan qochadi. Cost 12 yetarli (minimum 10)."
  - q: "Jamoa mavjud foydalanuvchilarning hash'larini Argon2id'ga o'tkazmoqchi, lekin parollar ma'lum emas. Qaysi yondashuv to'g'ri?"
    options:
      - "Hamma foydalanuvchiga parolni majburiy tiklashni yuborish"
      - "Eski hash'ni Argon2id kirishi qilib o'rash yoki foydalanuvchi keyingi muvaffaqiyatli kirishida parolni yangi algoritm bilan qayta hash qilish; ikkalasi ham mumkin"
      - "Eski hash'ni to'g'ridan-to'g'ri Argon2id bilan almashtirish, chunki hash'lar mos"
      - "Migratsiya mumkin emas"
    answer: 1
    explain: "Kirishda parol ochiq holda qisqa vaqt mavjud: shu paytda tekshirib, yangi algoritm bilan qayta hash qilinadi. Faol bo'lmagan akkauntlar uchun eski hash'ni yangi funksiya bilan o'rash mumkin, lekin bunday qatlamlash hash'ni sindirishni osonlashtirishi mumkin va keyingi kirishda to'g'ridan-to'g'ri hash bilan almashtirilishi kerak. Majburiy tiklash mumkin, lekin yagona yo'l emas. Hash'larni 'mos' almashtirish mumkin emas."
  - q: "OWASP'ga ko'ra pepper (server tomonidagi umumiy maxfiy qiymat) haqida qaysi gap to'g'ri?"
    options:
      - "Pepper tuz o'rnini bosadi"
      - "Pepper bilan parol siyosatini yumshatish mumkin"
      - "Pepper yagona himoya sifatida yetarli"
      - "Pepper qo'shimcha himoya qatlami (defense in depth), lekin o'zi asosiy hash funksiyasi o'rnini bosmaydi"
    answer: 3
    explain: "Cheat sheet pepper'ni qo'shimcha qatlam sifatida tavsiya etadi, lekin yolg'iz o'zi qo'shimcha xavfsizlik xususiyati bermasligini ham yozadi. Uni saqlash (secrets management) va almashtirish murakkabligi oshadi; tuz va ish omili baribir kerak."
task:
  title: "Tuzlangan PBKDF2 hash, doimiy vaqtli solishtirish va qayta hash"
  prompt: |
    Starter kod parolni tuzsiz SHA-256 bilan saqlaydi. Uni tuzating:

    1. `hashPassword` har chaqiruvda yangi 16 baytli tasodifiy tuz bilan `pbkdf2$ITER$tuzHex$hashHex` formatidagi qator qaytarsin (PBKDF2, HMAC-SHA-256, 256 bit chiqish, `CURRENT_ITERS` iteratsiya).
    2. `verifyPassword` saqlangan qatorni tahlil qilib, shu tuz va iteratsiya soni bilan parolni hash qilib, natijani doimiy vaqtli (constant-time) usulda solishtirsin. Noto'g'ri formatdagi qator `false` bersin va xato tashlamasin.
    3. `needsRehash` format `pbkdf2` bo'lmasa yoki iteratsiya `CURRENT_ITERS` dan kam bo'lsa `true` bersin.

    Kutilgan chiqish: `true`, `true`, `false`, `true`, `false`. Tezlik uchun darsda `CURRENT_ITERS = 100_000`; production uchun OWASP qiymati 600 000 (PBKDF2-HMAC-SHA-256).
  lang: ts
  starter: |
    const CURRENT_ITERS = 100_000;
    const enc = new TextEncoder();
    const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

    // ZAIF: tuzsiz, tez hash
    async function hashPassword(password: string): Promise<string> {
      const d = await crypto.subtle.digest("SHA-256", enc.encode(password));
      return `sha256$0$$${hex(new Uint8Array(d))}`;
    }

    async function verifyPassword(stored: string, password: string): Promise<boolean> {
      return stored === (await hashPassword(password));
    }

    function needsRehash(stored: string): boolean {
      return false;
    }

    const a = await hashPassword("avtopark-2026-kuchli");
    const b = await hashPassword("avtopark-2026-kuchli");
    console.log("bir xil parol, har xil hash:", a !== b);
    console.log("to'g'ri parol:", await verifyPassword(a, "avtopark-2026-kuchli"));
    console.log("noto'g'ri parol:", await verifyPassword(a, "boshqa"));
    const old = `pbkdf2$1000$00112233445566778899aabbccddeeff$${"0".repeat(64)}`;
    console.log("eski yozuv qayta hash kerakmi:", needsRehash(old));
    console.log("yangi yozuv qayta hash kerakmi:", needsRehash(a));
  solution: |
    const CURRENT_ITERS = 100_000;
    const enc = new TextEncoder();
    const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
    const unhex = (s: string) => new Uint8Array((s.match(/../g) ?? []).map((h) => parseInt(h, 16)));

    async function derive(password: string, salt: Uint8Array, iters: number): Promise<Uint8Array> {
      const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
      const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: iters }, key, 256);
      return new Uint8Array(bits);
    }

    function equalConstTime(x: Uint8Array, y: Uint8Array): boolean {
      if (x.length !== y.length) return false;
      let diff = 0;
      for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
      return diff === 0;
    }

    async function hashPassword(password: string): Promise<string> {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const h = await derive(password, salt, CURRENT_ITERS);
      return `pbkdf2$${CURRENT_ITERS}$${hex(salt)}$${hex(h)}`;
    }

    async function verifyPassword(stored: string, password: string): Promise<boolean> {
      const parts = stored.split("$");
      if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
      const iters = Number(parts[1]);
      if (!Number.isInteger(iters) || iters < 1 || !/^[0-9a-f]+$/.test(parts[2]) || !/^[0-9a-f]{64}$/.test(parts[3])) return false;
      const h = await derive(password, unhex(parts[2]), iters);
      return equalConstTime(h, unhex(parts[3]));
    }

    function needsRehash(stored: string): boolean {
      const parts = stored.split("$");
      return parts[0] !== "pbkdf2" || Number(parts[1]) < CURRENT_ITERS;
    }

    const a = await hashPassword("avtopark-2026-kuchli");
    const b = await hashPassword("avtopark-2026-kuchli");
    console.log("bir xil parol, har xil hash:", a !== b);
    console.log("to'g'ri parol:", await verifyPassword(a, "avtopark-2026-kuchli"));
    console.log("noto'g'ri parol:", await verifyPassword(a, "boshqa"));
    const old = `pbkdf2$1000$00112233445566778899aabbccddeeff$${"0".repeat(64)}`;
    console.log("eski yozuv qayta hash kerakmi:", needsRehash(old));
    console.log("yangi yozuv qayta hash kerakmi:", needsRehash(a));
  solutionNotes: |
    - Har parol uchun yangi tasodifiy tuz: bir xil parol turli hash beradi, shu sababli oldindan hisoblangan jadval va "bir xil hash = bir xil parol" kuzatuvi ishlamaydi.
    - Tuz va iteratsiya soni hash bilan birga saqlanadi (format qatori), shuning uchun `CURRENT_ITERS` ni keyinchalik oshirsangiz eski yozuvlar ishlashda davom etadi va `needsRehash` ularni kirishda yangilashga ishora qiladi.
    - `equalConstTime` barcha baytlarni solishtiradi va erta chiqmaydi. Bu vaqt farqi orqali hash haqida ma'lumot sizishini kamaytiradi.
    - Noto'g'ri formatdagi yozuv xato tashlamaydi, `false` qaytaradi: buzilgan qator butun kirish oqimini yiqitmasligi kerak, lekin ruxsat ham bermaydi.
    - PBKDF2 xotira talab qilmaydi. Bu yechim FIPS cheklovi bo'lgan holat uchun; yangi tizimda Argon2id afzal (OWASP tartibi). Bu kod parol siyosati va throttling'ni qoplamaydi (43-dars).
  checklist:
    - "Bir xil parol turli hash beradi"
    - "Tuz va iteratsiya soni saqlanadigan qatorda bor"
    - "Solishtirish doimiy vaqtli"
    - "Buzilgan qator `false` beradi va xato tashlamaydi"
    - "`needsRehash` eski format va kam iteratsiyani aniqlaydi"
---

## Muammo

Parol bazasi sizib chiqishi bu "ehtimol" emas, kutilgan hodisa. SQL injection (22-dars), zaif backup, noto'g'ri sozlangan bucket, ichki xodim, log fayl: yo'llar ko'p. Savol "baza sizadimi" emas, sizganda hujumchi nima qila olishi. Agar `password_hash` ustuni yaxshi tanlangan funksiya bilan to'ldirilgan bo'lsa, hujumchi faqat ko'p vaqt va pul evaziga ayrim kuchsiz parollarni topadi. Agar tuzsiz tez hash bo'lsa, ko'pchilik parollar soatlar ichida ochiladi, chunki odamlar bir xil parollarni tanlaydi va hujumchi nomzodlarni sizgan qiymatlar bilan solishtiradi.

Ikkinchi nuqta: foydalanuvchilar parolni qayta ishlatadi. Sizgan parol sizning platformangizda ochilsa, hujumchi uni boshqa servislarda sinaydi (credential stuffing, 43-dars). Sizning bazangiz yomon himoyalangan bo'lsa, boshqa kompaniyalar akkauntlari ham sizdan zarar ko'radi. OWASP Top 10:2025 da A07 Authentication Failures va A04 Cryptographic Failures shu kesishmada turadi.

Uchinchi nuqta: bu mavzuda "o'zimizniki" yechim yozish eng ko'p uchraydigan xato. `sha256(salt + parol)` ham, `sha256(sha256(parol))` ham, "sirli" aralashmalar ham xavfsiz emas. Bunday sxemaning kamchiligi shundaki, ular tez: SHA-256 uchun ixtisoslashgan qurilmalar juda katta tezlikda nomzod sinaydi (aniq tezlik qurilmaga bog'liq va biz uni o'lchamadik). Maqsadli parol funksiyasi esa ataylab sekin va ko'pincha xotira talab qiladigan qilib yaratilgan.

## Asosiy g'oya

### Hujumchi modeli: oflayn taxmin

Parol saqlashning modeli aniq: hujumchida hash'lar bor va u o'z qurilmasida cheksiz urinib ko'ra oladi. Throttling (43-dars) uni to'xtata olmaydi, chunki server ishtirok etmaydi. Himoya faqat saqlangan qiymatning o'zida bo'lishi kerak. NIST SP 800-63-4 ham shuni talab qiladi: tekshiruvchi parollarni oflayn hujumga chidamli shaklda, ya'ni tuzlangan va tegishli funksiya bilan hash qilingan holda saqlashi shart.

Uch xossa kerak:

1. Qaytarilmaslik: hash'dan parolni to'g'ridan-to'g'ri olib bo'lmaydi.
2. Tuz (salt): har parol uchun noyob, tasodifiy qiymat. Tuz sirli emas, hash bilan birga saqlanadi. U bir xil parollarni turli hash'ga aylantiradi va umumiy jadvalni (rainbow table) foydasiz qiladi. Tuz parolni topishni qiyinlashtirmaydi, faqat hujumni har foydalanuvchi uchun alohida qilishga majbur qiladi.
3. Ish omili (work factor): har nomzod uchun hisoblash narxi. Server har kirishda bitta hash hisoblaydi, hujumchi esa nomzodlarning keng ro'yxatini. Narxni oshirish nisbatni hujumchi zarariga o'zgartiradi.

### Memory-hard funksiyalar

Faqat vaqtga tayangan funksiya (PBKDF2) GPU yoki maxsus chiplarda juda parallel bajariladi: ko'p yadro, har biriga ozgina xotira. Memory-hard funksiya (Argon2, scrypt) har hisoblash uchun sezilarli xotira talab qiladi, shuning uchun parallel nomzodlar soni xotira hajmi va o'tkazuvchanligi bilan cheklanadi. Bu mexanika; aniq tezlik farqi qurilmaga bog'liq va biz uni o'lchamadik.

Argon2 variantlari: Argon2d, Argon2i va ikkalasini aralashtiruvchi Argon2id. RFC 9106 qo'llanmasi turini bilmasangiz yoki side-channel hujumni real tahdid deb hisoblasangiz Argon2id tanlashni aytadi. OWASP ham Argon2id'ni birinchi o'ringa qo'yadi.

## Chuqurroq: parametrlar va cheklovlar

### Qaysi parametrlar

OWASP Password Storage Cheat Sheet eng kam sozlamalarni beradi:

- Argon2id: kamida 19 MiB xotira, 2 iteratsiya, parallelism 1.
- scrypt (Argon2id yo'q bo'lsa): CPU/xotira narxi parametri 2^17, blok o'lchami 8, parallelism 1.
- bcrypt (eski tizimlar): work factor 10 yoki undan yuqori, kirish chegarasi 72 bayt.
- PBKDF2 (FIPS-140 talab qilinsa): HMAC-SHA-256 bilan 600 000 yoki undan ko'p iteratsiya.

Cheat sheet Argon2id uchun bir-biriga teng himoya beradigan bir nechta minimal konfiguratsiya keltiradi, ular faqat CPU va RAM o'rtasidagi savdo: m=47104 (46 MiB) t=1; m=19456 (19 MiB) t=2; m=12288 (12 MiB) t=3; m=9216 (9 MiB) t=4; m=7168 (7 MiB) t=5, hammasida p=1. Ikkita muhim eslatma: `m` KiB'da o'lchanadi, parallelism (p) xotirani ko'paytirmaydi (xotira p ta lane'ga bo'linadi), shuning uchun p'ni oshirish taxminni sekinlashtirishga kafolat bermaydi. scrypt uchun ham shunday jadval bor: N=2^17 (128 MiB) r=8 p=1 dan N=2^13 (8 MiB) r=8 p=10 gacha. PBKDF2 iteratsiya soni ichki hash'ga bog'liq: HMAC-SHA-256 uchun 600 000, HMAC-SHA-512 uchun 220 000, HMAC-SHA-1 uchun 1 400 000 (faqat legacy, yangi tizimga tanlamang). Argon2 2015 yildagi Password Hashing Competition g'olibi. Umumiy qoida: bitta hash hisoblash bir soniyadan kam vaqt olishi kerak, aniq qiymatni esa o'z serveringizda sinab tanlaysiz.

PBKDF2 da yana bir tuzoq bor: parol HMAC blok o'lchamidan (SHA-256 uchun 64 bayt) uzun bo'lsa, u avtomatik pre-hash qilinadi. Ba'zi realizatsiyalar buni har iteratsiyada qaytadan bajaradi, natijada juda uzun parol yuborgan hujumchi serverga ancha ko'p CPU yuklaydi (cheat sheet bunga Django'dagi ommaviy zaiflikni misol qiladi). Parol uzunligiga yuqori chegara qo'yish ham shu uchun kerak; NIST ham juda uzun (megabaytli) parollarni cheklashni oqilona deb hisoblaydi.

RFC 9106 ikki tayyor variant beradi: birinchisi Argon2id, t=1, p=4 lane, 2 GiB xotira; xotira ancha kam bo'lsa ikkinchisi t=3, p=4, 64 MiB; ikkalasida ham 128 bit tuz va 256 bit chiqish. Ya'ni "minimum" (OWASP, kichik xotira) va "tavsiya" (RFC, katta xotira) turli pozitsiyalar. Haqiqiy tanlov: serveringiz bir vaqtda necha kirishni ko'tarishi kerak, bu har kirish uchun xotira va vaqt byudjetini belgilaydi. Byudjetni o'lchab oling; bir vaqtda ko'p kirish xotirani to'ldirishi mavjudlikka tahdid (DoS) bo'lishi mumkin. Parametrlarni vaqt o'tishi bilan oshirish uchun ularni hash qatori ichida saqlang.

### bcrypt chegarasi

bcrypt kirishning birinchi 72 baytidan keyingisini ishlatmaydi. Bu bir nechta oqibat beradi: juda uzun parol (parol frazasi) to'liq hisobga olinmaydi, "pre-hash" qilib uzatsangiz null baytlar muammosi chiqishi mumkin, UTF-8 belgilari 72 baytga tezroq yetadi. Quyidagi kod bcrypt'ni emas, faqat shu cheklovning mohiyatini modellaydi:

```ts run
const enc = new TextEncoder();
// Faqat modellashtirish: bcrypt kirishning birinchi 72 baytini ishlatadi.
const effective = (p: string) => enc.encode(p).slice(0, 72);
const same = (a: string, b: string) => effective(a).join() === effective(b).join();

const base = "a".repeat(72);
console.log("72 bayt + turli dum:", same(base + "X1", base + "Y2"));
console.log("qisqa parollar:", same("qisqa-1", "qisqa-2"));
// Kirill belgilari UTF-8 da 2 bayt: 36 belgi = 72 bayt.
const uz = "ж".repeat(36);
console.log("36 kirill belgisi, bayt soni:", enc.encode(uz).length);
```

```text
72 bayt + turli dum: true
qisqa parollar: false
36 kirill belgisi, bayt soni: 72
```

NIST yaxshi tekshiruvchi maksimal uzunlikka kamida 64 belgi ruxsat berishi kerakligini (SHOULD) va yagona faktorli parol uchun minimal 15 belgi (MFA'ning bir qismi bo'lsa 8) talab qilinishini yozadi (43-dars). Siz bcrypt tanlasangiz, uzunlik chegarasini ongli ravishda qo'yishingiz yoki Argon2id'ga o'tishingiz kerak.

### Eski hash'larni yangilash va needsRehash

Parametr oshganda yoki algoritm almashganda hamma hash'ni bir kechada o'zgartirib bo'lmaydi, chunki parol ochiq holda faqat kirish paytida mavjud. OWASP odatiy yo'lni shunday yozadi: foydalanuvchi keyingi marta kirganda kiritilgan parolni yangi algoritm yoki yangi ish omili bilan qayta hash qilish. Kamchiligi: kirmagan foydalanuvchining eski hash'i bazada qoladi. Ikki yechim bor. Birinchisi, uzoq vaqt faol bo'lmagan foydalanuvchilarning hash'ini o'chirib, parolni tiklashni talab qilish: xavfsiz, lekin qulay emas va qo'llab-quvvatlash xizmatiga yuk. Ikkinchisi, mavjud hash'ni yangi funksiyaning kirishi qilish, masalan `bcrypt(md5(parol))`: parolni bilish shart emas, lekin qatlamlash hash'larni sindirishni osonlashtirishi mumkin, shuning uchun bunday yozuvlar keyingi kirishda to'g'ridan-to'g'ri parol hash'i bilan almashtirilishi kerak. O'tish davrida eski va yangi algoritmlar aralash yashaydi; buni osonlashtirish uchun algoritm va ish omilini hash bilan birga standart formatda (masalan PHC string format: `$argon2id$v=19$m=19456,t=2,p=1$tuz$hash`) saqlang.

Kirishda qaror qabul qiluvchi funksiya odatda `needsRehash` deb ataladi: u saqlangan qatordan algoritm va parametrlarni o'qib, joriy siyosat bilan solishtiradi. Parol to'g'ri tasdiqlangandan keyingina chaqiriladi va `true` bo'lsa, yangi hash yoziladi. Quyida shu mantiq sof funksiya sifatida; boshlang'ich kod hech qachon yangilashni so'ramaydi, siz uni tuzating.

```ts run
type Policy = { m: number; t: number };
const POLICY: Policy = { m: 19456, t: 2 };

// PHC qatoridan Argon2id parametrlarini o'qiydi; boshqa format uchun null.
function parseArgon2id(stored: string): Policy | null {
  const x = /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$/.exec(stored);
  return x ? { m: Number(x[1]), t: Number(x[2]) } : null;
}

function needsRehash(stored: string, policy: Policy = POLICY): boolean {
  return false; // tuzating
}

console.log(needsRehash("$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaA"));
console.log(needsRehash("$2b$12$abcdefghijklmnopqrstuuxyz0123456789ABCDEFGHIJKLMNOPQR"));
```

```ts test
const ok = "$argon2id$v=19$m=19456,t=2,p=1$c2FsdA$aGFzaA";
check("siyosatga mos Argon2id yangilanmaydi", () => needsRehash(ok) === false);
check("xotirasi kam Argon2id yangilanadi", () => needsRehash("$argon2id$v=19$m=4096,t=3,p=1$c2FsdA$aGFzaA") === true);
check("iteratsiyasi kam Argon2id yangilanadi", () => needsRehash("$argon2id$v=19$m=19456,t=1,p=1$c2FsdA$aGFzaA") === true);
check("bcrypt yozuvi yangilanadi", () => needsRehash("$2b$12$abcdefghijklmnopqrstuuxyz0123456789ABCDEFGHIJKLMNOPQR") === true);
check("Argon2i yangilanadi", () => needsRehash("$argon2i$v=19$m=65536,t=3,p=1$c2FsdA$aGFzaA") === true);
check("tushunarsiz qator yangilanadi", () => needsRehash("") === true);
check("kuchliroq parametr pasaytirilmaydi", () => needsRehash("$argon2id$v=19$m=65536,t=3,p=4$c2FsdA$aGFzaA") === false);
```

### Pepper

Pepper bu server tomonidagi maxfiy qiymat (masalan, HMAC kaliti) bo'lib, bazadan alohida saqlanadi. OWASP uni qo'shimcha himoya qatlami sifatida tilga oladi, lekin yolg'iz o'zi qo'shimcha xavfsizlik xususiyati bermasligini ham qayd etadi. Bazaning o'zi sizsa (SQL injection, backup), pepper sizmagan bo'lishi mumkin: shunda hujumchi faqat baza bilan hash'larni sina olmaydi. Narxi: pepper'ni saqlash, almashtirish va yo'qotmaslik muammosi (68-69-darslar).

OWASP pepper uchun umumiy talablarni sanaydi: u barcha saqlangan parollar uchun umumiy (tuzdan farqli, har parolga alohida emas), maxfiy va hash bilan birga saqlanmaydi, uni secrets vault yoki HSM'da saqlash kerak. Eng og'ir oqibat: pepper sizsa, uni almashtirish uchun foydalanuvchi parolini bilish kerak, ya'ni amalda shu pepper bilan himoyalangan hamma foydalanuvchiga parolni majburiy tiklash kerak bo'ladi. Ikki usul bor: pre-hashing (parolga hash'lashdan oldin pepper qo'shiladi, pepper tasodifiy qiymat) va post-hashing (parol odatdagidek hash qilinadi, so'ng natija pepper kalitli HMAC bilan qayta hash qilinadi). Post-hashing bcrypt'ning 72 bayt va null bayt muammolariga duch kelmaydi. Birinchi qadam sifatida to'g'ri funksiya va parametrlar muhimroq.

## Misol: SHA-256 dan Argon2id/PBKDF2 ga

### Zaif kod

Eski modul parolni tuzsiz SHA-256 bilan saqlaydi. Quyida uch foydalanuvchi: ikkitasi bir xil parolga ega.

```ts run
const enc = new TextEncoder();
async function sha256hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(s));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// ZAIF: tuzsiz va tez. Bir xil parol bir xil hash beradi.
async function hashPassword(p: string): Promise<string> {
  return sha256hex(p);
}

const rows = [
  { email: "dispatcher@alfa.example", hash: await hashPassword("qwerty123") },
  { email: "driver1@alfa.example", hash: await hashPassword("qwerty123") },
  { email: "admin@beta.example", hash: await hashPassword("Fleet#2026!xP") },
];
console.log("bir xil parollar, bir xil hash:", rows[0].hash === rows[1].hash);
console.log("hash uzunligi:", rows[0].hash.length);
```

```text
bir xil parollar, bir xil hash: true
hash uzunligi: 64
```

### Hujum

> **Ta'lim maqsadida.** Bu hash'larni tanlab ochish usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Faraz qilaylik, shu `rows` jadvali sizdi. Hujumchi eng ko'p uchraydigan parollar ro'yxatini (bu yerda o'quv uchun to'rttasi) hash qilib, sizgan qiymatlar bilan solishtiradi. Bu hujum faqat shu darsning o'quv ma'lumotiga qarshi:

```ts run
const enc = new TextEncoder();
async function sha256hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", enc.encode(s));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
const rows = [
  { email: "dispatcher@alfa.example", hash: await sha256hex("qwerty123") },
  { email: "driver1@alfa.example", hash: await sha256hex("qwerty123") },
  { email: "admin@beta.example", hash: await sha256hex("Fleet#2026!xP") },
];

const dictionary = ["123456", "password", "qwerty123", "letmein"];
const table = new Map<string, string>();
for (const w of dictionary) table.set(await sha256hex(w), w);

for (const r of rows) console.log(r.email.padEnd(26), "->", table.get(r.hash) ?? "topilmadi");
```

```text
dispatcher@alfa.example    -> qwerty123
driver1@alfa.example       -> qwerty123
admin@beta.example         -> topilmadi
```

Ikki akkaunt bitta qidiruvda ochildi. Uzun parolli admin ro'yxatda yo'q edi, lekin tez hash bu parolni ham saqlab qolmaydi: nomzodlar ro'yxati kattalashgani sari (bu yerda emas, real hujumda) vaqt o'tadi, ish omili esa ushbu vaqtni ko'paytirish uchun mavjud.

### Tuzatilgan kod

PBKDF2-HMAC-SHA-256 (600 000 iteratsiya, OWASP'ning FIPS varianti) bilan tuzlangan, versiyalangan hash. Argon2id mavjud bo'lsa, yangi tizimda shuni tanlang; brauzer/Worker muhitida u yo'q, shu sababli bu yerda WebCrypto.

```ts run
const ITERS = 600_000;
const enc = new TextEncoder();
const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (s: string) => new Uint8Array((s.match(/../g) ?? []).map((h) => parseInt(h, 16)));

async function derive(p: string, salt: Uint8Array, iters: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(p), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: iters }, key, 256));
}
function eq(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}
async function hashPassword(p: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERS}$${hex(salt)}$${hex(await derive(p, salt, ITERS))}`;
}
async function verifyPassword(stored: string, p: string) {
  const [alg, it, salt, h] = stored.split("$");
  if (alg !== "pbkdf2" || !salt || !h) return false;
  return eq(await derive(p, unhex(salt), Number(it)), unhex(h));
}

const h1 = await hashPassword("qwerty123");
const h2 = await hashPassword("qwerty123");
console.log("bir xil parol, turli hash:", h1 !== h2);
console.log("to'g'ri parol:", await verifyPassword(h1, "qwerty123"));
console.log("noto'g'ri parol:", await verifyPassword(h1, "qwerty124"));
```

```text
bir xil parol, turli hash: true
to'g'ri parol: true
noto'g'ri parol: false
```

Nima uchun yetarli: tuz tufayli oldindan hisoblangan jadval foydasiz va bir xil parollar ko'rinmaydi; 600 000 iteratsiya har nomzodni qimmatlashtiradi; doimiy vaqtli solishtirish vaqt kanalini kamaytiradi. Yopilmagan qoldiq risk: kuchsiz parol (misol "qwerty123") baribir ro'yxatda bo'lgani uchun oflayn taxmin bilan ochilishi mumkin, faqat sekinroq. Shuning uchun parol siyosati blocklist bilan birga ishlashi kerak (43-dars). PBKDF2 xotira talab qilmaydi, shu sababli GPU'ga qarshi Argon2id kuchliroq.

Argon2id bilan Node.js'da (mashhur `argon2` paketi) shunday ko'rinadi. Bu kod tashqi paket va native modulga tayanadi, darsda ishga tushirilmaydi:

```ts
import argon2 from "argon2";

const OPTIONS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, OPTIONS);
}

export async function verifyAndUpgrade(
  stored: string,
  password: string,
  save: (newHash: string) => Promise<void>,
): Promise<boolean> {
  if (!(await argon2.verify(stored, password))) return false;
  if (argon2.needsRehash(stored, OPTIONS)) await save(await argon2.hash(password, OPTIONS));
  return true;
}
```

`memoryCost` KiB'da berilgani uchun 19456 = 19 MiB (OWASP minimumi). Natija qatori parametrlar va tuzni o'zida saqlaydi, shu sababli sozlamani oshirganda eski yozuvlar kirishda yangilanadi. `argon2` 0.45 bilan sinaganimizda: noto'g'ri parol uchun `verify` `false` qaytaradi, lekin saqlangan qator buzilgan yoki bo'sh bo'lsa `TypeError` tashlaydi (`needsRehash` ham), shuning uchun login oqimida bu holatni ushlab, "parol noto'g'ri" bilan bir xil javob bering va logga yozing; `memoryCost` yoki `timeCost` oshirilsa `needsRehash` `true` qaytaradi, `argon2i` yozuvi `argon2id` sozlamasiga nisbatan ham `true` beradi. Kutubxona standarti (`m=65536,t=3,p=4`) yuqoridagi OWASP minimumidan boshqa, shuning uchun parametrlarni har doim aniq bering.

## Qachon qo'llamaslik kerak

Hamma narsa uchun parol hash'i kerak emas. API kalitlari va tasodifiy tokenlar uchun (yuqori entropiyali, 256 bit) oddiy SHA-256 yetarli, chunki taxmin qilish mumkin emas; sekin funksiya ularni faqat sekinlashtiradi (62- va 67-darslar). Aksincha, past entropiyali narsa (PIN, 6 xonali kod) hash qilinsa ham oflayn taxmin bilan tez ochiladi, ularni hash bilan emas, urinishlar sonini cheklash bilan himoya qiling (44-dars). Ikkinchi holat: juda yuqori ish omili. Har kirishda yuzlab millisekund CPU va o'nlab MiB xotira sarflash, hujumchi parolni noto'g'ri yuborib serverni band qilishi mumkinligini bildiradi. Bunday endpoint'ga rate limit va navbat kerak (73-dars). Uchinchi holat: passkey (45-dars) ishlatiladigan akkaunt uchun saqlangan parol umuman bo'lmasligi mumkin; shunda hash saqlashning o'zi yo'qoladi.

## Stack'da: Node.js, NestJS va PostgreSQL

NestJS'da hash va tekshiruv alohida `PasswordService` ichida bo'lsin: controller va guard'lar bevosita kutubxona chaqirmasin. Bu alohida modulni almashtirishni (Argon2id'ga o'tish, parametr oshirish) bitta joyda qiladi. PostgreSQL'da `password_hash text` ustuni algoritm identifikatori va parametrlari bilan to'liq qatorni saqlasin; alohida `salt` ustuni kerak emas. Parametrlarni sozlashda serveringizdagi parallel kirishlar sonini hisoblang. Event loop'ni bloklamaslik uchun asinxron API ishlatilganda hisoblash alohida thread'da bajariladi, lekin RAM baribir sarflanadi. Hash'ni log, xato xabari va Sentry kabi servislarga yubormaslik uchun login so'rovi body'sini log filtrlariga qo'shing (79-dars). Native kutubxona (`argon2`) Node runtime'ni talab qiladi, shuning uchun parol tekshiruvini Node runtime'dagi route handler'da bajaring (bu muallifning amaliy tavsiyasi, Next.js hujjatidan tekshirilmagan).

## Xulosa

- Model: hujumchida hash'lar bor va u oflayn cheksiz urinadi; himoya faqat saqlangan qiymatda.
- Tez umumiy hash (SHA-256) parol uchun yaroqsiz; tuz, ish omili va (afzalroq) xotira talab qiladigan funksiya kerak.
- OWASP tartibi: Argon2id (kamida 19 MiB, 2 iteratsiya, 1 parallelism), keyin scrypt, eski tizimlarda bcrypt (work factor 10+, 72 bayt chegarasi), FIPS kerak bo'lsa PBKDF2-HMAC-SHA-256 (600 000+).
- RFC 9106 Argon2id uchun ikki tayyor variant beradi (2 GiB / t=1 va 64 MiB / t=3, p=4).
- Hash qatorida algoritm va parametrlarni saqlang; kirish paytida eski hash'ni yangilang.
- Pepper foydali qo'shimcha qatlam, lekin asosiy funksiya o'rnini bosmaydi; kuchsiz parolni esa faqat siyosat va throttling to'sadi.
