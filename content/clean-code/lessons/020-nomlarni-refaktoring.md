---
n: 20
slug: nomlarni-refaktoring
title: "Nomlarni xavfsiz o'zgartirish"
summary: "Yaxshi nomni birinchi urinishda topish kamdan-kam bo'ladi, shuning uchun nomni o'zgartirish arzon va xavfsiz bo'lishi kerak. Bu darsda lokal nomdan tortib API maydoni va DB ustunigacha nomni o'zgartirish usullarini, Fowler'ning migratsiya mexanikasini va parallel change (expand/contract) naqshini ko'ramiz."
duration: 40
sources:
  - id: refactoring
    note: "Change Function Declaration (oddiy va migratsiya mexanikasi, nashr qilingan interfeyslar), Rename Variable, Rename Field; 3-bob \"Mysterious Name\" smell'i"
  - id: refactoring-catalog
    note: "Change Function Declaration (taxalluslari: Rename Function, Rename Method, Change Signature), Rename Variable, Rename Field"
  - id: fowler-parallel-change
    note: "Expand, migrate, contract bosqichlari; nashr qilingan interfeyslar va DB refaktoringida qo'llanilishi; contract bosqichini tugatmaslik xavfi"
quiz:
  - q: "IDE'da F2 bilan `fuelLevel` xususiyatini `fuelLevelLiters` ga o'zgartirdingiz, TypeScript xato bermadi. Qaysi joy yangilanmagan bo'lishi ehtimoli eng yuqori?"
    options:
      - "Shu faylning ichidagi boshqa funksiyalar"
      - "Boshqa fayllardagi import qilingan tiplar"
      - "Bu xususiyatni tipli obyekt orqali ishlatgan React komponentlari"
      - "API javobidagi JSON kaliti, DB ustuni, log maydoni yoki `obj[\"fuelLevel\"]` kabi string orqali murojaatlar"
    answer: 3
    explain: "TypeScript language server tip tizimi ko'radigan murojaatlarni yangilaydi. String kalitlar, serializatsiya, DB sxemasi, tashqi mijozlar va loglar tip tizimidan tashqarida. Ular alohida tekshirilishi kerak."
  - q: "Fowler Change Function Declaration uchun \"migratsiya mexanikasi\"ni qachon tavsiya qiladi?"
    options:
      - "Har doim, chunki u yagona xavfsiz usul"
      - "Faqat funksiya private bo'lsa"
      - "Chaqiruvchilar ko'p yoki ularning hammasini bir vaqtda o'zgartirib bo'lmasa, ayniqsa interfeys nashr qilingan (tashqi foydalanuvchilarga ochiq) bo'lsa"
      - "Faqat funksiya argumentlari o'zgarganda"
    answer: 2
    explain: "Oddiy mexanika barcha chaqiruvchilarni bir qadamda o'zgartirish mumkin bo'lganda ishlaydi. Aks holda yangi funksiya yaratiladi, eskisi unga delegatsiya qiladi va chaqiruvchilar bosqichma-bosqich ko'chiriladi."
  - q: "Parallel change naqshining bosqichlari to'g'ri tartibda qaysi?"
    options:
      - "Expand (yangisini eskisi bilan yonma-yon qo'shish), migrate (mijozlarni ko'chirish), contract (eskisini olib tashlash)"
      - "Contract, expand, migrate"
      - "Migrate, expand, contract"
      - "Deprecate, delete, deploy"
    answer: 0
    explain: "Avval yangi versiya eskisi bilan birga ishlaydi, keyin barcha mijozlar unga o'tadi, faqat shundan keyin eski versiya olib tashlanadi. Har bir bosqichda tizim release qilinishi mumkin."
  - q: "Parallel change bo'yicha maqola qaysi xavfdan ogohlantiradi?"
    options:
      - "Expand bosqichi juda tez"
      - "Contract bosqichini tugatmaslik: ikki versiya abadiy qoladi va holat boshlang'ichidan ham chalkashroq bo'ladi"
      - "Migrate bosqichi kerak emas"
      - "Feature flag ishlatish taqiqlangan"
    answer: 1
    explain: "Maqola migratsiya davomida ikki versiyani saqlash narxini va contract bosqichini qasddan tugatish zaruratini ta'kidlaydi. Aks holda kod ikki nomli \"o'tish holati\"da qotib qoladi."
  - q: "PostgreSQL'da `vehicles.fuel` ustunini `fuel_level_liters` ga o'zgartirish kerak. Ilova bir nechta instance'da ishlaydi, deploy rolling. Eng xavfsiz yo'l qaysi?"
    options:
      - "Bitta migratsiyada `ALTER TABLE ... RENAME COLUMN` va shu deploy'da kodni yangilash"
      - "Ustunni o'chirib, yangisini yaratish"
      - "Faqat kodda Prisma `@map(\"fuel\")` bilan maydonni `fuelLevelLiters` deb atash; DB nomini o'zgartirish haqiqatan zarur bo'lsa, yangi ustun qo'shish, ikkalasiga yozish, ma'lumotni ko'chirish, o'qishni yangisiga o'tkazish va keyin eskisini o'chirish"
      - "DB nomini hech qachon o'zgartirmaslik va kodda ham `fuel` qoldirish"
    answer: 2
    explain: "Rolling deploy paytida eski va yangi kod bir vaqtda ishlaydi, shuning uchun bir qadamli RENAME eski instance'larni buzadi. Ko'pincha kod nomini `@map` bilan o'zgartirish yetarli. DB nomi ham o'zgarishi kerak bo'lsa, bu parallel change."
  - q: "Nima uchun nomni o'zgartirishni xatti-harakat o'zgarishidan alohida commit (yoki PR) qilish tavsiya etiladi?"
    options:
      - "Git buni talab qiladi"
      - "Rename diff'i ko'p faylga tegadi, lekin mexanik; uni mantiq o'zgarishi bilan aralashtirsangiz, reviewer haqiqiy o'zgarishni shovqin ichida ko'rmaydi va xato yashirinadi"
      - "Alohida commit tezroq deploy bo'ladi"
      - "CI faqat bitta turdagi o'zgarishni tekshiradi"
    answer: 1
    explain: "Fowler refaktoring va xatti-harakat o'zgarishini alohida qadamlar sifatida ko'radi. Struktura va xatti-harakatni ajratish g'oyasini 78-darsda (Tidy First) batafsil ko'ramiz."
task:
  title: "API maydonini va servis metodini bosqichma-bosqich qayta nomlash"
  prompt: |
    Transport parki API'sida `GET /vehicles/:id` javobida `fuel` maydoni bor. U aslida yoqilg'i sathini litrda bildiradi va jamoa uni `fuelLevelLiters` ga o'zgartirishga qaror qildi. Bu API'ni mobil ilova (eski versiyalari foydalanuvchilarda oylab qoladi) va hamkor kompaniyaning integratsiyasi ishlatadi. Bundan tashqari, servisda `getFuel(id)` metodi bor va u 40 joyda chaqiriladi.

    1. Expand bosqichi uchun kodni yozing: yangi maydon va yangi metod eskilari bilan yonma-yon ishlasin.
    2. Eski nomlarni `@deprecated` bilan belgilang va qachon olib tashlanishini ko'rsating.
    3. Kommentda migrate va contract bosqichlari rejasini qisqa yozing: nima, qachon va qanday tekshiriladi.
  lang: ts
  starter: |
    type VehicleRow = { id: string; plate: string; fuel: number };

    export class VehiclesService {
      constructor(private readonly findRow: (id: string) => Promise<VehicleRow | null>) {}

      async getFuel(id: string): Promise<number | null> {
        const row = await this.findRow(id);
        return row ? row.fuel : null;
      }

      async toResponse(id: string): Promise<{ id: string; plate: string; fuel: number } | null> {
        const row = await this.findRow(id);
        if (!row) return null;
        return { id: row.id, plate: row.plate, fuel: row.fuel };
      }
    }
  solution: |
    // DB ustuni hozircha `fuel` bo'lib qoladi. Kod va API tilida yangi nom: fuelLevelLiters.
    type VehicleRow = { id: string; plate: string; fuel: number };

    export type VehicleResponse = {
      id: string;
      plate: string;
      fuelLevelLiters: number;
      /**
       * @deprecated `fuelLevelLiters` dan foydalaning. Mobil ilovaning minimal
       * qo'llab-quvvatlanadigan versiyasi yangi maydonga o'tgach olib tashlanadi.
       */
      fuel: number;
    };

    export class VehiclesService {
      constructor(private readonly findRow: (id: string) => Promise<VehicleRow | null>) {}

      async findFuelLevelLiters(id: string): Promise<number | null> {
        const row = await this.findRow(id);
        return row ? row.fuel : null;
      }

      /** @deprecated `findFuelLevelLiters` dan foydalaning. */
      getFuel(id: string): Promise<number | null> {
        return this.findFuelLevelLiters(id);
      }

      async toResponse(id: string): Promise<VehicleResponse | null> {
        const row = await this.findRow(id);
        if (!row) return null;
        return {
          id: row.id,
          plate: row.plate,
          fuelLevelLiters: row.fuel,
          fuel: row.fuel,
        };
      }
    }

    // Migrate:
    // 1. Ichki chaqiruvlar: `getFuel` ning 40 ta chaqiruvini IDE rename bilan emas,
    //    "Find references" orqali `findFuelLevelLiters` ga ko'chirish. Bitta PR, xatti-harakat o'zgarmaydi.
    // 2. Mobil ilova: yangi versiya `fuelLevelLiters` ni o'qiydi. Analitikada eski versiyalar ulushini kuzatish.
    // 3. Hamkor: yangi maydon haqida yozma xabar va muddat (masalan, 3 oy).
    // 4. Kuzatuv: eski maydonni o'qiyotgan mijozlarni API gateway yoki log orqali o'lchash, agar imkon bo'lsa.
    //
    // Contract:
    // 1. `getFuel` ning chaqiruvlari 0 ga tushgach, metodni o'chirish (kompilyator qolganini ko'rsatadi).
    // 2. Minimal mobil versiya va hamkor ko'chgach, `fuel` maydonini javobdan olib tashlash.
    // 3. DB ustunini o'zgartirish alohida qaror: kerak bo'lsa, o'z expand/contract sikli bilan.
  solutionNotes: |
    - Expand bosqichi hech kimni buzmaydi: eski mijozlar `fuel` ni, yangilari `fuelLevelLiters` ni o'qiydi.
    - Eski metod yangisiga delegatsiya qiladi. Bu Fowler'ning migratsiya mexanikasi: mantiq bitta joyda, eski nom faqat o'tish uchun.
    - `@deprecated` JSDoc tegi TypeScript tomonidan tanib olinadi: IDE eski nomni chizilgan holda ko'rsatadi va yangi chaqiruvlar paydo bo'lishini kamaytiradi. typescript-eslint'da ham deprecated API'larni topadigan qoida bor.
    - Javob tipi `VehicleResponse` deb nomlandi va alohida e'lon qilindi: endi API shartnomasi bitta joyda ko'rinadi.
    - DB ustunini o'zgartirmadik. Kod va API nomini o'zgartirish DB nomini o'zgartirishdan alohida qaror. Prisma ishlatilsa, `fuelLevelLiters Float @map("fuel")` bilan xuddi shu natijaga erishiladi.
    - Eng muhim qism - contract rejasi va uning sharti. Usiz ikki nom abadiy qoladi.
  checklist:
    - "Expand bosqichida mavjud mijozlarning hech biri buzilmaydi"
    - "Eski metod yangisiga delegatsiya qiladi, mantiq takrorlanmaydi"
    - "Eski nomlar @deprecated bilan va sababi bilan belgilangan"
    - "Contract bosqichi uchun aniq shart yozilgan (qachon va qanday tekshirilib olib tashlanadi)"
    - "DB ustuni nomi API va kod nomidan alohida qaror sifatida ko'rilgan"
---

## Muammo

Oldingi to'qqiz darsda yaxshi nom qanday bo'lishi kerakligini ko'rdik. Lekin real loyihada savol boshqacha qo'yiladi: **yomon nom allaqachon bor**. U 40 joyda ishlatiladi, API javobida ko'rinadi, DB ustuni sifatida saqlanadi, mobil ilova uni o'qiydi va hamkor kompaniya integratsiyasi unga bog'langan. Uni o'zgartirish xavfli tuyuladi, shuning uchun hech kim o'zgartirmaydi. Natijada 12-darsdagi "eskirgan nom" paydo bo'ladi: `sendSmsNotification` Telegram'ga ham yuboradi, `fuel` maydoni litrmi yoki foizmi, hech kim aniq bilmaydi.

Martin Fowler *Refactoring*da "Mysterious Name" smell'ini katalogning birinchi o'rinlaridan biriga qo'yadi va nomni o'zgartirishni eng ko'p qilinadigan refaktoringlardan biri deb biladi. Sabab oddiy: domen haqidagi tushuncha o'sgani sari yaxshiroq nomlar ko'rinadi. Birinchi kun tanlangan nom ko'pincha birinchi kun bilganlarimizni aks ettiradi. Agar nomni o'zgartirish qimmat bo'lsa, kod abadiy birinchi kundagi tushunchada qoladi.

Shuning uchun bu darsning maqsadi: nomni o'zgartirishni **arzon va xavfsiz** qilish. Bu ikki xil vazifa. Kod ichidagi nomlar uchun asosiy vosita - IDE va kompilyator. Tizim chegarasidan tashqariga chiqqan nomlar (API, DB, event, env) uchun esa - bosqichma-bosqich migratsiya.

## Asosiy g'oya

Fowler'ning refaktoring katalogida nomlash bilan bog'liq uchta asosiy refaktoring bor:

- **Rename Variable** - o'zgaruvchi nomini o'zgartirish. Katalogdagi misol oddiy: `let a = height * width` dan `let area = height * width`.
- **Rename Field** - yozuv yoki klass maydonini o'zgartirish.
- **Change Function Declaration** - funksiya nomini va imzosini o'zgartirish. Katalogda uning taxalluslari ham ko'rsatilgan: Rename Function, Rename Method, Add Parameter, Remove Parameter, Change Signature. Misol: `circum(radius)` dan `circumference(radius)`.

*Refactoring*ning 2-nashrida Change Function Declaration uchun ikki xil mexanika beriladi. Bu farq butun darsning asosi:

**Oddiy mexanika.** Agar barcha chaqiruvchilarni bitta qadamda topib o'zgartirish mumkin bo'lsa, nomni o'zgartiring, barcha murojaatlarni yangilang va testlarni ishga tushiring. Bu kichik loyihalardagi ichki funksiyalar va TypeScript'da IDE rename ishlaydigan ko'p holatlar uchun mos.

**Migratsiya mexanikasi.** Agar chaqiruvchilar ko'p bo'lsa, ular turli joylarda bo'lsa yoki interfeys nashr qilingan (published) bo'lsa, ya'ni siz o'zgartira olmaydigan kod uni ishlatsa, boshqa yo'l kerak. Qisqacha: eski funksiyaning tanasini yangi nomli funksiyaga chiqaring (Extract Function), eski funksiya yangisini chaqirsin, keyin chaqiruvchilarni bosqichma-bosqich yangisiga ko'chiring va oxirida eskisini olib tashlang (Inline Function). Nashr qilingan interfeysda eski funksiyani darhol o'chirmasdan, uni deprecated deb belgilab, mijozlar ko'chishini kutish kerak.

Danilo Sato martinfowler.com'dagi **Parallel Change** maqolasida bu g'oyani umumlashtiradi. Naqshning boshqa nomi - **expand and contract**. U uch bosqichdan iborat:

1. **Expand.** Yangi versiyani eskisi bilan yonma-yon qo'shing. Ikkalasi ham ishlaydi, mavjud mijozlar buzilmaydi.
2. **Migrate.** Mijozlarni eskisidan yangisiga bosqichma-bosqich ko'chiring. Tashqi mijozlar bo'lsa, bu eng uzun bosqich.
3. **Contract.** Eski versiyadan hech kim foydalanmayotganiga ishonch hosil qilgach, uni olib tashlang.

Maqolaning muhim kuzatuvlari: har bir bosqichda kod release qilinishi mumkin, bu esa xatarni kamaytiradi. Lekin migratsiya davomida ikki versiyani saqlash kerak va mijozlar qaysi biri yangi ekanini adashtirishi mumkin. Shuning uchun deprecation belgilari va hujjat kerak. Va eng muhimi: **contract bosqichini tugatmaslik** holatni boshlang'ichidan ham yomonroq qilishi mumkin, chunki endi bitta tushuncha uchun ikki nom bor (18-dars).

## Chuqurroq: nom qayergacha "yetib boradi"

Nomni o'zgartirishning narxi va xatari nom qanchalik uzoqqa yetib borganiga bog'liq. Amalda to'rtta daraja bor.

### 1. Lokal nomlar

Funksiya ichidagi o'zgaruvchi, private metod, eksport qilinmagan tip. TypeScript language server'ning rename funksiyasi (VS Code'da F2) barcha murojaatlarni tip tizimi orqali topadi va yangilaydi. Xatar deyarli yo'q. Bunday nomni o'zgartirish uchun ruxsat so'rash shart emas: bu Boy Scout qoidasining eng arzon shakli (6-dars).

### 2. Kod bazasi ichidagi eksport qilingan nomlar

Eksport qilingan funksiya, klass, tip, modul. IDE rename hali ham ishlaydi, lekin cheklovlari bor:

- **String murojaatlar.** `obj["fuelLevel"]`, `keyof` bilan qurilgan dinamik kalitlar, `Reflect.get`, lodash'ning `get(obj, "fuel.level")`. Tip tizimi bularning bir qismini ko'radi, lekin hammasini emas.
- **Dekoratorlar va metadata.** NestJS'da `@Inject("FUEL_SERVICE")` string token'lari, class-validator xabarlaridagi maydon nomlari, Swagger `@ApiProperty({ name: "fuel" })`.
- **Test fixture'lari va snapshot'lar.** JSON fixture fayllaridagi kalitlar, Jest snapshot'lari.
- **Monorepo'dagi boshqa paketlar.** Agar ular TypeScript project references orqali ulanmagan bo'lsa, IDE ularni ko'rmasligi mumkin.

Shuning uchun IDE rename'dan keyin oddiy matn qidiruvi (`git grep fuelLevel`) va to'liq testlar ishga tushirish kerak. Agar eksport qilingan nom ko'p joyda ishlatilsa va bir PR'da o'zgartirish juda katta diff bersa, Fowler'ning migratsiya mexanikasi bu yerda ham foydali: yangi nom qo'shiladi, eskisi delegatsiya qiladi va `@deprecated` bilan belgilanadi, chaqiruvlar bir necha PR'da ko'chiriladi.

### 3. Tizim chegarasidagi nomlar

Bu yerda tip tizimi yordam bermaydi:

- **API maydonlari va marshrutlari** (`/vehicles/:id` javobidagi `fuel`). Mobil ilovalarning eski versiyalari oylab foydalanuvchilarda qoladi. Hamkorlar o'z kodini sizning jadvalingizga moslab yangilamaydi.
- **DB ustunlari va jadvallari.** Rolling deploy paytida eski va yangi kod versiyalari bir vaqtda ishlaydi. Bir qadamli `RENAME COLUMN` eski instance'larni buzadi.
- **Event va xabar nomlari** (Kafka topic'lari, RabbitMQ routing key'lari, webhook event turlari). Navbatda eski nomli xabarlar qolgan bo'lishi mumkin.
- **Env o'zgaruvchilari va konfiguratsiya kalitlari.** Ular deploy skriptlarida, CI sozlamalarida, secret manager'da yashaydi.
- **Kesh va saqlash kalitlari.** Redis kalitlari, `localStorage` kalitlari. Nom o'zgarsa, eski ma'lumot "yo'qoladi".

Bu nomlarning hammasi uchun parallel change naqshi ishlaydi. Faqat har birida expand, migrate va contract boshqacha ko'rinadi.

### 4. Inson xotirasidagi nomlar

Dashboard'lardagi metrika nomlari, alert qoidalari, runbook'lar, Jira'dagi atamalar, jamoa suhbati. Bu yerda texnik vosita yo'q. Nom o'zgarsa, lug'atni (17-dars) yangilang va o'zgarish haqida xabar bering.

### DB ustunini o'zgartirish: ikki yo'l

Ko'p hollarda DB ustunini umuman o'zgartirish shart emas. ORM darajasidagi mapping kod nomini DB nomidan ajratadi: Prisma'da `fuelLevelLiters Float @map("fuel")`, Kysely'da tip ta'rifi va (agar ustun nomi `snake_case` bo'lsa) `CamelCasePlugin`. Kod va API yangi nomni ishlatadi, DB esa eskisida qoladi. Bu arzon va xavfsiz.

Agar DB nomi ham o'zgarishi kerak bo'lsa (masalan, DB'ni boshqa jamoalar to'g'ridan-to'g'ri o'qiydi va ular uchun ham nom muhim), parallel change odatda shunday ko'rinadi:

1. **Expand:** yangi ustun qo'shiladi (`fuel_level_liters`). Kod ikkala ustunga yozadi.
2. **Backfill:** eski ma'lumot yangi ustunga ko'chiriladi (katta jadvallarda bo'laklab).
3. **Migrate:** o'qish yangi ustunga o'tkaziladi. Bir muddat ikkala ustun solishtiriladi.
4. **Contract:** eski ustunga yozish to'xtatiladi, keyin u o'chiriladi.

Har bir qadam alohida deploy va ularning har biridan keyin orqaga qaytish mumkin. Bu mavzuni 95-darsda migratsiyalar kontekstida davom ettiramiz.

## Misol: event nomini o'zgartirish

Telemetriya xizmati `fuel.drop` nomli event chiqaradi. 17-darsdagi suhbatdan keyin jamoa uni `fuel.suspected-drain` ga o'zgartirishga qaror qildi, chunki "drop" har qanday pasayishni, jumladan oddiy sarfni ham bildirishi mumkin. Eventni uch xizmat tinglaydi: bildirishnomalar, hisobotlar va hamkorning webhook'i.

```ts
export type SuspectedFuelDrainPayload = {
  vehicleId: string;
  dropLiters: number;
  detectedAtMs: number;
};

type EventName = "fuel.suspected-drain" | "fuel.drop";

export interface EventBus {
  publish(name: EventName, payload: SuspectedFuelDrainPayload): Promise<void>;
}

/** @deprecated "fuel.suspected-drain" dan foydalaning. Barcha consumer'lar ko'chgach olib tashlanadi. */
const LEGACY_FUEL_DROP_EVENT = "fuel.drop";
const SUSPECTED_FUEL_DRAIN_EVENT = "fuel.suspected-drain";

export class FuelEventsPublisher {
  constructor(
    private readonly bus: EventBus,
    private readonly shouldPublishLegacyEvent: () => boolean,
  ) {}

  async publishSuspectedDrain(payload: SuspectedFuelDrainPayload): Promise<void> {
    await this.bus.publish(SUSPECTED_FUEL_DRAIN_EVENT, payload);
    if (this.shouldPublishLegacyEvent()) {
      await this.bus.publish(LEGACY_FUEL_DROP_EVENT, payload);
    }
  }
}
```

Bu kod parallel change'ning expand bosqichi:

- **Ikkala event ham chiqadi.** Eski consumer'lar `fuel.drop` ni olishda davom etadi, yangilari `fuel.suspected-drain` ga obuna bo'ladi.
- **Eski nom ochiq belgilangan.** Konstanta nomida `LEGACY` va `@deprecated` tegi bor. Kodni o'qigan dasturchi qaysi nom yangi ekanini adashtirmaydi.
- **Contract bosqichi uchun kalit.** `shouldPublishLegacyEvent` feature flag'ga ulangan. Barcha consumer'lar ko'chgach, flag o'chiriladi, kuzatiladi va keyingi PR'da eski kod butunlay olib tashlanadi. Parallel change maqolasi aynan migrate bosqichida feature flag'lardan foydalanishni tilga oladi.
- **Metod nomi ham yangi tilda.** `publishSuspectedDrain`. Agar eski `publishFuelDrop` metodi bo'lgan bo'lsa, u ham yangisiga delegatsiya qilib, `@deprecated` bo'ladi.

## Qachon qo'llamaslik kerak

- **Foyda xarajatdan kam bo'lganda.** Tashqi API'dagi nomni o'zgartirish oylar davom etadigan migratsiya. Agar nom shunchaki ideal bo'lmasa, lekin yolg'on gapirmasa, uni hujjatda izohlab, ichki kodda yaxshi nom ishlatish (chegarada mapping) arzonroq.
- **Kod muzlatilgan yoki o'chirilish arafasida.** Bir oydan keyin almashtiriladigan modulda katta rename isrof.
- **Rename va xatti-harakat o'zgarishini aralashtirish.** Nomni o'zgartirish mexanik va diff katta. Uni mantiq o'zgarishi bilan bitta commit yoki PR'ga qo'shsangiz, reviewer haqiqiy o'zgarishni shovqin ichida ko'rmaydi. Rename - alohida commit, iloji bo'lsa alohida PR. Bu struktura va xatti-harakatni ajratish g'oyasi (78-dars).
- **Contract rejasisiz expand.** Eski nomni olib tashlash sharti va muddati yo'q bo'lsa, expand qilmang. Aks holda bir tushuncha uchun ikki nom abadiy qoladi.
- **Faol rivojlanayotgan branch'lar ko'p bo'lganda.** Katta rename ko'plab parallel branch'larda merge conflict'lar beradi. Uni jamoa bilan kelishilgan vaqtda (masalan, sprint boshida) va tez merge qilinadigan PR sifatida qiling.

## Stack'da: TypeScript, NestJS, Prisma, Next.js

- **`@deprecated` JSDoc tegi.** TypeScript bu tegni taniydi: IDE deprecated nomni chizilgan holda ko'rsatadi va ogohlantiradi. Bu migrate bosqichida yangi eski chaqiruvlar paydo bo'lishini kamaytiradi. typescript-eslint'da deprecated API ishlatilishini topuvchi qoida ham bor (`no-deprecated`, tip ma'lumotini talab qiladi).
- **NestJS DTO'lari.** API maydonini o'zgartirishda DTO'ga yangi maydon qo'shing va eskisini Swagger'da `@ApiProperty({ deprecated: true })` bilan belgilang. OpenAPI spetsifikatsiyasi `deprecated` xususiyatini qo'llab-quvvatlaydi, shuning uchun generatsiya qilingan mijozlar ham ogohlantirish oladi.
- **Prisma.** Kod nomini DB nomidan ajratish uchun `@map` va `@@map`. Agar `prisma migrate dev` ga faqat maydon nomini o'zgartirsangiz (mapping'siz), u ustunni o'chirib, yangisini yaratadigan migratsiya taklif qilishi mumkin, bu esa ma'lumot yo'qolishi demak. Generatsiya qilingan SQL'ni har doim o'qing va kerak bo'lsa qo'lda tahrirlang.
- **Next.js marshrutlari.** Sahifa URL'i ham nom. `/cars/[id]` ni `/vehicles/[vehicleId]` ga o'zgartirsangiz, eski havolalar (bookmark'lar, qidiruv tizimlari, emaildagi linklar) buziladi. `next.config` dagi `redirects` doimiy yo'naltirish beradi - bu URL uchun expand/contract.
- **Env o'zgaruvchilari.** Yangi nomni qo'shing, ilova bir muddat ikkalasini ham o'qisin (`process.env.TELEMETRY_API_URL ?? process.env.API_URL`), deploy konfiguratsiyalari yangilangach eskisini olib tashlang. Bu kichik, lekin to'liq parallel change.

## Xulosa

- Yaxshi nom ko'pincha birinchi urinishda topilmaydi, shuning uchun nomni o'zgartirish arzon va xavfsiz bo'lishi kerak.
- Nom qanchalik uzoqqa yetib borgan bo'lsa (lokal, eksport, tizim chegarasi, inson xotirasi), o'zgartirish shunchalik qimmat va bosqichli.
- Kod ichida IDE rename va kompilyator asosiy vosita, lekin string murojaatlar, dekoratorlar va fixture'larni alohida tekshiring.
- Nashr qilingan nomlar uchun Fowler'ning migratsiya mexanikasi va parallel change: expand, migrate, contract. Contract bosqichini rejalashtirmagan holda boshlamang.
- Ko'p hollarda DB nomini emas, faqat kod va API nomini o'zgartirish yetarli. Rename'ni har doim xatti-harakat o'zgarishidan alohida commit qiling.
