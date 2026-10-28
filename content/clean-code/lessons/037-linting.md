---
n: 37
slug: linting
title: "Linting: ESLint flat config va typescript-eslint"
summary: "Linter kod review'dagi takroriy izohlarni mashinaga topshiradi va kompilyator o'tkazib yuboradigan bug'larni topadi. Bu darsda ESLint flat config tuzilishini, typescript-eslint'ning shared config'larini, typed linting'ni va Next.js hamda NestJS uchun real eslint.config.mjs'ni ko'ramiz."
duration: 40
sources:
  - id: eslint-config
    note: "Configuration Files sahifasi: eslint.config.* fayllari, defineConfig va globalIgnores, files/ignores, extends, birlashtirish tartibi; shuningdek v10 migratsiya qo'llanmasi (eslintrc formati olib tashlangani)"
  - id: typescript-eslint
    note: "Getting Started, Typed Linting va Shared Configs sahifalari: recommended, strict, stylistic va *TypeChecked variantlari, projectService"
  - id: nextjs-docs
    note: "ESLint Plugin sahifasi: eslint-config-next, core-web-vitals va typescript konfiguratsiyalari, Next.js 16'da next lint olib tashlangani"
quiz:
  - q: "ESLint flat config'da bir faylga bir nechta konfiguratsiya obyekti mos kelsa nima bo'ladi?"
    options:
      - "Faqat birinchi mos kelgani qo'llanadi"
      - "Xato beradi"
      - "Ular tartib bo'yicha birlashtiriladi va to'qnashuvda keyingi obyekt oldingisini bekor qiladi"
      - "Faqat oxirgisi qo'llanadi, qolganlari e'tiborsiz"
    answer: 2
    explain: "Flat config massividagi mos keluvchi barcha obyektlar birlashtiriladi, ziddiyat bo'lsa keyingisi ustun. Shuning uchun `eslint-config-prettier` kabi \"o'chiruvchi\" konfiguratsiyalar massiv oxiriga qo'yiladi."
  - q: "Faqat `ignores` kalitiga ega obyekt qanday ishlaydi?"
    options:
      - "Global ignore sifatida: barcha konfiguratsiya obyektlari uchun bu fayllar e'tiborsiz qoldiriladi"
      - "Faqat o'zidan oldingi obyektga ta'sir qiladi"
      - "Hech narsa qilmaydi"
      - "Faqat `node_modules` uchun ishlaydi"
    answer: 0
    explain: "ESLint hujjatiga ko'ra faqat `ignores`dan iborat obyekt global ignore bo'ladi. Agar unda boshqa kalitlar (masalan, `rules`) ham bo'lsa, ignores faqat shu obyektga tegishli. Niyatni aniq ko'rsatish uchun `globalIgnores()` yordamchisi bor."
  - q: "typescript-eslint'ning `no-floating-promises` qoidasini ishlatish uchun nima kerak?"
    options:
      - "Hech narsa, u `recommended`da bor"
      - "Typed linting: `recommendedTypeChecked` (yoki shu qoidani alohida) va `parserOptions.projectService`"
      - "Prettier"
      - "`strict: false` tsconfig"
    answer: 1
    explain: "Bu qoida Promise qaytaradigan ifodani aniqlash uchun tip ma'lumotini talab qiladi. U `recommendedTypeChecked`ga kiradi va typed linting yoqilgan bo'lishi kerak. Oddiy `recommended` faqat sintaksis asosidagi qoidalarni beradi."
  - q: "Jamoa `strictTypeChecked`ni yoqmoqchi. typescript-eslint hujjati bu haqda qaysi ogohlantirishni beradi?"
    options:
      - "U faqat JS fayllari uchun"
      - "U Prettier bilan ishlamaydi"
      - "U eskirgan"
      - "`strict` konfiguratsiyalari semver bo'yicha barqaror hisoblanmaydi: minor versiyalarda yangi qoidalar qo'shilishi mumkin"
    answer: 3
    explain: "Hujjat `strict` va `strictTypeChecked` semver bo'yicha barqaror emasligini aytadi. Ya'ni yangilanishdan keyin yangi xatolar paydo bo'lishi mumkin. Bu ularni ishlatmaslikka sabab emas, lekin yangilashni rejalashtirish kerak."
  - q: "Next.js 16 loyihasida `next lint` buyrug'i ishlamay qoldi. Nima sabab?"
    options:
      - "ESLint o'rnatilmagan"
      - "Next.js 16'da `next lint` olib tashlangan; ESLint CLI to'g'ridan-to'g'ri ishlatiladi (`eslint .`)"
      - "Next.js linting'ni qo'llab-quvvatlamaydi"
      - "`next lint` faqat Pages Router'da ishlaydi"
    answer: 1
    explain: "Next.js hujjatiga ko'ra 16-versiyadan `next lint` va `next.config`dagi `eslint` opsiyasi olib tashlangan. Migratsiya uchun codemod bor. Lint endi oddiy `eslint .` bilan ishga tushiriladi."
  - q: "Kodda `// eslint-disable-next-line` kommentlari ko'payib ketdi va ularning ba'zilari endi kerak emas. Qaysi sozlama ularni topadi?"
    options:
      - "`linterOptions.reportUnusedDisableDirectives`"
      - "`languageOptions.ecmaVersion`"
      - "`settings.react.version`"
      - "`files: [\"**/*\"]`"
    answer: 0
    explain: "`linterOptions.reportUnusedDisableDirectives` hech qanday xatoni bostirmayotgan disable kommentlarini xabar qiladi. Bu eskirgan \"o'lik\" kommentlarni avtomatik tozalashga yordam beradi (33-dars)."
task:
  title: "NestJS API uchun typed linting sozlash"
  prompt: |
    NestJS loyihasida ESLint bor, lekin faqat `recommended` qoidalar bilan. Production'da ikki marta bir xil turdagi bug bo'ldi: `await`siz chaqirilgan `repository.save()` va `if (user.isActive)` o'rniga `if (user.isActive())` yozilmagani (metod reference har doim truthy). Shuningdek, `eslint-plugin-prettier` ishlatiladi.

    Vazifa:
    1. `eslint.config.mjs` ni typed linting bilan qayta yozing (`recommendedTypeChecked`, `projectService`).
    2. JS konfiguratsiya fayllarida type-aware qoidalarni o'chiring.
    3. Test fayllarida (`*.spec.ts`) ba'zi `no-unsafe-*` qoidalarini yumshating va nega shunday qilganingizni kommentda yozing.
    4. Prettier'ni ESLint'dan ajrating (36-dars).
    5. Quyidagi starter kodda typed linting qaysi xatolarni topishini aniqlang va tuzating.
  lang: ts
  starter: |
    // src/vehicles/vehicles.service.ts
    import { Injectable } from "@nestjs/common";

    type Vehicle = { id: string; plate: string; isArchived(): boolean };

    interface VehicleRepository {
      findById(id: string): Promise<Vehicle | null>;
      save(vehicle: Vehicle): Promise<void>;
      archive(id: string): Promise<void>;
    }

    @Injectable()
    export class VehiclesService {
      constructor(private readonly repo: VehicleRepository) {}

      async archive(id: string): Promise<void> {
        const vehicle = await this.repo.findById(id);
        if (!vehicle) return;
        if (vehicle.isArchived) return;
        this.repo.archive(id);
      }

      async rename(id: string, plate: string): Promise<void> {
        const vehicle = await this.repo.findById(id);
        if (!vehicle) return;
        [vehicle].forEach(async (v) => {
          v.plate = plate;
          await this.repo.save(v);
        });
      }
    }
  solution: |
    // eslint.config.mjs
    // import { defineConfig, globalIgnores } from "eslint/config";
    // import js from "@eslint/js";
    // import tseslint from "typescript-eslint";
    // import globals from "globals";
    // import prettier from "eslint-config-prettier/flat";
    //
    // export default defineConfig([
    //   globalIgnores(["dist/**", "coverage/**"]),
    //   {
    //     files: ["**/*.ts"],
    //     extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    //     languageOptions: {
    //       globals: { ...globals.node },
    //       parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    //     },
    //     linterOptions: { reportUnusedDisableDirectives: "error" },
    //   },
    //   {
    //     // Testlarda jest mock'lari va supertest javoblari ko'pincha any tipida keladi.
    //     // Bu qoidalar testlarda foydadan ko'ra ko'proq shovqin beradi.
    //     files: ["**/*.spec.ts", "test/**/*.ts"],
    //     languageOptions: { globals: { ...globals.jest } },
    //     rules: {
    //       "@typescript-eslint/no-unsafe-assignment": "off",
    //       "@typescript-eslint/no-unsafe-member-access": "off",
    //     },
    //   },
    //   {
    //     files: ["**/*.{js,mjs,cjs}"],
    //     extends: [js.configs.recommended, tseslint.configs.disableTypeChecked],
    //   },
    //   prettier,
    // ]);

    // src/vehicles/vehicles.service.ts
    import { Injectable } from "@nestjs/common";

    type Vehicle = { id: string; plate: string; isArchived(): boolean };

    interface VehicleRepository {
      findById(id: string): Promise<Vehicle | null>;
      save(vehicle: Vehicle): Promise<void>;
      archive(id: string): Promise<void>;
    }

    @Injectable()
    export class VehiclesService {
      constructor(private readonly repo: VehicleRepository) {}

      async archive(id: string): Promise<void> {
        const vehicle = await this.repo.findById(id);
        if (!vehicle) return;
        if (vehicle.isArchived()) return;
        await this.repo.archive(id);
      }

      async rename(id: string, plate: string): Promise<void> {
        const vehicle = await this.repo.findById(id);
        if (!vehicle) return;
        vehicle.plate = plate;
        await this.repo.save(vehicle);
      }
    }
  solutionNotes: |
    - **`vehicle.isArchived` (chaqirilmagan metod):** metod reference har doim truthy, shuning uchun `archive` hech qachon ishlamasdi. Bu holatni `strictNullChecks` yoqilgan TypeScript'ning o'zi ham ko'pincha ushlaydi ("funksiya har doim aniqlangan, uni chaqirmoqchimidingiz?"), typescript-eslint'ning `no-unnecessary-condition` qoidasi (strictTypeChecked) esa kengroq holatlarni qamraydi. Kompilyator va linter qatlamlari bir-birini to'ldiradi.
    - **`this.repo.archive(id)` `await`siz:** `no-floating-promises` (recommendedTypeChecked) topadi. Xato bo'lsa u ushlanmasdi va metod muvaffaqiyatli tugagandek ko'rinardi.
    - **`forEach(async ...)`:** `no-misused-promises` topadi: `forEach` Promise'ni kutmaydi, `rename` saqlash tugashidan oldin qaytadi. Massiv bitta elementli bo'lgani uchun sikl umuman keraksiz edi.
    - **`projectService: true`** - har bir fayl uchun eng yaqin `tsconfig.json`ni avtomatik topadi, alohida `tsconfig.eslint.json` kerak emas. `tsconfigRootDir` ba'zi muhitlarda ildizni noto'g'ri aniqlash holatlari uchun qo'yildi.
    - **JS fayllar** uchun `disableTypeChecked`: ular TS loyihasiga kirmasligi mumkin va type-aware qoidalar ularda xato beradi.
    - **Testlar** uchun yumshatish kommentda asoslandi. Qoidalarni butunlay o'chirish emas, faqat shovqin beradiganlarini va faqat test fayllarida.
    - **Prettier** ESLint'dan ajratildi: `eslint-config-prettier/flat` oxirida, plagin yo'q.
  checklist:
    - "recommendedTypeChecked va projectService yoqilgan"
    - "JS fayllarda disableTypeChecked qo'llangan"
    - "Test fayllari uchun alohida, asoslangan override bor"
    - "await'siz Promise va forEach(async) tuzatildi"
    - "Chaqirilmagan metod sharti tuzatildi"
    - "eslint-config-prettier oxirida, eslint-plugin-prettier yo'q"
---

## Muammo

Kod review'da yana o'sha izohlar: "bu yerda `await` yo'q", "ishlatilmagan import", "`==` o'rniga `===`", "`any` ishlatmang", "bu `useEffect`da dependency yetishmaydi". Har bir izoh to'g'ri, lekin ularni odam yozmoqda. Odam esa charchaydi, bir PR'da 4 tasini topadi, keyingisida 2 tasini. Mashina esa har safar hammasini topadi.

Bundan ham muhim kategoriya - kompilyator o'tkazib yuboradigan bug'lar. TypeScript `this.repo.save(user)` ni `await`siz chaqirishga ruxsat beradi: bu tip jihatidan to'g'ri kod. Production'da esa xato ushlanmaydi va "unhandled rejection" logida yo'qoladi. `array.forEach(async (x) => ...)` ham kompilyatsiya bo'ladi, lekin hech narsani kutmaydi. Bunday xatolarni faqat tip ma'lumotidan foydalanadigan linter topadi.

Linter - bu jamoa kelishuvlarining bajariladigan shakli. Agar qoida faqat Confluence sahifasida yozilgan bo'lsa, unga hech kim amal qilmaydi. Agar u `eslint.config.mjs`da bo'lsa, CI uni har bir PR'da tekshiradi.

## Asosiy g'oya

### ESLint flat config

ESLint konfiguratsiyasi `eslint.config.js` (yoki `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`) faylida yoziladi. ESLint v10'da eski `.eslintrc` formati butunlay olib tashlangan, shuning uchun 2026 yilda yangi loyihalarda faqat flat config. Konfiguratsiya - obyektlar massivi, odatda `eslint/config` paketidagi `defineConfig()` bilan o'raladi:

```ts
// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  globalIgnores(["dist/**"]),
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    rules: { eqeqeq: "error" },
  },
]);
```

Asosiy kalitlar:

- `files` va `ignores` - obyekt qaysi fayllarga tegishli (glob).
- `extends` - boshqa konfiguratsiyalarni shu obyekt doirasida ulash. Hujjat uni `files` bilan birga ishlatishni tavsiya qiladi.
- `languageOptions` - parser, `parserOptions`, `globals`, `ecmaVersion`, `sourceType`.
- `plugins`, `rules`, `settings`.
- `linterOptions` - masalan, `reportUnusedDisableDirectives`.
- `name` - obyekt nomi, xato xabarlarida va config inspector'da ko'rinadi.

**Birlashtirish qoidasi:** faylga mos keladigan barcha obyektlar massiv tartibida birlashtiriladi, ziddiyatda keyingisi ustun. **Ignores qoidasi:** faqat `ignores`dan iborat obyekt global, boshqa kalitlar bilan birga bo'lsa - faqat shu obyekt uchun. `node_modules` va `.git` default ravishda e'tiborsiz.

**Konfiguratsiya qidiruvi:** ESLint v10'da konfiguratsiya fayli har bir lint qilinayotgan fayl katalogidan boshlab yuqoriga qarab qidiriladi (v9'da bu flag ortidagi tajribaviy xatti-harakat edi). Monorepoda har bir paketda o'z `eslint.config.mjs` bo'lishi mumkin.

### typescript-eslint

`typescript-eslint` paketi parser, plagin va shared config'larni bitta joyda beradi. Asosiy konfiguratsiyalar:

- **`recommended`** - ehtimoliy bug va yomon amaliyotlar uchun qoidalar. Barqaror.
- **`strict`** - `recommended` va qo'shimcha, qattiqroq qoidalar. Hujjat ogohlantiradi: semver bo'yicha barqaror emas.
- **`stylistic`** - mantiqqa ta'sir qilmaydigan, zamonaviy TS uslubi qoidalari. `recommended` yoki `strict`ga qo'shimcha.
- **`*TypeChecked`** variantlari (`recommendedTypeChecked`, `strictTypeChecked`, `stylisticTypeChecked`) - tip ma'lumotini talab qiladigan qoidalarni ham qo'shadi.
- **`disableTypeChecked`** - ma'lum fayllar (masalan, JS) uchun type-aware qoidalarni o'chiradi.

Ilgari `tseslint.config(...)` yordamchisi ishlatilardi. typescript-eslint hujjatiga ko'ra u ESLint core'dagi `defineConfig(...)` foydasiga eskirgan deb belgilangan.

### Typed linting

Typed linting'ning eng qimmatli qoidalari faqat tip ma'lumoti bilan ishlaydi:

- `no-floating-promises` - qayta ishlanmagan Promise (`await`, `.catch`, `return` yoki `void` yo'q).
- `no-misused-promises` - Promise kutilmagan joyda (masalan, `forEach(async ...)`, `if (promise)`).
- `no-unsafe-*` oilasi - `any` qiymatining tarqalishi (`no-unsafe-assignment`, `no-unsafe-member-access`, `no-unsafe-call`, `no-unsafe-return`, `no-unsafe-argument`).
- `await-thenable`, `require-await`, `restrict-template-expressions` va boshqalar.

Yoqish uchun `parserOptions.projectService: true`. Bu TypeScript language service'dan foydalanadi, har bir fayl uchun eng yaqin `tsconfig.json`ni avtomatik topadi va alohida `tsconfig.eslint.json` talab qilmaydi. Hujjat buni avvalgi `project` opsiyasidan afzal deb biladi.

**Narx:** typed linting sekinroq, chunki TypeScript butun loyihani tahlil qiladi. typescript-eslint hujjatiga ko'ra kichik loyihalarda bu odatda bir necha soniya, kattalarida ko'proq. Muharrirda kesh tufayli sezilmaydi, asosan CI va to'liq lint'da seziladi. Hujjat typed linting'ni qat'iy tavsiya qiladi, lekin narxni har bir jamoa o'zi baholashini ham aytadi.

## Chuqurroq: qoidalarni boshqarish

### Qoida darajalari

- `"error"` - CI'ni to'xtatadi. Faqat jamoa kelishgan, bug'ga olib keladigan qoidalar.
- `"warn"` - ko'rinadi, lekin to'xtatmaydi. Muammo shundaki, ogohlantirishlar to'planadi va hech kim ularga qaramaydi. Ko'p jamoalar CI'da `eslint --max-warnings 0` ishlatadi: bu "warn"ni amalda "error"ga aylantiradi, lekin muharrirda farqli rang bilan ko'rsatadi.
- `"off"` - o'chirilgan.

Amaliy qoida: qoida yo `error`, yo `off`. `warn` faqat migratsiya davrida, yangi qoidani bosqichma-bosqich joriy qilishda.

### Disable kommentlari

`// eslint-disable-next-line rule-name -- sabab` formati. `--`dan keyingi matn izoh sifatida qabul qilinadi. Qoidalar:

- Har doim aniq qoida nomini yozing, umumiy `eslint-disable` emas.
- Har doim sababni yozing.
- `linterOptions.reportUnusedDisableDirectives` bilan keraksiz bo'lib qolgan disable'larni toping.

### Mavjud loyihaga joriy qilish

Katta loyihada `recommendedTypeChecked`ni yoqish yuzlab xato beradi. Strategiyalar:

1. **Avval `recommended`, keyin type-checked.** Har bosqichda xatolarni tuzatib, keyin keyingisiga o'tish.
2. **Qoidani `warn` bilan yoqish, yangi kodda `error`.** `files` orqali yangi papkalar uchun qattiqroq qoidalar.
3. **Faqat o'zgargan fayllarni tekshirish.** `lint-staged` yangi va tegilgan fayllarda qoidaga amal qilishni ta'minlaydi (Boy Scout qoidasi, 6-dars).
4. **Bulk suppressions.** ESLint'ning yangi versiyalarida mavjud xatolarni alohida faylga "muzlatib", faqat yangilarini xato deb ko'rsatish imkoniyati bor. Uning aniq nomi va sintaksisini o'z versiyangiz hujjatidan tekshiring.

### Linter nimani qilmaydi

Linter dizaynni baholamaydi. U funksiyaning to'g'ri abstraksiya ekanini, nomning domenga mosligini yoki modulning chuqurligini bilmaydi. `max-lines-per-function` kabi metrik qoidalar faqat signal: ularni qat'iy `error` qilish sun'iy bo'linishga olib keladi (21-dars). Linter - review'ni mexanik ishdan ozod qilish vositasi, uni almashtirish emas.

## Misol: typed linting topadigan bug'lar

Kompilyatsiya bo'ladigan, lekin noto'g'ri NestJS kodi:

```ts run
type Payment = { id: string; status: "pending" | "paid" };

interface PaymentRepository {
  findPending(): Promise<Payment[]>;
  markPaid(id: string): Promise<void>;
}

interface PaymentGateway {
  isPaid(id: string): Promise<boolean>;
}

export class PaymentReconciler {
  constructor(
    private readonly repo: PaymentRepository,
    private readonly gateway: PaymentGateway,
  ) {}

  async reconcile(): Promise<void> {
    const pending = await this.repo.findPending();
    pending.forEach(async (payment) => {
      if (this.gateway.isPaid(payment.id)) {
        this.repo.markPaid(payment.id);
      }
    });
  }
}

// Sinab ko'ring: shlyuz faqat p1 ni to'langan deydi. Nechta to'lov "paid" bo'lib qoldi?
const markedPaid: string[] = [];
const reconciler = new PaymentReconciler(
  {
    findPending: async () => [{ id: "p1", status: "pending" }, { id: "p2", status: "pending" }],
    markPaid: async (id) => void markedPaid.push(id),
  },
  { isPaid: async (id) => id === "p1" },
);
await reconciler.reconcile();
console.log("paid deb belgilandi:", markedPaid);
```

Uchta bug. Ulardan ikkitasi (`forEach(async ...)` va `await`siz `markPaid`) `tsc` dan jimgina o'tadi; ikkinchisini esa `strictNullChecks` yoqilgan zamonaviy TypeScript ham ushlaydi (TS2801: "bu Promise har doim aniqlangan"), lekin faqat to'g'ridan-to'g'ri shart ichida:

1. `forEach(async ...)` - `reconcile` hamma to'lovlar tekshirilishidan oldin qaytadi. Cron job "tugadi" deb log yozadi, ish esa fonda davom etadi yoki process to'xtaganda uziladi. `no-misused-promises`.
2. `if (this.gateway.isPaid(...))` - Promise har doim truthy, shuning uchun **har bir** pending to'lov "to'langan" deb belgilanadi. Bu moliyaviy xato. `no-misused-promises` (shart ichidagi Promise) uni Promise o'zgaruvchiga olingan yoki `&&` ichida ishlatilgan holatlarda ham topadi.
3. `this.repo.markPaid(...)` `await`siz - xato ushlanmaydi. `no-floating-promises`.

Tuzatilgan versiya:

```ts run
export class PaymentReconciler {
  constructor(
    private readonly repo: PaymentRepository,
    private readonly gateway: PaymentGateway,
  ) {}

  async reconcile(): Promise<void> {
    const pending = await this.repo.findPending();
    for (const payment of pending) {
      const paid = await this.gateway.isPaid(payment.id);
      if (paid) await this.repo.markPaid(payment.id);
    }
  }
}

// Sinab ko'ring: oldingi blokdagi bilan bir xil ma'lumot. Natijani solishtiring.
const markedPaid: string[] = [];
const reconciler = new PaymentReconciler(
  {
    findPending: async () => [{ id: "p1", status: "pending" }, { id: "p2", status: "pending" }],
    markPaid: async (id) => void markedPaid.push(id),
  },
  { isPaid: async (id) => id === "p1" },
);
await reconciler.reconcile();
console.log("paid deb belgilandi:", markedPaid);
```

Ketma-ket `for...of` tanlandi: gateway rate limit'ga ega bo'lishi mumkin. Parallel kerak bo'lsa, cheklangan concurrency bilan `Promise.all` (29-dars). Muhimi - bu xatolarni odam emas, CI topdi.

## Qachon qo'llamaslik kerak

- **`all` konfiguratsiyasi.** typescript-eslint hujjati uni TS loyihalari uchun tavsiya etmaydi: qoidalar bir-biriga zid va ko'pi loyihaga moslashtirishni talab qiladi.
- **Qoidalarni kelishmasdan yoqish.** Bir dasturchi `stylistic` va o'nlab plaginlarni yoqsa, jamoa linter bilan kurashishga vaqt sarflaydi. Har bir qoida bitta savolga javob berishi kerak: u qaysi real muammoni oldini oladi?
- **Formatlash qoidalari.** Ular Prettier'ga tegishli (36-dars). ESLint'da `indent`, `quotes`, `max-len` kabi qoidalarni yoqish to'qnashuv va shovqin beradi.
- **Juda katta monorepoda to'liq typed linting har commit'da.** Agar `eslint .` CI'da 10 daqiqa olsa, dasturchilar uni chetlab o'tishni boshlaydi. Kesh (`--cache`), faqat o'zgargan paketlarni lint qilish yoki typed qoidalarni faqat CI'da ishlatish kabi kelishuvlar kerak.
- **Generatsiya qilingan kod.** Prisma client, GraphQL codegen natijalari va `dist` papkasi `globalIgnores`da bo'lishi kerak.
- **Testlarda qattiq `no-unsafe-*`.** Mock va fixture'larda `any` tez-tez uchraydi. Testlar uchun alohida, asoslangan yumshatish oqilona. Lekin production kodda bu qoidalar `any` tarqalishiga qarshi asosiy himoya.

## Stack'da: Next.js va NestJS uchun eslint.config.mjs

### Next.js (App Router)

Next.js hujjatidagi rasmiy shakl `eslint-config-next` paketiga tayanadi. U Next.js, React va React Hooks qoidalarini beradi, `core-web-vitals` varianti Core Web Vitals'ga ta'sir qiluvchi qoidalarni xatoga ko'taradi, `typescript` varianti esa typescript-eslint'ning recommended qoidalarini qo'shadi:

```ts
// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
```

Muhim nuqtalar: Next.js 16'dan `next lint` yo'q, `package.json`da `"lint": "eslint ."`. `eslint-config-next` ESLint 9 va 10 bilan ishlaydi, ESLint 10 esa Node.js `^20.19.0`, `^22.13.0` yoki `>=24` talab qiladi. Typed linting kerak bo'lsa, `nextTs` o'rniga yoki uning ustiga `tseslint.configs.recommendedTypeChecked` va `projectService` qo'shiladi. Server Actions va route handler'lardagi `await`siz Promise'lar uchun bu ayniqsa foydali.

### NestJS

`nest new` bilan yaratilgan loyiha typescript-eslint'ning type-checked konfiguratsiyasi, `projectService`, Node va Jest global'lari bilan keladi (aniq tarkib shablon versiyasiga bog'liq). Odatiy tuzatishlar:

```ts
// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  globalIgnores(["dist/**", "coverage/**"]),
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Dekoratorli klasslar bo'sh bo'lishi mumkin (masalan, modul klassi).
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  prettier,
]);
```

E'tibor bering: `no-extraneous-class` aslida `strict`da, `recommended`da emas. Bu yerda u ko'rsatma sifatida keltirildi: `strict`ga o'tsangiz, `@Module({})` bilan bo'sh klasslar uchun uni o'chirishga to'g'ri keladi. NestJS shabloni ba'zi versiyalarda `no-floating-promises`ni `warn` qilib qo'yadi. Backend'da bu qoidani `error` qilish tavsiya etiladi: `await`siz DB yozuvi - eng qimmat bug'lardan biri.

## Xulosa

- Linter jamoa kelishuvlarini bajariladigan qiladi va review'ni mexanik izohlardan ozod qiladi.
- ESLint v10'da faqat flat config: obyektlar massivi, `defineConfig`, `globalIgnores`, tartib bo'yicha birlashtirish, keyingisi ustun.
- typescript-eslint: `recommended` barqaror asos, `strict` qattiqroq lekin semver bo'yicha barqaror emas, `*TypeChecked` tip ma'lumotli qoidalarni qo'shadi.
- Typed linting (`projectService: true`) kompilyator o'tkazib yuboradigan bug'larni topadi: `no-floating-promises`, `no-misused-promises`, `no-unsafe-*`. Narxi - sekinroq lint.
- Qoidalar `error` yoki `off`; disable kommentlarida aniq qoida va sabab; formatlash Prettier'ga.
