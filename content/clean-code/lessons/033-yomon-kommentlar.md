---
n: 33
slug: yomon-kommentlar
title: "Yomon kommentlar va o'chirilgan kod"
summary: "Shovqin, takror, chalg'ituvchi, majburiy va jurnal kommentlari, yopuvchi qavs belgilari va kommentga olingan kod. Bu darsda har birining narxini, ularni qanday aniqlash va xavfsiz tozalashni ko'ramiz."
duration: 30
sources:
  - id: cc1
    note: "Kommentlar haqidagi bob, \"Bad Comments\" bo'limi: mumbling, redundant, misleading, mandated, journal, noise, position markers, closing brace, attributions, commented-out code"
  - id: code-complete
    note: "Kommentlash texnikalari haqidagi bob: kodni takrorlovchi kommentlar va kommentlarni saqlash narxi"
  - id: refactoring
    note: "Code smells bobi, \"Comments\" bandi: komment yomon kodni yashiruvchi deodorant sifatida"
quiz:
  - q: "Kommentga olingan kod (commented-out code) nega zararli?"
    options:
      - "Chunki u fayl hajmini oshiradi"
      - "Chunki u kompilyatsiyani buzadi"
      - "Chunki u ESLint qoidasini buzadi"
      - "Chunki o'quvchi uni muhim deb o'ylab o'chirishdan qo'rqadi, u tez eskiradi va git uni allaqachon saqlaydi"
    answer: 3
    explain: "Martin bu holatni alohida ta'kidlaydi: boshqalar kommentga olingan kodni o'chirishga jur'at etmaydi, chunki u biror sabab bilan qoldirilgan deb o'ylaydi. Natijada u to'planadi va atrofidagi kod o'zgargani sababli ishlamaydigan holga keladi. Versiya nazorati eski kodni allaqachon saqlaydi."
  - q: "Qaysi komment eng xavfli?"
    options:
      - "`// hisoblagich`"
      - "`/** @param id - id */`"
      - "`// Kesh 5 daqiqa saqlanadi` - lekin kodda TTL 3600 soniya"
      - "`// ===== Helpers =====`"
    answer: 2
    explain: "Shovqin kommentlar vaqt yo'qotadi, lekin chalg'ituvchi komment noto'g'ri qarorga olib keladi. O'quvchi kommentga ishonib 5 daqiqalik eskirish bilan rejalashtiradi, haqiqatda esa ma'lumot 1 soat eskiradi."
  - q: "Fayl boshidagi o'zgarishlar jurnali (\"2023-01-05 Aziz: validatsiya qo'shildi...\") bilan nima qilish kerak?"
    options:
      - "O'chirish: bu ma'lumot git log va blame'da aniqroq saqlanadi"
      - "Yangi yozuvlar bilan to'ldirib borish"
      - "Faylning oxiriga ko'chirish"
      - "README'ga ko'chirish"
    answer: 0
    explain: "Jurnal kommentlari versiya nazorati tizimlari keng tarqalmagan davrdan qolgan. Git har bir qatorning muallifini, sanasini va sababini (commit xabari) avtomatik saqlaydi. Qo'lda yuritiladigan jurnal tezda to'liqsiz va noto'g'ri bo'lib qoladi."
  - q: "Jamoada \"har bir metodga JSDoc majburiy\" qoidasi bor. Natijada `/** Gets the user. @param id The id. @returns The user. */` kabi kommentlar ko'paydi. Eng yaxshi yechim?"
    options:
      - "Qoidani saqlash, chunki hujjat har doim foydali"
      - "Qoidani public API bilan cheklash va u yerda ham faqat nom va tipdan chiqmaydigan ma'lumotni talab qilish"
      - "Barcha kommentlarni taqiqlash"
      - "Kommentlarni AI bilan avtomatik yaratish"
    answer: 1
    explain: "Majburiy kommentlar (mandated comments) Martin ro'yxatidagi yomon kommentlardan biri: ular hech narsa qo'shmaydi va eskiradi. Ammo public API hujjati qiymatli, shuning uchun to'liq taqiq ham xato. AI bilan yaratilgan takror kommentlar ham xuddi shu shovqin."
  - q: "`} // end for` kabi yopuvchi qavs kommenti nimaning belgisi?"
    options:
      - "Yaxshi hujjatlashning"
      - "Prettier sozlanmaganining"
      - "Funksiya juda uzun yoki ichma-ich, uni qisqartirish kerakligining"
      - "TypeScript xatosining"
    answer: 2
    explain: "Martin ta'kidlaydi: yopuvchi qavs kommentlari uzun, ichma-ich funksiyalarda paydo bo'ladi. Kichik funksiyalarda ular kerak emas. Komment emas, funksiyani qisqartirish yoki early return (26-dars) to'g'ri yechim."
  - q: "Code review'da kommentga olingan 30 qatorli blok ko'rdingiz, muallif \"keyin kerak bo'lishi mumkin\" deydi. Eng to'g'ri javob?"
    options:
      - "Uni o'chirishni so'rash; kerak bo'lsa git'dan tiklanadi. Agar haqiqatan rejalashtirilgan bo'lsa, tiket va feature flag yaxshiroq"
      - "Qoldirish, chunki muallif yaxshiroq biladi"
      - "Uni boshqa faylga ko'chirish"
      - "Uni `if (false)` ichiga o'rash"
    answer: 0
    explain: "Git tarixi kodni saqlaydi. Agar kod haqiqatan kerak bo'lsa, u ishlaydigan holda feature flag orqasida bo'lishi kerak, aks holda tiket yetarli. `if (false)` esa kommentga olingan kodning yanada yomon shakli: u kompilyatsiya bo'ladi, lekin o'lik."
task:
  title: "Fayldagi kommentlarni audit qilish"
  prompt: |
    Quyidagi NestJS service fayli bir necha yil davomida o'sgan. Undagi har bir kommentni Martin ro'yxati bo'yicha turga ajrating (shovqin, takror, chalg'ituvchi, jurnal, pozitsiya belgisi, yopuvchi qavs, kommentga olingan kod) va faylni tozalang.

    Qoidalar:
    - Xatti-harakat o'zgarmasligi kerak.
    - Agar komment noto'g'ri bo'lsa, kodni emas, kommentni tuzating yoki o'chiring (kod - haqiqat manbai).
    - Koddan chiqmaydigan haqiqiy ma'lumot bo'lsa, uni saqlang yoki nom/tipga ko'chiring.
  lang: ts
  starter: |
    /*
     * 2022-04-01 Aziz: fayl yaratildi
     * 2022-09-15 Bobur: discount qo'shildi
     * 2023-02-10 Aziz: bug fix
     */
    type Rental = { id: string; days: number; dailyRateTiyin: number; isCorporate: boolean };

    export class RentalPricingService {
      // ======== PUBLIC ========

      /**
       * Price.
       * @param rental rental
       * @returns number
       */
      price(rental: Rental): number {
        let total = rental.days * rental.dailyRateTiyin; // jami
        // 7 kundan ko'p bo'lsa 5% chegirma
        if (rental.days >= 7) {
          total = total * 0.9;
        } // end if
        // const tax = total * 0.12;
        // total = total + tax;
        if (rental.isCorporate) {
          // korporativ
          total = total * 0.95;
        }
        return Math.round(total); // qaytaramiz
      } // end price
    }
  solution: |
    type Rental = { id: string; days: number; dailyRateTiyin: number; isCorporate: boolean };

    const LONG_RENTAL_MIN_DAYS = 7;
    const LONG_RENTAL_MULTIPLIER = 0.9;
    const CORPORATE_MULTIPLIER = 0.95;

    export class RentalPricingService {
      /**
       * Ijara narxini tiyinda hisoblaydi.
       *
       * Chegirmalar ketma-ket qo'llanadi: avval uzoq muddatli (10%), keyin korporativ (5%).
       * Natija eng yaqin tiyingacha yaxlitlanadi.
       */
      priceTiyin(rental: Rental): number {
        let total = rental.days * rental.dailyRateTiyin;
        if (rental.days >= LONG_RENTAL_MIN_DAYS) total *= LONG_RENTAL_MULTIPLIER;
        if (rental.isCorporate) total *= CORPORATE_MULTIPLIER;
        return Math.round(total);
      }
    }
  solutionNotes: |
    - **Jurnal kommenti** (fayl boshi) o'chirildi: bu ma'lumot `git log` va `git blame`da bor va aniqroq.
    - **Pozitsiya belgisi** (`==== PUBLIC ====`) o'chirildi: TypeScript'da `public`/`private` modifikatorlari va kichik klass buni keraksiz qiladi.
    - **Majburiy JSDoc** ("Price. @param rental rental") haqiqiy shartnoma bilan almashtirildi: birlik (tiyin), chegirmalar tartibi va yaxlitlash. Metod nomi `priceTiyin` bo'ldi, birlik endi chaqiruvchi tomonda ham ko'rinadi.
    - **Chalg'ituvchi komment**: "5% chegirma" yozilgan, kod esa 10% beradi (`0.9`). Kod - haqiqat manbai, shuning uchun komment kodga moslandi. Agar biznes haqiqatan 5% kutsa, bu alohida bug va alohida tiket - refaktoring ichida xatti-harakatni jimgina o'zgartirmaymiz.
    - **Kommentga olingan kod** (QQS) o'chirildi. Agar QQS rejalashtirilgan bo'lsa, bu tiket bo'lishi kerak.
    - **Shovqin** (`// jami`, `// korporativ`, `// qaytaramiz`) va **yopuvchi qavs** (`// end if`, `// end price`) o'chirildi.
  checklist:
    - "Jurnal, pozitsiya belgisi va yopuvchi qavs kommentlari qolmadi"
    - "Kommentga olingan kod o'chirildi"
    - "Kod bilan zid komment topildi va xatti-harakat o'zgartirilmasdan hal qilindi"
    - "Majburiy JSDoc haqiqiy shartnoma bilan almashtirildi yoki o'chirildi"
    - "Sehrli sonlar nomlangan konstantalarga chiqarildi"
---

## Muammo

Kommentning narxi uni yozish vaqti emas. Asl narx - uni har safar o'qish va kod bilan solishtirish. Agar faylda 40 ta komment bo'lsa va ulardan 35 tasi kodni takrorlasa, o'quvchi ikki yo'ldan birini tanlaydi: hammasini o'qib vaqt yo'qotadi yoki hammasini e'tiborsiz qoldiradi. Ikkinchi holatda u qolgan 5 ta muhim kommentni ham o'tkazib yuboradi. Shovqin signalni ko'mib yuboradi.

Bundan ham yomoni - chalg'ituvchi komment. Kommentda "5 daqiqa kesh" yozilgan, kodda 1 soat. Hech qanday vosita bu ziddiyatni topmaydi. Kompilyator kommentni o'qimaydi, testlar uni ishga tushirmaydi, linter uning ma'nosini bilmaydi. Martin aynan shuning uchun kommentlarga ehtiyotkorlik bilan qaraydi (31-dars).

Uchinchi muammo - kommentga olingan kod. U har bir kod bazasida bor va deyarli hech qachon tiklanmaydi. Lekin uni hech kim o'chirmaydi, chunki "kimdir biror sabab bilan qoldirgan bo'lsa kerak".

## Asosiy g'oya

*Clean Code*ning kommentlar bobida Martin yomon kommentlar ro'yxatini beradi. McConnell ham *Code Complete*da kodni takrorlovchi kommentlarning saqlash narxi haqida yozadi. Asosiy turlarni ko'ramiz.

### Ming'irlash (mumbling)

Muallif o'zi uchun yozgan, boshqalar tushunmaydigan komment: `// buni keyin ko'rish kerak`, `// standart holat`. Qaysi standart? Nima ko'rish kerak? Agar komment yozishga qaror qilsangiz, uni yaxshi yozishga vaqt ajrating.

### Takroriy (redundant) komment

Kodni o'zbek yoki ingliz tilida qayta aytadi: `// foydalanuvchini id bo'yicha topamiz` - `findUserById(id)` ustida. U kodni o'qishdan tezroq emas va hech qanday yangi ma'lumot bermaydi.

### Chalg'ituvchi (misleading) komment

Kod bilan to'liq mos kelmaydigan komment. Ko'pincha u yozilganda to'g'ri bo'lgan, keyin kod o'zgargan. Bu eng qimmat tur, chunki o'quvchi unga ishonadi.

### Majburiy (mandated) komment

"Har bir funksiyada JSDoc bo'lsin" qoidasi natijasida paydo bo'lgan kommentlar: `@param id The id`. Ular kodni shishiradi va hech narsa qo'shmaydi. Public API hujjati bundan farq qiladi (34-dars).

### Jurnal (journal) kommentlari

Fayl boshidagi o'zgarishlar ro'yxati. Versiya nazorati bo'lmagan davrdan qolgan odat. Hozir git buni avtomatik va aniqroq qiladi.

### Shovqin (noise) kommentlari

`/** Konstruktor */`, `// getter`, `// default`. Ko'z ularni avtomatik o'tkazib yuborishni o'rganadi va shu odat muhim kommentlarga ham yoyiladi.

### Pozitsiya belgilari

`// ========== HELPERS ==========`. Martin ularni kam ishlatishni maslahat beradi: kamdan-kam bo'lsa ko'zga tashlanadi, ko'p bo'lsa shovqinga aylanadi. Ko'pincha ular fayl juda kattaligini va bo'linishi kerakligini ko'rsatadi.

### Yopuvchi qavs kommentlari

`} // end while`. Uzun, ichma-ich funksiyalar alomati. Yechim - funksiyani qisqartirish.

### Mualliflik belgilari

`// Aziz qo'shdi`. Git blame buni aniqroq qiladi.

### Kommentga olingan kod

Martin buni alohida ta'kidlaydi: boshqalar bunday kodni o'chirishga jur'at etmaydi, u to'planib boradi va atrofidagi kod o'zgargani sababli tez orada ishlamaydigan holga keladi.

### Mahalliy bo'lmagan ma'lumot

Komment boshqa joydagi kod haqida gapiradi: `// port 3000, config.ts'da o'zgartiriladi`. Config o'zgarganda bu komment yangilanmaydi, chunki uni hech kim ko'rmaydi. Komment faqat yonidagi kod haqida bo'lishi kerak.

### Ortiqcha ma'lumot

Algoritm tarixi, RFC'ning to'liq tarjimasi, munozara qaydlari. Havola qoldiring, matnni emas.

## Chuqurroq: nega yomon kommentlar paydo bo'ladi

### Ular kod hidi (code smell) belgisi

Ko'p yomon kommentlar yomon kodning simptomi. Yopuvchi qavs kommentlari - uzun funksiya. Pozitsiya belgilari - katta fayl. "Bu o'zgaruvchi foydalanuvchi id'si" kommenti - yomon nom (`uid` yoki `x`). Fowler ham *Refactoring*da kommentlarni "deodorant" sifatida tilga oladi: ular yomon hidni yashiradi. Shuning uchun yomon kommentni o'chirishdan oldin so'rang: u qaysi muammoni yashirayotgan edi? Ko'pincha to'g'ri yechim - Extract Function, Rename Variable yoki tipni aniqlashtirish (30-dars, 20-dars).

### Kommentlar sinxron saqlanmaydi

Kod o'zgarganda kompilyator chaqiruvchilarni topadi, testlar xatti-harakatni tekshiradi. Kommentni esa hech narsa tekshirmaydi. Shuning uchun komment qancha uzoqda (boshqa faylda, fayl boshida) va qancha batafsil bo'lsa, u shuncha tez eskiradi. Bu Ousterhoutning "kommentni kodga yaqin yozing" tavsiyasi bilan ham mos keladi.

### Kommentga olingan kod va git

Kodni kommentga olishning odatiy sabablari va ularning to'g'ri yechimi:

| Sabab | To'g'ri yechim |
| --- | --- |
| "Keyin kerak bo'lishi mumkin" | O'chiring. `git log -S "funksiyaNomi"` bilan topiladi |
| "Vaqtincha o'chirdim, testlash uchun" | Commit qilmang. Feature flag yoki branch |
| "Eski implementatsiya, solishtirish uchun" | Commit xabarida yoki PR tavsifida havola |
| "Mijoz qaytishini so'rashi mumkin" | Feature flag orqasidagi ishlaydigan kod yoki tiket |

Git'da o'chirilgan kodni topish oson: `git log -S "calculateTax" --oneline` shu satr qo'shilgan yoki o'chirilgan commit'larni ko'rsatadi.

### Zid komment topilganda nima qilish kerak

Kod va komment zid bo'lsa, qaysi biri to'g'ri? Default qoida: **kod haqiqat manbai**, chunki production'da aynan u ishlaydi va foydalanuvchilar unga moslashgan. Lekin komment biznes niyatini aks ettirgan bo'lishi ham mumkin, ya'ni kodda bug bor. Shuning uchun:

1. Refaktoring ichida xatti-harakatni jimgina o'zgartirmang.
2. Kommentni kodga moslang yoki o'chiring.
3. Agar shubha bo'lsa, mahsulot egasidan so'rang va alohida tiket oching.

## Misol: avtomobil ijarasi service'i

Tipik "yillar davomida o'sgan" kod:

```ts
// Author: Aziz
// Created: 2022
export class BookingService {
  constructor(private readonly repo: BookingRepository) {}

  // ---------- METHODS ----------

  /**
   * Cancel.
   * @param id id
   */
  async cancel(id: string): Promise<void> {
    // bookingni olamiz
    const b = await this.repo.findById(id);
    if (b) {
      // 24 soatdan kam qolgan bo'lsa bekor qilib bo'lmaydi
      if (b.startsAt.getTime() - Date.now() < 12 * 60 * 60 * 1000) {
        throw new Error("Too late");
      } // end if
      // await this.notifyOwner(b);
      b.status = "cancelled";
      await this.repo.save(b);
    } // end if b
  }
}
```

Tozalangan versiya:

```ts
type Booking = { id: string; startsAt: Date; status: "active" | "cancelled" };

interface BookingRepository {
  findById(id: string): Promise<Booking | null>;
  save(booking: Booking): Promise<void>;
}

class BookingNotFoundError extends Error {}
class CancellationWindowClosedError extends Error {}

const CANCELLATION_DEADLINE_MS = 12 * 60 * 60 * 1000;

export class BookingService {
  constructor(private readonly repo: BookingRepository) {}

  /**
   * Bronni bekor qiladi.
   *
   * @throws CancellationWindowClosedError - boshlanishiga 12 soatdan kam qolgan bo'lsa
   */
  async cancel(bookingId: string): Promise<void> {
    const booking = await this.repo.findById(bookingId);
    if (!booking) throw new BookingNotFoundError(bookingId);
    if (booking.startsAt.getTime() - Date.now() < CANCELLATION_DEADLINE_MS) {
      throw new CancellationWindowClosedError(bookingId);
    }
    booking.status = "cancelled";
    await this.repo.save(booking);
  }
}
```

Nima o'zgardi va nega:

- **Mualliflik va pozitsiya kommentlari** o'chirildi: git va klassning kichikligi ularni keraksiz qiladi.
- **Chalg'ituvchi komment** ("24 soat", kod esa 12 soat) kod bo'yicha tuzatildi va konstantaga ko'chdi. Endi qiymat bitta joyda va nomlangan.
- **Kommentga olingan `notifyOwner`** o'chirildi. Agar egasini xabardor qilish kerak bo'lsa, bu - tiket.
- **Yopuvchi qavs kommentlari** early return bilan birga yo'qoldi (26-dars).
- **Xatti-harakat haqida eslatma:** asl kod topilmagan bronda jimgina hech narsa qilmasdi. Biz `BookingNotFoundError` qo'shdik, bu xatti-harakat o'zgarishi. Real loyihada buni alohida commit va review bilan qilish kerak. Agar jim qaytish ataylab bo'lsa (idempotent bekor qilish), unda `if (!booking) return;` qoldirilishi va nega jim qaytishi kommentda yozilishi kerak.

## Qachon qo'llamaslik kerak

"Yomon kommentlarni o'chir" qoidasi ham haddan oshishi mumkin:

- **Kontekstsiz tozalash.** Siz uchun "ravshan" ko'rinadigan komment domenni yaxshi bilmaydigan odam uchun muhim bo'lishi mumkin. Masalan, `// DUT = yoqilg'i darajasi datchigi` yangi xodim uchun qiymatli. O'chirishdan oldin o'zingizdan so'rang: buni ko'rmagan odam bilarmidi?
- **Pozitsiya belgilari ba'zan o'rinli.** Katta, lekin tabiatan bir butun fayllarda (masalan, i18n lug'ati, konfiguratsiya obyekti, test fixture'lari) bo'lim sarlavhalari navigatsiyaga yordam beradi.
- **Huquqiy talablar.** Litsenziya sarlavhalari ba'zan majburiy, ularni "shovqin" deb o'chirish huquqiy muammo tug'diradi.
- **Generatsiya qilingan kod.** `// @generated` yoki "bu faylni qo'lda o'zgartirmang" kommenti shovqin emas, ogohlantirish.
- **Katta tozalash commit'i.** Yuzlab faylda kommentlarni bir commit'da o'chirish review'ni imkonsiz qiladi va git blame tarixini buzadi. Boy Scout qoidasi (6-dars) bo'yicha tegayotgan faylingizni tozalang. Katta tozalashni alohida commit'da qilsangiz, uni `.git-blame-ignore-revs` fayliga qo'shing.

## Stack'da: ESLint, Git, IDE

- **Kommentga olingan kodni lint bilan topish.** ESLint core'da bunday qoida yo'q, lekin `eslint-plugin-sonarjs` kabi plaginlarda kommentga olingan kodni aniqlovchi qoida bor. Uni `warn` darajasida yoqish review yukini kamaytiradi.
- **TODO va FIXME.** Core `no-warning-comments` qoidasi belgilangan so'zlar bilan boshlanadigan kommentlarni topadi (37-dars).
- **eslint-disable kommentlari.** ESLint'ning `linterOptions.reportUnusedDisableDirectives` sozlamasi endi kerak bo'lmagan disable kommentlarini ko'rsatadi. Bu "o'lik" kommentlarning bir turini avtomatik tozalaydi.
- **Git blame'ni toza saqlash.** `.git-blame-ignore-revs` fayli va `git config blame.ignoreRevsFile .git-blame-ignore-revs` formatlash yoki tozalash commit'larini blame'dan chiqaradi. GitHub ham bu faylni hisobga oladi.
- **`@ts-ignore` o'rniga `@ts-expect-error`.** Ikkinchisi xato yo'qolganda o'zi xato beradi, ya'ni eskirgan "kommentlar" avtomatik topiladi. typescript-eslint'ning `ban-ts-comment` qoidasi buni nazorat qiladi va sabab yozishni talab qilishi mumkin.

## Xulosa

- Kommentning narxi - uni har safar o'qish va kod bilan solishtirish. Shovqin muhim kommentlarni ko'mib yuboradi.
- Chalg'ituvchi komment eng qimmat tur: hech qanday vosita uni topmaydi, o'quvchi esa unga ishonadi.
- Jurnal, mualliflik va kommentga olingan kod git'ning ishini qo'lda va yomonroq qiladi. Ularni o'chiring.
- Yopuvchi qavs va pozitsiya belgilari ko'pincha uzun funksiya yoki katta fayl alomati. Kommentni emas, kodni tuzating.
- Zid komment topilganda kod haqiqat manbai, lekin refaktoring ichida xatti-harakatni jimgina o'zgartirmang.
