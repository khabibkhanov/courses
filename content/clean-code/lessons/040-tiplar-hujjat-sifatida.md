---
n: 40
slug: tiplar-hujjat-sifatida
title: "O'zini hujjatlovchi kod va uning chegarasi"
summary: "Yaxshi nomlar va aniq tiplar kommentning katta qismini almashtiradi, va ular kompilyator tomonidan tekshiriladi. Lekin \"kod o'zini o'zi hujjatlaydi\" degan da'voning chegarasi bor. Bu darsda TypeScript tiplarini hujjat sifatida ishlatishni va qaysi bilim baribir faqat matnda yashashini ko'ramiz."
duration: 35
sources:
  - id: effective-ts
    note: "Tiplar va hujjatlash haqidagi bandlar: tip ma'lumotini kommentda takrorlamaslik, birliklarni nomga kiritish, noto'g'ri holatlarni ifodalab bo'lmaydigan tiplar, string o'rniga literal union, JSDoc/TSDoc ishlatish"
  - id: aposd
    note: "\"Why Write Comments? The Four Excuses\": \"yaxshi kod o'zini o'zi hujjatlaydi\" bahonasining tanqidi"
  - id: cc1
    note: "Kommentlar bobidagi \"Explain Yourself in Code\" g'oyasi va nomlash boblari"
quiz:
  - q: "Vanderkam tip ma'lumotini kommentda takrorlash haqida nima deydi?"
    options:
      - "Tip va kommentni sinxron saqlash uchun ikkalasini ham yozish kerak"
      - "Tip ma'lumoti kommentda takrorlanmasligi kerak: tip tekshiriladi va kod bilan birga o'zgaradi, komment esa eskiradi va ziddiyatga olib keladi"
      - "Kommentlar tiplardan muhimroq"
      - "Tiplarni faqat kommentda yozish kerak"
    answer: 1
    explain: "Effective TypeScript bu fikrni alohida band sifatida beradi: \"`@param name string`\" yoki \"bu funksiya string qaytaradi\" kabi kommentlar tipni takrorlaydi. Tip kompilyator tomonidan tekshiriladi, komment esa yo'q, shuning uchun ular ajralib ketadi."
  - q: "Quyidagi qaysi tip \"status\" haqida eng ko'p hujjat beradi?"
    options:
      - "`status: string`"
      - "`status: number`"
      - "`status: \"pending\" | \"paid\" | \"refunded\"`"
      - "`status: any`"
    answer: 2
    explain: "Literal union mumkin bo'lgan qiymatlarni sanab beradi, IDE'da avtomatik to'ldirishni yoqadi va noto'g'ri qiymatni kompilyatsiya vaqtida rad etadi. `string` yoki `number` bilan bu ma'lumot faqat kommentda yashardi."
  - q: "Ousterhout \"yaxshi kod o'zini o'zi hujjatlaydi\" degan da'voga qanday javob beradi?"
    options:
      - "U bu da'voga to'liq qo'shiladi"
      - "U kommentlarni butunlay rad etadi"
      - "U faqat Java uchun to'g'ri deydi"
      - "Yaxshi nom va tiplar ko'p narsani ifodalaydi, lekin interfeysning ko'p muhim qismi (nega, cheklovlar, abstraksiyaning ma'nosi) kodda ifodalanmaydi"
    answer: 3
    explain: "Ousterhout bu da'voni komment yozmaslik uchun bahonalardan biri deb ko'radi. Uning fikricha, kod qanday ishlashini ko'rsatadi, lekin nima uchun va qanday shartnoma asosida ishlashini ko'pincha ko'rsata olmaydi."
  - q: "Funksiya `function createTrip(start: Date, end: Date, distance: number)` imzosiga ega. Masofa birligi noaniq. Eng yaxshi birinchi qadam?"
    options:
      - "Parametr nomini `distanceMeters` qilish (birlik nomda)"
      - "Funksiya ustiga \"masofa metrda\" kommentini yozish"
      - "Hech narsa qilmaslik"
      - "Masofani `string` qilish"
    answer: 0
    explain: "Birlikni nomga kiritish uni har bir chaqiruv joyida ko'rinadigan qiladi va kommentdan ko'ra ishonchliroq. Effective TypeScript ham birliklarni nomga kiritishni tavsiya qiladi. Keyingi qadam branded tip bo'lishi mumkin (44-dars)."
  - q: "Qaysi ma'lumotni TypeScript tiplari bilan ifodalab BO'LMAYDI?"
    options:
      - "Funksiya `null` qaytarishi mumkinligi"
      - "Ob'ekt maydoni ixtiyoriy ekani"
      - "Nega retry soni aynan 3 ta ekani va qaysi tashqi cheklov bunga sabab bo'lgani"
      - "Qiymat faqat uchta satrdan biri bo'lishi mumkinligi"
    answer: 2
    explain: "`null`, ixtiyoriylik va literal union'lar tipning odatiy vazifasi. Qarorning sababi va tashqi kontekst esa tip tizimining doirasidan tashqarida, ular faqat matnda (komment yoki ADR) yashaydi."
  - q: "Discriminated union ishlatilgan kodda `switch` ichida `const _exhaustive: never = event;` qatori bor. U qanday hujjat vazifasini bajaradi?"
    options:
      - "Hech qanday, u faqat performance uchun"
      - "Yangi variant qo'shilganda kompilyator bu joyni ko'rsatadi: \"barcha holatlar qayta ishlangan\" degan da'vo tekshiriladigan bo'ladi"
      - "U runtime'da xatoni yashiradi"
      - "U Prettier qoidasi"
    answer: 1
    explain: "Exhaustiveness check \"bu switch barcha hodisa turlarini qamraydi\" degan kommentni almashtiradi va undan kuchliroq: union'ga yangi tur qo'shilsa, kompilyator xato beradi. Bu tip-hujjatning eng yaxshi namunasi (27-dars)."
task:
  title: "Kommentlarni tiplarga ko'chirish va qolganini aniqlash"
  prompt: |
    Quyidagi kodda ma'lumotning katta qismi kommentlarda. Vazifa:

    1. Tip tizimi bilan ifodalanishi mumkin bo'lgan har bir kommentni tipga yoki nomga ko'chiring (literal union, discriminated union, ixtiyoriylik, birlikli nomlar, `readonly`).
    2. Tip bilan ifodalab bo'lmaydigan ma'lumotni komment sifatida qoldiring.
    3. `switch`ga exhaustiveness check qo'shing.
    4. Natijada qaysi kommentlar qolganini va nega qolganini qisqa yozing.
  lang: ts
  starter: |
    // status: 0 - kutilmoqda, 1 - yo'lda, 2 - yetkazildi, 3 - bekor qilindi
    // deliveredAt faqat status 2 bo'lganda bor
    // cancelReason faqat status 3 bo'lganda bor
    // weight - kg, distance - km
    type Shipment = {
      id: string;
      status: number;
      weight: number;
      distance: number;
      deliveredAt?: Date;
      cancelReason?: string;
    };

    // narx tiyinda qaytariladi
    // 1 km uchun 1200 tiyin, 1 kg uchun 300 tiyin, minimal 50000 tiyin
    export function price(s: Shipment): number {
      // bekor qilinganlar uchun narx 0
      if (s.status === 3) return 0;
      const raw = s.distance * 1200 + s.weight * 300;
      return Math.max(raw, 50000);
    }

    export function label(s: Shipment): string {
      switch (s.status) {
        case 0: return "Kutilmoqda";
        case 1: return "Yo'lda";
        case 2: return `Yetkazildi: ${s.deliveredAt?.toLocaleDateString("uz-UZ")}`;
        case 3: return `Bekor: ${s.cancelReason}`;
        default: return "?";
      }
    }
  solution: |
    type ShipmentBase = {
      readonly id: string;
      readonly weightKg: number;
      readonly distanceKm: number;
    };

    export type Shipment =
      | (ShipmentBase & { status: "pending" })
      | (ShipmentBase & { status: "in_transit" })
      | (ShipmentBase & { status: "delivered"; deliveredAt: Date })
      | (ShipmentBase & { status: "cancelled"; cancelReason: string });

    const TIYIN_PER_KM = 1_200;
    const TIYIN_PER_KG = 300;
    // Minimal narx yuk mashinasini chaqirishning o'zgarmas xarajatini qoplaydi
    // (haydovchi vaqti va yoqilg'i). Tarif tijorat bo'limi tomonidan belgilanadi.
    const MIN_PRICE_TIYIN = 50_000;

    export function priceTiyin(shipment: Shipment): number {
      if (shipment.status === "cancelled") return 0;
      const raw = shipment.distanceKm * TIYIN_PER_KM + shipment.weightKg * TIYIN_PER_KG;
      return Math.max(raw, MIN_PRICE_TIYIN);
    }

    export function statusLabel(shipment: Shipment): string {
      switch (shipment.status) {
        case "pending":
          return "Kutilmoqda";
        case "in_transit":
          return "Yo'lda";
        case "delivered":
          return `Yetkazildi: ${shipment.deliveredAt.toLocaleDateString("uz-UZ")}`;
        case "cancelled":
          return `Bekor: ${shipment.cancelReason}`;
        default: {
          const unhandled: never = shipment;
          throw new Error(`Unknown shipment status: ${JSON.stringify(unhandled)}`);
        }
      }
    }
  solutionNotes: |
    - **Status kodlari** (`0..3` va ularning kommenti) literal union'ga aylandi. Endi qiymatlar ro'yxati tipda, IDE avtomatik to'ldiradi, `status === 5` kompilyatsiya bo'lmaydi.
    - **"deliveredAt faqat status 2 bo'lganda"** discriminated union bilan ifodalandi. Endi `delivered` holatida `deliveredAt` majburiy, boshqa holatlarda umuman yo'q. `s.deliveredAt?.` dagi `?.` yo'qoldi, chunki kompilyator mavjudligini kafolatlaydi (45-dars).
    - **Birliklar** (`kg`, `km`, `tiyin`) maydon va funksiya nomlariga ko'chdi. Komment endi kerak emas.
    - **Tarif raqamlari** nomlangan konstantalarga aylandi: ular o'zini tushuntiradi.
    - **`default: return "?"`** exhaustiveness check bilan almashtirildi. Yangi status qo'shilsa, kompilyator `statusLabel`ni ko'rsatadi. Bu "barcha holatlar qamrab olingan" degan da'voni tekshiriladigan qiladi.
    - **Qolgan yagona komment** - minimal narxning sababi va uni kim belgilashi. Bu biznes konteksti, uni hech qanday tip ifodalay olmaydi. Bu Ousterhout tanqidining amaliy isboti: eng yaxshi tiplangan kodda ham "nega" qoladi.
    - `"bekor qilinganlar uchun narx 0"` kommenti o'chirildi: `if (shipment.status === "cancelled") return 0;` buni o'zi aytadi.
  checklist:
    - "Raqamli status kodlari literal union'ga aylandi"
    - "Holatga bog'liq maydonlar discriminated union bilan ifodalangan"
    - "Birliklar nomlarda"
    - "switch'da never bilan exhaustiveness check bor"
    - "Faqat tip bilan ifodalab bo'lmaydigan komment(lar) qoldi va ular \"nega\"ni aytadi"
---

## Muammo

Bu modulning oxirgi darsi oldingi to'qqizta darsni bir savolga keltiradi: kod o'zini o'zi qanchalik hujjatlay oladi?

Bir tomonda Martinning tavsiyasi: kommentni yozishdan oldin, buni kod bilan ifodalashga urinib ko'ring (31-dars). Ko'p jamoalar buni "kod o'zini o'zi hujjatlaydi, komment kerak emas" degan shiorga aylantiradi. Ikkinchi tomonda Ousterhout: bu shior - komment yozmaslik uchun eng keng tarqalgan bahona.

TypeScript bu bahsga yangi o'lchov qo'shadi. JavaScript'da `status` nima bo'lishi mumkinligini faqat kommentda yozish mumkin edi. TypeScript'da esa `status: "pending" | "paid" | "refunded"` - bu hujjat, va u kompilyator tomonidan tekshiriladi. Kod bazasidagi kommentlarning katta qismi aslida tip ma'lumoti: "bu string", "null bo'lishi mumkin", "faqat 0, 1 yoki 2", "bu maydon faqat X holatida bor". Bularning hammasini tipga ko'chirish mumkin.

Lekin TypeScript'da yaxshi tiplangan kodda ham shunday savollar qoladi: "nega minimal narx 50 000?", "nega bu so'rov ketma-ket?", "bu qiymat qachon o'zgaradi?". Bu darsning maqsadi - tip tizimini hujjat sifatida to'liq ishlatish va uning chegarasini aniq ko'rish.

## Asosiy g'oya

### Tiplar - tekshiriladigan hujjat

Dan Vanderkam *Effective TypeScript*da tiplarni hujjat sifatida ko'rish haqida bir nechta amaliy tavsiya beradi. Ularning markazidagi g'oya: tip kompilyator tomonidan tekshiriladi va kod bilan birga o'zgaradi, komment esa yo'q. Shuning uchun **tip ma'lumotini kommentda takrorlamang**. Agar kommentda "bu funksiya string qaytaradi" yozilgan bo'lsa va tip `number` bo'lsa, qaysi biri to'g'ri? Kompilyator tipga ishonadi, o'quvchi esa ikkilanadi.

Vanderkam'ning shu mavzudagi boshqa tavsiyalari:

- **Birlikni nomga kiriting**, agar u tipda bo'lmasa: `timeoutMs`, `distanceKm`, `amountTiyin`.
- **`string` o'rniga literal union** ishlating, agar qiymatlar to'plami cheklangan bo'lsa.
- **Noto'g'ri holatlarni ifodalab bo'lmaydigan tiplar** quring: holatga bog'liq maydonlar uchun discriminated union (45-dars).
- **`readonly`** bilan o'zgartirmaslik niyatini ifodalang.
- Kommentlarni TSDoc formatida yozing, shunda ular IDE'da ko'rinadi (34-dars).

### Martin: "kodda o'zingizni tushuntiring"

*Clean Code*ning kommentlar bobida Martin oddiy misol keltiradi: murakkab shart ustidagi "xodim to'liq imtiyozga haqlimi" kommentini nomlangan funksiyaga (`isEligibleForFullBenefits()`) almashtirish. Komment yo'qoladi, ma'lumot esa qoladi va endi u har bir chaqiruv joyida ko'rinadi. Bu Extract Function va Rename refaktoringlarining hujjat sifatidagi qo'llanilishi.

### Ousterhout: "o'zini hujjatlovchi kod" bahonasi

Ousterhout bu yondashuvga qo'shiladi, lekin chegarani ko'rsatadi. *A Philosophy of Software Design*da u komment yozmaslik uchun keltiriladigan to'rt bahonani tahlil qiladi va birinchisi - aynan "yaxshi kod o'zini o'zi hujjatlaydi". Uning javobi: yaxshi nomlar va tiplar haqiqatan ko'p narsani beradi va ularni ishlatish kerak. Lekin ko'p muhim ma'lumot kodda ifodalanmaydi: metodning yuqori darajadagi maqsadi, nega shunday yondashuv tanlangani, qanday shartlar ostida uni chaqirish mumkin, natijaning ma'nosi. Agar bu ma'lumot yozilmasa, foydalanuvchi uni kodni o'qib tiklashi kerak - bu esa abstraksiyaning ma'nosini yo'qotadi.

### Umumiy xulosa

Ikkala qarashni birlashtirgan qoida: **avval ma'lumotni tekshiriladigan shaklga (nom, tip, test) ko'chiring. Ko'chirib bo'lmaydigan qoldiq - komment.** Tip tizimi qancha kuchli bo'lsa, qoldiq shuncha kichik, lekin u hech qachon nolga teng emas.

## Chuqurroq: tip nimani ayta oladi va nimani ayta olmaydi

### Tip ifodalaydigan ma'lumot

| Komment | Tip/nom bilan |
| --- | --- |
| "null bo'lishi mumkin" | `Vehicle \| null` |
| "ixtiyoriy" | `driverId?: string` |
| "faqat 'day' yoki 'night'" | `shift: "day" \| "night"` |
| "deliveredAt faqat yetkazilganda bor" | discriminated union |
| "o'zgartirmang" | `readonly`, `ReadonlyArray<T>` |
| "soniyalarda" | `timeoutSec` yoki branded `Seconds` |
| "kamida bitta element" | `[T, ...T[]]` |
| "barcha holatlar qayta ishlangan" | `never` bilan exhaustiveness check |
| "bu funksiya xato tashlashi mumkin" | `Result<T, E>` qaytarish (28-dars) |
| "faqat tasdiqlangan email" | branded tip `VerifiedEmail` (44-dars) |

Har bir qatorda o'ng ustun chap ustundan kuchliroq: u tekshiriladi, IDE'da ko'rinadi va kod o'zgarganda kompilyator ziddiyatni ko'rsatadi.

### Tip ifodalay olmaydigan ma'lumot

1. **Sabab.** Nega minimal narx 50 000, nega timeout 30 soniya, nega bu yerda tranzaksiya yo'q.
2. **Rad etilgan alternativa.** "`Promise.all` emas, chunki tashqi API parallel so'rovlarni bloklaydi."
3. **Tashqi dunyo faktlari.** Qurilma 0,0 koordinata yuboradi, provayder hujjatda aytilganidan boshqacha javob qaytaradi.
4. **Semantik ma'no.** `safetyScore: number` - bu 0-100 oraliqmi, katta yaxshimi, qanday hisoblanadi? Branded tip oraliqni qisman ifodalaydi, lekin hisoblash usulini emas.
5. **Performance va murakkablik kafolatlari.** "O(n log n)", "har chaqiruvda DB'ga boradi", "natija keshlanadi".
6. **Concurrency va tartib.** "Bu metod idempotent", "parallel chaqiruvlar xavfsiz emas".
7. **Vaqtinchalik holatlar.** "FLEET-412 tuzatilguncha takror paketlar bo'lishi mumkin."

Bu ro'yxat - aslida 32-darsdagi "yaxshi kommentlar" ro'yxati. Tiplar takroriy kommentlarni yo'q qiladi va faqat qimmatli kommentlarni qoldiradi.

### Testlar ham hujjat

Tip shaklni tekshiradi, test esa xatti-harakatni. "Bo'sh ro'yxatda 0 qaytaradi" yoki "bekor qilingan yuk uchun narx 0" kabi da'volar test nomi sifatida yozilsa, ular ham tekshiriladigan hujjatga aylanadi (63-dars). Ammo testni faqat kodni o'zgartiradigan odam o'qiydi. Funksiyani *chaqiradigan* odam uchun interfeys kommenti va tip asosiy hujjat bo'lib qoladi.

### Haddan oshirilgan tiplar ham hujjatni buzadi

Tip tizimini hujjat sifatida ishlatishning teskari tomoni bor. Uch qatlamli conditional type, mapped type va template literal'lardan tuzilgan "aqlli" tip o'z-o'zidan tushunarsiz bo'lishi mumkin. Agar tipni o'qish implementatsiyani o'qishdan qiyin bo'lsa, u hujjat vazifasini bajarmayapti. Bunday tiplar ham nomlanishi, kichik bo'laklarga bo'linishi va kerak bo'lsa kommentlanishi kerak. Vanderkam ham tiplarni testlash va murakkab tiplarni soddalashtirish haqida alohida yozadi.

## Misol: to'lov natijasi

Kommentlarga tayangan versiya:

```ts
// result.ok true bo'lsa transactionId bor, false bo'lsa error bor
// error.code: "insufficient_funds" | "card_expired" | "provider_down"
// retryable faqat provider_down uchun true
type ChargeResult = {
  ok: boolean;
  transactionId?: string;
  error?: { code: string; retryable: boolean };
};

function handle(result: ChargeResult): string {
  if (result.ok) return `To'landi: ${result.transactionId}`;
  if (result.error!.retryable) return "Keyinroq qayta urinib ko'ring";
  return `Rad etildi: ${result.error!.code}`;
}
```

Muammolar: `ok: true` va `error` bir vaqtda bo'lishi mumkin, `!` operatori kommentga ishonishni talab qiladi, `code` istalgan string, `retryable` qoidasi faqat kommentda.

Tiplar bilan ifodalangan versiya:

```ts
type DeclineCode = "insufficient_funds" | "card_expired";

type ChargeResult =
  | { kind: "success"; transactionId: string }
  | { kind: "declined"; code: DeclineCode }
  | { kind: "provider_unavailable"; retryAfterSec: number };

function describeCharge(result: ChargeResult): string {
  switch (result.kind) {
    case "success":
      return `To'landi: ${result.transactionId}`;
    case "declined":
      return `Rad etildi: ${result.code}`;
    case "provider_unavailable":
      return `Provayder ishlamayapti, ${result.retryAfterSec} soniyadan keyin urinib ko'ring`;
    default: {
      const unhandled: never = result;
      return unhandled;
    }
  }
}
```

Nima o'zgardi va nega:

- **Uchta komment yo'qoldi**, chunki ularning hammasi tipga ko'chdi. "ok bo'lsa transactionId bor" - endi `success` variantida `transactionId` majburiy. Kod kommentga emas, kompilyatorga tayanadi: `!` operatorlari kerak emas.
- **`retryable: boolean` yo'qoldi.** Qoida "faqat provider_down uchun retry" edi. Endi qayta urinish mumkin bo'lgan holat alohida variant va unda qachon urinish kerakligi (`retryAfterSec`) bor. Noto'g'ri kombinatsiya (`card_expired` va `retryable: true`) ifodalab bo'lmaydi.
- **Exhaustiveness check:** yangi `kind` qo'shilsa, `describeCharge` kompilyatsiya bo'lmaydi.

Lekin bir savol hali javobsiz: provayder `retryAfterSec` qiymatini qayerdan oladi va unga ishonish mumkinmi? Agar u provayderning `Retry-After` header'idan kelsa va ba'zan juda katta qiymat bo'lsa, bu - interfeys kommenti uchun ma'lumot:

```ts
type ChargeResult =
  | { kind: "success"; transactionId: string }
  | { kind: "declined"; code: DeclineCode }
  | {
      kind: "provider_unavailable";
      /** Provayderning Retry-After header'idan, 300 soniya bilan cheklangan. */
      retryAfterSec: number;
    };
```

Tip shaklni aytdi, komment esa manba va cheklovni. Bu - o'zini hujjatlovchi kodning chegarasi.

## Qachon qo'llamaslik kerak

- **"Tip bor, komment kerak emas" dogmasi.** Tiplar shaklni beradi, ma'noni emas. Eng yaxshi tiplangan public API ham sabab, cheklov va kafolatlar uchun interfeys kommentiga muhtoj (34-dars).
- **Har bir g'oyani tipga majburlash.** "Email tasdiqlangan", "summa musbat", "ro'yxat saralangan" kabi invariantlarni branded tiplar bilan ifodalash kuchli, lekin har bir kichik joyda emas. Ichki, bitta funksiyadan foydalaniladigan qiymat uchun bu ortiqcha ceremony. Branded tiplar asosan modul chegaralarida, qiymat ko'p joyga uzatilganda foyda beradi (44-dars).
- **Murakkab type-level dasturlash.** Tipni tushunish uchun 10 daqiqa kerak bo'lsa, u o'quvchini emas, muallifni xursand qiladi. Oddiyroq tip va bitta komment ko'pincha yaxshiroq.
- **Uzun nomlar bilan hamma narsani aytishga urinish.** `getActiveVehiclesWithFuelSensorExcludingArchivedForCurrentTenant()` - nom emas, komment. Martin uzun nomlarni afzal ko'radi, lekin ham Ousterhout, ham amaliyot ko'rsatadiki, nom qisqa tanib olish uchun, to'liq shartnoma esa kommentda (31-dars).
- **Tashqi ma'lumotga ko'r-ko'rona ishonish.** Tip faqat kompilyatsiya vaqtida tekshiriladi. API javobi yoki DB qatori runtime'da boshqa shaklda kelishi mumkin. Chegara nuqtalarida runtime validatsiya (zod) kerak, aks holda tip - yolg'on hujjat (91-dars).

## Stack'da: NestJS, Next.js, Prisma

- **NestJS DTO'lari.** `class-validator` dekoratorlari (`@IsIn(["day", "night"])`) va TS tipi (`shift: "day" | "night"`) bir xil bilimni ikki marta ifodalaydi. Zod sxemasidan tipni chiqarish (`z.infer`) bilimni bitta joyda saqlaydi. Qaysi yondashuv tanlansa ham, DTO maydonlaridagi kommentlar faqat tip va validatsiya aytmaydigan narsa uchun bo'lsin.
- **Prisma generatsiya qilgan tiplar.** `schema.prisma`dagi `enum ShipmentStatus` TypeScript'da literal union'ga aylanadi. Schema faylidagi `///` kommentlar oddiy `//` dan farqli ravishda schema AST'siga kiradi va generatorlar ularni ishlata oladi. Ular generatsiya qilingan client tiplarida qanday ko'rinishini o'z Prisma versiyangizda tekshiring. Maqsad bir xil: maydon ma'nosini bir marta, sxemaning o'zida yozish.
- **Next.js `params` va `searchParams`.** Sahifa props'larini aniq tiplash va URL parametrlarini zod bilan parse qilish "bu parametr raqam bo'lishi kerak" kabi kommentlarni yo'qotadi.
- **`satisfies` operatori.** Konfiguratsiya obyektlarida `as const satisfies Record<Plan, PlanLimits>` - har bir tarif uchun limit borligini kafolatlaydi va "barcha tariflar shu yerda bo'lishi kerak" kommentini almashtiradi (91-dars).
- **typescript-eslint.** `switch-exhaustiveness-check` qoidasi (typed linting) union bo'yicha `switch`larda yetishmayotgan holatlarni topadi, `never` qatorini qo'lda yozmasdan ham (37-dars).

## Xulosa

- Tiplar - tekshiriladigan hujjat. Tip ma'lumotini kommentda takrorlamang: tip kod bilan o'zgaradi, komment esa eskiradi.
- Literal union, discriminated union, `readonly`, birlikli nomlar va exhaustiveness check kommentlarning katta qismini almashtiradi.
- Martin: avval kodda tushuntiring. Ousterhout: "kod o'zini hujjatlaydi" - bahona, chunki sabab, cheklov va shartnoma kodda ifodalanmaydi. Ikkalasi ham to'g'ri, har biri o'z qismida.
- Qoida: ma'lumotni avval nom, tip yoki testga ko'chiring. Ko'chirib bo'lmaydigan qoldiq - komment, va u eng qimmatli komment.
- Haddan oshirilgan type-level kod ham hujjatni buzadi. Tip o'qilishi kerak, aks holda u hujjat emas.
