---
n: 43
slug: information-hiding
title: "Inkapsulyatsiya va information hiding (Parnas)"
summary: "Modullarga bo'lishning to'g'ri mezoni ish bosqichlari emas, balki o'zgarishi ehtimoli bor dizayn qarorlarini yashirish. Darsda Parnasning 1972-yilgi KWIC misolini, Ousterhoutning information leakage va temporal decomposition haqidagi fikrlarini va TypeScript modullarida ularning qo'llanilishini ko'ramiz."
duration: 40
sources:
  - id: parnas-1972
    note: "KWIC index tizimining ikki xil modullarga bo'linishi va o'zgarishlarga chidamlilik bo'yicha solishtiruvi"
  - id: aposd
    note: "Information hiding va leakage haqidagi bob: information leakage, temporal decomposition, HTTP server misoli"
quiz:
  - q: "Parnasning KWIC maqolasida birinchi (an'anaviy) modullashtirish qanday mezon bo'yicha qilingan?"
    options:
      - "Har bir modul bitta dizayn qarorini yashiradi"
      - "Har bir modul alohida dasturchiga berilgan"
      - "Modullar ma'lumotlar bazasi jadvallariga mos keladi"
      - "Har bir modul ishlov berishning bitta asosiy bosqichiga mos keladi (kirish, siljitish, alifbo tartibi, chiqish)"
    answer: 3
    explain: "Birinchi variant flowchart bo'yicha qilingan: har bir modul jarayonning bir qadami. Ma'lumot formati (xotirada satrlar qanday saqlanishi) esa barcha modullarga ma'lum edi, shuning uchun uning o'zgarishi hamma modulga tegardi."
  - q: "Parnas tahlilida qaysi o'zgarish birinchi modullashtirishda deyarli barcha modullarga ta'sir qiladi, ikkinchisida esa bitta modulga?"
    options:
      - "Chiqish formatini o'zgartirish"
      - "Dasturlash tilini almashtirish"
      - "Satrlarni xotirada saqlash usulini (masalan, belgilarni so'zlarga zich joylashni) o'zgartirish"
      - "Foydalanuvchi interfeysini qo'shish"
    answer: 2
    explain: "Birinchi variantda barcha modullar xotiradagi umumiy ma'lumot formatiga bevosita murojaat qilgan. Ikkinchisida bu format line storage moduli ortida yashiringan, shuning uchun o'zgarish faqat shu modulga tegadi."
  - q: "Ousterhout \"temporal decomposition\" deb nimani ataydi va nega uni red flag hisoblaydi?"
    options:
      - "Kodni sanalar bo'yicha papkalarga bo'lish, chunki bu git tarixini buzadi"
      - "Asinxron kodni sinxron qilish, chunki bu sekin"
      - "Klasslarni yaratilish vaqti bo'yicha tartiblash"
      - "Tizimni operatsiyalar bajariladigan vaqt tartibi bo'yicha bo'lish, chunki bir xil bilim (masalan, fayl formati) bir nechta bosqich moduliga tarqalib ketadi"
    answer: 3
    explain: "Masalan, \"faylni o'qish\", \"o'zgartirish\", \"yozish\" modullari - har ikkala o'qish va yozish modullari fayl formatini bilishi kerak. Bu information leakage. Bu aynan Parnasning birinchi KWIC modullashtirishidagi xato."
  - q: "Quyidagilardan qaysi biri information leakage'ning eng aniq belgisi?"
    options:
      - "Modulda private maydonlar ko'p"
      - "Bir dizayn qarori o'zgarganda bir nechta modulni birga o'zgartirish kerak bo'ladi"
      - "Modulning interfeysi kichik"
      - "Modulning testlari ko'p"
    answer: 1
    explain: "Leakage - bitta bilim bir nechta modulda aks etishi. Uning amaliy belgisi: bitta qaror (format, protokol, algoritm) o'zgarganda bir nechta joyni sinxron o'zgartirish. Bu interfeys orqali ham, interfeysdan tashqari (masalan, ikki modul bir xil fayl formatini bilishi) ham bo'lishi mumkin."
  - q: "Klassdagi barcha maydonlar `private` va har biriga getter/setter bor. Bu information hiding'mi?"
    options:
      - "Yo'q, chunki tashqi kod hamon ichki tasvirni (qanday maydonlar, qanday birliklar) biladi va unga bog'langan; yashirilgan qaror yo'q"
      - "Ha, chunki maydonlar private"
      - "Ha, agar getterlar readonly bo'lsa"
      - "Faqat Java'da"
    answer: 0
    explain: "Inkapsulyatsiya mexanizmi (private) information hiding'ning kafolati emas. Agar interfeys ichki tasvirni bir-biriga aks ettirsa, tasvir o'zgarganda interfeys ham o'zgaradi. Yashirish - bu qarorni yashirish, kirish modifikatorlari emas."
  - q: "Parnas ikkinchi modullashtirish haqida performance bo'yicha nima deydi?"
    options:
      - "U har doim tezroq"
      - "Performance muhim emas"
      - "Agar modullar oddiy protsedura chaqiruvlari bilan amalga oshirilsa, ko'p chaqiruvlar tufayli samarasiz bo'lishi mumkin, va bu muammoni amalga oshirish usuli bilan hal qilish kerak"
      - "U faqat assembler'da ishlaydi"
    answer: 2
    explain: "Parnas bu narxni ochiq tan oladi va dizayn modullarini runtime'dagi chaqiruv tuzilmasidan ajratish mumkinligini aytadi. Bugun inlining qiluvchi kompilyatorlar va JIT bu narxning ko'p qismini olib tashlaydi, lekin o'lchash kerak bo'lgan holatlar qoladi."
task:
  title: "GPS treker protokoli bilimini bitta modulga yig'ish"
  prompt: |
    Quyidagi kod GPS trekerdan kelgan xom paketni qabul qiladi. U "qabul qilish", "dekodlash", "saqlash" bosqichlariga bo'lingan (temporal decomposition). Protokol formati (maydonlar tartibi, ajratgich, koordinatalar birligi) uchala funksiyaga tarqalib ketgan.

    1. Qaysi dizayn qarorlari eng ko'p o'zgarishi mumkinligini yozing (protokol versiyasi, treker ishlab chiqaruvchisi, saqlash formati).
    2. Protokol bilimini bitta modul ortiga yashiring. Qolgan kod faqat domen tipidagi `Position` bilan ishlasin.
    3. Ertaga ikkinchi treker modeli (boshqa format) qo'shilsa, qaysi fayllar o'zgarishini tekshiring: ideal holda faqat bitta yangi fayl.
  lang: ts
  starter: |
    // receiver.ts
    export function receive(raw: string): string[] | null {
      if (!raw.startsWith("$GPS")) return null;
      return raw.slice(5).split(";");
    }

    // decoder.ts
    export function decode(parts: string[]) {
      return {
        imei: parts[0],
        lat: Number(parts[1]) / 1_000_000,
        lng: Number(parts[2]) / 1_000_000,
        speed: Number(parts[3]),
        ts: Number(parts[4]) * 1000,
      };
    }

    // storage.ts
    export async function store(
      db: { insert(table: string, row: Record<string, unknown>): Promise<void> },
      parts: string[],
      decoded: ReturnType<typeof decode>,
    ) {
      // protokolda 6-maydon - zajiganiye holati, "1" yoki "0"
      await db.insert("positions", {
        ...decoded,
        ignition: parts[5] === "1",
        raw: parts.join(";"),
      });
    }
  solution: |
    // tracker-protocol.ts - protokol haqidagi butun bilim faqat shu yerda
    export type Position = Readonly<{
      imei: string;
      lat: number;
      lng: number;
      speedKmh: number;
      recordedAt: Date;
      ignitionOn: boolean;
    }>;

    export interface TrackerProtocol {
      canHandle(raw: string): boolean;
      parse(raw: string): Position;
    }

    const PREFIX = "$GPS,";
    const COORD_SCALE = 1_000_000;

    export const gpsV1Protocol: TrackerProtocol = {
      canHandle: (raw) => raw.startsWith(PREFIX),
      parse(raw) {
        const [imei, lat, lng, speed, unixSec, ignition] = raw
          .slice(PREFIX.length)
          .split(";");
        if (!imei || !lat || !lng || !speed || !unixSec || ignition === undefined) {
          throw new Error(`GPS v1 paketi to'liq emas: ${raw}`);
        }
        return {
          imei,
          lat: Number(lat) / COORD_SCALE,
          lng: Number(lng) / COORD_SCALE,
          speedKmh: Number(speed),
          recordedAt: new Date(Number(unixSec) * 1000),
          ignitionOn: ignition === "1",
        };
      },
    };

    // position-ingest.ts - protokol formatini bilmaydi
    export interface PositionRepository {
      save(position: Position, raw: string): Promise<void>;
    }

    export class PositionIngest {
      constructor(
        private readonly protocols: readonly TrackerProtocol[],
        private readonly positions: PositionRepository,
      ) {}

      async ingest(raw: string): Promise<boolean> {
        const protocol = this.protocols.find((p) => p.canHandle(raw));
        if (!protocol) return false;
        await this.positions.save(protocol.parse(raw), raw);
        return true;
      }
    }
  solutionNotes: |
    - Protokol formati (prefiks, ajratgich, maydonlar tartibi, koordinata masshtabi, zajiganiye kodlanishi) endi faqat `gpsV1Protocol` ichida. Bu Parnasning ikkinchi KWIC modullashtirishidagi g'oya: modul bosqich emas, yashirilgan qaror bo'yicha ajratilgan.
    - Starter kodda `storage.ts` ham `parts[5]` ni bilar edi - bu Ousterhout ta'riflagan leakage: saqlash moduli protokolga bog'langan edi.
    - `PositionIngest` va repository faqat domen tipidagi `Position` bilan ishlaydi. Ikkinchi treker modeli qo'shilsa, bitta yangi `TrackerProtocol` fayli yoziladi va ro'yxatga qo'shiladi.
    - Birliklar ham yashirildi: tashqariga `speedKmh` va `Date` chiqadi, "sekundlarda" yoki "mikrogradusda" degan bilim protokol ichida qoldi.
    - Xom paket (`raw`) audit uchun saqlanadi, lekin u shaffof `string` sifatida o'tadi: repository uning ichini parse qilmaydi.
  checklist:
    - "Protokol formatini biladigan kod faqat bitta modulda"
    - "Saqlash qatlami xom maydon indekslariga (parts[5]) murojaat qilmaydi"
    - "Tashqariga birlik nomi aniq bo'lgan domen tipi chiqadi"
    - "Yangi treker modelini qo'shish faqat yangi fayl yozishni talab qiladi"
    - "To'liq bo'lmagan paket aniq xato bilan rad etiladi"
---

## Muammo

Yoqilg'i hisobotlari tizimi uch qadamdan iborat: datchikdan CSV faylni o'qish, hisob-kitob qilish, natijani Excel'ga yozish. Jamoa buni tabiiy ravishda uchta modulga bo'ldi: `reader`, `calculator`, `writer`. Bir yildan keyin datchik ishlab chiqaruvchisi CSV o'rniga JSON formatga o'tdi va vaqtni UTC o'rniga mahalliy vaqtda yuboradigan bo'ldi. Ma'lum bo'ldiki, `reader` ham, `calculator` ham, hatto `writer` ham ustunlar tartibini va vaqt formatini bilar edi. Uchta modul ham o'zgardi.

Modullar bor edi, lekin ular hech narsani yashirmagan edi. Ular faqat kodni uchta faylga bo'lgan edi. Bu farq - "kodni bo'lish" va "qarorlarni yashirish" o'rtasidagi farq - 1972-yilda David Parnas maqolasining markaziy mavzusi edi va bugun ham ko'p loyihalarda xuddi shu xato takrorlanadi.

## Asosiy g'oya

Parnasning "On the Criteria To Be Used in Decomposing Systems into Modules" maqolasi bitta savolni qo'yadi: tizimni modullarga qanday mezon bo'yicha bo'lish kerak? Javob uchun u kichik tizimni ikki xil usulda modullarga bo'ladi va ularni o'zgarishlarga chidamliligi bo'yicha solishtiradi.

### KWIC misoli

Tizim - KWIC (Key Word In Context) indeksi. Kirish - satrlar to'plami, har bir satr so'zlardan, so'z belgilardan iborat. Har bir satrni "aylana siljitish" mumkin: birinchi so'zni olib, oxiriga qo'yish va buni takrorlash. Tizim barcha satrlarning barcha aylana siljishlarini alifbo tartibida chiqaradi. Parnas ta'kidlaydiki, bu tizim kichik: yaxshi dasturchi uni bir-ikki haftada yozadi. Misolning qiymati aynan shunda: modullashtirish farqi kichik tizimda ham ko'rinadi.

**Birinchi modullashtirish** an'anaviy, flowchart bo'yicha: Input (satrlarni o'qib xotiraga joylaydi), Circular Shift (siljishlar indeksini tayyorlaydi), Alphabetizing (indeksni tartiblaydi), Output (natijani chop etadi) va Master Control (ketma-ketlikni boshqaradi). Har bir modul jarayonning bir bosqichi. Modullar orasidagi interfeys - xotiradagi umumiy ma'lumot formatlari: satrlar qanday joylashgani, siljishlar indeksi qanday tuzilgani.

**Ikkinchi modullashtirish** boshqacha: Line Storage (satrlar, so'zlar va belgilarga funksiyalar orqali kirish beradi, ularni qanday saqlashni yashiradi), Input, Circular Shifter (siljishlarni xuddi alohida satrlardek beradi, ularni haqiqatan saqlash yoki hisoblashni yashiradi), Alphabetizer (tartiblangan tartibni funksiya orqali beradi, qachon va qanday tartiblashni yashiradi), Output va Master Control.

Ikkala variant ham ishlaydi va hatto bir xil kodga ega bo'lishi mumkin. Farq o'zgarishda ko'rinadi. Parnas bir nechta ehtimoliy o'zgarishni sanaydi: kirish formati; barcha satrlarni xotirada saqlash qarori; belgilarni mashina so'ziga zich joylash; siljishlarni saqlash o'rniga indeks bilan ifodalash; alifbo tartibini bir marta to'liq qilish yoki talab bo'yicha qisman qilish. Birinchi variantda bularning ko'pi deyarli barcha modullarga ta'sir qiladi, chunki ular umumiy ma'lumot formatini bevosita ishlatadi. Ikkinchisida har bir o'zgarish bitta modul ichida qoladi.

### Mezon

Parnas xulosasi: ikkinchi variantda har bir modul boshqa modullardan yashiradigan **bitta dizayn qarori** bo'yicha ajratilgan. Modullarga bo'lishni flowchart (ish bosqichlari) asosida boshlash deyarli har doim xato. To'g'ri yo'l - avval qiyin yoki o'zgarishi ehtimoli bor qarorlar ro'yxatini tuzish va har bir modulni shunday qarorni boshqalardan yashiradigan qilib loyihalash. Interfeys esa o'zgarishi ehtimoli kam bo'lgan narsalarni ochishi kerak.

Bu "information hiding" atamasining manbai. E'tibor bering: gap `private` kalit so'zi haqida emas. Parnas davrida bunday til imkoniyatlari keng tarqalmagan edi. Gap **bilim** haqida: qaysi modul nimani biladi.

## Chuqurroq: Ousterhout va leakage

### Information leakage

Ousterhout *A Philosophy of Software Design*da Parnas g'oyasini rivojlantiradi va unga teskari tushunchani nomlaydi: **information leakage**. Bitta dizayn qarori bir nechta modulda aks etsa, bu leakage. Uning amaliy belgisi: bitta qaror o'zgarganda bir nechta modulni birga o'zgartirish kerak.

Ousterhout leakage interfeys orqali ham, interfeysdan tashqarida ham bo'lishini ta'kidlaydi. Ikkinchi holat xavfliroq: masalan, ikki klass bir xil fayl formatini biladi - biri yozadi, biri o'qiydi. Ularning interfeysida bu ko'rinmaydi, lekin format o'zgarsa ikkalasi ham o'zgaradi. Kompilyator bu bog'liqlikni bilmaydi.

Uning tavsiyasi: agar ikki modul bir xil bilimga ega bo'lsa, ularni bitta modulga birlashtirishni yoki bilimni alohida, kichik modulga chiqarib, ikkalasini unga bog'lashni ko'rib chiqing.

### Temporal decomposition

Ousterhout leakage'ning eng ko'p uchraydigan sababini **temporal decomposition** deb ataydi: tizimni operatsiyalar bajariladigan vaqt tartibi bo'yicha bo'lish. "Avval o'qiymiz, keyin o'zgartiramiz, keyin yozamiz" - shuning uchun uchta klass. Lekin o'qish va yozish bir xil formatni biladi. Bu aynan Parnasning birinchi KWIC modullashtirishi.

Ousterhout talabalarning HTTP server loyihalaridan misol keltiradi: so'rovni tarmoqdan o'qish va uni parse qilish ko'pincha ikki alohida klassga bo'lingan. Lekin so'rovni to'g'ri o'qish uchun (masalan, uning qayerda tugashini bilish uchun) uning katta qismini parse qilish kerak, shuning uchun ikkala klass HTTP so'rovi tuzilishini bilishi kerak bo'lib qoladi. Yechim - ularni birlashtirish.

Uning qoidasi: modullarni loyihalashda bajarilish tartibiga emas, har bir vazifani bajarish uchun kerak bo'ladigan **bilimga** e'tibor bering.

### Inkapsulyatsiya va information hiding farqi

Ko'pincha bu ikki atama sinonim sifatida ishlatiladi, lekin ularni ajratish foydali:

- **Inkapsulyatsiya** - til mexanizmi: `private`, `#field`, modul ichidan eksport qilinmagan funksiyalar, closure.
- **Information hiding** - dizayn tamoyili: qaysi qaror qayerda yashirilganini belgilash.

Mexanizm tamoyilsiz foydasiz. Barcha maydonlari `private`, lekin har biriga getter/setter bor klass hech narsani yashirmaydi: uning interfeysi ichki tasvirning nusxasi (41-dars). Aksincha, oddiy funksiyalar to'plami bo'lgan TS moduli, agar u faqat ma'noli funksiyalarni eksport qilsa va formatni ichida saqlasa, information hiding'ning yaxshi namunasi bo'la oladi.

### Performance haqida halol eslatma

Parnas ikkinchi modullashtirishning narxini ham tan oladi: agar har bir kirish alohida protsedura chaqiruvi bo'lsa, tizim sekinlashishi mumkin. U buni dizayn modullari va ularning runtime'dagi amalga oshirilishini ajratish orqali hal qilishni taklif qiladi. Bugungi JIT va inlining bu narxning katta qismini yo'qotadi, lekin issiq sikllarda (masalan, sekundiga minglab GPS nuqtalari) abstraksiya narxini o'lchash hali ham mantiqli (99-dars).

## Misol: yoqilg'i datchigi formati

Temporal decomposition:

```ts
// read-sensor.ts
export function readSensorFile(csv: string): string[][] {
  return csv.trim().split("\n").slice(1).map((line) => line.split(","));
}

// detect-drain.ts
export function detectDrains(rows: string[][]): { at: string; liters: number }[] {
  const result: { at: string; liters: number }[] = [];
  for (let i = 1; i < rows.length; i++) {
    const prev = Number(rows[i - 1][2]); // 3-ustun - litr
    const curr = Number(rows[i][2]);
    if (prev - curr > 20) result.push({ at: rows[i][0], liters: prev - curr });
  }
  return result;
}
```

`detectDrains` CSV ustunlari tartibini va vaqt satrining formatini biladi. Format o'zgarsa ikkala fayl ham o'zgaradi.

Information hiding bilan:

```ts
// fuel-sensor-format.ts - format haqidagi yagona joy
export type FuelReading = Readonly<{ at: Date; liters: number }>;

const COLUMN = { timestamp: 0, liters: 2 } as const;

export function parseFuelReadings(csv: string): FuelReading[] {
  return csv
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const cells = line.split(",");
      return {
        at: new Date(cells[COLUMN.timestamp] ?? ""),
        liters: Number(cells[COLUMN.liters]),
      };
    });
}

// fuel-drain-detector.ts - formatni bilmaydi
const DRAIN_THRESHOLD_LITERS = 20;

export function detectDrains(readings: readonly FuelReading[]): FuelReading[] {
  const drains: FuelReading[] = [];
  for (let i = 1; i < readings.length; i++) {
    const drop = readings[i - 1].liters - readings[i].liters;
    if (drop > DRAIN_THRESHOLD_LITERS) {
      drains.push({ at: readings[i].at, liters: drop });
    }
  }
  return drains;
}
```

Nima o'zgardi va nega:

- **Format bitta modulda.** Ustun indekslari, sarlavha qatori, vaqt formati - hammasi `fuel-sensor-format.ts` ichida. Datchik JSON'ga o'tsa, faqat shu fayl o'zgaradi.
- **Interfeys barqaror narsani ochadi.** `FuelReading` - "vaqt va litr" degan domen tushunchasi. U datchik ishlab chiqaruvchisidan qat'i nazar o'zgarmaydi.
- **Algoritm o'z qarorini yashiradi.** "20 litrdan ko'p tushish - sliv" qoidasi detektor ichida. Ertaga u silliqlash yoki tezlikni hisobga oladigan murakkab algoritmga aylansa, chaqiruvchilar o'zgarmaydi.
- **Testlash osonlashdi.** Detektorni CSV yasamasdan, oddiy `FuelReading` massivi bilan testlash mumkin.

## Qachon qo'llamaslik kerak

- **O'zgarmaydigan narsani yashirish.** Information hiding o'zgarishi **ehtimoli bor** qarorlar uchun. Hech qachon o'zgarmaydigan narsa (masalan, `Date` tipi yoki HTTP status kodlari) uchun abstraksiya qatlami qurish faqat bilvositalik qo'shadi. Qaysi qaror o'zgarishi mumkinligini taxmin qilish xato bo'lishi mumkin, shuning uchun hozir ko'rinib turgan o'zgarish manbalaridan boshlang (YAGNI g'oyasi, 9-dars).
- **Juda kichik modullar.** Har bir kichik qaror uchun alohida modul ochish sayoz modullar to'plamini beradi (52-dars). Ousterhout bunday holda birlashtirishni afzal ko'radi.
- **Debugging va kuzatuvchanlik.** Hamma narsa yashirilgan tizimda muammo izlash qiyinlashadi. Ichki holatni log, metrika yoki debug endpoint orqali ochish information hiding'ni buzmaydi, agar boshqa modullar unga tayanmasa.
- **Performance-kritik joylar.** Parnasning o'zi tan olganidek, yashirish narxga ega bo'lishi mumkin. Profiling ko'rsatsa, ma'lumot tasvirini chegaralangan joyda ochish oqlanadi.

## Stack'da: TypeScript modullari va NestJS

- **ES modul - eng arzon yashirish vositasi.** Faylda faqat ma'noli funksiyalar va tiplarni `export` qiling. Ichki yordamchilar, konstantalar va format tafsilotlari eksport qilinmasin. `index.ts` barrel faylini modulning ochiq interfeysi sifatida ishlating va ichki fayllarga to'g'ridan-to'g'ri importni lint qoidasi bilan cheklang (dependency-cruiser, 85-dars).
- **NestJS modullari.** `exports` massivi aynan information hiding vositasi: modul faqat eksport qilgan provider'lar tashqarida ko'rinadi. Har bir provider'ni avtomatik eksport qilish bu himoyani bekor qiladi.
- **Prisma tiplarini tashqariga chiqarmang.** Agar controller yoki boshqa modul `Prisma.VehicleGetPayload<...>` tipini import qilsa, DB sxemasi haqidagi qaror butun tizimga oqib chiqqan. Repository domen tipini qaytarsin.
- **Uchinchi tomon SDK'lari.** To'lov yoki SMS provayderining javob formati - eng ko'p o'zgaradigan qarorlardan biri. Uni bitta adapter ortida yashiring (50-dars).
- **Temporal decomposition'ni pipeline'larda tekshiring.** `fetch -> transform -> save` uchun uchta servis yozishdan oldin so'rang: qaysi ikkitasi bir xil formatni biladi?

## Xulosa

- Parnas mezoni: modulni bajarilish bosqichi emas, u yashiradigan, o'zgarishi ehtimoli bor dizayn qarori belgilaydi.
- KWIC misolida flowchart bo'yicha bo'lingan tizimda ma'lumot formati o'zgarishi deyarli barcha modullarga tegadi, qarorlar bo'yicha bo'linganida esa bittasiga.
- Ousterhout: information leakage - bitta bilimning bir nechta modulda bo'lishi. Uning asosiy sababi temporal decomposition.
- `private` va getterlar information hiding emas. Yashirish - bu interfeys ichki tasvirni aks ettirmasligi.
- Faqat o'zgarishi ehtimoli bor qarorlarni yashiring va abstraksiyaning narxini (bilvositalik, performance) hisobga oling.
