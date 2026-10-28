---
n: 51
slug: cohesion-coupling
title: "Cohesion va coupling"
summary: "Modul dizaynidagi eng eski va eng foydali ikki o'lchov: modul ichidagi narsalar qanchalik bir-biriga tegishli (cohesion) va modullar bir-biriga qanchalik bog'liq (coupling). Bu darsda ularning turlarini, nega ular o'zgarish narxini belgilashini va TypeScript loyihasida ularni qanday ko'rish mumkinligini ko'ramiz."
duration: 35
sources:
  - id: code-complete
    note: "Dizayn haqidagi bob (loose coupling va strong cohesion maqsadlari, coupling turlari) va routine'lar haqidagi bob (cohesion turlari: functional, sequential, communicational, temporal, procedural, logical, coincidental)"
  - id: aposd
    note: "Information hiding va information leakage, \"Better Together or Better Apart?\" bobi: qachon kodni birlashtirish va qachon ajratish kerak"
  - id: clean-arch
    note: "Komponent cohesion (REP, CCP, CRP) va komponent coupling (ADP, SDP, SAP) haqidagi boblar"
quiz:
  - q: "Ikki modul hech qanday import qilmaydi, lekin ikkalasi ham buyurtma holati `status === 3` \"yetkazilgan\" degani ekanini bilib ishlaydi. Bu qanday bog'liqlik?"
    options:
      - "Bog'liqlik yo'q, chunki import yo'q"
      - "Data coupling, chunki ikkalasi ham bir xil ma'lumot bilan ishlaydi"
      - "Semantik (yashirin) coupling: bir modul ikkinchisining ichki qarori haqidagi bilimga tayanadi"
      - "Temporal cohesion"
    answer: 2
    explain: "McConnell semantik coupling'ni eng xavfli tur deb ataydi: kompilyator ham, import grafi ham uni ko'rsatmaydi. Ousterhout buni information leakage deydi: bitta dizayn qarori (3 = yetkazilgan) ikki joyda yashaydi va bittasini o'zgartirsangiz ikkinchisi jim buziladi."
  - q: "`utils.ts` faylida `formatPhone`, `retryFetch`, `calculateFuelCost` va `slugify` funksiyalari bor. Bu faylning cohesion'i qanday?"
    options:
      - "Coincidental: funksiyalarni faqat \"qayerga qo'yishni bilmadik\" degan sabab birlashtirgan"
      - "Functional: hammasi yordamchi funksiya"
      - "Communicational: hammasi bir xil ma'lumot bilan ishlaydi"
      - "Sequential: biri ikkinchisining natijasini oladi"
    answer: 0
    explain: "Bu funksiyalar birga o'zgarmaydi, bir xil ma'lumot bilan ishlamaydi va bitta maqsadga xizmat qilmaydi. Bu eng past daraja - coincidental cohesion. Natija: fayl hamma joydan import qilinadi va keraksiz coupling hosil qiladi."
  - q: "Quyidagilardan qaysi biri coupling'ni haqiqatan kamaytiradi?"
    options:
      - "Har bir klass uchun interfeys yaratish, hatto bitta implementatsiya bo'lsa ham"
      - "Modullar orasidagi bog'liqlikni event bus orqali o'tkazish, lekin xabar formatini ikkala tomon ham ichki tafsilotlarigacha bilishi"
      - "Kodni ko'proq faylga bo'lish"
      - "Modul tashqariga chiqaradigan bilim miqdorini kamaytirish: kamroq va soddaroq interfeys, ichki qarorlarni yashirish"
    answer: 3
    explain: "Coupling - bu fayllar yoki importlar soni emas, modullar bir-biri haqida qancha bilishi. Interfeys qo'shish yoki event bus ishlatish bilimni kamaytirmasa, coupling joyida qoladi, faqat ko'rinmas bo'ladi."
  - q: "Ousterhout \"Better Together or Better Apart?\" savolida qaysi holatda ikki kod bo'lagini birlashtirishni tavsiya qiladi?"
    options:
      - "Har doim, chunki kam fayl yaxshi"
      - "Ular bir-birini tushunmasdan turib tushunib bo'lmasa yoki ma'lumot ulashsa, yoki birlashtirish interfeysni soddalashtirsa"
      - "Hech qachon, chunki kichik modul yaxshi"
      - "Faqat ular bir xil fayl nomiga ega bo'lsa"
    answer: 1
    explain: "Ousterhout bir nechta belgi sanaydi: ma'lumot ulashish, birgalikda ishlatilish, konseptual bir-biriga tegishlilik, bir-birini tushunmasdan tushunib bo'lmaslik. Bunday holatda ajratish faqat interfeyslarni ko'paytirib, murakkablikni oshiradi."
  - q: "Clean Architecture'dagi Common Closure Principle (CCP) qaysi g'oyaning komponent darajasidagi ko'rinishi?"
    options:
      - "Dependency Inversion"
      - "Interface Segregation"
      - "Single Responsibility: birga o'zgaradigan narsalarni birga yig'ish, turli sabab bilan o'zgaradiganlarni ajratish"
      - "Liskov Substitution"
    answer: 2
    explain: "Martin CCP'ni SRP'ning komponentlar uchun qayta aytilishi deb tushuntiradi. Cohesion'ning amaliy ta'rifi ham shu: birga o'zgaradigan narsalar bitta modulda yashashi kerak."
task:
  title: "Fleet modulidagi yashirin coupling'ni topish va bartaraf etish"
  prompt: |
    Quyida transport parki uchun ikki modul bor: yoqilg'i hisoboti va ogohlantirishlar. Ular ishlaydi, lekin yangi talab keldi: **yoqilg'i quyish hodisasini aniqlash chegarasi 5 litrdan 8 litrga o'zgaradi va endi u har bir mashina tipiga qarab farq qiladi**.

    1. Bu talabni amalga oshirish uchun hozir nechta joyni o'zgartirish kerakligini sanang.
    2. Semantik coupling qayerda ekanini aniqlang (bir xil bilim ikki joyda).
    3. Kodni shunday qayta tuzingki, yoqilg'i hodisasini aniqlash bilimi bitta modulda bo'lsin va boshqa modullar faqat uning natijasidan foydalansin.
    4. `utils` faylini kerakli joylarga tarqating.
  lang: ts
  starter: |
    // utils.ts
    export function formatLiters(v: number): string {
      return `${v.toFixed(1)} L`;
    }
    export function isRefuel(prev: number, curr: number): boolean {
      return curr - prev > 5;
    }
    export function formatPlate(p: string): string {
      return p.toUpperCase().replace(/\s+/g, "");
    }

    // fuel-report.ts
    import { formatLiters, isRefuel } from "./utils";
    type Reading = { vehicleId: string; liters: number; at: Date };
    export function buildRefuelReport(readings: Reading[]): string[] {
      const lines: string[] = [];
      for (let i = 1; i < readings.length; i++) {
        if (isRefuel(readings[i - 1].liters, readings[i].liters)) {
          const added = readings[i].liters - readings[i - 1].liters;
          lines.push(`${readings[i].vehicleId}: +${formatLiters(added)}`);
        }
      }
      return lines;
    }

    // alerts.ts
    type Sample = { vehicleId: string; liters: number; at: Date };
    export function findSuspiciousRefuels(samples: Sample[]): Sample[] {
      const result: Sample[] = [];
      for (let i = 1; i < samples.length; i++) {
        const diff = samples[i].liters - samples[i - 1].liters;
        const hour = samples[i].at.getHours();
        if (diff > 5 && (hour < 6 || hour > 22)) result.push(samples[i]);
      }
      return result;
    }
  solution: |
    // fuel/refuel-detection.ts
    export type VehicleType = "truck" | "van" | "car";
    export type FuelReading = { vehicleId: string; vehicleType: VehicleType; liters: number; at: Date };
    export type RefuelEvent = { vehicleId: string; addedLiters: number; at: Date };

    const REFUEL_THRESHOLD_LITERS: Record<VehicleType, number> = {
      truck: 8,
      van: 8,
      car: 8,
    };

    export function detectRefuels(readings: readonly FuelReading[]): RefuelEvent[] {
      const events: RefuelEvent[] = [];
      for (let i = 1; i < readings.length; i++) {
        const prev = readings[i - 1];
        const curr = readings[i];
        const added = curr.liters - prev.liters;
        if (added > REFUEL_THRESHOLD_LITERS[curr.vehicleType]) {
          events.push({ vehicleId: curr.vehicleId, addedLiters: added, at: curr.at });
        }
      }
      return events;
    }

    // fuel/fuel-report.ts
    import { detectRefuels, type FuelReading } from "./refuel-detection";

    function formatLiters(v: number): string {
      return `${v.toFixed(1)} L`;
    }

    export function buildRefuelReport(readings: readonly FuelReading[]): string[] {
      return detectRefuels(readings).map((e) => `${e.vehicleId}: +${formatLiters(e.addedLiters)}`);
    }

    // alerts/suspicious-refuels.ts
    import { detectRefuels, type FuelReading, type RefuelEvent } from "../fuel/refuel-detection";

    const NIGHT_START_HOUR = 22;
    const NIGHT_END_HOUR = 6;

    function isNight(at: Date): boolean {
      const hour = at.getHours();
      return hour < NIGHT_END_HOUR || hour >= NIGHT_START_HOUR;
    }

    export function findSuspiciousRefuels(readings: readonly FuelReading[]): RefuelEvent[] {
      return detectRefuels(readings).filter((e) => isNight(e.at));
    }
  solutionNotes: |
    - Starter'da "yoqilg'i quyildi" degan bilim ikki joyda edi: `utils.isRefuel` va `alerts.ts` ichidagi `diff > 5`. Talab o'zgarsa, ikkinchisi esdan chiqishi aniq. Bu semantik coupling.
    - Endi aniqlash qoidasi bitta modulda (`refuel-detection`) va tashqariga faqat `RefuelEvent` chiqadi. Hisobot va ogohlantirish modullari chegara qiymatini bilmaydi.
    - `utils.ts` yo'qoldi: `formatLiters` faqat hisobotda ishlatiladi, shuning uchun o'sha yerda yashaydi. `formatPlate` hech qayerda ishlatilmagan edi.
    - Ikki xil `Reading` va `Sample` tipi bitta `FuelReading`ga birlashdi: bir tushuncha - bir tip.
    - Mashina tipiga qarab chegara hozircha hammasi uchun 8. Jadval kelajakdagi farqni bitta joyga tushiradi, lekin biz qiymatlarni o'ylab topmadik.
    - Kechasi chegarasidagi kichik xato (`hour > 22` 22:xx ni o'tkazib yuborardi) nomlangan konstanta bilan ko'rinadigan bo'ldi. Bunday xatti-harakat o'zgarishini alohida commit va test bilan qayd qiling.
  checklist:
    - "Chegara qiymati kod bazasida faqat bitta joyda yozilgan"
    - "Hisobot va ogohlantirish modullari aniqlash algoritmini emas, uning natijasini ishlatadi"
    - "Coincidental cohesion'li utils fayli qolmadi"
    - "Bir xil tushuncha uchun bitta tip ishlatiladi"
    - "Xatti-harakatdagi har qanday o'zgarish (masalan, soat 22) ongli qaror sifatida belgilangan"
---

## Muammo

Kichik o'zgarish uchun beshta faylga tegish kerak bo'lgan loyihani hamma ko'rgan. Mijoz "buyurtmani bekor qilish 24 soat emas, 48 soat ichida mumkin bo'lsin" deydi. Siz `OrderService`ni o'zgartirasiz, keyin frontend'dagi tugma hali ham 24 soatdan keyin yashirinayotganini, email shablonida "24 soat" deb yozilganini va hisobot modulida bekor qilinganlar boshqa formula bilan sanalayotganini topasiz. Har bir joy alohida o'zgarish va har biri esdan chiqishi mumkin bo'lgan nuqta.

Teskari holat ham bor: `OrderService` 3000 qatorga yetgan, unda to'lov, yetkazib berish, chegirma, PDF generatsiya va SMS bor. Har qanday o'zgarish shu faylga tushadi, merge conflict'lar odatiy holga aylanadi va to'lovdagi tuzatish SMS yuborishni buzib qo'yadi.

Ikkala muammoning ildizi bitta: kod **o'zgarish chiziqlari** bo'yicha emas, tasodifiy chiziqlar bo'yicha bo'lingan. Buni o'lchash uchun dasturlashda 1970-yillardan beri ikkita tushuncha ishlatiladi: cohesion va coupling.

## Asosiy g'oya

**Cohesion** (bog'langanlik, ichki birlik) - modul ichidagi elementlar qanchalik bitta maqsadga xizmat qilishi. **Coupling** (bog'liqlik) - bir modulni tushunish yoki o'zgartirish uchun boshqa modul haqida qancha bilish kerakligi.

Bu atamalarni Larry Constantine va hamkasblari strukturali dizayn davrida kiritgan. Steve McConnell *Code Complete*da ularni dizaynning markaziy maqsadlari qatoriga qo'yadi: **loose coupling** (modullar orasida kam va oddiy bog'lanish) va **strong cohesion** (modul ichida kuchli birlik). Ikkalasi bir tanganing ikki tomoni: agar har bir modul o'z ishiga to'liq javob bersa, boshqalarga kamroq bog'liq bo'ladi.

Amaliy ta'rif shunday: **birga o'zgaradigan narsalar birga yashashi, turli sabab bilan o'zgaradigan narsalar alohida yashashi kerak**. Robert Martin *Clean Architecture*da shu g'oyani komponentlar darajasida Common Closure Principle deb ataydi va uni Single Responsibility'ning komponentlar uchun versiyasi deb tushuntiradi (53-dars).

Bu ta'rif muhim, chunki u cohesion'ni subyektiv "bu narsalar bir-biriga o'xshaydi" degan hissiyotdan ajratadi. Ikki funksiya o'xshash ko'rinishi mumkin, lekin turli biznes sabablari bilan o'zgarsa, ularni birlashtirish noto'g'ri. Va aksincha, butunlay boshqacha ko'rinadigan ikki kod (SQL so'rov va React komponent) bitta talab bilan birga o'zgarsa, ular bir-biriga yaqin turishi kerak.

## Chuqurroq: turlar, yashirin bog'lanish va o'lchov

### Cohesion darajalari

McConnell routine'lar haqidagi bobda cohesion turlarini yuqoridan pastga qarab sanaydi. Ularni modullarga ham qo'llash mumkin:

- **Functional** - modul bitta aniq ishni bajaradi va undagi hamma narsa shu ishga xizmat qiladi (`calculateTripDistance`). Maqsad shu.
- **Sequential** - qadamlar ketma-ket bajariladi va har biri oldingisining natijasini oladi. Ko'pincha qabul qilinadi.
- **Communicational** - amallar bir xil ma'lumot ustida ishlaydi, lekin boshqacha bog'liq emas (hisobotni chiqarish va uni keshlash).
- **Temporal** - narsalar faqat bir vaqtda bajarilgani uchun birga (`onAppStart` ichida config o'qish, cache tozalash, metrikalarni ishga tushirish). McConnell bunday routine'ni ishlarni o'zi qilmasdan, boshqa routine'larni chaqiradigan orkestrator qilishni maslahat beradi.
- **Procedural** - amallar ma'lum tartibda bajariladi, lekin tartibdan boshqa bog'lanish yo'q.
- **Logical** - bir nechta ish bitta funksiyada, ichida flag bo'yicha tanlanadi (`process(type)` va ichida katta `switch`). Bu flag argument muammosi (23-dars).
- **Coincidental** - hech qanday bog'lanish yo'q. Klassik misol: `utils.ts`, `helpers.ts`, `common` paketi.

Bu ro'yxatni yodlash shart emas. Foydali savol bitta: **bu modul nima uchun mavjud, buni bir jumlada ayta olamanmi va undagi har bir element shu jumlaga tegishlimi?**

### Coupling turlari

McConnell coupling'ni ham turlarga ajratadi: oddiy ma'lumot parametrlari orqali bog'lanish (eng yengil), obyekt orqali bog'lanish, obyekt parametr orqali va eng yomoni - **semantik coupling**. Semantik coupling'da bir modul ikkinchisining ichki ishlashi haqidagi bilimga tayanadi: "bu funksiyani chaqirishdan oldin `init()` chaqirilgan bo'lishi kerak", "`status === 3` yetkazilgan degani", "bu massiv har doim sana bo'yicha tartiblangan keladi".

Bu tur eng xavfli, chunki uni hech qanday vosita ko'rsatmaydi. Import grafi toza bo'lishi, `dependency-cruiser` hech qanday ogohlantirish bermasligi mumkin, lekin ikki modul bitta yashirin taxmin bilan bog'langan.

John Ousterhout *A Philosophy of Software Design*da xuddi shu hodisani **information leakage** deb ataydi: bitta dizayn qarori bir nechta modulda aks etadi. Uning muhim kuzatuvi: leakage import bo'lmasa ham mavjud bo'lishi mumkin. Masalan, fayl formatini o'qiydigan va yozadigan ikki alohida klass bir xil formatni bilishi kerak. Ular bir-birini chaqirmaydi, lekin format o'zgarsa ikkalasi ham o'zgaradi. Ousterhout'ning yechimi: bu bilimni bitta modulga yig'ish.

### Coupling - bu bilim, fayl soni emas

Eng keng tarqalgan xato - coupling'ni sintaktik bog'lanish deb tushunish va uni sun'iy usullar bilan "kamaytirish":

- Har bir klass uchun interfeys yaratish. Agar chaqiruvchi interfeysdagi har bir metodni va uning nozik xatti-harakatini bilishi kerak bo'lsa, bilim kamaymadi.
- To'g'ridan-to'g'ri chaqiriq o'rniga event bus. Agar listener hodisa payload'ining ichki tuzilishini, kelish tartibini va qachon yuborilishini bilishi kerak bo'lsa, coupling saqlanib qoldi, faqat endi u qidirib topib bo'lmaydigan bo'ldi.
- Kodni ko'proq faylga bo'lish. Ousterhout ta'kidlaydiki, ajratish o'zi murakkablik qo'shadi: yangi interfeyslar, kod orasida sakrash, takrorlanish ehtimoli.

Haqiqiy o'lchov: **modul A o'zgarganda, modul B ham o'zgarishi kerak bo'lish ehtimoli qanday?** Agar bu ehtimol yuqori bo'lsa, ular bog'langan, qanday yozilganidan qat'i nazar.

### Birga yoki alohida

Ousterhout alohida bobni shu savolga bag'ishlaydi va bir nechta belgi beradi. Ikki kod bo'lagini birlashtirish foydali, agar ular ma'lumot ulashsa, doim birga ishlatilsa, konseptual bir-biriga tegishli bo'lsa yoki birini ikkinchisisiz tushunib bo'lmasa. Ajratish foydali, agar kod umumiy maqsadli mexanizm va maxsus foydalanishni aralashtirsa: umumiy qismni pastki modulga, maxsus qismni yuqoriga.

Bu yerda Martin va Ousterhout o'rtasida urg'u farqi bor. Martin kichik klasslar va funksiyalar tomoniga ko'proq og'adi, Ousterhout esa haddan tashqari bo'lish ham murakkablik ekanini ko'proq ta'kidlaydi (52 va 59-darslar). Ikkalasi ham cohesion va coupling'ni asosiy mezon deb biladi, faqat qaysi xatoni ko'proq uchratganlari farq qiladi.

### Komponent darajasida

Martin *Clean Architecture*da bu g'oyalarni paketlar va komponentlar darajasiga ko'taradi. Cohesion uchun uchta tamoyil: REP (birga reliz qilinadigan narsalar birga), CCP (birga o'zgaradigan narsalar birga) va CRP (birga ishlatilmaydigan narsalarni majburan birga import qildirmang). Coupling uchun: bog'liqliklar grafida sikl bo'lmasin (ADP), barqaror tomonga qarab bog'laning (SDP), barqaror komponentlar abstrakt bo'lsin (SAP). Martin ta'kidlaydiki, uchta cohesion tamoyili bir-biri bilan tortishadi va loyiha yetuklashgan sari muvozanat o'zgaradi. Bularni 85-darsda batafsil ko'ramiz.

## Misol: buyurtmani bekor qilish qoidasi

Yomon holat: bitta biznes qoidasi uch joyda.

```ts
// orders/order.service.ts
export class OrderService {
  canCancel(order: { createdAt: Date; status: number }): boolean {
    const hours = (Date.now() - order.createdAt.getTime()) / 3_600_000;
    return order.status === 1 && hours < 24;
  }
}

// notifications/order-emails.ts
export function cancellationHint(createdAt: Date): string {
  const deadline = new Date(createdAt.getTime() + 24 * 3_600_000);
  return `Buyurtmani ${deadline.toLocaleString("uz-UZ")} gacha bekor qilishingiz mumkin`;
}

// reports/cancellations.ts
export function lateCancellations(rows: { createdAt: Date; cancelledAt: Date; status: number }[]) {
  return rows.filter(
    (r) => r.status === 4 && r.cancelledAt.getTime() - r.createdAt.getTime() > 24 * 3_600_000,
  );
}
```

Uch modul bir-birini import qilmaydi. Formal ravishda coupling yo'q. Amalda esa ular ikki yashirin bilim bilan bog'langan: "24 soat" va "status 1 - yangi, 4 - bekor qilingan". Bu semantik coupling va information leakage.

Yaxshilangan holat: qoida bitta modulda, boshqalar uning natijasidan foydalanadi.

```ts
// orders/cancellation-policy.ts
export type OrderStatus = "new" | "paid" | "shipped" | "cancelled";

const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

export function cancellationDeadline(createdAt: Date): Date {
  return new Date(createdAt.getTime() + CANCELLATION_WINDOW_MS);
}

export function canCancel(order: { createdAt: Date; status: OrderStatus }, now: Date): boolean {
  return order.status === "new" && now < cancellationDeadline(order.createdAt);
}

export function wasCancelledLate(order: { createdAt: Date; cancelledAt: Date }): boolean {
  return order.cancelledAt > cancellationDeadline(order.createdAt);
}
```

```ts
// notifications/order-emails.ts
import { cancellationDeadline } from "../orders/cancellation-policy";

export function cancellationHint(createdAt: Date): string {
  const deadline = cancellationDeadline(createdAt).toLocaleString("uz-UZ");
  return `Buyurtmani ${deadline} gacha bekor qilishingiz mumkin`;
}
```

Nima o'zgardi:

- **Coupling ko'rinadigan bo'ldi.** Email moduli endi `cancellation-policy`ni import qiladi. Bu bog'liqlik avval ham bor edi, faqat yashirin edi. Import - yaxshi narsa: uni IDE, linter va code review ko'radi.
- **Coupling kamaydi.** Email moduli endi "24 soat" ni bilmaydi, faqat "muddat bor" degan tushunchani biladi. 48 soatga o'zgartirish bitta qatorda.
- **Cohesion oshdi.** Bekor qilish siyosatiga oid hamma narsa bitta faylda. Fayl nima uchun mavjudligini bir jumlada aytish mumkin.
- **Magic number holatlar union tipga aylandi.** `status === 4` jumbog'i yo'qoldi (44-darsdagi primitive obsession).
- **`now` parametr bo'ldi.** `Date.now()` ichida yashirin bog'liqlik edi. Endi funksiya sof va testlanadi.

E'tibor bering: biz `ICancellationPolicy` interfeysi va DI qilmadik. Bitta implementatsiya bor va yaqin orada boshqasi kutilmaydi. Coupling'ni kamaytirgan narsa abstraksiya qatlami emas, bilimni bitta joyga yig'ish.

## Qachon qo'llamaslik kerak

- **Coupling'ni nolga tushirishga urinish.** Bog'lanishsiz tizim hech narsa qilmaydi. Maqsad - kerakli bog'lanishni ko'rinadigan, kam va barqaror qilish. Ba'zi bog'lanish to'g'ri: buyurtma modulining pul tipi (`Money`) ga bog'liqligi muammo emas.
- **DRY'ni cohesion bilan aralashtirish.** Ikki joyda bir xil `24` turishi har doim bitta bilim degani emas. Agar bittasi bekor qilish muddati, ikkinchisi sessiya muddati bo'lsa, ularni bitta konstantaga birlashtirish soxta coupling yaratadi (8-dars). Savol "kod o'xshashmi" emas, "ular birga o'zgaradimi".
- **Har bir funksiyani alohida faylga ko'chirish.** Functional cohesion'ga intilib, kodni o'nlab mayda modullarga bo'lsangiz, cohesion yo'qolmaydi, u modullar orasidagi coupling'ga aylanadi.
- **Erta bosqichda qat'iy chegaralar.** Domen hali tushunilmagan bo'lsa, qaysi narsalar birga o'zgarishini bilmaysiz. Bu bosqichda bir oz katta, lekin oson ko'chiriladigan modul qat'iy, lekin noto'g'ri chegaradan yaxshiroq. Martin ham komponent cohesion tamoyillari muvozanati loyiha hayoti davomida o'zgarishini yozadi.
- **Metrikaga sig'inish.** LCOM kabi cohesion metrikalari va import soni signal beradi, lekin semantik coupling'ni ko'rmaydi. Ulardan qaror emas, savol uchun foydalaning.

## Stack'da: NestJS, monorepo va import grafi

- **NestJS modullari.** `@Module` chegarasi cohesion chegarasi bo'lishi kerak: `FleetModule`, `FuelModule`, `BillingModule`. Texnik qatlam bo'yicha (`ServicesModule`, `RepositoriesModule`) bo'lish odatda coincidental cohesion beradi, chunki bitta talab hamma qatlamni kesib o'tadi (38-dars). Modul `exports` ro'yxatini kichik tuting: eksport qilinmagan provider boshqa modul uchun yashirin.
- **Barrel fayllar (`index.ts`).** Ular modulning ommaviy interfeysini belgilash uchun foydali, lekin hamma narsani qayta eksport qilsa, ichki tafsilotlar ochiq qoladi. Faqat tashqariga kerak bo'lganini eksport qiling.
- **Shared tiplar paketi.** Monorepoda frontend va backend o'rtasidagi DTO tiplarini ulashish coupling'ni ko'rinadigan qiladi va bu yaxshi. Lekin u yerga Prisma modellarini to'g'ridan-to'g'ri qo'yish ma'lumotlar bazasi sxemasini frontend'ga oqizadi: endi ustun nomini o'zgartirish React komponentini buzadi.
- **Import grafini tekshirish.** `dependency-cruiser` yoki ESLint `no-restricted-imports` bilan "reports moduli orders ichki fayllarini import qilmasin" kabi qoidalar qo'ying. Bu sintaktik coupling'ni nazorat qiladi, semantik coupling'ni esa code review va yuqoridagi "birga o'zgaradimi" savoli bilan ushlaysiz.
- **Ma'lumotlar bazasi ham coupling.** Ikki servis bir jadvalni to'g'ridan-to'g'ri o'qisa, ular jadval sxemasi orqali bog'langan. Bu eng qiyin ko'rinadigan bog'lanishlardan biri.

## Xulosa

- Cohesion - modul ichidagi elementlar bitta maqsadga qanchalik xizmat qilishi. Coupling - bir modulni o'zgartirish uchun boshqasi haqida qancha bilish kerakligi.
- Amaliy mezon: birga o'zgaradigan narsalar birga, turli sabab bilan o'zgaradiganlar alohida.
- Eng xavfli coupling - semantik: import yo'q, lekin bitta yashirin bilim ikki joyda. Ousterhout buni information leakage deydi.
- Coupling fayllar yoki importlar soni emas, bilim miqdori. Interfeys yoki event bus bilimni kamaytirmasa, coupling'ni faqat yashiradi.
- Bog'liqlikni ko'rinadigan qilish (import) uni yashirishdan yaxshi. Keyin uni kichik va barqaror interfeys orqali o'tkazing.
- `utils` kabi coincidental cohesion'li modullar keraksiz coupling manbai. Funksiyani u ishlatiladigan joyga yaqin qo'ying.
