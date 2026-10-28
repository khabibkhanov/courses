---
n: 71
slug: refaktoring-nima
title: "Refaktoring nima va qachon qilinadi"
summary: "Refaktoring - kuzatiladigan xatti-harakatni o'zgartirmasdan, kichik va xavfsiz qadamlar bilan kod tuzilishini yaxshilash. Bu darsda Fowler ta'rifini, \"ikki shlyapa\" qoidasini va refaktoringning ish oqimiga qo'shiladigan oltita usulini ko'ramiz."
duration: 35
sources:
  - id: refactoring
    note: "2-bob \"Principles in Refactoring\": ta'rif, ikki shlyapa, qachon refaktoring qilish va qilmaslik, Rule of Three, performance haqidagi bo'lim"
  - id: fowler-workflows-refactoring
    note: "TDD, litter-pickup, comprehension, preparatory, planned va long-term refactoring ish oqimlari"
quiz:
  - q: "Jamoa \"refaktoring\" deb nomlangan PR ochdi. Unda servis ichki tuzilishi qayta yozilgan va bir vaqtda API javobidagi `total` maydoni yaxlitlanadigan bo'lgan. Fowler ta'rifi bo'yicha bu nima?"
    options:
      - "Refaktoring, chunki kod tuzilishi yaxshilangan"
      - "Refaktoring, chunki o'zgarish kichik"
      - "Refaktoring va xatti-harakat o'zgarishi aralashgan, ularni alohida qadamlarga ajratish kerak"
      - "Restructuring emas, chunki testlar o'tadi"
    answer: 2
    explain: "Fowler ta'rifida asosiy shart - kuzatiladigan xatti-harakat o'zgarmasligi. `total` yaxlitlanishi tashqi xatti-harakatni o'zgartiradi, demak bu yangi funksionallik. Ikki shlyapa qoidasi ularni alohida qadamlarda qilishni talab qiladi: avval tuzilma, keyin xatti-harakat."
  - q: "Preparatory refactoring qaysi vaziyatga mos keladi?"
    options:
      - "Yangi talabni qo'shish kerak, lekin mavjud tuzilma unga mos emas: avval kodni talab oson tushadigan shaklga keltirasiz"
      - "Sprint oxirida bo'sh vaqt qolganda eski modulni tozalash"
      - "Kodni o'qib tushunganingizdan keyin nomlarni aniqlashtirish"
      - "Bir necha oy davom etadigan framework almashtirish"
    answer: 0
    explain: "Preparatory refactoring yangi o'zgarishdan oldin keladi va aynan shu o'zgarishni osonlashtirish uchun qilinadi. Ikkinchi variant planned refactoring'ga, uchinchisi comprehension refactoring'ga, to'rtinchisi long-term refactoring'ga yaqin."
  - q: "Fowler maqolasiga ko'ra, agar jamoadagi refaktoringning deyarli hammasi alohida rejalashtirilgan \"refactoring story\"larda bo'lsa, bu nimani bildiradi?"
    options:
      - "Jamoa intizomli ishlayapti"
      - "Bu yaxshi belgi, chunki biznes refaktoringni ko'rib turadi"
      - "Refaktoring faqat shunday qilinishi kerak"
      - "Bu yomon belgi: refaktoring kundalik ish ichida yetarlicha qilinmayapti"
    answer: 3
    explain: "Fowler planned refactoring'ni zarur deb hisoblaydi, lekin uning ulushi katta bo'lishini smell deb ataydi. Refaktoringning asosiy qismi feature ishi bilan birga, opportunistik ravishda qilinishi kerak."
  - q: "Quyidagilardan qaysi biri refaktoring qilmaslik uchun eng asosli sabab?"
    options:
      - "Kodda testlar ko'p"
      - "Kod xunuk, lekin uni hech kim o'zgartirmaydi va uni API sifatida ishlatish yetarli"
      - "Refaktoring performance'ni har doim yomonlashtiradi"
      - "Refaktoring vaqtini menejer tasdiqlamagan"
    answer: 1
    explain: "Fowler ta'kidlashicha, xunuk kodni faqat API sifatida ishlatsangiz va ichini tushunishingiz shart bo'lmasa, uni refaktoring qilishdan foyda kam. Refaktoring investitsiya, u kelajakdagi tezlik bilan qaytishi kerak. Performance haqidagi da'vo noto'g'ri: Fowler avval aniq kod, keyin profiling asosida optimizatsiya tavsiya qiladi."
  - q: "Rule of Three nimani aytadi?"
    options:
      - "Har bir funksiya uchtadan ko'p parametr olmasin"
      - "Refaktoring uch bosqichda qilinadi: expand, migrate, contract"
      - "Birinchi marta shunchaki yozasiz, ikkinchisida takrorga chidaysiz, uchinchisida refaktoring qilasiz"
      - "Har bir PR uchta refaktoring qadamidan oshmasin"
    answer: 2
    explain: "Fowler Don Robertsga nisbat beradigan bu qoida takrorni darhol emas, naqsh aniq bo'lganda olib tashlashni tavsiya qiladi. Expand/migrate/contract esa parallel change (80-dars)."
  - q: "Refaktoring paytida test qizarib ketdi. Ikki shlyapa qoidasi bo'yicha nima qilish kerak?"
    options:
      - "Testni yangi xatti-harakatga moslab o'zgartirish"
      - "Oxirgi kichik qadamni bekor qilib, yashil holatga qaytish va kichikroq qadam bilan qayta urinish"
      - "Refaktoringni davom ettirib, oxirida testlarni tuzatish"
      - "Testni vaqtincha o'chirib qo'yish"
    answer: 1
    explain: "Refaktoring shlyapasida testlar doim yashil bo'lishi kerak. Qizil test qadam xatti-harakatni o'zgartirganini bildiradi. Eng arzon yo'l - oxirgi qadamni bekor qilish (git checkout) va kichikroq qadam qo'yish."
task:
  title: "Feature va refaktoringni ikki qadamga ajratish"
  prompt: |
    Quyidagi servisga yangi talab keldi: **elektromobillar uchun yoqilg'i sarfi o'rniga energiya sarfi (kWh/100 km) hisoblansin**.

    Hozirgi kodga talabni to'g'ridan-to'g'ri qo'shish yana bitta `if` va yana bitta takror hisob degani.

    1. Avval faqat preparatory refactoring qiling: xatti-harakatni o'zgartirmasdan kodni yangi talab oson tushadigan shaklga keltiring. Bu qadamni alohida commit deb hisoblang.
    2. Keyin ikkinchi commit sifatida yangi talabni qo'shing.
    3. Har ikki commit uchun commit xabarini yozing va qaysi biri xatti-harakatni o'zgartirishini belgilang.
  lang: ts
  starter: |
    type Trip = {
      vehicleId: string;
      distanceKm: number;
      fuelUsedLiters: number;
    };

    export function buildConsumptionReport(trips: Trip[]): string[] {
      const lines: string[] = [];
      const byVehicle: Record<string, { km: number; liters: number }> = {};
      for (const t of trips) {
        if (!byVehicle[t.vehicleId]) byVehicle[t.vehicleId] = { km: 0, liters: 0 };
        byVehicle[t.vehicleId].km += t.distanceKm;
        byVehicle[t.vehicleId].liters += t.fuelUsedLiters;
      }
      for (const id of Object.keys(byVehicle)) {
        const v = byVehicle[id];
        if (v.km === 0) {
          lines.push(id + ": ma'lumot yo'q");
          continue;
        }
        const per100 = Math.round((v.liters / v.km) * 100 * 10) / 10;
        lines.push(id + ": " + per100 + " l/100km");
      }
      return lines;
    }
  solution: |
    // Commit 1 (refactor, xatti-harakat o'zgarmaydi):
    // agregatsiya va formatlash ajratildi, sarf birligi bitta joyda.

    type Trip = {
      vehicleId: string;
      distanceKm: number;
      fuelUsedLiters: number;
      energyUsedKwh?: number;
    };

    type Powertrain = "fuel" | "electric";

    type VehicleTotals = {
      vehicleId: string;
      distanceKm: number;
      consumed: number;
      powertrain: Powertrain;
    };

    const UNIT_LABEL: Record<Powertrain, string> = {
      fuel: "l/100km",
      electric: "kWh/100km",
    };

    function powertrainOf(trip: Trip): Powertrain {
      return trip.energyUsedKwh !== undefined ? "electric" : "fuel";
    }

    function consumedBy(trip: Trip): number {
      return trip.energyUsedKwh ?? trip.fuelUsedLiters;
    }

    function totalsByVehicle(trips: Trip[]): VehicleTotals[] {
      const totals = new Map<string, VehicleTotals>();
      for (const trip of trips) {
        const current = totals.get(trip.vehicleId) ?? {
          vehicleId: trip.vehicleId,
          distanceKm: 0,
          consumed: 0,
          powertrain: powertrainOf(trip),
        };
        current.distanceKm += trip.distanceKm;
        current.consumed += consumedBy(trip);
        totals.set(trip.vehicleId, current);
      }
      return [...totals.values()];
    }

    function per100Km(totals: VehicleTotals): number {
      return Math.round((totals.consumed / totals.distanceKm) * 100 * 10) / 10;
    }

    function formatLine(totals: VehicleTotals): string {
      if (totals.distanceKm === 0) return `${totals.vehicleId}: ma'lumot yo'q`;
      return `${totals.vehicleId}: ${per100Km(totals)} ${UNIT_LABEL[totals.powertrain]}`;
    }

    export function buildConsumptionReport(trips: Trip[]): string[] {
      return totalsByVehicle(trips).map(formatLine);
    }
  solutionNotes: |
    - Birinchi commit (`refactor: split aggregation and formatting in consumption report`) faqat tuzilmani o'zgartiradi. Unda `energyUsedKwh` hali yo'q, `UNIT_LABEL` faqat `fuel` bilan ishlaydi va eski testlar bir xil natija beradi.
    - Ikkinchi commit (`feat: report kWh/100km for electric vehicles`) `energyUsedKwh` maydonini, `Powertrain` tipini va `UNIT_LABEL.electric` ni qo'shadi. Diff kichik va review'da xatti-harakat o'zgarishi aniq ko'rinadi.
    - Yuqoridagi yechim ikkala commit'dan keyingi yakuniy holat. Muhimi - ular orasidagi chegara: refaktoring commit'ida hech qaysi test o'zgarmasligi kerak.
    - `Map` ishlatildi: `Object.keys` tartibi raqamli kalitlarda kutilmagan bo'lishi mumkin, `Map` esa qo'shilish tartibini saqlaydi. Bu ham xatti-harakatga ta'sir qilishi mumkin, shuning uchun refaktoringdan oldin raqamli `vehicleId` uchun characterization test yozish kerak (79-dars).
  checklist:
    - "Refaktoring va yangi talab ikki alohida commit'da"
    - "Refaktoring commit'ida hech qaysi test o'zgartirilmadi va hammasi yashil"
    - "Yangi talab bitta-ikki joyga tushdi, takror hisob paydo bo'lmadi"
    - "Commit xabarlari qaysi biri xatti-harakatni o'zgartirishini aniq aytadi"
    - "Masofa 0 bo'lgan holat ikkala versiyada ham bir xil ishlaydi"
---

## Muammo

"Refaktoring" so'zi ko'p jamoalarda noaniq ishlatiladi. Kimdir u bilan ikki haftalik qayta yozishni nazarda tutadi, kimdir framework almashtirishni, kimdir esa "bu sprintda feature qilmaymiz, kodni tozalaymiz" degan kelishuvni. Natijada bu so'z menejerlar uchun "biznesga qiymat bermaydigan, xatarli ish" degan ma'noni oladi va refaktoring alohida ruxsat talab qiladigan hodisaga aylanadi.

Ikkinchi muammo amaliy. Dasturchi "biroz tozalab qo'yay" deb boshlaydi, yo'l-yo'lakay bir xatoni tuzatadi, bitta maydonni qo'shadi va ikki kundan keyin 40 ta fayl o'zgargan, testlarning yarmi qizil holatda qoladi. Endi qaysi o'zgarish xatti-harakatni buzganini topish qiyin. PR review'da ham "bu yerda nima o'zgardi?" degan savolga hech kim aniq javob bera olmaydi.

Martin Fowler *Refactoring* kitobida bu ikkala muammoni bitta aniq ta'rif va bitta intizom bilan hal qiladi.

## Asosiy g'oya

Fowler refaktoringni ikki ma'noda ta'riflaydi. **Ot sifatida**: dasturning ichki tuzilishiga kiritilgan, uni tushunishni osonlashtiradigan va o'zgartirishni arzonlashtiradigan, lekin kuzatiladigan xatti-harakatini o'zgartirmaydigan o'zgarish. **Fe'l sifatida**: shunday o'zgarishlar ketma-ketligini qo'llab, kodni qayta tuzish.

Bu ta'rifning uchta muhim qismi bor:

1. **Kuzatiladigan xatti-harakat o'zgarmaydi.** Foydalanuvchi, API mijozi yoki boshqa modul farqni sezmasligi kerak. Ichki narsalar (call stack, ichki funksiyalar, ba'zan performance) o'zgarishi mumkin, lekin tashqi shartnoma emas.
2. **Kichik qadamlar.** Refaktoring - bu ko'p mayda, har biri xavfsiz transformatsiyalar. Har bir qadamdan keyin kod ishlaydi. Katta o'zgarish shu mayda qadamlar yig'indisidan paydo bo'ladi.
3. **Maqsad iqtisodiy.** Refaktoring "kod chiroyli bo'lsin" uchun emas, keyingi o'zgarishlarni arzonlashtirish uchun qilinadi.

Fowler bu yerda muhim farqni ko'rsatadi: "restructuring" (umumiy qayta tuzish) va "refactoring" bir xil narsa emas. Agar kimdir "refaktoring paytida kod bir necha kun ishlamay qoldi" desa, Fowler bo'yicha u refaktoring qilmagan. Refaktoringning butun qiymati shundaki, siz istalgan payt to'xtab, ishlaydigan kodga ega bo'lasiz.

### Ikki shlyapa

Fowler Kent Beckdan olingan metaforani ishlatadi: dasturchi ikki xil shlyapa kiyadi. **Funksionallik qo'shish shlyapasi**da siz yangi xatti-harakat yozasiz, yangi testlar qo'shasiz va testlar vaqtincha qizil bo'lishi tabiiy. **Refaktoring shlyapasi**da siz yangi xatti-harakat qo'shmaysiz, testlar qo'shmaysiz (faqat tushirib qoldirilgan holat topilsa), faqat tuzilmani o'zgartirasiz va testlar har doim yashil bo'ladi.

Shlyapalarni tez-tez almashtirish mumkin, hatto bir necha daqiqada. Lekin bir vaqtda faqat bittasini kiyish mumkin. Bu qoidaning amaliy natijasi: agar refaktoring paytida test qizarib ketsa, siz xatti-harakatni o'zgartirgansiz. Eng arzon javob - oxirgi qadamni bekor qilish va kichikroq qadam qo'yish.

## Chuqurroq: refaktoring qachon qilinadi

Fowler "Workflows of Refactoring" maqolasida va kitobning 2-bobida refaktoringni ish oqimiga qo'shishning bir necha usulini ajratadi. Ularning har biri boshqa signal bilan boshlanadi.

### TDD refactoring

Red-green-refactor siklining uchinchi qadami (64-dars). Testni eng oddiy kod bilan yashil qilgandan keyin, hali kontekst xotirada turganda, dizaynni tozalaysiz. Bu ikki ishni ajratish diqqatni boshqarishga yordam beradi: avval "ishlasin", keyin "yaxshi bo'lsin".

### Litter-pickup refactoring

Boshqa ish ustida ishlayotib, chalkash kodga duch kelasiz. Boy Scout qoidasining (6-dars) refaktoring shakli: kodni topganingizdan yaxshiroq holda qoldiring. Agar tuzatish oddiy bo'lsa yoki joriy vazifaga yordam bersa, darhol qilasiz. Agar katta bo'lsa, eslatma qilib, joriy vazifadan keyin qaytasiz. Muhim nuqta: joriy vazifani buzib, yarim yo'lda katta tozalashga kirishib ketmaslik.

### Comprehension refactoring

Signal boshqa: kod chalkash emas, lekin tushunarsiz. Siz uni o'qib, nima qilishini tushundingiz. Fowler bu g'oyani Ward Cunninghamga nisbat beradi: tushunganingizni boshingizda emas, kodning o'zida qoldiring. Funksiyani nomini aniqlashtirish, ifodani nomlangan o'zgaruvchiga chiqarish - keyingi o'quvchi shu ishni qayta qilmaydi.

### Preparatory refactoring

Muallifning bahosiga ko'ra, bu kundalik ishdagi eng foydali usullardan biri. Yangi talab keldi, lekin mavjud tuzilma unga mos emas. Talabni hozirgi shaklga majburan tiqish o'rniga, avval kodni talab oson tushadigan shaklga keltirasiz, keyin talabni qo'shasiz. Buni bo'yashga tayyorgarlikka o'xshatish mumkin: devorni tozalash va lenta yopishtirish bo'yashning o'zi emas, lekin bo'yashni tezlashtiradi va natijani uzoq saqlaydi. Kent Beckning mashhur iborasi ham shu g'oya haqida: avval o'zgarishni oson qiling, keyin oson o'zgarishni qiling.

### Planned refactoring

Ba'zan muammo shunchalik kattaki, kundalik ish ichida hal bo'lmaydi va jamoa uni alohida vazifa sifatida rejalashtiradi. Fowler buni zarur deb biladi, lekin ogohlantiradi: agar refaktoringning asosiy qismi shunday alohida vazifalarda bo'lsa, bu smell. Bu jamoa boshqa usullarni yetarlicha ishlatmayotganini bildiradi.

### Long-term refactoring

Persistence qatlamini almashtirish yoki katta modulning bog'liqliklarini yechish oylab davom etishi mumkin. Bunday holatda jamoa taxminiy maqsad holatini kelishib oladi va har kungi ish davomida unga qarab kichik refaktoringlar bilan yuradi. Har qadam refaktoring bo'lgani uchun tizim doim ishlaydi. Branch by abstraction (80-dars) bu yerda asosiy texnika.

### Rule of Three

Fowler Don Robertsga nisbat beradigan qoida: birinchi marta biror ishni shunchaki qilasiz. Ikkinchi marta o'xshash ishni qilganda takrordan biroz noqulay bo'lasiz, lekin baribir takrorlaysiz. Uchinchi marta - refaktoring qilasiz. Bu qoida noto'g'ri abstraksiyadan (8-dars) himoya qiladi: ikki misol naqshni ko'rsatish uchun ko'pincha yetarli emas.

### Refaktoring va performance

Ko'p dasturchilarni refaktoringdan to'xtatadigan qo'rquv: "kichik funksiyalar ko'payadi, kod sekinlashadi". Fowler bu masalaga aniq yondashadi. Refaktoring ba'zan dasturni biroz sekinlashtirishi mumkin, lekin u kodni performance tuning uchun ham qulayroq qiladi. Dasturlarning vaqti odatda kodning kichik qismida sarflanadi, shuning uchun hamma joyni oldindan optimallashtirish samarasiz. Tavsiya: avval aniq, yaxshi tuzilgan kod, keyin profiler bilan haqiqiy "issiq nuqta"larni topib, faqat ularni optimallashtirish (99-dars).

## Misol: aralash PR va uni ajratish

Transport parki tizimida haydovchi reytingi hisoblanadi. Yangi talab: tunda (22:00-06:00) keskin tormozlash uchun jarima ikki baravar bo'lsin.

Aralash yondashuv - talabni to'g'ridan-to'g'ri mavjud kodga tiqish:

```ts run
type DrivingEvent = {
  type: "harsh_brake" | "speeding" | "harsh_turn";
  occurredAt: Date;
  speedKmh: number;
};

export function driverScore(events: DrivingEvent[]): number {
  let score = 100;
  for (const e of events) {
    if (e.type === "harsh_brake") {
      const h = e.occurredAt.getHours();
      score -= h >= 22 || h < 6 ? 6 : 3;
    } else if (e.type === "speeding") {
      score -= e.speedKmh > 110 ? 5 : 2;
    } else if (e.type === "harsh_turn") {
      score -= 2;
    }
  }
  return Math.max(score, 0);
}

// Sinab ko'ring: hodisalarni qo'shing yoki vaqtini o'zgartiring (22:00-06:00 - tun).
const events: DrivingEvent[] = [
  { type: "harsh_brake", occurredAt: new Date(2026, 9, 1, 23, 15), speedKmh: 70 },
  { type: "harsh_brake", occurredAt: new Date(2026, 9, 1, 14, 0), speedKmh: 50 },
  { type: "speeding", occurredAt: new Date(2026, 9, 1, 15, 30), speedKmh: 124 },
  { type: "harsh_turn", occurredAt: new Date(2026, 9, 1, 16, 0), speedKmh: 40 },
];
console.log("Ball:", driverScore(events)); // 100 - 6 - 3 - 5 - 2 = 84
```

Ishlaydi, lekin keyingi talab ("tunda tezlikni oshirish ham ikki baravar") yana bitta takror tekshiruv qo'shadi. Review'da esa diff'ning qaysi qismi yangi xatti-harakat ekanini ko'rish oson emas.

Ikki shlyapa bilan: **birinchi commit - preparatory refactoring**. Har bir hodisa uchun jarima hisobini alohida funksiyaga chiqaramiz (Extract Function), xatti-harakat bir xil qoladi:

```ts
const BASE_PENALTY: Record<DrivingEvent["type"], (e: DrivingEvent) => number> = {
  harsh_brake: () => 3,
  speeding: (e) => (e.speedKmh > 110 ? 5 : 2),
  harsh_turn: () => 2,
};

function penaltyFor(event: DrivingEvent): number {
  return BASE_PENALTY[event.type](event);
}

export function driverScore(events: DrivingEvent[]): number {
  const total = events.reduce((sum, e) => sum + penaltyFor(e), 0);
  return Math.max(100 - total, 0);
}
```

Testlar o'zgarmaydi va yashil. **Ikkinchi commit - feature**. Endi talab bitta joyga tushadi:

```ts
const NIGHT_MULTIPLIER = 2;

function isNight(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 22 || hour < 6;
}

function penaltyFor(event: DrivingEvent): number {
  const base = BASE_PENALTY[event.type](event);
  return event.type === "harsh_brake" && isNight(event.occurredAt)
    ? base * NIGHT_MULTIPLIER
    : base;
}
```

Nima yutdik:

- Review qiluvchi birinchi commit'ni "testlar o'zgarmagan, demak xatti-harakat bir xil" deb tez o'tkazadi, ikkinchisida esa faqat biznes qoidasiga e'tibor beradi.
- Agar production'da reyting xato chiqsa, `git bisect` aniq qaysi commit sababchi ekanini ko'rsatadi.
- Keyingi talab ("tunda tezlik ham") `penaltyFor` ichida bitta shartni kengaytirish bilan hal bo'ladi.

E'tibor bering: `getHours()` server vaqt zonasiga bog'liq. Bu refaktoring natijasida paydo bo'lgan muammo emas, u asl kodda ham bor edi. Refaktoring shlyapasida uni tuzatmaymiz, chunki tuzatish xatti-harakatni o'zgartiradi. Uni alohida eslatma qilib, uchinchi commit sifatida (yangi test bilan) qilamiz.

## Qachon qo'llamaslik kerak

Fowler "qachon refaktoring qilmaslik kerak" degan savolga ham to'g'ridan-to'g'ri javob beradi va uning javoblari halol:

- **Kodni o'zgartirish shart bo'lmasa.** Xunuk kod bir burchakda yotsa va siz uni faqat API sifatida chaqirsangiz, uni tozalash investitsiyasi qaytmaydi. Refaktoringni kod bilan ishlash kerak bo'lgan joyda qiling.
- **Qayta yozish arzonroq bo'lsa.** Ba'zan kodni qayta yozish refaktoringdan osonroq. Fowler bu qaror oson emasligini va tajribaga bog'liqligini tan oladi. Lekin "noldan qayta yozamiz" degan qarorlarning ko'pi ortiqcha optimizm ekanini ham unutmang (80-dars).
- **Testlar yo'q va kod beqaror bo'lsa.** Maqolada aniq aytilgan: refaktoringni yashil testlarsiz qilish xavfli. Avval xavfsizlik to'rini quring (79-dars).
- **Hammasini birdaniga tuzatishga urinish.** Har bir o'tishda biroz yaxshilash, minglab kichik o'tishlar bilan, bitta katta "tozalash sprinti"dan yaxshi ishlaydi.
- **Uzoq yashaydigan branch'larda.** Fowler ogohlantiradi: refaktoring ko'p fayllarga tegadi, uzoq yashaydigan feature branch'lar bilan esa merge konfliktlari keskin oshadi. Refaktoring trunk-based ish va tez-tez integratsiya bilan eng yaxshi ishlaydi.
- **Published interface.** Agar funksiya tashqi mijozlar tomonidan ishlatilsa (npm paket, ochiq API), nomini o'zgartirish ularni buzadi. Bunday holatda parallel change (80-dars) kerak, oddiy Rename emas.

Yana bir halol eslatma: refaktoring qiymati iqtisodiy argument. Agar mahsulot ikki haftadan keyin yopilsa, preparatory refactoring ham o'zini oqlamasligi mumkin.

## Stack'da: TypeScript, NestJS, git

- **IDE refaktoringlari.** VS Code va WebStorm'dagi Rename Symbol, Extract Function, Move to new file TypeScript language service orqali ishlaydi va qo'lda qilishdan ancha xavfsiz. Lekin ular dinamik chaqiruvlarni (`service[methodName]()`, NestJS'dagi string token'lar) ko'rmaydi.
- **Commit intizomi.** Conventional Commits'dagi `refactor:` turi (39-dars) faqat xatti-harakat o'zgarmagan commit'lar uchun. Agar `refactor:` commit'ida test o'zgargan bo'lsa, bu ogohlantirish belgisi.
- **NestJS servislari.** Controller'dagi biznes mantiqni servisga ko'chirish (Move Function) refaktoring, lekin faqat HTTP javob (status kod, maydonlar, xato formati) bir xil qolsa. Bunday ko'chirishdan oldin e2e testlar bilan controller javobini qayd qiling.
- **Prisma va DB.** Ustun nomini o'zgartirish kod ichidagi Rename emas: u ma'lumotlar bazasi shartnomasini o'zgartiradi. Bu expand/contract bilan bosqichma-bosqich qilinadi (80 va 95-darslar).

## Xulosa

- Refaktoring - kuzatiladigan xatti-harakatni o'zgartirmasdan, kichik qadamlar bilan ichki tuzilmani yaxshilash. Kod bir necha kun ishlamay qolsa, bu refaktoring emas.
- Ikki shlyapa: bir vaqtda yo funksionallik qo'shasiz, yo refaktoring qilasiz. Refaktoring paytida testlar doim yashil.
- Refaktoringning asosiy qismi kundalik ish ichida bo'ladi: TDD, litter-pickup, comprehension va ayniqsa preparatory refactoring.
- Planned refactoring zarur, lekin uning ulushi katta bo'lsa, bu jamoa uchun smell.
- Refaktoring investitsiya: o'zgartirilmaydigan kodni tozalash, testsiz katta o'zgarish va uzoq branch'lar foyda emas, xatar keltiradi.
