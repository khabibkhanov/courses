---
n: 59
slug: klass-olchami
title: "Klass o'lchami, God object, klass yoki modul"
summary: "Klass qanchalik katta bo'lishi kerak? Martin mas'uliyatlar bo'yicha o'lchashni, Ousterhout chuqurlik bo'yicha o'lchashni taklif qiladi. Bu darsda ikkala qarashni, God object alomatlari va uni bo'lish usullarini, hamda TypeScript'da klass o'rniga oddiy modul va funksiyalar qachon yaxshiroq ekanini ko'ramiz."
duration: 35
sources:
  - id: cc1
    note: "Klasslar haqidagi bob: klasslar kichik bo'lishi kerak, mas'uliyatlar soni bilan o'lchanadi, cohesion, katta klassni bo'lish orqali kichik klasslar paydo bo'lishi"
  - id: refactoring
    note: "Large Class code smell, Extract Class, Extract Superclass va Replace Type Code with Subclasses kabi refaktoringlar"
  - id: aposd
    note: "Chuqur modullar va classitis tanqidi; birga yoki alohida degan bob"
  - id: typescript-eslint
    note: "no-extraneous-class qoidasi: faqat static a'zolardan iborat, nom fazosi sifatida ishlatilgan klasslar"
quiz:
  - q: "Clean Code'da Martin klass o'lchamini nima bilan o'lchashni taklif qiladi?"
    options:
      - "Qatorlar soni bilan"
      - "Metodlar soni bilan"
      - "Mas'uliyatlar soni bilan: klass nomini qisqa ta'riflab bo'lmasa yoki unda \"va\", \"yoki\" kabi so'zlar kerak bo'lsa, u katta"
      - "Maydonlar soni bilan"
    answer: 2
    explain: "Martin funksiyalarni qatorlar bilan o'lchasa, klasslarni mas'uliyatlar bilan o'lchaydi. Klassni 25 so'z atrofida \"if, and, or, but\" kabi so'zlarsiz ta'riflay olish kerak degan mezonni beradi."
  - q: "`FleetManager` klassida 45 ta metod va 18 ta maydon bor. Har bir metod maydonlarning faqat 2-3 tasini ishlatadi va metodlar maydonlar bo'yicha 4 ta guruhga bo'linadi. Bu nimani anglatadi?"
    options:
      - "Klass ichida 4 ta yashirin klass bor: cohesion past va Extract Class orqali ajratish tabiiy"
      - "Klass to'g'ri tuzilgan"
      - "Metodlarni kichikroq qilish kerak"
      - "Maydonlarni public qilish kerak"
    answer: 0
    explain: "Martin cohesion'ni metodlar klass o'zgaruvchilaridan qanchalik ko'p foydalanishi bilan bog'laydi. Metodlar maydonlarning alohida guruhlarini ishlatsa, bu guruhlar alohida klass bo'lishni so'raydi. Fowler'ning Large Class smell'i uchun ham shu Extract Class yechimi."
  - q: "Martin va Ousterhout klass o'lchami bo'yicha qanday farq qiladi?"
    options:
      - "Ular to'liq kelishadi"
      - "Martin katta klasslarni, Ousterhout kichiklarni afzal ko'radi"
      - "Ikkalasi ham faqat qatorlar soniga qaraydi"
      - "Martin kichik, bitta mas'uliyatli klasslarni afzal ko'radi; Ousterhout chuqurlikni asosiy mezon qiladi va ko'plab kichik sayoz klasslar (classitis) ham murakkablik ekanini ta'kidlaydi"
    answer: 3
    explain: "Bu munozaraning markazi. Martin katta klasslar xavfini, Ousterhout haddan tashqari bo'linish xavfini ko'proq ko'radi. Ikkala mezonni birga ishlatish mumkin: mas'uliyat (kim o'zgartiradi) va chuqurlik (interfeys narxi)."
  - q: "TypeScript'da `class PriceUtils { static vat(x: number) {...} static round(x: number) {...} }` haqida qaysi baho to'g'ri?"
    options:
      - "Bu yaxshi, chunki hamma narsa klassda bo'lishi kerak"
      - "Bu klass hech qanday holat yoki nusxa saqlamaydi: u faqat nom fazosi. ES modul va eksport qilingan funksiyalar xuddi shu ishni sodda qiladi va tree-shaking bilan yaxshiroq ishlaydi"
      - "Static metodlar har doim tezroq"
      - "Bu Singleton pattern"
    answer: 1
    explain: "Java'da klass yagona modul birligi, TypeScript'da esa fayl modulning o'zi. Holatsiz static klass faqat nom fazosi vazifasini bajaradi. typescript-eslint'da `no-extraneous-class` qoidasi aynan shuni ushlaydi."
  - q: "God object'ni bo'lishda eng xavfsiz birinchi qadam qaysi?"
    options:
      - "Uni noldan qayta yozish"
      - "Har bir metodni alohida klassga chiqarish"
      - "Mavjud xatti-harakatni testlar bilan qayd qilib, metodlarni maydonlar va o'zgarish sabablari bo'yicha guruhlash, keyin eng aniq guruhni Extract Class bilan kichik qadamlarda ajratish"
      - "Klassni ikki teng qismga bo'lish"
    answer: 2
    explain: "Katta klassni noldan qayta yozish xavfli va qimmat. Fowler refaktoringni kichik, xatti-harakatni saqlaydigan qadamlar bilan qilishni tavsiya qiladi. Guruhlash cohesion (maydonlar) va SRP (kim o'zgartiradi) bo'yicha qilinadi."
  - q: "Qaysi holatda klass funksiyalar modulidan yaxshiroq tanlov?"
    options:
      - "Obyekt invariantni saqlashi kerak bo'lgan o'zgaruvchan holatga ega bo'lsa yoki bir nechta bog'liqlik bilan uzoq yashaydigan nusxa kerak bo'lsa (masalan, NestJS provider)"
      - "Funksiya 10 qatordan oshsa"
      - "Har doim, chunki OOP yaxshiroq"
      - "Hech qachon"
    answer: 0
    explain: "Klass holat va invariantni inkapsulyatsiya qilish, bir nechta metod umumiy bog'liqliklarni ulashishi va DI konteyner bilan ishlash uchun foydali. Holatsiz hisoblash uchun funksiyalar sodda."
task:
  title: "God object'ni o'zgarish sabablari bo'yicha bo'lish"
  prompt: |
    Ijara platformasidagi `RentalManager` klassi yillar davomida o'sgan. Quyida uning qisqartirilgan versiyasi. Klass 3 xil guruh tomonidan o'zgartiriladi: narxlash (moliya), shartnoma hujjatlari (yuridik bo'lim) va mashina mavjudligi (operatsiyalar).

    1. Metodlarni qaysi maydonlarni ishlatishi va kim o'zgartirishi bo'yicha guruhlang.
    2. Extract Class bilan guruhlarni ajrating. Holatsiz qismlarni klass emas, funksiya qiling.
    3. Ommaviy kirish nuqtasini saqlang yoki uni nima uchun olib tashlaganingizni tushuntiring.
    4. Haddan tashqari bo'lmang: har bir metod uchun klass yaratmang.
  lang: ts
  starter: |
    type Car = { id: string; dailyRateUzs: number; class: "economy" | "business" };
    type Booking = { carId: string; from: Date; to: Date; customerName: string };

    export class RentalManager {
      private bookings: Booking[] = [];
      private readonly vatRate = 0.12;
      private readonly seasonalMultiplier = 1.2;
      private readonly contractTemplate = "SHARTNOMA\nIjarachi: {name}\nMashina: {car}\nMuddat: {from} - {to}\nSumma: {total}";

      constructor(private readonly cars: Car[]) {}

      isAvailable(carId: string, from: Date, to: Date): boolean {
        return !this.bookings.some((b) => b.carId === carId && b.from < to && from < b.to);
      }
      book(b: Booking): void {
        if (!this.isAvailable(b.carId, b.from, b.to)) throw new Error("busy");
        this.bookings.push(b);
      }
      days(from: Date, to: Date): number {
        return Math.ceil((to.getTime() - from.getTime()) / 86_400_000);
      }
      price(carId: string, from: Date, to: Date, summer: boolean): number {
        const car = this.cars.find((c) => c.id === carId)!;
        const base = car.dailyRateUzs * this.days(from, to) * (summer ? this.seasonalMultiplier : 1);
        return Math.round(base * (1 + this.vatRate));
      }
      contractText(b: Booking, summer: boolean): string {
        return this.contractTemplate
          .replace("{name}", b.customerName)
          .replace("{car}", b.carId)
          .replace("{from}", b.from.toISOString().slice(0, 10))
          .replace("{to}", b.to.toISOString().slice(0, 10))
          .replace("{total}", String(this.price(b.carId, b.from, b.to, summer)));
      }
    }
  solution: |
    export type Car = { id: string; dailyRateUzs: number; class: "economy" | "business" };
    export type Booking = { carId: string; from: Date; to: Date; customerName: string };

    // --- Operatsiyalar: mavjudlik (holat va invariant -> klass) ---
    export class CarSchedule {
      private readonly bookings: Booking[] = [];

      isAvailable(carId: string, from: Date, to: Date): boolean {
        return !this.bookings.some((b) => b.carId === carId && b.from < to && from < b.to);
      }

      /** Invariant: bitta mashina uchun bandlovlar kesishmaydi. */
      book(booking: Booking): void {
        if (!this.isAvailable(booking.carId, booking.from, booking.to)) {
          throw new CarUnavailableError(booking.carId);
        }
        this.bookings.push(booking);
      }
    }

    export class CarUnavailableError extends Error {
      constructor(readonly carId: string) {
        super(`Car is already booked for this period: ${carId}`);
      }
    }

    // --- Moliya: narxlash (holatsiz -> funksiyalar) ---
    const VAT_RATE = 0.12;
    const SUMMER_MULTIPLIER = 1.2;
    const DAY_MS = 86_400_000;

    export function rentalDays(from: Date, to: Date): number {
      return Math.ceil((to.getTime() - from.getTime()) / DAY_MS);
    }

    export function rentalPriceUzs(car: Car, from: Date, to: Date, season: "summer" | "regular"): number {
      const multiplier = season === "summer" ? SUMMER_MULTIPLIER : 1;
      const base = car.dailyRateUzs * rentalDays(from, to) * multiplier;
      return Math.round(base * (1 + VAT_RATE));
    }

    // --- Yuridik bo'lim: shartnoma matni (holatsiz -> funksiya) ---
    const isoDate = (d: Date) => d.toISOString().slice(0, 10);

    export function rentalContractText(booking: Booking, totalUzs: number): string {
      return [
        "SHARTNOMA",
        `Ijarachi: ${booking.customerName}`,
        `Mashina: ${booking.carId}`,
        `Muddat: ${isoDate(booking.from)} - ${isoDate(booking.to)}`,
        `Summa: ${totalUzs}`,
      ].join("\n");
    }
  solutionNotes: |
    - Uch guruh topildi: `bookings` maydonini ishlatadigan metodlar (operatsiyalar), `vatRate`/`seasonalMultiplier`ni ishlatadiganlar (moliya) va `contractTemplate`ni ishlatadigan (yuridik). Maydonlar bo'yicha guruhlash va aktorlar bo'yicha guruhlash bir xil natija berdi - bu yaxshi signal.
    - Faqat `CarSchedule` klass bo'lib qoldi, chunki u o'zgaruvchan holat va invariantni (kesishmaydigan bandlovlar) saqlaydi. Narx va shartnoma holatsiz, shuning uchun funksiyalar.
    - Shartnoma endi narxni o'zi hisoblamaydi, tayyor summani oladi: yuridik bo'lim moliya qoidalariga bog'liq emas.
    - `summer: boolean` flag argument union'ga aylandi (23-dars), `find(...)!` olib tashlandi: chaqiruvchi `Car`ni o'zi beradi.
    - `RentalManager` facade'ini olib tashladik, chunki u faqat uzatardi. Agar ko'p chaqiruvchilar uch qadamni birga bajarsa, `bookCar` use-case funksiyasi qo'shish mumkin.
    - Biz 5 ta metod uchun 5 ta klass yaratmadik: 1 klass va 2 ta kichik funksiyalar moduli.
  checklist:
    - "Har bir qism bitta aktor tomonidan o'zgartiriladi"
    - "Faqat holat va invariant saqlaydigan qism klass bo'lib qoldi"
    - "Shartnoma moduli narx hisoblash qoidalarini bilmaydi"
    - "Non-null assertion va flag argument yo'qoldi"
    - "Har bir metod uchun alohida klass yaratilmagan"
---

## Muammo

Har bir yetuk loyihada bitta shunday fayl bor: `OrderService.ts`, 2500 qator, 60 ta metod, 20 ta injekt qilingan bog'liqlik. Har bir yangi feature shu faylga tushadi, chunki "buyurtma bilan bog'liq hamma narsa shu yerda". Har bir pull request'da conflict, har bir test fayli 15 ta mock bilan boshlanadi va hech kim klassning hammasini tushunmaydi. Bu **God object**: hamma narsani biladigan va hamma narsa qiladigan obyekt.

Teskari loyiha ham bor: `CreateOrderValidator`, `CreateOrderMapper`, `CreateOrderPersister`, `CreateOrderNotifier`, `CreateOrderHandler`, `CreateOrderFacade`. Har biri 20 qator. Buyurtma yaratishni tushunish uchun oltita faylni ochish kerak va ularning hech birida butun jarayon ko'rinmaydi.

Ikkalasi ham noto'g'ri o'lcham. Savol: to'g'ri o'lchamni qanday aniqlash kerak?

## Asosiy g'oya

Robert Martin *Clean Code*ning klasslar haqidagi bobida birinchi qoidani beradi: klasslar kichik bo'lishi kerak. Ikkinchi qoida: ular bundan ham kichikroq bo'lishi kerak. Lekin u o'lchovni aniq ko'rsatadi: funksiyalarni qatorlar bilan o'lchasak, klasslarni **mas'uliyatlar** bilan o'lchaymiz.

Martin bir nechta amaliy mezon beradi:

- **Nom.** Klass nomi uning mas'uliyatini ifodalashi kerak. Agar qisqa nom topa olmasangiz, yoki nom `Processor`, `Manager`, `Super` kabi noaniq so'zlarga muhtoj bo'lsa, klass ehtimol ko'p narsa qiladi.
- **Qisqa ta'rif.** Klassni taxminan 25 so'zda, "if", "and", "or", "but" so'zlarisiz ta'riflay olish kerak.
- **Cohesion.** Har bir metod klassning bir yoki bir nechta maydonini ishlatishi kerak. Metodlar qancha ko'p maydonni ishlatsa, cohesion shuncha yuqori. Martin kuzatadiki, funksiyalarni kichik qilish va parametrlarni kamaytirish ba'zan faqat bir nechta metod ishlatadigan maydonlarni ko'paytiradi. Bu klass ichida boshqa klass yashirinib yotganini bildiradi.

Bu mezonlar 53-darsdagi SRP bilan bog'liq: katta klass odatda bir nechta aktor tomonidan o'zgartiriladi.

## Chuqurroq: ikki maktab, God object va TypeScript

### Martin va Ousterhout

John Ousterhout *A Philosophy of Software Design*da boshqa tomondan qaraydi. Uning asosiy mezoni - chuqurlik (52-dars): klass qancha funksionallikni qanchalik kichik interfeys ortida yashiradi. U "klasslar kichik bo'lishi kerak" degan maslahatni o'z-o'zidan qo'llash ko'plab sayoz klasslarga (classitis) olib kelishini ta'kidlaydi. Har bir kichik klass o'z interfeysini qo'shadi va tizimning umumiy murakkabligi oshadi.

Bu ikki qarash qarama-qarshi ko'rinadi, lekin ular bir-birini to'ldiradi:

- Martin mezoni (mas'uliyatlar, kim o'zgartiradi) klassni **qayerdan bo'lish** kerakligini aytadi.
- Ousterhout mezoni (chuqurlik, interfeys narxi) **qachon to'xtash** kerakligini aytadi.

Katta, lekin bitta aktorga tegishli va kichik interfeysga ega klass ko'pincha yaxshi. Kichik, lekin pass-through metodlarga to'la va chaqiruvchi ularni ma'lum tartibda birlashtirishi kerak bo'lgan klasslar ko'pincha yomon. 2024-2025 yillardagi Ousterhout va Martin munozarasida ham bu masala bo'yicha to'liq kelishuv yo'q edi. Halol xulosa: ikkala xavf ham real, va sizning kod bazangizda qaysi biri ustun ekanini kuzating.

### God object alomatlari

Martin Fowler *Refactoring*da **Large Class** smell'ini tasvirlaydi: klass juda ko'p ish qilishga urinsa, unda ko'pincha juda ko'p maydon bo'ladi va takrorlanish paydo bo'ladi. Amaliy alomatlar:

- Maydonlar guruhlarga bo'linadi va har bir metod faqat bitta guruhni ishlatadi. Masalan, `depositAmount` va `depositCurrency` doim birga ishlatiladi: bu alohida klass so'raydi.
- Bir xil prefiks yoki suffiksli maydonlar va metodlar (`invoice*`, `*Pdf`).
- Konstruktorda o'nlab bog'liqlik va har bir metod ularning faqat bittasi yoki ikkitasini ishlatadi.
- Klass bir nechta aktor tomonidan o'zgartiriladi va git log'da turli jamoalarning commit'lari aralash.
- Testlar uchun o'nlab mock kerak va har bir test ularning ko'pchiligini e'tiborsiz qoldiradi.

### Bo'lish usullari

Fowler katalogidagi asosiy refaktoring - **Extract Class**: birga ishlatiladigan maydonlar va ularni ishlatadigan metodlarni yangi klassga ko'chirish. Agar farq ma'lumot turiga bog'liq bo'lsa (tip kodi bo'yicha `if`lar), polimorfizm yoki union (27-dars). Agar bir nechta klassda umumiy qism bo'lsa, Extract Superclass mavjud, lekin 58-darsdagi sabablarga ko'ra avval delegatsiyani ko'rib chiqing.

Muhim: bo'lishni kichik qadamlar bilan qiling. Avval xatti-harakatni test bilan qayd qiling (79-dars characterization test), keyin bitta guruhni ajrating, testlarni ishga tushiring, commit qiling. God object'ni noldan qayta yozish odatda yangi God object bilan tugaydi.

### Klass yoki modul

Martin va Fowler kitoblari asosan Java tajribasiga tayanadi, u yerda klass kodni tashkil etishning yagona birligi. TypeScript'da esa **fayl modulning o'zi**: u o'z scope'iga ega, faqat eksport qilingan narsalar tashqariga chiqadi va ichki funksiyalar private. Bu ikki muhim natijaga olib keladi:

1. **Holatsiz klass ko'pincha keraksiz.** `class PriceUtils { static vat(...) {} }` hech qanday nusxa yoki holat saqlamaydi, u faqat nom fazosi. Eksport qilingan funksiyalar xuddi shu ishni qiladi, bundler esa ishlatilmagan funksiyalarni olib tashlay oladi. typescript-eslint'ning `no-extraneous-class` qoidasi faqat static a'zolardan iborat klasslarni ushlaydi.
2. **Inkapsulyatsiya klasssiz ham bor.** Modul ichidagi eksport qilinmagan funksiya va o'zgaruvchilar `private`dan kuchliroq yashirilgan: ularni hatto `as` bilan ham olib bo'lmaydi.

Klass qachon yaxshiroq:

- **O'zgaruvchan holat va invariant.** `CarSchedule` bandlovlar ro'yxatini saqlaydi va ular kesishmasligini kafolatlaydi. Holat va uni o'zgartiradigan qoidalar birga yashashi kerak.
- **Umumiy bog'liqliklarga ega bir nechta amal.** Repository yoki API client: bir xil `db` yoki `http` bog'liqligini ulashadigan metodlar.
- **Framework talabi.** NestJS provider'lari, controller'lari va DI konteyneri klasslarga tayanadi (57-dars).
- **Bir nechta nusxa.** Har biri o'z konfiguratsiyasiga ega obyektlar (har bir tenant uchun alohida client).

Holatsiz hisoblash, transformatsiya va validatsiya uchun funksiyalar sodda, testlash oson va kompozitsiya qilinadi (58-dars).

## Misol: NestJS'dagi God service

```ts
@Injectable()
export class VehicleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gps: GpsGateway,
    private readonly fuel: FuelSensorClient,
    private readonly mailer: MailerService,
    private readonly pdf: PdfRenderer,
    private readonly s3: S3Client,
    private readonly config: ConfigService,
  ) {}

  findOne(id: string) { /* prisma */ }
  updatePlate(id: string, plate: string) { /* prisma */ }
  livePosition(id: string) { /* gps */ }
  routeForDay(id: string, day: Date) { /* gps + prisma */ }
  fuelLevel(id: string) { /* fuel */ }
  detectFuelTheft(id: string) { /* fuel + prisma + mailer */ }
  monthlyReportPdf(id: string, month: string) { /* prisma + pdf + s3 */ }
  emailMonthlyReport(id: string, month: string) { /* pdf + s3 + mailer */ }
  insuranceExpiresSoon() { /* prisma + mailer + config */ }
}
```

Metodlarni bog'liqliklar va aktorlar bo'yicha guruhlaymiz:

| Guruh | Metodlar | Bog'liqliklar | Aktor |
| --- | --- | --- | --- |
| Reyestr | `findOne`, `updatePlate`, `insuranceExpiresSoon` | prisma, mailer, config | Park ma'muriyati |
| Treking | `livePosition`, `routeForDay` | gps, prisma | Dispetcherlar |
| Yoqilg'i | `fuelLevel`, `detectFuelTheft` | fuel, prisma, mailer | Xavfsizlik |
| Hisobotlar | `monthlyReportPdf`, `emailMonthlyReport` | prisma, pdf, s3, mailer | Moliya |

Natija - to'rtta NestJS modulidagi to'rtta servis:

```ts
@Injectable()
export class VehicleRegistry {
  constructor(private readonly prisma: PrismaService) {}
  findOne(id: string) { return this.prisma.vehicle.findUnique({ where: { id } }); }
  updatePlate(id: string, plate: string) {
    return this.prisma.vehicle.update({ where: { id }, data: { plate: normalizePlate(plate) } });
  }
}

@Injectable()
export class VehicleTracking {
  constructor(private readonly gps: GpsGateway, private readonly prisma: PrismaService) {}
  livePosition(id: string) { return this.gps.lastPosition(id); }
  routeForDay(id: string, day: Date) { /* ... */ }
}

// FuelMonitoring va MonthlyFleetReports xuddi shunday, o'z modullarida.

function normalizePlate(plate: string): string {
  return plate.toUpperCase().replace(/\s+/g, "");
}
```

Nima o'zgardi va nima o'zgarmadi:

- **Har bir servisda 1-3 bog'liqlik.** Testlar uchun mock soni keskin kamaydi.
- **Har bir servis bitta aktorga tegishli.** Moliya hisobot formatini o'zgartirganda dispetcherlar kodiga tegilmaydi.
- **Servislar hali ham chuqur.** `MonthlyFleetReports.emailMonthlyReport` PDF yaratish, yuklash va yuborishni bitta chaqiruv ortida yashiradi. Biz har bir qadam uchun klass yaratmadik.
- **`normalizePlate` funksiya bo'ldi.** U holatsiz va klass kerak emas.
- **`insuranceExpiresSoon` haqida savol qoladi.** U reyestrga tegishlimi yoki alohida "eslatmalar" aktorigami? Bu texnik emas, tashkiliy savol va jamoa bilan hal qilinadi.

## Qachon qo'llamaslik kerak

- **Raqamlarga qarab bo'lish.** "Klass 200 qatordan oshmasin" degan qoida mexanik bo'lishga olib keladi. 400 qatorli, bitta aktorli, kichik interfeysli klass ko'pincha bo'lingan to'rtta klassdan yaxshiroq.
- **Har bir fe'l uchun klass.** `UserCreator`, `UserUpdater`, `UserDeleter` - bu SRP emas, bu classitis. Ular bir xil ma'lumot va bir xil aktor bilan ishlaydi.
- **Barqaror, kam o'zgaradigan katta klass.** Agar katta klass yillar davomida o'zgarmagan va xatosiz ishlasa, uni bo'lishning narxi foydasidan oshishi mumkin. Refaktoring o'zgarish kerak bo'lgan joyda eng ko'p foyda beradi (6 va 78-darslar).
- **Hamma narsani funksiyaga aylantirish.** Holat va invariant bor joyda (savat, jadval, kesh) funksiyalar va tashqi o'zgaruvchan obyekt inkapsulyatsiyani yo'qotadi. Klass bu yerda to'g'ri vosita.
- **Domen hali tushunilmagan.** Guruhlar va aktorlar aniq bo'lmasa, erta bo'lish noto'g'ri chegaralar yaratadi. Bir oz katta, lekin oson ko'chiriladigan klass yaxshiroq.

## Stack'da: NestJS, React va TypeScript

- **NestJS servis signali.** Konstruktordagi bog'liqliklar soni oddiy, lekin foydali signal. Ular ko'paysa va metodlar ularning turli qismlarini ishlatsa, bu Extract Class vaqti. Lekin bitta raqamga sig'inmang: ba'zi orkestratsiya servislari haqiqatan ko'p bog'liqlikka muhtoj.
- **Modul fayllari.** NestJS bo'lmagan kodda (domen qoidalari, util'lar, Next.js server action'lari) klass o'rniga funksiyalar eksport qiladigan modul ko'pincha soddaroq. Bitta fayl - bitta tushuncha.
- **React komponentlari.** God component (500 qator, o'nlab `useState`, bir nechta `useEffect`) xuddi shu muammo. Yechim ham o'xshash: holatni custom hook'larga, UI'ni kichik komponentlarga ajratish. Lekin har bir `div` uchun komponent yaratmang.
- **typescript-eslint.** `no-extraneous-class` faqat static a'zolardan iborat klasslarni ushlaydi. `max-lines` va `max-classes-per-file` kabi qoidalar signal sifatida foydali, lekin ularni xato emas, ogohlantirish darajasida tuting.
- **Prisma generatsiya qilgan tiplar.** God object ko'pincha bitta katta Prisma modeli atrofida o'sadi. Har bir aktor uchun alohida select va DTO (53-dars) klasslarni ham tabiiy ravishda ajratadi.

## Xulosa

- Martin klasslarni mas'uliyatlar bilan o'lchaydi: nom, qisqa ta'rif va cohesion (metodlar maydonlardan qanchalik ko'p foydalanadi).
- Ousterhout chuqurlikni asosiy mezon qiladi va classitis'dan ogohlantiradi. Martin qayerdan bo'lishni, Ousterhout qachon to'xtashni aytadi.
- God object alomatlari: maydonlar guruhlari, ko'p bog'liqlik, turli aktorlar commit'lari, ko'p mock. Yechim: kichik qadamlar bilan Extract Class.
- TypeScript'da fayl modulning o'zi. Holatsiz static klass faqat nom fazosi, uni eksport qilingan funksiyalar bilan almashtiring.
- Klass holat va invariant, umumiy bog'liqliklar, framework talabi yoki bir nechta nusxa kerak bo'lganda o'rinli.
- O'lchamni qatorlar bilan emas, o'zgarish sabablari va interfeys narxi bilan baholang.
