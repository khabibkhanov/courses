---
n: 45
slug: noqonuniy-holatlar
title: "Noqonuniy holatlarni ifodalab bo'lmaydigan qilish"
summary: "Agar tip noto'g'ri holatni ifodalashga yo'l qo'ysa, ertami-kechmi kod shunday holatga tushadi. Darsda Alexis Kingning \"Parse, don't validate\" g'oyasini, discriminated union'lar bilan holat mashinalarini va zod bilan tizim chegarasida parse qilishni ko'ramiz."
duration: 45
sources:
  - id: parse-dont-validate
    note: "Parse va validate farqi, NonEmpty misoli, shotgun parsing, \"burden of proof\"ni yuqoriga surish va maqola oxiridagi amaliy tavsiyalar"
  - id: effective-ts
    note: "Faqat yaroqli holatlarni ifodalaydigan tiplar va tagged union'lar haqidagi item'lar"
  - id: zod-docs
    note: "Zod 4 API: z.discriminatedUnion, z.literal, safeParse, .brand, top-level string formatlari"
quiz:
  - q: "Alexis King ta'rifiga ko'ra, validatsiya va parse qilish o'rtasidagi asosiy farq nima?"
    options:
      - "Parse qilish tezroq"
      - "Validatsiya faqat frontend'da, parse faqat backend'da"
      - "Parse qilish faqat JSON uchun"
      - "Validatsiya tekshiradi va hech narsa qaytarmaydi (bilim yo'qoladi), parse qilish esa xuddi shu tekshiruvni qilib, bilimni saqlaydigan aniqroq tip qaytaradi"
    answer: 3
    explain: "Validator tekshiruv natijasini tashlab yuboradi, shuning uchun keyingi kod uni yana tekshirishga majbur. Parser natijani tipga yozadi: `NonEmpty<T>` olgan funksiya ro'yxat bo'sh emasligini qayta tekshirmaydi."
  - q: "\"Shotgun parsing\" nima?"
    options:
      - "JSON'ni bir necha marta parse qilish"
      - "Parallel parse qilish"
      - "Kirish ma'lumotini tekshirish kod bo'ylab, ishlov berish bilan aralash tarqalib ketgan antipattern; noto'g'ri qism to'g'ri qismlar allaqachon ishlatilgandan keyin topilishi mumkin"
      - "Regex bilan parse qilish"
    answer: 2
    explain: "King bu atamani LangSec tadqiqotlaridan oladi. Xavf: ma'lumotning bir qismi bo'yicha amal bajarilgandan keyin boshqa qismi noto'g'ri ekani topiladi va orqaga qaytarish qiyin yoki imkonsiz."
  - q: "Quyidagi tipdagi asosiy muammo nima? `type Payment = { status: \"pending\" | \"paid\" | \"failed\"; paidAt?: Date; failureReason?: string }`"
    options:
      - "status string bo'lishi kerak"
      - "Date o'rniga number kerak"
      - "Muammo yo'q"
      - "Tip `status: \"paid\"` va `paidAt` yo'q yoki `status: \"pending\"` va `failureReason` bor kabi noqonuniy kombinatsiyalarni ifodalashga yo'l qo'yadi"
    answer: 3
    explain: "Ixtiyoriy maydonlar 2 x 2 x 3 = 12 kombinatsiya beradi, ulardan faqat 3 tasi ma'noli. Discriminated union har holat uchun faqat uning maydonlarini beradi va qolganlarini tipda imkonsiz qiladi."
  - q: "King \"burden of proof\"ni qayerga surishni tavsiya qiladi?"
    options:
      - "Yuqoriga, tizim chegarasiga yoki ma'lumot birinchi kerak bo'lgan joyga, lekin undan ham yuqoriga emas"
      - "Iloji boricha pastga, ma'lumot ishlatiladigan har bir funksiyaga"
      - "Ma'lumotlar bazasiga"
      - "Testlarga"
    answer: 0
    explain: "Ma'lumotni iloji boricha erta aniq shaklga keltiring, shunda ichki kod faqat yaroqli tiplar bilan ishlaydi. \"Undan ham yuqoriga emas\" qismi muhim: hali ma'lum bo'lmagan narsani juda erta talab qilish ham xato."
  - q: "Zod'da `schema.safeParse(input)` qanday natija qaytaradi?"
    options:
      - "Har doim parse qilingan qiymatni yoki throw qiladi"
      - "`{ success: true, data }` yoki `{ success: false, error }` ko'rinishidagi discriminated union"
      - "boolean"
      - "Promise"
    answer: 1
    explain: "`safeParse` throw qilmaydi va natijani `success` maydoni bo'yicha ajratiladigan union sifatida qaytaradi. `parse` esa xato bo'lsa throw qiladi. Ikkalasi ham muvaffaqiyatda tiplangan `data` beradi."
  - q: "Qaysi holatda invariantni tipda to'liq ifodalashga urinish ortiqcha?"
    options:
      - "To'lov holatlari uchun"
      - "Invariant murakkab (masalan, \"bron sanalari boshqa bronlar bilan kesishmasin\") va uni tipda ifodalash kodni tushunarsiz qiladi; bunda smart constructor va izoh yetarli"
      - "API kirishini tekshirishda"
      - "Bo'sh bo'lmagan massiv uchun"
    answer: 1
    explain: "Kingning o'zi maqola oxirida bu ideallar ekanini, ba'zi invariantlarni to'liq kodlash mehnatga arzimasligini va izoh bilan hujjatlash yetarli bo'lishi mumkinligini aytadi. DB bilan bog'liq invariantlar ko'pincha faqat runtime'da tekshiriladi."
task:
  title: "Yetkazib berish buyurtmasini holat mashinasiga aylantirish"
  prompt: |
    Quyidagi kod yetkazib berish buyurtmasini ifodalaydi. Barcha maydonlar ixtiyoriy, holat `string`, va har bir funksiya o'zi kerakli maydonlarni tekshiradi (shotgun parsing).

    1. Noqonuniy kombinatsiyalarni sanab chiqing (masalan, `delivered`, lekin `courierId` yo'q).
    2. `Delivery` tipini discriminated union qilib qayta yozing: har holat faqat o'ziga tegishli maydonlarga ega bo'lsin.
    3. Holatlar o'rtasidagi o'tishlarni funksiyalar sifatida yozing, ular faqat ruxsat etilgan holatdan qabul qilsin.
    4. HTTP'dan kelgan JSON'ni zod bilan chegarada parse qiling, ichki kod `unknown` yoki ixtiyoriy maydonlar bilan ishlamasin.
  lang: ts
  starter: |
    type Delivery = {
      id: string;
      status: string; // "created" | "assigned" | "picked_up" | "delivered" | "cancelled"
      courierId?: string;
      pickedUpAt?: string;
      deliveredAt?: string;
      cancelReason?: string;
    };

    export function markDelivered(d: Delivery, at: Date): Delivery {
      if (d.status !== "picked_up") throw new Error("Hali olinmagan");
      if (!d.courierId) throw new Error("Kuryer yo'q");
      return { ...d, status: "delivered", deliveredAt: at.toISOString() };
    }

    export function deliveryMinutes(d: Delivery): number {
      if (!d.pickedUpAt || !d.deliveredAt) return 0;
      return (Date.parse(d.deliveredAt) - Date.parse(d.pickedUpAt)) / 60000;
    }

    export function handleWebhook(body: unknown): Delivery {
      const d = body as Delivery;
      if (!d.id) throw new Error("id yo'q");
      return d;
    }
  solution: |
    import * as z from "zod";

    type Base = { readonly id: string };

    export type Delivery =
      | (Base & { readonly status: "created" })
      | (Base & { readonly status: "assigned"; readonly courierId: string })
      | (Base & { readonly status: "picked_up"; readonly courierId: string; readonly pickedUpAt: Date })
      | (Base & {
          readonly status: "delivered";
          readonly courierId: string;
          readonly pickedUpAt: Date;
          readonly deliveredAt: Date;
        })
      | (Base & { readonly status: "cancelled"; readonly cancelReason: string });

    type InStatus<S extends Delivery["status"]> = Extract<Delivery, { status: S }>;

    export function markDelivered(d: InStatus<"picked_up">, at: Date): InStatus<"delivered"> {
      return { ...d, status: "delivered", deliveredAt: at };
    }

    export function deliveryMinutes(d: InStatus<"delivered">): number {
      return (d.deliveredAt.getTime() - d.pickedUpAt.getTime()) / 60_000;
    }

    const id = z.string().min(1);
    const date = z.coerce.date();

    const DeliverySchema = z.discriminatedUnion("status", [
      z.object({ id, status: z.literal("created") }),
      z.object({ id, status: z.literal("assigned"), courierId: id }),
      z.object({ id, status: z.literal("picked_up"), courierId: id, pickedUpAt: date }),
      z.object({
        id,
        status: z.literal("delivered"),
        courierId: id,
        pickedUpAt: date,
        deliveredAt: date,
      }),
      z.object({ id, status: z.literal("cancelled"), cancelReason: z.string().min(1) }),
    ]);

    export function parseDelivery(body: unknown): Delivery {
      const result = DeliverySchema.safeParse(body);
      if (!result.success) {
        const fields = result.error.issues.map((i) => i.path.join(".") || "(root)");
        throw new Error(`Delivery webhook noto'g'ri: ${fields.join(", ")}`);
      }
      return result.data;
    }
  solutionNotes: |
    - Ixtiyoriy maydonlar o'rniga har holat o'z maydonlariga ega: `delivered` bo'lsa `courierId`, `pickedUpAt` va `deliveredAt` kafolatlangan. Starter'dagi 5 holat x 2^4 kombinatsiyadan faqat 5 tasi qoldi.
    - `markDelivered` faqat `picked_up` holatini qabul qiladi. Ilgari runtime'da tekshirilgan narsani endi kompilyator tekshiradi, chaqiruvchi esa holatni `switch` yoki `if (d.status === "picked_up")` bilan toraytirishga majbur.
    - `deliveryMinutes` endi 0 qaytarib yolg'on gapirmaydi: u faqat yetkazilgan buyurtma uchun chaqiriladi.
    - Sanalar chegarada `Date`ga aylantiriladi (`z.coerce.date()`), ichki kodda ISO satrlari qolmadi.
    - `as Delivery` olib tashlandi: chegarada zod parse qiladi va natija tiplangan. Bu "push the burden of proof upward".
    - Zod sxemasi va TS tipi alohida yozildi, shunda domen tipi zod'ga bog'liq emas. Kichik loyihada `z.infer<typeof DeliverySchema>` bilan tipni sxemadan chiqarish ham to'liq maqbul.
  checklist:
    - "Har holat faqat o'ziga tegishli maydonlarga ega, ixtiyoriy maydonlar yo'q"
    - "O'tish funksiyalari faqat ruxsat etilgan boshlang'ich holatni qabul qiladi"
    - "Tashqi JSON chegarada parse qilinadi, ichkarida `as` yo'q"
    - "Sanalar chegarada Date'ga aylanadi"
    - "Ichki funksiyalar maydon mavjudligini qayta tekshirmaydi"
---

## Muammo

Har bir katta TS loyihada shunday tip bor:

```ts
type Rental = {
  status: "draft" | "active" | "returned" | "cancelled";
  startedAt?: Date;
  returnedAt?: Date;
  odometerStart?: number;
  odometerEnd?: number;
  cancelReason?: string;
};
```

Va shunday funksiyalar:

```ts
function rentalDistance(r: Rental): number {
  if (r.odometerStart === undefined || r.odometerEnd === undefined) return 0;
  return r.odometerEnd - r.odometerStart;
}
```

Bu tip 4 holat va 5 ta ixtiyoriy maydonni birlashtiradi: nazariy jihatdan 4 x 32 = 128 kombinatsiya. Ulardan faqat to'rttasi ma'noli. Qolgan 124 tasi - "qaytarilgan, lekin qaytarilish vaqti yo'q", "bekor qilingan, lekin odometr ko'rsatkichi bor", "qoralama, lekin boshlangan" - tipda ruxsat etilgan. Har bir funksiya ulardan himoyalanish uchun o'z tekshiruvini yozadi va har biri boshqacha javob beradi: biri 0 qaytaradi, biri throw qiladi, biri `NaN` qaytaradi.

Ertami-kechmi biror migratsiya, webhook yoki qo'lda yozilgan SQL shunday noqonuniy holatni yaratadi. Va tizim jimgina noto'g'ri hisob-kitob qiladi.

## Asosiy g'oya

### Parse, don't validate

Alexis King 2019-yilgi "Parse, don't validate" maqolasida type-driven dizaynni bitta shiorga jamlaydi. Uning ta'riflari:

- **Validator** shartni tekshiradi va foydali hech narsa qaytarmaydi. U tekshiruvdan o'tdi, lekin bu bilim tipda yo'q, shuning uchun keyingi kod uni yana tekshirishi kerak.
- **Parser** xuddi shu tekshiruvni qiladi, lekin natijani aniqroq tip sifatida qaytaradi. King parser'ni kamroq strukturali kirishdan ko'proq strukturali chiqish yasaydigan, muvaffaqiyatsizlikka ham yo'l qo'yadigan funksiya deb ta'riflaydi.

Uning markaziy misoli Haskell'dagi `head` funksiyasi: ro'yxatning birinchi elementini qaytaradi, lekin bo'sh ro'yxatda ishlamaydi. Bir yechim - qaytish tipini `Maybe a` qilish. Lekin unda har bir chaqiruvchi "bo'sh bo'lsa-chi" holatini qayta ishlashi kerak, hatto ro'yxat bo'sh bo'lmasligini aniq bilsa ham. Yaxshiroq yechim - argument tipini kuchaytirish: `NonEmpty a`. Endi `head` har doim ishlaydi, tekshiruv esa bir marta, kirish chegarasida `nonEmpty` funksiyasida bajariladi. Agar kimdir keyinchalik bu tekshiruvni olib tashlasa, tiplar mos kelmay qoladi va kompilyator xato beradi.

### Noqonuniy holatlarni ifodalab bo'lmaydigan qilish

King maqolasining oxirida amaliy tavsiyalar beradi. Ularning eng mashhuri - **noqonuniy holatlarni ifodalab bo'lmaydigan qiling** (bu ibora Yaron Minsky bilan ham bog'lanadi): oqilona darajada eng aniq ma'lumot strukturasini tanlang. Masalan, takroriy kalitlar bo'lishi mumkin bo'lgan ro'yxat o'rniga `Map`.

Boshqa tavsiyalari:

- **Isbot yukini yuqoriga suring, lekin undan ham yuqoriga emas.** Ma'lumotni tizim chegarasida yoki u birinchi kerak bo'lgan joyda aniq shaklga keltiring.
- **Ma'lumot tiplari kodni boshqarsin**, aksincha emas: joriy funksiyaga qulay bo'lishi uchun yozuvga `Bool` flag qo'shmang.
- **Asosiy vazifasi xato tashlash bo'lgan, hech narsa qaytarmaydigan funksiyalarga shubha bilan qarang.**
- **Denormalizatsiyadan qoching**: bitta haqiqat manbai. Takrorlanish muqarrar bo'lsa, uni abstraksiya chegarasi ortiga yashiring.
- **Tip tizimi ifodalay olmaydigan cheklovlar uchun smart constructor ishlating**: abstrakt tip va uni yaratadigan yagona funksiya validator'ni parser'ga aylantiradi (44-darsdagi brand'lar aynan shu).

### Shotgun parsing

King LangSec (language-theoretic security) tadqiqotlaridan **shotgun parsing** atamasini oladi: kirishni tekshirish kod bo'ylab ishlov berish bilan aralash tarqalgan, va har bir joydagi tekshiruv "biror joyda xato ushlanar" degan umidda qo'yilgan. Asosiy xavf: ma'lumotning yaroqli qismi bo'yicha amal allaqachon bajarilgandan keyin yaroqsiz qism topiladi. Masalan, webhook'dagi buyurtmaning birinchi uch qatori omborda band qilingan, to'rtinchisida noto'g'ri SKU topildi. Endi orqaga qaytarish kerak, va bu har doim ham mumkin emas.

## Chuqurroq: TypeScript vositalari

### Discriminated union

TypeScript'da bu g'oyaning asosiy vositasi - discriminated (tagged) union. Vanderkam *Effective TypeScript*da faqat yaroqli holatlarni ifodalaydigan tiplarni afzal ko'rishni tavsiya qiladi va bunday dizayn kodni ham soddalashtirishini ko'rsatadi: tekshiruvlar kamayadi, chunki noqonuniy holatlar tipda yo'q.

```ts
type Rental =
  | { status: "draft"; vehicleId: string }
  | { status: "active"; vehicleId: string; startedAt: Date; odometerStart: number }
  | {
      status: "returned";
      vehicleId: string;
      startedAt: Date;
      returnedAt: Date;
      odometerStart: number;
      odometerEnd: number;
    }
  | { status: "cancelled"; vehicleId: string; cancelReason: string };

function rentalDistance(r: Extract<Rental, { status: "returned" }>): number {
  return r.odometerEnd - r.odometerStart;
}
```

128 kombinatsiya o'rniga 4 holat. `rentalDistance` endi 0 qaytarib yolg'on gapirmaydi, u faqat qaytarilgan ijara uchun chaqiriladi. Chaqiruvchi esa holatni toraytirishga majbur:

```ts
function summary(r: Rental): string {
  switch (r.status) {
    case "returned":
      return `${rentalDistance(r)} km`;
    case "active":
      return `boshlangan: ${r.startedAt.toISOString()}`;
    case "draft":
      return "qoralama";
    case "cancelled":
      return `bekor qilingan: ${r.cancelReason}`;
    default: {
      const unreachable: never = r;
      return unreachable;
    }
  }
}
```

`never` tekshiruvi yangi holat qo'shilganda barcha `switch`larni topadi (27-dars).

### O'tishlar ham tiplangan

Holat mashinasida o'tishlarni funksiyalar sifatida yozing, ular faqat ruxsat etilgan holatni qabul qilsin:

```ts run
type Active = Extract<Rental, { status: "active" }>;
type Returned = Extract<Rental, { status: "returned" }>;

function returnRental(r: Active, at: Date, odometerEnd: number): Returned {
  if (odometerEnd < r.odometerStart) {
    throw new RangeError("Odometr ko'rsatkichi kamayishi mumkin emas");
  }
  return { ...r, status: "returned", returnedAt: at, odometerEnd };
}

// Sinab ko'ring: odometr ko'rsatkichini o'zgartiring.
const active: Active = {
  status: "active",
  vehicleId: "01A123BC",
  startedAt: new Date("2026-10-20T09:00:00Z"),
  odometerStart: 48_200,
};
const returned = returnRental(active, new Date("2026-10-25T18:00:00Z"), 48_950);
console.log(returned.status, returned.odometerEnd - returned.odometerStart, "km");
try {
  returnRental(active, new Date(), 40_000);
} catch (e) {
  console.log((e as Error).message);
}
```

"Qoralamani qaytarish" endi kompilyatsiya xatosi. Runtime tekshiruvi faqat tip ifodalay olmaydigan narsa uchun qoldi (odometr kamaymasin).

### Chegarada zod bilan parse qilish

TS tiplari faqat kompilyatsiya vaqtida mavjud. HTTP so'rovi, webhook, navbat xabari, `localStorage`, hatto DB'dagi JSONB ustuni - bularning hammasi runtime'da `unknown`. Ularni `as Rental` bilan tiplash - parse emas, yolg'on. To'g'ri yo'l - chegarada runtime parser:

```ts
import * as z from "zod";

const RentalSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("draft"), vehicleId: z.uuid() }),
  z.object({
    status: z.literal("active"),
    vehicleId: z.uuid(),
    startedAt: z.coerce.date(),
    odometerStart: z.number().int().nonnegative(),
  }),
  z.object({
    status: z.literal("cancelled"),
    vehicleId: z.uuid(),
    cancelReason: z.string().min(1),
  }),
]);

export type IncomingRental = z.infer<typeof RentalSchema>;

export function parseRental(input: unknown): IncomingRental {
  const result = RentalSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Ijara ma'lumoti noto'g'ri: ${result.error.issues.length} ta xato`);
  }
  return result.data;
}
```

Zod 4 API haqida eslatmalar: `z.uuid()`, `z.email()`, `z.url()` endi top-level funksiyalar (ilgari `z.string().uuid()` edi). `z.discriminatedUnion` birinchi argument sifatida diskriminator kalitini, ikkinchisida obyekt sxemalari massivini oladi. `safeParse` throw qilmaydi va `success` bo'yicha ajratiladigan natija qaytaradi. `z.infer` sxemadan statik tip chiqaradi, shuning uchun tip va validatsiya bir-biridan ajralib ketmaydi.

## Misol: yoqilg'i quyish tranzaksiyasi

Yomon (validator):

```ts
type FuelTxn = { vehicleId?: string; liters?: number; cardNumber?: string; station?: string };

function validateFuelTxn(t: FuelTxn): void {
  if (!t.vehicleId) throw new Error("vehicleId yo'q");
  if (!t.liters || t.liters <= 0) throw new Error("litr noto'g'ri");
}

function recordTxn(t: FuelTxn) {
  validateFuelTxn(t);
  // t.liters hamon `number | undefined`, shuning uchun:
  const liters = t.liters ?? 0;
  // ...
}
```

`validateFuelTxn` hech narsa qaytarmaydi. U tekshirgan bilim yo'qoldi va `recordTxn` `?? 0` bilan uni qayta "tekshiradi".

Yaxshi (parser):

```ts
import * as z from "zod";

const FuelTxnSchema = z.object({
  vehicleId: z.uuid(),
  liters: z.number().positive().max(1000),
  cardNumber: z.string().regex(/^\d{16}$/),
  station: z.string().min(1),
});

export type FuelTxn = z.infer<typeof FuelTxnSchema>;

export function parseFuelTxn(input: unknown): FuelTxn {
  return FuelTxnSchema.parse(input);
}

export function recordTxn(t: FuelTxn): void {
  // t.liters - number, musbat ekani ma'lum. Qayta tekshiruv yo'q.
}
```

Nima o'zgardi va nega:

- **Bilim tipga yozildi.** `parseFuelTxn` natijasi - `FuelTxn`, unda barcha maydonlar majburiy. Ichki kod endi `undefined` bilan kurashmaydi.
- **Tekshiruv bir joyda.** Shotgun parsing yo'q: barcha qoidalar chegaradagi sxemada.
- **Tip va qoida ajralmaydi.** `z.infer` tipni sxemadan chiqaradi, shuning uchun yangi maydon qo'shilganda ikki joyni yangilash shart emas.
- **Butunlay muvaffaqiyat yoki butunlay xato.** Tranzaksiyaning biror qismi qayta ishlanmasdan oldin butun kirish tekshiriladi.

## Qachon qo'llamaslik kerak

- **Haddan tashqari murakkab invariantlar.** "Bron sanalari mavjud bronlar bilan kesishmasin" kabi qoidalar DB holatiga bog'liq va ularni tipda ifodalab bo'lmaydi. Kingning o'zi ham bu g'oyalar ideal ekanini va ba'zi invariantlarni to'liq kodlash mehnatga arzimasligini, izoh bilan hujjatlash yetarli bo'lishi mumkinligini aytadi.
- **Union portlashi.** Agar har bir maydon kombinatsiyasi alohida holat bo'lsa, 20 variantli union o'qishni qiyinlashtiradi. Ba'zan ikkita mustaqil o'q bor (masalan, to'lov holati va yetkazib berish holati) va ularni alohida maydonlarda saqlash to'g'riroq.
- **Ichki ishonchli ma'lumot.** O'z kodingiz yaratgan va hech qachon tizimdan chiqmagan obyektni har qadamda zod bilan qayta parse qilish ortiqcha. Parse - chegarada.
- **Performance-kritik oqimlar.** Sekundiga o'n minglab GPS nuqtasini zod bilan parse qilish o'lchanadigan narxga ega bo'lishi mumkin. Bunday joyda qo'lda yozilgan, tor parser yoki sxemani soddalashtirish kerak. O'lchang.
- **Juda erta talab qilish.** "Undan ham yuqoriga emas": agar qoralama bronda haydovchi hali tanlanmagan bo'lsa, formada `driverId`ni majburiy qilish UX'ni buzadi. Majburiylik ma'lumot haqiqatan kerak bo'lgan bosqichda.

## Stack'da: NestJS, Next.js, React

- **NestJS.** `ValidationPipe` + `class-validator` - validator: DTO klassi tekshiriladi, lekin tiplar (`?` maydonlar) noqonuniy holatlarga yo'l qo'yishi mumkin. Zod asosidagi custom pipe parse qilingan, aniq tipni beradi. Har qanday holatda servisga yetib boradigan tip noqonuniy kombinatsiyalarsiz bo'lsin.
- **Next.js server action va route handler'lar.** `formData` va `request.json()` - har doim `unknown`. Birinchi qatorda zod bilan parse qiling.
- **React state.** `{ isLoading: boolean; error?: string; data?: T }` - klassik noqonuniy holatlar manbai (`isLoading: true` va `error` birga). O'rniga `{ status: "loading" } | { status: "error"; error: string } | { status: "success"; data: T }`. React hujjatlari ham state strukturasida ziddiyatli holatlardan qochishni tavsiya qiladi.
- **Konfiguratsiya.** `process.env` ni ilova ishga tushganda bir marta parse qiling (86-dars). Shundan keyin `config.port` - `number`, `string | undefined` emas.
- **DB'dagi JSONB ustunlar.** Prisma ularni `JsonValue` deb qaytaradi. Repository ichida zod bilan parse qiling, aks holda eski formatdagi qatorlar jimgina noto'g'ri ishlaydi.

## Xulosa

- Validator tekshiradi va bilimni tashlaydi, parser tekshiradi va bilimni tipga yozadi.
- Noqonuniy holatlarni tipda imkonsiz qiling: ixtiyoriy maydonlar to'plami o'rniga discriminated union.
- Holat o'tishlarini faqat ruxsat etilgan holatni qabul qiladigan funksiyalar sifatida yozing.
- Tashqi ma'lumotni chegarada bir marta parse qiling (zod), ichkarida `as` va qayta tekshiruvlar bo'lmasin. Shotgun parsing'dan qoching.
- Tip ifodalay olmaydigan invariantlar uchun smart constructor va izoh. Ideal va pragmatizm o'rtasidagi balansni Kingning o'zi ham tan oladi.
