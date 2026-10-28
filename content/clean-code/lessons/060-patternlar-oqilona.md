---
n: 60
slug: patternlar-oqilona
title: "Dizayn patternlari: qachon kerak, qachon ortiqcha"
summary: "Dizayn patternlari - takrorlanadigan muammolarga nomlangan yechimlar va jamoa uchun umumiy lug'at. Lekin ular maqsad emas. Bu darsda GoF patternlarining asl g'oyasini, ularni oldindan qo'llash xavfini, refaktoring orqali patternga kelishni va Strategy, Adapter, Decorator'ning TypeScript'dagi idiomatik shakllarini ko'ramiz."
duration: 40
sources:
  - id: gof
    note: "1-bob: pattern ta'rifi (nom, muammo, yechim, oqibatlar), patternlarni tanlash va qayta loyihalash sabablari; Strategy, Adapter, Decorator, Factory Method tavsiflari; yakuniy bob: patternlar refaktoring uchun maqsad sifatida"
  - id: refactoring
    note: "Refaktoring yo'nalishi: patternlarni oldindan emas, kod talab qilganda kiritish; Replace Conditional with Polymorphism, Replace Constructor with Factory Function"
  - id: fowler-yagni
    note: "Presumptive feature'lar narxi va kelajak moslashuvchanligi uchun qo'shilgan abstraksiyalarga shubha"
  - id: effective-ts
    note: "TypeScript'da funksiya tiplari, strukturaviy tiplash va union'lar: klasssiz patternlar uchun asos (umumiy ma'noda)"
quiz:
  - q: "GoF bo'yicha pattern tavsifining to'rt asosiy elementi qaysi?"
    options:
      - "Klass, interfeys, metod, maydon"
      - "Nom, muammo, yechim, oqibatlar (trade-off'lar)"
      - "Diagramma, kod, test, hujjat"
      - "Kirish, chiqish, xato, log"
    answer: 1
    explain: "GoF patternni nom, u hal qiladigan muammo, yechim (aniq kod emas, shablon) va oqibatlar bilan tavsiflaydi. Oqibatlar qismi ko'pincha unutiladi, lekin u patternni qachon qo'llamaslik kerakligini aytadi."
  - q: "TypeScript'da Strategy pattern'ining eng idiomatik shakli ko'pincha qaysi?"
    options:
      - "Abstrakt `Strategy` klassi va har bir algoritm uchun voris klass"
      - "Singleton factory"
      - "Funksiya tipi yoki funksiyalar obyekti: `type PricingRule = (order: Order) => Money`"
      - "Global o'zgaruvchi"
    answer: 2
    explain: "Funksiyalar birinchi darajali qiymat bo'lgan tillarda holatsiz strategiya - bu shunchaki funksiya. Klass kerak bo'ladi, agar strategiya holat yoki bir nechta bog'liq metodga ega bo'lsa."
  - q: "Jamoa yangi loyihaning birinchi haftasida `NotificationFactory`, `NotificationStrategy`, `AbstractNotificationHandler` va `NotificationObserver` yaratdi. Hozircha bitta email bildirishnomasi bor. Fowler'ning YAGNI maqolasi nuqtai nazaridan bu qanday baholanadi?"
    options:
      - "To'g'ri, chunki patternlar har doim yaxshi"
      - "To'g'ri, chunki keyin o'zgartirish qimmat bo'ladi"
      - "Faqat Observer ortiqcha"
      - "Bu presumptive moslashuvchanlik: qurish va olib yurish narxi bor, va abstraksiyalar haqiqiy kelajakdagi talabga mos kelmasligi mumkin"
    answer: 3
    explain: "Fowler kelajak uchun qurilgan imkoniyatlar va abstraksiyalarning narxini sanaydi va hozirgi kodni tushunishni qiyinlashtiradigan abstraksiyani shubhali deb biladi. Bitta email uchun to'rt qatlam - aynan shunday holat."
  - q: "Adapter va Decorator orasidagi asosiy farq nima?"
    options:
      - "Adapter interfeysni o'zgartiradi (bir shartnomani boshqasiga moslaydi); Decorator interfeysni saqlab, xatti-harakat qo'shadi"
      - "Ular bir xil"
      - "Adapter faqat klasslar uchun, Decorator faqat funksiyalar uchun"
      - "Decorator interfeysni o'zgartiradi, Adapter saqlaydi"
    answer: 0
    explain: "GoF ta'rifida Adapter mos kelmaydigan interfeyslarni birga ishlashga imkon beradi. Decorator esa obyektga dinamik ravishda qo'shimcha mas'uliyat beradi va chaqiruvchi uchun bir xil interfeysni saqlaydi."
  - q: "Patternni kiritishning eng ishonchli vaqti qachon?"
    options:
      - "Loyiha boshida, arxitektura rejasida"
      - "Kod haqiqatan og'riq bera boshlaganda: takrorlanuvchi switch, o'sib borayotgan if zanjiri, ikkinchi yoki uchinchi implementatsiya paydo bo'lganda, refaktoring orqali"
      - "Code review'da reviewer so'raganda"
      - "Hech qachon, patternlar eskirgan"
    answer: 1
    explain: "GoF o'zi ham patternlarni refaktoring uchun maqsad sifatida tavsiflaydi. Kod talab qilganda pattern tomon refaktoring qilish noto'g'ri bashoratga asoslangan oldindan dizayndan arzonroq va aniqroq."
  - q: "NestJS'dagi interceptor (`LoggingInterceptor`) qaysi pattern g'oyasiga eng yaqin?"
    options:
      - "Singleton"
      - "Abstract Factory"
      - "Decorator (yoki chain of responsibility): asosiy handler'ni o'zgartirmasdan uning atrofiga xatti-harakat qo'shadi"
      - "Adapter"
    answer: 2
    explain: "Interceptor handler chaqiruvidan oldin va keyin kod bajaradi va natijani o'zgartirishi mumkin, handler esa bundan bexabar. Bu Decorator g'oyasi. TypeScript'ning `@Injectable()` kabi sintaktik dekoratorlari esa boshqa narsa: ular metadata qo'shadi."
task:
  title: "Haddan tashqari pattern'li kodni soddalashtirish va kerakli joyda Decorator qo'llash"
  prompt: |
    Quyidagi kod GPS treker provayderidan joylashuvni oladi. U "arxitektura qoidalariga" ko'ra yozilgan: factory, strategy, abstrakt klass. Lekin provayder bitta, factory hech narsa tanlamaydi va strategiya almashtirilmaydi.

    Shu bilan birga, real talab bor: provayder API'si ba'zan sekin ishlaydi, shuning uchun **natijani 10 soniya keshlash** va **har bir chaqiruvni timing bilan loglash** kerak.

    1. Keraksiz pattern qatlamlarini olib tashlang.
    2. Kesh va loglashni asosiy kodni o'zgartirmasdan qo'shing (Decorator g'oyasi, TypeScript idiomi bilan).
    3. Kesh va log'ni bir-biridan mustaqil yoqish/o'chirish mumkin bo'lsin.
    4. Vaqtni testlash uchun tashqaridan bering.
  lang: ts
  starter: |
    type Position = { lat: number; lon: number; at: Date };

    interface IPositionStrategy {
      fetch(deviceId: string): Promise<Position>;
    }

    abstract class AbstractPositionProvider implements IPositionStrategy {
      abstract fetch(deviceId: string): Promise<Position>;
    }

    class WialonPositionProvider extends AbstractPositionProvider {
      constructor(private readonly baseUrl: string, private readonly token: string) { super(); }
      async fetch(deviceId: string): Promise<Position> {
        const res = await fetch(`${this.baseUrl}/units/${deviceId}/position`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        const json = (await res.json()) as { lat: number; lon: number; ts: number };
        return { lat: json.lat, lon: json.lon, at: new Date(json.ts * 1000) };
      }
    }

    class PositionProviderFactory {
      static create(): IPositionStrategy {
        return new WialonPositionProvider(process.env.WIALON_URL!, process.env.WIALON_TOKEN!);
      }
    }

    export class PositionService {
      private readonly strategy: IPositionStrategy = PositionProviderFactory.create();
      getPosition(deviceId: string): Promise<Position> {
        return this.strategy.fetch(deviceId);
      }
    }
  solution: |
    export type Position = { lat: number; lon: number; at: Date };

    /** Bitta qurilmaning joriy joylashuvini qaytaradi. */
    export type FetchPosition = (deviceId: string) => Promise<Position>;

    export function wialonPositions(config: { baseUrl: string; token: string }): FetchPosition {
      return async (deviceId) => {
        const res = await fetch(`${config.baseUrl}/units/${deviceId}/position`, {
          headers: { Authorization: `Bearer ${config.token}` },
        });
        if (!res.ok) throw new Error(`Wialon position request failed: ${res.status}`);
        const json = (await res.json()) as { lat: number; lon: number; ts: number };
        return { lat: json.lat, lon: json.lon, at: new Date(json.ts * 1000) };
      };
    }

    // --- Decorator'lar: bir xil tipni oladi va qaytaradi ---

    export function withCache(inner: FetchPosition, ttlMs: number, now: () => number = Date.now): FetchPosition {
      const cache = new Map<string, { value: Position; expiresAt: number }>();
      return async (deviceId) => {
        const hit = cache.get(deviceId);
        if (hit && hit.expiresAt > now()) return hit.value;
        const value = await inner(deviceId);
        cache.set(deviceId, { value, expiresAt: now() + ttlMs });
        return value;
      };
    }

    type Logger = { info(fields: Record<string, unknown>, msg: string): void };

    export function withTiming(inner: FetchPosition, logger: Logger, now: () => number = Date.now): FetchPosition {
      return async (deviceId) => {
        const started = now();
        try {
          return await inner(deviceId);
        } finally {
          logger.info({ deviceId, durationMs: now() - started }, "position fetched");
        }
      };
    }

    // --- Composition root: konkret narsalar faqat shu yerda ---
    // const getPosition = withTiming(
    //   withCache(wialonPositions({ baseUrl: config.wialonUrl, token: config.wialonToken }), 10_000),
    //   logger,
    // );
  solutionNotes: |
    - `IPositionStrategy`, `AbstractPositionProvider` va `PositionProviderFactory` olib tashlandi: bitta implementatsiya, hech narsa tanlanmaydi va almashtirilmaydi. Ular faqat o'qishni qiyinlashtirardi. `PositionService` ham pass-through edi.
    - Shartnoma endi bitta funksiya tipi `FetchPosition`. TypeScript'da holatsiz strategiya va adapter uchun bu yetarli.
    - `withCache` va `withTiming` - Decorator'ning funksional shakli: bir xil tipni oladi va qaytaradi, shuning uchun ular istalgan tartibda birlashtiriladi va asosiy kod o'zgarmaydi. Tartib muhim: yuqoridagi variantda kesh urilishi ham loglanadi.
    - `process.env!` composition root'ga ko'chdi: provayder konfiguratsiyani parametr sifatida oladi. Ikkinchi provayder paydo bo'lsa, faqat composition root'da tanlov qo'shiladi, factory klass kerak emas.
    - `now` parametri kesh muddatini va timing'ni testlash imkonini beradi.
    - Javob statusini tekshirish qo'shildi: bu xatti-harakat o'zgarishi, uni alohida qayd qiling.
  checklist:
    - "Faqat bitta implementatsiyaga xizmat qilgan abstraksiya qatlamlari olib tashlangan"
    - "Kesh va log asosiy provayder kodini o'zgartirmasdan qo'shilgan"
    - "Decorator'lar bir xil tipni oladi va qaytaradi, mustaqil birlashtiriladi"
    - "Konfiguratsiya va konkret tanlov bitta composition root'da"
    - "Vaqtga bog'liq xatti-harakat testlanadigan"
---

## Muammo

Ikki xil kod bazani tasavvur qiling. Birinchisida har bir yangi talab `if` zanjirini uzaytiradi: to'lov usullari, yetkazib berish turlari, bildirishnoma kanallari. `switch (provider)` o'nta faylda takrorlanadi va har bir yangi provayder hammasini o'zgartirishni talab qiladi. Bu yerda jamoaga Strategy yoki Adapter haqida bilish yetishmaydi.

Ikkinchisida esa oddiy CRUD endpoint uchun `UserControllerFactory`, `UserServiceStrategy`, `AbstractUserRepositoryDecorator` va `UserEventObserver` bor. Har bir patternning implementatsiyasi bitta. Yangi dasturchi bitta maydon qo'shish uchun yettita faylni o'zgartiradi va "nega" degan savolga javob - "bu best practice".

Ikkalasi ham kasallik, faqat turli tomonga. Dizayn patternlarini bilish birinchisini davolaydi. Ularni qachon qo'llamaslikni bilish ikkinchisining oldini oladi.

## Asosiy g'oya

Gamma, Helm, Johnson va Vlissides 1994-yilda *Design Patterns: Elements of Reusable Object-Oriented Software* kitobida 23 ta patternni katalog qilishgan. Ular g'oyani arxitektor Christopher Alexander'dan olishgan: pattern - bu muhitda qayta-qayta uchraydigan muammo va uning yechimining yadrosi, uni har safar boshqacha qo'llash mumkin.

GoF har bir patternni to'rt element bilan tavsiflaydi:

1. **Nom** - muammo va yechimni bir-ikki so'z bilan ifodalaydigan lug'at. Bu patternlarning eng kam baholanadigan foydasi: "bu yerda Adapter kerak" degan jumla code review'da besh daqiqalik tushuntirishni almashtiradi.
2. **Muammo** - patternni qachon qo'llash kerak va qanday kontekstda.
3. **Yechim** - elementlar, ularning munosabatlari va mas'uliyatlari. Aniq kod emas, shablon.
4. **Oqibatlar** - natijalar va trade-off'lar. Bu qism patternni qo'llashning narxini aytadi va eng ko'p unutiladigan qism.

GoF kitobining kirish qismi patternlardan ko'ra muhimroq bo'lishi mumkin: unda ikki tamoyil bor (interfeysga dasturlash va kompozitsiyani merosdan afzal ko'rish, 58-dars) va qayta loyihalashning keng tarqalgan sabablari sanaladi: aniq klass nomi bilan obyekt yaratish, aniq operatsiyalarga bog'liqlik, platformaga bog'liqlik, algoritmlarga bog'liqlik, kuchli bog'lanish, merosga haddan tashqari tayanish. Har bir pattern shu sabablardan biriga qarshi vosita.

## Chuqurroq: pattern'ning to'g'ri o'rni

### Patternlar - maqsad emas, yo'nalish

Eng keng tarqalgan xato - patternlarni oldindan loyihaning bir qismi sifatida rejalashtirish. GoF o'zi ham kitob oxirida patternlarni **refaktoring uchun maqsad** sifatida tilga oladi: dizayn evolyutsiya qilganda, patternlar uni qayerga olib borishni ko'rsatadi.

Martin Fowler *Refactoring*da shu yo'nalishni amaliy qiladi. Uning katalogidagi bir qator refaktoringlar to'g'ridan-to'g'ri patternlarga olib boradi: **Replace Conditional with Polymorphism** (Strategy yoki State), **Replace Constructor with Factory Function** (Factory), **Replace Subclass with Delegate** (Strategy/State delegatsiya bilan). Lekin Fowler bu refaktoringlarni kod og'riq bera boshlaganda qilishni tavsiya qiladi: takrorlanuvchi `switch`, o'sib borayotgan shartli mantiq, ikkinchi implementatsiyaning paydo bo'lishi.

### Oldindan qo'llash narxi

Fowler YAGNI maqolasida kelajak uchun qurilgan imkoniyatlarning to'rt xil narxini sanaydi: qurish, kechikish, olib yurish va tuzatish (54-dars). Patternlar bu narxlarning hammasiga ega. Eng og'irroq - **olib yurish narxi**: har bir qatlam har bir o'qishda va har bir o'zgarishda o'quvchidan e'tibor talab qiladi. Fowler kelajak moslashuvchanligi uchun qo'shilgan va hozirgi kodni tushunishni qiyinlashtiradigan abstraksiyani shubhali deb biladi.

Yana bir xavf - **noto'g'ri o'q**. Siz to'lov provayderlari ko'payadi deb Strategy qurdingiz, lekin biznes valyutalar va to'lov rejalarini o'zgartirdi. Endi abstraksiya haqiqiy o'zgarishga xalaqit beradi (8-darsdagi noto'g'ri abstraksiya).

### Til patternlarni o'zgartiradi

GoF patternlari 1990-yillarning C++ va Smalltalk muhitida yozilgan. GoF o'zi ham til tanlovi qaysi patternlar kerakligiga ta'sir qilishini kirish qismida eslatadi. Funksiyalar birinchi darajali qiymat, strukturaviy tiplar va modullar bo'lgan tillarda ko'plab patternlar soddalashadi yoki ko'rinmas bo'lib qoladi. Bu kuzatuv dinamik va funksional tillar jamoalarida 1990-yillardan beri muhokama qilinadi.

TypeScript'da bu juda amaliy:

- **Strategy** - ko'pincha shunchaki funksiya: `type PricingRule = (order: Order) => bigint`.
- **Command** - funksiya yoki ma'lumot obyekti (`{ type: "cancel_order", orderId }`) va uni bajaradigan handler.
- **Factory** - oddiy funksiya, `new`siz.
- **Singleton** - ES modul o'zi bir marta yuklanadi va keshlanadi. Modul darajasidagi `export const` ko'pincha yetarli. NestJS provider'lari esa default singleton.
- **Iterator** - til darajasida (`for...of`, generatorlar).
- **Observer** - `EventEmitter`, `EventTarget`, RxJS.
- **Visitor** - discriminated union va exhaustive `switch` ko'pincha soddaroq (27-dars).

Bu patternlar "eskirgan" degani emas. Muammo va g'oya saqlanadi, faqat ularning shakli tilga moslashadi.

### Strategy, Adapter, Decorator: GoF g'oyasi va TS shakli

**Strategy** - algoritmlar oilasini aniqlash, har birini inkapsulyatsiya qilish va ularni almashtiriladigan qilish. GoF oqibatlarda ham narxni aytadi: mijoz strategiyalar farqini bilishi kerak bo'lishi mumkin, obyektlar soni oshadi. TS'da holatsiz strategiya - funksiya; holat yoki bir nechta bog'liq metod bo'lsa - obyekt yoki klass.

**Adapter** - klass interfeysini mijoz kutgan boshqa interfeysga aylantirish. Bu tashqi SDK'lar bilan ishlashning asosiy vositasi (50-dars) va hexagonal arxitekturadagi adapterlar ham shu g'oya (82-dars). TS'da adapter ko'pincha port tipini qaytaradigan funksiya yoki klass.

**Decorator** - obyektga dinamik ravishda qo'shimcha mas'uliyat berish, meros o'rniga. Decorator o'ralgan obyekt bilan bir xil interfeysga ega, shuning uchun ularni zanjir qilish mumkin. TS'da funksional shakli: `(inner: F) => F`. Ehtiyot bo'ling: TypeScript'ning `@Decorator` sintaksisi (NestJS'dagi `@Injectable()`, `@Get()`) - bu metadata va klass/metodni o'zgartirish mexanizmi, GoF Decorator pattern'i emas. Ular nom bilan o'xshash, lekin boshqa tushunchalar.

Ousterhout'ning ogohlantirishini ham eslang (52-dars): dekoratorlar pass-through metodlarga moyil. Ko'p metodli interfeysni o'rash uchun har bir metodni takrorlash kerak va ularning ko'pchiligi shunchaki uzatadi. Bitta funksiya tipidagi shartnoma bu muammoni deyarli yo'qotadi.

## Misol: if zanjiridan Strategy'ga

Boshlang'ich kod: yetkazib berish narxi.

```ts
type Order = { totalUzs: number; weightKg: number; city: string; express: boolean };

export function deliveryFeeUzs(order: Order, method: "courier" | "pickup" | "post"): number {
  if (method === "pickup") return 0;
  if (method === "courier") {
    if (order.totalUzs >= 500_000) return 0;
    return order.city === "Tashkent" ? 20_000 : 45_000;
  }
  return 15_000 + Math.ceil(order.weightKg) * 3_000;
}
```

Hozir bu yaxshi. Uchta usul, hammasi bitta joyda va ko'rinib turadi. Pattern kerak emas.

Olti oydan keyin: yettita usul, har biri o'z qoidalari bilan, ikkitasi tashqi API chaqiradi (Yandex Delivery, BTS) va hamkor kompaniyalar o'z usullarini qo'shishi kerak. Endi o'zgarish o'qi isbotlangan va Strategy o'zini oqlaydi:

```ts run
export type Order = { totalUzs: number; weightKg: number; city: string };

export type DeliveryMethod = {
  id: string;
  label: string;
  quoteUzs(order: Order): Promise<number>;
};

export const pickup: DeliveryMethod = {
  id: "pickup",
  label: "Do'kondan olib ketish",
  quoteUzs: async () => 0,
};

const FREE_COURIER_FROM_UZS = 500_000;

export const courier: DeliveryMethod = {
  id: "courier",
  label: "Kuryer",
  quoteUzs: async (o) => (o.totalUzs >= FREE_COURIER_FROM_UZS ? 0 : o.city === "Tashkent" ? 20_000 : 45_000),
};

// Adapter: tashqi API'ni bizning shartnomaga moslaydi
export function btsDelivery(client: { tariff(kg: number, city: string): Promise<{ price: number }> }): DeliveryMethod {
  return {
    id: "bts",
    label: "BTS pochta",
    quoteUzs: async (o) => (await client.tariff(o.weightKg, o.city)).price,
  };
}

export async function deliveryQuotes(order: Order, methods: readonly DeliveryMethod[]) {
  return Promise.all(methods.map(async (m) => ({ id: m.id, label: m.label, feeUzs: await m.quoteUzs(order) })));
}

// Sinab ko'ring: buyurtma summasi, og'irligi yoki shaharni o'zgartiring.
const fakeBts = { tariff: async (kg: number, _city: string) => ({ price: 15_000 + Math.ceil(kg) * 3_000 }) };
const order: Order = { totalUzs: 320_000, weightKg: 2.4, city: "Samarqand" };
console.log(await deliveryQuotes(order, [pickup, courier, btsDelivery(fakeBts)]));
```

Nima o'zgardi va nega:

- **Strategy klasssiz.** Har bir usul obyekt literali. Holatsiz usullar uchun klass, abstrakt bazaviy klass yoki factory kerak emas.
- **Adapter bitta funksiya.** BTS client'ining shakli bizning `DeliveryMethod`ga moslashtirildi. Chaqiruvchi BTS haqida hech narsa bilmaydi.
- **Ro'yxat tashqaridan beriladi.** Hamkor usulini qo'shish - massivga bitta element (54-dars OCP).
- **Interfeys `async`.** Ba'zi usullar tarmoqqa chiqadi. Shartnomani eng murakkab real holatga moslash kerak edi, aks holda keyinroq barcha chaqiruvchilar o'zgarardi.

Muhim: bu kodga biz birinchi kunda emas, uchinchi-to'rtinchi usul paydo bo'lganda refaktoring orqali keldik.

## Qachon qo'llamaslik kerak

- **Bitta implementatsiya va o'zgarish kutilmaydi.** Strategy, Factory yoki Abstract Factory faqat almashtirish bo'lganda ma'noga ega.
- **Pattern nomi uchun.** `UserServiceFactoryImpl` kabi nomlar ko'pincha pattern kod talabi emas, uslub talabi sifatida kiritilganini ko'rsatadi. Nom domen tilida bo'lsin (17-dars), pattern nomi esa faqat foydali bo'lganda.
- **Til buni allaqachon qiladi.** Singleton uchun modul, Iterator uchun generator, Observer uchun `EventEmitter`. Ularni qo'lda qayta yozish shovqin.
- **Pattern muammoni yashiradi.** Observer/event bus bilan bog'lanishni "kamaytirish" ko'pincha uni ko'rinmas qiladi (51-dars). Agar ikki modul baribir bir-birining ichki tafsilotlarini bilishi kerak bo'lsa, to'g'ridan-to'g'ri chaqiruv aniqroq.
- **Oqibatlar o'qilmagan.** Har bir patternning GoF'dagi "Consequences" qismida narx yozilgan. Agar bu narxni nomlay olmasangiz, patternni ishlatishga hali tayyor emassiz.
- **Erta bosqich va noaniq domen.** Avval oddiy kod, keyin takrorlanish va og'riq, keyin refaktoring orqali pattern. Bu tartib teskari bo'lsa, noto'g'ri o'q bo'ylab abstraksiya qurish ehtimoli yuqori.

## Stack'da: NestJS, React va TypeScript

- **NestJS patternlarni allaqachon beradi.** DI konteyneri - Factory va Singleton vazifasini bajaradi. Interceptor - Decorator g'oyasi. Guard va pipe - chain of responsibility'ga yaqin. Exception filter - xatolarni markazlashgan qayta ishlash. Bu mexanizmlar ustidan o'z patternlaringizni qurishdan oldin, framework'dagi mavjudini ishlating.
- **NestJS'da Strategy.** Bir nechta implementatsiya bo'lganda: token ostida massiv (`useFactory` bilan) yoki `Map<string, Provider>` va tanlash runtime'da. Bitta implementatsiya bo'lsa - shunchaki klass.
- **React patternlari.** Higher-order component - Decorator'ning React shakli, lekin hook'lar ko'pincha soddaroq. Render prop va `children` - Strategy va Template Method'ning komponent shakli. Context - DI'ning yengil shakli.
- **TypeScript dekoratorlari bilan adashtirmang.** `@Injectable()`, `@Controller()` - til xususiyati, GoF Decorator emas. Lekin metod dekoratori (masalan, `@Cacheable()`) GoF g'oyasini sintaktik tarzda amalga oshirishi mumkin. Bunday "sehrli" dekoratorlarni o'z kodingizda ehtiyotkorlik bilan ishlating: xatti-harakat chaqiruv joyida ko'rinmaydi.
- **Funksional kompozitsiya.** `withRetry(withTimeout(withLogging(fetchPosition)))` - bir xil funksiya tipi ustidagi decorator'lar zanjiri. Tartib muhim va uni bitta composition root'da yozing.

## Xulosa

- Pattern - takrorlanadigan muammoga nomlangan yechim: nom, muammo, yechim va oqibatlar. Nom jamoa uchun umumiy lug'at sifatida eng katta foyda beradi.
- Patternlar maqsad emas, refaktoring yo'nalishi. Ularni kod og'riq bera boshlaganda, o'zgarish o'qi isbotlanganda kiriting.
- Oldindan qo'llangan pattern YAGNI narxlariga ega: qurish, kechikish, olib yurish va noto'g'ri o'q xavfi.
- Til patternlarni o'zgartiradi. TypeScript'da Strategy ko'pincha funksiya, Singleton - modul, Factory - funksiya, Visitor - discriminated union.
- Adapter interfeysni moslaydi, Decorator interfeysni saqlab xatti-harakat qo'shadi. TypeScript'ning `@` dekoratorlari boshqa tushuncha.
- Har bir patternning narxini (GoF'dagi oqibatlar) nomlay olsangizgina uni qo'llang.
