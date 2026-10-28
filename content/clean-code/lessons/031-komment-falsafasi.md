---
n: 31
slug: komment-falsafasi
title: "Komment falsafasi: Martin va Ousterhout"
summary: "Komment - kodning muvaffaqiyatsizligi belgisimi yoki dizaynning ajralmas qismi? Bu darsda Robert Martin va John Ousterhoutning qarama-qarshi pozitsiyalarini, ular kelishgan va kelisha olmagan nuqtalarni ko'rib chiqamiz va amaliy mezon chiqaramiz: komment kod ifodalay olmaydigan ma'lumotni beradimi."
duration: 35
sources:
  - id: cc1
    note: "Kommentlar haqidagi bob: kommentni kodning ifoda qila olmaganini qoplash deb ko'rish, yaxshi va yomon kommentlar ro'yxati"
  - id: aposd
    note: "Kommentlar haqidagi boblar: \"Why Write Comments? The Four Excuses\" va \"Comments Should Describe Things that Aren't Obvious from the Code\""
  - id: aposd-vs-cc
    note: "Munozaraning kommentlar bo'limi va PrimeGenerator misoli (2024-2025 yillardagi yozma muloqot)"
quiz:
  - q: "Martin va Ousterhout munozarasida ikkala muallif ham qaysi fikrga qo'shiladi?"
    options:
      - "Kommentlar har doim kodning muvaffaqiyatsizligidir"
      - "Jamoa ichidagi interfeyslarga komment kerak emas"
      - "Public API'lar uchun komment kerak va \"nega\" degan sifat ma'lumotini inson tili koddan yaxshiroq beradi"
      - "Uzun nomlar kommentlarni to'liq almashtira oladi"
    answer: 2
    explain: "Munozara xulosasida ikkalasi public API kommentlari zarurligi va \"nega\" degan savolga tabiiy til yaxshiroq javob berishi bo'yicha kelishadi. Qolgan uch variant - aynan ular kelisha olmagan nuqtalar: kommentning umumiy foydasi, jamoa ichki interfeyslari va uzun nomlar."
  - q: "Ousterhoutning \"kommentlar eskiradi\" degan e'tirozga javobi qanday?"
    options:
      - "Eskirish xavfi bor, shuning uchun komment yozmaslik kerak"
      - "Eskirishni kommentni o'zgargan kodga yaqin joylashtirish va code review'da tekshirish orqali boshqarish mumkin, yo'qligining narxi esa kattaroq"
      - "Kommentlar hech qachon eskirmaydi"
      - "Faqat commit xabarlariga yozish kerak"
    answer: 1
    explain: "Ousterhout eskirish real muammo ekanini tan oladi, lekin uni intizom bilan (komment kodga yaqin, review'da tekshiriladi) hal qilinadigan muammo deb biladi. Uning bahosiga ko'ra, yo'q kommentning narxi noto'g'ri kommentnikidan ancha katta."
  - q: "Quyidagi kommentlardan qaysi biri ikkala muallif nuqtai nazaridan ham o'rinli?\n\n```ts\n// A: oshiramiz\ncount++;\n// B: GPS qurilmalari ba'zan 0,0 koordinata yuboradi; bu signal yo'qligini bildiradi\nif (lat === 0 && lng === 0) return null;\n// C: bu funksiya tezlikni hisoblaydi\nfunction calculateSpeed() {}\n```"
    options:
      - "Faqat A"
      - "A va C"
      - "Hech biri"
      - "Faqat B"
    answer: 3
    explain: "B koddan ko'rinmaydigan domen faktini aytadi: nega 0,0 maxsus holat. A va C esa kodni so'zma-so'z takrorlaydi. Martin ularni shovqin deydi, Ousterhout ham koddan ko'rinib turgan narsani takrorlovchi kommentni foydasiz deb hisoblaydi."
  - q: "Martin nima uchun har bir kommentga ehtiyotkorlik bilan qaraydi?"
    options:
      - "Chunki komment kompilyator tomonidan tekshirilmaydi va kod o'zgarganda jimgina noto'g'ri bo'lib qolishi mumkin, shuning uchun u uni koddan tekshiradi"
      - "Chunki kommentlar kompilyatsiyani sekinlashtiradi"
      - "Chunki kommentlar ingliz tilida yozilishi shart"
      - "Chunki kommentlar git tarixini buzadi"
    answer: 0
    explain: "Martin munozarada har bir kommentni potensial noto'g'ri ma'lumot deb ko'rishini aytadi. Sabab - kommentni hech qanday vosita tekshirmaydi, kod esa o'zgarib turadi."
  - q: "PrimeGenerator misolidagi tortishuvdan qaysi amaliy saboq chiqadi?"
    options:
      - "Kichik metodlar har doim tezroq ishlaydi"
      - "Kommentlar algoritmni tushunishga hech qachon yordam bermaydi"
      - "Murakkab algoritmda komment ham, kod ham xato bo'lishi mumkin, shuning uchun ikkalasi ham review'dan o'tishi kerak"
      - "Bitta katta metod har doim yaxshiroq"
    answer: 2
    explain: "Munozarada Martin Ousterhout kommentidagi xatoni topdi, Ousterhout esa Martin versiyasidagi sekinlashuvni topdi. Ikkalasi ham murakkab algoritmni tushuntirish qiyinligini va kod bilan kommentni birga review qilish kerakligini tan oladi."
  - q: "Jamoangizda \"kommentlar - kodning muvaffaqiyatsizligi\" degan qoida qat'iy qo'llanadi. Qaysi oqibat eng ehtimolli?"
    options:
      - "Kodda hech qanday nomlash muammosi qolmaydi"
      - "Interfeyslarning shartnomasi (birliklar, chegara holatlari, nega shunday qilingani) hujjatlanmay qoladi va har bir chaqiruvchi implementatsiyani o'qishga majbur bo'ladi"
      - "Kod tezroq ishlaydi"
      - "Testlar soni ko'payadi"
    answer: 1
    explain: "Ousterhoutning asosiy xavotiri aynan shu: kommentsiz interfeys abstraksiya bermaydi, chunki o'quvchi uni ishlatish uchun ichini o'qishi kerak. Nomlar va tiplar hamma narsani ayta olmaydi."
task:
  title: "Kommentlarni ikki ko'z bilan tekshirish"
  prompt: |
    Quyidagi modul transport parkidagi yoqilg'i datchigi (DUT) ma'lumotlarini qayta ishlaydi. Unda turli kommentlar bor.

    1. Har bir kommentni ikki savol bilan baholang: (a) u koddan ko'rinmaydigan ma'lumot beradimi? (b) kodni yaxshiroq nomlash yoki tiplash orqali bu ma'lumotni kodga o'tkazish mumkinmi?
    2. Kodni takrorlovchi kommentlarni o'chiring, ularning o'rniga kerak bo'lsa nomlarni yaxshilang.
    3. Koddan ko'rinmaydigan, lekin hozir yozilmagan muhim ma'lumotni (birliklar, nega shu chegara) komment sifatida qo'shing.
    4. Natijani Martin va Ousterhout nuqtai nazaridan qisqa asoslang.
  lang: ts
  starter: |
    // yoqilg'i hodisasi
    type E = { t: number; v: number };

    // threshold
    const T = 15;

    /**
     * Bu funksiya hodisalarni oladi va natija qaytaradi.
     * @param e hodisalar
     */
    export function detect(e: E[]): number[] {
      // natija massivi
      const r: number[] = [];
      // sikl
      for (let i = 1; i < e.length; i++) {
        // farqni hisoblaymiz
        const d = e[i - 1].v - e[i].v;
        // agar farq T dan katta bo'lsa
        if (d > T && e[i].t - e[i - 1].t < 300) {
          r.push(e[i].t);
        }
      }
      // qaytaramiz
      return r;
    }
  solution: |
    type FuelReading = {
      /** Unix vaqti, soniyalarda. */
      timestampSec: number;
      /** Bakdagi yoqilg'i hajmi, litrda (DUT kalibrlangan qiymat). */
      liters: number;
    };

    /**
     * Ikki o'lchov orasidagi shunday tushish "to'kish" (drain) deb hisoblanadi.
     * 15 litrdan kam tushishlar yo'l notekisligida yoqilg'i chayqalishidan ham
     * kelib chiqishi mumkin, shuning uchun ular e'tiborga olinmaydi.
     */
    const DRAIN_MIN_LITERS = 15;

    /**
     * Tushish shu oraliqdan uzoq vaqt ichida bo'lsa, bu oddiy sarf deb qabul qilinadi.
     */
    const DRAIN_MAX_WINDOW_SEC = 5 * 60;

    /**
     * Yoqilg'i to'kish ehtimoli bor hodisalarni topadi.
     *
     * @param readings - vaqt bo'yicha o'sish tartibida saralangan o'lchovlar
     * @returns shubhali tushish qayd etilgan o'lchovlarning vaqtlari (soniyalarda)
     */
    export function findSuspectedDrains(readings: FuelReading[]): number[] {
      const drainTimestamps: number[] = [];
      for (let i = 1; i < readings.length; i++) {
        const previous = readings[i - 1];
        const current = readings[i];
        const drop = previous.liters - current.liters;
        const elapsed = current.timestampSec - previous.timestampSec;
        if (drop > DRAIN_MIN_LITERS && elapsed < DRAIN_MAX_WINDOW_SEC) {
          drainTimestamps.push(current.timestampSec);
        }
      }
      return drainTimestamps;
    }
  solutionNotes: |
    - "natija massivi", "sikl", "qaytaramiz" kabi kommentlar o'chirildi: ular kodni takrorlaydi. Bu yerda Martin ham, Ousterhout ham bir fikrda.
    - "yoqilg'i hodisasi" va "threshold" kommentlari o'rniga nomlar ishlaydi: `FuelReading`, `DRAIN_MIN_LITERS`. Bu Martinning "kommentni nom bilan almashtir" tavsiyasi.
    - Birliklar (soniya, litr) va saralash talabi nom bilan to'liq ifodalanmaydi, shuning uchun ular interfeys kommentiga yozildi. Bu Ousterhout yondashuvi: interfeys kommenti chaqiruvchiga implementatsiyani o'qimasdan ishlatish imkonini beradi.
    - "Nega 15 litr" degan savolga javob - domen bilimi (chayqalish). U koddan hech qachon ko'rinmaydi, shuning uchun komment shu yerda qiymatga ega.
    - `@param e hodisalar` kabi bo'sh JSDoc o'chirildi, o'rniga haqiqiy shartnoma yozildi.
  checklist:
    - "Kodni so'zma-so'z takrorlaydigan kommentlar qolmadi"
    - "Qisqa, ma'nosiz nomlar (E, T, d, r) domen nomlariga almashtirildi"
    - "Birliklar va kirish ma'lumotiga qo'yiladigan talab (saralangan) hujjatlandi"
    - "Konstantalar yonida \"nega shu qiymat\" degan izoh bor"
    - "Har bir qolgan komment koddan chiqarib bo'lmaydigan ma'lumot beradi"
---

## Muammo

Kod review'da eng ko'p takrorlanadigan bahslardan biri: "bu yerga komment yozish kerakmi?". Bir dasturchi "kod o'zini tushuntirsin, komment - bu bahona" deydi. Boshqasi "bu funksiyani ishlatish uchun men 200 qator ichini o'qishim kerak bo'ldi" deb javob beradi. Ikkalasi ham haq bo'lishi mumkin va bu bahs ko'pincha shaxsiy didga aylanib qoladi.

Bu bahsning ildizi sohaning ikki eng ta'sirli kitobida. Robert Martinning *Clean Code* kitobi kommentlarga shubha bilan qaraydi. John Ousterhoutning *A Philosophy of Software Design* kitobi esa kommentni dizaynning markaziy vositasi deb biladi. 2024-2025 yillarda ikki muallif bu masalani to'g'ridan-to'g'ri, yozma muloqot shaklida muhokama qildi va natijani GitHub'da ochiq e'lon qildi (`aposd-vs-clean-code` repozitoriyasi). Bu darsda shu munozarani asos qilib olamiz, chunki unda ikkala tomon o'z pozitsiyasini o'zi aniqlashtiradi va kitoblardan olingan karikaturalar emas, haqiqiy fikrlar ko'rinadi.

Real og'riq shundan iborat: kommentlar haqidagi noto'g'ri tushunilgan qoida ikki yo'nalishda zarar qiladi. "Komment yozma" qoidasi interfeyslarni hujjatsiz qoldiradi. "Hamma narsani kommentla" qoidasi esa kodni takroriy, eskirgan shovqin bilan to'ldiradi.

## Asosiy g'oya

### Martinning pozitsiyasi

*Clean Code*ning kommentlar haqidagi bobida Martin kommentni kod niyatni ifoda qila olmagan joyni qoplash vositasi deb ta'riflaydi. Uning mantig'i:

- Kod - yagona haqiqat manbai. Komment kompilyator tomonidan tekshirilmaydi, testlar uni ishga tushirmaydi.
- Kod o'zgaradi, komment esa ko'pincha o'zgarmaydi. Vaqt o'tishi bilan u yolg'onga aylanadi.
- Shuning uchun komment yozishdan oldin har doim so'rash kerak: buni yaxshiroq nom, kichikroq funksiya yoki aniqroq tip bilan ifodalab bo'lmaydimi?

Munozarada Martin o'z pozitsiyasini yumshatib aniqlashtiradi: u umuman kommentlarga emas, *keraksiz* kommentlarga qarshi. U kommentni "zaruriy yovuzlik" deb ataydi va har bir kommentni koddan tekshiradi. Uning fikricha, uzun, tasviriy nomlar kommentdan yaxshiroq, chunki nomni o'qimaslik qiyin, kommentni esa ko'z o'tkazib yuboradi. Jamoa ichidagi interfeyslar uchun komment ko'pincha shart emas, chunki jamoa o'z kodini biladi, public API uchun esa kerak.

Martin kitobida yaxshi kommentlar ro'yxatini ham beradi: huquqiy ma'lumot, niyatni tushuntirish, oqibatlar haqida ogohlantirish, TODO, public API hujjati va boshqalar (32-dars). Ya'ni uning pozitsiyasi "komment yozma" emas, "komment - oxirgi chora".

### Ousterhoutning pozitsiyasi

Ousterhout uchun komment - abstraksiyaning bir qismi. Uning argumenti modul tushunchasiga tayanadi: modulning interfeysi uni ishlatish uchun bilish kerak bo'lgan hamma narsa. Bu interfeysning faqat bir qismini (nomlar, parametrlar, tiplar) kod ifodalaydi. Qolgani, ya'ni funksiya nima qiladi, qanday cheklovlar bor, xato holatlarida nima bo'ladi, birliklar qanday, faqat tabiiy tilda yoziladi. Agar bu yozilmasa, foydalanuvchi implementatsiyani o'qishga majbur bo'ladi va abstraksiya yo'qoladi.

Ousterhout kitobida komment yozmaslik uchun keltiriladigan to'rtta bahonani sanab o'tadi: "yaxshi kod o'zini o'zi hujjatlaydi", "vaqtim yo'q", "kommentlar eskiradi", "men ko'rgan kommentlarning hammasi foydasiz edi". U har biriga javob beradi. Masalan, eskirish muammosini komment kodga yaqin joylashtirilsa va review'da tekshirilsa boshqarish mumkin. Foydasiz kommentlar ko'p ekani esa komment yozishni emas, *yaxshi* komment yozishni o'rganish kerakligini ko'rsatadi.

Munozarada Ousterhout yo'q kommentning narxi noto'g'ri kommentnikidan bir necha barobar, uning bahosida 10 dan 100 martagacha katta ekanini aytadi. Bu o'lchangan statistika emas, muallifning tajribaviy bahosi. U Martindan ko'ra bir necha barobar ko'p komment qatori yozishini ham tan oladi. Uning asosiy xavotiri: *Clean Code*ning kommentlarga dushmanona ohangi yosh dasturchilarni umuman komment yozmaslikka undaydi.

### Umumiy asos

Ikki muallif kelishgan nuqtalar ham muhim:

- Public API'lar uchun komment zarur.
- Implementatsiya ichidagi komment faqat kod ravshan bo'lmagan joyda kerak.
- "Nega shunday qilingan" kabi sifat ma'lumotini inson tili koddan yaxshiroq beradi.
- Murakkab algoritmni tushuntirish qiyin, shuning uchun review'da kod ham, komment ham tekshirilishi kerak.
- Kod iloji boricha tushunarli bo'lishi kerak.

Kelishmovchilik esa miqdor va ishonchda: kommentlar amalda umumiy hisobda foydalimi yoki zararlimi, ularga tekshirmasdan ishonish mumkinmi, uzun nomlar kommentni almashtira oladimi, jamoa ichidagi interfeyslarga komment kerakmi.

## Chuqurroq: ikki qarashni bitta mezonga keltirish

Ikki pozitsiya ko'rinishidan qarama-qarshi, lekin ularni bitta savolga keltirish mumkin: **bu komment koddan chiqarib bo'lmaydigan ma'lumot beradimi?**

- Agar komment kodda allaqachon bor narsani takrorlasa (`// hisoblagichni oshiramiz`), u ikkala muallif uchun ham foydasiz.
- Agar ma'lumotni kodga o'tkazish mumkin bo'lsa (yaxshiroq nom, tip, konstanta), avval shuni qiling. Bu yerda Martin haq: kod tekshiriladi, komment tekshirilmaydi.
- Agar ma'lumot tabiatan koddan chiqmasa (nega, qaysi birlikda, qanday kafolat, qaysi alternativa rad etilgan), komment yozing. Bu yerda Ousterhout haq: bu ma'lumotsiz abstraksiya to'liq emas.

### Kod nimani ayta olmaydi

TypeScript tiplari ko'p narsani ifodalaydi, lekin quyidagilarni deyarli hech qachon:

1. **Birliklar.** `distance: number` metrmi, kilometrmi? Branded type (44-dars) qisman yordam beradi, lekin hamma joyda ishlatilmaydi.
2. **Sabab.** Nega retry soni 3 ta, nega timeout 30 soniya, nega bu yerda tranzaksiya yo'q.
3. **Rad etilgan alternativalar.** "Bu yerda `Promise.all` ishlatilmagan, chunki tashqi API parallel so'rovlarni bloklaydi."
4. **Kafolatlar va cheklovlar.** Funksiya idempotentmi, bo'sh massiv qaytarishi mumkinmi, chaqiruvchi tartibni saqlashi kerakmi.
5. **Tashqi dunyo faktlari.** Qurilma ba'zan noto'g'ri qiymat yuboradi, provayder API'si hujjatda aytilganidan boshqacha ishlaydi.

### PrimeGenerator saboq

Munozaraning eng qiziq qismi - Knuth algoritmiga asoslangan tub sonlar generatori. *Clean Code*dagi asl versiya sakkizta kichik metod va deyarli kommentsiz yozilgan. Ousterhout uni bitta metod va batafsil kommentlar bilan qayta yozdi. Martin to'rt metodli, kam kommentli versiya taklif qildi.

Natija ikkala tomon uchun ham kamtarlik darsi bo'ldi. Martin Ousterhout kommentlaridan birida faktik xato topdi va boshqa kommentni chalg'ituvchi deb hisobladi. Ousterhout esa Martin versiyasida sikllarni bo'lish sezilarli sekinlashuv berganini topdi, Martin buni tuzatdi. Martin algoritmni tushunish uchun uzoq vaqt sarflaganini ham tan oldi. Bundan chiqadigan xulosa: murakkab algoritmda xato ham kodda, ham kommentda bo'lishi mumkin, va ularning ikkalasini ham boshqa odam ko'rib chiqishi kerak. Kommentning xato bo'lishi uni yozmaslikka sabab emas, uni review qilishga sabab.

### Nomlar va kommentlar

Martin uzun nomlarni afzal ko'radi, Ousterhout esa qisqaroq nom va izohni. Amalda ikkalasining ham chegarasi bor. `calculateFuelConsumptionPerHundredKilometersExcludingIdle` kabi nom o'qiladi, lekin har bir chaqiruvda ko'zni charchatadi. `fuelPer100Km` va interfeys kommentida "salt (idle) rejimdagi sarf hisobga olinmaydi" degan izoh ko'pincha muvozanatliroq. Nom - tez tanib olish uchun, komment - to'liq shartnoma uchun.

## Misol: bir xil kod, uch xil kommentlash

Avval shovqin kommentlar bilan yozilgan kod:

```ts
// Haydovchi
type Driver = { id: string; score: number };

// Haydovchilarni oladi va eng yaxshilarini qaytaradi
export function top(drivers: Driver[], n: number): Driver[] {
  // nusxa olamiz
  const copy = [...drivers];
  // saralaymiz
  copy.sort((a, b) => b.score - a.score);
  // birinchi n tasini qaytaramiz
  return copy.slice(0, n);
}
```

Bu yerda har bir komment kodni takrorlaydi. Lekin muhim savollar javobsiz: `score` qaysi oraliqda, katta yaxshimi yoki kichik, teng ballda tartib qanday?

Martin uslubidagi "kommentsiz, nom bilan" versiya:

```ts
type Driver = { id: string; safetyScore: number };

export function selectSafestDrivers(drivers: Driver[], limit: number): Driver[] {
  return [...drivers]
    .sort((a, b) => b.safetyScore - a.safetyScore)
    .slice(0, limit);
}
```

Nomlar ko'p narsani aytdi: bu xavfsizlik bali, katta yaxshi (`safest`). Ammo hali ham ochiq savollar bor. Ular kod bilan ifodalanmaydi, shuning uchun Ousterhout yondashuvidagi interfeys kommenti qo'shiladi:

```ts
type Driver = {
  id: string;
  /** 0 dan 100 gacha. Oxirgi 30 kunlik keskin tormoz, tezlik oshirish va burilishlar asosida. */
  safetyScore: number;
};

/**
 * Eng yuqori xavfsizlik baliga ega haydovchilarni qaytaradi.
 *
 * Teng ballda kirish massividagi tartib saqlanadi (Array.prototype.sort barqaror).
 * Kirish massivi o'zgartirilmaydi.
 */
export function selectSafestDrivers(drivers: Driver[], limit: number): Driver[] {
  return [...drivers]
    .sort((a, b) => b.safetyScore - a.safetyScore)
    .slice(0, limit);
}
```

Nima o'zgardi va nega:

- Ichki kommentlar yo'q: implementatsiya uch qatorli va ravshan. Bu yerda ikkala muallif ham kelishadi.
- `safetyScore` kommenti oraliq va hisoblash asosini beradi. Bu domen fakti, uni tip ifodalay olmaydi.
- Funksiya kommenti ikkita kafolatni aytadi: barqaror tartib va kirishni o'zgartirmaslik. Chaqiruvchi endi ichini o'qishi shart emas. Bu kafolatlar shartnoma qismiga aylandi: kelajakda kimdir `drivers.sort(...)` deb yozsa, review'da kommentga zid ekani ko'rinadi.

## Qachon qo'llamaslik kerak

Ikkala qarash ham haddan oshirilganda zarar qiladi:

- **"Kommentsiz kod" dogmasi.** Interfeys shartnomasi, birliklar va "nega" yozilmay qoladi. Ayniqsa integratsiya kodi (to'lov provayderlari, GPS qurilmalari protokollari) va murakkab algoritmlarda bu qimmatga tushadi. Uzun nomlar bilan hamma narsani ifodalashga urinish esa nomlarni o'qib bo'lmaydigan qiladi.
- **"Hamma narsani kommentla" dogmasi.** Majburiy JSDoc har bir private metodga, har bir parametrga - bu Martin haqli ravishda tanqid qiladigan holat. Bunday kommentlar kodni takrorlaydi va birinchi bo'lib eskiradi.
- **Kommentni yomon kodni yashirish uchun ishlatish.** Agar funksiyani tushuntirish uchun uzun komment kerak bo'lsa va sabab chalkash nomlar yoki aralash mas'uliyat bo'lsa, avval kodni tuzating. Komment strukturaviy muammoni hal qilmaydi.
- **Tez o'zgarayotgan prototip.** Hali dizayn o'rnashmagan kodda batafsil interfeys kommenti tez eskiradi. Bunday holatda qisqa "nega" izohlari yetarli, to'liq shartnoma dizayn barqarorlashganda yoziladi. Ousterhout bu bilan to'liq kelishmasligi mumkin, chunki u kommentni dizayn vositasi sifatida birinchi yozishni tavsiya qiladi (34-dars).

## Stack'da: TypeScript, NestJS, Next.js

- **TypeScript tiplari kommentning bir qismini o'z zimmasiga oladi.** `status: "active" | "archived"` degan tip "status 1 yoki 2 bo'lishi mumkin" degan kommentdan yaxshiroq, chunki u tekshiriladi. Lekin tiplar sabab va birlikni aytmaydi.
- **NestJS service'lari.** Controller ichidagi oddiy CRUD metodlariga komment shart emas. Lekin billing, tarif hisoblash yoki tashqi integratsiya service'larining public metodlari uchun interfeys kommenti kerak: idempotentlik, tranzaksiya chegarasi, qaysi exception qachon tashlanadi.
- **Next.js Server Actions va route handler'lar.** Bu yerda "nega" kommentlari ayniqsa foydali: nega `revalidatePath` aynan shu yo'lga, nega bu handler `dynamic = "force-dynamic"`. Bu qarorlar keshlash xatti-harakatiga ta'sir qiladi va koddan ko'rinmaydi.
- **ESLint qoidalari.** Ba'zi jamoalar `jsdoc/require-jsdoc` kabi qoidani hamma joyga yoqadi. Bu ko'pincha shovqin kommentlarga olib keladi. Uni faqat paketning public API'si uchun yoqish oqilonaroq (37-dars).

## Xulosa

- Martin kommentni kod ifoda qila olmagan joyni qoplash deb ko'radi va har bir kommentni tekshiradi. U keraksiz kommentlarga qarshi, umuman kommentlarga emas.
- Ousterhout kommentni abstraksiyaning ajralmas qismi deb biladi: interfeysning koddan ko'rinmaydigan qismi faqat kommentda yashaydi.
- Ikkalasi public API kommentlari, "nega" izohlari va kod bilan kommentni birga review qilish zarurligi bo'yicha kelishadi.
- Amaliy mezon: komment koddan chiqarib bo'lmaydigan ma'lumot beradimi? Agar ma'lumotni nom yoki tipga o'tkazish mumkin bo'lsa, avval shuni qiling. Mumkin bo'lmasa, komment yozing.
- Kommentning xato bo'lishi mumkinligi uni yozmaslikka emas, review qilishga sabab.
