---
n: 29
slug: toza-async
title: "Toza asinxron kod: async/await, parallellik, bekor qilish"
summary: "Asinxron kodning eng qimmat xatolari sintaksisda emas: keraksiz ketma-ketlik, unutilgan await, jimgina yutilgan rejection, bekor qilinmaydigan so'rovlar va React'dagi race condition'lar. Promise.all, allSettled, AbortController va AbortSignal bilan toza naqshlar."
duration: 40
sources:
  - id: mdn-abortcontroller
    note: "AbortController va AbortSignal: abort(), signal.aborted, signal.reason, throwIfAborted, AbortSignal.timeout va AbortSignal.any; AbortError va TimeoutError farqi"
  - id: effective-ts
    note: "Asinxron kod bo'limlari: callback o'rniga async funksiyalar va Promise'lardan foydalanish, asinxron funksiyalar tiplari"
  - id: cc2
    note: "Qayta yozilgan nashrdagi funksiyalar va side effect'lar haqidagi tamoyillarning asinxron kodga qo'llanishi (umumiy tayanch)"
quiz:
  - q: "Quyidagi kodning asosiy muammosi nima?\n\n```ts\nconst user = await users.find(id);\nconst vehicles = await fleet.listVehicles(companyId);\nconst tariffs = await billing.tariffs();\n```"
    options:
      - "await faqat try/catch ichida ishlatilishi kerak"
      - "Uchta so'rov bir-biriga bog'liq bo'lmasa ham ketma-ket bajariladi, umumiy vaqt ularning yig'indisi bo'ladi"
      - "const o'rniga let ishlatish kerak"
      - "Kodda xato yo'q"
    answer: 1
    explain: "Agar so'rovlar bir-birining natijasiga bog'liq bo'lmasa, ularni Promise.all bilan parallel boshlash umumiy vaqtni eng sekin so'rov vaqtiga tushiradi. Ketma-ket await - eng ko'p uchraydigan yashirin sekinlik."
  - q: "Dashboard 5 ta widget uchun ma'lumot oladi. Bitta widget servisi ishlamasa, qolganlari baribir ko'rsatilishi kerak. Qaysi kombinator mos?"
    options:
      - "Promise.all"
      - "Promise.race"
      - "Promise.any"
      - "Promise.allSettled"
    answer: 3
    explain: "allSettled har bir promise natijasini (fulfilled yoki rejected) qaytaradi va bitta xato boshqalarini bekor qilmaydi. Promise.all birinchi xatoda reject qiladi, any birinchi muvaffaqiyatni, race birinchi tugaganini qaytaradi."
  - q: "`Promise.all` bitta promise reject bo'lganda qolgan operatsiyalar bilan nima bo'ladi?"
    options:
      - "Ular avtomatik bekor qilinadi"
      - "Ular davom etadi; Promise.all faqat natijani kutishni to'xtatadi, operatsiyalarni bekor qilish uchun AbortSignal kerak"
      - "Ular qayta boshlanadi"
      - "Node.js jarayoni to'xtaydi"
    answer: 1
    explain: "Promise - natijaning ifodasi, operatsiyaning boshqaruvi emas. Promise.all reject bo'lgandan keyin ham boshqa HTTP so'rovlar va DB so'rovlari davom etadi. Ularni to'xtatish uchun umumiy AbortController signalini uzatish va xatoda abort() chaqirish kerak."
  - q: "`fetch(url, { signal: AbortSignal.timeout(5000) })` 5 soniyada tugamasa, promise qanday xato bilan reject bo'ladi?"
    options:
      - "`TimeoutError` nomli DOMException"
      - "`AbortError` nomli DOMException"
      - "`TypeError`"
      - "Promise hech qachon reject bo'lmaydi"
    answer: 0
    explain: "MDN'ga ko'ra AbortSignal.timeout ishlaganda fetch TimeoutError bilan, qo'lda abort() chaqirilganda esa AbortError bilan reject qiladi. Bu farq foydalanuvchi bekor qilganini va vaqt tugaganini ajratish imkonini beradi."
  - q: "React'da `useEffect` ichida qidiruv natijalarini yuklashda race condition qanday paydo bo'ladi va uni qanday tuzatish mumkin?"
    options:
      - "useEffect sinxron, race condition bo'lmaydi"
      - "Faqat useMemo bilan tuzatiladi"
      - "Eski so'rov yangisidan keyin javob qaytarib, eskirgan natijani state'ga yozadi; cleanup'da AbortController.abort() chaqirib eski so'rovni bekor qilish kerak"
      - "async funksiyani to'g'ridan-to'g'ri useEffect'ga uzatish kerak"
    answer: 2
    explain: "Foydalanuvchi tez yozganda 'ab' so'rovi 'abc' so'rovidan keyin qaytishi mumkin. Cleanup'da abort qilish eski so'rovni to'xtatadi va uning natijasi state'ga tushmaydi. useEffect'ga async funksiyani to'g'ridan-to'g'ri uzatib bo'lmaydi, chunki u cleanup emas, Promise qaytaradi."
  - q: "Node.js servisida quyidagi qator qanday xavf tug'diradi: `audit.log(event); return result;` (bu yerda audit.log async)?"
    options:
      - "Hech qanday, chunki log muhim emas"
      - "Kompilyatsiya xatosi"
      - "Log ikki marta yoziladi"
      - "Promise kutilmaydi (floating promise): rejection hech qayerda ushlanmaydi va unhandled rejection sifatida jarayonni to'xtatishi mumkin"
    answer: 3
    explain: "Kutilmagan promise'ning xatosi jim yo'qoladi yoki unhandled rejection bo'ladi; zamonaviy Node versiyalarida bu sukut bo'yicha jarayonni to'xtatadi. Agar ataylab kutilmasa, `void` va `.catch()` bilan aniq belgilash kerak; typescript-eslint'ning no-floating-promises qoidasi buni topadi."
task:
  title: "Telemetriya agregatorini parallel va bekor qilinadigan qilish"
  prompt: |
    Quyidagi funksiya bir nechta mashina uchun oxirgi GPS nuqta va yoqilg'i darajasini oladi. U ketma-ket ishlaydi (50 mashinada 100 ta ketma-ket so'rov), bitta mashina xatosi butun javobni buzadi, so'rovlarni bekor qilib bo'lmaydi va bitta `log` promise'i kutilmaydi.

    1. Har bir mashina uchun ikkita so'rovni parallel qiling, mashinalarni ham parallel qiling.
    2. Bitta mashinaning xatosi boshqalarini buzmasin: natijada har bir mashina uchun muvaffaqiyat yoki xato bo'lsin.
    3. Funksiya tashqi `AbortSignal` qabul qilsin va umumiy timeout'ga ega bo'lsin; signal barcha so'rovlarga uzatilsin.
    4. Floating promise'ni tuzating.
  lang: ts
  starter: |
    type Position = { lat: number; lng: number; at: string };
    type FuelLevel = { liters: number; at: string };
    type VehicleSnapshot = { vehicleId: string; position: Position; fuel: FuelLevel };

    async function getJson<T>(url: string): Promise<T> {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return (await res.json()) as T;
    }

    async function log(message: string): Promise<void> {
      await fetch("https://logs.internal/ingest", { method: "POST", body: message });
    }

    export async function loadSnapshots(baseUrl: string, vehicleIds: string[]): Promise<VehicleSnapshot[]> {
      const result: VehicleSnapshot[] = [];
      for (const id of vehicleIds) {
        const position = await getJson<Position>(`${baseUrl}/vehicles/${id}/position`);
        const fuel = await getJson<FuelLevel>(`${baseUrl}/vehicles/${id}/fuel`);
        result.push({ vehicleId: id, position, fuel });
      }
      log(`loaded ${result.length} snapshots`);
      return result;
    }
  solution: |
    type Position = { lat: number; lng: number; at: string };
    type FuelLevel = { liters: number; at: string };
    type VehicleSnapshot = { vehicleId: string; position: Position; fuel: FuelLevel };

    export type SnapshotResult =
      | { vehicleId: string; ok: true; snapshot: VehicleSnapshot }
      | { vehicleId: string; ok: false; error: string };

    const DEFAULT_TIMEOUT_MS = 8_000;

    async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return (await res.json()) as T;
    }

    async function log(message: string): Promise<void> {
      await fetch("https://logs.internal/ingest", { method: "POST", body: message });
    }

    async function loadSnapshot(baseUrl: string, vehicleId: string, signal: AbortSignal): Promise<VehicleSnapshot> {
      const [position, fuel] = await Promise.all([
        getJson<Position>(`${baseUrl}/vehicles/${vehicleId}/position`, signal),
        getJson<FuelLevel>(`${baseUrl}/vehicles/${vehicleId}/fuel`, signal),
      ]);
      return { vehicleId, position, fuel };
    }

    export async function loadSnapshots(
      baseUrl: string,
      vehicleIds: readonly string[],
      options: { signal?: AbortSignal; timeoutMs?: number } = {},
    ): Promise<SnapshotResult[]> {
      const timeout = AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
      const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;

      const settled = await Promise.allSettled(vehicleIds.map((id) => loadSnapshot(baseUrl, id, signal)));

      const results = settled.map((s, i): SnapshotResult =>
        s.status === "fulfilled"
          ? { vehicleId: vehicleIds[i], ok: true, snapshot: s.value }
          : { vehicleId: vehicleIds[i], ok: false, error: s.reason instanceof Error ? s.reason.message : String(s.reason) },
      );

      const failed = results.filter((r) => !r.ok).length;
      // Log asosiy javobni kutdirmasin, lekin xatosi yo'qolmasin.
      void log(`loaded ${results.length - failed}/${results.length} snapshots`).catch(() => undefined);

      return results;
    }
  solutionNotes: |
    - Bitta mashina ichida ikki so'rov `Promise.all` bilan parallel: ikkalasi ham kerak, biri yo'q bo'lsa snapshot ma'nosiz.
    - Mashinalar orasida `Promise.allSettled`: bitta mashina xatosi boshqalarini yo'qotmaydi. Natija discriminated union, chaqiruvchi har bir mashinani alohida ko'radi.
    - `AbortSignal.timeout` va `AbortSignal.any` bilan umumiy muddat va tashqi bekor qilish bitta signalga birlashdi. MDN eslatganidek, `any` bilan birlashtirilganda yakuniy abort timeout'danmi yoki tashqaridanmi ekanini signal o'zi aytmaydi; kerak bo'lsa `options.signal.aborted` ni alohida tekshiring.
    - `AbortSignal.any` Node.js 20+ va zamonaviy brauzerlarda mavjud. Eski muhitda qo'lda AbortController va listener'lar bilan birlashtiriladi.
    - Floating promise `void ... .catch()` bilan ongli "fire-and-forget"ga aylandi.
    - 50 mashina uchun 100 ta parallel so'rov API'ni ortiqcha yuklashi mumkin. Real tizimda concurrency limit (masalan, p-limit yoki 10 talik bo'laklar) qo'shish kerak; bu yerda u soddalik uchun tushirib qoldirildi.
  checklist:
    - "Bog'liq bo'lmagan so'rovlar parallel boshlanadi"
    - "Bitta element xatosi butun natijani buzmaydi va xato yo'qolmaydi"
    - "Barcha fetch chaqiruvlari bir xil signalni oladi"
    - "Umumiy timeout bor va tashqi bekor qilish ishlaydi"
    - "Kodda kutilmagan va catch'siz promise qolmadi"
    - "Parallellik darajasi tashqi servis uchun xavfsizligi o'ylab ko'rildi"
---

## Muammo

`async`/`await` asinxron kodni sinxron kodga o'xshatib qo'ydi va bu uning kuchi ham, xavfi ham. Kod o'qilishi oson, lekin uning xatti-harakati ko'rinmaydi: qaysi so'rovlar parallel, qaysilari ketma-ket, xato bo'lsa qolgan operatsiyalar to'xtaydimi, foydalanuvchi sahifani tark etsa so'rov davom etadimi. Bular kodda yozilmagan, ular `await` qayerga qo'yilgani va qaysi Promise'lar e'tibordan chetda qolganiga bog'liq.

Odatiy simptomlar: dashboard 4 soniyada yuklanadi, chunki 8 ta mustaqil so'rov ketma-ket ketadi. Bitta mikroservis yiqilganda butun sahifa bo'sh qoladi. Qidiruv maydonida tez yozilsa, eski natija yangisini ustidan yozadi. Node.js jarayoni "unhandled rejection" bilan to'xtaydi, chunki kimdir audit log chaqiruvini `await` qilishni unutgan. Foydalanuvchi eksportni bekor qiladi, lekin server 2 daqiqa davomida og'ir so'rovni bajarishda davom etadi.

## Asosiy g'oya

Toza asinxron kod uchta savolga kodning o'zida javob beradi:

1. **Tartib.** Qaysi operatsiyalar bir-biriga bog'liq (ketma-ket bo'lishi shart) va qaysilari mustaqil (parallel bo'lishi mumkin)?
2. **Xato siyosati.** Bitta operatsiya xatosi qolganlarga qanday ta'sir qiladi: hammasini bekor qiladimi, e'tiborsiz qoldiriladimi, alohida qayd qilinadimi?
3. **Hayot sikli.** Operatsiyani kim va qachon to'xtata oladi: foydalanuvchi, timeout, yuqori darajadagi so'rov?

Birinchi ikkisiga Promise kombinatorlari javob beradi, uchinchisiga AbortController.

Vanderkam *Effective TypeScript*da callback'lar o'rniga Promise va `async` funksiyalardan foydalanishni tavsiya qiladi: ular tiplar bilan yaxshiroq ishlaydi va kompozitsiya qilinadi. Yana bir muhim tavsiyasi: funksiya yo har doim sinxron, yo har doim asinxron bo'lsin. Ba'zan keshdan sinxron, ba'zan tarmoqdan asinxron qaytaradigan funksiya chaqiruvchida kutilmagan tartib xatolarini keltirib chiqaradi. `async` funksiya har doim Promise qaytaradi, demak bu muammo o'z-o'zidan hal bo'ladi.

## Chuqurroq: kombinatorlar va bekor qilish

### To'rtta kombinator va ularning xato siyosati

- **`Promise.all`** - hammasi kerak. Birinchi rejection'da darhol reject qiladi. Snapshot uchun pozitsiya va yoqilg'i ikkalasi kerak bo'lsa mos.
- **`Promise.allSettled`** - hammasining natijasi kerak, xatolar ham. Har biri uchun `{ status: "fulfilled", value }` yoki `{ status: "rejected", reason }` qaytaradi. Dashboard widget'lari, ommaviy bildirishnomalar, bir nechta mashinani yangilash.
- **`Promise.any`** - bittasi yetarli. Birinchi muvaffaqiyatni qaytaradi, hammasi xato bo'lsa `AggregateError`. Bir nechta zaxira manbadan (mirror, replika) o'qish.
- **`Promise.race`** - birinchi tugagani, muvaffaqiyat yoki xato. Ilgari timeout uchun ko'p ishlatilgan, lekin bu operatsiyani to'xtatmaydi; bugun `AbortSignal.timeout` yaxshiroq.

Kombinatorni tanlash - xato siyosatini e'lon qilish. Kodni o'qigan odam `allSettled`ni ko'rib, "bu yerda qisman muvaffaqiyat normal" ekanini darhol tushunadi.

### Promise bekor qilmaydi

Muhim nozik joy: Promise - kelajakdagi natijaning ifodasi, operatsiyaning boshqaruv tugmasi emas. `Promise.all` reject qilgandan keyin boshqa so'rovlar davom etadi, `Promise.race` timeout'ni "yutgandan" keyin ham asl so'rov server va tarmoq resurslarini ishlatishda davom etadi. Operatsiyani haqiqatan to'xtatish uchun unga signal uzatish kerak.

### AbortController va AbortSignal

MDN'ga ko'ra `AbortController` - bitta yoki bir nechta asinxron operatsiyani bekor qilish uchun obyekt. Uning `signal` xususiyati `AbortSignal` bo'lib, operatsiyaga uzatiladi; `abort()` chaqirilganda signal bekor holatiga o'tadi. `fetch` bunday holda `AbortError` nomli `DOMException` bilan reject qiladi. Asosiy imkoniyatlar:

- **`signal.aborted`** va **`signal.reason`** - signal holati va sababi.
- **`signal.throwIfAborted()`** - signal bekor bo'lgan bo'lsa, sababni tashlaydi. Uzoq sikllarda yoki qadamlar orasida tekshirish uchun qulay.
- **`AbortSignal.timeout(ms)`** - belgilangan vaqtdan keyin avtomatik bekor bo'ladigan signal. Bunda `fetch` `TimeoutError` bilan reject qiladi, bu foydalanuvchi bekor qilganini vaqt tugaganidan ajratish imkonini beradi.
- **`AbortSignal.any([a, b])`** - berilgan signallardan istalgani bekor bo'lganda bekor bo'ladigan signal. MDN'ga ko'ra, birlashgan signalning `reason`i birinchi bekor bo'lgan signalning sababi bo'ladi, shuning uchun `TimeoutError` va `AbortError`ni xato nomi orqali ajratish mumkin.

Signal bir martalik: bekor bo'lgandan keyin u shu holatda qoladi, shuning uchun har bir operatsiya (yoki har bir React effekt ishga tushishi) uchun yangi controller yaratiladi. Node.js'da `AbortController` global va `fetch`, `fs/promises`, `timers/promises`, `child_process` kabi ko'p API signal qabul qiladi; ko'plab DB drayverlari va HTTP klientlar ham buni qo'llab-quvvatlaydi.

**Toza API qoidasi:** uzoq davom etishi mumkin bo'lgan har bir asinxron funksiya ixtiyoriy `signal` qabul qilsin va uni o'zi chaqiradigan barcha asinxron operatsiyalarga uzatsin. Bu `context.Context` g'oyasining JS versiyasi.

### Floating promise'lar

`await`siz chaqirilgan async funksiya xatosi hech qayerda ushlanmaydi. Zamonaviy Node.js versiyalarida unhandled rejection sukut bo'yicha jarayonni to'xtatadi. Agar natijani kutmaslik ongli qaror bo'lsa (fire-and-forget), buni ochiq ko'rsating: `void promise.catch(handleError)`. `typescript-eslint`ning `no-floating-promises` va `no-misused-promises` qoidalari bunday holatlarni avtomatik topadi (37-dars).

## Misol: buyurtma sahifasi uchun ma'lumot

Ketma-ket, bekor qilinmaydigan va xatoga chidamsiz kod:

```ts
type Order = { id: string; customerId: string; vehicleId: string };
type Customer = { id: string; name: string };
type VehicleInfo = { id: string; plate: string };
type Recommendations = { items: string[] };

declare function getJson<T>(url: string, signal?: AbortSignal): Promise<T>;

export async function loadOrderPage(orderId: string) {
  const order = await getJson<Order>(`/api/orders/${orderId}`);
  const customer = await getJson<Customer>(`/api/customers/${order.customerId}`);
  const vehicle = await getJson<VehicleInfo>(`/api/vehicles/${order.vehicleId}`);
  const recs = await getJson<Recommendations>(`/api/recommendations?order=${orderId}`);
  return { order, customer, vehicle, recs };
}
```

Bu yerda haqiqiy bog'liqlik bitta: mijoz va mashina buyurtmaga bog'liq. Tavsiyalar hech narsaga bog'liq emas va ixtiyoriy. Qayta yozilgan:

```ts run
type OrderPage = {
  order: Order;
  customer: Customer;
  vehicle: VehicleInfo;
  recommendations: Recommendations | null;
};

export async function loadOrderPage(orderId: string, signal?: AbortSignal): Promise<OrderPage> {
  // Ixtiyoriy ma'lumot darhol, asosiy oqim bilan parallel boshlanadi.
  const recommendationsPromise = getJson<Recommendations>(`/api/recommendations?order=${orderId}`, signal)
    .catch(() => null);

  const order = await getJson<Order>(`/api/orders/${orderId}`, signal);

  const [customer, vehicle, recommendations] = await Promise.all([
    getJson<Customer>(`/api/customers/${order.customerId}`, signal),
    getJson<VehicleInfo>(`/api/vehicles/${order.vehicleId}`, signal),
    recommendationsPromise,
  ]);

  return { order, customer, vehicle, recommendations };
}

// Sinab ko'ring: getJson o'rniga har so'rovi 300 ms davom etadigan soxta API.
// Tavsiyalar servisi ishlamayapti, sahifa baribir yuklanadi.
const FAKE_API: Record<string, unknown> = {
  orders: { id: "o1", customerId: "c1", vehicleId: "v1" },
  customers: { id: "c1", name: "Aziz" },
  vehicles: { id: "v1", plate: "01A123BC" },
};
async function getJson<T>(url: string, _signal?: AbortSignal): Promise<T> {
  const resource = url.split("/")[2].split("?")[0];
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (!(resource in FAKE_API)) throw new Error(`503: ${url}`);
  return FAKE_API[resource] as T;
}
const startedAt = Date.now();
console.log(JSON.stringify(await loadOrderPage("o1")));
console.log(`~${Math.round((Date.now() - startedAt) / 100) * 100} ms (ketma-ket bo'lsa ~1200 ms)`);
```

Nima o'zgardi:

- **Bog'liqlik kodda ko'rinadi.** Bitta `await` (buyurtma), keyin bitta `Promise.all` (unga bog'liq ikkitasi). Umumiy vaqt to'rtta yig'indidan ikkita eng sekin bosqichga tushdi.
- **Ixtiyoriy ma'lumot xato siyosatini o'zi e'lon qiladi.** `.catch(() => null)` va tipdagi `| null` - tavsiyalar ishlamasa sahifa baribir chiqadi.
- **Bekor qilish uzatiladi.** Foydalanuvchi sahifadan chiqsa, barcha to'rtta so'rov to'xtaydi.
- **Nozik joy:** `recommendationsPromise` `await order`dan oldin boshlanadi. Agar `order` so'rovi xato bersa, tavsiyalar promise'i kutilmay qoladi, lekin unda `.catch` bor, demak unhandled rejection bo'lmaydi. `.catch`siz bu naqsh xavfli bo'lardi.

## Qachon qo'llamaslik kerak

- **Cheksiz parallellik.** 10 000 elementli massivga `Promise.all(items.map(fetch))` tashqi API'ni, DB connection pool'ni yoki o'z serveringizni bo'g'ib qo'yadi. Concurrency limit (bo'laklar, navbat yoki p-limit kabi kutubxona) kerak. Ba'zan oddiy ketma-ket `for...of` va `await` eng to'g'ri tanlov: masalan, tashqi API rate limit'i qat'iy bo'lsa yoki tartib muhim bo'lsa.
- **Tranzaksiya ichida parallellik.** Bitta DB tranzaksiyasi bitta ulanishda bajariladi; uning ichidagi so'rovlarni `Promise.all` bilan parallel qilish tezlik bermaydi va ba'zi drayverlarda xatoga olib keladi. Ketma-ket qoldiring.
- **Har bir funksiyaga signal qo'shish.** Tez, lokal operatsiyalar (xotiradagi hisob, bitta indeksli DB so'rovi) uchun signal parametri shovqin. Uni tashqi chaqiruvlar, uzoq ishlar va foydalanuvchi bekor qila oladigan operatsiyalarga qo'shing.
- **allSettled bilan xatolarni yutish.** `allSettled` natijasidagi rejected elementlarni e'tiborsiz qoldirsangiz, bu jim xato yutishning boshqa ko'rinishi. Xatolarni hech bo'lmasa log qiling yoki chaqiruvchiga qaytaring.
- **Abort'ni xato sifatida log qilish.** Foydalanuvchi bekor qilgan so'rov xato emas. `AbortError`ni alohida ishlang, aks holda monitoring shovqinga to'ladi.

## Stack'da: React, Next.js, NestJS

- **React `useEffect`.** Effekt ichida `const controller = new AbortController()` yarating, `fetch`ga `controller.signal`ni uzating va cleanup'da `controller.abort()` chaqiring. Bu race condition'ni ham (eski so'rov yangisini ustidan yozishi), ham unmount'dan keyin state yangilashni hal qiladi. `catch`da `AbortError`ni e'tiborsiz qoldiring. Ko'p hollarda esa TanStack Query kabi kutubxona yoki Next.js server komponentlari bu naqshni o'zi bajaradi (92-dars).
- **Next.js server komponentlari.** Bir nechta mustaqil ma'lumot manbasi bo'lsa, ularni bitta komponentda ketma-ket `await` qilish "waterfall" yaratadi. `Promise.all` bilan parallel boshlang yoki ma'lumotni `Suspense` bilan o'ralgan alohida komponentlarga bo'ling.
- **NestJS va Node.js.** Uzoq ishlaydigan endpoint'larda (eksport, hisobot) mijoz ulanishni uzganda ishni to'xtatish uchun so'rov yopilishini kuzatib, `AbortController.abort()` chaqiring va signalni service qatlamiga uzating. Tashqi HTTP chaqiruvlarga har doim timeout qo'ying: `AbortSignal.timeout(ms)` eng qisqa yo'l.
- **Graceful shutdown.** Jarayon `SIGTERM` olganda umumiy controller'ni abort qilish barcha davom etayotgan ishlarni tartibli to'xtatishga yordam beradi.

## Xulosa

- Asinxron kodda tartib, xato siyosati va hayot sikli kodning o'zida ko'rinsin.
- Mustaqil operatsiyalarni parallel boshlang: ketma-ket `await` eng ko'p uchraydigan yashirin sekinlik.
- Kombinator - xato siyosati: `all` hammasi kerak, `allSettled` qisman muvaffaqiyat normal, `any` bittasi yetarli.
- Promise operatsiyani bekor qilmaydi. Uzoq operatsiyalarga `AbortSignal` uzating; `AbortSignal.timeout` va `AbortSignal.any` timeout va tashqi bekor qilishni birlashtiradi.
- Floating promise'lardan qoching: `await` qiling yoki `void` va `.catch` bilan ongli belgilang, lint qoidasini yoqing.
