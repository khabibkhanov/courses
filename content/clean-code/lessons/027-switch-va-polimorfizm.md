---
n: 27
slug: switch-va-polimorfizm
title: "switch/if zanjirlari: polimorfizm, lookup jadval, discriminated union"
summary: "Bir xil tip bo'yicha switch kodda takrorlanganda har bir yangi holat ko'p joyni o'zgartirishni talab qiladi. Uchta yechim: Replace Conditional with Polymorphism, lookup jadval va TypeScript'ning discriminated union'i bilan exhaustive never tekshiruvi. Har birining qachon mos kelishi va expression problem."
duration: 40
sources:
  - id: cc1
    note: "3-bob \"Functions\": \"Switch Statements\" bo'limi - switch'ni abstract factory ortiga yashirish; 6-bobdagi obyekt va ma'lumot strukturalari ziddiyati"
  - id: refactoring-catalog
    note: "Replace Conditional with Polymorphism, Replace Type Code with Subclasses, Repeated Switches smell'i"
  - id: refactoring
    note: "Code smell'lar bobidagi Repeated Switches va Replace Conditional with Polymorphism bo'limi"
  - id: effective-ts
    note: "Tagged (discriminated) union'lar, exhaustiveness tekshiruvi va noto'g'ri holatlarni ifodalab bo'lmaydigan tiplar"
quiz:
  - q: "Martinning switch haqidagi asosiy e'tirozi nima?"
    options:
      - "switch sekin ishlaydi"
      - "Bir xil tip bo'yicha switch ko'p joyda takrorlanadi va yangi tip qo'shilganda hammasini topib o'zgartirish kerak"
      - "switch TypeScript'da ishlamaydi"
      - "switch'da break unutiladi"
    answer: 1
    explain: "Martin switch'ni butunlay taqiqlamaydi: u bir marta, polimorf obyektlarni yaratish uchun, abstract factory ichida qolishini qabul qiladi. Asosiy muammo takrorlanish va har yangi tipda ko'p joyni o'zgartirish."
  - q: "Quyidagi kodda `assertNever(x)` chaqiruvi qanday vazifani bajaradi?\n\n```ts\nswitch (event.kind) {\n  case \"refuel\": ...\n  case \"drain\": ...\n  default: return assertNever(event);\n}\n```"
    options:
      - "Runtime'da barcha holatlarni loglaydi"
      - "Switch'ni tezlashtiradi"
      - "Union'ga yangi variant qo'shilib, u case'da ko'rib chiqilmasa, kompilyatsiya xatosi beradi, chunki event `never`ga toraymaydi"
      - "Default holatni null qaytaradi"
    answer: 2
    explain: "Barcha variantlar ko'rib chiqilganda default tarmoqda event tipi never bo'ladi. Yangi variant qo'shilsa, u never emas va uni `never` parametrga uzatish tip xatosi. Bu exhaustiveness tekshiruvi; u runtime'da ham kutilmagan qiymatda xato tashlaydi."
  - q: "Expression problem nuqtai nazaridan discriminated union va klass ierarxiyasi qanday farqlanadi?"
    options:
      - "Union yangi operatsiya qo'shishni osonlashtiradi, ierarxiya yangi tip qo'shishni"
      - "Ikkalasi bir xil, farq faqat sintaksisda"
      - "Ierarxiya yangi operatsiya qo'shishni osonlashtiradi, union yangi tip qo'shishni"
      - "Union faqat frontend uchun, ierarxiya faqat backend uchun"
    answer: 0
    explain: "Union bilan yangi funksiya bitta joyda yoziladi va mavjud tiplarga tegmaydi, lekin yangi variant barcha switch'larni o'zgartiradi (kompilyator ularni ko'rsatadi). Ierarxiyada aksincha. Martin ham obyektlar va ma'lumot strukturalari ziddiyatida shu trade-off'ni tasvirlaydi."
  - q: "Qaysi holatda lookup jadval (`Record<Kind, Value>`) switch yoki polimorfizmdan yaxshiroq?"
    options:
      - "Har bir holat murakkab, ko'p qadamli mantiqqa ega bo'lsa"
      - "Holatlar runtime'da plaginlar orqali qo'shilsa"
      - "Har bir holat uchun turli dependency'lar inject qilinishi kerak bo'lsa"
      - "Har bir holat faqat qiymat yoki konfiguratsiya bilan farq qilsa (tarif, label, rang, limit)"
    answer: 3
    explain: "Holatlar faqat ma'lumot bilan farq qilsa, jadval eng sodda: mantiq yo'q, faqat moslik. `Record<Kind, ...>` tipi barcha kalitlar mavjudligini ham tekshiradi. Murakkab xatti-harakat yoki dependency'lar uchun polimorfizm mos."
  - q: "Kodda `vehicle.type` bo'yicha bitta switch bor va u faqat bir joyda ishlatiladi. Uni Replace Conditional with Polymorphism bilan klass ierarxiyasiga aylantirish kerakmi?"
    options:
      - "Ha, switch har doim code smell"
      - "Ha, chunki Martin barcha switch'larni taqiqlaydi"
      - "Odatda yo'q: bitta, takrorlanmagan switch o'qilishi oson va ierarxiya faqat qo'shimcha fayllar va sakrashlar qo'shadi"
      - "Faqat case'lar 2 tadan ko'p bo'lsa"
    answer: 2
    explain: "Fowler smell sifatida takrorlanadigan switch'larni (Repeated Switches) ko'rsatadi. Bitta switch bitta joyda bo'lsa, polimorfizmning asosiy foydasi (bitta o'zgarish nuqtasi) allaqachon mavjud."
  - q: "Discriminated union'da tegning (`kind` maydoni) roli nima?"
    options:
      - "U runtime'da tipni o'zgartiradi"
      - "U literal tipga ega umumiy maydon bo'lib, TypeScript uni tekshirib union'ni aniq variantga toraytiradi (narrowing)"
      - "U faqat JSON serializatsiya uchun kerak"
      - "U klasslar o'rtasida meros yaratadi"
    answer: 1
    explain: "Har bir variantda bir xil nomli, lekin turli literal qiymatli maydon bo'lgani uchun `if (e.kind === \"drain\")` dan keyin TypeScript aynan drain variantining maydonlarini ochadi. Bu union bilan xavfsiz ishlashning asosi."
task:
  title: "Takroriy switch'larni discriminated union va jadvalga aylantirish"
  prompt: |
    Transport parki dasturida telemetriya hodisalari uch turda keladi va ular bo'yicha switch ikki joyda takrorlanadi. Hodisa tipi optional maydonli bitta keng tip bilan ifodalangan, shuning uchun `speedKmh` va `liters` maydonlari har doim `?` bilan o'qiladi va yangi tip qo'shilganda biror switch unutilib qolgan.

    1. `TelemetryEvent`ni discriminated union'ga aylantiring: har bir variant faqat o'ziga tegishli maydonlarga ega bo'lsin.
    2. Faqat ma'lumot bilan farq qiladigan qismni (sarlavha va jiddiylik darajasi) lookup jadvalga chiqaring.
    3. Mantiqqa ega qismda (`describe`) exhaustive switch va `assertNever` ishlating.
    4. Yangi `geofence-exit` turi qo'shib, kompilyator qaysi joylarni ko'rsatishini tekshiring.
  lang: ts
  starter: |
    type TelemetryEvent = {
      kind: string;
      vehicleId: string;
      at: Date;
      speedKmh?: number;
      liters?: number;
      zoneName?: string;
    };

    export function severity(e: TelemetryEvent): number {
      switch (e.kind) {
        case "overspeed":
          return 2;
        case "fuel-drain":
          return 3;
        case "ignition-on":
          return 1;
        default:
          return 0;
      }
    }

    export function describe(e: TelemetryEvent): string {
      if (e.kind === "overspeed") return `Tezlik oshdi: ${e.speedKmh ?? "?"} km/soat`;
      if (e.kind === "fuel-drain") return `Yoqilg'i to'kildi: ${e.liters ?? "?"} l`;
      if (e.kind === "ignition-on") return "O't oldirish yoqildi";
      return "Noma'lum hodisa";
    }
  solution: |
    type BaseEvent = { vehicleId: string; at: Date };

    export type TelemetryEvent =
      | (BaseEvent & { kind: "overspeed"; speedKmh: number; limitKmh: number })
      | (BaseEvent & { kind: "fuel-drain"; liters: number })
      | (BaseEvent & { kind: "ignition-on" })
      | (BaseEvent & { kind: "geofence-exit"; zoneName: string });

    export type TelemetryKind = TelemetryEvent["kind"];

    type Severity = 1 | 2 | 3;

    const EVENT_META = {
      overspeed: { title: "Tezlik oshdi", severity: 2 },
      "fuel-drain": { title: "Yoqilg'i to'kildi", severity: 3 },
      "ignition-on": { title: "O't oldirish yoqildi", severity: 1 },
      "geofence-exit": { title: "Hududdan chiqdi", severity: 2 },
    } as const satisfies Record<TelemetryKind, { title: string; severity: Severity }>;

    export function severity(e: TelemetryEvent): Severity {
      return EVENT_META[e.kind].severity;
    }

    export function assertNever(value: never): never {
      throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
    }

    export function describe(e: TelemetryEvent): string {
      const title = EVENT_META[e.kind].title;
      switch (e.kind) {
        case "overspeed":
          return `${title}: ${e.speedKmh} km/soat (chegara ${e.limitKmh})`;
        case "fuel-drain":
          return `${title}: ${e.liters} l`;
        case "ignition-on":
          return title;
        case "geofence-exit":
          return `${title}: ${e.zoneName}`;
        default:
          return assertNever(e);
      }
    }
  solutionNotes: |
    - Keng tip optional maydonlar bilan "overspeed hodisasida liters bor" kabi noqonuniy holatlarga ruxsat berardi. Union'da har bir variant faqat o'z maydonlariga ega va `e.speedKmh` narrowing'dan keyin `number`, `?? "?"` kerak emas.
    - `kind: string` edi, shuning uchun xato yozilgan tur (`"overspead"`) default tarmoqqa jimgina tushardi. Literal union buni kompilyatsiya xatosiga aylantirdi.
    - `severity` faqat ma'lumot edi, shuning uchun lookup jadvalga ko'chdi. `satisfies Record<TelemetryKind, ...>` yangi tur qo'shilganda jadvalda kalit yo'qligini ko'rsatadi.
    - `describe` har variantning o'z maydonlarini ishlatadi, shuning uchun switch qoldi va `assertNever` bilan exhaustive qilindi.
    - `geofence-exit` qo'shilganda kompilyator ikkita joyni ko'rsatadi: jadval va switch. Starter kodda esa ikkala funksiya ham jimgina default qaytarardi.
    - Klass ierarxiyasini tanlamadik: hodisalar tashqaridan JSON sifatida keladigan ma'lumot va ularga yangi operatsiyalar (hisobot, eksport) tez-tez qo'shiladi.
  checklist:
    - "Union'ning har bir varianti faqat o'ziga tegishli maydonlarga ega"
    - "Faqat qiymat bilan farq qiladigan qism jadvalda va jadval barcha turlarni qamrashi tip darajasida tekshiriladi"
    - "Mantiqli switch exhaustive va default tarmoqda assertNever bor"
    - "Yangi tur qo'shilganda kompilyator barcha o'zgartirilishi kerak bo'lgan joylarni ko'rsatadi"
    - "Kodda kind uchun string tipi yoki noma'lum holat uchun jim default qolmadi"
---

## Muammo

Loyiha boshida `switch (payment.method)` bitta joyda paydo bo'ladi: narx hisoblashda. Keyin u komissiya hisoblashda, keyin chek chiqarishda, keyin qaytarish mantiqida, keyin hisobotlarda takrorlanadi. Bir yildan keyin yangi to'lov usuli (masalan, bo'lib to'lash) qo'shilganda dasturchi oltita switch'dan beshtasini topadi. Oltinchisi `default` tarmog'iga tushib, jimgina noto'g'ri komissiya hisoblaydi, va bu oy oxiridagi buxgalteriya hisobotida aniqlanadi.

Bu muammoning ildizi switch'ning o'zi emas, balki **bir xil tushuncha bo'yicha qarorning ko'p joyga sochilgani**. Har bir yangi holat ko'p faylni o'zgartirishni talab qiladi va kompilyator qaysi joy unutilganini aytmaydi.

## Asosiy g'oya

### Martin: switch'ni bir joyga yashiring

Martin *Clean Code*ning funksiyalar bobida switch'ni ochiq tanqid qiladi: switch tabiatan N ta ish qiladi, demak "bitta ish" qoidasini buzadi. U xodim tipi bo'yicha ish haqi hisoblaydigan funksiya misolini keltiradi va undagi muammolarni sanaydi: yangi tip qo'shilganda funksiya o'sadi, u bir nechta ish qiladi, SRP va OCP'ni buzadi, va eng yomoni - xuddi shunday tuzilishga ega boshqa funksiyalar ham cheksiz ko'payadi (`isPayday`, `deliverPay` va hokazo).

Martinning yechimi: switch'ni **abstract factory** ichiga ko'mib qo'yish. Factory switch yordamida tegishli polimorf obyektni bir marta yaratadi, keyin qolgan barcha operatsiyalar interfeys orqali polimorf chaqiriladi. U bu qoidani mutlaq deb hisoblamaydi: switch bir marta paydo bo'lsa, polimorf obyektlarni yaratish uchun ishlatilsa va meros zanjiri ortida yashirilsa, uni qabul qiladi.

### Fowler: Replace Conditional with Polymorphism

Fowler'ning katalogida bu yo'nalishdagi asosiy refaktoring **Replace Conditional with Polymorphism**: tip bo'yicha shart o'rniga har bir tip uchun klass va umumiy metod. Yaqin refaktoring **Replace Type Code with Subclasses**. *Refactoring*ning ikkinchi nashrida Fowler smell'ni aniqroq nomlaydi: **Repeated Switches** - bir xil shart bo'yicha switch yoki if/else zanjiri bir necha joyda takrorlanishi. U bitta switch'ni muammo deb hisoblamaydi; muammo takrorlanishda, chunki u yangi holat qo'shilganda barcha nusxalarni topishni talab qiladi.

### TypeScript: discriminated union va exhaustiveness

TypeScript uchinchi yo'lni beradi, u ko'pincha polimorfizmdan ham qulayroq. **Discriminated union** (tagged union) - har bir variantda bir xil nomli, lekin turli literal qiymatli maydon (teg) bor bo'lgan union tip. TypeScript tegni tekshirgandan keyin tipni aniq variantga toraytiradi. Vanderkam *Effective TypeScript*da bunday tagged union'larni holatni modellashtirishning asosiy vositasi sifatida tavsiya qiladi.

Asosiy afzallik - **exhaustiveness tekshiruvi**: switch'ning `default` tarmog'ida qiymatni `never` tipidagi parametrga uzatsangiz, union'ga yangi variant qo'shilganda va u ko'rib chiqilmaganda kompilyator xato beradi. Shunday qilib, takroriy switch'lar muammosi boshqacha hal bo'ladi: switch'lar ko'p joyda qolishi mumkin, lekin kompilyator har birini ko'rsatadi.

## Chuqurroq: uchta yechim va expression problem

### Expression problem

Uchta yondashuv orasidagi tanlov ma'lum trade-off'ga tayanadi, uni dasturlash tillari nazariyasida expression problem deb atashadi. Bizda tiplar (to'lov usullari) va operatsiyalar (narx, komissiya, chek) jadvali bor. Yangi tip yoki yangi operatsiya qo'shish kerak bo'ladi.

- **Polimorfizm (klass ierarxiyasi):** yangi tip qo'shish oson - bitta yangi klass, mavjud kodga tegilmaydi. Yangi operatsiya qo'shish qiyin - barcha klasslarga yangi metod.
- **Discriminated union va funksiyalar:** yangi operatsiya qo'shish oson - bitta yangi funksiya, bitta joyda. Yangi tip qo'shish barcha switch'larni o'zgartiradi, lekin kompilyator ularni ko'rsatadi.

Martin 6-bobda (obyektlar va ma'lumot strukturalari) xuddi shu ziddiyatni tasvirlaydi: protsedurali kod yangi funksiya qo'shishni, OO kod yangi klass qo'shishni osonlashtiradi. Qaysi biri tez-tez o'zgarishini bilish tanlovni belgilaydi (41-dars).

### Qachon qaysi biri

- **Lookup jadval** - holatlar faqat **ma'lumot** bilan farq qilsa: tarif, label, rang, limit, ikona. `Record<Kind, Value>` tipi har bir kalit mavjudligini tekshiradi. Bu eng sodda variant va ko'pincha e'tibordan chetda qoladi.
- **Discriminated union + exhaustive switch** - holatlar ma'lumot sifatida tashqaridan keladi (API javobi, DB qatori, telemetriya, Redux action), ularda turli maydonlar bor va ularga yangi operatsiyalar tez-tez qo'shiladi. TS'da bu odatda standart tanlov.
- **Polimorfizm** - har bir holat murakkab xatti-harakatga, o'z dependency'lariga yoki holatiga ega va yangi turlar operatsiyalardan tezroq qo'shiladi. Masalan, to'lov provayderlari (Payme, Click, Uzum): har biri o'z HTTP klienti, imzo algoritmi va xato kodlariga ega. NestJS'da ular umumiy interfeysni amalga oshiradigan provider'lar bo'ladi (57-dars).

### Exhaustiveness'ning ikki usuli

`assertNever` funksiyasi bilan bir qatorda boshqa usullar ham bor. `satisfies Record<Kind, ...>` jadvallar uchun exhaustiveness beradi. Funksiyaning qaytarish tipini aniq ko'rsatsangiz va `default` yo'q bo'lsa, `strict` rejimda barcha holatlar qaytarmasa, TypeScript "not all code paths return a value" yoki tip xatosini beradi, lekin bu kamroq ishonchli. `typescript-eslint`ning `switch-exhaustiveness-check` qoidasi esa lint darajasida tekshiradi.

`assertNever` runtime'da ham foydali: agar tashqaridan noma'lum `kind` kelsa (API yangi tur qo'shgan, lekin frontend yangilanmagan), u jimgina noto'g'ri natija bermaydi, aniq xato tashlaydi. Bu tashqi ma'lumot har doim chegarada validatsiya qilinishi kerakligini ham eslatadi (zod bilan, 45-dars).

## Misol: to'lov komissiyasi

Takrorlanadigan switch'lar:

```ts
type Payment = { method: string; amount: number; installments?: number; cardBin?: string };

export function commission(p: Payment): number {
  switch (p.method) {
    case "cash": return 0;
    case "card": return p.amount * 0.015;
    case "installment": return p.amount * 0.04 * (p.installments ?? 1);
    default: return 0;
  }
}

export function receiptLabel(p: Payment): string {
  switch (p.method) {
    case "cash": return "Naqd";
    case "card": return "Karta";
    default: return "Boshqa";
  }
}
```

`receiptLabel`da `installment` allaqachon unutilgan va `default` buni yashirgan. Union va jadval bilan:

```ts run
type Payment =
  | { method: "cash"; amount: number }
  | { method: "card"; amount: number; cardBin: string }
  | { method: "installment"; amount: number; months: 3 | 6 | 12 };

type PaymentMethod = Payment["method"];

const RECEIPT_LABEL = {
  cash: "Naqd",
  card: "Karta",
  installment: "Bo'lib to'lash",
} as const satisfies Record<PaymentMethod, string>;

const CARD_RATE = 0.015;
const INSTALLMENT_MONTHLY_RATE = 0.04;

function assertNever(value: never): never {
  throw new Error(`Unexpected payment: ${JSON.stringify(value)}`);
}

export function commission(p: Payment): number {
  switch (p.method) {
    case "cash":
      return 0;
    case "card":
      return p.amount * CARD_RATE;
    case "installment":
      return p.amount * INSTALLMENT_MONTHLY_RATE * p.months;
    default:
      return assertNever(p);
  }
}

export function receiptLabel(p: Payment): string {
  return RECEIPT_LABEL[p.method];
}

// Sinab ko'ring: to'lov usulini yoki muddatini o'zgartiring.
const payments: Payment[] = [
  { method: "cash", amount: 500_000 },
  { method: "card", amount: 500_000, cardBin: "860002" },
  { method: "installment", amount: 500_000, months: 6 },
];
for (const p of payments) console.log(`${receiptLabel(p)}: ${commission(p)} so'm`);
```

Nima o'zgardi:

- **Jim `default` yo'qoldi.** Yangi usul qo'shilsa, kompilyator `commission`dagi switch'ni va `RECEIPT_LABEL` jadvalini ko'rsatadi.
- **Optional maydonlar yo'q.** `months` faqat bo'lib to'lashda bor va uning qiymatlari cheklangan; `?? 1` kabi taxminlar kerak emas.
- **Ma'lumot va mantiq ajraldi.** Label - jadval, komissiya - mantiq.
- **Klass ierarxiyasi kerak bo'lmadi.** To'lov - ma'lumot, unga operatsiyalar qo'shiladi. Agar har bir usulning o'z provayderi va tarmoq chaqiruvlari bo'lsa, polimorf provider'lar to'g'ri tanlov bo'lardi.

## Qachon qo'llamaslik kerak

- **Bitta, takrorlanmagan switch.** Bitta joydagi switch'ni klass ierarxiyasiga aylantirish fayllar va sakrashlarni ko'paytiradi, foyda bermaydi. Fowler smell sifatida takrorlanishni ko'rsatadi, switch'ning o'zini emas.
- **Ochiq to'plamlar.** Agar turlar runtime'da plaginlar yoki konfiguratsiya orqali qo'shilsa (masalan, foydalanuvchi o'zi qo'shadigan hisobot turlari), yopiq union mos kelmaydi. Bu yerda registry va polimorf interfeys kerak.
- **Polimorfizmni ma'lumotga majburlash.** API'dan kelgan JSON'ni faqat switch'dan qochish uchun klass instansiyalariga aylantirish ko'pincha ortiqcha mapping qatlamini qo'shadi.
- **Jadvalga mantiq tiqish.** Lookup jadval qiymatlari funksiyalarga aylanib, ular turli dependency'lar va murakkab shartlarni o'z ichiga olsa, bu yashirin polimorfizm, faqat tip xavfsizligi va nomlarsiz.
- **`assertNever`siz switch.** `default: return 0` kabi jim fallback discriminated union'ning asosiy foydasini yo'q qiladi.

## Stack'da: NestJS, React, Redux

- **NestJS strategiyalari.** To'lov provayderlari, bildirishnoma kanallari (SMS, Telegram, email) kabi murakkab variantlar uchun umumiy interfeys va provider'lar. Tanlovni bitta factory yoki `Map<Method, Provider>` bajaradi, bu Martinning "switch faqat factory'da" g'oyasining DI versiyasi.
- **React komponent tanlash.** `status` bo'yicha turli komponentlarni ko'rsatish uchun `const VIEW: Record<Status, ComponentType<Props>>` jadvali yoki exhaustive switch. Ko'p `{status === "a" && ...}{status === "b" && ...}` qatorlari takroriy shartning JSX versiyasi.
- **Reducer'lar va action'lar.** `useReducer` action'lari tabiiy discriminated union. Reducer'dagi switch'ga `assertNever` qo'shing.
- **Holat mashinalari.** Remote data holati (`idle | loading | success | error`) union bilan ifodalanganda `isLoading`, `error`, `data` uchta mustaqil maydonidan ko'ra noqonuniy kombinatsiyalarga yo'l qo'ymaydi (45-dars).
- **API chegarasi.** Union'ni tashqi ma'lumotga ishonib qo'llamang: zod'ning `discriminatedUnion` sxemasi bilan validatsiya qiling.

## Xulosa

- Muammo switch'ning o'zi emas, bir xil tushuncha bo'yicha switch'ning takrorlanishi va jim `default`.
- Martin switch'ni factory ichida bir marta qoldirib, qolganini polimorfizmga topshirishni taklif qiladi; Fowler Replace Conditional with Polymorphism va Repeated Switches smell'ini beradi.
- TypeScript'da discriminated union va `assertNever` bilan exhaustive switch kompilyatorni yangi holatlar uchun nazoratchiga aylantiradi.
- Faqat ma'lumot bilan farq qiladigan holatlar uchun `satisfies Record<Kind, ...>` jadvali eng sodda yechim.
- Tanlov expression problem'ga bog'liq: yangi operatsiyalar tez-tez qo'shilsa union, yangi turlar va murakkab xatti-harakat bo'lsa polimorfizm.
