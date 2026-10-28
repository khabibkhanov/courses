---
n: 24
slug: side-effect-cqs
title: "Yon ta'sirlar va Command-Query Separation"
summary: "Yashirin side effect funksiya nomi bergan va'dani buzadi va temporal coupling yaratadi. Bertrand Meyer'ning Command-Query Separation tamoyili, Fowler'ning unga pragmatik munosabati va Separate Query from Modifier refaktoringi."
duration: 35
sources:
  - id: cc1
    note: "3-bob \"Functions\": \"Have No Side Effects\" (checkPassword misoli, temporal coupling) va \"Command Query Separation\" bo'limlari"
  - id: fowler-command-query
    note: "CQS ta'rifi, Meyer'ga nisbat, stack pop misoli va Fowler'ning pragmatik pozitsiyasi"
  - id: refactoring
    note: "Separate Query from Modifier refaktoringi va observable side effect tushunchasi"
quiz:
  - q: "`async function isTokenValid(token: string): Promise<boolean>` funksiyasi token muddatini 30 daqiqaga uzaytiradi. Bu qanday muammo?"
    options:
      - "Funksiya async bo'lmasligi kerak"
      - "Nomi so'roq va'da qiladi, lekin yashirin holat o'zgarishi bor; uni tekshirish uchun chaqirgan har kim bilmasdan sessiyani uzaytiradi"
      - "Boolean qaytarish noto'g'ri, Result qaytarish kerak"
      - "Token string emas, branded tip bo'lishi kerak"
    answer: 1
    explain: "Bu Martinning checkPassword misolining aynan o'zi: nom so'roqni bildiradi, side effect esa yashirin. Monitoring, testlar yoki admin panel token holatini tekshirganda sessiya kutilmaganda uzayadi. Boshqa variantlar ikkinchi darajali masalalar."
  - q: "Fowler'ga ko'ra CQS qoidasining asosiy amaliy qiymati nimada?"
    options:
      - "Kod tezroq ishlaydi"
      - "Kompilyator xatolarni avtomatik topadi"
      - "Qaysi metodlar holatni o'zgartiradi va qaysilari o'zgartirmasligini bilsangiz, so'roqlarni xavotirsiz, istalgan joyda va istalgancha chaqirish mumkin"
      - "Barcha metodlar void qaytaradi"
    answer: 2
    explain: "Fowler qiymatni ikki guruhni farqlay olishda ko'radi: side effect'siz so'roqlarni erkin ishlatish, tartibini o'zgartirish va qayta chaqirish mumkin. Qolgan variantlar CQS bermaydigan narsalar."
  - q: "Stack'ning `pop()` metodi haqida Fowler qanday pozitsiyada?"
    options:
      - "U CQS'ni buzadi, lekin foydali bo'lgani uchun Fowler bu yerda qoidani buzishga tayyor"
      - "U CQS'ni buzmaydi, chunki qiymat qaytaradi"
      - "Uni har doim `peek` va `remove`ga bo'lish shart"
      - "Fowler stack ishlatmaslikni tavsiya qiladi"
    answer: 0
    explain: "Fowler pop'ni holatni o'zgartiradigan so'roq deb tan oladi va Meyer undan qochish mumkinligini aytadi. Lekin Fowler uning foydaliligi uchun qoidani buzishga tayyorligini yozadi. Bu CQS'ni dogma emas, tamoyil sifatida qo'llashning namunasi."
  - q: "Martin \"temporal coupling\" deganda nimani nazarda tutadi?"
    options:
      - "Ikkita funksiya bir vaqtda parallel bajarilishi"
      - "Funksiya faqat ma'lum bir vaqt oralig'ida ishlashi"
      - "Kodning sana va vaqt bilan ishlashi"
      - "Funksiyani faqat ma'lum tartibda yoki ma'lum holatda chaqirish xavfsiz bo'lishi, va bu shart nomda ko'rinmasligi"
    answer: 3
    explain: "checkPassword sessiyani initsializatsiya qilgani uchun uni faqat sessiyani yo'qotish xavfsiz bo'lgan paytda chaqirish mumkin. Bu tartib sharti yashirin. Martin kamida uni nomga chiqarishni (checkPasswordAndInitializeSession) taklif qiladi."
  - q: "Qaysi funksiya CQS nuqtai nazaridan eng kam muammoli?"
    options:
      - "`getOrCreateCart(userId)` - savat bo'lmasa yaratadi va qaytaradi, nomi buni aytadi"
      - "`getBalance(accountId)` - balansni qaytaradi va oxirgi ko'rilgan vaqtni yangilaydi"
      - "`validateOrder(order)` - xato bo'lsa order.status'ni 'invalid' qiladi va boolean qaytaradi"
      - "`set(key, value)` - qiymatni yozadi va kalit avval bor edimi, boolean qaytaradi"
    answer: 0
    explain: "getOrCreateCart CQS'ni formal buzadi, lekin side effect nomda ochiq va idempotent. Qolgan uchtasida o'zgarish yashirin yoki natija ma'nosi noaniq: Martin `if (set(...))` ni aynan shunday noaniq chaqiruv misoli sifatida keltiradi."
task:
  title: "So'roq va buyruqni ajratish"
  prompt: |
    Quyidagi ijara servisida `getAvailableCar` nomi so'roqqa o'xshaydi, lekin u mashinani band qiladi va hisoblagichni oshiradi. Admin panel ham bu funksiyani "bo'sh mashina bormi" deb tekshirish uchun chaqiradi va natijada mashinalar band bo'lib qolmoqda.

    1. Barcha observable side effect'larni sanab chiqing.
    2. Separate Query from Modifier refaktoringini qo'llang: sof so'roq va aniq nomli buyruq.
    3. Band qilish operatsiyasi race condition'ga chidamli bo'lishi uchun buyruq nimani qaytarishi kerakligini o'ylang (buyruq ham natija qaytarishi mumkin bo'lgan holat).
  lang: ts
  starter: |
    type Car = { id: string; model: string; status: "free" | "reserved" };

    export class RentalFleet {
      private reservationsToday = 0;

      constructor(private readonly cars: Car[]) {}

      getAvailableCar(model: string): Car | undefined {
        const car = this.cars.find((c) => c.model === model && c.status === "free");
        if (car) {
          car.status = "reserved";
          this.reservationsToday++;
        }
        return car;
      }

      stats(): number {
        return this.reservationsToday;
      }
    }
  solution: |
    type Car = { id: string; model: string; status: "free" | "reserved" };

    export type ReserveResult =
      | { ok: true; car: Car }
      | { ok: false; reason: "no-free-car" };

    export class RentalFleet {
      private reservationsToday = 0;

      constructor(private readonly cars: Car[]) {}

      /** So'roq: holatni o'zgartirmaydi, istalgancha chaqirish xavfsiz. */
      findFreeCar(model: string): Car | undefined {
        return this.cars.find((c) => c.model === model && c.status === "free");
      }

      /** Buyruq: bo'sh mashinani topib, atomar ravishda band qiladi. */
      reserveCar(model: string): ReserveResult {
        const car = this.findFreeCar(model);
        if (!car) return { ok: false, reason: "no-free-car" };
        car.status = "reserved";
        this.reservationsToday++;
        return { ok: true, car };
      }

      reservationsCountToday(): number {
        return this.reservationsToday;
      }
    }
  solutionNotes: |
    - Side effect'lar: `car.status` o'zgaradi va `reservationsToday` oshadi. Ikkalasi ham nomdan ko'rinmasdi.
    - `findFreeCar` sof so'roq: admin panel va UI uni xavfsiz chaqiradi.
    - `reserveCar` buyruq, nomi o'zgarishni ochiq aytadi. U natija qaytaradi, chunki "tekshir, keyin band qil" ni ikki alohida chaqiruvga bo'lish ko'p foydalanuvchili tizimda race condition yaratadi: ikkita so'rov bir xil bo'sh mashinani ko'rib, ikkalasi band qilishga urinadi. Bu Fowler'ning pop misoliga o'xshash pragmatik istisno: o'zgarish va natija atomar bo'lishi kerak.
    - Real tizimda atomarlik DB darajasida ta'minlanadi (masalan, `UPDATE ... WHERE status = 'free' RETURNING *`), xotiradagi massiv faqat namuna.
    - `stats` nomi `reservationsCountToday`ga o'zgardi: nima qaytarishini aytadi.
  checklist:
    - "Nomi get/find/is bilan boshlanadigan hech bir metod holatni o'zgartirmaydi"
    - "Holatni o'zgartiradigan metod nomida fe'l bor va o'zgarishni ochiq aytadi"
    - "Tekshirish va band qilish orasida race condition qolmadi"
    - "Admin panel uchun side effect'siz so'roq mavjud"
---

## Muammo

Funksiya nomi - shartnoma. `getUser`, `isValid`, `calculateTotal` kabi nomlar chaqiruvchiga "men faqat hisoblayman va javob beraman" deydi. Chaqiruvchi bu va'daga ishonib, funksiyani loglash uchun, debug paytida, testda yoki shunchaki ikki marta chaqiradi. Agar funksiya ichida yashirin o'zgarish bo'lsa (bazaga yozish, hisoblagichni oshirish, keshni tozalash, email yuborish), har bir bunday "zararsiz" chaqiruv kutilmagan oqibat beradi.

Bunday xatolar topish uchun eng qimmat xatolardan. Ular kodning o'zida emas, chaqiruvlar tartibida yashiringan: funksiya bir joyda to'g'ri ishlaydi, boshqa joyda, xuddi shu argumentlar bilan, tizimni buzadi. Production'da "foydalanuvchi sessiyasi o'z-o'zidan uzayib ketyapti" yoki "monitoring ishga tushgandan beri mashinalar band bo'lib qolyapti" kabi simptomlar ko'pincha shunga borib taqaladi.

## Asosiy g'oya

### Side effect - yashirin yolg'on

Martin *Clean Code*da side effect'ni yolg'on deb ataydi: funksiya bitta ishni va'da qiladi, lekin yashirincha boshqa ishni ham qiladi. Uning misoli: `checkPassword` funksiyasi foydalanuvchi nomi va parolni tekshiradi va boolean qaytaradi, lekin to'g'ri parolda `Session.initialize()` ni ham chaqiradi. Nom sessiya haqida hech narsa demaydi. Natijada kimdir parolni shunchaki tekshirish uchun bu funksiyani chaqirsa, joriy sessiya ma'lumotlari o'chib ketadi.

Martin bu holatni **temporal coupling** deb ataydi: funksiyani faqat ma'lum vaqtda, ma'lum tartibda chaqirish xavfsiz, va bu shart hech qayerda ko'rinmaydi. Uning tavsiyasi: imkon bo'lsa side effect'ni olib tashlang. Agar u haqiqatan kerak bo'lsa, nomga chiqaring (`checkPasswordAndInitializeSession`), garchi bu funksiya "bitta ish" qoidasini buzayotganini ham ochiq ko'rsatsa.

### Command-Query Separation

Bu tamoyil Bertrand Meyer'ga tegishli va u *Object-Oriented Software Construction* kitobida bayon qilingan. Fowler bliki maqolasida uni shunday tushuntiradi: metodlar ikki guruhga bo'linadi.

- **Query (so'roq):** natija qaytaradi va tizimning kuzatiladigan holatini o'zgartirmaydi.
- **Command (buyruq):** holatni o'zgartiradi va qiymat qaytarmaydi. Fowler ularni "modifier" deb atashni afzal ko'radi.

Fowler fikricha, asosiy qiymat - qaysi metod holatni o'zgartirishini va qaysi biri o'zgartirmasligini bilish. Shunda so'roqlarni xavotirsiz ishlatish mumkin: istalgan joyda, istalgan tartibda, istalgancha. U qaytariladigan tip (void yoki qiymat) foydali, lekin mukammal bo'lmagan signal ekanini ham ta'kidlaydi.

Martin xuddi shu tamoyilni funksiyalar bobida keltiradi. Uning misoli: `set(attribute, value)` qiymatni yozadi va atribut mavjud edimi, boolean qaytaradi. Natijada `if (set("username", "unclebob"))` kabi kod paydo bo'ladi va o'quvchi tushunmaydi: bu "agar username unclebob bo'lsa"mi yoki "agar yozish muvaffaqiyatli bo'lsa"mi? Yechim: `attributeExists` so'rovi va `setAttribute` buyrug'ini ajratish.

## Chuqurroq: qoidaning chegarasi

### Fowler'ning pragmatizmi: pop misoli

Fowler CQS'ni mutlaq qoida deb hisoblamaydi. Uning misoli - stack'ning `pop()` metodi: u elementni qaytaradi va stack'ni o'zgartiradi, ya'ni holatni o'zgartiradigan so'roq. Meyer bunday metoddan qochish mumkin deb hisoblaydi. Fowler esa uni foydali deb biladi va maqolada "prepared to break it to get my pop" deb yozadi, ya'ni pop uchun qoidani buzishga tayyor.

Bu muhim nuqta: CQS asosiy holatda to'g'ri, lekin ba'zi operatsiyalarda o'zgarish va natija atomar bo'lishi kerak. Ko'p foydalanuvchili tizimlarda "avval tekshir, keyin o'zgartir" (check-then-act) naqshi race condition yaratadi: ikkita so'rov bir xil bo'sh joyni ko'radi va ikkalasi uni band qiladi. Bunday holda bitta atomar buyruq natija qaytarishi kerak (87-dars).

### Kuzatiladigan holat

CQS "holatni o'zgartirmaslik" deganda kuzatiladigan holatni nazarda tutadi. Fowler *Refactoring* kitobida observable side effect tushunchasini ishlatadi: so'roq ichida kesh to'ldirilsa yoki lazy initsializatsiya bo'lsa, bu tashqaridan ko'rinmaydi va so'roq hali ham sof hisoblanadi. Mezon: so'roqni ikki marta chaqirish yoki umuman chaqirmaslik tizim xatti-harakatini tashqi kuzatuvchi uchun o'zgartiradimi? Logging va metrikalar odatda chegaraviy holat: texnik jihatdan side effect, lekin biznes holatini o'zgartirmaydi.

### Separate Query from Modifier

Fowler'ning refaktoring katalogida bu tamoyil uchun aniq amal bor: **Separate Query from Modifier**. Qiymat qaytaradigan va side effect'ga ega funksiyani ikkiga bo'lish: sof so'roq va buyruq. Katalogdagi misolda `getTotalOutstandingAndSendBill` funksiyasi qarz summasini hisoblaydi va hisob-fakturani yuboradi. U `totalOutstanding` (sof so'roq) va `sendBill` (buyruq) ga bo'linadi. E'tibor bering, asl nomning o'zi halol edi, muammo nomda emas, balki ikki xil ishning bitta funksiyaga yopishganida. Mexanikasi oddiy: so'roq qismini nusxalab yangi funksiya qiling, undan side effect'larni olib tashlang, keyin asl funksiyaning chaqiruvchilarini ikkita chaqiruvga o'tkazing va asl funksiyadan qaytarish qiymatini olib tashlang.

### Side effect turlari

Hamma side effect bir xil xavfli emas. Amalda ularni shunday tartiblash foydali:

1. **Argumentni o'zgartirish** (output argument, 23-dars) - eng kutilmagan, chunki chaqiruvchining ma'lumoti o'zgaradi.
2. **Modul yoki global holatni o'zgartirish** - testlar orasida izolyatsiyani buzadi.
3. **Tashqi tizim** (DB, HTTP, email, navbat) - qaytarib bo'lmaydi va ko'pincha qimmat.
4. **Lokal, tashqaridan ko'rinmaydigan o'zgarish** (kesh, memoizatsiya) - odatda muammo emas.

## Misol: sessiya va token

Yashirin side effect'li kod:

```ts
type Session = { userId: string; token: string; expiresAt: Date };
type SessionStore = {
  find(token: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
};

const SLIDING_WINDOW_MS = 30 * 60 * 1000;

export async function isSessionValid(store: SessionStore, token: string): Promise<boolean> {
  const session = await store.find(token);
  if (!session || session.expiresAt < new Date()) return false;
  session.expiresAt = new Date(Date.now() + SLIDING_WINDOW_MS);
  await store.save(session);
  return true;
}
```

Monitoring servisi har daqiqada `isSessionValid` ni chaqirib faol sessiyalarni sanasa, birorta sessiya hech qachon tugamaydi. Ajratilgan versiya:

```ts
export async function findActiveSession(
  store: SessionStore,
  token: string,
  now: Date = new Date(),
): Promise<Session | null> {
  const session = await store.find(token);
  return session && session.expiresAt >= now ? session : null;
}

export async function extendSession(
  store: SessionStore,
  session: Session,
  now: Date = new Date(),
): Promise<Session> {
  const extended = { ...session, expiresAt: new Date(now.getTime() + SLIDING_WINDOW_MS) };
  await store.save(extended);
  return extended;
}

// Auth middleware: bu yerda uzaytirish ongli qaror
export async function authenticate(store: SessionStore, token: string): Promise<Session | null> {
  const session = await findActiveSession(store, token);
  return session ? extendSession(store, session) : null;
}
```

Nima o'zgardi:

- `findActiveSession` sof so'roq (DB o'qishdan tashqari). Monitoring, admin panel va testlar uni xavfsiz ishlatadi.
- `extendSession` buyruq. U yangilangan sessiyani qaytaradi: bu formal CQS buzilishi, lekin chaqiruvchiga yangi qiymat kerak va uni qayta so'rash ortiqcha DB chaqiruvi bo'lardi. Bu Fowler'ning pragmatik pozitsiyasiga mos.
- `extendSession` argumentni o'zgartirmaydi, yangi obyekt qaytaradi.
- `authenticate` ikkalasini birlashtiradi va nomi "autentifikatsiya" jarayonini bildiradi, bunda sessiyani uzaytirish kutilgan xatti-harakat.
- `now` parametri vaqtga bog'liq mantiqni test qilinadigan qiladi.

## Qachon qo'llamaslik kerak

- **Atomar operatsiyalar.** `pop()`, `reserveSeat()`, `incrementAndGet()`, `INSERT ... RETURNING`. Bu yerda so'roq va buyruqni ajratish race condition yaratadi. Natija qaytaradigan buyruq to'g'ri tanlov, faqat nomi o'zgarishni ochiq aytsin.
- **Fluent API va builder'lar.** `query.where(...).orderBy(...)` kabi metodlar `this` qaytaradi. Bu CQS'ni formal buzadi, lekin naqsh hammaga ma'lum va chalkashlik yaratmaydi. Immutable builder'larda (yangi obyekt qaytaradigan) muammo umuman yo'q.
- **Yaratilgan ID'ni qaytarish.** `createOrder(dto): Promise<OrderId>` buyruq, lekin ID'ni qaytarmaslik chaqiruvchini qandaydir yo'l bilan uni qidirishga majbur qiladi. Amaliyotda bu qabul qilingan istisno.
- **getOrCreate naqshlari.** `getOrCreateCart` side effect'ni nomda e'lon qiladi va idempotent. Bu yashirin yolg'on emas.
- **Haddan tashqari ajratish.** Har bir buyruqdan keyin holatni olish uchun alohida so'roq chaqirish tarmoq yoki DB chaqiruvlarini ikki barobar oshirishi mumkin.

## Stack'da: NestJS, React, CQRS

- **NestJS service.** `get*`, `find*`, `is*`, `has*`, `count*` bilan boshlanadigan metodlar holatni o'zgartirmasin. Bu kelishuvni jamoa darajasida qabul qilsangiz, code review'da buzilishni topish oson bo'ladi.
- **HTTP semantikasi.** GET so'rovlari spetsifikatsiya bo'yicha xavfsiz (safe) bo'lishi kerak. GET endpoint'da holat o'zgartirish CQS'ning HTTP darajasidagi buzilishi: crawler'lar, prefetch va keshlar uni kutilmaganda chaqiradi.
- **React render.** Komponent render funksiyasi so'roq bo'lishi kerak: React uni istalgancha chaqirishi mumkin (Strict Mode'da ataylab ikki marta). Render ichida state o'zgartirish, `fetch` yoki `localStorage`ga yozish - yashirin side effect. Ular event handler'lar yoki effektlarga tegishli (92-dars).
- **CQRS.** Command Query Responsibility Segregation - CQS g'oyasining arxitektura darajasidagi kengaytmasi: o'qish va yozish uchun alohida modellar. Bu katta tizimlar uchun naqsh va oddiy CRUD uchun ko'pincha ortiqcha (90-dars). Funksiya darajasidagi CQS esa deyarli har doim arzon va foydali.

## Xulosa

- Yashirin side effect - funksiya nomi bergan va'dani buzish. U temporal coupling yaratadi: funksiyani faqat ma'lum tartibda chaqirish xavfsiz bo'lib qoladi.
- CQS (Meyer): so'roqlar natija qaytaradi va holatni o'zgartirmaydi, buyruqlar holatni o'zgartiradi.
- Fowler fikricha, asosiy qiymat so'roqlarni xavotirsiz ishlatish imkoniyati. U foydali holatlarda (pop) qoidani buzishga tayyor.
- Atomar "o'zgartir va qaytar" operatsiyalari va yaratilgan ID'ni qaytarish oqilona istisnolar.
- Side effect kerak bo'lsa, uni nomga chiqaring. Separate Query from Modifier refaktoringi bilan aralash funksiyalarni ajrating.
