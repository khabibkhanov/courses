---
n: 81
slug: clean-architecture
title: "Clean Architecture va dependency rule"
summary: "Clean Architecture'ning markazida bitta qoida turadi: source code bog'liqliklari faqat ichkariga, biznes qoidalari tomon yo'naladi. Bu darsda doiralarni, chegarani kesib o'tishni, chegaradan o'tadigan ma'lumot shaklini va qoidaning narxini ko'ramiz."
duration: 35
sources:
  - id: uncle-bob-clean-arch-post
    note: "2012 yilgi \"The Clean Architecture\" posti: to'rt doira, Dependency Rule, chegarani kesib o'tish va chegaradan o'tadigan ma'lumotlar"
  - id: clean-arch
    note: "Kitobdagi policy va level tushunchalari, \"detail\" sifatidagi baza, web va framework'lar haqidagi boblar, Humble Object va Main komponenti"
  - id: cc2
    note: "Ikkinchi nashrdagi dizayn va bog'liqliklarga oid qismlar (umumiy havola)"
quiz:
  - q: "Dependency Rule aynan nimani cheklaydi?"
    options:
      - "Ichki doiradagi kod tashqi doirada e'lon qilingan hech narsani nomlamasligi kerak: source code bog'liqliklari faqat ichkariga yo'naladi"
      - "Runtime'da chaqiruvlar faqat tashqaridan ichkariga borishi kerak"
      - "Har bir doira faqat o'zidan bitta pastdagi doirani chaqira oladi"
      - "Ma'lumotlar bazasi faqat use case qatlamidan chaqirilishi kerak"
    answer: 0
    explain: "Qoida source code bog'liqliklari haqida. Boshqaruv oqimi (control flow) tashqariga ham borishi mumkin: use case presenter'ni chaqiradi. Qatlam o'tkazib yuborish yoki baza qayerdan chaqirilishi qoidaning o'zi emas, undan kelib chiqadigan oqibatlar."
  - q: "Use case natijani presenter'ga uzatishi kerak, lekin presenter tashqi doirada. Dependency Rule'ni buzmaslik uchun nima qilinadi?"
    options:
      - "Use case presenter klassini to'g'ridan-to'g'ri import qiladi, chunki bu faqat bitta import"
      - "Presenter use case doirasiga ko'chiriladi"
      - "Use case o'z doirasida output port interfeysini e'lon qiladi, presenter esa uni implement qiladi"
      - "Natija global event bus orqali yuboriladi, shunda hech kim hech kimga bog'liq emas"
    answer: 2
    explain: "Bu Dependency Inversion: interfeys ichki doirada, implementatsiya tashqarida. Control flow tashqariga ketadi, source dependency esa ichkariga qaraydi. Global event bus bog'liqlikni yo'qotmaydi, faqat yashiradi."
  - q: "Repository metodi Prisma'ning generatsiya qilingan `Vehicle` tipini qaytaradi va use case uni to'g'ridan-to'g'ri ishlatadi. Bu nimaning buzilishi?"
    options:
      - "Hech narsaning, chunki tip faqat compile vaqtida mavjud"
      - "Chegaradan baza qatori shaklidagi ma'lumot o'tdi: ichki doira endi ORM sxemasiga source code darajasida bog'liq"
      - "Faqat nomlash qoidasining"
      - "Single Responsibility'ning, chunki repository ikki ish qiladi"
    answer: 1
    explain: "Type import ham source code bog'liqligi. Prisma sxemasi o'zgarsa, use case qayta kompilyatsiya qilinadi va ehtimol o'zgaradi. Postda aynan baza qatorlarini chegaradan o'tkazmaslik aytiladi."
  - q: "Quyidagilardan qaysi biri Clean Architecture'da \"detail\" hisoblanadi?"
    options:
      - "Yetkazib berish narxini hisoblash qoidasi"
      - "Haydovchiga reys biriktirishdagi biznes cheklovlar"
      - "Buyurtma bekor qilinganda pul qaytarish siyosati"
      - "Ma'lumotlarni PostgreSQL'da yoki Redis'da saqlash"
    answer: 3
    explain: "Martin baza, web va framework'larni detail deb ataydi: ular biznes qoidalarini yetkazish mexanizmi. Narx, biriktirish va qaytarish qoidalari esa policy, ular ichki doiraga tegishli."
  - q: "Kichik CRUD admin panelda har bir jadval uchun Entity, UseCase, InputPort, OutputPort, Presenter, Gateway va Mapper yaratilgan. Eng to'g'ri baho qaysi?"
    options:
      - "To'g'ri, Clean Architecture har doim to'liq qo'llanishi kerak"
      - "Biznes qoidasi deyarli yo'q joyda chegara narxi foydadan oshib ketgan; kamroq qatlam bilan ham dependency yo'nalishini saqlash mumkin"
      - "Faqat Presenter ortiqcha, qolgani zarur"
      - "Muammo yo'q, faqat fayllar soni ko'p"
    answer: 1
    explain: "Doiralar sxematik, ularning soni qat'iy emas. Himoya qilinadigan policy bo'lmasa, har bir chegara faqat xarajat. Muhim narsa - yo'nalish, qatlamlar soni emas (90-dars)."
  - q: "Nima uchun Martin `main` komponentini \"eng iflos\" joy deb biladi va bu yaxshi narsa?"
    options:
      - "Chunki u barcha konkret klasslarni yaratib, bir-biriga ulaydi; shu iflos ish bir joyga yig'ilsa, qolgan kod toza qoladi"
      - "Chunki unda testlar yozilmaydi"
      - "Chunki u faqat dev muhitida ishlaydi"
      - "Chunki unda biznes qoidalari jamlangan"
    answer: 0
    explain: "Main - eng tashqi plugin: konfiguratsiyani o'qiydi, adapterlarni yaratadi va ichki qismga uzatadi. NestJS'da bu vazifani asosan DI konteyner va modul konfiguratsiyasi bajaradi."
task:
  title: "Use case'ni ORM va HTTP'dan ajratish"
  prompt: |
    Quyidagi NestJS service transport parkida mashinani reysga biriktiradi. U ishlaydi, lekin biznes qoidasi (mashina faol bo'lishi, yoqilg'i 15% dan kam bo'lmasligi, haydovchining guvohnomasi amal qilishi) Prisma, `HttpException` va `Date.now()` bilan aralashib ketgan.

    1. Biznes qoidasini framework'siz use case'ga ajrating.
    2. Use case o'ziga kerakli port interfeyslarini o'zi e'lon qilsin.
    3. Use case chegaradan baza qatorini emas, oddiy ma'lumot strukturasini qaytarsin.
    4. HTTP xatoga aylantirish faqat tashqi qatlamda qolsin.
  lang: ts
  starter: |
    import { Injectable, HttpException } from "@nestjs/common";
    import { PrismaClient, Vehicle, Driver } from "@prisma/client";

    @Injectable()
    export class TripService {
      constructor(private readonly prisma: PrismaClient) {}

      async assign(vehicleId: string, driverId: string): Promise<Vehicle> {
        const v = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
        const d: Driver | null = await this.prisma.driver.findUnique({ where: { id: driverId } });
        if (!v || !d) throw new HttpException("not found", 404);
        if (v.status !== "ACTIVE") throw new HttpException("vehicle inactive", 409);
        if (v.fuelPercent < 15) throw new HttpException("low fuel", 409);
        if (d.licenseExpiresAt.getTime() < Date.now()) {
          throw new HttpException("license expired", 409);
        }
        return this.prisma.vehicle.update({
          where: { id: vehicleId },
          data: { currentDriverId: driverId, status: "ON_TRIP" },
        });
      }
    }
  solution: |
    // domain/assign-vehicle.ts - framework importlari yo'q
    export type VehicleSnapshot = {
      id: string;
      status: "active" | "on_trip" | "maintenance";
      fuelPercent: number;
    };
    export type DriverSnapshot = { id: string; licenseExpiresAt: Date };

    export interface FleetGateway {
      findVehicle(id: string): Promise<VehicleSnapshot | null>;
      findDriver(id: string): Promise<DriverSnapshot | null>;
      markOnTrip(vehicleId: string, driverId: string): Promise<void>;
    }
    export interface Clock {
      now(): Date;
    }

    export type AssignResult =
      | { kind: "assigned"; vehicleId: string; driverId: string }
      | { kind: "not_found" }
      | { kind: "rejected"; reason: "vehicle_inactive" | "low_fuel" | "license_expired" };

    const MIN_FUEL_PERCENT = 15;

    export class AssignVehicleToTrip {
      constructor(
        private readonly fleet: FleetGateway,
        private readonly clock: Clock,
      ) {}

      async execute(vehicleId: string, driverId: string): Promise<AssignResult> {
        const [vehicle, driver] = await Promise.all([
          this.fleet.findVehicle(vehicleId),
          this.fleet.findDriver(driverId),
        ]);
        if (!vehicle || !driver) return { kind: "not_found" };
        if (vehicle.status !== "active") return { kind: "rejected", reason: "vehicle_inactive" };
        if (vehicle.fuelPercent < MIN_FUEL_PERCENT) return { kind: "rejected", reason: "low_fuel" };
        if (driver.licenseExpiresAt <= this.clock.now()) {
          return { kind: "rejected", reason: "license_expired" };
        }
        await this.fleet.markOnTrip(vehicleId, driverId);
        return { kind: "assigned", vehicleId, driverId };
      }
    }

    // infrastructure/trips.controller.ts - tashqi doira
    import { Controller, Param, Post, NotFoundException, ConflictException } from "@nestjs/common";
    import { AssignVehicleToTrip } from "../domain/assign-vehicle";

    @Controller("trips")
    export class TripsController {
      constructor(private readonly assignVehicle: AssignVehicleToTrip) {}

      @Post(":vehicleId/assign/:driverId")
      async assign(@Param("vehicleId") vehicleId: string, @Param("driverId") driverId: string) {
        const result = await this.assignVehicle.execute(vehicleId, driverId);
        if (result.kind === "not_found") throw new NotFoundException();
        if (result.kind === "rejected") throw new ConflictException(result.reason);
        return result;
      }
    }
  solutionNotes: |
    - `AssignVehicleToTrip` hech qanday framework yoki ORM import qilmaydi. Uni oddiy in-memory `FleetGateway` bilan millisekundlarda test qilish mumkin.
    - Port interfeyslari (`FleetGateway`, `Clock`) use case faylida, ya'ni ichki doirada e'lon qilingan. Prisma adapteri ularni tashqarida implement qiladi: bu Dependency Inversion.
    - Chegaradan Prisma `Vehicle` qatori emas, `VehicleSnapshot` va `AssignResult` o'tadi. Baza sxemasidagi `ACTIVE` kabi enum'lar adapterda domen qiymatiga aylantiriladi.
    - Xato turlari biznes tilida (`low_fuel`), HTTP status kodi esa faqat controller'da tanlanadi. Xuddi shu use case'ni CLI yoki queue consumer ham chaqira oladi.
    - `Date.now()` o'rniga `Clock` port: vaqtga bog'liq qoida endi deterministik test qilinadi.
    - Ortiqcha qilmadik: alohida Presenter, InputPort va Mapper klasslari yo'q. Bu hajmdagi use case uchun discriminated union natija yetarli.
  checklist:
    - "Use case faylida @nestjs yoki @prisma importi yo'q"
    - "Port interfeyslari use case tomonida e'lon qilingan"
    - "Use case ORM tipini emas, o'z ma'lumot strukturasini qaytaradi"
    - "HTTP status kodlari faqat controller'da"
    - "Vaqt Clock orqali olinadi va testda boshqariladi"
---

## Muammo

Uch yil yashagan NestJS loyihasini tasavvur qiling. Biznes qoidasi "mashinani reysga biriktirishdan oldin yoqilg'i darajasini tekshir" bir joyda yozilmagan: bir qismi controller'da, bir qismi Prisma middleware'da, yana bir qismi `@BeforeUpdate` hook'ida. Endi jamoa TypeORM'dan Kysely'ga o'tmoqchi yoki xuddi shu qoidani Telegram bot orqali ham ishlatmoqchi. Ma'lum bo'ladiki, qoidani ko'chirish uchun deyarli butun service qatlamini qayta yozish kerak, chunki u ORM'ning entity klasslari, `HttpException` va request obyekti bilan chambarchas bog'langan.

Bu yerda muammo kodning "yomon" yozilganida emas. Har bir fayl alohida olinganda o'qiladigan bo'lishi mumkin. Muammo **bog'liqliklar yo'nalishida**: eng qimmatli va eng sekin o'zgaradigan narsa (biznes qoidalari) eng tez o'zgaradigan va eng almashtiriladigan narsalarga (framework, baza, transport) tayanib qolgan. Natijada texnologik qaror biznes qoidasini garovga oladi.

## Asosiy g'oya

Robert Martin 2012 yilda "The Clean Architecture" postida bir nechta mavjud arxitekturalarni bitta g'oyaga keltirdi: Cockburn'ning Hexagonal (Ports and Adapters), Jeffrey Palermo'ning Onion, o'zining Screaming Architecture'si, Coplien va Reenskaug'ning DCI, Jacobson'ning BCE yondashuvlari. Uning kuzatuvi: bu arxitekturalar detallarda farq qilsa ham, maqsadi bir xil - tizimni qatlamlarga ajratish orqali vazifalarni ajratish. Postga ko'ra shunday qurilgan tizim framework'lardan, UI'dan, ma'lumotlar bazasidan va har qanday tashqi agentdan mustaqil hamda UI, baza yoki web serversiz test qilinadigan bo'ladi.

Postdagi mashhur diagramma to'rtta konsentrik doiradan iborat (ichkaridan tashqariga):

1. **Entities** - korxona darajasidagi biznes qoidalari. Bitta ilovaga emas, butun biznesga tegishli bo'lishi mumkin bo'lgan qoidalar va ma'lumotlar.
2. **Use Cases** - ilovaga xos biznes qoidalari. Entity'lar bilan ma'lumot oqimini boshqaradi va ilova nima qilishini ifodalaydi.
3. **Interface Adapters** - controller, presenter, gateway. Ma'lumotni use case uchun qulay shakldan tashqi agent (web, baza) uchun qulay shaklga va aksincha aylantiradi.
4. **Frameworks and Drivers** - web framework, baza drayveri, UI. Bu yerda asosan "yopishtiruvchi" kod bo'ladi.

Bularni bog'lab turadigan yagona qoida - **Dependency Rule**: source code bog'liqliklari faqat ichkariga yo'naladi. Postning so'zlari bilan: "Nothing in an inner circle can know anything at all about something in an outer circle." Ya'ni ichki doiradagi kod tashqi doirada e'lon qilingan funksiya, klass, o'zgaruvchi yoki tipning nomini ham tilga olmaydi. Tashqi doiradagi ma'lumot formatlari ham ichkariga kirmaydi.

Muhim nuqta: post doiralar sxematik ekanini ochiq aytadi. To'rtta doira qonun emas, ko'proq ham bo'lishi mumkin. O'zgarmaydigan narsa - yo'nalish. Ichkariga borgan sari abstraksiya darajasi oshadi: tashqi doira past darajali konkret detallar, ichki doira yuqori darajali policy.

## Chuqurroq: qoidaning mexanikasi

### Policy va detail

Kitobda Martin bu g'oyani "policy" va "level" tushunchalari bilan chuqurlashtiradi. Dasturning har bir qismi qandaydir policy'ni ifodalaydi, va policy'ning darajasi uning kirish-chiqishdan qanchalik uzoqligi bilan o'lchanadi. "Yoqilg'i 15% dan kam bo'lsa reysga chiqarma" - yuqori darajali policy. "Natijani JSON qilib 409 status bilan qaytar" - past darajali detail. Kitobdagi boblar ma'lumotlar bazasi, web va framework'larni alohida-alohida detail deb ataydi: ular biznes qoidalarini yetkazish mexanizmi, qoidaning o'zi emas.

Shundan muhim amaliy xulosa chiqadi: yaxshi arxitektura detallar haqidagi qarorlarni **kechiktirishga** imkon beradi. Use case'lar yozilganda baza PostgreSQL bo'ladimi yoki hali in-memory massivmi - farqi bo'lmasligi kerak.

### Chegarani kesib o'tish

Darhol savol tug'iladi: agar use case presenter'ga natija yuborishi kerak bo'lsa, lekin presenter tashqi doirada bo'lsa, qanday qilib use case uni bilmasdan chaqiradi? Post buni **Dependency Inversion** (57-dars) bilan hal qiladi. Use case o'z doirasida interfeys (output port) e'lon qiladi, tashqi doiradagi presenter uni implement qiladi. Runtime'da **control flow** tashqariga boradi (use case -> presenter), lekin **source code dependency** ichkariga qaraydi (presenter -> use case'dagi interfeys). Bu ikki yo'nalishni farqlash Clean Architecture'ni tushunishning kaliti.

Xuddi shu usul baza bilan ishlashga ham qo'llanadi: use case `FleetGateway` interfeysini o'zi uchun e'lon qiladi, Prisma adapteri esa uni implement qiladi. Interfeysga **egalik** muhim: u foydalanuvchi (use case) tomonida turadi, implementatsiya tomonida emas.

### Chegaradan qanday ma'lumot o'tadi

Postdagi kam e'tibor beriladigan, lekin juda amaliy qism: chegaradan faqat oddiy, izolyatsiyalangan ma'lumot strukturalari o'tadi - struct, DTO, funksiya argumentlari yoki hashmap. Entity'larni yoki baza qatorlarini chegaradan o'tkazish tavsiya etilmaydi. Sabab: ORM qatori o'zi bilan baza sxemasining shaklini olib keladi. Agar use case Prisma generatsiya qilgan `Vehicle` tipini ishlatsa, `status` ustunining nomi o'zgarishi use case'ni qayta yozishga majbur qiladi. TypeScript'da `import type` ham source code bog'liqligi, garchi runtime'da yo'qolsa ham.

### Main komponenti

Kimdir barcha konkret klasslarni yaratib, ularni bir-biriga ulashi kerak. Kitobda bu "Main" komponenti: tizimdagi eng past darajali, eng "iflos" joy. U konfiguratsiyani o'qiydi, adapterlarni yaratadi va ularni ichki qismga uzatadi. Main'ni ilovaning plugin'i deb tasavvur qilish mumkin. NestJS'da bu rolni modul konfiguratsiyasi va DI konteyner bajaradi: `useClass`, `useFactory` va custom token'lar orqali.

### Humble Object

Test qilish qiyin bo'lgan narsalar (UI, baza drayveri) chegarada qoladi. Kitobdagi Humble Object pattern ularni ikkiga bo'ladi: test qilish qiyin, lekin deyarli mantiqsiz "kamtar" qism va mantiq to'plangan, oson test qilinadigan qism. Presenter ma'lumotni formatlaydi (test qilinadi), view esa uni shunchaki chiqaradi. Bu g'oya Gary Bernhardt'ning functional core, imperative shell yondashuviga yaqin (67-dars).

## Misol: ORM'ga yopishgan use case va uni ajratish

Yomon variant. Biznes qoidasi Prisma tiplari va HTTP bilan aralashgan:

```ts
import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Order } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async cancel(orderId: string): Promise<Order> {
    const order = await this.prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    if (order.status === "SHIPPED") {
      throw new ConflictException("Jo'natilgan buyurtmani bekor qilib bo'lmaydi");
    }
    const refund = order.paidAmount > 0 ? order.paidAmount - order.cancellationFee : 0;
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED", refundAmount: refund },
    });
  }
}
```

Bu kodda uchta tashqi narsa ichkariga kirgan: Prisma tipi `Order` (chiqish qiymati sifatida chegaradan o'tadi), `ConflictException` (HTTP tushunchasi) va baza enum qiymatlari. Qaytarish formulasi esa hech qayerda alohida test qilinmaydi.

Yaxshiroq variant. Use case o'z tilida gaplashadi va o'z portlarini e'lon qiladi:

```ts run
// orders/domain/cancel-order.ts
export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export type OrderForCancellation = {
  id: string;
  status: OrderStatus;
  paidAmount: number;
  cancellationFee: number;
};

export interface OrderStore {
  load(id: string): Promise<OrderForCancellation | null>;
  saveCancellation(id: string, refundAmount: number): Promise<void>;
}

export type CancelResult =
  | { ok: true; refundAmount: number }
  | { ok: false; reason: "not_found" | "already_shipped" };

export function calculateRefund(order: OrderForCancellation): number {
  if (order.paidAmount === 0) return 0;
  return Math.max(0, order.paidAmount - order.cancellationFee);
}

export class CancelOrder {
  constructor(private readonly orders: OrderStore) {}

  async execute(orderId: string): Promise<CancelResult> {
    const order = await this.orders.load(orderId);
    if (!order) return { ok: false, reason: "not_found" };
    if (order.status === "shipped") return { ok: false, reason: "already_shipped" };
    const refundAmount = calculateRefund(order);
    await this.orders.saveCancellation(order.id, refundAmount);
    return { ok: true, refundAmount };
  }
}

// Sinab ko'ring: DB o'rniga Map - use case'ni infratuzilmasiz tekshiramiz.
const rows = new Map<string, OrderForCancellation>([
  ["o-1", { id: "o-1", status: "paid", paidAmount: 250_000, cancellationFee: 20_000 }],
  ["o-2", { id: "o-2", status: "shipped", paidAmount: 90_000, cancellationFee: 0 }],
]);
const store: OrderStore = {
  load: async (id) => rows.get(id) ?? null,
  saveCancellation: async (id, refund) => console.log(`saqlandi: ${id}, qaytariladi ${refund}`),
};
for (const id of ["o-1", "o-2", "o-3"]) console.log(id, await new CancelOrder(store).execute(id));
```

Adapter tashqi doirada yashaydi va ikki dunyoni tarjima qiladi:

```ts
// orders/infrastructure/prisma-order-store.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import type { OrderStore, OrderForCancellation, OrderStatus } from "../domain/cancel-order";

const STATUS_FROM_DB: Record<string, OrderStatus> = {
  PENDING: "pending",
  PAID: "paid",
  SHIPPED: "shipped",
  CANCELLED: "cancelled",
};

@Injectable()
export class PrismaOrderStore implements OrderStore {
  constructor(private readonly prisma: PrismaService) {}

  async load(id: string): Promise<OrderForCancellation | null> {
    const row = await this.prisma.order.findUnique({ where: { id } });
    if (!row) return null;
    return {
      id: row.id,
      status: STATUS_FROM_DB[row.status] ?? "pending",
      paidAmount: row.paidAmount,
      cancellationFee: row.cancellationFee,
    };
  }

  async saveCancellation(id: string, refundAmount: number): Promise<void> {
    await this.prisma.order.update({
      where: { id },
      data: { status: "CANCELLED", refundAmount },
    });
  }
}
```

Nima o'zgardi va nima uchun:

- **Bog'liqlik yo'nalishi teskari bo'ldi.** `cancel-order.ts` hech narsani import qilmaydi. Adapter esa domen faylini import qiladi. Strelka ichkariga qaraydi.
- **Chegaradan oddiy struktura o'tadi.** `OrderForCancellation` faqat use case'ga kerak bo'lgan maydonlardan iborat. Bazaga yangi ustun qo'shilsa, use case bilmaydi.
- **Xato biznes tilida.** `already_shipped` - domen faktidir. Uni 409'ga aylantirish controller'ning ishi.
- **Formula ajratildi.** `calculateRefund` sof funksiya, uni bitta qatorli test bilan tekshirish mumkin.

## Qachon qo'llamaslik kerak

Dependency Rule bepul emas. Har bir chegara qo'shimcha tip, mapping kodi va bilvosita chaqiruv degani. Quyidagi holatlarda uni to'liq qo'llash zarar qiladi:

- **Biznes qoidasi deyarli yo'q joyda.** Admin panelning CRUD qismi yoki ichki hisobot endpoint'i ko'pincha "bazadan o'qi, JSON qil" dan iborat. U yerda use case, port va mapper qo'shish himoya qilinadigan hech narsasiz murakkablik qo'shadi.
- **Prototip va domen hali noaniq bo'lganda.** Chegara qayerda o'tishini bilmasdan port interfeyslarini o'ylab topish noto'g'ri abstraksiyaga olib keladi (8-dars).
- **Har bir doirani alohida qatlam deb tushunganda.** Postning o'zi doiralar sxematik deydi. Har bir use case uchun InputPort, OutputPort, Presenter, ViewModel yaratish - bu qoida emas, uning byurokratik talqini. Ko'p hollarda discriminated union natija va bitta port yetarli.
- **Framework'dan butunlay "mustaqil" bo'lishga intilish.** NestJS dekoratorlarini domendan chiqarish foydali, lekin `@Injectable()` dekoratorini use case'dan olib tashlash uchun alohida factory provider yozish ba'zan foyda bermaydigan marosim. Bu borada fikrlar turlicha: ba'zilar domenni toza saqlashni prinsipial deb hisoblaydi, ba'zilar dekoratorni zararsiz metadata deb biladi.
- **Baza haqiqatan ham detail bo'lmaganda.** Analitik tizimda murakkab SQL so'rovlari, window funksiyalar va PostgreSQL'ga xos imkoniyatlar biznes mantiqning o'zi bo'lishi mumkin. Uni "repository ortiga yashirish" ko'pincha sayoz va oqadigan abstraksiya beradi.

Ortiqcha arxitekturaning narxi 90-darsda batafsil.

## Stack'da: NestJS va TypeScript

- **Papka chegaralari.** `orders/domain` (yoki `core`) papkasidagi fayllar `@nestjs/*`, `@prisma/client`, `express` import qilmasligi kerak. Buni code review'ga qoldirmang: dependency-cruiser yoki ESLint `no-restricted-imports` qoidasi bilan avtomatlashtiring (85, 97-darslar).
- **Port'ni token bilan ulash.** TypeScript interfeyslari runtime'da yo'qoladi, shuning uchun NestJS'da port uchun token kerak: `{ provide: ORDER_STORE, useClass: PrismaOrderStore }` va konstruktorda `@Inject(ORDER_STORE)`. Yoki port'ni `abstract class` qilib, uni token sifatida ishlatish mumkin.
- **Use case'ni provider qilib ro'yxatdan o'tkazish.** Domen klassi dekoratorsiz bo'lsa, `useFactory: (store: OrderStore) => new CancelOrder(store)` va `inject: [ORDER_STORE]` bilan ulanadi. Bu "Main" ishini modul konfiguratsiyasiga yig'adi.
- **Xato tarjimasi bitta joyda.** Use case natijasini HTTP'ga aylantirish controller'da yoki exception filter'da (48-dars), domen ichida emas.

## Xulosa

- Clean Architecture'ning yagona qat'iy qoidasi: source code bog'liqliklari faqat ichkariga, yuqori darajali policy tomon yo'naladi.
- Control flow tashqariga ham ketishi mumkin. Buni Dependency Inversion hal qiladi: interfeys ichkarida, implementatsiya tashqarida.
- Chegaradan oddiy ma'lumot strukturalari o'tadi, ORM qatorlari va framework obyektlari emas.
- Baza, web va framework - detail. Ularni almashtirish biznes qoidalarini o'zgartirmasligi kerak.
- Doiralar soni sxematik. Qatlamlarni ko'paytirish emas, yo'nalishni saqlash muhim, va himoya qilinadigan policy bo'lmasa, chegara faqat xarajat.
