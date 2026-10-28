---
n: 18
slug: izchillik
title: "Izchillik: bir tushuncha - bir so'z"
summary: "Har bir nom alohida yaxshi bo'lishi mumkin, lekin ular birgalikda tizim hosil qiladi. Bu darsda bitta tushuncha uchun bitta so'z tanlash, bitta so'zni ikki ma'noda ishlatmaslik va jamoa nomlash konvensiyalarini qanday qurish va saqlashni ko'ramiz."
duration: 30
sources:
  - id: cc1
    note: "2-bob: \"Pick One Word per Concept\" va \"Don't Pun\" bo'limlari"
  - id: aposd
    note: "14-bob \"Choosing Names\": izchil nomlash (consistency) talablari; 17-bob \"Consistency\""
  - id: code-complete
    note: "11-bob: nomlash konvensiyalari nima uchun kerak, rasmiy va norasmiy konvensiyalar, standart prefikslar"
quiz:
  - q: "Loyihada `UserService.fetchById`, `VehicleService.getById`, `TripService.retrieveById` metodlari bor va hammasi bir xil ish qiladi. Martin buni qanday baholaydi?"
    options:
      - "Normal, chunki har bir servis alohida jamoa tomonidan yozilgan"
      - "Bitta tushuncha uchun uch xil so'z: o'quvchi ular orasida farq bormi, deb tekshirishi kerak; bitta so'zni tanlab, hamma joyda ishlatish kerak"
      - "Faqat `get` noto'g'ri, qolganlari yaxshi"
      - "Bu faqat estetik masala"
    answer: 1
    explain: "Martin \"Pick One Word per Concept\" qoidasida aynan fetch, retrieve, get misolini keltiradi. Har xil so'z farq borligi haqida signal beradi va o'quvchi bu signalni tekshirishga majbur."
  - q: "Loyihada `add` metodlari ikki qiymatni qo'shib yangi qiymat qaytaradi. Endi kolleksiyaga element qo'shuvchi metod kerak. Martinning \"Don't Pun\" qoidasiga ko'ra nima qilish kerak?"
    options:
      - "Uni ham `add` deb atash, chunki izchillik muhim"
      - "Uni `addNew` deb atash"
      - "Boshqa so'z tanlash, masalan `insert` yoki `append`, chunki semantika boshqa: bitta so'zni ikki ma'noda ishlatish o'yin so'z (pun)"
      - "Eski `add` metodlarini o'chirish"
    answer: 2
    explain: "Martin aynan shu misolni keltiradi: izchillik deb bitta so'zni boshqa semantika uchun ishlatish xato. Bir so'z - bir tushuncha qoidasining ikkinchi tomoni: bir tushuncha - bir so'z va bir so'z - bir tushuncha."
  - q: "Ousterhout izchil nomlash uchun qaysi talablarni qo'yadi?"
    options:
      - "Har doim bir xil nomni bir xil maqsadda ishlatish, shu nomni boshqa maqsadda ishlatmaslik va maqsad yetarlicha tor bo'lishi, ya'ni shu nomli barcha o'zgaruvchilar bir xil xatti-harakatga ega bo'lishi"
      - "Faqat qisqa nomlar ishlatish"
      - "Har bir modulda o'z nomlash uslubi"
      - "Faqat linter qoidalari"
    answer: 0
    explain: "Ousterhout izchillikni uch qismga ajratadi. Uchinchisi nozik: agar `block` nomi ham fizik, ham mantiqiy blokka ishlatilsa, maqsad juda keng va nom izchil bo'lsa ham noaniq."
  - q: "Yangi xodim kodda `findX` va `getX` metodlarini ko'radi. Jamoada `find*` null qaytarishi mumkin, `get*` esa topmasa exception otadi degan konvensiya bor, lekin u hech qayerda yozilmagan. Asosiy xavf nima?"
    options:
      - "Konvensiya juda murakkab"
      - "`find` va `get` so'zlari inglizcha emas"
      - "Hech qanday xavf yo'q"
      - "Yozilmagan konvensiya faqat eski xodimlarda yashaydi: yangi xodim uni bilmaydi, buzadi va konvensiya asta-sekin yo'qoladi"
    answer: 3
    explain: "McConnell konvensiyalarni yozib qo'yish va hujjatlashtirishni tavsiya qiladi. Yozilmagan konvensiya mavjud kodni o'qishda yordam beradi, lekin yangi kodda saqlanmaydi."
  - q: "Mavjud loyiha `snake_case` fayl nomlaridan foydalanadi, siz esa `kebab-case` ni afzal ko'rasiz. Yangi modul yozyapsiz. Ousterhout'ning izchillik haqidagi maslahatiga ko'ra nima qilish kerak?"
    options:
      - "Yangi modulda o'z afzal ko'rgan uslubingizni ishlatish"
      - "Mavjud konvensiyaga amal qilish: \"yaxshiroq g'oya\" ikki konvensiya aralashuvidan kelib chiqadigan zararni kamdan-kam qoplaydi"
      - "Butun loyihani darhol kebab-case'ga o'tkazish"
      - "Fayl nomlarini aralash qoldirish"
    answer: 1
    explain: "Ousterhout mavjud konvensiyalarni o'zgartirmaslikni maslahat beradi: yangi yondashuv shunchalik yaxshi bo'lishi kerakki, nomuvofiqlik narxini qoplasin. Bu kamdan-kam holat."
task:
  title: "Telemetriya servislarida so'z lug'atini birlashtirish"
  prompt: |
    Quyidagi uch servis turli dasturchilar tomonidan yozilgan. Har biri alohida o'qiladi, lekin birgalikda bitta tushuncha uchun bir nechta so'z va bitta so'z uchun bir nechta ma'no ishlatilgan.

    1. Bir xil tushunchani bildiruvchi sinonimlarni toping.
    2. Bir xil so'z bilan atalgan, lekin turli xatti-harakatli metodlarni toping.
    3. Qisqa konvensiya yozing (4-6 qator, kommentda) va kodni unga moslang.
  lang: ts
  starter: |
    type Vehicle = { id: string; plate: string };
    type Driver = { id: string; name: string };
    type Device = { imei: string; vehicleId: string };

    export class VehicleService {
      private items = new Map<string, Vehicle>();
      getVehicle(id: string): Vehicle | undefined { return this.items.get(id); }
      add(v: Vehicle): void { this.items.set(v.id, v); }
      remove(id: string): void { this.items.delete(id); }
    }

    export class DriverService {
      private items = new Map<string, Driver>();
      fetchDriver(id: string): Driver {
        const d = this.items.get(id);
        if (!d) throw new Error("driver not found");
        return d;
      }
      create(d: Driver): void { this.items.set(d.id, d); }
      delete(id: string): void { this.items.delete(id); }
    }

    export class TrackerService {
      private items = new Map<string, Device>();
      retrieveTracker(imei: string): Device | null { return this.items.get(imei) ?? null; }
      add(imei: string, vehicleId: string): Device { return { imei, vehicleId }; }
      erase(imei: string): void { this.items.delete(imei); }
    }
  solution: |
    // Nomlash konvensiyasi (repozitoriyda docs/naming.md ga ham yoziladi):
    // - find*(id): topilmasa undefined qaytaradi.
    // - get*(id): topilmasa NotFoundError otadi.
    // - save(entity): yaratadi yoki yangilaydi va saqlaydi.
    // - remove(id): o'chiradi; mavjud bo'lmasa jim o'tadi.
    // - Qurilma domenda har doim "tracker" (device emas).

    type Vehicle = { id: string; plate: string };
    type Driver = { id: string; name: string };
    type Tracker = { imei: string; vehicleId: string };

    export class NotFoundError extends Error {}

    export class VehicleService {
      private readonly vehicles = new Map<string, Vehicle>();
      findById(id: string): Vehicle | undefined { return this.vehicles.get(id); }
      save(vehicle: Vehicle): void { this.vehicles.set(vehicle.id, vehicle); }
      remove(id: string): void { this.vehicles.delete(id); }
    }

    export class DriverService {
      private readonly drivers = new Map<string, Driver>();
      getById(id: string): Driver {
        const driver = this.drivers.get(id);
        if (!driver) throw new NotFoundError(`Driver not found: ${id}`);
        return driver;
      }
      save(driver: Driver): void { this.drivers.set(driver.id, driver); }
      remove(id: string): void { this.drivers.delete(id); }
    }

    export class TrackerService {
      private readonly trackers = new Map<string, Tracker>();
      findByImei(imei: string): Tracker | undefined { return this.trackers.get(imei); }
      save(tracker: Tracker): void { this.trackers.set(tracker.imei, tracker); }
      remove(imei: string): void { this.trackers.delete(imei); }
    }

    export function buildTracker(imei: string, vehicleId: string): Tracker {
      return { imei, vehicleId };
    }
  solutionNotes: |
    - `get`/`fetch`/`retrieve` uchta sinonim edi. Endi ikki so'z qoldi va ular **turli** shartnomani bildiradi: `find*` (undefined) va `get*` (exception). Farq endi nomda haqiqiy ma'noga ega.
    - `remove`/`delete`/`erase` bitta amal edi: `remove` tanlandi.
    - `add`/`create` - saqlash amali uchun ikki so'z. `save` tanlandi.
    - `TrackerService.add` boshqalardan farqli edi: u saqlamasdan, faqat obyekt qurardi. Bu "pun" (bir so'z, ikki ma'no). U `buildTracker` degan alohida funksiyaga ajratildi.
    - `Device` va `Tracker` bitta tushuncha edi: domen tili bo'yicha `Tracker` tanlandi (17-dars).
    - `null` va `undefined` aralashmasi ham izchillik muammosi edi: `find*` endi hamma joyda `undefined` qaytaradi.
    - Konvensiya kommentda va hujjatda yozildi. Yozilmagan konvensiya yangi xodim bilan yo'qoladi.
  checklist:
    - "Bitta amal uchun loyihada bitta so'z qoldi"
    - "Bir xil so'zli metodlar bir xil shartnomaga ega (qaytarish turi, xato xatti-harakati)"
    - "Turli xatti-harakatli metodlar turli so'zlar bilan nomlangan"
    - "Domen tushunchasi uchun bitta nom tanlangan (Device yoki Tracker, ikkalasi emas)"
    - "Konvensiya yozma shaklda mavjud"
---

## Muammo

Har bir nom alohida yaxshi bo'lishi mumkin. `fetchDriver` yaxshi nom. `getVehicle` ham. `retrieveTracker` ham. Lekin ular bitta loyihada uchrashganda savol tug'iladi: ular orasida farq bormi? `fetch` tarmoq so'rovini bildiradimi? `retrieve` keshdanmi? `get` topilmasa nima qaytaradi? O'quvchi bu savollarga javob topish uchun uch metodni ham ochib ko'rishi kerak. Va ko'pincha ma'lum bo'ladiki, hech qanday farq yo'q: shunchaki uch xil dasturchi uch xil so'zni tanlagan.

Teskari holat ham bor: bitta so'z loyihaning turli joylarida turli ma'noga ega. `add` bir klassda kolleksiyaga element qo'shadi, boshqasida ikki summani qo'shib yangi summa qaytaradi, uchinchisida DB'ga yozuv kiritadi. O'quvchi so'zni ko'rib, tanish ma'noni kutadi va adashadi.

Bu muammolar kichik loyihada sezilmaydi. Yuzlab fayl va o'nlab dasturchiga ega loyihada esa ular kodni o'qishning asosiy to'siqlaridan biriga aylanadi.

## Asosiy g'oya

Martin *Clean Code*ning 2-bobida bu muammoning ikki tomonini ikki qoida bilan beradi.

**Har bir tushuncha uchun bitta so'z tanlang.** Martin aynan `fetch`, `retrieve` va `get` misolini keltiradi: ular turli klasslarda ekvivalent metodlar uchun ishlatilsa, qaysi klassda qaysi so'z ekanini eslab qolish qiyin. U yana `controller`, `manager` va `driver` so'zlarini bitta kod bazasida misol qiladi: `DeviceManager` va `ProtocolController` orasida qanday asosiy farq bor? Agar farq bo'lmasa, nega ikki xil so'z? Martin bu qoidani izchil leksikon (lexicon) deb ataydi: dasturchi kodni foydalanishi uchun kerak bo'lgan so'zlar to'plami.

**O'yin so'z qilmang (Don't Pun).** Ikkinchi qoida birinchisining teskarisi: bitta so'zni ikki xil maqsad uchun ishlatmang. Martinning misoli: loyihada ko'p `add` metodlari ikki mavjud qiymatni qo'shib yoki birlashtirib, yangi qiymat yaratadi. Endi kolleksiyaga bitta parametrni qo'shuvchi metod kerak. Uni ham `add` deb atash "izchil" ko'rinadi, lekin semantika boshqa. Bu holatda `insert` yoki `append` yaxshiroq. Izchillikni so'zning shakliga emas, **ma'nosiga** nisbatan saqlash kerak.

Ousterhout *A Philosophy of Software Design*ning nomlar haqidagi bobida izchillikni uchta talabga ajratadi:

1. Berilgan maqsad uchun **har doim** shu nomni ishlating.
2. Shu nomni **hech qachon** boshqa maqsad uchun ishlatmang.
3. Maqsad **yetarlicha tor** bo'lsin: shu nomli barcha o'zgaruvchilar bir xil xatti-harakatga ega bo'lsin.

Uchinchi talab nozik va eng ko'p e'tibordan chetda qoladi. 11-darsdagi Sprite misolini eslang: `block` nomi izchil ishlatilgan, lekin u ikki xil tushunchani (fizik va mantiqiy blok) qamragan. Nom izchil, maqsad esa juda keng edi.

Ousterhout izchillikka alohida bob bag'ishlaydi va uni murakkablikni kamaytirishning kuchli vositasi deb biladi: o'quvchi bir joyda bir narsani qanday qilinishini o'rgansa, boshqa joyda ham shu bilimni qo'llay oladi. Izchillik buzilgan joyda esa u har safar qaytadan o'rganishi kerak.

McConnell *Code Complete*da konvensiyalarning qiymati haqida gapiradi: nomlash konvensiyasi mavjudligi uning aniq mazmunidan muhimroq bo'lishi mumkin. Konvensiya jamoaga ko'plab mayda qarorlarni bir marta qabul qilib, keyin har safar o'ylamaslik imkonini beradi, kodni bir loyihadan boshqasiga o'tkazishni osonlashtiradi va bir xil narsa uchun turli nomlar paydo bo'lishini kamaytiradi.

## Chuqurroq: izchillikni qanday qurish

### Leksikon: loyihaning fe'llari

Har bir loyihada takrorlanadigan amallar bor: o'qish, saqlash, o'chirish, tekshirish, aylantirish. Ularning har biri uchun bitta so'z tanlash va uni yozib qo'yish - eng arzon izchillik vositasi. Masalan, TypeScript backend uchun qisqa leksikon:

- `find*` - topilmasa `undefined` (yoki `null`, lekin bittasini tanlang) qaytaradi.
- `get*` - topilmasa exception otadi.
- `list*` - kolleksiya qaytaradi, bo'sh bo'lishi mumkin.
- `create*` - yangi yozuv, mavjud bo'lsa xato. `save*` - yaratadi yoki yangilaydi.
- `fetch*` - tashqi tizimga tarmoq so'rovi (sekin, muvaffaqiyatsiz bo'lishi mumkin).
- `to*` - sof konvertatsiya (`toDto`, `toDomain`). `parse*` - tekshiruvli konvertatsiya, xato berishi mumkin.
- `build*` - obyekt quradi, saqlamaydi.

Bu ro'yxatning aniq mazmuni sizning jamoangizda boshqacha bo'lishi mumkin. Muhimi: so'zlar orasidagi farq **haqiqiy farqni** (qaytarish turi, xato xatti-harakati, narx) bildiradi va hamma uni biladi. Shunda nom shartnomaning bir qismiga aylanadi: `getDriver(id)` ni ko'rgan dasturchi null tekshiruvini yozmaydi, chunki bilmasa ham biladi.

### Domen so'zlari ham leksikonda

Izchillik faqat fe'llarga tegishli emas. `vehicle`, `car`, `unit`, `asset` - bitta transport parkida bularning hammasi bitta tushuncha bo'lishi mumkin. `tracker`, `device`, `terminal`, `gps` - bitta qurilma. Bunday sinonimlar 17-darsdagi ubiquitous language'ning buzilishi. Lug'atda bitta so'zni tanlang va qolganlarini "foydalanilmaydi" deb belgilang.

### Simmetriya va juftliklar

16-darsda ko'rgan qarama-qarshi juftliklar ham izchillik qismi: `start`/`stop`, `open`/`close`, `assign`/`unassign`. Agar bir klassda `enable`/`disable` bo'lsa, boshqasida `activate`/`deactivate` bo'lmasin (agar ular haqiqatan bir xil ma'noda bo'lsa).

### Tuzilmaviy izchillik

Nomlash izchilligi so'zlardan tashqariga ham chiqadi:

- **Registr.** Tiplar `PascalCase`, funksiya va o'zgaruvchilar `camelCase`, modul darajasidagi o'zgarmas konstantalar `UPPER_SNAKE_CASE` (TypeScript jamiyatida keng tarqalgan, lekin majburiy emas), fayllar `kebab-case`.
- **Tartib.** `maxSpeedKmh` yoki `speedMaxKmh` - bittasini tanlang (15-dars, McConnell maslahati).
- **Birlik qo'shimchalari.** `Ms`, `Seconds`, `Km`, `Uzs` - har doim oxirida, har doim bir xil shaklda (`Ms` yoki `Millis`, ikkalasi emas).
- **Null va undefined.** Bir loyihada "yo'q" qiymati uchun ikki xil vosita aralashsa, bu ham izchillik muammosi (46-dars).

### Avtomatlashtirish: qayerda yordam beradi, qayerda yo'q

Registr, prefikslar va ba'zi suffikslarni linter tekshirishi mumkin: typescript-eslint'ning `naming-convention` qoidasi tip, o'zgaruvchi, boolean va boshqa selektorlar uchun format talab qiladi. Lekin linter **ma'noni** tekshira olmaydi: `fetch` va `get` sinonim sifatida ishlatilganini yoki `add` ikki xil ma'noda ekanini faqat odam ko'radi. Bu yerda code review va yozma leksikon asosiy vosita.

## Misol: hisobot generatorlari

```ts
export function makeFuelReport(month: string): string { return `fuel:${month}`; }
export function generateMileageReport(month: string): string { return `mileage:${month}`; }
export function createIdleReport(month: string): Promise<void> { return Promise.resolve(); }
export function buildSafetyReport(month: string): { csv: string } { return { csv: `safety:${month}` }; }
```

To'rt funksiya, to'rt fe'l, to'rt xil qaytarish turi. `create` va `make` orasida farq bormi? `createIdleReport` nima uchun `void` qaytaradi, ya'ni u hisobotni qayerdadir saqlaydimi yoki yuboradimi? O'quvchi bu savollarga nomdan javob topa olmaydi.

```ts
export type ReportMonth = `${number}-${number}`;
export type Report = { kind: ReportKind; month: ReportMonth; csv: string };
export type ReportKind = "fuel" | "mileage" | "idle" | "safety";

// build*Report: sof funksiya, hisobotni quradi, saqlamaydi va yubormaydi.
export function buildFuelReport(month: ReportMonth): Report {
  return { kind: "fuel", month, csv: "" };
}
export function buildMileageReport(month: ReportMonth): Report {
  return { kind: "mileage", month, csv: "" };
}
export function buildIdleReport(month: ReportMonth): Report {
  return { kind: "idle", month, csv: "" };
}
export function buildSafetyReport(month: ReportMonth): Report {
  return { kind: "safety", month, csv: "" };
}

// publish*: yon ta'sirli amal. Fe'l boshqa, chunki shartnoma boshqa.
export async function publishReport(
  report: Report,
  upload: (fileName: string, csv: string) => Promise<void>,
): Promise<void> {
  await upload(`${report.kind}-${report.month}.csv`, report.csv);
}
```

Nima o'zgardi:

- **Bitta amal - bitta fe'l.** To'rt hisobot ham `build*Report`. Yangi hisobot qo'shgan dasturchi qaysi fe'lni tanlashni o'ylamaydi.
- **Bitta shartnoma.** Hammasi `Report` qaytaradi. Nom bir xil bo'lsa, xatti-harakat ham bir xil.
- **Boshqa xatti-harakat - boshqa so'z.** Eski `createIdleReport` hisobotni saqlash ham qilardi. Bu yon ta'sir endi `publishReport` ga ajratildi va boshqa fe'l oldi. Bu "Don't Pun" qoidasi amalda.

## Qachon qo'llamaslik kerak

- **Izchillik noto'g'ri tanlovni tarqatganda.** Agar loyihaning eski konvensiyasi haqiqatan zararli bo'lsa (masalan, barcha boolean'lar `flag*` bilan boshlanadi va ma'noni yashiradi), uni ko'r-ko'rona davom ettirish ham xato. Lekin uni o'zgartirish yakka tartibda emas, jamoa qarori va rejali refaktoring bo'lishi kerak (20-dars).
- **Turli kontekstlarda turli til.** Bounded context'lar orasida bir so'z turli ma'noga ega bo'lishi mumkin va bu normal (17-dars). Izchillik kontekst ichida talab qilinadi, butun kompaniya bo'ylab emas.
- **Tashqi API va kutubxonalar.** Prisma `findUnique`, `findMany`, `create`, `upsert` ishlatadi, sizning leksikoningiz boshqacha bo'lishi mumkin. Kutubxona nomlarini o'zgartirmang, lekin ularni o'z leksikoningizga o'ragan repository qatlamida moslang.
- **Konvensiya mayda tafsilotlarga to'lganda.** 50 bandli nomlash qo'llanmasini hech kim o'qimaydi. Eng ko'p xato chiqaradigan 8-10 qoida yozing, qolganini mavjud koddan o'rganish mumkin.
- **Yangi g'oya haqiqatan yaxshiroq bo'lganda.** Ousterhout ham mavjud konvensiyani o'zgartirishni butunlay taqiqlamaydi. Uning talabi: yangi yondashuv shunchalik yaxshi bo'lsinki, eski kod bilan nomuvofiqlik narxini qoplasin va eski kod ham yangilanadigan bo'lsin. "Menimcha yaxshiroq" yetarli asos emas.

## Stack'da: NestJS, React, monorepo

- **NestJS CRUD konvensiyasi.** NestJS CLI generatori controller va servis uchun `create`, `findAll`, `findOne`, `update`, `remove` metodlarini beradi. Ko'p jamoalar buni leksikon asosi qiladi. Agar siz `find` ni null qaytarish uchun ishlatsangiz, `findOne` ham shunday bo'lsin, yoki uni `getOne` deb o'zgartiring.
- **DTO suffikslari.** `CreateVehicleDto`, `UpdateVehicleDto`, `VehicleResponseDto`. Bir modulda `VehicleCreateDto`, boshqasida `CreateDriverDto` bo'lmasin.
- **React hook'lari.** `useVehicle`, `useVehicles`, `useCreateVehicle` (mutation). Bitta loyihada `useGetVehicle` va `useFetchDriver` aralashmasi leksikon yo'qligini ko'rsatadi.
- **Fayl nomlari.** `vehicle.service.ts`, `vehicles.controller.ts`, `VehicleCard.tsx`, `use-vehicle.ts`. Qaysi registr va birlik/ko'plik qoidasi tanlanmasin, u yozilgan va linter tekshirgan bo'lsin (19-dars).
- **Monorepo'da umumiy leksikon.** Backend va frontend bitta tilda gapirsa (`Trip`, `Shift`, `FuelDiscrepancy`), umumiy tip paketlari (`packages/domain`) tabiiy ravishda paydo bo'ladi va ikki tomon orasidagi tarjima kamayadi.

## Xulosa

- Bitta tushuncha - bitta so'z: sinonimlar o'quvchiga mavjud bo'lmagan farq haqida signal beradi.
- Bitta so'z - bitta tushuncha: so'zni boshqa semantika uchun ishlatish (pun) izchillik emas, adashtirish.
- Ousterhout talabi: nom har doim bir maqsadda, faqat shu maqsadda va maqsad yetarlicha tor bo'lsin.
- Loyiha leksikonini (asosiy fe'llar va domen so'zlari) yozib qo'ying, shunda nom shartnomaning bir qismiga aylanadi.
- Linter registr va formatni tekshiradi, ma'no izchilligini esa faqat review va yozma konvensiya saqlaydi. Mavjud konvensiyani faqat jamoa qarori bilan o'zgartiring.
