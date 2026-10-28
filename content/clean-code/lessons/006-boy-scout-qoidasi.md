---
n: 6
slug: boy-scout-qoidasi
title: "Boy Scout qoidasi va kichik yaxshilanishlar"
summary: "Kod bazasini katta \"refaktoring sprint\"lari bilan emas, har kungi kichik yaxshilanishlar bilan tozalash mumkin. Bu darsda Martin'ning Boy Scout qoidasini, Kent Beck'ning Tidy First kitobidagi tidying'larni va eng muhimi - struktura va xatti-harakat o'zgarishlarini ajratish intizomini ko'ramiz."
duration: 30
sources:
  - id: cc1
    note: "1-bob oxiridagi \"The Boy Scout Rule\" bo'limi"
  - id: tidy-first
    note: "I qism: tidying katalogi (guard clauses, dead code, explaining variables, reading order va boshqalar); II qism: tidying'ni alohida PR qilish, first/after/later/never; III qism: struktura va xatti-harakat o'zgarishlari, coupling"
  - id: pragprog
    note: "Software Entropy mavzusi: singan derazalar va ularni tuzatmaslik oqibati"
quiz:
  - q: "Siz bug'ni tuzatish uchun faylga kirdingiz va yonidagi funksiyada noaniq nom va o'lik kodni ko'rdingiz. Tidy First nuqtai nazaridan eng to'g'ri yo'l qaysi?"
    options:
      - "Hammasini bitta commit'da tuzatish, chunki fayl baribir o'zgarmoqda"
      - "Hech narsaga tegmaslik, chunki vazifa faqat bug"
      - "Butun faylni qayta yozish"
      - "Kichik tidying'ni (nom, o'lik kod) bug fix'dan alohida commit yoki PR qilish: avval struktura, keyin xatti-harakat"
    answer: 3
    explain: "Beck struktura o'zgarishlari va xatti-harakat o'zgarishlarini aralashtirmaslikni tavsiya qiladi. Alohida commit review'ni osonlashtiradi: tidying'ni \"xatti-harakat o'zgarmadi\" deb tez tekshirish mumkin, bug fix esa kichik va aniq bo'ladi."
  - q: "Boy Scout qoidasining asosiy g'oyasi nima?"
    options:
      - "Kodni har safar u tegilganda sal tozaroq qoldirish, shunda kod bazasi vaqt o'tishi bilan yomonlashish o'rniga yaxshilanadi"
      - "Har sprintda bitta hafta refaktoringga ajratish"
      - "Yangi kodni faqat senior dasturchi yozishi"
      - "Kod review'da barcha kamchiliklarni topish"
    answer: 0
    explain: "Martin qoidasi kichik va doimiy yaxshilanish haqida: o'zgaruvchi nomini yaxshilash, katta funksiyani bo'lish, kichik takrorni yo'qotish. Kod har safar tegilganda yaxshilansa, u chirimaydi."
  - q: "Beck'ning Tidy First kitobida tidying qachon qilinishi mumkinligi bo'yicha qaysi variantlar ko'riladi?"
    options:
      - "Faqat release'dan keyin"
      - "Faqat loyiha boshida"
      - "Oldin (first), keyin (after), keyinroq (later) yoki umuman yo'q (never) - har biri o'z holatida oqilona"
      - "Faqat code review paytida"
    answer: 2
    explain: "Beck tidying vaqtini iqtisodiy qaror sifatida ko'radi. Agar u keyingi o'zgarishni osonlashtirsa - oldin. Agar o'zgarishdan keyin tushuncha paydo bo'lsa - keyin. Agar kod hech qachon o'zgarmasa - hech qachon."
  - q: "Quyidagi o'zgarishlardan qaysi biri tidying emas, balki xatti-harakat o'zgarishi?"
    options:
      - "Ichma-ich `if` ni guard clause'ga aylantirish"
      - "`if (amount > 0)` ni `if (amount >= 0)` ga o'zgartirish"
      - "Murakkab ifodani tushuntiruvchi o'zgaruvchiga chiqarish"
      - "Funksiyalarni o'qish tartibida joylashtirish"
    answer: 1
    explain: "`>` ni `>=` ga almashtirish nol summa uchun xatti-harakatni o'zgartiradi. Qolgan uchtasi kodning tuzilmasini o'zgartiradi, lekin natijani emas. Aynan shu farq tufayli ularni alohida commit'da saqlash muhim: kichik xatti-harakat o'zgarishi tidying orasida yashirinib qolmasligi kerak."
  - q: "Jamoadagi dasturchi \"Boy Scout\" nomi ostida har bir PR'ga 40 ta faylda formatlash va nomlash o'zgarishlarini qo'shmoqda. Nima muammo?"
    options:
      - "Muammo yo'q, ko'proq tozalash yaxshiroq"
      - "Faqat formatlash Prettier'ga topshirilmagani"
      - "Faqat PR nomi noto'g'ri"
      - "Asosiy o'zgarish shovqin ichida yo'qoladi, review sifati tushadi, merge konfliktlar ko'payadi va tozalash vazifa bilan bog'liq bo'lmagan joylarga tarqaladi"
    answer: 3
    explain: "Boy Scout qoidasi \"lager joyini\" - siz ishlayotgan joyni tozalash haqida, butun o'rmonni emas. Katta, aralash PR'lar review'ni buzadi. Tidying kichik, vazifaga yaqin va alohida bo'lishi kerak."
task:
  title: "Bug fix'dan oldin tidying"
  prompt: |
    Quyidagi funksiya yoqilg'i kartasi tranzaksiyasini tekshiradi. Bug: **limit aynan tugagan holatda (qolgan limit tranzaksiya summasiga teng) tranzaksiya rad etilmoqda, lekin u o'tishi kerak**.

    Ikki bosqichda ishlang va har birini alohida commit sifatida tasavvur qiling:

    1. **Tidying commit.** Xatti-harakatni o'zgartirmasdan kodni bug'ni ko'rish va tuzatish oson bo'ladigan holatga keltiring (guard clause, tushuntiruvchi o'zgaruvchi, o'lik kodni o'chirish). Bu bosqichda bug saqlanib qolishi kerak.
    2. **Bug fix commit.** Faqat bitta xatti-harakat o'zgarishi.

    Yechimda ikkala bosqich natijasini ko'rsating.
  lang: ts
  starter: |
    type FuelCard = { id: string; active: boolean; monthlyLimitUzs: number; spentThisMonthUzs: number };
    type Transaction = { cardId: string; amountUzs: number; stationId: string };

    export function validate(card: FuelCard, tx: Transaction): { ok: boolean; reason?: string } {
      let result: { ok: boolean; reason?: string } = { ok: true };
      if (card.id === tx.cardId) {
        if (card.active) {
          if (tx.amountUzs > 0) {
            // const legacyCheck = tx.stationId.startsWith("OLD");
            if (card.monthlyLimitUzs - card.spentThisMonthUzs > tx.amountUzs) {
              result = { ok: true };
            } else {
              result = { ok: false, reason: "limit" };
            }
          } else {
            result = { ok: false, reason: "amount" };
          }
        } else {
          result = { ok: false, reason: "inactive" };
        }
      } else {
        result = { ok: false, reason: "card" };
      }
      return result;
    }
  solution: |
    type FuelCard = { id: string; active: boolean; monthlyLimitUzs: number; spentThisMonthUzs: number };
    type Transaction = { cardId: string; amountUzs: number; stationId: string };

    type ValidationResult = { ok: boolean; reason?: string };

    // 1-commit (tidying): guard clause'lar, tushuntiruvchi o'zgaruvchi, o'lik komment o'chirildi.
    // Bu bosqichda shart hali ham `>`, ya'ni bug saqlangan:
    //   if (remainingLimitUzs > tx.amountUzs) return { ok: true };

    // 2-commit (bug fix): bitta belgi o'zgardi, `>` -> `>=`.
    export function validate(card: FuelCard, tx: Transaction): ValidationResult {
      if (card.id !== tx.cardId) return { ok: false, reason: "card" };
      if (!card.active) return { ok: false, reason: "inactive" };
      if (tx.amountUzs <= 0) return { ok: false, reason: "amount" };

      const remainingLimitUzs = card.monthlyLimitUzs - card.spentThisMonthUzs;
      if (remainingLimitUzs >= tx.amountUzs) return { ok: true };

      return { ok: false, reason: "limit" };
    }
  solutionNotes: |
    - Tidying commit'da to'rt darajali ichma-ichlik guard clause'larga aylandi. Rad etish sabablari endi shartning yonida turadi, `else` bloklari orasidan qidirish shart emas.
    - `remainingLimitUzs` tushuntiruvchi o'zgaruvchisi bug'ni ko'rinadigan qildi: "qolgan limit summadan katta bo'lsa" degan jumla o'qilgan zahoti "teng bo'lsa-chi?" savoli tug'iladi.
    - Izohga olingan `legacyCheck` o'lik kod edi. U git tarixida bor, faylda shovqin.
    - `let result` va qayta tayinlash olib tashlandi: har bir yo'l darhol qaytadi.
    - Bug fix commit'da faqat `>` -> `>=`. Reviewer uni bir qarashda tekshiradi. Agar tidying va fix bitta commit'da bo'lsa, bu bitta belgilik xatti-harakat o'zgarishi 20 qatorli qayta tuzilma ichida yo'qolardi.
    - `reason` ni union tipga aylantirish ham foydali bo'lardi, lekin bu chaqiruvchilarga ta'sir qiladi va alohida qaror: Boy Scout qoidasi lager joyini tozalaydi, butun o'rmonni emas.
  checklist:
    - "Tidying bosqichi xatti-harakatni o'zgartirmadi (bug saqlandi)"
    - "Ichma-ich shartlar guard clause'larga aylandi"
    - "Qolgan limit nomli o'zgaruvchi orqali ifodalandi"
    - "O'lik kod va izohga olingan kod o'chirildi"
    - "Bug fix bitta, alohida va kichik o'zgarish"
---

## Muammo

Ko'p jamoalar kod sifatini "refaktoring sprinti" bilan yaxshilashga urinadi. Bir necha oy feature yoziladi, kod chiriydi, keyin jamoa menejmentdan ikki hafta "tozalash" uchun so'raydi. Ko'pincha javob "hozir emas" bo'ladi. Ruxsat berilsa ham, ikki hafta oxirida katta, xavfli o'zgarishlar to'plami paydo bo'ladi, uni review qilish qiyin, va bir necha oydan keyin vaziyat qaytadan boshlanadi.

Muammo yondashuvning o'zida: tozalash ish jarayonidan **ajratilgan**. U alohida vaqt, alohida ruxsat va alohida byudjet talab qiladi. Natijada u kamdan-kam bo'ladi va har safar katta bo'ladi.

Bu darsda muqobil yondashuvni ko'ramiz: tozalashni har kungi ishning ichiga joylashtirish, kichik qadamlar bilan va xavfsiz tarzda.

## Asosiy g'oya

### Boy Scout qoidasi

Robert Martin *Clean Code*ning birinchi bobini skautlar qoidasi bilan yakunlaydi: lager joyini topganingizdan ko'ra tozaroq qoldiring. Kodga qo'llanganda: modulni har safar o'zgartirganda uni sal tozaroq qilib qoldiring. Martin misollari ataylab kichik: bitta o'zgaruvchi nomini yaxshilash, bitta katta funksiyani bo'lish, bitta kichik takrorni yo'qotish, bitta murakkab `if` ni soddalashtirish.

G'oyaning kuchi matematikada: agar har bir o'zgarish kodni bir oz yaxshilasa, kod bazasi vaqt o'tishi bilan yomonlashmaydi. Ko'p tegiladigan joylar eng tez tozalanadi, va bu aynan kerak bo'lgan narsa (3-darsdagi Ousterhout formulasi va 4-darsdagi "foiz" g'oyasi).

Pragmatic Programmer bu g'oyaning teskari tomonini ko'rsatadi: dasturiy entropiya va singan derazalar. Tuzatilmagan har bir yomon joy keyingi beparvolikni osonlashtiradi. Boy Scout qoidasi - shu entropiyaga qarshi kundalik qarshi kuch.

### Tidy First

Kent Beck 2023 yildagi *Tidy First?* kitobida bu g'oyani aniqroq va intizomliroq qiladi. U **tidying** degan atamani kiritadi: kichik, xavfsiz, xatti-harakatni o'zgartirmaydigan tuzilma o'zgarishi. Tidying refaktoringning eng kichik birligi. Kitobning birinchi qismi ularning katalogi, masalan:

- **Guard clauses** - ichma-ich shartlarni erta qaytishga aylantirish.
- **Dead code** - ishlatilmaydigan kodni o'chirish.
- **Normalize symmetries** - bir xil narsani bir xil usulda yozish.
- **Reading order** va **cohesion order** - kodni o'quvchi o'qiydigan va birga o'zgaradigan tartibda joylashtirish.
- **Move declaration and initialization together** - o'zgaruvchini ishlatiladigan joyiga yaqinlashtirish.
- **Explaining variables** va **explaining constants** - ifoda va raqamlarga nom berish.
- **Extract helper**, **chunk statements** - kodni ma'noli bo'laklarga ajratish.
- **One pile** - aksincha, haddan tashqari maydalangan kodni tushunish uchun bir joyga yig'ish.
- **Delete redundant comments** - kod allaqachon aytgan narsani takrorlovchi kommentlarni o'chirish.

Oxirgi ikkitasiga e'tibor bering: Beck tidying'ni faqat "bo'lish va nomlash" deb ko'rmaydi. Ba'zan tozalash - yig'ish.

Kitob nomidagi savol belgisi ataylab: "avval tozalaymizmi?" - bu har safar qaror qilinadigan savol, avtomatik "ha" emas.

## Chuqurroq: struktura va xatti-harakat

### Ikki xil o'zgarish

Beck'ning eng muhim g'oyasi: dasturdagi o'zgarishlar ikki xil.

- **Xatti-harakat o'zgarishi** - dastur boshqacha natija beradi: yangi feature, bug fix.
- **Struktura o'zgarishi** - dastur bir xil natija beradi, lekin kod boshqacha tashkil qilingan: tidying, refaktoring.

Bu ikkisini **bitta commit yoki PR'da aralashtirmang**. Sabablari:

1. **Review.** Struktura o'zgarishini "xatti-harakat o'zgarmadi" deb tez tekshirish mumkin. Aralash PR'da reviewer har bir qatorda "bu ataylabmi yoki tasodifiymi?" deb so'rashi kerak.
2. **Qaytarish.** Xatti-harakat o'zgarishi muammo bersa, uni tidying'ga tegmasdan qaytarish mumkin.
3. **Xavf profili.** Struktura o'zgarishlari odatda qaytariladigan va past xavfli. Xatti-harakat o'zgarishlari yuqori xavfli. Ularni ajratish har biriga mos ehtiyotkorlik darajasini qo'llashga imkon beradi.

### Qachon tidying qilish kerak

Beck to'rtta javobni ko'rib chiqadi:

- **First (oldin).** Agar tidying keyingi xatti-harakat o'zgarishini osonlashtirsa va arzon bo'lsa. Klassik holat: bug'ni tushunish uchun avval kodni o'qiladigan qilish.
- **After (keyin).** Agar o'zgarishdan keyin kodni yaxshiroq tushunsangiz va shu joyga yana tez-tez tegish kerak bo'lsa.
- **Later (keyinroq).** Agar tidying katta bo'lsa va hozirgi vazifaga to'sqinlik qilmasa. Uni ro'yxatga yozing.
- **Never (hech qachon).** Agar kod hech qachon o'zgarmasa. Tegilmaydigan kodni tozalash investitsiya emas.

Bu qaror iqtisodiy. Kitobning uchinchi qismida Beck uni pulning vaqt qiymati va **optionality** (imkoniyatlar qiymati) orqali tushuntiradi: bugun pul sarflashdan ko'ra ertaga sarflash afzal, lekin yaxshi tuzilma kelajakda ko'proq variantlarni ochiq saqlaydi. Tidying - shu ikki kuch o'rtasidagi muvozanat.

Beck shuningdek Larry Constantine'ning g'oyasiga tayanadi: dasturiy ta'minot narxi asosan uni o'zgartirish narxi, o'zgartirish narxi esa asosan katta, kaskadli o'zgarishlar narxi, va ular **coupling** (bog'liqlik) tufayli yuzaga keladi. Ya'ni kichik tidying'lar oxir-oqibat coupling'ni kamaytirishga xizmat qiladi.

### Kichik partiyalar

Beck tidying'larni kichik partiyalarda (batch) qilishni maslahat beradi. Katta tidying PR'i ham review'ni qiyinlashtiradi va merge konfliktlarni ko'paytiradi. Bitta PR - bitta yoki bir nechta bog'liq tidying, bir necha daqiqada review qilinadigan.

## Misol: bug fix oldidan tidying

Ijara platformasida depozitni qaytarish funksiyasi:

```ts
type Rental = {
  id: string;
  returnedAt: Date | null;
  dueAt: Date;
  depositUzs: number;
  damageUzs: number;
};

export function depositRefund(r: Rental): number {
  let refund = 0;
  if (r.returnedAt) {
    if (r.damageUzs < r.depositUzs) {
      refund = r.depositUzs - r.damageUzs;
      if (r.returnedAt > r.dueAt) {
        const late = Math.ceil((r.returnedAt.getTime() - r.dueAt.getTime()) / 86400000);
        refund = refund - late * 50000;
      }
    }
  }
  return refund;
}
```

Bug hisoboti: "kechikish jarimasi depozitdan oshsa, mijozga manfiy summa qaytarilmoqda". Avval tidying commit (xatti-harakat bir xil):

```ts
const MS_PER_DAY = 86_400_000;
const LATE_FEE_PER_DAY_UZS = 50_000;

export function depositRefund(rental: Rental): number {
  if (!rental.returnedAt) return 0;
  if (rental.damageUzs >= rental.depositUzs) return 0;

  const afterDamage = rental.depositUzs - rental.damageUzs;
  const lateFee = lateDays(rental.returnedAt, rental.dueAt) * LATE_FEE_PER_DAY_UZS;
  return afterDamage - lateFee;
}

function lateDays(returnedAt: Date, dueAt: Date): number {
  if (returnedAt <= dueAt) return 0;
  return Math.ceil((returnedAt.getTime() - dueAt.getTime()) / MS_PER_DAY);
}
```

Endi bug ko'zga tashlanadi: `afterDamage - lateFee` manfiy bo'lishi mumkin. Keyingi commit faqat xatti-harakat o'zgarishi:

```ts
  return Math.max(0, afterDamage - lateFee);
```

Ikki commit, ikki xil review. Birinchisini reviewer "faqat qayta tuzilma, natijalar bir xil" deb tez tekshiradi. Ikkinchisi bitta qator va uning biznes ma'nosini muhokama qilish oson: "jarima depozitdan oshsa, qolgan qismini qanday undiramiz?" - bu endi alohida savol.

Bu yerda biz `Rental` ni discriminated union'ga aylantirmadik (`returnedAt: Date | null` o'rniga holatlar), `Money` tipini kiritmadik. Ular yaxshi g'oyalar bo'lishi mumkin, lekin ular boshqa chaqiruvchilarga ta'sir qiladi va alohida qaror talab qiladi. Tidying - lokal.

## Qachon qo'llamaslik kerak

- **Kod hech qachon o'zgarmasa.** Beck'ning "never" varianti. Uch yildan beri hech kim tegmagan modulni "o'tib ketayotib" tozalash risk qo'shadi va foyda bermaydi.
- **Testlar yo'q va xatti-harakat noaniq.** Tidying xavfsiz bo'lishi uchun uning xatti-harakatni o'zgartirmaganiga ishonch kerak. Testsiz legacy kodda avval characterization test yozing (79-dars), yoki faqat IDE'ning avtomatik refaktoringlari bilan cheklaning (rename, extract).
- **Boshqa jamoaning kodi yoki umumiy kutubxona.** "Lager joyi" sizning vazifangiz chegarasi. Boshqa jamoa egasi bo'lgan kodni ogohlantirishsiz o'zgartirish ishonchni buzadi (10-darsda Abramov hikoyasi aynan shu haqida).
- **Hotfix paytida.** Production yiqilgan bo'lsa, minimal o'zgarish qiling. Tidying keyinroq.
- **Tidying PR'lari shovqinga aylanganda.** 40 faylga tegadigan "kichik tozalashlar" kichik emas. Formatlash kabi mexanik o'zgarishlarni Prettier'ga topshiring va bir martalik alohida commit qiling (36-dars).
- **Ziddiyatli did masalalari.** `forEach` yoki `for...of`, `function` yoki arrow - bular tidying emas, did. Jamoa kelishuvi yoki linter qoidasi bo'lmasa, ularni o'zgartirmang.

## Stack'da: git, NestJS, React

- **Commit intizomi.** Conventional Commits uslubida `refactor:` (struktura) va `fix:` yoki `feat:` (xatti-harakat) prefikslari bu ajratishni tarixda ko'rinadigan qiladi (39-dars). Stacked PR'lar (birinchisi tidying, ikkinchisi feature) review'ni yanada osonlashtiradi.
- **IDE refaktoringlari.** VS Code va WebStorm'dagi "Rename Symbol", "Extract Function", "Move to new file" TypeScript tip tizimi tufayli juda ishonchli. Ular bilan qilingan tidying deyarli xavfsiz.
- **NestJS'da tipik tidying'lar.** Controller'dagi biznes mantiqni service'ga ko'chirish, `@Body() body: any` ni DTO'ga aylantirish, constructor'dagi ishlatilmaydigan injection'larni o'chirish.
- **React'da tipik tidying'lar.** Ishlatilmaydigan prop'larni o'chirish, `useEffect` ichidagi hosila state'ni oddiy hisoblashga aylantirish (bu xatti-harakatni o'zgartirishi mumkin, ehtiyot bo'ling), uzun JSX'ni nomli kichik komponentlarga ajratish.
- **ESLint `--fix`.** Avtomatik tuzatiladigan qoidalarni alohida, bir martalik commit'da qo'llang va `.git-blame-ignore-revs` fayliga qo'shing, shunda `git blame` foydali qoladi.

## Xulosa

- Boy Scout qoidasi: kodni har safar tegganingizda sal tozaroq qoldiring. Kichik doimiy yaxshilanish katta refaktoring sprintlaridan samaraliroq.
- Beck'ning tidying'lari - eng kichik, xavfsiz, xatti-harakatni o'zgartirmaydigan qadamlar. Ba'zan bo'lish, ba'zan yig'ish.
- Struktura va xatti-harakat o'zgarishlarini alohida commit yoki PR'da saqlang: review, qaytarish va xavf profili uchun.
- Tidying vaqti iqtisodiy qaror: first, after, later yoki never.
- Lager joyi - sizning vazifangiz atrofi. Butun o'rmonni, boshqa jamoaning kodini va hech kim tegmaydigan kodni tozalash Boy Scout qoidasi emas.
