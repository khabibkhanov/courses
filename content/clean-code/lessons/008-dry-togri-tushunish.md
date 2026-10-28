---
n: 8
slug: dry-togri-tushunish
title: "DRY to'g'ri tushunilishi va noto'g'ri abstraksiya"
summary: "DRY eng mashhur va eng ko'p noto'g'ri tushuniladigan tamoyil. Thomas va Hunt uchun u kod emas, bilim takrori haqida. Bu darsda DRY'ning asl ma'nosini, Sandi Metz'ning noto'g'ri abstraksiya haqidagi ogohlantirishini, Kent C. Dodds'ning AHA yondashuvini va Dan Abramov hikoyasini ko'ramiz."
duration: 35
sources:
  - id: pragprog
    note: "The Evils of Duplication (DRY) mavzusi: bilim takrori va kod takrori farqi, 20 yillik nashrdagi aniqlashtirishlar, Orthogonality mavzusi"
  - id: metz-wrong-abstraction
    note: "Noto'g'ri abstraksiyaning evolyutsiyasi, sunk cost, inline orqali orqaga qaytish retsepti"
  - id: dodds-aha
    note: "AHA (Avoid Hasty Abstractions), DRY va WET bilan solishtirish, \"optimize for change first\""
  - id: abramov-goodbye-clean
    note: "Shakllar muharriridagi resize handle'lar hikoyasi va undan chiqarilgan xulosalar"
quiz:
  - q: "Thomas va Hunt bo'yicha DRY aslida nimani taqiqlaydi?"
    options:
      - "Har qanday ikki bir xil qator kodni"
      - "Bir xil bilimning (biznes qoidasi, algoritm, shartnoma) tizimda bir nechta mustaqil ifodasini"
      - "Copy-paste'ni IDE'da"
      - "Bir xil nomli o'zgaruvchilarni turli fayllarda"
    answer: 1
    explain: "DRY bilim haqida: har bir bilim tizimda bitta aniq, ishonchli ifodaga ega bo'lishi kerak. Bir xil ko'rinadigan ikki kod parchasi turli bilimni ifodalashi mumkin va u holda DRY buzilmagan."
  - q: "Ikki xil endpoint'da telefon raqamini validatsiya qiluvchi bir xil regex bor. Biri mijozlar uchun, ikkinchisi haydovchilar uchun. Ikkalasi ham \"O'zbekiston raqami\" qoidasini ifodalaydi. Bu DRY buzilishimi?"
    options:
      - "Yo'q, chunki ular turli endpoint'larda"
      - "Yo'q, regex qisqa bo'lsa takror zararsiz"
      - "Ha: bu bir xil bilim (O'zbekiston raqamining formati), u o'zgarsa ikkala joyni yangilash kerak, shuning uchun bitta joyda bo'lishi kerak"
      - "Faqat test yozilmagan bo'lsa"
    answer: 2
    explain: "Bu yerda ikki kod bir xil bilimni ifodalaydi va birga o'zgaradi. Bu DRY'ning klassik buzilishi. Aksincha, agar haydovchilar uchun xorijiy raqamlarga ruxsat berish rejalashtirilgan bo'lsa, bu turli bilim bo'lishi mumkin."
  - q: "Sandi Metz bo'yicha noto'g'ri abstraksiyadan qanday chiqish kerak?"
    options:
      - "Abstraksiyani chaqiruvchilarga qaytadan inline qilish, har bir chaqiruvchida faqat unga kerak bo'lgan qismini qoldirish, keyin yangi to'g'ri abstraksiyani izlash"
      - "Abstraksiyaga yana bitta parametr qo'shish"
      - "Abstraksiyani yangi klassga o'rash"
      - "Yangi kodni nusxa ko'chirib, eskisini o'zgarishsiz qoldirish"
    answer: 0
    explain: "Metz \"orqaga qaytish - eng tez yo'l\" deydi: takrorni qaytarib kiritish, har bir chaqiruvchidan keraksiz tarmoqlarni o'chirish. Shundan keyin haqiqiy umumiylik ko'rinadi. Yana parametr qo'shish aynan muammoni chuqurlashtiruvchi yo'l."
  - q: "Nega noto'g'ri abstraksiya vaqt o'tishi bilan kuchayadi, garchi hamma uning yomonligini sezsa ham?"
    options:
      - "Chunki linterlar uni tuzatishga ruxsat bermaydi"
      - "Chunki abstraksiyalarni o'chirib bo'lmaydi"
      - "Chunki TypeScript uni qo'llab-quvvatlaydi"
      - "Chunki mavjud kod ko'p mehnat talab qilganday tuyuladi va har bir yangi dasturchi uni buzish o'rniga yana bitta parametr va shart qo'shishni xavfsizroq deb biladi (sunk cost)"
    answer: 3
    explain: "Metz buni sunk cost fallacy bilan tushuntiradi: kod qanchalik chigal bo'lsa, uni saqlab qolish bosimi shuncha kuchli. Har bir dasturchi lokal jihatdan oqilona qaror qabul qiladi va abstraksiya yanada chigallashadi."
  - q: "Dan Abramov o'z hikoyasidan qaysi xulosani chiqaradi?"
    options:
      - "Takror har doim yaxshi"
      - "Clean code maqsad emas: u bilan yo'naltiriling, lekin unga qul bo'lmang; hamkasb kodini kelishmasdan qayta yozish ishonchni buzadi va har bir abstraksiyaning narxi bor"
      - "Refaktoringni faqat tunda qilish kerak"
      - "Menejerlar kodni tushunmaydi"
    answer: 1
    explain: "Abramov ikki narsani ko'rsatadi: texnik (uning abstraksiyasi keyingi maxsus holatlarni qiyinlashtirgan bo'lardi) va ijtimoiy (hamkasbi bilan gaplashmasdan qayta yozish). U \"iflos kod\" ga qaytishni emas, \"toza\" ni jamoa uchun aniq belgilashni taklif qiladi."
  - q: "Kent C. Dodds'ning AHA yondashuvi qanday amaliy qoidani taklif qiladi?"
    options:
      - "Har doim uchinchi takrorda abstraksiya qiling"
      - "Hech qachon abstraksiya qilmang"
      - "Foydalanish holatlarini yaxshi tushunmaguningizcha takrordan qo'rqmang; abstraksiyani umumiylik aniq ko'ringanda qiling, qat'iy sanoq bo'yicha emas"
      - "Faqat kutubxonalarda abstraksiya qiling"
    answer: 2
    explain: "Dodds DRY va WET (\"uchinchi marta abstraksiya qil\") ikkalasini ham haddan tashqari qat'iy deb hisoblaydi. AHA - shoshilinch abstraksiyadan qochish: o'zgarishga optimizatsiya qiling va abstraksiya o'zini oqlaganda qiling."
task:
  title: "Noto'g'ri abstraksiyani inline qilib qayta qurish"
  prompt: |
    Quyidagi `formatVehicleLabel` funksiyasi bir yil oldin uchta joydagi takrorni yo'qotish uchun yaratilgan. O'shandan beri har bir yangi ekran o'z parametrini qo'shgan. Endi funksiya 5 ta parametrli va hech kim uni o'zgartirishga jur'at etmaydi.

    Sandi Metz retseptiga amal qiling:
    1. Funksiyani har bir chaqiruvchiga inline qiling.
    2. Har bir chaqiruvchida faqat u haqiqatan foydalanadigan tarmoqni qoldiring.
    3. Natijaga qarang: haqiqiy umumiy bilim bormi? Bo'lsa, faqat uni ajrating.

    Barcha chaqiruvchilarning natijasi o'zgarmasligi kerak.
  lang: ts
  starter: |
    type Vehicle = { plate: string; brand: string; model: string; year: number; driverName?: string };

    export function formatVehicleLabel(
      v: Vehicle,
      short: boolean,
      withDriver: boolean,
      forSms: boolean,
      upper: boolean,
    ): string {
      let label = short ? v.plate : `${v.brand} ${v.model} (${v.plate})`;
      if (!short && !forSms) label += `, ${v.year}`;
      if (withDriver && v.driverName) label += forSms ? ` - ${v.driverName}` : ` | ${v.driverName}`;
      if (forSms) label = label.replace(/\s+/g, " ").slice(0, 60);
      return upper ? label.toUpperCase() : label;
    }

    // Chaqiruvchilar:
    export const mapMarkerLabel = (v: Vehicle) => formatVehicleLabel(v, true, false, false, true);
    export const fleetTableLabel = (v: Vehicle) => formatVehicleLabel(v, false, true, false, false);
    export const smsVehicleLabel = (v: Vehicle) => formatVehicleLabel(v, false, true, true, false);
  solution: |
    type Vehicle = { plate: string; brand: string; model: string; year: number; driverName?: string };

    const SMS_MAX_LENGTH = 60;

    /** Haqiqiy umumiy bilim: avtomobilning to'liq nomi qanday yoziladi. */
    function vehicleTitle(vehicle: Vehicle): string {
      return `${vehicle.brand} ${vehicle.model} (${vehicle.plate})`;
    }

    export function mapMarkerLabel(vehicle: Vehicle): string {
      return vehicle.plate.toUpperCase();
    }

    export function fleetTableLabel(vehicle: Vehicle): string {
      const base = `${vehicleTitle(vehicle)}, ${vehicle.year}`;
      return vehicle.driverName ? `${base} | ${vehicle.driverName}` : base;
    }

    export function smsVehicleLabel(vehicle: Vehicle): string {
      const base = vehicleTitle(vehicle);
      const label = vehicle.driverName ? `${base} - ${vehicle.driverName}` : base;
      return label.replace(/\s+/g, " ").slice(0, SMS_MAX_LENGTH);
    }
  solutionNotes: |
    - Inline qilgandan keyin har bir chaqiruvchi o'zining 1-3 qatorli versiyasini oldi. Hech bir chaqiruvchi beshta parametrning hammasidan foydalanmagan edi: har biri boshqa ekran uchun qo'shilgan.
    - Haqiqiy umumiy bilim faqat bitta: "avtomobil to'liq nomi = brend, model, raqam qavs ichida". U `vehicleTitle` ga ajratildi, chunki agar biznes formatni o'zgartirsa, bu barcha ekranlar uchun bir xil o'zgarishi kerak.
    - Haydovchi ajratgichi (`|` va `-`) va yil qo'shilishi umumiy emas: ular har bir ekranning o'z qarori. Ularni birlashtirish yana boolean parametrlarga olib keladi.
    - `upper` parametri faqat xarita uchun ishlatilgan va faqat raqamga qo'llangan, shuning uchun u `mapMarkerLabel` ichiga tushdi.
    - Natijada takror bor (`vehicle.driverName ? ... : base` ikki marta). Bu ataylab: ikki ekran haydovchini turli formatda ko'rsatadi va mustaqil o'zgaradi. Bu Metz'ning "noto'g'ri abstraksiyadan takror arzon" degan g'oyasi.
    - Refaktoringdan oldin har bir chaqiruvchi uchun 2-3 ta misol (haydovchili va haydovchisiz) bilan natijani qayd qiling va keyin solishtiring.
  checklist:
    - "Boolean parametrli umumiy funksiya yo'qoldi"
    - "Har bir chaqiruvchi faqat o'ziga kerak bo'lgan mantiqni o'z ichiga oladi"
    - "Faqat haqiqatan birga o'zgaradigan bilim umumiy funksiyaga ajratildi"
    - "Qolgan takror ataylab qoldirilgani va sababi tushuntirildi"
    - "Uchala chaqiruvchi uchun natijalar oldingisi bilan bir xil"
---

## Muammo

DRY ("Don't Repeat Yourself") ko'p dasturchilar uchun birinchi o'rgangan dizayn tamoyili. U shu qadar oddiy ko'rinadiki, uni ko'pincha mexanik qoida sifatida qo'llashadi: ikki joyda o'xshash kod ko'rdingmi - birlashtir. Natijada ko'p kod bazalarida quyidagi manzara uchraydi: `utils/` papkasida o'nlab "umumiy" funksiyalar, ularning har biri 4-6 ta boolean parametrli, har bir chaqiruvchi o'z kombinatsiyasidan foydalanadi va hech kim ularni o'zgartirishga jur'at etmaydi, chunki qaysi ekran buzilishini bilmaydi.

Paradoks: takrordan qochish uchun qilingan ish change amplification'ni (3-dars) kamaytirish o'rniga uni oshirgan. Bitta joyni o'zgartirish endi barcha chaqiruvchilarni tekshirishni talab qiladi.

Bu darsning maqsadi - DRY'ni uning mualliflari nazarda tutgan ma'noda tushunish va qachon takror abstraksiyadan arzonroq ekanini bilish.

## Asosiy g'oya

### DRY - bilim haqida

DRY atamasi David Thomas va Andrew Hunt'ning *The Pragmatic Programmer* kitobidan keladi. Ularning ta'rifi ataylab kod haqida emas: "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." Ya'ni har bir **bilim** tizimda bitta aniq va ishonchli ifodaga ega bo'lishi kerak.

Kitobning 20 yillik nashrida mualliflar DRY qanchalik noto'g'ri tushunilganini tan olib, aniqlashtirish kiritadi: DRY bilim va niyatning takrori haqida, kod takrori haqida emas. Ular ikki tomonlama misollar beradi:

- **Bir xil ko'rinadigan, lekin DRY buzilmagan kod.** Ikki funksiya tasodifan bir xil validatsiyani bajaradi, lekin ular turli biznes qoidalarini ifodalaydi (masalan, foydalanuvchi yoshi va buyurtmadagi mahsulot soni, ikkalasi ham "musbat butun son"). Ular mustaqil o'zgaradi, shuning uchun birlashtirish xato.
- **Har xil ko'rinadigan, lekin DRY buzilgan kod.** Bir xil bilim turli shakllarda: hujjatda va kodda, bazaning sxemasida va TypeScript tipida, backend validatsiyasida va frontend formasida. Matn har xil, bilim bir xil, va ular sinxron bo'lmasa xato chiqadi.

Mualliflar DRY buzilishini bir necha manbaga ajratadi: kodda, hujjatlarda, ma'lumotlarda (masalan, saqlangan va hisoblanadigan maydon bir vaqtda), tizimlar orasidagi API'larda va dasturchilar orasida (ikki jamoa bir xil narsani alohida yozishi).

### Noto'g'ri abstraksiya

Sandi Metz 2016 yildagi "The Wrong Abstraction" maqolasida RailsConf 2014 dagi chiqishida aytgan g'oyani kengaytiradi: "duplication is far cheaper than the wrong abstraction". U noto'g'ri abstraksiyaning tipik evolyutsiyasini tasvirlaydi:

1. Dasturchi takrorni ko'radi, uni nomli funksiyaga ajratadi va barcha nusxalarni almashtiradi.
2. Yangi talab keladi va u abstraksiyaga **deyarli** mos keladi.
3. Keyingi dasturchi abstraksiyani saqlab qolish majburiyatini sezadi, unga parametr va shart qo'shadi.
4. Bu takrorlanadi. Abstraksiya parametrlar va tarmoqlar to'plamiga aylanadi, uni tushunish qiyin va o'zgartirish xavfli.

Metz bu jarayonning sababini **sunk cost fallacy** bilan tushuntiradi: mavjud kod ko'p mehnat talab qilgandek tuyuladi va qanchalik chigal bo'lsa, uni saqlab qolish bosimi shuncha kuchli.

Uning retsepti: **orqaga qayting**. Abstraksiyani har bir chaqiruvchiga qaytadan inline qiling, har bir chaqiruvchida faqat unga kerak bo'lgan qismini qoldiring, keraksiz tarmoqlarni o'chiring. Shundan keyin haqiqiy umumiylik ko'rinadi va yangi, to'g'ri abstraksiyani qurish mumkin. Uning so'zlari bilan aytganda, oldinga eng tez yo'l - orqaga.

## Chuqurroq: AHA va Abramov hikoyasi

### AHA: shoshilinch abstraksiyadan qochish

Kent C. Dodds 2020 yildagi "AHA Programming" maqolasida DRY va WET'ni solishtiradi. WET (Conlin Durbin talqinida "Write Everything Twice") - takrorga ruxsat beradi, lekin uchinchi takrorda abstraksiya qilishni taklif qiladi. Dodds ikkalasini ham haddan tashqari qat'iy deb hisoblaydi va **AHA - Avoid Hasty Abstractions** ni taklif qiladi (u atamani Cher Scarlett'dan olganini aytadi).

AHA'ning mohiyati: kod qanday o'zgarishini oldindan bilmaymiz, shuning uchun **avval o'zgarishga optimizatsiya qiling**. Foydalanish holatlarini yaxshi tushunmaguningizcha takrordan qo'rqmang. Bir nechta haqiqiy holat paydo bo'lganda umumiylik o'zi ko'rinadi va abstraksiyani asoslash oson bo'ladi. Erta abstraksiya esa yangi holatlarni mos kelmaydigan shaklga majburlaydi.

AHA va DRY zid emas. DRY qachon takror haqiqiy muammo ekanini aytadi (bir xil bilim). AHA qachon abstraksiya qilish vaqti kelganini aytadi (bilim aniq bo'lganda).

### "Goodbye, Clean Code"

Dan Abramov 2020 yil yanvaridagi qisqa maqolasida shaxsiy hikoyani aytib beradi. Hamkasbi grafik muharrirda shakllarning o'lchamini o'zgartirish tutqichlarini (resize handles) yozgan: har bir shakl (to'rtburchak, oval va boshqalar) uchun alohida metodlar, ichida takrorlangan matematik hisob-kitoblar. Abramov o'sha kuni kechasi bu kodni qayta yozadi: yo'nalishlar va shakllarni ajratib, ularni kompozitsiya qiladi, kod hajmi taxminan ikki baravar qisqaradi, takror yo'qoladi. Hamkasbi bilan gaplashmasdan uni asosiy branch'ga yuboradi. Ertasi kuni boshlig'i uni yakkama-yakka suhbatga chaqirib, o'zgarishni qaytarishni so'raydi.

Abramov xulosalari:

- **Ijtimoiy tomon.** Hamkasb kodini u bilan gaplashmasdan qayta yozish ishonchni buzadi. Jamoa kodi ustida ishlash - kod emas, odamlar bilan ishlash.
- **Texnik tomon.** Uning abstraksiyasi kelajakdagi o'zgarishlarni qiyinlashtirgan bo'lardi: keyinchalik ba'zi tutqichlar uchun maxsus xatti-harakat kerak bo'lganda, "toza" versiya chigallashardi, "iflos" asl versiya esa o'zgartirish oson qolardi. Hech narsa tekin emas.
- **Bosqich sifatida.** U clean code'ga intilishni dasturchi rivojlanishidagi tabiiy bosqich deb ataydi: takrorni yo'qotish o'lchanadigan yutuq kabi tuyuladi va o'zini qadrlashga bog'lanib qolishi mumkin.
- **Muvozanat.** U "iflos kod" ga qaytishni taklif qilmaydi. Uning maslahati: "clean" ning jamoa uchun aniq ma'nosini va u kodni o'zgartirishga qanday ta'sir qilishini o'ylab ko'ring. Maqola oxiridagi fikr: clean code sizga yo'l ko'rsatsin, keyin uni qo'yib yuboring.

### Takrorni qachon yo'qotish kerak: amaliy test

Uchala manbadan bitta savol chiqadi: **bu ikki kod parchasi birga o'zgaradimi?**

- Agar biznes qoidasi o'zgarganda ikkalasi ham bir xil o'zgarishi shart bo'lsa (bitta bilim), birlashtiring. Kechiktirish xato beradi: birini yangilab, ikkinchisini unutasiz.
- Agar ular turli sabablarga ko'ra va turli vaqtda o'zgarishi mumkin bo'lsa (tasodifiy o'xshashlik), alohida qoldiring.
- Agar bilmasangiz, kuting (AHA). Takrorni keyin yo'qotish noto'g'ri abstraksiyani keyin buzishdan arzon.

Bu test SRP'ning (53-dars) "bitta aktor" g'oyasi bilan ham bog'liq: turli aktorlar (turli bo'limlar, turli ekranlar) uchun xizmat qiladigan kodni birlashtirish ularni bir-biriga bog'laydi.

## Misol: buyurtma va qaytarish validatsiyasi

Ikki joyda o'xshash validatsiya:

```ts
type OrderInput = { quantity: number; phone: string };
type RefundInput = { quantity: number; phone: string };

export function validateOrder(input: OrderInput): string[] {
  const errors: string[] = [];
  if (input.quantity < 1 || input.quantity > 100) errors.push("quantity");
  if (!/^\+998\d{9}$/.test(input.phone)) errors.push("phone");
  return errors;
}

export function validateRefund(input: RefundInput): string[] {
  const errors: string[] = [];
  if (input.quantity < 1 || input.quantity > 100) errors.push("quantity");
  if (!/^\+998\d{9}$/.test(input.phone)) errors.push("phone");
  return errors;
}
```

Mexanik DRY: `validateOrderOrRefund` ga birlashtirish. Lekin to'g'ri savol: qaysi qism bitta bilim?

- **Telefon formati** - bitta bilim: "O'zbekiston mobil raqami". U o'zgarsa (masalan, xorijiy raqamlarga ruxsat), ikkala joyda bir xil o'zgarishi kerak.
- **Miqdor chegarasi** - ikki xil bilim. Buyurtmadagi 100 - ombor va logistika cheklovi. Qaytarishdagi chegara aslida "dastlabki buyurtmadagi miqdordan oshmasin" bo'lishi kerak, va bu yerda 100 tasodifan nusxa ko'chirilgan.

```ts
const UZ_MOBILE_PHONE = /^\+998\d{9}$/;

export function isUzMobilePhone(phone: string): boolean {
  return UZ_MOBILE_PHONE.test(phone);
}

const MAX_ITEMS_PER_ORDER = 100;

type OrderInput = { quantity: number; phone: string };
type RefundInput = { quantity: number; phone: string; originalQuantity: number };

type ValidationError = "quantity" | "phone";

export function validateOrder(input: OrderInput): ValidationError[] {
  const errors: ValidationError[] = [];
  if (input.quantity < 1 || input.quantity > MAX_ITEMS_PER_ORDER) errors.push("quantity");
  if (!isUzMobilePhone(input.phone)) errors.push("phone");
  return errors;
}

export function validateRefund(input: RefundInput): ValidationError[] {
  const errors: ValidationError[] = [];
  if (input.quantity < 1 || input.quantity > input.originalQuantity) errors.push("quantity");
  if (!isUzMobilePhone(input.phone)) errors.push("phone");
  return errors;
}
```

Natijada bir qism takror qoldi (`errors` massivi, `quantity < 1` tekshiruvi). Bu ataylab: ikki funksiya turli biznes jarayonlarini ifodalaydi va mustaqil o'zgaradi. Bilim takrori esa yo'qoldi, va bu jarayonda yashirin bug ham topildi: qaytarish miqdori 100 bilan emas, asl buyurtma bilan cheklanishi kerak edi. DRY'ni bilim nuqtai nazaridan ko'rish ko'pincha shunday bug'larni ochadi.

## Qachon qo'llamaslik kerak

- **Tasodifiy o'xshashlik.** Ikki kod bugun bir xil ko'rinadi, lekin turli sabablarga ko'ra o'zgaradi. Ularni birlashtirish ikki mustaqil narsani bog'laydi.
- **Testlarda.** Test kodi o'qiluvchanlik uchun takrorga ko'proq ruxsat beradi. Har bir test o'zida tushunarli bo'lishi kerak, ko'p darajali yordamchi funksiyalar va umumiy `beforeEach` holatlari testni o'qishni qiyinlashtiradi (62-dars).
- **Servislar va jamoalar chegarasida.** Ikki mikroservis yoki ikki jamoa o'rtasida kod ulashish (umumiy kutubxona) ularni deploy va versiyalash bo'yicha bog'laydi. Ba'zan kichik takror mustaqillik uchun arzon narx.
- **Noaniq domen.** Talablar hali aniq bo'lmaganda abstraksiya - bashorat. AHA: kuting.
- **Abstraksiya parametrlar to'plamiga aylanganda.** Bu DRY'ni qo'llamaslik emas, balki uni qaytarish vaqti: Metz retsepti bo'yicha inline qiling.

Shu bilan birga, teskari xatoga ham tushmang: **bilim takrori** (biznes qoidasi, formula, format) deyarli har doim zararli. "Takror arzon" degan g'oyani bir xil qoidaning uch nusxasini oqlash uchun ishlatmang.

## Stack'da: TypeScript, NestJS, React, Next.js

- **Tiplar va validatsiya.** Bir xil ma'lumot shakli TypeScript tipi, NestJS DTO va frontend formasi validatsiyasida alohida yozilsa, bu bilim takrori. Zod sxemasidan `z.infer` bilan tip olish yoki umumiy sxemani backend va frontend o'rtasida ulashish bu bilimni bitta joyga yig'adi (45-dars).
- **Prisma sxemasi.** `schema.prisma` - ma'lumot modelining ishonchli manbai. Undan generatsiya qilingan tiplar o'rniga qo'lda yozilgan parallel tiplar - DRY buzilishi.
- **React komponentlari.** "Umumiy" `Button` ga har bir yangi ekran uchun boolean prop qo'shish Metz tasvirlagan evolyutsiyaning React versiyasi. Kompozitsiya (`children`, `variant` union) yoki alohida komponentlar ko'pincha yaxshiroq.
- **Next.js'da.** Bir xil ma'lumot olish mantiqini server komponenti va route handler'da takrorlash - bilim takrori, uni bitta data funksiyasiga chiqaring. Lekin ikki sahifaning layout'i bugun o'xshash bo'lgani uchun ularni bitta "universal" layout'ga birlashtirish ko'pincha erta.
- **NestJS'da.** Bir nechta modul uchun "umumiy base service" (`BaseCrudService<T>`) ko'pincha noto'g'ri abstraksiyaga aylanadi: birinchi maxsus holatda u `override` va bayroqlar bilan to'ladi.

## Xulosa

- DRY - bilim haqida, kod matni haqida emas: har bir bilim tizimda bitta ishonchli ifodaga ega bo'lishi kerak.
- Bir xil ko'rinadigan kod har doim takror emas, har xil ko'rinadigan kod esa bilim takrori bo'lishi mumkin.
- Metz: noto'g'ri abstraksiyadan takror arzonroq. Undan chiqish yo'li - inline qilib orqaga qaytish.
- Dodds'ning AHA'si: abstraksiyani umumiylik aniq ko'ringanda qiling, qat'iy sanoq bo'yicha emas.
- Abramov hikoyasi: abstraksiyaning narxi bor, va jamoa kodini o'zgartirish - ijtimoiy jarayon.
- Amaliy test: bu ikki joy birga o'zgaradimi?
