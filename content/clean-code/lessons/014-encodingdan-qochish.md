---
n: 14
slug: encodingdan-qochish
title: "Kodlashdan qochish: Hungarian, I-prefiks, m_"
summary: "Nomga tip, scope yoki tuzilma haqidagi kodni qo'shish odati zaif tipli tillar va oddiy muharrirlar davridan qolgan. Bu darsda bu odatlar qayerdan kelganini, TypeScript'da nega ular ko'pincha ortiqcha ekanini va qaysi \"kodlash\" hali ham foydali ekanini ko'ramiz."
duration: 30
sources:
  - id: cc1
    note: "2-bob \"Meaningful Names\": \"Avoid Encodings\" bo'limi (Hungarian Notation, Member Prefixes, Interfaces and Implementations)"
  - id: effective-ts
    note: "Hujjat va nomlarda tip ma'lumotini takrorlamaslik haqidagi bo'lim: o'lchov birligi bundan istisno"
  - id: ts-handbook
    note: "\"Everyday Types\": type alias va interface farqlari; \"Classes\": private va #private maydonlar"
quiz:
  - q: "Nima uchun Martin Hungarian notation (`strName`, `iCount`) zamonaviy tillarda kerak emas deb hisoblaydi?"
    options:
      - "Chunki prefikslar juda uzun"
      - "Chunki zamonaviy tillar va IDE tipni o'zi ko'rsatadi va tekshiradi, nomdagi tip esa tip o'zgarganda eskirib, yolg'onga aylanadi"
      - "Chunki Microsoft uni taqiqlagan"
      - "Chunki u faqat C++ da ishlaydi"
    answer: 1
    explain: "Hungarian notation kompilyator tiplarni tekshirmagan davrda foydali edi. Endi tip tizimi bu ishni qiladi, nomdagi kod esa takror ma'lumot: tip o'zgarganda kimdir nomni yangilashni unutadi."
  - q: "`interface IVehicleRepository` va `class VehicleRepository implements IVehicleRepository`. Martin bu holatda qanday yechimni afzal ko'radi?"
    options:
      - "Interfeysga `I` prefiksini qoldirish"
      - "Ikkalasini ham bir xil nomlash"
      - "Interfeysni toza qoldirish (`VehicleRepository`) va kerak bo'lsa implementatsiyani kodlash (`PostgresVehicleRepository` yoki `VehicleRepositoryImpl`)"
      - "Interfeysdan voz kechish"
    answer: 2
    explain: "Martin interfeys foydalanuvchilariga u interfeys ekanini bilish shart emasligini aytadi. Agar biri kodlanishi kerak bo'lsa, implementatsiyani kodlash afzal. Eng yaxshisi - implementatsiyani nima bilan farq qilishi bo'yicha nomlash (`Postgres...`)."
  - q: "Qaysi \"kodlash\" TypeScript'da hali ham foydali?"
    options:
      - "`strDriverName`"
      - "`arrVehicles`"
      - "`m_speed`"
      - "`timeoutMs`"
    answer: 3
    explain: "O'lchov birligi tip tizimida ko'rinmaydi: `number` millisekundmi yoki soniyami, kompilyator bilmaydi. Shuning uchun birlik nomda foydali. Qolganlari tip tizimi allaqachon beradigan ma'lumotni takrorlaydi."
  - q: "TypeScript klassida `private _speed: number` bor. Hozirgi TypeScript/JavaScript'da `_` prefiksi haqida qaysi gap to'g'ri?"
    options:
      - "`private` kalit so'zi yoki `#speed` maydoni private'likni til darajasida ifodalaydi, shuning uchun `_` ko'pincha takror; istisno - getter bilan bir xil nomli maydon"
      - "`_` prefiksi maydonni runtime'da yashiradi"
      - "`_` prefiksisiz TypeScript private maydonga ruxsat bermaydi"
      - "`_` prefiksi performance'ni oshiradi"
    answer: 0
    explain: "`_` faqat konvensiya, u hech narsani yashirmaydi. `private` kompilyatsiya vaqtida, `#field` esa runtime'da ham himoya qiladi. `get speed()` va maydon bir xil nomga ega bo'la olmagani uchun `_speed` yoki `#speed` ishlatish oqilona istisno."
  - q: "Jamoangiz NestJS loyihasida barcha interfeyslar `I` bilan boshlanadi (`IUserService`, `IConfig`) va bu 300 ta faylda. Siz yangi modul yozyapsiz. Eng oqilona harakat qaysi?"
    options:
      - "Yangi modulda `I` ni ishlatmaslik, chunki Martin shunday deydi"
      - "Butun loyihadagi `I` prefikslarini bitta PR bilan olib tashlash"
      - "Hozircha mavjud konvensiyaga amal qilish va konvensiyani o'zgartirishni jamoa bilan alohida muhokama qilish"
      - "Linter'ni o'chirish"
    answer: 2
    explain: "Bitta loyihada ikki konvensiya bo'lishi har ikkalasidan yomonroq (18-dars). Konvensiyani o'zgartirish jamoa qarori bo'lishi kerak va bosqichma-bosqich, alohida PR'larda amalga oshiriladi."
task:
  title: "Telemetriya modulidagi kodlashlarni olib tashlash"
  prompt: |
    Quyidagi kod eski Java/C# an'analariga ko'ra yozilgan TypeScript moduli: Hungarian prefikslar, `I` interfeyslar, `m_` va `_` maydonlar, `Enum` va `Type` suffikslari.

    1. Har bir kodlashni toping va u qaysi ma'lumotni takrorlashini ayting (tip, scope, tuzilma).
    2. Takror ma'lumotni olib tashlang. Tip tizimida ko'rinmaydigan ma'lumotni (masalan, o'lchov birligi) nomda saqlang yoki qo'shing.
    3. Implementatsiya nomini u nima bilan farq qilishi bo'yicha bering.
  lang: ts
  starter: |
    export enum EStatusEnum { Online, Offline }

    export interface ITrackerType {
      strImei: string;
      eStatus: EStatusEnum;
      nLastSeen: number;
    }

    export interface ITrackerRepository {
      getByImei(strImei: string): Promise<ITrackerType | null>;
    }

    export class TrackerRepositoryImpl implements ITrackerRepository {
      private m_arrTrackers: ITrackerType[] = [];
      private _nTimeout: number;

      constructor(nTimeout: number) {
        this._nTimeout = nTimeout;
      }

      async getByImei(strImei: string): Promise<ITrackerType | null> {
        const objTracker = this.m_arrTrackers.find((t) => t.strImei === strImei);
        if (!objTracker) return null;
        const bIsStale = Date.now() - objTracker.nLastSeen > this._nTimeout;
        return bIsStale ? { ...objTracker, eStatus: EStatusEnum.Offline } : objTracker;
      }
    }
  solution: |
    export type TrackerStatus = "online" | "offline";

    export interface Tracker {
      imei: string;
      status: TrackerStatus;
      lastSeenAtMs: number;
    }

    export interface TrackerRepository {
      findByImei(imei: string): Promise<Tracker | null>;
    }

    export class InMemoryTrackerRepository implements TrackerRepository {
      readonly #trackers: Tracker[] = [];

      constructor(private readonly staleAfterMs: number) {}

      async findByImei(imei: string): Promise<Tracker | null> {
        const tracker = this.#trackers.find((t) => t.imei === imei);
        if (!tracker) return null;
        const isStale = Date.now() - tracker.lastSeenAtMs > this.staleAfterMs;
        return isStale ? { ...tracker, status: "offline" } : tracker;
      }
    }
  solutionNotes: |
    - `str`, `n`, `b`, `obj`, `arr`, `e` prefikslari olib tashlandi: tip deklaratsiyada va IDE'da ko'rinadi.
    - `nLastSeen` -> `lastSeenAtMs` va `_nTimeout` -> `staleAfterMs`: tipdagi `number` birlikni aytmaydi, shuning uchun birlik nomga qo'shildi. Bu biz saqlagan yagona "kodlash" va u tip tizimi bermaydigan ma'lumotni beradi.
    - `ITrackerType` -> `Tracker`: `I` va `Type` ikkalasi ham tuzilmani takrorlardi.
    - `EStatusEnum` -> `TrackerStatus` union tipi. Bu nomlash bilan birga dizayn qarori ham: raqamli enum (`0`, `1`) loglarda va JSON'da ma'nosiz ko'rinardi. Agar jamoa `enum` ni afzal ko'rsa, `enum TrackerStatus { Online = "online", Offline = "offline" }` ham to'g'ri, faqat prefiks va suffikssiz.
    - `TrackerRepositoryImpl` -> `InMemoryTrackerRepository`: `Impl` hech narsa demasdi, yangi nom bu implementatsiyani boshqalardan (`PostgresTrackerRepository`) nima ajratishini aytadi.
    - `m_arrTrackers` -> `#trackers`: til darajasidagi private maydon. `m_` va `_` konvensiyalari endi kerak emas.
    - `getByImei` -> `findByImei`: `null` qaytarishi mumkin bo'lgan qidiruv uchun `find` (12- va 18-darslar). Bu jamoa konvensiyasiga bog'liq.
  checklist:
    - "Nomlarda tipni takrorlovchi prefiks (str, n, b, arr, obj) qolmadi"
    - "Interfeys nomida I prefiksi, tip nomida Type suffiksi yo'q"
    - "Implementatsiya nomi uning o'ziga xosligini aytadi (Impl emas)"
    - "Vaqt va boshqa birlikli qiymatlarning nomida birlik bor"
    - "Private maydonlar til vositalari bilan ifodalangan"
---

## Muammo

Ko'p dasturchilar TypeScript'ga Java, C#, C++ yoki eski PHP loyihalaridan keladi va o'zlari bilan nomlash odatlarini olib keladi: `IUserService`, `strName`, `m_speed`, `_count`, `EStatus`, `VehicleTypeEnum`. Bu odatlarning har biri o'z davrida aniq muammoni hal qilgan. Lekin TypeScript'da ularning ko'pchiligi hal qiladigan muammo qolmagan, qoladigan narsa esa - nomlardagi takror va eskiruvchi ma'lumot.

Real misol: `const arrDrivers = await repo.findDrivers()`. Bir yildan keyin `findDrivers` massiv o'rniga paginatsiyalangan natija (`{ items, nextCursor }`) qaytaradigan bo'ldi. Kompilyator chaqiruvchi kodni tuzatishga majbur qiladi, lekin o'zgaruvchi nomi `arrDrivers` bo'lib qoldi. Endi nom yolg'on gapiradi (12-dars) va hech qanday vosita buni ushlamaydi.

## Asosiy g'oya

Martin *Clean Code*ning 2-bobida "Avoid Encodings" qoidasini beradi: nomga tip yoki scope haqidagi ma'lumotni kodlash o'quvchiga qo'shimcha tarjima yukini yuklaydi. Har bir yangi xodim nafaqat domen va kodni, balki "kodlash tili"ni ham o'rganishi kerak. Martin uchta keng tarqalgan turni ko'rib chiqadi.

**Hungarian notation.** Nom boshiga tipni bildiruvchi prefiks: `strName`, `iCount`, `bIsActive`, `lpszBuffer`. Martin tushuntirishicha, bu Windows C API davrida, kompilyator tiplarni deyarli tekshirmagan paytda muhim edi: dasturchi tipni eslab qolishi uchun nom yagona vosita bo'lgan. Zamonaviy tillarda tip tizimi bu ishni qiladi, IDE esa tipni sichqoncha bilan ko'rsatadi. Natijada prefiks foydasiz bo'ladi va bundan ham yomoni, tip o'zgarganda nom o'zgarmay qoladi.

**A'zo prefikslari.** `m_` (member) yoki `_` bilan klass maydonlarini lokal o'zgaruvchilardan farqlash. Martin fikricha, klasslar va funksiyalar yetarlicha kichik bo'lsa, bu farq kerak emas, muharrir esa maydonlarni rang bilan ajratadi. Odamlar tez orada prefiksni ko'rmasdan, faqat nomning ma'noli qismini o'qishni o'rganadi. Prefiks shunchaki vizual shovqinga aylanadi.

**Interfeys va implementatsiya.** Martin bu yerda boshqalarga qaraganda ehtiyotkorroq gapiradi. U `IShapeFactory` va `ShapeFactory` juftligini misol qiladi va interfeysni prefiksisiz qoldirishni afzal ko'radi: foydalanuvchilar ular bilan interfeys orqali ishlayotganini bilishlari shart emas. Agar ikkisidan birini kodlash kerak bo'lsa, u implementatsiyani kodlashni tanlaydi: `ShapeFactoryImp` (u o'zi shu shaklni ishlatadi), `IShapeFactory` dan ko'ra yaxshiroq.

Dan Vanderkam *Effective TypeScript*da shunga yaqin fikrni TypeScript nuqtai nazaridan aytadi: tip ma'lumotini hujjatda va nomlarda takrorlamang, chunki tip annotatsiyasi kompilyator tekshiradigan, sinxron qoladigan hujjat. Komment yoki nomdagi tip esa tekshirilmaydi va eskiradi. Lekin u muhim istisnoni ko'rsatadi: **o'lchov birligi**. `timeMs` yoki `temperatureC` dagi birlik `number` tipida ko'rinmaydi, shuning uchun uni nomga qo'shish foydali.

## Chuqurroq: qaysi ma'lumot qayerda yashashi kerak

Kodlash haqidagi bahsni bitta savolga keltirish mumkin: **bu ma'lumotni tip tizimi allaqachon beradimi?** Agar bersa, nomdagi nusxa takror va eskirish xavfi. Agar bermasa, nom uni yetkazishning yagona yo'li bo'lishi mumkin.

### Tip tizimi beradigan ma'lumot

- **Asosiy tip** (`string`, `number`, massiv, obyekt). `strName`, `arrItems`, `objConfig` - takror.
- **Interfeys yoki klass ekanligi.** TypeScript'da strukturaviy tiplar ishlaydi: chaqiruvchi uchun `Tracker` interfeysmi, type alias'mi yoki klassmi, deyarli farqi yo'q. `I` prefiksi foydalanuvchiga keraksiz implementatsiya tafsilotini aytadi.
- **Enum ekanligi.** `EStatus`, `StatusEnum`. Tipning qanday e'lon qilingani uning ma'nosiga ta'sir qilmasligi kerak. Ertaga enum'ni union tipga almashtirsangiz, barcha nomlarni o'zgartirish kerak bo'ladi.
- **Private ekanligi.** TypeScript'da `private` kalit so'zi (kompilyatsiya vaqtida tekshiriladi) va JavaScript'ning `#field` sintaksisi (runtime'da ham haqiqatan yashirin) bor. TypeScript Handbook ikkala usulni ham tasvirlaydi. `_` esa faqat konvensiya va hech narsani himoya qilmaydi.

### Tip tizimi bermaydigan ma'lumot

- **O'lchov birligi.** `distance: number` - kilometrmi, metrmi, milmi? `fuelLevel: number` - litrmi, foizmi? `price: number` - so'mmi, tiyinmi, dollarmi? Bu ma'lumot tipda yo'q (agar branded tip ishlatmasangiz, 44-dars), lekin uning xatosi juda qimmat. `distanceKm`, `fuelLevelLiters`, `priceTiyin` - bu yaxshi "kodlash".
- **Holat yoki xavfsizlik.** Hungarian notation tarixida odatda ikki variant farqlanadi: tipni kodlovchi ("Systems Hungarian") va ma'noni kodlovchi ("Apps Hungarian"). Ikkinchisining g'oyasi kompilyator tekshirmaydigan ma'noni nomga qo'yish edi, masalan xavfsiz va xavfsiz bo'lmagan (escape qilinmagan) string'larni farqlash. Bugungi `rawHtml` va `sanitizedHtml`, `untrustedInput` kabi nomlar shu g'oyaning foydali qismi. Lekin bu ham ideal holatda tip bilan ifodalanadi.
- **Kalit ma'nosi.** `vehiclesById`, `driversByLicenseNumber`. Bu tuzilmani emas, Map'ning kaliti nima ekanini aytadi. `Map<string, Vehicle>` dan buni bilib bo'lmaydi.

### `I` prefiksi: munozarali, lekin TypeScript'da kamroq ehtiyoj

`I` prefiksi C# va .NET olamida rasmiy konvensiya va ko'p jamoalar uni TypeScript'ga olib kelgan. Martin unga qarshi, lekin bu masalada "hamma kelishgan" deb bo'lmaydi. Prefiks tarafdorlarining argumenti: bir qarashda interfeys va implementatsiyani farqlash oson, `UserService` va `IUserService` juftligida nom to'qnashuvi yo'q.

TypeScript kontekstida qarshi argumentlar kuchliroq:

- TypeScript'ning o'z repozitoriyasidagi contributor qoidalari interfeyslarga `I` prefiksini qo'ymaslikni so'raydi (garchi ular bu jamiyat uchun majburiy qoida emas, faqat kompilyator kodi uchun ekanini aytadi).
- typescript-eslint'ning `naming-convention` qoidasi hujjatlarida `I` prefiksini taqiqlash uchun tayyor konfiguratsiya misoli bor. Bu prefiks TypeScript'da keng tarqalgan konvensiya emasligini bilvosita ko'rsatadi.
- TypeScript'da interfeys va type alias deyarli almashtiriladi. Agar `IVehicle` ni `type` ga o'zgartirsangiz, `I` endi yolg'on.
- Nom to'qnashuvi muammosi ko'pincha yomon implementatsiya nomining belgisi. `UserService` va `UserServiceImpl` o'rniga `UserService` (interfeys) va `PrismaUserService` (implementatsiya) nima farq borligini aytadi.

## Misol: NestJS'dagi to'lov provayderi

```ts
// Eski uslub
export interface IPaymentProvider {
  charge(nAmount: number, strCardToken: string): Promise<boolean>;
}

export class PaymentProviderImpl implements IPaymentProvider {
  private _strApiKey: string;
  constructor(strApiKey: string) {
    this._strApiKey = strApiKey;
  }
  async charge(nAmount: number, strCardToken: string): Promise<boolean> {
    // ... tashqi API chaqiruvi
    return nAmount > 0 && strCardToken.length > 0 && this._strApiKey.length > 0;
  }
}
```

Bu kodda uchta muammo bor. Prefikslar tipni takrorlaydi. `nAmount` eng muhim narsani aytmaydi: summa so'mdami yoki tiyindami? Va `Impl` qaysi provayder ekanini yashiradi, garchi ertaga ikkinchi provayder qo'shilishi aniq.

```ts
export type ChargeResult =
  | { status: "succeeded"; transactionId: string }
  | { status: "declined"; reason: string };

export interface PaymentProvider {
  charge(amountTiyin: number, cardToken: string): Promise<ChargeResult>;
}

export class PaymeProvider implements PaymentProvider {
  constructor(private readonly apiKey: string) {}

  async charge(amountTiyin: number, cardToken: string): Promise<ChargeResult> {
    if (amountTiyin <= 0 || cardToken.length === 0 || this.apiKey.length === 0) {
      return { status: "declined", reason: "invalid_request" };
    }
    // ... tashqi API chaqiruvi
    return { status: "succeeded", transactionId: `tx_${Date.now()}` };
  }
}

export const PAYMENT_PROVIDER = Symbol("PAYMENT_PROVIDER");
```

Nima o'zgardi:

- **`IPaymentProvider` -> `PaymentProvider`.** Foydalanuvchi kodi (`constructor(@Inject(PAYMENT_PROVIDER) private readonly payments: PaymentProvider)`) toza o'qiladi.
- **`PaymentProviderImpl` -> `PaymeProvider`.** Implementatsiya o'zining farqi bo'yicha nomlandi. Ikkinchi provayder (`ClickProvider`) qo'shilganda nom to'qnashuvi yo'q.
- **`nAmount` -> `amountTiyin`.** Tip prefiksi olib tashlandi, birlik qo'shildi. Pul bilan ishlovchi kodda bu eng muhim nom o'zgarishi.
- **`private _strApiKey` -> `private readonly apiKey` (parameter property).** `_` kerak emas, `private` va `readonly` niyatni til darajasida aytadi.
- **NestJS injection token.** TypeScript interfeyslari runtime'da yo'qoladi, shuning uchun NestJS'da interfeys orqali inject qilish uchun token kerak. `Symbol` token'i interfeys nomidan alohida va bu yerda `I` prefiksiga ehtiyoj qolmaydi.

## Qachon qo'llamaslik kerak

- **Mavjud konvensiyaga qarshi chiqish.** Agar loyihada barcha interfeyslar `I` bilan boshlansa, yangi faylda prefikssiz yozish ikki konvensiyani aralashtiradi. Izchillik alohida qoidadan muhimroq (18-dars). O'zgartirishni jamoa bilan kelishing va mexanik refaktoring sifatida alohida qiling.
- **Tashqi va generatsiya qilingan kod.** OpenAPI, GraphQL yoki gRPC generatorlari o'z konvensiyalarida nom beradi (`IUserDto`, `UserTypeEnum`). Generatsiya qilingan kodni qo'lda o'zgartirmang. Agar nomlar halaqit bersa, generator sozlamalarini o'zgartiring yoki chegarada qayta eksport qiling.
- **Getter bilan to'qnashuv.** `get speedKmh()` va uning ortidagi maydon bir xil nomga ega bo'la olmaydi. Bu holatda `#speedKmh` yoki `private _speedKmh` oqilona. Bu kodlash emas, til cheklovi.
- **Tip ma'lumot bermaydigan joylarda.** Birlik (`Ms`, `Km`, `Uzs`), xavfsizlik holati (`raw`, `sanitized`), kalit ma'nosi (`ById`) - bularni "kodlash" deb olib tashlamang.
- **Tiplar va qiymatlar bir nomda.** TypeScript'da bir xil nomli tip va qiymat (masalan, `const TrackerStatus = {...} as const` va `type TrackerStatus`) mumkin. Bu konvensiyani hamma ham tanimaydi. Agar jamoa uni chalkash deb hisoblasa, `TrackerStatuses` kabi farq qilish ham oqilona.

## Stack'da: TypeScript, NestJS, React

- **typescript-eslint `naming-convention`.** Bu qoida interfeys `I` prefiksini taqiqlash, boolean'larga prefiks talab qilish kabi konvensiyalarni avtomatik tekshirishi mumkin. Uning hujjatlari ham ogohlantiradi: qoida juda qattiq bo'lishi mumkin, shuning uchun faqat jamoa haqiqatan kelishgan narsalarni tekshiring (37-dars).
- **React komponentlari va prop tiplari.** `IButtonProps` emas, `ButtonProps`. `TButton` yoki `ButtonType` emas. Komponent nomi `Button`, uning prop'lari `ButtonProps` - bu React jamiyatida keng tarqalgan konvensiya.
- **Prisma va DB.** Prisma model nomi (`Vehicle`) tip sifatida generatsiya qilinadi. Uni `VehicleModel` yoki `TVehicle` deb qayta nomlash kerak emas. Agar domen tipi DB tipidan farq qilsa, bu farqni ma'noli nom bilan ifodalang (`VehicleRow` va `Vehicle`, 12-dars).
- **Fayl nomlari.** `IVehicleRepository.ts`, `vehicle.interface.ts` kabi fayl nomlari ham kodlash. NestJS'ning `*.service.ts`, `*.module.ts`, `*.dto.ts` suffikslari esa freymvork konvensiyasi va fayl rolini aytadi, shuning uchun ular foydali (19-dars).

## Xulosa

- Nomdagi tip yoki scope kodi o'quvchiga tarjima yuki va tip o'zgarganda eskiradigan takror ma'lumot.
- Asosiy savol: bu ma'lumotni tip tizimi allaqachon beradimi? Bersa - nomdan olib tashlang.
- O'lchov birligi, xavfsizlik holati va kalit ma'nosi tipda ko'rinmaydi, ularni nomda saqlash foydali.
- `I` prefiksi munozarali konvensiya, lekin TypeScript'da unga ehtiyoj kam. Implementatsiyani `Impl` bilan emas, o'z farqi bilan nomlang.
- Mavjud loyiha konvensiyasini yakka tartibda buzmang. O'zgarish jamoa qarori va alohida refaktoring.
