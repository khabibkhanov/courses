---
n: 13
slug: qidiriladigan-nomlar
title: "Talaffuz qilinadigan va qidiriladigan nomlar, magic number'lar"
summary: "Kod faqat o'qilmaydi: u muhokama qilinadi, qidiriladi va loglarda kuzatiladi. Bu darsda nomni ovoz chiqarib aytish va grep bilan topish mumkinligini, shuningdek magic number va string'larni qachon nomlash, qachon esa joyida qoldirish kerakligini ko'ramiz."
duration: 30
sources:
  - id: cc1
    note: "2-bob \"Meaningful Names\": \"Use Pronounceable Names\" va \"Use Searchable Names\" bo'limlari; 17-bob G25 \"Replace Magic Numbers with Named Constants\" evristikasi"
  - id: refactoring-catalog
    note: "Replace Magic Literal (Replace Magic Number with Symbolic Constant), Extract Variable"
quiz:
  - q: "Code review muhokamasida kimdir \"`genymdhms` maydonini qayerda to'ldiramiz?\" deb so'radi. Martin bu misol orqali nimani ko'rsatadi?"
    options:
      - "Nom juda uzun"
      - "Nomni ovoz chiqarib aytib bo'lmaydi, shuning uchun jamoa u haqida tabiiy gaplasha olmaydi; `generationTimestamp` muhokama qilinadi"
      - "Maydon nomida sana formati bo'lishi kerak"
      - "Maydon `Date` tipida bo'lishi kerak"
    answer: 1
    explain: "Martin `genymdhms` (generation year, month, day, hour, minute, second) misolini keltiradi. Talaffuz qilib bo'lmaydigan nom muhokamani qiyinlashtiradi va yangi odamlarga tushuntirishni talab qiladi."
  - q: "Kodda `if (retries > 5)` qatori bor. Martinning qidiriladigan nomlar haqidagi argumenti nima?"
    options:
      - "5 raqami juda kichik"
      - "Raqamni `const` bilan e'lon qilish tezroq ishlaydi"
      - "Raqam doimo konfiguratsiya faylida bo'lishi kerak"
      - "Kodda `5` ni qidirish yuzlab mos kelmaydigan natija beradi, `MAX_PAYMENT_RETRIES` esa aynan shu qoidani topadi"
    answer: 3
    explain: "Bitta harfli nomlar va raqamlar matnda deyarli qidirib bo'lmaydi. Nomlangan konstanta qoidaning barcha ishlatilgan joylarini bitta qidiruvda ko'rsatadi."
  - q: "Qaysi raqamni konstantaga chiqarish deyarli foyda bermaydi?"
    options:
      - "`items.length - 1` dagi `1`"
      - "To'lov tranzaksiyasidagi `0.12` (QQS stavkasi)"
      - "`speedKmh > 90` dagi `90` (shahar tashqarisidagi tezlik chegarasi)"
      - "`setTimeout(retry, 30_000)` dagi `30_000`"
    answer: 0
    explain: "`length - 1` idiomatik ifoda: ma'nosi kontekstdan to'liq ko'rinadi va hech qanday biznes qoidasini ifodalamaydi. Qolgan raqamlar biznes yoki texnik qarorlar, ular nomga loyiq."
  - q: "Ikki xil joyda `30` raqami bor: biri to'lov muddatini (kun), biri GPS nuqtalari orasidagi intervalni (soniya) bildiradi. Ikkalasini bitta `THIRTY = 30` konstantasiga chiqarish to'g'rimi?"
    options:
      - "Ha, takror yo'qoladi"
      - "Ha, agar konstanta `constants.ts` faylida bo'lsa"
      - "Yo'q: bu ikki xil tushuncha, tasodifan bir xil qiymat. Bitta konstanta ularni bog'lab qo'yadi va biri o'zgarganda ikkinchisi ham o'zgaradi"
      - "Yo'q, chunki raqamlarni konstantaga chiqarib bo'lmaydi"
    answer: 2
    explain: "Konstanta qiymatni emas, ma'noni nomlaydi. `PAYMENT_DUE_DAYS` va `GPS_REPORT_INTERVAL_SECONDS` alohida bo'lishi kerak. `THIRTY` esa hech narsani nomlamaydi, u magic number'ni boshqa ko'rinishda saqlaydi."
  - q: "`if (order.status === \"paid\")` - bu string magic literal'mi va TypeScript'da uni qanday hal qilish oqilona?"
    options:
      - "Union tip (`type OrderStatus = \"pending\" | \"paid\" | \"cancelled\"`) yetarli: kompilyator xato yozilgan string'ni ushlaydi va IDE barcha ishlatilgan joylarni topadi"
      - "Har bir string'ni alohida `const PAID = \"paid\"` qilish shart"
      - "Faqat `enum` ishlatish kerak, union tiplar yomon"
      - "String'lar hech qachon magic bo'lmaydi"
    answer: 0
    explain: "String literal union tip bilan cheklansa, u endi \"magic\" emas: qiymatlar to'plami bitta joyda e'lon qilingan va xato yozuv kompilyatsiya xatosi bo'ladi. Qo'shimcha konstanta ko'pincha ortiqcha qatlam."
  - q: "Nima uchun `Replace Magic Literal` refaktoringida konstanta nomi `NINE_POINT_EIGHT_ONE` emas, `STANDARD_GRAVITY` bo'ladi?"
    options:
      - "Chunki konstanta nomlari qisqa bo'lishi kerak"
      - "Chunki maqsad qiymatni takrorlash emas, uning ma'nosini nomlash; qiymat o'zgarishi mumkin, ma'no esa qoladi"
      - "Chunki raqamlarni so'z bilan yozish taqiqlangan"
      - "Chunki `UPPER_CASE` faqat so'zlar uchun"
    answer: 1
    explain: "Fowler katalogidagi misolda `9.81` `STANDARD_GRAVITY` ga aylanadi. Qiymatni takrorlovchi nom hech qanday ma'lumot bermaydi va qiymat aniqlashtirilsa yolg'onga aylanadi."
task:
  title: "Tarif hisoblovchidagi magic number va qidirib bo'lmaydigan nomlar"
  prompt: |
    Quyidagi funksiya transport parki uchun oylik obuna narxini hisoblaydi. Kod ishlaydi, lekin qoidalar raqamlar ichida yashiringan va nomlarni qidirib yoki muhokama qilib bo'lmaydi.

    1. Har bir raqam va string literal uchun aniqlang: bu biznes qoidasimi, texnik qarormi yoki idiomatik ifodami?
    2. Biznes va texnik qarorlarni ma'noli nomlarga chiqaring. Idiomatik ifodalarni joyida qoldiring.
    3. Talaffuz qilib bo'lmaydigan qisqartmalarni to'liq so'zlar bilan almashtiring.
    4. Natija bir xil qolishi kerak.
  lang: ts
  starter: |
    type Sub = { vhcCnt: number; plan: string; cmrCnt: number; yrly: boolean };

    export function calcMthPrc(s: Sub): number {
      let p = 0;
      if (s.plan === "b") p = s.vhcCnt * 45_000;
      else if (s.plan === "p") p = s.vhcCnt * 70_000;
      else p = s.vhcCnt * 110_000;

      p += s.cmrCnt * 25_000;

      if (s.vhcCnt >= 50) p = p * 0.9;
      if (s.yrly) p = p * 0.85;

      return Math.round(p / 1000) * 1000;
    }
  solution: |
    type PlanCode = "basic" | "pro" | "enterprise";

    type Subscription = {
      vehicleCount: number;
      plan: PlanCode;
      cameraCount: number;
      isBilledYearly: boolean;
    };

    const MONTHLY_PRICE_PER_VEHICLE_UZS: Record<PlanCode, number> = {
      basic: 45_000,
      pro: 70_000,
      enterprise: 110_000,
    };

    const MONTHLY_PRICE_PER_CAMERA_UZS = 25_000;

    const FLEET_DISCOUNT_MIN_VEHICLES = 50;
    const FLEET_DISCOUNT_MULTIPLIER = 0.9;
    const YEARLY_BILLING_MULTIPLIER = 0.85;

    const PRICE_ROUNDING_STEP_UZS = 1_000;

    export function calculateMonthlyPriceUzs(subscription: Subscription): number {
      const vehiclesPrice =
        subscription.vehicleCount * MONTHLY_PRICE_PER_VEHICLE_UZS[subscription.plan];
      const camerasPrice = subscription.cameraCount * MONTHLY_PRICE_PER_CAMERA_UZS;

      let price = vehiclesPrice + camerasPrice;

      if (subscription.vehicleCount >= FLEET_DISCOUNT_MIN_VEHICLES) {
        price *= FLEET_DISCOUNT_MULTIPLIER;
      }
      if (subscription.isBilledYearly) {
        price *= YEARLY_BILLING_MULTIPLIER;
      }

      return Math.round(price / PRICE_ROUNDING_STEP_UZS) * PRICE_ROUNDING_STEP_UZS;
    }
  solutionNotes: |
    - `"b"`, `"p"` va `else` (enterprise) magic string edi. Endi `PlanCode` union tipi: xato yozilgan reja nomi kompilyatsiya xatosi. Diqqat: asl kod noma'lum har qanday reja uchun enterprise narxini olardi. Tip bu holatni endi taqiqlaydi. Agar tashqi kirish (API, DB) eski kodlarni yuborsa, chegarada aniq mapping kerak bo'ladi.
    - Narx jadvali `Record<PlanCode, number>` ga aylandi: yangi reja qo'shilsa, kompilyator jadvalni to'ldirishni talab qiladi.
    - Chegirmalar qiymati bilan emas, ma'nosi bilan nomlandi: `FLEET_DISCOUNT_MULTIPLIER`, `TEN_PERCENT` emas. Ertaga chegirma 12% bo'lsa, nom to'g'ri qoladi.
    - Barcha pul konstantalarida valyuta (`_UZS`) bor: xalqaro mijoz paydo bo'lganda bu nom sizni ogohlantiradi.
    - `vhcCnt`, `cmrCnt`, `yrly`, `calcMthPrc` talaffuz qilinmaydi va qidirishda boshqa nomlar bilan aralashadi. To'liq so'zlar ishlatildi.
    - `Math.round(price / step) * step` idiomasi joyida qoldi: bu yerda faqat `1000` nomlandi, formulaning o'zi tushunarli.
  checklist:
    - "Har bir biznes qoidasi (narx, chegirma, chegara) nomlangan konstanta yoki jadvalda"
    - "Konstanta nomlari qiymatni emas, ma'noni aytadi (TEN_PERCENT kabi nom yo'q)"
    - "Reja kodlari union tip bilan cheklangan"
    - "Pul miqdorlarining nomida valyuta bor"
    - "Barcha nomlarni ovoz chiqarib aytish mumkin"
    - "Bir nechta misolda eski va yangi natija bir xil"
---

## Muammo

Kod faqat ekranda o'qilmaydi. U stand-up'da muhokama qilinadi, code review'da izohlanadi, production xatosi paytida loglardan qidiriladi, `grep` va IDE'ning "Find usages" funksiyasi bilan kuzatiladi. Bu jarayonlarning har birida nom ikki qo'shimcha sinovdan o'tadi: uni **ovoz chiqarib aytish** mumkinmi va uni **qidirib topish** mumkinmi?

Tasavvur qiling: to'lov xizmatida xato. Mijoz uch marta qayta urinishdan keyin bloklanmasligi kerak edi, lekin bloklandi. Siz qayta urinishlar sonini qayerda tekshirishini qidirasiz. Kodda `if (n > 3)` bor. `3` ni butun loyiha bo'yicha qidirasiz va 400 ta natija olasiz: massiv indekslari, versiya raqamlari, test ma'lumotlari. Qayta urinish chegarasi qaysi biri? Agar u ikki joyda bo'lsa va biri `>= 3`, ikkinchisi `> 3` bo'lsa, xatoning sababi aynan shu.

Yoki boshqa holat: jamoa muhokamasida kimdir "`dvcRcrdTmstmp` maydonini qayerda yozamiz?" deb so'raydi. Hech kim bu nomni bir xil talaffuz qilmaydi, yangi xodim nima haqida gap ketayotganini tushunish uchun ekranga qarashi kerak.

## Asosiy g'oya

Martin *Clean Code*ning 2-bobida bu ikki talabni alohida qoidalar sifatida beradi.

**Talaffuz qilinadigan nomlar ishlating.** Martin dasturlashni ijtimoiy faoliyat deb hisoblaydi: biz kod haqida gaplashamiz. Agar nomni aytib bo'lmasa, uni muhokama qilish ham qiyin. Uning misoli: bir kompaniyada `genymdhms` (generation date, year, month, day, hour, minute, second) degan o'zgaruvchi bo'lgan va dasturchilar uni harflab o'qishga majbur bo'lgan. `generationTimestamp` nomi esa oddiy suhbatda ishlatiladi. Yangi odam ham uni birinchi eshitganda tushunadi.

**Qidiriladigan nomlar ishlating.** Bitta harfli nomlar va raqamli konstantalarning muammosi shundaki, ularni matnda topish qiyin. `MAX_CLASSES_PER_STUDENT` ni qidirish oson, `7` ni esa juda qiyin. `e` harfi deyarli har bir so'zda bor, shuning uchun `e` degan o'zgaruvchini qidirish foydasiz. Martin buni nom uzunligi va scope bilan bog'laydi: **nom uzunligi uning scope o'lchamiga mos bo'lishi kerak**. Bitta harfli nom faqat qisqa metod ichidagi lokal o'zgaruvchi uchun maqbul. Agar o'zgaruvchi yoki konstanta kodning ko'p joyida ko'rinsa yoki ishlatilsa, unga qidiriladigan nom bering (bu g'oyani 15-darsda kengaytiramiz).

Martin buni magic number'lar bilan to'g'ridan-to'g'ri bog'laydi. Kitobning oxiridagi evristikalar ro'yxatida u alohida qoida beradi: magic number'larni nomlangan konstantalar bilan almashtiring. Bu faqat raqamlarga emas, ma'nosi o'zidan ko'rinmaydigan har qanday token'ga tegishli.

Fowler'ning refaktoring katalogida bu amal **Replace Magic Literal** deb ataladi (eski nomi: Replace Magic Number with Symbolic Constant). Katalogdagi misol oddiy: `potentialEnergy(mass, height)` funksiyasidagi `9.81` `STANDARD_GRAVITY` konstantasiga aylanadi. Hisob o'zgarmaydi, lekin endi raqamning ma'nosi ko'rinadi va uni qidirish mumkin.

## Chuqurroq: konstanta qachon foyda beradi

"Barcha raqamlarni konstantaga chiqaring" - bu qoidaning noto'g'ri, mexanik o'qilishi. Konstanta uchta aniq foyda beradi va har bir holatda kamida bittasi bo'lishi kerak.

### 1. Ma'no

Konstanta nomi raqamning **nima uchun** aynan shu qiymat ekanini aytadi. `0.12` - bu shunchaki raqam. `VAT_RATE` esa biznes qoidasi. Bu yerda muhim nozik jihat: nom **qiymatni emas, ma'noni** ifodalashi kerak. `TWELVE_PERCENT = 0.12` hech narsa bermaydi va stavka o'zgarsa yolg'onga aylanadi (`TWELVE_PERCENT = 0.15`). Xuddi shuningdek, `SECONDS_IN_30_DAYS` ham yomon, `PAYMENT_DUE_PERIOD_SECONDS` esa yaxshi.

### 2. Bitta haqiqat manbai

Agar qoida bir necha joyda ishlatilsa, konstanta ularni bog'laydi: qiymatni bir joyda o'zgartirasiz. Lekin bu yerda xavf bor. **Tasodifan bir xil qiymatlar bir xil tushuncha emas.** To'lov muddati 30 kun va GPS hisobot intervali 30 soniya - ikki xil narsa. Ularni bitta `THIRTY` konstantasiga birlashtirish noto'g'ri bog'liqlik yaratadi. Bu DRY'ning noto'g'ri tushunilishi (8-dars): takrorlanishi kerak bo'lmagan narsa bilim, matn emas.

### 3. Qidiriluvchanlik

Konstanta nomi bir qidiruvda qoidaning barcha ishlatilgan joylarini topadi. TypeScript'da bu yanada kuchli: IDE'ning "Find all references" funksiyasi konstantaning barcha foydalanuvchilarini aniq ko'rsatadi, hatto import nomi o'zgartirilgan bo'lsa ham.

### Magic string'lar

String literal'lar ham magic bo'lishi mumkin: `status === "pd"`, `role === "adm"`, `event.type === "fuel_drop_v2"`. Ular uchun TypeScript'da konstantadan yaxshiroq yechim bor: **string literal union tip**. `type OrderStatus = "pending" | "paid" | "cancelled"` e'lon qilinsa, `"piad"` deb xato yozish kompilyatsiya xatosi bo'ladi, IDE esa barcha qiymatlarni avtoto'ldiradi. Bunday holatda har bir string uchun alohida `const PAID = "paid"` yaratish ko'pincha ortiqcha qatlam: string'ning o'zi allaqachon ma'noli va tip bilan himoyalangan.

Bunda e'tibor beradigan nozik joy: union tip faqat kompilyatsiya vaqtida himoya qiladi. Agar qiymat tashqaridan (API, DB, query param) kelsa, u avval tekshirilishi kerak (45-dars, Zod bilan parse qilish).

### Talaffuz va qisqartmalar

Talaffuz qoidasining asosiy dushmani - shaxsiy qisqartmalar: `vhcCnt`, `drvLcns`, `calcMthPrc`. Ularni yozgan odam uchun ma'nosi aniq, boshqalar uchun emas. Umumiy qabul qilingan qisqartmalar esa muammo emas: `id`, `url`, `api`, `dto`, `http`, `db`, `max`, `min`. Mezon oddiy: agar jamoadagi har kim bu qisqartmani bir xil o'qisa va tushunsa, u ruxsat etilgan. Agar tushuntirish kerak bo'lsa, to'liq so'z yozing. Domen qisqartmalari (masalan, `vin` - avtomobil identifikatsiya raqami, `odo` odometr) jamoada kelishilgan bo'lsa ishlatilishi mumkin, lekin ularni lug'atga yozib qo'yish foydali (17-dars).

## Misol: tezlik buzilishlari

```ts
type Pt = { v: string; spd: number; zn: number; t: number };

export function chkSpd(pts: Pt[]) {
  return pts.filter((p) => (p.zn === 1 ? p.spd > 60 : p.spd > 90) && p.spd < 250);
}
```

`zn === 1` nimani anglatadi? `60` va `90` qanday chegara? `250` nima uchun? Bu raqamlarni qidirsangiz, boshqa modullardagi `60` (daqiqa), `90` (kun), `250` (ms) bilan aralashadi.

```ts
type SpeedZone = "urban" | "highway";

type TelemetryPoint = {
  vehicleId: string;
  speedKmh: number;
  zone: SpeedZone;
  recordedAtMs: number;
};

const SPEED_LIMIT_KMH: Record<SpeedZone, number> = {
  urban: 60,
  highway: 90,
};

// GPS modullari ba'zan shovqinli nuqta beradi. Bundan yuqori tezlik jismonan mumkin emas.
const MAX_PLAUSIBLE_SPEED_KMH = 250;

export function findSpeedingPoints(points: TelemetryPoint[]): TelemetryPoint[] {
  return points.filter((point) => {
    const isPlausible = point.speedKmh < MAX_PLAUSIBLE_SPEED_KMH;
    const isOverLimit = point.speedKmh > SPEED_LIMIT_KMH[point.zone];
    return isPlausible && isOverLimit;
  });
}
```

Nima o'zgardi:

- **`zn === 1` -> `SpeedZone` union tipi.** Raqamli kod string literal'ga aylandi va tip bilan cheklandi. Uchinchi zona (`"school"`) qo'shilsa, kompilyator `SPEED_LIMIT_KMH` jadvalini to'ldirishni talab qiladi.
- **Chegaralar jadvalda.** `60` va `90` endi qidiriladi (`SPEED_LIMIT_KMH`) va ularning ma'nosi bitta joyda.
- **`250` nomlandi va izohlandi.** Nom "nima"ni aytadi, komment esa "nega"ni (GPS shovqini). Bu kommentning to'g'ri ishlatilishi: nom bera olmaydigan sababni tushuntiradi (32-dars).
- **Barcha nomlar talaffuz qilinadi.** `chkSpd` emas, `findSpeedingPoints`.

## Qachon qo'llamaslik kerak

- **Idiomatik raqamlar.** `0`, `1`, `-1` ko'p kontekstlarda o'z-o'zidan tushunarli: `items.length - 1`, `index + 1`, `count === 0`, `slice(1)`. Ularni `ONE` yoki `FIRST_INDEX` kabi konstantaga chiqarish o'qishni yomonlashtiradi.
- **Ma'nosi kontekstdan ko'rinadigan birlik o'zgartirishlari.** `24 * 60 * 60 * 1000` ifodasini ko'pchilik darhol "bir kun millisekundda" deb o'qiydi. Uni `MS_PER_DAY` deb nomlash foydali, lekin `24`, `60`, `1000` ni alohida konstantalarga ajratish (`HOURS_PER_DAY`, `MINUTES_PER_HOUR`) odatda ortiqcha.
- **Test ma'lumotlari.** Test ichida `createOrder({ amount: 150_000 })` - bu konkret misol, qoida emas. Test raqamlarini konstantaga chiqarish testni o'qishni qiyinlashtiradi, chunki o'quvchi kutilgan natijani hisoblash uchun boshqa joyga borishi kerak. Istisno: test va kod bitta biznes qoidasini tekshirsa (masalan, chegirma chegarasi), kod konstantasini import qilish mumkin.
- **Bir marta ishlatiladigan, kontekstda tushunarli qiymat.** `padStart(2, "0")` dagi `2` va `"0"` sana formatlash kontekstida aniq. Konstanta faqat qatorni uzaytiradi.
- **Konstantalar fayli "axlatxona" bo'lganda.** Loyihadagi barcha konstantalarni bitta `constants.ts` ga yig'ish keng tarqalgan, lekin u tez orada bir-biriga aloqasiz yuzlab qiymatlar ro'yxatiga aylanadi. Konstanta uni ishlatadigan modul yonida yashashi kerak, faqat haqiqatan umumiy bo'lsa umumiy joyga ko'chiriladi.

## Stack'da: env, NestJS, React

- **Konfiguratsiya va konstanta farqi.** Muhitga qarab o'zgaradigan qiymat (timeout, URL, limit) - bu konstanta emas, konfiguratsiya. Uni `process.env` dan o'qing va ishga tushganda tekshiring (86-dars). Env nomlari ham qidiriladigan bo'lsin: `TIMEOUT` emas, `TELEMETRY_INGEST_TIMEOUT_MS`.
- **Birlik nomda.** `timeout: 30` - soniyami, millisekundmi? Node.js API'larining ko'pchiligi millisekund kutadi, ba'zi kutubxonalar soniya. `_MS`, `_SECONDS`, `_UZS`, `_KM` suffikslari bu xatoni nomda ushlaydi.
- **NestJS injection token'lari.** `@Inject("CONFIG")` dagi string magic literal. Uni eksport qilinadigan konstanta (`export const TELEMETRY_CONFIG = Symbol("TELEMETRY_CONFIG")`) yoki klass token qilish xato yozishni oldini oladi va qidirishni osonlashtiradi.
- **React'da breakpoint va z-index.** `zIndex: 1300`, `@media (max-width: 768px)` - bu magic number'lar dizayn tizimining qarorlari. Ularni dizayn token'lari (`theme.zIndex.modal`, `breakpoints.tablet`) orqali ishlatish ularni qidiriladigan qiladi.
- **`as const` obyektlar.** `const FuelEventType = { Refuel: "refuel", Drain: "drain" } as const;` ham qiymatlarni, ham tipni (`typeof FuelEventType[keyof typeof FuelEventType]`) bitta joyda beradi. Bu `enum`ga muqobil (19-dars).

## Xulosa

- Nom ovoz chiqarib aytilishi va qidirib topilishi kerak: kod muhokama qilinadi va kuzatiladi, faqat o'qilmaydi.
- Nom uzunligi scope'ga mos keladi. Keng ishlatiladigan narsa qidiriladigan nom talab qiladi.
- Konstanta qiymatni emas, ma'noni nomlaydi. Tasodifan bir xil qiymatlarni bitta konstantaga birlashtirmang.
- TypeScript'da magic string'lar uchun union tip ko'pincha alohida konstantadan yaxshiroq.
- Idiomatik raqamlar, test misollari va kontekstda tushunarli qiymatlar konstantasiz yaxshiroq o'qiladi.
