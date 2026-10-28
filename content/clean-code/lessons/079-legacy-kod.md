---
n: 79
slug: legacy-kod
title: "Legacy kod: seam'lar va characterization test"
summary: "Michael Feathers ta'rifi bo'yicha legacy kod - testlarsiz kod. Bu darsda testsiz kodni xavfsiz o'zgartirish usullarini ko'ramiz: legacy code dilemma, seam'lar, characterization testlar, Sprout va Wrap usullari hamda NestJS va Node'dagi dependency'larni uzish texnikalari."
duration: 45
sources:
  - id: welc
    note: "Legacy kod ta'rifi, Edit and Pray va Cover and Modify, legacy code dilemma va o'zgartirish algoritmi; seam modeli (object, link, preprocessing seam'lar va enabling point); characterization testlar; Sprout Method/Class, Wrap Method/Class; dependency-breaking texnikalar katalogi"
quiz:
  - q: "Feathers bo'yicha seam nima?"
    options:
      - "Ikki modul orasidagi fayl chegarasi"
      - "Dasturdagi shunday joyki, u yerda xatti-harakatni o'sha joyni tahrirlamasdan o'zgartirish mumkin"
      - "Test fayli va production kodi orasidagi bog'lanish"
      - "Git'dagi merge nuqtasi"
    answer: 1
    explain: "Feathers ta'rifining kaliti - \"o'sha joyni tahrirlamasdan\". Masalan, konstruktorga uzatilgan dependency: chaqiruv kodiga tegmasdan, testda boshqa implementatsiyani berasiz. Qaysi implementatsiya ishlatilishini hal qiladigan joy - enabling point."
  - q: "Characterization test qaysi savolga javob beradi?"
    options:
      - "Kod nima qilishi kerak?"
      - "Kod spetsifikatsiyaga mos keladimi?"
      - "Kod hozir aslida nima qiladi?"
      - "Kod qanchalik tez ishlaydi?"
    answer: 2
    explain: "Characterization test mavjud xatti-harakatni qayd qiladi, u to'g'ri yoki noto'g'ri ekanidan qat'i nazar. Maqsad - refaktoring paytida xatti-harakat o'zgarmaganini bilish. Topilgan xatolar alohida qaror sifatida ko'tariladi, jimgina tuzatilmaydi."
  - q: "2000 qatorli `BillingService.generateInvoice` metodiga yangi qoida qo'shish kerak va metodni test harnessiga olib bo'lmaydi. Yangi mantiq o'zi mustaqil hisob. Qaysi usul eng arzon va xavfsiz?"
    options:
      - "Sprout Method: yangi mantiqni testlangan alohida metodda yozib, eski metoddan uni chaqirish"
      - "Metodni noldan qayta yozish"
      - "Yangi mantiqni to'g'ridan-to'g'ri metod o'rtasiga qo'shish va qo'lda tekshirish"
      - "Avval metodning barcha 2000 qatorini test bilan qoplash"
    answer: 0
    explain: "Sprout Method yangi kodni TDD bilan, eski koddan mustaqil yozish imkonini beradi. Eski metodga faqat bitta chaqiruv qo'shiladi. Uchinchi variant Feathers aytgan Edit and Pray. To'liq qoplash ideal, lekin ko'pincha amaliy emas."
  - q: "Har safar buyurtma saqlanganda audit log yozish kerak. `save()` metodi ko'p joydan chaqiriladi va uning ichi chalkash. Qaysi usul mos?"
    options:
      - "Sprout Class"
      - "Extract Interface"
      - "Characterization test"
      - "Wrap Method: eski `save` ni yangi nom bilan qayta nomlab, `save` nomi ostida audit va eski metodni chaqiradigan yangi metod yaratish"
    answer: 3
    explain: "Wrap Method yangi xatti-harakatni mavjud xatti-harakatdan oldin yoki keyin qo'shish uchun: chaqiruvchilar o'zgarmaydi, eski kod ham deyarli tegilmaydi. Yangi xatti-harakat eski bilan vaqt bo'yicha bog'langan, lekin mantiq bo'yicha mustaqil."
  - q: "Feathers \"legacy code dilemma\" deb nimani ataydi?"
    options:
      - "Eski kodni qayta yozish yoki saqlash orasidagi tanlov"
      - "Kodni o'zgartirish uchun testlar kerak, testlarni qo'yish uchun esa ko'pincha kodni o'zgartirish kerak"
      - "Eski framework'ni yangilash muammosi"
      - "Hujjatlar va kod mos kelmasligi"
    answer: 1
    explain: "Bu tovuq va tuxum muammosi. Feathers yechimi: testlarni qo'yish uchun kerak bo'lgan dastlabki o'zgarishlarni juda ehtiyotkor, mexanik, kichik qadamlar bilan qilish (dependency-breaking texnikalar), keyin esa testlar ostida erkin refaktoring qilish."
  - q: "NestJS servisi konstruktor ichida `new PaymeClient(process.env.PAYME_KEY)` yaratadi. Testda haqiqiy to'lov provayderiga so'rov ketmasligi uchun eng kichik xavfsiz o'zgarish qaysi?"
    options:
      - "Servisni butunlay qayta yozish"
      - "Testda `process.env.PAYME_KEY` ni bo'sh qilish"
      - "Parameterize Constructor: klientni konstruktor parametri qilib, NestJS provider orqali berish; testda fake bilan almashtirish"
      - "Global `fetch` ni mock qilish"
    answer: 2
    explain: "Parameterize Constructor (Feathers katalogidagi dependency-breaking texnika) object seam yaratadi. NestJS DI uni tabiiy qiladi: enabling point - modul konfiguratsiyasi yoki `Test.createTestingModule`. `fetch` ni mock qilish ham seam, lekin mo'rt va implementatsiyaga bog'liq."
task:
  title: "Testsiz servisga xavfsiz o'zgarish kiritish"
  prompt: |
    Quyidagi kod production'da 3 yildan beri ishlaydi, testlari yo'q. Yangi talab: **yoqilg'i sliv'i (to'satdan tushish) aniqlansa, Telegram'ga xabar yuborish bilan birga, `fuel_incidents` jadvaliga yozuv qo'shish kerak**.

    Feathers usuli bilan ishlang:

    1. Seam'larni toping: qaysi dependency'lar testni imkonsiz qiladi?
    2. Eng kichik dependency-breaking o'zgarish bilan (Parameterize Constructor, Extract Interface) kodni test harnessiga olib kiring.
    3. Mavjud xatti-harakat uchun 3-4 ta characterization test yozing (jest/vitest uslubida).
    4. Yangi talabni Sprout Method yoki Sprout Class bilan qo'shing.
  lang: ts
  starter: |
    import { Pool } from "pg";

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    export class FuelMonitor {
      private readonly botToken = process.env.TG_TOKEN!;

      async onReading(vehicleId: string, liters: number): Promise<void> {
        const res = await pool.query(
          "select liters from fuel_readings where vehicle_id = $1 order by at desc limit 1",
          [vehicleId],
        );
        const prev = res.rows[0]?.liters as number | undefined;
        await pool.query("insert into fuel_readings (vehicle_id, liters, at) values ($1, $2, now())", [
          vehicleId,
          liters,
        ]);
        if (prev !== undefined && prev - liters > 15) {
          await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ chat_id: "-100500", text: `Sliv: ${vehicleId}, ${prev - liters} L` }),
          });
        }
      }
    }
  solution: |
    // --- Seam'lar: interfeyslar (Extract Interface) ---
    export interface FuelReadings {
      lastLiters(vehicleId: string): Promise<number | undefined>;
      record(vehicleId: string, liters: number): Promise<void>;
    }

    export interface AlertSender {
      send(text: string): Promise<void>;
    }

    export interface FuelIncidents {
      recordDrain(vehicleId: string, droppedLiters: number): Promise<void>;
    }

    const DRAIN_THRESHOLD_LITERS = 15;

    // --- Sprout Method: yangi, mustaqil va testlanadigan mantiq ---
    export function detectDrain(previous: number | undefined, current: number): number | null {
      if (previous === undefined) return null;
      const dropped = previous - current;
      return dropped > DRAIN_THRESHOLD_LITERS ? dropped : null;
    }

    // --- Parameterize Constructor: dependency'lar tashqaridan ---
    export class FuelMonitor {
      constructor(
        private readonly readings: FuelReadings,
        private readonly alerts: AlertSender,
        private readonly incidents: FuelIncidents,
      ) {}

      async onReading(vehicleId: string, liters: number): Promise<void> {
        const previous = await this.readings.lastLiters(vehicleId);
        await this.readings.record(vehicleId, liters);

        const dropped = detectDrain(previous, liters);
        if (dropped === null) return;

        await this.alerts.send(`Sliv: ${vehicleId}, ${dropped} L`);
        await this.incidents.recordDrain(vehicleId, dropped); // yangi talab
      }
    }

    // --- Characterization testlar (vitest/jest) ---
    // Fake'lar xotirada; haqiqiy pg va Telegram adapterlari alohida faylda
    // eski SQL va fetch kodini o'z ichiga oladi.
    //
    // it("birinchi o'qishda xabar yubormaydi", async () => {
    //   const { monitor, sent } = setup({ last: undefined });
    //   await monitor.onReading("01A123BC", 40);
    //   expect(sent).toEqual([]);
    // });
    // it("15 L dan ko'p tushishda xabar yuboradi", async () => {
    //   const { monitor, sent } = setup({ last: 60 });
    //   await monitor.onReading("01A123BC", 40);
    //   expect(sent).toEqual(["Sliv: 01A123BC, 20 L"]);
    // });
    // it("aniq 15 L tushishda xabar yubormaydi (chegara > 15)", async () => {
    //   const { monitor, sent } = setup({ last: 55 });
    //   await monitor.onReading("01A123BC", 40);
    //   expect(sent).toEqual([]);
    // });
    // it("yangi o'qishni xabardan oldin saqlaydi", async () => {
    //   const { monitor, recorded } = setup({ last: 60 });
    //   await monitor.onReading("01A123BC", 40);
    //   expect(recorded).toEqual([["01A123BC", 40]]);
    // });
  solutionNotes: |
    - **Seam'lar**: modul darajasidagi `pool` (yuklanganda ulanadi), `process.env.TG_TOKEN` va global `fetch`. Uchalasi ham testda haqiqiy tashqi tizimga murojaat qiladi.
    - **Dependency-breaking**: Extract Interface (`FuelReadings`, `AlertSender`) va Parameterize Constructor. Eski SQL va `fetch` kodi o'zgarishsiz `PgFuelReadings` va `TelegramAlertSender` adapterlariga ko'chirildi. Bu qadamlar testsiz qilinadi, shuning uchun ular mexanik va kichik: faqat ko'chirish, mantiq o'zgarmaydi.
    - **Characterization testlar** mavjud xatti-harakatni qayd qiladi: chegara qat'iy `> 15`, o'qish xabardan oldin saqlanadi, birinchi o'qishda xabar yo'q. Test yozayotganda `prev - liters` kasr bo'lishi mumkinligini ko'rdik (`20.300000000000004 L`). Bu ehtimoliy xato, lekin biz uni jimgina tuzatmaymiz: test aynan hozirgi natijani qayd qiladi, xato esa alohida vazifa sifatida ko'tariladi.
    - **Sprout**: `detectDrain` sof funksiya, uni har qanday chegara holati bilan arzon test qilish mumkin. Yangi talab - `incidents.recordDrain` - bitta qator va yangi interfeys.
    - **Ochiq savol**: agar Telegram yuborish muvaffaqiyatsiz bo'lsa, incident yozilmaydi. Eski kodda ham xatolik keyingi qadamlarni to'xtatardi. Tartibni (avval incident, keyin xabar) o'zgartirish biznes qarori, uni alohida muhokama qiling.
    - NestJS'da: interfeyslar uchun injection token'lar va modulda `{ provide: FUEL_READINGS, useClass: PgFuelReadings }`. Testda `Test.createTestingModule` bilan fake'lar beriladi.
  checklist:
    - "Testni imkonsiz qiladigan barcha dependency'lar (DB, env, fetch) topildi"
    - "Dependency-breaking qadamlar mexanik va mantiqni o'zgartirmaydi"
    - "Characterization testlar hozirgi xatti-harakatni, shu jumladan chegaraviy holatni qayd qiladi"
    - "Yangi mantiq alohida, testlangan funksiya yoki klassda"
    - "Topilgan ehtimoliy xatolar tuzatilmadi, alohida qayd qilindi"
---

## Muammo

Har bir tajribali dasturchi bunday vaziyatni biladi. 3 yillik NestJS servisida 1500 qatorli `BillingService` bor. Uni yozgan odam allaqachon kompaniyada ishlamaydi. Testlar yo'q, yoki bor, lekin ular 2 yildan beri `skip` qilingan. Yangi talab keldi va uni ertaga production'ga chiqarish kerak.

Odatiy reaksiya: kodni ehtiyotkorlik bilan o'qish, o'zgarishni kiritish, lokal muhitda qo'lda tekshirish va "ishlashi kerak" deb deploy qilish. Michael Feathers *Working Effectively with Legacy Code* kitobida buni **Edit and Pray** ("tahrirlab, ibodat qilish") deb ataydi. Muqobil yondashuv - **Cover and Modify**: avval o'zgartiriladigan joyni testlar bilan qoplash, keyin o'zgartirish. Testlar xavfsizlik to'ri vazifasini bajaradi: o'zgarish nimanidir buzsa, buni darhol bilasiz.

Lekin bu yerda muammo bor. 71-darsda Fowler refaktoringni yashil testlarsiz qilmaslikni aytgan edi. Testlar yo'q bo'lsa nima qilish kerak?

## Asosiy g'oya

Feathers legacy kodni juda aniq ta'riflaydi: bu **testlarsiz kod**. Yoshi, tili yoki muallifi muhim emas. Kecha yozilgan, lekin testsiz kod ham legacy, chunki uni xavfsiz o'zgartirib bo'lmaydi. Bu ta'rifning amaliy ma'nosi: kodning legacy ekanligini belgilaydigan narsa - uning o'zgarishga qanchalik tayyorligi.

Feathers muammoning yadrosini **legacy code dilemma** deb ataydi. Kodni o'zgartirish uchun testlar kerak. Testlarni qo'yish uchun esa ko'pincha kodni o'zgartirish kerak: klass konstruktorda ma'lumotlar bazasiga ulanadi, metod global singleton'ni chaqiradi, funksiya `new Date()` va `fetch` ni to'g'ridan-to'g'ri ishlatadi.

Feathers yechimi ikki bosqichli:

1. Testlarni qo'yish uchun kerak bo'lgan dastlabki o'zgarishlarni **juda ehtiyotkor, mexanik, kichik** qadamlar bilan qilish. Bu qadamlar testsiz qilinadi, shuning uchun ular imkon qadar oddiy bo'lishi kerak: kompilyator va IDE yordam bera oladigan darajada.
2. Testlar paydo bo'lgandan keyin, ularning himoyasi ostida erkin refaktoring va o'zgarish.

Kitob buni **legacy kodni o'zgartirish algoritmi**ga aylantiradi:

1. O'zgarish nuqtalarini aniqlash.
2. Test nuqtalarini topish (qayerda xatti-harakatni kuzatish mumkin).
3. Dependency'larni uzish.
4. Testlarni yozish.
5. O'zgarish kiritish va refaktoring qilish.

Bu algoritmning markazida ikki tushuncha turadi: **seam** va **characterization test**.

## Chuqurroq: seam'lar, characterization testlar va xavfsiz o'zgarish usullari

### Seam

Feathers seam'ni shunday ta'riflaydi: dasturdagi shunday joyki, u yerda xatti-harakatni o'sha joyni tahrirlamasdan o'zgartirish mumkin. Har bir seam'ning **enabling point**i bor: qaysi xatti-harakat ishlatilishini hal qiladigan joy.

Misol: `class Invoicing { constructor(private readonly payments: PaymentGateway) {} }`. `this.payments.charge(...)` chaqiruvi - seam. Biz `Invoicing` ichiga tegmasdan, unga boshqa `PaymentGateway` implementatsiyasini berib, xatti-harakatni o'zgartira olamiz. Enabling point - klass yaratiladigan joy: production'da NestJS moduli, testda `new Invoicing(fakeGateway)`.

Feathers seam'larning bir necha turini ajratadi:

- **Object seam** - obyektga yo'naltirilgan tillarda eng foydali tur: qaysi metod chaqirilishi obyektning turiga bog'liq va obyektni almashtirish mumkin. DI, interfeyslar, subklass va override.
- **Link seam** - qaysi kod ishlatilishini bog'lash (linking) bosqichida almashtirish. Kitob C/C++ va Java (classpath) misollarini beradi. JavaScript ekotizimida uning analogi - modul resolution darajasida almashtirish: `jest.mock('./payme-client')`, `vi.mock`, yoki test konfiguratsiyasidagi path alias.
- **Preprocessing seam** - C/C++ preprotsessori orqali. TypeScript'da bevosita analogi yo'q. Bu ro'yxatni kitobdagi C++ kontekstida tushunish kerak.

Feathers object seam'larni afzal ko'radi, chunki ular aniq va kod ichida ko'rinadi. TypeScript'da ham bu to'g'ri: `jest.mock` bilan modul darajasida almashtirish ishlaydi, lekin u import yo'llariga bog'liq, mo'rt va testni o'qiganda nima almashtirilgani darhol ko'rinmaydi. Konstruktor orqali dependency berish esa ochiq.

### Characterization test

Oddiy test "kod nima qilishi kerak" degan savolga javob beradi. **Characterization test** boshqa savolga: "kod hozir aslida nima qiladi?" Uni yozish jarayoni:

1. Kodni test harnessiga oling.
2. Natija nima bo'lishini bilmaydigan assertion yozing (masalan, `expect(result).toBe("???")`).
3. Testni ishga tushiring, u yiqiladi va haqiqiy qiymatni ko'rsatadi.
4. Testni shu qiymatga moslang.

Natijada test mavjud xatti-harakatni qayd qiladi, u to'g'ri yoki noto'g'ri ekanidan qat'i nazar. Bu muhim: legacy kodda "to'g'ri" xatti-harakat ko'pincha hech qayerda yozilmagan, va tizim foydalanuvchilari hozirgi xatti-harakatga (shu jumladan xatolarga) tayangan bo'lishi mumkin.

Characterization test paytida xato topsangiz nima qilish kerak? Feathers yondashuvi ruhida: uni jimgina tuzatmang. Xatoni qayd qiling, muhokamaga olib chiqing, va tuzatishni alohida, ongli qaror sifatida qiling. Refaktoring va xato tuzatishni aralashtirsangiz, ikki shlyapa qoidasi (71-dars) buziladi.

Qancha characterization test kerak? Feathers maqsadli yondashuvni tavsiya qiladi: butun tizimni emas, aynan o'zgartirmoqchi bo'lgan joyni qoplash. O'zgarishingiz ta'sir qilishi mumkin bo'lgan xatti-harakatlarni o'ylab ko'ring va ularni test bilan qayd qiling.

Bu yondashuvning yaqin qarindoshi - approval yoki snapshot testlar: butun natijani (JSON, HTML, hisobot) faylga yozib, keyingi ishga tushirishlarda solishtirish. Jest'dagi `toMatchSnapshot()` legacy kodni tez qamrab olish uchun foydali vosita, lekin ular mo'rt bo'lishi va "snapshot'ni yangilash" refleksi bilan haqiqiy xatolarni yashirishi mumkin.

### Sprout Method va Sprout Class

Ba'zan kodni test harnessiga olish juda qimmat, lekin o'zgarishni hozir kiritish kerak. Feathers bunday holat uchun usullar beradi.

**Sprout Method**: yangi funksionallikni yangi metod sifatida yozasiz (TDD bilan, alohida test qilib), keyin eski metoddan uni chaqirasiz. Eski metodga faqat bitta qator qo'shiladi. Eski kod testsiz qoladi, lekin yangi kod to'liq testlangan va o'zgarish nuqtasi minimal.

**Sprout Class**: agar hatto eski klassni test harnessida yaratish imkonsiz bo'lsa (konstruktor DB'ga ulanadi, o'nlab dependency), yangi mantiqni butunlay yangi klassda yozasiz va eski koddan uni yaratib chaqirasiz.

Ikkala usulning narxi: eski kod "vaqtincha" testsiz qoladi va dizayn biroz noqulay bo'lishi mumkin (mantiq ikki joyda). Feathers buni ochiq tan oladi: bu ideal emas, lekin Edit and Pray'dan ancha yaxshi va keyingi refaktoring uchun asos.

### Wrap Method va Wrap Class

Yangi xatti-harakat mavjud xatti-harakat bilan **bir vaqtda** sodir bo'lishi kerak, lekin mantiq bo'yicha undan mustaqil bo'lsa (audit log, metrika, bildirishnoma), Wrap ishlatiladi.

**Wrap Method**: eski metodni yangi nom bilan qayta nomlaysiz (masalan, `save` -> `saveOrder`), eski nom bilan yangi metod yaratasiz va u yangi xatti-harakatni va eski metodni chaqiradi. Chaqiruvchilar hech narsani sezmaydi.

**Wrap Class**: xuddi shu, lekin klass darajasida. Bu decorator pattern: eski klassning interfeysini implementatsiya qiladigan, uni o'z ichiga olgan va qo'shimcha xatti-harakat qo'shadigan yangi klass.

### Dependency'larni uzish texnikalari

Kitobning katta qismi dependency-breaking texnikalar katalogi. Ularning ko'pchiligi C++ va Java uchun yozilgan, lekin TypeScript'ga yaxshi o'tadiganlari:

- **Parameterize Constructor** - konstruktor ichida yaratiladigan dependency'ni parametrga aylantirish. NestJS DI'da bu tabiiy holat.
- **Parameterize Method** - xuddi shu, metod darajasida.
- **Extract Interface** - konkret klass o'rniga interfeysga bog'lanish. TypeScript'ning structural typing'i tufayli ko'pincha faqat `type` yoki `interface` e'lon qilish kifoya.
- **Subclass and Override Method** - testda klassning subklassini yaratib, muammoli metodni (masalan, tashqi so'rov yuboradigan) override qilish. Tez, lekin implementatsiyaga bog'langan test beradi.
- **Extract and Override Call** - muammoli chaqiruvni (masalan, `new Date()` yoki `fetch`) alohida metodga chiqarib, testda override qilish.
- **Encapsulate Global References** va **Introduce Static Setter** - global holat va singleton'lar bilan ishlash. Node.js'da modul darajasidagi `const pool = new Pool()` aynan shunday global.

Bu texnikalarning hammasi testsiz qilinadi, shuning uchun Feathers ularni mexanik bajarishni ta'kidlaydi: signaturani saqlash, faqat ko'chirish, kompilyatorga tayanish. Ba'zilari dizaynni vaqtincha yomonlashtiradi (masalan, faqat test uchun ochilgan metod). Bu qabul qilinadigan narx: testlar paydo bo'lgandan keyin dizaynni tozalash mumkin.

## Misol: NestJS servisini test harnessiga olish

Ijara platformasining eski servisi:

```ts
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class RentReminderService {
  async sendReminders(): Promise<number> {
    const today = new Date();
    const due = await prisma.contract.findMany({
      where: { status: "active", nextPaymentAt: { lte: today } },
    });
    let sent = 0;
    for (const c of due) {
      const days = Math.floor((today.getTime() - c.nextPaymentAt.getTime()) / 86_400_000);
      const text = days > 3 ? `Qarzdorlik: ${days} kun` : "To'lov kuni keldi";
      await fetch("https://sms.example.uz/send", {
        method: "POST",
        body: JSON.stringify({ phone: c.tenantPhone, text }),
      });
      sent++;
    }
    return sent;
  }
}
```

Testni imkonsiz qiladigan narsalar: modul darajasidagi `prisma` (global reference), `new Date()` (vaqt) va `fetch` (tashqi tizim). Uchta seam kerak.

Mexanik qadamlar (testsiz, shuning uchun juda ehtiyotkor):

```ts
import { Inject, Injectable } from "@nestjs/common";

export interface DueContracts {
  findDue(asOf: Date): Promise<{ tenantPhone: string; nextPaymentAt: Date }[]>;
}

export interface SmsSender {
  send(phone: string, text: string): Promise<void>;
}

export interface Clock {
  now(): Date;
}

export const DUE_CONTRACTS = Symbol("DUE_CONTRACTS");
export const SMS_SENDER = Symbol("SMS_SENDER");
export const CLOCK = Symbol("CLOCK");

@Injectable()
export class RentReminderService {
  constructor(
    @Inject(DUE_CONTRACTS) private readonly contracts: DueContracts,
    @Inject(SMS_SENDER) private readonly sms: SmsSender,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  async sendReminders(): Promise<number> {
    const today = this.clock.now();
    const due = await this.contracts.findDue(today);
    let sent = 0;
    for (const c of due) {
      const days = Math.floor((today.getTime() - c.nextPaymentAt.getTime()) / 86_400_000);
      const text = days > 3 ? `Qarzdorlik: ${days} kun` : "To'lov kuni keldi";
      await this.sms.send(c.tenantPhone, text);
      sent++;
    }
    return sent;
  }
}
```

E'tibor bering, nima o'zgarmadi: sikl, kunlar hisobi, matn, qaytariladigan qiymat. Faqat uchta tashqi narsa interfeys orqali o'tkazildi (Extract Interface, Parameterize Constructor, Encapsulate Global References). Prisma so'rovi va `fetch` kodi so'zma-so'z `PrismaDueContracts` va `HttpSmsSender` adapterlariga ko'chirildi.

Endi characterization testlar:

```ts
it("3 kundan ko'p kechikkanda qarzdorlik xabarini yuboradi", async () => {
  const sent: string[] = [];
  const service = new RentReminderService(
    { findDue: async () => [{ tenantPhone: "+998901234567", nextPaymentAt: new Date("2026-03-01") }] },
    { send: async (_phone, text) => { sent.push(text); } },
    { now: () => new Date("2026-03-05T10:00:00Z") },
  );
  await service.sendReminders();
  expect(sent).toEqual(["Qarzdorlik: 4 kun"]);
});
```

Xuddi shunday: aniq 3 kun (chegara), 0 kun, bo'sh ro'yxat va bir nechta shartnoma uchun testlar. Shundan keyin yangi talab (masalan, "Telegram orqali ham yuborish") yoki refaktoring (matn tanlovini alohida funksiyaga chiqarish) xavfsiz.

Testlarni yozish paytida bir narsa ko'rinadi: `days` hisobi vaqt zonasiga bog'liq va yarim tunga yaqin ishga tushirilsa, natija o'zgarishi mumkin. Bu characterization test topgan potentsial xato. Uni hozir tuzatmaymiz, qayd qilamiz.

## Qachon qo'llamaslik kerak

- **Faqat test uchun interfeys.** Har bir klass uchun interfeys yaratish Speculative Generality'ga (75-dars) aylanishi mumkin. Feathers texnikalari tashqi tizimlar, vaqt, tasodif va global holat kabi haqiqiy seam'lar uchun. Ichki, sof hisob klasslari uchun interfeys kerak emas.
- **Subclass and Override'ni doimiy yechim sifatida.** Bu texnika testni klassning ichki tuzilishiga bog'laydi. Keyingi refaktoringda test buziladi. U dastlabki qoplash uchun yaxshi, lekin keyin haqiqiy seam bilan almashtirilishi kerak.
- **`jest.mock` bilan hamma narsani almashtirish.** Modul darajasida mock qilish tez, lekin testlar import yo'llariga bog'liq bo'lib qoladi va nima almashtirilgani ko'rinmaydi. Haddan tashqari mocking haqidagi muammolar 66-darsda.
- **Snapshot testlarni ko'r-ko'rona yangilash.** Characterization snapshot faqat siz uni ongli ravishda o'zgartirganingizda yangilanishi kerak. `-u` refleksi uni foydasiz qiladi.
- **Kichik, aniq kod.** Agar legacy funksiya 20 qator va siz uni to'liq tushunsangiz, characterization testlar o'rniga oddiy unit testlar yozing. Feathers usullari tushunish qiyin bo'lgan kod uchun.
- **Kitobning yoshi.** Kitob 2004 yilda chiqqan va misollari asosan C++, Java va C#'da. Preprocessing va link seam'lar zamonaviy TypeScript'ga to'g'ridan-to'g'ri o'tmaydi. G'oyalar (seam, characterization, sprout/wrap) dolzarb, lekin mexanikani o'z stack'ingizga moslashtirish kerak.

## Stack'da: NestJS, Node.js, React

- **NestJS DI - tayyor object seam.** `Test.createTestingModule({ providers: [...] }).overrideProvider(SMS_SENDER).useValue(fake)` - enabling point. Shuning uchun NestJS'da eng birinchi dependency-breaking qadam deyarli har doim: `new X()` ni konstruktor injection'ga aylantirish.
- **Vaqt seam'i.** `new Date()` va `Date.now()` legacy kodda eng ko'p uchraydigan yashirin dependency. `Clock` interfeysi yoki Jest/Vitest'ning fake timer'lari (`vi.useFakeTimers()`, `vi.setSystemTime(...)`) bilan boshqaring. Ikkinchisi tez, birinchisi ochiqroq.
- **Ma'lumotlar bazasi.** Prisma va Kysely so'rovlarini repository interfeysi ortiga olish seam beradi. Lekin characterization uchun ba'zan haqiqiy DB bilan integratsion test (Testcontainers, 68-dars) aniqroq: SQL'ning o'z xatti-harakati (NULL, tartib, vaqt zonasi) ham qayd qilinadi.
- **HTTP chegaralari.** Tashqi API'lar uchun `nock` yoki `msw` - link seam'ning Node.js analogi: kod o'zgarmaydi, tarmoq darajasida almashtiriladi. Legacy kodni tez qoplash uchun foydali.
- **React legacy komponentlari.** Ichida `fetch` va `localStorage` ishlatadigan katta komponent uchun: avval Testing Library bilan foydalanuvchi ko'radigan xatti-harakatni qayd qiling (69-dars), `msw` bilan tarmoqni almashtiring, keyin ma'lumot olishni custom hook'ga chiqaring (Sprout).

## Xulosa

- Feathers ta'rifi: legacy kod - testlarsiz kod. Edit and Pray o'rniga Cover and Modify.
- Legacy code dilemma: o'zgartirish uchun testlar kerak, testlar uchun o'zgartirish kerak. Yechim - testlarni qo'yish uchun minimal, mexanik dependency-breaking qadamlar.
- Seam - xatti-harakatni o'sha joyni tahrirlamasdan o'zgartirish mumkin bo'lgan joy. TypeScript va NestJS'da object seam (DI, interfeys) eng aniq va afzal.
- Characterization test kod hozir nima qilishini qayd qiladi. Topilgan xatolarni jimgina tuzatmang, alohida qaror sifatida ko'taring.
- Sprout Method/Class - yangi mantiqni testlangan alohida joyda yozish; Wrap Method/Class - mavjud xatti-harakat atrofiga yangi xatti-harakat qo'shish.
