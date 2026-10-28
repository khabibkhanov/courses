---
n: 70
slug: test-sifati
title: "Test sifati: coverage chegarasi va mutation testing"
summary: "100% coverage testlar yaxshi ekanini isbotlamaydi: u faqat kod ishga tushganini ko'rsatadi. Bu darsda coverage nimani o'lchashini va nimani o'lchamasligini, mutation testing qanday ishlashini, StrykerJS'ni TypeScript loyihasida sozlashni va test sifatini o'lchashning oqilona chegaralarini ko'rib chiqamiz."
duration: 40
sources:
  - id: stryker
    note: "Mutation testing nima, mutant holatlari (Killed, Survived, No coverage, Timeout, Ignored, Runtime/Compile error) va mutation score formulasi; StrykerJS konfiguratsiyasi (thresholds, incremental, checkers, coverageAnalysis), Vitest runner va qo'llab-quvvatlanadigan mutatorlar"
  - id: fowler-test-pyramid
    note: "Kuzatiladigan xatti-harakatni test qilish, trivial kodni (getter/setter) test qilmaslik, takrorlanuvchi testlardan qochish"
quiz:
  - q: "Funksiyaning 100% line coverage'i bor, lekin testlarning birortasida `expect` yo'q, faqat funksiya chaqiriladi. Bu nimani ko'rsatadi?"
    options:
      - "Testlar yaxshi, chunki coverage 100%"
      - "Coverage faqat kod ishga tushganini o'lchaydi, natija tekshirilganini emas. Mutation testing bunday testlarni darhol fosh qiladi"
      - "Coverage asbobi noto'g'ri sozlangan"
      - "Bu faqat branch coverage'da muammo"
    answer: 1
    explain: "Stryker hujjati aynan shuni ta'kidlaydi: testlar kodni hech narsa tasdiqlamasdan ishga tushirishi mumkin. Mutation testing kodga xato kiritadi, va hech narsani tekshirmaydigan test har qanday mutantda o'tadi, ya'ni mutantlar tirik qoladi."
  - q: "Stryker `if (liters >= limit)` ni `if (liters > limit)` ga o'zgartirdi va barcha testlar o'tdi. Bu mutant holati va xulosasi?"
    options:
      - "Survived: chegaraviy qiymat (liters === limit) uchun test yo'q"
      - "Killed: testlar ishladi"
      - "Timeout: cheksiz sikl"
      - "Compile error: tip xatosi"
    answer: 0
    explain: "Barcha testlar mutant faol bo'lganda o'tsa, mutant tirik qoladi. Bu odatda yetishmayotgan testni ko'rsatadi: bu holatda aynan limitga teng qiymat tekshirilmagan. Bunday test qo'shish mutantni o'ldiradi."
  - q: "Stryker hujjatidagi mutation score formulasi qanday?"
    options:
      - "Killed / jami mutantlar"
      - "Survived / (Killed + Survived)"
      - "Detected / valid × 100, bu yerda detected = killed + timeout, valid = detected + survived + no coverage"
      - "Coverage foizi × killed"
    answer: 2
    explain: "Timeout ham aniqlangan hisoblanadi (mutant cheksiz sikl yaratgan). Compile va runtime error'lar valid hisoblanmaydi, ignored mutantlar ham ballga ta'sir qilmaydi."
  - q: "Stryker 'equivalent mutant' topdi: `Math.max(0, x)` ning `x < 0 ? 0 : x` bilan ishlaydigan funksiyada `x <= 0` mutatsiyasi xatti-harakatni o'zgartirmaydi. Nima qilish kerak?"
    options:
      - "Mutantni o'ldirish uchun implementatsiyaga bog'langan test yozish"
      - "Stryker'ni o'chirish"
      - "Mutation score 100% bo'lishi uchun kodni murakkablashtirish"
      - "Mutant ekvivalent ekanini tushunib, uni e'tiborsiz qoldirish yoki disable kommenti bilan belgilash, 100% maqsad qilmaslik"
    answer: 3
    explain: "Ba'zi mutatsiyalar kuzatiladigan xatti-harakatni o'zgartirmaydi va ularni hech qanday xatti-harakat testi o'ldira olmaydi. Ularni majburan o'ldirishga urinish testlarni implementatsiyaga bog'laydi. Shuning uchun 100% mutation score maqsad bo'lmasligi kerak."
  - q: "CI'da coverage 80% dan past bo'lsa build yiqiladi. Jamoa getter'lar va DTO'lar uchun testlar yozib, ko'rsatkichni ko'tardi. Bu qaysi muammo?"
    options:
      - "Goodhart effekti: metrika maqsadga aylanganda u o'lchashi kerak bo'lgan narsani o'lchamay qo'yadi. Trivial kod uchun testlar ishonchni oshirmaydi"
      - "Bu to'g'ri yondashuv, chunki coverage oshdi"
      - "Coverage asbobining xatosi"
      - "Faqat branch coverage bilan muammo"
    answer: 0
    explain: "Vocke trivial kodni (oddiy getter va setter'lar) test qilmaslikni maslahat beradi. Coverage chegarasi testlarni xavfli logikaga emas, eng oson qoplanadigan kodga yo'naltirdi. Coverage pastligi signal sifatida foydali, yuqoriligi esa kafolat emas."
  - q: "Katta TypeScript loyihasida Stryker'ning to'liq ishga tushishi 40 daqiqa oladi. Qaysi yondashuv amaliy?"
    options:
      - "Har commit'da to'liq ishga tushirish"
      - "Mutation testing'dan voz kechish"
      - "`mutate` bilan kritik modullarni tanlash, `--incremental` rejimi, PR'da faqat o'zgargan fayllar, to'liq run esa tunda"
      - "Testlarni o'chirib, Stryker'ni tezlashtirish"
    answer: 2
    explain: "Stryker incremental rejimi oldingi natijalarni fayl (standart reports/stryker-incremental.json) da saqlab, keyingi ishga tushirishni tezlashtiradi. `mutate` bilan kritik domen kodiga cheklash va to'liq ishga tushirishni rejali qilish mutation testing'ni kundalik ishga sig'diradi."
task:
  title: "Tirik qolgan mutantlarni o'ldirish"
  prompt: |
    Quyidagi funksiya korporativ yoqilg'i kartasi tranzaksiyasini tasdiqlaydi. Uning testlari 100% line va branch coverage beradi. Stryker ishga tushirilganda esa bir nechta mutant tirik qoldi (pastda sharhda keltirilgan).

    1. Har bir tirik mutant uchun: u qaysi yetishmayotgan testni ko'rsatadi?
    2. Mutantlarni o'ldiradigan testlarni yozing. Testlar xatti-harakatni tekshirsin, implementatsiyani emas.
    3. Agar biror mutant ekvivalent bo'lsa, buni asoslang.
    4. Loyiha uchun minimal `stryker.config.mjs` yozing: Vitest runner, TypeScript checker, faqat `src/domain` papkasi, thresholds.
  lang: ts
  starter: |
    // src/domain/fuel-authorization.ts
    export type FuelRequest = { liters: number; usedTodayLiters: number; stationCountry: string };
    export type CardPolicy = { dailyLimitLiters: number; blocked: boolean; allowedCountries: string[] };
    export type Decision = { approved: true } | { approved: false; reason: "blocked" | "limit" | "country" };

    export function authorizeFuel(req: FuelRequest, policy: CardPolicy): Decision {
      if (policy.blocked) return { approved: false, reason: "blocked" };
      if (!policy.allowedCountries.includes(req.stationCountry)) {
        return { approved: false, reason: "country" };
      }
      if (req.usedTodayLiters + req.liters > policy.dailyLimitLiters) {
        return { approved: false, reason: "limit" };
      }
      return { approved: true };
    }

    // src/domain/fuel-authorization.spec.ts (100% coverage)
    import { expect, it } from "vitest";
    import { authorizeFuel } from "./fuel-authorization";

    const policy = { dailyLimitLiters: 100, blocked: false, allowedCountries: ["UZ"] };

    it("approves", () => {
      expect(authorizeFuel({ liters: 20, usedTodayLiters: 10, stationCountry: "UZ" }, policy).approved).toBe(true);
    });
    it("blocked", () => {
      expect(authorizeFuel({ liters: 20, usedTodayLiters: 0, stationCountry: "UZ" }, { ...policy, blocked: true }).approved).toBe(false);
    });
    it("country", () => {
      expect(authorizeFuel({ liters: 20, usedTodayLiters: 0, stationCountry: "KZ" }, policy).approved).toBe(false);
    });
    it("limit", () => {
      expect(authorizeFuel({ liters: 5, usedTodayLiters: 120, stationCountry: "UZ" }, policy).approved).toBe(false);
    });

    // Stryker hisobotidagi tirik mutantlar:
    // #1 EqualityOperator: `> policy.dailyLimitLiters` -> `>= policy.dailyLimitLiters`   Survived
    // #2 StringLiteral:    reason "blocked" -> ""                                         Survived
    // #3 StringLiteral:    reason "country" -> ""                                         Survived
    // #4 StringLiteral:    reason "limit" -> ""                                           Survived
    // #5 ArithmeticOperator: `req.usedTodayLiters + req.liters` -> `req.usedTodayLiters - req.liters`  Survived
  solution: |
    // src/domain/fuel-authorization.spec.ts
    import { describe, expect, it } from "vitest";
    import { authorizeFuel, type CardPolicy, type FuelRequest } from "./fuel-authorization";

    const policy: CardPolicy = { dailyLimitLiters: 100, blocked: false, allowedCountries: ["UZ"] };
    const request = (overrides: Partial<FuelRequest> = {}): FuelRequest => ({
      liters: 20,
      usedTodayLiters: 10,
      stationCountry: "UZ",
      ...overrides,
    });

    describe("authorizeFuel", () => {
      it("limit doirasidagi so'rovni tasdiqlaydi", () => {
        expect(authorizeFuel(request(), policy)).toEqual({ approved: true });
      });

      it("kunlik limitga aynan teng bo'lgan so'rovni tasdiqlaydi", () => {
        // mutant #1 ni o'ldiradi: 90 + 10 = 100, `>` -> `>=` bo'lsa rad etilardi
        expect(authorizeFuel(request({ usedTodayLiters: 90, liters: 10 }), policy)).toEqual({
          approved: true,
        });
      });

      it("ishlatilgan va so'ralgan litrlar yig'indisi limitdan oshsa limit sababi bilan rad etadi", () => {
        // mutant #4 va #5 ni o'ldiradi: 60 + 50 > 100, lekin 60 - 50 < 100
        expect(authorizeFuel(request({ usedTodayLiters: 60, liters: 50 }), policy)).toEqual({
          approved: false,
          reason: "limit",
        });
      });

      it("bloklangan kartani blocked sababi bilan rad etadi", () => {
        // mutant #2
        expect(authorizeFuel(request(), { ...policy, blocked: true })).toEqual({
          approved: false,
          reason: "blocked",
        });
      });

      it("ruxsat etilmagan davlatdagi shoxobchani country sababi bilan rad etadi", () => {
        // mutant #3
        expect(authorizeFuel(request({ stationCountry: "KZ" }), policy)).toEqual({
          approved: false,
          reason: "country",
        });
      });
    });

    // stryker.config.mjs
    /** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
    export default {
      testRunner: "vitest",
      checkers: ["typescript"],
      tsconfigFile: "tsconfig.json",
      mutate: ["src/domain/**/*.ts", "!src/domain/**/*.spec.ts"],
      reporters: ["clear-text", "progress", "html"],
      thresholds: { high: 80, low: 60, break: 70 },
      incremental: true,
    };
  solutionNotes: |
    - #1 chegaraviy qiymat yetishmasligini ko'rsatdi: limitga aynan teng so'rov. Bu biznes savoli ham: 100 litrlik limitda 100 litr ruxsatmi? Test javobni qotirdi.
    - #2-#4 testlar faqat `approved`ni tekshirganini ko'rsatdi. Sabab - API shartnomasining bir qismi (UI unga qarab xabar ko'rsatadi), shuning uchun `toEqual` bilan butun qaror tekshirildi.
    - #5 starter'dagi limit testi qiymatlari operatorni farqlay olmasligini ko'rsatdi: 120 + 5 ham, 120 - 5 ham limitdan katta. Yangi test (60 + 50) faqat yig'indi to'g'ri hisoblanganda rad etadi, ayirma (10) esa tasdiqlab yuborardi.
    - Ekvivalent mutant yo'q: barcha beshtasi kuzatiladigan xatti-harakatni o'zgartiradi.
    - Coverage o'zgarmadi (100% edi), lekin testlar endi haqiqatan xatolarni ushlaydi. Bu coverage va test sifati orasidagi farqning o'zi.
    - Konfiguratsiyada `checkers: ["typescript"]` uchun `@stryker-mutator/typescript-checker`, `testRunner: "vitest"` uchun `@stryker-mutator/vitest-runner` paketlari kerak. Vitest runner coverageAnalysis sozlamasini e'tiborsiz qoldiradi va doim perTest ishlatadi.
    - `break: 70` - CI'ni faqat sezilarli pasayishda yiqitadi. Uni loyihaning hozirgi ballidan sal pastroq qo'yib, asta ko'tarish mumkin.
  checklist:
    - "Har bir tirik mutant uchun yetishmayotgan test aniqlangan"
    - "Chegaraviy qiymat (limitga teng) testi qo'shilgan"
    - "Rad etish sababi har holatda tekshiriladi"
    - "Test qiymatlari arifmetik mutantni ajrata oladigan qilib tanlangan"
    - "stryker.config.mjs'da runner, checker, mutate va thresholds sozlangan"
---

## Muammo

Jamoada qoida bor: coverage 80% dan past bo'lsa, PR merge qilinmaydi. Bir yildan keyin coverage 87%. Lekin production'dagi xatolar soni kamaymadi. Testlarni ko'rib chiqsangiz, sababi ko'rinadi: ko'p testlar funksiyani chaqiradi va natija `toBeDefined()` yoki `toBeTruthy()` ekanini tekshiradi. Ba'zilarida `expect` umuman yo'q, faqat "xato tashlamadi". DTO va getter'lar uchun o'nlab testlar bor, chunki ular coverage'ni oson ko'taradi. Murakkab tarif hisoblash moduli esa 60% da, chunki uni test qilish qiyin.

Bu holat tasodif emas. Coverage **kod ishga tushganini** o'lchaydi, **natija tekshirilganini** emas. Ikkalasi bir xil narsa emas. Hech narsa tasdiqlamaydigan test ham kodni "qoplaydi". Coverage maqsadga aylanganda esa jamoa tabiiy ravishda eng arzon yo'lni tanlaydi: eng oson qoplanadigan kodni qoplaydi.

Savol tug'iladi: testlarning sifatini qanday o'lchash mumkin? Ya'ni testlar haqiqatan xatolarni ushlaydimi?

## Asosiy g'oya

### Coverage nimani aytadi va nimani aytmaydi

Coverage turlari: line (qator), statement (ifoda), branch (tarmoq) va function. Branch coverage line'dan kuchliroq: `if (a && b)` qatori bitta test bilan "qoplanadi", lekin `b` false bo'lgan tarmoq tekshirilmagan bo'lishi mumkin.

Coverage foydali, lekin faqat bir yo'nalishda: **past coverage - ishonchli signal**. Agar modul 30% qoplangan bo'lsa, uning katta qismi hech qachon test paytida ishga tushmagan va u yerdagi xatolar testlar bilan topilmaydi. **Yuqori coverage esa kafolat emas**. U "kod ishga tushdi" deydi, "kod to'g'ri" demaydi.

Ham Vocke *Practical Test Pyramid* maqolasida coverage haqida emas, nimani test qilish haqida gapiradi, lekin uning maslahati bu yerga to'g'ri keladi: kuzatiladigan xatti-harakatni test qiling va trivial kodni (oddiy getter va setter'lar) test qilmang. Coverage foizini ko'tarish uchun yozilgan testlar aynan teskarisini qiladi.

### Mutation testing

Mutation testing teskari savolni beradi: **agar kodda xato bo'lsa, testlar buni topadimi?** Stryker hujjati g'oyani shunday tushuntiradi: vosita production kodiga kichik xatolar (mutant) kiritadi va har biri uchun testlarni ishga tushiradi. Testlar yiqilishi kerak. Agar ular o'tsa, demak testlar bu joyni yetarli qamramayapti.

Mutantlar - oddiy, mexanik o'zgarishlar: `>=` ni `>` ga, `+` ni `-` ga, `&&` ni `||` ga, `true` ni `false` ga, string'ni bo'sh string'ga, blokni bo'sh blokka almashtirish, shartni `true` ga almashtirish, massiv metodini almashtirish (`some` ni `every` ga). Har bir mutant - dasturchi haqiqatan qilishi mumkin bo'lgan xatoning modeli.

### Mutant holatlari

Stryker hujjati mutant holatlarini aniq ta'riflaydi:

- **Killed** - mutant faol bo'lganda kamida bitta test yiqildi. Bu kerakli natija.
- **Survived** - mutant faol bo'lganda barcha testlar o'tdi. Test yetishmayapti.
- **No coverage** - mutantni hech qaysi test qamramaydi, shuning uchun u tirik qoladi.
- **Timeout** - mutant bilan testlar vaqt chegarasidan oshdi (masalan, cheksiz sikl). Aniqlangan hisoblanadi.
- **Ignored** - mutant foydalanuvchi qarori bilan yoki boshqa sabab bilan test qilinmagan. Ballga ta'sir qilmaydi, lekin hisobotda ko'rinadi.
- **Runtime error** va **Compile error** - mutant runner xatosiga yoki kompilyatsiya xatosiga olib keldi. Ballga kirmaydi.

### Mutation score

Stryker formulasi: **mutation score = detected / valid × 100**, bu yerda detected = killed + timeout, valid = detected + survived + no coverage. Ikkinchi ko'rsatkich ham bor: **covered code bo'yicha score** = detected / (detected + survived) × 100. U faqat testlar yetib borgan kod bo'yicha testlarning sifatini ko'rsatadi. Ikkala ko'rsatkichni birga o'qish foydali: birinchisi past, ikkinchisi yuqori bo'lsa, muammo coverage'da. Ikkalasi ham past bo'lsa, muammo tasdiqlarning sifatida.

## Chuqurroq: StrykerJS amalda

### O'rnatish va sozlash

Stryker hujjatiga ko'ra, boshlash uchun `npm init stryker@latest` buyrug'i ishlatiladi: u Stryker'ni o'rnatadi va loyiha haqida savollar beradigan sozlash ustasini ishga tushiradi. Natijada `stryker.config.mjs` fayli yaratiladi. Ishga tushirish: `npx stryker run`.

Asosiy sozlamalar (hujjatdagi standart qiymatlar bilan):

- **`testRunner`** - standart `"command"` (shunchaki `npm test`ni ishga tushiradi). Tezlik uchun runner plaginlari tavsiya qilinadi: Vitest uchun `@stryker-mutator/vitest-runner`, Jest uchun `@stryker-mutator/jest-runner`.
- **`mutate`** - qaysi fayllar mutatsiya qilinadi. Standart holatda `src` yoki `lib` ichidagi, test fayllaridan tashqari fayllar. Qator oralig'ini ham ko'rsatish mumkin.
- **`coverageAnalysis`** - `off`, `all` yoki `perTest`, standart `perTest`: har mutant uchun faqat uni qamraydigan testlar ishga tushadi. Vitest runner bu sozlamani e'tiborsiz qoldiradi va har doim perTest ishlatadi.
- **`checkers: ["typescript"]`** - TypeScript checker har bir mutantni ishga tushirishdan oldin tip xatosiga tekshiradi. Tip xatosi beradigan mutantlar (Compile error) testlarni behuda ishga tushirmaydi.
- **`thresholds`** - standart `{ high: 80, low: 60, break: null }`. `break` - bu balldan past bo'lsa Stryker 1 kodi bilan chiqadi, ya'ni CI yiqiladi. `null` - hech qachon yiqitmaydi. Hujjatga ko'ra, uchala qiymatni ham berish yoki hech birini bermaslik kerak.
- **`incremental`** - standart `false`. Yoqilganda natijalar `reports/stryker-incremental.json` faylida saqlanadi va keyingi ishga tushirishda faqat o'zgargan kod va testlar uchun mutantlar qayta tekshiriladi.
- **`concurrency`** - parallel worker'lar soni. Standart holatda yadrolar soniga bog'liq.
- **`ignoreStatic`** - faqat modul yuklanganda ishlaydigan "statik" mutantlarni o'tkazib yuboradi. Bu mutantlar har biri uchun barcha testlarni ishga tushirishni talab qiladi va sekin.

Vitest runner'ning cheklovlari ham bor: hujjatga ko'ra browser mode qo'llab-quvvatlanmaydi.

### Hisobotni o'qish

HTML hisobot har bir faylni ko'rsatadi va tirik mutantlarni qator ichida belgilaydi. Har tirik mutant uchun savol bitta: **qaysi test yetishmayapti?** Odatiy javoblar:

- **EqualityOperator tirik** (`>` -> `>=`): chegaraviy qiymat testi yo'q.
- **StringLiteral tirik**: xato xabari yoki kod umuman tekshirilmagan. Agar u shartnomaning qismi bo'lsa (masalan, API'dagi xato kodi), test yozing. Agar faqat log xabari bo'lsa, ehtimol mutantni e'tiborsiz qoldirish to'g'ri.
- **BlockStatement tirik** (blok bo'shatilgan): blokning yon ta'siri (masalan, audit yozuvi) tekshirilmagan.
- **ConditionalExpression tirik** (shart `true` ga): shart false bo'lgan holat testlanmagan.
- **ArithmeticOperator tirik**: test qiymatlari operatorlarni farqlay olmaydi (masalan, `x * 1` va `x / 1` bir xil).

### Ekvivalent mutantlar

Ba'zi mutantlar kuzatiladigan xatti-harakatni umuman o'zgartirmaydi. Masalan, `items.length > 0 ? items[0] : undefined` dagi `>` ni `>=` ga almashtirish: bo'sh massivda `items[0]` baribir `undefined`. Bunday mutantni hech qanday xatti-harakat testi o'ldira olmaydi. Uni o'ldirishga urinish testni implementatsiyaga bog'laydi yoki kodni sun'iy murakkablashtiradi. To'g'ri yo'l - mutant ekvivalent ekanini tushunish va Stryker'ning disable kommenti bilan sababini yozib belgilash. Aynan shuning uchun 100% mutation score real maqsad emas.

### Narx

Mutation testing qimmat: har bir mutant uchun testlar qaytadan ishga tushadi. Kichik modul uchun bu soniyalar, katta loyiha uchun soatlar bo'lishi mumkin. Amaliy strategiyalar:

- **`mutate` bilan cheklash.** Avval eng xavfli kod: domen qoidalari, to'lovlar, hisob-kitoblar. Controller'lar, DTO'lar, konfiguratsiya fayllari kerak emas.
- **Incremental rejim** PR'larda.
- **To'liq ishga tushirish** rejali (masalan, tunda) va hisobot jamoa ko'radigan joyda.
- **`break` chegarasini ehtiyotkorlik bilan.** Hozirgi balldan sal past qo'ying va asta ko'taring.

## Misol: ijara depozitini qaytarish

Mashina qaytarilganda depozitdan zarar summasi ushlab qolinadi, qolgani qaytariladi. Zarar depozitdan oshsa, qaytarish 0, farqi esa qarz sifatida yoziladi.

```ts run
export type DepositSettlement = { refund: number; debt: number };

export function settleDeposit(deposit: number, damage: number): DepositSettlement {
  if (damage < 0) throw new RangeError("Zarar summasi manfiy bo'lishi mumkin emas");
  if (damage > deposit) {
    return { refund: 0, debt: damage - deposit };
  }
  return { refund: deposit - damage, debt: 0 };
}

// Sinab ko'ring: depozit va zarar summalarini o'zgartiring, chegaralarni tekshiring.
for (const damage of [0, 300_000, 1_000_000, 1_500_000]) {
  console.log(`zarar ${damage}:`, settleDeposit(1_000_000, damage));
}
```

Mavjud testlar 100% line va branch coverage beradi:

```ts
it("zarar bo'lmasa depozitni qaytaradi", () => {
  expect(settleDeposit(1_000_000, 0).refund).toBe(1_000_000);
});

it("katta zararda qaytarish yo'q", () => {
  expect(settleDeposit(1_000_000, 1_500_000).refund).toBe(0);
});

it("manfiy zararni rad etadi", () => {
  expect(() => settleDeposit(1_000_000, -1)).toThrow();
});
```

Stryker natijasi (soddalashtirilgan):

```text
[Killed]   EqualityOperator   damage < 0  ->  damage <= 0
[Killed]   ObjectLiteral      { refund: 0, debt: ... }  ->  {}
[Survived] EqualityOperator   damage > deposit  ->  damage >= deposit
[Survived] ArithmeticOperator damage - deposit  ->  damage + deposit
[Survived] ArithmeticOperator deposit - damage  ->  deposit + damage
[Survived] StringLiteral      "Zarar summasi manfiy..."  ->  ""
```

To'rtta tirik mutant, 100% coverage bilan. Avval o'ldirilganlarga qarang: `<= 0` mutanti bilan 0 zarar xato tashlaydi va birinchi test yiqiladi; bo'sh obyekt mutanti bilan `refund` `undefined` bo'ladi va ikkinchi test yiqiladi. Demak bu joylar haqiqatan tekshirilgan. Tirik mutantlar esa har biri bitta yetishmayotgan narsani aytadi:

- `>` -> `>=`: zarar depozitga aynan teng holati yo'q. Lekin tekshirib ko'rsak, `damage === deposit` da birinchi tarmoq ham `{ refund: 0, debt: 0 }`, ikkinchisi ham `{ refund: 0, debt: 0 }` qaytaradi. Bu **ekvivalent mutant**: uni hech qanday xatti-harakat testi o'ldira olmaydi.
- `damage - deposit` -> `+`: `debt` hech qachon tekshirilmagan.
- `deposit - damage` -> `+`: qisman zarar holati yo'q. Zarar 0 bo'lganda `-` va `+` bir xil natija beradi, shuning uchun test qiymatlari operatorni farqlay olmaydi.
- StringLiteral: xato xabari tekshirilmagan. Bu yerda xato turi (`RangeError`) shartnoma, matn esa log uchun. Turini tekshirish yetarli, matn mutantini sababini yozib e'tiborsiz qoldirish mumkin.

Mutantlarni tahlil qilganda har birini shunday ko'rib chiqish kerak: hisobot nima deydi, nega, va bu haqiqatan muhim xatti-harakatmi.

Tuzatilgan testlar:

```ts
import { describe, expect, it } from "vitest";
import { settleDeposit } from "./settle-deposit";

describe("settleDeposit", () => {
  it.each([
    { damage: 0, expected: { refund: 1_000_000, debt: 0 } },
    { damage: 300_000, expected: { refund: 700_000, debt: 0 } },
    { damage: 1_000_000, expected: { refund: 0, debt: 0 } },
    { damage: 1_500_000, expected: { refund: 0, debt: 500_000 } },
  ])("1 000 000 depozit, $damage zarar", ({ damage, expected }) => {
    expect(settleDeposit(1_000_000, damage)).toEqual(expected);
  });

  it("manfiy zararni rad etadi", () => {
    expect(() => settleDeposit(1_000_000, -1)).toThrow(RangeError);
  });
});
```

Nima o'zgardi:

- **Butun natija tekshiriladi.** `toEqual` ham `refund`ni, ham `debt`ni qamraydi. `debt` arifmetikasi mutanti o'ldi.
- **Xato turi aniq.** `toThrow(RangeError)` boshqa turdagi xatoda o'tmaydi. Xabar matni mutanti esa ataylab e'tiborsiz qoldirildi.
- **Qisman zarar holati qo'shildi.** 300 000 zararda `deposit - damage` va `deposit + damage` farq qiladi.
- **Chegaraviy holat hujjatlashtirildi.** Zarar depozitga teng holat testda bor, garchi u ekvivalent mutantni o'ldirmasa ham. U biznes qoidasini qotiradi.
- **Coverage o'zgarmadi.** 100% edi, 100% qoldi. Lekin testlar endi to'rtta real xato turini ushlaydi. Bu farqni coverage ko'rsata olmaydi.

E'tibor bering: hisobotdagi har bir tirik mutantni o'ylab ko'ring, ko'r-ko'rona test qo'shmang. Ekvivalent mutant uchun test yozishga urinish vaqt isrofi, xabar matni uchun test esa testni keraksiz mo'rt qiladi.

## Qachon qo'llamaslik kerak

- **Coverage foizini qat'iy chegara qilish.** Past coverage'ni signal sifatida ishlating (yangi modul 20% bo'lsa, savol bering), lekin yuqori foizni maqsad qilmang. Agar chegara bo'lsa, uni butun loyihaga emas, o'zgargan kodga qo'llang va trivial kodni hisobdan chiqaring.
- **Mutation testing hamma joyda.** UI tartibi, konfiguratsiya, DTO'lar, generatsiya qilingan kod, oddiy proksi servislar uchun mutantlar ko'pincha shovqin. Stryker'ni domen logikasiga yo'naltiring.
- **100% mutation score.** Ekvivalent mutantlar va qiymati past mutantlar (log xabarlari) tufayli bu maqsad testlarni implementatsiyaga bog'laydi. Kritik modullar uchun 80-90% dan yuqori ball odatda yaxshi natija, lekin bu qat'iy me'yor emas, jamoa kelishuvi.
- **Sekin testlar bilan.** Agar unit testlar o'zi bir necha daqiqa ishlasa, mutation testing amalda ishlamaydi. Avval testlarni tezlashtiring (61 va 67-darslar).
- **Integratsion testlar ustida.** Real DB bilan testlarni har mutant uchun qayta ishga tushirish juda qimmat. Mutation testing asosan tez unit testlar uchun mo'ljallangan.

## Stack'da: Vitest, Jest, CI

- **Coverage.** Vitest: `vitest run --coverage` (`@vitest/coverage-v8` yoki `@vitest/coverage-istanbul`). Jest: `jest --coverage`. Hisobotni PR'da ko'rsating, lekin asosiy e'tiborni o'zgargan qatorlarga qarating.
- **Stryker paketlari.** `@stryker-mutator/core`, runner (`@stryker-mutator/vitest-runner` yoki `@stryker-mutator/jest-runner`) va `@stryker-mutator/typescript-checker`. NestJS loyihasida qaysi runner ishlatilayotganini tekshiring: eski loyihalar odatda Jest'da.
- **CI.** PR'da `npx stryker run --incremental` va faqat domen papkasi. Incremental fayl CI keshida saqlansin, aks holda har safar noldan boshlanadi.
- **Hisobot.** HTML hisobotni artefakt sifatida saqlang. Tirik mutantlarni code review'da muhokama qilish testlarning sifati haqida eng aniq suhbatni beradi.
- **Disable kommentlari.** Ekvivalent mutantni sababini yozib o'chiring. Sababsiz disable - texnik qarz.

## Xulosa

- Coverage kod ishga tushganini o'lchaydi, natija tekshirilganini emas. Past coverage - signal, yuqori coverage - kafolat emas.
- Coverage maqsadga aylansa, jamoa eng oson qoplanadigan, ko'pincha trivial kodni test qiladi.
- Mutation testing kodga kichik xatolar kiritib, testlar ularni topishini tekshiradi. Tirik mutant - yetishmayotgan test haqidagi aniq ko'rsatma.
- Stryker formulasi: detected (killed + timeout) / valid × 100. Covered code bo'yicha score coverage va tasdiq sifatini ajratadi.
- StrykerJS: Vitest yoki Jest runner, TypeScript checker, `mutate` bilan kritik kod, incremental rejim, thresholds bilan CI.
- Ekvivalent mutantlar bor, shuning uchun 100% mutation score maqsad emas. Har bir tirik mutantni o'ylab tahlil qiling.
