---
n: 82
slug: hexagonal
title: "Hexagonal arxitektura: port va adapterlar"
summary: "Alistair Cockburn'ning Ports and Adapters g'oyasi: ilova ichki va tashqi qismga bo'linadi, tashqi dunyo bilan har bir maqsadli suhbat port orqali, har bir texnologiya esa adapter orqali ulanadi. Driving va driven tomonlar, test adapterlari va port nomlash."
duration: 35
sources:
  - id: cockburn-hexagonal
    note: "Cockburn'ning \"Hexagonal Architecture\" maqolasi: maqsad (intent), port va adapter ta'rifi, primary va secondary actor, test harness va mock, portlar soni haqida"
  - id: clean-arch
    note: "Kitobdagi chegaralar va plugin arxitekturasi haqidagi g'oyalar, Clean Architecture bilan taqqoslash uchun"
quiz:
  - q: "Cockburn'ning maqolasiga ko'ra Hexagonal arxitekturaning asosiy maqsadi nima?"
    options:
      - "Ilovani oltita qatlamga bo'lish"
      - "Mikroservislarga o'tishni osonlashtirish"
      - "Ilovani foydalanuvchi, boshqa dastur, avtomatik test yoki batch skript bir xil darajada boshqara olishi va uni baza hamda qurilmalardan izolyatsiyada qurib, test qilish"
      - "ORM'dan voz kechish"
    answer: 2
    explain: "Maqsad (intent) bo'limi aynan shuni aytadi. Olti raqami muhim emas, Cockburn buni ochiq aytadi. Mikroservis va ORM bu g'oyaning mavzusi emas."
  - q: "Quyidagilardan qaysi biri driving (primary) adapter?"
    options:
      - "PostgreSQL'ga yozadigan repository"
      - "Kafka topic'idan buyurtma xabarlarini o'qib, ilovaning use case'ini chaqiradigan consumer"
      - "SMS yuboradigan gateway klienti"
      - "Valyuta kursini tashqi API'dan oladigan klient"
    answer: 1
    explain: "Driving tomon ilovani harakatga keltiradi: HTTP controller, CLI, queue consumer, test. Repository, SMS va kurs klienti - ilova o'zi boshqaradigan driven (secondary) tomon."
  - q: "Jamoa `PaymentPort` interfeysini Stripe SDK metodlari bilan bir xil qilib yozdi: `createPaymentIntent`, `confirmCardPayment`, `retrievePaymentIntent`. Asosiy muammo nima?"
    options:
      - "Port ilovaning ehtiyoji bilan emas, bitta vendor'ning API shakli bilan nomlangan; boshqa provayder yoki fake adapter uchun u noqulay va texnologiyani ichkariga olib kiradi"
      - "Interfeysda metodlar juda kam"
      - "Port nomi `Port` bilan tugamasligi kerak"
      - "Muammo yo'q, SDK'ni aks ettirish eng xavfsiz yo'l"
    answer: 0
    explain: "Port - ilova nuqtai nazaridan maqsadli suhbat. `charge`, `refund` kabi ilova tilidagi operatsiyalar to'g'ri. Vendor API'sini nusxalash adapter vazifasini portga ko'chiradi."
  - q: "Cockburn'ga ko'ra secondary (driven) port uchun tabiiy test adapteri qaysi?"
    options:
      - "Production bazaning nusxasi"
      - "FIT kabi test harness"
      - "Selenium"
      - "Xotiradagi mock yoki fake implementatsiya"
    answer: 3
    explain: "Maqolada primary portlar uchun FIT kabi test harness, secondary portlar (masalan, baza) uchun esa in-memory mock tabiiy adapter deb ko'rsatiladi."
  - q: "Hexagonal va Clean Architecture o'rtasidagi munosabat qaysi javobda to'g'ri berilgan?"
    options:
      - "Ular bir-biriga zid: biri qatlamli, ikkinchisi qatlamsiz"
      - "Hexagonal Clean Architecture'dan keyin paydo bo'lgan va uni almashtirgan"
      - "Martin 2012 yilgi postida Hexagonal'ni o'zi umumlashtirgan arxitekturalardan biri sifatida sanaydi; ikkalasi ham bog'liqlikni domen tomon yo'naltiradi, Hexagonal esa ichkarini qatlamlarga bo'lishni talab qilmaydi"
      - "Hexagonal faqat frontend uchun"
    answer: 2
    explain: "Cockburn'ning maqolasi 2005 yilga oid, Martin'ning posti 2012 yilda. Clean Architecture ichkarini entity va use case'larga bo'ladi; Hexagonal faqat ichki va tashqi farqini qat'iy qiladi."
  - q: "Kichik loyihada har bir tashqi chaqiruv uchun alohida port ochildi: 14 ta port, ko'pchiligida bittadan metod. Cockburn'ning portlar soni haqidagi fikriga eng yaqin baho qaysi?"
    options:
      - "To'g'ri, har bir tashqi chaqiruv o'z portiga ega bo'lishi shart"
      - "Port maqsadli suhbat bo'yicha guruhlanadi; Cockburn odatda kam sonli (ikki-to'rt) port afzal ko'radi, aniq son esa mulohaza masalasi"
      - "Portlar soni har doim oltita bo'lishi kerak"
      - "Port ochish umuman kerak emas"
    answer: 1
    explain: "Cockburn aniq son tanlashni ko'p jihatdan mulohaza masalasi deydi va kichik sonni afzal ko'radi. Maydalangan portlar sayoz modullarga aylanadi (52-dars)."
task:
  title: "GPS telemetriya qabul qilishni port va adapterlarga ajratish"
  prompt: |
    Quyidagi funksiya Express handler ichida GPS nuqtasini qabul qiladi, tezlik limitini tekshiradi, Postgres'ga yozadi va limit oshsa Telegram'ga xabar yuboradi. Uni test qilish uchun haqiqiy baza va Telegram token kerak.

    1. Ilova yadrosini (`TelemetryIngestion`) ajrating: u bitta driving port (`ingest`) va ikkita driven port (`PositionLog`, `AlertNotifier`) orqali gaplashsin.
    2. Port nomlari va metodlari ilova tilida bo'lsin, Postgres yoki Telegram tilida emas.
    3. Express handler va Postgres, Telegram kodi adapterlarga aylansin.
    4. Driven portlar uchun in-memory fake yozib, yadroni test qiling.
  lang: ts
  starter: |
    import express from "express";
    import { Pool } from "pg";

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const app = express();
    app.use(express.json());

    app.post("/telemetry", async (req, res) => {
      const { vehicleId, lat, lon, speedKmh, recordedAt } = req.body;
      await pool.query(
        "insert into positions(vehicle_id, lat, lon, speed_kmh, recorded_at) values ($1,$2,$3,$4,$5)",
        [vehicleId, lat, lon, speedKmh, recordedAt],
      );
      if (speedKmh > 90) {
        await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: process.env.TG_CHAT,
            text: `Tezlik oshdi: ${vehicleId} ${speedKmh} km/soat`,
          }),
        });
      }
      res.status(202).end();
    });

    app.listen(3000);
  solution: |
    // core/telemetry.ts - hexagon ichi
    export type Position = {
      vehicleId: string;
      lat: number;
      lon: number;
      speedKmh: number;
      recordedAt: Date;
    };

    export interface PositionLog {
      append(position: Position): Promise<void>;
    }

    export interface AlertNotifier {
      speedLimitExceeded(vehicleId: string, speedKmh: number, limitKmh: number): Promise<void>;
    }

    export class TelemetryIngestion {
      constructor(
        private readonly log: PositionLog,
        private readonly alerts: AlertNotifier,
        private readonly speedLimitKmh: number,
      ) {}

      async ingest(position: Position): Promise<void> {
        await this.log.append(position);
        if (position.speedKmh > this.speedLimitKmh) {
          await this.alerts.speedLimitExceeded(position.vehicleId, position.speedKmh, this.speedLimitKmh);
        }
      }
    }

    // adapters/postgres-position-log.ts - driven adapter
    import type { Pool } from "pg";
    import type { Position, PositionLog } from "../core/telemetry";

    export class PostgresPositionLog implements PositionLog {
      constructor(private readonly pool: Pool) {}
      async append(p: Position): Promise<void> {
        await this.pool.query(
          "insert into positions(vehicle_id, lat, lon, speed_kmh, recorded_at) values ($1,$2,$3,$4,$5)",
          [p.vehicleId, p.lat, p.lon, p.speedKmh, p.recordedAt],
        );
      }
    }

    // adapters/telegram-alert-notifier.ts - driven adapter
    import type { AlertNotifier } from "../core/telemetry";

    export class TelegramAlertNotifier implements AlertNotifier {
      constructor(private readonly token: string, private readonly chatId: string) {}
      async speedLimitExceeded(vehicleId: string, speedKmh: number, limitKmh: number): Promise<void> {
        await fetch(`https://api.telegram.org/bot${this.token}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: `Tezlik oshdi: ${vehicleId} ${speedKmh} km/soat (limit ${limitKmh})`,
          }),
        });
      }
    }

    // adapters/http.ts - driving adapter
    import express from "express";
    import type { TelemetryIngestion } from "../core/telemetry";

    export function telemetryRouter(ingestion: TelemetryIngestion): express.Router {
      const router = express.Router();
      router.post("/telemetry", async (req, res) => {
        const body = req.body as Record<string, unknown>;
        await ingestion.ingest({
          vehicleId: String(body.vehicleId),
          lat: Number(body.lat),
          lon: Number(body.lon),
          speedKmh: Number(body.speedKmh),
          recordedAt: new Date(String(body.recordedAt)),
        });
        res.status(202).end();
      });
      return router;
    }

    // test/telemetry.test.ts - fake adapterlar bilan
    import { TelemetryIngestion, type Position, type PositionLog, type AlertNotifier } from "../core/telemetry";

    class InMemoryPositionLog implements PositionLog {
      readonly items: Position[] = [];
      async append(p: Position) { this.items.push(p); }
    }
    class RecordingNotifier implements AlertNotifier {
      readonly calls: Array<{ vehicleId: string; speedKmh: number }> = [];
      async speedLimitExceeded(vehicleId: string, speedKmh: number) { this.calls.push({ vehicleId, speedKmh }); }
    }

    export async function overSpeedSendsAlert(): Promise<boolean> {
      const log = new InMemoryPositionLog();
      const alerts = new RecordingNotifier();
      const core = new TelemetryIngestion(log, alerts, 90);
      await core.ingest({ vehicleId: "01A123BC", lat: 41.3, lon: 69.2, speedKmh: 104, recordedAt: new Date() });
      return log.items.length === 1 && alerts.calls.length === 1;
    }
  solutionNotes: |
    - Yadro (`core/telemetry.ts`) hech qanday tashqi paket import qilmaydi. U ikki driven port va bitta driving operatsiya (`ingest`) orqali gaplashadi.
    - `AlertNotifier.speedLimitExceeded` - ilova tilidagi hodisa. Port "Telegram'ga xabar yubor" demaydi, shuning uchun ertaga SMS yoki push adapteri qo'shish yadroga tegmaydi.
    - Tezlik limiti konstruktor orqali keladi: bu konfiguratsiya, yadro uni `process.env`dan o'qimaydi (86-dars).
    - Express handler faqat tarjimon: JSON'dan `Position`ga aylantiradi va natijani HTTP status'ga. Kirishni to'liq validatsiya qilish uchun bu yerda zod sxemasi qo'yish o'rinli (89-dars).
    - Test ikkita oddiy fake bilan ishlaydi, mock kutubxonasi kerak emas. Bu Cockburn'ning "ilovani to'liq izolyatsiyada ishlatish" g'oyasi.
    - Portlar soni kichik: ikkita driven port. Har bir SQL so'rovi uchun alohida port ochilmadi.
  checklist:
    - "Yadro faylida express, pg yoki fetch yo'q"
    - "Port nomlari ilova tilida, texnologiya tilida emas"
    - "Har bir adapter faqat bitta portni implement qiladi va faqat tarjima qiladi"
    - "Yadro in-memory fake'lar bilan test qilinadi"
    - "Konfiguratsiya (limit, token) konstruktor orqali uzatiladi"
---

## Muammo

Fleet tizimida GPS trekerlardan keladigan ma'lumotni qabul qiladigan modul bor. Boshida u faqat HTTP orqali ishlagan. Keyin trekerlar MQTT orqali ulandi, so'ng eski ma'lumotlarni CSV'dan import qilish kerak bo'ldi, yana keyin QA jamoasi "real treker va bazasiz yuklama testi" so'radi. Har bir yangi kirish yo'li uchun dasturchilar mavjud Express handler'ni nusxalab, ichidagi mantiqni biroz o'zgartirdi. Endi tezlik limitini tekshirish qoidasi to'rtta joyda va ular bir-biridan farq qiladi.

Teskari tomonda ham xuddi shu og'riq: ogohlantirish avval Telegram'ga ketardi, keyin SMS ham kerak bo'ldi, so'ng mijozlar o'z webhook'ini ulashni xohladi. Biznes mantiq ichida `fetch("https://api.telegram.org/...")` turgani uchun har bir yangi kanal yadroni o'zgartirishni talab qildi.

Ikkala holatda ham bitta sabab: ilovaning ichi tashqi texnologiyani bevosita biladi.

## Asosiy g'oya

Alistair Cockburn 2005 yilda yozgan maqolasida bu muammoni Hexagonal arxitektura (Ports and Adapters) bilan hal qiladi. Maqolaning maqsad bo'limi qisqa: ilovani foydalanuvchilar, boshqa dasturlar, avtomatik testlar yoki batch skriptlar bir xil darajada boshqara olsin va u o'zining yakuniy baza va qurilmalaridan izolyatsiyada ishlab chiqilib, test qilinsin.

G'oya uchta tushunchaga tayanadi:

- **Ichki va tashqi.** Ilova (hexagon ichi) biznes mantiqni saqlaydi. UI, baza, xabar navbatlari, tashqi API'lar va testlar tashqarida. Cockburn uchun eng muhim asimmetriya - chap va o'ng, yoki yuqori va past emas, aynan ichki va tashqi.
- **Port.** Ilovaning tashqi dunyo bilan bitta maqsadli suhbati uchun interfeys. Cockburn'ning so'zlari bilan: "A port identifies a purposeful conversation." Port texnologiyadan mustaqil va ilova nuqtai nazaridan ta'riflanadi.
- **Adapter.** Muayyan texnologiyani portga ulaydigan kod. U port API'sini qurilma yoki tizim tushunadigan signallarga va aksincha aylantiradi. Bitta portga odatda bir nechta adapter ulanadi: real HTTP, CLI, test harness, in-memory mock.

Nega olti burchak? Cockburn buni ochiq aytadi: olti raqamida hech qanday ma'no yo'q. Shakl faqat ko'p portlarni chizish uchun joy beradi va odamlarni bir o'lchovli "yuqoridan pastga" qatlam diagrammasidan qutqaradi.

## Chuqurroq: driving, driven va testlar

### Primary va secondary aktorlar

Cockburn tashqi aktorlarni ikki turga ajratadi:

- **Primary (driving) aktor** ilovani harakatga keltiradi: foydalanuvchi brauzer orqali, boshqa servis HTTP so'rov bilan, queue consumer, cron, test. Ularning adapterlari diagrammaning chap yoki yuqori tomonida chiziladi.
- **Secondary (driven) aktor** - ilova o'zi boshqaradigan tomon: baza, SMS provayderi, to'lov shlyuzi, fayl saqlash. Ularning adapterlari o'ng yoki pastki tomonda.

Bu farq kod yo'nalishida ko'rinadi. Driving tomonda adapter ilovani chaqiradi: Express handler `ingestion.ingest(position)` deydi. Driven tomonda ilova portni chaqiradi, adapter esa uni implement qiladi: yadro `alerts.speedLimitExceeded(...)` deydi, Telegram adapteri bu interfeysni bajaradi. Ikkinchi holatda bog'liqlik inversiya qilingan (57-dars): interfeys ilovaga tegishli, implementatsiya tashqarida.

### Konfiguratsiyalanadigan bog'liqlik

Maqolada ilova repository adapterini konstruktor orqali olishi, qaysi implementatsiya (mock yoki real) ishlatilishini esa tashqaridagi factory hal qilishi ko'rsatiladi. Cockburn buning asosi sifatida Dependency Inversion va Dependency Injection'ni keltiradi. NestJS'da bu provider konfiguratsiyasi: modul qaysi klass portni bajarishini tanlaydi, yadro esa bilmaydi.

### Test - birinchi adapter

Hexagonal arxitekturaning eng amaliy natijasi testlarda ko'rinadi. Maqolaga ko'ra primary portlar uchun FIT kabi test harness, secondary portlar uchun esa in-memory mock tabiiy adapter. Ya'ni test - bu tizimning birinchi to'laqonli mijozi, keyin qo'shilgan "hiyla" emas. Cockburn ta'kidlaydiki, mock va test harness arxitekturadan kelib chiqishi kerak, uning o'rnini bosmasligi kerak.

Amaliy ma'nosi: agar yadro uchun test yozish uchun `jest.mock("pg")` qilish kerak bo'lsa, port noto'g'ri joyda. Yaxshi portda fake implementatsiya 5 qatorlik oddiy klass bo'ladi.

### Portni qanday nomlash

Eng ko'p uchraydigan xato - portni texnologiya yoki vendor shaklida yozish: `PostgresPort`, `TelegramPort`, yoki Stripe SDK metodlarini qaytaradigan `PaymentPort`. Bu adapter vazifasini portga ko'chiradi. To'g'ri savol: **ilova bu suhbatdan nimani xohlaydi?** "Pozitsiyani jurnalga qo'sh", "tezlik oshgani haqida xabar ber", "to'lovni yech". Shunda port nomi `PositionLog`, `AlertNotifier`, `PaymentGateway`, metodlari esa `append`, `speedLimitExceeded`, `charge` bo'ladi.

### Portlar soni

Cockburn aniq sonni tanlashni ko'p jihatdan mulohaza masalasi deydi va kichik sonni (ikki, uch yoki to'rt) afzal ko'radi. U "noto'g'ri" son tanlash jiddiy zarar keltirmasligini ham qo'shimcha qiladi. Amalda bu shuni bildiradi: har bir SQL so'rovi yoki har bir tashqi endpoint uchun alohida port ochmang. Maqsadli suhbat bo'yicha guruhlang.

### Clean Architecture bilan farqi

Martin 2012 yilgi postida Hexagonal'ni o'zi umumlashtirgan arxitekturalar qatorida sanaydi (81-dars). Asosiy farq: Clean Architecture ichkarini entity va use case doiralariga bo'ladi va doiralar orasidagi Dependency Rule'ni qat'iy qiladi. Hexagonal esa ichkarining tuzilishi haqida deyarli hech narsa demaydi, faqat ichki va tashqi chegarasini va portlar orqali muloqotni talab qiladi. Shuning uchun Hexagonal kichikroq va ko'p loyihalar uchun yetarli boshlang'ich nuqta.

## Misol: to'lov provayderi

Yomon variant. Buyurtma servisi Payme SDK'sini bevosita biladi:

```ts
import { PaymeClient, type PaymeReceipt } from "payme-sdk";

export class CheckoutService {
  private readonly payme = new PaymeClient({ merchantId: process.env.PAYME_ID ?? "" });

  async pay(orderId: string, amountUzs: number): Promise<PaymeReceipt> {
    const receipt = await this.payme.receiptsCreate({
      amount: amountUzs * 100,
      account: { order_id: orderId },
    });
    await this.payme.receiptsPay({ id: receipt._id });
    return receipt;
  }
}
```

Muammolar: SDK klienti klass ichida yaratiladi (almashtirib bo'lmaydi), tiyinlarga o'tkazish (`* 100`) biznes kodida, natija vendor tipi. Click qo'shilsa, `CheckoutService` o'zgaradi. Testda haqiqiy Payme sandbox kerak.

Yaxshi variant. Port ilova tilida, adapter vendor tilida:

```ts run
// core/payments.ts
export type ChargeResult =
  | { status: "succeeded"; providerRef: string }
  | { status: "declined"; reason: string };

export interface PaymentGateway {
  charge(orderId: string, amountUzs: number): Promise<ChargeResult>;
}

export class Checkout {
  constructor(private readonly payments: PaymentGateway) {}

  async pay(orderId: string, amountUzs: number): Promise<ChargeResult> {
    if (amountUzs <= 0) return { status: "declined", reason: "invalid_amount" };
    return this.payments.charge(orderId, amountUzs);
  }
}

// Sinab ko'ring: soxta gateway javobini yoki summani o'zgartiring.
const fakeGateway: PaymentGateway = {
  charge: async (orderId) => ({ status: "succeeded", providerRef: `fake-${orderId}` }),
};
const checkout = new Checkout(fakeGateway);
console.log(await checkout.pay("order-7", 150_000));
console.log(await checkout.pay("order-8", 0));
```

```ts
// adapters/payme-gateway.ts
import { PaymeClient } from "payme-sdk";
import type { PaymentGateway, ChargeResult } from "../core/payments";

const TIYIN_PER_SUM = 100;

export class PaymeGateway implements PaymentGateway {
  constructor(private readonly client: PaymeClient) {}

  async charge(orderId: string, amountUzs: number): Promise<ChargeResult> {
    try {
      const receipt = await this.client.receiptsCreate({
        amount: amountUzs * TIYIN_PER_SUM,
        account: { order_id: orderId },
      });
      await this.client.receiptsPay({ id: receipt._id });
      return { status: "succeeded", providerRef: receipt._id };
    } catch (error: unknown) {
      return { status: "declined", reason: error instanceof Error ? error.message : "unknown" };
    }
  }
}
```

(`payme-sdk` bu yerda shartli nom: real loyihada siz ishlatadigan SDK yoki o'z HTTP klientingiz bo'ladi.)

Nima o'zgardi:

- **Port ilovaning ehtiyojini aytadi.** `charge(orderId, amountUzs)` - bitta maqsadli operatsiya. Ikki bosqichli "create + pay" protokoli adapter ichida yashiringan.
- **Birlik tarjimasi chegarada.** Tiyin vendor'ning detali, shuning uchun konvertatsiya adapterda.
- **Vendor xatolari domen natijasiga aylanadi.** Yadro `PaymeError` klassini bilmaydi.
- **Ikkinchi adapter qo'shish yadroga tegmaydi.** `ClickGateway` yoki testdagi `AlwaysSucceedsGateway` xuddi shu interfeysni bajaradi.

## Qachon qo'llamaslik kerak

- **Faqat bitta adapter bo'ladigan va hech qachon almashmaydigan bog'liqlik.** Agar loyiha PostgreSQL'dan boshqa narsaga o'tish ehtimoli amalda nol bo'lsa va testlar Testcontainers bilan real bazada yuradigan bo'lsa (68-dars), har bir jadval uchun repository porti ko'pincha sayoz qatlam bo'lib qoladi. Port test uchun ham, almashtirish uchun ham kerak emas bo'lsa, u marosim.
- **Port ortida "sizib chiqadigan" abstraksiya.** Agar port metodlari tranzaksiya, lock yoki SQL'ga xos imkoniyatlarni ochiq talab qilsa (`findWithLock`, `rawQuery`), demak chegara noto'g'ri joyda. Bunday holda adapterni yadroga yaqinroq qabul qilish halolroq.
- **Har bir SDK chaqiruvini o'rash.** Yuzta metodli SDK'ni to'liq o'raydigan "universal" port yozish - adapter emas, SDK'ning nusxasi. Faqat ilova haqiqatan ishlatadigan suhbatni port qiling (50-dars, tashqi kodni o'rash).
- **Mantiqsiz yadro.** Agar "ilova" faqat bir formatdan boshqasiga ko'chirish bo'lsa (ETL, proxy), ichki qism bo'sh qoladi va portlar faqat bilvosita chaqiruv qo'shadi.

Hexagonal arxitektura ham bepul emas: har bir port interfeys, adapter, DI ulanish va ba'zan mapping kodi degani. Uning foydasi ikkita aniq holatda yaqqol: bir portga bir nechta real adapter ulanadi yoki yadro haqiqatan ham murakkab va tez test qilinishi kerak.

## Stack'da: NestJS

- **Port - abstract class yoki token.** TypeScript interfeysi runtime'da yo'qoladi. NestJS'da `export abstract class PaymentGateway { abstract charge(...): Promise<ChargeResult> }` yozib, uni token sifatida ishlatish qulay: `{ provide: PaymentGateway, useClass: PaymeGateway }`. Konstruktorda `private readonly payments: PaymentGateway` yetarli, `@Inject` kerak emas.
- **Muhitga qarab adapter tanlash.** `useFactory: (config: AppConfig) => config.paymentsMode === "fake" ? new FakeGateway() : new PaymeGateway(...)`. Bu Cockburn'ning "factory qaysi implementatsiyani tanlaydi" g'oyasining o'zi.
- **Driving adapterlar ko'p bo'lishi mumkin.** Bitta `Checkout` use case'ini HTTP controller, `@nestjs/microservices` message handler va CLI komandasi chaqira oladi. Ularning hech biri biznes mantiqni nusxalamaydi.
- **Testda modulni override qilish.** `Test.createTestingModule(...).overrideProvider(PaymentGateway).useClass(FakeGateway)` - driven port uchun test adapterini ulashning standart yo'li.

## Xulosa

- Hexagonal arxitektura ilovani ichki va tashqi qismga ajratadi. Tashqi dunyo bilan har bir maqsadli suhbat port orqali, har bir texnologiya adapter orqali ulanadi.
- Driving adapterlar ilovani chaqiradi, driven adapterlar ilova e'lon qilgan portni implement qiladi.
- Port ilova tilida nomlanadi. Vendor SDK'sining shaklini nusxalagan port - yashirin bog'liqlik.
- Test - birinchi adapter. Driven port uchun fake bir necha qatorlik klass bo'lishi kerak.
- Portlar kam bo'lsin va faqat foyda keltiradigan joyda: almashtiriladigan adapter yoki tez test qilinadigan murakkab yadro.
