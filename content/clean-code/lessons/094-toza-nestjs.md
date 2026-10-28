---
n: 94
slug: toza-nestjs
title: "Toza NestJS: controller, service, DTO"
summary: "NestJS tuzilma beradi, lekin tozalikni kafolatlamaydi. Bu darsda controller'ni yupqa, service'ni domen tilida, DTO'ni HTTP chegarasidagi shartnoma sifatida yozishni, ValidationPipe'ni to'g'ri sozlashni va modullarni chegaralar sifatida ishlatishni ko'ramiz."
duration: 40
sources:
  - id: nestjs-docs
    note: "Controllers (DTO uchun klass afzalligi, @Res() va passthrough), Validation (ValidationPipe: whitelist, forbidNonWhitelisted, transform; mapped types), Modules (inkapsulyatsiya, exports, @Global'dan ehtiyot bo'lish)"
  - id: nestjs-providers
    note: "Provider'lar va dependency injection: service'ni constructor orqali kiritish, custom provider va token'lar"
  - id: clean-arch
    note: "Freymvorkni detal sifatida ko'rish va biznes qoidalarini delivery mexanizmidan ajratish g'oyasi"
quiz:
  - q: "Global ValidationPipe `whitelist: true` bilan sozlangan. Klient DTO'da yo'q `isAdmin: true` maydonini yubordi. Nima bo'ladi?"
    options:
      - "So'rov 400 xato bilan rad etiladi"
      - "Maydon validatsiya qilingan obyektdan olib tashlanadi va handler uni ko'rmaydi"
      - "Maydon o'zgarishsiz handler'ga yetib boradi"
      - "Nest server xatosi (500) qaytaradi"
    answer: 1
    explain: "whitelist dekoratorsiz xususiyatlarni olib tashlaydi. Rad etish uchun qo'shimcha forbidNonWhitelisted: true kerak. Whitelist'siz esa isAdmin service'ga yetib borib, mass assignment zaifligini keltirib chiqarishi mumkin."
  - q: "Nima uchun NestJS hujjati DTO'ni interface emas, klass sifatida yozishni tavsiya qiladi?"
    options:
      - "Klasslar tezroq ishlaydi"
      - "Interface'lar meros olishni qo'llab-quvvatlamaydi"
      - "Swagger faqat klasslarni tushunadi, boshqa sabab yo'q"
      - "Interface'lar transpilyatsiyada o'chadi, pipe'lar esa runtime'da metatip'ga muhtoj"
    answer: 3
    explain: "TypeScript interface va generic'lar uchun runtime metadata chiqarmaydi. ValidationPipe validatsiya uchun klassni runtime'da ko'rishi kerak. Shu sababli `import type` bilan DTO import qilish ham validatsiyani buzadi."
  - q: "Controller metodi ichida Prisma so'rovi, chegirma hisoblash, SMS yuborish va javobni formatlash bor. Birinchi refaktoring qadami qaysi?"
    options:
      - "Biznes mantiqni (chegirma, SMS qarori) service metodiga ko'chirish, controller'da faqat HTTP tarjimasini qoldirish"
      - "Har bir qadam uchun alohida Nest moduli ochish"
      - "Controller'ni ikki controller'ga bo'lish"
      - "Prisma'ni olib tashlab, raw SQL'ga o'tish"
    answer: 0
    explain: "Controller'ning vazifasi HTTP'ni domen chaqiruviga tarjima qilish. Biznes qoidasi service'da bo'lsa, uni queue consumer yoki CLI'dan ham chaqirish va HTTP'siz test qilish mumkin. Ko'p modul ochish yoki controller'ni bo'lish mantiqni ajratmaydi."
  - q: "Jamoa har bir yangi modulni @Global() qilishni taklif qildi, chunki importlarni yozish zerikarli. Nest hujjati nima deydi?"
    options:
      - "Bu tavsiya etilgan amaliyot"
      - "@Global faqat test muhitida ishlaydi"
      - "Hammasini global qilish yaxshi dizayn qarori emas: aniq imports modul API'sini nazoratli ochadi va keraksiz coupling'dan saqlaydi"
      - "@Global modullar har safar yangi instance yaratadi"
    answer: 2
    explain: "Hujjat ikki marta ogohlantiradi: hammasini global qilish tavsiya etilmaydi. Global modullar odatda bir marta, root yoki core modulda, config yoki DB ulanishi kabi umumiy infratuzilma uchun ro'yxatdan o'tadi."
  - q: "Service `throw new NotFoundException()` qiladi va shu service Kafka consumer'dan ham chaqiriladi. Bu qanday muammo?"
    options:
      - "Hech qanday muammo yo'q"
      - "Domen qatlami HTTP tushunchasiga bog'lanib qoldi: consumer uchun 404 ma'nosiz, xatoni domen xatosi qilib, HTTP'ga exception filter'da tarjima qilish toza"
      - "NotFoundException faqat controller'da ishlaydi va service'da kompilyatsiya bo'lmaydi"
      - "Kafka consumer exception'larni qo'llab-quvvatlamaydi"
    answer: 1
    explain: "HttpException service'da ishlaydi, lekin u biznes qoidasini transport protokoliga bog'laydi. Domen xatosi (VehicleNotFoundError) va exception filter yoki controller'dagi tarjima bu bog'liqlikni bitta joyga yig'adi (48-dars)."
  - q: "`@Res() res: Response` bilan `res.status(201).json(dto)` yozilgan handler'ning kamchiligi nima?"
    options:
      - "Kod Express'ga bog'lanadi, interceptor'lar va @HttpCode() ishlamaydi, testda response obyektini mock qilish kerak"
      - "Bu Fastify'da tezroq ishlaydi"
      - "Hech qanday kamchiligi yo'q"
      - "201 status kodini qaytarib bo'lmaydi"
    answer: 0
    explain: "Hujjatga ko'ra @Res() library-specific rejimga o'tkazadi: platformaga bog'liqlik, qiyinroq test va interceptor hamda @HttpCode/@Header bilan moslik yo'qoladi. Faqat cookie yoki header kerak bo'lsa, @Res({ passthrough: true }) bor."
task:
  title: "Yoqilg'i quyish endpoint'ini qatlamlarga ajratish"
  prompt: |
    Quyidagi controller ishlaydi, lekin u HTTP, validatsiya, biznes qoidasi va ma'lumotlar bazasini bitta metodda aralashtiradi.

    Qayta yozing:
    1. Kirish uchun class-validator bilan DTO klass yozing (`ValidationPipe` global, `whitelist` va `forbidNonWhitelisted` yoqilgan deb hisoblang).
    2. Biznes qoidalarini (bak sig'imidan oshmasin, takroriy cheklar rad etilsin) service'ga ko'chiring.
    3. Service domen xatolarini otsin, ularni HTTP statusga controller yoki filter tarjima qilsin.
    4. `@Res()` dan voz keching.
  lang: ts
  starter: |
    import { Body, Controller, Post, Res } from "@nestjs/common";
    import type { Response } from "express";
    import { PrismaService } from "../prisma/prisma.service";

    @Controller("refuels")
    export class RefuelController {
      constructor(private readonly prisma: PrismaService) {}

      @Post()
      async create(@Body() body: any, @Res() res: Response) {
        if (!body.vehicleId || !body.liters || body.liters <= 0) {
          return res.status(400).json({ message: "bad input" });
        }
        const vehicle = await this.prisma.vehicle.findUnique({ where: { id: body.vehicleId } });
        if (!vehicle) return res.status(404).json({ message: "not found" });
        if (body.liters > vehicle.tankCapacityLiters) {
          return res.status(422).json({ message: "too much" });
        }
        const dup = await this.prisma.refuel.findFirst({ where: { receiptNo: body.receiptNo } });
        if (dup) return res.status(409).json({ message: "duplicate" });
        const refuel = await this.prisma.refuel.create({
          data: { ...body, pricePerLiter: Number(body.pricePerLiter) },
        });
        return res.status(201).json(refuel);
      }
    }
  solution: |
    // refuels/dto/create-refuel.dto.ts
    import { IsNumber, IsPositive, IsString, IsUUID, Length } from "class-validator";

    export class CreateRefuelDto {
      @IsUUID()
      vehicleId!: string;

      @IsNumber({ maxDecimalPlaces: 2 })
      @IsPositive()
      liters!: number;

      @IsNumber({ maxDecimalPlaces: 2 })
      @IsPositive()
      pricePerLiter!: number;

      @IsString()
      @Length(1, 64)
      receiptNo!: string;
    }

    export class RefuelResponseDto {
      constructor(
        readonly id: string,
        readonly vehicleId: string,
        readonly liters: number,
        readonly totalPrice: number,
      ) {}
    }

    // refuels/refuel.errors.ts
    export class VehicleNotFoundError extends Error {
      constructor(readonly vehicleId: string) { super(`Vehicle ${vehicleId} not found`); }
    }
    export class TankCapacityExceededError extends Error {
      constructor(readonly liters: number, readonly capacity: number) {
        super(`${liters} l exceeds tank capacity ${capacity} l`);
      }
    }
    export class DuplicateReceiptError extends Error {
      constructor(readonly receiptNo: string) { super(`Receipt ${receiptNo} already recorded`); }
    }

    // refuels/refuel.service.ts
    import { Injectable } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";
    import { CreateRefuelDto, RefuelResponseDto } from "./dto/create-refuel.dto";
    import { DuplicateReceiptError, TankCapacityExceededError, VehicleNotFoundError } from "./refuel.errors";

    @Injectable()
    export class RefuelService {
      constructor(private readonly prisma: PrismaService) {}

      async recordRefuel(input: CreateRefuelDto): Promise<RefuelResponseDto> {
        const vehicle = await this.prisma.vehicle.findUnique({
          where: { id: input.vehicleId },
          select: { tankCapacityLiters: true },
        });
        if (!vehicle) throw new VehicleNotFoundError(input.vehicleId);
        if (input.liters > vehicle.tankCapacityLiters) {
          throw new TankCapacityExceededError(input.liters, vehicle.tankCapacityLiters);
        }
        const duplicate = await this.prisma.refuel.count({ where: { receiptNo: input.receiptNo } });
        if (duplicate > 0) throw new DuplicateReceiptError(input.receiptNo);

        const refuel = await this.prisma.refuel.create({
          data: {
            vehicleId: input.vehicleId,
            liters: input.liters,
            pricePerLiter: input.pricePerLiter,
            receiptNo: input.receiptNo,
          },
        });
        return new RefuelResponseDto(refuel.id, refuel.vehicleId, refuel.liters, refuel.liters * refuel.pricePerLiter);
      }
    }

    // refuels/refuel-errors.filter.ts
    import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
    import type { Response } from "express";
    import { DuplicateReceiptError, TankCapacityExceededError, VehicleNotFoundError } from "./refuel.errors";

    type RefuelError = VehicleNotFoundError | TankCapacityExceededError | DuplicateReceiptError;

    function statusFor(error: RefuelError): HttpStatus {
      if (error instanceof VehicleNotFoundError) return HttpStatus.NOT_FOUND;
      if (error instanceof TankCapacityExceededError) return HttpStatus.UNPROCESSABLE_ENTITY;
      return HttpStatus.CONFLICT;
    }

    @Catch(VehicleNotFoundError, TankCapacityExceededError, DuplicateReceiptError)
    export class RefuelErrorsFilter implements ExceptionFilter {
      catch(error: RefuelError, host: ArgumentsHost): void {
        const status = statusFor(error);
        host.switchToHttp().getResponse<Response>().status(status).json({
          statusCode: status,
          error: error.constructor.name,
          message: error.message,
        });
      }
    }

    // refuels/refuel.controller.ts
    import { Body, Controller, Post, UseFilters } from "@nestjs/common";
    import { CreateRefuelDto, RefuelResponseDto } from "./dto/create-refuel.dto";
    import { RefuelService } from "./refuel.service";
    import { RefuelErrorsFilter } from "./refuel-errors.filter";

    @Controller("refuels")
    @UseFilters(RefuelErrorsFilter)
    export class RefuelController {
      constructor(private readonly refuels: RefuelService) {}

      @Post()
      create(@Body() dto: CreateRefuelDto): Promise<RefuelResponseDto> {
        return this.refuels.recordRefuel(dto);
      }
    }
  solutionNotes: |
    - DTO klass: validatsiya deklarativ va API shartnomasini hujjatlaydi. `whitelist` va `forbidNonWhitelisted` bilan klient `companyId` yoki `id` kabi kutilmagan maydonni yubora olmaydi. Starter'dagi `data: { ...body }` mass assignment edi.
    - Controller bitta qator: HTTP'dan domen chaqiruviga tarjima. `@Res()` olib tashlandi, Nest standart rejimda 201 va serializatsiyani o'zi qiladi.
    - Service HTTP haqida bilmaydi: u domen xatolarini otadi va uni queue consumer yoki import skriptidan ham chaqirish mumkin.
    - Xato tarjimasi bitta filter'da. Kerak bo'lsa uni global qilish yoki RFC 9457 formatiga o'tkazish bir joyda o'zgaradi (48 va 89-darslar).
    - Javob uchun alohida DTO: DB yozuvining ichki maydonlari API'ga oqib chiqmaydi.
    - Ochiq qolgan masala: takroriy chekni `count` bilan tekshirish race condition'ga ochiq. Haqiqiy himoya - `receiptNo` ustida unique indeks va Prisma `P2002` xatosini `DuplicateReceiptError` ga tarjima qilish (87 va 95-darslar).
  checklist:
    - "Kirish class-validator dekoratorlari bilan DTO klassida tasvirlangan, any yo'q"
    - "Controller'da biznes qoidasi va Prisma chaqiruvi yo'q"
    - "Service HttpException yoki Response bilan ishlamaydi, domen xatolarini otadi"
    - "Domen xatolari HTTP statusga bitta joyda tarjima qilinadi"
    - "@Res() ishlatilmagan, javob alohida DTO orqali qaytadi"
---

## Muammo

NestJS loyihalari tashqaridan har doim tartibli ko'rinadi: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/` papkasi. Freymvork bu tuzilmani CLI orqali generatsiya qiladi va dasturchi tuzilma bor ekan, demak kod ham toza deb o'ylaydi. Lekin fayllarni ochsangiz, tez-tez boshqa manzarani ko'rasiz:

- Controller metodi 80 qator: validatsiya, Prisma so'rovlari, chegirma hisoblash, SMS yuborish va javobni formatlash.
- Service `@Res()` yoki `Request` obyektini qabul qiladi, yoki `throw new BadRequestException()` qiladi va uni Kafka consumer'dan chaqirib bo'lmaydi.
- DTO `interface` sifatida yozilgan, validatsiya yo'q, `body: any`.
- `SharedModule` o'nlab service'larni eksport qiladi va har bir modul uni import qiladi, ya'ni modullar orasida aslida hech qanday chegara yo'q.

Bu kodning muammosi 81-darsdagi Clean Architecture tilida aniq: biznes qoidalari delivery mexanizmiga (HTTP) yopishib qolgan. Yangi kirish nuqtasi qo'shilganda (cron, queue, CLI) mantiq ko'chiriladi yoki takrorlanadi. Test qilish uchun butun HTTP kontekstini ko'tarish kerak.

## Asosiy g'oya

NestJS'ning uchta asosiy qurilish bloki bor va har biriga aniq vazifa beriladi:

- **Controller** - HTTP'ni domen chaqiruviga tarjima qiladi. U marshrut, statusni, kirishni (DTO) va javob shaklini biladi. U biznes qoidasini bilmaydi.
- **Service (provider)** - biznes amalini bajaradi. U domen tilida gapiradi (`recordRefuel`, `assignDriver`) va qaysi transport orqali chaqirilayotganini bilmaydi.
- **DTO** - tizim chegarasidagi shartnoma. U kirishni tavsiflaydi va `ValidationPipe` orqali runtime'da tekshiriladi. Bu 91-darsdagi "chegarada parse qil" g'oyasining Nest'dagi standart amalga oshirilishi.

Va to'rtinchisi, ko'pincha unutiladigan: **modul** - bu fayllarni guruhlash papkasi emas, inkapsulyatsiya chegarasi. U faqat `exports` da ko'rsatilgan narsani tashqariga ochadi.

Martin *Clean Architecture* kitobida freymvorkni "detal" deb ataydi: u tashqi qatlamda turishi va biznes qoidalari unga bog'liq bo'lmasligi kerak. NestJS'da buni to'liq qo'llash (domen qatlamida umuman dekoratorsiz) ko'pincha ortiqcha, lekin yo'nalish to'g'ri: HTTP tushunchalari controller va filter'larda, biznes service'larda.

## Chuqurroq: har bir qatlamning nozik joylari

### DTO: nega klass, va ValidationPipe sozlamalari

Nest hujjati DTO uchun klassni tavsiya qiladi va sababini aniq aytadi: TypeScript interface'lari transpilyatsiyada o'chiriladi, Nest esa runtime'da ularga murojaat qila olmaydi. Pipe'lar o'zgaruvchining runtime'dagi metatipiga muhtoj. Xuddi shu sabab bilan DTO'ni `import type` bilan import qilish validatsiyani jimgina o'chiradi, chunki tip importi runtime'da yo'q.

`ValidationPipe` uchun uchta muhim sozlama:

- **`whitelist: true`** - validatsiya dekoratori bo'lmagan xususiyatlarni olib tashlaydi.
- **`forbidNonWhitelisted: true`** - olib tashlash o'rniga so'rovni rad etadi. Bu API klientlariga xatoni ko'rsatadi va jim yo'qolishdan yaxshiroq.
- **`transform: true`** - oddiy obyektni DTO klass instance'iga aylantiradi va path/query parametrlarini e'lon qilingan tipga (masalan, `:id` ni `number` ga) o'giradi.

Bularni `main.ts` da `app.useGlobalPipes(new ValidationPipe({...}))` bilan global ro'yxatdan o'tkazing. Har bir controller'da qayta sozlash izchillikni buzadi (18-dars).

Mapped types (`PartialType`, `PickType`, `OmitType`, `IntersectionType`) DTO'larni takrorlanmasdan hosil qilish imkonini beradi. `UpdateVehicleDto = PartialType(CreateVehicleDto)` - xususiyatlar va dekoratorlar bir joyda. Swagger ishlatilsa, ularni `@nestjs/swagger` dan import qiling.

Muhim chegara: DTO API shartnomasi, domen modeli emas. Kirish DTO'si, domen entity'si va javob DTO'si ko'pincha o'xshash bo'ladi va ularni bitta klassga birlashtirish vasvasasi bor. Bunday birlashma API'ni bazaning ichki tuzilishiga bog'laydi: ustun qo'shilsa, u API'da ham paydo bo'ladi.

### Controller: yupqa, lekin bo'sh emas

Yupqa controller degani mantiqsiz controller degani emas. HTTP'ga xos qarorlar aynan shu yerda: marshrut va metod, status kodi (`@HttpCode`), qaysi guard qo'llanishi, `@Param` va `@Query` ni o'qish, sarlavhalar. Biznesga xos qarorlar esa service'da: "bak sig'imidan ko'p quyish mumkin emas", "chek takrorlanmasin".

Hujjat `@Res()` haqida ehtiyot bo'lishni so'raydi: u kodni platformaga bog'laydi, testni qiyinlashtiradi va interceptor'lar hamda `@HttpCode()`, `@Header()` bilan moslikni yo'qotadi. Cookie o'rnatish kabi kichik ehtiyoj uchun `@Res({ passthrough: true })` bor.

### Service va DI

Provider'lar hujjatida asosiy mexanizm: `@Injectable()` klass constructor orqali bog'liqliklarni oladi va Nest IoC konteyneri ularni hal qiladi. Bu 57-darsdagi Dependency Inversion'ning tayyor infratuzilmasi. Lekin DI'ning o'zi dizaynni yaxshilamaydi: service'ga 9 ta bog'liqlik kiritilgan bo'lsa, bu SRP buzilganining belgisi (53-dars), DI uni faqat qulayroq qiladi.

Interfeys va custom provider'lar (`{ provide: FUEL_PRICE_SOURCE, useClass: ... }`) faqat haqiqiy almashtirish ehtiyoji bo'lganda kerak: tashqi API, test uchun soxta implementatsiya. Har bir service uchun `IVehicleService` interfeysi va token - bu 75-darsdagi speculative generality.

### Xatolar: domen xatosi va HTTP tarjimasi

Service'da `NotFoundException` otish texnik jihatdan ishlaydi va kichik loyihada maqbul. Lekin service boshqa transportdan chaqirila boshlaganda, HTTP tushunchasi domen ichiga kirib qolgani ko'rinadi. Toza yo'l: service `VehicleNotFoundError` kabi domen xatosini otadi, exception filter (48-dars) uni HTTP javobiga tarjima qiladi. Tarjima jadvali bitta joyda, va javob formatini RFC 9457 ga o'tkazish (89-dars) bitta o'zgarish.

### Modullar: chegara sifatida

Modules hujjatiga ko'ra modul o'z provider'larini standart holatda inkapsulyatsiya qiladi: boshqa modul faqat eksport qilinganini ko'radi. `exports` - modulning ommaviy API'si. Bu Parnas'ning information hiding g'oyasining (43-dars) freymvork darajasidagi qo'llab-quvvatlovi, va 83-darsdagi modulli monolitning asosi.

Hujjat `@Global()` haqida ochiq ogohlantiradi: hammasini global qilish yaxshi dizayn qarori emas. Aniq `imports` modul API'sini nazoratli ochadi va keraksiz coupling'dan saqlaydi. Global modul odatda config yoki DB ulanishi kabi infratuzilma uchun, bir marta, root yoki core modulda.

## Misol: semiz controller'dan qatlamlarga

Yomon variant - haydovchini mashinaga biriktirish:

```ts
import { BadRequestException, Body, Controller, NotFoundException, Param, Post } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SmsService } from "../sms/sms.service";

@Controller("vehicles")
export class VehicleController {
  constructor(private readonly prisma: PrismaService, private readonly sms: SmsService) {}

  @Post(":id/driver")
  async assign(@Param("id") id: string, @Body() body: { driverId: string }) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException();
    const driver = await this.prisma.driver.findUnique({ where: { id: body.driverId } });
    if (!driver) throw new NotFoundException();
    if (driver.licenseExpiresAt < new Date()) throw new BadRequestException("license");
    await this.prisma.vehicle.update({ where: { id }, data: { driverId: driver.id } });
    await this.sms.send(driver.phone, `Sizga ${vehicle.plate} biriktirildi`);
    return { ok: true };
  }
}
```

Body tipi inline obyekt (validatsiya yo'q), biznes qoidasi (guvohnoma muddati) controller'da, xato xabari `"license"`, va bu qoidani avtomatik biriktirish cron'idan qayta ishlatib bo'lmaydi.

Toza variant:

```ts
import { Body, Controller, HttpCode, HttpStatus, Injectable, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { IsUUID } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";
import { SmsService } from "../sms/sms.service";

export class AssignDriverDto {
  @IsUUID()
  driverId!: string;
}

export class DriverLicenseExpiredError extends Error {
  constructor(readonly driverId: string, readonly expiredAt: Date) {
    super(`Driver ${driverId} license expired at ${expiredAt.toISOString()}`);
  }
}
export class EntityNotFoundError extends Error {
  constructor(readonly entity: "vehicle" | "driver", readonly id: string) {
    super(`${entity} ${id} not found`);
  }
}

@Injectable()
export class DriverAssignmentService {
  constructor(private readonly prisma: PrismaService, private readonly sms: SmsService) {}

  async assignDriver(vehicleId: string, driverId: string, now: Date = new Date()): Promise<void> {
    const [vehicle, driver] = await Promise.all([
      this.prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { plate: true } }),
      this.prisma.driver.findUnique({ where: { id: driverId }, select: { phone: true, licenseExpiresAt: true } }),
    ]);
    if (!vehicle) throw new EntityNotFoundError("vehicle", vehicleId);
    if (!driver) throw new EntityNotFoundError("driver", driverId);
    if (driver.licenseExpiresAt < now) throw new DriverLicenseExpiredError(driverId, driver.licenseExpiresAt);

    await this.prisma.vehicle.update({ where: { id: vehicleId }, data: { driverId } });
    await this.sms.send(driver.phone, `Sizga ${vehicle.plate} biriktirildi`);
  }
}

@Controller("vehicles")
export class VehicleDriverController {
  constructor(private readonly assignments: DriverAssignmentService) {}

  @Post(":id/driver")
  @HttpCode(HttpStatus.NO_CONTENT)
  async assign(@Param("id", ParseUUIDPipe) vehicleId: string, @Body() dto: AssignDriverDto): Promise<void> {
    await this.assignments.assignDriver(vehicleId, dto.driverId);
  }
}
```

Nima yutdik: controller faqat HTTP (marshrut, `ParseUUIDPipe`, 204 status). Service domen tilida (`assignDriver`), `now` parametri bilan vaqtga bog'liq qoida testda boshqariladi (67-dars), ikkala so'rov parallel. Xatolar ma'lumot tashiydi va ularni filter HTTP'ga tarjima qiladi. Cron job endi xuddi shu service'ni chaqiradi.

## Qachon qo'llamaslik kerak

- **Oddiy CRUD.** Agar endpoint shunchaki yozuvni o'qib qaytarsa va hech qanday biznes qoidasi bo'lmasa, controller, service, repository, mapper, domen entity va uchta DTO - bu sayoz qatlamlar zanjiri (52-dars). Bir qatorli "o'tkazgich" service'lar ham murakkablik. Qoida bo'lmasa, qatlam ham kam bo'lishi mumkin.
- **Domenni freymvorkdan to'liq ajratish.** Domen klasslarini dekoratorsiz saqlash, alohida mapper'lar yozish - katta, uzoq yashaydigan domen uchun foydali. Kichik servis uchun esa bu ikki baravar kod va kam foyda (90-dars). Ko'pchilik Nest loyihalari uchun "service HTTP haqida bilmaydi" darajasi yetarli.
- **HttpException service'da.** Agar service faqat HTTP'dan chaqirilsa va bunday bo'lib qolishi aniq bo'lsa, domen xatolari va filter qo'shimcha marosim. Ikkinchi transport paydo bo'lganda refaktoring qiling.
- **class-validator yagona yo'l emas.** Zod yoki boshqa schema kutubxonasi bilan custom pipe ham to'g'ri, ayniqsa schema frontend bilan ulashilsa. Muhimi - bitta loyihada bitta yondashuv.

## Stack'da: amaliy sozlamalar

- **main.ts:** `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))`.
- **Papka tuzilishi:** feature bo'yicha (`refuels/`, `vehicles/`), har birida `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `*.errors.ts` (38-dars).
- **Modul API'si:** har bir modul faqat boshqa modullar haqiqatan ishlatadigan service'ni eksport qiladi. `SharedModule` ichidagi 20 ta service - modullar orasida chegara yo'qligining belgisi.
- **Testlar:** service'ni `Test.createTestingModule` bilan, provider'larni almashtirib, HTTP'siz test qiling. Controller va pipe'lar uchun bir nechta e2e test (68-dars).

## Xulosa

- Nest tuzilma beradi, lekin tozalik har bir qatlamga to'g'ri vazifa berishdan keladi.
- Controller HTTP'ni domen chaqiruviga tarjima qiladi, service domen tilida gapiradi va transportni bilmaydi.
- DTO klass bo'lsin, global ValidationPipe `whitelist`, `forbidNonWhitelisted` va `transform` bilan.
- Domen xatolari HTTP statusga bitta filter'da tarjima qilinadi, `@Res()` dan qochiladi.
- Modul - inkapsulyatsiya chegarasi, `@Global` kamdan-kam. Oddiy CRUD uchun qatlamlarni ko'paytirmang.
