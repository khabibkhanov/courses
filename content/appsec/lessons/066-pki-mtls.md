---
n: 66
slug: pki-mtls
title: "PKI, sertifikatlar va mTLS"
summary: "Sertifikat nima bog'laydi (ochiq kalit va nom), ishonch zanjiri va yo'lni tekshirish (imzo, muddat, CA belgisi, bekor qilish, nom, maqsad), zanjir tekshiruvidagi tipik xato va mTLS'da autentifikatsiya bilan avtorizatsiya farqi."
duration: 50
sources:
  - id: rfc5280
    note: "RFC 5280: 4.1.2.5 Validity, 4.2.1.6 Subject Alternative Name (identifikatorlarni sub'ektga bog'lash), 4.2.1.9 Basic Constraints (cA va pathLenConstraint), 4.2.1.12 Extended Key Usage, 6.1 va 6.1.3 yo'lni tekshirish. RFC matni bilan solishtirilgan: 4.2 (taniy olmagan critical kengaytmali sertifikat rad etiladi), 4.2.1.9 (cA tasdiqlanmasa kalit sertifikat imzosini tekshirishda ishlatilmaydi; pathLenConstraint 0 - undan keyin non-self-issued oraliq CA yo'q), 6.1.3 (a)(1)-(a)(4): imzo, validity, bekor qilinmaganlik, issuer nomi"
  - id: rfc9846
    note: "RFC 9846 (RFC 8446 ni bekor qilgan joriy TLS 1.3) 4.5.1 va 4.5.2: Certificate va CertificateVerify xabarlari (RFC 8446 da 4.4.2 va 4.4.3); mijoz sertifikat bilan autentifikatsiya qilsa CertificateVerify yuborishi shart"
  - id: rfc9525
    note: "RFC 9525 (2023-yil noyabr, RFC 6125 ni bekor qiladi): 2 (Common Name xizmat identifikatsiyasi uchun ishlatilmasligi shart), 6.3 (DNS nomlarni label bo'yicha katta-kichik harfga bog'liq bo'lmagan solishtirish; wildcard faqat eng chap label'ning to'liq mazmuni bo'lgan bitta '*' va aynan bitta label'ga mos keladi), 6.4 (IP manzil baytma-bayt)"
  - id: t10-a04
    note: "A04:2025 tekshiriladigan savollar: server sertifikati va ishonch zanjiri to'g'ri tekshirilyaptimi; eng sezgir kalitlarni HSM'da saqlash; LetsEncrypt kabi xizmatlar sertifikat boshqaruvini soddalashtirgani"
  - id: cs-key-mgmt
    note: "Key Management cheat sheet: CA imzo kaliti oshkor bo'lsa soxta sertifikat va CRL yaratish mumkinligi; Cryptoperiods and Rotation: TLS server sertifikati muddati CA/Browser Forum talablari bo'yicha rejalanadi, sertifikatni yangilash kalit juftligini almashtirishi shart emas"
  - id: pg-libpq-ssl
    note: "PostgreSQL libpq SSL Support: verify-ca va verify-full farqi, wildcard nom faqat nuqtadan boshqa belgilarga mos keladi (subdomenlarga mos kelmaydi); mijoz tomonida server sertifikatini tekshirish"
  - id: pg-auth
    note: "PostgreSQL Client Authentication: hostssl yozuvlarida clientcert=verify-ca yoki verify-full mijozdan ishonchli sertifikat talab qiladi, verify-full qo'shimcha ravishda CN ni foydalanuvchi nomiga bog'laydi"
  - id: redis-tls
    note: "Redis TLS sahifasi: standart holatda mutual TLS (tls-auth-clients), tls-ca-cert-file ishonchli ildiz sifatida"
quiz:
  - q: "Zanjir tekshiruvi har bir sertifikat imzosini, muddatini va issuer nomini tekshiradi, lekin issuer sertifikatida `cA` belgisini tekshirmaydi. Hujumchi nima qila oladi?"
    options:
      - "Hech narsa, imzolar to'g'ri bo'lsa yetarli"
      - "Qonuniy CA bergan oddiy (leaf) sertifikat kaliti bilan o'zi istagan nom uchun sertifikat imzolaydi va tekshiruv uni qabul qiladi"
      - "Faqat muddati o'tgan sertifikat bilan kira oladi"
      - "Root CA maxfiy kalitini tiklaydi"
    answer: 1
    explain: "RFC 5280 4.2.1.9: cA tasdiqlanmagan sertifikat kaliti boshqa sertifikatlar imzosini tekshirish uchun ishlatilmasligi kerak. Bu tekshiruv bo'lmasa, har bir leaf sertifikat egasi o'zini CA qilib oladi."
  - q: "Sertifikatning Subject Alternative Name (SAN) maydoni nima uchun muhim?"
    options:
      - "U sertifikat imzosini hisoblaydi"
      - "U sertifikat muddatini belgilaydi"
      - "U sertifikat bog'laydigan identifikatorlarni (DNS nomi, IP, email, URI) beradi; mijoz ulanayotgan nomni aynan shu bilan solishtiradi"
      - "U CA ro'yxatini saqlaydi"
    answer: 2
    explain: "RFC 5280 4.2.1.6: SAN kengaytmasi identifikatorlarni sertifikat sub'ektiga bog'laydi (DNS nomi, IP, email, URI). Zanjir to'g'ri bo'lsa ham, nom mos kelmasa, sertifikat boshqa host uchun berilgan."
  - q: "mTLS yoqilgan ichki API serveri mijoz sertifikatini zanjir bo'yicha tekshirdi va ulanishga ruxsat berdi. Nima yetishmayapti?"
    options:
      - "Sertifikat identifikatori (SAN/URI)ni so'ralayotgan operatsiyaga ruxsati bor servislar ro'yxati bilan solishtirish, ya'ni avtorizatsiya"
      - "Hech narsa: autentifikatsiya avtorizatsiyani ham hal qiladi"
      - "Faqat TLS versiyasini oshirish"
      - "Sertifikatni brauzerga o'rnatish"
    answer: 0
    explain: "mTLS 'bu qaysi servis' savoliga javob beradi, 'unga nima mumkin' savoliga emas. Ishonchli zanjirdan chiqqan har qanday servis sertifikati hamma endpoint'ga kira olmasligi kerak (51-58 darslar)."
  - q: "Servis sertifikati muddati tugagani uchun yangilandi, lekin yangi sertifikat eski kalit juftligi bilan chiqarildi. Qaysi xulosa to'g'ri?"
    options:
      - "Kalit endi yangi, eski kalit yo'qoldi"
      - "Eski sertifikat avtomatik bekor qilinadi"
      - "Kalit abadiy xavfsiz"
      - "Sertifikat yangilanishi kalit juftligini avtomatik almashtirmaydi: kalit cryptoperiod bo'yicha alohida almashtiriladi"
    answer: 3
    explain: "Key Management cheat sheet: sertifikat yangilanishi kalit juftligini almashtirishi shart emas; kalit almashtirish jadvali alohida belgilanadi. Kalit sizib chiqqan bo'lsa, faqat sertifikatni yangilash yetmaydi."
  - q: "Klient `rejectUnauthorized: false` bilan ichki servisga ulanyapti, chunki 'sertifikat self-signed'. Bu xavfni nima deb baholaysiz?"
    options:
      - "Zararsiz: trafik baribir shifrlangan"
      - "Kanal shifrlangan, lekin server kimligi tekshirilmaydi: o'rtadagi hujumchi o'z sertifikatini ko'rsatsa ham qabul qilinadi"
      - "Faqat sertifikat muddatini tekshirmaydi"
      - "Faqat TLS 1.2 da muammo"
    answer: 1
    explain: "Shifrlash va autentifikatsiya alohida (64 va 65-darslar). Sertifikatni tekshirmasdan ulanish MITM'ga yo'l ochadi. To'g'ri yechim: o'z CA sertifikatini ishonchli ro'yxatga qo'shish, tekshiruvni yoqilgan holda qoldirish."
  - q: "Sertifikat bekor qilinganini tekshirish (RFC 5280 6.1.3 (a)(3)) qanday amalga oshishi mumkin?"
    options:
      - "Faqat sertifikat muddati bo'yicha"
      - "Faqat brauzer yangilanishi bilan"
      - "CRL, boshqa status ma'lumotlari yoki out-of-band mexanizmlar orqali"
      - "Bekor qilish tekshirilmaydi, spetsifikatsiyada yo'q"
    answer: 2
    explain: "6.1.3 (a)(3): sertifikat joriy vaqtda bekor qilinmaganligi CRL, status ma'lumotlari yoki out-of-band mexanizm bilan aniqlanadi. Real tizimda bu tekshiruv qanchalik kuchli ishlashi kutubxona va konfiguratsiyaga bog'liq."
task:
  title: "Leaf sertifikat siyosati: muddat, nom, maqsad, bekor qilish"
  prompt: |
    `checkLeaf(cert, host, now, revoked)` funksiyasi server sertifikatini tekshiradi, lekin hozir faqat imzo bayrog'iga qaraydi. Quyidagi qoidalarni qo'shing, har qoida uchun bitta qator, aynan shu matn va tartib bilan:
    1. `sigOk` false: `"imzo yaroqsiz"`.
    2. `now` > `notAfter`: `"muddati tugagan"`.
    3. `host` hech bir SAN yozuviga mos kelmaydi: `"hostname mos emas"`. Moslik: katta-kichik harfga bog'liq emas; `*.fleet.test` shaklidagi wildcard aynan bitta label'ni almashtiradi (`gps.fleet.test` mos, `a.b.fleet.test` va `fleet.test` mos emas). RFC 9525 6.3 bilan mos.
    4. `eku` ichida `"serverAuth"` yo'q: `"serverAuth emas"`.
    5. `serial` `revoked` to'plamida: `"bekor qilingan"`.

    Imzo va `console.log`larni o'zgartirmang. Kutilgan chiqish: ketma-ket `ok`, `nom`, `muddat+bekor`, `eku`, `ok`, `nom`.
  lang: ts
  starter: |
    type Leaf = { serial: string; san: string[]; notAfter: number; eku: string[]; sigOk: boolean };

    function checkLeaf(cert: Leaf, host: string, now: number, revoked: Set<string>): string[] {
      return cert.sigOk ? [] : ["imzo yaroqsiz"];
    }

    const revoked = new Set(["bad-1"]);
    const base: Leaf = { serial: "s1", san: ["gps.fleet.test"], notAfter: 100, eku: ["serverAuth"], sigOk: true };

    const cases: [string, Leaf, string, number][] = [
      ["ok", base, "gps.fleet.test", 50],
      ["nom", base, "api.fleet.test", 50],
      ["muddat+bekor", { ...base, serial: "bad-1" }, "gps.fleet.test", 150],
      ["eku", { ...base, eku: ["clientAuth"] }, "gps.fleet.test", 50],
      ["ok", { ...base, san: ["*.fleet.test"] }, "API.fleet.test", 50],
      ["nom", { ...base, san: ["*.fleet.test"] }, "a.b.fleet.test", 50],
    ];

    for (const [name, cert, host, now] of cases) {
      console.log(name.padEnd(13), JSON.stringify(checkLeaf(cert, host, now, revoked)));
    }
  solution: |
    type Leaf = { serial: string; san: string[]; notAfter: number; eku: string[]; sigOk: boolean };

    function matchName(pattern: string, host: string): boolean {
      const p = pattern.toLowerCase().split(".");
      const h = host.toLowerCase().split(".");
      if (p.length !== h.length) return false;
      return p.every((label, i) => (i === 0 && label === "*" ? h[0].length > 0 : label === h[i]));
    }

    function checkLeaf(cert: Leaf, host: string, now: number, revoked: Set<string>): string[] {
      const out: string[] = [];
      if (!cert.sigOk) out.push("imzo yaroqsiz");
      if (now > cert.notAfter) out.push("muddati tugagan");
      if (!cert.san.some((p) => matchName(p, host))) out.push("hostname mos emas");
      if (!cert.eku.includes("serverAuth")) out.push("serverAuth emas");
      if (revoked.has(cert.serial)) out.push("bekor qilingan");
      return out;
    }

    const revoked = new Set(["bad-1"]);
    const base: Leaf = { serial: "s1", san: ["gps.fleet.test"], notAfter: 100, eku: ["serverAuth"], sigOk: true };

    const cases: [string, Leaf, string, number][] = [
      ["ok", base, "gps.fleet.test", 50],
      ["nom", base, "api.fleet.test", 50],
      ["muddat+bekor", { ...base, serial: "bad-1" }, "gps.fleet.test", 150],
      ["eku", { ...base, eku: ["clientAuth"] }, "gps.fleet.test", 50],
      ["ok", { ...base, san: ["*.fleet.test"] }, "API.fleet.test", 50],
      ["nom", { ...base, san: ["*.fleet.test"] }, "a.b.fleet.test", 50],
    ];

    for (const [name, cert, host, now] of cases) {
      console.log(name.padEnd(13), JSON.stringify(checkLeaf(cert, host, now, revoked)));
    }
  solutionNotes: |
    - Wildcard moslik label sonini solishtirishdan boshlanadi: `*.fleet.test` uch label, `a.b.fleet.test` to'rt label, shuning uchun mos kelmaydi. `*` faqat birinchi label o'rniga turadi va bo'sh bo'lmasligi kerak.
    - Katta-kichik harf farqi `toLowerCase` bilan olib tashlanadi: DNS nomlari harfga sezgir emas.
    - Qoidalar mustaqil tekshiriladi va hammasi qaytariladi: bitta muammo topilganda to'xtab qolmaslik uchun (uchinchi holatda `muddati tugagan` va `bekor qilingan` birga chiqadi). Real kutubxona birinchi xatodan to'xtashi mumkin, lekin audit uchun to'liq ro'yxat foydali.
    - Bu faqat leaf sertifikat siyosati. Zanjir tekshiruvi (imzo zanjiri, CA belgisi, pathLen) alohida; `sigOk` bu yerda tayyor bayroq. Real tizimda tekshirishni TLS kutubxonasi qiladi, siz uni o'chirmaysiz, nom va maqsad siyosatini esa sozlaysiz.
    - Wildcard qoidasi RFC 9525 6.3 dan: `*` faqat eng chap label'ning to'liq mazmuni bo'lishi mumkin va aynan bitta label'ga mos keladi (qisman wildcard va ko'p darajali moslik yo'q); qoida buzilgan identifikator yaroqsiz va e'tiborga olinmaydi. DNS nomlar label bo'yicha, katta-kichik harfga bog'liq bo'lmagan holda solishtiriladi. PostgreSQL libpq hujjati ham wildcard faqat nuqtadan boshqa belgilarga mos kelishini va subdomenlarga mos kelmasligini yozadi.
  checklist:
    - "Har bir qoida o'z matni va tartibi bilan chiqadi"
    - "Wildcard aynan bitta label'ni almashtiradi, katta-kichik harf farq qilmaydi"
    - "Bir nechta muammo bir vaqtda ro'yxatga tushadi"
    - "Funksiya xato tashlamaydi, toza sertifikat uchun bo'sh ro'yxat qaytaradi"
    - "Leaf siyosati zanjir tekshiruvini almashtirmasligini ayta olasiz"
---

## Muammo

64-darsda ko'rdik: ECDH ikki tomonga umumiy sir beradi, lekin kim bilan gaplashayotganini aytmaydi. Imzo kimligini isbotlaydi, lekin faqat "bu ochiq kalitning egasi shu" deb; ochiq kalit esa kimniki ekanini hali bilmaymiz. Ochiq kalitni nomga (masalan `gps.fleet.test`) bog'lash va bu bog'lanishga ishonish kerak. Sertifikat va PKI (Public Key Infrastructure) shu muammoni hal qiladi.

Amaliy og'riq ikki xil. Birinchisi, sertifikat tekshiruvi xato yoki o'chirilgan: dasturchi self-signed sertifikatga duch kelib, "ishlasin" deb `rejectUnauthorized: false` yozadi, va kod prodakshnga o'tib ketadi. Ikkinchisi, tekshiruv bor, lekin to'liq emas: zanjir tekshiriladi, lekin CA belgisi, nom yoki maqsad tekshirilmaydi. Bu xato sinfi alohida nomlangan: OWASP A04 CWE ro'yxatida CWE-296 (sertifikat ishonch zanjiriga noto'g'ri amal qilish) bor. Biz o'quv modelida mexanizmni ko'rsatamiz.

Uchinchi masala servislar orasidagi aloqa. Mikroservis arxitekturasida avtopark platformasining 20 ta servisi bir-biri bilan gaplashadi. Ichki tarmoq "ishonchli" degan taxmin A04 tekshiruv ro'yxatida ham, 3-darsdagi defense in depth tamoyilida ham qo'llab-quvvatlanmaydi. Qaror: har servis o'z sertifikati bilan tanishtiradi (mTLS), lekin sertifikatning o'zi avtorizatsiya emas. Bu darsda sertifikat nima bog'laydi, yo'l qanday tekshiriladi, mTLS qayerda yordam beradi va qayerda yetmaydi.

## Asosiy g'oya

### Sertifikat nima

X.509 sertifikati ochiq kalitni bir yoki bir nechta identifikatorga bog'laydigan va CA (Certification Authority) tomonidan imzolangan ma'lumot. RFC 5280 profilidagi muhim maydonlar:

- Subject va Subject Alternative Name (SAN): sertifikat kimni (qaysi DNS nomi, IP, email yoki URI'ni) bildiradi. RFC 5280 4.2.1.6: SAN kengaytmasi identifikatorlarni sertifikat sub'ektiga bog'laydi va ular subject maydonidagi nomga qo'shimcha yoki uning o'rniga kelishi mumkin; aniqlangan turlar: email, DNS nomi, IP manzil va URI. Mijoz ulanayotgan nomni SAN bilan solishtiradi. Nom moslashtirish qoidalari RFC 9525 da: 2-bo'limga ko'ra Common Name (CN) xizmat identifikatsiyasi uchun ishlatilmaydi (MUST NOT), shuning uchun host nomi faqat SAN dagi DNS-ID yoki IP-ID bilan solishtiriladi; mijoz taqdim etilgan identifikatorlardan birortasi o'zi qurgan mos yozuvga to'g'ri kelsa, qidiruvni to'xtatadi (6.2).
- Validity (notBefore va notAfter): CA shu davr ichida sertifikat holati haqida ma'lumot yuritishga kafolat beradi (4.1.2.5).
- Basic Constraints: sertifikat sub'ekti CA ekanligini (`cA` belgisi) va undan keyingi zanjir chuqurligi chegarasini (`pathLenConstraint`) bildiradi. Agar bu kengaytma yo'q yoki `cA` tasdiqlanmagan bo'lsa, sertifikatdagi ochiq kalit sertifikat imzolarini tekshirish uchun ishlatilmasligi shart (4.2.1.9).
- Extended Key Usage (EKU): sertifikat qaysi maqsadlarda ishlatilishi mumkin (masalan server autentifikatsiyasi yoki mijoz autentifikatsiyasi). Kengaytma bor bo'lsa, sertifikat faqat sanalgan maqsadlardan biri uchun ishlatiladi (4.2.1.12).

### Ishonch zanjiri

Mijoz ishonadigan CA sertifikatlari (trust anchor, root) uning ishonch ro'yxatida turadi. Server leaf sertifikatini va kerak bo'lsa oraliq (intermediate) CA sertifikatlarini yuboradi; mijoz zanjir root'ga yetguncha har sertifikat imzosini keyingisi bilan tekshiradi. RFC 5280 6.1.3 (basic certificate processing) yo'ldagi har bir sertifikat uchun shartlarni sanaydi: imzo working public key bilan tekshiriladi, sertifikat validity davri joriy vaqtni qamraydi, sertifikat bekor qilinmagan (CRL, status ma'lumoti yoki out-of-band mexanizm bilan aniqlanadi) va issuer nomi kutilgan nomga teng. Shuningdek, nom cheklovlari va sertifikat siyosati tekshiruvlari bor. Spetsifikatsiya yana bir muhim qoida beradi: mijoz qo'llab-quvvatlamaydigan critical kengaytmali sertifikatni rad etishi kerak.

TLS handshake'da server sertifikat zanjirini Certificate xabarida yuboradi va CertificateVerify bilan uning maxfiy kalitiga egaligini isbotlaydi (RFC 9846 4.5.1 va 4.5.2). Shunday qilib, sertifikat "bu ochiq kalit shu nomniki" deydi, CertificateVerify esa "men shu kalitning egasiman" deydi. Ikkalasi birga 64-darsdagi MITM'ni yopadi.

### CA kaliti va kalit boshqaruvi

PKI xavfsizligi CA imzo kalitlariga tayanadi. Key Management cheat sheet shuni aniq yozadi: CA imzo kaliti oshkor bo'lsa, hujumchi soxta sertifikat va CRL yarata oladi. A04 oldini olish ro'yxati eng sezgir kalitlarni hardware yoki cloud HSM'da saqlashni tavsiya qiladi. Ko'pchilik jamoa ommaviy sertifikatlar uchun tayyor CA'dan (masalan LetsEncrypt kabi xizmatlardan) foydalanadi; A04 shunday xizmatlar kalit va sertifikat boshqaruvini soddalashtirgani va avvalgi to'siqlar olib tashlanganini ta'kidlaydi. Ichki servislar uchun esa o'zingizning ichki CA yoki mesh/KMS xizmati kerak, va uning kaliti eng qimmatli sir bo'ladi (68-dars).

Yana bir nozik joy: sertifikat yangilash va kalit almashtirish bir narsa emas. Cheat sheet TLS server kalitlari va sertifikatlari uchun sertifikat muddatini CA/Browser Forum talablari bo'yicha rejalashtirishni, kalit almashtirish jadvalini esa alohida belgilashni yozadi, chunki sertifikatni yangilash kalit juftligini almashtirishi shart emas.

## Chuqurroq: zanjir tekshiruvi xatolari va mTLS

### To'liq bo'lmagan tekshiruv

Zanjir tekshiruvi ko'p qadamli, va har qadam bir hujum sinfini yopadi:

| Tekshiruv | Yopadigan hujum |
|---|---|
| Imzo va issuer nomi | Soxtalashtirilgan sertifikat |
| Validity | Muddati o'tgan yoki hali kuchga kirmagan sertifikat |
| Issuer'da `cA = true`, pathLen | Oddiy sertifikat egasi o'zini CA qilib olishi |
| Nom (SAN) | Boshqa host uchun berilgan to'g'ri sertifikatni ko'rsatish |
| EKU | Maqsadi boshqa sertifikatni (masalan mijoz sertifikatini) server sertifikati sifatida ishlatish |
| Bekor qilish | Kaliti sizib chiqqan sertifikat |

Eng ko'p uchraydigan xato birinchi ikki qatorni tekshirib, uchinchisini unutish. Quyidagi misolda aynan shu: zanjir tekshiruvchisi imzolarni tekshiradi, lekin issuer sertifikatining `cA` belgisiga qaramaydi.

### mTLS: ikki tomonlama autentifikatsiya

Oddiy TLS'da faqat server sertifikat ko'rsatadi. mTLS'da (mutual TLS) server mijozdan ham sertifikat so'raydi (CertificateRequest). Mijoz Certificate yuboradi va u sertifikat bilan autentifikatsiya qilsa, CertificateVerify yuborishi shart (RFC 9846 4.5.2). Natijada server so'rov kelgan servisning kimligini kriptografik asosda biladi, parol yoki API kalitisiz. Bu servislar orasidagi umumiy sirni (har bir servisning kaliti ro'yxati) olib tashlaydi va kalit muddati sertifikat bilan birga yuradi.

Lekin mTLS faqat autentifikatsiya beradi. Ishonchli ichki CA bergan har qanday servis sertifikati zanjirni o'tadi, bu "so'rovchi nomi `billing.fleet.internal`" degan ma'noni beradi, "u telemetriyani o'qiy oladi" degani emas. Shuning uchun server sertifikat identifikatorini (SAN dagi URI yoki DNS) servislar ro'yxati va ruxsatlar bilan solishtiradi: bu avtorizatsiya (51-53 va 57-darslar). Aks holda bitta buzilgan servis hamma servislarga kira oladigan bo'ladi, mTLS esa hujum sirini kamaytirmaydi, faqat tashqi tomonni to'xtatadi.

Sertifikat egasining maxfiy kaliti himoyasi ham muhim: servis kompromatsiya qilinsa, hujumchi uning sertifikatini va kalitini oladi. Cheklash chorasi: qisqa muddatli sertifikatlar (avtomatik yangilanadigan), tez bekor qilish va servis darajasidagi ruxsatlarni minimal qilish. Muddat uzunligining aniq qiymati tahdid modeliga bog'liq va bu darsda manbadan olingan raqam yo'q.

## Misol: CA belgisini tekshirmaydigan tekshiruvchi

Quyidagi kod o'quv PKI modeli: ECDSA P-256 imzolari bilan sertifikatlar JSON ko'rinishida. Bu real X.509 emas, lekin zanjir tekshiruvi mantig'ini aynan ko'rsatadi. Hujum faqat shu model kodiga qarshi.

### Zaif kod

Tekshiruvchi zanjirdagi har sertifikat imzosini, issuer nomini va muddatini tekshiradi, leaf SAN'ida host borligini tekshiradi. Issuer'ning CA ekanligini tekshirmaydi.

```ts run
const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (h: string) => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));
const ALG = { name: "ECDSA", hash: "SHA-256" };

type Cert = {
  serial: string; subject: string; issuer: string; san: string[];
  notBefore: number; notAfter: number; isCA: boolean; pathLen: number | null; eku: string[]; key: string; sig: string;
};
type Fields = Omit<Cert, "sig" | "issuer">;

const newKey = () => crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
const pubHex = async (k: CryptoKeyPair) => hex(await crypto.subtle.exportKey("spki", k.publicKey));
async function issue(issuer: string, issuerKey: CryptoKeyPair, f: Fields): Promise<Cert> {
  const body = { ...f, issuer };
  return { ...body, sig: hex(await crypto.subtle.sign(ALG, issuerKey.privateKey, enc.encode(JSON.stringify(body)))) };
}
async function sigOk(c: Cert, issuerPub: string): Promise<boolean> {
  const k = await crypto.subtle.importKey("spki", unhex(issuerPub), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const { sig, ...body } = c;
  return crypto.subtle.verify(ALG, k, unhex(sig), enc.encode(JSON.stringify(body)));
}

// ZAIF: issuer'ning CA ekanligi (isCA, pathLen) tekshirilmaydi.
async function verifyWeak(chain: Cert[], root: Cert, host: string, now: number): Promise<boolean> {
  const all = [...chain, root];
  for (let i = 0; i < chain.length; i++) {
    const issuer = all[i + 1];
    if (chain[i].issuer !== issuer.subject || !(await sigOk(chain[i], issuer.key))) return false;
    if (now < chain[i].notBefore || now > chain[i].notAfter) return false;
  }
  return chain[0].san.includes(host);
}

const rootKey = await newKey();
const root = await issue("RootCA", rootKey, { serial: "1", subject: "RootCA", san: [], notBefore: 0, notAfter: 1000, isCA: true, pathLen: 0, eku: [], key: await pubHex(rootKey) });
const gpsKey = await newKey();
const gps = await issue("RootCA", rootKey, { serial: "10", subject: "gps", san: ["gps.fleet.test"], notBefore: 0, notAfter: 1000, isCA: false, pathLen: null, eku: ["serverAuth"], key: await pubHex(gpsKey) });

console.log("qonuniy zanjir qabul qilindi:", await verifyWeak([gps], root, "gps.fleet.test", 500));
```

```text
qonuniy zanjir qabul qilindi: true
```

### Hujum

> **Ta'lim maqsadida.** Bu soxta sertifikat zanjiri usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi o'z domeni `evil.example.test` uchun CA'dan oddiy (leaf) sertifikat oldi. Bu sertifikat `isCA: false`. U o'sha sertifikat kaliti bilan `gps.fleet.test` uchun sertifikat imzolaydi va zanjirni `[soxta, evil-leaf]` qilib yuboradi.

```ts run
const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (h: string) => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));
const ALG = { name: "ECDSA", hash: "SHA-256" };

type Cert = {
  serial: string; subject: string; issuer: string; san: string[];
  notBefore: number; notAfter: number; isCA: boolean; pathLen: number | null; eku: string[]; key: string; sig: string;
};
type Fields = Omit<Cert, "sig" | "issuer">;

const newKey = () => crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
const pubHex = async (k: CryptoKeyPair) => hex(await crypto.subtle.exportKey("spki", k.publicKey));
async function issue(issuer: string, issuerKey: CryptoKeyPair, f: Fields): Promise<Cert> {
  const body = { ...f, issuer };
  return { ...body, sig: hex(await crypto.subtle.sign(ALG, issuerKey.privateKey, enc.encode(JSON.stringify(body)))) };
}
async function sigOk(c: Cert, issuerPub: string): Promise<boolean> {
  const k = await crypto.subtle.importKey("spki", unhex(issuerPub), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const { sig, ...body } = c;
  return crypto.subtle.verify(ALG, k, unhex(sig), enc.encode(JSON.stringify(body)));
}
async function verifyWeak(chain: Cert[], root: Cert, host: string, now: number): Promise<boolean> {
  const all = [...chain, root];
  for (let i = 0; i < chain.length; i++) {
    const issuer = all[i + 1];
    if (chain[i].issuer !== issuer.subject || !(await sigOk(chain[i], issuer.key))) return false;
    if (now < chain[i].notBefore || now > chain[i].notAfter) return false;
  }
  return chain[0].san.includes(host);
}

const rootKey = await newKey();
const root = await issue("RootCA", rootKey, { serial: "1", subject: "RootCA", san: [], notBefore: 0, notAfter: 1000, isCA: true, pathLen: 0, eku: [], key: await pubHex(rootKey) });

// Hujumchining qonuniy leaf sertifikati (o'z domeni uchun).
const evilKey = await newKey();
const evil = await issue("RootCA", rootKey, { serial: "20", subject: "evil", san: ["evil.example.test"], notBefore: 0, notAfter: 1000, isCA: false, pathLen: null, eku: ["serverAuth"], key: await pubHex(evilKey) });

// U o'z leaf kaliti bilan boshqa host uchun "sertifikat" imzolaydi.
const forged = await issue("evil", evilKey, { serial: "666", subject: "gps", san: ["gps.fleet.test"], notBefore: 0, notAfter: 1000, isCA: false, pathLen: null, eku: ["serverAuth"], key: await pubHex(evilKey) });

console.log("soxta zanjir qabul qilindi:", await verifyWeak([forged, evil], root, "gps.fleet.test", 500));
```

```text
soxta zanjir qabul qilindi: true
```

Tekshiruvchi soxta sertifikatni qabul qildi: hujumchi hech qanday CA kalitini olmagan, faqat o'z qonuniy leaf sertifikatidan CA sifatida foydalangan. RFC 5280 4.2.1.9 aynan shuni taqiqlaydi: `cA` tasdiqlanmagan sertifikat kalitini sertifikat imzolarini tekshirishda ishlatib bo'lmaydi.

### Tuzatilgan kod

Tuzatish: har issuer uchun `isCA` va `pathLen` tekshiruvi, leaf uchun nom, `serverAuth` EKU va bekor qilish ro'yxati. Natija sabab matni bilan qaytadi, shunda log'dan nega rad etilgani ko'rinadi.

```ts run
const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (h: string) => Uint8Array.from(h.match(/../g) ?? [], (x) => parseInt(x, 16));
const ALG = { name: "ECDSA", hash: "SHA-256" };

type Cert = {
  serial: string; subject: string; issuer: string; san: string[];
  notBefore: number; notAfter: number; isCA: boolean; pathLen: number | null; eku: string[]; key: string; sig: string;
};
type Fields = Omit<Cert, "sig" | "issuer">;

const newKey = () => crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign", "verify"]);
const pubHex = async (k: CryptoKeyPair) => hex(await crypto.subtle.exportKey("spki", k.publicKey));
async function issue(issuer: string, issuerKey: CryptoKeyPair, f: Fields): Promise<Cert> {
  const body = { ...f, issuer };
  return { ...body, sig: hex(await crypto.subtle.sign(ALG, issuerKey.privateKey, enc.encode(JSON.stringify(body)))) };
}
async function sigOk(c: Cert, issuerPub: string): Promise<boolean> {
  const k = await crypto.subtle.importKey("spki", unhex(issuerPub), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const { sig, ...body } = c;
  return crypto.subtle.verify(ALG, k, unhex(sig), enc.encode(JSON.stringify(body)));
}

async function verifyChain(chain: Cert[], root: Cert, host: string, now: number, revoked: Set<string>): Promise<string> {
  const all = [...chain, root];
  for (let i = 0; i < chain.length; i++) {
    const c = chain[i];
    const issuer = all[i + 1];
    if (c.issuer !== issuer.subject) return `rad: ${c.subject} issuer nomi mos emas`;
    if (!(await sigOk(c, issuer.key))) return `rad: ${c.subject} imzosi yaroqsiz`;
    if (now < c.notBefore || now > c.notAfter) return `rad: ${c.subject} muddati yaroqsiz`;
    if (revoked.has(c.serial)) return `rad: ${c.subject} bekor qilingan`;
    if (!issuer.isCA) return `rad: ${issuer.subject} CA emas`;
    if (issuer.pathLen !== null && i > issuer.pathLen) return `rad: ${issuer.subject} pathLen chegarasi`;
  }
  const leaf = chain[0];
  if (!leaf.san.includes(host)) return "rad: hostname mos emas";
  if (!leaf.eku.includes("serverAuth")) return "rad: serverAuth emas";
  return "qabul";
}

const rootKey = await newKey();
const root = await issue("RootCA", rootKey, { serial: "1", subject: "RootCA", san: [], notBefore: 0, notAfter: 1000, isCA: true, pathLen: 0, eku: [], key: await pubHex(rootKey) });
const gpsKey = await newKey();
const gps = await issue("RootCA", rootKey, { serial: "10", subject: "gps", san: ["gps.fleet.test"], notBefore: 0, notAfter: 1000, isCA: false, pathLen: null, eku: ["serverAuth"], key: await pubHex(gpsKey) });
const evilKey = await newKey();
const evil = await issue("RootCA", rootKey, { serial: "20", subject: "evil", san: ["evil.example.test"], notBefore: 0, notAfter: 1000, isCA: false, pathLen: null, eku: ["serverAuth"], key: await pubHex(evilKey) });
const forged = await issue("evil", evilKey, { serial: "666", subject: "gps", san: ["gps.fleet.test"], notBefore: 0, notAfter: 1000, isCA: false, pathLen: null, eku: ["serverAuth"], key: await pubHex(evilKey) });

const none = new Set<string>();
console.log("qonuniy:", await verifyChain([gps], root, "gps.fleet.test", 500, none));
console.log("soxta:", await verifyChain([forged, evil], root, "gps.fleet.test", 500, none));
console.log("muddati tugagan:", await verifyChain([gps], root, "gps.fleet.test", 2000, none));
console.log("bekor qilingan:", await verifyChain([gps], root, "gps.fleet.test", 500, new Set(["10"])));
console.log("boshqa host:", await verifyChain([gps], root, "api.fleet.test", 500, none));
```

```text
qonuniy: qabul
soxta: rad: evil CA emas
muddati tugagan: rad: gps muddati yaroqsiz
bekor qilingan: rad: gps bekor qilingan
boshqa host: rad: hostname mos emas
```

Nima uchun yetarli: `isCA` tekshiruvi tufayli `evil` leaf sertifikati endi boshqa sertifikatlarning issuer'i bo'la olmaydi, shuning uchun soxta zanjir CA bosqichida rad etiladi. Muddat, bekor qilish, nom va EKU alohida tekshirilib, sabab bilan qaytadi. `pathLen` root uchun 0: root'dan to'g'ridan-to'g'ri leaf'gacha bo'lgan zanjirga ruxsat, oraliq CA yo'q.

Nimani yopmaydi. Birinchidan, bu model: real X.509 kengaytmalari (name constraints, key usage, critical bayroqlari, policy) ko'proq, va ularni to'g'ri tekshiradigan sinalgan kutubxonani o'zingiz yozgan kod bilan almashtirmang (61-dars). Ikkinchidan, bekor qilish ro'yxati ilovaga qanday yetkazilishi, yangilanish kechikishi va ro'yxat mavjud bo'lmaganda nima qilish (fail-open yoki fail-closed) alohida qaror. Uchinchidan, CA yoki leaf maxfiy kaliti o'g'irlansa, yuqoridagi tekshiruvlar buni bilmaydi: bekor qilish, qisqa muddat va kalit himoyasi kerak (68-dars).

## Qachon qo'llamaslik kerak

mTLS hamma holatga mos emas. Brauzer mijozlari uchun mijoz sertifikatlarini tarqatish va boshqarish og'ir; oxirgi foydalanuvchi autentifikatsiyasi uchun parol, passkey va sessiya (41-50 darslar) odatda mos. mTLS asosan servislar, qurilmalar va B2B integratsiyalar orasida. Kichik jamoa uchun ichki CA ishlatish o'zi risk: CA kaliti bitta nuqta, rotatsiya, bekor qilish va monitoring kerak. Agar sizda yetuk platforma xizmati (service mesh, cloud CA, secrets manager) bo'lmasa, mTLS ni o'zingiz qo'lda yig'ish xatolarga olib keladi.

Shuningdek, sertifikatni ishonch ro'yxatiga "tezroq ishlashi uchun" qo'shib qo'yish (hamma ichki servislarga o'z CA'ngizni ishontirish) ham risk: bu CA bo'yicha berilgan har qanday sertifikatga ishonchni anglatadi. Self-signed sertifikat muammosi tekshiruvni o'chirish bilan emas, o'sha sertifikat yoki CA'ni aniq ishonchli ro'yxatga qo'shish bilan hal qilinadi. Va mTLS autentifikatsiyadan boshqa narsani hal qilmasligini unutmang: ruxsatlar alohida.

## Stack'da: Node.js, NestJS, Kubernetes, PostgreSQL

Node.js'da `https`/`tls` modullari sertifikat tekshiruvini standart holatda yoqilgan holda ishlatadi; o'z CA'ngiz bo'lsa uni `ca` opsiyasi orqali qo'shing, tekshiruvni o'chirmang. Review qoidasi: kodda `rejectUnauthorized: false` yoki `NODE_TLS_REJECT_UNAUTHORIZED=0` ko'rinsa, bu avtomatik blokirovka. Node.js `tls` hujjatiga ko'ra mijoz tomonida `rejectUnauthorized` standart `true`, ya'ni server sertifikati berilgan CA ro'yxatiga qarshi tekshiriladi. mTLS uchun server tomonida `requestCert: true` beriladi (standart `false`), shundan so'ng `rejectUnauthorized` (standart `true`) ishonchsiz mijozlarni rad etadi; u `requestCert` bo'lmasa ta'sir qilmaydi. Hujjat shuni ham ogohlantiradi: `tlsSocket.authorized` `false` bo'lsa ham, server sozlamasiga qarab ishonchsiz ulanish qabul qilinishi mumkin, shuning uchun bu bayroqni kodda tekshiring. Sertifikat identifikatori `socket.getPeerCertificate()` orqali olinadi; NestJS'da buni guard'da servis ruxsatlari ro'yxati bilan solishtirasiz (58-dars).

Odatda mTLS ilovada emas, platformada hal qilinadi: Kubernetes'da service mesh yoki sidecar sertifikatlarni berib, avtomatik yangilaydi (87-dars), ilova esa sertifikat identifikatorini sarlavha yoki kontekst orqali oladi. Bunda ham ilova ishonishi kerak bo'lgan narsa: identifikator faqat mesh'dan keladi, tashqi mijoz uni o'zi qo'ya olmaydi. PostgreSQL va Redis ulanishlari uchun ham server sertifikatini tekshiradigan rejim kerak: libpq'da `sslmode=verify-full` (zanjirni ham, server nomini ham tekshiradi) va `sslrootcert`, Redis'da `tls-ca-cert-file` bilan ishonchli ildiz (65-dars). mTLS ni ma'lumotlar bazasiga ham qo'llash mumkin: PostgreSQL `pg_hba.conf` dagi `hostssl` yozuvida `clientcert=verify-ca` yoki `verify-full` mijozdan ishonchli sertifikat talab qiladi, `verify-full` esa sertifikatdagi Common Name'ni foydalanuvchi nomiga (yoki mapping'ga) ham bog'laydi. Redis server tomonida standart holatda mijozdan sertifikat talab qiladi, `tls-auth-clients no` buni o'chiradi. Ikkala holatda ham sertifikat faqat autentifikatsiya: baza foydalanuvchisining huquqlari alohida (56-dars, 89-dars).

## Xulosa

- Sertifikat ochiq kalitni nomga bog'laydi (SAN), CA imzosi bilan; mijoz zanjirni ishonch ro'yxatidagi root'gacha tekshiradi.
- Zanjir tekshiruvi ko'p qadamli: imzo, issuer nomi, muddat, bekor qilish, issuer'ning CA ekanligi (`cA`, `pathLen`), nom va EKU. Bittasi tushib qolsa, alohida hujum ochiladi.
- `rejectUnauthorized: false` kabi bayroqlar autentifikatsiyani o'chiradi: kanal shifrlangan, lekin kimligi noma'lum.
- mTLS servis kimligini kriptografik asosda beradi, lekin avtorizatsiya emas: sertifikat identifikatorini ruxsatlar bilan solishtiring.
- Sertifikatni yangilash kalitni almashtirishi shart emas; CA va servis kalitlari himoyalanadi, almashtirish jadvali alohida yuritiladi.
- Sertifikat tekshiruvini o'zingiz yozmang, sinalgan kutubxona va platforma xizmatlaridan foydalaning; siyosatni (nom, maqsad, bekor qilish) sozlang va sinang.
