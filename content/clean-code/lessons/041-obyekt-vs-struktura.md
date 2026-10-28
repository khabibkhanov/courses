---
n: 41
slug: obyekt-vs-struktura
title: "Obyektlar va ma'lumot strukturalari"
summary: "Obyekt ma'lumotini yashirib xatti-harakat beradi, ma'lumot strukturasi esa ma'lumotini ochib, xatti-harakat bermaydi. Bu ikki yondashuv bir-biriga teskari kuchli va zaif tomonlarga ega. Darsda qachon qaysi birini tanlash va ikkalasini aralashtirgan gibridlardan qochishni ko'ramiz."
duration: 35
sources:
  - id: cc1
    note: "\"Objects and Data Structures\" bobi: data abstraction, data/object anti-symmetry, gibridlar, DTO va Active Record"
  - id: cc2
    note: "Ikkinchi nashrdagi shu mavzuning yangilangan bayoni (asosiy g'oya o'zgarmagan)"
quiz:
  - q: "Martinning \"data/object anti-symmetry\" g'oyasiga ko'ra, procedural (ma'lumot strukturasi + funksiyalar) kod qaysi o'zgarishni oson qiladi?"
    options:
      - "Yangi tur (masalan, yangi shakl) qo'shishni"
      - "Mavjud turlarga yangi funksiya (operatsiya) qo'shishni"
      - "Ikkalasini ham bir xil oson qiladi"
      - "Hech birini, u faqat performance uchun kerak"
    answer: 1
    explain: "Procedural kodda yangi funksiya qo'shish mavjud strukturalarni o'zgartirmaydi. Lekin yangi tur qo'shilsa, barcha funksiyalarni o'zgartirish kerak. OO kodda esa aksincha: yangi klass qo'shish oson, yangi operatsiya qo'shish barcha klasslarga tegadi."
  - q: "Quyidagi klass haqida qaysi baho to'g'ri? `class Vehicle { fuelLiters: number; tankCapacity: number; getFuelPercent() {...}; refuel(l: number) {...} }` va hamma maydonlar public, tashqaridagi kod ularni to'g'ridan-to'g'ri o'zgartiradi."
    options:
      - "Bu toza obyekt, chunki metodlari bor"
      - "Bu toza ma'lumot strukturasi, chunki maydonlari ochiq"
      - "Bu gibrid: metodlar invariant saqlashga urinadi, lekin ochiq maydonlar uni chetlab o'tishga imkon beradi"
      - "Bu Active Record, demak to'g'ri"
    answer: 2
    explain: "Gibrid ikkala dunyoning yomon tomonini oladi: `refuel` limitni tekshirsa ham, tashqaridagi kod `fuelLiters = 9999` yozib uni chetlab o'tadi. Yangi tur qo'shish ham, yangi funksiya qo'shish ham qiyinlashadi."
  - q: "Martinning abstrakt va konkret Vehicle misolidan qaysi xulosa chiqadi?"
    options:
      - "Har bir maydon uchun getter yozish inkapsulyatsiyani ta'minlaydi"
      - "Getterlar har doim zararli"
      - "Interfeys ichki tuzilishni ochmasligi kerak, ya'ni ma'lumotning mohiyatini abstrakt ko'rinishda berishi kerak"
      - "Litr o'rniga gallon ishlatish kerak"
    answer: 2
    explain: "`getTankCapacityLiters()` va `getFuelLiters()` ichki tuzilishni getter orqali baribir ochadi. `getFuelPercentRemaining()` esa chaqiruvchiga kerakli ma'noni beradi va ichki saqlash usulini yashiradi. Getter yozish o'z-o'zidan abstraksiya emas."
  - q: "Prisma'dan qaytgan `Order` modeli (faqat maydonlar) bilan ishlashda eng to'g'ri yondashuv qaysi?"
    options:
      - "Uni ma'lumot strukturasi deb qabul qilish va biznes qoidalarini alohida domen funksiyalari yoki obyektlariga yozish"
      - "Prisma modeliga prototype orqali biznes metodlar qo'shish"
      - "Har bir controllerda biznes qoidasini qayta yozish"
      - "Prisma modelini to'g'ridan-to'g'ri API javobi sifatida qaytarish"
    answer: 0
    explain: "Martin Active Record va DTO'larni ma'lumot strukturasi deb ko'rishni, biznes qoidalarini esa alohida obyektlarga qo'yishni tavsiya qiladi. ORM modelini biznes metodlar bilan to'ldirish gibrid hosil qiladi."
  - q: "TypeScript'da discriminated union va `switch` bilan yozilgan `area(shape)` funksiyasiga yangi `Triangle` turi qo'shilsa nima bo'ladi (exhaustive check bilan)?"
    options:
      - "Hech narsa, kod ishlayveradi"
      - "Runtime'da xato chiqadi, kompilyator hech narsa demaydi"
      - "Faqat `Triangle` klassini yozish kifoya"
      - "Kompilyator union'ni `switch` qilgan har bir funksiyada `never` tekshiruvi orqali xato beradi va ularni yangilashni talab qiladi"
    answer: 3
    explain: "Bu procedural yondashuvning narxi: yangi tur barcha funksiyalarga tegadi. TypeScript'ning exhaustive check'i bu narxni yo'qotmaydi, lekin uni xavfsiz qiladi, chunki biror joy esdan chiqmaydi."
  - q: "Qaysi holatda klass + polimorfizm discriminated union'dan yaxshiroq tanlov?"
    options:
      - "Operatsiyalar to'plami barqaror, lekin yangi turlar tez-tez qo'shiladi (masalan, GPS-tracker modellari uchun drayverlar)"
      - "Turlar barqaror, lekin yangi hisobotlar va operatsiyalar tez-tez qo'shiladi"
      - "Ma'lumot tarmoq orqali JSON sifatida yuboriladi"
      - "Ma'lumot React state'da saqlanadi"
    answer: 0
    explain: "Yangi turlar ko'p qo'shiladigan joyda OO yondashuv yangi turni bitta yangi klassga lokallashtiradi. Turlar barqaror, operatsiyalar o'zgaruvchan bo'lsa, union va funksiyalar qulayroq. JSON va React state uchun oddiy ma'lumot strukturalari tabiiy."
task:
  title: "Gibrid Vehicle klassini ikkiga ajratish"
  prompt: |
    Quyidagi `Vehicle` klassi gibrid: maydonlari ochiq, lekin ba'zi metodlari invariant saqlashga urinadi. Hisobot kodi esa ichki maydonlarni to'g'ridan-to'g'ri o'qiydi va o'zgartiradi.

    1. Qaysi qism ma'lumot strukturasi (DTO, DB qatori), qaysi qism haqiqiy obyekt (invariant saqlaydigan) bo'lishi kerakligini aniqlang.
    2. Yoqilg'i bakini invariantni (0 dan sig'imgacha) himoya qiladigan obyektga aylantiring. Ichki birlik (litr) tashqariga oqib chiqmasin, chaqiruvchiga foiz va "kam yoqilg'i" ma'nosi kerak.
    3. Hisobot uchun oddiy, faqat o'qiladigan ma'lumot strukturasini qaytaring.
  lang: ts
  starter: |
    export class Vehicle {
      id: string;
      plate: string;
      fuelLiters: number;
      tankCapacity: number;
      odometerKm: number;

      constructor(id: string, plate: string, tankCapacity: number) {
        this.id = id;
        this.plate = plate;
        this.tankCapacity = tankCapacity;
        this.fuelLiters = 0;
        this.odometerKm = 0;
      }

      refuel(liters: number) {
        if (this.fuelLiters + liters > this.tankCapacity) {
          throw new Error("overflow");
        }
        this.fuelLiters += liters;
      }
    }

    export function buildFuelReport(vehicles: Vehicle[]) {
      return vehicles.map((v) => {
        if (v.fuelLiters < 0) v.fuelLiters = 0; // "tuzatish"
        const percent = (v.fuelLiters / v.tankCapacity) * 100;
        return { plate: v.plate, percent, low: percent < 15 };
      });
    }

    // boshqa joyda:
    // vehicle.fuelLiters = sensorValue; // DUT datchigidan
  solution: |
    const LOW_FUEL_PERCENT = 15;

    export class FuelTank {
      #liters: number;

      private constructor(
        private readonly capacityLiters: number,
        liters: number,
      ) {
        this.#liters = liters;
      }

      static empty(capacityLiters: number): FuelTank {
        if (capacityLiters <= 0) throw new RangeError("Bak sig'imi musbat bo'lishi kerak");
        return new FuelTank(capacityLiters, 0);
      }

      refuel(liters: number): void {
        if (liters <= 0) throw new RangeError("Quyilgan miqdor musbat bo'lishi kerak");
        if (this.#liters + liters > this.capacityLiters) {
          throw new RangeError("Bak sig'imidan oshib ketdi");
        }
        this.#liters += liters;
      }

      applySensorReading(liters: number): void {
        this.#liters = Math.min(Math.max(liters, 0), this.capacityLiters);
      }

      percentRemaining(): number {
        return (this.#liters / this.capacityLiters) * 100;
      }

      isLow(): boolean {
        return this.percentRemaining() < LOW_FUEL_PERCENT;
      }
    }

    export class Vehicle {
      constructor(
        readonly id: string,
        readonly plate: string,
        readonly fuel: FuelTank,
      ) {}
    }

    export type FuelReportRow = Readonly<{
      plate: string;
      percent: number;
      low: boolean;
    }>;

    export function buildFuelReport(vehicles: readonly Vehicle[]): FuelReportRow[] {
      return vehicles.map((v) => ({
        plate: v.plate,
        percent: Math.round(v.fuel.percentRemaining()),
        low: v.fuel.isLow(),
      }));
    }
  solutionNotes: |
    - `FuelTank` haqiqiy obyekt: litrlar `#private` maydonda, invariant (0 dan sig'imgacha) faqat metodlar orqali o'zgaradi. Tashqi kod endi `fuelLiters = 9999` yoza olmaydi.
    - Datchik qiymati uchun alohida `applySensorReading` metodi: datchik shovqinini qisish qoidasi bitta joyda, hisobotdagi "tuzatish" yo'qoldi.
    - Interfeys litr emas, ma'no beradi: `percentRemaining()` va `isLow()`. Bu Martinning abstrakt Vehicle misolining aynan o'zi.
    - `FuelReportRow` - sof ma'lumot strukturasi: faqat o'qiladigan maydonlar, metod yo'q. Uni JSON qilib yuborish, testda solishtirish oson.
    - `Vehicle` o'zi ham ochiq maydonli gibrid emas: `readonly` maydonlar va ichida invariant saqlaydigan `FuelTank`.
  checklist:
    - "Ichki maydonni tashqaridan to'g'ridan-to'g'ri o'zgartirish imkoni qolmadi"
    - "Chaqiruvchi litr bilan emas, ma'noli metodlar bilan ishlaydi"
    - "Hisobot qatori metodlarsiz, faqat o'qiladigan struktura"
    - "Hisobot funksiyasi ma'lumotni o'zgartirmaydi"
    - "Biznes qoidasi (15% chegarasi) bitta nomlangan konstantada"
---

## Muammo

Transport parki tizimida `Vehicle` klassini oching. Unda 20 ta public maydon, ularning har biri uchun getter va setter, bir nechta biznes metodlar (`refuel`, `assignDriver`) va bir nechta yordamchi metodlar (`toJSON`, `fromRow`) bor. Bir xizmat `vehicle.fuelLiters` ni to'g'ridan-to'g'ri o'zgartiradi, boshqasi `vehicle.refuel()` ni chaqiradi. Hisobot kodi yoqilg'i foizini o'zi hisoblaydi, mobil API esa boshqacha formula bilan hisoblaydi. Bakdan oshib ketish tekshiruvi `refuel` ichida bor, lekin datchikdan kelgan qiymat to'g'ridan-to'g'ri maydonga yoziladi va tekshiruvni chetlab o'tadi.

Bu klass na obyekt, na ma'lumot strukturasi. U ikkalasi bo'lishga urinadi va natijada hech birining foydasini bermaydi. Uni o'zgartirish qiyin, chunki qaysi kod qaysi maydonga bog'langanini bilib bo'lmaydi. Uni test qilish ham qiyin, chunki invariantlar hech qayerda kafolatlanmagan.

Robert Martin *Clean Code*ning obyektlar va ma'lumot strukturalari haqidagi bobida aynan shu chalkashlikni tahlil qiladi. Uning asosiy da'vosi: bu ikki narsa bir-biriga teskari, va ularning farqini tushunmaslik gibrid dizaynga olib keladi.

## Asosiy g'oya

Martin ikki tushunchani qat'iy ajratadi:

- **Obyekt** ma'lumotini abstraksiya ortida yashiradi va shu ma'lumot ustida ishlaydigan funksiyalarni (xatti-harakatni) ochiq beradi.
- **Ma'lumot strukturasi** ma'lumotini ochiq beradi va ma'noli xatti-harakatga ega emas.

Bu "biri yaxshi, biri yomon" degani emas. Ular turli o'zgarishlarga turlicha chidamli. Martin buni **data/object anti-symmetry** deb ataydi va shakllar misolida ko'rsatadi:

- Procedural uslubda `Square`, `Rectangle`, `Circle` - oddiy ma'lumot strukturalari, `Geometry.area(shape)` esa turini tekshirib hisoblaydi. Yangi `perimeter()` funksiyasini qo'shish oson: shakl klasslariga tegilmaydi. Yangi `Triangle` turini qo'shish qiyin: barcha funksiyalarni o'zgartirish kerak.
- OO uslubda har bir shakl `area()` metodini o'zi implementatsiya qiladi. Yangi turni qo'shish oson: bitta yangi klass. Yangi operatsiyani qo'shish qiyin: barcha klasslarga tegish kerak.

Martin xulosasi: procedural kod yangi funksiyalar qo'shishni, OO kod yangi turlar qo'shishni osonlashtiradi. Tajribali dasturchi "hamma narsa obyekt" degan g'oya afsona ekanini biladi va vaziyatga qarab tanlaydi.

Bu muammo dasturlash tillari nazariyasida **expression problem** nomi bilan ham ma'lum: turlar va operatsiyalarni ikkala yo'nalishda ham mavjud kodni o'zgartirmasdan kengaytirish qiyin. Bu yerda biz uning amaliy tomoni bilan ishlaymiz.

### Data abstraction

Bobning boshida Martin yana bir muhim fikrni beradi: maydonlarni `private` qilib, har biriga getter va setter yozish inkapsulyatsiya emas. U ikki `Vehicle` interfeysini solishtiradi. Birinchisi yoqilg'i bakining sig'imi va hozirgi miqdorini aniq birlikda (gallon) qaytaradi. Ikkinchisi faqat qolgan yoqilg'i foizini qaytaradi. Birinchisi ichki tuzilishni getter'lar orqali baribir ochadi, ikkinchisi esa ma'lumotning **mohiyatini** beradi va uni qanday saqlashni yashiradi.

Martinning tavsiyasi: ma'lumotni eng abstrakt ko'rinishda ifodalashga harakat qiling. Interfeys "menda qanday maydonlar bor" emas, "men bilan nima qilish mumkin" degan savolga javob bersin.

## Chuqurroq: gibridlar, DTO va Active Record

### Gibridlar

Gibrid - bu ham muhim ishlarni bajaradigan metodlarga, ham ochiq maydonlar yoki "sirni oshkor qiluvchi" getter/setter'larga ega struktura. Martin ularni ikkala dunyoning eng yomon tomonini oladigan narsa deb baholaydi: yangi funksiya qo'shish ham, yangi tur qo'shish ham qiyinlashadi. Gibrid odatda muallif nimani xohlaganini aniq bilmaganidan paydo bo'ladi: unga funksiyalardan himoya kerakmi yoki turlardan?

Gibridning eng xavfli belgisi: invariant metodlarda tekshiriladi, lekin maydonlar ochiq. Bunday holda invariant aslida yo'q, chunki uni istalgan joydan buzish mumkin. Kod o'quvchiga himoya bor degan yolg'on signal beradi.

### Data Transfer Object

DTO - metodlarsiz, faqat maydonlardan iborat klass yoki tip. Martin ularni foydali deb biladi: ma'lumotlar bazasi bilan aloqa, tarmoq xabarlarini parse qilish, qatlamlar o'rtasida ma'lumot uzatish uchun. DTO'ning vazifasi - ma'lumotni tashish. Unda biznes mantiq bo'lmasligi kerak.

### Active Record

Active Record - DB jadvali qatorini aks ettiruvchi struktura, unga `save()`, `find()` kabi navigatsiya metodlari qo'shilgan. Martin muhim ogohlantirish beradi: dasturchilar ko'pincha Active Record'ga biznes qoidalarini qo'shib, uni obyektga aylantirishga urinadi va gibrid hosil qiladi. Uning tavsiyasi: Active Record'ni ma'lumot strukturasi deb qabul qiling va biznes qoidalarini alohida obyektlarga joylashtiring, bu obyektlar ichki ma'lumot sifatida Active Record'dan foydalanishi mumkin.

### TypeScript'da bu farq qanday ko'rinadi

TypeScript'da bu ikki uslubning ikkalasi uchun ham birinchi darajali vositalar bor:

- **Ma'lumot strukturasi:** `type` yoki `interface`, ko'pincha `Readonly<>` bilan. JSON'ga to'g'ridan-to'g'ri aylanadi, structural typing tufayli testda oddiy literal bilan yaratiladi.
- **Procedural kengaytirish:** discriminated union va `switch` (27-dars). Exhaustive check bilan yangi tur qo'shilganda kompilyator har bir funksiyani ko'rsatadi. Bu procedural yondashuvning narxini yo'qotmaydi, lekin uni xavfsiz qiladi.
- **Obyekt:** `class` va `#private` maydonlar yoki closure ichida yashirilgan holat. `private` kalit so'zi faqat kompilyatsiya vaqtida ishlaydi, `#private` esa runtime'da ham yashiradi.

JS ekotizimining o'ziga xos jihati shundaki, ma'lumot strukturalari bu yerda juda tabiiy: React state, Redux store, API javoblari, Prisma natijalari - hammasi oddiy obyekt literal'lari. Klass instansiyasini React state'ga qo'yish yoki tarmoq orqali yuborish ko'pincha muammo tug'diradi: metodlar yo'qoladi, `instanceof` ishlamaydi, solishtirish referens bo'yicha bo'ladi. Shuning uchun TS loyihalarida chegara qatlamlarida (API, DB, UI state) ma'lumot strukturalari, invariantlar zich bo'lgan domen markazida esa obyektlar ko'proq uchraydi.

## Misol: gibriddan aniq tanlovga

Avval "Muammo" bo'limidagi gibridning kichik versiyasi:

```ts
// Gibrid: ochiq maydonlar va "himoya qiluvchi" metod birga
export class Trip {
  status: string = "planned";
  startedAt?: Date;
  finishedAt?: Date;
  distanceKm = 0;

  start(now: Date) {
    if (this.status !== "planned") throw new Error("bad status");
    this.status = "in_progress";
    this.startedAt = now;
  }
}

// Boshqa joyda:
// trip.status = "finished"; // start() tekshiruvi chetlab o'tildi
// trip.finishedAt = undefined; // "finished", lekin tugash vaqti yo'q
```

Bu yerda ikki yo'l bor va ikkalasi ham toza. Qaysi biri - o'zgarish yo'nalishiga bog'liq.

**Variant A: ma'lumot strukturasi va funksiyalar.** Agar sayohat holatlari barqaror bo'lsa, lekin ular ustida yangi operatsiyalar (hisobotlar, eksport, billing) tez-tez qo'shilsa:

```ts
export type Trip =
  | { readonly kind: "planned"; readonly id: string }
  | { readonly kind: "in_progress"; readonly id: string; readonly startedAt: Date }
  | {
      readonly kind: "finished";
      readonly id: string;
      readonly startedAt: Date;
      readonly finishedAt: Date;
      readonly distanceKm: number;
    };

export function startTrip(trip: Trip, now: Date): Trip {
  if (trip.kind !== "planned") {
    throw new Error(`Sayohat ${trip.id} allaqachon boshlangan`);
  }
  return { kind: "in_progress", id: trip.id, startedAt: now };
}

export function durationMinutes(trip: Trip): number | null {
  switch (trip.kind) {
    case "planned":
    case "in_progress":
      return null;
    case "finished":
      return (trip.finishedAt.getTime() - trip.startedAt.getTime()) / 60_000;
    default: {
      const unreachable: never = trip;
      return unreachable;
    }
  }
}
```

Bu yerda strukturalar ochiq, lekin `readonly` va union tufayli "tugagan, lekin tugash vaqti yo'q" holat tipda ifodalanmaydi (45-dars). Yangi hisobot qo'shish - yangi funksiya yozish, `Trip`ga tegilmaydi.

**Variant B: obyekt.** Agar sayohat murakkab invariantlarga ega bo'lsa (masalan, GPS nuqtalari kelganda masofa yangilanadi, haydovchi almashadi, to'xtash vaqtlari hisoblanadi) va bu qoidalar ko'p joydan chaqirilsa, holatni yashirish foydaliroq:

```ts
export class ActiveTrip {
  #distanceKm = 0;
  #lastPoint: { lat: number; lng: number } | null = null;

  constructor(
    readonly id: string,
    readonly startedAt: Date,
    private readonly distance: (a: GeoPoint, b: GeoPoint) => number,
  ) {}

  recordPoint(point: GeoPoint): void {
    if (this.#lastPoint) this.#distanceKm += this.distance(this.#lastPoint, point);
    this.#lastPoint = point;
  }

  distanceKm(): number {
    return this.#distanceKm;
  }
}

type GeoPoint = { lat: number; lng: number };
```

Nima o'zgardi va nega:

- **Gibrid yo'qoldi.** Har bir variantda yo hamma narsa ochiq va himoya tipda (A), yo holat yopiq va himoya metodlarda (B).
- **Tanlov o'zgarish yo'nalishiga asoslandi.** A yangi operatsiyalarga, B ichki qoidalar zichligiga moslashgan.
- **Ikkalasi birga yashashi mumkin.** Tugagan sayohat (A dagi `finished`) DB'ga yoziladigan va hisobotlarda o'qiladigan struktura, faol sayohat esa (B) xotirada invariantlarni saqlaydigan obyekt. Bu gibrid emas, chunki ular aniq chegarada bir-biriga aylanadi.

## Qachon qo'llamaslik kerak

- **Hamma narsani obyektga aylantirmang.** API javobi, konfiguratsiya, hisobot qatori uchun klass yozib, har maydonga getter qo'shish hech qanday himoya bermaydi, faqat shovqin qo'shadi. Agar invariant bo'lmasa, oddiy `type` yetarli.
- **Hamma narsani strukturaga aylantirmang.** Agar bir xil tekshiruv (masalan, "bak sig'imidan oshmasin") 5 ta funksiyada takrorlanayotgan bo'lsa, bu obyekt kerakligining belgisi.
- **Anti-symmetry qat'iy qonun emas.** Amalda ko'p tizimlar ikkala yo'nalishda ham o'zgaradi. Bunday holatda kodni o'zgarish chastotasi yuqori bo'lgan o'q bo'yicha tashkil qiling va boshqa o'qdagi o'zgarishlar uchun kompilyator yordamiga (exhaustive check) tayaning.
- **Frameworkka qarshi kurashmang.** React state yoki Redux'da klass instansiyalarini saqlashga urinish odatda ko'proq muammo tug'diradi. Bu kontekstda ma'lumot strukturalari va sof funksiyalar tabiiy tanlov.
- **"Getter yomon" degan xulosaga kelmang.** Getter muammo emas, muammo - ichki tuzilishni aks ettiruvchi getter. `percentRemaining()` ham texnik jihatdan getter, lekin u abstraksiya.

## Stack'da: NestJS, Prisma, React

- **Prisma/Kysely natijalari ma'lumot strukturasi.** Ularga biznes metodlarini prototype yoki extension orqali qo'shishdan ehtiyot bo'ling. Biznes qoidalarini domen funksiyalariga yoki DB qatoridan yaratiladigan domen obyektlariga joylashtiring. Repository (95-dars) aynan shu aylantirishni bajaradi.
- **NestJS DTO'lari ma'lumot strukturasi.** `class-validator` dekoratorlari ular uchun klass talab qiladi, lekin bu DTO'ni obyektga aylantirmaydi. DTO ichida biznes metodlar yozmang.
- **Domen markazida obyekt yoki union.** Invariantlar zich bo'lgan joyda (to'lov holati, ijara shartnomasi, yoqilg'i bakining hisoblari) `#private` maydonli klass yoki discriminated union'dan birini ongli ravishda tanlang.
- **React'da ma'lumot strukturalari.** Props va state oddiy, o'zgarmas obyektlar bo'lsin. Hisoblanadigan qiymatlar uchun sof funksiyalar (`selectFuelPercent(vehicle)`) ishlating.

## Xulosa

- Obyekt ma'lumotni yashiradi va xatti-harakat beradi, ma'lumot strukturasi ma'lumotni ochadi va xatti-harakat bermaydi.
- Procedural kod yangi operatsiyalarni, OO kod yangi turlarni qo'shishni osonlashtiradi. Tanlovni kutilayotgan o'zgarish yo'nalishiga qarab qiling.
- Har maydonga getter yozish abstraksiya emas. Interfeys ichki tuzilishni emas, ma'noni bersin.
- Gibridlardan qoching: ochiq maydon va himoya qiluvchi metod bir joyda bo'lsa, himoya aslida yo'q.
- DTO, Active Record va ORM modellarini ma'lumot strukturasi deb ko'ring, biznes qoidalarini alohida joylashtiring.
- TypeScript'da discriminated union + exhaustive check procedural yondashuvni xavfsiz qiladi, `#private` klasslar esa haqiqiy obyekt beradi.
