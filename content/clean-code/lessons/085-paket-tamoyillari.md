---
n: 85
slug: paket-tamoyillari
title: "Komponent tamoyillari: ADP, SDP, SAP"
summary: "Klasslar uchun SOLID bo'lgani kabi, komponentlar (paketlar, modullar, workspace'lar) uchun ham tamoyillar bor. Bu darsda Martin'ning uchta cohesion tamoyilini qisqacha, uchta coupling tamoyilini (ADP, SDP, SAP) esa instability va abstractness metrikalari bilan chuqur ko'ramiz va ularni dependency-cruiser bilan tekshiramiz."
duration: 40
sources:
  - id: clean-arch
    note: "Komponentlar haqidagi qism: component cohesion (REP, CCP, CRP) va component coupling (ADP, SDP, SAP), instability va abstractness metrikalari, main sequence"
  - id: dependency-cruiser
    note: "README va rules reference: forbidden qoidalar, circular, moreUnstable sharti, group matching va --metrics"
quiz:
  - q: "`fleet-core` paketiga 6 ta paket bog'liq (fan-in = 6), u esa 2 ta paketga bog'liq (fan-out = 2). Uning instability'si qancha?"
    options:
      - "0.75"
      - "0.25"
      - "0.33"
      - "3"
    answer: 1
    explain: "I = Fan-out / (Fan-in + Fan-out) = 2 / (6 + 2) = 0.25. Paket nisbatan barqaror: ko'p narsa unga tayanadi, u esa kam narsaga tayanadi."
  - q: "Stable Dependencies Principle qaysi bog'liqlikni taqiqlaydi?"
    options:
      - "I = 0.2 bo'lgan paketning I = 0.8 bo'lgan paketga bog'lanishini"
      - "I = 0.8 bo'lgan paketning I = 0.2 bo'lgan paketga bog'lanishini"
      - "Har qanday ikki paket o'rtasidagi bog'liqlikni"
      - "Faqat aylanma bog'liqliklarni"
    answer: 0
    explain: "SDP: barqarorlik yo'nalishida bog'lan. Komponentning I'si u bog'lanadigan komponentlarning I'sidan katta bo'lishi kerak. Barqaror paket (0.2) beqaror paketga (0.8) bog'lansa, beqaror paketning har bir o'zgarishi barqarorini ham silkitadi."
  - q: "`pricing` paketi juda barqaror (I = 0.05), lekin unda faqat konkret klasslar bor (A = 0). Main sequence nuqtai nazaridan u qayerda va nima uchun bu muammo?"
    options:
      - "Zone of uselessness'da; uni o'chirish kerak"
      - "Main sequence ustida; hammasi yaxshi"
      - "Zone of pain'da; ko'p narsa unga bog'liq, lekin uni kengaytirib bo'lmaydi, shuning uchun har qanday o'zgarish qimmat"
      - "Bu metrikalar faqat Java uchun"
    answer: 2
    explain: "(0, 0) atrofi - zone of pain: barqaror va konkret. Agar u tez-tez o'zgarishi kerak bo'lsa, og'riq katta. Martin barqaror, lekin kam o'zgaradigan narsalar (masalan, standart kutubxona) bu zonada zararsiz bo'lishi mumkinligini ham aytadi."
  - q: "`orders` paketi `billing`ga, `billing` `notifications`ga, `notifications` esa `orders`ning bitta tipiga bog'liq. ADP'ga ko'ra bu siklni qanday buzish mumkin?"
    options:
      - "Uchala paketni bitta paketga birlashtirish yagona yo'l"
      - "Siklni e'tiborsiz qoldirish, chunki TypeScript uni qo'llab-quvvatlaydi"
      - "Tiplarni `any` qilish"
      - "Dependency Inversion qo'llash (interfeysni bog'liq tomonga ko'chirish) yoki umumiy narsani yangi alohida komponentga chiqarish"
    answer: 3
    explain: "Martin siklni buzishning ikki usulini beradi: DIP yordamida bog'liqlik yo'nalishini teskari qilish yoki ikkala tomon bog'liq bo'lgan narsani yangi komponentga chiqarish."
  - q: "Common Reuse Principle nimani maslahat beradi?"
    options:
      - "Komponent foydalanuvchilarini ular ishlatmaydigan narsalarga bog'liq qilmang: birga qayta ishlatiladigan klasslar birga, birga ishlatilmaydiganlari alohida bo'lsin"
      - "Bir xil sabab va bir vaqtda o'zgaradigan klasslarni birga yig'ing"
      - "Har bir klass alohida paketda bo'lsin"
      - "Barcha umumiy kodni `utils` paketiga qo'ying"
    answer: 0
    explain: "Ikkinchi variant - CCP. CRP ISP'ning komponent darajasidagi ko'rinishi: kerak bo'lmagan narsaga bog'liqlik ortiqcha qayta build va qayta deploy degani."
  - q: "dependency-cruiser'ning `moreUnstable` sharti qanday ishlatiladi?"
    options:
      - "Faqat aylanma bog'liqliklarni topish uchun"
      - "`to: { moreUnstable: true }` bilan modul o'zidan beqarorroq modulga bog'langan holatlarni ushlab, SDP buzilishini xabar qilish uchun"
      - "Paket hajmini o'lchash uchun"
      - "Test coverage'ni hisoblash uchun"
    answer: 1
    explain: "Hujjatga ko'ra `moreUnstable: true` bog'liqlik o'zini chaqirgan moduldan yuqoriroq instability'ga ega bo'lganda mos keladi va aynan SDP tekshiruvi uchun mo'ljallangan. `scope: folder` bilan papka darajasida ham ishlaydi."
task:
  title: "Monorepo'dagi siklni buzish va SDP'ni tekshirish"
  prompt: |
    Monorepo'da uchta paket bor. `@fleet/billing` oylik hisobni hisoblaydi va `@fleet/telemetry`dan masofa oladi. `@fleet/telemetry` esa tarif darajasiga qarab GPS nuqtalarini qanchalik tez-tez saqlashni hal qilish uchun `@fleet/billing`dagi `getTariffPlan`ni chaqiradi. Bu sikl.

    1. Har bir paketning hozirgi fan-in, fan-out va I qiymatini hisoblang.
    2. Siklni Dependency Inversion yoki yangi komponent bilan buzing.
    3. Yangi tuzilmada har bir bog'liqlik SDP'ga mos kelishini tekshiring.
    4. Siklni va SDP buzilishini CI'da ushlaydigan dependency-cruiser qoidalarini yozing.
  lang: ts
  starter: |
    // packages/billing/src/index.ts
    import { distanceForMonth } from "@fleet/telemetry";

    export type TariffPlan = "basic" | "pro";

    const plans = new Map<string, TariffPlan>();

    export function getTariffPlan(companyId: string): TariffPlan {
      return plans.get(companyId) ?? "basic";
    }

    export async function monthlyInvoice(companyId: string, month: string): Promise<number> {
      const km = await distanceForMonth(companyId, month);
      const rate = getTariffPlan(companyId) === "pro" ? 120 : 80;
      return Math.round(km * rate);
    }

    // packages/telemetry/src/index.ts
    import { getTariffPlan } from "@fleet/billing";

    export async function distanceForMonth(companyId: string, month: string): Promise<number> {
      return 0; // haqiqiy hisoblash qisqartirilgan
    }

    export function sampleIntervalSeconds(companyId: string): number {
      return getTariffPlan(companyId) === "pro" ? 5 : 30;
    }
  solution: |
    // packages/tariffs/src/index.ts - yangi, barqaror va kichik komponent
    export type TariffPlan = "basic" | "pro";

    export interface TariffLookup {
      planFor(companyId: string): TariffPlan;
    }

    // packages/telemetry/src/index.ts - endi faqat @fleet/tariffs'ga bog'liq
    import type { TariffLookup } from "@fleet/tariffs";

    const SAMPLE_INTERVAL_SECONDS = { basic: 30, pro: 5 } as const;

    export function createTelemetry(tariffs: TariffLookup) {
      return {
        async distanceForMonth(companyId: string, month: string): Promise<number> {
          return 0; // haqiqiy hisoblash qisqartirilgan
        },
        sampleIntervalSeconds(companyId: string): number {
          return SAMPLE_INTERVAL_SECONDS[tariffs.planFor(companyId)];
        },
      };
    }
    export type Telemetry = ReturnType<typeof createTelemetry>;

    // packages/billing/src/index.ts - tariffs'ni implement qiladi, telemetry'dan foydalanadi
    import type { TariffLookup, TariffPlan } from "@fleet/tariffs";
    import type { Telemetry } from "@fleet/telemetry";

    const RATE_PER_KM_UZS: Record<TariffPlan, number> = { basic: 80, pro: 120 };

    export class InMemoryTariffs implements TariffLookup {
      private readonly plans = new Map<string, TariffPlan>();
      planFor(companyId: string): TariffPlan {
        return this.plans.get(companyId) ?? "basic";
      }
    }

    export async function monthlyInvoice(
      telemetry: Telemetry,
      tariffs: TariffLookup,
      companyId: string,
      month: string,
    ): Promise<number> {
      const km = await telemetry.distanceForMonth(companyId, month);
      return Math.round(km * RATE_PER_KM_UZS[tariffs.planFor(companyId)]);
    }

    // apps/api/src/main.ts - ulash (composition root)
    // const tariffs = new InMemoryTariffs();
    // const telemetry = createTelemetry(tariffs);
    // await monthlyInvoice(telemetry, tariffs, "c1", "2026-10");

    // .dependency-cruiser.js
    // module.exports = {
    //   forbidden: [
    //     { name: "no-circular", severity: "error", from: {}, to: { circular: true } },
    //     {
    //       name: "sdp-packages",
    //       comment: "Barqarorlik yo'nalishida bog'lan (SDP)",
    //       severity: "error",
    //       from: { path: "^packages/" },
    //       to: { path: "^packages/", moreUnstable: true },
    //       scope: "folder",
    //     },
    //   ],
    // };
  solutionNotes: |
    - Starter'da billing va telemetry bir-biriga bog'liq edi: ikkalasi ham fan-in = 1, fan-out = 1, I = 0.5, va ikkalasi bitta sikl ichida. Siklni buzmasdan ularni alohida chiqarib bo'lmaydi.
    - Yangi `@fleet/tariffs` faqat tip va interfeysdan iborat: fan-in = 2 (billing, telemetry), fan-out = 0, I = 0. U to'liq abstrakt (A = 1), ya'ni (A=1, I=0) - main sequence'ning yuqori chap uchi. Barqaror va abstrakt.
    - `@fleet/telemetry`: fan-in = 1 (billing), fan-out = 1 (tariffs), I = 0.5. `@fleet/billing`: fan-in = 0 (faqat ilova), fan-out = 2, I = 1 (apps/api'ni hisobga olmasak). Bog'liqliklar 1 -> 0.5 -> 0 yo'nalishida: SDP bajarildi.
    - Sikl DIP bilan buzildi: telemetry endi billing'ning konkret funksiyasini emas, `TariffLookup` interfeysini biladi. Implementatsiya billing'da, ulash esa composition root'da.
    - `import type` ishlatildi: tariffs'ga runtime bog'liqlik yo'q, lekin bu baribir source code bog'liqligi va metrikalarda hisobga olinadi.
    - dependency-cruiser'da `circular: true` siklni, `moreUnstable: true` va `scope: "folder"` papka darajasida SDP buzilishini ushlaydi.
  checklist:
    - "Har bir paket uchun I = Fan-out / (Fan-in + Fan-out) to'g'ri hisoblangan"
    - "Paketlar orasida sikl qolmagan"
    - "Har bir bog'liqlik beqarorroqdan barqarorroqqa yo'nalgan"
    - "Eng barqaror paket abstrakt (interfeys va tiplar)"
    - "CI'da sikl va SDP uchun qoida bor"
---

## Muammo

Loyiha o'sib, pnpm workspace yoki Nx monorepo'ga aylandi: `@fleet/core`, `@fleet/telemetry`, `@fleet/billing`, `@fleet/ui`, `@fleet/shared`. Bir necha oydan keyin quyidagilar boshlanadi:

- `@fleet/shared`dagi bitta yordamchi funksiya o'zgarsa, 14 ta paket qayta build bo'ladi va hamma testlar qayta yuradi.
- `billing` `telemetry`ni import qiladi, `telemetry` esa billing'dan tarif rejasini oladi. Ikkalasini alohida versiyalash yoki alohida test qilish imkonsiz.
- Eng ko'p ishlatiladigan `core` paketi har hafta o'zgaradi, chunki unda biznes qoidalarining konkret implementatsiyalari bor. Har bir o'zgarish butun monorepo'ni silkitadi.

Bu muammolar klass darajasida emas. Har bir klass SOLID bo'yicha toza bo'lishi mumkin. Muammo **komponentlar** (paket, workspace, deploy qilinadigan modul) orasidagi bog'liqliklar tuzilishida.

## Asosiy g'oya

Martin *Clean Architecture* kitobida komponentlar uchun oltita tamoyil beradi va ularni ikki guruhga bo'ladi.

**Component cohesion** - qaysi klasslar qaysi komponentga tegishli:

- **REP (Reuse/Release Equivalence Principle)** - qayta ishlatish birligi reliz birligi bilan bir xil. Qayta ishlatiladigan komponent versiyalanishi va reliz jarayoni bilan kuzatilishi kerak, uning ichidagi klasslar esa birgalikda reliz qilinishi mantiqiy bo'lishi kerak.
- **CCP (Common Closure Principle)** - bir xil sabab bilan va bir vaqtda o'zgaradigan klasslarni bitta komponentga yig'ing. Bu SRP'ning komponent darajasidagi ko'rinishi.
- **CRP (Common Reuse Principle)** - komponent foydalanuvchilarini ular ishlatmaydigan narsalarga bog'liq qilmang. Bu ISP'ning komponent darajasidagi ko'rinishi.

Martin bu uchtasi o'zaro kuchlanishda ekanini ko'rsatadi: REP va CCP komponentlarni kattalashtirishga, CRP esa kichraytirishga intiladi. Loyiha boshida odatda CCP muhimroq (o'zgartirish qulayligi), yetuk bosqichda REP va CRP (qayta ishlatish).

**Component coupling** - komponentlar orasidagi munosabat. Bu darsning asosiy qismi:

- **ADP (Acyclic Dependencies Principle)** - komponent bog'liqlik grafigida sikl bo'lmasin.
- **SDP (Stable Dependencies Principle)** - barqarorlik yo'nalishida bog'laning.
- **SAP (Stable Abstractions Principle)** - komponent qanchalik barqaror bo'lsa, shunchalik abstrakt bo'lsin.

## Chuqurroq: metrikalar va tamoyillar

### ADP: sikllar

Sikl bo'lganda bir-biriga bog'liq komponentlar amalda bitta katta komponentga aylanadi: ularni alohida build qilib, alohida reliz qilib yoki alohida test qilib bo'lmaydi. Martin buni ko'p dasturchili jamoalarda kimdir boshqaning o'zgarishi tufayli ertasi kuni ishlamay qolgan kodni topishi bilan tasvirlaydi.

Siklni buzishning ikki usuli bor:

1. **Dependency Inversion.** Bog'liqlik yo'nalishini teskari qiling: interfeysni chaqiruvchi komponentga ko'chiring, implementatsiya boshqa tomonda qoladi.
2. **Yangi komponent.** Ikkala tomon bog'liq bo'lgan narsani yangi komponentga chiqaring va ikkalasi unga bog'lansin.

Martin bundan muhim xulosa chiqaradi: komponent tuzilmasini boshidan yuqoridan pastga loyihalab bo'lmaydi. U tizim o'sishi bilan, build va o'zgarish og'rig'iga javoban rivojlanadi.

### Instability metrikasi

Barqarorlik - bu o'zgarishning qanchalik qiyinligi. Ko'p narsa bog'liq bo'lgan komponentni o'zgartirish qiyin, shuning uchun u barqaror. Martin buni ikkita sanoq bilan o'lchaydi:

- **Fan-in** - komponentdan tashqaridagi, uning ichidagi klasslarga bog'liq bo'lgan klasslar soni (kiruvchi bog'liqliklar).
- **Fan-out** - komponent ichidagi, tashqi klasslarga bog'liq bo'lgan klasslar soni (chiquvchi bog'liqliklar).

**I = Fan-out / (Fan-in + Fan-out)**. Qiymat 0 dan 1 gacha. I = 0 - maksimal barqaror: unga boshqalar bog'liq, u esa hech narsaga bog'liq emas. I = 1 - maksimal beqaror: hech kim unga bog'liq emas, u esa boshqalarga bog'liq.

Muhim: "beqaror" yomon degani emas. dependency-cruiser hujjati buni yaxshi ifodalaydi: CLI yoki GUI komponenti odatda faqat boshqalarga bog'liq va 100% beqaror, bu uning tabiati. Har bir tizimda beqaror (tez o'zgaradigan) va barqaror qismlar bo'lishi kerak.

### SDP: barqarorlik yo'nalishida bog'laning

SDP talabi: komponentning I qiymati u bog'liq bo'lgan komponentlarning I qiymatidan katta bo'lishi kerak. Ya'ni bog'liqlik grafigi bo'ylab yurganda I kamayib borishi kerak. Agar barqaror komponent (I = 0.1) beqaror komponentga (I = 0.9) bog'lansa, beqaror komponentni o'zgartirish endi qiyinlashadi, chunki u barqaror komponentni va unga bog'liq hammani silkitadi. Bunday buzilish odatda DIP bilan tuzatiladi: barqaror komponentga kerak bo'lgan interfeys alohida, barqaror joyga chiqariladi.

### SAP va abstractness

Agar eng barqaror komponentlar o'zgartirilishi qiyin bo'lsa, ulardagi biznes qoidalari qanday rivojlanadi? Javob - OCP: barqaror komponent abstrakt bo'lsin, shunda u o'zgartirilmasdan kengaytiriladi.

**Abstractness A = Na / Nc**, bu yerda Nc - komponentdagi klasslar soni, Na - ulardan abstrakt klass va interfeyslar soni. A = 0 - butunlay konkret, A = 1 - faqat abstraksiyalar.

### Main sequence

A va I ni koordinata tekisligida (I gorizontal, A vertikal) joylashtirsak, ikki ideal nuqta bor: (I=0, A=1) - barqaror va abstrakt, (I=1, A=0) - beqaror va konkret. Ularni tutashtiradigan chiziq - **main sequence**: A + I = 1. Undan uzoqlashgan ikki zona:

- **Zone of pain** (0, 0) atrofi: barqaror va konkret. Ko'p narsa unga bog'liq, lekin uni kengaytirib bo'lmaydi, faqat o'zgartirish mumkin. Martin baza sxemasini klassik misol sifatida keltiradi. U barqaror, lekin kam o'zgaradigan narsalar (masalan, standart kutubxona) bu zonada zararsiz ekanini ham aytadi.
- **Zone of uselessness** (1, 1) atrofi: maksimal abstrakt, lekin hech kim unga bog'liq emas. Odatda hech qachon implement qilinmagan abstraksiyalar qoldig'i.

Main sequence'dan masofa: **D = |A + I - 1|**. D = 0 komponent chiziq ustida, D = 1 - eng uzoq zonalardan birida. Bu metrika komponentlarni ko'rib chiqish uchun nomzodlarni topishda yordam beradi.

### TypeScript'da hisoblash

TypeScript'da "klass" o'rniga modul (fayl) yoki eksport qilingan simvollar bilan hisoblash amaliyroq. dependency-cruiser `--metrics` opsiyasi bilan papkalar uchun dependents, dependencies va instability'ni hisoblaydi. Abstractness uchun tayyor vosita yo'q: interfeys va `type` eksportlarini barcha eksportlarga nisbatini o'zingiz hisoblashingiz mumkin. Bu taxminiy baho, Java'dagi klass sanog'ining aniq analogi emas.

## Misol: `shared` paketining tuzilishi

Yomon variant. Barcha "umumiy" narsalar bitta paketda:

```ts
// packages/shared/src/index.ts
export { formatUzs } from "./money";
export { haversineKm } from "./geo";
export { PrismaService } from "./prisma.service";
export { sendTelegram } from "./telegram";
export { TariffPlan, getTariffPlan } from "./tariffs";
export type { VehicleDto, InvoiceDto } from "./dtos";
```

Bu paket CRP'ni buzadi: `@fleet/ui` faqat `formatUzs` uchun uni import qiladi va Prisma hamda Telegram'ga tranzitiv bog'lanib qoladi. CCP ham buzilgan: tarif qoidalari va geo-matematika turli sabablarga ko'ra o'zgaradi. Paketning fan-in'i yuqori (hamma unga bog'liq), lekin u konkret va tez o'zgaradi: zone of pain.

Yaxshi variant. O'zgarish sababi va iste'molchi bo'yicha ajratish:

```ts
// packages/money/src/index.ts - barqaror, sof, kam o'zgaradi
export function formatUzs(amount: number): string {
  return new Intl.NumberFormat("uz-UZ").format(amount) + " so'm";
}

// packages/geo/src/index.ts - barqaror, sof
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

// packages/tariffs/src/index.ts - barqaror va abstrakt: faqat kontrakt
export type TariffPlan = "basic" | "pro";
export interface TariffLookup {
  planFor(companyId: string): TariffPlan;
}
```

Prisma servis va Telegram klienti ilovaning o'z infratuzilma qismiga ko'chdi: ular beqaror va konkret bo'lishi tabiiy, va ularga hech bir barqaror paket bog'lanmaydi.

Nima o'zgardi:

- **CRP:** UI endi faqat `@fleet/money`ga bog'liq, Prisma'ni bilmaydi.
- **CCP:** har bir paket bitta o'zgarish sababiga ega.
- **SAP:** eng ko'p iste'molchiga ega `tariffs` faqat kontraktdan iborat, uni implement qilish beqaror joyda.
- **Build narxi:** `geo` o'zgarsa, faqat unga bog'liq paketlar qayta build bo'ladi.

## Qachon qo'llamaslik kerak

- **Kichik loyiha yoki bitta paket.** Agar butun backend bitta NestJS ilovasi va uni bitta jamoa birga deploy qilsa, paketlar orasidagi metrikalar deyarli ma'nosiz. Modullar orasidagi sikllarni ushlash (ADP) baribir foydali, lekin I va A ni hisoblash ortiqcha.
- **Metrikani maqsadga aylantirish.** D = 0 ga erishish uchun interfeyslar qo'shish - bu Goodhart qonunining klassik holati. Hech qachon ikkinchi implementatsiyasi bo'lmaydigan interfeys A ni oshiradi, lekin dizaynni yaxshilamaydi. Metrikalar savol tug'dirish uchun, javob uchun emas.
- **Java'dan ko'chirilgan sanoq.** Martin metrikalarni klass va interfeyslar sanog'i bilan ta'riflaydi. TypeScript'da strukturaviy tiplar, funksiyalar va `type` alias'lar ko'p, shuning uchun A ning aniq qiymati shartli. Buni ochiq tan oling va trendga qarang.
- **Erta paketlash.** Monorepo'ni boshidan 20 ta paketga bo'lish komponent tuzilmasini yuqoridan loyihalash, Martin aynan buni mumkin emas deydi. Paketlarni og'riq paydo bo'lganda ajrating.
- **Stabil tashqi kutubxonalar.** `zod` yoki `date-fns` kabi kutubxonalar konkret va barqaror (zone of pain yaqinida), lekin ular kam o'zgaradi, shuning uchun ularga bog'lanish odatda muammo emas.

## Stack'da: dependency-cruiser

dependency-cruiser JS va TS loyihalardagi bog'liqliklarni o'z qoidalaringizga qarshi tekshiradi va buzilishlarni matn yoki grafik ko'rinishda xabar qiladi. `npx dependency-cruiser --init` sikllarni, `package.json`da yo'q bog'liqliklarni va orphan modullarni aniqlaydigan boshlang'ich qoidalar bilan konfiguratsiya yaratadi.

```ts
// .dependency-cruiser.cjs ning mazmuni (TS tipi bilan ko'rsatilgan)
type Rule = {
  name: string;
  severity: "error" | "warn" | "info";
  comment?: string;
  scope?: "module" | "folder";
  from: { path?: string; pathNot?: string | string[] };
  to: { path?: string; pathNot?: string | string[]; circular?: boolean; moreUnstable?: boolean };
};

export const forbidden: Rule[] = [
  { name: "no-circular", severity: "error", from: {}, to: { circular: true } },
  {
    name: "sdp",
    comment: "Barqarorlik yo'nalishida bog'lan",
    severity: "warn",
    scope: "folder",
    from: { path: "^packages/" },
    to: { path: "^packages/", moreUnstable: true },
  },
  {
    name: "domain-no-infra",
    severity: "error",
    from: { path: "^src/[^/]+/domain/" },
    to: { path: "node_modules/(@nestjs|@prisma|express)" },
  },
];
```

- **`circular: true`** - ADP. Hujjat `scope: "folder"` bilan papka darajasidagi sikllarni ham ushlash mumkinligini aytadi: modul darajasida sikl bo'lmasa ham, papkalar orasida bo'lishi mumkin.
- **`moreUnstable: true`** - SDP. Hujjatga ko'ra bu shart bog'liqlik o'zini chaqirgan moduldan yuqoriroq instability'ga ega bo'lganda mos keladi.
- **`--metrics`** - papkalar uchun dependents, dependencies va instability'ni hisoblaydi.
- **Group matching** (`$1`) - "modul faqat o'z papkasidagi yoki boshqa modulning public `index.ts`idagi fayllarga bog'lansin" kabi qoidalar (83-dars).

## Xulosa

- Komponent darajasida ham tamoyillar bor: cohesion uchun REP, CCP, CRP va coupling uchun ADP, SDP, SAP.
- ADP: komponent grafigida sikl bo'lmasin. Sikl DIP yoki yangi komponent bilan buziladi.
- I = Fan-out / (Fan-in + Fan-out). SDP: bog'liqliklar I kamayadigan yo'nalishda.
- A = Na / Nc. SAP: barqaror komponent abstrakt bo'lsin. Ideal komponentlar A + I = 1 main sequence yaqinida, zone of pain va zone of uselessness'dan uzoqda.
- Metrikalar savol beradi, javob emas. TypeScript'da ularni taxminiy deb qabul qiling va dependency-cruiser bilan sikl va SDP buzilishlarini CI'da ushlang.
