---
n: 2
slug: hujumchi-modeli
title: "Hujumchi modeli va attack surface"
summary: "Hujumchi kim ekanini (imkoniyat, kirish darajasi, maqsad) aniqlash, attack surface nima va uni qanday sanash hamda qisqartirish, hamda yo'l normalizatsiyasidagi nomuvofiqlik tufayli ichki endpoint'ga o'tish misoli."
duration: 40
sources:
  - id: t10-risks
    note: "Risk zanjiri: threat agent, attack vector, nazorat yetishmasligi, texnik va biznes ta'sir; ya'ni hujumchi tomoni risk tavsifining boshlanishi"
  - id: cs-threat-model
    note: "Threat Modeling Cheat Sheet: jarayon tizimni modellashtirishdan (DFD, trust boundary, tashqi entity'lar) boshlanadi; threat modeling tizimga hujumchi nuqtai nazaridan qaraydi"
  - id: wstg
    note: "WSTG Information Gathering bo'limi: Attack Surface Identification va Identify Application Entry Points sahifalari bor; sinash kirish nuqtalarini aniqlashdan boshlanadi"
  - id: cs-attack-surface
    note: "Attack Surface Analysis Cheat Sheet: attack surface ta'rifi (ma'lumot kirish va chiqish yo'llari, ularni himoya qiluvchi kod, qimmatli ma'lumot), foydalanuvchi turlari bilan qoplash, ikki chekka: anonim va yuqori huquqli foydalanuvchi"
quiz:
  - q: "Quyidagilardan qaysi biri hujumchi modelini to'g'ri tavsiflaydi?"
    options:
      - "Eng mashhur hujum turlarining ro'yxati"
      - "Hujumchining kim ekani, nimaga kira olishi, nimani xohlashi va nimaga qodir ekanligi haqidagi aniq farazlar"
      - "Barcha endpoint'larning Swagger hujjati"
      - "Penetration test hisoboti"
    answer: 1
    explain: "Hujumchi modeli faraz: kim, qanday kirish darajasi bilan, qanday maqsadda va qanday imkoniyat bilan hujum qiladi. Hujum turlari ro'yxati, endpoint hujjati va pentest hisoboti boshqa narsalar; ular modelga kirish yoki undan chiqish bo'lishi mumkin, o'zi emas."
  - q: "Mijoz kompaniyasi xodimi tizimga qonuniy kirgan va o'z mashinalarini ko'ra oladi. Uni hujumchi modeliga qo'shish kerakmi?"
    options:
      - "Yo'q, u autentifikatsiyadan o'tgan, demak ishonchli"
      - "Faqat u administrator bo'lsa"
      - "Ha: autentifikatsiyalangan foydalanuvchi ham boshqa tenant ma'lumotiga yoki ruxsat etilmagan funksiyaga urinishi mumkin"
      - "Yo'q, bu faqat HR muammosi"
    answer: 2
    explain: "Ko'p real zaiflik (masalan boshqa tenant ma'lumotiga o'tish) aynan kirgan foydalanuvchi tomonidan ishlatiladi. Autentifikatsiya shaxsni tasdiqlaydi, nima qilishga haqli ekanini emas."
  - q: "Attack surface qisqartirishning eng to'g'ri misoli qaysi?"
    options:
      - "Debug endpoint'ni production'da o'chirib, faqat kerakli yo'llarni ro'yxat bilan ochiq qoldirish"
      - "Endpoint'larni `/api/v2` ostiga ko'chirish"
      - "Xatolik matnlarini uzunroq qilish"
      - "Hamma endpoint'ga bir xil rate limit qo'yish"
    answer: 0
    explain: "Attack surface kirish nuqtalari va ma'lumot chiqish nuqtalari yig'indisi; ularni kamaytirish eng ishonchli yo'l. Yo'l prefiksini o'zgartirish yoki rate limit nuqtalar sonini kamaytirmaydi."
  - q: "Gateway `req.path.startsWith(\"/internal\")` bo'lsa so'rovni rad etadi. Ilova esa yo'lni `URL` bilan normalizatsiya qilib marshrutlaydi. `/api/../internal/metrics` so'rovi nima bo'ladi?"
    options:
      - "Rad etiladi: prefiks `/api` bilan boshlanadi, tekshiruv mos kelmaydi"
      - "Rad etiladi, chunki `..` taqiqlangan"
      - "Gateway tekshiruvidan o'tadi, ilova esa uni `/internal/metrics` ga normalizatsiya qiladi"
      - "400 xato qaytadi"
    answer: 2
    explain: "Ikki komponent bitta yo'lni turlicha talqin qiladi: gateway xom satrni, ilova normalizatsiya qilingan yo'lni ko'radi. Tekshiruvni marshrutlash ishlatadigan qiymatga qo'llash kerak."
  - q: "Qaysi hujumchi tavsifi foydali model qismi bo'la oladi?"
    options:
      - "\"Hujumchi juda mohir va hamma narsani biladi\""
      - "\"Bizga hech kim hujum qilmaydi\""
      - "\"Autentifikatsiyalangan tenant foydalanuvchisi, brauzer va HTTP so'rovlarini erkin o'zgartira oladi, lekin serverga kod yuklay olmaydi\""
      - "\"Hujumchi bu hacker guruhi\""
    answer: 2
    explain: "Foydali model aniq imkoniyat va chegarani beradi, shunda nimadan himoyalanishni va nimadan himoyalanmaslikni hal qilish mumkin. \"Hamma narsani biladi\" va \"hech kim hujum qilmaydi\" chegaralarni ko'rsatmaydi."
  - q: "Attack surface haqida qaysi gap noto'g'ri?"
    options:
      - "Yangi endpoint, yangi integratsiya va yangi bog'liqlik surface'ni kengaytiradi"
      - "Surface faqat internetga ochiq portlardan iborat"
      - "Ma'lumot chiqish nuqtalari (eksport, log, xato javobi) ham surface'ga kiradi"
      - "Surface'ni kamaytirish riskni kamaytiradi"
    answer: 1
    explain: "Surface ochiq portlar bilan cheklanmaydi: autentifikatsiyalangan funksiyalar, fayl yuklash, webhook, eksport, log va uchinchi tomon integratsiyalari ham kiradi."
task:
  title: "Ichki endpoint'larga kirishni normalizatsiyadan keyin tekshirish"
  prompt: |
    Gateway'ning `isBlocked(rawPath)` funksiyasi `/internal` bilan boshlanadigan yo'llarni rad etadi. Ilova esa yo'lni `URL` yordamida normalizatsiya qilib marshrutlaydi (`resolve`). Hozir `/api/../internal/metrics` tekshiruvdan o'tib, ichki endpoint'ga yetib boradi.

    Funksiyani tuzating: tekshiruv marshrutlash ishlatadigan normalizatsiya qilingan yo'lga qo'llansin (`%2e%2e` ko'rinishi ham), `/internal` va uning ichidagi hamma yo'llar rad etilsin, lekin `/internals-doc` kabi boshqa yo'l ruxsat etilsin. Imzoni o'zgartirmang. Chiqish: oddiy yo'l uchun `false`, qolgan hujum yo'llari uchun `true`.
  lang: ts
  starter: |
    function resolve(rawPath: string): string {
      return new URL(rawPath, "http://gateway.local").pathname;
    }

    // Gateway tekshiruvi: true bo'lsa so'rov rad etiladi.
    function isBlocked(rawPath: string): boolean {
      return rawPath.startsWith("/internal");
    }

    const paths = [
      "/api/vehicles",
      "/internal/metrics",
      "/api/../internal/metrics",
      "/api/%2e%2e/internal/metrics",
      "/internals-doc",
    ];
    for (const p of paths) {
      console.log(p.padEnd(30), "->", resolve(p).padEnd(20), "rad:", isBlocked(p));
    }
  solution: |
    function resolve(rawPath: string): string {
      return new URL(rawPath, "http://gateway.local").pathname;
    }

    // Gateway tekshiruvi: true bo'lsa so'rov rad etiladi.
    function isBlocked(rawPath: string): boolean {
      const p = resolve(rawPath); // marshrutlash ishlatadigan qiymat
      return p === "/internal" || p.startsWith("/internal/");
    }

    const paths = [
      "/api/vehicles",
      "/internal/metrics",
      "/api/../internal/metrics",
      "/api/%2e%2e/internal/metrics",
      "/internals-doc",
    ];
    for (const p of paths) {
      console.log(p.padEnd(30), "->", resolve(p).padEnd(20), "rad:", isBlocked(p));
    }
  solutionNotes: |
    - Tekshiruv va marshrutlash bitta `resolve` funksiyasidan foydalanadi, shuning uchun ular bir yo'lni bir xil ko'radi. Nomuvofiqlik zaiflikning o'zi edi.
    - `/internal/` chegarasi bilan solishtirish `/internals-doc` ni noto'g'ri rad etmaydi.
    - Bu faqat shu yo'l hiylalarini yopadi. Haqiqiy himoya ichki endpoint'ni umuman ochiq listener'da bermaslik yoki autentifikatsiya talab qilish: prefiks bo'yicha rad etish ikkinchi qatlam.
    - Boshqa kodlash hiylalari (masalan, ikki marta kodlash yoki backslash) proksi va ilova parserlariga bog'liq; ularni 11 va 20-darslarda ko'ramiz.
  checklist:
    - "Normalizatsiyadan keyingi yo'l tekshiriladi"
    - "`../` va `%2e%2e` hujumlari rad etiladi"
    - "`/internals-doc` ruxsat etiladi"
    - "Tekshiruv va marshrutlash bitta funksiyadan foydalanadi"
    - "Ichki endpoint'ni ochiq listener'dan olib tashlash asosiy yechim ekanini tushuntira olasiz"
---

## Muammo

Jamoalarda "hujumchi" so'zi odatda noaniq obraz: kimdir qorong'u xonada, internetdan platformani buzmoqchi. Bunday obrazga qarshi himoya ham noaniq bo'ladi: "firewall qo'ydik, HTTPS bor". Real hodisalarning ko'pi esa boshqa joydan chiqadi. Mijoz kompaniyasining qonuniy foydalanuvchisi boshqa kompaniya mashinasini ko'radi, ish haqi to'lanmagan xodim eksportni yuklab oladi, ichki monitoring endpoint'i tasodifan internetga ochiq qoladi, bog'liqlikdagi paketga zararli kod tushadi. Hujumchi har safar boshqa, imkoniyati ham boshqa.

Ikkinchi og'riq: himoya qilinadigan joylar soni nazoratsiz o'sadi. Har sprintda yangi endpoint, yangi webhook, yangi integratsiya qo'shiladi. Har biri tizimga kirishning yangi yo'li. Kim ularni sanagan? Ko'p jamoada javob yo'q, shuning uchun "unutilgan" debug endpoint, eski API versiyasi, test uchun ochilgan admin yo'li production'da qoladi.

Bu darsda ikki narsani aniq qilamiz: hujumchi modeli (kim, nima bilan, nimani xohlab hujum qiladi) va attack surface (hujumchi tizim bilan o'zaro ta'sirga kira oladigan barcha nuqtalar). Ikkalasi ham threat modeling (4-dars) kirishi: avval kimdan va qayerdan himoyalanishni bilish kerak.

## Asosiy g'oya

### Hujumchi modeli

Hujumchi modeli - hujumchi haqidagi aniq farazlar to'plami. Foydali model to'rt savolga javob beradi:

1. Kim? Anonim internet foydalanuvchisi, autentifikatsiyalangan mijoz xodimi, ichki xodim, uchinchi tomon integratsiyasi, bog'liqlik muallifi.
2. Qanday kirish darajasi bilan? Faqat ochiq sahifalar, oddiy akkaunt, admin akkaunt, tarmoq ichida, qurilmaning o'zi.
3. Nimaga qodir? So'rovlarni cheksiz o'zgartira oladimi, trafikni ko'ra oladimi, serverda kod bajara oladimi.
4. Nimani xohlaydi? Ma'lumotni olish, o'zgartirish, xizmatni to'xtatish, pul topish.

OWASP Top 10:2025 ning risk tavsifi zanjirni threat agent'dan boshlaydi, keyin attack vector, nazorat yetishmasligi, texnik va biznes ta'sir. Ya'ni hujumchi tomoni har bir risk tavsifining birinchi bo'g'ini. Threat Modeling Cheat Sheet threat modeling'ni tizimga hujumchi nuqtai nazaridan qarash deb ta'riflaydi va jarayonni tizimni modellashtirishdan boshlaydi: trust boundary, data flow, data store va tizim bilan o'zaro ta'sir qiluvchi tashqi entity'lar aniq ko'rinishi kerak. Hujumchi modeli yo'q joyda "xavfsiz" degan hukm ham mazmunsiz: kimdan xavfsiz?

Avtopark platformasi uchun amaliy ro'yxat (kursning ishchi modeli, rasmiy tasnif emas):

| Hujumchi | Kirish darajasi | Odatiy maqsad |
|---|---|---|
| Anonim tashqi | Ochiq sahifa va endpoint'lar | Akkaunt egallash, ochiq ma'lumot yig'ish, xizmatni band qilish |
| Boshqa tenant foydalanuvchisi | Qonuniy akkaunt | Raqobatchi mashina joylashuvini ko'rish |
| Shu tenant'ning nohalol xodimi | Qonuniy akkaunt, ba'zan admin | Yoqilg'i hisobotini soxtalashtirish, ma'lumotni olib chiqish |
| Egallangan qurilma yoki datchik | Ingest kanaliga yozish | Soxta telemetriya yuborish |
| Zararli bog'liqlik yoki uchinchi tomon | Ilova jarayoni ichida | Maxfiy kalitlarni o'qish |
| Ichki operator (xato yoki niyat) | Admin panel, baza | Noto'g'ri eksport, ruxsatsiz kirish |

Modelda eng ko'p e'tibordan chetda qoladigan qator ikkinchisi va uchinchisi: ular "tizimga kirgan" va shuning uchun ularning so'rovlari oddiy foydalanuvchi so'rovidan farq qilmaydi. Autentifikatsiya kimligingizni tasdiqlaydi, nima qilishga haqli ekaningizni emas (51-dars).

Modelga chegara ham kiradi. Hamma narsaga qodir hujumchini faraz qilsangiz, hech qaysi nazorat yetarli ko'rinmaydi. "Hujumchi serverga ildiz huquqi bilan kirgan" bo'lsa, ilova darajasidagi himoya ma'nosiz bo'ladi, va bu sizning ilova xavfsizligingiz masalasi emas, infratuzilma masalasi. Model qaysi hujumchilarni qamrab olishingizni va qaysilarini ongli ravishda qamramasligingizni yozib qo'yishi kerak.

### Attack surface

Attack surface - hujumchi tizimga ma'lumot kirita oladigan yoki tizimdan ma'lumot ola oladigan barcha nuqtalar yig'indisi. Attack Surface Analysis Cheat Sheet surface'ni hujumchi tizimga kira oladigan va undan ma'lumot ola oladigan barcha nuqtalar sifatida ta'riflaydi; sahifa uni to'rt qismga bo'ladi: ma'lumot va buyruqlarning ilovaga kirish va undan chiqish yo'llari yig'indisi, shu yo'llarni himoya qiluvchi kod (autentifikatsiya, avtorizatsiya, logging, validatsiya), ilovadagi qimmatli ma'lumot (kalitlar, shaxsiy ma'lumot, biznes ma'lumoti) va uni himoya qiluvchi kod. WSTG ham Information Gathering bo'limida Attack Surface Identification va Identify Application Entry Points sahifalarini beradi: sinash kirish nuqtalarini aniqlashdan boshlanadi. Surface faqat internetga ochiq portlar emas:

- Kirish nuqtalari: HTTP endpoint'lar, WebSocket, fayl yuklash, webhook qabul qiluvchi, qurilma ingest kanali, admin panel, GraphQL schema, xabar navbati (queue) iste'molchilari.
- Chiqish nuqtalari: javoblar, xato matnlari, loglar, eksport fayllari, email va SMS xabarlari.
- Kod va bog'liqlik: har bir npm paketi, build skripti, CI integratsiyasi, bazadagi kengaytma.
- Odamlar va jarayonlar: support xodimi parolni tiklay oladimi, kim productionga kira oladi.

Cheat sheet surface'ni foydalanuvchi turlari (rollar, huquq darajalari) bilan qoplashni va ikki chekkaga, ya'ni anonim foydalanuvchi va yuqori huquqli administratorga, alohida e'tibor berishni tavsiya qiladi; nuqtalarni tur bo'yicha guruhlab (login, admin interfeys, qidiruv, CRUD formalar, tranzaksion API, boshqa tizimlar bilan interfeys) sanash ham u yerda berilgan. Shu asosda har nuqta uchun uchta narsa yoziladi: kim kira oladi (anonim, foydalanuvchi, admin, ichki), nima kiritadi (turi, hajmi, formati) va nima qaytaradi. Quyidagi kod oddiy inventar va uni baholashni ko'rsatadi:

```ts run
type Entry = { path: string; who: "anon" | "user" | "admin" | "internal"; inputs: number; exposed: boolean };

const inventory: Entry[] = [
  { path: "POST /auth/login", who: "anon", inputs: 2, exposed: true },
  { path: "GET /vehicles/:id/readings", who: "user", inputs: 3, exposed: true },
  { path: "POST /vehicles/:id/export", who: "user", inputs: 4, exposed: true },
  { path: "POST /webhooks/fuel-provider", who: "anon", inputs: 5, exposed: true },
  { path: "GET /admin/tenants", who: "admin", inputs: 1, exposed: true },
  { path: "GET /internal/metrics", who: "internal", inputs: 0, exposed: true },
  { path: "GET /debug/heap", who: "internal", inputs: 0, exposed: true },
];

// Eng oddiy ko'rsatkich: anonim va ichki yo'llar ochiq bo'lsa, ular alohida e'tibor talab qiladi.
const flagged = inventory.filter((e) => e.exposed && (e.who === "anon" || e.who === "internal"));
console.log("jami kirish nuqtasi:", inventory.length);
for (const e of flagged) console.log("tekshirish kerak:", e.path.padEnd(30), e.who);
```

```text
jami kirish nuqtasi: 7
tekshirish kerak: POST /auth/login               anon
tekshirish kerak: POST /webhooks/fuel-provider   anon
tekshirish kerak: GET /internal/metrics          internal
tekshirish kerak: GET /debug/heap                internal
```

Inventar to'rt nuqtani ajratdi: ikkita anonim kirish va ikkita ichki yo'l ochiq. Ichki yo'llar ochiq listener'da bo'lmasligi kerak edi; bu keyingi bo'limdagi misolning sababi.

## Chuqurroq: surface'ni qisqartirish va nomuvofiqliklar

### Qisqartirish

Surface'ni kamaytirish riskni kamaytirishning eng arzon yo'li, chunki yo'q kod zaiflik ham bermaydi. Amaliy qoidalar:

- Ishlatilmaydigan endpoint, eski API versiyasi, debug va ichki yo'llarni production'dan olib tashlang. Ichki endpoint'larni ochiq listener'da emas, alohida portda yoki alohida servisda, tarmoq darajasida yopib bering.
- Ruxsat ro'yxati (allowlist) bilan ishlang: ochiq yo'llar ro'yxati kodda aniq, qolgan hammasi yopiq. Bu fail-safe default tamoyili (3-dars).
- Funksiyani kamaytiring: eksportda har maydonni emas, kerakli maydonni bering; xato javobida ichki tafsilot bermang.
- Bog'liqliklarni kamaytiring (81-dars): har paket sizning kodingiz kabi surface.

### Surface'ni baholash va o'zgarishini kuzatish

Attack Surface Analysis Cheat Sheet nuqtalarni bittalab sanashni emas, ularni tur bo'yicha guruhlab (tashqi yoki ichki, vazifasi, texnologiyasi), har turdagi nuqtalar sonini hisoblab, har turdan namuna tanlab ko'rishni tavsiya qiladi. Shunda har endpoint'ni bilmasdan ham risk profilini tushunish va tekshiruv hajmini rejalashtirish mumkin, profil sezilarli o'zgarganini ham payqaysiz. Yuqori risk joylari sifatida sahifa quyidagilarni sanaydi: internetga qaragan kod, ayniqsa anonim kirish mumkin bo'lgan joylar; tashqaridan keladigan fayllar; eski tizimlar bilan orqaga moslik interfeyslari (eski protokol va kutubxonalar, bir necha versiyani qo'llab-quvvatlash qiyin); maxsus API'lar (dizayn va amalda xato ehtimoli yuqori); kriptografiya, autentifikatsiya, avtorizatsiya va session boshqaruvi kodi.

Sahifadagi yana ikki kuzatuv amaliy ahamiyatga ega. Birinchisi, bir ilovaning bir necha versiyasini ishga tushirib qo'yish, "kerak bo'lib qolar" deb ishlatilmaydigan funksiyani qoldirish, eski zaxira nusxalar va ishlatilmagan kod surface'ni kengaytiradi; kodni boshqarish va o'zgarishlarni boshqarish amaliyoti haqiqatda joylangan surface'ning rejadagi surface bilan mos bo'lishini ta'minlashi kerak. Zaxira nusxalar (kod va ma'lumot, onlayn va oflayn) surface'ning e'tibordan chetda qoladigan qismi: ilovani xavfsiz yozib, zaxirani himoyasiz qoldirsangiz, hammasi bekor ketadi. Ikkinchisi, boshqarish bosqichi: baseline bo'lgach, har o'zgarishda "nima o'zgardi, qanday yangi teshik ochilishi mumkin" deb so'rash kerak. Shuning uchun inventar bir martalik hujjat emas: u kod bilan birga yangilanadi, masalan har yangi endpoint pull request'ida inventarga qator qo'shiladi.

Cheat sheet'ning o'zi ham chegarasini aytadi: uning fokusi ilovani tashqi hujumdan himoya qilish, ya'ni tizim foydalanuvchilari yoki operatorlariga qaratilgan hujumlar (masalan malware injection, social engineering) uning doirasiga kirmaydi; ichki tahdidlarga ham kamroq e'tibor beradi. Bu hujumchi modelini yozishda ham o'rinli: surface tahlili va hujumchi modeli bir-birini to'ldiradi, lekin ikkalasi ham nimani qamramasligini ochiq yozishi kerak.

### Ikki parser, bitta yo'l

Surface haqidagi eng nozik tuzoq: tizimning ikki komponenti bitta ma'lumotni turlicha talqin qiladi. Gateway yoki WAF yo'lni xom satr sifatida tekshiradi, ilova esa uni normalizatsiya qiladi (`..` ni hisoblaydi, `%2e` ni nuqtaga aylantiradi) va keyin marshrutlaydi. Tekshirilgan qiymat va ishlatilgan qiymat farq qilsa, tekshiruvni chetlab o'tish mumkin. Bu umumiy naqsh (check va use qiymatlari turlicha) va HTTP darajasida ko'p shaklda uchraydi: proksi va ilova header'larni turlicha o'qiydi (11 va 20-darslar). Qoida: tekshiruv aynan marshrutlash yoki bajarish ishlatadigan qiymatga qo'llanadi, ideal holda bitta funksiya orqali.

## Misol: ichki endpoint'ga yo'l

Kod to'liq o'quv maqsadida: u faqat bizning `resolve` va `isBlocked` funksiyalarimizga qarshi ishlaydi, real gateway yo'q.

### 1. Zaif kod

```ts run
// Ilova yo'lni normalizatsiya qilib marshrutlaydi.
function resolve(rawPath: string): string {
  return new URL(rawPath, "http://gateway.local").pathname;
}

// ZAIF: gateway xom satrni tekshiradi, ilova esa normalizatsiya qilingan yo'lni ishlatadi
function isBlockedWeak(rawPath: string): boolean {
  return rawPath.startsWith("/internal");
}

function handle(rawPath: string): string {
  if (isBlockedWeak(rawPath)) return "403";
  return resolve(rawPath).startsWith("/internal") ? "200 ichki metrikalar" : "200 oddiy javob";
}

for (const p of ["/internal/metrics", "/api/../internal/metrics", "/api/%2e%2e/internal/metrics"]) {
  console.log(p.padEnd(32), "->", handle(p));
}
```

### 2. Hujum

Hujumchi oddiy tashqi foydalanuvchi: faqat so'rov yo'lini o'zgartiradi. To'g'ridan-to'g'ri `/internal/metrics` rad etiladi, lekin `..` yoki `%2e%2e` bilan yozilgan yo'l gateway tekshiruvidan o'tadi, ilova esa uni `/internal/metrics` ga aylantiradi:

```text
/internal/metrics                -> 403
/api/../internal/metrics         -> 200 ichki metrikalar
/api/%2e%2e/internal/metrics     -> 200 ichki metrikalar
```

Zaiflik tekshiruv bilan marshrutlash o'rtasidagi nomuvofiqlikda. Gateway tekshiruvi o'zi to'g'ri ishlaydi, lekin noto'g'ri qiymatga qo'llangan.

### 3. Tuzatilgan kod

```ts run
function resolve(rawPath: string): string {
  return new URL(rawPath, "http://gateway.local").pathname;
}

// Tekshiruv marshrutlash ishlatadigan qiymatga qo'llanadi
function isBlocked(rawPath: string): boolean {
  const p = resolve(rawPath);
  return p === "/internal" || p.startsWith("/internal/");
}

function handle(rawPath: string): string {
  if (isBlocked(rawPath)) return "403";
  return "200 oddiy javob";
}

for (const p of ["/internal/metrics", "/api/../internal/metrics", "/api/%2e%2e/internal/metrics", "/internals-doc"]) {
  console.log(p.padEnd(32), "->", handle(p));
}
```

```text
/internal/metrics                -> 403
/api/../internal/metrics         -> 403
/api/%2e%2e/internal/metrics     -> 403
/internals-doc                   -> 200 oddiy javob
```

Endi tekshiruv va marshrutlash bitta `resolve` ga tayanadi, shuning uchun ular bir yo'lni bir xil ko'radi. Bu ko'rsatilgan hujumlar uchun yetarli. Yopilmagan qoldiq risk: boshqa kodlash hiylalari (ikki marta kodlash, backslash, proksi va ilova parserlari farqi) alohida tekshirilishi kerak, va prefiks bo'yicha rad etish hech qachon asosiy himoya bo'lmasligi kerak: `/internal` yo'llarini ochiq listener'dan olib tashlash yoki autentifikatsiya talab qilish ishonchliroq. Prefiks tekshiruvi ikkinchi qatlam.

## Qachon qo'llamaslik kerak

- Hujumchi modelini juda batafsil qilish foyda bermaydi. Kichik jamoa uchun bir sahifa, to'rt-olti hujumchi turi va ularning qisqa tavsifi yetarli. Hujjat kodga ta'sir qilmasa, u ortiqcha.
- Modelga ilova xavfsizligi hal qila olmaydigan hujumchini (masalan, serverga ildiz huquqi bilan kirgan) kiritib, uni "qamrab olgan" deb o'ylamang. Bunday hujumchini ongli ravishda doiradan chiqarib, infratuzilma darajasidagi nazoratlarga havola qiling (86 va 87-darslar).
- Surface'ni kamaytirishni biznes talabiga qarshi qo'ymang. Ba'zi endpoint'lar mijozga kerak; maqsad ularni yo'q qilish emas, har birining kirish huquqi, kiritish va qaytarishini bilib turish.
- Hujumchi qanchalik "mohir" ekani haqidagi taxminga tayanib qaror qilmang. Modelga motivatsiya va imkoniyat kiradi, mahorat emas: avtomatlashtirilgan vositalar mahoratni arzonlashtiradi. Bu kursning ishchi xulosasi, rasmiy da'vo emas.

## Stack'da: NestJS va Next.js

NestJS'da surface'ni kodda ko'rinadigan qilish mumkin: global guard'ni default yopiq qilib, ochiq yo'llarni maxsus dekorator (masalan `@Public()`) bilan belgilash. Shunda har yangi endpoint avtomatik autentifikatsiya talab qiladi va "unutilgan ochiq endpoint" ehtimoli kamayadi. Quyidagi kod ishga tushirilmaydi (NestJS brauzer worker'ida yo'q), faqat sintaksis jihatidan to'g'ri:

```ts
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const IS_PUBLIC = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true; // faqat aniq belgilangan yo'llar ochiq
    const req = ctx.switchToHttp().getRequest<{ user?: unknown }>();
    return Boolean(req.user); // qolgan hamma narsa default yopiq
  }
}
```

Next.js'da ham har route handler va server action alohida kirish nuqtasi: ularni inventarga qo'shish kerak, chunki ular ham ommaviy HTTP endpoint (58-dars). Fastify yoki Express'da ichki endpoint'larni (metrics, health) alohida portda tinglash mumkin: ochiq listener'da ular umuman yo'q bo'ladi.

## Xulosa

- Hujumchi modeli: kim, qanday kirish darajasi bilan, nimaga qodir va nimani xohlaydi. Model chegarani ham yozadi: nimani qamramaymiz.
- Autentifikatsiyalangan foydalanuvchi, ichki xodim, qurilma va bog'liqlik ham hujumchi bo'lishi mumkin.
- Attack surface - kirish va chiqish nuqtalari yig'indisi; uni sanamaguncha himoyalab bo'lmaydi.
- Surface'ni qisqartirish riskni kamaytirishning eng arzon yo'li: ishlatilmaydigan yo'llarni olib tashlang, allowlist bilan ishlang.
- Tekshiruv qiymati va ishlatiladigan qiymat bir xil bo'lishi shart; ikki parser orasidagi farq tekshiruvni chetlab o'tishga olib keladi.
