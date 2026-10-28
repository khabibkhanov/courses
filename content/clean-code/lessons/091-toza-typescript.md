---
n: 91
slug: toza-typescript
title: "Toza TypeScript: strict, unknown, narrowing, satisfies"
summary: "TypeScript tip tizimi o'quvchiga savollarga javob beradigan hujjat bo'lishi mumkin yoki yolg'on gapiradigan bezak. Bu darsda strict oilasi, noUncheckedIndexedAccess, unknown, narrowing va satisfies orqali tiplarni haqiqatga yaqin qilishni ko'ramiz."
duration: 40
sources:
  - id: effective-ts
    note: "any o'rniga unknown ishlatish, tiplarni toraytirish (narrowing) va type assertion'lardan ehtiyot bo'lish haqidagi bandlar"
  - id: ts-handbook
    note: "Narrowing bo'limi: typeof, instanceof, in, discriminated union, type predicate, never bilan exhaustiveness"
  - id: ts-tsconfig-strict
    note: "strict oilasidagi flaglar ro'yxati, noUncheckedIndexedAccess va exactOptionalPropertyTypes strict'ga kirmasligi"
quiz:
  - q: "Loyihada \"strict\": true yoqilgan. Quyidagi flaglardan qaysi biri baribir alohida yoqilishi kerak?"
    options:
      - "strictNullChecks"
      - "useUnknownInCatchVariables"
      - "noUncheckedIndexedAccess"
      - "noImplicitAny"
    answer: 2
    explain: "TSConfig hujjatiga ko'ra strict oilasiga strictNullChecks, noImplicitAny, useUnknownInCatchVariables va boshqalar kiradi. noUncheckedIndexedAccess (va exactOptionalPropertyTypes) bu oilaga kirmaydi, ularni alohida yoqish kerak."
  - q: "Tashqi webhook'dan kelgan JSON uchun qaysi tip eng to'g'ri boshlang'ich nuqta?"
    options:
      - "unknown, keyin runtime tekshiruv bilan aniq tipga toraytirish"
      - "any, chunki shakl oldindan noma'lum"
      - "Kutilgan interfeys bilan `as FuelWebhook` assertion"
      - "Record<string, string>"
    answer: 0
    explain: "unknown hech qanday amalga ruxsat bermaydi, shuning uchun tekshiruvni majburlaydi. any va `as` tekshiruvsiz ishonchni bildiradi: tip yolg'on bo'lib qoladi. Record<string, string> ham taxmin, chunki raqamlar va ichki obyektlar kelishi mumkin."
  - q: "`const limits = { TAS: 60, SAM: 90 } satisfies Record<string, number>;` va `const limits: Record<string, number> = {...}` o'rtasidagi asosiy farq nima?"
    options:
      - "Farq yo'q, satisfies faqat qisqaroq yozuv"
      - "satisfies runtime'da tekshiradi, annotatsiya esa compile-time'da"
      - "satisfies obyektni readonly qiladi"
      - "satisfies mos kelishni tekshiradi, lekin aniq inferred tipni saqlaydi: limits.TAS mavjud kalit sifatida qoladi"
    answer: 3
    explain: "Annotatsiya o'zgaruvchi tipini Record<string, number> ga kengaytiradi va aniq kalitlar haqidagi ma'lumot yo'qoladi. satisfies faqat tekshiradi, ifodaning o'z tipini o'zgartirmaydi. Ikkalasi ham faqat compile-time, readonly qilish uchun as const kerak."
  - q: "Discriminated union'ning `switch`ida `default: { const _exhaustive: never = event; }` yozilishining maqsadi nima?"
    options:
      - "Runtime'da noma'lum hodisalarni yashirin o'tkazib yuborish"
      - "Union'ga yangi variant qo'shilganda, uni qayta ishlamagan har bir switch kompilyatsiya xatosi berishi"
      - "Linter ogohlantirishini o'chirish"
      - "Performance optimizatsiyasi"
    answer: 1
    explain: "Barcha variantlar qayta ishlangan bo'lsa, default'da qiymat tipi never ga torayadi. Yangi variant qo'shilsa, u never ga tayinlanmaydi va kompilyator qayerni yangilash kerakligini ko'rsatadi. Bu shotgun surgery'ni xavfsiz qiladi."
  - q: "`function isVehicle(x: unknown): x is Vehicle { return typeof x === \"object\" && x !== null; }` funksiyasining muammosi nima?"
    options:
      - "Type predicate kompilyator tomonidan tekshirilmaydi: funksiya yetarli tekshirmasdan Vehicle deb yolg'on gapiryapti"
      - "Type predicate faqat klasslar bilan ishlaydi"
      - "unknown parametr type predicate bilan ishlatilmaydi"
      - "Muammo yo'q, bu standart yozuv"
    answer: 0
    explain: "Kompilyator `x is Vehicle` ga ishonadi, lekin tana haqiqatan Vehicle ekanini isbotlashini tekshirmaydi. Bu yerda har qanday obyekt Vehicle deb o'tadi. Predicate - bu `as` ning yashirin shakli, shuning uchun u to'liq tekshiruv qilishi yoki schema kutubxonasidan kelishi kerak."
  - q: "Jamoa eski loyihada strict'ni yoqmoqchi, lekin 2000 ta xato chiqdi. Eng oqilona yo'l qaysi?"
    options:
      - "Barcha xatolarni `as any` bilan bir kunda yopish"
      - "strict'dan voz kechish"
      - "Flaglarni birma-bir yoqish yoki yangi modullar uchun alohida tsconfig ochib, xatolarni bosqichma-bosqich tuzatish"
      - "Faqat CI'da strict'ni yoqish, lokal'da o'chirish"
    answer: 2
    explain: "`as any` bilan yopish xatolarni yo'qotmaydi, faqat yashiradi va tiplarni yolg'onga aylantiradi. strict oilasidagi flaglarni alohida-alohida yoqish mumkin, bu migratsiyani boshqariladigan qiladi. CI va lokal farqi esa doimiy chalkashlik beradi."
task:
  title: "Telemetriya parserini tip jihatdan halol qilish"
  prompt: |
    Quyidagi kod GPS trekerdan kelgan xabarni qayta ishlaydi. U ishlaydi, lekin tiplar yolg'on gapiradi: `any`, `as`, tekshirilmagan indekslash.

    1. `tsconfig`da `strict` va `noUncheckedIndexedAccess` yoqilgan deb hisoblang.
    2. Kirishni `unknown` deb qabul qiling va qo'lda yozilgan parser bilan toraytiring (kutubxonasiz).
    3. Xabar turlarini discriminated union qiling va `never` bilan exhaustive tekshiruv qo'shing.
    4. Ogohlantirish chegaralari jadvalini `satisfies` bilan e'lon qiling, shunda kalitlarda xato bo'lsa kompilyator ushlaydi.
  lang: ts
  starter: |
    const THRESHOLDS: Record<string, number> = {
      speed: 90,
      fuelDrop: 15,
      idel: 600,
    };

    export function handleMessage(raw: string) {
      const msg = JSON.parse(raw) as any;
      const alerts: string[] = [];

      if (msg.type === "position") {
        if (msg.speed > THRESHOLDS.speed) {
          alerts.push(`Tezlik oshdi: ${msg.vehicleId}`);
        }
      } else if (msg.type === "fuel") {
        const prev = msg.levels[msg.levels.length - 2];
        const curr = msg.levels[msg.levels.length - 1];
        if (prev - curr > THRESHOLDS.fuelDrop) {
          alerts.push(`Yoqilg'i keskin kamaydi: ${msg.vehicleId}`);
        }
      } else if (msg.type === "idle") {
        if (msg.seconds > THRESHOLDS.idle) {
          alerts.push(`Uzoq turib qoldi: ${msg.vehicleId}`);
        }
      }
      return alerts;
    }
  solution: |
    type PositionMessage = { type: "position"; vehicleId: string; speed: number };
    type FuelMessage = { type: "fuel"; vehicleId: string; levels: number[] };
    type IdleMessage = { type: "idle"; vehicleId: string; seconds: number };
    type TelemetryMessage = PositionMessage | FuelMessage | IdleMessage;

    const THRESHOLDS = {
      speedKmh: 90,
      fuelDropLiters: 15,
      idleSeconds: 600,
    } satisfies Record<string, number>;

    class InvalidMessageError extends Error {}

    function isRecord(value: unknown): value is Record<string, unknown> {
      return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    function isNumberArray(value: unknown): value is number[] {
      return Array.isArray(value) && value.every((item: unknown) => typeof item === "number");
    }

    function readString(obj: Record<string, unknown>, key: string): string {
      const value = obj[key];
      if (typeof value !== "string") throw new InvalidMessageError(`${key} string emas`);
      return value;
    }

    function readNumber(obj: Record<string, unknown>, key: string): number {
      const value = obj[key];
      if (typeof value !== "number" || Number.isNaN(value)) {
        throw new InvalidMessageError(`${key} son emas`);
      }
      return value;
    }

    export function parseTelemetry(input: unknown): TelemetryMessage {
      if (!isRecord(input)) throw new InvalidMessageError("obyekt kutilgan");
      const vehicleId = readString(input, "vehicleId");
      switch (input.type) {
        case "position":
          return { type: "position", vehicleId, speed: readNumber(input, "speed") };
        case "idle":
          return { type: "idle", vehicleId, seconds: readNumber(input, "seconds") };
        case "fuel": {
          const levels = input.levels;
          if (!isNumberArray(levels)) throw new InvalidMessageError("levels sonlar massivi emas");
          return { type: "fuel", vehicleId, levels };
        }
        default:
          throw new InvalidMessageError(`noma'lum type: ${String(input.type)}`);
      }
    }

    function lastFuelDrop(levels: number[]): number | undefined {
      const prev = levels.at(-2);
      const curr = levels.at(-1);
      if (prev === undefined || curr === undefined) return undefined;
      return prev - curr;
    }

    export function alertsFor(msg: TelemetryMessage): string[] {
      switch (msg.type) {
        case "position":
          return msg.speed > THRESHOLDS.speedKmh ? [`Tezlik oshdi: ${msg.vehicleId}`] : [];
        case "fuel": {
          const drop = lastFuelDrop(msg.levels);
          return drop !== undefined && drop > THRESHOLDS.fuelDropLiters
            ? [`Yoqilg'i keskin kamaydi: ${msg.vehicleId}`]
            : [];
        }
        case "idle":
          return msg.seconds > THRESHOLDS.idleSeconds ? [`Uzoq turib qoldi: ${msg.vehicleId}`] : [];
        default: {
          const unhandled: never = msg;
          throw new Error(`Qayta ishlanmagan xabar: ${JSON.stringify(unhandled)}`);
        }
      }
    }

    export function handleMessage(raw: string): string[] {
      return alertsFor(parseTelemetry(JSON.parse(raw)));
    }
  solutionNotes: |
    - Starter'da yashirin xato bor edi: jadvalda `idel`, kodda `THRESHOLDS.idle`. `Record<string, number>` annotatsiyasi buni ushlamaydi va `undefined` bilan solishtirish doim `false` beradi. `satisfies` bilan aniq kalitlar saqlanadi va `THRESHOLDS.idle` kompilyatsiya xatosi bo'ladi.
    - `JSON.parse` natijasi `unknown` sifatida parserga beriladi. Parser - tizimga kirish chegarasi: undan keyin kod faqat `TelemetryMessage` bilan ishlaydi (parse, don't validate g'oyasi, 45-dars).
    - `levels[levels.length - 2]` bo'sh massivda `undefined` qaytarardi va `undefined - undefined` `NaN` berardi. `noUncheckedIndexedAccess` va `.at()` bu holatni tipda ko'rsatadi, biz uni ochiq qayta ishlaymiz.
    - `never` bilan default: yangi xabar turi qo'shilsa, `alertsFor` kompilyatsiya bo'lmaydi.
    - Parse qilish va biznes qoidasi ikki funksiyaga ajratildi: `alertsFor` endi JSON'siz, toza obyektlar bilan test qilinadi.
  checklist:
    - "Kodda any va `as` assertion qolmadi (`as const` bundan mustasno)"
    - "Kirish unknown sifatida qabul qilinadi va bitta parser funksiyasida toraytiriladi"
    - "THRESHOLDS satisfies bilan e'lon qilingan va noto'g'ri kalit kompilyatsiya xatosi beradi"
    - "Bo'sh yoki bitta elementli levels massivi NaN emas, aniq natija beradi"
    - "switch'da never bilan exhaustive tekshiruv bor"
---

## Muammo

TypeScript loyihasida tiplar bor-u, lekin ular yordam bermaydigan holat juda keng tarqalgan. Controller `body: any` qabul qiladi, servis `as Vehicle` bilan "ishonch" bildiradi, `catch (e)` ichida `e.message` hech qanday tekshiruvsiz o'qiladi. Kod kompilyatsiya bo'ladi, IDE avtoto'ldirish beradi, hamma tinch. Keyin production'da `Cannot read properties of undefined` chiqadi va stack trace aynan "tiplangan" joyni ko'rsatadi.

Bunday kodda tiplar hujjat emas, bezak. Undan ham yomoni: ular yolg'on hujjat. O'quvchi `vehicle: Vehicle` ni ko'rib, `vehicle.driver` doim bor deb hisoblaydi, chunki tip shunday deydi. Aslida u qiymat `as` orqali tekshiruvsiz kelgan. 1-darsda toza kodning o'lchovi sifatida "o'quvchi kodni qanchalik to'g'ri bashorat qila oladi" degan mezonni oldik. Yolg'on tip bashoratni nafaqat qiyinlashtiradi, balki uni noto'g'ri yo'nalishga buradi.

Bu darsning maqsadi - tiplarni haqiqatga yaqinlashtirish: kompilyator ko'rgan narsa runtime'dagi narsaga mos bo'lsin. Buning to'rtta asosiy vositasi bor: `strict` oilasi va qo'shimcha flaglar, `unknown`, narrowing va `satisfies`.

## Asosiy g'oya

Dan Vanderkam *Effective TypeScript* kitobida qayta-qayta qaytadigan fikr shu: tip tizimi sizga faqat siz unga halol ma'lumot berganingizda yordam beradi. `any` va type assertion (`as`) kompilyatorga "menga ishon" deyish usuli. Har bir shunday joy - tekshiruv o'chirilgan kichik orol, va bunday orollar ko'paygan sari butun tip tizimining qiymati tushadi.

Shundan to'rtta amaliy qoida kelib chiqadi:

1. **Kompilyatorni eng qattiq rejimda ishlating.** `strict: true` va unga qo'shimcha `noUncheckedIndexedAccess`.
2. **Noma'lum narsa uchun `unknown`, `any` emas.** `unknown` qiymat bilan tekshirmasdan hech narsa qilib bo'lmaydi, shuning uchun u tekshiruvni majburlaydi.
3. **Assertion o'rniga narrowing.** Qiymat tipini kompilyatorga aytish o'rniga, uni kod bilan isbotlang: `typeof`, `in`, `instanceof`, discriminated union.
4. **Annotatsiya kengaytirsa, `satisfies` ishlating.** Qiymat biror shaklga mos kelishini tekshirish kerak, lekin aniq tipini yo'qotmaslik kerak bo'lganda.

## Chuqurroq: har bir vosita qanday ishlaydi

### strict oilasi va undan tashqaridagilar

TSConfig hujjatiga ko'ra `strict` - bu "strict mode family" deb ataladigan flaglar to'plamini birdaniga yoqish: `alwaysStrict`, `strictNullChecks`, `strictBindCallApply`, `strictBuiltinIteratorReturn`, `strictFunctionTypes`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis` va `useUnknownInCatchVariables`. Hujjat yana bir muhim narsani aytadi: kelajakdagi versiyalar bu flag ostiga yangi tekshiruvlar qo'shishi mumkin, demak TypeScript'ni yangilaganda yangi xatolar chiqishi normal holat.

TypeScript 6.0 dan boshlab `strict` standart holatda `true` bo'ldi. Ya'ni yangi loyihada uni o'chirish uchun endi ochiq `"strict": false` yozish kerak. Lekin ko'p mavjud loyihalar hali eski konfiguratsiya bilan yashaydi, shuning uchun tsconfig'ni har doim ochib tekshiring.

Muhim nozik joy: ikkita foydali flag strict oilasiga **kirmaydi**:

- **`noUncheckedIndexedAccess`** - index signature yoki massiv indeksi orqali olingan qiymatga `undefined` qo'shadi. `vehicles[0]` endi `Vehicle | undefined`. Bu bezovta qiluvchi tuyuladi, lekin aynan shu joylarda production xatolarining katta qismi yashaydi: bo'sh massiv, mavjud bo'lmagan kalit.
- **`exactOptionalPropertyTypes`** - `driverId?: string` bilan `driverId: string | undefined` ni farqlaydi. Birinchisida xususiyat umuman bo'lmasligi mumkin, lekin `undefined` ni ochiq tayinlab bo'lmaydi. Bu PATCH so'rovlarida "maydonni o'zgartirma" va "maydonni tozala" farqini ifodalashda foydali.

`useUnknownInCatchVariables` alohida e'tiborga loyiq: u `catch (err)` dagi `err` tipini `any` dan `unknown` ga o'zgartiradi. JavaScript'da istalgan qiymatni `throw` qilish mumkin, shuning uchun `err.message` ga ishonish har doim taxmin edi. Endi `err instanceof Error` tekshiruvi majburiy (47-darsda `cause` bilan ishlashni ko'rgan edik).

### any va unknown

`any` ikki tomonlama ochiq eshik: unga hamma narsa tayinlanadi va u hamma narsaga tayinlanadi. Eng yomoni - u yuqumli. `const msg: any = JSON.parse(raw)` dan keyin `msg.vehicle.id` ham `any`, undan olingan har bir qiymat ham `any`. Bitta `any` funksiya chegarasidan o'tib, butun modulning tiplarini "o'chirib" qo'yishi mumkin.

`unknown` ham hamma narsani qabul qiladi, lekin u bilan hech narsa qilib bo'lmaydi: xususiyat o'qish, chaqirish, arifmetika - hammasi taqiqlangan. Yagona yo'l - narrowing. Shuning uchun `unknown` tizim chegaralari uchun to'g'ri tip: HTTP body, `JSON.parse`, message queue, `localStorage`, tashqi SDK javobi.

### Narrowing va uning chegarasi

Handbook'dagi Narrowing bo'limi kompilyator qaysi konstruksiyalardan tipni toraytirishni o'rganishini sanab o'tadi: `typeof`, truthiness tekshiruvi, `===`, `in` operatori, `instanceof`, va eng kuchlisi - umumiy literal maydonga ega discriminated union. `switch (msg.type)` ichida har bir `case` da kompilyator `msg` ning aniq variantini biladi.

Ikkita "qo'lda" mexanizm bor: type predicate (`x is Vehicle`) va assertion function (`asserts x is Vehicle`). Ular kuchli, lekin xavfli: kompilyator funksiya tanasi haqiqatan ham shu da'voni isbotlashini tekshirmaydi. Noto'g'ri yozilgan predicate - bu yaxshi kiyingan `as`. Shuning uchun predicate'larni kam, puxta va test bilan yozing yoki ularni schema kutubxonasidan oling (Zod kabi kutubxonalar bir xil ta'rifdan ham tip, ham runtime tekshiruv beradi).

TypeScript 5.5 dan boshlab kompilyator ba'zi oddiy funksiyalar uchun type predicate'ni o'zi chiqaradi. Masalan, `ids.filter((id) => id !== undefined)` natijasi endi `string[]` bo'ladi, `(string | undefined)[]` emas. Bu qo'lda yozilgan predicate'lar sonini kamaytiradi.

Exhaustiveness: `default` tarmog'ida qiymatni `never` tipli o'zgaruvchiga tayinlash union'ga yangi variant qo'shilganda har bir qayta ishlanmagan `switch` ni kompilyatsiya xatosiga aylantiradi. 27-darsda discriminated union'ni switch zanjirlariga muqobil sifatida ko'rgan edik, bu o'sha g'oyaning xavfsizlik to'ri.

### satisfies

TypeScript 4.9 da qo'shilgan `satisfies` operatori bitta aniq muammoni hal qiladi. Tip annotatsiyasi (`const x: T = ...`) ikki ish qiladi: qiymatni tekshiradi va o'zgaruvchi tipini `T` ga kengaytiradi. Ko'pincha bizga faqat birinchisi kerak. `satisfies T` qiymat `T` ga mos kelishini tekshiradi, lekin ifodaning o'z (aniqroq) tipini saqlaydi.

Konfiguratsiya obyektlari, route jadvallari, xato kodlari xaritalari uchun bu ideal: kalitda xato bo'lsa kompilyator ushlaydi, foydalanishda esa aniq kalitlar va literal tiplar saqlanadi. `as const satisfies T` kombinatsiyasi qiymatlarni literal va readonly qiladi hamda shaklini tekshiradi.

## Misol: yolg'on tiplardan halol tiplarga

Yomon variant. Kod ishlaydi va kompilyatsiya bo'ladi:

```ts
type Vehicle = { id: string; plate: string; driver: { name: string } };

export async function getDriverName(res: Response): Promise<string> {
  const data = (await res.json()) as { vehicles: Vehicle[] };
  const first = data.vehicles[0];
  try {
    return first.driver.name.toUpperCase();
  } catch (e) {
    console.error(e.message);
    return "";
  }
}
```

Bu yerda uchta yolg'on bor. `as` tashqi API javobi aynan shu shaklda deb da'vo qiladi. `data.vehicles[0]` bo'sh massivda `undefined` bo'ladi, lekin tip `Vehicle` deydi. `e.message` - `e` Error ekaniga hech qanday kafolat yo'q (strict rejimda bu kompilyatsiya bo'lmaydi). `try/catch` esa aslida tip tizimi ko'rsatishi kerak bo'lgan muammoni runtime'da yutib yuborish uchun qo'yilgan.

Halol variant:

```ts run
type Driver = { name: string };
type Vehicle = { id: string; plate: string; driver: Driver | null };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseVehicle(value: unknown): Vehicle {
  if (!isRecord(value)) throw new Error("vehicle obyekt emas");
  const { id, plate, driver } = value;
  if (typeof id !== "string" || typeof plate !== "string") {
    throw new Error("vehicle.id yoki vehicle.plate noto'g'ri");
  }
  if (driver === null) return { id, plate, driver: null };
  if (!isRecord(driver) || typeof driver.name !== "string") {
    throw new Error("vehicle.driver noto'g'ri");
  }
  return { id, plate, driver: { name: driver.name } };
}

export function parseVehicleList(body: unknown): Vehicle[] {
  if (!isRecord(body) || !Array.isArray(body.vehicles)) {
    throw new Error("vehicles massivi kutilgan");
  }
  return body.vehicles.map(parseVehicle);
}

export function firstDriverName(vehicles: Vehicle[]): string | undefined {
  return vehicles[0]?.driver?.name.toUpperCase();
}

// Sinab ko'ring: JSON'ni buzib ko'ring (masalan, "plate"ni olib tashlang).
const body: unknown = JSON.parse('{"vehicles":[{"id":"v1","plate":"01A123BC","driver":{"name":"Aziz"}},{"id":"v2","plate":"10B777AA","driver":null}]}');
const vehicles = parseVehicleList(body);
console.log(vehicles);
console.log("Birinchi haydovchi:", firstDriverName(vehicles));
try { parseVehicleList({ vehicles: [{ id: 1 }] }); } catch (e) { console.log("Xato:", (e as Error).message); }
```

Nima o'zgardi:

- **Chegara aniq.** `parseVehicleList` - yagona joy, u yerda `unknown` dan `Vehicle[]` ga o'tiladi. Undan keyingi barcha kod tiplarga ishonishi mumkin, chunki ular isbotlangan.
- **Haqiqat tipda.** Haydovchi biriktirilmagan mashinalar real hayotda bor, shuning uchun `driver: Driver | null`. Endi `firstDriverName` buni hisobga olishga majbur.
- **Natija tipi halol.** `string | undefined` "mashina yo'q yoki haydovchi yo'q" holatini chaqiruvchiga ochiq aytadi. Bo'sh satr qaytarish esa bu ma'lumotni yo'qotardi (46-dars).
- **`try/catch` yo'qoldi.** U xatoni boshqarmasdi, faqat yashirardi.

Va `satisfies` bilan konfiguratsiya:

```ts
type AlertRule = { thresholdKmh: number; severity: "warning" | "critical" };

const SPEED_RULES = {
  city: { thresholdKmh: 60, severity: "warning" },
  highway: { thresholdKmh: 110, severity: "critical" },
} satisfies Record<string, AlertRule>;

type ZoneType = keyof typeof SPEED_RULES; // "city" | "highway"

export function ruleFor(zone: ZoneType): AlertRule {
  return SPEED_RULES[zone];
}
```

Agar `Record<string, AlertRule>` annotatsiyasi ishlatilganda, `keyof typeof SPEED_RULES` shunchaki `string` bo'lardi va `ruleFor("hihgway")` kompilyatsiya bo'lib, `undefined` qaytarardi. `satisfies` bilan kalitlar ro'yxati tipning o'zi bo'lib qoladi.

## Qachon qo'llamaslik kerak

- **Ichki, ishonchli ma'lumot uchun runtime parser.** Bitta modul ichida o'zingiz yaratgan obyektni har safar qayta tekshirish ortiqcha kod va CPU. Parser tizim chegarasida bitta marta turadi, ichkarida tiplarga ishoning.
- **`as` ba'zan to'g'ri vosita.** DOM API (`document.getElementById(...) as HTMLCanvasElement`), test fixture'lari, kompilyator isbotlay olmaydigan, lekin siz isbotlay oladigan invariantlar. Qoida: `as` ishlatilsa, nega xavfsiz ekanini bitta komment bilan yozing va uni chegaraga yaqin, kichik joyda saqlang.
- **`noUncheckedIndexedAccess` va algoritmik kod.** Indekslar bilan ko'p ishlaydigan kodda (matritsa, bufer) bu flag har qadamda `!` yoki tekshiruv talab qiladi va o'qishni yomonlashtiradi. Bunday modul uchun flag'ni o'chirish yoki `for...of` ga o'tish oqilona. Hamma uchun bitta to'g'ri javob yo'q.
- **Tip gimnastikasi.** Conditional va mapped tiplar bilan har qanday narsani ifodalash mumkin, lekin 15 qatorli generic tipni hech kim o'qiy olmasa, u murakkablik qo'shadi. Vanderkam ham tiplarni imkon qadar oddiy saqlashni maslahat beradi. Tip kodining ham o'quvchisi bor.
- **Katta legacy loyihada strict'ni bir kunda yoqish.** 2000 ta xatoni `as any` bilan yopish vaziyatni yaxshilamaydi. Flaglarni birma-bir yoqing yoki yangi papkalar uchun qattiqroq konfiguratsiya qiling.

## Stack'da: NestJS, Next.js, Prisma

- **NestJS.** `ValidationPipe` va class-validator DTO'lari HTTP chegarasidagi parser vazifasini bajaradi (94-dars). DTO bo'lmagan joylarda (queue consumer, WebSocket) `unknown` va qo'lda yoki Zod bilan parse qilish kerak.
- **Next.js.** App Router'da `params` va `searchParams` `Promise` sifatida keladi va `searchParams` qiymati `string | string[] | undefined`. Uni `as string` bilan "tuzatish" o'rniga kichik parser yozing. Server Action argumentlari ham foydalanuvchidan kelgan ma'lumot (93-dars).
- **Prisma va Kysely.** Ular sxemadan tip generatsiya qiladi, shuning uchun ma'lumotlar bazasi natijasi uchun qo'lda interfeys yozish va `as` qilishga ehtiyoj yo'q. Qo'lda yozilgan `Vehicle` interfeysi sxemadan uzoqlashib ketishi mumkin.
- **ESLint.** typescript-eslint'dagi `no-explicit-any`, `no-unsafe-assignment`, `no-unsafe-member-access` qoidalari `any` tarqalishini CI darajasida to'xtatadi (37-dars).

## Xulosa

- Yolg'on tip yo'q tipdan yomonroq: u o'quvchini noto'g'ri bashoratga yo'naltiradi.
- `strict` oilasi asos, lekin `noUncheckedIndexedAccess` va `exactOptionalPropertyTypes` alohida yoqiladi. TypeScript 6.0 da `strict` standart holatda yoqilgan.
- Tizim chegarasida `unknown` va bitta parser, ichkarida isbotlangan tiplar.
- Narrowing va discriminated union assertion'dan yaxshi, `never` bilan exhaustive tekshiruv yangi variantlarni xavfsiz qo'shishga imkon beradi.
- `satisfies` tekshiradi, lekin kengaytirmaydi: konfiguratsiya va jadvallar uchun eng to'g'ri tanlov.
