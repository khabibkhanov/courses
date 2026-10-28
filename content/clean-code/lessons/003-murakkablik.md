---
n: 3
slug: murakkablik
title: "Murakkablik: belgilari va sabablari"
summary: "Murakkablik birdaniga paydo bo'lmaydi, u yuzlab kichik qarorlardan yig'iladi. Bu darsda Ousterhout modeli bo'yicha murakkablikning belgilari (change amplification, cognitive load, unknown unknowns) va ikki sababini (dependencies, obscurity) ko'ramiz, McConnell va Brooks'ning essential va accidental murakkablik farqi bilan bog'laymiz."
duration: 35
sources:
  - id: aposd
    note: "2-bob \"The Nature of Complexity\": ta'rif, uchta belgi, ikki sabab, murakkablikning inkremental tabiati"
  - id: code-complete
    note: "Konstruksiyada dizayn haqidagi bob: murakkablikni boshqarish asosiy texnik vazifa sifatida, essential va accidental qiyinchiliklar (Brooks'ga tayangan holda)"
quiz:
  - q: "Ousterhout bo'yicha tizimning umumiy murakkabligini baholashda qaysi qism eng ko'p vazn oladi?"
    options:
      - "Eng ko'p qatorli modul"
      - "Eng eski modul"
      - "Dasturchilar eng ko'p vaqt sarflaydigan qism, chunki har bir qismning murakkabligi unga sarflangan vaqt ulushiga ko'paytiriladi"
      - "Eng ko'p dependency'ga ega bo'lgan tashqi kutubxona"
    answer: 2
    explain: "Ousterhout murakkablikni har bir qism murakkabligining dasturchilar u bilan ishlashga sarflaydigan vaqt ulushiga ko'paytmasi yig'indisi sifatida tasvirlaydi. Hech kim tegmaydigan, yaxshi yashirilgan murakkab kod umumiy murakkablikka kam hissa qo'shadi."
  - q: "Jamoa har bir yangi to'lov provayderini qo'shganda 7 ta faylni o'zgartiradi: enum, ikki xil switch, konfiguratsiya, hisobot, admin panel va migratsiya. Bu qaysi belgi?"
    options:
      - "Change amplification"
      - "Cognitive load"
      - "Performance degradation"
      - "Accidental duplication"
    answer: 0
    explain: "Bitta mantiqiy o'zgarish ko'p joyga tegishni talab qilishi - change amplification. Agar bu 7 joydan birortasi koddan ko'rinmasa, bu qo'shimcha ravishda unknown unknowns ham bo'ladi."
  - q: "Quyidagilardan qaysi biri obscurity (noaniqlik) misoli?"
    options:
      - "Funksiya uchta argument qabul qiladi"
      - "Modul ikkita boshqa modulga bog'liq"
      - "Kod TypeScript'da yozilgan"
      - "`timeout` o'zgaruvchisi qaysi birlikda ekani hech qayerda aytilmagan va uni faqat foydalanish joylaridan taxmin qilish mumkin"
    answer: 3
    explain: "Obscurity - muhim ma'lumot ko'rinmasligi. Birlik noma'lum bo'lsa, o'quvchi uni taxmin qiladi va xato qilishi mumkin. Dependency'lar o'z-o'zidan obscurity emas, lekin ular yashirin bo'lsa, obscurity'ga aylanadi."
  - q: "Nega Ousterhout murakkablikni \"inkremental\" deydi va bundan qanday amaliy xulosa chiqadi?"
    options:
      - "Chunki murakkablik faqat katta refaktoringdan keyin paydo bo'ladi, shuning uchun refaktoringdan qochish kerak"
      - "Chunki u ko'plab kichik qarorlardan yig'iladi va har biri alohida olganda arzimas ko'rinadi, shuning uchun kichik murakkabliklarga ham toqat qilmaslik kerak"
      - "Chunki murakkablik vaqt o'tishi bilan o'z-o'zidan kamayadi"
      - "Chunki murakkablikni faqat metrikalar bilan o'lchash mumkin"
    answer: 1
    explain: "Bitta qo'shimcha bayroq yoki bitta yashirin bog'liqlik o'zi zararsiz ko'rinadi. Muammo ularning yig'indisida. Shuning uchun Ousterhout \"nol toqat\" falsafasini taklif qiladi, bu 5-darsdagi strategik dasturlash bilan bog'liq."
  - q: "Brooks va McConnell bo'yicha essential va accidental murakkablik farqi qaysi javobda to'g'ri berilgan?"
    options:
      - "Essential - muammoning o'zidan kelib chiqadigan murakkablik (masalan, soliq qoidalarining o'zi), accidental - biz tanlagan yechim, vosita va tuzilma qo'shgan murakkablik"
      - "Essential - backend murakkabligi, accidental - frontend murakkabligi"
      - "Essential - yangi kod, accidental - legacy kod"
      - "Essential murakkablikni har doim yo'q qilish mumkin, accidental'ni esa yo'q"
    answer: 0
    explain: "Essential murakkablikni yo'q qilib bo'lmaydi, uni faqat yaxshi tashkil qilish va yashirish mumkin. Accidental murakkablik esa bizning qarorlarimiz natijasi va uni kamaytirish mumkin. Toza kod ishining katta qismi aynan shu ikkinchi turga qaratilgan."
  - q: "Exhaustive `switch` va `never` tekshiruvi qaysi murakkablik belgisiga qarshi eng ko'p yordam beradi?"
    options:
      - "Cognitive load"
      - "Change amplification"
      - "Unknown unknowns"
      - "Hech biriga, bu faqat stil masalasi"
    answer: 2
    explain: "Exhaustive tekshiruv o'zgarishlar sonini kamaytirmaydi (har bir switch'ni baribir yangilash kerak), lekin kompilyator tegish kerak bo'lgan har bir joyni ko'rsatadi. Yashirin joy ko'rinadigan bo'ladi, ya'ni unknown unknown known unknown'ga aylanadi."
task:
  title: "Transport turi qo'shishdagi murakkablikni topish va kamaytirish"
  prompt: |
    Transport parki tizimida avtomobil turlari bor: `truck`, `van`, `car`. Biznes yangi tur so'radi: `bus`. Quyidagi kodda bu turga bog'liq mantiq uch joyga sochilgan.

    1. Kodni o'qib, `bus` ni qo'shish uchun nechta joyni o'zgartirish kerakligini va qaysi biri koddan ko'rinmasligini yozing. Har bir muammoni Ousterhout belgilari bilan nomlang (change amplification, cognitive load, unknown unknowns).
    2. Kodni shunday qayta tuzingki: (a) yangi tur qo'shish bitta joyda boshlansin, (b) qolgan joylarni unutish kompilyatsiya xatosiga olib kelsin.
    3. Barcha mavjud natijalar o'zgarmasligi kerak.
  lang: ts
  starter: |
    export type Vehicle = { id: string; type: string; mileageKm: number };

    export function maxSpeedKmh(v: Vehicle): number {
      if (v.type === "truck") return 80;
      if (v.type === "van") return 100;
      return 110;
    }

    export function serviceIntervalKm(v: Vehicle): number {
      switch (v.type) {
        case "truck":
          return 20000;
        case "van":
          return 15000;
        default:
          return 10000;
      }
    }

    export function needsService(v: Vehicle, lastServiceKm: number): boolean {
      return v.mileageKm - lastServiceKm >= serviceIntervalKm(v);
    }

    export function licenseCategory(v: Vehicle): string {
      return v.type === "truck" ? "C" : "B";
    }
  solution: |
    export const VEHICLE_TYPES = ["truck", "van", "car", "bus"] as const;
    export type VehicleType = (typeof VEHICLE_TYPES)[number];

    export type Vehicle = { id: string; type: VehicleType; mileageKm: number };

    type LicenseCategory = "B" | "C" | "D";

    type VehicleTypeSpec = {
      maxSpeedKmh: number;
      serviceIntervalKm: number;
      licenseCategory: LicenseCategory;
    };

    /**
     * Har bir transport turining qoidalari shu yerda.
     * Yangi tur qo'shilganda TypeScript bu obyektda kalit yetishmasligini ko'rsatadi.
     */
    const VEHICLE_TYPE_SPECS: Record<VehicleType, VehicleTypeSpec> = {
      truck: { maxSpeedKmh: 80, serviceIntervalKm: 20_000, licenseCategory: "C" },
      van: { maxSpeedKmh: 100, serviceIntervalKm: 15_000, licenseCategory: "B" },
      car: { maxSpeedKmh: 110, serviceIntervalKm: 10_000, licenseCategory: "B" },
      bus: { maxSpeedKmh: 90, serviceIntervalKm: 15_000, licenseCategory: "D" },
    };

    export function maxSpeedKmh(vehicle: Vehicle): number {
      return VEHICLE_TYPE_SPECS[vehicle.type].maxSpeedKmh;
    }

    export function needsService(vehicle: Vehicle, lastServiceKm: number): boolean {
      const { serviceIntervalKm } = VEHICLE_TYPE_SPECS[vehicle.type];
      return vehicle.mileageKm - lastServiceKm >= serviceIntervalKm;
    }

    export function licenseCategory(vehicle: Vehicle): LicenseCategory {
      return VEHICLE_TYPE_SPECS[vehicle.type].licenseCategory;
    }
  solutionNotes: |
    - Asl kodda `bus` qo'shish uchun 3 ta joyni o'zgartirish kerak edi (change amplification). Lekin asosiy xavf boshqa: `default` va ternary tufayli `bus` hech qanday xatosiz `car` qoidalarini oladi va `licenseCategory` uchun noto'g'ri `B` qaytaradi. Bu unknown unknowns.
    - `type: string` o'quvchini mumkin bo'lgan qiymatlar ro'yxatini butun kod bazasidan qidirishga majbur qilardi (cognitive load). Endi u `VEHICLE_TYPES`da.
    - `Record<VehicleType, VehicleTypeSpec>` - yangi tur qo'shilganda kalit yetishmasa, kompilyator xato beradi. Yashirin joy ko'rinadigan bo'ldi.
    - Biz polimorfik klasslar ierarxiyasini qurmadik. Bu yerda farq faqat ma'lumotda, xatti-harakatda emas, shuning uchun jadval yetarli va oddiyroq. Xatti-harakat farq qilganda tanlov boshqacha bo'ladi (27-dars).
    - `bus` uchun qiymatlar misol sifatida berilgan. Haqiqiy loyihada ularni biznesdan tasdiqlash kerak: kod tuzilmasi biznes qoidasini o'ylab topishga huquq bermaydi.
  checklist:
    - "Muammolar Ousterhout belgilari bilan to'g'ri nomlandi"
    - "type maydoni string emas, cheklangan union tip"
    - "Yangi tur qo'shishda yetishmagan qoida kompilyatsiya xatosi beradi"
    - "default yoki ternary orqali jimgina noto'g'ri qiymat qaytaradigan yo'l qolmadi"
    - "truck, van, car uchun eski natijalar o'zgarmadi"
---

## Muammo

Hech bir loyiha murakkab bo'lib boshlanmaydi. Birinchi oyda hamma narsa oddiy: bitta `OrdersService`, bitta jadval, uchta endpoint. Bir yildan keyin jamoa "buyurtmaga izoh maydoni qo'shish" kabi vazifani ikki kunga baholaydi va bu bahoga hech kim ajablanmaydi.

Nima o'zgardi? Hech qanday bitta yomon qaror qabul qilinmadi. Har bir qadam o'z vaqtida oqilona ko'rindi: bu yerga bitta bayroq, u yerga bitta maxsus holat, bir joyda "hozircha" takrorlangan mantiq, bir joyda boshqa modulning ichki maydoniga to'g'ridan-to'g'ri murojaat. Har biri alohida olganda arzimas. Birgalikda - tizimni tushunish va o'zgartirish qimmatlashgan.

Murakkablik bilan kurashish uchun avval uni **tanib olish** kerak. "Bu kod yomon" degan his yetarli emas: u nimasi yomonligini, qayerdan kelganini va nima uni kamaytirishini aytmaydi. Bu darsda murakkablikni aniq terminlar bilan tasvirlashni o'rganamiz.

## Asosiy g'oya

John Ousterhout *A Philosophy of Software Design*ning ikkinchi bobida murakkablikni amaliy ta'riflaydi: dasturiy tizimni tushunish va o'zgartirishni qiyinlashtiradigan, uning tuzilmasiga oid har qanday narsa. Bu ta'rif ataylab subyektiv va amaliy: murakkablik kodni o'qish va o'zgartirishga urinayotgan odam boshdan kechiradigan narsa.

Ousterhout buni bitta g'oya bilan aniqlashtiradi: tizimning umumiy murakkabligi uning har bir qismi murakkabligini dasturchilar o'sha qism bilan ishlashga sarflaydigan vaqt ulushiga ko'paytirib yig'ilgani kabi. Bu formula hisoblash uchun emas, fikrlash uchun. Undan muhim xulosa chiqadi: kamdan-kam tegiladigan joyda yaxshi yashirilgan murakkablik deyarli zarar keltirmaydi. Har kuni o'zgaradigan joydagi murakkablik esa eng qimmat.

### Uchta belgi

1. **Change amplification.** Oddiy o'zgarish ko'p joyda o'zgarishni talab qiladi. Klassik misol: rang yoki valyuta formati har bir sahifada alohida yozilgan.
2. **Cognitive load.** Vazifani bajarish uchun dasturchi qancha narsani bilishi kerak. Ko'p global holat, ko'p maxsus holatlar, nomuvofiq API'lar yukni oshiradi. Muhim nozik nuqta: kamroq qatorli yechim har doim ham kamroq yukli emas.
3. **Unknown unknowns.** Qaysi kodni o'zgartirish kerakligi yoki qaysi ma'lumot kerakligi ko'rinmaydi. Ousterhout buni eng yomon belgi deb hisoblaydi, chunki boshqa ikkisini hech bo'lmaganda ko'rish mumkin. Bu belgi bo'lsa, siz o'zgarishni to'g'ri kiritganingizni faqat xato chiqqanda bilasiz.

### Ikkita sabab

1. **Dependencies (bog'liqliklar).** Kodni alohida tushunib yoki o'zgartirib bo'lmasa, bog'liqlik bor. Bog'liqliklarni butunlay yo'q qilish mumkin emas, ular dasturning tabiiy qismi. Maqsad - ularni kamaytirish va ko'rinadigan qilish.
2. **Obscurity (noaniqlik).** Muhim ma'lumot ko'rinmasa. Umumiy nomlar (`data`, `handle`), hujjatlashtirilmagan birliklar, nomuvofiqlik (bir tushuncha uchun ikki xil nom) - bularning hammasi obscurity.

Bog'liqliklar change amplification va cognitive load'ni keltirib chiqaradi. Obscurity unknown unknowns'ni va cognitive load'ni keltirib chiqaradi. Bu xarita amaliy: muammoning belgisini ko'rsangiz, qayerdan qidirishni bilasiz.

### Murakkablik inkremental

Ousterhoutning eng muhim kuzatuvlaridan biri: murakkablik bitta katta xatodan emas, ko'plab kichik qarorlardan yig'iladi. Har bir kichik qaror "bu safar mayli" degan mantiq bilan qabul qilinadi. Shuning uchun u "nol toqat" (zero tolerance) yondashuvini taklif qiladi: kichik murakkabliklarni ham jiddiy qabul qilish. Bu g'oya 5-darsdagi strategik dasturlashning asosi.

## Chuqurroq: essential va accidental

Steve McConnell *Code Complete*da dizayn haqida gapirganda Fred Brooks'ning "No Silver Bullet" maqolasidagi farqqa tayanadi: **essential** (mohiyatiy) va **accidental** (tasodifiy) qiyinchiliklar.

- **Essential murakkablik** - muammoning o'zidan kelib chiqadi. O'zbekiston soliq qoidalari, yoqilg'i datchigi kalibrovkasining fizikasi, ijara shartnomalaridagi yuridik holatlar. Uni yo'q qilib bo'lmaydi, chunki u biznesning o'zi.
- **Accidental murakkablik** - biz yechim sifatida qo'shgan narsalar: noqulay abstraksiyalar, yashirin bog'liqliklar, mos kelmagan vosita, tarixiy sabablarga ko'ra qolgan qatlamlar.

McConnell bundan xulosa chiqaradi: dasturiy ta'minotning asosiy texnik vazifasi - murakkablikni boshqarish. Uning fikricha, loyiha texnik sabablarga ko'ra muvaffaqiyatsizlikka uchraganda, asosiy sabab ko'pincha nazoratsiz murakkablik bo'ladi. Boshqarishning ikki yo'li bor: bir vaqtda o'ylash kerak bo'lgan essential murakkablik miqdorini kamaytirish (uni modullarga bo'lib, har birida faqat bir qismi haqida o'ylash) va accidental murakkablikning keraksiz o'sishini to'xtatish.

Ousterhout va McConnell bu yerda bir-birini to'ldiradi. McConnell "nima" ni aytadi: murakkablikni boshqarish asosiy vazifa. Ousterhout "qanday tanish" ni beradi: belgilar va sabablar.

### Murakkablik qayerga ketadi

Essential murakkablik yo'qolmaydi, u faqat ko'chadi. Masalan, valyuta konvertatsiyasidagi yaxlitlash qoidalari - essential. Ularni har bir chaqiruvchi o'zi bilishi kerak bo'lsa, murakkablik ko'p joyga tarqalgan. Ular bitta `Money` value object ichida bo'lsa (44-dars), murakkablik bir joyda yashiringan. Umumiy miqdor bir xil, lekin dasturchilar u bilan to'qnashadigan vaqt ulushi keskin kamaydi. Ousterhoutning formulasi aynan shuni ko'rsatadi.

Shundan Ousterhoutning yana bir g'oyasi kelib chiqadi (52-dars): murakkablikni modul ichiga "pastga tortish" yaxshiroq, chunki modulni bir kishi bir marta yozadi, uni esa ko'pchilik ko'p marta ishlatadi.

### Metrikalar haqida

Cyclomatic complexity (McCabe) va cognitive complexity (SonarSource) kabi metrikalar bor (97-dars). Ular foydali signal, lekin Ousterhout ma'nosidagi murakkablikni to'liq o'lchamaydi. Cyclomatic complexity funksiya ichidagi tarmoqlanishni sanaydi, lekin modullar orasidagi yashirin bog'liqlikni yoki noaniq nomni ko'rmaydi. Metrika past, kod esa murakkab bo'lishi mumkin. Metrikani maqsadga aylantirish (masalan, "har bir funksiya cyclomatic 5 dan past") ba'zan murakkablikni yo'q qilmasdan, uni ko'p kichik funksiyalar orasiga tarqatadi.

## Misol: to'lov holati

Ijara platformasida to'lovlar holatini qayta ishlaydigan kod:

```ts
type Payment = {
  id: string;
  status: string;
  provider: string;
  amount: number;
  refundedAmount?: number;
};

export function canRefund(p: Payment): boolean {
  if (p.status !== "paid" && p.status !== "partially_refunded") return false;
  if (p.provider === "cash") return false;
  return (p.refundedAmount ?? 0) < p.amount;
}

export function statusLabel(p: Payment): string {
  if (p.status === "paid") return "To'langan";
  if (p.status === "partially_refunded") return "Qisman qaytarilgan";
  if (p.status === "refunded") return "Qaytarilgan";
  return "Kutilmoqda";
}
```

Diagnostika:

- **Obscurity.** `status: string` - qanday qiymatlar mumkin? Faqat `if` larni o'qib taxmin qilish kerak. `"failed"` bormi? Agar bo'lsa, `statusLabel` uni "Kutilmoqda" deb ko'rsatadi.
- **Unknown unknowns.** Yangi `"disputed"` holati qo'shilsa, `canRefund` va `statusLabel` ni yangilash kerakligini hech narsa aytmaydi. Kod jimgina noto'g'ri ishlaydi.
- **Yashirin bog'liqlik.** `refundedAmount` faqat ba'zi holatlarda ma'noli. Qaysi holatlarda? Tip aytmaydi.

Murakkablikni kamaytirilgan versiya:

```ts
type PaymentProvider = "payme" | "click" | "uzum" | "cash";

type Payment =
  | { id: string; status: "pending"; provider: PaymentProvider; amount: number }
  | { id: string; status: "failed"; provider: PaymentProvider; amount: number; reason: string }
  | { id: string; status: "paid"; provider: PaymentProvider; amount: number }
  | {
      id: string;
      status: "partially_refunded";
      provider: PaymentProvider;
      amount: number;
      refundedAmount: number;
    }
  | { id: string; status: "refunded"; provider: PaymentProvider; amount: number };

type PaymentStatus = Payment["status"];

const STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Kutilmoqda",
  failed: "Xato",
  paid: "To'langan",
  partially_refunded: "Qisman qaytarilgan",
  refunded: "Qaytarilgan",
};

/** Naqd to'lovlar kassada qaytariladi, tizim orqali emas. */
const PROVIDERS_WITHOUT_ONLINE_REFUND: ReadonlySet<PaymentProvider> = new Set(["cash"]);

export function refundableAmount(payment: Payment): number {
  if (PROVIDERS_WITHOUT_ONLINE_REFUND.has(payment.provider)) return 0;

  switch (payment.status) {
    case "paid":
      return payment.amount;
    case "partially_refunded":
      return payment.amount - payment.refundedAmount;
    case "pending":
    case "failed":
    case "refunded":
      return 0;
    default: {
      const unhandled: never = payment;
      throw new Error(`Unhandled payment status: ${JSON.stringify(unhandled)}`);
    }
  }
}

export function statusLabel(payment: Payment): string {
  return STATUS_LABELS[payment.status];
}
```

Nima o'zgardi:

- **Obscurity yo'qoldi.** Barcha holatlar tipda. `refundedAmount` faqat u ma'noli bo'lgan holatda mavjud.
- **Unknown unknowns ko'rinadigan bo'ldi.** Yangi holat qo'shilsa, `STATUS_LABELS` va `switch` dagi `never` tekshiruvi kompilyatsiya xatosi beradi.
- **API chuqurlashdi.** `canRefund` boolean o'rniga `refundableAmount` - chaqiruvchi endi "qancha qaytarish mumkin" ni o'zi hisoblamaydi. Bu murakkablikni modul ichiga tortish misoli.
- **Biznes qoidasi nomlandi va izohlandi.** Naqd to'lovlar nega istisno ekani komment bilan berildi, chunki bu koddan o'qib bo'lmaydigan ma'lumot.

Change amplification esa qisman qoldi: yangi holat uchun baribir ikkita joyni yangilash kerak. Farq shundaki, endi kompilyator ularni ko'rsatadi.

## Qachon qo'llamaslik kerak

- **Murakkablikka qarshi kurash o'zi murakkablik qo'shganda.** Ikki holatli oddiy bayroq uchun discriminated union, jadval va `never` tekshiruvi ortiqcha. Agar holatlar soni o'zgarmasa va kod bir joyda bo'lsa, oddiy `if` yetarli.
- **Essential murakkablikni "soddalashtirish".** Soliq qoidasi haqiqatan ham 12 ta holatdan iborat bo'lsa, uni 3 ta holatga keltirish kodni sodda qiladi, lekin noto'g'ri. Essential murakkablik kodda aks etishi kerak, faqat tartibli.
- **Kamdan-kam tegiladigan kod.** Ousterhoutning formulasi bo'yicha, uch yildan beri o'zgarmagan, yaxshi ishlab turgan murakkab modulni tozalash past daromadli. Unga tegish kerak bo'lganda tozalang (6-dars).
- **Metrikalarni maqsad qilish.** "Cyclomatic complexity 10 dan past" talabi ba'zan haqiqiy soddalashtirishni emas, mantiqni sun'iy bo'lishni rag'batlantiradi.

## Stack'da: TypeScript, NestJS, Next.js

- **Union tiplar va `never`.** TypeScript'da obscurity'ga qarshi eng arzon vosita. `strict` rejimida `switch` exhaustiveness tekshiruvi unknown unknowns'ni kompilyatsiya xatosiga aylantiradi.
- **NestJS modullari va DI.** DI bog'liqliklarni constructor'da ko'rinadigan qiladi, bu yaxshi. Lekin `@Global()` modullar va ko'p `forwardRef` bog'liqliklarni yana yashiradi. `forwardRef` ning ko'payishi - aylana bog'liqlik signali.
- **Next.js server/client chegarasi.** Komponent server yoki client'da ishlashini tushunish uchun butun import zanjirini kuzatish kerak bo'lsa, bu obscurity. `"use client"` direktivasini ongli joylarda (barg komponentlarida) qo'yish chegarani ko'rinadigan qiladi (93-dars).
- **Prisma/Kysely so'rovlari.** Repository qatlami ichida yashiringan N+1 yoki tranzaksiya chegarasi - unknown unknowns'ning backend versiyasi (95-dars).

## Xulosa

- Ousterhout murakkablikni tizimni tushunish va o'zgartirishni qiyinlashtiradigan tuzilmaviy xususiyat deb ta'riflaydi. U dasturchilar ko'p vaqt sarflaydigan joylarda eng qimmat.
- Uchta belgi: change amplification, cognitive load, unknown unknowns. Ikkita sabab: dependencies va obscurity.
- Essential murakkablikni yo'q qilib bo'lmaydi, faqat yashirish va tartiblash mumkin. Accidental murakkablik bizning qarorlarimiz natijasi.
- Murakkablik inkremental: u kichik qarorlardan yig'iladi, shuning uchun kichik murakkablikka ham jiddiy qarash kerak.
- TypeScript'da union tiplar va exhaustive tekshiruv yashirin joylarni kompilyator ko'radigan qiladi.
