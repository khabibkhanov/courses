---
n: 82
slug: lockfile-provenance-sbom
title: "Lockfile, provenance, SBOM va SLSA"
summary: "Artefakt qayerdan va qanday yig'ilgani isbotlanadigan bo'lishi: provenance attestation, SBOM bilan 'qaysi servisda bu komponent bor' savoliga javob, SLSA tilidagi build kafolatlari va ularning chegaralari."
duration: 45
sources:
  - id: slsa
    note: "SLSA v1.1 (slsa.dev/spec/v1.1/levels): Build track L0-L3 (L1 provenance mavjud, L2 hosted platforma va imzolangan provenance, L3 mustahkamlangan build) va har darajaning himoya doirasi; v1.1 da L4 yo'q. Provenance terminologiyasi korpusdagi SLSA matniga mos"
  - id: npm-provenance
    note: "npm provenance mavzusi; aniq buyruq matni korpusda yo'q. Verified: npm audit signatures provenance attestation'larni ham tekshiradi (npm-audit hujjati) va trusted publishing provenance'ni avtomatik yaratadi (OWASP NPM cheat sheet)"
  - id: t10-a03
    note: "A03:2025: SBOM'ni markaziy yaratish, artefakt yaxlitligi provenance, imzo va timestamp orqali, artefaktni har muhit uchun qayta yig'masdan promote qilish"
  - id: cs-sbom
    note: "OWASP Dependency Graph SBOM Cheat Sheet: SBOM tarkibi, har release uchun yaratish, SBOM va artefakt digest'ini imzolangan attestation bilan bog'lash, inventardan zaiflikka javobda foydalanish"
  - id: asvs
    note: "ASVS 5.0.0 V15.1.2: uchinchi tomon kutubxonalari inventari (masalan SBOM) yuritiladi va komponentlar oldindan belgilangan ishonchli repozitoriylardan keladi"
quiz:
  - q: "Artefakt uchun provenance attestation: digest, builder, repo va commit imzolangan. Deploy faqat imzoni tekshiradi, boshqa siyosat yo'q. Hujumchi o'z fork'ida CI orqali artefakt yig'ib, shu CI'ning haqiqiy imzosini oldi. Deploy nima qiladi?"
    options:
      - "Rad etadi, chunki imzo noto'g'ri"
      - "Qabul qiladi, chunki imzo haqiqiy; repo va builder siyosati bo'lmagani uchun imzo bu holatni ajratmaydi"
      - "Rad etadi, chunki fork'da CI ishlamaydi"
      - "Faqat commit raqami bo'yicha rad etadi"
    answer: 1
    explain: "Imzo 'bu attestation CI'dan kelgan' deydi, 'to'g'ri repodan' demaydi. Siyosat (kutilgan repo, builder) tekshirilmasa, haqiqiy imzo ham yomon manbani o'tkazadi."
  - q: "Attestation'ning `subjectDigest` maydonini deploy tekshirmadi (faqat imzo bor). Hujumchi nima qila oladi?"
    options:
      - "Hech narsa: imzo artefaktni himoya qiladi"
      - "Faqat commit raqamini o'zgartira oladi"
      - "O'zining boshqa artefaktiga boshqa build'ning haqiqiy attestation'ini biriktirishi mumkin"
      - "Imzoni soxtalashtirishi shart"
    answer: 2
    explain: "Attestation artefaktga digest orqali bog'lanadi. Digest tekshirilmasa, haqiqiy attestation boshqa baytlarga ham 'yopishadi' va imzo hech narsani isbotlamaydi."
  - q: "SBOM va lockfile o'rtasidagi farq qaysi gapda to'g'ri?"
    options:
      - "SBOM paketning zararli emasligini kafolatlaydi, lockfile esa yo'q"
      - "SBOM yig'ilgan artefaktdagi komponentlar ro'yxati (nima kirgan), lockfile esa o'rnatish uchun kirish: ikkalasi bir-birini to'ldiradi, lekin SBOM ham zararsizlikni kafolatlamaydi"
      - "Lockfile faqat production uchun, SBOM faqat dev uchun"
      - "SBOM lockfile'ni almashtiradi"
    answer: 1
    explain: "SBOM inventar: nima kirganini bilish. Zaiflik e'lon bo'lganda 'qaysi servisda bor?' savoliga javob beradi. Zararsizlik haqida hech narsa demaydi."
  - q: "Yangi zaiflik e'lon qilindi: geo-utils@1.3.0. Servislarning SBOM'lari komponentlarni faqat to'g'ridan-to'g'ri bog'liqliklar bilan cheklaydi. Qanday xavf bor?"
    options:
      - "Xavf yo'q: tranzitiv paketlar ishlatilmaydi"
      - "SBOM kattalashadi, xolos"
      - "Tranzitiv bog'liqlik orqali kirgan komponentli servislar ro'yxatdan tushib qoladi"
      - "Zaiflik avtomatik tuzatiladi"
    answer: 2
    explain: "Ko'p hodisalar tranzitiv paketlar orqali keladi. To'liq inventarsiz 'qaysi servis ta'sirlangan' savoli noto'liq javob oladi va tuzatish qoldirib ketiladi."
  - q: "Nima uchun provenance'ni 'artefakt xavfsiz' deb o'qish xato?"
    options:
      - "Provenance faqat artefakt qayerdan va qanday yig'ilganini aytadi; manba kodining o'zi zararli bo'lsa, u 'to'g'ri' yig'ilgan zararli artefakt beradi"
      - "Provenance hech qachon imzolanmaydi"
      - "Provenance faqat Docker uchun"
      - "Provenance faqat ochiq kodli loyihalar uchun"
    answer: 0
    explain: "Provenance yetkazib berish zanjirining halqasini isbotlaydi (kim, qaerda, qaysi manbadan). Manbaning o'zi yomon bo'lsa yoki build qoidasi noto'g'ri bo'lsa, u buni ko'rsatmaydi."
  - q: "SLSA kabi darajali tizim bilan ishlaganda eng to'g'ri yondashuv qaysi?"
    options:
      - "Eng yuqori darajani birdaniga talab qilish"
      - "Darajani jamoa tushunmagan holda ham e'lon qilish"
      - "Darajalarni e'tiborsiz qoldirish"
      - "Hozirgi holatni aniqlash, bir daraja yuqorisi uchun aniq nazoratni (masalan, imzolangan provenance) kiritish va siyosatni deploy'da tekshirish"
    answer: 3
    explain: "Daraja maqsad emas, yo'l xaritasi: har qadam aniq tekshiriladigan nazorat bilan. Deploy'da tekshirilmagan provenance esa bezak."
task:
  title: "SBOM'dan zaiflik ta'siri: tranzitiv bog'liqlik yo'li"
  prompt: |
    Uchta servisning lockfile ma'lumoti bor. `geo-utils@1.3.0` da zaiflik e'lon qilindi. `findAffected(name, version)` qaysi servis ta'sirlangan va qanday yo'l bilan ekanini qaytarishi kerak.

    Hozir u faqat to'g'ridan-to'g'ri bog'liqliklarni ko'radi, shuning uchun `tracker` servisi (u `tracker-core` orqali olgan) tushib qolgan.

    Tuzating: har servisning `direct` ro'yxatidan boshlab `requires` zanjirini kezing, topilsa yozuvni `"servis: a > b > c"` shaklida qo'shing (har servis uchun birinchi topilgan yo'l). Versiya mos kelmasa, hisoblanmasin. Aylanma bog'liqlik (cycle) cheksiz tsiklga olib kelmasin. Natija servis nomi bo'yicha tartiblangan bo'lsin. Kutilgan chiqish: `reports: geo-utils` va `tracker: tracker-core > geo-utils`.
  lang: ts
  starter: |
    type Pkg = { version: string; requires?: string[] };
    type Service = { direct: string[]; lock: Record<string, Pkg> };

    const services: Record<string, Service> = {
      gateway: { direct: ["fastify", "geo-utils"], lock: { fastify: { version: "4.0.0", requires: ["light-json"] }, "light-json": { version: "1.0.0" }, "geo-utils": { version: "1.2.3" } } },
      tracker: { direct: ["tracker-core"], lock: { "tracker-core": { version: "2.0.0", requires: ["geo-utils"] }, "geo-utils": { version: "1.3.0" } } },
      reports: { direct: ["geo-utils"], lock: { "geo-utils": { version: "1.3.0" } } },
    };

    // Zaif versiya ro'yxatidan "qaysi servis ta'sirlangan?" degan savolga javob beradi.
    function findAffected(name: string, version: string): string[] {
      const out: string[] = [];
      for (const [svc, s] of Object.entries(services)) {
        for (const d of s.direct) {
          if (d === name && s.lock[d]?.version === version) out.push(`${svc}: ${d}`);
        }
      }
      return out.sort();
    }

    for (const line of findAffected("geo-utils", "1.3.0")) console.log(line);
  solution: |
    type Pkg = { version: string; requires?: string[] };
    type Service = { direct: string[]; lock: Record<string, Pkg> };

    const services: Record<string, Service> = {
      gateway: { direct: ["fastify", "geo-utils"], lock: { fastify: { version: "4.0.0", requires: ["light-json"] }, "light-json": { version: "1.0.0" }, "geo-utils": { version: "1.2.3" } } },
      tracker: { direct: ["tracker-core"], lock: { "tracker-core": { version: "2.0.0", requires: ["geo-utils"] }, "geo-utils": { version: "1.3.0" } } },
      reports: { direct: ["geo-utils"], lock: { "geo-utils": { version: "1.3.0" } } },
    };

    // Qaysi servis ta'sirlangan va qaysi yo'l bilan? Tranzitiv bog'liqlikni ham toping.
    function findAffected(name: string, version: string): string[] {
      const out: string[] = [];
      for (const [svc, s] of Object.entries(services)) {
        const walk = (pkg: string, path: string[], seen: Set<string>): string[] | null => {
          if (seen.has(pkg)) return null;
          const entry = s.lock[pkg];
          if (!entry) return null;
          const here = [...path, pkg];
          if (pkg === name && entry.version === version) return here;
          for (const r of entry.requires ?? []) {
            const found = walk(r, here, new Set([...seen, pkg]));
            if (found) return found;
          }
          return null;
        };
        for (const d of s.direct) {
          const p = walk(d, [], new Set());
          if (p) { out.push(`${svc}: ${p.join(" > ")}`); break; }
        }
      }
      return out.sort();
    }

    for (const line of findAffected("geo-utils", "1.3.0")) console.log(line);
  solutionNotes: |
    - To'g'ridan-to'g'ri ro'yxat yetarli emas: `tracker` zaif paketni tranzitiv oladi. Inventarda to'liq daraxt bo'lmasa, javob noto'liq.
    - `seen` to'plami aylanma bog'liqlikda cheksiz rekursiyaning oldini oladi.
    - Versiya tekshiruvi (`entry.version === version`) `gateway` ni chiqarib tashlaydi: u `geo-utils@1.2.3` ishlatadi. Ro'yxat nomga emas, nom va versiyaga qaraydi.
    - Bu faqat lockfile ma'lumotiga tayanadi. Artefaktga kirgan lekin lockfile'da ko'rinmaydigan komponentlar (masalan, konteyner ichidagi OS paketlari, bundle qilingan kod) shu usulda topilmaydi: shuning uchun real SBOM build artefaktidan olinadi.
    - Yo'l ko'rsatish tuzatishni tezlashtiradi: qaysi bevosita paketni yangilash kerakligi ko'rinadi.
  checklist:
    - "Tranzitiv bog'liqlik orqali kirgan servis topiladi"
    - "Boshqa versiyadagi servis ro'yxatga kirmaydi"
    - "Aylanma bog'liqlik dasturni qotirmaydi"
    - "Natija servis nomi bo'yicha tartiblangan"
    - "Lockfile asosidagi inventar nimani ko'rmasligini ayta olasiz"
---

## Muammo

Lockfile (81-dars) "bugun nima o'rnatiladi" savoliga javob beradi. Lekin production'da boshqa savollar paydo bo'ladi. Serverda ishlayotgan artefakt qayerdan keldi: kimning noutbugidan yoki CI'dan? U aynan shu repozitoriy va shu commit'dan yig'ilganmi? Va yangi zaiflik e'lon qilinganda, 40 ta servisdan qaysi birida u bor?

Ko'p jamoada bu savollarga javob "bilmaymiz, ammo ehtimol shundaydir" bo'ladi. Artefakt registry'ga biror kishi tomonidan yuklangan, deploy esa faqat nom va versiyaga qaraydi. Agar kimdir (hujumchi yoki shoshilgan dasturchi) artefaktni o'z noutbugida yig'ib yuklasa, deploy farqni ko'rmaydi. Zaiflik e'lon qilinganda esa jamoa `grep` bilan repozitoriylarni kezib chiqadi va tranzitiv paketlarni qo'ldan chiqarib yuboradi.

OWASP Top 10:2025 ning A03 Software Supply Chain Failures kategoriyasi aynan shu yaxlit tasvirni talab qiladi: gap faqat bog'liqlik ro'yxatida emas, zanjirning har bir bo'g'inini tekshirishda. Bu darsda uch vositani ko'ramiz: provenance (artefaktning kelib chiqishi), SBOM (tarkib inventari) va SLSA (shu kafolatlarni darajalarga ajratuvchi framework).

Bu darsda SLSA v1.1 ga tayanamiz: unda faqat Build track bor, darajalari L0 dan L3 gacha. Keyingi versiya (v1.2) Source track qo'shgan; ushbu dars uni qamramaydi.

## Asosiy g'oya

### Provenance: artefaktning kelib chiqish hujjati

Provenance bu artefakt haqidagi imzolangan tasdiq (attestation): u qaysi baytlar (digest), qaysi tizim yig'gan (builder), qaysi manbadan (repozitoriy va commit). Digest artefaktni attestation'ga bog'laydi, imzo esa attestation'ning o'zgarmaganini isbotlaydi. Deploy tomonida tekshiruv to'rt qadamdan iborat:

1. Attestation bormi?
2. Imzo to'g'rimi (kutilgan CI kaliti bilan)?
3. `subjectDigest` hozir deploy qilinayotgan baytlarning hash'iga tengmi?
4. Builder va repo siyosatdagi kutilganga mosmi?

Uchinchi qadamsiz haqiqiy attestation boshqa baytlarga ham "yopishadi". To'rtinchisiz hujumchining o'z fork'idagi CI ham haqiqiy imzo beradi. Ikkalasi ham quyida kodda ko'rinadi.

### SBOM: nima kirgani inventari

SBOM (Software Bill of Materials) artefakt tarkibidagi komponentlar ro'yxati: nomi, versiyasi, ko'pincha paket manzili (purl) va hash'lari. Uni zaiflik e'lon qilingan kunda "qaysi servislarda geo-utils@1.3.0 bor?" degan savolga bir daqiqada javob olish uchun saqlaysiz. Ma'lum SBOM formatlari mavjud (CycloneDX va SPDX); bu kursda format emas, nima uchun kerakligi muhim, shuning uchun formatlarning tafsilotlari bu darsda keltirilmaydi.

SBOM ikkita narsani bermaydi. Birinchi, u komponent xavfsiz ekanini aytmaydi: faqat nima borligini aytadi. Ikkinchi, sifati uni qaerdan olganingizga bog'liq: lockfile'dan olingan SBOM konteynerga qo'shilgan OS paketlarini ko'rmaydi, bundle qilingan kodni ham. Build natijasi artefaktdan olingan SBOM to'liqroq.

### SLSA: darajalar tilidagi kafolatlar

SLSA (Supply-chain Levels for Software Artifacts) o'zini supply chain xavfsizligini bosqichma-bosqich yaxshilash uchun spetsifikatsiya deb ta'riflaydi; u o'sib boruvchi kafolatlarni darajalar bilan tasvirlaydi. SLSA'da provenance deganda artefaktni murakkab zanjir orqali manbagacha kuzatish mumkin bo'lgan tekshiriladigan ma'lumot tushuniladi: u qayerda, qachon va qanday ishlab chiqarilganini tasvirlaydi. Build provenance build natijasini uni hosil qilgan manba kodga bog'laydi.

SLSA v1.1 Build track jadvali:

| Daraja | Talab | Nimaga qarshi |
|---|---|---|
| Build L0 | yo'q | yo'q |
| Build L1 | build platformasi avtomatik hosil qilgan provenance mavjud | release xatolari (masalan, upstream'da yo'q commit'dan yig'ish) |
| Build L2 | hosted build platformasi hosil qilgan imzolangan provenance | build'dan keyingi o'zgartirish |
| Build L3 | mustahkamlangan build platformasi | build davomidagi o'zgartirish |

Spetsifikatsiya L1 haqida ochiq yozadi: u xatolarning oldini olishga yordam beradi, lekin chetlab o'tish yoki soxtalashtirish oson va buzishdan himoya qilmaydi. L2 da provenance'ni soxtalashtirish yoki tekshiruvdan qochish uchun aniq hujum kerak; shu sababli u oddiy hujumchilarni to'xtatadi. L3 da esa provenance'ni soxtalashtirish ko'pchilik hujumchilar qodir bo'lmagan, platformadagi zaiflikdan foydalanishni talab qiladi. L3 ning ikkita muhim talabi: build'lar bir-biriga ta'sir qilmasligi (hatto bitta loyiha ichida), va provenance'ni imzolash uchun ishlatiladigan maxfiy material foydalanuvchi build qadamlariga ochiq bo'lmasligi. Iste'molchi tomonida L2 dan boshlab provenance'ning haqiqiyligini tekshirish talab qilinadi: yig'ib qo'yilgan, lekin tekshirilmagan provenance daraja bermaydi.

## Chuqurroq: SBOM bilan ta'sirni baholash va chegaralar

### Tarkibni indekslash

Quyidagi model bir nechta servis lockfile'laridan SBOM'ga o'xshash inventar hosil qiladi va teskari indeks quradi: komponent nimadan iborat, qaysi servislarda. Bu zaiflik kunida kerak bo'ladigan so'rovning o'zi.

```ts run
type Lock = Record<string, { version: string }>;
const locks: Record<string, Lock> = {
  gateway: { fastify: { version: "4.0.0" }, "light-json": { version: "1.0.0" }, "geo-utils": { version: "1.2.3" } },
  tracker: { "tracker-core": { version: "2.0.0" }, "geo-utils": { version: "1.3.0" } },
  reports: { "geo-utils": { version: "1.3.0" } },
};

// Lockfile'dan SBOM'ga o'xshash ro'yxat: har komponent uchun purl-ga o'xshash identifikator
const sbom = Object.entries(locks).map(([service, lock]) => ({
  service,
  components: Object.entries(lock).map(([n, p]) => `pkg:npm/${n}@${p.version}`).sort(),
}));

// Teskari indeks: komponent -> servislar
const index = new Map<string, string[]>();
for (const s of sbom) for (const c of s.components) index.set(c, [...(index.get(c) ?? []), s.service]);

console.log("jami komponent yozuvlari:", sbom.reduce((n, s) => n + s.components.length, 0));
console.log("noyob komponentlar:", index.size);
console.log("pkg:npm/geo-utils@1.3.0 ->", index.get("pkg:npm/geo-utils@1.3.0")?.join(", "));
console.log("pkg:npm/geo-utils@9.9.9 ->", index.get("pkg:npm/geo-utils@9.9.9")?.join(", ") ?? "hech qaysi servisda yo'q");
```

```text
jami komponent yozuvlari: 6
noyob komponentlar: 5
pkg:npm/geo-utils@1.3.0 -> tracker, reports
pkg:npm/geo-utils@9.9.9 -> hech qaysi servisda yo'q
```

Bu so'rov "bir xil paket bir nechta versiyada" holatini ham ushlaydi: `gateway` `1.2.3` da, qolganlari `1.3.0` da. Zaiflik faqat `1.3.0` ga tegishli bo'lsa, `gateway` ta'sirlanmagan. Lekin bu faqat lockfile ma'lumotiga tayanadi (yuqoridagi cheklov).

### Provenance nimani isbotlamaydi

Provenance zanjirning bitta halqasini isbotlaydi: baytlar aynan shu builder'dan, shu manbadan keldi. U manbaning o'zi yaxshi ekanini aytmaydi. Agar ishonchli repozitoriyga yomon commit kirsa, CI uni xotirjam yig'adi va haqiqiy imzo bilan jo'natadi. Shuning uchun provenance code review, branch protection va CI xavfsizligi (85-dars) bilan birga ishlaydi, ularning o'rnini bosmaydi.

Ikkinchi chegara: siyosat kim tomonidan yozilgani. Agar deploy "har qanday haqiqiy imzo" ni qabul qilsa, imzo kaliti ishonch ildiziga aylanadi. Kalit ro'yxatini, kutilgan repo va builder'ni qat'iy belgilash kerak.

### npm tizimida provenance

npm CLI hujjati `npm audit signatures` buyrug'i registry imzolarini tekshirishini va yuklab olingan paketlarning provenance attestation'larini ham tekshirishini aytadi; shuningdek attestation formati vaqt o'tishi bilan o'zgarishi mumkinligi uchun eng yangi npm CLI ishlatish kerakligini eslatadi (bu ko'pincha Node.js bilan birga kelgan npm'dan yangiroq versiyani anglatadi). OWASP NPM Cheat Sheet paketni e'lon qilish uchun uzoq muddatli token o'rniga OIDC asosidagi trusted publishing'ni tavsiya qiladi: har e'lon qisqa muddatli, workflow'ga xos credential bilan bo'ladi, va trusted publishing orqali e'lon qilinganda npm provenance attestation'ni avtomatik hosil qiladi. Bu 81-darsdagi Shai-Hulud tavsifiga to'g'ridan-to'g'ri javob: u token'larni topib, ular orqali yangi versiyalar yuborgan.

### SBOM: nima yozilishi kerak va nimani aytmaydi

OWASP Dependency Graph SBOM Cheat Sheet SBOM'da quyidagilarni yozishni tavsiya qiladi: komponent nomi, versiyasi, yetkazib beruvchi, paket identifikatori va hash; to'g'ridan-to'g'ri va tranzitiv bog'liqlik munosabatlari; SBOM muallifi, yaratilgan vaqt va generator versiyasi. Shu manba muhim ogohlantirishni beradi: SBOM'da komponentning yo'qligi uning dasturda yo'qligini isbotlamaydi, shuning uchun to'liq bo'lmagan qamrovni ochiq qayd etish kerak. Har release uchun SBOM bog'liqliklar hal qilingandan keyin avtomatik yaratiladi va yakuniy paket yoki konteyner image bilan solishtiriladi, chunki faqat manifestlar yetkazilgan tarkibni noto'g'ri ko'rsatishi mumkin (bundle qilingan kutubxonalar va OS paketlari qo'shiladi).

SBOM va artefaktni bog'lash: manba ularni alohida imzolash bu munosabatni isbotlamasligini, buning o'rniga artefaktning kriptografik digest'iga bog'langan imzolangan attestation kerakligini yozadi. SBOM attestation inventarni tasvirlaydi, build provenance esa artefakt qanday yaratilganini alohida qayd etadi. Release evidence'ni o'rnatishdan oldin tekshirish uchun u SLSA provenance verification'ni namuna sifatida ko'rsatadi: imzo, ruxsat etilgan imzolovchi identifikatorlari, artefakt digest'i va kutilgan attestation turi; build provenance uchun yana kutilgan builder, manba repozitoriy, build turi va parametrlar. Quyidagi misoldagi to'rt qadam shu tekshiruvning soddalashtirilgan ko'rinishi.

Zaiflikka javob: manba release SBOM'larini deploy qilingan tizimlarga moslashtirishni va yangi advisory kelganda komponentlarni qayta baholashni tavsiya qiladi, ustuvorlikni exploitability, exposure va impact bo'yicha qo'yishni (bog'liqlik chuqurligi o'zi xavfni belgilamaydi), va grafdan qaysi ota-bog'liqlik zaif komponentni olib kelganini aniqlashni. Qayta yig'ilgandan keyin yangi SBOM oldingisi bilan solishtiriladi; yangilangan inventarning o'zi zaiflik tuzatilganini isbotlamaydi. OWASP A03 ham SBOM'ni markaziy yaratishni va faqat to'g'ridan-to'g'ri emas, tranzitiv bog'liqliklarni ham kuzatishni "how to prevent" ro'yxatiga kiritadi; artefaktlar uchun provenance, imzo va timestamp orqali yaxlitlik, hamda har muhit uchun qayta yig'ish o'rniga artefaktni promote qilish va build'lar o'zgarmas bo'lishini tavsiya etadi. ASVS V15.1.2 SBOM kabi inventarni va komponentlar oldindan belgilangan ishonchli repozitoriylardan kelishini talab qiladi (2-daraja).

### Uch vositani qachon qaysi savol uchun ishlatish

Amalda bu uch vosita bir-birini almashtirmaydi, ular turli odamlarning turli savollariga javob beradi. Dasturchi "bu versiya kecha tekshirilgan versiyaning o'zimi?" deb so'raydi: javobni lockfile va integrity beradi. Deploy tizimi "bu artefakt bizning CI'dan, bizning repodan keldimi?" deb so'raydi: javobni provenance beradi. Xavfsizlik jamoasi zaiflik e'lon qilingan kuni "qaysi servislarga tegadi?" deb so'raydi: javobni SBOM beradi. Auditor esa "buni qanday isbotlaysiz?" deb so'raydi, va uning uchun uchala hujjat ham saqlanadigan, versiyaga bog'langan bo'lishi kerak.

Shu sababli amalga oshirishni tartib bilan boshlash maqsadga muvofiq. Birinchi qadam lockfile intizomi (81-dars): bu deyarli bepul. Ikkinchi qadam SBOM yaratish va saqlash: kam mehnat, tezkor foyda. Uchinchi qadam provenance va deploy'dagi siyosat tekshiruvi: bu eng ko'p muhandislik talab qiladi, chunki build, imzo va deploy bir-biriga bog'lanadi. Tartibni teskari qilsangiz (avval provenance, lockfile'siz), kuchli imzo ostida yumshoq poydevor qoladi.

## Misol: noutbukda yig'ilgan artefakt

Model tarmoq va real imzo infratuzilmasiz ishlaydi. Imzo uchun HMAC ishlatamiz (o'quv soddalashtirishi: real tizimlar asimmetrik imzo va sertifikat ishlatadi, shuning uchun CI kaliti deploy'ga tarqatilmaydi). "Yomon niyatli kod" shunchaki matn.

### 1. Zaif kod

Deploy artefaktni faqat nomi bo'yicha qabul qiladi.

```ts run
type Artifact = { name: string; version: string; bytes: string };

// ZAIF: artefakt faqat nomi va versiyasi bo'yicha qabul qilinadi
function deployWeak(a: Artifact): string {
  return a.name === "tracker-api" ? `${a.name}@${a.version} deploy qilindi` : "rad etildi";
}

// HUJUM: artefakt CI'da emas, hujumchining noutbugida yig'ilgan
const fromLaptop: Artifact = { name: "tracker-api", version: "3.1.0", bytes: "dist + backdoor()" };
console.log(deployWeak(fromLaptop));
```

### 2. Hujum

Hujumchi (yoki shoshilgan dasturchi) artefaktni o'z noutbugida yig'adi va registry'ga yuklaydi. Deploy farqni ko'rmaydi:

```text
tracker-api@3.1.0 deploy qilindi
```

### 3. Tuzatilgan kod

Deploy attestation talab qiladi va to'rtta qadamni tekshiradi (mavjudlik, imzo, digest, siyosat). Beshta holat sinab ko'riladi: haqiqiy artefakt, attestation'siz artefakt, boshqa artefaktning haqiqiy attestation'i, hujumchi fork'ining haqiqiy imzoli attestation'i va o'zgartirilgan attestation.

```ts run
type Artifact = { name: string; version: string; bytes: string };
type Attestation = { subjectDigest: string; builder: string; repo: string; commit: string; sig: string };

const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join("");
const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));

// O'quv soddalashtirishi: CI imzo kaliti HMAC. Real tizimda asimmetrik imzo va sertifikat (Sigstore kabi) ishlatiladi.
const ciKey = await crypto.subtle.importKey("raw", enc.encode("ci-demo-key"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
const body = (a: Omit<Attestation, "sig">) => JSON.stringify([a.subjectDigest, a.builder, a.repo, a.commit]);
const sign = async (a: Omit<Attestation, "sig">): Promise<Attestation> => ({ ...a, sig: hex(await crypto.subtle.sign("HMAC", ciKey, enc.encode(body(a)))) });

const policy = { builder: "ci.example/pipeline", repo: "alfa/tracker-api" };

async function deploy(a: Artifact, att?: Attestation): Promise<string> {
  if (!att) return "rad etildi: attestation yo'q";
  const again = await sign({ subjectDigest: att.subjectDigest, builder: att.builder, repo: att.repo, commit: att.commit });
  if (again.sig !== att.sig) return "rad etildi: imzo noto'g'ri";
  if (att.subjectDigest !== (await sha256(a.bytes))) return "rad etildi: digest artefaktga mos emas";
  if (att.builder !== policy.builder) return "rad etildi: ruxsat etilmagan builder";
  if (att.repo !== policy.repo) return "rad etildi: boshqa repozitoriydan yig'ilgan";
  return `${a.name}@${a.version} deploy qilindi (commit ${att.commit})`;
}

const good: Artifact = { name: "tracker-api", version: "3.1.0", bytes: "dist" };
const goodAtt = await sign({ subjectDigest: await sha256(good.bytes), builder: policy.builder, repo: policy.repo, commit: "a1b2c3d" });
const evil: Artifact = { name: "tracker-api", version: "3.1.0", bytes: "dist + backdoor()" };
const forkAtt = await sign({ subjectDigest: await sha256(evil.bytes), builder: policy.builder, repo: "evil/fork", commit: "ffff000" });

console.log("1)", await deploy(good, goodAtt));
console.log("2)", await deploy(evil));
console.log("3)", await deploy(evil, goodAtt));
console.log("4)", await deploy(evil, forkAtt));
console.log("5)", await deploy(good, { ...goodAtt, commit: "deadbee" }));
```

```text
1) tracker-api@3.1.0 deploy qilindi (commit a1b2c3d)
2) rad etildi: attestation yo'q
3) rad etildi: digest artefaktga mos emas
4) rad etildi: boshqa repozitoriydan yig'ilgan
5) rad etildi: imzo noto'g'ri
```

Nima yopildi: attestation'siz artefakt, boshqa baytlarga ko'chirilgan attestation, o'zgartirilgan attestation va boshqa repozitoriyda yig'ilgan artefakt. Nima yopilmadi: ishonchli repoga kirgan yomon commit; builder'ning o'zi buzilishi (build tizimiga kirgan hujumchi haqiqiy imzo oladi); va bu modelda imzo kaliti deploy tomonida ham bor, real tizimda esa tekshiruv ochiq kalit bilan bo'ladi. "Tuzatish yetarli" degan gap faqat ko'rsatilgan beshta holat uchun to'g'ri.

## Qachon qo'llamaslik kerak

- Kichik jamoa va bitta servis uchun to'liq SLSA yo'l xaritasini boshlash. Avval `npm ci`, branch protection va CI sirlarini tartibga keltiring (81 va 85-darslar). Provenance bunday asos ustiga quriladi.
- Provenance'ni yig'ish, lekin deploy'da tekshirmaslik. Tekshirilmagan hujjat xavfsizlik bermaydi va xavfsizlik hissini beradi.
- SBOM'ni bir marta yaratib, hech kim ishlatmaydigan joyga saqlab qo'yish. SBOM faqat so'rov qilinsa foydali: zaiflik tushganda qidiriladigan, yangi artefakt bilan yangilanadigan inventar bo'lsa.
- Ichki, qisqa muddatli prototiplarda har artefaktga attestation talab qilish: jarayon narxi xavfdan oshib ketishi mumkin. Qaysi servislar uchun bu qimmat va qaysilari uchun zarur ekanini 90-darsdagi risk yondashuvi bilan hal qiling.

## Stack'da: GitHub Actions, npm, Docker

- Paketni e'lon qilsangiz: OIDC asosidagi trusted publishing va u hosil qiladigan provenance (yuqorida). Iste'molchi tomonida `npm audit signatures` CI qadami sifatida. OWASP cheat sheet qaysi CI provayderlar qo'llab-quvvatlanishini npm trusted publishing hujjatidan tekshirishni aytadi.
- CI tomonida artefaktni yig'ish va imzolash bitta, ruxsati cheklangan pipeline'da bo'lishi kerak (85-dars); deploy esa shu pipeline'dan kelmagan artefaktni qabul qilmasligi kerak.
- Docker image'lar uchun SBOM image darajasida olinadi (86-dars), chunki OS paketlari lockfile'da ko'rinmaydi.
- Zaiflik oqimi (90-dars): SBOM → "qaysi servis" → KEV/EPSS bilan ustuvorlik → tuzatish.
- Saqlash: SBOM va attestation'larni artefakt versiyasi bilan birga saqlang, aks holda 3 oy oldingi release haqida savol javobsiz qoladi.

## Xulosa

- Lockfile "nima o'rnatiladi"ni, provenance "artefakt qayerdan kelgani"ni, SBOM "ichida nima borligi"ni aytadi: uchalasi bir-biridan farq qiladi.
- Provenance'ni deploy tekshirmasa, u hech narsani himoya qilmaydi. To'rt qadam: mavjudlik, imzo, digest, siyosat (builder va repo).
- Haqiqiy imzo "to'g'ri manba" degani emas: siyosat alohida tekshiriladi.
- SBOM zaiflik kunida tezlik beradi, lekin to'liqligi qaerdan olinganiga bog'liq va zararsizlikni kafolatlamaydi.
- SLSA darajalari yo'l xaritasi: L1 xatolar uchun, L2 build'dan keyingi o'zgartirish uchun (imzolangan provenance, hosted platforma), L3 build davomidagi o'zgartirish uchun (SLSA v1.1 Build track).
