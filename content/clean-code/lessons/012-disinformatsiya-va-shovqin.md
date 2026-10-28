---
n: 12
slug: disinformatsiya-va-shovqin
title: "Disinformatsiya va ma'nosiz farqlar"
summary: "Noaniq nomdan yomonroq narsa bor: yolg'on gapiradigan nom. Bu darsda o'quvchini adashtiradigan nomlarni, Info/Data kabi shovqin so'zlarni va faqat kompilyatorni qoniqtirish uchun qilingan farqlarni ko'rib chiqamiz."
duration: 30
sources:
  - id: cc1
    note: "2-bob \"Meaningful Names\": \"Avoid Disinformation\" va \"Make Meaningful Distinctions\" bo'limlari"
  - id: code-complete
    note: "11-bob: qochish kerak bo'lgan nom turlari (o'xshash ma'noli nomlar, raqamli nomlar, faqat registr bilan farqlanuvchi nomlar)"
quiz:
  - q: "Kodda `const activeVehicleList = new Set<string>()` bor. Martin nuqtai nazaridan muammo nima?"
    options:
      - "Nomda `Vehicle` so'zi ortiqcha"
      - "`Set` o'rniga massiv ishlatish kerak"
      - "Nom `List` deb aytadi, lekin bu List emas: o'quvchi `.push()`, indeks va takrorlanuvchi elementlarni kutishi mumkin"
      - "Nomda hech qanday muammo yo'q"
    answer: 2
    explain: "Bu disinformatsiya: nom ma'lumot tuzilmasi haqida noto'g'ri signal beradi. `activeVehicleIds` yoki `activeVehicles` yaxshiroq, chunki ular tuzilma haqida hech narsa va'da qilmaydi."
  - q: "Bitta modulda `getDriver()`, `getDriverInfo()` va `getDriverData()` metodlari bor. Asosiy muammo nima?"
    options:
      - "Uch metod bir-biridan qanday farq qilishini nomdan bilib bo'lmaydi, chunki Info va Data hech qanday farq bildirmaydi"
      - "Metodlar soni ko'p"
      - "`get` prefiksi ishlatilmasligi kerak"
      - "Metodlar async bo'lishi kerak"
    answer: 0
    explain: "Info va Data shovqin so'zlari: ular ma'noga hech narsa qo'shmaydi. Agar uchta metod haqiqatan turli narsa qaytarsa, farqni ifodalovchi nom kerak: `getDriver`, `getDriverWithLicense`, `getDriverStatsForMonth`."
  - q: "Funksiya imzosi `copyRoute(r1: Route, r2: Route)`. Qaysi nomlash eng yaxshi?"
    options:
      - "`copyRoute(a: Route, b: Route)`"
      - "`copyRoute(route: Route, route2: Route)`"
      - "`copyRoute(routeData: Route, routeInfo: Route)`"
      - "`copyRoute(source: Route, target: Route)`"
    answer: 3
    explain: "`source` va `target` parametrlarning rolini aytadi, ya'ni ma'noli farq yaratadi. Raqamli suffiks va Info/Data juftligi faqat kompilyatorni qoniqtiradi, o'quvchiga qaysi biri qaysi ekanini aytmaydi."
  - q: "Qaysi holat disinformatsiyaga emas, balki oqilona nomga misol?"
    options:
      - "`isValid` funksiyasi validatsiya qilib, xatoda exception otadi"
      - "`totalAmount` soliqsiz summani saqlaydi, soliqli summa `totalAmountWithVat`da"
      - "`getUser` funksiyasi foydalanuvchi topilmasa yangisini yaratadi"
      - "`hp` o'zgaruvchisi gipotenuzani saqlaydi"
    answer: 1
    explain: "`totalAmount` va `totalAmountWithVat` farqi nomda aniq ko'rinadi, garchi `subtotal` yanada aniqroq bo'lardi. Qolganlari nom va xatti-harakat orasidagi nomuvofiqlik: `isValid` boolean kutadi, `getUser` yon ta'sirsiz o'qishni va'da qiladi, `hp` boshqa ma'noga ega keng tarqalgan qisqartma."
  - q: "Jamoada `customer` va `client` so'zlari bitta tushuncha uchun aralash ishlatiladi. Bu qaysi turdagi muammo?"
    options:
      - "Faqat estetik muammo, chunki ma'no bir xil"
      - "Linter hal qiladigan formatlash muammosi"
      - "O'quvchini ular turli tushunchalar deb o'ylashga majbur qiladigan farq: u qayerda nima farq borligini qidiradi"
      - "TypeScript buni tip darajasida aniqlaydi"
    answer: 2
    explain: "Ikki xil so'z o'quvchiga ikki xil tushuncha haqida signal beradi. Farq yo'qligini isbotlash uchun u kodni o'qishi kerak. Bu mavzu izchillik haqidagi 18-darsda davom etadi."
  - q: "`interface VehicleTable { ... }` - bu TypeScript tipi ma'lumotlar bazasidagi jadval qatorini tasvirlaydi. Qachon `Table` so'zi shovqin emas?"
    options:
      - "Hech qachon, u har doim shovqin"
      - "Agar loyihada Kysely kabi kutubxona ishlatilsa va jadval qatori tipi (`VehicleTable`) domen tipi (`Vehicle`) bilan yonma-yon yashasa, `Table` ularni ma'noli farqlaydi"
      - "Faqat tip juda katta bo'lsa"
      - "Faqat interfeys eksport qilinmasa"
    answer: 1
    explain: "Martin `Table` kabi tuzilma so'zlarini shovqin deb ataydi, lekin bu bir xil narsani ikki marta aytganda to'g'ri. Agar `Vehicle` (domen) va `VehicleTable` (DB qatori) ikki xil shakl bo'lsa, so'z haqiqiy farqni ifodalaydi."
task:
  title: "Ijara modulidagi yolg'on va shovqin nomlarni tozalash"
  prompt: |
    Quyidagi kod avtomobil ijarasi bron'larini qayta ishlaydi. U ishlaydi, lekin nomlarning bir qismi yolg'on gapiradi, bir qismi esa ma'nosiz farq yaratadi.

    1. Har bir muammoli nomni toping va u disinformatsiyami yoki ma'nosiz farqmi, belgilang.
    2. Nomlarni shunday o'zgartiringki, har bir nom ifodalayotgan narsasiga mos kelsin va farqlar ma'noli bo'lsin.
    3. Agar nom xatti-harakatga mos kelmasa, nomni yoki xatti-harakatni tuzating va qaysi birini tanlaganingizni izohlang.
  lang: ts
  starter: |
    type Booking = { id: string; carId: string; fromMs: number; toMs: number; cancelled: boolean };
    type BookingInfo = { id: string; carId: string; fromMs: number; toMs: number; totalPrice: number };

    const bookingList = new Map<string, Booking>();

    export function isAvailable(carId: string, fromMs: number, toMs: number): Booking[] {
      const result: Booking[] = [];
      for (const b of bookingList.values()) {
        if (b.carId === carId && !b.cancelled && b.fromMs < toMs && fromMs < b.toMs) {
          result.push(b);
        }
      }
      return result;
    }

    export function getBookingData(b1: Booking, dailyRate: number): BookingInfo {
      const days = Math.ceil((b1.toMs - b1.fromMs) / 86_400_000);
      return { id: b1.id, carId: b1.carId, fromMs: b1.fromMs, toMs: b1.toMs, totalPrice: days * dailyRate };
    }

    export function getBooking(id: string): Booking {
      const found = bookingList.get(id);
      if (found) return found;
      const created: Booking = { id, carId: "", fromMs: 0, toMs: 0, cancelled: false };
      bookingList.set(id, created);
      return created;
    }
  solution: |
    type Booking = { id: string; carId: string; fromMs: number; toMs: number; isCancelled: boolean };
    type PricedBooking = Booking & { totalPrice: number };

    const MS_PER_DAY = 24 * 60 * 60 * 1000;

    const bookingsById = new Map<string, Booking>();

    export function findOverlappingBookings(carId: string, fromMs: number, toMs: number): Booking[] {
      return [...bookingsById.values()].filter(
        (booking) =>
          booking.carId === carId &&
          !booking.isCancelled &&
          booking.fromMs < toMs &&
          fromMs < booking.toMs,
      );
    }

    export function isCarAvailable(carId: string, fromMs: number, toMs: number): boolean {
      return findOverlappingBookings(carId, fromMs, toMs).length === 0;
    }

    export function priceBooking(booking: Booking, dailyRate: number): PricedBooking {
      const rentalDays = Math.ceil((booking.toMs - booking.fromMs) / MS_PER_DAY);
      return { ...booking, totalPrice: rentalDays * dailyRate };
    }

    export function findBooking(id: string): Booking | undefined {
      return bookingsById.get(id);
    }
  solutionNotes: |
    - `isAvailable` disinformatsiya edi: `is` boolean va'da qiladi, lekin massiv qaytarardi. Massiv qaytaruvchi funksiya `findOverlappingBookings` bo'ldi, boolean kerak bo'lganlar uchun haqiqiy `isCarAvailable` qo'shildi.
    - `bookingList` Map edi, List emas. `bookingsById` tuzilma haqida yolg'on aytmaydi va kalit nima ekanini bildiradi.
    - `Booking` va `BookingInfo` ma'nosiz farq edi. Ikkinchisi aslida narxi hisoblangan bron, shuning uchun `PricedBooking`.
    - `getBookingData` -> `priceBooking`: "Data" hech narsa demasdi, yangi nom amalni aytadi.
    - `b1` raqamli nom edi, `b2` yo'q edi. Oddiy `booking` yetarli.
    - `getBooking` topilmasa jimgina bo'sh bron yaratardi. Bu nom va xatti-harakat orasidagi eng xavfli nomuvofiqlik: o'qish deb o'ylangan chaqiruv holatni o'zgartiradi. Biz xatti-harakatni nomga moslab, `findBooking` qildik va `undefined` qaytardik. Agar yaratish haqiqatan kerak bo'lsa, u `getOrCreateBooking` deb ochiq nomlanishi kerak edi.
    - `cancelled` -> `isCancelled`: boolean maydonlar uchun izchil prefiks (16-dars).
  checklist:
    - "`is`/`has` bilan boshlanadigan har bir nom boolean qaytaradi"
    - "Tuzilma so'zi (List, Map, Array) faqat haqiqiy tuzilmaga mos kelganda qoldi yoki umuman yo'q"
    - "Info, Data kabi shovqin so'zlar o'rniga farqni ifodalovchi so'z topildi"
    - "Raqamli nomlar (b1, b2) rol nomlari bilan almashtirildi"
    - "`get` nomli funksiya yashirin yaratish yoki yozish qilmaydi"
---

## Muammo

Oldingi darsda (11-dars) noaniq nomlarni ko'rdik: `d`, `getThem`, `check`. Ular o'quvchini to'xtatib, savol berishga majbur qiladi. Bu yoqimsiz, lekin nisbatan xavfsiz: o'quvchi tushunmaganini biladi va qidiradi.

Undan xavfliroq holat bor: nom **aniq ko'rinadi, lekin yolg'on gapiradi**. `isAvailable()` massiv qaytaradi. `getUser()` foydalanuvchi topilmasa yangisini yaratadi. `activeVehicleList` aslida `Set`. `totalAmount` QQSni o'z ichiga oladimi, yo'qmi, noma'lum va ikki faylda ikki xil. Bunday nomlarni o'qigan dasturchi to'xtamaydi, chunki savol tug'ilmaydi. U nomga ishonadi va shu ishonch asosida kod yozadi. Xato code review'dan o'tadi, chunki reviewer ham nomga ishonadi.

Ikkinchi muammo - nomlar orasidagi **soxta farqlar**. Bir modulda `getDriver`, `getDriverInfo` va `getDriverData` bor. Ular nima bilan farq qiladi? Nomdan bilib bo'lmaydi. Uchta funksiyani ochib solishtirish kerak va ko'pincha ma'lum bo'ladiki, ikkitasi deyarli bir xil ish qiladi, uchinchisi esa boshqa jadvaldan o'qiydi. Bu farqlar o'quvchi uchun emas, faqat kompilyator uchun qilingan: ikkita funksiya bir xil nomga ega bo'la olmagani uchun kimdir so'z qo'shgan.

## Asosiy g'oya

Martin *Clean Code*ning 2-bobida bu ikki muammoni alohida qoidalar sifatida beradi.

**Disinformatsiyadan qoching.** Nom o'quvchiga noto'g'ri signal bermasligi kerak. Martinning misollari:

- `accountList` deb faqat haqiqiy List bo'lgan narsani atash kerak. Dasturchilar uchun "List" so'zi aniq texnik ma'noga ega. Agar bu massiv bo'lmasa, nom o'quvchini adashtiradi. `accounts` yoki `accountGroup` xavfsizroq.
- Keng tarqalgan qisqartmalarni boshqa ma'noda ishlatmaslik. Martin `hp`, `aix`, `sco` kabi Unix platformalari nomlarini o'zgaruvchi nomi qilishni misol qiladi: ular tanish narsaga ishora qiladi va o'quvchini chalg'itadi.
- Bir-biridan juda kichik farq qiladigan uzun nomlar. Ikkita deyarli bir xil uzun nomni bir qarashda farqlash qiyin va IDE avtoto'ldirishda noto'g'risini tanlash oson.
- Kichik `l` va katta `O` harflarini yolg'iz nom sifatida ishlatish, chunki ular ko'p shriftlarda `1` va `0` ga o'xshaydi.

**Ma'noli farq qiling.** Agar ikki narsaning nomi farq qilsa, ular ma'nosi bilan ham farq qilishi kerak. Martin ikki xil buzilishni ko'rsatadi:

- **Raqamli seriya**: `a1`, `a2`, ... `aN`. Bunday nomlar hech qanday ma'lumot bermaydi. Uning misoli: `copyChars(a1, a2)` o'rniga `copyChars(source, destination)`. Parametrlar endi o'z rolini aytadi.
- **Shovqin so'zlar**: `Info`, `Data`, `Object`, `a`, `the`. `ProductInfo` va `ProductData` - ikki xil nom, lekin bir xil ma'no. Martin bu so'zlarni "a", "an", "the" artikllari kabi bo'sh qo'shimcha deb hisoblaydi. U yana bir misolni keltiradi: `getActiveAccount()`, `getActiveAccounts()` va `getActiveAccountInfo()` bir loyihada bo'lsa, dasturchi qaysi birini chaqirishni qanday biladi?

Martin bu yerda ortiqcha so'zni ham shovqin deb ataydi: o'zgaruvchi nomida `variable` so'zi, jadval nomida `table` so'zi, `NameString` (ism string bo'lmasa nima bo'lardi?), `customerObject`. Uning tekshiruv usuli: nomlarni o'quvchi farqni sezishi mumkin bo'ladigan qilib ajrating. Agar `moneyAmount` va `money`, `customerInfo` va `customer` bir xil narsa bo'lsa, ulardan birini tanlang.

McConnell *Code Complete*da qochish kerak bo'lgan nomlar ro'yxatida o'xshash g'oyalarni beradi: o'xshash ma'noli nomlar (bir scope'da `input` va `inputValue`), ma'nosi boshqa, lekin ko'rinishi o'xshash nomlar, ichida raqam bor nomlar, faqat harf registri bilan farqlanadigan nomlar (`vehicle` va `Vehicle` bir funksiyada ikki xil narsa uchun). Uning tekshiruvi: agar ikki nomni almashtirib qo'ysangiz va kod o'quvchiga bir xil ma'noli bo'lib qolsa, nomlar yaxshi tanlanmagan.

## Chuqurroq: yolg'onning turlari

Disinformatsiyani amalda to'rt guruhga bo'lish foydali. Ularning hammasi bitta qoidaning buzilishi: nom va voqelik bir-biriga mos kelmaydi.

### 1. Tuzilma haqidagi yolg'on

`vehicleList` (aslida `Map`), `userArray` (aslida `Set`), `config` (aslida funksiya). TypeScript'da bu muammo kamroq og'riydi, chunki IDE tipni ko'rsatadi. Lekin kod review'da, diff'da va loglarda tip ko'rinmaydi, faqat nom ko'rinadi. Eng xavfsiz yo'l - tuzilmani umuman nomga qo'ymaslik: `vehicles`, `vehiclesById`, `activeDriverIds`. `ById` qo'shimchasi tuzilmani emas, kalitning ma'nosini aytadi va bu foydali ma'lumot.

### 2. Xatti-harakat haqidagi yolg'on

Bu eng qimmat turi. Nom bir narsani va'da qiladi, funksiya boshqa narsa qiladi:

- `get*` yoki `find*` holatni o'zgartiradi (yangi yozuv yaratadi, kesh'ni tozalaydi, hisoblagichni oshiradi).
- `is*`, `has*`, `can*` boolean emas, boshqa narsa qaytaradi yoki exception otadi.
- `validate*` ma'lumotni jimgina o'zgartiradi (trim, lowercase) va o'zgargan qiymatni qaytaradi.
- `calculate*` tarmoq so'rovi yuboradi.

Martin funksiyalar haqidagi bobda bu holatni alohida ko'radi: yashirin yon ta'sir (side effect) funksiya nomi aytmagan ishni qiladi va vaqtinchalik bog'liqlik (temporal coupling) yaratadi. Bu mavzuni 24-darsda davom ettiramiz. Hozir uchun qoida: agar funksiya nomi aytmagan narsani qilsa, yoki nomni o'zgartiring (`getOrCreateUser`), yoki xatti-harakatni.

### 3. Domen haqidagi yolg'on

`totalAmount` soliqli summami yoki soliqsiz? `activeDrivers` hozir smenada bo'lganlarmi yoki ishdan bo'shatilmaganlarmi? `fuelUsed` litrdami yoki foizdami? Nomning o'zi to'g'ri, lekin u bir nechta biznes tushunchasiga mos keladi va turli fayllarda turli ma'noda ishlatiladi. Ousterhout bu holatni aniqlik yo'qligi deb ataydi (11-dars). Yechim - aniqlashtirish: `subtotal` va `totalWithVat`, `onShiftDrivers` va `employedDrivers`, `fuelUsedLiters`.

### 4. Eskirgan nom

Nom yozilgan paytda to'g'ri edi, lekin kod o'zgardi, nom esa qoldi. `sendSmsNotification` endi Telegram orqali ham yuboradi. `legacyPriceCalculator` yagona narx kalkulyatori bo'lib qolgan. `tempFix` uch yildan beri ishlaydi. Bu eng keng tarqalgan disinformatsiya va uning sababi texnik emas: nomni o'zgartirish xavfli va zerikarli tuyuladi. Buni xavfsiz qilish usullarini 20-darsda ko'ramiz.

### Shovqin so'zlar qachon shovqin emas

Martin `Info` va `Data`ni shovqin deydi, lekin bu so'zlar o'z-o'zidan yomon emas. Ular **bir xil narsani ikki marta atash** uchun ishlatilganda shovqin. Agar ikki tip haqiqatan ham ikki xil shakl bo'lsa, farqni ifodalovchi so'z kerak va u ba'zan tuzilmaviy bo'ladi:

- Kysely kabi query builder'larda `VehicleTable` (DB jadvalining ustun tiplari), `Vehicle` (`Selectable<VehicleTable>`), `NewVehicle` (`Insertable<VehicleTable>`) - bu uch xil shakl va nomlar farqni ochiq aytadi.
- NestJS'da `CreateVehicleDto` va `Vehicle` entity - biri tashqi kirish shartnomasi, ikkinchisi domen modeli.

Savol har doim bir xil: nomlar orasidagi farq o'quvchiga narsalar orasidagi haqiqiy farqni aytadimi?

## Misol: haydovchilar moduli

```ts
// drivers.service.ts (yomon)
export class DriversService {
  async getDriver(id: string) { /* drivers jadvalidan bitta qator */ }
  async getDriverInfo(id: string) { /* drivers + licenses join */ }
  async getDriverData(id: string) { /* oylik statistika, boshqa servisdan */ }
  async isActive(id: string) { /* Driver | null qaytaradi */ }
}
```

To'rtta metod, to'rtta muammo. Birinchi uchtasi o'quvchiga qaysi birini chaqirish kerakligini aytmaydi. To'rtinchisi `is` bilan boshlanadi, lekin boolean emas, obyekt qaytaradi. Chaqiruvchi `if (await service.isActive(id))` yozadi va bu tasodifan ishlaydi (obyekt truthy), lekin ertaga kimdir natijani `=== true` bilan solishtiradi va xato paydo bo'ladi.

```ts
type DriverId = string;

type Driver = { id: DriverId; fullName: string; employmentStatus: "employed" | "dismissed" };
type DriverWithLicense = Driver & { licenseCategories: string[]; licenseExpiresAt: Date };
type DriverMonthlyStats = { driverId: DriverId; month: string; distanceKm: number; harshBrakingCount: number };

export interface DriversRepository {
  findById(id: DriverId): Promise<Driver | null>;
  findWithLicense(id: DriverId): Promise<DriverWithLicense | null>;
}

export interface DriverStatsClient {
  fetchMonthlyStats(id: DriverId, month: string): Promise<DriverMonthlyStats>;
}

export class DriversService {
  constructor(
    private readonly drivers: DriversRepository,
    private readonly stats: DriverStatsClient,
  ) {}

  findDriver(id: DriverId): Promise<Driver | null> {
    return this.drivers.findById(id);
  }

  findDriverWithLicense(id: DriverId): Promise<DriverWithLicense | null> {
    return this.drivers.findWithLicense(id);
  }

  fetchMonthlyStats(id: DriverId, month: string): Promise<DriverMonthlyStats> {
    return this.stats.fetchMonthlyStats(id, month);
  }

  async isEmployed(id: DriverId): Promise<boolean> {
    const driver = await this.drivers.findById(id);
    return driver?.employmentStatus === "employed";
  }
}
```

Nima o'zgardi:

- **`Info` va `Data` haqiqiy farq bilan almashtirildi.** `WithLicense` qaytariladigan narsa nima bilan boyitilganini, `MonthlyStats` esa butunlay boshqa tushuncha ekanini aytadi.
- **`find` va `fetch` farqi.** `find*` lokal ombordan, natija bo'lmasligi mumkin. `fetch*` tashqi servisdan, tarmoq bilan. Bu konvensiya jamoada kelishilgan bo'lsa, nom o'quvchiga narx va xatar haqida ham ma'lumot beradi (18-dars).
- **`isActive` -> `isEmployed` va haqiqiy boolean.** "Active" ham noaniq edi: smenada yoki ishda? Domenda `employmentStatus` bor, nom unga mos keldi.

## Qachon qo'llamaslik kerak

- **Tashqi shartnomalar.** Agar API javobidagi maydon `driverData` deb nomlangan va u allaqachon mobil ilovalarda ishlatilsa, uni bir tomonlama o'zgartirib bo'lmaydi. Ichki kodda yaxshi nom ishlating va chegarada (DTO, mapper) moslashtiring. Tashqi nomni o'zgartirish - bu alohida migratsiya (20-dars).
- **Freymvork va kutubxona konvensiyalari.** React Query'da `data`, Axios'da `response.data`, Prisma'da `include` natijasi. Bu umumiy so'zlarni almashtirish uchun wrapper yozish ko'pincha foydadan ko'p chalkashlik keltiradi.
- **Haqiqatan ham umumiy kod.** Generic yordamchi funksiyada (`chunk<T>(items: T[], size: number)`) `items` yoki `value` nomlari to'g'ri, chunki kod domenni bilmaydi va bilmasligi kerak.
- **Tuzilmaviy farq haqiqiy bo'lsa.** Yuqorida aytilganidek, `VehicleRow` va `Vehicle`, `CreateVehicleDto` va `Vehicle` - shovqin emas. "Info/Data taqiqlangan" degan qoidani mexanik qo'llash bu farqni yo'qotishi mumkin.
- **Xatti-harakat va nom nomuvofiqligini nom bilan yashirish.** Agar `getUser` yaratish ham qilsa, uni `getOrCreateUser` deb atash to'g'ri. Lekin ba'zan to'g'ri yechim nomni emas, dizaynni o'zgartirish: o'qish va yaratishni ajratish.

## Stack'da: NestJS, Prisma, React

- **NestJS DTO'lari.** `UserDto`, `UserInfoDto`, `UserDataDto` uchligi o'rniga yo'nalish va amal: `CreateUserDto`, `UpdateUserProfileDto`, `UserResponseDto`.
- **Prisma `include` natijalari.** `Prisma.DriverGetPayload<{ include: { license: true } }>` tipiga `DriverWithLicense` nomi bering. `DriverFull` yoki `DriverExtended` qaysi relatsiyalar kiritilganini aytmaydi.
- **React hook'lari.** `useVehicleData` va `useVehicleInfo` bitta loyihada bo'lsa, farq nomda yo'q. `useVehicle(id)` va `useVehicleTelemetry(id)` ma'noni aytadi.
- **Boolean prop'lar.** `<Map isLoading={trips} />` kabi xatoni TypeScript ushlaydi, lekin `isVisible` aslida "ko'rinishi mumkin" degan ruxsatni bildirsa, bu yolg'onni hech qaysi tip ushlamaydi. `canView` yoki `isPermitted` aniqroq.
- **Env o'zgaruvchilari.** `API_URL` qaysi API? Bir nechta tashqi servis bo'lsa, `TELEMETRY_API_URL`, `PAYMENTS_API_URL`.

## Xulosa

- Yolg'on nom noaniq nomdan xavfliroq: o'quvchi to'xtamaydi, nomga ishonadi va xato review'dan o'tadi.
- Disinformatsiyaning to'rt turi: tuzilma, xatti-harakat, domen va eskirgan nom haqidagi yolg'on. Eng qimmati - xatti-harakat haqidagisi.
- Nomlar orasidagi farq narsalar orasidagi haqiqiy farqni ifodalashi kerak. Raqamli seriya va Info/Data juftliklari faqat kompilyatorni qoniqtiradi.
- Shovqin so'z bir narsani ikki marta atash uchun ishlatilganda shovqin. Haqiqiy tuzilmaviy farqni ifodalaganda u foydali.
- Tashqi shartnomalardagi yomon nomlarni chegarada moslashtiring, ichki kodda esa aniq nom ishlating.
