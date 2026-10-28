---
n: 74
slug: smells-3
title: "Code smells 3: feature envy, data clumps, takroriy switch"
summary: "Ma'lumot va xatti-harakat noto'g'ri joylashganda paydo bo'ladigan smell'lar: Feature Envy, Data Clumps, Primitive Obsession, Data Class, Repeated Switches va Loops. Hammasining markazida bitta savol: bu mantiq qaysi ma'lumot yonida yashashi kerak?"
duration: 35
sources:
  - id: refactoring
    note: "3-bob \"Bad Smells in Code\": Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Loops, Data Class va 1-nashrdagi \"Switch Statements\" smell'idan farqi"
quiz:
  - q: "`InvoiceService.lateFee(contract)` metodi `contract.dueDate`, `contract.monthlyRent`, `contract.penaltyRate`, `contract.graceDays` ni o'qiydi va o'z klassining hech qanday maydonini ishlatmaydi. Qaysi smell va qaysi refaktoring?"
    options:
      - "Feature Envy, Move Function bilan hisobni `Contract` ga ko'chirish"
      - "Data Clumps, Introduce Parameter Object"
      - "Middle Man, Remove Middle Man"
      - "Long Function, Extract Function"
    answer: 0
    explain: "Metod boshqa obyektning ma'lumotiga o'zinikidan ko'proq qiziqadi - bu Feature Envy. Kitob tavsiyasi: funksiyani ma'lumot yoniga ko'chiring (Move Function). Agar faqat bir qismi \"hasadgo'y\" bo'lsa, avval Extract Function."
  - q: "Kitob Data Clumps uchun qanday sinovni taklif qiladi?"
    options:
      - "Agar guruh uchtadan ko'p maydondan iborat bo'lsa, bu clump"
      - "Agar maydonlar bir xil tipga ega bo'lsa"
      - "Qiymatlardan birini o'chirib ko'ring: qolganlari alohida ma'no saqlamasa, bu yetishmayotgan obyekt"
      - "Agar maydonlar bir xil prefiksga ega bo'lsa"
    answer: 2
    explain: "Mualliflarning sinovi: bitta qiymatni o'chirsangiz, qolganlari mantiqiy bo'lib qoladimi? `lat` siz `lng` ma'nosiz - demak ular bitta `Coordinates` obyekti. Prefiks Large Class uchun foydali belgi, lekin clump sinovi emas."
  - q: "Nega 2-nashrda \"Switch Statements\" smell'i \"Repeated Switches\" ga almashtirilgan?"
    options:
      - "Chunki switch JavaScript'da yomon ishlaydi"
      - "Chunki polimorfizm endi keng tarqalgan va bitta switch o'z-o'zidan ogohlantirish belgisi emas, muammo bir xil shartning takrorlanishida"
      - "Chunki switch o'rniga har doim if/else ishlatish kerak"
      - "Chunki Fowler polimorfizmni endi tavsiya qilmaydi"
    answer: 1
    explain: "1-nashr yozilgan paytda polimorfizm kam qadrlangan edi va mualliflar har qanday switch'ga e'tiborni tortmoqchi edi. Endi muammo faqat bir xil switch/if zanjiri bir nechta joyda takrorlanganda: yangi holat qo'shish uchun hamma nusxani topish kerak bo'ladi."
  - q: "Quyidagi kodda qaysi smell va qaysi refaktoring? `let total = 0; for (const t of trips) { if (t.status === 'done') total += t.distanceKm; }`"
    options:
      - "Repeated Switches, Replace Conditional with Polymorphism"
      - "Mutable Data, Encapsulate Variable"
      - "Primitive Obsession, Replace Primitive with Object"
      - "Loops, Replace Loop with Pipeline"
    answer: 3
    explain: "Kitob Loops'ni smell sifatida 2-nashrga qo'shgan: first-class funksiyalar keng tarqalgan bugungi tillarda `filter` va `reduce` qaysi elementlar qayta ishlanishi va ular bilan nima qilinishini aniqroq ko'rsatadi. Lekin bu smell, qoida emas (Qachon qo'llamaslik bo'limiga qarang)."
  - q: "`status: string` maydoni bo'yicha `if (status === 'active')`, `if (status === 'blocked')` kabi tekshiruvlar kodning 7 joyida bor. Kitob Primitive Obsession uchun qaysi yo'lni ko'rsatadi?"
    options:
      - "Status'ni raqamga aylantirish"
      - "Replace Type Code with Subclasses, keyin Replace Conditional with Polymorphism"
      - "Har bir joyga komment qo'shish"
      - "Inline Function"
    answer: 1
    explain: "Shartli xatti-harakatni boshqaradigan type code uchun kitob shu ikki qadamni tavsiya qiladi. TypeScript'da subklasslar o'rniga discriminated union va lookup jadval ham ko'pincha yetarli (27-dars)."
  - q: "Data Class smell'ining asosiy istisnosi qaysi?"
    options:
      - "DTO'lar hech qachon smell emas"
      - "Ikkitadan kam maydonli klasslar"
      - "Alohida funksiya qaytaradigan natija yozuvi, masalan Split Phase'ning o'zgarmas oraliq strukturasi"
      - "Prisma modellari"
    answer: 2
    explain: "Kitob aniq aytadi: Split Phase natijasida paydo bo'ladigan o'zgarmas natija yozuvlari Data Class qoidasining asosiy istisnosi. Ularning maydonlarini inkapsulyatsiya qilish shart emas."
task:
  title: "Feature Envy va Repeated Switches'ni yo'qotish"
  prompt: |
    Transport parki tizimida transport turi (`truck`, `van`, `car`) bo'yicha uch joyda switch bor. Bundan tashqari `MaintenanceService` deyarli butunlay `Vehicle` ma'lumotlari bilan ishlaydi.

    Yangi talab keldi: **`bus` turini qo'shish**. Avval refaktoring qiling, shunda yangi tur bitta joyga tushsin.

    1. Repeated Switches'ni bitta joyga yig'ing (TypeScript'da lookup jadval yoki polimorfizm).
    2. Feature Envy'ni Move Function bilan tuzating.
    3. `lat` va `lng` Data Clumps'ini tuzating.
    4. `bus` ni qo'shing: u faqat bitta joyga tegishi kerak.
  lang: ts
  starter: |
    type Vehicle = {
      id: string;
      kind: string;
      odometerKm: number;
      lastServiceKm: number;
      lat: number;
      lng: number;
    };

    export class MaintenanceService {
      isServiceDue(v: Vehicle): boolean {
        let interval: number;
        switch (v.kind) {
          case "truck": interval = 20000; break;
          case "van": interval = 15000; break;
          default: interval = 10000;
        }
        return v.odometerKm - v.lastServiceKm >= interval;
      }

      kmUntilService(v: Vehicle): number {
        let interval: number;
        switch (v.kind) {
          case "truck": interval = 20000; break;
          case "van": interval = 15000; break;
          default: interval = 10000;
        }
        return Math.max(interval - (v.odometerKm - v.lastServiceKm), 0);
      }
    }

    export function maxSpeedKmh(v: Vehicle): number {
      switch (v.kind) {
        case "truck": return 80;
        case "van": return 90;
        default: return 110;
      }
    }

    export function mapLink(lat: number, lng: number): string {
      return `https://maps.example.uz/?q=${lat},${lng}`;
    }
  solution: |
    type Coordinates = { readonly lat: number; readonly lng: number };

    type VehicleKind = "truck" | "van" | "car" | "bus";

    type KindProfile = { serviceIntervalKm: number; maxSpeedKmh: number };

    // Yagona joy: yangi tur faqat shu yerga qo'shiladi.
    // Record<VehicleKind, ...> tufayli kompilyator yetishmagan turni ko'rsatadi.
    const KIND_PROFILES: Record<VehicleKind, KindProfile> = {
      truck: { serviceIntervalKm: 20_000, maxSpeedKmh: 80 },
      van: { serviceIntervalKm: 15_000, maxSpeedKmh: 90 },
      car: { serviceIntervalKm: 10_000, maxSpeedKmh: 110 },
      bus: { serviceIntervalKm: 12_000, maxSpeedKmh: 90 },
    };

    export class Vehicle {
      constructor(
        readonly id: string,
        readonly kind: VehicleKind,
        readonly odometerKm: number,
        readonly lastServiceKm: number,
        readonly position: Coordinates,
      ) {}

      private get profile(): KindProfile {
        return KIND_PROFILES[this.kind];
      }

      get maxSpeedKmh(): number {
        return this.profile.maxSpeedKmh;
      }

      kmUntilService(): number {
        const sinceService = this.odometerKm - this.lastServiceKm;
        return Math.max(this.profile.serviceIntervalKm - sinceService, 0);
      }

      isServiceDue(): boolean {
        return this.kmUntilService() === 0;
      }
    }

    export function mapLink(position: Coordinates): string {
      return `https://maps.example.uz/?q=${position.lat},${position.lng}`;
    }
  solutionNotes: |
    - **Repeated Switches**: uchta switch bitta `KIND_PROFILES` jadvaliga yig'ildi. Bu yerda xatti-harakat emas, faqat ma'lumot farq qiladi, shuning uchun subklasslar ortiqcha: lookup jadval yetarli. Agar turlar bo'yicha algoritm farq qilsa, Replace Conditional with Polymorphism mos kelardi.
    - `Record<VehicleKind, KindProfile>` - TypeScript bonusi: `bus` ni union'ga qo'shib, jadvalga qo'shmasangiz, kompilyator xato beradi. Eski `default:` holati esa yangi turni jimgina `car` deb hisoblardi.
    - **Feature Envy**: `MaintenanceService` metodlari faqat `Vehicle` ma'lumotini ishlatardi. Move Function bilan ular `Vehicle` ga ko'chdi va servis klassi keraksiz bo'lib qoldi (u Lazy Element'ga aylanardi).
    - `isServiceDue` endi `kmUntilService` orqali ifodalangan: eski formulada `>= interval` edi, yangisida `max(..., 0) === 0`. Ular ekvivalent, lekin buni test bilan tekshiring.
    - **Data Clumps**: `lat`/`lng` - `Coordinates`. Sinov: `lat` siz `lng` ma'nosiz.
    - `kind: string` -> `VehicleKind` union - Primitive Obsession tuzatildi. Ma'lumotlar bazasidan kelgan string'ni chegarada tekshirib, union'ga aylantirish kerak (45-dars).
  checklist:
    - "Transport turi bo'yicha switch faqat bitta joyda (yoki umuman yo'q)"
    - "bus qo'shish faqat bitta joyga tegdi"
    - "Yangi tur jadvalga qo'shilmasa, kompilyator xato beradi"
    - "Vehicle ma'lumotlariga oid hisob Vehicle ichida"
    - "lat va lng bitta Coordinates tipida"
---

## Muammo

Kod bazasida `utils/`, `helpers/` va `*Service` fayllari bor. Ularning har biri bir xil naqshda yozilgan: obyektni oladi, undan to'rt-beshta maydonni o'qiydi, nimadir hisoblaydi va natija qaytaradi. Domen obyektlarining o'zi esa faqat maydonlardan iborat. Natijada "ijara shartnomasining kechikish jarimasi qanday hisoblanadi?" degan savolga javob topish uchun butun loyiha bo'ylab qidirish kerak, va ko'pincha ikki xil javob topiladi.

Ikkinchi muammo: yangi turdagi transport, yangi to'lov usuli yoki yangi foydalanuvchi roli qo'shilganda, uni qo'shish uchun kod bazasidagi barcha `switch (kind)` larni topish kerak. Ulardan bittasini o'tkazib yuborsangiz, `default:` holati yangi turni jimgina noto'g'ri qayta ishlaydi.

Bu darsdagi smell'lar ma'lumot va uni ishlatadigan mantiq bir-biridan ajralib ketganda paydo bo'ladi.

## Asosiy g'oya

Kitobning Feature Envy muhokamasida butun bu guruh uchun asosiy evristika aytiladi: **birga o'zgaradigan narsalarni birga saqlang**. Ma'lumot va unga bog'liq xatti-harakat odatda birga o'zgaradi. Ular ajralganda quyidagi smell'lar ko'rinadi:

- **Feature Envy** - funksiya o'z modulidan ko'ra boshqa modul ma'lumoti bilan ko'proq ishlaydi.
- **Data Clumps** - bir guruh ma'lumot doim birga uchraydi, lekin alohida obyekt sifatida ifodalanmagan.
- **Primitive Obsession** - domen tushunchalari (pul, koordinata, telefon raqami) oddiy `number` va `string` bilan ifodalanadi.
- **Data Class** - faqat maydon va getter/setter'lardan iborat klass, uning xatti-harakati boshqa joyda.
- **Repeated Switches** - bir xil shart bo'yicha switch yoki if zanjiri bir necha joyda takrorlanadi.
- **Loops** - sikl `filter`/`map` kabi pipeline bilan aniqroq ifodalanishi mumkin bo'lgan joyda.

Bu smell'lar ko'pincha birga keladi: Primitive Obsession'dagi `kind: string` Repeated Switches'ni keltirib chiqaradi, Data Class esa Feature Envy'ni.

## Chuqurroq: har bir smell

### Feature Envy

Modullarni ajratishda biz ichida ko'p o'zaro ta'sir, tashqarisida esa kam o'zaro ta'sir bo'lishiga intilamiz. Feature Envy - funksiya o'z modulidagi funksiya va ma'lumotlardan ko'ra boshqa modul bilan ko'proq muloqot qilganda. Klassik belgi: funksiya boshqa obyektning yarim o'nlab getter'ini chaqirib, qiymat hisoblaydi.

Davo oddiy: **Move Function** bilan funksiyani ma'lumot yoniga ko'chiring. Agar faqat bir qismi "hasadgo'y" bo'lsa, avval **Extract Function**, keyin ko'chirish.

Funksiya bir nechta modulning ma'lumotini ishlatsa, kitob tavsiyasi: u eng ko'p ma'lumotini ishlatadigan modulga borsin. Ko'pincha avval Extract Function bilan funksiyani bo'laklarga bo'lish bu qarorni osonlashtiradi.

Kitob muhim istisnolarni ham sanaydi: Strategy va Visitor patternlari, shuningdek Kent Beckning Self Delegation patterni ataylab xatti-harakatni ma'lumotdan ajratadi. Ular Divergent Change'ga qarshi kurashish uchun o'zgaradigan xatti-harakatni izolyatsiya qiladi, buning narxi esa qo'shimcha bilvositalik. Ya'ni "xatti-harakat ma'lumot yonida bo'lsin" qoidasi mutlaq emas, u o'zgarish naqshiga bo'ysunadi.

### Data Clumps

Ma'lumotlar xuddi bolalar kabi guruh bo'lib yurishni yaxshi ko'radi: bir nechta klassda bir xil uch-to'rtta maydon, ko'p metod signaturalarida bir xil parametrlar. Doim birga yuradigan ma'lumot o'z obyektiga ega bo'lishi kerak.

Tavsiya qilinadigan refaktoringlar: avval maydonlar uchun **Extract Class**, keyin metod signaturalari uchun **Introduce Parameter Object** yoki **Preserve Whole Object**.

Kitobning amaliy sinovi: qiymatlardan birini o'chirib ko'ring. Qolganlari alohida ma'no saqlaydimi? Agar yo'q bo'lsa, bu obyekt tug'ilishini kutayotganining aniq belgisi. Mualliflar yana ikki narsani qayd etadi: yangi obyekt maydonlarining hammasi har bir joyda ishlatilishi shart emas, va oddiy yozuv (record) o'rniga klass yaratish foydali, chunki keyinchalik unga xatti-harakat ko'chiriladi. Data Clumps'ni tuzatish ko'pincha Feature Envy'ni ham ochib beradi.

### Primitive Obsession

Ko'p dasturchilar domen tushunchalari uchun o'z tiplarini yaratishdan qochadi: pul, koordinata, diapazon, telefon raqami oddiy `number` va `string` bo'lib qoladi. Pul bilan ishlash uchun `number` dan foydalanish (valyutasiz) yoki fizik birliklarni aralashtirish (dyuym va millimetr) bu smell'ning klassik misollari. Satrlar bilan bu holat shunchalik keng tarqalganki, uni "stringly typed" o'zgaruvchilar deb atashadi.

Tavsiya qilinadigan refaktoringlar:

- **Replace Primitive with Object** - asosiy vosita.
- **Replace Type Code with Subclasses**, keyin **Replace Conditional with Polymorphism** - primitive tip shartli xatti-harakatni boshqarsa.
- **Extract Class** va **Introduce Parameter Object** - doim birga keladigan primitivlar guruhi uchun (bu yerda Data Clumps bilan kesishadi).

TypeScript'da bu smell'ning o'ziga xos davolari bor: branded tiplar, template literal tiplar va value object klasslar. Ularni 44-darsda batafsil ko'rgan edik.

### Data Class

Faqat maydonlar, getter va setter'lardan iborat klass. Bunday klasslar ko'pincha boshqa klasslar tomonidan juda batafsil boshqariladi, ya'ni ularning xatti-harakati boshqa joyda (Feature Envy'ning teskari tomoni). Fowler blogida ham aynan shu misolni keltiradi: bunday klassda qanday xatti-harakat bo'lishi kerakligini so'rash ko'pincha foydali refaktoringga olib keladi.

Tavsiya qilinadigan refaktoringlar: ochiq maydonlar uchun darhol **Encapsulate Record**, o'zgarmasligi kerak bo'lgan maydonlar uchun **Remove Setting Method**, keyin mijozlardagi xatti-harakatni klassga **Move Function** bilan ko'chirish (kerak bo'lsa avval Extract Function).

Muhim istisno: alohida funksiya qaytaradigan natija yozuvi, masalan Split Phase natijasidagi oraliq struktura. Ular odatda o'zgarmas va maydonlarini inkapsulyatsiya qilish shart emas. Bu 41-darsdagi "obyekt va ma'lumot strukturasi" farqiga mos keladi: DTO va natija yozuvlari ataylab ma'lumot strukturasi.

### Repeated Switches

1-nashrda "Switch Statements" smell'i bor edi. Mualliflar tushuntiradi: 1990-yillar oxirida polimorfizm kam qadrlangan edi va ular dasturchilarni unga o'tishga undamoqchi edi. Bugun polimorfizm keng tarqalgan va bitta switch o'z-o'zidan ogohlantirish belgisi emas. Shuning uchun 2-nashrda smell aniqroq: **bir xil shartli mantiq** (switch/case yoki if/else zanjiri) bir necha joyda takrorlanganda. Muammo shundaki, yangi holat qo'shganda hamma nusxani topib yangilash kerak.

Davo: **Replace Conditional with Polymorphism**. TypeScript'da bundan tashqari ikki muqobil bor (27-dars): agar faqat ma'lumot farq qilsa, lookup jadval (`Record<Kind, ...>`), agar xatti-harakat farq qilsa va tip xavfsizligi kerak bo'lsa, discriminated union va `never` bilan to'liqlik tekshiruvi.

### Loops

Bu smell 2-nashrda yangi va uning mazmuni ochiq aytilgan: mualliflar 1-nashrdayoq sikllarni yoqtirmagan, lekin o'sha paytdagi Java'da yaxshiroq muqobil yo'q edi. Endi first-class funksiyalar keng tarqalgan, demak sikllarni pipeline operatsiyalari bilan almashtirish mumkin. Ularning fikricha, `filter` va `map` kabi operatsiyalar qaysi elementlar qayta ishlanishi va ular bilan nima qilinishini tezroq ko'rsatadi.

Refaktoring: **Replace Loop with Pipeline**. Bu smell boshqalardan ko'ra munozaraliroq (Qachon qo'llamaslik bo'limiga qarang).

## Misol: ijara shartnomasi

Hozirgi holat - `Contract` faqat ma'lumot, mantiq servisda:

```ts
type Contract = {
  monthlyRentTiyin: number;
  currency: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  status: string;
};

export class BillingService {
  lateFee(c: Contract, today: Date): number {
    if (c.status === "terminated") return 0;
    const due = new Date(c.startYear, c.startMonth - 1, c.startDay);
    const days = Math.floor((today.getTime() - due.getTime()) / 86_400_000);
    if (days <= 5) return 0;
    let fee = 0;
    for (let i = 6; i <= days; i++) fee += c.monthlyRentTiyin * 0.001;
    return Math.round(fee);
  }
}
```

Smell'lar:

- **Feature Envy** - `lateFee` faqat `Contract` ma'lumotlarini ishlatadi.
- **Data Clumps** - `startYear`, `startMonth`, `startDay`: bittasini o'chirsangiz, qolganlari ma'nosiz. Bu sana.
- **Primitive Obsession** - `monthlyRentTiyin` + `currency` (pul), `status: string`.
- **Data Class** - `Contract` da xatti-harakat yo'q.
- **Loops** - sikl aslida oddiy ko'paytma.

Refaktoringdan keyin:

```ts run
type ContractStatus = "active" | "terminated";
type Money = { readonly tiyin: number; readonly currency: "UZS" | "USD" };

const GRACE_DAYS = 5;
const DAILY_PENALTY_RATE = 0.001;
const MS_PER_DAY = 86_400_000;

export class Contract {
  constructor(
    readonly monthlyRent: Money,
    readonly dueDate: Date,
    readonly status: ContractStatus,
  ) {}

  daysOverdue(today: Date): number {
    return Math.floor((today.getTime() - this.dueDate.getTime()) / MS_PER_DAY);
  }

  lateFee(today: Date): Money {
    const penalizedDays = Math.max(this.daysOverdue(today) - GRACE_DAYS, 0);
    const fee = this.status === "terminated"
      ? 0
      : Math.round(this.monthlyRent.tiyin * DAILY_PENALTY_RATE * penalizedDays);
    return { tiyin: fee, currency: this.monthlyRent.currency };
  }
}

// Sinab ko'ring: sanani yoki statusni ("terminated") o'zgartiring.
const contract = new Contract({ tiyin: 500_000_000, currency: "UZS" }, new Date("2026-10-01T00:00:00Z"), "active");
for (const day of ["2026-10-04", "2026-10-06", "2026-10-16"]) {
  const today = new Date(`${day}T00:00:00Z`);
  console.log(`${day}: ${contract.daysOverdue(today)} kun kechikish, jarima`, contract.lateFee(today));
}
```

Qadamlar: Extract Class (`startYear/Month/Day` -> `Date`), Replace Primitive with Object (`Money`, `ContractStatus`), Move Function (`lateFee` -> `Contract`), Substitute Algorithm (sikl -> ko'paytma). Oxirgisi Replace Loop with Pipeline emas: bu yerda sikl umuman kerak emas edi. Qaytariladigan tip `number` dan `Money` ga o'zgargani - Change Function Declaration, ya'ni chaqiruvchilar ham yangilanadi. Agar ular ko'p bo'lsa, eski `BillingService.lateFee` ni vaqtincha yangi metodga delegatsiya qiluvchi qilib qoldiring.

Diqqat qiling: yangi kodda yaxlitlash bir marta, eski kodda esa sikl ichida kasr qo'shilib, oxirida bir marta yaxlitlangan. Natija bir xil, lekin suzuvchi nuqta xatolari tufayli katta qiymatlarda farq paydo bo'lishi mumkin. Refaktoringdan oldin chegaraviy holatlar uchun characterization test (79-dars) yozish kerak. Agar natijalar farq qilsa, eski xatti-harakatni saqlash va farqni alohida qaror sifatida ko'tarish kerak.

## Qachon qo'llamaslik kerak

- **Anemik model ataylab tanlanganda.** Ko'p NestJS loyihalarida Prisma modellari oddiy ma'lumot, mantiq esa servislarda. Bu Data Class va Feature Envy'ga o'xshaydi, lekin agar jamoa buni ongli ravishda tanlagan bo'lsa (masalan, oddiy CRUD domen), har bir modelni boy domen obyektiga aylantirish o'zini oqlamasligi mumkin. Boy domen modeli murakkab biznes qoidalari bo'lgan joyda foyda beradi (84-dars).
- **DTO va API shartnomalari.** Tarmoq orqali uzatiladigan obyektlar ataylab ma'lumot strukturasi. Ularga xatti-harakat qo'shish serializatsiya muammolarini keltirib chiqaradi.
- **Bitta switch.** Kod bazasida faqat bitta joyda bo'lgan switch smell emas. Uni polimorfizmga aylantirish ko'pincha bitta faylni beshta faylga aylantiradi.
- **Sikllar ba'zan aniqroq.** `break`, `continue` yoki erta chiqish bilan, bir nechta akkumulyatorli yoki `await` ketma-ketligi bo'lgan sikllarni pipeline bilan yozish o'qishni qiyinlashtiradi. `reduce` ichida murakkab obyekt qurish ko'pincha oddiy `for...of` dan yomonroq. Katta massivlarda `filter().map()` zanjiri qo'shimcha oraliq massivlar yaratadi. Bu smell'da mualliflarning didi ham aks etadi, va JavaScript hamjamiyatida bu borada fikrlar turlicha.
- **Primitive Obsession chegarasi.** Har bir `string` ni value object'ga o'rash ham smell'ga aylanishi mumkin. Branded tip yoki value object biznes qoidasi (validatsiya, format, birlik) bo'lganda foydali.

## Stack'da: TypeScript, NestJS, React

- **Discriminated union va `never`.** `switch (event.kind)` ning `default:` qismida `const _exhaustive: never = event;` yozsangiz, yangi tur qo'shilganda kompilyator har bir switch'ni ko'rsatadi. Bu Repeated Switches'ni yo'qotmaydi, lekin uning eng xavfli tomonini (o'tkazib yuborilgan nusxa) yo'qotadi.
- **Prisma va domen obyektlari.** Prisma qaytaradigan obyektlar oddiy tiplar. Feature Envy'ni tuzatish uchun ularni repository chegarasida domen klassiga aylantirish mumkin (`Contract.fromRecord(row)`). Bu qo'shimcha xarita qatlami, uni faqat mantiq ko'p bo'lgan agregatlar uchun qiling.
- **React'da Feature Envy.** Komponent ichida `order.items.reduce(...)`, `order.discount`, `order.taxRate` bilan jami hisoblash - bu komponentning order ma'lumotiga hasadi. Hisobni domen funksiyasiga (`orderTotal(order)`) ko'chiring: u komponentdan tashqarida test qilinadi va boshqa joyda qayta ishlatiladi.
- **Zod bilan chegaradagi primitive'lar.** Tashqaridan kelgan `string` ni `z.enum([...])` yoki `.brand<'Phone'>()` bilan parse qilib, ichki kodga faqat aniq tiplarni o'tkazing.

## Xulosa

- Birga o'zgaradigan narsalarni birga saqlang: bu Feature Envy, Data Clumps va Data Class'ning umumiy davosi.
- Feature Envy - Move Function (kerak bo'lsa avval Extract Function). Strategy va Visitor kabi patternlar ongli istisno.
- Data Clumps sinovi: bitta qiymatni o'chiring, qolganlari ma'no saqlamasa, obyekt yetishmayapti.
- Primitive Obsession - Replace Primitive with Object. Type code shartlarni boshqarsa, polimorfizm yoki discriminated union.
- Repeated Switches - bitta switch emas, bir xil shartning takrori. Loops - 2-nashrdagi yangi va munozaraliroq smell, uni qoida sifatida emas, signal sifatida qo'llang.
