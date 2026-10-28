---
n: 88
slug: logging
title: "Toza logging: strukturali loglar va darajalar"
summary: "Log - bu kodning production'dagi hikoyasi, va u ham o'quvchi uchun yoziladi: tunda incident'ni tekshirayotgan dasturchi va log tizimidagi so'rov. Bu darsda strukturali (JSON) loglar, darajalarning ma'nosi, request id bilan kontekst, secret'larni redact qilish va loggerni biznes kodidan ajratishni Pino misolida ko'ramiz."
duration: 35
sources:
  - id: pino
    note: "Pino API hujjati: darajalar va ularning raqamli qiymatlari, mergingObject, child logger va bindings, redact, serializers (err), base, timestamp, fatal haqidagi ogohlantirish"
  - id: twelve-factor-logs
    note: "XI. Logs: loglar stdout'ga yoziladigan hodisalar oqimi, ularni yo'naltirish ilova emas, muhit vazifasi"
  - id: twelve-factor-config
    note: "III. Config: log darajasi kabi deploy'ga qarab o'zgaradigan sozlamalar config hisoblanadi"
quiz:
  - q: "Pino'da logger darajasi `info` qilib o'rnatilgan. Qaysi metodlar chiqish beradi?"
    options:
      - "Faqat `info`"
      - "`trace`, `debug` va `info`"
      - "Barcha metodlar"
      - "`info` (30), `warn` (40), `error` (50) va `fatal` (60)"
    answer: 3
    explain: "Pino'da darajalar raqamli: trace 10, debug 20, info 30, warn 40, error 50, fatal 60. O'rnatilgan darajadan past raqamli metodlar o'chiriladi."
  - q: "Quyidagi log qatorlaridan qaysi biri eng toza?"
    options:
      - "`logger.info(`Vehicle ${id} fuel ${fuel}% driver ${driverId}`)`"
      - "`logger.info({ vehicleId: id, fuelPercent: fuel, driverId }, \"fuel level low\")`"
      - "`console.log(\"fuel low\", id, fuel, driverId)`"
      - "`logger.info(JSON.stringify({ id, fuel, driverId }))`"
    answer: 1
    explain: "Strukturali maydonlar log tizimida filtrlanadi va agregatsiya qilinadi (`fuelPercent < 10`), xabar esa barqaror qoladi va bir xil hodisalarni guruhlash oson. Interpolyatsiya qilingan satr har safar boshqacha bo'ladi va uni parse qilish kerak."
  - q: "Payme webhook'i vaqtinchalik 503 qaytardi va kod 3 marta qayta urinib, to'rtinchisida muvaffaqiyatli bo'ldi. Qayta urinishlar qaysi darajada log qilinishi kerak?"
    options:
      - "`warn` - kutilmagan, lekin tizim o'zi bartaraf qilgan holat; agar barcha urinishlar muvaffaqiyatsiz bo'lsa, `error`"
      - "`fatal`"
      - "`error`, chunki 503 xato"
      - "Umuman log qilmaslik"
    answer: 0
    explain: "`error` odatda inson e'tibori kerak bo'lgan holat uchun. Muvaffaqiyatli tugagan retry `error` bo'lsa, alert'lar shovqinga aylanadi. `fatal` Pino'da jarayon to'xtashidan oldingi oxirgi xabar uchun va destination'ni sinxron flush qiladi."
  - q: "Xuddi bitta xato uchun log'da beshta `error` qatori bor: repository, service, controller, exception filter va global handler har biri uni log qilgan. Qaysi qoida buzilgan?"
    options:
      - "Log darajalari noto'g'ri tanlangan"
      - "Redact sozlanmagan"
      - "Xato bir joyda, uni boshqaradigan (handle qiladigan) chegarada log qilinishi kerak; oraliq qatlamlar kontekst qo'shib (`cause`) qayta otadi"
      - "Pino emas, Winston ishlatish kerak edi"
    answer: 2
    explain: "'Log and rethrow' anti-pattern'i bir hodisani bir necha marta, har xil kontekst bilan yozadi va incident paytida chalkashtiradi. Xato `cause` bilan o'raladi va bir marta, oxirgi chegarada log qilinadi (47, 48-darslar)."
  - q: "Pino'da `redact` opsiyasining to'g'ri ishlatilishi qaysi?"
    options:
      - "Foydalanuvchi so'rovidagi `redactFields` parametri bo'yicha yo'llarni dinamik belgilash"
      - "`redact: { paths: [\"req.headers.authorization\", \"*.password\", \"card.number\"], censor: \"[REDACTED]\" }` - yo'llar kodda qat'iy belgilanadi"
      - "Har bir log chaqiruvida maxfiy maydonlarni qo'lda o'chirish"
      - "Redact faqat production'da kerak emas"
    answer: 1
    explain: "Pino hujjati redact yo'llarini foydalanuvchi kiritishi bilan belgilashni qat'iy taqiqlaydi. Yo'llar konfiguratsiyada qat'iy bo'ladi, `censor` default'i `[Redacted]`."
  - q: "Nima uchun `logger.info(req.body)` yozish xavfli?"
    options:
      - "Chunki `req.body` har doim bo'sh"
      - "Chunki Pino obyektlarni log qila olmaydi"
      - "Chunki bu sekin"
      - "Chunki mergingObject'ning kalitlari log qatorining yuqori darajasiga yoziladi: tashqi ma'lumot `level`, `time`, `msg` kabi maydonlarni bosib yozishi va maxfiy ma'lumot oqib chiqishi mumkin"
    answer: 3
    explain: "Pino hujjati tashqi obyektni to'g'ridan-to'g'ri mergingObject sifatida bermaslikni va kerak bo'lsa uni ilova boshqaradigan kalit ostiga qo'yishni maslahat beradi. Umuman olganda, ishonchsiz ma'lumotni log qilmaslik afzal."
task:
  title: "console.log'larni strukturali va kontekstli logga aylantirish"
  prompt: |
    GPS ingest servisi `console.log` bilan log qiladi: xabarlar interpolyatsiya qilingan, darajalar yo'q, request id yo'q va to'lov tokeni logga tushadi.

    1. Pino logger yarating: daraja config'dan, maxfiy yo'llar redact qilinadi, `service` va `version` har bir qatorda.
    2. Har bir so'rov uchun child logger: `requestId` va `companyId` bilan.
    3. Xabarlarni barqaror qiling, o'zgaruvchi qiymatlarni maydonlarga ko'chiring.
    4. Darajalarni to'g'ri tanlang va xatoni bir marta, `err` kaliti bilan log qiling.
    5. Biznes funksiyasi Pino'ni bevosita import qilmasin.
  lang: ts
  starter: |
    export async function ingestBatch(
      requestId: string,
      companyId: string,
      paymentToken: string,
      points: Array<{ vehicleId: string; speedKmh: number }>,
      save: (p: { vehicleId: string; speedKmh: number }[]) => Promise<void>,
    ): Promise<void> {
      console.log("ingest start " + requestId + " company=" + companyId + " token=" + paymentToken);
      for (const p of points) {
        if (p.speedKmh > 200) {
          console.log("ERROR!!! bad speed " + p.speedKmh + " for " + p.vehicleId);
          continue;
        }
        console.log("point ok " + JSON.stringify(p));
      }
      try {
        await save(points.filter((p) => p.speedKmh <= 200));
        console.log("saved " + points.length);
      } catch (e) {
        console.log("save failed", e);
        throw e;
      }
    }
  solution: |
    // logging/logger.ts - infratuzilma
    import pino, { type Logger } from "pino";

    export function createRootLogger(level: string, version: string): Logger {
      return pino({
        level,
        base: { service: "telemetry-ingest", version },
        redact: {
          paths: ["paymentToken", "*.paymentToken", "req.headers.authorization", "req.headers.cookie"],
          censor: "[REDACTED]",
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      });
    }

    // telemetry/ports.ts - biznes kodi ko'radigan minimal interfeys
    export type LogFields = Record<string, string | number | boolean | null | undefined>;
    export interface AppLogger {
      debug(fields: LogFields, msg: string): void;
      info(fields: LogFields, msg: string): void;
      warn(fields: LogFields, msg: string): void;
    }

    // telemetry/ingest-batch.ts - biznes kodi
    export type GpsPoint = { vehicleId: string; speedKmh: number };

    const MAX_PLAUSIBLE_SPEED_KMH = 200;

    export async function ingestBatch(
      log: AppLogger,
      points: readonly GpsPoint[],
      save: (p: GpsPoint[]) => Promise<void>,
    ): Promise<{ saved: number; rejected: number }> {
      const valid = points.filter((p) => p.speedKmh <= MAX_PLAUSIBLE_SPEED_KMH);
      const rejected = points.length - valid.length;
      if (rejected > 0) {
        log.warn({ rejected, maxSpeedKmh: MAX_PLAUSIBLE_SPEED_KMH }, "implausible gps points dropped");
      }
      log.debug({ received: points.length }, "gps batch received");
      await save(valid);
      log.info({ saved: valid.length, rejected }, "gps batch ingested");
      return { saved: valid.length, rejected };
    }

    // http/ingest.handler.ts - chegara: child logger va xatoni bir marta log qilish
    import type { Logger } from "pino";
    import { ingestBatch, type GpsPoint } from "../telemetry/ingest-batch";

    export async function handleIngest(
      root: Logger,
      requestId: string,
      companyId: string,
      points: GpsPoint[],
      save: (p: GpsPoint[]) => Promise<void>,
    ): Promise<number> {
      const log = root.child({ requestId, companyId });
      try {
        await ingestBatch(log, points, save);
        return 202;
      } catch (err: unknown) {
        log.error({ err, points: points.length }, "gps batch ingest failed");
        return 500;
      }
    }
  solutionNotes: |
    - Xabarlar barqaror (`gps batch ingested`), o'zgaruvchi qiymatlar maydonlarda. Log tizimida `msg = "gps batch ingested" and rejected > 0` kabi so'rovlar ishlaydi.
    - `requestId` va `companyId` child logger bindings'ida: har bir qatorga avtomatik qo'shiladi, biznes kodi ularni bilmaydi va uzatmaydi.
    - To'lov tokeni biznes funksiyasiga umuman kirmaydi. Shunga qaramay, redact yo'llari xavfsizlik to'ri sifatida qo'yilgan: kimdir kelajakda uni log qilsa ham, `[REDACTED]` chiqadi.
    - Darajalar: noto'g'ri nuqtalar `warn` (tizim o'zi bartaraf qildi), har bir nuqta uchun log yo'q (shovqin edi), umumiy son `info`, tafsilot `debug`, muvaffaqiyatsizlik `error` va faqat bir marta, chegarada.
    - Xato `err` kaliti bilan beriladi: Pino'ning standart `err` serializer'i `type`, `message` va `stack`ni strukturali chiqaradi.
    - `AppLogger` interfeysi biznes kodini Pino'dan ajratadi va testda oddiy massivga yozadigan fake bilan almashtiriladi. Pino'ning `Logger` tipi bu interfeysga strukturaviy mos keladi.
    - Log darajasi va versiya config'dan keladi (86-dars), kodda qat'iy emas.
  checklist:
    - "console.log qolmagan"
    - "Xabar matnlari barqaror, qiymatlar maydonlarda"
    - "requestId har bir qatorda child logger orqali"
    - "Maxfiy maydonlar redact qilinadi"
    - "Xato bir marta, err kaliti bilan, chegarada log qilinadi"
    - "Biznes funksiyasi Pino'ni import qilmaydi"
---

## Muammo

Kechasi soat 3 da alert keldi: "Yoqilg'i hisobotlari bo'sh". Navbatchi dasturchi loglarni ochadi va quyidagini ko'radi:

```
saved 412
point ok {"vehicleId":"01A123BC","speedKmh":64}
ERROR!!! bad speed 240 for 01A777AA
Error: connection terminated
    at ...
save failed
saved 0
```

Bu qatorlar qaysi so'rovga tegishli? Qaysi kompaniya? `ERROR!!!` haqiqatan xatomi yoki kundalik hodisa? `connection terminated` va `save failed` bitta hodisami yoki ikkita? Soatiga 2 million qator yoziladigan tizimda `grep "save failed"` minglab natija beradi va ularning hech birida kontekst yo'q. Bundan tashqari, kimdir bir yil oldin `console.log("token=" + paymentToken)` yozgan va endi to'lov tokenlari log saqlash tizimida 90 kun turadi.

Logging ko'pincha "keyinroq to'g'rilaymiz" toifasidagi ish. Lekin u production'dagi tizimni tushunishning asosiy vositasi va u ham kod kabi o'quvchi uchun yoziladi.

## Asosiy g'oya

Toza logging uchta tamoyilga tayanadi.

**1. Log - bu hodisa, matn emas.** Har bir log qatori mashina o'qiy oladigan strukturali yozuv bo'lsin: barqaror xabar va nomlangan maydonlar. Pino aynan shunday ishlaydi: har bir chaqiruv bitta JSON qatorini chiqaradi (newline-delimited JSON), birinchi argument sifatida berilgan obyektning (hujjatda `mergingObject`) har bir kaliti log qatoriga ko'chiriladi, keyin esa xabar keladi:

```ts
import pino from "pino";

const logger = pino();
logger.info({ vehicleId: "01A123BC", fuelPercent: 8 }, "fuel level low");
// {"level":30,"time":1760950000000,"pid":4120,"hostname":"api-1","vehicleId":"01A123BC","fuelPercent":8,"msg":"fuel level low"}
```

**2. Darajalar ma'noga ega.** Daraja - bu "kimdir buni qachon o'qishi kerak" degan savolga javob. Pino'ning standart darajalari: `trace` (10), `debug` (20), `info` (30), `warn` (40), `error` (50), `fatal` (60). Logger darajasi o'rnatilganda undan past raqamli metodlar o'chiriladi.

**3. Log qayerga borishini ilova hal qilmaydi.** The Twelve-Factor App'ning loglar haqidagi tamoyiliga ko'ra ilova o'z chiqish oqimini boshqarmaydi va log fayllarini yozmaydi: har bir process o'z hodisalar oqimini stdout'ga yozadi, yig'ish va saqlashni esa ijro muhiti (Docker, Kubernetes, log agent) bajaradi. Log darajasi va formati esa deploy'ga qarab o'zgaradigan sozlama, ya'ni config (86-dars).

## Chuqurroq: darajalar, kontekst va xavfsizlik

### Darajalarni qanday tanlash

Pino darajalarning raqamli qiymatini beradi, lekin har bir jamoa ularning ma'nosini kelishib olishi kerak. Keng tarqalgan va amaliy kelishuv:

- **`fatal`** - jarayon davom eta olmaydi va to'xtayapti. Pino hujjati alohida ogohlantiradi: `fatal` destination'ni har doim sinxron flush qiladi, shuning uchun uni faqat jarayon tugashidan oldingi oxirgi xabarlar uchun ishlating.
- **`error`** - so'rov yoki vazifa muvaffaqiyatsiz bo'ldi va inson e'tibori kerak bo'lishi mumkin. Alert'lar odatda shu darajaga bog'lanadi, shuning uchun bu yerda shovqin qimmat.
- **`warn`** - kutilmagan, lekin tizim o'zi bartaraf qilgan holat: muvaffaqiyatli retry, eskirgan API ishlatilishi, noto'g'ri GPS nuqtasi tashlab yuborilgani.
- **`info`** - biznes uchun muhim hodisalar va hayot sikli: ilova start bo'ldi, buyurtma yaratildi, batch qayta ishlandi. Production'da odatda shu daraja yoqilgan.
- **`debug`** va **`trace`** - dasturchiga tafsilot. Production'da odatda o'chirilgan, kerak bo'lganda vaqtincha yoqiladi.

Foydali savol: "agar bu qator har kuni million marta chiqsa, kimdir uni o'qiydimi?" Har bir GPS nuqtasi uchun `info` qatori - shovqin. Batch uchun bitta `info` qatori sonlar bilan - signal.

### Barqaror xabar, o'zgaruvchan maydonlar

`logger.info(`Vehicle ${id} fuel ${fuel}%`)` har safar boshqa satr beradi. Log tizimida bu hodisalarni guruhlash, sanash va ular bo'yicha alert qo'yish qiyin. `logger.info({ vehicleId, fuelPercent }, "fuel level low")` esa bitta barqaror xabar va filtrlanadigan maydonlar beradi. Maydon nomlarini butun loyihada izchil saqlang: bir joyda `vehicleId`, boshqa joyda `vehicle_id`, uchinchisida `carId` bo'lsa, so'rovlar yarim natija beradi (18-dars, izchillik).

### Kontekst: child logger va request id

Incident'ni tekshirishda eng muhim savol: "bu qator qaysi so'rovga tegishli?" Pino'da `logger.child(bindings)` har bir log qatoriga qo'shiladigan kalit-qiymatlar bilan yangi logger yaratadi. Child logger ota-logger bilan bir xil oqimga yozadi va yaratilgan paytdagi darajani meros qiladi.

So'rov boshida `requestId` (klient yuborgan `X-Request-Id` yoki yangi UUID) bilan child logger yaratiladi va so'rov davomida ishlatiladi. Shunda bitta so'rovning barcha qatorlarini bitta filtr bilan topish mumkin. Biznes kodi `requestId`ni parametr sifatida uzatmasligi kerak, u faqat logger oladi.

### Xatolarni log qilish

Pino'ning default serializer'lari ichida `err` bor: `Error` obyekti `err` kaliti ostida berilsa (yoki to'g'ridan-to'g'ri birinchi argument sifatida), u `type`, `message` va `stack` bilan strukturali chiqariladi. `logger.error(e)` yoki `logger.error({ err: e }, "...")` - to'g'ri. `logger.error("failed: " + e)` esa stack'ni yo'qotadi.

Yana muhimroq qoida: **xatoni bir marta log qiling**. Har bir qatlam `catch` qilib, log yozib, qayta otsa, bitta hodisa beshta `error` qatoriga aylanadi. To'g'ri yondashuv: oraliq qatlamlar xatoni kontekst bilan o'raydi (`new Error("...", { cause })`, 47-dars) va qayta otadi, xatoni haqiqatan boshqaradigan chegara (exception filter, job runner) esa uni bir marta log qiladi (48-dars).

### Maxfiy ma'lumot va ishonchsiz kirish

Pino'ning `redact` opsiyasi berilgan yo'llardagi qiymatlarni chiqishdan olib tashlaydi yoki almashtiradi. Yo'llar JavaScript nuqta va qavs notatsiyasida yoziladi, `censor` default'i `[Redacted]`, `remove: true` esa kalitni butunlay o'chiradi. Hujjat qat'iy ogohlantiradi: redact yo'llarini hech qachon foydalanuvchi kiritishi bilan belgilamang.

Ikkinchi xavf: tashqi obyektni to'g'ridan-to'g'ri log qilish. Pino hujjatiga ko'ra `mergingObject`ning yuqori darajadagi kalitlari log qatorining ildiziga yoziladi va `level`, `time`, `msg` kabi maydonlar bilan to'qnashishi mumkin. `logger.info(req.body)` o'rniga, agar kerak bo'lsa, `logger.info({ body: sanitized }, "...")`. Umuman olganda, hujjat ishonchsiz ma'lumotni zarurat bo'lmasa log qilmaslikni maslahat beradi. Shaxsiy ma'lumotlar (telefon raqami, haydovchi pasporti, aniq GPS koordinatalari) ham shu toifaga kiradi.

### Performance

Pino tez bo'lish uchun yaratilgan va bu dizayn qarorlarida ko'rinadi. Masalan, hujjat vaqtni process ichida formatlash performance'ga sezilarli ta'sir qilishini ogohlantiradi. Pretty formatlash (`pino-pretty`) dev muhitida transport sifatida ishlatiladi, production'da esa xom JSON stdout'ga ketadi. O'chirilgan darajadagi chaqiruvlar arzon, lekin argumentlarni tayyorlash narxi qoladi: `logger.debug({ payload: JSON.stringify(bigObject) })` darajadan qat'i nazar stringify qiladi. Qimmat tayyorlash uchun `logger.isLevelEnabled("debug")` tekshiruvi bor.

## Misol: to'lov webhook'i

Yomon variant:

```ts
export async function handlePaymeWebhook(body: Record<string, unknown>, apply: () => Promise<void>) {
  console.log("webhook received", body);
  try {
    await apply();
    console.log("OK!!!");
  } catch (e) {
    console.error("ERROR " + e);
    throw e;
  }
}
```

Muammolar: butun tana (karta ma'lumotlari, token) logga tushadi, darajalar yo'q, kontekst (qaysi buyurtma, qaysi tranzaksiya) yo'q, `"ERROR " + e` stack'ni yo'qotadi, va `throw e` dan keyin yuqori qatlam xatoni yana log qiladi.

Yaxshi variant:

```ts
import type { Logger } from "pino";

export type PaymeWebhook = { transactionId: string; orderId: string; amountTiyin: number; state: number };

export async function handlePaymeWebhook(
  log: Logger,
  webhook: PaymeWebhook,
  apply: (w: PaymeWebhook) => Promise<"applied" | "duplicate">,
): Promise<void> {
  const wlog = log.child({ transactionId: webhook.transactionId, orderId: webhook.orderId });
  wlog.info({ state: webhook.state, amountTiyin: webhook.amountTiyin }, "payme webhook received");

  const outcome = await apply(webhook);
  if (outcome === "duplicate") {
    wlog.warn("payme webhook already applied, ignored");
    return;
  }
  wlog.info("payme webhook applied");
}
```

Nima o'zgardi:

- **Faqat kerakli maydonlar.** Tana emas, ma'noli va xavfsiz maydonlar log qilinadi. Webhook allaqachon parse qilingan tip sifatida keladi (89-dars).
- **Kontekst child logger'da.** `transactionId` va `orderId` har bir qatorda, ularni har bir chaqiruvga yozish shart emas.
- **Takroriy webhook - `warn`.** Bu xato emas, provayder qayta yubordi va idempotentlik ishladi (87-dars). Lekin uning tez-tez uchrashi signal.
- **`try/catch` yo'q.** Xato yuqoriga ketadi va exception filter uni bir marta, request id bilan log qiladi.

## Qachon qo'llamaslik kerak

- **CLI va bir martalik skriptlar.** Odam terminalda o'qiydigan migratsiya skripti uchun JSON log noqulay. Oddiy, odam uchun matn yoki `pino-pretty` yetarli.
- **Log o'rniga metrika yoki trace kerak bo'lganda.** "So'rovlar soni", "o'rtacha kechikish", "xatolar ulushi" - bular metrikalar. Ularni har bir so'rov uchun log qatoridan hisoblash qimmat va sekin. Taqsimlangan so'rovning yo'lini kuzatish uchun esa tracing (OpenTelemetry) kerak. Log hamma narsaning o'rnini bosmaydi.
- **Har bir funksiyaga kirish va chiqish logi.** "entering calculateRefund", "exiting calculateRefund" - bu debugger'ning ishi. Bunday loglar kodni o'qishni qiyinlashtiradi va log hajmini oshiradi.
- **Biznes audit uchun application log.** "Kim, qachon, qaysi buyurtmani bekor qildi" - bu yo'qolmasligi kerak bo'lgan ma'lumot. Application loglar sampling, saqlash muddati va daraja filtri bilan yo'qolishi mumkin. Audit uchun bazada alohida jadval ishonchliroq.
- **Har bir domen klassiga logger inject qilish.** Sof domen funksiyasi (`calculateRefund`) log yozmasligi kerak: u natija qaytaradi, chaqiruvchi esa nimani log qilishni hal qiladi. Log - bu yon ta'sir (24-dars).

## Stack'da: NestJS va nestjs-pino

NestJS'ning o'rnatilgan `Logger`i matn formatida yozadi. Strukturali loglar uchun keng tarqalgan tanlov - `nestjs-pino` paketi, u ichida `pino-http` ishlatadi:

```ts
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

function requestId(req: IncomingMessage, res: ServerResponse): string {
  const incoming = req.headers["x-request-id"];
  const id = typeof incoming === "string" && incoming.length <= 64 ? incoming : randomUUID();
  res.setHeader("X-Request-Id", id);
  return id;
}

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? "info", // real loyihada validatsiyalangan config'dan (86-dars)
        genReqId: requestId,
        redact: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.cardNumber"],
        customLogLevel: (_req, res, err) =>
          err || res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
      },
    }),
  ],
})
export class AppModule {}
```

- **`genReqId`** - `pino-http` hujjatiga ko'ra so'rov id'sini yaratadigan funksiya. Default'da u oddiy butun son ishlatadi, bu bir nechta instance bo'lganda yaroqsiz. Kiruvchi `X-Request-Id`ni qabul qilishda uzunligini cheklang: bu ham ishonchsiz kirish.
- **`customLogLevel`** - javob status kodiga qarab daraja: 4xx `warn`, 5xx `error`. Shunda 404'lar `error` alert'larini to'ldirmaydi.
- **`bufferLogs: true`** bilan `NestFactory.create` va `app.useLogger(app.get(Logger))` - Nest'ning o'z loglarini ham Pino orqali chiqaradi.
- **`PinoLogger`ni inject qilish** - `nestjs-pino` README'siga ko'ra u AsyncLocalStorage orqali so'rov kontekstini istalgan qatlamda log qatorlariga avtomatik qo'shadi, ya'ni `requestId`ni servislar orqali uzatish shart emas.
- **Exception filter'da bir marta log.** 5xx xatolarni filter'da `err` bilan log qiling, servislarda esa log qilmasdan qayta oting.

## Xulosa

- Log - strukturali hodisa: barqaror xabar va nomlangan maydonlar. Interpolyatsiya qilingan satrlardan voz keching.
- Darajalar ma'noga ega: `error` inson e'tibori uchun, `warn` tizim bartaraf qilgan holat uchun, `info` muhim hodisalar uchun, `fatal` faqat jarayon to'xtashidan oldin.
- Har bir so'rov child logger orqali `requestId` bilan. Biznes kodi kontekstni uzatmaydi.
- Xatoni bir marta, `err` kaliti bilan, uni boshqaradigan chegarada log qiling.
- Maxfiy ma'lumotni redact qiling, ishonchsiz obyektni to'g'ridan-to'g'ri log qilmang. Ilova stdout'ga yozadi, log darajasi esa config.
