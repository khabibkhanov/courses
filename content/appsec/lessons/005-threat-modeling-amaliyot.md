---
n: 5
slug: threat-modeling-amaliyot
title: "Threat modeling amaliyotda: avtopark platformasi modeli"
summary: "Avtopark platformasi uchun threat modeling'ni boshidan oxirigacha o'tkazish: aktivlar, DFD, chegaralar, STRIDE bo'yicha tahdidlar ro'yxati, ustuvorlik va nazoratlar; hamda qurilma identifikatoriga ishonadigan ingest kanalining zaif va HMAC bilan tuzatilgan versiyasi."
duration: 50
sources:
  - id: cs-threat-model
    note: "Threat Modeling Cheat Sheet: modellash, tahdidlarni topish, javob choralarini belgilash va natijani tekshirish bosqichlari"
  - id: ms-stride
    note: "Microsoft Threat Modeling Tool tahdid ro'yxati: STRIDE kategoriyalari bo'yicha tahdidlarni guruhlash"
  - id: asvs
    note: "ASVS 5.0.0: tahdid modelidan chiqqan nazoratlarni tekshiriladigan talablar bilan solishtirish uchun manba (8-dars)"
quiz:
  - q: "Avtopark platformasi modelida GPS qurilmadan ingest gateway'ga yo'l qaysi turdagi chegaradan o'tadi va nima uchun bu muhim?"
    options:
      - "Chegaradan o'tmaydi, chunki qurilma kompaniya mulki"
      - "Qurilma tashqi (kontrol qilinmaydigan) ob'ekt: ma'lumotni ishonchsiz deb qarash kerak"
      - "Faqat HTTPS bo'lsa chegara bor"
      - "Chegara faqat brauzer va API orasida bo'ladi"
    answer: 1
    explain: "Qurilma jismonan mijoz transportida, uni egallash yoki soxtalashtirish mumkin. Ingest kanaliga kelgan har xabar trust boundary'dan o'tgan ishonchsiz ma'lumot."
  - q: "Ingest xabarida `deviceId` ochiq maydon va imzo yo'q. Qaysi STRIDE tahdidlari birinchi navbatda ko'rinadi?"
    options:
      - "Faqat Denial of service"
      - "Repudiation va Elevation of privilege"
      - "Spoofing (boshqa qurilma nomidan) va Tampering (qiymatni o'zgartirish)"
      - "Faqat Information disclosure"
    answer: 2
    explain: "Imzosiz xabarda kim yuborgani ham, mazmuni ham tekshirib bo'lmaydi: bu spoofing va tampering. Qolgani ham mumkin, lekin bevosita bu ikkitasi."
  - q: "Xabarga HMAC qo'shildi, lekin tartib raqami (seq) yo'q. Hujumchi eski to'g'ri imzolangan xabarni qayta yuboradi. Natija?"
    options:
      - "Qabul qilinadi: imzo to'g'ri, xabar mazmuni eski bo'lsa ham"
      - "Rad etiladi, chunki HMAC vaqtni tekshiradi"
      - "Rad etiladi, chunki kalit o'zgargan"
      - "Server ishlamay qoladi"
    answer: 0
    explain: "HMAC xabar mazmunining yaxlitligi va kalit egasini tasdiqlaydi, lekin yangiligini emas. Replay'ga qarshi tartib raqami yoki vaqt oynasi kerak."
  - q: "Tahdidlar ro'yxatida 30 qator chiqdi. Eng to'g'ri keyingi qadam?"
    options:
      - "Hammasini bir vaqtda tuzatish"
      - "Ro'yxatni o'chirib tashlash, chunki ko'p"
      - "Faqat eng birinchi qatorni tuzatish"
      - "Ehtimollik va ta'sir bo'yicha tartiblab, eng yuqori ta'sirli va arzon tuzatiladiganlardan boshlash, qolganiga qaror yozish"
    answer: 3
    explain: "Threat modeling natijasi ustuvorlik: qaror (kamaytirish, olib tashlash, o'tkazish, qabul qilish) har tahdid uchun yoziladi, hammasi darhol tuzatilmaydi. 1-darsdagi risk register mantiqi shu yerda ishlaydi."
  - q: "Modelni qachon yangilash kerak?"
    options:
      - "Yilda bir marta, kalendar bo'yicha"
      - "Yangi trust boundary, yangi integratsiya yoki yangi turdagi maxfiy ma'lumot paydo bo'lganda"
      - "Hech qachon, bir marta yozilsa yetadi"
      - "Faqat hodisadan keyin"
    answer: 1
    explain: "Model tizim bilan birga o'zgarishi kerak. Qo'shilgan har yangi chegara yoki ma'lumot turi yangi tahdidlarni ochadi; eski model ular haqida hech narsa demaydi."
  - q: "Quyidagi tuzatish qaysi hujumni qoplamaydi? Xabar: `HMAC(key, deviceId|seq|fuel)`, `seq` oldingisidan katta bo'lishi shart."
    options:
      - "Boshqa qurilma nomidan soxta xabar"
      - "Eski xabarni qayta yuborish"
      - "Qiymatni yo'lda o'zgartirish"
      - "Egallangan qurilmaning o'z kalitidan foydalanib yolg'on qiymat yuborishi"
    answer: 3
    explain: "Qurilma kalitini egallagan hujumchi to'g'ri imzolangan yolg'on xabar yuboradi: imzo mazmun to'g'riligini emas, faqat manbani isbotlaydi. Uni aniqlash uchun qiymatni mantiqiy tekshirish (masalan, sakrash) va anomaliya monitoringi kerak."
task:
  title: "Ingest kanaliga replay himoyasi"
  prompt: |
    `accept(msg)` qurilma xabarini HMAC bilan tekshiradi, lekin tartib raqamini hisobga olmaydi: eski, to'g'ri imzolangan xabar qayta yuborilsa qabul qilinadi (replay).

    Funksiyani tuzating: har qurilma uchun oxirgi qabul qilingan `seq` saqlansin; `seq` oxirgidan qat'iy katta bo'lsagina xabar qabul qilinsin; imzo noto'g'ri bo'lsa `seq` o'zgarmasin. Imzoni o'zgartirmang. Kutilgan natija: `true, false, false, true`.
  lang: ts
  starter: |
    const enc = new TextEncoder();
    const KEY = "kalit-dev-1-o'quv";
    const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

    async function mac(deviceId: string, seq: number, fuel: number): Promise<string> {
      const k = await crypto.subtle.importKey("raw", enc.encode(KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      return hex(await crypto.subtle.sign("HMAC", k, enc.encode(`${deviceId}|${seq}|${fuel}`)));
    }

    type Msg = { deviceId: string; seq: number; fuel: number; mac: string };

    async function accept(msg: Msg): Promise<boolean> {
      const expected = await mac(msg.deviceId, msg.seq, msg.fuel);
      return expected === msg.mac;
    }

    const m1: Msg = { deviceId: "dev-1", seq: 5, fuel: 60, mac: await mac("dev-1", 5, 60) };
    const forged: Msg = { ...m1, seq: 6, fuel: 5 };
    console.log(await accept(m1));
    console.log(await accept(m1)); // replay
    console.log(await accept(forged));
    const m2: Msg = { deviceId: "dev-1", seq: 7, fuel: 58, mac: await mac("dev-1", 7, 58) };
    console.log(await accept(m2));
  solution: |
    const enc = new TextEncoder();
    const KEY = "kalit-dev-1-o'quv";
    const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");

    async function mac(deviceId: string, seq: number, fuel: number): Promise<string> {
      const k = await crypto.subtle.importKey("raw", enc.encode(KEY), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      return hex(await crypto.subtle.sign("HMAC", k, enc.encode(`${deviceId}|${seq}|${fuel}`)));
    }

    type Msg = { deviceId: string; seq: number; fuel: number; mac: string };
    const lastSeq = new Map<string, number>();

    async function accept(msg: Msg): Promise<boolean> {
      const expected = await mac(msg.deviceId, msg.seq, msg.fuel);
      if (expected !== msg.mac) return false; // imzo noto'g'ri: holat o'zgarmaydi
      if (msg.seq <= (lastSeq.get(msg.deviceId) ?? 0)) return false; // replay yoki eski xabar
      lastSeq.set(msg.deviceId, msg.seq);
      return true;
    }

    const m1: Msg = { deviceId: "dev-1", seq: 5, fuel: 60, mac: await mac("dev-1", 5, 60) };
    const forged: Msg = { ...m1, seq: 6, fuel: 5 };
    console.log(await accept(m1));
    console.log(await accept(m1)); // replay
    console.log(await accept(forged));
    const m2: Msg = { deviceId: "dev-1", seq: 7, fuel: 58, mac: await mac("dev-1", 7, 58) };
    console.log(await accept(m2));
  solutionNotes: |
    - `seq` faqat imzo tekshiruvidan keyin yangilanadi. Aks holda hujumchi noto'g'ri imzoli xabar bilan katta `seq` yuborib, haqiqiy qurilmani to'sib qo'yishi mumkin (DoS).
    - Imzo `seq` va `fuel` ni qamraydi, shuning uchun ularni almashtirish imzoni buzadi (`forged` rad etiladi).
    - Taqqoslash `===` bilan oddiy satr solishtirish. Real kodda imzo `crypto.subtle.verify` bilan tekshiriladi yoki Node'da `crypto.timingSafeEqual` ishlatiladi (62-dars); bu o'quv soddalashtirishi.
    - Bu hali egallangan qurilmaning o'z kalitidan foydalanishini va `lastSeq` ni xotirada saqlash bilan qayta ishga tushganda yo'qolishini qoplamaydi: real tizimda u bazada saqlanadi.
  checklist:
    - "Replay (eski seq) rad etiladi"
    - "Noto'g'ri imzoli xabar seq holatini o'zgartirmaydi"
    - "Imzo seq va qiymatni qamraydi"
    - "Soddalashtirishlar (oddiy solishtirish, xotirada holat) nimaga olib kelishini ayta olasiz"
    - "Imzo manbani isbotlaydi, qiymat to'g'riligini emas"
---

## Muammo

Threat modeling nazariyada oddiy: diagramma chiz, STRIDE'ni qo'lla, nazoratlarni yoz. Amalda jamoalar ikki joyda qotib qoladi. Birinchisi, nimadan boshlash: tizim katta, diagramma bir sahifaga sig'maydi, har element uchun oltita savol bir necha yuz qatorga aylanadi. Ikkinchisi, natijaning taqdiri: uzun ro'yxat hujjatga aylanadi va hech kim uni ochmaydi.

Bu darsning vazifasi 4-darsdagi usulni to'liq avtopark platformasiga qo'llash va mashq sifatida yakunlashdir. Maqsad mukammal hujjat emas, ishlaydigan model: bir kunlik seansda chiqadigan, kodga va backlog'ga aylanadigan tahdidlar ro'yxati. Misol sifatida platformaning eng ishonchsiz chegarasini, ya'ni qurilmadan keladigan telemetriya kanalini tahlil qilamiz, chunki bu yerda ma'lumotga ishonish eng qimmatga tushadi: soxta yoqilg'i ma'lumoti hisobotlar, signal va hisob-kitoblarga ta'sir qiladi.

## Asosiy g'oya

### Jarayon: qadamma-qadam

Threat Modeling Cheat Sheet jarayonni to'rt bosqichga bo'ladi: tizimni modellash (DFD eng keng tarqalgan usul), tahdidlarni aniqlash (STRIDE bilan), javob choralari (mitigate, eliminate, transfer, accept) va ko'rib chiqish hamda tekshirish. Sahifa tahdidlarni ehtimollik va ta'sir ko'paytmasi bo'yicha tartiblashni ham tilga oladi va buning o'zi qiyin bo'lishi mumkinligini aytadi; shuningdek tekshirish bosqichida modelni faqat dasturchilar emas, hamma manfaatdor tomonlar ko'rib chiqishi kerakligini yozadi. Cheat sheet qabul qilingan javoblarni NIST SP 800-218 ning PW.1.2 amaliyotiga havola bilan yangilab turishni tavsiya qiladi. Amalda yetti qadamga ajratish qulay (bu kursning ishchi tartibi):

1. Chegarani belgilang: modelga nima kiradi, nima kirmaydi.
2. Aktivlarni yozing: nimani himoya qilamiz.
3. DFD chizing va trust boundary'larni qo'ying.
4. Har element va chegaradan o'tuvchi oqim uchun STRIDE savollarini bering (4-dars).
5. Tahdidlarni ehtimollik va ta'sir bo'yicha baholang (1-dars risk register).
6. Har tahdid uchun qaror yozing: kamaytirish (mitigate), olib tashlash (eliminate), o'tkazish (transfer) yoki qabul qilish (accept).
7. Nazoratlarni backlog'ga qo'ying va ularni tekshirish yo'lini belgilang. Tekshirish uchun ASVS (8-dars) kabi talablar to'plami yordam beradi.

### Avtopark platformasi modeli

Modelga kiritiladigan tizim: GPS va yoqilg'i datchigi qurilmalari, ingest gateway, xabar navbati, API servisi, PostgreSQL, tenant foydalanuvchilari uchun web ilova, administratorlar paneli va uchinchi tomon yoqilg'i provayderi webhook'i.

Aktivlar va ularga tegishli xususiyat:

| Aktiv | Asosiy xususiyat | Nima uchun muhim |
|---|---|---|
| Mashina joylashuvi tarixi | Maxfiylik | Tenant'lar raqobatchi, haydovchi shaxsiy ma'lumotiga tegadi |
| Yoqilg'i va telemetriya qiymatlari | Yaxlitlik | Hisobot, signal va to'lov shu qiymatga tayanadi |
| Servisning ishlashi | Mavjudlik | Mijoz real vaqtda monitoring qiladi |
| Qurilma kalitlari va API sirlari | Maxfiylik | Egallansa soxta ma'lumot yuborish mumkin |
| Audit log | Yaxlitlik | Hodisani tekshirish shunga tayanadi |

Trust boundary'lar: (a) internet va ingest gateway (qurilmalar), (b) internet va API (brauzer), (c) tenant va tenant (ma'lumot ichida), (d) uchinchi tomon va API (webhook), (e) ilova va ma'lumotlar bazasi. Beshta chegara - beshta joy, bu yerda "kim yubordi va nima ruxsat etilgan" savoli beriladi.

## Chuqurroq: ro'yxatdan qarorgacha

### Tahdidlar ro'yxati va ustuvorlik

STRIDE ro'yxati har chegara oqimi uchun tahdid beradi. Quyidagi kod kichik qismini ma'lumot sifatida saqlaydi va 1-darsdagi ehtimollik va ta'sir bahosi bilan tartiblaydi. Ballar bu darsning misoli: real loyihada ularni jamoa baholaydi.

```ts run
type Threat = { id: string; boundary: string; stride: string; text: string; likelihood: number; impact: number; decision: string };

const threats: Threat[] = [
  { id: "T1", boundary: "qurilma -> ingest", stride: "S", text: "Boshqa qurilma nomidan telemetriya yuborish", likelihood: 4, impact: 4, decision: "kamaytirish: qurilma kaliti bilan HMAC" },
  { id: "T2", boundary: "qurilma -> ingest", stride: "T", text: "Yoqilg'i qiymatini yo'lda o'zgartirish", likelihood: 3, impact: 4, decision: "kamaytirish: imzo qiymatni qamraydi" },
  { id: "T3", boundary: "qurilma -> ingest", stride: "R", text: "Eski xabarni qayta yuborish (replay)", likelihood: 3, impact: 3, decision: "kamaytirish: tartib raqami" },
  { id: "T4", boundary: "brauzer -> API", stride: "I", text: "Boshqa tenant mashinasini ko'rish", likelihood: 3, impact: 5, decision: "kamaytirish: tenant sessiondan, RLS" },
  { id: "T5", boundary: "webhook -> API", stride: "S", text: "Soxta provayder webhook'i", likelihood: 3, impact: 3, decision: "kamaytirish: imzo tekshiruvi (75-dars)" },
  { id: "T6", boundary: "brauzer -> API", stride: "D", text: "Og'ir eksport so'rovlari bilan bazani band qilish", likelihood: 4, impact: 3, decision: "kamaytirish: limit va navbat" },
  { id: "T7", boundary: "admin panel", stride: "E", text: "Oddiy foydalanuvchi admin funksiyani chaqiradi", likelihood: 2, impact: 5, decision: "kamaytirish: funksiya darajasida avtorizatsiya" },
  { id: "T8", boundary: "operator -> baza", stride: "R", text: "Operator o'chirgan yozuvni inkor qiladi", likelihood: 2, impact: 3, decision: "kamaytirish: audit log" },
];

const ranked = threats
  .map((t) => ({ ...t, score: t.likelihood * t.impact }))
  .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

for (const t of ranked) console.log(`${String(t.score).padStart(2)} ${t.id} [${t.stride}] ${t.boundary.padEnd(18)} ${t.text}`);
const byStride: Record<string, number> = {};
for (const t of threats) byStride[t.stride] = (byStride[t.stride] ?? 0) + 1;
console.log("STRIDE bo'yicha:", JSON.stringify(byStride));
```

```text
16 T1 [S] qurilma -> ingest  Boshqa qurilma nomidan telemetriya yuborish
15 T4 [I] brauzer -> API     Boshqa tenant mashinasini ko'rish
12 T2 [T] qurilma -> ingest  Yoqilg'i qiymatini yo'lda o'zgartirish
12 T6 [D] brauzer -> API     Og'ir eksport so'rovlari bilan bazani band qilish
10 T7 [E] admin panel        Oddiy foydalanuvchi admin funksiyani chaqiradi
 9 T3 [R] qurilma -> ingest  Eski xabarni qayta yuborish (replay)
 9 T5 [S] webhook -> API     Soxta provayder webhook'i
 6 T8 [R] operator -> baza   Operator o'chirgan yozuvni inkor qiladi
STRIDE bo'yicha: {"S":2,"T":1,"R":2,"I":1,"D":1,"E":1}
```

Ro'yxatdan ikki xulosa chiqadi. Birinchisi, sakkiz tahdiddan uchtasi (T1, T2, T3) bitta chegarada, qurilmadan ingest kanalida, va eng yuqori ball ham shu yerda (T1). Tenant ma'lumoti sizishi (T4) deyarli shu darajada. Demak, birinchi sprint ikki joyga qaratiladi: ingest chegarasi va tenant izolyatsiyasi. Ikkinchisi, "R" (T3) bu yerda replay uchun ishlatildi: replay klassik STRIDE'da aniq bitta kategoriyaga tushmaydi (u spoofing yoki tampering sifatida ham sanalishi mumkin). Bu model qo'llanuvchining tanlovi va uni izchil ishlatish muhim.

### Qaror va tekshirish

Jadvalning oxirgi ustuni - qaror. "Qabul qilish" ham qaror, lekin kim, qachon va nima uchun qabul qilgani yozilishi kerak (masalan, "T8 hozircha qabul qilindi, audit log 79-darsdagi rejaga kiradi"). Nazorat qo'shilgach, uni tekshirish yo'li ham belgilanadi: test, kod ko'rib chiqish yoki ASVS talabiga moslik. "Ishimiz yetarlimi?" savoli ro'yxatning oxirida emas, har tuzatishdan keyin beriladi: tuzatish aynan shu tahdidni qoplaydimi va qanday yangi tahdid yaratdi.

### Replay himoyasining dizayn savollari

Tartib raqami oddiy ko'rinadi, lekin dizayn qarorlari talab qiladi. Birinchisi, raqam imzoga kiradi: aks holda hujumchi eski xabarning raqamini oshirib yuboradi va imzo hamon to'g'ri bo'ladi (mashqdagi `forged` xabar shu holat). Ikkinchisi, holat faqat imzo tekshirilgandan keyin yangilanadi, aks holda noto'g'ri imzoli xabar katta raqam bilan haqiqiy qurilmani o'chirib qo'yadi, ya'ni himoya o'zi DoS vektoriga aylanadi. Uchinchisi, qat'iy o'sish (`seq` oldingisidan katta) sodda, lekin xabarlar navbat yoki tarmoq tufayli tartibsiz kelsa, haqiqiy xabarlar ham rad etiladi. Bunday kanalda kichik "oyna" (masalan, ko'rilgan raqamlar to'plami) yoki xabar vaqti bilan birga tekshirish ishlatiladi, lekin har variant holat va murakkablik qo'shadi: ingest kanalingiz tartib kafolati berishini oldin aniqlang. To'rtinchisi, qurilma qayta ishga tushganda hisoblagich nolga qaytsa, hamma yangi xabar replay deb rad etiladi; hisoblagich doimiy xotirada saqlanishi yoki sessiya boshida yangi qiymat kelishilishi kerak. Beshinchisi, taqqoslash: Node hujjatiga ko'ra `crypto.timingSafeEqual` konstant-vaqtli algoritm bilan baytlarni solishtiradi, HMAC digest'larni solishtirish uchun mos, lekin ikkala qiymat bir xil uzunlikda bo'lishi shart, aks holda xato tashlaydi. Shuning uchun Fastify parchasida uzunlik oldin tekshiriladi va uzunligi boshqacha imzo xato emas, rad etish bo'ladi.

Bu qarorlarning hech biri STRIDE jadvalida yozilmaydi: ular tahdid "replay" deb nomlangandan keyin kelib chiqadigan muhandislik tafsilotlari. Model tahdidni topadi, tafsilotlarni esa nazoratni loyihalash va testlash bosqichi hal qiladi. Mashqdagi to'rt chiqish (`true, false, false, true`) aynan shu qarorlarning eng kichik tekshiruvi: haqiqiy xabar, replay, soxtalashtirilgan xabar va undan keyingi haqiqiy xabar.

### Model bilan ishlash tartibi

Modelni bitta odam yolg'iz yozsa, u shu odamning bilgan tahdidlari bilan cheklanadi. Seansga kamida uchta rol taklif qiling: tizimni biladigan dasturchi, infratuzilmani biladigan odam va mahsulot egasi (aktivlarning biznes qiymatini u biladi). Dasturchi "bu yerda tekshiruv bor" deganda, uni diagrammadagi aniq oqim va aniq kod joyi bilan tasdiqlang: "bor" degan fikr tekshiruv emas. Seans oxirida har tahdidning egasi (kim tuzatadi) va muddati yozilsin; egasiz tahdid backlog'da yo'qoladi.

Model hujjati kod ombori ichida, matn va diagramma kodi (masalan Markdown va Mermaid) ko'rinishida saqlansa, uni o'zgarish bilan birga review qilish mumkin. Eslatma: bu amaliy tavsiya, rasmiy talab emas.

Seans oxirida Threat Modeling Cheat Sheet'dagi tekshiruv savollarini o'z modelingizga qo'llang. DFD haqiqiy tizimni aks ettiradimi, ya'ni diagrammada bor navbat va webhook kodda ham bormi? Har tahdid uchun javob kelishilganmi? Kamaytirish tanlangan joylarda qolgan risk qabul qilinadigan darajadami? Kelishilgan nazoratni test bilan sinab ko'rish mumkinmi? Oxirgi savolga "yo'q" javobi odatda nazorat noaniq yozilganini bildiradi: uni qayta yozing.

## Misol: qurilma identifikatoriga ishonadigan ingest

Kod o'quv maqsadida: u faqat shu darsning in-memory modeliga qarshi, real qurilma yoki tarmoq yo'q.

### 1. Zaif kod

```ts run
const devices = new Map([
  ["dev-1", { vehicle: "v1" }],
  ["dev-2", { vehicle: "v2" }],
]);
const fuel = new Map<string, number>([["v1", 60], ["v2", 45]]);

// ZAIF: xabardagi deviceId'ga ishoniladi, imzo yo'q
function ingestWeak(msg: { deviceId: string; fuel: number }): string {
  const d = devices.get(msg.deviceId);
  if (!d) return "noma'lum qurilma";
  fuel.set(d.vehicle, msg.fuel);
  return "qabul qilindi";
}

console.log(ingestWeak({ deviceId: "dev-1", fuel: 59 }));
// Hujum: dev-1 kanalidan dev-2 nomi bilan yozish
console.log(ingestWeak({ deviceId: "dev-2", fuel: 3 }));
console.log("v2 yoqilg'i:", fuel.get("v2"));
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu boshqa qurilma nomidan xabar yuborish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-4-moddasi (Kompyuter axborotini modifikatsiyalashtirish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi qurilma kanaliga xabar yubora oladigan tomon, masalan egallangan yoki soxta qurilma, yoki identifikatorni bilgan oddiy tashqi foydalanuvchi. U boshqa qurilma `deviceId`'sini yozadi. Server hech narsani tekshirmagani uchun yoqilg'i qiymatini qabul qiladi:

```text
qabul qilindi
qabul qilindi
v2 yoqilg'i: 3
```

v2 mashinasining yoqilg'i qiymati 3 ga tushdi. Bu spoofing (boshqa qurilma nomidan) va tampering (qiymat o'zgardi). Yoqilg'i o'g'irlanishi haqida soxta signal chiqadi yoki aksincha, haqiqiy o'g'irlik yashirinadi.

### 3. Tuzatilgan kod

Har qurilmaga alohida kalit beriladi. Xabar `deviceId`, tartib raqami va qiymat ustidan HMAC bilan imzolanadi; server imzoni tekshiradi va tartib raqami oldingisidan katta ekanini talab qiladi.

```ts run
const enc = new TextEncoder();
const keys: Record<string, string> = { "dev-1": "kalit-dev-1-o'quv", "dev-2": "kalit-dev-2-o'quv" };
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (h: string) => new Uint8Array(h.match(/../g)!.map((x) => parseInt(x, 16)));

const importKey = (id: string, usage: KeyUsage[]) =>
  crypto.subtle.importKey("raw", enc.encode(keys[id]), { name: "HMAC", hash: "SHA-256" }, false, usage);
const payload = (id: string, seq: number, fuel: number) => enc.encode(`${id}|${seq}|${fuel}`);

// Qurilma tomoni: imzolash
async function sign(id: string, seq: number, fuel: number): Promise<string> {
  return hex(await crypto.subtle.sign("HMAC", await importKey(id, ["sign"]), payload(id, seq, fuel)));
}

type Msg = { deviceId: string; seq: number; fuel: number; mac: string };
const lastSeq = new Map<string, number>();
const fuel = new Map<string, number>([["v1", 60], ["v2", 45]]);
const vehicleOf: Record<string, string> = { "dev-1": "v1", "dev-2": "v2" };

// Server tomoni: tekshirish (imzoni solishtirishni crypto.subtle.verify o'zi bajaradi)
async function ingest(m: Msg): Promise<string> {
  if (!keys[m.deviceId] || !/^[0-9a-f]{64}$/.test(m.mac)) return "rad: noma'lum qurilma yoki format";
  const ok = await crypto.subtle.verify("HMAC", await importKey(m.deviceId, ["verify"]), unhex(m.mac), payload(m.deviceId, m.seq, m.fuel));
  if (!ok) return "rad: imzo noto'g'ri";
  if (m.seq <= (lastSeq.get(m.deviceId) ?? 0)) return "rad: replay";
  lastSeq.set(m.deviceId, m.seq);
  fuel.set(vehicleOf[m.deviceId], m.fuel);
  return "qabul qilindi";
}

const good: Msg = { deviceId: "dev-2", seq: 1, fuel: 44, mac: await sign("dev-2", 1, 44) };
console.log("haqiqiy:", await ingest(good));
console.log("replay:", await ingest(good));
console.log("dev-1 kaliti bilan dev-2 nomidan:", await ingest({ deviceId: "dev-2", seq: 2, fuel: 3, mac: await sign("dev-1", 2, 3) }));
console.log("qiymat o'zgartirilgan:", await ingest({ ...good, seq: 3, fuel: 3 }));
console.log("v2 yoqilg'i:", fuel.get("v2"));
```

```text
haqiqiy: qabul qilindi
replay: rad: replay
dev-1 kaliti bilan dev-2 nomidan: rad: imzo noto'g'ri
qiymat o'zgartirilgan: rad: imzo noto'g'ri
v2 yoqilg'i: 44
```

Invariant: bazaga faqat shu qurilmaning kaliti bilan imzolangan, oldingisidan yangi xabar tushadi. Bu ko'rsatilgan uch hujumni (boshqa qurilma nomidan yuborish, qiymatni o'zgartirish, replay) yopadi. Yopilmagan qoldiq risk: egallangan qurilma o'z kaliti bilan yolg'on qiymat yuborishi mumkin (imzo manbani isbotlaydi, qiymatning haqiqiyligini emas), kalitlar qurilmadan chiqarib olinsa hujumchi ularni ishlatadi, `lastSeq` xotirada va qayta ishga tushganda yo'qoladi. Birinchi uchun qiymatni mantiqiy tekshirish va anomaliya monitoringi, ikkinchisi uchun kalit saqlashni qurilma apparatida ta'minlash va kalitni almashtirish (68-dars), uchinchisi uchun holatni bazada saqlash kerak. HMAC va kalit boshqaruvi 62 va 68-darslarda chuqurroq.

## Qachon qo'llamaslik kerak

- Hamma tizimni bir seansda modellashga urinmang. Chegarani tor oling (masalan, bitta oqim: qurilmadan ingest) va uni oxiriga yetkazing; keyin keyingisiga o'ting.
- Yuqoridagi ro'yxatdagi kabi ballar yolg'on aniqlik beradi (1-dars). Ularni tartiblash uchun ishlating, "kim to'g'ri" tortishuvi uchun emas.
- Kichik jamoada rasmiy hujjat o'rniga bitta doska, DFD surati va backlog'dagi tikketlar yetishi mumkin. Muhimi, natija kodda nazoratga aylanishi.
- Har qurilma uchun alohida kalit va HMAC hamma qurilma uchun amaliy emas: qurilma resursi cheklangan, kalit taqsimoti qiyin bo'lishi mumkin. Bu holda asimmetrik imzo, sertifikat (66-dars) yoki tarmoq darajasidagi nazorat (mTLS) tanlanadi, va har tanlovning o'z trade-off'i bor.
- Model qurilma ishlab chiqaruvchisining kodiga va apparatiga kirmaydi. Ular sizning nazoratingizdan tashqarida bo'lsa, buni modelda ochiq chegara sifatida yozing va shartnoma yoki kuzatuv bilan qoplang.

## Stack'da: Fastify va PostgreSQL

Ingest gateway Node.js'da Fastify bilan yozilishi mumkin. Imzo tekshiruvi so'rov qayta ishlanishining boshida (hook yoki handler boshida) bajariladi, va u xom so'rov tanasidan hisoblangan imzoga tayanadi, ya'ni JSON qayta serializatsiya qilinmaydi. Quyidagi kod ishga tushirilmaydi (Fastify va Node `crypto` brauzer worker'ida yo'q) va faqat sintaksis jihatidan to'g'ri:

```ts
import Fastify from "fastify";
import { createHmac, timingSafeEqual } from "node:crypto";

const app = Fastify();
const deviceKeys = new Map<string, Buffer>(); // real tizimda KMS yoki secrets manager'dan

app.addContentTypeParser("application/json", { parseAs: "string" }, (_req, body, done) => done(null, body));

app.post("/ingest", async (req, reply) => {
  const raw = req.body as string;
  const deviceId = String(req.headers["x-device-id"] ?? "");
  const mac = Buffer.from(String(req.headers["x-signature"] ?? ""), "hex");
  const key = deviceKeys.get(deviceId);
  if (!key) return reply.code(401).send();

  const expected = createHmac("sha256", key).update(raw).digest();
  if (mac.length !== expected.length || !timingSafeEqual(mac, expected)) return reply.code(401).send();

  // seq bazadagi oxirgisidan katta bo'lishi tranzaksiya ichida tekshiriladi: UPDATE ... WHERE last_seq < $1
  return reply.code(202).send();
});
```

`last_seq` ni bazada saqlash replay himoyasini qayta ishga tushishdan omon qoldiradi. `UPDATE devices SET last_seq = $1 WHERE id = $2 AND last_seq < $1` kabi shartli yangilash bir vaqtda kelgan ikki xabardan faqat bittasini o'tkazadi (60-darsdagi race condition mavzusiga yaqin). Qurilma kalitlari kodda emas, secrets manager yoki KMS'da turishi kerak (68 va 69-darslar).

## Xulosa

- Amaliy threat modeling: chegara, aktivlar, DFD, STRIDE, baholash, qaror, nazorat va tekshirish. Natija backlog'ga tushmasa, model foydasiz.
- Avtopark platformasida eng ishonchsiz chegaralar: qurilma kanali, brauzer, tenant'lar o'rtasi va uchinchi tomon webhook'i.
- Tahdidlar ro'yxati ustuvorlik bilan yuritiladi; har tahdid uchun qaror (kamaytirish, olib tashlash, o'tkazish, qabul qilish) yoziladi.
- Qurilma identifikatoriga ishonish spoofing va tampering'ga olib keladi; HMAC va tartib raqami ularni va replay'ni yopadi, lekin egallangan kalitni emas.
- Imzo manbani isbotlaydi, qiymatning haqiqiyligini emas; qoldiq riskni yozib qo'ying va monitoring bilan qoplang.
