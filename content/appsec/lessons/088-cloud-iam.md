---
n: 88
slug: cloud-iam
title: "Cloud IAM va noto'g'ri konfiguratsiya"
summary: "Bulutda xavf kod emas, sozlama: keng IAM policy, uzoq yashaydigan kalitlar, ochiq storage. Least privilege, deny by default, qisqa muddatli credential va workload identity, shared responsibility va logging."
duration: 50
sources:
  - id: t10-a02
    note: "A02:2025: bulut xizmatlarida noto'g'ri sozlangan ruxsatlar, default akkauntlar, CSP default'i internetga ochiq sharing (Scenario #4), cloud storage ruxsatlarini ko'rib chiqish, segmentatsiya"
  - id: t10-a01
    note: "A01:2025: least privilege, ya'ni deny by default (ommaviy resurslardan tashqari); nazorat ishonchli server tomonida; CORS noto'g'ri sozlanishi"
  - id: cs-cloudarch
    note: "OWASP Secure Cloud Architecture Cheat Sheet: IAM access (workload identity yoki federated role orqali qisqa muddatli credential, doimiy kalit emas), signed URL va public storage kamchiliklari, shared responsibility (IaaS/PaaS/SaaS), logging"
  - id: occ-capital-one
    note: "OCC press-relizi (2020-08-06): $80 million civil money penalty; sabab sifatida public cloud'ga o'tishdan oldin samarali risk assessment jarayonlari yaratilmagani va kamchiliklar o'z vaqtida tuzatilmagani ko'rsatiladi. Texnik zanjir bu relizda emas, uni 97-dars birlamchi manbalar bilan ko'radi"
quiz:
  - q: "Ilova roliga `storage:*` huquqi va `*` resurs berildi, 'har ehtimolga qarshi'. Bu qaysi tamoyilga zid?"
    options:
      - "Defense in depth"
      - "Fail open"
      - "Least privilege (deny by default): ruxsat faqat kerakli amal va resurs uchun beriladi"
      - "Separation of concerns"
    answer: 2
    explain: "A01:2025 least privilege'ni deny by default deb ataydi: ommaviy resurslardan tashqari, ruxsat aniq kerakli imkoniyat, rol yoki foydalanuvchi uchun beriladi. Keng wildcard buning aksi."
  - q: "OWASP Secure Cloud Architecture Cheat Sheet ilovaning storage'ga kirishi uchun qaysi yo'lni tavsiya qiladi?"
    options:
      - "Kodga doimiy access key yozish"
      - "Public bucket yaratish"
      - "Hamma pod'ga bitta umumiy kalit berish"
      - "Workload identity yoki federated role orqali qisqa muddatli credential olish, doimiy kalit o'rniga"
    answer: 3
    explain: "Cheat sheet: servisni workload identity yoki federated role bilan autentifikatsiya qiling va qisqa muddatli credential oling, doimiy kalitni joylashtirmang; huquqni kerakli storage amallari va resurslari bilan cheklang."
  - q: "Signed URL haqida cheat sheet nimani ogohlantiradi?"
    options:
      - "URL'ni bilgan har kim resursga anonim kira oladi; muddat va sezgirlik e'tiborga olinadi"
      - "Signed URL hech qachon ishlamaydi"
      - "Signed URL faqat shifrlangan fayllar uchun"
      - "Signed URL IAM'dan xavfsizroq, shuning uchun sezgir ma'lumot uchun eng yaxshi"
    answer: 0
    explain: "Cheat sheet: URL berilsa istalgan kishi anonim kiradi, muddatni o'ylash kerak, va usul faqat juda sezgir bo'lmagan foydalanuvchi ma'lumoti uchun tavsiya etiladi."
  - q: "Public object storage haqida cheat sheet nima deydi?"
    options:
      - "Eng yaxshi usul"
      - "Faqat ommaviy, sezgir bo'lmagan resurslar uchun; unda biroz vaqt turgan ma'lumot ham ommaga oshkor bo'lgan deb hisoblanadi"
      - "Faqat kichik fayllar uchun"
      - "Xavfsiz, chunki URL topish qiyin"
    answer: 1
    explain: "Public storage tavsiya etilmaydi: ichidagi ma'lumot istalgan muddat turgan bo'lsa ham ommaga oshkor bo'lgan deb qaraladi, va u hujumchiga qo'shimcha razvedka beradi."
  - q: "PaaS yoki SaaS ishlatilsa ham, sizning zimmangizda nima qoladi?"
    options:
      - "Hech narsa: hammasi provayderniki"
      - "Faqat jismoniy server"
      - "Provayder zimmasida bo'lmagan qatlamlar: masalan o'z ma'lumotlaringiz, kirish sozlamalari va ilova konfiguratsiyasi"
      - "Faqat to'lov"
    answer: 2
    explain: "Shared responsibility modelida provayder qanchalik ko'p qatlamni boshqarsa, sizning mas'uliyatingiz shuncha kamayadi, lekin to'liq yo'qolmaydi. Ruxsatlar va ma'lumotlar sizniki bo'lib qoladi (A02:2025: noto'g'ri sozlangan bulut ruxsatlari)."
  - q: "Hujumchi static (muddatsiz) kalitni o'g'irladi. Qisqa muddatli credential bilan taqqoslaganda asosiy farq?"
    options:
      - "Farq yo'q"
      - "Temp credential kuchliroq huquq beradi"
      - "Static kalit tezroq ishlaydi"
      - "Static kalit hujumchida muddatsiz ishlaydi, temp credential esa TTL tugagach o'zi yaroqsiz bo'ladi"
    answer: 3
    explain: "Qisqa muddatli credential o'g'irlansa ham tezda amal qilmay qoladi. Static kalit rotatsiya qilinmaguncha (yoki bekor qilinmaguncha) ishlaydi; shuning uchun zarar oynasi keskin farq qiladi."
task:
  title: "IAM policy linter"
  prompt: |
    `lint(statements)` IAM policy statement'larini tekshiradi va har topilmani "id: sabab" ko'rinishida qaytaradi. Hozir faqat `actions` ichida `*` borligini ushlaydi.

    Qoidalarni to'ldiring:
    1. `actions` ichida aniq `*` bo'lsa: `id: action '*'`.
    2. Aks holda `xxx:*` ko'rinishidagi servis wildcard bo'lsa: `id: servis wildcard`.
    3. `resources` ichida `*` bo'lsa: `id: resource '*'`.
    4. `credential` `static` bo'lsa: `id: static credential`.

    Kutilgan natija: berilgan to'rt statement uchun jami 6 topilma va oxirgi qatorda `OK`.
  lang: ts
  starter: |
    type Statement = { id: string; actions: string[]; resources: string[]; credential: "static" | "temp" };

    // Har bir xavfli statement uchun "id: sabab" topadi
    function lint(statements: Statement[]): string[] {
      const out: string[] = [];
      for (const s of statements) {
        if (s.actions.includes("*")) out.push(s.id + ": action '*'");
      }
      return out;
    }

    const statements: Statement[] = [
      { id: "ci-deploy", actions: ["*"], resources: ["*"], credential: "static" },
      { id: "api-uploads", actions: ["storage:GetObject", "storage:PutObject"], resources: ["storage://uploads/app/*"], credential: "temp" },
      { id: "reports", actions: ["storage:*"], resources: ["storage://reports/*"], credential: "temp" },
      { id: "legacy-sync", actions: ["storage:GetObject"], resources: ["*"], credential: "static" },
    ];

    const findings = lint(statements);
    for (const f of findings) console.log(f);
    console.log("jami: " + findings.length);
    console.log(findings.length === 6 ? "OK" : "KUTILGAN 6");
  solution: |
    type Statement = { id: string; actions: string[]; resources: string[]; credential: "static" | "temp" };

    function lint(statements: Statement[]): string[] {
      const out: string[] = [];
      for (const s of statements) {
        if (s.actions.includes("*")) out.push(s.id + ": action '*'");
        else if (s.actions.some((a) => a.endsWith(":*"))) out.push(s.id + ": servis wildcard");
        if (s.resources.includes("*")) out.push(s.id + ": resource '*'");
        if (s.credential === "static") out.push(s.id + ": static credential");
      }
      return out;
    }

    const statements: Statement[] = [
      { id: "ci-deploy", actions: ["*"], resources: ["*"], credential: "static" },
      { id: "api-uploads", actions: ["storage:GetObject", "storage:PutObject"], resources: ["storage://uploads/app/*"], credential: "temp" },
      { id: "reports", actions: ["storage:*"], resources: ["storage://reports/*"], credential: "temp" },
      { id: "legacy-sync", actions: ["storage:GetObject"], resources: ["*"], credential: "static" },
    ];

    const findings = lint(statements);
    for (const f of findings) console.log(f);
    console.log("jami: " + findings.length);
    console.log(findings.length === 6 ? "OK" : "KUTILGAN 6");
  solutionNotes: |
    - Linter faqat shakl bo'yicha tekshiradi: wildcard, `*` resurs va static credential. Policy'ning ma'nosini (masalan, `storage:GetObject` bo'lsa ham `*` resursda nima ochilishini) u baholamaydi.
    - Haqiqiy bulut provayderlari policy tilida ko'proq imkoniyat bor (shartlar, aniq taqiqlar, rol ishonch munosabatlari). Bu model shularni ifodalamaydi va provayder hujjatlarining o'rnini bosmaydi.
    - `legacy-sync` faqat o'qish huquqiga ega, lekin `*` resursda va static kalit bilan. Bu "faqat o'qish" ham xavfli ekaniga misol: boshqa tenant'larning ma'lumotini o'qish buzilishning o'zi.
  checklist:
    - "Action wildcard va servis wildcard farqlanadi"
    - "Resource '*' alohida topilma"
    - "Static credential alohida topilma"
    - "Linter nimani baholamasligini ayta olasiz"
---

## Muammo

Oldingi darslarda zaiflik asosan kod yoki konteyner ichida edi. Bulutda esa ko'p halokatli xato koddan tashqarida yashaydi: bitta policy faylidagi `*` belgisi, repoga tushib qolgan access key, "vaqtinchalik" ochilgan bucket. OWASP A02:2025 Security Misconfiguration tavsifi shuni aytadi: tizim, ilova yoki bulut xizmati xavfsizlik nuqtai nazaridan noto'g'ri sozlanganda zaiflik paydo bo'ladi. Xavf belgilari ro'yxatida stekning istalgan qismida to'liq hardening yo'qligi yoki bulut xizmatlarida noto'g'ri sozlangan ruxsatlar turadi. Hujjatdagi Scenario #4 bevosita bulutga tegishli: bulut provayderi (CSP) sharing ruxsatlarini default holatda internetga ochiq qoldiradi va bulut storage'idagi sezgir ma'lumotlarga hamma kira oladi.

Ilova muhandisi uchun bu ikki xavfli narsani anglatadi. Birinchisi, "kod toza" degan ishonch yolg'on tinchlik beradi: SQL injection yo'q ilova ham, uning roli butun storage'ni o'qiy olsa, bitta SSRF yoki bitta oshkor bo'lgan kalit orqali ma'lumotini yo'qotadi. Ikkinchisi, bu xatolar kod review'da ko'rinmaydi, chunki ular infratuzilma konfiguratsiyasida: Terraform, CloudFormation, konsol bosishlari. Shuning uchun dars ilova bilan bulut orasidagi chegarani, ya'ni identitet va ruxsatni, o'rganadi.

Har bulut provayderining policy tili, rol modeli va xizmat nomlari har xil, shuning uchun dars provayderdan mustaqil: tamoyillar OWASP manbalaridan, kod esa o'quv modeli. Konkret provayderda sintaksis va imkoniyatlar uning rasmiy hujjatiga ko'ra yoziladi.

## Asosiy g'oya

### Least privilege va deny by default

A01:2025 Broken Access Control tavsifi xavflar ro'yxatining boshida least privilege tamoyilini buzishni qo'yadi va uni "deny by default" deb ataydi: ommaviy resurslardan tashqari, ruxsat faqat muayyan imkoniyat, rol yoki foydalanuvchi uchun beriladi, aks holda esa hamma uchun ochiq bo'lib qoladi. Bulutda bu aniq ko'rinishga ega: policy bo'sh bo'lsa hech narsa ruxsat etilmaydi, va har ruxsat bitta aniq amal, bitta aniq resurs doirasida yoziladi. Wildcard (`*`) qulay, chunki "ishlab ketadi", lekin aynan shuning uchun xavfli: u bugungi va kelajakdagi barcha amallarni qamraydi, va ruxsat "kerak edi-yu, kerak emas edi" degan farqsiz ochiladi. Xuddi shu mantiqni 87-darsda RBAC wildcard'lari uchun ko'rdik.

Yana bir muhim jihat: nazorat ishonchli joyda bajarilishi kerak. A01:2025 bu haqda aniq: access control faqat ishonchli server tomonidagi kodda yoki serverless API'da samarali, bu yerda hujumchi tekshiruvni yoki metama'lumotni o'zgartira olmaydi. Bulutda "ishonchli joy" provayderning policy engine'i: ilova ichidagi `if (user.isAdmin)` tekshiruvi qanchalik yaxshi bo'lmasin, rolning o'zi keng bo'lsa, ilovani chetlab o'tgan hujumchi (RCE, SSRF) rolning hamma huquqidan foydalanadi.

### Doimiy kalit o'rniga qisqa muddatli credential

OWASP Secure Cloud Architecture Cheat Sheet ilova storage'ga kirishining uch yo'lini sanaydi: ichki IAM siyosatlari, kriptografik imzolangan URL va to'g'ridan-to'g'ri public storage. IAM yo'li uchun tavsiya aniq: servisni workload identity yoki federated role bilan autentifikatsiya qilish va qisqa muddatli credential olish, doimiy access key joylashtirmaslik. Cheat sheet misol sifatida AWS hujjatiga havola beradi: ilova kirishi uchun IAM rollari yoki federatsiyadan olingan vaqtinchalik credential'lar tavsiya etiladi. Servis ruxsatlari kerakli storage amallari va resurslari bilan cheklanadi.

Cheat sheet bu yondashuvning o'z jadvalini ham beradi. Afzalliklari: ma'lumotga to'g'ridan-to'g'ri kirish yo'q, foydalanuvchi storage'ni ko'rmaydi, kirish aniqlanadigan va loglanadigan. Kamchiliklari: keng IAM policy ishlatilishi mumkin, o'g'irlangan credential unga ruxsat etilgan resurslarni ochadi, credential kodga qattiq yozilgan bo'lishi mumkin. Yondashuv sezgir foydalanuvchi ma'lumoti uchun maqbul, lekin qat'iy kodlash va bulut amaliyotlariga rioya qilish sharti bilan. Ya'ni "IAM ishlatdik" deyish yetarli emas: policy qanchalik tor va credential qanchalik qisqa yashashi hal qiladi.

## Chuqurroq: storage, signed URL va mas'uliyat chegarasi

### Signed URL va public storage

Cheat sheet imzolangan URL'ni alohida usul sifatida tavsiflaydi: URL statik yoki dinamik generatsiya qilinadi va uni ko'targan shaxs bitta resursga kirishi kriptografik kafolatlanadi. Foydasi: faqat bitta resursga kirish, fayl uzatish samarali. Ogohlantirishlar: bu usulni juda sezgir bo'lmagan foydalanuvchi ma'lumoti uchun tavsiya qiladi; imzolash maxsus, dinamik va injection'ga ochiq bo'lsa kod inyeksiyasi mumkin; URL'ni olgan har kim resursga anonim kira oladi; URL'ning qachon eskirishini hal qilish murakkablik qo'shadi. Amaliy qoida: kalta muddat, bitta resurs, bitta amal (faqat o'qish yoki faqat yuklash) va URL'ni log'ga yozmaslik. Imzolangan URL sizib ketsa, u o'g'irlangan session kabi ishlaydi.

Public object storage haqida cheat sheet ancha qattiq: bu usul tavsiya etilmaydi va faqat ommaviy, sezgir bo'lmagan umumiy resurslar uchun qo'llanadi. U hujumchiga bulut muhiti haqida qo'shimcha razvedka beradi va shu konfiguratsiyada istalgan davr turgan har qanday ma'lumot ommaga oshkor bo'lgan deb hisoblanishi kerak. Jadvalda kamchiliklar: hamma kira oladi, maxfiylik yo'q, autentifikatsiyasiz kirish, butun fayl tizimi ko'rinishi, tasodifan ma'lumot sizib chiqishi. Bu A02:2025 profilaktika ro'yxatidagi talabni to'ldiradi: cloud storage (masalan S3 bucket) ruxsatlarini muntazam ko'rib chiqish.

### Shared responsibility

Cheat sheet uchta xizmat darajasini ajratadi: IaaS, PaaS, SaaS. Umumiy qoida: jismoniy qurilmalar va data center provayderga tegishli, qolgan qatlamlar boshqaruv darajasiga qarab ulushlanadi. Dasturchi IaaS'da operatsion tizimdan boshlab hamma narsa uchun javob berishi mumkin, PaaS va SaaS'da esa kamroq qatlam uchun. Xulosa: provayder qancha ko'p narsani boshqarsa, sizning yuklamangiz shuncha kam, lekin ruxsatlar, ma'lumotlar va konfiguratsiya sizdan ketmaydi. A02:2025 Scenario #4 aynan shu bo'shliqni ko'rsatadi: provayder default'i ochiq sharing bo'lsa va siz uni tekshirmasangiz, ma'lumot ochiq qoladi.

### Segmentatsiya, ishonch chegaralari va logging

A02:2025 himoya choralaridan biri: komponentlar yoki tenant'lar orasida samarali va xavfsiz ajratishni beruvchi segmentlangan arxitektura (segmentatsiya, konteynerizatsiya yoki bulutning xavfsizlik guruhlari). Cheat sheet ishonch chegaralarini (trust boundaries) ham tavsiflaydi: API gateway, hisoblash komponenti, ma'lumot ombori va identitet serveri orasida chegaralar bor va ular bitta ilova ichida bo'lsa ham ishonch darajasi har xil. Hamma narsaga ishonish, ya'ni "xavfli" foydalanuvchi kiritmasini yuqori kritiklikdagi biznes komponentga to'g'ridan-to'g'ri berish, muvaffaqiyatli hujum ehtimolini oshiradi.

Logging: cheat sheet nazorat qilinadigan bulut muhitida nima bo'layotganini aniq bilish kerakligini aytadi, voqea bo'lganda hujumchini butun ilova bo'ylab kuzatish mumkin bo'lishi uchun. Log tarkibi bo'yicha: HTTP natijalarini ruxsat berilgan voqea sxemasi bilan (metod, route shabloni, status, korrelyatsiya ID, sir bo'lmagan aktor identifikatori) yozish; credential, session cookie va token'larni log'ga kiritmaslik; ichki amallarni aktor va ruxsat ma'lumoti bilan yozish; maxfiy ma'lumotni maskalash. Bulut kontekstida bu: kim qaysi rolni qachon qabul qilgani va qaysi resursga murojaat qilgani izlanadigan bo'lishi kerak. Aks holda "kalit sizdi" hodisasida nima o'qilganini aniqlab bo'lmaydi.

### Voqea: Capital One

Kurs ro'yxatida bu darsga OCC (AQSh Valyuta nazorati idorasi) 2020-yil 6-avgustdagi press-relizi bog'langan. Relizda $80 million civil money penalty e'lon qilingan va sabab sifatida bankning public cloud muhitiga muhim IT operatsiyalarini ko'chirishdan oldin samarali risk assessment jarayonlarini yaratmagani hamda kamchiliklarni o'z vaqtida tuzatmagani aytilgan. Darsga bu ikki xulosa yetadi: bulutga o'tish ruxsatlar va konfiguratsiya xavfini baholashni talab qiladi, va topilgan kamchilik tuzatilmasa, javobgarlik texnik chegaradan tashqariga chiqadi. Reliz texnik zanjirni tasvirlamaydi; ma'lumot qanday oqib chiqqanini SSRF va cloud IAM case study'sida (97-dars) birlamchi manbalar bilan ko'ramiz.

## Misol: keng rol va o'g'irlangan kalit

Model provayderdan mustaqil: policy `actions` va `resources` ro'yxatidan iborat, `*` oxiridagi prefiks wildcard, so'rov faqat policy ochiq ruxsat bergan bo'lsa o'tadi (deny by default). Credential static yoki vaqtinchalik (TTL bilan).

### 1. Zaif kod va 2. Hujum

Ilova roli "ish bersin" deb `storage:*` va `*` resurs bilan yozilgan, credential esa static. Hujumchi ilovadagi zaiflik (masalan SSRF) orqali shu credential'ni o'g'irladi va 30 kundan keyin ham ishlatadi. Bu faqat o'quv modeli; haqiqiy tizimga qarshi hech narsa qilinmaydi.

```ts run
type Policy = { actions: string[]; resources: string[] };
type Cred = { kind: "static" | "temp"; issuedAt: number; ttlSec?: number };

function match(pattern: string, value: string): boolean {
  if (pattern === "*") return true;
  if (pattern.endsWith("*")) return value.startsWith(pattern.slice(0, -1));
  return pattern === value;
}

// Rad etish default; faqat policy ochiq ruxsat bergan so'rov o'tadi
function allowed(p: Policy, action: string, resource: string): boolean {
  return p.actions.some((a) => match(a, action)) && p.resources.some((r) => match(r, resource));
}

function alive(c: Cred, now: number): boolean {
  return c.kind === "static" || now < c.issuedAt + (c.ttlSec ?? 0);
}

// Ilova roli: "ish bersin" deb keng yozilgan
const appRole: Policy = { actions: ["storage:*"], resources: ["*"] };
const leaked: Cred = { kind: "static", issuedAt: 0 };

const attempts: [string, string][] = [
  ["storage:GetObject", "storage://uploads/app/logo.png"],
  ["storage:GetObject", "storage://invoices/2025/acme.pdf"],
  ["storage:ListBucket", "storage://backups/"],
  ["storage:DeleteObject", "storage://audit-logs/2025-11.log"],
];

const day = 86400;
for (const t of [60, 30 * day]) {
  const ok = alive(leaked, t) ? attempts.filter(([a, r]) => allowed(appRole, a, r)).length : 0;
  console.log("hujumchi t=" + (t / day).toFixed(2) + " kun: " + ok + "/" + attempts.length + " amal bajarildi");
}
```

```text
hujumchi t=0.00 kun: 4/4 amal bajarildi
hujumchi t=30.00 kun: 4/4 amal bajarildi
```

Ilovaga faqat logotip kerak edi, lekin o'g'irlangan kalit hisob-fakturalar, zaxira nusxalar va audit log'larga kiradi, yana audit log'ni o'chiradi (izni yo'qotish). Ikkinchi qator esa muddat omilini ko'rsatadi: 30 kundan keyin ham hammasi ishlaydi, chunki kalit muddatsiz.

### 3. Tuzatilgan kod

Policy faqat ikki amal va faqat ilovaning o'z prefiksi bilan cheklangan, credential esa 15 daqiqalik:

```ts run
type Policy = { actions: string[]; resources: string[] };
type Cred = { kind: "static" | "temp"; issuedAt: number; ttlSec?: number };

function match(pattern: string, value: string): boolean {
  if (pattern === "*") return true;
  if (pattern.endsWith("*")) return value.startsWith(pattern.slice(0, -1));
  return pattern === value;
}

function allowed(p: Policy, action: string, resource: string): boolean {
  return p.actions.some((a) => match(a, action)) && p.resources.some((r) => match(r, resource));
}

function alive(c: Cred, now: number): boolean {
  return c.kind === "static" || now < c.issuedAt + (c.ttlSec ?? 0);
}

// Faqat kerakli amallar va faqat o'z prefiksi
const appRole: Policy = {
  actions: ["storage:GetObject", "storage:PutObject"],
  resources: ["storage://uploads/app/*"],
};
// Workload identity: qisqa muddatli credential (15 daqiqa)
const leaked: Cred = { kind: "temp", issuedAt: 0, ttlSec: 900 };

const attempts: [string, string][] = [
  ["storage:GetObject", "storage://uploads/app/logo.png"],
  ["storage:GetObject", "storage://invoices/2025/acme.pdf"],
  ["storage:ListBucket", "storage://backups/"],
  ["storage:DeleteObject", "storage://audit-logs/2025-11.log"],
];

const day = 86400;
for (const t of [60, 3600, 30 * day]) {
  const ok = alive(leaked, t) ? attempts.filter(([a, r]) => allowed(appRole, a, r)).length : 0;
  console.log("hujumchi t=" + (t / day).toFixed(2) + " kun: " + ok + "/" + attempts.length + " amal bajarildi");
}
```

```text
hujumchi t=0.00 kun: 1/4 amal bajarildi
hujumchi t=0.04 kun: 0/4 amal bajarildi
hujumchi t=30.00 kun: 0/4 amal bajarildi
```

Hujumchi o'sha to'rt amalni sinaydi: faqat ilovaning o'z faylini o'qish o'tadi. Bir soatdan keyin credential'ning o'zi yaroqsiz. Nima yopilmadi: o'sha 15 daqiqada hujumchi ilovaning o'z prefiksida o'qish va yozishi mumkin. Shuning uchun policy'ning torligi va credential'ning qisqaligi bir-birini to'ldiradi, almashtirmaydi. Va yana: haqiqiy credential olish/yangilash mexanizmi (workload identity) provayderga bog'liq va bu modelda yo'q.

### Policy linter

Bu mexanik tekshiruvni CI'ga qo'yish mumkin (85-dars): infratuzilma kodidagi policy'larni deploy'dan oldin skanerlash. Topshiriqdagi linter shuni modellashtiradi; boshlang'ich holati faqat bitta qoidani biladi, va uni to'ldirish kerak:

```ts run
type Statement = { id: string; actions: string[]; resources: string[]; credential: "static" | "temp" };

// Har bir xavfli statement uchun "id: sabab" topadi
function lint(statements: Statement[]): string[] {
  const out: string[] = [];
  for (const s of statements) {
    if (s.actions.includes("*")) out.push(s.id + ": action '*'");
  }
  return out;
}

const statements: Statement[] = [
  { id: "ci-deploy", actions: ["*"], resources: ["*"], credential: "static" },
  { id: "api-uploads", actions: ["storage:GetObject", "storage:PutObject"], resources: ["storage://uploads/app/*"], credential: "temp" },
  { id: "reports", actions: ["storage:*"], resources: ["storage://reports/*"], credential: "temp" },
  { id: "legacy-sync", actions: ["storage:GetObject"], resources: ["*"], credential: "static" },
];

const findings = lint(statements);
for (const f of findings) console.log(f);
console.log("jami: " + findings.length);
console.log(findings.length === 6 ? "OK" : "KUTILGAN 6");
```

```text
ci-deploy: action '*'
jami: 1
KUTILGAN 6
```

## Qachon qo'llamaslik kerak

- Har bir rolni "mukammal tor" qilish uchun haftalab vaqt sarflash. Birinchi versiyada o'rtacha tor policy yozing, keyin log'lar asosida qisqartiring. Bu "wildcard bilan boshlang va hech qachon qaytmang" degani emas, aksincha, kirish loglari bo'lmasa tor policy sinovdan o'tmaydi.
- Signed URL'ni sezgir ma'lumot uchun tanlash. Cheat sheet uni juda sezgir bo'lmagan foydalanuvchi ma'lumoti uchun tavsiya qiladi. Sezgir fayl uchun IAM orqali server vositachiligi qulayroq.
- Public bucket'ni "vaqtincha" ochib qo'yish. Public storage'da turgan har qanday ma'lumot oshkor bo'lgan deb qaraladi; "vaqtincha" kafolat bermaydi.
- Linter natijasiga ko'r-ko'rona ishonish. Shakl bo'yicha tekshiruv `storage:GetObject` va `*` resursning birgalikda nimani ochishini baholamaydi; policy'ni odam ham ko'rib chiqishi kerak.
- Qisqa muddatli credential'ni "kalitni rotatsiya qilish shart emas" deb tushunish. Doimiy kalit qolgan joyda (uchinchi tomon integratsiya, eski servis) ularni alohida rotatsiya qilish va bekor qilish kerak (83-dars).

## Stack'da: NestJS/Next.js servislari

- Storage va boshqa bulut resurslariga kirish uchun doimiy access key'ni `.env` ga yozmang. Servis ishlayotgan platformaning workload identity yoki federated role mexanizmidan foydalaning va ilova SDK'si credential'ni undan olsin (aniq usul provayderga bog'liq).
- Har servis uchun alohida rol: `api`, `worker`, `migrator` har biri o'z minimal policy'siga ega. Umumiy "app" roli bir buzilishni hammasiga aylantiradi.
- Foydalanuvchi yuklagan fayllar uchun alohida bucket yoki prefiks, yuklash va yuklab olish amallari alohida ruxsatlarga ega. Yuklab olishda signed URL ishlatilsa, muddat qisqa bo'lsin va URL log'ga tushmasin.
- Terraform yoki boshqa infratuzilma kodidagi policy'larni CI'da linter (yuqoridagi kabi, yoki tayyor vosita) bilan tekshiring va o'zgarishlarni pull request orqali kiriting (85-dars).
- Bulut sozlamalari uchun muntazam tekshiruv: A02:2025 storage ruxsatlarini ko'rib chiqishni patch management jarayonining bir qismi qilishni tavsiya qiladi.
- Log: rol qabul qilish va storage murojaatlarini ruxsat berilgan sxema bilan yozing, credential va token'larni log'ga kiritmang.
- SSRF'ni (27-dars) bulut metama'lumot xizmatiga chiqish yo'lini yopish bilan birga o'ylang: egress siyosati va tor rol bir-birini to'ldiradi. Metadata xizmatining sozlamalari provayderga bog'liq.

## Xulosa

- Bulutda xavfning katta qismi kodda emas, ruxsat va konfiguratsiyada (A02:2025).
- Least privilege = deny by default (A01:2025): ruxsat kerakli amal va resurs uchun, wildcard'siz.
- Doimiy kalit o'rniga workload identity yoki federated role va qisqa muddatli credential; policy torligi va credential qisqaligi birgalikda zarar oynasini kichraytiradi.
- Signed URL anonim kirish beradi; public storage'dagi ma'lumot oshkor deb hisoblanadi.
- Shared responsibility: provayder qatlamlarni boshqarsa ham, ruxsatlar va ma'lumot sizniki.
- Rol qabul qilish va resursga murojaatlarni loglang, credential va token'larni emas.
- Capital One misolida regulyator (OCC) bulutga o'tishdan oldingi risk assessment va kamchiliklarni o'z vaqtida tuzatmaslikni asosiy sabab deb ko'rsatgan.
