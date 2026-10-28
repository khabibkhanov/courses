---
n: 28
slug: xato-qaytarish
title: "throw yoki natija qaytarish: exception va Result"
summary: "Martin xato kodlari o'rniga exception'larni afzal ko'radi, Ousterhout esa exception'lar soni va ularni ushlash joylarini kamaytirishni talab qiladi. TypeScript'da exception'lar tipda ko'rinmaydi, shuning uchun kutilgan biznes xatolar uchun Result tipi ko'pincha aniqroq. Qaysi xato qaysi mexanizmga mos kelishi va ikkalasini qanday birga ishlatish."
duration: 40
sources:
  - id: cc1
    note: "3-bob \"Functions\": \"Prefer Exceptions to Returning Error Codes\", \"Extract Try/Catch Blocks\", \"Error Handling Is One Thing\"; 7-bob \"Error Handling\""
  - id: aposd
    note: "\"Define Errors Out of Existence\" bobi: exception'lar murakkablik manbai sifatida, exception masking, aggregation va xatoni yo'q qilish"
  - id: effective-ts
    note: "Tiplar dizayni bo'limlari: unknown bilan ishlash, union va tagged union orqali holatlarni aniq ifodalash"
quiz:
  - q: "TypeScript'da `async function chargeCard(...): Promise<Receipt>` imzosi xatolar haqida chaqiruvchiga nima aytadi?"
    options:
      - "Funksiya faqat `PaymentError` tashlashini"
      - "Funksiya hech qachon xato tashlamasligini"
      - "Xato haqida hech narsa: TypeScript'da throws deklaratsiyasi yo'q va catch'dagi qiymat `unknown`"
      - "Funksiya xatoni Receipt ichida qaytarishini"
    answer: 2
    explain: "TypeScript'da exception'lar tip tizimidan tashqarida: imzo qaysi xatolar mumkinligini aytmaydi, `catch (e)` esa strict rejimda `unknown`. Shuning uchun chaqiruvchi kutilgan xatolarni hujjat yoki kod o'qish orqali bilishi kerak."
  - q: "Martin nega xato kodlari o'rniga exception'larni afzal ko'radi?"
    options:
      - "Exception'lar tezroq ishlaydi"
      - "Xato kodlari chaqiruvchini darhol tekshirishga majburlaydi va asosiy yo'lni ichma-ich if'lar bilan aralashtiradi; exception'lar xato ishlovini alohida joyga ajratadi"
      - "Xato kodlari faqat C tilida mavjud"
      - "Exception'lar kompilyator tomonidan tekshiriladi"
    answer: 1
    explain: "Martinning dalili o'qilishga oid: har bir chaqiruvdan keyin `if (err)` asosiy oqimni bo'ladi. Exception bilan asosiy yo'l va xato ishlovi alohida o'qiladi. U shuningdek xato kodlari enum'i ko'p joyni unga bog'lashini aytadi."
  - q: "Ousterhoutning \"define errors out of existence\" g'oyasiga eng mos misol qaysi?"
    options:
      - "`deleteFile(path)` fayl mavjud bo'lmasa xato tashlamaydi, chunki maqsad - fayl yo'q bo'lishi - allaqachon bajarilgan"
      - "Barcha xatolarni bitta global catch'da ushlash"
      - "Har bir xato uchun alohida exception klassi yaratish"
      - "Xatolarni log qilib, null qaytarish"
    answer: 0
    explain: "Ousterhout API semantikasini shunday belgilashni taklif qiladi: xato holat normal xatti-harakatning bir qismiga aylanadi. Mavjud bo'lmagan faylni o'chirish natijasi baribir kutilgandek. Global catch va null qaytarish xatoni yo'q qilmaydi, faqat yashiradi."
  - q: "Qaysi xato uchun Result qaytarish exception'dan ko'ra mosroq?"
    options:
      - "Ma'lumotlar bazasi ulanishi uzilgani"
      - "Dasturdagi bug: massiv indeksi chegaradan tashqarida"
      - "Konfiguratsiyada majburiy env o'zgaruvchi yo'qligi ilova ishga tushganda"
      - "Foydalanuvchi kiritgan promokod muddati o'tgani"
    answer: 3
    explain: "Promokod muddati - kutilgan, biznes ma'noli natija: chaqiruvchi uni albatta ko'rib chiqishi va foydalanuvchiga tushuntirishi kerak. DB uzilishi, bug va noto'g'ri konfiguratsiya esa kutilmagan va odatda yuqori qatlamda bir xil tarzda ishlanadi, ular uchun exception mos."
  - q: "Martinning \"Error Handling Is One Thing\" tavsiyasi nimani bildiradi?"
    options:
      - "Har bir funksiya faqat bitta exception tashlasin"
      - "try/catch bo'lgan funksiya faqat xato ishlovi bilan shug'ullansin: try bloki tanasini alohida funksiyaga chiqarib, try/catch'dan oldin va keyin hech narsa qoldirmaslik"
      - "Xatolarni faqat bitta modulda ishlash"
      - "Har bir xato bitta log qatoriga ega bo'lsin"
    answer: 1
    explain: "Martin try/catch bloklarini xunuk va asosiy mantiqni aralashtiruvchi deb hisoblaydi. Uning tavsiyasi: try ichidagi tanani nomli funksiyaga chiqarish, shunda xato ishlovi va asosiy ish ikki alohida funksiyada o'qiladi."
  - q: "Ousterhout exception aggregation deganda nimani tushunadi?"
    options:
      - "Ko'p turli exception'larni ko'p joyda ushlash o'rniga ularni bitta yuqori joyda bitta handler bilan ishlash"
      - "Barcha xatolarni massivga yig'ib, oxirida qaytarish"
      - "Promise.allSettled bilan xatolarni yig'ish"
      - "Har bir exception'ga sabab (cause) qo'shish"
    answer: 0
    explain: "Aggregation - ishlov joylarini kamaytirish: masalan, web serverda har bir endpoint ichida emas, bitta umumiy dispatcher darajasida xatolarni HTTP javobga aylantirish. NestJS exception filter'lari shu g'oyaning amaliy ko'rinishi."
task:
  title: "Kutilgan va kutilmagan xatolarni ajratish"
  prompt: |
    Quyidagi ijara bron qilish funksiyasi barcha holatlarda `Error` tashlaydi. Controller xato xabari matnini `includes` bilan tekshirib HTTP status tanlaydi, va matn o'zgarganda 409 o'rniga 500 qaytadi.

    1. Xatolarni ikki guruhga ajrating: kutilgan biznes natijalar (chaqiruvchi albatta ko'rib chiqishi kerak) va kutilmagan nosozliklar.
    2. Kutilgan natijalar uchun discriminated union ko'rinishidagi Result tipini kiriting.
    3. Kutilmagan nosozliklarni exception sifatida qoldiring.
    4. Controller'dagi satr solishtirishni exhaustive switch bilan almashtiring.
  lang: ts
  starter: |
    type Car = { id: string; dailyRate: number; available: boolean };
    type Booking = { id: string; carId: string; days: number; total: number };
    type Db = {
      findCar(id: string): Promise<Car | null>;
      insertBooking(b: Omit<Booking, "id">): Promise<Booking>;
    };

    export async function bookCar(db: Db, carId: string, days: number): Promise<Booking> {
      if (days < 1 || days > 30) throw new Error("Invalid days");
      const car = await db.findCar(carId);
      if (!car) throw new Error("Car not found");
      if (!car.available) throw new Error("Car is not available");
      return db.insertBooking({ carId, days, total: car.dailyRate * days });
    }

    export async function bookCarHandler(db: Db, carId: string, days: number) {
      try {
        const booking = await bookCar(db, carId, days);
        return { status: 201, body: booking };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.includes("not found")) return { status: 404, body: { error: msg } };
        if (msg.includes("not available")) return { status: 409, body: { error: msg } };
        if (msg.includes("Invalid")) return { status: 400, body: { error: msg } };
        return { status: 500, body: { error: "Internal error" } };
      }
    }
  solution: |
    type Car = { id: string; dailyRate: number; available: boolean };
    type Booking = { id: string; carId: string; days: number; total: number };
    type Db = {
      findCar(id: string): Promise<Car | null>;
      insertBooking(b: Omit<Booking, "id">): Promise<Booking>;
    };

    export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
    const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
    const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

    export type BookingError =
      | { kind: "invalid-days"; min: number; max: number }
      | { kind: "car-not-found"; carId: string }
      | { kind: "car-unavailable"; carId: string };

    const MIN_DAYS = 1;
    const MAX_DAYS = 30;

    /** Kutilgan biznes natijalar Result'da; DB nosozliklari exception bo'lib qoladi. */
    export async function bookCar(db: Db, carId: string, days: number): Promise<Result<Booking, BookingError>> {
      if (days < MIN_DAYS || days > MAX_DAYS) return err({ kind: "invalid-days", min: MIN_DAYS, max: MAX_DAYS });
      const car = await db.findCar(carId);
      if (!car) return err({ kind: "car-not-found", carId });
      if (!car.available) return err({ kind: "car-unavailable", carId });
      return ok(await db.insertBooking({ carId, days, total: car.dailyRate * days }));
    }

    function assertNever(value: never): never {
      throw new Error(`Unhandled booking error: ${JSON.stringify(value)}`);
    }

    function toHttp(error: BookingError): { status: number; body: { error: string } } {
      switch (error.kind) {
        case "invalid-days":
          return { status: 400, body: { error: `days must be ${error.min}-${error.max}` } };
        case "car-not-found":
          return { status: 404, body: { error: `car ${error.carId} not found` } };
        case "car-unavailable":
          return { status: 409, body: { error: `car ${error.carId} is not available` } };
        default:
          return assertNever(error);
      }
    }

    // Kutilmagan exception'lar bu yerda ushlanmaydi: ularni umumiy handler (NestJS filter) 500 ga aylantiradi.
    export async function bookCarHandler(db: Db, carId: string, days: number) {
      const result = await bookCar(db, carId, days);
      return result.ok ? { status: 201, body: result.value } : toHttp(result.error);
    }
  solutionNotes: |
    - Uchta holat (noto'g'ri kunlar, mashina yo'q, band) kutilgan biznes natija: ular imzoda `BookingError` sifatida ko'rinadi va chaqiruvchi ularni e'tiborsiz qoldira olmaydi.
    - Xato xabari matnini solishtirish yo'qoldi. Matnni o'zgartirish endi HTTP statusni buzmaydi, yangi xato turi qo'shilsa esa kompilyator `toHttp`ni ko'rsatadi.
    - DB nosozliklari exception bo'lib qoldi: ularni har bir chaqiruvchida ishlashdan foyda yo'q, ular bitta umumiy joyda (Ousterhout'ning aggregation g'oyasi) 500 ga aylanadi.
    - Xato obyektlari strukturali ma'lumotga ega (`carId`, `min`, `max`), shuning uchun UI yoki log ularni matnni parse qilmasdan ishlatadi.
    - Result tipi kichik va o'zimizniki: kutubxona kerak emas. Agar loyihada neverthrow kabi kutubxona allaqachon ishlatilsa, izchillik uchun uni oling.
  checklist:
    - "Kutilgan biznes xatolar funksiya imzosida ko'rinadi"
    - "Xato turini aniqlash uchun xabar matni solishtirilmaydi"
    - "Yangi xato turi qo'shilganda kompilyator HTTP mapping'ni ko'rsatadi"
    - "Infratuzilma nosozliklari har bir chaqiruvda emas, umumiy joyda ishlanadi"
    - "Xato obyektlari kerakli kontekstni strukturali maydonlarda olib yuradi"
---

## Muammo

TypeScript'da `async function transfer(...): Promise<Transfer>` imzosini ko'rib, uning qanday xato berishini bilib bo'lmaydi. Balans yetarli emasmi? Hisob bloklanganmi? Limit oshganmi? Tarmoq uzildimi? Hammasi bir xil `throw` orqali chiqadi va chaqiruvchida `catch (e)` ichida `e` - `unknown`. Natijada jamoalar xato xabarlarining matnini `includes("insufficient")` bilan tekshira boshlaydi, va kimdir xabarni tarjima qilganda yoki aniqroq qilganda production'da 409 o'rniga 500 qaytadi.

Teskari muammo ham bor: har bir funksiya `{ data, error }` qaytaradi, har bir chaqiruvdan keyin `if (error) return { error }` takrorlanadi, va biznes mantiq xato tekshiruvlari orasida yo'qoladi. Bu Go uslubini JavaScript'ga majburlash bo'lib, unda Go'ning qulayliklari yo'q.

Savol "exception yaxshimi yoki Result" emas. Savol: **qaysi xato qaysi mexanizmga mos keladi**.

## Asosiy g'oya

### Martin: xato kodlari o'rniga exception'lar

Martin *Clean Code*ning funksiyalar bobida xato kodlarini qaytarishni CQS'ning (24-dars) nozik buzilishi deb hisoblaydi: buyruq natija qaytaradi va `if (deletePage(page) === E_OK)` kabi kod paydo bo'ladi. Bu chaqiruvchini darhol xatoni tekshirishga majbur qiladi va ichma-ich strukturalar hosil qiladi. Exception bilan esa asosiy yo'l va xato ishlovi ajraladi.

U yana ikki tavsiya beradi. **Extract Try/Catch Blocks**: try bloki tanasini alohida funksiyaga chiqaring, shunda bitta funksiya xatoni ishlaydi, ikkinchisi asosiy ishni qiladi. **Error Handling Is One Thing**: xato ishlovi o'zi bitta ish, demak try/catch bo'lgan funksiyada `try` kalit so'zi birinchi bo'lib, catch/finally'dan keyin hech narsa bo'lmasligi kerak. Martin shuningdek xato kodlari enum'i ko'p klasslarni unga bog'lashini va yangi xato qo'shish qayta kompilyatsiyani talab qilishini aytadi, exception'lar esa yangi klass sifatida qo'shiladi.

Muhim kontekst: Martin bu fikrlarni Java muhitida va C uslubidagi xato kodlari bilan solishtirib yozgan. Ular zamonaviy tagged union'li Result tiplari bilan solishtirish emas.

### Ousterhout: exception'lar murakkablik manbai

Ousterhout *A Philosophy of Software Design*da boshqa tomondan qaraydi: exception ishlovi dasturdagi eng katta murakkablik manbalaridan biri. Har bir tashlanadigan exception interfeysning bir qismi, va har bir catch bloki kam test qilinadigan, ko'pincha noto'g'ri ishlaydigan kod. Uning maqsadi - **exception ishlanadigan joylar sonini kamaytirish**. U to'rtta usulni taklif qiladi:

1. **Define errors out of existence.** API semantikasini shunday belgilangki, xato holat normal xatti-harakatga aylansin. Uning misollari: mavjud bo'lmagan faylni o'chirish xato emas (maqsad - fayl yo'q bo'lishi - bajarilgan); diapazondan tashqari substring so'rovi bo'sh yoki qisqartirilgan natija qaytarishi mumkin.
2. **Exception masking.** Xatoni past darajada aniqlab, o'sha yerda hal qilish (masalan, tarmoq protokoli yo'qolgan paketni qayta yuboradi), shunda yuqori qatlamlar uni umuman ko'rmaydi.
3. **Exception aggregation.** Ko'p joyda ko'p turli exception'ni ushlash o'rniga ularni bitta yuqori joyda bitta handler bilan ishlash.
4. **Just crash.** Ba'zi xatolar (xotira tugashi, ichki invariant buzilishi) uchun tiklashga urinish qiymatsiz; dasturni aniq xabar bilan to'xtatish oddiyroq va xavfsizroq.

## Chuqurroq: TypeScript va Result tipi

### TypeScript'da exception'lar ko'rinmaydi

Java'da checked exception'lar imzoda e'lon qilinadi (va Martin ularni ham tanqid qiladi, chunki ular OCP'ni buzadi). TypeScript'da esa hech qanday `throws` deklaratsiyasi yo'q. `strict` rejimda (`useUnknownInCatchVariables`) `catch (e)` dagi `e` `unknown`, chunki JavaScript'da istalgan qiymatni tashlash mumkin. Promise rejection'lari ham tipsiz. Demak exception - **tip tizimidan tashqaridagi kanal**.

Bu kutilmagan nosozliklar uchun muammo emas: ularni baribir yuqorida bir xil ishlaymiz. Lekin kutilgan biznes natijalar uchun bu jiddiy kamchilik: chaqiruvchi "mashina band" holatini ko'rib chiqishni unutsa, kompilyator buni aytmaydi.

### Result tipi

Result - muvaffaqiyat yoki xatoni ifodalovchi discriminated union (27-dars):

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

Vanderkam *Effective TypeScript*da holatlarni union'lar orqali aniq ifodalashni va noto'g'ri kombinatsiyalarga yo'l qo'ymaydigan tiplarni tavsiya qiladi. Result shu g'oyaning xatolarga qo'llanishi: `{ data?: T; error?: E }` kabi ikki optional maydonli shakl "ikkalasi ham bor" yoki "ikkalasi ham yo'q" holatlariga ruxsat beradi, union esa yo'q. Result'ning afzalliklari:

- **Imzoda ko'rinadi.** `Promise<Result<Booking, BookingError>>` chaqiruvchiga mumkin bo'lgan natijalarni aytadi.
- **Exhaustive ishlov.** `BookingError` o'zi union bo'lsa, `switch (error.kind)` va `assertNever` bilan yangi xato turi qo'shilganda kompilyator barcha ishlov joylarini ko'rsatadi.
- **Strukturali kontekst.** Xato obyekti matn emas, ma'lumot: `{ kind: "car-unavailable", carId, availableFrom }`.

Kamchiliklari ham real: har bir qatlamda `if (!r.ok) return r` takrorlanadi (JS'da Rust'ning `?` operatori yo'q), stack trace yo'q, va kutubxonalar (Prisma, fetch, NestJS) baribir exception tashlaydi, demak chegarada ularni o'rash kerak.

### Amaliy chegara: kutilgan va kutilmagan

Ko'p tajribali jamoalar quyidagi bo'linishga keladi (bu kelishuv, qat'iy qoida emas):

- **Kutilgan biznes natija** - Result. Chaqiruvchi uni albatta ko'rib chiqishi kerak va u odatda foydalanuvchiga ko'rsatiladi: balans yetarli emas, promokod muddati o'tgan, slot band, validatsiya xatosi.
- **Kutilmagan nosozlik** - exception. Chaqiruvchi uni lokal hal qila olmaydi: DB uzilishi, tashqi API 500, timeout, bug, buzilgan invariant. Ular yuqorida bitta joyda ishlanadi (Ousterhout'ning aggregation'i).
- **Dasturchi xatosi** - exception yoki crash. Noto'g'ri argument, `assertNever` ga tushish. Ularni Result'ga o'rash bug'ni biznes natija sifatida niqoblaydi.

Exception tashlaganda esa uni boyiting: maxsus xato klassi va `cause` (ES2022) bilan asl sababni saqlang (47-dars).

## Misol: to'lov

Faqat exception'lar bilan:

```ts
type Account = { id: string; balance: number; blocked: boolean };
type AccountRepo = { find(id: string): Promise<Account | null>; debit(id: string, amount: number): Promise<void> };

export async function pay(repo: AccountRepo, accountId: string, amount: number): Promise<void> {
  const acc = await repo.find(accountId);
  if (!acc) throw new Error("Account not found");
  if (acc.blocked) throw new Error("Account blocked");
  if (acc.balance < amount) throw new Error("Insufficient funds");
  await repo.debit(accountId, amount);
}
```

Kutilgan natijalar Result'da, nosozliklar exception'da:

```ts run
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

type PayError =
  | { kind: "account-not-found"; accountId: string }
  | { kind: "account-blocked"; accountId: string }
  | { kind: "insufficient-funds"; balance: number; required: number };

export async function pay(
  repo: AccountRepo,
  accountId: string,
  amount: number,
): Promise<Result<{ charged: number }, PayError>> {
  const acc = await repo.find(accountId);
  if (!acc) return { ok: false, error: { kind: "account-not-found", accountId } };
  if (acc.blocked) return { ok: false, error: { kind: "account-blocked", accountId } };
  if (acc.balance < amount) {
    return { ok: false, error: { kind: "insufficient-funds", balance: acc.balance, required: amount } };
  }
  await repo.debit(accountId, amount); // DB xatosi exception bo'lib yuqoriga chiqadi
  return { ok: true, value: { charged: amount } };
}

// Sinab ko'ring: balans yoki summani o'zgartiring.
const accounts = new Map<string, Account>([
  ["acc_1", { id: "acc_1", balance: 200_000, blocked: false }],
  ["acc_2", { id: "acc_2", balance: 900_000, blocked: true }],
]);
const repo: AccountRepo = {
  find: async (id) => accounts.get(id) ?? null,
  debit: async (id, amount) => void (accounts.get(id)!.balance -= amount),
};
for (const [id, amount] of [["acc_1", 150_000], ["acc_1", 150_000], ["acc_2", 10_000], ["acc_9", 10_000]] as const) {
  console.log(JSON.stringify(await pay(repo, id, amount)));
}
```

Nima o'zgardi:

- **Imzo mumkin bo'lgan natijalarni aytadi.** Chaqiruvchi `result.ok`ni tekshirmasdan `value`ga yeta olmaydi.
- **UI uchun ma'lumot bor.** `insufficient-funds` balans va kerakli summani olib yuradi, "Sizga yana 12 000 so'm kerak" deb ko'rsatish mumkin.
- **DB xatolari aralashmadi.** `repo.debit` tashlagan exception biznes xato sifatida niqoblanmaydi va umumiy handler'ga boradi.

## Qachon qo'llamaslik kerak

- **Result'ni hamma joyga yoyish.** Har bir yordamchi funksiya Result qaytarsa, kod `if (!r.ok) return r` bilan to'ladi. Result'ni domen chegarasida (service metodlari) ishlating, ichki sof funksiyalarda emas.
- **Infratuzilma xatolarini Result'ga o'rash.** `Result<User, DbError | NetworkError | TimeoutError>` chaqiruvchiga hech narsa bermaydi: u bu xatolarni baribir hal qila olmaydi. Bu Java'ning checked exception muammosini qayta yaratadi.
- **Freymvork qarshiligi.** NestJS'da HTTP xatolari uchun `HttpException` va exception filter'lar standart mexanizm. Service'da Result, controller'da uni `HttpException`ga yoki to'g'ridan-to'g'ri javobga aylantirish yaxshi ishlaydi; lekin jamoa allaqachon domen exception'lari va filter'lar bilan izchil ishlasa, faqat bir modul uchun Result kiritish izchillikni buzadi.
- **Kichik loyihalar va skriptlar.** Bitta foydalanuvchili CLI yoki migratsiya skriptida exception va crash yetarli.
- **Xatoni yo'q qilish mumkin bo'lsa.** Ousterhout'ning birinchi usuli ko'pincha eng yaxshisi: `removeFromCart(itemId)` element bo'lmasa xato bermasdan qaytsin. Bu na exception, na Result talab qiladi.

## Stack'da: NestJS, Next.js, React

- **NestJS.** Domen service'lari kutilgan natijalarni Result yoki domen exception'lari bilan ifodalaydi; controller yoki exception filter ularni HTTP javobga aylantiradi. Kutilmagan xatolar uchun global filter - Ousterhout'ning aggregation'i (48-dars). Xato javoblari formati uchun RFC 9457 (Problem Details) mos (89-dars).
- **Next.js server action.** Server action'dan exception tashlasangiz, production'da mijoz xato tafsilotlarini ko'rmaydi. Shuning uchun forma validatsiyasi va biznes xatolar uchun action `{ ok: false, fieldErrors }` kabi serializatsiya qilinadigan Result qaytarishi tabiiy.
- **React.** Error boundary'lar render paytidagi kutilmagan xatolar uchun. Kutilgan holatlar (bo'sh ro'yxat, ruxsat yo'q) oddiy UI holati bo'lishi kerak, exception emas.
- **fetch va tashqi API'lar.** `fetch` HTTP 4xx/5xx da reject qilmaydi, faqat tarmoq xatosida. Klient o'ramida `response.ok`ni tekshirib, biznes ma'noli statuslarni (404, 409) Result'ga, qolganlarini exception'ga aylantiring.

## Xulosa

- TypeScript'da exception'lar tip tizimidan tashqarida: imzo ularni ko'rsatmaydi, catch'da qiymat `unknown`.
- Martin xato kodlari o'rniga exception'larni afzal ko'radi va try/catch'ni alohida funksiyaga ajratishni tavsiya qiladi; bu fikr C uslubidagi kodlar bilan solishtirishga tayanadi.
- Ousterhout exception'larni murakkablik manbai deb hisoblaydi: xatolarni yo'q qiling, past darajada yashiring, bitta joyda yig'ing yoki crash qiling.
- Amaliy chegara: kutilgan biznes natijalar uchun Result (union), kutilmagan nosozliklar va bug'lar uchun exception.
- Xatoni matn bilan emas, strukturali ma'lumot bilan ifodalang va exhaustive ishlang.
