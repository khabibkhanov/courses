---
n: 5
slug: strategik-dasturlash
title: "Strategik va taktik dasturlash"
summary: "Har bir vazifani \"ishlasin, keyingisiga o'tamiz\" deb yopish qisqa muddatda tez, uzoq muddatda sekin. Bu darsda Ousterhout'ning taktik va strategik dasturlash farqini, \"tactical tornado\" hodisasini, investitsiya miqdorini va Pragmatic Programmer'dagi ETC tamoyili hamda singan derazalar g'oyasi bilan bog'liqligini ko'ramiz."
duration: 30
sources:
  - id: aposd
    note: "3-bob \"Working Code Isn't Enough\": tactical programming, tactical tornado, strategic programming, investitsiya miqdori va startaplar haqidagi muhokama"
  - id: pragprog
    note: "Software Entropy (singan derazalar), Good-Enough Software va The Essence of Good Design (ETC - Easier to Change) mavzulari"
quiz:
  - q: "Ousterhout bo'yicha taktik dasturlashning asosiy xatosi nimada?"
    options:
      - "Taktik dasturchi kodni sekin yozadi"
      - "Taktik dasturchi test yozmaydi"
      - "Har bir vazifada asosiy maqsad - tezroq ishlaydigan qilish, va kelajak uchun kichik murakkabliklar qo'shilishi qabul qilinadi; bular yig'ilib tizimni sekinlashtiradi"
      - "Taktik dasturchi faqat yangi texnologiyalarni ishlatadi"
    answer: 2
    explain: "Taktik dasturlashda har bir qaror alohida olganda oqilona ko'rinadi. Muammo yig'indida: murakkablik inkremental (3-dars), va taktik yondashuv uni tizimli ravishda to'playdi."
  - q: "Jamoadagi bir dasturchi boshqalardan 2-3 baravar tez feature chiqaradi, menejer uni maqtaydi, lekin uning kodiga tegish kerak bo'lganda boshqalar kunlab qiynaladi. Ousterhout bunday dasturchini qanday ataydi?"
    options:
      - "Tactical tornado"
      - "10x engineer"
      - "Strategic programmer"
      - "Code owner"
    answer: 0
    explain: "Tactical tornado - tez kod chiqaradigan, lekin orqasidan vayronagarchilik qoldiradigan dasturchi. Uning narxini boshqalar to'laydi va bu menejmentga ko'rinmaydi, shuning uchun u ko'pincha qahramon sifatida ko'riladi."
  - q: "Ousterhout strategik dasturlash uchun qancha investitsiya tavsiya qiladi?"
    options:
      - "Vaqtning 50% ini refaktoringga"
      - "Har sprint oxirida bitta to'liq refaktoring haftasi"
      - "Faqat loyiha boshida katta dizayn bosqichi"
      - "Doimiy kichik investitsiya: rivojlanish vaqtining taxminan 10-20% i"
    answer: 3
    explain: "Ousterhout kichik va doimiy investitsiyani taklif qiladi, katta bir martalik dizayn bosqichini emas. Raqam uning tajribaviy bahosi, o'lchangan statistika emas. Muhimi - investitsiya har kungi ishning qismi."
  - q: "Pragmatic Programmer'dagi ETC tamoyili qaysi savolni beradi?"
    options:
      - "Bu kod tezroq ishlaydimi?"
      - "Bu qaror tizimni o'zgartirishni osonlashtiradimi?"
      - "Bu kod barcha SOLID tamoyillariga mosmi?"
      - "Bu kodni boshqa loyihada qayta ishlatish mumkinmi?"
    answer: 1
    explain: "ETC - Easier to Change. Thomas va Hunt fikricha, yaxshi dizaynning boshqa ko'p tamoyillari shu bitta qadriyatning xususiy holati. U strategik dasturlashning amaliy savoli sifatida ishlatilishi mumkin."
  - q: "Startap mahsulotni 3 oy ichida bozorga chiqarishi kerak. Ousterhout pozitsiyasiga eng yaqin javob qaysi?"
    options:
      - "Taktik dasturlash oqlanadi, chunki startapda kod baribir qayta yoziladi"
      - "Strategik dasturlash faqat katta kompaniyalar uchun"
      - "Startap ham strategik bo'lishi kerak: dastlabki tez yutuq keyingi sekinlashish va eng yaxshi muhandislarni jalb qilish qiyinligi bilan to'lanadi, kod esa amalda kamdan-kam qayta yoziladi"
      - "Barcha kodni avval to'liq loyihalash kerak"
    answer: 2
    explain: "Ousterhout startaplardagi taktik yondashuvga qarshi chiqadi: \"keyin qayta yozamiz\" va'dasi kamdan-kam bajariladi, sifatsiz kod esa yaxshi muhandislarni jalb qilishni qiyinlashtiradi. Bu uning fikri va bu borada haqiqatan ham tajribali odamlar orasida turli qarashlar bor."
  - q: "Singan derazalar (broken windows) g'oyasi taktik dasturlash bilan qanday bog'liq?"
    options:
      - "Ular bir-biriga zid"
      - "Bitta tuzatilmagan yomon joy boshqalarga \"bu yerda sifat muhim emas\" degan signal beradi va taktik qarorlar tezlashadi"
      - "Singan derazalar faqat UI xatolariga tegishli"
      - "Singan derazalar - bu xavfsizlik zaifliklari"
    answer: 1
    explain: "Thomas va Hunt dasturiy entropiya haqida yozganda, tuzatilmagan yomon dizayn yoki kod boshqalarni ham beparvoroq bo'lishga undashini aytadi. Bu taktik qarorlarning o'z-o'zini kuchaytiradigan zanjirini yaratadi."
task:
  title: "Taktik yechimni strategik yechimga aylantirish"
  prompt: |
    Ijara platformasida bron qilish xizmati bor. Yangi talab keldi: **bron qilishdan oldin mijoz qora ro'yxatda emasligini tekshirish**. Dasturchi uni "taktik" usulda, 10 daqiqada qo'shdi (quyidagi kod).

    1. Bu taktik yechim kelajakda qanday murakkablik qo'shishini yozing: keyingi ikki-uch ehtimoliy talabni tasavvur qiling (masalan: "yoshi 21 dan kichik mijozlar sport avtomobilini ijaraga ololmaydi", "qarzdor mijozlar bron qila olmaydi").
    2. Kodni strategik yo'l bilan qayta yozing: yangi talab qo'shilishi bitta aniq joyga tushsin, lekin spekulyativ "qoidalar dvigateli" qurmang. Investitsiya kichik bo'lsin (Ousterhout'ning 10-20% i).
    3. Mavjud xatti-harakat saqlansin.
  lang: ts
  starter: |
    type Customer = { id: string; birthYear: number; blacklisted: boolean };
    type Car = { id: string; dailyRateUzs: number; category: "economy" | "business" | "sport" };
    type Booking = { customerId: string; carId: string; days: number; totalUzs: number };

    export class BookingService {
      constructor(
        private readonly customers: Map<string, Customer>,
        private readonly cars: Map<string, Car>,
      ) {}

      book(customerId: string, carId: string, days: number): Booking | string {
        const customer = this.customers.get(customerId);
        const car = this.cars.get(carId);
        if (!customer || !car) return "not found";
        if (customer.blacklisted) return "blocked";
        return { customerId, carId, days, totalUzs: car.dailyRateUzs * days };
      }
    }
  solution: |
    type Customer = { id: string; birthYear: number; blacklisted: boolean };
    type Car = { id: string; dailyRateUzs: number; category: "economy" | "business" | "sport" };
    type Booking = { customerId: string; carId: string; days: number; totalUzs: number };

    type BookingRejection =
      | { reason: "customer_not_found" }
      | { reason: "car_not_found" }
      | { reason: "customer_blacklisted" };

    type BookingResult = { ok: true; booking: Booking } | { ok: false; rejection: BookingRejection };

    type EligibilityCheck = (customer: Customer, car: Car) => BookingRejection | null;

    /**
     * Mijoz va avtomobil uchun bron qilish shartlari.
     * Yangi shart - shu ro'yxatga yangi funksiya va BookingRejection'ga yangi sabab.
     */
    const ELIGIBILITY_CHECKS: EligibilityCheck[] = [
      (customer) => (customer.blacklisted ? { reason: "customer_blacklisted" } : null),
    ];

    export class BookingService {
      constructor(
        private readonly customers: Map<string, Customer>,
        private readonly cars: Map<string, Car>,
      ) {}

      book(customerId: string, carId: string, days: number): BookingResult {
        const customer = this.customers.get(customerId);
        if (!customer) return reject({ reason: "customer_not_found" });
        const car = this.cars.get(carId);
        if (!car) return reject({ reason: "car_not_found" });

        const rejection = findRejection(customer, car);
        if (rejection) return reject(rejection);

        return { ok: true, booking: { customerId, carId, days, totalUzs: car.dailyRateUzs * days } };
      }
    }

    function findRejection(customer: Customer, car: Car): BookingRejection | null {
      for (const check of ELIGIBILITY_CHECKS) {
        const rejection = check(customer, car);
        if (rejection) return rejection;
      }
      return null;
    }

    function reject(rejection: BookingRejection): BookingResult {
      return { ok: false, rejection };
    }
  solutionNotes: |
    - Taktik versiyaning asosiy muammosi `Booking | string` qaytish tipi edi: har bir yangi rad etish sababi yangi sehrli satr qo'shadi va chaqiruvchilar `typeof result === "string"` va satrlarni solishtirishga majbur. Bu change amplification va obscurity.
    - Ikkinchi muammo: har bir yangi shart `book` metodiga yangi `if` qo'shadi. Uch-to'rt talabdan keyin metod bron qilish va siyosat aralashmasiga aylanadi.
    - Strategik yechimdagi investitsiya kichik: bitta union tip, bitta funksiyalar ro'yxati. Biz qoidalarni bazaga chiqarmadik, DSL yoki plagin tizimini qurmadik (9-dars, YAGNI).
    - `not found` holatlari ataylab ro'yxatga kiritilmadi: ular shart emas, balki ma'lumot mavjudligi tekshiruvi, va `check` funksiyalari `customer` va `car` mavjudligiga tayanadi.
    - Agar ikkinchi shart hech qachon kelmasa, bu investitsiya bir necha qatorga tushdi. Shuning uchun u xavfsiz: noto'g'ri bashorat narxi past.
  checklist:
    - "Kelajakdagi 2-3 talab va ularning taktik yechimdagi narxi yozildi"
    - "Rad etish sabablari sehrli satr emas, union tip"
    - "Yangi shart qo'shish book metodini o'zgartirmaydi"
    - "Qoidalar dvigateli yoki konfiguratsiya tizimi kabi spekulyativ abstraksiya qurilmadi"
    - "Qora ro'yxatdagi mijoz uchun xatti-harakat saqlandi"
---

## Muammo

Sprint planning'da vazifa: "buyurtmaga promo-kod maydonini qo'shish". Baho - 2 soat. Dasturchi uni 2 soatda bajaradi: DTO'ga maydon, controller'da `if`, service'da yana bitta `if`, frontend'da yana bitta input. Testlar o'tadi, tiket yopiladi. Hamma xursand.

Keyingi oyda xuddi shunday vazifa 4 soat oladi, chunki avvalgi `if` lar orasidan yangi joy topish kerak. Uchinchi oyda 2 kun. Hech kim yomon ishlamadi. Har bir dasturchi o'z vazifasini o'z vaqtida yopdi. Lekin tizim har oy sekinlashdi.

Bu darsning savoli: **"ishlaydi" degan mezon qachon yetarli emas va kundalik ishda nima qilish kerak?**

## Asosiy g'oya

John Ousterhout *A Philosophy of Software Design*ning uchinchi bobini "Working Code Isn't Enough" deb nomlaydi va ikki xil yondashuvni qarama-qarshi qo'yadi.

### Taktik dasturlash

Taktik dasturlashda asosiy fokus - biror narsani ishlaydigan qilish: yangi feature yoki bug fix. Bu birinchi qarashda to'g'ri ko'rinadi: axir bizdan ishlaydigan kod kutiladi. Ousterhout'ning tanqidi shundaki, taktik dasturchi uchun bugungi vazifa yagona maqsad, va "eng yaxshi dizayn qanday bo'lardi?" degan savolga vaqt qolmaydi. U bu safar "bitta kichik murakkablik" qo'shishga rozi, chunki bu tezroq. Keyingi safar ham. Murakkablik inkremental (3-dars), shuning uchun taktik yondashuv uni tizimli ravishda to'playdi.

Taktik dasturlashning yana bir xususiyati: uni to'xtatish qiyin. Tizim murakkablashgani sari har bir vazifani to'g'ri qilish qimmatlashadi, va bu yana taktik qarorlarga undaydi. O'z-o'zini kuchaytiradigan sikl.

### Tactical tornado

Ousterhout "tactical tornado" degan obrazni beradi: boshqalardan ancha tez kod chiqaradigan, lekin butunlay taktik ishlaydigan dasturchi. Menejment uni ko'pincha qahramon deb ko'radi, chunki uning tezligi ko'rinadi, narxi esa yo'q. Narxni uning kodiga keyin tegadigan boshqa dasturchilar to'laydi, va ularning sekinligi ularning o'zlariga yoziladi. Bu obraz noqulay, lekin ko'p jamoalarda tanish.

### Strategik dasturlash

Strategik dasturlashning birinchi qadami: **ishlaydigan kod yetarli emasligini qabul qilish**. Asosiy maqsad - yaxshi dizayn, u ham ishlaydi. Ousterhout buni investitsiya fikrlashi deb ataydi: bugungi vazifaga ozgina qo'shimcha vaqt sarflab, kelajakdagi ishni arzonlashtirish.

Investitsiya ikki xil ko'rinishda bo'ladi:

- **Proaktiv.** Yangi klass yoki modulni yozayotganda bir nechta dizayn variantini ko'rib chiqish, eng tozasini tanlash, yaxshi hujjatlash.
- **Reaktiv.** Dizayn muammosini ko'rganingizda uni chetlab o'tmasdan, kichik bo'lsa ham tuzatish.

Qancha investitsiya? Ousterhout taxminan **rivojlanish vaqtining 10-20% ini** tavsiya qiladi. Bu uning tajribaviy bahosi. Muhimi - u katta bir martalik "dizayn bosqichi" emas, har kungi ishning qismi. Uning tasavvurida boshida taktik yondashuv tezroq ko'rinadi, lekin vaqt o'tishi bilan strategik yondashuv uni quvib o'tadi; aniq qachon - loyihaga bog'liq.

## Chuqurroq: startaplar, madaniyat va Pragmatic Programmer

### Startaplar haqidagi bahs

Eng ko'p e'tiroz: "startapda vaqt yo'q, avval bozorga chiqishimiz kerak, keyin qayta yozamiz". Ousterhout bunga qo'shilmaydi. Uning argumentlari:

- "Keyin qayta yozamiz" kamdan-kam bajariladi. Kod bazasi kattalashgani sari qayta yozish qimmatlashadi.
- Sifatsiz kod bazasi yaxshi muhandislarni jalb qilish va saqlab qolishni qiyinlashtiradi. Yaxshi muhandislar esa startapning eng muhim resursi.
- Bir martalik tezlik keyingi barcha ishning sekinlashuvi bilan to'lanadi.

U misol sifatida Facebook'ning "move fast and break things" shiorini keltiradi va kompaniya keyinchalik infratuzilma sifatiga ko'proq e'tibor qaratadigan shiorga o'tganini aytadi. Google va VMware'ni esa yuqori dizayn madaniyatiga ega kompaniyalar sifatida tilga oladi.

Bu bahsda adolatli bo'lish kerak: tajribali odamlar orasida bu borada yakdillik yo'q. Ko'p muvaffaqiyatli mahsulotlar taktik boshlangan va keyin qayta qurilgan. Muvozanatli xulosa shunday: startap sharoitida **hajm** cheklanishi mumkin (kamroq feature, kamroq abstraksiya), lekin **har bir yozilgan qismning sifati** tushirilmasligi kerak. Kam, lekin toza kod ko'p va chigal koddan tezroq rivojlanadi. Fowler'ning sifat iqtisodiyoti haqidagi argumenti (4-dars) ham shu tomonga ishora qiladi: past sifat oylar emas, haftalar ichida sekinlashtiradi.

### ETC: Easier to Change

David Thomas va Andrew Hunt *The Pragmatic Programmer*ning 20 yillik nashrida yaxshi dizayn mohiyatini bitta qadriyatga keltiradi: **ETC - Easier to Change**. Ularning fikricha, decoupling, single responsibility, yaxshi nomlash kabi ko'p tamoyillar shu bitta qadriyatning xususiy holati: yaxshi dizayn yomon dizayndan o'zgartirishga osonroq.

ETC strategik dasturlash uchun amaliy savol beradi. Har bir kichik qarorda o'zingizdan so'rang: "Bu tizimni o'zgartirishni osonlashtiradimi yoki qiyinlashtiradimi?". Mualliflar tan oladiki, ba'zan javob noaniq bo'ladi. Bunday holatda ular ikki narsani maslahat beradi: kodni almashtiriladigan qilib yozish (ya'ni kelajakda qaysi yo'nalishda o'zgarishini bilmasangiz, hech bo'lmaganda uni o'zgartirish oson bo'lsin) va o'z qarorlaringizni qayd qilib borib, keyinchalik ular to'g'ri chiqqanini tekshirish orqali instinktni rivojlantirish.

### Singan derazalar

Pragmatic Programmer'ning eng mashhur g'oyalaridan biri dasturiy entropiya va **singan derazalar**. Mualliflar fikricha, tuzatilmagan yomon dizayn, noto'g'ri qaror yoki sifatsiz kod "singan deraza" vazifasini bajaradi: u boshqalarga bu yerda sifat hech kimni qiziqtirmasligini bildiradi va keyingi taktik qarorni osonlashtiradi. Ularning tavsiyasi: singan derazani ko'rsangiz, uni tuzating, tuzatishga vaqt bo'lmasa, hech bo'lmaganda "taxta bilan yoping" - belgilang, izohlang, tiket oching.

Bu Ousterhout'ning "nol toqat" g'oyasining ijtimoiy tomoni: murakkablik nafaqat texnik, balki madaniy ham yig'iladi.

### Good-Enough Software

Pragmatic Programmer strategik dasturlashni perfeksionizmga aylantirmaslik haqida ham ogohlantiradi. "Good-Enough Software" mavzusida mualliflar sifat talablarini foydalanuvchilar bilan birga belgilashni va "yaxshi" ni "mukammal" uchun qurbon qilmaslikni maslahat beradi. Bu strategik dasturlash bilan zid emas: strategik investitsiya - 10-20%, cheksiz sayqal emas.

## Misol: taktik va strategik bir xil vazifa

Vazifa: GPS treker xabarlari kelganda haydovchiga tezlik oshgani haqida ogohlantirish yuborish. Taktik versiya:

```ts
type TrackerMessage = { imei: string; speedKmh: number; at: Date };

export class TrackerHandler {
  constructor(
    private readonly sms: { send(phone: string, text: string): Promise<void> },
    private readonly drivers: { phoneByImei(imei: string): Promise<string | null> },
  ) {}

  async handle(msg: TrackerMessage): Promise<void> {
    // ... koordinatalarni saqlash va boshqa 40 qator ...
    if (msg.speedKmh > 90) {
      const phone = await this.drivers.phoneByImei(msg.imei);
      if (phone) await this.sms.send(phone, `Tezlik ${msg.speedKmh} km/soat!`);
    }
  }
}
```

U ishlaydi. Lekin keyingi talablar allaqachon ko'rinib turibdi: shahar ichida chegara 70, trassada 100; bir daqiqada 50 ta SMS yubormaslik; dispetcherga ham xabar. Har biri `handle` ga yana bitta `if` qo'shadi va treker xabarini qayta ishlash bilan ogohlantirish siyosati aralashib ketadi.

Strategik versiya - 10-20% qo'shimcha vaqt bilan:

```ts
type TrackerMessage = { imei: string; speedKmh: number; at: Date };

type SpeedViolation = { imei: string; speedKmh: number; limitKmh: number; at: Date };

export interface SpeedPolicy {
  /** Ruxsat etilgan maksimal tezlik yoki chegara qo'llanmasa null. */
  limitFor(message: TrackerMessage): number | null;
}

export interface ViolationNotifier {
  notify(violation: SpeedViolation): Promise<void>;
}

export class FixedSpeedPolicy implements SpeedPolicy {
  constructor(private readonly limitKmh: number) {}
  limitFor(): number {
    return this.limitKmh;
  }
}

export function detectSpeedViolation(
  message: TrackerMessage,
  policy: SpeedPolicy,
): SpeedViolation | null {
  const limitKmh = policy.limitFor(message);
  if (limitKmh === null || message.speedKmh <= limitKmh) return null;
  return { imei: message.imei, speedKmh: message.speedKmh, limitKmh, at: message.at };
}

export class TrackerHandler {
  constructor(
    private readonly speedPolicy: SpeedPolicy,
    private readonly notifier: ViolationNotifier,
  ) {}

  async handle(message: TrackerMessage): Promise<void> {
    // ... koordinatalarni saqlash ...
    const violation = detectSpeedViolation(message, this.speedPolicy);
    if (violation) await this.notifier.notify(violation);
  }
}
```

Nima investitsiya qilindi va nima qilinmadi:

- **Qilindi:** aniqlash (`detectSpeedViolation`, sof funksiya, testlash oson), siyosat (`SpeedPolicy`) va yetkazish (`ViolationNotifier`) ajratildi. Hozircha `FixedSpeedPolicy(90)` - xatti-harakat bir xil. Hududga bog'liq chegara kelganda yangi `SpeedPolicy` implementatsiyasi yoziladi, `TrackerHandler` o'zgarmaydi.
- **Qilinmadi:** geozona dvigateli, xabarlar navbati, rate limiting. Ular hali talab emas. Throttling kerak bo'lsa, u `ViolationNotifier` ning dekoratori bo'ladi va `handle` ga tegmaydi.

Bu yerda nozik nuqta: ikki interfeys qo'shish - bu bashorat. Agar hududga bog'liq chegara hech qachon kelmasa, `SpeedPolicy` ortiqcha bo'lib qoladi (9-dars). Lekin uning narxi past (bir necha qator) va u aniqlashni testlanadigan qildi. Strategik investitsiya aynan shunday bo'lishi kerak: kichik, arzon va hozir ham foydali.

## Qachon qo'llamaslik kerak

- **Haqiqatan bir martalik kod.** Migratsiya skripti, spike, gipotezani tekshiruvchi prototip. Lekin ularni aniq belgilang, aks holda prototip production'ga "vaqtinchalik" bo'lib o'tadi.
- **Strategik nom ostida spekulyativ arxitektura.** "Kelajak uchun" qurilgan plagin tizimlari, umumiy framework'lar, ortiqcha abstraksiya qatlamlari - bu strategik dasturlash emas. Ousterhout investitsiyani dizayn sifatiga qaratadi, bashorat qilingan feature'larga emas. Bu farq 9-darsda (YAGNI) muhim bo'ladi.
- **Domen hali noma'lum bo'lganda.** Birinchi hafta ichida eng yaxshi dizaynni topishga urinish ko'pincha xato abstraksiya beradi (8-dars). Bu holatda strategik qadam - kodni oddiy va o'zgartirish oson saqlash, "to'g'ri" abstraksiyani kutish.
- **Haqiqiy favqulodda holat.** Production yiqilgan va mijozlar kutmoqda. Avval tuzating, keyin strategik tuzatishni alohida tiket sifatida qiling. Muhimi - "keyin" haqiqatan kelishi.
- **Investitsiya chegarasidan oshish.** 10-20% o'rniga 60% vaqtni sayqalga sarflash ham zarar. Pragmatic Programmer'ning "good enough" g'oyasi shu yerda muvozanat beradi.

## Stack'da: NestJS, React, jamoa

- **NestJS'da strategik qadamlar arzon.** Provider'lar va DI interfeys ajratishni deyarli bepul qiladi. `SpeedPolicy` ni injection token bilan ro'yxatdan o'tkazish ikki qator, lekin bu testlarda va keyingi o'zgarishlarda o'zini qoplaydi (57-dars).
- **React'da taktik naqshlar.** Har bir yangi talab uchun komponentga yangi boolean prop (`showBadge`, `isCompact`, `hideFooter`) qo'shish - klassik taktik yo'l. Strategik muqobil - kompozitsiya: `children` yoki slot prop'lar orqali o'zgaruvchan qismni chaqiruvchiga berish.
- **Code review'da.** "Bu ishlaydimi?" savolidan tashqari "keyingi o'xshash o'zgarish qayerga tushadi?" deb so'rash taktik qarorlarni ko'rinadigan qiladi. Google'ning code review qo'llanmasi ham reviewer'dan kod sog'lig'ini vaqt o'tishi bilan yaxshilab borishni kutadi (96-dars).
- **Sprint baholash.** Strategik investitsiyani alohida "refaktoring" vazifasi sifatida emas, har bir vazifa bahosining ichida hisoblang. Alohida vazifa birinchi bo'lib qisqartiriladi.

## Xulosa

- Taktik dasturlash har bir vazifada tez, lekin kichik murakkabliklarni tizimli ravishda to'playdi va o'z-o'zini kuchaytiradi.
- Tactical tornado'ning tezligi ko'rinadi, narxi esa boshqalarga yoziladi.
- Strategik dasturlash - doimiy kichik investitsiya: Ousterhout bahosi bo'yicha vaqtning taxminan 10-20% i, proaktiv va reaktiv shaklda.
- Pragmatic Programmer'dagi ETC savoli ("bu o'zgartirishni osonlashtiradimi?") strategik qarorlarning kundalik o'lchovi bo'la oladi.
- Strategik dasturlash spekulyativ arxitektura emas: investitsiya dizayn sifatiga, bashorat qilingan feature'larga emas.
