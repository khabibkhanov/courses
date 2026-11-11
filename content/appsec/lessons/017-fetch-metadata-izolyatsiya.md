---
n: 17
slug: fetch-metadata-izolyatsiya
title: "Fetch Metadata va cross-origin izolyatsiya (COOP, COEP, CORP)"
summary: "Sec-Fetch-* header'lari bilan resource isolation policy qurish, uning CSRF va cross-site leak'larga qarshi roli, hamda Spectre kabi hujumlarga qarshi COOP, COEP va CORP bilan cross-origin izolyatsiya."
duration: 40
sources:
  - id: fetch-metadata
    note: "Fetch Metadata Request Headers spetsifikatsiyasi: Sec-Fetch-Site, Sec-Fetch-Mode, Sec-Fetch-Dest va Sec-Fetch-User header'lari"
  - id: mdn-fetch-metadata
    note: "MDN Fetch metadata qo'llanmasi: header'larning taqiqlangan (forbidden) ekani, faqat potentially trustworthy URL'larga yuborilishi, resource isolation policy namunasi va Vary tavsiyasi"
  - id: cs-csrf
    note: "OWASP CSRF Prevention Cheat Sheet: Sec-Fetch-Site asosiy signal, Origin bo'yicha zaxira tekshiruv majburiy, header yo'q bo'lganda fail-safe yoki fail-open tanlovi, webhook va CORS API'larni istisno qilish"
  - id: mdn-corp
    note: "MDN CORP qo'llanmasi: Spectre kabi yon kanal hujumlari, same-origin / same-site / cross-origin qiymatlari, so'rov yuborilishi to'xtamasligi, COOP+COEP bilan cross-origin isolated"
quiz:
  - q: "Hujumchi sahifasidagi forma sizning `POST /vehicles/v1/delete` manzilingizga yuboriladi. Brauzer qanday `Sec-Fetch-Site` qiymatini qo'yadi?"
    options:
      - "same-origin"
      - "none"
      - "cross-site"
      - "Header yuborilmaydi"
    answer: 2
    explain: "Hujumchi sahifasi boshqa sayt, shuning uchun brauzer cross-site qo'yadi. `none` foydalanuvchi bevosita boshlagan so'rovlar uchun (manzil satri, xatcho'p). Header'ni sahifa skripti o'zgartira olmaydi, chunki Sec- bilan boshlanadigan header'lar taqiqlangan (forbidden) ro'yxatida."
  - q: "Sizning resource isolation policy'ingiz `Sec-Fetch-Site: cross-site` + `GET` + `Sec-Fetch-Mode: navigate` + `Sec-Fetch-Dest: document` so'rovga nima qiladi?"
    options:
      - "Rad etadi: cross-site hammasi taqiqlanadi"
      - "Ruxsat beradi: boshqa saytdagi havola orqali kirish oddiy foydalanuvchi oqimi"
      - "Faqat nonce bo'lsa ruxsat beradi"
      - "Ruxsat beradi, lekin cookie'ni olib tashlaydi"
    answer: 1
    explain: "Foydalanuvchi boshqa saytdagi havolani bosib kelishi kerak, shuning uchun xavfsiz metodli yuqori darajali navigatsiya ruxsat etiladi. Qolgan cross-site so'rovlar (POST, fetch, subresurs) rad etiladi. Bu GET orqali yon ta'sir bo'lmasligi sharti bilan to'g'ri."
  - q: "Hujumchi `curl` bilan `Sec-Fetch-Site: same-origin` header'ini qo'lda yozib yuboradi. Resource isolation policy uni to'xtatadimi?"
    options:
      - "Ha: Sec-Fetch header'larini hech kim yoza olmaydi"
      - "Yo'q va bu muammo emas: policy brauzerdagi foydalanuvchini boshqa saytdan himoya qiladi; brauzer bo'lmagan mijoz uchun autentifikatsiya va avtorizatsiya kerak"
      - "Ha: server curl'ni taniydi"
      - "Yo'q va bu policy'ning zaifligi"
    answer: 1
    explain: "Taqiq faqat brauzerdagi sahifa kodiga tegishli. `curl` istalgan header yuboradi, lekin unda qurbonning cookie'si yo'q. Policy CSRF kabi 'brauzerni qurol qilish' hujumlariga qarshi; server autentifikatsiyasining o'rnini bosmaydi."
  - q: "`Cross-Origin-Embedder-Policy: require-corp` o'rnatilgan sahifa boshqa originning rasmini `<img src>` bilan yuklamoqchi, rasm serveri CORP header'i bermaydi. Natija?"
    options:
      - "Rasm yuklanadi: img har doim ruxsat"
      - "Brauzer CORS so'raydi"
      - "Rasm bloklanadi, chunki resurs embed qilinishiga ochiq rozilik bermagan"
      - "Sahifa umuman yuklanmaydi"
    answer: 2
    explain: "require-corp: cross-origin no-cors resurs faqat o'z CORP header'i bilan ruxsat bergan bo'lsagina yuklanadi. CORS bilan (crossorigin atributi va CORS header'lari) yuklangan resurslar ham ruxsat. Sahifa o'zi yuklanadi, faqat shu resurs bloklanadi."
  - q: "`Cross-Origin-Opener-Policy: same-origin` nima uchun kerak?"
    options:
      - "Boshqa origin'dagi oynalar (masalan, window.open bilan ochgan yoki sizni ochgan) bilan umumiy browsing context group'dan ajratadi, shu bilan window obyekti orqali aloqani to'sadi"
      - "Cookie'ni cross-site yuborishni taqiqlaydi"
      - "Skriptlarni nonce bilan cheklaydi"
      - "Faqat HTTPS'ni majburlaydi"
    answer: 0
    explain: "COOP hujjatni boshqa origin'dagi hujjatlar bilan bir browsing context group'ga tushishdan saqlaydi. Cross-origin izolyatsiya (SharedArrayBuffer kabi imkoniyatlar uchun) COOP va COEP'ning birga qo'yilishini talab qiladi. Boshqa variantlar boshqa mexanizmlar."
  - q: "Nega CORP: same-origin 'xavfli' resurslarga qo'yiladi, garchi SOP skriptga cross-origin javobni o'qishga ruxsat bermasa ham?"
    options:
      - "SOP no-cors rasm va skript so'rovlarini umuman yubormaydi"
      - "Chunki CORP serverni o'zi himoya qiladi"
      - "Chunki Spectre kabi tarmoq hujumlari faqat HTTPda bo'ladi"
      - "Chunki resurs baytlari embedder jarayoni xotirasiga tushsa, apparat darajasidagi yon kanal hujumlari ularni o'qishi mumkin; CORP javobni tarmoq xatosiga aylantirib bunga yo'l qo'ymaydi"
    answer: 3
    explain: "MDN: Spectre kabi spekulyativ ijroni ishlatuvchi hujumlar javob baytlari embedder xotirasiga kirsa ma'lumot oshkor qilishi mumkin. CORP javobni brauzer xotirasiga yuklashdan oldin bloklaydi. So'rov esa baribir yuboriladi, shuning uchun CORP CSRF himoyasi emas."
task:
  title: "Resource isolation policy"
  prompt: |
    `allowed(req)` so'rovni qabul qilish yoki rad etishni hal qiladi. Hozir u hamma narsaga ruxsat beradi.

    Funksiyani tuzating. Qoidalar:

    1. `Sec-Fetch-Site` yo'q bo'lsa: `Origin` ham yo'q bo'lsa ruxsat (brauzer bo'lmagan mijoz), `Origin` bo'lsa u aynan `https://app.fleet.example` bo'lgandagina ruxsat.
    2. `Sec-Fetch-Site` `same-origin` yoki `none` bo'lsa ruxsat.
    3. Qolgan holatda (`same-site`, `cross-site`) faqat `GET`/`HEAD` metodli, `Sec-Fetch-Mode: navigate` va `Sec-Fetch-Dest: document` so'rovga ruxsat.
    4. Imzoni o'zgartirmang. Oxirgi oltita `console.log` natijasi: `true`, `true`, `false`, `true`, `false`, `false`.
  lang: ts
  starter: |
    type Req = { method: string; headers: Record<string, string> };

    // ZAIF: hamma narsaga ruxsat
    function allowed(req: Req): boolean {
      return true;
    }

    const h = (o: Record<string, string>) => o;
    console.log("same-origin POST:", allowed({ method: "POST", headers: h({ "sec-fetch-site": "same-origin" }) }));
    console.log("manzil satridan GET:", allowed({ method: "GET", headers: h({ "sec-fetch-site": "none" }) }));
    console.log("cross-site POST forma:", allowed({ method: "POST", headers: h({ "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" }) }));
    console.log("cross-site havola GET:", allowed({ method: "GET", headers: h({ "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" }) }));
    console.log("cross-site fetch GET:", allowed({ method: "GET", headers: h({ "sec-fetch-site": "cross-site", "sec-fetch-mode": "cors", "sec-fetch-dest": "empty" }) }));
    console.log("eski brauzer, begona Origin:", allowed({ method: "POST", headers: h({ origin: "https://evil.example" }) }));
  solution: |
    type Req = { method: string; headers: Record<string, string> };

    const APP_ORIGIN = "https://app.fleet.example";

    function allowed(req: Req): boolean {
      const site = req.headers["sec-fetch-site"];
      if (!site) {
        const origin = req.headers["origin"];
        return origin === undefined || origin === APP_ORIGIN;
      }
      if (site === "same-origin" || site === "none") return true;
      const safe = req.method === "GET" || req.method === "HEAD";
      return safe && req.headers["sec-fetch-mode"] === "navigate" && req.headers["sec-fetch-dest"] === "document";
    }

    const h = (o: Record<string, string>) => o;
    console.log("same-origin POST:", allowed({ method: "POST", headers: h({ "sec-fetch-site": "same-origin" }) }));
    console.log("manzil satridan GET:", allowed({ method: "GET", headers: h({ "sec-fetch-site": "none" }) }));
    console.log("cross-site POST forma:", allowed({ method: "POST", headers: h({ "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" }) }));
    console.log("cross-site havola GET:", allowed({ method: "GET", headers: h({ "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" }) }));
    console.log("cross-site fetch GET:", allowed({ method: "GET", headers: h({ "sec-fetch-site": "cross-site", "sec-fetch-mode": "cors", "sec-fetch-dest": "empty" }) }));
    console.log("eski brauzer, begona Origin:", allowed({ method: "POST", headers: h({ origin: "https://evil.example" }) }));
  solutionNotes: |
    - Asosiy signal `Sec-Fetch-Site`; `Mode` va `Dest` faqat cross-site navigatsiyaga istisno berishda ishlatiladi.
    - `Sec-Fetch-Site` yo'q bo'lsa `Origin` bo'yicha zaxira tekshiruv ishlaydi (OWASP CSRF Cheat Sheet Fetch Metadata uchun zaxira tekshiruvni majburiy deydi).
    - `same-site` ham rad etiladi (navigatsiyadan tashqari): subdomen ishonchli bo'lmasa kerak; ishonchli subdomenlarni ochiq ro'yxat bilan ruxsat qiling.
    - Qoldiq risk: policy faqat brauzer so'rovlarini baholaydi. `curl` header'ni soxtalashtiradi, shuning uchun autentifikatsiya va avtorizatsiya alohida kerak (51-58 darslar).
    - Cross-site GET navigatsiyada yon ta'sir bo'lmasligi shart; aks holda policy teshik qoldiradi.
  checklist:
    - "Cross-site POST va fetch rad etiladi"
    - "Cross-site havola GET ruxsat etiladi"
    - "Header yo'q bo'lsa Origin bilan zaxira tekshiruv"
    - "Imzo o'zgarmagan"
    - "Policy brauzer bo'lmagan mijozni to'xtatmasligini ayta olasiz"
---

## Muammo

12-14-darslarda ko'rdik: SOP javobni o'qishni to'sadi, lekin so'rov yuborilishini emas, va CORS faqat ruxsat bermaydi. Shu sababli hujumchi sahifasidan sizning API'ngizga yuborilgan yon ta'sirli so'rov (forma `POST`, `<img>` orqali `GET`) serverga yetib boradi. Server bu so'rovni "foydalanuvchi o'zi yubordi" yoki "boshqa sayt yubordi" deb ajrata olmaydi: `Cookie` ikkala holatda bir xil. CSRF token bu muammoni hal qiladi (36-dars), lekin har endpoint va har mijozga token qo'shish kodni murakkablashtiradi.

Brauzer esa buni aniq biladi: so'rovni qaysi sahifa, qaysi sayt, qaysi maqsadda yuborganini. Fetch Metadata (`Sec-Fetch-*` header'lari) shu ma'lumotni serverga beradi. Server bu header'larga qarab, hujum qiladigan cross-site so'rovlarni ilova mantiqiga yetkazmasdan rad etishi mumkin. Bu dars shu mexanizmni, uning chegarasini va yaqin mavzuni, ya'ni cross-origin izolyatsiyani (COOP, COEP, CORP) beradi. Ikkinchi mavzu boshqa muammoga qaratilgan: hatto SOP bo'lsa ham, brauzer jarayoniga tushgan cross-origin ma'lumotni apparat darajasidagi yon kanal hujumlari (Spectre) o'qiy olishi mumkin.

## Asosiy g'oya

### Fetch Metadata header'lari

Fetch Metadata spetsifikatsiyasi to'rt header'ni belgilaydi (MDN ham shu to'rttasini ro'yxatlaydi):

| Header | Ma'nosi | Qiymatlar (asosiylari) |
|---|---|---|
| `Sec-Fetch-Site` | So'rovchi va resurs o'rtasidagi munosabat | `same-origin`, `same-site`, `cross-site`, `none` |
| `Sec-Fetch-Mode` | So'rov rejimi | `navigate`, `no-cors`, `cors`, `same-origin` |
| `Sec-Fetch-Dest` | Resurs qanday ishlatiladi | `document`, `script`, `image`, `iframe`, `empty` va boshqalar |
| `Sec-Fetch-User` | Foydalanuvchi harakati bilan boshlanganmi | faqat `?1` |

`none` qiymati foydalanuvchi bevosita boshlagan so'rovlarda (manzil satriga yozish, xatcho'p) keladi. `Dest=empty` odatda `fetch()` chaqiruvi natijasi. Muhim xossalar (MDN): bu header'lar `Sec-` bilan boshlangani uchun "forbidden request header" ro'yxatida, ya'ni sahifa kodi ularni o'zgartira olmaydi; ular faqat "potentially trustworthy" URL'larga yuboriladi, ya'ni ochiq HTTP originlarda ko'rmaysiz.

### Resource isolation policy

MDN va OWASP bir xil shablonni beradi: server so'rovni quyidagicha baholaydi (MDN buni resource isolation policy deb ataydi):

1. Same-origin so'rovlar (ba'zan same-site, subdomenlarga ishonsangiz) ruxsat.
2. Foydalanuvchi bevosita boshlagan so'rovlar (`none`) ruxsat.
3. Boshqa saytdan xavfsiz metodli yuqori darajali navigatsiya ruxsat (foydalanuvchi havolani bosib kelishi uchun).
4. Qolgan hammasi rad etiladi.

OWASP CSRF Prevention Cheat Sheet Fetch Metadata'ni CSRF'ning engil himoyasi sifatida beradi, `Sec-Fetch-Site` ni asosiy signal deb ataydi va muhim shartni qo'yadi: `Sec-Fetch-*` ni yubormaydigan eski brauzerlar uchun standart Origin tekshiruvi bilan zaxira variant majburiy. Header umuman bo'lmaganda ikki yo'l bor: fail-safe (sezgir endpoint'lar uchun tavsiya etiladi, so'rov bloklanadi) va fail-open (moslik birinchi o'rinda: Origin tekshiruvi, CSRF token yoki qo'shimcha validatsiyaga qaytiladi). Dars modelidagi `allowed()` ikkinchi yo'lni tanlagan: `Origin` ham yo'q bo'lsa so'rov o'tadi, chunki bu brauzer bo'lmagan mijoz bo'lishi mumkin. Shuningdek, cheat sheet bu header'lar barcha yirik brauzerlarda qo'llab-quvvatlanishini (2023-yil martidan beri) yozadi.

OWASP cheat sheet siyosatning standart nuqtalarini ham beradi: `Sec-Fetch-Site: cross-site` bilan xavfsiz bo'lmagan metod (`POST`, `PUT`, `PATCH`, `DELETE`) rad etiladi; `same-site` faqat tahdid modelingiz qardosh subdomenlarga ishonsa ruxsat etiladi; `none` foydalanuvchi bevosita boshlagan navigatsiya uchun. MDN esa serverga javobda `Vary: sec-fetch-site, sec-fetch-mode` (siyosat o'qiydigan header'lar) qo'shishni tavsiya qiladi, shunda keshlangan javob boshqa kontekstdagi so'rovga berilmaydi. Dars modeli MDN namunasidan qat'iyroq: cross-site navigatsiyada `Sec-Fetch-Dest: document` ni ham talab qiladi, shuning uchun cross-site `<iframe>` yoki `<embed>` navigatsiyasi ham rad etiladi (OWASP namunasi `object` va `embed` ni alohida chiqarib tashlaydi).

Quyidagi `run` bloki shu siyosatni sof funksiya sifatida beradi va bir nechta so'rovni sinab ko'radi.

```ts run
type Req = { method: string; headers: Record<string, string> };

const APP_ORIGIN = "https://app.fleet.example";
const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

// Resource isolation policy: so'rovga brauzer qo'shgan Sec-Fetch-* asosida qaror
function allowed(req: Req): boolean {
  const site = req.headers["sec-fetch-site"];
  if (!site) {
    // Eski brauzer yoki brauzer bo'lmagan mijoz: Origin bo'yicha zaxira tekshiruv
    const origin = req.headers["origin"];
    return origin === undefined || origin === APP_ORIGIN;
  }
  if (site === "same-origin" || site === "none") return true;
  // same-site va cross-site: faqat xavfsiz metodli yuqori darajali navigatsiya
  return SAFE.has(req.method) && req.headers["sec-fetch-mode"] === "navigate" && req.headers["sec-fetch-dest"] === "document";
}

const req = (method: string, headers: Record<string, string>): Req => ({ method, headers });
const cases: [string, Req][] = [
  ["same-origin fetch POST", req("POST", { "sec-fetch-site": "same-origin", "sec-fetch-mode": "cors", "sec-fetch-dest": "empty" })],
  ["manzil satridan GET", req("GET", { "sec-fetch-site": "none", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" })],
  ["boshqa saytdan havola GET", req("GET", { "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" })],
  ["boshqa saytdan forma POST", req("POST", { "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" })],
  ["boshqa saytdan <img> GET", req("GET", { "sec-fetch-site": "cross-site", "sec-fetch-mode": "no-cors", "sec-fetch-dest": "image" })],
  ["eski brauzer, Origin yo'q", req("POST", {})],
  ["eski brauzer, begona Origin", req("POST", { origin: "https://evil.example" })],
];
for (const [name, r] of cases) console.log(name.padEnd(30), allowed(r) ? "ruxsat" : "RAD");
```

```text
same-origin fetch POST         ruxsat
manzil satridan GET            ruxsat
boshqa saytdan havola GET      ruxsat
boshqa saytdan forma POST      RAD
boshqa saytdan <img> GET       RAD
eski brauzer, Origin yo'q      ruxsat
eski brauzer, begona Origin    RAD
```

## Chuqurroq: chegaralar va izolyatsiya

### Fetch Metadata yopadigan ikkinchi sinf: cross-site leak

MDN Fetch metadata qo'llanmasi CSRF bilan birga yana bir hujum sinfini nomlaydi: cross-site leak (XS-Leaks). Bunda hujumchi sahifa o'qiy olmaydigan javob haqida yon kanal orqali ma'lumot oladi: masalan, foydalanuvchining sizdagi sahifaga munosabati (kirgan yoki kirmagan) xato hodisalari orqali bilinadi, chunki boshqa saytdan `<img>` yoki `<script>` bilan yuklangan sahifa foydalanuvchi holatiga qarab yo muvaffaqiyatli, yo xato bilan tugaydi. Resource isolation policy bunday so'rovlarni (`Sec-Fetch-Site: cross-site`, `Sec-Fetch-Mode: no-cors`, `Sec-Fetch-Dest: image` yoki `script`) javob hosil qilishdan oldin rad etadi, shuning uchun hujumchi farqni kuzata olmaydi. Faqat o'qishni to'suvchi SOP bu holatni yopa olmaydi.

### Fetch Metadata nimani qilmaydi

- U brauzerning kafolati, serverning emas. `curl` yoki boshqa skript header'ni istagancha yozadi. Lekin hujum modelida qurbon brauzer orqali ishlaydi: hujumchi sahifasi o'z skripti bilan `Sec-Fetch-Site` ni soxtalashtira olmaydi. Ya'ni policy "brauzerni qurolga aylantirish" hujumlariga (CSRF, cross-site leak) qarshi, boshqa mijozlarga qarshi emas.
- U same-site hujumlarni (ishdan chiqqan subdomen) alohida qoida bilan ushlaydi: `same-site` ni qanday baholash sizning tanlovingiz. Subdomenlarga ishonmasangiz, `same-site` ni ham cross-site kabi qabul qiling.
- Policy navigatsiyani ruxsat etadi, shuning uchun `GET` orqali yon ta'sirli endpoint (masalan, `GET /logout` yoki `GET /vehicles/1/delete`) baribir ochiq qoladi. Yon ta'sir faqat `POST`/`PUT`/`DELETE`da bo'lsin.
- Hamma endpoint cross-site so'rov qabul qilmasligi kerak emas: ommaviy API'lar va webhook'lar (75-dars) cross-site so'rov oladi, ularni policy'dan istisno qilish kerak yoki alohida yo'lga ajratish kerak.

### Cross-origin izolyatsiya: CORP, COEP, COOP

Boshqa muammo: MDN CORP sahifasida yozilishicha, SOP skriptga cross-origin javobni o'qishga ruxsat bermaydi, lekin Spectre kabi apparat yon kanal zaifliklari spekulyativ ijrodan foydalanib, javob baytlari embedder jarayoni xotirasiga kirgan bo'lsa, ma'lumotni oshkor qilishi mumkin. Shu sababli uchta header brauzer darajasida izolyatsiya beradi:

- **`Cross-Origin-Resource-Policy` (CORP)**: resurs egasi qo'yadi. `same-origin` faqat o'z origin'iga, `same-site` shu sayt ichiga, `cross-origin` hammaga ruxsat beradi (header yo'q bo'lsa standart xatti-harakat shu). MDN `same-origin` ni sezgir ma'lumot yoki shaxsiy API javoblari uchun tavsiya qiladi. Brauzer `no-cors` cross-origin so'rovni yuborsa ham, javobni tarmoq xatosiga aylantirib natijani oshkor qilmaydi; ya'ni so'rov baribir yuboriladi, CORP CSRF himoyasi emas.
- **`Cross-Origin-Embedder-Policy` (COEP)**: hujjat qo'yadi. `require-corp` bilan hujjat faqat o'z origin'idagi yoki CORP orqali (yoki CORS bilan) ruxsat berilgan cross-origin resurslarni yuklaydi. `credentialless` esa ruxsatsiz resursni yuklashga imkon beradi, lekin cookie'siz. Standart `unsafe-none`.
- **`Cross-Origin-Opener-Policy` (COOP)**: hujjat o'zini boshqa origin'dagi hujjatlar bilan umumiy browsing context group'dan ajratadi. `same-origin` qiymati faqat COOP qo'ygan va bir origin hujjatlar bilan guruhga ruxsat beradi; `same-origin-allow-popups`, `noopener-allow-popups` yumshoqroq variantlar; standart `unsafe-none`.

MDN COEP sahifasi uni aniqlashtiradi: COEP faqat `no-cors` rejimdagi cross-origin so'rovlarga tegishli, `cors` rejimdagi yuklashni CORS o'zi boshqaradi (COEP uni bloklamaydi, lekin CORS ruxsati baribir kerak). COEP resursning o'z CORP siyosatini bekor qilmaydi: CORP `same-origin` bo'lsa, COEP qanday bo'lishidan qat'i nazar resurs cross-origin yuklanmaydi. Header takrorlansa yoki bir nechta token berilsa, `unsafe-none` deb hisoblanadi. COOP uchun MDN qoidasi: `same-origin` hujjat boshqa hujjat bilan faqat ikkalasi ham same-origin va ikkalasida `same-origin` bo'lsa umumiy browsing context group'ga tushadi; guruhdan ajratilganda oynalar o'rtasidagi `window.opener` havolasi uziladi va XS-Leaks sinfidagi hujumlar to'siladi. Shu bilan birga MDN ogohlantiradi: brauzer baribir sezgirroq va kamroq sezgir ilovani bir jarayonda joylashtirishi mumkin, ya'ni Spectre kabi hujumlarga qarshi COOP yagona kafolat emas.

COOP va COEP birga (`same-origin` + `require-corp` yoki `credentialless`) hujjatni cross-origin isolated qiladi; MDN bo'yicha `SharedArrayBuffer` va yuqori aniqlikdagi `performance.now()` kabi imkoniyatlar faqat shunday hujjatlarda mavjud. Hujjat izolyatsiyalanganini `crossOriginIsolated` xossasi bilan tekshirish mumkin.

Muhim kelishuv: COEP `require-corp` barcha uchinchi tomon resurslariga CORP/CORS talab qiladi, shuning uchun uchinchi tomon rasm, skript va reklama bilan to'la sayt uchun u butun ilovani sindiradi. Shu sababli bu izolyatsiya odatda faqat kerak bo'lganda (SharedArrayBuffer, aniq taymer) yoqiladi. Xavfsizlik nuqtai nazaridan esa eng arzon foyda: shaxsiy API javoblari va foydalanuvchi kontentiga `CORP: same-origin` hamda `COOP: same-origin` qo'yish (Helmet standart to'plami ham shu ikki qiymatni qo'yadi, NestJS hujjati jadvalida ko'rsatilgan).

### Mashq: embed qarori

Quyidagi `canLoad` COEP, CORP va so'rov rejimini birlashtirib, cross-origin resurs yuklanishini hal qiladi. Zaif versiya CORP'ni va `cors` rejimini hisobga olmaydi. Uni MDN qoidalariga ko'ra tuzating: bir origin'dagi resurs doim yuklanadi; `cors` rejimidagi yuklashni COEP bloklamaydi; `no-cors` rejimda CORP `same-origin` cross-origin so'rovni, `same-site` esa cross-site so'rovni bloklaydi; `require-corp` da CORP'siz cross-origin `no-cors` resurs bloklanadi; `credentialless` da CORP'siz resurs cookie'siz yuklanadi; `unsafe-none` da CORP'siz resurs oddiy yuklanadi.

```ts run
type Coep = "unsafe-none" | "require-corp" | "credentialless";
type Rel = "same-origin" | "same-site" | "cross-site";
type Corp = "same-origin" | "same-site" | "cross-origin" | undefined;
type Res = { loaded: boolean; credentials: boolean };

// ZAIF: CORP e'tiborsiz, cors rejimi va credentialless hisobga olinmagan
function canLoad(coep: Coep, rel: Rel, mode: "cors" | "no-cors", corp: Corp): Res {
  if (coep === "require-corp" && rel !== "same-origin") return { loaded: false, credentials: false };
  return { loaded: true, credentials: true };
}

console.log(canLoad("unsafe-none", "cross-site", "no-cors", "same-origin"));
```

```ts test
check("bir origin'dagi resurs har doim yuklanadi", () => canLoad("require-corp", "same-origin", "no-cors", "same-origin").loaded === true);
check("require-corp: CORP'siz cross-site no-cors bloklanadi", () => canLoad("require-corp", "cross-site", "no-cors", undefined).loaded === false);
check("require-corp: CORP cross-origin bo'lsa yuklanadi", () => canLoad("require-corp", "cross-site", "no-cors", "cross-origin").loaded === true);
check("cors rejimini COEP bloklamaydi", () => canLoad("require-corp", "cross-site", "cors", undefined).loaded === true);
check("CORP same-origin unsafe-none'da ham cross-origin no-cors'ni bloklaydi", () => canLoad("unsafe-none", "cross-site", "no-cors", "same-origin").loaded === false);
check("CORP same-site: same-site yuklanadi, cross-site bloklanadi", () => canLoad("unsafe-none", "same-site", "no-cors", "same-site").loaded === true && canLoad("unsafe-none", "cross-site", "no-cors", "same-site").loaded === false);
check("unsafe-none: CORP'siz resurs cookie bilan yuklanadi", () => { const r = canLoad("unsafe-none", "cross-site", "no-cors", undefined); return r.loaded && r.credentials; });
check("credentialless: CORP'siz resurs yuklanadi, lekin cookie'siz", () => { const r = canLoad("credentialless", "cross-site", "no-cors", undefined); return r.loaded && !r.credentials; });
```

## Misol: cross-site POST va resource isolation

Quyidagi misolda ilova `POST` so'rovda cookie bilan autentifikatsiyalangan foydalanuvchi mashinasini o'chiradi. Cookie `SameSite` siz berilgan deb faraz qilamiz (13-dars: bu xato). Hammasi o'quv modelida, hujum faqat shu kodga qarshi.

### 1. Zaif kod

```ts run
type Req = { method: string; headers: Record<string, string> };

const APP_ORIGIN = "https://app.fleet.example";
const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

// Resource isolation policy: so'rovga brauzer qo'shgan Sec-Fetch-* asosida qaror
function allowed(req: Req): boolean {
  const site = req.headers["sec-fetch-site"];
  if (!site) {
    // Eski brauzer yoki brauzer bo'lmagan mijoz: Origin bo'yicha zaxira tekshiruv
    const origin = req.headers["origin"];
    return origin === undefined || origin === APP_ORIGIN;
  }
  if (site === "same-origin" || site === "none") return true;
  // same-site va cross-site: faqat xavfsiz metodli yuqori darajali navigatsiya
  return SAFE.has(req.method) && req.headers["sec-fetch-mode"] === "navigate" && req.headers["sec-fetch-dest"] === "document";
}

const vehicles = new Set(["v1", "v2"]);

// ZAIF: so'rov qayerdan kelganini tekshirmaydi (cookie autentifikatsiyasi bor deb faraz qilinadi)
function deleteVehicleWeak(_req: Req, id: string): string {
  vehicles.delete(id);
  return `o'chirildi: ${id}`;
}

const own = { method: "POST", headers: { "sec-fetch-site": "same-origin", "sec-fetch-mode": "cors", "sec-fetch-dest": "empty" } };
console.log(deleteVehicleWeak(own, "v1"), "| qoldi:", [...vehicles].join(","));
```

```text
o'chirildi: v1 | qoldi: v2
```

### 2. Hujum

Foydalanuvchi tizimga kirgan va hujumchi sahifasini ochadi. Sahifada yashirin forma `POST /vehicles/v2/delete` manziliga yuboriladi. Brauzer cookie'ni qo'shadi va `Sec-Fetch-Site: cross-site` qo'yadi:

```ts run
type Req = { method: string; headers: Record<string, string> };

const APP_ORIGIN = "https://app.fleet.example";
const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

// Resource isolation policy: so'rovga brauzer qo'shgan Sec-Fetch-* asosida qaror
function allowed(req: Req): boolean {
  const site = req.headers["sec-fetch-site"];
  if (!site) {
    // Eski brauzer yoki brauzer bo'lmagan mijoz: Origin bo'yicha zaxira tekshiruv
    const origin = req.headers["origin"];
    return origin === undefined || origin === APP_ORIGIN;
  }
  if (site === "same-origin" || site === "none") return true;
  // same-site va cross-site: faqat xavfsiz metodli yuqori darajali navigatsiya
  return SAFE.has(req.method) && req.headers["sec-fetch-mode"] === "navigate" && req.headers["sec-fetch-dest"] === "document";
}

const vehicles = new Set(["v1", "v2"]);
function deleteVehicleWeak(_req: Req, id: string): string {
  vehicles.delete(id);
  return `o'chirildi: ${id}`;
}

const attack: Req = { method: "POST", headers: { "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" } };
console.log(deleteVehicleWeak(attack, "v2"), "| qoldi:", [...vehicles].join(","));
```

```text
o'chirildi: v2 | qoldi: v1
```

### 3. Tuzatilgan kod

```ts run
type Req = { method: string; headers: Record<string, string> };

const APP_ORIGIN = "https://app.fleet.example";
const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

// Resource isolation policy: so'rovga brauzer qo'shgan Sec-Fetch-* asosida qaror
function allowed(req: Req): boolean {
  const site = req.headers["sec-fetch-site"];
  if (!site) {
    // Eski brauzer yoki brauzer bo'lmagan mijoz: Origin bo'yicha zaxira tekshiruv
    const origin = req.headers["origin"];
    return origin === undefined || origin === APP_ORIGIN;
  }
  if (site === "same-origin" || site === "none") return true;
  // same-site va cross-site: faqat xavfsiz metodli yuqori darajali navigatsiya
  return SAFE.has(req.method) && req.headers["sec-fetch-mode"] === "navigate" && req.headers["sec-fetch-dest"] === "document";
}

const vehicles = new Set(["v1", "v2"]);

function deleteVehicle(req: Req, id: string): string {
  if (!allowed(req)) return "403: cross-site so'rov rad etildi";
  vehicles.delete(id);
  return `o'chirildi: ${id}`;
}

const own: Req = { method: "POST", headers: { "sec-fetch-site": "same-origin", "sec-fetch-mode": "cors", "sec-fetch-dest": "empty" } };
const attack: Req = { method: "POST", headers: { "sec-fetch-site": "cross-site", "sec-fetch-mode": "navigate", "sec-fetch-dest": "document" } };
console.log("hujum:", deleteVehicle(attack, "v2"));
console.log("o'zimiz:", deleteVehicle(own, "v1"));
console.log("qoldi:", [...vehicles].join(",") || "-");
```

```text
hujum: 403: cross-site so'rov rad etildi
o'zimiz: o'chirildi: v1
qoldi: v2
```

Tuzatish nima uchun yetarli. Invariant: yon ta'sirli so'rov faqat same-origin yoki foydalanuvchi bevosita boshlagan bo'lishi mumkin; cross-site POST ilova mantiqiga yetmaydi. Hujumchi sahifasi brauzer yozgan `Sec-Fetch-Site` ni o'zgartira olmaydi, shuning uchun ko'rsatilgan hujum yopildi. Xuddi shu natijani CSRF token ham beradi (36-dars); Fetch Metadata uni almashtirmaydi, balki ikkinchi qatlam sifatida ishlatiladi.

Yopilmagani. `curl` bilan soxta header yuborish (lekin unda qurbon cookie'si yo'q); `Sec-Fetch-*` ni yubormaydigan brauzerlar (zaxira tekshiruv Origin bo'yicha, Origin ham bo'lmasa so'rov o'tadi, shuning uchun autentifikatsiya baribir kerak); GET orqali yon ta'sir; hamda same-site hujum, agar siz same-site ni ruxsat etgan bo'lsangiz.

## Qachon qo'llamaslik kerak

- Ommaviy API, webhook yoki boshqa saytlar tomonidan chaqiriladigan endpoint'larga bu policy qo'llanmaydi: ular cross-site so'rov olishi kerak. Policy'ni faqat brauzer foydalanuvchisiga xizmat qiladigan yo'llarga bering.
- OAuth redirect va to'lov tizimlaridan qaytish kabi oqimlar cross-site navigatsiya bilan keladi, ba'zan `POST` bilan (form_post). Policy bunday maxsus yo'llarni istisno qilishi kerak.
- COEP `require-corp` uchinchi tomon resurslariga tayanadigan sayt uchun amaliy emas: har resursga CORP/CORS kerak. SharedArrayBuffer yoki aniq taymer kerak bo'lmasa yoqmang.
- COOP `same-origin` OAuth popup va to'lov oynalari kabi `window.open` orqali aloqaga tayanadigan oqimlarni buzadi. Bunday holda `same-origin-allow-popups` yumshoqroq variantni ko'ring va sinab chiqing.
- Fetch Metadata CSRF token va SameSite cookie'ning o'rnini bosuvchi yagona himoya sifatida ishlatilmasin, ayniqsa eski brauzerlar uchun zaxira bo'lmasa.

## Stack'da: Fastify va Next.js

Fastify'da policy `onRequest` hook'ida bajariladi; Next.js'da middleware ichida `request.headers.get("sec-fetch-site")` o'qiladi (xuddi shu mantiq). Quyidagi kod ishga tushirilmaydi (framework kerak), sintaksis jihatidan tekshirilgan.

```ts
import Fastify from "fastify";

const app = Fastify();
const APP_ORIGIN = "https://app.fleet.example";

app.addHook("onRequest", async (req, reply) => {
  reply.header("Vary", "Sec-Fetch-Site, Sec-Fetch-Mode, Sec-Fetch-Dest");
  const site = req.headers["sec-fetch-site"];
  if (!site) {
    const origin = req.headers["origin"];
    if (origin !== undefined && origin !== APP_ORIGIN) return reply.code(403).send();
    return;
  }
  if (site === "same-origin" || site === "none") return;
  const safe = req.method === "GET" || req.method === "HEAD";
  const nav = req.headers["sec-fetch-mode"] === "navigate" && req.headers["sec-fetch-dest"] === "document";
  if (!(safe && nav)) return reply.code(403).send();
});

// Shaxsiy javoblarga CORP va COOP
app.addHook("onSend", async (_req, reply) => {
  reply.header("Cross-Origin-Resource-Policy", "same-origin");
  reply.header("Cross-Origin-Opener-Policy", "same-origin");
});
```

Webhook yo'llarini bu hook'dan oldin alohida plagin (encapsulation) ichiga oling, ya'ni policy faqat brauzer API'lariga bog'langan bo'lsin. OWASP cheat sheet ham shuni aytadi: cross-origin so'rov qabul qilishi ko'zda tutilgan endpoint'lar (CORS API, uchinchi tomon integratsiyasi, webhook) global rad qoidasidan alohida istisno qilinib, CORS, autentifikatsiya va log bilan himoyalanadi. NestJS'da shu mantiq global guard yoki middleware bo'lishi mumkin; Helmet ning standart to'plami (NestJS hujjatidagi jadval) `Cross-Origin-Opener-Policy` va `Cross-Origin-Resource-Policy` ni `same-origin` qilib qo'yadi, `Cross-Origin-Embedder-Policy` ni esa yubormaydi.

## Xulosa

- `Sec-Fetch-Site`, `-Mode`, `-Dest`, `-User` brauzer qo'yadigan va sahifa kodi o'zgartira olmaydigan header'lar; server ular bilan so'rov kontekstini biladi.
- Resource isolation policy: same-origin va foydalanuvchi boshlagan so'rovlar ruxsat, boshqa saytdan faqat xavfsiz metodli navigatsiya, qolgani rad.
- Eski brauzerlar uchun Origin bo'yicha zaxira tekshiruv majburiy; policy autentifikatsiya va avtorizatsiyani almashtirmaydi, brauzer bo'lmagan mijozlarni to'xtatmaydi.
- CORP javobni cross-origin embed qilinishidan himoya qiladi (so'rov baribir yuboriladi), COEP embedder tomonidan ruxsatsiz resurslarni bloklaydi, COOP browsing context group'ni ajratadi.
- COOP va COEP birga cross-origin isolated holat beradi (SharedArrayBuffer kabi imkoniyatlar uchun); ularni yoqish ilovani sindirishi mumkin, shuning uchun kerak bo'lganda yoqing.
- GET orqali yon ta'sir va ishonchli bo'lmagan subdomenlar policy teshiklari bo'lib qoladi.
