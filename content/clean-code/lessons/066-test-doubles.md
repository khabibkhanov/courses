---
n: 66
slug: test-doubles
title: "Test doubles va ortiqcha mocking"
summary: "Mock, stub, fake, spy va dummy - bular bir xil narsa emas. Bu darsda Meszaros taksonomiyasini, state va behavior verification farqini, Fowler tasvirlagan classicist va mockist maktablarini va ortiqcha mocking qanday qilib mo'rt, yolg'on testlarga olib kelishini ko'rib chiqamiz."
duration: 40
sources:
  - id: xunit-patterns
    note: "Test Double patterni va uning turlari (Dummy, Fake, Stub, Spy, Mock); Principles of Test Automation: Use the Front Door First; Fragile Test va Overspecified Software"
  - id: fowler-mocks-arent-stubs
    note: "Test double turlari, state va behavior verification, classical va mockist TDD farqlari, implementatsiyaga bog'lanish xavfi va Fowlerning shaxsiy tanlovi"
quiz:
  - q: "Testda `PaymentGateway` o'rniga `charge()` chaqirilganda har doim `{ status: 'approved' }` qaytaradigan obyekt ishlatildi va test faqat buyurtma holatini tekshiradi. Meszaros bo'yicha bu nima?"
    options:
      - "Mock"
      - "Stub: tayyor javob qaytaradi, tekshiruv esa SUT holati orqali"
      - "Fake"
      - "Dummy"
    answer: 1
    explain: "Stub test davomida chaqiruvlarga oldindan tayyorlangan javob beradi. Mock'dan farqi: unga qanday chaqirilishi kerakligi haqida kutish (expectation) qo'yilmagan va test state verification ishlatadi."
  - q: "`InMemoryVehicleRepository` - Map ustida ishlaydigan, `save`, `findById`, `findByPlate` metodlari real ishlaydigan klass. Bu qaysi tur?"
    options:
      - "Spy"
      - "Stub"
      - "Fake: ishlaydigan, lekin production uchun yaramaydigan qisqartirilgan implementatsiya"
      - "Mock"
    answer: 2
    explain: "Fake haqiqiy xatti-harakatga ega: saqlangan narsani qaytaradi, qidiradi. U faqat soddalashtirilgan (xotirada, tranzaksiyasiz). Fowler in-memory ma'lumotlar bazasini fake'ning klassik misoli sifatida keltiradi."
  - q: "Fowler bo'yicha mockist testlarning asosiy xavfi qaysi?"
    options:
      - "Ular SUT hamkorlarini qanday chaqirishiga bog'lanadi, shuning uchun xatti-harakat saqlangan refaktoring ham testlarni yiqitishi mumkin"
      - "Ular juda sekin"
      - "Ular faqat Java'da ishlaydi"
      - "Ular xatoni joyini aniq ko'rsatmaydi"
    answer: 0
    explain: "Behavior verification implementatsiyani tekshiradi: qaysi metod, qaysi argument bilan, necha marta. Ichki tuzilma o'zgarsa, natija bir xil bo'lsa ham test yiqiladi. Xato joyini aniq ko'rsatish esa aksincha, mockist testlarning afzalligi."
  - q: "Fowler o'zini qaysi maktabga mansub deb biladi?"
    options:
      - "Mockist, chunki u izolyatsiyani qadrlaydi"
      - "Hech qaysi, u TDD'ga qarshi"
      - "Ikkalasiga ham teng"
      - "Classicist, lekin mockist TDD'ni jiddiy sinab ko'rmaganini va yaxshi dasturchilar uni afzal ko'rishini tan oladi"
    answer: 3
    explain: "Fowler o'zini classicist deb ataydi va testlarni implementatsiyaga bog'lashdan xavotirda. Lekin u halol: mockist yondashuvni jiddiy sinamaganini va uni tanlaydigan malakali dasturchilar borligini aytadi."
  - q: "Test `expect(repo.findById).toHaveBeenCalledWith('v-1')` va `expect(repo.save).toHaveBeenCalledTimes(1)` bilan tugaydi, lekin servis qaytargan natija tekshirilmaydi. Bu qaysi muammo?"
    options:
      - "Mystery Guest"
      - "Overspecified Software: test qanday ishlashni tekshiradi, nima natija berishini emas"
      - "Slow Test"
      - "Bu to'g'ri, chunki natijani tekshirish shart emas"
    answer: 1
    explain: "Meszaros Fragile Test sabablaridan biri sifatida Overspecified Software'ni ko'rsatadi: test implementatsiyaning keraksiz detallarini qotiradi. Servis keshni qo'shsa yoki findById o'rniga findByIds ishlatsa, natija to'g'ri bo'lsa ham test yiqiladi."
  - q: "Qaysi holatda behavior verification (mock bilan chaqiruvni tekshirish) haqiqatan o'rinli?"
    options:
      - "Har doim, chunki u testni izolyatsiya qiladi"
      - "Repository'dan o'qishni tekshirishda"
      - "Natija faqat tashqi tizimga chiqadigan side effect bo'lganda, masalan SMS yuborish yoki to'lov provayderiga so'rov, va uni holat orqali kuzatib bo'lmasa"
      - "Hech qachon"
    answer: 2
    explain: "Meszaros ham avval state verification'ni, u yetarli bo'lmaganda behavior verification'ni tavsiya qiladi. Tashqi tizimga chiqadigan buyruq (command) - kuzatiladigan natijaning o'zi. O'qish (query) chaqiruvlarini esa tekshirish odatda ortiqcha."
task:
  title: "Mock'larga bog'langan testni qayta yozish"
  prompt: |
    Quyidagi Jest testi NestJS servisini tekshiradi: haydovchiga jarima qo'llanganda uning reytingi kamayadi va SMS yuboriladi. Testda hamma narsa mock qilingan.

    1. Testdagi har bir double'ni Meszaros bo'yicha tasniflang.
    2. Qaysi tasdiqlar natijani, qaysilari implementatsiyani tekshirishini aniqlang.
    3. Repository uchun fake yozing va testni state verification bilan qayta yozing.
    4. Behavior verification'ni faqat haqiqiy tashqi side effect (SMS) uchun qoldiring.
    5. Bitta refaktoringni tasavvur qiling (masalan, servis endi `findById` o'rniga `findByIdOrFail` ishlatadi) va qaysi test yiqilishini ko'rsating.
  lang: ts
  starter: |
    import { DriverPenaltyService } from "./driver-penalty.service";

    describe("DriverPenaltyService", () => {
      it("applies penalty", async () => {
        const repo = {
          findById: jest.fn().mockResolvedValue({ id: "d-1", phone: "+998901234567", score: 90 }),
          save: jest.fn().mockResolvedValue(undefined),
        };
        const sms = { send: jest.fn().mockResolvedValue(undefined) };
        const clock = { now: jest.fn().mockReturnValue(new Date("2026-10-20T10:00:00Z")) };
        const service = new DriverPenaltyService(repo, sms, clock);

        await service.applyPenalty("d-1", { kind: "speeding", points: 15 });

        expect(repo.findById).toHaveBeenCalledWith("d-1");
        expect(repo.findById).toHaveBeenCalledTimes(1);
        expect(clock.now).toHaveBeenCalled();
        expect(repo.save).toHaveBeenCalledWith({
          id: "d-1",
          phone: "+998901234567",
          score: 75,
        });
        expect(sms.send).toHaveBeenCalledTimes(1);
      });
    });
  solution: |
    import { DriverPenaltyService } from "./driver-penalty.service";
    import type { Driver, DriverRepository, SmsSender } from "./ports";

    class InMemoryDriverRepository implements DriverRepository {
      private readonly drivers = new Map<string, Driver>();

      constructor(initial: Driver[] = []) {
        for (const d of initial) this.drivers.set(d.id, { ...d });
      }

      async findById(id: string): Promise<Driver | null> {
        const driver = this.drivers.get(id);
        return driver ? { ...driver } : null;
      }

      async save(driver: Driver): Promise<void> {
        this.drivers.set(driver.id, { ...driver });
      }
    }

    class RecordingSmsSender implements SmsSender {
      readonly sent: { phone: string; text: string }[] = [];

      async send(phone: string, text: string): Promise<void> {
        this.sent.push({ phone, text });
      }
    }

    const fixedClock = { now: () => new Date("2026-10-20T10:00:00Z") };

    function setup(driver: Driver = { id: "d-1", phone: "+998901234567", score: 90 }) {
      const drivers = new InMemoryDriverRepository([driver]);
      const sms = new RecordingSmsSender();
      const service = new DriverPenaltyService(drivers, sms, fixedClock);
      return { drivers, sms, service };
    }

    describe("DriverPenaltyService.applyPenalty", () => {
      it("haydovchi reytingini jarima ballari miqdorida kamaytiradi", async () => {
        const { drivers, service } = setup();

        await service.applyPenalty("d-1", { kind: "speeding", points: 15 });

        expect(await drivers.findById("d-1")).toMatchObject({ score: 75 });
      });

      it("haydovchiga jarima haqida SMS yuboradi", async () => {
        const { sms, service } = setup();

        await service.applyPenalty("d-1", { kind: "speeding", points: 15 });

        expect(sms.sent).toEqual([
          { phone: "+998901234567", text: expect.stringContaining("15") },
        ]);
      });

      it("reytingni 0 dan pastga tushirmaydi", async () => {
        const { drivers, service } = setup({ id: "d-1", phone: "+998901234567", score: 10 });

        await service.applyPenalty("d-1", { kind: "speeding", points: 15 });

        expect(await drivers.findById("d-1")).toMatchObject({ score: 0 });
      });
    });
  solutionNotes: |
    - Starter'dagi double'lar: `repo` - mock (findById stub sifatida javob beradi, lekin chaqiruvlar tekshiriladi), `sms` - mock, `clock` - stub, lekin uning chaqirilishi ham tekshirilgan, bu ortiqcha.
    - `findById` chaqirilgani, necha marta chaqirilgani va `clock.now` chaqirilgani - bular implementatsiya. Foydalanuvchi uchun muhim natija ikkita: reyting kamaydi va SMS ketdi.
    - `InMemoryDriverRepository` - fake. U haqiqiy xatti-harakatga ega, shuning uchun test endi "saqlangan haydovchining reytingi 75" deb so'raydi, "save shu argument bilan chaqirildi" deb emas.
    - `RecordingSmsSender` - spy: u chaqiruvlarni yozib oladi. SMS tashqi side effect, uni holat orqali boshqa yo'l bilan kuzatib bo'lmaydi, shuning uchun bu yerda behavior verification o'rinli.
    - Refaktoring sinovi: servis `findByIdOrFail` yoki kesh ishlatsa, starter'dagi test yiqiladi, yangi testlar esa o'tadi, chunki natija o'zgarmagan.
    - Yangi test (0 dan pastga tushmaslik) fake bilan oson qo'shildi: mock'lar bilan esa yana bir `mockResolvedValue` va `toHaveBeenCalledWith` kerak edi.
    - Fake'ning o'zi ham kod: u real repository bilan bir xil shartnomaga ega ekanini tekshirish uchun ikkalasiga umumiy shartnoma testi yozish foydali (68-dars).
  checklist:
    - "Har bir double turi nomlangan (stub, mock, spy, fake)"
    - "Repository uchun fake yozilgan va testlar natija holatini tekshiradi"
    - "Query chaqiruvlari (findById, clock.now) tekshirilmaydi"
    - "Behavior verification faqat tashqi side effect (SMS) uchun qolgan"
    - "Refaktoring sinovi bilan eski va yangi testlar farqi ko'rsatilgan"
---

## Muammo

NestJS loyihasida servis uchun test yozish ko'pincha shunday boshlanadi: konstruktordagi har bir dependency uchun `jest.fn()`, har bir chaqiruv uchun `mockResolvedValue`, oxirida esa `toHaveBeenCalledWith`. Test yashil, coverage yuqori. Olti oydan keyin kimdir repository'ga kesh qo'shadi yoki ikki so'rovni bittaga birlashtiradi. Xatti-harakat bir xil, foydalanuvchi hech narsani sezmaydi, lekin 40 ta test yiqiladi. Dasturchi ularni "tuzatadi": yangi chaqiruvlarga mos `mockResolvedValue`larni yozadi. Testlar yana yashil, lekin endi ular faqat kodning yangi shaklini qayd etadi.

Teskari muammo ham bor. Repository mock qilingan va `findActiveVehicles` har doim tayyor massiv qaytaradi. Production'da esa SQL so'rovidagi `WHERE` sharti noto'g'ri, arxivlangan mashinalar ham chiqadi. Testlar buni hech qachon topmaydi, chunki SQL umuman ishga tushmaydi.

Birinchi holatda testlar **mo'rt** (yolg'on salbiy natija: kod to'g'ri, test yiqiladi). Ikkinchi holatda testlar **yolg'onchi** (yolg'on ijobiy natija: kod buzilgan, test o'tadi). Ikkala muammoning ildizi bitta: test double'larni noto'g'ri tanlash va noto'g'ri narsani tekshirish.

## Asosiy g'oya

### Meszaros taksonomiyasi

Gerard Meszaros *xUnit Test Patterns* kitobida test paytida haqiqiy obyekt o'rnini bosuvchi har qanday obyekt uchun umumiy atama kiritadi: **Test Double** (kinodagi kaskadyor dublyori kabi). Martin Fowler *Mocks Aren't Stubs* maqolasida bu taksonomiyani qisqacha beradi. Beshta tur:

- **Dummy** - parametr ro'yxatini to'ldirish uchun uzatiladi, lekin hech qachon ishlatilmaydi.
- **Fake** - ishlaydigan implementatsiya, lekin production uchun yaramaydigan qisqartma bilan. Klassik misol - xotiradagi ma'lumotlar bazasi.
- **Stub** - test davomida chaqiruvlarga tayyor javob qaytaradi.
- **Spy** - stub, u qanday chaqirilganini ham yozib oladi.
- **Mock** - qanday chaqiruvlarni qabul qilishi kerakligi haqida oldindan kutishlar bilan dasturlangan obyekt.

Jest va Vitest'da `jest.fn()` / `vi.fn()` bu turlarning istalganiga aylanishi mumkin. Shuning uchun "mock" so'zi kundalik tilda hamma double'lar uchun ishlatiladi. Lekin farq muhim, chunki u test nimani tekshirayotganini belgilaydi.

### State va behavior verification

Fowler ikki xil tekshiruv uslubini ajratadi:

- **State verification** - SUT bilan harakat qilingandan keyin uning (va hamkorlarining) holati tekshiriladi. "Buyurtma `paid` holatida", "repository'da reyting 75".
- **Behavior verification** - SUT hamkorlarini to'g'ri chaqirgani tekshiriladi. "`gateway.charge` 450 000 bilan bir marta chaqirildi".

Mock'lar har doim behavior verification ishlatadi. Stub'lar odatda state verification bilan birga keladi. Spy - bu stub bilan behavior verification.

### Classicist va mockist

Fowler maqolasining asosiy qismi ikki TDD maktabiga bag'ishlangan:

- **Classical (Detroit) TDD** - imkoni bo'lsa real obyektlar ishlatiladi, double faqat real narsa noqulay bo'lganda (sekin, tashqi, deterministik emas).
- **Mockist (London) TDD** - qiziqarli xatti-harakatga ega har qanday hamkor uchun mock ishlatiladi.

Fowler farqlarni bir necha o'lchovda ko'rsatadi. Mockistlar tashqaridan ichkariga (outside-in) ishlaydi: avval eng tashqi interfeys, keyin u talab qiladigan hamkorlar mock sifatida, keyin ularning implementatsiyasi. Classicistlar ko'pincha domen obyektlaridan boshlaydi. Mockist testlarda yiqilish lokal bo'ladi: xato bitta klassda bo'lsa, faqat uning testi yiqiladi. Classical testlarda esa bitta xato uni ishlatuvchi klasslarning testlarini ham yiqitishi mumkin, ba'zi classicistlar buni foydali mini-integratsion test deb biladi.

Eng muhim farq - **implementatsiyaga bog'lanish**. Fowler ta'kidlaydi: mockist testlar SUT hamkorlarini qanday chaqirishiga bog'liq, bu esa refaktoringga to'sqinlik qilishi mumkin. Classical testlar faqat yakuniy holatni tekshiradi.

Fowler o'z pozitsiyasini ochiq aytadi: u classicist, mockist TDD'ning jiddiy afzalliklarini hozircha ko'rmaydi va testlarni implementatsiyaga bog'lashdan xavotirda. Lekin u halol qo'shimcha qiladi: mockist TDD'ni jiddiy sinab ko'rmagan va uni afzal ko'radigan yaxshi dasturchilar bor. U test yiqilishlari tushunarsiz bo'lsa yoki obyektlarda xatti-harakat juda kam bo'lsa, mockist yondashuvni sinab ko'rishni maslahat beradi.

## Chuqurroq: ortiqcha mocking qanday zarar keltiradi

### Front Door First

Meszaros test avtomatlashtirish tamoyillari orasida **Use the Front Door First** ni sanaydi: obyektlarni ochiq interfeysi orqali tekshiring va imkoni bo'lsa holatni tekshiring. Orqa eshik manipulyatsiyasi va mock'larni ko'p ishlatish testlarni implementatsiya detallariga bog'laydi, ularni mo'rt qiladi va refaktoringdan qaytaradi. Uning tavsiyasi: behavior verification'ni faqat state verification yetarli bo'lmaganda ishlating, sekin yoki mavjud bo'lmagan dependency'larni almashtirishda esa mock'dan ko'ra fake'ni afzal ko'ring.

### Overspecified Software

Meszaros Fragile Test smell'ining sabablaridan biri sifatida **Overspecified Software** ni ko'rsatadi: test kod qanday ishlashini kerakligidan ortiq belgilaydi. Tipik belgilari:

- Query chaqiruvlarini tekshirish (`findById` chaqirildimi). O'qish natijaga ta'sir qiladi, va natija baribir tekshiriladi. Chaqiruvning o'zini tekshirish ortiqcha.
- Chaqiruvlar sonini tekshirish (`toHaveBeenCalledTimes(1)`), agar bu biznes talabi bo'lmasa.
- Chaqiruvlar tartibini tekshirish.
- Ichki yordamchilarni mock qilish (`jest.spyOn(service, "calculateDiscount")`).

### Command va query

Amaliy qoida: **query'lar uchun stub yoki fake, command'lar uchun spy yoki mock**. Bu 24-darsdagi Command-Query Separation bilan bog'liq. Query natijani qaytaradi va uni SUT natijasi orqali tekshirish mumkin. Command esa tashqi dunyoni o'zgartiradi (SMS, email, to'lov, navbatga xabar) va agar bu o'zgarishni holat orqali kuzatib bo'lmasa, chaqiruvning o'zi kuzatiladigan natija bo'ladi.

### Yolg'on ijobiy natijalar

Mock'lar boshqa xavfni ham olib keladi: ular sizning dependency haqidagi taxminingizni qotiradi. Agar `repo.findActive` mock qilingan bo'lsa, test "repository to'g'ri ishlaydi" degan taxminga tayanadi. Bu taxmin hech qayerda tekshirilmasa, xatolar yashirinadi. Yechim: double ishlatilgan har bir chegarani boshqa darajada real implementatsiya bilan tekshiring. Repository uchun bu real PostgreSQL bilan integratsion test (68-dars). Fake uchun esa fake va real implementatsiyaga bir xil testlar to'plamini ishga tushirish (shartnoma testi).

### "O'zingizga tegishli bo'lmagan narsani mock qilmang"

Mockist hamjamiyatda keng tarqalgan maslahat: uchinchi tomon kutubxonasini (masalan, Prisma client yoki axios) to'g'ridan-to'g'ri mock qilmang. Uning o'rniga o'z interfeysingizni (port) yarating, kutubxonani adapter ichiga o'rang va testda o'z interfeysingizni double bilan almashtiring (50-dars). Aks holda testlar kutubxona API'sining ichki tuzilishini qotiradi va kutubxona yangilanganda yolg'on natija beradi.

## Misol: ijara bronini tasdiqlash

Servis bronni tasdiqlaydi: mashina bandmi tekshiradi, bronni saqlaydi, mijozga email yuboradi.

```ts
export type Booking = { id: string; carId: string; status: "pending" | "confirmed"; email: string };

export interface BookingRepository {
  findById(id: string): Promise<Booking | null>;
  hasConfirmedOverlap(booking: Booking): Promise<boolean>;
  save(booking: Booking): Promise<void>;
}

export interface Mailer {
  send(to: string, subject: string): Promise<void>;
}

export class BookingConfirmationService {
  constructor(
    private readonly bookings: BookingRepository,
    private readonly mailer: Mailer,
  ) {}

  async confirm(id: string): Promise<Booking> {
    const booking = await this.bookings.findById(id);
    if (!booking) throw new Error(`Bron topilmadi: ${id}`);
    if (await this.bookings.hasConfirmedOverlap(booking)) {
      throw new Error("Mashina bu sanalarda band");
    }
    const confirmed: Booking = { ...booking, status: "confirmed" };
    await this.bookings.save(confirmed);
    await this.mailer.send(booking.email, "Bron tasdiqlandi");
    return confirmed;
  }
}
```

Mockist uslubdagi, implementatsiyani qotiruvchi test:

```ts
it("confirms booking", async () => {
  const repo = {
    findById: vi.fn().mockResolvedValue({ id: "b-1", carId: "c-1", status: "pending", email: "a@b.uz" }),
    hasConfirmedOverlap: vi.fn().mockResolvedValue(false),
    save: vi.fn(),
  };
  const mailer = { send: vi.fn() };

  await new BookingConfirmationService(repo, mailer).confirm("b-1");

  expect(repo.findById).toHaveBeenCalledWith("b-1");
  expect(repo.hasConfirmedOverlap).toHaveBeenCalledTimes(1);
  expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ status: "confirmed" }));
  expect(mailer.send).toHaveBeenCalled();
});
```

Bu testda to'rtta tasdiqdan ikkitasi (`findById` va `hasConfirmedOverlap` chaqiruvlari) implementatsiya. Agar servis band-ligini tekshirishni bitta SQL so'rovga (`findConfirmableById`) birlashtirsa, test yiqiladi. Bundan tashqari, `hasConfirmedOverlap` doim `false` qaytaradi, demak "mashina band" degan eng muhim qoida umuman tekshirilmagan.

Fake va spy bilan:

```ts
import { describe, expect, it } from "vitest";

class InMemoryBookingRepository implements BookingRepository {
  private readonly rows = new Map<string, Booking>();

  constructor(initial: Booking[]) {
    initial.forEach((b) => this.rows.set(b.id, { ...b }));
  }

  async findById(id: string) {
    const row = this.rows.get(id);
    return row ? { ...row } : null;
  }

  async hasConfirmedOverlap(booking: Booking) {
    // soddalashtirilgan: sanalar o'rniga faqat mashina bo'yicha
    return [...this.rows.values()].some(
      (b) => b.id !== booking.id && b.carId === booking.carId && b.status === "confirmed",
    );
  }

  async save(booking: Booking) {
    this.rows.set(booking.id, { ...booking });
  }
}

class MailerSpy implements Mailer {
  readonly sent: { to: string; subject: string }[] = [];
  async send(to: string, subject: string) {
    this.sent.push({ to, subject });
  }
}

const pending = (id: string, carId = "c-1"): Booking => ({ id, carId, status: "pending", email: "mijoz@mail.uz" });

describe("BookingConfirmationService.confirm", () => {
  it("bo'sh mashina uchun bronni tasdiqlaydi va saqlaydi", async () => {
    const bookings = new InMemoryBookingRepository([pending("b-1")]);
    const service = new BookingConfirmationService(bookings, new MailerSpy());

    await service.confirm("b-1");

    expect(await bookings.findById("b-1")).toMatchObject({ status: "confirmed" });
  });

  it("mashina band bo'lsa tasdiqlamaydi", async () => {
    const bookings = new InMemoryBookingRepository([
      { ...pending("b-0"), status: "confirmed" },
      pending("b-1"),
    ]);
    const service = new BookingConfirmationService(bookings, new MailerSpy());

    await expect(service.confirm("b-1")).rejects.toThrow("band");
    expect(await bookings.findById("b-1")).toMatchObject({ status: "pending" });
  });

  it("mijozga tasdiq emailini yuboradi", async () => {
    const mailer = new MailerSpy();
    const service = new BookingConfirmationService(
      new InMemoryBookingRepository([pending("b-1")]),
      mailer,
    );

    await service.confirm("b-1");

    expect(mailer.sent).toEqual([{ to: "mijoz@mail.uz", subject: "Bron tasdiqlandi" }]);
  });
});
```

Nima o'zgardi:

- **Query'lar tekshirilmaydi.** Testlar servis repository'dan qanday o'qishiga e'tibor bermaydi. Refaktoring (so'rovlarni birlashtirish, kesh) testlarni buzmaydi.
- **Asosiy qoida endi tekshiriladi.** Fake real xatti-harakatga ega bo'lgani uchun "mashina band" holatini ma'lumot orqali yaratish mumkin. Mock bilan bu yana bir `mockResolvedValue(true)` bo'lardi va u qoidani emas, servis shu metodga tayanishini tekshirardi.
- **Email - command, shuning uchun spy.** Email yuborilganini boshqa yo'l bilan kuzatib bo'lmaydi. Spy yozib olgan ro'yxat aniq va o'qiladigan tasdiq beradi.
- **Fake'ning narxi bor.** `hasConfirmedOverlap` soddalashtirilgan. Real SQL'dagi sana kesishuvi mantiqi alohida, real PostgreSQL bilan integratsion testda tekshirilishi kerak.

## Qachon qo'llamaslik kerak

- **Fake'ni hamma joyda.** Murakkab so'rovli repository uchun fake yozish uning SQL'ini JavaScript'da qayta yozish degani. Bunday holatda Testcontainers bilan real DB arzonroq va ishonchliroq bo'lishi mumkin (68-dars).
- **Mockist uslubdan butunlay voz kechish.** Outside-in dizaynda, hali implementatsiyasi yo'q hamkorning interfeysini kashf qilishda mock'lar foydali: ular "menga qanday hamkor kerak" degan savolni dizayn qaroriga aylantiradi. Fowler ham bu yondashuvni tanlaydigan yaxshi dasturchilar borligini tan oladi.
- **Behavior verification'ni taqiqlash.** To'lov provayderiga so'rov, navbatga xabar, audit log - bular buyruqlar va ularni tekshirish to'g'ri. Muammo faqat ortiqcha belgilashda.
- **Sekin yoki deterministik bo'lmagan dependency.** Vaqt, tasodifiylik, tashqi API'lar uchun stub majburiy. Ularni real ishlatish testni Repeatable xususiyatidan mahrum qiladi (62-dars).

## Stack'da: NestJS, Vitest, Jest

- **`overrideProvider(...).useValue(...)`** NestJS testing modulida provider'ni double bilan almashtiradi. Bu yerga `vi.fn()` to'plamidan ko'ra `useClass(InMemoryVehicleRepository)` yoki fake instansiyasini berish ko'pincha toza.
- **`useMocker`** barcha yetishmayotgan dependency'larni avtomatik mock qiladi. Qulay, lekin xavfli: test qaysi dependency'ga tayanayotganini yashiradi. Uni faqat test uchun ahamiyatsiz dependency'lar uchun ishlating.
- **`vi.spyOn(obj, "method")`** - real metodni saqlagan holda chaqiruvlarni yozadi. SUT'ning o'z metodlariga ishlatmang: bu ichki implementatsiyani qotiradi.
- **`vi.mock("module")`** butun modulni almashtiradi. Bu kuchli vosita, lekin ko'pincha dependency injection yetishmayotganining belgisi (67-dars).
- **Tiplar.** Fake `implements BookingRepository` deb e'lon qilinsa, interfeys o'zgarganda TypeScript fake'ni ham yangilashga majbur qiladi. `vi.fn()` obyektlari esa bu himoyani bermaydi.

## Xulosa

- Test double - umumiy atama. Dummy, fake, stub, spy va mock turli maqsadlarga xizmat qiladi.
- State verification natijani, behavior verification chaqiruvlarni tekshiradi. Imkoni bo'lsa birinchisini tanlang.
- Classicist real obyektlar va holatni, mockist esa mock'lar va o'zaro ta'sirni afzal ko'radi. Fowler classicist, lekin mockist yondashuvni ham hurmat qiladi.
- Query'lar uchun stub yoki fake, tashqi command'lar uchun spy yoki mock.
- Ortiqcha mocking ikki zarar beradi: refaktoringda yolg'on yiqilish va dependency xatolarini yashirish.
- Har bir double ishlatilgan chegarani boshqa darajada real implementatsiya bilan tekshiring.
