---
n: 48
slug: xatolar-arxitekturasi
title: "Node/NestJS'da xatolar arxitekturasi"
summary: "Xatolar tizimda qayerda tug'iladi, qayerda tarjima qilinadi va qayerda javobga aylanadi? Darsda operational va programmer xatolarini farqlashni, domen xatolarini HTTP'dan ajratishni, NestJS exception filter bilan ularni bitta joyda RFC 9457 Problem Details formatiga aylantirishni va process darajasidagi xatolar bilan ishlashni ko'ramiz."
duration: 45
sources:
  - id: nestjs-exception-filters
    note: "Built-in global exception layer, HttpException va options.cause, @Catch, ArgumentsHost, APP_FILTER, HttpAdapterHost bilan catch-everything filter"
  - id: rfc-9457
    note: "application/problem+json, type/status/title/detail/instance a'zolari, about:blank, extension a'zolari va xavfsizlik bo'yicha tavsiyalar"
  - id: cc1
    note: "\"Error Handling\" bobi: xatolarni qayta ishlashni asosiy mantiqdan ajratish g'oyasi"
quiz:
  - q: "NestJS'ning built-in global exception layer'i `HttpException` bo'lmagan (masalan, oddiy `Error`) xatoni qanday qayta ishlaydi?"
    options:
      - "Xato xabarini va stack'ni mijozga qaytaradi"
      - "Process'ni to'xtatadi"
      - "`{ \"statusCode\": 500, \"message\": \"Internal server error\" }` javobini qaytaradi"
      - "404 qaytaradi"
    answer: 2
    explain: "Hujjatga ko'ra, tanilmagan xatolar uchun standart filter umumiy 500 javobini beradi. Bu xavfsiz standart, lekin domen xatolari (masalan, \"mablag' yetarli emas\") ham 500 bo'lib ketadi, agar ularni o'zingiz tarjima qilmasangiz."
  - q: "Operational va programmer xatolari farqiga ko'ra, qaysi biri programmer xatosi?"
    options:
      - "To'lov provayderi 503 qaytardi"
      - "DB bilan ulanish uzildi"
      - "Foydalanuvchi noto'g'ri formatdagi telefon yubordi"
      - "`undefined` ning maydoniga murojaat qilindi (TypeError)"
    answer: 3
    explain: "Operational xatolar to'g'ri yozilgan dasturda ham tashqi sharoit tufayli yuz beradi va ularni oldindan rejalashtirib qayta ishlash mumkin. TypeError - kodning o'zidagi bug: uni \"qayta ishlash\" mumkin emas, faqat tuzatish kerak."
  - q: "RFC 9457 bo'yicha `type` a'zosi berilmasa, uning qiymati nima deb hisoblanadi?"
    options:
      - "`about:blank`, ya'ni muammo HTTP status kodidan boshqa ma'noga ega emas"
      - "Bo'sh satr"
      - "Endpoint URL'i"
      - "null"
    answer: 0
    explain: "`about:blank` standart qiymat. Bunda `title` HTTP status iborasiga mos bo'lishi kerak. Domen xatolari uchun o'z `type` URI'laringizni bering, shunda mijoz ularni barqaror identifikator sifatida ishlatadi."
  - q: "Nima uchun domen xatolarini (masalan, `InsufficientBalanceError`) `HttpException`dan meros oldirmaslik tavsiya etiladi?"
    options:
      - "Chunki HttpException sekin"
      - "Chunki domen qatlami HTTP transportiga bog'lanib qoladi; xuddi shu servis navbat consumer'i yoki cron'da ishlatilganda HTTP status ma'nosiz bo'ladi"
      - "Chunki NestJS buni taqiqlaydi"
      - "Chunki HttpException'ni test qilib bo'lmaydi"
    answer: 1
    explain: "Bu dependency yo'nalishi masalasi (81-dars). Domen xatosi \"nima bo'ldi\" deydi, uni HTTP 402 yoki 409 ga aylantirish esa transport qatlamining (filter) vazifasi."
  - q: "RFC 9457 xavfsizlik bo'yicha nima tavsiya qiladi?"
    options:
      - "Stack trace'ni har doim `detail`da berish"
      - "Faqat XML formatini ishlatish"
      - "Problem details ichki tafsilotlarni (masalan, stack trace) ochmasligi kerak, chunki ular server, ma'lumotlar yoki foydalanuvchilar haqida sezgir ma'lumot oshkor qilishi mumkin"
      - "`status` a'zosini HTTP status'dan farqli qilish"
    answer: 2
    explain: "Spetsifikatsiya ichki tafsilotlarni oshkor qilish xavfini ochiq aytadi. Stack va cause loglarga ketadi, mijozga esa `type`, `title`, `detail` va xavfsiz extension'lar."
  - q: "Exception filter'ni global ro'yxatdan o'tkazishning qaysi usuli unga dependency injection (masalan, Logger) beradi?"
    options:
      - "`app.useGlobalFilters(new MyFilter())`"
      - "Modul `providers`ida `{ provide: APP_FILTER, useClass: MyFilter }`"
      - "Har bir controller'ga `@UseFilters(new MyFilter())`"
      - "`process.on('uncaughtException')`"
    answer: 1
    explain: "Hujjatga ko'ra, `useGlobalFilters` modul kontekstidan tashqarida ro'yxatdan o'tkazadi va DI bermaydi. `APP_FILTER` provider'i esa filter'ni modul ichida yaratadi, shuning uchun uning konstruktoriga servislar kiritiladi."
task:
  title: "Domen xatolarini Problem Details'ga aylantiruvchi filter"
  prompt: |
    Quyidagi NestJS servisida domen xatolari to'g'ridan-to'g'ri `HttpException` sifatida tashlanadi, controller esa har bir metodda try/catch bilan javob shaklini yasaydi. Javob formati endpoint'dan endpoint'ga farq qiladi.

    1. Domen xatolarini HTTP'dan mustaqil qiling (`DomainError` ierarxiyasi, `code` bilan).
    2. Bitta global exception filter yozing: domen xatolarini RFC 9457 formatidagi javobga aylantirsin, `HttpException`larni ham shu formatga keltirsin, tanilmagan xatolar uchun 500 va umumiy matn qaytarsin va ularni to'liq loglasin.
    3. Controller'dan try/catch'larni olib tashlang.
    4. Filter'ni DI bilan ro'yxatdan o'tkazing.
  lang: ts
  starter: |
    import {
      Controller, Post, Param, Body, Injectable,
      HttpException, HttpStatus, NotFoundException,
    } from "@nestjs/common";

    @Injectable()
    export class RentalService {
      async start(vehicleId: string, customerId: string): Promise<{ id: string }> {
        const vehicle = await this.findVehicle(vehicleId);
        if (!vehicle) throw new NotFoundException("vehicle not found");
        if (vehicle.rented) {
          throw new HttpException({ error: "already rented" }, HttpStatus.CONFLICT);
        }
        return { id: `${vehicleId}:${customerId}` };
      }
      private async findVehicle(id: string): Promise<{ rented: boolean } | null> {
        return id ? { rented: false } : null;
      }
    }

    @Controller("vehicles")
    export class RentalController {
      constructor(private readonly rentals: RentalService) {}

      @Post(":id/rentals")
      async start(@Param("id") id: string, @Body() body: { customerId: string }) {
        try {
          return await this.rentals.start(id, body.customerId);
        } catch (e) {
          if (e instanceof HttpException) throw e;
          return { ok: false, message: String(e) }; // 201 bilan qaytadi
        }
      }
    }
  solution: |
    import {
      ArgumentsHost, Catch, Controller, ExceptionFilter, HttpException,
      HttpStatus, Injectable, Logger, Module, Param, Post, Body,
    } from "@nestjs/common";
    import { APP_FILTER, HttpAdapterHost } from "@nestjs/core";

    // domain/errors.ts - HTTP haqida hech narsa bilmaydi
    export abstract class DomainError extends Error {
      abstract readonly code: string;
      constructor(message: string, readonly context: Record<string, string> = {}) {
        super(message);
        this.name = new.target.name;
      }
    }
    export class VehicleNotFoundError extends DomainError {
      readonly code = "vehicle-not-found";
      constructor(vehicleId: string) {
        super(`Transport topilmadi: ${vehicleId}`, { vehicleId });
      }
    }
    export class VehicleAlreadyRentedError extends DomainError {
      readonly code = "vehicle-already-rented";
      constructor(vehicleId: string) {
        super(`Transport allaqachon ijarada: ${vehicleId}`, { vehicleId });
      }
    }

    // http/problem-details.filter.ts - tarjima faqat shu yerda
    const PROBLEM_BASE = "https://api.example.uz/problems/";

    const STATUS_BY_CODE: Record<string, number> = {
      "vehicle-not-found": HttpStatus.NOT_FOUND,
      "vehicle-already-rented": HttpStatus.CONFLICT,
    };

    type Problem = {
      type: string;
      title: string;
      status: number;
      detail?: string;
      instance?: string;
      code?: string;
      [extension: string]: unknown;
    };

    @Catch()
    export class ProblemDetailsFilter implements ExceptionFilter {
      private readonly logger = new Logger(ProblemDetailsFilter.name);

      constructor(private readonly adapterHost: HttpAdapterHost) {}

      catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.adapterHost;
        const ctx = host.switchToHttp();
        const instance = String(httpAdapter.getRequestUrl(ctx.getRequest()));
        const problem = this.toProblem(exception, instance);

        if (problem.status >= 500) {
          this.logger.error(`Kutilmagan xato: ${instance}`, exception instanceof Error ? exception.stack : String(exception));
        }

        const response = ctx.getResponse();
        httpAdapter.setHeader(response, "Content-Type", "application/problem+json");
        httpAdapter.reply(response, problem, problem.status);
      }

      private toProblem(exception: unknown, instance: string): Problem {
        if (exception instanceof DomainError) {
          const status = STATUS_BY_CODE[exception.code] ?? HttpStatus.UNPROCESSABLE_ENTITY;
          return {
            type: PROBLEM_BASE + exception.code,
            title: exception.name,
            status,
            detail: exception.message,
            instance,
            code: exception.code,
            ...exception.context,
          };
        }
        if (exception instanceof HttpException) {
          return { type: "about:blank", title: exception.message, status: exception.getStatus(), instance };
        }
        return {
          type: "about:blank",
          title: "Internal Server Error",
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          instance,
        };
      }
    }

    @Injectable()
    export class RentalService {
      async start(vehicleId: string, customerId: string): Promise<{ id: string }> {
        const vehicle = await this.findVehicle(vehicleId);
        if (!vehicle) throw new VehicleNotFoundError(vehicleId);
        if (vehicle.rented) throw new VehicleAlreadyRentedError(vehicleId);
        return { id: `${vehicleId}:${customerId}` };
      }
      private async findVehicle(id: string): Promise<{ rented: boolean } | null> {
        return id ? { rented: false } : null;
      }
    }

    @Controller("vehicles")
    export class RentalController {
      constructor(private readonly rentals: RentalService) {}

      @Post(":id/rentals")
      start(@Param("id") id: string, @Body() body: { customerId: string }) {
        return this.rentals.start(id, body.customerId);
      }
    }

    @Module({
      controllers: [RentalController],
      providers: [RentalService, { provide: APP_FILTER, useClass: ProblemDetailsFilter }],
    })
    export class RentalModule {}
  solutionNotes: |
    - Domen xatolari endi HTTP'ni bilmaydi. Xuddi shu `RentalService` navbat consumer'ida ishlatilsa ham xatolar ma'noli.
    - Domen kodi -> HTTP status xaritasi bitta joyda (`STATUS_BY_CODE`). Yangi domen xatosi qo'shilganda faqat shu jadval yangilanadi; xaritada yo'q domen xatosi 422 bo'ladi, 500 emas.
    - Javob RFC 9457 shaklida: `type` (barqaror URI), `title`, `status`, `detail`, `instance`, va extension a'zolar sifatida `code` hamda kontekst.
    - Tanilmagan xatolar (programmer xatolari) uchun mijozga faqat umumiy 500, to'liq stack esa logga. Ichki tafsilotlar oshkor bo'lmaydi.
    - `HttpAdapterHost` orqali javob berilgani uchun filter Express va Fastify'da bir xil ishlaydi.
    - `APP_FILTER` filter'ga DI beradi. Controller'dagi try/catch va 201 bilan qaytgan "xato" javobi yo'qoldi.
  checklist:
    - "Domen xatolari HttpException'dan meros olmaydi"
    - "HTTP status tanlash faqat filter'da"
    - "Javob formati barcha endpoint'larda bir xil va RFC 9457'ga mos"
    - "Kutilmagan xatoda mijozga ichki tafsilot chiqmaydi, lekin to'liq logga yoziladi"
    - "Controller'da try/catch qolmadi"
    - "Filter DI bilan ro'yxatdan o'tgan"
---

## Muammo

O'rtacha NestJS loyihasida xatolar shunday ko'rinadi:

- Servislarda `throw new NotFoundException(...)`, `throw new BadRequestException(...)`, ba'zan `throw new Error(...)`, ba'zan `return { success: false }`.
- Controller'larda har xil try/catch: ba'zilari xatoni qayta tashlaydi, ba'zilari `{ ok: false, message }` ni 200 bilan qaytaradi.
- API javoblari: bir endpoint `{ statusCode, message }`, boshqasi `{ error: { code, text } }`, uchinchisi `{ errors: [...] }`.
- Cron job'da xuddi shu servis `NotFoundException` tashlaydi - HTTP so'rovi yo'q joyda HTTP xatosi.
- DB ulanishi uzilganda ba'zi endpoint'lar 500, ba'zilari 400 qaytaradi, chunki kimdir `catch (e) { throw new BadRequestException(e.message) }` yozgan va Postgres xato matni mijozga chiqadi.

Mobil ilova jamoasi har bir endpoint uchun alohida xato parser yozadi. Monitoring "500 xatolar soni" metrikasiga ishonmaydi, chunki biznes xatolari ham 500 bo'lib ketadi.

Muammo alohida `throw` larda emas. Muammo shundaki, xatolar uchun **arxitektura** yo'q: ular qayerda tug'ilishi, qayerda tarjima qilinishi va qayerda javobga aylanishi haqida kelishuv yo'q.

## Asosiy g'oya

Martin *Clean Code*da xatolarni qayta ishlash muhim, lekin u asosiy mantiqni yashirib qo'ysa, bu noto'g'ri, degan fikrni ilgari suradi. Arxitektura darajasida bu shunday tarjima qilinadi: **xato tug'iladigan joy, tarjima qilinadigan joy va javobga aylanadigan joy ajratilgan bo'lsin.**

Uch qatlamli model:

1. **Domen va servislar** "nima bo'ldi" deydi: `VehicleAlreadyRentedError`, `InsufficientBalanceError`. Ular HTTP, gRPC yoki navbat haqida bilmaydi.
2. **Infratuzilma adapterlari** (repository, SDK o'ramlari) tashqi xatolarni ichki tilga tarjima qiladi: Postgres `unique_violation` -> `DuplicatePlateError`, provayderning 503 javobi -> `PaymentProviderUnavailableError` (50-dars).
3. **Transport chegarasi** (NestJS exception filter) ichki xatolarni protokolga aylantiradi: HTTP status, javob formati, loglash.

Bu modelda controller va servislarda xatolar uchun deyarli try/catch yo'q. Ular faqat throw qiladi yoki xatoni o'tkazib yuboradi.

### Operational va programmer xatolari

Node.js hamjamiyatida keng tarqalgan (xususan, Joyent'ning eski xatolar qo'llanmasi orqali mashhur bo'lgan) tasnif bu arxitekturaga asos bo'ladi:

- **Operational xatolar** to'g'ri yozilgan dasturda ham tashqi sharoit tufayli yuz beradi: tarmoq uzildi, provayder 503 qaytardi, foydalanuvchi noto'g'ri ma'lumot yubordi, yozuv topilmadi, mablag' yetmadi. Ular kutiladi va ularni rejalashtirib qayta ishlash mumkin: qayta urinish, foydalanuvchiga xabar, muqobil yo'l.
- **Programmer xatolari** - kodning o'zidagi bug: `undefined`ning maydoniga murojaat, noto'g'ri argument tipi, buzilgan invariant. Ularni runtime'da "qayta ishlash" mumkin emas, faqat tuzatish kerak. Eng yaxshi reaksiya - to'liq loglash, mijozga umumiy 500, va jiddiy holatlarda process'ni qayta ishga tushirish.

Bu farq filter dizaynini belgilaydi: domen va ma'lum operational xatolar aniq status va ma'noli javobga aylanadi, qolgan hammasi programmer xatosi deb qabul qilinadi va 500 bo'ladi.

## Chuqurroq: NestJS va RFC 9457

### NestJS exception layer

NestJS hujjatlariga ko'ra, framework'da o'rnatilgan global exception filter bor. U `HttpException` va uning subklasslarini taniydi va ularni mos javobga aylantiradi. Tanilmagan har qanday xato uchun u `{"statusCode": 500, "message": "Internal server error"}` javobini qaytaradi. Bu xavfsiz standart, lekin u domen xatolarini bilmaydi.

`HttpException` konstruktori `(response, status, options?)` qabul qiladi. `response` satr bo'lsa faqat `message` almashtiriladi, obyekt bo'lsa butun javob tanasi. `options.cause` hujjatga ko'ra faqat loglash uchun va javobga serializatsiya qilinmaydi. Hujjatda yana bir muhim eslatma bor: built-in HTTP exception'lar standart holatda loglanmaydi, ularni loglash uchun custom filter kerak.

Custom filter `ExceptionFilter` interfeysini implementatsiya qiladi va `@Catch()` dekoratori bilan qaysi xatolarni ushlashini e'lon qiladi. Bo'sh `@Catch()` hamma narsani ushlaydi. `catch(exception, host)` metodida `host.switchToHttp()` orqali request va response olinadi.

Ro'yxatdan o'tkazish usullari:

- `@UseFilters(MyFilter)` - controller yoki metod darajasida. Instansiya emas, klassni berish afzal, chunki Nest uni qayta ishlatadi va DI beradi.
- `app.useGlobalFilters(new MyFilter())` - global, lekin DI'siz.
- `{ provide: APP_FILTER, useClass: MyFilter }` - global va DI bilan. Odatda shu tanlov.

Hujjatdagi yana ikki muhim nuqta: middleware'da tashlangan xatolar faqat global filter'larga yetib boradi; `HttpAdapterHost` orqali javob berish filter'ni Express va Fastify'dan mustaqil qiladi.

### RFC 9457: Problem Details

RFC 9457 (2023, RFC 7807 o'rnini egallagan) HTTP API xatolari uchun standart format beradi, shunda har bir API o'z formatini o'ylab topmaydi. Media type - `application/problem+json`. Standart a'zolar:

- **`type`** - muammo turini aniqlaydigan URI. Berilmasa `about:blank` deb hisoblanadi, ya'ni muammo HTTP status kodidan boshqa ma'noga ega emas.
- **`status`** - HTTP status kodi, qulaylik uchun. U maslahat xarakterida, va javobning haqiqiy status kodi bilan bir xil bo'lishi kerak.
- **`title`** - muammo turining qisqa, odam o'qiydigan xulosasi. U bir turdagi muammolar uchun o'zgarmasligi kerak (lokalizatsiyadan tashqari).
- **`detail`** - aynan shu holatning izohi, mijozga muammoni tuzatishga yordam berish uchun. Mijozlar undan ma'lumot parse qilmasligi kerak.
- **`instance`** - aynan shu holatni aniqlaydigan URI.

Muammo turlari o'z **extension a'zolarini** qo'shishi mumkin (masalan, joriy balans yoki validatsiya xatolari ro'yxati), mijozlar esa tanimagan extension'larni e'tiborsiz qoldirishi kerak. Xavfsizlik bo'limida spetsifikatsiya ogohlantiradi: problem details stack trace kabi ichki tafsilotlarni ochmasligi kerak, chunki ular server, ma'lumotlar yoki foydalanuvchilar haqida sezgir ma'lumot oshkor qilishi mumkin.

Bu format `code` va `type` ni ajratish imkonini ham beradi: `type` - hujjatlashtiriladigan URI, ichki `code` esa uning oxirgi qismi yoki extension a'zo.

## Misol: to'lov xatolari zanjiri

Butun zanjirni ko'raylik. Domen xatosi:

```ts run
export abstract class DomainError extends Error {
  abstract readonly code: string;
  constructor(message: string, readonly context: Record<string, string | number> = {}) {
    super(message);
    this.name = new.target.name;
  }
}

export class InsufficientBalanceError extends DomainError {
  readonly code = "insufficient-balance";
  constructor(walletId: string, requested: number, available: number) {
    super(`Hamyonda mablag' yetarli emas`, { walletId, requested, available });
  }
}

// Sinab ko'ring: xato obyektida filtr uchun nimalar bor?
const error = new InsufficientBalanceError("wallet_42", 350_000, 120_000);
console.log(error instanceof DomainError, error.name, error.code);
console.log(error.message, JSON.stringify(error.context));
```

Filter (asosiy qismi):

```ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

const STATUS: Record<string, number> = {
  "insufficient-balance": 402,
  "vehicle-not-found": 404,
  "vehicle-already-rented": 409,
};

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger("Errors");
  constructor(private readonly adapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.adapterHost;
    const ctx = host.switchToHttp();
    const instance = String(httpAdapter.getRequestUrl(ctx.getRequest()));

    let body: Record<string, unknown>;
    if (exception instanceof DomainError) {
      body = {
        type: `https://api.example.uz/problems/${exception.code}`,
        title: exception.name,
        status: STATUS[exception.code] ?? 422,
        detail: exception.message,
        instance,
        ...exception.context,
      };
    } else if (exception instanceof HttpException) {
      body = { type: "about:blank", title: exception.message, status: exception.getStatus(), instance };
    } else {
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
      body = { type: "about:blank", title: "Internal Server Error", status: 500, instance };
    }

    const res = ctx.getResponse();
    httpAdapter.setHeader(res, "Content-Type", "application/problem+json");
    httpAdapter.reply(res, body, Number(body.status));
  }
}
```

Mijoz oladigan javob:

```json
{
  "type": "https://api.example.uz/problems/insufficient-balance",
  "title": "InsufficientBalanceError",
  "status": 402,
  "detail": "Hamyonda mablag' yetarli emas",
  "instance": "/wallets/w_42/charges",
  "walletId": "w_42",
  "requested": 150000,
  "available": 90000
}
```

Nima o'zgardi va nega:

- **Bitta tarjima nuqtasi.** HTTP status va javob formati faqat filter'da. Servislar faqat domen tilida gapiradi.
- **Mijoz uchun barqaror shartnoma.** Mobil ilova `type` bo'yicha qaror qiladi, `detail` matni esa erkin o'zgarishi mumkin.
- **Programmer xatolari yashirin, lekin yo'qolmagan.** Mijoz umumiy 500 oladi, stack esa logga tushadi.
- **Monitoring halol.** 5xx metrikasi endi faqat haqiqiy nosozliklarni ko'rsatadi, biznes rad etishlari 4xx'da.

### Process darajasidagi xatolar

Filter faqat so'rov kontekstida tashlangan xatolarni ushlaydi. So'rovdan tashqari xatolar - `setTimeout` ichidagi throw, await qilinmagan Promise, event emitter'dagi `error` - process darajasiga chiqadi. Zamonaviy Node.js versiyalarida ushlanmagan Promise rejection standart holatda process'ni to'xtatadi. Odatiy siyosat:

- `process.on("unhandledRejection")` va `process.on("uncaughtException")` da xatoni to'liq loglang va process'ni to'xtating. Holat noma'lum bo'lgan process'ni davom ettirish xavfli: u yarim yozilgan ma'lumot bilan ishlashda davom etishi mumkin.
- Process'ni qayta ishga tushirishni orkestrator (Kubernetes, PM2, systemd) bajarsin.
- NestJS'da `app.enableShutdownHooks()` bilan ulanishlarni toza yoping.

## Qachon qo'llamaslik kerak

- **Kichik ichki servis yoki prototip.** Bitta ichki iste'molchisi bo'lgan servis uchun to'liq Problem Details va domen xatolari ierarxiyasi ortiqcha bo'lishi mumkin. NestJS'ning built-in `HttpException`lari yetarli. Lekin bunda ham domen xatolarini ochiq API'ga chiqarishdan oldin tarjima qatlamini qo'shish arzon.
- **HttpException'ni butunlay taqiqlamang.** Controller darajasidagi xatolar (masalan, noto'g'ri query parametri, autentifikatsiya) tabiiy ravishda HTTP xatolari. Ularni domen xatosiga aylantirish keraksiz bilvositalik.
- **Har bir xatoni 500 deb loglash shovqin.** 404 va 409 kabi kutilgan xatolarni `error` darajasida loglash alert'larni ma'nosiz qiladi. Ularni `info` yoki `warn` darajasida yoki umuman loglamang (88-dars).
- **Problem Details har doim ham standart emas.** GraphQL, gRPC yoki WebSocket'da boshqa xato konvensiyalari bor. RFC 9457 - HTTP API'lar uchun.
- **Ichki tafsilotlarni `detail`ga qo'ymang.** Bu RFC talabi ham, oddiy xavfsizlik ham. Xato xabarini to'g'ridan-to'g'ri `detail`ga qo'yishdan oldin u foydalanuvchi uchun yozilganiga ishonch hosil qiling.

## Stack'da: qo'shimcha amaliy eslatmalar

- **ValidationPipe xatolari.** NestJS `ValidationPipe` standart holatda `BadRequestException` tashlaydi. `exceptionFactory` orqali ularni o'z `ValidationError`ingizga aylantiring va filter'da `errors` extension a'zosi bilan Problem Details qaytaring.
- **Prisma xatolari.** `P2002` (unique) va `P2025` (topilmadi) ni repository'da domen xatolariga aylantiring. Ular filter'gacha xom holda yetib bormasin.
- **Navbat consumer'lari va cron.** Ular HTTP filter'dan foydalanmaydi. Xuddi shu domen xatolarini ular o'z siyosati bilan qayta ishlaydi: operational xato - retry yoki dead letter, programmer xatosi - alert. Domen xatolari HTTP'dan mustaqil bo'lgani uchun bu oson.
- **Correlation ID.** `instance`ga yoki extension a'zoga so'rov ID'sini qo'shing, shunda mijoz xabar bergan xatoni loglardan topish mumkin.
- **Next.js route handler'lar.** Xuddi shu g'oya: bitta `toProblemResponse(error)` yordamchisi va har bir handler'da faqat throw.

## Xulosa

- Xatolar uchun arxitektura kerak: tug'iladigan joy (domen), tarjima joyi (adapterlar) va javob joyi (filter) ajratilsin.
- Operational xatolar kutiladi va rejalashtirib qayta ishlanadi, programmer xatolari esa loglanadi va tuzatiladi.
- Domen xatolari HTTP'ni bilmasin. HTTP status tanlash faqat exception filter'da.
- NestJS'da global filter'ni `APP_FILTER` bilan ro'yxatdan o'tkazing va `HttpAdapterHost` orqali javob bering.
- Javob formati uchun RFC 9457 Problem Details: barqaror `type`, `title`, `status`, `detail`, `instance` va extension'lar. Ichki tafsilotlar mijozga chiqmasin.
