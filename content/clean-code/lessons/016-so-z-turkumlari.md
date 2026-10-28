---
n: 16
slug: so-z-turkumlari
title: "Tur, funksiya va boolean nomlari"
summary: "Nomning grammatik shakli o'quvchiga narsaning roli haqida signal beradi: ot - narsa, fe'l - amal, savol - boolean. Bu darsda klass va tip, funksiya va metod, boolean va event handler nomlarini tanlash qoidalarini, ularning istisnolarini ko'ramiz."
duration: 35
sources:
  - id: cc1
    note: "2-bob: \"Class Names\", \"Method Names\", \"Don't Be Cute\" bo'limlari; 3-bob: funksiya nomlari va argumentlar (fe'l va kalit so'z)"
  - id: code-complete
    note: "11-bob: boolean o'zgaruvchilar nomi, inkor nomlardan qochish; 7-bob \"High-Quality Routines\": routine nomlari, kuchli fe'l, qarama-qarshi juftliklar"
quiz:
  - q: "Funksiya `function payment(order: Order): Promise<Receipt>` to'lovni amalga oshiradi va kvitansiya qaytaradi. Nomdagi asosiy muammo nima?"
    options:
      - "Funksiya async bo'lmasligi kerak"
      - "Nom ot shaklida, shuning uchun u amalni emas, narsani bildiradi: chaqiruv `payment(order)` o'qilganda nima sodir bo'lishi aniq emas"
      - "Nom juda qisqa"
      - "`Order` tipi noto'g'ri"
    answer: 1
    explain: "Martin va McConnell amal bajaradigan funksiyalarni fe'l (yoki fe'l + obyekt) bilan nomlashni tavsiya qiladi: `payForOrder`, `chargeOrder`. Ot shaklidagi nom o'quvchini u narsa qaytaradimi yoki ish bajaradimi, taxmin qilishga majbur qiladi."
  - q: "Qaysi boolean nomi eng yaxshi tanlangan?"
    options:
      - "`notDisabled`"
      - "`status`"
      - "`hasActiveSubscription`"
      - "`flag`"
    answer: 2
    explain: "`hasActiveSubscription` savol sifatida o'qiladi va `if` ichida tabiiy jumla hosil qiladi. `notDisabled` ikki marta inkor (`!notDisabled`), `status` va `flag` esa boolean ekanini ham, nimani bildirishini ham aytmaydi."
  - q: "Martin `Manager`, `Processor`, `Data`, `Info` kabi so'zlarni klass nomida ishlatmaslikni maslahat beradi. Buning eng to'g'ri izohi qaysi?"
    options:
      - "Bu so'zlar juda uzun"
      - "Ular inglizcha emas"
      - "TypeScript ularni taqiqlaydi"
      - "Ular klass nima uchun javobgar ekanini aytmaydi va har qanday mantiqni o'ziga tortadigan \"magnit\" nomga aylanadi"
    answer: 3
    explain: "`FleetManager` nima qiladi? Hamma narsa. Bunday nom klassga aniq chegara bermaydi va u tez orada God object'ga aylanadi (59-dars). Aniq ot (`TripPlanner`, `FuelReportBuilder`) javobgarlikni cheklaydi."
  - q: "Klassda `add`, `delete` va `start`, `finish` metodlari bor. McConnell nuqtai nazaridan nima yaxshilanishi mumkin?"
    options:
      - "Qarama-qarshi amallar uchun an'anaviy juftliklarni ishlating: `add`/`remove`, `start`/`stop` yoki `begin`/`end`. Juftlik buzilsa, o'quvchi ular haqiqatan qarama-qarshi ekaniga shubha qiladi"
      - "Barcha metodlarni `handle` bilan boshlash kerak"
      - "Metodlarni bitta `execute(action)` ga birlashtirish kerak"
      - "Hech narsa, bu nomlar yetarlicha yaxshi"
    answer: 0
    explain: "McConnell qarama-qarshi amallar uchun aniq juftliklarni (add/remove, begin/end, open/close, start/stop) izchil ishlatishni tavsiya qiladi. `add`/`delete` yoki `start`/`finish` aralashmasi o'quvchini simmetriya bor-yo'qligini tekshirishga majbur qiladi."
  - q: "React komponentida prop `onSave` va komponent ichida `handleSave` funksiyasi bor. Bu konvensiyaning mantiqi nima?"
    options:
      - "Ikkalasi ham bir xil narsa, faqat uslub"
      - "`handle` prefiksi funksiyani tezroq qiladi"
      - "`on*` - komponent tashqariga e'lon qiladigan hodisa (nima sodir bo'ldi), `handle*` - shu hodisaga javob beradigan ichki funksiya"
      - "`on*` faqat DOM hodisalari uchun"
    answer: 2
    explain: "Bu React jamiyatida keng tarqalgan konvensiya: `on` prefiksi prop interfeysida \"bu hodisa sodir bo'lganda chaqiriladi\" degan shartnomani, `handle` esa uning implementatsiyasini bildiradi."
  - q: "`function isValidTrip(trip: Trip): boolean` xato topsa exception otadi, xato topmasa `true` qaytaradi va hech qachon `false` qaytarmaydi. Eng to'g'ri tuzatish qaysi?"
    options:
      - "Nomni o'zgartirmaslik, chunki u baribir boolean qaytaradi"
      - "Yoki haqiqiy predikat qiling (`false` qaytarsin), yoki nomni amalga moslang: `assertValidTrip(trip): void` yoki `validateTrip(trip): ValidationResult`"
      - "Nomni `isValidTripOrThrow` qilish"
      - "Exception'ni `console.log` bilan almashtirish"
    answer: 1
    explain: "`is*` savol beradi va javob kutadi. Exception otuvchi tekshiruv `assert*` kabi buyruq shaklida nomlanishi kerak. Nomning grammatik shakli funksiya shartnomasining bir qismi."
task:
  title: "Ijara modulidagi tur, metod va boolean nomlarini grammatikaga moslash"
  prompt: |
    Quyidagi modul avtomobil ijarasi shartnomalarini boshqaradi. Kod ishlaydi, lekin nomlarning grammatik shakli rolga mos kelmaydi: klass nomi noaniq, metodlar ot shaklida, boolean'lar inkor yoki noaniq.

    1. Har bir nom uchun aniqlang: bu narsa (ot), amal (fe'l) yoki savol (boolean)mi?
    2. Nomlarni ularning roliga mos shaklga keltiring.
    3. Qarama-qarshi amallarni izchil juftlik bilan nomlang.
  lang: ts
  starter: |
    type Rental = { id: string; carId: string; started: boolean; notReturned: boolean; dailyRate: number; days: number };

    export class RentalManager {
      private rentals = new Map<string, Rental>();

      rental(rental: Rental): void {
        this.rentals.set(rental.id, rental);
      }

      begin(id: string): void {
        const r = this.rentals.get(id);
        if (r) r.started = true;
      }

      finish(id: string): void {
        const r = this.rentals.get(id);
        if (r) r.notReturned = false;
      }

      price(id: string): number {
        const r = this.rentals.get(id);
        return r ? r.dailyRate * r.days : 0;
      }

      overdue(id: string, plannedDays: number): boolean {
        const r = this.rentals.get(id);
        return !!r && r.notReturned && r.days > plannedDays;
      }
    }
  solution: |
    type Rental = {
      id: string;
      carId: string;
      isStarted: boolean;
      isReturned: boolean;
      dailyRate: number;
      days: number;
    };

    export class RentalRegistry {
      private readonly rentals = new Map<string, Rental>();

      register(rental: Rental): void {
        this.rentals.set(rental.id, rental);
      }

      start(id: string): void {
        const rental = this.rentals.get(id);
        if (rental) rental.isStarted = true;
      }

      markReturned(id: string): void {
        const rental = this.rentals.get(id);
        if (rental) rental.isReturned = true;
      }

      calculateTotalPrice(id: string): number {
        const rental = this.rentals.get(id);
        return rental ? rental.dailyRate * rental.days : 0;
      }

      isOverdue(id: string, plannedDays: number): boolean {
        const rental = this.rentals.get(id);
        return rental !== undefined && !rental.isReturned && rental.days > plannedDays;
      }
    }
  solutionNotes: |
    - `RentalManager` -> `RentalRegistry`: klass aslida ijaralarni ro'yxatga oladi va holatini o'zgartiradi. "Manager" bu chegarani aytmasdi. Agar keyinchalik narx hisobi murakkablashsa, u alohida `RentalPricing` ga chiqishi mumkin.
    - `rental()` ot shaklida edi va amal (ro'yxatga olish) bajarardi: `register`.
    - `begin`/`finish` juftligi nomuvofiq edi. `finish` aslida "qaytarildi" degan holatni belgilardi, shuning uchun `markReturned` aniqroq. `begin` -> `start` (agar keyin `stop` kerak bo'lsa, juftlik tayyor).
    - `price()` ot edi va hisoblardi: `calculateTotalPrice`. Agar u shunchaki saqlangan qiymatni qaytarganida, `totalPrice` getter bo'lishi ham mumkin edi.
    - `overdue()` boolean qaytarardi, lekin savol shaklida emas edi: `isOverdue`.
    - `notReturned` inkor boolean edi va `= false` qatori ikki marta inkorni o'qishni talab qilardi. `isReturned` ijobiy shaklda. Diqqat: ma'no teskari bo'lgani uchun boshlang'ich qiymat va barcha tekshiruvlarni ham teskari qilish kerak. Bu yerda xato qilish oson, shuning uchun bunday o'zgarishdan keyin testlar majburiy.
    - `started` -> `isStarted`: boolean maydonlar uchun izchil `is` prefiksi.
  checklist:
    - "Klass nomi aniq ot, Manager/Processor/Data emas"
    - "Amal bajaradigan har bir metod fe'l bilan boshlanadi"
    - "Boolean qaytaradigan metodlar va boolean maydonlar savol shaklida (is/has/can)"
    - "Inkor boolean nomlar qolmadi"
    - "Qarama-qarshi amallar an'anaviy juftlik bilan nomlangan"
---

## Muammo

Ingliz tilida yozilgan kod o'ziga xos tabiiy til: `if (driver.hasValidLicense()) fleet.assign(driver, vehicle)` deyarli jumla kabi o'qiladi. Bu tasodif emas. Nomlarning grammatik shakli o'quvchiga narsaning **roli** haqida signal beradi: ot - bu narsa (qiymat, obyekt, tip), fe'l - bu amal (funksiya, metod), savol - bu boolean. O'quvchi bu signallarga ongsiz ravishda tayanadi.

Signal buzilganda o'qish qiyinlashadi. `payment(order)` - bu to'lov obyektini qaytaradimi yoki to'lovni amalga oshiradimi? `vehicle.active` - bu boolean maydonmi, `active()` metodimi yoki faol holatdagi biror obyektmi? `notDisabled` ni `if (!notDisabled)` ichida ko'rgan dasturchi ikki marta inkorni ochishi kerak. `FleetManager` nima qiladi? Hamma narsa.

Bu muammolar alohida-alohida kichik, lekin ular bir-biriga ulanadi. Grammatika aniq bo'lgan kodda ko'p narsani nomdan taxmin qilish mumkin. Grammatika buzilgan kodda har bir chaqiruvni ochib ko'rish kerak.

## Asosiy g'oya

Martin *Clean Code*ning 2-bobida qisqa ikki qoida beradi:

- **Klass nomlari** ot yoki ot iborasi bo'lishi kerak: `Customer`, `WikiPage`, `Account`, `AddressParser`. Martin `Manager`, `Processor`, `Data`, `Info` kabi so'zlardan qochishni va klass nomi fe'l bo'lmasligini maslahat beradi.
- **Metod nomlari** fe'l yoki fe'l iborasi bo'lishi kerak: `postPayment`, `deletePage`, `save`. Accessor, mutator va predikatlar uchun u Java an'anasiga ko'ra `get`, `set` va `is` prefikslarini tilga oladi.

Martin konstruktorlar haqida ham bir maslahat beradi: agar konstruktor overload qilinsa, argumentlarni tasvirlovchi nomli statik fabrika metodlari (`Complex.fromRealNumber(23.0)`) ko'pincha `new Complex(23.0)` dan aniqroq. TypeScript'da overload'lar cheklangan, lekin bu g'oya yanada foydali: `Money.fromTiyin(150000)` va `Money.fromSom(1500)` qaysi birlik ekanini aytadi, `new Money(150000)` esa aytmaydi.

Funksiyalar haqidagi 3-bobda Martin yana bir qadam qo'yadi: funksiya nomi va argument birgalikda fe'l va ot juftligi bo'lishi kerak. `write(name)` yaxshi, `writeField(name)` yanada yaxshi, chunki `name` maydon ekanini aytadi. U buni argument nomini funksiya nomiga kodlash ("keyword form") deb ataydi: `assertExpectedEqualsActual(expected, actual)` argumentlar tartibini eslab qolish muammosini kamaytiradi.

Steve McConnell *Code Complete*da routine nomlari uchun batafsilroq tavsiyalar beradi:

- Routine (funksiya) nima qilishini **to'liq** tasvirlasin. Agar to'liq tasvir juda uzun bo'lib chiqsa, muammo nomda emas, routine'da: u juda ko'p ish qilyapti.
- **Ma'nosiz fe'llardan** qoching: `handle`, `perform`, `process`, `deal with`, `do`. `handleCalculation()` nima qiladi? Ba'zan bunday fe'l kontekstda aniq (event handler), lekin ko'pincha u funksiya nima qilishini yashiradi.
- **Qiymat qaytaradigan** funksiyani qaytaradigan narsasi bo'yicha nomlang: `currentFuelLevel()`, `nextServiceDate()`. Amal bajaradigan procedure'ni esa kuchli fe'l va obyekt bilan: `printReport()`, `recalculateRoute()`.
- **Qarama-qarshi juftliklarni** aniq ishlating: `add`/`remove`, `begin`/`end`, `open`/`close`, `start`/`stop`, `show`/`hide`, `lock`/`unlock`, `get`/`set`, `insert`/`delete`, `first`/`last`, `min`/`max`, `source`/`target`. Juftlik buzilsa (`add`/`delete`, `start`/`finish`), o'quvchi ular haqiqatan simmetrik ekaniga shubha qiladi.

## Chuqurroq: boolean nomlari

Boolean'lar alohida e'tiborga loyiq, chunki ular shartlarda ishlatiladi va shartlar kodning eng ko'p xato qilinadigan joyi.

### Savol shaklida

McConnell boolean nomlari "rost yoki yolg'on" ma'nosini aniq bildirishini talab qiladi. U `done`, `error`, `found`, `success` kabi nomlarni yaxshi misol sifatida keltiradi va `status` kabi nomlarni yomon deb biladi: `status` rost bo'lsa nima degani? TypeScript jamoalarida eng keng tarqalgan yo'l - savol prefikslari:

- `is` - holat yoki xususiyat: `isActive`, `isOverdue`, `isLoading`.
- `has` - egalik yoki mavjudlik: `hasActiveSubscription`, `hasGpsSignal`.
- `can` - imkoniyat yoki ruxsat: `canEditTrip`, `canBeCancelled`.
- `should` - qaror yoki tavsiya: `shouldRetry`, `shouldNotifyDispatcher`.
- `was`/`did` - o'tgan hodisa: `wasNotified`, `didTimeout`.

typescript-eslint'ning `naming-convention` qoidasi hujjatlarida boolean o'zgaruvchilarga aynan shunday prefikslarni (`is`, `should`, `has`, `can`, `did`, `will`) talab qiluvchi tayyor konfiguratsiya misoli bor. Bu prefikslar umumiy kelishilgan to'plamga aylanganini ko'rsatadi.

### Ijobiy shaklda

McConnell inkor boolean nomlardan (`notFound`, `notDone`, `isNotValid`) qochishni maslahat beradi. Sabab oddiy: `if (!notFound)` ni o'qish uchun ikki marta inkorni ochish kerak. Ijobiy nom (`found`, `isValid`) har ikkala holatda ham tabiiy o'qiladi: `if (isValid)` va `if (!isValid)`.

Bu yerda nozik bir holat bor: ba'zan domenda inkor tushuncha asosiy bo'ladi. `isDisabled` HTML atributi (`disabled`) bilan mos keladi va `isEnabled` dan tabiiyroq bo'lishi mumkin. `isUnpaid` hisob-faktura uchun `!isPaid` dan ko'proq ishlatiladigan holat bo'lishi mumkin. Mezon: qaysi shakl domen tilida va eng ko'p tekshiriladigan joyda tabiiy o'qiladi?

### Boolean parametrlar

Boolean nomi yaxshi bo'lsa ham, chaqiruv joyida u yo'qoladi: `sendReport(trip, true, false)`. Bu yerda `true` va `false` nimani bildiradi? Bu nomlash muammosidan ko'ra dizayn muammosi (flag argumentlar, 23-dars). Qisqa yechim: obyekt parametr (`sendReport(trip, { includeMap: true, isUrgent: false })`) yoki ikki alohida funksiya.

## Misol: dispetcher servisi

```ts
export class DispatchManager {
  driver(vehicleId: string): string | undefined { /* biriktirilgan haydovchi id'si */ return undefined; }
  assignment(vehicleId: string, driverId: string): void { /* biriktiradi */ }
  delete(vehicleId: string): void { /* biriktirishni bekor qiladi */ }
  available(driverId: string): boolean { /* smenada va bo'shmi */ return true; }
  handle(vehicleId: string): void { /* GPS signali yo'qolganda dispetcherni ogohlantiradi */ }
}
```

Beshta metod, beshta grammatik xato. `driver()` va `assignment()` ot, lekin biri qiymat qaytaradi, ikkinchisi amal bajaradi. `delete` nimani o'chiradi va u `assignment` ning juftimi? `available` - boolean, lekin savol emas. `handle` nima bilan ishlaydi?

```ts run
export type VehicleId = string;
export type DriverId = string;

export class DriverAssignments {
  private readonly driverByVehicle = new Map<VehicleId, DriverId>();

  constructor(
    private readonly isOnShift: (driverId: DriverId) => boolean,
    private readonly notifyDispatcher: (message: string) => void,
  ) {}

  assignedDriverOf(vehicleId: VehicleId): DriverId | undefined {
    return this.driverByVehicle.get(vehicleId);
  }

  assign(vehicleId: VehicleId, driverId: DriverId): void {
    this.driverByVehicle.set(vehicleId, driverId);
  }

  unassign(vehicleId: VehicleId): void {
    this.driverByVehicle.delete(vehicleId);
  }

  isDriverAvailable(driverId: DriverId): boolean {
    const isAlreadyAssigned = [...this.driverByVehicle.values()].includes(driverId);
    return this.isOnShift(driverId) && !isAlreadyAssigned;
  }

  reportGpsSignalLost(vehicleId: VehicleId): void {
    const driverId = this.assignedDriverOf(vehicleId) ?? "biriktirilmagan";
    this.notifyDispatcher(`GPS signali yo'qoldi: ${vehicleId}, haydovchi: ${driverId}`);
  }
}

// Sinab ko'ring: smenadagi haydovchilarni o'zgartiring.
const onShift = new Set(["drv_1", "drv_2"]);
const assignments = new DriverAssignments(
  (driverId) => onShift.has(driverId),
  (message) => console.log(`[dispetcher] ${message}`),
);
assignments.assign("01A123BC", "drv_1");
console.log(["drv_1", "drv_2", "drv_3"].map((id) => `${id}: ${assignments.isDriverAvailable(id)}`));
assignments.reportGpsSignalLost("01A123BC");
assignments.reportGpsSignalLost("10B456CD");
```

Nima o'zgardi:

- **`DispatchManager` -> `DriverAssignments`.** Klass nimani saqlashi va nimaga javobgar ekani nomda. "Dispatch" butun dispetcherlik jarayonini, "Manager" esa hech qanday chegarani bildirmaydi.
- **Qiymat qaytaradigan metod qaytaradigan narsasi bilan nomlandi.** `assignedDriverOf(vehicleId)` chaqiruvda `assignments.assignedDriverOf(truckId)` deb deyarli jumla kabi o'qiladi. Muqobil: `findDriverFor(vehicleId)`. Ikkalasi ham `driver()` dan aniqroq.
- **Amal fe'l bilan, juftlik izchil.** `assign`/`unassign` - aniq qarama-qarshi juftlik. `delete` endi yo'q, chunki u Map'ning ichki amalini oshkor qilardi.
- **Boolean savol shaklida.** `available` -> `isDriverAvailable`, ichida yana bitta nomlangan boolean `isAlreadyAssigned`.
- **`handle` aniq fe'l bilan almashtirildi.** `reportGpsSignalLost` nima sodir bo'lganini va nima qilinishini aytadi.

## Qachon qo'llamaslik kerak

- **Funksional uslubdagi ot nomlar.** Sof funksiya qiymatni hisoblasa, uni natija nomi bilan atash keng tarqalgan va o'qiladi: `fuelConsumption(trip)`, `distanceBetween(a, b)`. McConnell ham qiymat qaytaradigan funksiyani qaytaradigan narsasi bo'yicha nomlashni tavsiya qiladi. Fe'l (`calculate`, `get`) qo'shish har doim shart emas, ayniqsa yon ta'sir yo'q bo'lsa. Shart - yon ta'sirli funksiyalar har doim fe'l bilan nomlansin.
- **Getter'lar.** TypeScript'da `get totalPrice()` getter'i chaqiruvda xususiyat kabi ko'rinadi: `order.totalPrice`. Unga `getTotalPrice` deb nom berish takror. Lekin getter qimmat hisob qilsa yoki yon ta'siri bo'lsa, u metod bo'lishi kerak.
- **Freymvork konvensiyalari.** React'da event handler'lar uchun `handle*` keng qabul qilingan, NestJS'da `canActivate` (guard), `transform` (pipe), `intercept` kabi metod nomlari interfeys bilan belgilangan. Bular "ma'nosiz fe'l" qoidasidan ustun.
- **Domen so'zi grammatikaga mos kelmasa.** Ba'zi domen tushunchalari ham ot, ham fe'l: `charge`, `refund`, `transfer`, `return`. `refund(order)` amalni bildiradi, `Refund` esa tip. Bu ziddiyat emas, lekin bir faylda ikkalasini ishlatganda ehtiyot bo'ling.
- **`Manager` ma'noli bo'lganda.** Ba'zan domenda "manager" haqiqiy rol (masalan, `AccountManager` - mijoz bilan ishlovchi xodim). Yoki kutubxona konvensiyasi (`EntityManager` TypeORM'da). Qoida "Manager taqiqlangan" emas, "Manager nomini javobgarlik noma'lumligi uchun ishlatmang".

## Stack'da: React, NestJS, TypeScript

- **React komponentlari ot.** `VehicleMap`, `TripTimeline`, `FuelChart`. `RenderVehicles` yoki `ShowMap` fe'l bo'lgani uchun komponent emas, funksiyaga o'xshaydi.
- **React hook'lari `use` bilan boshlanadi.** Bu React qoidasi: linter va React o'zi hook'larni shu prefiks orqali taniydi. `use` dan keyin nima qaytarishi yoki nima qilishi: `useVehicle(id)`, `useTripFilters()`, `useDebouncedValue(value, 300)`.
- **Event prop'lar va handler'lar.** Prop'larda `onVehicleSelect`, `onSubmit` (nima sodir bo'ldi), komponent ichida `handleVehicleSelect` (javob). Prop nomi ichki implementatsiyani (`onClickButton`) emas, ma'noni (`onConfirm`) aytsin.
- **NestJS servislari.** Controller metodlari HTTP amal bilan bog'liq (`create`, `findAll`, `findOne`, `update`, `remove`). Bu NestJS CLI generatori beradigan standart nomlar. Servis metodlari domen fe'llari bilan: `assignDriver`, `closeTrip`, `recordRefuel`.
- **Type guard'lar va assertion'lar.** `function isTruck(v: Vehicle): v is Truck` - savol, `boolean` qaytaradi va tipni toraytiradi. `function assertIsTruck(v: Vehicle): asserts v is Truck` - buyruq, xato bo'lsa exception otadi. Grammatika va TypeScript shartnomasi bu yerda to'liq mos keladi.

## Xulosa

- Nomning grammatik shakli rolni bildiradi: ot - narsa, fe'l - amal, savol - boolean. Bu signal buzilsa, o'quvchi har bir chaqiruvni ochib ko'radi.
- Klass nomlari aniq ot bo'lsin. Manager, Processor, Data kabi so'zlar javobgarlik chegarasini yashiradi.
- Amal bajaradigan funksiyalar kuchli fe'l bilan, qiymat qaytaradiganlar natija bilan nomlansin. `handle`, `process` kabi fe'llar ko'pincha nima qilinishini yashiradi.
- Boolean'lar savol shaklida (is, has, can, should) va ijobiy bo'lsin. Inkor nom ikki marta inkorni keltirib chiqaradi.
- Qarama-qarshi amallar uchun an'anaviy juftliklarni izchil ishlating. Freymvork konvensiyalari umumiy qoidadan ustun.
