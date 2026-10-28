---
n: 23
slug: argumentlar
title: "Argumentlar: soni, flaglar, parametr obyekti"
summary: "Har bir argument chaqiruvchi o'rganishi kerak bo'lgan interfeys qismi. Argumentlar soni, boolean flaglar, output argumentlar va bir xil tipdagi ketma-ket parametrlar qanday xatolarga olib keladi va ularni Introduce Parameter Object, Remove Flag Argument va TypeScript tiplari bilan qanday tuzatish mumkin."
duration: 35
sources:
  - id: cc1
    note: "3-bob \"Functions\": \"Function Arguments\" bo'limi - argumentlar soni, flag argumentlar, output argumentlar, argument obyektlari"
  - id: refactoring-catalog
    note: "Introduce Parameter Object, Remove Flag Argument, Preserve Whole Object, Parameterize Function"
  - id: refactoring
    note: "Remove Flag Argument va Introduce Parameter Object bo'limlari: flag argumentning ta'rifi va parametr obyektiga xatti-harakat ko'chirish"
  - id: effective-ts
    note: "Tiplar dizayni haqidagi bo'limlar: bir xil tipdagi takroriy parametrlardan qochish va aniqroq tiplarni afzal ko'rish"
quiz:
  - q: "`scheduleMaintenance(vehicleId, true, false)` chaqiruvidagi asosiy muammo nima?"
    options:
      - "Argumentlar soni uchtadan oshgan"
      - "Chaqiruv joyida boolean'lar nimani bildirishini o'qib bo'lmaydi va ularni almashtirib qo'yish tip xatosi bermaydi"
      - "vehicleId string bo'lishi kerak"
      - "Funksiya async emas"
    answer: 1
    explain: "Flag argumentlar chaqiruv joyida ma'nosiz qiymatlarga aylanadi va ikkita boolean'ni almashtirib qo'ysangiz, TypeScript hech narsa demaydi. Argumentlar soni uchta, bu o'z-o'zidan chegara emas."
  - q: "Fowler'ning Remove Flag Argument refaktoringi qachon eng o'rinli?"
    options:
      - "Flag qiymati ma'lumotdan (masalan, DB'dan) dinamik keladigan bo'lsa"
      - "Funksiyada faqat bitta boolean parametr bo'lsa, har doim"
      - "Chaqiruvchilar flag'ni literal (true/false) sifatida uzatadi va flag funksiya xatti-harakatini butunlay boshqa yo'lga burib yuboradi"
      - "Flag faqat logging'ni yoqib o'chirsa"
    answer: 2
    explain: "Flag literal bo'lib uzatilsa, chaqiruvchi aslida qaysi xatti-harakat kerakligini allaqachon biladi, demak alohida nomli funksiyalar aniqroq. Qiymat dinamik bo'lsa, chaqiruvchida if-else paydo bo'ladi va flag'ni qoldirish odatda yaxshiroq."
  - q: "`transfer(from: string, to: string, amount: number)` funksiyasidagi xavfni TypeScript'da qaysi yondashuv eng yaxshi kamaytiradi?"
    options:
      - "Parametrlarga JSDoc kommentlar yozish"
      - "Parametrlarni `any` qilish"
      - "Parametrlarni boshqa tartibda joylashtirish"
      - "Nomlangan maydonli obyekt (`{ from, to, amount }`) qabul qilish yoki `from`/`to` uchun alohida branded tiplar ishlatish"
    answer: 3
    explain: "Ikkita ketma-ket string parametr chaqiruv joyida almashtirib qo'yilishi mumkin. Obyekt parametr chaqiruvda nomlarni majburiy qiladi, branded tiplar esa almashtirishni kompilyatsiya xatosiga aylantiradi. Komment kompilyator tomonidan tekshirilmaydi."
  - q: "Martin output argumentlar haqida nima deydi?"
    options:
      - "Ulardan qochish kerak: o'quvchi argumentni kirish deb kutadi; holatni o'zgartirish kerak bo'lsa, u egasi bo'lgan obyektning holati bo'lsin"
      - "Ular performance uchun har doim afzal"
      - "Ular faqat ikkitadan ko'p bo'lmasa, normal"
      - "Ular TypeScript'da mavjud emas"
    answer: 0
    explain: "`appendFooter(report)` kabi chaqiruvda o'quvchi report kirish deb o'ylaydi, aslida u o'zgartiriladi. Martin bunday holda `report.appendFooter()` ko'rinishini yoki yangi qiymat qaytarishni afzal ko'radi. JS'da obyektlar havola bo'yicha uzatilgani uchun bu muammo real."
  - q: "Introduce Parameter Object qachon haqiqiy foyda beradi, shunchaki argumentlarni o'rab qo'yish emas?"
    options:
      - "Har doim, agar argumentlar ikkitadan ko'p bo'lsa"
      - "Argumentlar birga bitta tushunchani tashkil qilsa (data clump) va ular bilan bog'liq xatti-harakat yoki invariant obyektga ko'chishi mumkin bo'lsa"
      - "Faqat klass metodlari uchun"
      - "Faqat argumentlar bir xil tipda bo'lsa"
    answer: 1
    explain: "Fowler parametr obyektining asosiy qiymatini yangi tushunchani nomlash va unga xatti-harakat ko'chirishda ko'radi (masalan, DateRange va contains). Bog'liq bo'lmagan argumentlarni bitta `Options` ichiga yig'ish faqat muammoni yashiradi."
  - q: "Quyidagilardan qaysi biri flag argumentning qabul qilinadigan holati?"
    options:
      - "`saveUser(user, true)` - true admin ekanini bildiradi"
      - "`render(page, false)` - false sarlavhasiz chizishni bildiradi"
      - "`setNotificationsEnabled(userId, enabled)` - enabled foydalanuvchi sozlamasidan keladi va funksiya aynan shu qiymatni saqlaydi"
      - "`calculate(order, true, true)` - chegirma va soliqni yoqadi"
    answer: 2
    explain: "Bu yerda boolean ma'lumotning o'zi, xatti-harakatni boshqa yo'lga buradigan rejim emas. Funksiya nomi parametr ma'nosini aytadi. Qolgan uchtasida boolean funksiyani ikki xil ishga ajratadi."
task:
  title: "Hisobot funksiyasining imzosini tozalash"
  prompt: |
    Transport parki uchun yoqilg'i hisoboti funksiyasi 7 ta pozitsion parametr oladi, ikkitasi boolean flag. Chaqiruvlar o'qilmaydi va `from`/`to` sanalari bir necha marta almashtirib yuborilgan.

    1. Qaysi parametrlar birga bitta tushunchani tashkil qilishini aniqlang (data clump).
    2. Flag'lardan qaysi biri rejimni o'zgartiradi va qaysi biri oddiy ma'lumot ekanini ajrating.
    3. Imzoni qayta loyihalang: parametr obyekti, kerak bo'lsa alohida funksiyalar, va noto'g'ri sana oralig'ini yaratib bo'lmaydigan tip.
    4. Chaqiruv joyi qanday ko'rinishini ko'rsating.
  lang: ts
  starter: |
    type FuelEvent = { vehicleId: string; at: Date; liters: number; kind: "refuel" | "drain" };

    export function fuelReport(
      events: FuelEvent[],
      vehicleId: string,
      from: Date,
      to: Date,
      includeDrains: boolean,
      asCsv: boolean,
      minLiters: number,
    ): string {
      const rows = events.filter(
        (e) =>
          e.vehicleId === vehicleId &&
          e.at >= from &&
          e.at <= to &&
          e.liters >= minLiters &&
          (includeDrains || e.kind === "refuel"),
      );
      if (asCsv) {
        return ["at,liters,kind", ...rows.map((r) => `${r.at.toISOString()},${r.liters},${r.kind}`)].join("\n");
      }
      return JSON.stringify(rows);
    }

    // chaqiruv:
    // fuelReport(events, "01A123BC", new Date("2026-10-01"), new Date("2026-10-31"), true, true, 5);
  solution: |
    type FuelEventKind = "refuel" | "drain";
    type FuelEvent = { vehicleId: string; at: Date; liters: number; kind: FuelEventKind };

    export class DateRange {
      private constructor(readonly from: Date, readonly to: Date) {}

      static of(from: Date, to: Date): DateRange {
        if (from > to) throw new RangeError(`Invalid range: ${from.toISOString()} > ${to.toISOString()}`);
        return new DateRange(from, to);
      }

      contains(date: Date): boolean {
        return date >= this.from && date <= this.to;
      }
    }

    export type FuelReportQuery = {
      vehicleId: string;
      period: DateRange;
      kinds: readonly FuelEventKind[];
      minLiters?: number;
    };

    export function selectFuelEvents(events: readonly FuelEvent[], query: FuelReportQuery): FuelEvent[] {
      const minLiters = query.minLiters ?? 0;
      return events.filter(
        (e) =>
          e.vehicleId === query.vehicleId &&
          query.period.contains(e.at) &&
          e.liters >= minLiters &&
          query.kinds.includes(e.kind),
      );
    }

    export function fuelReportCsv(events: readonly FuelEvent[], query: FuelReportQuery): string {
      const rows = selectFuelEvents(events, query);
      return ["at,liters,kind", ...rows.map((r) => `${r.at.toISOString()},${r.liters},${r.kind}`)].join("\n");
    }

    export function fuelReportJson(events: readonly FuelEvent[], query: FuelReportQuery): string {
      return JSON.stringify(selectFuelEvents(events, query));
    }

    // chaqiruv:
    // fuelReportCsv(events, {
    //   vehicleId: "01A123BC",
    //   period: DateRange.of(new Date("2026-10-01"), new Date("2026-10-31")),
    //   kinds: ["refuel", "drain"],
    //   minLiters: 5,
    // });
  solutionNotes: |
    - `from` va `to` data clump edi: ular har doim birga yuradi. `DateRange` ularni nomlaydi, `from > to` holatini yaratishni taqiqlaydi va `contains` xatti-harakatini o'ziga oladi.
    - `asCsv` rejim flag'i edi: u chiqish formatini butunlay o'zgartirardi va chaqiruvchilar uni doim literal uzatardi. Shuning uchun ikkita nomli funksiya (Remove Flag Argument).
    - `includeDrains` boolean emas, aslida filtr ma'lumoti edi. `kinds: FuelEventKind[]` uni kengaytiriladigan qildi: yangi hodisa turi qo'shilsa, imzo o'zgarmaydi.
    - Qolgan parametrlar `FuelReportQuery` obyektiga yig'ildi: chaqiruv joyida har bir qiymatning nomi bor, `minLiters` ixtiyoriy.
    - Filtrlash mantiqi `selectFuelEvents`da bitta joyda qoldi, ikkala format uni qayta ishlatadi.
  checklist:
    - "Chaqiruv joyida birorta ham nomsiz boolean yoki raqam literal qolmadi"
    - "Noto'g'ri sana oralig'ini yaratish imkonsiz yoki darhol xato beradi"
    - "Chiqish formati flag emas, funksiya nomi bilan tanlanadi"
    - "Filtrlash mantiqi takrorlanmagan"
    - "Parametr obyekti faqat bitta tushunchaga tegishli maydonlarni o'z ichiga oladi"
---

## Muammo

Funksiya imzosi - uning eng ko'p o'qiladigan qismi. Funksiya tanasini bir necha kishi o'qiydi, imzosini esa har bir chaqiruvchi. Shuning uchun imzodagi har bir noaniqlik ko'p marta to'lanadi.

Odatiy belgilar tanish: `createInvoice(order, true, false, null, 3)` kabi chaqiruv, uni o'qish uchun funksiya ta'rifini ochish kerak. Yoki `transfer(fromAccount, toAccount, amount)` funksiyasi, uni kimdir `transfer(toAccount, fromAccount, amount)` deb chaqirgan va TypeScript hech narsa demagan, chunki ikkalasi ham `string`. Yoki `enrichDriver(driver)` funksiyasi, u hech narsa qaytarmaydi, lekin uzatilgan obyektni jimgina o'zgartiradi.

Bularning hammasi bitta muammoning turli ko'rinishlari: argumentlar interfeysning bir qismi, va ular qanchalik ko'p, noaniq va bir-biriga o'xshash bo'lsa, interfeys shunchalik qimmat.

## Asosiy g'oya

Martin *Clean Code*da argumentlar sonini qat'iy tartiblaydi: ideal holat argumentsiz funksiya, keyin bitta, keyin ikkita argument. Uchta argumentdan imkon qadar qochish kerak, undan ko'pi esa alohida asos talab qiladi. Uning dalillari:

- **Tushunish narxi.** Har bir argument o'quvchidan uning ma'nosini va boshqa argumentlar bilan munosabatini bilishni talab qiladi.
- **Test narxi.** Argumentlar ko'paygan sari ularning kombinatsiyalari tez o'sadi va barcha muhim holatlarni test qilish qiyinlashadi.
- **Tartib xatolari.** Ikkita argumentda ham tartibni eslab qolish kerak (`assertEquals(expected, actual)` klassik misol), uchtada xato ehtimoli yanada oshadi.

U alohida uchta naqshni yomon deb ataydi:

**Flag argumentlar.** Funksiyaga boolean uzatish - funksiya bir nechta ish qilishini ochiq e'lon qilish: true bo'lsa bitta ish, false bo'lsa boshqasi. Martin `render(true)` misolini keltiradi va uni `renderForSuite()` va `renderForSingleTest()` ga bo'lishni taklif qiladi.

**Output argumentlar.** Argumentni o'zgartirib natija berish. O'quvchi argumentni kirish deb kutadi, shuning uchun `appendFooter(report)` chaqiruvi chalkashtiradi: footer report'ga qo'shiladimi yoki report biror narsaga qo'shiladimi? Holatni o'zgartirish kerak bo'lsa, `report.appendFooter()` ko'rinishi aniqroq.

**Argument obyektlari.** Ikki-uchtadan ko'p argument kerak bo'lsa, ularning bir qismi ko'pincha bitta tushunchaning qismlari. `makeCircle(x, y, radius)` o'rniga `makeCircle(center, radius)` - bu shunchaki qatorlar sonini kamaytirish emas, `Point` degan tushunchani nomlash.

## Chuqurroq: refaktoringlar va tiplar

### Fowler katalogidagi tegishli refaktoringlar

Fowler'ning refaktoring katalogida bu muammolar uchun aniq nomli amallar bor:

- **Introduce Parameter Object.** Har doim birga yuradigan parametrlar guruhini (Fowler ularni data clump deb ataydi) bitta obyektga yig'ish. Fowler uchun asosiy qiymat imzo qisqarishida emas, balki yangi tushuncha paydo bo'lishida: obyekt yaratilgandan keyin unga xatti-harakat ko'chiriladi. `startDate`/`endDate` juftligi `DateRange` bo'ladi va "sana oraliq ichidami" degan tekshiruv uning metodiga aylanadi.
- **Remove Flag Argument.** Flag o'rniga har bir qiymat uchun alohida nomli funksiya. Katalogdagi misolda `setDimension("height", value)` funksiyasi `setHeight(value)` va `setWidth(value)` ga ajratiladi: e'tibor bering, flag boolean bo'lishi shart emas, xatti-harakatni tanlaydigan satr ham flag. *Refactoring* kitobida Fowler flag argument deganda chaqiruvchi literal qiymat uzatadigan holatni nazarda tutadi. Qiymat dinamik bo'lsa (foydalanuvchi sozlamasidan kelsa), flag'ni olib tashlash chaqiruvchiga if-else qo'shadi va foyda kamayadi.
- **Preserve Whole Object.** Obyektdan bir nechta maydonni ajratib uzatish o'rniga obyektning o'zini uzatish. Bu imzoni barqaror qiladi, lekin funksiyani butun obyekt tipiga bog'laydi. Trade-off'ni har safar o'ylab ko'rish kerak.
- **Parameterize Function.** Faqat bitta qiymat bilan farq qiladigan bir nechta funksiyani parametrli bitta funksiyaga birlashtirish. Bu Remove Flag Argument'ga teskari yo'nalish va ikkalasining ham o'rni bor.

### TypeScript'ning imkoniyatlari

JavaScript'da nomlangan argumentlar yo'q, lekin obyekt destructuring amalda ularning o'rnini bosadi. TypeScript bu naqshni yanada xavfsiz qiladi:

- **Bir xil tipdagi ketma-ket parametrlar.** Vanderkam *Effective TypeScript*ning ikkinchi nashrida bir xil tipdagi takroriy parametrlardan qochishni maslahat beradi, chunki tip tekshiruvchi ularni almashtirishni ushlay olmaydi. Yechim - obyekt parametr yoki farqlanadigan tiplar.
- **Flag o'rniga literal union.** `format: boolean` o'rniga `format: "csv" | "json"`. Bu kengayadi (uchinchi format qo'shilsa imzo buzilmaydi) va chaqiruv joyida o'qiladi.
- **Branded tiplar.** `type VehicleId = string & { readonly __brand: "VehicleId" }` kabi tiplar bilan `transfer(from: AccountId, to: AccountId)` hali ham almashtirilishi mumkin, lekin `assignDriver(vehicleId: VehicleId, driverId: DriverId)` almashtirilsa, kompilyatsiya xatosi beradi (44-dars).
- **Overload'lar va union.** Ba'zan argument kombinatsiyasi qat'iy bo'ladi: `period` yoki `lastNDays`, ikkalasi birga emas. Buni ixtiyoriy maydonlar bilan emas, union bilan ifodalang (45-dars).

### Argumentlar va test kombinatsiyalari

Martinning test haqidagi dalilini aniq hisoblab ko'rish foydali. Uchta boolean flag'li funksiya 8 ta kombinatsiyaga ega va ulardan ba'zilari ma'nosiz bo'lishi mumkin (masalan, "CSV formatda, lekin sarlavhasiz va JSON metadata bilan"). Har bir ma'nosiz kombinatsiya - yo hech kim test qilmagan yo'l, yo uni rad etadigan qo'shimcha tekshiruv. Flag'larni alohida funksiyalarga yoki bitta literal union'ga aylantirish kombinatsiyalar sonini real holatlar soniga tushiradi. Bu 45-darsdagi "noqonuniy holatlarni ifodalab bo'lmaydigan qilish" g'oyasining funksiya imzosidagi ko'rinishi.

## Misol: haydovchini tayinlash

Yomon imzo:

```ts
export async function assignDriver(
  vehicleId: string,
  driverId: string,
  force: boolean,
  notify: boolean,
  shiftStart: Date,
  shiftEnd: Date,
): Promise<void> {
  // ...
}

await assignDriver("01A123BC", "drv_42", false, true, start, end);
```

Chaqiruvdagi `false, true` hech narsa aytmaydi, `vehicleId` va `driverId` almashtirilishi mumkin, `shiftStart` va `shiftEnd` ham.

Qayta loyihalangan:

```ts
type VehicleId = string & { readonly __brand: "VehicleId" };
type DriverId = string & { readonly __brand: "DriverId" };

type Shift = { start: Date; end: Date };

type AssignDriverCommand = {
  vehicleId: VehicleId;
  driverId: DriverId;
  shift: Shift;
  notifyDriver: boolean;
};

export async function assignDriver(cmd: AssignDriverCommand): Promise<void> {
  // oddiy tayinlash: band haydovchi bo'lsa xato
}

export async function reassignDriver(cmd: AssignDriverCommand): Promise<void> {
  // majburiy: avvalgi tayinlovni bekor qiladi
}

await assignDriver({
  vehicleId: vehicle.id,
  driverId: driver.id,
  shift: { start, end },
  notifyDriver: true,
});
```

Nima o'zgardi:

- **`force` flag'i ikki funksiyaga aylandi.** Majburiy tayinlash boshqa biznes amal: u avvalgi tayinlovni bekor qiladi va boshqa ruxsat talab qilishi mumkin. Uni nomlash audit va ruxsatlarni ham soddalashtiradi.
- **`notifyDriver` boolean qoldi.** U rejim emas, buyruqning oddiy ma'lumoti va chaqiruvda nomi ko'rinadi.
- **`Shift` tushunchasi paydo bo'ldi.** Keyin unga `durationHours()` yoki `overlaps(other)` kabi xatti-harakat qo'shiladi.
- **Branded ID'lar.** `vehicleId` va `driverId`ni almashtirish endi kompilyatsiya xatosi.

## Qachon qo'llamaslik kerak

- **Tabiiy juftliklar.** `Math.max(a, b)`, `distance(p1, p2)`, `new Point(x, y)` kabi funksiyalarda argumentlar tartibi tabiiy va ularni obyektga o'rash faqat shovqin qo'shadi.
- **"Options bag" bilan yashirish.** 10 ta bog'liq bo'lmagan parametrni bitta `options` obyektiga yig'ish argumentlar sonini 1 ga tushiradi, lekin funksiya hali ham 10 ta narsani biladi. Bu Ousterhoutning sayoz interfeys tushunchasi: murakkablik yo'qolmadi, faqat ko'zdan yashirildi. Ko'p parametr ko'pincha funksiya juda ko'p ish qilayotganini bildiradi.
- **Dinamik flag'lar.** Qiymat konfiguratsiya yoki foydalanuvchidan kelsa, ikkita funksiya chaqiruvchida `if (x) a() else b()` hosil qiladi. Bunday holda bitta funksiya va union yoki nomlangan maydon yaxshiroq.
- **Hot path.** Juda ko'p chaqiriladigan ichki sikllarda har chaqiruvda yangi obyekt yaratish o'lchanadigan narxga ega bo'lishi mumkin. Bu kamdan-kam holat va faqat profiling bilan aniqlanadi (99-dars).
- **Preserve Whole Object va coupling.** Butun `User` obyektini faqat uning `email`i kerak bo'lgan funksiyaga uzatish funksiyani `User` tipiga bog'laydi va test'da to'liq obyekt yaratishni talab qiladi. Ba'zan bitta primitiv yaxshiroq.

## Stack'da: NestJS va React

- **NestJS DTO'lar.** Controller kirishi allaqachon parametr obyekti: `CreateRentalDto`. Service metodlarini ham `createRental(dto: CreateRentalDto)` yoki domen buyruq tipi bilan yozing, `createRental(name, phone, carId, from, to, deposit)` emas.
- **Service'dagi flag'lar.** `findAll(includeDeleted: boolean)` kabi metodlar tez ko'payadi. `findActive()` va `findIncludingDeleted()` yoki `findAll({ status: "active" | "deleted" | "any" })` aniqroq.
- **React props.** Props allaqachon nomlangan argumentlar. Lekin boolean props ko'payishi (`<Button primary small outline danger />`) flag argument muammosining JSX versiyasi: ziddiyatli kombinatsiyalar mumkin. `variant: "primary" | "outline" | "danger"` va `size: "sm" | "md"` kabi union props yaxshiroq.
- **Callback imzolari.** `onChange(value, isValid, isDirty)` o'rniga `onChange({ value, isValid, isDirty })`: yangi maydon qo'shish barcha chaqiruvchilarni buzmaydi.

## Xulosa

- Har bir argument interfeys narxini oshiradi. Kam argument ideal, uchtadan ko'pi asos talab qiladi.
- Literal sifatida uzatiladigan boolean flag - funksiya ikki ish qilishi belgisi. Uni nomli funksiyalarga yoki literal union'ga aylantiring.
- Output argumentlardan qoching: o'zgarish kerak bo'lsa, egasining metodi yoki yangi qiymat qaytarish.
- Introduce Parameter Object'ning asl qiymati yangi tushunchani nomlash va unga xatti-harakat ko'chirishda.
- TypeScript'da bir xil tipdagi ketma-ket parametrlarni obyekt parametr yoki branded tiplar bilan himoyalang.
- "Options bag" murakkablikni yo'qotmaydi, faqat yashiradi.
