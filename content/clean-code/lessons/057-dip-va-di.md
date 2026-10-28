---
n: 57
slug: dip-va-di
title: "Dependency Inversion va DI (NestJS)"
summary: "Dependency Inversion - bu tamoyil, dependency injection - bu texnika, IoC konteyner esa vosita. Bu darsda uchalasini ajratamiz, Clean Architecture'dagi \"bog'liqlik nazorat oqimiga teskari\" g'oyasini va NestJS'da interfeyslar runtime'da yo'qolgani uchun injection token'lar bilan ishlashni ko'ramiz."
duration: 40
sources:
  - id: clean-arch
    note: "DIP bobi: barqaror abstraksiyalar, abstrakt factory, nazorat oqimi va manba kod bog'liqligining qarama-qarshiligi; dependency rule bilan bog'liqlik"
  - id: nestjs-providers
    note: "Providers sahifasi: konstruktor injection, tip bo'yicha resolve, interfeys va type alias'lar kompilyatsiyada o'chirilishi, @Inject token, @Optional, singleton default"
  - id: nestjs-docs
    note: "Custom providers bo'limi: useClass, useValue, useFactory, useExisting; string/Symbol token'lar, abstrakt klass token sifatida"
quiz:
  - q: "DIP, DI va IoC konteyner o'rtasidagi to'g'ri munosabat qaysi?"
    options:
      - "Uchalasi bir narsa"
      - "DIP - bog'liqlik yo'nalishi haqidagi tamoyil; DI - bog'liqlikni tashqaridan berish texnikasi; konteyner - DI'ni avtomatlashtiradigan vosita"
      - "DI - tamoyil, DIP - framework"
      - "IoC konteynersiz DIP mumkin emas"
    answer: 1
    explain: "DIP'ni konteynersiz, oddiy konstruktor argumentlari bilan bajarish mumkin. DI esa DIP'siz ham ishlatilishi mumkin (konkret klassni injekt qilish). Konteyner faqat obyektlar grafini yig'ishni avtomatlashtiradi."
  - q: "NestJS'da `constructor(private readonly repo: VehicleRepository)` va `VehicleRepository` - `interface`. Bootstrap'da nima bo'ladi?"
    options:
      - "Nest avtomatik ravishda interfeysni amalga oshiradigan klassni topadi"
      - "Hammasi ishlaydi, chunki TypeScript interfeysni biladi"
      - "Nest bog'liqlikni resolve qila olmaydi: interfeys kompilyatsiyada o'chiriladi va runtime'da token sifatida mavjud emas"
      - "Nest yangi bo'sh obyekt yaratadi"
    answer: 2
    explain: "NestJS hujjatida aytilganidek, Nest konstruktor parametrini TypeScript emit qilgan metadata orqali resolve qiladi va tip runtime'da mavjud bo'lishi, ya'ni klass bo'lishi kerak. Interfeys uchun string/Symbol token va `@Inject()` yoki abstrakt klass kerak."
  - q: "Clean Architecture'da DIP'ning \"inversion\" so'zi nimani anglatadi?"
    options:
      - "Manba kod bog'liqligi nazorat oqimiga teskari yo'nalishda: yuqori darajali qoida past darajali modulni chaqiradi, lekin unga emas, abstraksiyaga bog'liq va past darajali modul o'sha abstraksiyani amalga oshiradi"
      - "Klasslar ierarxiyasini teskari qilish"
      - "Testlarni koddan oldin yozish"
      - "Ma'lumotlar bazasini UI'dan oldin loyihalash"
    answer: 0
    explain: "Nazorat oqimi: biznes qoidasi -> repository -> DB. Manba bog'liqligi: biznes qoidasi -> port (abstraksiya) <- DB adapter. Bog'liqlik o'qi nazorat oqimiga qarshi burilgan, shuning uchun \"inversion\"."
  - q: "Kim abstraksiyaga (port interfeysiga) egalik qilishi kerak?"
    options:
      - "Infratuzilma moduli (masalan, `PrismaModule`)"
      - "Umumiy `interfaces/` papkasi"
      - "Har bir implementatsiya o'z interfeysini e'lon qiladi"
      - "Uni ishlatadigan yuqori darajali modul: interfeys mijoz ehtiyojini ifodalaydi va mijoz bilan birga yashaydi"
    answer: 3
    explain: "Agar interfeys infratuzilma modulida bo'lsa, domen modul baribir infratuzilmaga bog'liq va inversiya bo'lmadi. Port mijoz tilida, mijoz modulida e'lon qilinadi, adapter esa uni import qiladi."
  - q: "Qaysi holatda konkret klassni to'g'ridan-to'g'ri injekt qilish (abstraksiyasiz) oqilona?"
    options:
      - "Hech qachon"
      - "Bog'liqlik barqaror, bitta implementatsiyaga ega, testda almashtirish shart emas yoki uni konteyner orqali osongina almashtirish mumkin (masalan, sof hisoblash servisi yoki `ConfigService`)"
      - "Faqat Java'da"
      - "Faqat bog'liqlik tashqi tarmoq servisi bo'lsa"
    answer: 1
    explain: "Martin ham barqaror konkret narsalarga (masalan, standart kutubxonaga) bog'lanishni muammo deb bilmaydi. DIP o'zgaruvchan, xavfli konkret narsalar (DB, tashqi API, framework) uchun muhim. NestJS'da `overrideProvider` testda konkret klassni ham almashtira oladi."
  - q: "`useFactory` qachon `useClass`dan yaxshiroq?"
    options:
      - "Har doim"
      - "Hech qachon"
      - "Implementatsiyani tanlash yoki yaratish runtime ma'lumotiga (config, boshqa provider) bog'liq bo'lsa, masalan, muhitga qarab S3 yoki lokal disk"
      - "Klassda konstruktor bo'lmasa"
    answer: 2
    explain: "`useFactory` `inject` ro'yxatidagi provider'larni argument sifatida oladi va qaysi obyektni qaytarishni kod bilan hal qiladi. `useClass` esa ro'yxatdan o'tkazish vaqtida tanlangan klassni yaratadi."
task:
  title: "Yoqilg'i servisini infratuzilmadan ajratish (NestJS)"
  prompt: |
    `FuelTheftService` yoqilg'i o'g'irlanishini aniqlaydi. U to'g'ridan-to'g'ri `PrismaService`ga va `TelegramBotClient`ga bog'langan, shuning uchun:

    - unit test uchun haqiqiy ma'lumotlar bazasi yoki murakkab Prisma mock kerak;
    - ogohlantirish kanali (Telegram) ni SMS ga o'zgartirish domen servisini o'zgartirishni talab qiladi.

    1. Domen servisi o'z ehtiyojini ifodalaydigan port'larni (interfeys) e'lon qilsin.
    2. Port'larni NestJS'da injection token'lar bilan ro'yxatdan o'tkazing (interfeyslar runtime'da yo'qligini hisobga oling).
    3. Prisma va Telegram adapterlarini yozing.
    4. Domen servisini Nest'siz, oddiy obyektlar bilan testlash mumkinligini ko'rsating.
  lang: ts
  starter: |
    import { Injectable } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";
    import { TelegramBotClient } from "../telegram/telegram.client";

    @Injectable()
    export class FuelTheftService {
      constructor(
        private readonly prisma: PrismaService,
        private readonly telegram: TelegramBotClient,
      ) {}

      async checkVehicle(vehicleId: string): Promise<boolean> {
        const rows = await this.prisma.fuelReading.findMany({
          where: { vehicleId },
          orderBy: { at: "desc" },
          take: 2,
        });
        if (rows.length < 2) return false;
        const [curr, prev] = rows;
        const drop = prev.liters - curr.liters;
        const ignitionOff = !curr.ignitionOn;
        if (drop > 15 && ignitionOff) {
          await this.telegram.sendMessage(
            process.env.FLEET_ALERT_CHAT_ID ?? "",
            `Yoqilg'i keskin kamaydi: ${vehicleId}, -${drop} L`,
          );
          return true;
        }
        return false;
      }
    }
  solution: |
    // fuel/ports.ts - port'lar domen modulida, domen tilida
    export type FuelSample = { liters: number; ignitionOn: boolean; at: Date };

    export interface FuelReadings {
      lastTwo(vehicleId: string): Promise<[FuelSample, FuelSample] | null>; // [joriy, oldingi]
    }

    export interface FleetAlerts {
      fuelDrop(vehicleId: string, liters: number): Promise<void>;
    }

    export const FUEL_READINGS = Symbol("FUEL_READINGS");
    export const FLEET_ALERTS = Symbol("FLEET_ALERTS");

    // fuel/fuel-theft.service.ts
    import { Inject, Injectable } from "@nestjs/common";

    const SUSPICIOUS_DROP_LITERS = 15;

    @Injectable()
    export class FuelTheftService {
      constructor(
        @Inject(FUEL_READINGS) private readonly readings: FuelReadings,
        @Inject(FLEET_ALERTS) private readonly alerts: FleetAlerts,
      ) {}

      async checkVehicle(vehicleId: string): Promise<boolean> {
        const pair = await this.readings.lastTwo(vehicleId);
        if (!pair) return false;
        const [curr, prev] = pair;
        const drop = prev.liters - curr.liters;
        if (drop <= SUSPICIOUS_DROP_LITERS || curr.ignitionOn) return false;
        await this.alerts.fuelDrop(vehicleId, drop);
        return true;
      }
    }

    // infra/prisma-fuel-readings.ts - adapter port'ni import qiladi, aksincha emas
    @Injectable()
    export class PrismaFuelReadings implements FuelReadings {
      constructor(private readonly prisma: PrismaService) {}
      async lastTwo(vehicleId: string): Promise<[FuelSample, FuelSample] | null> {
        const rows = await this.prisma.fuelReading.findMany({
          where: { vehicleId }, orderBy: { at: "desc" }, take: 2,
          select: { liters: true, ignitionOn: true, at: true },
        });
        return rows.length === 2 ? [rows[0], rows[1]] : null;
      }
    }

    // infra/telegram-fleet-alerts.ts
    @Injectable()
    export class TelegramFleetAlerts implements FleetAlerts {
      constructor(private readonly bot: TelegramBotClient, private readonly chatId: string) {}
      fuelDrop(vehicleId: string, liters: number): Promise<void> {
        return this.bot.sendMessage(this.chatId, `Yoqilg'i keskin kamaydi: ${vehicleId}, -${liters} L`);
      }
    }

    // fuel/fuel.module.ts
    @Module({
      imports: [PrismaModule, TelegramModule, ConfigModule],
      providers: [
        FuelTheftService,
        { provide: FUEL_READINGS, useClass: PrismaFuelReadings },
        {
          provide: FLEET_ALERTS,
          useFactory: (bot: TelegramBotClient, config: ConfigService) =>
            new TelegramFleetAlerts(bot, config.getOrThrow<string>("FLEET_ALERT_CHAT_ID")),
          inject: [TelegramBotClient, ConfigService],
        },
      ],
    })
    export class FuelModule {}

    // fuel/fuel-theft.service.spec.ts - Nest'siz unit test
    // const sent: string[] = [];
    // const service = new FuelTheftService(
    //   { lastTwo: async () => [{ liters: 20, ignitionOn: false, at: new Date() }, { liters: 60, ignitionOn: false, at: new Date() }] },
    //   { fuelDrop: async (id) => { sent.push(id); } },
    // );
    // expect(await service.checkVehicle("v1")).toBe(true); expect(sent).toEqual(["v1"]);
  solutionNotes: |
    - Port'lar (`FuelReadings`, `FleetAlerts`) domen modulida va domen tilida: "oxirgi ikki o'lchov", "yoqilg'i tushishi haqida ogohlantir". Ularda Prisma yoki Telegram so'zi yo'q.
    - Interfeyslar runtime'da o'chirilgani uchun `Symbol` token'lar va `@Inject(TOKEN)` ishlatildi. Symbol nom to'qnashuvlaridan himoya qiladi.
    - Bog'liqlik yo'nalishi teskari: adapterlar port'larni import qiladi, domen servisi esa infratuzilmani bilmaydi.
    - `process.env` domen servisidan chiqarildi: config adapterni yaratishda `useFactory` orqali beriladi. Endi chat ID yo'qligi bootstrap'da aniqlanadi, alert vaqtida emas.
    - Unit test Nest konteynersiz: konstruktorga ikkita obyekt literali. DIP'ning eng aniq foydasi shu.
    - Magic number nomlandi. Biznes qoidasi (`drop > 15 && ignitionOff`) o'zgarmadi.
  checklist:
    - "Domen servisi Prisma, Telegram yoki process.env'ni import qilmaydi"
    - "Port interfeyslari domen modulida va domen tilida e'lon qilingan"
    - "Interfeyslar uchun runtime token (Symbol yoki abstrakt klass) ishlatilgan"
    - "Adapterlar port'ni import qiladi, aksincha emas"
    - "Domen servisini Nest konteynersiz unit test qilish mumkin"
    - "Konfiguratsiya bootstrap paytida tekshiriladi"
---

## Muammo

`OrderService` ichida `new PrismaClient()`, `new StripeClient(process.env.STRIPE_KEY)` va `import { sendEmail } from "../mailer"` bor. Biznes qoidasini - "VIP mijozning uchinchi buyurtmasi bepul yetkazib beriladi" - testlash uchun sizga ma'lumotlar bazasi, Stripe test kaliti va SMTP server kerak. Yoki `jest.mock("../mailer")` kabi modul darajasidagi mock'lar, ular import yo'liga bog'liq va refaktoringda jim buziladi.

Ikkinchi og'riq: to'lov provayderini almashtirish kerak bo'lganda biznes qoidalari fayliga tegasiz, chunki ular provayder SDK tiplari bilan aralashgan. Infratuzilma o'zgarishi domen o'zgarishiga aylandi.

Muammoning ildizi bog'liqliklar yo'nalishida: eng muhim va eng barqaror bo'lishi kerak bo'lgan kod (biznes qoidalari) eng o'zgaruvchan kodga (DB, tashqi API, framework) bog'liq.

## Asosiy g'oya

Robert Martin Dependency Inversion Principle'ni ikki qism bilan ifodalaydi: yuqori darajali modullar past darajali modullarga bog'liq bo'lmasligi kerak, ikkalasi ham abstraksiyalarga bog'liq bo'lishi kerak; abstraksiyalar tafsilotlarga bog'liq bo'lmasligi kerak, tafsilotlar abstraksiyalarga bog'liq bo'lishi kerak.

*Clean Architecture*da u buni soddaroq aytadi: eng moslashuvchan tizimlar - bu manba kod bog'liqliklari faqat abstraksiyalarga qaratilgan tizimlar. Lekin u darhol aniqlik kiritadi: buni mutlaq qoida sifatida qabul qilib bo'lmaydi. Masalan, standart kutubxonadagi `String` klassi konkret, lekin u juda barqaror, shuning uchun unga bog'lanish muammo emas. DIP **o'zgaruvchan** konkret narsalarga bog'lanishdan qochish haqida.

Uchta atamani aniq ajratish kerak, chunki ular doimo aralashtiriladi:

- **Dependency Inversion (DIP)** - tamoyil: bog'liqliklar qaysi yo'nalishda bo'lishi kerak.
- **Dependency Injection (DI)** - texnika: obyekt o'z bog'liqliklarini o'zi yaratmaydi, ularni tashqaridan (odatda konstruktor orqali) oladi.
- **IoC konteyner** - vosita: obyektlar grafini avtomatik yig'adi (NestJS, InversifyJS, tsyringe).

DIP'ni konteynersiz bajarish mumkin: `new OrderService(new PrismaOrderRepo(prisma))`. DI esa DIP'siz ham ishlatiladi: konkret `PrismaService`ni injekt qilish DI, lekin inversiya emas.

## Chuqurroq: inversiya nimani teskari qiladi

### Nazorat oqimi va manba bog'liqligi

*Clean Architecture*ning markaziy kuzatuvi: oddiy dizaynda manba kod bog'liqligi **nazorat oqimi** bilan bir yo'nalishda. `OrderService` `PrismaOrderRepo`ni chaqiradi va uni import qiladi. Martin ko'rsatadiki, polimorfizm (interfeys) yordamida bu ikki yo'nalishni ajratish mumkin. Nazorat oqimi o'zgarmaydi: servis hali ham repository'ni chaqiradi. Lekin manba bog'liqligi teskari: servis `OrderRepository` interfeysini import qiladi, `PrismaOrderRepo` ham shu interfeysni import qiladi va uni amalga oshiradi. Bog'liqlik o'qi infratuzilmadan domenga qarab burilgan.

Bu Martin uchun OOP'ning eng muhim imkoniyati: arxitektor istalgan manba bog'liqligini kerakli yo'nalishga bura oladi. Clean Architecture'dagi dependency rule (81-dars) aynan shu imkoniyatga tayanadi.

### Abstraksiya kimga tegishli

Inversiya faqat interfeys **to'g'ri joyda** bo'lsa ishlaydi. Agar `OrderRepository` interfeysi `infrastructure/prisma/` papkasida yashasa, domen moduli baribir infratuzilma paketini import qiladi. Hech narsa teskari bo'lmadi.

To'g'ri joy - **uni ishlatadigan yuqori darajali modul**. Interfeys mijoz ehtiyojini, mijoz tilida ifodalaydi (56-dars ISP bilan bog'liq). Hexagonal arxitekturada buni port deyishadi (82-dars): domen port'ni e'lon qiladi, adapter uni amalga oshiradi.

Amaliy natija: port nomi va metodlari infratuzilmani aks ettirmasligi kerak. `findManyWithInclude(args: Prisma.OrderFindManyArgs)` port emas, bu Prisma API'sining nusxasi. `ordersAwaitingPayment(customerId)` esa domen tilida.

### Barqaror abstraksiyalar

Martin DIP bobida bir nechta amaliy qoida beradi: o'zgaruvchan konkret klasslarga murojaat qilmang, ulardan meros olmang, konkret funksiyalarni override qilmang, o'zgaruvchan konkret narsaning nomini tilga olmang. Va eng muhimi: interfeyslar implementatsiyalardan kamroq o'zgaradi, shuning uchun yaxshi dizaynerlar interfeyslarni barqaror saqlashga harakat qiladi. Implementatsiyaga yangi imkoniyat qo'shish interfeysni o'zgartirishni talab qilmasligi kerak.

### Obyektlarni kim yaratadi

Agar domen kodi abstraksiyaga bog'liq bo'lsa, konkret obyektni kim yaratadi? `new PrismaOrderRepo()` qayerdadir yozilishi kerak. Martin buni abstrakt factory orqali va eng oxirida `Main` komponenti orqali hal qiladi: tizimning eng "iflos" qismi, barcha konkret narsalarni biladigan va ularni bir-biriga ulaydigan joy. DI bo'yicha adabiyotda bu joy ko'pincha composition root deb ataladi.

NestJS'da composition root - bu modullar (`@Module` dagi `providers`). Konteyner Martin'ning `Main`i vazifasini bajaradi.

## Misol: NestJS'da interfeys va token

NestJS konstruktor parametrlarini **tip** bo'yicha resolve qiladi. Providers sahifasida aytilganidek, bu TypeScript kompilyatsiyada emit qiladigan metadata orqali ishlaydi va tip runtime'da mavjud bo'lishi, ya'ni klass bo'lishi kerak. Interfeys va type alias'lar kompilyatsiyada o'chiriladi. Shuning uchun quyidagi kod ishlamaydi:

```ts
export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

@Injectable()
export class CheckoutService {
  // Runtime'da bu parametr tipi `Object` bo'lib qoladi - Nest uni resolve qila olmaydi
  constructor(private readonly orders: OrderRepository) {}
}
```

Uch to'g'ri yechim bor.

**1. Symbol token va `@Inject()`.** Custom providers hujjati string, Symbol yoki enum token'larni qo'llab-quvvatlaydi va ularni alohida faylda saqlashni tavsiya qiladi.

```ts
// orders/order.repository.ts (domen moduli)
export type Order = { id: string; customerId: string; totalUzs: bigint; status: "new" | "paid" };

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");

// orders/checkout.service.ts
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CheckoutService {
  constructor(@Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository) {}

  async markPaid(orderId: string): Promise<void> {
    const order = await this.orders.findById(orderId);
    if (!order) throw new OrderNotFoundError(orderId);
    await this.orders.save({ ...order, status: "paid" });
  }
}

export class OrderNotFoundError extends Error {
  constructor(readonly orderId: string) {
    super(`Order not found: ${orderId}`);
  }
}

// orders/orders.module.ts
@Module({
  imports: [PrismaModule],
  providers: [CheckoutService, { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository }],
  exports: [CheckoutService],
})
export class OrdersModule {}
```

**2. Abstrakt klass token sifatida.** Abstrakt klass runtime'da mavjud, shuning uchun u bir vaqtda shartnoma va token bo'la oladi va `@Inject()` kerak emas:

```ts
export abstract class PaymentGateway {
  abstract charge(orderId: string, amountUzs: bigint): Promise<{ txId: string }>;
}

@Injectable()
export class PaymeGateway extends PaymentGateway {
  async charge(orderId: string, amountUzs: bigint) {
    return { txId: `payme-${orderId}-${amountUzs}` };
  }
}

// providers: [{ provide: PaymentGateway, useClass: PaymeGateway }]
// constructor(private readonly payments: PaymentGateway) {}
```

Trade-off: qulay va kam shovqinli, lekin abstrakt klassda tasodifan implementatsiya kodi paydo bo'lishi oson va `extends` bitta meros slotini band qiladi. TypeScript strukturaviy bo'lgani uchun `implements PaymentGateway` (klassni interfeys sifatida) ham yozish mumkin.

**3. `useFactory` va `useExisting`.** Implementatsiya runtime ma'lumotiga bog'liq bo'lsa, factory: `{ provide: FILE_STORAGE, useFactory: (cfg: ConfigService) => cfg.get("STORAGE") === "s3" ? new S3Storage(...) : new LocalDiskStorage(...), inject: [ConfigService] }`. Bitta implementatsiyani bir nechta token ostida berish (ISP, 56-dars) uchun `useExisting`: singleton scope'da ikkala token bir xil nusxani oladi.

Testda esa DIP'ning foydasi darhol ko'rinadi: `new CheckoutService(inMemoryOrders)` - konteynersiz, mock kutubxonasiz.

## Qachon qo'llamaslik kerak

- **Har bir servis uchun interfeys va token.** `PriceCalculator` sof funksiyalardan iborat, DB yoki tarmoqqa chiqmaydi va bitta implementatsiyaga ega. Uni abstraksiya ortiga yashirish faqat "Go to definition" ni buzadi. Martin ham barqaror konkret narsalarga bog'lanishni muammo demaydi.
- **Testda almashtirish uchungina.** NestJS `Test.createTestingModule(...).overrideProvider(X).useValue(fake)` bilan konkret klassni ham almashtira oladi. Agar abstraksiyaning yagona sababi test bo'lsa, avval shuni ko'rib chiqing.
- **Kichik skript va CLI.** Konteyner va token'lar bir faylli migratsiya skriptida faqat shovqin. Konstruktor orqali oddiy DI yetarli.
- **Interfeys implementatsiyani ko'chirib olgan bo'lsa.** Prisma metodlarini birma-bir takrorlaydigan `IOrderRepository` inversiya bermaydi: domen baribir Prisma tushunchalarida fikrlaydi. Bunday holda abstraksiyaning narxi bor, foydasi yo'q.
- **Konteyner sehri.** Ko'p darajali dinamik modullar, `forRootAsync` zanjirlari va request-scoped provider'lar xatolarini tushunish qiyin. DI konteyneri vosita, uning murakkabligini domen kodingizdan ko'ra ko'proq o'stirmang.

## Stack'da: NestJS va Next.js

- **Token'lar fayli.** Token'ni port bilan bitta faylda yoki modulning `tokens.ts` faylida e'lon qiling. Hujjat tavsiya qilganidek, Symbol bitta nusxa bo'lishi uchun uni bitta joydan eksport qiling.
- **`import type` tuzog'i.** Providers hujjati ogohlantiradi: injekt qilinadigan klassni `import type` bilan import qilsangiz, u o'chiriladi va Nest bog'liqlikni resolve qila olmaydi. Interfeyslar uchun `import type` to'g'ri, klasslar uchun emas.
- **Singleton default.** Provider'lar odatda ilova umri davomida bitta nusxa. Shuning uchun ularda so'rovga xos holat (joriy foydalanuvchi) saqlamang: uni parametr sifatida bering yoki request scope'ni ongli tanlang.
- **`@Optional()`.** Ixtiyoriy bog'liqlik uchun ishlaydi, lekin klass `undefined` holatini o'zi hal qilishi kerak. Ko'pincha null object (no-op implementatsiya) aniqroq.
- **Next.js va React.** Konteyner yo'q, lekin DIP bor: server action yoki route handler domen funksiyasiga port'larni argument sifatida beradi (`placeOrder({ orders: prismaOrders, payments: payme }, input)`). React'da kontekst orqali `api` client berish ham inversiya: komponent `fetch` URL'larini bilmaydi.

## Xulosa

- DIP - tamoyil (bog'liqlik abstraksiyaga, abstraksiya tafsilotga bog'liq emas), DI - texnika (bog'liqlikni tashqaridan berish), konteyner - vosita.
- "Inversion": nazorat oqimi o'zgarmaydi, lekin manba kod bog'liqligi infratuzilmadan domenga qarab buriladi.
- Abstraksiya (port) uni ishlatadigan yuqori darajali modulga tegishli va domen tilida yoziladi. Aks holda inversiya bo'lmaydi.
- DIP o'zgaruvchan konkret narsalar uchun muhim. Barqaror, sof kodga to'g'ridan-to'g'ri bog'lanish normal.
- NestJS'da interfeyslar runtime'da o'chiriladi: Symbol/string token va `@Inject()`, yoki abstrakt klass token sifatida. `useClass`, `useFactory`, `useExisting` bilan implementatsiyani tanlang.
- Eng aniq foyda: domen kodi konteynersiz, oddiy obyektlar bilan testlanadi.
