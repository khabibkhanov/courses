---
n: 38
slug: papka-tuzilishi
title: "Fayl va papka tuzilishi: feature yoki layer"
summary: "Papka tuzilishi - loyihaning birinchi ko'rinadigan arxitekturasi. Bu darsda texnik qatlamlar bo'yicha (controllers, services) va feature bo'yicha (vehicles, billing) tashkil qilishni solishtiramiz, Next.js App Router va NestJS modullari uchun real tuzilmalarni va barrel fayllarning trade-off'larini ko'ramiz."
duration: 35
sources:
  - id: clean-arch
    note: "\"Screaming Architecture\" bobi: arxitektura framework'ni emas, use case'larni ko'rsatishi kerak; shuningdek Simon Brown yozgan \"The Missing Chapter\" (package by layer, by feature, ports and adapters, by component)"
  - id: nextjs-docs
    note: "Project Structure sahifasi: routing fayllari, colocation, private folders (_folder), route groups ((group)), src papkasi va tashkil qilish strategiyalari"
  - id: nestjs-docs
    note: "Modules sahifasi: feature modules, shared modules, global modules va ularni ortiqcha ishlatmaslik haqida ogohlantirish"
quiz:
  - q: "Martinning \"Screaming Architecture\" g'oyasi papka tuzilishiga qanday qo'llanadi?"
    options:
      - "Papkalar framework nomi bilan atalishi kerak"
      - "Papka tuzilishiga qarab tizim nima ish qilishi (domen va use case'lar) ko'rinishi kerak, qaysi framework ishlatilgani emas"
      - "Barcha fayllar bitta papkada bo'lishi kerak"
      - "Papka nomlari katta harflarda bo'lishi kerak"
    answer: 1
    explain: "Martin binoning chizmasiga qarab uning uy yoki kutubxona ekanini bilish mumkinligi kabi, kod tuzilmasiga qarab ham tizim nima qilishi ko'rinishi kerak deydi. `controllers/`, `services/`, `models/` faqat \"bu NestJS ilovasi\" deydi, `vehicles/`, `billing/`, `fuel/` esa \"bu transport parki tizimi\" deydi."
  - q: "Next.js App Router'da `app/vehicles/_components/VehicleCard.tsx` fayli haqida qaysi gap to'g'ri?"
    options:
      - "U `/vehicles/_components` URL'iga aylanadi"
      - "Uni `app` ichida saqlab bo'lmaydi"
      - "`_` bilan boshlangan private folder routing tizimidan chiqariladi. Lekin `page` yoki `route` fayli bo'lmasa, colocated fayllar baribir public bo'lmaydi"
      - "U faqat Pages Router'da ishlaydi"
    answer: 2
    explain: "Next.js hujjatiga ko'ra segment faqat `page` yoki `route` fayli bo'lganda public bo'ladi, shuning uchun boshqa fayllarni `app` ichida xavfsiz colocate qilish mumkin. Private folder bunga qo'shimcha ravishda papkani routing'dan butunlay chiqaradi va niyatni aniq ko'rsatadi."
  - q: "NestJS'da `@Global()` modullarini ko'p ishlatish nega tavsiya etilmaydi?"
    options:
      - "Ular ishlamaydi"
      - "Ular sekinroq"
      - "Ular faqat test muhitida ishlaydi"
      - "Ular bog'liqliklarni yashiradi: modul nima ishlatishini `imports`dan ko'rib bo'lmaydi. NestJS hujjati aniq import'larni afzal ko'radi"
    answer: 3
    explain: "NestJS hujjati hamma narsani global qilish tavsiya etilgan dizayn amaliyoti emasligini aytadi: aniq import'lar bog'liqliklarni nazorat ostida va ko'rinadigan qiladi. Global modulni odatda bir marta, root yoki core modulda ro'yxatdan o'tkazish kerak."
  - q: "Barrel fayl (`index.ts` bilan qayta eksport) ning qaysi kamchiligi eng ko'p real muammoga sabab bo'ladi?"
    options:
      - "Fayl nomlari uzunlashadi"
      - "Aylanma import'lar va keraksiz modullarni yuklash: bitta funksiya uchun import butun papkani tortib keladi, bu test va dev server'ni sekinlashtiradi va circular dependency xavfini oshiradi"
      - "TypeScript barrel fayllarni qo'llab-quvvatlamaydi"
      - "Prettier ularni formatlay olmaydi"
    answer: 1
    explain: "Barrel ichki modul uchun ochiq API yaratadi, lekin `export *` hamma narsani bitta nuqtaga yig'adi. Natijada import grafi kattalashadi, bundler va test runner ko'proq fayl yuklaydi, va papkalar bir-birining barrel'idan import qilsa, aylanma bog'liqlik paydo bo'ladi."
  - q: "Qaysi holatda layer bo'yicha (controllers/, services/, repositories/) tuzilma o'rinli bo'lishi mumkin?"
    options:
      - "Kichik, bitta domenli servis yoki CRUD API, unda feature'lar kam va ular bir-biri bilan chambarchas"
      - "100 ta modulli monolit"
      - "Bir nechta jamoa ishlaydigan loyiha"
      - "Hech qachon"
    answer: 0
    explain: "Feature bo'yicha tuzilmaning foydasi feature'lar soni va mustaqilligi bilan o'sadi. 5-6 ta endpoint'li kichik servisda layer tuzilmasi oddiy va tushunarli. Muammo loyiha o'sganda boshlanadi: bitta o'zgarish uchun 4 ta papkaga borish kerak bo'ladi."
task:
  title: "Layer tuzilmali NestJS loyihasini feature modullarga ko'chirish rejasi"
  prompt: |
    Quyidagi NestJS loyihasi layer bo'yicha tuzilgan. Unda 4 ta domen bor: vehicles, drivers, trips, billing. Jamoa o'sdi va har bir yangi feature 5-6 papkaga tegadi.

    1. Feature modullarga asoslangan yangi tuzilmani yozing (papka daraxti).
    2. `BillingService` hozir `TripsRepository`ni to'g'ridan-to'g'ri import qiladi. Yangi tuzilmada billing trips'ning ichki qismiga qanday murojaat qilishi kerak? Kod bilan ko'rsating.
    3. Qaysi narsalar `shared/` yoki `common/` ga tushadi va nima uchun u "axlat qutisi"ga aylanmasligi kerak?
    4. Barrel fayllardan qayerda foydalanasiz va qayerda yo'q?
  lang: ts
  starter: |
    // Hozirgi tuzilma:
    // src/
    //   controllers/  vehicles.controller.ts, drivers.controller.ts, trips.controller.ts, billing.controller.ts
    //   services/     vehicles.service.ts, drivers.service.ts, trips.service.ts, billing.service.ts, pdf.service.ts
    //   repositories/ vehicles.repository.ts, drivers.repository.ts, trips.repository.ts, invoices.repository.ts
    //   dto/          create-vehicle.dto.ts, ... (24 ta fayl)
    //   entities/     vehicle.entity.ts, driver.entity.ts, trip.entity.ts, invoice.entity.ts
    //   utils/        date.ts, money.ts, geo.ts, helpers.ts
    //   index.ts      (hamma narsani qayta eksport qiladi)
    //   app.module.ts (barcha provider'lar shu yerda)

    // src/services/billing.service.ts
    import { Injectable } from "@nestjs/common";
    import { TripsRepository } from "../repositories/trips.repository";
    import { InvoicesRepository } from "../repositories/invoices.repository";

    @Injectable()
    export class BillingService {
      constructor(
        private readonly trips: TripsRepository,
        private readonly invoices: InvoicesRepository,
      ) {}

      async invoiceClientMonth(clientId: string, month: string): Promise<void> {
        const rows = await this.trips.rawQuery(
          `select vehicle_id, sum(distance_m) as m from trips where client_id = $1 and to_char(ended_at,'YYYY-MM') = $2 group by vehicle_id`,
          [clientId, month],
        );
        await this.invoices.create(clientId, month, rows);
      }
    }
  solution: |
    // Yangi tuzilma:
    // src/
    //   app.module.ts
    //   main.ts
    //   vehicles/
    //     vehicles.module.ts
    //     vehicles.controller.ts
    //     vehicles.service.ts
    //     vehicles.repository.ts
    //     dto/  entities/
    //   drivers/   (xuddi shunday)
    //   trips/
    //     trips.module.ts          (exports: [TripStatsService])
    //     trips.controller.ts
    //     trips.service.ts
    //     trip-stats.service.ts    (boshqa modullar uchun ochiq API)
    //     trips.repository.ts      (eksport qilinmaydi)
    //     dto/  entities/
    //   billing/
    //     billing.module.ts        (imports: [TripsModule])
    //     billing.controller.ts
    //     billing.service.ts
    //     invoices.repository.ts
    //     invoice-pdf.service.ts   (faqat billing ishlatadi, shuning uchun shu yerda)
    //   shared/
    //     money.ts  date-range.ts  (domenga bog'liq bo'lmagan, kamida 2 modul ishlatadigan)
    //   infrastructure/
    //     database.module.ts

    // src/trips/trip-stats.service.ts
    import { Injectable } from "@nestjs/common";
    import { TripsRepository } from "./trips.repository";

    export type VehicleDistance = { vehicleId: string; distanceMeters: number };

    @Injectable()
    export class TripStatsService {
      constructor(private readonly trips: TripsRepository) {}

      /** Mijozning `YYYY-MM` oyida yakunlangan reyslari bo'yicha mashinalar masofasi. */
      distanceByVehicle(clientId: string, month: string): Promise<VehicleDistance[]> {
        return this.trips.sumDistanceByVehicle(clientId, month);
      }
    }

    // src/trips/trips.module.ts
    import { Module } from "@nestjs/common";
    import { TripsController } from "./trips.controller";
    import { TripsService } from "./trips.service";
    import { TripStatsService } from "./trip-stats.service";
    import { TripsRepository } from "./trips.repository";

    @Module({
      controllers: [TripsController],
      providers: [TripsService, TripStatsService, TripsRepository],
      exports: [TripStatsService],
    })
    export class TripsModule {}

    // src/billing/billing.service.ts
    import { Injectable } from "@nestjs/common";
    import { TripStatsService } from "../trips/trip-stats.service";
    import { InvoicesRepository } from "./invoices.repository";

    @Injectable()
    export class BillingService {
      constructor(
        private readonly tripStats: TripStatsService,
        private readonly invoices: InvoicesRepository,
      ) {}

      async invoiceClientMonth(clientId: string, month: string): Promise<void> {
        const distances = await this.tripStats.distanceByVehicle(clientId, month);
        await this.invoices.create(clientId, month, distances);
      }
    }
  solutionNotes: |
    - **Feature modullar:** har bir domen o'z papkasi va `*.module.ts` ga ega. Yangi feature odatda bitta papkaga tegadi.
    - **Modul chegarasi:** `TripsRepository` endi eksport qilinmaydi. Billing faqat `TripsModule` `exports`ga chiqargan `TripStatsService` orqali ishlaydi. SQL va jadval tuzilishi trips ichida qoldi: trips jadvali o'zgarsa, billing buzilmaydi.
    - **NestJS mexanizmi bu chegarani majburlaydi:** eksport qilinmagan provider'ni boshqa modulda inject qilib bo'lmaydi, DI xato beradi. TypeScript import'i esa baribir mumkin, shuning uchun uni lint bilan ham nazorat qilish mumkin (dependency-cruiser yoki `no-restricted-imports`).
    - **`pdf.service.ts`** billing ichiga ko'chdi: uni faqat billing ishlatadi. "Umumiy" papkaga faqat haqiqatan bir nechta modul ishlatadigan narsa tushadi.
    - **`helpers.ts` va `utils/`** tarqatib yuborildi: har bir funksiya ishlatiladigan modulga. `shared/` faqat domensiz, barqaror kod uchun (pul, sana oralig'i).
    - **Barrel:** ildiz `src/index.ts` o'chirildi. NestJS'da modul fayli o'zi public API vazifasini bajaradi (`exports`). Barrel faqat alohida paket (masalan, monorepodagi `packages/shared`) chegarasida o'rinli.
  checklist:
    - "Papka tuzilishi domenlarni ko'rsatadi, texnik qatlamlarni emas"
    - "Har bir feature o'z NestJS moduliga ega"
    - "Boshqa modulning repository'siga to'g'ridan-to'g'ri murojaat yo'q, faqat exports orqali"
    - "utils/helpers fayllari ishlatiladigan joyga tarqatildi"
    - "Barrel fayllar faqat haqiqiy paket chegarasida"
---

## Muammo

Yangi talab: "Mashinalar ro'yxatiga yoqilg'i sarfi ustunini qo'shish". NestJS loyihasida bu o'zgarish `controllers/vehicles.controller.ts`, `services/vehicles.service.ts`, `services/fuel.service.ts`, `repositories/fuel.repository.ts`, `dto/vehicle-list-item.dto.ts`, `entities/vehicle.entity.ts` fayllariga tegadi. Oltita papka, har birida 20-30 ta fayl. Frontend'da esa `components/`, `hooks/`, `services/`, `types/` papkalari bo'ylab yana shuncha.

Bu tuzilmaning o'zi xato emas. Kichik loyihada u oddiy va tushunarli. Muammo loyiha o'sganda ko'rinadi: bitta feature o'zgarishi hamma qatlamlarga tarqaladi (Fowler buni shotgun surgery deydi, 73-dars), papkalar ichidagi fayllar bir-biri bilan bog'liq emas, bog'liq fayllar esa turli papkalarda. `utils/helpers.ts` 800 qatorga yetadi, chunki hech kim yangi funksiyani qayerga qo'yishni bilmaydi.

Papka tuzilishi - loyihaning birinchi ko'rinadigan arxitekturasi. Yangi dasturchi `src/`ni ochganda ko'rgan narsasi uning tizim haqidagi birinchi tasavvurini shakllantiradi.

## Asosiy g'oya

### Screaming Architecture

*Clean Architecture*da Martin "Screaming Architecture" g'oyasini beradi: bino chizmasiga qarab uning turar joy yoki kutubxona ekanini darhol bilish mumkin, chunki chizma binoning *maqsadini* ko'rsatadi. Dastur arxitekturasi ham shunday bo'lishi kerak: kodning yuqori darajadagi tuzilishi tizim nima qilishini "baqirib" turishi kerak - masalan, "bu transport parkini boshqarish tizimi" - framework emas.

`controllers/ services/ repositories/` tuzilmasi faqat bitta narsani aytadi: "bu MVC yoki NestJS ilovasi". `vehicles/ drivers/ trips/ billing/ fuel/` esa domenni aytadi. Martin framework'ni detal deb biladi: u arxitekturaning markazida emas, chetida bo'lishi kerak.

### Ikki asosiy yondashuv

**Layer bo'yicha (package by layer).** Fayllar texnik roli bo'yicha guruhlanadi: barcha controller'lar bir joyda, barcha service'lar boshqa joyda. *Clean Architecture* kitobidagi Simon Brown yozgan qo'shimcha bobda bu yondashuv eng oddiy boshlanish nuqtasi sifatida tan olinadi, lekin u domenni yashirishi va loyiha o'sganda yaxshi masshtablanmasligi aytiladi.

**Feature bo'yicha (package by feature).** Fayllar biznes imkoniyati bo'yicha guruhlanadi: `vehicles/` ichida o'zining controller, service, repository va DTO'lari. Bitta feature o'zgarishi odatda bitta papkaga tushadi. Bu cohesion tamoyiliga mos: birga o'zgaradigan narsalar birga turadi (51-dars).

O'sha bobda boshqa variantlar ham ko'rib chiqiladi (ports and adapters va "package by component") va muhim fikr ta'kidlanadi: papka tuzilishi faqat niyatni ko'rsatadi, chegaralarni esa kompilyator, modul tizimi yoki lint majburlashi kerak. Aks holda har qanday chiroyli tuzilma vaqt o'tishi bilan "hamma narsa hamma narsani import qiladi" holatiga keladi.

## Chuqurroq: framework'lar nima taklif qiladi

### NestJS: modullar

NestJS hujjati modullarni komponentlarni tashkil qilishning tavsiya etilgan usuli deb ataydi. Feature module bitta domen uchun controller va service'larni guruhlaydi. Hujjatdagi namuna - `cats/` papkasi: `cats.module.ts`, `cats.controller.ts`, `cats.service.ts`, `dto/`, `interfaces/`. Ya'ni NestJS'ning o'zi feature bo'yicha tuzilmani taklif qiladi.

Muhim mexanizm: **modul o'z provider'larini default ravishda inkapsulyatsiya qiladi**. Boshqa modul faqat `exports`ga chiqarilgan provider'larni inject qila oladi. Bu - papka tuzilishi bilan cheklanmagan, runtime'da majburlanadigan chegara. Agar billing moduli trips'ning `exports`ga kirmagan repository'sini inject qilmoqchi bo'lsa, ilova ishga tushmaydi.

Hujjatdagi ikki ogohlantirish:

- **Global modullar.** `@Global()` modulning eksportlarini hamma joyda import'siz mavjud qiladi. Hujjat hamma narsani global qilishni tavsiya etilgan amaliyot emas deydi: aniq import'lar bog'liqliklarni ko'rinadigan qiladi. Global modul odatda bir marta, root yoki core modulda (masalan, config, logger).
- **Provider'ni bir necha modulda ro'yxatdan o'tkazish.** Bu alohida instansiyalar yaratadi va state nomuvofiqligiga olib kelishi mumkin. To'g'ri yo'l - bitta modulda e'lon qilib, eksport qilish.

### Next.js App Router: routing va colocation

Next.js hujjati ochiq aytadi: Next.js loyiha fayllarini tashkil qilishda "unopinionated", lekin bir nechta yordamchi mexanizm beradi.

- **Routing fayllari.** `page`, `layout`, `loading`, `error`, `not-found`, `route`, `template`, `default`. Papka URL segmentini belgilaydi, lekin segment faqat `page` yoki `route` fayli bo'lganda public bo'ladi.
- **Colocation.** Shu sababli komponentlar, yordamchilar va testlarni route segmenti ichida xavfsiz saqlash mumkin: ular tasodifan route'ga aylanmaydi.
- **Private folders (`_folder`).** Papkani va uning barcha ichki papkalarini routing'dan chiqaradi. Hujjat uni UI mantiqini routing mantiqidan ajratish, izchil tashkil qilish va kelajakdagi Next.js fayl konventsiyalari bilan nom to'qnashuvidan qochish uchun foydali deydi.
- **Route groups (`(group)`).** URL'ga ta'sir qilmasdan route'larni guruhlash, masalan `(marketing)` va `(dashboard)` alohida layout bilan.
- **`src` papkasi.** Ilova kodini ildizdagi konfiguratsiya fayllaridan ajratadi.

Hujjat uchta strategiyani ko'rsatadi: barcha loyiha fayllarini `app`dan tashqarida saqlash (`app` faqat routing uchun), ularni `app` ichidagi yuqori darajadagi papkalarda saqlash, yoki feature/route bo'yicha bo'lish (umumiy kod ildizda, maxsus kod uni ishlatadigan segmentda). Asosiy tavsiya: jamoa uchun ishlaydigan strategiyani tanlang va izchil bo'ling.

### Barrel fayllar: trade-off

Barrel - papka ichidagi modullarni `index.ts` orqali qayta eksport qiluvchi fayl:

```ts
// features/vehicles/index.ts
export { VehicleCard } from "./components/VehicleCard";
export { useVehicles } from "./hooks/useVehicles";
export type { Vehicle } from "./types";
```

**Foydalari:**

- Modulning public API'sini bitta joyda belgilaydi. Tashqaridan `features/vehicles` import qilinadi, ichki fayl yo'llari emas. Bu ichki tuzilmani o'zgartirishni xavfsiz qiladi (information hiding, 43-dars).
- Import'lar qisqaroq.

**Kamchiliklari:**

- **Ortiqcha yuklash.** `import { formatPlate } from "@/shared"` butun `shared/index.ts`ni va u eksport qilgan hamma narsani yuklashi mumkin. Tree-shaking production bundle'da yordam beradi, lekin dev server, test runner (Jest/Vitest) va type checker ko'proq fayl bilan ishlaydi. Katta loyihalarda bu sezilarli sekinlashuvga olib kelishi mumkin.
- **Aylanma bog'liqliklar.** `vehicles/index.ts` `drivers`dan, `drivers/index.ts` esa `vehicles`dan import qilsa, modul yuklanish tartibiga bog'liq `undefined` xatolari paydo bo'ladi.
- **`export *`** nima eksport qilinayotganini yashiradi va nom to'qnashuvlariga olib keladi.
- **Next.js'da server/client chegarasi.** Bitta barrel ham server-only, ham `"use client"` modullarni qayta eksport qilsa, client komponentdan import qilish server kodini client grafiga tortishi mumkin. Shuning uchun ularni alohida kirish nuqtalariga bo'lish xavfsizroq (93-dars).

**Amaliy qoida:** barrel faqat haqiqiy modul yoki paket chegarasida (monorepodagi paket, aniq public API'ga ega feature), aniq nomlangan eksportlar bilan. Har bir papkada `index.ts` va `export *` - yo'q.

## Misol: Next.js App Router'da feature tuzilmasi

Layer bo'yicha tuzilgan frontend:

```
src/
  app/
    vehicles/page.tsx
    vehicles/[id]/page.tsx
    billing/page.tsx
  components/   VehicleCard.tsx, VehicleTable.tsx, InvoiceRow.tsx, Button.tsx, ... (60 ta)
  hooks/        useVehicles.ts, useInvoices.ts, useDebounce.ts, ...
  services/     vehicles.ts, invoices.ts
  types/        vehicle.ts, invoice.ts
  utils/        format.ts, helpers.ts
```

Feature bo'yicha qayta tashkil qilingan:

```
src/
  app/
    (dashboard)/
      layout.tsx
      vehicles/
        page.tsx
        [id]/page.tsx
        _components/VehicleFuelChart.tsx   (faqat shu sahifa uchun)
      billing/page.tsx
  features/
    vehicles/
      components/VehicleCard.tsx
      components/VehicleTable.tsx
      queries.ts            (server-only ma'lumot olish)
      types.ts
      index.ts              (public API: aniq nomlangan eksportlar)
    billing/
      ...
  shared/
    ui/Button.tsx
    lib/format-money.ts
```

Sahifa endi faqat feature'ning public API'sidan foydalanadi:

```tsx
// src/app/(dashboard)/vehicles/page.tsx
import { VehicleTable, listVehiclesForFleet } from "@/features/vehicles";

export default async function VehiclesPage() {
  const vehicles = await listVehiclesForFleet();
  return <VehicleTable vehicles={vehicles} />;
}
```

Va feature'ning `index.ts`i nima ochiq ekanini aniq aytadi:

```ts
// src/features/vehicles/index.ts
export { VehicleTable } from "./components/VehicleTable";
export { VehicleCard } from "./components/VehicleCard";
export { listVehiclesForFleet } from "./queries";
export type { VehicleListItem } from "./types";
```

Nima o'zgardi va nega:

- `app/` faqat routing va sahifa kompozitsiyasi. Biznes kodi `features/`da. Bu Next.js hujjatidagi "loyiha fayllarini `app`dan tashqarida saqlash" strategiyasining varianti.
- Faqat bitta sahifa ishlatadigan komponent `_components/` private folder ichida, sahifaga yaqin (colocation).
- `(dashboard)` route group URL'ni o'zgartirmasdan umumiy layout beradi.
- `shared/` faqat domensiz kod uchun: UI primitivlar va umumiy formatlash.
- `features/vehicles/index.ts` - aniq nomlangan eksportlar. Ichidagi fayllarni ko'chirish tashqi import'larni buzmaydi.
- `queries.ts` server-only. Agar `index.ts`dan client komponent ham, server funksiya ham eksport qilinsa, client tomonda import qilishda ehtiyot bo'lish kerak. Kattaroq loyihalarda `server.ts` va `client.ts` kabi alohida kirish nuqtalari xavfsizroq.

## Qachon qo'llamaslik kerak

- **Kichik loyihada feature tuzilmasi.** 5 ta endpoint'li ichki servis yoki 3 sahifali admin panelda har bir feature uchun alohida papka va modul ochish - ortiqcha ceremony. Layer bo'yicha oddiy tuzilma bilan boshlash va loyiha o'sganda ko'chirish oqilona (9-dars, YAGNI).
- **Domen chegaralari hali noaniq.** Feature'lar qanday bo'linishi hali ma'lum bo'lmasa, erta bo'lish noto'g'ri chegaralar beradi va keyin ularni qayta ko'chirish qimmat. Bir necha oy domen o'rganilgandan keyin bo'lish yaxshiroq.
- **Har bir papkada barrel.** Bu import grafini kattalashtiradi va aylanma bog'liqlik xavfini oshiradi. Faqat haqiqiy chegaralarda.
- **"shared" yoki "common" axlat qutisi.** Agar hamma narsa `shared/`ga tushsa, feature tuzilmasi ma'nosini yo'qotadi. Qoida: biror narsa `shared/`ga faqat kamida ikki feature uni ishlatganda va u domenga bog'liq bo'lmaganda tushadi.
- **Papka tuzilishini arxitektura bilan almashtirish.** Papkalar chiroyli bo'lishi mumkin, lekin `billing/` `trips/`ning ichki repository'sini import qilsa, chegara yo'q. NestJS modul eksportlari, `no-restricted-imports` yoki dependency-cruiser bilan chegarani majburlash kerak (83-dars).
- **Faqat papkalarni ko'chirish uchun katta PR.** Yuzlab faylni ko'chirish barcha ochiq PR'larda conflict beradi. Bosqichma-bosqich, bitta feature'dan boshlang.

## Stack'da: chegaralarni majburlash

- **NestJS:** modul `exports` - asosiy mexanizm. Feature modul faqat boshqa modullarga kerak bo'lgan service'ni eksport qiladi, repository'larni emas.
- **ESLint `no-restricted-imports`:** `@/features/*/components/*` kabi ichki yo'llardan import'ni taqiqlash va faqat `@/features/vehicles` orqali import qilishga majburlash.
- **dependency-cruiser:** `features/billing` dan `features/trips/**/repository` ga import'ni taqiqlovchi qoidalar, aylanma bog'liqliklarni topish va bog'liqlik grafini vizualizatsiya qilish.
- **TypeScript path alias:** `tsconfig.json`dagi `paths` (`@/features/*`) chuqur nisbiy import'larni (`../../../`) yo'qotadi va papkalarni ko'chirishni osonlashtiradi.
- **Next.js `server-only` paketi:** server-only modulga `import "server-only"` qo'shish uni client komponentga tasodifan import qilinganda build xatosini beradi. Bu barrel orqali yuzaga keladigan chegara buzilishini erta topadi.

## Xulosa

- Papka tuzilishi tizim nima qilishini ko'rsatishi kerak, qaysi framework ishlatilganini emas (Screaming Architecture).
- Layer tuzilmasi kichik loyihada oddiy, lekin o'sganda bitta feature o'zgarishini ko'p papkaga tarqatadi. Feature tuzilmasi birga o'zgaradigan narsalarni birga saqlaydi.
- NestJS modullari feature tuzilmasini va chegarani (exports) runtime'da majburlaydi. Global modullarni kam ishlating.
- Next.js App Router tashkil qilishda erkin: colocation, `_private` papkalar va `(group)`lar bilan feature'larga yaqin tuzilma qurish mumkin. Asosiysi - izchillik.
- Barrel fayllar faqat haqiqiy modul chegarasida, aniq nomlangan eksportlar bilan. Har bir papkadagi `export *` sekinlik va aylanma bog'liqlikka olib keladi.
