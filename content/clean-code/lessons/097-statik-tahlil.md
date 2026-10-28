---
n: 97
slug: statik-tahlil
title: "Statik tahlil va metrikalar"
summary: "Metrikalar kod sifatini o'lchamaydi, ular faqat qayerga qarash kerakligini ko'rsatadi. Bu darsda cyclomatic va cognitive complexity qanday hisoblanishini, ular nimani ko'radi va nimani ko'rmasligini, hamda arxitektura qoidalarini dependency-cruiser bilan avtomatik tekshirishni ko'ramiz."
duration: 35
sources:
  - id: sonar-cognitive
    note: "Cognitive Complexity white paper: uchta asosiy qoida, structural/hybrid/fundamental increment'lar, nesting jarimasi, getWords va sumOfPrimes misolida cyclomatic bilan solishtirish"
  - id: mccabe-1976
    note: "Cyclomatic complexity ta'rifi: boshqaruv oqimi grafidagi mustaqil yo'llar soni va modul uchun yuqori chegara taklifi"
  - id: dependency-cruiser
    note: "forbidden qoidalari (from/to, path/pathNot), no-circular qoidasi, --init va validatsiya"
quiz:
  - q: "To'rtta case'li `switch` va ichma-ich ikki sikl ichidagi `if` va label'li `continue` bor funksiya. Sonar white paper'ga ko'ra ikkalasining cyclomatic complexity'si 4. Cognitive complexity nimani ko'rsatadi?"
    options:
      - "Ikkalasi ham 4"
      - "switch'li funksiya murakkabroq"
      - "switch'li funksiya 1, ichma-ich sikllisi 7: ikkinchisini tushunish ancha qiyinligini aks ettiradi"
      - "Cognitive complexity sikllarni hisoblamaydi"
    answer: 2
    explain: "White paper'dagi getWords (switch) 1 ball oladi, chunki butun switch bir marta hisoblanadi. sumOfPrimes 7 oladi: tashqi for +1, ichki for +2 (nesting), if +3, label'li continue +1. Cyclomatic ularni teng ko'radi, inson esa yo'q."
  - q: "Cognitive complexity qoidalariga ko'ra quyidagilardan qaysi biri ball QO'SHMAYDI?"
    options:
      - "Ichma-ich if"
      - "Optional chaining va null-coalescing kabi qisqartmalar, hamda kodni nomlangan metodga ajratish"
      - "catch bloki"
      - "Aralash && va || ketma-ketligi"
    answer: 1
    explain: "Birinchi qoida: ko'p ifodani bittaga qisqartiradigan tuzilmalar e'tiborsiz qoldiriladi. Metod e'loni ham ball qo'shmaydi, shuning uchun mantiqni nomlangan funksiyaga ajratish rag'batlanadi. Ichma-ich if nesting jarimasi oladi, catch va mantiqiy operator ketma-ketliklari ham ball qo'shadi."
  - q: "Jamoa CI'da \"cognitive complexity > 15 bo'lsa, build yiqilsin\" qoidasini kiritdi. Bir oydan keyin funksiyalar ko'plab mayda yordamchilarga bo'linib ketdi, lekin kodni tushunish osonlashmadi. Bu qaysi hodisa?"
    options:
      - "Goodhart qonuni: o'lchov maqsadga aylanganda u yaxshi o'lchov bo'lishdan to'xtaydi"
      - "Metrika noto'g'ri sozlangan, chegara 10 bo'lishi kerak edi"
      - "Bu kutilgan natija, kod endi toza"
      - "Cognitive complexity TypeScript'da ishlamaydi"
    answer: 0
    explain: "Metrika bitta funksiya ichidagi oqimni o'lchaydi. Uni chetlab o'tish uchun mantiqni sayoz funksiyalarga bo'lish ball'ni pasaytiradi, lekin umumiy murakkablik (sakrashlar, kontekst) oshishi mumkin. Shuning uchun metrika review uchun signal, avtomatik hakam emas."
  - q: "NestJS loyihasida `vehicles` moduli `billing` modulining ichki `billing.repository.ts` faylini to'g'ridan-to'g'ri import qilmoqda. Buni qaysi vosita eng yaxshi ushlaydi?"
    options:
      - "Cognitive complexity metrikasi"
      - "Prettier"
      - "Test coverage"
      - "dependency-cruiser'dagi forbidden qoidasi: boshqa modulning ichki fayllariga import taqiqlanadi"
    answer: 3
    explain: "Complexity metrikalari funksiya ichini ko'radi, modullar orasidagi bog'liqlikni emas. dependency-cruiser import grafini tekshiradi va path/pathNot bilan arxitektura chegaralarini qoida sifatida ifodalashga imkon beradi."
  - q: "McCabe cyclomatic complexity'ni nima uchun foydali deb taklif qilgan?"
    options:
      - "Kodning o'qilishini aniq o'lchash uchun"
      - "Mustaqil yo'llar sonini, demak to'liq test qilish uchun kerakli minimal holatlar sonini va modul murakkabligini baholash uchun"
      - "Kod ishlash tezligini bashorat qilish uchun"
      - "Qatorlar sonini almashtirish uchun"
    answer: 1
    explain: "McCabe metrikasi graf nazariyasiga asoslangan: boshqaruv oqimi grafidagi chiziqli mustaqil yo'llar soni. U test holatlari soni bilan bog'liq va modullarni bo'lish uchun yuqori chegara sifatida taklif qilingan. O'qilishni o'lchash Sonar metrikasining maqsadi."
task:
  title: "Funksiyaning cognitive complexity'sini hisoblash va kamaytirish"
  prompt: |
    1. Quyidagi funksiyaning cognitive complexity'sini Sonar qoidalari bo'yicha qo'lda hisoblang. Har bir increment'ni qator bo'yicha yozing.
    2. Funksiyani xatti-harakatini o'zgartirmasdan qayta yozing, shunda ball kamida ikki baravar kamaysin. Ball'ni kamaytirish uchun shunchaki mantiqni mayda funksiyalarga sochmang: har bir ajratilgan funksiya ma'noli nomga ega bo'lsin.
    3. Yangi versiyaning ballini ham hisoblang.
    4. Loyiha uchun dependency-cruiser qoidasini yozing: `src/modules/<modul>/` ichidagi fayllar boshqa modulning faqat `index.ts` faylini import qila olsin.
  lang: ts
  starter: |
    type Trip = { distanceKm: number; durationMin: number; nightMinutes: number; tollsUzs: number[] };
    type Tariff = { perKm: number; perMin: number; nightMultiplier: number; minFare: number };

    export function calculateFare(trip: Trip, tariff: Tariff, promo?: { percent: number; maxUzs: number }) {
      let fare = 0;
      if (trip.distanceKm > 0) {
        fare += trip.distanceKm * tariff.perKm;
        if (trip.durationMin > 0) {
          fare += trip.durationMin * tariff.perMin;
          if (trip.nightMinutes > 0 && trip.nightMinutes <= trip.durationMin) {
            const nightShare = trip.nightMinutes / trip.durationMin;
            fare += fare * nightShare * (tariff.nightMultiplier - 1);
          }
        }
      }
      for (const toll of trip.tollsUzs) {
        if (toll > 0) {
          fare += toll;
        }
      }
      if (promo) {
        const discount = (fare * promo.percent) / 100;
        fare -= discount > promo.maxUzs ? promo.maxUzs : discount;
      }
      return fare < tariff.minFare ? tariff.minFare : Math.round(fare);
    }
  solution: |
    // 1. Starter balli (Sonar qoidalari):
    //   if (distanceKm > 0)                     +1 (nesting 0)
    //     if (durationMin > 0)                  +2 (1 + nesting 1)
    //       if (nightMinutes > 0 && ...)        +3 (1 + nesting 2)
    //         && ketma-ketligi                  +1
    //   for (toll of tollsUzs)                  +1
    //     if (toll > 0)                         +2 (1 + nesting 1)
    //   if (promo)                              +1
    //     ternary (discount > maxUzs)           +2 (1 + nesting 1)
    //   ternary (fare < minFare)                +1
    //   Jami: 14

    type Trip = { distanceKm: number; durationMin: number; nightMinutes: number; tollsUzs: number[] };
    type Tariff = { perKm: number; perMin: number; nightMultiplier: number; minFare: number };
    type Promo = { percent: number; maxUzs: number };

    // +1 (if) +1 (||) = 2
    function nightShare(trip: Trip): number {
      if (trip.durationMin <= 0 || trip.nightMinutes > trip.durationMin) return 0;
      return Math.max(trip.nightMinutes, 0) / trip.durationMin;
    }

    // +1 (if) = 1
    function rideFare(trip: Trip, tariff: Tariff): number {
      if (trip.distanceKm <= 0) return 0;
      const base = trip.distanceKm * tariff.perKm + Math.max(trip.durationMin, 0) * tariff.perMin;
      return base * (1 + nightShare(trip) * (tariff.nightMultiplier - 1));
    }

    // 0
    function tollsTotal(tolls: number[]): number {
      return tolls.filter((toll) => toll > 0).reduce((sum, toll) => sum + toll, 0);
    }

    // +1 (if) = 1
    function promoDiscount(fare: number, promo: Promo | undefined): number {
      if (!promo) return 0;
      return Math.min((fare * promo.percent) / 100, promo.maxUzs);
    }

    // 0
    export function calculateFare(trip: Trip, tariff: Tariff, promo?: Promo): number {
      const beforePromo = rideFare(trip, tariff) + tollsTotal(trip.tollsUzs);
      const fare = beforePromo - promoDiscount(beforePromo, promo);
      return Math.max(Math.round(fare), tariff.minFare);
    }
    // Eng murakkab funksiya: 2. Jami: 4.

    // 4. .dependency-cruiser.js qoidasi:
    // {
    //   name: "only-public-module-api",
    //   comment: "Boshqa modulga faqat uning index.ts orqali murojaat qiling",
    //   severity: "error",
    //   from: { path: "^src/modules/([^/]+)/" },
    //   to: {
    //     path: "^src/modules/([^/]+)/",
    //     pathNot: ["^src/modules/$1/", "^src/modules/[^/]+/index\\.ts$"],
    //   },
    // }
  solutionNotes: |
    - Starter ballining katta qismi nesting jarimasidan keladi: uchinchi darajadagi `if` bitta o'zi +3 oladi. Guard clause (26-dars) va mustaqil qismlarni nomlangan funksiyalarga ajratish nesting'ni yo'qotadi.
    - `Math.min`/`Math.max` va `filter`/`reduce` ternary va sikl o'rnini bosdi. Sonar metrikasi ularni hisoblamaydi, chunki ular boshqaruv oqimini sindirmaydi. Bu metrikani aldash emas: o'quvchi uchun ham `Math.max(fare, minFare)` "kamida minFare" niyatini aniqroq aytadi.
    - Ajratilgan funksiyalar sayoz emas: har biri tarifning bitta biznes tushunchasi (yo'l narxi, tungi ulush, yo'l to'lovlari, promo). Ularni alohida test qilish mumkin.
    - Kichik nozik o'zgarish: original `Math.round` faqat minFare'dan katta narxga qo'llanardi. Yangi versiyada avval yaxlitlanadi, keyin minimum bilan solishtiriladi. Agar minFare butun son bo'lsa, natija bir xil. Bunday farqlarni characterization test bilan tekshiring (79-dars).
    - dependency-cruiser qoidasida `$1` - `from` dagi modul nomi. Modul o'z ichidagi fayllarni erkin import qiladi, boshqa modulning esa faqat `index.ts` sini. Bu NestJS modul `exports` ning fayl darajasidagi davomi (83-dars).
  checklist:
    - "Starter ballari har bir increment bilan qator bo'yicha hisoblangan (jami 14)"
    - "Yangi versiyada nesting chuqurligi 1 dan oshmaydi"
    - "Ajratilgan har bir funksiyaning nomi biznes tushunchasini ifodalaydi"
    - "Xatti-harakat bir xil ekanini bir nechta misol (tungi reys, promo, minimal narx) bilan tekshirdim"
    - "dependency-cruiser qoidasi boshqa modulning ichki fayllarini taqiqlaydi, o'z modulini esa emas"
---

## Muammo

Har bir jamoa kod sifatini o'lchashni xohlaydi. Sababi tushunarli: "bu kod yomon" degan gap subyektiv, "bu funksiyaning murakkabligi 34" degan gap esa aniq ko'rinadi. Raqam bahsni to'xtatadi, dashboard'da grafik chizadi, menejerga hisobot beradi.

Muammo shundaki, raqamlar ikki tomonlama xato qiladi. Ba'zan ular muhim narsani ko'rmaydi: 20 ta mayda, alohida "oddiy" funksiyaga bo'lingan algoritm har bir funksiyada past ball oladi, lekin uni tushunish uchun 20 ta joyga sakrash kerak. Ba'zan ular muhim bo'lmagan narsani jazolaydi: 12 ta `case`li toza `switch` klassik metrikada "juda murakkab" deb belgilanadi.

Undan ham xavflisi: metrika maqsadga aylanganda, odamlar kodni emas, metrikani optimallashtiradi. Bu iqtisodda Goodhart qonuni deb ataladi va dasturlashda juda yaxshi ishlaydi: "complexity 10 dan oshmasin" qoidasi kodni yaxshilamaydi, u kodni 10 dan oshmaydigan shaklga keltiradi.

Bu darsning maqsadi - metrikalar nimani o'lchashini aniq bilish, shunda ular foydali signal bo'lsin va soxta hakamga aylanmasin.

## Asosiy g'oya

Statik tahlil vositalarini uch guruhga bo'lish foydali:

1. **Funksiya ichidagi murakkablik.** Cyclomatic complexity (McCabe, 1976) va cognitive complexity (Sonar). Ular bitta funksiya qanchalik ko'p tarmoqlanishi va ichma-ich ekanini o'lchaydi.
2. **Modullar orasidagi tuzilma.** Bog'liqlik grafi, sikllik bog'liqliklar, qatlam qoidalari. dependency-cruiser, ESLint'ning import qoidalari.
3. **Xatolar va xavfli naqshlar.** Tip tekshiruvi (`tsc`), typescript-eslint'ning `no-floating-promises` kabi qoidalari (37-dars). Bu darsda asosan birinchi ikkitasini ko'ramiz.

Asosiy tamoyil: **metrika - qayerga qarash kerakligini ko'rsatadigan signal, kod sifatining ta'rifi emas.** 1-darsda toza kodni "boshqa odam qanchalik tez va xavfsiz o'zgartira oladi" deb ta'rifladik. Hech bir metrika buni to'g'ridan-to'g'ri o'lchamaydi. Lekin yaxshi metrika shu o'lchov bilan korrelyatsiya qiladi va review'da e'tiborni to'g'ri joyga yo'naltiradi.

## Chuqurroq: ikki metrikaning mexanikasi

### Cyclomatic complexity

Thomas McCabe 1976 yilgi maqolasida dasturning boshqaruv oqimi grafini oladi va undagi chiziqli mustaqil yo'llar sonini o'lchov sifatida taklif qiladi. Amalda bu taxminan "qaror nuqtalari soni + 1": har bir `if`, sikl, `case`, `&&`/`||` bitta qo'shadi. McCabe bu raqamni ikki maqsadda ishlatadi: test uchun zarur yo'llar sonini baholash va modul juda katta bo'lib ketganini aniqlash. U modul uchun 10 ni oqilona yuqori chegara sifatida taklif qilgan.

Metrika matematik jihatdan aniq va test uchun foydali: complexity 15 bo'lgan funksiyaning barcha yo'llarini qamrab olish uchun kamida 15 ta holat kerak. Lekin u o'qilishni o'lchash uchun yaratilmagan. Uning ikki ma'lum kamchiligi:

- **`switch` jazolanadi.** 10 ta `case` li oddiy xarita 10 ball oladi, garchi uni bir qarashda tushunish mumkin bo'lsa ham. ESLint'ning `complexity` qoidasi shu sababli `variant: "modified"` opsiyasiga ega: unda butun `switch` bitta ball. Qoidaning standart chegarasi 20.
- **Nesting ko'rinmaydi.** Ketma-ket uchta `if` va ichma-ich uchta `if` bir xil ball oladi, garchi ikkinchisini tushunish ancha qiyin bo'lsa ham.

### Cognitive complexity

SonarSource'dan G. Ann Campbell white paper'da aynan shu kamchiliklarni tuzatish uchun yangi metrika taklif qildi. White paper'ning maqsadi - funksiyani **tushunish** qanchalik qiyinligini o'lchash. Uchta asosiy qoida:

1. **Qisqartmalarni e'tiborsiz qoldirish.** Ko'p ifodani bittaga qisqartiradigan tuzilmalar ball qo'shmaydi. Masalan, null-coalescing va optional chaining. Metod e'loni ham ball qo'shmaydi, demak mantiqni nomlangan funksiyaga ajratish jazolanmaydi.
2. **Chiziqli oqimdagi har bir uzilish uchun +1.** `if`, ternary, `switch` (butun switch bir marta), sikllar, `catch`, bir xil mantiqiy operatorlarning har bir ketma-ketligi (`a && b && c` bitta, `a && b || c` ikkita), rekursiya, label'li `break`/`continue`.
3. **Ichma-ichlik uchun qo'shimcha jarima.** `if`, ternary, `switch`, sikl va `catch` ichma-ich bo'lsa, ular joriy nesting darajasiga teng qo'shimcha ball oladi.

Nozik joylar: `else if` va `else` bitta ball oladi, lekin nesting jarimasi olmaydi (hybrid increment). Lambda va ichki funksiyalar o'zi ball qo'shmaydi, lekin nesting darajasini oshiradi.

White paper bu farqni ikki funksiya bilan ko'rsatadi. `getWords` - to'rt `case`li `switch`: cyclomatic 4, cognitive 1. `sumOfPrimes` - ichma-ich ikki sikl, `if` va label'li `continue`: cyclomatic 4, cognitive 7. Cyclomatic ularni teng deydi, har qanday dasturchi esa ikkinchisini qiyinroq deydi.

Sonar'ning tegishli qoidasi (S3776) standart holatda 15 chegarasini ishlatadi. Bu chegara empirik kelishuv, ilmiy chegara emas.

### Metrika nimani ko'rmaydi

Ikkala metrika ham bitta funksiya ichini ko'radi. Ular quyidagilarni ko'rmaydi:

- **Nomlar.** `x1`, `tmp`, `data2` bilan yozilgan funksiya past ball olishi mumkin.
- **Funksiyalar orasidagi sakrashlar.** 21-darsda ko'rgan Ousterhout tanqid qiladigan "sayoz modullar zanjiri" har bir bo'lakda past ball beradi, lekin umumiy kognitiv yuk yuqori.
- **Semantik murakkablik.** Bitta qatorli regex yoki bit operatsiyasi 0 ball olishi va tushunish uchun 10 daqiqa talab qilishi mumkin.
- **Coupling.** Funksiya 15 ta global holatga tayanishi mumkin va bu complexity'da ko'rinmaydi.

Shuning uchun metrikani mutlaq chegara sifatida emas, nisbiy signal sifatida ishlating: "bu fayldagi eng yuqori ballli uchta funksiya" yoki "bu PR qaysi funksiyaning ballini oshirdi".

### Tuzilma qoidalari: dependency-cruiser

Arxitektura chegaralari (81-85-darslar) qog'ozda yaxshi ko'rinadi, lekin bitta shoshilinch import ularni buzadi. dependency-cruiser import grafini quradi va uni qoidalarga qarshi tekshiradi. Qoida `forbidden` ro'yxatida `from` va `to` bilan yoziladi, ular `path` va `pathNot` regex'larini qabul qiladi. `to: { circular: true }` sikllik bog'liqliklarni taqiqlaydi, va regex guruhlari (`$1`) "o'z modulingdan tashqariga" kabi qoidalarni ifodalashga imkon beradi. `npx dependency-cruiser --init` loyihaga mos konfiguratsiya yaratadi.

Bu metrikadan farqli: bu yerda raqam yo'q, faqat "ruxsat" va "taqiq". Shuning uchun u CI'da build'ni yiqitish uchun complexity chegarasidan ancha yaxshi nomzod: qoida jamoa kelishgan arxitektura qarorini aniq ifodalaydi.

## Misol: ball qayerdan keladi

Ijara buyurtmasini tasdiqlash:

```ts
type Booking = { carId: string; days: number; driverAge: number; hasDeposit: boolean };

export function validateBooking(b: Booking, blacklist: Set<string>): string[] {
  const errors: string[] = [];
  if (b.days > 0) {                                     // +1
    if (b.driverAge >= 21) {                            // +2 (nesting 1)
      if (!b.hasDeposit && b.days > 3) {                // +3 (nesting 2), && +1
        errors.push("3 kundan ortiq ijara uchun depozit kerak");
      }
    } else {                                            // +1
      errors.push("Haydovchi kamida 21 yoshda bo'lishi kerak");
    }
  } else {                                              // +1
    errors.push("Kunlar soni musbat bo'lishi kerak");
  }
  if (blacklist.has(b.carId)) {                         // +1
    errors.push("Bu mashina vaqtincha ijaraga berilmaydi");
  }
  return errors;
}
// Cognitive complexity: 10. Cyclomatic: 6.
```

Ballning yarmi nesting'dan: uchinchi darajadagi `if` bitta o'zi 3 ball. Endi har bir tekshiruvni mustaqil qoida sifatida yozamiz:

```ts
type Booking = { carId: string; days: number; driverAge: number; hasDeposit: boolean };

const MIN_DRIVER_AGE = 21;
const DEPOSIT_REQUIRED_AFTER_DAYS = 3;

export function validateBooking(b: Booking, blacklist: Set<string>): string[] {
  const errors: string[] = [];
  if (b.days <= 0) {                                                 // +1
    errors.push("Kunlar soni musbat bo'lishi kerak");
  } else if (b.driverAge < MIN_DRIVER_AGE) {                         // +1
    errors.push(`Haydovchi kamida ${MIN_DRIVER_AGE} yoshda bo'lishi kerak`);
  } else if (!b.hasDeposit && b.days > DEPOSIT_REQUIRED_AFTER_DAYS) { // +1, && +1
    errors.push(`${DEPOSIT_REQUIRED_AFTER_DAYS} kundan ortiq ijara uchun depozit kerak`);
  }
  if (blacklist.has(b.carId)) {                                      // +1
    errors.push("Bu mashina vaqtincha ijaraga berilmaydi");
  }
  return errors;
}
// Cognitive complexity: 5. Cyclomatic: 6 (o'zgarmadi).
```

Cyclomatic o'zgarmadi, chunki qaror nuqtalari soni bir xil: biz hech qanday mantiqni olib tashlamadik. Cognitive ikki baravar kamaydi, chunki shartlarni tekis `else if` zanjiriga aylantirish (26-darsdagi ichma-ichlikni kamaytirish g'oyasi) nesting'ni yo'qotdi. Xatti-harakat ham saqlandi: kunlar noto'g'ri bo'lsa ham qora ro'yxat tekshiruvi bajariladi, xuddi asl versiyadagidek. Bu metrika inson sezgisiga mos keladigan holat: ikkinchi versiyani yuqoridan pastga bir marta o'qib tushunish mumkin.

## Qachon qo'llamaslik kerak

- **Metrikani CI'da qat'iy darvoza qilish.** Chegara oshganda build yiqilsa, dasturchilar ballni pasaytirish uchun kodni sayoz funksiyalarga bo'ladi yoki `eslint-disable` qo'yadi. Yaxshiroq: yangi kodda ogohlantirish, review'da muhokama, va "PR ballni oshirdimi" kabi nisbiy signal.
- **Tabiiy murakkab algoritmlar.** Geofence ichida nuqtani aniqlash, marshrut optimallashtirish yoki parser'da yuqori ball normal. Ularni sun'iy bo'lish algoritmni tushunishni qiyinlashtiradi. Bunday joyda yaxshi izoh va testlar metrikadan muhimroq.
- **Butun loyihaning o'rtacha ballini kuzatish.** O'rtacha qiymat yuzlab oddiy getter'lar orasida bitta 60 ballli funksiyani yashiradi. Eng yuqori qiymatlar va o'zgarish tez-tez bo'ladigan fayllar (churn bilan birga) ko'proq gapiradi.
- **Har bir loyihaga dependency-cruiser.** Uch modulli servisda qoidalar konfiguratsiyasi kod bazasidan murakkabroq bo'lishi mumkin. Modullar soni va jamoa o'sganda kiriting.
- **Metrikani odamlarni baholash uchun ishlatish.** "Kimning kodi eng murakkab" degan reyting jamoani metrikani aldashga undaydi va review madaniyatini buzadi (96-dars).

## Stack'da: TypeScript loyihasida sozlash

```ts
// eslint.config.mjs (parcha)
import sonarjs from "eslint-plugin-sonarjs";

export default [
  {
    plugins: { sonarjs },
    rules: {
      complexity: ["warn", { max: 15, variant: "modified" }],
      "sonarjs/cognitive-complexity": ["warn", 15],
      "max-depth": ["warn", 3],
    },
  },
];
```

- `warn` ataylab: ogohlantirish review'da ko'rinadi, lekin build'ni to'xtatmaydi.
- `max-depth` nesting'ni to'g'ridan-to'g'ri cheklaydi va ko'pincha cognitive complexity'ning eng katta manbaini ushlaydi.
- dependency-cruiser CI'da `error` darajasida: modul chegaralari va `no-circular`. Bu qoidalar arxitektura qarorlari, ular bo'yicha kelishilgan.
- NestJS loyihasida `src/modules/*/` uchun "faqat `index.ts` orqali" qoidasi Nest modulining `exports` mexanizmini fayl darajasida to'ldiradi (83 va 94-darslar).
- Next.js'da `app/**` dagi client fayllar `lib/db` yoki `lib/dal` ni import qilmasligi qoidasi `server-only` ga qo'shimcha himoya (93-dars).

## Xulosa

- Metrika - qayerga qarash kerakligini ko'rsatadigan signal, kod sifatining ta'rifi emas. Maqsadga aylansa, u o'z qiymatini yo'qotadi.
- Cyclomatic complexity mustaqil yo'llar sonini o'lchaydi va test uchun foydali, lekin `switch` ni jazolaydi va nesting'ni ko'rmaydi.
- Cognitive complexity tushunish qiyinligini o'lchaydi: qisqartmalar va metod ajratish bepul, oqim uzilishi +1, nesting qo'shimcha jarima.
- Ikkala metrika ham nomlarni, funksiyalar orasidagi sakrashlarni va coupling'ni ko'rmaydi.
- Arxitektura chegaralari uchun dependency-cruiser kabi qoidaga asoslangan tekshiruv CI darvozasi uchun complexity chegarasidan yaxshiroq.
