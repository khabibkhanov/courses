---
n: 50
slug: chegaralar
title: "Chegaralar: tashqi kodni o'rash va learning test'lar"
summary: "To'lov provayderi, SMS shlyuz yoki GPS treker SDK'si sizning nazoratingizda emas, lekin ular kod bo'ylab tarqalib ketsa, butun tizim ularga bog'lanadi. Darsda Martinning chegaralar haqidagi tavsiyalarini, learning test'larni, hali mavjud bo'lmagan API uchun o'z interfeysingizni yozishni va Cockburn'ning port va adapterlar g'oyasini ko'ramiz."
duration: 45
sources:
  - id: cc1
    note: "\"Boundaries\" bobi: Map'ni o'rash, learning test'lar (log4j misoli), hali mavjud bo'lmagan kodni ishlatish (transmitter misoli), toza chegaralar"
  - id: cockburn-hexagonal
    note: "Port va adapterlar ta'rifi, primary (driving) va secondary (driven) tomonlar, ilovani izolyatsiyada test harness va mock bilan ishlatish"
quiz:
  - q: "Martin `Map` misolida qanday muammoni ko'rsatadi?"
    options:
      - "Map sekin ishlaydi"
      - "Map'ni ishlatmaslik kerak"
      - "Map'da generiklar yo'q"
      - "Map'ni tizim bo'ylab erkin uzatish uning keng interfeysini (masalan, `clear()`) va implementatsiyasini hamma joyga ochadi; uni o'z klassingiz ichiga o'rasangiz, faqat kerakli operatsiyalar ochiladi va Map o'zgarsa bitta joy o'zgaradi"
    answer: 3
    explain: "Martin `Sensors` klassi ichiga `Map`ni yashirish misolini beradi. Gap har bir `Map`ni o'rash emas, balki chegara interfeyslarini tizim bo'ylab uzatmaslik va ularni ishlatadigan klass ichida saqlash haqida."
  - q: "Learning test nima?"
    options:
      - "Yangi dasturchilar uchun o'quv testi"
      - "Production kodni test qilish"
      - "Tashqi kutubxonani o'z kodingizda ishlatishdan oldin uning xatti-harakatini tushunish uchun yozilgan testlar; ular keyinchalik kutubxona yangilanganda xatti-harakat o'zgarganini aniqlaydi"
      - "Faqat UI testlari"
    answer: 2
    explain: "Martin log4j misolida learning test'lar kutubxonani o'rganishning arzon usuli ekanini ko'rsatadi: baribir o'rganish kerak, testlar esa bu bilimni saqlaydi. Yangi versiya chiqqanda ular xatti-harakat o'zgargan-o'zgarmaganini avtomatik tekshiradi."
  - q: "Martinning transmitter misolida jamoa API hali tayyor bo'lmagan quyi tizim bilan qanday ishlagan?"
    options:
      - "API tayyor bo'lguncha kutgan"
      - "O'zlari xohlagan interfeysni aniqlab, uning ustida ishlashgan; API tayyor bo'lgach, ular orasiga adapter yozishgan"
      - "API'ni o'zlari yozgan"
      - "Kodni mock'larsiz yozgan"
    answer: 1
    explain: "Jamoa o'z tomonidan qulay interfeysni (Transmitter) aniqlagan va unga qarab kod yozgan. Haqiqiy API paydo bo'lganda Adapter pattern bilan ulangan. Bu o'z interfeysi ustida test qilish imkonini ham bergan."
  - q: "Cockburn bo'yicha \"driven\" (secondary) adapterga misol qaysi?"
    options:
      - "HTTP controller"
      - "CLI buyrug'i"
      - "Ilovani boshqaradigan test skripti"
      - "Ilova chaqiradigan to'lov provayderi yoki DB adapteri"
    answer: 3
    explain: "Primary (driving) aktorlar ilova bilan suhbatni boshlaydi: foydalanuvchi, test skripti, controller. Secondary (driven) aktorlarni esa ilovaning o'zi chaqiradi: DB, to'lov provayderi, SMS shlyuz."
  - q: "To'lov provayderi SDK'sini o'rashda port interfeysini kim belgilashi kerak?"
    options:
      - "Ilova (domen) ehtiyoji: port ilova tilida gapiradi, adapter esa SDK tilini unga tarjima qiladi"
      - "SDK: port SDK'ning barcha metodlarini takrorlashi kerak"
      - "DB sxemasi"
      - "Frontend jamoasi"
    answer: 0
    explain: "Agar port SDK'ning nusxasi bo'lsa, o'rash hech narsa bermaydi: provayder almashganda port ham o'zgaradi. Port ilovaga kerak bo'lgan minimal, domen tilidagi operatsiyalarni beradi (Martinning transmitter misolidagi kabi)."
  - q: "Qaysi holatda tashqi kutubxonani o'rash ortiqcha bo'lishi mumkin?"
    options:
      - "To'lov provayderi SDK'si uchun"
      - "Til darajasidagi barqaror, kam o'zgaradigan va keng tarqalgan kutubxona (masalan, `date-fns` funksiyasi yoki zod) uchun yupqa o'tkazgich yozish"
      - "SMS provayderi uchun"
      - "Ko'p joyda ishlatiladigan GPS treker protokoli uchun"
    answer: 1
    explain: "Har bir import'ni o'rash sayoz modullar va ortiqcha qatlam beradi. O'rash eng ko'p foyda beradigan joy - tez o'zgaradigan, almashtirilishi mumkin bo'lgan, tarmoqqa chiqadigan yoki test qilish qiyin bo'lgan tashqi tizimlar."
task:
  title: "To'lov provayderi SDK'sini port va adapter ortiga yashirish"
  prompt: |
    Quyidagi servis to'lov provayderining SDK'sini to'g'ridan-to'g'ri ishlatadi. SDK tiplari, tiyin/so'm aylantirish, provayder status satrlari va xato kodlari servis ichiga oqib kirgan. Kompaniya ikkinchi provayderni qo'shishni rejalashtirmoqda.

    1. Ilova nuqtai nazaridan `PaymentGateway` portini aniqlang: faqat ilovaga kerak bo'lgan operatsiyalar, domen tilida.
    2. SDK uchun adapter yozing: birliklar aylantirishi, status xaritasi va xatolarni domen xatolariga tarjima qilish faqat shu yerda bo'lsin.
    3. Servis faqat portga bog'liq bo'lsin.
    4. Test uchun xotiradagi fake adapter yozing.
    5. SDK'ning qaysi xatti-harakatlarini learning test bilan qayd qilish kerakligini yozing (masalan, idempotency key qayta ishlatilganda nima bo'ladi).
  lang: ts
  starter: |
    // Uchinchi tomon SDK (o'zgartirib bo'lmaydi)
    declare class PayzoneClient {
      constructor(opts: { apiKey: string });
      createCharge(req: {
        amount_tiyin: number;
        card_token: string;
        idempotency_key?: string;
      }): Promise<{ charge_id: string; state: "OK" | "PENDING_3DS" | "DECLINED"; decline_code?: string }>;
    }
    declare class PayzoneError extends Error {
      http_status: number;
      err_code: string;
    }

    export class RentalCheckoutService {
      private client = new PayzoneClient({ apiKey: process.env.PAYZONE_KEY ?? "" });

      async checkout(rentalId: string, amountSom: number, cardToken: string) {
        try {
          const res = await this.client.createCharge({
            amount_tiyin: Math.round(amountSom * 100),
            card_token: cardToken,
            idempotency_key: rentalId,
          });
          if (res.state === "DECLINED") {
            return { ok: false, reason: res.decline_code };
          }
          return { ok: res.state === "OK", chargeId: res.charge_id, needs3ds: res.state === "PENDING_3DS" };
        } catch (e) {
          if (e instanceof PayzoneError && e.http_status >= 500) {
            return { ok: false, reason: "provider_down" };
          }
          throw e;
        }
      }
    }
  solution: |
    // --- domain/payments.ts: port, ilova tilida ---
    export type ChargeRequest = Readonly<{
      reference: string; // idempotentlik uchun barqaror kalit
      amountTiyin: bigint;
      cardToken: string;
    }>;

    export type ChargeOutcome =
      | { kind: "succeeded"; chargeId: string }
      | { kind: "requires_3ds"; chargeId: string }
      | { kind: "declined"; reason: string };

    export class PaymentProviderUnavailableError extends Error {
      constructor(options?: ErrorOptions) {
        super("To'lov provayderi vaqtincha ishlamayapti", options);
        this.name = "PaymentProviderUnavailableError";
      }
    }

    export interface PaymentGateway {
      charge(req: ChargeRequest): Promise<ChargeOutcome>;
    }

    // --- infra/payzone-gateway.ts: adapter, SDK bilimi faqat shu yerda ---
    declare class PayzoneClient {
      constructor(opts: { apiKey: string });
      createCharge(req: {
        amount_tiyin: number;
        card_token: string;
        idempotency_key?: string;
      }): Promise<{ charge_id: string; state: "OK" | "PENDING_3DS" | "DECLINED"; decline_code?: string }>;
    }
    declare class PayzoneError extends Error {
      http_status: number;
      err_code: string;
    }

    export class PayzoneGateway implements PaymentGateway {
      constructor(private readonly client: PayzoneClient) {}

      async charge(req: ChargeRequest): Promise<ChargeOutcome> {
        let res: Awaited<ReturnType<PayzoneClient["createCharge"]>>;
        try {
          res = await this.client.createCharge({
            amount_tiyin: Number(req.amountTiyin),
            card_token: req.cardToken,
            idempotency_key: req.reference,
          });
        } catch (e: unknown) {
          if (e instanceof PayzoneError && e.http_status >= 500) {
            throw new PaymentProviderUnavailableError({ cause: e });
          }
          throw e;
        }
        switch (res.state) {
          case "OK":
            return { kind: "succeeded", chargeId: res.charge_id };
          case "PENDING_3DS":
            return { kind: "requires_3ds", chargeId: res.charge_id };
          case "DECLINED":
            return { kind: "declined", reason: res.decline_code ?? "unknown" };
        }
      }
    }

    // --- application/rental-checkout.ts: faqat portni biladi ---
    export class RentalCheckoutService {
      constructor(private readonly payments: PaymentGateway) {}

      checkout(rentalId: string, amountTiyin: bigint, cardToken: string): Promise<ChargeOutcome> {
        return this.payments.charge({ reference: `rental:${rentalId}`, amountTiyin, cardToken });
      }
    }

    // --- test/fake-payment-gateway.ts ---
    export class FakePaymentGateway implements PaymentGateway {
      readonly charges: ChargeRequest[] = [];
      constructor(private readonly next: ChargeOutcome = { kind: "succeeded", chargeId: "fake-1" }) {}

      async charge(req: ChargeRequest): Promise<ChargeOutcome> {
        this.charges.push(req);
        return this.next;
      }
    }
  solutionNotes: |
    - `PaymentGateway` porti ilova tilida: `reference`, `amountTiyin`, `ChargeOutcome`. Unda `PayzoneClient`, `state: "OK"` yoki `err_code` yo'q. Ikkinchi provayder yangi adapter sifatida qo'shiladi, servis o'zgarmaydi.
    - Birlik aylantirish (so'm -> tiyin, `Math.round` bilan kasr) servisdan yo'qoldi: summa endi butun tiyinda (`bigint`) keladi (44-dars). Adapter faqat SDK formatiga (`number`) aylantiradi.
    - Provayder statuslari discriminated union'ga tarjima qilindi. Starter'dagi `{ ok, reason, needs3ds }` noqonuniy kombinatsiyalarga yo'l qo'yardi (45-dars).
    - 5xx xatolar domen xatosiga `cause` bilan aylantirildi (47-dars). Boshqa xatolar o'zgarmay o'tadi: ular dasturchi yoki konfiguratsiya xatosi.
    - SDK konstruktori servis ichidan olib tashlandi: `process.env` o'qish va klientni yaratish kompozitsiya ildizida (NestJS modulida) bo'ladi.
    - Fake adapter testlarda tarmoqsiz ishlaydi va yuborilgan so'rovlarni yozib qoladi.
    - Learning test nomzodlari: bir xil idempotency key bilan ikkinchi so'rov nima qaytaradi (yangi charge yoki eski natija)? Juda katta summada `amount_tiyin` qanday ishlaydi? Tarmoq timeout'ida SDK nima tashlaydi? `DECLINED`da `decline_code` har doim bormi? Bu testlar sandbox'da ishlaydi va SDK yangilanganda qayta ishga tushiriladi.
  checklist:
    - "Servis SDK tiplari va konstruktorini import qilmaydi"
    - "Port ilova tilida, SDK metodlarining nusxasi emas"
    - "Birlik aylantirish, status xaritasi va xato tarjimasi faqat adapterda"
    - "Natija noqonuniy kombinatsiyalarsiz union"
    - "Testlar uchun tarmoqsiz fake adapter bor"
    - "SDK'ning noaniq xatti-harakatlari uchun learning test'lar ro'yxati tuzildi"
---

## Muammo

Transport parki tizimi uch yil oldin bitta SMS provayderi bilan boshlangan. Bugun loyihada `smsClient.sendSms(...)` 47 ta joyda chaqiriladi. Har bir joyda provayderning javob formati (`{ status: "0", msgid: ... }`), xato kodlari (`"-3"` - balans tugadi) va telefon formati (`998...`, plyussiz) qayta-qayta yozilgan. Provayder narxni oshirdi va boshqasiga o'tish kerak. Bu loyihaning eng katta va eng xavfli vazifasiga aylandi.

Ikkinchi hikoya: to'lov SDK'sining yangi major versiyasi chiqdi. Changelog'da "minor behavior changes" deyilgan. Jamoa yangiladi, testlar o'tdi (chunki ular SDK'ni mock qilgan edi), va production'da 3DS talab qiladigan to'lovlar endi `PENDING` emas, `REQUIRES_ACTION` qaytaradi. Bir kun davomida bunday to'lovlar "muvaffaqiyatsiz" deb belgilandi.

Ikkala holatda ham muammo tashqi kodning o'zida emas, balki u bilan bizning kodimiz orasida aniq **chegara** yo'qligida.

## Asosiy g'oya

Martin *Clean Code*ning chegaralar haqidagi bobida tashqi kod (uchinchi tomon kutubxonalar, ochiq kod paketlari, boshqa jamoalarning quyi tizimlari) bilan ishlashning bir nechta amaliyotini beradi.

### Tashqi interfeyslarni tizim bo'ylab uzatmang

Bobning asosiy kuzatuvi: kutubxona yaratuvchisi va undan foydalanuvchi o'rtasida tabiiy taranglik bor. Yaratuvchi iloji boricha ko'p auditoriyaga mos keladigan keng interfeysni xohlaydi. Foydalanuvchi esa o'z ehtiyojiga yo'naltirilgan tor interfeysni xohlaydi.

Martin buni Java'ning `Map` misolida ko'rsatadi. `Map` juda keng interfeysga ega: istalgan kod `clear()` bilan hammasini o'chirishi, istalgan turdagi obyektni qo'yishi mumkin. Agar sensorlar `Map`i tizim bo'ylab uzatilsa, har bir foydalanuvchi bu kenglikka va implementatsiyaga bog'lanadi. Agar `Map` interfeysi o'zgarsa (Martin Java 5 generiklari paydo bo'lganda shunday bo'lganini eslatadi), ko'p joyni o'zgartirish kerak. Yechim: `Map`ni `Sensors` klassi ichiga yashirish, u faqat ilovaga kerak bo'lgan operatsiyalarni (masalan, ID bo'yicha sensor olish) beradi.

Martin har bir `Map`ni o'rashni talab qilmaydi. Uning tavsiyasi aniqroq: chegara interfeyslarini (u `Map`ni misol qiladi) tizim bo'ylab erkin uzatmang, ularni ishlatadigan klass yoki yaqin klasslar oilasi ichida saqlang, va ularni public API'dan qaytarmang yoki argument sifatida qabul qilmang.

### Learning test'lar

Tashqi kutubxonani ishlatishdan oldin uni o'rganish kerak. Odatiy yo'l - hujjatni o'qish va to'g'ridan-to'g'ri production kodda tajriba qilish. Martin muqobilini taklif qiladi: **learning test'lar** - kutubxonaning xatti-harakatini tushunish uchun yozilgan kichik testlar. Ular kutubxonani biz ishlatmoqchi bo'lgan tarzda chaqiradi va natijani tekshiradi.

U log4j misolida ko'rsatadi: bir necha test orqali qanday sozlash kerakligi bosqichma-bosqich aniqlanadi, va natijada olingan bilim o'z logger klassiga yig'iladi.

Martin learning test'larning ikki foydasini ta'kidlaydi:

- **Ular deyarli bepul.** Kutubxonani baribir o'rganish kerak. Testlar esa bu o'rganishni aniq va qayta tekshiriladigan qiladi.
- **Ular kutubxona yangilanganda ogohlantiradi.** Yangi versiya chiqqanda learning test'larni ishga tushiring: xatti-harakat o'zgargan bo'lsa, buni production emas, testlar aytadi. Yuqoridagi `REQUIRES_ACTION` hikoyasi aynan shu bilan oldini olinardi.

### Hali mavjud bo'lmagan kodni ishlatish

Martin yana bir vaziyatni tasvirlaydi: radio aloqa tizimi ustida ishlagan jamoa "Transmitter" quyi tizimidan foydalanishi kerak edi, lekin uning API'si hali loyihalanmagan edi. Jamoa kutmadi. Ular o'zlari xohlagan interfeysni aniqladi (masalan, berilgan chastotada ma'lumot uzatish) va kodni shunga qarab yozdi. Haqiqiy API paydo bo'lganda, ular orasiga Adapter (GoF pattern'i) yozildi. Bu yondashuv o'z kodini o'z interfeysi orqali o'qiladigan qildi va fake implementatsiya bilan test qilish imkonini berdi.

### Toza chegaralar

Martin xulosasi: chegaralarda o'zgarishlar yuz beradi va yaxshi dizayn ularni katta qayta ishlashsiz qabul qiladi. Bizning nazoratimizda bo'lmagan kodga bog'liqlik kamroq bo'lsin, aks holda u bizni boshqaradi. Chegarani bir nechta joyda boshqaring: o'rash yoki Adapter orqali, shunda ilova kodi o'z tilida gapiradi.

## Chuqurroq: port va adapterlar

Alistair Cockburn 2005-yilda Hexagonal Architecture (Ports and Adapters) g'oyasini tasvirlagan. Uning maqsadi: ilovani foydalanuvchilar, boshqa dasturlar, avtomatik testlar yoki batch skriptlar teng ravishda boshqara olsin va u haqiqiy qurilmalar va ma'lumotlar bazalaridan izolyatsiyada ishlab chiqilsin va test qilinsin.

Asosiy tushunchalar:

- **Port** - ilova va tashqi dunyo o'rtasidagi maqsadli suhbat. U texnologiya bilan emas, maqsad bilan aniqlanadi: "to'lov olish", "xabar yuborish", "transport joylashuvini saqlash".
- **Adapter** - har bir portda turib, port interfeysi va aniq tashqi texnologiya (GUI, test harness, DB, SDK) orasida tarjima qiladi. Ilova yadrosi qarshi tomonda qaysi texnologiya turganini bilmaydi.
- **Primary (driving) tomon** - ilova bilan suhbatni boshlaydigan aktorlar: foydalanuvchi, HTTP controller, CLI, test skripti.
- **Secondary (driven) tomon** - ilovaning o'zi murojaat qiladigan aktorlar: DB, to'lov provayderi, SMS shlyuz.

Cockburn olti burchak shakli olti raqami bilan bog'liq emasligini ta'kidlaydi: u portlar uchun joy beradi va bir o'lchovli qatlamlar diagrammasidan uzoqlashtiradi. Uning maqolasida ko'rsatilgan asosiy foyda - ilovani to'liq izolyatsiyada ishlatish imkoni: primary tomonda test harness, secondary tomonda xotiradagi mock.

Martinning chegaralar haqidagi maslahati va Cockburn'ning port va adapterlari bir xil g'oyaning ikki darajasi: Martin klass darajasida ("Map'ni o'rang"), Cockburn arxitektura darajasida ("har bir tashqi suhbat - port"). Arxitektura tafsilotlarini 82-darsda ko'ramiz. Bu darsda e'tibor tashqi SDK'larni o'rashga.

### Port kimning tilida gapiradi

Eng ko'p uchraydigan xato: port SDK metodlarining nusxasi bo'lib qoladi.

```ts
// Yomon port: SDK'ning aks-sadosi
interface SmsPort {
  sendSms(params: { phone: string; text: string; originator: string; priority: 0 | 1 }): Promise<{
    status: string;
    msgid: string;
  }>;
}
```

Bu yerda `originator`, `priority`, `status: string` - provayder tushunchalari. Provayder almashganda port ham o'zgaradi va o'rash befoyda bo'ladi.

```ts
// Yaxshi port: ilova tili
export type PhoneNumber = string & { readonly __brand: "PhoneNumber" };

export type SmsResult =
  | { kind: "accepted"; messageId: string }
  | { kind: "rejected"; reason: "invalid_number" | "blocked" };

export interface DriverNotifier {
  notify(phone: PhoneNumber, text: string): Promise<SmsResult>;
}
```

Port ilovaga kerak bo'lgan narsani aytadi: haydovchini xabardor qilish. Adapter esa bilimni yashiradi (43-dars): provayder telefonni qaysi formatda kutadi, `"-3"` nima degani, qaysi xatolar vaqtinchalik.

### Learning test'lar amalda

TypeScript loyihasida learning test'lar alohida papkada (`test/learning/`) va alohida skript bilan ishga tushiriladi, chunki ular ko'pincha provayder sandbox'iga tarmoq orqali chiqadi:

```ts
import { describe, it, expect } from "vitest";
import { PayzoneClient } from "payzone-sdk";

const client = new PayzoneClient({ apiKey: process.env.PAYZONE_SANDBOX_KEY ?? "" });

describe("payzone-sdk: biz tayanadigan xatti-harakatlar", () => {
  it("bir xil idempotency_key bilan takroriy so'rov yangi charge yaratmaydi", async () => {
    const req = { amount_tiyin: 100_00, card_token: "tok_test_ok", idempotency_key: "learn-1" };
    const first = await client.createCharge(req);
    const second = await client.createCharge(req);
    expect(second.charge_id).toBe(first.charge_id);
  });

  it("3DS talab qiladigan karta PENDING_3DS qaytaradi", async () => {
    const res = await client.createCharge({ amount_tiyin: 100_00, card_token: "tok_test_3ds" });
    expect(res.state).toBe("PENDING_3DS");
  });
});
```

Bu testlar SDK'ni yangilashdan oldin CI'da ishga tushiriladi. Ular adapterimiz tayanadigan taxminlarni qayd etadi: agar taxmin buzilsa, adapter ham yangilanishi kerak.

Mock'lar bu vazifani bajara olmaydi: mock sizning taxminingizni takrorlaydi, haqiqiy kutubxonani tekshirmaydi. Shuning uchun fake adapter servis testlari uchun, learning test'lar esa adapter taxminlarini tekshirish uchun.

## Misol: GPS treker SDK'si

Yomon - SDK tiplari butun tizimga tarqalgan:

```ts
import { TrackerClient, type TrackerPacket } from "acme-tracker-sdk";

export class TripService {
  constructor(private readonly tracker: TrackerClient) {}

  async lastPosition(imei: string): Promise<TrackerPacket> {
    return this.tracker.getLastPacket(imei);
  }
}

// Controller, hisobotlar, React UI: packet.lat_e6 / 1e6, packet.spd_knots * 1.852, ...
```

Yaxshi - port ilova tilida, adapter SDK bilimini yashiradi:

```ts
// domain/positions.ts
export type Position = Readonly<{
  imei: string;
  lat: number;
  lng: number;
  speedKmh: number;
  recordedAt: Date;
}>;

export interface PositionSource {
  lastKnown(imei: string): Promise<Position | null>;
}

// infra/acme-position-source.ts
type AcmePacket = { imei: string; lat_e6: number; lng_e6: number; spd_knots: number; ts: number };
interface AcmeClient {
  getLastPacket(imei: string): Promise<AcmePacket | undefined>;
}

const KNOTS_TO_KMH = 1.852;

export class AcmePositionSource implements PositionSource {
  constructor(private readonly client: AcmeClient) {}

  async lastKnown(imei: string): Promise<Position | null> {
    const p = await this.client.getLastPacket(imei);
    if (!p) return null;
    return {
      imei: p.imei,
      lat: p.lat_e6 / 1e6,
      lng: p.lng_e6 / 1e6,
      speedKmh: p.spd_knots * KNOTS_TO_KMH,
      recordedAt: new Date(p.ts * 1000),
    };
  }
}
```

Nima o'zgardi va nega:

- **SDK tipi chegaradan o'tmaydi.** `TrackerPacket` faqat adapter ichida. Controller, hisobot va UI `Position` bilan ishlaydi.
- **Birliklar bir joyda.** Mikrogradus, tugun, Unix sekund - bularning hammasi adapterda tarjima qilinadi. Ilgari bu formulalar UI'da ham bor edi.
- **Ikkinchi treker ishlab chiqaruvchisi** yangi `PositionSource` implementatsiyasi sifatida qo'shiladi.
- **Test qilish oson.** `TripService` testida xotiradagi `PositionSource` ishlatiladi, SDK mock qilinmaydi.
- **SDK'ning `undefined`i `null`ga aylandi** - kichik, lekin ilova kelishuviga mos tarjima (46-dars).

## Qachon qo'llamaslik kerak

- **Barqaror, keng tarqalgan kutubxonalar.** `zod`, `date-fns`, `lodash` funksiyalari yoki Node standart kutubxonasi uchun yupqa o'tkazgich yozish sayoz modul (52-dars) beradi va hech narsa yashirmaydi. Ularni almashtirish ehtimoli past va ularning API'si tushunarli.
- **Framework'ni o'rashga urinish.** NestJS, React yoki Next.js'ni "agar almashtirsak" deb o'rash odatda framework'ning foydasini yo'qotadi va o'z "mini-framework"ingizni yaratadi. Framework bilan kelishing, faqat domen yadrosini undan mustaqil saqlang.
- **Eng kichik umumiy maxraj.** Ikki provayderni bitta portga keltirishda har birining kuchli imkoniyatlarini (masalan, birida bor batch yuborish) yo'qotish mumkin. Port ilova ehtiyojini aks ettirsin, provayderlarning kesishmasini emas.
- **Bitta joyda ishlatiladigan kutubxona.** Agar SDK faqat bitta modul ichida ishlatilsa va u modul o'zi chegaraga o'xshab ishlasa, alohida port ochish ortiqcha bo'lishi mumkin. Martin tavsiyasining mohiyati - tarqalib ketmaslik.
- **Learning test'larning narxi.** Ular sandbox, kalitlar va tarmoqni talab qiladi va sekin. Ularni har bir commit'da emas, SDK yangilanishida va vaqti-vaqti bilan (masalan, kechasi) ishga tushiring.

## Stack'da: NestJS va Node.js

- **NestJS'da port - abstrakt klass yoki token.** TS interfeyslari runtime'da yo'q, shuning uchun DI uchun `abstract class PaymentGateway` yoki `Symbol` token ishlating va modulda `{ provide: PaymentGateway, useClass: PayzoneGateway }` deb bog'lang (57-dars). Testda `useClass: FakePaymentGateway`.
- **Konfiguratsiya kompozitsiya ildizida.** SDK klientini `process.env` dan servis ichida yaratmang. NestJS `useFactory` bilan validatsiyalangan config'dan (86-dars) yarating.
- **Retry va timeout adapterda.** Vaqtinchalik xatolar uchun qayta urinish, `AbortSignal` bilan timeout (29-dars) va circuit breaker - adapterning ichki ishi. Bu exception masking (49-dars).
- **Xatolar tarjimasi adapterda.** Provayder xato kodlari domen xatolariga `cause` bilan aylansin (47-dars), shunda exception filter (48-dars) provayderni bilmaydi.
- **Webhook'lar - primary adapter.** To'lov provayderidan kelgan webhook controller'i ham adapter: imzoni tekshiradi, payload'ni zod bilan parse qiladi (45-dars) va domen hodisasiga aylantiradi.
- **`package.json`da versiyani qat'iy belgilang** va SDK yangilanishini alohida PR'da learning test'lar bilan birga qiling.

## Xulosa

- Tashqi kod sizning nazoratingizda emas. Uning interfeyslarini tizim bo'ylab uzatmang, bitta joyda yashiring.
- Port ilova tilida gapirsin, adapter tashqi tilni unga tarjima qilsin: birliklar, statuslar, xatolar.
- Learning test'lar kutubxonani o'rganishni qayd etadi va yangilanishda xatti-harakat o'zgarishini ushlaydi. Mock'lar buni qila olmaydi.
- API hali tayyor bo'lmasa, o'zingizga kerakli interfeysni yozing va keyin adapter bilan ulang.
- Barqaror kutubxonalar va framework'lar uchun o'rash ko'pincha ortiqcha. Eng ko'p foyda - tez o'zgaradigan, tarmoqqa chiqadigan va almashtirilishi mumkin bo'lgan tizimlarda.
