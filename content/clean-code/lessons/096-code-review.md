---
n: 96
slug: code-review
title: "Code review madaniyati"
summary: "Code review - jamoaning kod sifatini ushlab turadigan asosiy mexanizm, lekin u osongina byurokratiyaga yoki shaxsiy did bahsiga aylanadi. Bu darsda Google'ning ochiq code review standartlari asosida nimani qidirish, qanday izoh yozish va qachon tasdiqlashni ko'ramiz."
duration: 35
sources:
  - id: google-code-review
    note: "The Standard of Code Review (code health, mukammal kod yo'q, Nit: prefiksi, faktlar did'dan ustun), What to look for (design, complexity va over-engineering, tests, naming, comments, every line, context), Navigating a CL, Speed of reviews (bir ish kuni), How to write comments (Nit/Optional/FYI belgilari, xushmuomalalik), Small CLs"
quiz:
  - q: "Google standartiga ko'ra reviewer qachon o'zgarishni tasdiqlashi kerak?"
    options:
      - "Kod mukammal bo'lganda va hech qanday izoh qolmaganda"
      - "Kamida ikkita reviewer rozi bo'lganda"
      - "O'zgarish tizimning umumiy code health'ini aniq yaxshilaganda, hatto mukammal bo'lmasa ham"
      - "Barcha testlar o'tganda"
    answer: 2
    explain: "Standartning asosiy tamoyili: mukammal kod yo'q, faqat yaxshiroq kod bor. Code health'ni yaxshilaydigan o'zgarishni mayda kamchiliklar uchun kunlab ushlab turish jamoani sekinlashtiradi. Testlar o'tishi zarur, lekin yetarli shart emas."
  - q: "Reviewer o'zgaruvchi nomini biroz yaxshiroq qilish mumkinligini ko'rdi, lekin bu muhim emas. Qanday yozish to'g'ri?"
    options:
      - "\"Nit: `d` o'rniga `distanceKm` o'qishni osonlashtiradi\""
      - "Hech narsa yozmaslik"
      - "Tasdiqlashni rad etib, nomni o'zgartirishni talab qilish"
      - "\"Bu nom yomon\""
    answer: 0
    explain: "Nit: prefiksi muallifga bu majburiy emasligini bildiradi. Sababni qisqa aytish izohni foydali qiladi. \"Bu nom yomon\" sababsiz va shaxsiy tuyuladi, rad etish esa ahamiyatsiz narsa uchun nomutanosib."
  - q: "1800 qatorli PR keldi: yangi feature, 30 faylda nom o'zgartirish va bitta bug fix. Reviewer nima qilishi kerak?"
    options:
      - "Bir necha kun ajratib, butunini o'qish"
      - "Faqat testlar o'tganini tekshirib tasdiqlash"
      - "Tasodifiy fayllarni ko'rib chiqish"
      - "Muallifdan uni mustaqil kichik o'zgarishlarga bo'lishni so'rash: alohida refaktoring, alohida bug fix, alohida feature"
    answer: 3
    explain: "Google qo'llanmasi kichik CL'larni tavsiya qiladi va refaktoringni feature va bug fix'dan ajratishni so'raydi. Katta CL'da xatolar yashirinadi va review sifati tushadi. Bo'lish imkonsiz bo'lsa, reviewer kamida umumiy dizayn haqida izoh beradi."
  - q: "Muallif va reviewer ikki yondashuv bo'yicha kelisha olmayapti va ikkalasi ham texnik jihatdan to'g'ri. Standart nima deydi?"
    options:
      - "Reviewer har doim haq"
      - "Muallif ikkala yondashuv teng darajada to'g'ri ekanini ko'rsatsa, muallifning tanlovi qabul qilinadi"
      - "Ovoz berish orqali hal qilinadi"
      - "O'zgarish bekor qilinadi"
    answer: 1
    explain: "Standartga ko'ra dizayn qarorlari shaxsiy did emas, muhandislik tamoyillari bilan baholanadi. Bir nechta yondashuv teng to'g'ri bo'lsa, muallifning afzalligi qabul qilinadi. Murakkab kelishmovchilikda jonli muhokama va keyin eskalatsiya."
  - q: "Reviewer kodni tushunmadi va so'radi. Muallif review tool'da uzun tushuntirish yozdi. Google qo'llanmasi bo'yicha eng yaxshi natija nima?"
    options:
      - "Tushuntirish yetarli, tasdiqlash mumkin"
      - "Muallif tushuntirishni wiki'ga ko'chiradi"
      - "Kod tushunarliroq qilib qayta yoziladi yoki kerak bo'lsa kodga izoh qo'shiladi, chunki review'dagi tushuntirish kelajakdagi o'quvchiga yetib bormaydi"
      - "Reviewer boshqa reviewer'ni chaqiradi"
    answer: 2
    explain: "Kodni reviewer tushunmasa, keyingi o'quvchilar ham tushunmaydi. Review tool'dagi javob faqat reviewer'ga yordam beradi. Shuning uchun asosiy yechim - kodni aniqroq qilish."
  - q: "Quyidagi izohlardan qaysi biri Google'ning xushmuomalalik tavsiyasiga eng mos?"
    options:
      - "\"Nega bu yerda bunaqa qilding? Hech qanday ma'nosi yo'q.\""
      - "\"Har doim shunday xato qilasan.\""
      - "\"Men buni boshqacha yozardim.\""
      - "\"Bu yerda cache qo'shilgani invalidatsiya murakkabligini oshiradi, lekin o'lchovda foyda ko'rinmayapti. Cache'siz variant soddaroq bo'lardi.\""
    answer: 3
    explain: "Izoh dasturchi haqida emas, kod haqida va sababni tushuntiradi. Birinchi ikkitasi shaxsga qaratilgan, uchinchisi sababsiz did."
task:
  title: "PR uchun review izohlari yozish"
  prompt: |
    Hamkasbingiz quyidagi PR'ni ochdi: "Yoqilg'i to'kish ogohlantirishini qo'shdim". Siz reviewer'siz.

    1. Kodni Google'ning "What to look for" ro'yxati bo'yicha ko'rib chiqing (design, functionality, complexity, tests, naming, comments).
    2. 5-8 ta review izohi yozing. Har birini darajasi bilan belgilang: majburiy (belgisiz), `Nit:`, `Optional:` yoki `FYI:`. Har bir izohda sababni ayting.
    3. Kamida bitta ijobiy izoh yozing.
    4. Yakuniy qaror: tasdiqlash, izohlar bilan tasdiqlash yoki o'zgarish so'rash. Nega?

    Yechim sifatida izohlar ro'yxatini kod ichidagi komment ko'rinishida yoki alohida yozing.
  lang: ts
  starter: |
    // PR: Yoqilg'i to'kish ogohlantirishini qo'shdim
    import { Injectable } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";
    import { TelegramService } from "../telegram/telegram.service";

    @Injectable()
    export class FuelAlertService {
      private cache = new Map<string, number>();

      constructor(private prisma: PrismaService, private tg: TelegramService) {}

      // fuel drain check
      async check(vId: string, lvl: number) {
        const prev = this.cache.get(vId);
        this.cache.set(vId, lvl);
        if (!prev) return;
        const d = prev - lvl;
        if (d > 15) {
          const v = await this.prisma.vehicle.findUnique({ where: { id: vId } });
          const users = await this.prisma.user.findMany({ where: { companyId: v!.companyId } });
          for (const u of users) {
            await this.tg.send(u.telegramId, `To'kish! ${v!.plate}: ${d} l`);
          }
        }
      }
    }

    // fuel-alert.service.spec.ts
    // it("works", async () => {
    //   const s = new FuelAlertService(prismaMock, tgMock);
    //   await s.check("v1", 50);
    //   await s.check("v1", 30);
    //   expect(tgMock.send).toHaveBeenCalled();
    // });
  solution: |
    // Review izohlari (darajasi bilan):

    // 1. [majburiy] Functionality: `if (!prev) return;` sathi 0 bo'lgan bakni "oldingi qiymat yo'q"
    //    deb hisoblaydi. Bo'sh bakdan keyingi o'qishlar tekshirilmaydi.
    //    `prev === undefined` aniqroq.

    // 2. [majburiy] Design: holat `Map` ichida, jarayon xotirasida. Servis qayta ishga tushsa yoki
    //    bir nechta instance bo'lsa, oldingi sath yo'qoladi yoki instance'lar o'rtasida farq qiladi.
    //    Oxirgi sathni bazada (yoki Redis'da) saqlash kerakmi? Agar bu ataylab bo'lsa,
    //    cheklovni komment bilan yozib qo'yaylik.

    // 3. [majburiy] Functionality: GPS shovqini va harakat paytidagi tebranish 15 l dan katta sakrash
    //    berishi mumkin. Bitta o'qishdagi farq bo'yicha ogohlantirish yolg'on signallar beradi.
    //    Mahsulot jamoasi bilan qoidani (masalan, to'xtab turganda, N daqiqa ichida) aniqlashtiramiz.

    // 4. [majburiy] Tests: test faqat "send chaqirildi"ni tekshiradi. Chegaraviy holatlar yo'q:
    //    roppa-rosa 15 l, bo'sh bak, mashina topilmasa. Test nomi "works" nimani kutayotganini aytmaydi.

    // 5. [majburiy] `v!` - mashina o'chirilgan bo'lsa, runtime xato. Topilmasa nima bo'lishi kerakligini
    //    ochiq yozaylik.

    // 6. Optional: kompaniyaning barcha foydalanuvchilariga yuborish ko'p bo'lishi mumkin. Faqat
    //    dispetcher rolidagilarga yuborish kerakmi? Ketma-ket `await` o'rniga xabarlarni queue'ga qo'yish
    //    sekin Telegram API servisni bloklashining oldini oladi.

    // 7. Nit: `vId`, `lvl`, `d`, `tg` o'rniga `vehicleId`, `levelLiters`, `dropLiters`, `telegram`.
    //    15 ni `SUSPICIOUS_DROP_LITERS` konstantasiga chiqarsak, qoida qidiriladigan bo'ladi.

    // 8. Nit: `// fuel drain check` komment metod nomini takrorlaydi. Agar qoida bo'yicha
    //    "nega 15 l" degan sabab bo'lsa, o'shani yozgan foydaliroq.

    // 9. FYI: ogohlantirish matnlari keyinchalik o'zbek/rus tillarida kerak bo'lishi mumkin,
    //    bu PR'da emas.

    // Ijobiy: Telegram yuborish alohida servis orqasida, shuning uchun uni testda almashtirish oson.
    // Feature'ni alohida servisga ajratganingiz ham yaxshi.

    // Qaror: o'zgarish so'rayman. 1, 3 va 5-izohlar noto'g'ri xatti-harakat yoki yolg'on signal beradi,
    // 2-izoh ko'p instance'li deploy'da ishlamaydi. Bular tuzatilsa va 4-band bo'yicha testlar
    // qo'shilsa, Nit'larsiz ham tasdiqlayman.
  solutionNotes: |
    - Izohlar muhimlik bo'yicha tartiblangan: avval to'g'rilik va dizayn, keyin testlar, oxirida nomlar. Google qo'llanmasi ham avval katta rasmni, keyin asosiy fayllarni ko'rib, dizayn izohlarini darhol yuborishni maslahat beradi.
    - Har bir izoh kod haqida, shaxs haqida emas, va sababni aytadi.
    - Majburiy va ixtiyoriy izohlar ochiq farqlangan: muallif nimani albatta tuzatish kerakligini biladi.
    - Mahsulot qoidasi bo'yicha noaniqlik (3-izoh) kod emas, talab muammosi: reviewer uni o'zi hal qilishga urinmaydi, savol beradi.
    - Ijobiy izoh rasmiyatchilik emas: u qaysi qarorni saqlash kerakligini aytadi.
    - Qaror aniq va shartlari bilan: muallif nima qilsa tasdiqlanishini biladi.
  checklist:
    - "Kamida bitta functionality xatosi (masalan, `!prev` yoki `v!`) topildi"
    - "Testlarning yetishmasligi va test nomi haqida izoh bor"
    - "Har bir izoh darajasi bilan belgilangan (majburiy, Nit, Optional, FYI)"
    - "Har bir izohda sabab bor va u shaxsga emas, kodga qaratilgan"
    - "Kamida bitta ijobiy izoh va asoslangan yakuniy qaror bor"
---

## Muammo

Code review ko'p jamoalarda uchta noto'g'ri holatdan biriga tushadi.

Birinchisi - **rezina muhr**. PR ochiladi, kimdir ikki daqiqada "LGTM" yozadi. Review jarayoni bor, lekin u hech narsani ushlamaydi. Kod sifati faqat muallifning o'sha kungi kayfiyatiga bog'liq.

Ikkinchisi - **darvozabon**. Bitta katta dasturchi har bir PR'ni o'n kun ushlab turadi, har safar 40 ta izoh qoldiradi va ularning yarmi shaxsiy did: "men `reduce` emas, `for` yozardim". Jamoa review'dan qo'rqadi, PR'lar katta bo'lib boradi (chunki har birini o'tkazish qimmat), va katta PR'lar yanada yomonroq review qilinadi.

Uchinchisi - **jang maydoni**. Izohlar shaxsga qaratilgan, kelishmovchiliklar haftalab davom etadi, va oxirida kim qattiqroq tursa, o'sha yutadi.

Uchala holatda ham review asosiy maqsadini bajarmaydi: kodning umumiy sog'lig'ini vaqt o'tishi bilan yaxshilab borish. 4-darsda texnik qarzni ko'rgan edik, review uning eng arzon oldini olish nuqtasi: muammo hali bitta PR ichida, hali hech kim unga tayanmagan.

## Asosiy g'oya

Google o'zining code review amaliyotlarini ochiq qo'llanma sifatida e'lon qilgan va u sanoatda keng qo'llanadigan me'yor. Uning markaziy tamoyili shunday: reviewer o'zgarishni **u tizimning umumiy code health'ini aniq yaxshilaganda** tasdiqlashi kerak, hatto o'zgarish mukammal bo'lmasa ham. Qo'llanma buni ochiq aytadi: mukammal kod yo'q, faqat yaxshiroq kod bor.

Bu tamoyil ikki tomonga ishlaydi. Bir tomondan, reviewer har bir mayda narsani sayqallashni talab qilmasligi kerak, aks holda jamoa sekinlashadi. Boshqa tomondan, code health'ni yomonlashtiradigan o'zgarish favqulodda holatlardan tashqari qabul qilinmasligi kerak: "keyin tuzatamiz" deyilgan narsa odatda tuzatilmaydi.

Qolgan qoidalar shu tamoyildan chiqadi:

- **Faktlar va ma'lumot shaxsiy fikr va afzallikdan ustun.**
- **Style guide uslub bo'yicha yakuniy hakam.** Unda yo'q narsa - did masalasi, va did uchun PR bloklanmaydi.
- **Dizayn qarorlari muhandislik tamoyillari bilan baholanadi.** Muallif bir nechta yondashuv teng to'g'ri ekanini ko'rsatsa, uning tanlovi qabul qilinadi.

## Chuqurroq: nimani qidirish, qanday ko'rib chiqish, qanday yozish

### Nimani qidirish kerak

Qo'llanmaning "What to look for" bo'limi tartibli ro'yxat beradi:

- **Design.** Bo'laklar o'zaro mantiqiy ishlaydimi? Bu o'zgarish shu kod bazasiga tegishlimi yoki kutubxonaga? Hozir uni qo'shish vaqtimi?
- **Functionality.** Kod muallif niyat qilgan ishni qiladimi va bu foydalanuvchi uchun yaxshimi? Edge case'lar, concurrency muammolari, kodda ko'rinib turgan xatolar.
- **Complexity.** Har darajada: qator, funksiya, klass. Qo'llanmaning mezoni: kodni o'quvchilar tez tushuna olmasa, u juda murakkab. Alohida e'tibor - **over-engineering**: keraksiz umumiylik va hozir kerak bo'lmagan funksionallik. Hozirgi muammoni hal qiling, taxminiy kelajakdagisini emas (9-dars, YAGNI).
- **Tests.** Testlar odatda production kodi bilan bir xil o'zgarishda bo'lsin. Kod buzilganda ular haqiqatan yiqiladimi? Testlar ham saqlanadigan kod, ulardagi ortiqcha murakkablikni qabul qilmang.
- **Naming.** Nom narsa nima ekanini yoki nima qilishini yetkazadimi, haddan tashqari uzun bo'lmasdan.
- **Comments.** Izohlar aniq, kerakli va asosan *nima* emas, *nega* ni tushuntiradimi? Kod nima qilishini tushuntirish uchun izoh kerak bo'lsa, kodni soddalashtiring (31-33-darslar).
- **Style va Consistency.** Style guide'ga amal qilish. Katta formatlash o'zgarishlari alohida o'zgarishda.
- **Documentation.** O'zgarish build, test yoki ishlatish usulini o'zgartirsa, hujjat yangilanganmi.
- **Every line.** Har bir qatorni tushunib ko'rib chiqing. Tushunmasangiz, so'rang: boshqalar ham tushunmaydi. Xavfsizlik yoki concurrency kabi sohada malakangiz yetmasa, malakali reviewer'ni qo'shing.
- **Context.** Faqat diff'ga emas, butun faylga va tizimga qarang.
- **Good things.** Yaxshi qarorlarni ham ayting.

Ro'yxat tartibi tasodifiy emas: dizayn va to'g'rilik birinchi, uslub oxirida. Ko'p jamoalarda review aksincha ishlaydi: eng ko'p izoh nomlar va formatlash haqida, chunki ularni ko'rish oson. Linter va Prettier (36-37-darslar) uslubni avtomatlashtirsa, inson e'tibori muhimroq narsalarga qoladi.

### Qanday ko'rib chiqish kerak

Qo'llanma uch qadamli tartibni taklif qiladi. Avval keng qarash: tavsifni o'qing va bu o'zgarish umuman kerakmi, deb so'rang. Kerak bo'lmasa, darhol va xushmuomalalik bilan ayting. Keyin asosiy qismlar: eng muhim mantiqiy o'zgarishli fayllarni toping va dizayn izohlarini darhol yuboring, chunki dizayn o'zgarsa, qolganini ko'rib chiqish behuda. Oxirida qolgan fayllar mantiqiy tartibda. Testlarni birinchi o'qish o'zgarish niyatini tushunishga yordam beradi.

### Tezlik

Qo'llanmaga ko'ra review'ga javob berishning maksimal vaqti bir ish kuni. Lekin reviewer chuqur ish (kod yozish) o'rtasida o'zini to'xtatmasligi kerak, tabiiy tanaffusni kutsin. Agar izohlar mayda bo'lsa yoki muallif ularni tuzatishiga ishonch bo'lsa, "izohlar bilan LGTM" berish mumkin: bu ayniqsa turli vaqt zonalarida bir kunlik kutishni oldini oladi.

Sekin review'ning yashirin narxi bor: muallif kontekstni yo'qotadi, PR'lar to'planadi va ularni kattaroq qilib yuborish vasvasasi paydo bo'ladi.

### Kichik o'zgarishlar

Muallif tomoni uchun qo'llanma kichik o'zgarishlarni tavsiya qiladi: ular tezroq va puxtaroq ko'rib chiqiladi, xatolarni kamroq yashiradi, rad etilsa kamroq ish yo'qoladi va orqaga qaytarish oson. Qat'iy chegara yo'q, lekin qo'llanma taxminan 100 qatorni odatda maqbul, 1000 qatorni odatda juda katta deb baholaydi. Refaktoringlar feature va bug fix'dan alohida o'zgarishda bo'lsin. Bu 78-darsdagi Tidy First g'oyasi bilan bir xil: struktura o'zgarishi va xatti-harakat o'zgarishi alohida.

### Izohlarni qanday yozish kerak

- **Xushmuomalalik.** Izoh dasturchi haqida emas, kod haqida bo'lsin. "Nega bu yerda thread ishlatding?" emas, "Bu concurrency modeli murakkablik qo'shadi, lekin performance foydasi ko'rinmayapti".
- **Nega ni tushuntiring.** Har doim emas, lekin ko'pincha: qaysi amaliyotga tayanayotganingizni yoki bu code health'ni qanday yaxshilashini.
- **Muvozanat.** Yechimni topish muallifning vazifasi. Muammoni ko'rsatib, qarorni muallifga qoldirish ko'pincha yaxshiroq natija beradi, lekin ba'zan to'g'ridan-to'g'ri taklif foydaliroq.
- **Darajani belgilang.** `Nit:` - texnik jihatdan tuzatilishi kerak, lekin ta'siri kichik. `Optional:` yoki `Consider:` - yaxshi g'oya, lekin majburiy emas. `FYI:` - bu o'zgarishda kutilmaydi, kelajak uchun. Belgisiz izoh esa majburiy deb tushuniladi.
- **Tushuntirishni qabul qilish.** Reviewer kodni tushunmasa, odatda kod aniqroq qilib qayta yozilishi kerak. Review tool'dagi tushuntirish keyingi o'quvchiga yordam bermaydi.

### Kelishmovchiliklar

Avval konsensusga intiling. Qiyin bo'lsa, yozishmani to'xtatib, yuzma-yuz yoki video orqali gaplashing va natijani PR'ga yozib qo'ying. Hal bo'lmasa, kengroq jamoa yoki tech lead'ga eskalatsiya. Muhimi: PR ikki kishi kelisha olmagani uchun tiqilib qolmasin.

## Misol: bitta muammo, uch xil izoh

PR'dagi kod:

```ts
export function calcRentPrice(days: number, dailyRate: number, isVip: boolean): number {
  let price = days * dailyRate;
  if (days >= 7) price = price * 0.9;
  if (days >= 30) price = price * 0.8;
  if (isVip) price = price * 0.95;
  return Math.round(price);
}
```

30 kunlik ijarada ikkala chegirma ketma-ket qo'llaniladi (0.9 va 0.8, natijada 28% chegirma). Bu ataylabmi yoki xato?

Yomon izoh: "Bu noto'g'ri." Sababsiz, nimani tuzatish kerakligi noaniq.

Yomon izoh: "Har doim chegirmalarni chalkashtirasan." Shaxsga qaratilgan, kod haqida hech narsa demaydi.

Yaxshi izoh:

```ts
// Review izohi (majburiy):
// days >= 30 bo'lganda ikkala chegirma ketma-ket qo'llanyapti: 0.9 * 0.8 = 0.72, ya'ni 28%.
// Narx siyosatida 30+ kun uchun 20% deb yozilgan (tariflar sahifasi). Agar bu ataylab bo'lmasa,
// chegirmalar bir-birini istisno qilishi kerak. Test qo'shamizmi: 7, 29, 30 kun chegaralari uchun?
//
// Taklif (Optional):
const LONG_TERM_DISCOUNTS = [
  { minDays: 30, multiplier: 0.8 },
  { minDays: 7, multiplier: 0.9 },
] as const;

export function rentDiscountMultiplier(days: number): number {
  return LONG_TERM_DISCOUNTS.find((d) => days >= d.minDays)?.multiplier ?? 1;
}
```

Izoh faktga tayanadi (narx siyosati), muammoni aniq raqam bilan ko'rsatadi, test so'raydi va taklifni ixtiyoriy deb belgilaydi. Qaror (ikkala chegirma qo'shilishi kerakmi) biznes masalasi, va izoh buni muallif hal qilmaydigan savol sifatida qoldiradi.

## Qachon qo'llamaslik kerak

- **Favqulodda tuzatish.** Production yonayotganda to'liq review kutish zarar keltiradi. Qo'llanma ham favqulodda holatlarni alohida ko'radi. Lekin keyin review'ni o'tkazing va doimiy tuzatishni oddiy tartibda qiling.
- **Juft dasturlash va mob programming.** Kod yozilayotgan paytda ikki kishi ko'rib chiqqan bo'lsa, rasmiy review ko'pincha takror. Ko'p jamoalar buni review deb hisoblaydi, bu oqilona.
- **Har bir PR'ga ikki reviewer.** Kichik jamoada bu PR'larni ikki baravar sekinlashtiradi. Xavfli sohalar (to'lovlar, autentifikatsiya, migratsiyalar) uchun ikki reviewer, qolgani uchun bitta - yaxshiroq muvozanat.
- **Review'ni dizayn muhokamasi o'rniga ishlatish.** Katta arxitektura qarori 2000 qatorli PR'da birinchi marta muhokama qilinsa, kech. Bunday qarorlar uchun oldindan qisqa dizayn hujjati yoki ADR (39-dars).
- **Faqat Google qo'llanmasiga ko'r-ko'rona amal qilish.** U Google'ning monorepo va katta jamoalar sharoitidan chiqqan. "Bir ish kuni" yoki "100 qator" sizning jamoangizda boshqacha bo'lishi mumkin. Tamoyillarni oling, raqamlarni moslang.

## Stack'da: TypeScript jamoasi uchun amaliyot

- **Avtomatlashtiring.** `tsc --noEmit`, ESLint, Prettier va testlar CI'da. Inson reviewer formatlash haqida izoh yozmasin.
- **PR shabloni.** Nima o'zgardi, nega, qanday test qilindi, migratsiya bormi, xavflar. Bu reviewer'ning birinchi qadamini (keng qarash) arzon qiladi.
- **Stack'ga xos checklist.** NestJS: DTO va ValidationPipe, domen xatolari, modul eksportlari (94-dars). Next.js: `"use client"` chegarasi, Server Action'da authorization (93-dars). Prisma: sikl ichida so'rov, migratsiya expand-contract'mi (95-dars). React: keraksiz effekt va ortiqcha state (92-dars).
- **AI tomonidan yozilgan kod.** U ham har bir qatorni tushunib review qilinadi, hech qanday imtiyozsiz (98-dars).

## Xulosa

- Review'ning maqsadi - code health'ni vaqt o'tishi bilan yaxshilash, mukammallik emas.
- Avval dizayn, to'g'rilik va murakkablik, oxirida uslub. Uslubni avtomatlashtiring.
- Izoh kod haqida, sababi bilan va darajasi bilan (`Nit:`, `Optional:`, `FYI:`).
- Kichik, mustaqil o'zgarishlar va tez javob - yaxshi review'ning sharti.
- Faktlar did'dan ustun, teng yondashuvlarda muallif tanlaydi, kelishmovchilik tiqilib qolmasin.
