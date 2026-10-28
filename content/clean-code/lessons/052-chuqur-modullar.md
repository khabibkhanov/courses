---
n: 52
slug: chuqur-modullar
title: "Chuqur va sayoz modullar"
summary: "Ousterhout'ning markaziy g'oyasi: yaxshi modul kichik interfeys orqasida ko'p funksionallikni yashiradi. Bu darsda chuqur va sayoz modullarni farqlashni, classitis, pass-through metodlar va murakkablikni pastga tortish tamoyilini ko'ramiz."
duration: 35
sources:
  - id: aposd
    note: "\"Modules Should Be Deep\" bobi (interfeys va implementatsiya, Unix I/O va Java I/O misollari, classitis), \"Different Layer, Different Abstraction\" (pass-through metodlar), \"Pull Complexity Downwards\" va umumiy maqsadli modullar haqidagi bob"
  - id: aposd-vs-cc
    note: "Ousterhout va Martin munozarasida metodlar uzunligi va modul chuqurligi bo'yicha qarashlar farqi"
quiz:
  - q: "Ousterhout bo'yicha modulning \"chuqurligi\" nimani anglatadi?"
    options:
      - "Klasslar ierarxiyasining balandligi"
      - "Modul taqdim etadigan funksionallik va uning interfeysi narxi o'rtasidagi nisbat"
      - "Modul ichidagi kod qatorlari soni"
      - "Modul nechta boshqa modulga bog'liqligi"
    answer: 1
    explain: "Chuqur modul - interfeysi kichik va oddiy, lekin orqasida ko'p ish bajariladigan modul. Uzunlik yoki meros ierarxiyasi bu o'lchov emas: uzun, lekin interfeysi murakkab modul ham sayoz bo'lishi mumkin."
  - q: "Quyidagi metod haqida nima deyish mumkin? `class FleetService { getVehicle(id: string) { return this.vehicleRepo.getVehicle(id); } }`"
    options:
      - "Bu yaxshi, chunki u qatlamlarni ajratadi"
      - "Bu Strategy pattern"
      - "Bu chuqur modulning namunasi"
      - "Bu pass-through metod: interfeys qo'shadi, lekin hech qanday abstraksiya yoki funksionallik qo'shmaydi"
    answer: 3
    explain: "Ousterhout pass-through metodlarni sayozlik belgisi deb biladi: qo'shni qatlamlar bir xil abstraksiyani taqdim etmoqda. Agar `FleetService` bu yerda hech qanday qoida, ruxsat yoki transformatsiya qo'shmasa, u faqat o'quvchi tushunishi kerak bo'lgan yana bir sahifa."
  - q: "\"Classitis\" nima?"
    options:
      - "Kichik klasslar ko'payishi tufayli har biri sayoz bo'lib, tizimda jami interfeyslar va ular orasidagi bog'lanishlar ko'payishi"
      - "Klasslarni umuman ishlatmaslik"
      - "Bitta klassda juda ko'p metod bo'lishi"
      - "Meros zanjirining uzunligi"
    answer: 0
    explain: "Ousterhout \"klasslar kichik bo'lishi kerak\" degan maslahat o'z-o'zidan qo'llanganda ko'plab sayoz klasslarga olib kelishini ta'kidlaydi. Har bir klass alohida oddiy, lekin tizim murakkablashadi."
  - q: "Konfiguratsiya parametrlari haqida Ousterhout'ning tavsiyasi qanday?"
    options:
      - "Hamma qiymatni tashqariga parametr qilib chiqarish, foydalanuvchi o'zi tanlasin"
      - "Konfiguratsiyani umuman taqiqlash"
      - "Imkon bo'lsa, modul o'zi oqilona qiymatni hisoblasin yoki yaxshi default bersin: murakkablikni pastga torting"
      - "Har bir parametr uchun alohida klass yaratish"
    answer: 2
    explain: "Har bir konfiguratsiya parametri murakkablikni modul foydalanuvchisiga o'tkazadi. Modul muallifi muammoni yaxshiroq biladi va bu murakkablikni o'zi ko'tarishi kerak. Parametr faqat foydalanuvchi haqiqatan yaxshiroq qiymat bila oladigan joyda kerak."
  - q: "Nima uchun Ousterhout umumiy maqsadli (somewhat general-purpose) interfeysni tavsiya qiladi?"
    options:
      - "Chunki u har qanday kelajakdagi talabni qo'llab-quvvatlaydi"
      - "Chunki u odatda soddaroq va chuqurroq bo'ladi: maxsus holatlar uchun alohida metodlar o'rniga kam sonli umumiy amallar"
      - "Chunki generiklar har doim tezroq"
      - "Chunki u test yozishni talab qilmaydi"
    answer: 1
    explain: "Ousterhout matn muharriri misolida maxsus metodlar (backspace, deleteSelection) o'rniga umumiy insert/delete amallari interfeysni kichraytirishini ko'rsatadi. Bu YAGNI'ga zid emas: maqsad hozirgi ehtiyoj uchun, lekin maxsus holatlarga bog'lanmagan interfeys."
  - q: "Ikki modulni tanlayapsiz. A: 12 ta ommaviy metod, har biri 3-5 qator. B: 2 ta ommaviy metod, ichida 300 qator. Qaysi xulosa to'g'ri?"
    options:
      - "A har doim yaxshiroq, chunki metodlar qisqa"
      - "B har doim yaxshiroq, chunki interfeys kichik"
      - "Ularni solishtirib bo'lmaydi: chuqurlik faqat runtime profiling bilan o'lchanadi"
      - "Chaqiruvchi uchun B kamroq bilim talab qiladi va bu chuqurlik belgisi, lekin B ichidagi 300 qator ham o'qiluvchan tashkil etilgan bo'lishi kerak"
    answer: 3
    explain: "Chuqurlik interfeys narxi va funksionallik nisbati. B chaqiruvchidan kam bilim talab qiladi. Lekin bu ichki tuzilishni e'tiborsiz qoldirishga ruxsat emas: implementatsiya ham o'qiladigan bo'lishi kerak. Javob B'ni avtomatik oqlamaydi, uni chuqurlik nuqtai nazaridan baholaydi."
task:
  title: "Sayoz GPS qatlamlarini chuqur modulga birlashtirish"
  prompt: |
    Quyida GPS trekerdan kelgan nuqtalar asosida sayohat masofasini hisoblaydigan kod bor. U uchta klassga bo'lingan va har biri "bitta ish qiladi". Lekin chaqiruvchi to'g'ri natija olish uchun to'rtta qadamni to'g'ri tartibda bajarishi va har bir klassning ichki shartlarini bilishi kerak.

    1. Chaqiruvchi nimalarni bilishi kerakligini sanang (tartib, filtr chegaralari, birliklar).
    2. Bitta chuqur modul yozing: chaqiruvchi faqat nuqtalar ro'yxatini beradi va masofani kilometrda oladi.
    3. Chegara qiymatlarini oqilona default qiling. Tashqariga faqat haqiqatan kerak bo'lgan parametrni chiqaring.
  lang: ts
  starter: |
    type GpsPoint = { lat: number; lon: number; speedKmh: number; at: Date };

    export class PointSorter {
      sort(points: GpsPoint[]): GpsPoint[] {
        return [...points].sort((a, b) => a.at.getTime() - b.at.getTime());
      }
    }

    export class NoiseFilter {
      constructor(private readonly maxSpeedKmh: number, private readonly minSpeedKmh: number) {}
      filter(points: GpsPoint[]): GpsPoint[] {
        return points.filter((p) => p.speedKmh <= this.maxSpeedKmh && p.speedKmh >= this.minSpeedKmh);
      }
    }

    export class DistanceCalculator {
      // natija metrda, nuqtalar tartiblangan bo'lishi SHART
      segmentMeters(a: GpsPoint, b: GpsPoint): number {
        const R = 6371000;
        const toRad = (d: number) => (d * Math.PI) / 180;
        const dLat = toRad(b.lat - a.lat);
        const dLon = toRad(b.lon - a.lon);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
      }
    }

    // chaqiruvchi:
    export function tripKm(points: GpsPoint[]): number {
      const sorted = new PointSorter().sort(points);
      const clean = new NoiseFilter(180, 1).filter(sorted);
      const calc = new DistanceCalculator();
      let meters = 0;
      for (let i = 1; i < clean.length; i++) meters += calc.segmentMeters(clean[i - 1], clean[i]);
      return meters / 1000;
    }
  solution: |
    export type GpsPoint = { lat: number; lon: number; speedKmh: number; at: Date };

    export type TripDistanceOptions = {
      /** Bundan tez nuqtalar GPS shovqini deb tashlanadi. Default: 180 km/soat. */
      maxPlausibleSpeedKmh?: number;
    };

    const DEFAULT_MAX_PLAUSIBLE_SPEED_KMH = 180;
    const STATIONARY_SPEED_KMH = 1;
    const EARTH_RADIUS_M = 6_371_000;

    /**
     * Treker nuqtalari bo'yicha bosib o'tilgan masofa (km).
     * Nuqtalar istalgan tartibda kelishi mumkin; shovqin va turgan holatdagi nuqtalar e'tiborga olinmaydi.
     */
    export function tripDistanceKm(points: readonly GpsPoint[], options: TripDistanceOptions = {}): number {
      const maxSpeed = options.maxPlausibleSpeedKmh ?? DEFAULT_MAX_PLAUSIBLE_SPEED_KMH;
      const route = points
        .filter((p) => p.speedKmh >= STATIONARY_SPEED_KMH && p.speedKmh <= maxSpeed)
        .sort((a, b) => a.at.getTime() - b.at.getTime());

      let meters = 0;
      for (let i = 1; i < route.length; i++) {
        meters += haversineMeters(route[i - 1], route[i]);
      }
      return meters / 1000;
    }

    function haversineMeters(a: GpsPoint, b: GpsPoint): number {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lon - a.lon);
      const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
      return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
    }
  solutionNotes: |
    - Starter'da chaqiruvchi to'rtta narsani bilishi kerak edi: avval tartiblash, keyin filtr, filtr chegaralari, natija metrda. Endi bitta funksiya va bitta ixtiyoriy parametr.
    - "Nuqtalar tartiblangan bo'lishi SHART" degan komment yo'qoldi: shart endi modul ichida bajariladi. Bu murakkablikni pastga tortish.
    - Uchta klass bitta modulga birlashdi, lekin ichida `haversineMeters` alohida funksiya: chuqur modul ichida ham tuzilish bo'ladi, u faqat tashqariga chiqmaydi.
    - Faqat `maxPlausibleSpeedKmh` parametr qilib qoldirildi: mototsikl va yuk mashinasi uchun foydalanuvchi haqiqatan boshqa qiymat bilishi mumkin. `STATIONARY_SPEED_KMH` ichki qaror.
    - Klasslar o'rniga funksiya: holat yo'q, shuning uchun `new X()` faqat shovqin edi (59-dars).
  checklist:
    - "Chaqiruvchi chaqirish tartibini yoki ichki shartlarni bilishi shart emas"
    - "Natija birligi funksiya nomida aniq ko'rinadi"
    - "Faqat foydalanuvchi haqiqatan yaxshiroq bila oladigan qiymat parametr qilib chiqarilgan"
    - "Modul ichida ham kod o'qiluvchan bo'laklarga ajratilgan"
    - "Holatsiz klasslar oddiy funksiyalarga aylangan"
---

## Muammo

NestJS loyihasida bitta so'rov qanday ishlashini kuzatib ko'ring. `VehicleController.getOne` `VehicleFacade.getOne`ni chaqiradi, u `VehicleService.findById`ni, u `VehicleRepository.findById`ni, u esa `PrismaService.vehicle.findUnique`ni. To'rtta fayl, to'rtta klass, to'rtta interfeys. Har bir qatlam o'z argumentini keyingisiga uzatadi va hech biri hech narsa qo'shmaydi. Har bir klass alohida qaraganda juda "toza": qisqa, bitta ish qiladi, nomlari aniq. Lekin yangi maydon qo'shish uchun to'rtta joyni o'zgartirish kerak, bug qidirganda esa to'rtta faylni ochib, "qaysi biri haqiqatan ish qiladi" deb qidirasiz.

Teskari holatni ham ko'rgansiz: `node:fs` modulidagi `readFile` bitta funksiya, lekin u fayl tizimi, bufferlash, kodlash, xato kodlari va operatsion tizim farqlarini yashiradi. Siz uning ichini hech qachon o'qimagansiz va o'qishingiz shart emas.

Birinchisi ko'p kod yozib, kam narsa beradi. Ikkinchisi kam narsa so'rab, ko'p narsa beradi. Bu farqni John Ousterhout modul **chuqurligi** deb ataydi.

## Asosiy g'oya

Ousterhout *A Philosophy of Software Design*da har bir modulni ikki qismga ajratadi: **interfeys** (modulni ishlatish uchun bilish kerak bo'lgan hamma narsa) va **implementatsiya** (uni bajaradigan kod). Interfeys - bu xarajat: uni o'rganish, eslab qolish va to'g'ri ishlatish kerak. Implementatsiya esa foyda: u siz o'zingiz yozishingiz shart bo'lmagan ishni bajaradi.

Shu asosda:

- **Chuqur modul** - interfeysi kichik va oddiy, lekin orqasida ko'p funksionallik bor. Foydalanuvchi oz narsa biladi va ko'p narsa oladi.
- **Sayoz modul** - interfeysi u yashiradigan ishga nisbatan katta. Ekstremal holatda interfeys implementatsiyadan murakkabroq: uni ishlatish uchun bilish kerak bo'lgan narsa, kodni o'zingiz yozishdan ko'proq.

Ousterhout buni to'rtburchak bilan tasvirlaydi: ustki qirra - interfeys, balandlik - funksionallik. Yaxshi modul tor va baland.

Muhim nozik joy: **interfeys faqat metod signaturalari emas**. Ousterhout rasmiy qism (nomlar, parametr tiplari, exception'lar) va norasmiy qism (xatti-harakat, yon ta'sirlar, chaqirish tartibi, "bu metodni `init()`dan keyin chaqiring" kabi cheklovlar) ni ajratadi. Norasmiy qism ko'pincha kattaroq va xavfliroq, chunki kompilyator uni tekshirmaydi.

## Chuqurroq: misollar, classitis va pastga tortish

### Unix I/O va Java I/O

Ousterhout'ning klassik chuqur misoli - Unix fayl I/O: asosan beshta chaqiruv (`open`, `read`, `write`, `lseek`, `close`). Ular orqasida disk tuzilishi, kataloglar, ruxsatlar, keshlash, qurilma drayverlari va bir vaqtda kirish yashiringan. Interfeys o'nlab yillar davomida deyarli o'zgarmagan, implementatsiya esa tubdan qayta yozilgan.

Sayoz misol sifatida u Java'ning eski I/O kutubxonasini keltiradi: faylni bufferlangan holda o'qish uchun `FileInputStream`, `BufferedInputStream` va kerak bo'lsa `ObjectInputStream` obyektlarini ketma-ket yaratish kerak edi. Buferlash deyarli har doim kerak, lekin u alohida klass sifatida chiqarilgan va uni unutsangiz kod jim sekinlashadi. Ousterhout xulosasi: eng ko'p uchraydigan holat interfeysda eng oson bo'lishi kerak.

### Classitis

Ousterhout "klasslar kichik bo'lishi kerak" degan keng tarqalgan maslahatni tanqid qiladi. Bu maslahat o'z-o'zidan qo'llanganda ko'plab sayoz klasslar paydo bo'ladi. Har biri alohida oddiy, lekin har birining interfeysi bor, ular bir-biriga bog'langan va tizimni tushunish uchun hammasini birlashtirish kerak. U buni **classitis** deb ataydi.

Bu Robert Martin bilan munozaraning markaziy nuqtalaridan biri (10, 21 va 59-darslar). Martin *Clean Code*da funksiya va klasslarni juda kichik qilishni, Ousterhout esa chuqurlikni asosiy mezon qilishni tavsiya qiladi. Ikki muallif 2024-2025 yillardagi ochiq munozarasida bu borada to'liq kelisha olmagan. Halol xulosa: ikkalasi ham murakkablikka qarshi, lekin Martin uzun funksiyalar xavfini, Ousterhout esa haddan tashqari bo'linish xavfini ko'proq ta'kidlaydi. Sizning loyihangizda qaysi xavf ko'proq uchrayotganiga qarang.

### Pass-through metodlar va dekoratorlar

Ousterhout "har xil qatlam - har xil abstraksiya" tamoyilini beradi. Agar ikki qo'shni qatlam bir xil abstraksiyani taqdim etsa, bu sayozlik belgisi. Eng aniq alomat - **pass-through metod**: argumentlarni deyarli o'zgartirmasdan pastki qatlamga uzatadigan metod. U interfeys qo'shadi, lekin funksionallik qo'shmaydi.

Dekorator pattern'i ham shu xavfga ega: har bir dekorator asosiy obyektning barcha metodlarini takrorlaydi, ko'pchiligi shunchaki uzatadi. Ousterhout dekoratorni rad etmaydi, lekin undan oldin funksionallikni asosiy klassga yoki chaqiruvchiga qo'shish mumkinligini so'rashni maslahat beradi (60-dars).

Pass-through **o'zgaruvchilar** ham bor: parametr yuqori darajadan pastga, oradagi har bir funksiya orqali uzatiladi, ularning hech biri uni ishlatmaydi. React'da bu prop drilling deb ataladi va yechimlar o'xshash: kontekst obyekti yoki tuzilmani qayta ko'rib chiqish.

### Murakkablikni pastga torting

Ousterhout tamoyili: modul ishlab chiquvchisi qiyinchilikni o'zi ko'tarishi, uni foydalanuvchilarga o'tkazmasligi kerak. Modulni bir marta yozasiz, lekin uni ko'p marta ishlatishadi. Eng ko'p uchraydigan shakl - **konfiguratsiya parametrlari**. Parametr qo'shish oson ko'rinadi ("foydalanuvchi o'zi tanlasin"), lekin ko'pincha bu muallif qaror qabul qilishdan qochganini anglatadi. Retry soni, timeout, bufer hajmi - bularning ko'pchiligini modul o'zi oqilona belgilay oladi yoki hisoblay oladi.

### Umumiy maqsadli interfeys

Ousterhout matn muharriri misolida `backspace()`, `deleteSelection()` kabi UI'ga xos metodlar o'rniga umumiy `insert(position, text)` va `delete(start, end)` amallarini taklif qiladi. Natija: kamroq metod, har biri ko'proq holatni qamraydi va UI o'zgarganda matn klassi o'zgarmaydi. U buni "somewhat general-purpose" deydi: funksionallik hozirgi ehtiyojni aks ettiradi, lekin interfeys uni maxsus holatlarga bog'lamaydi. Bu YAGNI'ga zid emas: siz hozir kerak bo'lmagan imkoniyat qo'shmayapsiz, faqat hozirgi imkoniyatni sodda shaklda ifodalayapsiz.

## Misol: to'lov provayderini chaqirish

Sayoz variant: chaqiruvchi hamma tafsilotni bilishi kerak.

```ts
export class PaymeClient {
  constructor(private readonly http: HttpClient, private readonly merchantId: string) {}
  buildSignature(body: string, secret: string): string { /* ... */ return ""; }
  async post(path: string, body: string, signature: string): Promise<Response> {
    return this.http.post(path, body, { "X-Auth": `${this.merchantId}:${signature}` });
  }
  parseError(res: Response): PaymeError | null { /* ... */ return null; }
}

// har bir chaqiruvchi:
const body = JSON.stringify({ method: "receipts.create", params: { amount: amountTiyin, account: { order_id: orderId } } });
const sig = client.buildSignature(body, secret);
const res = await client.post("/api", body, sig);
const err = client.parseError(res);
if (err?.code === -31001) { /* retry? */ }
```

Chaqiruvchi so'mni tiyinga o'tkazishni, so'rov formatini, imzoni, xato kodlarini va qaysi xatoda qayta urinishni bilishi kerak. Interfeys deyarli implementatsiyaning o'zi.

Chuqur variant:

```ts
export type Money = { amount: bigint; currency: "UZS" };
export type ChargeResult =
  | { status: "succeeded"; providerTxId: string }
  | { status: "declined"; reason: "insufficient_funds" | "card_blocked" | "unknown" };

export interface PaymentGateway {
  charge(orderId: string, money: Money): Promise<ChargeResult>;
}

export class PaymeGateway implements PaymentGateway {
  constructor(private readonly http: HttpClient, private readonly creds: PaymeCredentials) {}

  async charge(orderId: string, money: Money): Promise<ChargeResult> {
    const body = this.receiptBody(orderId, money); // so'm -> tiyin shu yerda
    const res = await this.sendWithRetry(body);     // imzo, timeout, idempotent retry
    return this.toChargeResult(res);                // provayder kodlari -> domen tili
  }

  private receiptBody(orderId: string, money: Money): string { /* ... */ return ""; }
  private async sendWithRetry(body: string): Promise<Response> { /* ... */ throw new Error("todo"); }
  private toChargeResult(res: Response): ChargeResult { /* ... */ throw new Error("todo"); }
}

type HttpClient = { post(path: string, body: string, headers: Record<string, string>): Promise<Response> };
type PaymeCredentials = { merchantId: string; secret: string };
type PaymeError = { code: number; message: string };
```

Nima o'zgardi:

- **Ommaviy interfeys bitta metod.** Chaqiruvchi faqat buyurtma va summani biladi.
- **Provayder bilimi ichkarida.** Imzo, tiyin, xato kodlari, retry siyosati - hammasi bitta joyda. Click yoki Uzum qo'shilganda chaqiruvchi o'zgarmaydi.
- **Natija domen tilida.** `-31001` kabi kod tashqariga chiqmaydi. Chaqiruvchi `"declined"` holatini bilishi yetarli.
- **Ichki tuzilish saqlangan.** Chuqur modul - bitta 300 qatorli metod degani emas. Ichida uchta private metod bor, ular faqat tashqariga chiqmaydi.

Bu yerda `PaymentGateway` interfeysi foydali, chunki haqiqatan bir nechta provayder bor va testda fake kerak. Bu "har bir klassga interfeys" emas (56 va 57-darslar).

## Qachon qo'llamaslik kerak

- **Chuqurlikni "katta funksiya" uchun bahona qilish.** Chuqurlik interfeys haqida, implementatsiya ichi esa baribir o'qiladigan bo'lishi kerak. 400 qatorli bitta metod chuqur emas, u shunchaki o'qib bo'lmaydi.
- **Turli ehtiyojlarni bitta "umumiy" metodga tiqish.** `execute(command: string, payload: unknown)` interfeysi rasman kichik, lekin norasmiy interfeysi (qaysi buyruq qaysi payload kutadi) ulkan. Bu soxta chuqurlik.
- **Haqiqiy chegaradagi yupqa adapter.** Tashqi SDK'ni o'raydigan yupqa qatlam ba'zan faqat nomlarni o'zgartiradi, lekin u testda almashtirish nuqtasi va vendor bog'liqligini bitta joyga yig'adi (50-dars). Bu holda sayozlik ongli trade-off.
- **Ixtiyoriy kirish nuqtalari.** Ba'zan oddiy default interfeys bilan bir qatorda past darajali interfeys ham kerak (masalan, ekspertlar uchun streaming API). Ousterhout ham oddiy holat oson, murakkab holat esa mumkin bo'lishini tavsiya qiladi.
- **Framework talabi.** NestJS'da controller ko'pincha service'ga deyarli uzatadi. Bu HTTP va domen chegarasi, va controller'da validatsiya, guard va xaritalash bor. Muammo controller emas, uning ortidagi uchinchi va to'rtinchi pass-through qatlam.

## Stack'da: NestJS, React va TypeScript

- **Qatlamlarni sanang.** Controller -> service -> repository yetarli bo'lgan joyda `Facade`, `Manager`, `Handler` qo'shishdan oldin har biri qanday abstraksiya qo'shishini bir jumlada ayting. Ayta olmasangiz, uni olib tashlang.
- **Prisma ustidagi repository.** Har bir Prisma metodini bir xil nom bilan takrorlaydigan `VehicleRepository` sayoz. Repository domen savollariga javob bersa (`findActiveWithOverdueService(fleetId)`), u chuqurlashadi (95-dars).
- **React hook'lari.** `useVehicleTracking(vehicleId)` WebSocket ulanishi, qayta ulanish, buferlash va tozalashni yashirsa - bu chuqur modul. `useState`ni o'raydigan `useValue` esa sayoz.
- **TypeScript tiplari interfeysning bir qismi.** Discriminated union natija (`ChargeResult`) norasmiy interfeysni rasmiyga aylantiradi: chaqiruvchi qaysi holatlarni ko'rib chiqishi kerakligini kompilyator aytadi.
- **Options obyekti.** Ixtiyoriy parametrlarni `options` obyektiga to'plash va har biriga yaxshi default berish konfiguratsiya murakkabligini kamaytiradi. Lekin default bo'lmagan majburiy parametrlar ko'payib ketsa, bu murakkablik pastga tortilmaganini bildiradi.

## Xulosa

- Modul - interfeys (xarajat) va implementatsiya (foyda). Chuqur modul kichik interfeys orqasida ko'p ish qiladi.
- Interfeys faqat signatura emas: xatti-harakat, chaqirish tartibi va cheklovlar ham uning qismi.
- Ko'plab sayoz klasslar (classitis) va pass-through metodlar tizim murakkabligini oshiradi, hatto har bir bo'lak oddiy ko'rinsa ham.
- Murakkablikni pastga torting: modul muallifi qiyinchilikni o'zi hal qilsin, konfiguratsiya parametrlarini kamaytiring.
- Biroz umumiy maqsadli interfeys odatda soddaroq va chuqurroq. Bu kelajak uchun qurish emas, hozirgi ehtiyojni maxsus holatlarsiz ifodalash.
- Martin va Ousterhout bu yerda urg'u bo'yicha farq qiladi. Ikkala xavfni ham biling va loyihangizda qaysi biri haqiqatan uchrayotganiga qarang.
