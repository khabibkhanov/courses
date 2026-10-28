---
n: 34
slug: interfeys-kommentlari
title: "Interfeys kommentlari, TSDoc va comments-first dizayn"
summary: "Interfeys kommenti modulni ishlatish uchun kerak bo'lgan, lekin kodda ko'rinmaydigan shartnomani yozadi. Bu darsda Ousterhoutning interfeys va implementatsiya kommentlari farqini, kommentni koddan oldin yozish usulini va TypeScript'da TSDoc sintaksisini ko'ramiz."
duration: 35
sources:
  - id: aposd
    note: "Kommentlar haqidagi boblar: interfeys va implementatsiya kommentlari, modullararo kommentlar, \"Write The Comments First\" bobi va kommentning dizayn uchun indikator ekani"
  - id: ts-handbook
    note: "JSDoc Reference sahifasi va TypeScript tiplarining hujjat sifatidagi roli"
quiz:
  - q: "Ousterhout bo'yicha interfeys kommenti va implementatsiya kommentining asosiy farqi nima?"
    options:
      - "Interfeys kommenti uzunroq bo'ladi"
      - "Interfeys kommenti faqat public metodlarga yoziladi, implementatsiya kommenti esa private'larga"
      - "Interfeys kommenti modulni ishlatish uchun nima bilish kerakligini aytadi, implementatsiya kommenti esa ichida nima va nega qilinayotganini tushuntiradi"
      - "Farqi yo'q, ikkalasi ham bir xil"
    answer: 2
    explain: "Interfeys kommenti foydalanuvchi uchun: xatti-harakat, argumentlar, qaytariladigan qiymat, yon ta'sirlar, xatolar, cheklovlar. U implementatsiya detallarini aytmasligi kerak. Implementatsiya kommenti esa kodni o'zgartiradigan odam uchun."
  - q: "Funksiya uchun interfeys kommenti yozmoqchisiz, lekin u juda uzun va chalkash chiqyapti. Ousterhout buni qanday talqin qiladi?"
    options:
      - "Komment yozish mahoratingiz past"
      - "Bu interfeys juda murakkab ekanining belgisi: dizaynni soddalashtirish haqida o'ylash kerak"
      - "Kommentni bir nechta qisqa kommentga bo'lish kerak"
      - "Kommentsiz qoldirish kerak"
    answer: 1
    explain: "Ousterhout kommentni dizayn sifatining indikatori deb biladi. Agar oddiy va to'liq interfeys kommentini yozish qiyin bo'lsa, ko'pincha muammo kommentda emas, interfeysda: u juda ko'p narsani ochib beradi yoki aralash mas'uliyatga ega."
  - q: "TSDoc'da parametr hujjati qaysi ko'rinishda yoziladi?"
    options:
      - "`@param {string} vehicleId Mashina id'si`"
      - "`@arg vehicleId: Mashina id'si`"
      - "`@param vehicleId = Mashina id'si`"
      - "`@param vehicleId - Mashina id'si`"
    answer: 3
    explain: "TSDoc'da parametr nomidan keyin defis va tavsif keladi. Tip `{string}` ko'rinishida yozilmaydi, chunki TypeScript'da tip imzoning o'zida bor. `{type}` sintaksisi JS fayllaridagi JSDoc uchun."
  - q: "Quyidagi interfeys kommentida qaysi muammo bor?\n\n```ts\n/**\n * Redis'dagi `fuel:<vehicleId>` kalitini o'qiydi, topilmasa Postgres'dagi\n * fuel_readings jadvalidan oxirgi qatorni oladi.\n */\nexport function getCurrentFuelLevel(vehicleId: string): Promise<number>\n```"
    options:
      - "U implementatsiya detallarini (Redis kaliti, jadval nomi) ochib beradi, lekin chaqiruvchiga kerakli narsani (birlik, ma'lumot yo'q bo'lsa nima bo'ladi) aytmaydi"
      - "U juda qisqa"
      - "U ingliz tilida emas"
      - "Muammo yo'q, komment to'liq"
    answer: 0
    explain: "Interfeys kommenti abstraksiyani tasvirlashi kerak, implementatsiyani emas. Keshlash strategiyasi o'zgarsa, komment yolg'onga aylanadi. Chaqiruvchi esa birlik (litr? foiz?) va ma'lumot yo'q holatini bilishi kerak."
  - q: "Ousterhoutning \"kommentni birinchi yozing\" tavsiyasining asosiy foydasi nima?"
    options:
      - "Kod tezroq yoziladi, chunki komment shablon vazifasini bajaradi"
      - "Kommentlar keyinchalik o'chiriladi"
      - "Komment yozish dizayn vositasiga aylanadi: abstraksiyani so'z bilan aniq ifodalab bo'lmasa, implementatsiyadan oldin buni sezasiz"
      - "Code review talab qilinmaydi"
    answer: 2
    explain: "Ousterhout uchun kommentni oldin yozish - bu dizayn bosqichi. Abstraksiya nimaligini yozishga urinish uning yaxshi yoki yomonligini erta ko'rsatadi. Bundan tashqari, kod tugagandan keyin yoziladigan kommentlar ko'pincha umuman yozilmaydi yoki shoshilinch yoziladi."
  - q: "Qaysi TSDoc tegi IDE'da metodni ustidan chizilgan holda ko'rsatadi va eskirganini bildiradi?"
    options:
      - "`@remarks`"
      - "`@deprecated`"
      - "`@privateRemarks`"
      - "`@see`"
    answer: 1
    explain: "`@deprecated` tegini TypeScript language service taniydi va VS Code kabi muharrirlar bunday API'ni ustidan chizib ko'rsatadi. Tavsifda nima ishlatish kerakligini yozish kerak, masalan `{@link newMethod}` bilan."
task:
  title: "Billing modulining public interfeysini hujjatlash"
  prompt: |
    Quyidagi modul transport kompaniyasi mijozlariga oylik hisob (invoice) yaratadi. Boshqa jamoalar uni ishlatadi, lekin ichini o'qishga majbur bo'lyapti.

    1. Kodni o'qib, chaqiruvchi bilishi kerak bo'lgan shartnomani aniqlang: birliklar, chegaralar, idempotentlik, xatolar, yon ta'sirlar.
    2. Faqat eksport qilinadigan qismlarga TSDoc interfeys kommentlari yozing. Implementatsiya detallarini interfeys kommentiga qo'shmang.
    3. Ichida bitta joyda "nega" degan implementatsiya kommenti kerak bo'lsa, uni ham qo'shing.
    4. Agar kommentni yozish qiyin bo'lsa, interfeysni soddalashtirish mumkinmi, o'ylab ko'ring.
  lang: ts
  starter: |
    export type InvoiceLine = { vehicleId: string; days: number; ratePerDay: number };
    export type Invoice = { id: string; clientId: string; month: string; total: number; lines: InvoiceLine[] };

    interface InvoiceStore {
      findByClientAndMonth(clientId: string, month: string): Promise<Invoice | null>;
      insert(invoice: Invoice): Promise<void>;
    }

    export class InvoiceService {
      constructor(private readonly store: InvoiceStore) {}

      async createMonthly(clientId: string, month: string, lines: InvoiceLine[]): Promise<Invoice> {
        if (!/^\d{4}-\d{2}$/.test(month)) throw new Error("bad month");
        if (lines.length === 0) throw new Error("no lines");
        const existing = await this.store.findByClientAndMonth(clientId, month);
        if (existing) return existing;
        const total = lines.reduce((sum, l) => sum + l.days * l.ratePerDay, 0);
        const invoice: Invoice = { id: `${clientId}-${month}`, clientId, month, total, lines };
        await this.store.insert(invoice);
        return invoice;
      }
    }
  solution: |
    export type InvoiceLine = {
      vehicleId: string;
      /** Shu oyda mashina ijarada bo'lgan kunlar soni. */
      days: number;
      /** Kunlik tarif, tiyinda. */
      ratePerDay: number;
    };

    export type Invoice = {
      /** `${clientId}-${month}` ko'rinishida; mijoz va oy uchun yagona. */
      id: string;
      clientId: string;
      /** `YYYY-MM` formatida, masalan `2026-09`. */
      month: string;
      /** Barcha qatorlar summasi, tiyinda. QQS kiritilmagan. */
      total: number;
      lines: InvoiceLine[];
    };

    export class InvalidInvoiceRequestError extends Error {}

    interface InvoiceStore {
      findByClientAndMonth(clientId: string, month: string): Promise<Invoice | null>;
      insert(invoice: Invoice): Promise<void>;
    }

    const MONTH_FORMAT = /^\d{4}-\d{2}$/;

    export class InvoiceService {
      constructor(private readonly store: InvoiceStore) {}

      /**
       * Mijoz uchun oylik hisobni yaratadi yoki mavjudini qaytaradi.
       *
       * @remarks
       * Idempotent: bir mijoz va oy uchun hisob faqat bir marta yaratiladi. Takroriy
       * chaqiruv yangi qatorlarni e'tiborsiz qoldiradi va birinchi yaratilgan hisobni
       * qaytaradi. Hisobni o'zgartirish kerak bo'lsa, bu metod mos emas.
       *
       * @param clientId - mijoz identifikatori
       * @param month - hisob oyi, `YYYY-MM` formatida
       * @param lines - kamida bitta qator; summalar tiyinda
       * @returns saqlangan hisob
       * @throws {@link InvalidInvoiceRequestError} oy formati noto'g'ri yoki qatorlar bo'sh bo'lsa
       */
      async createMonthly(clientId: string, month: string, lines: InvoiceLine[]): Promise<Invoice> {
        if (!MONTH_FORMAT.test(month)) throw new InvalidInvoiceRequestError(`month: ${month}`);
        if (lines.length === 0) throw new InvalidInvoiceRequestError("lines are empty");

        const existing = await this.store.findByClientAndMonth(clientId, month);
        // Mavjud hisob qaytariladi, qayta hisoblanmaydi: mijozga yuborilgan hujjat
        // o'zgarmasligi kerak (buxgalteriya talabi).
        if (existing) return existing;

        const total = lines.reduce((sum, line) => sum + line.days * line.ratePerDay, 0);
        const invoice: Invoice = { id: `${clientId}-${month}`, clientId, month, total, lines };
        await this.store.insert(invoice);
        return invoice;
      }
    }
  solutionNotes: |
    - Eng muhim yashirin shartnoma - **idempotentlik** va undan kelib chiqadigan oqibat: takroriy chaqiruvda yangi qatorlar e'tiborsiz qoladi. Bu `@remarks`da aniq yozildi, chunki chaqiruvchi buni bilmasa, ma'lumot jimgina yo'qoladi.
    - **Birliklar** (tiyin, kun) va **format** (`YYYY-MM`) maydon kommentlariga yozildi. Ular IDE hover'ida har bir ishlatilgan joyda ko'rinadi.
    - Xatolar uchun alohida klass yaratildi va `@throws`da ko'rsatildi. Oddiy `Error("bad month")` bilan chaqiruvchi xatoni ajrata olmasdi.
    - Interfeys kommentida implementatsiya detallari yo'q: `store` qanday ishlashi, id qanday yaratilishi (id formati - bu chaqiruvchi tayanishi mumkin bo'lgan shartnoma, shuning uchun u tip kommentida).
    - Bitta implementatsiya kommenti "nega"ni aytadi: nega mavjud hisob qayta hisoblanmaydi.
    - Dizayn haqida savol: `createMonthly` aslida "yarat yoki ol" qiladi. Kommentni yozish bu ikki ma'noni ochiq ko'rsatdi. Muqobil - nomni `getOrCreateMonthly` qilish. Bu Ousterhoutning "komment dizayn indikatori" g'oyasining amaliy namunasi.
  checklist:
    - "Barcha eksport qilinadigan tip va metodlarda interfeys kommenti bor"
    - "Birliklar va formatlar hujjatlangan"
    - "Idempotentlik va takroriy chaqiruv oqibati aniq yozilgan"
    - "Xatolar @throws bilan va alohida xato klassi bilan ko'rsatilgan"
    - "Interfeys kommentlarida implementatsiya detallari (ombor, kesh, SQL) yo'q"
    - "TSDoc sintaksisi: @param nom - tavsif, tip {..} ichida takrorlanmagan"
---

## Muammo

NestJS loyihasida `FuelService.getConsumption(vehicleId, from, to)` metodi bor. Uni boshqa jamoa ishlatmoqchi. Savollar: `from` va `to` kiradimi yoki yo'qmi? Natija litrdami yoki litr/100 kmda? Salt (idle) rejim hisobga olinadimi? Ma'lumot bo'lmasa `0` qaytadimi, `null`mi yoki xato? Bu savollarning javobi uchun ular 150 qatorli implementatsiyani va undan chaqiriladigan uchta yordamchi funksiyani o'qishi kerak.

Bu holatda modul abstraksiya bermayapti. Abstraksiyaning ma'nosi - ichini bilmasdan ishlatish. Agar ishlatish uchun ichini o'qish kerak bo'lsa, ichi va tashqarisi o'rtasida farq qolmaydi.

TypeScript tiplari bu savollarning bir qismiga javob beradi: `from: Date`, `Promise<number | null>`. Lekin oraliq chegaralari, birliklar, idle haqidagi qaror, yon ta'sirlar tiplarda yo'q. Ousterhout aynan shu bo'shliqni interfeys kommenti bilan to'ldirishni taklif qiladi.

## Asosiy g'oya

*A Philosophy of Software Design*da Ousterhout kommentlarni bir necha turga ajratadi. Eng muhim ikkitasi:

- **Interfeys kommenti** - modul, klass yoki funksiya e'loni oldida turadi. U *foydalanuvchi* uchun: nima qiladi, argumentlar nimani bildiradi, nima qaytaradi, qanday yon ta'sirlar va xatolar bor, chaqirishdan oldin qanday shartlar bajarilishi kerak. U *qanday* qilinishini aytmaydi.
- **Implementatsiya kommenti** - funksiya ichida. U kodni *o'zgartiradigan* odam uchun: bu blok nima uchun bor, nega shunday yondashuv tanlangan.

Ousterhout uchinchi turni ham alohida ajratadi: **modullararo kommentlar**, ya'ni bir nechta modulga tegishli bog'liqlik (masalan, ikki joyda bir xil o'zgartirish qilish kerakligi). Ularni qayerga yozish qiyin, shuning uchun u markaziy joyda (masalan, alohida dizayn hujjatida) saqlab, kod ichidan unga havola berishni tavsiya qiladi.

Asosiy qoida: **interfeys kommenti implementatsiyani ochib bermasligi kerak**. Agar interfeys kommenti "Redis'dan o'qiydi, keyin Postgres'dan" desa, kesh strategiyasi o'zgarganda komment yolg'onga aylanadi, chaqiruvchi esa bu detalni bilishi shart emas edi. Bu information hiding (43-dars) tamoyilining hujjatdagi ifodasi.

### Comments-first: kommentni birinchi yozing

Ousterhout kitobida alohida bob bilan kommentni koddan oldin yozishni tavsiya qiladi. Uning tartibi taxminan shunday: avval klass uchun interfeys kommenti, keyin muhim public metodlarning imzosi va kommentlari (tanasi bo'sh), keyin dizaynni shu kommentlar asosida ko'rib chiqish, keyingina implementatsiya.

U buning uchta foydasini keltiradi:

1. **Kommentlar haqiqatan yoziladi.** Kod tugagandan keyin kommentga vaqt qolmaydi va motivatsiya yo'qoladi.
2. **Kommentlar yaxshiroq bo'ladi.** Dizayn haqida o'ylayotgan paytda yozilgan komment abstraksiyani tasvirlaydi. Kod yozilgandan keyin yozilgan komment kodni takrorlashga moyil.
3. **Komment dizayn vositasiga aylanadi.** Bu eng muhimi. Agar metod uchun oddiy va to'liq komment yozib bo'lmasa, bu interfeys murakkab ekanining signali. Ousterhout kommentni dizayn uchun "kanareyka" sifatida ko'radi: uzun, chalkash interfeys kommenti - sayoz yoki aralash modulning alomati.

## Chuqurroq: yaxshi interfeys kommenti nima yozadi

### Tekshiruv ro'yxati

Funksiya yoki metod uchun interfeys kommenti quyidagilarni qamrab olishi mumkin (hammasi har doim kerak emas, faqat ravshan bo'lmaganlari):

- **Xatti-harakat** - bir-ikki jumlada, abstraksiya darajasida.
- **Argumentlar** - birlik, format, chegara qiymatlari, `null`/`undefined` ruxsat etilganmi.
- **Qaytariladigan qiymat** - qachon bo'sh, qachon `null`, tartib kafolati bormi.
- **Yon ta'sirlar** - DB'ga yozadimi, event chiqaradimi, kesh'ni tozalaydimi.
- **Xatolar** - qaysi xato qachon.
- **Oldindan shartlar** - "faqat tranzaksiya ichida chaqiring", "kirish massivi saralangan bo'lishi kerak".
- **Idempotentlik va concurrency** - qayta chaqirish xavfsizmi, parallel chaqiruvda nima bo'ladi.

Klass uchun interfeys kommenti esa klass qanday abstraksiyani ifodalashini va uni qanday ishlatish kerakligini aytadi. Uning implementatsiyasidagi metodlar ro'yxatini takrorlamaydi.

### Tiplar va kommentlar: kim nimani aytadi

TypeScript'da interfeysning katta qismi tipda. Shuning uchun komment tip allaqachon aytgan narsani takrorlamasligi kerak:

```ts
/**
 * @param vehicleId - string    // yomon: tip takrorlandi
 * @param vehicleId - parkdagi mashina id'si; arxivlangan mashinalar ham qabul qilinadi  // yaxshi
 */
```

Qoida oddiy: tip *shaklni* aytadi, komment *ma'noni*. Agar ma'noni ham tipga o'tkazish mumkin bo'lsa (masalan, `"active" | "archived"`, branded `VehicleId` tipi), avval shuni qiling (40-dars, 44-dars).

### TSDoc sintaksisi

TypeScript ekotizimida doc comment uchun ikki an'ana bor: JS fayllarida tip ham beradigan **JSDoc** va TypeScript uchun standartlashtirish taklifi bo'lgan **TSDoc**. TSDoc'da tip yozilmaydi, chunki u imzoda bor. TypeScript Handbook'ning JSDoc Reference sahifasi JS fayllaridagi tip annotatsiyalari uchun mo'ljallangan. TS fayllarida esa `/** */` kommentlari IDE hover'ida ko'rsatiladi va TSDoc teglarini ishlatish odat.

Asosiy teglar:

- `@param name - tavsif` - parametr nomidan keyin defis.
- `@returns tavsif` - qaytariladigan qiymat.
- `@throws` - qaysi xato qachon tashlanadi.
- `@remarks` - asosiy tavsifdan keyingi batafsil qism. Hujjat generatorlari qisqa xulosani va remarks'ni alohida ko'rsatadi.
- `@example` - foydalanish namunasi.
- `@deprecated` - eskirgan API. TypeScript language service uni taniydi va muharrirlar chaqiruvni ustidan chizib ko'rsatadi.
- `@see` va `{@link Name}` - boshqa API'ga havola.
- `@defaultValue` - xususiyatning default qiymati.
- `@typeParam T - tavsif` - generik parametr.
- `@privateRemarks` - ichki izoh, ommaviy hujjatga chiqmaydi.

TSDoc'ni API Extractor va TypeDoc kabi vositalar ishlatadi, `eslint-plugin-tsdoc` esa sintaksis xatolarini topadi. Ilova kodida hujjat generatori bo'lmasa ham, TSDoc kommentlari IDE hover'ida ko'rinadi: bu ularning asosiy qiymati.

### Komment va imzo birga o'zgaradi

Interfeys kommenti imzoning bir qismi. Agar metodning xatti-harakati o'zgarsa (masalan, `null` o'rniga xato tashlay boshlasa), komment ham shu commit'da o'zgarishi kerak. Review'da buni tekshirish oson: diff'da imzo yoki xatti-harakat o'zgargan, komment o'zgarmagan bo'lsa, savol bering.

## Misol: yoqilg'i sarfi service'i

Avval kommentsiz, faqat tipli interfeys:

```ts
export interface FuelConsumptionQuery {
  vehicleId: string;
  from: Date;
  to: Date;
}

export interface FuelConsumptionService {
  getConsumption(query: FuelConsumptionQuery): Promise<number | null>;
}
```

Tiplar shaklni aytadi, lekin ma'noni emas. Endi comments-first usulida, implementatsiyadan oldin interfeys kommentini yozamiz:

```ts
export interface FuelConsumptionQuery {
  vehicleId: string;
  /** Oraliq boshlanishi, kiradi. */
  from: Date;
  /** Oraliq oxiri, kirmaydi. */
  to: Date;
}

/**
 * Mashinalarning yoqilg'i sarfini DUT (yoqilg'i darajasi datchigi) ma'lumotlari asosida hisoblaydi.
 */
export interface FuelConsumptionService {
  /**
   * Oraliqdagi yoqilg'i sarfini litrda qaytaradi.
   *
   * @remarks
   * Quyish (zapravka) hodisalari sarfdan chiqarib tashlanadi. Salt rejimdagi (idle)
   * sarf kiritiladi. Oraliq 31 kundan oshmasligi kerak.
   *
   * @returns sarf litrda; oraliqda birorta ham DUT o'lchovi bo'lmasa `null`
   * (bu "sarf 0" degani emas: datchik ulanmagan yoki oflayn bo'lishi mumkin)
   * @throws RangeError - `to` `from`dan oldin bo'lsa yoki oraliq 31 kundan uzun bo'lsa
   */
  getConsumption(query: FuelConsumptionQuery): Promise<number | null>;
}
```

Bu kommentni yozish jarayonida ikkita dizayn savoli paydo bo'ldi:

1. **`null` va `0` farqi.** Kommentni yozayotganda "ma'lumot yo'q" va "sarf nol" bir xil emasligi ko'rindi. Bu farq dashboard'da noto'g'ri "0 litr" ko'rsatilishining oldini oladi.
2. **31 kunlik cheklov.** Uni yozishga majbur bo'lganimizda savol tug'iladi: bu cheklov chaqiruvchiga kerakmi yoki implementatsiya qulayligi uchunmi? Agar ikkinchisi bo'lsa, ehtimol uni ichkarida bo'lib-bo'lib hisoblash va interfeysni soddaroq qilish kerak. Ousterhout bunga "murakkablikni pastga tushirish" deydi.

E'tibor bering, kommentda nima yo'q: qaysi jadvaldan o'qilishi, Redis keshi, quyish hodisasini aniqlash algoritmi. Bular implementatsiya, ular o'zgarishi mumkin va chaqiruvchiga kerak emas.

## Qachon qo'llamaslik kerak

- **Private yordamchi funksiyalar.** Faqat bitta joydan chaqiriladigan, nomi va tipi ravshan bo'lgan private funksiyaga to'liq TSDoc yozish shovqin (33-dars). Martin ham jamoa ichidagi ko'p interfeyslar uchun komment shart emas deb hisoblaydi. Ousterhout bu bilan kelishmaydi, shuning uchun bu yerda jamoa qarori kerak: kamida modul chegarasidan tashqariga eksport qilinadigan narsalar hujjatlansin.
- **Tip hamma narsani aytsa.** `isActive(vehicle: Vehicle): boolean` uchun "mashina faolmi yoki yo'qligini qaytaradi" kommenti hech narsa qo'shmaydi. Agar "faol"ning ma'nosi ravshan bo'lmasa (oxirgi 24 soatda signal bergan? ijara shartnomasi bor?), faqat shuni yozing.
- **Comments-first kichik o'zgarishlarda.** Bitta parametr qo'shish yoki bug tuzatishda butun dizayn jarayoni ortiqcha. Usul yangi modul yoki yangi public API dizaynida eng ko'p foyda beradi.
- **Eksperimental kod.** Interfeys hali tez o'zgarayotgan bo'lsa, batafsil komment har kuni qayta yoziladi. Bu holatda qisqa bir jumlali tavsif, dizayn barqarorlashganda to'liq shartnoma.
- **Har bir parametr uchun majburiy `@param`.** Agar uchta parametrdan faqat bittasi tushuntirishga muhtoj bo'lsa, faqat uni yozing. Linter bilan barcha `@param`larni majburiy qilish ko'pincha `@param id - id` kabi shovqin beradi.

## Stack'da: NestJS, Next.js, monorepo

- **NestJS service'larining public metodlari.** Modul `exports`ga chiqaradigan provider - bu modul interfeysi. Uning public metodlariga interfeys kommenti yozing: tranzaksiya chegarasi, qaysi `HttpException` yoki domen xatosi tashlanadi, idempotentlik. Modul ichidagi provider'lar uchun talab yengilroq bo'lishi mumkin.
- **DTO maydonlari va Swagger.** `@nestjs/swagger` CLI plagini `introspectComments` opsiyasi bilan DTO maydonlarining kommentlarini OpenAPI tavsifiga aylantira oladi. Shunda bitta komment ham IDE'da, ham API hujjatida ko'rinadi. Bu opsiyani loyihangizdagi versiya hujjatidan tekshiring.
- **Next.js umumiy komponentlari.** `components/ui` ichidagi qayta ishlatiladigan komponentlarning props tipida har bir noaniq prop uchun qisqa komment yozing (`/** Bo'sh bo'lsa skeleton ko'rsatiladi. */`). Bu kommentlar JSX ichida prop ustiga sichqoncha olib borganda ko'rinadi.
- **Monorepo paketlari.** Ichki `packages/geo-utils` kabi paketlarning `index.ts`dan eksport qilinadigan har bir funksiyasi to'liq TSDoc'ga ega bo'lsin. Bu yerda `eslint-plugin-tsdoc` sintaksisni tekshiradi, TypeDoc esa ichki hujjat sahifasini yaratishi mumkin.
- **`@deprecated` bilan migratsiya.** API'ni almashtirayotganda eski metodga `@deprecated {@link newMethod} dan foydalaning` qo'shing. typescript-eslint'ning `no-deprecated` qoidasi (typed linting bilan) bunday chaqiruvlarni topadi (37-dars).

## Xulosa

- Interfeys kommenti foydalanuvchi uchun: xatti-harakat, birliklar, chegaralar, yon ta'sirlar, xatolar. U implementatsiyani ochib bermaydi.
- Implementatsiya kommenti kodni o'zgartiradigan odam uchun: nima va nega.
- Tip shaklni aytadi, komment ma'noni. Ma'noni tipga o'tkazish mumkin bo'lsa, avval shuni qiling.
- Ousterhout kommentni koddan oldin yozishni tavsiya qiladi: shunda u yoziladi, yaxshiroq bo'ladi va dizayn muammolarini erta ko'rsatadi.
- TSDoc'da tip takrorlanmaydi: `@param nom - tavsif`, `@returns`, `@throws`, `@remarks`, `@deprecated`.
- Qancha batafsil hujjatlash kerakligi modul chegarasiga bog'liq: eksport qilinadigan API to'liq, private yordamchilar minimal.
