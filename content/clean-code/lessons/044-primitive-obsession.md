---
n: 44
slug: primitive-obsession
title: "Primitive obsession, value object va branded tiplar"
summary: "Pul, telefon raqami, davlat raqami va IMEI'ni oddiy string yoki number bilan ifodalash xatolarni tip tizimidan yashiradi. Darsda Fowlerning Primitive Obsession smell'ini, value object g'oyasini va TypeScript'da arzon nominal tiplar beradigan branded type usulini ko'ramiz."
duration: 40
sources:
  - id: refactoring
    note: "Code smells katalogidagi Primitive Obsession va Replace Primitive with Object refaktoringi"
  - id: fowler-value-object
    note: "Value object ta'rifi, qiymat bo'yicha tenglik, immutability va aliasing bug, JavaScript'dagi tenglik muammosi"
  - id: effective-ts
    note: "Nominal tiplar uchun brand'lardan foydalanish haqidagi item"
quiz:
  - q: "Fowlerning fikricha, value object nima uchun immutable bo'lishi kerak?"
    options:
      - "Chunki ikki joyda bir xil obyektga havola bo'lsa, biridagi o'zgarish ikkinchisini jimgina o'zgartiradi (aliasing bug)"
      - "Chunki immutable obyektlar tezroq ishlaydi"
      - "Chunki JavaScript buni talab qiladi"
      - "Chunki aks holda JSON'ga aylantirib bo'lmaydi"
    answer: 0
    explain: "Fowler sana misolini keltiradi: bir sanani ikki joyda ishlatib, birini o'zgartirsangiz ikkinchisi ham o'zgaradi. Value object'lar qiymat bo'yicha solishtiriladi va o'zgartirish o'rniga almashtiriladi, shuning uchun bu xato yo'qoladi."
  - q: "TypeScript'da `type VehicleId = string; type DriverId = string;` deb yozdik. `assign(driverId, vehicleId)` o'rniga `assign(vehicleId, driverId)` yozilsa nima bo'ladi?"
    options:
      - "Kompilyator xato beradi"
      - "Runtime'da TypeError chiqadi"
      - "Hech narsa: type alias yangi tur yaratmaydi, ikkalasi ham `string`, xato jimgina o'tadi"
      - "ESLint avtomatik tuzatadi"
    answer: 2
    explain: "TypeScript structural typing ishlatadi va alias faqat nom beradi. Ikki xil ID'ni farqlash uchun brand kerak: `string & { readonly __brand: \"VehicleId\" }`."
  - q: "Branded type'ning asosiy cheklovi qaysi?"
    options:
      - "U runtime'da qo'shimcha xotira sarflaydi"
      - "U faqat number bilan ishlaydi"
      - "U JSON'ga aylantirib bo'lmaydi"
      - "U faqat kompilyatsiya vaqtida mavjud; qiymatni brand'ga aylantiradigan joy (smart constructor) tekshiruvni to'g'ri qilmasa yoki `as` bilan chetlab o'tilsa, kafolat yo'qoladi"
    answer: 3
    explain: "Brand runtime'da yo'q, u tip darajasidagi belgi. Uning qiymati to'liq yaratish joyidagi tekshiruvga bog'liq. Shuning uchun `as PlateNumber` ni faqat bitta funksiyada ishlatish va boshqa joylarda taqiqlash kerak."
  - q: "Qaysi holatda klass ko'rinishidagi value object branded primitivdan yaxshiroq?"
    options:
      - "Qiymat bir nechta maydondan iborat va ular ustida xatti-harakat bor (masalan, Money: summa + valyuta, qo'shish, taqsimlash)"
      - "Qiymat bitta string va faqat formati tekshiriladi"
      - "Qiymat API javobida JSON sifatida yuboriladi"
      - "Qiymat React state'da saqlanadi"
    answer: 0
    explain: "Money kabi kompozit qiymatlar uchun xatti-harakat (valyutalarni aralashtirmaslik, yaxlitlash) markaziy. Bitta maydonli, faqat formati muhim bo'lgan qiymatlar uchun brand arzonroq va JSON/React bilan muammosiz ishlaydi."
  - q: "`class Money { constructor(readonly amount: number, readonly currency: string) {} }` bilan `[a, b].includes(new Money(100, \"UZS\"))` nima qaytaradi (a 100 UZS bo'lsa)?"
    options:
      - "true, chunki maydonlar teng"
      - "false, chunki `includes` referens bo'yicha solishtiradi va custom `equals` metodini bilmaydi"
      - "TypeError"
      - "TypeScript kompilyatsiya qilmaydi"
    answer: 1
    explain: "Fowler aynan shu JS muammosini eslatadi: built-in'lar custom `equals`ni tanimaydi. Value object'larni solishtirish uchun `equals` metodini ochiq chaqirish yoki qiymatni primitivga (masalan, tiyinlardagi butun son) keltirish kerak."
  - q: "Pulni `number` (so'mda, kasr bilan) saqlashning asosiy xavfi nima?"
    options:
      - "number juda kichik"
      - "Binar suzuvchi nuqta kasrlarni aniq ifodalamaydi, valyuta va yaxlitlash qoidasi tipda yo'q, shuning uchun xatolar jimgina to'planadi"
      - "number'ni bazaga yozib bo'lmaydi"
      - "Xavf yo'q"
    answer: 1
    explain: "`0.1 + 0.2 !== 0.3` muammosi va valyutaning yo'qligi - Primitive Obsession'ning klassik ko'rinishi. Odatiy yechim: eng kichik birlikda butun son (yoki bigint) va valyuta bilan Money value object."
task:
  title: "Ijara bronidagi primitivlarni value object va brand'larga aylantirish"
  prompt: |
    Quyidagi funksiya avtomobil ijarasi bronini yaratadi. Barcha qiymatlar primitiv: ID'lar `string`, narx `number`, telefon `string`.

    1. Qaysi argumentlarni chalkashtirib yuborish oson ekanini va qaysi tekshiruvlar takrorlanayotganini aniqlang.
    2. `VehicleId`, `CustomerId` va `PhoneNumber` uchun branded tiplar va ularni yaratadigan smart constructor'lar yozing.
    3. `Money` value object'ini yozing: summa tiyinda butun son, valyuta bilan, `add`, `multiply`, `equals`. Turli valyutalarni qo'shish xato bersin.
    4. `createBooking` yangi tiplarni qabul qilsin va ichida qayta tekshiruv qilmasin.
  lang: ts
  starter: |
    type Booking = {
      vehicleId: string;
      customerId: string;
      phone: string;
      days: number;
      total: number;
    };

    export function createBooking(
      customerId: string,
      vehicleId: string,
      phone: string,
      dailyPrice: number,
      days: number,
    ): Booking {
      if (!/^\+998\d{9}$/.test(phone.replace(/[\s-]/g, ""))) {
        throw new Error("Telefon noto'g'ri");
      }
      if (dailyPrice <= 0) throw new Error("Narx noto'g'ri");
      return {
        vehicleId,
        customerId,
        phone: phone.replace(/[\s-]/g, ""),
        days,
        total: dailyPrice * days,
      };
    }

    // chaqiruv: createBooking(vehicle.id, customer.id, form.phone, 350000.5, 3)
    // ID'lar almashib ketgan, kompilyator jim
  solution: |
    declare const brand: unique symbol;
    type Brand<T, B extends string> = T & { readonly [brand]: B };

    export type VehicleId = Brand<string, "VehicleId">;
    export type CustomerId = Brand<string, "CustomerId">;
    export type PhoneNumber = Brand<string, "PhoneNumber">;

    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    export const VehicleId = (raw: string): VehicleId => {
      if (!UUID_RE.test(raw)) throw new Error(`VehicleId noto'g'ri: ${raw}`);
      return raw as VehicleId;
    };

    export const CustomerId = (raw: string): CustomerId => {
      if (!UUID_RE.test(raw)) throw new Error(`CustomerId noto'g'ri: ${raw}`);
      return raw as CustomerId;
    };

    export const PhoneNumber = (raw: string): PhoneNumber => {
      const normalized = raw.replace(/[\s()-]/g, "");
      if (!/^\+998\d{9}$/.test(normalized)) {
        throw new Error(`Telefon raqami noto'g'ri: ${raw}`);
      }
      return normalized as PhoneNumber;
    };

    export type Currency = "UZS" | "USD";

    export class Money {
      private constructor(readonly minorUnits: bigint, readonly currency: Currency) {}

      static of(minorUnits: bigint, currency: Currency): Money {
        if (minorUnits < 0n) throw new RangeError("Summa manfiy bo'lmasin");
        return new Money(minorUnits, currency);
      }

      add(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.minorUnits + other.minorUnits, this.currency);
      }

      multiply(factor: number): Money {
        if (!Number.isInteger(factor) || factor < 0) {
          throw new RangeError("Ko'paytuvchi manfiy bo'lmagan butun son bo'lsin");
        }
        return new Money(this.minorUnits * BigInt(factor), this.currency);
      }

      equals(other: Money): boolean {
        return this.currency === other.currency && this.minorUnits === other.minorUnits;
      }

      private assertSameCurrency(other: Money): void {
        if (other.currency !== this.currency) {
          throw new Error(`Valyutalar aralashdi: ${this.currency} va ${other.currency}`);
        }
      }
    }

    export type Booking = Readonly<{
      vehicleId: VehicleId;
      customerId: CustomerId;
      phone: PhoneNumber;
      days: number;
      total: Money;
    }>;

    export function createBooking(input: {
      vehicleId: VehicleId;
      customerId: CustomerId;
      phone: PhoneNumber;
      dailyPrice: Money;
      days: number;
    }): Booking {
      return {
        vehicleId: input.vehicleId,
        customerId: input.customerId,
        phone: input.phone,
        days: input.days,
        total: input.dailyPrice.multiply(input.days),
      };
    }
  solutionNotes: |
    - ID'lar endi brand'langan: `VehicleId` o'rniga `CustomerId` berish kompilyatsiya xatosi. Bundan tashqari, parametr obyekti (23-dars) pozitsion chalkashlikni ham yo'qotdi.
    - `as` faqat smart constructor'lar ichida. Bu brand'ning yagona "eshigi"; boshqa joylarda `as VehicleId` yozishni code review yoki lint qoidasi bilan taqiqlang.
    - Telefon normalizatsiyasi va tekshiruvi bitta joyda. `createBooking` endi uni qayta tekshirmaydi, chunki `PhoneNumber` tipi tekshiruv bo'lganini isbotlaydi.
    - `Money` tiyinlarda `bigint` saqlaydi: kasr xatosi yo'q, valyuta aralashishi runtime'da to'xtatiladi. U immutable: `add` va `multiply` yangi obyekt qaytaradi.
    - `equals` ochiq metod sifatida berilgan, chunki JS'dagi `===` va `includes` uni tanimaydi.
    - `days` primitiv qoldi: u faqat shu funksiyada ishlatiladi va chalkashtirish xavfi yo'q. Hamma narsani o'rash shart emas.
  checklist:
    - "Ikki xil ID'ni almashtirish kompilyatsiya xatosi beradi"
    - "Brand'ga aylantirish faqat smart constructor ichida"
    - "Pul tiyinlarda butun son bilan va valyuta bilan saqlanadi"
    - "Turli valyutalarni qo'shish xato beradi"
    - "createBooking ichida takroriy validatsiya qolmadi"
    - "Value object o'zgarmas, operatsiyalar yangi obyekt qaytaradi"
---

## Muammo

Mana real loyihadan funksiya imzosi:

```ts
function assignDriver(vehicleId: string, driverId: string, companyId: string): Promise<void>;
```

Uchta argument, uchalasi ham `string`. Kimdir `assignDriver(driver.id, vehicle.id, company.id)` deb yozadi. Kompilyator jim. Testlar ham o'tishi mumkin, agar test ma'lumotlarida ID'lar tasodifan mos kelsa. Xato production'da, haydovchi noto'g'ri mashinaga biriktirilganda topiladi.

Boshqa misol: pul. `price: number`. Bu so'mmi yoki dollarmi? Tiyindami yoki so'mdami? `350000.5` qanday yaxlitlanadi? Kodning 40 ta joyida `price * 1.12` bor va ularning ba'zilari `Math.round` qiladi, ba'zilari yo'q. Hisobot va to'lov tizimi orasida bir necha so'm farq chiqadi va buxgalteriya har oy uni qo'lda tuzatadi.

Uchinchi: telefon raqami. `+998 90 123-45-67`, `998901234567`, `90 123 45 67` - bularning hammasi bitta `string`. Validatsiya regex'i 6 ta joyda nusxalangan va ular bir-biridan biroz farq qiladi.

Martin Fowler buni **Primitive Obsession** deb ataydi: domen tushunchalarini o'z tipiga ega qilish o'rniga primitivlar bilan ifodalash.

## Asosiy g'oya

### Primitive Obsession

*Refactoring* kitobining code smells katalogida Fowler ta'kidlaydiki, ko'p dasturchilar pul, koordinata, diapazon, telefon raqami kabi tushunchalar uchun kichik tiplar yaratishdan tortinadi va ularni son yoki satr bilan ifodalaydi. Natijada bu tushunchaga tegishli xatti-harakat (formatlash, solishtirish, validatsiya, birliklarni aylantirish) kod bo'ylab tarqaladi. Asosiy davo - **Replace Primitive with Object**: primitivni o'z tipiga aylantirish. Dastlab u faqat qiymatni o'rab turadi, lekin vaqt o'tishi bilan unga tegishli xatti-harakat shu yerga ko'chib keladi.

Smell'ning tez-tez uchraydigan boshqa ko'rinishlari: tur kodlari (`status: 1 | 2 | 3`), bir nechta primitiv har doim birga yuradi (data clumps: `lat`, `lng`; `amount`, `currency`) va satr ichidagi strukturani parse qilish (`"2024-01-15|2024-01-20"`).

### Value object

Fowler *ValueObject* maqolasida value object'ni shunday ta'riflaydi: tengligi identifikatoriga emas, xossalarining qiymatiga asoslangan obyekt. Ikki nuqta (2, 3) teng, chunki koordinatalari teng, ular xotirada bitta obyekt bo'lishi shart emas. Uning misollari: nuqta, pul (son va valyuta), sana diapazoni (boshlanish va tugash).

Bunga qarama-qarshi **reference object** (Evans terminologiyasida entity): ular identifikator bo'yicha solishtiriladi. Ikki mijozning ismi bir xil bo'lishi ularni bitta mijozga aylantirmaydi. Fowler ta'kidlaydiki, bir tushuncha bir tizimda value, boshqasida reference bo'lishi mumkin: pochta manzili oddiy hisob tizimida qiymat, yetkazib berish tizimida esa alohida identifikatorli obyekt bo'lishi mumkin.

Asosiy qoida: value object'lar **immutable** bo'lishi kerak. Fowler buni aliasing bug misolida ko'rsatadi: bitta sana obyekti ikki joyda ishlatilsa va biri uni o'zgartirsa, ikkinchisi ham jimgina o'zgaradi. Agar value object o'zgarmas bo'lsa, uni bemalol ulashish mumkin, o'zgartirish o'rniga yangisi yaratiladi.

### JavaScript'dagi o'ziga xoslik

Fowler JS haqida alohida eslatma beradi: oddiy obyektlar referens bo'yicha solishtiriladi, shuning uchun ikki `{x: 2, y: 3}` literal teng emas. Klassga `equals` metodi qo'shsangiz ham, `includes()` kabi built-in'lar uni bilmaydi. Immutability uchun faqat getter'li klass yoki qattiqroq nazorat uchun `Object.freeze` ishlatish mumkin.

Bu TS loyihalarida value object'larning narxini oshiradi va keyingi bo'limdagi yengilroq alternativani mantiqli qiladi.

## Chuqurroq: branded tiplar

### Muammo: structural typing

TypeScript structural typing ishlatadi: ikki tip bir xil shaklga ega bo'lsa, ular mos keladi. `type VehicleId = string` yangi tip yaratmaydi, u faqat `string` uchun taxallus. Shuning uchun yuqoridagi `assignDriver` muammosini alias hal qilmaydi.

### Yechim: brand

Dan Vanderkam *Effective TypeScript*da nominal typing'ni simulyatsiya qilish uchun **brand** ishlatishni taklif qiladi: primitiv tipga faqat tip darajasida mavjud bo'lgan belgi qo'shiladi.

```ts
declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

export type PlateNumber = Brand<string, "PlateNumber">;
export type Imei = Brand<string, "Imei">;

const PLATE_RE = /^\d{2}[A-Z]\d{3}[A-Z]{2}$|^\d{2}\d{3}[A-Z]{3}$/;

export function parsePlateNumber(raw: string): PlateNumber {
  const normalized = raw.replace(/\s/g, "").toUpperCase();
  if (!PLATE_RE.test(normalized)) {
    throw new Error(`Davlat raqami formati noto'g'ri: ${raw}`);
  }
  return normalized as PlateNumber;
}

export function parseImei(raw: string): Imei {
  if (!/^\d{15}$/.test(raw)) throw new Error(`IMEI 15 raqam bo'lishi kerak: ${raw}`);
  return raw as Imei;
}
```

Endi `PlateNumber` o'rniga oddiy `string` yoki `Imei` berish kompilyatsiya xatosi. Runtime'da esa bu hamon oddiy satr: JSON'ga aylanadi, `===` bilan solishtiriladi, React state'da muammosiz yashaydi, Postgres'ga to'g'ridan-to'g'ri yoziladi.

Muhim tafsilotlar:

- **Smart constructor yagona eshik.** `as PlateNumber` faqat `parsePlateNumber` ichida bo'lishi kerak. Agar kod bo'ylab `as PlateNumber` tarqalib ketsa, brand hech narsani kafolatlamaydi. Buni code review yoki ESLint'ning `no-restricted-syntax` qoidasi bilan nazorat qilish mumkin.
- **`unique symbol`** brand kalitini boshqa kod tasodifan yarata olmasligini ta'minlaydi. Ba'zi loyihalar oddiyroq `{ readonly __brand: "PlateNumber" }` ishlatadi, bu ham ishlaydi.
- **Kafolat faqat statik.** Brand runtime'da mavjud emas. Tashqaridan (HTTP, DB, navbat) kelgan ma'lumot uchun smart constructor'ni chaqirish majburiy (45-dars).

### Zod bilan brand

Zod 4'da `.brand<"PlateNumber">()` metodi bor: sxema muvaffaqiyatli parse qilgan qiymatning chiqish tipiga brand qo'shadi. Bu chegara qatlamida validatsiya va brand'ni bitta joyda bog'laydi. Zod hujjatlari ta'kidlaydiki, brand faqat statik va `.parse` natijasini runtime'da o'zgartirmaydi.

### Value object yoki brand?

Oddiy evristika:

- **Bitta primitiv, xatti-harakati kam, asosan format va chalkashtirmaslik muhim** (ID'lar, IMEI, telefon, email, davlat raqami) - brand.
- **Bir nechta maydon yoki boy xatti-harakat** (Money, DateRange, GeoPoint bilan masofa hisobi, FuelVolume birlik aylantirish bilan) - klass ko'rinishidagi value object yoki readonly tip va unga tegishli sof funksiyalar moduli.

## Misol: pul

Yomon:

```ts
type Invoice = { lines: { price: number; qty: number }[]; currency: string };

export function invoiceTotal(invoice: Invoice): number {
  return invoice.lines.reduce((sum, l) => sum + l.price * l.qty, 0) * 1.12;
}
```

Narx qaysi birlikda? QQS natijasi qanday yaxlitlanadi? Agar ikki hisob-faktura qo'shilsa va biri USD bo'lsa-chi?

Yaxshi:

```ts
export type Currency = "UZS" | "USD";

export class Money {
  private constructor(
    readonly minorUnits: bigint,
    readonly currency: Currency,
  ) {}

  static zero(currency: Currency): Money {
    return new Money(0n, currency);
  }

  static of(minorUnits: bigint, currency: Currency): Money {
    return new Money(minorUnits, currency);
  }

  add(other: Money): Money {
    if (other.currency !== this.currency) {
      throw new Error(`Valyutalar aralashdi: ${this.currency} va ${other.currency}`);
    }
    return new Money(this.minorUnits + other.minorUnits, this.currency);
  }

  times(qty: number): Money {
    return new Money(this.minorUnits * BigInt(qty), this.currency);
  }

  /** Foizni qo'shadi, natija yarmidan yuqoriga yaxlitlanadi. */
  withPercent(percent: number): Money {
    const scaled = this.minorUnits * BigInt(100 + percent);
    return new Money((scaled + 50n) / 100n, this.currency);
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.minorUnits === other.minorUnits;
  }
}

const VAT_PERCENT = 12;

type InvoiceLine = { price: Money; qty: number };

export function invoiceTotal(lines: readonly InvoiceLine[], currency: Currency): Money {
  const net = lines.reduce((sum, l) => sum.add(l.price.times(l.qty)), Money.zero(currency));
  return net.withPercent(VAT_PERCENT);
}
```

Nima o'zgardi va nega:

- **Birlik tipda.** `minorUnits: bigint` - eng kichik birlikda butun son, kasr xatolari yo'q.
- **Valyuta qiymatning bir qismi.** Turli valyutalarni qo'shish darhol xato beradi, jim o'tmaydi.
- **Yaxlitlash qoidasi bitta joyda va hujjatlangan.** 40 ta joyda `Math.round` o'rniga bitta `withPercent`.
- **Immutable.** Har bir operatsiya yangi `Money` qaytaradi, aliasing bug mumkin emas.
- **Narx:** endi pulni JSON'ga yuborish uchun aniq serializatsiya kerak (`bigint` JSON'ga avtomatik aylanmaydi). Bu chegarada bitta `toDto()` funksiyasi bilan hal qilinadi.

## Qachon qo'llamaslik kerak

- **Faqat bir joyda ishlatiladigan qiymat.** Funksiya ichidagi lokal hisoblagich yoki bitta joyda o'qiladigan flag uchun tip yaratish shovqin. Smell takrorlanish va chalkashtirish xavfida, primitivning o'zida emas.
- **Brand'larni har narsaga qo'yish.** `Brand<number, "Days">`, `Brand<number, "Hours">`, `Brand<string, "Comment">`... Har bir brand smart constructor, import va chegarada aylantirishni talab qiladi. Chalkashtirish real xavf bo'lgan (ID'lar, birliklar) yoki validatsiya muhim bo'lgan joylardan boshlang.
- **Klass value object'lar chegaralarda.** React state, Redux, `structuredClone`, JSON serializatsiya, Next.js server-client chegarasi klass instansiyalarini prototipsiz oddiy obyektga aylantiradi yoki rad etadi. Bu joylarda readonly tip va sof funksiyalar moduli qulayroq.
- **Performance'ga sezgir sikllarda** millionlab kichik obyekt yaratish GC bosimini oshirishi mumkin. Brand bu narxga ega emas, klass value object esa ega. O'lchab ko'ring.
- **ORM bilan ishqalanish.** Prisma brand'larni bilmaydi: repository qatlamida aylantirish kerak. Bu narx, lekin u bitta joyda to'planadi.

## Stack'da: NestJS, Prisma, zod

- **Controller chegarasida parse qiling.** DTO'da `string` qabul qilib, servisga `VehicleId` berish uchun zod sxemasi yoki NestJS pipe ishlating. Servis va domen qatlami faqat brand'langan tiplarni ko'rsin.
- **Prisma natijalari.** Repository ichida `row.id` ni `VehicleId(row.id)` orqali o'tkazing yoki DB'dan kelgan qiymat ishonchli bo'lsa, faqat repository ichida `as` qiling va buni izoh bilan belgilang.
- **Pul Postgres'da.** `numeric` yoki tiyinlarda `bigint` ustun, hech qachon `float`/`double precision`. Kysely yoki Prisma'da `bigint` ni `Money`ga aylantirish repository'da.
- **Next.js server action'lari.** Server va client orasida faqat serializatsiya qilinadigan qiymatlar o'tadi, klass instansiyalari emas. Brand'lar bu chegarani muammosiz kesib o'tadi.

## Xulosa

- Primitive Obsession - domen tushunchasini primitiv bilan ifodalash. Uning belgisi: tarqalgan validatsiya, chalkashtiriladigan argumentlar, birligi noaniq sonlar.
- Value object qiymat bo'yicha solishtiriladi va immutable bo'lishi kerak, aks holda aliasing bug'lar paydo bo'ladi.
- TypeScript'da `type X = string` yangi tip emas. Nominal farq uchun brand ishlating va uni faqat smart constructor orqali yarating.
- Bitta primitiv uchun brand, kompozit va boy xatti-harakatli tushunchalar uchun value object.
- Pul uchun butun son (eng kichik birlikda) va valyuta - minimal talab.
- Chegaralarda (JSON, React state, server-client) klasslarning narxini hisobga oling.
