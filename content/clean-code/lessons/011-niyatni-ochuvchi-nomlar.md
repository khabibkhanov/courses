---
n: 11
slug: niyatni-ochuvchi-nomlar
title: "Niyatni ochuvchi nomlar"
summary: "Yaxshi nom o'quvchining uchta savoliga javob beradi: bu narsa nega bor, nima qiladi va qanday ishlatiladi. Bu darsda Martin, McConnell va Ousterhout qarashlarini solishtirib, nomni dizayn sifatining birinchi testi sifatida ko'ramiz."
duration: 35
sources:
  - id: cc1
    note: "2-bob \"Meaningful Names\": \"Use Intention-Revealing Names\" va \"Avoid Mental Mapping\" bo'limlari; 17-bob N1 evristikasi"
  - id: aposd
    note: "14-bob \"Choosing Names\": nom abstraksiya sifatida, aniqlik talabi va \"Hard to Pick Name\" qizil bayrog'i"
  - id: code-complete
    note: "11-bob \"The Power of Variable Names\": nom obyektni to'liq va aniq tasvirlashi, \"nima\"ni aytishi, \"qanday\"ni emas"
  - id: refactoring
    note: "3-bob: \"Mysterious Name\" code smell'i"
quiz:
  - q: "Quyidagi qatorni ko'ring: `const d = 7; // ijara muddati, kunlarda`. Martin nuqtai nazaridan asosiy muammo nima?"
    options:
      - "Raqam konstantaga chiqarilmagan"
      - "Nom o'z vazifasini bajarmagan, uni komment to'ldiryapti: nom ma'noni ham, o'lchov birligini ham aytishi kerak edi"
      - "`const` o'rniga `let` ishlatish kerak edi"
      - "Komment inglizcha yozilmagan"
    answer: 1
    explain: "Martin qoidasi: agar nom komment talab qilsa, u niyatni ochmagan. `rentalPeriodDays` kabi nom kommentni ortiqcha qiladi. Konstantaga chiqarish ham foydali, lekin asosiy muammo nomda."
  - q: "McConnell yaxshi nom \"nima\"ni aytishi kerak, \"qanday\"ni emas, deydi. Qaysi juftlik shu g'oyani to'g'ri ko'rsatadi?"
    options:
      - "`vehicleArray` yaxshi, `vehicles` yomon"
      - "`parsedJsonResult` yaxshi, `tariff` yomon"
      - "`bitFlag` yaxshi, `isEngineRunning` yomon"
      - "`isEngineRunning` yaxshi, `bitFlag` yomon"
    answer: 3
    explain: "`bitFlag` qiymat qanday saqlanganini aytadi, `isEngineRunning` esa u nimani anglatishini. Muammoga yo'naltirilgan nom o'quvchiga kerakli ma'lumotni beradi, implementatsiya o'zgarsa ham eskirmaydi."
  - q: "Ousterhout Sprite fayl tizimidagi xatoni misol qiladi. Undan qanday xulosa chiqadi?"
    options:
      - "Bitta noaniq nom (`block`) ikki xil tushunchani anglatgani uchun xato uzoq vaqt topilmagan, ya'ni noaniq nom real bug manbai"
      - "Qisqa nomlar har doim xatoga olib keladi"
      - "Fayl tizimlarida nomlash muhim emas"
      - "Xatoni testlar topishi kerak edi, nom bunga aloqasi yo'q"
    answer: 0
    explain: "Ousterhout misolida bir xil nom ham fizik, ham mantiqiy blok raqami uchun ishlatilgan. Kodni o'qigan odam to'g'ri tushunchani nazarda tutgan deb o'ylagan. Xulosa: noaniq nom kosmetik muammo emas, u xato yashirinadigan joy."
  - q: "Funksiyaga yaxshi nom topa olmayapsiz: u ham GPS nuqtalarini filtrlaydi, ham yoqilg'i hisobotini yuboradi. Fowler va Ousterhout bu vaziyatni qanday baholaydi?"
    options:
      - "Nomni uzunroq qilish kifoya: `filterPointsAndSendFuelReport`"
      - "Nomni umumiy qilish kerak: `process`"
      - "Nom topish qiyinligi dizayndagi chuqurroq muammo belgisi: funksiya ikki xil ish qilyapti"
      - "Komment yozib qo'yish yetarli"
    answer: 2
    explain: "Fowler \"Mysterious Name\" smell'i haqida yaxshi nom topilmasa, bu ko'pincha dizayn kasalligi belgisi ekanini aytadi. Ousterhout ham buni qizil bayroq deb hisoblaydi. Uzun yoki umumiy nom muammoni yashiradi, hal qilmaydi."
  - q: "Qaysi holatda qisqa, \"niyatni ochmaydigan\" ko'rinadigan nom oqilona?"
    options:
      - "Modul darajasidagi eksport qilinadigan funksiya parametri"
      - "Uch qatorli `map` callback'idagi element: `points.map((p) => p.speedKmh)`"
      - "Ma'lumotlar bazasi ustuni nomi"
      - "React komponent nomi"
    answer: 1
    explain: "Scope juda kichik va kontekst (`points`) nomning ma'nosini to'liq beradi. Eksport qilinadigan narsalar, DB ustunlari va komponentlar esa keng scope'ga ega, ular uchun qisqa nom qimmatga tushadi."
task:
  title: "Telemetriya kodidagi nomlarni niyatga moslash"
  prompt: |
    Quyidagi funksiya transport parki telemetriyasidan "dvigatel yoqilgan holda turib qolgan" (idle) mashinalarni topadi. Kod ishlaydi, lekin nomlardan uning nima qilishini tushunib bo'lmaydi.

    1. Avval kodni o'zgartirmasdan har bir nom nimani anglatishini yozing. Buning uchun qancha qatorni qayta o'qishga to'g'ri keldi?
    2. Kodni shunday qayta yozingki, funksiya nomi, parametrlar va o'zgaruvchilar niyatni aytsin. Kerak bo'lsa tip qo'shing.
    3. Xatti-harakat o'zgarmasin: bir xil kirish bir xil natija bersin.
  lang: ts
  starter: |
    type P = { id: string; s: number; ig: boolean; t: number };

    export function getThem(list: P[], x: number) {
      const res: string[] = [];
      const m = new Map<string, number>();
      for (const p of list) {
        if (p.ig && p.s < 3) {
          const st = m.get(p.id);
          if (st === undefined) {
            m.set(p.id, p.t);
          } else if (p.t - st >= x * 60_000 && !res.includes(p.id)) {
            res.push(p.id);
          }
        } else {
          m.delete(p.id);
        }
      }
      return res;
    }
  solution: |
    type TelemetryPoint = {
      vehicleId: string;
      speedKmh: number;
      isIgnitionOn: boolean;
      recordedAtMs: number;
    };

    const STATIONARY_SPEED_LIMIT_KMH = 3;
    const MS_PER_MINUTE = 60_000;

    export function findIdlingVehicleIds(
      pointsSortedByTime: TelemetryPoint[],
      idleThresholdMinutes: number,
    ): string[] {
      const idleStartedAtMs = new Map<string, number>();
      const idlingVehicleIds = new Set<string>();

      for (const point of pointsSortedByTime) {
        const isIdling =
          point.isIgnitionOn && point.speedKmh < STATIONARY_SPEED_LIMIT_KMH;

        if (!isIdling) {
          idleStartedAtMs.delete(point.vehicleId);
          continue;
        }

        const startedAtMs = idleStartedAtMs.get(point.vehicleId);
        if (startedAtMs === undefined) {
          idleStartedAtMs.set(point.vehicleId, point.recordedAtMs);
          continue;
        }

        const idleDurationMs = point.recordedAtMs - startedAtMs;
        if (idleDurationMs >= idleThresholdMinutes * MS_PER_MINUTE) {
          idlingVehicleIds.add(point.vehicleId);
        }
      }

      return [...idlingVehicleIds];
    }
  solutionNotes: |
    - `getThem` -> `findIdlingVehicleIds`: chaqiruvchi tomonda funksiya nima qaytarishi ko'rinadi.
    - `x` -> `idleThresholdMinutes`: ma'no ham, o'lchov birligi ham nomda. Avval `x * 60_000` dan birlikni taxmin qilish kerak edi.
    - `m` -> `idleStartedAtMs`: Map nima saqlashini aytadi, kalit va qiymat ma'nosi ochiq.
    - `p.ig && p.s < 3` -> `isIdling` o'zgaruvchisi: shart biznes tushunchasiga nom oldi (Extract Variable).
    - `list` -> `pointsSortedByTime`: funksiya tartiblangan kirishga tayanadi, endi bu shartnoma nomda ko'rinadi.
    - `res.includes` o'rniga `Set`: bu nom emas, lekin niyatni (takrorlanmas id'lar) aniqroq ifodalaydi. Natija tartibi o'zgarmaydi, chunki `Set` qo'shilish tartibini saqlaydi.
    - Funksiyani bo'laklarga bo'lmadik: u bitta aniq ish qiladi va 30 qatordan oshmaydi.
  checklist:
    - "Funksiya nomi qaytariladigan qiymatni aytadi"
    - "Vaqt bilan bog'liq har bir nomda o'lchov birligi bor (Ms, Minutes)"
    - "Bitta harfli yoki ma'nosiz nom qolmadi (`p` kabi qisqa scope'dagi o'zgaruvchidan tashqari, agar qoldirsangiz)"
    - "Murakkab shart nomlangan o'zgaruvchiga chiqarildi"
    - "Bir nechta misolda eski va yangi funksiya natijasi bir xil ekanini tekshirdim"
---

## Muammo

Kodni o'qish narxining katta qismi nomlarni "tarjima qilish"ga ketadi. `const d = 7`, `getThem(list)`, `handleData(x)` kabi qatorni ko'rgan dasturchi oldinga o'qishni to'xtatadi va savol beradi: bu nima? Javob odatda boshqa joyda: chaqiruvchi kodda, ma'lumotlar bazasi sxemasida, Slack tarixida yoki muallifning boshida. Har bir shunday savol kichik, lekin ular yig'iladi. Bitta funksiyada beshta noaniq nom bo'lsa, o'quvchi beshta faktni xotirasida ushlab turishi kerak va bulardan birini adashtirish xatoga olib keladi.

Robert Martin *Clean Code* kitobining nomlash haqidagi 2-bobini shunday boshlaydi: nom tanlash vaqt oladi, lekin undan ko'proq vaqtni tejaydi. U oddiy misolni keltiradi: `int d; // elapsed time in days`. Komment bor, lekin `d` ishlatilgan har bir joyda komment yo'q. O'quvchi `d` ni ko'rganda uning ma'nosini o'zi eslab qolishi kerak. Martin buni **mental mapping** deb ataydi: o'quvchi nomni miyasida boshqa, haqiqiy tushunchaga "xaritalashi". Bu ish qanchalik ko'p bo'lsa, kod shunchalik qimmat.

John Ousterhout bundan ham jiddiyroq misolni keltiradi. U ishlagan Sprite operatsion tizimining fayl tizimi kodida `block` degan nom ba'zan diskdagi fizik blok raqamini, ba'zan esa fayl ichidagi mantiqiy blok raqamini anglatgan. Bitta joyda noto'g'ri tushuncha ishlatilgan va natijada boshqa fayllarning ma'lumotlari vaqti-vaqti bilan buzilib turgan. Ousterhout yozishicha, bu xatoni topish juda uzoq vaqt olgan. Kodni o'qigan hech kim xatoni ko'rmagan, chunki nom ikkala ma'noga ham "to'g'ri" ko'rinardi. Bu misolning xulosasi: noaniq nom kosmetik muammo emas, u xato yashirinadigan joy.

## Asosiy g'oya

Martin qoidasi qisqa: **nom niyatni ochishi kerak**. U o'quvchining uchta savoliga javob berishi lozim: bu narsa nega mavjud, nima qiladi va qanday ishlatiladi. Agar nom komment talab qilsa, u o'z vazifasini bajarmagan. `d` o'rniga `elapsedTimeInDays` yoki `daysSinceLastService` yozilsa, komment kerak bo'lmaydi va ma'no har bir ishlatilgan joyda o'quvchi bilan birga yuradi.

Martin buni 2-bobdagi mashhur `getThem` misoli bilan ko'rsatadi. Funksiya ro'yxatni aylanib, birinchi elementi `4` ga teng massivlarni qaytaradi. Kodning o'zi oddiy, unda murakkab algoritm ham, g'alati sintaksis ham yo'q. Lekin kodni o'qib uning maqsadini bilib bo'lmaydi: `theList` nima, `4` nimani anglatadi, natija qayerda ishlatiladi? Martin kodni o'zgartirmasdan, faqat nomlarni almashtirib (`gameBoard`, `FLAGGED`, `getFlaggedCells`) uni o'qiladigan qiladi. Algoritm o'zgarmagan, faqat **noaniqlik** yo'qolgan. Bu muhim kuzatuv: kod oddiy bo'lishi uni tushunarli qilmaydi. Oddiy, lekin noaniq nomlangan kod ham o'quvchidan kontekst talab qiladi.

Steve McConnell *Code Complete*ning o'zgaruvchi nomlariga bag'ishlangan 11-bobida xuddi shu g'oyani boshqa so'zlar bilan aytadi: eng muhim mezon - nom u ifodalayotgan narsani **to'liq va aniq** tasvirlashi. Uning amaliy usuli: o'zgaruvchi nimani anglatishini so'z bilan ayting, va ko'pincha shu jumlaning o'zi eng yaxshi nom bo'ladi. "Joriy oyda bosib o'tilgan masofa, kilometrda" degan jumladan `distanceThisMonthKm` kelib chiqadi.

McConnell yana bir muhim farqni ta'kidlaydi: yaxshi nom **muammoga yo'naltirilgan** bo'ladi. U "nima"ni aytadi, "qanday"ni emas. `inputRecord` qiymat qayerdan kelganini, `bitFlag` qiymat qanday saqlanganini aytadi. `driverProfile` va `isEngineRunning` esa ular biznes nuqtai nazaridan nimani anglatishini. Ikkinchi turdagi nomlar implementatsiya o'zgarganda ham eskirmaydi: ertaga bit flag o'rniga enum ishlatsangiz, `isEngineRunning` baribir to'g'ri bo'lib qoladi.

## Chuqurroq: nom - bu abstraksiya

### Ousterhout: nom tasavvur hosil qiladi

Ousterhout *A Philosophy of Software Design*ning nom tanlash haqidagi 14-bobida nomlarni abstraksiyaning bir turi deb ko'radi. Nom - bu murakkab narsaning soddalashtirilgan ko'rinishi. Yaxshi nom o'quvchi miyasida aniq **tasavvur** (image) hosil qiladi va kodni ochmasdan ham narsaning xatti-harakatini taxmin qilishga imkon beradi. Uning tekshiruv savoli: kimdir faqat shu nomni, deklaratsiya va kontekstsiz ko'rsa, u nimani anglatishini qanchalik yaqin taxmin qiladi?

Ousterhout talabi "uzun" emas, **aniq** (precise) bo'lish. `count`, `result`, `data`, `status` kabi nomlar juda ko'p narsani anglatishi mumkin. Masalan (bu bizning misolimiz), `getCount()` nimaning sonini qaytaradi? Faol foydalanuvchilarmi, barcha yozuvlarmi, sahifadagi elementlarmi? Agar nom ko'p tushunchaga mos kelsa, o'quvchi noto'g'ri tushunchani tanlab olishi mumkin, xuddi Sprite'dagi `block` kabi.

### Nom topish qiyin bo'lsa - bu signal

Ousterhout "Hard to Pick Name" degan qizil bayroqni kiritadi: agar o'zgaruvchi yoki metod uchun aniq va sodda nom topish qiyin bo'lsa, bu ko'pincha dizaynning o'zi aniq emasligini bildiradi. Narsa bitta aniq tushunchani emas, bir nechta aralash tushunchani ifodalayapti. Martin Fowler *Refactoring*da "Mysterious Name" smell'ini muhokama qilganda xuddi shu fikrni aytadi: yaxshi nom o'ylab topa olmasangiz, bu ko'pincha chuqurroq dizayn kasalligi belgisi.

Bu ikki muallif ko'p masalada kelishmaydi, lekin bu yerda fikrlari bir xil. Amaliy xulosa: nom topishga qiynalganda nomni uzaytirishdan oldin **narsaning o'zini** tekshiring. `validateAndSaveAndNotify` degan nom aslida "bu funksiya uchta ish qilyapti" degan e'tirof.

### Martin va Ousterhout farqi

Ikki muallif bir masalada boshqacha urg'u beradi. Martin funksiyalar haqidagi bobda tavsiflovchi nomdan qo'rqmaslikni maslahat beradi: uzun, tavsiflovchi nom qisqa, jumboqli nomdan va uzun kommentdan yaxshiroq. Ousterhout esa aniqlik va izchillikka urg'u beradi, ortiqcha so'zlar nomni og'irlashtirishini aytadi (15-dars) va uzun nom zarurati ba'zan dizayn muammosini yashirishini eslatadi.

Bu ziddiyat emas, ko'proq turli xavflarga qarshi ogohlantirish. Martin kodi `d`, `tmp`, `proc` kabi nomlarga to'la jamoalarga gapiryapti. Ousterhout esa nomlar shunchalik uzunki, kod qatori bitta jumla bo'lib ketgan holatni ham ko'radi. Amaliy qoida: avval aniqlikka erishing. Aniq nom uzun bo'lib chiqsa, bu narsani soddalashtirish kerakligini o'ylab ko'ring. Faqat shundan keyin uzunlikni qabul qiling.

### Kontekst nomning bir qismi

Niyat faqat nomdan emas, uning atrofidan ham o'qiladi: tip, modul nomi, parametr o'rni. `Vehicle` tipidagi `status` maydoni, `fuel` modulidagi `calculateConsumption` funksiyasi yetarlicha aniq. Xuddi shu nomlar `utils.ts` faylida, `any` tipi bilan esa hech narsa aytmaydi. TypeScript tiplari nom bilan birga ishlaydi: `speed: number` noaniq, `speedKmh: number` yaxshiroq, `speed: SpeedKmh` (branded tip, 44-dars) esa birlikni kompilyator darajasida tekshiradi. Kontekst va uzunlik masalasini 15-darsda batafsil ko'ramiz.

## Misol: yoqilg'i hodisalari

Quyidagi kod yoqilg'i sathi datchigi (fuel level sensor) ma'lumotlaridan "shubhali to'kish" hodisalarini topadi:

```ts
type Ev = { vid: string; lvl: number; prev: number; ts: number };

export function check(evs: Ev[], lim: number) {
  const out: Ev[] = [];
  for (const e of evs) {
    const diff = e.prev - e.lvl;
    if (diff > lim && e.ts > Date.now() - 86_400_000) out.push(e);
  }
  return out;
}
```

Har bir nom savol tug'diradi. `check` nimani tekshiradi va nima qaytaradi? `lvl` litrdami, foizdami? `lim` nimaning chegarasi? `86_400_000` nima? `out` qanday hodisalar? Bularni bilish uchun chaqiruvchi kodni o'qish kerak.

```ts
type FuelLevelReading = {
  vehicleId: string;
  levelLiters: number;
  previousLevelLiters: number;
  recordedAtMs: number;
};

const LOOKBACK_WINDOW_MS = 24 * 60 * 60 * 1000;

export function findSuspectedFuelDrains(
  readings: FuelLevelReading[],
  minDropLiters: number,
  nowMs: number = Date.now(),
): FuelLevelReading[] {
  const windowStartMs = nowMs - LOOKBACK_WINDOW_MS;

  return readings.filter((reading) => {
    const dropLiters = reading.previousLevelLiters - reading.levelLiters;
    const isRecent = reading.recordedAtMs > windowStartMs;
    return isRecent && dropLiters > minDropLiters;
  });
}
```

Nima o'zgardi va nima uchun:

- **`check` -> `findSuspectedFuelDrains`.** Funksiya "nima topadi"ni aytadi. "Suspected" so'zi muhim: bu tasdiqlangan o'g'irlik emas, tekshiruv uchun nomzod. Nom biznes ma'nosini noto'g'ri kuchaytirmaydi.
- **Birliklar nomda.** `levelLiters`, `minDropLiters`, `recordedAtMs`. Ertaga datchik foizda ma'lumot bersa, nomlar sizni ogohlantiradi.
- **`86_400_000` -> `LOOKBACK_WINDOW_MS`.** Raqamning hisobi ko'rinadi va ma'nosi (orqaga qarash oynasi) nomlangan (13-dars).
- **`nowMs` parametri.** Bu nomlash emas, lekin niyatni ochadi: funksiya vaqtga bog'liq, test'da buni boshqarish mumkin.
- **`isRecent` va `dropLiters`.** Shartning har bir qismi biznes tushunchasi sifatida nomlandi.

E'tibor bering, biz filter callback'idagi `reading` nomini qisqartirmadik, lekin uni `fuelLevelReadingFromSensor` ham qilmadik. Kontekst (`readings.filter`) qolgan ma'noni beradi.

## Qachon qo'llamaslik kerak

"Har bir nom to'liq niyatni aytsin" qoidasi ham haddan oshirilishi mumkin:

- **Kichik scope'dagi an'anaviy nomlar.** `for (let i = 0; ...)` dagi `i`, `(a, b) => a.priority - b.priority` dagi `a` va `b`, ikki qatorli callback'dagi `p`. Bu nomlarni uzaytirish o'qishni yaxshilamaydi, chunki kontekst ularni to'liq tushuntiradi va an'ana hammaga tanish.
- **Matematik va fizik formulalar.** Masofa formulasida `lat1`, `lon1`, `dLat` yoki Haversine'dagi `a`, `c` ma'lum yozuvga mos keladi. Formulani manba bilan solishtirayotgan o'quvchi uchun an'anaviy belgilar aniqroq. Bunday joyda manbaga havolali komment nomni to'ldiradi.
- **Implementatsiyani oshkor qiluvchi "tavsif".** `getUserFromRedisCacheOrPostgres` niyatni emas, ichki tuzilmani aytadi. Kesh qo'shilsa yoki olib tashlansa, nom yolg'onga aylanadi. Niyat - `getUser`, qolgani implementatsiya detali.
- **Nom bilan dizayn muammosini yopish.** Agar to'g'ri nom uch-to'rt so'zdan oshib ketsa, bu ko'pincha funksiyani bo'lish yoki tushunchani qayta ko'rib chiqish kerakligini bildiradi. Uzun nom bu yerda simptomni davolaydi.
- **Kutubxona va freymvork shartnomalari.** React Query'ning `data`, `error`, Express'ning `req`, `res` nomlari umumiy, lekin hammaga tanish. Ularni o'zgartirish hech narsa bermaydi.

## Stack'da: TypeScript, NestJS, React

- **NestJS service metodlari.** `VehiclesService.process(dto)` hech narsa demaydi. `assignDriver`, `deactivate`, `recordOdometerReading` kabi nomlar controller'ni o'qiganda biznes jarayonini ko'rsatadi.
- **DTO nomlari.** `VehicleDto` qaysi yo'nalish uchun? `CreateVehicleDto`, `UpdateVehicleDto`, `VehicleResponseDto` niyatni (kirish yoki chiqish, qaysi amal) aytadi.
- **React komponent va prop'lar.** `<List items={x} />` o'rniga `<FuelEventsTable events={fuelEvents} />`. Callback prop'larda `onSubmit`, `onVehicleSelect` kabi "nima sodir bo'ldi"ni aytuvchi nomlar, ichki handler'lar uchun `handleVehicleSelect` (16-dars).
- **Next.js route segment'lari.** `app/(dashboard)/vehicles/[vehicleId]/page.tsx` dagi `[vehicleId]` `params.vehicleId` sifatida keladi. `[id]` qisqa, lekin ichma-ich route'larda (`[id]/trips/[id2]`) darhol noaniq bo'ladi.
- **Tiplar nomni to'ldiradi.** `strict` rejimida tip nomga qo'shimcha ma'lumot beradi. `string` emas, `VehicleId`, `number` emas, ma'nosi bor tip yoki birlik bilan nom.

## Xulosa

- Nom o'quvchining uchta savoliga javob beradi: nega bor, nima qiladi, qanday ishlatiladi. Komment talab qiladigan nom vazifasini bajarmagan.
- Muammoga yo'naltirilgan nom "nima"ni aytadi, "qanday"ni emas, shuning uchun implementatsiya o'zgarganda eskirmaydi.
- Ousterhout uchun asosiy talab aniqlik: noaniq nom bir necha tushunchaga mos kelib, xato yashirinadigan joy yaratadi.
- Nom topish qiyinligi dizayn signali. Uni uzun nom bilan yopmang, narsaning o'zini tekshiring.
- Kichik scope, an'anaviy belgilar va freymvork shartnomalari qisqa nomlarni oqlaydi. Kontekst nomning bir qismi.
