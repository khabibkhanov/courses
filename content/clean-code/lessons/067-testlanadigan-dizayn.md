---
n: 67
slug: testlanadigan-dizayn
title: "Testlanadigan dizayn: functional core, imperative shell"
summary: "Test qilish qiyin bo'lgan kod odatda dizayn muammosini ko'rsatadi. Bu darsda Gary Bernhardtning qiymatlarni chegara sifatida ishlatish g'oyasini va 'functional core, imperative shell' yondashuvini, NestJS'da DI orqali seam yaratishni va bu ikki texnikaning qachon bir-birini to'ldirishini ko'rib chiqamiz."
duration: 40
sources:
  - id: bernhardt-boundaries
    note: "\"Boundaries\" (SCNA 2012): oddiy qiymatlarni komponentlar orasidagi chegara sifatida ishlatish, test double'li va double'siz izolyatsiyalangan unit testlar; oxirida tilga olingan Functional Core, Imperative Shell g'oyasi"
  - id: nestjs-providers
    note: "Providers va dependency injection; custom providers (useValue, useClass, useFactory, Symbol token'lar) va testlarda provider'ni almashtirish"
quiz:
  - q: "Funksiya ichida `new Date()`, `await prisma.trip.findMany()` va 30 qatorli hisob-kitob bor. Uni unit test qilish qiyin. Bu nimaning belgisi?"
    options:
      - "Test freymvorki zaif"
      - "Prisma'ni mock qilish kerak"
      - "Qaror qabul qiluvchi logika va I/O (vaqt, DB) bitta joyda aralashgan. Logikani qiymat qabul qilib, qiymat qaytaradigan funksiyaga ajratish kerak"
      - "Funksiya juda qisqa"
    answer: 2
    explain: "Test qilish qiyinligi ko'pincha dizayn signali. Hisob-kitob vaqt va DB'ga bog'liq emas, u faqat ma'lumotga bog'liq. Uni sof funksiyaga ajratsangiz, mock kerak bo'lmaydi va I/O qismi yupqa qobiqqa aylanadi."
  - q: "'Functional core, imperative shell' arxitekturasida qaysi qism ko'p unit test oladi va qaysi qism integratsion test oladi?"
    options:
      - "Core ko'p unit test oladi (tez, double'siz), shell esa kam sonli integratsion test oladi (tarmoqlanish kam)"
      - "Ikkalasi ham faqat unit test"
      - "Shell ko'p unit test oladi, core esa integratsion"
      - "Hech biri test talab qilmaydi"
    answer: 0
    explain: "Core'da qarorlar va tarmoqlanish yashaydi, uni qiymatlar bilan arzon tekshirish mumkin. Shell'da esa tarmoqlanish deyarli yo'q, u faqat I/O'ni ulaydi. Uni real dependency'lar bilan bir nechta integratsion test yetarli tekshiradi."
  - q: "Bernhardt chegaralar haqida gapirganda nimani taklif qiladi?"
    options:
      - "Komponentlar orasida interfeys emas, ulkan obyektlar uzatish"
      - "Komponentlar va quyi tizimlar orasidagi chegara sifatida oddiy qiymatlardan foydalanish"
      - "Har bir klassni mock qilish"
      - "Faqat e2e testlar yozish"
    answer: 1
    explain: "Bernhardt chiqishining asosiy g'oyasi: oddiy qiymatlar faqat ma'lumot saqlash uchun emas, balki komponentlar orasidagi chegara uchun ham. Qiymat bilan gaplashadigan komponentni double'siz test qilish oson."
  - q: "NestJS'da `Clock` interfeysini DI orqali berish uchun qaysi yondashuv to'g'ri?"
    options:
      - "`constructor(private clock: Clock)` - interfeys token sifatida ishlaydi"
      - "Global `Date.now`ni monkey-patch qilish"
      - "`@Injectable()` dekoratorini interfeysga qo'yish"
      - "`Symbol` yoki abstract class token yaratish va `@Inject(CLOCK)` bilan olish, chunki TypeScript interfeyslari runtime'da yo'q"
    answer: 3
    explain: "NestJS hujjati ta'kidlaydi: interfeyslar faqat kompilyatsiya vaqtida mavjud, shuning uchun token bo'la olmaydi. String, Symbol yoki abstract class ishlatiladi. Testda esa `overrideProvider(CLOCK).useValue(fixedClock)` bilan almashtiriladi."
  - q: "Qachon DI orqali double berish 'functional core'ga ajratishdan yaxshiroq?"
    options:
      - "Hech qachon"
      - "Qaror jarayonning o'rtasida I/O natijasiga bog'liq bo'lsa va ish oqimini (masalan, qayta urinish, tranzaksiya) tekshirish kerak bo'lsa"
      - "Har doim, chunki NestJS DI'ga asoslangan"
      - "Faqat frontend kodida"
    answer: 1
    explain: "Ba'zan logika I/O bilan chuqur bog'langan: 'to'lov provayderi timeout bersa, 3 marta qayta urin, keyin bekor qil'. Bu oqimning o'zi tekshiriladigan xatti-harakat. Bunday hollarda shell'dagi orkestratsiyani port va double bilan tekshirish o'rinli."
  - q: "Quyidagi qaysi o'zgarish kodni testlanadigan qiladi, lekin dizaynni yomonlashtiradi?"
    options:
      - "Vaqtni argument sifatida qabul qilish"
      - "Hisob-kitobni sof funksiyaga ajratish"
      - "Faqat test uchun private metodni public qilish yoki production kodga `if (process.env.NODE_ENV === 'test')` qo'shish"
      - "Repository interfeysini ajratish"
    answer: 2
    explain: "Meszaros test logikasini production kodidan tashqarida saqlashni tavsiya qiladi. Faqat test uchun ochilgan metod yoki test-flag inkapsulyatsiyani buzadi. Vocke ham private metodni test qilish istagini dizayn muammosi belgisi deb biladi."
task:
  title: "Servisni core va shell'ga ajratish"
  prompt: |
    Quyidagi NestJS servisi kecha tugagan sayohatlar bo'yicha haydovchilarga bonus hisoblaydi va saqlaydi. Uni test qilish uchun hozir Prisma, vaqt va logger mock qilinadi.

    1. Qaror qabul qiluvchi logikani (bonus qoidalari) sof funksiyaga ajrating: kirish - sayohatlar ro'yxati va qoida, chiqish - bonuslar ro'yxati.
    2. Servisni yupqa shell'ga aylantiring: vaqtni oladi, ma'lumotni o'qiydi, core'ni chaqiradi, natijani yozadi.
    3. Vaqt uchun `CLOCK` token va `Clock` interfeysini kiriting.
    4. Core uchun double'siz unit testlar yozing (kamida 4 ta holat).
    5. Shell uchun qanday test yozishingizni qisqacha tasvirlang.
  lang: ts
  starter: |
    import { Injectable, Logger } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";

    @Injectable()
    export class DriverBonusService {
      private readonly logger = new Logger(DriverBonusService.name);

      constructor(private readonly prisma: PrismaService) {}

      async calculateYesterdayBonuses(): Promise<void> {
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const trips = await this.prisma.trip.findMany({
          where: { finishedAt: { gte: from, lt: to } },
        });

        const byDriver = new Map<string, { km: number; harsh: number }>();
        for (const t of trips) {
          const s = byDriver.get(t.driverId) ?? { km: 0, harsh: 0 };
          s.km += t.distanceKm;
          s.harsh += t.harshBrakingCount;
          byDriver.set(t.driverId, s);
        }

        for (const [driverId, s] of byDriver) {
          if (s.km < 100) continue;
          let amount = Math.floor(s.km / 100) * 20_000;
          if (s.harsh === 0) amount += 50_000;
          if (s.harsh > 5) amount = 0;
          if (amount > 0) {
            await this.prisma.bonus.create({ data: { driverId, amount, date: from } });
            this.logger.log(`Bonus ${driverId}: ${amount}`);
          }
        }
      }
    }
  solution: |
    // driver-bonus.rules.ts - functional core
    export type FinishedTrip = { driverId: string; distanceKm: number; harshBrakingCount: number };
    export type Bonus = { driverId: string; amount: number };

    export const BONUS_RULES = {
      minDailyKm: 100,
      perHundredKm: 20_000,
      safeDrivingBonus: 50_000,
      maxHarshBrakings: 5,
    } as const;

    export function calculateDailyBonuses(
      trips: FinishedTrip[],
      rules = BONUS_RULES,
    ): Bonus[] {
      const totals = new Map<string, { km: number; harsh: number }>();
      for (const trip of trips) {
        const t = totals.get(trip.driverId) ?? { km: 0, harsh: 0 };
        t.km += trip.distanceKm;
        t.harsh += trip.harshBrakingCount;
        totals.set(trip.driverId, t);
      }

      const bonuses: Bonus[] = [];
      for (const [driverId, { km, harsh }] of totals) {
        if (km < rules.minDailyKm || harsh > rules.maxHarshBrakings) continue;
        const distancePart = Math.floor(km / 100) * rules.perHundredKm;
        const safetyPart = harsh === 0 ? rules.safeDrivingBonus : 0;
        bonuses.push({ driverId, amount: distancePart + safetyPart });
      }
      return bonuses;
    }

    export function previousDay(now: Date): { from: Date; to: Date } {
      const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
      return { from, to };
    }

    // clock.ts
    export interface Clock {
      now(): Date;
    }
    export const CLOCK = Symbol("CLOCK");

    // driver-bonus.service.ts - imperative shell
    import { Inject, Injectable, Logger } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";
    import { CLOCK, type Clock } from "./clock";
    import { calculateDailyBonuses, previousDay } from "./driver-bonus.rules";

    @Injectable()
    export class DriverBonusService {
      private readonly logger = new Logger(DriverBonusService.name);

      constructor(
        private readonly prisma: PrismaService,
        @Inject(CLOCK) private readonly clock: Clock,
      ) {}

      async calculateYesterdayBonuses(): Promise<void> {
        const { from, to } = previousDay(this.clock.now());
        const trips = await this.prisma.trip.findMany({
          where: { finishedAt: { gte: from, lt: to } },
          select: { driverId: true, distanceKm: true, harshBrakingCount: true },
        });

        const bonuses = calculateDailyBonuses(trips);

        await this.prisma.bonus.createMany({
          data: bonuses.map((b) => ({ ...b, date: from })),
        });
        this.logger.log(`${bonuses.length} ta bonus yozildi (${from.toISOString()})`);
      }
    }

    // driver-bonus.rules.spec.ts
    import { describe, expect, it } from "vitest";
    import { calculateDailyBonuses, previousDay } from "./driver-bonus.rules";

    const trip = (driverId: string, distanceKm: number, harshBrakingCount = 1) => ({
      driverId,
      distanceKm,
      harshBrakingCount,
    });

    describe("calculateDailyBonuses", () => {
      it("100 km dan kam yurgan haydovchiga bonus bermaydi", () => {
        expect(calculateDailyBonuses([trip("d1", 99)])).toEqual([]);
      });

      it("har to'liq 100 km uchun 20 000 beradi va sayohatlarni jamlaydi", () => {
        expect(calculateDailyBonuses([trip("d1", 120), trip("d1", 130)])).toEqual([
          { driverId: "d1", amount: 40_000 },
        ]);
      });

      it("keskin tormozlashsiz kun uchun 50 000 qo'shadi", () => {
        expect(calculateDailyBonuses([trip("d1", 100, 0)])).toEqual([
          { driverId: "d1", amount: 70_000 },
        ]);
      });

      it("5 tadan ortiq keskin tormozlashda bonus bermaydi", () => {
        expect(calculateDailyBonuses([trip("d1", 300, 6)])).toEqual([]);
      });

      it("haydovchilarni alohida hisoblaydi", () => {
        const result = calculateDailyBonuses([trip("d1", 200), trip("d2", 50)]);
        expect(result).toEqual([{ driverId: "d1", amount: 40_000 }]);
      });
    });

    describe("previousDay", () => {
      it("UTC bo'yicha kechagi kunning chegaralarini qaytaradi", () => {
        expect(previousDay(new Date("2026-10-20T03:15:00Z"))).toEqual({
          from: new Date("2026-10-19T00:00:00Z"),
          to: new Date("2026-10-20T00:00:00Z"),
        });
      });
    });
  solutionNotes: |
    - Core (`calculateDailyBonuses`, `previousDay`) faqat qiymatlar bilan ishlaydi: Prisma, Logger, vaqt yo'q. Testlar double'siz va millisekundlarda ishlaydi.
    - Shell'da tarmoqlanish deyarli qolmadi: o'qish, core'ni chaqirish, yozish. Uni real PostgreSQL bilan bitta-ikkita integratsion test tekshiradi (68-dars): "kechagi sayohatlar bo'yicha bonus jadvaliga to'g'ri yozuvlar tushdi".
    - Starter'da qoidaning ma'nosi yashiringan edi: `harsh > 5` sharti summani hisoblab bo'lingandan keyin 0 ga tushirardi. Natija to'g'ri, lekin "ko'p tormozlash - bonus yo'q" qoidasi koddan bir qarashda ko'rinmasdi. Core'da u birinchi shartga ko'tarildi.
    - Ikkinchi yashirin muammo: `new Date(y, m, d)` server vaqt zonasiga bog'liq. `previousDay` UTC'da ishlaydi va o'z testiga ega. Agar biznes Toshkent vaqti bo'yicha kun talab qilsa, bu qaror shu funksiyada bitta joyda o'zgaradi.
    - `CLOCK` - Symbol token, chunki `Clock` interfeysi runtime'da yo'q. Modulda `{ provide: CLOCK, useValue: { now: () => new Date() } }`, testda `overrideProvider(CLOCK).useValue(fixedClock)`.
    - `select` faqat kerakli maydonlarni oladi va Prisma tipini `FinishedTrip`ga moslaydi. Bonuslar bitta `createMany` bilan yoziladi, sikl ichida emas.
  checklist:
    - "Bonus qoidalari Prisma, Logger va vaqtsiz sof funksiyada"
    - "Core uchun kamida 4 ta double'siz unit test bor"
    - "Vaqt Clock token orqali DI bilan beriladi, new Date() servis ichida yo'q"
    - "Shell'da biznes tarmoqlanishi qolmagan"
    - "Shell qanday test qilinishi tasvirlangan"
---

## Muammo

Servis uchun unit test yozishga o'tirdingiz. Servis ichida `new Date()`, ikkita Prisma so'rovi, logger, HTTP klient va o'rtada 40 qatorli biznes logika bor. Testni yozish uchun beshta mock kerak, har biri uchun to'g'ri shakldagi javob. Bitta holatni tekshirish uchun 30 qator tayyorgarlik. Va eng yomoni: siz tekshirmoqchi bo'lgan narsa, ya'ni biznes qoidasi, mock'lar ostida ko'milgan.

Ko'p dasturchilar bu holatda "unit testlar foydasiz" degan xulosaga keladi. To'g'riroq xulosa boshqa: **test qilish qiyinligi - bu dizayn haqidagi fikr-mulohaza**. Kod test qilish qiyin bo'lsa, bu odatda bir nechta mas'uliyat bitta joyda aralashganini bildiradi: qaror qabul qilish va tashqi dunyo bilan muloqot.

Ham Vocke *Practical Test Pyramid* maqolasida (61-dars) shunga o'xshash kuzatuvni beradi: private metodni test qilish istagi ko'pincha klass juda ko'p ish qilayotganining belgisi va yechim - logikani alohida birlikka ajratish. Meszaros esa test avtomatlashtirish tamoyillari orasida **Design for Testability** va **Keep Test Logic out of Production Code** ni sanaydi. Ya'ni testlanuvchanlik dizayn talabi, lekin testga xos hiylalar production kodiga kirmasligi kerak.

66-darsda ortiqcha mock'lar testlarni mo'rt qilishini ko'rdik. Bu darsda mock'lar kerak bo'lmasligi uchun kodni qanday tuzish kerakligini ko'ramiz.

## Asosiy g'oya

### Qiymatlar chegara sifatida

Gary Bernhardt 2012 yilda SCNA konferensiyasida "Boundaries" nomli chiqish qildi. Uning markaziy g'oyasi: oddiy qiymatlar (murakkab obyektlar o'rniga) faqat ma'lumot saqlash uchun emas, balki komponentlar va quyi tizimlar orasidagi **chegara** sifatida ham ishlatilishi kerak. Chiqishda u funksional dasturlash, o'zgaruvchanlik (mutability) va OOP o'rtasidagi munosabat hamda test double'li va double'siz izolyatsiyalangan unit testlar haqida gapiradi.

G'oyaning amaliy ma'nosi: agar komponent A komponent B ga ulanish, repository yoki servis emas, balki oddiy qiymat (massiv, obyekt, raqam) uzatsa, B ni test qilish uchun hech qanday double kerak emas. Siz shunchaki qiymat yaratib, uni funksiyaga berasiz va natija qiymatini tekshirasiz.

### Functional core, imperative shell

Bernhardt chiqishining oxirida "Functional Core, Imperative Shell" g'oyasini tilga oladi (u alohida screencast'da batafsil tushuntirilgan). Bu g'oya yuqoridagidan kelib chiqadi va dasturni ikki qismga ajratadi:

- **Functional core (funksional yadro).** Barcha qarorlar shu yerda: hisob-kitob, qoidalar, tarmoqlanish, validatsiya. Kirish - qiymatlar, chiqish - qiymatlar. Side effect yo'q, vaqt va tasodifiylik argument sifatida keladi.
- **Imperative shell (imperativ qobiq).** Tashqi dunyo bilan muloqot: DB'dan o'qish, HTTP so'rovlar, vaqtni olish, loglash, natijani yozish. Shell'da qaror deyarli yo'q, u faqat core'ni chaqiradi va natijasini bajaradi.

Bu bo'linish test strategiyasini o'zi belgilaydi. Core'da tarmoqlanish ko'p, lekin dependency yo'q, shuning uchun uni ko'p sonli tez unit testlar bilan tekshirish oson. Shell'da dependency ko'p, lekin tarmoqlanish kam, shuning uchun uni bir nechta integratsion test yetarli tekshiradi. Natijada mock'lar deyarli kerak bo'lmaydi.

Bu g'oya 25-darsdagi sof funksiyalar va 82-darsdagi hexagonal arxitektura bilan bog'liq. Hexagonal arxitekturada domen portlar orqali tashqi dunyoga gapiradi. Functional core'da esa domen umuman gapirmaydi: u faqat qiymat oladi va qiymat qaytaradi.

### DI orqali seam

Har doim ham hamma logikani core'ga chiqarib bo'lmaydi. Ba'zan xatti-harakatning o'zi I/O ketma-ketligi: "to'lov provayderi timeout bersa, 3 marta qayta urin, keyin buyurtmani bekor qil". Bunday holatlar uchun ikkinchi vosita kerak: **dependency injection** orqali seam (almashtiriladigan nuqta) yaratish.

NestJS DI tizimi bu uchun qurilgan. Provider'lar konstruktor orqali olinadi va modul ularni qayerdan olishni hal qiladi. NestJS hujjatida custom provider'lar uchun uchta asosiy shakl bor: `useValue` (tayyor qiymat yoki obyekt), `useClass` (token qaysi klassga bog'lanishi) va `useFactory` (funksiya orqali yaratish, `inject` bilan dependency'lar). Hujjat yana bir muhim nuqtani ta'kidlaydi: TypeScript interfeyslari faqat kompilyatsiya vaqtida mavjud, shuning uchun ular DI token bo'la olmaydi. Buning o'rniga string, `Symbol` yoki abstract class ishlatiladi va `@Inject(TOKEN)` bilan olinadi. Testlarda esa `useValue` bilan real provider o'rniga double beriladi va uni ishlatadigan klasslar o'zgarmaydi.

## Chuqurroq: qaysi vositani qachon ishlatish

### Avval core, keyin DI

Ikki vosita bir-birini to'ldiradi, lekin tartib muhim. Birinchi savol: **bu logikani qiymatlar ustida ishlaydigan funksiyaga ajratish mumkinmi?** Ko'p hollarda javob "ha". Hisob-kitob, filtrlash, holat o'tishlari, validatsiya, formatlash - bularning hammasi qiymat oladi va qiymat qaytaradi. Faqat javob "yo'q" bo'lganda (logika I/O natijasiga qarab ketma-ket qaror qiladi) DI va double'larga murojaat qiling.

Sababi: core'dagi funksiyaning testi implementatsiyaga bog'lanmaydi. U faqat kirish va chiqishni biladi. DI orqali double bilan test esa, ehtiyot bo'lmasangiz, 66-darsdagi Overspecified Software muammosiga tushadi.

### Vaqt, tasodifiylik va identifikatorlar

Eng ko'p uchraydigan yashirin dependency'lar: `new Date()`, `Date.now()`, `Math.random()`, `crypto.randomUUID()`. Ular funksiyani deterministik bo'lmagan qiladi va testni Repeatable xususiyatidan mahrum qiladi (62-dars). Uchta yechim, afzallik tartibida:

1. **Argument sifatida bering.** `calculateDue(invoice, now)`. Eng sodda va eng aniq: funksiya imzosi uning vaqtga bog'liqligini ochiq aytadi.
2. **DI orqali port.** `@Inject(CLOCK) clock: Clock`. Shell darajasida, bir nechta joyda vaqt kerak bo'lganda.
3. **Fake timers.** `vi.useFakeTimers()` va `vi.setSystemTime()`. Kodni o'zgartirib bo'lmaganda (legacy, uchinchi tomon kutubxonasi) yoki taymerlar (`setTimeout`) ishtirok etganda.

### Shell'ni qanday test qilish

Shell yupqa bo'lsa, uni unit test qilish ko'pincha foyda bermaydi: test faqat "repository chaqirildi, core chaqirildi, natija yozildi" deb takrorlaydi. Bunday test implementatsiyaning nusxasi. Shell uchun to'g'ri test - integratsion: real (yoki Testcontainers'dagi) DB, real NestJS moduli, va natija DB'da tekshiriladi (68-dars). Bunday testlar kam bo'ladi, chunki shell'da tarmoqlanish kam.

### Testlanuvchanlik uchun dizaynni buzmaslik

Testlanadigan qilish uchun ba'zan yomon qarorlar qabul qilinadi:

- **Private metodni public qilish.** Bu inkapsulyatsiyani buzadi va testni implementatsiyaga bog'laydi. Agar private metod alohida testga loyiq bo'lsa, u alohida birlik (funksiya yoki klass) bo'lishga loyiq.
- **Production kodida test bayroqlari.** `if (process.env.NODE_ENV === "test")` - Meszaros ogohlantirgan holat. Test va production har xil kodni ishga tushiradi, demak test production'ni tekshirmaydi.
- **Har narsa uchun interfeys.** Har bir klass uchun `IService` interfeysi va DI token yaratish sayoz modullar beradi (52-dars). Port faqat haqiqiy chegara uchun kerak: DB, tashqi API, vaqt, navbat.

## Misol: avtomobil ijarasi uchun kechikish jarimasi

Mijoz mashinani kech qaytarsa, jarima hisoblanadi: birinchi 1 soat bepul, keyin har boshlangan soat uchun kunlik narxning 10% i, lekin jami bir kunlik narxdan oshmaydi. Hozirgi kod:

```ts
@Injectable()
export class ReturnService {
  constructor(
    private readonly rentals: RentalRepository,
    private readonly payments: PaymentsClient,
  ) {}

  async completeReturn(rentalId: string): Promise<void> {
    const rental = await this.rentals.findById(rentalId);
    if (!rental) throw new NotFoundException();
    const lateMs = Date.now() - rental.dueAt.getTime();
    let fee = 0;
    if (lateMs > 60 * 60 * 1000) {
      const hours = Math.ceil((lateMs - 60 * 60 * 1000) / (60 * 60 * 1000));
      fee = Math.min(hours * rental.dailyRate * 0.1, rental.dailyRate);
    }
    if (fee > 0) await this.payments.charge(rental.customerId, fee);
    await this.rentals.markReturned(rentalId, new Date(), fee);
  }
}
```

Jarima qoidasini tekshirish uchun repository, to'lov klienti va vaqt mock qilinishi kerak. Har bir chegara (59 daqiqa, 61 daqiqa, 1 soat 1 daqiqa, 30 soat) uchun to'liq mock to'plami.

Core'ga ajratamiz:

```ts
// late-fee.ts - functional core
const HOUR_MS = 60 * 60 * 1000;
const GRACE_PERIOD_MS = HOUR_MS;
const HOURLY_FEE_SHARE = 0.1;

export function calculateLateFee(dueAt: Date, returnedAt: Date, dailyRate: number): number {
  const lateMs = returnedAt.getTime() - dueAt.getTime() - GRACE_PERIOD_MS;
  if (lateMs <= 0) return 0;
  const startedHours = Math.ceil(lateMs / HOUR_MS);
  return Math.min(startedHours * dailyRate * HOURLY_FEE_SHARE, dailyRate);
}
```

Shell:

```ts
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CLOCK, type Clock } from "../shared/clock";
import { calculateLateFee } from "./late-fee";

@Injectable()
export class ReturnService {
  constructor(
    private readonly rentals: RentalRepository,
    private readonly payments: PaymentsClient,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async completeReturn(rentalId: string): Promise<void> {
    const rental = await this.rentals.findById(rentalId);
    if (!rental) throw new NotFoundException(`Ijara topilmadi: ${rentalId}`);

    const returnedAt = this.clock.now();
    const fee = calculateLateFee(rental.dueAt, returnedAt, rental.dailyRate);

    if (fee > 0) await this.payments.charge(rental.customerId, fee);
    await this.rentals.markReturned(rentalId, returnedAt, fee);
  }
}
```

Core testlari, double'siz:

```ts
import { describe, expect, it } from "vitest";
import { calculateLateFee } from "./late-fee";

const DUE = new Date("2026-10-20T10:00:00Z");
const after = (minutes: number) => new Date(DUE.getTime() + minutes * 60_000);
const DAILY = 400_000;

describe("calculateLateFee", () => {
  it.each([
    { minutesLate: -30, fee: 0 },
    { minutesLate: 60, fee: 0 },
    { minutesLate: 61, fee: 40_000 },
    { minutesLate: 120, fee: 40_000 },
    { minutesLate: 121, fee: 80_000 },
    { minutesLate: 30 * 60, fee: DAILY },
  ])("$minutesLate daqiqa kechikish -> $fee", ({ minutesLate, fee }) => {
    expect(calculateLateFee(DUE, after(minutesLate), DAILY)).toBe(fee);
  });
});
```

Nima o'zgardi:

- **Qoida bitta joyda va to'liq testlangan.** Oltita chegara holati 6 qatorli jadval. Mock'lar bilan bu 6 ta 20 qatorli test bo'lardi.
- **Ikki marta vaqt olish yo'qoldi.** Starter'da `Date.now()` va `new Date()` alohida chaqirilardi, ya'ni jarima va qaytarish vaqti bir-biridan bir necha millisekund farq qilardi. Endi `returnedAt` bitta qiymat va ikkala joyda ishlatiladi.
- **Shell'da qaror deyarli yo'q.** `if (fee > 0)` qoldi. Uni va butun oqimni bitta integratsion test tekshiradi: to'lov double'i (spy) bilan, real DB bilan.
- **`CLOCK` faqat shell'da.** Core vaqtni bilmaydi, u faqat ikki sanani oladi.

## Qachon qo'llamaslik kerak

- **CRUD qatlam.** Agar servis faqat DTO'ni repository'ga uzatsa, ajratadigan core yo'q. Sun'iy "core" yaratish sayoz funksiya beradi. Bunday kodni integratsion test bilan tekshiring.
- **Ish oqimi I/O'ning o'zi.** Qayta urinish, saga, tranzaksiya tartibi, navbat bilan ishlash - bu yerda xatti-harakat I/O ketma-ketligi. Logikaning bir qismini (masalan, "qayta urinish kerakmi" qarori) core'ga chiqarish mumkin, lekin oqimni DI va double'lar bilan tekshirish kerak bo'ladi.
- **Performance-kritik joylar.** Juda katta ma'lumotlar bilan ishlaganda "hammasini o'qib, xotirada hisoblab, keyin yozish" yondashuvi xotira yoki tezlik bo'yicha qimmat bo'lishi mumkin. Ba'zan hisob-kitobni SQL'ga qoldirish to'g'ri, va u holda test real DB bilan yoziladi.
- **Haddan tashqari portlar.** Har bir klass uchun interfeys va token yaratish testlanuvchanlik emas, ortiqcha marosim. Port faqat haqiqiy tashqi chegarada.
- **Mavjud legacy kod.** Katta servisni bir martada core va shell'ga ajratish xavfli. Avval characterization testlar, keyin kichik qadamlar (79-dars).

## Stack'da: NestJS, React

- **NestJS servisi = shell.** Controller va servis I/O'ni boshqaradi. Domen qoidalari alohida `*.rules.ts` yoki `domain/` papkasida, NestJS importlarisiz. Bu fayllarda `@nestjs/*` importi bo'lmasligini lint qoidasi bilan ham tekshirish mumkin.
- **Token'lar.** `export const CLOCK = Symbol("CLOCK")`, modulda `{ provide: CLOCK, useValue: systemClock }`, testda `Test.createTestingModule(...).overrideProvider(CLOCK).useValue(fixedClock)`.
- **`useFactory`.** Konfiguratsiyaga bog'liq dependency'lar (masalan, SMS provayder klienti) uchun. Testda butun factory o'rniga tayyor `useValue` beriladi.
- **React'da ham xuddi shu.** Komponent - shell (render, event, fetch). Hisob-kitob (narx, filtrlash, formatlash) - oddiy funksiyalar yoki custom hook ichidagi sof qism. Sof funksiya unit test oladi, komponent esa React Testing Library bilan foydalanuvchi ko'zi bilan tekshiriladi (69-dars).

## Xulosa

- Test qilish qiyinligi dizayn haqidagi signal: qaror va I/O bitta joyda aralashgan.
- Bernhardt: oddiy qiymatlarni komponentlar orasidagi chegara sifatida ishlating. Qiymat bilan gaplashadigan kodga double kerak emas.
- Functional core qarorlarni qiymatlar ustida qiladi va ko'p tez unit test oladi. Imperative shell I/O'ni ulaydi va kam sonli integratsion test oladi.
- Avval logikani core'ga chiqarishga harakat qiling. DI va double'lar I/O ketma-ketligining o'zi xatti-harakat bo'lganda kerak.
- NestJS'da interfeyslar token bo'la olmaydi: Symbol yoki abstract class bilan `@Inject` ishlating, testda `overrideProvider` bilan almashtiring.
- Testlanuvchanlik uchun inkapsulyatsiyani buzmang va production kodga test bayroqlarini qo'shmang.
