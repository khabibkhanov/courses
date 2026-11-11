---
n: 90
slug: secure-sdlc
title: "Secure SDLC va zaifliklarni boshqarish"
summary: "Xavfsizlikni SDLC bosqichlariga joylash (OWASP dasturi, SAMM, SSDF), zaiflikni tavakkalga qarab ustuvorlash (ekspluatatsiya signali, yetib borish, ochiqlik, KEV va EPSS), SLA, transitive bog'liqlik va dastur metrikalari."
duration: 50
sources:
  - id: t10-program
    note: "OWASP Top 10:2025, zamonaviy AppSec dasturi: risk-based portfolio, asos (siyosat, standart, trening), mavjud jarayonlarga integratsiya, security champions, metrikalar; SDLC bosqichlari bo'yicha faoliyatlar; operatsiya (patch, scanning, SLA, hodisaga javob, supply chain)"
  - id: cs-vulndeps
    note: "OWASP Vulnerable Dependency Management Cheat Sheet: loyiha boshidan avtomatik tahlil, transitive bog'liqlikda to'g'ridan-to'g'ri bog'liqlik ustida ish, patch bor/yo'q holatlari (Case 1-5), tool tanlash mezonlari, maintained backports"
  - id: samm
    note: "OWASP SAMM (Software Assurance Maturity Model): OWASP Top 10:2025 dastur bo'limi uni mavjud dastur etukligini baholash va SDLC jarayonini yaxshilash modeli sifatida tavsiya qiladi (DSOMM bilan birga)"
  - id: nist-ssdf
    note: "NIST SP 800-218 SSDF v1.1: har qanday SDLC ga qo'shiladigan yuqori darajadagi xavfsiz ishlab chiqish amaliyotlari to'plami; ishlab chiqaruvchilar zaifliklarni kamaytirish uchun, xaridorlar esa yetkazib beruvchi bilan umumiy til sifatida foydalanadi. to'rt guruh (PO, PS, PW, RV) SP 800-218 PDF'ida nomlangan, ular 100-darsda keltirilgan"
  - id: kev
    note: "CISA Known Exploited Vulnerabilities katalogi: ekspluatatsiya qilinayotgani ma'lum zaifliklar ro'yxati; CISA sahifasiga ko'ra ro'yxatga kiritish mezonlari: CVE ID bor, ekspluatatsiyaning ishonchli dalili bor, aniq tuzatish choralari bor (masalan vendor yangilanishi); CISA undan tuzatishni ustuvorlash uchun foydalanishni tavsiya qiladi"
  - id: epss
    note: "FIRST EPSS: e'lon qilingan CVE keyingi 30 kunda real hujumda ekspluatatsiya qilinish ehtimolini 0 dan 1 gacha baholaydi (har kuni har CVE uchun); darsdagi `epss` maydoni shu qiymatni modellaydi"
quiz:
  - q: "OWASP Top 10:2025 hujjati ko'ra, mavjud AppSec dasturi bor jamoa uning etukligini nima bilan baholashi mumkin?"
    options:
      - "Faqat penetration test"
      - "OWASP Top 10 ro'yxatining o'zi"
      - "OWASP SAMM yoki DSOMM kabi etuklik modeli"
      - "Faqat SAST hisobotlari"
    answer: 2
    explain: "Hujjat: dastur mavjud bo'lsa SAMM yoki DSOMM yordamida etuklikni baholash tavsiya etiladi; ular katta, ularning hammasini bajarish shart emas, ular yo'nalish ko'rsatadi."
  - q: "Zaiflikni faqat severity (CVSS) ball bo'yicha tuzatish navbatiga qo'yish nimaga olib kelishi mumkin?"
    options:
      - "Ekspluatatsiya qilinayotgan va yetib boriladigan zaiflik, ballari pastroq bo'lgani uchun, navbatda kutib qolishi mumkin"
      - "Hech qanday muammo"
      - "Hamma zaiflik bir kunda tuzaladi"
      - "SBOM kerak bo'lmaydi"
    answer: 0
    explain: "Ballar zaiflikning o'zi haqida; yetib borish, ochiqlik va real ekspluatatsiya signalini hisobga olmaydi. Darsdagi misolda B (sev 7.5) ekspluatatsiya qilinayotgan edi, lekin sev bo'yicha to'rtinchi turardi."
  - q: "Zaiflik transitive bog'liqlikda. OWASP Vulnerable Dependency Management cheat sheet qaysi yo'lni tavsiya qiladi?"
    options:
      - "Transitive paketni qo'lda tahrirlash"
      - "Hech narsa qilmaslik"
      - "node_modules'ni o'chirish"
      - "Amalni to'g'ridan-to'g'ri (direct) bog'liqlik ustida qilish, chunki transitive bog'liqlikka ta'sir qilish ko'pincha barqarorlikni buzadi"
    answer: 3
    explain: "Cheat sheet: transitive bog'liqlik zaif bo'lsa, harakat loyihaning direct bog'liqligida qilinadi; transitive'ga ta'sir qilish uchun jamoa direct'dan zaif paketgacha bo'lgan butun munosabatni tushunishi kerak, bu ko'p vaqt oladi."
  - q: "Cheat sheet Case 1 (provayder patch chiqargan) uchun qaysi sharoitni 'ideal' deb ataydi?"
    options:
      - "Testlar yo'q, shuning uchun to'g'ridan-to'g'ri production'ga"
      - "Bog'liqlikdan foydalanadigan funksiyalar uchun avtomatik unit, integration, functional yoki security testlar bor"
      - "Faqat penetration test"
      - "Patch'ni qo'lda ko'chirish"
    answer: 1
    explain: "Case 1: bog'liqlik versiyasi test muhitida yangilanadi, testlar o'tsa production'ga boradi. Buning ideal sharti: bog'liqlikdan foydalanadigan funksiyalarni tekshiruvchi avtomatik testlar mavjud."
  - q: "OWASP hujjati 'paved road' va guardrail haqida nima deydi?"
    options:
      - "Ular dasturchini sekinlashtiradi, shuning uchun kerak emas"
      - "Faqat katta kompaniyalar uchun"
      - "Eng oson yo'lni ayni paytda eng xavfsiz yo'l qilish va texnik to'siqlar bilan xavfsizroq tanlovga yo'naltirish tavsiya etiladi"
      - "Ular faqat pentest uchun"
    answer: 2
    explain: "Hujjat: xavfsiz default'lar va 'paved road' (eng oson yo'l ayni paytda eng xavfsiz) yarating, mumkin bo'lsa guardrail (texnik to'siq) qo'ying."
  - q: "Hujjatga ko'ra operatsiya bosqichida xavfsizlik uchun nima kerak?"
    options:
      - "Faqat yillik audit"
      - "Faqat firewall"
      - "Hech narsa: qurilgan ilova xavfsiz"
      - "Patch jarayoni, muntazam skanerlash jadvali, xavfsizlik xatolarini tuzatish SLA'lari, hodisaga javob jamoasi va supply chain himoyasi"
    answer: 3
    explain: "Operatsiya va o'zgarishlarni boshqarish ro'yxatida patching jarayoni, muntazam skanerlash (dinamik, statik, secrets, IaC, SCA), tuzatish SLA'lari, xato haqida xabar berish yo'li, hodisaga javob va supply chain jarayonlari bor."
task:
  title: "Tavakkalga asoslangan ustuvorlik"
  prompt: |
    `prioritize(findings)` zaifliklarni tuzatish tartibida id'lar ro'yxati sifatida qaytaradi. Hozir faqat `sev` (CVSS ball) bo'yicha tartiblaydi.

    Quyidagi tier'lar bo'yicha tartiblang (kichik raqam avval):
    1. Tier 0: `exploited` va `reachable`.
    2. Tier 1: `reachable`, `exposed` va `epss >= 0.1`.
    3. Tier 2: `reachable` (qolganlari).
    4. Tier 3: yetib bo'lmaydiganlar.

    Bir tier ichida `sev` kamayish bo'yicha, tenglikda `id` alifbo tartibida.

    Kutilgan natija: `B,C,F,E,A,D` va oxirgi qatorda `OK`.
  lang: ts
  starter: |
    type Finding = { id: string; sev: number; exploited: boolean; epss: number; reachable: boolean; exposed: boolean };

    // Tartiblangan id'lar ro'yxatini qaytaradi.
    // Hozir faqat sev bo'yicha, va tavakkalni hisobga olmaydi.
    function prioritize(findings: Finding[]): string[] {
      return [...findings].sort((a, b) => b.sev - a.sev).map((f) => f.id);
    }

    const findings: Finding[] = [
      { id: "A", sev: 9.8, exploited: false, epss: 0.01, reachable: false, exposed: true },
      { id: "B", sev: 7.5, exploited: true, epss: 0.92, reachable: true, exposed: true },
      { id: "C", sev: 8.1, exploited: false, epss: 0.35, reachable: true, exposed: true },
      { id: "D", sev: 9.1, exploited: false, epss: 0.02, reachable: false, exposed: false },
      { id: "E", sev: 5.3, exploited: false, epss: 0.03, reachable: true, exposed: false },
      { id: "F", sev: 6.5, exploited: false, epss: 0.05, reachable: true, exposed: true },
    ];

    const order = prioritize(findings).join(",");
    console.log("tartib: " + order);
    console.log(order === "B,C,F,E,A,D" ? "OK" : "KUTILGAN B,C,F,E,A,D");
  solution: |
    type Finding = { id: string; sev: number; exploited: boolean; epss: number; reachable: boolean; exposed: boolean };

    // P0: ekspluatatsiya qilinayotgan va yetib boriladigan; P1: yetib boriladigan,
    // tashqariga ochiq va epss >= 0.1; P2: yetib boriladigan; P3: qolgan.
    function tier(f: Finding): number {
      if (f.exploited && f.reachable) return 0;
      if (f.reachable && f.exposed && f.epss >= 0.1) return 1;
      if (f.reachable) return 2;
      return 3;
    }

    function prioritize(findings: Finding[]): string[] {
      return [...findings]
        .sort((a, b) => tier(a) - tier(b) || b.sev - a.sev || a.id.localeCompare(b.id))
        .map((f) => f.id);
    }

    const findings: Finding[] = [
      { id: "A", sev: 9.8, exploited: false, epss: 0.01, reachable: false, exposed: true },
      { id: "B", sev: 7.5, exploited: true, epss: 0.92, reachable: true, exposed: true },
      { id: "C", sev: 8.1, exploited: false, epss: 0.35, reachable: true, exposed: true },
      { id: "D", sev: 9.1, exploited: false, epss: 0.02, reachable: false, exposed: false },
      { id: "E", sev: 5.3, exploited: false, epss: 0.03, reachable: true, exposed: false },
      { id: "F", sev: 6.5, exploited: false, epss: 0.05, reachable: true, exposed: true },
    ];

    const order = prioritize(findings).join(",");
    console.log("tartib: " + order);
    console.log(order === "B,C,F,E,A,D" ? "OK" : "KUTILGAN B,C,F,E,A,D");
  solutionNotes: |
    - Tier qoidalari o'quv modeli. Haqiqiy tashkilotda ular o'z tavakkal modeliga (aktiv muhimligi, ma'lumot turi, kompensatsion nazoratlar) moslanadi.
    - `reachable` va `exposed` bayroqlarini qaysidir vosita yoki tahlil beradi (call graph, deployment ma'lumoti); bu modelda ular tayyor kelgan, amalda esa ularni aniqlash qiyin va xato qilish mumkin. Noaniq bo'lsa, ehtiyotkor tomonga (yetib boriladi deb) ketish xavfsizroq.
    - `exploited` va `epss` bayroqlari KEV va EPSS kabi tashqi signallardan keladi; bu modelda ular tayyor qiymat, real tizimda ularni katalog va API'dan yangilab turish kerak.
    - SLA kunlari (2, 7, 30, 90) misol uchun, hech bir manbadan olinmagan.
  checklist:
    - "Ekspluatatsiya signali severity'dan yuqori turadi"
    - "Yetib bo'lmaydigan zaiflik oxirga, lekin yo'qolmaydi"
    - "Tenglikda tartib deterministik"
    - "Modelning taxminlarini (reachable, epss manbalari) ayta olasiz"
---

## Muammo

Module davomida biz alohida nazoratlarni ko'rdik: bog'liqliklar, SAST, DAST, CI/CD, konteyner, Kubernetes, bulut va bazalar. Ularni birlashtiruvchi savol bor: bularning hammasi qaysi tartibda, kim tomonidan va nima bilan o'lchanib bajariladi? Jamoalar odatda ikki yo'ldan xato qiladi. Birinchisi, xavfsizlikni oxirgi bosqichga, ya'ni release oldidagi pentest'ga qoldirish. OWASP Top 10:2025 ning dastur bo'limi aksini aytadi: xavfsizlikni keyin qo'shishdan ko'ra uni boshidan loyihalash ancha arzon. Ikkinchisi, skanerlar topgan yuzlab zaiflik oldida nima tuzatishni bilmaslik: hamma narsani qizil deb belgilash hech narsani ustuvor qilmaydi.

Dars shu ikki masalani ko'radi. Birinchi qism: xavfsizlikni SDLC (software development life cycle) bosqichlariga qanday joylash, OWASP hujjati bo'yicha. Ikkinchi qism: zaifliklar oqimini qanday boshqarish, ustuvorlash va muddatlar belgilash. NIST SSDF (SP 800-218) ham shu yo'nalishda: u har qanday SDLC ga qo'shiladigan yuqori darajadagi xavfsiz ishlab chiqish amaliyotlari to'plami; ishlab chiqaruvchilar zaifliklarni kamaytirish uchun, xaridorlar esa yetkazib beruvchi bilan umumiy til sifatida foydalanadi. SSDF v1.1 amaliyotlarni to'rt guruhga ajratadi (PO, PS, PW, RV; 100-darsda ular nomlangan); bu dars OWASP hujjati bilan ishlaydi.

## Asosiy g'oya

### Dastur: risk-based yondashuv

OWASP Top 10:2025 zamonaviy AppSec dasturini beshta qadam bilan tavsiflaydi. Birinchisi, risk-based portfolio: ilovalar portfeli himoya ehtiyojini biznes nuqtai nazaridan aniqlash (maxfiylik qonunlari va tegishli me'yorlar ta'sir qiladi), likelihood va impact omillari bilan umumiy risk reyting modelini o'rnatish, barcha ilova va API'larni shunga ko'ra o'lchash va CMDB'ga yozish, qamrov va qat'iylik darajasini belgilovchi assurance yo'riqnomalarini o'rnatish. Ikkinchisi, mustahkam asos: jamoalar uchun ma'qullangan siyosat va standartlar, qayta ishlatiladigan xavfsizlik nazoratlari, turli rollarga mo'ljallangan majburiy trening. Uchinchisi, mavjud jarayonlarga integratsiya: threat modeling, xavfsiz dizayn va review, xavfsiz kodlash va code review, penetration testing va tuzatish kabi faoliyatlarni mavjud SDLC bosqichlariga qo'shish. To'rtinchisi, ta'lim (security champions dasturi, OWASP Juice Shop va WebGoat kabi amaliy materiallar). Beshinchisi, boshqaruv ko'rinishi: metrikalar asosida qaror qabul qilish.

Hujjat yana muhim bir ogohlantirish beradi: agar dastur allaqachon mavjud bo'lsa, uning etukligini OWASP SAMM yoki DSOMM bilan baholash mumkin. Bular keng modellar, va hujjatning o'zi aytadi: ularning hammasini bajarmasangiz ham yaxshi ish qilishingiz mumkin; ular yo'nalish berish uchun, erishib bo'lmaydigan standart emas. Bu qoida kichik jamoalarga ham tegishli: ro'yxatdagi hamma faoliyatni bir yilda joriy qilish kerak emas.

### SDLC bosqichlari bo'yicha faoliyatlar

Hujjat faoliyatlarni bosqichlar bo'yicha beradi. Talablar bosqichida: ma'lumot aktivlarining maxfiylik, haqiqiylik, yaxlitlik va mavjudlik himoyasi talablarini kelishish, texnik talablarni (funksional va nofunksional xavfsizlik) tuzish, bunda OWASP ASVS yo'riqnoma sifatida tavsiya etiladi; byudjetga va jadvalga xavfsizlik faoliyatlarini kiritish. Reja va dizayn bosqichida: himoya ehtiyoji va kutilgan tahdid darajasiga mos xavfsizlik arxitekturasi, nazoratlar va dizayn review; threat modeling; ma'lumot oqimlarini ko'rib chiqish; xavfsizlik user story'larini boshqa story'lar yoniga qo'shish. Hujjat xavfsizlikni keyin tuzatishdan ko'ra boshidan dizaynga kiritish ancha tejamli ekanini aytadi.

Rivojlantirish bosqichida hujjat dasturchilarga xavfsiz kodlash treningi, code review, vositalar (ayniqsa static analysis, software composition analysis, secrets va Infrastructure-as-Code skanerlari), guardrail'lar (texnik to'siqlar), xavfsiz default'lar va "paved road" (eng oson yo'l ayni paytda eng xavfsiz yo'l bo'lishi), IDE plagin'lari hamda secrets management vositasi berishni tavsiya qiladi. Uzluksiz xavfsizlik testi bosqichida: "use" va "abuse" test case'lari, fuzzer va DAST kabi vositalar, xavfsiz sinov muhiti, va yuqori assurance kerak bo'lsa formal penetration test; shuningdek bug hisobotlaridan nimani tuzatishni dasturchilar bilan birga hal qilish va menejerlar buning uchun vaqt berishini ta'minlash. Bu 81-84 va 85-89 darslarning o'rni: ular shu ro'yxatning aniq vositalari va nazoratlari.

### Operatsiya: patch, SLA, hodisaga javob

Operatsiya va o'zgarishlarni boshqarish bosqichida hujjat quyidagilarni sanaydi: xavfsizlikni boshqarish yo'riqnomalari (masalan patch management), samarali yangilash va patch jarayonlari, muntazam skanerlash jadvallari (dinamik, statik, secrets, IaC va software composition analysis), xavfsizlik xatolarini tuzatish uchun SLA'lar, xodimlar va ideal holda mijozlar uchun xato haqida xabar berish yo'li, hujumlar qanday ko'rinishini biladigan o'qitilgan hodisaga javob jamoasi, kamida yillik penetration test, supply chain himoyasi jarayonlari, biznes uzluksizligi rejasi. Ilovalar inventari ham sanalgan: hamma ilova inventarda va muhim tafsilotlari hujjatlashtirilgan bo'lishi kerak. Pensiyaga chiqarishda: kerakli ma'lumotni arxivlash, qolganini xavfsiz o'chirish, ishlatilmaydigan akkaunt va rollarni o'chirish.

## Chuqurroq: zaifliklarni boshqarish

### Bog'liqlik zaifliklari: nima qilish kerak

OWASP Vulnerable Dependency Management cheat sheet kontekstni shunday qo'yadi: uchinchi tomon bog'liqliklari jamoaga haqiqiy ilova kodiga e'tibor berish imkonini beradi, lekin ilovaning xavfsizlik holati endi ularga tayanadi. Tavsiya: bog'liqliklarni avtomatik tahlil qilishni loyiha tug'ilishidan boshlash, chunki uni o'rtada yoki oxirida qo'shish juda katta ish yukini keltiradi va loyihani to'xtatib qo'yishi mumkin. Jamoada yoki uning yonida zaiflikni tahlil qila oladigan xavfsizlik bo'yicha mutaxassis bo'lishi nazarda tutiladi.

Cheat sheet detect qilingan zaiflikka qarab holatlarni ajratadi. Muhim umumiy qoida: zaiflik transitive bog'liqlikda bo'lsa, harakat loyihaning to'g'ridan-to'g'ri bog'liqligi ustida qilinadi, chunki transitive bog'liqlikka aralashish ko'pincha ilova barqarorligiga ta'sir qiladi, va unga ta'sir qilish uchun jamoa birinchi darajali bog'liqlikdan zaif paketgacha butun munosabatni tushunishi kerak, bu ko'p vaqt oladi. 82-darsdagi SBOM va teskari indeks aynan shu "kim kimga bog'liq" savoliga javob beradi.

Case 1 (provayder patch chiqargan): bog'liqlik versiyasini test muhitida yangilash, testlarni yurgizish; hammasi o'tsa production'ga; o'tmasa, sabab funksiya imzosining o'zgarishi bo'lsa kodni moslashtirish; tuzatilgan versiyani umuman qabul qilib bo'lmasa (masalan, tuzatish faqat buzuvchi major versiyada yoki zaif versiyani transitive bog'liqlik qotirib qo'ygan) Case 5 qo'llanadi va vaqtinchalik chora sifatida Case 2; texnik nomuvofiqlik bo'lsa provayderga xabar berish va kutish paytida Case 2. Case 1 ning ideal sharti: bog'liqlikdan foydalanadigan funksiyalar uchun avtomatik unit, integration, functional yoki security testlar mavjudligi. Bu test qamrovining xavfsizlik qiymati: testlar bo'lmasa yangilash qo'rqinchli, shuning uchun u kechiktiriladi.

Case 2 (patch hali yo'q, lekin ekspluatatsiya usuli yoki himoya choralari ma'lum) uchun cheat sheet muhim texnik qoidani beradi: zaif funksiyaga yetib boriladigan chaqiruvlarni va ekspluatatsiya sharoitlarini aniqlang; wrapper'ni faqat u har bir zaif chaqiruv yo'lida shu sharoitlarni to'sgandagina ishlating; aks holda zaif funksiyani o'chiring yoki izolyatsiya qiling. Provayder bergan exploit'ni regression test sifatida ishlating, lekin shu payload'ning bloklanishi kutubxona xavfsiz ekanini isbotlamaydi: muqobil kirishlar va zaif funksiyaga olib boradigan barcha yo'llarni sinang. Bu yerda "yetib boriladi" (reachable) tushunchasi ustuvorlikka bevosita bog'lanadi.

Vositalar: cheat sheet vosita tanlash mezonini beradi: bir nechta ishonchli kirish manbasidan foydalanishi (har ikkala oshkor qilish yo'lini qamrash uchun) va xabarni false-positive deb belgilash imkoni. Ro'yxatda npm audit, OWASP Dependency-Check, Dependency-Track, Trivy, Grype, Snyk, JFrog Xray va Renovate sanalgan. Muhim ogohlantirish alohida bo'limda: bu vositalar zaiflikni topadi, lekin tuzatmaydi. Tuzatish qaerdan kelishi masalasi hal bo'lmasa (masalan, tuzatilgan versiyani qabul qilib bo'lmaydi), patch'ni jamoaning o'zi qo'llab-quvvatlashi yoki boshqa kishi qo'llab-quvvatlashi kerak; Linux distributivlari (Debian va Red Hat) xavfsizlik tuzatishlarini barqaror release versiyasiga backport qilishi misol sifatida keltirilgan.

### Ustuvorlik: severity yetarli emas

Skaner natijasidagi severity ball odatda zaiflikning o'zining og'irligini ifodalaydi. Lekin tuzatish navbati uchun savol boshqacha: bu zaiflik bizning tizimimizda ekspluatatsiya qilinishi mumkinmi va qilinsa qanchalik zarar? Shu savolga javob beruvchi uchta o'q bor. Birinchisi, yetib borish (reachable): zaif funksiya bizning kodimizdan chaqiriladimi (cheat sheet shuni ekspluatatsiya sharoitlarini aniqlash qadami deydi). Ikkinchisi, ochiqlik (exposed): komponent tashqi hujumchiga yetadigan joydami. Uchinchisi, real dunyo signali: zaiflik haqiqatda ekspluatatsiya qilinayotganmi yoki qilinish ehtimoli qancha.

Uchinchi signal uchun ikki manba bor. CISA KEV (Known Exploited Vulnerabilities) katalogi ekspluatatsiya qilinayotgani ma'lum zaifliklar ro'yxati: CISA ro'yxatga CVE ID bor, ishonchli ekspluatatsiya dalili bor va aniq tuzatish choralari mavjud zaifliklarni kiritadi, shuning uchun zaiflik unda bo'lsa, u nazariy emas, amalda ishlatilmoqda. FIRST EPSS (Exploit Prediction Scoring System) esa e'lon qilingan CVE keyingi 30 kunda real hujumda ekspluatatsiya qilinish ehtimolini har kuni 0 dan 1 gacha baholaydi. Ikkalasi ham ehtimoliy signal, yetib borish va ochiqlikni almashtirmaydi: KEV'da yo'q zaiflik xavfsiz degani emas, EPSS esa sizning muhitingizni emas, umumiy statistikani aks ettiradi. Darsdagi model ularni oddiy `exploited` va `epss` maydonlari sifatida ifodalaydi.

Misol sifatida SLA: har tierga muddat belgilanadi. Hujjat umuman "xavfsizlik xatolarini tuzatish uchun SLA'lar" kerakligini aytadi, lekin aniq muddatlarni bermaydi. Quyidagi 2, 7, 30 va 90 kun faqat misol qiymatlar, hech bir manbadan olinmagan; jamoa ularni o'z tavakkal modeliga va regulyator talablariga moslashtiradi.

### Metrikalar va madaniyat

Hujjat metrikalarni boshqaruv ko'rinishi sifatida tavsiflaydi: xavfsizlik amaliyotlariga rioya, kiritilgan va yopilgan zaifliklar, ilovalar qamrovi, tur bo'yicha defekt zichligi. Bundan tashqari bu ma'lumotlarni ildiz sabablarni va zaiflik andozalarini topish uchun tahlil qilish, xatolardan o'rganish va yaxshilanishni ijobiy rag'batlantirish tavsiya etiladi. Amaliyotda bu ikki narsani anglatadi: "ochiq zaifliklar soni" yagona metrika bo'lib qolmasin (u tezda manipulyatsiya qilinadi) va natijalar jazo emas, jarayonni yaxshilash uchun ishlatilsin. Bu Qachon qo'llamaslik bo'limidagi ogohlantirishlar bilan bog'liq.

## Misol: severity bo'yicha navbat va tavakkal bo'yicha navbat

Model 6 ta topilmani ifodalaydi (o'quv ma'lumotlari, haqiqiy paketlar emas). Har topilma: `sev` (ball), `exploited` (ekspluatatsiya qilinayotgani ma'lum), `epss` (ehtimol baho), `reachable` (zaif funksiya chaqiriladi) va `exposed` (tashqaridan yetiladi). Sprintda faqat 3 ta tuzatishga ulgurasiz.

### 1. Zaif kod va 2. Hujum

Zaif jarayon faqat `sev` bo'yicha navbat tuzadi. "Hujum" bu holda real hujumchi: u ekspluatatsiya qilinayotgan zaiflikdan foydalanadi, jamoa esa ballari yuqori, lekin yetib bo'lmaydigan zaifliklarni tuzatadi.

```ts run
type Finding = { id: string; pkg: string; sev: number; exploited: boolean; epss: number; reachable: boolean; exposed: boolean };

const findings: Finding[] = [
  { id: "A", pkg: "parser-lib", sev: 9.8, exploited: false, epss: 0.01, reachable: false, exposed: true },
  { id: "B", pkg: "jwt-lib", sev: 7.5, exploited: true, epss: 0.92, reachable: true, exposed: true },
  { id: "C", pkg: "img-lib", sev: 8.1, exploited: false, epss: 0.35, reachable: true, exposed: true },
  { id: "D", pkg: "dev-tool", sev: 9.1, exploited: false, epss: 0.02, reachable: false, exposed: false },
  { id: "E", pkg: "orm-lib", sev: 5.3, exploited: false, epss: 0.03, reachable: true, exposed: false },
  { id: "F", pkg: "log-lib", sev: 6.5, exploited: false, epss: 0.05, reachable: true, exposed: true },
];

// Faqat "severity" bo'yicha: eng baland ball birinchi
const queue = [...findings].sort((a, b) => b.sev - a.sev);
const capacity = 3; // bu sprintda 3 ta tuzatish mumkin
console.log("navbat: " + queue.map((f) => f.id + "(" + f.sev + ")").join(" "));
console.log("sprintda tuzatiladi: " + queue.slice(0, capacity).map((f) => f.id).join(", "));
const missed = queue.slice(capacity).filter((f) => f.exploited && f.reachable);
console.log("kutib qolgan, ekspluatatsiya qilinayotgan va yetib boriladigan: " + missed.map((f) => f.id + " (" + f.pkg + ")").join(", "));
```

```text
navbat: A(9.8) D(9.1) C(8.1) B(7.5) F(6.5) E(5.3)
sprintda tuzatiladi: A, D, C
kutib qolgan, ekspluatatsiya qilinayotgan va yetib boriladigan: B (jwt-lib)
```

Sprintda `A` va `D` tuzatiladi, ikkalasi ham yuqori ballli, lekin zaif funksiyaga yetib borilmaydi (`reachable: false`). `B` esa ekspluatatsiya qilinayotgan va yetib boriladigan edi, lekin balli 7.5 bo'lgani uchun to'rtinchi o'rinda va bu sprintdan tashqarida qoldi.

### 3. Tuzatilgan kod

Navbat tier bo'yicha: avval ekspluatatsiya qilinayotgan va yetib boriladigan, keyin yetib boriladigan, ochiq va yuqori ehtimolli, keyin qolgan yetib boriladiganlar, oxirida yetib bo'lmaydiganlar. Har tierga misol SLA belgilanadi:

```ts run
type Finding = { id: string; pkg: string; sev: number; exploited: boolean; epss: number; reachable: boolean; exposed: boolean };

const findings: Finding[] = [
  { id: "A", pkg: "parser-lib", sev: 9.8, exploited: false, epss: 0.01, reachable: false, exposed: true },
  { id: "B", pkg: "jwt-lib", sev: 7.5, exploited: true, epss: 0.92, reachable: true, exposed: true },
  { id: "C", pkg: "img-lib", sev: 8.1, exploited: false, epss: 0.35, reachable: true, exposed: true },
  { id: "D", pkg: "dev-tool", sev: 9.1, exploited: false, epss: 0.02, reachable: false, exposed: false },
  { id: "E", pkg: "orm-lib", sev: 5.3, exploited: false, epss: 0.03, reachable: true, exposed: false },
  { id: "F", pkg: "log-lib", sev: 6.5, exploited: false, epss: 0.05, reachable: true, exposed: true },
];

// Misol uchun qiymatlar; jamoa o'z tavakkal modeliga moslaydi
const SLA: Record<string, number> = { P0: 2, P1: 7, P2: 30, P3: 90 };

function tier(f: Finding): string {
  if (f.exploited && f.reachable) return "P0";
  if (f.reachable && f.exposed && f.epss >= 0.1) return "P1";
  if (f.reachable) return "P2";
  return "P3";
}

const queue = [...findings].sort(
  (a, b) => tier(a).localeCompare(tier(b)) || b.sev - a.sev || a.id.localeCompare(b.id),
);
for (const f of queue) {
  console.log(tier(f) + " (" + SLA[tier(f)] + " kun) " + f.id + " " + f.pkg + " sev=" + f.sev);
}
const capacity = 3;
console.log("sprintda tuzatiladi: " + queue.slice(0, capacity).map((f) => f.id).join(", "));
```

```text
P0 (2 kun) B jwt-lib sev=7.5
P1 (7 kun) C img-lib sev=8.1
P2 (30 kun) F log-lib sev=6.5
P2 (30 kun) E orm-lib sev=5.3
P3 (90 kun) A parser-lib sev=9.8
P3 (90 kun) D dev-tool sev=9.1
sprintda tuzatiladi: B, C, F
```

Endi sprint `B`, `C` va `F` ni tuzatadi. `A` (9.8) va `D` (9.1) yo'qolmadi: ular P3 da, 90 kunlik muddat bilan va yetib borish holati o'zgarsa (masalan, kod o'zgarib zaif funksiya chaqirila boshlasa) qayta baholanadi. Nima yopilmadi: modeldagi `reachable` va `exposed` to'g'ri bo'lishi shart; ularni noto'g'ri aniqlasak, ustuvorlik ham noto'g'ri bo'ladi. Haqiqatda bu bayroqlarni topish alohida qiyin masala.

### Topshiriq

Topshiriqdagi `prioritize` boshlang'ich holatda faqat `sev` bo'yicha tartiblaydi; uni tier qoidalari bo'yicha qayta yozasiz:

```ts run
type Finding = { id: string; sev: number; exploited: boolean; epss: number; reachable: boolean; exposed: boolean };

// Tartiblangan id'lar ro'yxatini qaytaradi.
// Hozir faqat sev bo'yicha, va tavakkalni hisobga olmaydi.
function prioritize(findings: Finding[]): string[] {
  return [...findings].sort((a, b) => b.sev - a.sev).map((f) => f.id);
}

const findings: Finding[] = [
  { id: "A", sev: 9.8, exploited: false, epss: 0.01, reachable: false, exposed: true },
  { id: "B", sev: 7.5, exploited: true, epss: 0.92, reachable: true, exposed: true },
  { id: "C", sev: 8.1, exploited: false, epss: 0.35, reachable: true, exposed: true },
  { id: "D", sev: 9.1, exploited: false, epss: 0.02, reachable: false, exposed: false },
  { id: "E", sev: 5.3, exploited: false, epss: 0.03, reachable: true, exposed: false },
  { id: "F", sev: 6.5, exploited: false, epss: 0.05, reachable: true, exposed: true },
];

const order = prioritize(findings).join(",");
console.log("tartib: " + order);
console.log(order === "B,C,F,E,A,D" ? "OK" : "KUTILGAN B,C,F,E,A,D");
```

```text
tartib: A,D,C,B,F,E
KUTILGAN B,C,F,E,A,D
```

### Mashq: noaniq yetib borish

Real tizimda `reachable` va `exposed` har doim ma'lum emas: tahlil vositasi javob bera olmasligi mumkin (`null`). Quyidagi `tier` noaniq qiymatni "yetib bo'lmaydi" deb hisoblaydi va ekspluatatsiya qilinayotgan zaiflikni P3 ga yashirib qo'yadi, chegara qiymat `epss = 0.1` ni ham noto'g'ri tasniflaydi. "Tekshirish" tugmasi bilan qaysi testlar o'tmayotganini ko'ring va tuzating. Qoidalar: noaniq (`null`) yetib borish yoki ochiqlik ehtiyotkorlik uchun `true` deb olinadi; tier qoidalari yuqoridagi bilan bir xil, `epss >= 0.1` P1 chegarasiga kiradi.

```ts run
type Finding = { exploited: boolean; epss: number; reachable: boolean | null; exposed: boolean | null };

// P0: ekspluatatsiya qilinayotgan va yetib boriladigan; P1: yetib boriladigan, ochiq, epss >= 0.1;
// P2: yetib boriladigan; P3: yetib bo'lmaydigan. Noaniq (null) - ehtiyotkor tomon: true.
function tier(f: Finding): string {
  if (f.exploited && f.reachable) return "P0";
  if (f.reachable && f.exposed && f.epss > 0.1) return "P1";
  if (f.reachable) return "P2";
  return "P3";
}
```

```ts test
check("ekspluatatsiya + yetib boriladi: P0", () => tier({ exploited: true, epss: 0.9, reachable: true, exposed: true }) === "P0");
check("ekspluatatsiya + noaniq yetib borish: P0 (ehtiyotkor)", () => tier({ exploited: true, epss: 0.9, reachable: null, exposed: true }) === "P0");
check("yetib borish noaniq, ochiq, epss 0.35: P1", () => tier({ exploited: false, epss: 0.35, reachable: null, exposed: true }) === "P1");
check("epss aynan 0.1 chegarada: P1", () => tier({ exploited: false, epss: 0.1, reachable: true, exposed: true }) === "P1");
check("ochiqlik noaniq, epss 0.2: P1", () => tier({ exploited: false, epss: 0.2, reachable: true, exposed: null }) === "P1");
check("yetib boriladi, ochiq emas: P2", () => tier({ exploited: false, epss: 0.5, reachable: true, exposed: false }) === "P2");
check("yetib bo'lmaydi (aniq false): P3", () => tier({ exploited: true, epss: 0.9, reachable: false, exposed: true }) === "P3");
```

## Qachon qo'llamaslik kerak

- Tavakkalga asoslangan ustuvorlikni yetib borishni tekshirmasdan qo'llash. "Yetib bo'lmaydi" degan noto'g'ri xulosa zaiflikni P3 ga yashirib qo'yadi. Noaniq bo'lsa, ehtiyotkor tomonga (yetib boriladi deb) ketish xavfsizroq.
- Hamma narsani darrov tuzatishni talab qilish. Hujjatning o'zi SAMM va DSOMM haqida: hammasini bajarish shart emas. Resursi cheklangan jamoa avval eng ko'p tavakkalli ilovalardan boshlaydi.
- Metrikani maqsadga aylantirish. "Ochiq zaifliklar soni nolga teng" maqsadi zaiflikni yashirishga undaydi. Ildiz sabab va andoza tahlili ko'proq foyda beradi.
- Case 2 dagi wrapper'ni "yopdi" deb qabul qilish. Cheat sheet payload bloklanishi kutubxona xavfsiz ekanini isbotlamasligini aytadi.
- Majburiy bloklovchi gate'lar bilan jamoani to'xtatish. Hujjat guardrail va paved road'ni tavsiya qiladi: xavfsiz yo'l qulay bo'lsin, jazo emas.
- SLA kunlarini manbasiz "standart" deb ko'chirish. Bu darsdagi raqamlar misol; ularni jamoa va regulyator talabi bilan belgilang.

## Stack'da: NestJS/Next.js jamoasi

- Talablar: ASVS (hujjat tavsiya etgan) dan loyiha uchun daraja tanlang va xavfsizlik user story'larini backlog'ga qo'shing (oldingi modullardagi talablar bilan bog'lang).
- Dizayn: yangi funksiya uchun qisqa threat modeling (ma'lumot oqimi, ishonch chegaralari); bu 88-89 darslardagi bulut va baza qarorlarini ham qamraydi.
- Kod: repoda SAST, secret scanning, bog'liqlik skaneri va IaC linter (83-85-darslar) PR'da avtomatik; natijalar dasturchi ko'radigan joyda (PR izohi), alohida hisobotda emas.
- Bog'liqliklar: `package-lock.json` va `npm ci` (81-82-dars), Renovate yoki shunga o'xshash vosita bilan muntazam yangilash, testlar yetarli bo'lishi (Case 1 sharti), SBOM invetari.
- Ustuvorlik: skaner topilmalarini yuqoridagi tier modeliga o'xshash qoida bilan saralang; qoidani hujjatlashtiring va chorakda bir marta qayta ko'rib chiqing.
- Operatsiya: SLA'lar, xatolar haqida xabar berish yo'li (masalan, RFC 9116 dagi `security.txt` fayli bilan), hodisaga javob rejasi va muntazam skanerlash jadvali.
- Dastur: kichik jamoa uchun SAMM kabi modelning hammasi ortiqcha bo'lishi mumkin; 3-5 ta faoliyatni tanlab, har chorakda yana bir-ikkitasini qo'shing.

## Xulosa

- OWASP dasturi: risk-based portfolio, asos, mavjud SDLC'ga integratsiya, ta'lim, metrikalar.
- Mavjud dasturni SAMM yoki DSOMM bilan baholash mumkin, lekin hammasini bajarish shart emas.
- Xavfsizlikni har bosqichga joylang: talablar (ASVS), dizayn (threat modeling), kod (SAST, SCA, secrets, IaC), test (DAST, fuzzing), operatsiya (patch, SLA, hodisaga javob).
- Bog'liqlik zaifligida: avtomatik tahlilni boshidan yoqing; transitive bo'lsa direct bog'liqlik ustida ishlang; testlar patch qabul qilish tezligini belgilaydi.
- Severity yetarli emas: yetib borish, ochiqlik va ekspluatatsiya signali (KEV, EPSS kabi) ustuvorlikni belgilaydi.
- Yetib bo'lmaydigan zaiflik yo'qolmaydi, qayta baholanadi.
- SLA va tier qiymatlari jamoa qarori; bu darsdagi raqamlar misol.
- KEV (ekspluatatsiya faktini bildiradi) va EPSS (30 kunlik ehtimol bahosi) ustuvorlikka signal beradi, lekin yetib borish va ochiqlikni almashtirmaydi.
