---
n: 4
slug: texnik-qarz
title: "Texnik qarz va sifatning iqtisodiyoti"
summary: "Texnik qarz metaforasi Ward Cunningham'dan keladi va ko'pincha noto'g'ri tushuniladi. Bu darsda metaforaning asl ma'nosini, Fowler'ning to'rt kvadrantini va eng muhimi - ichki sifat nega qimmat emas, balki arzon ekanini ko'ramiz. Maqsad: menejer bilan sifat haqida iqtisodiy tilda gaplasha olish."
duration: 35
sources:
  - id: cunningham-1992
    note: "OOPSLA '92 tajriba hisoboti, WyCASH+ tizimi: birinchi marta yozilgan kodni yetkazish qarzga kirishga o'xshaydi, foiz va qaytarmaslik xavfi haqidagi paragraf"
  - id: fowler-debt-quadrant
    note: "Prudent/reckless va deliberate/inadvertent o'qlari, Martin'ning \"mess is not debt\" pozitsiyasiga javob"
  - id: fowler-quality-cost
    note: "Ichki va tashqi sifat, cruft, funksionallik va vaqt pseudo-grafigi, State of DevOps dalillari va 2024 yilda qo'shilgan CodeScene tadqiqoti"
quiz:
  - q: "Cunningham'ning 1992 yildagi asl metaforasida \"qarzni qaytarish\" nimani anglatadi?"
    options:
      - "Kodni tushunganimizdan keyin uni qayta yozish (refaktoring) orqali dizaynni yangi tushunchaga moslashtirish"
      - "Xatolarni tuzatish uchun qo'shimcha dasturchi yollash"
      - "Mijozga muddat kechikkani uchun kompensatsiya to'lash"
      - "Barcha kodni boshqa tilga ko'chirish"
    answer: 0
    explain: "Cunningham uchun qarz - hali to'liq tushunilmagan yechimni yetkazish, qaytarish esa uni tezda qayta yozish. Xavf - qarzni qaytarmaslik: to'g'ri bo'lmagan kodga sarflangan har bir daqiqa foizga aylanadi."
  - q: "Jamoa layering, modullar nima ekanini bilmaydi va kodni bitta katta faylda yozmoqda. Fowler kvadrantida bu qaysi tur?"
    options:
      - "Prudent va deliberate"
      - "Prudent va inadvertent"
      - "Reckless va inadvertent"
      - "Bu qarz emas, chunki ongli qaror qabul qilinmagan"
    answer: 2
    explain: "Jamoa yaxshi dizaynni bilmaydi (inadvertent) va natija beparvo (reckless). Fowler buni ham qarz deb hisoblaydi. Oxirgi variant Martin'ning pozitsiyasiga yaqin, lekin Fowler unga qo'shilmaydi: uning uchun metafora tartibsizlik haqida gaplashishga ham yordam beradi."
  - q: "Fowler bo'yicha nega ichki sifat (internal quality) uchun tashqi sifatdagi kabi oddiy \"sifat yoki narx\" savdosi ishlamaydi?"
    options:
      - "Chunki foydalanuvchilar ichki sifatni ko'radi va u uchun pul to'laydi"
      - "Chunki ichki sifat faqat katta kompaniyalar uchun muhim"
      - "Chunki ichki sifatga sarflash hech qachon kechikishga olib kelmaydi"
      - "Chunki past ichki sifat bir necha hafta ichida yangi funksiyalarni sekinlashtiradi, shuning uchun yuqori sifat umumiy xarajatni kamaytiradi"
    answer: 3
    explain: "Fowler'ning asosiy argumenti: ichki sifat kelajakdagi o'zgarishlar narxini kamaytiradi. Tajribali dasturchilar fikricha, past sifat juda tez, bir necha hafta ichida sekinlashtiradi. Demak sifat va tezlik o'rtasidagi tanlov ko'pincha soxta."
  - q: "Mahsulot menejeri \"bu sprintda sifatga vaqt yo'q, keyin tuzatamiz\" deydi. Fowler'ning kvadrantiga ko'ra bu qaror qachon oqilona (prudent) bo'lishi mumkin?"
    options:
      - "Hech qachon, har qanday qarz yomon"
      - "Agar jamoa qarz nima ekanini va uni qaytarish narxini aniq tushunsa, muddat haqiqatan muhim bo'lsa (masalan, bozorga chiqish sanasi) va qaytarish rejasi bo'lsa"
      - "Har doim, chunki biznes muhimroq"
      - "Faqat kod frontend'da bo'lsa"
    answer: 1
    explain: "Prudent deliberate qarz - ongli savdo: hozirgi foyda qarz foizidan katta va qaytarish rejasi bor. Muammo shundaki, Fowler ta'kidlaganidek, odamlar dizayn foydasi qancha tez qaytishini past baholaydi va ko'p \"ongli qarzlar\" aslida reckless."
  - q: "Nima uchun \"texnik qarz\" ni aniq raqam bilan (masalan, \"bizda 340 soatlik qarz bor\") o'lchashga urinish ko'pincha chalg'ituvchi?"
    options:
      - "Chunki qarz har doim nolga teng"
      - "Chunki statik tahlil vositalari qarzni o'lchay olmaydi"
      - "Chunki cruft'ning narxi (foiz) qaysi kodga qanchalik tez-tez tegilishiga bog'liq, va kamdan-kam tegiladigan koddagi qarz amalda deyarli foizsiz"
      - "Chunki menejerlar raqamlarni yoqtirmaydi"
    answer: 2
    explain: "Fowler ta'kidlaydiki, metafora cruft'ni o'lchanadigan narsa kabi ko'rsatadi, lekin aslida uni o'lchash qiyin. Foiz faqat kod bilan ishlaganda to'lanadi, shuning uchun bir xil hajmdagi qarz turli joylarda juda turli narxga ega."
  - q: "Fowler 2024 yilda maqolaga qo'shgan Tornhill va Borg tadqiqotining asosiy natijasi qaysi?"
    options:
      - "Past sifatli kodda vazifalarni hal qilish ikki baravardan ko'p vaqt oladi va defekt zichligi ancha yuqori"
      - "Kod sifati va tezlik o'rtasida bog'liqlik topilmadi"
      - "Sifatli kod 10 baravar ko'p qator talab qiladi"
      - "Faqat test coverage defektlarga ta'sir qiladi"
    answer: 0
    explain: "Fowler keltirgan CodeScene tadqiqotida (39 ta yopiq kod bazasi) past sifatli kodda vazifalarni hal qilish ikki baravardan ko'p vaqt olgan va defektlar zichligi taxminan 15 baravar yuqori bo'lgan. Bu sifat va tezlik bir-biriga zid emasligi haqidagi argumentni qo'llaydi."
task:
  title: "Texnik qarz reyestri va qaror"
  prompt: |
    Siz transport parki platformasida ishlaysiz. Quyidagi `ReportService` har oy buxgalteriya uchun yoqilg'i hisobotini tayyorlaydi. Kod bir yil oldin "tezda" yozilgan va hozir har oy biror o'zgarish so'raladi (yangi ustun, yangi filtr, yangi format).

    1. Koddagi texnik qarz elementlarini toping. Har biri uchun Fowler kvadrantidagi ehtimoliy o'rnini va "foiz" qayerda to'lanayotganini (qaysi o'zgarishda qimmatga tushadi) yozing.
    2. Faqat eng yuqori foizli qarzni qaytaring: kodni shunday o'zgartiringki, keyingi oydagi tipik so'rov (yangi ustun qo'shish) bitta joyda bajarilsin. Qolganlarini ataylab qoldiring va nega qoldirganingizni bir jumlada yozing.
  lang: ts
  starter: |
    type FuelEvent = { vehicleId: string; plate: string; liters: number; pricePerLiter: number; at: Date };

    export class ReportService {
      buildMonthlyCsv(events: FuelEvent[], month: number, year: number): string {
        let csv = "Plate;Liters;Sum\n";
        const totals: Record<string, { plate: string; liters: number; sum: number }> = {};
        for (const e of events) {
          if (e.at.getMonth() + 1 !== month || e.at.getFullYear() !== year) continue;
          if (!totals[e.vehicleId]) totals[e.vehicleId] = { plate: e.plate, liters: 0, sum: 0 };
          totals[e.vehicleId].liters += e.liters;
          totals[e.vehicleId].sum += e.liters * e.pricePerLiter;
        }
        for (const id in totals) {
          const t = totals[id];
          csv += t.plate + ";" + t.liters.toFixed(2) + ";" + Math.round(t.sum) + "\n";
        }
        return csv;
      }
    }
  solution: |
    type FuelEvent = { vehicleId: string; plate: string; liters: number; pricePerLiter: number; at: Date };

    type VehicleFuelTotal = { plate: string; liters: number; costUzs: number };

    type CsvColumn = { header: string; value: (row: VehicleFuelTotal) => string };

    /** Hisobot ustunlari. Yangi ustun - shu ro'yxatga bitta element. */
    const MONTHLY_FUEL_COLUMNS: CsvColumn[] = [
      { header: "Plate", value: (r) => r.plate },
      { header: "Liters", value: (r) => r.liters.toFixed(2) },
      { header: "Sum", value: (r) => String(Math.round(r.costUzs)) },
    ];

    const CSV_SEPARATOR = ";";

    export class ReportService {
      buildMonthlyCsv(events: FuelEvent[], month: number, year: number): string {
        const rows = this.totalsByVehicle(events.filter((e) => isInMonth(e.at, month, year)));
        const header = MONTHLY_FUEL_COLUMNS.map((c) => c.header).join(CSV_SEPARATOR);
        const lines = rows.map((row) =>
          MONTHLY_FUEL_COLUMNS.map((c) => c.value(row)).join(CSV_SEPARATOR),
        );
        return [header, ...lines].join("\n") + "\n";
      }

      private totalsByVehicle(events: FuelEvent[]): VehicleFuelTotal[] {
        const totals = new Map<string, VehicleFuelTotal>();
        for (const e of events) {
          const total = totals.get(e.vehicleId) ?? { plate: e.plate, liters: 0, costUzs: 0 };
          total.liters += e.liters;
          total.costUzs += e.liters * e.pricePerLiter;
          totals.set(e.vehicleId, total);
        }
        return [...totals.values()];
      }
    }

    function isInMonth(date: Date, month: number, year: number): boolean {
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    }
  solutionNotes: |
    - Eng yuqori foiz ustunlarda edi: har oy yangi ustun so'raladi va asl kodda sarlavha va qiymat ikki xil joyda, string konkatenatsiyasi bilan yozilgan. Endi ustun sarlavhasi va qiymati bitta `CsvColumn` elementida, yangi ustun - bitta qator.
    - Agregatsiya alohida private metodga chiqdi, chunki u ustunlardan mustaqil o'zgaradi. `Record` va `for...in` o'rniga `Map` ishlatildi.
    - Ataylab qoldirilgan qarz: (1) vaqt zonasi - `getMonth()` server vaqt zonasiga bog'liq, bu haqiqiy xavf, lekin uni tuzatish biznes bilan kelishuv talab qiladi va alohida tiket bo'lishi kerak; (2) CSV escaping - davlat raqamlarida `;` yo'q, shuning uchun hozircha foizsiz; (3) pul uchun `number` - bu qarz, lekin `Money` tipiga o'tish (44-dars) butun modul uchun qaror.
    - Bu bo'lim "hammasini tozalash" emas, eng ko'p to'lanayotgan foizni qaytarish. Fowler'ning kvadrantidagi g'oya shu: qarzning narxi u bilan qanchalik tez-tez ishlashingizga bog'liq.
  checklist:
    - "Har bir qarz elementi uchun kvadrant va foiz to'lanadigan joy yozildi"
    - "Yangi ustun qo'shish bitta joyda bajariladi"
    - "Qoldirilgan qarzlar ro'yxati va sabablari bor"
    - "Hisobot natijasi eski kod bilan bir xil (bir xil kirishda bir xil CSV)"
    - "Vaqt zonasi kabi biznes qaror talab qiladigan masalalar jimgina o'zgartirilmadi"
---

## Muammo

"Texnik qarz" iborasi har bir jamoada eshitiladi, lekin turli ma'nolarda. Dasturchi uchun u ko'pincha "yomon kod" ning sinonimi. Menejer uchun "dasturchilar qayta yozmoqchi bo'lgan narsa". Natijada suhbat ikki tomonlama noqulaylikka aylanadi: dasturchi "bizda katta qarz bor, ikki sprint refaktoring kerak" deydi, menejer "foydalanuvchiga nima foyda?" deb so'raydi va ikkalasi ham haq.

Bu darsning maqsadi - metaforani uning asl ma'nosida tushunish va sifat haqida iqtisodiy tilda gapirishni o'rganish. Buning uchun uchta manbaga tayanamiz: metaforani o'ylab topgan Ward Cunningham, uni tasniflagan Martin Fowler va sifatning iqtisodiyoti haqidagi Fowler maqolasi.

## Asosiy g'oya

### Cunningham'ning asl ma'nosi

Ward Cunningham 1992 yilda OOPSLA konferensiyasida WyCASH+ portfel boshqaruv tizimi (Smalltalk'da yozilgan) haqida tajriba hisobotini taqdim etdi. Unda bir paragrafda metafora paydo bo'ladi. Uning mazmuni (o'z so'zlarimiz bilan): birinchi marta yozilgan kodni yetkazish qarzga kirishga o'xshaydi. Kichik qarz rivojlanishni tezlashtiradi, agar u tezda qayta yozish orqali qaytarilsa. Xavf qarzni qaytarmaslikda: to'liq to'g'ri bo'lmagan kodga sarflangan har bir daqiqa shu qarzning foizi hisoblanadi. Konsolidatsiya qilinmagan kod butun muhandislik tashkilotini to'xtatib qo'yishi mumkin.

Bu yerda muhim nuqta bor: Cunningham **beparvo kod yozishni** oqlamagan. Uning qarzi - o'sha paytdagi eng yaxshi tushunchani aks ettiruvchi kod, keyin tushuncha o'sganda esa qayta yozilishi kerak bo'lgan kod. Qarz - bu hali to'liq o'rganilmagan domen haqida bugungi bilim bilan yozilgan yechim. Qaytarish - yangi bilimni kodga qaytarish.

### Fowler'ning to'rt kvadranti

Martin Fowler 2009 yildagi "TechnicalDebtQuadrant" maqolasida "bu qarzmi yoki yo'qmi" degan bahsni boshqa savolga aylantiradi. U ikkita o'q taklif qiladi:

- **Prudent va reckless** (oqilona va beparvo): qarz ongli savdo natijasimi yoki shunchaki beparvolikmi.
- **Deliberate va inadvertent** (ongli va bexabar): jamoa qarzga kirayotganini biladimi.

Natijada to'rt holat (misollar mazmuni bo'yicha):

1. **Reckless + deliberate.** "Dizaynga vaqtimiz yo'q." Jamoa yaxshi yo'lni biladi, lekin "tez va iflos" ni tanlaydi. Fowler fikricha, bu odatda beparvo, chunki odamlar dizayn foydasi qancha tez qaytishini past baholaydi.
2. **Prudent + deliberate.** "Hozir chiqarishimiz kerak, oqibatlari bilan keyin shug'ullanamiz." Ongli qaror: muddat haqiqatan muhim va qaytarish narxi tushunilgan.
3. **Reckless + inadvertent.** Jamoa yaxshi dizayn amaliyotlarini bilmaydi va qanday tartibsizlik yaratayotganini sezmaydi.
4. **Prudent + inadvertent.** "Endi bilamiz, qanday qilish kerak edi." Kuchli jamoa ham loyiha davomida o'rganadi va bir yildan keyin eng yaxshi dizayn boshqacha bo'lishi kerak edi deb tushunadi. Fowler buni tabiiy va muqarrar deb hisoblaydi.

To'rtinchi kvadrant Cunningham'ning asl ma'nosiga eng yaqin. Bu muhim xulosa beradi: **eng yaxshi jamoada ham qarz bo'ladi**. Lekin bu oldini olsa bo'ladigan yomon kod qo'shishga bahona emas.

### Martin va Fowler bahsi

Fowler o'z maqolasida Robert Martin'ning pozitsiyasini ham keltiradi: Martin fikricha, yaxshi dizaynni bilmaydigan odamlar yozgan tartibsizlik qarz emas. Qarz atamasi faqat qisqa muddatli foyda uchun ongli ravishda barqaror bo'lmagan dizaynni tanlashga qo'llanishi kerak. Fowler bunga qo'shilmaydi: uning uchun tartibsizlik - beparvo qarz, va muhim savol "bu qarzmi?" emas, balki "metafora dizayn muammolari haqida o'ylash va gaplashishga yordam beradimi?". Ikkala pozitsiyaning ham mantig'i bor: Martin atamani aniq saqlamoqchi, Fowler uni foydali muloqot vositasi sifatida kengaytiradi.

## Chuqurroq: sifat qimmatmi?

Fowler 2019 yildagi "Is High Quality Software Worth the Cost?" maqolasida eng ko'p uchraydigan e'tirozga javob beradi: "sifat qimmat, biz esa tez chiqarishimiz kerak".

### Ichki va tashqi sifat

Fowler ikki xil sifatni ajratadi:

- **Tashqi sifat** - foydalanuvchi ko'radigan narsa: interfeys, xatolar soni, tezlik. Uning uchun to'lash mantiqan tushunarli, xuddi qimmatroq, lekin yaxshiroq mahsulot sotib olish kabi.
- **Ichki sifat** - arxitektura va kod tuzilmasi. Foydalanuvchi uni ko'rmaydi va farqini aniqlay olmaydi. Birinchi qarashda u uchun ortiqcha to'lash mantiqsiz.

Fowler'ning argumenti shundaki, ichki sifat bilan oddiy "sifat-narx" savdosi ishlamaydi. Past ichki sifat **cruft** (keraksiz chigallik) yig'adi: kodning hozirgi holati va ideal holati orasidagi farq. Cruft har bir yangi funksiyani sekinlashtiradi va xato ehtimolini oshiradi. Bu texnik qarz metaforasidagi foiz.

### Pseudo-grafik

Fowler "pseudo-grafik" chizadi: gorizontal o'qda vaqt, vertikalda yig'ilgan funksionallik. Past ichki sifatli loyiha tez boshlanadi, keyin sekinlashadi. Yuqori sifatli loyihada sekinlashish kamroq, kamdan-kam hollarda hatto tezlashish ham bo'ladi. U buni "pseudo" deb ataydi, chunki funksionallik va unumdorlikni ishonchli o'lchab bo'lmaydi.

Eng muhim savol: chiziqlar qachon kesishadi? Fowler aniq raqam bermaydi, lekin tajribali dasturchilar fikriga tayanib, past sifatli kod ularni **bir necha hafta ichida** sezilarli sekinlashtirishini aytadi. Bu oylar yoki yillar emas. Demak "keyin tozalaymiz" yondashuvi juda qisqa muddatli loyihalardan boshqa hamma joyda zararli.

### Dalillar

Fowler ikkita dalil manbasini keltiradi. Birinchisi - State of DevOps hisobotlari: ularga ko'ra eng yaxshi jamoalar production'ga kuniga ko'p marta deploy qiladi va shu bilan birga o'zgarishlar muvaffaqiyatsizligi darajasi past, tiklanish tez. Ya'ni tezlik va ishonchlilik bir-biriga zid emas. Ikkinchisi - 2024 yilda qo'shilgan Adam Tornhill va Markus Borg tadqiqoti (CodeScene, 39 ta yopiq kod bazasi): past sifatli kodda vazifalarni hal qilish ikki baravardan ko'p vaqt olgan va defektlar zichligi taxminan 15 baravar yuqori bo'lgan. Bu tadqiqotlar korrelyatsiyani ko'rsatadi, sababiyatni qat'iy isbotlamaydi, lekin yo'nalish izchil.

### Foiz qayerda to'lanadi

Texnik qarz metaforasining amaliy foydasi - **foiz** tushunchasi. Foiz faqat qarzli kod bilan ishlaganda to'lanadi. Fowler kvadrant maqolasida ham buni ta'kidlaydi: kamdan-kam tegiladigan koddagi qarzni qaytarish arzimasligi mumkin. Bu 3-darsdagi Ousterhout formulasi bilan bir xil: murakkablik u bilan ishlash vaqtiga ko'paytiriladi. Shuning uchun qarzni "umumiy hajm" bilan emas, **qaysi kodga qanchalik tez-tez tegilishi** bilan baholang. Git tarixidagi o'zgarish chastotasi (churn) va murakkablikni birga ko'rish yaxshi signal beradi.

## Misol: "keyin tuzatamiz"

Ijara platformasida birinchi versiya uchun narx hisoblash shunday yozilgan:

```ts
export function rentPrice(days: number, dailyRate: number, promo?: string): number {
  let price = days * dailyRate;
  if (promo === "SUMMER") price *= 0.9;
  if (promo === "VIP" || days > 30) price *= 0.8;
  return Math.round(price);
}
```

Bu prudent deliberate qarz bo'lishi mumkin edi: MVP, ikkita promo-kod, ishga tushirish sanasi bor. Lekin olti oydan keyin promo-kodlar 14 ta, ularning ba'zilari birga qo'llanmaydi va marketing har hafta yangisini so'raydi. Har bir o'zgarish shu funksiyaga yangi `if` qo'shadi, va hech kim kombinatsiyalarning to'g'riligiga ishonmaydi. Foiz har hafta to'lanmoqda.

Qarzni qaytarish - promo qoidalarini ma'lumotga aylantirish va kombinatsiya qoidasini bitta joyga yig'ish:

```ts run
type Promo = {
  code: string;
  discountRate: number;
  /** true bo'lsa, boshqa chegirmalar bilan birga qo'llanmaydi. */
  exclusive: boolean;
};

type RentQuote = { days: number; dailyRateUzs: number; promo?: Promo };

const LONG_RENT_DAYS = 30;
const LONG_RENT_DISCOUNT = 0.2;

export function calculateRentPrice({ days, dailyRateUzs, promo }: RentQuote): number {
  const base = days * dailyRateUzs;
  const discounts = applicableDiscounts(days, promo);
  const multiplier = discounts.reduce((m, rate) => m * (1 - rate), 1);
  return Math.round(base * multiplier);
}

function applicableDiscounts(days: number, promo?: Promo): number[] {
  const longRent = days > LONG_RENT_DAYS ? [LONG_RENT_DISCOUNT] : [];
  if (!promo) return longRent;
  if (promo.exclusive) return [promo.discountRate];
  return [...longRent, promo.discountRate];
}

// Sinab ko'ring: kunlar soni va promo-kodni o'zgartiring.
const summer: Promo = { code: "SUMMER", discountRate: 0.1, exclusive: false };
const vip: Promo = { code: "VIP", discountRate: 0.2, exclusive: true };
console.log(calculateRentPrice({ days: 5, dailyRateUzs: 300_000 }));
console.log(calculateRentPrice({ days: 40, dailyRateUzs: 300_000, promo: summer }));
console.log(calculateRentPrice({ days: 40, dailyRateUzs: 300_000, promo: vip }));
```

Bu yerda biz promo-kodlarni bazaga chiqarmadik, qoidalar dvigatelini qurmadik. Faqat foiz to'lanayotgan joyni tuzatdik: yangi promo - ma'lumot, kombinatsiya qoidasi - bitta funksiya. Agar marketing ertaga "promo faqat dam olish kunlari" desa, bu yangi qarz bo'ladi va uni o'shanda hal qilamiz (9-dars, YAGNI).

E'tibor bering: asl kodda `"VIP" || days > 30` ikkala holatda ham bir xil chegirma berardi va `SUMMER` bilan birga qo'llanardi. Yangi kodda bu xatti-harakat `Promo` ma'lumotlariga bog'liq. Refaktoringdan oldin biznesdan aniq qoidani so'rash va eski xatti-harakatni test bilan qayd qilish shart: qarzni qaytarish jimgina xatti-harakatni o'zgartirishga aylanmasligi kerak.

## Qachon qo'llamaslik kerak

- **Metaforani bahona qilish.** "Bu texnik qarz, keyin qaytaramiz" iborasi ko'pincha reckless kodni oqlash uchun ishlatiladi. Agar qaytarish rejasi va sanasi bo'lmasa, bu qarz emas, shunchaki past sifat.
- **Hammasini qaytarishga urinish.** Kamdan-kam o'zgaradigan modul qarzini qaytarish ko'pincha foydasiz. Har doim "foiz qayerda to'lanadi?" deb so'rang.
- **Haqiqatan qisqa umrli kod.** Bir martalik migratsiya skripti, tashlab yuboriladigan prototip, demo. Bu yerda Fowler'ning "bir necha hafta" chegarasiga yetib bormaysiz. Lekin prototip production'ga o'tsa, qarz darhol foiz to'lashni boshlaydi.
- **Qarzni raqam bilan sotish.** "Bizda 340 soatlik qarz bor" kabi aniq raqamlar ishonchsiz va menejerda noto'g'ri tasavvur uyg'otadi. Konkret misol yaxshiroq ishlaydi: "promo-kod qo'shish 2 kun oladi, tuzatgandan keyin 1 soat".
- **Qarzni texnik masala deb ko'rish.** Ko'p qarz texnik emas, balki noaniq talablar yoki domenni noto'g'ri tushunish natijasi. Ularni kod bilan emas, avval suhbat bilan hal qilish kerak.

## Stack'da: NestJS, Next.js, jamoa jarayoni

- **Qarzni ko'rinadigan qilish.** Koddagi `// TODO` emas, tiket tizimida egasi va sababi bilan yozuv. Kod ichida faqat qisqa ishora: `// TODO(FLEET-412): vaqt zonasini hisobga olish`. Komment turlari haqida 32-darsda.
- **ESLint va TypeScript'dagi "vaqtinchalik" o'chirishlar.** `// eslint-disable-next-line` va `// @ts-expect-error` ham qarz. Ularni sababi bilan yozing va vaqti-vaqti bilan sanab turing.
- **NestJS'da qarz yig'iladigan joylar.** Hammasini qiladigan `CommonModule`, ichida o'nlab metodli `UtilsService`, global interceptor'lardagi maxsus holatlar. Bular inadvertent qarzning tipik shakllari.
- **Next.js'da.** Hamma joyda `"use client"`, server komponentlarida keraksiz `fetch` keshlash sozlamalari, `any` bilan yozilgan server action'lar. Ularni yangi feature yozganda atrofdagi kodni yaxshilash orqali qaytarish qulay (6-dars).
- **Tarix va churn.** `git log --format= --name-only | sort | uniq -c | sort -rn | head` kabi buyruq eng ko'p o'zgargan fayllarni ko'rsatadi. Qarz qaytarishni shu ro'yxatning yuqorisidan boshlang.

## Xulosa

- Cunningham'ning asl metaforasi: bugungi tushuncha bilan yozilgan kodni yetkazish qarz, uni yangi tushuncha bilan qayta yozish qaytarish. Xavf qaytarmaslikda.
- Fowler'ning kvadranti ikki o'q beradi: prudent/reckless va deliberate/inadvertent. Eng yaxshi jamoada ham prudent inadvertent qarz bo'ladi.
- Martin va Fowler "tartibsizlik qarzmi" degan savolda kelishmaydi. Amaliy tomondan muhimi - metafora muloqotga yordam beradimi.
- Fowler bo'yicha ichki sifat uchun to'lov oqlanadi: past sifat bir necha hafta ichida sekinlashtiradi, demak sifat va tezlik o'rtasidagi tanlov ko'pincha soxta.
- Qarzni hajm bilan emas, foiz bilan baholang: foiz faqat kod bilan ishlaganda to'lanadi.
