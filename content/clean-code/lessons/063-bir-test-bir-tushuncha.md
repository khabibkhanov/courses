---
n: 63
slug: bir-test-bir-tushuncha
title: "Bir test - bir tushuncha va test nomlari"
summary: "'Har testda bitta assert' qoidasi ko'pincha noto'g'ri tushuniladi. Bu darsda Martinning 'bir test - bir tushuncha' g'oyasini, Meszaros'ning 'bitta shartni tekshiring' tamoyilini va test nomlarini spetsifikatsiya sifatida yozishni ko'rib chiqamiz."
duration: 30
sources:
  - id: cc1
    note: "9-bob \"Unit Tests\": \"One Assert per Test\" va \"Single Concept per Test\" bo'limlari, given-when-then nomlash"
  - id: xunit-patterns
    note: "Principles of Test Automation: Verify One Condition per Test, Communicate Intent; Four-Phase Test va Single Condition Test; Assertion Roulette va Eager Test smell'lari; Custom Assertion"
quiz:
  - q: "Test buyurtma yaratadi va natijada `id`, `status`, `total` va `createdAt` maydonlarini tekshiradi (4 ta expect). Bu 'bir test - bir tushuncha' qoidasini buzadimi?"
    options:
      - "Ha, har maydon uchun alohida test kerak"
      - "Ha, chunki bitta testda bittadan ortiq expect bo'lmasligi kerak"
      - "Yo'q, agar to'rttasi ham 'yaratilgan buyurtmaning holati' degan bitta tushunchani tasvirlasa. Ularni `toEqual`/`toMatchObject` bilan bitta tasdiqqa birlashtirish ham mumkin"
      - "Yo'q, chunki expect soni muhim emas va testda istalgancha tushuncha bo'lishi mumkin"
    answer: 2
    explain: "Martin bitta assert qoidasini foydali yo'riqnoma deb biladi, lekin asosiy qoida - bitta tushuncha. Bitta natijaning bir nechta xususiyatini tekshirish bitta tushuncha. Oxirgi variant esa noto'g'ri, chunki tushunchalar sonini cheklash aynan qoidaning mohiyati."
  - q: "Quyidagi test nomlaridan qaysi biri test yiqilganda eng ko'p ma'lumot beradi?"
    options:
      - "`it('calculateFee test 2')`"
      - "`it('should work correctly')`"
      - "`it('calculateFee returns number')`"
      - "`it('VIP mijoz uchun yetkazib berish narxi 0')`"
    answer: 3
    explain: "Yaxshi nom shart va kutilgan natijani aytadi. Yiqilgan test ro'yxatida 'VIP mijoz uchun yetkazib berish narxi 0' degan qatorni ko'rgan odam kodni ochmasdan qaysi qoida buzilganini biladi. 'returns number' esa tip tekshiruvchi allaqachon beradigan ma'lumot."
  - q: "Meszaros 'Verify One Condition per Test' tamoyilini qanday asoslaydi?"
    options:
      - "Bitta testda ko'p shart bo'lsa, birinchi yiqilgan tasdiq keyingilarini yashiradi va xato joyini aniqlash qiyinlashadi"
      - "xUnit freymvorklari bir nechta assert'ni qo'llab-quvvatlamaydi"
      - "Ko'p shartli testlar coverage'ni kamaytiradi"
      - "Bir shartli testlar har doim tezroq ishlaydi"
    answer: 0
    explain: "Asosiy sabab diagnostika: tasdiq yiqilganda test to'xtaydi va keyingi shartlarning holati noma'lum qoladi. Meszaros fixture'ni avtomatik tez yaratish mumkinligini, shuning uchun har shart uchun alohida test yozish arzon ekanini ham qo'shadi."
  - q: "Testda: buyurtma yaratiladi, tekshiriladi, keyin bekor qilinadi, tekshiriladi, keyin qayta tiklanadi, tekshiriladi. Bu qaysi smell?"
    options:
      - "Mystery Guest"
      - "Eager Test: bitta test bir nechta xatti-harakatni ketma-ket tekshiradi"
      - "Slow Test"
      - "Hech qaysi, bu holat mashinasini tekshirishning to'g'ri usuli"
    answer: 1
    explain: "Bir nechta Act-Assert juftligi bitta testda - Eager Test belgisi. 'Bekor qilish' buzilsa, 'qayta tiklash' haqida hech narsa bilmaysiz. Har bir o'tishni o'z boshlang'ich holatidan boshlanadigan alohida test bilan tekshirish kerak."
  - q: "`it.each` bilan 8 ta kirish qiymatini bitta jadvalda tekshirish 'bir test - bir tushuncha'ga ziddmi?"
    options:
      - "Ha, chunki bitta test ichida 8 ta holat bor"
      - "Ha, it.each faqat performance testlar uchun"
      - "Yo'q, lekin faqat 8 tadan kam bo'lsa"
      - "Yo'q, it.each har qatorni alohida test sifatida ishga tushiradi va hisobot beradi. Muhimi - jadvaldagi hamma qatorlar bitta qoidaga tegishli bo'lishi"
    answer: 3
    explain: "Parametrli testlar har holatni alohida ishga tushiradi, shuning uchun bitta qator yiqilsa, qolganlari baribir tekshiriladi va nomi bilan ko'rinadi. Jadvalda turli qoidalarni aralashtirish esa xato: ularni alohida jadvallarga ajrating."
  - q: "Test nomlari va `describe` bloklari qanday tuzilsa, ular eng yaxshi hujjat vazifasini bajaradi?"
    options:
      - "Har describe metod nomi bo'lsin, ichida 'test 1', 'test 2'"
      - "describe - tekshirilayotgan birlik yoki holat, it - xatti-harakat va shart. Hisobot o'qilganda spetsifikatsiya kabi o'qilsin"
      - "Barcha testlar bitta describe ichida, nomlar qisqa"
      - "Nomlar ingliz tilida bo'lishi shart, aks holda CI tushunmaydi"
    answer: 1
    explain: "describe va it ierarxiyasi test hisobotini o'qiladigan spetsifikatsiyaga aylantiradi: 'RefundPolicy > yetkazilganiga 14 kundan oshgan bo'lsa > rad etadi'. Til jamoaning kelishuviga bog'liq, CI uchun farqi yo'q."
task:
  title: "Eager testni tushunchalarga ajratish"
  prompt: |
    Quyidagi Jest testi avtomobil ijarasi bron qilish (booking) holat mashinasini tekshiradi. U bitta katta test.

    1. Testda nechta tushuncha borligini aniqlang va har biriga nom bering.
    2. Testni `describe` ierarxiyasi bilan alohida testlarga ajrating. Har test o'z boshlang'ich holatidan boshlansin.
    3. Test nomlarini shunday yozingki, hisobot spetsifikatsiya kabi o'qilsin.
    4. Agar bir nechta expect bitta tushunchaga tegishli bo'lsa, ularni bitta tasdiqqa birlashtiring.
  lang: ts
  starter: |
    import { Booking } from "./booking";

    describe("Booking", () => {
      it("booking flow", () => {
        const b = Booking.create({ carId: "car-12", customerId: "c-5", days: 3 });
        expect(b.status).toBe("pending");
        expect(b.total).toBe(900_000);
        expect(b.carId).toBe("car-12");

        b.confirm();
        expect(b.status).toBe("confirmed");

        expect(() => b.confirm()).toThrow("already confirmed");

        b.cancel("customer request");
        expect(b.status).toBe("cancelled");
        expect(b.cancelReason).toBe("customer request");

        expect(() => b.confirm()).toThrow();
      });
    });
  solution: |
    import { Booking } from "./booking";

    function aPendingBooking(): Booking {
      return Booking.create({ carId: "car-12", customerId: "c-5", days: 3 });
    }

    function aConfirmedBooking(): Booking {
      const booking = aPendingBooking();
      booking.confirm();
      return booking;
    }

    describe("Booking", () => {
      describe("yaratilganda", () => {
        it("pending holatida va kunlar bo'yicha hisoblangan summa bilan yaratiladi", () => {
          const booking = aPendingBooking();

          expect(booking).toMatchObject({
            status: "pending",
            carId: "car-12",
            total: 900_000,
          });
        });
      });

      describe("pending holatida", () => {
        it("tasdiqlansa confirmed holatiga o'tadi", () => {
          const booking = aPendingBooking();

          booking.confirm();

          expect(booking.status).toBe("confirmed");
        });
      });

      describe("confirmed holatida", () => {
        it("qayta tasdiqlashni rad etadi", () => {
          const booking = aConfirmedBooking();

          expect(() => booking.confirm()).toThrow("already confirmed");
        });

        it("bekor qilinsa sababini saqlab cancelled holatiga o'tadi", () => {
          const booking = aConfirmedBooking();

          booking.cancel("customer request");

          expect(booking).toMatchObject({
            status: "cancelled",
            cancelReason: "customer request",
          });
        });
      });

      describe("cancelled holatida", () => {
        it("tasdiqlashni rad etadi", () => {
          const booking = aConfirmedBooking();
          booking.cancel("customer request");

          expect(() => booking.confirm()).toThrow("cancelled");
        });
      });
    });
  solutionNotes: |
    - Starter'da beshta tushuncha bor edi: yaratish, tasdiqlash, qayta tasdiqlashni rad etish, bekor qilish, bekor qilingandan keyin tasdiqlashni rad etish.
    - Har test o'z boshlang'ich holatini Creation Method (`aPendingBooking`, `aConfirmedBooking`) orqali oladi. Endi "bekor qilish" buzilsa, "tasdiqlash" testlari ta'sirlanmaydi.
    - `describe` holat nomlari bo'yicha guruhlangan: hisobot holat mashinasining spetsifikatsiyasi kabi o'qiladi.
    - Yaratilgan bronning uchta maydoni bitta tushuncha ("to'g'ri yaratilgan"), shuning uchun `toMatchObject` bilan bitta tasdiqqa birlashtirildi. Yiqilganda Jest farqni maydonlar bo'yicha ko'rsatadi.
    - Oxirgi testda `toThrow()` argumentsiz edi: u istalgan xatoda o'tardi, masalan `TypeError`da ham. Endi xabar aniq tekshiriladi. Agar domen xatolari klass bo'lsa, `toThrow(BookingStateError)` yanada yaxshi.
  checklist:
    - "Har testda bitta Act va bitta tushuncha bor"
    - "Har test o'z boshlang'ich holatidan boshlanadi, oldingi testga bog'liq emas"
    - "describe va it nomlari birga o'qilganda qoida tushunarli"
    - "Bitta tushunchaga tegishli tekshiruvlar bitta tasdiqqa birlashtirilgan"
    - "toThrow aniq xato turi yoki xabar bilan ishlatilgan"
---

## Muammo

Test yiqildi. CI hisobotida bitta qator: `Booking > booking flow - expected "confirmed", received "pending"`. Endi siz testni ochasiz va 40 qatorli ketma-ketlikni o'qiysiz: bron yaratiladi, tasdiqlanadi, bekor qilinadi, yana nimadir qilinadi. Qaysi qadamda nima buzildi? Keyingi qadamlar ham buzilganmi yoki yo'q? Buni bilish uchun testni bo'lib-bo'lib qayta ishga tushirasiz.

Teskari holat ham bor. Kimdir "har testda bitta assert" qoidasini eshitgan va yaratilgan buyurtmaning to'rtta maydonini to'rtta alohida testda tekshirgan. Har test bir xil 15 qatorli tayyorgarlikni takrorlaydi, fayl 400 qatorga yetgan va bitta maydonni o'zgartirish uchun to'rtta testni tahrirlash kerak.

Ikkala muammo ham bitta savolga borib taqaladi: **bitta testda nima bo'lishi kerak?** Va ikkinchi savol: test qanday nomlansa, u yiqilganda kodni ochmasdan nima buzilganini aytadi?

## Asosiy g'oya

### Martin: bitta assert emas, bitta tushuncha

Robert Martin *Clean Code*ning 9-bobida ikki qoidani ketma-ket muhokama qiladi. Birinchisi - "One Assert per Test": ba'zi mutaxassislar har testda faqat bitta assert bo'lishini tavsiya qiladi. Martin bu qoidani foydali yo'riqnoma deb biladi, chunki u testni tez tushuniladigan qiladi. Lekin u ochiq aytadi: bir nechta assert qo'yishdan qo'rqmaydi, asosiysi ularning sonini minimal saqlash.

Keyin u yaxshiroq qoidani taklif qiladi - **"Single Concept per Test"**: har bir test bitta tushunchani tekshirsin. Martin misolida bitta test ichida bir-biriga aloqasi yo'q bir nechta holat (sana arifmetikasining turli qoidalari) tekshiriladi va u buni uchta testga ajratadi. Muammo assert'lar sonida emas edi, balki bitta testda bir nechta mustaqil g'oya aralashganida edi.

Bu farq muhim. Yaratilgan buyurtmaning `status`, `total` va `customerId` maydonlarini tekshirish - bitta tushuncha ("buyurtma to'g'ri yaratildi"). Buyurtmani yaratish, keyin bekor qilish, keyin qayta tiklash - uchta tushuncha.

### Meszaros: bitta shartni tekshiring

Gerard Meszaros *xUnit Test Patterns*da test avtomatlashtirish tamoyillarini sanab o'tadi va ulardan biri **Verify One Condition per Test**. Uning asosi diagnostik: bitta testda bir nechta shart bo'lsa, birinchi yiqilgan tasdiq testni to'xtatadi va keyingi shartlarning holati noma'lum qoladi. Natijada xato joyini topish qiyinlashadi. Meszaros yana bir kuzatuvni qo'shadi: fixture'ni dastur orqali tez yaratish mumkin, shuning uchun har shart uchun alohida test yozish arzon.

Uning to'rt fazali test patternida (62-dars) har testda bitta exercise va bitta verify fazasi bo'ladi. Agar testda exercise-verify juftliklari ketma-ket takrorlansa, bu test bitta shartli emasligining belgisi. Meszaros bunday testni **Eager Test** deb ataydi, ko'p tasdiqli va qaysi biri yiqilgani tushunarsiz testni esa **Assertion Roulette** deb.

Meszaros bu qoidaga muvozanat ham beradi: **Custom Assertion** bir nechta tekshiruvni domen ma'nosidagi bitta tasdiqqa birlashtirishi mumkin, agar bu o'qilishni yaxshilasa. Ya'ni "bitta shart" mantiqiy birlik, sintaktik emas.

### Communicate Intent

Meszaros tamoyillaridan yana biri - **Communicate Intent**: test nima tekshirilayotganini aniq aytsin. Buning birinchi vositasi - nom. Martin ham test nomlari uchun given-when-then tuzilishini tilga oladi: qanday holat berilgan, nima bo'lganda, nima kutiladi.

## Chuqurroq: "tushuncha" chegarasini qanday aniqlash

"Bitta tushuncha" subyektiv ko'rinadi. Amaliyotda uni tekshirish uchun bir nechta savol yordam beradi.

### Savol 1: test nomida "va" bormi?

Agar testni to'g'ri nomlash uchun "va" kerak bo'lsa ("bronni tasdiqlaydi va bekor qiladi"), bu ikkita test. Istisno: "va" bitta natijaning xususiyatlarini birlashtirsa ("pending holatida va to'g'ri summa bilan yaratiladi"), bu bitta tushuncha bo'lishi mumkin.

### Savol 2: tasdiqlardan biri yiqilsa, qolganlari haqida bilish kerakmi?

Agar `status` noto'g'ri bo'lsa, `total` haqida bilish muhimmi? Agar ular bir-biriga bog'liq bo'lmagan qoidalardan kelib chiqsa, ha, muhim, va ularni ajratish kerak. Agar bitta obyektning holati bo'lsa, ularni bitta `toEqual` yoki `toMatchObject` bilan tekshirish yaxshiroq: Jest va Vitest farqni maydonlar bo'yicha ko'rsatadi, shuning uchun hech narsa yashirinmaydi.

### Savol 3: nechta Act bor?

Eng ishonchli belgi. Har bir Act - testlanayotgan xatti-harakat. Ikkita Act bo'lsa, ikkita xatti-harakat bor. Act'ni Arrange'dan farqlash kerak: holat mashinasini kerakli holatga keltirish uchun `booking.confirm()` chaqirish, agar test bekor qilishni tekshirsa, Arrange qismi. Bunday tayyorgarlikni Creation Method'ga (`aConfirmedBooking()`) olib chiqish testni tozalaydi.

### Parametrli testlar

`it.each` (Vitest va Jest) bitta qoidani ko'p kirish qiymati bilan tekshirish uchun eng toza vosita. U har qatorni alohida test sifatida ishga tushiradi va hisobotda alohida ko'rsatadi, shuning uchun Verify One Condition per Test buzilmaydi. Shart: jadvaldagi barcha qatorlar **bitta qoidaga** tegishli bo'lishi kerak. Agar jadvalda "chegirma" va "noto'g'ri kirish" aralashsa, ularni ikki jadvalga ajrating.

### Test nomlari spetsifikatsiya sifatida

Test hisoboti - tizim xatti-harakatining eng ishonchli hujjati, chunki u har kuni tekshiriladi. Buning uchun nomlar spetsifikatsiya kabi o'qilishi kerak. Amaliy uslublar:

- **describe - birlik yoki holat, it - xatti-harakat.** `describe("RefundPolicy") > describe("yetkazilganiga 14 kundan oshgan bo'lsa") > it("qaytarishni rad etadi")`.
- **Given-when-then nomda.** `"to'xtab turgan mashinada 10 daqiqada 40 litr tushsa, o'g'irlik ogohlantirishini yaratadi"`.
- **"should" so'zidan foydalanish yoki foydalanmaslik** jamoa uslubi. Muhimi - izchillik va shart bilan natijaning ko'rinishi.
- **Implementatsiya emas, xatti-harakat.** `"repository.save'ni chaqiradi"` emas, `"tasdiqlangan bronni saqlaydi"`. Birinchisi implementatsiyani tasvirlaydi va refaktoringda yolg'onga aylanadi (66-dars).

Til haqida: test nomlarini jamoa kelishgan tilda yozing. Agar domen tili o'zbekcha bo'lsa va jamoa shunday gapirsa, o'zbekcha nomlar spetsifikatsiyani biznes bilan muhokama qilishni osonlashtiradi. Bu kursdagi misollarda shunday qilamiz.

## Misol: yoqilg'i kartasi limiti

Korporativ yoqilg'i kartasida kunlik limit bor. Tranzaksiya limitdan oshsa, rad etiladi. Bloklangan karta har doim rad etadi. Quyidagi test "hammasi bitta joyda" yozilgan:

```ts
import { describe, expect, it } from "vitest";
import { FuelCard } from "./fuel-card";

describe("FuelCard", () => {
  it("limits", () => {
    const card = new FuelCard({ dailyLimitLiters: 100 });
    expect(card.authorize(60).approved).toBe(true);
    expect(card.authorize(30).approved).toBe(true);
    expect(card.authorize(20).approved).toBe(false);
    expect(card.authorize(20).reason).toBe("daily_limit");
    card.block();
    expect(card.authorize(1).approved).toBe(false);
  });
});
```

Agar uchinchi qator yiqilsa, siz blokirovka ishlayaptimi yoki yo'qmi bilmaysiz. Bundan tashqari, testlar bir-biriga bog'liq: uchinchi tranzaksiya natijasi oldingi ikkitasiga bog'liq, lekin bu nomdan ham, tuzilishdan ham ko'rinmaydi. `authorize(20)` ikki marta chaqirilgan - ikkinchisi ham limitni o'zgartiradimi? Bu test o'quvchidan javob talab qiladi.

Tushunchalarga ajratilgan versiya:

```ts
import { describe, expect, it } from "vitest";
import { FuelCard } from "./fuel-card";

function aCardWithDailyLimit(liters: number, alreadyUsedToday = 0): FuelCard {
  const card = new FuelCard({ dailyLimitLiters: liters });
  if (alreadyUsedToday > 0) card.authorize(alreadyUsedToday);
  return card;
}

describe("FuelCard.authorize", () => {
  describe("kunlik limit doirasida", () => {
    it.each([
      { used: 0, request: 60 },
      { used: 60, request: 40 },
    ])("$used litr ishlatilgan bo'lsa, $request litrni tasdiqlaydi", ({ used, request }) => {
      const card = aCardWithDailyLimit(100, used);

      const result = card.authorize(request);

      expect(result).toEqual({ approved: true });
    });
  });

  describe("kunlik limitdan oshsa", () => {
    it("daily_limit sababi bilan rad etadi", () => {
      const card = aCardWithDailyLimit(100, 90);

      const result = card.authorize(20);

      expect(result).toEqual({ approved: false, reason: "daily_limit" });
    });
  });

  describe("bloklangan karta", () => {
    it("limitdan qat'i nazar card_blocked sababi bilan rad etadi", () => {
      const card = aCardWithDailyLimit(100);
      card.block();

      const result = card.authorize(1);

      expect(result).toEqual({ approved: false, reason: "card_blocked" });
    });
  });
});
```

Nima o'zgardi va nima uchun:

- **Uchta qoida - uchta guruh.** Limit ichida, limitdan oshganda, bloklanganda. Har biri boshqasidan mustaqil yiqiladi.
- **Chegara aniq.** `used: 60, request: 40` aynan 100 ga teng holatni tekshiradi. Starter'da bu chegara yo'q edi va `<` yoki `<=` xatosi sezilmasdi.
- **Natija butunligicha tekshiriladi.** `toEqual({ approved: false, reason: "daily_limit" })` ikki expect'ni bitta tushunchaga birlashtiradi va starter'dagi `authorize(20)`ni ikki marta chaqirish muammosini yo'qotadi.
- **Bloklash testi yangi sababni ochdi.** Starter faqat `approved: false` ni tekshirardi. Endi sabab ham aniq, shuning uchun karta blokirovka emas, limit sababli rad etilsa test yiqiladi.
- **Arrange'dagi `authorize` Act emas.** `aCardWithDailyLimit(100, 90)` ichidagi chaqiruv - holatni tayyorlash. U yordamchiga chiqarilgani uchun testda Act bitta va aniq.

## Qachon qo'llamaslik kerak

- **Assert sonini sanash.** "Bitta expect" qoidasini metrika sifatida qo'llash testlarni maydalaydi va tayyorgarlikni takrorlaydi. Martinning o'zi ham asosiy qoida tushuncha ekanini aytadi.
- **Qimmat tayyorgarlikli testlar.** Real PostgreSQL bilan integratsion yoki e2e testda har bir shart uchun alohida test yozish suite'ni bir necha barobar sekinlashtirishi mumkin. Bunday hollarda bitta oqim ichida bir nechta tekshiruv qilish oqilona kompromiss. Lekin har tekshiruvni aniq xabar bilan yozing (`expect(res.status, "buyurtma yaratildi").toBe(201)`), shunda Assertion Roulette bo'lmaydi.
- **Ssenariy testlari.** E2E darajada foydalanuvchi yo'li ("ro'yxatdan o'tadi, mashina tanlaydi, to'laydi") tabiatan ketma-ket. Uni bo'laklash e2e testning ma'nosini yo'qotadi. Bu darajada "bitta tushuncha" - butun yo'l.
- **Juda uzun nomlar.** Agar test nomi uch qatorga cho'zilsa, ehtimol test ham juda ko'p narsani tekshiradi yoki `describe` darajasiga ko'chirish kerak bo'lgan kontekst nomga yopishgan.

## Stack'da: Vitest, Jest, NestJS

- **`toEqual` va `toMatchObject`.** Bitta obyekt holatini bitta tasdiq bilan tekshirish uchun. `toMatchObject` qo'shimcha maydonlarni e'tiborsiz qoldiradi, `toEqual` esa to'liq moslikni talab qiladi. Javob shartnomasini tekshirishda `toEqual` aniqroq.
- **`expect.soft` (Vitest).** Bir nechta tekshiruvdan keyin ham testni davom ettiradi va hamma yiqilishlarni ko'rsatadi. Qimmat integratsion testlarda Assertion Roulette'ni yumshatadi. Jest'da bunday o'rnatilgan imkoniyat yo'q.
- **`it.each` / `describe.each`.** Jadval qatorlari nomda `$field` sintaksisi bilan ko'rinadi, hisobot o'qiladigan bo'lib qoladi.
- **NestJS e2e.** supertest zanjirida `.expect(201).expect(({ body }) => ...)` bitta so'rovning javobini bitta tushuncha sifatida tekshiradi. Turli endpoint'lar uchun alohida `it` yozing.

## Xulosa

- Asosiy qoida - bitta assert emas, bitta tushuncha (Martin) yoki bitta shart (Meszaros).
- Bitta natijaning bir nechta xususiyati bitta tushuncha. Ularni `toEqual`/`toMatchObject` yoki Custom Assertion bilan birlashtiring.
- Bir nechta Act - bir nechta tushuncha. Holatni tayyorlash uchun chaqiruvlarni Creation Method'ga olib chiqing.
- `it.each` bitta qoidani ko'p qiymat bilan tekshirishning toza usuli, lekin jadvalda turli qoidalarni aralashtirmang.
- Test nomlari spetsifikatsiya: describe - kontekst, it - shart va kutilgan xatti-harakat, implementatsiya emas.
