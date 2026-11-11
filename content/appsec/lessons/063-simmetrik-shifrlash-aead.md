---
n: 63
slug: simmetrik-shifrlash-aead
title: "Simmetrik shifrlash va AEAD"
summary: "Shifrlash rejimlari (ECB, CBC, CTR, GCM), nega faqat shifrlash yetmasligi, AEAD va associated data, nonce takrorlanishining oqibati, kalit bilan nonce chegaralari va maydon darajasida shifrlashning to'g'ri tuzilishi."
duration: 50
sources:
  - id: t10-a04
    note: "A04:2025 tekshiriladigan savollar: IV'ning e'tiborsiz qoldirilishi yoki takrorlanishi, ECB kabi xavfsiz bo'lmagan rejim, autentifikatsiyalangan shifrlash o'rniga oddiy shifrlash, parol kalit sifatida; 'How to prevent': IV bir kalit bilan ikki marta ishlatilmasin, har doim authenticated encryption"
  - id: asvs
    note: "ASVS 5.0.0 V11.3 (11.3.1-11.3.5) va Appendix C: shifrlar, AES rejimlari (GCM/CCM approved, CBC legacy, ECB/CTR/CFB/OFB disallowed) va AEAD mexanizmlari jadvali"
  - id: node-security
    note: "Node.js Security Best Practices: crypto moduli va timing-safe taqqoslash haqidagi tavsiyalar; shifrlash API'larini o'zingiz yig'masdan tayyor funksiyalardan foydalanish uchun umumiy asos"
  - id: cs-crypto-storage
    note: "Cryptographic Storage cheat sheet: algoritmlar va cipher modes bo'limlari (AES, GCM/CCM birinchi tanlov, ECB ishlatilmaydi), defense in depth"
  - id: cs-key-mgmt
    note: "Key Management cheat sheet, Cryptoperiods and Rotation: 96 bitli tasodifiy IV bilan AES-GCM'da bir kalit bilan 2^32 operatsiyadan oshmaslik tavsiyasi"
  - id: rfc8446
    note: "RFC 8446 1.2 va 5.3: TLS 1.3 faqat AEAD algoritmlarini qoldirgan; yozuv nonce'si ketma-ketlik raqamidan hosil qilinadi"
quiz:
  - q: "Telemetriya maydoni AES-256-CBC bilan shifrlanadi, kalit to'g'ri saqlanadi, IV tasodifiy. Yaxlitlik tekshiruvi yo'q. Bazaga yozish huquqiga ega hujumchi nima qila oladi?"
    options:
      - "Hech narsa: kalitsiz shifrmatnni o'qib bo'lmaydi, shuning uchun o'zgartirib ham bo'lmaydi"
      - "Shifrmatnni o'zgartiradi va ilova buni sezmay, o'zgargan ochiq matnni qabul qiladi (maxfiylik bor, yaxlitlik yo'q)"
      - "Kalitni shifrmatndan tiklaydi"
      - "Faqat IV'ni ko'radi, boshqa narsani emas"
    answer: 1
    explain: "Shifrlash maxfiylik beradi, yaxlitlik emas. Autentifikatsiyasiz rejimda shifrmatn o'zgarishi aniqlanmaydi (ASVS 11.3.3 va A04 'authenticated encryption' talabi). Kalitni tiklash bu hujum uchun shart emas."
  - q: "AES-GCM bilan ikki xabar bir kalit va bir xil nonce bilan shifrlandi. Hujumchi birinchi xabarning ochiq matnini biladi. Natija nima?"
    options:
      - "Hech narsa, GCM nonce takrorini kechiradi"
      - "Ikkinchi xabar ochiq matnini (birinchi xabar uzunligi doirasida) ochadi, chunki ikki shifrmatn XOR'i ikki ochiq matn XOR'iga teng"
      - "Faqat tegni buzadi, ochiq matnga ta'sir qilmaydi"
      - "Kalitni to'liq tiklaydi"
    answer: 1
    explain: "GCM ichida hisoblagich rejimi bor: nonce takrorlansa kalit oqimi takrorlanadi. Ma'lum ochiq matn orqali ikkinchisi ochiladi. ASVS 11.3.4 nonce'ni bir kalit va ma'lumot elementi juftligi uchun takrorlamaslikni talab qiladi."
  - q: "`associated data` (AAD) AEAD'da nima qiladi?"
    options:
      - "Ma'lumotni qo'shimcha shifrlaydi"
      - "Shifrlanmaydi, lekin teg hisobiga kiradi: noto'g'ri kontekstda ochishga urinish tegni buzadi"
      - "Nonce'ni almashtiradi"
      - "Kalitni uzaytiradi"
    answer: 1
    explain: "AAD ochiq qoladi, lekin autentifikatsiya qilinadi. Tenant, mashina va maydon nomini AAD'ga qo'ysangiz, bir qatordagi shifrmatnni boshqa qatorga ko'chirish ochishda xatoga olib keladi."
  - q: "ASVS 5.0.0 Appendix C AES rejimlari jadvaliga ko'ra qaysi variant to'g'ri?"
    options:
      - "ECB approved, GCM disallowed"
      - "GCM approved; CBC legacy (MAC bilan); ECB va CTR disallowed"
      - "Hamma rejim approved"
      - "CBC approved, GCM legacy"
    answer: 1
    explain: "Jadvalda GCM va CCM approved, CBC legacy, CCM-8, ECB, CFB, OFB va CTR disallowed. CTR autentifikatsiyasizligi uchun alohida MAC bo'lmasa yaramaydi, AEAD ichidagi hisoblagich rejimi esa ichki mexanizm."
  - q: "Servis har kuni millionlab yozuvni AES-GCM bilan, har yozuv uchun yangi tasodifiy 96 bitli nonce bilan, bitta kalit ostida shifrlaydi. Qaysi xulosa to'g'ri?"
    options:
      - "Tasodifiy nonce hech qachon to'qnashmaydi, cheklov yo'q"
      - "Bir kalit ostidagi operatsiyalar soni cheklanishi kerak (Key Management cheat sheet 2^32 ni tavsiya etadi), shuning uchun kalit rotatsiyasi rejalashtiriladi"
      - "Nonce 8 bit bo'lsa ham yetarli"
      - "Nonce faqat birinchi yozuvda kerak"
    answer: 1
    explain: "96 bitli tasodifiy nonce uchun tug'ilgan kun to'qnashuvi ehtimoli operatsiyalar soni oshgan sari ortadi. Cheat sheet bir kalit uchun 2^32 chegarasini beradi; chora - rotatsiya yoki hisoblagichga asoslangan nonce."
  - q: "Parolni to'g'ridan-to'g'ri AES kaliti sifatida ishlatish (`key = padTo32(password)`) nega xato?"
    options:
      - "AES parol uzunligini qabul qilmaydi"
      - "Parol past entropiyali: parol asosidagi kalit hosil qiluvchi KDF (sekin, salt'li) kerak, aks holda kalit sanab ochiladi"
      - "Parol faqat HMAC uchun yaroqli"
      - "Parol kalit bo'la olmaydi, hech qachon"
    answer: 1
    explain: "A04 'parollar KDF'siz kalit sifatida ishlatilyaptimi' deb tekshirishni aytadi. Parolda entropiya kam; ASVS 11.4.4 parol asosida kalit chiqarishda kalit cho'zish parametrli tasdiqlangan KDF'ni talab qiladi."
task:
  title: "Maydon shifrlash: tasodifiy nonce va kontekstga bog'lash"
  prompt: |
    Platforma haydovchi telefon raqamini bazada AES-256-GCM bilan shifrlab saqlaydi. `sealField` va `openField` ishlaydi, lekin ikki nuqsoni bor:

    1. Nonce qat'iy (hamma maydon uchun bir xil): bir xil ochiq matn bir xil shifrmatn beradi va ikki shifrmatn XOR'i ochiq matnlar XOR'ini sizdiradi.
    2. Shifrmatn kontekstga bog'lanmagan: bir qatordagi maydonni boshqa qatorga ko'chirsa ham u ochiladi.

    Tuzating: har chaqiruvda yangi tasodifiy 12 baytli nonce, shifrmatn bilan birga saqlansin (`nonce || ciphertext`); AAD sifatida `context` (masalan `alfa|v1|phone`) ishlatilsin; `openField` har qanday xatoda `null` qaytarsin. Imzolarni va `console.log`larni o'zgartirmang. Kutilgan chiqish: `true`, `true`, `false`, `true`, `true`.
  lang: ts
  starter: |
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    const STATIC_IV = new Uint8Array(12);

    // ZAIF: qat'iy nonce, AAD yo'q.
    async function sealField(context: string, plain: string): Promise<Uint8Array> {
      return new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: STATIC_IV }, key, enc.encode(plain)));
    }

    async function openField(context: string, sealed: Uint8Array): Promise<string | null> {
      try {
        return dec.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: STATIC_IV }, key, sealed));
      } catch {
        return null;
      }
    }

    const a = await sealField("alfa|v1|phone", "+998901234567");
    const b = await sealField("alfa|v1|phone", "+998901234567");
    const other = await sealField("beta|v2|phone", "+998935550101");

    console.log((await openField("alfa|v1|phone", a)) === "+998901234567");
    console.log(a.length === 13 + 16 + 12);
    console.log(a.every((x, i) => x === b[i]));
    console.log((await openField("beta|v2|phone", a)) === null);
    console.log((await openField("beta|v2|phone", other)) === "+998935550101");
  solution: |
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);

    async function sealField(context: string, plain: string): Promise<Uint8Array> {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ct = new Uint8Array(
        await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode(context) }, key, enc.encode(plain)),
      );
      return new Uint8Array([...iv, ...ct]);
    }

    async function openField(context: string, sealed: Uint8Array): Promise<string | null> {
      try {
        const iv = sealed.slice(0, 12);
        const pt = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv, additionalData: enc.encode(context) },
          key,
          sealed.slice(12),
        );
        return dec.decode(pt);
      } catch {
        return null;
      }
    }

    const a = await sealField("alfa|v1|phone", "+998901234567");
    const b = await sealField("alfa|v1|phone", "+998901234567");
    const other = await sealField("beta|v2|phone", "+998935550101");

    console.log((await openField("alfa|v1|phone", a)) === "+998901234567");
    console.log(a.length === 13 + 16 + 12);
    console.log(a.every((x, i) => x === b[i]));
    console.log((await openField("beta|v2|phone", a)) === null);
    console.log((await openField("beta|v2|phone", other)) === "+998935550101");
  solutionNotes: |
    - `crypto.getRandomValues` har chaqiruvda yangi nonce beradi; nonce sir emas, shifrmatn bilan birga saqlanadi. Bir xil ochiq matn endi turli shifrmatn beradi (uchinchi qator `false`).
    - `additionalData` shifrlanmaydi, lekin tegga kiradi: `alfa|v1|phone` bilan yopilgan maydon `beta|v2|phone` kontekstida ochilmaydi, shuning uchun qatorlar orasida ko'chirish ishlamaydi.
    - Xato bo'lsa `null`: noto'g'ri kalit, o'zgargan shifrmatn va noto'g'ri kontekst bir xil, xabar ichki tafsilot bermaydi.
    - Tasodifiy 96 bitli nonce bir kalit ostida cheklangan miqdorda xavfsiz (Key Management cheat sheet 2^32 ni keltiradi). Katta hajmda kalitni rotatsiya qiling (68-dars).
    - Kalit bu mashqda jarayon ichida yaratiladi, real tizimda u KMS/secrets manager'dan keladi va shifrmatn bilan kalit versiyasi saqlanadi.
  checklist:
    - "Har chaqiruvda yangi tasodifiy 12 baytli nonce ishlatiladi va shifrmatn bilan birga saqlanadi"
    - "Kontekst AAD sifatida uzatiladi, noto'g'ri kontekstda `openField` `null` qaytaradi"
    - "Bir xil ochiq matn ikki marta shifrlansa shifrmatnlar farq qiladi"
    - "Imzolar va `console.log`lar o'zgarmagan"
    - "Nonce takrorlanishining oqibatini va tasodifiy nonce chegarasini ayta olasiz"
---

## Muammo

Dasturchi shifrlashni odatda "ma'lumot o'qib bo'lmaydigan bo'lsin" deb tushunadi. Natijada kod `encrypt(plain)` chaqiradi, shifrmatnni bazaga yozadi, `decrypt` bilan o'qiydi va ish tamom deb hisoblanadi. Bu yondashuv uch joyda sinadi.

Birinchisi, rejim tanlovi. Eski qo'llanmalardan olingan kod `aes-256-ecb` yoki `aes-256-cbc` ishlatadi. ECB bir xil blokni bir xil shifrlaydi, shuning uchun takrorlanadigan struktura shifrmatnda ko'rinadi. CBC maxfiylik beradi, lekin yaxlitlik tekshiruvi yo'q: bazaga yozish huquqi bor odam (SQL injection, noto'g'ri sozlangan admin, orqa tomondan kelgan migratsiya) shifrmatnni o'zgartiradi va ilova buni sezmaydi. Ikkinchisi, nonce yoki IV. "Qat'iy IV qulay: bir xil maydon bir xil qiymat berib, qidirish oson" degan fikr kriptografik jihatdan fojiaga olib keladi. Uchinchisi, kontekst: shifrlangan maydon bir qatordan boshqasiga ko'chirilsa ham to'g'ri ochilsa, shifrlash tenant ajratishini ta'minlamaydi.

OWASP Top 10:2025 A04 tekshiriladigan savollarida aynan shu uch nuqta bor: initialization vector'lar e'tiborsiz qoldirilyaptimi, takrorlanyaptimi yoki yetarli darajada xavfsiz yaratilmayaptimi; ECB kabi xavfsiz bo'lmagan rejim ishlatilyaptimi; autentifikatsiyalangan shifrlash kerak joyda oddiy shifrlash ishlatilyaptimi. Bu dars AEAD (Authenticated Encryption with Associated Data) bilan shu muammolarni qanday yopishni ko'rsatadi.

## Asosiy g'oya

### Maxfiylik va yaxlitlik alohida narsalar

Oddiy simmetrik shifr (blok shifr rejimi bilan) faqat maxfiylikni beradi: kalitsiz kishi ochiq matnni bilmaydi. Yaxlitlik esa boshqa xususiyat (1-dars): ma'lumot ruxsatsiz o'zgarmaganini tekshirish. Shifrmatn o'zgartirilsa va tekshiruv bo'lmasa, ilova buzilgan ma'lumotni ishonchli deb qabul qiladi. Ba'zi rejimlarda (masalan, hisoblagich yoki CBC rejimlarida) hujumchi shifrmatndagi aniq bitlarni o'zgartirib, ochiq matnning mos bitlarini o'zgartira oladi; bu "malleability" deyiladi va aniq tafsilot rejimga bog'liq. Bundan hujum rejalari emas, qoida kerak: shifrlangan ma'lumot har doim autentifikatsiya qilinadi.

AEAD shu qoidani bitta primitive'ga jamlaydi: kalit, nonce, ochiq matn va ixtiyoriy associated data kiradi; shifrmatn va autentifikatsiya tegi chiqadi. Ochishda teg tekshiriladi va mos kelmasa, butun operatsiya xato bilan tugaydi, qisman natija berilmaydi. ASVS 5.0.0 V11.3.3: shifrlangan ma'lumot ruxsatsiz o'zgartirishdan himoyalangan bo'lishi kerak, afzalan tasdiqlangan AEAD orqali yoki tasdiqlangan shifr va MAC'ni birlashtirib. A04 oldini olish ro'yxati ham "oddiy shifrlash o'rniga har doim authenticated encryption" deydi.

### Approved va disallowed rejimlar

ASVS Appendix C AEAD jadvalida AES-GCM, AES-CCM, ChaCha20-Poly1305 va AEGIS oilasi approved. Shifr jadvalida AES-256 va ChaCha20 approved, AES-128 legacy. AES rejimlari jadvali: GCM va CCM approved, CBC legacy, CCM-8, ECB, CFB, OFB va CTR disallowed. Jadval eslatmalari muhim: autentifikatsiyasiz har qanday shifrlangan xabar MAC bilan tekshirilishi kerak; CBC faqat MAC bilan (encrypt-then-MAC tartibida) va padding tekshiruvi constant-time bo'lsagina ishlatiladi. ASVS 11.3.5 ham shifr va MAC birikmasi encrypt-then-MAC tartibida bo'lishini talab qiladi. Cryptographic Storage cheat sheet'i ham GCM va CCM'ni birinchi tanlov deydi; ular bo'lmasa CTR yoki CBC'ni alohida autentifikatsiya (Encrypt-then-MAC) bilan ishlatish mumkin.

TLS 1.3 ham shu yo'ldan borgan: RFC 8446 1.2 bo'limi qo'llab-quvvatlanadigan simmetrik algoritmlar ro'yxati legacy algoritmlardan tozalanganini, qolganlarining hammasi AEAD ekanini yozadi (65-dars). Demak "AEAD o'rniga shifrlash + MAC'ni qo'lda yig'ish" davri protokol darajasida ham tugagan.

## Chuqurroq: ichki mexanika

### ECB: struktura sizadi

ECB har 16 baytli blokni mustaqil shifrlaydi. Bir xil blok bir xil shifrmatn beradi. WebCrypto ECB'ni taqdim etmaydi, lekin bitta blokni nol IV bilan CBC orqali shifrlash aynan ECB bitta bloki bilan teng. Quyida shu yordamida takrorlanadigan blok ko'rinishi va GCM'da shunday emasligi ko'rsatilgan.

```ts run
const hex = (u: Uint8Array) => [...u].map((b) => b.toString(16).padStart(2, "0")).join("");
const enc = new TextEncoder();
const raw = new Uint8Array(32).map((_, i) => i + 1); // demo kalit
const cbcKey = await crypto.subtle.importKey("raw", raw, "AES-CBC", false, ["encrypt"]);
const gcmKey = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt"]);

// 16 baytlik bloklar: 0 va 2 bir xil.
const blocks = ["FUEL=41.........", "FUEL=57.........", "FUEL=41........."].map((s) => enc.encode(s));

const ecb = [];
for (const b of blocks) {
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv: new Uint8Array(16) }, cbcKey, b));
  ecb.push(hex(ct.slice(0, 16))); // bitta blok = ECB
}
console.log("ECB: 0 va 2 bir xil?", ecb[0] === ecb[2]);

const all = new Uint8Array(48);
blocks.forEach((b, i) => all.set(b, i * 16));
const gcm = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: new Uint8Array(12) }, gcmKey, all));
console.log("GCM: 0 va 2 bir xil?", hex(gcm.slice(0, 16)) === hex(gcm.slice(32, 48)));
```

```text
ECB: 0 va 2 bir xil? true
GCM: 0 va 2 bir xil? false
```

ECB'da bir xil ochiq matn bloklari bir xil shifrmatn beradi: hujumchi qaysi yozuvlar teng ekanini (masalan, ikki mashina bir xil yoqilg'i darajasida) shifrmatnning o'zidan ko'radi. Shuning uchun ASVS 11.3.1 ECB'ni umuman taqiqlaydi.

### Nonce: bir kalit, bir nonce, bir xabar

GCM hisoblagich rejimi (CTR) va autentifikatsiya mexanizmidan iborat. Hisoblagich rejimi kalit oqimini kalit va nonce'dan hosil qiladi va xabarni shu oqim bilan XOR qiladi. Nonce takrorlansa, kalit oqimi ham takrorlanadi, ya'ni 61-darsdagi XOR sxemasining xatosi qaytadi, faqat endi kalit oqimi ancha uzun. ASVS 11.3.4 shuning uchun nonce, IV va boshqa bir martalik sonlar bir kalit va ma'lumot elementi juftligi uchun bir martadan ko'p ishlatilmasligini talab qiladi, hosil qilish usuli algoritmga mos bo'lishi shart. A04 ham IV bir kalit bilan hech qachon ikki marta ishlatilmasligini yozadi; nonce talab qiladigan rejimlarda IV CSPRNG bo'lishi shart emas, lekin takrorlanmasligi shart.

Nonce'ni hosil qilishning ikki odatiy yo'li bor. Tasodifiy nonce (CSPRNG'dan 12 bayt) oddiy va saqlash uchun qulay, lekin to'qnashuv ehtimoli bir kalit ostidagi shifrlashlar soni bilan o'sadi: Key Management cheat sheet AES-GCM'da tasodifiy 96 bitli IV ishlatilganda bitta kalit uchun jami shifrlash soni 2^32 dan oshmasligini tavsiya qiladi. Hisoblagich asosidagi nonce to'qnashmaydi, lekin davlat (counter) saqlanishi va bir nechta jarayon orasida sinxronlanishi kerak; TLS 1.3 shu yo'lni tanlagan: yozuv nonce'si 64 bitli ketma-ketlik raqamining statik IV bilan XOR'idan hosil bo'ladi (RFC 8446 5.3). Ko'p instansli web servisda odatda tasodifiy nonce va kalit rotatsiyasi soddaroq.

### Associated data va kontekst

AAD shifrlanmaydi, lekin teg hisobiga kiradi. Shifrlangan maydonni qaysi tenant, qaysi mashina va qaysi ustunga tegishli ekani haqida kontekst bilan bog'lasangiz, shifrmatnni boshqa qatorga ko'chirish ochishda xatoga aylanadi. Bu "ko'chirish hujumi"ni yopadi va kriptografik darajadagi qo'shimcha qatlam beradi. Lekin Cryptographic Storage cheat sheet yozganidek, shifrlangan ma'lumot ham access control bilan himoyalanishi kerak; AAD tenant ajratishining o'rnini bosmaydi.

### Kalit bir maqsad uchun

Key Management cheat sheet NIST tavsiyasiga tayanib, bitta kalit bitta maqsad uchun ishlatilishini yozadi: shifrlash, autentifikatsiya, kalit o'rash yoki imzo uchun alohida kalitlar. Sabab: bir kalitning ikki jarayonda ishlatilishi birining xavfsizligini susaytirishi mumkin va kalit oshkor bo'lsa zarar kattalashadi. Amalda bir "ota" kalitdan HKDF kabi KDF bilan har maqsad uchun alohida kalit chiqariladi (68-dars).

## Misol: qat'iy nonce bilan telefon maydonlari

### Zaif kod

Jamoa haydovchi telefonini shifrlaydi, lekin "ko'chirish osonligi uchun" nonce'ni nol baytlar bilan qat'iy qo'ydi. Kalit demo uchun qat'iy (real tizimda bunday emas).

```ts run
const enc = new TextEncoder();
const hex = (u: Uint8Array) => [...u].map((b) => b.toString(16).padStart(2, "0")).join("");
const key = await crypto.subtle.importKey("raw", new Uint8Array(32).map((_, i) => i + 1), "AES-GCM", false, ["encrypt"]);

// ZAIF: hamma maydon uchun bir xil nonce.
const IV = new Uint8Array(12);
async function encryptField(plain: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: IV }, key, enc.encode(plain)));
}

const rows = [
  { tenant: "alfa", vehicle: "v1", phone: await encryptField("+998901234567") },
  { tenant: "beta", vehicle: "v2", phone: await encryptField("+998935550101") },
];
for (const r of rows) console.log(r.tenant, r.vehicle, hex(r.phone));
```

```text
alfa v1 ed40e221846524d72c1ed13a409ec1e016903f941050bb33bea4b625ca
beta v2 ed40e221846620d02a1ad53c46bf79d27175c6c8bf698282b7921598ed
```

### Hujum

"alfa" tenant'i o'z haydovchisining telefon raqamini biladi, chunki uni o'zi kiritgan. Bazaga yozish huquqi bilan emas, faqat shifrmatnlarni o'qish orqali (masalan, zaif eksport endpoint'idan yoki zaxira nusxadan) u "beta" qatorini ham ko'radi. Ikkala shifrmatn bir kalit va bir nonce bilan shifrlanganligi uchun, ularning XOR'i ochiq matnlar XOR'iga teng, bu yerda tegdan oldingi qismi uchun. Bu faqat shu o'quv kodiga qarshi.

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();
const key = await crypto.subtle.importKey("raw", new Uint8Array(32).map((_, i) => i + 1), "AES-GCM", false, ["encrypt"]);
const IV = new Uint8Array(12);
const encryptField = async (p: string) => new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: IV }, key, enc.encode(p)));

const ownCt = await encryptField("+998901234567"); // hujumchi bu ochiq matnni biladi
const victimCt = await encryptField("+998935550101"); // hujumchi faqat shifrmatnni ko'radi
const known = enc.encode("+998901234567");

const n = known.length; // tegsiz qism: oxirgi 16 bayt teg
const recovered = new Uint8Array(n).map((_, i) => ownCt[i] ^ victimCt[i] ^ known[i]);
console.log("tiklangan ochiq matn:", dec.decode(recovered));
```

```text
tiklangan ochiq matn: +998935550101
```

Kalit hujumchida yo'q, lekin ikkinchi tenant'ning telefon raqami ochildi. Bu 61-darsdagi XOR sxemasi bilan bir xil sabab: kalit oqimi takrorlandi.

### Tuzatilgan kod

Tuzatish: har shifrlashda yangi tasodifiy nonce, kontekst AAD sifatida va natijaning formati `nonce || ciphertext`. Ochishda har qanday xato `null` beradi.

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();
const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);

async function seal(context: string, plain: string): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode(context) }, key, enc.encode(plain)),
  );
  return new Uint8Array([...iv, ...ct]);
}

async function open(context: string, sealed: Uint8Array): Promise<string | null> {
  try {
    const pt = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: sealed.slice(0, 12), additionalData: enc.encode(context) },
      key,
      sealed.slice(12),
    );
    return dec.decode(pt);
  } catch {
    return null;
  }
}

const a = await seal("alfa|v1|phone", "+998901234567");
const b = await seal("alfa|v1|phone", "+998901234567");
console.log("o'z kontekstida ochildi:", await open("alfa|v1|phone", a));
console.log("bir xil matn, turli shifrmatn:", a.some((x, i) => x !== b[i]));
console.log("boshqa qator konteksti:", await open("beta|v2|phone", a));
const tampered = a.slice();
tampered[15] ^= 1;
console.log("o'zgartirilgan shifrmatn:", await open("alfa|v1|phone", tampered));
```

```text
o'z kontekstida ochildi: +998901234567
bir xil matn, turli shifrmatn: true
boshqa qator konteksti: null
o'zgartirilgan shifrmatn: null
```

Nima uchun yetarli: har shifrlash uchun yangi tasodifiy nonce kalit oqimining takrorlanishini yopadi (hujum bo'yicha), teg o'zgartirishni aniqlaydi va AAD shifrmatnni boshqa kontekstga ko'chirishni to'sadi. Natija ko'rsatganidek, boshqa qator konteksti va o'zgargan shifrmatn `null` beradi.

Nimani yopmaydi. Birinchidan, 96 bitli tasodifiy nonce uchun bir kalit ostidagi shifrlash soni cheklangan (cheat sheet 2^32 ni keltiradi), katta hajmda rotatsiya kerak. Ikkinchidan, kalit saqlash va rotatsiya bu kodda yo'q (68-dars). Uchinchidan, shifrmatn uzunligi ochiq matn uzunligini sizdiradi. To'rtinchidan, AAD ko'chirishni yopadi, lekin "eski, haqiqiy shifrmatnni o'sha qatorga qaytarish" (rollback) ni yopmaydi: buning uchun versiya yoki vaqt belgisi AAD'ga qo'shiladi. Beshinchidan, shifrlangan ustun bo'yicha qidirish yo'qoladi (62-darsdagi HMAC indeks yechimi bor).

## Qachon qo'llamaslik kerak

Ilova darajasida maydon shifrlash hamma joyda ham kerak emas. Bazaga kirish SQL injection orqali bo'lsa, ilova darajasida shifrlash ma'lumotni himoya qiladi; lekin ilova hujumchi nomidan ma'lumotni so'rasa (IDOR, 52-dars) shifrlash baribir ochib beradi. Maydon shifrlash sizni indeks, tartiblash, `LIKE` qidiruvi va agregatsiyadan mahrum qiladi, ma'lumotni migratsiya qilishni qiyinlashtiradi va kalit boshqaruviga bog'liqlikni oshiradi. Agar tahdid faqat diskning jismoniy yo'qolishi bo'lsa, disk yoki baza darajasidagi shifrlash soddaroq va yetarli bo'lishi mumkin (Cryptographic Storage cheat sheet qatlam tanlovini tahdid modeliga bog'laydi).

Parol saqlash uchun AEAD yaramaydi: parol qaytarib olinmaydi, tekshiriladi, shuning uchun sekin hash kerak (42-dars). Parolni to'g'ridan-to'g'ri kalit qilish ham mumkin emas: A04 buni alohida xato deb sanaydi, parolga asoslangan kalit KDF orqali chiqarilishi kerak (ASVS 11.4.4). Va, albatta, siz ma'lumotni saqlashingiz shart bo'lmasa, saqlamang.

## Stack'da: Node.js va Prisma

Node.js'da ikki yo'l: `node:crypto` (`createCipheriv("aes-256-gcm", key, iv)`, so'ng `getAuthTag()` / ochishda `setAuthTag()`) va WebCrypto (`crypto.subtle.encrypt` tegni shifrmatn oxiriga qo'shadi). Ikkalasida ham nonce'ni o'zingiz yaratasiz, shuning uchun uni `crypto.randomBytes(12)` yoki `crypto.getRandomValues` bilan oling va hech qachon doimiy qilib qo'ymang. Natija formatini versiyalang: `v1.<kalitId>.<nonce>.<ciphertext>`. Shunda kalit yoki algoritm almashganda (ASVS 11.2.2) eski yozuvlarni tanib olasiz.

Prisma bilan sezgir maydon uchun alohida repository yoki Prisma client extension yozish mumkin: yozishda `seal`, o'qishda `open`, kontekst sifatida `tenantId|id|ustun`. Kysely'da bu transformatsiya o'z qatlamida bo'ladi. Muhim qoida: kontekstga qatorning o'zgarmas identifikatorlarini qo'ying, o'zgaruvchan maydonni emas. NestJS'da bu `FieldCrypto` provayderi bo'lib, kalit `ConfigService` orqali emas, KMS yoki secrets manager'dan keladi (68-69-darslar).

## Xulosa

- Shifrlash maxfiylik beradi, yaxlitlik emas: shifrlangan ma'lumot har doim autentifikatsiya qilinadi, ya'ni AEAD (AES-GCM, ChaCha20-Poly1305) ishlatiladi.
- ASVS Appendix C bo'yicha GCM va CCM approved, CBC faqat MAC bilan legacy, ECB, CTR, CFB, OFB disallowed.
- Nonce bir kalit ostida hech qachon takrorlanmaydi: takrorlansa kalit oqimi takrorlanadi va ochiq matn sizadi. Tasodifiy 96 bitli nonce bilan kalit ostidagi shifrlash soni cheklanadi.
- Associated data bilan kontekst (tenant, qator, ustun) shifrmatnga bog'lanadi va ko'chirish hujumi ochishda xatoga aylanadi; rollback uchun versiya yoki vaqt belgisi kerak.
- Kalit bir maqsad uchun, parol esa KDF'siz kalit emas; format versiyalanadi, shunda crypto agility mumkin.
- Maydon shifrlash tenant ajratishi va access control o'rnini bosmaydi, qidiruv va indeksni cheklaydi: tahdid modeliga qarab qatlam tanlang.
