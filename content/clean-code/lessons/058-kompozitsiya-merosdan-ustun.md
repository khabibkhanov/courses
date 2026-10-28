---
n: 58
slug: kompozitsiya-merosdan-ustun
title: "Kompozitsiya merosdan ustun"
summary: "GoF kitobining eng mashhur maslahatlaridan biri: klass merosidan ko'ra obyekt kompozitsiyasini afzal ko'ring. Bu darsda nima uchun meros eng kuchli bog'lanish ekanini, fragile base class muammosini, TypeScript'da kompozitsiyaning idiomatik shakllarini va meros hali ham o'rinli bo'lgan holatlarni ko'ramiz."
duration: 35
sources:
  - id: gof
    note: "1-bob (Introduction): \"Inheritance versus Composition\" bo'limi, white-box va black-box reuse, delegatsiya; ikkinchi tamoyil - interfeysga dasturlash"
  - id: effective-ts
    note: "Strukturaviy tiplash, union va intersection tiplar, klass o'rniga obyekt va funksiyalardan foydalanish haqidagi maslahatlar (umumiy ma'noda)"
  - id: refactoring-catalog
    note: "Replace Subclass with Delegate va Replace Superclass with Delegate refaktoringlari"
quiz:
  - q: "GoF kitobida meros va kompozitsiyani solishtirganda meros qanday qayta foydalanish deb ataladi?"
    options:
      - "Black-box reuse: ota klass ichki tuzilishi yashirin"
      - "Runtime reuse"
      - "Functional reuse"
      - "White-box reuse: voris ota klassning ichki tafsilotlarini ko'radi va ularga bog'liq"
    answer: 3
    explain: "GoF merosni white-box reuse deb ataydi, chunki ota klassning ichki qismi voris uchun ochiq. Kompozitsiya esa black-box reuse: obyektlar faqat interfeys orqali muloqot qiladi."
  - q: "Fragile base class muammosi nimani anglatadi?"
    options:
      - "Ota klassdagi o'zgarish, hatto ommaviy interfeys o'zgarmasa ham, voris klasslarni buzishi mumkin, chunki ular ota klassning ichki xatti-harakatiga tayanadi"
      - "Ota klassni yaratib bo'lmaydi"
      - "Ota klass juda ko'p xotira ishlatadi"
      - "Voris klass ota klass konstruktorini chaqirmaydi"
    answer: 0
    explain: "Klassik misol: ota klassning `addAll()` metodi ichida `add()`ni chaqirishi. Voris `add()`ni hisoblagich bilan override qilgan. Ota klass muallifi `addAll()`ni optimallashtirib `add()`siz yozsa, voris hisoblagichi jim noto'g'ri bo'lib qoladi."
  - q: "`ElectricVehicle extends Vehicle`, `Truck extends Vehicle` bor. Endi elektr yuk mashinasi kerak. Meros bilan qanday muammo paydo bo'ladi?"
    options:
      - "Hech qanday muammo yo'q"
      - "TypeScript ko'p merosni qo'llab-quvvatlaydi, shuning uchun ikkalasidan meros olish mumkin"
      - "Ierarxiya ikki mustaqil o'q (dvigatel turi va kuzov turi) ni bitta daraxtga majburlaydi: kombinatsiyalar portlaydi yoki kod takrorlanadi"
      - "Faqat performance muammosi"
    answer: 2
    explain: "Meros bitta o'q bo'yicha klassifikatsiya. Ikki mustaqil o'zgarish o'qi bo'lsa, ularni kompozitsiya bilan ajratish kerak: `Vehicle { powertrain: Powertrain; body: Body }`. Bu GoF'dagi Bridge va Strategy g'oyasi."
  - q: "TypeScript'da mixin (`function Timestamped<T extends Constructor>(Base: T)`) haqida qaysi baho to'g'ri?"
    options:
      - "Bu kompozitsiyaning eng yaxshi shakli"
      - "Bu baribir meros: natija klass ierarxiyasi, ota klass bilan nomlar to'qnashuvi va white-box bog'lanish saqlanadi"
      - "Mixin'lar TypeScript'da ishlamaydi"
      - "Mixin LSP'ni avtomatik ta'minlaydi"
    answer: 1
    explain: "Mixin - klass ierarxiyasini dinamik qurish usuli. U ko'p merosning ba'zi muammolarini hal qiladi, lekin ichki holat va metodlar bitta obyektda aralashadi. Ba'zan foydali, lekin u kompozitsiya emas."
  - q: "Qaysi holatda meros o'rinli bo'lishi mumkin?"
    options:
      - "Framework talab qilsa (masalan, `extends Error`, `extends PaymentGateway` abstrakt token) yoki haqiqiy xatti-harakat subtipi bo'lib, ota klass kengaytirish uchun loyihalangan va hujjatlangan bo'lsa"
      - "Kodni qayta ishlatish kerak bo'lgan har qanday holatda"
      - "Hech qachon"
      - "Faqat klassda 3 tadan ko'p metod bo'lsa"
    answer: 0
    explain: "GoF \"afzal ko'ring\" deydi, \"taqiqlang\" demaydi. Custom xatolar uchun `Error`dan meros JS'da standart. Abstrakt bazaviy klass kengaytirish uchun ataylab loyihalangan bo'lsa (Template Method), meros ham to'g'ri bo'lishi mumkin. Faqat kod qayta ishlatish uchun meros - asosiy xato."
  - q: "Delegatsiya bilan kompozitsiyaning merosga nisbatan asosiy narxi nima?"
    options:
      - "Kompozitsiya runtime'da ishlamaydi"
      - "Kompozitsiya testlashni qiyinlashtiradi"
      - "Kompozitsiya LSP'ni buzadi"
      - "Ko'proq obyekt va ko'proq bilvosita chaqiriqlar: xatti-harakat bitta klassda emas, bir nechta obyekt o'rtasida taqsimlangan, shuning uchun tizimni statik o'qib tushunish qiyinroq bo'lishi mumkin"
    answer: 3
    explain: "GoF ham bu narxni tan oladi: kompozitsiyaga asoslangan dizayn ko'proq obyektlarga ega va uning xatti-harakati ular orasidagi munosabatlarga bog'liq. Bu haqiqiy trade-off."
task:
  title: "Bildirishnoma ierarxiyasini kompozitsiyaga o'tkazish"
  prompt: |
    Ijara platformasida bildirishnomalar meros ierarxiyasi bilan yozilgan. Endi yangi talablar keldi:

    - SMS uchun ham "tungi soatlarda yubormaslik" qoidasi kerak (hozir faqat push'da bor).
    - Ba'zi bildirishnomalar bir vaqtda ham SMS, ham push orqali yuborilishi kerak.
    - Har bir yuborish logga yozilishi kerak.

    Hozirgi ierarxiyada bu `QuietHoursSmsNotifier`, `LoggedQuietHoursPushNotifier` kabi klasslar kombinatsiyasini talab qiladi.

    1. O'zgarish o'qlarini aniqlang (kanal, yuborish siyosati, logging).
    2. Ierarxiyani kompozitsiya bilan almashtiring: kanallar va siyosatlar mustaqil birlashtirilsin.
    3. Klasslar o'rniga TypeScript'da idiomatik bo'lgan joyda funksiya va obyektlardan foydalaning.
  lang: ts
  starter: |
    type Message = { userId: string; text: string };

    abstract class Notifier {
      protected log: string[] = [];
      async notify(msg: Message): Promise<void> {
        if (!this.canSend(msg)) return;
        await this.send(msg);
        this.log.push(`${new Date().toISOString()} ${msg.userId}`);
      }
      protected canSend(_msg: Message): boolean { return true; }
      protected abstract send(msg: Message): Promise<void>;
    }

    class SmsNotifier extends Notifier {
      protected async send(msg: Message) { await smsGateway.send(msg.userId, msg.text); }
    }

    class PushNotifier extends Notifier {
      protected async send(msg: Message) { await pushGateway.push(msg.userId, msg.text); }
    }

    class QuietHoursPushNotifier extends PushNotifier {
      protected canSend(_msg: Message) {
        const h = new Date().getHours();
        return h >= 8 && h < 22;
      }
    }

    declare const smsGateway: { send(userId: string, text: string): Promise<void> };
    declare const pushGateway: { push(userId: string, text: string): Promise<void> };
  solution: |
    export type Message = { userId: string; text: string };

    /** Kanal: xabarni qanday yetkazish. */
    export type Channel = (msg: Message) => Promise<void>;

    /** Siyosat: hozir yuborish mumkinmi. */
    export type SendPolicy = (msg: Message, now: Date) => boolean;

    export const smsChannel = (gateway: { send(userId: string, text: string): Promise<void> }): Channel =>
      (msg) => gateway.send(msg.userId, msg.text);

    export const pushChannel = (gateway: { push(userId: string, text: string): Promise<void> }): Channel =>
      (msg) => gateway.push(msg.userId, msg.text);

    export const quietHours = (fromHour = 22, toHour = 8): SendPolicy =>
      (_msg, now) => {
        const h = now.getHours();
        return h >= toHour && h < fromHour;
      };

    export const allChannels = (...channels: Channel[]): Channel =>
      async (msg) => {
        await Promise.all(channels.map((send) => send(msg)));
      };

    export type NotifierDeps = {
      channel: Channel;
      policies?: SendPolicy[];
      onSent?: (msg: Message, at: Date) => void;
      clock?: () => Date;
    };

    export function createNotifier({ channel, policies = [], onSent, clock = () => new Date() }: NotifierDeps) {
      return async function notify(msg: Message): Promise<boolean> {
        const now = clock();
        if (!policies.every((allowed) => allowed(msg, now))) return false;
        await channel(msg);
        onSent?.(msg, now);
        return true;
      };
    }

    // Foydalanish: kombinatsiyalar klass yaratmasdan
    // const notifyRenter = createNotifier({
    //   channel: allChannels(smsChannel(smsGateway), pushChannel(pushGateway)),
    //   policies: [quietHours()],
    //   onSent: (msg, at) => logger.info({ userId: msg.userId, at }, "notification sent"),
    // });
  solutionNotes: |
    - Uchta mustaqil o'q (kanal, siyosat, logging) endi alohida qismlar. Ierarxiyada ular bitta daraxtga majburlangan edi va har bir kombinatsiya yangi klass talab qilardi.
    - Kanal va siyosat funksiya tiplari: holatsiz strategiyalar uchun TypeScript'da klass shart emas. `allChannels` - kompozit (Composite) ning funksional shakli.
    - `protected log` yo'qoldi: ota klassdagi o'zgaruvchan holat vorislar uchun white-box bog'lanish edi. Logging endi `onSent` callback orqali tashqaridan beriladi.
    - `new Date()` o'rniga `clock`: tungi soat qoidasini testlash mumkin.
    - `notify` endi `boolean` qaytaradi: yuborilmagan holat chaqiruvchiga ko'rinadi. Bu kichik shartnoma o'zgarishi, uni ongli qayd qiling.
    - Narx: endi xatti-harakat bir nechta kichik funksiya o'rtasida taqsimlangan. Buni `createNotifier`ning aniq tiplari va bitta kompozitsiya joyi (composition root) bilan kompensatsiya qildik.
  checklist:
    - "Kanal, siyosat va logging mustaqil birlashtiriladi"
    - "Yangi kombinatsiya uchun yangi klass kerak emas"
    - "Ota klassdagi protected holatga bog'liqlik qolmadi"
    - "Vaqtga bog'liq qoida testlanadigan (soat tashqaridan beriladi)"
    - "Holatsiz strategiyalar klass emas, funksiya sifatida yozilgan"
---

## Muammo

Loyiha boshida hammasi chiroyli ko'rinadi: `BaseRepository` umumiy CRUD metodlarini beradi, `VehicleRepository extends BaseRepository`, `DriverRepository extends BaseRepository`. Bir yildan keyin `BaseRepository` 600 qatorga yetadi: soft delete, audit log, multi-tenant filtr, kesh, pagination. Ba'zi vorislar soft delete'ni xohlamaydi va metodni override qilib `throw new Error("not supported")` yozadi (55-darsdagi LSP buzilishi). Kimdir `BaseRepository.findAll` ichidagi tenant filtrini optimallashtirdi va `DriverRepository` ning override qilingan `findActive` metodi jim boshqa tenant ma'lumotlarini qaytara boshladi.

Yoki React'ning eski kunlarini eslang: `class VehicleCard extends BaseCard extends BaseComponent`. Har bir darajada lifecycle metodlari override qilingan, `super.componentDidMount()` chaqirilishi unutilgan va bug faqat ma'lum ketma-ketlikda chiqadi.

Meros kodni qayta ishlatishning eng oson yo'li ko'rinadi. Lekin u eng kuchli bog'lanish: voris ota klassning nafaqat interfeysiga, balki ichki tuzilishiga ham bog'liq.

## Asosiy g'oya

Gamma, Helm, Johnson va Vlissides (Gang of Four) *Design Patterns* kitobining kirish bobida obyektga yo'naltirilgan dizaynning ikki tamoyilini beradi. Birinchisi: implementatsiyaga emas, interfeysga dasturlang. Ikkinchisi: "Favor object composition over class inheritance."

Ular qayta foydalanishning ikki usulini solishtiradi:

- **Klass merosi - white-box reuse.** Voris ota klassning ichki qismini ko'radi: protected maydonlar, metodlar o'rtasidagi chaqiruv tartibi, override qilinadigan "hook"lar. Bu bog'lanish kompilyatsiya vaqtida statik belgilanadi va runtime'da o'zgarmaydi.
- **Obyekt kompozitsiyasi - black-box reuse.** Obyekt boshqa obyektni o'z ichida saqlaydi va unga faqat interfeys orqali murojaat qiladi. Ichki tafsilotlar yashirin. Kompozitsiya runtime'da belgilanadi: bir xil turdagi boshqa obyektni berish mumkin.

GoF merosning afzalliklarini ham tan oladi: u to'g'ridan-to'g'ri, til tomonidan qo'llab-quvvatlanadi va qayta ishlatilgan implementatsiyani o'zgartirish oson. Lekin uning kamchiliklari jiddiy: ota klass vorisga o'z implementatsiyasini ochadi, shuning uchun ular aytganidek, merosni ko'pincha inkapsulyatsiyani buzadigan mexanizm deb hisoblashadi. Ota klass implementatsiyasidagi o'zgarish vorisni o'zgartirishga majbur qiladi.

Xulosa: yangi funksionallikni avval mavjud komponentlarni birlashtirish orqali olishga harakat qiling, yangi voris klass yaratish orqali emas.

## Chuqurroq: meros nimani bog'laydi

### Fragile base class

Merosning eng og'riqli muammosi - **mo'rt ota klass**. Ota klass muallifi ommaviy interfeysni o'zgartirmasdan ichki implementatsiyani o'zgartiradi va vorislar buziladi. Klassik misol:

```ts run
class TripLog {
  protected readonly trips: string[] = [];
  add(tripId: string): void {
    this.trips.push(tripId);
  }
  addAll(tripIds: string[]): void {
    for (const id of tripIds) this.add(id); // ichki qaror: addAll add'ni chaqiradi
  }
}

class CountingTripLog extends TripLog {
  count = 0;
  override add(tripId: string): void {
    this.count++;
    super.add(tripId);
  }
  override addAll(tripIds: string[]): void {
    this.count += tripIds.length; // ikki marta sanaydi, chunki super.addAll add'ni chaqiradi
    super.addAll(tripIds);
  }
}

// Sinab ko'ring: 3 ta qatnov qo'shiladi - count nechaga teng bo'ladi?
const log = new CountingTripLog();
log.add("trip-1");
log.addAll(["trip-2", "trip-3"]);
console.log("Kutilgan: 3, haqiqiy count:", log.count);
```

`CountingTripLog` muallifi ota klassning ichki qarorini (`addAll` `add`ni chaqiradi) bilishi kerak edi. Agar u buni bilib, `addAll` override'ni olib tashlasa, keyin ota klass muallifi `addAll`ni `this.trips.push(...tripIds)` bilan optimallashtirsa, hisoblagich yana noto'g'ri bo'ladi. Ommaviy interfeys o'zgarmadi, lekin voris buzildi. Bu white-box bog'lanishning bevosita natijasi va 51-darsdagi semantik coupling'ning eng toza namunasi.

Kompozitsiya bilan bu muammo yo'qoladi: `CountingTripLog` `TripLog`ni ichida saqlaydi va faqat uning ommaviy metodlarini chaqiradi. `TripLog`ning ichki qarorlari unga ta'sir qilmaydi.

### Bitta o'q bo'yicha klassifikatsiya

Meros dunyoni bitta daraxt bo'yicha klassifikatsiya qiladi. Haqiqiy domenlar esa ko'pincha bir nechta mustaqil o'qqa ega. Transport parkida: dvigatel turi (dizel, benzin, elektr, gibrid), kuzov turi (yengil, furgon, yuk), egalik (o'z, ijara, lizing). Merosda har bir kombinatsiya yangi klass yoki kod takrorlanishi. Kompozitsiyada har bir o'q alohida qism: `Vehicle { powertrain; body; ownership }`.

GoF'dagi bir nechta pattern aynan shu muammoni hal qiladi: Strategy (algoritmni almashtirish), Bridge (abstraksiya va implementatsiyani alohida o'zgartirish), Decorator (meros o'rniga obyektni o'rash orqali xatti-harakat qo'shish). Ularning umumiy g'oyasi - meros o'rniga delegatsiya.

### Delegatsiya va uning narxi

GoF delegatsiyani kompozitsiyani meros kabi kuchli qiladigan usul sifatida tasvirlaydi: obyekt so'rovni o'zi bajarmasdan, ichidagi obyektga uzatadi. Lekin ular narxni ham yashirmaydi: kompozitsiyaga asoslangan dizayn ko'proq obyektlarga ega, xatti-harakat ular orasidagi munosabatlarga tarqalgan va statik koddan tizimni tushunish qiyinroq bo'lishi mumkin. Haddan tashqari ko'p kichik obyektlar 52-darsdagi classitis va pass-through metodlarga olib kelishi mumkin.

### Merosdan chiqish refaktoringlari

Fowler katalogida bu o'tish uchun ikki refaktoring bor: **Replace Subclass with Delegate** (voris klasslar o'rniga delegat obyekt) va **Replace Superclass with Delegate** (ota klassdan meros o'rniga uni maydon sifatida saqlash). Ikkinchisi ota klassning hamma metodlari voris uchun ma'noli bo'lmaganda ayniqsa foydali, ya'ni voris aslida subtip emas.

## Misol: TypeScript'da idiomatik kompozitsiya

TypeScript klass merosini qo'llab-quvvatlaydi, lekin uning tip tizimi kompozitsiyani ancha arzonlashtiradi. Dan Vanderkam *Effective TypeScript*da ta'kidlaganidek, tiplar strukturaviy: obyekt kerakli shaklga ega bo'lsa, u mos keladi. Shuning uchun kompozitsiya uchun klass, `implements` va abstrakt bazaviy klass ko'pincha kerak emas.

Meros bilan:

```ts
abstract class BaseRepository<T extends { id: string }> {
  constructor(protected readonly table: string, protected readonly db: Db) {}
  findById(id: string): Promise<T | null> {
    return this.db.one<T>(`select * from ${this.table} where id = $1 and deleted_at is null`, [id]);
  }
  softDelete(id: string): Promise<void> {
    return this.db.exec(`update ${this.table} set deleted_at = now() where id = $1`, [id]);
  }
}

class GpsPointRepository extends BaseRepository<GpsPoint> {
  // GPS nuqtalari hech qachon soft delete qilinmaydi va deleted_at ustuni yo'q!
  override softDelete(): Promise<void> {
    throw new Error("not supported");
  }
}

type Db = { one<T>(sql: string, args: unknown[]): Promise<T | null>; exec(sql: string, args: unknown[]): Promise<void> };
type GpsPoint = { id: string; lat: number; lon: number };
```

`GpsPointRepository.findById` ham buzilgan: `deleted_at` ustuni yo'q, SQL xato beradi. Voris ota klassning hamma xatti-harakatini meros qilib oldi, keraksizini ham.

Kompozitsiya bilan:

```ts
type Db = { one<T>(sql: string, args: unknown[]): Promise<T | null>; exec(sql: string, args: unknown[]): Promise<void> };

// Kichik, mustaqil qismlar
const findById = <T>(db: Db, table: string, opts: { softDeleted: boolean }) =>
  (id: string): Promise<T | null> =>
    db.one<T>(
      `select * from ${table} where id = $1${opts.softDeleted ? " and deleted_at is null" : ""}`,
      [id],
    );

const softDelete = (db: Db, table: string) =>
  (id: string): Promise<void> => db.exec(`update ${table} set deleted_at = now() where id = $1`, [id]);

// Har bir repository faqat kerakli qismlarni yig'adi
type Vehicle = { id: string; plate: string };
type GpsPoint = { id: string; lat: number; lon: number };

export const createVehicleRepository = (db: Db) => ({
  findById: findById<Vehicle>(db, "vehicles", { softDeleted: true }),
  softDelete: softDelete(db, "vehicles"),
});

export const createGpsPointRepository = (db: Db) => ({
  findById: findById<GpsPoint>(db, "gps_points", { softDeleted: false }),
  // softDelete yo'q: tipda ham, runtime'da ham
});

export type VehicleRepository = ReturnType<typeof createVehicleRepository>;
```

Nima o'zgardi:

- **Keraksiz xatti-harakat meros qilinmaydi.** GPS repository'da `softDelete` umuman yo'q, chaqirishga urinish kompilyatsiya xatosi.
- **Har bir qism mustaqil o'zgaradi.** `softDelete`ga audit qo'shish `findById`ga ta'sir qilmaydi.
- **Protected holat yo'q.** Ota klassning `protected table` maydoni vorislar uchun ichki shartnoma edi. Endi qismlar parametr oladi.
- **Tip strukturadan chiqariladi.** `ReturnType<typeof ...>` bilan shartnoma alohida yozilmaydi.

Bu yerda funksional uslub tanladik. Xuddi shu g'oyani klass bilan ham yozish mumkin: `class VehicleRepository { constructor(private readonly finder: Finder<Vehicle>, ...) {} }`. Muhimi uslub emas, bog'lanish turi: interfeys orqali delegatsiya, ichki tuzilishga bog'lanish emas.

## Qachon qo'llamaslik kerak

GoF "afzal ko'ring" deydi, "hech qachon meros olmang" demaydi. Meros o'rinli bo'lgan holatlar:

- **Til yoki framework talabi.** JavaScript'da custom xatolar uchun `class OrderNotFoundError extends Error` standart (47-dars). NestJS'da abstrakt klass DI token sifatida (57-dars), `HttpException`dan meros, ORM entity'lari.
- **Haqiqiy subtip va kengaytirish uchun loyihalangan ota klass.** Agar ota klass ataylab kengaytirish nuqtalari bilan yozilgan va hujjatlangan bo'lsa (Template Method pattern), va voris LSP'ni bajarsa (55-dars), meros aniq va qisqa bo'lishi mumkin.
- **Sayoz va barqaror ierarxiya.** Bir daraja, ota klass kichik va kam o'zgaradi. Kompozitsiyaga o'tkazish faqat delegatsiya shovqini qo'shadi.
- **Haddan tashqari delegatsiya.** Agar kompozitsiya natijasida har bir metod shunchaki ichki obyektga uzatilsa (pass-through), bu ham sayozlik (52-dars). Bunday holda savol: bu ikki narsa umuman alohida bo'lishi kerakmi?
- **Mixin'lar haqida ehtiyot.** TypeScript mixin'lari ko'p merosning ba'zi qiyinchiliklarini yechadi, lekin ular baribir meros: holat va nomlar bitta obyektda aralashadi. Ular kompozitsiya o'rnini bosmaydi.

## Stack'da: React, NestJS va TypeScript

- **React allaqachon tanlov qilgan.** Zamonaviy React'da komponentlar orasida kodni qayta ishlatish klass merosi orqali emas, kompozitsiya (props, `children`, hook'lar) orqali qilinadi. Custom hook - xatti-harakatni kompozitsiya qilishning asosiy usuli: `useVehicleTracking` va `useFuelAlerts` bitta komponentda erkin birlashtiriladi.
- **NestJS'da konstruktor injection - kompozitsiya.** Servis boshqa servislarni o'z ichida saqlaydi va ularning ommaviy metodlarini chaqiradi. Umumiy xatti-harakat uchun `BaseService` yaratish o'rniga uni alohida provider qilib injekt qiling. Kesishuvchi xatti-harakatlar (logging, kesh, auth) uchun interceptor va guard'lar mavjud.
- **Strukturaviy tiplar.** Kompozitsiya qismlari `type` yoki interfeys bilan tasvirlanadi, `implements` majburiy emas. Fake va test double'lar obyekt literali bo'ladi.
- **Intersection tiplar.** `type Tracker = Reader & Partial<EngineControl>` - imkoniyatlarni tip darajasida kompozitsiya qilish (55-dars). Bu meros ierarxiyasi o'rnini bosadi.
- **Discriminated union.** Ko'p holatlarda meros ierarxiyasi (`Shape -> Circle, Square`) o'rniga union va funksiyalar (27-dars) TypeScript'da soddaroq va yangi holat qo'shilganda kompilyator yordam beradi.

## Xulosa

- GoF: klass merosidan ko'ra obyekt kompozitsiyasini afzal ko'ring. Meros white-box, kompozitsiya black-box reuse.
- Meros eng kuchli bog'lanish: voris ota klassning ichki qarorlariga bog'liq. Fragile base class muammosi shundan.
- Meros bitta o'q bo'yicha klassifikatsiya qiladi. Bir nechta mustaqil o'q bo'lsa, ularni kompozitsiya bilan ajrating.
- Kompozitsiyaning narxi bor: ko'proq obyekt va bilvosita chaqiriqlar. Haddan tashqari delegatsiya sayozlikka olib keladi.
- TypeScript'da strukturaviy tiplash va funksiyalar kompozitsiyani arzon qiladi. Holatsiz xatti-harakat uchun klass shart emas.
- Meros o'rinli joylar bor: `extends Error`, framework talablari, kengaytirish uchun loyihalangan sayoz ierarxiyalar.
