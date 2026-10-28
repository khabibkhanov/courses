---
n: 64
slug: tdd-sikli
title: "TDD sikli: red-green-refactor"
summary: "Test-Driven Development - bu test yozish usuli emas, balki dizayn va kodlash ritmi. Bu darsda Kent Beckning red-green-refactor siklini, Beckning test ro'yxati va green bar patternlarini, Martinning TDD sikllari ierarxiyasini va ularni TypeScript'da amalda qo'llashni ko'rib chiqamiz."
duration: 40
sources:
  - id: tdd-beck
    note: "I qism (Money misoli) va III qism patternlari: Test List, Fake It, Triangulate, Obvious Implementation, red-green-refactor ritmi, \"clean code that works\" maqsadi"
  - id: uncle-bob-tdd-cycles
    note: "TDD'ning to'rt sikli: uch qonun (soniyalar), red-green-refactor (daqiqalar), specific/generic (o'n daqiqalar), arxitektura chegaralari (soatlar)"
quiz:
  - q: "Red bosqichida test yiqilishi kerak. Nega testni birinchi marta ishga tushirib, uning yiqilganini ko'rish muhim?"
    options:
      - "Chunki yiqilgan test coverage'ni oshiradi"
      - "Chunki test haqiqatan ham kerakli xatti-harakatni tekshirayotganini va doim o'tib ketmasligini isbotlaydi"
      - "Chunki CI faqat yiqilgan testlarni ko'radi"
      - "Chunki Martin qonunlari shuni talab qiladi, boshqa sababi yo'q"
    answer: 1
    explain: "Hech qachon yiqilmagan test hech narsani isbotlamaydi: u noto'g'ri narsani tekshirishi yoki umuman ishga tushmasligi mumkin (masalan, await unutilgan). Red bosqichi testning o'zini tekshiradi."
  - q: "Green bosqichida `return 1_890_000;` deb qat'iy qiymat qaytarish Beck bo'yicha qaysi pattern va u nima uchun qilinadi?"
    options:
      - "Fake It: tezda yashil holatga o'tish, keyin konstantani asta-sekin umumiy kodga almashtirish"
      - "Triangulate: ikki misol orqali umumlashtirish"
      - "Obvious Implementation: to'g'ri kodni darhol yozish"
      - "Bu xato, TDD'da hech qachon konstanta qaytarilmaydi"
    answer: 0
    explain: "Fake It - Beckning green bar patternlaridan biri. U ishonch past bo'lganda qadamni kichraytiradi: avval yashil, keyin refactor bosqichida takrorni (test va koddagi bir xil raqamni) yo'qotish orqali umumlashtirish. Ishonch yuqori bo'lsa, Obvious Implementation ishlatiladi."
  - q: "Martinning 'As the tests get more specific, the code gets more generic' qoidasi nimani anglatadi?"
    options:
      - "Testlar soni ortgan sari kod ko'proq if-else oladi"
      - "Kod har bir test uchun alohida tarmoq qo'shishi kerak"
      - "Har yangi test kodni har bir alohida holatni emas, umumiy qoidani amalga oshirishga undashi kerak. Kod yozilmagan testlardan ham o'tmasa, u juda spetsifik"
      - "Testlar umumiy, kod esa spetsifik bo'lishi kerak"
    answer: 2
    explain: "Agar har yangi test uchun koddagi yangi `if (days === 7)` qo'shilsa, kod testlarni 'yodlayapti'. Martin bu holatni to'xtab qolish belgisi deb biladi va testlarni sekinroq aniqlashtirib, kodni tezroq umumlashtirishni maslahat beradi."
  - q: "Refactor bosqichida nima qilish mumkin emas?"
    options:
      - "Takrorlanishni olib tashlash"
      - "Nomlarni yaxshilash"
      - "Testlarni ham tozalash"
      - "Yangi xatti-harakat qo'shish"
    answer: 3
    explain: "Refactor bosqichida testlar yashil qoladi va xatti-harakat o'zgarmaydi. Yangi xatti-harakat yangi qizil test bilan boshlanadi. Test kodi ham bu bosqichda tozalanishi mumkin va kerak."
  - q: "Beckning Test List patterni nima uchun kerak?"
    options:
      - "CI'da qaysi testlar ishga tushishini belgilash uchun"
      - "Hozir o'ylab turgan, lekin hali yozilmagan test g'oyalarini qog'ozga tushirib, diqqatni bitta qadamga qaratish uchun"
      - "Har bir test uchun ticket ochish uchun"
      - "Coverage hisobotini yaratish uchun"
    answer: 1
    explain: "Test ro'yxati yangi g'oyalar (chegaraviy holatlar, xato holatlari) paydo bo'lganda ularni yo'qotmasdan, hozirgi bitta testga diqqatni saqlashga yordam beradi. Ro'yxat ish davomida o'zgaradi."
  - q: "Martin TDD'ning eng katta siklini (taxminan soatlik) nima bilan bog'laydi?"
    options:
      - "Arxitektura chegaralari: to'xtab, tizimni butunligicha ko'rish va keyingi soatdagi ishning qaysi chegara tomonida bo'lishini aniqlash"
      - "Kodni production'ga deploy qilish"
      - "Code review o'tkazish"
      - "Coverage hisobotini tekshirish"
    answer: 0
    explain: "Cycles of TDD maqolasida eng tashqi sikl - chegaralar. Bu sikl kichik sikllardagi detalli ishni arxitektura bilan moslashtirib turadi. Deploy va review TDD sikllari tarkibiga kirmaydi."
task:
  title: "TDD bilan yoqilg'i sarfi normasini yozish"
  prompt: |
    Transport parki uchun yoqilg'i sarfi normasini hisoblaydigan funksiya kerak: `fuelNorm(trip)` sayohat uchun me'yoriy litrni qaytaradi.

    Qoidalar:
    - Asosiy norma: mashina modeli bo'yicha 100 km ga litr (`baseLitersPer100Km`).
    - Qishda (dekabr, yanvar, fevral) norma 10% oshadi.
    - Konditsioner yoqilgan bo'lsa yana 7% oshadi (qish koeffitsientiga ko'paytiriladi).
    - Natija 0.1 litrgacha yaxlitlanadi.
    - Masofa manfiy bo'lsa, RangeError.

    Vazifa:
    1. Avval test ro'yxatini yozing (kamida 6 band).
    2. Har bir band uchun red-green-refactor siklini bajaring. Starter'da birinchi qizil test berilgan.
    3. Kamida bir marta Fake It, bir marta Triangulate ishlating va qayerda ishlatganingizni sharhda belgilang.
    4. Yakuniy kodni va testlar to'plamini topshiring.
  lang: ts
  starter: |
    // Test ro'yxati (to'ldiring):
    // [ ] 100 km, 10 l/100km, yoz -> 10 l
    // [ ] ...

    // fuel-norm.spec.ts
    import { describe, expect, it } from "vitest";
    import { fuelNorm } from "./fuel-norm";

    describe("fuelNorm", () => {
      it("yozda 100 km uchun asosiy normani qaytaradi", () => {
        expect(
          fuelNorm({
            distanceKm: 100,
            baseLitersPer100Km: 10,
            month: 7,
            airConditioning: false,
          }),
        ).toBe(10);
      });
    });

    // fuel-norm.ts
    export type Trip = {
      distanceKm: number;
      baseLitersPer100Km: number;
      month: number; // 1-12
      airConditioning: boolean;
    };

    export function fuelNorm(trip: Trip): number {
      throw new Error("Not implemented");
    }
  solution: |
    // Test ro'yxati:
    // [x] 100 km, 10 l/100km, yoz -> 10 l            (Fake It: return 10)
    // [x] 250 km, 8 l/100km, yoz -> 20 l             (Triangulate: formula paydo bo'ldi)
    // [x] qish oylari (12, 1, 2) -> +10%             (it.each)
    // [x] mart va noyabr qish emas                   (chegaralar)
    // [x] konditsioner -> +7%, qish bilan ko'paytiriladi
    // [x] 0.1 litrgacha yaxlitlash
    // [x] manfiy masofa -> RangeError

    // fuel-norm.spec.ts
    import { describe, expect, it } from "vitest";
    import { fuelNorm, type Trip } from "./fuel-norm";

    const summerTrip = (overrides: Partial<Trip> = {}): Trip => ({
      distanceKm: 100,
      baseLitersPer100Km: 10,
      month: 7,
      airConditioning: false,
      ...overrides,
    });

    describe("fuelNorm", () => {
      it("yozda 100 km uchun asosiy normani qaytaradi", () => {
        expect(fuelNorm(summerTrip())).toBe(10);
      });

      it("normani masofaga mutanosib hisoblaydi", () => {
        expect(fuelNorm(summerTrip({ distanceKm: 250, baseLitersPer100Km: 8 }))).toBe(20);
      });

      it.each([12, 1, 2])("qishda (%i-oy) normani 10%% oshiradi", (month) => {
        expect(fuelNorm(summerTrip({ month }))).toBe(11);
      });

      it.each([3, 11])("%i-oy qish hisoblanmaydi", (month) => {
        expect(fuelNorm(summerTrip({ month }))).toBe(10);
      });

      it("konditsioner normani 7% oshiradi va qish koeffitsientiga ko'paytiriladi", () => {
        expect(fuelNorm(summerTrip({ airConditioning: true }))).toBe(10.7);
        expect(fuelNorm(summerTrip({ airConditioning: true, month: 1 }))).toBe(11.8);
      });

      it("natijani 0.1 litrgacha yaxlitlaydi", () => {
        expect(fuelNorm(summerTrip({ distanceKm: 33 }))).toBe(3.3);
        expect(fuelNorm(summerTrip({ distanceKm: 37, baseLitersPer100Km: 9 }))).toBe(3.3);
      });

      it("manfiy masofani rad etadi", () => {
        expect(() => fuelNorm(summerTrip({ distanceKm: -1 }))).toThrow(RangeError);
      });
    });

    // fuel-norm.ts
    export type Trip = {
      distanceKm: number;
      baseLitersPer100Km: number;
      month: number; // 1-12
      airConditioning: boolean;
    };

    const WINTER_MONTHS = new Set([12, 1, 2]);
    const WINTER_FACTOR = 1.1;
    const AIR_CONDITIONING_FACTOR = 1.07;

    export function fuelNorm(trip: Trip): number {
      if (trip.distanceKm < 0) {
        throw new RangeError(`Masofa manfiy bo'lishi mumkin emas: ${trip.distanceKm}`);
      }
      const base = (trip.distanceKm / 100) * trip.baseLitersPer100Km;
      const seasonFactor = WINTER_MONTHS.has(trip.month) ? WINTER_FACTOR : 1;
      const acFactor = trip.airConditioning ? AIR_CONDITIONING_FACTOR : 1;
      return roundToTenth(base * seasonFactor * acFactor);
    }

    function roundToTenth(liters: number): number {
      return Math.round(liters * 10) / 10;
    }
  solutionNotes: |
    - Birinchi test `return 10` (Fake It) bilan yashil bo'ldi. Ikkinchi test (250 km, 8 l) qat'iy qiymatni buzdi va formulani majbur qildi: bu Triangulate.
    - Qish oylari `it.each` bilan, chegaralar (3 va 11) alohida test: `month >= 12 || month <= 2` kabi xatolarni ushlaydi.
    - Konditsioner testi ikki tekshiruvdan iborat, lekin bitta tushuncha: koeffitsientlar ko'paytiriladi. 11.77 -> 11.8 yaxlitlash ham shu yerda ko'rinadi.
    - Yaxlitlash alohida test oldi, chunki float xatolari (`0.1 + 0.2`) aynan shu yerda chiqadi. `roundToTenth` refactor bosqichida ajratildi.
    - Magic number'lar refactor bosqichida konstantalarga aylandi: testlar yashil qolgan holda.
    - TDD natijasi faqat kod emas: test ro'yxati talabdagi noaniqliklarni ochdi (koeffitsientlar qo'shiladimi yoki ko'paytiriladimi). Real loyihada bu savolni biznesga berish kerak edi.
  checklist:
    - "Test ro'yxati yozilgan va ish davomida yangilangan"
    - "Har test avval qizil holatda ko'rilgan"
    - "Fake It va Triangulate qayerda ishlatilgani belgilangan"
    - "Chegaraviy holatlar (qish oylari chegarasi, yaxlitlash, manfiy masofa) testlangan"
    - "Refactor bosqichida magic number'lar va takror olib tashlangan, testlar yashil qolgan"
---

## Muammo

Odatiy ish oqimi shunday: talabni o'qiysiz, kodni yozasiz, Postman yoki brauzer orqali qo'lda tekshirasiz, keyin vaqt qolsa test yozasiz. Bu oqimda uchta muammo bor.

Birinchisi - testlar ko'pincha yozilmaydi, chunki "vaqt qolsa" degan shart kamdan-kam bajariladi. Ikkinchisi - kod yozib bo'lingandan keyin yozilgan testlar kodni tekshiradi, talabni emas: siz kod nima qilayotganini ko'rasiz va shunga mos tasdiq yozasiz. Xato kodda bo'lsa, u testga ham ko'chadi. Uchinchisi - kod test qilish qiyin shaklda chiqadi: `new Date()` ichkarida, DB chaqiruvi logika bilan aralash, 200 qatorli metod.

Test-Driven Development (TDD) bu tartibni teskari aylantiradi: avval xatti-harakatni tasvirlovchi test, keyin uni qondiruvchi minimal kod, keyin tozalash. Kent Beck *Test-Driven Development: By Example* kitobida bu usulning maqsadini Ron Jeffries iborasi bilan beradi: "clean code that works" - ishlaydigan toza kod. E'tibor bering: maqsad test emas, balki ishlaydigan va toza kod. Testlar - vosita.

## Asosiy g'oya

### Red-green-refactor

Beck TDD ritmini uch bosqichda tasvirlaydi:

1. **Red.** Kichik test yozing. U ishlamaydi, ehtimol hatto kompilyatsiya ham bo'lmaydi.
2. **Green.** Testni tezda o'tkazing. Buning uchun har qanday "gunoh" (qat'iy qiymat, nusxa ko'chirish) mumkin.
3. **Refactor.** Testni o'tkazish uchun qo'shilgan takrorlanishni va boshqa nuqsonlarni olib tashlang.

Bu bosqichlarning ajratilishi muhim. Green bosqichida siz faqat bitta savolga javob berasiz: "bu ishlaydimi?" Refactor bosqichida esa boshqa savolga: "bu toza va to'g'ri tuzilganmi?" Ikkala savolni bir vaqtda hal qilishga urinish kognitiv yukni ikki barobar oshiradi. Martin *The Cycles of TDD* maqolasida bu fikrni Beckning boshqa mashhur printsipiga bog'laydi: avval ishlasin, keyin to'g'ri bo'lsin, keyin tez bo'lsin.

### Martinning to'rt sikli

Robert Martin TDD'ni bir-birining ichiga joylashgan sikllar sifatida tasvirlaydi:

- **Nano-sikl (soniyalar): TDD'ning uch qonuni.** Birinchi qonun: "You must write a failing test before you write any production code." Ikkinchisi: yiqilish uchun (yoki kompilyatsiya bo'lmaslik uchun) yetarli bo'lgandan ortiq test yozmang. Uchinchisi: hozirgi yiqilgan testni o'tkazish uchun yetarli bo'lgandan ortiq production kodi yozmang. Bu qonunlar test va kod o'rtasida juda tez almashinishni majbur qiladi.
- **Mikro-sikl (daqiqalar): red-green-refactor.** Beck sikli. Martin refaktoring loyiha oxiriga rejalashtirilmasligini, balki har daqiqada uzluksiz qilinishini ta'kidlaydi.
- **Milli-sikl (taxminan o'n daqiqa): specific/generic.** Martin qoidasi: testlar spetsifik bo'lgan sari kod umumiy bo'lishi kerak. Agar kod hozirgi testlardan o'tsa-yu, hali yozilmagan, lekin to'g'ri bo'lgan testlardan o'tmasa, u juda spetsifik. To'xtab qolish (keyingi testni o'tkazish uchun katta qayta yozish kerak bo'lishi) aynan shu belgisi. Yechim: orqaga qaytish, testlarni sekinroq aniqlashtirish va kodni tezroq umumlashtirish.
- **Asosiy sikl (taxminan soatlik): chegaralar.** Detalli ishdan to'xtab, tizimni butunligicha ko'rish, qaysi arxitektura chegaralarini nazorat qilishni va hozirgi ish chegaraning qaysi tomonida bo'lishini aniqlash.

Bu ierarxiya ko'pincha e'tibordan chetda qoladi. TDD haqidagi bahslarda ko'pchilik faqat uch qonunni ko'radi, lekin Martin uchun TDD dizayn haqida o'ylashni ham o'z ichiga oladi: refactor bosqichida va soatlik chegaralar siklida. Bu bahsni 65-darsda batafsil ko'ramiz.

## Chuqurroq: Beckning patternlari

Beck kitobining uchinchi qismida TDD'ni amalda qo'llash uchun patternlar katalogini beradi. Ulardan eng muhimlari quyidagilar.

### Test List

Ishni boshlashdan oldin tekshirish kerak bo'lgan barcha misollar ro'yxatini yozing: oddiy holatlar, chegaralar, xatolar. Ish davomida yangi g'oya kelsa, uni ro'yxatga qo'shing, lekin hozirgi testdan chalg'imang. Ro'yxat ikki vazifani bajaradi: diqqatni bitta qadamda saqlaydi va hech narsa unutilmasligini kafolatlaydi. Amaliyotda bu `it.todo("...")` qatorlari yoki fayl tepasidagi sharh bo'lishi mumkin.

### Green bar patternlari: Fake It, Triangulate, Obvious Implementation

Testni yashil qilishning uchta usuli bor va ularni tanlash sizning ishonchingizga bog'liq:

- **Fake It ('Til You Make It).** Test kutgan konstantani qaytaring. Keyin refactor bosqichida konstantani asta-sekin o'zgaruvchilar bilan almashtiring. Bu eng kichik qadam. U hazilga o'xshaydi, lekin foydasi bor: testning o'zi to'g'ri ishlashini tekshiradi va sizni darhol yashil holatga olib boradi.
- **Triangulate.** Ikkinchi, boshqa qiymatli misol qo'shing. Endi konstanta ikkala testni qondirmaydi va umumlashtirish majburiy bo'ladi. Beck bu usulni qanday umumlashtirishni bilmaganingizda ishlatishni tavsiya qiladi.
- **Obvious Implementation.** Agar to'g'ri kod aniq bo'lsa, uni darhol yozing. Beck ochiq aytadi: u ko'pincha shunday ishlaydi va faqat kutilmagan qizil holat chiqqanda kichikroq qadamlarga (Fake It, Triangulate) qaytadi.

Bu nozik nuqta: TDD har doim mitti qadamlar degani emas. Qadam o'lchami - bu boshqariladigan parametr. Ishonch yuqori bo'lsa, qadamlar katta. Kutilmagan natija chiqsa, qadamlar kichrayadi.

### Refactor: takrorni yo'qotish

Beck kitobidagi Money misolida refaktoringning asosiy harakatlantiruvchisi - takrorlanish. Fake It'dan keyin testdagi `10` va koddagi `10` bir xil ma'lumot. Bu takrorni yo'qotish (masalan, `10`ni `distanceKm / 100 * baseLitersPer100Km` ga almashtirish) umumlashtirishning o'zi bo'ladi. Shuning uchun Fake It va refactor bir-biriga bog'langan: biri takror yaratadi, ikkinchisi uni dizaynga aylantiradi.

Refactor bosqichida test kodi ham tozalanadi: takrorlanuvchi tayyorgarlik Creation Method'ga chiqariladi, nomlar aniqlashtiriladi (62-dars).

## Misol: ijara narxidagi chegirma

Talab: mashina ijarasida 7 kundan boshlab 10%, 30 kundan boshlab 25% chegirma. Keling, sikllarni ketma-ket ko'ramiz.

**Test ro'yxati:** 1 kun - to'liq narx; 7 kun - 10%; 30 kun - 25%; 6 va 29 kun chegaralari; 0 kun - xato.

**1-sikl, red:**

```ts
import { describe, expect, it } from "vitest";
import { rentalTotal } from "./rental-total";

describe("rentalTotal", () => {
  it("1 kunlik ijara uchun kunlik narxni qaytaradi", () => {
    expect(rentalTotal({ dailyRate: 300_000, days: 1 })).toBe(300_000);
  });
});
```

Test kompilyatsiya bo'lmaydi: `rentalTotal` yo'q. Bu ham qizil holat.

**1-sikl, green (Fake It):**

```ts
export type RentalQuote = { dailyRate: number; days: number };

export function rentalTotal(_quote: RentalQuote): number {
  return 300_000;
}
```

**2-sikl, red-green (Triangulate):** `{ dailyRate: 300_000, days: 3 }` uchun `900_000` kutadigan test qo'shamiz. Konstanta endi ishlamaydi va kod `quote.dailyRate * quote.days` ga aylanadi. Bu yerda Obvious Implementation ham bo'lardi, lekin Triangulate testlarda ikkita misolni qoldiradi.

**3-sikl:** 7 kunlik test (`1_890_000`). Eng oson yo'l - `if (quote.days === 7)`. Lekin bu Martin ogohlantirgan holat: kod testni "yodlaydi" va 8 kunlik testdan o'tmaydi. To'g'ri qadam - umumiy qoida: `days >= 7`. Chegarani darhol test ro'yxatidagi "6 kun" testi bilan qo'riqlaymiz.

**4-sikl:** 30 kun. Kodda ikkinchi `if` paydo bo'ladi. Endi refactor bosqichi keldi, chunki chegirma qoidalari ma'lumotga o'xshab qoldi:

```ts run
export type RentalQuote = { dailyRate: number; days: number };

const LONG_RENTAL_DISCOUNTS = [
  { fromDays: 30, rate: 0.25 },
  { fromDays: 7, rate: 0.1 },
] as const;

export function rentalTotal(quote: RentalQuote): number {
  if (!Number.isInteger(quote.days) || quote.days < 1) {
    throw new RangeError(`Ijara kunlari musbat butun son bo'lishi kerak: ${quote.days}`);
  }
  const discount = LONG_RENTAL_DISCOUNTS.find((d) => quote.days >= d.fromDays)?.rate ?? 0;
  return Math.round(quote.dailyRate * quote.days * (1 - discount));
}

// Sinab ko'ring: kunlar sonini o'zgartiring, 0 yoki 2.5 kunda nima bo'lishini ko'ring.
for (const days of [1, 6, 7, 29, 30]) {
  console.log(`${days} kun -> ${rentalTotal({ dailyRate: 300_000, days })}`);
}
try { rentalTotal({ dailyRate: 300_000, days: 0 }); } catch (e) { console.log("Xato:", (e as Error).message); }
```

Va yakuniy testlar:

```ts
describe("rentalTotal", () => {
  it.each([
    { days: 1, total: 300_000 },
    { days: 3, total: 900_000 },
    { days: 6, total: 1_800_000 },
    { days: 7, total: 1_890_000 },
    { days: 29, total: 7_830_000 },
    { days: 30, total: 6_750_000 },
  ])("$days kun -> $total", ({ days, total }) => {
    expect(rentalTotal({ dailyRate: 300_000, days })).toBe(total);
  });

  it("0 kunlik ijarani rad etadi", () => {
    expect(() => rentalTotal({ dailyRate: 300_000, days: 0 })).toThrow(RangeError);
  });
});
```

Kuzatuvlar:

- **Refactor testlar yashil bo'lganda qilindi.** Ikki `if`dan jadvalga o'tish xatti-harakatni o'zgartirmadi, testlar buni kafolatladi.
- **Chegaralar test ro'yxatidan keldi.** 6 va 29 kun testlari kod yozilishidan oldin rejalashtirilgan edi, shuning uchun `>` va `>=` xatosi imkonsiz.
- **Talabdagi savol ochildi.** 30 kunlik ijara 29 kunlikdan arzon chiqdi (6 750 000 va 7 830 000). Bu xato emas, qoidaning natijasi, lekin biznes bundan xabardormi? TDD test ro'yxatini yozish paytida bunday savollarni erta ko'rsatadi.
- **Kod kichik va umumiy.** Har test uchun alohida tarmoq yo'q.

## Qachon qo'llamaslik kerak

- **Tadqiqot va spike.** Yangi kutubxona yoki API qanday ishlashini bilmasangiz, test yoza olmaysiz, chunki kutilgan natija noma'lum. Avval tashlab yuboriladigan tajriba kodi, keyin bilim bilan TDD. Beck ham spike'ni alohida faoliyat sifatida ko'radi.
- **UI tartibi va vizual dizayn.** Piksel joylashuvi, animatsiya, ranglar - bular uchun test-first deyarli foyda bermaydi. Xatti-harakat (forma validatsiyasi, holat o'zgarishi) esa TDD uchun yaxshi nomzod.
- **Juda yupqa qatlamlar.** Faqat DTO'ni repository'ga uzatuvchi controller uchun test-first unit test ko'pincha implementatsiyani takrorlaydi. Bu yerda integratsion test yaxshiroq (68-dars).
- **Mitti qadamlar dogmasi.** Har bir qatorni Fake It bilan boshlash tajribali dasturchi uchun sekin va zerikarli. Beckning o'zi Obvious Implementation'ni ko'p ishlatadi. Qadam o'lchamini vaziyatga moslang.
- **Jamoa TDD'ni bilmasa.** Majburlangan, tushunilmagan TDD ko'pincha implementatsiyaga bog'langan mock'li testlarni beradi. Bu haqda 65 va 66-darslarda.

## Stack'da: Vitest, Jest, NestJS

- **Watch rejimi.** `vitest` (standart holatda watch) yoki `jest --watch`. TDD sikli soniyalarda ishlashi uchun faqat o'zgargan fayllarga tegishli testlar qayta ishga tushsin.
- **`it.todo`.** Test ro'yxatini kod ichida saqlash uchun. Hisobotda ular alohida ko'rinadi va unutilmaydi.
- **Tiplar va red bosqichi.** TypeScript'da kompilyatsiya xatosi ham qizil holat. Avval tipni (`type RentalQuote`) testdan "chaqirib", keyin yaratish - Martinning ikkinchi qonuniga mos.
- **NestJS servislari.** Domen logikasini sof funksiya yoki oddiy klassga ajratib, ularni TDD bilan yozing. NestJS dekoratorlari, DI va DB ulanishini esa integratsion testlar bilan tekshiring (67 va 68-darslar).

## Xulosa

- TDD maqsadi - ishlaydigan toza kod. Testlar unga yetish vositasi.
- Red-green-refactor: avval yiqilgan test, keyin minimal kod, keyin testlar yashil holatda tozalash. Ikki savolni ajratish yukni kamaytiradi.
- Martin TDD'ni to'rt ichma-ich sikl deb biladi: uch qonun, red-green-refactor, specific/generic va arxitektura chegaralari.
- Beck patternlari: Test List diqqatni saqlaydi, Fake It va Triangulate qadamni kichraytiradi, Obvious Implementation ishonch yuqori bo'lganda ishlatiladi.
- Testlar spetsifik bo'lgan sari kod umumiy bo'lishi kerak. Har test uchun alohida `if` - kod juda spetsifik ekanining belgisi.
