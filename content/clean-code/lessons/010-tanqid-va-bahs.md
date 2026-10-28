---
n: 10
slug: tanqid-va-bahs
title: "Clean Code tanqidi: dogmadan qochish"
summary: "Clean Code eng ko'p o'qilgan va eng ko'p tanqid qilingan dasturlash kitoblaridan biri. Bu darsda to'rtta asosiy tanqidni adolatli ko'rib chiqamiz: Ousterhout va Martin munozarasi, qntm'ning 2020 yildagi esse'si, Casey Muratori'ning performance maqolasi va Dan Abramov'ning \"Goodbye, Clean Code\" maqolasi. Maqsad - qoidalarni tashlash emas, ularni qachon qo'llashni bilish."
duration: 40
sources:
  - id: aposd-vs-cc
    note: "2024 yil sentyabr - 2025 yil fevral oralig'idagi yozma munozara: metod uzunligi, kommentlar, PrimeGenerator qayta yozilishi va TDD bo'limlari"
  - id: qntm-clean
    note: "2020 yildagi esse: FitNesse SetupTeardownIncluder misoli, PrimeGenerator, funksiya uzunligi haqidagi maslahat va kitobdagi yaxshi maslahatlar ro'yxati"
  - id: muratori-performance
    note: "2023 yil fevraldagi maqola: shakllar ierarxiyasi, switch va jadval versiyalari, o'lchangan tezlanishlar"
  - id: abramov-goodbye-clean
    note: "2020 yil yanvardagi maqola: resize handle'lar hikoyasi, ijtimoiy va texnik xulosalar"
quiz:
  - q: "Ousterhout va Martin munozarasida ikkalasi ham qaysi fikrga qo'shilgan?"
    options:
      - "Funksiyalar 4 qatordan oshmasligi kerak"
      - "Kommentlar har doim zararli"
      - "Haddan tashqari dekompozitsiya mumkin va Clean Code'ning birinchi nashri uni tanib olish bo'yicha kam yo'l-yo'riq beradi"
      - "TDD yagona to'g'ri usul"
    answer: 2
    explain: "Munozarada ikkalasi ham modulli dizayn qimmatli ekaniga, over-decomposition mumkinligiga va birinchi nashr bu borada kam yo'l-yo'riq berishiga qo'shilgan. Kelishmovchilik qanchalik maydalash kerakligi va \"One Thing\" qoidasi qanchalik ishlashi atrofida qolgan."
  - q: "qntm o'z esse'sida Clean Code'dagi `SetupTeardownIncluder` misolini nima uchun tanqid qiladi?"
    options:
      - "U juda uzun"
      - "U TypeScript'da yozilmagan"
      - "U test qilinmagan"
      - "Kichik private metodlar parametrlar va qaytish qiymatlari o'rniga o'zgaruvchan maydonlar orqali muloqot qiladi, ya'ni Martin o'zi qoralagan yashirin yon ta'sirlarga tayanadi"
    answer: 3
    explain: "qntm'ning asosiy argumenti: kitob yon ta'sirlarni yolg'on deb ataydi, lekin o'z misoli metodlar orasida holatni maydonlar orqali uzatadi va chaqiruvchining obyektini o'zgartiradi. Ya'ni muammo kichik funksiyalarning o'zida emas, ular qanday bog'langanida."
  - q: "Casey Muratori'ning maqolasidagi o'lchovlardan qaysi xulosa eng to'g'ri?"
    options:
      - "Polimorfizm o'rniga switch va keyin jadvalga asoslangan yondashuv uning test misolida bir necha baravardan o'n baravardan ortiq tezlik bergan; bu issiq sikllarda abstraksiya narxi real ekanini ko'rsatadi, lekin har bir kod uchun bir xil xulosa emas"
      - "Clean code har qanday dasturni 15 baravar sekinlashtiradi"
      - "Polimorfizm hech qanday narxga ega emas"
      - "Faqat C++ da abstraksiya qimmat"
    answer: 0
    explain: "Muratori shakl maydonlarini hisoblashda switch bilan taxminan 1.5 baravar, jadval bilan taxminan 10 baravar (burchaklar bilan 15 baravar) tezlanish o'lchagan. Bu CPU'ga bog'liq issiq sikl uchun haqiqiy natija. Uni tarmoq va baza kutayotgan Node.js API'ga to'g'ridan-to'g'ri ko'chirish noto'g'ri."
  - q: "Ousterhout munozarada TDD ga qanday asosiy e'tiroz bildiradi?"
    options:
      - "Unit testlar keraksiz"
      - "TDD juda taktik: kichik qadamlar dizayn haqida o'ylashni rag'batlantirmaydi; u o'rniga \"bundling\" ni (avval dizayn, keyin kattaroq kod bo'lagi, keyin testlar) taklif qiladi"
      - "TDD faqat Java uchun"
      - "Testlarni QA jamoasi yozishi kerak"
    answer: 1
    explain: "Ousterhout unit testlarning kuchli tarafdori ekanini aytadi, lekin TDD'ni taktik dasturlashning ekstremal shakli deb biladi (5-dars). Martin TDD intizomli amaliyotchilar uchun dizaynni to'xtatmasligini aytadi. Bu kelishmovchilik ochiq qolgan."
  - q: "Abramov maqolasidagi asosiy ijtimoiy xulosa qaysi?"
    options:
      - "Kod review'ni bekor qilish kerak"
      - "Faqat senior dasturchi refaktoring qilishi kerak"
      - "Hamkasbning kodini u bilan gaplashmasdan qayta yozish, texnik jihatdan yaxshiroq bo'lsa ham, ishonchni va hamkorlikni buzadi"
      - "Menejerlar kodga aralashmasligi kerak"
    answer: 2
    explain: "Abramov ikki xulosa chiqaradi: texnik (abstraksiya keyingi o'zgarishlarni qiyinlashtirgan bo'lardi) va ijtimoiy (gaplashmasdan qayta yozish). U \"clean code is not a goal\" degan fikr bilan yakunlaydi."
  - q: "Ushbu to'rt tanqiddan keyin Clean Code'ga nisbatan eng oqilona pozitsiya qaysi?"
    options:
      - "Kitobni butunlay tashlash, uning barcha maslahatlari zararli"
      - "Kitobni so'zma-so'z qo'llash, tanqidchilar shunchaki tushunmagan"
      - "Kitobni faqat performance-kritik kodda qo'llash"
      - "Nomlash, yon ta'sirlar, abstraksiya darajalari kabi mustahkam g'oyalarni olish, funksiya uzunligi va kommentlar kabi munozarali qoidalarni maqsad (o'zgartirish narxini pasaytirish) bilan tekshirish"
    answer: 3
    explain: "Hatto qntm ham kitobda vaqt sinovidan o'tgan maslahatlar borligini tan oladi. Muammo qoidalarni dogmaga aylantirishda. Har bir qoida 1-darsdagi asosiy savol bilan tekshirilishi kerak: bu kodni o'zgartirishni osonlashtiradimi?"
task:
  title: "Haddan tashqari maydalangan kodni qayta yig'ish"
  prompt: |
    Quyidagi kod Clean Code'ning "funksiyalar juda kichik bo'lsin" maslahatini so'zma-so'z qo'llagan. Har bir metod 1-3 qator, lekin ular `this` maydonlari orqali bir-biriga bog'langan (qntm va Ousterhout tanqid qilgan naqsh).

    1. Kodni o'qib, `buildInvoice` ni tushunish uchun nechta metodni va qaysi tartibda o'qish kerakligini yozing. Qaysi maydon qaysi metodda o'rnatilib, qaysi birida o'qilishini ko'rsating.
    2. Kodni shunday qayta tuzingki, ma'lumot parametrlar va qaytish qiymatlari orqali oqsin, yashirin holat qolmasin. Ma'noli abstraksiyalar saqlansin, ma'nosizlari yig'ilsin.
    3. Natija bir xil bo'lishi kerak. Yechimingiz Martin yoki Ousterhout tomonida ekanini emas, nima uchun shu tanlovni qilganingizni yozing.
  lang: ts
  starter: |
    type RentalLine = { carPlate: string; days: number; dailyRateUzs: number };
    type Invoice = { lines: { plate: string; amountUzs: number }[]; subtotalUzs: number; vatUzs: number; totalUzs: number };

    export class InvoiceBuilder {
      private lines: RentalLine[] = [];
      private amounts: { plate: string; amountUzs: number }[] = [];
      private subtotal = 0;
      private vat = 0;

      buildInvoice(lines: RentalLine[]): Invoice {
        this.lines = lines;
        this.computeAmounts();
        this.computeSubtotal();
        this.computeVat();
        return this.assemble();
      }

      private computeAmounts(): void {
        this.amounts = this.lines.map((l) => ({ plate: l.carPlate, amountUzs: this.lineAmount(l) }));
      }

      private lineAmount(l: RentalLine): number {
        return l.days * l.dailyRateUzs;
      }

      private computeSubtotal(): void {
        this.subtotal = this.amounts.reduce((s, a) => s + a.amountUzs, 0);
      }

      private computeVat(): void {
        this.vat = Math.round(this.subtotal * 0.12);
      }

      private assemble(): Invoice {
        return { lines: this.amounts, subtotalUzs: this.subtotal, vatUzs: this.vat, totalUzs: this.subtotal + this.vat };
      }
    }
  solution: |
    type RentalLine = { carPlate: string; days: number; dailyRateUzs: number };
    type InvoiceLine = { plate: string; amountUzs: number };
    type Invoice = { lines: InvoiceLine[]; subtotalUzs: number; vatUzs: number; totalUzs: number };

    const VAT_RATE = 0.12;

    export function buildInvoice(rentalLines: RentalLine[]): Invoice {
      const lines = rentalLines.map(toInvoiceLine);
      const subtotalUzs = lines.reduce((sum, line) => sum + line.amountUzs, 0);
      const vatUzs = calculateVat(subtotalUzs);
      return { lines, subtotalUzs, vatUzs, totalUzs: subtotalUzs + vatUzs };
    }

    function toInvoiceLine(line: RentalLine): InvoiceLine {
      return { plate: line.carPlate, amountUzs: line.days * line.dailyRateUzs };
    }

    /** QQS butun so'mgacha yaxlitlanadi. Stavka o'zgarsa, faqat shu yer. */
    export function calculateVat(subtotalUzs: number): number {
      return Math.round(subtotalUzs * VAT_RATE);
    }
  solutionNotes: |
    - Asl kodda `buildInvoice` ni tushunish uchun 6 ta metodni aniq tartibda o'qish kerak edi va 4 ta maydon (`lines`, `amounts`, `subtotal`, `vat`) metodlar o'rtasida yashirin kanal vazifasini bajarardi. Metodlar tartibini almashtirish jimgina noto'g'ri natija berardi: bu Ousterhout'ning "entanglement" tushunchasi.
    - Yangi versiyada ma'lumot qiymatlar orqali oqadi. `buildInvoice` ni yuqoridan pastga o'qib, butun hisob-kitobni ko'rish mumkin.
    - Ikkita abstraksiya saqlandi, chunki ular ma'noli: `toInvoiceLine` (qator qanday hisoblanadi) va `calculateVat` (biznes qoidasi, alohida testlanadi va stavka o'zgarishi bitta joyda).
    - `computeSubtotal` va `assemble` yig'ildi: ular nom ortida hech narsa yashirmagan edi, faqat o'quvchini sakrashga majburlagan.
    - Holatsiz klass oddiy funksiyaga aylandi. Bu Martin'ga ham zid emas: u ham yon ta'sirlarni va chiqish argumentlarini qoralaydi. Bu yerdagi muammo "kichik funksiyalar" da emas, ularning yashirin holat orqali bog'langanida edi.
    - Muhim: bu yechim hozirgi hajmga mos. Agar chegirmalar, valyuta, turli QQS stavkalari qo'shilsa, yangi ma'noli bo'linishlar paydo bo'ladi. Maqsad - eng kichik funksiyalar ham, eng uzun funksiya ham emas, eng kam kognitiv yuk.
  checklist:
    - "Metodlar orasidagi yashirin holat (maydonlar orqali muloqot) yo'qoldi"
    - "Ma'lumot parametr va qaytish qiymatlari orqali oqadi"
    - "Biznes qoidasi (QQS) alohida, nomli va testlanadigan joyda qoldi"
    - "Nom ortida hech narsa yashirmaydigan metodlar yig'ildi"
    - "Natija bir xil kirish uchun oldingisi bilan bir xil"
    - "Tanlov dogma bilan emas, kognitiv yuk va o'zgartirish narxi bilan asoslandi"
---

## Muammo

Robert Martin'ning *Clean Code* kitobi 2008 yilda chiqqan va o'n yildan ortiq vaqt davomida ko'p jamoalarda "birinchi o'qiladigan kitob" bo'lgan. Uning g'oyalari code review izohlariga, linter qoidalariga va intervyu savollariga aylangan. Shu bilan birga, uning ba'zi qoidalari so'zma-so'z qo'llanganda kodni yomonlashtirishi haqida tanqidlar ko'paydi.

Amaliy muammo shunday ko'rinadi: jamoada kimdir "Clean Code'da shunday yozilgan" deb, 30 qatorli tushunarli funksiyani 10 ta 3 qatorli funksiyaga bo'lishni talab qiladi. Boshqasi "Clean Code eskirgan" deb, har qanday tuzilmaga qarshi chiqadi. Ikkala pozitsiya ham dogma. Ularning orasida qolish uchun tanqidlarni bilish va ularni adolatli baholash kerak.

Bu dars Module 1'ning yakuni. Oldingi darslarda ko'rgan asosiy mezon - **o'zgartirish narxi** - bu yerda hakam vazifasini bajaradi.

## Asosiy g'oya

To'rtta tanqid turli tomonlardan keladi va turli narsalarni nishonga oladi:

1. **Ousterhout va Martin munozarasi** - dizayn falsafasi: dekompozitsiya qanchalik chuqur bo'lishi kerak, kommentlar qancha qimmatli, TDD dizaynga yordam beradimi.
2. **qntm esse'si** - kitobning o'z misollari va ba'zi maslahatlarining sifati.
3. **Casey Muratori maqolasi** - ba'zi qoidalarning performance narxi.
4. **Dan Abramov maqolasi** - "toza kod" ga intilishning psixologik va ijtimoiy tomoni.

Ularning hech biri "kod sifati muhim emas" demaydi. Hammasi bir xil maqsadni - tushunarli va o'zgartiriladigan kodni - qo'llab-quvvatlaydi, lekin unga erishish yo'lida Clean Code'ning ba'zi qoidalari ishonchli yo'l ekaniga shubha qiladi.

## Chuqurroq: to'rt tanqid

### Ousterhout va Martin: yozma munozara

John Ousterhout va Robert Martin 2024 yil sentyabridan 2025 yil fevraligacha onlayn va yuzma-yuz suhbatlar o'tkazgan va ularni GitHub'da yozma dialog sifatida e'lon qilgan. Bu tanqidlar ichida eng qimmatlisi, chunki unda ikkala tomon ham o'z so'zlari bilan qatnashadi. Asosiy mavzular quyidagilar.

**Metod uzunligi.** Ousterhout uchun dekompozitsiya "chuqur" modullar yaratganda foydali (52-dars): oddiy interfeys ortida ko'p funksionallik. Haddan tashqari maydalash sayoz interfeyslar va bir-biriga chambarchas bog'langan (entangled) metodlar beradi, ularni alohida tushunib bo'lmaydi. U Clean Code'ning "One Thing" qoidasi va qisqa metodlar haqidagi maslahatida to'xtash nuqtasi yo'qligini tanqid qiladi. Martin esa juda kichik, yaxshi nomlangan metodlarni afzal ko'radi va dekompozitsiya tomoniga xato qilishni ma'qul biladi, chunki keraksiz metodni keyin inline qilish oson. Ular kelishgan nuqtalar: modulli dizayn qimmatli, over-decomposition mumkin, birinchi nashr uni tanib olish bo'yicha kam yo'l-yo'riq beradi. Kelishmagan nuqtalar: qanchalik maydalash kerak va "One Thing" qanchalik ishlaydi.

**Kommentlar.** Ousterhout uchun kommentlar abstraksiya uchun zarur: interfeysni hujjatlash va koddan ko'rinmaydigan ma'lumotni berish. U yo'q kommentlar noto'g'ri kommentlardan ko'ra ko'proq vaqt yo'qotadi deb hisoblaydi. Martin kommentlarni "necessary evil" deb ataydi: ko'pincha ular niyatni kodda ifodalay olmaslik belgisi, u uzun tavsiflovchi nomlarni afzal ko'radi va kod tasdiqlamaydigan kommentlarga ishonmaydi. Bu mavzu 31-darsda batafsil.

**PrimeGenerator.** Munozaraning eng qiziqarli qismi - Clean Code'dagi tub sonlar generatori misolini ikkala muallif ham qayta yozgani. Ikkalasi ham kitobdagi versiyaning ichki dekompozitsiyasi muammoli ekaniga qo'shilgan (Martin uni production kodi emas, o'quv misoli deb tushuntiradi). Ousterhout bitta, ko'p kommentli metod yozgan. Martin o'z versiyasini to'rtta metod va kam komment bilan yozgan. Keyin qiziq voqea bo'lgan: Ousterhout Martin versiyasini o'lchab, u ancha sekinroq ekanini (taxminan 3-4 baravar) topgan, chunki tuzilma o'zgarishi erta chiqishni yo'qotgan. Martin buni tuzatgan. Bu kichik epizod muhim saboq beradi: "toza" qayta yozish xatti-harakatni (bu yerda - performance'ni) jimgina o'zgartirishi mumkin, va ikkala tajribali muallif ham bir-birining kodida xato topgan.

**TDD.** Ousterhout unit testlarning kuchli tarafdori, lekin TDD'ning emas. U TDD'ni haddan tashqari taktik deb biladi (5-dars) va muqobil sifatida "bundling" ni (bu nomni munozarada Martin taklif qilgan, Ousterhout qabul qilgan) qo'llaydi: avval dizayn, keyin kattaroq kod bo'lagi, keyin unit testlar. Martin TDD'ning uch qonuni va red-green-refactor siklini tushuntirib, intizomli amaliyotchilar uchun TDD dizaynni to'xtatmasligini aytadi. Ikkalasi testlar beradigan eng katta foyda - qo'rquvsiz refaktoring ekaniga qo'shiladi. Bu bahs 65-darsda davom etadi.

### qntm: "It's probably time to stop recommending Clean Code"

qntm (yozuvchi va dasturchi) 2020 yilda keng tarqalgan esse e'lon qildi. Uning asosiy argumenti: kitobdagi yaxshi maslahatlar yomon misollar va dogmatik qoidalar bilan aralashgan, va yangi boshlovchi ularni ajrata olmaydi.

Uning eng aniq tanqidlari:

- **FitNesse `SetupTeardownIncluder` misoli.** Kitobda "toza" deb ko'rsatilgan bu kodda ko'p kichik private metodlar parametrlar va qaytish qiymatlari o'rniga o'zgaruvchan maydonlar orqali muloqot qiladi. qntm buni Martin'ning o'z qoidasiga zid deb ko'rsatadi: kitob yon ta'sirlarni qoralaydi, lekin misol metodlar orasidagi yashirin holatga tayanadi va chaqiruvchining obyektini o'zgartiradi.
- **PrimeGenerator.** Algoritm tushunarsiz, metod nomlari g'alati, va kodda `int[]` va `ArrayList<Integer>` sababsiz aralashgan.
- **Funksiya uzunligi.** Kitobning funksiyalar bir necha qatorli bo'lishi kerak degan maslahatini qntm asossiz deb hisoblaydi va Martin bu da'vo uchun tadqiqot keltirmasligini ta'kidlaydi.
- **Boshqa nuqtalar.** Nol argumentli funksiyalar ideali, kitobning Java va OOP'ga qattiq bog'liqligi, ba'zi boblarning eskirganligi.

Adolat uchun: qntm kitobda vaqt sinovidan o'tgan maslahatlar ham borligini tan oladi va ularni sanab o'tadi: abstraksiya darajalarini aralashtirmaslik, tavsiflovchi nomlar, yon ta'sirlardan qochish, chiqish argumentlari o'rniga qaytish qiymati, command-query separation, DRY, tez va mustaqil unit testlar. Uning xulosasi kitobni yangi boshlovchilarga tavsiya qilmaslik. Muqobil sifatida u aniq bitta kitobni tavsiya qilmaydi, lekin o'quvchilar taklif qilgan kitoblar orasida Ousterhout'ning *A Philosophy of Software Design*ini tilga oladi.

E'tibor bering: qntm tanqidining katta qismi birinchi nashrga tegishli. 2025 yilda chiqqan ikkinchi nashr (cc2) ko'p misollarni qayta yozgan. Shunga qaramay, asosiy savol - qoidalarning to'xtash nuqtasi - dolzarb qoladi.

### Casey Muratori: "Clean" Code, Horrible Performance

Casey Muratori (o'yin va past darajali tizim dasturchisi) 2023 yil fevralida performance nuqtai nazaridan tanqid e'lon qildi. U clean code adabiyotidagi klassik misolni oladi: virtual `Area()` metodli bazaviy shakl klassi va kvadrat, to'rtburchak, uchburchak, doira vorislari. Shakllar massivining umumiy maydonini hisoblaydi va turli versiyalarni o'lchaydi:

- Virtual metodlar o'rniga **switch** - taxminan **1.5 baravar** tez.
- Har bir tur uchun koeffitsient **jadvali** (tur ichki tuzilishini "bilish" orqali) - taxminan **10 baravar** tez.
- Burchaklar sonini qo'shganda jadval versiyasi taxminan **15 baravar** tez.
- AVX bilan qo'shimcha optimizatsiya - taxminan 20-25 baravar.

Muratori bu farqlarni bir necha yillik apparat taraqqiyoti bilan solishtiradi va xulosa qiladi: struktura qoidalaridan biri (oddiy ma'nodagi DRY) oqilona, qolganlari (polimorfizm switch o'rniga, ichki tuzilmani bilmaslik, kichik funksiyalar, bitta ish) performance'ga zarar. U qo'llab-quvvatlanuvchanlik maqsadlari to'g'ri, lekin bu qoidalar unga erishishning to'g'ri yo'li emas deb hisoblaydi. U birinchi misolda "funksiyalar kichik bo'lsin" va "bitta ish" qoidalari kam ishlatilganini o'zi tan oladi va ularni to'g'ridan-to'g'ri sinash uchun burchaklar sonini hisoblashni qo'shadi.

Tanqidni to'g'ri baholash:

- **Haqiqiy tomoni.** Issiq sikllarda (millionlab elementlar, CPU'ga bog'liq hisob) virtual chaqiruvlar va xotirada tarqoq obyektlar real narxga ega. Bu performance-aware dasturlashning eski bilimi. Muratori buni aniq raqamlar bilan ko'rsatgan.
- **Chegarasi.** Ko'p veb-backend kodi CPU'ga emas, tarmoq va bazaga bog'liq. Node.js API'da so'rov vaqtining katta qismi PostgreSQL so'rovi va tarmoqqa ketadi, va bitta virtual chaqiruvni switch'ga almashtirish o'lchanadigan farq bermaydi. Knuth'ning mashhur fikri (99-dars) shu yerda: optimizatsiyani o'lchangan issiq joylarga qarating.
- **Qiziq kesishma.** Muratori'ning jadval versiyasi 3-darsdagi transport turlari misoli va 7-darsdagi to'lov komissiyasi misolidagi jadvalga juda o'xshaydi. Ba'zan ma'lumotga asoslangan yondashuv ham tezroq, ham o'qilishi oson.

### Dan Abramov: "Goodbye, Clean Code"

Dan Abramov (React jamoasining sobiq a'zosi) 2020 yil yanvarida qisqa, shaxsiy maqola yozdi. Hikoyani 8-darsda ko'rdik: hamkasbining takroriy, lekin ishlaydigan kodini gaplashmasdan "toza" versiyaga qayta yozgan, boshlig'i esa uni qaytarishni so'ragan.

Bu maqolaning boshqa tanqidlardan farqi - u **dasturchining o'ziga** qaratilgan. Abramov clean code'ga intilishni rivojlanishdagi tabiiy bosqich deb ataydi: takrorni yo'qotish o'lchanadigan yutuq kabi tuyuladi va o'zini qadrlash bilan bog'lanishi mumkin. Uning xulosalari: har bir abstraksiyaning narxi bor, kodni qanday ko'rinishi emas, qanday rivojlanishi uchun optimizatsiya qilish kerak, va jamoa kodi ustida ishlash ishonch talab qiladi. U "iflos kod" ga qaytishni taklif qilmaydi. Uning yakuniy fikri: "Clean code is not a goal."

## Misol: bitta kod, to'rt nigoh

GPS nuqtalari massividan umumiy masofani hisoblaydigan kod "Clean Code uslubida":

```ts
type GpsPoint = { latitude: number; longitude: number };

const EARTH_RADIUS_KM = 6371;

export class RouteDistanceCalculator {
  private totalKm = 0;

  calculate(points: GpsPoint[]): number {
    this.reset();
    this.accumulateSegments(points);
    return this.result();
  }

  private reset(): void {
    this.totalKm = 0;
  }

  private accumulateSegments(points: GpsPoint[]): void {
    for (let i = 1; i < points.length; i++) this.addSegment(points[i - 1], points[i]);
  }

  private addSegment(a: GpsPoint, b: GpsPoint): void {
    this.totalKm += this.haversine(a, b);
  }

  private haversine(a: GpsPoint, b: GpsPoint): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
  }

  private result(): number {
    return this.totalKm;
  }
}
```

To'rt nigoh:

- **qntm va Ousterhout:** `reset`, `accumulateSegments`, `addSegment`, `result` maydon (`totalKm`) orqali bog'langan. `calculate` ni tushunish uchun beshta metodni o'qish kerak. Bundan tashqari, klass holatli bo'lgani uchun bitta instansiyani parallel chaqiruvlarda xavfsiz ishlatib bo'lmaydi.
- **Muratori:** kunlik trek 50-100 ming nuqta bo'lishi mumkin. Har bir segment uchun bir nechta metod chaqiruvi va `toRad` closure'ini qayta yaratish - zamonaviy JS dvigatelida ko'pincha inline qilinadi, lekin bunga ishonch faqat o'lchovdan keladi.
- **Abramov:** bu kodni jamoada kim yozgan va nima uchun? Uni qayta yozishdan oldin muallif bilan gaplashish kerak.
- **Martin himoyasi:** `haversine` ni alohida, nomli funksiya qilish to'g'ri. Bu haqiqiy abstraksiya: formula murakkab, o'zi tushunarli nomga ega va alohida testlanadi.

Muvozanatli versiya:

```ts
type GpsPoint = { latitude: number; longitude: number };

const EARTH_RADIUS_KM = 6371;
const DEG_TO_RAD = Math.PI / 180;

/** Ikki nuqta orasidagi katta doira masofasi (haversine formulasi), km. */
export function haversineKm(a: GpsPoint, b: GpsPoint): number {
  const dLat = (b.latitude - a.latitude) * DEG_TO_RAD;
  const dLon = (b.longitude - a.longitude) * DEG_TO_RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * DEG_TO_RAD) * Math.cos(b.latitude * DEG_TO_RAD) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

export function routeDistanceKm(points: GpsPoint[]): number {
  let totalKm = 0;
  for (let i = 1; i < points.length; i++) {
    totalKm += haversineKm(points[i - 1], points[i]);
  }
  return totalKm;
}
```

Bitta haqiqiy abstraksiya (formula) saqlandi va hujjatlandi. Yashirin holat yo'qoldi. Kod tez va o'qilishi oson. Bu "Martin yutdi" ham, "Ousterhout yutdi" ham emas: bu ikkalasining kelishgan nuqtalari (yon ta'sirsiz, nomli, chuqur abstraksiya) asosida qurilgan.

## Qachon qo'llamaslik kerak

Bu darsda "qachon qo'llamaslik kerak" savoli tanqidlarning o'ziga tegishli:

- **Tanqidni dogmaga aylantirish.** "Clean Code eskirgan" degan gapni har qanday tuzilmaga qarshi argument sifatida ishlatish xuddi so'zma-so'z qo'llash kabi dogma. qntm ham, Abramov ham kod sifatiga qarshi emas.
- **Muratori xulosalarini kontekstsiz ko'chirish.** CPU'ga bog'liq issiq sikl uchun to'g'ri bo'lgan narsa I/O'ga bog'liq API uchun to'g'ri emas. Performance qarorlarini profiler bilan qiling.
- **Ousterhout'ni "uzun funksiya yozish" deb tushunish.** Ousterhout uzun funksiyani maqsad qilmaydi. Uning mezoni - chuqur abstraksiya va chigallik yo'qligi. Uzun va chigal funksiya ham uning mezoni bo'yicha yomon.
- **Birinchi nashr tanqidini ikkinchisiga avtomatik ko'chirish.** Ikkinchi nashr ko'p misollarni yangilagan. Konkret da'vo qilishdan oldin qaysi nashr haqida gapirayotganingizni aniqlang.
- **Abramov xulosasini refaktoringdan voz kechish deb tushunish.** Uning gapi - gaplashmasdan va maqsadsiz qayta yozmaslik. Kelishilgan, maqsadli refaktoring (6-dars) bunga zid emas.

## Stack'da: jamoada qanday qo'llash

- **Code review'da kitobga emas, maqsadga tayaning.** "Clean Code'da shunday deyilgan" o'rniga "bu o'zgarish keyingi vazifani qanday osonlashtiradi?" deb so'rang. Google'ning code review qo'llanmasi ham reviewer'dan shaxsiy did emas, kod sog'lig'i mezonini kutadi (96-dars).
- **Lint qoidalarini ehtiyotkorlik bilan tanlang.** ESLint'dagi `max-lines-per-function` yoki `max-statements` kabi qoidalar qntm va Ousterhout tanqid qilgan "kichik funksiya" dogmasini avtomatlashtirishi mumkin. Agar ishlatsangiz, chegarani yuqori qo'ying va uni signal sifatida, qat'iy taqiq sifatida emas ko'ring.
- **Node.js'da performance.** Avval `--prof`, `clinic.js` yoki APM bilan o'lchang. Issiq sikl topilsa (masalan, GPS treklarini qayta ishlash, katta CSV parse), u yerda Muratori uslubidagi ma'lumotga yo'naltirilgan yondashuv o'zini oqlashi mumkin. Qolgan joyda o'qiluvchanlik ustun.
- **React'da.** "Har bir komponent bitta ish qilsin" dogmasi ko'p mayda komponentlar va prop drilling beradi. React hujjatlaridagi "Thinking in React" komponent chegaralarini UI va ma'lumot tuzilmasi bo'yicha belgilashni taklif qiladi (92-dars).
- **Jamoa kelishuvi.** Abramov maslahati bo'yicha: "toza kod" ning jamoa uchun aniq ma'nosini yozib qo'ying (masalan, qisqa ADR yoki CONTRIBUTING.md'da), shunda bahslar did emas, kelishuv atrofida bo'ladi (39-dars).

## Xulosa

- Ousterhout va Martin munozarasi dekompozitsiya, kommentlar va TDD bo'yicha haqiqiy kelishmovchiliklarni ko'rsatadi, lekin over-decomposition mumkinligiga ikkalasi ham qo'shiladi.
- qntm kitobning o'z misollari uning qoidalariga zid ekanini ko'rsatadi, shu bilan birga undagi mustahkam maslahatlarni ham tan oladi.
- Muratori issiq sikllarda abstraksiyaning real narxini o'lchagan. Xulosani faqat shunday kontekstga qo'llang va har doim profiler bilan tekshiring.
- Abramov eslatadi: clean code maqsad emas, abstraksiyaning narxi bor, va jamoa kodi - ijtimoiy kelishuv.
- Har bir qoidani Module 1'ning asosiy savoli bilan tekshiring: bu kodni tushunish va o'zgartirishni osonlashtiradimi?
