---
n: 86
slug: konfiguratsiya
title: "Konfiguratsiya va muhit: validatsiyalangan config"
summary: "Konfiguratsiya - deploy'lar orasida o'zgaradigan hamma narsa. Uni koddan ajratish, start paytida bir marta parse qilish va ilovaning qolgan qismiga tiplangan, o'zgarmas obyekt sifatida berish ko'plab \"faqat production'da\" xatolarini yo'q qiladi. Bu darsda 12-factor tamoyili, zod bilan env validatsiyasi va NestJS ConfigModule'ni ko'ramiz."
duration: 35
sources:
  - id: twelve-factor-config
    note: "III. Config: konfiguratsiya ta'rifi, open source litmus testi, env o'zgaruvchilari va \"environments\" guruhlashning tanqidi"
  - id: zod-docs
    note: "API bo'limi (z.coerce, z.url, z.stringbool, z.enum, .default) va error formatting (z.prettifyError)"
  - id: nestjs-docs
    note: "Configuration bo'limi: ConfigModule.forRoot, validate funksiyasi, validationSchema, ConfigService.get infer bilan"
quiz:
  - q: "12-factor'ning konfiguratsiya ta'rifiga ko'ra quyidagilardan qaysi biri config EMAS?"
    options:
      - "Ma'lumotlar bazasi ulanish satri"
      - "Payme merchant secret"
      - "NestJS'dagi modul va route'lar tuzilishi"
      - "Production va staging uchun turli Redis hostlari"
    answer: 2
    explain: "12-factor config'ni deploy'lar orasida o'zgarishi ehtimoli bor narsa deb ta'riflaydi. Ilovaning ichki ulanishi (route'lar, modullar) deploy'ga qarab o'zgarmaydi, shuning uchun u kodda qoladi."
  - q: "`z.coerce.boolean()` bilan `FEATURE_FUEL_ALERTS=false` env qiymati parse qilindi. Natija nima bo'ladi va nima uchun?"
    options:
      - "`false`, chunki zod satrni tushunadi"
      - "Validatsiya xatosi"
      - "`undefined`"
      - "`true`, chunki coerce `Boolean(input)` qiladi va bo'sh bo'lmagan har qanday satr truthy; env bayroqlari uchun `z.stringbool()` kerak"
    answer: 3
    explain: "Bu klassik tuzoq. `Boolean(\"false\")` true. Zod 4'dagi `z.stringbool()` \"true\"/\"false\", \"1\"/\"0\", \"yes\"/\"no\", \"on\"/\"off\" kabi satrlarni to'g'ri parse qiladi."
  - q: "Kod bo'ylab 40 ta joyda `process.env.X` o'qiladi. Ulardan biri `Number(process.env.GPS_BATCH)` va env'da qiymat yo'q. Asosiy muammo qaysi?"
    options:
      - "Xato ilova start bo'lganda emas, shu kod birinchi marta ishlaganda (ehtimol tunda, production'da) va `NaN` sifatida jimgina paydo bo'ladi"
      - "`process.env` sekin ishlaydi"
      - "TypeScript `process.env`ni qo'llab-quvvatlamaydi"
      - "Muammo yo'q, `Number(undefined)` 0 qaytaradi"
    answer: 0
    explain: "`Number(undefined)` NaN beradi, va NaN bilan ishlaydigan kod ko'pincha xato bermaydi, noto'g'ri natija beradi. Start paytidagi bitta validatsiya bu xatoni deploy vaqtiga ko'chiradi."
  - q: "12-factor nega config'ni `development`, `staging`, `production` kabi nomlangan guruhlarga yig'ishni tanqid qiladi?"
    options:
      - "Chunki bu nomlar standart emas"
      - "Chunki har bir yangi deploy yangi guruh talab qiladi va bu kombinatorik portlashga olib keladi; har bir env o'zgaruvchisi mustaqil, ortogonal sozlama bo'lishi kerak"
      - "Chunki production'da faqat bitta muhit bo'ladi"
      - "Chunki env o'zgaruvchilari guruhlarni qo'llab-quvvatlamaydi"
    answer: 1
    explain: "Maqola nomlangan muhitlar toza masshtablanmasligini aytadi. `if (env === \"staging\")` kabi shartlar kodga tarqaladi; o'rniga har bir xatti-harakatni alohida sozlama boshqarsin."
  - q: "Domen klassi `TariffCalculator` konstruktorida `ConfigService`ni inject qilib, `this.config.get(\"PRO_RATE\")` o'qiydi. Yaxshiroq yechim qaysi?"
    options:
      - "`process.env.PRO_RATE`ni to'g'ridan-to'g'ri o'qish"
      - "Har bir chaqiruvda config faylni qayta o'qish"
      - "Kalkulyatorga faqat kerakli qiymatlarni (`proRatePerKm: number`) konstruktor orqali berish, config'ni o'qish va validatsiya qilishni chegarada qoldirish"
      - "Qiymatni kodga hardcode qilish"
    answer: 2
    explain: "Domen kodi config manbasini bilmasligi kerak. U tiplangan qiymat oladi, shunda testda oddiy son bilan yaratiladi va config kalit nomi o'zgarsa, domen o'zgarmaydi."
  - q: "Qaysi holatda `.default()` qo'yish xavfli?"
    options:
      - "`PORT` uchun 3000"
      - "`DATABASE_URL` uchun `postgres://localhost:5432/dev`, chunki production'da o'zgaruvchi unutilsa, ilova xato bermasdan noto'g'ri bazaga ulanishga urinadi yoki dev ma'lumotlari bilan ishlaydi"
      - "`LOG_LEVEL` uchun `info`"
      - "`GPS_INGEST_BATCH_SIZE` uchun 500"
    answer: 1
    explain: "Default xavfsiz va har qanday muhitda to'g'ri bo'lgan qiymatlar uchun. Muhitga xos manzil va secret'lar uchun default qo'yish validatsiyaning maqsadini yo'qotadi."
task:
  title: "Tarqoq process.env'ni bitta validatsiyalangan config'ga yig'ish"
  prompt: |
    Quyidagi NestJS servislarida `process.env` turli joylarda o'qiladi, son va boolean'larga qo'lda aylantiriladi va ba'zi qiymatlar yo'qligi faqat runtime'da ma'lum bo'ladi.

    1. Barcha env o'zgaruvchilari uchun bitta zod sxemasi yozing: tiplar, chegaralar va faqat xavfsiz default'lar bilan.
    2. Config'ni start paytida bir marta parse qiling. Xato bo'lsa, barcha muammolarni bitta xabarda chiqarib, jarayonni to'xtating.
    3. Natijani muzlatilgan, tiplangan obyekt sifatida NestJS DI orqali bering.
    4. Domen servislari faqat o'zlariga kerakli qiymatlarni olsin.
  lang: ts
  starter: |
    import { Injectable } from "@nestjs/common";

    @Injectable()
    export class TelemetryIngestService {
      private readonly batch = parseInt(process.env.GPS_BATCH || "500");
      private readonly alerts = process.env.FUEL_ALERTS == "true";

      shouldFlush(buffered: number): boolean {
        return buffered >= this.batch;
      }
      alertsEnabled(): boolean {
        return this.alerts;
      }
    }

    @Injectable()
    export class PaymentsClient {
      async charge(orderId: string, amount: number): Promise<void> {
        const res = await fetch(process.env.PAYME_URL + "/receipts", {
          method: "POST",
          headers: { "X-Auth": process.env.PAYME_ID + ":" + process.env.PAYME_KEY },
          body: JSON.stringify({ orderId, amount }),
          signal: AbortSignal.timeout(Number(process.env.PAYME_TIMEOUT_MS)),
        });
        if (!res.ok) throw new Error("payment failed");
      }
    }
  solution: |
    // config/app-config.ts
    import { z } from "zod";

    const EnvSchema = z.object({
      NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
      PORT: z.coerce.number().int().min(1).max(65535).default(3000),
      GPS_BATCH: z.coerce.number().int().min(1).max(10_000).default(500),
      FUEL_ALERTS: z.stringbool().default(false),
      PAYME_URL: z.url({ protocol: /^https$/ }),
      PAYME_ID: z.string().min(1),
      PAYME_KEY: z.string().min(16),
      PAYME_TIMEOUT_MS: z.coerce.number().int().min(100).max(30_000).default(5_000),
    });

    export type AppConfig = Readonly<{
      env: "development" | "test" | "production";
      port: number;
      telemetry: Readonly<{ batchSize: number; fuelAlertsEnabled: boolean }>;
      payme: Readonly<{ baseUrl: string; merchantId: string; key: string; timeoutMs: number }>;
    }>;

    export function loadConfig(source: Record<string, string | undefined>): AppConfig {
      const result = EnvSchema.safeParse(source);
      if (!result.success) {
        throw new Error("Konfiguratsiya xato:\n" + z.prettifyError(result.error));
      }
      const e = result.data;
      return Object.freeze({
        env: e.NODE_ENV,
        port: e.PORT,
        telemetry: Object.freeze({ batchSize: e.GPS_BATCH, fuelAlertsEnabled: e.FUEL_ALERTS }),
        payme: Object.freeze({
          baseUrl: e.PAYME_URL,
          merchantId: e.PAYME_ID,
          key: e.PAYME_KEY,
          timeoutMs: e.PAYME_TIMEOUT_MS,
        }),
      });
    }

    export const APP_CONFIG = Symbol("APP_CONFIG");

    // config/config.module.ts
    import { Global, Module } from "@nestjs/common";

    @Global()
    @Module({
      providers: [{ provide: APP_CONFIG, useFactory: () => loadConfig(process.env) }],
      exports: [APP_CONFIG],
    })
    export class AppConfigModule {}

    // telemetry/telemetry-ingest.service.ts
    import { Inject, Injectable } from "@nestjs/common";

    export type TelemetrySettings = AppConfig["telemetry"];

    @Injectable()
    export class TelemetryIngestService {
      constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

      private get settings(): TelemetrySettings {
        return this.config.telemetry;
      }
      shouldFlush(buffered: number): boolean {
        return buffered >= this.settings.batchSize;
      }
      alertsEnabled(): boolean {
        return this.settings.fuelAlertsEnabled;
      }
    }

    // payments/payments.client.ts
    @Injectable()
    export class PaymentsClient {
      constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

      async charge(orderId: string, amount: number): Promise<void> {
        const { baseUrl, merchantId, key, timeoutMs } = this.config.payme;
        const res = await fetch(new URL("/receipts", baseUrl), {
          method: "POST",
          headers: { "X-Auth": `${merchantId}:${key}`, "content-type": "application/json" },
          body: JSON.stringify({ orderId, amount }),
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!res.ok) throw new Error(`Payme javobi ${res.status}`);
      }
    }
  solutionNotes: |
    - Barcha env o'zgaruvchilari bitta sxemada: ro'yxatni ko'rib, ilova nimaga muhtojligini bir qarashda bilish mumkin. `.env.example` shu sxemadan yoziladi.
    - `parseInt(... || "500")` va `== "true"` o'rniga `z.coerce.number()` chegaralar bilan va `z.stringbool()`. `FUEL_ALERTS=1` yoki `yes` ham endi to'g'ri ishlaydi.
    - Default faqat xavfsiz qiymatlarga: port, batch, timeout. `PAYME_URL` va kalitlarda default yo'q: ular yo'q bo'lsa ilova start bo'lmaydi.
    - `z.prettifyError` barcha xatolarni birdaniga ko'rsatadi: deploy qiluvchi uchta o'zgaruvchini uchta urinishda emas, bitta urinishda tuzatadi.
    - Env nomlari (`PAYME_KEY`) va ilova ichidagi nomlar (`payme.key`) ajratildi. Env nomini o'zgartirish faqat `loadConfig`ga tegadi.
    - `loadConfig` sof funksiya: testda `loadConfig({ ... })` bilan chaqiriladi, `process.env`ni o'zgartirish shart emas.
    - Config moduli global, chunki u haqiqiy infratuzilma (83-darsdagi istisno). Domen modullari esa global emas.
  checklist:
    - "Kodda loadConfig'dan tashqari process.env o'qilmaydi"
    - "Son va boolean'lar zod orqali, chegaralar bilan parse qilinadi"
    - "Secret va manzillarda default yo'q"
    - "Xato bo'lsa, ilova start paytida barcha muammolarni ko'rsatib to'xtaydi"
    - "Config obyekti muzlatilgan va tiplangan"
    - "Domen kodi faqat o'ziga kerakli qiymatlarni ko'radi"
---

## Muammo

Juma kuni kechqurun yangi versiya production'ga chiqdi. Ilova muvaffaqiyatli start bo'ldi, health check yashil. Ikki soatdan keyin birinchi mijoz to'lov qilmoqchi bo'ladi va xato oladi: `TypeError: Failed to parse URL from undefined/receipts`. Ma'lum bo'ladiki, `PAYME_URL` o'zgaruvchisi yangi Kubernetes manifest'iga qo'shilmagan. Ilova bu haqda bilmagan, chunki `process.env.PAYME_URL` faqat to'lov kodida, birinchi to'lov paytida o'qiladi.

Xuddi shunday xatolarning boshqa variantlari ham tanish:

- `parseInt(process.env.GPS_BATCH)` env'da qiymat yo'q bo'lsa `NaN` beradi, va `buffered >= NaN` hech qachon true bo'lmaydi: buffer to'xtovsiz o'sadi.
- `process.env.FUEL_ALERTS == "true"` deploy qiluvchi `FUEL_ALERTS=1` yozsa false bo'ladi.
- `if (process.env.NODE_ENV === "staging")` shartlari kodga tarqalgan va yangi `preprod` muhiti qo'shilganda ularning yarmi unutiladi.

Umumiy sabab: konfiguratsiya ilovaning **chegarasida emas, ichida** o'qiladi, va u tekshirilmagan satrlar to'plami sifatida yashaydi.

## Asosiy g'oya

The Twelve-Factor App'ning uchinchi tamoyili ikkita narsani aytadi.

**Birinchisi - config nima.** Config - bu deploy'lar (staging, production, dasturchining lokal muhiti) orasida o'zgarishi ehtimoli bor hamma narsa: baza va boshqa backing servislarga ulanishlar, tashqi servislarning kalitlari, deploy'ga xos hostname'lar. Ilovaning ichki ulanishi (route'lar, modullar o'rtasidagi bog'liqlik) config emas, chunki u deploy'ga qarab o'zgarmaydi. Maqola oddiy litmus testini beradi: kod bazasini istalgan paytda hech qanday credential'ni oshkor qilmasdan open source qilish mumkinmi?

**Ikkinchisi - qayerda saqlash.** 12-factor config'ni environment o'zgaruvchilarida saqlashni taklif qiladi: ularni kodga tegmasdan deploy'lar orasida o'zgartirish oson, ular repo'ga tasodifan commit qilinishi ehtimoli kam va ular til hamda OS'dan mustaqil standart.

Clean code nuqtai nazaridan bunga uchinchi qadamni qo'shamiz: **config'ni chegarada bir marta parse qiling**. Bu Alexis King'ning "Parse, don't validate" g'oyasining (45-dars) aniq qo'llanilishi: ilova start bo'lganda `process.env`ning satrlari tiplangan, tekshirilgan, o'zgarmas obyektga aylantiriladi. Agar aylantirish muvaffaqiyatsiz bo'lsa, ilova start bo'lmaydi. Shundan keyin ilovaning hech bir qismi `process.env`ni ko'rmaydi.

## Chuqurroq: dizayn qarorlari

### "Environments" guruhlash muammosi

12-factor maqolasi alohida tanqid qiladigan naqsh: config'ni nomlangan guruhlarga (`development`, `test`, `production`) yig'ish. Maqolaga ko'ra bu toza masshtablanmaydi: har bir yangi deploy yangi nom talab qiladi, dasturchilar o'z variantlarini qo'shadi va kombinatorik portlash yuzaga keladi. Uning o'rniga har bir env o'zgaruvchisi boshqalaridan mustaqil, ortogonal sozlama bo'lishi kerak.

Kodda bu shunday ko'rinadi: `if (env === "production") enableFuelAlerts()` yomon, `if (config.telemetry.fuelAlertsEnabled)` yaxshi. Birinchisi xatti-harakatni muhit nomiga bog'laydi, ikkinchisi esa har bir xatti-harakatni mustaqil boshqarishga imkon beradi. `NODE_ENV` o'zi foydali, lekin u biznes xatti-harakatini emas, faqat texnik rejimni (masalan, pretty log) boshqarsin.

### Fail fast

Validatsiya start paytida bo'lishi kerak, chunki shu payt deploy qiluvchi kuzatib turadi va orkestrator (Kubernetes, ECS) yangi versiyani "tayyor" deb belgilamaydi. Xato bo'lsa, eski versiya ishlashda davom etadi. Runtime'da birinchi ishlatilganda aniqlangan xato esa foydalanuvchiga tushadi.

Muhim tafsilot: barcha xatolarni **birdaniga** ko'rsating. Uchta o'zgaruvchi yo'q bo'lsa, deploy qiluvchi uchta qayta deploy qilmasligi kerak.

### Zod bilan env parse qilish

Zod 4'da env uchun foydali bir nechta vosita bor:

- **`z.coerce.number()`** - kirishni `Number(input)` bilan aylantiradi. `.int().min().max()` bilan chegaralang. Diqqat: `Number("")` 0 ga teng, shuning uchun bo'sh qator 0 bo'lib qoladi. Agar 0 noto'g'ri qiymat bo'lsa, `.min(1)` uni ushlaydi.
- **`z.coerce.boolean()` - env uchun tuzoq.** U `Boolean(input)` qiladi, va `"false"` bo'sh bo'lmagan satr bo'lgani uchun `true` bo'ladi. Env bayroqlari uchun **`z.stringbool()`** ishlating: u "true"/"false", "1"/"0", "yes"/"no", "on"/"off" kabi qiymatlarni to'g'ri tushunadi.
- **`z.url()`** - URL formatini tekshiradi, `protocol` opsiyasi bilan sxemani ham cheklash mumkin.
- **`z.enum([...])`** - cheklangan qiymatlar to'plami, masalan `LOG_LEVEL`.
- **`.default(value)`** - kirish `undefined` bo'lganda ishlatiladi.
- **`z.prettifyError(error)`** - barcha muammolarni yo'l bilan birga o'qiladigan matnga aylantiradi.

### Default'lar siyosati

Default faqat har qanday muhitda xavfsiz va to'g'ri bo'lgan qiymatlar uchun: port, timeout, batch hajmi, log darajasi. Muhitga xos manzillar va secret'lar uchun default qo'ymang. `DATABASE_URL` uchun `localhost` default production'da jim xatoga aylanadi: ilova start bo'ladi, lekin noto'g'ri joyga ulanadi yoki ulanmaydi va sababini topish qiyin.

### Config shakli va domen

Env nomlari tekis va katta harfli (`PAYME_TIMEOUT_MS`), chunki bu env'ning cheklovi. Ilova ichida esa config'ni ma'noli guruhlarga ajratish o'qishni osonlashtiradi: `config.payme.timeoutMs`. Domen kodi esa config obyektini ham ko'rmasligi kerak: `TariffCalculator` `ConfigService`ni emas, `ratePerKmUzs: number`ni oladi. Bu 81-darsdagi dependency rule: config o'qish - tashqi doiraning ishi.

### Secret'lar

Secret'lar ham config, lekin ularga qo'shimcha talablar bor: ular logga chiqmasligi kerak (88-dars, redact), xato xabarlarida qiymati ko'rsatilmasligi kerak (zod xatosi faqat yo'l va sababni aytadi, bu yaxshi) va ularni ko'pincha Vault, AWS Secrets Manager yoki Kubernetes Secret orqali env'ga yuklash mumkin. Ilova uchun bu farq qilmaydi: u baribir chegarada bitta obyekt oladi.

## Misol: tarqoq o'qishdan bitta parse'ga

Yomon variant:

```ts
export class FuelAlertService {
  async check(vehicleId: string, fuelPercent: number): Promise<void> {
    if (process.env.NODE_ENV !== "production") return;
    const threshold = Number(process.env.FUEL_ALERT_THRESHOLD);
    if (fuelPercent < threshold) {
      await fetch(process.env.ALERT_WEBHOOK!, {
        method: "POST",
        body: JSON.stringify({ vehicleId, fuelPercent }),
      });
    }
  }
}
```

Uchta muammo: xatti-harakat muhit nomiga bog'langan (staging'da test qilib bo'lmaydi), `threshold` env yo'q bo'lsa `NaN` va shart hech qachon bajarilmaydi (xato yo'q, alert ham yo'q), `!` operatori `undefined` webhook'ni yashiradi.

Yaxshi variant:

```ts
// config/schema.ts
import { z } from "zod";

export const FuelAlertEnv = z.object({
  FUEL_ALERTS_ENABLED: z.stringbool().default(false),
  FUEL_ALERT_THRESHOLD_PERCENT: z.coerce.number().min(1).max(50).default(15),
  ALERT_WEBHOOK_URL: z.url({ protocol: /^https$/ }).optional(),
});

export type FuelAlertSettings =
  | { enabled: false }
  | { enabled: true; thresholdPercent: number; webhookUrl: string };

export function parseFuelAlertSettings(env: Record<string, string | undefined>): FuelAlertSettings {
  const e = FuelAlertEnv.parse(env);
  if (!e.FUEL_ALERTS_ENABLED) return { enabled: false };
  if (!e.ALERT_WEBHOOK_URL) {
    throw new Error("FUEL_ALERTS_ENABLED=true, lekin ALERT_WEBHOOK_URL berilmagan");
  }
  return { enabled: true, thresholdPercent: e.FUEL_ALERT_THRESHOLD_PERCENT, webhookUrl: e.ALERT_WEBHOOK_URL };
}
```

```ts
// alerts/fuel-alert.service.ts
import type { FuelAlertSettings } from "../config/schema";

export class FuelAlertService {
  constructor(private readonly settings: FuelAlertSettings) {}

  async check(vehicleId: string, fuelPercent: number): Promise<void> {
    if (!this.settings.enabled) return;
    if (fuelPercent >= this.settings.thresholdPercent) return;
    await fetch(this.settings.webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vehicleId, fuelPercent }),
    });
  }
}
```

Nima o'zgardi:

- **Muhit nomi o'rniga mustaqil bayroq.** Staging'da alert'larni yoqib test qilish uchun bitta o'zgaruvchi yetarli.
- **Bog'liq sozlamalar birga tekshiriladi.** "Yoqilgan bo'lsa, webhook majburiy" qoidasi start paytida. Discriminated union tip buni servisda ham kafolatlaydi: `enabled: true` bo'lsa `webhookUrl` albatta `string`.
- **Servis manbani bilmaydi.** U `FuelAlertSettings` oladi. Testda `new FuelAlertService({ enabled: true, thresholdPercent: 15, webhookUrl: "https://..." })`.

## Qachon qo'llamaslik kerak

- **Hamma narsani config qilish.** Har bir konstantani env'ga chiqarish ("ehtimol kerak bo'lar") config yuzasini kattalashtiradi va har bir deploy'ni sozlashni qiyinlashtiradi. Deploy'lar orasida haqiqatan o'zgaradigan narsalargina config. Biznes qoidasi (masalan, VIP chegarasi) ko'pincha kodda yoki bazada, admin boshqaradigan sozlama sifatida yaxshiroq.
- **Runtime'da o'zgaradigan sozlamalar.** Feature flag'lar va tariflar kabi ish paytida o'zgaradigan narsalar env uchun mos emas, chunki env o'zgarishi qayta start talab qiladi. Ular uchun flag servisi yoki baza kerak. Start paytidagi muzlatilgan config bu holatda noto'g'ri model.
- **Murakkab tuzilmali config.** Ko'p darajali ichma-ich sozlamalar (masalan, 30 ta tarif qoidasi) uchun env o'zgaruvchilari noqulay. Bunday holatda versiyalangan config fayl (JSON, YAML) va uni zod bilan validatsiya qilish halolroq. 12-factor tamoyilidan bu chetlanish, lekin ongli chetlanish.
- **Frontend bundle.** Next.js'da `NEXT_PUBLIC_` prefiksli o'zgaruvchilar build vaqtida bundle'ga yoziladi. Ularni "deploy'lar orasida o'zgaradi" deb hisoblab bo'lmaydi: har bir muhit uchun alohida build kerak. Bu 12-factor modeliga to'liq mos kelmaydi.

## Stack'da: NestJS ConfigModule va zod

NestJS'ning `@nestjs/config` paketi `ConfigModule.forRoot()` orqali ishlaydi. Hujjatdagi asosiy opsiyalar:

- **`isGlobal: true`** - config'ni har bir modulda import qilmasdan ishlatish.
- **`validate`** - birlashtirilgan env obyektini qabul qilib, validatsiyalangan obyektni qaytaradigan sinxron funksiya. U xato otsa, bootstrap to'xtaydi. Bu zod bilan ulashning eng oddiy yo'li.
- **`validationSchema`** - hujjatning hozirgi versiyasiga ko'ra Standard Schema'ga mos sxema (zod shular jumlasidan) yoki Joi qabul qiladi.
- **`ConfigService<T, true>`** va `get("KEY", { infer: true })` - kalitlarni tip bilan cheklaydi va qaytariladigan tipni chiqaradi.

```ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { z } from "zod";

const Env = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
});
export type Env = z.infer<typeof Env>;

function validateEnv(raw: Record<string, unknown>): Env {
  const result = Env.safeParse(raw);
  if (!result.success) throw new Error("Env xato:\n" + z.prettifyError(result.error));
  return result.data;
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate: validateEnv })],
})
export class AppModule {}
```

Muhokama qilinadigan tanlov: `ConfigService.get("PORT")`ni servislar bo'ylab chaqirish yoki o'z tiplangan config provider'ingizni yaratish (topshiriq yechimidagi `APP_CONFIG`). Birinchisi NestJS ekotizimiga yaqinroq, ikkinchisi env nomlarini ilovadan butunlay yashiradi va domen klasslarini framework'dan ozod qiladi. Ikkalasi ham ishlaydi. Muhimi - `process.env` faqat bitta joyda o'qilsin.

ESLint'da `no-restricted-properties` bilan `process.env` murojaatini `config/` papkasidan tashqarida taqiqlash mumkin.

## Xulosa

- Config - deploy'lar orasida o'zgaradigan hamma narsa. U koddan ajratilgan bo'lsin: kod bazasini credential'larsiz open source qilish mumkin bo'lsin.
- Config'ni start paytida, chegarada bir marta parse qiling va xato bo'lsa, barcha muammolarni ko'rsatib, ilovani to'xtating.
- Env satrlarini to'g'ri aylantiring: `z.coerce.number()` chegaralar bilan, bayroqlar uchun `z.coerce.boolean()` emas, `z.stringbool()`.
- Default faqat xavfsiz qiymatlarga. Secret va manzillar majburiy bo'lsin.
- Xatti-harakatni muhit nomiga emas, mustaqil sozlamalarga bog'lang. Domen kodi config manbasini emas, faqat kerakli tiplangan qiymatlarni ko'rsin.
