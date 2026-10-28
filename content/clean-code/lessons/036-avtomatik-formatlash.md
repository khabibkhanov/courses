---
n: 36
slug: avtomatik-formatlash
title: "Gorizontal formatlash va avtomatlashtirish: Prettier"
summary: "Qator uzunligi, chekinish, probellar va qavslar - bular uchun bahslashish vaqt isrofi. Bu darsda Martinning gorizontal formatlash tamoyillarini, Prettier'ning falsafasini (nega opsiyalar muzlatilgan), Prettier va ESLint o'rtasida vazifalarni to'g'ri taqsimlashni va formatlashni jamoada avtomatlashtirishni ko'ramiz."
duration: 30
sources:
  - id: cc1
    note: "Formatlash haqidagi bob: gorizontal ochiqlik va zichlik, chekinish, qator uzunligi va \"Team Rules\" bo'limi"
  - id: prettier-rationale
    note: "Rationale sahifasi (nimani o'zgartiradi va nimani saqlaydi, printWidth yo'riqnoma ekani), shuningdek Option Philosophy va Integrating with Linters sahifalari"
  - id: google-code-review
    note: "Review yo'riqnomasi: uslub masalalari va \"Nit\" izohlari"
quiz:
  - q: "Prettier jamoasi nega yangi formatlash opsiyalarini qabul qilmaydi?"
    options:
      - "Texnik jihatdan opsiya qo'shish imkonsiz"
      - "Ko'p opsiyalar Prettier'ning asosiy maqsadini buzadi: uslub haqidagi bahslar shunchaki \"qaysi opsiyani tanlaymiz\" bahsiga aylanadi"
      - "Opsiyalar formatlashni sekinlashtiradi"
      - "Opsiyalar faqat pullik versiyada"
    answer: 1
    explain: "Option Philosophy sahifasida opsiyalar ro'yxati muzlatilgani aytiladi. Asosiy sabab - bikeshedding: har bir opsiya jamoa ichida mayda bahs uchun yangi mavzu. Faqat texnik zarur opsiyalar (moslik uchun) istisno bo'lishi mumkin."
  - q: "Prettier quyidagilardan qaysi birini qilmaydi?"
    options:
      - "Uzun qatorlarni bir necha qatorga bo'lish"
      - "Ketma-ket bir nechta bo'sh qatorni bittaga qisqartirish"
      - "Chekinishni bir xil qilish"
      - "Import'larni saralash"
    answer: 3
    explain: "Rationale sahifasiga ko'ra Prettier faqat kodni chop etadi, uni transformatsiya qilmaydi: import'lar, kalitlar yoki klass a'zolarini saralamaydi, ixtiyoriy qavslarni qo'shmaydi yoki olib tashlamaydi. Import tartibi uchun alohida lint qoidasi yoki plagin kerak."
  - q: "Prettier hujjati `eslint-plugin-prettier` (Prettier'ni ESLint qoidasi sifatida ishga tushirish) haqida nima deydi?"
    options:
      - "Bu yagona tavsiya etilgan usul"
      - "U majburiy"
      - "Umuman tavsiya etilmaydi: muharrirda ko'p qizil chiziq paydo bo'ladi, sekinroq va qo'shimcha murakkablik qatlami. Buning o'rniga eslint-config-prettier va Prettier'ni alohida ishga tushirish"
      - "U faqat TypeScript uchun"
    answer: 2
    explain: "Integrating with Linters sahifasida Prettier'ni linter ichida ishga tushiruvchi plaginlar umuman tavsiya etilmasligi aytiladi. Tavsiya: `eslint-config-prettier` bilan to'qnashuvchi qoidalarni o'chirish va `prettier --check .` ni alohida ishga tushirish."
  - q: "Prettier'ning `printWidth` opsiyasi qanday ishlaydi?"
    options:
      - "Bu qat'iy chegara: undan uzun qator bo'lsa xato beradi"
      - "Bu yo'riqnoma: Prettier qatorlarni shu uzunlikka sig'dirishga harakat qiladi, lekin uzun satrlar, regex va identifikatorlar kabi hollarda undan oshishi mumkin"
      - "Bu faqat kommentlarga ta'sir qiladi"
      - "Bu faqat Markdown fayllari uchun"
    answer: 1
    explain: "Rationale sahifasi `printWidth`ni qat'iy chegara emas, yo'riqnoma deb ta'riflaydi. Prettier satr literallarini bo'lmaydi, shuning uchun ular chegaradan oshishi mumkin."
  - q: "Jamoada Prettier joriy qilindi va eski kodni formatlash 900 ta faylga tegdi. `git blame` endi hamma qatorni shu commit'ga ko'rsatadi. Eng yaxshi yechim?"
    options:
      - "Formatlash commit'ini `.git-blame-ignore-revs` fayliga qo'shish va `blame.ignoreRevsFile` sozlamasini yoqish"
      - "Prettier'ni o'chirish"
      - "Har bir faylni alohida commit'da formatlash"
      - "git blame ishlatmaslik"
    answer: 0
    explain: "Git `--ignore-revs-file` va `blame.ignoreRevsFile` orqali ko'rsatilgan commit'larni blame'dan chiqaradi, GitHub ham `.git-blame-ignore-revs` faylini hisobga oladi. Shuning uchun katta formatlash alohida commit'da qilinadi va shu faylga qo'shiladi."
  - q: "Martin \"jamoa qoidalari\" haqida nima deydi?"
    options:
      - "Har bir dasturchi o'z uslubida yozishi kerak"
      - "Eng tajribali dasturchining uslubi qabul qilinadi"
      - "Uslub muhim emas"
      - "Jamoa bitta formatlash uslubiga kelishishi va hamma unga amal qilishi kerak: kod bazasi bitta odam yozgandek ko'rinishi kerak"
    answer: 3
    explain: "Martin formatlash bobida jamoa qoidalarining shaxsiy afzalliklardan ustunligini ta'kidlaydi. Bir xil uslub o'quvchiga har bir faylda yangi qoidalarga moslashmaslik imkonini beradi. Prettier aynan shu kelishuvni avtomatlashtiradi."
task:
  title: "Next.js + NestJS monorepo uchun formatlash va lint chegarasini sozlash"
  prompt: |
    Monorepoda `apps/web` (Next.js) va `apps/api` (NestJS) bor. Hozir:
    - ESLint konfiguratsiyasida formatlash qoidalari (`indent`, `quotes`, `semi`) bor va ular Prettier bilan to'qnashadi.
    - `eslint-plugin-prettier` ishlatiladi va muharrirda har bir probel xatosi qizil bo'lib ko'rinadi.
    - CI'da formatlash tekshirilmaydi, ba'zi PR'lar formatlanmagan holda merge bo'ladi.

    Vazifa: quyidagi konfiguratsiyani qayta yozing:
    1. Formatlashni to'liq Prettier'ga bering, ESLint faqat kod sifati uchun qolsin.
    2. `eslint-config-prettier` bilan to'qnashuvchi qoidalarni o'chiring.
    3. `package.json` skriptlarini `format` va `format:check` bilan to'ldiring.
    4. Prettier konfiguratsiyasini minimal saqlang va qaysi opsiyani nega qoldirganingizni yozing.
  lang: ts
  starter: |
    // eslint.config.mjs (TypeScript fayl sifatida ko'rsatilgan; aslida .mjs)
    import { defineConfig } from "eslint/config";
    import js from "@eslint/js";
    import tseslint from "typescript-eslint";
    import prettierPlugin from "eslint-plugin-prettier";

    export default defineConfig([
      js.configs.recommended,
      tseslint.configs.recommended,
      {
        plugins: { prettier: prettierPlugin },
        rules: {
          "prettier/prettier": "error",
          indent: ["error", 2],
          quotes: ["error", "single"],
          semi: ["error", "always"],
          "no-unused-vars": "error",
        },
      },
    ]);

    // .prettierrc.json
    // {
    //   "printWidth": 120, "tabWidth": 2, "useTabs": false, "semi": true,
    //   "singleQuote": true, "trailingComma": "all", "bracketSpacing": true,
    //   "arrowParens": "always", "jsxSingleQuote": true, "bracketSameLine": true
    // }

    // package.json scripts
    // { "lint": "eslint ." }
  solution: |
    // eslint.config.mjs
    import { defineConfig, globalIgnores } from "eslint/config";
    import js from "@eslint/js";
    import tseslint from "typescript-eslint";
    import prettier from "eslint-config-prettier/flat";

    export default defineConfig([
      globalIgnores(["**/dist/**", "**/.next/**", "**/coverage/**"]),
      {
        files: ["**/*.{js,mjs,ts,tsx}"],
        extends: [js.configs.recommended, tseslint.configs.recommended],
        rules: {
          // Kod sifati qoidalari shu yerda. Formatlash qoidalari yo'q.
          "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },
      },
      // Oxirida: formatlash bilan bog'liq qoidalarni o'chiradi.
      prettier,
    ]);

    // .prettierrc.json
    // { "singleQuote": true }

    // .prettierignore
    // dist
    // .next
    // coverage
    // pnpm-lock.yaml

    // package.json scripts
    // {
    //   "lint": "eslint .",
    //   "format": "prettier --write .",
    //   "format:check": "prettier --check ."
    // }

    // CI: pnpm format:check && pnpm lint
  solutionNotes: |
    - **Chegara:** formatlash - Prettier, kod sifati - ESLint. `indent`, `quotes`, `semi` ESLint'dan olib tashlandi. Prettier ularni baribir hal qiladi, ikkita vosita bir xil narsani tekshirsa, ular to'qnashadi.
    - **`eslint-config-prettier/flat`** konfiguratsiya massivining oxiriga qo'yildi: u oldingi konfiguratsiyalar (masalan, shared config'lar) yoqqan formatlash qoidalarini o'chiradi. Tartib muhim, chunki keyingi obyektlar oldingilarini bekor qiladi.
    - **`eslint-plugin-prettier` olib tashlandi** - Prettier hujjati buni tavsiya etmaydi: muharrirdagi shovqin, sekinlik, qo'shimcha murakkablik. Prettier muharrirda saqlash paytida ishlaydi, CI'da esa `format:check`.
    - **Prettier konfiguratsiyasi minimal:** faqat `singleQuote` qoldirildi (jamoa an'anasi). `printWidth: 120` olib tashlandi, default qiymat ishlatiladi. Boshqa qiymatlar ham default'ga teng yoki bahs mavzusi. Har bir qoldirilgan opsiya - kelajakdagi bikeshedding uchun sabab.
    - **`no-unused-vars`** TypeScript fayllari uchun typescript-eslint versiyasiga almashtirildi. Core qoida TS tiplari va interfeyslarida noto'g'ri ogohlantirish berishi mumkin.
    - **CI** ikkalasini ham tekshiradi: formatlanmagan kod merge bo'lmaydi.
  checklist:
    - "ESLint konfiguratsiyasida formatlash qoidalari (indent, quotes, semi va h.k.) qolmadi"
    - "eslint-config-prettier massiv oxirida"
    - "eslint-plugin-prettier olib tashlandi"
    - "Prettier konfiguratsiyasi minimal va har bir opsiya asoslangan"
    - "format:check CI'da ishga tushadi"
---

## Muammo

Kod review'da 14 ta izoh bor. Ulardan 11 tasi: "bu yerda probel kerak", "qo'shtirnoq bitta bo'lsin", "qator juda uzun", "vergul qo'ying". Mantiq, nomlash yoki dizayn haqida faqat 3 ta izoh. Review muallifi ham, ko'rib chiquvchi ham charchagan va eng muhim narsa - kod nima qilishi - e'tibordan chetda qolgan.

Ikkinchi holat: ikki dasturchi bir faylga tegdi. Biri muharrirda 4 probel, ikkinchisi 2 probel ishlatadi. Diff'da 300 qator o'zgargan, ulardan 5 tasi haqiqiy o'zgarish. Merge conflict'lar ko'payadi, `git blame` ma'nosini yo'qotadi.

Formatlash muhim, chunki kod avval ko'z bilan o'qiladi. Lekin formatlash haqida *bahslashish* deyarli hech qachon qiymat bermaydi. Bu darsning g'oyasi: formatlash qoidalarini jamoa bir marta qabul qiladi, keyin ularni mashina bajaradi va odamlar bu haqda boshqa o'ylamaydi.

## Asosiy g'oya

### Martinning gorizontal formatlash tamoyillari

*Clean Code*ning formatlash bobida Martin gorizontal formatlash haqida ham yozadi:

- **Qator uzunligi.** Martin mashhur Java loyihalaridagi qatorlar uzunligini tahlil qiladi va qisqa qatorlarni afzal ko'radi. U o'zi uchun taxminan 120 belgini yuqori chegara deb biladi. Bu shaxsiy tavsiya, universal standart emas.
- **Gorizontal ochiqlik va zichlik.** Probellar bilan bir-biridan kuchsiz bog'liq narsalarni ajratish va kuchli bog'liqlarni yaqin qo'yish. Masalan, tayinlash operatori atrofida probel bor, funksiya nomi va qavs orasida yo'q.
- **Gorizontal tekislash (alignment).** Martin o'zgaruvchi nomlarini yoki tiplarini ustun qilib tekislashni foydasiz deb hisoblaydi: u ko'zni noto'g'ri narsaga (nom va tip juftligi o'rniga ustunga) qaratadi va avtomatik formatterlar baribir uni buzadi.
- **Chekinish.** Ierarxiyani ko'rsatadi. Qisqa `if` yoki `while`ni bir qatorga siqib, chekinishni buzish vasvasasiga qarshi turish kerak.
- **Jamoa qoidalari.** Eng muhim fikr: jamoa bitta uslubga kelishishi kerak va har bir a'zo unga amal qiladi. Kod bazasi bitta odam yozgandek ko'rinishi kerak. Shaxsiy afzalliklar jamoa qoidasidan past turadi.

Martin bu bobni 2008 yilda yozgan. O'shandan beri uning oxirgi tamoyili - jamoa qoidalari - texnik jihatdan to'liq avtomatlashtirildi.

### Prettier falsafasi

Prettier - "opinionated" kod formatter. U kodni AST (sintaksis daraxti) ga parse qiladi va o'z qoidalari bo'yicha qaytadan chop etadi. Natijada asl formatlash deyarli butunlay yo'qoladi: bir xil kod qanday yozilganidan qat'i nazar bir xil ko'rinishga keladi.

Rationale sahifasidagi asosiy tamoyillar:

- **Birinchi talab - to'g'rilik.** Formatlangan kod asl kod bilan aynan bir xil ishlashi kerak. Buni buzadigan holat bug hisoblanadi.
- **Prettier faqat chop etadi, transformatsiya qilmaydi.** U import'larni, obyekt kalitlarini yoki klass a'zolarini saralamaydi, `?:` ni `if`ga aylantirmaydi, ixtiyoriy qavslarni qo'shmaydi yoki olib tashlamaydi.
- **`printWidth` yo'riqnoma, qat'iy chegara emas.** Uzun satrlar, regex'lar va identifikatorlar undan oshishi mumkin.
- **Ba'zi kirish formatlari saqlanadi.** Masalan, obyekt literalida `{` dan keyin yangi qator bo'lsa, u ko'p qatorli qoladi (bu `objectWrap` opsiyasi bilan boshqariladi). Prettier jamoasi buni ideal qoida emas, amaliy kelishuv deb ochiq tan oladi.
- **Bo'sh qatorlar.** Bitta bo'sh qator saqlanadi, ketma-ket bir nechtasi bittaga qisqaradi, blok va fayl boshi va oxiridagilari olib tashlanadi.

### Opsiyalar muzlatilgan

Prettier'ning Option Philosophy sahifasi ochiq aytadi: yangi formatlash opsiyalari qabul qilinmaydi. Erta davrda qo'shilgan ba'zi opsiyalar (masalan, `arrowParens`, `bracketSameLine`) jamoalar ichida mayda bahslarga sabab bo'lgani va ularning qo'shilgani afsuslanish bilan tilga olinadi. Sahifadagi asosiy fikr: opsiyalar ko'paysa, uslub haqidagi bahslar shunchaki qaysi opsiyani tanlash haqidagi bahsga aylanadi. Faqat texnik jihatdan zarur (moslik uchun) opsiyalar istisno bo'lishi mumkin.

Bu - Martinning "jamoa qoidalari" tamoyilining eng radikal shakli: qoidani nafaqat jamoa, balki butun ekotizim bir marta qabul qiladi.

## Chuqurroq: Prettier va ESLint chegarasi

### Ikki xil qoida

Linter qoidalarini ikki toifaga ajratish mumkin:

1. **Formatlash qoidalari** - chekinish, qo'shtirnoq turi, nuqtali vergul, qator uzunligi, probellar. Ular kodning ma'nosiga ta'sir qilmaydi.
2. **Kod sifati qoidalari** - ishlatilmagan o'zgaruvchilar, `await`siz Promise, `==` o'rniga `===`, unreachable code. Ular bug'larni topadi.

Prettier birinchi toifani to'liq o'z zimmasiga oladi. ESLint ikkinchisi uchun qoladi. Agar ikkalasi ham formatlashni tekshirsa, ular to'qnashadi: Prettier bir narsani yozadi, ESLint unga xato beradi.

ESLint'ning o'zi ham shu yo'nalishda harakat qildi: core'dagi ko'plab formatlash qoidalari eskirgan (deprecated) deb e'lon qilindi va ular `@stylistic` loyihasiga ko'chirildi. Ya'ni ESLint jamoasi ham formatlash core linter vazifasi emasligini tan oldi. Aniq qaysi qoidalar va qaysi versiyadan boshlab - loyihangizdagi ESLint versiyasining hujjatidan tekshiring.

### `eslint-config-prettier`

Bu paket - qoidalar to'plami emas, aksincha "o'chirgich". U ESLint va mashhur plaginlardagi Prettier bilan to'qnashadigan yoki keraksiz bo'ladigan qoidalarni o'chiradi. Flat config uchun `eslint-config-prettier/flat` import qilinadi va konfiguratsiya massivining **oxiriga** qo'yiladi, chunki flat config'da keyingi obyektlar oldingilarini bekor qiladi. Next.js hujjati ham Prettier ishlatadigan loyihalar uchun aynan shu paketni tavsiya qiladi.

### `eslint-plugin-prettier` nega tavsiya etilmaydi

Prettier'ning Integrating with Linters sahifasi Prettier'ni linter qoidasi sifatida ishga tushiruvchi plaginlarni umuman tavsiya etmaydi va uchta sabab keltiradi: muharrirda formatlash farqlari ko'p qizil chiziq sifatida ko'rinadi (bu Prettier'ning "formatlash haqida o'ylamang" maqsadiga zid), Prettier'ni to'g'ridan-to'g'ri ishga tushirishdan sekinroq va yana bir qatlam buzilishi mumkin. Tavsiya: muharrirda Prettier integratsiyasi (saqlashda formatlash) va CI'da `prettier --check .`.

### Jamoada avtomatlashtirish

Formatlash odamga bog'liq bo'lmasligi uchun uch qatlam:

1. **Muharrir.** VS Code'da Prettier kengaytmasi va "format on save". Loyiha ildizida `.vscode/settings.json` bilan jamoa uchun umumiy sozlama.
2. **Pre-commit hook.** `lint-staged` va `husky` (yoki `lefthook`) faqat staged fayllarni formatlaydi. Bu tez va muharrirni sozlamagan dasturchini ham qamrab oladi.
3. **CI.** `prettier --check .` - yakuniy kafolat. Hook'ni `--no-verify` bilan chetlab o'tish mumkin, CI'ni esa yo'q.

### Mavjud loyihaga joriy qilish

Katta kod bazasini birinchi marta formatlash minglab qatorga tegadi. Tartib:

1. Barcha ochiq PR'larni iloji boricha merge qiling yoki egalarini ogohlantiring (ular conflict oladi).
2. `prettier --write .` ni **alohida** commit'da bajaring, unda boshqa o'zgarish bo'lmasin.
3. Shu commit hash'ini `.git-blame-ignore-revs` fayliga yozing va jamoaga `git config blame.ignoreRevsFile .git-blame-ignore-revs` ni sozlashni ayting. GitHub bu faylni avtomatik hisobga oladi.
4. Darhol CI'ga `format:check` qo'shing.

## Misol: formatlash bahsidan kod sifatiga

Formatlash qo'lda qilingan, aralash uslubli kod:

```ts
export async function   assignDriver(vehicleId:string,driverId : string){
    const vehicle=await vehicleRepo.findById( vehicleId )
  if(!vehicle) throw new NotFoundError('vehicle')
    const busy = await assignmentRepo.findActiveByDriver(driverId)
    if (busy) { throw new ConflictError("driver busy") }
  assignmentRepo.create({ vehicleId, driverId, startedAt: new Date() })
}
```

Review'da bu koddagi formatlash muammolari ko'zga birinchi tashlanadi va haqiqiy bug yashirinadi. Prettier'dan keyin:

```ts
export async function assignDriver(vehicleId: string, driverId: string) {
  const vehicle = await vehicleRepo.findById(vehicleId);
  if (!vehicle) throw new NotFoundError("vehicle");
  const busy = await assignmentRepo.findActiveByDriver(driverId);
  if (busy) {
    throw new ConflictError("driver busy");
  }
  assignmentRepo.create({ vehicleId, driverId, startedAt: new Date() });
}
```

Endi kod bir xil ko'rinadi va ko'z formatlashga emas, mantiqqa qaraydi. Darhol ko'rinadi: oxirgi qatorda `await` yo'q. `create` Promise qaytaradi, xato bo'lsa u ushlanmaydi va funksiya muvaffaqiyatli tugagandek ko'rinadi. Bu - Prettier'ning ishi emas, ESLint'niki. typescript-eslint'ning `no-floating-promises` qoidasi (typed linting bilan) aynan shuni topadi (37-dars):

```ts
await assignmentRepo.create({ vehicleId, driverId, startedAt: new Date() });
```

Bu misol vazifalar taqsimotini ko'rsatadi: Prettier shovqinni olib tashlaydi, ESLint bug'ni topadi, odam esa dizayn haqida o'ylaydi. Shuningdek, bu yerda race condition ham bor (ikki parallel so'rov bitta haydovchini ikki mashinaga tayinlashi mumkin), uni hech qanday formatter yoki linter topmaydi (87-dars).

## Qachon qo'llamaslik kerak

- **Ma'noli qo'lda formatlash buziladigan joylar.** Matritsalar, jadval ko'rinishidagi test ma'lumotlari, ASCII diagrammalar. Bunday joylarda `// prettier-ignore` kommenti ishlatiladi. Lekin uni kam ishlating va sababini yozing, aks holda u formatlash bahslariga orqa eshik bo'ladi.
- **Generatsiya qilingan fayllar.** Prisma client, OpenAPI codegen, lock fayllar. Ularni `.prettierignore`ga qo'shing: aks holda har bir generatsiyadan keyin keraksiz diff paydo bo'ladi.
- **Opsiyalar bilan "o'z uslubingizni" tiklashga urinish.** Agar `.prettierrc` 12 ta opsiyadan iborat bo'lsa, siz bahsni Prettier konfiguratsiyasiga ko'chirgansiz. Iloji boricha default'lar.
- **Formatter kod sifatini almashtiradi deb o'ylash.** Prettier noto'g'ri nomni, uzun funksiyani yoki yomon abstraksiyani tuzatmaydi. Chiroyli formatlangan yomon kod - baribir yomon kod.
- **Faqat formatlashni tekshiruvchi review madaniyati.** Agar CI formatlashni tekshirsa, review'da bu haqda izoh yozish kerak emas. Google'ning code review yo'riqnomasi ham uslub masalalarini avtomatlashtirish va mayda izohlarni "Nit" deb belgilashni tavsiya qiladi (96-dars).

## Stack'da: Next.js, NestJS, monorepo

- **Next.js.** `create-next-app` Prettier o'rnatmaydi. Next.js hujjati Prettier bilan ishlatish uchun `eslint-config-prettier/flat`ni ESLint konfiguratsiyasiga qo'shishni ko'rsatadi. Tailwind ishlatsangiz, `prettier-plugin-tailwindcss` klass nomlarini tartiblaydi: bu Prettier o'zi qilmaydigan transformatsiya, shuning uchun alohida plagin.
- **NestJS.** `nest new` bilan yaratilgan loyiha Prettier va `eslint-config-prettier` bilan keladi. Ba'zi shablon versiyalarida `eslint-plugin-prettier` ham bor. Uni olib tashlab, Prettier'ni alohida ishga tushirish Prettier hujjati tavsiyasiga mos keladi. Loyihangizdagi shablonni tekshiring.
- **Dekoratorlar.** NestJS'da dekoratorlar ko'p. Prettier klass dekoratorlarini doim alohida qatorga qo'yadi, boshqa dekoratorlarning joylashuvini esa sig'sa asl holicha saqlaydi.
- **Monorepo.** Bitta ildiz `.prettierrc` va bitta `prettier --check .` butun repo uchun. Har bir paketda alohida Prettier konfiguratsiyasi - bu bir xil uslub tamoyiliga zid.
- **`.editorconfig`.** Prettier `.editorconfig`dagi ba'zi sozlamalarni (chekinish, qator oxiri) hisobga oladi. Prettier ishlatilmaydigan fayllar (masalan, Makefile) uchun ham foydali.

## Xulosa

- Martin gorizontal formatlashda qisqa qatorlar, ma'noli probellar va izchil chekinishni tavsiya qiladi, eng muhimi esa - jamoa qoidasi shaxsiy afzallikdan ustun.
- Prettier bu qoidani avtomatlashtiradi: kodni parse qilib qaytadan chop etadi, opsiyalari ataylab cheklangan va muzlatilgan.
- Chegara aniq: formatlash - Prettier, kod sifati - ESLint. `eslint-config-prettier` to'qnashuvlarni o'chiradi, `eslint-plugin-prettier` esa Prettier hujjatida tavsiya etilmaydi.
- Uch qatlamli avtomatlashtirish: muharrirda saqlashda formatlash, pre-commit hook, CI'da `prettier --check`.
- Mavjud loyihaga joriy qilishda formatlashni alohida commit'da qiling va uni `.git-blame-ignore-revs`ga qo'shing.
