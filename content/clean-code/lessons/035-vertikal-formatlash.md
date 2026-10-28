---
n: 35
slug: vertikal-formatlash
title: "Vertikal formatlash: fayl ichki tuzilishi"
summary: "Fayl yuqoridan pastga gazeta maqolasi kabi o'qilishi kerak: avval asosiy g'oya, keyin detallar. Bu darsda bo'sh qatorlar, vertikal zichlik va masofa, chaqiruvchi va chaqiriladigan funksiyalar tartibi, fayl hajmi va TypeScript modulining ichki tuzilishini ko'ramiz."
duration: 30
sources:
  - id: cc1
    note: "Formatlash haqidagi bob: gazeta metaforasi, vertikal ochiqlik, zichlik va masofa, vertikal tartib, kontseptual yaqinlik"
  - id: code-complete
    note: "Layout va uslub haqidagi bob: formatlashning asosiy maqsadi - mantiqiy tuzilmani ko'rsatish"
quiz:
  - q: "Martinning \"gazeta metaforasi\" fayl tuzilishi haqida nima deydi?"
    options:
      - "Fayl ustunlarga bo'linishi kerak"
      - "Yuqorida eng muhim, yuqori darajadagi tushunchalar, pastga tushgan sari detallar"
      - "Har bir funksiya sarlavha kommentiga ega bo'lishi kerak"
      - "Fayl alifbo tartibida tuzilishi kerak"
    answer: 1
    explain: "Gazeta maqolasida sarlavha va birinchi abzats butun hikoyani beradi, detallar pastda. Fayl ham shunday: nomi va yuqori qismi o'quvchiga modul nima haqida ekanini aytsin, past darajadagi yordamchilar pastda bo'lsin."
  - q: "Quyidagi holatlardan qaysi biri vertikal masofa qoidasini buzadi?"
    options:
      - "O'zgaruvchi ishlatilishidan bir qator oldin e'lon qilingan"
      - "Bir-birini chaqiradigan ikki funksiya yonma-yon turibdi"
      - "Funksiya boshida e'lon qilingan `retryCount` o'zgaruvchisi faqat 80 qator pastda, funksiya oxirida ishlatiladi"
      - "Import'lar fayl boshida"
    answer: 2
    explain: "Bir-biriga bog'liq tushunchalar vertikal yaqin bo'lishi kerak. 80 qator uzoqdagi e'lon o'quvchini yuqoriga-pastga sakrashga majbur qiladi. Yechim: o'zgaruvchini ishlatilish joyiga yaqinlashtirish yoki funksiyani bo'lish."
  - q: "Bo'sh qatorlarning asosiy vazifasi nima?"
    options:
      - "Faylni uzunroq ko'rsatish"
      - "Prettier talab qilgani uchun"
      - "Kodni tezroq ishga tushirish"
      - "Alohida fikrlarni ajratib ko'rsatish: bo'sh qator yangi mantiqiy qadam boshlanganini bildiradi"
    answer: 3
    explain: "Martin bo'sh qatorlarni matndagi abzatslarga o'xshatadi: ular fikrlar orasidagi chegarani ko'rsatadi. Aksincha, bir-biriga yaqin qatorlar zich turishi kerak. McConnell ham formatlashning asosiy maqsadini kodning mantiqiy tuzilishini ko'rsatish deb biladi."
  - q: "TypeScript modulida funksiyalar tartibi bo'yicha qaysi tavsiya to'g'ri?"
    options:
      - "Eksport qilinadigan asosiy funksiya yuqorida, u chaqiradigan private yordamchilar pastda, chaqirilish tartibida. Function declaration hoisting bunga imkon beradi"
      - "Barcha funksiyalar alifbo tartibida"
      - "Yordamchilar har doim yuqorida bo'lishi kerak, aks holda kod ishlamaydi"
      - "Tartibning ahamiyati yo'q"
    answer: 0
    explain: "Martin chaqiruvchini chaqiriladigandan yuqoriga qo'yishni tavsiya qiladi. JS/TS'da `function` deklaratsiyalari hoisting qilinadi, shuning uchun bu ishlaydi. Lekin `const helper = () => {}` ko'rinishidagi arrow funksiyalar modul yuklanganda darhol chaqirilsa TDZ xatosi beradi, faqat chaqiruv keyinroq bo'lsa ishlaydi."
  - q: "600 qatorli `vehicle.service.ts` faylida `// ===== GPS =====`, `// ===== FUEL =====`, `// ===== REPORTS =====` bo'limlari bor. Eng yaxshi qadam qaysi?"
    options:
      - "Bo'lim belgilarini kattaroq qilish"
      - "Faylni bo'limlarga mos alohida service'larga bo'lish va ularning har biri bitta tushunchaga ega bo'lishi"
      - "Funksiyalarni alifbo bo'yicha saralash"
      - "Hamma narsani bitta katta funksiyaga birlashtirish"
    answer: 1
    explain: "Pozitsiya belgilari bu yerda fayl bir nechta mustaqil tushunchani saqlayotganini ko'rsatadi. Har biri o'z fayli va klassiga ega bo'lsa, fayl nomi tushunchani aytadi va belgilar keraksiz bo'ladi (53-dars, 59-dars)."
task:
  title: "Faylni yuqoridan pastga o'qiladigan qilish"
  prompt: |
    Quyidagi fayl ishlaydi, lekin uni yuqoridan pastga o'qib bo'lmaydi: yordamchilar yuqorida, asosiy funksiya oxirida, o'zgaruvchilar ishlatilishidan uzoqda e'lon qilingan, bo'sh qatorlar tasodifiy.

    Faylni qayta tartiblang:
    1. Eksport qilinadigan asosiy funksiya yuqorida, yordamchilar pastda, chaqirilish tartibida.
    2. Tiplar va konstantalar fayl boshida, lekin faqat shu fayldagi ma'nosiga ko'ra guruhlangan.
    3. O'zgaruvchilarni ishlatilish joyiga yaqinlashtiring.
    4. Bo'sh qatorlar bilan mantiqiy qadamlarni ajrating.
    Xatti-harakat o'zgarmasligi kerak.
  lang: ts
  starter: |
    function formatKm(m: number): string {
      return `${(m / 1000).toFixed(1)} km`;
    }
    type TripPoint = { lat: number; lng: number; at: Date };
    function haversineMeters(a: TripPoint, b: TripPoint): number {
      const R = 6_371_000;
      const toRad = (d: number) => (d * Math.PI) / 180;
      const dLat = toRad(b.lat - a.lat);
      const dLng = toRad(b.lng - a.lng);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.asin(Math.sqrt(h));
    }


    const MAX_JUMP_METERS = 2_000;
    export type TripSummary = { distance: string; durationMin: number; skippedJumps: number };
    export function summarizeTrip(points: TripPoint[]): TripSummary {
      let skipped = 0;
      let total = 0;
      const first = points[0];
      const last = points[points.length - 1];
      if (points.length < 2) {
        return { distance: formatKm(0), durationMin: 0, skippedJumps: 0 };
      }
      for (let i = 1; i < points.length; i++) {
        const d = haversineMeters(points[i - 1], points[i]);

        if (d > MAX_JUMP_METERS) { skipped++; continue; }
        total += d;
      }
      const durationMin = Math.round((last.at.getTime() - first.at.getTime()) / 60_000);
      return { distance: formatKm(total), durationMin, skippedJumps: skipped };
    }
  solution: |
    type TripPoint = { lat: number; lng: number; at: Date };

    export type TripSummary = { distance: string; durationMin: number; skippedJumps: number };

    /** Ikki ketma-ket nuqta orasidagi bundan katta sakrash GPS xatosi deb hisoblanadi. */
    const MAX_JUMP_METERS = 2_000;
    const EARTH_RADIUS_METERS = 6_371_000;

    export function summarizeTrip(points: TripPoint[]): TripSummary {
      if (points.length < 2) {
        return { distance: formatKm(0), durationMin: 0, skippedJumps: 0 };
      }

      let totalMeters = 0;
      let skippedJumps = 0;
      for (let i = 1; i < points.length; i++) {
        const segmentMeters = haversineMeters(points[i - 1], points[i]);
        if (segmentMeters > MAX_JUMP_METERS) {
          skippedJumps++;
          continue;
        }
        totalMeters += segmentMeters;
      }

      const first = points[0];
      const last = points[points.length - 1];
      const durationMin = Math.round((last.at.getTime() - first.at.getTime()) / 60_000);

      return { distance: formatKm(totalMeters), durationMin, skippedJumps };
    }

    function haversineMeters(a: TripPoint, b: TripPoint): number {
      const dLat = toRadians(b.lat - a.lat);
      const dLng = toRadians(b.lng - a.lng);
      const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
      return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
    }

    function toRadians(degrees: number): number {
      return (degrees * Math.PI) / 180;
    }

    function formatKm(meters: number): string {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  solutionNotes: |
    - **Gazeta tartibi:** fayl `summarizeTrip` bilan boshlanadi. O'quvchi birinchi 25 qatorda modul nima qilishini to'liq ko'radi, matematik detallar pastda.
    - **Chaqiruv tartibi:** `summarizeTrip` -> `haversineMeters` -> `toRadians`, keyin `formatKm`. `function` deklaratsiyalari hoisting qilingani uchun bu tartib xavfsiz.
    - **Vertikal masofa:** `first` va `last` faqat davomiylikni hisoblashda kerak, shuning uchun ular aynan o'sha joyga ko'chirildi. Asl kodda ular guard clause'dan oldin e'lon qilingan edi.
    - **Bo'sh qatorlar** uch mantiqiy qadamni ajratadi: guard, masofani yig'ish, davomiylik va natija. Asl koddagi sikl ichidagi tasodifiy bo'sh qator va fayl o'rtasidagi ikki bo'sh qator olib tashlandi.
    - **Konstantalar** bir joyga yig'ildi; `R` nomlangan konstantaga aylandi, `MAX_JUMP_METERS`ga "nega" kommenti qo'shildi.
    - Ichki arrow `toRad` alohida funksiyaga chiqdi: u ikki marta ishlatiladi va nomi bilan o'qiladi.
  checklist:
    - "Eksport qilinadigan asosiy funksiya fayl yuqori qismida"
    - "Yordamchilar chaqirilish tartibida, chaqiruvchidan pastda"
    - "O'zgaruvchilar ishlatilish joyiga yaqin e'lon qilingan"
    - "Bo'sh qatorlar faqat mantiqiy qadamlar orasida"
    - "Xatti-harakat o'zgarmagan (bir xil kirishda bir xil natija)"
---

## Muammo

Kod review'da faylni ochasiz. Birinchi 60 qator - to'rtta kichik yordamchi funksiya: `toRad`, `clamp`, `formatKm`, `parseTs`. Siz hali modul nima qilishini bilmaysiz, shuning uchun ularning hech birini kontekstda tushuna olmaysiz. Asosiy eksport qilinadigan funksiya 180-qatorda. Uning ichida birinchi qatorda e'lon qilingan `buffer` o'zgaruvchisi 70 qator pastda ishlatiladi. Bo'sh qatorlar esa tasodifiy: ba'zan bitta ifoda o'rtasida, ba'zan bir-biriga bog'liq bo'lmagan bloklar orasida umuman yo'q.

Bu kodning mantig'i to'g'ri bo'lishi mumkin. Lekin o'quvchi uni tushunish uchun faylni bir necha marta yuqoriga-pastga aylantiradi. Formatlash - bu kompilyator uchun ahamiyatsiz, lekin o'quvchi uchun eng birinchi duch keladigan narsa.

Prettier gorizontal formatlashni (qator uzunligi, chekinish, probellar) avtomatlashtiradi (36-dars). Ammo vertikal tuzilmaning muhim qismi - nima qayerda turishi, qanday tartibda va qaysi bloklar ajratilgan - formatter qaror qila olmaydigan narsa. Prettier bo'sh qatorlarni ko'paytirmaydi va funksiyalarni ko'chirmaydi. Bu dasturchining ishi.

## Asosiy g'oya

*Clean Code*ning formatlash bobida Martin vertikal formatlashning bir necha tamoyilini beradi. McConnell ham *Code Complete*da shunga o'xshash g'oyani aytadi: formatlashning asosiy maqsadi - kodning mantiqiy tuzilishini ko'rinadigan qilish. Chiroyli ko'rinish ikkinchi darajali.

### Gazeta metaforasi

Yaxshi gazeta maqolasi sarlavhadan boshlanadi, birinchi abzats butun hikoyaning qisqacha mazmunini beradi, pastga tushgan sari detallar ko'payadi. Martin fayl ham shunday bo'lishini tavsiya qiladi:

- **Fayl nomi** - sarlavha. U o'quvchiga to'g'ri faylda ekanini aytishi kerak.
- **Yuqori qism** - yuqori darajadagi tushunchalar va algoritm.
- **Pastga tushgan sari** - past darajadagi funksiyalar va detallar.

O'quvchi faylning birinchi ekranini o'qib, kerakli joyda to'xtashi mumkin bo'lishi kerak. Agar u faqat "bu modul nima qiladi" deb bilmoqchi bo'lsa, yordamchi funksiyalarga yetishi shart emas.

### Vertikal ochiqlik (bo'sh qatorlar)

Har bir bo'sh qator vizual signal: "bu yerda yangi fikr boshlanadi". Martin bo'sh qatorlarni import'lar guruhi, funksiyalar va funksiya ichidagi mantiqiy qadamlar orasida qo'yishni tavsiya qiladi. Matndagi abzatslar kabi.

### Vertikal zichlik

Aksincha, bir-biriga yaqin bog'liq qatorlar zich turishi kerak. Klass maydonlari orasidagi keraksiz bo'sh qatorlar yoki har bir maydon ustidagi shovqin kommentlar (33-dars) ularning bir guruhga tegishli ekanini yashiradi.

### Vertikal masofa

Bir-biriga bog'liq tushunchalar bir-biriga yaqin bo'lishi kerak:

- **O'zgaruvchilar** ishlatilishiga iloji boricha yaqin e'lon qilinadi.
- **Sikl o'zgaruvchilari** sikl ichida.
- **Klass maydonlari** klassning boshida, bitta joyda (Martin bu yerda Java an'anasiga tayanadi, TypeScript'da ham shunday qabul qilingan).
- **Bog'liq funksiyalar**: bir funksiya boshqasini chaqirsa, ular yonma-yon bo'lishi kerak, chaqiruvchi yuqorida.
- **Kontseptual yaqinlik**: bir-birini chaqirmasa ham, bir xil vazifani bajaruvchi funksiyalar (masalan, `formatKm`, `formatLiters`, `formatDuration`) bir guruhda.

### Vertikal tartib

Martin chaqiriladigan funksiya chaqiruvchidan pastda turishini tavsiya qiladi. Shunda kod yuqoridan pastga, abstraksiya darajasining pasayishi bo'yicha oqadi. Bu "stepdown rule" g'oyasi bilan bog'liq (22-dars).

### Fayl hajmi

Martin kitobida bir nechta mashhur Java loyihalarining fayl hajmlarini tahlil qiladi va ko'pchilik fayllar bir necha yuz qatordan kichik bo'lgan loyihalarda katta tizimlar qurilganini ko'rsatadi. U buni qat'iy qoida emas, yo'naltiruvchi kuzatuv sifatida beradi. Asosiy fikr: kichik fayllar odatda katta fayllardan osonroq tushuniladi. Lekin aniq raqam (200, 300, 500 qator) - bu jamoa kelishuvi, universal haqiqat emas.

## Chuqurroq: TypeScript modulining ichki tuzilishi

Java'dagi klass fayllaridan farqli o'laroq, TS moduli ko'pincha tiplar, konstantalar, funksiyalar va klasslar aralashmasi. Amaliy tartib:

1. **Import'lar** - tashqi paketlar, keyin ichki alias'lar (`@/lib/...`), keyin nisbiy import'lar. Guruhlar orasida bo'sh qator. Bu tartibni qo'lda emas, lint bilan saqlash mumkin (37-dars).
2. **Eksport qilinadigan tiplar** - modulning shartnomasi. O'quvchi birinchi navbatda nima kirib, nima chiqishini ko'radi.
3. **Konstantalar** - biznes qoidalari va sozlamalar.
4. **Asosiy eksport qilinadigan funksiya yoki klass.**
5. **Private yordamchilar** - chaqirilish tartibida.
6. **Ichki tiplar** - ba'zan ular ishlatiladigan joyga yaqin qo'yiladi, agar faqat bitta yordamchiga tegishli bo'lsa.

### Hoisting va tartib

Chaqiruvchi yuqorida, chaqiriladigan pastda bo'lishi uchun JS hoisting qoidalarini bilish kerak:

- `function helper() {}` deklaratsiyasi to'liq hoisting qilinadi: uni fayl istalgan joyidan chaqirish mumkin.
- `const helper = () => {}` faqat e'lon qilingandan keyin mavjud. Agar u modul yuklanayotgan paytda (top-level kodda) e'londan oldin chaqirilsa, TDZ (temporal dead zone) xatosi bo'ladi. Funksiya ichidan chaqirilsa va bu funksiya keyinroq ishga tushsa, xato bo'lmaydi.
- `class` deklaratsiyalari ham TDZ'ga bo'ysunadi.

Shuning uchun gazeta tartibini qo'llamoqchi bo'lgan jamoalar ko'pincha modul darajasidagi yordamchilar uchun `function` deklaratsiyasini afzal ko'radi. Bu uslub masalasi va ba'zi jamoalar arrow funksiyalarni afzal ko'radi. Muhimi - bir xillik.

### Klass ichidagi tartib

NestJS service yoki domen klassida umumiy tartib:

1. Statik maydonlar va konstantalar.
2. Instance maydonlari.
3. Konstruktor.
4. Public metodlar (asosiy use case'lar).
5. Private metodlar, ularni chaqiradigan public metoddan keyin.

typescript-eslint'ning `member-ordering` qoidasi bu tartibni avtomatik tekshirishi mumkin. Lekin u "chaqirilish tartibi"ni bilmaydi, faqat turlar bo'yicha (public/private, statik/instance) tartiblaydi.

### Bo'sh qatorlarning noto'g'ri ishlatilishi

- **Bitta ifoda o'rtasida** bo'sh qator ifodani ikkiga bo'lgandek ko'rsatadi.
- **Har ikki qatordan keyin** bo'sh qator - hamma narsa ajratilgan bo'lsa, hech narsa ajratilmagan.
- **Funksiya boshida va oxirida** bo'sh qator - Prettier ularni olib tashlaydi.
- **Bo'sh qator o'rniga komment-sarlavha** (`// ---- validatsiya ----`) - ko'pincha funksiya juda uzun ekanining belgisi. Bunday bloklarni Extract Function bilan nomlangan funksiyaga chiqarish yaxshiroq (30-dars).

## Misol: NestJS service ichidagi tartib

Tartibsiz versiya:

```ts
import { Injectable } from "@nestjs/common";

type Trip = { id: string; vehicleId: string; distanceMeters: number; fuelLiters: number };

interface TripRepository {
  findCompletedByVehicle(vehicleId: string, from: Date, to: Date): Promise<Trip[]>;
}

@Injectable()
export class FuelEfficiencyService {
  private litersPer100Km(trip: Trip): number {
    return (trip.fuelLiters / trip.distanceMeters) * 100_000;
  }
  private isMeasurable(trip: Trip): boolean {
    return trip.distanceMeters >= MIN_DISTANCE_METERS;
  }
  constructor(private readonly trips: TripRepository) {}
  async averageForVehicle(vehicleId: string, from: Date, to: Date): Promise<number | null> {
    const all = await this.trips.findCompletedByVehicle(vehicleId, from, to);

    const measurable = all.filter((t) => this.isMeasurable(t));
    if (measurable.length === 0) return null;
    const values = measurable.map((t) => this.litersPer100Km(t));

    return values.reduce((s, v) => s + v, 0) / values.length;
  }
}

const MIN_DISTANCE_METERS = 5_000;
```

Muammolar: private yordamchilar konstruktordan oldin, asosiy metod oxirida, konstanta fayl oxirida (u klassdan foydalaniladi, lekin uni topish uchun pastga tushish kerak), bo'sh qatorlar mantiqiy qadamlarga mos emas.

Tartiblangan versiya:

```ts
import { Injectable } from "@nestjs/common";

type Trip = { id: string; vehicleId: string; distanceMeters: number; fuelLiters: number };

interface TripRepository {
  findCompletedByVehicle(vehicleId: string, from: Date, to: Date): Promise<Trip[]>;
}

/** Qisqa reyslarda DUT xatosi nisbatan katta, ular o'rtachani buzadi. */
const MIN_DISTANCE_METERS = 5_000;

@Injectable()
export class FuelEfficiencyService {
  constructor(private readonly trips: TripRepository) {}

  /** O'rtacha sarf, l/100 km. O'lchab bo'ladigan reys bo'lmasa `null`. */
  async averageForVehicle(vehicleId: string, from: Date, to: Date): Promise<number | null> {
    const trips = await this.trips.findCompletedByVehicle(vehicleId, from, to);
    const measurable = trips.filter((trip) => this.isMeasurable(trip));
    if (measurable.length === 0) return null;

    const values = measurable.map((trip) => this.litersPer100Km(trip));
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private isMeasurable(trip: Trip): boolean {
    return trip.distanceMeters >= MIN_DISTANCE_METERS;
  }

  private litersPer100Km(trip: Trip): number {
    return (trip.fuelLiters / trip.distanceMeters) * 100_000;
  }
}
```

Nima o'zgardi:

- **Tartib:** tiplar, konstanta, konstruktor, public metod, keyin private metodlar u chaqiradigan tartibda (`isMeasurable`, keyin `litersPer100Km`).
- **Konstanta** ishlatilishidan oldin, fayl yuqorisida va "nega" izohi bilan. Asl versiyada u fayl oxirida edi. Bu holatda xato bermaydi (metod chaqirilganda u allaqachon initsializatsiya qilingan), lekin o'quvchi uni topish uchun faylni oxirigacha o'qishi kerak edi.
- **Bo'sh qatorlar** ikki mantiqiy qadamni ajratadi: ma'lumotni olish va filtrlash, keyin hisoblash.

## Qachon qo'llamaslik kerak

- **Gazeta tartibi har doim ham qulay emas.** Ba'zi jamoalar va tillar "pastdan yuqoriga" tartibni afzal ko'radi: avval yordamchilar, keyin ularni ishlatuvchi. Bu ayniqsa `const` arrow funksiyalar ko'p ishlatiladigan va TDZ muammosidan qochmoqchi bo'lgan kodda uchraydi. Ikkala tartib ham izchil bo'lsa o'qiladi. Eng yomoni - aralash tartib.
- **Qat'iy fayl hajmi chegarasi.** "Har bir fayl 200 qatordan kam" qoidasi bir butun modulni sun'iy bo'laklarga bo'lishga olib kelishi mumkin. Natijada o'quvchi 5 ta faylni ochib, ular orasida sakraydi. Ousterhoutning chuqur modul g'oyasi (52-dars) bunga qarshi: katta, lekin bir butun fayl ba'zan yaxshiroq.
- **Generatsiya qilingan va konfiguratsiya fayllari.** Prisma client, GraphQL codegen yoki i18n lug'ati uchun bu tamoyillar ahamiyatsiz.
- **Faqat tartibni o'zgartiruvchi katta commit'lar.** Mavjud faylda funksiyalarni ko'chirish diff'ni katta qiladi va git blame'ni buzadi. Buni alohida commit'da qiling va mazmunli o'zgarishlar bilan aralashtirmang (78-dars, Tidy First).
- **Test fayllari.** Testlarda tartib boshqa mantiqqa bo'ysunadi: `describe` bloklari xatti-harakat bo'yicha, fixture'lar va yordamchilar ko'pincha yuqorida. Bu ham normal.

## Stack'da: Prettier, ESLint, IDE

- **Prettier vertikal formatlashning faqat kichik qismini qiladi.** U ketma-ket bir nechta bo'sh qatorni bittaga qisqartiradi va blok boshi va oxiridagi bo'sh qatorlarni olib tashlaydi. Lekin u yangi bo'sh qator qo'shmaydi va kodni ko'chirmaydi (36-dars).
- **Import tartibi.** `eslint-plugin-import` yoki `eslint-plugin-simple-import-sort` import guruhlarini avtomatik tartiblaydi. Prettier import'larni saralamaydi.
- **`member-ordering`.** typescript-eslint qoidasi klass a'zolari tartibini tekshiradi. U stylistic xarakterda, shuning uchun jamoa kelishsa yoqiladi.
- **`max-lines`.** ESLint core qoidasi fayl hajmini cheklaydi. Uni `warn` darajasida va yuqori chegara bilan ishlatish signal sifatida foydali, `error` sifatida esa sun'iy bo'linishga olib kelishi mumkin.
- **IDE'dagi outline.** VS Code'ning "Outline" paneli faylning vertikal tuzilishini ko'rsatadi. Agar u yerda 40 ta element bo'lsa va ular orasida mantiq ko'rinmasa, bu fayl bo'linishi kerakligining belgisi.

## Xulosa

- Fayl gazeta maqolasi kabi: nom - sarlavha, yuqorida asosiy g'oya, pastda detallar.
- Bo'sh qatorlar fikrlarni ajratadi, bog'liq qatorlar zich turadi.
- Bog'liq tushunchalar vertikal yaqin: o'zgaruvchi ishlatilishiga yaqin, chaqiruvchi va chaqiriladigan yonma-yon.
- Chaqiruvchi yuqorida, chaqiriladigan pastda. TS'da `function` deklaratsiyalari hoisting tufayli bunga imkon beradi.
- Prettier vertikal tuzilmani hal qilmaydi: tartib va guruhlash dasturchining qarori.
