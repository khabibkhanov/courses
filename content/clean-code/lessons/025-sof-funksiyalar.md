---
n: 25
slug: sof-funksiyalar
title: "Sof funksiyalar va immutability"
summary: "Sof funksiya natijasi faqat argumentlariga bog'liq va hech narsani o'zgartirmaydi. Bu xususiyat testlash, qayta ishlatish va xatolarni topishni qanday arzonlashtiradi, TypeScript'da readonly va immutable yangilanishlar qanday ishlaydi va Gary Bernhardt'ning \"functional core, imperative shell\" g'oyasi."
duration: 35
sources:
  - id: effective-ts
    note: "readonly yordamida mutatsiya bilan bog'liq xatolardan qochish haqidagi bo'lim va tiplar dizayni bo'limlari"
  - id: bernhardt-boundaries
    note: "Functional core, imperative shell; qiymatlarning chegara sifatidagi roli; core va shell'ni test qilish farqi"
  - id: pragprog
    note: "Dasturlashni ma'lumot transformatsiyasi sifatida ko'rish va umumiy holat xavfi haqidagi bo'limlar"
quiz:
  - q: "Quyidagi funksiyalardan qaysi biri sof (pure)?"
    options:
      - "`function applyDiscount(order) { order.total *= 0.9; return order; }`"
      - "`function isOverdue(rental) { return rental.dueAt < new Date(); }`"
      - "`function fuelCost(liters: number, pricePerLiter: number) { return liters * pricePerLiter; }`"
      - "`function nextId() { return ++counter; }`"
    answer: 2
    explain: "fuelCost natijasi faqat argumentlarga bog'liq va hech narsani o'zgartirmaydi. applyDiscount argumentni o'zgartiradi, isOverdue yashirin kirish sifatida joriy vaqtni o'qiydi, nextId tashqi holatni o'zgartiradi."
  - q: "TypeScript'da `function sum(xs: readonly number[])` imzosi chaqiruvchiga nimani kafolatlaydi?"
    options:
      - "Massiv runtime'da muzlatiladi (Object.freeze)"
      - "Funksiya massivni push, sort, splice kabi mutatsiya qiluvchi metodlar bilan o'zgartirmaydi, chunki ular tipda mavjud emas"
      - "Massiv elementlari ham chuqur immutable bo'ladi"
      - "Massivni boshqa joyda ham hech kim o'zgartira olmaydi"
    answer: 1
    explain: "readonly faqat kompilyatsiya vaqtidagi va sayoz (shallow) cheklov: funksiya ichida mutatsiya metodlari tipda yo'q. U runtime'da hech narsa qilmaydi, elementlar ichini himoya qilmaydi va boshqa havolalar orqali o'zgarishni to'xtatmaydi."
  - q: "Bernhardt'ning \"functional core, imperative shell\" yondashuvida core va shell qanday farqlanadi?"
    options:
      - "Core'da ko'p qaror va tarmoqlanish bor, lekin dependency yo'q; shell'da dependency ko'p, qarorlar esa kam"
      - "Core frontend, shell backend"
      - "Core faqat klasslardan, shell faqat funksiyalardan iborat"
      - "Core'da barcha I/O, shell'da barcha biznes mantiq"
    answer: 0
    explain: "Bernhardt mantiqni (ko'p yo'llar, dependency'siz) sof core'ga, I/O va koordinatsiyani (kam yo'llar, ko'p dependency) yupqa shell'ga joylashtiradi. Shunda core unit testlar bilan, shell esa kam sonli integratsion testlar bilan tekshiriladi."
  - q: "`const sorted = vehicles.sort(byMileage)` qatoridagi yashirin xavf nima?"
    options:
      - "sort faqat raqamlarni saralaydi"
      - "sort yangi massiv qaytaradi, shuning uchun xotira ikki barobar ko'p ketadi"
      - "sort async ishlaydi"
      - "sort massivni joyida o'zgartiradi, demak `vehicles`ni ishlatadigan boshqa kod (masalan, React state) ham o'zgaradi"
    answer: 3
    explain: "Array.prototype.sort in-place ishlaydi va o'sha massivni qaytaradi. Yangi nomli o'zgaruvchi yangi massiv degan illuziya beradi. `toSorted` yoki `[...vehicles].sort(...)` xavfsiz."
  - q: "Funksiya ichida lokal massiv yaratib, uni `push` bilan to'ldirib qaytarish funksiyaning sofligini buzadimi?"
    options:
      - "Ha, har qanday mutatsiya soflikni buzadi"
      - "Faqat massiv 1000 elementdan katta bo'lsa"
      - "Yo'q, chunki o'zgarish tashqaridan kuzatilmaydi: lokal holat funksiyadan tashqarida hech kimga ko'rinmaydi"
      - "Ha, chunki push O(1) emas"
    answer: 2
    explain: "Soflik tashqi kuzatuvchi nuqtai nazaridan o'lchanadi. Funksiya ichida yaratilgan va faqat qaytarilgan obyektni to'ldirish hech kimning ma'lumotini o'zgartirmaydi. Ko'pincha bu reduce bilan yozilgan variantdan o'qilishi osonroq."
  - q: "Sof funksiyani qaysi holatda majburlash eng kam foyda beradi?"
    options:
      - "Narx hisoblash qoidalari"
      - "Kichik, lokal skriptdagi ketma-ket I/O operatsiyalari, ularda tarmoqlanuvchi mantiq deyarli yo'q"
      - "Telemetriya ma'lumotlaridan hodisalarni aniqlash"
      - "React'da derived state hisoblash"
    answer: 1
    explain: "Agar kodning deyarli hammasi I/O bo'lsa va qarorlar kam bo'lsa, core'ga ajratadigan narsa qolmaydi va qatlamlar faqat sakrash qo'shadi. Qolgan uchtasi tipik core mantiq: ko'p qaror, aniq kirish va chiqish."
task:
  title: "Telemetriya qayta ishlovchisini core va shell'ga ajratish"
  prompt: |
    Quyidagi funksiya GPS nuqtalarini oladi, tezlik buzilishlarini aniqlaydi, bazaga yozadi va dispetcherga xabar yuboradi. Biznes qoidasini (tezlik chegarasi, minimal davomiylik) test qilish uchun hozir DB va notifier'ni mock qilish kerak.

    1. Qaysi qismlar qaror qabul qiladi va qaysilari faqat I/O ekanini ajrating.
    2. Qaror qismini sof funksiyaga chiqaring: kirish - nuqtalar va qoidalar, chiqish - buzilishlar ro'yxati.
    3. Argumentlarni o'zgartiradigan joylarni toping va tuzating.
    4. Shell funksiya faqat o'qish, core'ni chaqirish va yozishdan iborat bo'lsin.
  lang: ts
  starter: |
    type GpsPoint = { vehicleId: string; at: Date; speedKmh: number };
    type Violation = { vehicleId: string; startedAt: Date; endedAt: Date; maxSpeed: number };
    type Repo = { loadPoints(vehicleId: string): Promise<GpsPoint[]>; saveViolations(v: Violation[]): Promise<void> };
    type Notifier = { alert(text: string): Promise<void> };

    export async function processSpeeding(repo: Repo, notifier: Notifier, vehicleId: string): Promise<void> {
      const points = await repo.loadPoints(vehicleId);
      points.sort((a, b) => a.at.getTime() - b.at.getTime());
      const result: Violation[] = [];
      let current = null as Violation | null;
      for (const p of points) {
        if (p.speedKmh > 90) {
          if (!current) current = { vehicleId, startedAt: p.at, endedAt: p.at, maxSpeed: p.speedKmh };
          current.endedAt = p.at;
          current.maxSpeed = Math.max(current.maxSpeed, p.speedKmh);
        } else if (current) {
          if (current.endedAt.getTime() - current.startedAt.getTime() >= 30_000) result.push(current);
          current = null;
        }
      }
      if (current && current.endedAt.getTime() - current.startedAt.getTime() >= 30_000) result.push(current);
      await repo.saveViolations(result);
      for (const v of result) await notifier.alert(`${v.vehicleId}: ${v.maxSpeed} km/h`);
    }
  solution: |
    type GpsPoint = { vehicleId: string; at: Date; speedKmh: number };
    type Violation = { vehicleId: string; startedAt: Date; endedAt: Date; maxSpeed: number };
    type Repo = { loadPoints(vehicleId: string): Promise<GpsPoint[]>; saveViolations(v: Violation[]): Promise<void> };
    type Notifier = { alert(text: string): Promise<void> };

    export type SpeedingRules = { limitKmh: number; minDurationMs: number };

    export const DEFAULT_SPEEDING_RULES: SpeedingRules = { limitKmh: 90, minDurationMs: 30_000 };

    // Functional core: sof, dependency'siz, faqat qiymatlar
    export function detectSpeeding(points: readonly GpsPoint[], rules: SpeedingRules): Violation[] {
      const ordered = [...points].sort((a, b) => a.at.getTime() - b.at.getTime());
      const violations: Violation[] = [];
      let current = null as Violation | null;

      for (const p of ordered) {
        if (p.speedKmh <= rules.limitKmh) {
          if (current && lastsLongEnough(current, rules)) violations.push(current);
          current = null;
          continue;
        }
        current = current
          ? { ...current, endedAt: p.at, maxSpeed: Math.max(current.maxSpeed, p.speedKmh) }
          : { vehicleId: p.vehicleId, startedAt: p.at, endedAt: p.at, maxSpeed: p.speedKmh };
      }
      if (current && lastsLongEnough(current, rules)) violations.push(current);
      return violations;
    }

    function lastsLongEnough(v: Violation, rules: SpeedingRules): boolean {
      return v.endedAt.getTime() - v.startedAt.getTime() >= rules.minDurationMs;
    }

    export function violationAlertText(v: Violation): string {
      return `${v.vehicleId}: ${v.maxSpeed} km/h`;
    }

    // Imperative shell: faqat I/O va koordinatsiya
    export async function processSpeeding(
      repo: Repo,
      notifier: Notifier,
      vehicleId: string,
      rules: SpeedingRules = DEFAULT_SPEEDING_RULES,
    ): Promise<void> {
      const points = await repo.loadPoints(vehicleId);
      const violations = detectSpeeding(points, rules);
      await repo.saveViolations(violations);
      for (const v of violations) await notifier.alert(violationAlertText(v));
    }
  solutionNotes: |
    - `points.sort(...)` repository qaytargan massivni joyida o'zgartirardi. Agar repository kesh ishlatsa, keshdagi ma'lumot ham o'zgarardi. Endi nusxa saralanadi.
    - Biznes qoidasi (90 km/soat, 30 soniya) `SpeedingRules` qiymatiga chiqdi va parametr bo'ldi: endi turli transport turlari uchun turli qoida berish mumkin.
    - `detectSpeeding` sof: uni mock'siz, o'nlab chegaraviy holat bilan (bitta nuqta, uzilishlar, tartibsiz vaqt) test qilish mumkin.
    - Ichki `let current` va `violations.push` qoldi: bu lokal mutatsiya, tashqaridan ko'rinmaydi va sikl reduce'dan o'qilishi oson.
    - Takrorlangan "davomiylik yetarlimi" sharti nomlangan sof `lastsLongEnough` funksiyasiga chiqdi. Uni closure ichida `current`ni o'zgartiradigan yordamchiga aylantirmadik: bunday closure TypeScript'ning narrowing'ini ham, o'quvchini ham chalkashtiradi.
    - Shell to'rt qatorli: o'qish, core, yozish, xabar. Uni bitta integratsion test bilan tekshirish yetarli.
  checklist:
    - "Biznes qaror qiladigan funksiya DB va notifier'siz chaqiriladi"
    - "Kirish massivi o'zgartirilmaydi"
    - "Tezlik chegarasi va davomiylik nomlangan va parametr orqali beriladi"
    - "Shell funksiyada if yoki sikl ichidagi biznes qaror qolmadi"
    - "Core uchun kamida 3 ta chegaraviy holat testi yozildi yoki rejalashtirildi"
---

## Muammo

Kodda xato topishning eng qiyin turi - "bu qiymat qayerda o'zgardi?" savoli. Obyekt servisdan servisga uzatiladi, kimdir uni yo'l-yo'lakay o'zgartiradi, va xato butunlay boshqa joyda paydo bo'ladi. React'da bu "state yangilandi, lekin ekran yangilanmadi" ko'rinishida chiqadi: kimdir massivni joyida o'zgartirgan va havola o'zgarmagani uchun React farqni ko'rmagan. Backend'da esa "keshdagi ma'lumot o'z-o'zidan buzildi" ko'rinishida: kimdir keshdan olingan obyektni saralagan yoki maydonini o'zgartirgan.

Ikkinchi og'riq - test. Biznes qoidasi (masalan, "tezlik 90 km/soatdan oshib, 30 soniyadan uzoq davom etsa - buzilish") DB o'qish va xabar yuborish bilan bitta funksiyada bo'lsa, uni test qilish uchun ikki-uchta mock kerak. Test qoidani emas, mock'larni sozlashni tasvirlaydi va har bir refaktoringda sinadi.

## Asosiy g'oya

**Sof funksiya** ikkita shartga javob beradi:

1. Natijasi faqat argumentlariga bog'liq. Bir xil kirish har doim bir xil chiqish beradi. Yashirin kirishlar yo'q: joriy vaqt, `Math.random()`, global konfiguratsiya, modul darajasidagi o'zgaruvchi.
2. Kuzatiladigan side effect yo'q. Argumentlarni, global holatni o'zgartirmaydi, I/O qilmaydi.

Bu xususiyatlardan amaliy foydalar kelib chiqadi:

- **Lokal tushunish.** Funksiyani tushunish uchun faqat uning tanasi va argumentlari kerak. Qayerdan, qachon va necha marta chaqirilgani muhim emas.
- **Arzon test.** Kirish va kutilgan chiqish. Mock yo'q, setup yo'q, tartib muhim emas.
- **Xavfsiz qayta ishlatish va kombinatsiya.** Sof funksiyalarni istalgan tartibda birlashtirish, keshlash (memoize) va parallel chaqirish mumkin.

*The Pragmatic Programmer*ning ikkinchi nashrida mualliflar dasturlashni ma'lumot transformatsiyasi sifatida ko'rishni taklif qiladi: dastur kirishni bosqichma-bosqich chiqishga aylantiradigan funksiyalar quvuri. Bu yondashuvda har bir bosqich yangi qiymat qaytaradi va avvalgisini o'zgartirmaydi. Ular umumiy o'zgaruvchan holatni ham xatolarning asosiy manbalaridan biri sifatida ko'rsatadi, ayniqsa parallellik bo'lganda.

**Immutability** - sof funksiyaning ma'lumotdagi aksi: qiymat yaratilgandan keyin o'zgarmaydi, o'zgarish kerak bo'lsa yangi qiymat yaratiladi. Immutable ma'lumot bilan ishlaganda "bu qiymat qayerda o'zgardi?" savoli yo'qoladi.

## Chuqurroq: functional core, imperative shell

Real dastur I/O qilmasdan foydasiz: u bazaga yozadi, HTTP so'rov yuboradi, ekranni yangilaydi. Demak hammasini sof qilish mumkin emas. Gary Bernhardt *Boundaries* ma'ruzasida buning uchun arxitektura naqshini taklif qiladi: **functional core, imperative shell**.

- **Functional core** - barcha qarorlar, tarmoqlanishlar va biznes mantiq. U sof va qiymatlar bilan ishlaydi. Unda ko'p yo'llar (if, sikl) bor, lekin dependency yo'q.
- **Imperative shell** - yupqa qatlam: ma'lumotni o'qiydi, core'ni chaqiradi, natijani yozadi. Unda dependency'lar ko'p, lekin qarorlar deyarli yo'q.

Bernhardt bu bo'linishni test strategiyasi bilan bog'laydi: core'ni ko'p sonli tez unit testlar bilan, shell'ni esa kam sonli integratsion testlar bilan tekshirish mumkin, chunki shell'da tarmoqlanish kam va test qilish kerak bo'lgan yo'llar oz. Ma'ruzaning yana bir muhim g'oyasi: komponentlar orasidagi chegara **qiymatlar** bo'lsin. Core'ga obyekt-servis emas, oddiy ma'lumot kiradi va undan oddiy ma'lumot chiqadi. Bu chegarani mock'siz kesib o'tish imkonini beradi.

Bu g'oya 22-darsdagi abstraksiya darajalari bilan to'g'ridan-to'g'ri bog'liq: domen hisobi (core) va infratuzilma (shell) turli darajalar. 67-darsda uni testlanadigan dizayn nuqtai nazaridan batafsil ko'ramiz.

### Yashirin kirishlar

Eng ko'p uchraydigan "deyarli sof" funksiya - joriy vaqtni o'qiydigan funksiya: `isExpired(license) { return license.expiresAt < new Date(); }`. U hech narsani o'zgartirmaydi, lekin natijasi chaqirilgan vaqtga bog'liq, demak uni test qilish uchun soatni mock qilish kerak. Yechim oddiy: vaqtni argument qiling (`isExpired(license, now)`), shell esa `new Date()`ni uzatadi. Xuddi shu narsa tasodifiy sonlar, UUID generatori va `process.env`ga tegishli.

### Soflik kuzatuvchiga nisbiy

Funksiya ichidagi lokal mutatsiya soflikni buzmaydi. Lokal massiv yaratib, uni `push` bilan to'ldirib qaytarish tashqaridan sof funksiya. Ko'pincha bu `reduce` bilan yozilgan, har qadamda yangi massiv yaratadigan variantdan ham o'qilishi, ham tezligi bo'yicha yaxshiroq. Immutability - chegaradagi qoida (argumentlar, qaytarilgan qiymatlar, umumiy holat), ichki implementatsiya qoidasi emas.

## Chuqurroq: TypeScript'da immutability

Vanderkam *Effective TypeScript*da mutatsiya bilan bog'liq xatolardan qochish uchun `readonly`dan foydalanishni tavsiya qiladi. Asosiy mexanizmlar:

- **`readonly` massiv parametri.** `function total(lines: readonly OrderLine[])` - funksiya ichida `push`, `sort`, `splice` tipda yo'q. Bu chaqiruvchiga funksiya massivni o'zgartirmasligini kafolatlaydi. `T[]` ni `readonly T[]` ga uzatish mumkin, aksi emas.
- **`readonly` maydonlar va `Readonly<T>`.** Obyekt maydonlarini qayta tayinlashni taqiqlaydi.
- **Cheklovlar.** `readonly` sayoz: `readonly Vehicle[]` massivni himoya qiladi, lekin `vehicles[0].mileage = 0` ga ruxsat beradi. Chuqur himoya uchun ichki tiplarni ham readonly qilish yoki o'z `DeepReadonly` tipingizni yozish kerak. Bundan tashqari, `readonly` faqat kompilyatsiya vaqtida ishlaydi; runtime'da `Object.freeze` kerak bo'lsa, u ham sayoz.
- **`as const`.** Literal qiymatlarni chuqur readonly qiladi va konfiguratsiya, lookup jadvallar uchun qulay.
- **Mutatsiya qilmaydigan massiv metodlari.** ES2023 dan boshlab `toSorted`, `toReversed`, `toSpliced` va `with` metodlari nusxa qaytaradi. Ular Node.js 20+ va zamonaviy brauzerlarda mavjud; TypeScript'da `lib` sozlamasi ES2023 yoki undan yuqori bo'lishi kerak. Eski muhitda `[...xs].sort(...)` ishlatiladi.

## Misol: buyurtmaga chegirma qo'llash

Mutatsiya qiladigan va yashirin kirishli kod:

```ts
type OrderLine = { sku: string; quantity: number; unitPrice: number };
type Order = { id: string; lines: OrderLine[]; total: number; discountApplied: boolean };

export function applyHappyHourDiscount(order: Order): Order {
  const hour = new Date().getHours();
  if (hour >= 14 && hour < 16 && !order.discountApplied) {
    order.lines.forEach((l) => (l.unitPrice = Math.round(l.unitPrice * 0.85)));
    order.total = order.lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
    order.discountApplied = true;
  }
  return order;
}
```

Bu funksiya chaqiruvchining obyektini o'zgartiradi va uni qaytaradi, shuning uchun chaqiruvchi yangi obyekt oldim deb o'ylashi mumkin. Natija soatga bog'liq va testda 14:00 ni kutish yoki soatni mock qilish kerak. Sof versiya:

```ts run
type OrderLine = { readonly sku: string; readonly quantity: number; readonly unitPrice: number };
type Order = {
  readonly id: string;
  readonly lines: readonly OrderLine[];
  readonly total: number;
  readonly discountApplied: boolean;
};

const HAPPY_HOUR = { fromHour: 14, toHour: 16, rate: 0.15 } as const;

export function isHappyHour(at: Date): boolean {
  const hour = at.getHours();
  return hour >= HAPPY_HOUR.fromHour && hour < HAPPY_HOUR.toHour;
}

export function applyHappyHourDiscount(order: Order, at: Date): Order {
  if (order.discountApplied || !isHappyHour(at)) return order;
  const lines = order.lines.map((l) => ({ ...l, unitPrice: Math.round(l.unitPrice * (1 - HAPPY_HOUR.rate)) }));
  return {
    ...order,
    lines,
    total: lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    discountApplied: true,
  };
}

// Sinab ko'ring: soatni o'zgartiring (chegirma 14:00-16:00 oralig'ida).
const order: Order = {
  id: "o1",
  lines: [{ sku: "COFFEE", quantity: 2, unitPrice: 18_000 }],
  total: 36_000,
  discountApplied: false,
};
const discounted = applyHappyHourDiscount(order, new Date(2026, 9, 28, 15, 0));
console.log("yangi:", discounted.total, discounted.discountApplied);
console.log("asl:", order.total, order.discountApplied);
console.log(applyHappyHourDiscount(order, new Date(2026, 9, 28, 18, 0)) === order);
```

Nima o'zgardi:

- **Vaqt argumentga aylandi.** Test `new Date("2026-10-20T14:30:00")` uzatadi, mock kerak emas.
- **Yangi obyekt qaytariladi.** Asl buyurtma o'zgarmaydi, demak u keshda, React state'da yoki audit log'da bo'lsa ham xavfsiz.
- **`readonly` tiplar.** Agar kimdir keyinchalik `order.total = ...` yozsa, kompilyator to'xtatadi.
- **Chegirma qoidasi nomlangan konstantada.** Biznes uni o'zgartirsa, bitta joy.

## Qachon qo'llamaslik kerak

- **Katta ma'lumot va hot path.** Million elementli massivni har qadamda nusxalash xotira va GC bosimini oshiradi. Bunday joylarda funksiya ichida lokal mutatsiya yoki Immer kabi structural sharing qiladigan kutubxona to'g'ri tanlov. Faqat o'lchab qaror qiling (99-dars).
- **Asosan I/O bo'lgan kod.** Agar funksiyaning deyarli hammasi "o'qi, yoz, yubor" bo'lsa va qarorlar kam bo'lsa, core'ga ajratadigan narsa yo'q. Majburiy ajratish faqat qatlam qo'shadi.
- **Tabiiy o'zgaruvchan obyektlar.** Connection pool, stream, WebSocket ulanishi, ORM entity (masalan, TypeORM'ning change tracking'i mutatsiyaga tayanadi). Ularni immutable qilishga urinish freymvork bilan kurashishga olib keladi.
- **Chuqur immutability tiplarining narxi.** Murakkab rekursiv `DeepReadonly` tiplar xato xabarlarini o'qib bo'lmaydigan qiladi va kompilyatsiyani sekinlashtirishi mumkin. Odatda chegaradagi `readonly` massivlar va asosiy maydonlar yetarli.

## Stack'da: React, NestJS, Node.js

- **React state.** React state'ni immutable deb hisoblaydi va o'zgarishni havola orqali aniqlaydi. `items.push(x); setItems(items)` qayta render bermaydi; `setItems([...items, x])` beradi. Komponentdagi derived qiymatlarni (filtrlangan ro'yxat, jami summa) sof funksiya sifatida render paytida hisoblang, effekt va qo'shimcha state bilan emas (92-dars).
- **Reducer'lar.** `useReducer` reducer'i sof funksiya bo'lishi kerak: (state, action) dan yangi state. Bu core/shell bo'linishining kichik namunasi: reducer core, dispatch qiladigan event handler shell.
- **NestJS service.** Hisob-kitob, validatsiya va qaror qoidalarini service ichidagi private metodlardan alohida sof funksiyalarga (masalan, `pricing.ts`) chiqaring. Service shell bo'lib qoladi: repository'dan o'qiydi, sof funksiyani chaqiradi, natijani yozadi.
- **Kesh va DTO'lar.** Keshdan (Redis'dan parse qilingan yoki xotiradagi) olingan obyektni o'zgartirmang. Xotiradagi keshda bu boshqa so'rovlarga ta'sir qiladi.

## Xulosa

- Sof funksiya natijasi faqat argumentlarga bog'liq va kuzatiladigan side effect'ga ega emas. Bu lokal tushunish, mock'siz test va xavfsiz kombinatsiya beradi.
- Joriy vaqt, tasodifiy son va konfiguratsiya - yashirin kirishlar. Ularni argument qiling.
- Functional core, imperative shell: qarorlar sof core'da, I/O yupqa shell'da; ular orasidagi chegara oddiy qiymatlar.
- TypeScript'da `readonly` massiv parametrlari va `as const` arzon himoya beradi, lekin ular sayoz va faqat kompilyatsiya vaqtida ishlaydi.
- Soflik tashqi kuzatuvchiga nisbiy: funksiya ichidagi lokal mutatsiya normal.
