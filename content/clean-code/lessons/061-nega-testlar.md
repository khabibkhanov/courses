---
n: 61
slug: nega-testlar
title: "Nega testlar: piramida va trophy"
summary: "Testlar - bu o'zgarishga ishonch sotib olish usuli. Bu darsda test piramidasi va testing trophy modellarini solishtiramiz, ularning qaysi farazlarga tayanishini ochamiz va o'z loyihangiz uchun testlar portfelini qanday tanlashni ko'rib chiqamiz."
duration: 35
sources:
  - id: fowler-test-pyramid
    note: "Ham Vocke maqolasi: Mike Cohn piramidasi, ikki asosiy qoida, solitary va sociable unit testlar, test takrorlanishidan qochish, end-to-end testlar narxi"
  - id: dodds-testing-trophy
    note: "Testing trophy: static, unit, integration, e2e qatlamlari, Guillermo Rauch shiori va testlarni tasniflash bo'yicha mulohazalar"
  - id: refactoring
    note: "Testlar qurish haqidagi bob: self-testing code va refaktoring uchun testlar zarurligi"
quiz:
  - q: "Jamoada 400 ta Cypress testi bor, unit testlar deyarli yo'q. CI 40 daqiqa ishlaydi va har kuni 3-4 ta test tasodifan yiqiladi. Bu holat qanday ataladi va asosiy muammo nima?"
    options:
      - "Testing trophy: integratsion testlar yetarli emas"
      - "Test ice-cream cone: qimmat, sekin va beqaror testlar ko'p, tez fikr-mulohaza beradigan testlar kam"
      - "Test piramidasi: hammasi to'g'ri, faqat CI serverini kuchaytirish kerak"
      - "Bu muammo emas, chunki e2e testlar eng ko'p ishonch beradi"
    answer: 1
    explain: "Ham Vocke maqolasi bunday teskari tuzilmani ice-cream cone deb ataydi. E2E testlar ko'proq ishonch berishi rost, lekin ular sekin, beqaror va qimmat. Agar ular asosiy qatlam bo'lsa, fikr-mulohaza sikli juda uzayadi va jamoa testlarga ishonchini yo'qotadi."
  - q: "Yuqori darajadagi test yiqildi, lekin hech qaysi past darajadagi test yiqilmadi. Practical Test Pyramid maqolasi nima qilishni tavsiya qiladi?"
    options:
      - "Yuqori darajadagi testni o'chirish"
      - "Yana bir nechta e2e test qo'shish"
      - "Xatoni past darajada ushlaydigan test yozish"
      - "Testni retry bilan qayta ishga tushirish"
    answer: 2
    explain: "Maqoladagi qoida: agar yuqori darajadagi test xatoni topsa-yu, past darajadagi testlar topmasa, past darajada test yetishmayapti. Xatoni ushlaydigan unit yoki integratsion test yozing. Retry esa muammoni yashiradi."
  - q: "Kent C. Dodds testing trophy'ga piramidada yo'q qaysi qatlamni qo'shadi va nega?"
    options:
      - "Static: tip tekshiruvi va linting, chunki JavaScript'da bular tilning o'zida kafolatlanmagan"
      - "Contract: chunki mikroservislar ko'paydi"
      - "Manual: chunki avtomatlashtirish hamma narsani qamramaydi"
      - "Performance: chunki frontend sekin"
    answer: 0
    explain: "Dodds static qatlamini qo'shadi: TypeScript va ESLint kodni ishga tushirmasdan xatolarning butun bir sinfini ushlaydi. Piramida esa bu tekshiruvlar kompilyatorda bo'lgan tillar muhitida paydo bo'lgan."
  - q: "Fowler Refactoring kitobida testlarni nima uchun refaktoringning sharti deb biladi?"
    options:
      - "Chunki testlar kod coverage'ni oshiradi"
      - "Chunki testsiz kodni refaktoring qilish taqiqlangan standart bor"
      - "Chunki testlar dizaynni avtomatik yaxshilaydi"
      - "Chunki refaktoring xatti-harakatni saqlashi kerak, va buni tez tekshirishning amaliy yo'li - avtomatik testlar"
    answer: 3
    explain: "Refaktoring ta'rifi bo'yicha kuzatiladigan xatti-harakatni o'zgartirmaydi. Buni har kichik qadamdan keyin qo'lda tekshirib bo'lmaydi. Self-testing code bu tekshiruvni soniyalarga tushiradi va kichik qadamlar bilan ishlashni mumkin qiladi."
  - q: "Piramida va trophy o'rtasidagi bahs haqida eng to'g'ri xulosa qaysi?"
    options:
      - "Trophy piramidani butunlay inkor qiladi"
      - "Ikkalasi ham ishonch va narx o'rtasidagi muvozanat haqida. Asosiy farq - 'unit' va 'integratsion' so'zlariga qanday chegara qo'yilishi va qaysi stack nazarda tutilgani"
      - "Piramida faqat Java uchun, trophy faqat React uchun"
      - "Raqamlar muhim: 70% unit, 20% integratsion, 10% e2e qat'iy qoida"
    answer: 1
    explain: "Ikkala model ham turli granulyarlikdagi testlarni yozishni va qimmat testlarni kamaytirishni tavsiya qiladi. Dodds o'zi foizlar haqidagi bahslarni chalg'ituvchi deb biladi. Farq asosan atamalarning ma'nosida: sociable unit test va Dodds'ning integratsion testi ko'pincha bir xil narsa."
  - q: "NestJS loyihasida `TariffCalculator` sof funksiya, 30 ta chegaraviy holati bor. Ularni qayerda tekshirish kerak?"
    options:
      - "Har birini supertest orqali HTTP so'rov bilan"
      - "Faqat Playwright e2e testida"
      - "Funksiyaning o'zini unit testlarda, HTTP qatlamida esa bitta-ikkita integratsion test bilan ulanishni tekshirish"
      - "Hech qayerda, chunki TypeScript tiplar xatolarni ushlaydi"
    answer: 2
    explain: "Chegaraviy holatlar logika ichida yashaydi va ularni eng arzon joyda tekshirish kerak. HTTP qatlami faqat ulanish to'g'riligini ko'rsatsin. Bu 'testni piramidada iloji boricha pastga tushiring' qoidasining aynan o'zi."
task:
  title: "Testlar portfelini qayta taqsimlash"
  prompt: |
    Ijara xizmatida kunlik narxni hisoblash logikasi bor. Hozir uni faqat HTTP orqali supertest bilan tekshiradigan 6 ta test bor (quyida ulardan uchtasi). Har biri butun NestJS ilovasini ko'taradi va ma'lumotlar bazasiga yozadi, suite sekin.

    1. Narx hisoblash logikasini sof funksiyaga ajrating (`calculateRentalPrice`).
    2. Chegaraviy holatlarni Vitest (yoki Jest) unit testlariga ko'chiring, `it.each` bilan.
    3. HTTP darajasida faqat bitta test qoldiring: u endpoint ulanganini va javob shaklini tekshirsin.
    4. Qisqacha yozing: qaysi xatolar endi unit testda, qaysilari integratsion testda ushlanadi.
  lang: ts
  starter: |
    import request from "supertest";
    import { INestApplication } from "@nestjs/common";
    import { Test } from "@nestjs/testing";
    import { AppModule } from "../src/app.module";

    describe("Rental pricing (e2e)", () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
      });

      afterAll(async () => {
        await app.close();
      });

      it("1 kunlik ijara", async () => {
        const res = await request(app.getHttpServer())
          .post("/rentals/quote")
          .send({ carClass: "economy", days: 1 });
        expect(res.body.total).toBe(300_000);
      });

      it("7 kunlik ijarada 10% chegirma", async () => {
        const res = await request(app.getHttpServer())
          .post("/rentals/quote")
          .send({ carClass: "economy", days: 7 });
        expect(res.body.total).toBe(1_890_000);
      });

      it("30 kunlik ijarada 25% chegirma", async () => {
        const res = await request(app.getHttpServer())
          .post("/rentals/quote")
          .send({ carClass: "business", days: 30 });
        expect(res.body.total).toBe(13_500_000);
      });
    });
  solution: |
    // src/rentals/rental-price.ts
    export type CarClass = "economy" | "business";

    const DAILY_RATE: Record<CarClass, number> = {
      economy: 300_000,
      business: 600_000,
    };

    function discountFor(days: number): number {
      if (days >= 30) return 0.25;
      if (days >= 7) return 0.1;
      return 0;
    }

    export function calculateRentalPrice(carClass: CarClass, days: number): number {
      if (!Number.isInteger(days) || days < 1) {
        throw new RangeError(`Ijara kunlari musbat butun son bo'lishi kerak: ${days}`);
      }
      const base = DAILY_RATE[carClass] * days;
      return Math.round(base * (1 - discountFor(days)));
    }

    // src/rentals/rental-price.spec.ts
    import { describe, expect, it } from "vitest";
    import { calculateRentalPrice } from "./rental-price";

    describe("calculateRentalPrice", () => {
      it.each([
        { carClass: "economy", days: 1, total: 300_000 },
        { carClass: "economy", days: 6, total: 1_800_000 },
        { carClass: "economy", days: 7, total: 1_890_000 },
        { carClass: "economy", days: 29, total: 7_830_000 },
        { carClass: "business", days: 30, total: 13_500_000 },
      ] as const)("$carClass, $days kun -> $total", ({ carClass, days, total }) => {
        expect(calculateRentalPrice(carClass, days)).toBe(total);
      });

      it("0 yoki kasr kunni rad etadi", () => {
        expect(() => calculateRentalPrice("economy", 0)).toThrow(RangeError);
        expect(() => calculateRentalPrice("economy", 1.5)).toThrow(RangeError);
      });
    });

    // test/rentals.e2e-spec.ts - faqat ulanishni tekshiradi
    // it("POST /rentals/quote narxni qaytaradi", async () => {
    //   await request(app.getHttpServer())
    //     .post("/rentals/quote")
    //     .send({ carClass: "economy", days: 7 })
    //     .expect(201)
    //     .expect(({ body }) => expect(body).toEqual({ total: 1_890_000 }));
    // });
  solutionNotes: |
    - Chegaraviy holatlar (6 va 7 kun, 29 va 30 kun) endi millisekundlarda ishlaydigan unit testlarda. Ilgari ular chegara qiymatlarini umuman tekshirmagan edi.
    - Noto'g'ri kirish (0, kasr) uchun alohida test qo'shildi. HTTP darajasida buni har bir holat uchun tekshirish qimmat bo'lardi.
    - HTTP darajasida bitta test qoldi: u routing, DTO, serializatsiya va DI ulanishini tekshiradi. Bu xatolarni unit test ushlay olmaydi.
    - Testlar soni kamaymadi, aksincha ko'paydi, lekin suite tezlashdi: qimmat testlar soni 6 dan 1 ga tushdi.
    - Agar loyihada Jest ishlatilsa, `it.each` va `expect` API'si bir xil, faqat import qatori o'zgaradi.
  checklist:
    - "Narx logikasi NestJS va DB'ga bog'liq bo'lmagan sof funksiyada"
    - "Chegaraviy qiymatlar (6/7, 29/30 kun) unit testda tekshirilgan"
    - "Noto'g'ri kirish uchun test bor"
    - "HTTP darajasida faqat ulanishni tekshiradigan bitta test qoldi"
    - "Qaysi xato qaysi darajada ushlanishini yozib chiqdim"
---

## Muammo

Testlar haqidagi ko'p bahslar "test yozish kerakmi" savolidan boshlanadi, lekin real loyihalarda muammo boshqa joyda. Testlar bor, lekin ular yordam bermaydi. Bir jamoada 600 ta e2e test bor, CI 50 daqiqa ishlaydi va har kuni kimdir "qayta ishga tushir, o'tib ketadi" deydi. Boshqa jamoada 2000 ta unit test bor, coverage 90%, lekin production'da har hafta ma'lumotlar bazasi so'rovi yoki DTO serializatsiyasi bilan bog'liq xato chiqadi, chunki unit testlarda repository va HTTP qatlami mock qilingan.

Ikkala holatda ham testlar narxi bor, lekin ular berishi kerak bo'lgan narsa yo'q: **o'zgarishga ishonch**. Martin Fowler *Refactoring* kitobida testlar qurishga alohida bob ajratadi va asosiy g'oyani aniq aytadi: refaktoring kichik qadamlar bilan qilinadi, har qadamdan keyin xatti-harakat saqlanganini tekshirish kerak, buni esa faqat tez ishlaydigan avtomatik testlar bilan amalga oshirish mumkin. Fowler bu holatni self-testing code deb ataydi: kod o'zini o'zi tekshira oladigan testlar to'plami bilan birga yashaydi.

Demak savol "test bormi" emas, balki "qaysi testlar, qaysi darajada va qancha" bo'ladi. Bu savolga ikkita mashhur model javob beradi: test piramidasi va testing trophy.

## Asosiy g'oya

Testni investitsiya deb tasavvur qiling. Siz vaqt sarflaysiz (yozish, ishga tushirish, qo'llab-quvvatlash) va evaziga ishonch olasiz. Har xil testlar bu ikki tomonda har xil.

### Test piramidasi

Test piramidasini Mike Cohn *Succeeding with Agile* kitobida taklif qilgan. Asl ko'rinishida uchta qatlam bor: pastda unit testlar, o'rtada service testlar, tepada UI testlar. Ham Vocke martinfowler.com'dagi *The Practical Test Pyramid* maqolasida bu modelni amaliy nuqtai nazardan tahlil qiladi va undan ikkita qoida chiqaradi:

1. **Har xil granulyarlikdagi testlar yozing.** Faqat bitta turdagi testlar yetarli emas.
2. **Daraja qancha yuqori bo'lsa, testlar shuncha kam bo'lsin.**

Mantiq oddiy: past darajadagi testlar tez, barqaror va xato joyini aniq ko'rsatadi. Yuqori darajadagilar ko'proq qismni birga tekshiradi, lekin sekin, beqaror va yiqilganda sababini topish qiyin. Vocke teskari tuzilmani, ya'ni e2e testlar ko'p va unit testlar kam bo'lgan holatni, "test ice-cream cone" deb ataydi va uni qo'llab-quvvatlash qiyin va sekin deb ta'riflaydi.

Vocke modelni ko'r-ko'rona qabul qilmaydi. U piramidani foydali, lekin juda soddalashtirilgan qoida deb biladi. Masalan, "service test" atamasi tushunarsiz, UI testlar esa tepada bo'lishi shart emas: zamonaviy frontend freymvorklarida UI kodni unit darajasida ham test qilish mumkin. Uning tavsiyasi: qatlam nomlariga yopishib olmang, jamoangizda nomlarni bir xil ma'noda ishlating.

### Testing trophy

Kent C. Dodds 2018 yilda JavaScript ilovalari uchun boshqa shaklni taklif qildi: testing trophy (kubok). Unda to'rtta qatlam bor, pastdan yuqoriga: **static**, **unit**, **integration**, **end-to-end**. Eng keng qism - integration.

Dodds bu modelni Guillermo Rauchning 2016 yildagi shioriga tayanib quradi: testlar yozing, juda ko'p emas, asosan integratsion. Dodds'ning yo'naltiruvchi tamoyili esa bitta jumla bilan ifodalanadi: "The more your tests resemble the way your software is used, the more confidence they can give you." Ya'ni test dasturdan qanday foydalanilishiga qanchalik o'xshasa, shuncha ko'p ishonch beradi.

Static qatlami alohida e'tiborga loyiq. Dodds uni qo'shishining sababi: JavaScript'da tip tekshiruvi va linting tilning o'zida yo'q, piramida esa bu tekshiruvlar kompilyatorda bo'lgan tillar muhitida paydo bo'lgan. TypeScript `strict` rejimi va ESLint xatolarning butun bir sinfini (noto'g'ri argument, `undefined` ustida chaqiruv, unutilgan `await`) kodni ishga tushirmasdan ushlaydi.

## Chuqurroq: modellar aslida nimada farq qiladi

Bir qarashda piramida "asosan unit", trophy "asosan integration" deydi va ular bir-biriga zid ko'rinadi. Lekin yaqinroq qarasak, bahsning katta qismi atamalarda.

### "Unit" so'zining ikki ma'nosi

Vocke maqolasida Jay Fields kiritgan ikki atama keltiriladi: **solitary** unit test barcha hamkorlarini (collaborator) test double bilan almashtiradi, **sociable** unit test esa real hamkorlar bilan ishlaydi. Vocke ikkalasidan ham foydalanadi va qaysi biri ko'proq ishonch bersa, shunisini tanlashini aytadi.

Dodds esa unit testni boshqacha ta'riflaydi: bitta funksiya, klass yoki obyekt, bog'liqliklari yo'q yoki mock qilingan. Bir nechta birlik birga ishlashi esa unda integration test hisoblanadi. Natijada Vocke'ning sociable unit testi Dodds'ning integratsion testiga juda yaqin keladi. Ikki muallif bir xil narsani tavsiya qilishi mumkin, faqat uni turli nomlar bilan ataydi.

Dodds o'zi ham shuni tan oladi: u o'z ta'riflarini o'qitish uchun qulay bo'lgani uchun tanlagan va test foizlari haqidagi bahslarni asosan chalg'ituvchi deb hisoblaydi. U yana bir muhim cheklovni aytadi: trophy bitta kod bazasi, asosan monolit uchun o'ylangan, mikroservislar va serverless uchun u buni alohida ko'rib chiqmagan.

### "Integratsion" so'zining ikki ma'nosi

Xuddi shunday chalkashlik integratsion testda ham bor. Vocke tor ta'rifni ishlatadi: bitta integratsiya nuqtasini (ma'lumotlar bazasi, tashqi servis) tekshiradigan test, qolgan hamma narsa double bilan almashtiriladi. U ma'lumot serializatsiya yoki deserializatsiya qilinadigan har bir joyda integratsion test yozishni maslahat beradi. Boshqalar "integratsion" deganda butun ilovani ko'tarib, HTTP orqali so'rov yuborishni tushunadi. Jamoa ichida bu so'zni nima ma'noda ishlatayotganingizni kelishib oling, aks holda "integratsion testlar ko'proq bo'lsin" degan qaror har kim uchun boshqa narsani anglatadi.

### Takrorlanishdan qochish

Vocke maqolasidagi eng amaliy qism - testlar takrorlanishi haqida. Ikki qoida:

- Agar yuqori darajadagi test xatoni topsa va hech qaysi past darajadagi test topmasa, past darajada test yetishmayapti.
- Testlarni piramidada iloji boricha pastga tushiring.

Bir xil narsani unit, integratsion va e2e darajada uch marta tekshirish ishonchni oshirmaydi, faqat qo'llab-quvvatlash narxini oshiradi. Vocke past darajadagi testlar qamrab olgan yuqori darajadagi testlarni o'chirishni ham ochiq aytadi.

### End-to-end testlar o'rni

Ikkala model ham e2e testlarni kamaytirishni tavsiya qiladi, lekin butunlay voz kechishni emas. Vocke ularni beqaror, sekin va qo'llab-quvvatlash qimmat deb ta'riflaydi va faqat asosiy foydalanuvchi yo'llarini (masalan, ro'yxatdan o'tish, buyurtma berish, to'lov) qamrashni maslahat beradi. U yana bir nozik farqni ko'rsatadi: UI test va e2e test bir narsa emas. Har bir UI test e2e emas, har bir e2e test ham UI orqali o'tmaydi.

### Self-testing code va refaktoring

Fowler'ning qarashi bu modellarga boshqa o'lchov qo'shadi: testlar faqat xato topish uchun emas, refaktoringni mumkin qilish uchun ham kerak. Agar suite 40 daqiqa ishlasa, siz har kichik qadamdan keyin uni ishga tushirmaysiz. Natijada qadamlar kattalashadi va refaktoring xavfli bo'lib qoladi. Shuning uchun tez testlar qatlami bu shunchaki qulaylik emas, balki 71-darsdagi refaktoring jarayonining sharti.

## Misol: yoqilg'i o'g'irlanishini aniqlash

Transport parki tizimida yoqilg'i datchigi (DUT) har daqiqada bak hajmini yuboradi. Agar mashina to'xtab turganda hajm qisqa vaqtda keskin tushsa, bu ehtimoliy o'g'irlik. Jamoa bu funksiyani faqat e2e test bilan tekshirgan:

```ts
// Yomon: hamma narsa bitta qimmat testda
it("yoqilg'i o'g'irlanishini aniqlaydi", async () => {
  await seedVehicle(db, { id: "01A123BC" });
  await postTelemetry(api, "01A123BC", [
    { at: "2026-10-01T10:00:00Z", liters: 180, speedKmh: 0 },
    { at: "2026-10-01T10:05:00Z", liters: 140, speedKmh: 0 },
  ]);
  await waitForQueue(); // navbat ishlovchisini kutish, ba'zan 2 soniya yetmaydi
  const alerts = await getAlerts(api, "01A123BC");
  expect(alerts).toHaveLength(1);
});
```

Bu test bitta muvaffaqiyatli holatni tekshiradi. Chegaraviy holatlar (mashina harakatda bo'lsa, tushish 5 litr bo'lsa, oraliq 30 daqiqa bo'lsa) umuman yo'q, chunki har birini e2e darajada yozish qimmat. `waitForQueue` esa beqarorlik manbai.

Avval logikani sof funksiyaga ajratamiz va chegaraviy holatlarni arzon joyda tekshiramiz:

```ts
export type FuelReading = { at: Date; liters: number; speedKmh: number };

export type DrainRule = { minDropLiters: number; maxWindowMinutes: number };

export const DEFAULT_DRAIN_RULE: DrainRule = { minDropLiters: 15, maxWindowMinutes: 10 };

export function detectFuelDrain(
  previous: FuelReading,
  current: FuelReading,
  rule: DrainRule = DEFAULT_DRAIN_RULE,
): boolean {
  const isParked = previous.speedKmh === 0 && current.speedKmh === 0;
  const drop = previous.liters - current.liters;
  const minutes = (current.at.getTime() - previous.at.getTime()) / 60_000;
  return isParked && drop >= rule.minDropLiters && minutes <= rule.maxWindowMinutes;
}
```

```ts
import { describe, expect, it } from "vitest";
import { detectFuelDrain, type FuelReading } from "./fuel-drain";

const reading = (minute: number, liters: number, speedKmh = 0): FuelReading => ({
  at: new Date(Date.UTC(2026, 9, 1, 10, minute)),
  liters,
  speedKmh,
});

describe("detectFuelDrain", () => {
  it("to'xtab turganda 5 daqiqada 40 litr tushishini o'g'irlik deb belgilaydi", () => {
    expect(detectFuelDrain(reading(0, 180), reading(5, 140))).toBe(true);
  });

  it("harakat paytidagi sarfni o'g'irlik deb hisoblamaydi", () => {
    expect(detectFuelDrain(reading(0, 180, 60), reading(5, 140, 60))).toBe(false);
  });

  it("chegaradan kichik tushishni e'tiborsiz qoldiradi", () => {
    expect(detectFuelDrain(reading(0, 180), reading(5, 166))).toBe(false);
  });

  it("uzoq oraliqdagi tushishni (masalan, datchik uzilishi) o'g'irlik demaydi", () => {
    expect(detectFuelDrain(reading(0, 180), reading(30, 140))).toBe(false);
  });
});
```

Keyin e2e testni bitta asosiy yo'l uchun qoldiramiz, integratsion darajada esa telemetriya repository'si real PostgreSQL bilan ishlashini alohida tekshiramiz (68-dars). Nima o'zgardi:

- **Chegaraviy holatlar arzon joyga ko'chdi.** To'rt holat millisekundlarda tekshiriladi va yiqilganda aynan qaysi qoida buzilganini aytadi.
- **Qoida parametrlashtirildi.** `DrainRule` ajratilgani uchun test chegara qiymatlarini aniq ko'rsatadi, mijoz uchun qoidani o'zgartirish ham oson.
- **E2E test vazifasi torroq.** U endi "navbat, ishlovchi, DB va API birga ulanganmi" degan savolga javob beradi, logika to'g'riligiga emas.

## Qachon qo'llamaslik kerak

Modellar foydali, lekin ularni qoida sifatida qo'llash zarar keltirishi mumkin:

- **Foizlarni maqsadga aylantirish.** "70/20/10" kabi nisbat hech qaysi manbada qat'iy qoida sifatida isbotlanmagan. Dodds foizlar bahsini chalg'ituvchi deb biladi. Loyiha qayerda xato qilayotganiga qarab qaror qiling.
- **Logikasi kam ilovalar.** Agar backend asosan CRUD bo'lsa va murakkablik DB so'rovlari va serializatsiyada bo'lsa, ko'p solitary unit test deyarli hech narsa tekshirmaydi. Bunday holatda real DB bilan integratsion testlar asosiy qatlam bo'ladi va bu to'g'ri.
- **Prototip va tashlab yuboriladigan kod.** G'oyani tekshirish uchun yozilgan kod uchun to'liq test portfeli isrof. Lekin u production'ga o'tsa, testlar ham u bilan birga keladi.
- **Mikroservislar.** Dodds o'zi trophy'ni ular uchun o'ylamaganini aytadi. Servislar orasidagi shartnomani tekshirish uchun Vocke consumer-driven contract testlarni (masalan, Pact) tavsiya qiladi. Bu ikkala shaklda ham alohida qatlam.
- **Faqat e2e qila oladigan narsalar.** Brauzerga xos xatti-harakatlar, to'lov provayderi bilan real oqim yoki deploy konfiguratsiyasi faqat yuqori darajada ko'rinadi. Ularni "piramida" deb pastga tushirishga urinmang.

## Stack'da: TypeScript, NestJS, React

- **Static qatlam.** `tsc --noEmit` va `eslint` CI'da birinchi qadam bo'lsin. Ular eng arzon test.
- **Unit.** Vitest yoki Jest. Sof funksiyalar, domen qoidalari, value object'lar. NestJS'da yangi loyihalar hozirgi hujjatlarga ko'ra Vitest bilan yaratiladi, ko'p mavjud loyihalar esa Jest'da (uzoq vaqt standart edi). API deyarli bir xil.
- **Integratsion.** NestJS'da `Test.createTestingModule` va supertest, real PostgreSQL esa Testcontainers orqali (68-dars). React'da React Testing Library bilan komponentlarni foydalanuvchi ko'zi bilan tekshirish (69-dars).
- **E2E.** Playwright yoki Cypress bilan faqat bir nechta asosiy yo'l: login, buyurtma, to'lov.

## Xulosa

- Testlar - ishonch sotib olish usuli. Har bir test turining narxi va beradigan ishonchi turlicha.
- Piramida (Cohn, Vocke): har xil granulyarlikda testlar yozing va yuqoriga chiqqan sari kamroq yozing.
- Trophy (Dodds): static qatlamni qo'shadi va integratsion testlarga urg'u beradi, chunki ular foydalanishga ko'proq o'xshaydi.
- Bahsning katta qismi atamalarda: sociable unit test va Dodds'ning integratsion testi ko'pincha bir narsa.
- Yuqori darajadagi test topgan xatoni past darajada ushlaydigan test yozing va takrorlanuvchi qimmat testlarni olib tashlang.
- Tez testlar refaktoringning sharti: suite sekin bo'lsa, qadamlar kattalashadi va o'zgarish xavfli bo'ladi.
