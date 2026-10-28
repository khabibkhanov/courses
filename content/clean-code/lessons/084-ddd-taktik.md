---
n: 84
slug: ddd-taktik
title: "DDD taktik qismlari: entity, value object, aggregate"
summary: "Eric Evans'ning taktik qurilish bloklari kodni domen qoidalari atrofida tashkil qiladi: identifikatorli entity, qiymat bo'yicha solishtiriladigan value object va invariantlarni bitta ildiz orqali himoya qiladigan aggregate. Bu darsda ularni TypeScript'da qanday yozish va qayerda to'xtash kerakligini ko'ramiz."
duration: 40
sources:
  - id: ddd-evans
    note: "Kitobning model-driven dizayn qurilish bloklari haqidagi qismi: Entities, Value Objects, Aggregates, Repositories, Factories"
  - id: fowler-ddd-aggregate
    note: "\"DDD_Aggregate\" (2013): aggregate ta'rifi, ildiz, tashqi havolalar va tranzaksiya chegarasi"
  - id: fowler-value-object
    note: "\"ValueObject\" (2016): qiymat bo'yicha tenglik, immutability, aliasing xatosi va kontekstga bog'liqlik"
quiz:
  - q: "Ikki `Money` obyekti: `{ amount: 50000, currency: \"UZS\" }` va yana bir xuddi shunday obyekt. JavaScript'da `a === b` false qaytaradi. Value object nuqtai nazaridan to'g'ri yondashuv qaysi?"
    options:
      - "Value object uchun qiymat bo'yicha solishtiradigan `equals` metodini aniqlash"
      - "Ularga noyob `id` berib, `id` bo'yicha solishtirish"
      - "`JSON.stringify` natijasini bazaga yozish"
      - "Obyektlarni mutable qilib, bittasini ikkinchisiga nusxalash"
    answer: 0
    explain: "Fowler JavaScript'da obyekt literallari reference bo'yicha solishtirilishini va value object uchun `equals` aniqlash kerakligini aytadi. `id` berish uni entity'ga aylantiradi."
  - q: "`partyDate` va `retirementDate` bitta mutable `Date` obyektiga ishora qiladi. Birinchisini `setDate()` bilan o'zgartirish ikkinchisini ham o'zgartirdi. Bu qaysi muammo va uni qanday oldini olish mumkin?"
    options:
      - "Race condition; mutex qo'yish kerak"
      - "Aliasing xatosi; value object'larni immutable qilish va o'zgarish o'rniga yangi obyekt yaratish"
      - "Timezone xatosi; UTC ishlatish kerak"
      - "Memory leak; obyektni o'chirish kerak"
    answer: 1
    explain: "Bu Fowler maqolasidagi klassik aliasing misoli. Immutable value object'larda bunday xato bo'lmaydi: qiymatni o'zgartirish yangi obyekt yaratish demak."
  - q: "`Order` aggregate ichida `OrderLine`lar bor. Boshqa servis `orderLineRepository.updateQuantity(lineId, 5)` chaqiradi. Bu qaysi qoidani buzadi?"
    options:
      - "Hech qanday, repository'lar istalgan obyekt uchun bo'lishi mumkin"
      - "Faqat nomlash qoidasini"
      - "Value object immutability'ni"
      - "Aggregate'ga tashqaridan faqat ildiz orqali murojaat qilinadi; ichki obyektni chetlab o'zgartirish ildizga invariantlarni (masalan, buyurtma summasi limiti) himoya qilish imkonini bermaydi"
    answer: 3
    explain: "Fowler: aggregate'dan tashqaridagi havolalar faqat ildizga borishi kerak. Repository ham aggregate bo'yicha bo'ladi: `OrderRepository`, `OrderLineRepository` emas."
  - q: "Bitta tranzaksiyada ham `Order`, ham `Customer` aggregate'larini o'zgartirish kerak bo'lib qoldi (buyurtma va mijozning bonus balansi). Fowler'ning maqolasidagi qoidaga ko'ra nima o'ylash kerak?"
    options:
      - "Tranzaksiyalar aggregate chegarasini kesib o'tmasligi kerak; chegaralarni qayta ko'rib chiqish yoki ikkinchi o'zgarishni alohida (masalan, hodisa orqali) bajarish"
      - "Ikkala aggregate'ni bitta katta aggregate'ga birlashtirish har doim to'g'ri"
      - "Tranzaksiyadan butunlay voz kechish"
      - "Customer'ni value object qilish"
    answer: 0
    explain: "Maqolada tranzaksiyalar aggregate chegarasidan o'tmasligi aytiladi. Amalda bu chegara tanlovini tekshirish yoki eventual yangilanishni qabul qilish demakdir. Hammasini birlashtirish katta, sekin aggregate beradi."
  - q: "Fleet tizimida `Address` value object bo'lishi kerakmi yoki entity?"
    options:
      - "Har doim value object"
      - "Har doim entity"
      - "Kontekstga bog'liq: oddiy yetkazib berish manzili uchun value object yetarli, lekin manzillar alohida boshqariladigan va havola qilinadigan geokodlash tizimida u entity bo'lishi mumkin"
      - "Address umuman model qilinmaydi"
    answer: 2
    explain: "Fowler aynan pochta manzili misolida buni ko'rsatadi: ko'p tizimlarda u oddiy qiymat, lekin xaritalash tizimida havola qilinadigan obyekt bo'lishi mumkin."
  - q: "Kichik ichki tizimda (5 ta jadval, deyarli qoidasiz CRUD) jamoa har bir jadval uchun aggregate, factory, domain event va repository yozdi. Eng halol baho qaysi?"
    options:
      - "To'g'ri, DDD har qanday loyihada to'liq qo'llanadi"
      - "Faqat domain event ortiqcha"
      - "Muammo yo'q, kod ko'p bo'lsa ham tushunarli"
      - "Taktik pattern'lar murakkab domen qoidalarini himoya qilish uchun; qoidasiz CRUD'da ular himoya qilinadigan hech narsasiz qatlam qo'shadi"
    answer: 3
    explain: "Evans DDD'ni murakkab domenlar uchun taklif qiladi. Invariant yo'q joyda aggregate faqat getter va setter'lar to'plami bo'lib qoladi."
task:
  title: "Anemic buyurtma modelini aggregate'ga aylantirish"
  prompt: |
    Quyidagi kodda `Order` - oddiy ma'lumot qopi, barcha qoidalar servisda. Qoidalar: buyurtmaga faqat `draft` holatida mahsulot qo'shiladi; bitta mahsulot qayta qo'shilsa, miqdori qo'shiladi; buyurtma summasi 50 000 000 so'mdan oshmasligi kerak; bo'sh buyurtma tasdiqlanmaydi.

    1. `Money` value object yarating: immutable, valyutani tekshiradi, `equals` va `add` metodlari bor.
    2. `Order`ni aggregate ildiziga aylantiring: barcha o'zgarishlar uning metodlari orqali, invariantlar ichida.
    3. Ichki `lines` massivini tashqaridan o'zgartirib bo'lmasin.
    4. Servis faqat yuklash, aggregate metodini chaqirish va saqlashdan iborat bo'lsin.
  lang: ts
  starter: |
    type OrderLine = { productId: string; quantity: number; unitPrice: number };
    type Order = { id: string; status: string; lines: OrderLine[]; total: number };

    interface OrderRepo {
      get(id: string): Promise<Order>;
      save(order: Order): Promise<void>;
    }

    export class OrderService {
      constructor(private readonly repo: OrderRepo) {}

      async addItem(orderId: string, productId: string, qty: number, price: number) {
        const order = await this.repo.get(orderId);
        if (order.status !== "draft") throw new Error("cannot modify");
        const existing = order.lines.find((l) => l.productId === productId);
        if (existing) existing.quantity += qty;
        else order.lines.push({ productId, quantity: qty, unitPrice: price });
        order.total = order.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
        if (order.total > 50_000_000) throw new Error("limit");
        await this.repo.save(order);
      }

      async confirm(orderId: string) {
        const order = await this.repo.get(orderId);
        if (order.lines.length === 0) throw new Error("empty");
        order.status = "confirmed";
        await this.repo.save(order);
      }
    }
  solution: |
    export class Money {
      private constructor(readonly amount: number, readonly currency: "UZS" | "USD") {}

      static of(amount: number, currency: "UZS" | "USD"): Money {
        if (!Number.isInteger(amount) || amount < 0) throw new Error("Money: manfiy yoki kasr summa");
        return new Money(amount, currency);
      }
      add(other: Money): Money {
        this.assertSameCurrency(other);
        return new Money(this.amount + other.amount, this.currency);
      }
      times(n: number): Money {
        return Money.of(this.amount * n, this.currency);
      }
      greaterThan(other: Money): boolean {
        this.assertSameCurrency(other);
        return this.amount > other.amount;
      }
      equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
      }
      private assertSameCurrency(other: Money): void {
        if (other.currency !== this.currency) throw new Error("Money: valyutalar har xil");
      }
    }

    type OrderStatus = "draft" | "confirmed";
    type OrderLine = Readonly<{ productId: string; quantity: number; unitPrice: Money }>;

    export type OrderError = "not_draft" | "limit_exceeded" | "empty_order" | "invalid_quantity";

    const ORDER_LIMIT = Money.of(50_000_000, "UZS");

    export class Order {
      private constructor(
        readonly id: string,
        private status: OrderStatus,
        private lines: OrderLine[],
      ) {}

      static draft(id: string): Order {
        return new Order(id, "draft", []);
      }
      static restore(id: string, status: OrderStatus, lines: readonly OrderLine[]): Order {
        return new Order(id, status, [...lines]);
      }

      get currentStatus(): OrderStatus { return this.status; }
      get orderLines(): readonly OrderLine[] { return this.lines; }

      total(): Money {
        return this.lines.reduce((sum, l) => sum.add(l.unitPrice.times(l.quantity)), Money.of(0, "UZS"));
      }

      addItem(productId: string, quantity: number, unitPrice: Money): OrderError | null {
        if (this.status !== "draft") return "not_draft";
        if (!Number.isInteger(quantity) || quantity <= 0) return "invalid_quantity";
        const next = mergeLine(this.lines, productId, quantity, unitPrice);
        const nextTotal = next.reduce((s, l) => s.add(l.unitPrice.times(l.quantity)), Money.of(0, "UZS"));
        if (nextTotal.greaterThan(ORDER_LIMIT)) return "limit_exceeded";
        this.lines = next;
        return null;
      }

      confirm(): OrderError | null {
        if (this.status !== "draft") return "not_draft";
        if (this.lines.length === 0) return "empty_order";
        this.status = "confirmed";
        return null;
      }
    }

    function mergeLine(lines: readonly OrderLine[], productId: string, qty: number, price: Money): OrderLine[] {
      const exists = lines.some((l) => l.productId === productId);
      if (!exists) return [...lines, { productId, quantity: qty, unitPrice: price }];
      return lines.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + qty } : l));
    }

    export interface OrderRepository {
      get(id: string): Promise<Order>;
      save(order: Order): Promise<void>;
    }

    export class AddItemToOrder {
      constructor(private readonly orders: OrderRepository) {}

      async execute(orderId: string, productId: string, qty: number, priceUzs: number): Promise<OrderError | null> {
        const order = await this.orders.get(orderId);
        const error = order.addItem(productId, qty, Money.of(priceUzs, "UZS"));
        if (error) return error;
        await this.orders.save(order);
        return null;
      }
    }
  solutionNotes: |
    - `Money` immutable: `add` va `times` yangi obyekt qaytaradi, konstruktor private va `of` orqali validatsiya qilinadi. Valyutalarni aralashtirish xatosi tip va runtime darajasida ushlanadi.
    - `Order` - aggregate ildizi. `lines` private, tashqariga `readonly` ko'rinish beriladi. Ichki qatorni chetlab o'zgartirish imkoni yo'q.
    - Limit tekshiruvi o'zgarish qo'llanishidan oldin bajariladi: invariant buzilgan holat hech qachon obyektda bo'lmaydi (starter'da summa avval o'zgarib, keyin xato otilardi).
    - `total` saqlanadigan maydon emas, hisoblanadi. Bu ikki manba (lines va total) orasidagi nomuvofiqlikni yo'qotadi.
    - Xatolar biznes tilidagi qiymat sifatida qaytadi (28-dars). Controller ularni HTTP'ga aylantiradi.
    - Repository aggregate bo'yicha: `OrderRepository`, `OrderLineRepository` yo'q. Aggregate butunligicha yuklanadi va saqlanadi.
    - `Order` entity: uning tengligi `id` bo'yicha. `OrderLine` bu yerda ichki qiymat, uning alohida identifikatori kerak emas.
  checklist:
    - "Money immutable va qiymat bo'yicha equals qiladi"
    - "Order ichki lines massivini tashqariga o'zgartiriladigan holda bermaydi"
    - "Barcha invariantlar Order metodlari ichida tekshiriladi"
    - "Invariant buzilsa, obyekt holati o'zgarmaydi"
    - "Servis faqat yuklash, metod chaqirish, saqlashdan iborat"
    - "Repository aggregate ildizi uchun, ichki obyektlar uchun emas"
---

## Muammo

Ko'p TypeScript loyihalarida domen modeli shunday ko'rinadi: `Order` tipi - maydonlar to'plami, barcha qoidalar esa `OrderService`, `OrderValidator`, `OrderHelper` bo'ylab tarqalgan. "Tasdiqlangan buyurtmaga mahsulot qo'shib bo'lmaydi" qoidasi `addItem`da bor, lekin admin paneldagi `bulkUpdate`da yo'q. "Buyurtma summasi limitdan oshmasin" qoidasi controller'da tekshiriladi, cron job esa uni chetlab o'tadi. Summa `total` maydonida saqlanadi va kimdir qatorlarni o'zgartirib, `total`ni yangilashni unutadi.

Natijada bazada "mumkin bo'lmagan" holatlar paydo bo'ladi va hech kim ular qayerdan kelganini bilmaydi. Muammo - qoidalarning **egasi yo'q**. Ma'lumot bir joyda, uni himoya qiladigan mantiq boshqa joyda, va unga istalgan yo'l bilan yetib borish mumkin.

## Asosiy g'oya

Eric Evans 2003 yilgi *Domain-Driven Design* kitobida model-driven dizayn uchun bir nechta qurilish bloklarini taklif qiladi. Ularni ko'pincha DDD'ning "taktik" qismi deb atashadi (strategik qismi - bounded context va context map, ular bu dars mavzusi emas). Uchta asosiysi:

- **Entity** - vaqt davomida va turli holatlar orqali saqlanadigan **identifikatorga** ega obyekt. Mashina raqami o'zgarsa ham, yoqilg'i darajasi o'zgarsa ham, bu o'sha mashina. Ikki entity tengligi ularning `id`si bilan aniqlanadi, atributlari bilan emas.
- **Value Object** - identifikatorsiz, faqat **qiymati** bilan muhim obyekt. Fowler'ning maqolasida misollar: 2D nuqta, pul summasi, sana oralig'i. Ikki `Money(50000, UZS)` bir xil, ularning qaysi biri ekanining ahamiyati yo'q.
- **Aggregate** - bitta birlik sifatida qaraladigan domen obyektlari to'plami. Fowler'ning misoli: buyurtma va uning qatorlari. Aggregate'ning bitta obyekti **ildiz** (root) bo'ladi va tashqi dunyo faqat u bilan gaplashadi.

Kitobda bularga yondosh ravishda Repository (aggregate'larni saqlash va yuklash abstraksiyasi) va Factory (murakkab yaratishni inkapsulyatsiya qilish) ham beriladi.

Bu bloklarning umumiy maqsadi: **domen qoidalariga egalik bering**. Qoida o'zi himoya qiladigan ma'lumot bilan bir joyda yashasin va unga boshqa yo'l bilan yetib bo'lmasin.

## Chuqurroq: har bir blokning mexanikasi

### Value object: tenglik va immutability

Fowler'ning "ValueObject" maqolasi ikki asosiy xususiyatni ta'kidlaydi.

**Qiymat bo'yicha tenglik.** JavaScript'da alohida yaratilgan, qiymatlari bir xil ikki obyekt literali teng emas, chunki solishtirish reference bo'yicha. Shuning uchun value object uchun `equals` metodini o'zingiz aniqlashingiz kerak. Fowler qo'shimcha qiladiki, bunday maxsus `equals` boshqa kutubxonalar uchun ko'rinmas: `Set` yoki `Array.includes` uni chaqirmaydi. TypeScript'da bu muhim cheklov: `new Set<Money>()` qiymat bo'yicha takrorlarni yo'qotmaydi.

**Immutability.** Value object o'zgarmas bo'lishi kerak: qiymatni o'zgartirish o'rniga yangi obyekt yaratiladi. Fowler buni aliasing xatosi bilan tushuntiradi: Java 8 dan oldingi kodda `partyDate` va `retirementDate` bitta mutable `Date`ga ishora qilgan, va bayram sanasini shanbaga ko'chirish nafaqaga chiqish sanasini ham ko'chirgan. JavaScript'ning `Date` klassi ham mutable, shuning uchun bu xato bizning stack'da ham real.

Fowler yana bir muhim narsani aytadi: biror narsa value yoki reference obyekt ekanligi **kontekstga bog'liq**. Pochta manzili ko'p tizimlarda oddiy qiymat, lekin xaritalash tizimida havola qilinadigan entity bo'lishi mumkin. Primitive'larni domen tiplariga almashtirish (telefon raqami, mashina davlat raqami) validatsiya va aniqlik beradi (44-dars).

### Entity: identifikator va hayot sikli

Entity'ning asosiy savoli: "bu o'sha narsami?" Mashinaning davlat raqami o'zgarishi mumkin (qayta ro'yxatdan o'tkazish), shuning uchun u yaxshi identifikator emas, VIN yoki ichki UUID yaxshiroq. Entity'ning holati o'zgaradi, lekin o'zgarishlar uning metodlari orqali bo'lishi kerak, shunda qoidalar bir joyda qoladi. `vehicle.status = "on_trip"` emas, `vehicle.startTrip(driverId)`.

### Aggregate: ildiz, chegara, tranzaksiya

Fowler'ning "DDD_Aggregate" maqolasidagi qoidalarni o'z so'zlarimiz bilan:

- **Tashqi havolalar faqat ildizga.** Aggregate'dan tashqaridagi kod faqat ildiz obyektiga havola saqlaydi. Shunday qilib ildiz butun aggregate'ning yaxlitligini ta'minlay oladi. `OrderLine`ni to'g'ridan-to'g'ri o'zgartirish ildizning summa limitini tekshirish imkoniyatini tortib oladi.
- **Saqlash va uzatish birligi.** Aggregate'lar butunligicha yuklanadi va saqlanadi. Shuning uchun repository aggregate bo'yicha bo'ladi: `OrderRepository` bor, `OrderLineRepository` yo'q.
- **Tranzaksiya aggregate chegarasini kesmaydi.** Maqolaning so'zlari bilan: "Transactions should not cross aggregate boundaries." Agar bitta biznes amali ikki aggregate'ni bir tranzaksiyada o'zgartirishni talab qilsa, bu chegaralarni qayta ko'rib chiqish uchun signal.

Fowler aggregate'ni oddiy kolleksiyadan ham farqlaydi: aggregate - domen tushunchasi (buyurtma, klinika tashrifi, playlist), kolleksiya esa umumiy texnik konstruksiya.

### Aggregate o'lchami

Aggregate qancha katta bo'lishi kerak? Bu DDD amaliyotchilari orasida ko'p muhokama qilinadi. Umumiy tavsiya (bu jamoatchilikning tajribaviy xulosasi, Evans kitobidagi qat'iy qoida emas): aggregate'ni kichik saqlang va boshqa aggregate'larga obyekt orqali emas, `id` orqali havola qiling. `Trip` aggregate'i ichida butun `Vehicle` obyekti emas, `vehicleId` bo'ladi. Katta aggregate'lar har bir o'zgarishda ko'p ma'lumot yuklaydi va bir vaqtdagi tahrirlarda ko'proq to'qnashadi.

## Misol: reys va yoqilg'i

Yomon variant. Anemic model, qoidalar servislar bo'ylab:

```ts
type Trip = {
  id: string;
  vehicleId: string;
  status: string;
  fuelEvents: { liters: number; at: Date }[];
  totalLiters: number;
};

export function addFuel(trip: Trip, liters: number): void {
  trip.fuelEvents.push({ liters, at: new Date() });
  trip.totalLiters += liters;
}

export function finishTrip(trip: Trip): void {
  trip.status = "finished";
}
```

`addFuel`ni tugagan reysga ham chaqirish mumkin, `totalLiters`ni kimdir to'g'ridan-to'g'ri o'zgartirishi mumkin, `fuelEvents.push` boshqa joydan ham bajarilishi mumkin va `liters` manfiy bo'lishiga hech narsa to'sqinlik qilmaydi.

Yaxshi variant. `Liters` value object va `Trip` aggregate ildizi:

```ts
export class Liters {
  private constructor(readonly value: number) {}

  static of(value: number): Liters {
    if (!Number.isFinite(value) || value <= 0) throw new RangeError("Liters musbat bo'lishi kerak");
    return new Liters(Math.round(value * 100) / 100);
  }
  add(other: Liters): Liters {
    return new Liters(this.value + other.value);
  }
  equals(other: Liters): boolean {
    return this.value === other.value;
  }
}

type FuelEvent = Readonly<{ liters: Liters; at: Date }>;
export type TripStatus = "in_progress" | "finished";
export type TripError = "trip_finished" | "tank_overflow";

export class Trip {
  private constructor(
    readonly id: string,
    readonly vehicleId: string,
    private readonly tankCapacity: Liters,
    private status: TripStatus,
    private readonly fuelEvents: FuelEvent[],
  ) {}

  static start(id: string, vehicleId: string, tankCapacity: Liters): Trip {
    return new Trip(id, vehicleId, tankCapacity, "in_progress", []);
  }

  refuel(liters: Liters, at: Date): TripError | null {
    if (this.status === "finished") return "trip_finished";
    if (liters.value > this.tankCapacity.value) return "tank_overflow";
    this.fuelEvents.push({ liters, at: new Date(at.getTime()) });
    return null;
  }

  finish(): TripError | null {
    if (this.status === "finished") return "trip_finished";
    this.status = "finished";
    return null;
  }

  totalFuel(): Liters | null {
    if (this.fuelEvents.length === 0) return null;
    return this.fuelEvents.map((e) => e.liters).reduce((a, b) => a.add(b));
  }

  get events(): readonly FuelEvent[] {
    return this.fuelEvents;
  }
}
```

Nima o'zgardi:

- **Qoidalarning egasi bor.** "Tugagan reysga yoqilg'i qo'shilmaydi" va "bir quyish bak hajmidan oshmaydi" faqat `Trip.refuel` ichida. Ularni chetlab o'tadigan yo'l yo'q.
- **Hisoblanadigan qiymat saqlanmaydi.** `totalLiters` o'rniga `totalFuel()`: ikki manba orasida nomuvofiqlik bo'lishi mumkin emas.
- **Value object primitive'ni almashtirdi.** `Liters` manfiy yoki `NaN` bo'la olmaydi.
- **Aliasing'dan himoya.** `at` sanasi nusxalanadi, chunki `Date` mutable va chaqiruvchi uni keyin o'zgartirishi mumkin.
- **Boshqa aggregate'ga `id` orqali havola.** `Trip` ichida `Vehicle` obyekti emas, `vehicleId`.

## Qachon qo'llamaslik kerak

- **Qoidasiz CRUD.** Agar domen "ma'lumotni saqla va ko'rsat"dan iborat bo'lsa, aggregate faqat getter va setter'lar qopi bo'lib qoladi. Evans DDD'ni murakkab domenlar uchun taklif qiladi, oddiy ma'lumot boshqaruvi uchun emas.
- **O'qish modellari.** Hisobotlar, dashboard'lar va qidiruv uchun aggregate'larni yuklab, ularni yig'ish sekin va noqulay. O'qish tomonida to'g'ridan-to'g'ri SQL yoki maxsus so'rovlar ancha toza (bu CQRS g'oyasiga yaqin, lekin buni qilish uchun to'liq CQRS kerak emas).
- **ORM bilan kurash.** Prisma generatsiya qiladigan tiplar oddiy obyektlar, ular klasslarni qaytarmaydi. Har bir aggregate uchun mapper yozish real xarajat. Agar invariantlar oddiy bo'lsa, sof funksiyalar va discriminated union tiplar (45-dars) klass-asosli aggregate'dan arzonroq bo'lishi mumkin.
- **Hammasi value object.** Har bir `string`ni klassga o'rash (`FirstName`, `LastName`, `Comment`) foyda bermaydi, agar ularda qoida yoki xatti-harakat bo'lmasa. Branded tip (44-dars) ko'pincha yetarli va runtime narxi nol.
- **Juda katta aggregate.** "Kompaniya va uning barcha mashinalari va reyslari" bitta aggregate bo'lsa, har bir GPS nuqtasi butun kompaniyani yuklaydi va bir vaqtdagi yozuvlar doimo to'qnashadi.

## Stack'da: TypeScript va Prisma

- **Private konstruktor + static factory.** `Money.of`, `Order.draft`, `Order.restore` - yaratish va bazadan tiklash yo'llarini ajratadi. Tiklashda invariantlarni qayta tekshirish yoki ishonish - ongli tanlov.
- **`readonly` va `ReadonlyArray`.** Ichki kolleksiyani `readonly OrderLine[]` sifatida qaytaring. Bu compile vaqtidagi himoya. Runtime'da kerak bo'lsa `Object.freeze` qo'shing.
- **Repository mapping.** `PrismaOrderRepository.get` Prisma qatorlarini `Order.restore(...)`ga aylantiradi, `save` esa aggregate'dan qatorlar yasaydi va ularni bitta `$transaction` ichida yozadi. Bu Fowler'ning "aggregate - saqlash birligi" qoidasining amaliy ko'rinishi.
- **Optimistik lock.** Aggregate'ga `version` maydoni qo'shib, `update ... where id = ? and version = ?` bilan saqlash bir vaqtdagi o'zgarishlarni ushlaydi (87-dars).
- **Pul uchun float emas.** So'm butun son, boshqa valyutalar uchun minor birliklar (tiyin, sent) yoki `bigint`. `Money` value object bu qarorni bitta joyga yig'adi.

## Xulosa

- Entity identifikator bilan, value object qiymat bilan aniqlanadi. Qaysi biri ekanligi kontekstga bog'liq.
- Value object immutable bo'lsin va `equals`ni o'zi aniqlasin. JavaScript'ning reference tengligi va mutable `Date` aliasing xatolarini osonlashtiradi.
- Aggregate - bitta birlik sifatida qaraladigan obyektlar to'plami. Tashqi havolalar faqat ildizga, saqlash va yuklash butunligicha.
- Tranzaksiya aggregate chegarasini kesmasligi kerak. Kesishi kerak bo'lsa, chegarani qayta ko'rib chiqing.
- Taktik pattern'lar murakkab qoidalarni himoya qilish uchun. Qoidasiz CRUD va o'qish modellarida ular ortiqcha.
