---
n: 83
slug: modular-monolit
title: "Modulli monolit va NestJS modullari"
summary: "Mikroservislarning narxi yuqori, oddiy monolit esa vaqt o'tib chigallashadi. Modulli monolit bitta deploy qilinadigan ilova ichida aniq modul chegaralarini saqlaydi. Bu darsda NestJS modul inkapsulyatsiyasidan chegara vositasi sifatida qanday foydalanishni ko'ramiz."
duration: 35
sources:
  - id: fowler-microservice-premium
    note: "\"MicroservicePremium\" (2015): mikroservis xarajati, monolitdan boshlash va monolit ichidagi modullik haqidagi maslahat"
  - id: nestjs-docs
    note: "Modules bo'limi: providers, controllers, imports, exports, inkapsulyatsiya, shared, global va dynamic modullar"
  - id: clean-arch
    note: "Kitobdagi deployment va decoupling rejimlari hamda \"services\" haqidagi qism: servislar arxitekturani o'z-o'zidan bermaydi degan g'oya"
quiz:
  - q: "Fowler'ning \"Microservice Premium\" maqolasidagi asosiy maslahat qaysi?"
    options:
      - "Har bir yangi loyihani mikroservislar bilan boshlash kerak"
      - "Monolitlar har doim yomon, ularni imkon qadar tez bo'lish kerak"
      - "Mikroservislar faqat Kubernetes bilan ishlaydi"
      - "Tizim monolit sifatida boshqarib bo'lmaydigan darajada murakkab bo'lmasa, mikroservislarni o'ylamang; ko'p tizimlar bitta monolit sifatida qurilishi kerak"
    answer: 3
    explain: "Fowler mikroservislar o'z murakkabligini (deploy avtomatlashtirish, monitoring, nosozliklar, eventual consistency) olib kelishini va bu loyiha narxi hamda xatariga qo'shimcha 'premium' qo'shishini aytadi."
  - q: "NestJS'da `FuelModule` o'z `FuelPricingService`ini `exports`ga qo'shmagan. `BillingModule` `FuelModule`ni import qilib, shu servisni inject qilmoqchi. Nima bo'ladi?"
    options:
      - "Ishlaydi, chunki import qilingan modulning barcha provider'lari ko'rinadi"
      - "Nest dependency'ni resolve qila olmaydi va xato beradi, chunki eksport qilinmagan provider modul ichida inkapsulyatsiyalangan"
      - "Servisning yangi nusxasi yaratiladi"
      - "Faqat `@Global()` bo'lsa xato beradi"
    answer: 1
    explain: "Hujjatga ko'ra provider'lar default bo'yicha inkapsulyatsiyalangan: modul faqat o'z provider'larini yoki import qilingan modul ochiq eksport qilganlarini inject qila oladi. Eksportlar modulning public API'si."
  - q: "Jamoa \"import qilish zerikarli\" deb barcha domen modullarini `@Global()` qildi. Bunning eng katta zarari nima?"
    options:
      - "Ilova sekinlashadi"
      - "Testlar ishlamay qoladi"
      - "Modullar orasidagi bog'liqliklar `imports` ro'yxatida ko'rinmay qoladi, har qanday modul har qanday servisni olishi mumkin va chegaralar amalda yo'qoladi"
      - "NestJS global modullarni qo'llab-quvvatlamaydi"
    answer: 2
    explain: "NestJS hujjati hammasini global qilish yaxshi dizayn qarori emasligini aytadi. `imports` ro'yxati - modul grafigining hujjati. Global modullar uni yashiradi."
  - q: "`OrdersModule` buyurtma yaratganda `InventoryModule`dagi `stock_items` jadvaliga to'g'ridan-to'g'ri SQL yozadi. Modulli monolit nuqtai nazaridan bu nima?"
    options:
      - "Chegaraning buzilishi: boshqa modulning ma'lumotiga uning public API'si orqali emas, yashirin yo'l bilan murojaat qilinmoqda"
      - "Normal, chunki ikkalasi bitta bazada"
      - "Faqat performance muammosi"
      - "Bu yaxshi, chunki tranzaksiya bitta"
    answer: 0
    explain: "Kod importi bo'lmasa ham, umumiy jadval orqali coupling bor. Inventory o'z jadvalini o'zgartirsa, Orders jimgina buziladi. Ma'lumotga egalik ham chegaraning bir qismi."
  - q: "Martin \"Clean Architecture\"da servislar haqida qaysi fikrni bildiradi?"
    options:
      - "Servislar har doim yaxshi arxitekturani kafolatlaydi"
      - "Servislarga bo'lish o'z-o'zidan arxitektura chegarasini bermaydi: servislar ham ichkarida ma'lumot yoki xatti-harakat orqali qattiq bog'langan bo'lishi mumkin"
      - "Servislar faqat katta kompaniyalar uchun"
      - "Monolitda arxitektura bo'lishi mumkin emas"
    answer: 1
    explain: "Martin uchun arxitektura chegarasi - bog'liqlik yo'nalishi va ajratilganlik, deploy birligi emas. Bitta process ichida ham, tarmoq ortida ham chegaralar to'g'ri yoki noto'g'ri qurilishi mumkin."
  - q: "Qaysi holatda modulni alohida servisga ajratish uchun eng kuchli asos bor?"
    options:
      - "Modul kodida 3000 qator bor"
      - "Jamoa yangi texnologiyani sinab ko'rmoqchi"
      - "Modul chegarasi bir necha oy davomida barqaror, uning yuklamasi va deploy ritmi qolgan qismdan keskin farq qiladi va uni alohida jamoa boshqaradi"
      - "Arxitektura diagrammasi chiroyliroq ko'rinadi"
    answer: 2
    explain: "Ajratish uchun asos: barqaror chegara va real operatsion sabab (mustaqil masshtab, deploy, jamoa). Qator soni yoki texnologik qiziqish 'premium'ni oqlamaydi."
task:
  title: "NestJS modul chegarasini tiklash"
  prompt: |
    Quyidagi kodda `BillingModule` oylik hisobni tuzish uchun `FleetModule`ning repository'sini va Prisma orqali uning jadvallarini bevosita ishlatadi. `FleetModule` esa `@Global()` va hamma narsani eksport qiladi.

    1. `FleetModule`ning public API'sini bitta kichik facade servisga qisqartiring.
    2. `@Global()`ni olib tashlang va `BillingModule` bog'liqligini `imports`da ochiq ko'rsating.
    3. Billing faqat facade orqali, o'zi uchun kerakli shakldagi ma'lumotni olsin.
    4. Chegarani avtomatik tekshirish uchun bitta qoida taklif qiling.
  lang: ts
  starter: |
    import { Global, Injectable, Module } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";

    @Injectable()
    export class VehicleRepository {
      constructor(readonly prisma: PrismaService) {}
      findByCompany(companyId: string) {
        return this.prisma.vehicle.findMany({ where: { companyId } });
      }
    }

    @Global()
    @Module({
      providers: [VehicleRepository, PrismaService],
      exports: [VehicleRepository, PrismaService],
    })
    export class FleetModule {}

    @Injectable()
    export class InvoiceService {
      constructor(private readonly vehicles: VehicleRepository) {}

      async monthlyTotal(companyId: string, tariffPerVehicleUzs: number): Promise<number> {
        const all = await this.vehicles.findByCompany(companyId);
        const billable = await this.vehicles.prisma.vehicle.count({
          where: { companyId, status: "ACTIVE", trackerInstalled: true },
        });
        return all.length > 0 ? billable * tariffPerVehicleUzs : 0;
      }
    }

    @Module({ providers: [InvoiceService] })
    export class BillingModule {}
  solution: |
    // fleet/fleet.facade.ts - FleetModule'ning yagona public API'si
    import { Injectable, Module } from "@nestjs/common";
    import { PrismaModule } from "../prisma/prisma.module";
    import { PrismaService } from "../prisma/prisma.service";

    export type BillableFleetSummary = { companyId: string; billableVehicles: number };

    @Injectable()
    class VehicleRepository {
      constructor(private readonly prisma: PrismaService) {}
      countBillable(companyId: string): Promise<number> {
        return this.prisma.vehicle.count({
          where: { companyId, status: "ACTIVE", trackerInstalled: true },
        });
      }
    }

    @Injectable()
    export class FleetFacade {
      constructor(private readonly vehicles: VehicleRepository) {}

      async billableSummary(companyId: string): Promise<BillableFleetSummary> {
        return { companyId, billableVehicles: await this.vehicles.countBillable(companyId) };
      }
    }

    @Module({
      imports: [PrismaModule],
      providers: [VehicleRepository, FleetFacade],
      exports: [FleetFacade],
    })
    export class FleetModule {}

    // billing/billing.module.ts
    import { Injectable, Module } from "@nestjs/common";
    import { FleetFacade, FleetModule } from "../fleet/fleet.facade";

    @Injectable()
    export class InvoiceService {
      constructor(private readonly fleet: FleetFacade) {}

      async monthlyTotal(companyId: string, tariffPerVehicleUzs: number): Promise<number> {
        const { billableVehicles } = await this.fleet.billableSummary(companyId);
        return billableVehicles * tariffPerVehicleUzs;
      }
    }

    @Module({
      imports: [FleetModule],
      providers: [InvoiceService],
    })
    export class BillingModule {}

    // .dependency-cruiser.js qoidasi (taklif):
    // {
    //   name: "only-public-api-across-modules",
    //   severity: "error",
    //   from: { path: "^src/([^/]+)/" },
    //   to: { path: "^src/[^/]+/", pathNot: ["^src/$1/", "^src/[^/]+/index\\.ts$", "^src/prisma/"] }
    // }
  solutionNotes: |
    - `FleetModule`dan faqat `FleetFacade` eksport qilinadi. `VehicleRepository` modul ichida qoladi: NestJS inkapsulyatsiyasi endi chegarani runtime'da ham himoya qiladi.
    - `@Global()` olib tashlandi. `BillingModule`ning `imports: [FleetModule]` qatori bog'liqlikni hujjatlaydi va modul grafigida ko'rinadi.
    - Billing endi Fleet'ning jadval tuzilishini (`status`, `trackerInstalled`) bilmaydi. "Hisob-kitobga kiruvchi mashina" ta'rifi Fleet ichida, uning egasida.
    - Facade Billing uchun moslashtirilgan kichik shakl qaytaradi (`BillableFleetSummary`), Prisma qatorlarini emas.
    - Ortiqcha `all.length > 0` tekshiruvi olib tashlandi: billable 0 bo'lsa natija baribir 0.
    - dependency-cruiser'ning group matching (`$1`) imkoniyati bilan "boshqa modulning faqat index.ts'iga murojaat qil" qoidasini CI'da tekshirish mumkin. Real loyihada facade'ni `fleet/index.ts` orqali qayta eksport qiling.
  checklist:
    - "FleetModule faqat bitta facade eksport qiladi"
    - "Hech bir modul @Global() emas (Prisma/Config kabi infra bundan mustasno bo'lishi mumkin)"
    - "BillingModule bog'liqligi imports'da ko'rinadi"
    - "Billing Fleet jadvallariga yoki repository'siga bevosita murojaat qilmaydi"
    - "Chegarani CI'da tekshiradigan qoida taklif qilingan"
---

## Muammo

Ikki xil og'riqli hikoya ko'p takrorlanadi.

Birinchisi: jamoa yangi fleet platformasini "zamonaviy" qilib, boshidan 9 ta mikroservis bilan boshlaydi: auth, vehicles, telemetry, billing, notifications va hokazo. Olti oydan keyin ma'lum bo'ladiki, deyarli har bir yangi funksiya uch-to'rt servisni bir vaqtda o'zgartirishni talab qiladi, lokal muhitni ko'tarish uchun 12 ta konteyner kerak, xatoni topish uchun esa uchta servis logini solishtirish lozim. Chegaralar domen tushunilmasdan oldin chizilgan va noto'g'ri joyda.

Ikkinchisi: boshqa jamoa oddiy NestJS monolit yozadi. Uch yildan keyin har qanday servis har qanday servisni inject qiladi, `SharedModule` 80 ta provider eksport qiladi va global, billing kodi telemetriya jadvallarini to'g'ridan-to'g'ri o'qiydi. Kichik o'zgarish kutilmagan joyni buzadi. Jamoa endi "mikroservislarga o'tamiz" deydi, lekin modullar orasidagi chegaralar yo'qligi sababli qayerdan kesishni ham bilmaydi.

Ikkala holatda muammo deploy birligida emas, **chegaralar sifatida**.

## Asosiy g'oya

Martin Fowler 2015 yilgi "Microservice Premium" maqolasida mikroservislar o'zining murakkabligini olib kelishini aytadi: avtomatlashtirilgan deploy, monitoring, nosozliklarni boshqarish, eventual consistency. U buni loyiha narxi va xatariga qo'shiladigan "premium" deb ataydi. Uning maslahati: tizim monolit sifatida boshqarib bo'lmaydigan darajada murakkab bo'lmaguncha mikroservislarni o'ylamang, ko'pchilik tizimlar bitta monolit ilova sifatida qurilishi kerak. Shu bilan birga u monolit ichida yaxshi modullikka e'tibor berishni maslahat beradi va amalda modul chegaralari ko'pincha buzilib, monolit chigallashishini ham tan oladi.

**Modulli monolit** - aynan shu oraliq: bitta deploy qilinadigan ilova, lekin uning ichida aniq, majburiy chegarali modullar. Har bir modul:

- o'z domen sohasiga egalik qiladi (Fleet, Telemetry, Billing, Notifications);
- tashqariga kichik public API ochadi va qolgan hamma narsani yashiradi;
- o'z ma'lumotiga egalik qiladi: boshqa modullar uning jadvallariga bevosita murojaat qilmaydi;
- boshqa modullarga bog'liqligini ochiq e'lon qiladi.

Martin "Clean Architecture"da shunga yaqin fikrni boshqa tomondan aytadi: servislarga bo'lish o'z-o'zidan arxitektura chegarasi bermaydi. Servislar ham umumiy ma'lumot yoki xatti-harakat orqali qattiq bog'langan bo'lishi mumkin. Chegara - bu bog'liqlik yo'nalishi va ajratilganlik, deploy birligi esa keyingi qaror. Kitobda u ajratish rejimlarini (source darajasi, deployment darajasi, servis darajasi) muhokama qiladi va qaysi rejimni qachon tanlashni imkon qadar kechiktirishni tavsiya qiladi.

## Chuqurroq: NestJS modullari chegara vositasi sifatida

NestJS modul tizimi aynan shu maqsad uchun tayyor mexanizm beradi, agar uni to'g'ri ishlatsangiz.

### Inkapsulyatsiya default bo'yicha

`@Module()` to'rtta asosiy xususiyatga ega: `providers` (shu modulda Nest injector yaratadigan provider'lar), `controllers`, `imports` (kerakli provider'larni eksport qiladigan modullar) va `exports` (boshqa modullarga ochiladigan provider'lar to'plami). NestJS hujjatiga ko'ra provider'lar default bo'yicha inkapsulyatsiyalangan: modul faqat o'z provider'larini yoki import qilingan modul ochiq eksport qilganlarini inject qila oladi. Hujjat eksport qilingan provider'larni modulning public API'si deb ataydi.

Bu juda muhim: Nest sizga **runtime'da tekshiriladigan** chegara beradi. Eksport qilinmagan repository'ni boshqa modul inject qilmoqchi bo'lsa, ilova start bo'lmaydi.

### Faqat bitta "eshik"

Amaliy qoida: har bir domen modulidan iloji boricha kam narsa eksport qiling, ko'pincha bitta facade servis yoki bir nechta use case. Repository'lar, mapper'lar, ichki yordamchi servislar eksport qilinmaydi. Shunda modulning ichki tuzilishini o'zgartirish boshqa modullarga ta'sir qilmaydi. Bu Ousterhout'ning chuqur modul g'oyasi (52-dars) modul darajasida.

### Global modullar

`@Global()` dekoratori modul eksportlarini import qilmasdan hamma joyda mavjud qiladi. Hujjat hammasini global qilish tavsiya etilgan dizayn amaliyoti emasligini aniq aytadi. Global modullar `imports` ro'yxatini - modul grafigining yagona ochiq hujjatini - yo'q qiladi. Istisno sifatida faqat haqiqatan ham infratuzilma bo'lgan narsalar (config, logger, ba'zan Prisma) global bo'lishi mumkin, domen modullari esa hech qachon.

### Shared va dynamic modullar

Nest'da modullar default bo'yicha singleton. Bir provider'ni ikki modulda alohida `providers`ga yozish ikkita nusxa yaratadi va hujjat ta'kidlaganidek, nomuvofiq state'ga olib kelishi mumkin. To'g'ri yo'l - bitta modulda e'lon qilib, eksport qilish. Dynamic modullar (`forRoot()`, `forRootAsync()`) konfiguratsiyalanadigan infratuzilma uchun: `forRoot()` qaytargan provider'larni faqat uni import qilgan modul inject qila oladi, agar qayta eksport qilinmagan bo'lsa.

### Ma'lumotga egalik

Kod importlari toza bo'lsa ham, chegara jadval orqali buzilishi mumkin. Agar `OrdersModule` `inventory_items` jadvaliga to'g'ridan-to'g'ri yozsa, bu ham coupling, faqat ko'rinmas. Modulli monolitda bitta baza bo'lishi normal, lekin har bir jadvalning bitta egasi bo'lishi kerak. Ba'zi jamoalar PostgreSQL schema'lari (`fleet.vehicles`, `billing.invoices`) bilan bu egalikni ko'rinadigan qiladi.

### Modullar orasidagi muloqot

Ikki asosiy usul bor:

- **Sinxron chaqiruv** eksport qilingan facade orqali. Oddiy va tushunarli, lekin chaqiruvchi chaqiriluvchiga bog'liq bo'ladi.
- **In-process hodisalar** (masalan, `@nestjs/event-emitter`). `OrderPlaced` hodisasini Billing va Notifications tinglaydi, Orders ularni bilmaydi. Bu bog'liqlik yo'nalishini teskari qiladi, lekin oqimni kuzatishni qiyinlashtiradi. Hodisani faqat haqiqatan ham "yuboruvchiga farqi yo'q" bo'lgan holatlarda ishlating.

## Misol: hamma narsani ko'radigan SharedModule

Yomon variant:

```ts
import { Global, Module } from "@nestjs/common";
import { VehicleRepository } from "../fleet/vehicle.repository";
import { TelemetryRepository } from "../telemetry/telemetry.repository";
import { InvoiceRepository } from "../billing/invoice.repository";
import { PrismaService } from "../prisma/prisma.service";

@Global()
@Module({
  providers: [PrismaService, VehicleRepository, TelemetryRepository, InvoiceRepository],
  exports: [PrismaService, VehicleRepository, TelemetryRepository, InvoiceRepository],
})
export class SharedModule {}
```

Bu bitta fayl barcha domen chegaralarini bekor qiladi: har qanday servis har qanday repository'ni oladi, va hech bir modulning `imports` ro'yxati uning haqiqiy bog'liqliklarini aytmaydi.

Yaxshi variant. Har bir domen o'z moduliga ega va faqat facade'ni ochadi:

```ts
// telemetry/telemetry.module.ts
import { Injectable, Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { TelemetryRepository } from "./telemetry.repository";

export type DailyMileage = { vehicleId: string; date: string; km: number };

@Injectable()
export class TelemetryFacade {
  constructor(private readonly repo: TelemetryRepository) {}

  mileageForPeriod(vehicleIds: readonly string[], from: Date, to: Date): Promise<DailyMileage[]> {
    return this.repo.sumDistanceByDay(vehicleIds, from, to);
  }
}

@Module({
  imports: [PrismaModule],
  providers: [TelemetryRepository, TelemetryFacade],
  exports: [TelemetryFacade],
})
export class TelemetryModule {}
```

```ts
// billing/billing.module.ts
import { Module } from "@nestjs/common";
import { TelemetryModule } from "../telemetry/telemetry.module";
import { FleetModule } from "../fleet/fleet.module";
import { InvoiceService } from "./invoice.service";

@Module({
  imports: [FleetModule, TelemetryModule],
  providers: [InvoiceService],
})
export class BillingModule {}
```

Nima o'zgardi:

- **Bog'liqliklar ko'rinadi.** `BillingModule`ni ochgan odam darhol uning Fleet va Telemetry'ga tayanishini ko'radi.
- **Public API kichik.** `TelemetryFacade.mileageForPeriod` - Billing'ga kerak bo'lgan yagona narsa. Telemetriya jadvali qanday partitsiyalangani Billing'ga ahamiyatsiz.
- **Ichki o'zgarish xavfsiz.** Telemetry jamoasi `TelemetryRepository`ni TimescaleDB'ga ko'chirsa, facade imzosi saqlansa, boshqa hech kim bilmaydi.
- **Kelajakda ajratish oson.** Agar bir kun Telemetry'ni alohida servisga chiqarish kerak bo'lsa, `TelemetryFacade` HTTP yoki gRPC klientga almashtiriladi. Chegara allaqachon mavjud.

## Qachon qo'llamaslik kerak

- **Juda kichik ilova.** Uch-to'rt endpoint'li ichki servisda modullarni facade bilan ajratish bilvosita chaqiruv qo'shadi xolos. Bitta `AppModule` yetarli bo'lishi mumkin.
- **Domen hali tushunilmaganda.** Modul chegaralarini juda erta chizish mikroservislardagi xatoni kichikroq miqyosda takrorlaydi. Avval bitta modul ichida ishlab, naqsh paydo bo'lganda bo'lish arzonroq. Monolit ichidagi noto'g'ri chegarani ko'chirish tarmoq ortidagisidan ancha oson, bu modulli monolitning asosiy afzalligi.
- **Facade har bir metodni shunchaki uzatsa.** Agar facade repository'ning 20 ta metodini bir xil nom bilan qayta eksport qilsa, u sayoz qatlam. Facade iste'molchi ehtiyojiga moslashgan bo'lishi kerak.
- **Har bir modul uchun alohida baza.** Bitta process ichida modullarga alohida bazalar berish tranzaksiyalarni va hisobotlarni qiyinlashtiradi, lekin mikroservislarning mustaqilligini bermaydi. Jadval egaligi va schema ajratish ko'p hollarda yetarli.
- **Haqiqiy operatsion sabab bo'lganda monolitda qolish.** Agar bitta modulning yuklamasi (masalan, sekundiga minglab GPS nuqtasi) qolganidan keskin farq qilsa va alohida masshtab talab qilsa, uni ajratish to'g'ri bo'lishi mumkin. Modulli monolit dogma emas, boshlang'ich nuqta. Tarmoq orqali bo'lish masalalari alohida System Design kursida.

## Stack'da: chegarani avtomatik tekshirish

- **Modul ichidagi `index.ts`.** Har bir modul papkasida faqat public API'ni eksport qiladigan `index.ts` bo'lsin. Boshqa modullar faqat shundan import qilsin.
- **dependency-cruiser.** README'dagi group matching imkoniyati bilan `^src/([^/]+)/` dan `^src/$1/` bo'lmagan va `index.ts` bo'lmagan fayllarga importni taqiqlash mumkin (85-dars). Bu qoida CI'da yuradi.
- **Nest graph.** Nest'ning start paytidagi DI xatolari eksport qilinmagan provider'larni avtomatik ushlaydi. Buni xavfsizlik to'ri sifatida qabul qiling, unga qarshi `@Global()` bilan kurashmang.
- **Ma'lumot egaligi.** Prisma'da ko'p schema yoki Kysely'da har bir modul uchun alohida `Database` tip interfeysi ishlatish mumkin, shunda modul boshqa modul jadvallarini tip darajasida ham ko'rmaydi.

## Xulosa

- Mikroservislar qo'shimcha "premium" talab qiladi. Fowler'ning maslahati: tizim haqiqatan ham murakkab bo'lmaguncha monolitdan boshlang va uning ichida modullikka e'tibor bering.
- Modulli monolit - bitta deploy, lekin aniq modul chegaralari, kichik public API va ma'lumotga yagona egalik.
- NestJS'da provider'lar default bo'yicha inkapsulyatsiyalangan va eksportlar modulning public API'si. Bu chegarani runtime'da tekshiradi.
- `@Global()` domen modullari uchun emas: u `imports` ro'yxatidagi hujjatni yo'q qiladi.
- Chegara kod importlarida ham, jadval murojaatlarida ham saqlanishi va CI'da avtomatik tekshirilishi kerak.
