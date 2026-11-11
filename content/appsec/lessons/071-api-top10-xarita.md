---
n: 71
slug: api-top10-xarita
title: "OWASP API Security Top 10 (2023): xarita"
summary: "OWASP API Security Top 10 (2023) ning o'nta kategoriyasi, ularning veb ilova xavflaridan farqi, har kategoriyaning kursdagi darsga bog'lanishi, API inventarizatsiyasi va har endpoint uchun siyosatni majburiy qilish."
duration: 40
sources:
  - id: api-top10
    note: "2023 ro'yxati: API1 dan API10 gacha kategoriya nomlari; API3 ning 2019 yildagi Excessive Data Exposure va Mass Assignment ni birlashtirgani; API4, API6, API9, API10 bo'limlaridagi tavsif va 'How To Prevent' ro'yxatlari"
  - id: asvs
    note: "ASVS 5.0.0 bo'limlari: V2 Validation and Business Logic, V4 API and Web Service, V8 Authorization, V16 Security Logging and Error Handling; API xavflari shu bo'limlar bilan kesishadi"
  - id: t10-a01
    note: "A01:2025 Broken Access Control: API1 va API5 ning veb ilova darajasidagi hamkasbi sifatida ishlatiladi"
  - id: nestjs-guards
    note: "NestJS Guards: APP_GUARD token'i bilan global guard ro'yxatdan o'tkazish; ro'yxatga olingan har guard har so'rovda ishlaydi"
quiz:
  - q: "Mijoz `GET /api/trips/8841` ga `8842` ni yozib, boshqa tenant'ning reysini oldi. Foydalanuvchi tizimga kirgan, token to'g'ri. Qaysi kategoriya?"
    options:
      - "API2:2023 Broken Authentication, chunki token tekshirilmagan"
      - "API1:2023 Broken Object Level Authorization, chunki obyekt identifikatori bo'yicha egalik tekshirilmagan"
      - "API5:2023 Broken Function Level Authorization, chunki endpoint admin funksiyasi"
      - "API8:2023 Security Misconfiguration, chunki identifikator ketma-ket"
    answer: 1
    explain: "Foydalanuvchi autentifikatsiyadan o'tgan, muammo aynan shu obyektga ruxsati borligini tekshirmaslikda. Identifikatorning ketma-ketligi faqat topishni osonlashtiradi, sabab emas. Funksiya darajasi esa 'bu rol shu amalni bajara oladimi' savoliga tegishli."
  - q: "API3:2023 nima uchun alohida 'Excessive Data Exposure' va 'Mass Assignment' kategoriyalari o'rniga kiritilgan?"
    options:
      - "Ikkala xato ham bitta kod qatorida uchraydi"
      - "Mass Assignment endi xavfli hisoblanmaydi"
      - "Ikkalasining ildizi bir: obyekt xossalari darajasida avtorizatsiya yo'q yoki noto'g'ri"
      - "Excessive Data Exposure faqat GraphQL'ga tegishli"
    answer: 2
    explain: "OWASP bu kategoriya 2019 yildagi ikki kategoriyani birlashtirib, asosiy sababga, ya'ni xossa darajasidagi avtorizatsiya yo'qligiga qaratilganini yozadi. Biri javobda ortiqcha maydon qaytishi, ikkinchisi so'rovdan ortiqcha maydon qabul qilinishi, lekin sabab bitta."
  - q: "Jamoa eski `/api/v1/vehicles` ni 'ishlatilmaydi' deb hujjatdan olib tashladi, lekin server hali javob beradi. Bu qaysi xavf va nega xavfli?"
    options:
      - "API9:2023 Improper Inventory Management; eski versiya yangi versiyadagi tuzatishlarsiz va nazoratsiz qolishi mumkin"
      - "API4:2023; eski versiya ko'proq xotira ishlatadi"
      - "API10:2023; eski versiya uchinchi tomon API'ni chaqiradi"
      - "Xavf emas: hujjatda yo'q endpoint'ni hujumchi topa olmaydi"
    answer: 0
    explain: "Inventarizatsiyada yo'q, lekin tarmoqda ochiq endpoint nazoratsiz qoladi: yangi versiyaga qo'yilgan tekshiruvlar unga qo'llanmagan bo'lishi mumkin. 'Hujjatda yo'q, demak topilmaydi' degan taxmin xavfsizlik nazorati emas."
  - q: "Quyidagilardan qaysi biri API4:2023 Unrestricted Resource Consumption uchun OWASP tavsiya qilgan nazoratga kiradi?"
    options:
      - "Barcha javoblarni Base64 bilan kodlash"
      - "Kiruvchi parametr va payload'lar uchun maksimal o'lchamni (satr uzunligi, massiv elementlari soni, fayl hajmi) belgilash"
      - "Barcha endpoint'larni faqat POST qilish"
      - "Xatolarni mijozga batafsil qaytarish"
    answer: 1
    explain: "OWASP ro'yxatida kiruvchi ma'lumot o'lchamiga chegara, so'rovlar chastotasi, qaytariladigan yozuvlar sonini boshqaruvchi parametrni server tomonda tekshirish va uchinchi tomon xizmatlari uchun xarajat limiti bor. Boshqa variantlar resurs sarfiga ta'sir qilmaydi."
  - q: "Servisingiz uchinchi tomon geokodlash API'sidan kelgan javobni tekshirmasdan SQL so'roviga qo'shadi, chunki 'bu ishonchli provayder'. Qaysi kategoriya va to'g'ri munosabat nima?"
    options:
      - "API7:2023 SSRF; provayderga so'rov yuborishni taqiqlash"
      - "API8:2023; provayderni boshqa hostga ko'chirish"
      - "API6:2023; provayderga so'rovlarni kamaytirish"
      - "API10:2023 Unsafe Consumption of APIs; provayder javobi ham kirish ma'lumoti, uni tekshirish va parametrlash kerak"
    answer: 3
    explain: "API10 aynan integratsiya qilingan API'larga ishonib, ularning ma'lumotini tekshirmaslik haqida. Provayder buzilsa yoki xato qaytarsa, zararli ma'lumot sizning SQL'ingizga kiradi. SSRF esa server hujumchi tanlagan URL'ga so'rov yuborishi haqida."
  - q: "OWASP API Security Top 10 va OWASP Top 10:2025 ni birga ishlatishning to'g'ri usuli qaysi?"
    options:
      - "Faqat API ro'yxatini ishlatish, chunki veb ro'yxati eskirgan"
      - "Ikkalasini bir xil deb qarash, farq yo'q"
      - "Veb ro'yxati ilova umumiy xavflari uchun, API ro'yxati esa API'ga xos tuzoqlar (obyekt va xossa darajasi, biznes oqimlar, inventarizatsiya) uchun qo'shimcha linza"
      - "API ro'yxatini faqat public API'larga qo'llash"
    answer: 2
    explain: "Ikki ro'yxat bir-birini to'ldiradi: masalan API1 va API5 veb ro'yxatdagi A01:2025 Broken Access Control bilan kesishadi, lekin API ro'yxati ularni obyekt va funksiya darajasida ajratib beradi. Ichki API'lar ham xuddi shu xavflarga ega."
task:
  title: "Endpoint siyosatini audit qiluvchi funksiya"
  prompt: |
    Platformada endpoint'lar ro'yxati (route table) bor. `audit(routes)` funksiyasi har endpoint uchun API Security Top 10 (2023) kodlarini qaytarishi kerak. Hozir faqat autentifikatsiya yo'qligi (API2) tekshiriladi.

    Qoidalar:
    1. `auth === false` bo'lsa `API2`.
    2. `idParam === true` va `objectCheck === false` bo'lsa `API1`.
    3. `list === true` va `maxPage` berilmagan bo'lsa `API4`.
    4. `status === "retired"` bo'lsa (endpoint hali ro'yxatda, ya'ni hali javob beradi) `API9`.

    Natija: kalit `METHOD path`, qiymat - kodlar massivi, alifbo tartibida. Kod bo'lmagan endpoint natijaga kirmasin. Kutilgan natija: 3 ta endpoint belgilanadi.
  lang: ts
  starter: |
    type Route = {
      method: string; path: string; auth: boolean;
      idParam: boolean; objectCheck: boolean;
      list: boolean; maxPage?: number;
      status: "active" | "deprecated" | "retired";
    };

    const routes: Route[] = [
      { method: "GET", path: "/api/v2/vehicles", auth: true, idParam: false, objectCheck: false, list: true, maxPage: 100, status: "active" },
      { method: "GET", path: "/api/v2/vehicles/:id", auth: true, idParam: true, objectCheck: false, list: false, status: "active" },
      { method: "GET", path: "/api/v1/vehicles", auth: true, idParam: false, objectCheck: false, list: true, status: "retired" },
      { method: "GET", path: "/api/v2/public/status", auth: false, idParam: false, objectCheck: false, list: false, status: "active" },
    ];

    function audit(rs: Route[]): Record<string, string[]> {
      const out: Record<string, string[]> = {};
      for (const r of rs) {
        const codes: string[] = [];
        if (!r.auth) codes.push("API2");
        if (codes.length) out[`${r.method} ${r.path}`] = codes;
      }
      return out;
    }

    const result = audit(routes);
    console.log(Object.keys(result).length, "ta endpoint belgilandi");
    console.log(JSON.stringify(result, null, 1));
  solution: |
    type Route = {
      method: string; path: string; auth: boolean;
      idParam: boolean; objectCheck: boolean;
      list: boolean; maxPage?: number;
      status: "active" | "deprecated" | "retired";
    };

    const routes: Route[] = [
      { method: "GET", path: "/api/v2/vehicles", auth: true, idParam: false, objectCheck: false, list: true, maxPage: 100, status: "active" },
      { method: "GET", path: "/api/v2/vehicles/:id", auth: true, idParam: true, objectCheck: false, list: false, status: "active" },
      { method: "GET", path: "/api/v1/vehicles", auth: true, idParam: false, objectCheck: false, list: true, status: "retired" },
      { method: "GET", path: "/api/v2/public/status", auth: false, idParam: false, objectCheck: false, list: false, status: "active" },
    ];

    function audit(rs: Route[]): Record<string, string[]> {
      const out: Record<string, string[]> = {};
      for (const r of rs) {
        const codes: string[] = [];
        if (!r.auth) codes.push("API2");
        if (r.idParam && !r.objectCheck) codes.push("API1");
        if (r.list && r.maxPage === undefined) codes.push("API4");
        if (r.status === "retired") codes.push("API9");
        if (codes.length) out[`${r.method} ${r.path}`] = codes.sort();
      }
      return out;
    }

    const result = audit(routes);
    console.log(Object.keys(result).length, "ta endpoint belgilandi");
    console.log(JSON.stringify(result, null, 1));
  solutionNotes: |
    - Har qoida bitta kategoriyaga mos keladi va bir endpoint bir necha kod olishi mumkin (`GET /api/v1/vehicles` da API4 va API9). Shuning uchun natija massiv.
    - `maxPage === undefined` tekshiruvi `0` qiymatini "berilgan" deb hisoblaydi; real kodda `0` ni ham noto'g'ri qiymat sifatida rad etish kerak.
    - `/api/v2/public/status` ataylab ochiq endpoint: `auth: false` har doim xato emas, u hujjatlangan qaror bo'lishi mumkin. Audit faqat belgilaydi, qarorni inson qabul qiladi.
    - Bu audit statik deklaratsiyaga tayanadi. Deklaratsiyada `objectCheck: true` deb yozilgan, lekin kodda tekshiruv yo'q bo'lsa, uni faqat test yoki code review topadi (91-dars).
    - Tuzatish API3, API5, API6, API7, API8 va API10 ni qoplamaydi: ular alohida darslarda ko'riladi.
  checklist:
    - "Natijada aynan 3 ta endpoint bor (`GET /api/v2/vehicles` yo'q)"
    - "`GET /api/v1/vehicles` uchun API4 va API9 qaytadi, alifbo tartibida"
    - "`GET /api/v2/vehicles/:id` uchun API1 qaytadi"
    - "`GET /api/v2/public/status` uchun API2 qaytadi"
    - "Qaysi kategoriyalar bu auditda tekshirilmasligini ayta olasiz"
---

## Muammo

Backend jamoasi odatda xavfsizlikni "login ishlaydi, token tekshiriladi" deb tushunadi. Veb sahifa uchun bu yarim to'g'ri: brauzer sahifani ko'rsatadi, foydalanuvchi faqat tugmalarni bosadi. API uchun esa mijoz kod emas, har bir so'rovni qo'lda yozadigan odam bo'lishi mumkin. Brauzer UI faqat "o'z mashinalarim" ro'yxatini ko'rsatadi, lekin `GET /api/vehicles/512` ga 512 o'rniga 513 yozishni hech narsa to'xtatmaydi. UI'da yashirilgan tugma, serverda yopilgan endpoint degani emas.

Ikkinchi og'riq: API sirtini hech kim to'liq bilmaydi. Mobil ilova uchun `v1`, yangi frontend uchun `v2`, ichki dashboard uchun `/internal/...`, mijoz integratsiyasi uchun webhook va eksport endpoint'lari. Har biri o'z vaqtida qo'shilgan, hammasi bir xil nazoratdan o'tmagan. Xavfsizlik auditi "qaysi endpoint'lar bor?" savolidan boshlanadi va ko'p jamoalar unga aniq javob bera olmaydi.

Uchinchisi, xavflar tilining yo'qligi. "API xavfsiz emas" degan gap ishga yaramaydi; "API1 ni birinchi navbatda yopamiz, chunki hamma obyekt endpoint'lari identifikator oladi" degan gap esa ish rejasiga aylanadi. Bu dars OWASP API Security Top 10 (2023) ni shu til sifatida beradi va uni kursdagi keyingi darslarga bog'laydi: 8-modul qolgan darslari asosan shu ro'yxatning API4, API6, API8 va API10 qismlarini chuqurlashtiradi.

## Asosiy g'oya

OWASP API Security loyihasi o'z ro'yxatini 2019 va 2023 yillarda chiqargan. Quyida 2023 nashrining o'nta kategoriyasi va ularning kursdagi o'rni. Kategoriya nomlari rasmiy sahifadan olingan, "kursdagi dars" ustuni esa kurs tuzuvchisining xaritasi (OWASP bunday bog'lashni bermaydi).

| Kod | Kategoriya (2023) | Qisqacha mohiyat | Kursda |
|---|---|---|---|
| API1 | Broken Object Level Authorization | Obyekt identifikatori oladigan har funksiyada egalik tekshiruvi | 52, 55, 56 |
| API2 | Broken Authentication | Token va identifikatsiya mexanizmlaridagi nuqsonlar | 41-50 |
| API3 | Broken Object Property Level Authorization | Obyektning qaysi xossasini ko'rish va o'zgartirish mumkin | 54 |
| API4 | Unrestricted Resource Consumption | CPU, xotira, tarmoq va pullik integratsiyalar sarfini cheklamaslik | 72, 73, 74 |
| API5 | Broken Function Level Authorization | Rolga mos funksiyani tekshirmaslik | 53, 58 |
| API6 | Unrestricted Access to Sensitive Business Flows | Biznes oqimni avtomatlashtirib suiiste'mol qilish | 59, 73 |
| API7 | Server Side Request Forgery | Server hujumchi bergan URL'ga so'rov yuboradi | 27 |
| API8 | Security Misconfiguration | Noto'g'ri sozlama, standart qiymatlar | 14, 16, 89 |
| API9 | Improper Inventory Management | Qaysi endpoint, versiya va xost borligini bilmaslik | shu dars |
| API10 | Unsafe Consumption of APIs | Uchinchi tomon API javobiga ishonish | 72, 75 |

Ro'yxatda uchta o'zgarish ahamiyatli. Birinchisi, API3: OWASP uni 2019 yildagi Excessive Data Exposure va Mass Assignment kategoriyalarini birlashtirib, umumiy sabab, ya'ni obyekt xossalari darajasida avtorizatsiya yo'qligi yoki noto'g'riligi atrofida qurganini yozadi. Amalda bu "javobda ortiqcha maydon" va "so'rovda ortiqcha maydon" bir xil dizayn xatosining ikki yuzi ekanini bildiradi. Ikkinchisi, API4: nomi "Lack of Resources & Rate Limiting" dan "Unrestricted Resource Consumption" ga o'zgargan va sahifada sarf nafaqat CPU, xotira va tarmoq bilan, balki per-request to'lanadigan xizmatlar (email, SMS, telefon qo'ng'iroqlari, biometrik tekshiruv) bilan ham o'lchanishi aytilgan. Uchinchisi, yangi kategoriyalar: release notes'ga ko'ra API6 Unrestricted Access to Sensitive Business Flows (asosan rate limiting bilan yumshatiladigan yangi tahdidlar uchun) va API10 Unsafe Consumption of APIs qo'shilgan: hujumchilar nishonga to'g'ridan-to'g'ri emas, uning integratsiya qilingan xizmatlariga hujum qila boshlagan. API7 SSRF esa 2019 yilgi ro'yxatda alohida kategoriya sifatida yo'q edi.

API ro'yxatini veb ro'yxatiga qarshi qo'ymang. OWASP Top 10:2025 da A01 Broken Access Control hamma ilovalar uchun umumiy toifa, API1 va API5 esa uni API ko'rinishida (obyekt va funksiya) ajratadi. Veb ro'yxatidan ilovaning umumiy xavflarini, API ro'yxatidan esa endpoint darajasida nimani tekshirishni oling. ASVS 5.0.0 da API uchun alohida V4 "API and Web Service" bo'limi bor, ammo API xavflarining ko'pi boshqa bo'limlar bilan ham kesishadi. Bu kesishma kurs muallifining xaritasi, ASVS o'zi API kategoriyalariga bog'lamaydi: V2 Validation and Business Logic (API4, API6, API10 ga yaqin), V8 Authorization (API1, API3, API5 ga yaqin), V16 Security Logging and Error Handling (79-dars).

## Chuqurroq: ro'yxatni qanday ishlatish kerak

### Endpoint bo'yicha savol, kategoriya bo'yicha emas

Ro'yxatni yodlash kam foyda beradi. Foydali usul: har endpoint uchun o'n savol, har kategoriyaga bittadan.

1. Ichida obyekt identifikatori bormi? Bo'lsa, egalik qayerda tekshiriladi (API1)?
2. Kim chaqira oladi va token qanday tekshiriladi (API2)?
3. Javob va kiruvchi tanada qaysi maydonlar bor, ularning har biri shu rol uchun ruxsat etilganmi (API3)?
4. Eng og'ir so'rov nima: eng katta sahifa, eng katta tana, eng uzoq hisob (API4)?
5. Rol yetarlimi, yoki "admin" funksiyasi oddiy foydalanuvchiga ochiq qolganmi (API5)?
6. Bu endpoint biznes uchun qimmat oqimning qismimi (ro'yxatdan o'tish, promo, buyurtma)? Avtomatlashtirish zarar qiladimi (API6)?
7. Server shu endpoint orqali URL'ga so'rov yuboradimi (API7)?
8. Standart sozlamalar, xato javoblari va header'lar xavfsizmi (API8)?
9. Endpoint inventarizatsiyada bormi, egasi kim (API9)?
10. Tashqi API chaqirsa, uning javobi tekshiriladimi (API10)?

OWASP API6 bo'limi ham mantiqni shunday ochadi: ekspluatatsiya odatda biznes modelini tushunish, sezgir oqimlarni topish va ularga kirishni avtomatlashtirishdan iborat. Demak bunday xavf kod xatosi emas, oqim dizayni masalasi, uni skaner topmaydi. Shuning uchun 59-dars alohida.

### API9: bilmagan narsangizni himoya qilolmaysiz

OWASP API9 uchun tavsiya qiladigan ishlar aniq: barcha API xostlarini va ularning muhitini (production, staging, test, development), kimga tarmoq kirishi borligini va versiyasini ro'yxatga olish; integratsiya qilingan xizmatlarni va ular almashadigan ma'lumot sezgirligini hujjatlash; hujjatni ochiq standartlar bilan avtomatik hosil qilib, CI/CD ga kiritish; production ma'lumotini nomahsulot muhitlarida ishlatmaslik, ishlatilsa ularga ham xuddi shunday himoya berish. Yangi versiyada xavfsizlik yaxshilanishi chiqsa, eski versiya uchun xavfni baholash, ya'ni orqaga ko'chirish yoki eski versiyani tezda o'chirish kerak.

Amaliy xulosa: inventarizatsiya hujjat emas, kod bo'lishi kerak. Endpoint ro'yxatdan o'tmasa, server ishga tushmasligi (yoki endpoint javob bermasligi) kerak. Quyidagi misol aynan shu g'oyani ko'rsatadi.

### API10: "ishonchli" provayder ham kirish manbai

OWASP API10 bo'limi sababni shunday tushuntiradi: dasturchilar tashqi yoki uchinchi tomon API'lari bilan o'zaro aloqada ularga ishonib, transport xavfsizligi, autentifikatsiya, kirishni tekshirish kabi talablarni yumshatadi. Tavsiyalar: provayderning xavfsizlik holatini baholash, aloqani TLS orqali olib borish, integratsiyadan kelgan ma'lumotni ishlatishdan oldin tekshirish va tozalash, va API yo'naltirishi mumkin bo'lgan joylar uchun allowlist yuritib, redirect'larga ko'r-ko'rona ergashmaslik. Webhook (75-dars) ham shu kategoriyaning yaqin qarindoshi: tashqaridan kelgan so'rovga imzo bilan ishonch hosil qilmasangiz, u oddiy mijoz kiritishi bilan teng.

## Misol: inventarizatsiya va siyosatni majburiy qilish

Misolda ikki versiyali endpoint'lar bor: `v2` tenant filtri bilan yozilgan, `v1` eski kod bo'lib, filtrsiz qolgan. Kod o'quv in-memory modeli, real tizim yo'q.

### 1. Zaif kod

Dispatcher oddiy obyekt: kalit `METHOD path`, qiymat handler. Har handler tenant filtrini o'zi qo'yishi kerak, qo'ymasa hech narsa to'xtatmaydi.

```ts run
type Ctx = { tenant: string };
type Handler = (c: Ctx) => unknown[];

const vehicles = [
  { id: "v1", tenant: "alfa", plate: "01 A 111 AA" },
  { id: "v2", tenant: "beta", plate: "10 B 222 BB" },
  { id: "v3", tenant: "beta", plate: "10 B 333 BB" },
];

// ZAIF: har handler o'zi tenant filtrini eslashi kerak, ro'yxat esa hech qayerda yuritilmaydi
const routes: Record<string, Handler> = {
  "GET /api/v2/vehicles": (c) => vehicles.filter((v) => v.tenant === c.tenant),
  "GET /api/v1/vehicles": () => vehicles, // ZAIF: eski versiya, filtr unutilgan
};

function dispatchWeak(key: string, c: Ctx) {
  const h = routes[key];
  return h ? h(c) : "404";
}

console.log("v2:", JSON.stringify(dispatchWeak("GET /api/v2/vehicles", { tenant: "alfa" })));
console.log("v1:", JSON.stringify(dispatchWeak("GET /api/v1/vehicles", { tenant: "alfa" })));
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu eski API versiyasiga murojaat usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

"alfa" foydalanuvchisi hujjatda yo'q, lekin hali ishlayotgan `v1` manziliga murojaat qiladi. Faqat o'z o'quv modelimizga qarshi so'rov:

```text
v2: [{"id":"v1","tenant":"alfa","plate":"01 A 111 AA"}]
v1: [{"id":"v1","tenant":"alfa","plate":"01 A 111 AA"},{"id":"v2","tenant":"beta","plate":"10 B 222 BB"},{"id":"v3","tenant":"beta","plate":"10 B 333 BB"}]
```

`v2` faqat "alfa" mashinasini qaytardi. `v1` esa hamma tenant'ning mashinasini berdi, ya'ni API1 va API9 birga ishladi: eski versiya inventarizatsiyada yo'q, shuning uchun tekshiruvlar unga yetmagan.

### 3. Tuzatilgan kod

Endpoint faqat siyosat bilan ro'yxatdan o'tadi. Siyosat yo'q yoki `retired` bo'lsa, ro'yxatga olish xato beradi yoki 404 qaytadi. Tenant filtrini handler emas, dispatcher markazda qo'yadi.

```ts run
type Ctx = { tenant: string };
type Row = { id: string; tenant: string; plate: string };
type Policy = { owner: string; status: "active" | "deprecated" | "retired"; maxPage: number };

const vehicles: Row[] = [
  { id: "v1", tenant: "alfa", plate: "01 A 111 AA" },
  { id: "v2", tenant: "beta", plate: "10 B 222 BB" },
  { id: "v3", tenant: "beta", plate: "10 B 333 BB" },
];

const registry = new Map<string, { policy: Policy; load: () => Row[] }>();

function register(key: string, policy: Policy | undefined, load: () => Row[]) {
  if (!policy || !policy.owner) throw new Error(`siyosatsiz endpoint rad etildi: ${key}`);
  registry.set(key, { policy, load });
}

function dispatch(key: string, c: Ctx): string {
  const e = registry.get(key);
  if (!e || e.policy.status === "retired") return "404";
  const rows = e.load().filter((v) => v.tenant === c.tenant); // markaziy tenant filtri
  return JSON.stringify(rows.slice(0, e.policy.maxPage));
}

register("GET /api/v2/vehicles", { owner: "fleet-team", status: "active", maxPage: 100 }, () => vehicles);
register("GET /api/v1/vehicles", { owner: "fleet-team", status: "retired", maxPage: 100 }, () => vehicles);
try {
  register("GET /internal/export", undefined, () => vehicles);
} catch (e) {
  console.log("ro'yxat:", (e as Error).message);
}

console.log("v2:", dispatch("GET /api/v2/vehicles", { tenant: "alfa" }));
console.log("v1:", dispatch("GET /api/v1/vehicles", { tenant: "alfa" }));
console.log("noma'lum:", dispatch("GET /api/v0/vehicles", { tenant: "alfa" }));
```

```text
ro'yxat: siyosatsiz endpoint rad etildi: GET /internal/export
v2: [{"id":"v1","tenant":"alfa","plate":"01 A 111 AA"}]
v1: 404
noma'lum: 404
```

### Tuzatish nima uchun yetarli

Endi invariant ikkita. Birinchisi: siyosatsiz endpoint ro'yxatga kirmaydi, ya'ni "unutilgan" endpoint paydo bo'lmaydi (API9 ga qarshi). Ikkinchisi: tenant filtri dispatcher'da, har handler'dan oldin bajariladi; handler filtrni unutsa ham natija begona tenant'ning qatorini o'z ichiga olmaydi (API1 ning shu holati uchun). `retired` holat endpointni o'chirmasdan 404 beradi, bu kod o'chirilgunga qadar qisqa muddatli chora.

Yopilmagan narsalar: bu faqat ro'yxatga olingan endpoint'lar uchun ishlaydi. Reverse proxy yoki boshqa servis orqali ochilgan, registry'dan tashqaridagi yo'llarni topish uchun tashqi inventarizatsiya (gateway log, tarmoq skaneri) kerak. Tenant filtri faqat tenant chegarasini yopadi; tenant ichida foydalanuvchilar o'rtasidagi egalik (masalan, haydovchi faqat o'z reysini ko'radi) alohida tekshiruv (52-dars). Xossa darajasi (API3), biznes oqim (API6) va boshqa kategoriyalar bu misolda qamralmagan.

## Qachon qo'llamaslik kerak

- Ro'yxat dasturlash tili emas, tasniflash vositasi. Topilmani "bu API5" deb nomlash tuzatishni o'zi bajarmaydi; ayniqsa kategoriyalar kesishganda (masalan, BOLA va property-level) tortishuvga vaqt sarflamang.
- OWASP ro'yxati ommaviy ma'lumotlarga asoslangan umumiy xavflar ro'yxati, sizning tizimingiz uchun to'liq tahdid modeli emas. Hujum sirtini (2-dars) va tahdidlarni (4-dars) alohida tahlil qilmasdan faqat Top 10 bo'yicha tekshirsangiz, domen xavfi, masalan "mashina yoqilg'isi hisoboti orqali soxta to'lov", ro'yxatdan tashqarida qoladi.
- Kichik ichki API'da to'liq registry mexanizmi ortiqcha bo'lishi mumkin. Uch endpoint'li servisda bitta fayldagi jadval va code review yetarli; registry yuzlab endpoint va ko'p jamoa bo'lganda oqlanadi.
- Statik audit (misoldagi `audit`) deklaratsiyani tekshiradi, haqiqiy xatti-harakatni emas. Deklaratsiya yolg'on bo'lsa, audit "hammasi yaxshi" deydi. U testlarni almashtirmaydi.

## Stack'da: NestJS va Fastify

NestJS'da inventarizatsiya g'oyasi "deny by default" global guard bilan amalga oshadi: har controller metodi `@Public()` yoki `@Policy(...)` dekoratori bilan belgilanishi shart, belgilanmagan metod 403 qaytaradi. Metadata'ni `Reflector` o'qiydi, shuning uchun siyosat kodda, endpoint yonida turadi. Fastify'da shunga o'xshash natijani route `config` va `onRoute` hook bilan olasiz: hook har route ro'yxatga olinayotganda ishlaydi va siyosat yo'q bo'lsa server ishga tushmaydi.

```ts
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const POLICY_KEY = "policy";
export type RoutePolicy = { owner: string; roles: string[]; maxPage?: number };
export const Policy = (p: RoutePolicy) => SetMetadata(POLICY_KEY, p);

@Injectable()
export class DenyByDefaultGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const policy = this.reflector.getAllAndOverride<RoutePolicy | undefined>(POLICY_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!policy) return false; // siyosat e'lon qilinmagan endpoint ishlamaydi
    const user = ctx.switchToHttp().getRequest().user as { roles: string[] } | undefined;
    return !!user && policy.roles.some((r) => user.roles.includes(r));
  }
}
```

Guard rol tekshiradi (API5), lekin obyekt egaligini tekshirmaydi: u servis qatlamida, so'rovning o'zida bo'lishi kerak (58-dars). Uni barcha route'larga qo'llash uchun modulda `APP_GUARD` token'i bilan provayder sifatida ro'yxatdan o'tkaziladi; ro'yxatga olingan har guard har so'rovda ishlaydi (NestJS hujjati, guards bo'limi).

## Xulosa

- OWASP API Security Top 10 (2023): API1 Broken Object Level Authorization, API2 Broken Authentication, API3 Broken Object Property Level Authorization, API4 Unrestricted Resource Consumption, API5 Broken Function Level Authorization, API6 Unrestricted Access to Sensitive Business Flows, API7 SSRF, API8 Security Misconfiguration, API9 Improper Inventory Management, API10 Unsafe Consumption of APIs.
- Ro'yxatni endpoint bo'yicha savollar ro'yxati sifatida ishlating: har endpoint uchun o'n kategoriyaga bittadan savol.
- Autentifikatsiyadan o'tgan foydalanuvchi ham hujumchi bo'lishi mumkin: API1, API3 va API5 aynan tizimga kirgan mijoz haqida.
- Inventarizatsiya hujjat emas, majburiy mexanizm bo'lsin: siyosatsiz endpoint ro'yxatga kirmasin, markaziy qatlam tenant filtrini qo'ysin.
- Integratsiya qilingan API javobi ham kirish ma'lumoti (API10). Ro'yxat tasniflaydi, tuzatmaydi: har topilmaga aniq nazorat va test kerak.
