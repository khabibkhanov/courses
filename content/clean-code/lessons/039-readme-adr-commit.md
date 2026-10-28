---
n: 39
slug: readme-adr-commit
title: "README, ADR va commit xabarlari"
summary: "Koddan tashqaridagi hujjatlar boshqa savollarga javob beradi: README - qanday ishga tushirish, ADR - nega shu arxitektura qarori qabul qilingan, commit xabari - bu o'zgarish nega qilingan. Bu darsda Nygard ADR formatini, Conventional Commits spetsifikatsiyasini va README'ning minimal tarkibini ko'ramiz."
duration: 35
sources:
  - id: nygard-adr
    note: "\"Documenting Architecture Decisions\" maqolasi: Title, Context, Decision, Status, Consequences; raqamlash, superseded holati, qisqa hajm va to'liq jumlalar bilan yozish"
  - id: conventional-commits
    note: "Conventional Commits 1.0.0 spetsifikatsiyasi: type(scope): description, feat/fix va SemVer, BREAKING CHANGE va ! belgisi, footer formati"
  - id: pragprog
    note: "Hujjatlash va DRY haqidagi bo'limlar: bilimni bir joyda saqlash, hujjatni koddan generatsiya qilish va eskirgan hujjat xavfi"
  - id: tidy-first
    note: "Struktura va xatti-harakat o'zgarishlarini alohida commit'larda saqlash g'oyasi"
quiz:
  - q: "Nygard ADR'ida \"Consequences\" bo'limiga nima yoziladi?"
    options:
      - "Faqat qarorning ijobiy natijalari"
      - "Qarorni amalga oshirish rejasi"
      - "Qaror qo'llangandan keyingi holat: ijobiy, salbiy va neytral oqibatlarning hammasi"
      - "Qarorni kim qabul qilgani"
    answer: 2
    explain: "Nygard Consequences bo'limida qarordan keyin yuzaga keladigan kontekstni, faqat ijobiy emas, barcha oqibatlarni yozishni so'raydi. Salbiy oqibatlarni yozish kelajakdagi o'quvchiga trade-off'ni ko'rsatadi."
  - q: "Qabul qilingan ADR keyinroq bekor qilinsa nima qilish kerak?"
    options:
      - "Eski ADR'ni o'chirish"
      - "Eski ADR'ni tahrirlab, yangi qarorni yozish"
      - "Hech narsa qilmaslik"
      - "Eski ADR'ni saqlash va uni \"superseded\" deb belgilab, yangi ADR'ga havola berish"
    answer: 3
    explain: "Nygard eski ADR'ni saqlashni va superseded deb belgilashni aytadi: jamoa bir vaqtlar nima qaror qilgani va nega - bu baribir qimmatli ma'lumot. ADR raqamlari qayta ishlatilmaydi."
  - q: "Conventional Commits bo'yicha qaysi commit SemVer MAJOR versiyani anglatadi?"
    options:
      - "`feat(billing): add PDF export`"
      - "`feat(api)!: remove v1 vehicle endpoints`"
      - "`fix: correct fuel rounding`"
      - "`chore: update deps`"
    answer: 1
    explain: "`!` belgisi yoki `BREAKING CHANGE:` footer'i breaking change'ni bildiradi va u MAJOR'ga mos keladi. `feat` - MINOR, `fix` - PATCH. `chore` kabi boshqa turlar spetsifikatsiyada majburiy emas va o'zi SemVer'ga ta'sir qilmaydi."
  - q: "Quyidagi commit xabarlaridan qaysi biri eng foydali?"
    options:
      - "`fix(fuel): ignore DUT readings during refueling window\\n\\nDatchik quyish paytida 2-3 daqiqa noto'g'ri qiymat beradi va bu soxta to'kish ogohlantirishlarini keltirib chiqargan. Closes FLEET-388`"
      - "`fixed bug`"
      - "`update fuel.service.ts`"
      - "`WIP`"
    answer: 0
    explain: "Yaxshi commit xabari nima o'zgarganini qisqa sarlavhada va nega o'zgarganini body'da aytadi. Fayl nomi diff'dan ko'rinadi, \"fixed bug\" esa hech narsa demaydi. Footer'dagi tiket havolasi kontekstni bog'laydi."
  - q: "Qaysi ma'lumot README'ga emas, ADR'ga tegishli?"
    options:
      - "Loyihani lokal ishga tushirish buyruqlari"
      - "Kerakli muhit o'zgaruvchilari ro'yxati"
      - "Nega PostgreSQL o'rniga TimescaleDB tanlangani va qanday alternativalar ko'rib chiqilgani"
      - "Testlarni ishga tushirish buyrug'i"
    answer: 2
    explain: "README - \"qanday\" haqida: ishga tushirish, sozlash, test. ADR - \"nega\" haqida: arxitektura qarorining konteksti, alternativalari va oqibatlari. README'da ADR'larga havola bo'lishi mumkin."
  - q: "Pragmatic Programmer'ning DRY tamoyili hujjatlarga qanday qo'llanadi?"
    options:
      - "Hujjat yozmaslik kerak"
      - "Har bir bilim bitta, ishonchli joyda bo'lishi kerak: masalan, API tavsifi koddan generatsiya qilinadi, README'da qo'lda takrorlanmaydi"
      - "README va kodda bir xil ma'lumot bo'lishi kerak"
      - "Barcha hujjat bitta faylda bo'lishi kerak"
    answer: 1
    explain: "DRY kod takrori emas, bilim takrori haqida. Agar API endpoint'lari ham OpenAPI'da, ham README'da qo'lda yozilgan bo'lsa, ulardan biri albatta eskiradi. Bilimni bir joyda saqlab, qolgan ko'rinishlarni undan hosil qilish kerak."
task:
  title: "Arxitektura qarori uchun ADR va commit'lar yozish"
  prompt: |
    Vaziyat: transport parki platformasida GPS nuqtalari hozir oddiy PostgreSQL jadvalida (`gps_points`, ~2 mlrd qator). Hisobot so'rovlari sekin. Jamoa uch variantni ko'rib chiqdi: (a) PostgreSQL'da oylik partitioning, (b) TimescaleDB kengaytmasi, (c) ClickHouse'ga alohida ko'chirish. Tanlov - (b), chunki u mavjud Postgres va Prisma/Kysely kodini saqlaydi va hypertable'lar avtomatik partitioning beradi. Salbiy tomoni: managed Postgres provayderi kengaytmani qo'llab-quvvatlashi kerak, ba'zi migratsiyalar qo'lda SQL bilan yoziladi.

    Vazifa:
    1. Nygard formatida ADR yozing (`docs/adr/0007-...md`).
    2. Shu qarorni amalga oshiruvchi 3 ta commit xabarini Conventional Commits formatida yozing: kengaytma migratsiyasi, repository o'zgarishi va eski endpoint'ning olib tashlanishi (bu breaking change).
    3. Starter'dagi yomon commit xabarlarini tuzating.
  lang: md
  starter: |
    # Commit tarixi (yomon)
    - update
    - timescale
    - fix
    - removed old endpoint, also changed repo and some refactoring and fixed tests

    # docs/adr/ (bo'sh)
  solution: |
    # docs/adr/0007-gps-nuqtalari-uchun-timescaledb.md

    # 7. GPS nuqtalari uchun TimescaleDB

    ## Status

    Accepted

    ## Context

    `gps_points` jadvalida taxminan 2 mlrd qator bor va u kuniga o'n millionlab qatorga o'smoqda.
    Oylik masofa va harakat hisobotlari bir necha daqiqa ishlaydi, eski ma'lumotni o'chirish esa
    jadvalni uzoq vaqt bloklaydi. Kod bazasi PostgreSQL'ga, Prisma va Kysely'ga tayanadi va jamoada
    boshqa ma'lumotlar bazasini qo'llab-quvvatlash tajribasi kam.

    Biz uch variantni ko'rib chiqdik: PostgreSQL'ning deklarativ partitioning'i, TimescaleDB kengaytmasi
    va GPS ma'lumotlarini ClickHouse'ga ko'chirish. ClickHouse analitikada eng tez, lekin ikkinchi
    ma'lumotlar bazasi, sinxronizatsiya va yangi operatsion bilim talab qiladi. Qo'lda partitioning
    yangi bo'laklarni yaratish va eskilarini o'chirish uchun o'z skriptlarimizni talab qiladi.

    ## Decision

    Biz `gps_points` jadvalini TimescaleDB hypertable'iga aylantiramiz. Yangi hisobot so'rovlari uchun
    continuous aggregate'lardan foydalanamiz. Ilova kodi Postgres bilan ishlashda davom etadi.

    ## Consequences

    Hisobot so'rovlari vaqt bo'yicha bo'laklar tufayli tezlashadi, eski ma'lumotni o'chirish retention
    siyosati bilan bloklashsiz bajariladi. Mavjud Prisma va Kysely kodi deyarli o'zgarmaydi.

    Managed Postgres provayderimiz TimescaleDB kengaytmasini qo'llab-quvvatlashi shart, bu provayder
    tanlovini cheklaydi. Hypertable va aggregate'lar uchun migratsiyalar Prisma emas, qo'lda yozilgan SQL
    bo'ladi. Juda katta analitik yuklama kelsa, ClickHouse varianti qayta ko'rib chiqilishi mumkin.

    ---

    # Commit'lar

    feat(db): convert gps_points to TimescaleDB hypertable

    Hypertable 1 kunlik bo'laklar bilan yaratiladi. Migratsiya qo'lda SQL'da,
    chunki Prisma kengaytma obyektlarini boshqarmaydi. ADR-0007 ga qarang.

    Refs: FLEET-501

    ---

    perf(trips): read monthly distance from continuous aggregate

    Oylik hisobot endi gps_points'ni to'liq skanerlamaydi. Natija eski so'rov
    bilan 3 ta mijozning sentabr ma'lumotida solishtirildi.

    Refs: FLEET-502

    ---

    feat(api)!: remove /v1/reports/raw-track endpoint

    Endpoint butun trekni xom holda qaytarar edi va hypertable'da sekin ishlaydi.
    O'rniga /v2/trips/{id}/track ishlatiladi (sahifalangan).

    BREAKING CHANGE: /v1/reports/raw-track olib tashlandi; mijozlar
    /v2/trips/{id}/track ga o'tishi kerak.
    Refs: FLEET-503
  solutionNotes: |
    - **ADR** Nygard tuzilmasiga amal qiladi: Title (raqam va qisqa ism), Status, Context, Decision, Consequences. Kontekst neytral faktlar, qaror "Biz ..." bilan faol ovozda, oqibatlarda salbiy tomonlar ham bor.
    - **Alternativalar** Context bo'limida qisqa tilga olingan. Bu kelajakdagi "nega ClickHouse emas?" savoliga javob.
    - **Hajm** bir sahifadan kam - Nygard bir-ikki sahifani tavsiya qiladi.
    - **Commit'lar** bitta mantiqiy o'zgarishga bitta: asl "removed old endpoint, also changed repo and some refactoring" uchta alohida commit bo'ldi. Aralash commit'ni review qilish va qaytarish (revert) qiyin.
    - **Turlar:** `feat` - yangi imkoniyat, `perf` - tezlik yaxshilanishi, `feat!` + `BREAKING CHANGE` footer - MAJOR versiya. `perf` turi spetsifikatsiyada majburiy emas, u `@commitlint/config-conventional` kabi kelishuvlardan.
    - **Body** "nima"ni emas, "nega"ni aytadi va tekshirish usulini qisqa yozadi.
    - **Footer'lar** git trailer formatida (`Refs: ...`). `BREAKING CHANGE` katta harflarda bo'lishi shart.
  checklist:
    - "ADR'da Status, Context, Decision, Consequences bo'limlari bor"
    - "Context'da ko'rib chiqilgan alternativalar tilga olingan"
    - "Consequences'da salbiy oqibatlar ham yozilgan"
    - "Har bir commit bitta mantiqiy o'zgarishni o'z ichiga oladi"
    - "Breaking change ! va BREAKING CHANGE footer bilan belgilangan"
    - "Commit body'lari \"nega\"ni tushuntiradi"
---

## Muammo

Olti oy oldin jamoa GPS ma'lumotlari uchun TimescaleDB'ni tanladi. Bugun yangi tech lead keldi va birinchi savoli: "nega ClickHouse emas?". Qarorni qabul qilganlarning ikkitasi ketgan. Slack tarixida 400 ta xabar, ulardan qaysi biri yakuniy ekanini hech kim bilmaydi. Ikki yo'l qoladi: qarorni ko'r-ko'rona qabul qilish yoki uni ko'r-ko'rona bekor qilish. Michael Nygard aynan shu dilemmani o'z maqolasida tasvirlaydi: qaror sababini bilmagan odam uchun ikkala yo'l ham xavfli.

Ikkinchi holat: `git log` chiqishi - "fix", "update", "wip", "changes", "fix again". `git blame` sirli qatorni ko'rsatadi, commit xabari esa "minor fix". Kod nima qilishini ko'rsatadi, komment nega shunday ekanini (32-dars), lekin *bu o'zgarish nega kiritilgani* faqat commit xabarida yashashi mumkin edi.

Uchinchi holat: yangi dasturchi loyihani ishga tushirishga ikki kun sarfladi, chunki README'da yozilgan `npm run dev` buyrug'i bir yil oldin o'zgargan, kerakli muhit o'zgaruvchilari esa hech qayerda sanab o'tilmagan.

Bu darsda koddan tashqaridagi uchta hujjat turini ko'ramiz. Ularning har biri boshqa savolga javob beradi va boshqa vaqt ufqiga ega.

## Asosiy g'oya

| Hujjat | Savol | Kim uchun | Qachon yangilanadi |
| --- | --- | --- | --- |
| README | Bu nima va qanday ishga tushiriladi? | Yangi dasturchi, foydalanuvchi | Ishga tushirish jarayoni o'zgarganda |
| ADR | Nega shu arxitektura qarori qabul qilindi? | Kelajakdagi jamoa | Hech qachon (yangi ADR yoziladi) |
| Commit xabari | Bu o'zgarish nega kiritildi? | Review qiluvchi, blame o'qiydigan | Hech qachon (immutable) |
| Kod kommenti | Bu kod nega hozir shunday? | Kodni o'zgartiradigan | Kod bilan birga |

### ADR: Nygard formati

Michael Nygard 2011 yilda Relevance (keyinchalik Cognitect) kompaniyasi blogida "Architecture Decision Record" g'oyasini taklif qildi. Uning asosiy kuzatuvi: katta arxitektura hujjatlari hech kim tomonidan yangilanmaydi va o'qilmaydi. Kichik, modulli hujjatlar esa yashaydi. U Agile metodlari hujjatga emas, qiymatsiz hujjatga qarshi ekanini ta'kidlaydi.

ADR - bitta qaror haqida qisqa matn fayli, quyidagi bo'limlar bilan:

- **Title** - qisqa ot iborasi va raqam, masalan "ADR 7: GPS nuqtalari uchun TimescaleDB".
- **Context** - qarorga ta'sir qiluvchi kuchlar: texnologik, siyosiy, ijtimoiy, loyihaga xos. Neytral faktlar sifatida, ular orasidagi taranglik ochiq ko'rsatiladi.
- **Decision** - jamoaning javobi, faol ovozda, to'liq jumlalarda ("Biz ... qilamiz").
- **Status** - "proposed" (taklif), "accepted" (qabul qilingan), keyinroq "deprecated" yoki "superseded" (yangi ADR'ga havola bilan).
- **Consequences** - qaror qo'llangandan keyingi holat. Faqat ijobiy emas: salbiy va neytral oqibatlar ham.

Qo'shimcha qoidalar:

- ADR'lar ketma-ket raqamlanadi va raqamlar qayta ishlatilmaydi.
- Bekor qilingan qaror o'chirilmaydi, "superseded" deb belgilanadi. Jamoa bir vaqtlar nima qaror qilgani - baribir foydali bilim.
- Nygard ularni repozitoriyada, `doc/arch/adr-NNN.md` kabi yo'lda, Markdown kabi yengil formatda saqlashni taklif qiladi. Ko'p jamoalar `docs/adr/` ishlatadi, aniq yo'l - kelishuv masalasi.
- Hajm: bir-ikki sahifa.
- Uslub: kelajakdagi dasturchi bilan suhbat kabi, to'liq jumlalar va abzatslar bilan. Ro'yxatlar faqat vizual tartib uchun, jumlalarni almashtirish uchun emas.

### Conventional Commits

Conventional Commits 1.0.0 - commit xabarlari uchun yengil spetsifikatsiya. Tuzilma:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- `fix` - bug tuzatish, SemVer'da PATCH.
- `feat` - yangi imkoniyat, MINOR.
- Breaking change - `BREAKING CHANGE:` footer'i yoki sarlavhada `:` dan oldin `!` (masalan, `feat(api)!:`). U MAJOR'ga mos keladi va istalgan turdagi commit'da bo'lishi mumkin.
- Scope - ixtiyoriy, qavs ichida kod bazasining qismi: `fix(billing):`.
- Boshqa turlar (`build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`) spetsifikatsiyada majburiy emas. Ular Angular konventsiyasiga asoslangan `@commitlint/config-conventional` kabi kelishuvlardan keladi va breaking change bo'lmasa SemVer'ga ta'sir qilmaydi.
- Footer'lar git trailer formatiga o'xshaydi: `Token: qiymat` yoki `Token #qiymat`, tokenlarda probel o'rniga defis (`Reviewed-by`). `BREAKING CHANGE` istisno, unda probel bo'lishi mumkin va u katta harflarda yozilishi shart.

Spetsifikatsiyaning asosiy foydasi - mashina o'qiy oladigan tarix: changelog va versiyani avtomatik generatsiya qilish, breaking change'larni ko'rish. Lekin format yaxshi xabar kafolati emas: `fix: fix` ham formatga mos.

### README

README - loyihaga kirish eshigi. Minimal tarkib:

1. **Bu nima** - bir-ikki jumla.
2. **Talablar** - Node versiyasi, paket menejeri, Docker.
3. **Ishga tushirish** - nusxa olib yopishtirsa bo'ladigan buyruqlar.
4. **Muhit o'zgaruvchilari** - `.env.example`ga havola, har birining ma'nosi.
5. **Asosiy buyruqlar** - dev, test, lint, migratsiya.
6. **Tuzilma** - asosiy papkalar va ular nima uchun (38-dars).
7. **Qo'shimcha hujjatlar** - ADR'lar, API hujjati, deploy jarayoni.

## Chuqurroq: hujjatlarni tirik saqlash

### DRY hujjatlarga ham tegishli

*The Pragmatic Programmer*da DRY tamoyili kod takroridan kengroq: u har bir bilim tizimda bitta, aniq va ishonchli ko'rinishga ega bo'lishi kerakligini aytadi. Mualliflar hujjat va kod o'rtasidagi takrorni ham shu tamoyil buzilishi deb ko'radi. Amalda:

- **API endpoint'larini README'da qo'lda sanamang.** OpenAPI koddan generatsiya qilinadi (NestJS'da `@nestjs/swagger`), README faqat unga havola beradi.
- **Muhit o'zgaruvchilarini bir joyda e'lon qiling.** Validatsiyalangan config sxemasi (zod, 86-dars) haqiqat manbai, `.env.example` undan yoki u bilan birga yangilanadi.
- **Buyruqlarni `package.json` skriptlarida saqlang.** README'da `pnpm dev`, uzun `docker compose ... && prisma ... && nest start` emas.

### README'ni tekshiriladigan qilish

Eskirgan README - chalg'ituvchi komment kabi (33-dars). Uni tirik saqlash usullari:

- **CI'da README'dagi buyruqlarni ishga tushirish.** Masalan, toza konteynerda `pnpm install && pnpm build && pnpm test`. Agar README yo'riqnomasi bilan loyiha ishga tushmasa, CI qizil.
- **Har bir yangi xodim - README testi.** Onboarding paytida u to'xtagan har bir joy - README'ga tuzatish PR'i.
- **Qisqa saqlash.** README qancha uzun bo'lsa, shuncha tez eskiradi. Batafsil narsalar `docs/` ichida, README - xarita.

### Commit xabarlari: nima va nega

Commit sarlavhasi *nima* o'zgarganini qisqa aytadi (50-72 belgi atrofida, bu git an'anasi, qat'iy qoida emas), body esa *nega*ni. Diff "qanday"ni allaqachon ko'rsatadi, uni takrorlash shart emas.

Yaxshi commit'ning ikkinchi xususiyati - **atomarlik**: bitta mantiqiy o'zgarish. "Refactoring + yangi feature + formatlash" bitta commit'da bo'lsa, uni review qilish, `git bisect` bilan bug topish va revert qilish qiyin. Kent Beck *Tidy First?*da struktura va xatti-harakat o'zgarishlarini alohida commit'larda saqlashni tavsiya qiladi (78-dars).

### Commit, komment yoki ADR?

- O'zgarishning sababi faqat shu o'zgarish uchun muhim bo'lsa (bug tafsiloti, tiket) - **commit xabari**.
- Sabab kodni kelajakda o'qiydigan har bir odam uchun muhim bo'lsa ("nega `Promise.all` emas") - **kod kommenti**. Commit xabari blame orqali topiladi, lekin uni hech kim proaktiv o'qimaydi.
- Qaror bir nechta modulga, texnologiya tanloviga yoki uzoq muddatli trade-off'ga tegishli bo'lsa - **ADR**. Kod kommenti va commit'dan unga havola.

## Misol: commitlint bilan formatni majburlash

Conventional Commits formatini qo'lda kuzatish ishlamaydi. `commitlint` commit xabarini hook'da tekshiradi. Konfiguratsiya TypeScript'da yozilishi mumkin:

```ts
// commitlint.config.ts
import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Monorepodagi ruxsat etilgan scope'lar: tasodifiy "fixes" yoki "misc" emas.
    "scope-enum": [2, "always", ["web", "api", "db", "billing", "fuel", "trips", "deps", "ci"]],
    // Sarlavha qisqa bo'lsin, batafsil izoh body'da.
    "header-max-length": [2, "always", 72],
  },
};

export default config;
```

Hook (masalan, `husky` yoki `lefthook` orqali `commit-msg`) har bir commit'da `commitlint --edit` ni ishga tushiradi. CI'da esa PR'dagi barcha commit'lar yoki squash merge sarlavhasi tekshiriladi.

Bu konfiguratsiya bilan quyidagi xabarlar rad etiladi:

```
update                            -> type yo'q
fix(misc): stuff                  -> "misc" scope ruxsat etilmagan
Feat(api): Add endpoint           -> type kichik harfda bo'lishi kerak (config-conventional qoidasi)
```

Va quyidagisi qabul qilinadi:

```
fix(fuel): ignore DUT readings during refueling window

Datchik quyish paytida 2-3 daqiqa noto'g'ri qiymat beradi va bu soxta
to'kish ogohlantirishlarini keltirib chiqargan.

Closes: FLEET-388
```

Yana bir foydasi: bunday tarixdan changelog va versiya raqami avtomatik hosil qilinadi (`semantic-release`, `release-please`, `changesets` kabi vositalar har biri o'z yondashuviga ega). Tanlov jamoa jarayoniga bog'liq.

## Qachon qo'llamaslik kerak

- **Har bir mayda qaror uchun ADR.** "Lodash o'rniga native metodlar" yoki "bu komponent nomi" uchun ADR - ortiqcha byurokratiya. ADR faqat qaytarish qimmat bo'lgan, arxitekturaga ta'sir qiluvchi qarorlar uchun: ma'lumotlar bazasi, autentifikatsiya, modul chegaralari, xabar navbati, deploy modeli.
- **ADR'ni qaror qabul qilinganidan bir yil keyin yozish.** Kontekst unutilgan, alternativalar eslab qolinmagan. ADR qaror vaqtida yoki "proposed" holatida qaror oldidan yoziladi.
- **Conventional Commits'ni bitta odamlik loyihada majburlash.** Agar changelog generatsiya qilinmasa va versiyalash kerak bo'lmasa, format foydasi kam. Mazmunli xabar yozish - format emas, asosiy narsa.
- **Squash merge qiladigan jamoada har bir commit'ni tekshirish.** Agar PR squash qilinsa, faqat PR sarlavhasi va tavsifi `main` tarixiga tushadi. Bu holatda PR sarlavhasini tekshirish yetarli, ichki "wip" commit'lar zarar qilmaydi.
- **README'ni hamma narsa uchun ishlatish.** 2000 qatorli README - hech kim o'qimaydigan hujjat. Batafsil narsalar `docs/`ga, README - qisqa xarita.
- **Formatga to'liq ishonish.** `feat: add stuff` formatga mos, lekin foydasiz. Linter formatni tekshiradi, mazmunni review tekshiradi.

## Stack'da: monorepo va jarayon

- **ADR joylashuvi.** Monorepoda umumiy qarorlar `docs/adr/`, bitta ilovaga tegishlilari `apps/api/docs/adr/`. `adr-tools` kabi CLI yangi fayl yaratish va superseded havolalarini qo'yishni avtomatlashtiradi, lekin oddiy Markdown shablon ham yetarli.
- **Kod va ADR bog'lanishi.** Muhim joyda kod kommenti: `// ADR-0007: hypertable, shuning uchun bu so'rov vaqt oralig'isiz ishlatilmasin.` Shunda kodni o'qigan odam qarorni topadi.
- **PR shabloni.** `.github/pull_request_template.md`da "Nima", "Nega", "Qanday tekshirildi", "Breaking change bormi" bo'limlari. Squash merge'da PR tavsifi commit body'siga aylanadi.
- **Scope'lar va monorepo.** Conventional Commits scope'larini monorepo paketlari bilan moslashtirish (`web`, `api`, `shared`) qaysi paket o'zgarganini tarixdan ko'rishni osonlashtiradi.
- **NestJS va Next.js README.** Ikkala CLI ham shablon README yaratadi. Uni darhol loyihaga moslashtiring: framework haqidagi umumiy matnni olib tashlab, o'z loyihangizning ishga tushirish va tuzilma ma'lumotini yozing.

## Xulosa

- README - "qanday ishga tushirish", ADR - "nega shu qaror", commit - "nega shu o'zgarish", komment - "nega kod hozir shunday". Har biri o'z savoliga javob beradi.
- Nygard ADR: Title, Context, Status, Decision, Consequences. Qisqa, raqamlangan, repoda saqlanadi, bekor qilinganda superseded deb belgilanadi.
- Conventional Commits: `type(scope): description`, `feat` - MINOR, `fix` - PATCH, `!` yoki `BREAKING CHANGE` - MAJOR. Format mashina o'qiydigan tarix beradi, lekin mazmunni kafolatlamaydi.
- DRY hujjatlarga ham tegishli: bilimni bitta joyda saqlang, qolganini undan generatsiya qiling yoki havola bering.
- Hujjatni tirik saqlash uchun uni tekshiriladigan qiling: CI'da README buyruqlari, hook'da commitlint, review'da ADR.
