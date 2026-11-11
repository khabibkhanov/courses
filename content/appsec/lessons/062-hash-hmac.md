---
n: 62
slug: hash-hmac
title: "Hash funksiyalari va HMAC"
summary: "Hash funksiyasining xususiyatlari va chegaralari, kichik qiymatlar maydonida hash'ni sanab ochish, kalitli hash (HMAC) bilan pseudonimlashtirish va imzo tekshirish, constant-time taqqoslash va ASVS 5.0 bo'yicha qaysi hash'lar ruxsat etilgani."
duration: 45
sources:
  - id: t10-a04
    note: "A04:2025 tekshiriladigan savollar: eskirgan hash funksiyalari (MD5, SHA1) va kriptografik hash kerak joyda kriptografik bo'lmagan hash ishlatilishi; parollar uchun adaptiv va salt'li hash'lar"
  - id: asvs
    note: "ASVS 5.0.0 V11.4 (11.4.1, 11.4.3), V11.2.4 va Appendix C: hash, MAC va parol hash jadvallaridagi approved, legacy, disallowed holatlari"
  - id: cs-password
    note: "Password Storage Cheat Sheet: SHA-256 kabi tez hash'lar parol saqlash uchun yaramaydi, parol uchun sekin va memory-hard funksiyalar; pepper (parol hash'idan keyin HMAC kaliti sifatida ishlatiladigan umumiy sir) va uni bazadan alohida saqlash"
  - id: node-security
    note: "Node.js Security Best Practices: timing attack bo'limi, crypto.timingSafeEqual tavsiyasi"
quiz:
  - q: "Log'da haydovchi tabel raqami `sha256(tabelRaqami)` ko'rinishida yoziladi, raqam 4 xonali. Logga kirgan ichki xodim nima qila oladi?"
    options:
      - "Hech narsa: SHA-256 qaytarib bo'lmaydi"
      - "Faqat hash uzunligini ko'ra oladi"
      - "Barcha 10 000 raqamni hash qilib, loglardagi qiymatlar bilan solishtiradi va tabel raqamlarini tiklaydi"
      - "Faqat salt'ni tiklay oladi"
    answer: 2
    explain: "Hash qaytarilmaydi, lekin kirish makoni kichik bo'lsa uni to'liq sanab chiqish mumkin. Himoya kalitli hash (HMAC) yoki ma'lumotni umuman logga yozmaslik."
  - q: "Webhook imzosi `sha256(secret + body)` ko'rinishida hisoblanadi. HMAC o'rniga shu sxemaning asosiy kamchiligi nima?"
    options:
      - "SHA-256 bu maqsadda umuman ishlamaydi"
      - "Bu sxema standart HMAC konstruksiyasi emas: u xavfsizligi tahlil qilingan yagona tasdiqlangan MAC o'rniga qo'lda yig'ilgan konstruksiya"
      - "Imzo juda qisqa chiqadi"
      - "Sir ochiq matn bo'lib yuboriladi"
    answer: 1
    explain: "HMAC (RFC 2104) hash va umumiy kalitdan MAC yasash uchun standartlashtirilgan va tahlil qilingan usul. `hash(secret + body)` kabi qo'lda yig'ilgan variantda xossalar kafolatlanmaydi; shuning uchun tayyor HMAC ishlating."
  - q: "Imzoni tekshirishda `computed === received` satr taqqoslashi nima uchun tavsiya etilmaydi?"
    options:
      - "Taqqoslash vaqti mos keluvchi prefiks uzunligiga bog'liq bo'lishi mumkin va bu ma'lumotni sizdiradi; constant-time taqqoslash kerak"
      - "`===` satrlar uchun ishlamaydi"
      - "Imzo har doim base64 bo'lishi kerak"
      - "Satr taqqoslash faqat Node.js'da ruxsat etilgan"
    answer: 0
    explain: "Node.js hujjati sirli qiymatlarni taqqoslashda timing attack xavfini aytadi va crypto.timingSafeEqual'ni tavsiya qiladi. ASVS 11.2.4 ham qisqa tutashuvsiz (constant-time) operatsiyalarni talab qiladi."
  - q: "ASVS Appendix C bo'yicha HMAC-SHA-1 va HMAC-SHA-256 holati qanday?"
    options:
      - "Ikkalasi approved"
      - "Ikkalasi disallowed"
      - "HMAC-SHA-1 approved, HMAC-SHA-256 legacy"
      - "HMAC-SHA-1 legacy, HMAC-SHA-256 approved"
    answer: 3
    explain: "Appendix C jadvalida HMAC-SHA-256/384/512 approved, HMAC-SHA-1 legacy, HMAC-MD5 disallowed. Yangi kodda HMAC-SHA-256 tanlanadi."
  - q: "Fayl nazorat yig'indisi uchun CRC32 ishlatilgan va u yuklab olingan reliz fayli o'zgartirilmaganini tekshirish uchun xizmat qiladi. Bu qanday baholanadi?"
    options:
      - "Yaroqli: CRC tez va yetarli"
      - "Faqat tasodifiy xatolarni ushlaydi; hujumchi shu CRC'ni saqlaydigan o'zgartirish yasay oladi, shuning uchun kriptografik maqsad uchun yaroqsiz (ASVS: CRC disallowed)"
      - "Faqat 64 bitli CRC yaroqli"
      - "CRC faqat salt bilan yaroqli"
    answer: 1
    explain: "CRC xatolarni aniqlash uchun mo'ljallangan. A04 kriptografik hash kerak joyda kriptografik bo'lmagan hash ishlatilishini xato deb sanaydi; ASVS CRC'ni disallowed deb belgilaydi."
  - q: "Telefon raqamini bazada qidirish uchun deterministik indeks kerak, lekin raqamni ochiq saqlamoqchi emasiz. Qaysi yechim hash'ning sanash hujumidan himoya qiladi?"
    options:
      - "`sha256(telefon)` ustun sifatida"
      - "`md5(telefon + 'tuz')` bitta umumiy qat'iy 'tuz' bilan"
      - "`HMAC-SHA-256(kalit, telefon)` ustun sifatida, kalit bazadan tashqarida saqlanadi"
      - "Telefonni base64 qilish"
    answer: 2
    explain: "Kalitsiz hash (va kalit sifatida kodga yozilgan qat'iy 'tuz') hujumchi bazani o'qisa, raqamlar makonini sanab ochishga imkon beradi. Kalit bazadan alohida saqlansa, bazani o'qigan hujumchi sanay olmaydi. Qoldiq risk: kalit oshkor bo'lsa, hammasi ochiladi."
task:
  title: "Webhook imzosi: hash(secret + body) o'rniga HMAC"
  prompt: |
    Platformaga mijoz tizimidan webhook keladi; imzo `x-signature` sarlavhasida hex ko'rinishida yuboriladi. Quyidagi kod imzoni `sha256(secret + body)` bilan hisoblaydi va `===` bilan taqqoslaydi.

    Tuzating:
    1. `sign` HMAC-SHA-256 ishlatsin (`crypto.subtle`, `HMAC` / `SHA-256`), natija 64 belgili kichik harfli hex bo'lsin.
    2. `verify` imzoni constant-time usulda taqqoslasin: ikkala qiymatni baytlarga aylantirib, uzunlik farqini ham qo'shib, barcha baytlarni XOR bilan yig'sin (erta `return` yo'q).
    3. Noto'g'ri formatdagi imzo (hex emas, uzunligi boshqa) xato tashlamasdan `false` qaytarsin.

    Imzolar va `console.log`larni o'zgartirmang. Kutilgan chiqish: `true`, `false`, `false`, `false`, `64`.
  lang: ts
  starter: |
    const enc = new TextEncoder();
    const toHex = (u: Uint8Array) => [...u].map((b) => b.toString(16).padStart(2, "0")).join("");

    async function sha256hex(s: string): Promise<string> {
      return toHex(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s))));
    }

    // ZAIF: qo'lda yig'ilgan konstruksiya.
    async function sign(secret: string, body: string): Promise<string> {
      return sha256hex(secret + body);
    }

    // ZAIF: erta tutashadigan satr taqqoslash.
    async function verify(secret: string, body: string, signature: string): Promise<boolean> {
      return (await sign(secret, body)) === signature;
    }

    const secret = "demo-webhook-secret";
    const body = JSON.stringify({ vehicleId: "v1", fuel: 41 });
    const sig = await sign(secret, body);

    console.log(await verify(secret, body, sig));
    console.log(await verify(secret, body + " ", sig));
    console.log(await verify(secret, body, "zz"));
    console.log(await verify(secret, body, sig.slice(0, 63)));
    console.log(sig.length);
  solution: |
    const enc = new TextEncoder();
    const toHex = (u: Uint8Array) => [...u].map((b) => b.toString(16).padStart(2, "0")).join("");

    async function sign(secret: string, body: string): Promise<string> {
      const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      return toHex(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(body))));
    }

    function fromHex(h: string): Uint8Array | null {
      if (!/^[0-9a-f]*$/.test(h) || h.length % 2 !== 0) return null;
      return Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));
    }

    function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
      let diff = a.length ^ b.length;
      const n = Math.max(a.length, b.length);
      for (let i = 0; i < n; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
      return diff === 0;
    }

    async function verify(secret: string, body: string, signature: string): Promise<boolean> {
      const given = fromHex(signature);
      if (!given) return false;
      const expected = fromHex(await sign(secret, body))!;
      return constantTimeEqual(expected, given);
    }

    const secret = "demo-webhook-secret";
    const body = JSON.stringify({ vehicleId: "v1", fuel: 41 });
    const sig = await sign(secret, body);

    console.log(await verify(secret, body, sig));
    console.log(await verify(secret, body + " ", sig));
    console.log(await verify(secret, body, "zz"));
    console.log(await verify(secret, body, sig.slice(0, 63)));
    console.log(sig.length);
  solutionNotes: |
    - `crypto.subtle.sign("HMAC", ...)` standart HMAC konstruksiyasini ishlatadi; `secret + body` hash'i o'rniga qo'lda yig'ilgan sxema qolmaydi.
    - Taqqoslash barcha baytlarni aylanib o'tadi va uzunlik farqini ham `diff` ga qo'shadi: erta `return` yo'q. JavaScript'da bu usul vaqt sizishini kamaytiradi, lekin JIT va runtime tufayli to'liq kafolat emas; server tomonida `crypto.timingSafeEqual` (Node) afzal.
    - Noto'g'ri formatdagi imzo `fromHex` da `null` beradi va `false` bilan tugaydi, xato tashlanmaydi (fail-safe).
    - Bu faqat imzo haqiqiyligini tekshiradi. Replay (bir xil so'rovni qayta yuborish) va vaqt belgisi 75-darsda.
    - Kalit koddagi satr sifatida faqat demo uchun: real kalit secrets manager'dan keladi (69-dars).
  checklist:
    - "`sign` HMAC-SHA-256 ishlatadi va 64 belgili hex qaytaradi"
    - "O'zgargan body yoki noto'g'ri imzo `false` beradi"
    - "Hex bo'lmagan yoki qisqa imzo xato tashlamaydi"
    - "Taqqoslashda erta `return` yo'q"
    - "Constant-time yondashuvning chegarasini ayta olasiz"
---

## Muammo

Hash funksiyasi dasturchi kundalik ishlatadigan eng oddiy kriptografik asbob: fayl nazorat yig'indisi, kesh kaliti, "ma'lumotni yashirish" uchun log yozuvi, webhook imzosi. Aynan shu soddalik xavfli. Jamoada "hash qaytarib bo'lmaydi, demak xavfsiz" degan qoida yuradi va u bir holatda to'g'ri, boshqa holatda esa mutlaqo noto'g'ri.

Platformadan misol. Qo'llab-quvvatlash jamoasi haydovchi shikoyatini tahlil qilishi uchun loglarda haydovchi tabel raqami o'rniga uning hash'i yoziladi. Log tizimiga ko'p odam kiradi. Tabel raqami 4 xonali bo'lsa, SHA-256 qaytarilmasligi hech narsani o'zgartirmaydi: 10 000 ta variantni hash qilish oddiy kompyuterda qisqa vaqtda tugaydi (pastdagi demo shuni o'zi ko'rsatadi). Ikkinchi holat: partnyor tizimdan keladigan webhook `sha256(secret + body)` bilan imzolangan; imzo "ishlaydi", lekin standart konstruksiya emas, tekshiruv esa `===` bilan qilinadi. Uchinchi: reliz fayli yaxlitligi uchun CRC32 ishlatiladi.

OWASP Top 10:2025 A04 tekshiriladigan savollar ro'yxatida bularning hammasi bor: eskirgan hash funksiyalari (MD5, SHA1) ishlatilyaptimi va kriptografik hash kerak joyda kriptografik bo'lmagan hash ishlatilyaptimi. Bu dars hash'ning nimani kafolatlashini, nimani kafolatlamasligini va kalit kerak bo'lganda HMAC qanday ishlashini ko'rsatadi.

## Asosiy g'oya

### Hash nima beradi

Kriptografik hash funksiyasi ixtiyoriy uzunlikdagi kirishni qat'iy uzunlikdagi dayjestga aylantiradi. Undan odatda uch xususiyat kutiladi: preimage resistance (dayjestdan kirishni topib bo'lmaydi), second preimage resistance (berilgan kirish bilan bir xil dayjest beradigan boshqa kirish topib bo'lmaydi) va collision resistance (bir xil dayjest beradigan har qanday ikki kirishni topib bo'lmaydi). ASVS V11.4.3 shu farqni raqam bilan aytadi: agar collision resistance kerak bo'lsa (imzo, ma'lumot yaxlitligi), dayjest kamida 256 bit bo'lishi kerak; faqat second preimage resistance yetarli bo'lsa, kamida 128 bit.

Bir narsa muhim: hash determinirlangan. Bir xil kirish doim bir xil dayjest beradi, kirishdagi bitta belgi farqi esa dayjestni butunlay o'zgartiradi.

```ts run
const enc = new TextEncoder();
const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));

for (const s of ["alfa|v1", "alfa|v2", "alfa|v1"]) {
  const h = await sha256(s);
  console.log(s.padEnd(8), h.length, h.slice(0, 16));
}
```

```text
alfa|v1  64 d265a2d6938d8e02
alfa|v2  64 3b744ff5e0a61e57
alfa|v1  64 d265a2d6938d8e02
```

Uchinchi qator birinchisi bilan bir xil: shu xususiyat tufayli hash bilan solishtirish va indekslash mumkin, shu xususiyat tufayli sanash hujumi ham mumkin.

### Hash nimani bermaydi

Hash maxfiylik bermaydi, agar kirish makoni kichik yoki taxmin qilinadigan bo'lsa. Kuchli parol, 32 baytlik tasodifiy token hash'i amalda qaytarilmaydi; lekin tabel raqami, telefon raqami, davlat raqami, email manzili hash'i qaytariladi, chunki hujumchi kandidatlar ro'yxatini tuzib, har birini hash qiladi va solishtiradi. Hash o'zgartirilishdan ham o'zi himoya qilmaydi: ma'lumotni o'zgartirgan hujumchi hash'ni ham qayta hisoblaydi. Shu sababli "fayl bilan birga uning SHA-256 si" yuborilsa, hujumchi ikkalasini almashtiradi; hash faqat ishonchli kanal orqali olingan bo'lsa yaxlitlik beradi.

Hash bilan parol saqlash ham alohida masala. Parollar uchun tez hash (SHA-256 ham) yaramaydi, chunki hujumchiga ko'p urinish imkonini beradi. A04 oldini olish ro'yxati parollarni ish koeffitsiyenti (work factor) bor adaptiv va salt'li funksiyalar (Argon2, yescrypt, scrypt, PBKDF2-HMAC-SHA-512) bilan saqlashni, eski tizimlarda bcrypt bo'lsa Password Storage cheat sheet'iga qarashni aytadi; ASVS V11.4.2 ham parol uchun hisoblash jihatidan og'ir funksiyani talab qiladi. Tafsilot 42-darsda.

### Qaysi hash'lar ruxsat etilgan

ASVS 5.0.0 V11.4.1: umumiy kriptografik maqsadlar (imzo, HMAC, KDF, tasodifiy bit generatsiyasi) uchun faqat approved hash funksiyalari ishlatiladi; MD5 kabi disallowed funksiyalar hech qanday kriptografik maqsadda ishlatilmaydi. Appendix C jadvali bo'yicha:

- Approved: SHA-256, SHA-384, SHA-512, SHA-512/256, SHA3-256/384/512, SHAKE256, BLAKE2s, BLAKE2b, BLAKE3.
- Legacy: SHA-224, SHA-512/224, SHA3-224 va SHA-1. Ular HMAC, KDF, tasodifiy bit generatsiyasi va raqamli imzo uchun yaramaydi.
- Disallowed: MD4, MD5 va har qanday uzunlikdagi CRC.

Jadvaldagi eslatma: 254 bitdan qisqa dayjest berayotgan funksiyalar collision resistance kerak joyda (masalan imzo) ishlatilmasligi kerak. Shunday qilib, yangi kodda standart tanlov SHA-256 yoki undan kuchlisi.

## Chuqurroq: kalit kerak bo'lganda

### MAC va HMAC

Message Authentication Code (MAC) - umumiy sir kalit va xabardan hisoblanadigan teg. Kalitni bilgan tomon tegni tekshira oladi va uni yasay oladi; kalitni bilmagan tomon yarata olmaydi. RFC 2104 HMAC'ni ta'riflaydi: u har qanday iterativ kriptografik hash funksiyasi va umumiy sir kalit bilan xabarni autentifikatsiya qilish mexanizmi, HMAC mustahkamligi ostidagi hash funksiyasining xossalariga bog'liq. ASVS Appendix C HMAC-SHA-256, HMAC-SHA-384 va HMAC-SHA-512 ni approved deb belgilaydi; HMAC-SHA-1 legacy, HMAC-MD5 disallowed. Jadvalda boshqa approved MAC'lar ham bor (KMAC, AES-CMAC, BLAKE3 keyed mode va boshqalar), lekin web backend uchun HMAC-SHA-256 odatiy tanlov.

Nima uchun `sha256(secret + body)` emas? Bu qo'lda yig'ilgan konstruksiya va HMAC kabi tahlil qilinmagan. SHA-256 kabi Merkle-Damgard tuzilishidagi hash'larda "sir + xabar" sxemasi length extension hujumiga ochiq: tegni va xabar uzunligini bilgan hujumchi sirni bilmay turib, xabarga qo'shimcha baytlar qo'shib, yangi yaroqli teg hisoblay oladi. Bu darslik darajasidagi fakt; kurs korpusidagi manbalarda yozilmagan, shuning uchun uni umumiy bilim sifatida qabul qiling. SHA3-256 kabi funksiyalarda bu hujum yo'q, lekin HMAC hash oilasidan qat'i nazar xavfsizligi tahlil qilingan standart tanlov, shuning uchun amaliy xulosa bitta: tayyor HMAC implementatsiyasini ishlating (61-dars qoidasi).

HMAC kalitining uzunligi ham ahamiyatli. RFC 2104 bo'yicha kalit istalgan uzunlikda bo'lishi mumkin (blokdan uzun kalit avval hash qilinadi), lekin hash chiqishi uzunligidan qisqa kalit tavsiya etilmaydi, chunki u funksiyaning mustahkamligini pasaytiradi. Amalda kalit CSPRNG'dan olingan kamida 32 bayt bo'ladi (67-dars). HMAC tegini qisqartirish mumkin, lekin tekshiruv uchun ishlatiladigan tegni qisqartirmang; quyidagi misolda pseudonim 16 hex belgiga (64 bit) qisqartirilgan, chunki u faqat log yorlig'i, imzo emas.

### Pseudonimlashtirish: HMAC bilan

Yuqoridagi log misoliga qaytamiz. Maqsad: bir haydovchi loglarda bir xil belgi bilan chiqsin (tahlil uchun), lekin belgidan tabel raqamini tiklab bo'lmasin. Buning uchun kalitli hash (HMAC) kerak: kalit bo'lmasa, hujumchi kandidatlarni hash qila olmaydi. Qat'iy kod ichidagi "tuz" bu yerda yordam bermaydi: u kod bilan birga oshkor bo'ladi va hamma yozuvda bir xil. Parol tuzidan farqli, bu holatda tuzning o'rniga haqiqiy sir kalit turadi (68-69-darslar).

### Pepper: parol hash'ida HMAC

Password Storage cheat sheet'i HMAC'ning yana bir ishlatilishini beradi: pepper. Bu barcha parollar uchun umumiy sir bo'lib, parol hash'i hisoblangandan keyin uning ustidan HMAC bilan qo'llanishi mumkin (post-hashing pepper), shunda pepper HMAC kaliti vazifasini bajaradi. Cheat sheet pepper'ni bazadan alohida, secrets vault yoki HSM'da saqlashni aytadi: SQL injection yoki zaxira nusxa orqali faqat bazaga ega bo'lgan hujumchi hash'larni sindira olmaydi. Shu bilan birga cheat sheet pepper'ni salt o'rnini bosmaydigan qo'shimcha qatlam deb ataydi va uni almashtirish hamma foydalanuvchini parolini tiklashga majbur qilishini yozadi. Parol hash'ining o'zi esa baribir sekin funksiya (Argon2id, bcrypt va boshqalar) bilan hisoblanadi.

### Constant-time taqqoslash

Tegni tekshirishda hisoblangan qiymat bilan kelgan qiymat taqqoslanadi. Oddiy satr taqqoslash birinchi farq topilganda to'xtashi mumkin, va javob vaqti mos keluvchi prefiks uzunligiga bog'liq bo'ladi. Node.js hujjati bu hujumni timing attack deb ataydi (CWE-208): sirni vaqtga bog'liq operatsiyada (masalan, shartli tarmoqlanishda) ishlatganda javob vaqti ma'lumot sizdiradi, va tavsiya `crypto.timingSafeEqual` ishlatish. ASVS V11.2.4 ham operatsiyalar constant-time bo'lishini, taqqoslash va natijada qisqa tutashuv bo'lmasligini talab qiladi (Level 3). Bu hujum tarmoq shovqini ostida qanchalik amaliy ekani alohida savol; baribir arzon himoya, shuning uchun odat qiling.

## Misol: sanab ochiladigan "yashirin" log

### Zaif kod

Log yozuvlarida haydovchi `sha256(tabel)` bilan belgilanadi. Tabel raqami `D` + 4 raqam.

```ts run
const enc = new TextEncoder();
const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");

// ZAIF: kirish makoni kichik (10 000 ta qiymat), hash esa kalitsiz.
async function pseudonym(tabel: string): Promise<string> {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(tabel))).slice(0, 16);
}

const events = [
  { driver: await pseudonym("D4821"), event: "tezlik 112 km/soat" },
  { driver: await pseudonym("D0377"), event: "yoqilg'i tushishi" },
];
for (const e of events) console.log(e.driver, e.event);
```

```text
c66990cb5e2319ba tezlik 112 km/soat
a99983ec0e8c52e9 yoqilg'i tushishi
```

### Hujum

Log tizimiga kirgan ichki xodim hash'lardan tabel raqamlarini tiklamoqchi. U barcha `D0000`-`D9999` qiymatlarini hash qiladi va loglardagi bilan solishtiradi. Bu faqat shu o'quv kodining formatiga qarshi.

```ts run
const enc = new TextEncoder();
const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");
const pseudonym = async (t: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(t))).slice(0, 16);

const logged = new Set([await pseudonym("D4821"), await pseudonym("D0377")]);

const found: string[] = [];
let tries = 0;
for (let i = 0; i < 10000; i++) {
  const candidate = "D" + String(i).padStart(4, "0");
  tries++;
  if (logged.has(await pseudonym(candidate))) found.push(candidate);
}
console.log("urinishlar:", tries);
console.log("tiklangan tabel raqamlari:", found.join(", "));
```

```text
urinishlar: 10000
tiklangan tabel raqamlari: D0377, D4821
```

Ikkala haydovchi ham aniqlandi. Salt qo'shilganda ham (hamma yozuv uchun bir xil qat'iy tuz) vaziyat o'zgarmaydi: tuz ma'lum bo'lsa, hujum faqat bitta qo'shimcha qatorga o'zgaradi.

### Tuzatilgan kod

Pseudonim HMAC-SHA-256 bilan hisoblanadi, kalit logdan va kodning ochiq qismidan tashqarida. Quyida kalit demo uchun qat'iy, real tizimda secrets manager'dan olinadi. Webhook imzosi uchun ham xuddi shu primitive ishlatiladi: `subtle.verify` tegni tekshiradi.

```ts run
const enc = new TextEncoder();
const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");

const hmacKey = (secret: string) =>
  crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

async function pseudonym(secret: string, tabel: string): Promise<string> {
  const key = await hmacKey(secret);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(tabel))).slice(0, 16);
}

const SERVER_SECRET = "demo-log-key-do-not-use"; // real tizimda: secrets manager
const logged = new Set([await pseudonym(SERVER_SECRET, "D4821"), await pseudonym(SERVER_SECRET, "D0377")]);

// Kalitsiz hujumchi: oldingi sanash hujumi (oddiy SHA-256).
const plain = async (t: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(t))).slice(0, 16);
let hits = 0;
for (let i = 0; i < 10000; i++) if (logged.has(await plain("D" + String(i).padStart(4, "0")))) hits++;
console.log("kalitsiz sanash natijasi:", hits);

// Imzo tekshiruvi: subtle.verify xabar o'zgarsa false beradi.
const key = await hmacKey("demo-webhook-secret");
const msg = enc.encode('{"vehicleId":"v1","fuel":41}');
const tag = await crypto.subtle.sign("HMAC", key, msg);
console.log("asl xabar:", await crypto.subtle.verify("HMAC", key, tag, msg));
console.log("o'zgargan xabar:", await crypto.subtle.verify("HMAC", key, tag, enc.encode('{"vehicleId":"v1","fuel":99}')));
```

```text
kalitsiz sanash natijasi: 0
asl xabar: true
o'zgargan xabar: false
```

Nima uchun yetarli: hujumchi bazadagi yoki logdagi pseudonimlarni ko'radi, lekin HMAC kalitisiz kandidat qiymatlar uchun pseudonim hisoblay olmaydi, shuning uchun sanash hujumi natija bermaydi (nol topilma). Bir haydovchi hamma yozuvda bir xil belgi bilan chiqadi, tahlil mumkin. Webhook uchun: xabar bitta bayt o'zgarsa, teg mos kelmaydi.

Nimani yopmaydi. Kalit oshkor bo'lsa (kod, `.env`, CI log), hujumchi sanashni qayta boshlaydi, shuning uchun kalit boshqaruvi (68-69-darslar) hal qiluvchi. Pseudonimlashtirilgan ma'lumot baribir shaxsga doir ma'lumot bo'lishi mumkin: kalit egasi qayta bog'lay oladi, shuning uchun huquqiy talablar (94-dars) saqlanadi. Kalit almashtirilsa, eski pseudonimlar yangilari bilan mos kelmaydi, rotatsiya rejasi kerak. Bu kod replay'ni ham yopmaydi (75-dars).

### Mashq: constant-time taqqoslash

Quyidagi funksiya ikki bayt massivini taqqoslaydi, lekin erta tutashadi (birinchi farqda qaytadi) va oxirida keraksiz `a[0] === b[0]` sharti bor. Testlar natijasiga qarab tuzating: barcha baytlarni aylanib o'ting, farqni `diff` da yig'ing.

```ts run
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return a[0] === b[0];
}
```

```ts test
const u = (...x: number[]) => Uint8Array.from(x);
check("bir xil massivlar teng", () => constantTimeEqual(u(1, 2, 3), u(1, 2, 3)));
check("oxirgi bayt farqi - teng emas", () => !constantTimeEqual(u(1, 2, 3), u(1, 2, 4)));
check("uzunlik farqi - teng emas", () => !constantTimeEqual(u(1, 2), u(1, 2, 3)));
check("bo'sh massivlar teng", () => constantTimeEqual(u(), u()));
check("erta return yo'q: barcha baytlar o'qiladi", () => {
  let reads = 0;
  const a = new Proxy(u(1, 2, 3, 4), { get: (t: any, p) => { if (typeof p === "string" && /^\d+$/.test(p)) reads++; return t[p]; } });
  constantTimeEqual(a as Uint8Array, u(9, 2, 3, 4));
  return reads >= 4;
});
```

## Qachon qo'llamaslik kerak

Hash va HMAC o'rnini bosmaydigan joylar bor. Tez hash (SHA-256, BLAKE3) parol saqlash uchun yaramaydi; u uchun sekin va parametrlanadigan funksiya kerak (42-dars). HMAC o'z-o'zidan maxfiylik bermaydi: teg xabarni yashirmaydi, shuning uchun sezgir ma'lumotni yuborishda AEAD (63-dars) yoki TLS kerak. HMAC umumiy kalitni talab qiladi: tekshiruvchi tomon imzolay ham oladi. Agar imzoni tekshiruvchi tomon soxtalashtira olmasligi kerak bo'lsa (masalan, mijozlarga ommaviy tekshiriladigan imzo), asimmetrik raqamli imzo kerak (64-dars).

Pseudonimlashtirish anonimlashtirish emas: kalit egasi bog'lanishni tiklaydi va qidirish uchun deterministik indeks ma'lumot nusxalarini bir-biriga bog'laydi. Agar tahlil uchun haydovchi belgisi kerak bo'lmasa, uni umuman logga yozmang: saqlanmagan ma'lumot oshkor bo'lmaydi (A04 oldini olish ro'yxati shuni ham aytadi). Hash'ni shifrlash o'rnida ishlatish, ya'ni "keyin qaytarib olamiz" rejasi, mantiqan mumkin emas.

## Stack'da: Node.js, NestJS, PostgreSQL

Node.js'da HMAC uchun `crypto.createHmac("sha256", key)` yoki WebCrypto `crypto.subtle` ishlatiladi; taqqoslash uchun `crypto.timingSafeEqual` (u ikkita bir xil uzunlikdagi buffer kutadi, shuning uchun avval uzunlikni tekshiring yoki ikkala tomonni bir xil uzunlikdagi HMAC dayjestiga aylantirib oling). NestJS'da webhook kontrollerida xom (raw) body kerak: JSON parser xabarni o'zgartirishdan oldin imzo tekshirilishi kerak, aks holda qayta serializatsiya imzoni buzadi yoki tekshiruvni chetlab o'tishga yo'l ochadi. Imzo tekshiruvini guard yoki middleware'da markazlashtiring (58-dars), kalitni esa konfiguratsiyadan emas, secrets manager'dan oling.

PostgreSQL'da deterministik pseudonim ustuni (masalan telefon bo'yicha qidirish uchun) HMAC qiymati bilan to'ldiriladi; kalit ilovada qoladi, bazada emas. Shunda bazani o'qigan SQL injection hujumchisi ham telefonni sanab ola olmaydi. Next.js'da imzo tekshiruvi route handler ichida `request.text()` bilan xom matn ustida bajariladi, so'ngina JSON'ga o'giriladi.

## Xulosa

- Hash qaytarilmaydi, lekin kirish makoni kichik bo'lsa sanab ochiladi; maxfiylik kerak joyda kalitli hash (HMAC) yoki shifrlash ishlating, yoki ma'lumotni saqlamang.
- Yangi kodda SHA-256 va undan kuchli approved hash'lar; MD5 va CRC kriptografik maqsadda ishlatilmaydi, SHA-1 legacy (ASVS Appendix C).
- Parol uchun tez hash yaramaydi: Argon2id, scrypt, bcrypt yoki PBKDF2 kabi sekin funksiyalar (42-dars).
- Umumiy kalit bilan yaxlitlik uchun standart HMAC-SHA-256; `hash(secret + body)` kabi qo'lda yig'ilgan sxemadan saqlaning.
- Tegni constant-time usulda taqqoslang (`crypto.timingSafeEqual`), noto'g'ri formatni xatosiz `false` bilan rad eting.
- HMAC kaliti sirdir: uning xavfsizligi kalit boshqaruviga bog'liq (68-69-darslar), replay himoyasi esa alohida nazorat (75-dars).
