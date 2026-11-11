---
n: 75
slug: webhooklar
title: "Webhook'lar: imzo, replay va idempotency"
summary: "Webhook qabul qiluvchi endpoint'ning uchta vazifasi: jo'natuvchini imzo bilan tasdiqlash (xom tana ustida HMAC), replay'ni vaqt oynasi bilan cheklash va takroriy yetkazib berishni idempotent qayta ishlash. Doimiy vaqtli taqqoslash, unique constraint va qoldiq risklar."
duration: 40
sources:
  - id: api-top10
    note: "API10:2023 Unsafe Consumption of APIs: dasturchilar integratsiya qilingan API'larga ishonib, transport xavfsizligi, autentifikatsiya va kirishni tekshirish talablarini yumshatadi; 'How To Prevent': integratsiyadan kelgan ma'lumotni ishlatishdan oldin tekshirish, TLS, redirect'lar uchun allowlist. API4:2023: bir operatsiyani takrorlash chegarasi"
  - id: t10-a08
    note: "A08:2025 Software or Data Integrity Failures: kategoriya ishonch chegarasini saqlamaslik va dasturiy ta'minot, kod va ma'lumot artefaktlari yaxlitligini tekshirmaslikka qaratilgan; muhim ma'lumot haqida tekshirmasdan taxmin qilish"
  - id: cs-input
    note: "Input Validation Cheat Sheet: tashqaridan kelgan har qanday ma'lumot, imzo tekshiruvidan keyin ham, tur, diapazon va tuzilma bo'yicha tekshiriladi; validatsiya avtorizatsiyani almashtirmaydi"
  - id: nestjs-webhooks
    note: "NestJS Webhooks va Raw body sahifalari: qabul tomondagi tipik xatolar (imzo qayta serializatsiya qilingan tana ustida tekshiriladi, `===` bilan taqqoslanadi, vaqt oynasi yo'q, qayta yetkazilgan event handler'ni ikki marta ishga tushiradi); imzo xom baytlar ustida, taqqoslash doimiy vaqtda, imzolangan vaqt belgisi 5 daqiqa oynasida (Standard Webhooks sxemasi: webhook-id, webhook-timestamp, webhook-signature; HMAC-SHA256 id.timestamp.body ustida); sirni rotatsiya paytida ikkitasini birga qabul qilish"
quiz:
  - q: "Webhook handler `req.body` (parse qilingan JSON) ni qayta `JSON.stringify` qilib, uning ustida HMAC hisoblaydi va header bilan solishtiradi. Qaysi muammo bor?"
    options:
      - "Muammo yo'q, JSON serializatsiya har doim bir xil"
      - "HMAC faqat Base64 bilan ishlaydi"
      - "Imzo hisoblash sekin"
      - "Qayta serializatsiya baytlarni o'zgartirishi mumkin (bo'sh joy, kalitlar tartibi, sonlar); imzo jo'natuvchi yuborgan xom tana ustida tekshirilishi kerak"
    answer: 3
    explain: "Imzo aniq baytlar uchun hisoblangan. Parse va qayta serializatsiya baytlarni boshqacha qilishi mumkin: imzo yaroqli xabarni rad etadi yoki, yomoni, boshqa talqin qilinadigan tanani qabul qiladi. Xom tanani saqlab, avval imzoni tekshirib, keyin parse qiling."
  - q: "HMAC imzosi to'g'ri, lekin xabarda vaqt belgisi yo'q. Hujumchi tarmoqdan yoki logdan yaroqli xabarni nusxalab, bir hafta keyin qayta yubordi. Nima bo'ladi?"
    options:
      - "Rad etiladi, chunki imzo eskirgan"
      - "Qabul qilinadi: imzo hamon to'g'ri, replay'dan faqat vaqt belgisi va idempotency himoya qiladi"
      - "Qabul qilinmaydi, chunki HMAC bir marta ishlatiladi"
      - "Faqat HTTPS bo'lmasa qabul qilinadi"
    answer: 1
    explain: "HMAC yaxlitlikni va jo'natuvchini tasdiqlaydi, lekin xabar qachon yuborilganini emas. Vaqt belgisi imzoga kiritilib, qabul oynasi bilan tekshirilsa, eski xabar rad etiladi; event ID bo'yicha idempotency esa oyna ichidagi takrorni to'xtatadi."
  - q: "Webhook imzosini `computed === received` bilan taqqoslash nima uchun tavsiya etilmaydi?"
    options:
      - "Satr taqqoslash JavaScript'da ishlamaydi"
      - "Hex satr katta-kichik harfga sezgir"
      - "Oddiy taqqoslash birinchi farqli belgida to'xtashi mumkin va javob vaqti imzo haqida ma'lumot sizdirishi (timing side channel); doimiy vaqtli taqqoslash yoki `crypto.subtle.verify` ishlatiladi"
      - "Bu to'g'ri usul"
    answer: 2
    explain: "Taqqoslash qancha belgi mos kelgani vaqtga ta'sir qilsa, hujumchi vaqtni o'lchab imzoni belgilab-belgilab topishga urinishi mumkin. Doimiy vaqtli taqqoslash buni yopadi. Ushbu darsdagi kodda `crypto.subtle.verify` ishlatilgan."
  - q: "Provayder xuddi shu event'ni ikki marta yubordi (birinchi javob timeout bo'ldi). Handler ikkala marta ham hisobga 1000 qo'shdi. To'g'ri tuzatish qaysi?"
    options:
      - "Provayderdan qayta yubormaslikni so'rash"
      - "Event ID ni yozib, yozuv va biznes effektini bitta tranzaksiyada, ID ustida unique constraint bilan bajarish"
      - "Faqat xotiradagi Set'da ID saqlash"
      - "Har event'dan keyin 5 soniya kutish"
    answer: 1
    explain: "Yetkazib berish odatda 'kamida bir marta' (at-least-once) bo'ladi, takror normal holat. Unique constraint va effektni bir tranzaksiyaga qo'yish ko'p instance va qayta ishga tushishlarda ham to'g'ri ishlaydi; xotiradagi Set restart'da yo'qoladi."
  - q: "Quyidagi qaysi qaror webhook endpoint'i uchun eng mos?"
    options:
      - "Imzo to'g'ri bo'lsa, tananing maydonlarini tekshirmasdan ishlatish"
      - "Imzoni tekshirib, tezda 2xx qaytarib, og'ir ishni navbatga qo'yish; tananing turi va maydonlarini sxema bilan tekshirish"
      - "Imzoni keyinroq, navbatdagi ishchi tekshirsin"
      - "Barcha webhook'larni IP allowlist bilan almashtirish"
    answer: 1
    explain: "Imzo manbani tasdiqlaydi, lekin tana tuzilmasi noto'g'ri bo'lishi mumkin (provayder xatosi, versiya o'zgarishi); sxema tekshiruvi kerak (72-dars). Imzoni navbatdan oldin tekshirish soxta xabar navbatni to'ldirishini oldini oladi. IP allowlist qo'shimcha qatlam, imzo o'rnini bosmaydi."
  - q: "Imzo kaliti (secret) kod repozitoriyasiga commit qilingan va bir yildan beri o'zgarmagan. Bu qaysi xavfni oshiradi va nima qilinadi?"
    options:
      - "Sirni bilgan har kim to'g'ri imzolangan soxta xabar yasay oladi; sirni secrets manager'ga ko'chirish, aylantirish (rotatsiya) va rotatsiya vaqtida eski va yangi kalitni vaqtincha birga qabul qilish kerak"
      - "Hech narsa: imzo kaliti ommaviy"
      - "Faqat log hajmi oshadi"
      - "Faqat HTTPS buziladi"
    answer: 0
    explain: "HMAC simmetrik: sirni bilgan jo'natuvchi ham, soxta jo'natuvchi ham bir xil imzo yasaydi. Sirni repozitoriyda saqlash va hech qachon almashtirmaslik risk. Rotatsiya paytida downtime bo'lmasligi uchun ikkala kalitni qisqa muddat qabul qilish odatiy usul (69-dars)."
task:
  title: "Webhook xabarini qayta ishlash tartibi"
  prompt: |
    `handle(msg, now)` webhook qabul qiladi. Imzo tekshiruvi allaqachon yozilgan (`verified` maydoni). Lekin handler replay va takroriy yetkazishdan himoyasiz.

    Qoidalar:
    1. `verified === false` bo'lsa `"rad: imzo"`.
    2. `Math.abs(now - msg.ts) > 300` bo'lsa `"rad: vaqt"`. Imzo tekshiruvidan keyin.
    3. Event ID avval ko'rilgan bo'lsa `"takror"` va hisob o'zgarmasin.
    4. Aks holda `credited` ga `amount` qo'shib, ID ni eslab `"qabul"` qaytaring.
    5. `amount` musbat butun son bo'lmasa `"rad: tana"`, ID eslab qolinmasin.

    Kutilgan chiqish: yettita natija va oxirida `credited = 1500`.
  lang: ts
  starter: |
    type Msg = { id: string; ts: number; amount: number; verified: boolean };

    let credited = 0;
    const seen = new Set<string>();

    function handle(msg: Msg, now: number): string {
      if (!msg.verified) return "rad: imzo";
      credited += msg.amount;
      return "qabul";
    }

    const now = 1700000000;
    console.log(handle({ id: "e1", ts: now - 10, amount: 1000, verified: true }, now));
    console.log(handle({ id: "e1", ts: now - 10, amount: 1000, verified: true }, now));
    console.log(handle({ id: "e2", ts: now - 4000, amount: 999, verified: true }, now));
    console.log(handle({ id: "e3", ts: now, amount: 1000, verified: false }, now));
    console.log(handle({ id: "e4", ts: now, amount: -50, verified: true }, now));
    console.log(handle({ id: "e5", ts: now + 100, amount: 500, verified: true }, now));
    console.log(handle({ id: "e6", ts: now + 9000, amount: 500, verified: true }, now));
    console.log("credited =", credited);
  solution: |
    type Msg = { id: string; ts: number; amount: number; verified: boolean };

    let credited = 0;
    const seen = new Set<string>();

    function handle(msg: Msg, now: number): string {
      if (!msg.verified) return "rad: imzo";
      if (Math.abs(now - msg.ts) > 300) return "rad: vaqt";
      if (!Number.isInteger(msg.amount) || msg.amount <= 0) return "rad: tana";
      if (seen.has(msg.id)) return "takror";
      seen.add(msg.id);
      credited += msg.amount;
      return "qabul";
    }

    const now = 1700000000;
    console.log(handle({ id: "e1", ts: now - 10, amount: 1000, verified: true }, now));
    console.log(handle({ id: "e1", ts: now - 10, amount: 1000, verified: true }, now));
    console.log(handle({ id: "e2", ts: now - 4000, amount: 999, verified: true }, now));
    console.log(handle({ id: "e3", ts: now, amount: 1000, verified: false }, now));
    console.log(handle({ id: "e4", ts: now, amount: -50, verified: true }, now));
    console.log(handle({ id: "e5", ts: now + 100, amount: 500, verified: true }, now));
    console.log(handle({ id: "e6", ts: now + 9000, amount: 500, verified: true }, now));
    console.log("credited =", credited);
  solutionNotes: |
    - Tartib muhim: avval imzo (arzon va xavfsizlik darvozasi), keyin vaqt oynasi, keyin tana tekshiruvi, eng oxirida idempotency va effekt. Tana yaroqsiz bo'lsa ID eslab qolinmaydi, aks holda provayder tuzatilgan xabarni qayta yuborganda u "takror" deb rad etiladi.
    - `Math.abs` kelajakdagi vaqt belgisini ham rad etadi (soat siljishiga bag'ishlangan kichik tolerantlik bilan). 300 soniya bu darsning tanlovi; real qiymat provayder hujjatidan va soat sinxronizatsiyasidan olinadi.
    - Xotiradagi `Set` faqat o'quv modeli. Production'da event ID ustida unique constraint va effekt bitta tranzaksiyada bo'ladi, aks holda restart yoki ikkinchi instance takrorni o'tkazib yuboradi.
    - Bu funksiya imzoning o'zini tekshirmaydi; `verified` oldindan hisoblangan deb faraz qilingan.
    - Idempotency ayni event'ning takrorini yopadi. Boshqa ID bilan, lekin bir xil mazmundagi ikkinchi event'ni (provayder xatosi) biznes mantiq darajasida hal qilish kerak.
  checklist:
    - "Natijalar tartibi: qabul, takror, rad: vaqt, rad: imzo, rad: tana, qabul, rad: vaqt"
    - "`credited` oxirida 1500"
    - "Yaroqsiz tanali event ID eslab qolinmaydi"
    - "Imzo tekshiruvi vaqt va tana tekshiruvidan oldin"
    - "Xotiradagi Set production uchun yetarli emasligini tushuntira olasiz"
---

## Muammo

Webhook teskari yo'nalishdagi API: sizning servisingiz emas, tashqi tizim (to'lov provayderi, SMS shlyuzi, GPS qurilma platformasi) sizning endpoint'ingizga so'rov yuboradi. Endpoint internetga ochiq, autentifikatsiya sessiyasi yo'q, chaqiruvchi esa brauzer emas. Shuning uchun uni ishlab chiquvchilar ko'pincha oddiy `POST /webhooks/payments` qilib qo'yishadi va `req.body.type === "payment.succeeded"` bo'lsa buyurtmani to'langan deb belgilashadi.

Bu yerda uchta alohida muammo bor va ular uchta alohida mexanizm bilan hal bo'ladi:

1. **Soxtalashtirish.** Endpoint manzilini bilgan istalgan odam "to'lov o'tdi" deb POST yuborishi mumkin. Jo'natuvchini tasdiqlash kerak.
2. **Replay.** Haqiqiy xabarni nusxalab (log, proxy, buzilgan integratsiya), keyin qayta yuborish mumkin. Imzo to'g'ri bo'ladi, lekin xabar eskirgan.
3. **Takroriy yetkazish.** Provayderning o'zi ham xabarni qayta yuboradi, agar sizning javobingiz timeout bo'lsa yoki 5xx qaytarsa. Bu hujum emas, normal ish tartibi, lekin biznes effektini ikki marta bajarsangiz (ikki marta pul qo'shish) zarar hujum bilan bir xil.

OWASP API Security Top 10 (2023) ning API10 kategoriyasi shu muammoning umumiy tomonini nomlaydi: dasturchilar integratsiya qilingan API'larga ishonib, ularning ma'lumotiga nisbatan transport xavfsizligi, autentifikatsiya va kirishni tekshirish kabi talablarni yumshatadi. OWASP Top 10:2025 dagi A08 esa shu ishonch chegarasini va ma'lumot artefaktlari yaxlitligini tekshirmasdan taxmin qilishni asosiy sabab sifatida ko'rsatadi. Webhook ikkalasiga ham klassik misol.

Muhim ogohlantirish: har provayder o'z imzo sxemasini (header nomi, imzolanadigan matn, vaqt belgisi formati) belgilaydi. Bu darsda aniq provayder sxemasi tekshirilmagan; biz umumiy mexanizmni ko'rsatamiz. Real provayderga ulanganda uning rasmiy hujjatiga amal qiling.

## Asosiy g'oya

### Imzo: xom tana ustida HMAC

Eng keng tarqalgan sxema: jo'natuvchi va qabul qiluvchi umumiy sirga ega; jo'natuvchi har xabar uchun `HMAC-SHA256(secret, imzolanadigan matn)` hisoblab header'da yuboradi; qabul qiluvchi o'zi qayta hisoblab solishtiradi. Hash va HMAC mexanizmi 62-darsda ko'rilgan. Bu yerda xavfsizlikka ta'sir qiluvchi to'rt nozik joy bor.

**Xom tana.** Imzo jo'natuvchi yuborgan aniq baytlar uchun hisoblangan. Handler tanani JSON'ga parse qilib, keyin qayta `JSON.stringify` qilsa, baytlar o'zgarishi mumkin (bo'sh joy, kalitlar tartibi, katta sonlar, Unicode escape). Natija ikki xil: yaroqli xabar rad etiladi, yoki yomoni, imzo bir narsaga, kod esa boshqa talqinga ishlaydi. Qoida: xom tanani (Buffer yoki satr) saqlang, imzoni shu ustida tekshiring va faqat keyin parse qiling. NestJS va Express'da bu odatda raw body'ni yoqishni talab qiladi, chunki global JSON parser tanani allaqachon o'qib bo'lgan bo'ladi.

**Imzolanadigan matn.** Faqat tana emas, vaqt belgisini ham imzoga kiritish kerak (`${ts}.${rawBody}`). Aks holda hujumchi eski imzoni yangi vaqt belgisi bilan yuborishi mumkin.

**Doimiy vaqtli taqqoslash.** `computed === received` ni ishlatsangiz, taqqoslash birinchi farqli belgida to'xtashi mumkin va javob vaqti imzo haqida ma'lumot sizdirishi (timing side channel) ehtimoli bor. Node'da `crypto.timingSafeEqual`, WebCrypto'da `subtle.verify` kabi doimiy vaqtli amallar mavjud. Taqqoslashdan oldin uzunlik va formatni tekshiring.

**Sir.** HMAC simmetrik: sirni bilgan har kim to'g'ri imzo yasaydi. Sir repozitoriyga tushmasligi, muhit sozlamasi yoki secrets manager'da saqlanishi va vaqti-vaqti bilan aylantirilishi kerak (69-dars). Rotatsiya paytida eski va yangi kalit qisqa muddat birga qabul qilinadi.

### Replay: vaqt oynasi

Imzoga kiritilgan vaqt belgisi qabul oynasi bilan tekshiriladi: `|now - ts| <= tolerance`. Oyna kichik bo'lsa (bir necha daqiqa), eski xabarni qayta yuborish ishlamaydi; kattaroq bo'lsa, soat siljishi va tarmoq kechikishiga bardoshli. Aniq qiymat tizimingiz talabiga bog'liq (bu darsda 300 soniya o'quv tanlovi). Eng muhimi, vaqt belgisi imzo ichida bo'lishi shart; imzosiz vaqt belgisi hujumchi uchun o'zgartiriladigan maydon.

Vaqt oynasi replay'ni to'liq yopmaydi: oyna ichida takror yuborilgan xabar o'tadi. Uni idempotency yopadi.

### Idempotency: takror normal holat

Provayderlar odatda "kamida bir marta" (at-least-once) yetkazib berishni kafolatlaydi: xabar yo'qolmaydi, lekin ikki marta kelishi mumkin. Shuning uchun handler idempotent bo'lishi kerak: bir xil event'ni necha marta olmasin, effekt bir marta. Mexanizm: har event'ning identifikatori (provayder beradi) jadvalga yoziladi, ustida unique constraint turadi, effekt va yozuv bitta tranzaksiyada bajariladi. "Avval SELECT bilan tekshir, keyin INSERT" race condition beradi: ikki parallel so'rov ikkalasi "yo'q" deb o'qib, ikkalasi effektni bajaradi (60-dars). Unique constraint buni ma'lumotlar bazasi darajasida hal qiladi.

## Chuqurroq: ishonch chegarasi va tananing o'zi

### Imzodan keyin ham kirish ma'lumoti

Imzo xabar jo'natuvchidan kelganini tasdiqlaydi, ichidagi ma'lumot to'g'riligini emas. Provayder xato yuborishi, yangi versiyada maydonni o'zgartirishi, yoki ba'zi maydonlar (masalan, foydalanuvchi kiritgan izoh) hujumchi nazoratida bo'lishi mumkin. Shuning uchun tana sxema bilan tekshiriladi (72-dars): `amount` musbat butun, `currency` ruxsat etilgan to'plamdan, `invoiceId` formatga mos. Input Validation Cheat Sheet'dagi tamoyil shu: tashqi ma'lumot ishlatishdan oldin tur, diapazon va tuzilma bo'yicha tekshiriladi va validatsiya avtorizatsiyani almashtirmaydi. Webhook holida bu ikki narsani anglatadi: `invoiceId` shu tenant'ga tegishliligi (agar tegishli bo'lishi kerak bo'lsa) va holat o'tishining mantiqiyligi (allaqachon to'langan hisob yana to'lanmaydi, 59-dars).

### Javob va navbat

Handler imzoni tekshirib, tanani sxema bilan tasdiqlab, effektni bajaradi yoki navbatga qo'yadi, so'ng tez 2xx qaytaradi. Og'ir ishni (hisob-kitob, tashqi API chaqiruvi) sinxron bajarish timeout va provayder qayta urinishlariga olib keladi. Imzoni navbatdan oldin tekshiring: aks holda soxta xabarlar navbatni to'ldiradi (resurs hujumi, 73-dars). Imzo xatosiga javob oddiy 401 yoki 400 bo'lsin, sababni batafsil bermang.

### Manba IP va qo'shimcha qatlamlar

Ba'zi provayderlar o'z IP diapazonlarini e'lon qiladi; ularni allowlist qilish qo'shimcha qatlam. Lekin diapazonlar o'zgaradi va proxy ortida IP aniqlash xatoga moyil (73-dars), shuning uchun IP allowlist imzo o'rnini bosmaydi. Mutual TLS (66-dars) ham yana bir kuchli qatlam, agar provayder qo'llasa.

### Chiquvchi webhook'lar

Sizning platformangiz mijozlarga webhook yuborsa (masalan, "mashina geofence'dan chiqdi"), vazifalar teskari: imzolang, vaqt belgisini qo'shing, event ID bering va qayta urinishlarni eksponensial kechikish bilan qiling. Mijoz manzilini kiritganda SSRF xavfi paydo bo'ladi: server mijoz bergan URL'ga so'rov yuboradi (27-dars), shuning uchun manzil allowlist/yo'nalish qoidalari bilan tekshiriladi va redirect'larga ergashilmaydi.

## Misol: to'lov webhook'i

O'quv modelida invoice va to'lov provayderi bor; "provayder" bizning kodimizning o'zi, tarmoq yo'q. Imzo uchun WebCrypto HMAC ishlatiladi (brauzer worker'ida ham, lokal Node'da ham ishlaydi).

### 1. Zaif kod

```ts run
type Invoice = { id: string; status: "open" | "paid"; creditedCents: number };
const invoices = new Map<string, Invoice>([["inv_1", { id: "inv_1", status: "open", creditedCents: 0 }]]);

// ZAIF: tana provayderdan kelganiga ishoniladi, imzo ham, takror tekshiruvi ham yo'q
function handleWeak(rawBody: string) {
  const ev = JSON.parse(rawBody) as { id: string; type: string; invoiceId: string; amountCents: number };
  if (ev.type === "payment.succeeded") {
    const inv = invoices.get(ev.invoiceId)!;
    inv.status = "paid";
    inv.creditedCents += ev.amountCents;
  }
}

const forged = JSON.stringify({ id: "evt_999", type: "payment.succeeded", invoiceId: "inv_1", amountCents: 500000 });
handleWeak(forged);
console.log("1) soxta voqeadan keyin:", JSON.stringify(invoices.get("inv_1")));

invoices.set("inv_1", { id: "inv_1", status: "open", creditedCents: 0 });
const real = JSON.stringify({ id: "evt_1", type: "payment.succeeded", invoiceId: "inv_1", amountCents: 1000 });
handleWeak(real);
handleWeak(real); // provayder qayta yubordi
console.log("2) bir xil voqea ikki marta:", invoices.get("inv_1")!.creditedCents);
```

### 2. Hujum

Birinchi hujumchi hech qanday sir bilmaydi: endpoint manzilini bilib, soxta "to'lov o'tdi" tanasini yuboradi. Ikkinchi holat hujum emas: provayder xabarni ikki marta yuboradi (masalan, birinchi javob timeout bo'ldi). Natija:

```text
1) soxta voqeadan keyin: {"id":"inv_1","status":"paid","creditedCents":500000}
2) bir xil voqea ikki marta: 2000
```

Soxta xabar hisobni "paid" qildi va 500000 tiyin yozdi. Haqiqiy xabarni takror yuborish esa hisobga 2000 yozdi, kerakli 1000 emas. Ikkalasi ham bitta sababdan: endpoint tanani va uning bir marta ishlanganini tekshirmaydi.

### 3. Tuzatilgan kod

Imzo xom tana va vaqt belgisi ustida, vaqt oynasi, so'ng tana turlari va idempotency. Idempotency Set'da (o'quv modeli; production'da unique constraint).

```ts run
const enc = new TextEncoder();
const SECRET = "whsec_demo_only"; // faqat o'quv; real sir kodda saqlanmaydi
const TOLERANCE_SEC = 300;

const toHex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
function fromHex(h: string): Uint8Array | null {
  return /^([0-9a-f]{2})+$/.test(h) ? new Uint8Array(h.match(/../g)!.map((x) => parseInt(x, 16))) : null;
}
const hmacKey = () => crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

// jo'natuvchi tomoni (o'quv uchun): imzo = HMAC(secret, ts + "." + xom tana)
async function sign(ts: number, raw: string): Promise<string> {
  return toHex(await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(`${ts}.${raw}`)));
}

const invoices = new Map([["inv_1", { status: "open", creditedCents: 0 }]]);
const seen = new Set<string>();

async function handle(h: { ts: number; sig: string }, raw: string, now: number): Promise<string> {
  if (Math.abs(now - h.ts) > TOLERANCE_SEC) return "rad: vaqt oynasidan tashqari";
  const sig = fromHex(h.sig);
  if (!sig || !(await crypto.subtle.verify("HMAC", await hmacKey(), sig, enc.encode(`${h.ts}.${raw}`)))) return "rad: imzo noto'g'ri";
  const ev = JSON.parse(raw) as { id?: unknown; type?: unknown; invoiceId?: unknown; amountCents?: unknown };
  if (typeof ev.id !== "string" || ev.type !== "payment.succeeded" || typeof ev.invoiceId !== "string") return "rad: tana";
  if (typeof ev.amountCents !== "number" || !Number.isInteger(ev.amountCents) || ev.amountCents <= 0) return "rad: tana";
  const inv = invoices.get(ev.invoiceId);
  if (!inv) return "rad: noma'lum hisob";
  if (seen.has(ev.id)) return "takror, e'tiborsiz";
  seen.add(ev.id);
  inv.status = "paid";
  inv.creditedCents += ev.amountCents;
  return "qabul";
}

const now = 1700000000;
const raw = JSON.stringify({ id: "evt_1", type: "payment.succeeded", invoiceId: "inv_1", amountCents: 1000 });
const goodSig = await sign(now, raw);

console.log("a) sirsiz soxta:", await handle({ ts: now, sig: "00".repeat(32) }, raw, now));
console.log("b) haqiqiy:", await handle({ ts: now, sig: goodSig }, raw, now));
console.log("c) darhol takror:", await handle({ ts: now, sig: goodSig }, raw, now));
console.log("d) bir soatdan keyin replay:", await handle({ ts: now, sig: goodSig }, raw, now + 3600));
const tampered = raw.replace("1000", "900000");
console.log("e) tana o'zgartirilgan:", await handle({ ts: now, sig: goodSig }, tampered, now));
console.log("hisob:", JSON.stringify(invoices.get("inv_1")));
```

```text
a) sirsiz soxta: rad: imzo noto'g'ri
b) haqiqiy: qabul
c) darhol takror: takror, e'tiborsiz
d) bir soatdan keyin replay: rad: vaqt oynasidan tashqari
e) tana o'zgartirilgan: rad: imzo noto'g'ri
hisob: {"status":"paid","creditedCents":1000}
```

### Tuzatish nima uchun yetarli

Endi invariantlar uch: imzoni sirni bilmay yasab bo'lmaydi (a va e rad etildi), imzo vaqt belgisini ham qoplaydi va qabul oynasidan eski xabar o'tmaydi (d), bir event ID bir marta ta'sir qiladi (c). Hisob oxirida faqat 1000 tiyin. Tana turlari va diapazon ham tekshiriladi, shuning uchun imzo to'g'ri bo'lgan, lekin manfiy summa yuborilgan xabar ham rad etiladi.

Yopilmagan narsalar: sir oshkor bo'lsa, hujumchi to'g'ri imzo yasaydi (HMAC simmetrik); himoya sirni boshqarish va rotatsiya (69-dars). Oyna ichidagi replay faqat idempotency bilan to'xtaydi, u esa bu yerda xotiradagi `Set`: restart yoki ikkinchi instance'da yo'qoladi. Production'da quyidagi sxema kerak: `event_id` ustida unique constraint va effekt bir tranzaksiyada. `invoiceId` ning mijoz tenant'iga tegishliligi va hisobning ruxsat etilgan holatdan o'tishi ham alohida tekshiriladi (59-dars).

### Idempotency bazada

Quyidagi blok unique constraint bilan takrorni ushlashni ko'rsatadi (SQLite sintaksisi, PostgreSQL bilan mos `ON CONFLICT DO NOTHING`):

```sql run
CREATE TABLE processed_events (event_id TEXT PRIMARY KEY, received_at INTEGER NOT NULL);
INSERT INTO processed_events VALUES ('evt_100', 1700000000);
INSERT INTO processed_events VALUES ('evt_100', 1700000300) ON CONFLICT DO NOTHING;
INSERT INTO processed_events VALUES ('evt_101', 1700000400) ON CONFLICT DO NOTHING;
SELECT event_id, received_at FROM processed_events ORDER BY event_id;
```

```text
event_id | received_at
evt_100 | 1700000000
evt_101 | 1700000400
(2 qator)
```

Ikkinchi `INSERT` hech narsa qo'shmadi, shuning uchun `evt_100` bir qatorda qoldi. Production'da effektni shu `INSERT` natijasiga bog'laysiz: qator qo'shilgan bo'lsa (PostgreSQL'da `RETURNING` yoki o'zgargan qatorlar soni) effekt bajariladi, aks holda takror deb o'tkazib yuboriladi. Ikkalasi bitta tranzaksiyada.

### Mashq

Quyidagi ikki funksiyada xato bor: imzo taqqoslash doimiy vaqtli emas va vaqt oynasi kelajakdagi vaqt belgisini rad etmaydi. Testlarga qarab tuzating.

```ts run
function safeEqual(a: string, b: string): boolean {
  return a === b;
}

function isFresh(ts: number, now: number, tolSec: number): boolean {
  return now - ts <= tolSec;
}
```

```ts test
check("bir xil satrlar teng", () => safeEqual("ab12", "ab12") === true);
check("farqli satrlar teng emas", () => safeEqual("ab12", "ab13") === false);
check("uzunligi farqli satrlar teng emas", () => safeEqual("ab12", "ab1") === false);
check("bo'sh va bo'sh teng", () => safeEqual("", "") === true);
check("oyna ichidagi vaqt yaroqli", () => isFresh(1000, 1100, 300) === true);
check("chegara (300 soniya) yaroqli", () => isFresh(1000, 1300, 300) === true);
check("eski vaqt rad etiladi", () => isFresh(1000, 1400, 300) === false);
check("kelajakdagi vaqt rad etiladi", () => isFresh(1500, 1000, 300) === false);
```

## Qachon qo'llamaslik kerak

- Ikki tomon ham o'zingizning nazoratingizdagi ichki servis bo'lsa, webhook o'rniga navbat (queue) yoki to'g'ridan-to'g'ri mTLS chaqiruv oddiyroq va xavfsizroq bo'lishi mumkin. Webhook ommaviy HTTP endpoint ochadi, bu esa hujum sirtini kengaytiradi.
- Provayder imzo qo'llamasa (ba'zi eski integratsiyalar), faqat IP allowlist va maxfiy URL tokeni qoladi. Bu zaif himoya: token log va proxy'larda sizadi. Bunday vaziyatda webhook'ni faqat "signal" sifatida ishlating va ma'lumotni provayder API'sidan o'zingiz qayta oling (callback orqali tasdiqlash), webhook tanasining o'ziga ishonmang.
- Vaqt oynasi juda qisqa bo'lsa, soat siljigan yoki kechikkan legitim xabarlar rad etiladi va provayder qayta urinishlari ko'payadi. Oynani sinab, soatlarni NTP bilan sinxronlab sozlang.
- To'liq idempotency har biznes amali uchun avtomatik emas: "email yuborish" kabi tashqi effektni ham ikki marta bajarmaslik uchun outbox yoki idempotency key kerak. Faqat DB yozuvi bilan cheklanmang.
- Xom tana saqlash katta tanalar uchun xotira talab qiladi; hajm limiti (73-dars) imzo tekshiruvidan oldin ishlashi kerak.

## Stack'da: NestJS, Fastify, PostgreSQL

NestJS'da imzo tekshiruvi uchun xom tana kerak: hujjatdagi Raw body sahifasiga ko'ra `NestFactory.create(AppModule, { rawBody: true })` yoqilsa, so'rovda `rawBody` maydoni bo'ladi (global body parser o'chirilmagan bo'lishi sharti bilan). NestJS Webhooks sahifasi qabul tomondagi xatolarni aynan shu tartibda sanaydi: qayta serializatsiya qilingan tana ustida imzo, `===` taqqoslash, vaqt oynasining yo'qligi va qayta yetkazilgan event'ning ikki marta bajarilishi; o'zining tekshiruvida esa xom baytlar, doimiy vaqtli taqqoslash, imzolangan vaqt belgisi uchun 5 daqiqalik oyna va rotatsiya paytida bir nechta sirni qabul qilishni ishlatadi. Imzoni global emas, faqat webhook controller'iga guard sifatida qo'ying, tana sxemasini esa DTO bilan tekshiring (72-dars). PostgreSQL'da idempotency uchun jadval va unique constraint:

```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "node:crypto";

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<{ rawBody?: Buffer; headers: Record<string, string> }>();
    const ts = Number(req.headers["x-webhook-timestamp"]);
    const sigHex = req.headers["x-webhook-signature"] ?? "";
    if (!req.rawBody || !Number.isInteger(ts) || Math.abs(Date.now() / 1000 - ts) > 300) throw new UnauthorizedException();

    const expected = createHmac("sha256", process.env.WEBHOOK_SECRET ?? "")
      .update(`${ts}.`)
      .update(req.rawBody)
      .digest();
    const got = Buffer.from(sigHex, "hex");
    if (got.length !== expected.length || !timingSafeEqual(got, expected)) throw new UnauthorizedException();
    return true;
  }
}
```

Header nomlari (`x-webhook-timestamp`, `x-webhook-signature`) bu yerda o'quv nomlari, real provayder boshqacha nom ishlatadi. Kod ishga tushirilmaydi: NestJS bu muhitda yo'q, faqat sintaksis tekshirilgan. Servis qatlamida effekt shunday bo'ladi: bitta tranzaksiyada `INSERT INTO processed_events(event_id) VALUES ($1) ON CONFLICT DO NOTHING`, qator qo'shilgan bo'lsa ledger yozuvi. Kysely yoki Prisma'dagi tranzaksiya sintaksisi farq qiladi, lekin mantiq bir xil. Sirni `process.env` dan o'qish minimal variant; production uchun secrets manager (69-dars).

## Xulosa

- Webhook endpoint'i internetga ochiq: imzosiz xabar soxta deb qaralsin. Imzo xom tana va vaqt belgisi ustida hisoblanadi, tekshiruv parse qilishdan oldin bo'ladi.
- Imzoni doimiy vaqtli taqqoslang (`timingSafeEqual`, `subtle.verify`), oldin format va uzunlikni tekshiring.
- Replay'ga qarshi vaqt belgisi imzoga kiritiladi va qabul oynasi bilan tekshiriladi; oyna ichidagi takrorni idempotency yopadi.
- Takroriy yetkazish normal holat: event ID ustida unique constraint va effektni bir tranzaksiyada bajarish; "avval SELECT, keyin INSERT" race beradi.
- Imzo jo'natuvchini tasdiqlaydi, tana to'g'riligini emas: sxema, diapazon, tenant va holat o'tishini alohida tekshiring.
- HMAC simmetrik: sir oshkor bo'lsa himoya yo'q. Sirni saqlash va rotatsiya (69-dars), provayder sxemasini esa rasmiy hujjatidan tekshiring.
