---
n: 98
slug: ai-va-toza-kod
title: "AI yordamchilar bilan toza kod"
summary: "LLM yordamchilari kod yozish narxini keskin tushirdi, lekin kodni o'qish va o'zgartirish narxini emas. Bu darsda AI yozgan kodda tez-tez uchraydigan muammolarni (mavjud bo'lmagan API, takroriy yordamchilar, ortiqcha abstraksiya, unutilgan edge case'lar, implementatsiyani takrorlaydigan testlar) va ularni review qilish usulini ko'ramiz."
duration: 35
sources:
  - id: cc2
    note: "Ikkinchi nashrda AI va LLM'larga bag'ishlangan alohida bob bor (\"AIs, LLMs, and God Knows What\"). Bu darsda faqat shu fakt qayd etiladi, bob mazmuni keltirilmaydi"
  - id: google-code-review
    note: "What to look for: har bir qatorni tushunib ko'rib chiqish, over-engineering, testlar haqiqatan yiqilishi, kontekst. Small CLs tamoyili"
quiz:
  - q: "AI yordamchi `prisma.vehicle.findManyAndCount()` metodini ishlatgan kod yozdi. Kod IDE'da qizil emas, chunki fayl JavaScript. Bu qanday xato turi va uni qanday ushlash kerak?"
    options:
      - "Mavjud bo'lmagan (hallucinated) API: tip tekshiruvi, rasmiy hujjat va kodni haqiqatan ishga tushirish bilan ushlanadi"
      - "Performance muammosi"
      - "Uslub muammosi, linter tuzatadi"
      - "Prisma'ning yangi versiyasida bor, xato emas"
    answer: 0
    explain: "LLM'lar ishonarli ko'rinadigan, lekin mavjud bo'lmagan metod, flag yoki parametr nomlarini taklif qilishi mumkin. Eng arzon himoya - strict TypeScript, keyin hujjat va kodni haqiqatan bajarish. Ishonarli nom - mavjudlik dalili emas."
  - q: "AI yangi fayl ichida `formatUzs(amount)` yordamchisini yozdi. Loyihada `src/shared/money.ts` da `formatMoney(amount, 'UZS')` allaqachon bor. Review'da nima qilish kerak?"
    options:
      - "Ikkala funksiyani ham qoldirish, chunki ikkalasi ishlaydi"
      - "Mavjud yordamchini ishlatishni so'rash: takroriy yordamchi bir kun boshqacha xatti-harakatga ega bo'lib qoladi (masalan, yaxlitlash)"
      - "Eski funksiyani o'chirib, yangisini hamma joyda ishlatish"
      - "Bu muhim emas, Nit sifatida belgilash"
    answer: 1
    explain: "AI ko'pincha butun kod bazasini ko'rmaydi va mavjud yordamchini qayta yozadi. Bu bilim takrori (8-dars): ikki joyda bir xil qoida, va ular vaqt o'tishi bilan ajralib ketadi. Bu Nit emas, chunki u kelajakdagi xatoning manbai."
  - q: "AI'dan test yozishni so'radingiz. Natijada test `expect(calculateFine(speed)).toBe((speed - limit) * RATE)` ko'rinishida. Muammo nima?"
    options:
      - "Test juda qisqa"
      - "toBe o'rniga toEqual kerak"
      - "Muammo yo'q"
      - "Test implementatsiya formulasini takrorlaydi: formula xato bo'lsa, test ham xuddi shu xato bilan o'tadi. Aniq kutilgan qiymatlar va chegaraviy holatlar kerak"
    answer: 3
    explain: "Test kod qanday ishlashini emas, nima qaytarishi kerakligini tekshirishi kerak. Formulani testda qayta hisoblash kod bilan birga xato qiladi. Google qo'llanmasi so'ragandek: kod buzilsa, test haqiqatan yiqiladimi?"
  - q: "Oddiy talab: \"mashina 30 kundan ortiq GPS signal bermasa, offline deb belgilansin\". AI `VehicleStatusStrategy` interfeysi, `StrategyFactory`, uchta strategiya klassi va DI konfiguratsiyasini yozdi. Qanday baholaysiz?"
    options:
      - "Yaxshi, chunki kelajakda kengaytirish oson"
      - "Bu SOLID'ga mos, demak toza"
      - "Over-engineering: hozirgi talab bitta shart, spekulyativ umumiylik o'qish va o'zgartirish narxini oshiradi"
      - "Faqat factory ortiqcha, qolgani to'g'ri"
    answer: 2
    explain: "LLM'lar o'qitish ma'lumotlaridagi \"enterprise\" naqshlarni ko'p takrorlaydi. Google qo'llanmasi over-engineering'ni alohida ogohlantiradi: hozirgi muammoni hal qiling. Bitta sof funksiya va test yetarli (9 va 60-darslar)."
  - q: "Quyidagilardan qaysi biri AI yozgan kodni review qilishda eng foydali amaliyot?"
    options:
      - "Muallifdan (yoki o'zingizdan) har bir qatorni tushuntira olishni talab qilish va o'zgarishni kichik bo'laklarda qabul qilish"
      - "AI kodi uchun review'ni tezlashtirish, chunki u sintaksis xato qilmaydi"
      - "Faqat testlar o'tganini tekshirish"
      - "AI kodini alohida papkada saqlash"
    answer: 0
    explain: "Kodni kim yozganidan qat'i nazar, PR'ni ochgan odam uning muallifi va har bir qatorni tushunishi kerak. AI katta hajmni arzon yaratadi, shuning uchun kichik o'zgarishlar tamoyili yanada muhim. Sintaksis xatosizlik mantiqiy to'g'rilikni anglatmaydi."
  - q: "Clean Code ikkinchi nashri (2025) haqida qaysi gap to'g'ri?"
    options:
      - "Unda AI ishlatmaslik tavsiya qilinadi"
      - "Unda AI va LLM'larga bag'ishlangan alohida bob bor"
      - "U butunlay AI haqida"
      - "Unda AI umuman tilga olinmaydi"
    answer: 1
    explain: "Ikkinchi nashr mundarijasida \"AIs, LLMs, and God Knows What\" nomli bob bor. Bu darsda biz uning mazmunini qayta aytmaymiz, faqat mavzu kitobga kiritilganini qayd etamiz."
task:
  title: "AI yozgan servisni review qilish va tuzatish"
  prompt: |
    Siz AI yordamchidan so'radingiz: "Haydovchilarning haftalik reytingini hisoblaydigan NestJS servis yoz: keskin tormozlash va tezlik oshirish hodisalari uchun ball ayiriladi". Quyidagi kod va test qaytdi.

    1. Kamida 5 ta muammoni toping va har birini turkumlang: hallucinated API, takroriy yordamchi, ortiqcha abstraksiya, unutilgan edge case, implementatsiyani takrorlaydigan test yoki boshqa.
    2. Kodni tuzating. Loyihada `src/shared/dates.ts` da `startOfIsoWeek(date: Date): Date` mavjud deb hisoblang.
    3. Implementatsiyani takrorlamaydigan test yozing.
  lang: ts
  starter: |
    import { Injectable } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";

    export interface IScoreCalculator { calculate(events: DrivingEvent[]): number; }
    export abstract class BaseScoreCalculator implements IScoreCalculator {
      abstract calculate(events: DrivingEvent[]): number;
    }
    export class DefaultScoreCalculator extends BaseScoreCalculator {
      calculate(events: DrivingEvent[]): number {
        const penalty = events.reduce((s, e) => s + (e.type === "harsh_brake" ? 5 : 3), 0);
        return 100 - penalty;
      }
    }
    export class ScoreCalculatorFactory {
      static create(): IScoreCalculator { return new DefaultScoreCalculator(); }
    }

    type DrivingEvent = { driverId: string; type: "harsh_brake" | "overspeed"; at: Date };

    function getWeekStart(d: Date): Date {
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    }

    @Injectable()
    export class DriverScoreService {
      constructor(private readonly prisma: PrismaService) {}

      async weeklyScore(driverId: string, now = new Date()): Promise<number> {
        const from = getWeekStart(now);
        const events = await this.prisma.drivingEvent.findMany({
          where: { driverId, at: { gte: from } },
          cacheStrategy: { ttl: 60 },
        });
        return ScoreCalculatorFactory.create().calculate(events);
      }
    }

    // driver-score.service.spec.ts
    // it("calculates score", () => {
    //   const events = [{ type: "harsh_brake" }, { type: "overspeed" }];
    //   const expected = 100 - events.reduce((s, e) => s + (e.type === "harsh_brake" ? 5 : 3), 0);
    //   expect(new DefaultScoreCalculator().calculate(events as any)).toBe(expected);
    // });
  solution: |
    // Topilgan muammolar:
    // 1. Hallucinated / noto'g'ri API: `cacheStrategy` - bu Prisma Accelerate kengaytmasining opsiyasi,
    //    oddiy PrismaClient'da yo'q. Loyihada Accelerate ishlatilmasa, tip xatosi yoki jim e'tiborsizlik.
    // 2. Takroriy yordamchi: `getWeekStart` loyihadagi `startOfIsoWeek` ni qayta yozadi. Bundan tashqari
    //    u `d.setDate` bilan kirish argumentini mutatsiya qiladi (`now` o'zgaradi) va soatni 00:00 ga
    //    tushirmaydi: hafta boshidagi ertalabki hodisalar yo'qoladi.
    // 3. Ortiqcha abstraksiya: interfeys, abstract klass, factory - bitta formula uchun. Ikkinchi
    //    strategiya talab qilinmagan.
    // 4. Unutilgan edge case: ko'p hodisada ball manfiy bo'ladi (100 - 120 = -20). Talabda reyting
    //    0..100 oralig'ida bo'lishi kutiladi. Hafta oxiri chegarasi (`lt`) ham yo'q: o'tmishdagi `now`
    //    bilan chaqirilsa, keyingi haftalar qo'shiladi.
    // 5. Implementatsiyani takrorlaydigan test: kutilgan qiymat aynan shu formula bilan hisoblanadi
    //    va `as any` tipni yashiradi.
    // 6. Magic number'lar: 5, 3, 100 nomlanmagan.

    import { Injectable } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";
    import { startOfIsoWeek } from "../shared/dates";

    export type DrivingEventType = "harsh_brake" | "overspeed";

    const MAX_SCORE = 100;
    const PENALTY: Record<DrivingEventType, number> = { harsh_brake: 5, overspeed: 3 };
    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

    export function scoreFromEvents(eventTypes: readonly DrivingEventType[]): number {
      const penalty = eventTypes.reduce((sum, type) => sum + PENALTY[type], 0);
      return Math.max(MAX_SCORE - penalty, 0);
    }

    @Injectable()
    export class DriverScoreService {
      constructor(private readonly prisma: PrismaService) {}

      async weeklyScore(driverId: string, now: Date = new Date()): Promise<number> {
        const from = startOfIsoWeek(now);
        const to = new Date(from.getTime() + WEEK_MS);
        const events = await this.prisma.drivingEvent.findMany({
          where: { driverId, at: { gte: from, lt: to } },
          select: { type: true },
        });
        return scoreFromEvents(events.map((e) => e.type));
      }
    }

    // driver-score.spec.ts
    import { describe, expect, it } from "vitest";
    import { scoreFromEvents } from "./driver-score.service";

    describe("scoreFromEvents", () => {
      it("hodisasiz haydovchi 100 ball oladi", () => {
        expect(scoreFromEvents([])).toBe(100);
      });

      it("keskin tormozlash 5, tezlik oshirish 3 ball ayiradi", () => {
        expect(scoreFromEvents(["harsh_brake", "overspeed"])).toBe(92);
      });

      it("ball 0 dan pastga tushmaydi", () => {
        const manyBrakes = Array.from({ length: 30 }, () => "harsh_brake" as const);
        expect(scoreFromEvents(manyBrakes)).toBe(0);
      });
    });
  solutionNotes: |
    - `cacheStrategy` misoli ataylab tanlangan: bu haqiqiy opsiya, lekin boshqa kontekstda (Accelerate). LLM'lar ko'pincha "deyarli to'g'ri" API beradi, va bu butunlay o'ylab topilgan nomdan xavfliroq, chunki ishonarli ko'rinadi. Rasmiy hujjat va strict tip tekshiruvi yagona ishonchli himoya.
    - `getWeekStart` da ikkita yashirin xato bor edi (argument mutatsiyasi, soat tozalanmagani). Mavjud, test qilingan yordamchini ishlatish ikkalasini ham yo'qotadi. Takroriy kod nafaqat DRY masalasi, balki tekshirilmagan kod masalasi.
    - Hisob-kitob sof funksiyaga ajratildi va bazasiz test qilinadi (67-dars). Strategy kerak bo'lsa (masalan, kompaniyalar o'z jarimalarini sozlasa), u talab paydo bo'lganda qo'shiladi.
    - Testlar aniq raqamlarni kutadi (100, 92, 0) va chegaraviy holatni qamraydi. Formula o'zgarsa yoki xato bo'lsa, test yiqiladi.
    - Kirish tipi faqat `DrivingEventType[]`: funksiya haqiqatan nimaga muhtojligini ko'rsatadi va testda `as any` kerak emas.
  checklist:
    - "Kamida 5 ta muammo topildi va har biri turkumlangan"
    - "Mavjud bo'lmagan yoki kontekstga mos kelmaydigan API olib tashlangan"
    - "Takroriy sana yordamchisi o'rniga loyihadagi mavjud funksiya ishlatilgan"
    - "Interfeys, abstract klass va factory olib tashlangan, hisob sof funksiyada"
    - "Ball 0..100 oralig'ida va hafta ikki tomondan chegaralangan"
    - "Testlar aniq kutilgan qiymatlar bilan yozilgan va formulani takrorlamaydi"
---

## Muammo

Kod yozish narxi bir necha yil ichida keskin tushdi. Bir paragraf tavsifdan AI yordamchi bir necha soniyada 200 qatorli servis, testlar va DTO'lar bilan qaytaradi. Kod ko'pincha kompilyatsiya bo'ladi, nomlar ma'noli, formatlash toza. Tashqaridan bu toza kodga o'xshaydi.

Lekin 1-darsdagi ta'rifni eslang: toza kod - boshqa odam qanchalik tez va xavfsiz o'zgartira oladigan kod. AI yozish narxini tushirdi, lekin **o'qish va o'zgartirish narxini emas**. Aksincha, yozish arzonlashgan sari kod hajmi oshadi, va har bir qator kimdir tomonidan o'qilishi, tushunilishi va saqlanishi kerak. Agar 200 qatorli servis 40 qatorda yozilishi mumkin bo'lsa, qolgan 160 qator - yangi texnik qarz, garchi uni hech kim qo'lda yozmagan bo'lsa ham.

Bundan tashqari, AI xatolari inson xatolaridan boshqacha ko'rinadi. Charchagan dasturchi odatda sezilarli xato qiladi: unutilgan `await`, noto'g'ri o'zgaruvchi. AI esa ishonarli xato qiladi: chiroyli nomlangan, hujjatlashtirilgan, lekin mavjud bo'lmagan metod. Ishonarlilik review'ni bo'shashtiradi.

Robert Martin *Clean Code* ning 2025 yilgi ikkinchi nashriga AI va LLM'larga bag'ishlangan alohida bob qo'shgan. Bu mavzu endi toza kod suhbatining bir qismi ekanining belgisi. Bu darsda biz o'sha bob mazmunini qayta aytmaymiz, balki amaliy savolga javob beramiz: AI yozgan kodni qanday review qilish kerak?

## Asosiy g'oya

Bitta tamoyil va undan kelib chiqadigan amaliyot:

**Kodni kim yozganidan qat'i nazar, PR'ni ochgan odam uning muallifi.** U har bir qatorni tushunishi, tushuntira olishi va unga javob berishi kerak. "AI shunday yozdi" - bu tushuntirish emas, xuddi "Stack Overflow'dan ko'chirdim" tushuntirish bo'lmagani kabi.

Google'ning code review qo'llanmasi buni AI'dan oldin ham aytgan: har bir qatorni tushunib ko'rib chiqing, tushunmasangiz so'rang (96-dars). AI bu talabni yumshatmaydi, aksincha kuchaytiradi, chunki endi PR'dagi kodni muallifning o'zi ham birinchi marta o'qiyotgan bo'lishi mumkin.

Amalda bu shuni bildiradi: AI'ni tez yozuvchi hamkasb deb emas, **tez yozadigan, lekin loyihani ko'rmagan va ba'zan ishonch bilan adashadigan stajyor** deb ko'ring. Uning ishi foydali, lekin har doim review qilinadi.

## Chuqurroq: AI kodidagi beshta tipik muammo

Quyidagi ro'yxat amaliy kuzatuvlarga asoslangan va har bir vosita va model bilan farq qiladi. Bu statistik tadqiqot emas, review uchun checklist.

### 1. Mavjud bo'lmagan yoki noto'g'ri kontekstdagi API

LLM'lar keyingi ehtimoliy tokenni bashorat qiladi, ular kutubxona hujjatini real vaqtda tekshirmaydi (agar vosita buni alohida qilmasa). Natijada ishonarli ko'rinadigan, lekin mavjud bo'lmagan metodlar, opsiyalar va flaglar paydo bo'ladi. Undan ham ko'p uchraydigani - **deyarli to'g'ri** API: kutubxonaning eski versiyasidagi metod, boshqa kengaytmaning opsiyasi, boshqa freymvorkning nomi. Masalan, Next.js'ning Pages Router API'sini App Router'da ishlatish, yoki NestJS'ning eski versiyasidagi import yo'li.

Himoya: strict TypeScript (91-dars) - eng arzon filtr. Tip tekshiruvidan o'tmagan metod darhol ko'rinadi. Keyin rasmiy hujjat: har bir notanish API uchun bir daqiqa. Va kodni haqiqatan ishga tushirish: testlar va lokal chaqiruv.

### 2. Takroriy yordamchilar

AI odatda kod bazasining kichik qismini ko'radi. Natijada u loyihada allaqachon mavjud bo'lgan narsani qayta yozadi: sana formatlash, pul formatlash, telefon raqamini normalizatsiya qilish, retry logikasi. Har bir nusxa o'z xatolariga ega va vaqt o'tishi bilan ular ajralib ketadi: bitta joyda yaxlitlash `Math.round`, boshqasida `Math.floor`.

Bu 8-darsdagi DRY ning asl ma'nosi: bilim takrori. Review'da yangi yordamchi funksiya ko'rsangiz, birinchi savol: "Loyihada bu allaqachon bormi?" Bu savolni tez berish uchun umumiy yordamchilar aniq joyda bo'lishi kerak (`src/shared/`), va AI vositasiga ularni kontekst sifatida berish foydali.

### 3. Ortiqcha abstraksiya

O'qitish ma'lumotlarida "enterprise" naqshlar ko'p: interfeys, abstract klass, factory, strategy, repository, mapper. AI oddiy talabga ham ularni qo'llashga moyil, ayniqsa so'rov "yaxshi arxitektura bilan" yoki "SOLID'ga mos" degan so'zlarni o'z ichiga olsa. Natija SOLID'ga o'xshaydi, lekin 75-darsdagi speculative generality: hozir kerak bo'lmagan kengaytirish nuqtalari.

Google qo'llanmasi over-engineering'ni alohida ogohlantiradi: hozirgi muammoni hal qiling, taxminiy kelajakdagisini emas. Review savoli: "Bu abstraksiyaning ikkinchi implementatsiyasi hozir bormi?" Yo'q bo'lsa, uni olib tashlashni so'rang (9, 60, 90-darslar).

### 4. Unutilgan edge case'lar

AI "baxtli yo'l"ni yaxshi yozadi. Chegaraviy holatlar esa ko'pincha tushib qoladi: bo'sh massiv, nol bilan bo'lish, manfiy natija, vaqt zonasi, hafta boshi yakshanba yoki dushanba, sana o'zgaruvchisining mutatsiyasi, parallel so'rovlar. Bu kamchiliklar kodni o'qiganda ko'rinmaydi, chunki yo'q narsa ko'rinmaydi.

Himoya: review'da "nima bo'lsa buziladi?" degan savolni ochiq bering. Domen bilimi bu yerda hal qiluvchi: transport parki uchun "tracker o'chiq", "GPS sakrashi", "tungi smena hafta chegarasidan o'tadi" kabi holatlarni faqat domenni biladigan odam so'raydi.

### 5. Implementatsiyani takrorlaydigan testlar

AI'dan mavjud kodga test yozishni so'rasangiz, u ko'pincha kodni "tasvirlaydigan" test yozadi: kutilgan qiymatni xuddi shu formula bilan hisoblaydi, yoki har bir ichki chaqiruvni mock qilib, ular chaqirilganini tekshiradi. Bunday test kod bilan birga xato qiladi va refaktoringda sinadi (66, 69-darslar).

Google qo'llanmasining test haqidagi savoli bu yerda aniq ishlaydi: kod buzilsa, test haqiqatan yiqiladimi? Tez tekshirish: kodda bitta raqamni o'zgartiring va test yiqilishini ko'ring. Yaxshiroq: testning kutilgan qiymatlarini o'zingiz, talabdan yozing, AI'ga faqat struktura va boilerplate'ni qoldiring. Mutation testing (70-dars) bu muammoni avtomatik ushlaydi.

## Misol: AI kodini review qilish

So'rov: "Ijara narxini hisoblash funksiyasini yoz, 7 kundan ortiq uchun 10% chegirma". Natija:

```ts
export class RentalPriceCalculator {
  private static readonly DISCOUNT_THRESHOLD = 7;
  private static readonly DISCOUNT_RATE = 0.1;

  /**
   * Calculates the rental price.
   * @param startDate - The start date
   * @param endDate - The end date
   * @param dailyRate - The daily rate
   * @returns The calculated price
   */
  public static calculate(startDate: Date, endDate: Date, dailyRate: number): number {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const basePrice = days * dailyRate;
    if (days > RentalPriceCalculator.DISCOUNT_THRESHOLD) {
      return basePrice * (1 - RentalPriceCalculator.DISCOUNT_RATE);
    }
    return basePrice;
  }
}
```

Tashqaridan toza: konstantalar nomlangan, TSDoc bor. Review savollari:

- **Edge case.** `endDate < startDate` bo'lsa, manfiy narx. Bir xil sana bo'lsa, 0 kun va 0 narx. Talabda minimal 1 kun bormi?
- **Talab talqini.** "7 kundan ortiq" - 7 kun kiradimi? Kod `>` ishlatgan, ya'ni 8 kundan. Bu biznesdan so'raladigan savol, AI uni jimgina hal qilgan.
- **Vaqt zonasi.** Millisekundlar bo'yicha bo'lish yozgi vaqtga o'tish kuni 23 yoki 25 soatlik kunda noto'g'ri natija berishi mumkin (O'zbekistonda hozir yozgi vaqt yo'q, lekin mijoz boshqa davlatda bo'lsa bor).
- **Shakl.** Faqat statik metodli klass - modul funksiyasi bo'lishi mumkin. TSDoc parametr nomlarini takrorlaydi va hech narsa qo'shmaydi (33-dars).
- **Pul.** Natija kasr son: so'mda tiyin bormi? Yaxlitlash qoidasi qayerda?

Tuzatilgan variant:

```ts run
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LONG_RENTAL_MIN_DAYS = 7; // biznes bilan tasdiqlandi: 7 kun ham kiradi
const LONG_RENTAL_DISCOUNT = 0.1;

export class InvalidRentalPeriodError extends Error {}

export function rentalDays(start: Date, end: Date): number {
  const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  const days = (utcEnd - utcStart) / MS_PER_DAY;
  if (days < 1) throw new InvalidRentalPeriodError("Ijara kamida 1 kun bo'lishi kerak");
  return days;
}

export function rentalPriceUzs(start: Date, end: Date, dailyRateUzs: number): number {
  const days = rentalDays(start, end);
  const discount = days >= LONG_RENTAL_MIN_DAYS ? LONG_RENTAL_DISCOUNT : 0;
  return Math.round(days * dailyRateUzs * (1 - discount));
}

// Sinab ko'ring: sanalar yoki kunlik narxni o'zgartiring.
console.log("6 kun:", rentalPriceUzs(new Date(2026, 9, 1), new Date(2026, 9, 7), 400_000));
console.log("7 kun:", rentalPriceUzs(new Date(2026, 9, 1), new Date(2026, 9, 8), 400_000));
try {
  rentalPriceUzs(new Date(2026, 9, 5), new Date(2026, 9, 5), 400_000);
} catch (e) {
  console.log(e instanceof InvalidRentalPeriodError, (e as Error).message);
}
```

Har bir o'zgarish review savolidan kelib chiqdi va eng muhimi - ikkitasi (7 kun kiradimi, minimal muddat) kod emas, biznes savoli edi. AI ularni "hal qilgan" edi, lekin noto'g'ri yoki tekshirilmagan holda.

## Qachon qo'llamaslik kerak

Bu yerda "qo'llamaslik" ikki ma'noda: AI'ni qachon ishlatmaslik va qattiq review'ni qachon yumshatish mumkin.

- **Siz tushunmaydigan sohada AI kodini qabul qilmang.** Kriptografiya, autentifikatsiya, to'lovlar, concurrency. Agar kod to'g'riligini o'zingiz baholay olmasangiz, uni AI yozgani xavfni oshiradi, kamaytirmaydi. Bunday joyda malakali reviewer kerak (Google qo'llanmasi ham shuni aytadi).
- **Katta "bir martada" generatsiya.** 2000 qatorli generatsiya qilingan PR'ni hech kim chuqur review qila olmaydi. AI'ni kichik, alohida qadamlarda ishlating va har birini alohida qabul qiling (Small CLs).
- **Bir martalik skriptlar va prototiplar.** Ma'lumotni bir marta ko'chiradigan skript yoki g'oyani tekshirish uchun prototip uchun to'liq review ortiqcha bo'lishi mumkin. Lekin 1-darsdagi ogohlantirish shu yerda ham ishlaydi: "vaqtinchalik" kod production'ga o'tib qoladi.
- **Boilerplate va mexanik o'zgarishlar.** DTO'larni sxemadan yaratish, test fixture'lari, nomlarni ommaviy o'zgartirish - bu AI kuchli bo'lgan va xavf past bo'lgan joy. Bu yerda review tez bo'lishi mumkin, lekin baribir bo'lishi kerak.
- **AI'ga qarshi dogma.** "AI kodi har doim yomon" degan pozitsiya ham xato. Yaxshi kontekst va aniq talab bilan AI ko'pincha toza, sodda kod beradi. Mezon bir xil: kodni kim yozganidan qat'i nazar, u o'qilishi va o'zgartirilishi oson bo'lishi kerak.

## Stack'da: AI bilan ishlash amaliyoti

- **Kontekst bering.** Loyihaning konvensiyalari (`src/shared/` yordamchilari, xato klasslari, DTO uslubi) bitta hujjatda bo'lsin va AI vositasiga berilsin. Ko'p vositalar repo darajasidagi ko'rsatma fayllarini qo'llab-quvvatlaydi. Bu takroriy yordamchilar va uslubdagi tafovutni kamaytiradi.
- **Strict tiplar va lint.** `strict`, `noUncheckedIndexedAccess`, typescript-eslint'ning `no-unsafe-*` qoidalari va `no-floating-promises` AI xatolarining katta qismini mexanik ushlaydi (37, 91-darslar).
- **Testni avval yozing.** Talabdan kutilgan qiymatlarni o'zingiz yozing, keyin AI'dan implementatsiyani so'rang. Bu TDD'ning (64-dars) AI bilan ishlashdagi tabiiy shakli va implementatsiyani takrorlaydigan testlar muammosini yo'qotadi.
- **Review checklist'ga qo'shing.** "Notanish API hujjat bilan tekshirildimi?", "Yangi yordamchi loyihada allaqachon bormi?", "Har bir abstraksiyaning ikkinchi implementatsiyasi bormi?", "Chegaraviy holatlar testlanganmi?", "Testdagi kutilgan qiymatlar formuladan emas, talabdan olinganmi?"
- **PR tavsifida ochiqlik.** Ko'p jamoalar PR'da AI ishlatilgan qismlarni belgilashni so'raydi. Bu ayblov emas, reviewer'ga qayerga ko'proq e'tibor berishni aytadigan signal.

## Xulosa

- AI yozish narxini tushirdi, lekin o'qish va o'zgartirish narxini emas: ortiqcha generatsiya qilingan kod ham texnik qarz.
- PR'ni ochgan odam kodning muallifi va har bir qatorni tushunishi kerak, kim yozganidan qat'i nazar.
- Beshta tipik muammo: mavjud bo'lmagan yoki noto'g'ri kontekstdagi API, takroriy yordamchilar, ortiqcha abstraksiya, unutilgan edge case'lar, implementatsiyani takrorlaydigan testlar.
- Eng arzon himoyalar: strict TypeScript, rasmiy hujjat, kichik o'zgarishlar, talabdan yozilgan testlar.
- Clean Code ikkinchi nashrida AI va LLM'larga bag'ishlangan bob bor: mavzu endi toza kod amaliyotining bir qismi.
