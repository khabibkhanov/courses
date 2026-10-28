---
n: 26
slug: guard-clause
title: "Guard clause, early return va ichma-ichlikni kamaytirish"
summary: "Chuqur ichma-ich if'lar o'quvchidan shartlar stekini boshda saqlashni talab qiladi. Replace Nested Conditional with Guard Clauses refaktoringi, \"bitta return\" qoidasining tarixi, McCabe'ning cyclomatic complexity va Sonar'ning cognitive complexity metrikalari nimani o'lchaydi va nimani o'lchamaydi."
duration: 35
sources:
  - id: refactoring-catalog
    note: "Replace Nested Conditional with Guard Clauses, Decompose Conditional, Consolidate Conditional Expression"
  - id: refactoring
    note: "Replace Nested Conditional with Guard Clauses bo'limi: normal va g'ayrioddiy tarmoqlar farqi, bitta chiqish nuqtasi qoidasiga munosabat"
  - id: mccabe-1976
    note: "Cyclomatic complexity ta'rifi: dastur grafidagi mustaqil yo'llar soni va modul uchun tavsiya etilgan yuqori chegara"
  - id: sonar-cognitive
    note: "Cognitive complexity: chiziqli oqimning uzilishi uchun ball, ichma-ichlik uchun qo'shimcha ball, cyclomatic complexity'dan farqi"
quiz:
  - q: "Guard clause'ning asosiy g'oyasi nima?"
    options:
      - "Har bir funksiya faqat bitta return'ga ega bo'lishi"
      - "Barcha xatolarni try/catch ichiga olish"
      - "G'ayrioddiy yoki chegaraviy holatlarni funksiya boshida tekshirib darhol chiqish, shunda asosiy yo'l ichma-ichliksiz qoladi"
      - "Shartlarni switch bilan almashtirish"
    answer: 2
    explain: "Guard clause istisno holatni ajratib, uni darhol tugatadi. O'quvchi qolgan kodni o'qiganda bu holatni boshda saqlashi shart emas. Bitta return qoidasi aksincha ichma-ichlikni oshiradi."
  - q: "Ikki funksiyaning cyclomatic complexity'si bir xil (5), lekin biri 4 ta ketma-ket guard clause, ikkinchisi 4 darajali ichma-ich if. Sonar cognitive complexity ularni qanday baholaydi?"
    options:
      - "Ichma-ich variantga yuqoriroq ball beradi, chunki u ichma-ichlik uchun qo'shimcha ball qo'shadi"
      - "Ikkalasiga bir xil ball beradi"
      - "Guard clause variantiga yuqoriroq ball beradi, chunki return'lar ko'p"
      - "Cognitive complexity faqat sikllarni hisoblaydi"
    answer: 0
    explain: "Cognitive complexity'ning cyclomatic'dan asosiy farqi aynan shu: ichma-ich strukturalar har bir daraja uchun qo'shimcha ball oladi. Ketma-ket if'lar har biri faqat bittadan ball oladi. Bu inson o'qish qiyinligiga yaqinroq."
  - q: "\"Har bir funksiyada faqat bitta kirish va bitta chiqish\" qoidasi qayerdan kelgan va nega u bugun kam ahamiyatga ega?"
    options:
      - "U TypeScript qo'llanmasidan kelgan va faqat JS'ga tegishli"
      - "U strukturali dasturlash davridan, goto va qo'lda resurs boshqaruvi bo'lgan tillardan qolgan; zamonaviy tillarda finally, using va GC uning asosiy sababini yo'qotgan"
      - "U performance uchun kiritilgan, chunki ko'p return sekin"
      - "U hech qachon mavjud bo'lmagan"
    answer: 1
    explain: "Bitta chiqish qoidasi resurslarni bir joyda bo'shatish kerak bo'lgan muhitlarda mantiqli edi. Zamonaviy tillarda try/finally, deterministik tozalash va GC bu muammoni boshqacha hal qiladi. Fowler ham bu qoidani foydali deb hisoblamasligini yozadi."
  - q: "Quyidagi qaysi holatda guard clause'ga aylantirish eng kam foydali?"
    options:
      - "Funksiya boshidagi null tekshiruvi butun tanani if ichiga o'raydi"
      - "Ruxsat yo'qligi tekshiruvi asosiy mantiqni 3 daraja ichkariga suradi"
      - "Uchta shart ichma-ich joylashgan va har biri xato bilan tugaydi"
      - "if/else'ning ikkala tarmog'i teng huquqli normal holatlar va hajmi kichik (masalan, ikki xil tarif)"
    answer: 3
    explain: "Fowler ta'kidlaydiki, guard clause bir tarmoq g'ayrioddiy bo'lganda mos. Ikkala tarmoq teng huquqli bo'lsa, if/else bu tenglikni ko'rsatadi va uni guard'ga aylantirish ma'noni yo'qotadi."
  - q: "McCabe'ning cyclomatic complexity metrikasi aslida nimani o'lchaydi?"
    options:
      - "Funksiyadagi qatorlar sonini"
      - "Kodni o'qish uchun ketadigan vaqtni"
      - "Dasturning boshqaruv oqimi grafidagi chiziqli mustaqil yo'llar sonini, bu esa to'liq yo'l qamrovi uchun kerakli testlar soniga yaqin"
      - "O'zgaruvchilar sonini"
    answer: 2
    explain: "McCabe metrikasi graf nazariyasiga asoslangan va testlash nuqtai nazaridan foydali: nechta mustaqil yo'lni tekshirish kerak. U o'qilishni bevosita o'lchash uchun yaratilmagan, shuning uchun Sonar keyinroq cognitive complexity'ni taklif qilgan."
task:
  title: "Ichma-ich shartlarni guard clause'larga aylantirish"
  prompt: |
    Quyidagi funksiya transport parkida yoqilg'i kartasi orqali to'lovni tasdiqlaydi. U to'g'ri ishlaydi, lekin asosiy yo'l 5 daraja ichkarida va har bir `else` qaysi `if`ga tegishli ekanini topish qiyin.

    1. Qaysi tarmoqlar g'ayrioddiy holat (rad etish) va qaysi biri asosiy yo'l ekanini aniqlang.
    2. Replace Nested Conditional with Guard Clauses refaktoringini qo'llang.
    3. Xatti-harakat o'zgarmaganini tekshiring: rad etish sabablari va ularning tartibi bir xil qolsin.
    4. Agar biror shart nomi bilan aniqroq bo'lsa, uni nomlangan funksiyaga yoki o'zgaruvchiga chiqaring (Decompose Conditional).
  lang: ts
  starter: |
    type FuelCard = { id: string; status: "active" | "blocked"; dailyLimitUzs: number; spentTodayUzs: number; allowedFuel: string[] };
    type Purchase = { cardId: string; fuelType: string; amountUzs: number; stationOpen: boolean };
    type Decision = { approved: boolean; reason?: string };

    export function authorize(card: FuelCard | undefined, p: Purchase): Decision {
      let decision: Decision;
      if (card) {
        if (card.status === "active") {
          if (p.stationOpen) {
            if (card.allowedFuel.includes(p.fuelType)) {
              if (card.spentTodayUzs + p.amountUzs <= card.dailyLimitUzs) {
                decision = { approved: true };
              } else {
                decision = { approved: false, reason: "daily-limit" };
              }
            } else {
              decision = { approved: false, reason: "fuel-type" };
            }
          } else {
            decision = { approved: false, reason: "station-closed" };
          }
        } else {
          decision = { approved: false, reason: "card-blocked" };
        }
      } else {
        decision = { approved: false, reason: "card-not-found" };
      }
      return decision;
    }
  solution: |
    type FuelCard = { id: string; status: "active" | "blocked"; dailyLimitUzs: number; spentTodayUzs: number; allowedFuel: string[] };
    type Purchase = { cardId: string; fuelType: string; amountUzs: number; stationOpen: boolean };

    type RejectReason = "card-not-found" | "card-blocked" | "station-closed" | "fuel-type" | "daily-limit";
    type Decision = { approved: true } | { approved: false; reason: RejectReason };

    const reject = (reason: RejectReason): Decision => ({ approved: false, reason });

    function exceedsDailyLimit(card: FuelCard, amountUzs: number): boolean {
      return card.spentTodayUzs + amountUzs > card.dailyLimitUzs;
    }

    export function authorize(card: FuelCard | undefined, p: Purchase): Decision {
      if (!card) return reject("card-not-found");
      if (card.status !== "active") return reject("card-blocked");
      if (!p.stationOpen) return reject("station-closed");
      if (!card.allowedFuel.includes(p.fuelType)) return reject("fuel-type");
      if (exceedsDailyLimit(card, p.amountUzs)) return reject("daily-limit");

      return { approved: true };
    }
  solutionNotes: |
    - Beshta rad etish holati g'ayrioddiy, tasdiqlash esa asosiy yo'l. Shuning uchun har biri guard clause bo'ldi va asosiy yo'l oxirida ichma-ichliksiz turadi.
    - Tekshiruvlar tartibi saqlandi: bir vaqtda bir nechta shart buzilsa, avvalgidek eng birinchi sabab qaytadi. Bu kuzatiladigan xatti-harakat, uni o'zgartirish refaktoring emas.
    - `let decision` va yagona `return` olib tashlandi: ular faqat "bitta chiqish" qoidasi uchun mavjud edi.
    - Limit sharti `exceedsDailyLimit` nomini oldi. Shart inversiyasi (`<=` dan `>` ga) ehtiyotkorlik talab qiladi: chegaraviy holatni (aynan limitga teng summa) test bilan tekshiring.
    - `Decision` discriminated union'ga aylandi: endi `approved: true` va `reason` birga kelishi mumkin emas (27-dars).
  checklist:
    - "Asosiy yo'l funksiyaning oxirida, birorta if ichida emas"
    - "Rad etish sabablari va ularning ustuvorlik tartibi o'zgarmadi"
    - "Limitga aynan teng summa uchun natija eski kod bilan bir xil"
    - "Ichma-ichlik darajasi 1 dan oshmaydi"
    - "Qaytarish tipi noto'g'ri kombinatsiyalarga yo'l qo'ymaydi"
---

## Muammo

Kod review'da tez-tez uchraydigan shakl: funksiya tanasi o'ngga qarab "o'q uchi" (arrow anti-pattern) shaklida suriladi. Birinchi `if` foydalanuvchi bormi deb tekshiradi, ikkinchisi ruxsati bormi, uchinchisi buyurtma holati, to'rtinchisi limit, va haqiqiy ish beshinchi daraja ichida. Pastda esa beshta `else` zinapoya bo'lib tushadi va qaysi biri qaysi `if`ga tegishli ekanini topish uchun qavslarni sanash kerak.

Bunday kodning narxi o'qishda: o'quvchi har bir darajada "hozir men qaysi shartlar ichidaman" degan stekni boshda saqlaydi. Beshinchi darajaga yetganda u beshta shartni eslab turishi kerak. O'zgartirish ham xavfli: yangi tekshiruv qo'shish uchun to'g'ri darajani topish va mos `else`ni to'g'ri joyga qo'yish kerak.

## Asosiy g'oya

Fowler'ning katalogida bu muammo uchun aniq refaktoring bor: **Replace Nested Conditional with Guard Clauses**. Katalogdagi misol ish haqi hisoblash funksiyasi: ichma-ich `if`/`else` va oxirida bitta `return result` o'rniga to'rtta ketma-ket qator - uchta guard clause va oxirida normal holat.

```ts
type Employee = { isDead: boolean; isSeparated: boolean; isRetired: boolean; salary: number };
declare function deadAmount(e: Employee): number;
declare function separatedAmount(e: Employee): number;
declare function retiredAmount(e: Employee): number;
declare function normalPayAmount(e: Employee): number;

// oldin: bitta chiqish, uch daraja ichma-ich
// keyin:
function payAmount(employee: Employee): number {
  if (employee.isDead) return deadAmount(employee);
  if (employee.isSeparated) return separatedAmount(employee);
  if (employee.isRetired) return retiredAmount(employee);
  return normalPayAmount(employee);
}
```

*Refactoring* kitobida Fowler bu refaktoringning mohiyatini shunday tushuntiradi: shartli ifodalar ikki turda bo'ladi. Birinchisi - ikkala tarmoq ham normal xatti-harakat; bunda `if`/`else` mos keladi, chunki u ikki teng huquqli yo'lni ko'rsatadi. Ikkinchisi - bir tarmoq normal, ikkinchisi g'ayrioddiy holat; bunda g'ayrioddiy holatni alohida tekshirib, darhol chiqish kerak. Bu tekshiruv **guard clause** deb ataladi. U o'quvchiga aytadi: "bu holat asosiy mantiqning qismi emas, u bo'lsa - chiqib ketamiz".

Guard clause'ning kuchi shundaki, u shartlar stekini yo'q qiladi. Har bir guard'dan keyin o'quvchi uni unutishi mumkin: biz bu yerga yetib kelgan bo'lsak, shart bajarilmagan.

### "Bitta kirish, bitta chiqish" haqida

Ichma-ich shartlarning tarixiy sababi - "funksiyada faqat bitta return bo'lsin" degan qoida. U strukturali dasturlash davridan kelgan, o'shanda `goto` keng tarqalgan va resurslarni (xotira, fayl) qo'lda bo'shatish kerak edi: bitta chiqish nuqtasi tozalashni bir joyda qilish imkonini berardi. Fowler *Refactoring*da bu qoidani foydali deb hisoblamasligini ochiq yozadi: aniqlik asosiy tamoyil, va bitta chiqish nuqtasi funksiyani aniqroq qilsa, uni ishlating, aks holda yo'q. Zamonaviy TypeScript'da `try`/`finally`, `using` deklaratsiyalari (TS 5.2+) va GC tozalash masalasini boshqacha hal qiladi.

## Chuqurroq: murakkablik metrikalari

Ichma-ichlik "yomon" ekanini his qilish oson, lekin uni o'lchash mumkinmi? Ikkita mashhur metrika bor va ular turli narsalarni o'lchaydi.

### McCabe: cyclomatic complexity

Thomas McCabe 1976-yilgi maqolasida dastur murakkabligini graf nazariyasi orqali o'lchashni taklif qilgan. Funksiyaning boshqaruv oqimi grafi tuziladi (tugunlar - bloklar, qirralar - o'tishlar) va murakkablik - grafdagi chiziqli mustaqil yo'llar soni. Amalda u qaror nuqtalari soni plus bir ga teng: har bir `if`, sikl, `case`, `&&`/`||` bittadan qo'shadi.

McCabe metrikani asosan testlash va modullashtirish uchun mo'ljallagan: u to'liq yo'l qamrovi uchun kerakli testlar soniga yaqin. Maqolada u modul murakkabligi uchun 10 ni oqilona, lekin sehrli bo'lmagan yuqori chegara sifatida taklif qilgan.

Muhim kuzatish: **cyclomatic complexity ichma-ichlikni sezmaydi**. To'rtta ketma-ket guard clause va to'rtta ichma-ich `if` bir xil ball oladi, chunki ikkalasida ham to'rtta qaror nuqtasi bor. Testlash nuqtai nazaridan bu to'g'ri: ikkalasida ham beshta yo'l. Lekin o'qish nuqtai nazaridan ular juda farq qiladi.

### Sonar: cognitive complexity

SonarSource'dan G. Ann Campbell o'z white paper'ida **cognitive complexity** metrikasini taklif qilgan. Uning maqsadi - matematik model emas, balki kodni tushunish qiyinligini o'lchash. Asosiy qoidalar (soddalashtirilgan):

1. **Chiziqli oqimning har bir uzilishi** uchun +1: `if`, `else if`, `else`, ternary, `switch`, sikllar, `catch`, label'li `break`/`continue`, va mantiqiy operatorlarning har bir ketma-ketligi.
2. **Ichma-ichlik uchun qo'shimcha**: boshqa struktura ichida joylashgan `if`, sikl, `switch`, `catch` har bir ichma-ichlik darajasi uchun qo'shimcha ball oladi.
3. **Qisqartmalar e'tiborsiz qoldiriladi**: metod chaqiruvi, `?.` va `??` kabi o'qishni osonlashtiradigan konstruksiyalar ball bermaydi.
4. **`switch` bitta ball oladi**, undagi `case`lar soni emas, chunki bir xil shakldagi ko'p holatni o'qish qiyin emas.

Natijada guard clause'li variant past ball oladi (har bir `if` +1, ichma-ichlik yo'q), ichma-ich variant esa yuqori ball (ichkaridagi har bir `if` uchun darajasiga qarab qo'shimcha). Bu metrika ESLint uchun `eslint-plugin-sonarjs` paketidagi `cognitive-complexity` qoidasi orqali mavjud.

### Guard'ni teskari aylantirish

Fowler bu refaktoringning bir variantini ham ko'rsatadi: shartlarni teskari aylantirish (reverse the conditions). Ba'zan kod `if (isValid) { ...uzun asosiy mantiq... } else { return error; }` ko'rinishida bo'ladi. Bunda shartni inversiya qilib, `if (!isValid) return error;` deb yozish va asosiy mantiqni ichma-ichlikdan chiqarish kerak. Bu yerda ehtiyot bo'lish kerak: murakkab mantiqiy ifodani inversiya qilishda De Morgan qoidalari (`!(a && b)` = `!a || !b`) ko'p xatoga sabab bo'ladi, shuning uchun refaktoringdan oldin chegaraviy holatlar uchun testlar bo'lishi muhim.

### Metrikalarning chegarasi

Ikkala metrika ham signal, hukm emas. Cognitive complexity past bo'lgan funksiya noto'g'ri nomlar yoki aralashgan abstraksiya darajalari (22-dars) tufayli o'qilmas bo'lishi mumkin. Metrikani maqsadga aylantirsangiz, dasturchilar uni "aldash" yo'llarini topadi: shartlarni bir qatorli sayoz yordamchi funksiyalarga sochib yuborish ballni pasaytiradi, lekin o'quvchini sakrashga majbur qiladi (21-dars). Metrikalar review uchun e'tibor talab qiladigan joylarni topishda foydali (97-dars).

## Misol: buyurtmani bekor qilish

Ichma-ich variant:

```ts
type OrderStatus = "new" | "paid" | "shipped" | "delivered" | "cancelled";
type Order = { id: string; status: OrderStatus; customerId: string; paidAt?: Date };
type User = { id: string; role: "customer" | "admin" };

const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;

export function canCancel(order: Order, user: User, now: Date): { ok: boolean; reason?: string } {
  if (user.role === "admin" || order.customerId === user.id) {
    if (order.status !== "cancelled") {
      if (order.status !== "shipped" && order.status !== "delivered") {
        if (order.status === "paid" && order.paidAt) {
          if (now.getTime() - order.paidAt.getTime() <= REFUND_WINDOW_MS || user.role === "admin") {
            return { ok: true };
          } else {
            return { ok: false, reason: "Refund window expired" };
          }
        }
        return { ok: true };
      } else {
        return { ok: false, reason: "Already shipped" };
      }
    } else {
      return { ok: false, reason: "Already cancelled" };
    }
  } else {
    return { ok: false, reason: "Forbidden" };
  }
}
```

Guard clause'lar bilan:

```ts
type CancelCheck = { ok: true } | { ok: false; reason: string };

export function canCancel(order: Order, user: User, now: Date): CancelCheck {
  const isAdmin = user.role === "admin";
  if (!isAdmin && order.customerId !== user.id) return { ok: false, reason: "Forbidden" };
  if (order.status === "cancelled") return { ok: false, reason: "Already cancelled" };
  if (order.status === "shipped" || order.status === "delivered") {
    return { ok: false, reason: "Already shipped" };
  }
  if (!isAdmin && isPastRefundWindow(order, now)) {
    return { ok: false, reason: "Refund window expired" };
  }
  return { ok: true };
}

function isPastRefundWindow(order: Order, now: Date): boolean {
  if (order.status !== "paid" || !order.paidAt) return false;
  return now.getTime() - order.paidAt.getTime() > REFUND_WINDOW_MS;
}
```

Nima o'zgardi:

- **Har bir rad etish sababi bitta qatorda.** Yangi qoida qo'shish uchun to'g'ri ichma-ichlik darajasini qidirish shart emas: yangi guard qo'shiladi.
- **Asosiy yo'l oxirida.** `return { ok: true }` endi ikki joyda emas, bitta joyda.
- **Murakkab shart nomlandi** (Decompose Conditional). `isPastRefundWindow` o'zi ham guard bilan boshlanadi.
- **`isAdmin` bir marta hisoblanadi** va uning ma'nosi ikki joyda aniq: ruxsat va muddatdan ozodlik.
- **Natija tipi union.** `ok: true` va `reason` birga kelishi mumkin emas.

## Qachon qo'llamaslik kerak

- **Teng huquqli tarmoqlar.** Fowler ta'kidlaganidek, ikkala tarmoq normal holat bo'lsa (`if (isWeekend) weekendRate() else weekdayRate()`), `if`/`else` yoki ternary bu simmetriyani to'g'ri ko'rsatadi. Bittasini "guard" qilish ularning tengligini yashiradi.
- **Tozalash kerak bo'lgan kod.** Funksiya o'rtasida resurs ochilgan bo'lsa (lock, tranzaksiya, fayl), har bir erta `return` uni bo'shatishi kerak. Bunday holda `try`/`finally` yoki `using` ishlating, aks holda erta return resurs oqishiga olib keladi.
- **Juda uzun funksiyadagi erta return'lar.** 200 qatorli funksiyaning o'rtasidagi `return`ni ko'rmay qolish oson. Bu guard clause muammosi emas, funksiya o'lchami muammosi: avval uni bo'ling.
- **Metrikani aldash.** Cognitive complexity'ni pasaytirish uchun shartlarni sayoz funksiyalarga sochish. Ball tushadi, o'qilishi yomonlashadi.

## Stack'da: NestJS, React, TypeScript

- **NestJS service va guard'lar.** Ruxsat tekshiruvlarini service metodining boshidagi guard clause'lar sifatida yoki NestJS'ning `Guard` mexanizmi orqali bajaring. Xato holatlarida `throw new ForbiddenException()` yoki `NotFoundException` guard clause'ning tabiiy shakli: metodning qolgan qismi faqat yaxshi yo'lni o'qiydi.
- **TypeScript narrowing.** Guard clause'lar type narrowing bilan yaxshi ishlaydi: `if (!user) return null;` dan keyin TypeScript `user`ni `User` deb biladi va qolgan kodda `user?.` kerak emas. Ichma-ich variantda esa narrowing faqat `if` bloki ichida amal qiladi.
- **React komponentlari.** Komponent boshida `if (isLoading) return <Spinner />; if (error) return <ErrorView error={error} />;` - bu ham guard clause. Muhim cheklov: hook'lar bunday erta return'lardan **oldin** chaqirilishi kerak, chunki React Hook qoidalari hook'larni shartli chaqirishni taqiqlaydi.
- **Express/Fastify handler'lar.** `if (!req.body.email) return reply.code(400).send(...)` naqshida `return`ni unutish ikki marta javob yuborish xatosiga olib keladi. Validatsiyani schema (Zod, Fastify schema) darajasiga chiqarish guard'larni handler'dan olib tashlaydi.

## Xulosa

- Chuqur ichma-ichlik o'quvchidan shartlar stekini boshda saqlashni talab qiladi.
- Guard clause g'ayrioddiy holatni boshida tekshirib darhol chiqadi va asosiy yo'lni ichma-ichliksiz qoldiradi. Teng huquqli tarmoqlar uchun esa `if`/`else` qoladi.
- "Bitta chiqish" qoidasi eski muhitlardan qolgan; zamonaviy TS'da tozalash `finally` va `using` bilan hal qilinadi.
- Cyclomatic complexity (McCabe) mustaqil yo'llarni sanaydi va ichma-ichlikni sezmaydi; cognitive complexity (Sonar) ichma-ichlik uchun qo'shimcha ball beradi.
- Metrikalar e'tibor talab qiladigan joyni ko'rsatadi, lekin maqsad emas.
