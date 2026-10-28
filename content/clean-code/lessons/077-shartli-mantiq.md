---
n: 77
slug: shartli-mantiq
title: "Shartli mantiqni refaktoring qilish"
summary: "Fowler katalogining shartli mantiq bobi: Decompose Conditional, Consolidate Conditional Expression, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Special Case va Introduce Assertion. Ularni ketma-ket qo'llab, chalkash tarif hisobini qadamma-qadam tozalaymiz."
duration: 40
sources:
  - id: refactoring
    note: "10-bob \"Simplifying Conditional Logic\" va 11-bobdagi Remove Flag Argument; Replace Control Flag with Break"
  - id: refactoring-catalog
    note: "Decompose Conditional, Consolidate Conditional Expression, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Special Case (eski nomi Introduce Null Object), Introduce Assertion"
quiz:
  - q: "Quyidagi kodga qaysi refaktoring birinchi navbatda mos? `if (isBlocked) return 0; if (balance < 0) return 0; if (!contract) return 0; return calc();`"
    options:
      - "Decompose Conditional"
      - "Replace Conditional with Polymorphism"
      - "Consolidate Conditional Expression: bir xil natija beradigan shartlarni bitta nomlangan tekshiruvga birlashtirish"
      - "Introduce Assertion"
    answer: 2
    explain: "Bir nechta shart bir xil natijaga olib kelsa va ular birgalikda bitta tekshiruvni ifodalasa, ularni `if (isNotBillable()) return 0;` ga birlashtirish mumkin. Lekin faqat ular haqiqatan bitta tushuncha bo'lsa: mustaqil tekshiruvlarni birlashtirish ma'noni yashiradi."
  - q: "Replace Nested Conditional with Guard Clauses'ning asosiy g'oyasi nima?"
    options:
      - "Har bir funksiyada faqat bitta return bo'lishi kerak"
      - "Shartlar ikki turdagi bo'ladi: ikkala tarmoq ham normal xatti-harakat (if/else) yoki biri g'ayrioddiy holat; g'ayrioddiy holatni erta qaytish bilan ajratish asosiy yo'lni ochiq qiladi"
      - "Barcha shartlarni switch'ga aylantirish"
      - "Ichma-ich if'larni ternary operatorlarga aylantirish"
    answer: 1
    explain: "Fowler ikki turdagi shartni farqlaydi. if/else ikkala tarmoq teng og'irlikka ega ekanini bildiradi, guard clause esa \"bu odatiy holat emas, chiqib ketamiz\" deydi. Fowler \"bitta kirish, bitta chiqish\" qoidasini foydali deb hisoblamaydi."
  - q: "Kod bazasida 14 joyda `if (customer === null) name = 'Mehmon'` va shunga o'xshash tekshiruvlar bor. Qaysi refaktoring?"
    options:
      - "Introduce Special Case: \"noma'lum mijoz\" holati uchun maxsus obyekt"
      - "Introduce Assertion"
      - "Remove Flag Argument"
      - "Decompose Conditional"
    answer: 0
    explain: "Ko'p mijozlar bir xil maxsus qiymatni tekshirib, bir xil reaksiya qilsa, Introduce Special Case bu xatti-harakatni bitta obyektga yig'adi. 1-nashrda u Introduce Null Object deb atalgan, 2-nashrda kengroq: null'dan tashqari har qanday maxsus holat uchun."
  - q: "Introduce Assertion haqida qaysi gap to'g'ri?"
    options:
      - "Assertion foydalanuvchi kiritgan ma'lumotni tekshirish uchun"
      - "Assertion'lar production'da o'chirilishi kerak"
      - "Assertion biznes xatolarini qaytarish uchun"
      - "Assertion dastur xatti-harakatini o'zgartirmasligi kerak: u hech qachon yolg'on bo'lmasligi kerak bo'lgan, aks holda dasturchi xatosini bildiradigan farazni ochiq yozadi"
    answer: 3
    explain: "Fowler assertion'ni dastur to'g'ri bo'lsa doim rost bo'ladigan farazlar uchun ishlatadi. U tashqi kirishni validatsiya qilish uchun emas. Assertion o'chirilsa ham dastur bir xil ishlashi kerak, shuning uchun uni qo'shish refaktoring."
  - q: "Tarif hisobida `switch (plan.kind)` faqat bitta funksiyada bor va yangi tarif yiliga bir marta qo'shiladi. Replace Conditional with Polymorphism'ni qo'llash kerakmi?"
    options:
      - "Ha, har qanday switch polimorfizmga aylantirilishi kerak"
      - "Ha, chunki bu SOLID talabi"
      - "Shart emas: bitta joydagi aniq switch ko'pincha eng o'qiladigan yechim; polimorfizm bir xil shart bir necha joyda takrorlanganda yoki tarmoqlar murakkab bo'lganda foyda beradi"
      - "Yo'q, polimorfizm har doim sekinroq"
    answer: 2
    explain: "Repeated Switches smell'i (74-dars) takror haqida. Fowler ham polimorfizmni har bir shart uchun emas, takrorlangan switch'lar yoki asosiy holat va uning variantlari bo'lganda tavsiya qiladi."
  - q: "`function render(order: Order, isPreview: boolean)` ichida `isPreview` bo'yicha uch joyda tarmoq bor. Chaqiruvchilar doim literal `true`/`false` uzatadi. Qaysi refaktoring?"
    options:
      - "Introduce Special Case"
      - "Remove Flag Argument: `renderPreview(order)` va `renderFinal(order)` kabi aniq funksiyalar"
      - "Consolidate Conditional Expression"
      - "Introduce Assertion"
    answer: 1
    explain: "Flag argument chaqiruv joyida ma'no bermaydi (`render(order, true)`) va funksiya ichida tarmoqlanishni ko'paytiradi. Chaqiruvchilar literal uzatsa, Remove Flag Argument eng aniq yo'l. Agar flag ma'lumot oqimidan kelsa (masalan, foydalanuvchi sozlamasi), uni saqlash oqilona bo'lishi mumkin."
task:
  title: "Tarif hisobini shartlardan tozalash"
  prompt: |
    Transport parki platformasining oylik obuna hisobi. Funksiya ishlaydi, lekin uni o'zgartirish qo'rqinchli.

    Ketma-ket qo'llang va har qadamni katalog nomi bilan belgilang:

    1. Replace Nested Conditional with Guard Clauses.
    2. Decompose Conditional (murakkab shartlarga nom bering).
    3. Consolidate Conditional Expression (faqat haqiqatan bitta tushuncha bo'lsa).
    4. Tarif turlari bo'yicha mantiqni bitta joyga yig'ing (Replace Conditional with Polymorphism yoki lookup jadval - tanlovni asoslang).
    5. Xatti-harakat o'zgarmasin.
  lang: ts
  starter: |
    type Account = {
      status: "active" | "suspended" | "trial";
      plan: "basic" | "pro" | "enterprise";
      vehicles: number;
      trialEndsAt: Date;
      hasVideo: boolean;
      overdueDays: number;
    };

    export function monthlyFee(a: Account, today: Date): number {
      let fee = 0;
      if (a.status !== "suspended") {
        if (a.status === "trial" && today < a.trialEndsAt) {
          fee = 0;
        } else {
          if (a.plan === "basic") {
            fee = a.vehicles * 30000;
          } else if (a.plan === "pro") {
            fee = a.vehicles * 45000;
            if (a.hasVideo) fee += a.vehicles * 20000;
          } else {
            fee = Math.max(a.vehicles * 40000, 2000000);
            if (a.hasVideo) fee += a.vehicles * 15000;
          }
          if (a.overdueDays > 30 && a.plan !== "enterprise") {
            fee = fee * 1.1;
          }
        }
      }
      return Math.round(fee);
    }
  solution: |
    type Plan = "basic" | "pro" | "enterprise";

    type Account = {
      status: "active" | "suspended" | "trial";
      plan: Plan;
      vehicles: number;
      trialEndsAt: Date;
      hasVideo: boolean;
      overdueDays: number;
    };

    type PlanPricing = {
      perVehicle: number;
      videoPerVehicle: number | null;
      minimumFee: number;
      lateFeeApplies: boolean;
    };

    const PLAN_PRICING: Record<Plan, PlanPricing> = {
      basic: { perVehicle: 30_000, videoPerVehicle: null, minimumFee: 0, lateFeeApplies: true },
      pro: { perVehicle: 45_000, videoPerVehicle: 20_000, minimumFee: 0, lateFeeApplies: true },
      enterprise: { perVehicle: 40_000, videoPerVehicle: 15_000, minimumFee: 2_000_000, lateFeeApplies: false },
    };

    const LATE_THRESHOLD_DAYS = 30;
    const LATE_FEE_MULTIPLIER = 1.1;

    function isInFreeTrial(account: Account, today: Date): boolean {
      return account.status === "trial" && today < account.trialEndsAt;
    }

    function isNotBillable(account: Account, today: Date): boolean {
      return account.status === "suspended" || isInFreeTrial(account, today);
    }

    function baseFee(account: Account, pricing: PlanPricing): number {
      return Math.max(account.vehicles * pricing.perVehicle, pricing.minimumFee);
    }

    function videoFee(account: Account, pricing: PlanPricing): number {
      if (!account.hasVideo || pricing.videoPerVehicle === null) return 0;
      return account.vehicles * pricing.videoPerVehicle;
    }

    function isSeriouslyOverdue(account: Account, pricing: PlanPricing): boolean {
      return pricing.lateFeeApplies && account.overdueDays > LATE_THRESHOLD_DAYS;
    }

    export function monthlyFee(account: Account, today: Date): number {
      if (isNotBillable(account, today)) return 0;

      const pricing = PLAN_PRICING[account.plan];
      const fee = baseFee(account, pricing) + videoFee(account, pricing);
      const total = isSeriouslyOverdue(account, pricing) ? fee * LATE_FEE_MULTIPLIER : fee;
      return Math.round(total);
    }
  solutionNotes: |
    - **Guard Clauses**: uch darajali ichma-ichlik ikki erta qaytishga aylandi, keyin bittaga birlashdi. Asosiy yo'l (to'lov hisobi) endi chap chetda.
    - **Consolidate Conditional Expression**: `suspended` va `bepul trial` ikkalasi "hisob yuritilmaydi" degan bitta tushuncha, shuning uchun `isNotBillable` ga birlashtirish o'rinli. Agar ular kelajakda turli natija bersa (masalan, suspended uchun qarzni ko'rsatish), ularni qayta ajratish oson.
    - **Decompose Conditional**: `isInFreeTrial`, `isSeriouslyOverdue` - shartlar nomlandi. `a.plan !== "enterprise"` endi `lateFeeApplies` - biznes qoidasi nomlangan.
    - **Tarif bo'yicha mantiq**: subklasslar o'rniga lookup jadval tanlandi, chunki tariflar faqat raqamlar bilan farq qiladi, algoritm bir xil (min, video, kechikish). Agar bitta tarif butunlay boshqa formula bilan hisoblansa (masalan, kilometr bo'yicha), Replace Conditional with Polymorphism (yoki funksiya maydoni) mos keladi.
    - **Xatti-harakat tekshiruvi**: `basic` uchun `hasVideo === true` bo'lsa, eski kod video uchun hech narsa qo'shmasdi; yangisida `videoPerVehicle: null` buni saqlaydi (0 emas, chunki "video mavjud emas" va "video bepul" turli tushuncha). `minimumFee: 0` `Math.max` bilan eski xatti-harakatni saqlaydi.
    - Refaktoringdan oldin har bir tarif, status va chegaraviy qiymat (`overdueDays` = 30 va 31, `today` = `trialEndsAt`) uchun characterization test yozish kerak.
  checklist:
    - "Ichma-ich if'lar qolmadi, asosiy yo'l chap chetda"
    - "Har bir murakkab shart nomlangan funksiyada"
    - "Birlashtirilgan shartlar haqiqatan bitta tushunchani ifodalaydi"
    - "Tarifga xos qiymatlar bitta joyda, yangi tarif qo'shish faqat shu joyga tegadi"
    - "Chegaraviy holatlar (30/31 kun, trial tugash kuni) uchun eski va yangi natija bir xil"
---

## Muammo

Biznes qoidalari kodda deyarli har doim shartlar ko'rinishida yashaydi: "agar mijoz VIP bo'lsa", "agar shartnoma muddati o'tgan bo'lsa", "agar transport elektr bo'lsa va tun bo'lsa". Har bir yangi talab yana bitta `if` qo'shadi. Bir yil o'tgach, funksiya to'rt darajali ichma-ichlikka, o'nlab tarmoqqa va hech kim to'liq tushunmaydigan mantiqqa ega bo'ladi.

Bunday kodda eng xavfli narsa - yangi talabni qo'shish. Siz yangi `if` ni qayerga qo'yishni tanlaysiz va u boshqa tarmoq bilan kesishishini sezmaysiz. Testlar faqat asosiy yo'llarni qamrab olgan, chegaraviy kombinatsiyalarni esa hech kim tekshirmagan.

Fowler 10-bobni ("Simplifying Conditional Logic") shu fikr bilan boshlaydi: shartli mantiq dasturlarga kuchining katta qismini beradi, lekin afsuski murakkabligining ham katta qismini. U bu bobda shartlarni tushunarli qilish uchun refaktoringlar to'plamini beradi.

## Asosiy g'oya

10-bobdagi oltita refaktoring:

1. **Decompose Conditional** - murakkab shartni va uning tarmoqlarini nomlangan funksiyalarga bo'lish.
2. **Consolidate Conditional Expression** - bir xil natija beradigan bir nechta tekshiruvni bitta shartga birlashtirish.
3. **Replace Nested Conditional with Guard Clauses** - g'ayrioddiy holatlarni erta qaytish bilan ajratish.
4. **Replace Conditional with Polymorphism** - tur bo'yicha tarmoqlanishni polimorfik obyektlarga ko'chirish.
5. **Introduce Special Case** - maxsus qiymatni (ko'pincha null) tekshirishning takroriy naqshini maxsus obyekt bilan almashtirish.
6. **Introduce Assertion** - kod tayanadigan farazni ochiq yozish.

Bularga yaqin ikkita refaktoring boshqa boblarda: **Remove Flag Argument** (11-bob, API refaktoringlari) va **Replace Control Flag with Break** (ilgari Remove Control Flag deb atalgan).

Bu darsda 26-dars (guard clause) va 27-dars (switch va polimorfizm) mavzularini Fowler katalogi nuqtai nazaridan yig'amiz: endi ular alohida usullar emas, bir-biridan keyin qo'llanadigan qadamlar zanjiri.

## Chuqurroq: har bir refaktoringning nozik joyi

### Decompose Conditional

Murakkab shartli mantiq uzun funksiyalarning eng keng tarqalgan manbalaridan biri. Kod nima bo'layotganini aytadi, lekin nega bo'layotganini osongina yashirib qo'yadi. Decompose Conditional - Extract Function'ning (76-dars) shartlarga maxsus qo'llanishi: shartning o'zini, then-tarmoqni va else-tarmoqni alohida, niyatni aytuvchi nomlar bilan funksiyalarga chiqarish.

Natija: `if (date >= SUMMER_START && date <= SUMMER_END)` o'rniga `if (isSummer(date))`. Farq kichik ko'rinadi, lekin o'quvchi endi shartni tahlil qilmaydi, uni o'qiydi.

### Consolidate Conditional Expression

Ba'zan bir nechta tekshiruv har xil, lekin natijasi bir xil. Fowler bu yerda ikki sababni ko'rsatadi: birlashtirish tekshiruvlar aslida bitta ekanini aniq qiladi, va u Extract Function uchun zamin tayyorlaydi (birlashgan shartni nomlash mumkin).

Muhim ogohlantirish, Fowlerning o'zidan: agar tekshiruvlar haqiqatan mustaqil va ularni bitta tekshiruv deb o'ylamaslik kerak bo'lsa, birlashtirmang. Masalan, "hisob bloklangan" va "to'lov kartasi muddati o'tgan" - bugun ikkalasi ham `return 0` beradi, lekin ular turli biznes sabablari va ertaga turli xabar talab qilishi mumkin.

Mexanikada yon ta'sirlarni tekshirish kerak: agar shartlardan birida side effect bo'lsa, avval Separate Query from Modifier.

### Replace Nested Conditional with Guard Clauses

Fowler shartli ifodalarni ikki uslubga bo'ladi. Birinchisi: ikkala tarmoq ham normal xatti-harakat - bunda `if/else` to'g'ri, chunki u ikkala yo'lning teng og'irligini ko'rsatadi. Ikkinchisi: bitta tarmoq normal, ikkinchisi g'ayrioddiy holat. G'ayrioddiy holat uchun shart va erta qaytish - bu guard clause. U o'quvchiga "bu funksiyaning asosiy ishi emas, agar shunday bo'lsa, chiqib ketamiz" deydi.

Fowler bu yerda "bitta kirish, bitta chiqish" qoidasiga ochiq qarshi chiqadi: uning fikricha, bu qoida foydali emas va aniqlik muhimroq. Guard clause haqidagi batafsil muhokama va kognitiv murakkablik bilan bog'liqligi 26-darsda.

### Replace Conditional with Polymorphism

Fowler polimorfizmni ikki holat uchun tavsiya qiladi. Birinchi: tur bo'yicha switch bir necha joyda takrorlanadi (Repeated Switches, 74-dars) - har bir tur uchun klass yaratib, switch'larni yo'qotish. Ikkinchi: asosiy holat va uning variantlari - umumiy mantiq superklassda, variantlar subklasslarda faqat farq qiladigan qismni override qiladi.

Fowler bu refaktoringni ham har bir shart uchun tavsiya qilmaydi. Ko'p shartlar oddiy `if/else` va `switch` sifatida yaxshi qoladi. Polimorfizm murakkab, takrorlanuvchi tarmoqlanishda foyda beradi.

TypeScript'da klass ierarxiyasidan tashqari ikki muqobil bor (27-dars): faqat ma'lumot farq qilsa - lookup jadval (`Record<Kind, Config>`), xatti-harakat farq qilsa - funksiyalar jadvali yoki discriminated union bilan `never` tekshiruvi. Bular ham Repeated Switches'ni bitta joyga yig'adi.

### Introduce Special Case

Kod bazasida ko'p joyda bir xil maxsus qiymat tekshiriladi va bir xil reaksiya qilinadi. Eng keng tarqalgan misol - null: "agar mijoz yo'q bo'lsa, nomi 'Mehmon', tarifi 'basic'". Introduce Special Case maxsus holat uchun obyekt yaratadi va u kerakli xatti-harakatni o'zi beradi. Mijozlar endi null'ni tekshirmaydi.

1-nashrda bu refaktoring Introduce Null Object deb atalgan. 2-nashrdagi nom kengroq: maxsus holat null bo'lishi shart emas, masalan "noma'lum transport", "tarifsiz hisob" yoki "o'chirilgan foydalanuvchi".

Fowler bu yerda bir nechta implementatsiya variantini ko'rsatadi: alohida klass, oddiy literal obyekt (agar maxsus holat faqat o'qiladigan qiymatlar bo'lsa) yoki transform orqali yozuvga maxsus belgini qo'shish. TypeScript'da literal obyekt variant ko'pincha eng sodda.

### Introduce Assertion

Ba'zi kod bo'laklari faqat ma'lum shart rost bo'lganda ishlaydi: kvadrat ildiz faqat musbat son uchun, chegirma foizi 0 va 1 orasida. Bu farazlar ko'pincha yashirin va faqat algoritmni tahlil qilib topiladi. Assertion bu farazni ochiq yozadi.

Fowler muhim chegarani ko'rsatadi: assertion faqat **dasturchi xatosi** uchun. Agar shart yolg'on bo'lsa, demak kodda xato bor. Tashqi kirishni (foydalanuvchi ma'lumoti, API javobi) assertion bilan tekshirmaslik kerak: u uchun validatsiya va xato qaytarish (47-48-darslar). Yana bir nozik jihat: dastur xatti-harakati assertion'ga bog'liq bo'lmasligi kerak. U o'chirilsa ham kod bir xil ishlashi lozim, shuning uchun uni qo'shish refaktoring hisoblanadi. Fowler ham hamma joyga assertion qo'yishni emas, faqat rost bo'lishi shart bo'lgan narsalar uchun qo'yishni tavsiya qiladi.

### Remove Flag Argument va Replace Control Flag with Break

**Remove Flag Argument**: chaqiruvchi funksiya qaysi mantiqni bajarishini boolean (yoki enum) bilan tanlasa, `bookConcert(customer, true)` o'qilmaydi. Har bir variant uchun aniq funksiya (`bookPremiumConcert(customer)`) chaqiruv joyini o'z-o'zini tushuntiradigan qiladi. Fowler flag'ni faqat chaqiruvchilar uni literal qiymat sifatida uzatganda olib tashlashni tavsiya qiladi. Agar qiymat ma'lumot oqimidan kelsa, flag oqilona bo'lishi mumkin.

**Replace Control Flag with Break**: siklda `let found = false` kabi o'zgaruvchi faqat sikldan chiqish uchun ishlatilsa, uni `break`, `continue` yoki `return` bilan almashtirish. TypeScript'da ko'pincha `find`, `some` yoki `every` yanada aniqroq.

## Misol: refaktoringlar zanjiri

Ijara platformasida e'lon narxini ko'rsatish:

```ts run
type Listing = { priceTiyin: number; ownerId: string; discountPercent: number | null };
type Viewer = { id: string; isPartner: boolean } | null;

export function displayPrice(listing: Listing, viewer: Viewer): string {
  let result: string;
  if (viewer !== null) {
    if (viewer.id === listing.ownerId) {
      result = "Sizning e'loningiz";
    } else {
      let price = listing.priceTiyin;
      if (listing.discountPercent !== null && listing.discountPercent > 0 && listing.discountPercent < 100) {
        price = price - (price * listing.discountPercent) / 100;
      }
      if (viewer.isPartner) price = price * 0.95;
      result = `${Math.round(price / 100)} so'm`;
    }
  } else {
    let price = listing.priceTiyin;
    if (listing.discountPercent !== null && listing.discountPercent > 0 && listing.discountPercent < 100) {
      price = price - (price * listing.discountPercent) / 100;
    }
    result = `${Math.round(price / 100)} so'm`;
  }
  return result;
}

// Sinab ko'ring: chegirma foizini yoki tomoshabinni o'zgartiring.
const listing: Listing = { priceTiyin: 120_000_000, ownerId: "u-1", discountPercent: 10 };
console.log("Mehmon:", displayPrice(listing, null));
console.log("Hamkor:", displayPrice(listing, { id: "u-2", isPartner: true }));
console.log("Egasi:", displayPrice(listing, { id: "u-1", isPartner: false }));
```

**1-qadam, Introduce Special Case.** `viewer === null` - mehmon foydalanuvchi. U `id` ga ega emas va hamkor emas:

```ts
type RealViewer = { id: string; isPartner: boolean };
const GUEST: RealViewer = { id: "guest", isPartner: false };

function viewerOrGuest(viewer: RealViewer | null): RealViewer {
  return viewer ?? GUEST;
}
```

Endi ikki katta tarmoq bir xil bo'ladi: mehmon uchun `isPartner` false, demak hamkor chegirmasi qo'llanmaydi. Takrorlangan else-tarmoq yo'qoladi.

**2-qadam, Replace Nested Conditional with Guard Clauses.** Egasi o'z e'lonini ko'rishi - g'ayrioddiy holat.

**3-qadam, Decompose Conditional.** Uzun chegirma sharti nomlanadi.

Natija:

```ts
const PARTNER_RATE = 0.95;

function hasValidDiscount(listing: Listing): listing is Listing & { discountPercent: number } {
  const d = listing.discountPercent;
  return d !== null && d > 0 && d < 100;
}

function discountedPrice(listing: Listing): number {
  if (!hasValidDiscount(listing)) return listing.priceTiyin;
  return listing.priceTiyin * (1 - listing.discountPercent / 100);
}

export function displayPrice(listing: Listing, maybeViewer: RealViewer | null): string {
  const viewer = viewerOrGuest(maybeViewer);
  if (viewer.id === listing.ownerId) return "Sizning e'loningiz";

  const base = discountedPrice(listing);
  const price = viewer.isPartner ? base * PARTNER_RATE : base;
  return `${Math.round(price / 100)} so'm`;
}
```

Har bir qadamdan keyin testlar. Ikki nozik joy:

- `GUEST.id = "guest"`. Agar biror e'lonning `ownerId` si tasodifan `"guest"` bo'lsa, xatti-harakat o'zgaradi. Bu Special Case'ning klassik xavfi: maxsus qiymat haqiqiy qiymat bilan to'qnashmasligi kerak. Xavfsizroq variant - `id: null` yoki alohida `isGuest: true` maydoni.
- `price - (price * d) / 100` va `price * (1 - d / 100)` matematik jihatdan teng, lekin suzuvchi nuqtada oxirgi xonada farq qilishi mumkin. Yaxlitlash `Math.round(price / 100)` bilan bo'lgani uchun amalda farq chiqmaydi, lekin buni test bilan tasdiqlash kerak, taxmin bilan emas.

## Qachon qo'llamaslik kerak

- **Oddiy if/else.** Ikki teng tarmoqli shart (masalan, "elektr transport bo'lsa kWh, aks holda litr") guard clause'ga aylantirilmasligi kerak. Fowler ham buni ta'kidlaydi: if/else ikkala yo'lning teng ekanini bildiradi.
- **Bitta joydagi switch.** Polimorfizmga aylantirish ko'pincha bitta faylni bir nechta klassga bo'ladi va o'quvchini sakrashga majbur qiladi. Takror yoki murakkab variant mantiqi bo'lmasa, switch qolsin.
- **Mustaqil shartlarni birlashtirish.** "Bloklangan" va "kartasi eskirgan" ni `isNotBillable` ga birlashtirsangiz, keyin ulardan biri boshqa xabar talab qilganda birlashmani qayta ochish kerak. Consolidate faqat bitta tushuncha uchun.
- **Special Case xato yashirganda.** Agar null "xato holat" bo'lsa (masalan, majburiy mijoz topilmadi), uni jimgina "Mehmon" ga aylantirish xatoni yashiradi. Special Case faqat maxsus holat domen nuqtai nazaridan normal bo'lganda (mehmon foydalanuvchi, sensori yo'q transport).
- **Assertion'ni validatsiya o'rnida.** `assert(dto.amount > 0)` controller'da - bu noto'g'ri vosita: foydalanuvchiga 500 xato qaytaradi. Kirish validatsiyasi uchun DTO va pipe'lar.

## Stack'da: TypeScript, NestJS, React

- **Type guard'lar Decompose Conditional sifatida.** `function hasValidDiscount(l): l is ...` shartni nomlaydi va TypeScript'ga tor tipni beradi. Bu oddiy Extract Function'dan kuchliroq: chaqiruvchida `!` kerak bo'lmaydi.
- **Assertion funksiyalari.** TypeScript'da `function assertIsDefined<T>(v: T): asserts v is NonNullable<T>` - Introduce Assertion'ning tip tizimidagi ko'rinishi. Node'da `node:assert` moduli ham bor. Faqat dasturchi xatolari uchun ishlating.
- **NestJS guard'lari va pipe'lar.** Autentifikatsiya va validatsiya kabi g'ayrioddiy holatlarni servis metodining boshidagi guard clause'lardan NestJS `Guard` va `ValidationPipe` ga ko'chirish mumkin. Lekin biznes qoidasiga oid guard clause'lar (masalan, "shartnoma yopilgan bo'lsa to'lovni qabul qilma") servisda qolishi kerak, aks holda qoida ko'rinmas bo'lib qoladi.
- **React'da early return.** Komponentda `if (isLoading) return <Spinner />; if (error) return <ErrorView />;` - guard clause'larning React ko'rinishi. Ichma-ich ternary'lardan (`isLoading ? ... : error ? ... : ...`) ancha o'qiladigan. Faqat hook'larni early return'dan oldin chaqirishni unutmang.
- **Special Case React'da.** `user ?? GUEST_USER` bilan komponent daraxtiga doim to'liq obyekt uzatish ko'plab `user?.name ?? "Mehmon"` tekshiruvlarini yo'qotadi.

## Xulosa

- Shartli mantiq kodning kuchi va murakkabligining asosiy manbai. 10-bobdagi oltita refaktoring uni boshqarish vositalari.
- Decompose Conditional shartlarga nom beradi, Consolidate Conditional Expression bitta tushunchani bitta tekshiruvga yig'adi, lekin mustaqil tekshiruvlarni birlashtirmang.
- Guard clause g'ayrioddiy holat uchun, if/else ikki teng yo'l uchun. Fowler "bitta chiqish" qoidasini qo'llab-quvvatlamaydi.
- Polimorfizm takrorlangan yoki murakkab tur bo'yicha tarmoqlanishda foydali. TypeScript'da lookup jadval va discriminated union ham shu vazifani bajaradi.
- Special Case takroriy null tekshiruvlarini yo'qotadi, Assertion yashirin farazlarni ochadi. Ikkalasi ham faqat to'g'ri holatda: Special Case xatoni yashirmasin, Assertion validatsiya o'rnini egallamasin.
