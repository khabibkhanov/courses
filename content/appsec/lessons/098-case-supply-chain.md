---
n: 98
slug: case-supply-chain
title: "Case study: supply chain hujumlari"
summary: "Ikki hodisa birlamchi yozuvlar bo'yicha: xz/liblzma (2024, release tarball va git repozitoriy farqi) va npm ekotizimidagi 2025-yil sentabrdagi o'z-o'zidan ko'payuvchi hujum (CISA alert). SLSA build track nimani yopishi va nimani yopmasligi, tarball tekshiruvi va xavfsiz versiyaga pin qilish o'quv modelida."
duration: 45
sources:
  - id: t10-a03
    note: "OWASP Top 10:2025 A03 (Software Supply Chain Failures): kategoriya 2013 dagi 'bilinadigan zaifliklar bilan komponentlar' dan butun zanjirga kengaygan; 'ehtimol zaifsiz' belgilari (tranzitiv bog'liqliklarni kuzatmaslik, CI/CD tizimi build qiladigan tizimdan kuchsizroq, vazifalar ajratilmagan); oldini olish (SBOM, rasmiy manbalar va imzolangan paketlar, bosqichma-bosqich rollout); 3-stsenariyda Shai-Hulud tavsifi"
  - id: xz-openwall
    note: "Andres Freund, oss-security (2024-03-29): upstream xz repozitoriysi va tarball'lar backdoor qilingani; build-to-host.m4 dagi qator faqat tarball'larda (5.6.0 va 5.6.1) bor, git manbada yo'q; configure oxirida obfuscated skript ishlashi; repozitoriyda tests/files ostidagi 'test' fayllari; shartlar (x86-64 Linux, gcc va GNU ld, Debian yoki RPM paket build); sshd libsystemd orqali liblzma'ga bog'lanishi; muallifning o'z o'lchovlari"
  - id: cisa-npm-2025
    note: "CISA alert (2025-09-23): 'Shai-Hulud' nomi bilan ommaga ma'lum o'z-o'zidan ko'payuvchi hujum 500 dan ortiq paketni kompromet qilgan; o'g'irlangan ma'lumotlar 'Shai-Hulud' nomli ommaviy GitHub repozitoriysiga yuklangan; GitHub PAT va AWS/GCP/Azure API kalitlarini qidirgan; kompromet qilingan dasturchi sifatida npm'ga autentifikatsiya qilib boshqa paketlarga kod kiritgan; tavsiyalar: dependency review, lockfile tekshiruvi, 2025-09-16 dan oldingi xavfsiz versiyalarga pin, kredensiallarni almashtirish, phishing-resistant MFA"
  - id: slsa
    note: "SLSA v1.1 (hozir 'Retired', joriy tasdiqlangan versiya v1.2, unda Source Track qo'shilgan): Build track L0-L3; L1 provenance mavjud (xato va hujjatlashtirishga qarshi, uni aylanib o'tish yoki soxtalashtirish oson), L2 imzolangan provenance hosting build platformadan (build'dan keyingi tampering), L3 hardened build platform (build paytidagi tampering); provenance kim, qaysi jarayon va qaysi kirishlardan build qilganini aytadi"
quiz:
  - q: "Freund xabariga ko'ra xz backdoor'ining bir qismi 'faqat tarball'larda' bo'lgan. Bu dasturchi uchun qanday amaliy xulosa beradi?"
    options:
      - "Release artefakti (tarball) va uning manba repozitoriysi bir-biridan farq qilishi mumkin; artefaktni manba bilan solishtirish yoki manbadan o'zi build qilish kerak"
      - "Git repozitoriysini tekshirish yetarli: tarball doim git bilan bir xil"
      - "Tarball'dan foydalanish taqiqlangan"
      - "Faqat Debian paketlariga tegishli"
    answer: 0
    explain: "Xabarga ko'ra build-to-host.m4 dagi qator tarball'larda bor, git manbada yo'q (GitHub 'source code' havolalari repozitoriydan generatsiya qilingani uchun ularda yo'q). Artefakt va manba orasidagi farq hujumchi ishlatadigan bo'shliq. Hamma tarball'ni taqiqlash esa amaliy emas: generatsiya qilingan fayllar farq qilishi normal, ularni ko'rib chiqish kerak."
  - q: "SLSA Build L2 nimani yaxshilaydi?"
    options:
      - "Manba kodidagi mantiqiy xatolarni topadi"
      - "Hech narsani, u faqat hujjat"
      - "Dependency'lardagi zaifliklarni avtomatik tuzatadi"
      - "Hosting build platformasi tomonidan imzolangan provenance: build'dan keyin artefakt yoki provenance'ni o'zgartirishga qarshi"
    answer: 3
    explain: "SLSA v1.1 L2 ni imzolangan provenance, hosting platformadan, 'tampering after the build' ga qarshi deb ta'riflaydi. U manbaning o'zi zararli ekanini aniqlamaydi: provenance 'qanday build qilingan' ni aytadi, 'manba yaxshimi' ni emas."
  - q: "xz holatida manbaning o'zida (repozitoriyda) zararli fayllar bor edi. SLSA provenance bunday hodisani avtomatik to'xtata oladimi?"
    options:
      - "Ha, L3 hamma hujumni to'xtatadi"
      - "Yo'q, bu darsning xulosasiga ko'ra provenance build'ning kelib chiqishini tasdiqlaydi, manbaning mazmuni zararli bo'lsa uni baholamaydi; manba review va maintainer ishonchi alohida nazorat"
      - "Ha, agar imzo bo'lsa"
      - "Provenance faqat Windows uchun"
    answer: 1
    explain: "Bu muallif xulosasi (SLSA matnidagi to'g'ridan-to'g'ri gap emas): provenance build jarayonini tekshiruvchi qiladi, kodning niyatini emas. Zararli manba bilan toza build ham zararli artefakt beradi."
  - q: "CISA alertiga ko'ra npm hujumi qanday ko'paygan?"
    options:
      - "Foydalanuvchi o'zi har paketni qo'lda yuklab"
      - "npm serveri o'chirilgan"
      - "Zararli kod muhitdagi kredensiallarni qidirgan va kompromet qilingan dasturchi sifatida npm'ga autentifikatsiya qilib, boshqa paketlarga kod kiritib, kompromet qilingan versiyalarni nashr etgan"
      - "Hujumchi har paketga qo'lda kirgan"
    answer: 2
    explain: "Alert mexanizmni shunday tasvirlaydi: kredensial yig'ish (GitHub PAT va cloud API kalitlari), tashqariga chiqarish va o'z-o'zidan ko'payish. Natijada hujum o'z dasturchi akkauntlari orqali tarqaladi, shuning uchun MFA va kredensiallarni almashtirish tavsiyada."
  - q: "CISA tavsiyalaridan qaysi biri to'g'ri?"
    options:
      - "Hech narsa qilmang, npm o'zi hal qiladi"
      - "Lockfile'larni tekshirib ta'sirlangan paketlarni (shu jumladan tranzitiv) toping, 2025-yil 16-sentabrdan oldingi xavfsiz versiyalarga pin qiling, dasturchi kredensiallarini almashtiring va phishing-resistant MFA majburiy qiling"
      - "Faqat paketlarni o'chiring"
      - "Faqat parollarni o'zgartiring"
    answer: 1
    explain: "Alertdagi tavsiyalar to'plami: dependency review, lockfile va cache tekshiruvi, pin, kredensial rotatsiyasi, phishing-resistant MFA, tarmoq monitoringi, GitHub sozlamalarini mustahkamlash. Bittasi yetarli emas."
  - q: "Tarball tekshiruvi 'tarball'da git'da yo'q fayl bor' deb signal berdi. To'g'ri munosabat qaysi?"
    options:
      - "Doim zararli: build to'xtatiladi va qaytarilmaydi"
      - "Tekshiruvni o'chirish kerak"
      - "Signal e'tiborsiz qoldiriladi"
      - "Har signal tekshiriladi: autotools kabi generatsiya qilingan fayllar (configure) normal farq beradi, shuning uchun allowlist bilan ajratiladi, qolgan farqlar qo'lda ko'riladi"
    answer: 3
    explain: "Generatsiya qilingan fayllar tarball'larda ko'pincha bo'ladi, shuning uchun tekshiruv allowlist va insoniy review bilan ishlaydi. Hamma farqni rad etish yoki e'tiborsiz qoldirish ikkalasi ham xato."
task:
  title: "Release tarball'ni git daraxti bilan solishtirish"
  prompt: |
    `verifyRelease(tarball, git, generated)` release artefaktidagi fayllarni git daraxti bilan solishtiradi va topilmalar ro'yxatini qaytaradi. Hozirgi versiya faqat fayl nomlarini solishtiradi, mazmuni o'zgargan faylni ko'rmaydi.

    Qoida: har tarball fayli uchun: git'da yo'q va `generated` ro'yxatida ham yo'q bo'lsa `"faqat tarballda: <yo'l>"`; git'da bor, lekin mazmuni boshqa bo'lsa `"mazmun farqi: <yo'l>"`; `generated` ro'yxatidagi yo'l git'da bo'lmasa ham topilma emas, lekin git'da bo'lsa va farq qilsa mazmun farqi hisoblanadi. Natija yo'l tartibida. Imzoni o'zgartirmang. Oxirgi qatorlar kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    type F = { path: string; content: string };

    function verifyRelease(tarball: F[], git: F[], generated: string[]): string[] {
      const inGit = new Set(git.map((f) => f.path));
      const findings: string[] = [];
      for (const f of tarball) {
        if (!inGit.has(f.path) && !generated.includes(f.path)) findings.push(`faqat tarballda: ${f.path}`);
      }
      return findings.sort();
    }

    const git: F[] = [
      { path: "src/lzma.c", content: "decode();" },
      { path: "m4/helper.m4", content: "macro();" },
      { path: "tests/a.dat", content: "data" },
    ];
    const clean: F[] = [...git, { path: "configure", content: "generated" }];
    const tampered: F[] = [
      { path: "src/lzma.c", content: "decode();" },
      { path: "m4/helper.m4", content: "macro();\nrun_hidden_step();" },
      { path: "tests/a.dat", content: "data" },
      { path: "configure", content: "generated" },
      { path: "extra.sh", content: "x" },
    ];
    console.log("toza:", verifyRelease(clean, git, ["configure"]));
    console.log("o'zgartirilgan:", verifyRelease(tampered, git, ["configure"]));
  solution: |
    type F = { path: string; content: string };

    function verifyRelease(tarball: F[], git: F[], generated: string[]): string[] {
      const gitMap = new Map(git.map((f) => [f.path, f.content] as const));
      const findings: string[] = [];
      for (const f of tarball) {
        const g = gitMap.get(f.path);
        if (g === undefined) {
          if (!generated.includes(f.path)) findings.push(`faqat tarballda: ${f.path}`);
        } else if (g !== f.content) {
          findings.push(`mazmun farqi: ${f.path}`);
        }
      }
      return findings.sort();
    }

    const git: F[] = [
      { path: "src/lzma.c", content: "decode();" },
      { path: "m4/helper.m4", content: "macro();" },
      { path: "tests/a.dat", content: "data" },
    ];
    const clean: F[] = [...git, { path: "configure", content: "generated" }];
    const tampered: F[] = [
      { path: "src/lzma.c", content: "decode();" },
      { path: "m4/helper.m4", content: "macro();\nrun_hidden_step();" },
      { path: "tests/a.dat", content: "data" },
      { path: "configure", content: "generated" },
      { path: "extra.sh", content: "x" },
    ];
    console.log("toza:", verifyRelease(clean, git, ["configure"]));
    console.log("o'zgartirilgan:", verifyRelease(tampered, git, ["configure"]));
  solutionNotes: |
    - Git daraxti `Map` ga olinadi: fayl nomi bo'yicha mazmun solishtiriladi. Faqat nomlarni solishtirish mazmuni o'zgargan faylni (`m4/helper.m4`) ko'rmaydi.
    - `generated` allowlist: generatsiya qilingan `configure` kabi fayllar git'da bo'lmaydi va normal. Allowlist qisqa, ko'rib chiqilgan va versiyalanadigan bo'lishi kerak; aks holda u hujumchi yashirinadigan joyga aylanadi.
    - Tekshiruv natijasi ogohlantirish, hukm emas: topilma insoniy review talab qiladi. `configure` ning o'zi ham o'zgartirilgan bo'lishi mumkin; generatsiya qilingan faylni qayta generatsiya qilib solishtirish (reproducible build) ancha kuchliroq nazorat.
    - Qoldiq risk: agar zararli o'zgarish git'ning o'zida bo'lsa, bu tekshiruv uni ko'rmaydi: manba review va maintainer ishonchi alohida masala.
  checklist:
    - "Toza release uchun topilma yo'q"
    - "Mazmuni o'zgargan fayl `mazmun farqi` sifatida topiladi"
    - "Git'da yo'q va allowlist'da yo'q fayl `faqat tarballda` sifatida topiladi"
    - "Allowlist'dagi generatsiya qilingan fayl topilma bermaydi"
    - "Tekshiruv zararli manbani topa olmasligini ayta olasiz"
---

## Muammo

Dasturiy ta'minot zanjiri (supply chain) hujumi sizning kodingizdagi xatoga tayanmaydi: hujumchi sizga kelib tushadigan narsani, ya'ni bog'liqlik, build vositasi yoki release artefaktini, zararli qiladi. Siz kod ko'rib chiqishda o'z kodingizni yaxshi tekshirishingiz mumkin, lekin `npm install` bir necha yuz paketni olib keladi va ularni hech kim ko'rmaydi (81-dars). OWASP Top 10:2025 ro'yxatida bu A03 Software Supply Chain Failures nomi bilan alohida kategoriya.

Bu dars ikki hodisani faqat birlamchi yozuvlar bo'yicha ko'radi: 2024-yilda xz/liblzma'da topilgan backdoor (kashf etuvchining oss-security xabari) va 2025-yil sentabrda npm ekotizimidagi o'z-o'zidan ko'payuvchi hujum (CISA alerti). Ikkalasi turli mexanizm: birinchisida release artefakti va manba repozitoriysi farq qilgan, ikkinchisida kompromet qilingan dasturchi akkauntlari orqali hujum tarqalgan. Ularni birga ko'rish dasturchiga zanjirning ikki zaif bo'g'inini ko'rsatadi: artefakt ishonchi va dasturchi kredensiallari.

## Asosiy g'oya

### Hodisa 1: xz/liblzma (2024)

Andres Freund 2024-yil 29-martda oss-security ro'yxatiga yozdi. U Debian sid o'rnatmalarida liblzma (xz paketining qismi) atrofida bir necha haftadan beri g'alati belgilarni kuzatgan: ssh orqali kirish CPU'ni ko'p olgan, valgrind xatolari chiqqan. Tekshiruv natijasi: "upstream xz repozitoriysi va xz tarball'lari backdoor qilingan". Avvaliga u buni Debian paketining komprometi deb o'ylagan, lekin muammo upstream'da ekan.

Xabarning mexanikasi bo'yicha asosiy nuqtalar (hammasi muallifning o'z tavsifi):

- Backdoor'ning bir qismi faqat tarqatilgan tarball'larda (5.6.0 va 5.6.1 versiyalari) bo'lgan. `m4/build-to-host.m4` dagi bir qator upstream manbada va xz tomonidan ishlatiladigan git daraxtida yo'q, lekin release tarball'larda bor (GitHub "source code" havolalari to'g'ridan-to'g'ri repozitoriydan generatsiya qilingani uchun ularda bu qator yo'q). U `configure` oxirida ishlaydigan obfuscated skriptni kiritgan.
- Bu skript repozitoriydagi "test" fayllaridan (`tests/files/` ostidagi `bad-3-corrupt_lzma2.xz` va `good-large_compressed.lzma`) ma'lumot olgan; xabarga ko'ra ular 5.6.0 da hech qanday testda ishlatilmagan.
- Skript faqat ma'lum shartlarda ishlagan: x86-64 Linux, gcc va GNU linker, Debian yoki RPM paketini build qilish jarayoni. Debian yoki RPM sharti haqida muallif, bu tekshiruvchilarga muammoni qayta hosil qilishni qiyinlashtirishga qaratilgan bo'lishi mumkin, deb yozgan.
- OpenSSH serveri to'g'ridan-to'g'ri liblzma'dan foydalanmaydi, lekin Debian va boshqa tarqatmalar systemd bildirishnomasi uchun patch qo'shadi va libsystemd lzma'ga bog'liq. Backdoor ifunc resolver'larni almashtirish orqali ishga tushgan.
- Muallifning o'z o'lchovi: orqa eshikli liblzma bilan ssh login tezligi sekinlashgan (uning muhitida 0,299 soniyadan 0,807 soniyagacha), bu ham topilishga sabab bo'lgan belgi.
- Ta'sir doirasi haqida muallif xz 5.6.0 va 5.6.1 hali tarqatmalarga keng kirmaganini, kirgan joyda asosan pre-release versiyalarda ekanini yozgan.

Muallifning gumoni (uning fikri, tasdiqlangan fakt emas): faoliyat bir necha hafta davom etgani uchun committer yo bevosita ishtirok etgan yoki uning tizimi jiddiy kompromet qilingan. Bu darsda kim ekani yoki motivi haqida hech narsa da'vo qilinmaydi.

### Hodisa 2: npm, 2025-yil sentabr

CISA alerti (2025-09-23) ommaga "Shai-Hulud" nomi bilan tanilgan o'z-o'zidan ko'payuvchi hujum npm registry'dagi 500 dan ortiq paketni kompromet qilganini yozadi. Alertda tasvirlangan mexanizm: dastlabki kirishdan keyin zararli dastur muhitdagi maxfiy kredensiallarni qidirgan, xususan GitHub Personal Access Token'lari va cloud (AWS, GCP, Azure) API kalitlarini. Keyin uni tashqi endpointga chiqargan, shuningdek GitHub API orqali ommaviy repozitoriyga yuklagan va kompromet qilingan dasturchi sifatida npm'ga autentifikatsiya qilib, boshqa paketlarga kod kiritgan hamda kompromet qilingan versiyalarni nashr etgan. Ya'ni bu "paket zararli bo'lib qoldi" emas, dasturchi akkaunti orqali zanjir bo'ylab tarqaladigan jarayon.

CISA tavsiyalari: barcha npm ishlatadigan dasturiy ta'minotda dependency review; `package-lock.json` yoki `yarn.lock` bo'yicha ta'sirlangan paketlarni (tranzitiv ham) topish; artefakt repozitoriylari va cache'larda ta'sirlangan versiyalarni qidirish; 2025-yil 16-sentabrdan oldingi ma'lum xavfsiz versiyalarga pin qilish; barcha dasturchi kredensiallarini darhol almashtirish; GitHub va npm kabi muhim platformalarda phishing-resistant MFA majburiy qilish; anomal tarmoq xatti-harakatlarini kuzatish; GitHub sozlamalarini mustahkamlash (keraksiz GitHub App va OAuth ilovalarni olib tashlash, webhook va secret'larni audit qilish, branch protection, Secret Scanning va Dependabot security updates).

## Chuqurroq: SLSA nimani qamraydi

SLSA v1.1 spetsifikatsiyasi (sahifada hozir "Retired" deb belgilangan, joriy versiya v1.2) supply chain xavfsizligini ketma-ket oshib boruvchi darajalar bilan tasvirlaydi. Build track bo'yicha L0 hech qanday kafolat bermaydi; L1 da provenance (artefakt kim, qaysi jarayon va qaysi kirishlar bilan build qilingani) mavjud bo'lishi kerak, bu xato va hujjatlashtirishga qarshi; L2 da provenance imzolangan va hosting build platformasi tomonidan yaratiladi, bu build'dan keyingi tampering'ga qarshi; L3 da build platformasi mustahkamlangan, bu build paytidagi tampering'ga qarshi. Build track maqsadi artefakt kutilganidek build qilinganini tekshirish imkonini berish: iste'molchi paket uchun kutilgan provenance qanday ko'rinishini biladi va haqiqiysi bilan solishtiradi.

Bu ikki hodisaga qanday tegishli? Quyidagi xulosalar bu darsning tahlili, SLSA matnidagi gaplar emas:

- xz holatidagi "tarball va git farqi" artefakt va manba orasidagi aloqa uzilishi. Artefaktning aynan qaysi manbadan va qanday jarayonda yaratilgani tekshiriladigan bo'lsa (provenance, reproducible build), farq ko'rinadi. Biroq manbaning o'zidagi zararli fayllar (repozitoriydagi "test" fayllari) provenance orqali tasdiqlangan toza build bilan ham artefaktga tushadi: provenance niyatni baholamaydi.
- npm holatida asosiy zaiflik dasturchi kredensiallari edi. Provenance (82-dars) paketni qaysi repozitoriy va workflow nashr etganini ko'rsatishi mumkin, lekin kredensial o'g'irlangan va hujumchi nashr etish huquqiga ega bo'lsa, boshqa nazoratlar kerak: phishing-resistant MFA, qisqa muddatli token'lar, nashr etish huquqini cheklash. Kompromet qilingan akkaunt paketni qonuniy yo'l bilan nashr etadi.

SLSA v1.2 xz holatiga yaqinroq narsa qo'shgan: Source Track. Spetsifikatsiyaga ko'ra u ishlab chiqaruvchi va iste'molchiga manba kodiga ortib boruvchi ishonch beradi va manba revizyasi qanday yaratilganini tasvirlaydi; revizyaning kutilgan jarayonini repozitoriy egasi (tashkilot) belgilaydi va texnik nazoratlar bilan majburlaydi, iste'molchi esa attestatsiyalarni ko'rib, revizyaning o'z talablariga mos kelishini tekshiradi. Bu zararli commit'ni o'zi topmaydi, lekin "bu o'zgarish ikkinchi odam ko'rigidan o'tdimi" degan savolga tekshiriladigan javob beradi.

### OWASP A03 nima deydi

Top 10:2025 A03 kategoriyasi 2013-yilda "bilinadigan zaifliklar bilan komponentlar" sifatida paydo bo'lgan va endi build, tarqatish va yangilash jarayonidagi har qanday buzilishni qamraydi. Tavsif zaiflik belgilari sifatida, jumladan, quyidagilarni sanaydi: tranzitiv bog'liqliklar ham kuzatilmaydi; zanjirdagi o'zgarishlar (IDE kengaytmalari, repozitoriy, artefakt saqlash joyi) hujjatlashtirilmaydi; zanjir tizimlarida vazifalar ajratilmagan, ya'ni bitta odam kodni yozib, ikkinchi odam ko'rigisiz production'ga olib chiqa oladi; CI/CD pipeline u build qiladigan tizimlardan zaifroq himoyalangan. Oldini olish ro'yxatida: butun dasturiy ta'minot uchun SBOM'ni markaziy yaratish va boshqarish, faqat rasmiy manbalardan xavfsiz kanal orqali olish va imzolangan paketlarni afzal ko'rish, versiyani ongli tanlash, CI/CD va IDE vositalarini muntazam yangilash, hamda yangilanishni hamma tizimga bir vaqtda emas, bosqichma-bosqich (staged rollout, canary) chiqarish, shunda ishonchli vendor kompromet bo'lsa ta'sir cheklanadi. Shai-Hulud hodisasi Top 10 matnida ham keltirilgan va unda dasturchilarning o'zi endi supply chain hujumlarining asosiy nishoni ekani ta'kidlanadi: dasturchi mashinasi va uning token'lari zanjirning bir qismi.

Bu ro'yxatni ikki hodisaga qo'ysak: xz holatiga eng yaqin nazoratlar "ikkinchi odam ko'rigi" va manba hamda artefakt orasidagi aloqani tekshirish; npm holatiga eng yaqinlari kredensial gigienasi, bosqichma-bosqich yangilash va yangi chiqqan versiyani darhol emas, tekshiruvdan keyin qabul qilish.

Shuning uchun supply chain himoyasi qatlamli: manba review, artefakt tekshiruvi, dasturchi akkauntlari xavfsizligi, lockfile va yangilanish siyosati (82 va 85-darslar).

## Misol: tarball tekshiruvi va xavfsiz versiyaga pin

Quyidagi o'quv modeli real paket yoki real tizim emas. "Fayl" lar xotiradagi satrlar, "yashirin qadam" zararsiz belgi, hech qanday zararli kod yo'q.

### 1. Zaif kod

```ts run
type F = { path: string; content: string };

const gitTree: F[] = [
  { path: "src/decode.c", content: "decode();" },
  { path: "m4/helper.m4", content: "macro();" },
  { path: "tests/sample.dat", content: "data" },
];
// Release tarball: git bilan deyarli bir xil, lekin m4 faylida qo'shimcha qator bor
const tarball: F[] = [
  { path: "src/decode.c", content: "decode();" },
  { path: "m4/helper.m4", content: "macro();\nrun_hidden_step();" },
  { path: "tests/sample.dat", content: "data" },
  { path: "configure", content: "# generatsiya qilingan" },
];

// ZAIF: iste'molchi tarball'ni tekshirmay build qiladi
function buildFrom(files: F[]): string[] {
  const log: string[] = [];
  for (const f of files) {
    if (f.content.includes("run_hidden_step")) log.push(`[o'quv] ${f.path}: yashirin qadam ishga tushdi`);
  }
  log.push("build tugadi");
  return log;
}
buildFrom(tarball).forEach((l) => console.log(l));
console.log("git manbadan build:");
buildFrom(gitTree).forEach((l) => console.log(" ", l));
```

### 2. Hujum

Modelda "hujumchi" release tarball tayyorlovchisi: u manbada yo'q qatorni faqat tarball'dagi `m4/helper.m4` ga qo'shadi. Iste'molchi tarball'dan build qilganda yashirin qadam ishlaydi, git daraxtidan build qilganda ishlamaydi:

```text
[o'quv] m4/helper.m4: yashirin qadam ishga tushdi
build tugadi
git manbadan build:
  build tugadi
```

Farq faqat tarball'da: aynan shu xz xabaridagi tuzilma (xabarda ham qator tarball'da bor, git manbada yo'q), lekin bu yerda mexanizm soddalashtirilgan o'quv modeli.

### 3. Tuzatilgan kod

```ts run
type F = { path: string; content: string };

const gitTree: F[] = [
  { path: "src/decode.c", content: "decode();" },
  { path: "m4/helper.m4", content: "macro();" },
  { path: "tests/sample.dat", content: "data" },
];
const tarball: F[] = [
  { path: "src/decode.c", content: "decode();" },
  { path: "m4/helper.m4", content: "macro();\nrun_hidden_step();" },
  { path: "tests/sample.dat", content: "data" },
  { path: "configure", content: "# generatsiya qilingan" },
];
const GENERATED = ["configure"]; // ko'rib chiqilgan va versiyalanadigan allowlist

function verifyRelease(tar: F[], git: F[], generated: string[]): string[] {
  const g = new Map(git.map((f) => [f.path, f.content] as const));
  const out: string[] = [];
  for (const f of tar) {
    const gc = g.get(f.path);
    if (gc === undefined) {
      if (!generated.includes(f.path)) out.push(`faqat tarballda: ${f.path}`);
    } else if (gc !== f.content) out.push(`mazmun farqi: ${f.path}`);
  }
  return out.sort();
}
function build(tar: F[]): string {
  const problems = verifyRelease(tar, gitTree, GENERATED);
  return problems.length ? `build TO'XTATILDI: ${problems.join("; ")}` : "build davom etadi";
}
console.log("o'zgartirilgan tarball:", build(tarball));
console.log("toza tarball:", build([...gitTree, { path: "configure", content: "# generatsiya qilingan" }]));
```

```text
o'zgartirilgan tarball: build TO'XTATILDI: mazmun farqi: m4/helper.m4
toza tarball: build davom etadi
```

Tuzatish nima uchun yetarli: artefaktdagi har fayl manba bilan solishtiriladi, shuning uchun tarball'ga kirgan qo'shimcha qator ko'rinadi; generatsiya qilingan fayllar uchun allowlist bor. Yopilmagan narsa: git daraxtining o'zi zararli bo'lsa (xz holatida "test" fayllari repozitoriyda edi), tekshiruv hech narsa ko'rmaydi; allowlist'dagi `configure` o'zgartirilgan bo'lsa u ham ko'rinmaydi (uni qayta generatsiya qilib solishtirish kuchliroq); real tarball'larda ko'p generatsiya qilingan fayl bor, shuning uchun amalda bu tekshiruv review bilan birga ishlaydi.

### Xavfsiz versiyaga pin

CISA tavsiyasi: ma'lum xavfsiz sanadan oldingi versiyalarga pin qilish. Mana sodda mexanizm:

```ts run
type Rel = { version: string; published: string }; // ISO sana
const releases: Rel[] = [
  { version: "1.2.0", published: "2025-08-20" },
  { version: "1.2.1", published: "2025-09-10" },
  { version: "1.2.2", published: "2025-09-16" },
  { version: "1.3.0", published: "2025-09-18" },
];

// "Shu sanadan oldin chiqqan eng yangi versiya"
function pinBefore(rels: Rel[], cutoff: string): string | null {
  const ok = rels.filter((r) => r.published < cutoff);
  return ok.length ? ok[ok.length - 1].version : null;
}
console.log("2025-09-16 dan oldin:", pinBefore(releases, "2025-09-16"));
console.log("2025-08-01 dan oldin:", pinBefore(releases, "2025-08-01"));
```

```text
2025-09-16 dan oldin: 1.2.1
2025-08-01 dan oldin: null
```

Eslatma: `published < cutoff` qat'iy kichik, shuning uchun 16-sentabrda chiqqan versiya tushmaydi. Real loyihada pin lockfile va `npm ci` bilan qo'llanadi (82-dars); bu funksiya faqat tanlash mantig'ini ko'rsatadi. Sana va versiya raqamlari o'quv uchun o'ylab topilgan, real paket emas.

## Qachon qo'llamaslik kerak

Hamma bog'liqlikni qo'lda audit qilish yoki hammasini o'zingiz yozish yechim emas: yuzlab paketni ko'zdan kechirib bo'lmaydi, o'zingiz yozgan kod esa xatolarga ko'proq moyil. Supply chain himoyasi ko'lamli narsa: kritik bog'liqliklarni ajratish, lockfile bilan versiyani qotirish, yangilanishni jarayon qilish, build va nashr etishni mustahkamlash.

Doim eng eski versiyaga pin qilish ham zararli: yangi xavfsizlik tuzatishlari kelmaydi. Yuqoridagi `pinBefore` favqulodda javob (muayyan hodisa sanasidan oldingi toza holatga qaytish); doimiy siyosat uchun CVE/advisory kuzatuvi va tezkor yangilash jarayoni kerak.

SLSA darajasiga intilish kichik jamoa uchun darhol maqsad bo'lishi shart emas. L1 (provenance mavjud) arzon boshlanish, yuqori darajalar platforma va jarayon o'zgarishlarini talab qiladi. Daraja tanlash riskka bog'liq (8-dars, ASVS darajalari bilan o'xshash mantiq).

Va nihoyat, bu hodisalardan "ochiq manba xavfli" degan xulosa chiqarish xato. Ikkala yozuv ham jamoa tekshiruvi (xz holatida bitta dasturchining kuzatuvi) va davlat agentliklarining ommaviy tavsiyalari orqali ma'lum bo'lgan; xulosa ishonchni tekshiriladigan qilish, ishonchni rad etish emas.

## Stack'da: npm, GitHub Actions va CI

npm loyihasida: lockfile commit qilinadi va CI'da `npm ci` ishlatiladi (lockfile'dan farq bo'lsa to'xtaydi), bog'liqliklarni yangilash bot orqali PR sifatida keladi va CI testlaridan o'tadi, GitHub'da branch protection va Secret Scanning yoqiladi, nashr etuvchilar phishing-resistant MFA ishlatadi, CI token'lari qisqa muddatli va minimal huquqli bo'ladi (69 va 85-darslar). Release tarball tekshiruvi kutubxona yoki tizim paketlarini manbadan build qiladigan jamoalar uchun dolzarb; JavaScript ilovalari uchun muqobil: nashr etuvchi paket provenance'ini tekshirish (82-dars). Quyidagi parcha GitHub Actions'da bog'liqlik o'rnatishning eng kam huquqli shaklini ko'rsatadi (ishga tushirilmaydi: workflow YAML emas, shuning uchun TypeScript sifatida faqat sozlama obyekti; sintaksis tekshirilgan):

```ts
// CI siyosati: bog'liqlik o'rnatishda tekshiriladigan qoidalar (maxfiy qiymatsiz)
export const installPolicy = {
  command: "npm ci",            // lockfile'dan farq bo'lsa xato
  lockfileRequired: true,
  tokenScope: "read-only",      // o'rnatish bosqichida nashr etish huquqi yo'q
  publishRequires: ["phishing-resistant MFA", "protected branch", "provenance"],
} as const;
```

## Xulosa

- Supply chain hujumi sizga kelib tushadigan narsani (bog'liqlik, artefakt, build vositasi) zararli qiladi; OWASP Top 10:2025 da bu A03.
- xz holatida (Freund xabari, 2024-03-29) zararli qator faqat release tarball'larda bor edi, git manbada yo'q: artefakt va manba farq qilishi mumkin.
- npm holatida (CISA alerti, 2025-09-23) hujum dasturchi kredensiallarini o'g'irlab, ularning nomidan boshqa paketlarga kod kiritib tarqalgan; tavsiya: lockfile tekshiruvi, pin, kredensial rotatsiyasi, phishing-resistant MFA.
- SLSA Build L1-L3 artefaktning kelib chiqishini tekshirish imkonini beradi; manbaning mazmuni zararli bo'lsa u bilan to'xtatilmaydi (bu darsning xulosasi).
- Tarball tekshiruvi va xavfsiz versiyaga pin o'quv mexanizmlari; ularning qoldiq risklarini (zararli manba, allowlist, eskirgan versiya) biling.
- Himoya qatlamli: manba review, artefakt tekshiruvi, dasturchi akkaunt xavfsizligi, lockfile va yangilash siyosati.
