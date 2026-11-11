---
n: 70
slug: shifrlab-saqlash-pqc
title: "Ma'lumotni shifrlab saqlash va post-quantum kriptografiyaga o'tish"
summary: "Saqlanayotgan ma'lumotni qaysi qatlamda shifrlash, versiyalangan shifrmatn formati va crypto agility, kriptografik inventar, post-quantum xavfi (ML-KEM, ML-DSA, hybrid), harvest-now-decrypt-later ustuvorligi va bosqichma-bosqich migratsiya."
duration: 55
sources:
  - id: fips203
    note: "FIPS 203: ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism), 2024-yil 13-avgust, Final; parametr to'plamlari ML-KEM-512, ML-KEM-768, ML-KEM-1024; kalit kelishuvi uchun post-quantum standart (csrc.nist.gov sahifasi o'qilgan)"
  - id: fips204
    note: "FIPS 204: ML-DSA (Module-Lattice-Based Digital Signature Algorithm), 2024-yil 13-avgust, Final; post-quantum imzo standarti (csrc.nist.gov sahifasi o'qilgan; parametr to'plami nomlari bu sahifada yo'q, ml-dsa-44/65/87 nomlari Node.js hujjatidan)"
  - id: rfc9794
    note: "RFC 9794 (2025-yil iyun, Informational): 2 (PQ/T hybrid KEM va PQ/T hybrid digital signature ta'riflari), 5 (hybrid maxfiylik hybrid autentifikatsiyani hal qilmaydi)"
  - id: t10-a04
    note: "A04:2025: transportda forward secrecy va quantum-safe kalit almashinuvini qo'llab-quvvatlash, PQC'ga hozirdan tayyorlanish (yuqori xavfli tizimlar 2030 oxiridan kech bo'lmay xavfsiz), A04 tekshiriladigan savollar"
  - id: node-crypto
    note: "Node.js crypto: ML-KEM va ML-DSA kalitlari qo'llab-quvvatlanadi (ml-kem-768, ml-dsa-65 va boshqalar), lekin bu algoritmlar OpenSSL 3.5 yoki undan yangisini talab qiladi va Node versiyasiga bog'liq"
  - id: node-tls
    note: "Node.js tls.createSecureContext: ecdhCurve opsiyasi nomlangan egri chiziq yoki TLS guruhlari ro'yxatini oladi (masalan P-521:P-384:P-256, X25519 yoki X25519MLKEM768); TLS 1.3 da bu supported groups va key share guruhlarini sozlaydi"
  - id: asvs
    note: "ASVS 5.0.0 11.1.2-11.1.4 (inventar, discovery, PQC migratsiya rejasi), 11.2.2 (crypto agility), 11.3.x (AEAD va nonce), Appendix C (Post-Quantum Encryption Standards)"
  - id: cs-crypto-storage
    note: "Cryptographic Storage cheat sheet: Where to Perform Encryption, Minimize the Storage of Sensitive Information, Algorithms, Post-Quantum Consideration, Separation of Keys and Data"
  - id: cs-pqc
    note: "Post-Quantum Cryptography cheat sheet: 5 bosqich (inventar, ustuvorlik, qo'llab-quvvatlanadigan implementatsiya, test, rollout), hybrid va dual-signature qoidalari, AES-256 afzalligi"
quiz:
  - q: "Ma'lumotlar bazasi disklari apparat darajasida shifrlangan. Hujumchi ilova serveriga masofadan kirib, ilovaning o'z hisobi bilan SQL so'rovlar yubordi. Disk shifrlashi nimaga yordam beradi?"
    options:
      - "Hamma narsani himoya qiladi, chunki ma'lumot shifrlangan"
      - "Faqat parollarni himoya qiladi"
      - "Deyarli yordam bermaydi: ilova disk kalitini allaqachon ochgan, shuning uchun ma'lumot ochiq holda qaytadi"
      - "SQL injection'ni to'xtatadi"
    answer: 2
    explain: "Cryptographic Storage cheat sheet: hardware darajasidagi shifrlash serverning jismoniy o'g'irlanishidan himoya qiladi, lekin hujumchi serverni masofadan buzsa hech narsa bermaydi. Qatlam tahdid modeliga qarab tanlanadi."
  - q: "Nega saqlanayotgan shifrmatnga format versiyasi, algoritm identifikatori va kalit ID'si qo'shiladi?"
    options:
      - "Algoritm va kalitni keyinroq xavfsiz almashtirish mumkin bo'lishi uchun (crypto agility), eski yozuvlar o'qiladi va yangisiga o'tkaziladi"
      - "Hujumchi algoritmni bilsin deb"
      - "Shifrmatnni qisqartirish uchun"
      - "Nonce'ni almashtirish uchun"
    answer: 0
    explain: "ASVS 11.2.2 algoritm, kalit uzunligi va rejimlarni istalgan vaqtda almashtirish imkonini talab qiladi. Versiyasiz format bo'lsa, qaysi yozuv qaysi algoritm bilan shifrlangani noma'lum bo'ladi. Header AAD'ga kiritilishi kerak, aks holda downgrade mumkin."
  - q: "Ilova trafikni hybrid X25519MLKEM768 bilan almashtirdi, lekin server sertifikati hamon ECDSA imzosiga ega. Qaysi gap manbaga mos?"
    options:
      - "Endi butun TLS post-quantum xavfsiz"
      - "Sertifikat imzolari endi kerak emas"
      - "Hybrid ECDSA'ni ML-DSA'ga aylantiradi"
      - "Hybrid kalit almashinuvi sertifikat imzolarini quantum-chidamli qilmaydi: autentifikatsiya alohida migratsiya qilinadi"
    answer: 3
    explain: "PQC cheat sheet (RFC 9794 5-bo'limiga tayanib): hybrid TLS key exchange maxfiylikni beradi, lekin klassik sertifikat imzolarini quantum-chidamli qilmaydi. Imzolar alohida migratsiya."
  - q: "Qaysi ma'lumot PQC migratsiyasida birinchi navbatda ustuvor (cheat sheet 2-bosqich)?"
    options:
      - "Bir daqiqada yaroqsiz bo'ladigan sessiya cache'i"
      - "Bir necha yil maxfiy qolishi kerak bo'lgan va RSA/ECC'ga bog'liq kalitlar bilan himoyalangan, tarmoqdan ushlab olinishi mumkin bo'lgan ma'lumot"
      - "Ochiq hujjatlar"
      - "Test muhiti loglari"
    answer: 1
    explain: "Cheat sheet: uzoq muddat maxfiy qolishi kerak bo'lgan ma'lumotni birinchi ustuvor qiling, chunki keyinroq shifrlashni yangilash hujumchi allaqachon to'plagan nusxalarni himoya qila olmaydi."
  - q: "ML-KEM (FIPS 203) haqida qaysi gap to'g'ri?"
    options:
      - "U ma'lumotni bevosita shifrlaydi va AES'ni almashtiradi"
      - "U peer'ni autentifikatsiya qiladi"
      - "U simmetrik shifrlash uchun umumiy maxfiy qiymat o'rnatadi; saqlanayotgan ma'lumotni shifrlash uchun baribir AES kabi simmetrik shifr kerak"
      - "U faqat imzo uchun"
    answer: 2
    explain: "Cryptographic Storage cheat sheet: ML-KEM simmetrik shifrlash uchun umumiy maxfiy qiymat o'rnatadi, saqlanayotgan ma'lumotni shifrlashda AES o'rnini bosmaydi. Imzo uchun ML-DSA (FIPS 204)."
  - q: "Dual-signature (klassik va post-quantum imzo birga) sxemasida tekshiruv qanday bo'lishi kerak?"
    options:
      - "Ikkala imzo ham muvaffaqiyatli tekshirilishi shart; birini qabul qilish klassik-only qabulga yo'l ochadi"
      - "Istalgan bitta imzo yetarli"
      - "Faqat klassik imzo tekshiriladi"
      - "Faqat post-quantum imzo tekshiriladi, klassik e'tiborsiz"
    answer: 0
    explain: "Cheat sheet: ikkala imzo talab qilinadigan sxemada ikkalasini ham tekshiring; birini qabul qilish klassik-only qabulga yo'l ochadi. Mavjud formatga o'zingizcha qo'shimcha imzo maydoni qo'shmang."
task:
  title: "PQC migratsiya ustuvorligi: inventardan reja"
  prompt: |
    Kriptografik inventar (61-dars) yozuvlari berilgan. `prioritize` funksiyasi quantum-zaif yozuvlarni uch ustuvorlik darajasiga ajratishi kerak. Hozir u hamma zaif yozuvni `tier3` ga tashlaydi.

    Zaif algoritmlar ro'yxati `VULNERABLE` da tayyor. Zaif bo'lmagan yozuvlar rejaga kirmaydi. Zaif yozuv uchun (birinchi mos kelgani olinadi):
    1. `purpose` `transport` yoki `stored` va `years` >= 5: `tier1` (uzoq muddat maxfiylik).
    2. `purpose` `signature` va (`years` >= 5 yoki `updatable` false): `tier2` (uzoq muddat ishonch).
    3. Aks holda `tier3`.

    Har daraja ichida kirish tartibi saqlanadi. Yozuvlarni va `console.log`ni o'zgartirmang. Kutilgan chiqish: `tier1: vpn-gw,telemetry-archive`, `tier2: fw-signing`, `tier3: login-tls,invite-token`.
  lang: ts
  starter: |
    type Entry = {
      id: string;
      algo: string;
      purpose: "transport" | "stored" | "signature";
      years: number;
      updatable: boolean;
    };
    type Plan = { tier1: string[]; tier2: string[]; tier3: string[] };

    const VULNERABLE = new Set(["RSA-2048", "ECDH-P256", "X25519", "ECDSA-P256", "Ed25519"]);

    function prioritize(entries: Entry[]): Plan {
      const plan: Plan = { tier1: [], tier2: [], tier3: [] };
      for (const e of entries) {
        if (VULNERABLE.has(e.algo)) plan.tier3.push(e.id);
      }
      return plan;
    }

    const inventory: Entry[] = [
      { id: "vpn-gw", algo: "X25519", purpose: "transport", years: 10, updatable: true },
      { id: "telemetry-archive", algo: "RSA-2048", purpose: "stored", years: 15, updatable: true },
      { id: "fw-signing", algo: "ECDSA-P256", purpose: "signature", years: 12, updatable: false },
      { id: "api-tls", algo: "X25519MLKEM768", purpose: "transport", years: 1, updatable: true },
      { id: "session-cache", algo: "AES-256-GCM", purpose: "stored", years: 1, updatable: true },
      { id: "login-tls", algo: "ECDH-P256", purpose: "transport", years: 1, updatable: true },
      { id: "invite-token", algo: "Ed25519", purpose: "signature", years: 1, updatable: true },
    ];

    const plan = prioritize(inventory);
    console.log("tier1:", plan.tier1.join(","));
    console.log("tier2:", plan.tier2.join(","));
    console.log("tier3:", plan.tier3.join(","));
  solution: |
    type Entry = {
      id: string;
      algo: string;
      purpose: "transport" | "stored" | "signature";
      years: number;
      updatable: boolean;
    };
    type Plan = { tier1: string[]; tier2: string[]; tier3: string[] };

    const VULNERABLE = new Set(["RSA-2048", "ECDH-P256", "X25519", "ECDSA-P256", "Ed25519"]);

    function prioritize(entries: Entry[]): Plan {
      const plan: Plan = { tier1: [], tier2: [], tier3: [] };
      for (const e of entries) {
        if (!VULNERABLE.has(e.algo)) continue;
        if ((e.purpose === "transport" || e.purpose === "stored") && e.years >= 5) plan.tier1.push(e.id);
        else if (e.purpose === "signature" && (e.years >= 5 || !e.updatable)) plan.tier2.push(e.id);
        else plan.tier3.push(e.id);
      }
      return plan;
    }

    const inventory: Entry[] = [
      { id: "vpn-gw", algo: "X25519", purpose: "transport", years: 10, updatable: true },
      { id: "telemetry-archive", algo: "RSA-2048", purpose: "stored", years: 15, updatable: true },
      { id: "fw-signing", algo: "ECDSA-P256", purpose: "signature", years: 12, updatable: false },
      { id: "api-tls", algo: "X25519MLKEM768", purpose: "transport", years: 1, updatable: true },
      { id: "session-cache", algo: "AES-256-GCM", purpose: "stored", years: 1, updatable: true },
      { id: "login-tls", algo: "ECDH-P256", purpose: "transport", years: 1, updatable: true },
      { id: "invite-token", algo: "Ed25519", purpose: "signature", years: 1, updatable: true },
    ];

    const plan = prioritize(inventory);
    console.log("tier1:", plan.tier1.join(","));
    console.log("tier2:", plan.tier2.join(","));
    console.log("tier3:", plan.tier3.join(","));
  solutionNotes: |
    - Ustuvorlik muddatga va yangilash imkoniyatiga bog'liq: uzoq muddat maxfiy ma'lumot birinchi (hujumchi hozir to'plab, keyinroq ochishi mumkin), yangilab bo'lmaydigan imzo tekshiruvchilari ikkinchi (yangilash uzoq vaqt oladi).
    - `api-tls` (hybrid) va `session-cache` (AES) rejaga kirmaydi; lekin hybrid sertifikat autentifikatsiyasini avtomatik hal qilmaydi, uni alohida yozuv sifatida kuzatish kerak (cheat sheet).
    - `VULNERABLE` ro'yxati va 5 yillik chegara o'quv qiymatlar. Real chegaralarni tahdid modeli va migratsiya muddatlari belgilaydi (A04: yuqori xavfli tizimlar uchun 2030 oxirigacha deb ENISA yo'l xaritasiga havola qilinadi).
    - Reja faqat tartib beradi; amalda har bir yozuv uchun egasi, sana va qo'llab-quvvatlanadigan implementatsiya kerak (cheat sheet 1-3 bosqichlar).
  checklist:
    - "Zaif bo'lmagan algoritmlar rejaga kirmaydi"
    - "Qoidalar berilgan tartibda qo'llanadi (birinchi mos kelgani)"
    - "`updatable: false` imzo yozuvi tier2 ga tushadi"
    - "Har daraja ichida kirish tartibi saqlanadi"
    - "Hybrid TLS sertifikat imzolarini o'zi hal qilmasligini tushuntira olasiz"
---

## Muammo

Shifrlash saqlash qatlamida ham, tarmoqda ham ko'pincha "yoqib qo'yilgan" holda qoldiriladi va unutiladi. Disk shifrlangan, baza shifrlangan, TLS yoqilgan, hammasi tayyor deb hisoblanadi. Muammo uch joyda chiqadi. Birinchisi, shifrlash noto'g'ri qatlamda: ilova buzilganda disk shifrlashi hech narsa bermaydi. Ikkinchisi, shifrmatn formati qotib qolgan: algoritm kodga qattiq yozilgan, yozuvda versiya yo'q, shuning uchun zaif algoritmdan o'tish ma'lumotni "ko'r-ko'rona" qayta shifrlashni talab qiladi. Uchinchisi, uzoq muddat saqlanadigan ma'lumot bugungi public-key kriptografiyaga tayanadi, u esa kelajakdagi quantum kompyuterga qarshi ishonchli emas.

Cryptographic Storage cheat sheet bu haqda ochiq aytadi: RSA va ECC asosidagi public-key kriptografiya (Curve25519 ham) post-quantum xavfsiz emas. Kelajakdagi kriptografik jihatdan ahamiyatli quantum kompyuter ularni buzishi mumkin, bu uzoq muddat maxfiy qolishi kerak bo'lgan ma'lumot uchun muhim. OWASP A04 ham shuni takrorlaydi: PQC'ga hozirdan tayyorlaning, shunda yuqori xavfli tizimlar ENISA yo'l xaritasiga havola qilingan holda 2030 oxiridan kech bo'lmay xavfsiz bo'ladi. ASVS 5.0.0 esa 11.1.4 (Level 3) bandida inventar va yangi standartlarga, shu jumladan post-quantum'ga o'tish rejasini talab qiladi.

Bu dars 61-69 darslaridagi bilimlarni bitta oqimga bog'laydi: nimani qayerda shifrlash, formatni qanday o'zgartirishga tayyor qilish va post-quantum migratsiyasini qanday boshlash. Yangi algoritmlarning matematikasi dars doirasida emas: maqsad ularni xavfsiz qabul qilish uchun injenerlik tayyorgarligi.

## Asosiy g'oya

### Qaysi qatlamda shifrlash

Cheat sheet shifrlash bir necha qatlamda bo'lishi mumkinligini sanaydi: ilova darajasi, ma'lumotlar bazasi darajasi (masalan TDE), fayl tizimi (BitLocker, LUKS) va apparat darajasi (shifrlangan RAID kartalar, SSD). Qaysi qatlam mosligi tahdid modeliga bog'liq. Manbadagi misol: apparat darajasidagi shifrlash serverning jismoniy o'g'irlanishidan himoya qiladi, lekin hujumchi serverni masofadan buzsa hech qanday himoya bermaydi. Xuddi shu mantiq disk va baza darajasiga qo'llanadi: ilova ma'lumotni ochiq holda ko'rishi uchun kalitga ega, shuning uchun ilova (yoki uning hisobi) buzilsa, disk shifrlashi ahamiyatsiz.

Amaliy xulosa: kimdan himoyalanayotganingizni aniq yozing. Disk yoki zaxira nusxasi o'g'irlanishi, bazaga o'qish huquqi sizib chiqishi, ilova jarayonining buzilishi, ichki xodim, har biri boshqa qatlamni talab qiladi. Maydon darajasidagi (ilova) shifrlash baza administratori va zaxira nusxasidan himoya qiladi, lekin ilova kodini buzgan hujumchidan emas. Cheat sheet birinchi qoidani ham eslatadi: eng yaxshi himoya ma'lumotni umuman saqlamaslik. Sezgir ma'lumot minimal miqdorda va minimal muddatga saqlanadi.

### Format va crypto agility

ASVS 11.2.2 ilova algoritm, kalit uzunligi va rejimlarni istalgan vaqtda qayta sozlash, yangilash yoki almashtirish mumkin bo'ladigan qilib loyihalanishini talab qiladi (crypto agility). Saqlashda bu degani: har yozuv o'zi haqida aytishi kerak. Minimal to'plam: format versiyasi, algoritm identifikatori, kalit ID'si (68-dars), nonce va shifrmatn. Header AEAD'ning qo'shimcha autentifikatsiyalanadigan ma'lumotiga (AAD) kiritiladi (63-dars), shunda hujumchi algoritm yoki kalit ID'sini o'zgartira olmaydi. ASVS 11.3.2 AES-GCM kabi tasdiqlangan rejimlarni, 11.3.3 esa ruxsatsiz o'zgartirishdan himoyani (AEAD) talab qiladi.

Versiyasiz formatda migratsiya og'riqli: qaysi yozuv eski, qaysi yangi ekani noma'lum, qayta shifrlash bir martalik katta operatsiyaga aylanadi va yarim yo'lda to'xtasa tizim ikki holatda qoladi. Versiyali formatda esa o'qishda yozuv versiyasi ko'riladi, eski bo'lsa o'qiladi va yangi formatda qayta yoziladi (lazy migration), fon jobi qolganlarini tugatadi.

### Inventar

Migratsiyani rejalashdan oldin nima borligini bilish kerak. ASVS 11.1.2 barcha kalit, algoritm va sertifikatlarning inventarini va ularni qayerda ishlatish mumkinligini talab qiladi (61-dars), 11.1.3 (Level 3) kriptografik discovery mexanizmlarini: tizimdagi barcha shifrlash, hash va imzo operatsiyalarini topish uchun. PQC cheat sheet inventarni birinchi bosqich qiladi: har bir kriptografiya ishlatilishi uchun bitta yozuv, maqsad va muddat (transport, saqlangan ma'lumot, kalit himoyasi, imzo; maxfiylik yoki ishonch qancha davom etishi kerak), implementatsiya (protokol, algoritm, kutubxona versiyasi, kalit va sertifikat ID'lari; maxfiy kalit materiali emas), bog'liqliklar (klientlar, proxy, KMS, HSM, zaxira nusxalar) va egasi. Platforma yoki provayder boshqaradigan bog'liqliklar ham kiradi, va har bir transport ulanishi alohida (gateway'dan ilovaga ulanish ham) xaritalanadi. Imzo yaratuvchilar bilan birga tekshiruvchilar ham inventarga kiradi.

## Chuqurroq: post-quantum xavfi va migratsiya

### Nimani buzadi va nimani buzmaydi

PQC cheat sheet xavfni aniq chegaralaydi. Yetarlicha kuchli quantum kompyuter RSA, Diffie-Hellman va elliptik egri chiziq kriptografiyasini buzishi mumkin, ya'ni public-key shifrlash, kalit almashinuvi va raqamli imzolarni. Simmetrik tomon boshqacha: cheat sheet qo'shimcha quantum zaxirasi uchun AES-256 afzal ko'rilishini aytadi, shu bilan birga NIST'ning PQC FAQ'si AES-128, AES-192 va AES-256'ning davom etishiga ruxsat berishiga havola qiladi. Shuningdek, ma'lumotning o'zi AES bilan shifrlangan bo'lsa ham, shifrlash kalitlarining public-key himoyasini tekshirish kerak: agar DEK RSA bilan o'ralgan bo'lsa (68-dars), zaif halqa o'sha.

"Hozir to'plab, keyin ochish" (harvest now, decrypt later) logikasi ustuvorlikni belgilaydi. Cheat sheet 2-bosqichi: uzoq muddat maxfiy qolishi kerak bo'lgan va kalitlari RSA yoki elliptik egri chiziqqa bog'liq ulanishlar va saqlangan ma'lumotni birinchi ustuvor qiling, chunki keyinroq shifrlashni yangilash hujumchi allaqachon to'plagan nusxalarni himoya qila olmaydi. Uzoq muddat ishonch (dasturiy ta'minot va firmware tekshiruvi, trust anchor'lar, yillar davomida ishonchli qolishi kerak bo'lgan imzolangan yozuvlar) ham erta rejalanadi, chunki barcha tekshiruvchilarni yangilash vaqt oladi (64 va 66-darslar). Yangilab bo'lmaydigan bog'liqliklar uchun yetkazib beruvchidan qo'llab-quvvatlanadigan versiya va migratsiya rejasi so'raladi, qolgan xavf va ko'rib chiqish sanasi yoziladi.

### Standartlar va hybrid

FIPS 203 (ML-KEM) va FIPS 204 (ML-DSA) NIST tomonidan 2024-yil 13-avgustda yakuniy (Final) standart sifatida e'lon qilingan. FIPS 203 uch parametr to'plamini beradi: ML-KEM-512, ML-KEM-768 va ML-KEM-1024 (xavfsizlik darajasi o'sgani sari tezlik pasayadi); Node.js hujjati ML-DSA uchun `ml-dsa-44`, `ml-dsa-65` va `ml-dsa-87` nomlarini keltiradi. NIST sahifalari ikkala standart uchun ham kelajakdagi yangilanishda tuzatiladigan errata borligini qayd etadi, shuning uchun amalga oshirishda NIST'ning joriy errata ro'yxatiga qarab turing. Kalit o'rnatish uchun cheat sheet ML-KEM (NIST FIPS 203) ni ko'rsatadi: u simmetrik shifrlash uchun umumiy maxfiy qiymat o'rnatadi; ma'lumotni bevosita shifrlamaydi va peer'ni autentifikatsiya qilmaydi. Shu sababli saqlanayotgan ma'lumot uchun AES o'z o'rnida qoladi. Imzolar uchun ML-DSA (FIPS 204) ko'rsatiladi, lekin imzolar migratsiyasi alohida: imzo formati va tekshiruvchisini qo'llab-quvvatlash va imzolovchi bilan tekshiruvchilarni muvofiqlashtirib yangilash kerak. ASVS Appendix C ham PQC implementatsiyalari FIPS 203, 204 va 205 ga mos bo'lishi kerakligini aytadi va hozircha mustahkamlangan kod va referens implementatsiyalar kam ekanini qayd etadi.

Transport uchun cheat sheet klassik va PQC birga ishlaydigan hybrid almashinuvni (masalan X25519MLKEM768) sinab ko'rishni tavsiya etadi, sertifikat va hostname tekshiruvini yoqilgan holda saqlab. Hybrid konstruksiyani o'zingiz yig'masligingiz kerak: protokol implementatsiyasidan foydalaning. Muhim farq: hybrid TLS key exchange maxfiylikni beradi, lekin klassik sertifikat imzolarini quantum-chidamli qilmaydi (cheat sheet RFC 9794'ga tayanadi). RFC 9794 (2025-yil iyun, Informational) terminologiya hujjati: 2-bo'limda PQ/T hybrid KEM va PQ/T hybrid digital signature ni kamida bitta post-quantum va kamida bitta traditional komponentdan iborat sxema deb ta'riflaydi, 5-bo'limda esa [HYBRID-TLS] hybrid maxfiylikni beradi, lekin hybrid autentifikatsiyani hal qilmaydi, deb yozadi. Sertifikat asosidagi autentifikatsiya uchun leaf va intermediate sertifikatlardagi algoritmlar, sozlangan trust anchor'ning public-key algoritmi va runtime'ning sertifikat tekshiruvi qo'llab-quvvatlashi tekshiriladi (65 va 66-darslar). Dual-signature sxemasida ikkala imzo ham tekshirilishi shart; birini qabul qilish klassik-only qabulga yo'l ochadi, va mavjud token yoki sertifikat formatiga o'zingizcha imzo maydoni qo'shmang.

### Test, fallback va rollout

Cheat sheet 4-bosqichi: haqiqiy algoritm va parametrlar bilan to'liq yo'lni sinash. Real klient, proxy, gateway va backend ulanishlari tekshiriladi; kattaroq kriptografik ob'ektlar uchun sertifikat, imzo, xabar va baza maydoni limitlari tekshiriladi va handshake/verifikatsiya narxi o'lchanadi. Noto'g'ri imzo, ishonchsiz sertifikat va ruxsat etilmagan algoritmlar rad etilishi sinaladi. PQC talab qilinadigan yo'llarda xato jimgina klassik-only qayta urinishga olib kelmasligi tekshiriladi. Rollout kichik guruhdan boshlanadi, rollback rejasi bor; klassik-only'ga qaytish xavfsizlik istisnosi sifatida egasi va muddati bilan belgilanadi. Eski ma'lumot, eski imzolangan artefakt, zaxira nusxadan tiklash va kalit tiklash eski kalit yoki format o'chirilishidan oldin sinaladi.

## Misol: versiyasiz CBC format

### Zaif kod

Eski xizmat telefon va rol maydonlarini AES-CBC bilan shifrlaydi. Format: IV va shifrmatn, versiya yo'q, autentifikatsiya yo'q. Algoritm kodga qattiq yozilgan.

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();

// ZAIF: versiyasiz, autentifikatsiyasiz format. Algoritm kodga qattiq yozilgan.
const legacyKey = await crypto.subtle.generateKey({ name: "AES-CBC", length: 256 }, true, ["encrypt", "decrypt"]);

async function legacySeal(plain: string): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv }, legacyKey, enc.encode(plain)));
  return new Uint8Array([...iv, ...ct]);
}
async function legacyOpen(blob: Uint8Array): Promise<string> {
  const pt = await crypto.subtle.decrypt({ name: "AES-CBC", iv: blob.slice(0, 16) }, legacyKey, blob.slice(16));
  return dec.decode(pt);
}

const blob = await legacySeal("rol=guest;t=alfa");
console.log("saqlangan bayt uzunligi:", blob.length);
console.log("ochildi:", await legacyOpen(blob));
```

```text
saqlangan bayt uzunligi: 48
ochildi: rol=guest;t=alfa
```

Nima noto'g'ri: shifrlash maxfiylik beradi, lekin yaxlitlik yo'q (63-dars). Formatda versiya ham yo'q, shuning uchun algoritmni almashtirish yozuvlarni ajratib bo'lmaydigan migratsiyaga aylanadi.

### Hujum

> **Ta'lim maqsadida.** Bu CBC'da IV orqali bitlarni o'zgartirish usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-4-moddasi (Kompyuter axborotini modifikatsiyalashtirish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi bazaga yozish huquqiga ega (masalan SQL orqali) va kalitni bilmaydi. CBC'da birinchi blok oldingi blok o'rnida IV bilan XOR qilinadi, shuning uchun IV'ni o'zgartirish birinchi blok ochiq matnining mos bitlarini o'zgartiradi. Bu o'quv xizmati uchun namuna.

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();
const key = await crypto.subtle.generateKey({ name: "AES-CBC", length: 256 }, true, ["encrypt", "decrypt"]);

// Xizmat yozuvni shu usulda saqlaydi (zaif koddagi format).
const known = "rol=guest;t=alfa"; // 16 bayt: aynan bitta blok
const iv = crypto.getRandomValues(new Uint8Array(16));
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv }, key, enc.encode(known)));
const stored = new Uint8Array([...iv, ...ct]);

// Hujumchi: kalit yo'q, faqat ochiq matn tuzilishini biladi deb faraz qilinadi. IV'ni o'zgartiradi.
const wanted = "rol=admin;t=alfa";
const forged = stored.slice();
const a = enc.encode(known);
const b = enc.encode(wanted);
for (let i = 0; i < 16; i++) forged[i] ^= a[i] ^ b[i];

// Xizmat ochadi: xato yo'q, qiymat esa hujumchi tanlagani.
const pt = await crypto.subtle.decrypt({ name: "AES-CBC", iv: forged.slice(0, 16) }, key, forged.slice(16));
console.log("asl:", known);
console.log("xizmat o'qigan:", dec.decode(pt));
```

```text
asl: rol=guest;t=alfa
xizmat o'qigan: rol=admin;t=alfa
```

Xizmat o'zgartirishni sezmadi, chunki CBC'da tekshiruv yo'q. Bu AEAD talabining (ASVS 11.3.3) sababi.

### Tuzatilgan kod

Tuzatish: versiyali envelope formati (`v`, `alg`, `kid`), AES-GCM, header va yozuv ID'si AAD'da. Eski yozuvlar o'qishda yangi formatga ko'chiriladi (lazy migration). Migratsiya tugagach eski format o'chiriladi (`legacyAllowed = false`), shunda hujumchi yangi yozuvni eski ko'rinishli yozuv bilan almashtira olmaydi (downgrade).

```ts run
const enc = new TextEncoder();
const dec = new TextDecoder();

type Rec = { v: number; alg: string; kid: string; iv: Uint8Array; ct: Uint8Array };
const cbcKey = await crypto.subtle.generateKey({ name: "AES-CBC", length: 256 }, false, ["encrypt", "decrypt"]);
const gcmKeys = new Map<string, CryptoKey>([["k2", await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])]]);
const CURRENT = { alg: "A256GCM", kid: "k2" };
let legacyAllowed = true;

const aad = (id: string, r: { v: number; alg: string; kid: string }) => enc.encode(`${id}|${r.v}|${r.alg}|${r.kid}`);

async function seal(id: string, plain: string): Promise<Rec> {
  const head = { v: 2, alg: CURRENT.alg, kid: CURRENT.kid };
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(id, head) }, gcmKeys.get(head.kid)!, enc.encode(plain)));
  return { ...head, iv, ct };
}
async function open(id: string, r: Rec): Promise<string | null> {
  try {
    if (r.v === 2 && r.alg === "A256GCM") {
      const key = gcmKeys.get(r.kid);
      if (!key) return null;
      return dec.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: r.iv, additionalData: aad(id, r) }, key, r.ct));
    }
    if (r.v === 1 && r.alg === "A256CBC" && legacyAllowed) {
      return dec.decode(await crypto.subtle.decrypt({ name: "AES-CBC", iv: r.iv }, cbcKey, r.ct));
    }
    return null; // noma'lum yoki ruxsat etilmagan format: rad
  } catch { return null; }
}

// Eski yozuv (v1) bazada qolgan.
const iv1 = crypto.getRandomValues(new Uint8Array(16));
const ct1 = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv: iv1 }, cbcKey, enc.encode("rol=guest;t=alfa")));
const store = new Map<string, Rec>([["u1", { v: 1, alg: "A256CBC", kid: "k1", iv: iv1, ct: ct1 }]]);
store.set("u2", await seal("u2", "rol=driver;t=beta"));

// O'qishda eski yozuv yangi formatga ko'chiriladi.
async function read(id: string): Promise<string | null> {
  const r = store.get(id)!;
  const plain = await open(id, r);
  if (plain !== null && r.v !== 2) store.set(id, await seal(id, plain));
  return plain;
}
console.log("v1 yozuv o'qildi:", await read("u1"), "| endi versiya:", store.get("u1")!.v);
console.log("v2 yozuv o'qildi:", await read("u2"));

// Hujum 1: header'ni o'zgartirish (kid) AAD tufayli rad etiladi.
const t = store.get("u2")!;
console.log("kid o'zgartirilgan:", await open("u2", { ...t, kid: "k1" }));
// Hujum 2: shifrmatnni boshqa yozuv ID'siga ko'chirish.
console.log("boshqa ID'ga ko'chirilgan:", await open("u1", t));
// Hujum 3: migratsiyadan keyin downgrade (eski ko'rinishdagi yozuv).
legacyAllowed = false;
console.log("downgrade (v1 qabul qilinmaydi):", await open("u9", { v: 1, alg: "A256CBC", kid: "k1", iv: iv1, ct: ct1 }));
```

```text
v1 yozuv o'qildi: rol=guest;t=alfa | endi versiya: 2
v2 yozuv o'qildi: rol=driver;t=beta
kid o'zgartirilgan: null
boshqa ID'ga ko'chirilgan: null
downgrade (v1 qabul qilinmaydi): null
```

Nima uchun yetarli: har yozuv algoritm va kalit versiyasini ko'rsatadi, shuning uchun almashtirish bosqichma-bosqich bo'ladi. AAD header va yozuv ID'sini bog'laydi, shuning uchun kalit ID'si, ID yoki format o'zgartirilsa deshifrlash o'tmaydi. Eski format migratsiya tugagach o'chadi.

Nimani yopmaydi. Migratsiyagacha v1 yozuvlari allaqachon o'zgartirilgan bo'lishi mumkin; CBC'da buni aniqlab bo'lmaydi, shuning uchun migratsiya "tekshirilgan" ma'lumot hosil qilmaydi. Hujumchi yozuvni eski, to'g'ri imzolangan v2 versiyasi bilan almashtirsa (replay), AAD buni aniqlamaydi; buning uchun versiya hisoblagichi yoki yozuv darajasidagi boshqa nazorat kerak. DEK ni qayta o'rash esa public-key bilan himoyalangan kalitlar uchun alohida migratsiya (68-dars, PQC cheat sheet 3-bosqich: "Stored data").

## Qachon qo'llamaslik kerak

Hamma ma'lumotni maydon darajasida shifrlash shart emas. Cheat sheet birinchi bo'lib minimizatsiyani aytadi: saqlanmagan ma'lumot o'g'irlanmaydi. Ommaviy yoki tezda eskiradigan ma'lumot (kesh, vaqtinchalik sessiya) uchun disk darajasidagi himoya va qisqa saqlash muddati yetarli bo'lishi mumkin. Maydon shifrlash qidiruv, saralash va indekslashni qiyinlashtiradi: shifrlangan maydon bo'yicha qidirish uchun alohida dizayn (masalan HMAC bilan hisoblangan blind index, 62-dars) kerak va u o'z xavflarini olib keladi.

PQC migratsiyasi ham har joyda bir xil shoshilinch emas. Bir necha daqiqa yoki kun yashaydigan sessiya trafigi uchun ustuvorlik pastroq, shu sababli cheat sheet ustuvorlikni maxfiylik muddatiga bog'laydi. Va kriptografik primitivlarni o'zingiz yozmang: ASVS 11.2.1 sanoat tomonidan tekshirilgan implementatsiyalarni talab qiladi, Appendix C esa PQC bo'yicha hozircha mustahkamlangan kod kam ekanini qayd etadi. Kutubxona yoki provayder qo'llab-quvvatlamasa, kutish, uni ro'yxatga olish va xavfni yozib qo'yish to'g'ri qaror (cheat sheet: bloklangan bog'liqliklar uchun qolgan xavf, sana va egasi).

## Stack'da: Node.js, PostgreSQL, TLS va KMS

Node.js'da shifrlash uchun `crypto` va WebCrypto bor; ML-KEM va ML-DSA kalitlari `crypto`da va WebCrypto'da bor, lekin hujjatga ko'ra ular OpenSSL 3.5 yoki undan yangisini talab qiladi, shuning uchun qo'llab-quvvatlash Node versiyasiga bog'liq. `tls` sozlamalarida esa `ecdhCurve` opsiyasiga `X25519MLKEM768` nomini ko'rsatish mumkin (Node.js hujjatidagi misol; TLS 1.3 da bu opsiya supported groups va key share guruhlarini belgilaydi). Node.js hujjatiga ko'ra `crypto.generateKeyPair` ML-DSA ni v24.6.0 dan, ML-KEM ni v24.7.0 dan, WebCrypto'da ML-KEM va ML-DSA v24.7.0 dan qo'llaydi; ular OpenSSL 3.5 yoki undan yangisini talab qiladi (hujjatdagi izoh), shuning uchun ishlatadigan Node.js ning `process.versions.openssl` qiymati kamida 3.5 bo'lishi shart. Kodni `seal`/`open` interfeysi orqasida yozing va formatni bitta joyda saqlang: algoritm almashganda faqat shu modul o'zgaradi (ASVS 11.2.2). Prisma yoki Kysely'da yozuv jadvaliga `enc_version`, `kek_id` va `ciphertext` ustunlarini qo'shing yoki bitta `bytea` ustunda header bo'lsin; fon job kichik paketlarda eski yozuvlarni ko'chirib, qancha qolganini o'lchaydi.

Transportda eng amaliy qadam: TLS terminatsiya qiladigan qatlam (reverse proxy, load balancer, CDN yoki bulut provayder) hybrid kalit almashinuvini qo'llab-quvvatlaydimi, shuni tekshirish va faqat ularning qo'llab-quvvatlanadigan sozlamasidan foydalanish. TLS cheat sheet'da X25519MLKEM768 post-quantum uchun "hozirgi vaqtda ishlatiladi" deb qayd etilgan, lekin u formal ma'noda group emas. Sertifikat va hostname tekshiruvi yoqilgan qolishi kerak. Bulut KMS va HSM uchun provayderning PQC yo'l xaritasini so'rang va DEK'ni o'rash algoritmini inventarga yozing (68-dars).

Inventarni kodga yaqin saqlang: kutubxona versiyalari, TLS sozlamalari va kalit ID'lari repozitoriyda kuzatiladi, topilgan yangi kriptografiya ishlatilishi inventarga qo'shiladi (83-dars SAST bilan kriptografik discovery bog'lanadi; ASVS 11.1.3). Rollout paytida kelishilgan algoritmlarni va tekshiruv natijalarini secretsiz jurnalga yozing va kutilmagan klassik-only ishlatish haqida ogohlantirish qo'ying (79-dars).

## Xulosa

- Shifrlash qatlami tahdid modeliga mos tanlanadi: disk yoki apparat shifrlashi ilova buzilganda yordam bermaydi. Eng yaxshi himoya sezgir ma'lumotni saqlamaslik.
- Saqlanayotgan har yozuv versiya, algoritm va kalit ID'sini olib yuradi, header AAD'ga kiradi. Bu crypto agility (ASVS 11.2.2) va lazy migration uchun asos; migratsiya tugagach eski format o'chiriladi.
- Autentifikatsiyasiz rejim (CBC) yaxlitlikni bermaydi: IV yoki shifrmatnni o'zgartirish xatosiz qabul qilinadi. AEAD ishlatiladi (ASVS 11.3.2-11.3.3).
- RSA va ECC (Curve25519 ham) post-quantum xavfsiz emas. Ustuvorlik uzoq muddat maxfiy qolishi kerak bo'lgan va yangilash qiyin bog'liqliklarga beriladi; AES-256 afzal, ammo DEK'ning public-key himoyasi ham tekshiriladi.
- ML-KEM (FIPS 203) umumiy maxfiy qiymat o'rnatadi, AES o'rnini bosmaydi; ML-DSA (FIPS 204) imzolar uchun alohida migratsiya. Hybrid TLS maxfiylikni beradi, sertifikat imzolarini quantum-chidamli qilmaydi; dual-signature'da ikkalasi tekshiriladi.
- Migratsiya bosqichma-bosqich: inventar, ustuvorlik, qo'llab-quvvatlanadigan implementatsiya, to'liq yo'lni test, rollout va fallback'ni istisno sifatida muddat bilan yuritish. Kriptografiyani o'zingiz yozmang.
