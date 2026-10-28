---
n: 68
slug: integratsion-testlar
title: "Node/NestJS integratsion testlari"
summary: "Mock qilingan repository SQL xatosini hech qachon topmaydi. Bu darsda Testcontainers bilan real PostgreSQL ustida integratsion testlar yozishni, NestJS ilovasini supertest bilan tekshirishni, testlar orasidagi izolyatsiyani va bu testlarni tez va barqaror saqlashni ko'rib chiqamiz."
duration: 45
sources:
  - id: testcontainers-node
    note: "PostgreSQL moduli (@testcontainers/postgresql, PostgreSqlContainer, getConnectionUri, snapshot/restoreSnapshot) va Vitest global setup (provide/inject) qo'llanmasi"
  - id: nestjs-docs
    note: "Testing bo'limi: Test.createTestingModule, overrideProvider, createNestApplication, supertest bilan e2e, app.close(), test fayllari joylashuvi"
  - id: fowler-test-pyramid
    note: "Integratsion testning tor ta'rifi (bitta integratsiya nuqtasi), serializatsiya joylarida integratsion test, lokal yoki test instansiyalarga qarshi ishga tushirish, contract testlar"
quiz:
  - q: "Repository unit testida Prisma client mock qilingan va `findMany` tayyor massiv qaytaradi. Production'da `where` shartidagi xato tufayli arxivlangan mashinalar ham chiqyapti. Nega test buni topmadi?"
    options:
      - "Chunki coverage past"
      - "Chunki test SQL so'rovini umuman ishga tushirmaydi: u faqat 'repository Prisma'ni chaqiradi' degan taxminni tekshiradi"
      - "Chunki Prisma'da xato bor"
      - "Chunki test async emas"
    answer: 1
    explain: "Repository'ning butun qiymati - to'g'ri so'rov. Uni mock qilib test qilish so'rov mantiqini chetlab o'tadi. Vocke ham DB bilan integratsiya nuqtasini real (lokal yoki test) instansiyaga qarshi tekshirishni tavsiya qiladi."
  - q: "Vocke 'integratsion test' deganda qaysi tor ta'rifni ishlatadi?"
    options:
      - "Butun tizimni brauzer orqali tekshirish"
      - "Ikkita klassni birga test qilish"
      - "Bir vaqtda bitta integratsiya nuqtasini (DB, tashqi servis) real bilan tekshirish, qolganlarini double bilan almashtirish"
      - "Production'ga qarshi ishlaydigan test"
    answer: 2
    explain: "Tor ta'rif integratsion testni fokusli qiladi: masalan, repository + real PostgreSQL. Vocke bunday testlarni production'ga emas, lokal yoki test instansiyalarga qarshi ishga tushirishni aytadi."
  - q: "Testcontainers bilan har test faylida yangi PostgreSQL konteyner ishga tushiriladi va suite 6 daqiqa ishlaydi. Eng to'g'ri birinchi qadam?"
    options:
      - "Konteynerni bir marta global setup'da ishga tushirib, testlar orasidagi izolyatsiyani tranzaksiya, truncate yoki snapshot bilan ta'minlash"
      - "Integratsion testlarni o'chirish"
      - "Testlarni ketma-ket ishga tushirish"
      - "SQLite'ga o'tish"
    answer: 0
    explain: "Konteyner ishga tushishi qimmat, so'rovlar esa arzon. Bitta konteyner va har test oldidan tozalash odatda katta tezlik beradi. SQLite PostgreSQL'ga xos xatti-harakatni (JSONB, constraint'lar, tranzaksiya izolyatsiyasi) bermaydi."
  - q: "NestJS e2e testida `app.close()` `afterAll`da chaqirilmasa nima bo'ladi?"
    options:
      - "Hech narsa"
      - "Testlar yiqiladi"
      - "Supertest ishlamaydi"
      - "Ulanishlar (DB pool, HTTP server) ochiq qoladi, test runner tugamaydi yoki 'open handles' ogohlantirishi chiqadi"
    answer: 3
    explain: "NestJS hujjati e2e misolida afterAll'da app.close() chaqiradi. U modullarning shutdown hook'larini ishga tushiradi va resurslarni bo'shatadi. Busiz jarayon osilib qoladi yoki keyingi testlar bilan resurslar to'qnashadi."
  - q: "Bir nechta test fayli parallel ishlaydi va bitta PostgreSQL bazasiga yozadi. Testlar ba'zan bir-birining yozuvlarini ko'radi. Qaysi yechim noto'g'ri?"
    options:
      - "Har bir worker uchun alohida baza yoki sxema"
      - "Har test o'z ma'lumotini noyob identifikatorlar bilan yaratishi va faqat ularni so'rashi"
      - "Har test oldidan boshqa testlarning ham ma'lumotini o'chirib yuborish, parallellikni saqlagan holda"
      - "Bu fayllarni ketma-ket ishga tushirish"
    answer: 2
    explain: "Parallel testlar ishlab turganda umumiy jadvallarni tozalash boshqa testning ma'lumotini o'rtada o'chirib yuboradi va Erratic Test beradi. Izolyatsiya worker bo'yicha baza/sxema, noyob ma'lumot yoki ketma-ketlik bilan ta'minlanadi."
  - q: "Integratsion testda tashqi to'lov provayderi (HTTP API) bilan nima qilish kerak?"
    options:
      - "Har doim real sandbox'ga so'rov yuborish"
      - "O'z port'ingiz ortidagi adapterni fake yoki stub bilan almashtirish. Adapterning o'zini esa alohida, kam sonli testlar (masalan, HTTP stub server yoki contract test) bilan tekshirish"
      - "Testni o'chirish"
      - "Provayder SDK'sining ichki metodlarini jest.spyOn bilan almashtirish"
    answer: 1
    explain: "Tor ta'rifga ko'ra bitta testda bitta integratsiya nuqtasi. Ilova testida to'lov porti double bilan almashtiriladi, adapter esa o'z testlariga ega. Vocke servislar orasidagi shartnoma uchun consumer-driven contract testlarni tavsiya qiladi."
task:
  title: "Mock'li repository testini real PostgreSQL testiga aylantirish"
  prompt: |
    Transport parki tizimida `VehicleRepository.findAvailableForRental(from, to)` sanalar oralig'ida bron qilinmagan faol mashinalarni qaytaradi. Hozirgi test `pg` Pool'ni mock qiladi va SQL'ni umuman tekshirmaydi.

    1. Testcontainers (`@testcontainers/postgresql`) bilan real PostgreSQL'da test yozing.
    2. Sxemani test boshida yarating (minimal `vehicles` va `bookings` jadvallari).
    3. Har test oldidan jadvallarni tozalang.
    4. Kamida 4 ta holatni tekshiring: band mashina chiqmaydi, oraliq faqat chekkasida tegsa chiqadi, arxivlangan chiqmaydi, bekor qilingan bron mashinani band qilmaydi.
    5. Starter'dagi SQL'da xato bor. Testlar uni topsin, keyin tuzating.
  lang: ts
  starter: |
    import { Pool } from "pg";

    export class VehicleRepository {
      constructor(private readonly pool: Pool) {}

      async findAvailableForRental(from: Date, to: Date): Promise<string[]> {
        const { rows } = await this.pool.query<{ plate: string }>(
          `SELECT v.plate FROM vehicles v
           WHERE v.status = 'active'
             AND NOT EXISTS (
               SELECT 1 FROM bookings b
               WHERE b.vehicle_id = v.id
                 AND b.starts_at <= $2 AND b.ends_at >= $1
             )
           ORDER BY v.plate`,
          [from, to],
        );
        return rows.map((r) => r.plate);
      }
    }

    // vehicle.repository.spec.ts (hozirgi)
    // it("returns plates", async () => {
    //   const pool = { query: vi.fn().mockResolvedValue({ rows: [{ plate: "01A123BC" }] }) };
    //   const repo = new VehicleRepository(pool as unknown as Pool);
    //   expect(await repo.findAvailableForRental(new Date(), new Date())).toEqual(["01A123BC"]);
    // });
  solution: |
    // vehicle.repository.ts (tuzatilgan)
    import { Pool } from "pg";

    export class VehicleRepository {
      constructor(private readonly pool: Pool) {}

      /** [from, to) yarim ochiq oraliqda bo'sh faol mashinalar. */
      async findAvailableForRental(from: Date, to: Date): Promise<string[]> {
        const { rows } = await this.pool.query<{ plate: string }>(
          `SELECT v.plate FROM vehicles v
           WHERE v.status = 'active'
             AND NOT EXISTS (
               SELECT 1 FROM bookings b
               WHERE b.vehicle_id = v.id
                 AND b.status <> 'cancelled'
                 AND b.starts_at < $2 AND b.ends_at > $1
             )
           ORDER BY v.plate`,
          [from, to],
        );
        return rows.map((r) => r.plate);
      }
    }

    // vehicle.repository.int-spec.ts
    import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
    import { Pool } from "pg";
    import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
    import { VehicleRepository } from "./vehicle.repository";

    const SCHEMA = `
      CREATE TABLE vehicles (
        id serial PRIMARY KEY,
        plate text NOT NULL UNIQUE,
        status text NOT NULL CHECK (status IN ('active', 'archived'))
      );
      CREATE TABLE bookings (
        id serial PRIMARY KEY,
        vehicle_id int NOT NULL REFERENCES vehicles(id),
        starts_at timestamptz NOT NULL,
        ends_at timestamptz NOT NULL,
        status text NOT NULL CHECK (status IN ('confirmed', 'cancelled'))
      );
    `;

    let container: StartedPostgreSqlContainer;
    let pool: Pool;
    let repo: VehicleRepository;

    const day = (d: number) => new Date(Date.UTC(2026, 10, d));

    async function givenVehicle(plate: string, status = "active"): Promise<number> {
      const { rows } = await pool.query<{ id: number }>(
        "INSERT INTO vehicles (plate, status) VALUES ($1, $2) RETURNING id",
        [plate, status],
      );
      return rows[0].id;
    }

    async function givenBooking(vehicleId: number, from: Date, to: Date, status = "confirmed") {
      await pool.query(
        "INSERT INTO bookings (vehicle_id, starts_at, ends_at, status) VALUES ($1, $2, $3, $4)",
        [vehicleId, from, to, status],
      );
    }

    beforeAll(async () => {
      container = await new PostgreSqlContainer("postgres:16-alpine").start();
      pool = new Pool({ connectionString: container.getConnectionUri() });
      await pool.query(SCHEMA);
      repo = new VehicleRepository(pool);
    }, 60_000);

    afterAll(async () => {
      await pool?.end();
      await container?.stop();
    });

    beforeEach(async () => {
      await pool.query("TRUNCATE bookings, vehicles RESTART IDENTITY CASCADE");
    });

    describe("VehicleRepository.findAvailableForRental", () => {
      it("oraliqda tasdiqlangan broni bor mashinani chiqarmaydi", async () => {
        const busy = await givenVehicle("01A111AA");
        await givenVehicle("01A222AA");
        await givenBooking(busy, day(10), day(15));

        expect(await repo.findAvailableForRental(day(12), day(14))).toEqual(["01A222AA"]);
      });

      it("bron tugagan kuni boshlanadigan ijara uchun mashinani bo'sh deb hisoblaydi", async () => {
        const id = await givenVehicle("01A111AA");
        await givenBooking(id, day(10), day(15));

        expect(await repo.findAvailableForRental(day(15), day(18))).toEqual(["01A111AA"]);
      });

      it("arxivlangan mashinani chiqarmaydi", async () => {
        await givenVehicle("01A111AA", "archived");

        expect(await repo.findAvailableForRental(day(1), day(2))).toEqual([]);
      });

      it("bekor qilingan bron mashinani band qilmaydi", async () => {
        const id = await givenVehicle("01A111AA");
        await givenBooking(id, day(10), day(15), "cancelled");

        expect(await repo.findAvailableForRental(day(11), day(12))).toEqual(["01A111AA"]);
      });
    });
  solutionNotes: |
    - Testlar starter'dagi ikki xatoni topdi: (1) `<=`/`>=` tufayli bron tugagan kuni boshlanadigan ijara "band" chiqardi; (2) bekor qilingan bronlar ham mashinani band qilardi. Mock'li test ikkalasini ham hech qachon topmasdi.
    - Oraliq semantikasi `[from, to)` hujjat kommentida aniq yozildi va test bilan qotirildi. Bu biznes qarori: agar mashina qaytarilgan kuni boshqa mijozga berilmasa, test va SQL birga o'zgaradi.
    - Konteyner fayl darajasida bir marta ishga tushadi (`beforeAll`, 60 soniya timeout birinchi image yuklanishi uchun), har test oldidan `TRUNCATE` bilan tozalanadi.
    - `givenVehicle` va `givenBooking` - Creation Method'lar: testda faqat muhim ma'lumot ko'rinadi (62-dars).
    - Real loyihada sxema migratsiyalardan (Prisma migrate, Kysely migrator) olinishi kerak, qo'lda yozilgan SQL'dan emas, aks holda test va production sxemasi ajralib ketadi.
    - Ko'p fayl bo'lsa, konteynerni Vitest `globalSetup`ga ko'chirib, `project.provide`/`inject` bilan URI'ni uzatish mumkin.
  checklist:
    - "Test real PostgreSQL'ga (Testcontainers) qarshi ishlaydi, pg mock qilinmagan"
    - "Har test oldidan holat tozalanadi va testlar tartibga bog'liq emas"
    - "Oraliq chekkasi va bekor qilingan bron holatlari tekshirilgan"
    - "Starter'dagi SQL xatosi test orqali topilgan va tuzatilgan"
    - "afterAll'da pool va konteyner yopiladi"
---

## Muammo

NestJS loyihasidagi odatiy holat: servislar va repository'lar uchun yuzlab unit testlar, hammasida Prisma yoki TypeORM mock qilingan. Coverage 85%. Production'da esa xatolar asosan uch joydan keladi: SQL so'rovidagi shart (`<` o'rniga `<=`), migratsiya va kod o'rtasidagi nomuvofiqlik (ustun nomi o'zgargan, kod eski nomni ishlatadi) va HTTP qatlamidagi detallar (DTO validatsiyasi ishlamaydi, `ValidationPipe` ulanmagan, serializatsiyada `Date` string bo'lib ketgan).

Bu xatolarning hammasi bitta umumiy xususiyatga ega: ular **integratsiya nuqtalarida** yashaydi. Unit testlar bu nuqtalarni ta'rifi bo'yicha chetlab o'tadi. Mock qilingan repository "Prisma'ni to'g'ri argument bilan chaqirdim" deb tasdiqlaydi, lekin so'rov to'g'ri natija berishini tekshirmaydi. 66-darsda buni yolg'on ijobiy natija deb atadik.

Uzoq vaqt bu muammoning sababi amaliy edi: real ma'lumotlar bazasi bilan test qilish qiyin. Umumiy test bazasi testlar orasida holat aralashishiga olib kelardi, lokal o'rnatilgan PostgreSQL har dasturchida har xil versiyada edi, CI'da esa alohida sozlash kerak edi. Bugun bu to'siqlarning ko'pchiligi yo'qolgan: Docker va Testcontainers har test uchun toza, aniq versiyadagi bazani bir necha soniyada beradi.

## Asosiy g'oya

### Integratsion test nimani tekshiradi

Ham Vocke *Practical Test Pyramid* maqolasida integratsion testning tor ta'rifini beradi: bir vaqtda **bitta integratsiya nuqtasini** tekshirish, masalan, ma'lumotlar bazasi yoki alohida servis, qolgan hamma narsani test double bilan almashtirib. Masalan, repository testi: real repository klassi, real PostgreSQL, boshqa hech narsa. Vocke ma'lumot serializatsiya yoki deserializatsiya qilinadigan har bir joyda integratsion test yozishni maslahat beradi: DB so'rovlari, REST API chaqiruvlari, navbatdan o'qish, fayllar. U yana bir muhim narsani ta'kidlaydi: bu testlar production'ga emas, lokal yoki test instansiyalarga qarshi ishlashi kerak.

Bu ta'rif muhim, chunki u integratsion testlarni fokusli va boshqariladigan qiladi. "Hammasini birga ko'tarib test qilish" (butun ilova, barcha tashqi servislar) - bu e2e test va u boshqa narx va boshqa maqsadga ega.

NestJS kontekstida ikki xil integratsion test ko'p uchraydi:

1. **Ma'lumot qatlami testi.** Repository yoki query klassi real PostgreSQL bilan. SQL, migratsiyalar, constraint'lar, tranzaksiyalar tekshiriladi.
2. **HTTP qatlami testi.** NestJS ilovasi (yoki bitta modul) `createNestApplication` bilan ko'tariladi va supertest orqali so'rov yuboriladi. Routing, guard'lar, pipe'lar, DTO validatsiyasi, exception filter'lar va serializatsiya tekshiriladi. DB real yoki double bo'lishi mumkin - bu qaror test nimani tekshirishiga bog'liq.

### Testcontainers

Testcontainers for Node.js - test kodidan Docker konteynerlarini boshqaradigan kutubxona. PostgreSQL uchun alohida modul bor: `@testcontainers/postgresql`. Asosiy API hujjatga ko'ra oddiy: `new PostgreSqlContainer(image).start()` konteynerni ishga tushiradi va ishga tushgan konteynerni qaytaradi, undan `getConnectionUri()` (shuningdek `getHost()`, `getPort()`, `getDatabase()`, `getUsername()`, `getPassword()`) olinadi. Builder'da `withDatabase`, `withUsername` kabi sozlamalar bor.

Hujjatdagi misollar `await using` sintaksisini ishlatadi: konteyner scope tugaganda avtomatik to'xtatiladi. Bu TypeScript'ning yangi versiyalari va Node.js'ning `Symbol.asyncDispose` qo'llovini talab qiladi. Klassik `beforeAll`/`afterAll` tuzilmasida esa ishga tushgan konteynerni o'zgaruvchida saqlab, teardown'da `stop()` chaqiriladi.

Image tegini aniq bering (`postgres:16-alpine`, `latest` emas): test va production bir xil major versiyada bo'lsin va testlar image yangilanishidan kutilmaganda buzilmasin.

### NestJS testing moduli

NestJS hujjatidagi testing bo'limi asosiy vositalarni beradi. `Test.createTestingModule()` `@Module()` dekoratoriga beriladigan metadata'ni qabul qiladi va builder qaytaradi. `compile()` asinxron va modulni ishga tushiradi. `overrideProvider(Token).useValue(double)` real provider'ni almashtiradi. To'liq HTTP test uchun `moduleRef.createNestApplication()`, keyin `app.init()`, so'rovlar uchun esa supertest'ga `app.getHttpServer()` beriladi. Hujjatdagi e2e misolida `afterAll`da `app.close()` chaqiriladi.

Hujjat test fayllarining joylashuvi haqida ham konventsiya beradi: unit testlar klass yonida `.spec.ts` (yoki `.test.ts`) qo'shimchasi bilan, e2e testlar esa `test/` papkasida `.e2e-spec.ts` qo'shimchasi bilan. Fastify adapteri ishlatilsa, supertest o'rniga `app.inject()` ishlatiladi va testdan oldin `app.getHttpAdapter().getInstance().ready()` kutiladi.

Test runner haqida: NestJS hujjatining hozirgi versiyasi yangi loyihalar Vitest bilan yaratilishini aytadi va misollarda `vi.fn()` ishlatadi. Ko'p mavjud NestJS loyihalari esa Jest'da, chunki u uzoq vaqt CLI standarti bo'lgan. `@nestjs/testing` va supertest ikkalasi bilan ham bir xil ishlaydi, farq faqat `vi`/`jest` va konfiguratsiyada.

## Chuqurroq: tezlik, izolyatsiya va barqarorlik

Integratsion testlarning ikki asosiy dushmani - sekinlik va beqarorlik. Ikkalasi ham dizayn qarorlari bilan boshqariladi.

### Konteynerni qayerda ishga tushirish

Konteyner ishga tushishi bir necha soniya oladi (image yuklangan bo'lsa), so'rov esa millisekundlar. Shuning uchun asosiy qoida: **konteynerni kam ishga tushiring, holatni ko'p tozalang**.

- **Fayl darajasida** (`beforeAll`): sodda, har fayl mustaqil. Fayllar ko'p bo'lsa, sekin.
- **Global setup darajasida**: Testcontainers hujjatida Vitest uchun qo'llanma bor. `vitest.config` ichida `globalSetup` fayli ko'rsatiladi, u `setup(project)` funksiyasida konteynerni ishga tushiradi va `project.provide("databaseUrl", ...)` bilan URI'ni uzatadi, testlar esa `inject("databaseUrl")` bilan oladi. Hujjat ogohlantiradi: global setup testlardan alohida global scope'da ishlaydi, shuning uchun uzatiladigan qiymatlar serializatsiya qilinadigan bo'lishi kerak (string, raqam, oddiy obyekt). Jest'da ham `globalSetup`/`globalTeardown` bor, lekin u yerda qiymatlarni uzatish usuli boshqacha.

### Testlar orasidagi izolyatsiya

Bitta baza bir nechta test uchun ishlatilsa, har test toza holatdan boshlanishi kerak (62-dars, Independent). Usullar:

- **TRUNCATE har test oldidan.** Sodda va ishonchli. Jadvallar ko'p bo'lsa, ro'yxatni migratsiyadan avtomatik oling.
- **Tranzaksiya va rollback.** Har test tranzaksiya ichida ishlaydi va oxirida bekor qilinadi. Juda tez, lekin kod o'zi tranzaksiya ochsa yoki bir nechta ulanish ishlatsa (pool), murakkablashadi.
- **Snapshot.** Testcontainers PostgreSQL moduli `snapshot()` va `restoreSnapshot()` metodlarini taqdim etadi: migratsiyadan keyin holat saqlanadi va har test oldidan tiklanadi. Hujjatga ko'ra, bu metodlardan oldin klient ulanishlarini yopish kerak va konteyner bazasi sifatida `postgres` tizim bazasini ishlatmaslik kerak.
- **Noyob ma'lumot.** Har test o'z yozuvlarini noyob identifikatorlar bilan yaratadi va faqat ularni so'raydi. Tozalash kerak emas, parallel ishlaydi, lekin "jadvaldagi barcha qatorlar" kabi so'rovlarni test qilish qiyin.

Parallellikka e'tibor bering: Vitest test fayllarini standart holatda parallel ishga tushiradi. Agar barcha fayllar bitta bazaga yozsa va har biri `TRUNCATE` qilsa, ular bir-birining ma'lumotini o'chiradi. Yechim: har worker uchun alohida baza (`CREATE DATABASE test_${workerId}`), noyob ma'lumot yoki integratsion testlar uchun parallellikni o'chirish.

### Sxema migratsiyalardan

Test bazasining sxemasi production bilan bir xil migratsiyalardan olinishi kerak. Prisma uchun bu `prisma migrate deploy` buyrug'ini konteyner URI'si bilan ishga tushirish, Kysely uchun - `Migrator` klassi. Qo'lda yozilgan test sxemasi vaqt o'tishi bilan production'dan ajralib ketadi va testlar yana yolg'on ijobiy natija beradi. Bundan tashqari, migratsiyalarni testda ishga tushirish migratsiyalarning o'zini ham tekshiradi.

### Tashqi servislar

Tor ta'rifga ko'ra bitta testda bitta integratsiya nuqtasi. Shuning uchun HTTP qatlami testida DB real bo'lsa, to'lov provayderi, SMS va email double bilan almashtiriladi (`overrideProvider`). Bu adapterlarning o'zini alohida testlash kerak: HTTP stub server bilan (so'rov shakli va javob parsingi) yoki, servislar orasida, consumer-driven contract testlar bilan. Vocke Pact'ni misol sifatida keltiradi: iste'molchi o'ziga kerakli shartnomani test sifatida yozadi va provayder uni muntazam tekshiradi.

## Misol: buyurtma yaratish endpoint'i

NestJS'da `POST /orders` endpoint'i bor: DTO validatsiyasi, mijoz mavjudligini tekshirish, buyurtmani saqlash. Testcontainers'dagi real PostgreSQL bilan e2e test:

```ts
// test/orders.e2e-spec.ts
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "node:child_process";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { SMS_SENDER, type SmsSender } from "../src/notifications/sms-sender";

class SmsSpy implements SmsSender {
  readonly sent: { phone: string; text: string }[] = [];
  async send(phone: string, text: string) {
    this.sent.push({ phone, text });
  }
}

describe("POST /orders", () => {
  let container: StartedPostgreSqlContainer;
  let app: INestApplication;
  let prisma: PrismaService;
  const sms = new SmsSpy();

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16-alpine").start();
    process.env.DATABASE_URL = container.getConnectionUri();
    execSync("npx prisma migrate deploy", { env: process.env, stdio: "inherit" });

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(SMS_SENDER)
      .useValue(sms)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    prisma = app.get(PrismaService);
  }, 120_000);

  afterAll(async () => {
    await app?.close();
    await container?.stop();
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe('TRUNCATE "Order", "Customer" RESTART IDENTITY CASCADE');
    sms.sent.length = 0;
  });

  it("mavjud mijoz uchun buyurtma yaratadi va 201 qaytaradi", async () => {
    const customer = await prisma.customer.create({
      data: { name: "Aziz", phone: "+998901112233" },
    });

    const res = await request(app.getHttpServer())
      .post("/orders")
      .send({ customerId: customer.id, items: [{ sku: "OIL-5W30", qty: 2 }] })
      .expect(201);

    expect(res.body).toMatchObject({ id: expect.any(String), status: "new" });
    expect(await prisma.order.count({ where: { customerId: customer.id } })).toBe(1);
    expect(sms.sent).toHaveLength(1);
  });

  it("noma'lum maydonli so'rovni 400 bilan rad etadi", async () => {
    await request(app.getHttpServer())
      .post("/orders")
      .send({ customerId: "c-1", items: [], discount: 100 })
      .expect(400);
  });

  it("mavjud bo'lmagan mijoz uchun 404 qaytaradi va hech narsa saqlamaydi", async () => {
    await request(app.getHttpServer())
      .post("/orders")
      .send({ customerId: "00000000-0000-0000-0000-000000000000", items: [{ sku: "OIL-5W30", qty: 1 }] })
      .expect(404);

    expect(await prisma.order.count()).toBe(0);
  });
});
```

Bu test nimani tekshiradi va nimani tekshirmaydi:

- **Tekshiradi:** routing, `ValidationPipe` va DTO dekoratorlari, servisdagi NotFound logikasi, exception filter'ning HTTP status'ga aylantirishi, Prisma so'rovlari va real sxema, migratsiyalar ishlashi, DI ulanishi.
- **Tekshirmaydi:** buyurtma narxini hisoblash qoidalari (ular core'da, unit testda, 67-dars), SMS provayderining real API'si (adapter o'z testiga ega).
- **Uchinchi test natijani ham, yon ta'sir yo'qligini ham tekshiradi.** "404 qaytdi" yetarli emas: xato oldin buyurtma yarim saqlangan bo'lishi mumkin edi.
- **`ValidationPipe` testda ham ulangan.** Agar u `main.ts`da ulangan bo'lsa, testda ham xuddi shunday qilish kerak. Yaxshiroq yo'l - pipe'ni `APP_PIPE` provider orqali modulda ro'yxatdan o'tkazish, shunda test va production avtomatik bir xil bo'ladi.

## Qachon qo'llamaslik kerak

- **Logika testlari uchun.** Chegaraviy holatlari ko'p bo'lgan biznes qoidasini HTTP + DB orqali tekshirish qimmat va sekin. Logikani core'ga ajrating va unit test qiling (61 va 67-darslar). Integratsion test faqat ulanishni tekshirsin.
- **Docker mavjud bo'lmagan muhitlar.** Ba'zi CI muhitlarida Docker yo'q yoki cheklangan. Bunday holatda CI'ning service container imkoniyati (masalan, PostgreSQL service) bilan bir xil testlarni ishga tushirish mumkin. Testlar URI'ni environment o'zgaruvchisidan olsin, konteyner esa faqat u berilmaganda ishga tushsin.
- **SQLite yoki in-memory DB "o'rniga".** Ular tezroq, lekin PostgreSQL'ga xos xatti-harakatni bermaydi: `timestamptz`, JSONB, `ON CONFLICT`, constraint xabarlari, izolyatsiya darajalari. Ular yolg'on ishonch beradi.
- **Har narsa e2e.** Har bir endpoint'ning har bir holatini to'liq ilova bilan tekshirish - 61-darsdagi ice-cream cone. HTTP darajasida asosiy yo'l va bir-ikkita xato holati yetarli.
- **Production'ga qarshi.** Vocke aniq aytadi: integratsion testlar lokal yoki test instansiyalarga qarshi ishlaydi.

## Stack'da: amaliy sozlash

- **Fayl nomlari.** Unit: `*.spec.ts` kod yonida. DB integratsion: `*.int-spec.ts`. HTTP: `test/*.e2e-spec.ts`. Vitest'da `projects` (yoki alohida config) bilan ularni alohida ishga tushiring: unit testlar watch'da, integratsion testlar pre-push va CI'da.
- **Timeout.** Birinchi image yuklanishi uzoq bo'lishi mumkin: `beforeAll`ga 60-120 soniya bering, testlarning o'ziga esa standart timeout yetarli.
- **Prisma.** `DATABASE_URL`ni konteyner URI'siga o'rnatib, `prisma migrate deploy` ishga tushiring. `PrismaService`ni `app.get()` bilan olib, test ma'lumotini yarating.
- **Kysely.** `Migrator` va `FileMigrationProvider` bilan migratsiyalarni test boshida ishga tushiring.
- **Resurslarni yopish.** `app.close()`, `pool.end()`, `container.stop()`. Jest'dagi `--detectOpenHandles` yopilmagan resurslarni topishga yordam beradi.
- **Fastify.** `@nestjs/platform-fastify` bilan supertest o'rniga `app.inject({ method: "POST", url: "/orders", payload })`.

## Xulosa

- Xatolarning katta qismi integratsiya nuqtalarida: SQL, migratsiyalar, serializatsiya, HTTP qatlami. Unit testlar ularni ko'rmaydi.
- Integratsion test bir vaqtda bitta integratsiya nuqtasini real bilan tekshiradi (Vocke) va lokal yoki test instansiyaga qarshi ishlaydi.
- Testcontainers real PostgreSQL'ni aniq versiyada beradi: `new PostgreSqlContainer(image).start()` va `getConnectionUri()`.
- NestJS'da `Test.createTestingModule`, `overrideProvider`, `createNestApplication` va supertest bilan HTTP qatlamini tekshiring, `afterAll`da `app.close()`.
- Konteynerni kam ishga tushiring, holatni har test oldidan tozalang (TRUNCATE, tranzaksiya, snapshot) va parallellikni hisobga oling.
- Sxemani production migratsiyalaridan oling, tashqi servislarni esa port ortida double bilan almashtiring.
