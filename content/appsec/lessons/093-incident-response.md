---
n: 93
slug: incident-response
title: "Incident response asoslari"
summary: "Incident response'ning ilova jamoasi uchun amaliy modeli: tayyorgarlik, aniqlash, cheklash, tiklash va xulosa; log'dan nima kerakligi, nima yozilmasligi, credential stuffing'ni aniqlash qoidasi, sessiyalarni bekor qilish va blameless post-incident review."
duration: 45
sources:
  - id: nist-61r3
    note: "NIST SP 800-61 Rev. 3 sahifasi: 2025-yil aprelda e'lon qilingan, SP 800-61 Rev. 2 (08/06/2012) o'rnini bosadi; abstract: incident response tavsiyalarini NIST CSF 2.0 bo'yicha risk boshqaruviga kiritishga yordam beradi"
  - id: cs-logging
    note: "Logging Cheat Sheet: 'Which events to log' (autentifikatsiya muvaffaqiyat va xatolari, avtorizatsiya xatolari va h.k.; 'alarm fog' haqida ogohlantirish) va 'Data to exclude' (parol, token, session identifikator, connection string va boshqalar log'ga to'g'ridan-to'g'ri yozilmaydi)"
  - id: asvs
    note: "ASVS 5.0.0 V16 (Security Logging and Error Handling): 16.1.1 log inventari, 16.2.1 har yozuvda when/where/who/what metadata, 16.2.2 vaqt manbalari sinxron va UTC, 16.2.5 sezgir ma'lumotni himoya darajasiga qarab loglash, 16.3.1 va 16.3.2 autentifikatsiya va avtorizatsiya hodisalari, 16.4.1-16.4.3 log injection, loglarni o'zgartirishdan himoya va alohida tizimga uzatish"
  - id: t10-a09
    note: "A09:2025 Security Logging & Alerting Failures: 9-o'rinda saqlanib qolgan, nomga alerting qo'shilgan; CWE-117, CWE-532, CWE-778 kiradi; CVE/CVSS ma'lumotida 723 CVE; alerting va response siz logging kamdan-kam foyda beradi"
quiz:
  - q: "Ertalab monitoring bitta mijoz akkauntidan nostandart hududdan kirishni ko'rsatdi. Birinchi harakat qaysi?"
    options:
      - "Darhol butun serverni o'chirib, hamma loglarni o'chirish"
      - "Mijozga hech narsa demasdan, faqat parolni o'zgartirish"
      - "Voqeani qayd etish, ta'sir doirasini baholash va dalillarni (loglar, session ma'lumoti) saqlab qo'yib, so'ng cheklash choralarini ko'rish"
      - "Avval post-incident review yozish"
    answer: 2
    explain: "Cheklash kerak, lekin dalillar yo'qolmasligi shart: loglar va holat tahlil uchun kerak. Hamma narsani o'chirish dalilni ham yo'q qiladi. Mijoz bilan aloqa ham reja qismi. Review esa hodisadan keyin."
  - q: "Log qatori: `login failed for aziz@alfa.example password=Qwerty123`. Asosiy muammo nima?"
    options:
      - "Parol (hatto xato parol ham) logga yozilmoqda; xato parol ko'pincha foydalanuvchining boshqa joydagi haqiqiy paroli yoki unga yaqin"
      - "Qator juda qisqa"
      - "Log inglizcha emas"
      - "Muammo yo'q: login xatosi, demak parol yaroqsiz"
    answer: 0
    explain: "Logging Cheat Sheet parollarni logga yozmaslikni aytadi. Foydalanuvchi ko'pincha xato terilgan haqiqiy parolini kiritadi, shuning uchun bunday qator CWE-532 (logga maxfiy ma'lumot yozish) hisoblanadi."
  - q: "Quyidagilardan qaysi biri incident paytida eng kam foyda beradigan log yozuvi?"
    options:
      - "Vaqt, foydalanuvchi, tenant, IP va so'rov identifikatori bilan `login_failed`"
      - "Admin amali: kim, nimani, qachon o'zgartirgani"
      - "Avtorizatsiya rad etilgani: kim, qaysi resurs, qachon"
      - "Faqat `error occurred` matni, boshqa maydon yo'q"
    answer: 3
    explain: "Kim, qachon, qayerdan va nima bo'lganini aytmaydigan yozuv tahlilga yaramaydi. Boshqa uch variant aynan tahlilchi so'raydigan savollarga javob beradi."
  - q: "Credential stuffing aniqlash qoidasi: 'bir IP'dan 60 soniyada 5 ta xato kirish'. Uning kamchiligi qaysi?"
    options:
      - "Hech qanday kamchiligi yo'q"
      - "Taqsimlangan hujum (har IP'dan 1-2 urinish) ushlanmaydi; shuning uchun akkaunt bo'yicha va umumiy tezlik bo'yicha qoidalar ham kerak"
      - "Qoida faqat muvaffaqiyatli kirishda ishlaydi"
      - "Qoida mavjudlikka zarar qiladi"
    answer: 1
    explain: "Bitta IP asosidagi chegara oddiy, lekin hujumchi urinishlarni ko'p manzilga taqsimlasa o'tib ketadi. Bu qoldiq risk: qo'shimcha qoidalar va rate limiting (73-dars) kerak."
  - q: "Hodisa yopildi. Post-incident review qanday o'tkazilganda eng foydali?"
    options:
      - "Aybdor topilib, jazolanadi"
      - "Faqat mijozga xat yuboriladi"
      - "Review o'tkazilmaydi: hodisa tugadi"
      - "Hodisa vaqt chizig'i, aniqlash qancha vaqtda bo'lgani, nima ishlagani va nima ishlamagani muhokama qilinadi; tuzatish vazifalari egasi va muddati bilan yoziladi; ayb emas, tizim sabablari qidiriladi"
    answer: 3
    explain: "Review maqsadi takrorlanmasligini ta'minlash. Ayblash odamlarni voqeani yashirishga undaydi. Vazifasi egasi va muddati yo'q xulosa amalda bajarilmaydi."
  - q: "Hodisa paytida kompromet qilingan foydalanuvchi akkaunti uchun nima to'g'ri cheklash choralari to'plami?"
    options:
      - "Parolni o'zgartirish va barcha faol session va refresh token'larni bekor qilish, API kalitlarini ko'rib chiqish"
      - "Faqat parolni o'zgartirish: eski session'lar baribir amal qiladi"
      - "Akkauntni o'chirib tashlash, hech narsa saqlamaslik"
      - "Hech narsa qilmaslik, hujumchi o'zi to'xtaydi"
    answer: 0
    explain: "Parol almashishi mavjud session'larni bekor qilmaydi (agar ilova shunday qurilmagan bo'lsa); hujumchi kirib turishda davom etadi. Akkauntni o'chirish dalilni yo'qotadi."
task:
  title: "Credential stuffing'ni aniqlash: oyna va muvaffaqiyat sharti"
  prompt: |
    `detectStuffing(events, threshold, windowSec)` autentifikatsiya hodisalaridan shubhali IP'larni topadi. Hozirgi versiya faqat umumiy xato sonini sanaydi va vaqtni, muvaffaqiyatli kirishni hisobga olmaydi, shuning uchun tasodifiy xatolarni ham ushlaydi va haqiqiy hujumni o'tkazib yuborishi mumkin.

    Qoida: bir IP uchun `windowSec` soniya ichida kamida `threshold` ta `login_failed` bo'lsa va shu oynadan keyin (yoki oyna ichida, oxirgi xatodan keyin) shu IP'dan `login_ok` kelsa, IP ro'yxatga qo'shiladi (hujum muvaffaqiyatli bo'lgan). Ro'yxat IP'larning alifbo tartibidagi massivi, takrorsiz. Hodisalar vaqt bo'yicha tartiblanmagan bo'lishi mumkin. Imzoni o'zgartirmang. Oxirgi to'rt `console.log` kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    type Ev = { ts: number; type: "login_failed" | "login_ok"; ip: string; user: string };

    function detectStuffing(events: Ev[], threshold: number, windowSec: number): string[] {
      const failed = new Map<string, number>();
      for (const e of events) {
        if (e.type === "login_failed") failed.set(e.ip, (failed.get(e.ip) ?? 0) + 1);
      }
      return [...failed].filter(([, n]) => n >= threshold).map(([ip]) => ip).sort();
    }

    const burst: Ev[] = [
      ...[0, 5, 9, 14, 20, 25].map((t, i): Ev => ({ ts: 1000 + t, type: "login_failed", ip: "203.0.113.7", user: `u${i}` })),
      { ts: 1030, type: "login_ok", ip: "203.0.113.7", user: "u3" },
    ];
    const slow: Ev[] = [0, 100, 200, 300, 400, 500].map((t): Ev => ({ ts: 1000 + t, type: "login_failed", ip: "198.51.100.4", user: "u1" }));
    const noSuccess: Ev[] = [0, 1, 2, 3, 4].map((t): Ev => ({ ts: 1000 + t, type: "login_failed", ip: "192.0.2.9", user: "u2" }));
    const shuffled = [...burst].reverse();

    console.log("hujum:", detectStuffing(burst, 5, 60));
    console.log("sekin xatolar:", detectStuffing(slow, 5, 60));
    console.log("muvaffaqiyatsiz hujum:", detectStuffing(noSuccess, 5, 60));
    console.log("tartibsiz kiritish:", detectStuffing(shuffled, 5, 60));
  solution: |
    type Ev = { ts: number; type: "login_failed" | "login_ok"; ip: string; user: string };

    function detectStuffing(events: Ev[], threshold: number, windowSec: number): string[] {
      const byIp = new Map<string, Ev[]>();
      for (const e of events) {
        const list = byIp.get(e.ip) ?? [];
        list.push(e);
        byIp.set(e.ip, list);
      }
      const hits: string[] = [];
      for (const [ip, list] of byIp) {
        list.sort((a, b) => a.ts - b.ts);
        const fails = list.filter((e) => e.type === "login_failed");
        let suspicious = false;
        for (let i = 0; i + threshold - 1 < fails.length; i++) {
          const first = fails[i];
          const last = fails[i + threshold - 1];
          if (last.ts - first.ts <= windowSec) {
            suspicious = list.some((e) => e.type === "login_ok" && e.ts >= last.ts);
            if (suspicious) break;
          }
        }
        if (suspicious) hits.push(ip);
      }
      return hits.sort();
    }

    const burst: Ev[] = [
      ...[0, 5, 9, 14, 20, 25].map((t, i): Ev => ({ ts: 1000 + t, type: "login_failed", ip: "203.0.113.7", user: `u${i}` })),
      { ts: 1030, type: "login_ok", ip: "203.0.113.7", user: "u3" },
    ];
    const slow: Ev[] = [0, 100, 200, 300, 400, 500].map((t): Ev => ({ ts: 1000 + t, type: "login_failed", ip: "198.51.100.4", user: "u1" }));
    const noSuccess: Ev[] = [0, 1, 2, 3, 4].map((t): Ev => ({ ts: 1000 + t, type: "login_failed", ip: "192.0.2.9", user: "u2" }));
    const shuffled = [...burst].reverse();

    console.log("hujum:", detectStuffing(burst, 5, 60));
    console.log("sekin xatolar:", detectStuffing(slow, 5, 60));
    console.log("muvaffaqiyatsiz hujum:", detectStuffing(noSuccess, 5, 60));
    console.log("tartibsiz kiritish:", detectStuffing(shuffled, 5, 60));
  solutionNotes: |
    - Hodisalar IP bo'yicha guruhlanib, vaqt bo'yicha tartiblanadi: kiritish tartibiga ishonilmaydi (log'lar turli manbalardan kelib, aralashishi mumkin).
    - "Oyna" `threshold` ta ketma-ket xatoning birinchisi va oxirgisi orasidagi farq bilan o'lchanadi, shuning uchun sekin tarqalgan xatolar (har 100 soniyada) ushlanmaydi.
    - Faqat muvaffaqiyatli kirish ham bo'lgan IP ro'yxatga kiradi: muvaffaqiyatsiz urinishlar uchun alohida (past ustuvorlikdagi) ogohlantirish bo'lishi mumkin, lekin kompromet qilingan akkaunt aynan shu qoidaning natijasi.
    - Qoldiq risk: bitta IP asosida; taqsimlangan hujum (har IP'dan bir-ikki urinish) bu qoida orqali ko'rinmaydi, akkaunt bo'yicha qoida va rate limiting (73-dars) kerak. IP manzillar NAT orqasida bir necha foydalanuvchini yashirishi ham mumkin.
  checklist:
    - "Bir oynadagi `threshold` ta xato va undan keyingi muvaffaqiyatli kirish IP'ni ro'yxatga kiritadi"
    - "Sekin tarqalgan xatolar va muvaffaqiyatsiz urinishlar ro'yxatga kirmaydi"
    - "Tartibsiz kiritilgan hodisalar to'g'ri ishlanadi"
    - "Natija alifbo tartibida, takrorsiz"
    - "Qoidaning qoldiq riskini (taqsimlangan hujum) ayta olasiz"
---

## Muammo

Har qanday ilova ertami-kechmi buziladi: kimdir token'ni log'ga tushirib yuboradi, bog'liqlikda yangi zaiflik chiqadi, yoki bitta foydalanuvchi akkaunti egallanadi. Zaiflik sonini nolga tushirib bo'lmaydi, shuning uchun savol "buzilmaydimi" emas, "buzilganda nima qilamiz" bo'ladi. Ko'p jamoada javob yo'q: kim hodisani e'lon qiladi, kim qaror qiladi, loglar qayerda, mijozga kim va nima deydi, hammasi hodisa vaqtida, uyqusiz va shoshilinch holda hal qilinadi.

Ikkinchi muammo: log bor, lekin foydasiz. OWASP Top 10:2025 da A09 Security Logging & Alerting Failures 9-o'rinda saqlanib qolgan va nomiga alerting so'zi qo'shilgan: kategoriya tavsifi loglash va monitoring bo'lmasa hujumni aniqlab bo'lmasligini, alerting bo'lmasa tez va samarali javob berish qiyinligini aytadi. Kategoriya sahifasi uni sinashning qiyinligini ham tan oladi va CVE/CVSS ma'lumotida atigi 723 CVE borligini yozadi, lekin ko'rinish va forensika uchun ta'siri katta ekanini ta'kidlaydi.

Uchinchi muammo: log hodisadan keyin o'zi muammo manbaiga aylanadi. Parol yoki token yozilgan log fayli ikkinchi hodisa uchun material bo'lib qoladi.

Bu dars ilova jamoasi uchun minimal, ammo amaliy incident response modelini beradi: nima oldindan tayyorlanadi, hodisa paytida qanday ketma-ketlik bilan harakat qilinadi, log'lardan nima kerak va nima yozilmaydi, hamda hodisadan keyin nima o'zgaradi. Log tuzilishi va audit log batafsil 79-darsda, qonuniy xabar berish majburiyatlari 94-darsda.

## Asosiy g'oya

### Rasmiy yo'riqnoma nima deydi

NIST SP 800-61 Rev. 3 2025-yil aprelda e'lon qilingan va 2012-yilgi Rev. 2 ni almashtiradi. Abstract'ga ko'ra hujjat incident response tavsiyalarini NIST Cybersecurity Framework (CSF) 2.0 doirasidagi kiberxavfsizlik risk boshqaruvi faoliyatlariga kiritishga yordam beradi. Maqsadlar: incident'larga tayyorlanish, ularning soni va ta'sirini kamaytirish, aniqlash, javob berish va tiklash samaradorligini oshirish. NIST CSF 2.0 o'zi oltita funksiyadan iborat (Govern, Identify, Protect, Detect, Respond, Recover): incident response ularning Detect, Respond va Recover qismlariga tegadi, lekin Govern (rollar, siyosat) va Protect (oldindan qilingan himoya) ham hodisa oqibatini belgilaydi. Bu yerda muhim fikr: incident response alohida "yong'in o'chirish" funksiyasi emas, risk boshqaruvining davomiy qismi. Hujjatning to'liq tuzilmasini (bo'limlar va faoliyatlar tafsilotini) bu dars o'qib chiqmagan; quyida bayon qilingan bosqichlar kursning ishchi modeli, standart bo'limlarining nusxasi emas.

### Ilova jamoasi uchun besh bosqich

1. Tayyorgarlik. Hodisadan oldin bajariladi: kim on-call, kim qaror qiladi (incident commander), kim mijozlar bilan gaplashadi, loglar qayerda va qancha saqlanadi, kalitlarni almashtirish tartibi (68-dars), sessiyalarni bekor qilish mexanizmi, orqaga qaytarish usuli. Bu bosqichda bajarilmagan ish hodisa vaqtida bajarilmaydi.
2. Aniqlash va baholash. Signal (alert, mijoz xabari, tashqi tadqiqotchi xabari) tekshiriladi: bu haqiqatan hodisami, qancha tizim va qaysi tenant'lar ta'sirlangan, qaysi ma'lumot (maxfiylik), qaysi o'zgartirish (yaxlitlik), qaysi uzilish (mavjudlik) xavf ostida (1-dars).
3. Cheklash. Zararning tarqalishini to'xtatish: kompromet qilingan akkaunt session'larini bekor qilish, kalitlarni almashtirish, zaif endpoint'ni vaqtincha o'chirish yoki WAF qoidasi bilan yopish, tarmoq izolyatsiyasi. Cheklash dalillarni yo'qotmasligi shart.
4. Yo'q qilish va tiklash. Sababni bartaraf qilish (kod tuzatish, sozlama, bog'liqlik yangilash), kompromet qilingan sirlarni almashtirish, xizmatni tekshirilgan holatda qayta yoqish, keyingi kunlarda kuchaytirilgan monitoring.
5. Xulosa (post-incident review). Vaqt chizig'i, sabablar, ishlagan va ishlamagan narsalar, tuzatish vazifalari.

Bosqichlar bir-biriga o'tib turadi: tahlil cheklash paytida ham davom etadi.

## Chuqurroq: log'dan nima kerak

### Qaysi hodisalar yoziladi

Logging Cheat Sheet "Which events to log" bo'limida har doim loglash tavsiya etilgan hodisalar ro'yxatini beradi: kirish validatsiyasi xatolari, chiqish validatsiyasi xatolari, autentifikatsiya muvaffaqiyatlari va xatolari, avtorizatsiya (access control) xatolari, session boshqaruvi xatolari (masalan cookie qiymati o'zgartirilgani), ilova xatolari va tizim hodisalari va boshqalar. Cheat sheet ayni paytda ogohlantiradi: bir xil ro'yxatni ko'r-ko'rona qo'llash keraksiz "alarm fog" (ogohlantirish tumani) yaratadi va haqiqiy muammolar yo'qolib ketadi, shuning uchun loglash darajasi loyiha riskiga mutanosib bo'lishi kerak. Kirish validatsiyasi xatosi esa hujum isboti emas, shubhali hodisa deb qaraladi; ahamiyati takrorlanish, korrelyatsiya va so'rov konteksti bilan baholanadi.

Tahlilchi har hodisadan kamida shu savollarga javob olishi kerak: qachon, kim (foydalanuvchi, tenant), qayerdan (IP, qurilma), nima qilmoqchi bo'ldi, natijasi qanday, va bu hodisa qaysi so'rovga tegishli (so'rov identifikatori orqali bir nechta hodisani bog'lash). Shu maydonlar bo'lmasa, hodisa vaqtida bu ma'lumotni qayta tiklab bo'lmaydi.

### Nima yozilmaydi

Cheat sheet "Data to exclude" bo'limida quyidagilar odatda log'ga to'g'ridan-to'g'ri yozilmasligini, balki olib tashlanishi, maskalanishi, hash qilinishi yoki shifrlanishi kerakligini aytadi: autentifikatsiya parollari, access token'lar, session identifikatorlari (kerak bo'lsa hash bilan almashtirish mumkin), database connection string'lar, shifrlash kalitlari va boshqa asosiy sirlar, to'lov kartasi ma'lumoti, maxfiy shaxsiy ma'lumotlar. Bundan tashqari qonuniy asosi bo'lmagan ma'lumotni yig'ish ham taqiqlangan (94-dars). A09 kategoriyasi buni CWE-532 (maxfiy ma'lumotni log'ga yozish) sifatida, log'ga chiqishda kodlash xatosini CWE-117, yetarli loglamaslikni CWE-778 sifatida mapped qiladi.

Yana bir nozik joy: cheat sheet "ishonchli" foydalanuvchilardan (ichki tizimlar, auditorlar, pentesterlar) kelgan hodisalarni log'dan chiqarib tashlamaslikni, ularni alohida belgi bilan yozishni tavsiya qiladi.

### Log nima uchun incident qurboni bo'ladi

A09 kategoriyasining tavsifi "log bor" degan fikr yetarli emasligini aniq sanaydi. Kategoriya quyidagi holatlarni nuqson hisoblaydi: login, muvaffaqiyatsiz login va yuqori qiymatli tranzaksiya kabi hodisalar loglanmaydi yoki nomuvofiq loglanadi (masalan faqat muvaffaqiyatli kirish yoziladi); ogohlantirish va xatolar uchun log yo'q yoki tushunarsiz; log yaxlitligi o'zgartirishdan himoyalanmagan; log faqat lokal saqlanadi va zaxira nusxasi yo'q; ogohlantirish chegaralari va eskalatsiya jarayoni belgilanmagan; pentest va DAST skanerlari hech qanday alert qo'zg'amaydi; soxta ijobiy alertlar haqiqiy alertni ko'mib yuboradi; use case uchun playbook yo'q yoki eskirgan. Sahifadagi birinchi misol shu: bolalar sog'liqni saqlash rejasi provayderining veb-saytida kuzatuv va log bo'lmagani sababli buzilish aniqlanmagan, tashqi tomon xabar bergan, hujumchi 3,5 milliondan ortiq bolaning yozuvlariga kirgan va o'zgartirgan, buzilish 2013-yildan beri davom etgan bo'lishi mumkin edi. Mexanizm oddiy: aniqlash bo'lmasa, incident response boshlanmaydi.

ASVS 5.0.0 V16 bo'limi buni tekshiriladigan talablarga aylantiradi. 16.1.1 qaysi qatlamda nima loglanishi, qayerda saqlanishi, kimga ochiqligi va qancha turishini hujjatlashtirilgan inventarni talab qiladi. 16.2.1 har yozuvda "qachon, qayerda, kim, nima" metadata bo'lishini, 16.2.2 barcha log komponentlarida vaqt manbalari sinxronlashganini va vaqt tamg'alari UTC yoki aniq zona siljishi bilan berilishini talab qiladi (tarqoq tizimda vaqt chizig'ini tiklash uchun bu shart). 16.3.1 va 16.3.2 autentifikatsiya urinishlari (muvaffaqiyatli va muvaffaqiyatsiz) hamda rad etilgan avtorizatsiya loglanishini, 16.4.1 log injection oldini olishni, 16.4.2 loglarning ruxsatsiz kirish va o'zgartirishdan himoyasini, 16.4.3 esa loglar mantiqan alohida tizimga uzatilishini talab qiladi, shunda ilova buzilsa ham loglar buzilmaydi. Bizning misolimizdagi `AuthEvent` shakli 16.2.1 va 16.3.1 ga mos, "log yig'uvchi alohida bo'lishi kerak" gapi esa 16.4.3 dan.

Logging Cheat Sheet ham log himoyasini alohida bo'lim sifatida beradi: saqlangan holatda tamper detection (yozuv o'zgartirilgani yoki o'chirilganini bilish), loglarni imkon qadar tez read-only vositaga nusxalash, loglarga har kirishni yozib borish va kirish huquqini davriy ko'rib chiqish; uzatishda esa ishonchsiz tarmoq orqali xavfsiz protokol ishlatish. Cheat sheet loglash to'xtab qolganini aniqlash jarayonini ham talab qiladi: hujumchi loglarni to'xtatishga yoki o'chirishga urinishi mumkin, shuning uchun "log kelmayapti" ham alert bo'lishi kerak. A09 qo'shimcha g'oya beradi: bazaga yoki ma'lumotga honeytoken (oddiy biznes jarayonda hech ishlatilmaydigan soxta yozuv yoki identifikator) qo'yish; unga har qanday murojaat deyarli soxta ijobiysiz alert beradi.

## Misol: log'siz hodisa va log bilan hodisa

Misol faqat o'quv modelimiz: xotiradagi log, shartli vaqt tamg'alari va hujjatlar uchun ajratilgan IP manzillar (`203.0.113.0/24` kabi). Hech qaysi real tizimga ulanish yo'q.

### 1. Zaif kod

```ts run
const lines: string[] = [];

// ZAIF: parol logga yoziladi, vaqt, IP va tenant yo'q, muvaffaqiyatli kirish ham ma'nosiz
function loginWeak(email: string, password: string, ok: boolean): void {
  lines.push(ok ? "login ok" : `login failed for ${email} password=${password}`);
}

// Hodisa: kimdir bir necha akkauntni parol ro'yxati bilan sinaydi
loginWeak("aziz@alfa.example", "Qwerty123", false);
loginWeak("bahrom@alfa.example", "Qwerty123", false);
loginWeak("dilnoza@beta.example", "Qwerty123", false);
loginWeak("dilnoza@beta.example", "Dilnoza2024!", true);
lines.forEach((l) => console.log(l));

// Tahlilchi savollari:
console.log("--- tahlilchi uchun ---");
console.log("hujum qaysi IP'dan?", "noma'lum");
console.log("qaysi akkaunt egallangan?", "noma'lum (login ok qatorida foydalanuvchi yo'q)");
console.log("qancha davom etdi?", "noma'lum (vaqt yo'q)");
console.log("log'da sirlar bormi?", lines.some((l) => l.includes("password=")) ? "ha" : "yo'q");
```

### 2. Hujum

Hujumchi umumiy parol ro'yxati bilan bir necha akkauntni sinaydi (credential stuffing, 43-dars). Hujumning o'zi oddiy, muammo log'ning holatida. Natija:

```text
login failed for aziz@alfa.example password=Qwerty123
login failed for bahrom@alfa.example password=Qwerty123
login failed for dilnoza@beta.example password=Qwerty123
login ok
--- tahlilchi uchun ---
hujum qaysi IP'dan? noma'lum
qaysi akkaunt egallangan? noma'lum (login ok qatorida foydalanuvchi yo'q)
qancha davom etdi? noma'lum (vaqt yo'q)
log'da sirlar bormi? ha
```

Log'dan hodisani tiklash mumkin emas: IP, vaqt va muvaffaqiyatli kirish egasi yo'q, bundan tashqari log'ning o'zi parol qatorlarini saqlaydi. Foydalanuvchilar ko'pincha xato terilgan o'z haqiqiy parolini kiritgani uchun, bu qatorlarni o'qiy oladigan har kim (log tizimi administratori, log yig'uvchi xizmat) ular bilan boshqa joylarga kirib ko'rishi mumkin.

### 3. Tuzatilgan kod

```ts run
type AuthEvent = {
  ts: number;
  type: "login_failed" | "login_ok";
  user: string;
  tenant: string;
  ip: string;
  reqId: string;
};

const SECRET_KEYS = /pass(word)?|token|secret|authorization|cookie|api[-_]?key/i;
function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, SECRET_KEYS.test(k) ? "[REDACTED]" : redact(v)]),
    );
  }
  return value;
}

const events: AuthEvent[] = [];
function logAuth(e: AuthEvent): void {
  events.push(e);
}

// Xuddi shu hodisa, endi to'liq maydonlar bilan (parol yozilmaydi)
const ip = "203.0.113.7";
logAuth({ ts: 1000, type: "login_failed", user: "aziz", tenant: "alfa", ip, reqId: "r1" });
logAuth({ ts: 1004, type: "login_failed", user: "bahrom", tenant: "alfa", ip, reqId: "r2" });
logAuth({ ts: 1009, type: "login_failed", user: "dilnoza", tenant: "beta", ip, reqId: "r3" });
logAuth({ ts: 1012, type: "login_failed", user: "umid", tenant: "beta", ip, reqId: "r4" });
logAuth({ ts: 1015, type: "login_failed", user: "nigora", tenant: "beta", ip, reqId: "r5" });
logAuth({ ts: 1019, type: "login_ok", user: "dilnoza", tenant: "beta", ip, reqId: "r6" });
logAuth({ ts: 2000, type: "login_failed", user: "aziz", tenant: "alfa", ip: "198.51.100.4", reqId: "r7" });
logAuth({ ts: 2010, type: "login_ok", user: "aziz", tenant: "alfa", ip: "198.51.100.4", reqId: "r8" });

function stuffingAlerts(list: AuthEvent[], threshold = 5, windowSec = 60): string[] {
  const alerts: string[] = [];
  for (const addr of new Set(list.map((e) => e.ip))) {
    const mine = list.filter((e) => e.ip === addr).sort((a, b) => a.ts - b.ts);
    const fails = mine.filter((e) => e.type === "login_failed");
    for (let i = 0; i + threshold - 1 < fails.length; i++) {
      const last = fails[i + threshold - 1];
      if (last.ts - fails[i].ts > windowSec) continue;
      const ok = mine.find((e) => e.type === "login_ok" && e.ts >= last.ts);
      if (ok) {
        alerts.push(`ALERT ${addr}: ${threshold} xato / ${last.ts - fails[i].ts}s, keyin ${ok.tenant}/${ok.user} kirdi`);
        break;
      }
    }
  }
  return alerts;
}

stuffingAlerts(events).forEach((a) => console.log(a));
console.log("ta'sir doirasi:", [...new Set(events.filter((e) => e.ip === ip).map((e) => `${e.tenant}/${e.user}`))].join(", "));
console.log("redact:", JSON.stringify(redact({ user: "aziz", password: "Qwerty123", headers: { Authorization: "Bearer x", accept: "json" } })));
```

```text
ALERT 203.0.113.7: 5 xato / 15s, keyin beta/dilnoza kirdi
ta'sir doirasi: alfa/aziz, alfa/bahrom, beta/dilnoza, beta/umid, beta/nigora
redact: {"user":"aziz","password":"[REDACTED]","headers":{"Authorization":"[REDACTED]","accept":"json"}}
```

Endi savollarga javob bor: hujum `203.0.113.7` dan, 1000 dan 1019 gacha (shartli sekundlar) davom etdi, beshta xatodan keyin `beta/dilnoza` kirdi, urinishlar ikki tenant'ga tegdi. Boshqa IP'dan bitta xato va keyin muvaffaqiyatli kirish ogohlantirish bermadi (oddiy xato terish). Maxfiy maydonlar `redact` bilan yashiriladi.

Tuzatish nima uchun yetarli: log har hodisada tahlil uchun zarur maydonlarni saqlaydi, sirlar yozilmaydi va qoida muvaffaqiyatli kirish bilan tugagan ketma-ketlikni topadi. Yopilmagan narsa: `redact` faqat kalit nomi bo'yicha ishlaydi (sir `note` kabi nomdagi maydonda kelsa o'tib ketadi), qoida bitta IP asosida (taqsimlangan hujum ushlanmaydi), log'ning yaxlitligi va saqlash muddati bu yerda hal qilinmagan (79-dars).

### Cheklash: sessiyalarni bekor qilish

Cheklash kodi ham oldindan yozilgan bo'lishi kerak. Quyida kompromet qilingan akkaunt uchun barcha session'larni bekor qilish va dalilni saqlash misoli:

```ts run
type Session = { id: string; user: string; createdAt: number; revoked: boolean };
const sessions = new Map<string, Session>([
  ["s1", { id: "s1", user: "dilnoza", createdAt: 1019, revoked: false }],
  ["s2", { id: "s2", user: "dilnoza", createdAt: 900, revoked: false }],
  ["s3", { id: "s3", user: "aziz", createdAt: 950, revoked: false }],
]);
const evidence: string[] = [];

function containUser(user: string, now: number): number {
  let n = 0;
  for (const s of sessions.values()) {
    if (s.user !== user || s.revoked) continue;
    evidence.push(`${now} revoke ${s.id} (yaratilgan ${s.createdAt})`); // o'chirmaymiz, belgilaymiz
    s.revoked = true;
    n++;
  }
  return n;
}

console.log("bekor qilindi:", containUser("dilnoza", 1100));
console.log("aziz session'i:", sessions.get("s3")!.revoked);
console.log("dalil:", evidence.join(" | "));
```

```text
bekor qilindi: 2
aziz session'i: false
dalil: 1100 revoke s1 (yaratilgan 1019) | 1100 revoke s2 (yaratilgan 900)
```

## Qachon qo'llamaslik kerak

Katta korporativ IR jarayoni (alohida CSIRT, ko'p bosqichli eskalatsiya, rasmiy hujjatlar to'plami) uch kishilik jamoa uchun ortiqcha. Bunday jamoa uchun bir sahifali playbook yetarli: kim chaqiriladi, loglar qayerda, session va kalitlarni qanday bekor qilish, mijozga kim xabar beradi. Muhimi uni oldindan yozish va yiliga kamida bir marta mashq qilish.

Har anomaliyani incident deb e'lon qilish ham zarar: "alarm fog" jamoani charchatadi. Incident chegarasini oldindan belgilang (masalan, tasdiqlangan ruxsatsiz kirish yoki ma'lumot sizishi) va qolganini oddiy nosozlik sifatida ko'ring.

Avtomatik cheklash (masalan, shubhali akkauntni o'zi bloklash) soxta ijobiy natijalarda haqiqiy foydalanuvchiga zarar beradi va hujumchi buni o'z foydasiga ishlatishi mumkin (ko'plab akkauntni ataylab blokirovkaga tushirish). Avtomatika qayta tiklanadigan, past zararli choralar (qo'shimcha tasdiq so'rash) bilan cheklansin.

Va nihoyat, bu dars yuridik maslahat emas: ma'lumot sizishi haqida regulyatorga yoki sub'ektlarga xabar berish majburiyatlari qonunga bog'liq; O'zbekiston bo'yicha ularni 94-darsda ko'ramiz va aniq muddatlar uchun yurist bilan maslahatlashing.

## Stack'da: NestJS va Redis

NestJS'da auth hodisalari bitta servis orqali yoziladi (interceptor yoki guard ichidan emas, bir joyga to'plangan holda), har so'rovga `requestId` beriladi va u log, javob header'i va xato javobiga qo'shiladi, shunda mijoz xabari log bilan bog'lanadi. Session'lar Redis'da bo'lsa, foydalanuvchi bo'yicha bekor qilish uchun `user:{id}:sessions` kabi indeks kerak, aks holda "dilnoza'ning hamma session'ini bekor qil" amali bajarilmaydi (46-dars). Log yig'uvchi tizim (tashqi yoki ichki) ilova serveridan alohida bo'lishi kerak, shunda server buzilsa ham log'ni o'zgartirib bo'lmaydi. Quyidagi parcha ma'lumotlarni log'ga chiqarishdan oldin tozalash uchun Fastify/Pino sozlamasini ko'rsatadi (ishga tushirilmaydi: Pino brauzer worker'ida yo'q; sintaksis tekshirilgan):

```ts
import pino from "pino";

export const logger = pino({
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.token"],
    censor: "[REDACTED]",
  },
});

logger.info({ event: "login_failed", user: "aziz", tenant: "alfa", reqId: "r1" }, "auth");
```

## Xulosa

- Hodisa muqarrar, shuning uchun tayyorgarlik oldindan: rollar, aloqa, log joyi, sessiya va kalitlarni bekor qilish mexanizmi.
- NIST SP 800-61 Rev. 3 (2025-yil aprel) incident response'ni CSF 2.0 doirasidagi risk boshqaruviga kiritadi; bosqichlar: tayyorgarlik, aniqlash, cheklash, tiklash, xulosa (kursning ishchi modeli).
- Log har hodisada qachon, kim, qayerdan, nima va natijani saqlasin; parol, token, session qiymati, connection string va boshqa sirlar yozilmasin.
- Aniqlash qoidalari oddiy va tushunarli bo'lsin, lekin ularning qoldiq riskini biling (bitta IP qoidasi taqsimlangan hujumni ko'rmaydi).
- Cheklash dalilni yo'qotmasin: session'lar o'chirilmaydi, bekor qilingan deb belgilanadi, loglar saqlanadi.
- Hodisadan keyin ayb emas, tizim sabablarini qidiruvchi review o'tkazing va vazifalarni egasi va muddati bilan yozing.
