---
n: 100
slug: yakuniy-loyiha
title: "Yakuniy loyiha: legacy modulni bosqichma-bosqich tozalash"
summary: "Kursning yakuniy loyihasi: transport parki platformasidagi real ko'rinishdagi legacy NestJS moduli - yoqilg'i datchigi hodisalarini qayta ishlash servisi. Uni characterization test bilan qamrab olib, kichik xavfsiz qadamlar bilan tozalaymiz va har bir qadamni kursning tegishli darsiga bog'laymiz."
duration: 90
sources:
  - id: welc
    note: "Legacy kodning ta'rifi (testsiz kod), characterization test, seam'lar va bog'liqliklarni sindirish usullari, o'zgartirish algoritmi"
  - id: refactoring
    note: "Refaktoringning ta'rifi (kuzatiladigan xatti-harakatni o'zgartirmasdan), kichik qadamlar, Extract Function, Split Phase, Replace Conditional with Polymorphism va boshqa katalog usullari"
  - id: tidy-first
    note: "Struktura va xatti-harakat o'zgarishlarini alohida commit'larda ajratish, kichik tidying'lar (guard clause, explaining variable, normalize symmetries) va ularni qachon qilish qarori"
quiz:
  - q: "Legacy modulni tozalashni nimadan boshlash kerak?"
    options:
      - "Modulni noldan qayta yozishdan"
      - "Eng xunuk funksiyani darhol bo'lishdan"
      - "Mavjud xatti-harakatni characterization testlar bilan qayd etishdan, hatto u xatoga o'xshasa ham"
      - "Barcha nomlarni o'zgartirishdan"
    answer: 2
    explain: "Feathers uchun legacy kod - testsiz kod. Xavfsiz o'zgartirish uchun avval kod hozir nima qilishini testda qayd etish kerak. Xato ko'rinadigan xatti-harakat ham qayd etiladi va keyin alohida, ataylab o'zgartiriladi."
  - q: "Characterization test paytida ma'lum bo'ldiki, servis yoqilg'i to'kilishini noto'g'ri birlikda (foiz o'rniga litr) hisoblaydi. Nima qilasiz?"
    options:
      - "Testda joriy (noto'g'ri) xatti-harakatni qayd etaman, refaktoringni tugataman, keyin xatoni alohida commit'da, alohida test bilan tuzataman"
      - "Darhol refaktoring ichida tuzataman"
      - "Testni o'chirib qo'yaman"
      - "Xatoni e'tiborsiz qoldiraman"
    answer: 0
    explain: "Refaktoring xatti-harakatni o'zgartirmaydi. Xato tuzatish esa xatti-harakat o'zgarishi. Ularni aralashtirish review'ni qiyinlashtiradi va regressiya sababini topishni imkonsiz qiladi. Tidy First'dagi asosiy g'oya: struktura va xatti-harakat alohida."
  - q: "Servis ichida `new Date()` va `axios.post(...)` to'g'ridan-to'g'ri chaqiriladi, shuning uchun uni testlab bo'lmaydi. Feathers terminologiyasida birinchi qadam nima?"
    options:
      - "Butun servisni mock qilish"
      - "Seam yaratish: vaqt va HTTP klientni constructor parametri (DI) orqali kiritish, shunda testda ularni almashtirish mumkin"
      - "Testlarni production'da ishga tushirish"
      - "jest.useFakeTimers bilan hamma narsani hal qilish"
    answer: 1
    explain: "Seam - kodni tahrirlamasdan xatti-harakatni o'zgartirish mumkin bo'lgan joy. NestJS'da eng tabiiy seam - constructor injection (57-dars). Fake timer'lar vaqtni hal qiladi, lekin HTTP bog'liqligini emas."
  - q: "Refaktoring rejasidagi qaysi ketma-ketlik eng xavfsiz?"
    options:
      - "Arxitekturani o'zgartirish, keyin testlar, keyin nomlar"
      - "Nomlar, arxitektura va xato tuzatishlarini bitta katta PR'da"
      - "Avval dependency-cruiser qoidalari, keyin testlar"
      - "Testlar va seam'lar, keyin kichik tidying'lar (nomlar, guard clause), keyin funksiyalarni ajratish, keyin modul chegaralari, oxirida xatti-harakat o'zgarishlari"
    answer: 3
    explain: "Har bir qadam oldingisiga tayanadi: testlarsiz refaktoring xavfli, kichik tidying'lar katta qadamlarni ko'rinadigan qiladi, va xatti-harakat o'zgarishlari faqat struktura tozalangandan keyin alohida keladi."
  - q: "Nima uchun yakuniy loyihada modulni noldan qayta yozish (rewrite) tavsiya qilinmaydi?"
    options:
      - "Qayta yozish har doim qimmatroq"
      - "Qayta yozish taqiqlangan"
      - "Legacy kodda hujjatlanmagan biznes qoidalari va chegaraviy holatlar yashiringan: qayta yozish ularni jimgina yo'qotadi, bosqichli refaktoring esa har qadamda xatti-harakatni saqlaydi"
      - "NestJS'da qayta yozib bo'lmaydi"
    answer: 2
    explain: "Eski kod ko'pincha yillar davomida to'plangan tuzatishlarni o'z ichiga oladi. Qayta yozish ularni qayta kashf qilishni talab qiladi. Bosqichli yondashuv har qadamda ishlaydigan tizimni saqlaydi va istalgan payt to'xtash imkonini beradi (80-dars, strangler fig)."
  - q: "Tozalash tugadi. Yangi talab keldi: \"to'kilish ogohlantirishini Telegram'dan tashqari SMS orqali ham yuborish\". Tozalash muvaffaqiyatli bo'lganini qanday bilasiz?"
    options:
      - "Kod qatorlari soni kamaygan bo'lsa"
      - "Yangi talab bitta yangi adapter va bitta konfiguratsiya o'zgarishi bilan, biznes qoidasiga tegmasdan amalga oshsa, va testlar buni HTTP'siz tasdiqlasa"
      - "Cognitive complexity 0 bo'lsa"
      - "Barcha funksiyalar 5 qatordan qisqa bo'lsa"
    answer: 1
    explain: "1-darsdagi o'lchov: o'zgartirish narxi. Yangi talab qanchalik lokal va xavfsiz kiritilsa, tozalash shunchalik muvaffaqiyatli. Qator soni va metrikalar faqat proksi."
task:
  title: "FuelEventsService'ni bosqichma-bosqich tozalash"
  prompt: |
    Quyidagi NestJS servis ikki yildan beri production'da. U yoqilg'i datchiklaridan (DUT) kelgan hodisalarni qabul qiladi, quyish va to'kilishni aniqlaydi, bazaga yozadi va dispetcherlarga Telegram orqali xabar beradi. Unda test yo'q. Jamoa yangi talablarni kutmoqda: SMS kanal, kompaniya bo'yicha sozlanadigan chegaralar, va boshqa datchik modeli (sath foizda emas, litrda keladi).

    Topshiriq bosqichlari (har biri alohida commit):

    1. **Characterization testlar.** Servisni testlash uchun minimal seam'larni qo'shing (vaqt, HTTP, Prisma) va kamida 6 ta testda joriy xatti-harakatni qayd eting: oddiy o'qish, quyish, to'kilish, takroriy hodisa, noma'lum mashina, kalibrovkasiz mashina. Yashirin xatolarni ham qayd eting.
    2. **Kichik tidying'lar.** Nomlar, magic number'lar, guard clause'lar. Xatti-harakat o'zgarmaydi.
    3. **Split phase.** Parse, aniqlash (sof funksiya), saqlash va xabar berishni ajrating.
    4. **Chegaralar.** Telegram'ni `AlertNotifier` port orqasiga oling, Prisma so'rovlarini domen metodli repository'ga yig'ing, DTO va ValidationPipe qo'shing.
    5. **Xatti-harakat o'zgarishlari** (alohida commit'lar, har biri o'z testi bilan): characterization testda topilgan xatolarni tuzating.
    6. **Yakuniy tekshiruv.** SMS kanalni qo'shish uchun qaysi fayllar o'zgarishini yozing.

    Har bir qadamni kursning tegishli darsiga bog'lang.
  lang: ts
  starter: |
    import { Body, Controller, Injectable, Post } from "@nestjs/common";
    import axios from "axios";
    import { PrismaService } from "../prisma/prisma.service";

    @Injectable()
    export class FuelEventsService {
      private last: any = {};
      constructor(private prisma: PrismaService) {}

      async handle(d: any) {
        if (!d || !d.imei) return { ok: false };
        const v = await this.prisma.vehicle.findFirst({ where: { trackerImei: d.imei } });
        if (!v) return { ok: false };
        let lvl = d.lvl;
        if (v.calib) {
          const c = JSON.parse(v.calib);
          lvl = (d.lvl / 100) * c.tank;
        }
        const prev = this.last[v.id];
        this.last[v.id] = lvl;
        if (prev) {
          const diff = lvl - prev;
          if (diff > 10) {
            await this.prisma.fuelEvent.create({ data: { vehicleId: v.id, type: 1, amount: diff, at: new Date() } });
          } else if (diff < -8) {
            if (d.spd < 5) {
              await this.prisma.fuelEvent.create({ data: { vehicleId: v.id, type: 2, amount: -diff, at: new Date() } });
              const users = await this.prisma.user.findMany({ where: { companyId: v.companyId } });
              for (const u of users) {
                if (u.tg) {
                  await axios.post(`https://api.telegram.org/bot${process.env.TG}/sendMessage`, {
                    chat_id: u.tg, text: "Слив топлива " + v.plate + " " + -diff + "л",
                  });
                }
              }
            }
          }
        }
        await this.prisma.fuelReading.create({ data: { vehicleId: v.id, level: lvl, at: new Date() } });
        return { ok: true };
      }
    }

    @Controller("fuel")
    export class FuelEventsController {
      constructor(private s: FuelEventsService) {}
      @Post("events")
      handle(@Body() body: any) { return this.s.handle(body); }
    }
  solution: |
    // ===== Bosqich 1: characterization testlar (79-dars) =====
    // Minimal seam'lar: Clock va AlertNotifier constructor orqali (57-dars). Prisma uchun
    // Testcontainers'dagi haqiqiy PostgreSQL (68-dars). Topilgan va QAYD ETILGAN xatolar:
    //   B1. `if (prev)`: bak 0 bo'lsa, keyingi o'qish taqqoslanmaydi (46-dars).
    //   B2. `this.last` jarayon xotirasida: restart yoki 2 ta pod'da oldingi sath yo'qoladi.
    //   B3. Kalibrovkasiz mashinada sath foizda, kalibrovkalida litrda, lekin chegaralar (10, -8)
    //       ikkalasiga bir xil qo'llanadi.
    //   B4. Telegram xatosi butun so'rovni yiqitadi va o'qish bazaga yozilmaydi.
    //   B5. Bir xil hodisa qayta yuborilsa (tracker retry), quyish ikki marta yoziladi (87-dars).
    //
    // describe("FuelEventsService (characterization)", () => {
    //   it("kalibrovkasiz mashinada 10 dan katta o'sishni quyish deb yozadi", ...);
    //   it("harakatda (spd >= 5) to'kilishni e'tiborsiz qoldiradi", ...);
    //   it("B1: oldingi sath 0 bo'lsa, quyishni aniqlamaydi (joriy xatti-harakat)", ...);
    //   it("B4: Telegram 500 qaytarsa, o'qish saqlanmaydi (joriy xatti-harakat)", ...);
    //   ...
    // });

    // ===== Bosqich 2-4 natijasi: fayllar =====

    // fuel/fuel.types.ts - domen tiplari (44, 45-darslar)
    export type VehicleId = string & { readonly __brand: "VehicleId" };
    export type Liters = number & { readonly __brand: "Liters" };

    export type FuelChange =
      | { kind: "none" }
      | { kind: "refuel"; liters: Liters }
      | { kind: "drain"; liters: Liters };

    export type VehicleFuelProfile = {
      id: VehicleId;
      plate: string;
      companyId: string;
      tankCapacityLiters: number | null;
    };

    // fuel/fuel-change.ts - sof funksiyalar, functional core (25, 67-darslar)
    export const REFUEL_THRESHOLD_LITERS = 10;
    export const DRAIN_THRESHOLD_LITERS = 8;
    export const MAX_SPEED_FOR_DRAIN_KMH = 5;

    /** Datchik foizda yuborsa va bak sig'imi ma'lum bo'lsa, litrga o'giradi. */
    export function toLiters(rawLevel: number, tankCapacityLiters: number | null): Liters {
      const liters = tankCapacityLiters === null ? rawLevel : (rawLevel / 100) * tankCapacityLiters;
      return liters as Liters;
    }

    export function detectFuelChange(
      previous: Liters | undefined,
      current: Liters,
      speedKmh: number,
    ): FuelChange {
      if (previous === undefined) return { kind: "none" };
      const delta = current - previous;
      if (delta > REFUEL_THRESHOLD_LITERS) return { kind: "refuel", liters: delta as Liters };
      const isStationary = speedKmh < MAX_SPEED_FOR_DRAIN_KMH;
      if (-delta > DRAIN_THRESHOLD_LITERS && isStationary) return { kind: "drain", liters: -delta as Liters };
      return { kind: "none" };
    }

    // fuel/dto/fuel-reading.dto.ts - chegarada parse (89, 94-darslar)
    import { IsISO8601, IsNumber, IsString, Length, Max, Min } from "class-validator";

    export class FuelReadingDto {
      @IsString() @Length(15, 15) imei!: string;
      @IsNumber() @Min(0) @Max(10_000) level!: number;
      @IsNumber() @Min(0) @Max(300) speedKmh!: number;
      @IsISO8601() recordedAt!: string;
    }

    // fuel/alert-notifier.port.ts - port (82-dars)
    export type DrainAlert = { companyId: string; plate: string; liters: Liters; at: Date };
    export abstract class AlertNotifier {
      abstract notifyDrain(alert: DrainAlert): Promise<void>;
    }

    // fuel/fuel.repository.ts - domen tilidagi so'rovlar (95-dars)
    import { Injectable } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";

    @Injectable()
    export class FuelRepository {
      constructor(private readonly prisma: PrismaService) {}

      async findProfileByImei(imei: string): Promise<VehicleFuelProfile | null> {
        const v = await this.prisma.vehicle.findFirst({
          where: { trackerImei: imei, deletedAt: null },
          select: { id: true, plate: true, companyId: true, tankCapacityLiters: true },
        });
        return v ? { ...v, id: v.id as VehicleId } : null;
      }

      async lastLevel(vehicleId: VehicleId): Promise<Liters | undefined> {
        const last = await this.prisma.fuelReading.findFirst({
          where: { vehicleId },
          orderBy: { at: "desc" },
          select: { level: true },
        });
        return last ? (last.level as Liters) : undefined;
      }

      /** Bitta tranzaksiya: o'qish va (bo'lsa) hodisa birga yoziladi. */
      async saveReading(vehicleId: VehicleId, level: Liters, change: FuelChange, at: Date): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
          await tx.fuelReading.create({ data: { vehicleId, level, at } });
          if (change.kind !== "none") {
            await tx.fuelEvent.create({ data: { vehicleId, type: change.kind, amount: change.liters, at } });
          }
        });
      }
    }

    // fuel/fuel-events.service.ts - orkestratsiya, imperative shell (67-dars)
    import { Logger } from "@nestjs/common";

    export class UnknownTrackerError extends Error {
      constructor(readonly imei: string) { super(`Tracker ${imei} biror mashinaga biriktirilmagan`); }
    }

    @Injectable()
    export class FuelEventsService {
      private readonly logger = new Logger(FuelEventsService.name);

      constructor(private readonly fuel: FuelRepository, private readonly notifier: AlertNotifier) {}

      async recordReading(reading: FuelReadingDto): Promise<FuelChange> {
        const vehicle = await this.fuel.findProfileByImei(reading.imei);
        if (!vehicle) throw new UnknownTrackerError(reading.imei);

        const at = new Date(reading.recordedAt);
        const current = toLiters(reading.level, vehicle.tankCapacityLiters);
        const previous = await this.fuel.lastLevel(vehicle.id);
        const change = detectFuelChange(previous, current, reading.speedKmh);

        await this.fuel.saveReading(vehicle.id, current, change, at);
        if (change.kind === "drain") await this.notifyDrainSafely(vehicle, change.liters, at);
        return change;
      }

      private async notifyDrainSafely(vehicle: VehicleFuelProfile, liters: Liters, at: Date): Promise<void> {
        try {
          await this.notifier.notifyDrain({ companyId: vehicle.companyId, plate: vehicle.plate, liters, at });
        } catch (error) {
          this.logger.error({ vehicleId: vehicle.id, err: error }, "Drain alert yuborilmadi");
        }
      }
    }

    // fuel/fuel-events.controller.ts - yupqa controller (94-dars)
    import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

    @Controller("fuel")
    export class FuelEventsController {
      constructor(private readonly events: FuelEventsService) {}

      @Post("readings")
      @HttpCode(HttpStatus.ACCEPTED)
      async record(@Body() dto: FuelReadingDto): Promise<{ change: FuelChange["kind"] }> {
        const change = await this.events.recordReading(dto);
        return { change: change.kind };
      }
    }

    // telegram/telegram-alert.notifier.ts - adapter (50, 82-darslar), FuelModule'da
    // { provide: AlertNotifier, useClass: TelegramAlertNotifier } bilan ulanadi.

    // ===== Bosqich 6: SMS kanal qo'shish narxi =====
    // Yangi fayl: sms/sms-alert.notifier.ts (AlertNotifier implementatsiyasi).
    // Yangi fayl: fuel/composite-alert.notifier.ts (bir nechta kanalga yuborish).
    // O'zgarish: fuel.module.ts dagi provider ro'yxati.
    // Tegilmaydi: fuel-change.ts, fuel-events.service.ts, fuel.repository.ts, testlar.
  solutionNotes: |
    - **1-bosqich (79, 68-darslar).** Characterization testlar avval keladi. Xatolar (B1-B5) darhol tuzatilmaydi, testda "joriy xatti-harakat" sifatida qayd etiladi. Shunda keyingi refaktoring qadamlarida xatti-harakat o'zgarmagani isbotlanadi.
    - **2-bosqich (11, 13, 26, 78-darslar).** `d`, `v`, `lvl`, `c` nomlari, `type: 1/2`, `10` va `-8` konstantalari, ichma-ich `if` lar guard clause'larga. Har biri alohida kichik commit, xatti-harakat o'zgarishsiz.
    - **3-bosqich (22, 25, 67-darslar, Split Phase).** Aniqlash mantiqi `detectFuelChange` sof funksiyasiga chiqdi. Endi biznes qoidasini bazasiz, millisekundlarda test qilish mumkin. Servis faqat orkestratsiya qiladi.
    - **4-bosqich (50, 57, 82, 94, 95-darslar).** Telegram `AlertNotifier` port orqasida, Prisma so'rovlari domen metodli repository'da, kirish DTO va ValidationPipe bilan, `any` yo'qoldi (91-dars). Ruscha hardcode matn adapterga ko'chdi, u yerda lokalizatsiya qilinadi.
    - **5-bosqich, alohida commit'lar.** B1: `previous === undefined` (46-dars). B2: oldingi sath bazadan o'qiladi, xotiradagi `last` yo'qoldi. B3: chegaralar endi doim litrda, chunki `toLiters` avval qo'llanadi. B4: xabar yuborish xatosi o'qishni saqlashga to'sqinlik qilmaydi va strukturali log yoziladi (88-dars). B5: idempotentlik uchun `(vehicleId, at)` ustida unique indeks kerak, bu migratsiya expand-contract bilan (87, 95-darslar) va yechimda alohida qadam sifatida qoldirilgan. Har bir tuzatish o'z testini "joriy xatti-harakat" dan "kutilgan xatti-harakat" ga o'zgartiradi.
    - **Ataylab qilinmagan narsalar (9, 90-darslar).** Strategy pattern, event bus, CQRS, alohida mikroservis. Ular hozirgi talablar uchun kerak emas. `lastLevel` har bir o'qishda bitta qo'shimcha so'rov: yuklama oshsa, Redis kesh qo'shiladi, lekin faqat o'lchovdan keyin (99-dars).
    - **Muvaffaqiyat o'lchovi (1-dars).** SMS kanal ikkita yangi fayl va bitta modul o'zgarishi bilan qo'shiladi, biznes qoidasiga tegilmaydi. Kompaniya bo'yicha chegaralar esa `detectFuelChange` ga parametr qo'shish va repository'da sozlamani o'qish bilan qo'shiladi.
  checklist:
    - "Refaktoringdan oldin kamida 6 ta characterization test yozildi va yashirin xatolar qayd etildi"
    - "Struktura o'zgarishlari va xatti-harakat o'zgarishlari alohida commit'larda"
    - "Aniqlash qoidasi bazasiz test qilinadigan sof funksiyada"
    - "Telegram port orqasida, Prisma so'rovlari repository'da, kirish DTO bilan tekshiriladi"
    - "Xotiradagi holat va any qolmadi, xabar yuborish xatosi o'qishni yo'qotmaydi"
    - "Har bir qadam kursning tegishli darsiga bog'langan va SMS qo'shish narxi yozilgan"
---

## Muammo

Kursning 99 ta darsida biz qoidalarni alohida-alohida ko'rdik: nomlar, funksiyalar, xatolar, testlar, arxitektura, stack amaliyoti. Real ishda esa ular hech qachon alohida kelmaydi. Sizga "toza nomlar" yoki "SOLID" bo'yicha vazifa berilmaydi. Sizga ikki yildan beri production'da ishlayotgan, testsiz, uch kishi navbat bilan yozgan modul beriladi va "unga SMS kanal qo'shish kerak, ertaga" deyiladi.

Bunday modulda barcha muammolar bir vaqtda bor va ular bir-biriga bog'langan. Nomlarni o'zgartirmoqchisiz, lekin test yo'q, demak biror narsani buzganingizni bilmaysiz. Test yozmoqchisiz, lekin servis `axios` va `new Date()` ni to'g'ridan-to'g'ri chaqiradi. Bog'liqliklarni ajratmoqchisiz, lekin bitta 50 qatorli metod beshta ishni qiladi. Va bularning hammasi orasida yashirin xatolar bor, ular hozir kimgadir "to'g'ri" xatti-harakat bo'lib xizmat qilayotgan bo'lishi mumkin.

Michael Feathers *Working Effectively with Legacy Code* kitobida bu holatni legacy kod dilemmasi deb ataydi: kodni o'zgartirish uchun testlar kerak, testlarni qo'yish uchun esa ko'pincha kodni o'zgartirish kerak. Yakuniy loyihaning maqsadi - bu dilemmadan chiqish yo'lini amalda bosib o'tish.

## Asosiy g'oya

Uch manba bitta yo'lni turli tomondan tasvirlaydi.

**Feathers** legacy kodni oddiy va qattiq ta'riflaydi: bu testsiz kod. U xavfsiz o'zgartirish uchun algoritm beradi: o'zgarish nuqtasini toping, test nuqtalarini toping, bog'liqliklarni sindiring, testlarni yozing, o'zgartiring va refaktoring qiling. Markaziy vositalar - **characterization test** (kod hozir nima qilishini qayd etadigan test, u nima qilishi kerakligini emas) va **seam** (kodni tahrirlamasdan xatti-harakatini almashtirish mumkin bo'lgan joy).

**Fowler** *Refactoring* kitobida refaktoringni kuzatiladigan xatti-harakatni o'zgartirmasdan ichki tuzilmani o'zgartirish deb ta'riflaydi va uni juda kichik qadamlar bilan qilishni talab qiladi: har bir qadamdan keyin testlar o'tadi. Katalogdagi usullar (Extract Function, Split Phase, Replace Primitive with Object, Introduce Parameter Object) bu qadamlarning nomlangan, takrorlanadigan shakllari.

**Kent Beck** *Tidy First?* kitobida yana bir intizomni qo'shadi: struktura o'zgarishlari va xatti-harakat o'zgarishlarini alohida commit'larda ushlab turing. "Tidying" - kichik, xavfsiz struktura yaxshilanishi (guard clause, explaining variable, simmetriyani normallashtirish). Va savol "tozalash kerakmi?" emas, "hozir, keyin yoki umuman tozalash kerakmi?" - bu iqtisodiy qaror.

Bularni birlashtirsak, yakuniy loyihaning qoidasi chiqadi: **avval xatti-harakatni qayd et, keyin kichik struktura qadamlari, keyin katta struktura qadamlari, va oxirida, alohida, xatti-harakat o'zgarishlari. Har qadamda tizim ishlaydi va istalgan joyda to'xtash mumkin.**

## Chuqurroq: bosqichma-bosqich reja

Quyidagi reja topshiriqdagi `FuelEventsService` uchun yozilgan, lekin u istalgan legacy modulga qo'llanadi. Har bir bosqichda kursning qaysi darslari ishlatilishi ko'rsatilgan.

### 0-bosqich: o'qish va xarita (2, 3, 72-75-darslar)

Hech narsani o'zgartirmasdan kodni o'qing va yozib oling: u qanday kirishlarni oladi, qanday chiqishlar beradi (javob, DB yozuvlari, tashqi chaqiruvlar), qanday holatni saqlaydi. Code smell'larni nomlang: `any` (primitive obsession va tip yo'qligi), uzun funksiya, ichma-ich shartlar, global holat (`this.last`), magic number'lar, aralash tillar ("Слив топлива"), feature envy (servis Telegram API tafsilotlarini biladi).

Bu bosqichning natijasi - kod emas, ro'yxat. Va eng muhim savol: yangi talablar (SMS, sozlanadigan chegaralar, litrli datchik) kodning qaysi joylariga tegadi? Tozalash shu joylarga qaratiladi, butun modulga emas (6-dars, Boy Scout qoidasi va 4-darsdagi texnik qarz iqtisodiyoti).

### 1-bosqich: seam'lar va characterization testlar (79, 66, 68-darslar)

Servisni testlash uchun uchta bog'liqlikni boshqarish kerak: vaqt (`new Date()`), Telegram (`axios`), ma'lumotlar bazasi (Prisma). NestJS'da eng tabiiy seam - constructor injection (57-dars). Birinchi o'zgarish minimal: `axios.post` ni `AlertNotifier` ga, `new Date()` ni `Clock` ga o'rash. Bu ham struktura o'zgarishi, lekin u shunchalik mexanikki, uni testsiz qilish xavfi past. Feathers testsiz qilinadigan bunday dastlabki o'zgarishlarni juda ehtiyotkor, mexanik va faqat test qo'yish maqsadida, minimal hajmda qilishni maslahat beradi.

Prisma uchun mock emas, Testcontainers'dagi haqiqiy PostgreSQL afzal: so'rovlar to'g'riligini faqat haqiqiy baza ko'rsatadi (68-dars).

Keyin testlar. Characterization testning hiylasi: siz kutilgan qiymatni o'ylab topmaysiz. Testni yozasiz, ishga tushirasiz, kod nima qaytarganini ko'rasiz va o'shani assert qilasiz. Bu jarayonda yashirin xatolar topiladi va bu yerda muhim intizom kerak: **xatoni darhol tuzatmang**. Uni testda "joriy xatti-harakat" sifatida qayd eting, nomida belgilang va ro'yxatga qo'shing. Sababi: refaktoring davomida bu test xatti-harakat o'zgarmaganini isbotlaydi. Xatoni tuzatish esa keyinroq, alohida va ongli qaror.

Bizning servisda topiladigan xatolar: bo'sh bakdan keyin taqqoslash yo'q (`if (prev)` va 0), xotiradagi holat restart yoki ikkinchi pod'da yo'qoladi, kalibrovkasiz mashinada foiz, kalibrovkalida litr bilan bir xil chegara, Telegram xatosi o'qishni saqlashni to'xtatadi, takroriy hodisa ikki marta yoziladi.

### 2-bosqich: kichik tidying'lar (11-13, 26, 78-darslar)

Endi testlar bor va kichik, mexanik o'zgarishlar boshlanadi. Har biri alohida commit:

- Nomlar: `d` dan `reading`, `v` dan `vehicle`, `lvl` dan `levelLiters`, `diff` dan `delta` (11-dars).
- Magic number'lar: `10`, `-8`, `5`, `type: 1/2` nomlangan konstantalarga va union tipga (13, 45-darslar).
- Guard clause'lar: ichma-ich `if (prev) { if (diff > 10) ... else if ... { if (spd < 5)` tekis shartlarga (26-dars).
- Explaining variable: `const isStationary = speedKmh < MAX_SPEED_FOR_DRAIN_KMH` (Tidy First'dagi usul).

Bu qadamlarning birortasi xatti-harakatni o'zgartirmaydi va har biridan keyin characterization testlar o'tadi. Ular arzon, lekin keyingi bosqichni ko'rinadigan qiladi: tekis va nomlangan kodda funksiya chegaralari o'z-o'zidan ko'rinib qoladi.

### 3-bosqich: Split Phase va functional core (22, 25, 30, 67-darslar)

`handle` metodi aslida to'rt bosqichdan iborat: kirishni tushunish (parse va litrga o'tkazish), o'zgarishni aniqlash, saqlash, xabar berish. Fowler'ning Split Phase usuli bilan ularni ajratamiz. Eng qimmatli natija - `detectFuelChange(previous, current, speedKmh)`: u sof funksiya, ma'lumotlar bazasiz, vaqtsiz, HTTP'siz. Biznes qoidasi endi bitta joyda va uni o'nlab chegaraviy holatlar bilan millisekundlarda test qilish mumkin. Bu Gary Bernhardt'ning functional core, imperative shell g'oyasi (67-dars): sof yadro va uni o'rab turgan yupqa orkestratsiya.

Ajratishda 21-darsdagi ogohlantirishni eslang: har bir qatorni alohida funksiyaga chiqarmang. To'rtta ma'noli bosqich - to'rtta funksiya yoki qism, yigirmata emas.

### 4-bosqich: chegaralar (50, 57, 82, 83, 94, 95-darslar)

- **Kirish chegarasi.** `body: any` o'rniga `FuelReadingDto` va global ValidationPipe (94-dars). Noto'g'ri IMEI yoki manfiy sath endi servisga yetib bormaydi.
- **Tashqi xizmat.** `AlertNotifier` abstract klassi port, `TelegramAlertNotifier` adapter (82-dars). Telegram API tafsilotlari, bot tokeni va xabar matni (lokalizatsiya bilan) adapterda. NestJS'da abstract klass DI token bo'la oladi, shuning uchun alohida string token kerak emas.
- **Ma'lumotlar bazasi.** Prisma so'rovlari `FuelRepository` ning domen metodlariga: `findProfileByImei`, `lastLevel`, `saveReading` (95-dars). O'qish va hodisani yozish bitta tranzaksiyada.
- **Modul.** `FuelModule` faqat `FuelEventsService` ni eksport qiladi, repository va notifier ichki (83-dars). Kalibrovka JSON satri o'rniga sxemada `tankCapacityLiters` ustuni - bu migratsiya va u expand-contract bilan qilinadi.

### 5-bosqich: xatti-harakat o'zgarishlari (28, 46, 87, 88-darslar)

Endi, va faqat endi, 1-bosqichda qayd etilgan xatolar tuzatiladi. Har biri alohida commit va har birida characterization test nomi "joriy xatti-harakat" dan "kutilgan xatti-harakat" ga o'zgaradi. Tartib xavf bo'yicha: avval ma'lumot yo'qotadiganlari (Telegram xatosi o'qishni yo'qotishi, xotiradagi holat), keyin noto'g'ri natija beradiganlari (birliklar, bo'sh bak), keyin idempotentlik (unique indeks va migratsiya).

Bu bosqichda mahsulot jamoasi bilan gaplashish kerak: "foizli datchikda chegara 10 foiz edi, endi 10 litr bo'ladi, bu kichik bakli mashinalar uchun ogohlantirishlar sonini o'zgartiradi". Bu kod qarori emas, biznes qarori.

### 6-bosqich: tekshiruv va to'xtash (1, 6, 90-darslar)

Muvaffaqiyat o'lchovi 1-darsdan: yangi talab qanchalik lokal kiritiladi? SMS kanal: yangi adapter va modul konfiguratsiyasi, biznes qoidasiga tegilmaydi. Sozlanadigan chegaralar: `detectFuelChange` ga parametr va repository'da sozlamani o'qish. Litrli datchik: `toLiters` ga bitta tarmoq.

Va to'xtash qarori. Modulda hali ham yaxshilash mumkin bo'lgan narsalar qoladi. Lekin Google'ning review standarti aytganidek, mukammal kod yo'q, faqat yaxshiroq kod bor (96-dars). Yangi talablar arzon kiritiladigan bo'lsa, tozalash o'z vazifasini bajargan.

## Misol: 3-bosqichdagi asosiy qadam

Tidying'lardan keyingi, lekin Split Phase'dan oldingi holat (qisqartirilgan):

```ts
async handle(reading: RawReading): Promise<{ ok: boolean }> {
  const vehicle = await this.prisma.vehicle.findFirst({ where: { trackerImei: reading.imei } });
  if (!vehicle) return { ok: false };

  const level = vehicle.calib ? (reading.lvl / 100) * parseCalibration(vehicle.calib).tank : reading.lvl;
  const previous = this.lastLevelByVehicle.get(vehicle.id);
  this.lastLevelByVehicle.set(vehicle.id, level);

  if (previous) {
    const delta = level - previous;
    const isStationary = reading.spd < MAX_SPEED_FOR_DRAIN_KMH;
    if (delta > REFUEL_THRESHOLD) {
      await this.saveEvent(vehicle.id, "refuel", delta);
    } else if (-delta > DRAIN_THRESHOLD && isStationary) {
      await this.saveEvent(vehicle.id, "drain", -delta);
      await this.notifyDrain(vehicle, -delta);
    }
  }
  await this.saveReading(vehicle.id, level);
  return { ok: true };
}
```

Nomlar va shartlar tozalangan, lekin aniqlash qoidasi hali ham saqlash va xabar berish bilan aralash. Split Phase'dan keyin:

```ts
type Liters = number;
type FuelChange = { kind: "none" } | { kind: "refuel"; liters: Liters } | { kind: "drain"; liters: Liters };

const REFUEL_THRESHOLD = 10;
const DRAIN_THRESHOLD = 8;
const MAX_SPEED_FOR_DRAIN_KMH = 5;

// Characterization: `previous` falsy (0 ham) bo'lsa, o'zgarish yo'q. 5-bosqichda tuzatiladi.
export function detectFuelChange(previous: Liters | undefined, current: Liters, speedKmh: number): FuelChange {
  if (!previous) return { kind: "none" };
  const delta = current - previous;
  if (delta > REFUEL_THRESHOLD) return { kind: "refuel", liters: delta };
  if (-delta > DRAIN_THRESHOLD && speedKmh < MAX_SPEED_FOR_DRAIN_KMH) return { kind: "drain", liters: -delta };
  return { kind: "none" };
}
```

E'tibor bering: `if (!previous)` ataylab saqlangan, garchi u xato bo'lsa ham. Bu refaktoring commit'i, va unda xatti-harakat o'zgarmasligi kerak. Izoh xatoni va u qachon tuzatilishini aytadi. 5-bosqichdagi alohida commit `!previous` ni `previous === undefined` ga o'zgartiradi va tegishli testni yangilaydi. Review qiluvchi ikkala commit'ni alohida ko'radi: birinchisida "faqat struktura", ikkinchisida "bitta xatti-harakat o'zgarishi va uning sababi".

Endi qoidani bazasiz test qilish mumkin:

```ts
import { describe, expect, it } from "vitest";
import { detectFuelChange } from "./fuel-change";

describe("detectFuelChange", () => {
  it("10 litrdan ko'p o'sish - quyish", () => {
    expect(detectFuelChange(20, 45, 0)).toEqual({ kind: "refuel", liters: 25 });
  });
  it("to'xtab turganda 8 litrdan ko'p kamayish - to'kish", () => {
    expect(detectFuelChange(60, 40, 0)).toEqual({ kind: "drain", liters: 20 });
  });
  it("harakatda kamayish to'kish emas", () => {
    expect(detectFuelChange(60, 40, 50)).toEqual({ kind: "none" });
  });
  it("chegara: roppa-rosa 10 litr quyish emas", () => {
    expect(detectFuelChange(20, 30, 0)).toEqual({ kind: "none" });
  });
});
```

## Qachon qo'llamaslik kerak

- **Hech kim tegmaydigan kod.** Agar modul ishlayotgan bo'lsa va unga yangi talab kelmasa, uni tozalash qiymat bermaydi. Beck'ning savoli: tozalash keyingi o'zgarishni arzonlashtiradimi? O'zgarish bo'lmasa, javob yo'q.
- **Butun modulni bir vaqtda.** Faqat yangi talablar tegadigan qismni tozalang. Qolganini Boy Scout qoidasi bilan, keyingi tashrifda (6-dars).
- **Har bir bosqichni oxirigacha.** Ba'zan 1 va 2-bosqichlar yetarli: testlar va tekis kod yangi talabni arzon qiladi. Port va repository'lar keyingi talab bilan keladi. Reja to'xtash nuqtalari bilan yozilgan, majburiy marshrut sifatida emas.
- **Qayta yozish haqiqatan arzonroq bo'lganda.** Agar modul kichik, biznes qoidalari to'liq hujjatlangan va characterization testlar barcha holatlarni qamrab olsa, ba'zan yangidan yozish tezroq. Lekin buni testlar yozilgandan keyin, ular himoyasida qaror qiling, oldin emas. Katta tizimlar uchun esa strangler fig (80-dars).
- **Tozalash va feature'ni bitta PR'da.** Vasvasa katta: "SMS qo'shayotganda butun modulni ham tuzatib qo'yaman". Natijada 2000 qatorli PR, uni hech kim chuqur review qila olmaydi va regressiya sababi topilmaydi (96-dars). Avval tozalash PR'lari, keyin feature.

## Stack'da: yakuniy checklist

Kursning stack darslarini bitta ro'yxatga yig'amiz. Har qanday NestJS va Next.js modulini review qilganda yoki tozalaganda:

- **TypeScript (91).** `strict` va `noUncheckedIndexedAccess`, chegarada `unknown` va parser, `any` va `as` yo'q.
- **NestJS (94).** Yupqa controller, domen tilidagi service, DTO klass va global ValidationPipe, domen xatolari filter'da tarjima qilinadi, `@Global` kamdan-kam.
- **Ma'lumotlar bazasi (95).** Domen metodli so'rovlar, sikl ichida `await` yo'q, migratsiyalar muzlatilgan va expand-contract bilan.
- **React va Next.js (92, 93).** Minimal state, keraksiz effekt yo'q, client chegarasi barglarda, DAL va `server-only`, Server Action'da authorization.
- **Testlar (61-70).** Xatti-harakatni tekshiradigan testlar, sof yadro uchun unit, chegaralar uchun integratsion, implementatsiyani takrorlaydigan test yo'q.
- **Jamoa (96-98).** Kichik PR'lar, struktura va xatti-harakat alohida, darajali review izohlari, metrikalar signal sifatida, AI kodi to'liq review bilan.
- **Performance (99).** Ish hajmi doim to'g'ri, ish narxi faqat o'lchovdan keyin.

## Xulosa

- Legacy kod - testsiz kod. Tozalash characterization testlar va minimal seam'lardan boshlanadi, yashirin xatolar ham avval qayd etiladi.
- Kichik tidying'lar (nomlar, konstantalar, guard clause) keyingi katta qadamlarni ko'rinadigan qiladi.
- Split Phase biznes qoidasini sof funksiyaga chiqaradi, port va repository'lar tashqi dunyoni chegaraga suradi.
- Struktura va xatti-harakat o'zgarishlari alohida commit'larda, xato tuzatishlar oxirida va har biri o'z testi bilan.
- Muvaffaqiyat o'lchovi - kursning birinchi darsidagi savol: keyingi talab qanchalik lokal va xavfsiz kiritiladi.
