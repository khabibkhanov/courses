---
n: 95
slug: compliance-xaritasi
title: "Compliance xaritasi: PCI DSS, ISO/IEC 27001, SOC 2"
summary: "Uch mashhur compliance ramkasi nima ekani, nimasi bilan farq qilishi, ular bilan texnik nazoratlar qanday bog'lanishi; 'bir nazorat, ko'p ramka' yondashuvi, compliance va xavfsizlikning farqi, dalil (evidence) ni kodga aylantirish va declared holat bilan haqiqiy holat orasidagi og'ishni topish."
duration: 40
sources:
  - id: pci-dss
    note: "PCI SSC PCI DSS sahifasi (2026-11-11 da o'qilgan): to'lov kartasi hisobi ma'lumotlarini himoya qilish uchun texnik va operatsion talablarning bazaviy to'plami; auditoriya: kartochka egasi ma'lumoti (CHD) va/yoki sezgir autentifikatsiya ma'lumotini (SAD) saqlaydigan, qayta ishlaydigan yoki uzatadigan yoki CDE xavfsizligiga ta'sir qila oladigan tashkilotlar; QSA baholovchilar va ASV tashqi skanerlash; muvofiqlik majburiyati to'lov brendlari va acquirer'lar qaroriga bog'liq ekani aytilgan; sahifada 'PCI DSS v4.x' deb belgilangan"
  - id: pci-dss-v401
    note: "PCI SSC blogi, 2024-yil 11-iyun: v4.0.1 'limited revision' (matn va format tuzatishlari, ayrim talablarni aniqlashtirish, yangi yoki o'chirilgan talab yo'q); v4.0 2024-yil 31-dekabrda nafaqaga chiqadi; future-dated talablar sanasi (2025-yil 31-mart) o'zgarmaydi"
  - id: pci-future-dated
    note: "PCI SSC blogi: v4.0 64 ta yangi talab qo'shgan, ularning 51 tasi future-dated bo'lib 2025-yil 31-martdan majburiy; v3.2.1 2024-yil 31-martda nafaqaga chiqqan; misollar: rol va mas'uliyatlarni hujjatlashtirish, yillik qamrovni tasdiqlash (12.5.2), SAQ A e-commerce savdogarlari uchun choraklik ASV skaneri (11.3.2)"
  - id: iso-27001-overview
    note: "ISO umumiy sahifasi (2026-11-11 da o'qilgan): ISO/IEC 27001 axborot xavfsizligi boshqaruv tizimlari (ISMS) uchun eng mashhur standart, ISO/IEC 27000 oilasida; har sohadagi va har kattalikdagi tashkilot uchun; qog'oz, cloud va raqamli ma'lumotni qamraydi; sertifikatlash ixtiyoriy; ISO o'zi sertifikatlamaydi; sahifada 2022 nashri ko'rsatilgan, nima o'zgargani yozilmagan. Standart matni pullik va o'qilmagan"
  - id: aicpa-soc
    note: "AICPA SOC sahifasi (2026-11-11): SOC - CPA'lar ko'rsatadigan xizmatlar to'plami (xizmat ko'rsatuvchi tashkilotdagi tizim darajasidagi yoki boshqa tashkilotlardagi entity darajasidagi nazoratlar); SOC 2 nashrining sarlavhasi 'Reporting on an Examination of Controls at a Service Organization Relevant to Security, Availability, Processing Integrity, Confidentiality, or Privacy'; 2027 uchun SOC 2 Trust Services Criteria va Description Criteria exposure draft'lari e'lon qilingani ko'rsatilgan"
  - id: aicpa-soc2-ed
    note: "AICPA yangiligi (2026-10-28): 2027 SOC 2 Trust Services Criteria yangilash taklifi: mezonlarni birlashtirish, ba'zilarini olib tashlash, aniqlik kerak joyda qo'shish, qayta yozish; sun'iy intellekt uchun points of focus (AI governance, model monitoring, prompt manipulation, data poisoning va h.k.); izoh muddati 2027-yil 15-yanvar; tasdiqlansa, 2027-yil 31-dekabrda yoki undan keyin boshlangan engagement'larga qo'llanadi, erta qo'llash mumkin"
  - id: pci-scoping-guidance
    note: "PCI SSC Scoping and Network Segmentation Guidance v1.1: qamrov CHD/SAD saqlanadigan, qayta ishlanadigan yoki uzatiladigan joyga bog'liq; tokenizatsiya kabi vositalar xavfni kamaytirishi mumkin, barcha talablarni yo'qotadigan yechim yo'q; uchinchi tomonga topshirishda tomonlar talablarni kelishadi; hosted/redirect/iframe to'lov sahifalari qo'llanmada yo'q"
  - id: asvs
    note: "ASVS 5.0.0 'Assessment and Certification' bo'limi: OWASP hech kimni sertifikatlamaydi; verifikatsiya hisoboti qamrov, tekshirilgan talablar, istisnolar va hal qilish yo'riqnomasini o'z ichiga olishi kerak; avtomatik asbobni ishga tushirish talabni tekshirish degani emas ('testable using automation != running an off-the-shelf tool')"
quiz:
  - q: "Mijoz sizdan 'SOC 2 hisobotingiz bormi' deb so'radi. Bu savol aslida nimani so'raydi?"
    options:
      - "Dasturingiz xatosiz ekanini"
      - "Kodingiz ochiq manbami"
      - "Sizda ISO sertifikati bor-yo'qligini"
      - "Mustaqil auditor xizmat ko'rsatuvchi tashkilotdagi nazoratlarni (xavfsizlik, mavjudlik, qayta ishlash yaxlitligi, maxfiylik, privacy mezonlari doirasida) tekshirib hisobot berganmi"
    answer: 3
    explain: "AICPA sahifasi SOC 2 ni xizmat ko'rsatuvchi tashkilotdagi nazoratlarni Security, Availability, Processing Integrity, Confidentiality yoki Privacy bo'yicha tekshirish sifatida tasvirlaydi. Bu mustaqil auditorning hisoboti; dasturning xatosizligi haqida emas."
  - q: "PCI DSS qaysi tashkilotlarga tegishli, PCI SSC sahifasiga ko'ra?"
    options:
      - "Faqat banklarga"
      - "Kartochka egasi ma'lumotini yoki sezgir autentifikatsiya ma'lumotini saqlaydigan, qayta ishlaydigan yoki uzatadigan yoki cardholder data environment xavfsizligiga ta'sir qila oladigan barcha tashkilotlarga"
      - "Faqat onlayn do'konlarga"
      - "Faqat Qo'shma Shtatlardagi kompaniyalarga"
    answer: 1
    explain: "Sahifa auditoriyani shunday belgilaydi va savdogarlar, qayta ishlovchilar, ekvayerlar, emitentlar va xizmat ko'rsatuvchilarni kiritadi. Platformangiz kartani qayta ishlamasa ham, CDE xavfsizligiga ta'sir qilsa, kirishi mumkin: shu sababli qamrovni (scope) kamaytirish muhim."
  - q: "Compliance hisobotida 'MFA hamma admin uchun yoqilgan: implemented' deb yozilgan, haqiqiy konfiguratsiyada 5 adminning 3 tasida MFA bor. Bu nimani ko'rsatadi?"
    options:
      - "Declared (e'lon qilingan) holat bilan haqiqiy holat orasidagi og'ish (drift); nazorat dalil bilan tasdiqlanmasa, hisobot ishonchsiz"
      - "Hamma narsa yaxshi: nazorat mavjud"
      - "MFA kerak emas"
      - "Auditor xato qilgan"
    answer: 0
    explain: "Qo'lda to'ldirilgan status haqiqiy holatni ko'rsatmaydi. Nazorat o'lchanadigan predikat va dalil bilan tekshirilishi kerak, aks holda hisobot o'zini aldaydi."
  - q: "Quyidagilardan qaysi biri 'compliance = xavfsizlik' degan xulosaning xatosini to'g'ri aytadi?"
    options:
      - "Compliance hech qachon xavfsizlikka foyda bermaydi"
      - "Compliance faqat qog'oz ish, texnik talab yo'q"
      - "Ramka minimal bazaviy talablar va dalil jarayonini beradi; u sizning o'ziga xos riskingizni (masalan, tenant izolyatsiyasi mantig'i yoki biznes logika nuqsonlari) to'liq qoplamaydi, shuning uchun muvofiqlik bo'lgan tizim ham buzilishi mumkin"
      - "Faqat sertifikatli tizimlar xavfsiz"
    answer: 2
    explain: "PCI DSS sahifasi o'zini 'baseline' (bazaviy) talablar deb ataydi. Baza yetarli bo'lishi shart emas. Foyda ham bor (strukturani beradi), lekin ramka sizning kodingizdagi har nuqsonni oldindan ko'rmaydi."
  - q: "'Bir nazorat, ko'p ramka' yondashuvi nimani anglatadi?"
    options:
      - "Har ramka uchun alohida nazorat yaratish"
      - "Bitta texnik nazoratni (masalan admin MFA) bir marta joriy qilib, uning dalilini bir nechta ramka talabiga xaritalash"
      - "Hamma ramkani bir sertifikatga birlashtirish"
      - "Nazoratlarni umuman yozmaslik"
    answer: 1
    explain: "Ramkalar qisman ustma-ust tushadi. Nazorat va dalilni bir marta qurib, uni har ramkaning tegishli talabiga bog'lash takroriy ishni kamaytiradi. Xaritalash to'g'riligini har ramka matni bilan tekshirish kerak."
  - q: "Istisno (exception) ro'yxatida 'eski kutubxonani yangilamaymiz' degan yozuv muddatsiz turibdi. Muammo nimada?"
    options:
      - "Muammo yo'q"
      - "Istisno faqat auditorga ko'rsatiladi"
      - "Istisnolar taqiqlangan"
      - "Muddatsiz istisno vaqtinchalik qarorni doimiy qiladi; istisnoning egasi, sababi, kompensatsiya nazorati va tugash sanasi bo'lishi va muddati o'tganda nazorat 'yiqilgan' hisoblanishi kerak"
    answer: 3
    explain: "Muddatsiz istisno sezdirmay riskni qabul qilishdir. Muddat, egasi va kompensatsiya nazorati bilan u boshqariladigan qarorga aylanadi."
  - q: "SOC 2 Trust Services Criteria 2027 uchun yangilanish loyihasi (exposure draft) e'lon qilingani nimani anglatadi?"
    options:
      - "Bu hali taklif: AICPA tasdiqlansa, u 2027-yil 31-dekabrda yoki undan keyin boshlangan engagement'larga qo'llanadi; amaldagi mezonlar o'zgarmagan, shuning uchun reja versiyani yozib qo'yishi va loyihani kuzatishi kerak"
      - "Mezonlar allaqachon o'zgargan va majburiy"
      - "SOC 2 bekor qilingan"
      - "Faqat Privacy toifasi qoladi"
    answer: 0
    explain: "Exposure draft taklif hujjati: AICPA yangiligiga ko'ra izoh muddati 2027-yil 15-yanvar, tasdiqlansa mezonlar 2027-yil 31-dekabrdan boshlangan engagement'larga qo'llanadi va erta qo'llash mumkin. Ramkalar o'zgarib turadi: muvofiqlik rejasi versiyani yozib qo'yishi kerak."
task:
  title: "Declared holat va haqiqiy holat: drift hisoboti"
  prompt: |
    `driftReport(controls, snapshot)` har nazorat uchun e'lon qilingan holat (`declared`) haqiqiy konfiguratsiya snapshot'iga mos kelishini tekshiradi. Hozirgi versiya `declared` ga ishonib, hech narsani tekshirmaydi.

    Har nazoratda `check(snapshot)` predikati bor. Natija: `declared === "implemented"` bo'lib `check` false qaytargan nazorat id'lari (alifbo tartibida, takrorsiz). Agar `check` xato tashlasa, nazorat ham yiqilgan hisoblanadi (tekshirib bo'lmagan nazorat o'tgan emas). `declared !== "implemented"` bo'lgan nazoratlar bu hisobotga kirmaydi. Imzoni o'zgartirmang. Oxirgi qatorlar kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    type Snapshot = { admins: { name: string; mfa: boolean }[]; logRetentionDays: number; tlsMin: string };
    type Control = { id: string; declared: "implemented" | "planned"; check: (s: Snapshot) => boolean };

    function driftReport(controls: Control[], snapshot: Snapshot): string[] {
      return controls.filter((c) => c.declared === "implemented" && !c.id).map((c) => c.id).sort();
    }

    const snapshot: Snapshot = {
      admins: [
        { name: "a1", mfa: true },
        { name: "a2", mfa: true },
        { name: "a3", mfa: false },
      ],
      logRetentionDays: 30,
      tlsMin: "1.2",
    };
    const controls: Control[] = [
      { id: "admin-mfa", declared: "implemented", check: (s) => s.admins.every((a) => a.mfa) },
      { id: "log-retention-90", declared: "implemented", check: (s) => s.logRetentionDays >= 90 },
      { id: "tls-1.2+", declared: "implemented", check: (s) => s.tlsMin === "1.2" || s.tlsMin === "1.3" },
      { id: "pentest-yearly", declared: "planned", check: () => false },
      { id: "broken-check", declared: "implemented", check: () => { throw new Error("snapshot yo'q"); } },
    ];
    console.log("og'ishlar:", driftReport(controls, snapshot));
    console.log("hammasi mos:", driftReport(controls.slice(2, 3), snapshot));
  solution: |
    type Snapshot = { admins: { name: string; mfa: boolean }[]; logRetentionDays: number; tlsMin: string };
    type Control = { id: string; declared: "implemented" | "planned"; check: (s: Snapshot) => boolean };

    function driftReport(controls: Control[], snapshot: Snapshot): string[] {
      const failed = new Set<string>();
      for (const c of controls) {
        if (c.declared !== "implemented") continue;
        let ok = false;
        try {
          ok = c.check(snapshot) === true;
        } catch {
          ok = false;
        }
        if (!ok) failed.add(c.id);
      }
      return [...failed].sort();
    }

    const snapshot: Snapshot = {
      admins: [
        { name: "a1", mfa: true },
        { name: "a2", mfa: true },
        { name: "a3", mfa: false },
      ],
      logRetentionDays: 30,
      tlsMin: "1.2",
    };
    const controls: Control[] = [
      { id: "admin-mfa", declared: "implemented", check: (s) => s.admins.every((a) => a.mfa) },
      { id: "log-retention-90", declared: "implemented", check: (s) => s.logRetentionDays >= 90 },
      { id: "tls-1.2+", declared: "implemented", check: (s) => s.tlsMin === "1.2" || s.tlsMin === "1.3" },
      { id: "pentest-yearly", declared: "planned", check: () => false },
      { id: "broken-check", declared: "implemented", check: () => { throw new Error("snapshot yo'q"); } },
    ];
    console.log("og'ishlar:", driftReport(controls, snapshot));
    console.log("hammasi mos:", driftReport(controls.slice(2, 3), snapshot));
  solutionNotes: |
    - Faqat `implemented` deb e'lon qilingan nazoratlar tekshiriladi; `planned` nazorat hali talab emas, shuning uchun og'ish hisoblanmaydi (lekin hisobotda alohida ko'rsatish mumkin).
    - `check` xato tashlasa nazorat yiqilgan deb hisoblanadi: tekshirib bo'lmagan nazorat o'tgan emas (fail-safe default, 3-dars).
    - `check(snapshot) === true` qat'iy solishtirish `truthy` qiymatlarni (masalan `"false"` satri) o'tgan deb hisoblamaydi.
    - Bu snapshot nazorat haqiqatan qo'llanilishini emas, faqat snapshot'dagi holatni tekshiradi; snapshot'ning o'zi to'liq va dolzarb bo'lishi kerak. Dalil to'plash (kim, qachon, qayerdan) va auditor namunalari alohida jarayon.
  checklist:
    - "`implemented` deb e'lon qilingan va tekshiruvdan o'tmagan nazoratlar topiladi"
    - "`planned` nazorat og'ish hisoblanmaydi"
    - "Xato tashlagan `check` yiqilgan hisoblanadi"
    - "Natija alifbo tartibida, takrorsiz"
    - "Snapshot nazoratning qo'llanishini isbotlamasligini ayta olasiz"
---

## Muammo

Mijoz, ayniqsa yirik tashkilot, sizdan "SOC 2 hisobotingiz bormi", "ISO 27001 sertifikatingiz bormi" yoki "to'lov kartasi ma'lumoti bilan ishlaysizmi, PCI DSS bo'yicha qanday holat" deb so'raydi. Jamoa odatda bu savollarni xavfsizlik savoli emas, sotuv to'sig'i deb qabul qiladi va javobni jadvalga yozib qo'yadi. Natija: hujjat va haqiqiy tizim bir-biridan uzoqlashadi. Bir yil oldin to'ldirilgan "MFA yoqilgan" qatori bugungi konfiguratsiyaga mos kelmasligi mumkin, va buni birinchi bo'lib auditor yoki, yomoni, hujumchi topadi.

Ikkinchi muammo: ramkalar ko'p va dasturchi qaysi biri nimani talab qilishini bilmaydi. Natijada har ramka uchun alohida ish bajariladi, bir xil nazorat uch marta hujjatlashtiriladi. Uchinchi muammo: compliance'ni xavfsizlikning o'zi deb hisoblash. Muvofiqlik kerakli, lekin yetarli emas.

Bu dars uch ramkaning o'zagini (nimani tasdiqlaydi, kimga tegishli, qaysi o'zgarishlar kutilmoqda) va dasturchi uchun amaliy usulni beradi: nazoratni o'lchanadigan predikat va dalil sifatida kodga aylantirish. Dars ramka matnini qayta bayon qilmaydi: ISO/IEC 27001 matni pullik, PCI DSS va SOC 2 mezonlari to'liq hujjat sifatida alohida yuklab olinadi, shuning uchun bu darsda faqat ochiq sahifalarda va ramka egalarining yangiliklarida yozilgan narsalar keltiriladi, talab matnlari emas.

## Asosiy g'oya

### PCI DSS: to'lov kartasi ma'lumoti

PCI Security Standards Council sahifasiga ko'ra PCI DSS to'lov kartasi hisobi ma'lumotlarini himoya qilish uchun mo'ljallangan texnik va operatsion talablarning bazaviy (baseline) to'plami. Standart kartochka egasi ma'lumoti (CHD) va/yoki sezgir autentifikatsiya ma'lumoti (SAD) ni saqlaydigan, qayta ishlaydigan yoki uzatadigan, yoki kartochka egasi ma'lumoti muhiti (CDE) xavfsizligiga ta'sir qila oladigan hamma tashkilotga tegishli: savdogarlar, qayta ishlovchilar, ekvayerlar, emitentlar va xizmat ko'rsatuvchilar. Sahifada ikki turdagi malakali ishtirokchi qayd etilgan: Qualified Security Assessor (QSA), PCI DSS baholashlarini o'tkazadigan mustaqil tashkilot, va Approved Scanning Vendor (ASV), tashqi zaiflik skanerlash xizmatini ko'rsatuvchi. Sahifa standartni "PCI DSS v4.x" deb belgilaydi. Sahifa yana bir muhim narsani aytadi: muvofiqlik majburiyati bormi-yo'qmi, to'lov brendlari va acquirer'lar kabi muvofiqlik dasturlarini yurituvchi tashkilotlar ixtiyorida. Ya'ni PCI DSS ning majburiyligi asosan to'lov brendlari va acquirer'lar dasturi orqali keladi.

PCI SSC blogidagi ma'lumotlarga ko'ra v3.2.1 2024-yil 31-martda nafaqaga chiqqan; v4.0.1 2024-yil 11-iyunda e'lon qilingan "limited revision" bo'lib, yangi yoki o'chirilgan talab qo'shmagan, faqat tuzatish va aniqlashtirishlar kiritgan; v4.0 2024-yil 31-dekabrda nafaqaga chiqqan. v4.0 64 ta yangi talab qo'shgan, ularning 51 tasi future-dated bo'lib, 2025-yil 31-martdan majburiy bo'lgan. Blogdagi misollar bu talablarning ko'pi jarayonga tegishli ekanini ko'rsatadi: rollar va mas'uliyatlarni hujjatlashtirish va yangilab turish, yillik qamrovni tasdiqlash, SAQ A toifasidagi e-commerce savdogarlari uchun ASV orqali choraklik skanerlash. Xulosa: ramka versiyasi muddati bor hujjat; reja "qaysi versiya va qaysi sanadagi talablar" deb yozilishi kerak.

Dasturchi uchun asosiy amaliy xulosa qamrov (scope): karta ma'lumoti qayerdan o'tsa, o'sha tizim talabga tushadi. PCI SSC qamrov va segmentatsiya qo'llanmasi qamrovni tizim CHD/SAD ni saqlaydimi, qayta ishlaydimi yoki uzatadimi, shunga bog'laydi, shuning uchun faqat saqlamaslik tizimni qamrovdan chiqarmaydi. Qo'llanma tokenizatsiya kabi vositalar xavfni kamaytirishi mumkinligini, lekin barcha talablarni olib tashlaydigan yechim yo'qligini aytadi; funksiya uchinchi tomonga topshirilsa, tomonlar qaysi talabni kim bajarishini kelishishi kerak. To'lov formasini hosted, redirect yoki iframe qilishning qamrovga ta'siri bu qo'llanmada yo'q, uni ekvayer yoki to'lov brendi bilan aniqlang.

### ISO/IEC 27001

ISO'ning umumiy sahifasi ISO/IEC 27001 ni axborot xavfsizligi boshqaruv tizimlari (ISMS) uchun eng mashhur standart deb ataydi; u ISO/IEC 27000 oilasiga kiradi va har sohadagi, har kattalikdagi tashkilot uchun mo'ljallangan. Sahifaga ko'ra standart moliyaviy axborot, intellektual mulk, xodimlar ma'lumoti va uchinchi tomon ishonib topshirgan axborot kabi aktivlar xavfsizligini boshqarishga yordam beradi va qog'oz, cloud hamda raqamli ma'lumotni qamraydi. Sertifikatlash ixtiyoriy: ba'zi tashkilotlar standartni faqat yaxshi amaliyot sifatida joriy qiladi, boshqalari mijozlarni ishontirish uchun sertifikat oladi. ISO o'zi sertifikatlamaydi. Sahifada 2022 nashri ko'rsatilgan, lekin u avvalgi nashrdan nima bilan farq qilishi yozilmagan.

Standartning o'zi pullik, shuning uchun bu dars uning talab matni, ilova (Annex A) tuzilmasi va sertifikatsiya jarayonining tafsilotlarini keltirmaydi. Umumiy tushuncha darajasida ISMS texnik nazoratlar ro'yxatidan ko'ra tashkilot darajasidagi boshqaruv tizimi ekanini bilish yetarli: risk baholash, siyosatlar, ichki audit va doimiy yaxshilash. Aniq talablarni ISO matnidan oling.

### SOC 2

AICPA sahifasida SOC 2 nashrining nomi shunday: "Reporting on an Examination of Controls at a Service Organization Relevant to Security, Availability, Processing Integrity, Confidentiality, or Privacy". Ya'ni SOC 2 xizmat ko'rsatuvchi tashkilotdagi nazoratlarni shu beshta mezon toifasi bo'yicha mustaqil auditor tomonidan tekshirilishini (examination) tasvirlaydi. Bu sertifikat emas, auditor hisoboti: u nazoratlar qanday ta'riflangani va auditor ularni qanday baholagani haqida. Sahifa SOC'ni umuman CPA'lar ko'rsatadigan xizmatlar to'plami deb tasvirlaydi: ular xizmat ko'rsatuvchi tashkilotdagi tizim darajasidagi yoki boshqa tashkilotlardagi entity darajasidagi nazoratlarga tegishli bo'lishi mumkin. Sahifada 2027 uchun "SOC 2 Trust Services Criteria va Description Criteria" exposure draft'lari e'lon qilingani ko'rinadi (sahifada sana 2026-yil 26-oktabr deb ko'rsatilgan).

AICPA yangiligi (2026-yil 28-oktabr) taklifni batafsilroq tasvirlaydi: mezonlar birlashtiriladi, ba'zilari olib tashlanadi, aniqlik kerak joyda yangilari qo'shiladi va har mezon maqsadi qisqa va izchil qayta yoziladi. Loyiha sun'iy intellekt uchun yangi points of focus ham qo'shadi: AI governance, model monitoring, prompt manipulation, data poisoning, AI chiqishlarining shaffofligi, training data boshqaruvi va avtomatlashtirilgan qaror qabul qilish xavflari. Izoh berish muddati 2027-yil 15-yanvar; 2027-yilda tasdiqlansa, mezonlar 2027-yil 31-dekabrda yoki undan keyin boshlangan engagement'larga qo'llanadi, erta qo'llash mumkin. Bu hali taklif, shuning uchun amaldagi mezonlar o'zgarmagan. Umumiy bilim sifatida (AICPA sahifalaridan tekshirilmagan): Type 1 hisobot nazoratlar dizaynini ma'lum sanada, Type 2 esa shu dizayn bilan birga uning ma'lum davr davomidagi ishlashini baholaydi; mijoz odatda Type 2 ni so'raydi. Rasmiy ta'rifni AICPA hujjatidan tekshiring.

## Chuqurroq: ramkalar bilan texnik nazoratlarni bog'lash

### Bir nazorat, ko'p ramka

Quyidagi jadval kursning ishchi xaritasi: u standartlarning talab raqamlariga emas, nazorat mavzulariga bog'langan va ramka matni bilan tekshirilishi kerak.

| Texnik nazorat | Kurs darsi | Qaysi ramkalarda odatda uchraydi |
|---|---|---|
| Adminlar uchun MFA | 44-45 | Uchalasida ham kirishni boshqarish mavzusida |
| Kirish va o'zgarishlar logi, saqlash muddati | 79, 93 | Uchalasida ham logging va monitoring mavzusida |
| Zaifliklarni boshqarish, yangilash | 81-90 | Uchalasida ham, PCI DSS'da tashqi skanerlash ASV orqali |
| Shifrlash (uzatishda va saqlashda) | 61-70 | Uchalasida ham kriptografiya mavzusida |
| Hodisaga javob rejasi | 93 | Uchalasida ham |
| Rolga asoslangan kirish va least privilege | 51-58 | Uchalasida ham |

Yondashuv: nazoratni bir marta joriy qiling, dalilini avtomatik yig'ing, so'ng har ramka talabiga bog'lang. "Bog'lash" ishi aniq talab matni bilan bajarilishi kerak, jadvaldagi "odatda uchraydi" iborasi xaritalash emas.

### Dalil kod sifatida

Auditor "bu nazorat ishlayaptimi" degan savolga dalil so'raydi: konfiguratsiya, ro'yxat, log, o'zgarish tarixi. Dalilni qo'lda yig'ish xato va kechikish beradi. Nazoratni predikat (`check`) sifatida yozib, uni snapshot'ga qarshi ishga tushirsangiz, har deploy yoki har kecha hisobot olinadi va declared holat bilan haqiqiy holat orasidagi og'ish (drift) ko'rinadi. Snapshot manbasi: IaC holati, cloud API'dan o'qilgan konfiguratsiya, identity provider ro'yxati, CI sozlamalari (85-dars).

### Istisnolar

Hamma nazorat hamma tizimda bajarilmaydi. Istisno bo'lishi mumkin, lekin u boshqariladigan bo'lishi kerak: egasi, sababi, kompensatsiya nazorati va tugash sanasi. Muddati o'tgan istisno avtomatik "yiqilgan" hisoblanadi.

### Compliance va xavfsizlik

Ramkalar bazaviy talablar va dalil jarayonini beradi. Sizning aniq riskingiz (masalan 55-darsdagi tenant izolyatsiyasi, 59-darsdagi biznes logika nuqsonlari) ramka ro'yxatida alohida band sifatida bo'lmasligi mumkin. Shu sababli muvofiqlik dasturi threat modeling (4-dars) va code review (91-dars) bilan to'ldirilishi kerak.

### Uch ramkaning tabiati

Uchala ramka bir-biridan qaysi savolga javob berishi bilan farq qiladi. PCI DSS aniq ma'lumot turini (karta hisobi ma'lumoti) himoya qilish talablari, uni baholovchilar (QSA) va tashqi skanerlovchilar (ASV) bor, majburiyat shartnoma zanjiri orqali keladi. ISO/IEC 27001 boshqaruv tizimi standarti: sertifikat tashkilotning ISMS ishlashini ko'rsatadi, lekin ISO sahifasiga ko'ra u ixtiyoriy. SOC 2 CPA hisoboti: u sertifikat emas, auditor yozgan xulosa, shuning uchun undagi tizim tavsifi, mezonlar va qamrov muhim. Shu sababli bitta jamoa uchun javoblar turlicha: to'lov sahifasini o'zingiz yozsangiz PCI DSS savol bo'ladi, korporativ mijoz ISO yoki SOC 2 so'raydi, katta korxonalar esa ko'pincha ikkalasini ham. Qaysi ramka kerakligini sotuv (mijoz talabi), shartnoma va qonun belgilaydi, dasturchi emas.

ASVS ham shu nuqtai nazardan foydali taqqoslash. ASVS 5.0.0 "Assessment and Certification" bo'limi OWASP hech kimni sertifikatlamasligini aytadi va ASVS asosidagi "sertifikat" da'volaridan ehtiyot bo'lishni tavsiya qiladi. Verifikatsiya hisoboti esa nima bo'lishi kerakligini aniq beradi: qamrov, tekshirilgan talablar xulosasi, istisnolar va ularni hal qilish yo'riqnomasi; chunki faqat xatolarni sanaydigan pentest hisoboti nima tekshirilganini aytmaydi. Bu talab har qanday compliance hisobotiga ham mos: "hammasi yaxshi" degan gap qamrovsiz ma'noga ega emas. ASVS yana bir nuqtani aytadi: avtomatlashtirish bilan tekshirish mumkin degani tayyor asbobni ishga tushirish degani emas. Murakkabroq talablar uchun ilovaga xos tekshiruvlar yoziladi, ular odatdagi unit va integratsiya testlariga o'xshaydi. Bizning `check` predikatlarimiz aynan shu g'oyaning compliance'dagi ko'rinishi.

## Misol: e'lon qilingan holat va haqiqiy holat

Misol faqat o'quv modelimiz: konfiguratsiya snapshot'i xotiradagi obyekt. Hech qaysi real tizimga ulanish yo'q.

### 1. Zaif kod

```ts run
type Snapshot = { admins: { name: string; mfa: boolean }[]; logRetentionDays: number; tlsMin: string };
const snapshot: Snapshot = {
  admins: [
    { name: "a1", mfa: true },
    { name: "a2", mfa: true },
    { name: "a3", mfa: false },
  ],
  logRetentionDays: 30,
  tlsMin: "1.0",
};

// ZAIF: nazoratlar qo'lda to'ldirilgan status, hech narsa tekshirilmaydi
const register = [
  { id: "admin-mfa", status: "implemented" },
  { id: "log-retention-90", status: "implemented" },
  { id: "tls-1.2+", status: "implemented" },
];
const done = register.filter((r) => r.status === "implemented").length;
console.log(`hisobot: ${done}/${register.length} nazorat joriy qilingan`);

// Auditor namunasi: haqiqiy konfiguratsiyadan 3 ta savol
console.log("MFA yo'q adminlar:", snapshot.admins.filter((a) => !a.mfa).map((a) => a.name).join(","));
console.log("log saqlash (kun):", snapshot.logRetentionDays, "(siyosat: 90)");
console.log("TLS minimal versiya:", snapshot.tlsMin);
```

### 2. Hujum

Bu yerda tahdid ikki yuzli. Birinchisi auditor yoki mijoz namunasi: u hisobotdagi "3/3" ni konfiguratsiya bilan solishtiradi va og'ishni topadi, bu ishonch va shartnoma yo'qotishiga olib keladi. Ikkinchisi haqiqiy hujumchi: MFA'siz admin akkaunti (`a3`) va eski TLS versiyasi aynan eng zaif bo'g'in. Natija:

```text
hisobot: 3/3 nazorat joriy qilingan
MFA yo'q adminlar: a3
log saqlash (kun): 30 (siyosat: 90)
TLS minimal versiya: 1.0
```

Uchala nazorat "implemented" deb e'lon qilingan, haqiqatda esa uchalasi ham bajarilmayapti. Hujjat tizimni emas, tizim haqidagi umidni ifodalagan.

### 3. Tuzatilgan kod

```ts run
type Snapshot = { admins: { name: string; mfa: boolean }[]; logRetentionDays: number; tlsMin: string };
const snapshot: Snapshot = {
  admins: [
    { name: "a1", mfa: true },
    { name: "a2", mfa: true },
    { name: "a3", mfa: false },
  ],
  logRetentionDays: 30,
  tlsMin: "1.0",
};

type Control = {
  id: string;
  check: (s: Snapshot) => boolean;
  evidence: (s: Snapshot) => string;
  exception?: { owner: string; until: string; compensating: string };
};
const controls: Control[] = [
  {
    id: "admin-mfa",
    check: (s) => s.admins.every((a) => a.mfa),
    evidence: (s) => `adminlar: ${s.admins.length}, MFA yo'q: ${s.admins.filter((a) => !a.mfa).map((a) => a.name).join(",") || "yo'q"}`,
  },
  {
    id: "log-retention-90",
    check: (s) => s.logRetentionDays >= 90,
    evidence: (s) => `saqlash: ${s.logRetentionDays} kun`,
    exception: { owner: "ops", until: "2026-10-01", compensating: "kunlik zaxira nusxa" }, // muddati o'tgan
  },
  {
    id: "tls-1.2+",
    check: (s) => s.tlsMin === "1.2" || s.tlsMin === "1.3",
    evidence: (s) => `TLS min: ${s.tlsMin}`,
  },
];

function report(today: string): string[] {
  return controls.map((c) => {
    let ok = false;
    try { ok = c.check(snapshot) === true; } catch { ok = false; }
    const ex = c.exception;
    const exActive = !ok && ex !== undefined && ex.until >= today;
    const status = ok ? "PASS" : exActive ? "ISTISNO" : ex ? "ISTISNO MUDDATI O'TGAN" : "FAIL";
    return `${status.padEnd(22)} ${c.id.padEnd(17)} ${c.evidence(snapshot)}`;
  });
}
report("2026-11-11").forEach((l) => console.log(l));
```

```text
FAIL                   admin-mfa         adminlar: 3, MFA yo'q: a3
ISTISNO MUDDATI O'TGAN log-retention-90  saqlash: 30 kun
FAIL                   tls-1.2+          TLS min: 1.0
```

Tuzatish nima uchun yetarli: har nazorat o'lchanadigan predikat va dalilga ega, hisobot declared holatga emas, snapshot'ga tayanadi, istisno egasi va muddati bilan yuritiladi va muddati o'tganda "yiqilgan" deb ko'rsatiladi. Yopilmagan narsa: snapshot haqiqiy muhitni to'liq aks ettirishi kerak (qaysi hisoblar, qaysi servislar); predikat nazoratning qo'llanishini emas, uning konfiguratsiyasini tekshiradi; auditor va ramka talabi bilan bog'lash va dalilni o'zgartirib bo'lmaydigan joyda saqlash bu kodda yo'q; sana taqqoslash ISO satr shaklida ishlaydi (`YYYY-MM-DD`).

### Mashq: drift hisoboti

Quyidagi funksiya declared holatga ishonadi va hech narsani tekshirmaydi. Uni to'g'rilang: e'lon qilingan va haqiqatda bajarilmaydigan nazoratlarni toping; xato bergan tekshiruv ham yiqilgan hisoblansin.

```ts run
type Snapshot = { mfaAdmins: number; totalAdmins: number };
type Control = { id: string; declared: "implemented" | "planned"; check: (s: Snapshot) => boolean };

function driftReport(controls: Control[], snapshot: Snapshot): string[] {
  return controls.filter((c) => c.declared === "implemented" && !c.id).map((c) => c.id).sort();
}
```

```ts test
const snap = { mfaAdmins: 2, totalAdmins: 3 };
const mk = (id: string, declared: "implemented" | "planned", check: (s: typeof snap) => boolean) => ({ id, declared, check });
check("o'tgan nazorat ro'yxatga kirmaydi", () => driftReport([mk("a", "implemented", () => true)], snap).length === 0);
check("yiqilgan implemented nazorat topiladi", () => driftReport([mk("mfa", "implemented", (s) => s.mfaAdmins === s.totalAdmins)], snap).join() === "mfa");
check("planned nazorat og'ish emas", () => driftReport([mk("p", "planned", () => false)], snap).length === 0);
check("xato tashlagan tekshiruv yiqilgan", () => driftReport([mk("e", "implemented", () => { throw new Error("x"); })], snap).join() === "e");
check("natija alifbo tartibida", () => driftReport([mk("z", "implemented", () => false), mk("b", "implemented", () => false)], snap).join() === "b,z");
check("truthy qiymat o'tgan hisoblanmaydi", () => driftReport([mk("t", "implemented", () => ("false" as unknown as boolean))], snap).join() === "t");
```

## Qachon qo'llamaslik kerak

Hamma ramkani birdaniga joriy qilishga urinmang. Mijozlaringiz nimani talab qilayotgani (sotuv signali), qonuniy majburiyat (to'lov kartasi bilan ishlasangiz PCI DSS), va resurs asosida bittadan boshlang. Erta bosqichdagi jamoa uchun ASVS (8-dars) Level 1 va threat model yetarli bo'lishi, rasmiy audit esa keyinroq kerak bo'lishi mumkin.

Compliance uchun nazorat yozish (faqat auditor ko'rishi uchun) xavfsizlikka xizmat qilmaydi va tezda eskiradi. Har nazoratdan oldin savol: u qaysi hujumni yoki riskni kamaytiradi? Javob topilmasa, nazorat formal bo'lishi mumkin, uni talab qilgan ramka bandini aniqlang va undagi talab haqiqatan shunday ekanini tekshiring.

Dalilni avtomatik yig'ish ham tuzoq: predikat snapshot'dagi bitta maydonga qaraydi, haqiqiy nazorat esa boshqa joyda buzilgan bo'lishi mumkin (masalan, MFA yoqilgan, lekin recovery yo'li uni chetlab o'tadi, 50-dars). Avtomatik tekshiruv yetarli signal, to'liq isbot emas.

Va nihoyat, bu dars audit yoki sertifikatsiyaga tayyorgarlik qo'llanmasi emas: baholash qamrovi, auditor tanlovi va hisobot turi kabi qarorlar ramka egalarining rasmiy hujjatlari va malakali maslahatchi bilan hal etiladi.

## Stack'da: IaC, CI va snapshot

Nazorat predikatlarini ishlatish uchun snapshot manbalari: Terraform state yoki plan, cloud provayder konfiguratsiyasi, Kubernetes manifestlari (87-dars), Postgres rol ro'yxati (89-dars), CI workflow sozlamalari (85-dars). Predikatlar oddiy TypeScript testlari sifatida CI'da ishlaydi va natija artefakt sifatida saqlanadi (kim, qachon, qaysi commit). NestJS ilovasida compliance bilan bog'liq nazorat, masalan, audit log yozilishi, e2e testi bilan tekshiriladi (92-dars). Quyidagi parcha predikatlarni CI testi sifatida yozish shaklini ko'rsatadi (ishga tushirilmaydi: jest kutubxonasi va tashqi snapshot yuklash brauzer worker'ida yo'q; sintaksis tekshirilgan):

```ts
declare function loadSnapshot(): Promise<{ admins: { mfa: boolean }[]; logRetentionDays: number }>;

describe("compliance controls", () => {
  it("admin-mfa: hamma adminda MFA", async () => {
    const s = await loadSnapshot();
    expect(s.admins.every((a) => a.mfa)).toBe(true);
  });
  it("log-retention-90", async () => {
    const s = await loadSnapshot();
    expect(s.logRetentionDays).toBeGreaterThanOrEqual(90);
  });
});
```

## Xulosa

- PCI DSS to'lov kartasi ma'lumoti bilan ishlaydigan yoki uning muhitiga ta'sir qila oladigan tashkilotlar uchun bazaviy talablar (hozirgi nashr v4.0.1); majburiyat to'lov brendlari va acquirer'lar orqali keladi; asosiy dasturchi qarori qamrovni kamaytirish.
- SOC 2 mustaqil auditorning Security, Availability, Processing Integrity, Confidentiality va Privacy bo'yicha nazoratlar hisoboti; 2027 mezonlari loyiha bosqichida (izoh muddati 2027-yil 15-yanvar).
- ISO/IEC 27001 ISMS standarti, sertifikatlash ixtiyoriy; standart matni pullik, shuning uchun bu dars uning talablarini sanamaydi; talablar ISO matnidan olinadi.
- Nazoratni bir marta joriy qilib, dalilini avtomatik yig'ing va ramka talablariga aniq matn bilan bog'lang ("bir nazorat, ko'p ramka").
- Declared holat bilan haqiqiy holat orasidagi og'ishni predikat va snapshot bilan toping; istisnolarga egasi, kompensatsiya va muddat bering.
- Compliance xavfsizlikning o'zi emas: o'z riskingiz uchun threat model va kod review bilan to'ldiring.
