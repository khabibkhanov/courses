---
n: 22
slug: bitta-ish-abstraksiya-darajasi
title: "Bitta ish va bir abstraksiya darajasi"
summary: "\"Funksiya bitta ish qilsin\" qoidasi qanday tekshiriladi va nega u ko'pincha noto'g'ri tushuniladi. Abstraksiya darajalarini aralashtirmaslik, stepdown qoidasi va Ousterhoutning \"har bir qatlam yangi abstraksiya bersin\" talabi."
duration: 35
sources:
  - id: cc1
    note: "3-bob \"Functions\": \"Do One Thing\", \"One Level of Abstraction per Function\" va \"The Stepdown Rule\" bo'limlari"
  - id: cc2
    note: "Qayta yozilgan nashrdagi funksiyalar haqidagi boblar: bitta ish va abstraksiya darajalari bo'yicha yangilangan tushuntirish"
  - id: aposd
    note: "\"Different Layer, Different Abstraction\" bobi: pass-through metodlar va qatlamlar; \"Pull Complexity Downwards\" bobi"
quiz:
  - q: "Quyidagi funksiyalardan qaysi biri abstraksiya darajalarini eng ko'p aralashtiradi?"
    options:
      - "`async function registerDriver(dto) { const driver = validate(dto); await save(driver); await notify(driver); }`"
      - "`function totalLiters(events) { return events.reduce((s, e) => s + e.liters, 0); }`"
      - "`function isExpired(license, now) { return license.expiresAt < now; }`"
      - "`async function closeShift(shiftId) { const shift = await shifts.find(shiftId); if (!/^\\d{4}-\\d{2}$/.test(shift.code)) throw ...; await db.query('UPDATE shifts SET ...'); await mailer.send(...); }`"
    answer: 3
    explain: "closeShift bir funksiyada biznes qadam (smenani yopish), past darajadagi regex, xom SQL va xabar yuborishni aralashtiradi. registerDriver ham uch qadam qiladi, lekin hammasi bir darajada. Qolgan ikkitasi bir darajali kichik funksiyalar."
  - q: "Martinning stepdown qoidasi nimani talab qiladi?"
    options:
      - "Har bir funksiya faqat o'zidan pastdagi funksiyalarni chaqirsin va kod yuqoridan pastga, abstraksiya darajasi bir pog'onadan tushib o'qilsin"
      - "Funksiyalar alifbo tartibida joylashsin"
      - "Har bir funksiya avvalgisidan qisqaroq bo'lsin"
      - "Private funksiyalar faylning boshida tursin"
    answer: 0
    explain: "Stepdown qoidasi faylni hikoya kabi o'qishni maqsad qiladi: yuqorida eng yuqori darajadagi funksiya, uning ostida u chaqiradigan keyingi darajadagilar. Alifbo tartibi yoki uzunlik bu qoidaga aloqasiz."
  - q: "Ousterhoutning \"pass-through method\" deb atagani nima va u nega muammo?"
    options:
      - "Argumentlarni tekshiradigan metod; u ortiqcha tekshiruv qo'shadi"
      - "Rekursiv metod; u stack'ni to'ldiradi"
      - "Argumentlarini deyarli o'zgartirmasdan boshqa metodga uzatadigan metod; u yangi abstraksiya bermasdan interfeys qo'shadi"
      - "Exception'ni qayta tashlaydigan metod; u stack trace'ni buzadi"
    answer: 2
    explain: "Pass-through metod ikki qatlamning bir xil abstraksiyaga ega ekanini ko'rsatadi. Ousterhout har bir qatlam o'zidan yuqori va pastdagidan farqli abstraksiya berishi kerak deydi. Bunday metod faqat sakrash qo'shadi."
  - q: "Funksiya bir nechta qadamni bajaradi: buyurtmani yuklaydi, narxni hisoblaydi, saqlaydi. Martin mezoniga ko'ra u qachon \"bitta ish\" qilgan bo'ladi?"
    options:
      - "Faqat bitta qadam qolguncha bo'lingan bo'lsa"
      - "Barcha qadamlar funksiya nomi aytgan darajadan bir pog'ona pastda bo'lsa va ulardan funksiyani takrorlamaydigan nomli bo'lak ajratib bo'lmasa"
      - "Funksiya 10 qatordan kam bo'lsa"
      - "Funksiyada faqat bitta await bo'lsa"
    answer: 1
    explain: "Martin uchun bir nechta qadam bitta ishga zid emas, agar ular hammasi nom ostidagi bir darajada bo'lsa. Muammo qadamlar soni emas, balki darajalarning aralashishi. Qatorlar va await soni bu mezonga kirmaydi."
  - q: "Nega \"bitta ish\" qoidasi Ousterhout tomonidan tanqid qilinadi?"
    options:
      - "Chunki u faqat Java uchun mo'ljallangan"
      - "Chunki u funksiyalarni juda uzun qiladi"
      - "Chunki u kommentlarni taqiqlaydi"
      - "Chunki \"bitta ish\"ning chegarasi noaniq va qoida to'xtash nuqtasini bermaydi, natijada haddan tashqari bo'lishga olib kelishi mumkin"
    answer: 3
    explain: "Deyarli har qanday kodni bir nechta \"ish\" sifatida talqin qilish mumkin. Ousterhout shuning uchun qoidani yetarli mezon emas deb hisoblaydi va uning o'rniga interfeys soddaligi va entanglement'ni tekshirishni taklif qiladi."
task:
  title: "Aralashgan darajalarni ajratish"
  prompt: |
    Quyidagi NestJS-uslubidagi service metodi ijara shartnomasini yakunlaydi. U ishlaydi, lekin bir funksiyada biznes qadamlar, sana arifmetikasi, SQL va matn formatlash aralashib ketgan.

    1. Har bir qatorni abstraksiya darajasiga ko'ra belgilang: biznes qadam, domen hisob-kitobi, infratuzilma (SQL, email).
    2. Metodni shunday qayta yozingki, public metod faqat biznes qadamlarni bir darajada o'qisin.
    3. Pass-through metodlar yaratmang: har bir ajratilgan funksiya o'z nomidan ko'proq narsani yashirsin.
  lang: ts
  starter: |
    type Db = { query<T>(sql: string, params: unknown[]): Promise<T[]> };
    type Mailer = { send(to: string, subject: string, body: string): Promise<void> };
    type Rental = { id: string; renterEmail: string; startAt: Date; dailyRate: number; status: "active" | "closed" };

    export class RentalService {
      constructor(private readonly db: Db, private readonly mailer: Mailer) {}

      async close(rentalId: string, returnedAt: Date): Promise<number> {
        const rows = await this.db.query<Rental>("SELECT * FROM rentals WHERE id = $1", [rentalId]);
        const rental = rows[0];
        if (!rental || rental.status !== "active") throw new Error("Rental not active");
        const ms = returnedAt.getTime() - rental.startAt.getTime();
        let days = Math.ceil(ms / (1000 * 60 * 60 * 24));
        if (days < 1) days = 1;
        const total = days * rental.dailyRate;
        await this.db.query("UPDATE rentals SET status = 'closed', returned_at = $2, total = $3 WHERE id = $1", [rentalId, returnedAt, total]);
        const body = "Hurmatli mijoz, ijara yopildi. Kunlar: " + days + ". Jami: " + total.toLocaleString("uz-UZ") + " so'm.";
        await this.mailer.send(rental.renterEmail, "Ijara yopildi", body);
        return total;
      }
    }
  solution: |
    type Db = { query<T>(sql: string, params: unknown[]): Promise<T[]> };
    type Mailer = { send(to: string, subject: string, body: string): Promise<void> };
    type Rental = { id: string; renterEmail: string; startAt: Date; dailyRate: number; status: "active" | "closed" };
    type RentalCharge = { days: number; total: number };

    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const MIN_BILLABLE_DAYS = 1;

    export function calculateRentalCharge(rental: Rental, returnedAt: Date): RentalCharge {
      const elapsedDays = Math.ceil((returnedAt.getTime() - rental.startAt.getTime()) / MS_PER_DAY);
      const days = Math.max(elapsedDays, MIN_BILLABLE_DAYS);
      return { days, total: days * rental.dailyRate };
    }

    export class RentalService {
      constructor(private readonly db: Db, private readonly mailer: Mailer) {}

      async close(rentalId: string, returnedAt: Date): Promise<number> {
        const rental = await this.findActiveRental(rentalId);
        const charge = calculateRentalCharge(rental, returnedAt);
        await this.markClosed(rentalId, returnedAt, charge.total);
        await this.sendClosingNotice(rental.renterEmail, charge);
        return charge.total;
      }

      private async findActiveRental(rentalId: string): Promise<Rental> {
        const [rental] = await this.db.query<Rental>("SELECT * FROM rentals WHERE id = $1", [rentalId]);
        if (!rental || rental.status !== "active") throw new Error(`Rental ${rentalId} is not active`);
        return rental;
      }

      private async markClosed(rentalId: string, returnedAt: Date, total: number): Promise<void> {
        await this.db.query(
          "UPDATE rentals SET status = 'closed', returned_at = $2, total = $3 WHERE id = $1",
          [rentalId, returnedAt, total],
        );
      }

      private async sendClosingNotice(email: string, charge: RentalCharge): Promise<void> {
        const body = `Hurmatli mijoz, ijara yopildi. Kunlar: ${charge.days}. Jami: ${charge.total.toLocaleString("uz-UZ")} so'm.`;
        await this.mailer.send(email, "Ijara yopildi", body);
      }
    }
  solutionNotes: |
    - `close` endi to'rtta biznes qadamni bir darajada o'qiydi: topish, hisoblash, yopish, xabar berish. SQL va formatlash undan bir pog'ona pastda.
    - Hisob-kitob sof funksiyaga (`calculateRentalCharge`) chiqdi: bu eng qimmatli ajratish, chunki u biznes qoida va uni DB'siz test qilish mumkin.
    - `findActiveRental` faqat SELECT'ni o'ramaydi, u "faol ijara" degan invariantni ham tekshiradi, demak pass-through emas.
    - Magic number'lar (`1000 * 60 * 60 * 24`, `1`) nomlandi.
    - Har qatorni alohida funksiyaga ajratmadik: `markClosed` va `sendClosingNotice` faqat bir joyda ishlatiladi, lekin ular infratuzilma detallarini biznes oqimidan yashiradi. Agar loyihada repository qatlami bo'lsa, `findActiveRental` va `markClosed` o'sha yerga ko'chishi kerak (95-dars).
  checklist:
    - "Public metod faqat bir abstraksiya darajasidagi qadamlarni o'z ichiga oladi"
    - "Biznes hisob-kitob sof funksiyada va DB'siz test qilinadi"
    - "Hech bir yangi funksiya argumentni shunchaki boshqa funksiyaga uzatmaydi"
    - "Raqamli konstantalar nomlangan"
    - "Xatti-harakat va xato xabari ma'nosi o'zgarmagan"
---

## Muammo

Kodni o'qiyotganda eng ko'p charchatadigan narsa uzunlik emas, balki darajalar o'rtasida sakrashdir. Bitta funksiyada avval "buyurtmani tasdiqlash" degan biznes qadam, keyin satrni regex bilan tekshirish, keyin xom SQL, keyin yana "mijozga xabar berish" kelsa, o'quvchi har bir qatorda o'z fikrlash darajasini almashtirishi kerak. U bir vaqtning o'zida "bu funksiya biznes uchun nima qiladi" va "bu SQL to'g'rimi" degan savollarni boshda saqlaydi.

Bunday kod o'zgarishda ham qimmat. Biznes qoida o'zgarganda (masalan, ijara uchun minimal ikki kun) o'zgarish SQL va email formatlash orasiga yashiringan qatorni topishni talab qiladi. Infratuzilma o'zgarganda (masalan, email o'rniga SMS) esa biznes mantiqqa tegishga to'g'ri keladi.

## Asosiy g'oya

Martin *Clean Code*ning funksiyalar bobida ikkita bog'liq qoidani beradi.

**Bitta ish.** Funksiya bitta ish qilishi, uni yaxshi qilishi va faqat shu ishni qilishi kerak. Lekin "bitta ish" bitta qadam degani emas. Martinning tushuntirishiga ko'ra, funksiya nomi aytgan darajadan bir pog'ona pastdagi qadamlarni bajarsa, u bitta ish qilyapti. `closeRental` funksiyasi "faol ijarani topish, narxni hisoblash, yopish, xabar berish" degan to'rtta qadamni bajarishi mumkin va bu hali ham bitta ish: ijarani yopish.

Bu qoidani tekshirish uchun Martin operatsion mezon beradi: agar funksiyadan uning amalini shunchaki qayta aytmaydigan nomli boshqa funksiyani ajratib olish mumkin bo'lsa, u bir nechta ish qilyapti.

**Bir funksiya - bir abstraksiya darajasi.** Funksiya ichidagi barcha qatorlar bir xil darajada bo'lishi kerak. `getHtml()` kabi yuqori darajadagi chaqiruv bilan `.append("\n")` kabi past darajadagi detal bir joyda tursa, o'quvchi qaysi biri muhim tushuncha va qaysi biri detal ekanini ajrata olmaydi. Martin buning yana bir oqibatini ta'kidlaydi: detallar aralashgan joyga yangi detallar qo'shilishi osonlashadi va funksiya asta-sekin chirib boradi.

**Stepdown qoidasi.** Kod yuqoridan pastga hikoya kabi o'qilishi kerak: har bir funksiya ortidan keyingi darajadagi funksiyalar keladi. Fayl boshida eng yuqori darajadagi funksiya, uning ostida u chaqiradiganlar va hokazo. O'quvchi qayerda to'xtashni o'zi tanlaydi: biznes oqimni bilish uchun birinchi funksiya yetarli, detallar kerak bo'lsa, pastga tushadi.

## Chuqurroq: daraja nima va uni qanday aniqlash mumkin

### Darajalarni aniqlash uchun amaliy savol

"Abstraksiya darajasi" mavhum tuyuladi. Amalda uni shunday tekshirish mumkin: **bu qatorni tushunish uchun qaysi bilim kerak?** Biznes analitik tushunadigan qator ("ijara narxini hisoblash") bitta daraja. Dasturchi domen modelini bilib tushunadigan qator ("kunlarni yuqoriga yaxlitlash, kamida bitta kun") ikkinchi daraja. Faqat texnologiyani bilib tushunadigan qator (SQL, HTTP sarlavhalar, `Date.getTime()` arifmetikasi) uchinchi daraja. Bir funksiyada ikkita qo'shni daraja bo'lishi tabiiy, uchtasi aralashsa, bo'lish kerak.

### Ousterhoutning qarashi: har bir qatlam yangi abstraksiya

Ousterhout bu masalaga qatlamlar nuqtai nazaridan qaraydi. Uning qoidasi: tizimdagi har bir qatlam o'zidan yuqori va pastdagi qatlamlardan farqli abstraksiya berishi kerak. Agar ikkita qo'shni qatlam bir xil abstraksiyaga ega bo'lsa, bu ortiqcha qatlam belgisi.

Uning eng aniq misoli - **pass-through method**: argumentlarini deyarli o'zgartirmasdan boshqa metodga uzatadigan metod. Masalan, `OrderController.create` `OrderService.create`ni chaqiradi, u `OrderManager.create`ni, u esa `OrderRepository.create`ni, va har bir qatlam bir xil DTO'ni uzatadi. Bunday zanjirda "bitta ish" qoidasi formal bajarilgan: har bir metod bitta ish qiladi. Lekin har bir qatlam yangi interfeys qo'shadi va hech narsani yashirmaydi.

Bu yerda Martin va Ousterhout bir-birini to'ldiradi. Martinning "bir daraja" qoidasi funksiya ichini tekshiradi: qatorlar aralashmasin. Ousterhoutning qoidasi funksiyalar orasini tekshiradi: har bir pog'ona haqiqatan yangi daraja bo'lsin. Darajani pastga tushirib, uni yangi funksiyaga ajratsangiz, lekin yangi funksiya eski darajada qolsa, siz faqat sakrash qo'shgansiz.

### "Bitta ish" qoidasining chegarasi

Oldingi darsda (21-dars) ko'rganimizdek, Ousterhout "bitta ish" mezonini noaniq deb hisoblaydi: deyarli har qanday ikki qatordan nomli funksiya ajratish mumkin, demak qoida qachon to'xtashni aytmaydi. Bu tanqid asosli. Amalda "bitta ish" qoidasini abstraksiya darajasi qoidasi bilan birga qo'llash foydaliroq: **darajalar aralashganda bo'ling, bir darajadagi qadamlar ketma-ketligini esa bo'lmang**.

Ousterhout yana bir foydali tamoyilni taklif qiladi: murakkablikni pastga torting (pull complexity downwards). Modul foydalanuvchisi ko'p, muallifi esa bitta. Shuning uchun murakkab detalni chaqiruvchiga emas, modul ichiga olib kirgan ma'qul. Bu "bir daraja" qoidasini to'ldiradi: yuqori darajadagi funksiya sodda bo'lishi uchun murakkablik pastki funksiyaga tushadi va o'sha yerda yashiriladi.

### Darajalarni ajratishning test va o'zgarishdagi foydasi

Darajalarni ajratishning eng amaliy foydasi o'qishda emas, testda va o'zgarishda ko'rinadi. Domen hisobi (masalan, ijara kunlarini yaxlitlash) infratuzilmadan ajralganda, uni ma'lumotlar bazasisiz, bir necha millisekundda va o'nlab chegaraviy holat bilan test qilish mumkin. Aralash funksiyada esa xuddi shu qoidani tekshirish uchun DB va mailer'ni mock qilish kerak bo'ladi va test asosiy savolni emas, mock'larni sozlashni ko'rsatadi. Bu g'oyani 67-darsda "functional core, imperative shell" sifatida batafsil ko'ramiz.

O'zgarishda ham xuddi shunday: biznes qoida o'zgarsa, bitta sof funksiya o'zgaradi; email o'rniga SMS kelsa, faqat infratuzilma funksiyasi o'zgaradi. Har bir o'zgarish sababi o'z darajasida qoladi va boshqa darajadagi kodga tegmaydi. Bu SRP (53-dars) bilan yaqin bog'liq, lekin funksiya miqyosida.

## Misol: buyurtmani tasdiqlash

Aralashgan darajalar:

```ts
type OrderLine = { sku: string; quantity: number; unitPrice: number };
type Order = { id: string; customerPhone: string; lines: OrderLine[]; status: "draft" | "confirmed" };
type Sms = { send(phone: string, text: string): Promise<void> };
type OrderRepo = { find(id: string): Promise<Order | null>; save(order: Order): Promise<void> };

export async function confirmOrder(repo: OrderRepo, sms: Sms, orderId: string): Promise<void> {
  const order = await repo.find(orderId);
  if (!order) throw new Error("Order not found");
  if (!/^\+998\d{9}$/.test(order.customerPhone)) throw new Error("Bad phone");
  let sum = 0;
  for (const l of order.lines) sum += l.quantity * l.unitPrice;
  if (sum <= 0) throw new Error("Empty order");
  await repo.save({ ...order, status: "confirmed" });
  await sms.send(order.customerPhone, `Buyurtma #${order.id} tasdiqlandi. Jami: ${sum} so'm`);
}
```

Bir darajaga keltirilgan:

```ts run
const UZ_PHONE = /^\+998\d{9}$/;

export async function confirmOrder(repo: OrderRepo, sms: Sms, orderId: string): Promise<void> {
  const order = await loadConfirmableOrder(repo, orderId);
  const total = orderTotal(order);
  await repo.save({ ...order, status: "confirmed" });
  await sms.send(order.customerPhone, confirmationText(order.id, total));
}

async function loadConfirmableOrder(repo: OrderRepo, orderId: string): Promise<Order> {
  const order = await repo.find(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (!UZ_PHONE.test(order.customerPhone)) throw new Error(`Order ${orderId}: invalid phone`);
  if (orderTotal(order) <= 0) throw new Error(`Order ${orderId} is empty`);
  return order;
}

export function orderTotal(order: Order): number {
  return order.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
}

function confirmationText(orderId: string, total: number): string {
  return `Buyurtma #${orderId} tasdiqlandi. Jami: ${total} so'm`;
}

// Sinab ko'ring: xotiradagi repo va konsolga yozadigan SMS bilan.
const lines: OrderLine[] = [
  { sku: "OIL-5W30", quantity: 2, unitPrice: 95_000 },
  { sku: "FILTER", quantity: 1, unitPrice: 40_000 },
];
const orders = new Map<string, Order>([["42", { id: "42", customerPhone: "+998901234567", lines, status: "draft" }]]);
const repo: OrderRepo = {
  find: async (id) => orders.get(id) ?? null,
  save: async (order) => void orders.set(order.id, order),
};
const sms: Sms = { send: async (phone, text) => console.log(`SMS ${phone}: ${text}`) };
await confirmOrder(repo, sms, "42");
console.log(orders.get("42")?.status);
```

O'zgarishlar sababi:

- `confirmOrder` endi biznes analitik ham o'qiy oladigan to'rtta qadam: tasdiqlanadigan buyurtmani olish, jamini hisoblash, saqlash, xabar berish.
- Barcha tekshiruvlar `loadConfirmableOrder`ga tushdi. Bu funksiya pass-through emas: u "tasdiqlash mumkin bo'lgan buyurtma" degan tushunchani yashiradi.
- `orderTotal` domen hisobi, uni boshqa joylar ham ishlatadi va sof.
- `repo.save(...)` qatori inline qoldi. Uni `markConfirmed` funksiyasiga chiqarish mumkin edi, lekin u bir qatorli va o'zi o'qiladi. Bu yerda bo'lish faqat sakrash qo'shardi.
- Stepdown tartibi: yuqorida public funksiya, pastda u chaqiradiganlar.

## Qachon qo'llamaslik kerak

- **Bir darajadagi uzun ketma-ketlik.** Konfiguratsiya yig'ish, ko'p maydonli DTO'ni map qilish yoki migratsiya skriptidagi 20 ta bir xil qadam bitta darajada. Ularni "har biri bitta ish" deb 20 funksiyaga bo'lish o'qishni qiyinlashtiradi.
- **Chambarchas bog'liq qadamlar.** Lock olish va critical section, tranzaksiyani ochish va undagi so'rovlar, `try`/`finally` juftligi. Ularni turli funksiyalarga ajratish noto'g'ri foydalanishni osonlashtiradi (lock olinib, qo'yilmay qolishi).
- **Qatlamlar talab uchun qo'shilganda.** "Controller-Service-Manager-Repository" sxemasi har bir modul uchun majburiy bo'lsa, oddiy CRUD'da pass-through metodlar zanjiri hosil bo'ladi. Qatlamni faqat u yangi abstraksiya berganda qo'shing (90-dars).
- **Stepdown va tilning cheklovlari.** TypeScript'da `function` deklaratsiyalari hoisting tufayli istalgan tartibda yoziladi, lekin `const fn = () => {}` uslubidagi funksiyalar va klass maydonlari ishlatilishidan oldin e'lon qilinishi kerak bo'lishi mumkin. Jamoa uslubi bilan ziddiyat bo'lsa, izchillik muhimroq.

## Stack'da: NestJS, React, Next.js

- **NestJS controller.** Controller metodi HTTP darajasida qolishi kerak: DTO qabul qilish, service chaqirish, javobni shakllantirish. Agar controller ichida biznes hisob-kitob yoki Prisma so'rovi bo'lsa, darajalar aralashgan (94-dars).
- **NestJS service.** Service metodlari biznes qadamlar darajasida. Prisma yoki Kysely so'rovlari repository yoki private metodlarga tushadi. Lekin har bir Prisma chaqiruvi uchun repository metodi yaratish pass-through'ga olib kelishi mumkin: repository haqiqatan biror narsani yashirganda (murakkab so'rov, mapping) foydali.
- **React komponenti.** JSX yuqori darajadagi tuzilmani ko'rsatsin. Komponent ichida `fetch`, javobni parse qilish, sana formatlash va layout aralashsa, ma'lumot olishni custom hook'ga, formatlashni sof funksiyaga chiqaring. Shunda komponent "nima ko'rsatiladi" darajasida o'qiladi.
- **Next.js server action.** Server action ichida validatsiya (Zod), biznes qadam va `revalidatePath` bor. Uchalasi turli darajada, lekin action qisqa bo'lsa, ularni bitta joyda ketma-ket qoldirish o'qilishi oson. Murakkablashganda biznes qismni alohida modulga ajrating.

## Xulosa

- "Bitta ish" bitta qadam degani emas: funksiya nomidan bir pog'ona pastdagi qadamlar ketma-ketligi bitta ish.
- Asosiy signal - abstraksiya darajalarining aralashishi. Biznes qadam, domen hisobi va infratuzilma detali bitta funksiyada bo'lsa, bo'ling.
- Stepdown qoidasi faylni yuqoridan pastga hikoya kabi o'qiladigan qiladi.
- Ousterhout talabi: har bir yangi funksiya yoki qatlam yangi abstraksiya bersin. Pass-through metod - noto'g'ri bo'lish belgisi.
- Bir darajadagi qadamlarni va chambarchas bog'liq juftliklarni bo'lmang.
