---
n: 80
slug: katta-refaktoring
title: "Katta refaktoring: strangler fig, branch by abstraction"
summary: "Oylab davom etadigan o'zgarishlarni tizimni to'xtatmasdan qilishning uchta naqshi: Strangler Fig Application (eski tizimni yangisi bilan asta-sekin almashtirish), Branch by Abstraction (kod ichida abstraksiya orqali almashtirish) va Parallel Change (expand, migrate, contract). Prisma migratsiyalari va NestJS misollari bilan."
duration: 45
sources:
  - id: fowler-strangler
    note: "Strangler Fig metaforasining kelib chiqishi, nomning o'zgartirilishi, transitional architecture, seam'lar, \"qayta yozish\" xavflari va tashkiliy o'zgarish zarurati"
  - id: fowler-branch-by-abstraction
    note: "Qadamlar (abstraksiya qatlami, mijozlarni ko'chirish, yangi supplier, eskisini o'chirish), Paul Hammant va Stacy Curl haqida eslatma, feature flag bilan solishtirish"
  - id: fowler-parallel-change
    note: "Expand, migrate, contract bosqichlari; database refactoring misoli; contract bosqichini o'tkazib yuborish xavfi; Branch by Abstraction bilan munosabati"
quiz:
  - q: "Jamoa eski PHP monolitni yangi NestJS servisi bilan almashtirmoqchi. Qaysi yondashuv Fowler maqolasidagi Strangler Fig g'oyasiga mos?"
    options:
      - "Yangi tizimni 12 oy yonida qurib, bir kunda to'liq o'tish"
      - "Monolitni avval to'liq refaktoring qilib, keyin ko'chirish"
      - "Yangi tizimni eski tizim atrofida bosqichma-bosqich qurish: avval kichik qismlar, ko'pincha yangi funksiyalar, va har bir qism tayyor bo'lganda trafikni unga yo'naltirish"
      - "Ikkala tizimni doim parallel ishlatish"
    answer: 2
    explain: "Strangler Fig - asta-sekin almashtirish: kichik qismlardan boshlash, biznesga erta qiymat berish va eski tizim haqida o'rganish. Birinchi variant Fowler ogohlantiradigan \"to'liq qayta yozish\". To'rtinchi variantda transitional architecture hech qachon olib tashlanmaydi."
  - q: "Branch by Abstraction'da birinchi qadam nima?"
    options:
      - "Mijoz kodining bir qismi va almashtiriladigan supplier orasida abstraksiya qatlami yaratish va o'sha mijozlarni unga ulash"
      - "Yangi supplier'ni yozish"
      - "Feature branch ochish"
      - "Eski supplier'ni o'chirish"
    answer: 0
    explain: "Avval abstraksiya, keyin barcha mijozlarni unga ko'chirish, keyin yangi implementatsiya va o'tish, oxirida eskisini (va ehtimol abstraksiyaning o'zini) o'chirish. Bu jarayonda tizim doim yig'iladi va ishlaydi."
  - q: "Parallel Change'ning uchta bosqichi qaysi tartibda?"
    options:
      - "Migrate, expand, contract"
      - "Contract, expand, migrate"
      - "Extract, inline, delete"
      - "Expand, migrate, contract"
    answer: 3
    explain: "Expand - yangi versiyani eskisi bilan yonma-yon qo'shish. Migrate - mijozlarni yangisiga o'tkazish. Contract - eskisini olib tashlash."
  - q: "`users.full_name` ustunini `first_name` va `last_name` ga bo'lish kerak. Ilova bir nechta instansiyada rolling deploy bilan ishlaydi. Qaysi reja xavfsiz?"
    options:
      - "Bitta migratsiyada `full_name` ni o'chirib, yangi ustunlarni qo'shish va kodni bir vaqtda deploy qilish"
      - "Yangi ustunlarni qo'shish, kodni ikkala joyga yozadigan qilish, eski qatorlarni backfill qilish, o'qishni yangi ustunlarga o'tkazish, keyin alohida release'da `full_name` ni o'chirish"
      - "Ustunni `name` ga qayta nomlash"
      - "`full_name` ni saqlab, frontend'da bo'lish"
    answer: 1
    explain: "Bu expand/contract. Rolling deploy paytida eski va yangi kod bir vaqtda ishlaydi, shuning uchun sxema ikkalasini ham qo'llab-quvvatlashi kerak. Birinchi variant deploy paytida eski instansiyalarni buzadi."
  - q: "Fowler Parallel Change maqolasida qaysi xavfni alohida ta'kidlaydi?"
    options:
      - "Expand bosqichi juda tez bo'lishi"
      - "Migratsiya hech qachon kerak emasligi"
      - "Contract bosqichi o'tkazib yuborilsa, kod bazasi avvalgidan ham yomon holatda qoladi: endi ikki versiya bor"
      - "Feature flag ishlatib bo'lmasligi"
    answer: 2
    explain: "Parallel change intizom talab qiladi. Migratsiya oxiriga yetkazilmasa, eski va yangi interfeys abadiy yonma-yon yashaydi. Deprecation belgilari, hujjat va TODO'lar qaysi versiya almashtirilayotganini ko'rsatishga yordam beradi."
  - q: "Branch by Abstraction va feature branch'ning asosiy farqi nimada?"
    options:
      - "Branch by Abstraction'da o'zgarish asosiy branch (trunk) ichida, abstraksiya ortida bosqichma-bosqich qilinadi va tizim istalgan payt release qilinishi mumkin; feature branch'da o'zgarish alohida branch'da to'planadi va oxirida katta merge bo'ladi"
      - "Branch by Abstraction faqat git'da ishlaydi"
      - "Feature branch'da testlar bo'lmaydi"
      - "Farq yo'q, bu bir xil narsa"
    answer: 0
    explain: "Nomni Paul Hammant trunk-based development'ni targ'ib qilish kontekstida bergan. G'oya: \"branch\" version control'da emas, kod ichida, abstraksiya ortida. Shu tufayli continuous delivery uzilmaydi."
task:
  title: "Expand/contract bilan narx maydonini ko'chirish"
  prompt: |
    Ijara platformasida `Listing.price` - `Float` (so'mda). Bu yaxlitlash xatolarini keltirib chiqaryapti. Maqsad: narxni `priceTiyin BigInt` va `currency` ga ko'chirish. Ilova bir nechta instansiyada ishlaydi va downtime mumkin emas.

    1. Expand, migrate, contract bosqichlari bo'yicha reja tuzing: har bir bosqichda Prisma sxemasi, SQL migratsiya va ilova kodi qanday bo'ladi.
    2. Migrate bosqichidagi `ListingsService` ni yozing: u ikkala ustunga yozadi va yangi ustundan o'qiydi (yangi ustun bo'sh bo'lsa, eskisidan).
    3. Har bir bosqichdan keyin release qilish xavfsiz ekanini va qanday orqaga qaytish mumkinligini tushuntiring.
  lang: ts
  starter: |
    // schema.prisma (hozirgi holat)
    // model Listing {
    //   id    String @id
    //   title String
    //   price Float
    // }

    import { Injectable } from "@nestjs/common";

    type ListingRecord = { id: string; title: string; price: number };

    interface ListingStore {
      findById(id: string): Promise<ListingRecord | null>;
      update(id: string, data: Partial<ListingRecord>): Promise<void>;
    }

    @Injectable()
    export class ListingsService {
      constructor(private readonly store: ListingStore) {}

      async getPrice(id: string): Promise<number | null> {
        const listing = await this.store.findById(id);
        return listing ? listing.price : null;
      }

      async setPrice(id: string, priceSom: number): Promise<void> {
        await this.store.update(id, { price: priceSom });
      }
    }
  solution: |
    // ===== 1. EXPAND (release 1) =====
    // schema.prisma:
    //   price      Float                 // eski, hali ishlatiladi
    //   priceTiyin BigInt?               // yangi, nullable
    //   currency   String? @default("UZS")
    // SQL (prisma migrate):
    //   ALTER TABLE "Listing" ADD COLUMN "priceTiyin" BIGINT;
    //   ALTER TABLE "Listing" ADD COLUMN "currency" TEXT DEFAULT 'UZS';
    // Kod: o'zgarmaydi. Orqaga qaytish: ustunlarni o'chirish, ma'lumot yo'qolmaydi.

    // ===== 2. MIGRATE (release 2, 3) =====
    import { Injectable } from "@nestjs/common";

    type Currency = "UZS" | "USD";

    type ListingRecord = {
      id: string;
      title: string;
      price: number;
      priceTiyin: bigint | null;
      currency: Currency | null;
    };

    interface ListingStore {
      findById(id: string): Promise<ListingRecord | null>;
      update(id: string, data: Partial<ListingRecord>): Promise<void>;
    }

    export type Money = { tiyin: bigint; currency: Currency };

    const TIYIN_PER_SOM = 100;

    function somToTiyin(som: number): bigint {
      return BigInt(Math.round(som * TIYIN_PER_SOM));
    }

    @Injectable()
    export class ListingsService {
      constructor(private readonly store: ListingStore) {}

      // O'qish: yangi ustun ustuvor, backfill tugaguncha eskisiga qaytish
      async getPrice(id: string): Promise<Money | null> {
        const listing = await this.store.findById(id);
        if (!listing) return null;
        if (listing.priceTiyin !== null) {
          return { tiyin: listing.priceTiyin, currency: listing.currency ?? "UZS" };
        }
        return { tiyin: somToTiyin(listing.price), currency: "UZS" };
      }

      // Yozish: ikkala ustunga (dual write)
      async setPrice(id: string, price: Money): Promise<void> {
        await this.store.update(id, {
          priceTiyin: price.tiyin,
          currency: price.currency,
          price: Number(price.tiyin) / TIYIN_PER_SOM, // eski instansiyalar uchun
        });
      }
    }

    // Backfill (alohida job, partiyalarda):
    //   UPDATE "Listing" SET "priceTiyin" = ROUND(price * 100), currency = 'UZS'
    //   WHERE "priceTiyin" IS NULL AND id IN (SELECT id FROM "Listing" WHERE "priceTiyin" IS NULL LIMIT 5000);
    // Tekshiruv: SELECT count(*) FROM "Listing" WHERE "priceTiyin" IS NULL;  -- 0 bo'lishi kerak

    // ===== 3. CONTRACT (release 4, 5) =====
    // release 4: kod `price` ni o'qishni va yozishni to'xtatadi; fallback olib tashlanadi.
    // release 5: ALTER TABLE "Listing" ALTER COLUMN "priceTiyin" SET NOT NULL;
    //            ALTER TABLE "Listing" DROP COLUMN "price";
    // Orqaga qaytish: release 5 dan oldin har qanday release'ga qaytish mumkin.
  solutionNotes: |
    - **Expand** faqat qo'shadi: yangi ustunlar nullable, eski kod ularni bilmaydi va buzilmaydi. Bu release eng xavfsiz.
    - **Migrate** ikki qismdan iborat: dual write (yangi yozuvlar ikkala ustunda) va backfill (eski yozuvlar). Tartib muhim: avval dual write deploy qilinadi, keyin backfill. Aks holda backfill va yangi yozuv orasida qolgan qatorlar yo'qoladi.
    - O'qishni yangi ustunga o'tkazish fallback bilan: backfill tugamagan qatorlar uchun eski ustundan hisoblanadi. Bu kodni istalgan paytda deploy qilish xavfsiz qiladi.
    - `getPrice` qaytarish tipi `number` dan `Money` ga o'zgardi: bu ham Change Function Declaration. Chaqiruvchilar ko'p bo'lsa, `getPriceSom()` ni vaqtincha qoldirib, chaqiruvchilarni bosqichma-bosqich ko'chirish kerak (kod darajasidagi parallel change).
    - **Contract** ikki release'ga bo'lingan: avval kod eski ustunni unutadi, keyin ustun o'chiriladi. Shunda rolling deploy paytida hali eski ustunni o'qiydigan instansiya qolmaydi.
    - Bu reja 5 ta release. Bu ko'p ko'rinadi, lekin har biri kichik va qaytariladigan. Yagona qaytarib bo'lmaydigan qadam - `DROP COLUMN`, va u eng oxirida, hamma narsa tekshirilgandan keyin. Drop'dan oldin backup yoki ustunni bir muddat qoldirish ham variant.
    - Contract'ni unutmang: eski `price` ustuni va fallback kodi qolsa, keyingi dasturchi qaysi biri haqiqiy ekanini bilmaydi.
  checklist:
    - "Har bir bosqich alohida release va har biridan keyin tizim ishlaydi"
    - "Expand faqat nullable ustunlar qo'shadi, eski kod buzilmaydi"
    - "Dual write backfill'dan oldin deploy qilinadi"
    - "O'qish fallback bilan, backfill tugamagan qatorlar ham to'g'ri ishlaydi"
    - "Eski ustunni o'chirish eng oxirgi, alohida qadam va undan oldin kod uni ishlatmaydi"
---

## Muammo

71-darsda refaktoringni kichik, xavfsiz qadamlar deb ta'rifladik. 72-79-darslarda bu qadamlar funksiya, klass va modul darajasida qanday ko'rinishini ko'rdik. Lekin ba'zi o'zgarishlar bu darajadan ancha katta:

- ORM'ni almashtirish (TypeORM'dan Prisma'ga), yoki Prisma'dan Kysely'ga.
- Monolitdan to'lov modulini alohida servisga ajratish.
- Eski PHP yoki .NET tizimini yangi Node.js platformasi bilan almashtirish.
- Ma'lumotlar bazasi sxemasining asosiy jadvalini qayta tuzish.

Bunday o'zgarishlarga odatiy yondashuv - "katta portlash" (big bang): alohida branch'da yoki alohida loyihada yangi versiyani qurish va bir kunda o'tish. Bu yondashuvning tarixi yaxshi emas. Fowler Strangler Fig maqolasida sabablarni sanaydi: bunday loyihalar uzoq davom etadi, foydalanuvchilar shu vaqt davomida yangi funksiyalarni kutishga tayyor emas, eski tizimning mavjud xatti-harakatini hujjatlash juda qiyin, va bu xatti-harakatning ko'p qismi aslida kerak emas, demak uni qayta qurish isrof.

Bu darsda katta o'zgarishni ham kichik, release qilinadigan qadamlarga bo'lishning uchta naqshini ko'ramiz.

## Asosiy g'oya

Uchala naqshning umumiy tamoyili: **eski va yangi bir vaqtda yashaydi, tizim har bir qadamdan keyin ishlaydi va release qilinishi mumkin, o'tish asta-sekin, oxirida esa eski qism olib tashlanadi**.

- **Strangler Fig Application** - tizim darajasida. Yangi tizim eski tizim atrofida o'sadi va uni qism-qism almashtiradi.
- **Branch by Abstraction** - kod bazasi ichida. Almashtiriladigan komponent (kutubxona, framework, modul) oldiga abstraksiya qo'yiladi va implementatsiya uning ortida almashtiriladi.
- **Parallel Change** (expand and contract) - interfeys darajasida. Mos kelmaydigan o'zgarish uch bosqichga bo'linadi: kengaytirish, ko'chirish, qisqartirish.

Ular bir-birini to'ldiradi. Strangler Fig ichida har bir qismni ko'chirish uchun Branch by Abstraction ishlatiladi, Branch by Abstraction'da abstraksiya qatlamini qo'shish uchun esa Parallel Change.

## Chuqurroq: uchta naqsh

### Strangler Fig Application

Metafora tabiatdan. Fowler 2001 yilda Avstraliyaning Kvinslend shtatidagi tropik o'rmonlarda strangler fig (bo'g'uvchi anjir) daraxtlarini ko'radi. Bu o'simlik boshqa daraxtning yuqori shoxlarida unib chiqadi, ildizlarini asta-sekin yerga tushiradi va yillar davomida egasini o'rab, oxirida uning o'rnini egallaydi. Fowler bunda hamkasblari eski tizimlarni modernizatsiya qilish usuliga o'xshashlikni ko'radi.

Maqolaning asl nomi "StranglerApplication" edi. Keyinchalik Fowler uni "Strangler Fig Application" ga o'zgartirdi: odamlar metaforaning botanik kelib chiqishini unutib, faqat "strangler" so'zini ishlatayotgan edi va bu so'zning zo'ravonlik ohangi bor edi. Maqolaning hozirgi versiyasi 2024 yilda yangilangan.

Maqoladagi asosiy g'oyalar:

- **Asta-sekin almashtirish.** Kichik qo'shimchalardan boshlang, ko'pincha yangi funksiyalardan, ularni eski kod bazasi yonida quring. Keyin xatti-harakatni eski tizimdan yangisiga ko'chiring.
- **Seam'larni topish.** Eski tizimni bo'lish uchun seam'lar kerak: komponentlarni mustaqil almashtirish mumkin bo'lgan joylar. Bu Feathers'ning seam tushunchasining (79-dars) tizim darajasidagi ko'rinishi.
- **Kichik qismlardan boshlash.** Bu biznesga erta qiymat beradi va jamoaga eski tizim haqida o'rganish imkonini beradi.
- **Transitional architecture.** Eski va yangi tizim birga yashashi uchun vaqtinchalik kod kerak: proksi, routing qatlami, ma'lumot sinxronizatsiyasi. U modernizatsiya tugagach olib tashlanadi. Fowler bu kod isrof ko'rinishini tan oladi, lekin kamaygan xavf va erta qiymat uning narxidan ustun deb hisoblaydi.
- **Tashkiliy o'zgarish.** Fowler muhim ogohlantirishni qo'shadi: eski tizimni yaratgan dizayn fikrlash va jarayonlar o'zgarmasa, yangi tizim ham vaqt o'tib xuddi shunday holatga keladi.

Fowler bu yondashuv modernizatsiyani oson qilmasligini ham ochiq aytadi: chuqur o'rnashgan tizimni almashtirish baribir qiyin. Strangler Fig faqat xavfni boshqarish usuli.

Amaliy ko'rinish: eski tizim oldiga routing qatlami (nginx, API gateway yoki NestJS proxy) qo'yiladi. Birinchi kun hamma so'rov eski tizimga ketadi. Keyin `/api/reports/*` yangi servisga yo'naltiriladi. Bir necha oydan keyin `/api/billing/*`. Oxirida eski tizimga hech narsa bormaydi va u o'chiriladi.

### Branch by Abstraction

Fowler maqolasida bu katta o'zgarishni asta-sekin qilish texnikasi sifatida tasvirlanadi: o'zgarish davom etayotgan paytda ham tizimni muntazam release qilish mumkin. Nomni Paul Hammant trunk-based development'ni targ'ib qilganda bergan, lekin u texnikaning o'zini Stacy Curl'ga nisbat beradi. Fowler texnika nomdan ancha oldin mavjud bo'lganini ham qayd etadi.

Qadamlar:

1. **Boshlang'ich holat.** Tizimning bir nechta qismi almashtirmoqchi bo'lgan modul, kutubxona yoki framework'ga (supplier) bog'liq.
2. **Abstraksiya qo'shish.** Mijoz kodining bir qismi supplier bilan qanday ishlashini ifodalovchi abstraksiya qatlami yaratiladi va o'sha mijozlar unga ulanadi.
3. **Mijozlarni ko'chirish.** Qolgan mijozlar ham bosqichma-bosqich abstraksiyaga o'tkaziladi. Shu jarayonda abstraksiya orqali supplier uchun testlar qo'shiladi.
4. **Yangi supplier.** Bir guruh mijozga kerak bo'lgan funksiyalar abstraksiya ortida yangi implementatsiya sifatida yoziladi va o'sha mijozlar yangisiga o'tkaziladi.
5. **Eskisini o'chirish.** Qolgan mijozlar o'tkaziladi, eski supplier o'chiriladi. Agar abstraksiya qatlami endi foyda bermasa, uni ham olib tashlash mumkin.

Maqolada variantlar ham bor: ba'zan mijozlarni guruh-guruh o'tkazib bo'lmaydi va o'tish birdaniga bo'lishi kerak; ba'zan supplier'ni kichik komponentlarga bo'lib, har birini alohida ko'chirish mumkin. Feature flag'lar yangi supplier'ni test muhitlarida yoqib, uning xatti-harakatini eskisi bilan solishtirish uchun foydali.

Maqolada keltirilgan amaliy misol: Jez Humble Thoughtworks'dagi jamoasi Go (continuous delivery vositasi) ustida ishlaganda ORM'ni (iBATIS'dan Hibernate'ga) va web UI framework'ini shu usul bilan almashtirgan.

Branch by Abstraction 71-darsdagi long-term refactoring'ning asosiy texnikasi: Fowler "Workflows of Refactoring" maqolasida ham uni aynan shu kontekstda tilga oladi.

### Parallel Change

Danilo Sato martinfowler.com'da tasvirlagan naqsh. U Joshua Kerievskyga nisbat beriladi, u buni 2006 yilda refaktoring strategiyasi sifatida hujjatlashtirgan. Maqsad: orqaga mos kelmaydigan (backward-incompatible) interfeys o'zgarishini xavfsiz qilish.

Uch bosqich:

- **Expand** - yangi versiyani eskisi bilan yonma-yon qo'shish. Mavjud mijozlar ishlashda davom etadi.
- **Migrate** - mijozlarni eski versiyadan yangisiga bosqichma-bosqich o'tkazish. Tashqi mijozlar bo'lsa, bu eng uzoq bosqich.
- **Contract** - hech kim ishlatmayotganda eski versiyani olib tashlash.

Qo'llanish sohalari:

- **Kod darajasida.** Metod signaturasini o'zgartirish: yangi signaturali metod qo'shiladi, eskisi yangisini chaqiradi, chaqiruvchilar ko'chiriladi, eskisi o'chiriladi. Bu 76-darsdagi Change Function Declaration'ning migration mexanikasi.
- **Ma'lumotlar bazasi.** Fowler maqolasida aytilganidek, ko'p database refactoring'lar shu naqshga bo'ysunadi. Migrate bosqichi - eski va yangi sxema bir vaqtda ishlatiladigan o'tish davri.
- **Masofaviy API'lar.** API versiyasini oshirish o'rniga yangi maydon yoki endpoint qo'shish, mijozlar o'tgandan keyin eskisini olib tashlash.

Maqoladagi ogohlantirishlar:

- Migrate davomida supplier ikki versiyani qo'llab-quvvatlashi kerak va mijozlar qaysi biri joriy ekanini chalkashtirib yuborishi mumkin.
- **Contract bosqichi o'tkazib yuborilsa, kod bazasi avvalgidan ham yomon holatda qoladi.** Bu eng keng tarqalgan muvaffaqiyatsizlik.
- Oxiriga yetkazish uchun intizom kerak. Deprecation belgilari, hujjatlar yoki TODO'lar qaysi versiya almashtirilayotganini boshqalarga ko'rsatadi.

Maqola Branch by Abstraction bilan munosabatni ham ko'rsatadi: Parallel Change abstraksiya qatlamini kiritish uchun ishlatilishi mumkin, mijozlar ko'p bo'lganda esa Branch by Abstraction odatda yaxshiroq strategiya.

## Misol: NestJS'da ORM'ni Branch by Abstraction bilan almashtirish

Transport parki platformasi TypeORM'dan Prisma'ga o'tmoqda. `TripsService`, `ReportsService` va `BillingService` to'g'ridan-to'g'ri TypeORM repository'larini ishlatadi.

**1-2-qadam: abstraksiya va birinchi mijoz.** Mijozlar haqiqatan nimaga muhtojligini ifodalovchi interfeys (TypeORM API'sini emas):

```ts
export type TripSummary = {
  id: string;
  vehicleId: string;
  distanceKm: number;
  startedAt: Date;
};

export interface TripsRepository {
  findByVehicle(vehicleId: string, from: Date, to: Date): Promise<TripSummary[]>;
  totalDistance(vehicleId: string, from: Date, to: Date): Promise<number>;
}

export const TRIPS_REPOSITORY = Symbol("TRIPS_REPOSITORY");
```

Birinchi implementatsiya - eski kod, o'zgarishsiz ko'chirilgan:

```ts
@Injectable()
export class TypeOrmTripsRepository implements TripsRepository {
  constructor(@InjectRepository(TripEntity) private readonly repo: Repository<TripEntity>) {}

  async findByVehicle(vehicleId: string, from: Date, to: Date): Promise<TripSummary[]> {
    const rows = await this.repo.find({
      where: { vehicleId, startedAt: Between(from, to) },
      order: { startedAt: "ASC" },
    });
    return rows.map((r) => ({ id: r.id, vehicleId: r.vehicleId, distanceKm: r.distanceKm, startedAt: r.startedAt }));
  }

  async totalDistance(vehicleId: string, from: Date, to: Date): Promise<number> {
    const trips = await this.findByVehicle(vehicleId, from, to);
    return trips.reduce((sum, t) => sum + t.distanceKm, 0);
  }
}
```

`ReportsService` endi `@Inject(TRIPS_REPOSITORY) private readonly trips: TripsRepository` oladi. Release. Xatti-harakat bir xil.

**3-qadam: qolgan mijozlar.** `TripsService` va `BillingService` ham abstraksiyaga o'tadi, har biri alohida PR va release. Shu bilan birga interfeys uchun contract test'lar yoziladi: ular har qanday implementatsiyaga qo'llanadi.

```ts
export function tripsRepositoryContract(name: string, make: () => Promise<TripsRepository>) {
  describe(`${name} TripsRepository shartnomasi`, () => {
    it("davrdagi qatnovlarni vaqt bo'yicha tartiblab qaytaradi", async () => {
      const repo = await make();
      const trips = await repo.findByVehicle("V1", new Date("2026-01-01"), new Date("2026-01-31"));
      const times = trips.map((t) => t.startedAt.getTime());
      expect(times).toEqual([...times].sort((a, b) => a - b));
    });
  });
}
```

**4-qadam: yangi supplier.** `PrismaTripsRepository` yoziladi va contract test'lardan o'tadi. `totalDistance` endi SQL'da yig'iladi (`_sum`), bu performance yutug'i. Modulda feature flag bilan tanlov:

```ts
@Module({
  providers: [
    TypeOrmTripsRepository,
    PrismaTripsRepository,
    {
      provide: TRIPS_REPOSITORY,
      inject: [ConfigService, TypeOrmTripsRepository, PrismaTripsRepository],
      useFactory: (config: ConfigService, legacy: TypeOrmTripsRepository, next: PrismaTripsRepository) =>
        config.get<boolean>("USE_PRISMA_TRIPS") ? next : legacy,
    },
  ],
  exports: [TRIPS_REPOSITORY],
})
export class TripsDataModule {}
```

Staging'da flag yoqiladi, natijalar solishtiriladi. Keyin production'da. Muammo bo'lsa - flag o'chiriladi, deploy kerak emas.

**5-qadam: tozalash.** Bir necha hafta barqaror ishlagandan keyin `TypeOrmTripsRepository`, flag va TypeORM dependency'si o'chiriladi. Abstraksiya qolishi mumkin: u endi Prisma tafsilotlarini servislardan yashiradi va testlarda fake bilan almashtirish nuqtasi. Lekin agar u faqat `prisma.trip.findMany` ni uzatuvchi qatlamga aylansa, uni olib tashlash ham oqilona (Middle Man, 75-dars).

Butun jarayon davomida `main` branch release qilinadigan holatda qoldi. Hech qanday uzoq yashaydigan branch, hech qanday "merge kuni" bo'lmadi.

## Qachon qo'llamaslik kerak

- **Kichik tizimlar.** Agar eski modul 500 qator va bitta jamoa uni bir haftada qayta yoza olsa, Strangler Fig'ning transitional architecture'si (proksi, sinxronizatsiya) foydasidan qimmatroq. To'g'ridan-to'g'ri almashtirish va yaxshi testlar yetarli.
- **Tor bog'langan ma'lumot.** Strangler Fig ikki tizim bir xil ma'lumotlar bazasidan foydalanganda qiyinlashadi. Ma'lumotni ikki tizim o'rtasida sinxronlash (dual write, CDC) o'zi murakkab va xatoga moyil. Ba'zan avval ma'lumot chegarasini ajratish kerak, keyin strangler.
- **Abstraksiya noto'g'ri darajada.** Branch by Abstraction'da eski kutubxona API'sini ko'chirib olgan abstraksiya (`find(options: FindManyOptions)`) yangi supplier'ni eski shaklga majburlaydi. Abstraksiya mijozlar ehtiyojidan kelib chiqishi kerak.
- **Contract'siz expand.** Parallel change'ni boshlab, uni tugatmaslik ikki versiyali tizim beradi. Agar jamoada contract bosqichini rejalashtirish va bajarish intizomi bo'lmasa, uzoq migratsiyani boshlamang yoki contract uchun aniq sana va mas'ul belgilang.
- **Har bir sxema o'zgarishi uchun expand/contract.** Yangi nullable ustun qo'shish yoki yangi jadval yaratish bir qadamli va xavfsiz. Uch bosqich faqat mos kelmaydigan o'zgarishlar (rename, tip o'zgarishi, bo'lish, o'chirish) uchun.
- **Transitional architecture abadiy qolsa.** Proksi qatlam, feature flag'lar, eski va yangi implementatsiyalar - hammasi texnik qarz. Fowler aytganidek, ular vaqtinchalik va modernizatsiya tugagach o'chirilishi kerak.

## Stack'da: Prisma, NestJS, Next.js

- **Prisma migratsiyalari va expand/contract.** `prisma migrate dev` ustun nomini o'zgartirganda ko'pincha `DROP` va `ADD` generatsiya qiladi, bu ma'lumotni yo'qotadi va rolling deploy'ni buzadi. Generatsiya qilingan SQL'ni har doim o'qing. Rename uchun: yangi ustun qo'shish (expand), dual write va backfill (migrate), keyin eski ustunni o'chirish (contract). Prisma'dagi `@map` atributi ba'zan kod nomini DB nomidan ajratib, DB rename'ni umuman keraksiz qiladi.
- **Backfill'ni partiyalarda.** Million qatorli jadvalda bitta `UPDATE` uzoq lock va replication lag beradi. `LIMIT` bilan partiyalarda, alohida job sifatida qiling va progress'ni kuzating (95-dars).
- **NestJS DI - tayyor branch by abstraction.** Injection token va `useFactory` bilan implementatsiyani konfiguratsiya orqali tanlash bitta qatorli o'zgarish. Bu NestJS'da katta almashtirishlarni ancha arzon qiladi.
- **Next.js va Strangler Fig.** Eski frontend'ni (masalan, Create React App yoki server-rendered PHP) Next.js'ga o'tkazishda `rewrites` (next.config) bilan hali ko'chirilmagan sahifalarni eski ilovaga proksi qilish mumkin. Yangi sahifalar Next.js'da, eskilari bosqichma-bosqich ko'chiriladi.
- **API'larda parallel change.** REST javobiga yangi maydon qo'shish (expand), mijozlarni o'tkazish, eski maydonni `deprecated` deb belgilash (OpenAPI'da `deprecated: true`), keyin olib tashlash. Mobil ilovalar uchun migrate bosqichi oylab davom etishi mumkin, chunki foydalanuvchilar eski versiyani yangilamaydi.

## Xulosa

- Katta o'zgarishni ham kichik, release qilinadigan qadamlarga bo'lish mumkin: eski va yangi birga yashaydi, o'tish asta-sekin, oxirida eskisi olib tashlanadi.
- Strangler Fig - tizim darajasida asta-sekin almashtirish. Kichik qismlardan boshlang, transitional architecture'ni vaqtinchalik deb biling va tashkiliy o'zgarishni unutmang.
- Branch by Abstraction - kod ichida, abstraksiya ortida almashtirish: abstraksiya, mijozlarni ko'chirish, yangi implementatsiya, eskisini o'chirish. Trunk doim release qilinadigan holatda.
- Parallel Change - expand, migrate, contract. Ma'lumotlar bazasi migratsiyalari va API evolyutsiyasining asosiy naqshi.
- Eng keng tarqalgan xato - oxirgi bosqichni tugatmaslik. Contract bosqichi uchun aniq reja va mas'ul belgilang.
