---
n: 32
slug: yaxshi-kommentlar
title: "Yaxshi kommentlar: nega, ogohlantirish, TODO"
summary: "Qaysi kommentlar haqiqatan qiymat beradi: niyat va sababni tushuntirish, oqibatlardan ogohlantirish, aniqlashtirish, TODO va huquqiy matn. Bu darsda har bir turni real TypeScript kodida ko'ramiz va TODO'larni boshqariladigan qilish usulini o'rganamiz."
duration: 30
sources:
  - id: cc1
    note: "Kommentlar haqidagi bob, \"Good Comments\" bo'limi: legal, informative, explanation of intent, clarification, warning of consequences, TODO, amplification, public API docs"
  - id: aposd
    note: "Kommentlar haqidagi boblar: koddan ko'rinmaydigan narsani yozish, past va yuqori darajadagi kommentlar, implementatsiya kommentlari"
  - id: code-complete
    note: "O'z-o'zini hujjatlovchi kod va kommentlash texnikalari haqidagi bob: kommentlar turlari va niyat kommentlari"
quiz:
  - q: "Qaysi komment \"niyatni tushuntirish\" turiga kiradi?"
    options:
      - "`// foydalanuvchini saqlaymiz` - `userRepo.save(user)` ustida"
      - "`// Provayder bir xil idempotency key bilan qayta so'rovni yangi to'lov deb hisoblamaydi, shuning uchun retry xavfsiz`"
      - "`// 2024-03-12: Aziz qo'shdi`"
      - "`// } // end if`"
    answer: 1
    explain: "Niyat kommenti nima uchun aynan shunday yozilganini aytadi, bu misolda nega retry xavfsiz. Birinchisi kodni takrorlaydi, uchinchisi git'ning ishini qiladi, to'rtinchisi yopuvchi qavs belgisi - ular yomon kommentlar (33-dars)."
  - q: "Ousterhout implementatsiya ichidagi kommentlar asosan nima haqida bo'lishi kerak deydi?"
    options:
      - "Har bir qator nima qilishi haqida"
      - "Kodning qanday ishlashi haqida batafsil"
      - "Kod nima qilayotgani va nega shunday qilayotgani haqida, ya'ni koddan tez ko'rinmaydigan darajada"
      - "Faqat muallif ismi haqida"
    answer: 2
    explain: "Ousterhout implementatsiya kommentlarini asosan \"nima\" va \"nega\" uchun tavsiya qiladi: kod bo'lagi umuman qanday maqsadga xizmat qiladi va nega shunday yondashuv tanlangan. \"Qanday\"ni kodning o'zi ko'rsatadi."
  - q: "Jamoada 400 ta TODO bor, ularning ko'pchiligi 2 yildan eski. Eng to'g'ri qadam qaysi?"
    options:
      - "Hammasini o'chirib, unutish"
      - "TODO yozishni butunlay taqiqlash"
      - "Har bir TODO'ga yangisini qo'shib turish"
      - "TODO'ni tracker'dagi tiket raqamiga bog'lash qoidasini kiritish, eskilarini ko'rib chiqib tiketga aylantirish yoki o'chirish"
    answer: 3
    explain: "TODO o'z-o'zidan yomon emas, lekin egasi va muddati bo'lmagan TODO hech qachon bajarilmaydi. Tiketga bog'lash ularni ko'rinadigan va boshqariladigan qiladi. Hammasini o'chirish ba'zi foydali ma'lumotni yo'qotadi, taqiq esa ularni yashirin bilimga aylantiradi."
  - q: "Quyidagi komment qaysi turga kiradi va o'rinlimi?\n\n```ts\n// DIQQAT: bu test real SMS provayderiga so'rov yuboradi va pul sarflaydi.\n// Faqat RUN_PAID_TESTS=1 bilan ishga tushiring.\n```"
    options:
      - "Oqibatlar haqida ogohlantirish, o'rinli"
      - "Shovqin komment, o'chirish kerak"
      - "Huquqiy komment, o'rinli"
      - "O'chirilgan kod, o'chirish kerak"
    answer: 0
    explain: "Bu - oqibatdan ogohlantirish. Koddan testning pul sarflashi ko'rinmaydi, va bu ma'lumot boshqa dasturchini xatodan saqlaydi. Yanada yaxshisi - buni kod bilan ham ta'minlash (masalan, `describe.skipIf`), lekin komment baribir sababni tushuntiradi."
  - q: "Regex ustidagi qaysi komment eng foydali?"
    options:
      - "`// regex`"
      - "`// Uzbekiston davlat raqami: 01 A 123 BC yoki 01 123 ABC formatlari; probellar ixtiyoriy`"
      - "`// bu regex murakkab, tegmang`"
      - "`// TODO: regexni tushunish`"
    answer: 1
    explain: "Aniqlashtiruvchi (clarification) komment murakkab ifoda qanday ma'lumotga mos kelishini misol bilan aytadi. Martin va McConnell ikkalasi ham bunday hollarda kommentni o'rinli deb biladi. Yanada yaxshisi - regexni nomlangan konstantaga chiqarish va testlar bilan qo'llab-quvvatlash."
task:
  title: "Integratsiya kodiga to'g'ri kommentlar yozish"
  prompt: |
    Quyidagi funksiya GPS-trekerlardan kelgan paketni qayta ishlaydi. Kod ishlaydi, lekin unda bir nechta "sirli" qaror bor va kommentlar faqat kodni takrorlaydi.

    Ma'lumot uchun (kodni yozgan muallifdan olingan):
    - Trekerlar ba'zan signal yo'qligida koordinatani 0,0 qilib yuboradi.
    - Tezlik paketda tugunda (knot) keladi, tizim esa km/soat ishlatadi.
    - Vaqt qurilmada UTC bo'yicha, lekin ba'zi eski modellar 1 soatga orqada qoladi, ular `firmware < 3` bilan ajratiladi.
    - Bufer to'lib qolsa qurilma eski paketlarni qayta yuboradi, shuning uchun takror paketlar bo'ladi. Tozalash hozircha yozilmagan (tiket: FLEET-412).

    Vazifa: shovqin kommentlarni olib tashlang, nomlarni yaxshilang va faqat koddan chiqmaydigan ma'lumot uchun komment yozing (sabab, ogohlantirish, TODO).
  lang: ts
  starter: |
    type Packet = { lat: number; lng: number; spd: number; ts: number; fw: number };
    type Point = { lat: number; lng: number; speedKmh: number; recordedAt: Date };

    // paketni nuqtaga aylantiradi
    export function toPoint(p: Packet): Point | null {
      // tekshiramiz
      if (p.lat === 0 && p.lng === 0) {
        return null;
      }
      // tezlik
      const s = p.spd * 1.852;
      // vaqt
      let t = p.ts;
      if (p.fw < 3) {
        t = t + 3600;
      }
      // qaytaramiz
      return { lat: p.lat, lng: p.lng, speedKmh: s, recordedAt: new Date(t * 1000) };
    }
  solution: |
    type TrackerPacket = {
      lat: number;
      lng: number;
      /** Tezlik, tugunda (knot). */
      speedKnots: number;
      /** Qurilma vaqti, Unix soniyalarda. */
      timestampSec: number;
      firmwareMajor: number;
    };

    type TrackPoint = { lat: number; lng: number; speedKmh: number; recordedAt: Date };

    const KMH_PER_KNOT = 1.852;
    const LEGACY_FIRMWARE_CLOCK_LAG_SEC = 60 * 60;

    function isNoFixPlaceholder(packet: TrackerPacket): boolean {
      // Signal yo'qligida trekerlar koordinatani 0,0 qilib yuboradi.
      // Bu Gvineya ko'rfazidagi haqiqiy nuqta emas, "fix yo'q" belgisi.
      return packet.lat === 0 && packet.lng === 0;
    }

    function correctedTimestampSec(packet: TrackerPacket): number {
      // 3-versiyadan oldingi proshivkalarda soat 1 soatga orqada qoladi.
      // Qurilmalarni yangilash rejalashtirilgan, shungacha shu tuzatish kerak.
      return packet.firmwareMajor < 3
        ? packet.timestampSec + LEGACY_FIRMWARE_CLOCK_LAG_SEC
        : packet.timestampSec;
    }

    /**
     * Treker paketini trek nuqtasiga aylantiradi.
     *
     * @returns signal yo'q (fix yo'q) paketlar uchun `null`
     *
     * DIQQAT: takror paketlar filtrlanmaydi. Bufer to'lganda qurilma eski
     * paketlarni qayta yuboradi, chaqiruvchi buni hisobga olishi kerak.
     */
    export function toTrackPoint(packet: TrackerPacket): TrackPoint | null {
      if (isNoFixPlaceholder(packet)) return null;
      // TODO(FLEET-412): takror paketlarni (qurilma + vaqt bo'yicha) shu yerda filtrlash.
      return {
        lat: packet.lat,
        lng: packet.lng,
        speedKmh: packet.speedKnots * KMH_PER_KNOT,
        recordedAt: new Date(correctedTimestampSec(packet) * 1000),
      };
    }
  solutionNotes: |
    - "tekshiramiz", "tezlik", "qaytaramiz" kommentlari o'chirildi: ular kodni takrorlaydi.
    - Birlik (knot, soniya) maydon nomiga va qisqa maydon kommentiga ko'chirildi. `1.852` sehrli soni `KMH_PER_KNOT` bo'ldi, endi u o'zini tushuntiradi.
    - 0,0 tekshiruvi alohida predicate funksiyaga chiqarildi. Nom "nima"ni aytadi, komment esa "nega"ni (bu koddan hech qachon ko'rinmaydi).
    - Proshivka tuzatishi uchun sabab kommenti yozildi. Usiz kelajakda kimdir `+ 3600`ni "xato" deb o'chirib yuborishi mumkin.
    - Takror paketlar haqida ikki joyda yozildi: interfeys kommentida chaqiruvchi uchun ogohlantirish, ichida esa tiketga bog'langan TODO. TODO'da tiket raqami bor, shuning uchun u kuzatiladi.
  checklist:
    - "Kodni takrorlaydigan kommentlar qolmadi"
    - "Birliklar nom yoki maydon kommentida aniq ko'rsatilgan"
    - "Har bir \"sirli\" qiymat (0,0, +3600) uchun nega degan izoh bor"
    - "TODO tracker tiketiga bog'langan"
    - "Chaqiruvchi bilishi kerak bo'lgan cheklov (takror paketlar) interfeys kommentida"
---

## Muammo

Oldingi darsda (31-dars) ko'rdikki, Martin ham, Ousterhout ham ba'zi kommentlarni zarur deb biladi. Lekin "zarur komment" nima ekanini aniq bilmagan jamoa ikki xil xatoga tushadi. Birinchisi: komment yozilmaydi, chunki "kod o'zini tushuntiradi", va bir yildan keyin hech kim `+ 3600` nega borligini bilmaydi. Ikkinchisi: kommentlar ko'p, lekin ularning hammasi "nima" haqida, va eng muhim savol - "nega" - javobsiz qoladi.

Real misol: to'lov service'ida `await sleep(1500)` qatori bor. Komment yo'q. Yangi dasturchi uni "keraksiz kechikish" deb o'chiradi, testlar o'tadi, production'da esa to'lov provayderi rate limit xatosini qaytara boshlaydi. Kechikishning sababi bitta jumlada yozilishi mumkin edi.

Bu darsning maqsadi - qiymat beradigan komment turlarini tanib olish va ularni to'g'ri yozish.

## Asosiy g'oya

*Clean Code*ning kommentlar bobida Martin "yaxshi kommentlar" ro'yxatini beradi. Steve McConnell *Code Complete*da kommentlarni turlarga ajratadi va ulardan eng qimmatlisi niyatni tushuntiruvchi va kod qila olmaydigan narsani aytuvchi kommentlar ekanini ta'kidlaydi. Ousterhout esa umumiy tamoyilni beradi: komment koddan ko'rinmaydigan narsani tasvirlashi kerak. Bu uch manbani birlashtirib, amaliy turlarni ko'ramiz.

### 1. Niyat va sabab ("nega")

Eng qimmatli tur. Kod *nima* qilayotganini ko'rsatadi, lekin *nega* shunday qilinganini ko'rsata olmaydi.

```ts
// Provayder 1 soniyada 1 tadan ortiq refund so'rovini 429 bilan rad etadi.
await sleep(1500);
```

Bu yerda komment ikkita narsani beradi: kechikish tasodifiy emasligini va qachon uni olib tashlash mumkinligini (provayder limiti o'zgarganda).

### 2. Oqibatlar haqida ogohlantirish

Kod to'g'ri, lekin uni noto'g'ri ishlatish yoki o'zgartirish qimmatga tushadi.

```ts
// DIQQAT: bu so'rov butun `trips` jadvalini skanerlaydi (~40M qator).
// Faqat tungi hisobot job'idan chaqiring, HTTP handler'dan emas.
```

### 3. Aniqlashtirish (clarification)

O'zgartirib bo'lmaydigan yoki o'z-o'zidan tushunarsiz ifodani tushuntirish: regex, bit operatsiyalari, tashqi kutubxonaning g'alati API'si.

```ts
// "01 A 123 BC" yoki "01 123 ABC"; probellar ixtiyoriy.
const UZ_PLATE = /^\d{2}\s?(?:[A-Z]\s?\d{3}\s?[A-Z]{2}|\d{3}\s?[A-Z]{3})$/;
```

Martin bu turda ehtiyot bo'lishni so'raydi: aniqlashtiruvchi komment xato bo'lsa, u ikki barobar chalg'itadi. Shuning uchun uni test bilan qo'llab-quvvatlash yaxshi.

### 4. Ma'lumot beruvchi komment

Kodda ko'rinmaydigan kontekst: format, birlik, manba.

```ts
/** ISO 3166-1 alpha-2 kodi, masalan "UZ". */
countryCode: string;
```

### 5. Kuchaytirish (amplification)

Kichik ko'rinadigan, lekin muhim detalni ta'kidlash.

```ts
// trim() muhim: 1C eksportida raqam oxirida ko'rinmas probel bo'ladi va
// usiz bir xil haydovchi ikki marta yaratiladi.
const driverCode = row.code.trim();
```

### 6. TODO

Bajarilishi kerak, lekin hozir bajarilmayotgan ish. Martin TODO'ni o'rinli deb biladi, lekin ular kodda to'planib qolmasligi, muntazam ko'rib chiqilishi kerakligini aytadi.

### 7. Huquqiy va litsenziya kommentlari

Fayl boshidagi litsenziya yoki mualliflik huquqi. Ular ko'pincha talab qilinadi. Iloji bo'lsa, to'liq matn emas, standart litsenziyaga havola yoziladi (masalan, `SPDX-License-Identifier: MIT`).

### 8. Public API hujjati

Kutubxona yoki modulning tashqi interfeysi uchun doc comment. Bu mavzu alohida darsda (34-dars) chuqur ko'riladi.

## Chuqurroq: yaxshi kommentning anatomiyasi

### Abstraksiya darajasi

Ousterhout kommentlarni ikki yo'nalishga ajratadi: koddan **pastroq** darajadagi (aniqlik qo'shuvchi: birlik, chegara, null bo'lishi mumkinmi) va **yuqoriroq** darajadagi (intuitsiya beruvchi: bu kod bloki umuman nima uchun bor). Ikkala tur ham qiymatli. Yomon komment esa kod bilan *bir xil* darajada yoziladi va uni so'zma-so'z takrorlaydi.

Pastroq daraja:

```ts
/** Kiritilgan oraliq [from, to): `from` kiradi, `to` kirmaydi. */
```

Yuqoriroq daraja:

```ts
// Avval keshdan qidiramiz, chunki bu funksiya har bir GPS paketida chaqiriladi
// va DB'ga borish 3-5 ms qo'shadi. Kesh topilmasa, DB va keyin keshni to'ldirish.
```

### "Nega emas" kommentlari

Ko'pincha eng qimmatli komment - rad etilgan alternativa haqida. Agar kod "g'alati" ko'rinsa va siz ataylab "oddiy" yechimdan voz kechgan bo'lsangiz, buni yozing:

```ts
// Bu yerda Promise.all ishlatilmagan: 1C API parallel so'rovlarda sessiyani
// bloklaydi. Ketma-ket chaqiruv sekinroq, lekin barqaror.
for (const invoice of invoices) {
  await oneC.pushInvoice(invoice);
}
```

Bu komment kelajakdagi "optimizatsiya" urinishini oldini oladi. U kodni takrorlamaydi va koddan hech qachon ko'rinmaydi.

### TODO'larni boshqariladigan qilish

TODO'ning asosiy muammosi - u egasiz va muddatsiz yashaydi. Amaliy qoidalar:

1. **Tiketga bog'lang.** `// TODO(FLEET-412): ...` formatida. Endi TODO tracker'da ko'rinadi va prioritetlanadi.
2. **Nima va nega yozing.** `// TODO: fix` hech narsa demaydi. "Takror paketlarni filtrlash, hozir dublikat trek nuqtalari hosil bo'ladi" - bu ish.
3. **Lint bilan nazorat qiling.** ESLint'ning `no-warning-comments` qoidasi TODO/FIXME'larni topadi. U belgilangan so'zlarni (`todo`, `fixme`) topadi, lekin tiket raqami bor-yo'qligini tekshira olmaydi; buning uchun maxsus qoida yoki CI'dagi oddiy skript kerak (37-dars).
4. **Muntazam ko'rib chiqing.** Har sprint yoki har oy `grep -rn "TODO"` natijasini ko'rib chiqing. Bajarilgani o'chiriladi, keraksizi o'chiriladi.

`FIXME` va `HACK` kabi belgilar ham ishlatiladi. Muhimi - jamoada ularning ma'nosi kelishilgan bo'lishi. Masalan: `TODO` - kelajakdagi yaxshilanish, `FIXME` - ma'lum xato, `HACK` - ongli vaqtinchalik yechim.

### Yaxshi komment yozish uchun to'rt savol

Komment yozishdan oldin, uni o'zingizga quyidagi savollar orqali tekshirib ko'ring:

1. **Buni kodni o'qigan odam bilmaydimi?** Agar biladi, komment keraksiz. Agar faqat uzoq tahlildan keyin bilsa yoki umuman bilmasa, yozing.
2. **Buni nom, tip yoki konstantaga ko'chirib bo'ladimi?** `// soniyada` o'rniga `timeoutSec`. Ko'chirib bo'lsa, ko'chiring: nom har bir ishlatilgan joyda ko'rinadi va kompilyator uni kuzatadi.
3. **Komment qachon noto'g'ri bo'lib qoladi?** Agar u boshqa fayldagi qiymatga, tashqi tizimning hozirgi xatti-harakatiga yoki shartnomadagi raqamga bog'liq bo'lsa, buni ochiq yozing ("limit shartnomada o'zgarsa, yangilang"). Shunda kelajakdagi o'quvchi kommentning amal qilish muddatini biladi.
4. **Bu komment kodni ko'rmagan odamga yetarlimi?** Ichki jargon, qisqartmalar va "yuqorida aytganimizdek" kabi iboralar kommentni faqat muallif uchun tushunarli qiladi. To'liq jumla bilan yozing.

McConnell ham shunga o'xshash fikrni aytadi: komment kodni takrorlash uchun emas, kodning maqsadini (intent) ochish uchun bo'lsa, u saqlashga arziydi. Agar komment ikkinchi yoki uchinchi savoldan o'tmasa, uni yozmang va kodni yaxshilang.

### Komment qayerda turishi kerak

Ousterhout kommentni u tasvirlaydigan kodga iloji boricha yaqin qo'yishni tavsiya qiladi: shunda kod o'zgarganda komment ko'zga tashlanadi va eskirish ehtimoli kamayadi. Faylning boshida "bu modulda X, Y, Z qilinadi" degan uzun tavsif tezroq eskiradi, chunki uni hech kim kod bilan birga yangilamaydi. Commit xabari esa boshqa narsa uchun: u *o'zgarish* nega qilinganini aytadi, komment esa *kodning hozirgi holati* nega shundayligini (39-dars).

## Misol: refund service

Yomon versiya:

```ts
export class RefundService {
  constructor(private readonly provider: PaymentProvider) {}

  // refund qiladi
  async refundAll(payments: Payment[]): Promise<void> {
    // har bir to'lov uchun
    for (const payment of payments) {
      // refund
      await this.provider.refund(payment.id, payment.amount, payment.id);
      // kutamiz
      await sleep(1500);
    }
  }
}
```

Uchta savol javobsiz: nega uchinchi argument `payment.id`, nega `sleep`, nega parallel emas.

Yaxshi versiya:

```ts
type Payment = { id: string; amountTiyin: number };

interface PaymentProvider {
  refund(paymentId: string, amountTiyin: number, idempotencyKey: string): Promise<void>;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Provayder 1 soniyada bitta refund so'rovidan ko'pini 429 bilan rad etadi.
// Limit shartnomada o'zgarsa, shu qiymatni yangilang.
const PROVIDER_REFUND_INTERVAL_MS = 1500;

export class RefundService {
  constructor(private readonly provider: PaymentProvider) {}

  /**
   * To'lovlarni ketma-ket qaytaradi.
   *
   * Qayta chaqirish xavfsiz: idempotency key sifatida to'lov id'si ishlatiladi,
   * shuning uchun provayder allaqachon qaytarilgan to'lovni ikkinchi marta qaytarmaydi.
   */
  async refundAll(payments: Payment[]): Promise<void> {
    // Ketma-ket, chunki parallel so'rovlar provayderning rate limit'iga uriladi.
    for (const payment of payments) {
      await this.provider.refund(payment.id, payment.amountTiyin, payment.id);
      await sleep(PROVIDER_REFUND_INTERVAL_MS);
    }
  }
}
```

Nima o'zgardi:

- Shovqin kommentlar ("har bir to'lov uchun", "refund") o'chirildi.
- `idempotencyKey` parametr nomi interfeysda paydo bo'ldi, endi uchinchi argument nima ekani tipdan ko'rinadi. Komment esa *nega* bu xavfsiz ekanini aytadi.
- Raqam nomlangan konstantaga chiqdi va uning yonida sabab va "qachon o'zgartirish kerak" yozildi.
- Parallel emasligining sababi bir qatorda. Bu kelajakdagi `Promise.all` "optimizatsiyasi"ning oldini oladi.
- `amountTiyin` - birlik nomda. "Summa so'mdami yoki tiyindami" degan komment endi kerak emas.

## Qachon qo'llamaslik kerak

- **Nom yoki tip yetarli bo'lsa.** `// tiyinda` kommenti o'rniga `amountTiyin` nomi yaxshiroq: u har bir ishlatilgan joyda ko'rinadi. Komment - nom va tip ifodalay olmagan narsa uchun.
- **Kommentni test almashtira olsa.** "Bu funksiya bo'sh massivda 0 qaytaradi" kommentidan "bo'sh massivda 0 qaytaradi" nomli test kuchliroq: u tekshiriladi. Ammo test interfeys kommentini to'liq almashtirmaydi, chunki chaqiruvchi testlarni o'qimaydi.
- **TODO o'rniga darhol tuzatish mumkin bo'lsa.** Besh daqiqalik ish uchun TODO yozish - kelajakka qarz o'tkazish. Boy Scout qoidasi (6-dars) bu yerda ishlaydi.
- **"Nega" aslida tarix bo'lsa.** "Avval biz X ishlatardik, keyin Y'ga o'tdik" - bu commit xabari yoki ADR uchun (39-dars), kod kommenti uchun emas. Kommentda faqat hozirgi kodni tushunish uchun kerak bo'lgan sabab qoladi.
- **Ogohlantirishni kod bilan ta'minlash mumkin bo'lsa.** "Bu metodni HTTP handler'dan chaqirmang" kommenti foydali, lekin bu chegarani modul tuzilishi yoki lint qoidasi bilan majburlash yanada ishonchli. Komment sababni tushuntirish uchun qoladi.

## Stack'da: NestJS, Next.js, Prisma

- **NestJS cron va queue handler'lari.** `@Cron('0 3 * * *')` ustida nega aynan soat 3 ekanini yozing ("tungi minimal yuklama, 1C eksportidan keyin"). Cron ifodasi vaqtni aytadi, sababni emas.
- **Prisma migratsiyalari.** SQL migratsiyasi ichida `-- CONCURRENTLY ishlatildi, chunki jadval katta va lock qabul qilinmaydi` kabi izoh kelajakdagi migratsiyalar uchun namuna bo'ladi.
- **Next.js keshlash qarorlari.** `export const revalidate = 60` ustida "narxlar provayderdan har daqiqada yangilanadi" degan izoh qiymatni o'zgartirmoqchi bo'lgan odamga kontekst beradi.
- **eslint-disable kommentlari.** Har bir `// eslint-disable-next-line` yonida sabab bo'lishi kerak: `// eslint-disable-next-line @typescript-eslint/no-explicit-any -- kutubxona tiplari noto'g'ri, issue #123`. ESLint `--` dan keyingi izohni qo'llab-quvvatlaydi.

## Xulosa

- Eng qimmatli komment "nega"ni aytadi: sabab, cheklov, rad etilgan alternativa.
- Ogohlantirish, aniqlashtirish, ma'lumot beruvchi va kuchaytiruvchi kommentlar koddan chiqmaydigan bilimni saqlaydi.
- Yaxshi komment koddan pastroq (aniqlik) yoki yuqoriroq (intuitsiya) darajada yoziladi, kod bilan bir xil darajada emas.
- TODO tiketga bog'lansa va muntazam ko'rib chiqilsa foydali, aks holda u kodda abadiy qoladi.
- Avval nom, tip yoki test bilan ifodalashga urinib ko'ring. Ular ifodalay olmagan narsa uchun komment yozing va uni tegishli kodga yaqin qo'ying.
