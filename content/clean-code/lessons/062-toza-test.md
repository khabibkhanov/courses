---
n: 62
slug: toza-test
title: "Toza test: F.I.R.S.T. va AAA"
summary: "Test kodi production kodi kabi o'qiladi, o'zgaradi va eskiradi. Bu darsda testni toza qiladigan xususiyatlarni (F.I.R.S.T.), testning ichki tuzilishini (Arrange-Act-Assert, to'rt fazali test) va Meszaros katalogidagi asosiy test smell'larni ko'rib chiqamiz."
duration: 35
sources:
  - id: cc1
    note: "9-bob \"Unit Tests\": testlarni toza saqlash, domenga xos test tili, ikki xil standart, F.I.R.S.T. va Build-Operate-Check"
  - id: cc2
    note: "Testlar haqidagi bob(lar): toza test g'oyalarining yangilangan bayoni"
  - id: xunit-patterns
    note: "Four-Phase Test patterni, Fresh va Shared Fixture, Creation Method, Custom Assertion, test smell'lar: Obscure Test, Mystery Guest, General Fixture, Erratic Test"
quiz:
  - q: "Test lokal kompyuterda o'tadi, CI'da esa har 5-ishga tushirishda bir marta yiqiladi. Ichida `new Date()` va tartibi kafolatlanmagan `SELECT` bor. F.I.R.S.T.ning qaysi xususiyati buzilgan?"
    options:
      - "Fast"
      - "Timely"
      - "Self-validating"
      - "Repeatable"
    answer: 3
    explain: "Repeatable: test har qanday muhitda va har qanday vaqtda bir xil natija berishi kerak. Joriy vaqt va tartibsiz so'rov natijasi testni muhitga bog'laydi. Meszaros buni Erratic Test deb ataydi. Testning sekinligi yoki kechikib yozilgani bu yerda asosiy muammo emas."
  - q: "Test faylining tepasida `beforeAll` bor, u 12 ta mijoz, 30 ta buyurtma va 5 ta tarifni yaratadi. Har bir test shulardan bir-ikkitasini ishlatadi. Meszaros bo'yicha bu qaysi smell?"
    options:
      - "General Fixture: hamma test uchun umumiy katta fixture, qaysi ma'lumot qaysi test uchun muhimligi ko'rinmaydi"
      - "Assertion Roulette"
      - "Slow Test emas, chunki beforeAll faqat bir marta ishlaydi"
      - "Test Double ortiqcha ishlatilgan"
    answer: 0
    explain: "General Fixture o'quvchini test natijasini tushunish uchun boshqa joyga borishga majbur qiladi va testlarni bir-biriga bog'laydi: bitta test umumiy ma'lumotni o'zgartirsa, boshqasi yiqiladi. Yechim - har test o'ziga kerakli minimal fixture'ni yaratishi (Fresh Fixture)."
  - q: "Martin 'ikki xil standart' deganda nimani nazarda tutadi?"
    options:
      - "Testlar production kodidan sifatsizroq bo'lishi mumkin"
      - "Test kodi ham toza bo'lishi kerak, lekin u production'dagi samaradorlik talablariga bo'ysunmaydi"
      - "Unit va integratsion testlar uchun turli linter qoidalari kerak"
      - "Testlar faqat CI'da ishlashi kerak"
    answer: 1
    explain: "Martin testlar o'qilishi bo'yicha production kodi bilan bir xil darajada bo'lishi kerakligini, lekin test muhitida xotira yoki CPU samaradorligi bo'yicha cheklovlar boshqacha ekanini aytadi. Toza bo'lish va tejamkor bo'lish turli talablar."
  - q: "Quyidagi testning asosiy muammosi nima? `it('works', async () => { const r = await svc.run(fixtures.c7); expect(r).toMatchSnapshot(); })`"
    options:
      - "async ishlatilgani"
      - "Snapshot har doim yomon"
      - "Mystery Guest va tushunarsiz nom: kirish ma'lumoti boshqa faylda, nima kutilayotgani testdan ko'rinmaydi"
      - "`svc` o'zgaruvchi nomi juda qisqa"
    answer: 2
    explain: "fixtures.c7 nima ekanini bilish uchun boshqa faylni ochish kerak (Mystery Guest), snapshot esa qaysi xususiyat muhimligini aytmaydi, test nomi esa hech narsani tushuntirmaydi. Natijada test yiqilganda nima buzilganini topish qiyin. Qisqa nom ikkinchi darajali muammo."
  - q: "Nega Arrange-Act-Assert'da Act qismi odatda bitta qator bo'lishi kerak?"
    options:
      - "Chunki Jest bir nechta await'ni qo'llamaydi"
      - "Chunki test nimani tekshirayotganini aniq ko'rsatadi: bitta harakat va uning natijasi. Bir nechta Act testni bir nechta tushunchaga aylantiradi"
      - "Chunki bu coverage'ni oshiradi"
      - "Chunki Arrange qismi har doim beforeEach'da bo'lishi kerak"
    answer: 1
    explain: "Meszaros ham to'rt fazali test haqida shuni aytadi: bir nechta exercise-verify juftligi test bir nechta shartni tekshirayotganining belgisi. Bunday testni ajratish kerak (63-dars)."
  - q: "Testlarda takrorlanuvchi obyekt yaratish kodini qanday tozalash to'g'ri?"
    options:
      - "Har bir testga to'liq obyektni nusxalab qo'yish, takror testda zarar emas"
      - "Hammasini bitta global fixture'ga yig'ish"
      - "Testlarni birlashtirib, bitta katta test qilish"
      - "Faqat test uchun muhim maydonlarni qabul qiladigan, qolganini standart qiymat bilan to'ldiradigan Creation Method yoki builder yozish"
    answer: 3
    explain: "Creation Method testda faqat muhim farqni ko'rsatadi, qolgan shovqinni yashiradi. To'liq nusxalash Irrelevant Information beradi, global fixture esa General Fixture va testlar orasida bog'liqlik keltiradi."
task:
  title: "Chalkash testni toza testga aylantirish"
  prompt: |
    Quyidagi Vitest testi to'lov xizmatining qaytarish (refund) logikasini tekshiradi. U ishlaydi, lekin o'qish qiyin va ba'zan yiqiladi.

    1. Testdagi muammolarni F.I.R.S.T. va Meszaros smell'lari bo'yicha nomlang.
    2. Testni AAA tuzilmasida, har biri bitta xatti-harakatni tekshiradigan testlarga ajrating.
    3. Vaqtga bog'liqlikni yo'q qiling.
    4. Obyekt yaratish uchun Creation Method yozing.
  lang: ts
  starter: |
    import { describe, expect, it } from "vitest";
    import { RefundPolicy } from "./refund-policy";

    describe("RefundPolicy", () => {
      it("test1", () => {
        const p = new RefundPolicy();
        const o = {
          id: "ord-1",
          customerId: "c-77",
          amount: 450_000,
          currency: "UZS",
          status: "delivered",
          deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          items: [{ sku: "TIRE-R16", qty: 2 }],
        };
        let r = p.evaluate(o, new Date());
        expect(r.allowed).toBe(true);
        expect(r.amount).toBe(450_000);
        o.deliveredAt = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
        r = p.evaluate(o, new Date());
        expect(r.allowed).toBe(false);
        o.status = "cancelled";
        r = p.evaluate(o, new Date());
        expect(r.allowed).toBe(false);
        expect(r.reason).toBe("not_delivered");
      });
    });
  solution: |
    import { describe, expect, it } from "vitest";
    import { RefundPolicy, type Order } from "./refund-policy";

    const NOW = new Date("2026-10-20T12:00:00Z");
    const DAY_MS = 24 * 60 * 60 * 1000;

    function daysAgo(days: number): Date {
      return new Date(NOW.getTime() - days * DAY_MS);
    }

    function aDeliveredOrder(overrides: Partial<Order> = {}): Order {
      return {
        id: "ord-1",
        customerId: "c-77",
        amount: 450_000,
        currency: "UZS",
        status: "delivered",
        deliveredAt: daysAgo(1),
        items: [{ sku: "TIRE-R16", qty: 2 }],
        ...overrides,
      };
    }

    describe("RefundPolicy", () => {
      const policy = new RefundPolicy();

      it("yetkazilganiga 14 kun bo'lmagan buyurtma uchun to'liq summani qaytaradi", () => {
        const order = aDeliveredOrder({ deliveredAt: daysAgo(3) });

        const decision = policy.evaluate(order, NOW);

        expect(decision).toEqual({ allowed: true, amount: 450_000 });
      });

      it("yetkazilganiga 14 kundan oshgan buyurtmani rad etadi", () => {
        const order = aDeliveredOrder({ deliveredAt: daysAgo(20) });

        const decision = policy.evaluate(order, NOW);

        expect(decision).toEqual({ allowed: false, reason: "window_expired" });
      });

      it("yetkazilmagan buyurtmani rad etadi", () => {
        const order = aDeliveredOrder({ status: "cancelled" });

        const decision = policy.evaluate(order, NOW);

        expect(decision).toEqual({ allowed: false, reason: "not_delivered" });
      });
    });
  solutionNotes: |
    - Starter'dagi muammolar: nom hech narsa aytmaydi (`test1`), bitta testda uchta Act (Single Condition Test emas), obyekt mutatsiya qilinadi, `Date.now()` testni joriy vaqtga bog'laydi (Repeatable buzilgan), 7 qatorli obyekt ichida muhim maydon ko'rinmaydi (Irrelevant Information).
    - `NOW` qat'iy sana: test 2026 yilda ham, 2030 yilda ham bir xil ishlaydi. `daysAgo` esa kunni bitta joyda hisoblaydi.
    - `aDeliveredOrder` - Creation Method: har test faqat o'zi uchun muhim maydonni (`deliveredAt`, `status`) ko'rsatadi.
    - Har testda bitta Act va qarorni butunligicha tekshiradigan `toEqual`: kutilgan natija bitta joyda va to'liq ko'rinadi.
    - Ikkinchi testda `reason` ham tekshirildi. Starter'da u yo'q edi, demak rad etish sababi buzilsa ham test o'tardi.
    - `policy` describe darajasida yaratiladi, chunki u holatsiz. Agar holatga ega bo'lsa, uni har testda yangidan yaratish kerak edi (Fresh Fixture).
  checklist:
    - "Har bir test nomi xatti-harakat va shartni aytadi"
    - "Har bir testda bitta Act bor, Arrange/Act/Assert bo'sh qator bilan ajratilgan"
    - "Date.now() va new Date() argumentsiz ishlatilmagan"
    - "Creation Method orqali faqat muhim maydonlar ko'rsatiladi"
    - "Testlar bir-birining holatiga bog'liq emas va istalgan tartibda ishlaydi"
---

## Muammo

Ko'p jamoalarda test kodi ikkinchi darajali fuqaro hisoblanadi. Production kodiga review'da qattiq talab qo'yiladi, testlar esa "ishlasa bo'ldi" degan mezon bilan qabul qilinadi. Natija bir-ikki yildan keyin ko'rinadi: har bir kichik o'zgarish o'nlab testni yiqitadi, testlarni tuzatish asl o'zgarishdan ko'p vaqt oladi va oxir-oqibat kimdir `it.skip` qo'yadi yoki testlarni butunlay o'chiradi.

Robert Martin *Clean Code* kitobining unit testlar haqidagi 9-bobida aynan shunday hikoyani aytib beradi. Jamoa testlar uchun "tez va iflos" yozish mumkin degan qarorga keladi. Production kodi o'zgargan sari eski iflos testlarni yangilash qiyinlashadi, test kodi jamoaga eng katta yukka aylanadi va oxirida testlar tashlab yuboriladi. Testlarsiz esa o'zgarishlar xavfli bo'lib qoladi, kod chiriy boshlaydi. Martinning xulosasi: test kodi production kodi kabi muhim, u ham o'ylab yozilishi, ham toza saqlanishi kerak.

Sabab tushunarli: test - bu ham kod. U o'qiladi, o'zgaradi va eskiradi. Bundan tashqari, test yiqilganda uni ochgan odam, odatda, shoshib turgan bo'ladi va boshqa birovning o'zgarishi tufayli bu yerga kelgan. Bunday vaziyatda testning o'qilishi eng muhim xususiyat.

## Asosiy g'oya

Martin toza testning asosiy xususiyatini bitta so'z bilan aytadi: **o'qiluvchanlik**. Testni o'qigan odam uch narsani tez ko'rishi kerak: qanday holat tayyorlangan, qanday harakat qilingan va qanday natija kutilmoqda. Buning uchun testda ortiqcha detal bo'lmasligi va har bir qator maqsadga xizmat qilishi kerak.

### F.I.R.S.T.

Martin 9-bobning oxirida toza testlarning beshta xususiyatini F.I.R.S.T. qisqartmasi bilan beradi:

- **Fast (tez).** Testlar tez ishlashi kerak. Sekin testlarni kamroq ishga tushirasiz, demak muammolarni kechroq topasiz va kodni erkin tozalashdan qo'rqasiz.
- **Independent (mustaqil).** Testlar bir-biriga bog'liq bo'lmasligi kerak. Bitta test keyingisi uchun holat tayyorlamasin. Aks holda bitta yiqilish zanjir bo'ylab tarqaladi va asl sababni topish qiyinlashadi.
- **Repeatable (takrorlanuvchi).** Test istalgan muhitda bir xil natija berishi kerak: lokal kompyuterda, CI'da, internet bo'lmaganda. Agar natija muhitga bog'liq bo'lsa, har yiqilishda "bu haqiqiy xatomi yoki muhitmi" degan savol paydo bo'ladi.
- **Self-validating (o'zi tekshiradi).** Natija boolean bo'lsin: test o'tdi yoki yiqildi. Logni o'qib, natija to'g'rimi deb qo'lda solishtirish kerak bo'lmasin.
- **Timely (o'z vaqtida).** Testlar production kodidan oldin yoki u bilan birga yozilsin. Martin buni TDD bilan bog'laydi: kodni yozib bo'lgandan keyin test yozsangiz, kod test qilish qiyin bo'lib chiqishi mumkin. Bu nuqta munozarali, uni 65-darsda ko'ramiz.

### Testning ichki tuzilishi

Martin *Clean Code*da Build-Operate-Check patternini ko'rsatadi: avval test ma'lumotini quring, keyin u ustida amal bajaring, keyin natijani tekshiring. Bu g'oyaning eng keng tarqalgan nomi **Arrange-Act-Assert (AAA)**, BDD dunyosida esa Given-When-Then.

Gerard Meszaros *xUnit Test Patterns* kitobida xuddi shu g'oyani to'liqroq beradi va uni **Four-Phase Test** deb ataydi:

1. **Fixture setup** - test oldidan kerakli holatni yaratish, shu jumladan natijani kuzatish uchun kerakli test double'larni.
2. **Exercise SUT** - tekshirilayotgan tizim (system under test) bilan harakat qilish.
3. **Result verification** - kutilgan natija bo'lganini tekshirish.
4. **Fixture teardown** - muhitni avvalgi holatga qaytarish.

To'rtinchi faza AAA'da ko'pincha ko'rinmaydi, chunki xotiradagi obyektlar uchun uni garbage collector bajaradi. Lekin ma'lumotlar bazasi, fayllar yoki taymerlar bilan ishlaganda teardown majburiy: `afterEach`da tranzaksiyani bekor qilish, `vi.useRealTimers()`ni chaqirish va hokazo.

## Chuqurroq: domen tili, fixture'lar va test smell'lar

### Domenga xos test tili

Martin *Clean Code*da yana bir muhim g'oyani beradi: vaqt o'tishi bilan testlar uchun **domenga xos test tili** paydo bo'ladi. Bu tizim API'sining ustiga qurilgan yordamchi funksiyalar to'plami bo'lib, testni yozish va o'qishni osonlashtiradi. `insertVehicle(db, {...})`, `postTelemetry(...)` o'rniga `givenParkedVehicle()`, `whenFuelDropsBy(40)` kabi funksiyalar testni biznes tilida o'qiladigan qiladi.

Meszaros bunday yordamchilarni nomlaydi: **Creation Method** (obyektni standart qiymatlar bilan yaratadi va faqat muhim farqni parametr sifatida oladi) va **Custom Assertion** (bir nechta tekshiruvni domen ma'nosidagi bitta tasdiqqa birlashtiradi). Ikkalasining maqsadi bitta: testda faqat ma'noli ma'lumot qolsin.

### Ikki xil standart

Martin test kodi uchun "ikki xil standart" borligini aytadi. Test kodi toza, sodda va ifodali bo'lishi kerak, lekin u production kodi kabi samarador bo'lishi shart emas. Test muhitida xotira yoki CPU cheklovi boshqacha, shuning uchun o'qilishni yaxshilaydigan, lekin biroz sekinroq yechimni tanlash mumkin. E'tibor bering: bu "testlar iflos bo'lishi mumkin" degani emas. Bu "testlar boshqa sabablar uchun optimallashtiriladi" degani.

### Fresh va Shared Fixture

Meszaros fixture'ni ikki asosiy usulda tashkil qilishni ajratadi. **Fresh Fixture** har test uchun yangidan yaratiladi. **Shared Fixture** bir nechta test o'rtasida bo'linadi. Shared Fixture tezroq bo'lishi mumkin (masalan, ma'lumotlar bazasini bir marta to'ldirish), lekin uning narxi bor: testlar umumiy holat orqali bir-biriga bog'lanadi va Independent xususiyati buziladi. Umumiy qoida: Fresh Fixture bilan boshlang, Shared Fixture'ga faqat tezlik o'lchanganda va muammo isbotlanganda o'ting. O'tganda ham uni o'zgarmas (read-only) holda saqlang.

### Asosiy test smell'lar

Meszaros katalogida test smell'lar ko'p. Kundalik ishda eng ko'p uchraydiganlari:

- **Obscure Test** - test nimani tekshirayotgani ko'rinmaydi. Uning sabablari orasida **Mystery Guest** (muhim ma'lumot testdan tashqarida, masalan JSON faylida yoki umumiy fixture'da), **General Fixture** (hamma testlar uchun bitta katta fixture) va **Irrelevant Information** (testda natijaga ta'sir qilmaydigan detallar ko'p) bor.
- **Assertion Roulette** - testda ko'p tasdiq bor va yiqilganda qaysi biri nima uchun yiqilgani tushunarsiz.
- **Erratic Test** - test ba'zan o'tadi, ba'zan yiqiladi. Sabablari: vaqt, tasodifiy qiymatlar, testlar orasidagi umumiy holat, tartibsiz so'rov natijalari.
- **Fragile Test** - ishga aloqasi bo'lmagan o'zgarishdan yiqiladi. Bu mavzuni 66 va 69-darslarda batafsil ko'ramiz.
- **Slow Tests** - suite sekin, shuning uchun kam ishga tushiriladi.

Bu smell'larning ko'pchiligi F.I.R.S.T.ning teskari tomoni: Erratic Test - Repeatable buzilishi, Slow Tests - Fast buzilishi, Shared Fixture'dan kelib chiqqan muammolar - Independent buzilishi.

## Misol: GPS trekerning faollik holati

Transport parki tizimida treker oxirgi signal vaqtiga qarab "online", "idle" yoki "offline" holatida bo'ladi. Quyidagi test ishlaydi:

```ts
import { expect, it } from "vitest";
import { trackerStatus } from "./tracker-status";
import fixtures from "./fixtures/trackers.json";

it("status", () => {
  const t = fixtures[3];
  t.lastSignalAt = new Date(Date.now() - 4 * 60_000).toISOString();
  expect(trackerStatus(t, new Date())).toBe("online");
  t.lastSignalAt = new Date(Date.now() - 20 * 60_000).toISOString();
  expect(trackerStatus(t, new Date())).toBe("idle");
  t.ignitionOn = false;
  t.lastSignalAt = new Date(Date.now() - 3 * 60 * 60_000).toISOString();
  expect(trackerStatus(t, new Date())).toBe("offline");
});
```

Muammolar: `fixtures[3]` nima ekanini bilish uchun JSON faylni ochish kerak (Mystery Guest). Test umumiy fixture obyektini mutatsiya qiladi, shuning uchun shu faylni ishlatadigan boshqa testlar ishga tushish tartibiga qarab har xil natija beradi (Independent buzilgan). `Date.now()` ikki marta chaqiriladi va ular orasida vaqt o'tadi (Repeatable xavf ostida). Uchta Act bitta testda, nom esa hech narsa aytmaydi.

Toza versiya:

```ts
import { describe, expect, it } from "vitest";
import { trackerStatus, type Tracker } from "./tracker-status";

const NOW = new Date("2026-10-20T09:00:00Z");

function minutesAgo(minutes: number): string {
  return new Date(NOW.getTime() - minutes * 60_000).toISOString();
}

function aTracker(overrides: Partial<Tracker> = {}): Tracker {
  return {
    imei: "356938035643809",
    vehiclePlate: "01A123BC",
    ignitionOn: true,
    lastSignalAt: minutesAgo(1),
    ...overrides,
  };
}

describe("trackerStatus", () => {
  it("oxirgi 5 daqiqada signal bo'lsa online", () => {
    const tracker = aTracker({ lastSignalAt: minutesAgo(4) });

    const status = trackerStatus(tracker, NOW);

    expect(status).toBe("online");
  });

  it("5 daqiqadan 1 soatgacha signal bo'lmasa idle", () => {
    const tracker = aTracker({ lastSignalAt: minutesAgo(20) });

    const status = trackerStatus(tracker, NOW);

    expect(status).toBe("idle");
  });

  it("1 soatdan ortiq signal bo'lmasa offline", () => {
    const tracker = aTracker({ lastSignalAt: minutesAgo(180) });

    const status = trackerStatus(tracker, NOW);

    expect(status).toBe("offline");
  });
});
```

Nima o'zgardi:

- **Vaqt parametr sifatida berildi.** `trackerStatus` joriy vaqtni argument sifatida oladi va test qat'iy `NOW` ishlatadi. Bu testni Repeatable qiladi. Agar funksiya o'zi `new Date()` chaqirsa, `vi.useFakeTimers()` va `vi.setSystemTime()` yordam beradi, lekin vaqtni argument qilish odatda soddaroq (67-dars).
- **Mystery Guest yo'qoldi.** `aTracker` - Creation Method. Har test faqat muhim farqni ko'rsatadi: `lastSignalAt`. IMEI va raqam standart qiymat, chunki ular natijaga ta'sir qilmaydi.
- **Uchta testga bo'lindi.** Har biri bitta qoidani tekshiradi va nomi o'sha qoidani aytadi. Yiqilganda xabar o'zi tushuntiradi.
- **Mutatsiya yo'q.** Har test o'z obyektini yaratadi, shuning uchun testlar istalgan tartibda ishlaydi.
- **AAA bo'sh qatorlar bilan ajratilgan.** Bu kichik narsa, lekin testni bir qarashda o'qishga yordam beradi.

Starter'dagi `ignitionOn = false` qatoriga ham e'tibor bering: u natijaga ta'sir qiladimi yoki yo'qmi, testdan bilib bo'lmasdi. Agar u muhim bo'lsa, unga alohida, nomlangan test kerak.

## Qachon qo'llamaslik kerak

- **AAA'ni ko'r-ko'rona qo'llash.** Ba'zi testlarda Arrange bo'sh yoki Act va Assert birga (`expect(() => parse("")).toThrow()`). Uchta bo'limni majburan yaratish uchun sun'iy o'zgaruvchilar kiritmang.
- **Yordamchilarni haddan oshirish.** Domenga xos test tili foydali, lekin agar har bir testni tushunish uchun 4 ta yordamchi funksiya ichiga kirish kerak bo'lsa, bu yangi Mystery Guest. Yordamchi muhim ma'lumotni yashirmasligi, faqat shovqinni yashirishi kerak.
- **Har doim Fresh Fixture.** Real PostgreSQL bilan integratsion testlarda har test uchun sxemani noldan yaratish juda sekin bo'lishi mumkin. Bunday holatda migratsiyani bir marta bajarib, har testni tranzaksiyada ishlatish yoki snapshot'dan tiklash oqilona kompromiss (68-dars).
- **"Fast" ni mutlaqlashtirish.** Integratsion test unit testdan sekin bo'ladi va bu normal. Fast xususiyati nisbiy: test o'z darajasi uchun tez bo'lsin va uni ishga tushirishdan qochmaydigan darajada bo'lsin.
- **Timely'ni dogmaga aylantirish.** Testni koddan oldin yozish ba'zi vaziyatlarda samarali, ba'zilarida emas. Bu bahsni 64 va 65-darslarda ko'ramiz.

## Stack'da: Vitest, Jest, NestJS

- **Vaqt.** `vi.useFakeTimers()` va `vi.setSystemTime(...)` (Jest'da `jest.useFakeTimers()` va `jest.setSystemTime(...)`). `afterEach`da real taymerlarga qaytaring, aks holda keyingi testlar ham soxta vaqtda ishlaydi.
- **Tasodifiylik.** `crypto.randomUUID()` yoki `Math.random()` ishlatadigan kodda generatorni DI orqali bering yoki testda aniq qiymat bering.
- **Mustaqillik.** Vitest standart holatda test fayllarini parallel ishga tushiradi. Agar testlar umumiy DB jadvaliga yozsa, bu Erratic Test'larni tez ochib beradi. Bu yaxshi narsa.
- **NestJS.** `Test.createTestingModule`ni har test faylida yarating, global modul holatiga tayanmang. Agar provider holatga ega bo'lsa, `beforeEach`da yangi modul yarating.
- **Builder'lar.** Ko'p maydonli DTO'lar uchun `aVehicle()`, `anOrder()` kabi funksiyalar `test/builders` papkasida. `Partial<T>` bilan override qiling, tiplar esa noto'g'ri maydonni ushlaydi.

## Xulosa

- Test kodi production kodi kabi muhim. Iflos testlar vaqt o'tishi bilan yukka aylanadi va tashlab yuboriladi.
- F.I.R.S.T.: tez, mustaqil, takrorlanuvchi, o'zi tekshiradigan va o'z vaqtida yozilgan testlar.
- Har test aniq tuzilishga ega: Arrange-Act-Assert yoki Meszaros'ning to'rt fazali testi. Teardown'ni unutmang.
- Creation Method va domenga xos yordamchilar faqat muhim ma'lumotni testda qoldiradi.
- Mystery Guest, General Fixture, Assertion Roulette va Erratic Test - eng ko'p uchraydigan test smell'lar. Ularning ko'pchiligi F.I.R.S.T. buzilishining belgisi.
