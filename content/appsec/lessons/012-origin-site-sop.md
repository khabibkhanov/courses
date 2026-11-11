---
n: 12
slug: origin-site-sop
title: "Origin, site va same-origin policy"
summary: "Origin (scheme, host, port) va site tushunchalarining farqi, same-origin policy nimani cheklashi va nimani cheklamasligi, origin'ni matn sifatida solishtirish xatosi (endsWith, includes) va uning URL tahlili bilan tuzatilishi."
duration: 40
sources:
  - id: mdn-sop
    note: "Same-origin policy sahifasi: origin ta'rifi (sxema, port, host), cross-origin yozish, joylash va o'qish o'rtasidagi farq, document.domain'ning eskirgani, storage origin bo'yicha ajratilishi, cookie esa boshqacha ta'rifdan foydalanishi"
  - id: whatwg-html
    note: "HTML Standard: origin, site va same site tushunchalari, opaque origin"
  - id: whatwg-fetch
    note: "Fetch Standard: Origin header'i va cross-origin so'rovlar qanday ishlashi"
  - id: nextjs-data-security
    note: "Server Actions Origin header'ini Host (yoki X-Forwarded-Host) bilan solishtiradi; serverActions.allowedOrigins qo'shimcha xavfsiz hostlar ro'yxati"
quiz:
  - q: "`https://app.fleet.example` va `https://api.fleet.example` orasidagi munosabat qaysi?"
    options:
      - "Same-origin: domen bir xil"
      - "Cross-origin, lekin same-site"
      - "Cross-origin va cross-site"
      - "Same-site va same-origin, chunki ikkalasi https"
    answer: 1
    explain: "Origin scheme, host va port uchligi; host turlicha bo'lgani uchun origin boshqa. Site esa scheme va ro'yxatdan o'tgan domenga (fleet.example) qaraydi, shuning uchun ikkalasi same-site. Same-site shartiga subdomen farqi ta'sir qilmaydi."
  - q: "Tashqi domendagi sahifa sizning ilovangizga `<img src=\"https://app.fleet.example/api/vehicles/1/photo\">` yozdi. Same-origin policy nimani to'xtatadi?"
    options:
      - "So'rovning yuborilishini, shuning uchun server hech narsa ko'rmaydi"
      - "Rasm yuklanishini, chunki cross-origin embed taqiqlangan"
      - "Hech narsani: rasm ko'rsatiladi, lekin sahifa skripti rasm baytlarini o'qiy olmaydi"
      - "Cookie yuborilishini har doim"
    answer: 2
    explain: "SOP asosan cross-origin o'qishni cheklaydi. So'rov yuboriladi va resurs joylanadi (img, script, css), lekin skript javob mazmunini ko'ra olmaydi. Shuning uchun yon ta'sirli GET va POST'lar alohida himoya talab qiladi (CSRF, 36-dars). Cookie yuborilishi cookie atributlariga bog'liq (13-dars)."
  - q: "`isTrusted(origin) = origin.endsWith(\"fleet.example\")`. Quyidagilardan qaysi biri fleet.example bilan hech bog'liq bo'lmagan, hujumchi ro'yxatdan o'tkazishi mumkin bo'lgan domendan keladi, lekin tekshiruvdan o'tadi?"
    options:
      - "https://alfa.fleet.example"
      - "https://evil-fleet.example"
      - "https://fleet.example"
      - "http://fleet.example"
    answer: 1
    explain: "`evil-fleet.example` satri `fleet.example` bilan tugaydi, garchi bu boshqa ro'yxatdan o'tgan domen bo'lsa-da (hujumchi uni ro'yxatdan o'tkazadi). Qolgan uchtasi nomga qarab ishonchli ko'rinadi, lekin `http://` varianti sxemani tekshirmagani uchun alohida xato. To'g'ri tuzatish: URL tahlil qilib, hostni nuqta bilan solishtirish."
  - q: "Ilova `origin.includes(\"fleet.example\")` bilan CORS ruxsatini beradi. Hujumchi domeni `fleet.example.evil.test` bu tekshiruvdan o'tadimi va nega?"
    options:
      - "Yo'q, chunki TLD boshqa"
      - "Yo'q, chunki brauzer Origin'ni to'g'ri yuboradi"
      - "Ha, lekin faqat hujumchi sertifikat olsa"
      - "Ha, chunki `includes` satr ichida istalgan joyda qidiradi, hostning tuzilishini hisobga olmaydi"
    answer: 3
    explain: "Brauzer Origin'ni to'g'ri yuboradi, lekin ilova uni satr sifatida solishtiradi. `fleet.example.evil.test` ichida kerakli bo'lak bor, shuning uchun o'tadi. Sertifikat bu mantiqqa aloqasiz (u ikkinchi qatlam). Himoya: aniq origin ro'yxati yoki tahlil qilingan host bo'yicha solishtirish."
  - q: "`new URL(\"https://fleet.example:443/x\").origin` va `new URL(\"https://fleet.example/y\").origin` qiymatlari haqida qaysi gap to'g'ri?"
    options:
      - "Teng: standart port origin satridan tushiriladi"
      - "Teng emas: port yozilgan"
      - "Ikkalasi ham `null`"
      - "Birinchisi xato tashlaydi"
    answer: 0
    explain: "URL tahlili sxemaning standart portini (https uchun 443) tushirib yuboradi, shuning uchun ikkala origin ham `https://fleet.example`. Shu sababli origin'ni satr sifatida emas, tahlil qilingan shaklda solishtirish xavfsizroq."
  - q: "Sahifa `sandbox` atributli iframe ichida (allow-same-origin yo'q) ochilgan. Uning origin'i haqida nima to'g'ri?"
    options:
      - "Ota-sahifa origin'i bilan bir xil"
      - "Opaque origin: Origin sarlavhasi `null` bo'lib ketadi va hech bir origin bilan same-origin emas"
      - "iframe manzilidagi origin saqlanadi"
      - "Origin yo'q, shuning uchun SOP qo'llanmaydi"
    answer: 1
    explain: "Sandbox bilan origin opaque bo'ladi: so'rovlarda Origin sifatida `null` ko'rinishi mumkin. `null` ni ishonchli ro'yxatga qo'shish xavfli, chunki bir nechta begona kontekst shu qiymatni beradi. SOP bu holatda ham qo'llanadi, hatto qat'iyroq."
task:
  title: "Origin ruxsat ro'yxatini to'g'ri solishtirish"
  prompt: |
    `isTrustedOrigin(origin)` ilovangizga ruxsat etilgan origin'larni aniqlaydi (keyinroq CORS, postMessage va redirect tekshiruvlarida ishlatiladi). Hozir u satr oxiriga qaraydi va hujumchi domenlari o'tib ketadi.

    Funksiyani tuzating:

    1. Faqat `https:` sxemasi. `http://fleet.example` rad etiladi.
    2. Origin tahlil qilinadi (`new URL`). Tahlil xatosi, yo'l (`/x`) yoki `null` rad etiladi: kirish faqat toza origin bo'lishi kerak (`url.origin === kiritilgan`).
    3. Host `fleet.example` ga teng yoki `.fleet.example` bilan tugasa (haqiqiy subdomen) ruxsat. Port standart (443) bo'lsin.
    4. Imzoni o'zgartirmang. Oxirgi beshta `console.log` kutilgan natijani chiqarsin: true, true, false, false, false.
  lang: ts
  starter: |
    // ZAIF: satr oxiri va sxema tekshirilmaydi
    function isTrustedOrigin(origin: string): boolean {
      return origin.endsWith("fleet.example");
    }

    console.log("asosiy:", isTrustedOrigin("https://fleet.example"));
    console.log("subdomen:", isTrustedOrigin("https://alfa.fleet.example"));
    console.log("o'xshash domen:", isTrustedOrigin("https://evil-fleet.example"));
    console.log("http sxema:", isTrustedOrigin("http://fleet.example"));
    console.log("null origin:", isTrustedOrigin("null"));
  solution: |
    const BASE = "fleet.example";

    function isTrustedOrigin(origin: string): boolean {
      let u: URL;
      try {
        u = new URL(origin);
      } catch {
        return false;
      }
      if (u.protocol !== "https:") return false;
      if (u.origin !== origin) return false; // yo'l, query yoki qo'shimcha belgi bo'lmasin
      return u.hostname === BASE || u.hostname.endsWith("." + BASE);
    }

    console.log("asosiy:", isTrustedOrigin("https://fleet.example"));
    console.log("subdomen:", isTrustedOrigin("https://alfa.fleet.example"));
    console.log("o'xshash domen:", isTrustedOrigin("https://evil-fleet.example"));
    console.log("http sxema:", isTrustedOrigin("http://fleet.example"));
    console.log("null origin:", isTrustedOrigin("null"));
  solutionNotes: |
    - Tahlil qilingan `URL` ishlatiladi: `hostname` va `protocol` alohida, shuning uchun `fleet.example.evil.test` yoki `evil-fleet.example` kabi yasama nomlar o'tmaydi.
    - Subdomen tekshiruvi `"." + BASE` bilan: nuqta chegarani aniq belgilaydi (`evil-fleet.example` nuqta bilan boshlanmaydi).
    - `u.origin !== origin` sxema, host, port va qo'shimcha bo'laklarni qat'iy tekshiradi. Standart port (443) origin'dan tushadi, 8443 esa `u.origin` da ko'rinadi va ro'yxat uchun alohida ruxsat talab qiladi.
    - Subdomenga umumiy ishonch ham risk: subdomen takeover (tashlab ketilgan DNS yozuvi) bo'lsa, hujumchi ishonchli subdomenga ega bo'ladi. Muhim operatsiyalar uchun aniq origin ro'yxatini ishlating.
    - Bu faqat origin'ni solishtirishni to'g'rilaydi; CORS sozlamasining o'zi 14-darsda.
  checklist:
    - "`evil-fleet.example` va `fleet.example.evil.test` rad etiladi"
    - "`http://` sxema rad etiladi"
    - "`null` va yo'lli qiymatlar rad etiladi"
    - "Haqiqiy subdomen (`alfa.fleet.example`) o'tadi"
    - "Subdomen takeover qoldiq risk ekanini ayta olasiz"
---

## Muammo

Frontend `app.fleet.example` da, API `api.fleet.example` da turibdi. Sahifa API'ga so'rov yuborganda brauzer javobni skriptga beradimi? Hujumchining `evil.example` sahifasi xuddi shu API'dan foydalanuvchi cookie'si bilan javob o'qiy oladimi? Bu savollarga javobni brauzerning bitta qoidasi hal qiladi: same-origin policy (SOP). Uni bilmasdan CORS, cookie, CSP, postMessage va CSRF mavzulari bir-biriga bog'lanmagan qoidalar to'plami bo'lib tuyuladi. Bilsangiz, ularning hammasi SOP atrofidagi istisnolar yoki ko'priklar ekani ko'rinadi.

Dasturchilar ko'p uchraydigan ikki xatoga yo'l qo'yadi. Birinchisi, SOP "boshqa domen so'rov yubora olmaydi" deb tushunish. Aslida u so'rov yuborilishini odatda to'xtatmaydi; u javobni o'qishni cheklaydi. Natijada "tashqi sahifa bizning POST endpoint'imizga so'rov yubora olmaydi" degan xato taxmin CSRF zaifligiga olib keladi. Ikkinchisi, origin va site tushunchalarini aralashtirish. `app.fleet.example` va `api.fleet.example` bir-biriga cross-origin, lekin same-site. Shu farq cookie `SameSite` atributi va CSRF himoyasi qanday ishlashini belgilaydi (13 va 36-darslar).

Uchinchi xato amaliyroq: ilova Origin header'ini ruxsat ro'yxati bilan solishtirishda satr funksiyalaridan foydalanadi (`endsWith`, `includes`, `startsWith`). Bunday tekshiruv sodda ko'rinadi va ko'p kodda uchraydi, lekin hujumchi o'zi ro'yxatdan o'tkazgan domen bilan uni aylanib o'tadi. Dars oxirida shu xatoni ishlaydigan kodda ko'rib, tuzatamiz.

## Asosiy g'oya

### Origin: scheme, host va port

MDN va HTML Standard origin'ni uchta bo'lakdan iborat deb ta'riflaydi: sxema (`https`), host (`app.fleet.example`) va port (`443`). Uchalasi mos kelsa, ikki URL same-origin. Bittasi farq qilsa cross-origin. Misol, `https://app.fleet.example/x` ga nisbatan:

| URL | Munosabat | Sabab |
|---|---|---|
| `https://app.fleet.example/y` | same-origin | faqat yo'l farqi |
| `http://app.fleet.example/x` | cross-origin | sxema boshqa |
| `https://app.fleet.example:8443/x` | cross-origin | port boshqa |
| `https://api.fleet.example/x` | cross-origin | host boshqa |

Standart port (https uchun 443, http uchun 80) odatda yozilmaydi va origin'ni solishtirishda hisobga olinmaydi: `https://fleet.example:443` va `https://fleet.example` bir origin.

Ba'zi kontekstlarda origin "opaque" bo'ladi, ya'ni hech bir origin bilan teng emas. MDN'ning `Origin` header sahifasi `null` qiymat beradigan holatlarni sanaydi (to'liq ro'yxat emas): `sandbox` iframe (`allow-same-origin`siz), `data:` URL'dan yaratilgan hujjat, `sandbox` direktivali CSP bilan berilgan hujjat. Shu kontekstlardan yuborilgan so'rovda `Origin: null` bo'lishi mumkin. Shuning uchun `null` ni ishonchli origin ro'yxatiga qo'shmang: ko'p begona kontekst shu qiymatni beradi.

### Site: ro'yxatdan o'tgan domen

Site tushunchasi kengroq: HTML Standard unda sxema va "registrable domain" (ro'yxatdan o'tkaziladigan domen) bo'lishini belgilaydi. `fleet.example` ro'yxatga olingan domen bo'lsa, `app.fleet.example` va `api.fleet.example` bir site ichida, lekin turli origin. Registrable domen Public Suffix List kabi ro'yxatlar yordamida aniqlanadi: `co.uk` kabi qo'shma suffikslarda `a.co.uk` va `b.co.uk` turli site hisoblanadi. Shu sababli site'ni oddiy "oxirgi ikki bo'lak" deb hisoblash noto'g'ri.

Qisqacha: same-origin ⊂ same-site. Origin xavfsizlik chegarasi sifatida (SOP, CORS, postMessage) ishlatiladi, site esa cookie va CSRF bilan bog'liq masalalarda (SameSite, Fetch Metadata). Ularni almashtirish tipik xato.

### SOP nimani cheklaydi

MDN SOP ostidagi o'zaro ta'sirni uch toifaga bo'ladi: cross-origin yozish (so'rov yuborish: forma yuborish, link, redirect), cross-origin joylash (embedding: `<img>`, `<script>`, `<link>`, `<iframe>`) va cross-origin o'qish. Birinchi ikkisi odatda ruxsat etilgan, uchinchisi odatda taqiqlangan. Bu dizaynning izohi tarixiy: veb sahifalar boshqa saytga havola qilib, rasm va skript ulashi mumkin bo'lishi kerak edi, lekin boshqa sayt ma'lumotini o'qish mumkin bo'lmasligi kerak edi.

Natijalar:

- Sahifa skripti `fetch("https://api.fleet.example/...")` chaqirsa, so'rov yuboriladi (cookie qoidalari doirasida), lekin javob mazmuni CORS ruxsat bermasa skriptga berilmaydi. Server esa so'rovni qabul qilib bo'lgan bo'ladi: yon ta'sir yuz beradi.
- `<script src>` cross-origin ishlaydi: yuklangan skript sizning sahifangiz kontekstida bajariladi. Shu sababli uchinchi tomon skripti to'liq ishonchni anglatadi (40-dars).
- `<img>` yuklanadi va ko'rsatiladi. MDN ta'kidlaganidek, o'qish taqiqlangan bo'lsa ham embedding ma'lumot sizdiradi: rasm o'lchamini, skript xatti-harakatini yoki resurs mavjudligini ko'rish mumkin.

## Chuqurroq: SOP nimani qilmaydi

### SOP boshqa sohalarda: window, storage va document.domain

SOP faqat `fetch` bilan cheklanmaydi. Cross-origin `iframe.contentWindow` yoki `window.opener` orqali olingan `Window` va `Location` obyektlari juda cheklangan: MDN ruxsat etilgan ro'yxatni beradi (`postMessage`, `focus`, `close`, `location` ni yozish va hokazo), qolgan hamma narsa taqiqlangan. Hujjatlar o'rtasida aloqa uchun `postMessage` ishlatiladi (39-dars). Web Storage va IndexedDB origin bo'yicha ajratilgan: har origin o'z xotirasiga ega, boshqa origin skripti uni o'qiy olmaydi. Shuning uchun `app.fleet.example` ning `localStorage` qiymatlarini `api.fleet.example` skripti ko'rmaydi (19-dars).

Cookie esa boshqacha ta'rifdan foydalanadi. MDN yozishicha, sahifa o'z domeniga yoki istalgan ota-domenga cookie qo'ya oladi (agar ota-domen public suffix bo'lmasa), va cookie'ni o'qiganda uning qayerdan qo'yilganini bilmaysiz; hatto faqat https ishlatsangiz ham ko'rgan cookie xavfsiz bo'lmagan ulanishda qo'yilgan bo'lishi mumkin. Origin chegarasi (storage uchun) va site/domen chegarasi (cookie uchun) bir-biriga mos kelmasligi ko'p xatoning manbai.

Yana bir nozik joy: `about:blank` va `javascript:` URL'laridagi skriptlar o'zini yaratgan hujjat origin'ini meros qilib oladi, `data:` URL esa yangi, bo'sh xavfsizlik kontekstini oladi. Eski `document.domain` o'rnatish usuli bilan ikki subdomen o'z origin'ini "bir xil" qilishi mumkin edi; MDN buni eskirgan deb belgilaydi, chunki u SOP himoyasini buzadi va brauzerlar o'rtasida moslik hamda xavfsizlik muammolariga olib keladi. Subdomenlar o'rtasida ma'lumot almashish kerak bo'lsa, `postMessage` yoki aniq CORS ro'yxatidan foydalaning.

### Server tomonni himoya qilmaydi

SOP brauzer ichida ishlaydigan qoida. Hujumchi `curl` yoki o'z skripti bilan API'ga to'g'ridan-to'g'ri so'rov yuboradi, SOP unga ta'sir qilmaydi. Shuning uchun autentifikatsiya va avtorizatsiya server tomonda bo'lishi shart. SOP faqat boshqa saytdagi sahifa sizning foydalanuvchingiz brauzeri orqali ma'lumotni o'qishini to'sadi.

### Yon ta'sirli so'rovlar

Oddiy HTML forma `POST` yuborishi cross-origin mumkin va brauzer buni to'xtatmaydi (formani yuborish "yozish" toifasida). Cookie ham, atributlariga qarab, yuboriladi. Natijada foydalanuvchi nomidan amal bajarilishi mumkin: bu CSRF. Himoya SOP'dan tashqarida: SameSite cookie, CSRF token, Fetch Metadata (13, 17, 36-darslar). MDN ham yozuvlarni to'sish uchun taxmin qilib bo'lmaydigan CSRF token tekshirishni, o'qishni to'sish uchun esa resursni embed qilib bo'lmaydigan qilishni tavsiya qiladi.

### Subdomenlar va ishonch

Same-site subdomenlar o'rtasida ishonch yo'q: `blog.fleet.example` da XSS bo'lsa, u `fleet.example` ga cookie yozishi mumkin (cookie domen bo'yicha belgilanadi, 13-dars). Tashlab ketilgan DNS yozuvi orqali subdomain takeover bo'lsa, hujumchi sizning domeningiz ostida kontent beradi. Shu sababli "barcha subdomenlar ishonchli" deb yozilgan ro'yxat bitta unutilgan subdomen kuchiga teng.

### Origin'ni solishtirish qoidasi

Origin'ni satr sifatida emas, tahlil qilingan shaklda solishtiring. Sabablar: standart port va registr farqlari URL tahlilida normalizatsiya qilinadi; `endsWith` kabi satr funksiyalari host chegarasini bilmaydi. Quyidagi `run` bloki bir nechta qiymatning tahlildan keyingi origin'ini ko'rsatadi, hamda soddalashtirilgan same-site funksiyasini beradi. Public Suffix List ko'p yozuvdan iborat; blokda faqat ikki suffiks bor, shu sababli bu mexanizmni ko'rsatuvchi o'quv versiya, ishlab chiqarish kodi emas.

```ts run
const SUFFIXES = new Set(["example", "co.uk"]); // soddalashtirilgan, to'liq ro'yxat emas

function site(url: string): string {
  const u = new URL(url);
  const labels = u.hostname.split(".");
  for (let i = 0; i < labels.length; i++) {
    const rest = labels.slice(i).join(".");
    if (SUFFIXES.has(rest)) {
      return `${u.protocol}//${labels.slice(Math.max(i - 1, 0)).join(".")}`;
    }
  }
  return `${u.protocol}//${u.hostname}`;
}

const a = "https://app.fleet.example/x";
for (const b of [
  "https://app.fleet.example:443/y",
  "http://app.fleet.example/x",
  "https://app.fleet.example:8443/x",
  "https://api.fleet.example/x",
  "https://evil.example/x",
]) {
  const sameOrigin = new URL(a).origin === new URL(b).origin;
  const sameSite = site(a) === site(b);
  console.log(`${b.padEnd(34)} origin:${String(sameOrigin).padEnd(5)} site:${sameSite}`);
}
```

```text
https://app.fleet.example:443/y    origin:true  site:true
http://app.fleet.example/x         origin:false site:false
https://app.fleet.example:8443/x   origin:false site:true
https://api.fleet.example/x        origin:false site:true
https://evil.example/x             origin:false site:false
```

Qatorlarga e'tibor bering: `https://api.fleet.example` cross-origin, lekin same-site. `http://` variantida sxema boshqa, shuning uchun bu o'quv funksiyasida u boshqa site (sxema site'ning bir qismi: bu "schemeful same-site" tushunchasi, HTML Standard'da `same site` tarifi sxemani ham o'z ichiga oladi).

## Misol: origin ruxsat ro'yxati

Quyidagi misolda ilova `Origin` header'ini ro'yxat bilan solishtiradi. Bu keyingi darslarda CORS va postMessage'da aynan shu shaklda uchraydi. Kod o'quv funksiyasi, real tizim yo'q.

### 1. Zaif kod

```ts run
const BASE = "fleet.example";

// ZAIF: satr oxiriga qaraydi, host chegarasi va sxema tekshirilmaydi
function isTrustedWeak(origin: string): boolean {
  return origin.endsWith(BASE);
}

// ZAIF: satr ichida istalgan joyda qidiradi
function isTrustedWeak2(origin: string): boolean {
  return origin.includes(BASE);
}

console.log("1)", isTrustedWeak("https://app.fleet.example"), isTrustedWeak2("https://app.fleet.example"));
```

```text
1) true true
```

Oddiy sinovda ikkala funksiya ham to'g'ri ishlaydi.

### 2. Hujum

Hujumchi `evil-fleet.example` domenini o'zi ro'yxatdan o'tkazadi (arzon va oddiy amal) va `fleet.example.evil.test` kabi uzun nom yaratadi. Brauzer bu sahifalardan so'rov yuborganda `Origin` header'ini haqiqiy origin bilan qo'yadi, ilova esa uni noto'g'ri solishtiradi:

```ts run
const BASE = "fleet.example";
const weak1 = (o: string) => o.endsWith(BASE);
const weak2 = (o: string) => o.includes(BASE);

for (const o of [
  "https://evil-fleet.example",
  "https://fleet.example.evil.test",
  "http://fleet.example",
  "null",
]) {
  console.log(o.padEnd(32), "endsWith:", weak1(o), "includes:", weak2(o));
}
```

```text
https://evil-fleet.example       endsWith: true includes: true
https://fleet.example.evil.test  endsWith: false includes: true
http://fleet.example             endsWith: true includes: true
null                             endsWith: false includes: false
```

`evil-fleet.example` ikkala tekshiruvdan o'tdi, `fleet.example.evil.test` esa `includes` dan. `http://fleet.example` ham o'tdi, ya'ni shifrlanmagan sahifa ishonchli deb qabul qilindi. Agar bu tekshiruv CORS ruxsatini boshqarsa, hujumchi sahifasi foydalanuvchi cookie'si bilan API javobini o'qiy oladi (14-dars).

### 3. Tuzatilgan kod

```ts run
const BASE = "fleet.example";

function isTrusted(origin: string): boolean {
  let u: URL;
  try {
    u = new URL(origin);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  if (u.origin !== origin) return false;
  return u.hostname === BASE || u.hostname.endsWith("." + BASE);
}

for (const o of [
  "https://fleet.example",
  "https://alfa.fleet.example",
  "https://evil-fleet.example",
  "https://fleet.example.evil.test",
  "http://fleet.example",
  "https://fleet.example/path",
  "null",
]) {
  console.log(o.padEnd(32), isTrusted(o));
}
```

```text
https://fleet.example            true
https://alfa.fleet.example       true
https://evil-fleet.example       false
https://fleet.example.evil.test  false
http://fleet.example             false
https://fleet.example/path       false
null                             false
```

Tuzatish nima uchun yetarli. Invariant: ishonch qarori tahlil qilingan hostga asoslanadi, satrning tasodifiy bo'lagiga emas. `"." + BASE` bilan tugash faqat haqiqiy subdomenlarni o'tkazadi, sxema `https:` bilan cheklangan, `u.origin !== origin` esa yo'l yoki qo'shimcha belgilarni rad etadi. Ko'rsatilgan to'rt hujum (o'xshash domen, uzun nom, `http`, `null`) yopildi.

Nima yopilmadi. Birinchidan, subdomenlarga ishonch: tashlab ketilgan subdomen yoki XSS bor subdomen bu tekshiruvdan o'tadi. Xavfsizlik uchun muhim endpoint'larda aniq origin ro'yxati (`https://app.fleet.example`) afzal. Ikkinchidan, tekshiruv faqat `Origin` qiymatini baholaydi; uni yubormaydigan so'rovlarda (masalan, same-origin GET) header bo'lmasligi mumkin va bunday holatni alohida hal qilish kerak.

## Qachon qo'llamaslik kerak

- Bu qat'iy origin tekshiruvi har joyda kerak emas. Ommaviy, autentifikatsiyasiz va cookie ishlatmaydigan API (masalan, ommaviy ob-havo ma'lumoti) uchun origin cheklash ma'nosiz: ma'lumot baribir hamma uchun ochiq.
- Subdomen o'rniga aniq ro'yxat yuritish operatsion yuk: har yangi frontend qo'shilganda ro'yxatni yangilash kerak. Subdomenlar soni kam va ular ustidan to'liq nazoratingiz bo'lsa, nuqta bilan tugash qoidasi qabul qilinadigan kelishuv. Qaror risk va qulaylik o'rtasidagi tanlov, uni jamoa bilan yozib qo'ying.
- Origin header'i serverga ishonchli signal emas: brauzer bo'lmagan mijoz uni xohlagancha yozadi. Bu himoya brauzerdagi foydalanuvchini boshqa sayt orqali hujumdan saqlaydi, autentifikatsiya o'rnini bosmaydi.
- SOP'ni o'chirish yoki yumshatish (`document.domain`, keng CORS) odatda vaqtinchalik qulaylik uchun qilinadi va uzoq muddatda xavfli. Buning o'rniga `postMessage` yoki aniq CORS ro'yxati ishlating (39-dars).

## Stack'da: Next.js va NestJS

Next.js ilovasida origin tekshiruvi odatda uch joyda uchraydi: CORS sozlamasi (NestJS `enableCors`, Fastify `@fastify/cors`), `postMessage` qabul qiluvchisi va Server Actions kabi mexanizmlar. Hammasida bir xil qoida: ro'yxat konfiguratsiyada, solishtirish tahlil qilingan origin bo'yicha. NestJS'da `origin` opsiyasi funksiya bo'lishi mumkin; quyidagi namuna ishga tushirilmaydi (NestJS yo'q), sintaksis jihatidan tekshirilgan.

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const ALLOWED = new Set(["https://app.fleet.example", "https://admin.fleet.example"]);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, cb) => {
      // Origin yo'q bo'lsa (server-server, same-origin) CORS kerak emas
      if (!origin) return cb(null, false);
      cb(null, ALLOWED.has(origin));
    },
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
```

Next.js Server Actions ham shu g'oyaga tayanadi: Next.js hujjatiga ko'ra, action chaqirilganda `Origin` header'idagi host ilovaning o'z hosti (`x-forwarded-host` yoki `host`) bilan solishtiriladi va farq qilsa action rad etiladi; qo'shimcha xavfsiz hostlar `serverActions.allowedOrigins` bilan beriladi. Origin header umuman yo'q bo'lsa, so'rov ogohlantirish bilan o'tkazib yuboriladi. Bundan ikki xulosa: reverse proxy ortida `Host` va `X-Forwarded-Host` to'g'ri uzatilishi kerak (11-dars), `Origin`siz so'rovlarni esa boshqa himoya (SameSite cookie, autentifikatsiya) qoplashi kerak.

NestJS misolida `ALLOWED.has(origin)` aniq tenglik: tahlil qilinadigan satr funksiyalari yo'q. `credentials: true` bilan birga keng ro'yxat qo'ymang; bu 14-darsning asosiy mavzusi.

## Xulosa

- Origin: sxema, host va port. Site: sxema va ro'yxatdan o'tgan domen. Same-origin har doim same-site, teskarisi emas.
- SOP asosan cross-origin o'qishni cheklaydi. So'rov yuborish va resurs joylash odatda ruxsat, shu sababli yon ta'sirli so'rovlarga alohida himoya kerak.
- SOP server tomonni himoya qilmaydi: brauzer bo'lmagan mijoz unga bo'ysunmaydi.
- Origin'ni `endsWith`, `includes` yoki `startsWith` bilan emas, tahlil qilingan URL va aniq tenglik bilan solishtiring. `null` origin'ni ishonchli ro'yxatga qo'shmang.
- Subdomenlarga umumiy ishonch kuchsiz bo'g'in: takeover va XSS bitta subdomendan hammasiga o'tadi.
