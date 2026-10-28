---
n: 2
slug: kod-oqish-narxi
title: "Kodni o'qish narxi va kognitiv yuk"
summary: "Dasturchi vaqtining katta qismi kod yozishga emas, uni o'qishga ketadi. Bu darsda o'qish narxi qayerdan kelishini, kognitiv yuk nima ekanini va uni qanday kamaytirishni ko'ramiz: nomlar, tiplar, lokallik va o'quvchi boshida ushlab turishi kerak bo'lgan narsalar soni."
duration: 35
sources:
  - id: cc1
    note: "1-bob \"Clean Code\", \"We Are Authors\" bo'limi: o'qish va yozish nisbati haqidagi kuzatuv"
  - id: aposd
    note: "2-bob \"The Nature of Complexity\": cognitive load, change amplification va unknown unknowns belgilari"
  - id: code-complete
    note: "Dizayn va murakkablikni boshqarish haqidagi boblar: inson aqlining cheklangan sig'imi va o'qiluvchanlik"
quiz:
  - q: "Ousterhout ta'rifiga ko'ra, quyidagilardan qaysi biri \"cognitive load\" belgisiga eng aniq misol?"
    options:
      - "Funksiya 80 qatordan iborat"
      - "Funksiyani to'g'ri chaqirish uchun dasturchi u global konfiguratsiyadagi uchta bayroqqa bog'liqligini va chaqiruvdan oldin keshni tozalash kerakligini bilishi shart"
      - "Funksiya O(n log n) vaqtda ishlaydi"
      - "Funksiya uchta faylda import qilingan"
    answer: 1
    explain: "Cognitive load - vazifani bajarish uchun dasturchi bilishi va boshida ushlab turishi kerak bo'lgan ma'lumot miqdori. Yashirin bayroqlar va chaqiruv tartibi aynan shunday yuk. Qatorlar soni faqat ba'zan bunga olib keladi, Big-O esa umuman boshqa o'lchov."
  - q: "Jamoa \"kodni qisqartirish\" uchun barcha o'zgaruvchilarni bir-ikki harfli qildi va qatorlar soni 30% kamaydi. O'qish narxi haqida nima deyish mumkin?"
    options:
      - "O'qish narxi kamaydi, chunki o'qiladigan matn qisqardi"
      - "O'zgarish yo'q, nomlar faqat kosmetika"
      - "Faqat yangi dasturchilar uchun narx oshdi, tajribalilar uchun kamaydi"
      - "Ko'pincha narx oshadi: o'quvchi har bir qisqa nomning ma'nosini kontekstdan tiklab, boshida ushlab turishi kerak"
    answer: 3
    explain: "Kognitiv yuk belgilar soni bilan emas, o'quvchi tiklashi va eslab qolishi kerak bo'lgan ma'lumot bilan o'lchanadi. Qisqa, lekin ma'nosiz nomlar bu yukni o'quvchiga o'tkazadi. Kichik scope'dagi `i` kabi istisnolar bor, lekin umumiy qoida shu."
  - q: "Quyidagi holatlardan qaysi biri \"unknown unknowns\" ga misol?"
    options:
      - "Yangi maydon qo'shilganda uni yana bitta joyda (eksport moduli) yangilash kerakligini kod hech qanday tarzda ko'rsatmaydi va buni faqat production'dagi xato ochib beradi"
      - "Funksiya nomi juda uzun"
      - "Dasturchi TypeScript generiklarini yaxshi bilmaydi"
      - "Testlar sekin ishlaydi"
    answer: 0
    explain: "Unknown unknowns - nimani bilmasligingizni ham bilmaysiz. O'zgarish uchun qaysi joylarga tegish kerakligi koddan ko'rinmaydi. Ousterhout buni uchta belgidan eng xavflisi deydi, chunki uni hatto ehtiyotkor dasturchi ham sezmaydi."
  - q: "Nima uchun `strict` TypeScript va aniq tiplar o'qish narxini kamaytiradi, garchi kod qatorlari ko'paysa ham?"
    options:
      - "Chunki kompilyator kodni tezroq ishlatadi"
      - "Chunki tiplar linter qoidalarini o'chiradi"
      - "Chunki tip o'quvchi aks holda chaqiruvchi kod, bazaning sxemasi yoki muallifdan so'rab bilib olishi kerak bo'lgan savollarga javobni shu joyning o'zida beradi"
      - "Chunki tiplar kodni qisqaroq qiladi"
    answer: 2
    explain: "Tip - bu lokal hujjat. U o'quvchini boshqa joylarga sakrashdan qutqaradi va ma'lumot shaklini boshida ushlab turish ehtiyojini kamaytiradi. Runtime tezligiga tiplar ta'sir qilmaydi."
  - q: "Funksiyani 15 ta 3 qatorli yordamchi funksiyaga bo'lgandan keyin jamoa o'qish qiyinlashganidan shikoyat qildi. Eng ehtimolli sabab nima?"
    options:
      - "Yordamchi funksiyalar yetarlicha qisqa emas"
      - "Bo'lish o'quvchini ko'p joylarga sakrashga va har bir yordamchining nimaga bog'liqligini bir vaqtda eslab qolishga majbur qildi, ya'ni lokallik yo'qoldi"
      - "Funksiyalar alfavit tartibida joylashtirilmagan"
      - "Jamoa clean code'ni bilmaydi"
    answer: 1
    explain: "Bo'lish o'z-o'zidan yukni kamaytirmaydi. Agar yordamchilar bir-biriga chambarchas bog'liq bo'lsa, o'quvchi baribir hammasini bir vaqtda boshida ushlashi kerak, lekin endi ular turli joyda. Bu 21-darsdagi Martin va Ousterhout bahsining markaziy nuqtasi."
task:
  title: "GPS trek tahlilchisining kognitiv yukini kamaytirish"
  prompt: |
    Quyidagi funksiya transport parkidagi avtomobilning bir kunlik GPS nuqtalaridan to'xtashlar ro'yxatini hisoblaydi. U ishlaydi, lekin uni o'qish uchun o'quvchi juda ko'p narsani boshida ushlab turishi kerak.

    1. Kodni o'zgartirmasdan, uni tushunish uchun boshida ushlab turishingiz kerak bo'lgan narsalarni ro'yxat qiling (masalan: `m` nima, `5` nima, `fl` qachon o'zgaradi).
    2. Xatti-harakatni o'zgartirmasdan kodni qayta yozing: ro'yxatdagi har bir bandni koddan o'qib olinadigan qiling.
    3. Funksiyani haddan tashqari maydalamang. Maqsad - qatorlar soni emas, o'quvchi ushlab turishi kerak bo'lgan narsalar soni.
  lang: ts
  starter: |
    type P = { t: number; s: number; la: number; lo: number };

    export function stops(pts: P[], m = 5) {
      const res: { a: number; b: number; la: number; lo: number }[] = [];
      let st = -1;
      let fl = false;
      for (let i = 0; i < pts.length; i++) {
        if (pts[i].s < 3) {
          if (!fl) {
            st = i;
            fl = true;
          }
        } else {
          if (fl) {
            if ((pts[i - 1].t - pts[st].t) / 60000 >= m) {
              res.push({ a: pts[st].t, b: pts[i - 1].t, la: pts[st].la, lo: pts[st].lo });
            }
            fl = false;
          }
        }
      }
      if (fl && (pts[pts.length - 1].t - pts[st].t) / 60000 >= m) {
        res.push({ a: pts[st].t, b: pts[pts.length - 1].t, la: pts[st].la, lo: pts[st].lo });
      }
      return res;
    }
  solution: |
    type GpsPoint = {
      timestampMs: number;
      speedKmh: number;
      latitude: number;
      longitude: number;
    };

    type Stop = {
      startedAtMs: number;
      endedAtMs: number;
      latitude: number;
      longitude: number;
    };

    /** Bu tezlikdan past bo'lsa, avtomobil turgan deb hisoblanadi (GPS shovqini sababli 0 emas). */
    const STATIONARY_SPEED_KMH = 3;
    const MS_PER_MINUTE = 60_000;

    export function detectStops(points: GpsPoint[], minStopMinutes = 5): Stop[] {
      const stops: Stop[] = [];
      let stopStart: GpsPoint | null = null;
      let lastStationary: GpsPoint | null = null;

      const closeStop = () => {
        if (stopStart && lastStationary) {
          const durationMin = (lastStationary.timestampMs - stopStart.timestampMs) / MS_PER_MINUTE;
          if (durationMin >= minStopMinutes) {
            stops.push({
              startedAtMs: stopStart.timestampMs,
              endedAtMs: lastStationary.timestampMs,
              latitude: stopStart.latitude,
              longitude: stopStart.longitude,
            });
          }
        }
        stopStart = null;
        lastStationary = null;
      };

      for (const point of points) {
        if (point.speedKmh < STATIONARY_SPEED_KMH) {
          stopStart ??= point;
          lastStationary = point;
        } else {
          closeStop();
        }
      }
      closeStop();

      return stops;
    }
  solutionNotes: |
    - `fl` va `st = -1` juftligi (ikkita bir-biriga bog'liq holat) bitta `stopStart: GpsPoint | null` ga aylandi. O'quvchi endi "fl true bo'lsa st to'g'ri qiymatga egami?" degan invariantni eslab qolishi shart emas.
    - `pts[i - 1]` indeks arifmetikasi o'rniga `lastStationary` nomli o'zgaruvchi: "to'xtashning oxirgi nuqtasi" endi so'z bilan aytilgan.
    - Takrorlangan yopish mantig'i (sikl ichida va sikldan keyin) bitta `closeStop` ichida. Bu takrorni yo'qotish emas, birinchi navbatda o'quvchi ikkala nusxa bir xilmi yoki farq qiladimi deb solishtirishiga hojat qolmasligi uchun.
    - `3` va `60000` nomlandi, `3` ga esa nega 0 emasligini tushuntiruvchi komment berildi: bu koddan o'qib bo'lmaydigan ma'lumot.
    - Funksiya bitta qoldi: yopish mantig'i lokal closure, chunki u faqat shu sikl uchun ma'noli va alohida eksport qilinsa, o'quvchi uni topish uchun sakrashi kerak bo'ladi.
    - Natija tipi `Stop` nomlandi, chaqiruvchi tomonda `a` va `b` endi `startedAtMs` va `endedAtMs`.
  checklist:
    - "Bir-biriga bog'liq ikki holat o'zgaruvchisi bitta nullable holatga birlashdi"
    - "Indeks arifmetikasi (i - 1, length - 1) nomli o'zgaruvchilar bilan almashtirildi"
    - "Magic number'lar nomlandi, koddan ko'rinmaydigan sabab komment bilan berildi"
    - "Takroriy yopish mantig'i bitta joyda"
    - "Eski va yangi funksiya bir xil kirish uchun bir xil to'xtashlarni qaytaradi"
---

## Muammo

Tasavvur qiling: dushanba kuni ertalab sizga "yoqilg'i quyish hodisalarini aniqlash noto'g'ri ishlayapti, ba'zi quyishlar o'g'irlik deb belgilanyapti" degan tiket keldi. Tuzatish bitta qator bo'lib chiqadi. Lekin unga yetib borish uchun siz uch soat sarfladingiz: datchik ma'lumoti qayerdan kelishini topdingiz, `normalize` funksiyasi nimani normallashtirishini tushundingiz, `threshold` qaysi birlikda ekanini (litrmi, foizmi) chaqiruvchi koddan qidirdingiz va oxirida `isRefuel` bayrog'i aslida teskari ma'noda ishlatilganini ko'rdingiz.

Uch soatning deyarli hammasi o'qishga ketdi. Yozish bir daqiqa. Bu istisno emas, kundalik ish shunday ko'rinadi. Shuning uchun kod sifatini muhokama qilganda eng amaliy savol: **bu kodni o'qish qancha turadi?**

Bu narx ko'rinmaydi. U sprint hisobotida "o'qish" degan qator sifatida chiqmaydi. U "kichik tuzatish uchun nega ikki kun ketdi?" degan savol shaklida, yangi xodimning bir oy davomida mustaqil ishlay olmasligi shaklida va code review'da muhim xatoning ko'zdan qochishi shaklida namoyon bo'ladi.

## Asosiy g'oya

Robert Martin *Clean Code* kitobining birinchi bobida dasturchi ishini kuzatib, muhim xulosaga keladi: yangi kod yozayotganda ham biz vaqtning ko'p qismini mavjud kodni o'qishga sarflaymiz. U o'qish va yozish nisbatini 10 ga 1 dan ancha yuqori deb baholaydi. Bu o'lchangan statistika emas, muallifning tajribaviy bahosi, va aniq raqam munozarali. Lekin yo'nalish shubhasiz: yangi qatorni qo'shishdan oldin siz atrofdagi kodni, chaqiruvchilarni va tiplarni o'qiysiz. Demak, **o'qishni arzonlashtirish yozishni ham arzonlashtiradi**.

John Ousterhout *A Philosophy of Software Design* kitobining ikkinchi bobida bu narxning tuzilishini aniqroq beradi. U murakkablikning uchta belgisini ajratadi:

1. **Change amplification** (o'zgarishning kuchayishi): oddiy ko'ringan o'zgarish ko'p joyga tegishni talab qiladi.
2. **Cognitive load** (kognitiv yuk): vazifani bajarish uchun dasturchi qancha narsani bilishi va boshida ushlab turishi kerak.
3. **Unknown unknowns** (noma'lum noma'lumlar): o'zgarish uchun qaysi joyga tegish kerakligi yoki qanday ma'lumot kerakligi umuman ko'rinmaydi.

Bu darsning markazida ikkinchisi turadi, lekin uchala belgi bir-biriga bog'liq. Kognitiv yuk o'qish narxining asosiy tarkibiy qismi: o'quvchi tiklashi, topishi va eslab qolishi kerak bo'lgan har bir narsa vaqt va xato ehtimoli qo'shadi.

Steve McConnell *Code Complete*da bir xil g'oyaga boshqa tomondan keladi. Uning fikricha, dasturiy ta'minotning asosiy texnik vazifasi - murakkablikni boshqarish, chunki inson aqli bir vaqtning o'zida faqat cheklangan miqdordagi detalni ushlay oladi. Yaxshi dizayn shuni ta'minlaydiki, istalgan paytda dasturchi tizimning kichik bir qismi haqida o'ylashi yetarli bo'lsin, qolganini esa xavfsiz "unutishi" mumkin bo'lsin.

## Chuqurroq: kognitiv yuk qayerdan keladi

### Ishchi xotira cheklangan

Kognitiv psixologiyada ishchi xotira sig'imi kichik ekani yaxshi ma'lum: odam bir vaqtda bir necha elementni ushlab tura oladi, undan ortig'i "tushib qoladi". Aniq raqam haqida tadqiqotchilar bahslashadi, lekin dasturchi uchun xulosa bir xil: agar funksiyani tushunish uchun bir vaqtda yetti-sakkiz narsani eslab qolish kerak bo'lsa (uchta bayroq qiymati, ikkita indeks, bitta birlik, bitta yashirin shart), o'quvchi xato qiladi yoki qayta-qayta o'qiydi.

Kod o'qishda boshida ushlab turiladigan narsalarga misollar:

- **Qisqartmalar va ma'nosiz nomlar.** `d`, `tmp`, `data2`. O'quvchi har birining ma'nosini kontekstdan tiklaydi va eslab qoladi.
- **Bog'liq holatlar.** `isLoading`, `hasError`, `data` uchta alohida o'zgaruvchi bo'lsa, o'quvchi qaysi kombinatsiyalar mumkin ekanini o'zi bilishi kerak.
- **Yashirin birliklar.** `timeout = 30` - soniyami, millisekundmi? `distance` - metrmi, kilometrmi?
- **Ichma-ichlik.** To'rtinchi darajadagi `if` ichida o'quvchi yuqoridagi uchta shartni ham eslab turadi. SonarSource'ning *Cognitive Complexity* metrikasi aynan shuni hisobga oladi: u ichma-ichlik uchun qo'shimcha "jarima" beradi (97-dars).
- **Masofa.** O'zgaruvchi 60 qator yuqorida e'lon qilinib, pastda ishlatilsa, o'quvchi uni o'sha masofa davomida eslab turadi.

### Lokallik

Kognitiv yukni kamaytirishning eng samarali usuli - **lokallik**: savolga javob savol tug'ilgan joyda bo'lsin. Tip shu joyda ko'rinsa, chaqiruvchi kodga borish shart emas. Konstanta nomi biznes qoidasini aytsa, hujjatni qidirish shart emas. Bog'liq kod bir joyda tursa, fayllar o'rtasida sakrash shart emas.

Bu yerda nozik nuqta bor: lokallik va dekompozitsiya ba'zan bir-biriga zid. Kodni kichik funksiyalarga bo'lish ma'lumotni nom ortiga yashiradi va bu yaxshi, agar o'quvchiga ichini bilish kerak bo'lmasa. Lekin agar funksiyalar bir-biriga chambarchas bog'liq bo'lsa (biri ikkinchisi o'rnatgan holatga tayansa), o'quvchi baribir hammasini o'qishi kerak, faqat endi ular turli joyda. Ousterhout buni "entanglement" (chigallik) deb ataydi va bu Martin bilan bahsining asosiy mavzularidan biri bo'lgan (21-dars).

### Ko'rinmaslik: eng qimmat yuk

Ousterhout murakkablikning ikki sababini ko'rsatadi: **dependencies** (bog'liqliklar) va **obscurity** (noaniqlik). Noaniqlik - muhim ma'lumot ko'rinmasligi. U "unknown unknowns" ni keltirib chiqaradi va o'qish narxining eng xavfli qismi shu: o'quvchi kodni diqqat bilan o'qib chiqadi, hammasini tushunganiga ishonadi, lekin muhim narsa koddan umuman ko'rinmaydi. Masalan, yangi `VehicleType` qo'shilganda hisobot modulidagi `switch`ni ham yangilash kerakligi. Bunday holatni TypeScript'da exhaustive `switch` (27-dars) yoki to'g'ri joylashtirilgan komment ko'rinadigan qiladi.

### O'quvchi kim?

O'qish narxi o'quvchiga bog'liq. Domen tilini biladigan, kod bazasida ikki yil ishlagan dasturchi uchun `odo` "odometr" ekani aniq. Yangi xodim uchun emas. Ousterhoutning muhim kuzatuvi: murakkablikni yozuvchi emas, o'quvchi sezadi. Siz yozgan kod sizga oddiy ko'rinishi tabiiy, chunki uning konteksti hozir boshingizda. Shuning uchun o'qish narxini baholashning eng yaxshi usuli - kodni boshqa odamga ko'rsatish. Code review'da "bu nima?" degan savol - xato emas, o'lchov.

## Misol: yoqilg'i quyishni aniqlash

Quyidagi funksiya yoqilg'i datchigi (DUT) ko'rsatkichlaridan quyish hodisalarini topadi:

```ts
export function chk(r: number[], c: number, f = true) {
  const out: number[] = [];
  for (let i = 1; i < r.length; i++) {
    const d = r[i] - r[i - 1];
    if (f ? d > c : d > c * 0.5) {
      if (out.length === 0 || i - out[out.length - 1] > 10) out.push(i);
    }
  }
  return out;
}
```

O'quvchi boshida ushlab turishi kerak bo'lgan narsalar: `r` nima (litr yoki foiz)? `c` qaysi birlikda? `f` nima va nega `false` bo'lganda chegara yarmiga tushadi? `10` nima, nuqtalar sonimi yoki soniyalarmi? `out` indekslarni qaytaradi, vaqtni emas, buni chaqiruvchi bilishi kerak. Bu yettita savol, va ularning birortasiga ham kodning o'zi javob bermaydi.

Xuddi shu xatti-harakat:

```ts run
type FuelReading = { timestampMs: number; liters: number };

type RefuelThresholds = {
  /** Shu litrdan ko'p ko'tarilish quyish hisoblanadi. */
  minRiseLiters: number;
  /** Bir quyish hodisasi ichidagi ko'rsatkichlar orasidagi minimal nuqtalar soni. */
  minReadingsBetweenEvents: number;
};

const DEFAULT_THRESHOLDS: RefuelThresholds = {
  minRiseLiters: 20,
  minReadingsBetweenEvents: 10,
};

export function findRefuelIndexes(
  readings: FuelReading[],
  thresholds: RefuelThresholds = DEFAULT_THRESHOLDS,
): number[] {
  const refuelIndexes: number[] = [];

  for (let i = 1; i < readings.length; i++) {
    const rise = readings[i].liters - readings[i - 1].liters;
    if (rise <= thresholds.minRiseLiters) continue;

    const lastIndex = refuelIndexes.at(-1);
    const isSameEvent =
      lastIndex !== undefined && i - lastIndex <= thresholds.minReadingsBetweenEvents;
    if (!isSameEvent) refuelIndexes.push(i);
  }

  return refuelIndexes;
}

// Sinab ko'ring: litr qiymatlarini yoki chegaralarni o'zgartiring.
const liters = [30, 29, 60, 85, 84, 83, 120];
const readings: FuelReading[] = liters.map((l, i) => ({ timestampMs: i * 60_000, liters: l }));
console.log(findRefuelIndexes(readings));
console.log(findRefuelIndexes(readings, { minRiseLiters: 20, minReadingsBetweenEvents: 2 }));
```

Nima o'zgardi va nima uchun:

- **Birlik tipda.** `liters` maydon nomi "foiz yoki litr?" savolini yopadi.
- **`f` bayrog'i olib tashlandi.** U chegarani yashirin ravishda yarmiga tushirardi. Endi chaqiruvchi kerakli chegarani o'zi beradi. Ikki xil rejim kerak bo'lsa, u ikki xil `RefuelThresholds` obyekti sifatida nom bilan ifodalanadi. Boolean argumentlar haqida 23-darsda batafsil.
- **`10` nomlandi va hujjatlandi.** Komment nima uchun bu qiymat kerakligini aytadi: bu koddan o'qib bo'lmaydigan ma'lumot.
- **`continue` bilan ichma-ichlik kamaydi.** O'quvchi ikki darajali shartni emas, ketma-ket ikkita oddiy shartni o'qiydi.
- **`isSameEvent` tushuntiruvchi o'zgaruvchi.** Murakkab shart nom oldi, o'quvchi uni hisoblashi emas, o'qishi kifoya.

Kod uzunroq bo'ldi. Lekin o'quvchi endi hech narsani tiklashi yoki eslab qolishi shart emas: har bir savolning javobi shu faylda. Bu holatda qatorlar soni yomon o'lchov.

## Qachon qo'llamaslik kerak

- **Juda kichik scope.** `for (let i = 0; ...)` uch qatorli siklda `i` ni `readingIndex` deb atash yukni kamaytirmaydi, balki shovqin qo'shadi. Nom uzunligi scope'ga mos bo'lishi kerak (15-dars).
- **Domen konvensiyalari.** Matematik yoki geometrik kodda `lat`, `lng`, `dx`, `dy` hammaga ma'lum. Ularni "to'liq" nomlarga almashtirish formulani o'qishni qiyinlashtiradi.
- **Tushuntirishni haddan oshirish.** Har bir qatorga komment yoki har bir shartga alohida o'zgaruvchi qo'shish o'quvchiga ko'proq matn beradi, kamroq ma'lumot emas. Maqsad - o'quvchi ushlab turishi kerak bo'lgan narsalarni kamaytirish, matnni ko'paytirish emas.
- **"O'qilishi oson" subyektiv bo'lib qolganda.** Jamoada bitta odamga tushunarli uslub boshqasiga noqulay bo'lishi mumkin. Bunday bahslarda shaxsiy did emas, jamoa kelishuvi va avtomatlashtirilgan vositalar (Prettier, ESLint) hal qiladi (36-37-darslar).
- **Performance-kritik joylar.** Juda kam hollarda o'qiluvchanlikdan voz kechish oqlanadi, lekin faqat o'lchov bilan va izohlangan holda (99-dars).

## Stack'da: TypeScript, NestJS, React

- **TypeScript tiplari - lokal hujjat.** `function update(id: string, patch: Partial<Vehicle>)` o'quvchiga bazaning sxemasini ochishga hojat qoldirmaydi. `any` va `as` esa aksincha, barcha savollarni o'quvchiga qaytaradi.
- **Discriminated union bog'liq holatlarni yo'qotadi.** React'da `isLoading`, `error`, `data` uchta alohida `useState` o'rniga `{ status: "loading" } | { status: "error"; error: Error } | { status: "success"; data: Trip[] }` - o'quvchi qaysi kombinatsiyalar mumkinligini tip orqali biladi (45-dars).
- **NestJS'dagi yashirin bog'liqliklar.** Global interceptor yoki guard so'rov kontekstini o'zgartirsa, controller'ni o'qigan odam buni ko'rmaydi. Bu "unknown unknowns" ning klassik manbai. Bunday xatti-harakat dekorator orqali controller'da ko'rinadigan qilinsa, o'qish narxi pasayadi.
- **React hook'lari ichidagi effektlar.** `useEffect` ichida boshqa state'ni sinxronlash zanjirlari o'quvchini render tartibini boshida simulyatsiya qilishga majbur qiladi. React hujjatlari bunday effektlarning ko'pini keraksiz deb hisoblaydi (92-dars).

## Xulosa

- Dasturchi vaqtining katta qismi o'qishga ketadi, shuning uchun o'qishni arzonlashtirish yozishni ham tezlashtiradi.
- Ousterhout murakkablikning uchta belgisini beradi: change amplification, cognitive load va unknown unknowns. Oxirgisi eng xavflisi.
- Kognitiv yuk - o'quvchi tiklashi va eslab qolishi kerak bo'lgan narsalar soni, qatorlar yoki belgilar soni emas.
- Lokallik eng arzon dori: savolga javob savol tug'ilgan joyda bo'lsin (tiplar, nomli konstantalar, bog'liq kodni bir joyda saqlash).
- Murakkablikni o'quvchi sezadi. O'qish narxini o'lchashning eng yaxshi usuli - kodni boshqa odamga o'qitish.
