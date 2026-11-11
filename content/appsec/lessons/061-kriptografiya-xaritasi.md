---
n: 61
slug: kriptografiya-xaritasi
title: "Kriptografiya xaritasi: primitive'lar va o'zingiz yozmaslik qoidasi"
summary: "Hash, MAC, parol hash, AEAD, asimmetrik kriptografiya va CSPRNG: qaysi muammoga qaysi primitive mos kelishi, ASVS 5.0 V11 va OWASP A04 talablari, kriptografik inventar va o'zi yozilgan shifrlashning nega sinishi."
duration: 45
sources:
  - id: t10-a04
    note: "A04:2025 Cryptographic Failures: bo'lim boshidagi fon (CWE-327, CWE-331, CWE-1241, CWE-338), tekshiriladigan savollar ro'yxati va 'How to prevent' band: ishonchli implementatsiyalardan foydalanish"
  - id: asvs
    note: "ASVS 5.0.0 V11 Cryptography: V11.1 inventar va hujjatlashtirish, V11.2 xavfsiz implementatsiya (11.2.1, 11.2.2, 11.2.3), Appendix C: approved, legacy va disallowed mexanizmlar"
  - id: node-security
    note: "Node.js Security Best Practices: timing attack bo'limi va crypto modulidagi timingSafeEqual funksiyasi"
  - id: cs-crypto-storage
    note: "Cryptographic Storage Cheat Sheet: shifrlash qatlamlari (ilova, baza, fayl tizimi, apparat), AES kaliti uzunligi, RSA kamida 2048 bit, 'Custom Algorithms: Don't do this', defense in depth"
quiz:
  - q: "Jamoa mijoz tokenini 'shifrlash' uchun maxfiy so'zni takrorlab XOR qiladigan o'z funksiyasini yozdi. Hujumchi o'zining qonuniy tokenini va uning formatini biladi. Nima uchun bu sxema sinadi?"
    options:
      - "XOR sekin ishlaydi, shuning uchun tokenlar eskirib qoladi"
      - "Hujumchi serverning xotirasini o'qishi shart"
      - "Base64 kodlash tokenni qisqartirib yuboradi"
      - "Ma'lum ochiq matn va shifrmatndan kalit oqimi tiklanadi va istalgan matn uchun token yasash mumkin"
    answer: 3
    explain: "Shifrmatn XOR ochiq matn kalit oqimini beradi; kalit qisqa va takrorlanadi, shuning uchun hujumchi uni to'liq tiklaydi. Tezlik, base64 va xotira bilan bog'liq emas: zaiflik sxemaning o'zida."
  - q: "Quyidagi talablardan qaysi biri uchun AEAD (masalan AES-GCM) to'g'ri primitive?"
    options:
      - "Parolni bazada saqlash"
      - "Ikki servis orasida umumiy kalit bilan xabar yaxlitligini tekshirish, shifrlashsiz"
      - "Bazadagi haydovchi telefon raqamini maxfiy saqlash va o'zgartirilsa aniqlash"
      - "Reset havolasi uchun tasodifiy qiymat yaratish"
    answer: 2
    explain: "Maxfiylik va yaxlitlikni birga beradigan primitive AEAD. Parol uchun sekin parol hash funksiyasi, shifrlashsiz yaxlitlik uchun MAC (HMAC), tasodifiy qiymat uchun CSPRNG kerak."
  - q: "Kod ichida `createHash(\"md5\").update(password).digest(\"hex\")` bor. ASVS 5.0 Appendix C bo'yicha bu qanday baholanadi?"
    options:
      - "Approved: MD5 tez va ishonchli"
      - "Legacy: faqat eski tizimlar bilan moslik uchun ruxsat etiladi"
      - "Disallowed: MD5 hech qanday kriptografik maqsadda ishlatilmaydi, parol uchun esa parol hash funksiyasi kerak"
      - "Faqat salt qo'shilsa approved bo'ladi"
    answer: 2
    explain: "ASVS MD5ni disallowed deb belgilaydi (V11.4.1). Salt MD5 ni parol hash funksiyasiga aylantirmaydi: parol uchun Argon2id, scrypt, bcrypt yoki PBKDF2 kabi sekin funksiya kerak (V11.4.2)."
  - q: "Jamoa AES-GCM ishlatadi va 'kriptografiya tayyor' deb hisoblaydi. Kalit repozitoriyga commit qilingan. Qaysi xulosa to'g'ri?"
    options:
      - "Kalit oshkor bo'lgani uchun shifrlash maxfiylik bermaydi: kriptografik nazorat algoritm va kalit boshqaruvidan iborat"
      - "Algoritm to'g'ri tanlangan, shuning uchun xavf yo'q"
      - "GCM kalit oshkor bo'lsa ham yaxlitlikni saqlaydi"
      - "Faqat kalit uzunligi 256 bit bo'lsa muammo yo'q"
    answer: 0
    explain: "Kalitni bilgan kishi ma'lumotni ochadi va yangisini yasaydi. OWASP A04 kalitlarning repozitoriyga tushishini alohida tekshiriladigan nuqta sifatida sanaydi. Uzunlik oshkor kalitni tuzatmaydi."
  - q: "ASVS 11.2.2 'crypto agility' talabi amaliyotda nimani anglatadi?"
    options:
      - "Har deploy'da algoritmni tasodifiy almashtirish"
      - "Bir vaqtda uch xil algoritm ishlatish"
      - "Algoritm, kalit uzunligi va parametrlarni kodni qayta yozmay almashtira olish, kalitlarni almashtirib ma'lumotni qayta shifrlay olish"
      - "Faqat eng yangi, hali sinalmagan algoritmlarni tanlash"
    answer: 2
    explain: "Agility - almashtirish imkoniyati: primitive bitta joyda, shifrmatn versiya belgisi bilan saqlanadi. Tasodifiy almashtirish ham, sinalmagan algoritm ham xavfsizlikni oshirmaydi."
  - q: "Telemetriya eksporti uchun kalit: `const seed = Date.now(); const key = hash(String(seed))`. Nima uchun bu kalit yaroqsiz?"
    options:
      - "Hash funksiyasi kalit uchun ishlatilmaydi"
      - "Date.now() millisekund bo'yicha sanaladigan kichik oraliqdan qiymat beradi, hujumchi urinib topadi; kalit CSPRNG'dan kelishi kerak"
      - "Date.now() faqat brauzerda ishlaydi"
      - "Kalit uzunligi doim 32 bit chiqadi"
    answer: 1
    explain: "Vaqt taxmin qilinadigan qiymat: kalit makoni amalda sanashga yetadigan darajada kichik. OWASP A04 past entropiyali yoki bashorat qilinadigan manbalarni (CWE-331, CWE-338) alohida zaiflik sifatida sanaydi. Kalit CSPRNG'dan olinadi (67-dars)."
task:
  title: "Kriptografik inventar: approved, legacy, disallowed"
  prompt: |
    Jamoa ASVS 11.1.2 talabi bo'yicha kodda ishlatiladigan kriptografiyaning inventarini yuritadi. Quyidagi `classify(algo)` funksiyasi hamma narsani "approved" deb qaytaradi, shuning uchun hisobot foydasiz.

    ASVS 5.0.0 Appendix C holatiga ko'ra baholang:
    - `disallowed`: `MD5`, `DES`, `RC4`, `AES-ECB`, `HMAC-MD5`, `RSA-PKCS1v15-sign`
    - `legacy`: `SHA-1`, `AES-128-CBC`, `HMAC-SHA-1`
    - `approved`: `SHA-256`, `AES-256-GCM`, `HMAC-SHA-256`, `Ed25519`, `argon2id`
    - ro'yxatda yo'q har qanday nom: `unknown` (qo'lda ko'rib chiqish kerak). Uni jimgina "approved" deb qabul qilmang.

    Qolgan qismni (`inventory`, `console.log`) o'zgartirmang. Oxirgi chiqish: 2 ta disallowed, 2 ta legacy, 2 ta approved va 1 ta unknown qatori.
  lang: ts
  starter: |
    type Status = "approved" | "legacy" | "disallowed" | "unknown";
    type Use = { where: string; algo: string };

    // Tuzating: jadval bo'yicha holat qaytarsin.
    function classify(algo: string): Status {
      return "approved";
    }

    const uses: Use[] = [
      { where: "parol saqlash", algo: "MD5" },
      { where: "telemetriya eksporti", algo: "AES-256-GCM" },
      { where: "webhook imzosi", algo: "HMAC-SHA-1" },
      { where: "eski mobil klient tokeni", algo: "RC4" },
      { where: "fayl nazorat yig'indisi", algo: "SHA-256" },
      { where: "hisobot imzolash", algo: "AES-128-CBC" },
      { where: "ichki servis kodeki", algo: "XOR-2000" },
    ];

    function inventory(list: Use[]) {
      return list.map((u) => ({ ...u, status: classify(u.algo) }));
    }

    for (const row of inventory(uses)) {
      console.log(row.status.padEnd(10), row.algo.padEnd(14), row.where);
    }
  solution: |
    type Status = "approved" | "legacy" | "disallowed" | "unknown";
    type Use = { where: string; algo: string };

    const TABLE: Record<string, Status> = {
      "MD5": "disallowed",
      "DES": "disallowed",
      "RC4": "disallowed",
      "AES-ECB": "disallowed",
      "HMAC-MD5": "disallowed",
      "RSA-PKCS1v15-sign": "disallowed",
      "SHA-1": "legacy",
      "AES-128-CBC": "legacy",
      "HMAC-SHA-1": "legacy",
      "SHA-256": "approved",
      "AES-256-GCM": "approved",
      "HMAC-SHA-256": "approved",
      "Ed25519": "approved",
      "argon2id": "approved",
    };

    // Ro'yxatda yo'q nom "unknown": jimgina qabul qilinmaydi.
    function classify(algo: string): Status {
      return Object.hasOwn(TABLE, algo) ? TABLE[algo] : "unknown";
    }

    const uses: Use[] = [
      { where: "parol saqlash", algo: "MD5" },
      { where: "telemetriya eksporti", algo: "AES-256-GCM" },
      { where: "webhook imzosi", algo: "HMAC-SHA-1" },
      { where: "eski mobil klient tokeni", algo: "RC4" },
      { where: "fayl nazorat yig'indisi", algo: "SHA-256" },
      { where: "hisobot imzolash", algo: "AES-128-CBC" },
      { where: "ichki servis kodeki", algo: "XOR-2000" },
    ];

    function inventory(list: Use[]) {
      return list.map((u) => ({ ...u, status: classify(u.algo) }));
    }

    for (const row of inventory(uses)) {
      console.log(row.status.padEnd(10), row.algo.padEnd(14), row.where);
    }
  solutionNotes: |
    - Jadval kodda ASVS Appendix C holatini aks ettiradi. Nom tekshiruvida `Object.hasOwn` ishlatiladi, shunda `"constructor"` kabi satr jadvaldan prototip qiymatini olib kelmaydi.
    - Noma'lum algoritm `approved` emas, `unknown`: inventarning maqsadi aynan ko'rib chiqilmagan joylarni topish. Standart qiymat xavfsiz tomonga (fail-safe default, 3-dars) ishlashi kerak.
    - Bu faqat nomga qarab baholaydi. `AES-256-GCM` ishlatilishi nonce takrorlanmasligi, kalit saqlanishi va rotatsiyasini kafolatlamaydi (63 va 68-darslar).
    - Real inventar kalit, sertifikat, egasi va muddatini ham yozadi (ASVS 11.1.2). Bu mashq faqat algoritm ustunini tekshiradi.
  checklist:
    - "MD5, RC4, HMAC-SHA-1 kabi nomlar jadvaldagi holatiga mos qaytadi"
    - "Ro'yxatda yo'q nom `unknown` qaytaradi, `approved` emas"
    - "`inventory` va `console.log` o'zgarmagan"
    - "Nom tekshiruvi prototip kalitlariga (masalan `constructor`) aldanmaydi"
    - "Nomga qarab baholash nimani kafolatlamasligini ayta olasiz"
---

## Muammo

Kriptografiyadagi xatolarning ko'pi algoritmning sinishidan emas, uning noto'g'ri ishlatilishidan chiqadi. Backend dasturchi bir kunda quyidagilarga duch keladi: telemetriya eksporti "shifrlangan bo'lsin" deyiladi, haydovchi telefon raqami logda "yashirilgan bo'lsin" deyiladi, reset havolasi "tasodifiy bo'lsin" deyiladi, ichki servislar orasidagi so'rov "imzolangan bo'lsin" deyiladi. Har bir iborada boshqa primitive yashiringan, lekin jamoada ularning farqini bilmaydigan odam ko'pincha eng yaqin tanish funksiyani tanlaydi: `md5`, `base64`, `Math.random()`, yoki o'zi yozgan "kichik shifrlash" funksiyasi.

OWASP Top 10:2025 da A04 Cryptographic Failures bu muammoni shunday ta'riflaydi: kriptografiya yo'qligi, yetarlicha kuchli bo'lmagani, kalitlar oshkor bo'lishi va shu kabi xatolar. Sahifaning fon qismi aytishicha, kategoriyadagi eng ko'p uchraydigan CWE'lar orasida zaif pseudo-random generator bilan bog'liqlari bor: CWE-331 (yetarli bo'lmagan entropiya), CWE-1241 (tasodifiy son generatorida bashorat qilinadigan algoritm) va CWE-338 (kriptografik jihatdan zaif PRNG); ular bilan birga CWE-327 (buzilgan yoki xavfli algoritm) ham sanaladi. Ya'ni eng keng tarqalgan xato "algoritm sinishi" emas, "tasodifiylik va tanlov" bilan bog'liq.

Bu modul (61-70-darslar) amaliy kriptografiya: primitive'lar, ularning vazifalari, protokollar (TLS 1.3), kalit va secrets boshqaruvi, post-quantum o'tish. Birinchi dars xarita beradi va asosiy qoidani asoslaydi: kriptografik primitive'ni o'zingiz yaratmaysiz, tekshirilgan implementatsiyani to'g'ri tanlab, to'g'ri ulaysiz. Parol saqlash (42-dars) va sessiya tokenlari (46-dars) bu xaritaning alohida holatlari edi; endi umumiy rasmni ko'ramiz.

## Asosiy g'oya

### Primitive'lar xaritasi

Kriptografik primitive - bitta aniq xususiyat beradigan blok. Xususiyat va primitive aralashib ketsa, xavfsizlik ko'rinadi, lekin yo'q. Xaritaning asosi:

| Kerak bo'lgan xususiyat | Primitive | Kirish va chiqish | Platformada misol |
|---|---|---|---|
| Ma'lumotning "barmoq izi" | Hash (SHA-256) | Ixtiyoriy uzunlik, qat'iy uzunlikdagi dayjest | Fayl nazorat yig'indisi |
| Umumiy kalit bilan yaxlitlik va haqiqiylik | MAC (HMAC-SHA-256) | Kalit + xabar, teg | Servislar orasidagi so'rov imzosi |
| Parolni tekshirish uchun saqlash | Parol hash funksiyasi (Argon2id, scrypt, bcrypt) | Parol + salt, sekin hash | Foydalanuvchi paroli (42-dars) |
| Maxfiylik va yaxlitlik birga | AEAD (AES-GCM, ChaCha20-Poly1305) | Kalit + nonce + ochiq matn, shifrmatn + teg | Bazadagi sezgir maydon |
| Umumiy kalitni ochiq kanalda kelishish | Key exchange (ECDH) | Ikki tomon ochiq kalitlari, umumiy sir | TLS handshake |
| Kim yozgani va o'zgarmaganini hammaga ko'rsatish | Raqamli imzo (Ed25519, ECDSA, RSA-PSS) | Maxfiy kalit bilan imzo, ochiq kalit bilan tekshiruv | Yuklab olinadigan reliz imzosi |
| Taxmin qilib bo'lmaydigan qiymat | CSPRNG | Tasodifiy baytlar | Kalit, nonce, sessiya tokeni |

Jadvaldan uchta narsa darhol ko'rinadi. Birinchisi, hash shifrlash emas: unda kalit yo'q va qaytarish uchun mo'ljallanmagan. Ikkinchisi, kodlash (base64, hex) ham shifrlash emas: unda sir yo'q. Uchinchisi, "shifrlangan" ma'lumot o'zgartirilishdan o'zi himoyalanmaydi; yaxlitlik uchun AEAD yoki MAC kerak.

### O'zingiz yozmaslik qoidasi

OWASP Top 10:2025 A04 oldini olish ro'yxatida aytilgan: iloji bo'lsa, algoritmlarning yaxshi sinalgan implementatsiyalaridan foydalaning. ASVS 5.0.0 esa buni talab sifatida yozadi: 11.2.1 - kriptografik operatsiyalar uchun sanoat tomonidan tekshirilgan implementatsiyalar (kutubxonalar va apparat tezlatgichlar) ishlatilishi kerak. Cheat sheet'dagi custom algoritmlar bo'limi esa bor-yo'g'i uch so'z: bunday qilmang.

Sababi nazariy emas. Kriptografik kod to'g'ri natija berishi bilan to'g'ri ishlagan hisoblanmaydi: yaxshi shifrlash va yomon shifrlash bir xil `encrypt(decrypt(x)) === x` testidan o'tadi. Farq hujumchi ko'radigan joyda: vaqt farqi, xato xabarlari, nonce takrori, kalit oqimining takrorlanishi. ASVS V11.2.4 barcha kriptografik operatsiyalar constant-time bo'lishini (taqqoslash va natijada "qisqa tutashuv" bo'lmasligini), V11.2.5 esa modullar xavfsiz tarzda xato berishini (masalan padding oracle'ga yo'l qo'ymasligini) so'raydi. Bular odatiy unit testda ko'rinmaydi. Tajribali kriptograflar yozgan va ko'p yil tekshirilgan kutubxona bu muammolarning ko'pini hal qilgan.

### Crypto agility va inventar

Ikkita yana muhim talab bor. ASVS 11.2.2: ilova shunday loyihalanishi kerakki, tasodifiy son, AEAD, MAC yoki hash algoritmlarini, kalit uzunligini va rejimlarni istalgan paytda almashtirish mumkin bo'lsin; kalitlarni almashtirib, ma'lumotni qayta shifrlash ham mumkin bo'lsin. Standart shuni post-quantum o'tish uchun ham zarur deydi (70-dars). ASVS 11.1.2: kriptografik inventar yuritiladi - ilova ishlatadigan barcha kalitlar, algoritmlar va sertifikatlar, ularni qayerda ishlatish mumkinligi va qaysi turdagi ma'lumotni himoya qilishi. Inventarsiz "MD5 qayerda ishlatiladi" degan savolga javob qidirish kodni qo'lda o'qishga tushadi.

## Chuqurroq: tanlov qanday qilinadi

### Holat jadvali: approved, legacy, disallowed

ASVS 5.0.0 Appendix C har mexanizmga uch holatdan birini beradi: approved (A, ilovalarda ishlatish mumkin), legacy (L, ishlatmaslik kerak, faqat eski tizim bilan moslik uchun) va disallowed (D, buzilgan yoki yetarli xavfsizlik bermaydi). Bu jadvaldan bir nechta amaliy xulosa chiqadi:

- Hash: SHA-256, SHA-512, SHA3 oilasi va BLAKE2/BLAKE3 approved. SHA-1 legacy va HMAC, KDF, imzo uchun yaramaydi. MD5, MD4 va CRC disallowed.
- Shifrlash: AES-256 va ChaCha20 oilasi approved. AES-128 jadvalda legacy deb belgilangan, DES, 3DES, RC4, Blowfish disallowed.
- Rejim: GCM va CCM approved. CBC legacy: u MAC bilan, encrypt-then-MAC tartibida bo'lsagina ishlatilishi mumkin. ECB, CFB, OFB va CTR disallowed (autentifikatsiyasiz).
- Imzo: Ed25519, ECDSA (P-256 va yuqori) va RSA-PSS approved. RSA PKCS#1 v1.5 imzo va DSA disallowed.
- Parol hash: Argon2id, scrypt, bcrypt (cost 10 va yuqori), PBKDF2 (SHA-256 uchun kamida 600 000 iteratsiya) approved. Aniq parametrlar 42-darsda.

Jadvalni yodlash shart emas; inventarni jadval bilan solishtiradigan skript yozing (quyidagi mashq aynan shu). Standart "ro'yxat o'zgarishi mumkin" deb yozadi: yangi kashfiyotlar va qonunchilik tufayli ilova uchun ro'yxat qayta ko'rib chiqilishi mumkin, shuning uchun mavjud holatni emas, joriy versiyani tekshiring.

### Xavfsizlik darajasi

ASVS 11.2.3: barcha primitive'lar kamida 128 bit xavfsizlik darajasini berishi kerak. Standart bir misol keltiradi: 256 bitli ECC kaliti qariyb 128 bit daraja beradigan joyda RSA uchun 3072 bitli kalit kerak. Bu aniq shunday yozilgan; shuning uchun RSA-2048 yoki AES-128 ni "yetarli deb o'ylash" o'rniga jadvaldagi darajani ko'rib chiqish kerak. OWASP Cryptographic Storage cheat sheet'i esa simmetrik shifrlash uchun kamida 128 bitli kalit, ideal holda 256 bit; RSA kerak bo'lsa kamida 2048 bit deydi. Bu ikki manba farqli talab beradi, shuning uchun loyihada qaysi manba asos qilib olinganini inventarda yozing.

### Qayerda shifrlanadi

Primitive tanlashdan oldin qaror: shifrlash qaysi qatlamda bo'ladi. Cryptographic Storage cheat sheet'i variantlarni sanaydi: ilova darajasi, ma'lumotlar bazasi darajasi (TDE), fayl tizimi (LUKS) va apparat darajasi. Qaysi biri mos kelishi tahdid modeliga bog'liq: disk shifrlash serverning jismoniy o'g'irlanishidan himoya qiladi, lekin masofadan kirgan hujumchini to'xtatmaydi. Ilova darajasida shifrlash esa SQL injection orqali bazani o'qigan hujumchiga ochiq matn bermaydi, agar kalit bazada emas, boshqa joyda turgan bo'lsa (68-dars). Cheat sheet yana bir ogohlantiradi: kriptografiya o'rniga emas, uning ustiga qo'shimcha qatlamlar bo'lishi kerak. Shifrlangan ma'lumot ham access control bilan (51-58 darslar) himoyalanadi, chunki ilova o'zi ma'lumotni ochib beradi.

## Misol: o'zi yozilgan "shifrlash"

Platformada API token mijozga "yashirin" ko'rinishda beriladi: tenant, mashina va ruxsat doirasi. Jamoa "tez va yengil" yechim yozdi: maxfiy so'zni takrorlab XOR qilish va base64 ga o'rash. Misol faqat shu o'quv kodiga qarshi.

### Zaif kod

```ts run
// ZAIF: kalit oqimi 5 baytdan iborat va takrorlanadi; yaxlitlik tekshiruvi yo'q.
const SECRET = "fleet";
const enc = new TextEncoder();
const dec = new TextDecoder();

const toB64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const xor = (data: Uint8Array, key: Uint8Array) => data.map((b, i) => b ^ key[i % key.length]);

function issue(tenant: string, vehicle: string): string {
  return toB64(xor(enc.encode(`${tenant}|${vehicle}|read`), enc.encode(SECRET)));
}

function open(token: string): { tenant: string; vehicle: string; scope: string } {
  const [tenant, vehicle, scope] = dec.decode(xor(fromB64(token), enc.encode(SECRET))).split("|");
  return { tenant, vehicle, scope };
}

const mine = issue("alfa", "v1");
console.log("o'z tokeni:", mine);
console.log("server ochdi:", open(mine));
```

```text
o'z tokeni: BwADBAgQXRkXEQcI
server ochdi: {
  "tenant": "alfa",
  "vehicle": "v1",
  "scope": "read"
}
```

Funksiyalar to'g'ri ishlaydi: token chiqadi, server uni ochadi. Aynan shu "ishlaydi" holati xavfli: test o'tdi, lekin xavfsizlik xususiyati yo'q.

### Hujum

> **Ta'lim maqsadida.** Bu kalit oqimini qayta ishlatish orqali ochish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

"alfa" tenant'ining foydalanuvchisi o'z tokenini qonuniy yo'l bilan oladi va token formatini (`tenant|vehicle|read`) biladi, chunki o'z tokenini ochib ko'rishi mumkin yoki hujjatdan o'qigan. Shifrmatn XOR ochiq matn kalit oqimini beradi. Kalit qisqa va takrorlanadi, shuning uchun besh bayt yetadi. Quyidagi blok zaif funksiyalarning qisqartirilgan nusxasi (yuqoridagi bilan bir xil) va hujumni o'z ichiga oladi.

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();
const toB64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const xor = (data: Uint8Array, key: Uint8Array) => data.map((b, i) => b ^ key[i % key.length]);
const issue = (t: string, v: string) => toB64(xor(enc.encode(`${t}|${v}|read`), enc.encode("fleet")));
const open = (tok: string) => {
  const [tenant, vehicle, scope] = dec.decode(xor(fromB64(tok), enc.encode("fleet"))).split("|");
  return { tenant, vehicle, scope };
};

// Hujumchining ma'lumoti: o'z tokeni va uning ochiq matni.
const mine = issue("alfa", "v1");
const known = enc.encode("alfa|v1|read");

const stream = fromB64(mine).map((b, i) => b ^ known[i]).slice(0, 5);
console.log("tiklangan kalit:", dec.decode(stream));

const forged = toB64(xor(enc.encode("beta|v2|read"), stream));
console.log("soxta token:", forged);
console.log("server ochdi:", open(forged));
```

```text
tiklangan kalit: fleet
soxta token: BAkRBAgQXhkXEQcI
server ochdi: {
  "tenant": "beta",
  "vehicle": "v2",
  "scope": "read"
}
```

Hujumchi "beta" tenant'ining mashinasi uchun token yasadi va server uni haqiqiy deb qabul qildi. Maxfiylik (kalit tiklandi) va yaxlitlik (token soxtalashtirildi) birga buzildi. Shifrmatnning bitta baytini o'zgartirish ham tegishli ochiq matn baytini o'zgartirardi: bu sxemada yaxlitlik tekshiruvi yo'q.

### Tuzatilgan kod

Tuzatish: o'z sxemasini tashlab, AEAD ishlatamiz. Bu yerda brauzer va Node'da bir xil ishlaydigan WebCrypto (`crypto.subtle`) bilan AES-256-GCM. Kalit CSPRNG orqali yaratiladi, har token uchun yangi 12 baytli nonce olinadi, GCM esa teg bilan yaxlitlikni tekshiradi.

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();
const toB64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const xor = (data: Uint8Array, key: Uint8Array) => data.map((b, i) => b ^ key[i % key.length]);

const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);

async function seal(tenant: string, vehicle: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const body = enc.encode(JSON.stringify({ tenant, vehicle, scope: "read" }));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, body));
  return toB64(new Uint8Array([...iv, ...ct]));
}

async function unseal(token: string) {
  try {
    const raw = fromB64(token);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: raw.slice(0, 12) }, key, raw.slice(12));
    return JSON.parse(dec.decode(pt));
  } catch {
    return null; // butun token yaroqsiz: qisman natija qaytarilmaydi
  }
}

const good = await seal("alfa", "v1");
console.log("o'z tokeni ochildi:", await unseal(good));

const raw = fromB64(good);
raw[20] ^= 1; // bitta bitni o'zgartirish
console.log("bit o'zgartirilgan token:", await unseal(toB64(raw)));
console.log("eski usuldagi soxta token:", await unseal(toB64(xor(enc.encode("beta|v2|read"), enc.encode("fleet")))));
```

```text
o'z tokeni ochildi: {
  "tenant": "alfa",
  "vehicle": "v1",
  "scope": "read"
}
bit o'zgartirilgan token: null
eski usuldagi soxta token: null
```

Nima uchun yetarli: kalit endi 256 bit tasodifiy qiymat va sxema ma'lum ochiq matn hujumida kalit oqimini bermaydi, chunki har token uchun nonce boshqa. GCM tegi shifrmatnning o'zgarishini aniqlaydi, shuning uchun bitta bit o'zgarishi va eski usuldagi soxta token `null` beradi. Kalit `extractable: false` bilan yaratilgan, ya'ni JavaScript kodi uni baytlarga aylantirib olmaydi.

Nimani yopmaydi. Birinchidan, token muddati yo'q: o'g'irlangan token abadiy ishlaydi (muddatni payload ichiga qo'ying va tekshiring; sessiya va JWT masalalari 46 va 47-darslarda). Ikkinchidan, kalit bu kodda jarayon xotirasida yaratiladi; real tizimda u boshqariladigan joyda saqlanadi va rotatsiya qilinadi (68-dars). Uchinchidan, nonce takrorlanmasligi muhim: bir kalit bilan juda ko'p tasodifiy nonce ishlatilsa to'qnashuv ehtimoli oshadi, bu 63-darsda. To'rtinchidan, agar tokenni faqat server o'qisa, uni umuman shifrlash shart emas: imzolangan (MAC) yoki bazadagi tasodifiy identifikator ko'pincha soddaroq.

### Mashq: primitive tanlash

Quyidagi funksiya talabga mos primitive nomini qaytaradi, lekin ikkita javobi xato. Testlardan qaysi biri o'tmayotganini ko'ring va jadvalga qarab tuzating.

```ts run
// Talab -> primitive. Nomlar: "hash", "hmac", "password-hash", "aead", "key-exchange", "signature", "csprng".
function primitiveFor(need: string): string {
  switch (need) {
    case "password-storage": return "hash";
    case "shared-key-integrity": return "hmac";
    case "confidential-and-tamper-proof": return "hash";
    case "unguessable-token": return "csprng";
    case "public-release-signature": return "signature";
    case "file-fingerprint": return "hash";
    default: throw new RangeError("noma'lum talab: " + need);
  }
}
```

```ts test
check("parol saqlash uchun parol hash funksiyasi", () => primitiveFor("password-storage") === "password-hash");
check("maxfiylik va yaxlitlik birga uchun AEAD", () => primitiveFor("confidential-and-tamper-proof") === "aead");
check("umumiy kalit bilan yaxlitlik uchun HMAC", () => primitiveFor("shared-key-integrity") === "hmac");
check("taxmin qilinmaydigan token uchun CSPRNG", () => primitiveFor("unguessable-token") === "csprng");
check("noma'lum talab xato beradi", () => {
  try { primitiveFor("x"); return false; } catch (e) { return e instanceof RangeError; }
});
```

## Qachon qo'llamaslik kerak

Hamma narsani shifrlash qoidasi emas. ASVS V11.1 kirish qismi ochiq aytadi: hamma narsani shifrlash isrof, hech narsani shifrlamaslik esa qonun nuqtai nazaridan beparvolik; muvozanat arxitektura bosqichida topiladi. Shifrlash kalit boshqaruvi, kodlash murakkabligi va ba'zan qidiruv imkoniyatini yo'qotish narxiga keladi: shifrlangan maydon bo'yicha SQL'da `WHERE` va indeks ishlamaydi. OWASP A04 oldini olish ro'yxati shu sababli shifrlashdan oldin ma'lumotni tasniflashni va keraksiz sezgir ma'lumotni umuman saqlamaslikni talab qiladi: saqlanmagan ma'lumot o'g'irlanmaydi.

"O'zingiz yozmang" qoidasining ham chegarasi bor. Kutubxonani tanlash va ulash sizning kodingiz: noto'g'ri rejim, takror nonce, qo'lda `==` bilan taqqoslash. Sinalgan kutubxona noto'g'ri API chaqirig'idan himoya qilmaydi, shuning uchun yuqori darajadagi, qiyin buzib bo'ladigan API ustun (masalan AEAD interfeysi nonce va tegni birga boshqaradi, "xom" blok shifr esa yo'q). Shuningdek, kriptografiya mantiqiy xatolarni tuzatmaydi: boshqa tenant'ning ma'lumoti AES bilan shifrlangan bo'lsa ham, ilova uni so'rovchiga ochib bersa, hujum yutadi (52 va 55-darslar).

## Stack'da: Node.js va Next.js

Node.js'da ikkita yo'l bor: `node:crypto` moduli (server tomonida to'liq API, shu jumladan taqqoslash uchun `crypto.timingSafeEqual`) va global WebCrypto (`crypto.subtle`, `crypto.getRandomValues`), u Node, brauzer va Next.js Edge runtime uchun bir xil. Node.js Security Best Practices hujjati timing attack bo'limida sirlarni taqqoslashda `crypto.timingSafeEqual` ishlatishni va sirni vaqtga bog'liq operatsiyalarda (masalan shartli tarmoqlanishda) ishlatmaslikni tavsiya qiladi. Shuning uchun sirli qiymatni `===` bilan solishtirmang (62-darsda ko'ramiz).

NestJS'da kriptografiyani bitta provayderga (masalan `CryptoService`) yig'ing: algoritm nomi, kalit identifikatori va versiya bitta joyda. Shunda ASVS 11.2.2 talab qilgan almashtirish imkoniyati paydo bo'ladi va inventar yuritish osonlashadi: butun kodni emas, bitta modulni tekshirasiz. Prisma yoki Kysely bilan sezgir maydon saqlansa, shifrlash qatlami repository chegarasida bo'ladi, nazoratchi (controller) kodi esa ochiq matn ko'rmaydi. Parol, sessiya va JWT uchun kutubxona bilan "o'z sxemangiz" o'rniga yetuk yechimlardan foydalaning (42, 46, 47-darslar).

## Xulosa

- Primitive'lar vazifa bo'yicha tanlanadi: hash - barmoq izi, MAC - umumiy kalit bilan yaxlitlik, parol hash - parol, AEAD - maxfiylik va yaxlitlik, imzo va key exchange - ochiq kalit vazifalari, CSPRNG - tasodifiylik.
- Kodlash va hash shifrlash emas; shifrlash o'zgartirishdan o'zi himoya qilmaydi, buning uchun AEAD yoki MAC kerak.
- Kriptografik primitive'ni o'zingiz yozmaysiz: ASVS 11.2.1 sanoat tomonidan tekshirilgan implementatsiyalarni talab qiladi, chunki asosiy xatolar (vaqt farqi, nonce, xato xabari) testda ko'rinmaydi.
- ASVS Appendix C holatlari (approved, legacy, disallowed) bo'yicha inventar yuriting va noma'lum algoritmni "approved" deb qabul qilmang.
- Algoritm va primitive almashtirilishi mumkin bo'lsin (crypto agility), kalit va parametrlar bitta joyda tursin.
- Kriptografiya access control, kalit boshqaruvi va ma'lumotni kam saqlash o'rnini bosmaydi: bular birgalikda ishlaydi.
