---
n: 76
slug: asosiy-refaktoringlar
title: "Asosiy refaktoringlar to'plami"
summary: "Fowler katalogining birinchi o'rganilishi kerak bo'lgan refaktoringlari: Extract/Inline Function, Extract/Inline Variable, Change Function Declaration, Encapsulate Variable, Introduce Parameter Object, Combine Functions into Class/Transform va Split Phase. Har birining mexanikasi, juftligi va TypeScript'dagi nozik joylari."
duration: 40
sources:
  - id: refactoring
    note: "6-bob \"A First Set of Refactorings\" va 8-bob \"Moving Features\" (Move Function, Slide Statements, Split Loop, Replace Loop with Pipeline); 5-bob katalog formati"
  - id: refactoring-catalog
    note: "Refaktoringlarning 2-nashrdagi nomlari va eski nomlari (aliases): Extract Method -> Extract Function, Introduce Explaining Variable -> Extract Variable, Rename Method -> Change Function Declaration"
quiz:
  - q: "Fowler bo'yicha kod blokini Extract Function bilan chiqarish uchun asosiy mezon nima?"
    options:
      - "Blok 10 qatordan uzun bo'lsa"
      - "Blok kamida ikki joyda qayta ishlatilsa"
      - "Blok nima qilishini tushunish uchun uni o'qish va tahlil qilish kerak bo'lsa: niyat va implementatsiyani ajratish"
      - "Blokda sikl bo'lsa"
    answer: 2
    explain: "Fowler 2-nashrda uzunlik yoki qayta ishlatish emas, \"niyat va implementatsiyani ajratish\" mezonini tavsiya qiladi. Agar blok nima qilishini tushunish uchun vaqt sarflash kerak bo'lsa, uni shu \"nima\" nomi bilan funksiyaga chiqaring, hatto u bitta qator bo'lsa ham."
  - q: "Change Function Declaration'ning \"migration mechanics\" usuli qachon kerak?"
    options:
      - "Funksiya juda ko'p joydan chaqirilsa yoki published API bo'lsa: yangi funksiya yaratib, eskisini unga delegatsiya qilasiz va chaqiruvchilarni bosqichma-bosqich o'tkazasiz"
      - "Funksiya faqat bitta joydan chaqirilsa"
      - "Funksiyada parametr bo'lmasa"
      - "IDE rename funksiyasi bo'lmasa"
    answer: 0
    explain: "Oddiy mexanika (bitta qadamda o'zgartirish) chaqiruvchilar kam va hammasi qo'lingizda bo'lganda ishlaydi. Aks holda yangi deklaratsiya yaratiladi, eski funksiya unga delegatsiya qiladi va chaqiruvchilar bosqichma-bosqich ko'chiriladi. Bu parallel change'ning funksiya darajasidagi ko'rinishi."
  - q: "Combine Functions into Transform va Combine Functions into Class o'rtasidagi muhim farq nima?"
    options:
      - "Transform faqat React'da ishlaydi"
      - "Transform hosila qiymatlarni yangi yozuvga yozadi; agar asl ma'lumot kodda o'zgartirilsa, hosila qiymatlar eskirib qoladi, shuning uchun bu holatda Class afzal"
      - "Class har doim tezroq"
      - "Ular orasida farq yo'q"
    answer: 1
    explain: "Fowler aynan shu farqni ta'kidlaydi: transform nusxa yaratadi va hosila qiymatlarni hisoblab qo'yadi. Agar manba ma'lumot keyin o'zgarsa, nomuvofiqlik paydo bo'ladi. Klass esa hisobni har safar joriy holatdan qiladi."
  - q: "Quyidagi kodga qaysi refaktoring eng mos? `if (order.quantity * order.itemPrice - Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 > 1_000_000) {...}`"
    options:
      - "Inline Variable"
      - "Split Phase"
      - "Encapsulate Variable"
      - "Extract Variable: `basePrice`, `quantityDiscount` kabi nomlangan qismlarga bo'lish"
    answer: 3
    explain: "Murakkab ifoda tushunarsiz bo'lsa, Extract Variable uning qismlariga nom beradi. Agar bu nomlar funksiyadan tashqarida ham ma'noli bo'lsa, keyingi qadam Extract Function yoki Replace Temp with Query bo'lishi mumkin."
  - q: "Nega Fowler Extract Function'dan keyin ham ko'pincha Inline Function'ni ishlatishini aytadi?"
    options:
      - "Chunki Extract Function xato"
      - "Chunki inline qilish performance'ni oshiradi"
      - "Chunki refaktoring o'zgarish haqida: noto'g'ri bo'lingan kodni avval birlashtirib, keyin to'g'ri chegaralar bo'yicha qayta bo'lish kerak bo'ladi"
      - "Chunki TypeScript kichik funksiyalarni yoqtirmaydi"
    answer: 2
    explain: "6-bobning kirishida Fowler eng ko'p ishlatadigan refaktoringlari Extract Function va Extract Variable ekanini, ularning teskarilari (Inline) ham tez-tez kerak bo'lishini aytadi. Nomlar va chegaralar tushuncha o'sishi bilan o'zgaradi."
  - q: "Split Phase qaysi holatga eng mos?"
    options:
      - "CSV import: satrlarni o'qish va validatsiya qilish bir xil siklda biznes qoidalari bilan aralashgan"
      - "Funksiya ikkita parametr oladi"
      - "Klassda getter yo'q"
      - "O'zgaruvchi ikki marta qayta yoziladi"
    answer: 0
    explain: "Split Phase kod ikki xil ishni ketma-ket qilganda qo'llanadi: avval kirishni parse qilish, keyin uni qayta ishlash. Ular orasida aniq oraliq ma'lumot strukturasi paydo bo'ladi. Oxirgi variant Split Variable uchun."
task:
  title: "Split Phase va Combine Functions into Class"
  prompt: |
    Quyidagi funksiya GPS treker'dan kelgan CSV qatorlarini o'qiydi va yo'l hisobotini tuzadi. Parsing, hisob va formatlash aralashib ketgan.

    1. Split Phase qo'llang: birinchi bosqich CSV'ni `TrackPoint[]` ga aylantiradi, ikkinchisi hisobot tuzadi.
    2. Hisob funksiyalarini (masofa, maksimal tezlik, to'xtashlar) bitta joyga yig'ing: Combine Functions into Class yoki Transform - qaysi biri mos ekanini asoslang.
    3. Har bir qadamni katalog nomi bilan belgilang va qadamlar orasida testlar yashil qolishini ta'minlang.
  lang: ts
  starter: |
    export function tripReport(csv: string): string {
      const lines = csv.trim().split("\n").slice(1);
      let dist = 0;
      let maxSpeed = 0;
      let stops = 0;
      let prev: { lat: number; lng: number } | null = null;
      for (const line of lines) {
        const [ts, lat, lng, speed] = line.split(",");
        const p = { lat: Number(lat), lng: Number(lng) };
        const s = Number(speed);
        if (Number.isNaN(p.lat) || Number.isNaN(p.lng) || !ts) continue;
        if (prev) {
          const dLat = ((p.lat - prev.lat) * Math.PI) / 180;
          const dLng = ((p.lng - prev.lng) * Math.PI) / 180;
          const a = Math.sin(dLat / 2) ** 2 +
            Math.cos((prev.lat * Math.PI) / 180) * Math.cos((p.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
          dist += 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }
        if (s > maxSpeed) maxSpeed = s;
        if (s === 0) stops++;
        prev = p;
      }
      return `Masofa: ${dist.toFixed(1)} km, maks. tezlik: ${maxSpeed} km/soat, to'xtashlar: ${stops}`;
    }
  solution: |
    type Coordinates = { lat: number; lng: number };
    type TrackPoint = { recordedAt: string; position: Coordinates; speedKmh: number };

    const EARTH_RADIUS_KM = 6371;

    // 1-bosqich: parsing (Split Phase)
    export function parseTrackCsv(csv: string): TrackPoint[] {
      return csv
        .trim()
        .split("\n")
        .slice(1)
        .map(parseLine)
        .filter((p): p is TrackPoint => p !== null);
    }

    function parseLine(line: string): TrackPoint | null {
      const [recordedAt, lat, lng, speed] = line.split(",");
      const position = { lat: Number(lat), lng: Number(lng) };
      if (Number.isNaN(position.lat) || Number.isNaN(position.lng) || !recordedAt) return null;
      return { recordedAt, position, speedKmh: Number(speed) };
    }

    // 2-bosqich: hisob (Combine Functions into Class)
    export class Trip {
      constructor(private readonly points: readonly TrackPoint[]) {}

      get distanceKm(): number {
        let total = 0;
        for (let i = 1; i < this.points.length; i++) {
          total += haversineKm(this.points[i - 1].position, this.points[i].position);
        }
        return total;
      }

      get maxSpeedKmh(): number {
        return this.points.reduce((max, p) => Math.max(max, p.speedKmh), 0);
      }

      get stopCount(): number {
        return this.points.filter((p) => p.speedKmh === 0).length;
      }
    }

    function toRadians(degrees: number): number {
      return (degrees * Math.PI) / 180;
    }

    function haversineKm(from: Coordinates, to: Coordinates): number {
      const dLat = toRadians(to.lat - from.lat);
      const dLng = toRadians(to.lng - from.lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;
      return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    export function tripReport(csv: string): string {
      const trip = new Trip(parseTrackCsv(csv));
      return `Masofa: ${trip.distanceKm.toFixed(1)} km, maks. tezlik: ${trip.maxSpeedKmh} km/soat, to'xtashlar: ${trip.stopCount}`;
    }
  solutionNotes: |
    - **Split Phase**: `parseTrackCsv` faqat CSV formatini biladi, `Trip` esa faqat `TrackPoint` ni. Yangi treker formati (JSON) qo'shilsa, faqat birinchi bosqich o'zgaradi.
    - **Extract Function**: Haversine formulasi `haversineKm` ga chiqdi, takrorlangan `* Math.PI / 180` esa `toRadians` ga. Nom formulaning niyatini aytadi.
    - **Split Loop**: bitta sikl uch ishni qilardi. Endi har bir hisob alohida. Bu ro'yxatni uch marta aylanadi: GPS treklar odatda minglab nuqta, bu yerda farq sezilmaydi. Agar profiling boshqacha ko'rsatsa, sikllarni qayta birlashtirish oson.
    - **Replace Loop with Pipeline**: `maxSpeedKmh` va `stopCount` uchun. `distanceKm` uchun oddiy sikl qoldi: juftliklar bo'yicha aylanish pipeline bilan aniqroq bo'lmaydi.
    - **Combine Functions into Class**, Transform emas: `Trip` ning hisoblari bitta manbadan (points) olinadi va ularni oldindan hisoblab, maydon sifatida saqlash shart emas. Ma'lumot o'zgarmas (`readonly`), shuning uchun Transform ham ishlardi. Class tanlandi, chunki keyinchalik `durationMinutes`, `averageSpeed` kabi yangi hisoblar tabiiy ravishda shu yerga qo'shiladi.
    - Muhim: eski kod `NaN` tezlikni `maxSpeed` ga ta'sir qilmaydigan qilib qoldirardi (`NaN > x` false). Yangi `Math.max(max, NaN)` esa `NaN` qaytaradi. Bu xatti-harakat farqi. Yo `parseLine` da tezlikni ham tekshirish (bu yangi xatti-harakat, alohida commit), yo eski semantikani saqlash kerak. Characterization test buni ushlaydi.
  checklist:
    - "Parsing va hisob orasida aniq TrackPoint tipi bor"
    - "Haversine formulasi nomlangan funksiyada va takrorsiz"
    - "Har bir hisob (masofa, tezlik, to'xtash) alohida va nomlangan"
    - "Class va Transform orasidagi tanlov asoslandi"
    - "NaN tezlik kabi chegaraviy holatda eski va yangi natija solishtirildi"
---

## Muammo

72-75-darslarda 24 ta smell'ni ko'rdik va har biri uchun tavsiya qilingan refaktoringlar ro'yxatini sanadik. Lekin ro'yxat bilish bilan refaktoringni xavfsiz bajarish orasida katta farq bor. "Extract Function qildim" degan PR'da ko'pincha bir nechta muammo bor: chiqarilgan funksiya tashqi o'zgaruvchini o'zgartiradi, ikki funksiya o'rtasida tartib o'zgargan, yoki nom niyatni emas, implementatsiyani aytadi.

Fowler katalogida 60 dan ortiq refaktoring bor. Ularning hammasini bir xil chuqurlikda bilish shart emas. Kitobning 6-bobi aynan shu savolga javob beradi: qaysi refaktoringlarni birinchi o'rganish kerak. Fowler bu bobni o'zi eng foydali deb hisoblaydigan to'plam bilan boshlaydi.

## Asosiy g'oya

Katalogdagi har bir refaktoring bir xil formatda tasvirlangan: nom, qisqa eskiz (oldin va keyin), motivatsiya (nega va qachon), mexanika (aniq qadamlar) va misollar. Mexanika qismi eng muhim: u refaktoringni xavfsiz bajarish uchun qadamlar ketma-ketligi va har qadamdan keyin test.

6-bob "A First Set of Refactorings" quyidagilardan iborat:

1. **Extract Function** va uning teskarisi **Inline Function**
2. **Extract Variable** va uning teskarisi **Inline Variable**
3. **Change Function Declaration** (Rename Function, Add/Remove Parameter shu yerga kiradi)
4. **Encapsulate Variable**
5. **Rename Variable**
6. **Introduce Parameter Object**
7. **Combine Functions into Class**
8. **Combine Functions into Transform**
9. **Split Phase**

Fowler bobning kirishida muhim fikr aytadi: u eng ko'p ishlatadigan refaktoringlar - kodni funksiyaga yoki o'zgaruvchiga chiqarish. Lekin refaktoring o'zgarish haqida, shuning uchun teskari amallar (Inline) ham tez-tez kerak bo'ladi. Chiqarish asosan nom berish, va tushuncha o'sgani sari nomlar ham o'zgaradi.

2-nashrda ko'p nomlar o'zgargan. Agar eski maqolalarda "Extract Method" yoki "Introduce Explaining Variable" ni ko'rsangiz, bu Extract Function va Extract Variable. Katalog sahifasi har bir refaktoringning eski nomlarini ham ko'rsatadi.

## Chuqurroq: har bir refaktoringning mohiyati

### Extract Function va Inline Function

**Qachon:** Fowler 2-nashrda aniq mezon beradi: niyat va implementatsiyani ajratish. Agar kod bo'lagi nima qilishini tushunish uchun uni o'qib, tahlil qilish kerak bo'lsa, uni "nima" ni aytuvchi nom bilan funksiyaga chiqaring. Uzunlik yoki qayta ishlatish emas, aynan shu. Fowler o'z tajribasida bitta qatorli funksiyalar ham, agar nom niyatni aytsa, o'zini oqlashini qayd etadi.

**Mexanikaning asosiy nuqtalari:**

- Yangi funksiyani "nima qilishi" bo'yicha nomlang, "qanday qilishi" bo'yicha emas. Yaxshi nom topa olmasangiz, chiqarmang.
- Chiqariladigan kod ishlatadigan lokal o'zgaruvchilarni tekshiring. Faqat o'qiladiganlar parametr bo'ladi.
- Agar chiqariladigan kod lokal o'zgaruvchini o'zgartirsa va u keyin ishlatilsa, funksiya uni qaytarishi kerak. Bir nechta shunday o'zgaruvchi bo'lsa, avval boshqa refaktoringlar (Split Variable, Replace Temp with Query) bilan holatni soddalashtiring.
- Kompilyatsiya, test.

**Inline Function** - teskarisi. Funksiya tanasi nomidek aniq bo'lsa, yoki noto'g'ri bo'lingan funksiyalar guruhini qayta tashkil qilish kerak bo'lsa, ularni avval bitta joyga yig'ib, keyin qayta chiqarish. Agar funksiya polimorfik bo'lsa (subklasslarda override qilingan), uni inline qilib bo'lmaydi.

### Extract Variable va Inline Variable

Murakkab ifodani tushunish qiyin bo'lsa, uning qismlariga nom bering. Fowler qo'shimcha qiladi: agar bu nom faqat funksiya ichida emas, kengroq kontekstda ham ma'noli bo'lsa, o'zgaruvchi o'rniga funksiya chiqarishni o'ylang (Extract Function yoki Replace Temp with Query). Klass ichida esa bu ko'pincha getter.

Inline Variable - nom ifodadan ko'proq narsa aytmasa, yoki o'zgaruvchi atrofidagi refaktoringga xalaqit bersa.

### Change Function Declaration

Funksiya nomi, parametrlar ro'yxati - bu tizim qismlarining bir-biriga ulanish nuqtalari. Ular yaxshi bo'lsa, tizimga yangi qism qo'shish oson. Bu refaktoring nomni o'zgartirish, parametr qo'shish va olib tashlashni qamrab oladi.

Kitobda ikki mexanika bor:

- **Oddiy mexanika** - barcha chaqiruvchilar qo'lingizda va ularni bir vaqtda o'zgartirish oson bo'lsa: deklaratsiyani o'zgartiring, barcha chaqiruvlarni yangilang, test.
- **Migration mexanikasi** - chaqiruvchilar ko'p yoki funksiya published API bo'lsa: yangi nom bilan yangi funksiya yarating, uning tanasiga eski kodni ko'chiring, eski funksiya yangisini chaqirsin. Keyin chaqiruvchilarni bosqichma-bosqich o'tkazing va oxirida eski funksiyani o'chiring (yoki deprecated qilib qoldiring).

Ikkinchi mexanika 80-darsdagi parallel change'ning kichik ko'rinishi.

### Encapsulate Variable

O'zgaruvchiga (ayniqsa modul yoki global darajadagi) to'g'ridan-to'g'ri kirish o'rniga uni funksiyalar bilan o'rash. Bu Global Data va Mutable Data smell'lariga (73-dars) birinchi davo: barcha kirishlar bitta joydan o'tadi va endi ularni kuzatish, validatsiya qo'shish yoki ma'lumot shaklini o'zgartirish mumkin. Fowler qo'shimcha eslatadi: agar o'zgaruvchi obyektga murojaat qilsa, getter faqat murojaatni himoya qiladi, obyektning ichki tarkibini emas. To'liq himoya uchun nusxa qaytarish yoki obyektni o'zgarmas qilish kerak.

### Rename Variable

Eng oddiy, lekin eng ko'p ishlatiladigan. Fowler o'zgaruvchining ko'rinish doirasi qanchalik keng bo'lsa, nom shunchalik muhim ekanini ta'kidlaydi. Lambda ichidagi bir harfli nom normal, modul darajasidagi bir harfli nom esa yo'q (15-dars).

### Introduce Parameter Object

Doim birga yuradigan ma'lumotlar guruhini bitta tuzilmaga birlashtirish (Data Clumps, Long Parameter List). Fowler bu refaktoringning chuqurroq qiymatini ko'rsatadi: yangi tuzilma paydo bo'lgandan keyin unga xatti-harakat ko'chiriladi va u ko'pincha domen tushunchasiga aylanadi. Masalan, `from` va `to` parametrlari `Period` ga aylangandan keyin `period.contains(date)` paydo bo'ladi.

### Combine Functions into Class

Bir guruh funksiyalar bir xil ma'lumot ustida ishlasa (odatda uni parametr sifatida oladi), ularni klassga birlashtirish. Bu funksiyalarning umumiy muhitini aniq qiladi, chaqiruvlarda argumentlar kamayadi va obyektni tizimning boshqa qismlariga uzatish osonlashadi.

### Combine Functions into Transform

Muqobil: kirish ma'lumotini olib, unga barcha hosila qiymatlarni qo'shib yangi yozuv qaytaradigan transform funksiya. Fowler muhim farqni ko'rsatadi: agar manba ma'lumot kodda o'zgartirilsa, transform hosila qiymatlari eskirib qoladi va nomuvofiqlik paydo bo'ladi. Shuning uchun o'zgaruvchan ma'lumot bilan klass afzal. Ma'lumot o'zgarmas bo'lsa (masalan, Redux store'dan kelgan qiymat yoki API javobi), transform ham yaxshi ishlaydi.

### Split Phase

Kod ikki xil ishni ketma-ket qilayotgan bo'lsa, uni ikki alohida modul (bosqich) ga bo'lish. Eng aniq misol - kompilyator: matnni token'larga, keyin sintaksis daraxtiga, keyin kodga aylantirish. Lekin bu naqsh oddiy ilova kodida ham ko'p: so'rovni parse qilish va uni qayta ishlash, CSV import va biznes qoidalari, narxni hisoblash va uni formatlash. Ikki bosqich orasida aniq oraliq ma'lumot strukturasi bo'ladi va har bir bosqich mustaqil o'zgara oladi.

### Ko'chirish refaktoringlari

8-bobdan bir nechtasi ham asosiy to'plamga yaqin, chunki ular 73-74-darslardagi smell'larning davosi:

- **Move Function** va **Move Field** - Feature Envy va Shotgun Surgery uchun.
- **Slide Statements** - bog'liq kodni yonma-yon qo'yish. Ko'pincha Extract Function'dan oldingi tayyorgarlik qadami.
- **Split Loop** - bitta sikl ikki ishni qilsa, ikki siklga bo'lish. Fowler performance tashvishiga javob beradi: avval kodni aniq qiling, keyin kerak bo'lsa optimallashtiring. Ko'pincha sikl qayta ishlatish narxi arzimas.
- **Replace Loop with Pipeline** - Loops smell'i uchun.
- **Remove Dead Code** - ishlatilmaydigan kodni o'chirish. Version control uni eslab qoladi, komment qilib qoldirish shart emas.

## Misol: Extract Function'ning xavfli joyi

Ko'p dasturchilar Extract Function'ni "bloki belgilab, funksiyaga chiqarish" deb tushunadi. Lekin lokal holat bo'lganda bu xato beradi. Buyurtma narxini hisoblash:

```ts
type Line = { sku: string; unitPrice: number; quantity: number };

export function invoiceTotal(lines: Line[], promoCode?: string): number {
  let subtotal = 0;
  let discount = 0;
  for (const line of lines) {
    subtotal += line.unitPrice * line.quantity;
    if (line.quantity >= 10) discount += line.unitPrice * line.quantity * 0.05;
  }
  if (promoCode === "SPRING") discount += subtotal * 0.1;
  const vat = (subtotal - discount) * 0.12;
  return Math.round(subtotal - discount + vat);
}
```

Siklni `calculateSubtotal` ga chiqarishga urinsangiz, u ikki o'zgaruvchini (`subtotal`, `discount`) o'zgartiradi. Ikkalasini qaytaradigan funksiya yaratish (`return { subtotal, discount }`) ko'pincha noqulay nom va ma'nosiz tuzilma beradi. Fowler mexanikasi boshqa yo'lni ko'rsatadi: avval holatni soddalashtiring.

1-qadam, **Split Loop**: sikl ikki ishni qilyapti.

```ts
let subtotal = 0;
for (const line of lines) subtotal += line.unitPrice * line.quantity;

let discount = 0;
for (const line of lines) {
  if (line.quantity >= 10) discount += line.unitPrice * line.quantity * 0.05;
}
```

2-qadam, **Slide Statements**: promo chegirmani chegirma hisobi yoniga suramiz (u allaqachon yonida).

3-qadam, **Extract Function** va **Replace Loop with Pipeline**: endi har bir sikl bitta o'zgaruvchini hisoblaydi va chiqarish oson.

```ts
const BULK_QUANTITY = 10;
const BULK_DISCOUNT_RATE = 0.05;
const PROMO_RATES: Record<string, number> = { SPRING: 0.1 };
const VAT_RATE = 0.12;

function lineAmount(line: Line): number {
  return line.unitPrice * line.quantity;
}

function subtotalOf(lines: Line[]): number {
  return lines.reduce((sum, line) => sum + lineAmount(line), 0);
}

function bulkDiscount(lines: Line[]): number {
  return lines
    .filter((line) => line.quantity >= BULK_QUANTITY)
    .reduce((sum, line) => sum + lineAmount(line) * BULK_DISCOUNT_RATE, 0);
}

function promoDiscount(subtotal: number, promoCode?: string): number {
  const rate = promoCode ? (PROMO_RATES[promoCode] ?? 0) : 0;
  return subtotal * rate;
}

export function invoiceTotal(lines: Line[], promoCode?: string): number {
  const subtotal = subtotalOf(lines);
  const discount = bulkDiscount(lines) + promoDiscount(subtotal, promoCode);
  const taxable = subtotal - discount;
  return Math.round(taxable + taxable * VAT_RATE);
}
```

Har bir qadamdan keyin testlar ishga tushirildi. Diqqat: `(subtotal - discount) * 0.12` va `taxable * VAT_RATE` matematik jihatdan bir xil, lekin suzuvchi nuqta arifmetikasida qo'shish tartibi o'zgarsa, oxirgi xonada farq bo'lishi mumkin. Shu sababli pul hisobida yaxlitlash va tartib bo'yicha test bo'lishi shart. Pulni butun tiyinlarda saqlash (44-dars) bu muammoni butunlay yo'qotadi.

## Qachon qo'llamaslik kerak

- **IDE avtomatik refaktoringini ko'r-ko'rona ishonish.** TypeScript language service statik bog'lanishlarni yaxshi ko'radi, lekin dinamik kirishni (`obj[key]`, string bo'yicha DI token, Prisma `select` ichidagi maydon nomlari, JSON serializatsiya) ko'rmaydi. Rename Field API javobidagi maydon nomini o'zgartirsa, bu xatti-harakat o'zgarishi.
- **Nom topilmasa chiqarmang.** `processData2`, `handleStuff`, `helper` kabi nomli funksiyaga chiqarish kodni yomonlashtiradi: o'quvchi endi sakrashi ham kerak, nimani topishini ham bilmaydi.
- **Teskari refaktoringni unutmang.** Har bir Extract'ning Inline jufti bor. Agar chiqarilgan funksiyalar keyingi o'zgarishlarda doim birga o'zgarsa, ular noto'g'ri chegara bo'yicha bo'lingan. Ularni birlashtirish ham refaktoring.
- **Combine Functions into Class'ni har joyda.** Bitta-ikkita funksiya uchun klass yaratish Lazy Element (75-dars). Funksional uslubdagi kod bazasida Transform yoki shunchaki modul (bitta faylda bir guruh funksiya) ko'pincha tabiiyroq.
- **Split Phase bitta bosqichli muammoda.** Agar parsing ikki qatordan iborat bo'lsa, oraliq tip va ikki modul ortiqcha murakkablik.

## Stack'da: TypeScript, NestJS, React

- **VS Code refaktoringlari.** "Extract to function in module scope", "Extract to constant", "Move to a new file", "Convert parameters to destructured object" (Introduce Parameter Object'ning yarim avtomatik ko'rinishi). Ular mexanikaning bir qismini bajaradi, lekin testni ishga tushirish va nomni tanlash sizning ishingiz.
- **NestJS'da Change Function Declaration.** Servis metodi controller'lar, boshqa servislar va ehtimol queue processor'lar tomonidan chaqiriladi. Migration mexanikasi bilan eski metodni `@deprecated` JSDoc bilan yangi metodga delegatsiya qiluvchi qilib qoldiring: TypeScript eskirgan chaqiruvlarni chizib ko'rsatadi.
- **React'da Extract Function = custom hook yoki komponent.** Komponent ichidagi state va effekt guruhini `useVehicleTelemetry(vehicleId)` ga chiqarish Extract Function'ning React ko'rinishi. JSX bo'lagini `<FuelChart />` ga chiqarish ham shunday. Qoida o'sha: nom niyatni aytishi kerak.
- **Combine Functions into Transform React'da.** Server'dan kelgan ma'lumotni komponentga uzatishdan oldin `toVehicleViewModel(dto)` kabi transform bilan boyitish tabiiy, chunki React'da props o'zgarmas.
- **Encapsulate Variable va Zod.** Muhit o'zgaruvchilarini `process.env.X` bilan hamma joyda o'qish o'rniga, bitta `config` modulida Zod bilan parse qilib eksport qilish - Encapsulate Variable va validatsiya birgalikda (86-dars).

## Xulosa

- 6-bobdagi to'plam - Extract/Inline Function, Extract/Inline Variable, Change Function Declaration, Encapsulate Variable, Rename Variable, Introduce Parameter Object, Combine Functions into Class/Transform, Split Phase - kundalik refaktoringning asosi.
- Extract Function mezoni: niyat va implementatsiyani ajratish. Nom topilmasa, chiqarmang.
- Lokal holat Extract'ga xalaqit bersa, avval Split Loop, Split Variable, Slide Statements bilan soddalashtiring.
- Change Function Declaration'ning migration mexanikasi ko'p chaqiruvchili yoki published funksiyalar uchun.
- Har bir refaktoringning teskarisi bor. Noto'g'ri bo'lingan kodni avval birlashtirib, keyin qayta bo'lish ham to'g'ri yo'l.
