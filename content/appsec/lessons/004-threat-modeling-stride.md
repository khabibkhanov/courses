---
n: 4
slug: threat-modeling-stride
title: "Threat modeling: data flow diagram, trust boundary va STRIDE"
summary: "Threat modeling to'rt savoli, data flow diagram elementlari, trust boundary tushunchasi, STRIDE kategoriyalari va ularning buzilgan xususiyatlarga bog'lanishi; mijoz yuborgan header'ga ishonish tufayli tenant almashtirish misoli."
duration: 45
sources:
  - id: ms-stride
    note: "Microsoft Threat Modeling Tool tahdid ro'yxati sahifasi: STRIDE modelining olti kategoriyasi (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) ta'riflari; element bo'yicha jadval sahifada yo'q"
  - id: cs-threat-model
    note: "Threat Modeling Cheat Sheet: to'rt savol va to'rt bosqich (tizimni modellash, tahdidlarni topish va tartiblash, javob choralari, tekshirish), STRIDE jadvali va uni boshqa usullar bilan solishtirish, Shostack javob variantlari"
  - id: t10-a06
    note: "A06:2025 Insecure Design: threat modeling dizayn bosqichida ishlatiladigan amaliyot sifatida"
quiz:
  - q: "Data flow diagram'da \"trust boundary\" nima?"
    options:
      - "Eng tez tarmoq ulanishi"
      - "Ma'lumot bir ishonch darajasidan boshqasiga o'tadigan chiziq; shu yerda tekshiruv kerak"
      - "Ikki servis orasidagi HTTP ulanish"
      - "Ma'lumotlar bazasi jadvali"
    answer: 1
    explain: "Trust boundary - ishonch darajasi o'zgaradigan joy (masalan brauzer va server, tenant va tenant, ilova va uchinchi tomon). Ma'lumot chegaradan o'tganda ishonib bo'lmaydigan deb qaraladi va tekshiriladi."
  - q: "Hujumchi boshqa foydalanuvchi nomidan so'rov yuboradi. STRIDE'ning qaysi kategoriyasi va qaysi xususiyat buziladi?"
    options:
      - "Tampering; yaxlitlik"
      - "Spoofing; autentifikatsiya (kim ekanligi)"
      - "Repudiation; mavjudlik"
      - "Information disclosure; autentifikatsiya"
    answer: 1
    explain: "Spoofing - o'zini boshqa sifatida ko'rsatish; buziladigan xususiyat autentifikatsiya. Tampering ma'lumot o'zgartirish bilan, Information disclosure oshkor bo'lish bilan bog'liq."
  - q: "Operator mijoz ma'lumotini o'chirdi va keyin \"men qilmadim\" dedi; tizimda hech qanday audit yo'q. STRIDE kategoriyasi?"
    options:
      - "Denial of service"
      - "Elevation of privilege"
      - "Spoofing"
      - "Repudiation: harakat izi yo'qligi inkor qilishga imkon beradi"
    answer: 3
    explain: "Repudiation - harakatni keyin inkor qila olish. Nazorat: audit log (79-dars), imzo va o'zgarmas yozuv. Xizmatni to'xtatish DoS, huquqni oshirish EoP bo'lardi."
  - q: "`x-tenant-id` header'idan tenant aniqlanadigan endpoint'ni tahlil qilish uchun eng to'g'ri xulosa?"
    options:
      - "Header brauzer tomonidan qo'yiladi, shuning uchun ishonchli"
      - "Header chegaradan keladigan ishonchsiz ma'lumot; tenant tasdiqlangan session'dan olinishi kerak"
      - "Header'ni base64 qilish kifoya"
      - "HTTPS bo'lsa header'ni o'zgartirib bo'lmaydi"
    answer: 1
    explain: "Header mijoz boshqaradigan ma'lumot: HTTPS uni tashishni himoya qiladi, mijozning o'zi yuborishini emas. Tenant identifikatori server tasdiqlagan manbadan (session) olinadi."
  - q: "STRIDE-per-element yondashuvida data store (masalan PostgreSQL) uchun odatda qaysi kategoriyalar ko'riladi?"
    options:
      - "Tampering, Information disclosure, Denial of service (va log saqlansa Repudiation)"
      - "Faqat Spoofing"
      - "Faqat Elevation of privilege"
      - "Hech qaysi, chunki baza ichki"
    answer: 0
    explain: "Data store'ga yozish yaxlitlikni, o'qish maxfiylikni, to'lib ketish yoki bloklash mavjudlikni buzadi. Bu STRIDE-per-element ishchi qoidasi."
  - q: "Threat modeling qachon eng foydali?"
    options:
      - "Production'ga chiqqandan keyin, hodisa yuz berganda"
      - "Faqat penetration test o'tkazilgandan keyin"
      - "Dizayn bosqichida va muhim o'zgarishlarda, to'g'irlash arzon bo'lganda"
      - "Faqat tashqi auditor so'raganda"
    answer: 2
    explain: "Dizayn nuqsonini kod yozilgandan keyin tuzatish qimmat. Threat modeling dizayn bosqichida va katta o'zgarishlarda tahdidlarni topib, nazoratlarni arzon qo'shishga imkon beradi."
task:
  title: "Tenant'ni ishonchsiz manbadan emas, session'dan olish"
  prompt: |
    `createReport(req)` hisobot yaratadi va tenant'ni `req.body.tenantId` yoki `x-tenant-id` header'idan oladi. Bu chegaradan keladigan ma'lumotga ishonish (spoofing).

    Funksiyani tuzating: tenant faqat `req.session.tenant` dan olinsin. Agar so'rov tanasi yoki header boshqa tenant ko'rsatsa, so'rov rad etilsin (`{ status: 403 }`). Session bo'lmasa `{ status: 401 }`. Muvaffaqiyatli holatda `{ status: 200, tenant }` qaytsin. Imzoni o'zgartirmang. Kutilgan natija: 200 alfa, 403, 403, 401.
  lang: ts
  starter: |
    type Req = {
      session?: { userId: string; tenant: string };
      headers: Record<string, string>;
      body: { tenantId?: string };
    };

    function createReport(req: Req): { status: number; tenant?: string } {
      const tenant = req.body.tenantId ?? req.headers["x-tenant-id"] ?? req.session?.tenant;
      if (!tenant) return { status: 401 };
      return { status: 200, tenant };
    }

    const session = { userId: "u1", tenant: "alfa" };
    console.log(createReport({ session, headers: {}, body: {} }));
    console.log(createReport({ session, headers: { "x-tenant-id": "beta" }, body: {} }));
    console.log(createReport({ session, headers: {}, body: { tenantId: "beta" } }));
    console.log(createReport({ headers: { "x-tenant-id": "beta" }, body: {} }));
  solution: |
    type Req = {
      session?: { userId: string; tenant: string };
      headers: Record<string, string>;
      body: { tenantId?: string };
    };

    function createReport(req: Req): { status: number; tenant?: string } {
      if (!req.session) return { status: 401 }; // autentifikatsiya yo'q
      const tenant = req.session.tenant; // yagona ishonchli manba
      const claimed = [req.body.tenantId, req.headers["x-tenant-id"]];
      if (claimed.some((c) => c !== undefined && c !== tenant)) return { status: 403 };
      return { status: 200, tenant };
    }

    const session = { userId: "u1", tenant: "alfa" };
    console.log(createReport({ session, headers: {}, body: {} }));
    console.log(createReport({ session, headers: { "x-tenant-id": "beta" }, body: {} }));
    console.log(createReport({ session, headers: {}, body: { tenantId: "beta" } }));
    console.log(createReport({ headers: { "x-tenant-id": "beta" }, body: {} }));
  solutionNotes: |
    - Tenant identifikatori faqat server tasdiqlagan manbadan (session) olinadi. Mijoz yuborgan qiymat bu yerda "da'vo": u faqat session bilan mos kelishi tekshiriladi.
    - Mos kelmaydigan da'vo 403 beradi, jimgina e'tiborsiz qoldirilmaydi: bunday so'rov hujum yoki xato belgisi va uni kuzatish foydali (79-dars).
    - Session bo'lmasa 401: ishonchsiz manbadan tenant olish yo'li butunlay yopiladi.
    - Bu faqat shu funksiyadagi spoofing'ni yopadi. Sessiya o'zi qanday tasdiqlanishi (41-46 darslar) va ma'lumot qatlamidagi izolyatsiya (55-56 darslar) alohida nazoratlar.
  checklist:
    - "Tenant faqat session'dan olinadi"
    - "Body yoki header'dagi boshqa tenant 403 beradi"
    - "Session bo'lmasa 401 qaytadi"
    - "Imzo o'zgarmagan"
    - "Qaysi trust boundary'da tekshiruv qo'yilganini ayta olasiz"
---

## Muammo

Hujumchi modeli (2-dars) kim hujum qilishini aytadi, secure design tamoyillari (3-dars) umumiy yo'nalish beradi. Lekin ikkalasi ham aniq tizim haqida gapirmaydi. Sizning platformangizda qaysi komponent kimdan ma'lumot oladi? Qayerda ma'lumotga ishonish kerak emas? Har bir bunday joyda nima noto'g'ri ketishi mumkin?

Bu savollarga javob bermasdan xavfsizlik ishi ikki chetga og'adi. Birinchi chet: bor kuchni bitta tanish zaiflikka (masalan SQL injection) sarflab, boshqa turdagi muammolarni umuman o'ylamaslik. Ikkinchisi: hamma narsadan xavotirlanib, nimadan boshlashni bilmaslik. Threat modeling bu muammoni tizimli yo'l bilan hal qiladi: tizimni diagrammada tasvirlaydi, ishonch chegaralarini belgilaydi va har bir element uchun muntazam savollar to'plamini beradi.

Threat modeling'ni qo'llamaslikning oqibati ko'pincha dizayn nuqsoni. Masalan, tenant identifikatori so'rov header'idan olinadigan servis xavfsiz kod bilan yozilgan bo'lishi mumkin, lekin dizayni ishonchsiz ma'lumotga tayanadi. Bunday xatoni kod ko'rib chiqishi tez topmasligi mumkin, diagramma esa chegaradan o'tayotgan ishonchsiz ma'lumotni darhol ko'rsatadi.

## Asosiy g'oya

### Threat modeling nima

Threat Modeling Cheat Sheet threat modeling'ni tizimni xavfsizlik nuqtai nazaridan modellash, unga tegishli tahdidlarni aniqlash va ularga javobni belgilash bo'yicha tuzilgan, takrorlanadigan jarayon sifatida ta'riflaydi. Sahifa uni dizayn bosqichida o'tkazishni, va bir marta emas, tizim bilan birga yangilab borishni tavsiya qiladi; universal qabul qilingan yagona standart yo'qligini ham ochiq aytadi. Cheat sheet Threat Modeling Manifesto'ga tayanib jarayon quyidagi to'rt savolga javob berishi kerakligini yozadi:

1. Biz nima ustida ishlayapmiz? (tizimning modeli)
2. Nima noto'g'ri ketishi mumkin? (tahdidlar)
3. Bu haqda nima qilamiz? (nazorat choralari)
4. Ishimiz yetarlimi? (tekshirish)

Threat modeling kod emas, tahlil jarayoni. Natijasi: diagramma, tahdidlar ro'yxati va har tahdid uchun qaror (kamaytirish, qabul qilish, o'tkazish yoki oldini olish). OWASP A06 Insecure Design uchun asosiy amaliyotlardan biri sifatida threat modeling'ni dizayn bosqichida o'tkazishni ko'rsatadi.

### Data flow diagram va trust boundary

Data flow diagram (DFD) tizimni besh turdagi element bilan tasvirlaydi:

- Tashqi ob'ekt (external entity): tizimdan tashqaridagi aktyor yoki tizim: brauzer, mobil ilova, GPS qurilma, uchinchi tomon API.
- Jarayon (process): kodni bajaruvchi komponent: API servisi, ingest gateway, worker.
- Ma'lumotlar ombori (data store): PostgreSQL, Redis, fayl ombori, log.
- Ma'lumot oqimi (data flow): komponentlar orasidagi uzatish: HTTP so'rov, xabar navbati, SQL.
- Trust boundary: ishonch darajasi o'zgaradigan chiziq.

Trust boundary tushunchasi eng muhimi. Chegara ikki tomonda ham turli ishonch darajasi bor ekanini bildiradi: brauzerdan kelgan ma'lumot serverda ishonchsiz, tenant `alfa` ma'lumoti tenant `beta` uchun yopiq, ichki servis uchinchi tomon API javobiga ishonmasligi kerak. Qoida: ma'lumot trust boundary'dan o'tganda uni tekshiring, aniqlang va ruxsatni qayta hisoblang. Chegaradan o'tmaydigan oqimlar (bir jarayon ichidagi funksiya chaqiruvi) odatda alohida tahlil talab qilmaydi.

### STRIDE

STRIDE - Microsoft xodimlari ishlab chiqqan tahdid tasnifi va eslab qolish qoidasi (mnemonic), har harf tahdidning bir turini va u buzadigan xavfsizlik xususiyatini bildiradi. Microsoft Threat Modeling Tool'ning tahdid ro'yxati tahdidlarni shu kategoriyalar bo'yicha guruhlaydi.

| Harf | Tahdid | Buziladigan xususiyat | Avtopark platformasidagi misol |
|---|---|---|---|
| S | Spoofing | Autentifikatsiya | Boshqa qurilma nomidan telemetriya yuborish |
| T | Tampering | Yaxlitlik | Yoqilg'i hisobotidagi qiymatni o'zgartirish |
| R | Repudiation | Hisobdorlik (cheat sheet: Accounting) | Operator o'chirgan mashinani "men qilmadim" deb inkor qilishi |
| I | Information disclosure | Maxfiylik | Xato javobida boshqa tenant mashinasi ma'lumoti |
| D | Denial of service | Mavjudlik | Eksport so'rovlari bilan bazani band qilish |
| E | Elevation of privilege | Avtorizatsiya | Oddiy foydalanuvchi admin funksiyani chaqiradi |

STRIDE CIA triadasini (1-dars) kengaytiradi: maxfiylik, yaxlitlik va mavjudlikka autentifikatsiya, hisobdorlik va avtorizatsiya qo'shiladi. Jadvaldagi "buziladigan xususiyat" ustuni Threat Modeling Cheat Sheet'dagi STRIDE jadvaliga mos. Shuning uchun u dasturchi uchun qulay checklist: har element uchun oltita savol beradi.

## Chuqurroq: STRIDE'ni elementga qo'llash

### STRIDE-per-element

Hamma element hamma kategoriyaga duch kelmaydi. Keng tarqalgan variant (STRIDE-per-element) elementga qarab savollarni cheklaydi. Quyidagi jadval shu yondashuvning keng tarqalgan ishchi qoidasi (Shostack metodikasidagi variant). Kurs manbalari element bo'yicha jadvalni o'zi bermaydi, shuning uchun uni qat'iy standart emas, savollarni qisqartirish uchun boshlang'ich nuqta deb qabul qiling:

| Element | S | T | R | I | D | E |
|---|---|---|---|---|---|---|
| Tashqi ob'ekt | ha | | ha | | | |
| Jarayon | ha | ha | ha | ha | ha | ha |
| Ma'lumotlar ombori | | ha | ha (log bo'lsa) | ha | ha | |
| Ma'lumot oqimi | | ha | | ha | ha | |

Quyidagi kod kichik avtopark DFD'sini ma'lumot sifatida tasvirlaydi, qaysi oqimlar trust boundary'dan o'tishini topadi va har element uchun STRIDE kategoriyalarini sanaydi. Bu tahlilni to'liq almashtirmaydi, lekin ro'yxatni mexanik tuzishni tezlashtiradi.

```ts run
type Kind = "entity" | "process" | "store" | "flow";
type Node = { id: string; kind: Kind; zone: string };
type Flow = { from: string; to: string; label: string };

const nodes: Node[] = [
  { id: "brauzer", kind: "entity", zone: "internet" },
  { id: "api", kind: "process", zone: "ilova" },
  { id: "postgres", kind: "store", zone: "ilova" },
  { id: "fuel-provider", kind: "entity", zone: "uchinchi-tomon" },
];
const flows: Flow[] = [
  { from: "brauzer", to: "api", label: "HTTPS so'rov" },
  { from: "api", to: "postgres", label: "SQL" },
  { from: "fuel-provider", to: "api", label: "webhook" },
];

const applies: Record<Kind, string> = { entity: "SR", process: "STRIDE", store: "TRID", flow: "TID" };
const zone = new Map(nodes.map((n) => [n.id, n.zone]));

for (const f of flows) {
  const crosses = zone.get(f.from) !== zone.get(f.to);
  console.log(`${f.from} -> ${f.to} (${f.label}) chegara: ${crosses ? "O'TADI" : "ichki"}  oqim: ${applies.flow}`);
}
for (const n of nodes) console.log(`${n.id.padEnd(14)} ${n.kind.padEnd(8)} ${applies[n.kind]}`);
```

```text
brauzer -> api (HTTPS so'rov) chegara: O'TADI  oqim: TID
api -> postgres (SQL) chegara: ichki  oqim: TID
fuel-provider -> api (webhook) chegara: O'TADI  oqim: TID
brauzer        entity   SR
api            process  STRIDE
postgres       store    TRID
fuel-provider  entity   SR
```

Natijada ikki oqim chegaradan o'tadi (brauzer va webhook): ularda eng ko'p e'tibor kerak. `api` jarayoni oltita kategoriyaning hammasi uchun ko'rib chiqiladi. Bu birinchi o'tish; keyingi darsda (5-dars) shu usulni to'liq platformaga qo'llaymiz.

### Tahdidlarni tartiblash va usulni tanlash

Tahdidlar topilgach, jamoa ularni odatda tartiblaydi. Cheat sheet nazariy jihatdan tartib ehtimollik va ta'sir ko'paytmasiga asoslanishini aytadi, lekin ikkalasini hisoblash qiyin va ular tuzatish mehnatini hisobga olmaydi. Shu sababli ba'zilar tuzatish narxini ham bitta tartiblashga qo'shishni taklif qiladi. Bu 1-darsdagi risk register cheklovlari bilan bir xil gap: ball tartib beradi, qarorni almashtirmaydi.

STRIDE har savolga javob bermaydi. Cheat sheet texnik dizayn uchun STRIDE bilan boshlashni, doira boshqa ko'rinishni talab qilsa boshqa usulni tanlashni tavsiya qiladi. Hujumchining aniq maqsadi va ko'p bosqichli hujum uchun attack tree (maqsaddan boshlab unga olib boradigan yo'llar bo'laklarga ajratiladi); to'g'ri ishlaydigan oqim yoki biznes qoidasini suiste'mol qilish uchun misuse va abuse case (amallar noto'g'ri tartibda, takror, bir vaqtda yoki kutilmagan natija uchun bajariladi); maxfiylik zararlari uchun LINDDUN; biznes ta'siri bilan bog'liq ilova tahdidlari uchun PASTA; tashkilot darajasidagi risk uchun OCTAVE. Sahifaning ogohlantirishi: usulni modelni "to'liq ko'rsatish" uchun qo'shmang, har usul nima uchun doiraga mos ekanini va u nimani qamramasligini yozing. Avtopark platformasida bu shunday ko'rinadi: ingest va API chegaralari uchun STRIDE, "mijoz eksportni takror va parallel chaqirsa nima bo'ladi" savoli uchun abuse case (59 va 60-darslar), haydovchi joylashuvi bilan bog'liq maxfiylik uchun LINDDUN kabi privacy usuli.

Oxirgi bosqich, review, ko'pincha unutiladi. Cheat sheet modelni faqat dasturchilar yoki xavfsizlik jamoasi emas, barcha manfaatdor tomonlar ko'rib chiqishini yozadi va tekshiruv savollarini beradi: DFD tizimni to'g'ri aks ettiradimi, hamma tahdid topildimi, har tahdid uchun javob kelishilganmi, kamaytirish tanlangan joyda risk qabul qilinadigan darajaga tushadimi, model hujjatlashtirilgan va "bilish kerak" bo'lganlar uchun ochiqmi, kelishilgan nazoratlarni sinab, muvaffaqiyat yoki muvaffaqiyatsizligini o'lchash mumkinmi. Oxirgi savol eng amaliysi: "begona tenant ma'lumotini olib bo'lmaydi" tahdid javobi test sifatida yozilmasa, u xohish bo'lib qoladi.

### Tahdiddan nazoratga

Topilgan tahdid uchun to'rtta tipik qaror bor: kamaytirish (nazorat qo'shish), qabul qilish (ehtimol va ta'sir past), o'tkazish (sug'urta, mijoz shartnomasi) yoki oldini olish (funksiyani olib tashlash). Qaror hujjatlanadi, chunki oylar o'tib "nega bunday qildik" degan savol chiqadi. Nazoratlar STRIDE kategoriyasi bo'yicha keladi: spoofing uchun autentifikatsiya, tampering uchun imzo va tekshirish, repudiation uchun audit log, information disclosure uchun avtorizatsiya va shifrlash, DoS uchun limit, elevation of privilege uchun avtorizatsiya tekshiruvi. Cheat sheet javob variantlarini Adam Shostack'ga tayanib shunday sanaydi: mitigate (kamaytirish), eliminate (olib tashlash), transfer (o'tkazish) va accept (qabul qilish). Transfer riskning ehtimolini kamaytirmasligini, shuning uchun qolgan nazoratlar va qoldiq risk egasini yozib qo'yish kerakligini ham eslatadi. STRIDE kategoriyalari va nazoratlarni bog'lash esa ishchi ko'rsatma, qat'iy qonun emas.

## Misol: mijoz yuborgan header'ga ishonish

Kod o'quv maqsadida; u faqat shu darsning in-memory modeliga qarshi.

### 1. Zaif kod

```ts run
type Req = { headers: Record<string, string>; session?: { userId: string; tenant: string } };
const vehicles = [
  { id: "v1", tenant: "alfa", plate: "01 A 111 AA" },
  { id: "v2", tenant: "beta", plate: "10 B 222 BB" },
];

// ZAIF: tenant mijoz header'idan olinadi (chegaradan o'tgan ishonchsiz ma'lumot)
function listVehiclesWeak(req: Req) {
  const tenant = req.headers["x-tenant-id"] ?? req.session?.tenant;
  return vehicles.filter((v) => v.tenant === tenant).map((v) => v.plate);
}

const session = { userId: "u1", tenant: "alfa" };
console.log("oddiy so'rov:", listVehiclesWeak({ headers: {}, session }));
console.log("header bilan:", listVehiclesWeak({ headers: { "x-tenant-id": "beta" }, session }));
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu tenant header'ini soxtalashtirish usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi "alfa" ning qonuniy foydalanuvchisi. U brauzer yoki `curl` orqali so'rovga `x-tenant-id: beta` header'ini qo'shadi. Server header'ni session'dan ustun qo'yadi:

```text
oddiy so'rov: [ '01 A 111 AA' ]
header bilan: [ '10 B 222 BB' ]
```

STRIDE bo'yicha bu spoofing (boshqa tenant sifatida ko'rinish) va natijada information disclosure. Diagrammada brauzer va API orasidagi oqim trust boundary'dan o'tadi, ya'ni undagi hamma maydon ishonchsiz; header ham shu maydonlardan biri.

### 3. Tuzatilgan kod

```ts run
type Req = { headers: Record<string, string>; session?: { userId: string; tenant: string } };
const vehicles = [
  { id: "v1", tenant: "alfa", plate: "01 A 111 AA" },
  { id: "v2", tenant: "beta", plate: "10 B 222 BB" },
];

function listVehicles(req: Req): { status: number; plates?: string[] } {
  if (!req.session) return { status: 401 };
  const tenant = req.session.tenant; // yagona ishonchli manba
  const claimed = req.headers["x-tenant-id"];
  if (claimed !== undefined && claimed !== tenant) return { status: 403 };
  return { status: 200, plates: vehicles.filter((v) => v.tenant === tenant).map((v) => v.plate) };
}

const session = { userId: "u1", tenant: "alfa" };
console.log("oddiy so'rov:", listVehicles({ headers: {}, session }));
console.log("header bilan:", listVehicles({ headers: { "x-tenant-id": "beta" }, session }));
console.log("sessiyasiz:", listVehicles({ headers: { "x-tenant-id": "beta" } }));
```

```text
oddiy so'rov: { status: 200, plates: [ '01 A 111 AA' ] }
header bilan: { status: 403 }
sessiyasiz: { status: 401 }
```

Endi invariant: tenant identifikatori faqat tasdiqlangan session'dan keladi, mijoz yuborgan qiymat esa faqat session bilan mos kelishi tekshiriladigan da'vo. Bu spoofing hujumini ko'rsatilgan shaklda yopadi. Qoldiq risk: session o'zi qanday tasdiqlanadi (41 va 46-darslar), va hali ham bitta komponentdagi xato izolyatsiyani buzishi mumkin, shuning uchun ma'lumot qatlamida ham himoya kerak (55 va 56-darslar).

## Qachon qo'llamaslik kerak

- Threat modeling har o'zgarishga to'liq seans emas. Kichik o'zgarish (matn maydoni qo'shish) uchun uzun STRIDE tahlili ortiqcha; mezon: yangi trust boundary, yangi turdagi ma'lumot yoki yangi ishonch munosabati paydo bo'ladimi. Shunday bo'lsa, tahlil qiling.
- STRIDE hamma tahdidni topmaydi. U texnik tahdidlarga yaxshi mos, lekin biznes logikasi (59-dars) va ijtimoiy muhandislik kabi sohalarda kamroq yordam beradi. Ularga boshqa usullar yoki qo'shimcha savollar kerak.
- Diagramma haqiqatdan uzoqlashsa zararli. Eskirgan DFD yolg'on xotirjamlik beradi. Diagrammani kod bilan birga saqlang (repo ichida, kod review'da yangilanadigan) yoki uni o'zgarishlarda qayta ko'rib chiqing.
- Mexanik skript (yuqoridagi kabi) odamlar muhokamasini almashtirmaydi. Skript ro'yxat chiqaradi, lekin tahdidning mohiyatini, ehtimolini va ta'sirini jamoa bilan baholash kerak.
- Mukammal qamrov maqsad emas. Eng muhim oqimlar va ma'lumotlarni qamrab olgan to'liq bo'lmagan model, hech qachon tugamaydigan "mukammal" modeldan foydali.

## Stack'da: NestJS, Fastify va Next.js

DFD'dagi har bir chegara oqimi kodda aniq nuqtaga to'g'ri keladi: NestJS'da guard va pipe, Fastify'da `preHandler` hook va sxema validatsiyasi, Next.js'da middleware, route handler va server action. Tenant tushunchasi uchun amaliy naqsh: autentifikatsiya guard'i session'dan `tenantId` ni request kontekstiga yozadi va undan keyingi kod faqat shu qiymatdan foydalanadi. Quyidagi parcha NestJS parametr dekoratoridan foydalanadi (ishga tushirilmaydi, NestJS brauzer worker'ida yo'q):

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

type AuthedRequest = { user?: { tenantId: string }; headers: Record<string, string | undefined> };

// Tenant faqat tasdiqlangan foydalanuvchidan olinadi; header yoki body hech qachon manba emas
export const TenantId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const req = ctx.switchToHttp().getRequest<AuthedRequest>();
  if (!req.user) throw new Error("autentifikatsiya talab qilinadi");
  const claimed = req.headers["x-tenant-id"];
  if (claimed !== undefined && claimed !== req.user.tenantId) throw new Error("tenant mos emas");
  return req.user.tenantId;
});
```

Real kodda bu xatolar `UnauthorizedException` va `ForbiddenException` bilan almashtiriladi. Muhimi, controller metodlari tenant'ni parametr sifatida shu dekoratordan oladi va `@Body()` yoki `@Headers()` dan emas. Shu naqsh 55-darsda multi-tenancy bilan davom etadi.

## Xulosa

- Threat modeling: tizimni diagrammada tasvirlash, tahdidlarni topish, nazorat qarorini yozish va tekshirish. Eng arzon vaqt - dizayn bosqichi.
- DFD besh element bilan ishlaydi: tashqi ob'ekt, jarayon, ma'lumotlar ombori, ma'lumot oqimi va trust boundary.
- Trust boundary'dan o'tgan har bir ma'lumot ishonchsiz: tekshiring, aniqlang va ruxsatni qayta hisoblang.
- STRIDE oltita tahdid turini beradi (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege), har biri xavfsizlik xususiyatiga bog'lanadi.
- Mijoz yuborgan identifikator (header, body) da'vo, haqiqat emas: tenant tasdiqlangan session'dan olinadi.
