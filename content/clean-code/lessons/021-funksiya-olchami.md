---
n: 21
slug: funksiya-olchami
title: "Funksiya o'lchami: kichik va chuqur - ikki maktab"
summary: "Martin funksiyalarni juda kichik qilishni tavsiya qiladi, Ousterhout esa interfeysi sodda, ichi boy \"chuqur\" funksiyalarni afzal ko'radi. Bu darsda ikkala maktabni, ularning 2024-2025 yillardagi ochiq munozarasini va PrimeGenerator epizodini ko'rib, amaliy mezon chiqaramiz."
duration: 40
sources:
  - id: cc1
    note: "3-bob \"Functions\": \"Small!\" bo'limi va funksiya uzunligi bo'yicha tavsiyalar; 10-bobdagi PrimeGenerator listingi"
  - id: cc2
    note: "Qayta yozilgan nashrdagi funksiyalar haqidagi boblar: Martinning o'zi aytishicha, haddan tashqari bo'lish masalasida muvozanatliroq"
  - id: aposd
    note: "\"Modules Should Be Deep\" bobi va kodni birlashtirish yoki ajratish (\"Better Together or Better Apart?\") haqidagi bob"
  - id: aposd-vs-cc
    note: "Metod uzunligi, \"One Thing\" qoidasi, entanglement va PrimeGenerator bo'limlari"
quiz:
  - q: "Ousterhoutning \"chuqur\" funksiya tushunchasi nimani bildiradi?"
    options:
      - "Ichma-ich ko'p darajali if bloklari bor funksiya"
      - "Rekursiv chaqiriladigan funksiya"
      - "Sodda interfeys orqasida ko'p funksionallikni yashiradigan funksiya"
      - "50 qatordan uzun har qanday funksiya"
    answer: 2
    explain: "Chuqurlik uzunlik bilan emas, interfeys narxi va yashirilgan foyda nisbati bilan o'lchanadi. Uzun funksiya ham sayoz bo'lishi mumkin, agar uning parametrlari va shartlari ichidagi ish kabi murakkab bo'lsa. Ichma-ichlik va rekursiya bu tushunchaga aloqasiz."
  - q: "Munozarada Ousterhout PrimeGenerator kodidagi qaysi muammoni eng jiddiy deb ko'rsatdi?"
    options:
      - "Metodlar bir-biriga chalkashgan (entangled) va predikatga o'xshash nomli metod yashirin holatni o'zgartiradi"
      - "Kod Java'da yozilgani"
      - "Metodlar private emas, public bo'lgani"
      - "Kodda unit testlar yo'qligi"
    answer: 0
    explain: "Ousterhout metodlar bir-birisiz tushunilmasligini va nomi so'roqqa o'xshagan metod umumiy static holatni o'zgartirishini ta'kidladi. Martin ham bu yashirin side effect'ni tashvishli deb tan oldi. Til va testlar munozaraning markazida bo'lmagan."
  - q: "Martin \"bitta ish\" qoidasini qanday operatsion mezon bilan ifodalaydi?"
    options:
      - "Funksiya 4 qatordan oshmasa, u bitta ish qiladi"
      - "Undan ma'noli nomli kichikroq funksiyani ajratib olish mumkin bo'lsa, u bir nechta ish qilyapti"
      - "Funksiyada bitta return bo'lsa, u bitta ish qiladi"
      - "Funksiya faqat bitta parametr olsa, u bitta ish qiladi"
    answer: 1
    explain: "Martinning mezoni: agar funksiyadan uning amalini shunchaki takrorlamaydigan nomli funksiya ajratib bo'lsa, u bir nechta ish qilyapti. Ousterhout aynan shu mezonni chegarasiz deb tanqid qildi: deyarli har qanday kodga u qo'llanadi."
  - q: "Jamoada \"funksiya 20 qatordan oshmasin\" degan lint qoidasi kiritilmoqchi. Darsdagi xulosalarga ko'ra eng to'g'ri munosabat qaysi?"
    options:
      - "Qo'llab-quvvatlash: Martin aynan shu raqamni qat'iy qoida sifatida bergan"
      - "Rad etish: uzun funksiyalar har doim yaxshiroq"
      - "Raqamni 5 ga tushirish kerak"
      - "Uzunlikni signal sifatida ishlatish, lekin asosiy mezon interfeys sodda va tushunish uchun boshqa funksiyani o'qish shart emasligi"
    answer: 3
    explain: "Uzunlik code review uchun foydali signal, lekin maqsad emas. Ikkala muallif ham haddan tashqari bo'lish mumkinligiga kelishdi. Martin o'zi tavsiyalarini qat'iy qonun emas, mulohaza uchun deb atagan."
  - q: "Martin \"ko'proq bo'lish tomonga xato qilgan ma'qul\" degan pozitsiyasini qanday asoslaydi?"
    options:
      - "Ajratilgan funksiyalar tezroq ishlaydi"
      - "Ajratilgan funksiya foydasiz chiqsa, uni har doim qayta inline qilish mumkin"
      - "Kompilyator kichik funksiyalarni yaxshiroq optimallashtiradi"
      - "Testlar faqat kichik funksiyalar uchun yoziladi"
    answer: 1
    explain: "Martinning dalili: extract arzon va qaytariladigan amal. Ousterhout bunga javoban amalda kam odam qaytadan inline qilishini va sayoz funksiyalar o'z narxiga ega ekanini aytadi. Performance va testlar bu yerda asosiy dalil emas."
  - q: "PrimeGenerator epizodida Martinning qayta yozilgan versiyasida Ousterhout qaysi muammoni topdi?"
    options:
      - "Kod kompilyatsiya bo'lmadi"
      - "Kodda kommentlar haddan ko'p edi"
      - "Bitta siklni ikkiga bo'lish natijasida sezilarli sekinlashuv paydo bo'ldi"
      - "Kod noto'g'ri tub sonlarni qaytardi"
    answer: 2
    explain: "Ousterhout Martin versiyasining interfeyslarini tozaroq deb baholadi, lekin siklni bo'lish bir necha barobar sekinlashuvga olib kelganini ko'rsatdi. Martin xatoni tan olib, sikllarni qayta birlashtirdi."
task:
  title: "Sayoz bo'laklarni chuqur funksiyaga yig'ish"
  prompt: |
    Quyidagi kod transport parkida yoqilg'i quyish hodisalarini aniqlaydi. U "kichik funksiyalar" uslubida yozilgan, lekin uni o'qish uchun beshta funksiya bo'ylab sakrash kerak va ulardan biri yashirin holatni o'zgartiradi.

    1. Qaysi funksiyalar sayoz (interfeysi ichidan murakkab yoki deyarli teng) ekanini va qaysi biri yashirin side effect'ga ega ekanini aniqlang.
    2. Kodni shunday qayta yozingki, tashqi interfeys bitta sodda funksiya bo'lsin, yashirin modul darajasidagi holat qolmasin.
    3. Haqiqatan mustaqil ma'noga ega qismni (masalan, bitta hodisani hisoblash) alohida qoldirish yoki qoldirmaslik haqida qaror qabul qiling va uni izohlang.
  lang: ts
  starter: |
    type FuelReading = { at: Date; liters: number };
    type RefuelEvent = { at: Date; addedLiters: number };

    let lastLevel = 0;
    const events: RefuelEvent[] = [];

    const THRESHOLD = 15;

    function delta(r: FuelReading): number {
      return r.liters - lastLevel;
    }

    function isRefuel(r: FuelReading): boolean {
      const d = delta(r);
      lastLevel = r.liters;
      return d >= THRESHOLD;
    }

    function record(r: FuelReading, added: number): void {
      events.push({ at: r.at, addedLiters: added });
    }

    function handle(r: FuelReading): void {
      const before = lastLevel;
      if (isRefuel(r)) record(r, r.liters - before);
    }

    export function detectRefuels(readings: FuelReading[]): RefuelEvent[] {
      lastLevel = readings[0]?.liters ?? 0;
      events.length = 0;
      readings.slice(1).forEach(handle);
      return [...events];
    }
  solution: |
    type FuelReading = { at: Date; liters: number };
    type RefuelEvent = { at: Date; addedLiters: number };

    /** Ketma-ket ikki o'lchov orasida shuncha litrdan ko'p o'sish - quyish deb hisoblanadi. */
    const MIN_REFUEL_LITERS = 15;

    /**
     * Sensor o'lchovlaridan yoqilg'i quyish hodisalarini topadi.
     * O'lchovlar vaqt bo'yicha tartiblangan deb faraz qilinadi.
     */
    export function detectRefuels(
      readings: readonly FuelReading[],
      minRefuelLiters: number = MIN_REFUEL_LITERS,
    ): RefuelEvent[] {
      const events: RefuelEvent[] = [];

      for (let i = 1; i < readings.length; i++) {
        const previous = readings[i - 1];
        const current = readings[i];
        const added = current.liters - previous.liters;

        if (added >= minRefuelLiters) {
          events.push({ at: current.at, addedLiters: added });
        }
      }

      return events;
    }
  solutionNotes: |
    - `delta`, `record`, `handle` sayoz edi: ularning nomi va imzosi ichidagi bitta qatordan ko'p narsa aytmasdi, lekin o'quvchini sakrashga majbur qilardi.
    - `isRefuel` eng xavflisi edi: nomi predikat, lekin u `lastLevel`ni o'zgartirardi. Uni ikki marta chaqirish natijani buzardi. Bu PrimeGenerator'dagi muammoning aynan o'zi.
    - Modul darajasidagi `lastLevel` va `events` olib tashlandi. Endi funksiya qayta kiriladigan (reentrant) va testda izolyatsiya muammosi yo'q.
    - Natija bitta chuqur funksiya: interfeys sodda (o'lchovlar kiradi, hodisalar chiqadi), ichida esa butun algoritm bir joyda ko'rinadi. 15 qatorli sikl o'qish uchun beshta funksiyadan osonroq.
    - Hisoblashni alohida funksiyaga ajratmadik, chunki u bir qatorli ayirma va undan mustaqil ma'no chiqmaydi. Agar quyishni aniqlash qoidasi murakkablashsa (sensor shovqini, vaqt oynasi), uni alohida nomli funksiyaga ajratish o'rinli bo'ladi.
  checklist:
    - "Modul darajasidagi o'zgaruvchan holat qolmadi"
    - "Nomi so'roqqa o'xshagan funksiya holatni o'zgartirmaydi"
    - "Algoritmni tushunish uchun bitta funksiyani o'qish yetarli"
    - "Chegara qiymati nomlangan va kerak bo'lsa parametr orqali beriladi"
    - "Eski kod bilan bir xil kirishda bir xil natija chiqishini tekshirdim"
---

## Muammo

Code review'da ikki xil izoh tez-tez uchraydi. Biri: "Bu funksiya 80 qator, uni bo'laklarga ajrating." Ikkinchisi: "Bu yerda nima bo'layotganini tushunish uchun 7 ta faylni ochishim kerak bo'ldi." Ikkala izoh ham haqli bo'lishi mumkin va ular bir-biriga zid yo'nalishga tortadi.

Funksiya o'lchami - toza kod bo'yicha eng ko'p bahs bo'ladigan mavzulardan biri. Sababi shundaki, ikkala xato ham real va qimmat. Uzun funksiya o'quvchidan bir vaqtning o'zida ko'p narsani boshda saqlashni talab qiladi. Haddan tashqari maydalangan kod esa o'quvchini funksiyalar orasida sakrashga majbur qiladi va har bir sakrashda kontekst yo'qoladi. Bu darsda ikkala maktabni ko'ramiz va ular orasida tanlash uchun aniq mezon chiqaramiz.

## Asosiy g'oya

### Martin: funksiyalar kichik bo'lsin

*Clean Code* kitobining funksiyalar haqidagi bobi shu jumla bilan boshlanadi: "The first rule of functions is that they should be small." Martin funksiyalar 20 qatorga deyarli yetmasligi kerakligini va ideal holda bir necha qatordan iborat bo'lishini yozadi. `if`, `else`, `while` bloklari ichida esa bitta qator, odatda boshqa funksiyaga chaqiruv bo'lishini tavsiya qiladi. Shunda har bir funksiya nomi o'quvchiga hikoyaning bitta qadamini aytadi va kod yuqoridan pastga o'qiladigan matnga aylanadi.

Bu yondashuv ortidagi g'oya: nom - eng arzon abstraksiya. Agar kod bo'lagini ma'noli nom bilan funksiyaga chiqarsangiz, o'quvchi uning ichiga kirmasdan nima qilishini biladi. Martin buni "bitta ish" qoidasi bilan bog'laydi (22-dars): funksiyadan ma'noli nomli kichikroq funksiya ajratib olish mumkin bo'lsa, demak u bir nechta ish qilyapti.

### Ousterhout: funksiyalar chuqur bo'lsin

John Ousterhout *A Philosophy of Software Design* kitobida boshqa o'lchov taklif qiladi. Uning uchun modul (funksiya, klass, servis) ikki qismdan iborat: **interfeys** (chaqiruvchi bilishi kerak bo'lgan hamma narsa) va **implementatsiya** (ichki ish). Yaxshi modul **chuqur**: sodda interfeys orqasida ko'p funksionallikni yashiradi. Yomon modul **sayoz**: uning interfeysi ichidagi ish bilan deyarli bir xil murakkab, demak u o'quvchidan hech narsani yashirmaydi, aksincha, yana bitta nom va bitta sakrash qo'shadi.

Ousterhoutning xulosasi: funksiyani bo'lish o'z-o'zidan yaxshi emas. Har bir yangi funksiya yangi interfeys qo'shadi va bu interfeys o'rganilishi kerak. Agar bo'lish natijasida har bir bo'lak orqasidagi yashirilgan ish kamaysa va interfeyslar ko'paysa, umumiy murakkablik oshadi. U ayniqsa **entanglement** (kitobda "conjoined", ya'ni bir-biriga yopishgan) deb ataydigan holatdan ogohlantiradi: bitta funksiyani tushunish uchun boshqasining ichini o'qish kerak bo'lsa, ular aslida bitta funksiya bo'lishi kerak edi.

## Chuqurroq: 2024-2025 yillardagi munozara

Ousterhout va Martin bu masalani ochiq yozma munozarada muhokama qilishdi (`aposd-vs-cc` manbasi, GitHub'da ochiq). Bu kamdan-kam uchraydigan holat: ikki muallif bitta kod ustida o'z fikrlarini to'g'ridan-to'g'ri solishtiradi.

### "Bitta ish" qoidasiga e'tiroz

Ousterhout "bitta ish" tushunchasini noaniq deb hisoblaydi: deyarli har qanday ikki qatorli kodni "ikki ish" deb talqin qilish mumkin, demak qoidada to'xtash nuqtasi yo'q. U bir-biriga chambarchas bog'liq qadamlarni, masalan, lock olish va critical section'ni bajarishni, birga saqlash kerakligini aytadi. Martin esa ularni ajratishni afzal ko'rishini, lekin mulohaza (judgment) kerakligini tan oldi. U ko'proq bo'lish tomonga xato qilishni ma'qul ko'radi, chunki ajratilgan funksiya foydasiz chiqsa, uni har doim qayta inline qilish mumkin.

Munozarada `clearTotals` misoli ham ko'rildi: ikkita o'zgaruvchini nolga tenglaydigan ikki qatorli metod. Martin buni "initsializatsiya" degan bitta tushuncha sifatida ajratishni to'g'ri deb hisobladi. Ousterhout esa bu o'zgaruvchilar bitta tushuncha ekaniga shubha qildi va inline versiyani aniqroq deb topdi. Martin keyinroq bunday qarorlarni qanday qabul qilishni kitobda yetarli tushuntirmaganini tan oldi va ikkinchi nashrda bu masalada muvozanatliroq yozganini aytdi.

Martin yana bir muhim izoh berdi: kitobdagi "2-4 qator" raqamlari bitta konkret dasturdan olingan va kitobning o'zida tavsiyalar qat'iy qonun emas, mulohaza uchun ekani aytilgan.

### PrimeGenerator epizodi

Munozaraning eng ibratli qismi - *Clean Code*ning klasslar haqidagi bobidagi `PrimeGenerator` misoli. Martin uni Knuth'ning literate programming namunasidan olib, katta metodni klasslarga bo'lishni ko'rsatish uchun ishlatgan. Natijada static maydonlari va sakkizta kichik metodi bor, kommentsiz klass hosil bo'lgan.

Ousterhoutning tanqidi bir necha nuqtadan iborat edi:

- **Metodlar chalkashgan.** Bir predikat ikkinchisiga, u esa uchinchisiga tayanadi. Bittasini tushunish uchun hammasini birdaniga boshda saqlash kerak.
- **Yashirin side effect.** Nomi so'roqqa (predikatga) o'xshagan metod aslida umumiy static holatni o'zgartiradi va kod faqat ma'lum o'zgaruvchi hech qachon kamaymasa to'g'ri ishlaydi. Bu shart hech qayerda yozilmagan.
- **Nomlar tushunarsiz.** Juda uzun, lekin algoritmni tushuntirmaydigan nomlar.
- **Kommentlar yo'q.** O'quvchi algoritmni o'zi qaytadan tiklashi kerak.

Ousterhout o'z variantini yozdi: bitta `generate` metodi, lokal massivlar va algoritmning nozik joylarini (nega har bir tub sonning karralilari uning kvadratidan boshlanadi) tushuntiradigan batafsil kommentlar. Martin bu variantni Knuth'nikidan ham, o'zinikidan ham ancha yaxshi deb baholadi, lekin ba'zi kommentlarni (shu jumladan, bitta noto'g'ri kommentni) va label'li `continue`ni tanqid qildi.

Keyin Martin o'zining qayta yozilgan versiyasini taqdim etdi. Ousterhout uning interfeyslarini tozaroq deb topdi, lekin bitta siklni ikkiga bo'lish natijasida kod bir necha barobar sekinlashganini ko'rsatdi. Martin xatoni tan olib, sikllarni birlashtirdi. Umuman olganda, Martin bu algoritm uchun asl bo'lish muammoli bo'lganini, yashirin side effect tashvishli ekanini va 18 yildan keyin o'z nomlari unga ham yordam bermaganini tan oldi.

Epizodning saboqi: kichik funksiyalar o'z-o'zidan tushunarlilik bermaydi. Ousterhout ta'kidlaganidek, bu kodda metodlarning kichikligi muhim emas edi, muhimi tushunarlilik va to'g'rilik edi.

### Kelishilgan va kelishilmagan nuqtalar

Ikkala muallif kelishgan narsalar: modulli dizayn qimmatli; haddan tashqari bo'lish mumkin; *Clean Code* uni qanday aniqlash bo'yicha kam yo'l-yo'riq beradi; PrimeGenerator'ning ichki bo'linishi muammoli edi. Kelishilmagan narsalar: qancha bo'lish kerak, "bitta ish" qoidasi ishlaydimi, funksiyalarni chaqiruv tartibida joylashtirish entanglement'ni yengillashtiradimi. Martin tartib yordam beradi deb hisoblaydi, Ousterhout esa chalkashgan metodlarni hech qanday tartib tuzatmaydi deydi.

## Misol: sayoz bo'laklar va chuqur funksiya

To'lov servisida "kichik funksiyalar" uslubida yozilgan kod:

```ts
type Payment = { id: string; amount: number; currency: "UZS" | "USD"; status: "pending" | "paid" | "failed" };

let total = 0;

function isPaid(p: Payment): boolean {
  return p.status === "paid";
}

function toUzs(p: Payment, usdRate: number): number {
  return p.currency === "USD" ? p.amount * usdRate : p.amount;
}

function accumulate(p: Payment, usdRate: number): void {
  total += toUzs(p, usdRate);
}

function reset(): void {
  total = 0;
}

export function paidTotalInUzs(payments: Payment[], usdRate: number): number {
  reset();
  payments.filter(isPaid).forEach((p) => accumulate(p, usdRate));
  return total;
}
```

Bu yerda beshta funksiya bor, lekin `accumulate` va `reset` sayoz: ular hech narsani yashirmaydi, faqat modul darajasidagi `total`ni boshqaradi. Bundan ham yomoni, `paidTotalInUzs` ikki joydan parallel chaqirilsa (masalan, async kod ichida), natija buziladi. Chuqur versiya:

```ts run
type Currency = "UZS" | "USD";
type Payment = { id: string; amount: number; currency: Currency; status: "pending" | "paid" | "failed" };

export function paidTotalInUzs(payments: readonly Payment[], usdRate: number): number {
  return payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + toUzs(p.amount, p.currency, usdRate), 0);
}

function toUzs(amount: number, currency: Currency, usdRate: number): number {
  return currency === "USD" ? amount * usdRate : amount;
}

// Sinab ko'ring: dollar kursini yoki to'lov holatlarini o'zgartiring.
const payments: Payment[] = [
  { id: "1", amount: 150_000, currency: "UZS", status: "paid" },
  { id: "2", amount: 20, currency: "USD", status: "paid" },
  { id: "3", amount: 99_000, currency: "UZS", status: "failed" },
];
console.log(paidTotalInUzs(payments, 12_800));
```

Nima o'zgardi:

- **Yashirin holat yo'qoldi.** Funksiya endi sof (25-dars) va qayta chaqirish xavfsiz.
- **Sayoz funksiyalar inline qilindi.** `isPaid` va `accumulate` o'z nomidan ko'p narsa bermasdi.
- **Bitta funksiya qoldi.** `toUzs` mustaqil ma'noga ega (valyuta konvertatsiyasi), boshqa joylarda kerak bo'lishi ehtimoli bor va uni tushunish uchun chaqiruvchini o'qish shart emas. Bu ajratishning to'g'ri mezoni.

## Qachon qo'llamaslik kerak

Ikkala maktabning ham ko'r-ko'rona qo'llanishi zarar keltiradi:

- **"Kichik"ni qat'iy raqamga aylantirish.** "Har bir funksiya 5 qatordan oshmasin" degan lint qoidasi PrimeGenerator kabi kodga olib keladi: ko'p nom, kam ma'no. Uzunlik - signal, maqsad emas.
- **"Chuqur"ni uzun funksiyani oqlash uchun ishlatish.** Ousterhout uzun funksiyalarni yozishga ruxsat bermaydi. U chuqur modul haqida gapiradi: sodda interfeys. 300 qatorli controller metodi, ichida validatsiya, biznes qoida, SQL va HTTP javob aralashib ketgan bo'lsa, u chuqur emas, shunchaki chalkash. Bunday kodda turli abstraksiya darajalari aralashgan (22-dars) va uni bo'lish kerak.
- **Sof algoritm kodi.** Matematik yoki parsing algoritmlarida qadamlar bir-biriga chambarchas bog'liq. Ularni bo'lish ko'pincha umumiy holatni parametrlar yoki maydonlar orqali tashishga majbur qiladi. Bunday kodni bitta funksiyada saqlab, yaxshi kommentlar bilan tushuntirish odatda yaxshiroq.
- **Performance-kritik joylar.** PrimeGenerator epizodi ko'rsatganidek, bo'lish ba'zan algoritmni o'zgartirib yuboradi (bitta sikl ikkitaga aylanadi). Refaktoringdan keyin o'lchang (99-dars).

## Stack'da: NestJS va React

- **NestJS service metodlari.** Service'ning public metodlari chuqur bo'lishi kerak: `orderService.checkout(cartId, userId)` tranzaksiya, zaxira tekshiruvi va to'lovni yashiradi. Controller'dan service'ga, undan `OrderHelper`ga, undan `OrderUtils`ga o'tadigan va har bir qatlam faqat argumentni uzatadigan zanjir - pass-through metodlarning klassik misoli. Bunday qatlamlarni olib tashlang.
- **Private yordamchilar.** Klass ichidagi private metodlar interfeys narxini kamroq qo'shadi, chunki tashqi chaqiruvchi ularni ko'rmaydi. Shuning uchun murakkab public metodni bir nechta private metodga bo'lish odatda xavfsizroq, lekin entanglement qoidasi ularga ham tegishli.
- **React komponentlari.** Komponentni har bir `div` uchun alohida komponentga bo'lish ham sayoz modul muammosini beradi: props drilling ko'payadi va o'quvchi daraxt bo'ylab sakraydi. Komponentni o'z state'i, mustaqil ma'nosi yoki qayta ishlatilishi bo'lsa ajrating.
- **Custom hook'lar.** `useVehicleTelemetry(vehicleId)` kabi hook chuqur modulning yaxshi namunasi: subscribe, reconnect va cleanup yashirin, interfeys esa bitta argument.

## Xulosa

- Martin kichik funksiyalarni, Ousterhout chuqur modullarni afzal ko'radi. Ikkalasi ham murakkablikni kamaytirishni maqsad qiladi, lekin turli xatolarni ko'proq xavfli deb hisoblaydi.
- Asosiy savol uzunlik emas: funksiyani tushunish uchun boshqa funksiyaning ichini o'qish kerakmi va uning interfeysi yashirgan ishidan soddami.
- 2024-2025 yillardagi munozarada ikkala muallif haddan tashqari bo'lish mumkinligiga va PrimeGenerator'ning bo'linishi muammoli ekaniga kelishdi.
- Nomi so'roqqa o'xshagan, lekin holatni o'zgartiradigan kichik funksiya uzun funksiyadan xavfliroq.
- Uzunlikni review signali sifatida ishlating, qaror esa entanglement, interfeys narxi va mustaqil ma'no asosida qabul qilinsin.
