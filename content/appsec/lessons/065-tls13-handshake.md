---
n: 65
slug: tls13-handshake
title: "TLS 1.3 handshake"
summary: "TLS 1.3 handshake bosqichlari (key exchange, server parameters, authentication), HKDF asosidagi kalit jadvali, Finished xabari bilan handshake yaxlitligi va downgrade himoyasi, 0-RTT replay xavfi, TLS 1.2 dan farqlar va konfiguratsiya xatolari."
duration: 50
sources:
  - id: rfc8446
    note: "RFC 8446: 1.2 (TLS 1.2 dan asosiy farqlar), 2 (protokol umumiy ko'rinishi va 1-rasm), 2.3 va Appendix E.5 (0-RTT va replay), 4.1.3 (downgrade himoyasi), 4.4.3 (CertificateVerify), 7.1 (HKDF-Expand-Label), 9.1 (majburiy suite'lar). Kalit jadvali va Finished tafsilotlari darslik darajasida yozilgan"
  - id: t10-a04
    note: "A04:2025 'How to prevent': TLS 1.2 va undan yuqori faqat forward secrecy cipher'lar bilan, CBC'dan voz kechish, HSTS, kvant bardosh kalit almashish algoritmlari; tekshiriladigan savollar: sertifikat va ishonch zanjiri tekshiruvi, algoritm downgrade"
  - id: rfc5280
    note: "RFC 5280 6.1.3 va 4.1.2.5: sertifikat yo'li tekshiruvi (imzo, muddat, bekor qilinmaganlik) va validity davri; bu darsda sertifikat tekshiruvi qisqa eslatiladi, to'liq 66-darsda"
  - id: pg-libpq-ssl
    note: "PostgreSQL libpq 32.19 SSL Support: sslmode qiymatlari (disable, allow, prefer, require, verify-ca, verify-full), standart prefer qiymati xavfsiz muhit uchun tavsiya etilmaydi, verify-full server nomini ham tekshiradi"
  - id: redis-tls
    note: "Redis TLS sahifasi: tls-port va port 0, tls-cert-file, tls-key-file, tls-ca-cert-file, standart holatda mutual TLS (tls-auth-clients), tls-replication va tls-cluster"
  - id: cs-pqc
    note: "Post-Quantum Cryptography cheat sheet: X25519MLKEM768 kabi hybrid exchange'ni pilot qilish, hybrid kalit almashish sertifikat imzosini kvantga bardosh qilmasligi"
quiz:
  - q: "TLS 1.3 handshake'da ServerHello'dan keyingi xabarlar (EncryptedExtensions, Certificate, CertificateVerify, Finished) haqida qaysi gap to'g'ri?"
    options:
      - "Hammasi ochiq yuboriladi, chunki sertifikat ochiq ma'lumot"
      - "Faqat Finished shifrlanadi"
      - "Ular handshake traffic kalitlari bilan shifrlanadi"
      - "Ular faqat TLS 1.2 da shifrlanadi"
    answer: 2
    explain: "RFC 8446 1.2: ServerHello'dan keyingi barcha handshake xabarlari shifrlangan; shuning uchun sertifikat ham passiv kuzatuvchiga ko'rinmaydi (2-rasmda {} belgisi)."
  - q: "Kimdir ClientHello'dagi cipher suite ro'yxatini yo'lda o'zgartirib, zaifroq variantni majbur qilmoqchi (downgrade). TLS 1.3 buni qanday aniqlaydi?"
    options:
      - "Finished xabari handshake transkriptining MAC'i; ikki tomon ko'rgan transkript farq qilsa Finished mos kelmaydi va handshake to'xtaydi"
      - "Server ClientHello'ni imzolaydi"
      - "Brauzer har doim eng zaif variantni rad etadi"
      - "Hech narsa; downgrade TLS 1.3 da mumkin"
    answer: 0
    explain: "Kalitlar va Finished transkript hash'iga bog'liq. O'zgargan ClientHello ikki tomonda turli transkript beradi; autentifikatsiya qilingan Finished/CertificateVerify buni ushlaydi."
  - q: "0-RTT (early data) haqida RFC 8446 nimani aytadi?"
    options:
      - "U 1-RTT bilan bir xil xavfsizlik beradi va replay'dan himoyalangan"
      - "U forward secret emas va ulanishlar orasida replay'dan kafolat yo'q; shuning uchun profilsiz ishlatilmaydi"
      - "U faqat parol almashish uchun"
      - "U sertifikatni almashtiradi"
    answer: 1
    explain: "0-RTT ma'lumot oldingi PSK'dan hosil kalit bilan shifrlanadi (forward secrecy yo'q) va replay himoyasi yo'q. Server yoki ilova darajasida bir martalik qabul qilish kerak; to'lov yoki holat o'zgartiruvchi so'rovlarga mos emas."
  - q: "A04:2025 'How to prevent' bo'yicha tranzitdagi ma'lumot uchun minimal talab qaysi?"
    options:
      - "Har qanday TLS versiyasi, agar sertifikat bor bo'lsa"
      - "TLS 1.0 va forward secrecy ixtiyoriy"
      - "Faqat HSTS yetarli, versiya ahamiyatsiz"
      - "TLS 1.2 va undan yuqori, forward secrecy cipher'lar bilan, CBC'dan voz kechish, HTTPS uchun HSTS"
    answer: 3
    explain: "A04: >= TLS 1.2 faqat forward secrecy cipher'lar bilan, CBC cipher'larni olib tashlash, kvant bardosh kalit almashish algoritmlarini qo'llash va HTTPS uchun HSTS."
  - q: "Servis `TLS_RSA_WITH_AES_128_CBC_SHA` suite'ini qo'llab-quvvatlaydi. Nima uchun bu muammo?"
    options:
      - "Nomi uzun"
      - "Static RSA kalit transporti forward secrecy bermaydi va CBC (MAC-then-encrypt) eskirgan; TLS 1.3 ikkalasini ham olib tashlagan"
      - "AES TLS'da ishlatilmaydi"
      - "SHA TLS'da taqiqlangan"
    answer: 1
    explain: "RFC 8446 1.2: statik RSA va DH suite'lari olib tashlangan, simmetrik algoritmlar faqat AEAD. ASVS Appendix C ham RSA PKCS#1 v1.5 kalit transportini disallowed, CBC'ni legacy deb belgilaydi."
  - q: "Zamonaviy hybrid TLS kalit almashish (X25519MLKEM768) yoqildi. Bu qanday ta'sir qiladi?"
    options:
      - "Kalit almashish (maxfiylik) kvant tahdidiga qarshi kuchayadi, lekin sertifikat imzolari klassik bo'lib qoladi va ular uchun alohida migratsiya kerak"
      - "Server sertifikati ham avtomatik kvantga bardosh bo'ladi"
      - "TLS 1.3 kerak bo'lmay qoladi"
      - "Forward secrecy yo'qoladi"
    answer: 0
    explain: "OWASP PQC cheat sheet: hybrid TLS kalit almashish sertifikat imzolarini kvantga bardosh qilmaydi; autentifikatsiya algoritmlari alohida tekshiriladi (70-dars)."
task:
  title: "TLS konfiguratsiya linteri"
  prompt: |
    Jamoa servislarning TLS sozlamalarini inventarlashtirmoqchi. `lintTls(cfg)` funksiyasi hozir har doim bo'sh ro'yxat qaytaradi.

    Quyidagi qoidalar bo'yicha topilgan muammolarni matn ko'rinishida qaytaring (har qoida uchun bitta qator, tartib shu ro'yxatdagidek):
    1. `minVersion` 1.2 dan past (qiymatlar: `"1.0"`, `"1.1"`, `"1.2"`, `"1.3"`): `"versiya < 1.2"`.
    2. Suite nomida `_CBC_` bor: `"CBC suite"`.
    3. Suite nomi `TLS_RSA_` bilan boshlansa (static RSA, forward secrecy yo'q): `"forward secrecy yo'q"`.
    4. `hsts` `false`: `"HSTS yo'q"`.
    5. `earlyData` yoqilgan va `replayProtection` `false`: `"0-RTT replay himoyasiz"`.

    Qoida bir necha suite uchun takrorlansa ham bir marta yoziladi. Konfiguratsiyalar va `console.log`larni o'zgartirmang. Kutilgan chiqish: `gps-api` uchun 5 ta muammo, `telemetry-ingest` uchun 1 ta, `admin-panel` uchun `[]`.
  lang: ts
  starter: |
    type Cfg = {
      name: string;
      minVersion: "1.0" | "1.1" | "1.2" | "1.3";
      suites: string[];
      hsts: boolean;
      earlyData: boolean;
      replayProtection: boolean;
    };

    function lintTls(cfg: Cfg): string[] {
      return [];
    }

    const configs: Cfg[] = [
      {
        name: "gps-api", minVersion: "1.0",
        suites: ["TLS_RSA_WITH_AES_128_CBC_SHA", "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"],
        hsts: false, earlyData: true, replayProtection: false,
      },
      {
        name: "telemetry-ingest", minVersion: "1.2",
        suites: ["TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384"],
        hsts: true, earlyData: false, replayProtection: false,
      },
      {
        name: "admin-panel", minVersion: "1.3",
        suites: ["TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256"],
        hsts: true, earlyData: false, replayProtection: false,
      },
    ];

    for (const c of configs) console.log(c.name, lintTls(c).length, JSON.stringify(lintTls(c)));
  solution: |
    type Cfg = {
      name: string;
      minVersion: "1.0" | "1.1" | "1.2" | "1.3";
      suites: string[];
      hsts: boolean;
      earlyData: boolean;
      replayProtection: boolean;
    };

    const ORDER = ["1.0", "1.1", "1.2", "1.3"];

    function lintTls(cfg: Cfg): string[] {
      const out: string[] = [];
      if (ORDER.indexOf(cfg.minVersion) < ORDER.indexOf("1.2")) out.push("versiya < 1.2");
      if (cfg.suites.some((s) => s.includes("_CBC_"))) out.push("CBC suite");
      if (cfg.suites.some((s) => s.startsWith("TLS_RSA_"))) out.push("forward secrecy yo'q");
      if (!cfg.hsts) out.push("HSTS yo'q");
      if (cfg.earlyData && !cfg.replayProtection) out.push("0-RTT replay himoyasiz");
      return out;
    }

    const configs: Cfg[] = [
      {
        name: "gps-api", minVersion: "1.0",
        suites: ["TLS_RSA_WITH_AES_128_CBC_SHA", "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"],
        hsts: false, earlyData: true, replayProtection: false,
      },
      {
        name: "telemetry-ingest", minVersion: "1.2",
        suites: ["TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384"],
        hsts: true, earlyData: false, replayProtection: false,
      },
      {
        name: "admin-panel", minVersion: "1.3",
        suites: ["TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256"],
        hsts: true, earlyData: false, replayProtection: false,
      },
    ];

    for (const c of configs) console.log(c.name, lintTls(c).length, JSON.stringify(lintTls(c)));
  solutionNotes: |
    - Versiya tartibi qatorlar bilan emas, `ORDER` ro'yxatidagi o'rin bilan solishtiriladi: `"1.10"` kabi kelajakdagi satr bilan leksikografik taqqoslash xato beradi.
    - `_CBC_` va `TLS_RSA_` qoidalari alohida: `TLS_ECDHE_..._CBC_...` forward secrecy beradi, lekin CBC; `TLS_RSA_..._GCM_...` AEAD, lekin forward secrecy yo'q.
    - Linter faqat nomga qaraydi. U sertifikat zanjirini, haqiqiy muzokaralangan suite'ni va serverning real xatti-harakatini ko'rmaydi: real tekshiruv uchun tashqaridan ulanib natijani o'lchaydigan vosita kerak (tashqi vosita sifatida, faqat o'z tizimlaringizda).
    - TLS 1.3 suite'lari (`TLS_AES_...`) faqat AEAD va ephemeral kalit almashishga ega, shuning uchun uchinchi konfiguratsiya toza.
  checklist:
    - "Har bir qoida to'g'ri shart bilan ishlaydi va matni aynan berilganidek"
    - "Qoida bir necha suite uchun takrorlansa bir marta yoziladi"
    - "Toza konfiguratsiya bo'sh ro'yxat qaytaradi"
    - "Versiya satr emas, tartib bo'yicha solishtiriladi"
    - "Linter nimani ko'rmasligini ayta olasiz"
---

## Muammo

HTTPS yoqilgan bo'lsa, ko'pchilik jamoa "transport xavfsiz" deb hisoblaydi. Aslida TLS sozlamalarida jim xatolar ko'p: eski versiya qo'llab-quvvatlanadi, CBC suite'lari ro'yxatda qolgan, static RSA kalit almashish forward secrecy bermaydi, sertifikat zanjiri tekshirilmaydi, reverse proxy va servis orasidagi ichki tarmoq ochiq HTTP, 0-RTT yoqilgan, lekin ilovada replay himoyasi yo'q. Bularning hammasi test paytida "ishlaydi", chunki ulanish o'rnatiladi.

OWASP Top 10:2025 A04 tranzitdagi ma'lumot haqida aniq: barcha ma'lumot transport qatlamida shifrlanishi kerak, sertifikat va kalit boshqaruvi kamchiliklari CPU tezlatgichlari va LetsEncrypt kabi xizmatlar tufayli endi to'siq emas. Tekshiriladigan savollarda ham shu bor: sertifikat va ishonch zanjiri to'g'ri tekshirilyaptimi, shifrlash majburiymi (HTTP sarlavhalari yetishmayaptimi), algoritmni pasaytirish yoki aylanib o'tish mumkinmi. Handshake'ning ichki tuzilishini bilmasdan bu savollarga javob berish qiyin.

Bu dars TLS 1.3 (RFC 8446) handshake'ini kriptografiya nuqtai nazaridan ochadi: nima almashiladi, kalitlar qanday chiqariladi, nima uchun downgrade qiyin, 0-RTT nega xavfli. Oldingi uch dars (hash, AEAD, imzo va kalit kelishish) bu yerda bitta protokolga birlashadi. Sertifikat va PKI 66-darsda, HSTS va HTTPS sozlamalari 16 va 18-darslarda.

## Asosiy g'oya

### Uch bosqich

RFC 8446 2-bo'limi handshake'ni uch bosqichli deb ta'riflaydi: Key Exchange (umumiy kalit material kelishiladi va kriptografik parametrlar tanlanadi; shundan keyingi hamma narsa shifrlangan), Server Parameters (mijoz autentifikatsiya qilinadimi, ilova qatlami protokoli va hokazo) va Authentication (server va ixtiyoriy ravishda mijoz autentifikatsiya qilinadi, kalitlar tasdiqlanadi va handshake yaxlitligi ta'minlanadi). Xabarlar oqimi:

```text
Client                                           Server
ClientHello  (+ key_share, supported_versions,
              signature_algorithms)   -------->
                                                 ServerHello (+ key_share)
                                       {EncryptedExtensions}
                                       {Certificate}
                                       {CertificateVerify}
                                       {Finished}
                              <--------  [Application Data]
{Finished}                    -------->
[Application Data]            <------->  [Application Data]
```

Figuradagi `{}` handshake traffic kalitlari bilan shifrlangan xabarlarni, `[]` application traffic kalitlari bilan himoyalanganlarini bildiradi (RFC 8446 1-rasmi bilan mos). Asosiy g'oya: mijoz ClientHello'da o'zi tomonidan taklif qilingan algoritmlar bilan birga darhol (EC)DHE kalit ulushini (`key_share`) yuboradi. Server bittasini tanlab, o'z ulushini ServerHello'da qaytaradi. Shu nuqtada ikki tomon umumiy sirga ega va qolgan hamma narsa shifrlanadi. Shuning uchun TLS 1.3 to'liq handshake'i bir aylanish (1-RTT) bilan tugaydi va passiv kuzatuvchi serverning sertifikatini ham ko'rmaydi: RFC 1.2 bo'limi ServerHello'dan keyingi barcha handshake xabarlari shifrlangan deb yozadi.

### TLS 1.2 dan farqlar

RFC 8446 1.2 bo'limi asosiy farqlarni sanaydi (bu ro'yxat to'liq emas):

- Simmetrik algoritmlar ro'yxatidan eskirganlari chiqarilgan, qolganlarining hammasi AEAD. Cipher suite tushunchasi o'zgargan: autentifikatsiya va kalit almashish mexanizmlari yozuvni himoyalash algoritmi (kalit uzunligi bilan) va hash'dan ajratilgan.
- Statik RSA va Diffie-Hellman suite'lari olib tashlangan: ochiq kalit asosidagi har qanday kalit almashish forward secrecy beradi.
- ServerHello'dan keyin hamma handshake xabarlari shifrlangan (EncryptedExtensions kiritilgan).
- Kalit chiqarish funksiyalari qayta loyihalangan, HKDF asos qilib olingan.
- Siqish, DSA va moslashtirilgan DHE guruhlari olib tashlangan; RSA imzolari uchun RSASSA-PSS ishlatiladi; ChangeCipherSpec faqat middlebox moslashuvi uchun qolgan.
- 0-RTT rejimi qo'shilgan: ba'zi ma'lumotlar uchun bir aylanish tejaladi, lekin ayrim xavfsizlik xususiyatlari hisobiga.

Majburiy implementatsiya (9.1-bo'lim, boshqa ilova profili ko'rsatilmagan bo'lsa): `TLS_AES_128_GCM_SHA256` MUST, `TLS_AES_256_GCM_SHA384` va `TLS_CHACHA20_POLY1305_SHA256` SHOULD; kalit almashish uchun secp256r1 (P-256) MUST, X25519 SHOULD. Ko'rinib turibdiki, suite nomi endi faqat AEAD va hash'ni bildiradi (`TLS_AES_128_GCM_SHA256`), kalit almashish va imzo algoritmi alohida kelishiladi. A04 oldini olish ro'yxati ham mos: TLS 1.2 va undan yuqori, forward secrecy cipher'lar bilan, CBC cipher'larni olib tashlash, kvantga bardosh kalit almashish algoritmlarini qo'llab-quvvatlash va HTTPS uchun HSTS (16-dars).

## Chuqurroq: kalit jadvali va yaxlitlik

### HKDF va transkript

Kalitlar bitta umumiy sirdan emas, zanjir bilan chiqariladi. RFC 8446 7.1: kalit chiqarish HKDF-Extract va HKDF-Expand funksiyalaridan foydalanadi; ikkita kirish siri bor: PSK (oldin kelishilgan yoki oldingi ulanishdan olingan) va (EC)DHE umumiy siri. Yangi sir qo'shish usuli: joriy holat tuz (salt) sifatida, yangi sir esa kirish kalit material (IKM) sifatida HKDF-Extract'ga beriladi. Konkret kalit `HKDF-Expand-Label(Secret, Label, Context, Length)` bilan chiqariladi, bunda `HkdfLabel` tuzilmasi 16 bitli uzunlik, `"tls13 " + Label` va kontekstdan iborat. `Derive-Secret` esa kontekst sifatida shu paytgacha yuborilgan handshake xabarlarining transkript hash'ini oladi.

Bundan muhim xususiyat kelib chiqadi: traffic kalitlari handshake'ning shu paytgacha ko'rilgan hamma xabariga bog'liq. Mijoz va server har xil ClientHello ko'rgan bo'lsa, ular har xil kalit chiqaradi. Yaxlitlikni esa Finished xabari ta'minlaydi: u transkript hash'ining MAC'i, ya'ni handshake'ning "tasdiqlovchi imzosi", uni to'g'ri hisoblash uchun handshake kalitini bilish kerak. Server ham CertificateVerify yuboradi: RFC 4.4.3 uni sertifikatga mos maxfiy kalitga egalikning aniq isboti va handshake'ning shu paytgacha yaxlitligini ta'minlovchi xabar deb ta'riflaydi. Imzo 64 ta bo'sh joy bayti, kontekst satri va transkript hash'i ustidan hisoblanadi; shu tuzilma oldingi TLS versiyalaridagi tanlangan prefiks hujumini oldini olish uchun mo'ljallangan.

### Downgrade va sertifikat tekshiruvi

Downgrade hujumida hujumchi ClientHello'dagi algoritm ro'yxatini yo'lda o'zgartirib, ikki tomonni zaifroq variantga majbur qiladi. Himoya shunga asoslanadi: o'zgargan ro'yxat transkriptni o'zgartiradi va Finished/CertificateVerify mos kelmaydi. Qo'shimcha mexanizm: RFC 8446 4.1.3 bo'yicha TLS 1.3 server TLS 1.2 yoki undan past versiyani muzokara qilsa, ServerHello.Random maydonining oxirgi 8 baytini maxsus qiymat bilan to'ldirishi shart (TLS 1.2 uchun `DOWNGRD` ASCII matni va 0x01 bayti, TLS 1.1 yoki past uchun oxirgi bayt 0x00). TLS 1.3 qo'llaydigan mijoz bunday qiymatni ko'rsa, handshake'ni to'xtatadi, shuning uchun hujumchi serverni kuch bilan eski versiyaga tushira olmaydi.

Sertifikatni tekshirish mijoz tomonidagi mas'uliyat: RFC 5280 6.1.3 bo'limi yo'ldagi har bir sertifikat uchun imzo tekshirilishi, validity davri joriy vaqtni qamrashi, sertifikat bekor qilinmaganligi va issuer nomi mos kelishi kerakligini yozadi. Kutubxonada sertifikat tekshiruvini o'chirib qo'yish (`rejectUnauthorized: false` kabi bayroq) butun handshake'ni autentifikatsiyasiz qoldiradi: ikkala tomon shifrlangan kanal o'rnatadi, lekin kim bilan ekani noma'lum (64-darsdagi MITM). Bu A04 tekshirish ro'yxatidagi "server sertifikati va ishonch zanjiri to'g'ri tekshirilyaptimi" savoliga to'g'ri keladi. PKI tafsiloti 66-darsda.

### 0-RTT: tezlik va replay

Ilgari ulangan tomonlar PSK ulashsa, TLS 1.3 mijozga birinchi parvozda ma'lumot yuborishga ruxsat beradi (early data, 2.3-bo'lim). RFC 8446 aniq aytadi: 0-RTT ma'lumot xavfsizligi boshqa TLS ma'lumotlaridan zaifroq. U forward secret emas, chunki faqat taklif qilingan PSK'dan hosil kalit bilan shifrlanadi. Va ulanishlar orasida replay'ga qarshi kafolat yo'q: oddiy 1-RTT ma'lumotini replay'dan serverning Random qiymati himoya qiladi, 0-RTT esa ServerHello'ga bog'liq emas. RFC 8446 Appendix E.5 aniq yozadi: ilova protokollari 0-RTT ma'lumotdan uni aniqlovchi profilsiz foydalanmasligi kerak (MUST NOT), mijozlar replay qilinsa xavfli xabarlarni early data'da yubormasligi kerak va TLS implementatsiyalari ilova so'ramaguncha 0-RTT'ni yoqmasligi kerak. Oxir-oqibat serverlar o'zlarini replay'dan o'zlari himoya qilishi kerak; 8-bo'limda bunday mexanizmlar (bir martalik ticket'lar, ClientHello yozuvi va yangilik tekshiruvi) tasvirlangan. Ularning tafsilotini bu dars chuqur ochmaydi: asosiy xulosa shuki, replay himoyasi TLS kutubxonasining standart xususiyati emas, uni siz yoqasiz va ilova qatlamida ham ta'minlaysiz.

Amaliy qoida: holatni o'zgartiradigan so'rovlar (POST, to'lov, buyruq yuborish) uchun 0-RTT yoqmang yoki ularni idempotent qiling. Idempotency kalitlari 75-darsda.

## Misol: downgrade va transkript bog'langan Finished

Quyidagi misol TLS emas, balki uning g'oyasining o'quv modeli: faqat shu o'quv kodiga qarshi. Mijoz ikki variantni taklif qiladi: zamonaviy `AEAD-GCM` va moslik uchun eski `XOR-LEGACY`.

### Zaif kod

Zaif modelda server mijozning ro'yxatidan eng yaxshisini tanlaydi, mijoz esa serverning tanlovi o'zi taklif qilgan ro'yxatda bo'lsa qabul qiladi. Handshake yaxlitligini tekshiradigan narsa yo'q.

```ts run
type Hello = { suites: string[] };

// Server eng yaxshi umumiy variantni tanlaydi.
const serverPick = (h: Hello): string | null =>
  h.suites.includes("AEAD-GCM") ? "AEAD-GCM" : h.suites.includes("XOR-LEGACY") ? "XOR-LEGACY" : null;

// ZAIF: tanlov mijoz ro'yxatida bo'lsa bo'ldi; ClientHello server ko'rgan bilan bir xilligi tekshirilmaydi.
const clientAccepts = (offer: Hello, chosen: string | null) => chosen !== null && offer.suites.includes(chosen);

const clientHello: Hello = { suites: ["AEAD-GCM", "XOR-LEGACY"] }; // moslik uchun eski variant ham bor
const chosen = serverPick(clientHello);
console.log("tanlangan:", chosen, "| mijoz qabul qiladi:", clientAccepts(clientHello, chosen));
```

```text
tanlangan: AEAD-GCM | mijoz qabul qiladi: true
```

### Hujum

Yo'ldagi hujumchi ClientHello'dan `AEAD-GCM` ni olib tashlaydi. Server ko'rgan ro'yxatda faqat `XOR-LEGACY` qoladi.

```ts run
type Hello = { suites: string[] };
const serverPick = (h: Hello): string | null =>
  h.suites.includes("AEAD-GCM") ? "AEAD-GCM" : h.suites.includes("XOR-LEGACY") ? "XOR-LEGACY" : null;
const clientAccepts = (offer: Hello, chosen: string | null) => chosen !== null && offer.suites.includes(chosen);

const clientHello: Hello = { suites: ["AEAD-GCM", "XOR-LEGACY"] };
const tampered: Hello = { suites: clientHello.suites.filter((s) => s !== "AEAD-GCM") }; // hujumchi o'zgartirgan

const chosen = serverPick(tampered);
console.log("server ko'rgan ro'yxat:", tampered.suites.join(","));
console.log("tanlangan:", chosen, "| mijoz qabul qiladi:", clientAccepts(clientHello, chosen));
```

```text
server ko'rgan ro'yxat: XOR-LEGACY
tanlangan: XOR-LEGACY | mijoz qabul qiladi: true
```

Ikkala tomon ham o'zini muvaffaqiyatli deb hisobladi, lekin kanal zaif variantda. Aynan shu xavf tufayli A04 algoritmni pasaytirish yoki aylanib o'tish mumkinmi, deb so'raydi.

### Tuzatilgan kod

Tuzatish: ikki tomon haqiqiy (EC)DHE bilan umumiy sir hosil qiladi, kalitlar HKDF-Expand-Label orqali transkript hash'idan chiqariladi va server `Finished` (transkript MAC'i) yuboradi. Mijoz uni o'zi ko'rgan ClientHello bilan hisoblanganiga solishtiradi. Modelda HKDF-Extract `HMAC(salt, IKM)` va bir blokli HKDF-Expand `HMAC(PRK, info || 0x01)` sifatida yozilgan; `HkdfLabel` tuzilishi RFC 8446 7.1 dagi kabi (`"tls13 "` prefiksi).

```ts run
const enc = new TextEncoder();
const hex = (u: Uint8Array) => [...u].map((b) => b.toString(16).padStart(2, "0")).join("");
const cat = (...p: Uint8Array[]) => Uint8Array.from(p.flatMap((x) => [...x]));

const hmac = async (key: Uint8Array, data: Uint8Array) =>
  new Uint8Array(
    await crypto.subtle.sign("HMAC", await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]), data),
  );
const sha256 = async (s: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s)));

// HKDF-Expand-Label (bir blok, uzunlik <= 32): HkdfLabel = uint16 uzunlik, "tls13 " + label, kontekst.
async function expandLabel(secret: Uint8Array, label: string, context: Uint8Array, len = 32) {
  const l = enc.encode("tls13 " + label);
  const info = cat(Uint8Array.of(len >> 8, len & 255), Uint8Array.of(l.length), l, Uint8Array.of(context.length), context);
  return (await hmac(secret, cat(info, Uint8Array.of(1)))).slice(0, len);
}

const gen = () => crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"]);
const ecdh = async (priv: CryptoKey, pub: CryptoKey) =>
  new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: pub }, priv, 256));

type Hello = { suites: string[] };
const serverPick = (h: Hello) => (h.suites.includes("AEAD-GCM") ? "AEAD-GCM" : h.suites.includes("XOR-LEGACY") ? "XOR-LEGACY" : "yo'q");

// Server Finished'ini hisoblaydi (ClientHello'ni o'zi ko'rgandek); mijoz o'z ClientHello'si bilan qayta hisoblab solishtiradi.
async function handshake(clientHello: Hello, seenByServer: Hello): Promise<boolean> {
  const c = await gen();
  const s = await gen();
  const chosen = serverPick(seenByServer);
  const serverHello = `SH:${chosen}`;

  async function finished(shared: Uint8Array, hello: Hello): Promise<string> {
    const transcript = `CH:${hello.suites.join(",")}|${serverHello}`;
    const th = await sha256(transcript);
    const prk = await hmac(new Uint8Array(32), shared); // HKDF-Extract(salt = 0, IKM = DH sir)
    const hsTraffic = await expandLabel(prk, "s hs traffic", th);
    const finishedKey = await expandLabel(hsTraffic, "finished", new Uint8Array(0));
    return hex(await hmac(finishedKey, th));
  }

  const serverSide = await finished(await ecdh(s.privateKey, c.publicKey), seenByServer);
  const clientSide = await finished(await ecdh(c.privateKey, s.publicKey), clientHello);
  return serverSide === clientSide;
}

const clientHello: Hello = { suites: ["AEAD-GCM", "XOR-LEGACY"] };
console.log("halol handshake - Finished mos:", await handshake(clientHello, clientHello));
console.log("downgrade - Finished mos:", await handshake(clientHello, { suites: ["XOR-LEGACY"] }));
```

```text
halol handshake - Finished mos: true
downgrade - Finished mos: false
```

Nima uchun yetarli: Finished va undan oldingi kalitlar transkript hash'iga bog'liq, shuning uchun hujumchi ClientHello'ni o'zgartirsa, server va mijoz turli kalit va turli Finished hisoblaydi va handshake to'xtaydi. Hujumchi buni to'g'rilay olmaydi, chunki to'g'ri Finished'ni yasash uchun handshake kalitini bilish kerak, u esa (EC)DHE sirdan chiqadi.

Nimani yopmaydi. Birinchidan, bu model o'quv versiyasi: real TLS'da bu mexanizm CertificateVerify bilan birga ishlaydi va serverning haqiqiy kimligini sertifikat orqali tasdiqlaydi. Agar hujumchi o'zi ikkala tomon bilan alohida (EC)DHE qilsa (64-dars), faqat autentifikatsiya (sertifikat va imzo) uni to'xtatadi. Ikkinchidan, modelda Finished mos kelishi oddiy satr taqqoslash bilan tekshirilgan, real kutubxona constant-time taqqoslaydi (62-dars). Uchinchidan, hybrid post-quantum kalit almashish yoqilganda ham sertifikat imzolari klassik qoladi: OWASP PQC cheat sheet hybrid TLS kalit almashish sertifikat imzolarini kvantga bardosh qilmasligini ochiq yozadi.

## Qachon qo'llamaslik kerak

TLS 1.3 hamma muhitga bir tekis mos kelmaydi. Eski mijozlar (embedded qurilmalar, eski Android versiyalari, ayrim korporativ proksilar) faqat TLS 1.2 ni bilishi mumkin. Telematika qurilmalari ko'pincha shunday bo'ladi (bu muallifning amaliy kuzatuvi, manbada tekshirilmagan; ro'yxatni o'z inventaringizdan oling): ularni bir kunda yangilab bo'lmaydi. Bunday holda TLS 1.2 ni forward secrecy cipher'lar (ECDHE + AEAD) bilan qoldirish va eskirgan suite'larni o'chirish A04 talabiga mos, lekin buni inventarda yozib qo'ying va yangilash muddatini belgilang. TLS 1.3 majburiy deb butun parkni uzib qo'yish ham xavfsizlik emas, mavjudlik buzilishi (1-dars).

0-RTT ni asosan statik, takrorlanishi zararsiz GET so'rovlari uchun yoqing yoki umuman yoqmang. Ichki tarmoqda "TLS shart emas" deb hisoblash ham xato: A04 tranzitda hamma ma'lumot shifrlanishi kerakligini yozadi, hujumchi ichki tarmoqqa tushsa, ochiq HTTP uni ochib beradi. Kompensatsiya qilishning o'rniga mTLS (66-dars) ichki servislarda keng qo'llaniladi.

## Stack'da: Node.js, Next.js, Postgres, Redis

Ko'p production tizimda TLS ilovada emas, reverse proxy, load balancer yoki ingress'da tugaydi. Node.js jarayoni oddiy HTTP eshitsa, proxy bilan servis orasidagi bo'lak ham himoyalanishi kerak (cluster ichida mTLS yoki service mesh). Minimal versiya, suite ro'yxati va HSTS sozlamalarini bitta joyda (proxy konfiguratsiyasida) yuriting va yuqoridagi linter kabi inventar skripti bilan tekshiring.

Ilova Node.js'da TLS ustida ishlasa, klient sifatida sertifikat tekshiruvini hech qachon o'chirmang (`rejectUnauthorized: false` kod ichida paydo bo'lsa, review'da to'xtating). PostgreSQL va Redis ulanishlarida ham shifrlash va server kimligini tekshirish alohida sozlamalar.

PostgreSQL klienti (libpq) uchun `sslmode` oltita qiymat oladi: `disable`, `allow`, `prefer`, `require`, `verify-ca`, `verify-full`. Standart qiymat `prefer`: avval SSL, bo'lmasa shifrsiz ulanish; hujjatning o'zi uni xavfsizlik nuqtai nazaridan mantiqsiz va faqat orqaga moslik uchun qoldirilgan, xavfsiz muhitda tavsiya etilmaydi deb yozadi. `require` ulanishni shifrlaydi, lekin hujjat jadvali bo'yicha o'rtadagi hujumchidan (MITM) himoya bermaydi: u tarmoq sizni to'g'ri serverga ulaydi deb ishonadi (ildiz CA fayli mavjud bo'lsa, sertifikat `verify-ca` kabi tekshiriladi). `verify-ca` server sertifikati ishonchli CA tomonidan berilganini tekshiradi, `verify-full` esa bundan tashqari so'ralgan server nomi sertifikatdagi nomga mos kelishini ham tekshiradi va hujjat uni xavfsizlikka sezgir muhitlarning ko'pida tavsiya qiladi. Ommaviy CA ishlatilsa, `verify-ca` boshqa kimdir shu CA'da ro'yxatdan o'tkazgan serverga ulanishga yo'l beradi, shuning uchun u holatda doim `verify-full` kerak. `sslmode` Unix domain socket ulanishida e'tiborga olinmaydi. Yo'riqnoma: productionda `sslmode=verify-full` va ildiz sertifikat fayli (`sslrootcert`) berilsin.

Redis TLS ni 6-versiyadan boshlab qo'llaydi va u kompilyatsiya paytida yoqilgan bo'lishi kerak (`BUILD_TLS=yes`). `tls-port` shifrlangan portni ochadi va bu oddiy `port` ga qo'shimcha: shifrsiz portni butunlay o'chirish uchun `port 0` yoziladi. Server sertifikati, kalit va ishonchli CA uchun `tls-cert-file`, `tls-key-file`, `tls-ca-cert-file` ishlatiladi. Standart holatda Redis mutual TLS qo'llaydi va mijozdan ishonchli sertifikat talab qiladi (`tls-auth-clients no` buni o'chiradi). Replika ulanishi uchun `tls-replication yes`, klaster shinasi uchun `tls-cluster yes` kerak, aks holda ichki linklar shifrsiz qoladi. Redis va PostgreSQL hardening 89-darsda. Next.js uchun Vercel kabi platformalar TLS'ni o'zi boshqaradi; sizning mas'uliyatingiz HSTS va xavfsiz cookie sozlamalari (13 va 16-darslar).

## Xulosa

- TLS 1.3 handshake: ClientHello (key_share bilan), ServerHello, shundan keyin hamma narsa shifrlangan: EncryptedExtensions, Certificate, CertificateVerify, Finished. To'liq handshake 1-RTT.
- TLS 1.2 dan farqi: faqat AEAD, statik RSA/DH yo'q (har kalit almashish forward secrecy beradi), siqish va DSA yo'q, HKDF asosidagi kalit jadvali.
- Kalitlar va Finished handshake transkriptiga bog'liq; shu tufayli ClientHello'ni o'zgartirib downgrade qilish aniqlanadi. Autentifikatsiya (CertificateVerify va sertifikat tekshiruvi) esa MITM'ni to'xtatadi.
- 0-RTT forward secret emas va replay'ga qarshi kafolat bermaydi: holatni o'zgartiruvchi so'rovlar uchun yoqmang yoki idempotent qiling.
- A04 minimumi: TLS 1.2+, faqat forward secrecy cipher'lar, CBC yo'q, HSTS; sertifikat tekshiruvini hech qachon o'chirmang.
- Hybrid post-quantum kalit almashish (X25519MLKEM768) maxfiylikni kuchaytiradi, lekin sertifikat imzolari uchun alohida migratsiya kerak (70-dars).
