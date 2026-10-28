---
n: 78
slug: tidy-first
title: "Tidy First: struktura va xatti-harakatni ajratish"
summary: "Kent Beckning \"Tidy First?\" kitobi: 15 ta mayda tidying, struktura va xatti-harakat o'zgarishini alohida PR'larda saqlash, \"avval, keyin, keyinroq yoki hech qachon\" qarori va uning iqtisodiy asosi - pulning vaqt qiymati, opsionlar va coupling."
duration: 40
sources:
  - id: tidy-first
    note: "I qism \"Tidyings\" (15 ta tidying), II qism \"Managing\" (Separate Tidying, Chaining, Batch Sizes, Rhythm, Getting Untangled, First After Later Never), III qism \"Theory\" (Structure and Behavior, opsionlar, Reversible Structure Changes, Coupling, Constantine's Equivalence, Cohesion)"
quiz:
  - q: "Beck bo'yicha tidying va Fowler refaktoringi o'rtasidagi munosabat qanday?"
    options:
      - "Tidying refaktoringga qarama-qarshi"
      - "Tidying - xatti-harakatni o'zgartiradigan kichik o'zgarish"
      - "Tidying faqat formatlash (bo'sh joy, qator uzunligi)"
      - "Tidying - refaktoringning eng mayda, bir necha daqiqalik ko'rinishi: struktura o'zgaradi, xatti-harakat emas"
    answer: 3
    explain: "Beck tidying'ni refaktoringning \"kichkina, yoqimli\" bo'laklari sifatida tasvirlaydi: guard clause, dead code o'chirish, explaining variable. Ular xatti-harakatni o'zgartirmaydi va odatda daqiqalar oladi."
  - q: "Beck nega struktura va xatti-harakat o'zgarishlarini alohida PR'larda saqlashni tavsiya qiladi?"
    options:
      - "Chunki ular turli xavf va turli review turini talab qiladi: struktura o'zgarishlari odatda qaytariladigan, xatti-harakat o'zgarishlari esa ko'pincha emas"
      - "Chunki git aralash commit'larni qabul qilmaydi"
      - "Chunki CI tezroq ishlaydi"
      - "Chunki struktura o'zgarishlari hech qachon review qilinmaydi"
    answer: 0
    explain: "Beck nazariyasida asosiy farq qaytariluvchanlik: noto'g'ri tidying'ni qaytarish arzon, noto'g'ri xatti-harakat (masalan, noto'g'ri hisoblangan to'lov) esa oqibat qoldiradi. Aralash PR'da reviewer ikkalasini ajrata olmaydi."
  - q: "Qaysi holatda Beck mantiqi bo'yicha tidying'ni \"never\" (hech qachon) deb qoldirish eng asosli?"
    options:
      - "Kod juda xunuk bo'lsa"
      - "Kod hech qachon o'zgarmasa: uning xatti-harakatini o'zgartirish kerak bo'lmaydi"
      - "Jamoada vaqt yo'q bo'lsa"
      - "Testlar yo'q bo'lsa"
    answer: 1
    explain: "Tidying'ning qiymati keyingi o'zgarishni arzonlashtirishda. Agar kod o'zgarmasa, bu qiymat nolga teng. Vaqt yetishmasligi \"later\" uchun sabab bo'lishi mumkin, \"never\" uchun emas."
  - q: "Beck Constantine's Equivalence orqali nimani aytadi?"
    options:
      - "Dasturiy ta'minot narxi qatorlar soniga teng"
      - "Testlar soni sifatni belgilaydi"
      - "Dasturiy ta'minot narxi asosan o'zgartirish narxi, u esa katta, kaskadli o'zgarishlar narxi bilan, ular esa coupling bilan belgilanadi"
      - "Har bir modul bitta ishni qilishi kerak"
    answer: 2
    explain: "Beck Larry Constantine'ga tayanib zanjirni quradi: dastur narxi ~ o'zgartirish narxi ~ katta o'zgarishlar narxi ~ coupling. Shuning uchun coupling'ni kamaytirish asosiy iqtisodiy dastak."
  - q: "Siz feature ustida ishlayotib, yo'l-yo'lakay 6 ta tidying qildingiz va ular xatti-harakat o'zgarishi bilan bitta diff'da aralashib ketdi. Beck \"Getting Untangled\" bobida qanday variantlarni ko'radi?"
    options:
      - "Faqat bitta: hammasini bitta PR qilib yuborish"
      - "Aralash holda yuborish, ularni alohida PR'larga ajratish yoki ishni tashlab, avval tidying, keyin feature tartibida qayta qilish"
      - "Tidying'larni o'chirib yuborish va hech qachon qilmaslik"
      - "PR'ni review'siz merge qilish"
    answer: 1
    explain: "Beck uchta yo'lni ko'rib chiqadi va ularning har birining narxini muhokama qiladi. Uchinchisi (qayta qilish) ko'pincha kutilganidan arzon, chunki ikkinchi marta qilganda nima qilish kerakligini allaqachon bilasiz."
  - q: "Beck coupling'ni qanday ta'riflaydi?"
    options:
      - "Ikki element ma'lum bir o'zgarishga nisbatan coupled, agar ulardan birini o'zgartirish ikkinchisini ham o'zgartirishni talab qilsa"
      - "Bir modul boshqasini import qilsa, ular coupled"
      - "Ikki klass bir xil faylda bo'lsa"
      - "Ikki funksiya bir xil parametr olsa"
    answer: 0
    explain: "Beck coupling'ni o'zgarishga nisbatan ta'riflaydi: import statik belgi, lekin asosiy savol \"bu o'zgarish qaysi elementlarga tarqaladi\". Bir-birini import qilmaydigan, lekin bir xil format kelishuviga tayanadigan ikki servis ham coupled."
task:
  title: "Aralash diff'ni tidying va feature'ga ajratish"
  prompt: |
    Quyidagi NestJS servis metodiga talab keldi: **buyurtmani bekor qilishda, agar to'lov allaqachon o'tgan bo'lsa, qaytarish (refund) so'rovini yaratish kerak**.

    1. Feature'ni qo'shishdan oldin kamida 4 ta tidying'ni Beck nomlari bilan qo'llang (Guard Clauses, Dead Code, Explaining Variables, Explaining Constants, Reading Order, Extract Helper va h.k.). Har birini alohida commit deb hisoblang va commit xabarini yozing.
    2. Keyin feature'ni alohida commit sifatida qo'shing.
    3. Har bir tidying uchun nega u feature'ni osonlashtirganini bir jumla bilan yozing. Feature'ga yordam bermaydigan tidying'ni qilmang.
  lang: ts
  starter: |
    type Order = { id: string; status: string; paidAt: Date | null; createdAt: Date; totalTiyin: number };

    interface OrderRepo {
      find(id: string): Promise<Order | null>;
      save(order: Order): Promise<void>;
    }

    export class OrderService {
      constructor(private readonly repo: OrderRepo) {}

      async cancel(id: string, now: Date): Promise<string> {
        const o = await this.repo.find(id);
        if (o) {
          if (o.status !== "shipped" && o.status !== "delivered") {
            if (now.getTime() - o.createdAt.getTime() < 86400000) {
              o.status = "cancelled";
              await this.repo.save(o);
              // const oldLogic = o.totalTiyin * 0.9;
              return "ok";
            } else {
              return "too_late";
            }
          } else {
            return "already_shipped";
          }
        } else {
          return "not_found";
        }
      }
    }
  solution: |
    type OrderStatus = "new" | "paid" | "shipped" | "delivered" | "cancelled";
    type Order = { id: string; status: OrderStatus; paidAt: Date | null; createdAt: Date; totalTiyin: number };
    type CancelResult = "ok" | "not_found" | "already_shipped" | "too_late";

    interface OrderRepo {
      find(id: string): Promise<Order | null>;
      save(order: Order): Promise<void>;
    }

    interface RefundRequests {
      create(orderId: string, amountTiyin: number): Promise<void>;
    }

    // tidy: explaining constants
    const CANCELLATION_WINDOW_MS = 24 * 60 * 60 * 1000;

    // tidy: extract helper
    function hasLeftWarehouse(order: Order): boolean {
      return order.status === "shipped" || order.status === "delivered";
    }

    export class OrderService {
      constructor(
        private readonly repo: OrderRepo,
        private readonly refunds: RefundRequests,
      ) {}

      async cancel(orderId: string, now: Date): Promise<CancelResult> {
        // tidy: guard clauses
        const order = await this.repo.find(orderId);
        if (!order) return "not_found";
        if (hasLeftWarehouse(order)) return "already_shipped";

        // tidy: explaining variables
        const orderAgeMs = now.getTime() - order.createdAt.getTime();
        if (orderAgeMs >= CANCELLATION_WINDOW_MS) return "too_late";

        order.status = "cancelled";
        await this.repo.save(order);

        // feature (alohida commit)
        if (order.paidAt !== null) {
          await this.refunds.create(order.id, order.totalTiyin);
        }
        return "ok";
      }
    }
  solutionNotes: |
    Commit ketma-ketligi:

    1. `tidy: delete dead code in OrderService.cancel` - kommentdagi `oldLogic` o'chirildi. Feature uchun: pul bilan bog'liq eski formula o'quvchini chalg'itardi, refund summasi qaysi ekanini noaniq qilardi.
    2. `tidy: guard clauses in OrderService.cancel` - uch darajali ichma-ichlik erta qaytishlarga aylandi. Feature uchun: refund mantiqi qayerga qo'shilishi endi aniq, muvaffaqiyatli yo'l chap chetda.
    3. `tidy: explaining constant and variable for cancellation window` - `86400000` va vaqt farqi nomlandi. Feature uchun bevosita kerak emas, lekin guard clause bilan birga o'qishni osonlashtiradi va bir daqiqa oladi. Beck ogohlantirishini eslang: tidying'lar "chips" kabi, to'xtashni bilish kerak.
    4. `tidy: extract hasLeftWarehouse helper` - status tekshiruvi nomlandi.
    5. `feat: create refund request when cancelling a paid order` - faqat bu commit xatti-harakatni o'zgartiradi: yangi dependency va bitta shart.

    - `id` -> `orderId`, `o` -> `order` - bu ham tidying (explaining variables), uni 2-commit bilan birga qilish mumkin, chunki ular bir joyga tegadi.
    - `status: string` -> `OrderStatus` va qaytarish tipi `CancelResult` - tip o'zgarishi. Agar chaqiruvchilar boshqa string'larni kutsa, bu kompilyatsiyada ko'rinadi. Buni alohida tidying commit sifatida qilish mumkin.
    - Tidying commit'lari hech qaysi testni o'zgartirmaydi. Feature commit'i yangi test qo'shadi: to'langan buyurtma bekor qilinganda refund yaratiladi, to'lanmaganda yaratilmaydi.
    - Diqqat: `<` dan `>=` ga o'tganda chegaraviy holat (aniq 24 soat) bir xil qolganini tekshiring.
  checklist:
    - "Kamida 4 ta tidying Beck nomlari bilan alohida commit'larda"
    - "Har bir tidying feature'ni qanday osonlashtirgani yozildi"
    - "Tidying commit'larida testlar o'zgarmadi"
    - "Feature alohida commit'da va o'z testiga ega"
    - "24 soatlik chegara holati eski va yangi kodda bir xil"
---

## Muammo

Fowlerning refaktoringi (71-dars) aniq ta'rif va katalogga ega, lekin u bitta savolga to'liq javob bermaydi: **hozir, aynan shu vazifada, qancha tozalash kerak?** Amalda bu savol har kuni beriladi. Feature'ni ikki soatda qo'shish mumkin. Kodni avval tozalab, keyin qo'shish uch soat oladi. Tozalamasdan qo'shsangiz, keyingi o'zgarish yanada qimmatga tushadi. Qaysi biri to'g'ri?

Jamoalar bu savolga odatda ikki ekstremal javobdan birini beradi. Birinchisi: "hech qachon, biznes kutib turibdi". Ikkinchisi: "har doim, toza kod muhim". Birinchisi kod bazasini sekin-asta o'zgartirib bo'lmaydigan holatga keltiradi, ikkinchisi esa dasturchilarni cheksiz tozalashga va feature'larni kechiktirishga olib keladi.

Kent Beck 2023 yilda chiqqan *Tidy First?* kitobida bu savolni markazga qo'yadi. Kitob nomidagi so'roq belgisi tasodif emas: Beckning javobi "har doim" emas, "bu bog'liq", va kitob nimaga bog'liqligini aniq tushuntiradi.

## Asosiy g'oya

Kitob uch qismdan iborat va har biri bitta savolga javob beradi.

**I qism - Tidyings (nima).** 15 ta qisqa bob, har biri bitta mayda strukturaviy o'zgarish. Beck tidying'ni refaktoringning kichik, yoqimli bo'lagi deb tasvirlaydi: xatti-harakat o'zgarmaydi, odatda daqiqalar yoki bir soat oladi.

**II qism - Managing (qachon va qanday).** Tidying'ni ish oqimiga qanday qo'shish: alohida PR'lar, partiya o'lchami, ritm, aralashib ketgan o'zgarishlarni ajratish va "avval, keyin, keyinroq, hech qachon" qarori.

**III qism - Theory (nega).** Dasturiy dizaynning iqtisodiy asosi: struktura va xatti-harakat farqi, pulning vaqt qiymati va opsionlar, qaytariladigan o'zgarishlar, coupling va cohesion.

Kitobning markaziy g'oyasi: dasturdagi har bir o'zgarish yo **struktura** o'zgarishi (elementlar qanday tashkil qilingan), yo **xatti-harakat** o'zgarishi (dastur nima qiladi). Ular turli xususiyatlarga ega, shuning uchun ularni turlicha boshqarish va aralashtirmaslik kerak. Bu Fowlerning "ikki shlyapa" g'oyasining (71-dars) davomi, lekin Beck uni iqtisodiy nazariya bilan asoslaydi va PR darajasidagi amaliyotga aylantiradi.

## Chuqurroq: uch qism

### 15 ta tidying

Kitobning birinchi qismidagi tidying'lar (bob nomlari bo'yicha):

1. **Guard Clauses** - ichma-ich shartlarni erta qaytishlarga aylantirish: funksiya boshida "bu holatlarda ish yo'q" deb aytiladi, keyin asosiy ish keladi (26-dars).
2. **Dead Code** - ishlatilmaydigan kodni o'chirish. Agar keyin kerak bo'lsa, version control'da bor.
3. **Normalize Symmetries** - bir xil ish turli joylarda turlicha yozilgan bo'lsa, bitta usulni tanlab, hamma joyda shunday yozish. O'quvchi farqni ko'rganda, u haqiqiy farq deb o'ylaydi.
4. **New Interface, Old Implementation** - chaqirish noqulay bo'lsa, siz xohlagan interfeysni yaratib, uni eski implementatsiya orqali ishlatish. Keyin chaqiruvchilarni birma-bir o'tkazish.
5. **Reading Order** - fayl ichidagi elementlarni o'quvchi ularni tushunadigan tartibda qayta joylashtirish.
6. **Cohesion Order** - birga o'zgaradigan elementlarni yonma-yon qo'yish.
7. **Move Declaration and Initialization Together** - o'zgaruvchi e'loni va unga qiymat berishni bir joyga keltirish.
8. **Explaining Variables** - murakkab ifoda qismlariga nom berish (Fowlerning Extract Variable).
9. **Explaining Constants** - magic number va satrlarni nomlangan konstantaga aylantirish.
10. **Explicit Parameters** - funksiya ichida yashirin olinadigan qiymatlarni (masalan, umumiy map yoki muhit o'zgaruvchisidan) aniq parametrga aylantirish.
11. **Chunk Statements** - mantiqiy bloklar orasiga bo'sh qator qo'yish. Eng arzon tidying va ko'pincha keyingi qadamlarga (Extract Helper) yo'l ochadi.
12. **Extract Helper** - maqsadi aniq bo'lgan kod blokini funksiyaga chiqarish (Fowlerning Extract Function).
13. **One Pile** - kod juda ko'p mayda bo'laklarga bo'lingan va tushunish qiyin bo'lsa, avval hammasini bitta joyga yig'ish, keyin to'g'ri chegaralar bo'yicha qayta bo'lish. Bu Fowlerning Inline Function maslahatiga (73-dars, Shotgun Surgery) mos keladi.
14. **Explaining Comments** - kodni o'qiganda tushunishingiz qiyin bo'lgan narsani, tushunganingizdan keyin komment sifatida qoldirish.
15. **Delete Redundant Comments** - kodni so'zma-so'z takrorlaydigan kommentlarni o'chirish.

Ko'pchiligi Fowler katalogidan yoki 1-5-modullardagi qoidalardan tanish. Beckning hissasi yangi texnikalar emas, ularning **o'lchami va o'rni**: har bir tidying shunchalik kichikki, uni qilish uchun ruxsat yoki rejalashtirish kerak emas.

### Managing: tidying'ni boshqarish

**Separate Tidying.** Tidying'lar xatti-harakat o'zgarishlaridan alohida PR'larda bo'lishi kerak. Beck yana bir provokatsion fikrni aytadi: yuqori ishonchli jamoada tidying PR'lari uchun review talab qilmaslikni o'ylab ko'rish mumkin, chunki ular qaytariladigan va xavfi past. Bu munozarali tavsiya va ko'p jamoalar uchun mos emas (Qachon qo'llamaslik bo'limiga qarang), lekin u asosiy g'oyani yaxshi ko'rsatadi: struktura va xatti-harakat turli darajadagi nazoratni talab qiladi.

**Chaining.** Tidying'lar zanjir hosil qiladi: guard clause'dan keyin explaining helper, dead code o'chirilgandan keyin reading order. Beck ularni chips bilan solishtiradi: bittasini yeganingizdan keyin yana bittasini xohlaysiz. Asosiy ko'nikma - to'xtashni bilish.

**Batch Sizes.** Tidying'lar partiyasi qancha katta bo'lishi kerak? Beck kichik partiyalar tarafdori. Partiya kattalashgani sari boshqa o'zgarishlar bilan to'qnashuv ehtimoli, tidying'ning xatti-harakatni tasodifan o'zgartirish ehtimoli va "kerak bo'lmagan" tidying ehtimoli oshadi. Review narxi esa partiyani kattalashtirishga undaydi. Shuning uchun review narxini pasaytirish kichik partiyalarni mumkin qiladi.

**Rhythm.** Tidying daqiqalar va bir soat atrofida o'lchanadi. Agar "tidying" bir haftalik vazifa bo'lsa, ehtimol bu endi tidying emas, katta refaktoring (80-dars).

**Getting Untangled.** Amalda tidying va feature ko'pincha aralashib ketadi. Beck uch variantni ko'radi: aralash holda yuborish (eng tez, lekin review va qaytarish qiyin), ularni alohida PR'larga ajratish (ko'proq ish) yoki o'zgarishlarni tashlab, avval tidying, keyin feature tartibida qayta qilish. Uchinchisi ko'pincha kutilganidan arzon: ikkinchi marta qilganda nima qilish kerakligini allaqachon bilasiz.

**First, After, Later, Never.** Kitobning asosiy savoli. Beck mezonlarining mazmuni:

- **Never** - kod hech qachon o'zgarmasa. Tidying qiymati keyingi o'zgarishni arzonlashtirishda, o'zgarish bo'lmasa, qiymat yo'q.
- **Later** - tidying katta partiya bo'lsa va darhol foyda bermasa. Eslatma qilib, keyinroq (masalan, feature tugagandan keyin bo'sh vaqtda) qilish.
- **After** - xuddi shu joyni yaqinda yana o'zgartirish kutilsa va hozir tidying qilish keyinroqqa qaraganda arzon bo'lsa (kontekst xotirada).
- **First** - tidying darhol foyda bersa: kodni tushunishni yoki xatti-harakat o'zgarishini osonlashtirsa, va u kichik bo'lsa.

Bu mezonlar Fowlerning preparatory refactoring (avval) va litter-pickup (keyin yoki keyinroq) g'oyalariga mos keladi, lekin "never" ni ochiq va qonuniy variant sifatida qo'yadi.

### Theory: nega bu ishlaydi

**Beneficially Relating Elements.** Beck dasturiy dizaynni elementlar, ular orasidagi munosabatlar va bu munosabatlardan keladigan foyda sifatida ta'riflaydi. Dizayn - elementlarni foydali tarzda bog'lash.

**Structure and Behavior.** Dastur ikki yo'l bilan qiymat yaratadi: bugungi xatti-harakat va kelajakda yangi xatti-harakat qo'shish imkoniyati. Struktura o'zgarishi bevosita xatti-harakatni o'zgartirmaydi, lekin ikkinchi qiymatga ta'sir qiladi.

**Pulning vaqt qiymati va opsionlar.** Kitobning eng o'ziga xos qismi. Ikki moliyaviy g'oya bir-biriga qarshi turadi:

- Bugungi pul ertangidan qimmat. Bu feature'ni hozir yetkazishni va tidying'ni kechiktirishni qo'llab-quvvatlaydi.
- Noaniqlik sharoitida opsionlar narsalardan qimmatroq. Yaxshi struktura kelajakdagi o'zgarishlar uchun opsion yaratadi va bu tidying'ni hozir qilishni qo'llab-quvvatlaydi.

Beck bu ziddiyatni formulaga aylantirmaydi. U ikkala kuchni ko'rish va har bir holatda ularni tortishni o'rgatadi.

**Reversible Structure Changes.** Struktura o'zgarishlari odatda qaytariladigan: noto'g'ri Extract Helper'ni Inline qilish oson. Xatti-harakat o'zgarishlari esa ko'pincha qaytarib bo'lmaydigan oqibatga ega: noto'g'ri hisoblangan va yuborilgan invoice, yo'qolgan ma'lumot, mijoz ishonchi. Shuning uchun ularni bir xil darajadagi ehtiyotkorlik bilan boshqarish isrof: qaytariladigan narsaga kamroq, qaytarib bo'lmaydiganga ko'proq nazorat.

**Coupling va Constantine's Equivalence.** Beck coupling'ni o'zgarishga nisbatan ta'riflaydi: ikki element ma'lum bir o'zgarishga nisbatan coupled, agar ulardan birini o'zgartirish ikkinchisini ham o'zgartirishni talab qilsa. Larry Constantine'ning (Ed Yourdon bilan birga yozgan *Structured Design* kitobi muallifi) g'oyasiga tayanib, Beck zanjirni quradi: dasturiy ta'minot narxi taxminan uni o'zgartirish narxiga teng, o'zgartirish narxi asosan bir nechta katta, kaskadli o'zgarishlar bilan belgilanadi, va ular coupling'dan kelib chiqadi. Demak coupling - asosiy iqtisodiy dastak.

**Coupling Versus Decoupling.** Decoupling ham bepul emas: u vaqt oladi va ba'zan coupling'ni bir joydan boshqasiga ko'chiradi. Shuning uchun maqsad nol coupling emas, o'zgarish narxining minimumi.

**Cohesion.** Coupled elementlar bir xil qobiq (modul, fayl, klass) ichida bo'lishi kerak. Bu Cohesion Order tidying'ining nazariy asosi va Fowlerning "birga o'zgaradigan narsalarni birga saqlang" evristikasi (74-dars) bilan bir xil.

## Misol: tidying zanjiri va to'xtash nuqtasi

Talab: haydovchi reytingi hisobotiga "tungi qatnovlar soni" ustunini qo'shish. Hozirgi kod:

```ts
type Trip = { driverId: string; startedAt: Date; distanceKm: number; harshEvents: number };

export function driverRows(trips: Trip[], drivers: Map<string, string>): string[][] {
  const out: string[][] = [];
  const g = new Map<string, Trip[]>();
  for (const t of trips) {
    const arr = g.get(t.driverId) ?? [];
    arr.push(t);
    g.set(t.driverId, arr);
  }
  for (const [id, list] of g) {
    let km = 0;
    let ev = 0;
    for (const t of list) { km += t.distanceKm; ev += t.harshEvents; }
    const score = km === 0 ? 0 : Math.max(0, 100 - (ev / km) * 1000);
    out.push([drivers.get(id) ?? id, km.toFixed(0), score.toFixed(1)]);
  }
  return out;
}
```

Beck savoli: qaysi tidying keyingi xatti-harakat o'zgarishini osonlashtiradi?

**Tidying 1, Chunk Statements va Extract Helper:** guruhlash siklini nomlangan funksiyaga chiqaramiz. Bu feature'ga to'g'ridan-to'g'ri yordam beradi: yangi ustun haydovchi bo'yicha guruhlangan ro'yxatdan hisoblanadi.

**Tidying 2, Explaining Variables va Explaining Constants:** `ev`, `km`, `1000` ga nom beramiz, shunda yangi hisob qayerga qo'shilishi aniq bo'ladi.

```ts
const HARSH_EVENTS_PER_KM_WEIGHT = 1000;
const MAX_SCORE = 100;

function groupByDriver(trips: Trip[]): Map<string, Trip[]> {
  const groups = new Map<string, Trip[]>();
  for (const trip of trips) {
    groups.set(trip.driverId, [...(groups.get(trip.driverId) ?? []), trip]);
  }
  return groups;
}

export function driverRows(trips: Trip[], driverNames: Map<string, string>): string[][] {
  const rows: string[][] = [];
  for (const [driverId, driverTrips] of groupByDriver(trips)) {
    const totalKm = driverTrips.reduce((sum, t) => sum + t.distanceKm, 0);
    const harshEvents = driverTrips.reduce((sum, t) => sum + t.harshEvents, 0);
    const score = totalKm === 0
      ? 0
      : Math.max(0, MAX_SCORE - (harshEvents / totalKm) * HARSH_EVENTS_PER_KM_WEIGHT);

    rows.push([driverNames.get(driverId) ?? driverId, totalKm.toFixed(0), score.toFixed(1)]);
  }
  return rows;
}
```

Bu ikki tidying alohida PR (yoki kamida alohida commit). Testlar o'zgarmaydi.

**To'xtash nuqtasi.** Chips vasvasasi: `score` hisobini ham alohida funksiyaga chiqarish, natijani `string[][]` o'rniga tiplangan obyektga aylantirish, `Map` o'rniga `Object.groupBy` ishlatish. Bularning hech biri "tungi qatnovlar" ustunini osonlashtirmaydi. Beck mantiqi bo'yicha ular "later" yoki "never". Biz to'xtaymiz.

**Feature, alohida PR:**

```ts
function isNightTrip(trip: Trip): boolean {
  const hour = trip.startedAt.getHours();
  return hour >= 22 || hour < 6;
}

// driverRows ichida, rows.push dan oldin:
// const nightTrips = driverTrips.filter(isNightTrip).length;
// rows.push([name, totalKm.toFixed(0), score.toFixed(1), String(nightTrips)]);
```

Feature diff'i endi uch qatordan iborat va reviewer faqat biznes qoidasiga (22:00-06:00, vaqt zonasi) e'tibor beradi.

## Qachon qo'llamaslik kerak

- **Tidying PR'larini review'siz merge qilish.** Beckning bu taklifi yuqori ishonch, kuchli test to'plami va avtomatik tekshiruvlar bo'lgan jamoa uchun. Ko'p jamoalarda (ayniqsa regulyatsiya qilinadigan, to'lov yoki tibbiy tizimlarda) har bir o'zgarish review talab qiladi va bu to'g'ri. "Struktura o'zgarishi" deb belgilangan PR'da tasodifan xatti-harakat o'zgarishi bo'lishi mumkin, va buni ko'pincha faqat review ushlaydi.
- **PR'lar sonini sun'iy oshirish.** Agar jamoada har bir PR uchun CI 30 daqiqa ishlasa va ikki kishining tasdig'i kerak bo'lsa, 5 ta bir qatorli tidying PR'i narxi foydasidan oshib ketishi mumkin. Bunday holatda bitta PR ichida alohida commit'lar (har biri `tidy:` prefiksi bilan) yaxshi kompromiss.
- **"Never" ni bahona qilish.** "Bu kod o'zgarmaydi" degan bashorat ko'pincha noto'g'ri. "Never" faqat haqiqatan barqaror yoki o'chirilishi rejalashtirilgan kod uchun.
- **Kitobning nazariy qismini aniq hisob-kitob deb tushunish.** Opsionlar va diskontlangan pul oqimi metafora va fikrlash vositasi. Beck tidying qiymatini raqamlar bilan hisoblashni taklif qilmaydi, va uni shunday ishlatishga urinish soxta aniqlik beradi.
- **Katta refaktoringni tidying deb atash.** Modulni qayta tashkil qilish, ma'lumotlar bazasi sxemasini o'zgartirish tidying emas. Ular uchun rejalashtirish va 80-darsdagi texnikalar kerak.

## Stack'da: git, NestJS, React

- **Commit prefikslari.** Conventional Commits'da (39-dars) `refactor:` turi bor. Ba'zi jamoalar Beck uslubida `tidy:` ni ham qo'shadi. Muhimi - qoida: bu prefiksli commit'da test o'zgarmaydi. Buni CI'da tekshirish mumkin: `refactor:` commit'i `*.spec.ts` fayllarini o'zgartirsa, ogohlantirish.
- **Stacked PR'lar.** GitHub'da tidying PR'ini asosiy branch'ga, feature PR'ini esa tidying branch'iga nisbatan ochish reviewer'ga ikkalasini alohida ko'rish imkonini beradi. Graphite, `gh` va `git rebase --update-refs` kabi vositalar bu oqimni osonlashtiradi.
- **NestJS'da Explicit Parameters.** Servis ichida `process.env.CANCEL_WINDOW_HOURS` ni to'g'ridan-to'g'ri o'qish yashirin parametr. Uni konstruktor orqali (ConfigService yoki typed config provider) berish - Explicit Parameters tidying'i va testlanuvchanlikni oshiradi.
- **React'da Reading Order va Cohesion Order.** Komponent faylida: tiplar, keyin asosiy eksport qilinadigan komponent, keyin ichki yordamchi komponentlar. Hook'lar ichida bog'liq state va effektlarni yonma-yon qo'yish - Cohesion Order. Bu bir necha daqiqalik ish va keyingi o'zgarishni sezilarli osonlashtiradi.
- **Prettier va tidying.** Formatlashni avtomatlashtirish (36-dars) tidying diff'larini toza saqlaydi: aks holda bir qatorli o'zgarish formatlash shovqiniga ko'milib ketadi.

## Xulosa

- Tidying - refaktoringning eng mayda ko'rinishi: daqiqalar oladi, xatti-harakatni o'zgartirmaydi, ruxsat talab qilmaydi. Kitobda 15 ta tidying bor.
- Struktura va xatti-harakat o'zgarishlari turli xavfga ega: birinchisi odatda qaytariladigan, ikkinchisi ko'pincha emas. Ularni alohida PR yoki kamida alohida commit'larda saqlang.
- "First, After, Later, Never": tidying keyingi o'zgarishni arzonlashtirsa va kichik bo'lsa - avval; kod o'zgarmasa - hech qachon. To'xtashni bilish asosiy ko'nikma.
- Iqtisodiy asos: pulning vaqt qiymati feature'ni hozir talab qiladi, opsionlar qiymati esa strukturani. Ikkalasini har bir holatda torting.
- Constantine's Equivalence: dastur narxi asosan coupling bilan belgilanadi. Cohesion - coupled elementlarni bir joyda saqlash.
