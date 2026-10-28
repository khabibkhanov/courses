---
n: 30
slug: funksiya-refaktoring-amaliyoti
title: "Amaliyot: Extract/Inline Function"
summary: "Modulning yakuniy amaliy darsi. Fowler'ning ikki qarama-qarshi refaktoringi - Extract Function va Inline Function - mexanikasi, ularni xavfsiz bajarish qadamlari, IDE vositalari va \"avval inline, keyin qayta extract\" usuli bilan noto'g'ri bo'lingan kodni tuzatish."
duration: 45
sources:
  - id: refactoring
    note: "Eng ko'p ishlatiladigan refaktoringlar bobidagi Extract Function va Inline Function: motivatsiya, mexanika va misollar"
  - id: refactoring-catalog
    note: "Extract Function (Extract Method), Inline Function (Inline Method), Extract Variable, Inline Variable, Replace Temp with Query sahifalari"
quiz:
  - q: "Fowler Extract Function qachon qilish kerakligi uchun qaysi mezonni asosiy deb biladi?"
    options:
      - "Funksiya 10 qatordan oshganda"
      - "Kod bo'lagi kamida 3 marta takrorlanganda"
      - "Kod bo'lagi nima qilishini tushunish uchun uni o'qib tahlil qilishga to'g'ri kelsa, uni \"nima\"ni aytadigan nomli funksiyaga chiqarish: niyat va implementatsiyani ajratish"
      - "Faqat test yozish uchun"
    answer: 2
    explain: "Fowler uchun mezon uzunlik yoki takror emas, niyat va implementatsiyani ajratish. Agar kod bo'lagi \"qanday\"ni ko'rsatsa va siz \"nima\"ni tushunish uchun vaqt sarflasangiz, bu extract uchun signal. Hatto bir qatorli kod ham ajratilishi mumkin, agar nom uni aniqroq qilsa."
  - q: "Inline Function qachon o'rinli?"
    options:
      - "Funksiya tanasi nomi kabi aniq bo'lsa yoki keraksiz bilvositalik (indirection) faqat sakrash qo'shayotgan bo'lsa"
      - "Funksiya bir martadan ko'p chaqirilsa"
      - "Funksiya polimorf bo'lib, subklasslarda override qilinsa"
      - "Funksiya async bo'lsa"
    answer: 0
    explain: "Fowler katalogidagi misolda `moreThanFiveLateDeliveries(driver)` tanasi `driver.numberOfLateDeliveries > 5` nomidan ham aniqroq, shuning uchun inline qilinadi. Polimorf metodni inline qilib bo'lmaydi, chunki chaqiruv qaysi implementatsiyaga borishi runtime'da aniqlanadi."
  - q: "Extract Function mexanikasida eng ko'p xato qaysi qadamda bo'ladi?"
    options:
      - "Yangi funksiyaga nom berishda"
      - "Ajratilayotgan bo'lakda o'zgartiriladigan va keyin ishlatiladigan lokal o'zgaruvchilarni aniqlashda"
      - "Funksiyani faylning oxiriga joylashtirishda"
      - "Testlarni ishga tushirishda"
    answer: 1
    explain: "Bo'lak faqat o'qiydigan o'zgaruvchilar parametr bo'ladi. Bo'lak o'zgartiradigan va keyin tashqarida ishlatiladigan o'zgaruvchi natija sifatida qaytarilishi kerak. Ikki va undan ko'p bunday o'zgaruvchi bo'lsa, bo'lakni boshqacha tanlash yoki avval Split Variable/Replace Temp with Query qilish kerak."
  - q: "Kod o'nlab mayda, bir-biriga chalkashgan funksiyalarga bo'lingan va mantiqni kuzatib bo'lmaydi. Fowler qanday yondashuvni taklif qiladi?"
    options:
      - "Kodni noldan qayta yozish"
      - "Har bir funksiyaga komment yozish"
      - "Funksiyalarni alifbo tartibida joylashtirish"
      - "Hammasini bitta katta funksiyaga inline qilib, keyin to'g'ri chegaralar bo'yicha qayta extract qilish"
    answer: 3
    explain: "Fowler Inline Function motivatsiyasida aynan shu holatni keltiradi: yomon bo'lingan funksiyalar guruhini avval bitta funksiyaga yig'ib, keyin qayta ajratish. Bu xavfsiz, mexanik qadamlar bilan amalga oshadi va noldan qayta yozishdan kamroq xavfli."
  - q: "TypeScript loyihasida `calculateFee` metodini IDE'ning \"Inline function\" buyrug'i bilan inline qilish o'rniga qo'lda inline qilish qachon zarur bo'lishi mumkin?"
    options:
      - "Hech qachon, IDE har doim to'g'ri ishlaydi"
      - "Funksiya bitta argument olsa"
      - "Funksiya dinamik chaqirilsa (masalan, `obj[methodName]()`), interfeys orqali turli implementatsiyalarga ega bo'lsa yoki tanasida erta return'lar bo'lib, IDE ularni to'g'ri qayta tuzolmasa"
      - "Funksiya export qilinmagan bo'lsa"
    answer: 2
    explain: "IDE statik tahlilga tayanadi: dinamik chaqiruvlar, polimorfizm va murakkab boshqaruv oqimi uning imkoniyatidan tashqarida bo'lishi mumkin. Bunday holda Fowler'ning qadamma-qadam mexanikasi (har bir chaqiruvni alohida almashtirib, testlash) xavfsizroq."
  - q: "Extract Function'dan keyin yangi funksiya uchun yaxshi nom topa olmayapsiz. Bu nimani bildiradi?"
    options:
      - "Bo'lak ehtimol mustaqil tushuncha emas yoki noto'g'ri chegarada kesilgan; uni boshqacha tanlash yoki extract qilmaslik kerak"
      - "Nomga raqam qo'shish kerak (helper1, helper2)"
      - "Nomni keyinroq o'ylash mumkin, asosiysi bo'lish"
      - "Nomni `doStuff` qilib qo'yish kifoya"
    answer: 0
    explain: "Extract'ning butun qiymati nomda. Agar nom bo'lakni yaxshi ifodalamasa, o'quvchi baribir tanani o'qishi kerak va funksiya sayoz bo'ladi (21-dars). Nom topishning qiyinligi - dizayn haqidagi signal."
task:
  title: "Hisob-faktura funksiyasini qadamma-qadam refaktoring qilish"
  prompt: |
    Quyidagi kod ijara kompaniyasi uchun oylik hisob-faktura matnini chiqaradi. U ikki xil kasallikka ega: asosiy funksiya juda ko'p ishni aralashtirib qilgan, va unga yordam beradigan ikkita sayoz funksiya faqat sakrash qo'shadi.

    Topshiriq - kodni Fowler mexanikasi bilan, kichik qadamlarda o'zgartirish:

    1. Avval sayoz funksiyalarni (`isLong`, `fmt`) Inline Function bilan olib tashlang yoki ularning qolish-qolmasligini asoslang.
    2. Keyin asosiy funksiyadan mustaqil ma'noga ega bo'laklarni Extract Function bilan ajrating. Har bir extract'dan keyin xatti-harakat o'zgarmaganini tekshiring.
    3. Extract qilinayotgan bo'lakdagi lokal o'zgaruvchilarni (o'qiladigan va o'zgartiriladigan) aniqlang.
    4. Yakuniy kod uchun har bir qadamni qisqa commit xabari sifatida yozing.
  lang: ts
  starter: |
    type Rental = { carModel: string; days: number; dailyRate: number };
    type Invoice = { customer: string; month: string; rentals: Rental[] };

    function isLong(r: Rental): boolean {
      return r.days >= 7;
    }

    function fmt(n: number): string {
      return n.toLocaleString("uz-UZ");
    }

    export function renderInvoice(invoice: Invoice): string {
      let out = `Hisob-faktura: ${invoice.customer} (${invoice.month})\n`;
      let total = 0;
      let longCount = 0;
      for (const r of invoice.rentals) {
        let amount = r.days * r.dailyRate;
        if (isLong(r)) {
          amount = amount * 0.9;
          longCount++;
        }
        amount = Math.round(amount);
        total += amount;
        out += `  ${r.carModel}: ${r.days} kun - ${fmt(amount)} so'm\n`;
      }
      if (longCount >= 3) total = Math.round(total * 0.95);
      out += `Jami: ${fmt(total)} so'm\n`;
      return out;
    }
  solution: |
    type Rental = { carModel: string; days: number; dailyRate: number };
    type Invoice = { customer: string; month: string; rentals: Rental[] };

    const LONG_RENTAL_DAYS = 7;
    const LONG_RENTAL_DISCOUNT = 0.1;
    const LOYALTY_MIN_LONG_RENTALS = 3;
    const LOYALTY_DISCOUNT = 0.05;

    export function renderInvoice(invoice: Invoice): string {
      const lines = invoice.rentals.map(
        (r) => `  ${r.carModel}: ${r.days} kun - ${formatSum(rentalAmount(r))} so'm`,
      );
      return [
        `Hisob-faktura: ${invoice.customer} (${invoice.month})`,
        ...lines,
        `Jami: ${formatSum(invoiceTotal(invoice.rentals))} so'm`,
        "",
      ].join("\n");
    }

    export function rentalAmount(r: Rental): number {
      const base = r.days * r.dailyRate;
      const discounted = r.days >= LONG_RENTAL_DAYS ? base * (1 - LONG_RENTAL_DISCOUNT) : base;
      return Math.round(discounted);
    }

    export function invoiceTotal(rentals: readonly Rental[]): number {
      const subtotal = rentals.reduce((sum, r) => sum + rentalAmount(r), 0);
      const longRentals = rentals.filter((r) => r.days >= LONG_RENTAL_DAYS).length;
      return longRentals >= LOYALTY_MIN_LONG_RENTALS ? Math.round(subtotal * (1 - LOYALTY_DISCOUNT)) : subtotal;
    }

    function formatSum(amount: number): string {
      return amount.toLocaleString("uz-UZ");
    }
  solutionNotes: |
    - Qadamlar (har biri alohida commit va test bilan):
      1. `refactor: inline isLong` - tana (`r.days >= 7`) nomdan aniqroq, ayniqsa konstanta nomi bilan. Inline Function.
      2. `refactor: extract rentalAmount` - sikl ichidagi summa hisobi. O'qiladigan o'zgaruvchi `r`, natija `amount`. `longCount++` side effect'i bo'lakda edi, shuning uchun avval Split Loop qilindi: hisoblash va sanash alohida.
      3. `refactor: extract invoiceTotal` - jami va sodiqlik chegirmasi bitta biznes tushuncha.
      4. `refactor: replace loop with pipeline in renderInvoice` - matn yig'ish endi faqat formatlash.
      5. `refactor: name discount constants`.
    - `fmt` inline qilinmadi, balki `formatSum`ga qayta nomlandi: u ikki joyda ishlatiladi va valyuta formatini bitta joyda saqlaydi. Bu Inline va Extract orasidagi ongli tanlov.
    - `rentalAmount` endi `invoiceTotal` va `renderInvoice`da ikki marta chaqiriladi. Bu Fowler'ning Replace Temp with Query'dagi pozitsiyasiga mos: o'qilish uchun takroriy hisob odatda arzon, profiling boshqacha ko'rsatmasa.
    - Natija sof hisoblash funksiyalari va formatlashdan iborat: `rentalAmount` va `invoiceTotal`ni matnni parse qilmasdan test qilish mumkin.
    - Refaktoringdan oldin kamida 3 ta hisob-faktura uchun chiqish matnini characterization test sifatida saqlang: yaxlitlash tartibi o'zgarsa, test buni ushlaydi.
  checklist:
    - "Har bir qadamdan keyin chiqish matni o'zgarmagan (characterization test bilan tekshirildi)"
    - "Sikl ichidagi side effect (hisoblagich) extract'dan oldin ajratildi"
    - "Sayoz funksiyalar inline qilindi yoki qolishi asoslandi"
    - "Biznes hisob-kitob formatlashdan alohida, sof funksiyalarda"
    - "Har bir qadam alohida, xatti-harakatni o'zgartirmaydigan commit"
---

## Muammo

Bu modulda funksiyalar haqida ko'p qoida ko'rdik: o'lcham (21-dars), bitta abstraksiya darajasi (22-dars), argumentlar (23-dars), side effect'lar (24-dars), guard clause'lar (26-dars). Lekin real loyihada ularni noldan yozilgan kodga emas, mavjud, ishlab turgan va testlari yarim bo'lgan kodga qo'llashga to'g'ri keladi. Va bu yerda asosiy xavf paydo bo'ladi: "tozalash" paytida xatti-harakat jimgina o'zgaradi.

Odatiy ssenariy: dasturchi 200 qatorli funksiyani ko'radi, uni bir o'tirishda qayta yozadi, ikkita kichik xatoni ham tuzatadi, nomlarni o'zgartiradi va bitta katta PR ochadi. Reviewer'lar o'zgarishni to'liq tekshira olmaydi, bir hafta o'tib yaxlitlash tartibi o'zgargani sababli hisob-fakturalar 1 so'mga farq qilayotgani aniqlanadi. Muammo niyatda emas, usulda: refaktoring va xatti-harakat o'zgarishi aralashgan va katta qadamlarda bajarilgan.

## Asosiy g'oya

Fowler *Refactoring* kitobida refaktoringni kichik, xatti-harakatni saqlaydigan o'zgarishlar ketma-ketligi sifatida ta'riflaydi. Har bir qadam shunchalik kichikki, u buzilsa, xatoni topish oson. Funksiyalar darajasida ikkita eng asosiy refaktoring bor va ular bir-biriga teskari.

### Extract Function

Kod bo'lagini alohida nomli funksiyaga chiqarish (ilgari Extract Method deb atalgan). Katalogdagi misolda `printOwing` funksiyasi banner chiqaradi, qarzni hisoblaydi va tafsilotlarni chop etadi; `//print details` kommentli ikki qator `printDetails(outstanding)` funksiyasiga chiqariladi. E'tibor bering: kommentning o'zi funksiya nomiga aylangan.

Fowler uchun extract qilish mezoni uzunlik ham, takror ham emas. Uning mezoni **niyat va implementatsiyani ajratish**: agar kod bo'lagini o'qib, u *nima* qilishini tushunish uchun vaqt sarflasangiz, uni o'sha "nima"ni aytadigan nomli funksiyaga chiqaring. Shunda keyingi safar o'quvchi nomni o'qiydi va implementatsiyaga faqat kerak bo'lsa kiradi. Fowler shu sababli juda qisqa, hatto bir qatorli funksiyalarni ham yozishini aytadi, agar nom kodni aniqroq qilsa.

### Inline Function

Teskari amal: funksiya chaqiruvini uning tanasi bilan almashtirish va funksiyani o'chirish. Katalogdagi misol: `getRating(driver)` `moreThanFiveLateDeliveries(driver)`ni chaqiradi, uning tanasi esa bitta `driver.numberOfLateDeliveries > 5` ifodasi. Inline'dan keyin shart to'g'ridan-to'g'ri `getRating` ichida.

Fowler inline uchun ikki asosiy motivni keltiradi. Birinchisi: funksiya tanasi uning nomidek aniq, demak bilvositalik (indirection) hech narsa bermaydi va faqat sakrash qo'shadi. Ikkinchisi: kod yomon bo'lingan, funksiyalar chalkashgan. Bunday holda ularni avval bitta katta funksiyaga inline qilib, keyin to'g'ri chegaralar bo'yicha qayta extract qilish oson.

Ikkala refaktoringning birga mavjudligi muhim xabar beradi: **bo'lish qaytariladigan qaror**. Martin munozarada (21-dars) aynan shuni aytgan edi: noto'g'ri ajratilgan funksiyani har doim inline qilish mumkin. Lekin amalda bunday inline'ga kamdan-kam qaytiladi (bu muallifning bahosi). Bu darsning maqsadi - inline qilishni ham extract kabi oddiy va odatiy amalga aylantirish.

## Chuqurroq: mexanika

### Extract Function qadamlari

Fowler mexanikasini umumlashtirib (o'z so'zlarimiz bilan):

1. **Yangi funksiya yarating va unga niyatni aytadigan nom bering.** "Qanday" emas, "nima" bo'yicha. Agar yaxshi nom topilmasa, bu bo'lak mustaqil tushuncha emasligi belgisi; to'xtang.
2. **Bo'lakni yangi funksiyaga nusxalang.**
3. **Lokal o'zgaruvchilarni tahlil qiling.** Bo'lak faqat o'qiydigan o'zgaruvchilar - parametr. Bo'lak ichida e'lon qilinib, faqat ichida ishlatiladiganlari - yangi funksiyaning lokal o'zgaruvchisi. Bo'lak o'zgartiradigan va keyin tashqarida ishlatiladigan o'zgaruvchi - qaytariladigan qiymat. Agar bunday o'zgaruvchilar ikkita yoki undan ko'p bo'lsa, avval boshqa refaktoringlar kerak: Split Variable, Replace Temp with Query yoki Split Loop.
4. **Kompilyatsiya qiling.** TypeScript bu yerda tekshiruvchi: yo'qolgan o'zgaruvchilar darhol ko'rinadi.
5. **Asl bo'lakni yangi funksiya chaqiruvi bilan almashtiring.**
6. **Testlarni ishga tushiring.**
7. **Shunga o'xshash boshqa kodni qidiring** va uni ham yangi funksiya chaqiruviga almashtirishni ko'rib chiqing.

### Inline Function qadamlari

1. **Funksiya polimorf emasligini tekshiring.** Agar u interfeys yoki subklasslarda turli implementatsiyaga ega bo'lsa, uni inline qilib bo'lmaydi.
2. **Barcha chaqiruv joylarini toping.** TypeScript'da "Find All References". Dinamik chaqiruvlar (`service[methodName]()`) va tashqi paketlardagi foydalanuvchilarni unutmang: export qilingan funksiyani o'chirish public API o'zgarishi.
3. **Har bir chaqiruvni tana bilan almashtiring, har biridan keyin test qiling.** Ko'p chaqiruv bo'lsa, ularni birma-bir o'tkazish xatoni lokalizatsiya qiladi.
4. **Funksiya ta'rifini o'chiring.**

Tanada erta `return`lar, rekursiya yoki `this`ga murojaat bo'lsa, inline murakkablashadi. Fowler bunday holda inline qilmaslikni yoki avval tanani soddalashtirishni maslahat beradi.

### Kichik qadamlar va commit'lar

Har bir refaktoring qadamini alohida commit qilish ikki foyda beradi. Birinchisi, test buzilsa, qaysi qadam sabab ekani aniq va uni qaytarish arzon. Ikkinchisi, review'da "faqat struktura o'zgardi" degan commit'ni tez tekshirish mumkin, chunki reviewer xatti-harakat o'zgarishini qidirishi shart emas. Kent Beckning "tidy first" g'oyasi aynan shu: struktura va xatti-harakat o'zgarishlarini alohida commit'larda saqlash (78-dars). Testlar yetarli bo'lmasa, refaktoringdan oldin mavjud xatti-harakatni characterization test bilan qayd qiling (79-dars).

### IDE yordami

VS Code va WebStorm TypeScript uchun "Extract to function", "Extract to constant", "Inline variable" va "Move to new file" kabi avtomatik refaktoringlarga ega. Ular o'zgaruvchilar tahlilini (3-qadam) avtomatik bajaradi va qo'lda xato qilish ehtimolini kamaytiradi. Lekin ular statik tahlilga tayanadi: dinamik chaqiruvlar, `any` orqali o'tgan qiymatlar va side effect'lar tartibi ularning nazoratidan tashqarida. Avtomatik refaktoringdan keyin ham testlarni ishga tushiring.

## Misol: avval inline, keyin qayta extract

Noto'g'ri bo'lingan kod, PrimeGenerator'ga o'xshash (21-dars):

```ts
type Trip = { distanceKm: number; fuelLiters: number; idleMinutes: number };

let trips: Trip[] = [];

function load(t: Trip[]): void {
  trips = t;
}
function totalKm(): number {
  return trips.reduce((s, t) => s + t.distanceKm, 0);
}
function totalFuel(): number {
  return trips.reduce((s, t) => s + t.fuelLiters, 0);
}
function per100(): number {
  return (totalFuel() / totalKm()) * 100;
}

export function fuelReport(t: Trip[]): string {
  load(t);
  return `${per100().toFixed(1)} l/100km`;
}
```

Har bir funksiya kichik va "bitta ish" qiladi, lekin ular modul darajasidagi `trips` orqali chalkashgan va `per100` faqat `load`dan keyin to'g'ri ishlaydi (temporal coupling, 24-dars). Bo'sh ro'yxatda nolga bo'lish ham bor.

**1-bosqich: hammasini inline qilish.**

```ts
export function fuelReport(t: Trip[]): string {
  const km = t.reduce((s, trip) => s + trip.distanceKm, 0);
  const fuel = t.reduce((s, trip) => s + trip.fuelLiters, 0);
  return `${((fuel / km) * 100).toFixed(1)} l/100km`;
}
```

Endi butun mantiq bir joyda ko'rinadi va yashirin holat yo'qoldi. Xatti-harakat bir xil (testlar o'tadi).

**2-bosqich: to'g'ri chegarada qayta extract qilish.**

```ts run
export function fuelConsumptionPer100Km(trips: readonly Trip[]): number | null {
  const km = trips.reduce((s, t) => s + t.distanceKm, 0);
  if (km === 0) return null;
  const fuel = trips.reduce((s, t) => s + t.fuelLiters, 0);
  return (fuel / km) * 100;
}

export function fuelReport(trips: readonly Trip[]): string {
  const consumption = fuelConsumptionPer100Km(trips);
  return consumption === null ? "Ma'lumot yo'q" : `${consumption.toFixed(1)} l/100km`;
}

// Sinab ko'ring: reyslarni o'zgartiring yoki bo'sh ro'yxat bering.
const trips: Trip[] = [
  { distanceKm: 120, fuelLiters: 14.4, idleMinutes: 10 },
  { distanceKm: 80, fuelLiters: 11, idleMinutes: 25 },
];
console.log(fuelReport(trips));
console.log(fuelReport([]));
```

Endi bo'linish chizig'i haqiqiy tushunchalar orasida: **hisoblash** (sof, raqam qaytaradi, boshqa joylarda ham kerak) va **formatlash**. `totalKm` va `totalFuel` alohida funksiya bo'lib qaytmadi, chunki ular bir qatorli va faqat shu yerda kerak. Nolga bo'lish holati esa alohida xatti-harakat o'zgarishi: uni refaktoring commit'laridan alohida, o'z testi bilan kiritamiz.

## Qachon qo'llamaslik kerak

- **Testlarsiz katta extract.** Testlar yo'q va kod kritik bo'lsa (to'lovlar, hisob-kitoblar), avval characterization test yozing. Aks holda "refaktoring" xatti-harakatni o'zgartirishi mumkin va siz buni bilmaysiz.
- **Refaktoring va bug fix'ni aralashtirish.** Refaktoring paytida xato topsangiz, uni yozib qo'ying va alohida commit'da tuzating. Aks holda review va qaytarish qiyinlashadi.
- **Public API'ni inline qilish.** Boshqa paketlar yoki jamoalar ishlatadigan export qilingan funksiyani inline qilish ularning kodini buzadi. Bunday holda avval deprecated deb belgilang va parallel change (20-dars) qiling.
- **Faqat metrika uchun extract.** Linter "funksiya juda uzun" desa va siz faqat qatorlar sonini kamaytirish uchun `part1`, `part2` funksiyalarini yaratsangiz, bu sayoz modullar (21-dars). Agar nom topilmasa, extract qilmang.
- **Tez o'zgaradigan, hali tushunilmagan kod.** Prototip yoki domen hali shakllanmagan bo'lsa, chegaralarni erta qotirish noto'g'ri abstraksiyaga olib keladi (8-dars). Bir oz kuting, keyin naqsh ko'ringanda extract qiling.

## Stack'da: TypeScript, React, NestJS

- **TypeScript kompilyatori - xavfsizlik to'ri.** `strict` rejimda Extract Function'dan keyin yo'qolgan yoki noto'g'ri tipdagi o'zgaruvchilar darhol ko'rinadi. `any` ko'p bo'lgan kodda bu himoya yo'q, shuning uchun refaktoringdan oldin tiplarni kuchaytirish foydali (91-dars).
- **React: Extract Component va Extract Hook.** JSX bo'lagini komponentga chiqarish Extract Function'ning React versiyasi; state va effektlar guruhini custom hook'ga chiqarish ham shunday. Mexanika bir xil: qaysi props/state o'qiladi (parametrlar), qaysi biri o'zgaradi (callback yoki hook qaytaradigan qiymat). Teskari amal ham kerak: faqat props'ni uzatadigan "wrapper" komponentlarni inline qiling.
- **NestJS: private metodlar va service'lar.** Service metodidan private metod extract qilish arzon va xavfsiz. Uni yangi service'ga ko'chirish esa (Move Function) DI va modul importlarini o'zgartiradi, ya'ni alohida qadam. Faqat bitta metodni chaqiradigan "Helper" service'larni inline qilib, ularni ishlatadigan service'ga qaytaring.
- **Git.** `refactor:` prefiksli commit'lar (Conventional Commits, 39-dars) review'da strukturaviy o'zgarishlarni xatti-harakat o'zgarishlaridan ajratishga yordam beradi.

## Xulosa

- Extract Function va Inline Function bir-biriga teskari va ikkalasi ham oddiy, kundalik amal bo'lishi kerak. Bo'lish - qaytariladigan qaror.
- Extract mezoni - niyat va implementatsiyani ajratish: "nima"ni tushunish uchun "qanday"ni o'qishga to'g'ri kelsa, nomli funksiyaga chiqaring. Yaxshi nom topilmasa, extract qilmang.
- Inline - funksiya tanasi nomidek aniq bo'lganda yoki chalkash bo'linishni tuzatish uchun: avval hammasini inline qiling, keyin to'g'ri chegarada qayta extract qiling.
- Mexanikada eng nozik joy - lokal o'zgaruvchilar: o'qiladiganlari parametr, o'zgartiriladiganlari qaytariladigan qiymat.
- Kichik qadamlar, har biridan keyin test, alohida commit'lar; refaktoring va xatti-harakat o'zgarishini aralashtirmang.
