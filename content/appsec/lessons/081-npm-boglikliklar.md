---
n: 81
slug: npm-boglikliklar
title: "Bog'liqliklar xavfi: npm ekotizimi"
summary: "Ilovangiz kodining ko'p qismini boshqalar yozgan: tranzitiv bog'liqliklar, semver oralig'i, install skriptlari va typosquatting qanday kirish nuqtasiga aylanishi, lockfile va integrity bilan nima yopilishi."
duration: 45
sources:
  - id: t10-a03
    note: "A03:2025 Software Supply Chain Failures: ta'rif (build, distribution, update jarayonidagi buzilishlar), 'how to prevent' ro'yxati (SBOM, tranzitiv bog'liqliklar, bosqichma-bosqich rollout) va Scenario #3 (Shai-Hulud npm qurti)"
  - id: cisa-npm-2025
    note: "CISA alert (2025-09-23); OWASP A03 Scenario #3 aynan shu alertga havola beradi. Alertning o'z matni bu darsda o'qilmagan, shuning uchun faktlar OWASP A03 dan olingan"
  - id: node-security
    note: "Node.js Learn xavfsizlik amaliyotlari sahifasi umumiy havola; bu darsning aniq da'volari boshqa manbalarga (npm hujjati, OWASP NPM cheat sheet, ASVS) tayanadi"
  - id: npm-ci
    note: "npm-ci hujjati: lockfile majburiy, package.json bilan mos kelmasa xato, lockfile va package.json'ga yozmaydi, node_modules oldin o'chiriladi"
  - id: npm-scripts
    note: "npm scripts hujjati: preinstall, install, postinstall hayot sikli skriptlari; npm ci da preinstall lockfile tekshirilgandan keyin ishlaydi"
  - id: cs-npm
    note: "OWASP NPM Security Cheat Sheet: lockfile'ni majburlash (npm ci), --ignore-scripts va allowlist, typosquatting, slopsquatting, dependency confusion (scoped nomlar)"
  - id: asvs
    note: "ASVS 5.0.0 V15.1.1, V15.1.2 (SBOM, ishonchli repozitoriylar) va V15.2.4 (tranzitiv bog'liqliklar kutilgan repozitoriydan, dependency confusion xavfi yo'q)"
quiz:
  - q: "package.json'da \"geo-utils\": \"^1.2.0\" yozilgan, lockfile esa yo'q. CI'da yangi `npm install` qaysi versiyani oladi?"
    options:
      - "Doim 1.2.0, chunki oraliqning pastki chegarasi"
      - "Major versiyasi 1 bo'lgan eng yangi versiyani, shu jumladan bugun e'lon qilinganini"
      - "Faqat 1.2.x versiyalaridan eng yangisini"
      - "Registry'dagi eng yangi versiyani, major'dan qat'i nazar"
    answer: 1
    explain: "Caret oralig'i major raqamni qotiradi va undan yuqori minor/patch'larni ruxsat etadi. Lockfile bo'lmasa, har o'rnatishda mos keladigan eng yangi versiya olinadi, shuning uchun kecha tekshirilgan kod bugun boshqasi bilan almashgan bo'lishi mumkin."
  - q: "Lockfile'da paket uchun `integrity` maydoni bor. U aynan qaysi holatda himoya beradi?"
    options:
      - "Paket muallifi yomon niyatli bo'lsa va yangi versiyani o'zi e'lon qilsa"
      - "Paket kodida zaiflik bo'lsa"
      - "Bir xil versiya uchun keyin boshqa tarball kelsa (mirror, kesh yoki registry'da almashtirish)"
      - "Paket nomi typosquatting bo'lsa"
    answer: 2
    explain: "Integrity hash tarball tarkibini aniq versiyaga bog'laydi: tarkib o'zgarsa, hash mos kelmaydi. Muallif o'zi yangi versiya e'lon qilsa, lockfile'ni yangilagan odam yangi hash'ni qabul qiladi, hash buni tuzatmaydi. Zaiflik va nom o'xshashligi integrity'ga aloqasiz."
  - q: "Jamoa `npm install` o'rniga CI'da `npm ci` ishlatishga o'tdi. Bu nimani o'zgartiradi?"
    options:
      - "Bog'liqliklar lockfile'dagi versiyalar bo'yicha o'rnatiladi va lockfile bilan package.json mos kelmasa, o'rnatish xato bilan to'xtaydi"
      - "Install skriptlari avtomatik o'chadi"
      - "Paketlar imzo bilan tekshiriladi"
      - "Faqat production bog'liqliklari o'rnatiladi"
    answer: 0
    explain: "`npm ci` lockfile'ni haqiqat manbai deb oladi, uni jimgina yangilamaydi. Skriptlarni o'chirish `--ignore-scripts` ishi, imzo/provenance tekshiruvi esa alohida mexanizm (82-dars); production-only o'rnatish boshqa flag."
  - q: "Bog'liqlik `postinstall` skriptini o'z ichiga oladi. Nima uchun bu faqat paketni import qilishdan xavfliroq?"
    options:
      - "Skript faqat production'da ishlaydi"
      - "Skript o'rnatish vaqtida, ya'ni dasturchi noutbugi yoki CI runner'da ishlaydi va u yerdagi muhit o'zgaruvchilari hamda token'larga ega"
      - "Skript har doim root huquqi bilan ishlaydi"
      - "Skript lockfile'ni o'zgartiradi"
    answer: 1
    explain: "Install skripti kod import qilinmasa ham ishlaydi va jarayon egasining huquqlari bilan: dasturchi yoki CI'ning token'lari, SSH kalitlari shu yerda. Root huquqi har doim emas, production'ga cheklanmagan."
  - q: "Nom o'xshashligini aniqlovchi funksiya Levenshtein masofasi 1 bo'lgan nomlarni belgilaydi. `lodahs` ni `lodash` ga o'xshash deb topadimi?"
    options:
      - "Ha, chunki harflar bir xil"
      - "Ha, chunki uzunligi teng"
      - "Yo'q, chunki bu paket mavjud"
      - "Yo'q, ikki harf o'rni almashgan: Levenshtein bo'yicha masofa 2, shuning uchun filtr o'tkazib yuboradi"
    answer: 3
    explain: "Transpozitsiya oddiy Levenshtein'da ikki amal (o'chirish+qo'shish yoki ikki almashtirish). Shuning uchun bunday tekshiruv yagona himoya bo'lolmaydi: u ruxsat ro'yxati va review bilan birga ishlaydi."
  - q: "Lockfile'da paket bor, integrity mos, lekin yangi versiyaga o'tkazuvchi PR lockfile'ning 4000 qatorini o'zgartirgan. Review'da nimaga e'tibor berish kerak?"
    options:
      - "Faqat package.json o'zgarishiga: lockfile avtomatik yaratiladi"
      - "Lockfile'ni review qilish kerak emas, CI testlari yetarli"
      - "Faqat yuqori darajadagi bog'liqliklarning versiyasiga"
      - "Yangi qo'shilgan tranzitiv paketlar, o'zgargan resolved manzillar va install skripti bor paketlarga"
    answer: 3
    explain: "Hujum yangi tranzitiv paket yoki o'zgargan manba orqali kiradi va package.json'da ko'rinmaydi. Testlar yomon niyatli kodni ushlamaydi, chunki u odatda testlardan tashqarida ishlaydi."
task:
  title: "O'rnatish qarori: lockfile, integrity va install skripti"
  prompt: |
    `decide(name, lock, mirror, allowScripts)` paket o'rnatilsinmi yoki yo'qmi, shuni hal qiladi. Hozir u mirror'dagi eng yangi versiyani ko'r-ko'rona qabul qiladi.

    Tuzating, shunda:
    1. Paket lockfile'da bo'lmasa, `"lockfile'da yo'q"` qaytsin (jimgina resolve qilinmasin).
    2. Aynan lockfile'dagi versiya olinsin (eng yangisi emas).
    3. Tarball SHA-256 hash'i lockfile'dagi `integrity` bilan mos bo'lmasa, `"integrity mos emas"` qaytsin.
    4. Paketda `postinstall` bor va nom `allowScripts` ichida bo'lmasa, `"skript ruxsat etilmagan"` qaytsin.
    5. Hammasi mos bo'lsa `"ok"`.

    Kutilgan chiqish tartibi: ok, ok, integrity mos emas, skript ruxsat etilmagan, ok, lockfile'da yo'q.
  lang: ts
  starter: |
    type Pkg = { version: string; code: string; postinstall?: string };
    type Lock = Record<string, { version: string; integrity: string }>;

    async function sha(code: string): Promise<string> {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
      return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
    }

    // Paket o'rnatish qarori: "ok" yoki rad etish sababi.
    async function decide(name: string, lock: Lock, mirror: Record<string, Pkg[]>, allowScripts: Set<string>): Promise<string> {
      const versions = mirror[name] ?? [];
      const pkg = versions[versions.length - 1]; // eng yangisi
      if (!pkg) return "yo'q";
      return "ok";
    }

    const good: Pkg = { version: "1.0.0", code: "a()" };
    const lock: Lock = {
      fleet: { version: "1.0.0", integrity: await sha("a()") },
      native: { version: "2.0.0", integrity: await sha("n()") },
    };
    const mirror: Record<string, Pkg[]> = {
      fleet: [good, { version: "1.1.0", code: "a(); steal()" }],
      native: [{ version: "2.0.0", code: "n()", postinstall: "node dl.js" }],
      evil: [{ version: "9.9.9", code: "x()" }],
    };
    const tampered: Record<string, Pkg[]> = { fleet: [{ version: "1.0.0", code: "a(); steal()" }] };

    console.log("lock bo'yicha:", await decide("fleet", lock, { fleet: [good] }, new Set()));
    console.log("yangi versiya mavjud:", await decide("fleet", lock, mirror, new Set()));
    console.log("o'zgargan tarball:", await decide("fleet", lock, tampered, new Set()));
    console.log("skript:", await decide("native", lock, mirror, new Set()));
    console.log("skript ruxsat bilan:", await decide("native", lock, mirror, new Set(["native"])));
    console.log("lockfile'da yo'q:", await decide("evil", lock, mirror, new Set()));
  solution: |
    type Pkg = { version: string; code: string; postinstall?: string };
    type Lock = Record<string, { version: string; integrity: string }>;

    async function sha(code: string): Promise<string> {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
      return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
    }

    // Paket o'rnatish qarori: "ok" yoki rad etish sababi.
    async function decide(name: string, lock: Lock, mirror: Record<string, Pkg[]>, allowScripts: Set<string>): Promise<string> {
      const entry = lock[name];
      if (!entry) return "lockfile'da yo'q";
      const pkg = (mirror[name] ?? []).find((p) => p.version === entry.version);
      if (!pkg) return "yo'q";
      if ((await sha(pkg.code)) !== entry.integrity) return "integrity mos emas";
      if (pkg.postinstall && !allowScripts.has(name)) return "skript ruxsat etilmagan";
      return "ok";
    }

    const good: Pkg = { version: "1.0.0", code: "a()" };
    const lock: Lock = {
      fleet: { version: "1.0.0", integrity: await sha("a()") },
      native: { version: "2.0.0", integrity: await sha("n()") },
    };
    const mirror: Record<string, Pkg[]> = {
      fleet: [good, { version: "1.1.0", code: "a(); steal()" }],
      native: [{ version: "2.0.0", code: "n()", postinstall: "node dl.js" }],
      evil: [{ version: "9.9.9", code: "x()" }],
    };
    const tampered: Record<string, Pkg[]> = { fleet: [{ version: "1.0.0", code: "a(); steal()" }] };

    console.log("lock bo'yicha:", await decide("fleet", lock, { fleet: [good] }, new Set()));
    console.log("yangi versiya mavjud:", await decide("fleet", lock, mirror, new Set()));
    console.log("o'zgargan tarball:", await decide("fleet", lock, tampered, new Set()));
    console.log("skript:", await decide("native", lock, mirror, new Set()));
    console.log("skript ruxsat bilan:", await decide("native", lock, mirror, new Set(["native"])));
    console.log("lockfile'da yo'q:", await decide("evil", lock, mirror, new Set()));
  solutionNotes: |
    - Tartib muhim: avval lockfile yozuvi, keyin aynan o'sha versiya, keyin integrity, oxirida skript siyosati. Birinchi shart bajarilmasa, qolganlari ishlamaydi.
    - `find(version === entry.version)` eng yangisini emas, kelishilgan versiyani tanlaydi: bugun e'lon qilingan `1.1.0` o'rnatilmaydi.
    - Integrity tekshiruvi xavfsiz emas deb topilgan tarkibni ushlaydi, lekin lockfile yaratilgan paytda allaqachon zararli bo'lgan paketni ushlamaydi. Bu qoldiq risk: lockfile yangilanishini review qilish va 82-darsdagi provenance kerak.
    - Skript ruxsat ro'yxati nom bo'yicha. Real loyihada ruxsat ro'yxatiga versiya yoki hash ham qo'shiladi, aks holda ruxsat berilgan paketning yangi versiyasi ham o'tib ketadi.
    - Haqiqiy npm integrity'si SHA-512 va base64 (SRI formati); bu yerda SHA-256/hex mexanizmni soddalashtirish uchun.
  checklist:
    - "Lockfile'da bo'lmagan paket rad etiladi"
    - "Eng yangi versiya emas, lockfile'dagi versiya tanlanadi"
    - "O'zgargan tarball integrity bilan ushlanadi"
    - "Ruxsatsiz postinstall rad etiladi, ruxsat bilan o'tadi"
    - "Qoldiq risk (lockfile'ga allaqachon kirgan zararli paket) nima ekanini ayta olasiz"
---

## Muammo

Avtopark platformangizning `package.json` faylida 25 ta bog'liqlik bor deb faraz qiling. `node_modules` papkasini ochsangiz, yuzlab, ba'zan minglab paket chiqadi. Siz yozmagan, o'qimagan va hech qachon audit qilmagan kod sizning serveringiz bilan bir jarayonda, bir xil huquq bilan ishlaydi: `process.env`, ma'lumotlar bazasi ulanishi, fayl tizimi, tarmoq. Kutubxona sizning kodingiz emas, lekin sizning xavfsizlik chegarangiz ichida.

Bu muammo OWASP Top 10:2025 da alohida kategoriya bo'ldi: A03 Software Supply Chain Failures (kategoriya nomi va tartib raqami rasmiy sahifada). Kategoriya nomi "supply chain" bo'lgani uchun gap faqat ma'lum zaifliklar haqida emas, zanjirning har bir bo'g'ini haqida deb o'qiymiz: manba, registry, build, yetkazib berish (bu kursning talqini). Bu darsda zanjirning birinchi bo'g'ini, ya'ni npm bog'liqliklari bilan shug'ullanamiz; build va yetkazib berish keyingi darslarda (82 va 85-darslar).

Real hodisalar bu xavfni nazariyadan chiqargan. OWASP A03:2025 3-stsenariyda 2025 yildagi Shai-Hulud hujumini keltiradi va uni birinchi muvaffaqiyatli o'z-o'zidan tarqaladigan npm qurti deb ataydi. Tavsifga ko'ra hujumchilar mashhur paketlarning zararli versiyalarini joylagan; ular post-install skript orqali sezgir ma'lumotlarni yig'ib, ommaviy GitHub repozitoriylariga chiqargan; zararli kod muhitda npm token'larni topib, ular orqali ochiq bo'lgan boshqa paketlarning zararli versiyalarini avtomatik yuborgan; qurt npm tomonidan to'xtatilguncha 500 dan ortiq paket versiyasiga yetgan. OWASP bu hujum dasturchi mashinalarini nishonga olgani uchun dasturchilarning o'zi endi supply chain hujumlarining asosiy nishoni ekanini ta'kidlaydi. A03 shu stsenariyda CISA alertiga (2025-09-23) havola beradi; alertning o'z matnini biz bu yerda o'qimadik, shuning uchun faktlar OWASP tavsifidan olingan. Hodisaning batafsil tahlili 98-darsda.

Bu hodisada ikkala eshik ham ishlagan: post-install skript va token. Keyingi bo'limlar shu mexanizmlarni ajratadi.

Ikkita tipik og'riq bor. Birinchisi, "bugun ishladi, ertaga yangi versiya keldi": bir xil `package.json` va turli kunlarda turli kod. Ikkinchisi, "paketni o'rnatdim, hali import qilmadim": o'rnatish vaqtida ishlaydigan skriptlar. Ikkalasi ham ekotizimning qulayligi uchun yaratilgan xususiyatlar, lekin hujumchi uchun kirish eshigi.

## Asosiy g'oya

Bog'liqlik xavfini uch savolga bo'lish qulay.

1. Qaysi kod keladi? Siz ro'yxatda yozgan paket va uning barcha tranzitiv bog'liqliklari. To'g'ridan-to'g'ri 25 ta, tranzitiv bilan yuzlab. Hujum sirti (attack surface) ro'yxatni siz yozmaganingiz uchun ko'rinmaydi.
2. Qaysi versiya keladi? `package.json` dagi oraliq (`^1.2.0`) bitta versiyani emas, versiyalar to'plamini belgilaydi. Qaysi biri tanlanishi o'rnatilgan vaqtga bog'liq, agar lockfile bo'lmasa.
3. O'rnatish paytida nima ishlaydi? Paket `preinstall`, `install`, `postinstall` kabi skriptlar e'lon qilishi mumkin; ular o'rnatish jarayonida avtomatik bajariladi.

Himoya ham shu uch savolga javob: kodni qisqartirish va ro'yxatni bilish (bog'liqliklar soni, kimga ishonish), versiyani qotirish va tarkibini tekshirish (lockfile + integrity), o'rnatishda bajariladigan koddan voz kechish yoki uni cheklash (skript siyosati). Bularning birortasi "paket yomon emasligini" isbotlamaydi. Ular ikkita narsani beradi: kecha tekshirilgan narsa bugun jimgina almashmaydi, va almashganda buni sezasiz.

Muhim ajratish: bu yerda ikki xil hujum bor. Birinchisi, mavjud paket yoki uning muallifi hisobi buzilishi: yangi versiya yomon niyatli kod bilan e'lon qilinadi, sizning oraliq shu versiyani qamrab oladi. Ikkinchisi, nom orqali aldash: sizga kerak paketga o'xshash nom bilan boshqa paket e'lon qilinadi (typosquatting), dasturchi nomni xato yozib yuboradi. Birinchisini lockfile va review ushlaydi, ikkinchisini nomni tekshirish va ruxsat etilgan ro'yxat.

## Chuqurroq: semver, lockfile va install skriptlari

### Semver oralig'i hujumchi uchun kirish eshigi

npm versiyalari `major.minor.patch` shaklida. `^1.2.0` oralig'i major (1) bir xil, versiya 1.2.0 dan past emas versiyalarni qamrab oladi. `~1.2.0` esa faqat patch'ni ochiq qoldiradi. Semver kelishuvga asoslangan: patch va minor "orqaga mos" bo'lishi kerak deyiladi, lekin hech narsa muallifni bu kelishuvga majburlamaydi, va kelishuv yomon niyatli muallifni to'xtatmaydi. Hisobi buzilgan muallif `1.3.0` ni e'lon qilsa, `^1.2.0` oralig'i uni "qonuniy yangilanish" deb qabul qiladi.

Shuning uchun amaliy xulosa: oraliq o'zi xavfsizlik chegarasi emas. Xavfsizlik chegarasi bu qaysi aniq versiya va qaysi aniq tarkib o'rnatilgani, ya'ni lockfile.

### Lockfile va integrity

`package-lock.json` har paket uchun aniq versiya, yuklab olinadigan manzil (`resolved`) va `integrity` maydonini saqlaydi. Integrity tarball tarkibining hash'i (SRI formatida, hash algoritmi nomi va base64 qiymat). O'rnatish vaqtida tarball yuklangach, hash qayta hisoblanadi va mos kelmasa o'rnatish to'xtaydi. Bu ikkita narsani beradi: versiyani qotirish (bugungi `npm ci` kechagi bilan bir xil daraxt oladi) va tarkibni qotirish (mirror, korporativ kesh yoki tarmoq orasida tarball almashtirilsa, ushlanadi).

`npm ci` buyrug'i shu uchun mo'ljallangan. npm hujjatiga ko'ra u `npm install` ga o'xshaydi, lekin avtomatlashtirilgan muhit (test platformasi, CI, deploy) uchun: loyihada `package-lock.json` bo'lishi shart; lockfile bilan `package.json` mos kelmasa, `npm ci` lockfile'ni yangilamasdan xato bilan chiqadi; u `package.json` va `package-lock.json` ga hech qachon yozmaydi; mavjud `node_modules` oldin o'chiriladi. OWASP NPM Security Cheat Sheet ham aynan shu xavfni ko'rsatadi: lockfile'siz yoki mos kelmasa, `npm install` `package.json` ga qarab boshqa versiyalarni o'rnatishi mumkin, bu esa lockfile foydasini yo'qqa chiqaradi; yechim sifatida npm uchun `npm ci`, Yarn uchun `yarn install --frozen-lockfile` ko'rsatiladi.

Lockfile'dagi `integrity` maydoni npm hujjatida Standard Subresource Integrity satri (`sha512` yoki `sha1`) sifatida ta'riflanadi: ochilgan artefakt uchun hash.

Lockfile nimani bermaydi: u bugun lockfile'ga yozilgan paket yomon emasligini kafolatlamaydi. Agar yomon niyatli versiya lockfile yangilanayotgan paytda kirib qolsa, integrity uni "to'g'ri" deb saqlaydi. Shuning uchun lockfile o'zgarishi kod kabi review qilinadi.

### Install skriptlari

Paket `scripts` ichida `preinstall`, `install`, `postinstall` kabi hayot sikli skriptlarini e'lon qilishi mumkin va npm ularni o'rnatish jarayonida ishga tushiradi (npm scripts hujjati). `preinstall` bog'liqliklar yuklanishidan oldin ishlaydi; `npm ci` da u lockfile `package.json` bilan solishtirilgandan keyin ishlaydi, shuning uchun u versiyalarni hal qilishga ta'sir qila olmaydi: tarkib lockfile bilan qotirilgan bo'lib qoladi. Qolgan skriptlar modullar `node_modules` ga o'rnatilgandan keyin ishlaydi. Ko'p paket buni haqiqiy ehtiyoj uchun ishlatadi: native modulni kompilyatsiya qilish, binary yuklab olish. Muammo shundaki, bu skript sizning huquqingiz bilan ishlaydi: dasturchi noutbugida SSH kalitlari va bulut kirish ma'lumotlari, CI runner'da deploy token'lari. Paketni hali import qilmagan bo'lsangiz ham kod ishlab bo'lgan. Shai-Hulud tavsifidagi post-install skript aynan shu eshikdan kirgan.

Himoya variantlari: OWASP NPM Cheat Sheet `--ignore-scripts` bilan o'rnatishni (yoki `.npmrc` ga `ignore-scripts=true` yozishni) tavsiya qiladi, va skriptlari haqiqiy kerak bo'lgan paketlar uchun ruxsat ro'yxati (allowlist) vositasini (masalan, `@lavamoat/allow-scripts`) tilga oladi. Shu manbaning o'zi cheklovni ham aytadi: bu skriptlarni faqat kechiktiradi, chunki `npm run`, `npm start` va `npm test` baribir ishga tushadi va ilovaning o'zi zararli bo'lishi mumkin. Skriptlarni butunlay o'chirish ba'zi native paketlarni buzadi: bu trade-off, quyida "Qachon qo'llamaslik" bo'limida. Ikkinchi himoya qatlami: o'rnatish muhitini kam huquqli qilish (CI runner'da uzoq muddatli token'lar bo'lmasin, 85-dars).

### Nom orqali aldash: typosquatting

OWASP NPM Cheat Sheet typosquatting'ni shunday ta'riflaydi: hujumchi mashhur modullarga juda o'xshash nom bilan zararli modul e'lon qiladi va tez-tez uchraydigan yozuv xatolariga tayanadi. Asosiy nishon sifatida u hisob ma'lumotlarini ko'rsatadi, chunki har bir paket `process.env` orqali muhit o'zgaruvchilarini o'qiy oladi. Dasturchi `npm install expres` deb xato yozadi va kimdir shu nomli paket e'lon qilgan. Oddiy filtr "mashhur nomlarga juda yaqin, lekin o'zi mashhur emas" qoidasi bilan ishlaydi. Quyidagi kod Levenshtein masofasi bilan shu g'oyani ko'rsatadi, va chegarasini ham: ikki harf o'rni almashgan nom masofa 2 beradi va filtrdan o'tib ketadi.

```ts run
const popular = ["express", "fastify", "lodash", "react", "axios", "typescript"];

function distance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

function suspicious(name: string): string | null {
  if (popular.includes(name)) return null;
  const near = popular.find((p) => distance(name, p) === 1);
  return near ? `${name} -> ${near} ga o'xshash (masofa 1)` : null;
}

for (const n of ["express", "expres", "lodahs", "geo-utils", "reactt"]) console.log(n.padEnd(10), suspicious(n) ?? "ok");
```

```text
express    ok
expres     expres -> express ga o'xshash (masofa 1)
lodahs     ok
geo-utils  ok
reactt     reactt -> react ga o'xshash (masofa 1)
```

Ko'rinib turibdiki, bu filtr yagona himoya emas. Real nazorat boshqa tomondan keladi: yangi bog'liqlik qo'shish PR'da ko'rinadi va review qilinadi, kompaniya registry proksisi faqat tasdiqlangan paketlarni o'tkazadi, yangi paket uchun nom, muallif va e'lon qilingan sanasiga qarab tekshiruv bor.

### Dependency confusion va slopsquatting

Ikki yaqin hujum nomlarga tayanadi. Dependency confusion: hujumchi ommaviy npm registry'da sizning ichki paketingiz nomi bilan, lekin yuqoriroq versiya raqami bilan paket e'lon qiladi, va `npm install` ichki paket o'rniga ommaviy paketni hal qilishi mumkin. OWASP NPM Cheat Sheet ichki nomlar qanday sizishini sanaydi (tasodifan ommaviy GitHub'ga tushgan `package.json`, ish e'lonlari, xato xabarlari va stack trace'lar) va uchta chorani beradi: ichki paketlar uchun scoped nomlar (`@kompaniya/paket`), `.npmrc` da scope'ni shaxsiy registry'ga yo'naltirish, va ichki nomlarni ommaviy registry'da bo'sh paket bilan band qilish. ASVS 5.0.0 V15.2.4 (3-daraja) shu xavfni talab sifatida qo'yadi: uchinchi tomon komponentlari va ularning barcha tranzitiv bog'liqliklari kutilgan repozitoriydan kelishi va dependency confusion xavfi bo'lmasligi tekshiriladi.

Slopsquatting esa yangi variant: AI yordamchisi mavjud bo'lmagan, lekin ishonarli ko'rinadigan paket nomini taklif qiladi, hujumchi shu nomni oldindan e'lon qilib qo'yadi. Cheat sheet misol sifatida `node-fetch` o'rniga `node-fetch-promise` taklifini keltiradi. Himoya oddiy: AI taklif qilgan nomni ham, o'zingiz yozganni ham o'rnatishdan oldin registry'da tekshiring (muallif, e'lon sanasi, yuklab olishlar, manba repozitoriy).

## Misol: yangi versiya va almashtirilgan tarball

Quyidagi o'quv modeli registry, semver va lockfile'ning kerakli qismini sof funksiyalarda ko'rsatadi. Tarmoq yo'q; "yomon niyatli kod" shunchaki matn (`sendEnvToAttacker()`), hech narsa bajarmaydi.

### 1. Zaif kod

Lockfile yo'q: har o'rnatishda oraliqqa mos eng yangi versiya olinadi.

```ts run
type Ver = { version: string; code: string; scripts?: { postinstall?: string } };
const registry: Record<string, Ver[]> = {
  "geo-utils": [
    { version: "1.2.0", code: "distance(a,b)" },
    { version: "1.2.3", code: "distance(a,b)" },
    { version: "1.3.0", code: "distance(a,b); sendEnvToAttacker()" },
    { version: "2.0.0", code: "distance(a,b,unit)" },
  ],
};

const parse = (v: string) => v.split(".").map(Number);
function cmp(a: string, b: string): number {
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}
// "^1.2.0": major bir xil, versiya 1.2.0 dan past emas
const caret = (range: string, v: string) => {
  const base = range.slice(1);
  return parse(v)[0] === parse(base)[0] && cmp(v, base) >= 0;
};

// ZAIF: lockfile yo'q, har o'rnatishda "eng yangi mos versiya" tanlanadi
function installWeak(name: string, range: string): Ver {
  const ok = registry[name].filter((v) => caret(range, v.version));
  return ok.sort((a, b) => cmp(b.version, a.version))[0];
}

const picked = installWeak("geo-utils", "^1.2.0");
console.log("tanlangan versiya:", picked.version);
console.log("ishga tushadigan kod:", picked.code);
```

### 2. Hujum

Hujumchi paketning buzilgan hisobi orqali `1.3.0` ni e'lon qiladi. Siz hech narsa o'zgartirmadingiz: `package.json` oldingidek `^1.2.0`. Keyingi o'rnatishda:

```text
tanlangan versiya: 1.3.0
ishga tushadigan kod: distance(a,b); sendEnvToAttacker()
```

Yomon niyatli versiya "yangilanish" sifatida tanlandi. Tekshiruvdan o'tgan kod bilan o'rnatilgan kod bir xil emas, lekin hech qanday o'zgarish ko'rinmadi.

### 3. Tuzatilgan kod

Endi o'rnatish lockfile'ga qaraydi: aniq versiya va SHA-512 integrity. Bu model ikkita qo'shimcha qoida qo'shadi: lockfile'da yo'q paket rad etiladi, va `postinstall` skripti ruxsat ro'yxatida bo'lmasa rad etiladi. Ikkinchi hujum: mirror `1.2.3` nomi ostida o'zgartirilgan tarkib beradi.

```ts run
type Ver = { version: string; code: string; scripts?: { postinstall?: string } };
const registry: Record<string, Ver[]> = {
  "geo-utils": [
    { version: "1.2.3", code: "distance(a,b)" },
    { version: "1.3.0", code: "distance(a,b); sendEnvToAttacker()" },
  ],
  "native-helper": [{ version: "0.4.0", code: "helper()", scripts: { postinstall: "node fetch-binary.js" } }],
};

async function integrity(code: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(code));
  return "sha512-" + btoa(String.fromCharCode(...new Uint8Array(buf)));
}

type LockEntry = { version: string; integrity: string };
const lock: Record<string, LockEntry> = {
  "geo-utils": { version: "1.2.3", integrity: await integrity("distance(a,b)") },
  "native-helper": { version: "0.4.0", integrity: await integrity("helper()") },
};
const scriptAllowlist = new Set<string>([]);

async function installLocked(name: string, mirror = registry): Promise<string> {
  const entry = lock[name];
  if (!entry) return `${name}: lockfile'da yo'q, rad etildi`;
  const v = mirror[name]?.find((x) => x.version === entry.version);
  if (!v) return `${name}@${entry.version}: registry'da yo'q`;
  if ((await integrity(v.code)) !== entry.integrity) return `${name}@${entry.version}: integrity mos emas, rad etildi`;
  if (v.scripts?.postinstall && !scriptAllowlist.has(name)) return `${name}@${v.version}: postinstall skripti ruxsat ro'yxatida yo'q, rad etildi`;
  return `${name}@${v.version}: o'rnatildi`;
}

console.log(await installLocked("geo-utils"));
const tampered = { ...registry, "geo-utils": [{ version: "1.2.3", code: "distance(a,b); sendEnvToAttacker()" }] };
console.log(await installLocked("geo-utils", tampered));
console.log(await installLocked("native-helper"));
console.log(await installLocked("left-pad-evil"));
```

```text
geo-utils@1.2.3: o'rnatildi
geo-utils@1.2.3: integrity mos emas, rad etildi
native-helper@0.4.0: postinstall skripti ruxsat ro'yxatida yo'q, rad etildi
left-pad-evil: lockfile'da yo'q, rad etildi
```

Nima yopildi: kecha tekshirilgan versiya o'rniga yangisi jimgina tanlanmaydi; bir xil versiya uchun almashtirilgan tarkib integrity bilan ushlanadi; ruxsatsiz install skripti ishlamaydi; lockfile'da yo'q paket o'rnatilmaydi. Nima yopilmadi: lockfile yaratilgan paytda paketning o'zi allaqachon zararli bo'lsa, integrity buni saqlaydi va "to'g'ri" deb tekshiradi. Shuningdek ruxsat berilgan skript yomon niyatli bo'lib qolishi mumkin. Bu tuzatish faqat ko'rsatilgan ikki hujumni (yangi versiya, almashtirilgan tarkib) va ruxsatsiz skriptni yopadi.

## Qachon qo'llamaslik kerak

- `--ignore-scripts` ni ko'r-ko'rona hamma joyda yoqish. Native moduli bor paketlar (masalan, kompilyatsiya yoki binary yuklashga tayanganlar) ishlamay qoladi. To'g'ri yo'l: ruxsat ro'yxati va kerakli paketlar uchun alohida qadam. Ro'yxat texnik qarz bo'lib qolmasligi uchun kimdir uni yangilab turishi kerak.
- Hamma bog'liqlikni qo'lda qotirib, hech qachon yangilamaslik. Bu xavfni bog'liqlik zaifligiga ko'chiradi: eskirgan paketdagi ma'lum zaiflik tuzatilmaydi (A03 doirasiga bu ham kiradi). Qotirish yangilanishni to'xtatish uchun emas, yangilanishni boshqariladigan qilish uchun.
- Typosquatting filtrini yagona nazorat qilish. Yuqorida ko'rdik: oddiy masofa transpozitsiyani o'tkazib yuboradi, va aldovchi nom umuman o'xshash bo'lmasligi ham mumkin.
- Har bir tranzitiv paketni qo'lda audit qilishga urinish. Hajmi buni imkonsiz qiladi. Amaliy yo'l: bog'liqliklar sonini kamaytirish (3 qatorlik funksiya uchun paket qo'shmaslik), tanlangan muhim paketlarni chuqurroq ko'rish, qolganini avtomatik nazoratlarga ishonish.

## Stack'da: Node.js, NestJS, Next.js

- CI'da `npm ci` (yoki `pnpm install --frozen-lockfile`, `yarn install --immutable`): lockfile'ga mos kelmasa, xato. Bu o'zgarish hech narsa yangilamaydi, faqat jimgina farqni to'xtatadi.
- Lockfile'ni PR'da review qiling: yangi tranzitiv paketlar, `resolved` manzili npm registry'dan boshqa joyga o'zgargan qatorlar, install skripti qo'shilgan paketlar.
- A03 "how to prevent" ro'yxati ham shu yo'nalishda: butun dasturiy ta'minot SBOM'ini markaziy yaratish, faqat to'g'ridan-to'g'ri emas, tranzitiv bog'liqliklarni ham kuzatish, ishlatilmaydigan bog'liqliklarni olib tashlash, rasmiy (ishonchli) manbalardan xavfsiz kanal orqali olish, versiyani ongli tanlash va faqat kerak bo'lganda yangilash, hamda yangilanishni hamma tizimga bir vaqtda emas, bosqichma-bosqich (staged yoki canary) yoyish. ASVS V15.1.1 xavfli versiyalar uchun xavfga asoslangan tuzatish muddatlarini hujjatlashtirishni, V15.1.2 esa SBOM kabi inventar yuritishni talab qiladi.
- `npm audit` ma'lum zaifliklarni ko'rsatadi (A03 ning "komponentlarni yangilab turish" qismi). U yomon niyatli, hali e'lon qilinmagan paketni topmaydi: shuning uchun u lockfile intizomini almashtirmaydi.
- NestJS va Next.js loyihalarida dev-bog'liqliklar (linter, build plugin'lari) ham CI'da ishlaydi va token'larga yaqin; ularning kodiga ham xuddi shunday ishoniladi. "Faqat devDependency" xavfsizlik chegarasi emas.
- Registry proksisi (kompaniya ichki registry'si) yangi paket va versiyalarni darhol emas, kechikish bilan o'tkazsa, ommaviy hodisalarda bosqichma-bosqich chora ko'rishga vaqt beradi. Bu amaliyot narxi: yangi versiyalar kechroq keladi, va zaiflik tuzatishi ham.
- Muhim paketlar uchun provenance va SBOM (82-dars), CI sirlari (85-dars), konteynerga nima kirishi (86-dars) keyingi darslarda.

## Xulosa

- Tranzitiv bog'liqliklar sizning xavfsizlik chegarangiz ichidagi begona kod; OWASP Top 10:2025 da bu A03 Software Supply Chain Failures.
- Semver oralig'i xavfsizlik chegarasi emas: lockfile bo'lmasa, har o'rnatishda boshqa kod kelishi mumkin.
- Lockfile versiyani, integrity tarkibni qotiradi; CI'da `npm ci` shuni majburlaydi. Qoldiq risk: lockfile'ga allaqachon kirgan zararli paket.
- Install skriptlari kod import qilinmasa ham ishlaydi; ularni ruxsat ro'yxatiga olish yoki o'chirish trade-off.
- Typosquatting filtri yordamchi nazorat, yagona himoya emas; yangi bog'liqlik PR'da review qilinadi. Ichki paketlar uchun scoped nomlar dependency confusion'ni yopadi.
- Shai-Hulud tavsifi (OWASP A03) ikkala eshikni ko'rsatadi: post-install skript va CI/dasturchi muhitidagi token. CISA alertining o'z matni bu darsda o'qilmagan.
