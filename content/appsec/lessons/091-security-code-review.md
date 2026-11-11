---
n: 91
slug: security-code-review
title: "Security code review metodikasi"
summary: "Xavfsizlik nuqtai nazaridan kod ko'rib chiqish tartibi: entry point'dan sink'gacha ma'lumot oqimini kuzatish, har endpoint uchun besh savol, ASVS va CWE Top 25 dan checklist yasash, grep va SAST nimani topolmasligi."
duration: 45
sources:
  - id: asvs
    note: "ASVS 5.0.0: v5.0.0 tegidagi 5.0/en papkasida V1 (Encoding and Sanitization) dan V17 (WebRTC) gacha bo'limlar; 'What is the ASVS' faylida L1 qariyb 20%, L2 qariyb 50% talab ekani yozilgan"
  - id: wstg
    note: "WSTG repozitoriyasi tarkibi: 'Testing Framework' bo'limida Code-Level Review and Analysis alohida faoliyat sifatida sanalgan; 4-bo'lim toifalari (Authentication, Authorization, Injection, Business Logic va h.k.)"
  - id: cs-code-review
    note: "Secure Code Review Cheat Sheet: baseline va diff-based review turlari, tayyorgarlik va jarayon bosqichlari, data flow tahlili (source, processing, sink, trust boundary), qo'lda ko'rishning afzalligi bo'lgan sohalar, topilma hisoboti shabloni"
  - id: cwe-top25
    note: "2025 CWE Top 25 jadvali: 1-o'rinda CWE-79, 2-o'rinda CWE-89, 4-o'rinda CWE-862, 24-o'rinda CWE-639; har qatorda KEV'dagi CVE soni ham berilgan"
quiz:
  - q: "Reviewer yangi endpoint'ni ko'rmoqda. Quyidagilardan qaysi biri security review'ning boshlang'ich nuqtasi bo'lishi kerak?"
    options:
      - "Eng uzun funksiyadan boshlab, yuqoridan pastga qarab hamma qatorni o'qish"
      - "Mijoz nazorat qiladigan kirish nuqtalarini (parametr, header, body) topib, ular qayerga borishini kuzatish"
      - "Import qilingan kutubxonalar ro'yxatini ko'rib, eng ko'p ishlatilganini tanlash"
      - "Test fayllarini o'qib, ular nimani tekshirishini aniqlash"
    answer: 1
    explain: "Xavfsizlik nuqsonlarining katta qismi mijoz boshqaradigan qiymat tekshirilmay sink'ga yetganda paydo bo'ladi, shuning uchun source'dan sink'ga qarab kuzatish eng unumli tartib. Tartibsiz o'qish ko'p vaqt oladi, kutubxonalar ro'yxati bu yerda yetarli emas, testlar esa odatda zaif holatlarni yopmaydi."
  - q: "Kod: `db.query(\"SELECT * FROM trips WHERE id = $1 ORDER BY \" + req.query.sort, [id])`. Reviewer qanday xulosa chiqaradi?"
    options:
      - "Xavfsiz: `id` parametrlangan, demak so'rov to'liq himoyalangan"
      - "Xavfsiz, chunki `sort` faqat tartiblashga ta'sir qiladi, ma'lumotni o'zgartirmaydi"
      - "Zaif: parametrlar faqat qiymatni almashtiradi, ustun nomi (`sort`) esa SQL matniga qo'shilgan"
      - "Zaif, faqat agar `id` son bo'lmasa"
    answer: 2
    explain: "Placeholder qiymat o'rnini bosadi, identifikator yoki kalit so'zni emas. ORDER BY qismidagi satr SQL sintaksisiga kiradi, shuning uchun uni allowlist orqali tanlash kerak. `id` ning turi bu holatni o'zgartirmaydi."
  - q: "Grep bilan `innerHTML`, `eval(` va `exec(` qidirib hech narsa topilmadi. Xavfsizlik review'i tugadi, deyish mumkinmi?"
    options:
      - "Ha: xavfli sink'lar yo'q bo'lsa, zaiflik ham yo'q"
      - "Ha, agar SAST ham xatosiz o'tgan bo'lsa"
      - "Yo'q: grep faqat JavaScript fayllarida ishlaydi"
      - "Yo'q: avtorizatsiya yetishmasligi (masalan, tenant tekshiruvi yo'qligi) hech qanday xavfli funksiya chaqirmaydi, grep uni ko'rmaydi"
    answer: 3
    explain: "Grep va ko'pchilik statik qoidalar mavjud xavfli chaqiruvni qidiradi. Yo'q bo'lgan tekshiruv (CWE-862 Missing Authorization) kodda belgi qoldirmaydi, uni reviewer 'bu endpoint'da kim, qaysi obyektga' savoli bilan topadi."
  - q: "2025 CWE Top 25 ro'yxatida CWE-862 (Missing Authorization) va CWE-639 (Authorization Bypass Through User-Controlled Key) bor. Review checklist uchun bundan qanday xulosa to'g'ri?"
    options:
      - "Avtorizatsiya savollari checklist'da bo'lishi kerak: ro'yxatning o'zi buni ko'rsatadi, lekin checklist'ni faqat shu ro'yxat bilan cheklamaslik kerak"
      - "Faqat shu ikki CWE'ni tekshirish yetarli, qolganlari kam uchraydi"
      - "Top 25 ro'yxati zaiflik topish uchun skanerning o'rnini bosadi"
      - "Avtorizatsiya faqat ASVS L3 uchun kerak"
    answer: 0
    explain: "Top 25 mashhur weakness'larning umumiy reytingi: u checklist uchun yaxshi boshlang'ich, lekin sizning kodingizdagi riskni emas, umumiy tendensiyani aks ettiradi. L3 faqat darajalardan biri, avtorizatsiya talablari pastroq darajalarda ham bor."
  - q: "`const col = ORDER[sort] ?? ORDER.started;` qatori `ORDER = { started: 'started_at' }` ob'ektiga qarab ishlaydi. `sort = 'constructor'` kelsa nima bo'ladi va qaysi tuzatish to'g'ri?"
    options:
      - "`ORDER['constructor']` Object.prototype'dan funksiyani qaytaradi va u SQL matniga qo'shilishi mumkin; `Object.hasOwn(ORDER, sort)` bilan tekshirish kerak"
      - "Hech narsa bo'lmaydi: `??` noma'lum kalitni doim standart qiymatga almashtiradi"
      - "TypeScript kompilyatsiyada xato beradi, shuning uchun muammo yo'q"
      - "JSON.stringify bilan tuzatiladi"
    answer: 0
    explain: "Oddiy ob'ektda 'constructor' kabi kalitlar prototip zanjiridan keladi va `??` faqat undefined/null ni almashtiradi. Funksiya qiymati bo'lgani uchun u standartga tushmaydi. Own-property tekshiruvi yoki `Map` ishlatish kerak. TS tiplar run-time qiymatni tekshirmaydi."
  - q: "Review topilmasini yozishning qaysi shakli eng foydali?"
    options:
      - "'Bu kod xavfsiz emas, qayta yozing'"
      - "Fayl:qator, qaysi qiymat qayerga yetishi (source -> sink), qaysi xususiyat buzilishi, tuzatish taklifi va tuzatish nimani qoplamasligi"
      - "Faqat CVSS ball"
      - "Skaner chiqishini o'zgartirmasdan nusxalash"
    answer: 1
    explain: "Dasturchi topilmani qayta ishlab chiqarib, tuzatib va tekshira olishi kerak. Muallif bahosi, ball yoki umumiy gap buni bermaydi. Tuzatishning qoldiq riskini yozish keyingi review'ni osonlashtiradi."
task:
  title: "Haydovchi profilini yangilash: review topilmalarini tuzatish"
  prompt: |
    Quyida `updateDriver(ctx, id, patch)` funksiyasi bor. U ishlaydi, lekin review'da uchta topilma chiqdi:

    1. Obyekt darajasi: funksiya haydovchi so'rovchi tenant'ga tegishliligini tekshirmaydi ("alfa" foydalanuvchisi "beta" haydovchisini o'zgartira oladi).
    2. Mass assignment: `{ ...driver, ...patch }` har qanday maydonni, jumladan `tenant` va `role` ni ham yozadi.
    3. Xato xabari: topilmaganda ichki holat (jadvaldagi kalitlar) xabarga qo'shiladi.

    Tuzating: faqat `name` va `phone` o'zgartiriladi (boshqa maydonlar e'tiborga olinmaydi), begona tenant haydovchisi uchun ham, mavjud bo'lmagan haydovchi uchun ham bir xil `null` qaytadi, xato tashlanmaydi. Imzoni o'zgartirmang. Oxirgi to'rt `console.log` kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    type Driver = { id: string; tenant: string; role: string; name: string; phone: string };
    type Ctx = { user: { tenant: string } };

    const drivers = new Map<string, Driver>([
      ["d1", { id: "d1", tenant: "alfa", role: "driver", name: "Aziz", phone: "+998900000001" }],
      ["d2", { id: "d2", tenant: "beta", role: "driver", name: "Bahrom", phone: "+998900000002" }],
    ]);

    function updateDriver(ctx: Ctx, id: string, patch: Record<string, unknown>): Driver | null {
      const driver = drivers.get(id);
      if (!driver) throw new Error(`Haydovchi topilmadi: ${id}, mavjud: ${[...drivers.keys()].join(",")}`);
      const next = { ...driver, ...patch } as Driver;
      drivers.set(id, next);
      return next;
    }

    const ctx: Ctx = { user: { tenant: "alfa" } };
    console.log("begona:", updateDriver(ctx, "d2", { name: "X" })?.name ?? null);
    console.log("o'z, ruxsat etilgan:", updateDriver(ctx, "d1", { name: "Aziz K." })?.name);
    console.log("o'z, taqiqlangan:", JSON.stringify(updateDriver(ctx, "d1", { role: "admin", tenant: "beta" })));
    try { console.log("yo'q:", updateDriver(ctx, "d9", { name: "Y" })); } catch (e) { console.log("xato:", (e as Error).message); }
  solution: |
    type Driver = { id: string; tenant: string; role: string; name: string; phone: string };
    type Ctx = { user: { tenant: string } };

    const drivers = new Map<string, Driver>([
      ["d1", { id: "d1", tenant: "alfa", role: "driver", name: "Aziz", phone: "+998900000001" }],
      ["d2", { id: "d2", tenant: "beta", role: "driver", name: "Bahrom", phone: "+998900000002" }],
    ]);

    function updateDriver(ctx: Ctx, id: string, patch: Record<string, unknown>): Driver | null {
      const driver = drivers.get(id);
      if (!driver || driver.tenant !== ctx.user.tenant) return null;
      const next: Driver = { ...driver };
      if (typeof patch.name === "string") next.name = patch.name;
      if (typeof patch.phone === "string") next.phone = patch.phone;
      drivers.set(id, next);
      return next;
    }

    const ctx: Ctx = { user: { tenant: "alfa" } };
    console.log("begona:", updateDriver(ctx, "d2", { name: "X" })?.name ?? null);
    console.log("o'z, ruxsat etilgan:", updateDriver(ctx, "d1", { name: "Aziz K." })?.name);
    console.log("o'z, taqiqlangan:", JSON.stringify(updateDriver(ctx, "d1", { role: "admin", tenant: "beta" })));
    try { console.log("yo'q:", updateDriver(ctx, "d9", { name: "Y" })); } catch (e) { console.log("xato:", (e as Error).message); }
  solutionNotes: |
    - Egalik tekshiruvi `drivers.get` dan keyin darhol, o'zgartirishdan oldin turadi. Begona va mavjud bo'lmagan haydovchi bir xil `null` oladi, shuning uchun hujumchi identifikator mavjudligini bilib ololmaydi.
    - Patch'dagi maydonlar allowlist bilan qabul qilinadi: faqat `name` va `phone`, ularning turi ham tekshiriladi. `role` va `tenant` hech qachon patch'dan o'qilmaydi.
    - Xato xabaridan ichki kalitlar olib tashlandi. Real tizimda tafsilot logga yoziladi, mijozga umumiy javob qaytadi (78-dars).
    - Bu hali hamma narsa emas: `phone` formati tekshirilmaydi (72-dars), o'zgartirish audit logga yozilmaydi (79-dars), `role` ni o'zgartirish uchun alohida, yuqori huquqli yo'l kerak (53-dars).
  checklist:
    - "Begona tenant haydovchisi uchun `null` qaytadi va ma'lumot o'zgarmaydi"
    - "`role` va `tenant` patch orqali yozilmaydi"
    - "Mavjud bo'lmagan haydovchi xato tashlamaydi, ichki holat oshkor bo'lmaydi"
    - "Ruxsat etilgan `name` o'zgarishi ishlaydi"
    - "Tuzatish qaysi hujumlarni yopishini va nimani yopmasligini ayta olasiz"
---

## Muammo

Production'dagi ko'pgina zaifliklar murakkab hujum emas, balki oddiy ko'rib chiqishdan o'tib ketgan qatorlar: `ORDER BY` ga qo'shilgan satr, tenant filtri unutilgan so'rov, `{ ...driver, ...patch }`. Pull request'da "mantiq to'g'rimi" degan savol beriladi, "bu qiymatni kim nazorat qiladi va u qayerga boradi" degan savol esa berilmaydi. Natijada code review ishlaydigan kodni tasdiqlaydi, xavfsiz kodni emas.

Ikkinchi muammo: xavfsizlik review'i odatda shaxsga bog'lanadi. Bitta tajribali odam "ko'zi bilan ushlaydi", u ta'tilga chiqsa, jarayon yo'qoladi. Uchinchisi: avtomatik asboblarga (grep, SAST) ortiqcha ishonch. Asbob mavjud xavfli chaqiruvni topadi, lekin yo'q bo'lgan tekshiruvni topa olmaydi, aynan shunday nuqsonlar (avtorizatsiya yetishmasligi) eng qimmat zarar keltiradi.

Bu dars takrorlanadigan metodika beradi: nimani, qaysi tartibda va qanday savollar bilan ko'rish kerak, topilmani qanday yozish kerak va nimani asbobga topshirish mumkin.

## Asosiy g'oya

### Source'dan sink'gacha

Security code review ma'lumot oqimini kuzatishdir. Source (manba) bu mijoz boshqaradigan har qanday qiymat: URL parametri, query string, body, header, cookie, fayl nomi, webhook yuklamasi, shuningdek ichki servis yuborgan, lekin oxir-oqibat foydalanuvchidan kelgan ma'lumot. Sink (qabul qiluvchi) bu qiymat ta'sir qiladigan joy: SQL matni, shell buyrug'i, fayl yo'li, HTML chiqishi, tashqi URL, deserializatsiya, log, javob. Review har source uchun yo'lni kuzatadi va yo'l ustida uchta narsani qidiradi: validatsiya, kontekstga mos kodlash yoki parametrlash, va ruxsat tekshiruvi.

WSTG repozitoriyasi test faoliyatlari orasida Code-Level Review and Analysis ni alohida sanaydi: dinamik sinash va threat modeling bilan birga to'ldiruvchi qatlam. Kod ko'rishning afzalligi shundaki, siz hujum payload'ini topishga urinmaysiz, balki nazorat borligini yoki yo'qligini ko'rasiz. Kamchiligi: ish vaqtidagi konfiguratsiya, proxy va infratuzilmani kod ko'rsatmaydi (92-dars).

### Har endpoint uchun besh savol

Har kirish nuqtasi uchun quyidagi savollarga kodning o'zidan javob topiladi (bu kursning ishchi checklist'i, standartdan olingan ro'yxat emas):

1. Kim? Autentifikatsiya qayerda bajariladi va uni chetlab o'tadigan yo'l (alohida route, internal endpoint, webhook) bormi?
2. Qaysi obyektga? Har identifikator bo'yicha olingan obyekt uchun egalik yoki tenant tekshiruvi so'rovning o'zida bormi (52-55-darslar)?
3. Qanday kirish? Tur, uzunlik, diapazon, ruxsat etilgan maydonlar tekshiriladimi (72-dars)? Ruxsat etilmagan maydon e'tiborsiz qoladimi yoki yoziladimi (54-dars)?
4. Qayerga boradi? Qiymat sink'ga yetgunga qadar parametrlanadimi, kodlanadimi yoki allowlist'dan o'tadimi (21-30-darslar)?
5. Nima chiqadi? Javob, xato va log nimani oshkor qiladi; muvaffaqiyatsizlikda tizim xavfsiz holatga tushadimi (78-79-darslar)?

Uchinchi va to'rtinchi savol "nima noto'g'ri bo'lishi mumkin" ni, birinchi ikkitasi esa "nima yo'q" ni qidiradi. Yo'q narsani topish qiyinroq, shuning uchun checklist ataylab yo'q bo'lgan nazoratlarni so'raydi.

## Chuqurroq: checklist'ni standartdan yasash

### ASVS bilan bog'lash

ASVS 5.0.0 talablari V1 (Encoding and Sanitization) dan V17 (WebRTC) gacha bo'limlarga bo'lingan; orada Validation and Business Logic, API and Web Service, File Handling, Authentication, Session Management, Authorization, Cryptography, Configuration, Data Protection, Secure Coding and Architecture va Security Logging and Error Handling bor. Beshta savolni shu bo'limlarga xaritalash mumkin: 2-savol Authorization bo'limiga, 3-savol Validation va File Handling bo'limlariga, 4-savol Encoding and Sanitization bo'limiga, 5-savol Logging and Error Handling bo'limiga tegishli. Bu bog'lash bizning talqinimiz; aniq talab raqamini topilma hisobotiga yozishdan oldin v5.0.0 matnida tekshiring.

ASVS darajalar haqida ham aytadi: Level 1 talablarning qariyb 20 foizi, Level 2 qariyb 50 foizi (L2 ga mos kelish L1 va L2 ni, ya'ni talablarning qariyb 70 foizini bajarishni talab qiladi), Level 3 qolgan qismi. Standart ilova qaysi darajaga intilishini tashkilot o'z riskidan kelib chiqib belgilashi kerakligini yozadi. Review uchun xulosa: kichik jamoa hamma 17 bo'limni birdaniga ko'rishga urinmasin, avval L1 talablaridan boshlasin va review qamrovini aniq yozsin ("auth va authorization ko'rildi, file handling ko'rilmadi").

### CWE Top 25 bilan tartiblash

2025 CWE Top 25 jadvalida birinchi o'rinda CWE-79 (XSS), ikkinchisida CWE-89 (SQL injection), to'rtinchisida CWE-862 (Missing Authorization) turadi; CWE-639 (Authorization Bypass Through User-Controlled Key) 24-o'rinda, CWE-918 (SSRF) 22-o'rinda. Jadval har weakness uchun KEV ro'yxatiga kirgan CVE sonini ham beradi: masalan CWE-78 (OS Command Injection) uchun 20, CWE-79 uchun 7, CWE-862 uchun 0. Bu ro'yxat review ustuvorligini belgilashga yordam beradi, lekin ikki cheklov bor. Birinchisi, bu umumiy statistika: sizning kodingiz boshqa taqsimotga ega bo'lishi mumkin. Ikkinchisi, ro'yxat tez-tez o'zgaradi (jadvalda har qator uchun o'tgan yilga nisbatan o'zgarish ham yozilgan), shuning uchun checklist'ni yiliga bir marta yangilang.

### Baseline va diff-based review

Secure Code Review Cheat Sheet review'ni ikki turga ajratadi. Baseline review butun kod bazasini to'liq ko'radi: yangi ilova, katta release, eski tizimni qabul qilish, muvofiqlik talabi yoki hodisadan keyingi tahlil uchun. Diff-based review faqat o'zgarishni ko'radi: pull request, commit, tugallangan feature uchun. Kundalik ish diff-based bo'ladi, shuning uchun uning savollari boshqacha: o'zgarish mavjud xavfsizlik nazoratini buzdimi, yangi hujum yo'li ochdimi, o'zgargan trust boundary'da tekshiruv bormi, yangi integratsiya qo'shildimi, regressiya yo'qmi.

Amaliy qoida: diff-based review'da faqat o'zgargan qatorlarga qarab qolmang. Qo'shilgan route'ning guard'i boshqa faylda e'lon qilingan bo'lishi mumkin, o'zgargan servis funksiyasini esa ilgari faqat tenant'ni tekshirgan controller chaqirgan bo'lishi mumkin. Shuning uchun cheat sheet tayyorgarlikda arxitektura va threat model (4-dars), oldingi topilmalar, muhim aktivlar va yuqori riskli funksiyalarni bilishni talab qiladi. Baseline review uchun qo'shimcha: ilova chegaralari va bog'liqliklari xaritasi, hodisalar tarixi va uchinchi tomon kutubxonalari auditi. Ikkala turni birlashtirish ham mumkin: yuqori riskli komponent uchun vaqti-vaqti bilan baseline, qolgan o'zgarishlar uchun diff-based; jiddiy xavotir paydo bo'lsa, diff-based review baseline'ga ko'tariladi.

### Qo'lda ko'rish nima uchun kerak

Cheat sheet qo'lda review'ning afzalligini aniq sanaydi: biznes logikadagi nuqsonlar, ilovaning o'z qoidalariga bog'liq zaifliklar, murakkab ruxsat modellari, race condition, kriptografiyani noto'g'ri ishlatish va arxitektura darajasidagi xatolar. Avtomatik asbob bu sohalarda faqat "ko'rib chiqing" degan ishora beradi, xulosani odam chiqaradi. Asbob va odam ishi quyidagicha bo'linadi: SAST natijasi qo'lda ko'rishning ustuvorligini belgilaydi, bog'liqlik skaneri tekshiriladigan kutubxonalarni ko'rsatadi, murakkab yoki tez-tez o'zgaradigan kod reviewer vaqtini ko'proq oladi, false positive'ni esa odam filtrlaydi. Review sifatini o'lchash uchun cheat sheet qamrovni (muhim kod yo'llarining qancha qismi odam ko'zidan o'tdi), topilma sifatini (to'g'ri topilmalarning umumiy topilmalarga nisbati) va vaqt sarfini kuzatishni tavsiya qiladi. Bu ko'rsatkichlarsiz review "qildik" degan taassurotga aylanadi.

Data flow tahlili bosqichlari cheat sheet'da shunday: manbalarni aniqlash (foydalanuvchi kirishi, fayl yuklash, API chaqiruvi, bazadan o'qish, muhit o'zgaruvchilari), qayta ishlashni kuzatish (validatsiya, o'zgartirish, biznes logika, keshlash), sink'larni tekshirish (so'rov, fayl yozish, chiqish, log, tashqi API), chegaralarda validatsiya va kodlashni tekshirish, har trust zone o'tishida nazoratni tekshirish va maxfiy ma'lumot himoyasini tekshirish. E'tibor bering: bazadan o'qilgan ma'lumot ham manba hisoblanadi. Boshqa foydalanuvchi yozgan qiymat keyinroq sizning HTML'ingizga yoki shell buyrug'ingizga tushsa, bu ikkinchi tartibli (stored) hujum yo'li.

### Topilmani yozish

Cheat sheet topilma shablonini beradi: sarlavha (zaiflik turi va komponent), jiddiylik, CWE, joylashuv (fayl:qator), tavsif, ta'sir, qayta ishlab chiqarish qadamlari, tuzatish tavsiyasi, havolalar, holat va mas'ul. Biz unga ikki narsa qo'shamiz: source -> sink yo'li (qiymat qayerdan kelib qayerga yetadi) va tuzatishning qoldiq riski (nima hali yopilmagan). Birinchisi dasturchiga topilmani o'zi qayta ishlab chiqarishga imkon beradi, ikkinchisi keyingi reviewer'ga "bu joy tuzatildi, lekin shu narsa qoldi" degan ma'lumotni beradi. Review tugagach qisqa xulosa ham yoziladi: ilova versiyasi yoki commit, reviewer'lar, sana, qamrov (qaysi fayl va komponentlar), jiddiylik bo'yicha topilmalar soni va umumiy risk bahosi. Qamrov satri eng muhimi: "ko'rilmadi" deb yozilgan joy keyingi review uchun ro'yxat bo'ladi.

### Kod ko'rishdagi tipik tuzoqlar

Bir necha nuqson kodda "to'g'ri ko'rinadi", shuning uchun reviewer ularni ataylab qidirishi kerak:

- Parametrlangan so'rov ichida qo'shilgan identifikator. Placeholder (`$1`) faqat qiymat o'rnini bosadi; ustun nomi, jadval nomi va `ORDER BY` yo'nalishi SQL matniga kiradi (22 va 23-darslar).
- Allowlist sifatida oddiy ob'ekt. `ORDER[sort]` da `sort` ning `"constructor"` bo'lishi prototip zanjiridan funksiyani qaytaradi, `??` esa uni standartga almashtirmaydi. Own-property tekshiruvi (`Object.hasOwn`) yoki `Map` ishlating.
- Spread bilan birlashtirish. `{ ...record, ...body }` kutilmagan maydonlarni yozadi (54-dars).
- Tekshiruv va foydalanish orasidagi bo'shliq. Tekshirilgan qiymat keyin qayta o'qilsa yoki o'zgarsa, tekshiruv eskiradi (60-dars).
- Catch blokida jimgina davom etish. Xato holatida "ruxsat berish" fail-safe emas (78-dars).
- Yo'q bo'lgan middleware: yangi route qo'shilganda guard unutilgan, chunki himoya route ro'yxati orqali emas, qo'lda ulangan.

## Misol: tenant filtri va ORDER BY

Quyidagi misol faqat o'quv modelimizga qarshi ishlaydi: `query` funksiyasi hech qaysi bazaga ulanmaydi, u yig'ilgan SQL matnini yozib qo'yadi. Shu tufayli reviewer ko'zi bilan ko'radigan narsani, ya'ni sink'ga yetgan matnni, chiqishda ko'ramiz.

### 1. Zaif kod

```ts run
type Ctx = { user: { id: string; tenant: string } };
const sent: string[] = [];
function query(sql: string, params: unknown[] = []): void {
  sent.push(params.length ? `${sql}  -- params=${JSON.stringify(params)}` : sql);
}

// ZAIF: (1) vehicleId SQL matniga qo'shilgan, (2) orderBy SQL matniga qo'shilgan,
// (3) tenant sharti umuman yo'q
function listTripsWeak(ctx: Ctx, vehicleId: string, orderBy: string): void {
  query(`SELECT * FROM trips WHERE vehicle_id = '${vehicleId}' ORDER BY ${orderBy}`);
}

const alfa: Ctx = { user: { id: "u1", tenant: "alfa" } };
listTripsWeak(alfa, "v1", "started_at");
listTripsWeak(alfa, "x' OR '1'='1", "started_at; DROP TABLE trips");
sent.forEach((s, i) => console.log(`${i + 1}. ${s}`));
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu so'rov parametrlari orqali injection usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi "alfa" foydalanuvchisi, u faqat so'rov parametrlarini o'zgartiradi: `vehicleId` ga `x' OR '1'='1` va `sort` ga ikkinchi buyruqni yozadi. Birinchi qator oddiy so'rov, ikkinchisida filtr shartsiz bo'lib qolgan va qo'shimcha buyruq paydo bo'lgan:

```text
1. SELECT * FROM trips WHERE vehicle_id = 'v1' ORDER BY started_at
2. SELECT * FROM trips WHERE vehicle_id = 'x' OR '1'='1' ORDER BY started_at; DROP TABLE trips
```

Reviewer bu natijani kodni o'qib oldindan ko'radi: ikkita satr SQL matniga qo'shilgan va so'rovda `tenant_id` sharti yo'q. Tenant sharti yo'qligi payload'siz ham zaiflik: birinchi so'rovning o'zi "alfa" foydalanuvchisiga boshqa tenant'ning `v1` identifikatorli mashinasi safarlarini ham qaytarishi mumkin.

### 3. Tuzatilgan kod

```ts run
type Ctx = { user: { id: string; tenant: string } };
const sent: string[] = [];
function query(sql: string, params: unknown[] = []): void {
  sent.push(params.length ? `${sql}  -- params=${JSON.stringify(params)}` : sql);
}

const ORDER = new Map([
  ["started", "started_at"],
  ["distance", "distance_km"],
]);

function listTrips(ctx: Ctx, vehicleId: string, sort: string): void {
  const col = ORDER.get(sort) ?? "started_at"; // allowlist, noma'lum qiymat standartga tushadi
  query(
    `SELECT t.* FROM trips t JOIN vehicles v ON v.id = t.vehicle_id
     WHERE t.vehicle_id = $1 AND v.tenant_id = $2 ORDER BY t.${col}`,
    [vehicleId, ctx.user.tenant],
  );
}

const alfa: Ctx = { user: { id: "u1", tenant: "alfa" } };
listTrips(alfa, "x' OR '1'='1", "started_at; DROP TABLE trips");
listTrips(alfa, "v1", "constructor");
sent.forEach((s, i) => console.log(`${i + 1}. ${s.replace(/\s+/g, " ")}`));
```

```text
1. SELECT t.* FROM trips t JOIN vehicles v ON v.id = t.vehicle_id WHERE t.vehicle_id = $1 AND v.tenant_id = $2 ORDER BY t.started_at -- params=["x' OR '1'='1","alfa"]
2. SELECT t.* FROM trips t JOIN vehicles v ON v.id = t.vehicle_id WHERE t.vehicle_id = $1 AND v.tenant_id = $2 ORDER BY t.started_at -- params=["v1","alfa"]
```

Tuzatish nima uchun yetarli: qiymatlar (`vehicleId`, tenant) parametr sifatida ketadi, shuning uchun `'` belgisi SQL sintaksisiga aylana olmaydi; ustun nomi faqat serverdagi `Map` dan keladi, hujumchi uni tanlay oladi, lekin yarata olmaydi; tenant sharti so'rovning o'zida turibdi, ya'ni uni alohida chaqiruvda unutib bo'lmaydi. `Map` ishlatilgani sababli `"constructor"` kabi kalitlar prototipdan qiymat olib kelmaydi. Yopilmagan narsa: bu kod `ctx.user.tenant` ning to'g'riligiga tayanadi (autentifikatsiya, 41-50-darslar), ma'lumotlar bazasi darajasidagi izolyatsiya (PostgreSQL RLS, 56-dars) bu yerda yo'q va `vehicleId` formati tekshirilmaydi.

### Grep va SAST nimani topadi

Quyidagi kichik skaner reviewer'ning "sink qidirish" bosqichini avtomatlashtiradi. U mavjud xavfli konstruksiyalarni topadi, shu bilan birga uning chegarasini ham ko'rsatadi:

```ts run
const rules: { id: string; re: RegExp }[] = [
  { id: "sql-concat", re: /query\(\s*`[^`]*\$\{/ },
  { id: "shell-exec", re: /\bexec(Sync)?\(\s*`[^`]*\$\{/ },
  { id: "eval", re: /\beval\(/ },
  { id: "raw-html", re: /innerHTML|dangerouslySetInnerHTML/ },
  { id: "tls-off", re: /rejectUnauthorized:\s*false/ },
];

const source = [
  "export async function getVehicle(req, res) {",
  "  const v = await db.vehicle.findUnique({ where: { id: req.params.id } });",
  "  res.json(v);",
  "}",
  "export function search(req, res) {",
  "  query(`SELECT * FROM drivers WHERE name = '${req.query.q}'`);",
  "}",
  "const agent = { rejectUnauthorized: false };",
].join("\n");

source.split("\n").forEach((line, i) => {
  for (const r of rules) if (r.re.test(line)) console.log(`qator ${i + 1}: ${r.id}`);
});
console.log("getVehicle uchun topilma: yo'q");
```

```text
qator 6: sql-concat
qator 8: tls-off
getVehicle uchun topilma: yo'q
```

Skaner SQL konkatenatsiyasi va o'chirilgan TLS tekshiruvini topdi, lekin `getVehicle` da hech narsa topmadi. Aynan shu funksiyada tenant tekshiruvi yo'q (CWE-862 va CWE-639 sinfi). Bu SAST asboblarining cheklovi: ular "mavjud xavfli narsani" qidiradi, "yo'q bo'lgan nazoratni" qidirish esa biznes qoidasini bilishni talab qiladi. Real SAST asbobi bundan ancha aqlli (data flow tahlili qiladi, 83-dars), lekin tamoyil o'zgarmaydi.

### Mashq: sink qoidasini tuzating

Quyidagi funksiya bitta qatorda xavfli konstruksiya borligini aytadi, lekin faqat `eval(` ni taniydi. Qoidalarni tuzating: shell buyrug'iga shablon qo'shilgan `exec` ham topilsin, `Object.prototype` kalitiga ishora qiluvchi `ORDER[...]` ko'rinishidagi oddiy ob'ekt indekslash ham, xavfsiz `exec("ls")` esa topilmasin.

```ts run
function findSinks(line: string): string[] {
  const hits: string[] = [];
  if (/\beval\(/.test(line)) hits.push("eval");
  return hits;
}
```

```ts test
check("eval topiladi", () => findSinks("eval(x)").includes("eval"));
check("shablonli exec topiladi", () => findSinks("exec(`ping ${host}`)").includes("shell-exec"));
check("execSync ham topiladi", () => findSinks("execSync(`tar ${f}`)").includes("shell-exec"));
check("o'zgarmas exec topilmaydi", () => findSinks("exec('ls')").length === 0);
check("ob'ekt indekslash topiladi", () => findSinks("const c = ORDER[req.query.sort];").includes("dynamic-key"));
check("oddiy qator toza", () => findSinks("const a = 1;").length === 0);
```

## Qachon qo'llamaslik kerak

Har PR ni to'liq security review'dan o'tkazish ishlamaydi: jamoa tezda "tasdiqlash tugmasi"ga ko'nikadi. Review chuqurligini risk bilan bog'lang. Autentifikatsiya, avtorizatsiya, kriptografiya, fayl yuklash, to'lov, webhook va tashqi URL bilan ishlaydigan o'zgarishlar chuqur ko'riladi; matn yoki rang o'zgarishi esa yo'q.

Checklist o'zi ham zarar qilishi mumkin: reviewer faqat ro'yxatdagi savollarni beradi va ro'yxatda yo'q narsani ko'rmaydi. Shuning uchun checklist'ni topilmalar asosida to'ldirib boring va kamida bir marta "bu endpoint'ni hujumchi sifatida qanday suiiste'mol qilardim" savolini erkin shaklda bering (4-dars, threat modeling).

Katta, avtomatik generatsiya qilingan yoki minifikatsiya qilingan kodni qo'lda ko'rish mantiqsiz: bunday joyda bog'liqlik tahlili va dinamik sinash (84-dars) samaraliroq. Va nihoyat, code review dinamik sinashning o'rnini bosmaydi: konfiguratsiya, proxy va deploy xatolari kodda ko'rinmaydi.

## Stack'da: NestJS va Next.js

NestJS'da review shu savollarga aylanadi: controller'dagi har handler'da guard bormi (global guard bo'lsa ham `@Public()` kabi istisnolar ro'yxati ko'rilsin), DTO `whitelist` va `forbidNonWhitelisted` bilan tekshirilmoqdami, servis qatlami tenant'ni so'rovga uzatyaptimi. Next.js'da server action va route handler'lar alohida kirish nuqtalari: ular ham har chaqiruvda autentifikatsiya va avtorizatsiyani qayta tekshirishi kerak, chunki ularga bevosita POST yuborish mumkin (58-dars). Prisma va Kysely'da `$queryRaw` yoki `sql.raw` ga qaratilgan har chaqiruvni alohida qidiring (23-dars). Quyidagi parcha DTO whitelist'ni ko'rsatadi (ishga tushirilmaydi: NestJS va class-validator brauzer worker'ida yo'q; sintaksis tekshirilgan):

```ts
import { IsOptional, IsString, Length } from "class-validator";
import { ValidationPipe } from "@nestjs/common";

export class UpdateDriverDto {
  @IsOptional() @IsString() @Length(1, 80) name?: string;
  @IsOptional() @IsString() @Length(7, 20) phone?: string;
}

// main.ts: DTO'da yo'q maydon kelsa, so'rov rad etiladi (mass assignment'ga qarshi)
export const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
```

## Xulosa

- Security review ma'lumot oqimini kuzatadi: source (mijoz nazorat qiladigan qiymat) dan sink (SQL, shell, fayl, HTML, URL, log) gacha va yo'l ustidagi validatsiya, kodlash va ruxsat tekshiruvlarini qidiradi.
- Har endpoint uchun besh savol: kim, qaysi obyektga, qanday kirish, qayerga boradi, nima chiqadi. Yo'q bo'lgan nazoratni topish shu savollarning vazifasi.
- Checklist'ni ASVS bo'limlari va CWE Top 25 dan yasang, qamrovni yozing va yiliga bir marta yangilang.
- Placeholder qiymatni himoya qiladi, identifikatorni emas; oddiy ob'ekt allowlist bo'lib ishlamaydi (`Map` yoki `Object.hasOwn` ishlating).
- Grep va SAST mavjud xavfli chaqiruvlarni topadi, yo'q bo'lgan avtorizatsiyani topmaydi.
- Topilma fayl:qator, source -> sink, buzilgan xususiyat, tuzatish va qoldiq riskni o'z ichiga olsin.
