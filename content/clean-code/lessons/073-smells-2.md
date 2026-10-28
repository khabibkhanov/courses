---
n: 73
slug: smells-2
title: "Code smells 2: global data, divergent change, shotgun surgery"
summary: "O'zgarish narxini to'g'ridan-to'g'ri oshiradigan smell'lar: Global Data va Mutable Data (kim o'zgartirganini bilib bo'lmaydi), Divergent Change va Shotgun Surgery (bitta o'zgarish noto'g'ri joylarga tushadi) hamda ular bilan bog'liq Large Class."
duration: 35
sources:
  - id: refactoring
    note: "3-bob \"Bad Smells in Code\": Global Data, Mutable Data, Divergent Change, Shotgun Surgery, Large Class va ularga tavsiya qilingan refaktoringlar"
quiz:
  - q: "Bitta `OrderService` klassini yangi to'lov provayderi qo'shilganda ham, yangi soliq qoidasi kelganda ham, yangi bildirishnoma kanali qo'shilganda ham o'zgartirasiz. Bu qaysi smell?"
    options:
      - "Shotgun Surgery"
      - "Divergent Change"
      - "Feature Envy"
      - "Global Data"
    answer: 1
    explain: "Divergent Change - bitta modul turli, o'zaro bog'liq bo'lmagan sabablarga ko'ra o'zgaradi. Shotgun Surgery buning teskarisi: bitta o'zgarish ko'p modulga tarqaladi."
  - q: "\"Mijoz telefon raqami formati o'zgardi\" degan talab uchun 9 ta faylga tegish kerak bo'ldi. Kitob birinchi navbatda qaysi refaktoringlarni tavsiya qiladi?"
    options:
      - "Extract Class va Extract Superclass"
      - "Encapsulate Variable"
      - "Move Function va Move Field bilan o'zgaradigan narsalarni bitta modulga yig'ish"
      - "Replace Loop with Pipeline"
    answer: 2
    explain: "Shotgun Surgery uchun asosiy vosita - birga o'zgaradigan narsalarni bitta joyga ko'chirish: Move Function va Move Field. Kerak bo'lsa Combine Functions into Class yoki Inline Function/Inline Class bilan avval yig'ib, keyin qayta bo'lish."
  - q: "Global Data uchun kitobning birinchi tavsiyasi qaysi?"
    options:
      - "Global o'zgaruvchini darhol o'chirib, hamma joyga parametr sifatida uzatish"
      - "Encapsulate Variable: ma'lumotni funksiya orqali o'rab, kim o'qishi va o'zgartirishini ko'rish va nazorat qilish"
      - "Uni singleton klassga aylantirish"
      - "Readonly qilish uchun Object.freeze ishlatish"
    answer: 1
    explain: "Encapsulate Variable - birinchi himoya: barcha kirishlar bitta funksiya orqali o'tadi, keyin ko'rinish doirasini qisqartirish mumkin. Singleton global ma'lumotning yana bir shakli, muammoni hal qilmaydi."
  - q: "Quyidagilardan qaysi biri Mutable Data smell'ini kamaytirish uchun tavsiya qilinadi?"
    options:
      - "Replace Derived Variable with Query: hisoblanishi mumkin bo'lgan qiymatni saqlamasdan hisoblash"
      - "Pull Up Field"
      - "Introduce Parameter Object"
      - "Hide Delegate"
    answer: 0
    explain: "Hisoblanadigan qiymatni alohida o'zgaruvchida saqlash ikki manbani sinxron ushlash zaruratini keltirib chiqaradi. Replace Derived Variable with Query bu o'zgaruvchan holatni olib tashlaydi. Kitob bundan tashqari Encapsulate Variable, Split Variable, Separate Query from Modifier, Remove Setting Method va Change Reference to Value'ni ham tavsiya qiladi."
  - q: "Divergent Change'ni tuzatish uchun kitob tavsiya qiladigan Split Phase qaysi holatda eng mos keladi?"
    options:
      - "Funksiya juda ko'p parametr olsa"
      - "Klassda vaqtinchalik maydonlar bo'lsa"
      - "Ikki subklass bir xil metodga ega bo'lsa"
      - "Kod tabiiy ketma-ketlikka ega bo'lsa: masalan, avval tashqi ma'lumotni o'qish, keyin uni qayta ishlash"
    answer: 3
    explain: "Split Phase ishni ikki bosqichga bo'ladi va ular orasida aniq ma'lumot strukturasi bo'ladi. Shunda \"ma'lumot qayerdan keladi\" va \"u bilan nima qilamiz\" turli sabablarga ko'ra mustaqil o'zgara oladi."
  - q: "Klassning maydonlari `gpsLat`, `gpsLng`, `gpsAccuracy`, `fuelLevel`, `fuelSensorId`, `fuelCalibratedAt` ko'rinishida. Large Class nuqtai nazaridan bu nimani ko'rsatadi?"
    options:
      - "Maydon nomlari juda uzun"
      - "Klassni Extract Class bilan bo'lish mumkin: umumiy prefiksli maydonlar alohida komponentga ishora qiladi"
      - "Klassni Inline Class bilan yo'qotish kerak"
      - "Hech narsa, bu oddiy DTO"
    answer: 1
    explain: "Kitob Large Class haqida aytadi: umumiy prefiks yoki suffiksga ega maydonlar ko'pincha alohida komponentga chiqarilishi mumkin bo'lgan guruhni ko'rsatadi. Bu yerda GPS va yoqilg'i sensori - ikki tabiiy klass."
task:
  title: "Global holat va Divergent Change'ni yechish"
  prompt: |
    Quyidagi modul GPS trekerlardan kelgan paketlarni qayta ishlaydi. Unda ikki muammo bor:

    - `settings` - modul darajasidagi o'zgaruvchan global obyekt. Uni har kim o'zgartira oladi va testlar bir-biriga ta'sir qiladi.
    - `handlePacket` ikki sabab bilan o'zgaradi: yangi treker protokoli qo'shilganda (parsing) va yangi biznes qoidasi kelganda (tezlik va geozona tekshiruvi).

    1. Global Data'ni Encapsulate Variable bilan cheklang, keyin konfiguratsiyani tashqaridan uzatiladigan qiling.
    2. Divergent Change'ni Split Phase bilan yeching: parsing va qayta ishlash orasida aniq ma'lumot strukturasi bo'lsin.
    3. Xatti-harakat o'zgarmasin.
  lang: ts
  starter: |
    export const settings = { speedLimitKmh: 90, protocol: "teltonika" as string };

    type Alert = { imei: string; kind: "speeding"; speedKmh: number };

    export function handlePacket(raw: string, alerts: Alert[]): void {
      let imei: string;
      let speed: number;
      if (settings.protocol === "teltonika") {
        const parts = raw.split(";");
        imei = parts[0];
        speed = Number(parts[3]);
      } else {
        const obj = JSON.parse(raw) as { id: string; spd: number };
        imei = obj.id;
        speed = obj.spd;
      }
      if (speed > settings.speedLimitKmh) {
        alerts.push({ imei, kind: "speeding", speedKmh: speed });
      }
    }

    export function setNightMode(): void {
      settings.speedLimitKmh = 70;
    }
  solution: |
    type Protocol = "teltonika" | "json";

    export type TrackerConfig = {
      readonly speedLimitKmh: number;
      readonly protocol: Protocol;
    };

    type Alert = { imei: string; kind: "speeding"; speedKmh: number };

    // Split Phase: parsing natijasi - aniq oraliq struktura
    export type Telemetry = { imei: string; speedKmh: number };

    type Parser = (raw: string) => Telemetry;

    const PARSERS: Record<Protocol, Parser> = {
      teltonika: (raw) => {
        const parts = raw.split(";");
        return { imei: parts[0], speedKmh: Number(parts[3]) };
      },
      json: (raw) => {
        const obj = JSON.parse(raw) as { id: string; spd: number };
        return { imei: obj.id, speedKmh: obj.spd };
      },
    };

    // 1-bosqich: protokolga bog'liq
    export function parsePacket(raw: string, protocol: Protocol): Telemetry {
      return PARSERS[protocol](raw);
    }

    // 2-bosqich: biznes qoidalari, protokolni bilmaydi
    export function detectAlerts(telemetry: Telemetry, speedLimitKmh: number): Alert[] {
      if (telemetry.speedKmh <= speedLimitKmh) return [];
      return [{ imei: telemetry.imei, kind: "speeding", speedKmh: telemetry.speedKmh }];
    }

    export function handlePacket(raw: string, config: TrackerConfig): Alert[] {
      return detectAlerts(parsePacket(raw, config.protocol), config.speedLimitKmh);
    }

    export function nightConfig(config: TrackerConfig): TrackerConfig {
      return { ...config, speedLimitKmh: 70 };
    }
  solutionNotes: |
    - Oraliq qadam (ko'rsatilmagan): avval `settings` ni `getSettings()`/`setSpeedLimit()` funksiyalari bilan o'rab (Encapsulate Variable), barcha kirishlar qayerda ekanini topish kerak. Shundan keyin uni parametrga aylantirish xavfsiz.
    - `settings` endi global emas: `TrackerConfig` readonly va tashqaridan uzatiladi. `setNightMode` mutatsiyasi o'rniga `nightConfig` yangi obyekt qaytaradi (Mutable Data kamaydi).
    - Split Phase: `parsePacket` faqat protokol o'zgarganda, `detectAlerts` faqat biznes qoidasi o'zgarganda o'zgaradi. `Telemetry` - ular orasidagi shartnoma.
    - `alerts` massivini mutatsiya qilish o'rniga natija qaytariladi: chaqiruvchi uni qayerga qo'shishni o'zi hal qiladi. Bu xatti-harakat signaturasini o'zgartiradi, shuning uchun eski `handlePacket(raw, alerts)` ni chaqiruvchilarni ko'chirguncha vaqtincha qoldirish mumkin.
    - Endi `detectAlerts` ni treker paketisiz, oddiy obyekt bilan test qilish mumkin.
  checklist:
    - "Modul darajasida o'zgaruvchan global obyekt qolmadi"
    - "Parsing va biznes qoidasi orasida aniq tip (Telemetry) bor"
    - "Yangi protokol qo'shish faqat PARSERS ga tegadi"
    - "Yangi biznes qoidasi faqat detectAlerts ga tegadi"
    - "Testlar bir-biriga global holat orqali ta'sir qilmaydi"
---

## Muammo

Production'da hodisa: ba'zi mijozlarga tunda tezlik bo'yicha ogohlantirishlar kelmayapti. Sabab bir necha soatlik qidiruvdan keyin topiladi: kimdir uch oy oldin "tungi rejim" funksiyasini qo'shgan va u modul darajasidagi `settings` obyektini o'zgartiradi. Endi qaysi so'rov qaysi chegarani ko'rishi ishga tushish tartibiga bog'liq. Testlarda esa bu ko'rinmaydi, chunki har bir test faylida modul yangidan yuklanadi.

Boshqa hodisa, boshqa jamoa: "telefon raqamini +998 formatida saqlaymiz" degan oddiy talab bir hafta oladi. Raqam formati validatsiyada, SMS servisida, CRM eksportida, frontend formada, uchta hisobotda va ikkita migratsiya skriptida alohida tekshiriladi. Har bir joy topilmaguncha, xatolar production'dan qaytib keladi.

Bu ikki holat bitta umumiy muammoning ikki ko'rinishi: o'zgarish narxi kodning qayerda nima joylashganiga bog'liq. Fowler va Beck bu turdagi muammolarni bir guruh smell'lar bilan tasvirlaydi.

## Asosiy g'oya

Bu darsda beshta smell'ni ko'ramiz. Ular ikki guruhga bo'linadi.

**Holat bilan bog'liq smell'lar:**

- **Global Data** - kodning istalgan joyidan o'qib va o'zgartirib bo'ladigan ma'lumot. Muammo shundaki, uni kim o'zgartirganini topishning yo'li yo'q.
- **Mutable Data** - ma'lumot o'zgarishi kutilmagan oqibatlarga olib keladi: bir joyda qiymat o'zgaradi, boshqa joy esa eski qiymatni kutgan.

**O'zgarish joylashuvi bilan bog'liq smell'lar:**

- **Divergent Change** - bitta modul ko'p turli sabablarga ko'ra o'zgaradi.
- **Shotgun Surgery** - bitta o'zgarish ko'p modullarga mayda tuzatishlar sifatida tarqaladi.
- **Large Class** - juda ko'p ish qilmoqchi bo'lgan klass. Ko'pincha Divergent Change'ning manbai.

Ularning hammasini birlashtiradigan tamoyilni kitob Feature Envy muhokamasida aniq aytadi: birga o'zgaradigan narsalarni birga saqlang. Bu yerdagi smell'lar shu tamoyil buzilganda paydo bo'ladi.

## Chuqurroq: har bir smell va uning vositalari

### Global Data

Mualliflar global ma'lumotni eng zararli smell'lardan biri deb hisoblaydi. Uni kod bazasining istalgan joyidan o'zgartirish mumkin va qaysi kod unga tekkanini aniqlashning mexanizmi yo'q. Bu nafaqat global o'zgaruvchilarga, balki klass o'zgaruvchilari (static field'lar) va singleton'larga ham tegishli.

Asosiy himoya - **Encapsulate Variable**. Ma'lumotni funksiya bilan o'raysiz, endi barcha o'qish va yozish shu funksiya orqali o'tadi. Bu darrov ikki imkon beradi: kim o'zgartirayotganini ko'rish (breakpoint, log) va ko'rinish doirasini qisqartirish (modul ichiga yopish, keyin faqat kerakli joylarga uzatish).

Kitob muhim nozik jihatni ham qayd etadi: global ma'lumotning kichik miqdori boshqarilishi mumkin, lekin miqdor oshgani sari uni nazorat qilish tez qiyinlashadi. O'zgarmas global ma'lumot (konstanta) esa ancha kam xavfli: agar uni hech kim o'zgartira olmasa, "kim o'zgartirdi" degan savol yo'q.

### Mutable Data

Ma'lumotni o'zgartirish ba'zan kutilmagan xatolarga olib keladi: kodning bir qismi qiymatni o'zgartiradi, boshqa qismi esa eski qiymatga tayangan. Bunday xatolar ayniqsa kamdan-kam shartlarda yuzaga chiqadi va topilishi qiyin. Xavf o'zgaruvchining ko'rinish doirasi bilan birga o'sadi.

Kitob bu smell uchun keng vositalar to'plamini beradi:

- **Encapsulate Variable** - o'zgartirishlar bitta funksiya orqali o'tsin.
- **Split Variable** - bitta o'zgaruvchi turli maqsadlarda qayta yozilsa, har bir maqsad uchun alohida o'zgaruvchi.
- **Slide Statements** va **Extract Function** - yangilanish mantiqini side effect'siz koddan ajratish.
- **Separate Query from Modifier** - qiymat qaytaradigan funksiya holatni o'zgartirmasin (24-dars).
- **Remove Setting Method** - o'zgarmasligi kerak bo'lgan maydonning setter'ini olib tashlash.
- **Replace Derived Variable with Query** - hisoblanishi mumkin bo'lgan qiymatni saqlamang, kerak bo'lganda hisoblang.
- **Combine Functions into Class** yoki **Combine Functions into Transform** - ma'lumotni yangilaydigan kodni cheklash.
- **Change Reference to Value** - ichki tuzilmani joyida o'zgartirish o'rniga, butun qiymatni almashtirish.

Bu smell 2-nashrda yangi. Uning paydo bo'lishi funksional dasturlash g'oyalarining asosiy oqimga kirib kelishini aks ettiradi: immutable ma'lumot bilan ishlash ko'p turdagi xatolarni umuman mumkin bo'lmagan qiladi (25-dars).

### Divergent Change

Biz dasturiy ta'minotni o'zgarishi oson bo'lishi uchun tuzamiz. O'zgarish kerak bo'lganda, bitta aniq joyga borib, o'sha yerni o'zgartirishni xohlaymiz. Divergent Change - bitta modul turli sabablarga ko'ra turli yo'llar bilan o'zgarganda. Kitobdagi misol ruhida: "yangi ma'lumotlar bazasi qo'shilganda shu uchta funksiyani, yangi moliyaviy instrument qo'shilganda esa boshqa to'rttasini o'zgartiraman" desangiz, bu Divergent Change.

Bu smell 53-darsdagi Single Responsibility Principle bilan chambarchas bog'liq: modulning o'zgarishi uchun bir nechta "aktor" bor.

Tavsiya qilinadigan refaktoringlar:

- **Split Phase** - kod tabiiy ketma-ketlikka ega bo'lsa (ma'lumotni olish, keyin qayta ishlash), ikki bosqichni aniq oraliq ma'lumot strukturasi bilan ajratish.
- **Move Function** - qayta ishlash oldinga-orqaga chaqiruvlar bilan aralashgan bo'lsa, modullarni ajratish.
- **Extract Function** - funksiya ikki turdagi ishni aralashtirsa, avval ajratib, keyin ko'chirish.
- **Extract Class** - modullar klass bo'lsa, klassni ikkiga bo'lish.

### Shotgun Surgery

Divergent Change'ning teskarisi. Har safar biror o'zgarish qilganda, ko'p turli klasslarda ko'p mayda tuzatishlar kiritishga to'g'ri keladi. O'zgarishlar tarqoq bo'lganda ularni topish qiyin va muhim birini o'tkazib yuborish oson.

Tavsiya qilinadigan refaktoringlar:

- **Move Function** va **Move Field** - barcha o'zgarishlarni bitta modulga yig'ish.
- **Combine Functions into Class** - o'xshash ma'lumot bilan ishlaydigan funksiyalar uchun.
- **Combine Functions into Transform** - ma'lumot strukturasini boyitadigan funksiyalar uchun.
- **Split Phase** - umumiy funksiyalar natijasini keyingi bosqich iste'mol qila olsa.
- **Inline Function** va **Inline Class** - kitobning qiziq maslahati: yomon ajratilgan mantiqni avval bitta joyga yig'ing, hatto bu vaqtincha Long Function yoki Large Class yaratsa ham. Keyin uni to'g'ri chegaralar bo'yicha qayta bo'ling.

Oxirgi maslahat muhim. Ko'p dasturchilar "katta funksiya yomon" deb, noto'g'ri bo'lingan kodni yanada maydalaydi. Ba'zan to'g'ri yo'l - avval birlashtirish, keyin to'g'ri bo'lish.

### Large Class

Juda ko'p ish qilmoqchi bo'lgan klassda odatda juda ko'p maydon bo'ladi, ko'p maydon bo'lgan joyda esa takror ham paydo bo'ladi. Kitob amaliy belgilarni beradi: umumiy prefiks yoki suffiksli maydonlar (masalan, `depositAmount`, `depositCurrency`) alohida komponentga chiqarish nomzodi. Faqat ba'zi holatlarda ishlatiladigan maydonlar ham shunday.

Yana bir foydali evristika: klassdan qanday foydalanilishiga qarang. Agar mijozlar klass funksiyalarining faqat bir qismini ishlatsa, har bir guruh alohida klass uchun nomzod.

Tavsiya qilinadigan refaktoringlar: **Extract Class**, **Extract Superclass** va **Replace Type Code with Subclasses**. Klass ichidagi takrorni olib tashlash ko'pincha eng oddiy birinchi qadam. Klass o'lchami haqidagi kengroq muhokama 59-darsda.

## Misol: Shotgun Surgery'dan bitta modulga

Ijara platformasida narx valyutasi masalasi. Hozirgi holat:

```ts
// listing.controller.ts
const priceText = `${Math.round(listing.priceTiyin / 100).toLocaleString("ru-RU")} so'm`;

// invoice.service.ts
const amountText = (invoice.totalTiyin / 100).toFixed(0) + " so'm";

// sms.service.ts
const msg = `To'lov: ${Math.floor(payment.tiyin / 100)} UZS`;

// export.ts
row.push(String(contract.monthlyTiyin / 100));
```

Talab: "USD'dagi e'lonlarni qo'llab-quvvatlaymiz". Endi har bir joyda valyuta tekshiruvi qo'shish kerak va ular allaqachon bir-biridan farq qiladi: biri `round`, biri `floor`, biri `toFixed`. Bu Shotgun Surgery, va u allaqachon xatoga olib kelgan (yaxlitlash nomuvofiq).

Move Function va Combine Functions into Class bilan pulni bitta joyga yig'amiz:

```ts
export type Currency = "UZS" | "USD";

export class Money {
  private constructor(
    readonly minorUnits: bigint,
    readonly currency: Currency,
  ) {}

  static of(minorUnits: bigint, currency: Currency): Money {
    return new Money(minorUnits, currency);
  }

  format(): string {
    const major = Number(this.minorUnits) / 100;
    if (this.currency === "USD") return `$${major.toFixed(2)}`;
    return `${Math.round(major).toLocaleString("ru-RU")} so'm`;
  }

  toExportValue(): string {
    return (Number(this.minorUnits) / 100).toFixed(2);
  }
}
```

Endi chaqiruvchilar `listing.price.format()` yozadi. Yangi valyuta qo'shish - bitta faylga tegish. Muhim qaror: qaysi yaxlitlash "to'g'ri" ekanini tanlash xatti-harakat o'zgarishi. Refaktoring paytida har bir joyning eski xatti-harakatini saqlash kerak (masalan, SMS uchun alohida `formatForSms()` qoldirish), keyin biznes bilan kelishib, alohida commit'da birlashtirish.

Bu misol shuningdek 74-darsdagi Primitive Obsession'ni ham tuzatadi: `number` tiyinlar o'rniga valyutani biladigan tip. Smell'lar ko'pincha birga keladi.

## Qachon qo'llamaslik kerak

- **Haqiqiy global kontekst.** Logger, konfiguratsiya, feature flag'lar - bularni har bir funksiyaga parametr sifatida uzatish shovqin. To'g'ri yo'l - ularni o'zgarmas qilish va DI orqali berish, lekin "global data bo'lmasin" deb har bir chaqiruvga `logger` ni qo'shish ortiqcha.
- **Mahalliy mutatsiya.** Funksiya ichida yaratilib, tashqariga chiqmaydigan massivni `push` bilan to'ldirish Mutable Data smell'i emas. Xavf ko'rinish doirasi bilan o'sadi, kichik doirada mutatsiya ko'pincha eng o'qiladigan yechim.
- **Performance.** Katta ma'lumot strukturalarini har o'zgarishda nusxalash (immutable yondashuv) qimmat bo'lishi mumkin. Avval o'lchang (99-dars).
- **Divergent Change'ni erta ko'rish.** Modul hali ikki marta o'zgargan bo'lsa, uni "ehtimoliy" o'zgarish o'qlari bo'yicha bo'lish Speculative Generality'ga (75-dars) olib keladi. Haqiqiy o'zgarish naqshini kuting.
- **Kross-kesuvchi talablar.** Ba'zi o'zgarishlar tabiatan ko'p joyga tegadi (masalan, barcha endpoint'larga audit log qo'shish). Bunday holatda Shotgun Surgery'ni tuzatish yo'li "bitta modul" emas, middleware yoki interceptor kabi mexanizm.

## Stack'da: Node.js, NestJS, React

- **Node.js modul holati.** `export let cache = new Map()` - modul darajasidagi global data. Node modul keshlashi tufayli u butun jarayon uchun yagona va testlar orasida saqlanib qoladi. NestJS'da buning o'rniga provider ishlating: DI konteyner uning hayot siklini boshqaradi va testda uni almashtirish oson.
- **NestJS servislari.** Default scope'dagi provider singleton. Unga so'rovga xos ma'lumotni maydon sifatida yozish (`this.currentUser = ...`) - Global Data va Mutable Data birgalikda, va concurrent so'rovlarda xato beradi. Bunday ma'lumotni parametr sifatida yoki request-scoped provider orqali bering.
- **React state.** Global store'da (Redux, Zustand) hamma narsani saqlash Global Data'ning frontend ko'rinishi. React hujjatlari state'ni uni ishlatadigan eng yaqin umumiy ota komponentda saqlashni tavsiya qiladi.
- **TypeScript `readonly`.** `readonly` maydonlar va `ReadonlyArray` Mutable Data'ga qarshi arzon himoya. `as const` bilan konfiguratsiya obyektlarini o'zgarmas qiling.

## Xulosa

- Global Data va Mutable Data muammosi bitta: qiymatni kim va qachon o'zgartirganini bilib bo'lmaydi. Birinchi vosita - Encapsulate Variable, keyin ko'rinish doirasini qisqartirish.
- Mutable Data 2-nashrda yangi smell. Replace Derived Variable with Query, Separate Query from Modifier va Change Reference to Value uning asosiy davolari.
- Divergent Change: bitta modul ko'p sababga ko'ra o'zgaradi. Split Phase, Move Function va Extract Class bilan ajrating.
- Shotgun Surgery: bitta o'zgarish ko'p joyga tarqaladi. Move Function va Move Field bilan yig'ing, kerak bo'lsa avval Inline qilib, keyin qayta bo'ling.
- Large Class ko'pincha Divergent Change manbai: umumiy prefiksli maydonlar va mijozlarning qisman foydalanishi bo'linish chizig'ini ko'rsatadi.
