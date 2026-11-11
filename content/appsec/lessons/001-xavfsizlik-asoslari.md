---
n: 1
slug: xavfsizlik-asoslari
title: "Xavfsizlik nima: CIA, tahdid, zaiflik va risk"
summary: "Xavfsizlik himoya qiladigan uch xususiyat (maxfiylik, yaxlitlik, mavjudlik), aktiv, tahdid, zaiflik va risk tushunchalarining farqi, risk register va uning cheklovlari, hamda bitta endpoint'ning zaif va tuzatilgan versiyasi."
duration: 40
sources:
  - id: fips199
    note: "Abstract: standart tizimlarni maxfiylik, yaxlitlik va mavjudlik bo'yicha toifalash va buzilish ta'sirini belgilashini aytadi"
  - id: nist-30
    note: "Abstract: federal axborot tizimlari uchun risk baholashni o'tkazish bo'yicha yo'riqnoma; baholash umumiy risk management jarayonining qismi"
  - id: t10-risks
    note: "Sahifa boshi va risk reyting sxemasi: threat agent'dan biznes ta'sirigacha zanjir va reytingda hisobga olinadigan parametrlar"
  - id: cwe-about
    note: "About CWE sahifasi: weakness ta'rifi va CWE ro'yxatining vazifasi"
quiz:
  - q: "Mijoz kompaniyasi administratori brauzer manzilidagi mashina identifikatorini boshqasiga almashtirib, raqobatchi kompaniyaning mashinasi joylashuvini ko'rdi. Qaysi xususiyat birinchi navbatda buzildi?"
    options:
      - "Yaxlitlik: ma'lumot o'zgartirildi"
      - "Mavjudlik: servis javob bermay qoldi"
      - "Maxfiylik: ruxsatsiz shaxs ma'lumotni ko'rdi"
      - "Hisobdorlik: harakat kimniki ekani noma'lum"
    answer: 2
    explain: "Hech narsa o'zgarmadi va servis ishlab turibdi: buzilgan narsa ma'lumotni faqat ruxsati borlar ko'rishi kerakligi, ya'ni maxfiylik. Hisobdorlik alohida masala va CIA uchligiga kirmaydi."
  - q: "Admin panelda ishlab chiqaruvchi qo'ygan default parol o'zgartirilmagan. Bu holatni qaysi so'z to'g'ri nomlaydi?"
    options:
      - "Zaiflik (vulnerability): hujumchi foydalana oladigan nuqson"
      - "Tahdid (threat): zarar yetkazishi mumkin bo'lgan kuch"
      - "Risk: darhol qiymatga ega bo'lgan aniq son"
      - "Aktiv (asset): himoyalanadigan ma'lumot"
    answer: 0
    explain: "Default parol tizimdagi nuqson, ya'ni zaiflik. Tahdid - undan foydalanishi mumkin bo'lgan tomon, risk esa zaiflikdan foydalanish ehtimoli va oqibati birgalikda; aktiv - panel orqali himoyalanadigan narsa."
  - q: "Risk registerida bir xavf ehtimollik 2 va ta'sir 5, boshqasi ehtimollik 5 va ta'sir 2 oldi. Ikkalasi ham 10 ball. Bu qaysi cheklovni ko'rsatadi?"
    options:
      - "Ball faqat butun sonlar bilan ishlaydi"
      - "Ehtimollik har doim ta'sirdan muhimroq"
      - "Ikkala xavf bir xil javob talab qiladi"
      - "Ko'paytma kam uchraydigan katastrofik hodisani tez-tez uchraydigan mayda hodisadan ajratmaydi"
    answer: 3
    explain: "Ko'paytma ikki o'lchovni bitta songa siqadi va farqni yashiradi: kam ehtimolli, lekin katta ta'sirli hodisa alohida qaror talab qilishi mumkin. Boshqa variantlar modelning xususiyatiga to'g'ri kelmaydi."
  - q: "Quyidagi kod asosan qaysi xususiyatni buzadi?\n\n```ts\nfunction setFuel(id: string, value: unknown) {\n  vehicles.get(id)!.fuel = value as number;\n}\n```"
    options:
      - "Maxfiylik: ma'lumot oshkor bo'ladi"
      - "Yaxlitlik: ma'lumot tekshiruvsiz o'zgartirilishi mumkin"
      - "Mavjudlik: funksiya servisni to'xtatadi"
      - "Hech qaysi: `as number` turni tekshiradi"
    answer: 1
    explain: "Qiymat tekshirilmaydi va `as number` faqat kompilyator uchun va'da, run-time'da hech narsani tekshirmaydi. Shuning uchun `-500` yoki satr ham yoziladi: bu yaxlitlik buzilishi. Egalik tekshirilmagani esa alohida, maxfiylik va yaxlitlikka tegishli nuqson."
  - q: "Ro'yxat endpoint'iga `limit` ning yuqori chegarasi (MAX_PAGE = 100) qo'yildi, noto'g'ri qiymat esa 100 ga tushadi. Bu tuzatish birinchi navbatda qaysi xususiyatni himoya qiladi va nega xato emas, standart qiymat qaytariladi?"
    options:
      - "Mavjudlik; xavfsiz standart qiymat so'rovni rad etmay, resursni cheklaydi"
      - "Maxfiylik; chegara boshqa tenant ma'lumotini yashiradi"
      - "Yaxlitlik; chegara yozuvlarni o'zgartirishdan saqlaydi"
      - "Maxfiylik va yaxlitlik; mavjudlikka ta'sir qilmaydi"
    answer: 0
    explain: "Cheklanmagan limit bitta so'rovga ko'p resurs sarflatadi, ya'ni mavjudlikka tahdid. Chegara resurs sarfini yuqoridan ushlaydi, noto'g'ri qiymat esa xavfsiz standartga tushadi (fail-safe default). Boshqa tenant ma'lumotini egalik tekshiruvi yashiradi, chegara emas."
  - q: "CWE nima?"
    options:
      - "Muayyan zaiflik nusxalariga berilgan identifikatorlar ro'yxati (masalan, bitta kutubxonadagi bitta nuqson)"
      - "Zaifliklar og'irligini ball bilan baholash tizimi"
      - "Dasturiy va apparat komponentlardagi weakness turlarining hamjamiyat tomonidan yuritiladigan ro'yxati"
      - "Xavfsizlik nazoratlarining majburiy sertifikatlash standarti"
    answer: 2
    explain: "CWE weakness turlarini tasniflaydi: zaifliklar paydo bo'lishiga olib kelishi mumkin bo'lgan holatlar. Konkret zaiflik nusxalarini sanash va og'irlikni baholash boshqa tizimlar ishi (7-dars)."
task:
  title: "Telemetriya eksporti: maxfiylik va mavjudlik nazoratlari"
  prompt: |
    Platformada `exportReadings(tenant, vehicleId, limit)` funksiyasi mashinaning telemetriya yozuvlarini mijozga qaytaradi. U ishlaydi, lekin ikkita xavfsizlik nuqsoni bor.

    1. Maxfiylik: funksiya mashina so'rovchi tenant'ga tegishliligini tekshirmaydi. "alfa" foydalanuvchisi `v2` (u "beta"ga tegishli) yozuvlarini oladi.
    2. Mavjudlik: `limit` tekshirilmaydi. `"Infinity"` hamma yozuvni qaytaradi, `"abc"` esa bo'sh natija beradi.

    Funksiyani tuzating: faqat so'rovchi tenant'ning mashinasi qaytsin (begona mashina uchun bo'sh natija), `limit` musbat butun son bo'lsin va 500 dan oshmasin, noto'g'ri qiymat 500 ga tushsin. Imzoni o'zgartirmang. Oxirgi to'rt `console.log` kutilgan natijani chiqarsin: 5, 0, 500, 500.
  lang: ts
  starter: |
    type Reading = { vehicleId: string; tenant: string; ts: number; fuel: number };

    const store: Reading[] = [];
    for (let i = 0; i < 2000; i++) {
      store.push({ vehicleId: "v1", tenant: "alfa", ts: 1700000000 + i * 30, fuel: 60 - (i % 20) });
      store.push({ vehicleId: "v2", tenant: "beta", ts: 1700000000 + i * 30, fuel: 40 + (i % 10) });
    }

    // Mashinaning telemetriyasini eksport qiladi.
    function exportReadings(tenant: string, vehicleId: string, limit: unknown): Reading[] {
      const rows = store.filter((r) => r.vehicleId === vehicleId);
      return rows.slice(0, Number(limit));
    }

    console.log("o'z mashinasi:", exportReadings("alfa", "v1", 5).length);
    console.log("begona mashina:", exportReadings("alfa", "v2", 5).length);
    console.log("cheklovsiz so'rov:", exportReadings("alfa", "v1", "Infinity").length);
    console.log("noto'g'ri limit:", exportReadings("alfa", "v1", "abc").length);
  solution: |
    type Reading = { vehicleId: string; tenant: string; ts: number; fuel: number };

    const store: Reading[] = [];
    for (let i = 0; i < 2000; i++) {
      store.push({ vehicleId: "v1", tenant: "alfa", ts: 1700000000 + i * 30, fuel: 60 - (i % 20) });
      store.push({ vehicleId: "v2", tenant: "beta", ts: 1700000000 + i * 30, fuel: 40 + (i % 10) });
    }

    const MAX_LIMIT = 500;

    // Mashinaning telemetriyasini eksport qiladi.
    function exportReadings(tenant: string, vehicleId: string, limit: unknown): Reading[] {
      const n = Number(limit);
      const safe = Number.isInteger(n) && n > 0 ? Math.min(n, MAX_LIMIT) : MAX_LIMIT;
      const rows = store.filter((r) => r.tenant === tenant && r.vehicleId === vehicleId);
      return rows.slice(0, safe);
    }

    console.log("o'z mashinasi:", exportReadings("alfa", "v1", 5).length);
    console.log("begona mashina:", exportReadings("alfa", "v2", 5).length);
    console.log("cheklovsiz so'rov:", exportReadings("alfa", "v1", "Infinity").length);
    console.log("noto'g'ri limit:", exportReadings("alfa", "v1", "abc").length);
  solutionNotes: |
    - `tenant === ...` sharti filtrning ichida: begona mashinaning yozuvlari xotiraga ham olinmaydi. Alohida "avval ol, keyin tekshir" qadami yo'q, shuning uchun uni unutib qoldirish qiyin.
    - Begona mashina uchun xato emas, bo'sh natija qaytadi. Mashina mavjudligi haqida ma'lumot sizmaydi (maxfiylik); real API'da bu odatda 404 bilan bir xil javob.
    - `Number(limit)` ni butun va musbatligi tekshiriladi: `"Infinity"`, `"abc"`, `-3`, `2.5` hammasi `MAX_LIMIT` ga tushadi (fail-safe default).
    - `Math.min(n, MAX_LIMIT)` bitta so'rovning resurs sarfini yuqoridan cheklaydi (mavjudlik). Chegara qiymati biznes talabidan olinadi, bu yerda 500 modelimizning tanlovi.
    - Bu hali hamma narsa emas: so'rovlar chastotasi (73-dars) va autentifikatsiyaning o'zi alohida nazoratlar.
  checklist:
    - "Begona tenant'ning mashinasi uchun bo'sh natija qaytadi"
    - "O'z mashinasi uchun `limit` ga mos yozuvlar qaytadi"
    - "`\"Infinity\"` va `\"abc\"` kabi qiymatlar 500 ga tushadi, 500 dan katta son 500 ga kesiladi"
    - "Imzo o'zgarmagan, funksiya xato tashlamaydi"
    - "Tuzatish qaysi hujumlarni qoplashini va nimani qoplamasligini ayta olasiz"
---

## Muammo

Dasturchi xavfsizlikni odatda "so'nggi bosqich" deb biladi: funksiya tayyor, endi kimdir parolni tekshirsin, HTTPS qo'ysin. Natijada xavfsizlik gaplari ro'yxatga aylanadi: "SQL injection qilmang", "parolni hash qiling", "token'ni to'g'ri saqlang". Ro'yxat yodlanadi, lekin yangi vaziyatda ishlamaydi, chunki o'qiganingiz nima uchun xavfli ekanini bilmaysiz. Ro'yxatda yo'q muammo uchrasa (masalan, "eksport endpoint'iga limit qo'yilmagan"), uni xavfsizlik muammosi deb tanimaysiz ham.

Ikkinchi og'riq: jamoa ichida bir xil so'z turlicha ishlatiladi. Pentester "zaiflik topdim" deydi, product manager "demak hammamiz xavf ostidamiz" deb tushunadi, dasturchi esa "bu faqat admin foydalanuvchi uchun, ahamiyati yo'q" deb javob beradi. Hech kim noto'g'ri emas, lekin "zaiflik", "tahdid" va "risk" turli narsalar. Ularni aralashtirsangiz, tuzatish tartibi tasodifga qoladi: eng shovqinli topilma birinchi tuzatiladi, eng qimmat zarar keltiradigani esa kutib turadi.

Bu dars kursning poydevori. Biz avval xavfsizlik nimani himoya qilishini aniq aytamiz (uchta xususiyat), keyin tahdid, zaiflik va riskni bir-biridan ajratamiz, oxirida shu tushunchalarni bitta endpoint'ning zaif va tuzatilgan versiyasida kodda ko'ramiz. Misollar neytral avtopark monitoring platformasi atrofida: GPS telemetriya, yoqilg'i datchiklari, bir nechta mijoz kompaniyasi (tenant) bir tizimdan foydalanadi.

## Asosiy g'oya

### Nimani himoya qilamiz: CIA triadasi

Xavfsizlikning klassik asosi uchta xususiyat: maxfiylik (confidentiality), yaxlitlik (integrity) va mavjudlik (availability). NIST FIPS 199 standarti federal axborot va axborot tizimlarini shu uch xususiyat bo'yicha daraja berib toifalashni belgilaydi. Daraja tizim buzilsa, ya'ni ruxsatsiz kirish, foydalanish, oshkor qilish, uzilish, o'zgartirish yoki yo'q qilish yuz bersa, aktivlar va faoliyatga qanday ta'sir bo'lishiga qarab qo'yiladi. Bu ro'yxatni uch xususiyatga shunday bog'lash mumkin (bu bog'lash kursning talqini): oshkor qilish va ruxsatsiz kirish maxfiylikka, o'zgartirish yaxlitlikka, uzilish va yo'q qilish mavjudlikka zarar qiladi.

Avtopark platformasida bu quyidagicha ko'rinadi:

| Xususiyat | Ma'nosi | Platformadagi misol |
|---|---|---|
| Maxfiylik | Ma'lumotni faqat ruxsati borlar ko'radi | Bir kompaniya boshqasining mashinalari joylashuvini ko'ra olmaydi |
| Yaxlitlik | Ma'lumot ruxsatsiz va sezilmay o'zgarmaydi | Yoqilg'i datchigi qiymatini mijoz o'zi yozib qo'ya olmaydi |
| Mavjudlik | Ruxsati borlar kerak paytda foydalana oladi | Bitta og'ir so'rov butun tenant uchun tizimni to'xtatmaydi |

Muhim kuzatuv: bitta kod xatosi bir necha xususiyatni buzishi mumkin, va bitta xususiyat uchun himoya boshqasini zaiflashtirishi mumkin (masalan, har so'rovni og'ir kriptografik tekshiruvdan o'tkazish mavjudlikka zarar qiladi). Shuning uchun xavfsizlik "ha yoki yo'q" xususiyat emas, balki qaror qabul qilish sohasi.

### To'rt so'z: aktiv, tahdid, zaiflik, risk

Bu kursda quyidagi ishchi lug'atdan foydalanamiz. Standartlar o'z terminologiyasini beradi (risk baholash bo'yicha rasmiy yo'riqnoma sifatida NIST SP 800-30 Rev. 1 mavjud), shuning uchun quyidagi ta'riflar soddalashtirilgan ishchi model ekanini yodda tuting.

- Aktiv (asset): himoyalanadigan narsa. Mijoz GPS tarixi, yoqilg'i hisobotlari, haydovchilar ma'lumoti, API kalitlari, shuningdek servisning ishlab turishi ham aktiv.
- Tahdid (threat): aktivga zarar yetkazishi mumkin bo'lgan kuch yoki hodisa. Tashqi hujumchi, ichkaridagi nohalol xodim, tasodifan noto'g'ri eksport qilgan operator, ma'lumotlar markazining o'chishi.
- Zaiflik (vulnerability): tahdid foydalana oladigan nuqson. Kod xatosi, noto'g'ri sozlama, dizayndagi bo'shliq. Masalan, eksport endpoint'ida mashina egasi tekshirilmagan.
- Risk: tahdid zaiflikdan foydalanib aktivga zarar yetkazish ehtimoli va shu zararning kattaligi. Ehtimollik va ta'sirning birgalikdagi ko'rinishi.

Bu ajratish amaliy ahamiyatga ega. Zaiflikni tuzatish kodni o'zgartiradi, tahdidga ta'sir qilish deyarli imkonsiz (hujumchilarni yo'q qila olmaysiz), riskni esa uchta yo'l bilan kamaytirish mumkin: zaiflikni yopish, ta'sirni kamaytirish (masalan, ma'lumotni shifrlab saqlash yoki kamroq saqlash), ehtimolni kamaytirish (qo'shimcha nazorat qatlami). Bunday chora-tadbirlar umumiy nomi bilan security control deyiladi.

Zaiflik bor, lekin risk yo'q bo'lishi mumkin: faqat ichki tarmoqdagi, hech narsa saqlamaydigan test servisdagi nuqson. Aksincha, zaiflik yo'q, lekin risk yuqori bo'lishi mumkin: dizayn jihatidan to'g'ri ishlayotgan, ammo mijoz ma'lumotlarining hammasi bitta kalit bilan himoyalangan tizim. Bunday dizayn kamchiliklari uchun OWASP Top 10:2025 da alohida A06 Insecure Design kategoriyasi bor (6-dars).

## Chuqurroq: risk qanday baholanadi

### OWASP nima hisobga oladi

OWASP Top 10:2025 ning "What are Application Security Risks?" bo'limi ilovadagi har bir yo'lni, ya'ni hujumchi ilova orqali biznesga zarar yetkazishi mumkin bo'lgan har bir usulni, alohida risk deb qarash kerakligini yozadi. Sahifadagi sxema zanjirni ko'rsatadi: threat agent, attack vector, xavfsizlik nazorati yetishmasligi, texnik ta'sir, biznes ta'siri. Reytingda sahifa universal parametrlarni hisobga olganini aytadi: ekspluatatsiya qilish osonligi (exploitability), nazorat yetishmasligining o'rtacha ehtimoli va texnik ta'sir. Ya'ni risk faqat "zaiflik qanchalik yomon" degani emas: unga hujum qilish qanchalik oson, himoya qatlamlari qanchalik yetishmaydi va oqibat nimaga olib keladi, hammasi kiradi.

CWE dasturi esa boshqa darajada ishlaydi. Uning ta'rifiga ko'ra weakness dasturiy, apparat, firmware yoki servis komponentidagi shunday holat, ma'lum sharoitda zaifliklar paydo bo'lishiga olib kelishi mumkin. CWE ro'yxati hamjamiyat tomonidan yuritiladi va weakness turlarini tasniflaydi. Misol: "tashqi kiritilgan ma'lumot SQL buyrug'i sifatida talqin qilinadi" bitta weakness turi, uning yuzlab konkret ko'rinishi bor. Weakness, zaiflik va risk uchta turli daraja. Bularning rasmiy raqamli ko'rinishi (CWE, CVE, CVSS, EPSS, KEV) 7-darsda.

### Risk register: ball emas, tartib

Amalda jamoa riskni risk register (xavflar ro'yxati) bilan yuritadi. Har qatorda xavfning tavsifi, qaysi xususiyatga tegishli ekani, ehtimollik va ta'sir bahosi bo'ladi. Quyida eng oddiy shakli: ehtimollik va ta'sir 1 dan 5 gacha, ball ularning ko'paytmasi.

```ts run
type Prop = "C" | "I" | "A";
type Risk = { name: string; prop: Prop; likelihood: number; impact: number };

const register: Risk[] = [
  { name: "Boshqa tenant GPS tarixini o'qiydi", prop: "C", likelihood: 3, impact: 5 },
  { name: "Yoqilg'i datchigi qiymati soxtalashtiriladi", prop: "I", likelihood: 3, impact: 4 },
  { name: "Telemetriya endpoint'i so'rovlar bilan band qilinadi", prop: "A", likelihood: 4, impact: 3 },
  { name: "Admin panelda default parol qolgan", prop: "C", likelihood: 2, impact: 5 },
  { name: "Logda haydovchi telefon raqami yoziladi", prop: "C", likelihood: 4, impact: 2 },
];

const band = (score: number) => (score >= 15 ? "yuqori" : score >= 8 ? "o'rta" : "past");

const ranked = register
  .map((r) => ({ ...r, score: r.likelihood * r.impact }))
  .sort((a, b) => b.score - a.score);

for (const r of ranked) {
  console.log(`${String(r.score).padStart(2)} ${band(r.score).padEnd(6)} [${r.prop}] ${r.name}`);
}
```

```text
15 yuqori [C] Boshqa tenant GPS tarixini o'qiydi
12 o'rta  [I] Yoqilg'i datchigi qiymati soxtalashtiriladi
12 o'rta  [A] Telemetriya endpoint'i so'rovlar bilan band qilinadi
10 o'rta  [C] Admin panelda default parol qolgan
 8 o'rta  [C] Logda haydovchi telefon raqami yoziladi
```

Bu model ataylab sodda va uning cheklovlari bor. Birinchisi, ko'paytma ehtimollik 2, ta'sir 5 va ehtimollik 5, ta'sir 2 ni bir xil 10 ball deb ko'rsatadi. Lekin birinchisi kam uchraydigan, ammo katastrofik hodisa, ikkinchisi tez-tez uchraydigan mayda noqulaylik, ularga javob ham boshqacha bo'lishi kerak. Ikkinchisi, 1 dan 5 gacha baho sub'ektiv: jamoa a'zolari bir xil xavfga turlicha ball qo'yadi, shuning uchun ballning o'zi emas, baholash davomidagi muhokama qimmatli. Uchinchisi, ball tuzatish narxini hisobga olmaydi: 8 ballli xavf bir qatorlik o'zgarish bilan yopilsa, uni 15 ballli xavfdan oldin yopish ma'qul bo'lishi mumkin. Bu jadval qaror o'rnini bosmaydi, qarorga tartib beradi.

Real loyihada ehtimollik va ta'sirni hisobga olish uchun standart tizimlar bor: CVSS zaiflik og'irligini, EPSS ekspluatatsiya ehtimolini, KEV ro'yxati esa allaqachon ekspluatatsiya qilinayotgan zaifliklarni beradi. Ularning har biri nimani o'lchashini va nimani o'lchamasligini 7-darsda ajratamiz. Risk register qanday to'ldirilishi esa hujumchi modeli (2-dars) va threat modeling (4-dars) bilan bog'liq: avval kimdan va nimani himoya qilayotganingizni bilish kerak.

## Misol: bitta endpoint, uch xususiyat

Quyidagi misol uch xususiyatning har biri bitta oddiy kod nuqsoni tufayli qanday buzilishini ko'rsatadi. Kod to'liq o'quv maqsadidagi: u bizning in-memory modelimizga qarshi ishlaydi, hech qanday real tizim yo'q. Server, baza va HTTP qatlami ataylab olib tashlangan, chunki mexanizm ularga bog'liq emas.

### 1. Zaif kod

Uchta funksiya mijoz kiritgan ma'lumotga ishonadi:

```ts run
type Vehicle = { id: string; tenant: string; plate: string; fuel: number };

const vehicles = new Map<string, Vehicle>([
  ["v1", { id: "v1", tenant: "alfa", plate: "01 A 111 AA", fuel: 62 }],
  ["v2", { id: "v2", tenant: "beta", plate: "10 B 222 BB", fuel: 48 }],
]);
const readings = Array.from({ length: 5000 }, (_, i) => ({ vehicleId: "v2", seq: i, lat: 41.3 + i / 1e5, lon: 69.2 }));

// ZAIF: uchala xususiyat ham buzilgan
function getVehicleWeak(_tenant: string, id: string) {
  return vehicles.get(id); // egasi tekshirilmaydi
}
function setFuelWeak(id: string, value: unknown) {
  vehicles.get(id)!.fuel = value as number; // qiymat tekshirilmaydi
}
function listReadingsWeak(limit: unknown) {
  return readings.slice(0, Number(limit)); // yuqori chegara yo'q
}

// HUJUM: "alfa" tenant foydalanuvchisi o'z kodini emas, faqat so'rov parametrlarini o'zgartiradi
console.log("1) Maxfiylik:", getVehicleWeak("alfa", "v2")?.plate);
setFuelWeak("v1", -500);
console.log("2) Yaxlitlik:", vehicles.get("v1")!.fuel);
console.log("3) Mavjudlik, qaytgan qatorlar:", listReadingsWeak("Infinity").length);
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu maxfiylik, yaxlitlik va mavjudlikni buzish namunalari faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) va 278-4-moddasi (Kompyuter axborotini modifikatsiyalashtirish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi "alfa" kompaniyasining oddiy foydalanuvchisi, ya'ni tizimga kirgan va o'z mashinalarini ko'rishga haqli. Uning uchta harakati kodning o'zida: mashina identifikatorini `v2` ga almashtirish, yoqilg'i qiymati sifatida `-500` yuborish va `limit` ga `Infinity` yozish. Natija:

```text
1) Maxfiylik: 10 B 222 BB
2) Yaxlitlik: -500
3) Mavjudlik, qaytgan qatorlar: 5000
```

Birinchi qatorda "alfa" foydalanuvchisi "beta" kompaniyasi mashinasining davlat raqamini oldi (maxfiylik buzildi). Ikkinchisida o'z mashinasining yoqilg'i darajasi `-500` ga aylandi va keyingi hisobotlar, signal qoidalari va to'lov hisoblari noto'g'ri qiymatga tayanadi (yaxlitlik buzildi). Uchinchisida bitta so'rov 5000 qatorni qayta ishlashga majbur qildi; real tizimda bu son millionlar bo'lishi va tenant'lar uchun umumiy resurslarni egallashi mumkin (mavjudlik xavf ostida). Hozirgi misolda qatorlar sonini sanayapmiz, haqiqiy yuklama o'lchovi emas.

Bu yerda zaiflik uchta alohida nuqson, tahdid esa tizimga kirgan ichki foydalanuvchi (yoki uning akkauntini egallagan odam). Aktivlar mijoz ma'lumoti, hisobotlar to'g'riligi va servis ishlashi.

### 3. Tuzatilgan kod

```ts run
type Vehicle = { id: string; tenant: string; plate: string; fuel: number };

const vehicles = new Map<string, Vehicle>([
  ["v1", { id: "v1", tenant: "alfa", plate: "01 A 111 AA", fuel: 62 }],
  ["v2", { id: "v2", tenant: "beta", plate: "10 B 222 BB", fuel: 48 }],
]);
const readings = Array.from({ length: 5000 }, (_, i) => ({ vehicleId: "v2", seq: i }));

const MAX_PAGE = 100;

function getVehicle(tenant: string, id: string): Vehicle | null {
  const v = vehicles.get(id);
  return v && v.tenant === tenant ? v : null; // begona tenant: "topilmadi"
}
function setFuel(tenant: string, id: string, value: unknown): boolean {
  const v = getVehicle(tenant, id);
  if (!v || typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) return false;
  v.fuel = value;
  return true;
}
function listReadings(limit: unknown) {
  const n = Number(limit);
  const safe = Number.isInteger(n) && n > 0 ? Math.min(n, MAX_PAGE) : MAX_PAGE;
  return readings.slice(0, safe);
}

console.log("1) Maxfiylik:", getVehicle("alfa", "v2")?.plate ?? "topilmadi");
console.log("2) Yaxlitlik:", setFuel("alfa", "v1", -500), "->", vehicles.get("v1")!.fuel);
console.log("3) Mavjudlik, qaytgan qatorlar:", listReadings("Infinity").length);
console.log("   o'z ma'lumoti:", getVehicle("alfa", "v1")?.plate, setFuel("alfa", "v1", 55));
```

```text
1) Maxfiylik: topilmadi
2) Yaxlitlik: false -> 62
3) Mavjudlik, qaytgan qatorlar: 100
   o'z ma'lumoti: 01 A 111 AA true
```

### Tuzatish nima uchun yetarli

Har nuqson o'z xususiyatiga mos nazorat bilan yopildi. Maxfiylik uchun egalik tekshiruvi har o'qishda bajariladi va begona mashina uchun javob "mavjud emas" bilan bir xil ("topilmadi"), shuning uchun hujumchi mashina borligini ham bilib ololmaydi. Yaxlitlik uchun qiymat turi va ruxsat etilgan diapazon tekshiriladi, va yozish ham egalik tekshiruvidan o'tadi. Mavjudlik uchun sahifa o'lchamiga qat'iy yuqori chegara qo'yilgan, noto'g'ri qiymat esa xatoga emas, xavfsiz standart qiymatga olib keladi (fail-safe default, 3-dars).

Tuzatish "yetarli" deganda faqat shu uch hujum uchun. Bu kod hali autentifikatsiyani, so'rovlar chastotasini cheklashni (73-dars) va audit logni (79-dars) o'z ichiga olmaydi; `fuel` ning `0..100` oralig'i esa modelimizdagi taxmin, real datchik uchun u boshqacha bo'lishi mumkin. Egalik tekshiruvi umumiy holda IDOR deb ataladigan zaiflikka qarshi asosiy himoya (52-dars), kiritishni sxema bilan tekshirish esa 72-darsda chuqur ko'riladi.

### Mashq: risk balli

Quyidagi funksiyalar risk register uchun ball va daraja hisoblaydi, lekin ikkita xatosi bor. "Tekshirish" tugmasini bosib, qaysi testlar o'tmayotganini ko'ring va tuzating. Qoidalar: ball ehtimollik va ta'sirning ko'paytmasi, qiymatlar 1 dan 5 gacha butun son (aks holda `RangeError`), 15 va undan yuqori "yuqori", 8 dan 14 gacha "o'rta", qolgani "past".

```ts run
// Xavf = ehtimollik x ta'sir (har biri 1..5 butun son).
function riskScore(likelihood: number, impact: number): number {
  return likelihood + impact;
}

// 15 va undan yuqori - "yuqori", 8..14 - "o'rta", qolgani - "past".
function band(score: number): string {
  return score >= 15 ? "yuqori" : "o'rta";
}
```

```ts test
check("3 x 5 = 15", () => riskScore(3, 5) === 15);
check("eng kichik qiymat 1 x 1 = 1", () => riskScore(1, 1) === 1);
check("0 qiymat RangeError beradi", () => {
  try { riskScore(0, 3); return false; } catch (e) { return e instanceof RangeError; }
});
check("kasr qiymat RangeError beradi", () => {
  try { riskScore(2.5, 3); return false; } catch (e) { return e instanceof RangeError; }
});
check("15 - yuqori", () => band(15) === "yuqori");
check("8 - o'rta (chegara)", () => band(8) === "o'rta");
check("7 - past", () => band(7) === "past");
```

## Qachon qo'llamaslik kerak

CIA triadasi va risk register foydali, lekin ular har vaziyatda to'g'ri asbob emas.

- Uch xususiyat hamma narsani qamrab olmaydi. Hisobdorlik (kim nima qilganini keyin isbotlash imkoni), maxfiylikdan farqli privacy (shaxsiy ma'lumot bilan nima qilinishi) va xavfsizlik (safety, ya'ni jismoniy zarar) alohida e'tibor talab qiladi. Avtopark platformasida noto'g'ri tormoz sensori ma'lumoti yaxlitlik muammosi bo'lishi bilan birga jismoniy xavf ham bo'lishi mumkin. Bunday holda faqat CIA tilida gaplashish yetarli emas.
- Ball yolg'on aniqlik beradi. 12 va 10 ball orasidagi farq muhokamaga arzimaydi; muhimi, 15 balllini 8 balllidan oldin ko'rishingiz. Ballni solishtirish uchun emas, tartiblash uchun ishlating.
- Kichik jamoada rasmiy register ortiqcha yuk bo'lishi mumkin. Agar tizimda uch endpoint bo'lsa, ro'yxatni bir sahifada yuritish va har sprintda ko'rish yetarli. Risk register katta loyiha va mas'uliyat taqsimoti kerak bo'lganda o'zini oqlaydi.
- Risk baholash tuzatishni kechiktirish uchun bahona bo'lmasligi kerak. Agar tuzatish yarim soatlik ish bo'lsa, uning riskini uzoq muhokama qilish ortiqcha: yoping.
- "Bizni kim ham bilardi" deb ehtimollikni past baholash klassik xato. Ehtimolni baholashda hujumchining sizga qiziqishi emas, sizning ekspozitsiyangiz (nima internetga ochiq va qancha himoya qatlami bor) muhim.

## Stack'da: NestJS va Prisma

Yuqoridagi uch nazorat real stack'da bitta joyga yig'iladi: kirishni tekshiradigan DTO yoki sxema, egalikni tekshiradigan servis qatlami va chegaralangan so'rov. Quyidagi parcha NestJS controller va Prisma bilan o'sha g'oyani ko'rsatadi (bu kod ishga tushirilmaydi, chunki NestJS va Prisma mijozi brauzer worker'ida mavjud emas; u faqat TypeScript sintaksisi jihatidan tekshirilgan).

```ts
import { Controller, Get, NotFoundException, Param, Query, Req } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const MAX_PAGE = 100;

@Controller("vehicles")
export class VehiclesController {
  @Get(":id/readings")
  async readings(
    @Req() req: { user: { tenantId: string } },
    @Param("id") id: string,
    @Query("limit") limit?: string,
  ) {
    const n = Number(limit);
    const take = Number.isInteger(n) && n > 0 ? Math.min(n, MAX_PAGE) : MAX_PAGE;

    const vehicle = await prisma.vehicle.findFirst({
      where: { id, tenantId: req.user.tenantId }, // egalik so'rovning o'zida
      select: { id: true },
    });
    if (!vehicle) throw new NotFoundException(); // begona va yo'q mashina bir xil javob oladi

    return prisma.reading.findMany({
      where: { vehicleId: vehicle.id },
      orderBy: { ts: "desc" },
      take,
    });
  }
}
```

Bu yerda egalik sharti `findFirst` ichida turibdi, ya'ni "avval ol, keyin tekshir" ketma-ketligi yo'q va tekshiruvni unutib qoldirish qiyinroq. Node.js'da `Number("Infinity")` va `Number("abc")` kutilmagan qiymat berishini ham unutmang: kirishdagi har `string` ni oldin turiga va diapazoniga tekshirib, keyin ishlating. Xavfsizlik bo'yicha umumiy talablar ro'yxati sifatida OWASP ASVS (8-dars) xizmat qiladi.

## Xulosa

- Xavfsizlik uch xususiyatni himoya qiladi: maxfiylik, yaxlitlik va mavjudlik. Bitta kod nuqsoni bir nechta xususiyatni buzishi mumkin.
- Aktiv, tahdid, zaiflik va riskni aralashtirmang: zaiflikni kod bilan tuzatasiz, riskni esa ehtimollik va ta'sirni kamaytirish orqali boshqarasiz.
- OWASP risk reytingida ekspluatatsiya osonligi, nazorat yetishmasligi va texnik hamda biznes ta'siri birga hisobga olinadi; CWE esa zaiflikka olib keluvchi weakness turlarini tasniflaydi.
- Risk register ballni solishtirish uchun emas, tartiblash va muhokama uchun: ko'paytma ehtimol va ta'sir farqini yashiradi.
- Tuzatish har xususiyat uchun alohida nazorat: egalik tekshiruvi, qiymatni tekshirish va resurs chegarasi. Qo'llanilgan tuzatishning nimani qoplamasligini ham yozib qo'ying.
