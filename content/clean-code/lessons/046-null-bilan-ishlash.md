---
n: 46
slug: null-bilan-ishlash
title: "null va undefined bilan ishlash"
summary: "null qaytarish chaqiruvchiga tekshiruv yukini yuklaydi, null uzatish esa uni yanada yomonlashtiradi. Darsda Martinning null haqidagi qoidalarini, Special Case (Null Object) refaktoringini va TypeScript'ning strictNullChecks, noUncheckedIndexedAccess va exactOptionalPropertyTypes sozlamalari bilan null'ni nazorat ostiga olishni ko'ramiz."
duration: 40
sources:
  - id: cc1
    note: "\"Error Handling\" bobidagi \"Don't Return Null\" va \"Don't Pass Null\" bo'limlari"
  - id: refactoring-catalog
    note: "Introduce Special Case (Introduce Null Object) refaktoringi"
  - id: ts-tsconfig-strict
    note: "strict oilasiga kiruvchi strictNullChecks va unga yaqin, lekin strict'ga kirmaydigan noUncheckedIndexedAccess, exactOptionalPropertyTypes sozlamalari"
quiz:
  - q: "Martin \"null qaytarmang\" qoidasini nima bilan asoslaydi?"
    options:
      - "null qaytaradigan har bir funksiya chaqiruvchiga tekshiruv yukini yuklaydi, bitta unutilgan tekshiruv esa tizimni nazoratsiz holatga olib keladi"
      - "null xotirada ko'p joy egallaydi"
      - "null JSON'ga aylanmaydi"
      - "null faqat Java'da muammo"
    answer: 0
    explain: "Martin null qaytarish o'z-o'zimizga ish yaratish ekanini aytadi: har bir chaqiruvchi tekshirishi kerak, va bittasi unutsa NullPointerException (JS'da TypeError) chiqadi. U o'rniga exception, bo'sh to'plam yoki Special Case obyekti taklif qiladi."
  - q: "`function findTrips(driverId): Trip[] | null` - null'ni qaytarishning eng yaxshi alternativasi qaysi?"
    options:
      - "undefined qaytarish"
      - "Har doim throw qilish"
      - "Bo'sh massiv qaytarish: \"sayohat yo'q\" va \"sayohatlar ro'yxati\" bir xil tip bilan ifodalanadi va chaqiruvchi tekshirmasdan iteratsiya qiladi"
      - "-1 qaytarish"
    answer: 2
    explain: "To'plam qaytaradigan funksiyalar uchun bo'sh to'plam tabiiy Special Case. `for...of`, `map`, `length` bo'sh massivda to'g'ri ishlaydi. undefined qaytarish null bilan bir xil muammo."
  - q: "`tsconfig`da `strict: true` yoqilgan. Qaysi sozlama unga KIRMAYDI va alohida yoqilishi kerak?"
    options:
      - "strictNullChecks"
      - "noImplicitAny"
      - "strictPropertyInitialization"
      - "noUncheckedIndexedAccess"
    answer: 3
    explain: "`noUncheckedIndexedAccess` (indeks orqali olingan qiymatga `| undefined` qo'shadi) va `exactOptionalPropertyTypes` `strict` oilasiga kirmaydi va alohida yoqiladi. strictNullChecks, noImplicitAny va strictPropertyInitialization esa strict'ning bir qismi."
  - q: "Special Case (Null Object) qachon foydali?"
    options:
      - "\"Yo'q\" holati uchun ko'p chaqiruvchilar bir xil standart xatti-harakatni takrorlaganda (masalan, noma'lum mijoz uchun \"Mehmon\" nomi va 0 chegirma)"
      - "Har qanday null o'rniga"
      - "Faqat DB qatorlari uchun"
      - "Xato holatlarni yashirish uchun"
    answer: 0
    explain: "Special Case chaqiruvchilardagi takroriy `if (x === null)` tekshiruvlarini bitta obyektga yig'adi. Lekin agar \"yo'q\" holati turli joylarda turlicha qayta ishlansa yoki u xato bo'lsa, Special Case xatoni yashiradi."
  - q: "`exactOptionalPropertyTypes` yoqilganda `type Patch = { note?: string }` uchun `{ note: undefined }` nima bo'ladi?"
    options:
      - "Ruxsat etiladi, chunki `?` undefined degani"
      - "Kompilyatsiya xatosi: ixtiyoriy maydon yo'q bo'lishi mumkin, lekin unga ochiq undefined berish mumkin emas (agar tipda `| undefined` yozilmagan bo'lsa)"
      - "Runtime xatosi"
      - "Maydon avtomatik o'chiriladi"
    answer: 1
    explain: "Bu sozlama \"maydon yo'q\" va \"maydon bor, qiymati undefined\" ni farqlaydi. PATCH so'rovlarida bu muhim: \"o'zgartirma\" va \"tozala\" ikki xil ma'no."
  - q: "Non-null assertion (`user!.id`) haqida qaysi baho to'g'ri?"
    options:
      - "U runtime'da null'ni tekshiradi"
      - "U har doim xavfsiz"
      - "U kompilyatorga \"menga ishon\" deydi va runtime'da hech narsa qilmaydi; noto'g'ri bo'lsa xato keyinroq va uzoqroq joyda chiqadi"
      - "U undefined'ni null'ga aylantiradi"
    answer: 2
    explain: "`!` tip darajasidagi yolg'on bo'lishi mumkin. Uni ishlatish o'rniga toraytirish (narrowing), guard clause yoki xato tashlaydigan yordamchi funksiya (masalan, `getOrThrow`) ishonchliroq."
task:
  title: "Haydovchi reytingi servisidagi null'larni tartibga solish"
  prompt: |
    Quyidagi servis haydovchining reytingini hisoblaydi. Unda null qaytarish, null uzatish va `!` operatorlari aralashgan.

    1. Har bir `null` qaysi ma'noni bildirishini aniqlang: "topilmadi" (xato), "hali yo'q" (normal holat) yoki "bo'sh to'plam".
    2. To'plam qaytaradigan funksiyalar bo'sh massiv qaytarsin.
    3. Majburiy topilishi kerak bo'lgan narsa uchun xato tashlaydigan funksiya yozing.
    4. "Haydovchining tarifi yo'q" holati uchun Special Case obyekti kiriting.
    5. `!` operatorlarini olib tashlang.
  lang: ts
  starter: |
    type Trip = { id: string; driverId: string; score: number };
    type Driver = { id: string; name: string; tariffId: string | null };
    type Tariff = { id: string; bonusPerPoint: number };

    interface Db {
      findDriver(id: string): Promise<Driver | null>;
      findTrips(driverId: string): Promise<Trip[] | null>;
      findTariff(id: string): Promise<Tariff | null>;
    }

    export class RatingService {
      constructor(private readonly db: Db) {}

      async bonus(driverId: string): Promise<number | null> {
        const driver = await this.db.findDriver(driverId);
        if (driver === null) return null;
        const trips = await this.db.findTrips(driverId);
        const avg = this.average(trips);
        const tariff = driver.tariffId ? await this.db.findTariff(driver.tariffId) : null;
        return avg! * (tariff ? tariff.bonusPerPoint : 0);
      }

      private average(trips: Trip[] | null): number | null {
        if (trips === null || trips.length === 0) return null;
        return trips.reduce((s, t) => s + t.score, 0) / trips.length;
      }
    }
  solution: |
    type Trip = { id: string; driverId: string; score: number };
    type Driver = { id: string; name: string; tariffId: string | null };

    interface Tariff {
      readonly id: string;
      bonusFor(averageScore: number): number;
    }

    class PerPointTariff implements Tariff {
      constructor(readonly id: string, private readonly bonusPerPoint: number) {}
      bonusFor(averageScore: number): number {
        return averageScore * this.bonusPerPoint;
      }
    }

    // Special Case: tarifsiz haydovchi bonus olmaydi
    const NO_TARIFF: Tariff = { id: "none", bonusFor: () => 0 };

    export class DriverNotFoundError extends Error {
      constructor(readonly driverId: string) {
        super(`Haydovchi topilmadi: ${driverId}`);
        this.name = "DriverNotFoundError";
      }
    }

    interface Db {
      findDriver(id: string): Promise<Driver | null>;
      findTrips(driverId: string): Promise<Trip[]>; // topilmasa []
      findTariff(id: string): Promise<{ id: string; bonusPerPoint: number } | null>;
    }

    export class RatingService {
      constructor(private readonly db: Db) {}

      async bonus(driverId: string): Promise<number> {
        const driver = await this.getDriverOrThrow(driverId);
        const trips = await this.db.findTrips(driverId);
        const avg = averageScore(trips);
        if (avg === undefined) return 0; // sayohat yo'q - bonus yo'q, bu normal holat
        const tariff = await this.tariffOf(driver);
        return tariff.bonusFor(avg);
      }

      private async getDriverOrThrow(id: string): Promise<Driver> {
        const driver = await this.db.findDriver(id);
        if (!driver) throw new DriverNotFoundError(id);
        return driver;
      }

      private async tariffOf(driver: Driver): Promise<Tariff> {
        if (driver.tariffId === null) return NO_TARIFF;
        const row = await this.db.findTariff(driver.tariffId);
        return row ? new PerPointTariff(row.id, row.bonusPerPoint) : NO_TARIFF;
      }
    }

    function averageScore(trips: readonly Trip[]): number | undefined {
      if (trips.length === 0) return undefined;
      return trips.reduce((s, t) => s + t.score, 0) / trips.length;
    }
  solutionNotes: |
    - Uch xil "yo'q" ajratildi: haydovchi topilmadi - xato (`DriverNotFoundError`), sayohatlar yo'q - bo'sh massiv, tarif yo'q - Special Case (`NO_TARIFF`).
    - `bonus()` endi `number | null` emas, `number` qaytaradi. Chaqiruvchilar null tekshiruvidan ozod.
    - `avg!` yo'qoldi. Starter'da sayohatsiz haydovchi uchun `null * 0 = 0` tasodifan to'g'ri natija berardi, lekin tarif bo'lsa `null * 5 = 0` ham jim o'tardi - bu yashirin xato edi. Endi bu holat ochiq qayta ishlanadi.
    - `averageScore` hamon `undefined` qaytaradi: "o'rtacha qiymat yo'q" haqiqiy holat, va u faqat bitta joyda, darhol qayta ishlanadi. Null qaytarishni butunlay taqiqlash shart emas, uning ta'sir doirasini toraytirish kerak.
    - Tarif xatti-harakatga ega interfeysga aylandi, shunda Special Case shunchaki "0 qiymat" emas, balki to'liq obyekt.
    - DB'da tarif ID bor, lekin tarif o'chirilgan bo'lsa ham `NO_TARIFF` qaytadi. Bu biznes qarori: agar u xato hisoblanishi kerak bo'lsa, xato tashlang. Special Case xatoni yashirmasligi kerak.
  checklist:
    - "To'plam qaytaradigan funksiya null emas, bo'sh massiv qaytaradi"
    - "Majburiy topilishi kerak bo'lgan obyekt uchun nomlangan xato tashlanadi"
    - "Special Case obyekti takroriy null tekshiruvlarini almashtirdi"
    - "Non-null assertion (!) qolmadi"
    - "Public metod null qaytarmaydi"
    - "Qolgan undefined qiymatlar lokal va darhol qayta ishlanadi"
---

## Muammo

Tony Hoare null referenslarni 1965-yilda ALGOL W uchun kiritganini va keyinchalik buni "milliard dollarlik xato" deb ataganini aytgan. JavaScript bu xatoni ikki barobar qildi: `null` va `undefined`. Bunga `NaN`, bo'sh satr va `0` ni ham "qiymat yo'q" ma'nosida ishlatadigan kodni qo'shing.

Real NestJS servisidan:

```ts
async getVehicleReport(id: string) {
  const vehicle = await this.repo.findById(id);
  const driver = vehicle?.driverId ? await this.drivers.findById(vehicle.driverId) : null;
  const trips = await this.trips.findByVehicle(id); // null yoki []?
  return {
    plate: vehicle!.plate,
    driverName: driver?.name ?? "",
    tripCount: trips?.length || 0,
  };
}
```

Bu yerda `null` to'rt xil ma'noda ishlatilgan: "mashina topilmadi" (aslida xato, lekin `!` bilan yashirilgan), "haydovchi biriktirilmagan" (normal holat), "haydovchi o'chirilgan" (ma'lumotlar mos kelmasligi), "sayohat yo'q" (bo'sh ro'yxat bo'lishi kerak edi). Va javobda bo'sh satr `driverName: ""` - "nomi yo'q haydovchi" va "haydovchi yo'q" ni farqlab bo'lmaydi.

Har bir `?.` va `??` - kichik qaror, va bu qarorlar butun kod bo'ylab tarqalgan. Ularning har biri boshqacha bo'lishi mumkin.

## Asosiy g'oya

Martin *Clean Code*ning xatolar bilan ishlash bobida ikki qisqa qoidani beradi.

### Null qaytarmang

Martin kuzatishicha, null qaytaradigan funksiya o'ziga va chaqiruvchilarga ish yaratadi: har bir chaqiruvchi tekshirishi kerak, va bitta unutilgan tekshiruv dasturni nazoratsiz holatga olib keladi. Uning fikricha, null qaytarib biz o'zimizga ish yaratamiz va muammoni chaqiruvchilarga yuklaymiz.

Uning taklif qiladigan alternativalari:

- **Xato tashlash.** Agar "topilmadi" haqiqatan xato bo'lsa (masalan, ID URL'dan kelgan va bunday yozuv bo'lishi kerak), `NotFoundError` tashlang.
- **Bo'sh to'plam qaytarish.** Martinning misolida xodimlar ro'yxatini qaytaradigan metod null o'rniga bo'sh ro'yxat qaytaradi, va chaqiruvchidagi null tekshiruvi yo'qoladi.
- **Special Case obyekti.** "Yo'q" holati uchun standart xatti-harakatga ega obyekt (Fowler'ning Special Case pattern'i).

### Null uzatmang

Ikkinchi qoida yanada qat'iyroq: argument sifatida null uzatish null qaytarishdan ham yomonroq. Martin buni ikki nuqta (`Point`) qabul qilib, ular asosida hisob qiladigan metod misolida ko'rsatadi: kimdir null uzatsa, metod ichida nima qilish kerak? Xato tashlash, assert qilish - bularning hech biri muammoni hal qilmaydi, faqat qachon va qanday xato chiqishini o'zgartiradi. Uning xulosasi: aksariyat tillarda tasodifan uzatilgan null bilan yaxshi ishlashning usuli yo'q, shuning uchun eng oqilona yondashuv - null uzatishni sukut bo'yicha taqiqlash.

Martin bu qoidalarni Java kontekstida yozgan, u yerda har qanday referens null bo'lishi mumkin edi. TypeScript'da `strictNullChecks` bu vaziyatni tubdan o'zgartiradi, va keyingi bo'lim aynan shu haqida.

## Chuqurroq: TypeScript null'ni tipga aylantiradi

### strictNullChecks

`strictNullChecks` (u `strict` oilasining bir qismi) yoqilganda `null` va `undefined` boshqa tiplarga avtomatik kirmaydi. `string` - faqat satr. `string | null` - satr yoki null, va uni ishlatishdan oldin toraytirish kerak.

Bu Martinning qoidalarini qisman avtomatlashtiradi:

- "Null uzatmang" endi kompilyator darajasida: parametr `Point` bo'lsa, `null` uzatish xato.
- "Null qaytarmang" esa **ko'rinadigan** bo'ladi: `Promise<Vehicle | null>` imzosi chaqiruvchiga tekshirish kerakligini aytadi va unutishga yo'l qo'ymaydi.

Demak TS'da savol "null qaytarish mumkinmi" dan "null qaytarish qachon eng aniq tip" ga o'zgaradi. `findById(id): Promise<Vehicle | null>` - repository darajasida to'liq halol imzo: "topilmasligi mumkin, siz hal qiling". Muammo `| null` tarqalib, har qatlam uni keyingisiga uzatib, hech kim qaror qilmasa paydo bo'ladi.

### strict'ga kirmaydigan ikki sozlama

Ikki muhim sozlama `strict: true` bilan avtomatik yoqilmaydi va ularni alohida yoqish kerak:

- **`noUncheckedIndexedAccess`.** Indeks orqali olingan qiymatga `| undefined` qo'shadi. `rows[0]` - `Row | undefined`, `record[key]` - `T | undefined`. Busiz `const first = trips[0]; first.id` bo'sh massivda runtime xato beradi, kompilyator esa jim.
- **`exactOptionalPropertyTypes`.** `{ note?: string }` uchun "maydon yo'q" va "maydon bor, qiymati `undefined`" ni farqlaydi. PATCH API'larda bu muhim: "izohni o'zgartirma" va "izohni tozala" ikki xil buyruq.

Ikkalasi ham mavjud loyihada ko'plab xatolarni ochadi, shuning uchun ularni yangi loyihada boshidan yoqish osonroq.

### null va undefined: bittasini tanlang

JS'da ikkalasi ham bor va ular turlicha paydo bo'ladi: `undefined` - JS'ning o'zi bergan "yo'q" (yo'q maydon, qiymatsiz o'zgaruvchi, `Array.find` natijasi), `null` - dasturchi ataylab qo'ygan "yo'q" (ko'pincha DB va JSON'dan). Amaliy kelishuv: ichki kodda bittasini (ko'p jamoalar `undefined`ni) ishlating, chegarada (DB, API) boshqasini aylantiring. Prisma nullable ustunlar uchun `null` qaytaradi, shuning uchun repository qatlamida qaror qiling.

### Non-null assertion va optional chaining

- **`x!`** kompilyatorga "bu null emas, menga ishon" deydi. Runtime'da hech narsa qilmaydi. Agar noto'g'ri bo'lsa, xato boshqa joyda, kontekstsiz chiqadi. O'rniga toraytirish yoki nomlangan xato tashlaydigan yordamchi (`getOrThrow`) ishlating.
- **`a?.b?.c ?? default`** qisqa, lekin har bir `?.` "bu yerda yo'qlik normal" degan qaror. Agar u aslida xato bo'lsa, `?.` xatoni yashiradi va noto'g'ri default qiymat bilan davom etadi.
- **`||` va `??` farqi.** `count || 10` `0`ni ham `10`ga aylantiradi. Son va bo'sh satr uchun `??` ishlating.

### Special Case

Fowler katalogida bu refaktoring **Introduce Special Case** (taxallusi: Introduce Null Object) deb ataladi. Katalogdagi misolda `aCustomer === "unknown"` tekshiruvi o'rniga `UnknownCustomer` klassi paydo bo'ladi, uning `name` getter'i standart nomni qaytaradi. Chaqiruvchilar endi maxsus qiymatni tekshirmaydi, standart xatti-harakatni obyektning o'zi beradi.

Bu pattern faqat "yo'q" holati uchun **bir xil** standart xatti-harakat ko'p joyda takrorlanganda foydali. Agar har chaqiruvchi uni boshqacha qayta ishlasa, Special Case yordam bermaydi.

## Misol: biriktirilgan haydovchi

Yomon:

```ts
async function dispatchMessage(vehicleId: string, text: string): Promise<void> {
  const vehicle = await vehicles.findById(vehicleId);
  const driver = vehicle && vehicle.driverId ? await drivers.findById(vehicle.driverId) : null;
  if (driver && driver.phone) {
    await sms.send(driver.phone, text);
  }
  // mashina topilmasa ham, haydovchi yo'q bo'lsa ham - jim
}
```

Uch xil holat - mashina yo'q (xato), haydovchi biriktirilmagan (normal), haydovchida telefon yo'q (ma'lumot sifati muammosi) - bir xil jim natija beradi.

Yaxshi:

```ts
export class VehicleNotFoundError extends Error {
  constructor(readonly vehicleId: string) {
    super(`Transport topilmadi: ${vehicleId}`);
    this.name = "VehicleNotFoundError";
  }
}

type DispatchResult =
  | { kind: "sent" }
  | { kind: "no_driver_assigned" }
  | { kind: "driver_has_no_phone"; driverId: string };

async function getVehicleOrThrow(id: string): Promise<Vehicle> {
  const vehicle = await vehicles.findById(id);
  if (!vehicle) throw new VehicleNotFoundError(id);
  return vehicle;
}

export async function dispatchMessage(vehicleId: string, text: string): Promise<DispatchResult> {
  const vehicle = await getVehicleOrThrow(vehicleId);
  if (vehicle.driverId === null) return { kind: "no_driver_assigned" };

  const driver = await drivers.getOrThrow(vehicle.driverId);
  if (driver.phone === null) return { kind: "driver_has_no_phone", driverId: driver.id };

  await sms.send(driver.phone, text);
  return { kind: "sent" };
}

type Vehicle = { id: string; driverId: string | null };
type Driver = { id: string; phone: string | null };
declare const vehicles: { findById(id: string): Promise<Vehicle | null> };
declare const drivers: { getOrThrow(id: string): Promise<Driver> };
declare const sms: { send(phone: string, text: string): Promise<void> };
```

Nima o'zgardi va nega:

- **Xato va normal holat ajratildi.** Mashina topilmasa - xato, chunki chaqiruvchi mavjud ID bergan bo'lishi kerak edi. Haydovchi biriktirilmagani - normal biznes holati.
- **Natija aniq.** `void` o'rniga `DispatchResult` union: chaqiruvchi (masalan, dispetcher UI) nima bo'lganini biladi va foydalanuvchiga to'g'ri xabar ko'rsatadi.
- **`null` faqat ma'noli joyda.** `driverId: string | null` - DB'dagi nullable ustunning halol aksi. U darhol, bitta joyda qayta ishlanadi va tashqariga chiqmaydi.
- **`getOrThrow` yordamchisi** "majburiy topilishi kerak" holatlarini bitta naqshga keltiradi. Uni repository'da bir marta yozasiz.

## Qachon qo'llamaslik kerak

- **"Hech qachon null qaytarmang" mutlaq qoida emas.** TS'da `findById(): Promise<T | null>` - halol va foydali imzo, ayniqsa repository darajasida. Unga xato tashlatish "yo'q bo'lishi normal" holatlarda (masalan, email bo'yicha foydalanuvchini qidirib, yo'q bo'lsa ro'yxatdan o'tkazish) exception'ni boshqaruv oqimi uchun ishlatishga olib keladi. Ikkala variantni ham bering: `find` (null) va `get` (throw).
- **Special Case xatoni yashirishi mumkin.** Agar "tarif yo'q" aslida ma'lumotlar buzilgani bo'lsa, `NO_TARIFF` qaytarish muammoni production'da ko'rinmas qiladi. Special Case faqat "yo'q" haqiqatan normal holat bo'lganda.
- **Optional maydonlarni yo'q qilishga urinmang.** Ba'zi narsalar haqiqatan ixtiyoriy (mijozning ikkinchi telefoni). `phone2?: string` - normal. Muammo bir nechta ixtiyoriy maydon birgalikda holatni kodlaganda (45-dars).
- **`noUncheckedIndexedAccess` narxi.** Indeks to'g'ri ekani aniq bo'lgan joylarda ham (`for (let i = 0; i < a.length; i++) a[i]`) `undefined` tekshiruvi talab qilinadi. Ko'pincha `for...of` yoki `entries()` bilan qayta yozish yechim, lekin ba'zan bu shovqin. Jamoa bilan kelishib yoqing.

## Stack'da: Prisma, NestJS, React

- **Prisma.** `findUnique` - `T | null`, `findUniqueOrThrow` - `T` yoki xato. Servis qatlamida "majburiy" holatlar uchun `OrThrow` variantini ishlating va uning xatosini domen xatosiga aylantiring (48-dars). `findMany` hech qachon null qaytarmaydi, faqat `[]`.
- **NestJS.** Controller'dan `null` qaytarish 200 javob va bo'sh tana beradi, bu ko'pincha mijozni chalg'itadi. Topilmagan resurs uchun domen xatosini tashlang va uni filter'da 404'ga aylantiring.
- **React.** Komponent `null` qaytarishi - normal va idiomatik ("hech narsa chizma"). Lekin props'da `user: User | null` ni chuqur uzatish o'rniga, yuqorida toraytiring va pastki komponentlarga faqat `User` bering. "Yuklanmoqda / yo'q / bor" uchun union state ishlating.
- **API javoblari.** JSON'da `null` va maydonning yo'qligi turli ma'noga ega bo'lishi mumkin. Kelishuvni hujjatlang va zod sxemasida `.nullable()` va `.optional()` ni ongli tanlang.

## Xulosa

- Martin: null qaytarmang, null uzatmang. Alternativalar - xato tashlash, bo'sh to'plam, Special Case.
- TypeScript'da `strictNullChecks` null'ni ko'rinadigan tipga aylantiradi; `noUncheckedIndexedAccess` va `exactOptionalPropertyTypes` esa strict'ga kirmaydi va alohida yoqiladi.
- `T | null` imzosi halol bo'lishi mumkin, muammo u qatlamlar bo'ylab qaror qilinmasdan tarqalganda.
- Har bir "yo'q" ning ma'nosini aniqlang: xato, normal holat yoki bo'sh to'plam, va har biriga mos vosita tanlang.
- `!` va uzun `?.` zanjirlari xatolarni yashiradi. Toraytirish va `getOrThrow` ishonchliroq.
