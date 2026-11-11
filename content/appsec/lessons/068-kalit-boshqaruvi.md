---
n: 68
slug: kalit-boshqaruvi
title: "Kalit boshqaruvi: KMS, envelope encryption, rotatsiya"
summary: "Kalit hayot sikli, ma'lumot va kalitni ajratish, DEK/KEK bilan envelope encryption, KMS va HSM roli, cryptoperiod va rotatsiya turlari (KEK re-wrap va DEK qayta shifrlash), kalit sizib chiqqandagi harakat va ASVS talablari."
duration: 50
sources:
  - id: t10-a04
    note: "A04:2025 tekshiriladigan savollar: default yoki zaif kalitlar, kalitlarning qayta ishlatilishi, kalit boshqaruvi va rotatsiyasi yo'qligi, kalitlarning repozitoriyga tushishi; 'How to prevent': eng sezgir kalitlarni HSM'da saqlash, kalitlar xotirada bayt massivi sifatida"
  - id: cs-secrets
    note: "Secrets Management cheat sheet 4.2.2 (data key secretni, uni esa provayder yoki o'zingizning master kalitingiz shifrlaydi), 7.3 (kalitni u shifrlagan sirning yonida saqlamaslik, shifrlangan bo'lsa bundan mustasno), 4.4 API limits, 2.7 Secret Lifecycle"
  - id: asvs
    note: "ASVS 5.0.0 11.1.1 (kalit boshqaruvi siyosati va hayot sikli, kalitlar ortiqcha ulashilmasligi), 13.3.1-13.3.4 (secrets management, izolyatsiyalangan modul, rotatsiya), Appendix C Key Wrapping (AES-256, KW va KWP)"
  - id: pg-pgcrypto
    note: "PostgreSQL pgcrypto, Security Limitations: funksiyalar baza serveri ichida ishlaydi, ma'lumot va parollar klient bilan ochiq matnda o'tadi, shuning uchun lokal yoki SSL ulanish, administratorga ishonish; ishonib bo'lmasa kriptografiya klient ilovada"
  - id: pg-logging
    note: "PostgreSQL 19.8 Error Reporting and Logging: log_statement extended query protocol'da Bind parametr qiymatlarini ham yozadi; log_parameter_max_length (standart -1, to'liq) qiymatlarni qisqartiradi yoki 0 bilan o'chiradi"
  - id: cs-key-mgmt
    note: "Key Management cheat sheet: Key Usage (bir kalit bir maqsad), Cryptoperiods and Rotation (misol muddatlar, usage-based limit, KEK re-wrap DEK'ni o'zgartirmasligi), Key Compromise and Recovery"
  - id: cs-crypto-storage
    note: "Cryptographic Storage cheat sheet: Key Lifetimes and Rotation (rotatsiya mezonlari, mavjud ma'lumotni qayta shifrlash yoki kalit ID bilan belgilash), Key Storage, Separation of Keys and Data, Encrypting Stored Keys (DEK va KEK)"
quiz:
  - q: "Hamma maydon bitta kalit bilan shifrlangan, kalit konfiguratsiya fayliga yozilgan va repozitoriy bilan birga yuriydi. Hujumchi bazaning zaxira nusxasini va repozitoriyga o'qish huquqini oldi. Nima bo'ladi?"
    options:
      - "Hech narsa: ma'lumot shifrlangan"
      - "Faqat bitta maydon ochiladi"
      - "Kalit va shifrmatn birga hujumchida: butun ma'lumot ochiladi"
      - "Faqat yangi yozuvlar ochiladi"
    answer: 2
    explain: "Shifrlash kalitni himoya qilishga o'tkazilgan xolos. Cryptographic Storage cheat sheet kalitlarni ma'lumotdan ajratishni va kodga qattiq yozmaslikni, A04 esa kalitlarning repozitoriyga tushishini alohida xavf deb sanaydi."
  - q: "Envelope encryption'da DEK va KEK vazifasi qanday?"
    options:
      - "DEK ma'lumotni shifrlaydi, KEK esa DEK'ni shifrlaydi; shifrlangan DEK ma'lumot bilan birga saqlanadi, KEK alohida joyda"
      - "KEK ma'lumotni shifrlaydi, DEK imzo qo'yadi"
      - "Ikkalasi ham ma'lumotni shifrlaydi"
      - "DEK parol, KEK token"
    answer: 0
    explain: "Cryptographic Storage cheat sheet: DEK ma'lumotni, KEK DEK'ni shifrlaydi; KEK DEK'dan alohida saqlanishi shart, shifrlangan DEK ma'lumot bilan birga turishi mumkin."
  - q: "KEK yangi versiyaga almashtirildi va barcha saqlangan DEK'lar yangi KEK ostida qayta o'raldi (re-wrap). Bu amal haqida qaysi gap to'g'ri?"
    options:
      - "Ma'lumotning o'zi yangi kalit bilan qayta shifrlandi"
      - "DEK'lar o'zgarmadi: ularning cryptoperiod va foydalanish limitlari qayta boshlanmaydi; DEK'ni almashtirish ma'lumotni qayta shifrlashni talab qiladi"
      - "DEK'lar avtomatik yangi tasodifiy qiymat oldi"
      - "Eski KEK'ni darhol o'chirib, DEK'larni qayta o'rash shart emas"
    answer: 1
    explain: "Key Management cheat sheet: re-wrap DEK'larni o'zgartirmaydi va ularning cryptoperiod va usage limitlarini tiklamaydi; KEK'ni yo'q qilishdan oldin barcha DEK'lar yangi KEK ostida qayta o'ralishi kerak."
  - q: "Hujumchi KEK'ni o'g'irlagani aniq. Ilovada barcha DEK'lar shu KEK bilan o'ralgan va o'ralgan DEK'lar bazada. Faqat KEK'ni almashtirib re-wrap qilish yetarlimi?"
    options:
      - "Ha, yangi KEK yetarli"
      - "Hech narsa qilish shart emas"
      - "Faqat parollarni o'zgartirish yetadi"
      - "Yo'q: hujumchi eski KEK bilan o'ralgan DEK nusxalarini ochgan bo'lishi mumkin, shuning uchun DEK'lar ham almashtirilib, ma'lumot qayta shifrlanishi kerak"
    answer: 3
    explain: "Hujumchi o'ralgan DEK'larning nusxasini olgan bo'lsa, eski KEK uni ochadi, DEK esa ma'lumotni ochadi. Compromise holatida re-wrap yetmaydi: yangi DEK'lar bilan qayta shifrlash kerak (Key Compromise and Recovery)."
  - q: "Servis AES-GCM bilan, tasodifiy 96 bitli nonce'lar bilan bitta DEK ostida juda ko'p yozuvni shifrlayapti. Key Management cheat sheet bo'yicha nimani rejalashtirish kerak?"
    options:
      - "DEK'ni abadiy ishlatish"
      - "Kalit ostidagi operatsiyalar sonini cheklash (misol: 2^32), shuning uchun usage asosida rotatsiya yoki yangi DEK"
      - "Nonce'ni qisqartirish"
      - "Faqat KEK'ni o'zgartirish"
    answer: 1
    explain: "Rotatsiya faqat kalendar bilan emas, foydalanish hajmi bilan ham belgilanadi. KEK re-wrap bu limitni tiklamaydi, shuning uchun DEK'lar kichik bo'lib (masalan har yozuv uchun alohida) ishlatiladi."
  - q: "ASVS 5.0.0 13.3.3 (Level 3) nimani talab qiladi?"
    options:
      - "Kalitlarni environment o'zgaruvchisida saqlash"
      - "Kalitlarni ilova xotirasida hamma joyda ochiq ushlash"
      - "Barcha kriptografik operatsiyalar izolyatsiyalangan xavfsizlik moduli (vault yoki HSM) ichida bajarilishi, kalit material modul tashqarisiga chiqmasligi"
      - "Kalitlarni repozitoriyga shifrlab qo'yish"
    answer: 2
    explain: "13.3.3 kalit materialni izolyatsiyalangan modulda (vault yoki HSM) boshqarishni va undan tashqariga chiqarmaslikni talab qiladi; 13.3.1 esa secretlar kodda va artefaktlarda bo'lmasligini."
task:
  title: "Rotatsiya rejasi: re-wrap yoki qayta shifrlash"
  prompt: |
    Envelope encryption ishlatiladigan saqlashda har yozuvning o'z DEK'i bor. `planRotation` funksiyasi har yozuv uchun bitta amalni belgilaydi. Hozir u hammasini `keep` deydi.

    Qoidalar (tartib muhim, birinchi mos kelgani olinadi):
    1. Yozuvning `kekVersion`i `currentKek` dan katta bo'lsa, `RangeError` tashlang (bunday bo'lishi mumkin emas).
    2. DEK yoshi (`now - dekCreated`, kunlarda) `maxDekAgeDays` dan oshsa yoki `ops` (DEK ostidagi shifrlashlar soni) `maxOps` dan oshsa: `reencrypt` (yangi DEK, ma'lumotni qayta shifrlash).
    3. Aks holda `kekVersion` < `currentKek` bo'lsa: `rewrap` (DEK o'zgarmaydi, yangi KEK ostida qayta o'raladi).
    4. Aks holda: `keep`.

    Qaytish qiymati: `{ keep: string[]; rewrap: string[]; reencrypt: string[] }` (yozuv `id` lari kirish tartibida). Yozuvlarni va `console.log`ni o'zgartirmang. Kutilgan chiqish: `keep: r4`, `rewrap: r1,r3`, `reencrypt: r2,r5`.
  lang: ts
  starter: |
    type Rec = { id: string; kekVersion: number; dekCreated: number; ops: number };
    type Plan = { keep: string[]; rewrap: string[]; reencrypt: string[] };
    type Policy = { maxDekAgeDays: number; maxOps: number };

    function planRotation(recs: Rec[], currentKek: number, nowDay: number, policy: Policy): Plan {
      return { keep: recs.map((r) => r.id), rewrap: [], reencrypt: [] };
    }

    const recs: Rec[] = [
      { id: "r1", kekVersion: 1, dekCreated: 900, ops: 10 },
      { id: "r2", kekVersion: 2, dekCreated: 100, ops: 5 },
      { id: "r3", kekVersion: 1, dekCreated: 950, ops: 3 },
      { id: "r4", kekVersion: 2, dekCreated: 990, ops: 1 },
      { id: "r5", kekVersion: 1, dekCreated: 980, ops: 5_000_000 },
    ];

    const plan = planRotation(recs, 2, 1000, { maxDekAgeDays: 365, maxOps: 1_000_000 });
    console.log("keep:", plan.keep.join(","));
    console.log("rewrap:", plan.rewrap.join(","));
    console.log("reencrypt:", plan.reencrypt.join(","));
  solution: |
    type Rec = { id: string; kekVersion: number; dekCreated: number; ops: number };
    type Plan = { keep: string[]; rewrap: string[]; reencrypt: string[] };
    type Policy = { maxDekAgeDays: number; maxOps: number };

    function planRotation(recs: Rec[], currentKek: number, nowDay: number, policy: Policy): Plan {
      const plan: Plan = { keep: [], rewrap: [], reencrypt: [] };
      for (const r of recs) {
        if (r.kekVersion > currentKek) throw new RangeError(`${r.id}: kekVersion joriydan katta`);
        if (nowDay - r.dekCreated > policy.maxDekAgeDays || r.ops > policy.maxOps) plan.reencrypt.push(r.id);
        else if (r.kekVersion < currentKek) plan.rewrap.push(r.id);
        else plan.keep.push(r.id);
      }
      return plan;
    }

    const recs: Rec[] = [
      { id: "r1", kekVersion: 1, dekCreated: 900, ops: 10 },
      { id: "r2", kekVersion: 2, dekCreated: 100, ops: 5 },
      { id: "r3", kekVersion: 1, dekCreated: 950, ops: 3 },
      { id: "r4", kekVersion: 2, dekCreated: 990, ops: 1 },
      { id: "r5", kekVersion: 1, dekCreated: 980, ops: 5_000_000 },
    ];

    const plan = planRotation(recs, 2, 1000, { maxDekAgeDays: 365, maxOps: 1_000_000 });
    console.log("keep:", plan.keep.join(","));
    console.log("rewrap:", plan.rewrap.join(","));
    console.log("reencrypt:", plan.reencrypt.join(","));
  solutionNotes: |
    - Qayta shifrlash `rewrap` dan ustun: eskirgan DEK yoki limitdan oshgan DEK'ni yangi KEK ostida o'rash uning cryptoperiod va usage limitini tiklamaydi (Key Management cheat sheet). Shuning uchun r5 (eski KEK va limitdan oshgan) `rewrap` emas, `reencrypt`.
    - `r2` KEK jihatdan joriy, lekin DEK yoshi 900 kun: faqat yosh bo'yicha qayta shifrlanadi.
    - `kekVersion > currentKek` ma'lumot yoki rejalashtirish xatosi; jimgina `keep` qilish o'rniga xato tashlanadi (fail-safe).
    - `maxDekAgeDays` va `maxOps` demo qiymatlar. Real cryptoperiod tahdid modeli va NIST SP 800-57 asosida belgilanadi; manbadagi misol: kam hajmli umumiy dasturlar uchun 2 yilgacha.
    - Bu faqat reja. Re-wrap va qayta shifrlashning o'zi, atomiklik (yarim yo'lda to'xtash), eski KEK'ni qachon yo'q qilish va rollback alohida jarayon.
  checklist:
    - "Qoidalar berilgan tartibda qo'llanadi"
    - "Eskirgan yoki limitdan oshgan DEK `rewrap` emas, `reencrypt` bo'ladi"
    - "Noto'g'ri `kekVersion` `RangeError` beradi"
    - "Natija yozuv tartibini saqlaydi"
    - "Re-wrap DEK cryptoperiod'ini tiklamasligini tushuntira olasiz"
---

## Muammo

Kriptografik algoritm to'g'ri tanlangan bo'lsa ham, tizim kalit saqlanishi bo'yicha sinadi. Eng ko'p uchraydigan holat: `ENCRYPTION_KEY` o'zgaruvchisi `.env` faylida, `.env` zaxira nusxaga, CI log'iga yoki repozitoriyga tushadi, hamma maydon shu bitta kalit bilan shifrlangan, va kalitni almashtirish "hamma ma'lumotni qayta shifrlash" degan katta migratsiyani anglatgani uchun hech qachon almashtirilmaydi. Natijada shifrlash hujumchiga to'siq emas: baza ham, kalit ham bir joydan chiqadi.

OWASP A04 tekshiriladigan savollar ro'yxati shu muammolarni sanaydi: default kalitlar ishlatilyaptimi, zaif kalit yaratilyaptimi, kalitlar qayta ishlatilyaptimi, to'g'ri kalit boshqaruvi va rotatsiyasi yetishmayaptimi, kalitlar kod repozitoriyga tushganmi. Oldini olish ro'yxatida esa eng sezgir kalitlarni hardware yoki cloud HSM'da saqlash, kalitni kriptografik tasodifiy yaratib bayt massivi sifatida xotirada ushlash va parolni KDF'siz kalit qilmaslik bor.

Bu dars kalit hayot siklini ko'rib chiqadi: yaratish, saqlash, ishlatish, rotatsiya, bekor qilish. Asosiy g'oya envelope encryption: ma'lumotni shifrlovchi kalit (DEK) va uni o'rovchi kalit (KEK) ajratiladi, shunda KEK'ni almashtirish butun ma'lumotni qayta shifrlashni talab qilmaydi. Secrets (parol, API kalit) bilan ishlash 69-darsda; bu yerda e'tibor shifrlash kalitlarida.

## Asosiy g'oya

### Kalit hayot sikli

Cryptographic Storage cheat sheet kalit boshqaruvi jarayonlarini sanaydi: yangi kalit yaratish va saqlash, kerakli tomonlarga yetkazish, ilova serverlariga joylash, eskirgan kalitni almashtirish va yo'q qilish. Bu jarayonlar rasmiy bo'lishi va sinalishi kerak. ASVS 5.0.0 11.1.1: kalitlarni boshqarish bo'yicha hujjatlashtirilgan siyosat va kalit hayot sikli bo'lishi, NIST SP 800-57 kabi standartga mos; kalitlar ortiqcha ulashilmasligi: umumiy sir ikki tomondan ko'p bo'lmasligi, maxfiy kalit esa bitta egada. 11.1.2 esa kalit, algoritm va sertifikatlar inventarini va har kalitni qayerda ishlatish mumkinligini yozishni talab qiladi (61-dars).

Kalit yaratish: CSPRNG'dan (67-dars), "so'z yoki iboradan" emas. Key Management cheat sheet kalitning bir maqsadga ishlatilishini yozadi: shifrlash, autentifikatsiya, kalit o'rash, tasodifiy son generatsiyasi va imzo uchun alohida kalitlar; chunki bir kalitni ikki jarayonda ishlatish birining xavfsizligini susaytirishi mumkin. Cryptographic Storage cheat sheet bir nechta kalit (masalan alohida data-encrypting va key-encrypting) ishlatilganda ular bir-biriga to'liq bog'liq bo'lmasligi kerakligini ham aytadi.

### Kalit qayerda turadi

Cheat sheet kalitlarni ilova konfiguratsiyasidagi oddiy fayldan ko'ra operatsion tizim, framework yoki cloud provayderning xavfsiz saqlash mexanizmlarida saqlashni tavsiya qiladi: fizik yoki virtual HSM, KMS (Amazon KMS, Azure Key Vault kabi) yoki tashqi secrets boshqaruv xizmati. Afzalliklar: markaziy boshqaruv, oson rotatsiya va almashtirish, xavfsiz kalit yaratish, kalitni eksport qilish yoki o'g'irlashni qiyinlashtirish. Bunday xizmat bo'lmasa, minimal qoidalar: kalitni kodga yozmaslik, versiya boshqaruviga qo'ymaslik, konfiguratsiya fayllariga cheklangan ruxsat berish va environment o'zgaruvchisida saqlashdan qochish (ular tasodifan oshkor bo'lishi mumkin). ASVS 13.3.1: backend secretlarni yaratish, saqlash, kirishni boshqarish va yo'q qilish uchun secrets management yechimi (masalan key vault) ishlatiladi, secretlar kodda va build artefaktlarida bo'lmaydi. 13.3.3 (Level 3): barcha kriptografik operatsiyalar izolyatsiyalangan xavfsizlik modulida (vault yoki HSM) bajariladi va kalit material moduldan tashqariga chiqmaydi.

Muhim tamoyil: kalit ma'lumot bilan bir joyda turmasin. Cheat sheet misol keltiradi: ma'lumot bazada bo'lsa, kalit fayl tizimida bo'lsin; shunda faqat bittasiga kirish (directory traversal yoki SQL injection orqali) ikkalasini bermaydi. Bu injection va fayl o'qish kabi hujumlarning ta'sirini kamaytiradi.

### Envelope encryption

Envelope encryption shu tamoyilning ishlaydigan shakli. Cryptographic Storage cheat sheet ikki kalitni ajratadi: Data Encryption Key (DEK) ma'lumotni shifrlaydi, Key Encryption Key (KEK) DEK'ni shifrlaydi (o'raydi). Shifrlangan DEK ma'lumot bilan birga saqlanishi mumkin, lekin u KEK'siz ishlamaydi, KEK esa alohida tizimda turadi (KMS yoki HSM). KEK kamida DEK kabi kuchli bo'lishi kerak. Secrets Management cheat sheet ham shuni ta'riflaydi: data key secretni shifrlaydi, uni esa provayder yoki sizning kalitingiz (KEK) shifrlaydi; kalitni u shifrlagan sirning yonida saqlamang, agar kalit o'zi shifrlanmagan bo'lsa. ASVS Appendix C kalit o'rash uchun AES-256 asosidagi KW va KWP rejimlarini approved deb belgilaydi (NIST SP 800-38F). Amalda KMS DEK'ni o'rab/ochib beradi va KEK KMS'dan chiqmaydi.

Bu tuzilmaning uchta foydasi bor. Birinchisi, ma'lumot hajmi katta bo'lsa ham KMS'ga faqat kichik DEK yuboriladi. Ikkinchisi, har yozuv yoki tenant uchun alohida DEK mumkin: bitta DEK sizsa, faqat uning ma'lumoti ochiladi (55-dars bilan mos). Uchinchisi, KEK rotatsiyasi DEK'larni qayta o'rashgacha tushadi, ma'lumotni qayta shifrlash shart emas.

## Chuqurroq: rotatsiya va kalit sizib chiqishi

### Rotatsiya turlari

Cheat sheet kalitni almashtirish mezonlarini sanaydi: avvalgi kalit sizib chiqqan yoki gumon qilinsa (shu jumladan kalitga ruxsati bor xodim ketsa); belgilangan muddat (cryptoperiod) tugaganda; tanlangan rejimning foydalanish limitiga yetishdan oldin; algoritm xavfsizligi sezilarli o'zgarsa. Mavjud ma'lumot uchun ikki yondashuv: eski kalit bilan ochib, yangisi bilan qayta shifrlash (afzal, chunki kod va jarayon soddalashadi) yoki har yozuvni qaysi kalit bilan shifrlangani identifikatori bilan belgilab, bir nechta kalitni saqlash. Eski kalitlar ma'lum vaqt saqlanadi, chunki eski zaxira nusxalarni ochish kerak bo'lishi mumkin. Va asosiysi: rotatsiya kodi va jarayoni zarurat tug'ilishidan oldin tayyor bo'lishi kerak, aks holda kompromatsiyada tez almashtirib bo'lmaydi. Algoritm yoki kutubxonani ham almashtirish jarayoni bo'lishi kerak (ASVS 11.2.2).

Muddat qiymatlari: Key Management cheat sheet NIST SP 800-57 ga tayanib misollar beradi: simmetrik ma'lumot kalitlari uchun yangi ma'lumotni shifrlash muddati kam hajmli umumiy dasturlarda 2 yilgacha, katta hajmli yoki link-shifrlash tizimlarida kun yoki hafta tartibida; ochish muddati odatda shifrlash muddatidan keyin 3 yildan oshmaydi. Ular misol, siz muddatni xavf baholashi bilan belgilaysiz. Foydalanish hajmi ham chegara beradi: AES-GCM tasodifiy 96 bitli IV bilan bir kalit ostida 2^32 operatsiyadan oshmasligi tavsiya etiladi (63-dars).

Envelope encryption'da ikki xil rotatsiya bor, va ularni aralashtirmaslik muhim. KEK rotatsiyasi: KEK'ni yo'q qilishdan oldin saqlangan DEK'lar yangi KEK ostida qayta o'raladi (re-wrap). Bu DEK'larni o'zgartirmaydi va ularning cryptoperiod va usage limitlarini tiklamaydi. DEK'ni almashtirish esa ma'lumotni qayta shifrlashni talab qiladi. Boshqariladigan xizmatlar eski o'rash kalit versiyalarini avtomatik saqlashi mumkin; provayder xatti-harakatini hujjatdan tekshiring. Cheat sheet avtomatik rotatsiyani (KMS yoki ACME) afzal ko'radi, qo'lda rotatsiyada esa vaqt, operator va ruxsat havolasini jurnalga yozishni talab qiladi.

### Kalit sizib chiqqanda

Key Management cheat sheet kompromatsiya oqibatlarini sanaydi: shifrlash kaliti oshkor bo'lsa, u bilan shifrlangan butun ma'lumot ochilishi mumkin; CA imzo kaliti oshkor bo'lsa, hujumchi soxta sertifikat va CRL yaratadi (66-dars); yaxlitlik kalitini almashtirish yoki o'zgartirish ushbu kalit bilan himoyalangan hamma ma'lumotga ishonchni so'roq ostiga qo'yadi. Amaliy xulosa envelope tuzilmasi uchun: KEK sizsa, hujumchi bazadan olgan o'ralgan DEK'larni ocha oladi, demak DEK'lar ham sizgan hisoblanadi. Shu sababli faqat KEK'ni almashtirib re-wrap qilish yetmaydi: DEK'larni yangilab, ma'lumotni qayta shifrlash kerak. Faqat KMS ichidagi KEK'ga ruxsat sizgan, KEK materialning o'zi chiqmagan bo'lsa, ruxsatni bekor qilish va audit yetarli bo'lishi mumkin; bu farqni hodisa tahlilida aniqlash kerak (79-dars).

Yana bir narsa: kriptografik o'chirish. Cheat sheet shifrlangan kalit materialni "cryptographic erasure" bilan yo'q qilishni faqat himoyalovchi kalitning barcha nusxalari yo'q qilinishi va tiklanadigan ochiq nusxa qolmasligi aniq bo'lgandagina ko'rib chiqishni yozadi. Zaxira nusxalar bu da'voni osongina buzadi.

## Misol: bitta qattiq yozilgan kalit

### Zaif kod

Haydovchi telefon va shaxsiy hujjat maydonlari bitta kalit bilan shifrlanadi. Kalit "oson boshqarilsin" deb kod ichida satr sifatida yozilgan va uzunligi 32 gacha to'ldirilgan.

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();

// ZAIF: kalit kodda, ma'lumot bilan bir joyda; parol kabi satr "kalit" qilingan va 32 gacha to'ldirilgan.
const KEY_TEXT = "fleet-prod-key-2024";
const rawKey = enc.encode(KEY_TEXT.padEnd(32, "!"));
const key = await crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt", "decrypt"]);

async function encryptField(plain: string): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plain)));
  return new Uint8Array([...iv, ...ct]);
}
async function decryptField(blob: Uint8Array): Promise<string> {
  return dec.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: blob.slice(0, 12) }, key, blob.slice(12)));
}

const rows = [await encryptField("+998901234567"), await encryptField("AA1234567")];
console.log("saqlangan yozuvlar:", rows.length);
console.log("ilova o'qiy oladi:", await decryptField(rows[0]));
```

```text
saqlangan yozuvlar: 2
ilova o'qiy oladi: +998901234567
```

Algoritm to'g'ri (AES-GCM, tasodifiy nonce), lekin kalit boshqaruvi yo'q: kalit kodda, almashtirish uchun hamma ma'lumotni qayta shifrlash va qayta deploy kerak, kalitni bilgan har bir dasturchi hamma ma'lumotni ochadi.

### Hujum

Hujumchi bazaning zaxira nusxasini oldi (bu faqat shifrmatnlar) va repozitoriyga o'qish huquqini oldi (u yerda `KEY_TEXT`). Quyidagi blok shu o'quv kodining o'zi bilan hujumni ko'rsatadi: kalit kod ichidan olinadi.

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();

// Hujumchi repozitoriydan o'qigan satr (zaif koddagi bilan bir xil).
const stolen = "fleet-prod-key-2024";
const attackerKey = await crypto.subtle.importKey("raw", enc.encode(stolen.padEnd(32, "!")), "AES-GCM", false, ["encrypt", "decrypt"]);

// Bazaning zaxira nusxasi (ilova shu kalit bilan yozgan).
const appKey = await crypto.subtle.importKey("raw", enc.encode("fleet-prod-key-2024".padEnd(32, "!")), "AES-GCM", false, ["encrypt"]);
async function fromApp(plain: string): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  return new Uint8Array([...iv, ...new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, appKey, enc.encode(plain)))]);
}
const dump = [await fromApp("+998901234567"), await fromApp("AA1234567")];

for (const blob of dump) {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: blob.slice(0, 12) }, attackerKey, blob.slice(12));
  console.log("ochildi:", dec.decode(pt));
}
```

```text
ochildi: +998901234567
ochildi: AA1234567
```

Shifrlash ma'lumotni himoya qilmadi, chunki kalit va shifrmatn birga hujumchi qo'lida. A04 savollari aynan shuni so'raydi: kalitlar repozitoriyga tushganmi.

### Tuzatilgan kod

Tuzatish: envelope encryption. Har yozuv uchun yangi tasodifiy DEK, DEK KEK bilan o'raladi, KEK esa "KMS" ob'ektida (o'quv modelida; real tizimda alohida xizmat), unda kalit material `extractable: false` va tashqariga chiqmaydi. Yozuvda faqat KEK versiyasi, o'ralgan DEK va shifrmatn. Kontekst (`tenant|id`) AAD sifatida ikkala bosqichda ishlatiladi (63-dars).

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();
const same = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((x, i) => x === b[i]);

// O'quv KMS: KEK versiyalari ichkarida, tashqariga faqat wrap/unwrap chiqadi.
class ToyKms {
  private keks = new Map<number, CryptoKey>();
  current = 0;
  async rotate() {
    this.current++;
    this.keks.set(this.current, await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]));
  }
  retire(v: number) { this.keks.delete(v); }
  async wrap(dek: Uint8Array, aad: string) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const kek = this.keks.get(this.current)!;
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode(aad) }, kek, dek));
    return { v: this.current, blob: new Uint8Array([...iv, ...ct]) };
  }
  async unwrap(v: number, blob: Uint8Array, aad: string): Promise<Uint8Array | null> {
    const kek = this.keks.get(v);
    if (!kek) return null;
    try {
      return new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: blob.slice(0, 12), additionalData: enc.encode(aad) }, kek, blob.slice(12)));
    } catch { return null; }
  }
}

type Rec = { tenant: string; id: string; v: number; wrapped: Uint8Array; data: Uint8Array };
const aadOf = (r: { tenant: string; id: string }) => `${r.tenant}|${r.id}`;
const dekKey = (raw: Uint8Array) => crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt", "decrypt"]);

const kms = new ToyKms();
await kms.rotate(); // KEK v1

async function save(tenant: string, id: string, plain: string): Promise<Rec> {
  const dek = crypto.getRandomValues(new Uint8Array(32)); // har yozuv uchun yangi DEK
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: enc.encode(`${tenant}|${id}`) }, await dekKey(dek), enc.encode(plain)));
  const w = await kms.wrap(dek, `${tenant}|${id}`);
  return { tenant, id, v: w.v, wrapped: w.blob, data: new Uint8Array([...iv, ...ct]) };
}
async function load(r: Rec): Promise<string | null> {
  const dek = await kms.unwrap(r.v, r.wrapped, aadOf(r));
  if (!dek) return null;
  try {
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: r.data.slice(0, 12), additionalData: enc.encode(aadOf(r)) }, await dekKey(dek), r.data.slice(12));
    return dec.decode(pt);
  } catch { return null; }
}
async function rewrap(r: Rec): Promise<Rec> {
  const dek = (await kms.unwrap(r.v, r.wrapped, aadOf(r)))!;
  const w = await kms.wrap(dek, aadOf(r));
  return { ...r, v: w.v, wrapped: w.blob }; // data (shifrmatn) o'zgarmaydi
}

const rec = await save("alfa", "d1", "+998901234567");
console.log("KEK v1 bilan ochildi:", await load(rec));

// Hujumchi bazadan (rec) va repozitoriydan olgan eski qattiq kalit bilan urinadi.
const guessed = await crypto.subtle.importKey("raw", enc.encode("fleet-prod-key-2024".padEnd(32, "!")), "AES-GCM", false, ["decrypt"]);
let leaked: string | null = null;
try { leaked = dec.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: rec.data.slice(0, 12) }, guessed, rec.data.slice(12))); } catch { leaked = null; }
console.log("repozitoriydagi kalit bilan:", leaked);

await kms.rotate(); // KEK v2
const rotated = await rewrap(rec);
console.log("re-wrap: KEK versiyasi", rec.v, "->", rotated.v, "| shifrmatn o'zgarmadi:", same(rec.data, rotated.data));
kms.retire(1);
console.log("eski KEK yo'q qilingach, re-wrap qilingan yozuv:", await load(rotated));
console.log("eski KEK yo'q qilingach, re-wrap qilinmagan nusxa:", await load(rec));
```

```text
KEK v1 bilan ochildi: +998901234567
repozitoriydagi kalit bilan: null
re-wrap: KEK versiyasi 1 -> 2 | shifrmatn o'zgarmadi: true
eski KEK yo'q qilingach, re-wrap qilingan yozuv: +998901234567
eski KEK yo'q qilingach, re-wrap qilinmagan nusxa: null
```

Nima uchun yetarli: ma'lumotni ochish uchun DEK kerak, DEK esa faqat KEK bilan ochiladi, KEK materiali esa KMS'dan chiqmaydi, shuning uchun bazaning nusxasi va repozitoriydagi satr hech narsa bermaydi. Har yozuv o'z DEK'iga ega: bitta DEK sizsa, faqat bitta yozuv ochiladi. Rotatsiya shifrmatnga tegmaydi: faqat 32 baytlik DEK qayta o'raladi, eski KEK yo'q qilingach re-wrap qilinmagan nusxa ochilmaydi.

Nimani yopmaydi. Birinchidan, ilova hujumchi nomidan KMS'ga murojaat qila olsa (ilova jarayoni buzilsa), hujumchi `unwrap` ni chaqiradi; shuning uchun KMS ruxsatlari minimal bo'lishi, so'rovlar jurnalga yozilishi va anomaliya aniqlanishi kerak (79-dars). Ikkinchidan, KEK sizsa, re-wrap yetmaydi (yuqorida). Uchinchidan, DEK re-wrap qilinganda uning yoshi va foydalanish hisobi tiklanmaydi. To'rtinchidan, o'quv modelda KMS jarayon ichidagi sinf; real KMS tarmoq orqali ishlaydi va uning mavjudligi (availability) ilova mavjudligiga bog'liq bo'ladi, shuning uchun kesh va nosozlikda xatti-harakat rejalashtiriladi (78-dars).

## Qachon qo'llamaslik kerak

Envelope encryption va KMS hamma tizim uchun shart emas. Kichik ichki vosita uchun, tahdid modeli faqat diskning yo'qolishi bo'lsa, disk yoki baza darajasidagi shifrlash va qat'iy ruxsatlar soddaroq. KMS'ga bog'liqlik qo'shimcha nosozlik nuqtasi: KMS ishlamasa, ilova ma'lumotni ocha olmaydi, va ba'zi KMS'larning so'rov limiti va narxi bor (Secrets Management cheat sheet API limitlari haqida ham alohida bo'lim bergan). Har yozuv uchun alohida DEK ham har joyda mos emas: juda ko'p kichik yozuvlarda KMS chaqiruvlari qimmat bo'ladi; ko'pincha tenant yoki jadval darajasidagi DEK kompromiss.

Shuningdek, cheat sheet ogohlantiradi: KEK va DEK ajratib saqlab bo'lmaydigan oddiy muhitlarda (shared hosting) envelope encryption'ning foydasi cheklangan, u faqat malakasiz hujumchiga qo'shimcha to'siq bo'ladi. Foydalanuvchi parolidan KDF bilan KEK chiqarish (shu tufayli parol o'zgarganda DEK qayta shifrlanmaydi) ham mumkin, lekin parol yo'qolsa ma'lumot yo'qoladi: bu tiklash imkoniyati yo'qligini anglatadi (mijoz tomonidagi shifrlash).

## Stack'da: Node.js, NestJS, Prisma, PostgreSQL

Bulut KMS (AWS KMS, GCP KMS, Azure Key Vault) yoki HashiCorp Vault Transit kabi xizmatlar `GenerateDataKey`, `Encrypt/Decrypt` yoki wrap/unwrap operatsiyalarini beradi; operatsiyalar nomi va chegaralari provayderga bog'liq va kurs korpusida yo'q, provayder hujjatiga qarang. NestJS'da `KeyService` interfeysi (`wrapKey`, `unwrapKey`, `currentVersion`) yozing va ilovaning boshqa qismlari faqat shu interfeysga bog'liq bo'lsin: KMS provayderini almashtirish (ASVS 11.2.2) va testda mock qilish osonlashadi. Prisma yoki Kysely'da yozuv jadvaliga `kek_version`, `wrapped_dek`, `ciphertext` ustunlarini qo'shing va format versiyasi bilan saqlang; rotatsiya jobi kichik paketlarda (`wrapped_dek` ni yangilab) ishlaydi, shuning uchun uzun tranzaksiya kerak emas. Rotatsiya qaysi yozuvga tegishini yuqoridagi mashqdagi kabi reja funksiyasi bilan hisoblang, so'ng bajaring.

PostgreSQL'da kalit va ma'lumot bir joyda bo'lmasin: bazada `ciphertext` va `wrapped_dek`, KEK esa KMS'da. Bazadagi `pgcrypto` funksiyalari esa qulay, lekin PostgreSQL hujjati ularning "Security Limitations" bo'limida ogohlantiradi: hamma pgcrypto funksiyalari baza serveri ichida ishlaydi, shuning uchun ma'lumot va parollar pgcrypto bilan klient ilova orasida ochiq matnda o'tadi; shu sababli lokal yoki SSL ulanish ishlatish va tizim hamda baza administratoriga ishonish kerak, ishonib bo'lmasa kriptografiyani klient ilovada bajaring. Qo'shimcha xavf: `log_statement` sozlamasi SQL jumlalarini logga yozadi va extended query protocol'da Bind parametrlarining qiymatlarini ham kiritadi, ya'ni kalit SQL parametri sifatida yuborilsa, u baza logiga tushishi mumkin (`log_parameter_max_length` standart `-1`, ya'ni qiymatni to'liq yozadi; `0` parametr yozishni o'chiradi). Shuning uchun kalit va ochiq matn bilan ishlash ilova darajasida (yoki KMS orqali) xavfsizroq. Next.js'da kalitlarni server tomonida (server action yoki route handler) ishlating; klient bundle'ga hech qachon tushmasin.

## Xulosa

- Kalit boshqaruvi hayot sikli: yaratish (CSPRNG), saqlash (KMS yoki HSM, kodda emas), ishlatish (bir kalit bir maqsad), rotatsiya va yo'q qilish; jarayonlar zarurat bo'lishidan oldin tayyor va sinalgan.
- Kalit ma'lumot bilan bir joyda turmasin: ma'lumot bazada bo'lsa, kalit boshqa tizimda. A04 va ASVS 13.3.1 kalitlarning repozitoriy va artefaktlarga tushishini xato deb biladi.
- Envelope encryption: DEK ma'lumotni, KEK DEK'ni shifrlaydi; shifrlangan DEK ma'lumot bilan, KEK alohida. Har yozuv yoki tenant uchun alohida DEK ta'sirni cheklaydi.
- KEK rotatsiyasi DEK'larni qayta o'raydi (ma'lumotga tegmaydi), lekin DEK cryptoperiod va usage limitini tiklamaydi; DEK almashtirish qayta shifrlashni talab qiladi.
- KEK sizsa, re-wrap yetmaydi: DEK'larni almashtirib, ma'lumotni qayta shifrlash kerak. Rotatsiya mezonlari: kompromat, cryptoperiod, foydalanish limiti, algoritm zaifligi.
- KMS ham ruxsat va audit bilan himoyalanadi: ilova buzilsa hujumchi unwrap'ni chaqiradi; mavjudlik va narx trade-off'lari hisobga olinadi.
