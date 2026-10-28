---
n: 72
slug: smells-1
title: "Code smells 1: nom, takror, uzun funksiya, uzun parametrlar"
summary: "Code smell - bu chuqurroq muammoga ishora qiluvchi, tez ko'rinadigan belgi. Fowler katalogining birinchi to'rtta smell'ini ko'ramiz: Mysterious Name, Duplicated Code, Long Function va Long Parameter List, har biri uchun tavsiya qilingan refaktoringlar bilan."
duration: 35
sources:
  - id: refactoring
    note: "3-bob \"Bad Smells in Code\" (Fowler va Beck): Mysterious Name, Duplicated Code, Long Function, Long Parameter List"
  - id: fowler-code-smell
    note: "Code smell ta'rifi, smell har doim muammo emasligi, \"smell of the week\" amaliyoti"
quiz:
  - q: "Fowler bo'yicha code smell nima?"
    options:
      - "Linter topadigan har qanday ogohlantirish"
      - "Tezda ko'zga tashlanadigan, odatda chuqurroq muammoga mos keladigan sirtqi belgi"
      - "Har doim darhol tuzatilishi kerak bo'lgan xato"
      - "Performance muammosi"
    answer: 1
    explain: "Smell - belgi, tashxis emas. Fowler ta'kidlaydiki, smell'ni ko'rish oson, lekin u har doim muammo degani emas: uzun funksiyaning ba'zilari mutlaqo normal. Shuning uchun smell chuqurroq qarash uchun signal."
  - q: "Fowler va Beck Long Function smell'ida asosiy mezon nima deb aytadi?"
    options:
      - "Funksiya 20 qatordan oshmasligi"
      - "Funksiyada bitta return bo'lishi"
      - "Funksiya nima qilishi va qanday qilishi o'rtasidagi semantik masofa"
      - "Funksiyadagi o'zgaruvchilar soni"
    answer: 2
    explain: "Kitobda kalit qatorlar soni emas, \"nima\" va \"qanday\" orasidagi masofa ekanligi aytiladi. Agar kod blokini tushunish uchun komment kerak bo'lsa, u blokni niyatni aytuvchi nom bilan funksiyaga chiqarish signali."
  - q: "Ikki funksiyada o'xshash, lekin bir xil bo'lmagan kod bor: qadamlar tartibi farq qiladi. Takrorni olib tashlash uchun birinchi qadam qaysi?"
    options:
      - "Slide Statements bilan o'xshash qismlarni yonma-yon qo'yish, keyin Extract Function"
      - "Ikkalasini bitta funksiyaga birlashtirib, boolean flag qo'shish"
      - "Pull Up Method"
      - "Hech narsa qilmaslik, chunki kod bir xil emas"
    answer: 0
    explain: "Kitob o'xshash, lekin bir xil bo'lmagan kod uchun avval Slide Statements bilan o'xshash qatorlarni birga to'plashni, keyin ularni chiqarishni tavsiya qiladi. Flag qo'shish yangi smell (flag argument) yaratadi. Pull Up Method faqat umumiy superklass bo'lganda."
  - q: "`createInvoice(customerId, customerName, customerTin, customerAddress, items, currency)` signaturasida mijoz maydonlari doim birga keladi va chaqiruvchida `customer` obyekti allaqachon bor. Qaysi refaktoring eng to'g'ri?"
    options:
      - "Remove Flag Argument"
      - "Replace Function with Command"
      - "Combine Functions into Class"
      - "Preserve Whole Object"
    answer: 3
    explain: "Chaqiruvchida butun obyekt bor va undan maydonlar ajratib uzatilyapti. Preserve Whole Object - aynan shu holat uchun. Agar obyekt bo'lmaganida, Introduce Parameter Object mos kelardi."
  - q: "Funksiyaga yaxshi nom topa olmayapsiz. Kitob bo'yicha bu nimani bildirishi mumkin?"
    options:
      - "Nom uzunroq bo'lishi kerak"
      - "Dizaynda chuqurroq muammo bor: funksiya bir nechta ishni qilayotgan yoki noaniq chegaraga ega bo'lishi mumkin"
      - "Funksiyaga komment yozish kerak"
      - "Hech narsa, nomlash shunchaki qiyin"
    answer: 1
    explain: "Mualliflar yaxshi nom topishdagi qiyinchilik ko'pincha chuqurroq dizayn muammosining belgisi ekanini aytadi va nom ustida ishlash ko'pincha kodni soddalashtirganini qayd etadi."
  - q: "Qaysi holatda Duplicated Code smell'ini olib tashlash zararli bo'lishi mumkin?"
    options:
      - "Ikki nusxa bir xil biznes qoidasini ifodalaydi"
      - "Takror bitta faylda"
      - "Ikki kod tasodifan bir xil ko'rinadi, lekin turli sabablarga ko'ra va turli vaqtda o'zgaradi"
      - "Takror testlarda"
    answer: 2
    explain: "Tasodifiy o'xshashlik bilim takrori emas. Ularni birlashtirish keyinchalik flag va shartlar bilan to'la noto'g'ri abstraksiyaga olib keladi (8-dars, Sandi Metz)."
task:
  title: "To'rtta smell'ni topish va tuzatish"
  prompt: |
    Quyidagi NestJS servis metodi ijara shartnomasi uchun to'lov jadvalini tuzadi. Unda bu darsdagi to'rtta smell bor.

    1. Har bir smell'ni nomi bilan belgilang (Mysterious Name, Duplicated Code, Long Function, Long Parameter List) va qayerda ekanini ko'rsating.
    2. Fowler katalogidagi refaktoringlar bilan tuzating. Har bir qadam nomini yozing.
    3. Xatti-harakat o'zgarmasligi kerak: oylik summa, yaxlitlash va sanalar bir xil qolsin.
  lang: ts
  starter: |
    type Row = { d: Date; a: number; t: string };

    export function gen(
      start: Date,
      months: number,
      price: number,
      deposit: number,
      discountPct: number,
      vat: boolean,
    ): Row[] {
      const res: Row[] = [];
      // depozitni hisoblash
      let dep = deposit - (deposit * discountPct) / 100;
      if (vat) dep = dep * 1.12;
      dep = Math.round(dep / 100) * 100;
      res.push({ d: new Date(start), a: dep, t: "deposit" });
      for (let i = 0; i < months; i++) {
        const d = new Date(start);
        d.setMonth(d.getMonth() + i);
        // oylik to'lovni hisoblash
        let m = price - (price * discountPct) / 100;
        if (vat) m = m * 1.12;
        m = Math.round(m / 100) * 100;
        res.push({ d, a: m, t: "monthly" });
      }
      return res;
    }
  solution: |
    type PaymentKind = "deposit" | "monthly";

    type ScheduledPayment = {
      dueDate: Date;
      amount: number;
      kind: PaymentKind;
    };

    type LeaseTerms = {
      startDate: Date;
      durationMonths: number;
      monthlyPrice: number;
      deposit: number;
      discountPercent: number;
      includesVat: boolean;
    };

    const VAT_RATE = 0.12;
    const ROUNDING_STEP = 100;

    export function buildPaymentSchedule(terms: LeaseTerms): ScheduledPayment[] {
      return [depositPayment(terms), ...monthlyPayments(terms)];
    }

    function depositPayment(terms: LeaseTerms): ScheduledPayment {
      return {
        dueDate: new Date(terms.startDate),
        amount: finalAmount(terms.deposit, terms),
        kind: "deposit",
      };
    }

    function monthlyPayments(terms: LeaseTerms): ScheduledPayment[] {
      return Array.from({ length: terms.durationMonths }, (_, monthIndex) => ({
        dueDate: addMonths(terms.startDate, monthIndex),
        amount: finalAmount(terms.monthlyPrice, terms),
        kind: "monthly",
      }));
    }

    function finalAmount(base: number, terms: LeaseTerms): number {
      const discounted = base - (base * terms.discountPercent) / 100;
      const withVat = terms.includesVat ? discounted * (1 + VAT_RATE) : discounted;
      return Math.round(withVat / ROUNDING_STEP) * ROUNDING_STEP;
    }

    function addMonths(date: Date, months: number): Date {
      const result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
    }
  solutionNotes: |
    - **Mysterious Name**: `gen`, `Row`, `d`, `a`, `t`, `dep`, `m`. Change Function Declaration (`gen` -> `buildPaymentSchedule`), Rename Field va Rename Variable bilan tuzatildi. `t: string` o'rniga `PaymentKind` union.
    - **Duplicated Code**: chegirma, QQS va yaxlitlash ikki joyda takrorlangan edi. Extract Function bilan `finalAmount` ga chiqarildi. Bu bitta biznes qoidasi, demak takrorni olib tashlash xavfsiz.
    - **Long Function**: kommentlar ("depozitni hisoblash", "oylik to'lovni hisoblash") bloklarni chiqarish signali edi. Har bir komment funksiya nomiga aylandi va kommentlar keraksiz bo'ldi.
    - **Long Parameter List**: oltita parametr doim birga keladi. Introduce Parameter Object bilan `LeaseTerms` yaratildi. Endi boolean `vat` pozitsion argument emas, nomlangan maydon.
    - `setMonth` ning oy oxiridagi xatti-harakati (31-yanvar + 1 oy) o'zgartirilmadi: bu refaktoring, xato tuzatish emas. Uni alohida, test bilan hal qilish kerak.
  checklist:
    - "To'rtta smell nomi bilan topildi va joyi ko'rsatildi"
    - "Har bir o'zgarish katalogdagi refaktoring nomi bilan bog'landi"
    - "Chegirma, QQS va yaxlitlash qoidasi bitta joyda"
    - "Parametrlar bitta nomlangan obyektga birlashdi"
    - "Eski va yangi funksiya bir xil kirish uchun bir xil natija beradi"
---

## Muammo

Kod review'da eng ko'p eshitiladigan izohlardan biri: "bu yerda nimadir noto'g'ri, lekin aniq aytolmayman". Tajribali dasturchi muammoni sezadi, lekin uni nomlay olmaydi. Natijada izoh subyektiv bo'lib qoladi ("menga yoqmadi"), muallif esa haqli ravishda "ishlayapti-ku" deb javob beradi va bahs did masalasiga aylanadi.

Ikkinchi muammo - qayerdan boshlash. 71-darsda refaktoring nima ekanini ko'rdik. Lekin 800 qatorli servisni ochganingizda, qaysi joyni va qaysi usul bilan refaktoring qilish kerakligi aniq emas. Kerak bo'lgan narsa - umumiy lug'at: "bu Long Parameter List, Introduce Parameter Object qo'llaymiz" deyish, "bu funksiya menga yoqmadi" deyishdan ancha samarali.

## Asosiy g'oya

*Refactoring* kitobining 3-bobi ("Bad Smells in Code") Fowler va Kent Beck tomonidan birga yozilgan. "Smell" atamasini Beck o'ylab topgan. Fowler o'z blogida ta'riflaydi: code smell - bu odatda tizimdagi chuqurroq muammoga mos keladigan sirtqi belgi.

Bu ta'rifdan uchta muhim xulosa chiqadi:

1. **Smell tez ko'rinadi.** Fowler smell'larni "hidlanadigan" deb ataydi: ularni topish uchun kodni chuqur tushunish shart emas. Shuning uchun tajribasiz dasturchi ham smell'ni ko'ra oladi, hatto uni qanday tuzatishni bilmasa ham.
2. **Smell muammo emas, belgi.** Uzun funksiya ba'zan mutlaqo normal. Smell sizga qayerga diqqat bilan qarash kerakligini aytadi, nima qilish kerakligini emas.
3. **Aniq metrika yo'q.** Mualliflar ataylab "funksiya N qatordan oshmasin" degan chegaralarni bermaydi. Ularning fikricha, hech qanday metrika to'plami tajribali odamning mulohazasidan yaxshi emas.

Kitobdagi har bir smell tavsifidan keyin tavsiya qilinadigan refaktoringlar ro'yxati keladi. Bu kitobning eng amaliy qismi: smell'ni tanidingiz, demak qaysi vositalar bilan ishlash kerakligini bilasiz.

2-nashrda 24 ta smell bor. Ularni to'rtta darsda ko'rib chiqamiz. Bu darsda birinchi to'rttasi: **Mysterious Name**, **Duplicated Code**, **Long Function** va **Long Parameter List**.

Fowler blogida jamoa uchun foydali amaliyotni tasvirlaydi: "smell of the week". Jamoa yetakchisi har hafta bitta smell'ni tanlaydi, jamoa uni kodda qidiradi va topilganlarini katta dasturchilar bilan muhokama qiladi. Bu usul refaktoring ko'nikmasini sekin, lekin ishonchli o'stiradi.

## Chuqurroq: to'rtta smell

### Mysterious Name

Kitob bu smell'ni birinchi o'ringa qo'yadi va bu tasodif emas. Kodning tushunarli bo'lishi uchun eng muhim narsa - nimalar nima deb atalgani. Funksiya, modul, o'zgaruvchi va klass nomlari nima qilishini va qanday ishlatilishini aytishi kerak.

Tavsiya qilinadigan refaktoringlar:

- **Change Function Declaration** - funksiya nomini o'zgartirish (katalogda Rename Function shu refaktoringning bir ko'rinishi).
- **Rename Variable**.
- **Rename Field**.

Mualliflar muhim kuzatuvni qo'shadi: agar biror narsaga yaxshi nom topa olmasangiz, bu ko'pincha chuqurroq dizayn muammosining belgisi. Funksiya ikki ishni qilyapti, yoki klass chegarasi noaniq. Ularning tajribasida qiyin nom ustida ishlash ko'pincha kodni soddalashtirishga olib kelgan. Nomlash haqida 2-modulda (11-20-darslar) batafsil gaplashdik, bu yerda faqat bitta qo'shimcha: nomni o'zgartirish refaktoring sifatida xavfsiz bo'lishi uchun IDE'ning Rename Symbol funksiyasidan foydalaning, qo'lda qidirib-almashtirmang.

### Duplicated Code

Bir xil kod tuzilishi bir nechta joyda uchrasa, uni bitta qilish deyarli har doim foyda beradi. Sabab ikkita: o'quvchi nusxalarni solishtirib, farqni qidirishga majbur bo'ladi, o'zgarish kiritayotganda esa har bir nusxani topib, har birini o'zgartirish kerak.

Tavsiya qilinadigan refaktoringlar holatga qarab farq qiladi:

- Bir xil ifoda bitta klassning ikki metodida bo'lsa - **Extract Function**.
- Kod o'xshash, lekin aynan bir xil emas - avval **Slide Statements** bilan o'xshash qismlarni yonma-yon qo'yish, keyin ularni chiqarish.
- Takror umumiy ota-klassning subklasslarida bo'lsa - **Pull Up Method**.

Bu yerda 8-darsdagi ogohlantirishni eslash muhim. Duplicated Code smell'i kod matnining o'xshashligi haqida, lekin uni tuzatish qarori bilim haqida bo'lishi kerak. Ikki bo'lak kod bugun bir xil ko'rinsa ham, turli biznes qoidalarini ifodalasa, ularni birlashtirish noto'g'ri abstraksiya yaratadi. Fowler ham 71-darsdagi Rule of Three'ni shu sababli tavsiya qiladi.

### Long Function

Fowler va Beckning tajribasida eng uzoq va eng yaxshi yashaydigan dasturlar qisqa funksiyalardan iborat. Bunday kodni birinchi marta ko'rgan odam "hech qanday hisob bo'lmayapti, hammasi delegatsiya" degan taassurotga ega bo'ladi. Lekin aynan shu kichik funksiyalar tushuntirish, ulashish va tanlash imkonini beradi.

Kitobdagi eng muhim fikr: kalit funksiyaning uzunligi emas, u **nima qilishi va qanday qilishi o'rtasidagi semantik masofa**. Amaliy evristika: agar kod blokini tushuntirish uchun komment yozish kerak bo'lsa, bu blokni funksiyaga chiqarish va kommentdagi niyatni nomga aylantirish kerak. Hatto bitta qator bo'lsa ham, agar u tushuntirishga muhtoj bo'lsa.

Tavsiya qilinadigan refaktoringlar:

- **Extract Function** - holatlarning ko'pchiligida yetarli.
- **Replace Temp with Query** - vaqtinchalik o'zgaruvchilar chiqarishga xalaqit bersa.
- **Introduce Parameter Object** va **Preserve Whole Object** - chiqarilgan funksiyaga juda ko'p parametr uzatish kerak bo'lsa.
- **Replace Function with Command** - yuqoridagilar yordam bermasa, oxirgi chora.
- **Decompose Conditional** - funksiya shartli mantiqdan iborat bo'lsa (77-dars).
- **Replace Conditional with Polymorphism** - bir xil shart bo'yicha bir nechta switch bo'lsa.
- **Split Loop** - sikl ikki xil ishni qilyapti va unga nom topish qiyin bo'lsa.

Ousterhout bilan bahsni (21-dars) ham shu yerda eslash kerak. Ousterhout haddan tashqari maydalangan funksiyalar "sayoz" bo'lishini va o'quvchini ko'p joyga sakrashga majbur qilishini ta'kidlaydi. Fowler va Beck esa yaxshi nomlangan kichik funksiyalarda o'quvchi ichiga kirmasligi kerakligini aytadi. Ikkala qarash bitta nuqtada kelishadi: nom niyatni to'liq aytsa, kichik funksiya yordam beradi, aytmasa, zarar qiladi.

### Long Parameter List

Global ma'lumotdan qochish uchun hamma narsani parametr sifatida uzatish to'g'ri yo'nalish. Lekin uzun parametrlar ro'yxatining o'zi chalkashlik manbai: pozitsion argumentlar aralashib ketadi, boolean'lar chaqiruv joyida hech narsa demaydi.

Tavsiya qilinadigan refaktoringlar:

- **Replace Parameter with Query** - bir parametrni boshqasidan olish mumkin bo'lsa, uni olib tashlang.
- **Preserve Whole Object** - chaqiruvchi obyektdan maydonlarni ajratib uzatsa, obyektning o'zini uzating.
- **Introduce Parameter Object** - bir guruh parametrlar doim birga yursa.
- **Remove Flag Argument** - parametr funksiya xatti-harakatini tanlash uchun ishlatilsa, uni alohida funksiyalarga bo'ling.
- **Combine Functions into Class** - bir nechta funksiya bir xil parametr qiymatlarini olsa, ularni klassga birlashtirib, umumiy qiymatlarni maydon qiling.

## Misol: hisobot servisi

Transport parki uchun yoqilg'i hisoboti. Quyidagi kodda to'rtta smell ham bor:

```ts
export function rep(
  vid: string,
  from: Date,
  to: Date,
  tz: string,
  withRefuels: boolean,
  withDrains: boolean,
  threshold: number,
  events: { vid: string; at: Date; liters: number }[],
): string {
  let out = "";
  // to'ldirishlar
  if (withRefuels) {
    const r = events.filter((e) => e.vid === vid && e.at >= from && e.at <= to && e.liters > threshold);
    out += "Refuels: " + r.length + ", " + r.reduce((s, e) => s + e.liters, 0).toFixed(1) + " L\n";
  }
  // sliv'lar
  if (withDrains) {
    const d = events.filter((e) => e.vid === vid && e.at >= from && e.at <= to && e.liters < -threshold);
    out += "Drains: " + d.length + ", " + d.reduce((s, e) => s + e.liters, 0).toFixed(1) + " L\n";
  }
  return out;
}
```

Smell'lar: `rep`, `vid`, `r`, `d` (Mysterious Name); filtr va yig'indi ikki marta (Duplicated Code); kommentlar bloklarni ajratib turibdi (Long Function belgisi); sakkizta parametr, ulardan ikkitasi boolean flag (Long Parameter List). `tz` umuman ishlatilmaydi.

Refaktoringdan keyin:

```ts run
type FuelEvent = { vehicleId: string; at: Date; liters: number };
type Period = { from: Date; to: Date };

type FuelReportQuery = {
  vehicleId: string;
  period: Period;
  minLitersChange: number;
};

function isWithin(period: Period, date: Date): boolean {
  return date >= period.from && date <= period.to;
}

function eventsFor(query: FuelReportQuery, events: FuelEvent[]): FuelEvent[] {
  return events.filter((e) => e.vehicleId === query.vehicleId && isWithin(query.period, e.at));
}

function summaryLine(label: string, events: FuelEvent[]): string {
  const totalLiters = events.reduce((sum, e) => sum + e.liters, 0);
  return `${label}: ${events.length}, ${totalLiters.toFixed(1)} L\n`;
}

export function refuelSummary(query: FuelReportQuery, events: FuelEvent[]): string {
  const refuels = eventsFor(query, events).filter((e) => e.liters > query.minLitersChange);
  return summaryLine("Refuels", refuels);
}

export function drainSummary(query: FuelReportQuery, events: FuelEvent[]): string {
  const drains = eventsFor(query, events).filter((e) => e.liters < -query.minLitersChange);
  return summaryLine("Drains", drains);
}

// Sinab ko'ring: davr, mashina yoki minLitersChange'ni o'zgartiring.
const events: FuelEvent[] = [
  { vehicleId: "01A123BC", at: new Date("2026-10-01T08:00:00Z"), liters: 45 },
  { vehicleId: "01A123BC", at: new Date("2026-10-03T22:10:00Z"), liters: -18.5 },
  { vehicleId: "01A123BC", at: new Date("2026-10-05T09:30:00Z"), liters: 2 },
  { vehicleId: "10B777AA", at: new Date("2026-10-02T12:00:00Z"), liters: 60 },
];
const period = { from: new Date("2026-10-01T00:00:00Z"), to: new Date("2026-10-31T23:59:59Z") };
const query: FuelReportQuery = { vehicleId: "01A123BC", period, minLitersChange: 5 };
console.log(refuelSummary(query, events) + drainSummary(query, events));
```

Qadamlar va ularning nomlari:

1. **Rename Variable / Change Function Declaration**: `vid` -> `vehicleId`, `threshold` -> `minLitersChange`. Bu birinchi qadam, chunki keyingi qadamlarni o'qish osonlashadi.
2. **Change Function Declaration**: ishlatilmagan `tz` parametri olib tashlandi. Avval barcha chaqiruvlarda u haqiqatan ishlatilmasligini tekshirish kerak.
3. **Introduce Parameter Object**: `vehicleId`, `from`, `to`, `threshold` doim birga keladi. `Period` alohida tip, chunki "davr" o'zi domen tushunchasi va boshqa hisobotlarda ham kerak.
4. **Extract Function**: takrorlangan filtr va qator formatlash `eventsFor` va `summaryLine` ga chiqdi.
5. **Remove Flag Argument**: `withRefuels` va `withDrains` o'rniga ikkita aniq funksiya. Chaqiruvchi `rep(..., true, false, ...)` o'rniga `refuelSummary(query, events)` yozadi va kod o'z-o'zini tushuntiradi.

Har bir qadamdan keyin testlar ishga tushiriladi. Remove Flag Argument'da chaqiruvchilar ham o'zgaradi: avval eski `rep` ni yangi funksiyalar orqali yozib qo'yish, keyin chaqiruvlarni birma-bir o'tkazish, oxirida `rep` ni o'chirish xavfsizroq.

## Qachon qo'llamaslik kerak

- **Smell'ni qoida sifatida ishlatish.** "Long Function" ni "har bir funksiya 10 qatordan qisqa" degan linter qoidasiga aylantirish mualliflarning o'zi rad etgan yondashuv. Ketma-ket, chiziqli algoritm (masalan, 40 qatorli migratsiya skripti yoki parser'ning bitta holati) bo'laklarga bo'linganda o'qish qiyinlashishi mumkin.
- **Tasodifiy takror.** Ikki NestJS controller'dagi bir xil ko'rinadigan validatsiya turli biznes qoidalarini ifodalasa, ularni birlashtirmang. Keyin ulardan biri o'zgarganda umumiy funksiyaga flag qo'shishga majbur bo'lasiz.
- **Test kodi.** Testlardagi takror ko'pincha foydali: har bir test o'zi o'qiladigan bo'lsin (62-dars). Testlarda DRY'ni haddan oshirish testni tushunishni qiyinlashtiradi.
- **Parameter object ortiqcha bo'lganda.** Ikki-uch parametrli, barqaror funksiyaga obyekt kiritish faqat qo'shimcha tip va chaqiruvda qo'shimcha shovqin beradi.
- **Public API.** Funksiya nomini o'zgartirish tashqi mijozlarni buzadi. Bunday holatda eski nomni deprecated qilib qoldirish (parallel change, 80-dars) kerak.

## Stack'da: NestJS va React

- **NestJS servislari.** Controller metodlari ko'pincha Long Parameter List'ga aylanadi: `@Query('from') from, @Query('to') to, @Query('vehicleId') vehicleId...`. DTO klassi (`class FuelReportQueryDto`) bilan `@Query() query: FuelReportQueryDto` - bu Introduce Parameter Object'ning framework darajasidagi ko'rinishi, va u validatsiyani ham bitta joyga yig'adi.
- **React props.** 12 ta props olgan komponent Long Parameter List'ning React ko'rinishi. Ko'pincha tuzatish props'ni obyektga yig'ish emas, komponentni bo'lish yoki `children` orqali kompozitsiya.
- **Boolean props.** `<Report showRefuels showDrains compact />` - flag argument'lar. Ko'pincha ikkita alohida komponent yoki `variant: "refuels" | "drains"` union aniqroq.
- **TypeScript'da Rename.** `F2` (Rename Symbol) barcha import va ishlatilishlarni yangilaydi, lekin NestJS'dagi string token'larni (`@Inject('FUEL_REPO')`) va Prisma model nomlarini yangilamaydi. Ularni alohida tekshiring.

## Xulosa

- Code smell - tez ko'rinadigan, chuqurroq muammoga ishora qiluvchi belgi. U tashxis emas, qarash uchun signal.
- Mysterious Name birinchi smell: yaxshi nom topa olmaslik ko'pincha dizayn muammosini ko'rsatadi.
- Duplicated Code'ni Extract Function, Slide Statements va Pull Up Method bilan tuzating, lekin faqat bir xil bilim takrorlanganda.
- Long Function'da mezon qatorlar soni emas, "nima" va "qanday" orasidagi masofa. Komment kerak bo'lgan blok - chiqarish nomzodi.
- Long Parameter List uchun Introduce Parameter Object, Preserve Whole Object, Replace Parameter with Query va Remove Flag Argument.
