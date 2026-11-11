---
n: 59
slug: business-logic-zaifliklari
title: "Business logic zaifliklari"
summary: "Kod to'g'ri ishlaydi, lekin biznes qoidasi buziladi: narx va miqdorga mijoz ishonchi, workflow bosqichlarini o'tkazib yuborish, bir martalik amallarni qayta ishlatish, cheklovlar va ularni state machine hamda server tomonidagi qayta hisoblash bilan qanday yopish."
duration: 50
sources:
  - id: t10-a06
    note: "A06:2025 Insecure Design: threat modeling'ni muhim oqimlarga (access control, business logic) qo'llash; kinoteatr guruh bron stsenariysi; skalperlar uchun anti-bot dizayn"
  - id: cs-business-logic
    note: "Business Logic Security Cheat Sheet: narx, ruxsat va identifikatorni serverda qayta hisoblash; workflow'ni aniq state machine sifatida saqlash; bajarilgan bosqichni qayta ishlatishni rad etish; bir martalik amallar uchun doimiy yozuv; feature darajasidagi cheklovlar"
  - id: wstg
    note: "WSTG Business Logic Testing: WSTG-BUSL-05 (funksiyani necha marta ishlatish mumkinligi chegarasi; kupon bazada yaroqsiz qilinishi yoki backend/DB darajasida hisoblagich) va WSTG-BUSL-04 (process timing)"
  - id: asvs
    note: "ASVS 5.0 V2: 2.1.3 (biznes limitlar hujjatlashtirilishi), 2.3.1 (qadamlar ketma-ketligi), 2.3.2 (limitlar amalga oshirilishi), 2.3.5 (yuqori qiymatli oqimlar uchun ko'p foydalanuvchi tasdig'i)"
  - id: api-top10
    note: "API6:2023 Unrestricted Access to Sensitive Business Flows (nomi)"
quiz:
  - q: "Checkout so'rovi `{sku, qty, price}` yuboradi, server esa `total = price * qty` hisoblaydi. Cheat sheet bu yerda nimani talab qiladi?"
    options:
      - "Server faqat mahsulot identifikatori va miqdorni qabul qiladi, narxni o'z bazasidan topib qayta hisoblaydi"
      - "Narx maydonini shifrlash"
      - "Narxni JavaScript bilan klientda tekshirish"
      - "Narxni cookie'ga ko'chirish"
    answer: 0
    explain: "Cheat sheet: narx, subtotal, soliq yoki total mijozdan qabul qilinmaydi. Mijoz holati kirish ma'lumoti, haqiqat emas."
  - q: "Ko'p bosqichli buyurtma oqimida joriy bosqich yashirin forma maydonida (`step=paid`) turadi. Nima noto'g'ri?"
    options:
      - "Hech narsa, forma maydoni yetarli"
      - "Maydon juda uzun"
      - "Bu yerda bosqich mijoz tomonida, uni mijoz xohlagan qiymatga o'zgartira oladi; holat serverda, mijoz yoza olmaydigan joyda saqlanishi kerak"
      - "Faqat HTTPS bo'lmasa muammo bo'ladi"
    answer: 2
    explain: "Cheat sheet: joriy bosqichni yashirin maydon yoki mijoz o'qiy oladigan cookie'da saqlash majburlash emas. Holat serverda saqlanadi va har o'tish joriy holatga qarab tekshiriladi."
  - q: "Kupon `WELCOME10` har akkaunt uchun bir martalik. Server uni ishlatilganini xotiradagi o'zgaruvchida belgilaydi va ilova qayta ishga tushganda belgi yo'qoladi. Hujjatlarga ko'ra qanday yaxshilash kerak?"
    options:
      - "Kupon nomini murakkablashtirish"
      - "Foydalanishni doimiy xotirada (baza) yozib, takrorni rad etish; WSTG kuponni bazada yaroqsiz qilish yoki backend/DB darajasida hisoblagich qo'yishni aytadi"
      - "Kupon kodini faqat ertalab ko'rsatish"
      - "Klientda tugmani o'chirib qo'yish"
    answer: 1
    explain: "WSTG-BUSL-05 remediation va cheat sheet bir martalik amallarni doimiy xotirada belgilashni tavsiya qiladi; takror urinish xato hisoblanadi."
  - q: "Kinoteatr misolida (Top 10 A06) guruh bron chegarasi o'n besh kishi, undan ko'p bo'lsa depozit kerak. Hujumchi nima qiladi?"
    options:
      - "SQL injection"
      - "Parolni taxmin qiladi"
      - "Server kodiga kiradi"
      - "Oqimni threat model qilib, bir necha so'rovda oltmish yuz o'rin yoki barcha kinoteatrni bron qilishga urinadi; mantiq cheklovi yetishmaydi"
    answer: 3
    explain: "Top 10 stsenariysi: hujumchi oqimni threat model qiladi va biznes mantig'idagi bo'shliqdan foydalanib, keng bron qiladi. Zaiflik kodning xatosi emas, qoidaning yo'qligi."
  - q: "`qty` maydoni tekshiruvdan `typeof qty === 'number'` bilan o'tadi, `-3` ham o'tadi va total manfiy chiqadi. ASVS 2.2.1 yondashuviga ko'ra to'g'ri tuzatish qaysi?"
    options:
      - "Manfiy qiymatni Math.abs bilan musbatga aylantirish"
      - "Biznes kutilmasi bo'yicha pozitiv (allow list) tekshiruv: butun son va oraliq (masalan 1 dan 10 gacha), undan tashqari rad"
      - "Faqat klientda `min=1` qo'yish"
      - "Total manfiy bo'lsa, 0 ga tenglash"
    answer: 1
    explain: "ASVS 2.2.1: kiritish biznes kutilmalariga qarshi tekshiriladi, ruxsat etilgan qiymatlar, andoza va oraliqlar bo'yicha pozitiv tekshiruv afzal. Math.abs hujumchining niyatini jimgina o'zgartiradi, klient tekshiruvi esa xavfsizlik nazorati emas (ASVS 2.2.2)."
  - q: "Nega oddiy scanner business logic zaifliklarini ko'pincha topa olmaydi?"
    options:
      - "Scanner HTTP bilmaydi"
      - "Ular faqat klientda ishlaydi"
      - "Bu zaifliklar texnik imzoga ega emas: har kirish tekshirilgan, hech qanday texnik qoida buzilmagan, lekin biznes qoidasi buzilgan, buni bilish uchun ilovaning maqsadi kerak"
      - "Scanner'lar faqat parollarni tekshiradi"
    answer: 2
    explain: "Cheat sheet: scanner'lar ilovaning biznes qoidalarini bilmaydi, shuning uchun tozalangan scanner hisoboti qoidalar bajarilayotganini isbotlamaydi. Ular biznes jarayoni bo'yicha ko'rib chiqish va sinov bilan to'ldiriladi."
task:
  title: "Buyurtma holati: state machine"
  prompt: |
    Buyurtma holatlari: `cart` -> `paid` -> `shipped`. `step(state, action)` zaif: u har qanday amalga, holatdan qat'i nazar, ruxsat beradi.

    Tuzating:

    1. Ruxsat etilgan o'tishlar: `cart` + `pay` -> `paid`; `paid` + `ship` -> `shipped`.
    2. Boshqa har qanday kombinatsiyada `Error` tashlang (xabar `"rad: <holat> + <amal>"`).
    3. Takroriy `pay` (allaqachon `paid` holatda) ham rad etilishi kerak.
    4. Imzoni o'zgartirmang. Kutilgan natijalar: `paid`, `shipped`, `rad: cart + ship`, `rad: paid + pay`, `rad: shipped + pay`.
  lang: ts
  starter: |
    type State = "cart" | "paid" | "shipped";
    type Action = "pay" | "ship";

    function step(state: State, action: Action): State {
      return action === "pay" ? "paid" : "shipped";
    }

    const run = (s: State, a: Action) => {
      try { return step(s, a); } catch (e) { return (e as Error).message; }
    };
    console.log(run("cart", "pay"));
    console.log(run("paid", "ship"));
    console.log(run("cart", "ship"));
    console.log(run("paid", "pay"));
    console.log(run("shipped", "pay"));
  solution: |
    type State = "cart" | "paid" | "shipped";
    type Action = "pay" | "ship";

    const TRANSITIONS: Record<string, State> = {
      "cart+pay": "paid",
      "paid+ship": "shipped",
    };

    function step(state: State, action: Action): State {
      const next = TRANSITIONS[`${state}+${action}`];
      if (!next) throw new Error(`rad: ${state} + ${action}`);
      return next;
    }

    const run = (s: State, a: Action) => {
      try { return step(s, a); } catch (e) { return (e as Error).message; }
    };
    console.log(run("cart", "pay"));
    console.log(run("paid", "ship"));
    console.log(run("cart", "ship"));
    console.log(run("paid", "pay"));
    console.log(run("shipped", "pay"));
  solutionNotes: |
    - O'tishlar jadvali aniq ruxsat ro'yxati: jadvalda bo'lmagan kombinatsiya rad etiladi (deny by default, 51-58 darslardagi tamoyil).
    - `TRANSITIONS` lug'atida kalit sifatida holat va amal birlashtiriladi; `paid + pay` jadvalda yo'q, shuning uchun takror to'lov rad etiladi.
    - Haqiqiy tizimda holat bazada saqlanadi va o'tish shartli yangilash bilan bajariladi (`UPDATE ... WHERE status = 'cart'`); aks holda ikki parallel so'rov ikkalasi ham `cart`ni ko'radi (60-dars).
    - `Object.hasOwn` bilan tekshirish `__proto__` kabi kalitlar uchun xavfsizroq, bu yerda kalitlar ichki hosil qilinadi va mijozdan kelmaydi.
  checklist:
    - "O'tishlar aniq jadvalda yoziladi"
    - "Jadvalda yo'q kombinatsiya xato beradi"
    - "Takroriy to'lov rad etiladi"
    - "Holat serverda saqlanishi kerakligi tushunilgan"
---

## Muammo

Hozirgacha ko'rilgan zaifliklarning ko'pchiligida bir narsa buzilgan: nazorat yo'q edi yoki noto'g'ri joyda edi. Business logic zaifliklarida esa nazorat bor, har kirish tekshirilgan, hech qanday injection yo'q, lekin ilova biznes uchun noto'g'ri narsani qiladi. Business Logic Security Cheat Sheet buni shunday ta'riflaydi: kod dasturchi aytgan narsani bajaradi, lekin dasturchi aytgan narsa biznesga haqiqatan kerak narsaga mos kelmaydi. Foydalanuvchi zarur bosqichni o'tkazib yuboradi, so'rovlarni tartibsiz yuboradi, manfiy narx to'laydi yoki kuponlarni xohlagancha yig'adi.

Cheat sheet misoli: checkout so'rovi mahsulot ID'si, miqdor va kupon kodini yuboradi. Mahsulot mavjud, miqdor musbat butun son, kupon kodi andozaga mos, ya'ni hech qanday texnik qoida buzilmagan. Lekin ilova jami summani narxni serverda qidirish o'rniga mijoz yuborgan narxdan qayta hisoblasa, foydalanuvchi o'zi belgilagan narxni to'laydi.

Avtopark misolida: yangi shina buyurtmasi, texnik xizmat uchun to'lov, yetkazib berish. Har qadamning o'z endpoint'i bor, UI foydalanuvchini ketma-ket yurgizadi. Agar faqat UI tartibni ta'minlasa, hujumchi to'g'ridan-to'g'ri `ship` endpoint'iga so'rov yuborib, to'lovsiz yetkazib berishni boshlashi mumkin.

Bu zaifliklar ikki sababga ko'ra xavfli. Birinchisi, scanner ularni odatda topa olmaydi: cheat sheet ularda ilovaning biznes qoidalari yo'qligini aytadi va tozalangan scanner hisoboti qoidalar bajarilayotganini bildirmaydi. Ikkinchisi, ular to'g'ridan-to'g'ri pulga tegadi: yo'qotilgan daromad, qaytarilgan to'lov, buzilgan zaxira.

## Asosiy g'oya

Cheat sheet'ning kalit takeaways'laridan to'rtta qoida bu darsning asosi:

1. **Xavfsizlik uchun muhim qiymatlar serverda qayta hisoblanadi.** Narx, ruxsat, egalik va identifikator mijozdan kelsa ham, mijozning yozuvi haqiqat emas, kirish ma'lumoti sifatida qaraladi.
2. **Workflow aniq state machine.** Joriy holat serverda saqlanadi va har o'tish shu holatga qarab tekshiriladi.
3. **Cheklovlar qoidaning bir qismi.** Bir martalik amallar, miqdor chegaralari va tezlik cheklovlari kodda va bazada ifodalanadi.
4. **Raqobat real tahdid.** Ikki so'rov bir vaqtda kelishi mumkin, deb hisoblanadi (60-dars).

Va beshinchi, jarayon darajasidagi fikr: biznes jarayonidan threat model qilish. Cheat sheet savol beradi: sistema har qadamda foydalanuvchi niyati haqida qanday faraz qiladi va bu farazlardan qaysi biri yolg'on bo'lsa foydalanuvchiga foyda keltiradi? Xatolar aynan shu yerda yashaydi.

## Chuqurroq: kategoriyalar

### Mijoz tomonidagi qiymatlarga ishonish

Cheat sheet jadvali: mijoz mahsulot ID'si va miqdorni yuboradi, server narxni qidiradi va qator summasini hisoblaydi; mijoz kupon kodini yuboradi, server uni tekshirib chegirmani o'zi qo'llaydi; yetkazib berish narxi serverning o'z tarif jadvalidan hisoblanadi; soliqdan ozod bayrog'i akkaunt holatidan aniqlanadi. Server "chegirma summasi", "yetkazib berish narxi" yoki "soliqdan ozod" maydonlarini qabul qilmaydi. Xuddi shu qoida tijoratdan tashqarida: ijtimoiy ilova mijozdan "post ko'rinishi"ni qabul qilmaydi, agar u maxfiylik sozlamalaridan kelib chiqishi kerak bo'lsa.

Ko'rinadigan oraliq: foydalanuvchi, tenant va rol identifikatorlari ham shu qatorda. Cheat sheet: identifikator so'rov tanasidan qabul qilinmaydi, harakat qiluvchi foydalanuvchi har doim server sessiyasi yoki token'dan olinadi. Bu 54-dars (mass assignment) va 55-dars (tenant konteksti) bilan bir xil g'oya.

### Kiritishni biznes kutilmasi bo'yicha tekshirish

`typeof qty === "number"` tekshiruvi texnik jihatdan to'g'ri, lekin biznes jihatdan bo'sh. ASVS 5.0 2.2.1 kiritishni biznes yoki funksional kutilmalarga qarshi tekshirishni talab qiladi, pozitiv (allow list) tekshiruv bilan: ruxsat etilgan qiymatlar, andozalar va oraliqlar. 2.2.2 tekshiruv ishonchli servis qatlamida bajarilishini, mijoz tomoni tekshiruvi esa xavfsizlik nazorati sifatida ishlatilmasligini aytadi. 2.2.3 bog'liq maydonlar kombinatsiyasining mantiqiy ekanligini talab qiladi, masalan chegirma jami summadan oshmasligi. 2.1.3 esa biznes limitlar (har foydalanuvchi uchun va butun ilova bo'yicha) hujjatlashtirilishini talab qiladi: hujjatlashtirilmagan limitni kodda tekshirib bo'lmaydi.

### Workflow'ni aylanib o'tish

ASVS 2.3.1: ilova bir foydalanuvchining biznes oqimlarini faqat kutilgan ketma-ket tartibda va qadamlarni o'tkazib yubormasdan qayta ishlashi kerak. Cheat sheet to'rt qadamli naqshni beradi: oqim boshlanganda boshlang'ich holat bilan yozuv yaratiladi; har qadam endpoint'i joriy holatni tekshiradi, harakatni bajaradi va holatni keyingi to'g'ri qiymatga yangilaydi; joriy holatga mos kelmaydigan qadam so'rovi rad etiladi; yakuniy harakatlar (buyurtmani yuborish, tasdiqlash, pul o'tkazish) faqat holat aynan talab qilinganidek bo'lsa bajariladi. Shuningdek: bajarilgan qadamni qayta ishga tushirishga urinishlar muvaffaqiyatsiz bo'lishi kerak, va to'xtab turgan oqimlarning muddati bo'lishi kerak (yarim tugagan holatlar to'planadi va ekspluatatsiya mumkin bo'lgan nomuvofiqliklar manbaiga aylanadi).

### Funksiyani necha marta ishlatish mumkinligi

WSTG-BUSL-05 misoli: sayt bir nechta chegirmadan birini ruxsat beradi; hujumchi chegirmani qo'llagach, chegirmalar sahifasiga qaytib, yana qo'llaydi. WSTG remediation qattiq nazorat talab qiladi: kuponni bazada yaroqsiz qilish yoki foydalanuvchi uchun hisoblagichni backend yoki baza darajasida saqlash. Cheat sheet "foydalanuvchi uchun bir martalik bonus" uchun (user_id, bonus_type) bo'yicha unique constraint'ni va dublikatni bazaga rad ettirishni tavsiya qiladi.

### Hisobga olinmagan ommaviy ishlatish va jarayon vaqti

API Top 10 ro'yxatida alohida kategoriya bor: Unrestricted Access to Sensitive Business Flows. Cheat sheet buni "suiiste'molga moyil funksiyalar" deb nomlaydi (referral, kupon, parolni tiklash) va ularga autentifikatsiyadan tashqari o'z nazoratlarini talab qiladi: har funksiya uchun alohida rate limit, qiymat beruvchi amallarning audit izi, har qatlamda maksimumlar. Top 10 A06 skalperlar misoli: yangi videokartalarni qayta sotish uchun botlar bilan sotib olish; himoya sifatida anti-bot dizayn va "mahsulot paydo bo'lgandan keyin bir necha soniya ichida xarid" kabi domen qoidalari taklif qilinadi. ASVS 2.4.1 anti-automation, 2.4.2 esa (3-daraja) oqimlar uchun real inson tezligini talab qiladi.

WSTG-BUSL-04 jarayon vaqtini alohida holat sifatida ko'rsatadi: bron qilingan o'rinlar to'lovsiz ushlab turilishi yoki narx kotirovkasi kun bo'yi ochiq qolib, hujumchi narx foydali bo'lsagina buyurtmani yakunlashi mumkin. Remediation: tranzaksiyalar belgilangan vaqtdan keyin bekor qilinadi yoki qayta o'rnatiladi.

## Misol: avtopark ehtiyot qismlari buyurtmasi

Quyidagi model checkout'ni mijoz yuborgan narx, miqdor va bosqich bilan ishlaydi.

### 1. Zaif kod

```ts run
type Body = { sku: string; qty: number; price: number; coupon?: string };
const orders: { id: number; total: number; status: string }[] = [];

// ZAIF: narx va miqdor mijozdan, kupon qayta ishlatiladi, to'lov holati tekshirilmaydi
const usedCoupons = new Set<string>();
function checkoutWeak(b: Body): number {
  let total = b.price * b.qty;
  if (b.coupon === "WELCOME10") total = total - 10; // har safar qo'llanadi, set'ga yozilmaydi
  const id = orders.length + 1;
  orders.push({ id, total, status: "cart" });
  return total;
}
function shipWeak(id: number): string {
  const o = orders.find((x) => x.id === id);
  if (!o) return "yo'q";
  o.status = "shipped";
  return `yuborildi: ${id}`;
}

console.log("oddiy xarid:", checkoutWeak({ sku: "tire", qty: 2, price: 100 }));
```

```text
oddiy xarid: 200
```

### 2. Hujum

Hujumchi servis kodini o'zgartirmaydi, faqat so'rovni qo'lda tuzadi:

```ts run
type Body = { sku: string; qty: number; price: number; coupon?: string };
const orders: { id: number; total: number; status: string }[] = [];
function checkoutWeak(b: Body): number {
  let total = b.price * b.qty;
  if (b.coupon === "WELCOME10") total = total - 10;
  const id = orders.length + 1;
  orders.push({ id, total, status: "cart" });
  return total;
}
function shipWeak(id: number): string {
  const o = orders.find((x) => x.id === id);
  if (!o) return "yo'q";
  o.status = "shipped";
  return `yuborildi: ${id}`;
}

console.log("narxni o'zgartirish:", checkoutWeak({ sku: "tire", qty: 2, price: 1 }));
console.log("manfiy miqdor:", checkoutWeak({ sku: "tire", qty: -3, price: 100 }));
console.log("kupon:", checkoutWeak({ sku: "tire", qty: 1, price: 15, coupon: "WELCOME10" }));
console.log("to'lovsiz yuborish:", shipWeak(1), "-> holat:", orders[0].status);
```

```text
narxni o'zgartirish: 2
manfiy miqdor: -300
kupon: 5
to'lovsiz yuborish: yuborildi: 1 -> holat: shipped
```

Mijoz narxni 1 ga tushirdi, manfiy miqdor bilan jami summani manfiy qildi (ya'ni refund sifatida talqin qilinishi mumkin), kuponni cheksiz ishlatdi va to'lovsiz yuborishni boshladi. Hamma so'rovlar texnik jihatdan to'g'ri shaklda edi. Payloadlar faqat shu model kodiga qarshi.

### 3. Tuzatilgan kod

Narx katalogdan, miqdor oraliqda, kupon doimiy yozuv bilan, holat esa state machine orqali:

```ts run
const CATALOG: Record<string, number> = { tire: 100, oil: 30 };
type Order = { id: number; user: string; total: number; status: "cart" | "paid" | "shipped" };
const orders: Order[] = [];
const couponUse = new Set<string>(); // doimiy xotira o'rnida: (user, kupon) juftligi

function checkout(user: string, b: { sku: string; qty: unknown; coupon?: string }): number {
  const price = CATALOG[b.sku];
  if (price === undefined) throw new Error("noma'lum mahsulot");
  const qty = b.qty;
  if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > 10) {
    throw new Error("miqdor 1..10 butun son bo'lishi kerak");
  }
  let total = price * qty;
  if (b.coupon !== undefined) {
    if (b.coupon !== "WELCOME10") throw new Error("kupon yaroqsiz");
    const key = `${user}:${b.coupon}`;
    if (couponUse.has(key)) throw new Error("kupon allaqachon ishlatilgan");
    couponUse.add(key);
    total = Math.max(total - 10, 0);
  }
  orders.push({ id: orders.length + 1, user, total, status: "cart" });
  return total;
}

const NEXT: Record<string, Order["status"]> = { "cart+pay": "paid", "paid+ship": "shipped" };
function act(user: string, id: number, action: "pay" | "ship"): string {
  const o = orders.find((x) => x.id === id && x.user === user); // egalik
  if (!o) throw new Error("topilmadi");
  const next = NEXT[`${o.status}+${action}`];
  if (!next) throw new Error(`rad: ${o.status} + ${action}`);
  o.status = next;
  return next;
}

const t = (fn: () => unknown) => { try { return fn(); } catch (e) { return (e as Error).message; } };
console.log("oddiy:", t(() => checkout("u1", { sku: "tire", qty: 2 })));
console.log("manfiy miqdor:", t(() => checkout("u1", { sku: "tire", qty: -3 })));
console.log("kupon 1:", t(() => checkout("u1", { sku: "tire", qty: 1, coupon: "WELCOME10" })));
console.log("kupon 2:", t(() => checkout("u1", { sku: "tire", qty: 1, coupon: "WELCOME10" })));
console.log("to'lovsiz yuborish:", t(() => act("u1", 1, "ship")));
console.log("to'lov:", t(() => act("u1", 1, "pay")));
console.log("yuborish:", t(() => act("u1", 1, "ship")));
console.log("boshqa foydalanuvchi:", t(() => act("u2", 1, "pay")));
```

```text
oddiy: 200
manfiy miqdor: miqdor 1..10 butun son bo'lishi kerak
kupon 1: 90
kupon 2: kupon allaqachon ishlatilgan
to'lovsiz yuborish: rad: cart + ship
to'lov: paid
yuborish: shipped
boshqa foydalanuvchi: topilmadi
```

### Tuzatish nima uchun yetarli

Narxni mijoz belgilay olmaydi (faqat katalogdagi mahsulot sotiladi), miqdor ruxsat etilgan oraliqdan chiqmaydi, kupon har foydalanuvchi uchun bir marta qo'llanadi, `ship` esa faqat `paid` holatdan keyin ishlaydi va buyurtma egasi tekshiriladi. Bu ko'rsatilgan hujumlarni yopadi. Qoldiq risklar: `couponUse` modelda xotirada, haqiqiy tizimda (user_id, kupon) bo'yicha unique constraint bilan bazada bo'lishi kerak; holat o'tishlari bir vaqtda ikki so'rov kelganda poyga holatiga duchor bo'ladi (60-dars); ko'p akkaunt ochib kuponni ko'p marta olish (multi-accounting) texnik tekshiruv bilan yopilmaydi, buning uchun identifikatsiya signallari va feature darajasidagi limitlar kerak.

## Qachon qo'llamaslik kerak

- Hamma narsani state machine qilish shart emas. Bir bosqichli, o'zgarmas amallar (masalan profil rasmini almashtirish) uchun murakkab o'tishlar jadvali ortiqcha; asosiy narsa egalikni (52-dars) va kiritishni tekshirish.
- Qat'iy cheklovlar haqiqiy foydalanuvchilarni ham to'sishi mumkin: miqdor chegarasi 10 bo'lsa, ulgurji xaridorlar uchun alohida oqim kerak. Chegarani biznes bilan kelishib, ASVS 2.1.3 bo'yicha hujjatlashtiring, keyin kodga yozing.
- Anti-automation (CAPTCHA, kutish vaqti) foydali tajriba xarajatini oshiradi. Cheat sheet "qiymat beruvchi harakat qiyinroq bo'lishi kerak" deydi, lekin oddiy, qiymat bermaydigan amallarni sekinlashtirmang.
- Yuqori qiymatli oqimlar uchun ko'p foydalanuvchi tasdig'i (ASVS 2.3.5, 3-daraja) har joyda kerak emas: katta pul o'tkazmalari, shartnoma tasdiqlari va xavfsizlikka ta'sir qiluvchi o'zgartirishlar uchun mos.
- Scanner va avtomatik testlar foydasiz degani emas: cheat sheet ular workflow enforcement zaifliklarini ba'zan topishi mumkinligini aytadi, lekin ular ko'rib chiqish va jarayonni tekshiradigan sinovlarni almashtirmaydi.

## Stack'da: NestJS va Prisma

Quyidagi kod ishga tushirilmaydi (NestJS va Prisma muhiti yo'q). U yuqoridagi modelni real stack'ga ko'chiradi: narx bazadan, miqdor DTO'da cheklangan, kupon unique constraint bilan, holat shartli yangilash bilan.

```ts
import { IsInt, IsString, Max, Min, IsOptional } from "class-validator";
import { Injectable, BadRequestException, ConflictException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export class CheckoutDto {
  @IsString() sku!: string;
  @IsInt() @Min(1) @Max(10) qty!: number; // allow list oralig'i
  @IsOptional() @IsString() coupon?: string;
}
// prisma schema: model CouponUse { userId String; code String; @@unique([userId, code]) }

declare const prisma: any;

@Injectable()
export class OrdersService {
  async checkout(userId: string, tenantId: string, dto: CheckoutDto) {
    const product = await prisma.product.findFirst({ where: { sku: dto.sku, tenantId } });
    if (!product) throw new BadRequestException("noma'lum mahsulot");
    let total = product.price * dto.qty; // narx bazadan

    return prisma.$transaction(async (tx: any) => {
      if (dto.coupon) {
        try {
          await tx.couponUse.create({ data: { userId, code: dto.coupon } }); // dublikatni baza rad etadi
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            throw new ConflictException("kupon allaqachon ishlatilgan");
          }
          throw e;
        }
        total = Math.max(total - 10, 0);
      }
      return tx.order.create({ data: { userId, tenantId, total, status: "cart" } });
    });
  }

  async ship(userId: string, tenantId: string, id: string) {
    const res = await prisma.order.updateMany({
      where: { id, userId, tenantId, status: "paid" }, // holat sharti yangilashning ichida
      data: { status: "shipped" },
    });
    if (res.count === 0) throw new ConflictException("buyurtma yuborishga tayyor emas");
  }
}
```

Prisma'ning `P2002` kodi unique constraint buzilishini bildiradi; o'z versiyangiz hujjatida tekshiring. `updateMany` ichidagi `status: "paid"` sharti tekshiruv va yangilashni bitta operatsiyaga birlashtiradi, bu keyingi darsning asosiy g'oyasi.

## Xulosa

- Business logic zaifliklarida texnik qoida buzilmaydi, biznes qoidasi buziladi; scanner qoidalarni bilmagani uchun ularni ko'pincha topa olmaydi.
- Narx, ruxsat, egalik va identifikatorni mijozdan qabul qilmang, serverda ishonchli ma'lumotdan qayta hisoblang; kiritishni biznes kutilmasi bo'yicha pozitiv tekshiring (ASVS 2.2.1).
- Workflow'ni serverda saqlanadigan aniq state machine sifatida yozing: har o'tish joriy holatga qarab tekshiriladi, o'tkazib yuborish va takrorlash rad etiladi (ASVS 2.3.1).
- Bir martalik amallar va limitlarni doimiy xotirada (baza, unique constraint) majburlang; biznes limitlarni oldindan hujjatlashtiring (ASVS 2.1.3, 2.3.2).
- Biznes jarayonidan threat model qiling: har qadamda "foydalanuvchi buni noto'g'ri qilsa nima bo'ladi" deb so'rang; suiiste'molga moyil funksiyalarga o'z rate limitini qo'ying.
