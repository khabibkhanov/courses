---
n: 19
slug: typescriptda-nomlash
title: "TypeScript'da nomlash: tiplar, generiklar, fayllar"
summary: "TypeScript nomlashga o'ziga xos qatlamlar qo'shadi: tip va qiymat nomlari, generik parametrlar, enum va union, fayl va papka nomlari. Bu darsda ularning har biri uchun keng tarqalgan konvensiyalarni, qaysi biri qoida va qaysi biri shunchaki odat ekanini, va ularni typescript-eslint bilan qanday avtomatlashtirishni ko'ramiz."
duration: 35
sources:
  - id: effective-ts
    note: "Tiplarni problem domain tilida nomlash haqidagi bo'lim; tip ma'lumotini nom va hujjatda takrorlamaslik"
  - id: ts-handbook
    note: "\"Generics\" bo'limi: `Type`, `Key`, `Input` kabi tip parametr nomlari; \"Everyday Types\": interface va type alias farqi"
  - id: typescript-eslint
    note: "`naming-convention` qoidasi: selektorlar, formatlar, boolean prefikslari, I-prefiksni taqiqlash misoli va ogohlantirishlar"
quiz:
  - q: "Generik funksiya: `function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]>`. Qachon `T`, `K` o'rniga uzunroq nomlar (`Item`, `GroupKey`) foydali?"
    options:
      - "Hech qachon, generik parametr har doim bitta harf bo'ladi"
      - "Faqat parametrlar soni beshdan ko'p bo'lsa"
      - "Parametrlar ko'p bo'lsa yoki tip murakkab va uzun bo'lsa, ular orasidagi rollar bir harfdan ko'rinmasa"
      - "Faqat klass generiklari uchun"
    answer: 2
    explain: "TypeScript Handbook'ning o'zi `Type`, `Key`, `Input` kabi nomlarni ham, `T`, `U` ni ham ishlatadi va tip parametr nomlari ixtiyoriy ekanini aytadi. Qisqa, bitta parametrli generikda `T` yetarli. Uch-to'rt parametr va murakkab shartli tiplarda ma'noli nomlar o'qishni yengillashtiradi."
  - q: "Vanderkam *Effective TypeScript*da tiplarni nomlash haqida qanday maslahat beradi?"
    options:
      - "Tip nomlarini problem domain tilidan oling va bir tushuncha uchun turli nomlardan qoching; tip nomi qiymat ma'nosini bildirsin, shaklini emas"
      - "Tiplarni har doim `T` prefiksi bilan boshlang"
      - "Tip nomlari iloji boricha qisqa bo'lsin"
      - "Tip nomi u e'lon qilingan faylga mos bo'lsin"
    answer: 0
    explain: "Vanderkam tiplarni domen tilida nomlashni va ma'nosi aniq bo'lmagan umumiy nomlardan (`data`, `info`, `thing`) qochishni maslahat beradi. Bu 11- va 17-darslardagi g'oyalarning tip darajasidagi qo'llanishi."
  - q: "`enum Status { Active, Inactive }` va `type Status = \"active\" | \"inactive\"`. Nomlash nuqtai nazaridan union tipning amaliy afzalligi qaysi?"
    options:
      - "Union tip tezroq ishlaydi"
      - "Union tip runtime'da obyekt yaratadi"
      - "Enum'ni TypeScript endi qo'llab-quvvatlamaydi"
      - "Union qiymatlari loglarda, JSON'da va DB'da o'qiladigan string bo'lib qoladi, raqamli enum esa `0` va `1` kabi ma'nosiz qiymat beradi"
    answer: 3
    explain: "Raqamli enum qiymatlari serializatsiyada ma'nosiz raqamlarga aylanadi. String enum bu muammoni hal qiladi, union tip esa qo'shimcha runtime obyektisiz bir xil natija beradi. Bu ma'noni nom orqali saqlash masalasi."
  - q: "typescript-eslint `naming-convention` qoidasini sozlayapsiz. Hujjatlar qaysi ogohlantirishni beradi?"
    options:
      - "Qoida faqat JavaScript uchun"
      - "Qoida juda qattiq bo'lishi mumkin: kuchli ehtiyoj bo'lmasa, uni faqat jiddiy buzilishlarni ushlash uchun ishlating yoki o'chiring; `types` opsiyasi tip ma'lumotini talab qiladi"
      - "Qoida avtomatik ravishda barcha nomlarni tuzatadi"
      - "Qoida faqat fayl nomlarini tekshiradi"
    answer: 1
    explain: "Hujjatlar qoidaning qattiqligidan ogohlantiradi va `types` (masalan, boolean prefikslar) tip ma'lumotini talab qilishini, bu esa lint vaqtini oshirishini aytadi."
  - q: "Loyihada `VehicleCard.tsx`, `vehicle-card.tsx` va `vehicleCard.tsx` fayllari aralash. Qaysi xavf eng real?"
    options:
      - "TypeScript fayllarni kompilyatsiya qilmaydi"
      - "Performance pasayadi"
      - "Registrga sezgir bo'lmagan fayl tizimlarida (standart macOS, Windows) import ishlaydi, lekin Linux CI'da yoki Docker'da `Cannot find module` xatosi chiqadi; bundan tashqari, fayl qidirish qiyinlashadi"
      - "Hech qanday xavf yo'q"
    answer: 2
    explain: "Bu real va keng tarqalgan xato. `forceConsistentCasingInFileNames` sozlamasi uning bir qismini ushlaydi, lekin yagona konvensiya muammoning ildizini hal qiladi."
task:
  title: "Telemetriya paketidagi tip, generik va fayl nomlarini tartibga keltirish"
  prompt: |
    Quyidagi kod bitta faylda yozilgan, lekin loyihada uch xil uslub aralashgan: Java'dan kelgan `I` prefiksi, raqamli enum, ma'nosiz generik nomlar va noaniq tip nomlari.

    1. Tip nomlarini domen tiliga moslang.
    2. Raqamli enum'ni ma'noli qiymatlarga o'tkazing (union yoki string enum - tanlovingizni izohlang).
    3. Generik parametrlarga ularning roliga mos nom bering (yoki nega `T` qoldirganingizni ayting).
    4. Kodni qanday fayllarga va qanday nomlar bilan bo'lishingizni kommentda yozing.
  lang: ts
  starter: |
    export enum EvtType { A, B, C }

    export interface IData<X, Y> {
      t: EvtType;
      payload: X;
      meta: Y;
    }

    export type TInfo = { imei: string; fw: string };

    export interface IHandler<X, Y> {
      handle(d: IData<X, Y>): Promise<void>;
    }

    export function mk<X, Y>(t: EvtType, payload: X, meta: Y): IData<X, Y> {
      return { t, payload, meta };
    }

    export const handlers: Record<number, IHandler<unknown, TInfo>> = {};
  solution: |
    // Fayllarga bo'lish:
    // telemetry/telemetry-event.ts          - TelemetryEventKind, TelemetryEvent, createTelemetryEvent
    // telemetry/tracker-metadata.ts         - TrackerMetadata
    // telemetry/telemetry-event-handler.ts  - TelemetryEventHandler, eventHandlersByKind

    export const TELEMETRY_EVENT_KINDS = ["position", "ignition", "fuel-level"] as const;
    export type TelemetryEventKind = (typeof TELEMETRY_EVENT_KINDS)[number];

    export type TrackerMetadata = { imei: string; firmwareVersion: string };

    export type TelemetryEvent<Payload, Metadata = TrackerMetadata> = {
      kind: TelemetryEventKind;
      payload: Payload;
      metadata: Metadata;
    };

    export interface TelemetryEventHandler<Payload> {
      handle(event: TelemetryEvent<Payload>): Promise<void>;
    }

    export function createTelemetryEvent<Payload, Metadata>(
      kind: TelemetryEventKind,
      payload: Payload,
      metadata: Metadata,
    ): TelemetryEvent<Payload, Metadata> {
      return { kind, payload, metadata };
    }

    export const eventHandlersByKind: Partial<
      Record<TelemetryEventKind, TelemetryEventHandler<unknown>>
    > = {};
  solutionNotes: |
    - `EvtType { A, B, C }` raqamli enum edi: loglarda `t: 1` ko'rinardi. `as const` massiv va undan olingan union tip tanlandi: qiymatlar o'qiladi va massiv runtime'da validatsiya uchun ham kerak bo'ladi. String enum (`enum TelemetryEventKind { Position = "position" }`) ham to'g'ri tanlov bo'lardi, agar jamoa enum'larni afzal ko'rsa.
    - `IData` -> `TelemetryEvent`: `I` prefiksi va "Data" shovqin so'zi olib tashlandi (12- va 14-darslar). Nom endi domen tushunchasi.
    - `TInfo` -> `TrackerMetadata`: `T` prefiksi va "Info" shovqin edi. `fw` -> `firmwareVersion`.
    - Generik parametrlar `X`, `Y` -> `Payload`, `Metadata`. Bu yerda ikki parametr bor va ular ma'nosi bilan farq qiladi, shuning uchun nom foydali. `Metadata` uchun default qo'yildi, chunki ko'p hollarda u `TrackerMetadata`.
    - `mk` -> `createTelemetryEvent`, `handlers` -> `eventHandlersByKind`: `Record<number, ...>` dagi `number` kalit nimani bildirishini yashirardi.
    - Fayl nomlari `kebab-case` va asosiy eksport qilinadigan tushuncha bo'yicha. Har bir fayl bitta domen tushunchasi atrofida.
  checklist:
    - "Tip nomlarida I/T prefiksi va Data/Info shovqini yo'q"
    - "Enum yoki union qiymatlari serializatsiyada o'qiladi"
    - "Ko'p parametrli generiklarda parametr nomlari rolni aytadi"
    - "Map/Record nomlari kalit ma'nosini aytadi (ByKind, ById)"
    - "Fayl nomlari bitta konvensiyada va ichidagi asosiy tushunchaga mos"
---

## Muammo

TypeScript loyihasida nomlash bir necha alohida "til"da sodir bo'ladi. Qiymatlar va funksiyalar - bitta qatlam. Tiplar - ikkinchi qatlam, ular runtime'da yo'qoladi, lekin o'quvchi uchun kodning eng muhim hujjati. Generik parametrlar - tiplar ichidagi o'zgaruvchilar. Enum va union - qiymat va tip chegarasidagi narsalar. Fayl va papka nomlari esa import yo'llarida, fayl qidiruvida va hatto CI xatolarida ko'rinadi.

Jamoa Java, C#, Go va JavaScript'dan kelgan dasturchilardan tashkil topsa, har bir qatlamda turli odatlar aralashadi: `IUser` va `User`, `TProps` va `Props`, `enum Status { A, B }` va `type Status = "a" | "b"`, `<T, U, V, W>` va `<TEntity, TKey>`, `UserService.ts` va `user.service.ts`. Har bir tanlov o'z-o'zidan himoya qilinishi mumkin, lekin aralashma o'quvchini har bir faylda qaytadan moslashishga majbur qiladi (18-dars).

## Asosiy g'oya

TypeScript'ning o'zi rasmiy nomlash standartini belgilamaydi. TypeScript Handbook misollarida `PascalCase` tip nomlari (`Point`, `Options`, `Animal`) va `camelCase` qiymatlar ishlatiladi, lekin bu tavsiya sifatida emas, shunchaki uslub sifatida. Shuning uchun TypeScript'da nomlash ikki manbaga tayanadi: **jamiyatda keng tarqalgan konvensiyalar** va **jamoaning yozma qarorlari**. Ikkalasini aralashtirmaslik muhim: birinchisini buzish odatda yomon g'oya, ikkinchisi esa jamoa ehtiyojiga qarab o'zgaradi.

Keng tarqalgan konvensiyalar, TypeScript ekotizimida deyarli hamma kutadigan narsalar:

- **Tiplar, interfeyslar, klasslar, enum'lar** - `PascalCase`: `Vehicle`, `TripSummary`, `FuelEventKind`.
- **O'zgaruvchilar, funksiyalar, metodlar, xususiyatlar** - `camelCase`: `vehicleId`, `findById`, `isActive`.
- **Modul darajasidagi o'zgarmas konstantalar** - ko'pincha `UPPER_SNAKE_CASE`: `MAX_RETRIES`, `DEFAULT_TIMEOUT_MS`. Bu majburiy emas, ko'p jamoalar `camelCase` konstantalarni ham ishlatadi. Ko'pchilik `UPPER_SNAKE_CASE` ni faqat "sozlash" mazmunidagi primitiv konstantalar uchun saqlaydi.
- **React komponentlari** - `PascalCase` (bu JSX qoidasi: kichik harfli tag HTML element sifatida o'qiladi).
- **Prefiks yo'q.** `I` va `T` prefikslari TypeScript jamiyatida keng tarqalgan emas (14-dars).

Dan Vanderkam *Effective TypeScript*da tip nomlari haqida muhim fikrni aytadi: tiplarni **problem domain tilida** nomlang. Tip nomi qiymatning ma'nosini bildirishi kerak, uning shaklini emas. U `data`, `info`, `thing`, `item`, `object`, `entity` kabi umumiy so'zlardan qochishni va bir tushuncha uchun turli nomlar ishlatmaslikni maslahat beradi. Bu 11-, 12- va 17-darslardagi g'oyalarning tip darajasidagi ko'rinishi va TypeScript'da ayniqsa muhim, chunki tiplar ko'pincha kodning eng ko'p o'qiladigan qismi: IDE hover'ida, xato xabarlarida, hujjatda.

## Chuqurroq: TypeScript'ga xos nomlash qarorlari

### Generik parametrlar

Generik parametr nomlari bo'yicha ikki maktab bor.

**Bitta harf** (`T`, `U`, `K`, `V`). Bu an'ana Java va C# dan keladi va ko'p kutubxonalarda (`Array<T>`, `Map<K, V>`, `Record<K, T>`) ishlatiladi. Afzalligi: generik parametr tip emas, tip o'zgaruvchisi ekanini darhol ko'rsatadi. Bitta parametrli, qisqa generik uchun `T` yetarli: `function first<T>(items: T[]): T | undefined`.

**Ma'noli nom** (`Type`, `Key`, `Payload`, `Item`). TypeScript Handbook'ning generiklar bo'limi asosan `Type` ni ishlatadi (`function identity<Type>(arg: Type): Type`), shuningdek `Key`, `Input` va `NumType` kabi nomlarni ham, va bitta joyda tip parametr nomi ixtiyoriy ekanini, muhimi soni va ishlatilishi mos kelishi ekanini aytadi. Ya'ni Handbook ham bitta konvensiyani majburlamaydi.

Amaliy qoida 15-darsdagi scope qoidasining tip darajasidagi versiyasi: generik qanchalik murakkab bo'lsa (parametrlar ko'p, shartli tiplar, `infer`, ichma-ich generiklar), nomlar shunchalik ma'noli bo'lishi kerak. `type DeepPartial<T>` - `T` yetarli. `type Handler<TEvent, TContext, TResult>` yoki `<Event, Context, Result>` - `<A, B, C>` dan ancha o'qiladi. Ba'zi jamoalar `T` prefiksi bilan ma'noli nom (`TEvent`) ishlatadi: bu generik parametrni oddiy tipdan farqlaydi va to'qnashuvni oldini oladi (`Event` DOM'da global tip). typescript-eslint hujjatlarida ham generik parametrlarga `T` prefiksini talab qiluvchi konfiguratsiya misoli bor. Bu 14-darsdagi qoidaga zid emas: bu yerda prefiks tip tizimi bermaydigan ma'lumotni (bu oddiy tip emas, parametr) beradi.

### Interface yoki type: nomga ta'sir qilmaydi

TypeScript Handbook interface va type alias farqlarini (declaration merging, `extends` va `&`, primitiv va union'lar) tasvirlaydi va tanlovni asosan shaxsiy afzallik deb biladi: `type` xususiyatlari kerak bo'lguncha `interface` ishlating degan evristikani beradi. Nomlash uchun muhim xulosa: **qaysi biri tanlanganini nomda aks ettirmang**. `VehicleInterface`, `VehicleType`, `IVehicle` - hammasi deklaratsiya turini kodlaydi va u o'zgarsa yolg'onga aylanadi.

### Enum, union va `as const`

TypeScript'da cheklangan qiymatlar to'plamini ifodalashning uch yo'li bor va har biri nomlashga ta'sir qiladi:

- **Raqamli enum** (`enum Status { Active, Inactive }`). Qiymatlari `0`, `1`. Loglarda, JSON'da, DB'da ma'nosiz. Bundan tashqari, a'zo tartibi o'zgarsa, qiymatlar ham jimgina o'zgaradi. Nomlash nuqtai nazaridan eng zaif variant.
- **String enum** (`enum Status { Active = "active" }`). Qiymatlar o'qiladi. Enum nomi va a'zolari `PascalCase`. Kamchiligi: runtime obyekt yaratadi va strukturaviy tiplashga to'liq mos kelmaydi (string literal'ni enum o'rniga uzatib bo'lmaydi).
- **Union tip** (`type Status = "active" | "inactive"`) yoki **`as const` massiv/obyekt**. Qiymatlarning o'zi nom. Runtime'da validatsiya uchun qiymatlar ro'yxati kerak bo'lsa, `as const` massivdan tip olinadi.

Qaysi biri tanlanmasin, enum yoki tip nomini `Enum`, `Type`, `E` qo'shimchalarisiz bering: `FuelEventKind`, `FuelEventKindEnum` emas. Birlik shaklida: `Status`, `Statuses` emas, chunki tip bitta qiymatni ifodalaydi.

### Fayl va papka nomlari

Fayl nomlari bo'yicha TypeScript ekotizimida yagona standart yo'q, lekin bir nechta keng tarqalgan uslub bor:

- **`kebab-case`** (`trip-summary.ts`, `use-vehicle.ts`). Registrga sezgir bo'lmagan fayl tizimlarida xavfsiz va URL'larga o'xshaydi. Angular va NestJS uslubiga yaqin.
- **NestJS suffikslari** (`vehicles.controller.ts`, `vehicles.service.ts`, `create-vehicle.dto.ts`, `vehicles.module.ts`). NestJS CLI generatori shunday fayllar yaratadi. Suffiks fayl rolini aytadi va qidirishni osonlashtiradi.
- **Komponent fayllari `PascalCase`** (`VehicleCard.tsx`). React jamoalarida keng tarqalgan, chunki fayl nomi eksport qilinadigan komponent nomiga mos. Boshqa jamoalar `vehicle-card.tsx` ni afzal ko'radi.
- **Next.js App Router'ning maxsus fayl nomlari** (`page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`) va papka konvensiyalari (`[vehicleId]`, `(dashboard)`). Bular freymvork shartnomasi, ularni o'zgartirib bo'lmaydi.

Eng muhim qoida - **bitta loyihada bitta uslub**. Aralash registr real xatoga olib keladi: macOS va Windows'ning standart fayl tizimlari registrga sezgir emas, shuning uchun `import "./VehicleCard"` fayl `vehicleCard.tsx` bo'lsa ham lokal ishlaydi, lekin Linux'dagi CI yoki Docker'da xato beradi. `tsconfig`dagi `forceConsistentCasingInFileNames` sozlamasi (uni loyihangizda yoqilganini tekshiring) bitta faylga turli registr bilan murojaat qilishni xato deb belgilaydi va muammoning bir qismini ushlaydi, lekin ildizi - konvensiya yo'qligi.

### Avtomatlashtirish: `naming-convention`

typescript-eslint'ning `@typescript-eslint/naming-convention` qoidasi nomlarni selektorlar bo'yicha tekshiradi: `variable`, `function`, `typeLike`, `interface`, `typeParameter`, `enumMember` va boshqalar. Har bir selektor uchun `format` (`camelCase`, `PascalCase`, `UPPER_CASE` va hokazo), `prefix`, `suffix`, `leadingUnderscore` va `custom` regex berilishi mumkin. Hujjatlarda tayyor misollar bor: interfeyslarda `I` prefiksini taqiqlash, boolean o'zgaruvchilarga `is`/`should`/`has`/`can`/`did`/`will` prefikslarini talab qilish, generik parametrlarga `T` prefiksi.

Hujjatlar ikki muhim ogohlantirish beradi. Birinchisi: qoida juda qattiq bo'lishi mumkin. Kuchli ehtiyoj bo'lmasa, uni faqat jiddiy buzilishlar uchun ishlatish yoki o'chirish tavsiya etiladi. Ikkinchisi: `types` opsiyasi (masalan, faqat boolean o'zgaruvchilar uchun prefiks) tip ma'lumotini talab qiladi, bu esa lint vaqtini oshiradi. Qoida hozir "feature frozen" holatda: yangi opsiyalar qo'shilmaydi.

## Misol: lint konfiguratsiyasi

Quyidagi ESLint flat config bo'lagi yuqoridagi konvensiyalarning minimal to'plamini tekshiradi:

```ts
// eslint.config.mjs (bo'lagi)
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.ts", "**/*.tsx"],
  // Parser va @typescript-eslint plaginini ro'yxatdan o'tkazadi.
  extends: [tseslint.configs.base],
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "typeLike", format: ["PascalCase"] },
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: { regex: "^I[A-Z]", match: false },
      },
      { selector: "typeParameter", format: ["PascalCase"] },
      { selector: "enumMember", format: ["PascalCase"] },
      {
        selector: "variable",
        modifiers: ["const", "global"],
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
      },
    ],
  },
});
```

Bu konfiguratsiyada nima bor va nima yo'q:

- **Bor:** tiplar `PascalCase`, `I` prefiksi taqiqlangan, enum a'zolari `PascalCase`. Bular jamoada bahs bo'lmaydigan va mexanik tekshiriladigan qoidalar.
- **Global konstantalar uchun uchta format ruxsat etilgan.** `PascalCase` React komponentlari (`const VehicleCard = ...`) va `as const` obyektlar uchun, `UPPER_CASE` sozlash konstantalari uchun. Juda qattiq qoida bu yerda foydadan ko'p shovqin beradi.
- **Yo'q:** boolean prefikslari. Ular `types` opsiyasini va tip ma'lumotini talab qiladi. Agar loyiha allaqachon type-aware linting ishlatsa, qo'shish mumkin. Aks holda bu code review'da tekshiriladi.
- **Yo'q:** ma'no tekshiruvi. Linter `Data`, `Info`, `Manager` so'zlarini regex bilan taqiqlashi mumkin, lekin `VehicleTable` va `VehicleRow` kabi oqlangan holatlarni ham ushlaydi. Ma'no - review'ning ishi.

## Qachon qo'llamaslik kerak

- **Generatsiya qilingan kod.** Prisma, OpenAPI, GraphQL codegen o'z nomlarini beradi. Ularni linter'dan chiqarib tashlang (`ignores`), aks holda yuzlab ma'nosiz xato.
- **Tashqi shartnomalar.** API javobidagi `snake_case` maydonlar (`created_at`), HTTP header'lar, env o'zgaruvchilari. Ularni chegarada mapping qilish mumkin, lekin ba'zan to'g'ridan-to'g'ri ishlatish arzonroq. Linter'da `requiresQuotes` modifikatori yoki alohida istisno qiling.
- **Qoidalarni ko'paytirish.** 20 ta selektorli `naming-convention` konfiguratsiyasi tez orada hech kim tushunmaydigan va hamma `eslint-disable` bilan chetlab o'tadigan narsaga aylanadi. Eng ko'p xato beradigan 4-6 qoidani avtomatlashtiring.
- **Mavjud loyihada birdaniga yoqish.** Katta loyihada yangi nomlash qoidasini `error` darajasida yoqish minglab xato beradi. Avval `warn`, keyin bosqichma-bosqich tuzatish (20-dars).
- **Bitta harfli generiklarni majburan uzaytirish.** `Array<T>`, `Promise<T>`, `Map<K, V>` hammaga tanish. Kutubxona uslubidagi qisqa generikni `Array<ElementType>` ga aylantirish hech narsa bermaydi.

## Stack'da: NestJS, React, Next.js, Prisma

- **NestJS.** Fayllar `<nom>.<rol>.ts` (`trips.service.ts`), klasslar `<Nom><Rol>` (`TripsService`, `TripsController`, `CreateTripDto`). CLI shunday generatsiya qiladi va jamoaning yangi a'zolari buni kutadi.
- **React.** Komponent `PascalCase`, prop tipi `<Komponent>Props` (`TripCardProps`), hook `use<Nom>` (`useTrip`), kontekst `<Nom>Context` va provider `<Nom>Provider`. Fayl nomi komponent yoki hook nomiga mos.
- **Next.js App Router.** Maxsus fayllar (`page.tsx`, `layout.tsx`, `route.ts`) va dinamik segmentlar (`[tripId]`) freymvork shartnomasi. Dinamik segment nomi `params` obyektidagi kalit bo'ladi, shuning uchun uni ma'noli qiling: `[tripId]`, `[id]` emas (ayniqsa ichma-ich segmentlarda).
- **Prisma.** Model nomlari `PascalCase` va birlik shaklida (`Trip`, `Trips` emas), maydonlar `camelCase`. Prisma hujjatlari ham shu konvensiyani aytadi va DB'dagi `snake_case` nomlar uchun `@map` va `@@map` atributlarini beradi: `createdAt DateTime @map("created_at")`, `@@map("trips")`. Shunday qilib TypeScript va SQL har biri o'z konvensiyasida qoladi.
- **Kysely.** Agar DB `snake_case` va kod `camelCase` bo'lsa, `CamelCasePlugin` identifikatorlarni avtomatik o'giradi. Bu qulay, lekin xom SQL bo'laklarida (`sql\`...\``) DB nomlarini yozishni unutmang.

## Xulosa

- TypeScript rasmiy nomlash standartini bermaydi, lekin keng tarqalgan konvensiyalar bor: tiplar `PascalCase`, qiymatlar `camelCase`, prefikslarsiz.
- Tip nomlari domen tilida bo'lsin va deklaratsiya turini (interface, type, enum) kodlamasin.
- Generik parametr nomlari murakkablikka mos: qisqa generikda `T`, ko'p parametrli va murakkab tiplarda ma'noli nom.
- Cheklangan qiymatlar uchun o'qiladigan qiymatlarni tanlang: union, `as const` yoki string enum. Raqamli enum loglarda ma'noni yo'qotadi.
- Fayl nomlari bitta konvensiyada bo'lsin, aks holda registrga sezgir fayl tizimida real xato chiqadi. Mexanik qoidalarni `naming-convention` bilan avtomatlashtiring, ma'noni review'da tekshiring.
