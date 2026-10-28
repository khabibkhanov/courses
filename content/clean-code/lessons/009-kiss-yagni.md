---
n: 9
slug: kiss-yagni
title: "KISS va YAGNI: spekulyativ umumiylikdan qochish"
summary: "\"Kelajakda kerak bo'ladi\" degan mantiq bilan yozilgan kod ko'pincha hech qachon kerak bo'lmaydi, lekin har kuni narx to'lattiradi. Bu darsda Fowler'ning YAGNI maqolasidagi to'rt xarajatni, Fowler'ning Speculative Generality code smell'ini, KISS'ni va eng muhimi - YAGNI nimaga taalluqli emasligini ko'ramiz."
duration: 30
sources:
  - id: fowler-yagni
    note: "YAGNI'ning kelib chiqishi (C3 loyihasi, Beck va Hendrickson), qaroqchilik xavfi narxlash misoli, cost of build, delay, carry, repair, va YAGNI qo'llanmaydigan holatlar"
  - id: pragprog
    note: "Reversibility, Good-Enough Software va ETC mavzulari: qarorlarni qaytariladigan saqlash"
  - id: refactoring
    note: "Code smells katalogidagi Speculative Generality va unga qarshi refaktoringlar (Collapse Hierarchy, Inline Function, Inline Class, Remove Dead Code)"
quiz:
  - q: "Fowler'ning maqolasiga ko'ra YAGNI iborasi qayerdan kelib chiqqan?"
    options:
      - "Robert Martin'ning Clean Code kitobidan"
      - "C3 loyihasida Chet Hendrickson kelajakdagi imkoniyatlarni taklif qilganda Kent Beck'ning javobidan"
      - "GoF kitobidan"
      - "Unix falsafasidan"
    answer: 1
    explain: "Fowler YAGNI'ni Extreme Programming'ning dastlabki davridagi C3 loyihasidagi suhbatga bog'laydi: Hendrickson tizimga tez orada kerak bo'ladigan imkoniyatlarni sanaydi, Beck esa har biriga \"you aren't going to need it\" deb javob beradi."
  - q: "Jamoa olti oydan keyin kerak bo'lishi aniq bo'lgan feature'ni hozir quryapti va u to'g'ri chiqdi. Fowler bo'yicha qaysi xarajat baribir to'landi?"
    options:
      - "Hech qanday, chunki feature kerak bo'ldi"
      - "Faqat cost of repair"
      - "Cost of delay (bugun foyda keltiradigan ish kechikdi) va cost of carry (feature olti oy davomida boshqa ishni sekinlashtirdi)"
      - "Faqat cost of build"
    answer: 2
    explain: "Fowler'ning muhim nuqtasi: bashorat to'g'ri chiqsa ham, erta qurish arzon emas. Build narxi bir xil, lekin delay va carry xarajatlari qo'shiladi. Bashorat noto'g'ri bo'lsa, yana build va repair qo'shiladi."
  - q: "Quyidagilardan qaysi biri YAGNI buzilishi EMAS?"
    options:
      - "Hozircha bitta to'lov provayderi bo'lsa ham, \"kelajakda ko'p bo'ladi\" deb plagin tizimini qurish"
      - "Bitta implementatsiyali generik `Repository<T, K, Q, O>` yozish"
      - "Hech kim so'ramagan eksport formatlarini qo'shish"
      - "Kodni refaktoring qilish va testlar yozish, shunda kelajakdagi o'zgarishlar oson bo'lsin"
    answer: 3
    explain: "Fowler aniq aytadi: YAGNI kodni o'zgartirishni osonlashtiradigan harakatlarga (refaktoring, self-testing code, continuous delivery) tegishli emas. Aksincha, YAGNI ularga tayanadi: kodni keyin oson o'zgartirish mumkin bo'lgani uchun bugun qurmaslik xavfsiz."
  - q: "Fowler bo'yicha \"cost of carry\" nima?"
    options:
      - "Feature mavjudligi tufayli qo'shilgan murakkablik boshqa barcha ishlarni sekinlashtirishi, toki u olib tashlanmaguncha"
      - "Serverlarni saqlash narxi"
      - "Feature'ni qurish uchun ketgan vaqt"
      - "Feature noto'g'ri qurilganda uni tuzatish narxi"
    answer: 0
    explain: "Cost of carry - eng ko'p e'tibordan chetda qoladigan xarajat: ishlatilmayotgan kod ham o'qilishi, tushunilishi, testlanishi va har bir o'zgarishda hisobga olinishi kerak. U har kuni to'lanadi."
  - q: "Kod review'da `NotificationChannel` abstrakt klassi, uning `SmsChannel` implementatsiyasi va `ChannelFactory` ko'rdingiz. Boshqa kanal yo'q va rejada ham yo'q. Fowler'ning Refactoring katalogi bo'yicha qaysi refaktoring mos?"
    options:
      - "Extract Superclass"
      - "Replace Conditional with Polymorphism"
      - "Collapse Hierarchy va Inline Class/Function: abstraksiyani olib tashlab, faqat konkret SmsChannel'ni qoldirish"
      - "Introduce Parameter Object"
    answer: 2
    explain: "Bu Speculative Generality code smell'i: kelajak uchun qurilgan, hozir hech narsaga xizmat qilmaydigan ierarxiya. Fowler bu smell uchun Collapse Hierarchy, Inline Function, Inline Class kabi refaktoringlarni tavsiya qiladi."
  - q: "Qaysi holatda kelajakni hisobga olgan qaror YAGNI'ga zid emas?"
    options:
      - "Har doim, agar menejer so'rasa"
      - "Kelajakka yo'naltirilgan tanlov hozir qo'shimcha murakkablik qo'shmasa yoki qarorni keyin o'zgartirish juda qimmat bo'lsa (masalan, ommaviy API yoki ma'lumotlar sxemasi)"
      - "Faqat startaplarda"
      - "Hech qachon"
    answer: 1
    explain: "Fowler YAGNI qo'shimcha murakkablik qo'shmaydigan tanlovlarga taalluqli emasligini aytadi. Qaytarilmaydigan qarorlar (ommaviy API, sxema) esa YAGNI'ning asosiy shartini - keyin arzon o'zgartirishni - buzadi, shuning uchun ular ko'proq oldindan o'ylashni talab qiladi."
task:
  title: "Spekulyativ umumiylikni olib tashlash"
  prompt: |
    Quyidagi kod transport parkidagi avtomobillar uchun texnik ko'rik eslatmalarini yuboradi. Uni yozgan dasturchi "kelajakda boshqa kanallar, boshqa tillar va boshqa jadvallar bo'ladi" deb o'ylagan. Bir yil o'tdi: faqat SMS, faqat o'zbek tili, faqat bitta jadval.

    1. Har bir spekulyativ element uchun Fowler'ning to'rt xarajatidan qaysi biri hozir to'lanayotganini yozing.
    2. Kodni hozirgi talablarga mos eng oddiy shaklga keltiring. Xatti-harakat o'zgarmasin.
    3. Yechimda testlanishni saqlang: SMS yuborish hali ham test'da almashtiriladigan bo'lsin.
  lang: ts
  starter: |
    type Vehicle = { id: string; plate: string; nextInspectionAt: Date; ownerPhone: string };

    interface Channel {
      send(to: string, text: string): Promise<void>;
    }

    interface MessageTemplate<TContext> {
      render(ctx: TContext, locale: string): string;
    }

    abstract class ReminderScheduler<T> {
      abstract shouldRemind(item: T, now: Date): boolean;
    }

    class InspectionScheduler extends ReminderScheduler<Vehicle> {
      constructor(private readonly daysBefore: number) {
        super();
      }
      shouldRemind(v: Vehicle, now: Date): boolean {
        const diff = (v.nextInspectionAt.getTime() - now.getTime()) / 86_400_000;
        return diff <= this.daysBefore && diff >= 0;
      }
    }

    class InspectionTemplate implements MessageTemplate<Vehicle> {
      render(v: Vehicle, locale: string): string {
        if (locale === "uz") return `${v.plate}: texnik ko'rik ${v.nextInspectionAt.toLocaleDateString("uz-UZ")}`;
        throw new Error("unsupported locale");
      }
    }

    export class ReminderService {
      constructor(
        private readonly channels: Map<string, Channel>,
        private readonly scheduler: ReminderScheduler<Vehicle> = new InspectionScheduler(7),
        private readonly template: MessageTemplate<Vehicle> = new InspectionTemplate(),
      ) {}

      async run(vehicles: Vehicle[], now: Date, channel = "sms", locale = "uz"): Promise<number> {
        const ch = this.channels.get(channel);
        if (!ch) throw new Error("no channel");
        let sent = 0;
        for (const v of vehicles) {
          if (!this.scheduler.shouldRemind(v, now)) continue;
          await ch.send(v.ownerPhone, this.template.render(v, locale));
          sent++;
        }
        return sent;
      }
    }
  solution: |
    type Vehicle = { id: string; plate: string; nextInspectionAt: Date; ownerPhone: string };

    export interface SmsSender {
      send(phone: string, text: string): Promise<void>;
    }

    const REMIND_DAYS_BEFORE_INSPECTION = 7;
    const MS_PER_DAY = 86_400_000;

    export function isInspectionDueSoon(vehicle: Vehicle, now: Date): boolean {
      const daysLeft = (vehicle.nextInspectionAt.getTime() - now.getTime()) / MS_PER_DAY;
      return daysLeft >= 0 && daysLeft <= REMIND_DAYS_BEFORE_INSPECTION;
    }

    function inspectionReminderText(vehicle: Vehicle): string {
      const date = vehicle.nextInspectionAt.toLocaleDateString("uz-UZ");
      return `${vehicle.plate}: texnik ko'rik ${date}`;
    }

    export class InspectionReminderService {
      constructor(private readonly sms: SmsSender) {}

      async sendDueReminders(vehicles: Vehicle[], now: Date): Promise<number> {
        const due = vehicles.filter((v) => isInspectionDueSoon(v, now));
        for (const vehicle of due) {
          await this.sms.send(vehicle.ownerPhone, inspectionReminderText(vehicle));
        }
        return due.length;
      }
    }
  solutionNotes: |
    - `Channel` xaritasi va `channel = "sms"` parametri: cost of carry. Har bir o'quvchi qaysi kanallar mavjudligini va `"no channel"` qachon otilishini tushunishi kerak edi. Endi bitta `SmsSender` bog'liqligi.
    - `MessageTemplate<TContext>` va `locale`: cost of carry va potentsial cost of repair. `throw new Error("unsupported locale")` - ishlatilmaydigan tarmoq. Rus tili kerak bo'lganda uning shakli bugun tasavvur qilganimizdan farq qilishi mumkin (masalan, lokal foydalanuvchi profilidan keladi), shuning uchun bugungi interfeys keyin baribir o'zgarardi.
    - `ReminderScheduler<T>` abstrakt klassi bitta voris bilan: Collapse Hierarchy. Mantiq sof funksiya `isInspectionDueSoon` ga aylandi, uni alohida testlash ham osonroq.
    - `SmsSender` interfeysi qoldi. Bu spekulyativ emas: u bugungi testlarga xizmat qiladi (Beck'ning birinchi qoidasi, 7-dars) va tashqi tizim chegarasini belgilaydi (50-dars).
    - Ikkinchi kanal haqiqatan kerak bo'lganda, `SmsSender` ni `ReminderChannel` ga umumlashtirish bir necha daqiqalik refaktoring. YAGNI aynan shunga tayanadi: kod oddiy va testlangan bo'lgani uchun keyin o'zgartirish arzon.
  checklist:
    - "Har bir spekulyativ element uchun to'lanayotgan xarajat nomlandi"
    - "Bitta vorisli abstrakt klass va bitta implementatsiyali generik interfeyslar olib tashlandi"
    - "Ishlatilmaydigan parametrlar (channel, locale) va tarmoqlar qolmadi"
    - "Tashqi tizim (SMS) testda almashtiriladigan bo'lib qoldi"
    - "Eslatma yuborish xatti-harakati va qaytarilgan son o'zgarmadi"
---

## Muammo

Har bir tajribali dasturchi bu kodni ko'rgan: `PaymentProviderFactory`, `AbstractPaymentProvider`, `PaymentProviderRegistry`, `PaymentProviderConfig<T>` va ularning ostida bitta `PaymeProvider`. Ikki yil oldin kimdir "kelajakda ko'p provayder bo'ladi" degan. Ikki yil ichida provayder bitta qoldi. Lekin har bir yangi dasturchi to'rtta abstraksiya qatlamini o'qib chiqadi, har bir bug fix to'rtta faylga tegadi va har bir testda factory va registry sozlanadi.

Eng achinarlisi: ikkinchi provayder haqiqatan kelganda, u ko'pincha bu abstraksiyaga mos kelmaydi. Click'ning callback modeli Payme'nikidan farq qiladi, tayyorlangan interfeys esa Payme tasavvuri asosida qurilgan. Natijada abstraksiyaga yana parametrlar qo'shiladi (8-darsdagi Metz evolyutsiyasi).

Bu darsning savoli: **kelajak uchun qachon qurish kerak va qachon yo'q?**

## Asosiy g'oya

### YAGNI

YAGNI ("You Aren't Gonna Need It") Extreme Programming'dan keladi. Martin Fowler 2015 yildagi "Yagni" maqolasida uning kelib chiqishini C3 loyihasidagi suhbatga bog'laydi: Chet Hendrickson tizimga tez orada kerak bo'ladigan imkoniyatlarni birma-bir sanaydi, Kent Beck esa har biriga "you aren't going to need it" deb javob beradi. YAGNI XP'ning Simple Design amaliyoti bilan bog'liq (7-dars, to'rtinchi qoida: fewest elements).

Fowler YAGNI'ni misol orqali tushuntiradi. Dengiz yuk tashish kompaniyalarini sug'urtalaydigan startap bor, unda narxlash va sotish komponentlari alohida. Jamoa hozir bo'ron xavfi uchun narxlashni quryapti va olti oydan keyin qaroqchilik xavfi uchun narxlash kerak bo'lishini biladi. Savol: qaroqchilik narxlashini hozir, bo'ron bilan birga qurish kerakmi? YAGNI javobi: yo'q. Agar uni qurish ikki oy olsa, uni boshlashdan oldin taxminan to'rt oy kutish kerak.

### To'rt xarajat

Fowler'ning eng foydali hissasi - spekulyativ feature'ning narxini to'rtta xarajatga ajratish:

1. **Cost of build** - hech qachon ishlatilmasligi mumkin bo'lgan feature'ni tahlil qilish, yozish va testlashga ketgan kuch.
2. **Cost of delay** - bu ish bugun foyda keltiradigan boshqa ishni (masalan, bo'ron sug'urtasini sotish) kechiktiradi. Daromad kechroq keladi.
3. **Cost of carry** - qo'shimcha murakkablik u olib tashlanmaguncha boshqa barcha feature'larni ishlab chiqish va debugging'ni sekinlashtiradi.
4. **Cost of repair** - agar feature noto'g'ri tasavvur bilan qurilgan bo'lsa (talab haqiqatan kelganda boshqacha chiqsa), uni tuzatish yoki aylanib o'tish narxi.

Muhim kuzatuv: **bashorat to'g'ri chiqsa ham** erta qurish arzon emas. Build narxi bir xil, lekin delay va carry baribir to'lanadi. Bashorat noto'g'ri bo'lsa, yana repair qo'shiladi. Odamlar odatda faqat build xarajatini ko'radi va qolgan uchtasini e'tiborsiz qoldiradi.

### YAGNI nimaga taalluqli EMAS

Bu YAGNI'ning eng ko'p noto'g'ri tushuniladigan qismi. Fowler aniq aytadi: YAGNI faqat **taxminiy kelajak feature'lari uchun qo'shilgan imkoniyatlarga** taalluqli. U dasturiy ta'minotni o'zgartirishni osonlashtiradigan harakatlarga taalluqli emas: refaktoring, self-testing code (avtomatik testlar), continuous delivery. Aksincha, YAGNI ularga **tayanadi**: kod oson o'zgartiriladigan bo'lgani uchungina bugun qurmaslik xavfsiz.

Fowler yana ikki muhim chegara qo'yadi:

- Agar kelajakka yo'naltirilgan tanlov hozir qo'shimcha murakkablik qo'shmasa, YAGNI unga qarshi emas.
- YAGNI hech qachon kod sog'lig'ini e'tiborsiz qoldirishni oqlamaydi. "YAGNI" deb test yozmaslik yoki refaktoring qilmaslik - tamoyilni teskari ishlatish.

## Chuqurroq: KISS, speculative generality va qaytariladigan qarorlar

### KISS

KISS ("Keep It Simple, Stupid") ko'pincha muhandislik madaniyatidan kelgan deb aytiladi va dasturlashga xos emas. Uning manbai haqida turli rivoyatlar bor, shuning uchun bu yerda aniq muallifga nisbat bermaymiz. Dasturlashda u oddiy ma'noga ega: muammoni hal qiladigan eng oddiy yechimni tanlang.

KISS va YAGNI bir-biriga yaqin, lekin bir xil emas:

- **YAGNI** - **nima** qurish kerak: hozir kerak bo'lmagan imkoniyatni qurmang.
- **KISS** - **qanday** qurish kerak: kerakli imkoniyatni eng oddiy usulda quring.

Masalan, hozir kerak bo'lgan konfiguratsiyani oddiy obyekt bilan emas, o'z DSL'ingiz bilan ifodalash YAGNI'ni buzmaydi (konfiguratsiya kerak), lekin KISS'ni buzadi.

"Oddiy" so'zi ham ehtiyotkorlik talab qiladi. Oddiy - bu "kam qator" yoki "menga tanish" emas. Ousterhout ma'nosida oddiy - kamroq murakkablik (3-dars): kamroq bog'liqlik, kamroq noaniqlik, kamroq kognitiv yuk. Ba'zan oddiy yechim ko'proq qatorli bo'ladi.

### Speculative Generality

Fowler *Refactoring* kitobining code smells katalogida bu holatga nom beradi: **Speculative Generality**. Uning belgilari: hech narsa qilmaydigan abstrakt klasslar, keraksiz delegatsiya, ishlatilmaydigan parametrlar, faqat testlar chaqiradigan metodlar, "bir kun kerak bo'ladi" deb qo'shilgan hook'lar.

Fowler unga qarshi refaktoringlarni ko'rsatadi, ular refactoring.com katalogida ham bor:

- **Collapse Hierarchy** - foydasiz abstrakt klass va vorisni birlashtirish.
- **Inline Function** va **Inline Class** - keraksiz delegatsiya qatlamini olib tashlash.
- **Change Function Declaration** - ishlatilmaydigan parametrlarni o'chirish.
- **Remove Dead Code** - hech qayerdan chaqirilmaydigan kodni o'chirish.

Bu smell 75-darsda batafsil ko'riladi.

### Qaytariladigan va qaytarilmaydigan qarorlar

YAGNI bitta shartga tayanadi: **keyin qo'shish arzon**. Bu shart har doim ham bajarilmaydi. Pragmatic Programmer'ning "Reversibility" mavzusida mualliflar yakuniy qarorlar yo'qligini va arxitekturani qarorlarni qaytarish mumkin bo'ladigan qilib qurishni maslahat beradi. Bu bilan birga, ba'zi qarorlarni qaytarish haqiqatan qimmat:

- **Ommaviy API shartnomalari.** Tashqi mijozlar foydalanayotgan endpoint'ni o'zgartirish versiyalashni va migratsiyani talab qiladi.
- **Ma'lumotlar sxemasi.** Millionlab qatorli jadvalni qayta tuzish ko'p bosqichli migratsiya (95-dars, parallel change).
- **Xavfsizlik va audit.** Kim nimani o'zgartirganini keyinchalik "qo'shib" bo'lmaydi: o'tgan ma'lumot yo'qolgan.
- **Identifikatorlar.** Global ID formati, bir nechta tenant'ni qo'llab-quvvatlash kabi tub qarorlar.

Bunday joylarda oldindan o'ylash YAGNI'ga zid emas: bu yerda "keyin oson o'zgartirish" sharti bajarilmaydi. Muhim nozik nuqta: oldindan o'ylash har doim oldindan **qurish** degani emas. Ko'pincha kelajakni yopmaydigan minimal qaror yetarli: masalan, `tenant_id` ustunini hozirdan qo'shish, lekin multi-tenant boshqaruv panelini qurmaslik.

## Misol: hisobot eksporti

Vazifa: buxgalteriya uchun oylik yoqilg'i hisobotini CSV formatida yuklab olish. Spekulyativ versiya:

```ts
interface ExportFormat<T> {
  readonly mimeType: string;
  serialize(rows: T[], options?: Record<string, unknown>): string;
}

class CsvFormat<T extends Record<string, unknown>> implements ExportFormat<T> {
  readonly mimeType = "text/csv";
  serialize(rows: T[]): string {
    const headers = Object.keys(rows[0] ?? {});
    const lines = rows.map((r) => headers.map((h) => String(r[h])).join(";"));
    return [headers.join(";"), ...lines].join("\n");
  }
}

class ExportRegistry {
  private readonly formats = new Map<string, ExportFormat<Record<string, unknown>>>();
  register(name: string, format: ExportFormat<Record<string, unknown>>): void {
    this.formats.set(name, format);
  }
  get(name: string): ExportFormat<Record<string, unknown>> {
    const format = this.formats.get(name);
    if (!format) throw new Error(`Unknown format: ${name}`);
    return format;
  }
}
```

Hozirgi talab: faqat CSV. XLSX, PDF, JSON - hech kim so'ramagan. To'rt xarajat: build (registry va generik interfeys), delay (hisobotning o'zi kechroq tayyor), carry (har bir o'quvchi registry'ni tushunishi kerak, `Record<string, unknown>` tiplari tufayli ustunlar nomi tip tekshiruvidan chiqib ketgan), repair (XLSX kerak bo'lganda u satr emas, `Buffer` qaytaradi, va `serialize(): string` interfeysi mos kelmaydi).

Hozirgi talabga mos oddiy versiya:

```ts run
type FuelReportRow = { plate: string; liters: number; costUzs: number };

const CSV_SEPARATOR = ";";

export function fuelReportToCsv(rows: FuelReportRow[]): string {
  const header = ["Plate", "Liters", "Sum"].join(CSV_SEPARATOR);
  const lines = rows.map((row) =>
    [row.plate, row.liters.toFixed(2), Math.round(row.costUzs)].join(CSV_SEPARATOR),
  );
  return [header, ...lines].join("\n");
}

// Sinab ko'ring: qatorlarni o'zgartiring va CSV natijasini ko'ring.
const rows: FuelReportRow[] = [
  { plate: "01A123BC", liters: 45.5, costUzs: 568_750.4 },
  { plate: "10B456CD", liters: 120, costUzs: 1_500_000 },
];
console.log(fuelReportToCsv(rows));
```

Natijada tiplar kuchliroq bo'ldi (ustunlar nomi va formati aniq), kod qisqardi va o'qish uchun bitta funksiya yetarli. XLSX haqiqatan kerak bo'lganda, biz o'sha paytdagi talablarni (ko'p varaqmi? formatlashmi? kutubxona qaysi?) bilamiz va to'g'ri abstraksiyani shunda quramiz. Agar ikkinchi format hech qachon kelmasa, biz hech narsa yo'qotmadik.

Fowler'ning sharti bajarilganini ham tekshiring: funksiya kichik va testlangan bo'lsa, uni keyin `ReportFormatter` ga aylantirish bir necha daqiqalik ish.

## Qachon qo'llamaslik kerak

- **Qaytarilmaydigan qarorlar.** Ommaviy API, ma'lumotlar sxemasi, xavfsizlik modeli, identifikatorlar. Bu yerda kelajakni o'ylash oqilona, lekin minimal shaklda.
- **Kontrakt bilan belgilangan talab.** Agar shartnomada ikkinchi bosqich aniq yozilgan va sanasi belgilangan bo'lsa, bu spekulyatsiya emas. Shunda ham Fowler'ning delay va carry xarajatlarini hisoblang: ko'pincha uni baribir o'z vaqtida qurish afzal.
- **Arzon va murakkablik qo'shmaydigan tanlovlar.** Masalan, `amount` o'rniga `amountUzs` deb nomlash yoki sanani UTC'da saqlash. Fowler'ning so'zlariga ko'ra, bunday tanlovlar YAGNI doirasiga kirmaydi.
- **Kod sog'lig'i.** YAGNI test yozmaslik, refaktoring qilmaslik yoki xatolarni qayta ishlashni tashlab ketish uchun bahona emas. Bular YAGNI'ning sharti.
- **Kutubxona va platforma kodi.** Ko'p jamoa foydalanadigan ichki kutubxona yoki ommaviy SDK'da kengaytirish nuqtalari kerak bo'lishi mumkin, chunki foydalanuvchilarni oldindan bilmaysiz va o'zgartirish ularning kodini buzadi. Bu ham qaytarilmaydigan qaror turi.

## Stack'da: NestJS, React, Next.js

- **NestJS'da "har ehtimolga qarshi" qatlamlar.** `Controller -> Service -> Manager -> Repository -> DAO`, har biri faqat keyingisini chaqiradi. Ko'p hollarda `Controller -> Service -> Prisma/Kysely` yetarli. Repository qatlamini ma'lumot kirishini haqiqatan yashirish kerak bo'lganda qo'shing (95-dars).
- **Bitta implementatsiyali interfeyslar.** NestJS'da injection token va interfeys faqat ikkinchi implementatsiya yoki test'da almashtirish uchun kerak. Tashqi tizim (SMS, to'lov) uchun interfeys odatda o'zini oqlaydi, ichki domen servisi uchun esa ko'pincha yo'q.
- **React'da "universal" komponentlar.** Har bir prop'i optional bo'lgan, 20 ta variantni qo'llab-quvvatlaydigan `DataTable` ni bitta ekran uchun qurish. Avval aniq ekran uchun oddiy jadval, ikkinchi-uchinchi ekranda umumiylik ko'ringanda abstraksiya (8-dars, AHA).
- **Next.js'da.** Hali bitta til bo'lsa ham to'liq i18n infratuzilmasini, hali bitta tenant bo'lsa ham subdomain routing'ni qurish. Ammo qaytarilmaydigan qismlarni hisobga oling: masalan, URL tuzilmasi SEO va tashqi havolalar sababli keyin o'zgartirish qimmat bo'lishi mumkin.
- **TypeScript generiklari.** `function process<T, K extends keyof T, R = T[K]>(...)` - faqat bitta tip bilan chaqiriladigan funksiyada generiklar o'quvchiga yuk, xolos. Generikni ikkinchi tip paydo bo'lganda qo'shing.

## Xulosa

- YAGNI: taxminiy kelajak feature'larini hozir qurmang. Fowler bo'yicha erta qurish narxi to'rt xarajatdan iborat: build, delay, carry, repair.
- Bashorat to'g'ri chiqsa ham erta qurish arzon emas: delay va carry baribir to'lanadi.
- YAGNI refaktoring, testlar va continuous delivery'ga taalluqli emas, aksincha ularga tayanadi.
- KISS kerakli narsani qanday qurishni aytadi: eng oddiy yechim, oddiy esa kam murakkablik degani, kam qator emas.
- Speculative Generality smell'iga qarshi Collapse Hierarchy, Inline Function/Class va Remove Dead Code ishlatiladi.
- Qaytarilmaydigan qarorlar (API, sxema, xavfsizlik) ko'proq oldindan o'ylashni talab qiladi, lekin minimal shaklda.
