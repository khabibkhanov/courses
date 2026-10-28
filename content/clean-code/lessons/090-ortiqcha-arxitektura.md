---
n: 90
slug: ortiqcha-arxitektura
title: "Ortiqcha arxitektura xavfi"
summary: "Bu modulning barcha vositalari - qatlamlar, portlar, aggregate'lar, modul chegaralari - xarajat talab qiladi. Ularni foyda keltirmaydigan joyda qo'llash kodni toza emas, qimmat qiladi. Bu darsda ortiqcha arxitekturaning belgilarini, uning narxini va qatlamni qachon qo'shish va qachon olib tashlash kerakligini halol ko'rib chiqamiz."
duration: 35
sources:
  - id: fowler-yagni
    note: "\"Yagni\" (2015): build, delay, carry va repair xarajatlari; YAGNI kodni o'zgartirishga qulay qilish harakatiga taalluqli emasligi"
  - id: fowler-microservice-premium
    note: "\"MicroservicePremium\" (2015): murakkablik qo'shadigan arxitektura faqat tizim murakkabligi uni talab qilganda o'zini oqlaydi"
  - id: aposd
    note: "Sayoz modullar, pass-through metodlar, classitis va \"har bir qatlam boshqa abstraksiya bo'lsin\" haqidagi boblar"
quiz:
  - q: "Fowler'ning YAGNI maqolasidagi \"cost of carry\" nima?"
    options:
      - "Kelajak uchun qurilgan imkoniyat qo'shadigan murakkablik keyingi barcha ishlarni sekinlashtiradi; imkoniyat hech qachon ishlatilmasa ham bu narx to'lanadi"
      - "Serverlar narxi"
      - "Feature'ni noto'g'ri qurish va keyin tuzatish narxi"
      - "Hozir foydaliroq ishni kechiktirish natijasidagi yo'qotish"
    answer: 0
    explain: "Fowler to'rt narxni ajratadi: build (qurish), delay (foydali ishni kechiktirish), carry (qo'shimcha murakkablikni olib yurish) va repair (noto'g'ri taxminni tuzatish). Uchinchi va to'rtinchi variantlar mos ravishda repair va delay."
  - q: "`VehicleController -> VehicleFacade -> VehicleService -> VehicleManager -> VehicleRepository` zanjirida oraliq uchta klassning har bir metodi faqat keyingisini xuddi shu argumentlar bilan chaqiradi. Ousterhout bunga qanday baho beradi?"
    options:
      - "Yaxshi, chunki har bir qatlam bitta mas'uliyatga ega"
      - "Bu pass-through metodlar: ular hech qanday funksionallik qo'shmaydi, interfeysni ko'paytiradi va qatlamlar orasidagi mas'uliyat taqsimoti noaniq ekanini ko'rsatadi"
      - "Faqat performance muammosi"
      - "Normal, agar hamma qatlam test qilingan bo'lsa"
    answer: 1
    explain: "Ousterhout har bir qatlam o'zidan yuqori va pastdagidan farqli abstraksiya berishi kerak deydi. Bir xil imzoni uzatuvchi qatlam sayoz va murakkablikni oshiradi."
  - q: "Quyidagilardan qaysi biri YAGNI'ni buzish EMAS?"
    options:
      - "Hali birorta ham ikkinchi to'lov provayderi rejalashtirilmagan bo'lsa ham, `PaymentProviderFactory` va plugin tizimini qurish"
      - "\"Ehtimol keyin kerak bo'lar\" deb har bir jadval uchun event sourcing qo'shish"
      - "Bugungi feature ustida ishlayotganda chalkash funksiyani refaktoring qilib, uni o'zgartirishga qulay qilish"
      - "Bitta mijozli tizimda multi-tenant abstraksiyalarini oldindan qurish"
    answer: 2
    explain: "Fowler aniq aytadi: YAGNI kelajakdagi feature'lar uchun qurilgan imkoniyatlarga taalluqli, kodni o'zgartirishga osonroq qiladigan harakatga emas. Refaktoring YAGNI'ni mumkin qiladi."
  - q: "Uch dasturchili jamoa 2000 foydalanuvchili ichki CRM'ni 6 ta mikroservis, Kafka va har bir servisda Clean Architecture'ning to'rt qatlami bilan qurdi. Eng to'g'ri baho qaysi?"
    options:
      - "To'g'ri, bu kelajakda masshtablashni osonlashtiradi"
      - "Faqat Kafka ortiqcha"
      - "Muammo yo'q, agar CI ishlasa"
      - "Murakkablik tizim ehtiyojidan ancha oldinda: 'premium' to'lanmoqda, lekin uni oqlaydigan murakkablik yo'q; modulli monolit va kam qatlam bilan boshlash arzonroq va keyin ajratish mumkin"
    answer: 3
    explain: "Fowler'ning 'Microservice Premium' maqolasidagi asosiy fikr: qo'shimcha arxitektura narxi faqat tizim murakkabligi uni talab qilganda o'zini oqlaydi. Jamoa kattaligi va yuklama bu yerda uni talab qilmaydi."
  - q: "Qaysi holatda port/adapter chegarasini qo'shish o'zini oqlaydi?"
    options:
      - "Har bir tashqi kutubxona chaqiruvi uchun, chunki kutubxona ertaga o'zgarishi mumkin"
      - "Yadroda murakkab tarif hisoblash qoidalari bor, ular tez-tez o'zgaradi va bazasiz tez test qilinishi kerak, hamda hisobotlar uchun ikkinchi ma'lumot manbasi allaqachon rejalashtirilgan"
      - "Arxitektura diagrammasi chiroyli ko'rinishi uchun"
      - "Loyiha boshida, domen hali noaniq bo'lganda, hamma joyda"
    answer: 1
    explain: "Chegara aniq foyda keltirganda o'zini oqlaydi: himoya qilinadigan murakkab policy, tez test zarurati va real (taxminiy emas) ikkinchi adapter. Qolgan variantlar spekulyativ umumiylik."
  - q: "Ousterhout'ning \"classitis\" tanqidi nimaga qaratilgan?"
    options:
      - "Klasslar emas, funksiyalar ishlatish kerakligiga"
      - "Har bir klass 100 qatordan oshmasligiga"
      - "Klasslarni kichik qilish o'z-o'zidan yaxshi degan qarashga: ko'p sayoz klasslar har biri oddiy bo'lsa ham, umumiy interfeys yuzasini va tizim murakkabligini oshiradi"
      - "OOP'ni butunlay rad etishga"
    answer: 2
    explain: "Ousterhout klasslar sonini ko'paytirish chuqurlikni kamaytirishini va o'quvchi bitta g'oyani tushunish uchun ko'p joyni ochishga majbur bo'lishini ta'kidlaydi (52-dars)."
task:
  title: "Ortiqcha qatlamlarni olib tashlash"
  prompt: |
    Quyidagi kod kichik ichki xizmatning bitta funksiyasi: haydovchiga eslatma (izoh) qo'shish. Biznes qoidasi bitta: izoh bo'sh bo'lmasin va 500 belgidan oshmasin. Lekin kod oltita klass va uchta interfeysga bo'lingan, ularning ko'pchiligi faqat chaqiruvni uzatadi.

    1. Har bir qatlam qanday abstraksiya berishini yozing. Qaysilari faqat uzatadi?
    2. Xatti-harakatni o'zgartirmasdan kodni minimal kerakli tuzilishga keltiring.
    3. Qaysi chegarani saqlab qolganingizni va nima uchun ekanini izohlang.
    4. Qaysi signal paydo bo'lsa, qatlamni qayta qo'shishni yozing.
  lang: ts
  starter: |
    export interface IDriverNoteInputPort { execute(req: AddDriverNoteRequest): Promise<AddDriverNoteResponse>; }
    export interface IDriverNoteOutputPort { present(res: AddDriverNoteResponse): AddDriverNoteViewModel; }
    export interface IDriverNoteGateway { insert(note: DriverNoteEntity): Promise<void>; }

    export class AddDriverNoteRequest { constructor(readonly driverId: string, readonly text: string) {} }
    export class AddDriverNoteResponse { constructor(readonly id: string, readonly createdAt: Date) {} }
    export class AddDriverNoteViewModel { constructor(readonly id: string, readonly createdAt: string) {} }
    export class DriverNoteEntity { constructor(readonly id: string, readonly driverId: string, readonly text: string, readonly createdAt: Date) {} }

    export class DriverNoteFactory {
      create(req: AddDriverNoteRequest): DriverNoteEntity {
        return new DriverNoteEntity(crypto.randomUUID(), req.driverId, req.text, new Date());
      }
    }

    export class DriverNoteValidator {
      validate(req: AddDriverNoteRequest): void {
        if (req.text.trim().length === 0 || req.text.length > 500) throw new Error("invalid note");
      }
    }

    export class AddDriverNoteInteractor implements IDriverNoteInputPort {
      constructor(
        private readonly validator: DriverNoteValidator,
        private readonly factory: DriverNoteFactory,
        private readonly gateway: IDriverNoteGateway,
      ) {}
      async execute(req: AddDriverNoteRequest): Promise<AddDriverNoteResponse> {
        this.validator.validate(req);
        const entity = this.factory.create(req);
        await this.gateway.insert(entity);
        return new AddDriverNoteResponse(entity.id, entity.createdAt);
      }
    }

    export class AddDriverNotePresenter implements IDriverNoteOutputPort {
      present(res: AddDriverNoteResponse): AddDriverNoteViewModel {
        return new AddDriverNoteViewModel(res.id, res.createdAt.toISOString());
      }
    }
  solution: |
    import { randomUUID } from "node:crypto";

    export const MAX_NOTE_LENGTH = 500;

    export type DriverNote = {
      id: string;
      driverId: string;
      text: string;
      createdAt: Date;
    };

    export type AddNoteResult =
      | { ok: true; id: string; createdAt: string }
      | { ok: false; reason: "empty" | "too_long" };

    // Yagona saqlab qolingan chegara: saqlash. Testda massivga yoziladigan fake bilan almashtiriladi.
    export interface DriverNotes {
      insert(note: DriverNote): Promise<void>;
    }

    export function validateNoteText(text: string): "empty" | "too_long" | null {
      if (text.trim().length === 0) return "empty";
      if (text.length > MAX_NOTE_LENGTH) return "too_long";
      return null;
    }

    export async function addDriverNote(
      notes: DriverNotes,
      driverId: string,
      text: string,
      now: Date = new Date(),
    ): Promise<AddNoteResult> {
      const invalid = validateNoteText(text);
      if (invalid) return { ok: false, reason: invalid };
      const note: DriverNote = { id: randomUUID(), driverId, text, createdAt: now };
      await notes.insert(note);
      return { ok: true, id: note.id, createdAt: note.createdAt.toISOString() };
    }
  solutionNotes: |
    - Starter'dagi qatlamlar tahlili: `InputPort` faqat bitta implementatsiyaga ega va hech kim unga boshqa implementatsiya bermaydi; `Request`, `Response`, `ViewModel` klasslari bir xil maydonlarni takrorlaydi; `Factory` bir qatorlik `new`; `Presenter` bitta `toISOString()`. Bular pass-through yoki sayoz qatlamlar.
    - Saqlab qolingan yagona abstraksiya - `DriverNotes` saqlash porti. U real foyda beradi: bazasiz test va saqlash texnologiyasini yadrodan ajratish. Lekin bu ham ongli tanlov: agar loyiha testlarni real Postgres bilan yuritsa, uni ham olib tashlash mumkin edi.
    - Validatsiya alohida sof funksiya, chunki u yagona biznes qoidasi va uni alohida test qilish arzon. `MAX_NOTE_LENGTH` nomlangan.
    - Exception o'rniga natija qaytaradi: `empty` va `too_long` farqlanadi (starter'da ikkalasi ham "invalid note" edi, bu ham o'zgarish emas, aniqlik).
    - `now` parametri default bilan: testda vaqtni boshqarish uchun alohida `Clock` interfeysi shart emas.
    - Oltita klass va uchta interfeys o'rniga ikki funksiya, ikki tip va bitta interfeys. Xatti-harakat (validatsiya qoidasi, saqlash, ISO sana qaytarish) o'zgarmadi.
    - Qatlamni qaytarish signallari: izoh qo'shishning ikkinchi kirish yo'li (masalan, Telegram bot) paydo bo'lsa va formatlash farq qilsa - presenter; qoidalar ko'paysa (moderatsiya, haydovchi holati) - alohida domen obyekti; bir nechta saqlash joyi bo'lsa - portni kengaytirish.
  checklist:
    - "Har bir qatlam qanday abstraksiya berishi yozilgan"
    - "Pass-through klasslar olib tashlangan"
    - "Biznes qoidasi bitta joyda va alohida test qilinadi"
    - "Saqlab qolingan chegara uchun aniq sabab yozilgan"
    - "Xatti-harakat o'zgarmagan"
    - "Qatlamni qayta qo'shish signallari yozilgan"
---

## Muammo

Bu modulda biz ko'p kuchli vositalarni ko'rdik: Clean Architecture doiralari (81-dars), port va adapterlar (82-dars), modul chegaralari (83-dars), aggregate'lar (84-dars), komponent tamoyillari (85-dars). Ularning har biri ma'lum bir og'riqni hal qiladi. Lekin har birining narxi ham bor, va bu narx og'riq bo'lmagan joyda ham to'lanadi.

Real loyihalarda ko'p uchraydigan manzara: uch kishilik jamoa ichki hisobot tizimini quradi. "Toza arxitektura" degan maqsad bilan har bir endpoint uchun Controller, InputPort, Interactor, OutputPort, Presenter, ViewModel, Gateway, Mapper va Entity yaratiladi. Bitta maydon qo'shish 9 ta faylni o'zgartirishni talab qiladi. Yangi dasturchi oddiy savolga - "bu endpoint bazadan nimani o'qiydi?" - javob topish uchun 7 ta faylni ochadi. Har bir qatlamning testlari mock'lar bilan to'la va ular xatti-harakatni emas, chaqiruvlar zanjirini tekshiradi. Jamoa sekin ishlaydi va "arxitektura" buning sababi ekanini tan olishga qiynaladi, chunki u "to'g'ri" qilingan.

Bu dars - modulning muvozanatlovchi qismi. Maqsad arxitekturani rad etish emas, uni **o'z narxiga** qarab tanlashni o'rganish.

## Asosiy g'oya

Uchta manba bitta fikrga turli tomondan keladi.

**Fowler, YAGNI.** "You Aren't Gonna Need It" - Extreme Programming'ning Simple Design amaliyotiga bog'liq tamoyil. Fowler'ning 2015 yilgi maqolasi kelajak uchun qurilgan imkoniyatning to'rtta narxini ajratadi:

- **Cost of build** - hech qachon kerak bo'lmasligi mumkin bo'lgan narsaga sarflangan kuch.
- **Cost of delay** - hozir foydaliroq ishni qilmaslik natijasidagi yo'qotish.
- **Cost of carry** - qo'shilgan murakkablik keyingi barcha ishlarni sekinlashtiradi. Bu narx imkoniyat hech qachon ishlatilmasa ham to'lanadi.
- **Cost of repair** - taxmin noto'g'ri chiqqanda, uni tuzatish yoki aylanib o'tish narxi.

Arxitektura qatlamlari aynan shu toifaga kiradi: "ertaga bazani almashtiramiz", "ertaga mikroservislarga bo'linamiz", "ertaga ikkinchi UI qo'shiladi". Bugun esa har bir o'zgarish har bir qatlam orqali o'tadi.

Muhim nozik nuqta: Fowler YAGNI kodni o'zgartirishga qulayroq qiladigan harakatga **taalluqli emasligini** aniq aytadi. Refaktoring, testlar va continuous delivery YAGNI'ni mumkin qiladi, chunki ular kerak bo'lganda arzon o'zgartirish imkonini beradi. Ya'ni YAGNI "sifatsiz kod yoz" degani emas, "spekulyativ imkoniyat qurma" degani.

**Fowler, Microservice Premium.** Mikroservislar haqidagi maqolaning g'oyasi umumiyroq: murakkablik qo'shadigan arxitektura faqat tizimning o'z murakkabligi uni talab qilganda o'zini oqlaydi. Oddiy tizimda u qo'shimcha "premium", ya'ni narx va xatar.

**Ousterhout, A Philosophy of Software Design.** Ousterhout'ning tanqidi kod darajasida. U har bir qatlam o'zidan yuqori va pastdagi qatlamdan **farqli abstraksiya** berishi kerak deydi. Agar qo'shni qatlamlar bir xil abstraksiyani bersa, bu muammo belgisi. Uning eng aniq belgisi - **pass-through metod**: hech narsa qilmasdan, argumentlarni xuddi shu imzo bilan keyingi qatlamga uzatadigan metod. Bunday metodlar funksionallik qo'shmaydi, lekin interfeysni kattalashtiradi va o'quvchini yana bitta faylga yuboradi. Ousterhout yana "classitis" deb ataydigan holatni tanqid qiladi: klasslar kichik bo'lsa yaxshi degan qarash ko'p sayoz klasslarga va yuqori umumiy murakkablikka olib keladi (52, 59-darslar).

Uchalasini birlashtirsak: **arxitektura chegarasi - bu investitsiya. U himoya qiladigan narsa (murakkab policy, real o'zgarish o'qi, real ikkinchi implementatsiya) mavjud bo'lganda foyda beradi, aks holda faqat carry narxi qoladi.**

## Chuqurroq: ortiqcha arxitekturaning belgilari va narxi

### Belgilar

- **Faqat bitta implementatsiyali interfeyslar,** va ikkinchisi na testda, na rejada bor. `IUserService` va `UserServiceImpl` juftligi buning klassik ko'rinishi.
- **Pass-through zanjirlar.** Controller -> Facade -> Service -> Manager -> Repository, oraliq qatlamlar faqat uzatadi.
- **Bir xil shakldagi ko'p DTO'lar.** `CreateUserRequest`, `CreateUserCommand`, `CreateUserInput`, `UserCreationDto` - bitta maydonlar to'plami to'rt marta, orasida mapper'lar.
- **"Shotgun surgery" yangi maydon uchun.** Bitta ustun qo'shish 6-10 faylni o'zgartirishni talab qiladi (73-dars).
- **Mock'larga to'la testlar.** Testlar xatti-harakatni emas, "A B'ni chaqirdi" degan faktni tekshiradi va har bir refaktoringda sinadi (66-dars).
- **Jamoa hajmiga mos kelmaydigan deploy tuzilmasi.** Uch dasturchi va o'nta servis.
- **Arxitektura atamalari domen atamalaridan ko'p.** Papka strukturasida `interactors`, `presenters`, `gateways` ko'rinadi, `trips`, `fuel`, `billing` esa yo'q. Martin'ning o'zi "Screaming Architecture" g'oyasida arxitektura framework'ni emas, domenni "baqirishi" kerak deydi.

### Narxi qayerda to'lanadi

- **O'qish.** Bitta xatti-harakatni tushunish uchun ochiladigan fayllar soni. Bu Ousterhout'ning kognitiv yuk tushunchasi (2-dars).
- **O'zgartirish.** Har bir qatlam o'zgarishi kerak bo'lgan qo'shimcha joy.
- **Noto'g'ri chegara.** Eng qimmat holat: chegara erta va noto'g'ri joyda chizilgan. Endi har bir feature chegarani kesib o'tadi va uni ko'chirish qatlamlar soniga ko'paytirilgan ish. Bu Fowler'ning cost of repair'i, va Sandi Metz'ning "noto'g'ri abstraksiya takrordan qimmat" degan fikriga yaqin (8-dars).
- **Onboarding.** Yangi odam avval arxitekturani, keyin domenni o'rganadi.

### Ikkinchi tomon: kam arxitekturaning narxi

Halollik uchun: teskari xato ham bor va u ham qimmat. Hech qanday chegarasiz monolitda biznes qoidalari controller'lar, ORM hook'lari va SQL so'rovlari bo'ylab tarqaladi, har qanday modul har qanday jadvalni o'zgartiradi, testlar faqat to'liq muhitda yuradi. Fowler'ning o'zi monolit ichidagi modul chegaralari amalda ko'pincha buzilib ketishini tan oladi. Martin tarafdorlari aynan shu holatni ko'rsatib, "chegarani keyin qo'shish juda qimmat" deydi.

Bu bahsda ikkala tomonda ham haqiqat bor, va javob kontekstga bog'liq. Amaliy murosaga quyidagi g'oyalar yordam beradi:

- **Yo'nalish qatlamlardan muhimroq.** Domen kodi framework'ni import qilmasligi (81-dars) deyarli bepul va har doim foydali. To'rtta alohida qatlam esa qimmat va ko'pincha keraksiz.
- **Arzon chegaralar, keyin qimmatlari.** Papka va modul chegarasi, `index.ts` orqali public API, dependency-cruiser qoidasi - bular arzon va keyin qimmatroq chegaraga o'tishni osonlashtiradi. Port va adapterlar keyingi bosqich, alohida deploy esa oxirgisi.
- **Chegarani og'riqqa javoban qo'shing.** Ikkinchi adapter real paydo bo'lganda, use case ikkinchi kirish yo'lidan chaqirilganda, testlar sekinlashganda. Bu Martin'ning o'zi komponent tuzilmasi haqida aytgan fikriga ham mos: u tizim bilan birga rivojlanadi va oldindan loyihalanmaydi (85-dars).
- **Chegarani olib tashlash ham refaktoring.** Inline Class, Inline Function, Remove Middle Man (75-dars) - ular ham to'liq huquqli refaktoringlar.

## Misol: bitta qoida, besh qatlam

Yomon variant (qisqartirilgan):

```ts
export interface IFuelPriceService {
  getPrice(stationId: string): Promise<number>;
}

export class FuelPriceServiceImpl implements IFuelPriceService {
  constructor(private readonly manager: FuelPriceManager) {}
  getPrice(stationId: string): Promise<number> {
    return this.manager.getPrice(stationId);
  }
}

export class FuelPriceManager {
  constructor(private readonly repo: IFuelPriceRepository) {}
  getPrice(stationId: string): Promise<number> {
    return this.repo.getPrice(stationId);
  }
}

export interface IFuelPriceRepository {
  getPrice(stationId: string): Promise<number>;
}
```

Uchta qatlam bitta imzoni (`getPrice(stationId): Promise<number>`) uzatadi. Ousterhout'ning testi: qatlamlarning har biri qanday yangi abstraksiya beradi? Hech qanday. Biznes qoidasi (masalan, "narx 24 soatdan eski bo'lsa, ishlatma") qaysi qatlamga yozilishi ham noaniq, shuning uchun u ertaga tasodifiy joyga tushadi.

Yaxshi variant:

```ts
export type FuelPrice = { stationId: string; pricePerLiterUzs: number; observedAt: Date };

export interface FuelPrices {
  latest(stationId: string): Promise<FuelPrice | null>;
}

const MAX_PRICE_AGE_MS = 24 * 60 * 60 * 1000;

export async function currentFuelPrice(
  prices: FuelPrices,
  stationId: string,
  now: Date,
): Promise<number | null> {
  const price = await prices.latest(stationId);
  if (!price) return null;
  if (now.getTime() - price.observedAt.getTime() > MAX_PRICE_AGE_MS) return null;
  return price.pricePerLiterUzs;
}
```

Nima o'zgardi:

- **Uzatuvchi qatlamlar yo'q.** Bitta funksiya va bitta port. Har biri farqli abstraksiya beradi: port "narxni qayerdan olish", funksiya "qaysi narx yaroqli".
- **Qoidaning uyi aniq.** "24 soatdan eski narx ishlatilmaydi" qoidasi `currentFuelPrice` ichida.
- **Port o'zini oqlaydi.** Narxlar ikki manbadan (stansiyalar API'si va qo'lda kiritish) kelishi rejada bor va funksiya bazasiz test qilinadi. Agar bunday sabab bo'lmasa, funksiya repository'ni to'g'ridan-to'g'ri chaqirishi ham mumkin edi.

## Qachon qo'llamaslik kerak

Bu darsning mavzusi o'zi "qo'llamaslik" haqida, shuning uchun bu yerda teskari savol: **qachon "soddalashtirish" xato bo'ladi?**

- **Murakkab va tez o'zgaradigan domen.** Tarif hisoblash, haydovchi reytingi, yoqilg'i o'g'irligini aniqlash kabi qoidalar ko'p va tez-tez o'zgaradigan joyda ularni framework va bazadan ajratish o'zini tez oqlaydi. "YAGNI" bu yerda bahona bo'lmasin.
- **Bir nechta jamoa bitta kod bazasida.** Jamoa chegaralari kodda modul chegaralari sifatida aks etmasa, jamoalar bir-birining ishini doimiy buzadi. Bu holda modul chegarasi texnik emas, tashkiliy zarurat.
- **Allaqachon real ikkinchi implementatsiya bor.** Ikkita to'lov provayderi ishlatilayotgan bo'lsa, port "spekulyativ" emas.
- **Xavfsizlik va moliya chegaralari.** To'lov, autentifikatsiya va shaxsiy ma'lumotlar bilan ishlaydigan kod aniq chegara ortida bo'lishi audit va xatolarni cheklash uchun foydali, hatto kichik tizimda ham.
- **Qatlamni olib tashlash xatti-harakatni o'zgartirsa.** Soddalashtirish ham refaktoring: avval testlar bilan xatti-harakatni qayd qiling (79-dars), keyin qatlamlarni birlashtiring.

## Stack'da: NestJS va Next.js

- **NestJS'ning o'zi allaqachon qatlam beradi.** Controller, provider va modul - bu ko'pchilik CRUD xizmatlar uchun yetarli tuzilma. Har bir servis uchun `IXService` interfeysi va `XServiceImpl` klassini yaratish NestJS'da odatda keraksiz: DI konteyner klassning o'zini token sifatida ishlatadi, testda esa `overrideProvider` bilan almashtiriladi.
- **Use case klassini faqat qoida bo'lganda.** Agar servis metodi "DTO'ni ol, Prisma'ga yoz, qaytar" bo'lsa, unga alohida use case, port va mapper kerak emas. Qoida paydo bo'lganda ajrating.
- **Next.js'da backend qatlamlari.** Server Component'dan to'g'ridan-to'g'ri so'rov qiladigan kichik ilovada "service layer" va "repository layer" ko'pincha faqat uzatadi. Ma'lumot olishni `lib/data/` dagi bir nechta funksiyaga yig'ish va ularni server-only qilish (93-dars) ko'p hollarda yetarli chegara.
- **ADR bilan qaror qiling.** Qatlam qo'shish yoki olib tashlash qarorini qisqa ADR'da (39-dars) yozing: qanday og'riq, qanday variantlar, nima uchun shu. Bir yildan keyin "nega bu yerda port bor?" degan savolga javob bo'ladi va kerak bo'lmay qolganda uni olib tashlash oson.
- **Arzon himoya, qimmat emas.** dependency-cruiser'ning "domen papkasi framework import qilmasin" qoidasi bitta qator va qatlamlar sonini oshirmaydi, lekin eng muhim yo'nalishni saqlaydi.

## Xulosa

- Har bir arxitektura chegarasi investitsiya: u himoya qiladigan narsa bo'lmasa, faqat carry narxi qoladi.
- YAGNI spekulyativ imkoniyatlarga qarshi, kod sifatiga qarshi emas. Refaktoring va testlar uni mumkin qiladi.
- Har bir qatlam farqli abstraksiya bersin. Pass-through metodlar va bitta implementatsiyali interfeyslar - ortiqcha arxitekturaning belgisi.
- Kam arxitektura ham qimmat. Murosa: bog'liqlik yo'nalishini doim saqlang, arzon chegaralardan boshlang, qimmatlarini og'riqqa javoban qo'shing.
- Chegarani olib tashlash ham to'liq huquqli refaktoring. Qarorlarni ADR bilan yozing.
