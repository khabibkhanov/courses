---
n: 69
slug: secrets-management
title: "Secrets management"
summary: "Secret nima, nega kod, git tarixi, .env va CI o'zgaruvchilari yetarli emas; markazlashgan saqlash, eng kam huquq, qisqa muddatli (dynamic) credential, rotatsiya, revocation, audit va secret scanning; sizib chiqqandan keyingi harakat."
duration: 50
sources:
  - id: cs-secrets
    note: "Secrets Management cheat sheet: Introduction (kodga yozilgan secretlar), 2.2-2.4 (markazlashtirish, least privilege, dynamic secrets va rotatsiya), 2.6-2.7 (audit va hayot sikli), 3 (CI/CD), 5.1 (konteynerga uzatish), 8 (detection)"
  - id: t10-a02
    note: "A02:2025 Security Misconfiguration: oldini olish ro'yxatida kod, konfiguratsiya va pipeline'larga statik kalit joylash o'rniga identity federation, qisqa muddatli credential yoki rol asosidagi mexanizm"
  - id: gh-actions-security
    note: "GitHub Actions secure use: repozitoriyga yozish huquqi borlar barcha secretlarni o'qiy oladi, redaction kafolatlanmaydi, sizgan secret'ni o'chirish va rotatsiya qilish, environment secretlariga reviewer talab qilish, uchinchi tomon action'lar xavfi"
  - id: asvs
    note: "ASVS 5.0.0 13.1.4 (muhim secretlar va rotatsiya jadvali hujjatda), 13.2.1 (xizmatlararo autentifikatsiya: shaxsiy hisob, qisqa token yoki sertifikat), 13.3.1-13.3.4 (secrets management, least privilege, izolyatsiya, expiry va rotatsiya)"
quiz:
  - q: "Dasturchi `DB_URL` ichidagi parolni kod faylidan olib tashlab, yangi commit yubordi. Parol eski commit'larda qoldi. Qaysi gap to'g'ri?"
    options:
      - "Muammo hal bo'ldi, chunki joriy kodda parol yo'q"
      - "Parol hamon sizgan hisoblanadi: tarixga kirishi bor har kim uni o'qiydi, shuning uchun uni rotatsiya qilish kerak"
      - "Faqat repozitoriyni private qilish kifoya"
      - "Parolni base64 bilan kodlab qaytarish kifoya"
    answer: 1
    explain: "Git tarixi eski versiyalarni saqlaydi. Sizgan secret'ni kodan o'chirish uni bekor qilmaydi; haqiqiy tuzatish rotatsiya va revocation (cheat sheet 2.7)."
  - q: "Cheat sheet bo'yicha dynamic secrets nima uchun statik credential'dan yaxshi?"
    options:
      - "Ular hech qachon tugamaydi"
      - "Ular butun tashkilot uchun bitta umumiy qiymat"
      - "Ularni dasturchilar yoddan biladi"
      - "Ilova ishga tushganda yangi credential oladi, qisqa lease muddati bor va kerak bo'lmaganda revoke qilinadi, shuning uchun o'g'irlangan qiymat qisqa vaqt ishlaydi"
    answer: 3
    explain: "Dynamic secrets credential qayta ishlatilish yuzasini kamaytiradi: qisqa lease va kerak bo'lmaganda revocation. Ilovani qayta ishga tushirish o'g'irlangan credential'ni o'zi bekor qilmaydi."
  - q: "GitHub Actions'da repozitoriy secretlari haqida qaysi gap manbaga mos?"
    options:
      - "Repozitoriyga yozish huquqi bor har kim repozitoriydagi barcha secretlarni o'qiy oladi, shuning uchun workflow credential'lari eng kam huquqli bo'lishi kerak"
      - "Secretlar faqat admin tomonidan o'qiladi"
      - "Log redaction har qanday o'zgartirilgan qiymatni ham yashiradi"
      - "Uchinchi tomon action secretlarga kira olmaydi"
    answer: 0
    explain: "Secure use sahifasi: write access bor foydalanuvchi barcha repozitoriy secretlarini o'qiy oladi; redaction aniq mos kelishga tayanadi va kafolatlanmaydi; buzilgan action barcha secretlarga ega bo'ladi."
  - q: "Cheat sheet 3.2 bo'yicha CI/CD'da eng tavsiya etilgan yondashuv qaysi?"
    options:
      - "Production secretlarini CI o'zgaruvchilariga qo'yish"
      - "Runtime secretlarini pipeline orqali o'tkazmaslik: ilova platforma identifikatori bilan secretni runtime'da secrets manager'dan o'zi oladi"
      - "Secretni `.env` faylga yozib image'ga qo'shish"
      - "Hamma servis uchun bitta umumiy kalit"
    answer: 1
    explain: "Eng ma'qul yondashuv: pipeline ilovani platforma identifikatori bilan deploy qiladi, ilova esa secretni runtime'da o'zi oladi. Bu build infratuzilmasini production secretlaridan ajratadi."
  - q: "Quyidagilardan qaysi biri Docker image'ga secret uzatishning noto'g'ri usuli?"
    options:
      - "Build secret mount"
      - "SSH mount"
      - "Runtime'da orchestrator orqali berish"
      - "Dockerfile'da `ARG` yoki `ENV` bilan berish: u yakuniy image'da qoladi"
    answer: 3
    explain: "Docker hujjati: build argument va environment variable secretlar uchun mos emas, chunki yakuniy image'da qoladi. Secret mount va SSH mount ishlatiladi."
  - q: "Secret scanning haqida qaysi gap to'g'ri?"
    options:
      - "Bitta skaner hammasini topadi, ikkinchisi kerak emas"
      - "Faqat production repozitoriyda kerak"
      - "Commit'dan oldin (pre-commit) ham, CI'da ham ishlatiladi; bir nechta vosita natijalarini solishtirish bo'shliqlarni ko'rsatadi; topilgan secret baribir rotatsiya qilinadi"
      - "Topilgan secret'ni .gitignore'ga qo'shish yetarli"
    answer: 2
    explain: "Cheat sheet 8.1: developer darajasida pre-commit, bir nechta vosita. Skaner faqat aniqlaydi; sizgan secret'ni bekor qilish uchun rotatsiya va revocation kerak."
task:
  title: "Secret skaneri: kod fayllarida sizgan qiymatlarni topish"
  prompt: |
    `findSecrets` fayllar ro'yxatidan secret ehtimoli bor qatorlarni topadi. Hozir u "password" so'zi bor har qatorni belgilaydi: bu soxta ogohlantirishlar beradi va haqiqiy secretlarni o'tkazib yuboradi.

    Qoidalar. Qator `nom = qiymat` yoki `nom: qiymat` ko'rinishida bo'lsin (qiymat qo'shtirnoq ichida bo'lishi mumkin). Quyidagilar bajarilsa qator hit:
    1. `nom` ichida `secret`, `token`, `password`, `passwd` yoki `api_key`/`apikey` (katta-kichik harf farqsiz) bor.
    2. Qiymat uzunligi kamida 16.
    3. Qiymat `process.env` bilan boshlanmaydi va `${` bilan boshlanmaydi.
    4. Qiymatning Shannon entropiyasi (belgi boshiga, bit) kamida 3.5. `entropy` funksiyasi tayyor.

    Hit formati: `fayl:qator:nom` (qator 1 dan boshlanadi). Fayllarni va `console.log`ni o'zgartirmang. Kutilgan chiqish: `hits: 2`, `src/mail.ts:1:apiKey`, `src/pay.ts:2:WEBHOOK_SECRET`.
  lang: ts
  starter: |
    type SrcFile = { path: string; text: string };

    function entropy(s: string): number {
      const counts = new Map<string, number>();
      for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);
      let h = 0;
      for (const c of counts.values()) {
        const p = c / s.length;
        h -= p * Math.log2(p);
      }
      return h;
    }

    function findSecrets(files: SrcFile[]): string[] {
      const hits: string[] = [];
      for (const f of files) {
        f.text.split("\n").forEach((line, i) => {
          if (/password/i.test(line)) hits.push(`${f.path}:${i + 1}:password`);
        });
      }
      return hits;
    }

    const files: SrcFile[] = [
      { path: "src/db.ts", text: "const password = process.env.DB_PASSWORD;" },
      { path: "src/mail.ts", text: 'const apiKey = "k9Zr2QpL7vXw4TnB8sJd";' },
      { path: ".env.example", text: "API_TOKEN=changeme" },
      { path: "src/pay.ts", text: 'const SIGNING_ALG = "HS256";\nconst WEBHOOK_SECRET = "f3a9c1e07b5d42a8b6c0e91d7a4f2b83";' },
      { path: "docs/readme.md", text: "Set the password in your vault." },
      { path: "src/limits.ts", text: "const passwordMin = 12;" },
    ];

    const hits = findSecrets(files);
    console.log("hits:", hits.length);
    for (const h of hits) console.log(h);
  solution: |
    type SrcFile = { path: string; text: string };

    function entropy(s: string): number {
      const counts = new Map<string, number>();
      for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);
      let h = 0;
      for (const c of counts.values()) {
        const p = c / s.length;
        h -= p * Math.log2(p);
      }
      return h;
    }

    const NAME_RE = /secret|token|password|passwd|api_?key/i;
    const ASSIGN_RE = /([A-Za-z_][\w-]*)\s*[:=]\s*["']?([^"'\s;]+)["']?/;

    function findSecrets(files: SrcFile[]): string[] {
      const hits: string[] = [];
      for (const f of files) {
        f.text.split("\n").forEach((line, i) => {
          const m = ASSIGN_RE.exec(line);
          if (!m) return;
          const [, name, value] = m;
          if (!NAME_RE.test(name)) return;
          if (value.length < 16) return;
          if (value.startsWith("process.env") || value.startsWith("${")) return;
          if (entropy(value) < 3.5) return;
          hits.push(`${f.path}:${i + 1}:${name}`);
        });
      }
      return hits;
    }

    const files: SrcFile[] = [
      { path: "src/db.ts", text: "const password = process.env.DB_PASSWORD;" },
      { path: "src/mail.ts", text: 'const apiKey = "k9Zr2QpL7vXw4TnB8sJd";' },
      { path: ".env.example", text: "API_TOKEN=changeme" },
      { path: "src/pay.ts", text: 'const SIGNING_ALG = "HS256";\nconst WEBHOOK_SECRET = "f3a9c1e07b5d42a8b6c0e91d7a4f2b83";' },
      { path: "docs/readme.md", text: "Set the password in your vault." },
      { path: "src/limits.ts", text: "const passwordMin = 12;" },
    ];

    const hits = findSecrets(files);
    console.log("hits:", hits.length);
    for (const h of hits) console.log(h);
  solutionNotes: |
    - Nom, qiymat uzunligi, placeholder va entropiya birgalikda ishlatiladi. Bitta qoida o'zi kam: `changeme` entropiyasi past, `process.env.DB_PASSWORD` esa uzun, lekin secret emas.
    - Entropiya chegarasi (3.5) va uzunlik (16) o'quv qiymatlar. Real skanerlar ko'p turdagi signaturalar bilan ishlaydi (cheat sheet: bir nechta vosita natijalarini solishtirish tavsiya etiladi) va baribir yolg'on ijobiy/salbiy natija beradi.
    - Skaner faqat aniqlaydi. Topilgan secret rotatsiya va revocation qilinmasa, uni topish xavfni kamaytirmaydi.
    - Regex bitta qatorda bitta tayinlashni topadi; ko'p qatorli qiymat (private key bloki) yoki obfuskatsiya qilingan qiymat uchun alohida qoidalar kerak.
  checklist:
    - "Faqat nom, uzunlik, placeholder va entropiya shartlarining hammasi bajarilgan qatorlar hit bo'ladi"
    - "`process.env...` va `${...}` qiymatlari hit emas"
    - "Qator raqami 1 dan boshlanadi (ikki qatorli faylda 2 chiqadi)"
    - "Skaner topgan secret rotatsiya qilinishi kerakligini tushuntira olasiz"
---

## Muammo

Secret deb ilova o'z hisobidan tashqariga chiqmasligi kerak bo'lgan qiymatlar aytiladi: ma'lumotlar bazasi paroli, uchinchi tomon API kaliti, webhook imzo kaliti, shifrlash kalitlari, sertifikat private key'lari. Secrets Management cheat sheet muammoni ochiq aytadi: ko'p tashkilotlarda ular manba kodida oddiy matn sifatida yozilgan va konfiguratsiya fayllari hamda konfiguratsiya boshqaruv vositalari bo'ylab sochilgan. Ko'pincha bir nechta servis bir xil secret'ni ulashadi, shuning uchun sizib chiqishda manbani topish qiyin.

Odatiy ssenariy: dasturchi "tezroq ishlasin" deb bazaga ulanish satrini kodga yozadi, keyin buni sezib, keyingi commit'da olib tashlaydi. Repozitoriyni ko'rgan har bir odam, har bir klon va har bir CI keshi eski commit'ni saqlab qoladi. Yoki secret CI o'zgaruvchisiga qo'yiladi va u log'ga chiqib ketadi; yoki `.env` fayl Docker image'ga tushib qoladi. Har bir holatda muammo bir xil: secret uni ishlatadigan kodga qaraganda ancha ko'proq joyda va ancha uzoq yashaydi.

OWASP A02 (Security Misconfiguration) oldini olish ro'yxatida bu uchun aniq bandni beradi: kod, konfiguratsiya fayllari va pipeline'larga statik kalit yoki secret joylash o'rniga platforma beradigan identity federation, qisqa muddatli credential yoki rol asosidagi mexanizmlardan foydalaning. Bu dars shu yo'nalishni ochadi: secret qayerda saqlanadi, kimga ko'rinadi, qancha yashaydi, sizib chiqsa nima qilinadi. Kalitlarning o'zi (shifrlash) 68-darsda ko'rildi; bu yerda umumiy secretlar va ularni ilovaga yetkazish.

## Asosiy g'oya

### Secret'ning hayot sikli

Cheat sheet secret hayot siklini to'rt bosqichga ajratadi: yaratish, rotatsiya, revocation va expiration. Yaratishda secret kriptografik jihatdan yetarlicha kuchli bo'lishi va faqat zarur minimal huquqlarga ega bo'lishi kerak (67-dars). Rotatsiyada secretlar muntazam almashtiriladi, shunda o'g'irlangan qiymat qisqa vaqt ishlaydi. Revocation: secret endi kerak bo'lmasa yoki kompromat bo'lishi mumkin bo'lsa, uni xavfsiz bekor qilish. Expiration: imkon bo'lsa secret ma'lum muddatdan keyin o'zi tugaydi; muddatni iste'molchi tizim ham, secrets management tizimi ham qo'yishi mumkin, va ilova secretga ishonishdan oldin uning hali faol ekanini tekshirishi kerak.

Foydalanuvchi parollari bundan istisno: cheat sheet ularni muntazam almashtirmaslikni, faqat kompromat gumoni yoki isboti bo'lganda almashtirishni aytadi (NIST tavsiyasiga havola bilan; 42-dars).

### Markazlashtirish, eng kam huquq, audit

Cheat sheet to'rtta tamoyilni ajratadi. Birinchisi, markazlashtirish va standartlashtirish: secretlar bitta tizimda saqlanadi va bir xil usulda beriladi. Ikkinchisi, access control: secret'ni tizimda o'qiy yoki yangilay oladigan foydalanuvchi orqali ham u sizib chiqishi mumkin, shuning uchun muhandislar hamma secretga kirmasligi, eng kam huquq tamoyili qo'llanishi va tizim har bir ob'ekt uchun nozik ruxsat berishi kerak. Uchinchisi, avtomatlashtirish: qo'lda boshqarish sizib chiqish va inson xatosi xavfini oshiradi. To'rtinchisi, audit: kim, qachon, nima uchun secret'ni yaratgan, o'qigan, almashtirgan yoki o'chirgan, jurnalga yoziladi (79-dars).

ASVS 5.0.0 shu talablarni raqamlaydi. 13.3.1: secrets management yechimi (masalan key vault) backend secretlarini yaratish, saqlash, kirishni boshqarish va yo'q qilish uchun ishlatiladi, secretlar manba kodida va build artefaktlarida bo'lmaydi; L3 ilova uchun apparat bilan qo'llab-quvvatlanadigan yechim (HSM). 13.3.2: secretlarga kirish eng kam huquq tamoyiliga mos. 13.3.4: secretlar hujjatga muvofiq tugaydi va rotatsiya qilinadi. 13.1.4: ilova hujjati xavfsizlik uchun muhim secretlarni va ularni almashtirish jadvalini belgilaydi.

### Xizmatlararo autentifikatsiya

ASVS 13.2.1 backend komponentlari orasidagi autentifikatsiyada alohida servis hisoblari, qisqa muddatli tokenlar yoki sertifikatga asoslangan autentifikatsiyani talab qiladi va o'zgarmas credential'larni (parollar, API kalitlar, umumiy hisoblar) istisno qiladi. 13.2.3: servis autentifikatsiyasi uchun default credential (root/root, admin/admin) ishlatilmaydi. Bu 66-darsdagi mTLS bilan bog'lanadi: sertifikat qisqa muddatli bo'lsa, u sizsa ham zarari cheklangan.

## Chuqurroq: qayerdan sizadi va qanday yetkaziladi

### Dynamic secrets va rotatsiya

Cheat sheet dynamic secrets'ni afzal ko'radi: ilova ishga tushganda ma'lumotlar bazasi credential'ini so'raydi va yangi credential oladi. Qisqa lease muddati qo'yiladi va credential kerak bo'lmaganda revoke qilinadi. Muhim ogohlantirish: ilovani qayta ishga tushirish o'g'irlangan credential'ni o'zi bekor qilmaydi; u backend xizmat muddati tugatguncha yoki revoke qilguncha ishlayveradi. Statik secretlar uchun avtomatik rotatsiya tavsiya etiladi, chunki qo'lda rotatsiya xatolarga moyil. Cheat sheet qaysi arxitektura namunalarini keltirishini ham beradi: sidecar konteyner secret'ni davriy yangilaydi, yoki bulut secret manager rotatsiya funksiyasini jadval bo'yicha chaqiradi va u bosqichma-bosqich (yangisini yaratish, o'rnatish, sinash, yakunlash) ishlaydi.

Rotatsiyaning ichki tuzilishi muhim: yangi secret avval sinab ko'riladi, keyin joriy qilinadi; aks holda rotatsiya o'zi uzilish keltiradi. Muhim secretlar uchun eski va yangi qiymat qisqa muddat ikkalasi ham qabul qilinadigan "bir vaqtda ikki versiya" oynasi kerak bo'ladi (68-darsdagi kalit versiyalari bilan o'xshash).

### CI/CD

Cheat sheet 3.2 uch variantni sanaydi. Birinchisi, secretlar CI vositasida saqlanadi (GitHub secrets, GitLab variables va hokazo): ular pipeline joblari va loyiha maintainerlariga ko'rinadi, shuning uchun yuqori qiymatli, uzoq muddatli yoki keng huquqli credential'larni saqlamang, fork orqali sizib chiqmasligini tekshiring, muntazam almashtiring va qaysi secretlar saqlanayotganini hujjatlang. Ikkinchisi, pipeline secretni secrets manager'dan dinamik oladi, va statik bootstrap credential o'rniga qisqa muddatli OIDC token ishlatadi (workload identity federation). Uchinchisi, eng tavsiya etilgani: runtime secretlari pipeline orqali umuman o'tmaydi. Pipeline ilovani platforma identifikatori (masalan Kubernetes service account yoki bulut IAM roli) bilan deploy qiladi, ilova o'zi secretni runtime'da oladi. Bu build infratuzilmasini production secretlaridan ajratadi.

GitHub Actions hujjati aniq xavflarni beradi. Repozitoriyga yozish huquqi borlar hamma repozitoriy secretlarini o'qiy oladi. Log redaction aniq qiymatni topishga tayanadi va kafolatlanmaydi: o'zgartirilgan (masalan Base64) qiymatni ham secret sifatida ro'yxatdan o'tkazish kerak, va secretni JSON yoki YAML bloki ichiga solmaslik kerak, har bir qiymat alohida secret bo'lsin. Agar redaksiyalanmagan secret log'ga tushsa, log'ni o'chirish va secret'ni rotatsiya qilish kerak. Environment secretlari uchun required reviewers qo'yish mumkin. Uchinchi tomon action buzilsa, u workflow'dagi barcha secretlarga ega bo'ladi, shuning uchun action kodini tekshirish (yoki versiyani qotirish) tavsiya etiladi. Self-hosted runner'larda ba'zi joblar secretni buyruq qatori argumenti sifatida beradi va uni shu runner'dagi boshqa job `ps` bilan ko'rishi mumkin.

### Konteyner va muhit o'zgaruvchilari

Cheat sheet 5.1 secretni konteynerga uzatish yo'llarini sanaydi: fayl, xotira (sidecar secret manager'dan oladi) yoki muhit o'zgaruvchisi. Muhit o'zgaruvchisi haqida u aniq: ular odatda barcha jarayonlarga ochiq va log yoki system dump'larga tushishi mumkin, shuning uchun boshqa usul imkonsiz bo'lmaguncha tavsiya etilmaydi. Docker `ENV` yoki `ARG` bilan qattiq yozilgan secret konteyner ta'rifi bilan birga sizib chiqadi. Docker hujjati build vaqti uchun buni takrorlaydi: build argument va environment variable secretlar uchun mos emas, chunki yakuniy image'da qoladi; o'rniga secret mount yoki SSH mount ishlatiladi. Kubernetes hujjatiga ko'ra, Secret ob'ektlari standart holatda etcd'da shifrlanmagan holda saqlanadi, shuning uchun saqlashdagi shifrlashni sozlash va ularga kirishni eng kam huquq bilan cheklash kerak.

### Aniqlash

Cheat sheet 8-bo'lim aniqlashni "shift-left" qiladi: dasturchi darajasida (IDE'da yoki pre-commit hook'da) commit'dan oldin tekshirish, tashkilot bo'yicha standart test secretlari (yolg'on ijobiylarni kamaytiradi), threat modeling'da secretlarni hujum yuzasi sifatida ko'rish, bir nechta vosita natijalarini solishtirish va entropiya bilan aniqlash osonligi orasida muvozanat. Aniqlash topilgan secret bilan nima qilishni hal qilmaydi: bu rotatsiya va revocation, ya'ni hayot siklining keyingi bosqichlari.

## Misol: tarixdagi parol

### Zaif kod

Bazaga ulanish satri kodga yozilgan edi, keyin dasturchi uni muhit o'zgaruvchisiga o'tkazdi. Quyidagi o'quv repozitoriy tarixida ikkita commit bor.

```ts run
type Commit = { id: string; files: Record<string, string> };

// ZAIF: parol birinchi commit'da kodga yozilgan; ikkinchi commit uni "olib tashladi", lekin parol almashtirilmadi.
const history: Commit[] = [
  { id: "c1", files: { "src/db.ts": 'export const DB_URL = "postgres://app:Sup3r-Secret-9xQ2@db.fleet.test/fleet";' } },
  { id: "c2", files: { "src/db.ts": "export const DB_URL = process.env.DB_URL!;" } },
];

const head = history[history.length - 1];
console.log("HEAD kodida parol bormi:", head.files["src/db.ts"].includes("Sup3r-Secret-9xQ2"));
console.log("tarixda parol bormi:", history.some((c) => c.files["src/db.ts"].includes("Sup3r-Secret-9xQ2")));
```

```text
HEAD kodida parol bormi: false
tarixda parol bormi: true
```

Joriy kod toza, lekin parol o'zgarmagan. Bu holatda "tuzatish" faqat ko'rinishni o'zgartirdi.

### Hujum

Hujumchi repozitoriyning o'qish nusxasini oldi (xodimning noutbuki, eski CI keshi, ochiq fork). U har bir commit'dan ulanish satrlaridagi `user:parol@` qismini yig'adi va o'quv bazasi servisiga sinab ko'radi.

```ts run
type Commit = { id: string; files: Record<string, string> };
const history: Commit[] = [
  { id: "c1", files: { "src/db.ts": 'export const DB_URL = "postgres://app:Sup3r-Secret-9xQ2@db.fleet.test/fleet";' } },
  { id: "c2", files: { "src/db.ts": "export const DB_URL = process.env.DB_URL!;" } },
];

// O'quv bazasi: parol hali almashtirilmagan.
const dbAccepts = (pw: string) => pw === "Sup3r-Secret-9xQ2";

const found = new Set<string>();
for (const c of history) {
  for (const text of Object.values(c.files)) {
    for (const m of text.matchAll(/\/\/[^:\s/]+:([^@\s]+)@/g)) found.add(m[1]);
  }
}
for (const pw of found) console.log("tarixdan topildi, baza qabul qiladi:", dbAccepts(pw));
```

```text
tarixdan topildi, baza qabul qiladi: true
```

Hujum faqat o'quv repozitoriysi va o'quv bazasi servisiga qarshi. Haqiqiy tizimda xuddi shu yo'l bilan olingan parol hujumchiga bazaga kirishni beradi.

### Tuzatilgan kod

Tuzatish ikki qismdan iborat. Birinchisi, sizgan parolni rotatsiya qilish (eski qiymat bekor), ya'ni uni topish yetarli emas. Ikkinchisi, ilova statik parol o'rniga o'quv "vault"dan qisqa muddatli credential oladi: har credential bitta rolga bog'langan, lease muddati bor, revoke qilinishi mumkin va har amal jurnalga yoziladi. Vaqt mantiqiy soat bilan boshqariladi, shuning uchun natija har gal bir xil.

```ts run
// O'quv vault: real tizimda bu alohida xizmat, secretlar u yerda shifrlangan saqlanadi.
class ToyVault {
  private now = 0;
  private leases = new Map<string, { role: string; exp: number; revoked: boolean }>();
  readonly audit: string[] = [];

  tick(seconds: number) { this.now += seconds; }

  issue(role: string, ttl: number): string {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const secret = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    this.leases.set(secret, { role, exp: this.now + ttl, revoked: false });
    this.audit.push(`t=${this.now} issue role=${role} ttl=${ttl}`);
    return secret;
  }
  revoke(secret: string) {
    const l = this.leases.get(secret);
    if (l) { l.revoked = true; this.audit.push(`t=${this.now} revoke role=${l.role}`); }
  }
  check(secret: string, role: string): boolean {
    const l = this.leases.get(secret);
    return !!l && !l.revoked && l.role === role && this.now < l.exp;
  }
}

const vault = new ToyVault();

// Tarixdan sizgan eski statik parol vault'da yo'q, shuning uchun qabul qilinmaydi.
console.log("eski statik parol:", vault.check("Sup3r-Secret-9xQ2", "writer"));

const cred = vault.issue("writer", 60);
console.log("t=0, writer roli:", vault.check(cred, "writer"));
console.log("t=0, boshqa rol (reader):", vault.check(cred, "reader"));

vault.tick(59);
console.log("t=59:", vault.check(cred, "writer"));
vault.tick(2);
console.log("t=61 (lease tugadi):", vault.check(cred, "writer"));

const cred2 = vault.issue("writer", 60);
vault.revoke(cred2);
console.log("revoke qilingan credential:", vault.check(cred2, "writer"));
console.log("audit yozuvlari:", vault.audit.length);
```

```text
eski statik parol: false
t=0, writer roli: true
t=0, boshqa rol (reader): false
t=59: true
t=61 (lease tugadi): false
revoke qilingan credential: false
audit yozuvlari: 3
```

Nima uchun yetarli: tarixdan olingan parol endi hech narsaga yaramaydi, chunki u bekor qilingan, ilova qisqa muddatli credential bilan ishlaydi, credential bitta rolga bog'langan, o'g'irlansa ham u qisqa vaqt va bitta rol uchun ishlaydi, va har bir amal audit jurnalida. Qiymat kodda, tarixda yoki image'da emas, vault'da.

Nimani yopmaydi. Vault'ning o'ziga kirish huquqi buzilsa (ilova jarayoni buzilgan bo'lsa), hujumchi ham credential so'ray oladi: shuning uchun vault ruxsatlari minimal bo'lishi va so'rovlar monitoring qilinishi kerak (79-dars). Credential olingandan keyin xotirada bo'ladi; xotira darajasidagi himoya tahdid modeliga bog'liq (cheat sheet uni ko'pincha keraksiz, lekin ayrim modellarda zarur deb belgilaydi). Va "bootstrap" muammosi qoladi: ilova vault'ga qanday kiradi? Javob statik parol emas, platforma identifikatori (service account, rol, qisqa muddatli OIDC token).

## Qachon qo'llamaslik kerak

Vault'ni hamma loyiha uchun qurish shart emas. Bitta serverli kichik ichki vosita uchun secretlarni ilova foydalanuvchisining faylida (ruxsat 0600, repozitoriydan tashqarida) saqlash va qo'lda rotatsiya qilish oqilona kompromiss bo'lishi mumkin, agar bu hujjatlashtirilgan, rotatsiya jadvali bor va faylga kirish cheklangan bo'lsa. Cheat sheet ham tahdid modeli qiymatini ta'kidlaydi: ba'zi himoya choralari (masalan xotirada secretni himoyalash) ko'pchilik loyihalar uchun xarajatiga arzimaydi.

Dynamic secrets har xizmat qo'llab-quvvatlamaydi: ba'zi uchinchi tomon API'lar faqat bitta statik kalit beradi. Bunday holda kalit eng kam huquq bilan, rotatsiya jadvali va sizib chiqish rejasi bilan saqlanadi. Va rotatsiya avtomatlashtirilmagan bo'lsa, qisqa lease muddati ishdan chiqishlar manbaiga aylanadi: avval jarayonni sinang. Uzoq muddatli secret ham cheat sheet bo'yicha mumkin (apparat sirlari yillar davom etishi mumkin), lekin muddat tahdid modeliga asoslanishi kerak.

## Stack'da: Node.js, NestJS, Docker, GitHub Actions

Node.js ilovasida secret'ni qayerdan o'qishni bitta modulga to'plang: `config` moduli ishga tushishda kerakli qiymatlarni tekshiradi (mavjudligi, formati) va yo'q bo'lsa jarayon ishga tushmaydi (fail-safe, 78-dars). Secret'ni log'ga, xato xabariga va `JSON.stringify`ga tushmaydigan qilish uchun uni alohida turga o'rab, `toString()` va `toJSON()` ni yashiring; request/response log'ga yozishdan oldin nomi `secret`, `token`, `password` bo'lgan maydonlarni olib tashlang. NestJS'da konfiguratsiyani servislarga inject qilinadigan bitta provider orqali bering va secret manager mijozini (bulut SDK yoki Vault klienti) ham provider qilib yozing: shunda test va provayder almashtirish osonlashadi (aniq SDK API'si bu darsda manbadan tekshirilmagan).

Dockerfile'da `ARG`/`ENV` orqali secret bermang; build vaqtidagi secretlar uchun secret mount, runtime uchun orchestrator yoki secret manager. GitHub Actions'da workflow'ga minimal huquqli credential bering, mumkin bo'lsa OIDC orqali qisqa muddatli token oling, environment secretlariga required reviewer qo'ying va uchinchi tomon action'larni tekshirib versiyasini qotiring (87-dars Kubernetes Secrets bilan, 83-dars SAST/secret scanning bilan bog'lanadi). Pre-commit skaner va CI skaner birgalikda ishlaydi; bu darsdagi `findSecrets` o'quv namunasi, real loyihada mavjud skaner ishlatiladi.

Sizib chiqish rejasi qisqa va oldindan yozilgan bo'lsin: (1) secret'ni darhol bekor qilish yoki rotatsiya qilish, (2) kim va qachon ishlatganini audit jurnalidan tekshirish, (3) log'ni va artefaktni tozalash (kerak bo'lsa), (4) sababni topib, skanerga qoida qo'shish. Tarixni qayta yozish (history rewrite) sizgan secret'ni bekor qilmaydi; u faqat keyingi tarqalishni cheklashi mumkin.

## Xulosa

- Secret'ni kodga, git tarixiga, image'ga yoki log'ga yozish uni uzoq yashovchi va ko'p joyda saqlanadigan qiladi. Kodan olib tashlash uni bekor qilmaydi: sizgan secret rotatsiya va revoke qilinadi.
- Hayot sikli: yaratish, rotatsiya, revocation, expiration. ASVS 13.3 secretlar vault yoki HSM'da, eng kam huquq bilan, tugash va rotatsiya jadvali bilan bo'lishini talab qiladi.
- Dynamic (qisqa lease) credential statik qiymatdan yaxshi, chunki o'g'irlangan qiymat qisqa vaqt va bitta rol uchun ishlaydi. Ilovani qayta ishga tushirish credential'ni bekor qilmaydi.
- CI/CD'da eng yaxshisi: runtime secretlari pipeline'dan o'tmaydi, ilova platforma identifikatori bilan secretni o'zi oladi. Muhit o'zgaruvchisi va Docker `ARG`/`ENV` oxirgi chora.
- Secret scanning (pre-commit va CI, bir nechta vosita) aniqlaydi, lekin tuzatmaydi. Aniqlangandan keyingi harakat: rotatsiya, audit tekshiruvi, qoida qo'shish.
- Vault ham himoyalanadi: ruxsatlar minimal, so'rovlar audit qilinadi, ilova vault'ga statik parol bilan emas, platforma identifikatori bilan kiradi.
