---
n: 18
slug: https-amaliyotda
title: "HTTPS amaliyotda: TLS sozlamalari, sertifikat va mixed content"
summary: "TLS versiyasi va cipher tanlovi, sertifikatni tekshirishning uch sharti (zanjir, muddat, host nomi), wildcard sertifikat xavfi, Node.js'da tekshiruvni o'chirish xatosi, mixed content va HTTPS joriy qilish ro'yxati."
duration: 40
sources:
  - id: rfc8446
    note: "TLS 1.3 spetsifikatsiyasi: protokol versiyasi, forward secrecy va handshake'ning umumiy maqsadi (batafsil 65-darsda)"
  - id: rfc6797
    note: "HSTS: HTTPS'ni majburlash va sertifikat xatosini chetlab o'tishni taqiqlash"
  - id: rfc5280
    note: "X.509 sertifikat profili: amal qilish muddati (notBefore, notAfter) va subjectAltName maydoni"
  - id: t10-a04
    note: "A04:2025 Cryptographic Failures: shifrlashsiz uzatish va eskirgan protokollar kategoriya doirasida"
quiz:
  - q: "Mijoz kodida `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'` o'rnatilgan, chunki test serverining sertifikati o'z-o'zidan imzolangan. Production'da shu qoldi. Nima bo'ladi?"
    options:
      - "Hech narsa: shifrlash saqlanadi, shuning uchun xavfsiz"
      - "Sertifikat tekshiruvi o'chadi: tarmoqdagi hujumchi o'zining sertifikati bilan serverni almashtirib trafikni ko'rishi va o'zgartirishi mumkin"
      - "Faqat sekinlashadi"
      - "Node.js bu o'zgaruvchini e'tiborsiz qoldiradi"
    answer: 1
    explain: "Node.js hujjati: qiymat '0' bo'lsa sertifikat validatsiyasi o'chadi, bu TLS va HTTPS'ni xavfsiz qilmaydi va ishlatish qat'iy tavsiya etilmaydi. Shifrlash bor, lekin kim bilan gaplashayotganingiz tekshirilmaydi, shuning uchun o'rtadagi hujumchi ham 'server' bo'la oladi."
  - q: "Sertifikat tekshiruvining uchta sharti qaysi?"
    options:
      - "Ishonchli CA zanjiri, amal qilish muddati, host nomi sertifikatdagi nomga mos"
      - "Faqat CA zanjiri va kalit uzunligi"
      - "Host nomi va IP manzil mosligi"
      - "Faqat muddat va imzo algoritmi nomi"
    answer: 0
    explain: "Brauzer va Node.js zanjirni ishonchli ildizgacha tekshiradi, muddatni (notBefore/notAfter) va hostni subjectAltName'dagi nomlar bilan solishtiradi. Birini o'tkazib yuborish boshqa domen uchun berilgan to'g'ri sertifikat bilan o'rtadagi hujumni mumkin qiladi."
  - q: "`*.fleet.example` wildcard sertifikat qaysi hostga mos kelishi kerak?"
    options:
      - "fleet.example va a.b.fleet.example"
      - "Faqat a.b.fleet.example"
      - "Hamma subdomen, har qanday chuqurlikda"
      - "app.fleet.example (bitta yorliq), lekin fleet.example yoki a.b.fleet.example emas"
    answer: 3
    explain: "Wildcard odatda faqat eng chap yorliqni almashtiradi: bitta yorliq. Apex domen (fleet.example) va ko'p yorliqli nomlar mos emas. Bu umumiy qabul qilingan qoida (RFC 6125); soddalashtirilgan 'endsWith' tekshiruvi uni buzadi."
  - q: "HTTPS sahifa `<script src=\"http://cdn.fleet.example/lib.js\">` yuklamoqchi. Brauzer nima qiladi (MDN bo'yicha)?"
    options:
      - "Sahifani HTTP'ga o'tkazadi"
      - "Skriptni bloklaydi: skript upgradable emas, blockable mixed content"
      - "Skriptni https'ga avtomatik yangilaydi"
      - "Ogohlantirish ko'rsatadi va yuklaydi"
    answer: 1
    explain: "Brauzerlar rasm, video va audio so'rovlarini https'ga avtomatik yangilaydi, qolgan resurs turlarini (skript, stylesheet, iframe, fetch) bloklaydi. Skriptni yuklash sahifani butunlay o'zgartirishga imkon berardi."
  - q: "Server TLS 1.0 va TLS 1.1 ni 'eski mijozlar uchun' yoqib qo'ygan. OWASP TLS Cheat Sheet nima deydi?"
    options:
      - "Ruxsat etiladi, agar 1.3 ham yoqilgan bo'lsa"
      - "Faqat TLS 1.0 yoqilishi mumkin"
      - "Ular rasman eskirgan (RFC 8996) va o'chirilishi kerak; eski mijoz zarur bo'lsa, ularni alohida endpoint'da ajrating"
      - "Bu faqat PCI DSS talabi, xavfsizlik uchun ahamiyatsiz"
    answer: 2
    explain: "Cheat sheet TLS 1.3 ni standart qilishni, 1.2 ni moslik uchun qoldirishni, 1.0 va 1.1 ni o'chirishni aytadi; eski mijoz biznes talabi bo'lsa, ularni sezgir ma'lumotsiz alohida endpoint'da ushlash tavsiya etiladi."
  - q: "Nima uchun `Secure` cookie atributi server faqat HTTPS'da tinglasa ham kerak?"
    options:
      - "Kerak emas: server HTTP'ni tinglamasa cookie yuborilmaydi"
      - "Cookie hajmini kamaytiradi"
      - "Hujumchi foydalanuvchini soxta HTTP serverga yo'naltirib, brauzer cookie'ni ochiq yuborishiga erishishi mumkin"
      - "Faqat eski brauzerlar uchun"
    answer: 2
    explain: "OWASP cheat sheet: faol o'rtadagi hujumchi foydalanuvchini HTTP orqali soxta serverga olib borsa, Secure bo'lmagan cookie ochiq yuboriladi, server HTTP'ni tinglamasa ham. Secure brauzerga cookie'ni faqat HTTPS bilan yuborishni buyuradi."
task:
  title: "Sertifikatni to'g'ri tekshirish"
  prompt: |
    `verifyCert(c, host, now)` serverning sertifikatini tekshiradi. Hozir u faqat zanjirni tekshiradi, muddat va host nomiga qaramaydi.

    Funksiyani tuzating:

    1. `chainTrusted` yolg'on bo'lsa `"rad"`.
    2. `now` `notBefore` dan oldin yoki `notAfter` dan keyin bo'lsa `"rad"`.
    3. Host `sans` ro'yxatidagi biror nomga mos kelmasa `"rad"`. Nom aniq teng yoki `*.` bilan boshlansa, wildcard faqat bitta yorliqni almashtiradi (`app.fleet.example` mos, `fleet.example` va `a.b.fleet.example` mos emas). Katta-kichik harf farqi yo'q.
    4. Hammasi o'tsa `"qabul"`.
    5. Imzoni o'zgartirmang. Oxirgi oltita `console.log` natijasi: `qabul`, `qabul`, `rad`, `rad`, `rad`, `rad`.
  lang: ts
  starter: |
    type Cert = { sans: string[]; notBefore: number; notAfter: number; chainTrusted: boolean };

    // ZAIF: faqat zanjirga qaraydi
    function verifyCert(c: Cert, host: string, now: number): string {
      return c.chainTrusted ? "qabul" : "rad";
    }

    const good: Cert = { sans: ["*.fleet.example"], notBefore: 100, notAfter: 200, chainTrusted: true };
    console.log(verifyCert(good, "app.fleet.example", 150));
    console.log(verifyCert({ ...good, sans: ["fleet.example", "WWW.fleet.example"] }, "www.FLEET.example", 150));
    console.log(verifyCert(good, "fleet.example", 150));
    console.log(verifyCert(good, "a.b.fleet.example", 150));
    console.log(verifyCert(good, "app.fleet.example", 300));
    console.log(verifyCert({ ...good, sans: ["evil.example"] }, "app.fleet.example", 150));
  solution: |
    type Cert = { sans: string[]; notBefore: number; notAfter: number; chainTrusted: boolean };

    function nameMatches(pattern: string, host: string): boolean {
      const p = pattern.toLowerCase();
      const h = host.toLowerCase();
      if (!p.startsWith("*.")) return p === h;
      const rest = p.slice(1);
      if (!h.endsWith(rest)) return false;
      const label = h.slice(0, h.length - rest.length);
      return label.length > 0 && !label.includes(".");
    }

    function verifyCert(c: Cert, host: string, now: number): string {
      if (!c.chainTrusted) return "rad";
      if (now < c.notBefore || now > c.notAfter) return "rad";
      if (!c.sans.some((s) => nameMatches(s, host))) return "rad";
      return "qabul";
    }

    const good: Cert = { sans: ["*.fleet.example"], notBefore: 100, notAfter: 200, chainTrusted: true };
    console.log(verifyCert(good, "app.fleet.example", 150));
    console.log(verifyCert({ ...good, sans: ["fleet.example", "WWW.fleet.example"] }, "www.FLEET.example", 150));
    console.log(verifyCert(good, "fleet.example", 150));
    console.log(verifyCert(good, "a.b.fleet.example", 150));
    console.log(verifyCert(good, "app.fleet.example", 300));
    console.log(verifyCert({ ...good, sans: ["evil.example"] }, "app.fleet.example", 150));
  solutionNotes: |
    - Uchala tekshiruv alohida: zanjir, muddat va host. Birortasi o'tkazib yuborilsa, boshqa domen uchun berilgan to'g'ri sertifikat bilan o'rtadagi hujum mumkin.
    - Wildcard bitta yorliqni almashtiradi; `endsWith(".fleet.example")` kabi satr tekshiruvi `a.b.fleet.example` ni ham o'tkazadi.
    - Bu o'quv modeli: haqiqiy tekshiruvni TLS kutubxonasi bajaradi, uni o'zingiz yozmang. Node.js'da `rejectUnauthorized` ni o'chirmang.
    - Qoldiq risk: bu model sertifikat bekor qilinishini (revocation) va CA'ning buzilishini ko'rmaydi. Certificate Transparency va CAA yozuvlari qo'shimcha nazoratlar.
    - Host nomini SAN'dan tekshiring; eski commonName'ga tayanmang (OWASP cheat sheet: zamonaviy brauzerlar CN'ni e'tiborsiz qoldiradi).
  checklist:
    - "Ishonchsiz zanjir, muddati o'tgan sertifikat va begona host rad etiladi"
    - "Wildcard faqat bitta yorliqni qoplaydi"
    - "Katta-kichik harf farqi inobatga olinmaydi"
    - "Imzo o'zgarmagan"
    - "Tekshiruvni kutubxonaga topshirish kerakligini ayta olasiz"
---

## Muammo

"Saytda HTTPS bor" jumlasi uch xil ma'noga ega bo'lishi mumkin: brauzer qulf belgisini ko'rsatadi; server TLS'ni to'g'ri sozlagan; ilova ichidagi barcha so'rovlar (mijoz kodi, mikroservislar, webhook'lar) sertifikatni haqiqatan tekshiradi. Birinchisi eng ko'rinadigani, ikkinchi va uchinchisi esa hujum ko'pincha o'tadigan joy. Production'dagi tipik muammolar: eski TLS versiyalari yoqib qo'yilgan, sertifikat muddati tugab sayt ishdan chiqadi (va jamoa panikaga tushib tekshiruvni o'chiradi), mijoz kodida `rejectUnauthorized: false` "vaqtincha" qolib ketadi, HTTPS sahifada `http://` resurslar yuklanadi, cookie'da `Secure` yo'q.

OWASP Top 10:2025 da A04 Cryptographic Failures kategoriyasi shifrlashsiz uzatish, eskirgan protokollar va noto'g'ri sertifikat tekshiruvini o'z ichiga oladi. TLS 1.3 handshake va PKI mexanizmining ichki tuzilishi 65-66-darslarda; bu yerda dasturchi uchun amaliy tomon: qaysi versiya, qaysi sozlama, qanday xatolar, va sertifikat tekshiruvi aniq nimani tekshiradi.

HTTPS uchta narsani kafolatlaydi: maxfiylik (tinglovchi mazmunni ko'rmaydi), yaxlitlik (o'zgartirish sezilib qoladi) va server autentifikatsiyasi (siz aynan kerakli server bilan gaplashayotganingizni). Uchinchisi eng ko'p unutiladigani. Shifrlangan kanal noto'g'ri server bilan bo'lsa, foydasiz: hujumchi sizning nomingizdan "xavfsiz" kanal ochadi. Shu sababli sertifikat tekshiruvi TLS'ning ixtiyoriy emas, asosiy qismi.

## Asosiy g'oya

### Versiya va cipher

OWASP Transport Layer Security Cheat Sheet qoidasi aniq: ilova standart holda TLS 1.3 ni ishlatishi, moslik uchun TLS 1.2 ni qoldirishi mumkin; TLS 1.0 va 1.1 rasman eskirgan (RFC 8996, 2021-yil mart) va o'chirilishi kerak; SSLv2 va SSLv3 doim o'chiq. Eski mijoz biznes talabi bo'lsa, ularni sezgir ma'lumotsiz alohida endpoint'ga ajratish, asosiy endpoint'ni zaiflashtirmaslik tavsiya etiladi.

Cipher bo'yicha: TLS 1.3 da standart AEAD suite'lar (AES-GCM, ChaCha20-Poly1305). TLS 1.2 da ham AEAD asosidagilarni tanlang, CBC rejimidan qoching, RSA kalit transporti (`TLS_RSA_*`) va statik Diffie-Hellman'ni o'chiring: ular forward secrecy bermaydi. Node.js hujjatida: TLS 1.2 gacha mukammal forward secrecy ixtiyoriy edi, TLS 1.3 dan boshlab (EC)DHE majburiy. TLS siqish (compression) CRIME hujumi sababli o'chiriladi; TLS 1.3 da u yo'q. Node.js'da `tls.DEFAULT_MIN_VERSION` standart `TLSv1.2` (`--tls-min-v1.3` bayrog'i bilan 1.3 ga ko'tarish mumkin). Konfiguratsiyani qo'lda yig'ishdan ko'ra, OWASP cheat sheet tavsiya qilgan Mozilla generatoridan yoki platformaning (yuklama balanser, CDN) tayyor siyosatidan foydalaning.

### Sertifikat nimani tasdiqlaydi

Sertifikat (RFC 5280 X.509 profili) kalit va nom bog'lanishini ishonchli CA imzosi bilan tasdiqlaydi. Mijoz uchta narsani tekshiradi:

1. **Zanjir**: sertifikat ishonchli ildiz CA gacha imzolar zanjiri orqali tasdiqlanadi.
2. **Muddat**: joriy vaqt `notBefore` va `notAfter` oralig'ida.
3. **Nom**: so'ralgan host sertifikatdagi `subjectAltName` (SAN) nomlaridan biriga mos. OWASP cheat sheet: zamonaviy brauzerlar commonName'ni e'tiborsiz qoldiradi va to'liq nomni SAN'da talab qiladi.

Birini tashlab ketish o'rtadagi hujumga eshik ochadi. Misol: nom tekshirilmasa, hujumchi o'z domeni uchun (to'g'ri olingan) sertifikatni sizning domeningiz o'rniga ko'rsatadi, zanjir ham, muddat ham to'g'ri, lekin sertifikat sizniki emas. Quyidagi `run` bloki wildcard moslashtirishini ko'rsatadi: wildcard faqat bitta yorliqni almashtiradi (bu umumiy qabul qilingan qoida, RFC 6125; manbalar ro'yxatimizda yo'q).

```ts run
type Cert = { sans: string[]; notBefore: number; notAfter: number; chainTrusted: boolean };

// Wildcard faqat eng chap yorliqni almashtiradi: *.fleet.example -> bir yorliq + .fleet.example
function nameMatches(pattern: string, host: string): boolean {
  const p = pattern.toLowerCase(), h = host.toLowerCase();
  if (!p.startsWith("*.")) return p === h;
  const rest = p.slice(1); // ".fleet.example"
  if (!h.endsWith(rest)) return false;
  const label = h.slice(0, h.length - rest.length);
  return label.length > 0 && !label.includes(".");
}

function verifyCert(c: Cert, host: string, now: number): string {
  if (!c.chainTrusted) return "rad: ishonchsiz zanjir";
  if (now < c.notBefore || now > c.notAfter) return "rad: muddati o'tgan yoki hali boshlanmagan";
  if (!c.sans.some((s) => nameMatches(s, host))) return "rad: host sertifikat nomiga mos emas";
  return "qabul";
}

const good: Cert = { sans: ["*.fleet.example"], notBefore: 100, notAfter: 200, chainTrusted: true };
for (const h of ["app.fleet.example", "fleet.example", "a.b.fleet.example", "APP.Fleet.Example", ".fleet.example"]) {
  console.log(h.padEnd(20), nameMatches("*.fleet.example", h));
}
```

```text
app.fleet.example    true
fleet.example        false
a.b.fleet.example    false
APP.Fleet.Example    true
.fleet.example       false
```

### Wildcard sertifikatlar

OWASP cheat sheet wildcard sertifikatni least privilege tamoyilini buzadigan tanlov deb ataydi: bitta kalit hamma subdomen uchun amal qiladi, kalit ko'p tizimda bo'lsa, sizib chiqish ehtimoli oshadi. Tavsiyalar: faqat haqiqiy ehtiyojda ishlating, turli ishonch darajasidagi tizimlar (ommaviy veb-server va ichki server) bitta wildcard'ni ulashmasin, kalit bitta joyda (masalan, TLS tugatuvchi reverse proxy'da) turishi afzal, ACME orqali avtomatik yangilanadigan alohida sertifikatlar esa yaxshiroq alternativa. CAA DNS yozuvlari qaysi CA domen uchun sertifikat bera olishini cheklaydi.

## Chuqurroq: xatolar va mixed content

### Tekshiruvni o'chirish

Node.js hujjati `NODE_TLS_REJECT_UNAUTHORIZED=0` haqida aniq: qiymat `'0'` bo'lsa, TLS ulanishlarida sertifikat validatsiyasi o'chadi, bu TLS va HTTPS'ni xavfsiz qilmaydi, ishlatish qat'iy tavsiya etilmaydi. Xuddi shu ta'sir `https.Agent({ rejectUnauthorized: false })` yoki `axios` / `fetch` sozlamalarida. Odatiy hikoya: staging'da o'z-o'zidan imzolangan sertifikat bor, dasturchi tekshiruvni o'chiradi, o'zgartirish production'ga ham tushadi. To'g'ri yo'l: staging uchun ichki CA yaratib, uning ildizini `NODE_EXTRA_CA_CERTS` yoki `ca` opsiyasi bilan ishonchli qiling (aniq opsiya nomini o'rnatilgan versiya hujjatidan tekshiring), tekshiruvni esa hech qachon o'chirmang.

### Mixed content

HTTPS sahifa `http://` resurs yuklasa, bu resurs tarmoqda o'zgartirilishi mumkin va shifrlangan sahifaning bir qismi ochiq bo'lib qoladi. MDN bo'yicha brauzerlar rasm, video va audio so'rovlarini `http` dan `https` ga avtomatik yangilaydi (upgradable), qolgan hamma resursni (skript, stylesheet, iframe, fetch) bloklaydi (blockable); host IP manzil bo'lsa yangilash ham ishlamaydi va so'rov bloklanadi. Eski ikki toifa nomi (aktiv va passiv mixed content) ham uchraydi: skript va stylesheet aktiv, ya'ni sahifani o'zgartira oladi, shuning uchun majburiy bloklanadi.

```ts run
type Kind = "img" | "audio" | "video" | "script" | "stylesheet" | "iframe" | "fetch";
const UPGRADABLE = new Set<Kind>(["img", "audio", "video"]);

// HTTPS sahifadagi http:// resurs uchun brauzer qarori (MDN modeli, soddalashtirilgan)
function mixedContent(kind: Kind, url: string): string {
  const u = new URL(url);
  if (u.protocol !== "http:") return "oddiy (HTTPS)";
  const isIp = /^[\d.]+$/.test(u.hostname) || u.hostname.startsWith("[");
  if (UPGRADABLE.has(kind) && !isIp) return "https ga yangilanadi";
  return "bloklanadi";
}

const page: [Kind, string][] = [
  ["img", "http://cdn.fleet.example/logo.png"],
  ["script", "http://cdn.fleet.example/lib.js"],
  ["fetch", "http://api.fleet.example/vehicles"],
  ["img", "http://203.0.113.5/logo.png"],
  ["script", "https://cdn.fleet.example/lib.js"],
];
for (const [k, u] of page) console.log(k.padEnd(7), u.padEnd(36), mixedContent(k, u));
```

```text
img     http://cdn.fleet.example/logo.png    https ga yangilanadi
script  http://cdn.fleet.example/lib.js      bloklanadi
fetch   http://api.fleet.example/vehicles    bloklanadi
img     http://203.0.113.5/logo.png          bloklanadi
script  https://cdn.fleet.example/lib.js     oddiy (HTTPS)
```

Mixed content'ga umidvor bo'lmang: `upgrade-insecure-requests` CSP direktivasi (15-dars) va HSTS (16-dars) birgalikda ishlatiladi, lekin birlamchi chora manbadagi `http://` URL'larni topib to'g'rilash.

### HTTPS joriy qilish ro'yxati

OWASP cheat sheet asosida: butun saytda TLS (faqat login sahifasi emas), HTTP faqat 301 redirect uchun (foydalanuvchi manzilni qo'lda yozganda), keyin HSTS; API-only endpoint'larda HTTP umuman o'chiq yoki HTTP so'rovga redirect emas, xato qaytsin; barcha cookie'larda `Secure`; mixed content yo'q; sertifikat uchun kamida 2048 bitli RSA (yoki zamonaviy EC kalit) va SHA-256, kalit fayl tizimida ruxsatlar bilan himoyalangan; sertifikat yangilash avtomatlashtirilgan (ACME) va muddat tugashi monitoring qilinadi.

## Misol: noto'g'ri host uchun to'g'ri sertifikat

Quyida mijoz sertifikatni qanday tekshirishini model qilamiz. Hammasi o'quv kodi.

### 1. Zaif kod

```ts run
type Cert = { sans: string[]; notBefore: number; notAfter: number; chainTrusted: boolean };

// Wildcard faqat eng chap yorliqni almashtiradi: *.fleet.example -> bir yorliq + .fleet.example
function nameMatches(pattern: string, host: string): boolean {
  const p = pattern.toLowerCase(), h = host.toLowerCase();
  if (!p.startsWith("*.")) return p === h;
  const rest = p.slice(1); // ".fleet.example"
  if (!h.endsWith(rest)) return false;
  const label = h.slice(0, h.length - rest.length);
  return label.length > 0 && !label.includes(".");
}

function verifyCert(c: Cert, host: string, now: number): string {
  if (!c.chainTrusted) return "rad: ishonchsiz zanjir";
  if (now < c.notBefore || now > c.notAfter) return "rad: muddati o'tgan yoki hali boshlanmagan";
  if (!c.sans.some((s) => nameMatches(s, host))) return "rad: host sertifikat nomiga mos emas";
  return "qabul";
}

// ZAIF: faqat zanjirni tekshiradi (rejectUnauthorized: false ning ichki ma'nosiga yaqin)
function verifyWeak(c: Cert, _host: string, _now: number): string {
  return c.chainTrusted ? "qabul" : "rad: ishonchsiz zanjir";
}

const real: Cert = { sans: ["*.fleet.example"], notBefore: 100, notAfter: 200, chainTrusted: true };
console.log("haqiqiy server:", verifyWeak(real, "api.fleet.example", 150));
```

```text
haqiqiy server: qabul
```

### 2. Hujum

Ochiq tarmoqdagi hujumchi trafikni o'z serveriga yo'naltiradi. U `evil.example` uchun CA'dan to'g'ri sertifikat olgan (bu oddiy va arzon). Sertifikat zanjiri to'g'ri, muddati to'g'ri, lekin nomi boshqa:

```ts run
type Cert = { sans: string[]; notBefore: number; notAfter: number; chainTrusted: boolean };

// Wildcard faqat eng chap yorliqni almashtiradi: *.fleet.example -> bir yorliq + .fleet.example
function nameMatches(pattern: string, host: string): boolean {
  const p = pattern.toLowerCase(), h = host.toLowerCase();
  if (!p.startsWith("*.")) return p === h;
  const rest = p.slice(1); // ".fleet.example"
  if (!h.endsWith(rest)) return false;
  const label = h.slice(0, h.length - rest.length);
  return label.length > 0 && !label.includes(".");
}

function verifyCert(c: Cert, host: string, now: number): string {
  if (!c.chainTrusted) return "rad: ishonchsiz zanjir";
  if (now < c.notBefore || now > c.notAfter) return "rad: muddati o'tgan yoki hali boshlanmagan";
  if (!c.sans.some((s) => nameMatches(s, host))) return "rad: host sertifikat nomiga mos emas";
  return "qabul";
}

function verifyWeak(c: Cert, _host: string, _now: number): string {
  return c.chainTrusted ? "qabul" : "rad: ishonchsiz zanjir";
}

const attacker: Cert = { sans: ["evil.example"], notBefore: 100, notAfter: 200, chainTrusted: true };
const expired: Cert = { sans: ["*.fleet.example"], notBefore: 0, notAfter: 50, chainTrusted: true };
console.log("begona domen sertifikati:", verifyWeak(attacker, "api.fleet.example", 150));
console.log("muddati o'tgan sertifikat:", verifyWeak(expired, "api.fleet.example", 150));
```

```text
begona domen sertifikati: qabul
muddati o'tgan sertifikat: qabul
```

Mijoz hujumchi serveri bilan "xavfsiz" kanal ochdi: so'rovlar, cookie va tokenlar hujumchiga ochiq.

### 3. Tuzatilgan kod

```ts run
type Cert = { sans: string[]; notBefore: number; notAfter: number; chainTrusted: boolean };

// Wildcard faqat eng chap yorliqni almashtiradi: *.fleet.example -> bir yorliq + .fleet.example
function nameMatches(pattern: string, host: string): boolean {
  const p = pattern.toLowerCase(), h = host.toLowerCase();
  if (!p.startsWith("*.")) return p === h;
  const rest = p.slice(1); // ".fleet.example"
  if (!h.endsWith(rest)) return false;
  const label = h.slice(0, h.length - rest.length);
  return label.length > 0 && !label.includes(".");
}

function verifyCert(c: Cert, host: string, now: number): string {
  if (!c.chainTrusted) return "rad: ishonchsiz zanjir";
  if (now < c.notBefore || now > c.notAfter) return "rad: muddati o'tgan yoki hali boshlanmagan";
  if (!c.sans.some((s) => nameMatches(s, host))) return "rad: host sertifikat nomiga mos emas";
  return "qabul";
}

const real: Cert = { sans: ["*.fleet.example"], notBefore: 100, notAfter: 200, chainTrusted: true };
const attacker: Cert = { sans: ["evil.example"], notBefore: 100, notAfter: 200, chainTrusted: true };
const expired: Cert = { ...real, notBefore: 0, notAfter: 50 };

console.log("haqiqiy server:", verifyCert(real, "api.fleet.example", 150));
console.log("begona domen:", verifyCert(attacker, "api.fleet.example", 150));
console.log("muddati o'tgan:", verifyCert(expired, "api.fleet.example", 150));
console.log("apex domen:", verifyCert(real, "fleet.example", 150));
console.log("ko'p yorliq:", verifyCert(real, "a.b.fleet.example", 150));
```

```text
haqiqiy server: qabul
begona domen: rad: host sertifikat nomiga mos emas
muddati o'tgan: rad: muddati o'tgan yoki hali boshlanmagan
apex domen: rad: host sertifikat nomiga mos emas
ko'p yorliq: rad: host sertifikat nomiga mos emas
```

Tuzatish nima uchun yetarli. Invariant: kanal faqat shu host uchun, shu vaqtda, ishonchli CA tomonidan berilgan sertifikatga ega serverga ochiladi. Ko'rsatilgan to'rtta holat (begona domen, muddati o'tgan, apex va ko'p yorliqli nom) rad etildi.

Yopilmagani. Bu model sertifikat bekor qilinishini (revocation) ko'rmaydi; CA yoki uning kaliti buzilsa, to'g'ri imzolangan soxta sertifikat o'tadi (Certificate Transparency monitoringi va CAA bunga qarshi qo'shimcha nazorat). Haqiqiy kodda tekshiruvni o'zingiz yozmang: TLS kutubxonasi buni to'liqroq qiladi, siz uni o'chirib qo'ymang.

## Qachon qo'llamaslik kerak

- Hamma xavfsizlik sozlamasi bir xil darajada kerak emas. Faqat ichki, izolyatsiyalangan tarmoqdagi servislar orasida mTLS va ichki CA (66-dars) ko'proq mantiqli, ommaviy CA va wildcard emas.
- HSTS bilan birga `includeSubDomains` va preload'ni barcha subdomenlar HTTPS'da ekani aniq bo'lmaguncha yoqmang (16-dars).
- TLS 1.3 ni yagona versiya qilish ayrim eski mijozlarni (eski Android, korporativ proxy'lar, IoT qurilmalari) uzib qo'yishi mumkin. Avtopark platformasida eski GPS trekerlar shu toifaga kirishi mumkin. Variant: ularni alohida endpoint'da TLS 1.2 bilan ushlash, asosiy endpoint'ni zaiflashtirmasdan (cheat sheet tavsiyasi).
- Qisqa muddatli sertifikat va avtomatik yangilash ishonchli avtomatlashtirish va monitoringsiz xavf tug'diradi: yangilash jimgina to'xtasa, sayt muddat tugagach ishdan chiqadi. Muddat tugashi haqida ogohlantirish kerak.
- Sertifikatni mijozga "pin" qilish (qat'iy bog'lash) mobil ilovada kuchli, lekin sertifikat almashtirilganda ilovani sindiradi; brauzer ilovalari uchun amaliy emas.

## Stack'da: Node.js, Nginx va Next.js

Odatda TLS ilovada emas, reverse proxy yoki yuklama balanserda tugatiladi (System Design kursining infratuzilma moduli). Ilova darajasida sizning vazifangiz: chiquvchi ulanishlarda tekshiruvni o'chirmaslik, proxy ortida `Secure` cookie va HTTPS'ni to'g'ri aniqlash (11-dars: `trustProxy`), hamda xususiy CA ishlatilsa uni ishonchli ro'yxatga qo'shish. Quyidagi kod ishga tushirilmaydi (tarmoq va fayl kerak), sintaksis jihatidan to'g'ri TypeScript.

```ts
import https from "node:https";
import { readFileSync } from "node:fs";

// Ichki CA bilan tekshiriladigan mijoz: rejectUnauthorized o'chirilmaydi
const agent = new https.Agent({
  ca: readFileSync("/etc/fleet/internal-ca.pem"),
  minVersion: "TLSv1.2",
  // rejectUnauthorized: true  (standart; false qilmang)
});

export function callInternal(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get({ host: "telemetry.internal.fleet.example", path, agent }, (res) => {
        let body = "";
        res.on("data", (d) => (body += d));
        res.on("end", () => resolve(body));
      })
      .on("error", reject);
  });
}
```

Node.js hujjatida `tls.DEFAULT_MIN_VERSION` va `minVersion` opsiyasi bor; aniq opsiya nomlari versiyaga qarab o'zgarishi mumkin, o'rnatilgan versiya hujjatini tekshiring. Next.js'da HTTPS odatda hosting platformasi yoki proxy ta'minlaydi; ilova kodida faqat HSTS va cookie atributlarini sozlaysiz (13, 16-darslar).

## Xulosa

- HTTPS uch narsani beradi: maxfiylik, yaxlitlik va server autentifikatsiyasi. Uchinchisi sertifikatni haqiqatan tekshirish bilan ta'minlanadi.
- Versiya: TLS 1.3 standart, 1.2 moslik uchun, 1.0/1.1 va SSL o'chiq. AEAD cipher va forward secrecy beruvchi key exchange tanlang.
- Sertifikat tekshiruvi uch shartdan iborat: ishonchli zanjir, amal qilish muddati, host nomi SAN'ga mos. Birini tashlash o'rtadagi hujumga eshik ochadi.
- `NODE_TLS_REJECT_UNAUTHORIZED=0` va `rejectUnauthorized: false` hech qachon production'da bo'lmasin; staging uchun ichki CA ishlating.
- Wildcard sertifikat least privilege'ni buzadi: faqat zarurda va bir xil ishonch darajasidagi tizimlar uchun.
- Mixed content: brauzer rasm/video/audio'ni yangilaydi, qolganini bloklaydi; manbadagi `http://` ni to'g'rilang. Cookie'larga `Secure` qo'ying, HSTS va CSP bilan to'ldiring.
