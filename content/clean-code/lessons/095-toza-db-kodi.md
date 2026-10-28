---
n: 95
slug: toza-db-kodi
title: "Ma'lumotlar bazasi kodi: repository, N+1, migratsiya"
summary: "Ma'lumotlar bazasi bilan ishlaydigan kod uch joyda buziladi: so'rovlar butun kod bo'ylab sochilib ketadi, sikl ichidagi so'rovlar N+1 muammosini beradi va sxema o'zgarishlari production'ni to'xtatadi. Bu darsda Prisma va Kysely misolida ularning toza yechimlarini ko'ramiz."
duration: 40
sources:
  - id: prisma-docs
    note: "Query optimization bo'limi: N+1 muammosining ta'rifi, include va in filtri, relationLoadStrategy join, findUnique dataloader batching"
  - id: kysely-docs
    note: "Kirish sahifasi (type-safe SQL query builder) va Migrations bo'limi: Migrator, up/down, migratsiyalar ilovaning joriy kodiga bog'liq bo'lmasligi va Kysely<any> ishlatish"
  - id: fowler-parallel-change
    note: "Expand, migrate, contract bosqichlari va ularning ma'lumotlar bazasi refaktoringiga qo'llanilishi"
quiz:
  - q: "Kod 200 ta mashina uchun sikl ichida `await prisma.fuelEvent.findMany({ where: { vehicleId } })` chaqiradi. Bu nima va qanday tuzatiladi?"
    options:
      - "N+1 muammosi: bitta so'rov bilan barcha mashinalar uchun `vehicleId: { in: ids }` yoki include bilan yuklash"
      - "Connection pool muammosi: pool hajmini oshirish"
      - "Indeks muammosi: vehicleId'ga indeks qo'shish yetarli"
      - "Muammo yo'q, Prisma buni avtomatik birlashtiradi"
    answer: 0
    explain: "Prisma hujjati N+1'ni natijalar bo'ylab sikl qilib, har bir natija uchun qo'shimcha so'rov yuborish deb ta'riflaydi. Prisma faqat findUnique chaqiruvlarini avtomatik batch qiladi, findMany'ni emas. Indeks har bir so'rovni tezlashtiradi, lekin 201 ta so'rov qoladi."
  - q: "Kysely hujjati nima uchun migratsiya fayllarida `Kysely<Database>` emas, `Kysely<any>` ishlatishni talab qiladi?"
    options:
      - "Kysely<any> tezroq ishlaydi"
      - "Kysely<Database> migratsiyalarda kompilyatsiya bo'lmaydi"
      - "Migratsiya vaqt bo'yicha muzlatilgan bo'lishi kerak: u ilovaning joriy tiplari va kodiga bog'lansa, sxema keyinroq o'zgarganda eski migratsiya buziladi"
      - "any tipi SQL injection'dan himoya qiladi"
    answer: 2
    explain: "Migratsiya o'z vaqtidagi sxema holatini o'zgartiradi. Joriy Database tipi esa eng so'nggi sxemani tasvirlaydi. Ularni bog'lash eski migratsiyani yangi kodga bog'laydi va u bir kun kompilyatsiya bo'lmay qoladi."
  - q: "`drivers.full_name` ustunini `first_name` va `last_name` ga bo'lish kerak. Ilova to'xtovsiz ishlashi kerak. To'g'ri ketma-ketlik qaysi?"
    options:
      - "Bitta migratsiyada eski ustunni o'chirib, yangilarini qo'shish va kodni bir vaqtda deploy qilish"
      - "Yangi ustunlarni qo'shish, kod ikkalasiga yozadigan qilish, ma'lumotni ko'chirish, o'qishni yangilariga o'tkazish, oxirida eski ustunni o'chirish"
      - "Avval eski ustunni o'chirish, keyin yangilarini qo'shish"
      - "Yangi jadval ochib, eski jadvalni o'chirish"
    answer: 1
    explain: "Bu parallel change: expand (yangi ustunlar, ikki tomonga yozish), migrate (backfill va o'qishni o'tkazish), contract (eski ustunni o'chirish). Bitta migratsiyada o'chirish deploy paytida eski kod versiyasini sindiradi."
  - q: "Repository'ning `findAll(): Promise<Vehicle[]>` va `findById(id)` metodlari bor. Servis `findAll()` ni chaqirib, JavaScript'da `.filter(v => v.companyId === id)` qiladi. Asosiy muammo nima?"
    options:
      - "filter metodi sekin"
      - "Repository juda kichik"
      - "findAll async bo'lmasligi kerak"
      - "Generic repository so'rov niyatini yashiradi: filtr bazada emas, xotirada bajariladi va jadval o'sishi bilan barcha qatorlar yuklanadi"
    answer: 3
    explain: "Generic CRUD repository ko'pincha domen so'rovlarini ifodalay olmaydi va servislar uni chetlab o'tadi yoki xotirada filtrlaydi. Toza repository domen tilidagi metod beradi: findActiveByCompany(companyId)."
  - q: "Qaysi holatda Prisma'ning `relationLoadStrategy: \"join\"` foydali bo'lishi mumkin?"
    options:
      - "Har doim, chunki join har doim tezroq"
      - "Relation'lar bilan yuklashda alohida so'rovlar o'rniga bitta DB so'rovi kerak bo'lganda, o'lchov bilan tasdiqlangandan keyin"
      - "Faqat MongoDB bilan"
      - "Faqat yozish operatsiyalarida"
    answer: 1
    explain: "Hujjatga ko'ra join strategiyasi relation'ni bitta DB so'rovida bajaradi. Lekin u har doim ham tezroq emas: katta jadvallarda join natijasi ko'p takroriy qatorlar beradi. Qaror o'lchov bilan qilinadi."
task:
  title: "Hisobot servisidagi N+1 va sochilgan so'rovlarni tozalash"
  prompt: |
    Quyidagi servis kompaniya bo'yicha oylik yoqilg'i hisobotini tuzadi. U ishlaydi, lekin 300 mashinali kompaniyada 600 dan ortiq so'rov yuboradi va so'rov mantiqi servis ichida.

    1. N+1'ni yo'qoting: mashinalar soni qancha bo'lishidan qat'i nazar so'rovlar soni o'zgarmas bo'lsin.
    2. So'rovlarni domen tilidagi metodli repository'ga ajrating (Prisma ishlatiladi).
    3. Faqat kerakli maydonlarni yuklang.
    4. Hisobot hisoblashini sof funksiya qiling.
  lang: ts
  starter: |
    import { Injectable } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";

    @Injectable()
    export class FuelReportService {
      constructor(private readonly prisma: PrismaService) {}

      async monthly(companyId: string, from: Date, to: Date) {
        const vehicles = await this.prisma.vehicle.findMany({ where: { companyId } });
        const rows = [];
        for (const v of vehicles) {
          const refuels = await this.prisma.refuel.findMany({
            where: { vehicleId: v.id, createdAt: { gte: from, lt: to } },
          });
          const drains = await this.prisma.fuelDrain.findMany({
            where: { vehicleId: v.id, detectedAt: { gte: from, lt: to } },
          });
          const refueled = refuels.reduce((s, r) => s + r.liters, 0);
          const drained = drains.reduce((s, d) => s + d.liters, 0);
          rows.push({
            plate: v.plate,
            refueled,
            drained,
            suspicious: refueled > 0 && drained / refueled > 0.1,
          });
        }
        return rows;
      }
    }
  solution: |
    import { Injectable } from "@nestjs/common";
    import { PrismaService } from "../prisma/prisma.service";

    export type Period = { from: Date; to: Date };
    export type VehicleFuelTotals = { vehicleId: string; plate: string; refueledLiters: number; drainedLiters: number };
    export type FuelReportRow = { plate: string; refueledLiters: number; drainedLiters: number; suspicious: boolean };

    @Injectable()
    export class FuelStatsRepository {
      constructor(private readonly prisma: PrismaService) {}

      async totalsByCompany(companyId: string, period: Period): Promise<VehicleFuelTotals[]> {
        const vehicles = await this.prisma.vehicle.findMany({
          where: { companyId },
          select: { id: true, plate: true },
          orderBy: { plate: "asc" },
        });
        const vehicleIds = vehicles.map((v) => v.id);

        const [refuels, drains] = await Promise.all([
          this.prisma.refuel.groupBy({
            by: ["vehicleId"],
            where: { vehicleId: { in: vehicleIds }, createdAt: { gte: period.from, lt: period.to } },
            _sum: { liters: true },
          }),
          this.prisma.fuelDrain.groupBy({
            by: ["vehicleId"],
            where: { vehicleId: { in: vehicleIds }, detectedAt: { gte: period.from, lt: period.to } },
            _sum: { liters: true },
          }),
        ]);

        const refueledBy = new Map(refuels.map((r) => [r.vehicleId, r._sum.liters ?? 0]));
        const drainedBy = new Map(drains.map((d) => [d.vehicleId, d._sum.liters ?? 0]));

        return vehicles.map((v) => ({
          vehicleId: v.id,
          plate: v.plate,
          refueledLiters: refueledBy.get(v.id) ?? 0,
          drainedLiters: drainedBy.get(v.id) ?? 0,
        }));
      }
    }

    const SUSPICIOUS_DRAIN_RATIO = 0.1;

    export function buildFuelReport(totals: VehicleFuelTotals[]): FuelReportRow[] {
      return totals.map((t) => ({
        plate: t.plate,
        refueledLiters: t.refueledLiters,
        drainedLiters: t.drainedLiters,
        suspicious: t.refueledLiters > 0 && t.drainedLiters / t.refueledLiters > SUSPICIOUS_DRAIN_RATIO,
      }));
    }

    @Injectable()
    export class FuelReportService {
      constructor(private readonly stats: FuelStatsRepository) {}

      async monthly(companyId: string, period: Period): Promise<FuelReportRow[]> {
        return buildFuelReport(await this.stats.totalsByCompany(companyId, period));
      }
    }
  solutionNotes: |
    - So'rovlar soni endi doimiy: 1 ta mashinalar uchun va 2 ta parallel `groupBy`. Starter'da bu 1 + 2N edi.
    - Yig'indini baza hisoblaydi (`_sum`): minglab qatorni Node'ga tortib, `reduce` qilish shart emas.
    - `select` bilan faqat `id` va `plate` yuklanadi. `findMany` hamma ustunlarni olib kelardi.
    - Repository metodi domen tilida (`totalsByCompany`) va so'rov niyatini ochiq aytadi. Generic `findAll` emas.
    - Hisob-kitob (`buildFuelReport`) sof funksiya: uni bazasiz, oddiy massiv bilan test qilish mumkin (67-dars). 0.1 nomlangan konstantaga aylandi.
    - Juda katta kompaniyalarda `in` ro'yxati uzun bo'lishi mumkin. Unda `vehicle: { companyId }` relation filtri yoki Kysely/raw SQL bilan bitta `JOIN ... GROUP BY` so'rov yaxshiroq. Qaror o'lchov bilan qilinadi.
  checklist:
    - "Sikl ichida await qilingan DB so'rovi qolmadi"
    - "So'rovlar soni mashinalar soniga bog'liq emas"
    - "Faqat kerakli ustunlar yuklanadi (select yoki agregatsiya)"
    - "Repository metodi nomi domen so'rovini ifodalaydi"
    - "Hisobot hisoblash mantiqi bazasiz test qilinadigan sof funksiya"
---

## Muammo

Ma'lumotlar bazasi bilan ishlaydigan kod boshqa koddan ikki jihati bilan farq qiladi. Birinchisi: uning narxi ko'rinmaydi. `await prisma.refuel.findMany(...)` qatori `array.filter(...)` kabi oddiy ko'rinadi, lekin u tarmoq bo'ylab so'rov, indeks qidiruvi va serializatsiya. Sikl ichida yozilsa, 10 ta mashina bilan test muhitida sezilmaydi va 3000 ta mashina bilan production'da sahifani 20 soniya yuklaydi.

Ikkinchisi: ma'lumotlar bazasi sxemasi koddan uzoqroq yashaydi va uni o'zgartirish qimmatroq. Funksiya nomini IDE bir soniyada o'zgartiradi. Ustun nomini o'zgartirish esa migratsiya, deploy ketma-ketligi, eski va yangi kod versiyalarining bir vaqtda ishlashi va ehtimol millionlab qatorni ko'chirishni talab qiladi.

Bulardan uchta tipik og'riq kelib chiqadi:

- **Sochilgan so'rovlar.** Prisma chaqiruvlari controller'larda, service'larda, cron'larda, har birida bir oz boshqacha `where`. "Faqat faol mashinalar" qoidasi o'n joyda takrorlanadi va bir joyda `deletedAt: null` unutilgan.
- **N+1.** Ro'yxat olinadi, keyin har bir element uchun qo'shimcha so'rov.
- **Xavfli migratsiyalar.** Ustun bitta migratsiyada o'chiriladi va deploy paytidagi bir necha daqiqada eski kod versiyasi xato beradi.

## Asosiy g'oya

Uchta qoida:

1. **So'rovlarni domen tilida nomlangan joyga yig'ing.** Repository yoki query modul `findActiveByCompany`, `totalsByCompany` kabi metodlar beradi. U so'rov niyatini nomlaydi va biznes qoidasini (masalan, "o'chirilmaganlar") bitta joyda saqlaydi.
2. **So'rovlar sonini ma'lumot hajmiga bog'lamang.** Sikl ichida `await` qilingan so'rov - signal. Kerakli ma'lumotni to'plam bilan (`in`, join, agregatsiya) yuklang.
3. **Sxemani parallel change bilan o'zgartiring.** Expand, migrate, contract: avval yangisini qo'shing, keyin o'tkazing, oxirida eskisini olib tashlang. Migratsiya fayllari esa vaqtda muzlatilgan bo'lsin.

## Chuqurroq: har bir qoidaning nozik joylari

### Repository: qaysi turi foydali

"Repository" so'zi ostida ikki xil narsa tushuniladi. Birinchisi - **generic CRUD repository**: `findAll`, `findById`, `create`, `update`, `delete`. Prisma va Kysely bilan bu deyarli har doim ortiqcha qatlam, chunki Prisma Client'ning o'zi aynan shunday API. Undan ham yomoni: generic interfeys domen so'rovlarini ifodalay olmaydi, servislar `findAll()` ni chaqirib, JavaScript'da filtrlay boshlaydi yoki repository'ni chetlab o'tib to'g'ridan-to'g'ri Prisma'ga murojaat qiladi. Bu 52-darsdagi sayoz modulning klassik namunasi.

Ikkinchisi - **domen so'rovlari moduli**: metodlar biznes savollarini nomlaydi. `vehiclesNeedingInspection(companyId, today)`, `totalsByCompany(companyId, period)`. Bu chuqur modul: oddiy interfeys orqasida murakkab so'rov, indekslar haqidagi bilim, multi-tenant filtri yashiringan. U 82-darsdagi port/adapter g'oyasiga ham mos: servis "qanday yuklash" emas, "nima kerak" deydi.

Yana bir muhim nuqta: repository qaytaradigan tip. Prisma generatsiya qilgan to'liq model tipini butun ilova bo'ylab tarqatish sxemani har bir qatlamga bog'laydi. `select` bilan faqat kerakli maydonlarni olish ham tarmoq trafikini kamaytiradi, ham qatlamlar orasidagi shartnomani toraytiradi.

### N+1 va uning yechimlari

Prisma hujjati N+1 ni natijalar bo'ylab sikl qilib, har bir natija uchun bitta qo'shimcha so'rov yuborish deb ta'riflaydi. Yechimlar:

- **`include` (nested read).** Foydalanuvchilar va ularning postlarini olish. Prisma buni standart holatda alohida so'rovlar bilan bajaradi (bitta asosiy, bitta relation uchun), N ta emas.
- **`in` filtri.** Id ro'yxatini yig'ib, bitta so'rovda yuklash va xotirada guruhlash.
- **`relationLoadStrategy: "join"`.** Relation'ni bazada join bilan, bitta so'rovda bajaradi. Hujjat buning cheklovlarini ham aytadi, va join har doim tezroq emas: bitta-ko'p munosabatda ota qatorlar takrorlanadi.
- **Avtomatik batching.** Prisma'ning dataloader'i bir xil tick'dagi `findUnique()` chaqiruvlarini bitta `findMany` va `IN` filtriga birlashtiradi. Bu GraphQL resolver'larda foydali, lekin hujjat ta'kidlaganidek `findMany` uchun ishlamaydi.

Agregatsiya uchun esa eng yaxshi yo'l - hisoblashni bazaga topshirish: `groupBy` va `_sum`, yoki Kysely'da `GROUP BY`. Minglab qatorni Node'ga tortib `reduce` qilish - N+1'ning yaqin qarindoshi.

### Kysely: SQL'ni yashirmaydigan tiplangan qatlam

Kysely o'zini type-safe va avtoto'ldirishga qulay TypeScript SQL query builder deb ta'riflaydi. U ORM emas: relation, lazy loading, entity holati yo'q. Siz yozgan narsa SQL'ga yaqin va natija tipi so'rovdan chiqariladi. Bu murakkab hisobot so'rovlari uchun qulay: `JOIN`, `GROUP BY`, window funksiyalar ochiq ko'rinadi va N+1 tasodifan paydo bo'lmaydi, chunki yashirin so'rov yo'q.

Ko'p loyihalarda ikkalasi birga ishlatiladi: oddiy CRUD uchun Prisma, og'ir o'qish so'rovlari uchun Kysely yoki raw SQL. Bu normal, lekin ikkalasi ham repository orqasida bo'lsa, servis qaysi vosita ishlatilganini bilmaydi.

### Migratsiyalar: muzlatilgan va bosqichli

Kysely Migrations hujjati ikki muhim qoidani aytadi. Birinchisi: har bir migratsiya `up` va `down` funksiyalarini eksport qiladi va `Kysely<Database>` emas, `Kysely<any>` oladi. Ikkinchisi, sababi bilan: migratsiyalar ilovaning joriy kodiga hech qachon bog'liq bo'lmasligi kerak, ular vaqtda muzlatilgan. Joriy `Database` tipi eng so'nggi sxemani tasvirlaydi, migratsiya esa o'z vaqtidagi holatni. Bu qoida Prisma migratsiyalari va TypeORM uchun ham to'g'ri: migratsiya ichida ilovaning servislarini yoki joriy model tiplarini import qilmang.

Danilo Satoning *ParallelChange* maqolasi expand-migrate-contract naqshini beradi va ma'lumotlar bazasi refaktoringlarining ko'pchiligi shu naqshga mos kelishini qayd etadi: migrate bosqichi eski va yangi sxema o'rtasidagi o'tish davri. Amalda:

1. **Expand.** Yangi ustun yoki jadval qo'shiladi (nullable yoki default bilan). Kod ikkalasiga yozadi, eskisidan o'qiydi.
2. **Migrate.** Eski ma'lumot backfill qilinadi (katta jadvalda bo'laklab). O'qish yangi ustunga o'tkaziladi.
3. **Contract.** Hech kim eski ustunni ishlatmasligi tasdiqlangandan keyin, alohida deploy'da, u o'chiriladi.

Har bir bosqich alohida deploy. Bu 80-darsdagi katta refaktoring g'oyalarining ma'lumotlar bazasi versiyasi.

## Misol: sochilgan so'rovdan domen metodiga

Yomon variant. Bu qoida uch joyda takrorlanadi va har birida biroz boshqacha:

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// dispatch.service.ts
export async function availableForDispatch(companyId: string) {
  return prisma.vehicle.findMany({ where: { companyId, status: "active", deletedAt: null } });
}

// map.controller.ts
export async function vehiclesOnMap(companyId: string) {
  const all = await prisma.vehicle.findMany({ where: { companyId } });
  return all.filter((v) => v.status === "active");
}

// billing.cron.ts
export async function billableVehicles(companyId: string) {
  const list = await prisma.vehicle.findMany({ where: { companyId, status: "active" } });
  const result = [];
  for (const v of list) {
    const tracker = await prisma.tracker.findUnique({ where: { vehicleId: v.id } });
    if (tracker?.isOnline) result.push({ ...v, tracker });
  }
  return result;
}
```

Xaritada o'chirilgan mashinalar ko'rinadi (`deletedAt` unutilgan), filtr xotirada, billing'da N+1 va har bir joyda barcha ustunlar yuklanadi.

Toza variant:

```ts
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export type VehicleSummary = { id: string; plate: string; lat: number | null; lng: number | null };

@Injectable()
export class VehicleQueries {
  constructor(private readonly prisma: PrismaService) {}

  private operational(companyId: string): Prisma.VehicleWhereInput {
    return { companyId, status: "active", deletedAt: null };
  }

  listOperational(companyId: string): Promise<VehicleSummary[]> {
    return this.prisma.vehicle.findMany({
      where: this.operational(companyId),
      select: { id: true, plate: true, lat: true, lng: true },
    });
  }

  listBillable(companyId: string): Promise<VehicleSummary[]> {
    return this.prisma.vehicle.findMany({
      where: { ...this.operational(companyId), tracker: { is: { isOnline: true } } },
      select: { id: true, plate: true, lat: true, lng: true },
    });
  }
}
```

"Ishlayotgan mashina" ta'rifi bitta joyda va nomlangan (`operational`). Billing so'rovi relation filtri bilan bitta so'rov, sikl yo'q. Qaytariladigan tip - `VehicleSummary`, to'liq Prisma modeli emas.

## Qachon qo'llamaslik kerak

- **Kichik servis yoki prototip.** Ikki endpoint'li servis uchun alohida repository klassi ortiqcha. Prisma Client'ni to'g'ridan-to'g'ri servisda ishlatish maqbul, toki bir xil so'rov ikkinchi joyda paydo bo'lmaguncha. Ikkinchi takror - ajratish uchun signal (8-dars, uch marta qoidasi).
- **Generic repository "kelajakda ORM almashtirish uchun".** ORM almashinishi kam uchraydi va bo'lganda generic interfeys baribir yordam bermaydi, chunki so'rov semantikasi farq qiladi. Bu YAGNI (9-dars).
- **Kichik ro'yxatdagi "N+1".** Har doim 3 ta element bo'ladigan sozlamalar ro'yxati uchun sikldagi so'rov o'lchanadigan muammo emas. Ammo bu "har doim" haqiqatan kafolatlanganini tekshiring.
- **Har bir migratsiya uchun expand-contract.** Hali production'ga chiqmagan jadval yoki texnik xizmat oynasi bor ichki tizim uchun bitta migratsiya yetarli. Parallel change to'xtovsiz ishlash talab qilinganda kerak.
- **Har doim join.** Join bitta so'rov beradi, lekin natija hajmi oshishi mumkin. Ba'zan ikki oddiy so'rov bitta murakkab join'dan tezroq va o'qilishi oson. O'lchang (99-dars).

## Stack'da: amaliy maslahatlar

- **So'rov loglari.** Development'da Prisma'ning query log'ini yoqing va bitta HTTP so'rov uchun so'rovlar sonini kuzating. Integratsion testda so'rovlar sonini assert qilish N+1 regressiyasini ushlaydi (68-dars).
- **Testcontainers.** Repository'ni mock bilan emas, haqiqiy PostgreSQL bilan test qiling: `where` noto'g'ri bo'lsa, faqat haqiqiy baza buni ko'rsatadi.
- **Unique indeks va idempotentlik.** "Avval tekshir, keyin yoz" naqshi race condition'ga ochiq (87-dars). Biznes invariantini indeks yoki constraint bilan bazada himoya qiling va Prisma'ning unique buzilish xatosini (`P2002`) domen xatosiga tarjima qiling.
- **Tranzaksiyalar.** Bir nechta yozuv birga muvaffaqiyatli bo'lishi kerak bo'lsa, `prisma.$transaction` yoki Kysely'da `db.transaction()`. Tranzaksiya chegarasi servis darajasida qaror qilinadi, repository ichida yashirin emas.

## Xulosa

- Ma'lumotlar bazasi so'rovining narxi kodda ko'rinmaydi, shuning uchun uni struktura orqali ko'rinadigan qiling.
- Generic CRUD repository emas, domen savollarini nomlaydigan so'rov metodlari: qoida bitta joyda, tip minimal.
- Sikl ichidagi `await` - N+1 signali: `in`, include, relation filtri yoki bazadagi agregatsiya bilan almashtiring.
- Migratsiyalar vaqtda muzlatilgan, ilova kodiga bog'liq emas. Sxemani expand, migrate, contract bilan o'zgartiring.
- Kichik loyihada qatlamlarni ko'paytirmang, lekin takror paydo bo'lganda darhol yig'ing.
