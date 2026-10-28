---
n: 15
slug: nom-uzunligi-va-scope
title: "Nom uzunligi, scope va kontekst"
summary: "Nom qancha uzun bo'lishi kerak degan savolga yagona raqam bilan javob berib bo'lmaydi. Bu darsda nom uzunligini scope, kontekst va aniqlik bilan bog'laymiz, Martin, McConnell va Ousterhout hamda Go jamiyatining qisqa nomlar haqidagi qarashlarini solishtiramiz."
duration: 35
sources:
  - id: cc1
    note: "2-bob: \"Add Meaningful Context\" va \"Don't Add Gratuitous Context\" bo'limlari; 17-bob N5 \"Use Long Names for Long Scopes\" evristikasi"
  - id: aposd
    note: "14-bob \"Choosing Names\": aniqlik, izchillik va qisqa nomlar uslubi haqidagi munozara"
  - id: code-complete
    note: "11-bob: nom uzunligi va scope, hisoblangan qiymat qo'shimchalari (Total, Max) va ularning o'rni"
quiz:
  - q: "Martinning N5 evristikasiga ko'ra qaysi nom eng oqilona?"
    options:
      - "Butun ilova bo'ylab eksport qilinadigan funksiya: `calc`"
      - "Uch qatorli `for` sikli indeksi: `currentVehicleIndexInList`"
      - "Ikki qatorli callback'dagi element: `(v) => v.plateNumber`"
      - "Modul darajasidagi konfiguratsiya: `t`"
    answer: 2
    explain: "Nom uzunligi scope'ga mos bo'lishi kerak. Ikki qatorli callback'da `v` va kontekst (`vehicles.map`) yetarli. Eksport qilinadigan funksiya va modul darajasidagi qiymat esa keng scope'ga ega va qisqa nom bilan qimmatga tushadi."
  - q: "`Address` klassi ichida `state`, `city`, `street` maydonlari bor. Ularni `addrState`, `addrCity` deb qayta nomlash kerakmi?"
    options:
      - "Ha, bu kontekst qo'shadi"
      - "Yo'q: klass nomi kontekstni beradi. `addr` prefiksi faqat kontekst yo'q joyda (masalan, alohida lokal o'zgaruvchilarda) mantiqli"
      - "Ha, chunki `state` React'dagi state bilan to'qnashadi"
      - "Yo'q, chunki prefikslar har doim taqiqlangan"
    answer: 1
    explain: "Martin `addrState` kabi prefiksni kontekst yo'q holatda (bir funksiyada ko'p alohida o'zgaruvchi) oxirgi chora deb ko'radi. Eng yaxshi kontekst - klass yoki tip. Klass ichida prefiks ortiqcha takror."
  - q: "Loyihadagi barcha klasslar `Iqx` prefiksi bilan boshlanadi: `IqxVehicle`, `IqxDriver`, `IqxTrip`. Martin buni qanday baholaydi?"
    options:
      - "Yaxshi amaliyot, chunki nom to'qnashuvi bo'lmaydi"
      - "Faqat katta loyihalarda zarur"
      - "Keraksiz kontekst: IDE avtoto'ldirishda har safar prefiksni yozish kerak, barcha nomlar bir xil boshlanadi va farq oxiriga suriladi"
      - "TypeScript buni talab qiladi"
    answer: 2
    explain: "Martin \"Gas Station Deluxe\" misolida ilova nomini har bir klassga qo'shishni keraksiz kontekst deb ataydi. Modul tizimi va import yo'llari nom to'qnashuvini allaqachon hal qiladi."
  - q: "Ousterhout va Go jamiyatining qisqa nomlar haqidagi qarashlarini to'g'ri ifodalovchi gap qaysi?"
    options:
      - "Ousterhout qisqa nomlarni har doim afzal ko'radi"
      - "Ousterhout e'lon va ishlatish orasidagi masofa katta bo'lsa nom uzunroq bo'lishi kerak degan qoidaga qo'shiladi, lekin qisqa nomlar o'qilishi osonligi haqidagi da'voga to'liq qo'shilmaydi: asosiy mezon aniqlik"
      - "Go jamiyati uzun nomlarni talab qiladi"
      - "Ikki tomon ham nom uzunligi ahamiyatsiz deydi"
    answer: 1
    explain: "Bu munozarada asosiy mezon aniqlik. Qisqa nom kichik scope'da yetarlicha aniq bo'lishi mumkin, lekin `buf` yoki `n` kabi nomlar keng scope'da noaniqlik yaratadi."
  - q: "McConnell `revenueTotal`, `revenueAverage` kabi nomlarni `totalRevenue`, `averageRevenue` dan afzal ko'rishining sababi nima?"
    options:
      - "Ingliz grammatikasi shuni talab qiladi"
      - "Qisqaroq bo'lgani uchun"
      - "TypeScript bunga majbur qiladi"
      - "Asosiy so'z (revenue) birinchi turadi, bog'liq o'zgaruvchilar avtoto'ldirish va ro'yxatda yonma-yon tushadi va izchil naqsh hosil bo'ladi"
    answer: 3
    explain: "McConnell hisoblangan qiymat qo'shimchalarini (Total, Max, Average) oxiriga qo'yishni tavsiya qiladi, chunki eng muhim qism nom boshida bo'ladi va izchillik oshadi. U ham bu qoida ingliz tilida tabiiy ko'rinmasligini tan oladi va `num` kabi istisnolarni muhokama qiladi."
  - q: "Funksiya uzunligi 120 qator va unda `data`, `res`, `tmp`, `item` o'zgaruvchilari bor. Eng to'g'ri birinchi qadam nima?"
    options:
      - "Barcha nomlarni uch-to'rt so'zli nomlarga almashtirish"
      - "Funksiyani kichikroq bo'laklarga bo'lishni o'ylab ko'rish: keng scope uzun nom talab qiladi, scope'ni kichraytirish esa qisqa nomlarni yana aniq qiladi"
      - "Kommentlar qo'shish"
      - "Hech narsa qilmaslik, chunki kod ishlaydi"
    answer: 1
    explain: "Nom uzunligi va scope bir-biriga bog'liq. Ba'zan nomlarni uzaytirish to'g'ri, lekin ko'pincha haqiqiy muammo - scope juda keng. Ikkala yechimni ham ko'rib chiqing."
task:
  title: "Hisobot funksiyasida nom uzunligini scope'ga moslash"
  prompt: |
    Quyidagi modul haydovchilar bo'yicha oylik hisobot tayyorlaydi. Unda ikki xil xato aralashgan: keng scope'dagi juda qisqa nomlar va tor scope'dagi keraksiz uzun nomlar, shuningdek keraksiz kontekst prefiksi.

    1. Har bir nomning scope'ini aniqlang (modul, funksiya, callback).
    2. Keng scope'dagi nomlarni aniq qiling, tor scope'dagilarni soddalashtiring.
    3. Keraksiz kontekstni olib tashlang, kontekst yo'qolgan joyda esa uni tip yoki modul orqali bering.
  lang: ts
  starter: |
    export const t = 0.2;

    type FmsDriverMonthlyReportDriverRow = {
      fmsDriverId: string;
      fmsDriverName: string;
      fmsTrips: { km: number; harshBrakes: number }[];
    };

    export function rep(d: FmsDriverMonthlyReportDriverRow[]) {
      return d.map((currentDriverRowBeingProcessed) => {
        const totalKmForThisDriverInThisMonth = currentDriverRowBeingProcessed.fmsTrips.reduce(
          (accumulatedKilometersSoFar, currentTripObject) => accumulatedKilometersSoFar + currentTripObject.km,
          0,
        );
        const b = currentDriverRowBeingProcessed.fmsTrips.reduce((a, x) => a + x.harshBrakes, 0);
        const r = totalKmForThisDriverInThisMonth === 0 ? 0 : (b / totalKmForThisDriverInThisMonth) * 100;
        return {
          id: currentDriverRowBeingProcessed.fmsDriverId,
          name: currentDriverRowBeingProcessed.fmsDriverName,
          r,
          flag: r > t,
        };
      });
    }
  solution: |
    export const MAX_HARSH_BRAKES_PER_100_KM = 0.2;

    type Trip = { distanceKm: number; harshBrakeCount: number };
    type DriverTrips = { driverId: string; driverName: string; trips: Trip[] };

    export type DriverSafetySummary = {
      driverId: string;
      driverName: string;
      harshBrakesPer100Km: number;
      exceedsHarshBrakeLimit: boolean;
    };

    export function buildMonthlySafetySummaries(drivers: DriverTrips[]): DriverSafetySummary[] {
      return drivers.map((driver) => {
        const distanceKm = sum(driver.trips.map((trip) => trip.distanceKm));
        const harshBrakeCount = sum(driver.trips.map((trip) => trip.harshBrakeCount));
        const harshBrakesPer100Km = distanceKm === 0 ? 0 : (harshBrakeCount / distanceKm) * 100;

        return {
          driverId: driver.driverId,
          driverName: driver.driverName,
          harshBrakesPer100Km,
          exceedsHarshBrakeLimit: harshBrakesPer100Km > MAX_HARSH_BRAKES_PER_100_KM,
        };
      });
    }

    function sum(values: number[]): number {
      return values.reduce((total, value) => total + value, 0);
    }
  solutionNotes: |
    - `t` eksport qilinadigan modul konstantasi edi, ya'ni eng keng scope'dagi eng qisqa nom. U `MAX_HARSH_BRAKES_PER_100_KM` bo'ldi: endi birlik ham, ma'no ham ko'rinadi.
    - `rep` va `r` ham keng ko'rinadi (funksiya eksport qilinadi, `r` natija obyektida chaqiruvchiga chiqadi). Ular to'liq nom oldi.
    - `currentDriverRowBeingProcessed`, `accumulatedKilometersSoFar` tor scope'da edi. Kontekst (`drivers.map`, `reduce`) ma'noni beradi, shuning uchun `driver`, `total`, `value` yetarli.
    - `Fms` prefiksi va `fms*` maydonlar keraksiz kontekst edi: bu modulda boshqa haydovchi tushunchasi yo'q.
    - `driverId` va `driverName` da `driver` so'zi qoldi, chunki natija tipi chaqiruvchi tomonda boshqa obyektlar bilan aralashadi va bu yerda kontekst foydali. Tip ichida bu takror bo'lsa ham, bu qasddan qilingan tanlov: siz `id`, `name` ni ham tanlashingiz mumkin edi.
    - Takrorlangan `reduce` kichik `sum` yordamchisiga chiqarildi, bu callback'lardagi nomlarni soddaroq qildi.
  checklist:
    - "Eksport qilinadigan har bir nom kontekstsiz ham tushunarli"
    - "Callback va qisqa sikllarda nomlar ortiqcha uzun emas"
    - "Ilova yoki modul nomi prefiks sifatida takrorlanmaydi"
    - "Natija obyektidagi maydonlar chaqiruvchi uchun ma'noli"
    - "Birlikli qiymatlarda birlik nomda"
---

## Muammo

Nomlash haqidagi maslahatlar ko'pincha bir-biriga zid ko'rinadi. "Tavsiflovchi nomlar ishlating" deyiladi va natijada `currentlySelectedVehicleFromTheDropdownList` paydo bo'ladi. "Qisqa va lo'nda bo'lsin" deyiladi va natijada `v`, `cv`, `sel` paydo bo'ladi. Ikkalasi ham o'qishni qiyinlashtiradi, lekin turli sabablarga ko'ra: birinchisi qatorni to'ldirib, kodning tuzilishini yashiradi, ikkinchisi ma'noni yashiradi.

Code review'da bu bahs tez-tez takrorlanadi: bir reviewer `i` ni `index` qilishni so'raydi, boshqasi `vehicleTelemetryPointIndex` ni qisqartirishni. Ikkala izoh ham bir xil kodda bo'lishi mumkin va ikkalasi ham haq bo'lishi mumkin. Chunki to'g'ri uzunlik nomning o'ziga emas, uning **qayerda yashashiga** bog'liq.

## Asosiy g'oya

Martin *Clean Code*ning oxiridagi evristikalar ro'yxatida bu g'oyani qisqa qoidaga keltiradi: **uzun scope uchun uzun nomlar**. Nomning uzunligi uning scope'i bilan bog'liq bo'lishi kerak. Besh qatorli sikldagi `i` yoki `j` mutlaqo tushunarli, chunki o'quvchi e'lonni va barcha ishlatilgan joylarni bir qarashda ko'radi. Lekin xuddi shu `i` yuz qatorli funksiyada yoki modul darajasida yashasa, uning ma'nosini kuzatish qiyinlashadi. 13-darsda ko'rgan qidiriluvchanlik ham shu g'oyaning bir tomoni: keng ishlatiladigan nomni qidirib topish kerak bo'ladi.

Steve McConnell *Code Complete*da xuddi shu xulosaga keladi: qisqa nomlar lokal, tor scope'dagi o'zgaruvchilar uchun maqbul, keng scope'dagi, kam ishlatiladigan yoki global o'zgaruvchilar esa uzunroq, tavsiflovchi nom talab qiladi. U nom uzunligi bo'yicha empirik ma'lumotni ham keltiradi: bir tadqiqotga ko'ra o'rtacha taxminan 10-16 belgili nomlar bilan yozilgan dasturlarni debug qilish eng kam kuch talab qilgan. Bu raqamni qoida emas, yo'naltiruvchi deb qabul qilish kerak: tadqiqot eski va boshqa tillarda o'tkazilgan, bitta raqam esa scope farqini hisobga olmaydi.

Ikkinchi g'oya - **kontekst**. Nom hech qachon yolg'iz o'qilmaydi. U klass, tip, modul, funksiya yoki fayl ichida turadi va bu atrof ma'noning bir qismini beradi. Martin 2-bobda buni ikki tomondan ko'radi:

- **Ma'noli kontekst qo'shing.** `state` o'zgaruvchisi yolg'iz turganda noaniq: holatmi, shtatmi? `firstName`, `lastName`, `street`, `city` bilan birga u manzil qismi ekanligi tushuniladi. Lekin funksiya ichida faqat `state` ishlatilsa, kontekst yo'qoladi. Martinning oxirgi chora sifatidagi yechimi - prefiks (`addrState`), yaxshiroq yechimi esa - kontekstni klass yoki tip bilan berish (`Address`).
- **Keraksiz kontekst qo'shmang.** Martin "Gas Station Deluxe" degan xayoliy ilovani misol qiladi, unda har bir klass `GSD` bilan boshlanadi. Natijada IDE'da `G` ni yozsangiz, butun loyiha klasslari ro'yxati chiqadi. Qisqa nom, agar yetarlicha aniq bo'lsa, uzun nomdan yaxshiroq: keraksiz kontekst hech narsa qo'shmaydi.

## Chuqurroq: aniqlik, uzunlik va masofa

### Ousterhout: uzunlik emas, aniqlik

Ousterhout *A Philosophy of Software Design*ning nomlar haqidagi bobida asosiy talabni boshqacha qo'yadi: nom **aniq** (precise) va **izchil** (consistent) bo'lishi kerak. Uzunlik buning natijasi, maqsadi emas. U Go jamiyatidagi qisqa nomlar uslubini, xususan, uzun nomlar kod nima qilishini yashiradi degan fikrni muhokama qiladi va unga qisman qo'shilmaydi. Uning argumenti: `buf` yoki `n` kabi nom faqat juda kichik scope'da va juda aniq kontekstda yetarlicha aniq bo'ladi. Ko'p hollarda qisqa nom o'quvchini noaniqlik bilan qoldiradi.

Ousterhout shu munozarada Go jamiyatida keng tarqalgan bir qoidani ma'qullaydi: nom e'lon qilingan joy va ishlatilgan joy orasidagi **masofa** qanchalik katta bo'lsa, nom shunchalik uzun bo'lishi kerak. Bu Martinning N5 evristikasining boshqa shakli: scope - bu masofa.

Amaliy xulosa: "qisqa yoki uzun" emas, "bu joyda o'quvchi kontekstdan nimani biladi va nimani bilmaydi" deb so'rang. Nom faqat o'quvchi bilmagan narsani aytishi kerak.

### Kontekst qatlamlari

TypeScript loyihasida nomning ma'nosi bir nechta qatlamdan keladi va har bir qatlam nomni qisqartirishga imkon beradi:

1. **Modul va fayl.** `fuel/consumption.ts` faylidagi `calculate` funksiyasi `fuel` kontekstiga ega. Lekin import qilinganda (`import { calculate } from "./fuel/consumption"`) chaqiruvchi kodda bu kontekst yo'qoladi: `calculate(trip)` nima hisoblaydi? Shuning uchun **eksport qilinadigan nomlar** kontekstsiz ham tushunarli bo'lishi kerak: `calculateFuelConsumption`.
2. **Klass yoki obyekt.** `vehicle.status`, `trip.distanceKm`. Maydon nomiga `vehicleStatus` yoki `tripDistanceKm` deb klass nomini takrorlash keraksiz.
3. **Tip.** `function assign(driver: Driver, vehicle: Vehicle)`. Parametr nomi va tipi birgalikda o'qiladi.
4. **Funksiya.** Qisqa, bitta ishli funksiyada lokal o'zgaruvchilar qisqa bo'lishi mumkin, chunki funksiya nomi kontekst beradi.
5. **Callback.** `vehicles.filter((v) => v.isActive)` dagi `v` - eng tor scope, kontekst eng boy.

### Natija obyektlari: kontekst chegarani kesib o'tganda

Nozik holat: tip ichida keraksiz ko'ringan kontekst, chaqiruvchi tomonda kerak bo'lishi mumkin. API javobida yoki boshqa obyekt bilan aralashtiriladigan natijada `{ id, name }` dan ko'ra `{ driverId, driverName }` ba'zan aniqroq, chunki u `{ ...driver, ...vehicle }` kabi birlashtirishlarda to'qnashmaydi. Bu yerda yagona to'g'ri javob yo'q, lekin tanlov ongli bo'lishi va loyihada izchil qo'llanilishi kerak.

### McConnell: hisoblangan qiymat qo'shimchalari

McConnell yana bir amaliy maslahat beradi: `Total`, `Sum`, `Average`, `Max`, `Min`, `Count` kabi qo'shimchalarni nom oxiriga qo'ying (`revenueTotal`, `speedMax`). Sabab: nomning eng muhim qismi boshida turadi va bog'liq o'zgaruvchilar avtoto'ldirishda yonma-yon tushadi. U bu qoida ingliz tilida g'ayritabiiy ko'rinishini tan oladi va eng muhimi izchillik ekanini ta'kidlaydi. Ko'p TypeScript jamoalari tabiiy tartibni (`totalRevenue`, `maxSpeedKmh`) tanlaydi. Qaysi birini tanlamang, butun loyihada bir xil bo'lsin (18-dars).

## Misol: trip tahlili

```ts
export function analyze(tripTelemetryPointsForAnalysis: { s: number; t: number }[]) {
  let m = 0;
  let idleDurationAccumulatorInMilliseconds = 0;
  for (let i = 1; i < tripTelemetryPointsForAnalysis.length; i++) {
    const previousTelemetryPointInSequence = tripTelemetryPointsForAnalysis[i - 1];
    const currentTelemetryPointInSequence = tripTelemetryPointsForAnalysis[i];
    if (currentTelemetryPointInSequence.s > m) m = currentTelemetryPointInSequence.s;
    if (currentTelemetryPointInSequence.s === 0) {
      idleDurationAccumulatorInMilliseconds += currentTelemetryPointInSequence.t - previousTelemetryPointInSequence.t;
    }
  }
  return { m, idle: idleDurationAccumulatorInMilliseconds };
}
```

Bu kodda nom uzunligi scope'ga teskari: sikl ichidagi vaqtinchalik o'zgaruvchilar juda uzun, funksiyadan tashqariga chiqadigan natija (`m`) va maydonlar (`s`, `t`) esa juda qisqa.

```ts
type TelemetryPoint = { speedKmh: number; recordedAtMs: number };

export type TripSummary = { maxSpeedKmh: number; idleDurationMs: number };

export function summarizeTrip(points: TelemetryPoint[]): TripSummary {
  let maxSpeedKmh = 0;
  let idleDurationMs = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    maxSpeedKmh = Math.max(maxSpeedKmh, curr.speedKmh);
    if (curr.speedKmh === 0) {
      idleDurationMs += curr.recordedAtMs - prev.recordedAtMs;
    }
  }

  return { maxSpeedKmh, idleDurationMs };
}
```

Nima o'zgardi:

- **Keng scope'dagi nomlar uzaydi.** `analyze` -> `summarizeTrip` (eksport qilinadi), `m` -> `maxSpeedKmh` (natijada chaqiruvchiga chiqadi), `s` -> `speedKmh` (tip maydoni, butun loyihada ishlatiladi).
- **Tor scope'dagi nomlar qisqaradi.** `previousTelemetryPointInSequence` -> `prev`, `currentTelemetryPointInSequence` -> `curr`. Ular uch qatorda yashaydi va `points[i - 1]`, `points[i]` kontekstini beradi. `prev`/`curr` juftligi keng tarqalgan idioma.
- **Parametr kontekstdan foydalanadi.** `tripTelemetryPointsForAnalysis` -> `points`. Funksiya nomi `summarizeTrip` va tip `TelemetryPoint[]` qolgan ma'noni beradi.
- **`i` qoldi.** Klassik sikl indeksi, uch qatorli scope.

## Qachon qo'llamaslik kerak

- **Qisqa nom an'anaviy bo'lganda keng scope'da ham.** `id`, `db`, `req`, `res`, `ctx`, `err`, `ref`. Bular keng ishlatiladi, lekin hammaga tanish. `httpRequest`, `databaseConnection` deb uzaytirish foyda bermaydi.
- **Formulalar va algoritmlar.** Haversine formulasidagi `dLat`, `a`, `c`, matritsa amallaridagi `i`, `j`, `k`. Manbadagi belgilar bilan solishtirish uchun qisqa nomlar aniqroq.
- **"Scope tor, demak nom qisqa" qoidasini haddan oshirish.** Tor scope'da ham ikki o'xshash qiymat bo'lsa (`a`, `b` - qaysi biri boshlang'ich, qaysi biri yakuniy?), qisqa nomlar adashtiradi. `start` va `end` yaxshiroq.
- **Uzun nomni scope bilan oqlash.** Agar funksiya 150 qator bo'lgani uchun barcha o'zgaruvchilar uzun bo'lishi kerak bo'lsa, ehtimol funksiyaning o'zi muammo. Nomlarni uzaytirishdan oldin scope'ni toraytirish mumkinmi, o'ylab ko'ring (21-dars).
- **Tashqi kontekst kafolatlanmagan joylar.** Log xabarlari, metrika nomlari, Redis kalitlari, env o'zgaruvchilari. Ular boshqa tizimlarda, kontekstsiz ko'rinadi. `count` emas, `fleet_api_telemetry_points_ingested_total`.

## Stack'da: React, NestJS, env

- **React hook'lari ichida.** `const { data, isLoading } = useVehicle(id)` qisqa komponentda yaxshi. Bir komponentda ikkita query bo'lsa, `data` noaniq bo'ladi: `const { data: vehicle } = useVehicle(id); const { data: trips } = useTrips(id);` destructuring'da qayta nomlash kontekstni qaytaradi.
- **Komponent prop'lari.** `VehicleCard` komponentining prop'i `vehicle`, `vehicleData` emas. Komponent nomi kontekstni beradi.
- **NestJS servis metodlari.** `VehiclesService` ichida `findVehicleById` emas, `findById` yetarli: chaqiruv `vehiclesService.findById(id)` ko'rinishida o'qiladi. Lekin eksport qilinadigan mustaqil funksiyalarda kontekst yo'q, ular to'liq nom talab qiladi.
- **Env va konfiguratsiya.** Env o'zgaruvchilari global scope'da yashaydi, shuning uchun ular eng uzun va eng aniq nomlar bo'lishi kerak: `DATABASE_URL` emas, bir nechta DB bo'lsa `TELEMETRY_DATABASE_URL`. Ilova ichida esa ular tipli konfiguratsiya obyektiga o'raladi (`config.telemetryDb.url`), u yerda kontekst ierarxiyadan keladi (86-dars).
- **DB ustunlari.** Ustun nomi `vehicles` jadvalida `vehicle_status` emas, `status`. Jadval nomi kontekstni beradi. Lekin JOIN'lar ko'p bo'lgan so'rovlarda alias'lar orqali aniqlik qaytariladi.

## Xulosa

- Nom uzunligi scope'ga mos keladi: e'lon va ishlatish orasidagi masofa qancha katta bo'lsa, nom shuncha to'liq bo'lishi kerak.
- Asosiy mezon aniqlik, uzunlik emas. Nom o'quvchi kontekstdan bilmagan narsani aytishi kerak.
- Kontekst modul, klass, tip, funksiya va callback qatlamlaridan keladi. Eksport qilinganda modul konteksti yo'qoladi.
- Keraksiz kontekst (ilova prefiksi, klass nomini maydonda takrorlash) shovqin. Yo'qolgan kontekstni prefiks bilan emas, tip yoki klass bilan qaytaring.
- Agar nomlar uzayib ketayotgan bo'lsa, avval scope'ni toraytirish mumkinmi, tekshiring.
