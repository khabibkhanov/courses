---
n: 47
slug: exceptionlar
title: "Exception'lar: custom xatolar, cause, kontekst"
summary: "Yaxshi xato nima bo'lganini, qayerda va nima uchun bo'lganini aytadi, va uni ushlagan kod qaror qabul qila oladi. Darsda Martinning exception'lar haqidagi tavsiyalarini, chaqiruvchi ehtiyojiga qarab xato klasslarini loyihalashni, ES2022 Error cause bilan xatolar zanjirini va TypeScript'da catch'dagi unknown bilan to'g'ri ishlashni ko'ramiz."
duration: 40
sources:
  - id: cc1
    note: "\"Error Handling\" bobi: error code o'rniga exception, kontekst berish, chaqiruvchi ehtiyojiga qarab exception klasslarini aniqlash, unchecked exception'lar"
  - id: mdn-error-cause
    note: "Error konstruktoridagi options.cause, uning har qanday tip bo'lishi mumkinligi va strukturali ma'lumot misoli"
  - id: effective-ts
    note: "unknown tipi va catch o'zgaruvchisini toraytirish haqidagi item'lar"
quiz:
  - q: "Martinning \"chaqiruvchi ehtiyojiga qarab exception klasslarini aniqlang\" tavsiyasi nimani anglatadi?"
    options:
      - "Har bir xato manbai uchun alohida klass yarating"
      - "Xatolarni qayerdan kelganiga (manbasiga) emas, ularni qanday ushlash va qayta ishlash kerakligiga qarab tasniflang"
      - "Faqat bitta `Error` klassini ishlating"
      - "Har bir funksiya o'z xato klassiga ega bo'lsin"
    answer: 1
    explain: "Martin uchinchi tomon kutubxonasining ko'plab exception'larini bitta o'ralgan klassga yig'ish misolini keltiradi, chunki chaqiruvchi ularning hammasiga bir xil munosabatda bo'ladi. Klasslar chaqiruvchi qanday qaror qabul qilishini aks ettirishi kerak."
  - q: "`throw new Error(\"To'lov amalga oshmadi\", { cause: err })` da `cause` haqida qaysi gap to'g'ri?"
    options:
      - "U faqat Error tipida bo'lishi mumkin"
      - "U avtomatik ravishda message'ga qo'shiladi"
      - "U har qanday tipda bo'lishi mumkin, shuning uchun uni o'qiganda `Error` deb faraz qilmaslik kerak"
      - "U faqat Node.js'da ishlaydi"
    answer: 2
    explain: "MDN cause har qanday tipda bo'lishi mumkinligini aytadi, xuddi catch'dagi o'zgaruvchi kabi. Uni o'qiyotgan kod (masalan, logger) `instanceof Error` bilan tekshirishi kerak. Bu xususiyat zamonaviy brauzerlar va Node'da keng qo'llab-quvvatlanadi."
  - q: "TypeScript `strict` rejimida `catch (e)` dagi `e` qaysi tipda?"
    options:
      - "`unknown` (useUnknownInCatchVariables tufayli), shuning uchun ishlatishdan oldin toraytirish kerak"
      - "`Error`"
      - "`any`"
      - "`never`"
    answer: 0
    explain: "JS'da istalgan qiymatni throw qilish mumkin: satr, son, obyekt. Shuning uchun `strict` oilasidagi `useUnknownInCatchVariables` catch o'zgaruvchisini `unknown` qiladi. `e.message` ga murojaat qilishdan oldin `e instanceof Error` tekshiruvi kerak."
  - q: "Qaysi xato xabari eng foydali?"
    options:
      - "\"Xato yuz berdi\""
      - "\"Error: undefined\""
      - "\"ECONNRESET\""
      - "\"Yoqilg'i tranzaksiyasini saqlab bo'lmadi: transport 01A123BC, karta ...4821, 45 litr\" va cause'da asl DB xatosi"
    answer: 3
    explain: "Martin exception'larda kontekst berishni tavsiya qiladi: qaysi operatsiya va nima uchun muvaffaqiyatsiz bo'lgani. Asl texnik xato cause'da saqlanadi, shuning uchun hech narsa yo'qolmaydi. Sezgir ma'lumotni (to'liq karta raqami) xabarga qo'ymang."
  - q: "Quyidagi kodning asosiy muammosi nima? `try { await repo.save(x) } catch (e) { throw new Error(\"Saqlashda xato\") }`"
    options:
      - "async ichida try ishlatib bo'lmaydi"
      - "Asl xato (stack, sabab) yo'qoladi; `{ cause: e }` qo'shilishi kerak edi"
      - "Error o'rniga string throw qilish kerak edi"
      - "Hech qanday muammo yo'q"
    answer: 1
    explain: "Xatoni o'rash to'g'ri, lekin asl xatoni tashlab yuborish debugging'ni imkonsiz qiladi: DB constraint xatosimi yoki tarmoq uzilishimi - endi noma'lum. `cause` aynan shu uchun qo'shilgan."
  - q: "Custom xato klassida `code` (masalan, `\"VEHICLE_NOT_FOUND\"`) maydoni nima uchun foydali?"
    options:
      - "Xato tezroq tashlanadi"
      - "message'ni yozish shart bo'lmaydi"
      - "Kod xato xabari matniga emas, barqaror, mashina o'qiydigan identifikatorga tayanib qaror qabul qiladi; xabar matni esa erkin o'zgarishi va tarjima qilinishi mumkin"
      - "TypeScript buni talab qiladi"
    answer: 2
    explain: "MDN ham xuddi shu sababni keltiradi: odam uchun yozilgan xabar o'zgaradi va uni parse qiladigan kod buziladi. Barqaror `code` API javobida, loglarda va `switch` da ishonchli ishlatiladi."
task:
  title: "SMS yuborish servisining xatolarini loyihalash"
  prompt: |
    Quyidagi servis haydovchilarga SMS yuboradi. Hozir u satrlar throw qiladi, asl xatolarni yo'qotadi va chaqiruvchi xatoning turini xabar matnidan aniqlaydi.

    1. Chaqiruvchi (controller va retry logikasi) qanday qarorlar qabul qilishini aniqlang: qayta urinish kerakmi, foydalanuvchiga nima deyish kerak?
    2. Shu qarorlarga mos xato klasslarini loyihalang (ko'pi bilan 3 ta), har biri barqaror `code` va kerakli kontekst bilan.
    3. Asl xatolarni `cause` orqali saqlang.
    4. `catch` dagi `unknown`ni to'g'ri toraytiring, `any` va `as` ishlatmang.
  lang: ts
  starter: |
    type HttpResponse = { status: number; body: string };
    interface HttpClient {
      post(url: string, body: object): Promise<HttpResponse>;
    }

    export class SmsService {
      constructor(private readonly http: HttpClient) {}

      async send(phone: string, text: string): Promise<void> {
        if (!/^\+998\d{9}$/.test(phone)) throw "bad phone";
        let res: HttpResponse;
        try {
          res = await this.http.post("https://sms.example.uz/send", { phone, text });
        } catch (e: any) {
          throw new Error("network: " + e.message);
        }
        if (res.status === 429) throw new Error("rate limit");
        if (res.status >= 400) throw new Error("sms failed " + res.status);
      }
    }

    // chaqiruvchi:
    // try { await sms.send(p, t) } catch (e: any) {
    //   if (String(e).includes("rate") || String(e).includes("network")) retryLater();
    //   else markFailed();
    // }
  solution: |
    type HttpResponse = { status: number; body: string };
    interface HttpClient {
      post(url: string, body: object): Promise<HttpResponse>;
    }

    export abstract class SmsError extends Error {
      abstract readonly code: string;
      abstract readonly retryable: boolean;
    }

    export class InvalidPhoneError extends SmsError {
      readonly code = "SMS_INVALID_PHONE";
      readonly retryable = false;
      constructor(readonly phone: string) {
        super(`SMS uchun telefon raqami noto'g'ri: ${phone}`);
        this.name = "InvalidPhoneError";
      }
    }

    export class SmsTemporarilyUnavailableError extends SmsError {
      readonly code = "SMS_TEMPORARILY_UNAVAILABLE";
      readonly retryable = true;
      constructor(readonly reason: "network" | "rate_limited" | "provider_5xx", options?: ErrorOptions) {
        super(`SMS provayderi vaqtincha ishlamayapti (${reason})`, options);
        this.name = "SmsTemporarilyUnavailableError";
      }
    }

    export class SmsRejectedError extends SmsError {
      readonly code = "SMS_REJECTED";
      readonly retryable = false;
      constructor(readonly status: number, readonly providerBody: string) {
        super(`SMS provayderi so'rovni rad etdi: HTTP ${status}`);
        this.name = "SmsRejectedError";
      }
    }

    const PHONE_RE = /^\+998\d{9}$/;

    export class SmsService {
      constructor(private readonly http: HttpClient) {}

      async send(phone: string, text: string): Promise<void> {
        if (!PHONE_RE.test(phone)) throw new InvalidPhoneError(phone);

        let res: HttpResponse;
        try {
          res = await this.http.post("https://sms.example.uz/send", { phone, text });
        } catch (e: unknown) {
          throw new SmsTemporarilyUnavailableError("network", { cause: e });
        }

        if (res.status === 429) throw new SmsTemporarilyUnavailableError("rate_limited");
        if (res.status >= 500) throw new SmsTemporarilyUnavailableError("provider_5xx");
        if (res.status >= 400) throw new SmsRejectedError(res.status, res.body);
      }
    }

    // chaqiruvchi:
    export async function notifyDriver(
      sms: SmsService,
      phone: string,
      text: string,
      retryLater: () => void,
      markFailed: (code: string) => void,
    ): Promise<void> {
      try {
        await sms.send(phone, text);
      } catch (e: unknown) {
        if (!(e instanceof SmsError)) throw e; // kutilmagan xato - yuqoriga
        if (e.retryable) retryLater();
        else markFailed(e.code);
      }
    }
  solutionNotes: |
    - Xato klasslari chaqiruvchining qarori bo'yicha tuzildi: "qayta urin" (`SmsTemporarilyUnavailableError`) va "qayta urinma" (`InvalidPhoneError`, `SmsRejectedError`). Tarmoq, 429 va 5xx bitta klassda, chunki chaqiruvchi ularga bir xil munosabatda bo'ladi; farq `reason` maydonida log uchun saqlanadi.
    - `retryable` va `code` maydonlari chaqiruvchini xabar matnini parse qilishdan ozod qildi.
    - Tarmoq xatosi `{ cause: e }` bilan saqlandi: stack va asl sabab logga tushadi.
    - Satr throw qilish (`throw "bad phone"`) yo'qoldi: endi har bir xatoda stack trace va `instanceof` bor.
    - `catch (e: unknown)` va `instanceof SmsError` bilan toraytirish. Kutilmagan xatolar yutilmaydi, yuqoriga qayta tashlanadi.
    - `this.name` o'rnatilgan, shunda loglarda klass nomi ko'rinadi. ES2022 target'da `Object.setPrototypeOf` kerak emas; ES5 target'da esa `instanceof` ishlashi uchun kerak bo'lardi.
  checklist:
    - "Satr yoki oddiy obyekt throw qilinmaydi, faqat Error subklasslari"
    - "Xato klasslari chaqiruvchi qaroriga qarab tasniflangan, soni kam"
    - "Har bir xatoda barqaror code bor, chaqiruvchi message'ni parse qilmaydi"
    - "Asl xato cause orqali saqlanadi"
    - "catch'da any yo'q, unknown instanceof bilan toraytiriladi"
    - "Kutilmagan xatolar yutilmaydi"
---

## Muammo

Production logida shunday yozuv:

```
Error: Something went wrong
    at OrderService.create (order.service.ts:142)
```

Nima bo'ldi? DB constraint buzildimi, to'lov provayderi javob bermadimi, yoki mijozning manzili noto'g'rimi? Qaysi buyurtma? Qaysi mijoz? Bularning hech biri yo'q. 142-qatorni ochsangiz:

```ts
try {
  await this.payments.charge(order);
  await this.repo.save(order);
} catch (e) {
  throw new Error("Something went wrong");
}
```

Asl xato yo'q qilingan. Debugging uchun yagona yo'l - xatoni qayta hosil qilish, va bu ko'pincha imkonsiz.

Boshqa tomondan, chaqiruvchi kod:

```ts
catch (e: any) {
  if (e.message.includes("insufficient")) return res.status(402).send();
  if (e.message.includes("not found")) return res.status(404).send();
  return res.status(500).send();
}
```

Bir kun kimdir xato xabarini "Mablag' yetarli emas" deb tarjima qiladi va 402 javoblar 500 ga aylanadi. Hech qanday test buzilmaydi, chunki testlar ham xabar matnini tekshirmagan.

Bu ikki muammo - kontekstning yo'qolishi va xato turini aniqlash uchun barqaror mexanizm yo'qligi - yaxshi loyihalangan xato klasslari bilan hal qilinadi.

## Asosiy g'oya

Martin *Clean Code*ning xatolar bilan ishlash bobida bir nechta tavsiya beradi. Ularning bu darsga tegishlilari:

### Error code o'rniga exception

Martin xato kodlarini qaytarish o'rniga exception tashlashni afzal ko'radi, chunki xato kodlari chaqiruvchini har chaqiruvdan keyin darhol tekshirishga majbur qiladi va asosiy mantiq xato tekshiruvlari ichida yo'qoladi. Exception'lar asosiy oqim va xatolarni qayta ishlashni ajratadi. (Bu munozarali tanlov: Result tiplari bilan muqobil yondashuvni 28-darsda ko'rdik. Bu dars exception'larni tanlagan joyda ularni qanday yaxshi qilish haqida.)

### Kontekst bering

Har bir exception xatoning manbai va joyini aniqlash uchun yetarli kontekstga ega bo'lishi kerak. Stack trace qayerda ekanini aytadi, lekin nima uchun va qaysi operatsiyada ekanini aytmaydi. Martin tavsiyasi: xato xabarida muvaffaqiyatsiz bo'lgan operatsiyani va muvaffaqiyatsizlik turini yozing, kerak bo'lsa log uchun yetarli ma'lumot bilan.

### Chaqiruvchi ehtiyojiga qarab exception klasslarini aniqlang

Bu bobning eng muhim, lekin kam qo'llaniladigan g'oyasi. Xatolarni ko'p usulda tasniflash mumkin: manbasi bo'yicha (qaysi komponent), turi bo'yicha (tarmoq, qurilma, dasturchi xatosi). Martin ta'kidlaydiki, dasturchi uchun eng muhim savol - **xato qanday ushlanadi**. Uning misolida uchinchi tomon port kutubxonasi bir nechta turli exception tashlaydi, va har bir chaqiruv joyida ularning hammasi uchun bir xil `catch` bloklari takrorlanadi. Yechim: kutubxonani o'rash va uning barcha xatolarini bitta umumiy exception'ga aylantirish. Chunki chaqiruvchi ularning hammasiga bir xil munosabatda bo'ladi.

Qoida: agar ikki xatoni chaqiruvchi har doim bir xil qayta ishlasa, ular bitta klass. Faqat ularni turlicha ushlash kerak bo'lganda alohida klass kerak.

## Chuqurroq: zamonaviy JS va TS vositalari

### Error cause

ES2022'da `Error` konstruktoriga ikkinchi argument qo'shildi: `{ cause }`. MDN uni shunday tavsiflaydi: xatoni ushlab, aniqroq xabar bilan qayta tashlaganda asl xatoga kirishni saqlab qolish uchun. Bu xususiyat 2021-yildan beri zamonaviy brauzerlarda keng qo'llab-quvvatlanadi, Node.js'da ham bor.

```ts
try {
  await db.insert("fuel_transactions", row);
} catch (e: unknown) {
  throw new Error(`Yoqilg'i tranzaksiyasini saqlab bo'lmadi: ${row.vehicleId}`, { cause: e });
}
```

MDN ikki muhim tafsilotni ta'kidlaydi:

- **`cause` har qanday tipda bo'lishi mumkin.** Uni o'qiganda `Error` deb faraz qilmang, xuddi catch'dagi o'zgaruvchi kabi.
- **Strukturali ma'lumot uchun ham ishlatish mumkin.** MDN misolida xato xabari o'zgarishi mumkinligi va uni parse qilish xavfli ekanligi aytiladi, shuning uchun `cause`ga `{ code, values }` kabi mashina o'qiydigan ma'lumot qo'yiladi. Lekin custom klassda alohida maydonlar ochiqroq (pastda).

Ba'zi loggerlar va monitoring vositalari (masalan, pino'ning error serializer'lari yoki Sentry) `cause` zanjirini ham ko'rsata oladi; aniq xatti-harakatni o'z versiyangiz hujjatidan tekshiring. Uni to'ldirish arzon va foydasi katta.

### TypeScript'da custom xato klasslari

```ts run
export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly context: Readonly<Record<string, string | number>> = {},
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class VehicleNotFoundError extends DomainError {
  constructor(vehicleId: string) {
    super("VEHICLE_NOT_FOUND", `Transport topilmadi: ${vehicleId}`, { vehicleId });
  }
}

export class InsufficientBalanceError extends DomainError {
  constructor(walletId: string, requested: number, available: number) {
    super(
      "INSUFFICIENT_BALANCE",
      `Hamyonda mablag' yetarli emas: so'ralgan ${requested}, mavjud ${available}`,
      { walletId, requested, available },
    );
  }
}

// Sinab ko'ring: ushlovchi tomon xato haqida nimalarni biladi?
try {
  throw new InsufficientBalanceError("wallet_42", 350_000, 120_000);
} catch (e) {
  if (e instanceof DomainError) {
    console.log(e.name, e.code);
    console.log(e.message);
    console.log(JSON.stringify(e.context));
  }
}
console.log(new VehicleNotFoundError("01A123BC") instanceof DomainError);
```

Tafsilotlar:

- **`this.name = new.target.name`** loglarda klass nomini ko'rsatadi. Busiz har bir xato "Error" deb ko'rinadi. (Minifikatsiya qilingan frontend kodida klass nomi qisqarishi mumkin, shuning uchun `code` ishonchliroq identifikator.)
- **`ErrorOptions`** tipi `lib: ["es2022"]` yoki undan yuqori bilan mavjud. U `cause`ni uzatish uchun.
- **`Object.setPrototypeOf(this, new.target.prototype)`** faqat ES5 target uchun kerak edi: o'shanda built-in `Error`dan meros olgan klasslarda `instanceof` noto'g'ri ishlardi. ES2015+ target'da kerak emas.
- **`code`** - barqaror, mashina o'qiydigan identifikator. Xabar matni o'zgaradi va tarjima qilinadi, `code` esa API shartnomasining bir qismi.
- **`context`** strukturali log uchun. Xabarga hamma narsani yozish o'rniga, alohida maydonlar log tizimida qidirish va filtrlashni osonlashtiradi.

### catch'dagi unknown

JS'da istalgan narsani throw qilish mumkin: satr, son, `undefined`, Promise. Shuning uchun TypeScript `strict` rejimida (`useUnknownInCatchVariables` orqali) catch o'zgaruvchisi `unknown`. Vanderkam *Effective TypeScript*da `unknown`ni `any`dan afzal ko'rishni tavsiya qiladi: u ishlatishdan oldin toraytirishni majburlaydi.

```ts run
function describeError(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`;
  if (typeof e === "string") return e;
  return `Noma'lum xato qiymati: ${JSON.stringify(e)}`;
}

// Sinab ko'ring: turli "xato" qiymatlarini bering.
console.log(describeError(new RangeError("Litr manfiy bo'lishi mumkin emas")));
console.log(describeError("card not found"));
console.log(describeError({ code: 42 }));
```

`catch (e: any)` yoki `(e as Error).message` - bu tekshiruvni chetlab o'tish. Agar kutubxona satr throw qilsa, `e.message` `undefined` beradi va log yolg'on gapiradi.

### Xatoni qachon o'rash kerak

Har bir qatlamda o'rash shart emas. Oddiy qoida: **abstraksiya chegarasini kesib o'tganda o'rang.** Repository Postgres xatosini (`unique_violation`) `DuplicatePlateNumberError`ga aylantiradi, chunki servis Postgres kodlarini bilmasligi kerak. Servis ichidagi har bir funksiya xatoni o'rab qayta tashlashi esa faqat shovqin va bir xil ma'noli 5 qavatli zanjir beradi.

### Xato uchta auditoriyaga gapiradi

Bitta xato obyekti uch xil o'quvchiga xizmat qiladi va ularning ehtiyojlari turlicha:

- **Kod (chaqiruvchi).** Unga barqaror identifikator kerak: klass (`instanceof`) yoki `code`. U qaror qabul qiladi: qayta urinish, boshqa yo'lni tanlash, foydalanuvchiga xabar berish.
- **Dasturchi (log, Sentry).** Unga to'liq kontekst kerak: operatsiya, identifikatorlar, `cause` zanjiri, stack trace. Bu yerda batafsillik foydali.
- **Foydalanuvchi (UI, API mijozi).** Unga qisqa, tushunarli va xavfsiz matn kerak. Ichki tafsilotlar (SQL, fayl yo'llari, stack) unga ko'rsatilmasligi kerak.

Ko'p xatolar shu uch auditoriyani aralashtirishdan kelib chiqadi: foydalanuvchiga stack trace ko'rsatiladi, kod esa foydalanuvchi uchun yozilgan matnni parse qiladi. Custom xato klassida `code` va `context` maydonlari birinchi ikki auditoriya uchun, foydalanuvchi matni esa odatda chegarada (filter yoki UI) `code` asosida tanlanadi.

## Misol: yoqilg'i kartasi bilan to'lov

Yomon:

```ts
export async function payWithFuelCard(cardId: string, liters: number, pricePerLiter: number) {
  const card = await cards.findById(cardId);
  if (!card) throw "card not found";
  if (card.blocked) throw new Error("blocked");
  const amount = liters * pricePerLiter;
  if (card.balance < amount) throw new Error("no money");
  try {
    await cards.debit(cardId, amount);
  } catch (e) {
    throw new Error("debit failed");
  }
}
```

Yaxshi:

```ts
export class FuelCardNotFoundError extends DomainError {
  constructor(cardId: string) {
    super("FUEL_CARD_NOT_FOUND", `Yoqilg'i kartasi topilmadi: ${cardId}`, { cardId });
  }
}

export class FuelCardUnavailableError extends DomainError {
  constructor(cardId: string, reason: "blocked" | "insufficient_balance") {
    super("FUEL_CARD_UNAVAILABLE", `Kartadan to'lab bo'lmaydi (${reason}): ${cardId}`, {
      cardId,
      reason,
    });
  }
}

export async function payWithFuelCard(cardId: string, liters: number, pricePerLiter: number) {
  const card = await cards.findById(cardId);
  if (!card) throw new FuelCardNotFoundError(cardId);
  if (card.blocked) throw new FuelCardUnavailableError(cardId, "blocked");

  const amount = liters * pricePerLiter;
  if (card.balance < amount) throw new FuelCardUnavailableError(cardId, "insufficient_balance");

  try {
    await cards.debit(cardId, amount);
  } catch (e: unknown) {
    throw new Error(`Kartadan ${amount} yechib bo'lmadi: ${cardId}`, { cause: e });
  }
}

declare const cards: {
  findById(id: string): Promise<{ blocked: boolean; balance: number } | null>;
  debit(id: string, amount: number): Promise<void>;
};
```

Nima o'zgardi va nega:

- **Klasslar chaqiruvchi qarori bo'yicha.** Dispetcher UI uchun ikki xil reaksiya bor: "karta yo'q" (formani tekshiring) va "kartadan to'lab bo'lmaydi" (boshqa karta tanlang). Bloklangan va balans yetmagan karta bitta klassda, chunki reaksiya bir xil; sabab `reason` maydonida.
- **Debit xatosi domen xatosi emas.** U kutilmagan texnik nosozlik, shuning uchun oddiy `Error` va `cause`. U yuqorida 500 sifatida qayta ishlanadi (48-dars).
- **Kontekst strukturali.** `cardId`, `reason` alohida maydonlar: loglarda filtrlash mumkin.
- **Satr throw qilish yo'q.** `throw "card not found"` stack trace bermaydi va `instanceof` bilan ushlanmaydi.

## Qachon qo'llamaslik kerak

- **Xato klasslari portlashi.** Har bir `throw` uchun yangi klass yaratish ierarxiyani tushunarsiz qiladi. Martin tavsiyasining mohiyati aksincha: chaqiruvchi ularni farqlamasa, bitta klass yetarli. Ko'p loyihalarga 5-15 ta domen xato klassi yetadi.
- **Kutiladigan natijalar uchun exception.** Formani validatsiya qilish, "foydalanuvchi topilmadi, ro'yxatdan o'tkazamiz" kabi oddiy biznes tarmoqlari uchun exception boshqaruv oqimini yashiradi. Bu yerda Result yoki union qaytarish ochiqroq (28-dars).
- **Har qatlamda o'rash.** Faqat abstraksiya chegarasida o'rang. Aks holda bir xil ma'noli uzun cause zanjiri hosil bo'ladi.
- **Xabarga sezgir ma'lumot.** To'liq karta raqami, parol, token, shaxsiy ma'lumotlar xato xabariga va kontekstga tushmasin: ular loglarga va ba'zan API javobiga chiqadi.
- **Frontend'da klass nomlariga tayanish.** Minifikatsiya `name`ni buzishi mumkin, server va client orasida esa `instanceof` umuman ishlamaydi (JSON'da klass yo'q). U yerda `code` ishlating.

## Stack'da: Node.js, NestJS, zod

- **Node.js tizim xatolari** `code` maydoniga ega (`ECONNREFUSED`, `ENOENT`, `ETIMEDOUT`). Ularni `cause`da saqlab, o'z domen xatoingizga o'rang.
- **NestJS'da domen xatolari `HttpException`dan meros olmasin.** Domen qatlami HTTP haqida bilmasligi kerak. Domen xatolarini exception filter'da HTTP javobiga aylantiring (48-dars). NestJS'ning `HttpException`i ham `options.cause`ni qabul qiladi, hujjatlarga ko'ra u faqat log uchun va javobga serializatsiya qilinmaydi.
- **Zod xatolari.** `ZodError` ni chegarada o'z `ValidationError` klassingizga o'rang va `issues`dan maydon nomlari ro'yxatini kontekstga qo'ying.
- **Prisma xatolari.** `PrismaClientKnownRequestError` ning `code` maydoni (`P2002` - unique constraint, `P2025` - yozuv topilmadi) repository'da domen xatosiga aylantiriladi.
- **Promise rejection'lar.** `Promise.reject("satr")` ham satr throw qilish bilan bir xil. Har doim `Error` obyektini reject qiling.

## Xulosa

- Xato xabari qaysi operatsiya va nima uchun muvaffaqiyatsiz bo'lganini aytsin. Asl xato `cause`da saqlansin.
- Xato klasslarini manbaga emas, chaqiruvchi qanday qaror qabul qilishiga qarab tasniflang. Chaqiruvchi farqlamasa, bitta klass.
- Har bir domen xatosida barqaror `code` bo'lsin, chaqiruvchi xabar matnini parse qilmasin.
- TypeScript'da catch o'zgaruvchisi `unknown`: `instanceof` bilan toraytiring, `any` ishlatmang. Satr yoki oddiy obyekt throw qilmang.
- Faqat abstraksiya chegarasida o'rang va sezgir ma'lumotni xatoga qo'ymang.
