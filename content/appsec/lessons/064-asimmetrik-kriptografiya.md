---
n: 64
slug: asimmetrik-kriptografiya
title: "Asimmetrik kriptografiya: kalit almashish va raqamli imzo"
summary: "Ochiq va maxfiy kalit juftligi: ECDH bilan umumiy kalit kelishish va forward secrecy, autentifikatsiyasiz almashishning MITM zaifligi, raqamli imzo (ECDSA, EdDSA, RSA-PSS) va hash bilan yaxlitlik tekshiruvidan farqi, ASVS 5.0 bo'yicha approved algoritmlar va kvant tahdidi."
duration: 50
sources:
  - id: t10-a04
    note: "A04:2025: 'How to prevent' ro'yxati (forward secrecy ciphers, PKCS#1 v1.5 kabi eskirgan sxemalardan qochish, post-quantum tayyorgarlik) va tekshiriladigan savollar (algoritm downgrade yoki aylanib o'tilishi)"
  - id: rfc8446
    note: "RFC 8446 1.2: statik RSA va Diffie-Hellman suitelari olib tashlangan, barcha ochiq kalit asosidagi kalit almashish forward secrecy beradi; 4.4.3 CertificateVerify: maxfiy kalitga egalikning aniq isboti va handshake yaxlitligi"
  - id: fips204
    note: "FIPS 204 abstract: raqamli imzo o'zgartirishni aniqlash va imzolovchini autentifikatsiya qilish uchun, ML-DSA kvant kompyuteriga qarshi ham xavfsiz deb hisoblanadi, non-repudiation"
  - id: asvs
    note: "ASVS 5.0.0 V11.6 (11.6.1, 11.6.2), V11.2.3 va Appendix C: key exchange sxemalari, DH guruhlari, imzo algoritmlari jadvallari va ekvivalent xavfsizlik darajalari"
  - id: cs-crypto-storage
    note: "Cryptographic Storage cheat sheet: ochiq kalit shifrlash uchun HPKE kabi hybrid sxema, X25519 faqat kalit kelishish, RSA kamida 2048 bit va OAEP, RSA/ECC post-quantum emas"
quiz:
  - q: "Yangilanish fayli va uning SHA-256 hash'i bir xil joyda (bir serverda) joylashgan. Qurilma hash'ni tekshirib faylni qabul qiladi. Serverga yozish huquqini olgan hujumchi nima qiladi?"
    options:
      - "Hech narsa: hash o'zgartirilgan faylni aniqlaydi"
      - "Faqat faylni o'zgartira oladi, hash'ni emas"
      - "Faylni o'zgartiradi va hash'ni qayta hisoblab almashtiradi, qurilma buni sezmaydi"
      - "Hash'ni tiklab asl faylni topadi"
    answer: 2
    explain: "Hash kalitsiz hisoblanadi, shuning uchun hujumchi uni o'zi hisoblaydi. Yaxlitlik uchun imzo kerak: tekshiruvchida faqat ochiq kalit bo'ladi va hujumchi imzo yarata olmaydi."
  - q: "Ikki tomon ephemeral ECDH bilan umumiy kalit kelishdi, lekin ochiq kalitlar autentifikatsiya qilinmadi. Ularning kanalini boshqaradigan hujumchi nima qila oladi?"
    options:
      - "Hech narsa: ECDH MITM'dan himoyalaydi"
      - "Ikkala tomonga o'z ochiq kalitini taqdim etib, ikki alohida umumiy kalit yaratadi va trafikni o'qiy oladi"
      - "Faqat trafikni to'xtata oladi"
      - "Maxfiy kalitlarni ochiq kalitdan tiklaydi"
    answer: 1
    explain: "ECDH ikki tomonga umumiy sirni beradi, kim bilan ekanini emas. Autentifikatsiya (imzo yoki sertifikat) bo'lmasa, hujumchi har tomon bilan alohida kalit kelishadi."
  - q: "Forward secrecy nima beradi?"
    options:
      - "Server kalitini abadiy yashiradi"
      - "Hujumchi imzoni soxtalashtira olmaydi"
      - "Sessiyalar tezroq ochiladi"
      - "Uzoq muddatli maxfiy kalit keyinroq oshkor bo'lsa ham, o'tgan sessiyalar yozib olingan bo'lsa ham ular ochilmaydi, chunki sessiya kaliti vaqtinchalik kalitlardan kelgan"
    answer: 3
    explain: "Ephemeral kalitlar sessiyadan keyin yo'q qilinadi. ASVS Appendix C jadvalida ECDH forward secrecy beradi, RSA PKCS#1 v1.5 kalit transporti esa yo'q (disallowed)."
  - q: "ASVS Appendix C imzo jadvaliga ko'ra qaysi to'plam to'g'ri?"
    options:
      - "EdDSA, ECDSA (P-256 va yuqori) va RSA-PSS approved; RSA PKCS#1 v1.5 imzo va DSA disallowed"
      - "Hammasi approved"
      - "Faqat RSA PKCS#1 v1.5 approved"
      - "DSA approved, EdDSA disallowed"
    answer: 0
    explain: "Jadvalda EdDSA, XEdDSA, ECDSA (P-256/384/521) va RSA-PSS approved; RSA-SSA-PKCS#1 v1.5 va har qanday DSA disallowed."
  - q: "Konfiguratsiya mashina qurilmasi uchun imzolangan, lekin imzo faqat payload ustidan hisoblangan. Hujumchi qonuniy konfiguratsiyani va imzoni ushlab, boshqa qurilmaga yuboradi. Nima uchun qabul qilinadi?"
    options:
      - "Imzo boshqa qurilma kalitiga bog'lanadi"
      - "Imzo kontekst (qurilma, versiya)ni qamramaydi: bir xil payload va imzo boshqa kontekstda ham to'g'ri tekshiriladi"
      - "ECDSA replay'ni avtomatik to'sadi"
      - "Qurilmalar bir xil hash ishlatadi"
    answer: 1
    explain: "Imzo faqat imzolangan baytlarni himoya qiladi. Kontekst va versiya imzolanadigan xabarga kirmasa, xabar boshqa joyda ishlatilishi (replay, cross-context) mumkin."
  - q: "Yangi tizim 2026 yilda RSA-2048 kalit almashishidan ECDH P-256'ga o'tmoqda. Post-quantum nuqtai nazaridan bu o'tish nimani hal qiladi?"
    options:
      - "Kvant kompyuteriga qarshi to'liq himoya beradi"
      - "Faqat imzoni himoya qiladi"
      - "Hech narsani: RSA ham, ECC ham kvant tahdidiga ochiq; post-quantum himoya ML-KEM kabi mexanizmlar bilan alohida o'tishni talab qiladi (70-dars)"
      - "Faqat RSA-4096 himoya qiladi"
    answer: 2
    explain: "Cryptographic Storage cheat sheet RSA va ECC (shu jumladan Curve25519) post-quantum xavfsiz emasligini yozadi. P-256 ga o'tish klassik samaradorlik va forward secrecy beradi, kvant tahdidini hal qilmaydi."
task:
  title: "Imzolangan konfiguratsiya: kontekst va versiya"
  prompt: |
    Qurilmalarga konfiguratsiya serverdan keladi. Server ECDSA P-256 bilan imzolaydi, qurilma ochiq kalit bilan tekshiradi. Hozirgi kod imzoni faqat `payload` ustidan hisoblaydi.

    Muammo: bitta qurilma uchun berilgan imzolangan konfiguratsiya boshqa qurilmaga ham o'tadi, eski (yoki xuddi shu) versiya qayta yuborilsa ham qabul qilinadi.

    Tuzating:
    1. Imzolanadigan xabar `deviceId`, `version` va `payload`ni qamrasin; maydonlar bir-biridan aniq ajratilsin (masalan, uzunlik bilan, `deviceId|version|payload` ajratgichi ma'lumotda bo'lishi mumkinligini hisobga oling).
    2. `verifyConfig` joriy o'rnatilgan versiyadan qat'iy yangi bo'lmagan versiyani rad etsin.
    3. Har qanday xatoda xato tashlamasdan `false` qaytarsin.

    Imzolar va `console.log`larni o'zgartirmang. Kutilgan chiqish: `true`, `false`, `false`, `false`, `true`.
  lang: ts
  starter: |
    const enc = new TextEncoder();
    const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");
    const unhex = (h: string) => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));
    const keys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
    const alg = { name: "ECDSA", hash: "SHA-256" };

    // ZAIF: faqat payload imzolanadi.
    async function signConfig(deviceId: string, version: number, payload: string): Promise<string> {
      return hex(await crypto.subtle.sign(alg, keys.privateKey, enc.encode(payload)));
    }

    async function verifyConfig(
      deviceId: string, version: number, payload: string, sig: string, installedVersion: number,
    ): Promise<boolean> {
      try {
        return await crypto.subtle.verify(alg, keys.publicKey, unhex(sig), enc.encode(payload));
      } catch {
        return false;
      }
    }

    const sig = await signConfig("v1", 7, "interval=30");
    console.log(await verifyConfig("v1", 7, "interval=30", sig, 6));
    console.log(await verifyConfig("v2", 7, "interval=30", sig, 6));
    console.log(await verifyConfig("v1", 7, "interval=5", sig, 6));
    console.log(await verifyConfig("v1", 7, "interval=30", sig, 7));
    console.log(await verifyConfig("v2", 8, "interval=30", await signConfig("v2", 8, "interval=30"), 7));
  solution: |
    const enc = new TextEncoder();
    const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");
    const unhex = (h: string) => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));
    const keys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
    const alg = { name: "ECDSA", hash: "SHA-256" };

    // Maydonlar uzunlik bilan ajratiladi: "a|b" va "a" + "|b" aralashmaydi.
    function message(deviceId: string, version: number, payload: string): Uint8Array {
      const field = (s: string) => `${s.length}:${s}`;
      return enc.encode(["config-v1", field(deviceId), field(String(version)), field(payload)].join("|"));
    }

    async function signConfig(deviceId: string, version: number, payload: string): Promise<string> {
      return hex(await crypto.subtle.sign(alg, keys.privateKey, message(deviceId, version, payload)));
    }

    async function verifyConfig(
      deviceId: string, version: number, payload: string, sig: string, installedVersion: number,
    ): Promise<boolean> {
      try {
        if (!Number.isInteger(version) || version <= installedVersion) return false;
        return await crypto.subtle.verify(alg, keys.publicKey, unhex(sig), message(deviceId, version, payload));
      } catch {
        return false;
      }
    }

    const sig = await signConfig("v1", 7, "interval=30");
    console.log(await verifyConfig("v1", 7, "interval=30", sig, 6));
    console.log(await verifyConfig("v2", 7, "interval=30", sig, 6));
    console.log(await verifyConfig("v1", 7, "interval=5", sig, 6));
    console.log(await verifyConfig("v1", 7, "interval=30", sig, 7));
    console.log(await verifyConfig("v2", 8, "interval=30", await signConfig("v2", 8, "interval=30"), 7));
  solutionNotes: |
    - Imzolanadigan xabar `deviceId`, `version` va `payload`ni uzunlik prefiksi bilan qamraydi, shuning uchun boshqa qurilma yoki boshqa versiya uchun imzo yaroqsiz. Prefiks `config-v1` esa shu imzo ishlatiladigan maqsadni belgilaydi (domain separation): xuddi shu kalit bilan boshqa turdagi xabar imzolansa, ular aralashmaydi.
    - Versiya tekshiruvi (`version > installedVersion`) eski yoki bir xil konfiguratsiyani qayta o'rnatishni (rollback, replay) to'sadi. Imzoning o'zi buni qila olmaydi.
    - Xatoda `false`: noto'g'ri hex, noto'g'ri imzo uzunligi yoki boshqa istisno xato bermaydi.
    - Bu hali qurilma ochiq kalitini qanday ishonchli o'rnatish (pinning, firmware ichida) va imzo kalitini qanday saqlash/almashtirish masalasini hal qilmaydi (66 va 68-darslar).
  checklist:
    - "Imzolanadigan xabarda `deviceId`, `version` va `payload` bor va maydon chegaralari aniq"
    - "Boshqa qurilma uchun yoki o'zgargan payload bilan tekshiruv `false` beradi"
    - "Joriy versiyadan eski yoki teng versiya rad etiladi"
    - "Xatoda istisno tashlanmaydi"
    - "Imzo nimani himoya qilishi va qilmasligini ayta olasiz"
---

## Muammo

Simmetrik kriptografiyada ikki tomon bitta kalitni bilishi kerak (62-63 darslar). Kalitni qanday yetkazish masalasi darhol paydo bo'ladi: ochiq kanal orqali yuborsangiz, hujumchi ushlaydi; yashirin kanal bo'lsa, shifrlashga hojat qolmasdi. Va ikkinchi muammo: HMAC bilan imzolangan xabarni tekshira oladigan har kim uni yarata ham oladi, shuning uchun "bu xabarni aynan shu tomon yozgan" deb ayta olmaysiz.

Avtopark platformasida bu har kuni uchraydi. Telematika qurilmasi serverga ulanadi va hech qachon uchrashmagan tomonlar umumiy kalit kelishishi kerak. Qurilmaga yangi firmware yoki konfiguratsiya yuboriladi va qurilma uning haqiqatan ishlab chiqaruvchidan kelganini tekshirishi kerak, lekin qurilmada ishlab chiqaruvchining imzo kalitini saqlash mumkin emas (qurilmani qo'lga kiritgan hujumchi uni olardi). Mijozning API serveri ichki servisga so'rovni "men yuboryapman" deb isbotlashi kerak, va bu isbot keyinroq auditda ham tekshirilishi mumkin bo'lishi kerak.

Asimmetrik kriptografiya (ochiq kalitli kriptografiya) bu ikki muammoni hal qiladi: kalit juftligida maxfiy kalit egasida qoladi, ochiq kalit esa hammaga beriladi. ASVS 5.0.0 V11.6 bo'limi shunday izohlaydi: ochiq kalitli kriptografiya umumiy sir kalitni bir nechta tomon orasida bo'lishish mumkin bo'lmagan yoki istalmagan joyda ishlatiladi. Bu dars ikki asosiy ishni ko'radi: kalit kelishish va raqamli imzo.

## Asosiy g'oya

### Kalit juftligi

Kalit juftligi ikki qismdan iborat. Maxfiy kalit (private key) hech qachon egasini tark etmaydi. Ochiq kalit (public key) ochiq tarqatiladi. Ularning matematik bog'liqligi shundayki, ochiq kalitdan maxfiy kalitni hisoblash amalda mumkin emas. Bu bog'liqlikdan ikki asosiy imkoniyat chiqadi:

- Kalit kelishish (key agreement, ECDH): ikki tomon bir-birining ochiq kalitidan va o'zining maxfiy kalitidan bir xil umumiy sirni hisoblaydi. Umumiy sir tashqaridan ko'rinmaydi, chunki hujumchi faqat ikki ochiq kalitni ko'radi. Umumiy sirdan KDF (HKDF) bilan simmetrik kalit chiqariladi va qolgan trafik AEAD bilan himoyalanadi (63-dars).
- Raqamli imzo: maxfiy kalit egasi xabarga imzo qo'yadi, ochiq kalitga ega har kim uni tekshiradi. Imzo xabar o'zgarmaganini va imzolovchi maxfiy kalitga ega ekanini ko'rsatadi. FIPS 204 abstract'i ham shuni yozadi: raqamli imzo ruxsatsiz o'zgartirishni aniqlash va imzolovchini autentifikatsiya qilish uchun ishlatiladi, shuningdek qabul qiluvchi imzoni uchinchi tomonga dalil sifatida ko'rsata oladi (non-repudiation).

Ochiq kalitli shifrlash ham mavjud, lekin amaliyotda u alohida ishlatilmaydi. Cryptographic Storage cheat sheet'i ochiq kalitli shifrlash uchun HPKE (Hybrid Public Key Encryption) kabi tasdiqlangan hybrid sxemani tavsiya qiladi: u kalit o'rnatish, kalit chiqarish va autentifikatsiyalangan simmetrik shifrlashni birlashtiradi. X25519 faqat kalit kelishish primitive'i, ma'lumotni o'zi shifrlamaydi. RSA kerak bo'lsa, kalit kamida 2048 bit va OAEP to'ldirish bilan; paddingsiz RSA ishlatilmaydi.

### Approved algoritmlar

ASVS Appendix C jadvallari bo'yicha:

- Kalit kelishish: ECDH (kalit kamida 256-383 bitlik diapazonda, ya'ni P-256 va undan yuqori) va FFDH (L >= 3072, N >= 256) approved va ikkalasi ham forward secrecy beradi. RSA PKCS#1 v1.5 bilan shifrlangan kalit transporti disallowed va forward secrecy bermaydi. IKEv1 productionda ishlatilmasligi kerak.
- Guruhlar: P-256, P-384, P-521, Curve25519, Curve448 va ffdhe guruhlari (2048 dan 8192 gacha) approved ro'yxatda.
- Imzo: EdDSA (Ed25519, Ed448), XEdDSA, ECDSA (P-256, P-384, P-521) va RSA-PSS approved; RSA-SSA-PKCS#1 v1.5 va DSA disallowed.
- Xavfsizlik darajasi: ASVS 11.2.3 kamida 128 bit talab qiladi va misol keltiradi: 256 bitli ECC kaliti qariyb 128 bit daraja beradigan joyda RSA uchun 3072 bit kerak. Appendix C jadvalida RSA 2048 va ECC 224-255 bit 112 bit darajaga to'g'ri keladi.

ASVS 11.6.1 kalit generatsiyasi va imzo uchun faqat approved algoritm va rejimlar ishlatilishini, generatsiya algoritmi ma'lum hujumlarga ochiq kalit yaratmasligini (misol: Fermat faktorizatsiyasiga zaif RSA kalitlari) talab qiladi. 11.6.2 kalit almashish xavfsiz parametrlar bilan bo'lishini talab qiladi, shunda o'rtadagi hujumchi (adversary-in-the-middle) yoki kriptografik buzilish bo'lmaydi.

### Forward secrecy

Kalit kelishishda ikki xil yondashuv bor. Statik: server doimiy kalit juftligi bilan umumiy sirni hisoblaydi; maxfiy kalit keyinroq oshkor bo'lsa, o'tmishda yozib olingan butun trafik ochiladi. Ephemeral: har sessiyada yangi kalit juftligi yaratilib, sessiya tugagach yo'q qilinadi; uzoq muddatli kalit keyin oshkor bo'lsa ham o'tgan sessiyalar ochilmaydi. Bu xususiyat forward secrecy deyiladi. TLS 1.3 shuni majburiy qilgan: RFC 8446 1.2 statik RSA va Diffie-Hellman suitelari olib tashlanganini va endi barcha ochiq kalit asosidagi kalit almashish mexanizmlari forward secrecy berishini yozadi (65-dars). OWASP A04 oldini olish ro'yxati ham forward secrecy (FS) shifrlarini talab qiladi.

## Chuqurroq: autentifikatsiyasiz almashish va imzoning chegarasi

### ECDH autentifikatsiya qilmaydi

ECDH ikki tomonga umumiy sirni beradi, lekin ular kim bilan gaplashayotganini aytmaydi. Kanalni boshqaradigan hujumchi (Mallory) ikkala tomonga ham o'z ochiq kalitini taqdim etadi va har tomon bilan alohida umumiy kalit kelishadi. Quyidagi kodda bu o'quv misolida ko'rinadi.

```ts run
const gen = () => crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);
const derive = async (priv: CryptoKey, pub: CryptoKey) =>
  [...new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: pub }, priv, 256))]
    .map((b) => b.toString(16).padStart(2, "0")).join("");

const alice = await gen();
const bob = await gen();
const mallory = await gen();

// Oddiy holat: ikkala tomon bir xil sirni hisoblaydi.
console.log("Alice va Bob umumiy sir bir xil:", (await derive(alice.privateKey, bob.publicKey)) === (await derive(bob.privateKey, alice.publicKey)));

// MITM: Alice Bob deb Mallory kalitini oladi, Bob ham Mallory kalitini oladi.
const aliceSecret = await derive(alice.privateKey, mallory.publicKey);
const bobSecret = await derive(bob.privateKey, mallory.publicKey);
console.log("Mallory Alice bilan umumiy sirga ega:", aliceSecret === (await derive(mallory.privateKey, alice.publicKey)));
console.log("Mallory Bob bilan umumiy sirga ega:", bobSecret === (await derive(mallory.privateKey, bob.publicKey)));
console.log("Alice va Bob sirlari bir xil:", aliceSecret === bobSecret);
```

```text
Alice va Bob umumiy sir bir xil: true
Mallory Alice bilan umumiy sirga ega: true
Mallory Bob bilan umumiy sirga ega: true
Alice va Bob sirlari bir xil: false
```

Alice va Bob umumiy sirlari endi har xil, lekin ikkalasi ham o'zini xavfsiz deb hisoblaydi, Mallory esa har ikkisini ochib, trafikni uzatib turadi. Yechim: ochiq kalit haqiqatan kimniki ekanini tasdiqlash. TLS'da server o'z handshake'ini sertifikat bilan bog'langan kalit bilan imzolaydi; RFC 8446 4.4.3 CertificateVerify xabarini shunday ta'riflaydi: endpoint sertifikatga mos maxfiy kalitga egaligining aniq isboti, shuningdek handshake'ning shu paytgacha yaxlitligini ta'minlaydi. Sertifikat va ishonch zanjiri 66-darsda.

### Imzo nimani kafolatlaydi

Imzo faqat imzolangan baytlarni himoya qiladi. Bundan uchta amaliy qoida kelib chiqadi. Birinchisi, nimaning ustidan imzo qo'yilganini aniq belgilang: kontekst (qurilma, tenant, versiya, maqsad) imzolanadigan xabarga kirishi kerak, aks holda xabar boshqa joyda yaroqli bo'lib qoladi. Ikkinchisi, imzolangan maydonlar chegarasi noaniq bo'lmasin: `a|b` + `c` va `a` + `b|c` bir xil baytlar bersa, hujumchi chegarani siljitadi; uzunlik prefiksi yoki aniq serializatsiya kerak. Uchinchisi, imzo replay'dan himoyalamaydi: eski haqiqiy xabarni qayta yuborish imzoni buzmaydi, shuning uchun versiya, vaqt yoki bir martalik identifikator va qabul qiluvchi tomonda holat tekshiruvi kerak.

Shuningdek, tekshiruvchi qaysi algoritm bilan tekshirishni o'zi belgilashi kerak, imzo bilan kelgan sarlavhadan o'qimasligi kerak. Aks holda "algoritm almashtirish" (downgrade) hujumi ochiladi; A04 tekshiriladigan savollarida ham "kriptografik algoritmni pasaytirish yoki chetlab o'tish mumkinmi" degan savol bor. Bu JWT'da algoritm chalkashligi sifatida 47-darsda qaytadi.

### Kvant tahdidi

RSA, Diffie-Hellman va elliptik egri chiziq asosidagi kriptografiya yetarlicha kuchli kvant kompyuteri paydo bo'lsa sinadi. ASVS 5.0.0 V11 kirish qismi post-quantum kriptografiya (PQC) RSA va ECC'ni buzishi kutilayotgan kvant kompyuterlariga bardosh beradigan algoritmlar ekanini yozadi. Cryptographic Storage cheat sheet'i RSA va ECC (Curve25519 ham) post-quantum xavfsiz emasligini aniq yozadi. FIPS 204 ML-DSA'ni (modul panjara asosidagi imzo) kvant kompyuteri bor raqibga qarshi ham xavfsiz deb hisoblanadigan standart sifatida beradi. Tafsilot va migratsiya rejasi 70-darsda; hozircha xulosa: ochiq kalit algoritmlari ham crypto agility talabiga kiradi (61-dars), ular almashtirilishi kerak.

## Misol: hash bilan "tekshiriladigan" yangilanish

### Zaif kod

Telematika qurilmalari konfiguratsiya yangilanishini serverdan oladi. Yangilanish bilan birga uning SHA-256 hash'i keladi, qurilma hash mos kelsa faylni qabul qiladi. Maqsad: "fayl yo'lda buzilmasin".

```ts run
const enc = new TextEncoder();
const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));

type Update = { version: number; payload: string; sha256: string };

// ZAIF: hash va fayl bir xil manbadan keladi, hash esa kalitsiz.
async function accept(u: Update): Promise<boolean> {
  return (await sha256(u.payload)) === u.sha256;
}

const payload = "report_interval=30";
const published: Update = { version: 7, payload, sha256: await sha256(payload) };
console.log("qonuniy yangilanish qabul qilindi:", await accept(published));
```

```text
qonuniy yangilanish qabul qilindi: true
```

### Hujum

Hujumchi yangilanish serveriga yozish huquqini oldi (yoki qurilma va server orasidagi kanalni boshqaradi). U faylni o'zgartiradi va hash'ni qayta hisoblaydi. Bu faqat shu o'quv qurilmasi kodiga qarshi, maqsadli URL esa `example.test` zahiralangan domen.

```ts run
const enc = new TextEncoder();
const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");
const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
type Update = { version: number; payload: string; sha256: string };
const accept = async (u: Update) => (await sha256(u.payload)) === u.sha256;

const evil = "report_interval=30;upload_url=https://collector.example.test";
const forged: Update = { version: 8, payload: evil, sha256: await sha256(evil) };
console.log("soxta yangilanish qabul qilindi:", await accept(forged));
```

```text
soxta yangilanish qabul qilindi: true
```

Qurilma o'zgartirilgan konfiguratsiyani qabul qildi: hash hujumchi qo'lida ham hisoblanadi va faylning kimdan kelganini ko'rsatmaydi.

### Tuzatilgan kod

Tuzatish: ishlab chiqaruvchi yangilanishni ECDSA P-256 bilan imzolaydi, qurilma ichida faqat ochiq kalit bor. Imzolanadigan xabar versiya va payload'ni qamraydi, qurilma esa o'rnatilgan versiyadan yangi bo'lmagan yangilanishni rad etadi.

```ts run
const enc = new TextEncoder();
const hex = (u: ArrayBuffer) => [...new Uint8Array(u)].map((b) => b.toString(16).padStart(2, "0")).join("");
const unhex = (h: string) => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));
const alg = { name: "ECDSA", hash: "SHA-256" };

const vendor = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
const attacker = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);

type Update = { version: number; payload: string; sig: string };
const msg = (version: number, payload: string) => enc.encode(`update-v1|${version}|${payload}`);
const sign = async (priv: CryptoKey, version: number, payload: string): Promise<Update> => ({
  version, payload, sig: hex(await crypto.subtle.sign(alg, priv, msg(version, payload))),
});

// Qurilma faqat vendor ochiq kalitini biladi va o'rnatilgan versiyani eslab qoladi.
async function accept(u: Update, installed: number): Promise<boolean> {
  try {
    if (u.version <= installed) return false;
    return await crypto.subtle.verify(alg, vendor.publicKey, unhex(u.sig), msg(u.version, u.payload));
  } catch {
    return false;
  }
}

const good = await sign(vendor.privateKey, 7, "report_interval=30");
console.log("qonuniy:", await accept(good, 6));

const evil = "report_interval=30;upload_url=https://collector.example.test";
console.log("payload o'zgargan, imzo eski:", await accept({ ...good, payload: evil }, 6));
console.log("hujumchi o'z kaliti bilan imzolagan:", await accept(await sign(attacker.privateKey, 8, evil), 6));
console.log("eski versiyani qayta yuborish:", await accept(good, 7));
```

```text
qonuniy: true
payload o'zgargan, imzo eski: false
hujumchi o'z kaliti bilan imzolagan: false
eski versiyani qayta yuborish: false
```

Nima uchun yetarli: qurilmada faqat ochiq kalit bor, shuning uchun hujumchi qanday fayl yozmasin, mos imzo yarata olmaydi (uchinchi qator). Payload'dagi har qanday o'zgarish imzoni buzadi (ikkinchi qator). Versiya xabar ichida imzolangan va qurilma o'rnatilgan versiyani eslab qoladi, shuning uchun eski qonuniy yangilanishni qayta yuborish ham rad etiladi (to'rtinchi qator).

Nimani yopmaydi. Birinchidan, qurilma ochiq kalitga ishonishi kerak: u qurilma ishlab chiqarilganda firmware ichiga qo'yiladi yoki sertifikat zanjiri orqali tekshiriladi (66-dars); hujumchi ochiq kalitni almashtira olsa, hamma narsa buziladi. Ikkinchidan, vendor maxfiy imzo kaliti himoyalanishi kerak (68-dars): u oshkor bo'lsa, hujumchi qonuniy imzo yaratadi va kalitni almashtirish rejasi bo'lishi shart. Uchinchidan, imzo yangilanishning mazmuni xavfsiz ekanini kafolatlamaydi, faqat u egasi tomonidan imzolanganini. To'rtinchidan, qurilma vaqt yoki holat saqlay olmasa, versiya tekshiruvi ishlamaydi.

## Qachon qo'llamaslik kerak

Asimmetrik kriptografiya sekinroq va murakkabroq. Ma'lumotning katta qismini ochiq kalit bilan shifrlamaysiz: kalit kelishadi, ma'lumot esa simmetrik AEAD bilan shifrlanadi. Ichki, ikkala tomon ham sizning nazoratingizda bo'lgan servislar orasida, kalitni xavfsiz tarqatish allaqachon yechilgan bo'lsa (secrets manager), HMAC soddaroq va tezroq. Lekin tekshiruvchi tomon imzolay olmasligi kerak bo'lgan har joyda (qurilmalar, mijozlar, uchinchi tomon, ommaviy tekshiruv) imzo kerak: HMAC kaliti tekshiruvchida ham bo'lgani uchun u soxta xabar yaratishi mumkin.

Qo'lda yozilgan protokol ham tavsiya etilmaydi: kalit almashish va imzoni birlashtirish (autentifikatsiyalangan kalit kelishish) TLS 1.3, Noise yoki HPKE kabi tasdiqlangan protokollarda bor. Siz yig'ganingiz hujum sirtini oshiradi (61-dars qoidasi). Va ochiq kalit algoritmlarini abadiy xavfsiz deb hisoblamang: kvant tahdidi uzoq muddat maxfiy qolishi kerak ma'lumotlar uchun hozirdan reja talab qiladi (70-dars).

## Stack'da: Node.js va Next.js

Node.js'da `crypto.generateKeyPair`, `crypto.sign`/`verify`, `crypto.diffieHellman` va WebCrypto (`generateKey`, `deriveBits`, `sign`, `verify`) mavjud. WebCrypto ECDSA imzosi xom `r||s` formatida qaytaradi, shuning uchun JWT/JWS kutubxonalari bilan o'zaro ishlaganda format farqiga e'tibor bering. Imzo tekshiruvchi kodni bitta joyda saqlang va algoritmni konfiguratsiyada qat'iy belgilang: tekshiruvchi algoritmni kelgan ma'lumotdan o'qimasin.

NestJS'da ichki servislar orasida mTLS (66-dars) ko'p hollarda alohida imzolangan so'rovlardan oddiyroq. Webhook yoki qurilma yangilanishi kabi tashqi tomon uchun ochiq kalit tekshiruvi guard darajasida bajariladi. Next.js'da imzo tekshiruvi server tomonida (route handler yoki server action) bo'lishi kerak; ochiq kalit klientga berilishi mumkin, lekin klient tekshiruvi serverdagi tekshiruv o'rnini bosmaydi. Imzo kalitlarining saqlanishi va rotatsiyasi 68-darsda, ochiq kalitlarni JWKS kabi formatda tarqatish 47 va 49-darslarda.

## Xulosa

- Asimmetrik kriptografiya ikki ish uchun: kalit kelishish (ECDH, so'ng HKDF va AEAD) va raqamli imzo (EdDSA, ECDSA, RSA-PSS). Ochiq kalitli shifrlash uchun tayyor hybrid sxema (HPKE) ishlatiladi.
- ASVS Appendix C: ECDH P-256 va undan yuqori, EdDSA, ECDSA va RSA-PSS approved; RSA PKCS#1 v1.5 va DSA disallowed. Kamida 128 bit xavfsizlik darajasi talab qilinadi.
- Ephemeral kalit kelishish forward secrecy beradi; TLS 1.3 uni majburiy qilgan.
- ECDH autentifikatsiya qilmaydi: ochiq kalit kimniki ekanini imzo yoki sertifikat bilan tasdiqlash kerak, aks holda MITM mumkin.
- Hash va fayl bir manbadan kelsa, yaxlitlik yo'q; imzo faqat imzolangan baytlarni himoya qiladi, shuning uchun kontekst, versiya va maydon chegarasini xabarga kiriting va replay'ni qabul qiluvchi tomonda tekshiring.
- RSA va ECC kvant tahdidiga ochiq: algoritmlar almashtirilishi mumkin bo'lsin va migratsiya reja 70-darsda.
