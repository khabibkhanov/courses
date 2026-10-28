---
n: 17
slug: domen-tili
title: "Domen tili: ubiquitous language"
summary: "Kod biznes bilan bir tilda gapirsa, talabni kodga va xatoni biznesga tarjima qilish narxi pasayadi. Bu darsda Eric Evans'ning ubiquitous language g'oyasini, solution domain va problem domain nomlari farqini va o'zbek tilida ishlovchi jamoalarda inglizcha identifikator yoki o'zbekcha domen so'zi tanlash masalasini ko'ramiz."
duration: 40
sources:
  - id: ddd-evans
    note: "Ubiquitous Language haqidagi bob (I qism): model asosidagi umumiy til, uni kodda, hujjatda va suhbatda ishlatish; tilni modelni o'zgartirish vositasi sifatida ko'rish"
  - id: fowler-ubiquitous-language
    note: "Evans g'oyasining qisqa bayoni: til domen modelidan olinadi, aniq bo'ladi va tushuncha chuqurlashgani sari o'zgaradi"
  - id: cc1
    note: "2-bob: \"Use Solution Domain Names\" va \"Use Problem Domain Names\" bo'limlari"
quiz:
  - q: "Biznes tahlilchi \"reys\" (trip) deydi, kodda esa `Route`, DB'da `journeys` jadvali, frontend'da `Ride` komponenti bor. Evans nuqtai nazaridan asosiy xavf nima?"
    options:
      - "Nomlar juda qisqa"
      - "Har bir suhbat va o'zgarish tarjima talab qiladi va tarjima paytida ma'no yo'qoladi yoki o'zgaradi; jamoa bitta tushuncha haqida gapirayotganiga ishonch yo'q"
      - "Frontend va backend bir xil nomlarni ishlata olmaydi"
      - "Bu faqat hujjat muammosi"
    answer: 1
    explain: "Evans tarjima qatlamlarini asosiy xavf deb biladi: har bir tarjima noaniqlik qo'shadi va model biznes tushunchasidan uzoqlashadi. Umumiy til bu tarjimalarni yo'q qiladi."
  - q: "Martin \"solution domain\" va \"problem domain\" nomlarini farqlaydi. Qaysi juftlik to'g'ri taqsimlangan?"
    options:
      - "`RetryQueue`, `LruCache` - solution domain; `Waybill`, `Refuel` - problem domain"
      - "`Waybill` - solution domain; `LruCache` - problem domain"
      - "Ikkalasi ham bir xil narsa"
      - "Barcha nomlar problem domain'dan bo'lishi kerak"
    answer: 0
    explain: "Martin dasturchilar tushunadigan texnik atamalarni (pattern, algoritm, tuzilma) solution domain nomlari, biznes tushunchalarini esa problem domain nomlari deb ataydi. Texnik qatlamda birinchisi, biznes mantiqida ikkinchisi tabiiy."
  - q: "Fowler bayoniga ko'ra Evans ubiquitous language'ni qanday ko'radi?"
    options:
      - "Loyiha boshida bir marta yoziladigan lug'at"
      - "Faqat dasturchilar uchun texnik standart"
      - "Domen modeliga asoslangan, aniq va jamoaning domen haqidagi tushunchasi chuqurlashgani sari o'zgarib boradigan til"
      - "Faqat hujjatlar uchun til, kod esa alohida"
    answer: 2
    explain: "Til domen modelidan olinadi va u bilan birga o'zgaradi. Domen ekspertlari noto'g'ri atamalarga e'tiroz bildiradi, dasturchilar esa noaniqlik va ziddiyatlarni qidiradi."
  - q: "O'zbekistondagi lizing kompaniyasi uchun tizim yozyapsiz. Biznesda \"garov\", \"kafil\", \"muddati o'tgan to'lov\" atamalari ishlatiladi. Qaysi yondashuv eng oqilona?"
    options:
      - "Barcha identifikatorlarni o'zbekcha transliteratsiyada yozish"
      - "Har bir so'zni Google Translate orqali tarjima qilib, so'roqsiz ishlatish"
      - "Domenni hech qayerda hujjatlamaslik"
      - "Inglizcha identifikatorlar ishlatish (`collateral`, `guarantor`, `overduePayment`), lekin jamoa lug'atida har birini mahalliy atama bilan bog'lash; tarjimasi aniq bo'lmagan yoki mahalliy huquqiy tushunchalarda ataylab o'zbekcha so'z qoldirishni muhokama qilish"
    answer: 3
    explain: "Inglizcha identifikatorlar stack, kutubxonalar va kelajakdagi xodimlar bilan mos keladi. Lekin tarjima ma'noni o'zgartirmasligi uchun lug'at kerak. Aniq ekvivalenti yo'q mahalliy tushunchalar uchun asl so'z ba'zan aniqroq."
  - q: "Bir kompaniyada ikki bo'lim \"mijoz\" so'zini ishlatadi: savdo bo'limi uchun bu shartnoma tuzgan kompaniya, texnik yordam uchun esa ilovaga kiradigan haydovchi. Kodda bitta `Customer` tipi bor. Eng to'g'ri yo'l qaysi?"
    options:
      - "Bitta `Customer` tipiga barcha maydonlarni qo'shish"
      - "Ikki tushunchani ajratish: har bir kontekstda o'z nomi va modeli (`Account` va `DriverUser`, yoki alohida modullarda alohida `Customer` tiplari)"
      - "So'zni butunlay taqiqlash"
      - "Bo'limlardan birini so'zni ishlatmaslikka majburlash"
    answer: 1
    explain: "Bir so'z ikki tushunchani bildirsa, bitta model ikkalasini yomon ifodalaydi. DDD'da bu bounded context g'oyasiga olib keladi (84-dars): har bir kontekstda til aniq va izchil."
  - q: "Domen ekspertlari \"to'xtash\" deganda 5 daqiqadan uzoq dvigatel o'chirilgan holatni tushunadi, kodda esa `stop` tezlik 0 bo'lgan har qanday nuqta. Nima qilish kerak?"
    options:
      - "Kodni domen ta'rifiga moslash yoki agar ikkala tushuncha kerak bo'lsa, ularni turli nomlar bilan ajratish (`Stop` va `StationaryPoint`)"
      - "Ekspertlarni kod ta'rifiga ko'nikishga majburlash"
      - "Hech narsa, chunki kod ishlaydi"
      - "Faqat kommentga yozish"
    answer: 0
    explain: "Bir so'zning ikki ma'nosi - umumiy tilning buzilishi. Evans bunday nomuvofiqlikni model va tilni aniqlashtirish imkoniyati deb ko'radi."
task:
  title: "Yoqilg'i modulini domen tiliga moslash"
  prompt: |
    Quyidagi kod transport parkida yoqilg'i quyish hodisalarini qayta ishlaydi. Domen ekspertlari (parkning yoqilg'i nazoratchisi) bilan suhbatda quyidagi atamalar aniqlandi:

    - **Quyish (refuel)** - bakka yoqilg'i qo'shilishi, datchik bo'yicha sathning keskin oshishi.
    - **To'kish (drain)** - harakatsiz holatda sathning keskin pasayishi. Bu tasdiqlanmagan, shubhali hodisa.
    - **Talon (fuel voucher)** - haydovchiga berilgan yoqilg'i olish huquqi, litrda.
    - **Nomuvofiqlik (discrepancy)** - talon bo'yicha olingan litr va datchik ko'rsatgan quyish orasidagi farq.

    Kod esa o'z texnik tilida yozilgan. Uni shunday qayta yozingki, nazoratchi bilan suhbatdagi so'zlar kodda ham bo'lsin. Har bir nom qaysi atamaga mos kelishini izohlang.
  lang: ts
  starter: |
    type SensorDelta = { carId: string; delta: number; moving: boolean; ts: number };
    type Ticket = { carId: string; liters: number; ts: number };

    export function processDeltas(deltas: SensorDelta[], tickets: Ticket[]) {
      const ups = deltas.filter((d) => d.delta > 15);
      const downs = deltas.filter((d) => d.delta < -15 && !d.moving);
      const mismatches = tickets
        .map((t) => {
          const up = ups.find((u) => u.carId === t.carId && Math.abs(u.ts - t.ts) < 3_600_000);
          return { carId: t.carId, diff: t.liters - (up ? up.delta : 0) };
        })
        .filter((m) => Math.abs(m.diff) > 5);
      return { ups, downs, mismatches };
    }
  solution: |
    type VehicleId = string;

    type FuelLevelChange = {
      vehicleId: VehicleId;
      changeLiters: number;
      isMoving: boolean;
      recordedAtMs: number;
    };

    type FuelVoucher = { vehicleId: VehicleId; liters: number; issuedAtMs: number };

    type Refuel = FuelLevelChange;
    type SuspectedDrain = FuelLevelChange;
    type FuelDiscrepancy = { vehicleId: VehicleId; voucherLiters: number; refueledLiters: number; differenceLiters: number };

    const REFUEL_MIN_INCREASE_LITERS = 15;
    const DRAIN_MIN_DECREASE_LITERS = 15;
    const VOUCHER_MATCH_WINDOW_MS = 60 * 60 * 1000;
    const DISCREPANCY_TOLERANCE_LITERS = 5;

    export function detectRefuels(changes: FuelLevelChange[]): Refuel[] {
      return changes.filter((change) => change.changeLiters > REFUEL_MIN_INCREASE_LITERS);
    }

    export function detectSuspectedDrains(changes: FuelLevelChange[]): SuspectedDrain[] {
      return changes.filter(
        (change) => !change.isMoving && change.changeLiters < -DRAIN_MIN_DECREASE_LITERS,
      );
    }

    export function findVoucherDiscrepancies(vouchers: FuelVoucher[], refuels: Refuel[]): FuelDiscrepancy[] {
      return vouchers
        .map((voucher) => {
          const matchingRefuel = refuels.find(
            (refuel) =>
              refuel.vehicleId === voucher.vehicleId &&
              Math.abs(refuel.recordedAtMs - voucher.issuedAtMs) < VOUCHER_MATCH_WINDOW_MS,
          );
          const refueledLiters = matchingRefuel?.changeLiters ?? 0;
          return {
            vehicleId: voucher.vehicleId,
            voucherLiters: voucher.liters,
            refueledLiters,
            differenceLiters: voucher.liters - refueledLiters,
          };
        })
        .filter((discrepancy) => Math.abs(discrepancy.differenceLiters) > DISCREPANCY_TOLERANCE_LITERS);
    }
  solutionNotes: |
    - `ups` -> `Refuel` / `detectRefuels`: nazoratchi "quyish" deydi, kod "up" derdi. Endi suhbatdagi so'z kodda ham.
    - `downs` -> `SuspectedDrain`: domen bu hodisani tasdiqlanmagan deb biladi, shuning uchun "Suspected". Kodda `Theft` deb yozish biznes ma'nosini noto'g'ri kuchaytirgan bo'lardi.
    - `Ticket` -> `FuelVoucher`: kompaniyada bu "talon" deyiladi. Inglizcha ekvivalent sifatida `voucher` tanlandi va lug'atda "talon" bilan bog'landi.
    - `mismatches` -> `FuelDiscrepancy`: domen ekspertlari bu so'zni ishlatadi. Natija tipi endi ikkala qiymatni ham (`voucherLiters`, `refueledLiters`) ko'rsatadi, chunki nazoratchi hisobotda aynan shuni so'raydi.
    - Bitta `processDeltas` uchta domen amaliga bo'lindi. Bu nomlash natijasi: har bir amal domenda alohida tushuncha ekanligi ma'lum bo'ldi.
    - `carId` -> `vehicleId`: parkda yuk mashinalari va avtobuslar ham bor, "car" noto'g'ri edi.
    - Muqobil: agar jamoa "talon" so'zini kodda ham saqlashga qaror qilsa (`FuelTalon`), bu ham oqilona, faqat izchil bo'lsin va lug'atga yozilsin.
  checklist:
    - "Har bir domen atamasi kodda bitta aniq nomga ega"
    - "Kod domen ekspertlari ishlatmaydigan texnik jargonni (up, down, delta) biznes mantiqida ishlatmaydi"
    - "Tasdiqlanmagan hodisalar nomi biznes ma'nosini kuchaytirmaydi"
    - "Mahalliy atamalar uchun inglizcha nom tanlangan bo'lsa, ular lug'atda bog'langan"
    - "Domen chegaralari (raqamlar) nomlangan konstantalarda"
---

## Muammo

Transport parki uchun tizim ishlab chiqilmoqda. Dispetcher "reys" deydi, biznes tahlilchi talablarda "trip" deb yozadi, backend'da `Route` klassi bor, DB'da `journeys` jadvali, frontend'da `RideCard` komponenti. Har biri bitta tushuncha haqida gapirayotganiga hech kim to'liq ishonch hosil qilmagan. Keyin ma'lum bo'ladiki, `Route` aslida reja (marshrut), `journeys` esa haqiqiy bosib o'tilgan yo'l. Ikkala tushuncha ham kerak edi, lekin nomlar ularni aralashtirib yuborgan.

Bu holatda har bir talab bir necha marta tarjima qilinadi: biznes tilidan tahlilchi tiliga, undan dasturchi tiliga, undan kod nomlariga. Xato haqida xabar esa teskari yo'l bilan qaytadi. Har bir tarjima qadami vaqt oladi va ma'noni biroz o'zgartiradi. Natijada dasturchi to'g'ri yozilgan kod noto'g'ri biznes muammosini hal qilayotganini kech biladi.

O'zbek tilida ishlovchi jamoalarda bu muammoga yana bir qatlam qo'shiladi: biznes o'zbek yoki rus tilida gapiradi, kod esa inglizcha yoziladi. "Talon", "yo'l varaqasi", "ДУТ", "garov" kabi so'zlar uchun har bir dasturchi o'z tarjimasini tanlaydi va bitta loyihada `ticket`, `coupon`, `voucher` bir tushuncha uchun paydo bo'ladi.

## Asosiy g'oya

Eric Evans *Domain-Driven Design* kitobida bu muammoga **ubiquitous language** (hamma joyda ishlatiladigan til) deb nom bergan yechimni taklif qiladi. Martin Fowler o'z maqolasida bu g'oyani qisqa bayon qiladi: dasturchilar va foydalanuvchilar (domen ekspertlari) birgalikda umumiy, qat'iy tilni quradi. Bu til dasturda ishlatiladigan **domen modeliga asoslanadi** va u aniq bo'lishi kerak, chunki dasturiy ta'minot noaniqlikni yaxshi ko'tarmaydi.

Bu tilning bir necha muhim xususiyati bor:

- **U hamma joyda ishlatiladi.** Suhbatda, talablarda, diagrammalarda, kod nomlarida, test nomlarida, DB sxemasida. Agar dispetcher "reys" desa va bu `Trip` tushunchasi bo'lsa, kodda `Trip`, DB'da `trips`, API'da `/trips`, frontend'da `TripCard`. Tarjima qatlami yo'q.
- **U modelni sinovdan o'tkazadi.** Fowler bayoniga ko'ra, Evans tilni domen ekspertlari bilan suhbatda ishlatishni modelni tekshirish usuli deb ko'radi. Agar model atamalari bilan tabiiy jumla tuzib bo'lmasa yoki ekspert "biz bunday demaymiz" desa, model noto'g'ri.
- **U o'zgaradi.** Til va model jamoaning domen haqidagi tushunchasi chuqurlashgani sari birgalikda o'zgaradi. Domen ekspertlari noto'g'ri yoki noaniq atamalarga e'tiroz bildiradi, dasturchilar esa dizaynni buzadigan noaniqlik va ziddiyatlarni qidiradi.
- **Til o'zgarsa, kod o'zgaradi.** Bu eng og'ir qism. Agar jamoa "reys" o'rniga "smena" tushunchasi aniqroq ekanini tushunsa, bu faqat lug'atdagi o'zgarish emas. Kod nomlari ham o'zgarishi kerak, aks holda til va kod qayta ajraladi (20-dars).

Robert Martin *Clean Code*ning 2-bobida shu g'oyaning kichik versiyasini beradi, lekin boshqa tomondan. U ikki xil nom manbasini farqlaydi:

- **Solution domain nomlari.** Kodni dasturchilar o'qiydi, shuning uchun informatika atamalari, algoritm va pattern nomlari, matematik terminlar ishlatilishi mumkin: `AccountVisitor`, `JobQueue`, `LruCache`. Har bir nomni domen ekspertidan so'rash shart emas.
- **Problem domain nomlari.** Agar texnik atama bo'lmasa, problem domain'dan nom oling. Kodni saqlaydigan dasturchi domen ekspertidan uning ma'nosini so'rashi mumkin bo'ladi.

Martin bu ikkisini ajratishni yaxshi dasturchi va dizaynerning vazifasi deb biladi: problem domain tushunchalari bilan ko'proq bog'liq kod shu domen nomlarini olishi kerak.

## Chuqurroq: til qanday quriladi va qanday buziladi

### Qatlamlarga qarab nom manbai

Martinning farqini amaliy qoidaga aylantirish mumkin. Tizimda turli qatlamlar turli tilda gapiradi:

- **Domen qatlami** (biznes qoidalari, entity'lar, servislar): faqat problem domain tili. `Trip`, `Refuel`, `Waybill`, `assignDriver`, `closeShift`. Bu yerda `DataProcessor` yoki `Handler` kabi nomlar til buzilganining belgisi.
- **Infratuzilma qatlami** (DB, kesh, navbat, HTTP mijozlar): solution domain tili. `PostgresTripRepository`, `RedisLockService`, `TelemetryKafkaConsumer`.
- **Chegara** (adapterlar, mapper'lar): ikkala til uchrashadi. `TripRowMapper` DB qatorini domen obyektiga o'giradi va bu yerda ikkala tilning nomlari tabiiy.

Bu ajratish qachon nimani domen ekspertidan so'rash kerakligini ham aytadi: domen qatlamidagi har bir yangi nom ekspert bilan tekshirilishi kerak, infratuzilmadagi esa yo'q.

### Lug'at (glossary)

Ubiquitous language faqat og'zaki kelishuv bo'lib qolsa, u tez buziladi. Amaliy vosita - repozitoriyda yashaydigan qisqa lug'at fayli: atama, qisqa ta'rif, kodda qanday nomlanishi, mahalliy tildagi so'z va bunday emas degan izoh. Masalan:

- **Trip** (reys) - haydovchi smenasi davomidagi bitta A nuqtadan B nuqtaga harakat. Kodda: `Trip`, `trips` jadvali. Bu `Route` emas: `Route` - rejalashtirilgan marshrut.
- **Waybill** (yo'l varaqasi, путевой лист) - haydovchiga smena uchun beriladigan rasmiy hujjat. Kodda: `Waybill`.

Lug'at uzun bo'lishi shart emas. Eng muhim 20-30 ta atama yetarli, ayniqsa bir-biriga o'xshash va chalkashadiganlari.

### Bir so'z, ikki ma'no

Til buzilishining eng xavfli shakli - bir so'zning tashkilot ichida ikki ma'noda ishlatilishi. Savdo bo'limi uchun "mijoz" - shartnoma tuzgan kompaniya, texnik yordam uchun - mobil ilovaga kiradigan haydovchi. Agar kodda bitta `Customer` tipi ikkalasini ham ifodalasa, u tez orada ikkala bo'limning maydonlari bilan to'lib, hech biriga yaxshi xizmat qilmaydi.

Evans bu muammoni katta tizimlarda bounded context (chegaralangan kontekst) g'oyasi orqali hal qiladi: har bir kontekstda til aniq, kontekstlar orasida esa aniq tarjima bor. Bu mavzuni 84-darsda batafsil ko'ramiz. Hozircha amaliy qoida: bitta so'z ikki ma'noda ishlatilayotganini sezsangiz, buni yashirmang. Yoki ikki xil nom tanlang (`Account` va `AppUser`), yoki ikki modulda ikki alohida model qiling.

### O'zbek tilida ishlovchi jamoalar: inglizcha yoki o'zbekcha?

Bu savolga yagona to'g'ri javob yo'q va har ikki tomonning argumentlari jiddiy.

**Inglizcha identifikatorlar tarafdorlari:**

- Til kalit so'zlari, standart kutubxona, freymvorklar, xato xabarlari va hujjatlar inglizcha. `findTalonlarByHaydovchi` kabi aralash nom o'qishni qiyinlashtiradi.
- Kod jamoa tarkibidan uzoq yashaydi. Rus tilida gapiradigan yoki chet ellik dasturchi, autsorsing jamoa yoki investor due diligence'i inglizcha kodni tezroq tushunadi.
- O'zbek lotin yozuvidagi apostrof (`o'`, `g'`) identifikatorda ishlatilmaydi va `ogil`, `togri` kabi shakllar ma'noni buzadi yoki noaniq bo'ladi.
- Qidiruv, avtoto'ldirish, AI yordamchilar inglizcha nomlar bilan yaxshiroq ishlaydi.

**O'zbekcha (yoki ruscha) domen so'zlari tarafdorlari:**

- Ba'zi mahalliy tushunchalarning aniq inglizcha ekvivalenti yo'q yoki tarjima ma'noni o'zgartiradi. "Mahalla", "propiska", mahalliy soliq yoki huquqiy atamalar, davlat hujjatlari nomlari. Tarjima qilingan nom (`neighborhood`, `registration`) domen ekspertiga boshqa narsani eslatadi.
- Ubiquitous language g'oyasining asosi - tarjima qatlamini yo'qotish. Agar barcha suhbatlar o'zbek tilida bo'lsa, inglizcha nom o'zi bir tarjima qatlami.
- Davlat tizimlari bilan integratsiyada (soliq, bojxona, GPS monitoring bo'yicha davlat talablari) tashqi API'ning o'zi mahalliy nomlar bilan kelishi mumkin.

**Amaliy murosaga ko'p jamoalar keladi:** asosiy til inglizcha (kalit tushunchalar, texnik qatlam, umumiy biznes atamalari: `Trip`, `Invoice`, `Payment`), lekin aniq ekvivalenti yo'q mahalliy tushunchalar uchun ataylab transliteratsiya qilingan so'z (`mahallaId`, `pinfl`, `stir` - ya'ni soliq to'lovchining identifikatsiya raqami). Eng muhimi - har bir tanlov **lug'atda yozilgan** bo'lishi va **izchil** qo'llanishi. `FuelVoucher` deb kelishilgan bo'lsa, boshqa faylda `Talon` paydo bo'lmasligi kerak. Bu bahs uchun ishonchli, o'lchangan statistika yo'q: yuqoridagilar tajriba asosidagi argumentlar.

## Misol: smena va reys

```ts
// Domen ekspertlari bilan kelishilmagan nomlar
type Job = { id: string; workerId: string; carId: string; begin: Date; end: Date | null };
type Leg = { jobId: string; from: string; to: string; km: number };

export function closeJob(job: Job, legs: Leg[], now: Date) {
  if (legs.length === 0) throw new Error("no legs");
  return { ...job, end: now, km: legs.reduce((s, l) => s + l.km, 0) };
}
```

Dispetcherlar "smena" va "reys" deydi. `Job` va `Leg` dasturchining texnik tanlovi. "Worker" - haydovchi, "car" - parkdagi har qanday transport. Dispetcher "reyssiz smenani yopib bo'lmaydi" desa, dasturchi uni "no legs" xatosiga tarjima qilishi kerak.

```ts run
type DriverId = string;
type VehicleId = string;

export type Shift = {
  id: string;
  driverId: DriverId;
  vehicleId: VehicleId;
  startedAt: Date;
  closedAt: Date | null;
};

export type Trip = { shiftId: string; origin: string; destination: string; distanceKm: number };

export type ClosedShift = Shift & { closedAt: Date; totalDistanceKm: number };

export class ShiftWithoutTripsError extends Error {
  constructor(shiftId: string) {
    super(`Reyssiz smenani yopib bo'lmaydi: ${shiftId}`);
  }
}

export function closeShift(shift: Shift, trips: Trip[], closedAt: Date): ClosedShift {
  if (trips.length === 0) throw new ShiftWithoutTripsError(shift.id);
  const totalDistanceKm = trips.reduce((sum, trip) => sum + trip.distanceKm, 0);
  return { ...shift, closedAt, totalDistanceKm };
}

// Sinab ko'ring: reyslarni o'zgartiring yoki ro'yxatni bo'shating.
const shift: Shift = {
  id: "sh_7",
  driverId: "drv_1",
  vehicleId: "01A123BC",
  startedAt: new Date("2026-10-28T06:00:00Z"),
  closedAt: null,
};
const trips: Trip[] = [
  { shiftId: "sh_7", origin: "Chilonzor", destination: "Sergeli", distanceKm: 14 },
  { shiftId: "sh_7", origin: "Sergeli", destination: "Yunusobod", distanceKm: 21.5 },
];
console.log(closeShift(shift, trips, new Date("2026-10-28T15:00:00Z")).totalDistanceKm);
try {
  closeShift(shift, [], new Date());
} catch (e) {
  console.log(e instanceof ShiftWithoutTripsError, (e as Error).message);
}
```

Nima o'zgardi:

- **Kod suhbat tilida.** `Shift`, `Trip`, `closeShift`, `ShiftWithoutTripsError`. Dispetcherning qoidasi ("reyssiz smenani yopib bo'lmaydi") deyarli so'zma-so'z kodda.
- **`worker` -> `driver`, `car` -> `vehicle`.** Domen tilida aniq so'zlar. "Car" parkdagi avtobus va yuk mashinalarini noto'g'ri istisno qilardi.
- **`begin`/`end` -> `startedAt`/`closedAt`.** Domen "smena yopildi" deydi, "tugadi" emas. Kichik farq, lekin yopish - bu dispetcherning harakati, tugash esa vaqt.
- **Xato domen hodisasi sifatida nomlandi.** `ShiftWithoutTripsError` loglarda ham, monitoringda ham biznesga tushunarli.

## Qachon qo'llamaslik kerak

- **Texnik kod.** Kesh, retry, navbat, serializatsiya kabi infratuzilma kodida domen tilini majburlash noqulay nomlarga olib keladi. Bu yerda Martinning solution domain nomlari to'g'ri.
- **Domen ekspertlari ham noaniq gapirganda.** Ba'zan biznesda bitta so'z uch ma'noda ishlatiladi va ekspertlar ham buni sezmaydi. Ularning so'zini ko'r-ko'rona kodga ko'chirish noaniqlikni kodga ham olib kiradi. Bu holatda dasturchining vazifasi - noaniqlikni ochiq qilish va aniqroq atamani birgalikda tanlash.
- **Kichik, qisqa muddatli loyihalar.** CRUD panel, bir martalik integratsiya yoki prototip uchun to'liq lug'at va ekspert bilan muntazam sessiyalar ortiqcha bo'lishi mumkin. Lekin asosiy tushunchalar nomini bir marta kelishib olish baribir arzon.
- **Tashqi tizim nomlari.** Agar davlat API'si `tin` deb maydon yuborsa va sizning domeningizda bu `taxpayerId`, chegarada mapping qiling. Ichki tilni tashqi tizim nomlariga moslashtirmang.
- **Mexanik tarjima.** Har bir o'zbekcha so'zni lug'atdan inglizchaga tarjima qilish ubiquitous language emas. Tarjima domen ekspertlari bilan tekshirilmasa, u yangi tarjima qatlami yaratadi.

## Stack'da: NestJS, Prisma, React

- **NestJS modullari domen bo'yicha.** `ShiftsModule`, `TripsModule`, `FuelModule`. `DataModule`, `CoreModule`, `CommonModule` kabi modullar domen tilini yashiradi va hamma narsani o'ziga tortadi.
- **Prisma va DB.** Prisma model nomi (`Shift`) va jadval nomi (`@@map("shifts")`) domen atamasi bilan bir xil bo'lsin. Agar DB eski va jadval `journeys` deb nomlangan bo'lsa, Prisma'da `model Trip { ... @@map("journeys") }` yangi tilni kodga olib kiradi, DB migratsiyasini esa keyinga qoldiradi.
- **API marshrutlari.** `/api/shifts/:shiftId/close` - domen amali. `/api/jobs/:id/update?status=2` - texnik amal. Birinchisi frontend dasturchiga ham, loglarni o'qiyotgan ops'ga ham tushunarli.
- **React komponentlari.** `ShiftTimeline`, `TripList`, `FuelDiscrepancyBadge`. Dizayner Figma'da qaysi nom ishlatsa, kodda ham shu nom bo'lishi ideal, chunki dizaynerlar ham shu umumiy tilning ishtirokchisi.
- **Test nomlari.** `it("reyssiz smenani yopishga ruxsat bermaydi")` yoki inglizcha `it("rejects closing a shift without trips")`. Test nomlari domen qoidalarining tirik hujjati (63-dars).

## Xulosa

- Ubiquitous language - domen modeliga asoslangan, kodda, hujjatda va suhbatda bir xil ishlatiladigan aniq til. U tarjima qatlamlarini yo'q qiladi.
- Til modelni sinovdan o'tkazadi va u bilan birga o'zgaradi. Til o'zgarsa, kod nomlari ham o'zgarishi kerak.
- Domen qatlamida problem domain nomlari, infratuzilmada solution domain nomlari tabiiy.
- Bir so'z ikki ma'noda ishlatilsa, buni ochiq qiling: ikki nom yoki ikki alohida model.
- O'zbek tilida ishlovchi jamoalarda inglizcha asosiy til va aniq ekvivalenti yo'q mahalliy tushunchalar uchun ataylab olingan so'zlar keng tarqalgan murosa. Asosiysi - lug'at va izchillik.
