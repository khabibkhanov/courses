---
n: 75
slug: smells-4
title: "Code smells 4: speculative generality, message chain, middle man"
summary: "Fowler katalogining qolgan smell'lari: Lazy Element, Speculative Generality, Temporary Field, Message Chains, Middle Man, Insider Trading, Alternative Classes with Different Interfaces, Refused Bequest va Comments. Ko'plari bir-biriga qarama-qarshi kuchlar: bilvositalik ham ortiqcha, ham kam bo'lishi mumkin."
duration: 40
sources:
  - id: refactoring
    note: "3-bob \"Bad Smells in Code\": Lazy Element, Speculative Generality, Temporary Field, Message Chains, Middle Man, Insider Trading, Alternative Classes with Different Interfaces, Refused Bequest, Comments"
quiz:
  - q: "`PaymentGateway` interfeysi uchun `AbstractPaymentGatewayFactory`, `PaymentGatewayStrategyResolver` va bitta implementatsiya (`PaymeGateway`) bor. Ikkinchi provayder rejada yo'q. Qaysi smell?"
    options:
      - "Middle Man"
      - "Refused Bequest"
      - "Speculative Generality"
      - "Insider Trading"
    answer: 2
    explain: "\"Bir kun kerak bo'ladi\" deb qurilgan mexanizm, hozir ishlatilmayotgan bo'lsa, Speculative Generality. Davo: Collapse Hierarchy, Inline Class, Inline Function. Agar mexanizmni faqat testlar ishlatsa, bu ham shu smell belgisi."
  - q: "Klassda yarim metodlar faqat boshqa klassga chaqiruvni uzatadi. Qaysi refaktoring?"
    options:
      - "Remove Middle Man: mijozlar to'g'ridan-to'g'ri haqiqiy obyekt bilan ishlasin"
      - "Hide Delegate"
      - "Extract Superclass"
      - "Introduce Special Case"
    answer: 0
    explain: "Bu Middle Man. Hide Delegate - uning teskarisi va Message Chains uchun davo. Ikkala refaktoring bir-biriga qarama-qarshi: qaysi tomonga borish delegatsiya miqdoriga bog'liq."
  - q: "`order.getCustomer().getAddress().getCity().getRegionCode()` - qaysi smell va qaysi birinchi qadam?"
    options:
      - "Data Clumps, Introduce Parameter Object"
      - "Message Chains, Hide Delegate yoki natijani ishlatadigan kodni Extract Function va Move Function bilan zanjir bo'ylab pastga ko'chirish"
      - "Middle Man, Remove Middle Man"
      - "Long Function, Extract Function"
    answer: 1
    explain: "Mijoz navigatsiya tuzilmasiga bog'lanib qolgan: oraliq aloqalardan biri o'zgarsa, mijoz ham o'zgaradi. Kitob Hide Delegate'ni va, ko'pincha yaxshiroq variant sifatida, natija bilan nima qilinishini topib, uni chiqarib, zanjir bo'ylab ko'chirishni tavsiya qiladi."
  - q: "Kitob bo'yicha Refused Bequest qachon kuchli smell?"
    options:
      - "Subklass ota-klassning ba'zi metodlarini ishlatmaganda"
      - "Ota-klassda ikkitadan ko'p subklass bo'lganda"
      - "Subklass maydonlarni override qilganda"
      - "Subklass implementatsiyani qayta ishlatadi, lekin ota-klass interfeysini qo'llab-quvvatlashdan bosh tortganda"
    answer: 3
    explain: "Mualliflar implementatsiyani rad etishni ko'pincha zaif smell deb hisoblaydi. Interfeysni rad etish esa jiddiy: bu LSP buzilishi (55-dars). Bunday holatda ierarxiyani tuzatish emas, Replace Subclass with Delegate yoki Replace Superclass with Delegate bilan merosni olib tashlash kerak."
  - q: "Kitob Comments haqida nima deydi?"
    options:
      - "Kommentlar har doim smell, ularni o'chirish kerak"
      - "Kommentlar o'zi yomon emas, lekin ko'pincha yomon kodni yashiruvchi \"dezodorant\" vazifasini bajaradi; avval refaktoring, keyin komment kerakmi ko'ring"
      - "Har bir funksiyaga komment yozish kerak"
      - "Kommentlar faqat public API uchun kerak"
    answer: 1
    explain: "Mualliflar kommentlarni smell deb atamaydi, balki ular yomon kodni yashirishi mumkinligini aytadi. Nimani bilmasligingiz, nega shunday qilinganini tushuntirish uchun kommentlar foydali (31-32-darslar)."
  - q: "`RouteOptimizer` klassida `tempDistances` va `tempVisited` maydonlari faqat `optimize()` chaqirilganda to'ldiriladi, boshqa paytlarda bo'sh. Qaysi smell va davo?"
    options:
      - "Temporary Field: Extract Class bilan bu maydonlar va ularni ishlatadigan kodni alohida klassga chiqarish"
      - "Large Class: Extract Superclass"
      - "Global Data: Encapsulate Variable"
      - "Lazy Element: Inline Class"
    answer: 0
    explain: "Faqat ba'zi holatlarda qiymatga ega maydonlar Temporary Field. Ularni va ular bilan ishlaydigan kodni (Move Function) alohida klassga chiqarish kerak. Bu ko'pincha Replace Function with Command'ning natijasiga o'xshaydi."
task:
  title: "Ortiqcha bilvositalikni olib tashlash"
  prompt: |
    Quyidagi NestJS kodida haydovchi bildirishnomalari uchun "kelajakka tayyor" arxitektura qurilgan. Faqat bitta kanal (Telegram) bor va boshqa kanal rejada yo'q.

    1. Speculative Generality, Middle Man va Lazy Element smell'larini toping.
    2. Katalogdagi refaktoringlar bilan (Collapse Hierarchy, Inline Class, Inline Function, Remove Middle Man, Change Function Declaration) soddalashtiring.
    3. Message Chains'ni toping va tuzating.
    4. Telegram bilan haqiqiy chegara (test uchun almashtirish nuqtasi) saqlanib qolsin.
  lang: ts
  starter: |
    interface TelegramApi {
      sendMessage(chatId: string, text: string): Promise<void>;
    }

    type Driver = { id: string; profile: { contacts: { telegram: { chatId: string } } } };

    abstract class BaseNotifier {
      abstract send(target: string, text: string, priority?: number): Promise<void>;
    }

    class TelegramNotifier extends BaseNotifier {
      constructor(private readonly api: TelegramApi) { super(); }
      async send(target: string, text: string): Promise<void> {
        await this.api.sendMessage(target, text);
      }
    }

    class NotifierFactory {
      constructor(private readonly telegram: TelegramNotifier) {}
      create(channel: "telegram"): BaseNotifier {
        return this.telegram;
      }
    }

    class NotificationFacade {
      constructor(private readonly factory: NotifierFactory) {}
      notify(target: string, text: string): Promise<void> {
        return this.factory.create("telegram").send(target, text);
      }
    }

    export class DriverAlertsService {
      constructor(private readonly notifications: NotificationFacade) {}
      async alertSpeeding(driver: Driver, speedKmh: number): Promise<void> {
        const chatId = driver.profile.contacts.telegram.chatId;
        await this.notifications.notify(chatId, `Tezlik: ${speedKmh} km/soat`);
      }
    }
  solution: |
    export interface TelegramApi {
      sendMessage(chatId: string, text: string): Promise<void>;
    }

    type TelegramContact = { chatId: string };

    export class Driver {
      constructor(
        readonly id: string,
        private readonly profile: { contacts: { telegram: TelegramContact } },
      ) {}

      // Hide Delegate: mijoz profil ichki tuzilmasini bilmaydi
      get telegramChatId(): string {
        return this.profile.contacts.telegram.chatId;
      }
    }

    export class DriverAlertsService {
      constructor(private readonly telegram: TelegramApi) {}

      async alertSpeeding(driver: Driver, speedKmh: number): Promise<void> {
        await this.telegram.sendMessage(driver.telegramChatId, `Tezlik: ${speedKmh} km/soat`);
      }
    }
  solutionNotes: |
    - **Speculative Generality**: `BaseNotifier` (bitta subklass) - Collapse Hierarchy. `priority?` parametri hech qayerda ishlatilmaydi - Change Function Declaration bilan olib tashlandi. `NotifierFactory.create(channel)` doim bir xil obyekt qaytaradi.
    - **Middle Man**: `NotificationFacade` faqat chaqiruvni uzatadi - Remove Middle Man. `NotifierFactory` ham shunday - Inline Class.
    - **Lazy Element**: `TelegramNotifier.send` faqat `api.sendMessage` ni qayta aytadi - Inline Class, servis to'g'ridan-to'g'ri `TelegramApi` ga bog'landi.
    - **Message Chains**: `driver.profile.contacts.telegram.chatId` - Hide Delegate bilan `driver.telegramChatId`. Profil tuzilmasi o'zgarsa, faqat `Driver` o'zgaradi.
    - Chegara saqlandi: `TelegramApi` interfeysi tashqi tizim bilan haqiqiy seam. Testda uni fake bilan almashtirish mumkin. Biz o'chirgan qatlamlar seam emas edi, ular faqat bilvositalik edi.
    - Ikkinchi kanal haqiqatan kelganda, kerakli abstraksiya (`Notifier` interfeysi) 10 daqiqada qaytariladi, va u haqiqiy ikki implementatsiya asosida to'g'ri shaklda bo'ladi.
  checklist:
    - "Bitta implementatsiyali abstrakt klass va factory qolmadi"
    - "Faqat uzatuvchi klass (Middle Man) olib tashlandi"
    - "Ishlatilmaydigan parametr olib tashlandi"
    - "Servis Driver ichki tuzilmasini bilmaydi"
    - "Tashqi tizim (TelegramApi) bilan test uchun almashtiriladigan chegara saqlandi"
---

## Muammo

Ikki xil kod bazasini tasavvur qiling. Birinchisida hamma narsa bir-biri bilan to'g'ridan-to'g'ri gaplashadi: controller `order.customer.address.city.region.code` ni o'qiydi, servislar bir-birining ichki maydonlarini o'zgartiradi, subklass ota-klassning yarim metodlarini `throw new Error("not supported")` bilan bekor qiladi. Har bir o'zgarish kutilmagan joyda nimanidir buzadi.

Ikkinchisida esa teskarisi: har bir chaqiruv uch-to'rt qatlam orqali o'tadi. `Facade` `Manager` ni, u `Factory` ni, u `Strategy` ni chaqiradi, va oxirida bitta qatorli funksiya ishlaydi. Har bir interfeysning bitta implementatsiyasi bor. "Bu kod aslida nima qiladi?" degan savolga javob berish uchun oltita faylni ochish kerak.

Ikkala kod bazasi ham o'zgartirish qiyin. Birinchisida bilvositalik juda kam, ikkinchisida juda ko'p. Bu darsdagi smell'larning qiziq xususiyati shundaki, ular ko'pincha juft bo'lib keladi va bir-biriga qarama-qarshi davolarga ega.

## Asosiy g'oya

Bu darsda Fowler va Beck katalogining qolgan to'qqizta smell'ini ko'ramiz. Ularni uch guruhga bo'lish mumkin.

**Ortiqcha element va bilvositalik:**

- **Lazy Element** - o'z mavjudligini oqlamaydigan funksiya yoki klass.
- **Speculative Generality** - "bir kun kerak bo'ladi" deb qo'shilgan, lekin ishlatilmaydigan mexanizm.
- **Middle Man** - asosan boshqa obyektga chaqiruvni uzatadigan klass.

**Ortiqcha bog'liqlik:**

- **Message Chains** - mijoz obyektlar zanjiri bo'ylab navigatsiya qiladi.
- **Insider Trading** - modullar bir-birining ichki ma'lumotini yashirincha almashadi.
- **Refused Bequest** - subklass meros qilib olingan narsalarni ishlatmaydi yoki rad etadi.

**Noto'g'ri shakl:**

- **Temporary Field** - faqat ba'zi holatlarda qiymatga ega maydon.
- **Alternative Classes with Different Interfaces** - bir xil ishni qiladigan, lekin bir-birini almashtira olmaydigan klasslar.
- **Comments** - yomon kodni yashiruvchi kommentlar.

Bular bilan 72-74-darslarda ko'rganlarimiz qo'shilib, kitobning 2-nashridagi 24 ta smell'ning hammasi qamrab olinadi.

## Chuqurroq: to'qqizta smell

### Lazy Element

Biz kodga tuzilma qo'shish uchun funksiya va klasslardan foydalanamiz. Lekin ba'zan bu tuzilma kerak emas: nomi tanasini so'zma-so'z takrorlaydigan funksiya yoki bitta oddiy funksiyadan iborat klass. Ba'zan bu element kelajakda o'sishi kutilgan, lekin o'smagan. Ba'zan esa avval foydali bo'lgan, lekin refaktoring natijasida qisqarib qolgan. Mualliflar bunday elementlar haqida ular "obro' bilan o'lishi" kerakligini aytadi.

Refaktoringlar: **Inline Function**, **Inline Class**, meros bo'lsa **Collapse Hierarchy**.

1-nashrda bu smell "Lazy Class" deb atalgan edi. 2-nashrdagi umumiyroq nom funksiyalarni ham qamrab oladi.

### Speculative Generality

Bu smell nomini Brian Footega nisbat berishadi. U dasturchi "menimcha, bir kun bu narsa kerak bo'ladi" deb, hozir kerak bo'lmagan ilgaklar va maxsus holatlarni qo'shganda paydo bo'ladi. Natijada kodni tushunish va saqlash qiyinlashadi. Agar bu mexanizm ishlatilsa, u o'zini oqlaydi. Ishlatilmasa - u shunchaki to'siq.

Refaktoringlar:

- Ko'p ish qilmaydigan abstrakt klasslar - **Collapse Hierarchy**.
- Keraksiz delegatsiya - **Inline Function** va **Inline Class**.
- Ishlatilmaydigan parametrli funksiyalar - **Change Function Declaration** bilan parametrni olib tashlash.
- Faqat testlar ishlatadigan kod - test bilan birga **Remove Dead Code**.

Oxirgi belgi juda amaliy: agar funksiya yoki klassni faqat test ishlatsa, ehtimol u Speculative Generality. Bu smell 9-darsdagi YAGNI tamoyilining kod darajasidagi ko'rinishi.

### Temporary Field

Klassda faqat ma'lum holatlarda qiymat oladigan maydon bor. Bunday kodni tushunish qiyin, chunki obyektdan barcha maydonlari kerak bo'lishini kutasiz. Maydon nima uchun mavjudligini, nega u bo'sh ekanini tushunishga urinish chalkashlikka olib keladi.

Refaktoringlar: **Extract Class** bilan "yetim" maydonlar uchun uy yaratish, keyin **Move Function** bilan ularga tegishli kodni yangi klassga ko'chirish. Agar shartli kod maydonlar yaroqsiz holatni tekshirish uchun bo'lsa, **Introduce Special Case** bilan yaroqsiz holat uchun muqobil klass yaratish mumkin.

TypeScript'da bu smell ko'pincha ixtiyoriy maydonlar ko'rinishida chiqadi: `cancelReason?: string`, `cancelledAt?: Date` faqat `status === "cancelled"` bo'lganda mavjud. Bu yerda discriminated union (`{ status: "cancelled"; reason: string; at: Date } | { status: "active" }`) eng tabiiy davo (45-dars).

### Message Chains

Mijoz bir obyektdan boshqasini so'raydi, undan yana boshqasini va hokazo. Bu uzun getter zanjiri yoki vaqtinchalik o'zgaruvchilar ketma-ketligi sifatida ko'rinadi. Kitobning aniq ta'kidi: shunday navigatsiya qilish mijozni navigatsiya tuzilmasiga bog'laydi. Oraliq aloqalardan birida o'zgarish bo'lsa, mijoz ham o'zgarishi kerak.

Refaktoringlar:

- **Hide Delegate** - zanjirning turli nuqtalarida. Lekin ehtiyot bo'ling: buni har bir oraliq obyektga qo'llasangiz, ularning har biri Middle Man'ga aylanadi.
- Ko'pincha yaxshiroq yo'l: olingan obyekt nima uchun ishlatilishini ko'ring. Uni ishlatadigan kodni **Extract Function** bilan chiqarib, **Move Function** bilan zanjir bo'ylab pastga suring.

Bu Demeter qonuni (42-dars) bilan bog'liq, lekin mualliflar zanjirlarni avtomatik ravishda yomon deb hisoblamaydi. Fluent API va ma'lumot transformatsiyasi (`trips.filter(...).map(...)`) zanjir, lekin ular struktura bo'ylab navigatsiya emas.

### Middle Man

Inkapsulyatsiya obyektlarning asosiy xususiyatlaridan biri va u ko'pincha delegatsiya bilan birga keladi. Lekin bu haddan oshishi mumkin. Agar klass interfeysining yarmi boshqa klassga uzatish bo'lsa, bu Middle Man. Mualliflarning tavsiyasi: **Remove Middle Man** bilan mijozlar haqiqatan nima bo'layotganini biladigan obyekt bilan to'g'ridan-to'g'ri gaplashsin.

Boshqa refaktoringlar: faqat bir nechta metod kam ish qilsa - **Inline Function**. Agar oraliq obyektda qo'shimcha xatti-harakat bo'lsa - **Replace Superclass with Delegate** yoki **Replace Subclass with Delegate** bilan uni haqiqiy obyektga birlashtirish.

Message Chains va Middle Man - klassik qarama-qarshi kuchlar. Hide Delegate va Remove Middle Man katalogda bir-birining teskarisi. To'g'ri nuqta tizimga qarab o'zgaradi va kitob ham buni ochiq aytadi: bu yerda bitta to'g'ri javob yo'q, faqat muvozanat.

### Insider Trading

2-nashrda yangi nom (1-nashrda "Inappropriate Intimacy" deb atalgan edi). Dasturchilar modullar o'rtasida qalin devorlar bo'lishini yoqtiradi va modullar orasidagi ma'lumot almashinuvi coupling'ni oshirishidan shikoyat qiladi. Ba'zi almashinuv muqarrar, lekin uni minimal va ochiq qilish kerak.

Refaktoringlar:

- Bir-biri bilan "pichirlashadigan" modullar - **Move Function** va **Move Field** bilan ularni ajratish.
- Umumiy qiziqishlar bo'lsa - uchinchi modul yaratish yoki **Hide Delegate** bilan boshqa modulni vositachi qilish.
- Meros ko'pincha til biriktirishga olib keladi: subklasslar ota-klass ularga ruxsat bergandan ko'proq narsani biladi. Ota-klassdan chiqish vaqti kelganda - **Replace Subclass with Delegate** yoki **Replace Superclass with Delegate**.

### Alternative Classes with Different Interfaces

Klasslardan foydalanishning katta afzalligi - ularni almashtirish imkoniyati. Lekin bu faqat interfeyslar bir xil bo'lganda ishlaydi. Agar ikki klass bir xil ishni qilsa, lekin metodlari turlicha atalsa (`sendSms(phone, text)` va `deliver(message)`), ularni almashtirish mumkin emas.

Refaktoringlar: **Change Function Declaration** bilan metodlarni moslashtirish, **Move Function** bilan xatti-harakatni klasslarga ko'chirish (protokollar mos kelguncha). Bu takror keltirib chiqarsa - **Extract Superclass**. TypeScript'da ko'pincha umumiy `interface` va structural typing yetarli.

### Refused Bequest

Subklasslar ota-klassning metod va ma'lumotlarini meros qilib oladi. Lekin ba'zan ular berilganlarning faqat bir qismini ishlatadi. An'anaviy talqin: ierarxiya noto'g'ri. Yangi aka-uka klass yaratib, **Push Down Method** va **Push Down Field** bilan ishlatilmagan kodni unga ko'chirish kerak.

Lekin mualliflar bu maslahatni har doim bermaydi. Ular ochiq aytadi: ko'pincha bu smell tozalashga arzimaydigan darajada zaif, va implementatsiyani qayta ishlatish uchun subklass yaratish keng tarqalgan va ko'pincha oqilona amaliyot.

Smell kuchli bo'ladigan holat: subklass implementatsiyani qayta ishlatadi, lekin ota-klass **interfeysini** qo'llab-quvvatlashdan bosh tortadi. Implementatsiyani rad etish bilan muammo yo'q, interfeysni rad etish esa jiddiy. Bunday holatda ierarxiya bilan o'ynamang, merosni olib tashlang: **Replace Subclass with Delegate** yoki **Replace Superclass with Delegate**. Bu LSP buzilishi (55-dars) va "kompozitsiya merosdan ustun" (58-dars) bilan to'g'ridan-to'g'ri bog'liq.

### Comments

Mualliflar kommentlarni smell deb atamaydi va ularni yozishni to'xtatish kerakligini aytmaydi. Ular kommentlarni xushbo'y hid deb ataydi, lekin ular ko'pincha "dezodorant" sifatida ishlatilishini qayd etadi: qalin komment yomon kod uchun yozilgan. Ko'p hollarda kodni refaktoring qilgandan keyin komment ortiqcha bo'lib qoladi.

Refaktoringlar:

- Kod bloki nima qilishini tushuntirish kerak bo'lsa - **Extract Function**.
- Funksiya allaqachon chiqarilgan, lekin hali ham komment kerak - **Change Function Declaration** bilan nomini o'zgartirish.
- Tizimning talab qilinadigan holati haqida qoida aytish kerak bo'lsa - **Introduce Assertion**.

Kommentlar qachon foydali: nima qilayotganingizni bilmasangiz, yoki nega biror ishni qilganingizni tushuntirish uchun. Bu 31-33-darslardagi Martin va Ousterhout bahsi bilan mos keladi.

## Misol: Message Chains va Middle Man muvozanati

Ijara platformasida e'lon egasining tumani bo'yicha komissiya hisoblanadi:

```ts
type Region = { code: string; commissionRate: number };
type Address = { city: string; region: Region };
type Owner = { id: string; address: Address };
type Listing = { id: string; priceTiyin: number; owner: Owner };

export function commissionFor(listing: Listing): number {
  const rate = listing.owner.address.region.commissionRate;
  return Math.round(listing.priceTiyin * rate);
}
```

Message Chain: `commissionFor` to'rt darajali tuzilmani biladi. Agar komissiya tumanga emas, egasining tarifiga bog'lansa, bu funksiya o'zgaradi.

Birinchi urinish - har bir darajada Hide Delegate:

```ts
class Owner {
  constructor(readonly id: string, private readonly address: Address) {}
  get commissionRate(): number {
    return this.address.region.commissionRate;
  }
}

class Listing {
  constructor(readonly id: string, readonly priceTiyin: number, private readonly owner: Owner) {}
  get ownerCommissionRate(): number {
    return this.owner.commissionRate;
  }
}
```

Zanjir yashirildi, lekin endi `Listing` va `Owner` da "faqat uzatuvchi" getter'lar paydo bo'ldi. Bu yo'nalishda davom etsak, ular Middle Man'ga aylanadi.

Yaxshiroq yo'l - kitob tavsiyasi: natija bilan nima qilinishini ko'ring va bu xatti-harakatni ko'chiring. Komissiya - e'lonning xususiyati, demak hisobni `Listing` ga ko'chiramiz (Move Function), stavka manbasini esa bitta joyda yashiramiz:

```ts
class Listing {
  constructor(
    readonly id: string,
    readonly priceTiyin: number,
    private readonly owner: Owner,
  ) {}

  commission(): number {
    return Math.round(this.priceTiyin * this.owner.commissionRate);
  }
}
```

Endi mijoz `listing.commission()` ni chaqiradi va ichki tuzilmani bilmaydi. Stavka manbasi o'zgarsa, faqat `Owner.commissionRate` o'zgaradi. Bitta delegatsiya getter qoldi, lekin u ma'noli: "egasining stavkasi" domen tushunchasi.

## Qachon qo'llamaslik kerak

- **Haqiqiy chegaralar.** Tashqi tizim (to'lov provayderi, SMS shlyuzi, Telegram API) atrofidagi interfeys bitta implementatsiya bilan ham Speculative Generality emas: u test uchun seam (79-dars) va tashqi dependency'ni izolyatsiya qiladi (50-dars). Farq shundaki, u haqiqiy o'zgarish yoki test ehtiyojini qondiradi.
- **Kutubxona va framework kodi.** Agar siz npm paket yozsangiz, kengaytirish nuqtalari "spekulyativ" emas: foydalanuvchilaringiz ularga muhtoj. Speculative Generality asosan ilova kodiga tegishli.
- **Arxitektura qatlamlari.** Clean Architecture'da use case qatlami ba'zan Middle Man'ga o'xshaydi (`GetOrderUseCase` faqat `repository.findById` ni chaqiradi). Agar jamoa qatlamlarni izchil saqlashni tanlagan bo'lsa, ba'zi oddiy use case'larning yupqa bo'lishi qabul qilinadigan narx. Lekin bu kelishuv bo'lishi kerak, avtomatik odat emas (90-dars).
- **Refused Bequest'ni ko'r-ko'rona tuzatish.** Kitobning o'zi aytadi: ko'p holatda bu smell tozalashga arzimaydi. Faqat chalkashlik yoki xato keltirsa harakat qiling.
- **Hide Delegate'ni hamma joyda qo'llash.** Har bir zanjirni yashirish Middle Man'lar to'plamini yaratadi. Ma'lumot strukturalari (DTO, konfiguratsiya obyektlari) bo'ylab navigatsiya ko'pincha muammo emas: ular ataylab ochiq tuzilma (41-dars).

## Stack'da: NestJS va React

- **NestJS'da Speculative Generality.** Har bir servis uchun `IOrderService` interfeysi va DI token yaratish, faqat bitta implementatsiya va hech qanday almashtirish bo'lmasa, ko'pincha ortiqcha. NestJS klasslarni o'zi token sifatida ishlatadi va testda `overrideProvider` bilan almashtirish mumkin. Interfeys + token faqat haqiqiy port (tashqi tizim, bir nechta implementatsiya) uchun.
- **NestJS'da Middle Man.** Controller faqat `return this.service.method(dto)` qilsa, bu Middle Man emas: controller HTTP chegarasi (validatsiya, status kod, autentifikatsiya). Lekin servis faqat repository'ni chaqirib qaytarsa va hech qanday qoida qo'shmasa, bu qatlam savolini ko'taradi.
- **React'da Message Chains.** `props.user.company.settings.theme.primaryColor` - komponent butun ma'lumot daraxtini biladi. Kerakli qiymatni yuqorida hisoblab, faqat `primaryColor` ni uzating yoki context selektorini ishlating.
- **Prop drilling Middle Man sifatida.** Oraliq komponentlar faqat props'ni pastga uzatsa, bu Middle Man'ning React ko'rinishi. Davolar: kompozitsiya (`children`), context yoki komponent strukturasini qayta ko'rish.

## Xulosa

- Lazy Element va Speculative Generality: o'zini oqlamaydigan yoki ishlatilmaydigan tuzilma. Inline Function, Inline Class, Collapse Hierarchy va Remove Dead Code bilan olib tashlang.
- Message Chains va Middle Man qarama-qarshi kuchlar: Hide Delegate va Remove Middle Man o'rtasidagi muvozanatni toping. Ko'pincha eng yaxshi davo - xatti-harakatni zanjir bo'ylab ko'chirish.
- Insider Trading va Refused Bequest - ortiqcha bog'liqlik. Interfeysni rad etish implementatsiyani rad etishdan ancha jiddiy.
- Temporary Field - Extract Class yoki TypeScript'da discriminated union bilan davolanadi.
- Comments smell emas, lekin ko'pincha yomon kod uchun dezodorant. Avval refaktoring, keyin komment kerakligini baholang.
