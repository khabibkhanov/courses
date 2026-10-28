---
n: 42
slug: demeter-qonuni
title: "Demeter qonuni va Tell, Don't Ask"
summary: "Uzun chaqiruv zanjirlari (train wreck) kodni boshqa obyektlarning ichki tuzilishiga bog'lab qo'yadi. Demeter qonuni va Tell, Don't Ask bu bog'liqlikni kamaytirish uchun ikki yo'l beradi. Darsda ularning aniq mazmunini, Fowler va Pragmatic Programmer mualliflarining ehtiyotkor bahosini va qachon zanjir mutlaqo normal ekanini ko'ramiz."
duration: 35
sources:
  - id: cc1
    note: "\"Objects and Data Structures\" bobi: The Law of Demeter, Train Wrecks, Hiding Structure"
  - id: pragprog
    note: "Decoupling mavzusi: train wreck'lar, Tell, Don't Ask va mualliflarning Demeter qonuniga yangilangan munosabati"
  - id: fowler-tell-dont-ask
    note: "Tell, Don't Ask ta'rifi, monitor misoli va Fowlerning \"GetterEradicator\"lar haqidagi tanqidi"
quiz:
  - q: "Demeter qonuniga ko'ra, `C` klassining `f` metodi qaysi obyektlarning metodlarini chaqirishi mumkin?"
    options:
      - "Istalgan obyektning, agar u import qilingan bo'lsa"
      - "Faqat `C` ning o'zi, `f` yaratgan obyekt, `f` ga argument sifatida berilgan obyekt va `C` ning instance maydonidagi obyekt"
      - "Faqat statik metodlarni"
      - "Faqat `C` ning ota klassi metodlarini"
    answer: 1
    explain: "Bu Martin keltirgan klassik ro'yxat. Asosiy cheklov shundaki, ruxsat etilgan obyektlardan qaytgan obyektlarning metodlarini chaqirish (\"begonalar bilan gaplashish\") qoidani buzadi."
  - q: "`report.rows.map(r => r.total).filter(Boolean).join(',')` - bu Demeter qonunini buzadimi?"
    options:
      - "Ha, chunki zanjirda uchtadan ortiq nuqta bor"
      - "Ha, chunki massiv metodlari begona obyekt"
      - "Yo'q, chunki bu standart kutubxona ustidagi transformatsiya: har qadam bir xil turdagi qiymat qaytaradi va hech kimning ichki tuzilishi ochilmaydi"
      - "Faqat `map` dan keyin `filter` kelsa buzadi"
    answer: 2
    explain: "Qonun nuqtalarni sanash emas. Zanjir muammosi - boshqa obyektlarning ichki navigatsiyasiga bog'lanish. Massiv yoki builder ustidagi fluent zanjirlar kam o'zgaradigan, ochiq API'ga tayanadi. Pragmatic Programmer mualliflari ham kam o'zgaradigan narsalar uchun istisno qiladi."
  - q: "Fowler Tell, Don't Ask haqida qanday pozitsiyada?"
    options:
      - "Uni har doim qo'llash kerak deb hisoblaydi"
      - "Uni o'zi asosiy qoida sifatida ishlatmaydi, ma'lumot va xatti-harakatni birga joylashtirishga intiladi va barcha query metodlarini yo'q qilishga urinishni tanqid qiladi"
      - "Uni butunlay zararli deb hisoblaydi"
      - "Uni faqat funksional dasturlash uchun tavsiya qiladi"
    answer: 1
    explain: "Fowler o'zi bu tamoyilni ishlatmasligini aytadi. U co-location (ma'lumot va xatti-harakat birga) g'oyasiga tayanadi va getter'larni yo'q qilishga harakat qiladigan \"GetterEradicator\"larni tanqid qiladi: ba'zan query oddiyroq."
  - q: "Quyidagi koddan qaysi refaktoring Tell, Don't Ask ruhiga eng mos? `if (account.getBalance() >= amount) { account.setBalance(account.getBalance() - amount) }`"
    options:
      - "`account.getBalance()` ni o'zgaruvchiga olish"
      - "`setBalance` ni `updateBalance` deb qayta nomlash"
      - "Balansni global o'zgaruvchiga olish"
      - "`account.withdraw(amount)` metodini yaratish va tekshiruvni uning ichiga ko'chirish"
    answer: 3
    explain: "Tekshiruv va o'zgarish balansning invariantiga tegishli, ular `Account` ichida bo'lishi kerak. Aks holda har bir chaqiruvchi tekshiruvni takrorlaydi va biri uni unutadi."
  - q: "Martinning fikricha, `ctxt.options.scratchDir.absolutePath` zanjiri qachon Demeter qonunini buzmaydi?"
    options:
      - "Agar `ctxt`, `options`, `scratchDir` xatti-harakati yo'q oddiy ma'lumot strukturalari bo'lsa"
      - "Agar bu kod test ichida bo'lsa"
      - "Agar zanjir bitta qatorda yozilgan bo'lsa"
      - "Hech qachon, bu har doim buzilish"
    answer: 0
    explain: "Martin qonun obyektlar uchun ekanini aytadi: ma'lumot strukturalari ichki tuzilishini ochiq beradi, shuning uchun ularning maydonlari bo'ylab yurish tabiiy. Muammo obyekt va struktura aralashib ketganda paydo bo'ladi."
  - q: "Demeter qonunini mexanik qo'llashning eng ko'p uchraydigan salbiy oqibati qaysi?"
    options:
      - "Kod tezroq ishlaydi"
      - "Testlar soni kamayadi"
      - "Klasslar zanjirni yashirish uchun ko'plab delegatsiya metodlari bilan to'lib, sayoz \"middle man\"larga aylanadi"
      - "TypeScript kompilyatsiyasi buziladi"
    answer: 2
    explain: "`order.getCustomerAddressCityName()` kabi o'nlab o'tkazgich metodlar interfeysni kengaytiradi, lekin chuqurlik bermaydi. Fowler buni \"Middle Man\" smell deb ataydi (75-dars). To'g'ri yechim odatda o'tkazgich emas, xatti-harakatni ko'chirish."
task:
  title: "Ijara to'lovidagi train wreck'ni tuzatish"
  prompt: |
    Quyidagi servis avtomobil ijarasi uchun to'lov oladi. U mijoz, uning hamyoni va ijara shartnomasining ichki tuzilishini chuqur biladi.

    1. Qaysi chaqiruvlar boshqa obyektlarning ichki tuzilishiga bog'langanini belgilang.
    2. Tekshiruv va o'zgarishni ma'lumot egasiga ko'chiring (Tell, Don't Ask).
    3. Faqat o'tkazgich (delegatsiya) metodlar qo'shib qo'ymang: har bir yangi metod ma'noli xatti-harakat bo'lsin.
    4. Faqat ma'lumot o'qiydigan joyda (masalan, chek uchun) oddiy query qoldirish mumkin - qayerda buni qildingiz, izohlang.
  lang: ts
  starter: |
    type Wallet = { balance: number; currency: "UZS"; frozen: boolean };
    type Customer = { id: string; name: string; wallet: Wallet };
    type Rental = {
      id: string;
      customer: Customer;
      dailyRate: number;
      days: number;
      discount: { percent: number } | null;
    };

    export class RentalPaymentService {
      charge(rental: Rental): string {
        const base = rental.dailyRate * rental.days;
        const amount = rental.discount
          ? base - (base * rental.discount.percent) / 100
          : base;

        if (rental.customer.wallet.frozen) {
          throw new Error("Hamyon muzlatilgan");
        }
        if (rental.customer.wallet.balance < amount) {
          throw new Error("Mablag' yetarli emas");
        }
        rental.customer.wallet.balance -= amount;

        return `${rental.customer.name}: ${amount} ${rental.customer.wallet.currency}`;
      }
    }
  solution: |
    export class Wallet {
      #balance: number;
      #frozen = false;

      constructor(initialBalance: number, readonly currency: "UZS" = "UZS") {
        this.#balance = initialBalance;
      }

      debit(amount: number): void {
        if (this.#frozen) throw new Error("Hamyon muzlatilgan");
        if (this.#balance < amount) throw new Error("Mablag' yetarli emas");
        this.#balance -= amount;
      }

      freeze(): void {
        this.#frozen = true;
      }
    }

    export class Customer {
      constructor(
        readonly id: string,
        readonly name: string,
        private readonly wallet: Wallet,
      ) {}

      pay(amount: number): void {
        this.wallet.debit(amount);
      }

      get currency(): string {
        return this.wallet.currency;
      }
    }

    export class Rental {
      constructor(
        readonly id: string,
        readonly customer: Customer,
        private readonly dailyRate: number,
        private readonly days: number,
        private readonly discountPercent: number = 0,
      ) {}

      totalPrice(): number {
        const base = this.dailyRate * this.days;
        return base - (base * this.discountPercent) / 100;
      }
    }

    export class RentalPaymentService {
      charge(rental: Rental): string {
        const amount = rental.totalPrice();
        rental.customer.pay(amount);
        return `${rental.customer.name}: ${amount} ${rental.customer.currency}`;
      }
    }
  solutionNotes: |
    - Balans tekshiruvi va kamaytirish `Wallet.debit` ichiga ko'chdi. Endi hech bir chaqiruvchi tekshiruvni unutib, balansni manfiyga tushira olmaydi.
    - Narx hisobi `Rental.totalPrice` ichida: chegirma qoidasi shartnomaga tegishli, servis uni bilishi shart emas.
    - `Customer.pay` - bu shunchaki o'tkazgich emas: u "mijoz to'laydi" degan domen amalini ifodalaydi va mijoz qaysi hamyondan to'lashini yashiradi. Ertaga bir nechta hamyon yoki kredit limiti qo'shilsa, o'zgarish shu yerda bo'ladi.
    - Chek matni uchun `name` va `currency` oddiy query'lar sifatida qoldi. Ularni "tell" metodlariga aylantirish (masalan, `customer.formatReceipt()`) mijoz klassini taqdimot mantig'i bilan to'ldirib yuborardi. Fowler aytganidek, ba'zan so'rash oddiyroq.
    - `rental.customer.pay()` da ikki nuqta bor, lekin `customer` - `Rental`ning ochiq, barqaror qismi. Qonunni nuqta sanash deb tushunmaslik kerak.
  checklist:
    - "Servis endi hamyonning ichki maydonlarini (balance, frozen) bilmaydi"
    - "Invariant (manfiy balans yo'q, muzlatilgan hamyondan yechilmaydi) bitta joyda"
    - "Chegirma hisobi ijara shartnomasiga ko'chdi"
    - "Faqat delegatsiya qiluvchi ma'nosiz metodlar qo'shilmadi"
    - "Faqat o'qish uchun kerak bo'lgan joylarda query'lar ongli ravishda qoldirildi"
---

## Muammo

Mana bu qatorga qarang:

```ts
const city = order.getCustomer().getProfile().getAddress().getCity().toUpperCase();
```

Bu qatorni yozgan funksiya beshta klassning ichki tuzilishini biladi: buyurtmada mijoz borligini, mijozda profil, profilda manzil, manzilda shahar borligini. Ertaga manzillar profildan alohida jadvalga ko'chsa yoki mijozning bir nechta manzili bo'lsa, bu qator buziladi. Va u yolg'iz emas: loyihada shunday zanjirlar o'nlab joyda bo'ladi.

Robert Martin bunday kodni **train wreck** (poyezd halokati) deb ataydi: bir-biriga ulangan vagonlar kabi ko'rinadi. Muammo uzunlikda emas, bog'liqlikda. Chaqiruvchi o'zi gaplashayotgan obyekt orqali boshqa obyektlarga, ular orqali yana boshqalarga yetib boradi. Natijada tizimning bir chekkasidagi o'zgarish uzoq joylarni buzadi.

Ikkinchi, nozikroq muammo ham bor. Zanjir ko'pincha o'qish bilan tugamaydi:

```ts
if (vehicle.getTank().getLiters() + liters <= vehicle.getTank().getCapacity()) {
  vehicle.getTank().setLiters(vehicle.getTank().getLiters() + liters);
}
```

Bu yerda chaqiruvchi bakning invariantini o'zi tekshiradi va holatni o'zi o'zgartiradi. Bu mantiq bak klassida bo'lishi kerak edi. Endi u har bir chaqiruvchida takrorlanadi va biror chaqiruvchi tekshiruvni albatta unutadi.

## Asosiy g'oya

### Demeter qonuni

Demeter qonuni 1980-yillar oxirida Northeastern universitetidagi Demeter loyihasida shakllangan va "faqat yaqin do'stlaring bilan gaplash" degan qisqa formulaga ega. Martin uni *Clean Code*da shunday beradi: `C` klassining `f` metodi faqat quyidagilarning metodlarini chaqirishi kerak:

- `C` ning o'zi;
- `f` yaratgan obyekt;
- `f` ga argument sifatida berilgan obyekt;
- `C` ning instance maydonida saqlangan obyekt.

Ruxsat etilgan obyektlar **qaytargan** obyektlarning metodlarini chaqirish qonunni buzadi. Martin buni modul o'zi boshqarayotgan obyektlarning ichki tuzilishini bilmasligi kerak degan g'oyaga bog'laydi: obyekt ma'lumotni yashiradi va operatsiyalarni beradi (41-dars), shuning uchun uning ichiga accessor'lar orqali kirish bu yashirishni bekor qiladi.

Muhim nozik joy: Martin ta'kidlaydiki, agar zanjirdagi narsalar **ma'lumot strukturalari** bo'lsa (xatti-harakati yo'q, maydonlari ochiq), Demeter qonuni ularga taalluqli emas. Ma'lumot strukturasi o'z tuzilishini ochiq beradi, uning maydonlari bo'ylab yurish tabiiy. Muammo struktura va obyekt aralashganda (gibridlar) paydo bo'ladi.

### Tell, Don't Ask

Tell, Don't Ask bir xil muammoga boshqa tomondan yondashadi. Fowler uni Andy Hunt va Dave Thomas (Pragmatic Programmer mualliflari) bilan bog'laydi va mazmunini shunday tushuntiradi: obyektdan ma'lumot so'rab, keyin o'sha ma'lumot ustida tashqarida qaror qabul qilish o'rniga, obyektga nima qilish kerakligini **ayting**, qarorni u o'zi qabul qilsin. Bu OO'ning asosiy g'oyasi - ma'lumot va uning ustidagi xatti-harakat birga - eslatmasi.

Fowlerning misolida chegaradan oshganda ogohlantiradigan monitor bor. "Ask" variantida chaqiruvchi monitor qiymati va chegarasini getter'lar orqali olib, solishtiradi va ogohlantirishni o'zi chaqiradi. "Tell" variantida chaqiruvchi faqat `setValue` qiladi, solishtirish va ogohlantirish monitor ichida.

Pragmatic Programmer'ning 20 yillik nashrida mualliflar bu g'oyani "Decoupling" mavzusida train wreck'lar bilan birga ko'rib chiqadi va amaliy qisqartmani taklif qiladi: chaqiruvlarni zanjirga ulamang, ya'ni biror narsaga murojaat qilganda bittadan ortiq nuqta ishlatmaslikka harakat qiling. Ular darhol istisno ham qo'shadi: zanjirdagi narsalar o'zgarish ehtimoli juda past bo'lsa (masalan, til yoki standart kutubxona), zanjir muammo emas.

## Chuqurroq: qonun emas, evristika

### "Nuqtalarni sanash" xatosi

Demeter qonuni ko'pincha "bitta nuqta qoidasi" deb noto'g'ri tushuniladi. Quyidagi kodda to'rtta nuqta bor, lekin u hech qanday qonunni buzmaydi:

```ts
const plates = vehicles
  .filter((v) => v.status === "active")
  .map((v) => v.plate)
  .sort()
  .join(", ");
```

Har bir qadam `Array` ustidagi operatsiya, va `Array` API'si o'n yillardan beri o'zgarmagan. Bu yerda hech kimning ichki tuzilishi ochilmayapti. Xuddi shunday, Kysely yoki Prisma'ning query builder zanjirlari (`db.selectFrom("trips").where(...).orderBy(...)`) - fluent interfeys, train wreck emas: har qadam bir xil abstraksiya darajasida qoladi.

Haqiqiy savol: **bu zanjir menga qaysi obyektning ichki tuzilishini bilishni majbur qilyapti va u qanchalik tez o'zgaradi?**

### Fowlerning ehtiyotkorligi

Fowler Tell, Don't Ask haqidagi maqolasida o'z pozitsiyasini ochiq aytadi: u bu tamoyilni o'zi ishlatmaydi. U ma'lumot va xatti-harakatni birga joylashtirishga (co-location) intiladi, bu esa ko'pincha shunga o'xshash natija beradi. Uning asosiy xavotiri - tamoyil "GetterEradicator"larni, ya'ni barcha query metodlarini yo'q qilishga urinadigan dasturchilarni tug'dirgani. Fowler ta'kidlaydiki, ba'zi obyektlar ma'lumot berish orqali yaxshi hamkorlik qiladi, va u query'dan qochish kodni chalkashtirib yuborgan holatlarni ko'rgan. Shuningdek, co-location boshqa omillarga, masalan qatlamlarga ajratishga, yo'l berishi kerak bo'lgan holatlar bor.

Bu muhim balans: Tell, Don't Ask yo'nalish ko'rsatadi, lekin "hech qachon so'rama" degani emas.

### Middle Man xavfi

Demeter qonunini mexanik qo'llash eng ko'p shunday ko'rinadi:

```ts
class Order {
  getCustomerCity(): string {
    return this.customer.getCity();
  }
  getCustomerPhone(): string {
    return this.customer.getPhone();
  }
  getCustomerWalletBalance(): number {
    return this.customer.getWalletBalance();
  }
  // ... yana 15 ta
}
```

Zanjir yo'qoldi, lekin bog'liqlik yo'qolmadi: `Order` endi mijozning butun interfeysini qayta e'lon qiladi va mijoz o'zgarsa `Order` ham o'zgaradi. Fowler *Refactoring*da buni "Middle Man" smell deb ataydi va teskari refaktoringni (Remove Middle Man) taklif qiladi. Bu ikki smell (Message Chains va Middle Man) qarama-qarshi kuchlar, ularni 75-darsda batafsil ko'ramiz.

To'g'ri yechim odatda o'tkazgich emas, **xatti-harakatni ko'chirish**. Chaqiruvchi shaharni nima uchun so'radi? Agar yetkazib berish narxini hisoblash uchun bo'lsa, `order.deliveryFee(tariffs)` metodi kerak, `getCustomerCity` emas.

### Chegaralar va ma'lumot uzatish

Taqdimot qatlami (React komponent, API javobi, PDF chek) ma'lumotni ko'rsatish uchun so'rashi tabiiy. Domen obyektiga `renderReceiptHtml()` metodini qo'shish Tell, Don't Ask'ni bajaradi, lekin domen va UI'ni aralashtiradi. Bunday joyda domen obyektidan oddiy ma'lumot strukturasini (DTO, view model) olish va uni taqdimot qatlamida ishlatish to'g'riroq. Bu Fowler eslatgan "qatlamlar" holati.

## Misol: yoqilg'i quyish

Yomon:

```ts
export class RefuelService {
  constructor(private readonly events: { publish(e: object): void }) {}

  refuel(vehicle: Vehicle, liters: number): void {
    const tank = vehicle.getTank();
    if (tank.getLiters() + liters > tank.getCapacity()) {
      throw new Error("Bak sig'imidan oshib ketdi");
    }
    tank.setLiters(tank.getLiters() + liters);
    if (tank.getLiters() / tank.getCapacity() > 0.95) {
      this.events.publish({ type: "tank_full", vehicleId: vehicle.getId() });
    }
  }
}
```

Servis bakning sig'imi, joriy miqdori va "to'la" degan qoidani biladi. Bu bilim bak klassiga tegishli.

Yaxshi:

```ts run
type RefuelResult = { becameFull: boolean };

export class FuelTank {
  #liters: number;
  constructor(private readonly capacity: number, liters = 0) {
    this.#liters = liters;
  }

  fill(liters: number): RefuelResult {
    if (this.#liters + liters > this.capacity) {
      throw new RangeError("Bak sig'imidan oshib ketdi");
    }
    this.#liters += liters;
    return { becameFull: this.#liters / this.capacity > 0.95 };
  }
}

export class Vehicle {
  constructor(readonly id: string, private readonly tank: FuelTank) {}

  refuel(liters: number): RefuelResult {
    return this.tank.fill(liters);
  }
}

export class RefuelService {
  constructor(private readonly events: { publish(e: object): void }) {}

  refuel(vehicle: Vehicle, liters: number): void {
    const { becameFull } = vehicle.refuel(liters);
    if (becameFull) this.events.publish({ type: "tank_full", vehicleId: vehicle.id });
  }
}

// Sinab ko'ring: bak sig'imi va quyiladigan litrlarni o'zgartiring.
const service = new RefuelService({ publish: (e) => console.log("hodisa:", JSON.stringify(e)) });
const vehicle = new Vehicle("01A123BC", new FuelTank(60, 20));
service.refuel(vehicle, 25);
service.refuel(vehicle, 13);
try {
  service.refuel(vehicle, 10);
} catch (e) {
  console.log((e as Error).message);
}
```

Nima o'zgardi va nega:

- **Invariant egasiga ko'chdi.** "Sig'imdan oshmasin" va "95% dan ko'p - to'la" qoidalari `FuelTank` ichida. Boshqa servis (masalan, datchikdan kelgan ma'lumot) bu qoidalarni chetlab o'ta olmaydi.
- **`Vehicle.refuel` o'tkazgichdan ko'proq.** U "avtomobilga yoqilg'i quyiladi" degan domen amalini ifodalaydi va avtomobilda nechta bak borligini yashiradi. Ikki bakli yuk mashinasi qo'shilsa, o'zgarish shu yerda bo'ladi.
- **Hodisa nashr qilish servisda qoldi.** Bak klassi event bus haqida bilmasligi kerak. Bak natija qaytaradi (`becameFull`), servis unga qarab qaror qiladi. Bu "ayt" va "so'ra"ning oqilona aralashmasi: domen qarorni beradi, infratuzilma esa reaksiya qiladi.
- **`vehicle.id` query sifatida qoldi.** Identifikatorni so'rash hech qanday invariantni buzmaydi.

## Qachon qo'llamaslik kerak

- **Ma'lumot strukturalarida.** API javobi, config obyekti, Prisma natijasi - bular ichki tuzilishini ochiq beradi. `config.db.pool.max` ni o'qish to'g'ri, uni `config.getDbPoolMax()` ga aylantirish ma'nosiz.
- **Fluent API va standart kutubxonada.** Massiv metodlari, query builder'lar, `zod` sxema zanjirlari, Promise zanjirlari. Ularning interfeysi barqaror va maqsadli ravishda zanjir uchun yaratilgan.
- **Taqdimot uchun ma'lumot olishda.** UI yoki hisobot ma'lumotni ko'rsatishi kerak. Domen obyektini formatlash metodlari bilan to'ldirmang, view model qaytaring.
- **O'tkazgich metodlar ko'payib ketganda.** Agar Demeter'ga rioya qilish uchun klassga o'nlab `getXOfY()` qo'shayotgan bo'lsangiz, to'xtang. Yo xatti-harakatni ko'chiring, yo zanjirni qabul qiling.
- **Qoida emas, ogohlantirish.** Pragmatic Programmer mualliflari ham Fowler ham bu g'oyalarni qat'iy qonun sifatida emas, bog'liqlikni sezish uchun signal sifatida taqdim etadi.

## Stack'da: NestJS va React

- **NestJS servislarida** ko'p uchraydigan train wreck: `user.company.subscription.plan.limits.maxVehicles`. Agar bu tekshiruv bir necha joyda bo'lsa, `subscriptionPolicy.canAddVehicle(companyId)` kabi bitta servis metodiga yig'ing. Bu Demeter'dan ko'ra "bilimni bitta joyga qo'yish" masalasi.
- **Prisma `include` natijalari** ma'lumot strukturasi. Ular bo'ylab yurish normal, lekin chuqur `include` zanjirlari servisni DB sxemasiga bog'laydi. Repository ichida kerakli shaklga keltirib, servisga tekis struktura bering.
- **React'da props drilling** - Demeter'ning boshqa ko'rinishi: `props.order.customer.address.city`. Komponentga butun daraxtni emas, unga kerakli qiymatlarni (`city`) bering. Bu komponentni testlash va qayta ishlatishni ham osonlashtiradi.
- **Optional chaining** (`a?.b?.c?.d`) train wreck'ni yashiradi, lekin yo'qotmaydi. Uzun `?.` zanjirlari ko'pincha tiplar noaniqligi yoki noto'g'ri chegara belgisi (46-dars).

## Xulosa

- Train wreck - boshqa obyektlarning ichki tuzilishiga bog'lanish belgisi, muammo nuqtalar sonida emas.
- Demeter qonuni: metod faqat o'zi, o'z maydonlari, argumentlari va o'zi yaratgan obyektlar bilan gaplashsin. Ma'lumot strukturalariga u taalluqli emas.
- Tell, Don't Ask: qarorni ma'lumot egasiga topshiring, lekin Fowler ogohlantirganidek, barcha query'larni yo'q qilishga urinmang.
- Mexanik qo'llash Middle Man smell'ini tug'diradi. Yechim odatda o'tkazgich emas, xatti-harakatni ko'chirish.
- Fluent API, standart kutubxona va taqdimot uchun ma'lumot olish - zanjir normal bo'lgan joylar.
