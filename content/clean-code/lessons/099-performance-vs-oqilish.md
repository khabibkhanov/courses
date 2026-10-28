---
n: 99
slug: performance-vs-oqilish
title: "Performance va o'qiluvchanlik muvozanati"
summary: "\"Premature optimization is the root of all evil\" iqtibosi odatda kontekstsiz keltiriladi. Bu darsda Knuth aslida nima deganini, Casey Muratori'ning clean code tanqidini va Ousterhout bilan Martin bahsidagi performance qismini ko'rib, Node.js backend uchun amaliy muvozanat qoidasini chiqaramiz."
duration: 40
sources:
  - id: knuth-1974
    note: "Mashhur iqtibos konteksti: kichik samaradorlik haqida taxminan 97% vaqt unutish, lekin muhim 3% ni o'tkazib yubormaslik; dasturchilar sezgisi qayerda vaqt ketishini ko'pincha noto'g'ri bashorat qilishi va o'lchov vositalari"
  - id: muratori-performance
    note: "Shape area misoli: polimorfizm, ichki tuzilmani bilmaslik, kichik funksiyalar va DRY qoidalarini o'lchash; switch, jadval va AVX versiyalari bilan solishtirish"
  - id: aposd-vs-cc
    note: "PrimeGenerator qayta yozilishi atrofidagi performance bahsi: Ousterhout o'lchagan sekinlashuv va Martin'ning profiling qilmaganini tan olishi"
quiz:
  - q: "Knuth'ning \"premature optimization\" haqidagi gapining to'liq kontekstiga eng mos talqin qaysi?"
    options:
      - "Optimallashtirish har doim zararli, faqat o'qilishga e'tibor berish kerak"
      - "Optimallashtirishni loyiha oxiriga qoldirish kerak"
      - "Kichik samaradorlik haqida ko'p vaqt qayg'urmaslik, lekin muhim kichik qismni o'lchov bilan topib, u yerda imkoniyatni o'tkazib yubormaslik"
      - "Faqat assembler'da optimallashtirish kerak"
    answer: 2
    explain: "Knuth taxminan 97% holatda kichik samaradorlikni unutishni aytadi, lekin darhol muhim 3% dagi imkoniyatlarni qo'ldan bermaslikni qo'shadi. U muhim kodni sezgi bilan emas, o'lchov bilan aniqlashni ta'kidlaydi."
  - q: "Casey Muratori o'z maqolasida qanday natija ko'rsatadi?"
    options:
      - "Clean code qoidalari performance'ga ta'sir qilmaydi"
      - "Virtual funksiyali \"toza\" versiyadan switch versiyasi taxminan 1.5 baravar, jadval versiyasi taxminan 10 baravar va undan ko'p tezroq"
      - "Clean code har doim 100 baravar sekin"
      - "Polimorfizm switch'dan tezroq"
    answer: 1
    explain: "Muratori shakl maydonlarini hisoblashda polimorfizmni switch bilan almashtirish taxminan 1.5x, ma'lumot va amalni jadvalga birlashtirish 10x va undan ko'p tezlik berganini o'lchaydi. Burchak vaznli variantda farq taxminan 15x gacha o'sadi."
  - q: "NestJS endpoint 800 ms javob beradi. Profiling ko'rsatdiki, 740 ms ma'lumotlar bazasini kutishga ketadi. Dasturchi esa DTO mapper'dagi `map`/`filter` zanjirini `for` sikliga almashtirishni taklif qilmoqda. Baho?"
    options:
      - "Yaxshi taklif, har qanday tezlashtirish foydali"
      - "for har doim tezroq, darhol qilish kerak"
      - "Mapper'ni C++ addon'ga ko'chirish kerak"
      - "Noto'g'ri nishon: vaqtning 90% dan ortig'i so'rovda, avval so'rov, indeks va N+1'ni ko'rib chiqish kerak, mapper o'zgarishi o'qilishni yomonlashtirib, deyarli foyda bermaydi"
    answer: 3
    explain: "Amdahl qonuni mantig'i: umumiy vaqtning 60 ms dan kam qismini tezlashtirish javobni sezilarli o'zgartirmaydi. Knuth ham aynan shu haqda ogohlantiradi: sezgi qayerda vaqt ketishini noto'g'ri bashorat qiladi."
  - q: "Ousterhout va Martin munozarasida PrimeGenerator bo'yicha performance masalasi qanday hal bo'ldi?"
    options:
      - "Ousterhout Martin'ning qayta yozgan versiyasi sezilarli sekinlashganini o'lchadi, Martin profiling qilmaganini tan oldi va sikllarni qayta birlashtirdi"
      - "Ikkalasi ham performance muhim emas degan xulosaga keldi"
      - "Martin Ousterhout'ning versiyasi sekin ekanini isbotladi va Ousterhout rozi bo'ldi"
      - "Performance umuman muhokama qilinmadi"
    answer: 0
    explain: "Ousterhout ikki siklga bo'lingan versiya bir necha baravar sekin ekanini o'lchadi. Martin profiling qilmaganini tan oldi va sikllarni birlashtirdi. Bu bahsning darsi: tuzilma o'zgarishi performance'ga ta'sir qilishi mumkin va buni faqat o'lchov ko'rsatadi."
  - q: "Qaysi holatda Muratori'ning tanqidi Node.js backend uchun eng to'g'ridan-to'g'ri qo'llanadi?"
    options:
      - "Har bir CRUD endpoint'ida"
      - "DTO validatsiyasida"
      - "Millionlab GPS nuqtalarini bitta jarayonda qayta ishlaydigan issiq siklda, masalan, marshrut masofasini yoki geofence tekshiruvini hisoblashda"
      - "Konfiguratsiya fayllarini o'qishda"
    answer: 2
    explain: "Muratori o'lchagan farqlar CPU-bound issiq sikllarda namoyon bo'ladi. Ko'pchilik CRUD endpoint'larida vaqt I/O'ga ketadi va obyekt tuzilishi narxi sezilmaydi. Lekin katta hajmdagi hisoblashda ma'lumot joylashuvi va abstraksiya narxi haqiqiy."
task:
  title: "GPS trek masofasini hisoblashni o'lchov bilan optimallashtirish"
  prompt: |
    Servis har kecha har bir mashina uchun kunlik bosib o'tilgan masofani GPS nuqtalaridan hisoblaydi. 3000 mashina, har birida kuniga 20-40 ming nuqta. Kod "toza" yozilgan, lekin hisoblash ish oynasiga sig'maydi.

    1. Avval kodni o'zgartirmasdan, vaqt qayerga ketishini o'lchash rejasini yozing (qaysi vosita, nimani solishtirasiz).
    2. Issiq siklni optimallashtiring. Ochiq API (`dailyDistanceKm`) va natija bir xil qolsin.
    3. O'qiluvchanlikni qanday saqlaganingizni tushuntiring: optimallashtirilgan qism qayerda va u qanday hujjatlangan.
  lang: ts
  starter: |
    class GeoPoint {
      constructor(readonly lat: number, readonly lng: number, readonly at: Date) {}

      toRadians(): { lat: number; lng: number } {
        return { lat: (this.lat * Math.PI) / 180, lng: (this.lng * Math.PI) / 180 };
      }

      distanceTo(other: GeoPoint): number {
        const a = this.toRadians();
        const b = other.toRadians();
        const dLat = b.lat - a.lat;
        const dLng = b.lng - a.lng;
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat) * Math.cos(b.lat) * Math.sin(dLng / 2) ** 2;
        return 2 * 6371 * Math.asin(Math.sqrt(h));
      }
    }

    type RawPoint = { lat: number; lng: number; ts: string; speed: number };

    export function dailyDistanceKm(raw: RawPoint[]): number {
      return raw
        .map((p) => new GeoPoint(p.lat, p.lng, new Date(p.ts)))
        .sort((a, b) => a.at.getTime() - b.at.getTime())
        .filter((p, i, all) => i === 0 || p.at.getTime() !== all[i - 1].at.getTime())
        .map((p, i, all) => (i === 0 ? 0 : all[i - 1].distanceTo(p)))
        .filter((d) => d < 5)
        .reduce((sum, d) => sum + d, 0);
    }
  solution: |
    // 1. O'lchash rejasi:
    //   - Bitta real mashinaning kunlik nuqtalari (masalan, 35 ming) bilan mikro-benchmark:
    //     `performance.now()` yoki tinybench bilan 50 marta takrorlab, median vaqt.
    //   - `node --cpu-prof` bilan butun kechki job'ni profiling qilish: vaqt hisoblashdami,
    //     DB'dan o'qishdami yoki JSON parse'dami? Agar 80% DB'da bo'lsa, bu kodni tegmaslik kerak.
    //   - Optimallashtirishdan oldin characterization test: 5 ta real trek uchun natijani qayd etish.

    const EARTH_RADIUS_KM = 6371;
    const DEG_TO_RAD = Math.PI / 180;
    /** GPS sakrashi: ikki ketma-ket nuqta orasida bundan katta masofa shovqin deb hisoblanadi. */
    const MAX_SEGMENT_KM = 5;

    type RawPoint = { lat: number; lng: number; ts: string; speed: number };

    /**
     * Kunlik bosib o'tilgan masofa (km).
     * Nuqtalar vaqt bo'yicha tartiblanadi, bir xil vaqtli takrorlar va 5 km dan katta sakrashlar tashlanadi.
     */
    export function dailyDistanceKm(raw: RawPoint[]): number {
      const points = toSortedColumns(raw);
      return sumHaversineKm(points.lat, points.lng, points.time);
    }

    type PointColumns = { lat: Float64Array; lng: Float64Array; time: Float64Array };

    function toSortedColumns(raw: RawPoint[]): PointColumns {
      const order = raw
        .map((p, index) => ({ index, time: Date.parse(p.ts) }))
        .sort((a, b) => a.time - b.time);
      const n = order.length;
      const lat = new Float64Array(n);
      const lng = new Float64Array(n);
      const time = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        const entry = order[i]!;
        const point = raw[entry.index]!;
        lat[i] = point.lat * DEG_TO_RAD;
        lng[i] = point.lng * DEG_TO_RAD;
        time[i] = entry.time;
      }
      return { lat, lng, time };
    }

    /**
     * Issiq sikl: kunlik ~30 ming nuqta x 3000 mashina.
     * Ataylab ustunli massivlar va obyektsiz sikl: profiling'da GeoPoint va oraliq massivlar
     * vaqtning asosiy qismini olgan edi. Formulani o'zgartirsangiz, characterization testni ishga tushiring.
     */
    function sumHaversineKm(lat: Float64Array, lng: Float64Array, time: Float64Array): number {
      let total = 0;
      for (let i = 1; i < lat.length; i++) {
        if (time[i] === time[i - 1]) continue;
        const lat1 = lat[i - 1]!;
        const lat2 = lat[i]!;
        const sinDLat = Math.sin((lat2 - lat1) / 2);
        const sinDLng = Math.sin((lng[i]! - lng[i - 1]!) / 2);
        const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
        const segmentKm = 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
        if (segmentKm < MAX_SEGMENT_KM) total += segmentKm;
      }
      return total;
    }
  solutionNotes: |
    - Birinchi qadam o'lchov: agar vaqt DB yoki JSON parse'ga ketsa, bu funksiyani optimallashtirish foydasiz (Knuth'ning ogohlantirishi).
    - Starter har bir nuqta uchun `GeoPoint`, `Date` va ikki marta `toRadians()` obyekti yaratadi, hamda zanjirdagi har bir `map`/`filter` yangi massiv. 30 ming nuqtada bu yuz minglab qisqa umrli obyekt va GC bosimi.
    - Radianga o'tkazish bir marta, tartiblashdan keyin. `cos(lat)` ni keshlash ham mumkin edi, lekin o'lchovsiz qo'shmadik.
    - Ma'lumot ustunli `Float64Array`larda: bu Muratori g'oyasining JS'dagi ko'rinishi, ya'ni ma'lumotni amal bo'yicha tashkil qilish.
    - Bir nozik farq: starter takrorlarni avval olib tashlab, keyin qo'shni nuqtalarni solishtirardi. Yangi kod ham takror nuqtada `continue` qiladi, lekin keyingi nuqtani takrordan oldingi emas, takrorning o'zi bilan solishtiradi. Koordinatalar bir xil bo'lsa natija bir xil, aks holda farq qilishi mumkin: characterization test bu yerda majburiy.
    - O'qiluvchanlik: ochiq API va uning hujjati o'zgarmadi. Optimallashtirilgan kod bitta kichik funksiyada izolyatsiya qilingan va nega shunday yozilgani izohlangan (32-dars). Magic number'lar nomlangan.
    - Starter'da noto'g'ri sana satri `Invalid Date` bilan jimgina NaN berardi. Bu performance masalasi emas, lekin review'da alohida ko'tarish kerak.
  checklist:
    - "Optimallashtirishdan oldin o'lchash rejasi va characterization test bor"
    - "Issiq siklda har bir nuqta uchun obyekt yoki oraliq massiv yaratilmaydi"
    - "Ochiq funksiya nomi, imzosi va hujjati o'zgarmagan"
    - "Optimallashtirilgan qism alohida funksiyada va nega shunday yozilgani izohlangan"
    - "Natija starter bilan bir xil ekani real ma'lumotda tekshirilgan"
---

## Muammo

Performance haqidagi suhbat dasturchilar orasida ikki qutbga bo'linadi. Birinchi qutb: "Premature optimization is the root of all evil, avval toza yozamiz, keyin kerak bo'lsa optimallashtiramiz." Ikkinchisi: "Clean code dasturlarni sekin qiladi, abstraksiyalar har bir siklda narx to'laydi, va 'keyin' hech qachon kelmaydi."

Ikkala pozitsiya ham real tajribadan chiqqan. Birinchisi o'qilishi qiyin "optimallashtirilgan" kodni ko'rgan odamlardan: bit operatsiyalari, qo'lda inline qilingan funksiyalar, hech kim tushunmaydigan kesh, va bularning hammasi 2% foyda uchun. Ikkinchisi sekin dasturlarni ko'rgan odamlardan: 32 yadroli kompyuterda sekundlab ochiladigan muharrir, oddiy hisobotni 20 daqiqa tuzadigan servis.

Bu darsning maqsadi - qutblardan birini tanlash emas, balki ikkala tomonning eng kuchli argumentlarini ko'rib, qachon qaysi biri to'g'ri ekanini aniqlash. Buning uchun avval eng ko'p noto'g'ri keltiriladigan iqtibosga qaytamiz.

## Asosiy g'oya

### Knuth aslida nima degan

Donald Knuth'ning 1974 yilgi "Structured Programming with go to Statements" maqolasi asosan optimallashtirish haqida emas. U `goto` ni olib tashlash dasturning samaradorligiga qanday ta'sir qilishi va strukturali konstruksiyalar qachon yetarli emasligi haqida. Mashhur jumla shu kontekstda keladi.

Knuth dasturchilar dasturning muhim bo'lmagan qismlarining tezligi haqida o'ylashga juda ko'p vaqt sarflashini va bu urinishlar debugging va texnik xizmatga salbiy ta'sir qilishini yozadi. Shuning uchun u kichik samaradorliklarni taxminan 97% vaqt unutishni taklif qiladi va aynan shu yerda mashhur gap keladi: *"premature optimization is the root of all evil"*.

Lekin keyingi jumla ko'pincha tushirib qoldiriladi: Knuth darhol muhim 3% dagi imkoniyatlarni qo'ldan bermaslik kerakligini qo'shadi. Yaxshi dasturchi bu muhim kodni sinchiklab ko'rib chiqadi, lekin faqat uni aniqlagandan keyin. Va Knuth sezgining ishonchsizligini ta'kidlaydi: dasturchilarning qaysi qism qimmat ekanligi haqidagi taxminlari o'lchovda ko'pincha noto'g'ri chiqadi. U o'lchov vositalarini (profiler'larni) qadrlaydi va ular kompilyatorlarda standart bo'lishini istaydi.

Bundan tashqari, xuddi shu maqolada Knuth o'zining misolida taxminan 12% tezlashuv beradigan o'zgarishni ko'rsatadi va bunday oson olinadigan foydani jiddiy muhandislikda e'tiborsiz qoldirmaslik kerakligini aytadi. Ya'ni Knuth optimallashtirishga qarshi emas. U **o'lchovsiz** va **noto'g'ri joydagi** optimallashtirishga qarshi.

### Muratori'ning tanqidi

Casey Muratori 2023 yilgi "\"Clean\" Code, Horrible Performance" maqolasida clean code adabiyotidagi klassik misolni oladi: `Shape` bazaviy klassi, uning `Square`, `Rectangle`, `Triangle`, `Circle` vorislari va virtual `Area()` metodi. Keyin u kod tuzilishiga ta'sir qiladigan besh qoidani ajratadi: switch o'rniga polimorfizm, obyektlarning ichki tuzilishini bilmaslik, kichik funksiyalar, bitta ish qiladigan funksiyalar va DRY.

Uning o'lchovlari (C++, shakllar massivining umumiy maydonini hisoblash): polimorfizmni `switch` bilan almashtirish taxminan 1.5 baravar tezlik beradi. Ma'lumot va amalni jadvalga birlashtirish (ya'ni "ichki tuzilmani bilmaslik" qoidasini buzish) 10 baravar va undan ko'p. Murakkabroq variantda (burchaklar soni bilan vaznlangan maydon) farq taxminan 15 baravargacha o'sadi, va oz optimallashtirilgan AVX versiyasi toza koddan 20-25 baravar tez.

Muratori'ning xulosasi: besh qoidadan u faqat DRY ni (izoh bilan) saqlaydi va qolgan to'rttasini rad etadi. U texnik xizmat qulayligi qonuniy maqsad ekanini qabul qiladi, lekin narx juda yuqori ekanini va bu qoidalar ularning performance narxi haqida ogohlantirishsiz o'rgatilmasligi kerakligini aytadi.

### Ousterhout va Martin

Ousterhout va Martin'ning ochiq munozarasida performance alohida mavzu emas, lekin u `PrimeGenerator` misolida tabiiy ravishda chiqadi. Martin kodni o'qilishi uchun qayta tuzganda bitta siklni ikkiga bo'ladi. Ousterhout yangi versiyani o'lchaydi va u oldingilaridan bir necha baravar sekin ekanini ko'rsatadi, chunki yangi tuzilma oldingi versiya erta to'xtay oladigan joyda ortiqcha ish qiladi. Martin profiling qilmaganini tan oladi va sikllarni qayta birlashtiradi.

Bu epizodning darsi ikkala tomon uchun ham qulay emas, lekin juda foydali: **o'qilish uchun qilingan tuzilma o'zgarishi algoritmning ish hajmini o'zgartirishi mumkin, va buni faqat o'lchov ko'rsatadi.**

## Chuqurroq: uch pozitsiyani birlashtirish

Uchta manbani birga o'qisak, ular bir-biriga zid emas, balki turli masshtabdagi gaplar ekanini ko'ramiz.

### Ish hajmi va ish narxi

Performance'ni ikki qismga ajratish foydali. **Ish hajmi** - algoritm qancha ish qiladi: nechta so'rov, nechta iteratsiya, qaysi murakkablik sinfi. **Ish narxi** - har bir ish birligi qancha turadi: virtual chaqiruv, obyekt yaratish, kesh miss.

Ish hajmidagi xato deyarli har doim muhim: N+1 so'rov (95-dars), O(n²) qidiruv, keraksiz ikkinchi sikl (Ousterhout va Martin epizodi). Bu xatolar odatda o'qilishni yaxshilash bilan ham tuzatiladi: toza kod ish hajmini ko'rinadigan qiladi.

Ish narxi esa faqat issiq siklda muhim. Muratori o'lchagan narsa - aynan ish narxi: bir xil hajmdagi ish uchun virtual chaqiruv, ma'lumotning tarqoq joylashuvi va obyektlar qatlami narxi. Bu farq shakllar massivi millionlab elementli bo'lganda va hisoblashning o'zi arzon bo'lganda maksimal.

### Node.js backend'da vaqt qayerga ketadi

Tipik NestJS endpoint'ida vaqtning katta qismi I/O'ga ketadi: ma'lumotlar bazasi, tashqi API, tarmoq. Agar endpoint 200 ms javob bersa va 180 ms DB'da bo'lsa, CPU kodini ikki baravar tezlashtirish javobni 190 ms ga tushiradi. Bu Amdahl qonunining oddiy natijasi va Knuth'ning ogohlantirishining amaliy shakli.

Lekin har bir backend'da CPU-bound qismlar ham bor: telemetriya qayta ishlash, hisobot agregatsiyasi, katta JSON serializatsiyasi, geofence tekshiruvi. Transport parki platformasida bu ayniqsa ko'p: har bir tracker sekundiga bir nuqta yuborsa, minglab mashinalar uchun bu sekundiga minglab nuqta. Bu yerda Muratori haq: `GeoPoint` klassi, har bir nuqta uchun `Date` obyekti va `map().filter().map()` zanjiri o'lchanadigan narxga ega. Node.js'da qo'shimcha omil - garbage collector: qisqa umrli obyektlar soni ko'p bo'lsa, GC pauzalari butun jarayonni, shu jumladan HTTP so'rovlarni ham sekinlashtiradi.

### Amaliy qoida

1. **Ish hajmini doim to'g'ri qiling.** N+1, keraksiz to'liq skan, ikki marta qilingan ish - bularni "keyin" ga qoldirmang. Bu premature optimization emas, bu to'g'ri dizayn.
2. **Ish narxini faqat o'lchov ko'rsatgan joyda optimallashtiring.** Profiler (`node --cpu-prof`, Chrome DevTools, clinic.js) yoki benchmark. Sezgi bilan emas.
3. **Optimallashtirilgan kodni izolyatsiya qiling.** Issiq sikl bitta kichik, aniq nomlangan funksiyada, ochiq API toza qoladi. 52-darsdagi chuqur modul g'oyasi: oddiy interfeys orqasida murakkab implementatsiya.
4. **Nega shunday yozilganini hujjatlang.** "Bu yerda obyekt yaratilmaydi, chunki profiling'da GC bosimi ko'rindi" degan izoh keyingi dasturchini kodni "tozalab" sekinlashtirishdan saqlaydi (32-dars).
5. **Characterization test bilan himoyalang.** Optimallashtirish xatti-harakatni o'zgartirmasligi kerak, va buni test tasdiqlaydi (79-dars).

## Misol: geofence tekshiruvi

Har bir yangi GPS nuqta uchun mashina ruxsat etilgan hududlardan birida ekanini tekshirish. "Toza" OOP variant:

```ts
interface Zone {
  contains(lat: number, lng: number): boolean;
}

class CircleZone implements Zone {
  constructor(private readonly centerLat: number, private readonly centerLng: number, private readonly radiusKm: number) {}
  contains(lat: number, lng: number): boolean {
    return approxDistanceKm(this.centerLat, this.centerLng, lat, lng) <= this.radiusKm;
  }
}

class RectZone implements Zone {
  constructor(private readonly minLat: number, private readonly minLng: number, private readonly maxLat: number, private readonly maxLng: number) {}
  contains(lat: number, lng: number): boolean {
    return lat >= this.minLat && lat <= this.maxLat && lng >= this.minLng && lng <= this.maxLng;
  }
}

function approxDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const kmPerDegLat = 111.32;
  const kmPerDegLng = 111.32 * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));
  return Math.hypot((lat2 - lat1) * kmPerDegLat, (lng2 - lng1) * kmPerDegLng);
}

export function isInsideAny(zones: Zone[], lat: number, lng: number): boolean {
  return zones.some((z) => z.contains(lat, lng));
}
```

Bu kod o'qilishi oson va yangi zona turini qo'shish oson (54-dars, OCP). Ko'p holatda bu to'g'ri tanlov: kompaniyada 20 ta zona va sekundiga 50 ta nuqta bo'lsa, farqni o'lchab ham topib bo'lmaydi.

Endi profiling ko'rsatdi deylik: 5000 mashina, har biri uchun 300 ta zona, va `isInsideAny` CPU vaqtining 60% ini oladi. Birinchi savol - ish hajmi: har bir nuqtani 300 zona bilan solishtirish shartmi?

```ts
type BoundingBox = { minLat: number; minLng: number; maxLat: number; maxLng: number };

type IndexedZone = { box: BoundingBox; zone: Zone };

/** Zonalarni avval arzon to'rtburchak bilan filtrlaydi, aniq tekshiruv faqat nomzodlar uchun. */
export class ZoneIndex {
  constructor(private readonly zones: readonly IndexedZone[]) {}

  isInsideAny(lat: number, lng: number): boolean {
    for (const { box, zone } of this.zones) {
      if (lat < box.minLat || lat > box.maxLat || lng < box.minLng || lng > box.maxLng) continue;
      if (zone.contains(lat, lng)) return true;
    }
    return false;
  }
}
```

Bu o'zgarish ish narxini emas, ish hajmini kamaytiradi: ko'pchilik zonalar uchun aniq hisob umuman bajarilmaydi. Polimorfizm saqlanib qoldi, chunki u endi issiq yo'lda emas. Agar bu ham yetmasa, keyingi qadam - fazoviy indeks (grid yoki R-tree) bilan nomzodlar sonini 300 dan 2-3 gacha kamaytirish. Va faqat shundan keyin, agar profiling hali ham `contains` chaqiruvlarini ko'rsatsa, Muratori uslubidagi ustunli massivlar va `switch`.

Bu tartib muhim: avval ish hajmi (ko'pincha o'qilishni buzmaydi), keyin ish narxi (ko'pincha buzadi).

## Qachon qo'llamaslik kerak

- **"Keyin optimallashtiramiz" ish hajmi xatolari uchun.** N+1 yoki O(n²) ni "premature optimization" deb qoldirish Knuth iqtibosini noto'g'ri ishlatish. Bu kod toza emas, bu xato.
- **Muratori'ning raqamlarini to'g'ridan-to'g'ri ko'chirish.** Uning o'lchovlari C++ da, CPU-bound issiq siklda. V8'ning JIT kompilyatori monomorf chaqiruvlarni inline qilishi mumkin va I/O-bound servisda farq yo'qolib ketadi. Raqamlar sizning sharoitingizda boshqacha bo'ladi: o'zingiz o'lchang.
- **Benchmark'siz "tezroq" yozish.** `for` har doim `map` dan tezmi? V8 versiyasiga, massiv hajmiga va JIT holatiga bog'liq. Mikro-benchmark ham aldashi mumkin: real yuklama bilan o'lchang.
- **Performance budjeti bo'lmagan joyda.** Admin panelda kuniga 10 marta ochiladigan hisobot 2 soniya yuklansa, uni optimallashtirish hech kimga foyda bermaydi. Foydalanuvchi yoki biznes talabi bo'lmasa, o'qilish ustun.
- **Abstraksiyani "performance uchun" oldindan olib tashlash.** Muratori'ning tanqidi abstraksiyalar narxi borligini isbotlaydi, lekin har bir joyda narx sezilarli ekanini emas. Abstraksiyani faqat issiq yo'lda va o'lchovdan keyin olib tashlang.

## Stack'da: o'lchash vositalari

- **Node.js.** `node --cpu-prof` CPU profilini yozadi, uni Chrome DevTools'da ochish mumkin. `--heap-prof` xotira uchun. `performance.now()` va `PerformanceObserver` aniq vaqt o'lchash uchun.
- **Benchmark.** tinybench yoki mitata kabi kutubxonalar bilan mikro-benchmark, lekin ularning natijasini doim real yuklamada tasdiqlang.
- **Production.** OpenTelemetry trace'lari endpoint vaqtini DB, tashqi API va CPU qismlariga bo'ladi. Bu "vaqt qayerga ketyapti" savoliga eng halol javob (88-dars, logging bilan birga).
- **PostgreSQL.** `EXPLAIN ANALYZE` va `pg_stat_statements` - backend performance muammolarining ko'pchiligi shu yerda.
- **React.** React DevTools Profiler va React Compiler. Ko'p holatda keraksiz render'lar ortiqcha state va effektlardan keladi (92-dars), memoizatsiyaning yo'qligidan emas.

## Xulosa

- Knuth optimallashtirishga emas, o'lchovsiz va noto'g'ri joydagi optimallashtirishga qarshi: 97% holatda kichik samaradorlikni unuting, lekin muhim 3% ni o'lchov bilan toping va o'tkazib yubormang.
- Muratori abstraksiyalarning ish narxi real ekanini ko'rsatadi: CPU-bound issiq siklda farq bir necha baravardan o'n baravargacha bo'lishi mumkin.
- Ousterhout va Martin epizodi: o'qilish uchun qilingan qayta tuzish ish hajmini o'zgartirishi mumkin, va buni faqat profiling ko'rsatadi.
- Ish hajmini doim to'g'ri qiling, ish narxini faqat profiler ko'rsatgan joyda optimallashtiring.
- Optimallashtirilgan kodni kichik funksiyaga izolyatsiya qiling, nega shunday ekanini yozing va characterization test bilan himoyalang.
