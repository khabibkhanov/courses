---
n: 89
slug: api-dizayn
title: "API tozaligi: DTO, nomlash, xato formati"
summary: "HTTP API - bu boshqa jamoalar va mijozlar uchun interfeys, va u kod interfeysi kabi toza bo'lishi kerak: aniq shartnoma, izchil nomlar, ichki modelni oshkor qilmaydigan DTO'lar va bitta, mashina o'qiy oladigan xato formati. Bu darsda NestJS DTO'lari, ValidationPipe va RFC 9457 problem details'ni ko'ramiz."
duration: 35
sources:
  - id: rfc-9457
    note: "RFC 9457: problem details obyekti a'zolari (type, status, title, detail, instance), application/problem+json media turi, extension a'zolari va xavfsizlik bo'yicha mulohazalar; RFC 7807'ni almashtiradi"
  - id: nestjs-docs
    note: "Validation bo'limi (ValidationPipe: whitelist, forbidNonWhitelisted, transform, disableErrorMessages) va exception filters"
quiz:
  - q: "RFC 9457'ga ko'ra problem details obyektidagi qaysi a'zo klientlar uchun muammo turining asosiy identifikatori?"
    options:
      - "`title`"
      - "`detail`"
      - "`type` - muammo turini aniqlaydigan URI reference"
      - "`instance`"
    answer: 2
    explain: "`type` asosiy identifikator va berilmasa default'i `about:blank`. `title` turning qisqa tavsifi, `detail` aynan shu holat uchun izoh, `instance` esa shu holatning o'zini aniqlaydi."
  - q: "Mobil ilova xato turini aniqlash uchun `detail` matnini regex bilan tekshiradi: `/yetarli emas/`. Nega bu noto'g'ri?"
    options:
      - "RFC 9457'ga ko'ra `detail` inson uchun, aynan shu holatga oid izoh va klientlar uni parse qilmasligi kerak; dasturiy qaror `type` va extension a'zolariga asoslanadi"
      - "Regex sekin ishlaydi"
      - "`detail` majburiy a'zo emas, lekin parse qilish mumkin"
      - "Matn har doim ingliz tilida bo'ladi"
    answer: 0
    explain: "Spec'ga ko'ra `detail` muammoni tuzatishga yordam berishi kerak va iste'molchilar undan ma'lumot ajratib olmasligi kerak. Kerakli ma'lumot (masalan, `balance`) alohida extension a'zo sifatida beriladi."
  - q: "NestJS'da `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` o'rnatilgan. Klient `CreateOrderDto`da yo'q bo'lgan `discountPercent: 90` maydonini yubordi. Nima bo'ladi?"
    options:
      - "Maydon jimgina olib tashlanadi va so'rov bajariladi"
      - "Maydon entity'ga yoziladi"
      - "Hech narsa, chunki TypeScript tipi buni oldini oladi"
      - "So'rov validatsiya xatosi bilan rad etiladi, chunki whitelist'da yo'q xususiyatlar taqiqlangan"
    answer: 3
    explain: "`whitelist` dekoratorsiz xususiyatlarni olib tashlaydi, `forbidNonWhitelisted` esa olib tashlash o'rniga so'rovni rad etadi. TypeScript tiplari runtime'da mavjud emas va hech narsani tekshirmaydi."
  - q: "Controller Prisma `User` entity'sini to'g'ridan-to'g'ri qaytaradi. Keyinchalik jadvalga `passwordHash` va `internalRiskScore` ustunlari qo'shildi. Asosiy muammo nima?"
    options:
      - "Javob hajmi kattalashadi"
      - "Ichki ma'lumot modeli API shartnomasiga aylangan: yangi ustunlar avtomatik ravishda tashqariga oqib chiqadi va bazani o'zgartirish API'ni buzadi"
      - "JSON serializatsiya sekinlashadi"
      - "Hech qanday muammo yo'q"
    answer: 1
    explain: "Response DTO ichki model va tashqi shartnoma orasidagi chegara. Usiz har bir migratsiya API o'zgarishi, va maxfiy maydonlar ko'rinmas tarzda oshkor bo'ladi."
  - q: "API'da bir vaqtda `/getVehicles`, `/vehicle/create`, `/vehicles/:id/remove` va javoblarda `vehicle_id`, `vehicleId`, `carId` ishlatiladi. Qaysi tamoyil eng ko'p buzilgan?"
    options:
      - "Idempotentlik"
      - "Xavfsizlik"
      - "Izchillik: bitta tushuncha uchun bitta nom va bitta naqsh (resurs nomi ko'plikda, amal HTTP metodida, maydon nomlari bir xil uslubda)"
      - "Performance"
    answer: 2
    explain: "Bu 18-darsdagi 'bir tushuncha - bir so'z' qoidasining API darajasidagi ko'rinishi. Klient har bir endpoint'ni alohida o'rganishga majbur bo'ladi."
  - q: "500 xato javobida `detail` maydoniga `err.stack` va SQL so'rovi qo'yilgan. RFC 9457'ning xavfsizlik bo'limiga ko'ra bu qanday baholanadi?"
    options:
      - "Yaxshi, debugging osonlashadi"
      - "Faqat production'da muammo"
      - "Normal, agar HTTPS ishlatilsa"
      - "Xavfli: spec stack dump kabi implementatsiya ichki tafsilotlarini oshkor qilmaslikni va problem'ga qo'shiladigan ma'lumotni sinchiklab tekshirishni talab qiladi; tafsilot logga, klientga esa `instance` yoki request id"
    answer: 3
    explain: "Ichki tafsilotlar hujumchiga tizim haqida ma'lumot beradi. To'g'ri yo'l: klientga umumiy xabar va so'rov identifikatori, to'liq tafsilot esa server logida (88-dars)."
task:
  title: "Endpoint'ni DTO va problem details bilan tozalash"
  prompt: |
    Quyidagi controller buyurtma yaratadi. U `any` qabul qiladi, Prisma entity'sini qaytaradi va xatolarni har xil shaklda beradi: ba'zan `{ error: "..." }`, ba'zan `{ message, code }`, ba'zan oddiy satr.

    1. Kirish uchun validatsiyalangan request DTO yozing.
    2. Javob uchun ichki modelni oshkor qilmaydigan response DTO yozing.
    3. Barcha xatolarni RFC 9457 problem details formatida, `application/problem+json` bilan qaytaradigan exception filter yozing.
    4. Biznes xatosi (balans yetarli emas) uchun mashina o'qiy oladigan extension a'zo qo'shing.
  lang: ts
  starter: |
    import { Body, Controller, Post, Res } from "@nestjs/common";
    import type { Response } from "express";
    import { PrismaService } from "../prisma/prisma.service";

    @Controller("api")
    export class OrderController {
      constructor(private readonly prisma: PrismaService) {}

      @Post("createOrder")
      async create(@Body() body: any, @Res() res: Response) {
        if (!body.items || body.items.length === 0) {
          return res.status(400).send("items required");
        }
        const wallet = await this.prisma.wallet.findUnique({ where: { companyId: body.company_id } });
        const total = body.items.reduce((s: number, i: any) => s + i.price * i.qty, 0);
        if (!wallet || wallet.balance < total) {
          return res.status(400).json({ error: "NO_MONEY", msg: "balans yetarli emas" });
        }
        try {
          const order = await this.prisma.order.create({ data: { companyId: body.company_id, total } });
          return res.json(order);
        } catch (e: any) {
          return res.status(500).json({ message: e.message, stack: e.stack });
        }
      }
    }
  solution: |
    // orders/dto.ts
    import { Type } from "class-transformer";
    import { ArrayMinSize, IsInt, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";

    export class OrderItemInput {
      @IsString() productId!: string;
      @IsInt() @IsPositive() quantity!: number;
    }

    export class CreateOrderRequest {
      @IsUUID() companyId!: string;
      @ValidateNested({ each: true })
      @Type(() => OrderItemInput)
      @ArrayMinSize(1)
      items!: OrderItemInput[];
    }

    export type OrderResponse = {
      id: string;
      status: "pending";
      totalUzs: number;
      createdAt: string;
    };

    // http/problem.ts
    export type ProblemDetails = {
      type: string;
      title: string;
      status: number;
      detail?: string;
      instance?: string;
      [extension: string]: unknown;
    };

    export class ProblemException extends Error {
      constructor(readonly problem: ProblemDetails) {
        super(problem.title);
      }
    }

    // http/problem.filter.ts
    import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
    import type { Request, Response } from "express";

    @Catch()
    export class ProblemDetailsFilter implements ExceptionFilter {
      private readonly logger = new Logger(ProblemDetailsFilter.name);

      catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();
        const instance = `urn:request:${String(req.headers["x-request-id"] ?? "unknown")}`;

        const problem = toProblem(exception, instance);
        if (problem.status >= 500) this.logger.error({ err: exception, instance }, "unhandled error");

        res.status(problem.status).type("application/problem+json").json(problem);
      }
    }

    function toProblem(exception: unknown, instance: string): ProblemDetails {
      if (exception instanceof ProblemException) return { ...exception.problem, instance };
      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const body = exception.getResponse();
        const errors = typeof body === "object" && body !== null && "message" in body ? body.message : undefined;
        return {
          type: status === 400 ? "https://api.fleet.uz/problems/validation" : "about:blank",
          title: status === 400 ? "Request validation failed" : exception.message,
          status,
          instance,
          ...(Array.isArray(errors) ? { errors } : {}),
        };
      }
      return { type: "about:blank", title: "Internal Server Error", status: 500, instance };
    }

    // orders/order.controller.ts
    import { Body, Controller, Post } from "@nestjs/common";
    import { CreateOrderRequest, type OrderResponse } from "./dto";
    import { ProblemException } from "../http/problem";
    import { PlaceOrder } from "./place-order"; // use case: summani server tomonida narxlardan hisoblaydi

    @Controller("orders")
    export class OrderController {
      constructor(private readonly placeOrder: PlaceOrder) {}

      @Post()
      async create(@Body() body: CreateOrderRequest): Promise<OrderResponse> {
        const result = await this.placeOrder.execute(body.companyId, body.items);
        if (!result.ok) {
          throw new ProblemException({
            type: "https://api.fleet.uz/problems/insufficient-balance",
            title: "Insufficient wallet balance",
            status: 422,
            detail: `Buyurtma uchun ${result.requiredUzs} so'm kerak, balansda ${result.balanceUzs} so'm bor.`,
            balanceUzs: result.balanceUzs,
            requiredUzs: result.requiredUzs,
          });
        }
        const o = result.order;
        return { id: o.id, status: "pending", totalUzs: o.totalUzs, createdAt: o.createdAt.toISOString() };
      }
    }

    // main.ts
    // app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    // app.useGlobalFilters(new ProblemDetailsFilter());
  solutionNotes: |
    - Route resurs nomi bilan (`POST /orders`), amal HTTP metodida. `createOrder` kabi fe'l-yo'llar olib tashlandi.
    - `any` o'rniga `CreateOrderRequest` DTO: `ValidationPipe` uni runtime'da tekshiradi, `whitelist` va `forbidNonWhitelisted` kutilmagan maydonlarni rad etadi. Narx klientdan olinmaydi: summa server tomonida mahsulot narxlaridan hisoblanadi (starter'da klient narxni o'zi yuborardi).
    - Maydon nomlari bitta uslubda (camelCase): `company_id` va `companyId` aralashmasi yo'q. Pul maydoni birligi nomida (`totalUzs`).
    - Javob `OrderResponse` - ichki Prisma modeli emas. Jadvalga yangi ustun qo'shilsa, API o'zgarmaydi.
    - Barcha xatolar bitta formatda: `type`, `title`, `status`, `instance` va kerak bo'lsa `detail`. `Content-Type: application/problem+json`.
    - Biznes xatosi o'z `type` URI'siga ega va `balanceUzs`, `requiredUzs` extension a'zolari bilan: klient matnni parse qilmasdan qaror qabul qiladi.
    - 500 javobida stack va xabar yo'q, faqat `instance` (request id). To'liq tafsilot server logida.
    - `@Res()` olib tashlandi: controller qiymat qaytaradi, Nest serializatsiya va filter'lar bilan ishlaydi.
  checklist:
    - "Controller any qabul qilmaydi, DTO ValidationPipe bilan tekshiriladi"
    - "Javob ichki entity emas, alohida response DTO"
    - "Barcha xatolar problem details formatida va application/problem+json bilan"
    - "Biznes xatosida type URI va extension a'zolar bor"
    - "500 javobida stack yoki ichki xabar yo'q"
    - "Route va maydon nomlari izchil"
---

## Muammo

Fleet platformasining API'si uch yil davomida turli dasturchilar tomonidan kengaytirilgan. Mobil ilova jamoasi quyidagilarga duch keladi:

- `/api/getVehicles`, `/api/vehicle/create`, `/api/vehicles/:id/remove` - har bir endpoint o'z naqshida.
- Javoblarda bir joyda `vehicle_id`, boshqasida `vehicleId`, uchinchisida `carId`. Summa ba'zan so'mda, ba'zan tiyinda, va maydon nomidan buni bilib bo'lmaydi.
- `GET /users/:id` Prisma entity'sini to'g'ridan-to'g'ri qaytaradi. Bir kun jadvalga `passwordHash` qo'shildi va u javobda paydo bo'ldi.
- Xatolar to'rt xil shaklda keladi: `"items required"` satri, `{ error: "NO_MONEY" }`, `{ message: [...], statusCode: 400 }` va ba'zan to'liq stack trace.

Klient kodi har bir endpoint uchun alohida xato parse qiluvchiga ega, va har bir backend o'zgarishi mobil relizni talab qiladi.

API - bu boshqa jamoalar, mijozlar va integratsiya qiluvchilar uchun interfeys. Ousterhout'ning chuqur modul g'oyasi (52-dars) bu yerda ham ishlaydi: yaxshi API oddiy interfeys ortida murakkablikni yashiradi, yomon API esa ichki tuzilmani tashqariga oqizadi.

## Asosiy g'oya

Toza HTTP API uchun to'rt tamoyil:

1. **Shartnoma ochiq va tekshiriladi.** Kirish va chiqish shakli aniq tiplangan DTO'lar bilan belgilanadi va kirish runtime'da validatsiya qilinadi. TypeScript tipi runtime'da mavjud emas, shuning uchun `@Body() body: CreateOrderDto` o'zi hech narsani tekshirmaydi.
2. **Ichki model va tashqi shartnoma ajratilgan.** Response DTO - chegara. Baza sxemasi o'zgarishi API o'zgarishini anglatmasligi kerak (81-darsdagi "chegaradan oddiy struktura o'tadi" qoidasi).
3. **Izchil nomlash.** Bitta tushuncha - bitta nom, bitta naqsh. Resurslar ko'plikdagi otlar, amallar HTTP metodlari, maydonlar bitta uslubda va birlik nomda ko'rinadi (`distanceKm`, `amountUzs`, `recordedAt`).
4. **Bitta xato formati.** Barcha xatolar bir xil, mashina o'qiy oladigan shaklda. Buning uchun IETF standarti bor: RFC 9457 "Problem Details for HTTP APIs".

## Chuqurroq: RFC 9457 problem details

RFC 9457 2023 yilda nashr etilgan va avvalgi RFC 7807'ni almashtiradi. U HTTP javobida xato tafsilotlarini yetkazish uchun umumiy formatni belgilaydi, shunda har bir API o'z formatini o'ylab topmaydi. JSON uchun media turi `application/problem+json`.

### Standart a'zolar

Spec'dagi barcha a'zolar ixtiyoriy, lekin har birining aniq semantikasi bor:

- **`type`** - muammo turini aniqlaydigan URI reference. Klientlar uchun asosiy identifikator. Berilmasa, default'i `about:blank`, va bu holda muammo HTTP status kodidan boshqa ma'no tashimaydi, `title` esa status'ning standart nomiga mos kelishi kerak.
- **`status`** - server shu holat uchun yaratgan HTTP status kodi. Spec'ga ko'ra u faqat maslahat xarakterida: haqiqiy status HTTP javobining o'zida ham bo'lishi shart, va oraliq proksi uni o'zgartirgan bo'lsa, ikkalasi farq qilishi mumkin.
- **`title`** - muammo turining qisqa, inson o'qiy oladigan tavsifi. U bir turdagi barcha holatlar uchun bir xil bo'lishi kerak (lokalizatsiyadan tashqari).
- **`detail`** - aynan shu holat uchun inson o'qiy oladigan izoh. Spec'ga ko'ra u klientga muammoni tuzatishda yordam berishi kerak, debugging ma'lumoti emas, va iste'molchilar undan ma'lumot ajratib olish uchun uni parse qilmasligi kerak.
- **`instance`** - shu holatning o'zini aniqlaydigan URI reference. U ochiladigan havola yoki server uchun ma'noli noaniq identifikator bo'lishi mumkin. Amalda request id bilan bog'lash qulay.

### Extension a'zolar

Muammo turi o'z a'zolarini qo'shishi mumkin. Spec'dagi misolda balans yetarli bo'lmaganda `balance` va `accounts` qo'shiladi. Klientlar tanimagan extension'larni e'tiborsiz qoldirishi shart. Bu juda muhim: dasturiy qaror uchun kerakli ma'lumot (`balanceUzs`, `retryAfterSeconds`, validatsiya xatolari ro'yxati) `detail` matnida emas, alohida maydonlarda bo'ladi. Spec yangi extension nomlari harf bilan boshlanib, faqat harf, raqam va pastki chiziqdan iborat va kamida uch belgili bo'lishini tavsiya qiladi, shunda ular turli formatlarda qulay ishlatiladi.

### `type` URI'lari

`type` sifatida o'z domeningizdagi URI ishlatiladi (`https://api.fleet.uz/problems/insufficient-balance`). Ideal holatda u ochilganda muammo turining hujjatini ko'rsatadi, lekin bu majburiy emas. Asosiysi - u barqaror: klient kodi shu satr bo'yicha qaror qabul qiladi, shuning uchun uni o'zgartirish API'ni buzish bilan teng.

### Xavfsizlik

Spec'ning xavfsizlik bo'limi ikki narsani ta'kidlaydi: problem details'da stack dump kabi implementatsiya ichki tafsilotlarini oshkor qilmang va problem'ga qo'shiladigan har qanday ma'lumotni sinchiklab tekshiring, chunki u tizim haqida ma'lumot berishi, kirish imkonini ochishi yoki foydalanuvchi maxfiyligini buzishi mumkin. Amalda: 500 javobida umumiy `title` va `instance`, to'liq xato esa server logida, xuddi shu `instance` bilan (88-dars).

## Chuqurroq: DTO va validatsiya NestJS'da

NestJS'da kirish DTO'si class-validator dekoratorlari bilan klass sifatida yoziladi va `ValidationPipe` tomonidan tekshiriladi. Hujjatdagi muhim opsiyalar:

- **`whitelist: true`** - validatsiya dekoratori bo'lmagan xususiyatlarni olib tashlaydi.
- **`forbidNonWhitelisted: true`** - `whitelist` bilan birga ishlatiladi: olib tashlash o'rniga so'rovni rad etadi. Mass assignment hujumlariga qarshi foydali (masalan, klient `role: "admin"` yuborsa).
- **`transform: true`** - oddiy obyektlarni DTO klass nusxalariga aylantiradi va route parametrlarini e'lon qilingan tipga o'tkazadi.
- **`disableErrorMessages: true`** - xato tafsilotlarini javobdan olib tashlaydi.

`app.useGlobalPipes(new ValidationPipe({...}))` bilan global o'rnatiladi.

Muqobil: zod sxemalari va custom pipe. Bu holda sxema tip manbai bo'ladi (`z.infer`) va klass yozish shart emas. Ikkalasi ham to'g'ri, muhimi - butun loyihada bitta yondashuv (18-dars).

### Request va response DTO'larini ajrating

`CreateOrderRequest` va `OrderResponse` - turli narsalar. Ularni bitta `OrderDto` klassi bilan qoplash (ba'zi maydonlarini `optional` qilib) ikkala shartnomani ham noaniq qiladi: klient `id`ni yuborishi kerakmi? `createdAt`ni-chi? Har bir yo'nalish uchun alohida, aniq tip.

### Nomlash qoidalari

- Resurs - ko'plikdagi ot: `/vehicles`, `/vehicles/:id/trips`. Fe'llar (`/getVehicles`, `/createOrder`) HTTP metodini takrorlaydi.
- Haqiqiy amallar uchun (CRUD'ga sig'maydigan) resurs ostida ot-amal: `POST /trips/:id/cancellation` yoki `POST /trips/:id/cancel`. Ikkinchisi ham keng tarqalgan; jamoada bittasini tanlang.
- Maydon uslubi bitta (JS ekotizimida odatda camelCase). Birliklar nomda: `amountUzs`, `distanceKm`, `durationSeconds`. Vaqt ISO 8601 satri, UTC.
- Enum qiymatlari barqaror satrlar (`"on_trip"`), raqamlar (`status: 3`) emas.

## Misol: xato javoblari

Yomon variant:

```ts
import { Controller, Get, HttpException, Param } from "@nestjs/common";
import { VehicleService } from "./vehicle.service";

@Controller("api")
export class VehicleController {
  constructor(private readonly vehicles: VehicleService) {}

  @Get("getVehicle/:id")
  async get(@Param("id") id: string) {
    const v = await this.vehicles.find(id);
    if (!v) throw new HttpException({ err: "not found", vehicle: id }, 404);
    if (v.blocked) throw new HttpException("Vehicle blocked by admin " + v.blockedBy, 403);
    return v;
  }
}
```

Uchta muammo: route fe'l bilan, xatolar ikki xil shaklda (obyekt va satr), va `blockedBy` (admin ismi) kabi ichki ma'lumot klientga oqadi. Bundan tashqari, entity to'g'ridan-to'g'ri qaytariladi.

Yaxshi variant:

```ts
import { Controller, Get, Param, ParseUUIDPipe } from "@nestjs/common";
import { ProblemException } from "../http/problem";
import { VehicleService } from "./vehicle.service";

export type VehicleResponse = {
  id: string;
  plateNumber: string;
  status: "available" | "on_trip" | "maintenance";
  lastSeenAt: string | null;
};

@Controller("vehicles")
export class VehicleController {
  constructor(private readonly vehicles: VehicleService) {}

  @Get(":id")
  async get(@Param("id", ParseUUIDPipe) id: string): Promise<VehicleResponse> {
    const v = await this.vehicles.find(id);
    if (!v) {
      throw new ProblemException({
        type: "about:blank",
        title: "Not Found",
        status: 404,
        detail: "Bunday mashina topilmadi.",
      });
    }
    if (v.blocked) {
      throw new ProblemException({
        type: "https://api.fleet.uz/problems/vehicle-blocked",
        title: "Vehicle is blocked",
        status: 403,
        detail: "Mashina administrator tomonidan bloklangan. Kompaniya admini bilan bog'laning.",
        vehicleId: v.id,
      });
    }
    return {
      id: v.id,
      plateNumber: v.plateNumber,
      status: v.status,
      lastSeenAt: v.lastSeenAt?.toISOString() ?? null,
    };
  }
}
```

Javob:

```ts
const example = {
  type: "https://api.fleet.uz/problems/vehicle-blocked",
  title: "Vehicle is blocked",
  status: 403,
  detail: "Mashina administrator tomonidan bloklangan. Kompaniya admini bilan bog'laning.",
  instance: "urn:request:7f3c2a1e-4d5b-4c3a-9f2e-1b6d8e0a4c21",
  vehicleId: "8b1f0d2e-6a3c-4f7e-9d21-0c5b7a8e3f14",
} as const;
```

Nima o'zgardi:

- **Bitta format.** Klient bitta parse qiluvchi yozadi: `type` bo'yicha `switch`, noma'lum turda `status` bo'yicha umumiy xatti-harakat.
- **Oddiy holatlar uchun `about:blank`.** 404 uchun maxsus tur kerak emas, standart status nomi yetarli.
- **Ichki ma'lumot yo'q.** Kim bloklagani klientga kerak emas, u faqat nima qilish kerakligini biladi.
- **Shartnoma tiplangan.** `VehicleResponse` API hujjati vazifasini bajaradi va OpenAPI generatsiyasi uchun asos.

## Qachon qo'llamaslik kerak

- **Ichki, bitta iste'molchili API.** Agar backend va frontend bitta jamoada, bitta monorepo'da va birga deploy qilinsa (masalan, Next.js server action'lari yoki tRPC), har bir endpoint uchun alohida request/response DTO va `type` URI hujjatlari ortiqcha bo'lishi mumkin. Umumiy tiplar va inferensiya ko'pincha yetarli. Lekin validatsiya baribir kerak: kirish baribir ishonchsiz.
- **Har bir xato uchun alohida `type`.** 40 ta deyarli bir xil problem turi klient uchun 40 ta holat degani. Faqat klient boshqacha harakat qiladigan holatlar uchun alohida tur yarating, qolganlari uchun `about:blank` va status.
- **Mavjud ommaviy API'ni "tozalash".** Tashqi integratorlar ishlatayotgan API'da maydon nomlarini yoki xato formatini birdaniga o'zgartirish - buzuvchi o'zgarish. Parallel change (expand, migrate, contract) yoki versiyalash kerak (80-dars). Toza nomlar mijozlar ishonchidan qimmat emas.
- **Response DTO uchun qo'lda mapping hamma joyda.** Agar entity va javob deyarli bir xil va ichki maydonlar yo'q bo'lsa, `Pick<>` yoki serializer bilan cheklash yetarli bo'lishi mumkin. Asosiy maqsad - ichki model va shartnomani ongli ravishda ajratish, mapping kodining o'zi emas.
- **GraphQL va gRPC.** Ularning o'z xato modellari bor. RFC 9457 HTTP API'lar uchun, uni boshqa protokolga sun'iy majburlash shart emas.

## Stack'da: NestJS va Next.js

- **Global pipe va filter.** `main.ts`da `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))` va `app.useGlobalFilters(new ProblemDetailsFilter())`. Shunda har bir controller bir xil shartnomaga bo'ysunadi (48-dars).
- **Validatsiya xatolarini problem'ga aylantirish.** `ValidationPipe` default'da `BadRequestException` otadi va uning javobida `message` xatolar massivi bo'ladi. Filter uni `errors` extension a'zosiga ko'chiradi.
- **`@Res()`dan qoching.** Express javob obyektini qo'lda boshqarish interceptor va filter'larni chetlab o'tadi. Controller qiymat qaytarsin yoki xato otsin.
- **OpenAPI.** `@nestjs/swagger` DTO'lardan sxema generatsiya qiladi. Response DTO alohida bo'lsa, hujjat haqiqiy shartnomani ko'rsatadi.
- **Next.js Route Handlers.** `return Response.json(problem, { status: 422, headers: { "content-type": "application/problem+json" } })` - xuddi shu format frontend tomonidagi API'larda ham.

## Xulosa

- API - interfeys. U ochiq shartnoma, izchil nomlar va ichki tuzilmani yashirish bilan toza bo'ladi.
- Kirish DTO'si runtime'da validatsiya qilinadi: `ValidationPipe` `whitelist` va `forbidNonWhitelisted` bilan kutilmagan maydonlarni rad etadi.
- Response DTO ichki model va tashqi shartnoma orasidagi chegara: baza o'zgarishi API o'zgarishi emas.
- Xatolar uchun RFC 9457: `type` asosiy identifikator, `title` tur tavsifi, `detail` faqat inson uchun, `instance` holat identifikatori, dasturiy ma'lumot esa extension a'zolarda.
- Xato javobida ichki tafsilot yo'q: klientga request id, tafsilot server logiga.
