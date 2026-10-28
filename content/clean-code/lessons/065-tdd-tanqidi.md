---
n: 65
slug: tdd-tanqidi
title: "TDD tanqidi va muqobillar"
summary: "TDD haqidagi eng batafsil bahslardan biri 2024-2025 yillarda John Ousterhout va Robert Martin o'rtasida bo'lib o'tdi. Bu darsda Ousterhoutning tanqidini, Martinning javoblarini, ular kelishgan nuqtalarni va 'bundling' muqobilini adolatli ko'rib chiqamiz, keyin har birini qachon tanlashni aniqlaymiz."
duration: 40
sources:
  - id: aposd-vs-cc
    note: "Munozaraning TDD bo'limi: Ousterhoutning taktik dasturlash haqidagi tanqidi, Martinning uch qonun va refactor bosqichi haqidagi javoblari, 'bundling' atamasi, kelishuv nuqtalari"
  - id: aposd
    note: "Dasturiy trendlar haqidagi bob: TDD bo'limi (taktik dasturlash xavfi, bug fix uchun testni oldin yozish); strategik va taktik dasturlash haqidagi bob"
  - id: tdd-beck
    note: "Kitob maqsadi va qadam o'lchami haqidagi fikrlar: Fake It, Obvious Implementation, ishonchga qarab qadamni o'zgartirish"
quiz:
  - q: "Ousterhoutning TDD'ga asosiy e'tirozi qaysi?"
    options:
      - "TDD juda ko'p test yozishga majbur qiladi va CI sekinlashadi"
      - "TDD juda kichik rivojlanish birliklarida ishlashga majbur qiladi va dizayn haqida o'ylashni taktik darajaga tushiradi"
      - "TDD faqat Java uchun mos"
      - "Unit testlar umuman keraksiz"
    answer: 1
    explain: "Ousterhout unit testlarni qadrlaydi va fearless refactoring ularning asosiy foydasi ekanida Martin bilan kelishadi. Uning e'tirozi TDD ritmiga qaratilgan: juda kichik qadamlar dizaynni o'ylashni chetga suradi va taktik dasturlashga olib keladi."
  - q: "Martin 'TDD dizaynni to'xtatadi' degan e'tirozga qanday javob beradi?"
    options:
      - "Dizayn keraksiz, testlar uni almashtiradi"
      - "Dizayn faqat arxitektor ishi"
      - "TDD'ning refactor bosqichi va kattaroq sikllari dizaynni o'z ichiga oladi, refaktoringni kechiktirish esa TDD adabiyotida qat'iy qoralanadi"
      - "Ousterhout haq, TDD dizaynni to'xtatadi va bu yaxshi"
    answer: 2
    explain: "Martin TDD'ni bir-birining ichiga joylashgan sikllar deb biladi: refactor bosqichida dizayn tozaligi va mo'ljallangan dizaynga mosligi tekshiriladi. U ikki tomonning kelishmovchiligini 'TDD dizaynni to'xtatadimi' degan savolda deb ochiq aytadi."
  - q: "Munozarada 'bundling' nima?"
    options:
      - "Ousterhoutning muqobili: bir necha o'n yoki yuz qator kod (metod yoki klass) yozib, keyin darhol unit testlar qo'shish. Dizayn birinchi, testlar ortidan"
      - "Testlarni bitta faylga yig'ish"
      - "Kod va testni bitta commit'da yuborish"
      - "Bir nechta mock'ni bitta obyektga birlashtirish"
    answer: 0
    explain: "Atamani Martin taklif qilgan, Ousterhout uni qabul qilgan. Bundling'da test-after yondashuv qisqa oraliqda qo'llanadi: bir dizayn birligi, keyin uning testlari. Martin intizomli dasturchi bu usulda ham samarali ishlashi mumkinligini tan oladi."
  - q: "Ikki muallif qaysi nuqtada kelishadi?"
    options:
      - "TDD har doim qo'llanishi kerak"
      - "Unit testlar dokumentatsiyaning eng yaxshi turi"
      - "Kommentlar keraksiz"
      - "Unit testlarning asosiy foydasi - qo'rqmasdan refaktoring qilish imkoniyati, va dizayn kodlashdan oldin keladi"
    answer: 3
    explain: "Ousterhout bu nuqtada to'liq kelishadi va TDD hamda bundling bu foydani taxminan teng beradi degan xulosaga keladi. Testlar dokumentatsiya sifatida esa ular kelishmagan nuqta: Ousterhout kommentlarni samaraliroq deb biladi."
  - q: "Ousterhout kitobida qaysi holatda testni oldin yozishni maqbul deb biladi?"
    options:
      - "Yangi modul dizayni paytida"
      - "Bug tuzatishda: avval xatoni takrorlaydigan va yiqiladigan test, keyin tuzatish"
      - "Hech qachon"
      - "Faqat UI komponentlar uchun"
    answer: 1
    explain: "Bug uchun yiqiladigan test xatoni tushunganingizni isbotlaydi va tuzatish ishlaganini ko'rsatadi. Bu yerda dizayn savoli yo'q, shuning uchun Ousterhoutning taktik dasturlash haqidagi xavotiri ta'sir qilmaydi."
  - q: "Jamoa yangi to'lov provayderi integratsiyasini qilyapti, API hujjati noaniq va bir nechta muqobil dizayn bor. Qaysi yondashuv eng oqilona?"
    options:
      - "Uch qonun bo'yicha qat'iy TDD, birinchi qatordan"
      - "Testsiz yozib, keyinroq qo'lda tekshirish"
      - "Spike bilan API'ni o'rganish, interfeys dizaynini o'ylash va eskizlash, keyin TDD yoki bundling bilan amalga oshirish"
      - "Faqat e2e testlar yozish"
    answer: 2
    explain: "Ikkala muallif ham dizayn kodlashdan oldin kelishini qabul qiladi. Noma'lumlik yuqori bo'lganda avval o'rganish va dizayn, keyin intizomli test bilan amalga oshirish. Bu bosqichda TDD yoki bundling tanlovi jamoa odatiga bog'liq, testsiz yozish esa refaktoring imkoniyatini yo'qotadi."
task:
  title: "Bitta modulni ikki usulda: TDD va bundling"
  prompt: |
    Transport parki tizimiga "geozona hodisalari" modulini qo'shish kerak: mashina poligon (geozona) ichiga kirganda `enter`, chiqqanda `exit` hodisasi hosil bo'ladi. GPS nuqtalari ketma-ket keladi.

    1. Quyidagi starter'da modulning interfeysi faqat sharh sifatida berilgan. Avval interfeys dizaynini o'ylang (Ousterhout: dizayn birinchi): qanday funksiya, qanday kirish, qanday chiqish, qaysi murakkablik ichkarida yashiriladi.
    2. Modulni bundling usulida yozing: avval to'liq implementatsiya, keyin darhol testlar.
    3. Testlarni yozib bo'lgach, qisqacha tahlil qiling: qaysi xatolarni testlar topdi, qaysi chegaraviy holatlar dizayn paytida ko'rinmagan edi, TDD bilan farqi nima bo'lardi.
    4. Nuqta poligon ichidami degan funksiya (`isInsidePolygon`) tayyor deb hisoblang va uni test double emas, real funksiya sifatida ishlating.
  lang: ts
  starter: |
    // Mavjud yordamchi (tayyor, testlangan):
    export type Point = { lat: number; lng: number };
    export declare function isInsidePolygon(point: Point, polygon: Point[]): boolean;

    // Hozirgi kod: hodisalar controller ichida, holat global Map'da
    const lastInside = new Map<string, boolean>();

    export function onGpsPoint(
      vehicleId: string,
      point: Point,
      zone: Point[],
      emit: (e: string) => void,
    ) {
      const inside = isInsidePolygon(point, zone);
      const before = lastInside.get(vehicleId);
      if (before === undefined) {
        lastInside.set(vehicleId, inside);
        return;
      }
      if (!before && inside) emit(vehicleId + ":enter");
      if (before && !inside) emit(vehicleId + ":exit");
      lastInside.set(vehicleId, inside);
    }

    // Kerakli interfeys (dizayn qiling):
    // detectZoneTransitions(...) => ZoneEvent[]
  solution: |
    // geofence-events.ts
    import { isInsidePolygon, type Point } from "./geometry";

    export type GpsFix = { at: Date; point: Point };
    export type Geofence = { id: string; polygon: Point[] };
    export type ZoneEvent = { type: "enter" | "exit"; zoneId: string; at: Date };

    /**
     * Ketma-ket GPS nuqtalaridan geozonaga kirish/chiqish hodisalarini chiqaradi.
     * `wasInside` - oldingi partiyadan qolgan holat; birinchi nuqta hodisa hosil qilmaydi,
     * agar oldingi holat noma'lum bo'lsa.
     */
    export function detectZoneTransitions(
      fixes: GpsFix[],
      zone: Geofence,
      wasInside?: boolean,
    ): { events: ZoneEvent[]; isInside: boolean | undefined } {
      const ordered = [...fixes].sort((a, b) => a.at.getTime() - b.at.getTime());
      const events: ZoneEvent[] = [];
      let previous = wasInside;

      for (const fix of ordered) {
        const inside = isInsidePolygon(fix.point, zone.polygon);
        if (previous !== undefined && previous !== inside) {
          events.push({ type: inside ? "enter" : "exit", zoneId: zone.id, at: fix.at });
        }
        previous = inside;
      }
      return { events, isInside: previous };
    }

    // geofence-events.spec.ts
    import { describe, expect, it } from "vitest";
    import { detectZoneTransitions, type Geofence, type GpsFix } from "./geofence-events";

    // Kvadrat geozona: Toshkent markazidagi depo (soddalashtirilgan)
    const DEPOT: Geofence = {
      id: "depot-1",
      polygon: [
        { lat: 41.3, lng: 69.2 },
        { lat: 41.3, lng: 69.3 },
        { lat: 41.4, lng: 69.3 },
        { lat: 41.4, lng: 69.2 },
      ],
    };
    const INSIDE = { lat: 41.35, lng: 69.25 };
    const OUTSIDE = { lat: 41.5, lng: 69.25 };
    const at = (minute: number) => new Date(Date.UTC(2026, 9, 20, 8, minute));
    const fix = (minute: number, point: GpsFix["point"]): GpsFix => ({ at: at(minute), point });

    describe("detectZoneTransitions", () => {
      it("tashqaridan ichkariga o'tishda enter hodisasini beradi", () => {
        const { events } = detectZoneTransitions([fix(0, OUTSIDE), fix(1, INSIDE)], DEPOT);
        expect(events).toEqual([{ type: "enter", zoneId: "depot-1", at: at(1) }]);
      });

      it("ichkaridan tashqariga o'tishda exit hodisasini beradi", () => {
        const { events } = detectZoneTransitions([fix(0, INSIDE), fix(1, OUTSIDE)], DEPOT);
        expect(events).toEqual([{ type: "exit", zoneId: "depot-1", at: at(1) }]);
      });

      it("holat o'zgarmasa hodisa bermaydi", () => {
        const { events } = detectZoneTransitions([fix(0, INSIDE), fix(1, INSIDE)], DEPOT);
        expect(events).toEqual([]);
      });

      it("oldingi holat noma'lum bo'lsa birinchi nuqtadan hodisa chiqarmaydi", () => {
        const { events } = detectZoneTransitions([fix(0, INSIDE)], DEPOT);
        expect(events).toEqual([]);
      });

      it("oldingi partiyadagi holatni hisobga oladi", () => {
        const { events } = detectZoneTransitions([fix(5, OUTSIDE)], DEPOT, true);
        expect(events.map((e) => e.type)).toEqual(["exit"]);
      });

      it("tartibsiz kelgan nuqtalarni vaqt bo'yicha saralaydi", () => {
        const { events } = detectZoneTransitions(
          [fix(2, OUTSIDE), fix(0, OUTSIDE), fix(1, INSIDE)],
          DEPOT,
        );
        expect(events.map((e) => e.type)).toEqual(["enter", "exit"]);
      });
    });
  solutionNotes: |
    - Dizayn birinchi: global `Map` va `emit` callback o'rniga sof funksiya. Holat (`wasInside`/`isInside`) chaqiruvchiga qaytariladi, shuning uchun uni Redis yoki DB'da saqlash qaror chaqiruvchida qoladi (67-dars, functional core).
    - Interfeys partiya (batch) qabul qiladi, chunki trekerlar nuqtalarni ko'pincha to'plab yuboradi. Bu dizayn qarori kod yozishdan oldin qilindi va testlar uni tekshiradi.
    - Testlar yozilganda bitta holat dizayn paytida ko'rinmagan edi: nuqtalarning tartibsiz kelishi. Starter ham, birinchi implementatsiya ham buni hisobga olmagan bo'lardi. Bundling'da bu test yozilayotganda topildi, TDD'da esa test ro'yxatini tuzish paytida topilishi mumkin edi.
    - `isInsidePolygon` real funksiya sifatida ishlatildi. Uni mock qilish testni implementatsiyaga bog'lab qo'yardi va geometriya bilan bog'liq xatolarni yashirardi.
    - Bundling sharti: testlar implementatsiyadan keyin darhol, o'sha sessiyada yoziladi. "Keyinroq yozamiz" bundling emas, testsiz kod.
  checklist:
    - "Interfeys kod yozishdan oldin tasvirlangan (kirish, chiqish, yashirilgan murakkablik)"
    - "Global holat yo'q, funksiya sof"
    - "Testlar implementatsiyadan keyin darhol yozilgan va kamida 5 ta xatti-harakatni qamraydi"
    - "Tartibsiz nuqtalar va noma'lum boshlang'ich holat kabi chegaraviy holatlar tekshirilgan"
    - "TDD bilan farq haqida qisqa tahlil yozilgan"
---

## Muammo

TDD atrofidagi bahs ko'pincha ikki qutbda o'tadi. Bir tomonda "TDD qilmasang, professional emassan" degan pozitsiya. Ikkinchi tomonda "TDD - vaqt isrofi, real loyihada hech kim qilmaydi" degan pozitsiya. Ikkalasi ham foydasiz: birinchisi jamoani tushunilmagan ritualga majburlaydi, ikkinchisi esa testlarni umuman e'tiborsiz qoldirishga bahona beradi.

Haqiqiy savol nozikroq: **TDD qaysi narsani yaxshilaydi, qaysi narsani yomonlashtirishi mumkin, va xuddi shu foydani boshqa yo'l bilan olish mumkinmi?** 2024 yil sentyabridan 2025 yil fevraligacha John Ousterhout (*A Philosophy of Software Design* muallifi) va Robert Martin (*Clean Code* muallifi) bu savolni yozma munozarada muhokama qilishdi va uni GitHub'da ochiq e'lon qilishdi. Bu munozara TDD haqidagi eng tafsilotli va eng xolis manbalardan biri, chunki ikkala tomon ham bir-birining argumentlariga to'g'ridan-to'g'ri javob beradi.

64-darsda TDD mexanikasini ko'rdik. Bu darsda uning tanqidini va muqobilini ko'ramiz.

## Asosiy g'oya

### Ousterhoutning tanqidi

Ousterhout kitobida TDD'ni dasturiy trendlar haqidagi bobda tanqid qiladi. Munozarada esa avval bir narsani tan oladi: kitobdagi TDD tavsifi to'liq aniq emas edi va u buni keyingi nashrda tuzatishga va'da beradi. Keyin uning asosiy e'tirozlari shakllanadi:

1. **TDD juda taktik.** Uning fikricha, TDD dasturchilarni juda kichik rivojlanish birliklarida ishlashga majbur qiladi. Ousterhout kitobida strategik va taktik dasturlashni farqlaydi (5-dars): taktik dasturlash hozirgi vazifani tezroq ishlashiga qaratilgan, strategik esa tizimning umumiy dizaynini yaxshilashga. TDD sikli diqqatni "keyingi test o'tsin" degan taktik maqsadga qaratadi.
2. **Dizaynni kod shaklida yozib bo'lmaydi.** Birinchi qonun bo'yicha yiqilgan testsiz production kodi yozish mumkin emas. Ousterhout ta'kidlaydi: dasturchi oldindan o'ylashi mumkin, lekin o'z g'oyalarini kod ko'rinishida yoza olmaydi, chunki har qator test bilan oqlanishi kerak.
3. **Refaktoring bo'yicha yo'riqnoma kam.** Uning fikricha, TDD qachon va qanday refaktoring qilishni deyarli aytmaydi, shuning uchun refaktoring doimiy ravishda kechiktirilishi mumkin.
4. **Yomon kod avval to'planadi.** Ousterhoutning eng keskin da'vosi: TDD dasturchilarning dastlab yomon kod yozishini kafolatlaydi va dizayn faqat yomon kod to'planib bo'lgandan keyin paydo bo'ladi.
5. **Inson tabiati.** Testlar o'tib turgan kodni tashlab yuborish psixologik jihatdan qiyin. Ishlab turgan narsani o'zgartirmaslik tabiiy istak.
6. **Testlar yaxshi hujjat emas.** Ousterhout unit testlarni dokumentatsiya sifatida ko'rishga shubha bilan qaraydi va kommentlarni samaraliroq deb biladi (31-dars).

Ousterhout o'z tajribasi va tanishlarining tajribasiga ham tayanadi: u TDD jamoalaridan chiqqan yomon kod haqida gapirgan tajribali dasturchilarni tilga oladi. Bu - anekdotal dalil, va Martin aynan shu nuqtaga javob beradi.

### Martinning javoblari

Martin har bir e'tirozga javob beradi:

1. **TDD - ichma-ich sikllar.** U uch qonunni soniyalik sikl deb tasvirlaydi va bu sikl daqiqalik red-green-refactor sikli ichida ishlashini ta'kidlaydi. Refactor bosqichida dasturchi to'xtab, dizayn tozami, yaxshi tuzilganmi va mo'ljallangan dizaynga mosmi deb so'raydi.
2. **TDD dizaynni to'xtatmaydi.** Martin kelishmovchilikni ochiq nomlaydi: ular TDD dizaynni to'xtatadimi degan savolda kelishmaydi. U o'zi dizaynni qadrlashini aytadi.
3. **Refaktoringni kechiktirish qoralanadi.** Martin TDD adabiyoti refaktoringni kechiktirishga qat'iy qarshi ekanini ta'kidlaydi.
4. **Dastlabki yomon kod normal.** Martinning fikricha, hamma dastlab yomon kod yozadi, TDD'ning foydasi shundaki, testlar uni xavfsiz tozalash imkonini beradi.
5. **Rejalar spekulyativ.** Martin o'zining Bowling Game misolini keltiradi: oldindan o'ylangan dizayn amalda foydasiz bo'lib chiqqan. U Eyzenxauerning mashhur iborasini eslatadi: rejalar foydasiz, lekin rejalashtirish ajralmas.
6. **Testlanuvchanlik decoupling'ni majbur qiladi.** Test qilinadigan kod yozish modullarni ajratishga undaydi.
7. **Bu intizom masalasi.** Martin TDD'ni kodlash intizomi deb ataydi va yomon natijalar usuldan emas, intizom yetishmasligidan kelib chiqqan bo'lishi mumkinligini aytadi. U o'zi TDD yaxshi ishlagan ko'p holatlarni ko'rganini va tilga olingan muammolarning sababi TDD ekaniga shubha qilishini bildiradi.

### Kelishuv nuqtalari

Munozaraning eng qimmatli qismi - kelishuvlar:

- **Unit testlarning asosiy foydasi - qo'rqmasdan refaktoring qilish.** Bu nuqtada Ousterhout to'liq rozi va TDD hamda bundling bu foydani taxminan teng darajada beradi degan xulosaga keladi.
- **Dizayn kodlashdan oldin keladi.** Martin buning aksini o'ylaydigan hech kimni bilmasligini aytadi.
- **Refaktoring zarur**, chunki dastlabki dizayn kamdan-kam hollarda to'g'ri chiqadi.
- **Kirish materiallari intizomning to'liq chuqurligini ko'rsatmasligi mumkin.** Ya'ni TDD'ni faqat qisqa video yoki maqoladan bilish uning to'liq tasvirini bermaydi.

## Chuqurroq: bundling va xavf-foyda nisbati

### Bundling nima

Munozarada Ousterhoutning muqobil yondashuviga nom kerak bo'ldi va Martin uni "bundling" deb atashni taklif qildi. Ousterhout buni qabul qildi. Bundling shunday ishlaydi: dasturchi bir necha o'ndan bir necha yuzgacha qator kod yozadi (bitta metod yoki klass, ya'ni dizayn birligi), keyin darhol unga unit testlar qo'shadi. Dizayn birinchi, testlar qisqa vaqtdan keyin.

Bu "testlarni keyinroq yozamiz" degan narsa emas. Muhim farq - oraliq qisqa: testlar o'sha sessiyada, o'sha dizayn birligi tugashi bilan yoziladi. Martin intizomli dasturchi shu usulda samarali ishlashi mumkinligini tan oladi va bunday kodni TDD kodidan farqlab bo'lmasligi mumkinligini aytadi.

### Ousterhoutning xulosasi: xavf-foyda

Ousterhout yakunida TDD'ni xavf-foyda spektrida yomon joyda deb baholaydi. Uning mantig'i: agar ikkala usul ham refaktoring xavfsizligini teng bersa, unda farq xavflarda. TDD'da yomon kod sifati xavfi, uning fikricha, bundling'dagidan yuqori, chunki TDD ritmi dizaynni kechiktirishga undaydi. Bu - uning baholashi, Martin unga qo'shilmaydi.

### Bahsni qanday o'qish kerak

Ikkala tomonning dalillari asosan tajribaviy, nazorat qilingan tadqiqot emas. Shuning uchun xulosani "kim haq" deb emas, "qaysi sharoitda qaysi xavf katta" deb chiqarish to'g'riroq:

- **TDD'ning kuchli tomoni** - intizom. Test hech qachon "keyinga" qolmaydi, har qator testlangan, testlanuvchanlik birinchi kundan dizaynga ta'sir qiladi.
- **TDD'ning xavfi** - mitti qadamlarda adashib, umumiy dizayn haqida o'ylamaslik. Martin bunga "refactor va soatlik chegaralar sikli" deb javob beradi, lekin amalda bu sikllar ko'pincha tashlab ketiladi.
- **Bundling'ning kuchli tomoni** - dizayn erkinligi. Dasturchi g'oyani butunligicha kodda ifodalaydi va keyin uni testlar bilan tekshiradi.
- **Bundling'ning xavfi** - intizomning yo'qolishi. "Darhol test" osongina "ertaga test"ga, keyin "hech qachon"ga aylanadi. Test kodni emas, talabni tekshirishi uchun ham ongli harakat kerak.

Kent Beck kitobida ham bu bahsga yaqin narsa bor: u qadam o'lchamini ishonchga qarab o'zgartirishni tavsiya qiladi. Ishonch yuqori bo'lsa, Obvious Implementation bilan katta qadam. Bu Ousterhoutning bundling'iga TDD ichidagi yaqinlashuv deb qarash mumkin, garchi test hali ham birinchi yozilsa.

### Ousterhout testni qachon oldin yozadi

Ousterhout kitobida bitta holatni alohida ko'rsatadi: bug tuzatish. Avval xato tufayli yiqiladigan unit test yoziladi, keyin xato tuzatiladi va test o'tadi. Bu xatoni haqiqatan tushunganingizni va tuzatish ishlaganini isbotlaydi. Bu yerda dizayn savoli yo'q, shuning uchun uning taktik dasturlash haqidagi xavotiri ta'sir qilmaydi. Bu amaliyot TDD tarafdorlari va tanqidchilari o'rtasida deyarli umumiy.

## Misol: bitta talab, ikki usul

Talab: yoqilg'i tranzaksiyalaridan oylik hisobot - har bir mashina uchun jami litr va summa, shubhali tranzaksiyalar (bak hajmidan katta quyish) alohida.

**TDD usuli.** Test ro'yxati: bitta tranzaksiya, ikki mashina, bir mashinada ikki tranzaksiya, bak hajmidan katta quyish, bo'sh ro'yxat. Birinchi test bitta tranzaksiya uchun natijani kutadi, Fake It bilan yashil, keyin Triangulate. Har qadamda dizayn testlar orqali "o'sadi". Xavf: beshinchi testga kelib siz natija shaklini (`Map`mi, massivmi, shubhalilar alohidami) bir necha marta o'zgartirgan bo'lishingiz mumkin, chunki ular boshida o'ylanmagan.

**Bundling usuli.** Avval interfeys o'ylanadi:

```ts
export type FuelTransaction = {
  vehicleId: string;
  liters: number;
  amountUzs: number;
  at: Date;
};

export type VehicleFuelSummary = {
  vehicleId: string;
  totalLiters: number;
  totalAmountUzs: number;
};

export type MonthlyFuelReport = {
  vehicles: VehicleFuelSummary[];
  suspicious: FuelTransaction[];
};

export function buildMonthlyFuelReport(
  transactions: FuelTransaction[],
  tankCapacityLiters: (vehicleId: string) => number,
): MonthlyFuelReport {
  const totals = new Map<string, VehicleFuelSummary>();
  const suspicious: FuelTransaction[] = [];

  for (const tx of transactions) {
    if (tx.liters > tankCapacityLiters(tx.vehicleId)) {
      suspicious.push(tx);
      continue;
    }
    const current = totals.get(tx.vehicleId) ?? {
      vehicleId: tx.vehicleId,
      totalLiters: 0,
      totalAmountUzs: 0,
    };
    current.totalLiters += tx.liters;
    current.totalAmountUzs += tx.amountUzs;
    totals.set(tx.vehicleId, current);
  }

  return {
    vehicles: [...totals.values()].sort((a, b) => a.vehicleId.localeCompare(b.vehicleId)),
    suspicious,
  };
}
```

Keyin o'sha sessiyada testlar:

```ts
import { describe, expect, it } from "vitest";
import { buildMonthlyFuelReport, type FuelTransaction } from "./monthly-fuel-report";

const tx = (vehicleId: string, liters: number, amountUzs = liters * 12_000): FuelTransaction => ({
  vehicleId,
  liters,
  amountUzs,
  at: new Date("2026-10-05T10:00:00Z"),
});
const tank60 = () => 60;

describe("buildMonthlyFuelReport", () => {
  it("mashinalar bo'yicha litr va summani jamlaydi", () => {
    const report = buildMonthlyFuelReport([tx("01A", 40), tx("01A", 20), tx("10B", 30)], tank60);

    expect(report.vehicles).toEqual([
      { vehicleId: "01A", totalLiters: 60, totalAmountUzs: 720_000 },
      { vehicleId: "10B", totalLiters: 30, totalAmountUzs: 360_000 },
    ]);
  });

  it("bak hajmidan katta quyishni jamiga qo'shmasdan shubhalilarga ajratadi", () => {
    const report = buildMonthlyFuelReport([tx("01A", 40), tx("01A", 75)], tank60);

    expect(report.vehicles).toEqual([
      { vehicleId: "01A", totalLiters: 40, totalAmountUzs: 480_000 },
    ]);
    expect(report.suspicious.map((t) => t.liters)).toEqual([75]);
  });

  it("bo'sh ro'yxat uchun bo'sh hisobot qaytaradi", () => {
    expect(buildMonthlyFuelReport([], tank60)).toEqual({ vehicles: [], suspicious: [] });
  });
});
```

Ikkinchi test yozilayotganda savol tug'ildi: shubhali tranzaksiya jamiga kirmasligi kerakmi? Bu biznes qarori va u test yozish paytida ochildi. TDD'da u test ro'yxati paytida ochilardi. Ikkala usulda ham natija bir xil: test talabni aniqlashtirdi. Farq - dizayn qachon qilingani: bundling'da interfeys boshida butunligicha o'ylangan, TDD'da esa testlar orqali bosqichma-bosqich shakllanardi.

## Qachon qo'llamaslik kerak

Bu darsning o'zi tanlov haqida, shuning uchun har bir usul uchun chegaralarni aytamiz:

- **Qat'iy TDD'ni qo'llamang**, agar domen yoki API umuman noma'lum bo'lsa (avval spike), agar ish asosan dizayn izlanishi bo'lsa va jamoa interfeysni hali tasavvur qilmasa, yoki agar jamoa TDD'ni faqat ritual sifatida bajarsa va refactor bosqichini tashlab ketsa. Oxirgi holatda Ousterhout ta'riflagan muammo real bo'ladi.
- **Bundling'ni qo'llamang**, agar jamoada "keyin test yozamiz" odati allaqachon testsiz kodga olib kelgan bo'lsa. Bunday jamoada TDD tashqi intizom sifatida foydaliroq bo'lishi mumkin.
- **Ikkalasidan ham qochish kerak bo'lgan holat** - testlar umuman yo'q yoki ular faqat coverage uchun yozilgan. Munozaradagi har ikki muallif ham bunga qarshi.
- **Bahsni dogmaga aylantirmang.** "Ousterhout TDD'ni tanqid qilgan, demak TDD yomon" ham, "Martin TDD'ni himoya qilgan, demak har doim TDD" ham noto'g'ri o'qish. Ikkalasi ham dizayn birinchi kelishi va testlar refaktoring uchun zarurligida kelishadi.

## Stack'da: amaliy tanlov

- **Domen logikasi (narx, chegirma, norma, holat mashinasi).** TDD juda yaxshi ishlaydi: kirish va chiqish aniq, misollar biznesdan keladi. Bundling ham ishlaydi.
- **NestJS modul dizayni, yangi API.** Avval interfeys va DTO'larni eskizlang (Ousterhout ham, Martinning soatlik sikli ham shuni aytadi), keyin TDD yoki bundling.
- **Bug fix.** Har doim avval yiqiladigan test. Bu yerda ikki maktab kelishadi.
- **React UI.** Xatti-harakat uchun test-first yoki darhol keyin (69-dars), vizual qism uchun esa ko'z bilan tekshirish va kerak bo'lsa vizual regressiya vositalari.
- **Kod review'da.** "TDD bilan yozdingmi" emas, "testlar xatti-harakatni tekshiradimi va refaktoringga ruxsat beradimi" deb so'rang.

## Xulosa

- Ousterhout TDD'ni juda taktik deb tanqid qiladi: kichik qadamlar dizaynni kechiktiradi va yomon kod to'planishiga olib kelishi mumkin.
- Martin javob beradi: TDD ichma-ich sikllar, refactor bosqichi dizaynni o'z ichiga oladi va muammolar usuldan emas, intizom yetishmasligidan.
- Ikkalasi kelishadi: unit testlarning asosiy foydasi qo'rqmasdan refaktoring, dizayn kodlashdan oldin keladi, refaktoring zarur.
- Bundling - dizayn birligini yozib, darhol testlash. Martin intizomli dasturchi uchun buni samarali deb tan oladi.
- Bug tuzatishda testni oldin yozish ikki maktab uchun ham umumiy amaliyot.
- Tanlov sharoitga bog'liq: noma'lumlik darajasi, jamoa intizomi va kodning turi.
