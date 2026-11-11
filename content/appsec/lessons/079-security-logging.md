---
n: 79
slug: security-logging
title: "Security logging, audit log va alerting"
summary: "Log nega xavfsizlik nazorati: qaysi hodisalarni yozish, har yozuvda kim, qachon, qayerda va nima bo'lgani, nimani hech qachon yozmaslik, log injection va structured log, audit trail yaxlitligi (hash zanjiri), alerting chegaralari, honeytoken va hodisaga javob rejasi bilan bog'lanish."
duration: 40
sources:
  - id: cs-logging
    note: "Logging Cheat Sheet: qaysi hodisalarni loglash, 'qachon, qayerda, kim, nima' atributlari, interaksiya identifikatori, loglanmaydigan ma'lumotlar, log injection (unstructured format xavfi, structured JSON, qiymat hajmini cheklash), logni himoyalash (tamper detection, ruxsatlarni cheklash), monitoring"
  - id: t10-a09
    note: "A09:2025 Security Logging and Alerting Failures: nomdagi 'Alerting' urg'usi; kategoriya belgilari (muvaffaqiyatsiz kirishni yozmaslik, log yaxlitligi, monitoring yo'qligi, alert chegaralari yo'qligi, PII loglash, log injection); oldini olish (audit trail va append-only, fail closed, honeytoken, SOC playbook, incident response rejasi)"
  - id: cs-logging-vocab
    note: "Logging Vocabulary Cheat Sheet: xavfsizlik hodisalari uchun standart nomlar (`authn_login_fail`, `authz_fail`, `input_validation_fail` kabi), shunda monitoring va alert shu nomlar bo'yicha ishlaydi; sanalar ISO 8601 formatida UTC siljishi bilan"
  - id: nist-61r3
    note: "NIST SP 800-61 Rev. 3 (2025 yil aprel): Rev. 2 ning o'rnini bosgan hodisaga javob tavsiyalari, NIST Cybersecurity Framework 2.0 uchun community profile. A09 ham NIST 800-61r2 yoki undan keyingi reja tavsiya qiladi"
  - id: nestjs-logger
    note: "NestJS Logger hujjati: `ConsoleLogger` da `json: true` (har yozuv bitta qator, `JSON.stringify()` bilan), xabardan keyingi obyektlar `params` ostida (NestJS v12), `maxStringLength` json rejimida e'tiborga olinmaydi, `logger: ['error', 'warn']` darajalari"
  - id: pg-grant
    note: "PostgreSQL GRANT: ega standart bo'yicha barcha huquqlarga ega; obyektni o'zgartirish yoki o'chirish huquqi egaga xos va berilmaydi, olinmaydi; ega o'z huquqlarini bekor qilishi mumkin; `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE` alohida huquqlar"
  - id: pg-privileges
    note: "PostgreSQL Privileges: jadvallar uchun PUBLIC'ga standart huquq berilmaydi; `TRUNCATE` alohida huquq"
quiz:
  - q: "Ilova login xatosini `INFO login fail user=${username}` shaklida matn sifatida yozadi. Hujumchi foydalanuvchi nomi sifatida `x\\n10:00:01 INFO login ok user=admin` yubordi. Qanday himoya asosiy?"
    options:
      - "Structured (JSON) formatga o'tish, qiymat hajmini cheklash: JSON seriyalash yangi qator belgisini qochiradi va soxta yozuv paydo bo'lmaydi"
      - "Log faylini boshqa diskka ko'chirish"
      - "Foydalanuvchi nomini hech qachon yozmaslik"
      - "Loglarni faqat ERROR darajasida yozish"
    answer: 0
    explain: "Logging Cheat Sheet unstructured matn formatlari CR/LF orqali log injection'ga moyil ekanini, structured format (JSON) ishlatishni va log xabari uchun foydalanuvchi qiymati hajmini cheklashni aytadi."
  - q: "Quyidagilardan qaysi biri A09:2025 bo'yicha 'log yetarli emas' belgisi?"
    options:
      - "Log JSON formatida"
      - "Loglar markaziy joyga yuboriladi"
      - "Faqat muvaffaqiyatli loginlar yoziladi, muvaffaqiyatsizlari yozilmaydi"
      - "Har yozuvda interaksiya identifikatori bor"
    answer: 2
    explain: "A09 'masalan, faqat muvaffaqiyatli loginlarni yozish, urinishlarni emas' ni aniq misol qilib keltiradi. Muvaffaqiyatsiz urinishlar credential stuffing va brute force'ning asosiy ko'rsatkichi."
  - q: "Logga qaysi ma'lumotni to'g'ridan-to'g'ri yozish mumkin emas (maskalash, hash yoki olib tashlash kerak)?"
    options:
      - "Hodisa turi va natija (success/fail)"
      - "Vaqt va servis nomi"
      - "Tenant identifikatori"
      - "Access token, parol, sessiya identifikatori va ma'lumotlar bazasiga ulanish satri"
    answer: 3
    explain: "Logging Cheat Sheet 'Data to exclude' ro'yxatida access token, autentifikatsiya paroli, sessiya identifikatsiyasi qiymatlari, ulanish satrlari, kalitlar va maxfiy shaxsiy ma'lumotlar bor: ularni olib tashlash, maskalash, hash yoki shifrlash kerak."
  - q: "Audit logda har yozuv oldingi yozuvning hash'iga bog'langan (hash zanjiri). Tajovuzkor o'rtadagi bitta yozuvni o'zgartirdi. Nima bo'ladi? Zanjirning cheklovi nima?"
    options:
      - "Hech narsa aniqlanmaydi"
      - "Tekshiruv o'zgargan yozuvdan boshlab zanjir uzilganini topadi. Cheklov: oxirgi yozuvlarni o'chirish yoki butun zanjirni qayta hisoblash, agar oxirgi hash tashqarida saqlanmasa, aniqlanmasligi mumkin"
      - "Zanjir buzilmaslikni kafolatlaydi, hech qanday cheklov yo'q"
      - "Faqat shifrlash aniqlaydi"
    answer: 1
    explain: "Hash zanjiri o'zgartirishni aniqlaydi (tamper detection), lekin o'zi yozishdan himoya qilmaydi. Oxirgi hash'ni alohida joyga (read-only yoki boshqa tizim) nusxalash va yozuv huquqlarini cheklash kerak. Cheat sheet ham read-only nusxa va ruxsatlarni cheklashni aytadi."
  - q: "Ma'lumotlar bazasida hech qachon ishlatilmaydigan 'honeytoken' foydalanuvchi yozuvi yaratildi. Nima uchun foydali?"
    options:
      - "Ma'lumotlar bazasini tezlashtiradi"
      - "Foydalanuvchilar sonini oshirib ko'rsatadi"
      - "Oddiy biznesda ishlatilmagani uchun unga har qanday murojaat shubhali va deyarli noto'g'ri signalsiz alert beradi"
      - "Shifrlashni almashtiradi"
    answer: 2
    explain: "A09 honeytoken'larni tuzoq sifatida tavsiya qiladi: ular normal faoliyatda ishlatilmaydi, shuning uchun ularga har qanday kirish alert uchun deyarli noto'g'ri musbatsiz log hosil qiladi."
  - q: "Loglar yig'ilyapti, lekin hech kim ularni ko'rmaydi va alert chegarasi yo'q. A09 buni qanday baholaydi?"
    options:
      - "Muammo yo'q: loglar saqlanyapti"
      - "Bu A09 bo'yicha kamchilik: alert chegaralari va eskalatsiya jarayonlari bo'lmasa yoki alertlar o'z vaqtida ko'rilmasa, hujum real vaqtda aniqlanmaydi; kategoriya nomiga 'Alerting' aynan shu uchun qo'shilgan"
      - "Faqat shifrlash kerak"
      - "Faqat log hajmini kamaytirish kerak"
    answer: 1
    explain: "A09:2025 nomi alerting funksiyasini ta'kidlash uchun o'zgargan va 'chegaralar va eskalatsiya jarayonlari yo'q yoki samarasiz' holatni belgi sifatida sanaydi."
task:
  title: "Muvaffaqiyatsiz kirishlar bo'yicha alert"
  prompt: |
    `alerts(events, limit, windowSec)` login hodisalaridan brute force alerti beradigan foydalanuvchilarni qaytaradi.

    Qoida: foydalanuvchi uchun `result === "fail"` hodisalarini vaqt bo'yicha saralang. Agar ketma-ket `limit` ta muvaffaqiyatsiz hodisaning birinchi va oxirgisi orasidagi farq `windowSec` dan **kichik** bo'lsa (`oxirgi.ts - birinchi.ts < windowSec`), foydalanuvchi alert oladi. Muvaffaqiyatli kirishlar sanalmaydi. Natija: alert olgan foydalanuvchilarning alifbo tartibidagi massivi, har biri bir marta.

    Hozirgi kod vaqtni hisobga olmaydi: umumiy xatolar sonini sanaydi, shuning uchun sekin, uzoq vaqtga yoyilgan urinishlar ham alert beradi.

    Kutilgan natija: `["bob","mallory"]`.
  lang: ts
  starter: |
    type Ev = { ts: number; user: string; result: "ok" | "fail" };

    function alerts(events: Ev[], limit: number, windowSec: number): string[] {
      const counts: Record<string, number> = {};
      for (const e of events) {
        if (e.result === "fail") counts[e.user] = (counts[e.user] ?? 0) + 1;
      }
      return Object.keys(counts).filter((u) => counts[u] >= limit).sort();
    }

    const events: Ev[] = [];
    for (const t of [0, 10, 20, 30, 40]) events.push({ ts: t, user: "bob", result: "fail" });
    for (const t of [0, 100, 200, 300, 400]) events.push({ ts: t, user: "eve", result: "fail" });
    for (const t of [0, 2, 4, 6]) events.push({ ts: t, user: "ana", result: "fail" });
    for (const t of [0, 15, 30, 45, 59]) events.push({ ts: t, user: "mallory", result: "fail" });
    events.push({ ts: 20, user: "ana", result: "ok" });
    for (const t of [0, 20, 40, 60, 80]) events.push({ ts: t, user: "dan", result: "fail" });
    console.log(JSON.stringify(alerts(events, 5, 60)));
  solution: |
    type Ev = { ts: number; user: string; result: "ok" | "fail" };

    function alerts(events: Ev[], limit: number, windowSec: number): string[] {
      const byUser: Record<string, number[]> = {};
      for (const e of events) {
        if (e.result === "fail") (byUser[e.user] ??= []).push(e.ts);
      }
      const out: string[] = [];
      for (const user of Object.keys(byUser).sort()) {
        const ts = byUser[user].sort((a, b) => a - b);
        for (let i = 0; i + limit - 1 < ts.length; i++) {
          if (ts[i + limit - 1] - ts[i] < windowSec) {
            out.push(user);
            break;
          }
        }
      }
      return out;
    }

    const events: Ev[] = [];
    for (const t of [0, 10, 20, 30, 40]) events.push({ ts: t, user: "bob", result: "fail" });
    for (const t of [0, 100, 200, 300, 400]) events.push({ ts: t, user: "eve", result: "fail" });
    for (const t of [0, 2, 4, 6]) events.push({ ts: t, user: "ana", result: "fail" });
    for (const t of [0, 15, 30, 45, 59]) events.push({ ts: t, user: "mallory", result: "fail" });
    events.push({ ts: 20, user: "ana", result: "ok" });
    for (const t of [0, 20, 40, 60, 80]) events.push({ ts: t, user: "dan", result: "fail" });
    console.log(JSON.stringify(alerts(events, 5, 60)));
  solutionNotes: |
    - `dan` ning beshta xatosi 80 soniyaga yoyilgan (oxirgi - birinchi = 80), shuning uchun 60 soniyalik oynaga sig'maydi va alert yo'q. `mallory` da farq 59 < 60, alert bor. Chegara qiymati (`<` va `<=`) muhim: u aniq hujjatlashtirilishi kerak.
    - Bu foydalanuvchi bo'yicha sanash. Haqiqiy brute force va password spraying'da bitta IP ko'p foydalanuvchiga urinadi; shuning uchun IP bo'yicha va foydalanuvchi bo'yicha alertlar alohida kerak (43-dars).
    - Alert chegarasi (5 ta, 60 soniya) o'quv qiymati. Chegaralar yuklama va xavfga qarab sozlanadi, aks holda "alarm fog" (shovqin) paydo bo'ladi.
    - Alert faqat birinchi qadam: kimga yuboriladi, kim javob beradi va nima qilinadi, ya'ni playbook ham bo'lishi kerak.
    - Funksiya hodisalarning ishonchli ekanini faraz qiladi. Hodisalar log injection orqali soxtalashtirilishi mumkin bo'lsa, alert ham ishonchsiz bo'ladi.
  checklist:
    - "Muvaffaqiyatli kirishlar sanalmaydi"
    - "Vaqt oynasi (oxirgi - birinchi < windowSec) hisobga olinadi"
    - "Sekin yoyilgan urinishlar (eve, dan) alert bermaydi"
    - "Natija alifbo tartibida va takrorsiz"
    - "Chegaralar qanday sozlanishi va nima uchun shovqin xavfi borligini tushuntira olasiz"
---

## Muammo

Avtopark platformasida kimdir bir tenant'ning mashina ma'lumotlarini eksport qildi. Bu qachon, kim tomonidan va qaysi hisob orqali sodir bo'lganini aniqlash kerak. Agar tizim muhim hodisalarni yozmagan bo'lsa, javob yo'q. Agar yozgan bo'lsa-yu, hech kim ularni ko'rmagan bo'lsa, javob keyin keladi: hujum tugagach, boshqa odam xabar bergandan keyin.

OWASP Top 10:2025 bu holatni A09, Security Logging and Alerting Failures deb ataydi. Kategoriya 9-o'rinda saqlanib qolgan, nomi esa alerting funksiyasini ta'kidlash uchun biroz o'zgargan: loglash faqat yozish emas, tegishli hodisalar harakatga undashi kerak. Matnga ko'ra, bu kategoriya testlash juda qiyin va CVE ma'lumotlarida kam vakil qilingan, lekin ko'rinish (visibility), hodisa haqida ogohlantirish va forensika uchun juda katta ta'sir qiladi. Unga kiruvchi muammolar: log fayllariga chiqarishda kodlashni noto'g'ri bajarish (CWE-117), log fayllariga maxfiy ma'lumot kiritish (CWE-532) va yetarli darajada loglamaslik (CWE-778).

Matn "yetarli emas" holatlarini sanaydi. Eng muhimlari: audit qilinadigan hodisalar (loginlar, muvaffaqiyatsiz loginlar, yuqori qiymatli tranzaksiyalar) yozilmaydi yoki izchil yozilmaydi (masalan faqat muvaffaqiyatli loginlar yoziladi, urinishlar yozilmaydi); ogohlantirish va xatolar yetarli yoki tushunarli xabar bermaydi; loglar yaxlitligi o'zgartirishdan himoyalanmagan; ilova va API loglari shubhali faoliyat uchun kuzatilmaydi; loglar faqat lokal saqlanadi va zaxiralanmaydi; alert chegaralari va eskalatsiya jarayonlari yo'q yoki samarasiz; penetration test va DAST skanerlari alert chiqarmaydi; loglar o'zi maxfiy ma'lumot oqib chiqadigan manbaga aylangan yoki kodlanmagani uchun injection'ga ochiq.

A09 ssenariylaridan biri ahamiyatli: bolalar sog'liqni saqlash rejasi provayderi veb-saytida monitoring va logging yo'qligi sababli buzilishni aniqlay olmagan; tashqi tomon xabar bergan, hujumchi 3,5 milliondan ortiq bola ro'yxatidagi minglab maxfiy sog'liq yozuvlariga kirgan va ularni o'zgartirgan, buzilish 2013 yildan beri, ya'ni yetti yildan ortiq davom etgan bo'lishi mumkin edi. Logsiz tizimda "hujum bo'lmadi" va "hujumni ko'rmadik" ning farqini bilib bo'lmaydi.

## Asosiy g'oya

### Loglash: ikki xil maqsad

Logging Cheat Sheet loglarni ikki toifada ko'radi: operatsion (xatolarni topish, ishlashni kuzatish) va xavfsizlik (hujumni aniqlash, hodisani tergov qilish, audit). Bu dars xavfsizlik tomonini ko'radi. Cheat sheet jarayon monitoringi, audit va tranzaksiya izlari odatda xavfsizlik hodisalaridan boshqa maqsadda yig'ilishini va shuning uchun ko'pincha alohida saqlanishini ham aytadi. Cheat sheet "bir o'lchamga hamma mos" yechim yo'qligini va ko'r-ko'rona ro'yxat yondashuvi keraksiz "alarm fog" ga olib kelib, haqiqiy muammolarni yashirishini aytadi. Nimani yozishni loyihalash bosqichida xavf darajasiga qarab belgilash kerak.

### Nimani yozish

Cheat sheet "imkon qadar doim yozing" ro'yxatini beradi. Avtopark platformasiga moslab:

- Kirish validatsiyasi xatolari (72-dars). Cheat sheet bularni shubhali hodisa deb hisoblashni, lekin hujum isboti deb emas, chunki kutilmagan kirish noto'g'ri foydalanish yoki mijoz xatosidan ham bo'lishi mumkinligini ta'kidlaydi.
- Autentifikatsiya muvaffaqiyatlari va muvaffaqiyatsizliklari. Takroriy muvaffaqiyatsizliklar credential stuffing, brute force va password spraying kabi hujumlarning erta belgisi (43-dars).
- Avtorizatsiya (kirish nazorati) muvaffaqiyatsizliklari: masalan, "beta" foydalanuvchisi "alfa" mashinasiga murojaat qildi (52 va 55-darslar).
- Sessiya boshqaruvi xatolari va shubhali token tekshiruvi xatolari (46 va 47-darslar).
- Ilova xatolari va tizim hodisalari: ishga tushish/to'xtash, konfiguratsiya o'zgarishi, uchinchi tomon xizmat xatolari (78-dars), fayl yuklashda antivirus topilmalari (74-dars).
- Yuqori xavfli funksiyalardan foydalanish: foydalanuvchilarni boshqarish, huquq o'zgartirish, administrator harakatlari, maxfiy ma'lumotlarga kirish, kalit rotatsiyasi, ma'lumot import va eksporti, deserializatsiya xatolari, TLS xatolari.
- Shubhali biznes logikasi: qadamlar ketma-ketligini buzishga urinish, ma'nosiz harakatlar, limitdan oshishga urinish (59 va 73-darslar).

A09 qo'shimcha talab: xavfsizlik nazorati bo'lgan ilovaning har bir qismi, muvaffaqiyatli yoki yo'qligidan qat'i nazar, yozilishi kerak. Faqat muvaffaqiyatsizlikni yozish kam, faqat muvaffaqiyatni yozish ham.

### Har yozuvda nima bo'lishi kerak

Cheat sheet: log yozuvi "qachon, qayerda, kim va nima" ga javob berishi kerak. Qachon: log vaqti, hodisa vaqti va interaksiya identifikatori. Qayerda: ilova nomi/versiyasi, xost, servis, URL va HTTP metod, kod joyi. Kim: manba manzili, autentifikatsiyalangan foydalanuvchi identifikatori. Nima: hodisa turi, jiddiylik darajasi, xavfsizlikka oid ekanini bildiruvchi belgi, tavsif. Qo'shimcha foydali maydonlar: harakat, obyekt, natija holati (success/fail/defer), sabab, foydalanuvchi turi (oddiy foydalanuvchi, monitoring tizimi, pentester).

Hodisa nomlarini har jamoa o'ylab topmasligi uchun Logging Vocabulary Cheat Sheet standart nomlarni taklif qiladi: `authn_login_fail`, `authz_fail`, `input_validation_fail` va boshqalar. Maqsad: monitoring va alert shu nomlarga qarab ishlasin. U sanalarni ISO 8601 formatida, UTC siljishi bilan yozishni ham aytadi.

"Interaksiya identifikatori" bitta foydalanuvchi harakatiga tegishli barcha hodisalarni bog'laydi. Bu 78-darsdagi xato identifikatori bilan bir g'oya: mijoz umumiy xato javobida `e-17` ni ko'radi, siz esa logda shu identifikator bilan hamma bog'liq yozuvlarni topasiz.

### Nimani hech qachon yozmaslik

Cheat sheet "Data to exclude" bo'limida to'g'ridan-to'g'ri yozilmasligi kerak bo'lgan ma'lumotlarni sanaydi: ilova manba kodi, sessiya identifikatsiya qiymatlari (kerak bo'lsa hash bilan almashtirish), access token'lar, maxfiy shaxsiy ma'lumotlar, autentifikatsiya parollari, ma'lumotlar bazasiga ulanish satrlari, shifrlash kalitlari va boshqa asosiy sirlar, to'lov kartasi ma'lumotlari, logging tizimiga ruxsat etilganidan yuqori maxfiylikdagi ma'lumotlar. Ular olib tashlanishi, maskalanishi, tozalanishi, hash qilinishi yoki shifrlanishi kerak. Fayl yo'llari, ichki tarmoq nomlari va manzillari ham alohida ishlov talab qilishi mumkin. Shu bilan birga, "ishonchli" manbalardan (ichki tizimlar, monitoring, pentester) hodisalarni chiqarib tashlamaslik kerak; ularni belgi bilan ajratish mumkin.

Bu qoida 78-darsdagi qoldiq muammoga ham javob: xato xabari ulanish satrini o'z ichiga olsa, uni logga yozishdan oldin tozalash kerak.

## Chuqurroq: log o'zi hujum nishoni

### Log injection

Cheat sheet loglarni hujum nishoni sifatida ko'radi va log injection'ni birinchi o'ringa qo'yadi: ilova ishonchsiz ma'lumotni log xabariga qo'shsa, hujumchi CR/LF belgilari bilan butunlay boshqa foydalanuvchidan kelganday ko'ringan qo'shimcha yozuv hosil qila oladi. Himoya choralari: matnli (unstructured) formatdan voz kechish, chunki ko'p logging freymvorklarida u CR yoki LF orqali yozuv injection'iga moyil (ba'zi freymvorklar CRLF injection'ni zaiflik hisoblamaydi va tuzatmaydi); structured format, masalan JSON, ishlatish; log xabarini yaratishda ishlatiladigan foydalanuvchi qiymati hajmini cheklash. Java misolida cheat sheet satrlarni qo'shish o'rniga parametrli shablonni ishlatishni aytadi, lekin parametrli loglashning o'zi CR/LF injection'dan himoya qilmasligini ham qayd etadi: qiymatlarni to'g'ri qochiradigan structured encoder kerak.

Muhim: log injection faqat chiroyli ko'rinish masalasi emas. Alertlar va tergov loglarga ishonadi; soxta "login ok user=admin" yozuvi tergovchini adashtiradi yoki avtomatik qoidani aldaydi. A09 ham log ma'lumotlari to'g'ri kodlanmasa, logging va monitoring tizimlariga injection mumkinligini aytadi.

### Maxfiylik, yaxlitlik, mavjudlik, javobgarlik

Cheat sheet loglarga hujumlarni to'rt o'qda tasniflaydi.

- **Maxfiylik:** loglarda foydalanuvchilarning shaxsiy ma'lumotlari yoki parollar kabi texnik sirlar bo'lsa, hujumchi loglarni o'qib, keyingi hujum uchun ishlatadi. Log o'zi qiymatli ma'lumot manbai, shuning uchun uni o'qish huquqi cheklangan va davriy tekshiriladi.
- **Yaxlitlik:** kim nimani o'zgartira olishi masalasi. Cheat sheet misollari: o'qish huquqi bor hujumchi loglardan sirlarni oladi; hujumchi log platformasining zaif tomonlariga hujum qiladi, masalan syslog orqali payload yuborib out-of-bounds write chaqiradi. Saqlangan yozuvlar uchun himoya: o'zgartirilgan yoki o'chirilganini bilish uchun tamper detection, loglarni imkon qadar tez read-only vositaga nusxalash, loglarga har qanday kirishni yozish va kuzatish.
- **Mavjudlik:** hujumchi log fayllarini to'ldirib, boshqa tizim qismlari uchun disk joyini tugatadi (log va ma'lumotlar bazasi bir diskda bo'lsa) yoki keyingi loglar uchun joy qoldirmaydi; bitta yozuv bilan boshqa yozuvlarni yo'q qilishi yoki log kodining sekinligi orqali ilovani sekinlashtirishi mumkin. Chora: logni alohida bo'limga (partition) yozish, hajmni boshqarish, takroriy xatolarni statistikaga aylantirish (78-dars).
- **Javobgarlik:** hujumchi yozuvni to'xtatadi, yozuvni buzadi yoki noto'g'ri identifikatorni yozdirib o'z izini yashiradi.

A09 audit trail uchun alohida talab qo'yadi: barcha tranzaksiyalar audit izi bilan, uni o'zgartirish yoki o'chirishdan himoyalovchi yaxlitlik nazoratlari (masalan, append-only ma'lumotlar bazasi jadvallari) bilan birga bo'lsin. Bizning misolimizda shunday nazoratning bir ko'rinishi, hash zanjiri, sinab ko'riladi.

### Alerting va javob

A09 nomidagi "Alerting" sababi shu: log yig'ish alert bo'lmasa kam. Matn tavsiya qiladi: ilova yoki foydalanuvchilar o'zini shubhali tutsa, ogohlantirish bering; DevSecOps va xavfsizlik jamoalari monitoring va alert holatlarini (use case) hamda playbook'larni belgilab, SOC jamoasi tez aniqlashi va javob berishi uchun jarayon yarating. Pentest va DAST skanerlari alert bermasa, bu ham belgi.

Alert chegarasi sozlash masalasi. Juda past chegara shovqin (alarm fog) beradi va odamlar alertlarga e'tibor berishni to'xtatadi; juda yuqorisi hujumni o'tkazib yuboradi. Bizning topshiriqda oddiy qoida: 60 soniyada 5 ta muvaffaqiyatsiz login. Haqiqiy qoidalar foydalanuvchi, IP, tenant va hodisa turlari bo'yicha alohida bo'ladi va chegaralar kuzatilgan normal faoliyat asosida sozlanadi.

### Honeytoken

A09 yana bir aniq vosita tavsiya qiladi: honeytoken'lar, ya'ni ma'lumotlar bazasiga, ma'lumotlarga yoki haqiqiy/texnik foydalanuvchi identifikatori sifatida qo'yilgan tuzoqlar. Normal biznes ularni ishlatmaydi, shuning uchun ularga har qanday murojaat log hosil qiladi va deyarli noto'g'ri musbatsiz alert beradi. Misol: "alfa" tenant'ida `vehicle_id = 'v-trap-0'` mashinasi; unga so'rov faqat jadvalni to'liq skanerlayotgan yoki identifikatorlarni sanab chiqayotgan kishidan kelishi mumkin (52-dars).

### Hodisaga javob rejasi

A09 hodisaga javob va tiklanish rejasini (NIST 800-61r2 yoki undan keyingisi kabi) yaratishni va dasturchilarga ilovaga hujum qanday ko'rinishini o'rgatishni tavsiya qiladi. NIST SP 800-61 Rev. 3 (2025 yil aprel) Rev. 2 ning o'rnini bosgan va hodisaga javob tavsiyalarini NIST Cybersecurity Framework 2.0 doirasidagi risklarni boshqarishga kiritadi. Dasturchi uchun amaliy xulosa: alert kimga boradi, ularga qanday ma'lumot kerak (loglardagi yozuvlar shu uchun) va hodisa vaqtida qanday amallar bajariladi, oldindan belgilangan bo'lishi kerak.

## Misol: hodisalar logi

### 1. Zaif kod

Eng oddiy yondashuv: matn qatori, har qanday qiymat to'g'ridan-to'g'ri qo'shiladi.

```ts run
const file: string[] = []; // log fayli: har qator alohida yozuv

function write(text: string): void {
  for (const line of text.split("\n")) file.push(line); // fayl yangi qatordan qatorga ajratadi
}

// ZAIF: matn formati, hamma qiymat to'g'ridan-to'g'ri, parol ham yoziladi
function loginFailedWeak(user: string, ip: string, password: string): void {
  write(`2026-03-01T10:00:00Z WARN login fail user=${user} ip=${ip} password=${password}`);
}

loginFailedWeak("bob", "203.0.113.7", "Qwerty123");
loginFailedWeak("x\n2026-03-01T10:00:01Z INFO login ok user=admin ip=10.0.0.5", "203.0.113.9", "guess");

file.forEach((l, i) => console.log(`${i + 1}: ${l}`));
```

### 2. Hujum

Hujumchi login oynasiga foydalanuvchi nomi sifatida yangi qator belgisi va soxta log qatorini kiritadi. Fayl uni alohida yozuv deb saqlaydi. Parollar esa ochiq turibdi.

```text
1: 2026-03-01T10:00:00Z WARN login fail user=bob ip=203.0.113.7 password=Qwerty123
2: 2026-03-01T10:00:00Z WARN login fail user=x
3: 2026-03-01T10:00:01Z INFO login ok user=admin ip=10.0.0.5 ip=203.0.113.9 password=guess
```

Natijada logda "admin muvaffaqiyatli kirdi" degan soxta yozuv paydo bo'ldi (3-qator), real tergovchi yoki avtomatik qoida uni haqiqiy deb qabul qiladi. Haqiqiy hodisa esa 2-qatorda kesilgan holda qoldi. Birinchi va uchinchi qatorlarda parollar (`Qwerty123`, `guess`) ochiq turibdi.

### 3. Tuzatilgan kod

Structured JSON, maydonlar allowlist'i, qiymat hajmi cheklovi, maxfiy maydonlarni tashlab yuborish va hash zanjiri bilan tekshiriladigan audit izi. Hash uchun WebCrypto SHA-256 ishlatiladi.

```ts run
const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha256 = async (s: string) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));

const ALLOWED = ["ts", "event", "user", "ip", "result"]; // faqat shu maydonlar yoziladi
const MAX_LEN = 40;

function sanitize(raw: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of ALLOWED) {
    const v = raw[k];
    if (v === undefined) continue;
    out[k] = String(v).slice(0, MAX_LEN); // hajmni cheklash; parol, token kabi maydonlar allowlist'da yo'q
  }
  return out;
}

type Rec = { body: string; prev: string; hash: string };
const chain: Rec[] = [];

async function audit(raw: Record<string, unknown>): Promise<void> {
  const body = JSON.stringify(sanitize(raw)); // JSON yangi qator belgisini \n deb qochiradi
  const prev = chain.length ? chain[chain.length - 1].hash : "0".repeat(64);
  chain.push({ body, prev, hash: await sha256(prev + body) });
}

async function verify(c: Rec[]): Promise<number> {
  let prev = "0".repeat(64);
  for (let i = 0; i < c.length; i++) {
    if (c[i].prev !== prev || c[i].hash !== (await sha256(prev + c[i].body))) return i;
    prev = c[i].hash;
  }
  return -1; // buzilish yo'q
}

await audit({ ts: "T1", event: "login", user: "bob", ip: "203.0.113.7", result: "fail", password: "Qwerty123" });
await audit({ ts: "T2", event: "login", user: "x\nT3 INFO login ok user=admin", ip: "203.0.113.9", result: "fail" });
await audit({ ts: "T4", event: "export", user: "u1", ip: "10.0.0.5", result: "ok" });

chain.forEach((r, i) => console.log(`${i + 1}: ${r.body}`));
console.log("parol logda:", chain.some((r) => r.body.includes("Qwerty123")));
console.log("zanjir tekshiruvi:", await verify(chain));

chain[1] = { ...chain[1], body: chain[1].body.replace("fail", "ok") }; // tajovuzkor yozuvni o'zgartirdi
console.log("o'zgartirilgandan keyin, birinchi buzilgan indeks:", await verify(chain));
```

```text
1: {"ts":"T1","event":"login","user":"bob","ip":"203.0.113.7","result":"fail"}
2: {"ts":"T2","event":"login","user":"x\nT3 INFO login ok user=admin","ip":"203.0.113.9","result":"fail"}
3: {"ts":"T4","event":"export","user":"u1","ip":"10.0.0.5","result":"ok"}
parol logda: false
zanjir tekshiruvi: -1
o'zgartirilgandan keyin, birinchi buzilgan indeks: 1
```

### Tuzatish nima uchun yetarli

Invariantlar: har hodisa aynan bitta qator (JSON yangi qatorni qochiradi), shuning uchun foydalanuvchi nomidagi soxta qator yozuv emas, shunchaki bitta maydonning matni; allowlist'da bo'lmagan maydonlar (parol) logga umuman tushmaydi; qiymat uzunligi cheklangan; yozuvni o'zgartirish keyingi tekshiruvda indeks bilan aniqlanadi.

Yopilmagan narsalar. Birinchisi: hash zanjiri o'zgartirishni aniqlaydi, lekin yozishni to'sib qo'ymaydi. Agar tajovuzkor zanjirning oxirgi yozuvlarini o'chirsa yoki butun zanjirni qayta hisoblasa, oxirgi hash tashqarida saqlanmagan bo'lsa buni bilib bo'lmaydi. Shuning uchun oxirgi hash'ni alohida joyga yoki read-only nusxaga yozish, ulanishda yozuv huquqini cheklash va append-only jadval kerak (A09, Logging Cheat Sheet). Ikkinchisi: allowlist faqat belgilangan maydonlarni saqlaydi, ularning ichidagi maxfiy ma'lumot (masalan, `user` maydoniga parol yozib yuborilgan) hamon o'tib ketadi; maydon mazmuni uchun alohida qoidalar kerak. Uchinchisi: bir jarayon ichidagi massiv real log emas; haqiqiy tizimda log markaziy joyga yuboriladi va u bilan aloqa himoyalanadi (cheat sheet transit uchun xavfsiz protokolni tavsiya qiladi). To'rtinchisi: cheat sheet log vaqti va hodisa vaqtini alohida yozishni va serverlarda vaqtni sinxronlashni aytadi; `ts` ni ishonchsiz mijoz soatidan olmang.

## Qachon qo'llamaslik kerak

- Hamma narsani yozish yaxshi emas. Cheat sheet ko'r-ko'rona ro'yxatlar "alarm fog" ga olib kelishini aytadi. Yuqori chastotali telemetriya (har soniya GPS nuqtalari) xavfsizlik logi emas; uni xavfsizlik hodisalari bilan aralashtirmang, aks holda signal shovqinda yo'qoladi.
- Shaxsiy ma'lumotni log uchun to'plash qonuniy cheklovlarga bog'liq. Cheat sheet qonuniy ruxsat etilmagan ma'lumotni umuman yozmaslikni aytadi. Mahalliy qonunchilik talablari 94-darsda ko'riladi.
- Hash zanjiri to'liq audit tizimi emas. Yuqori talabli sohalarda tashqi vaqt tamg'asi, WORM saqlash yoki alohida audit servisi kerak bo'lishi mumkin. Oddiy ilovada append-only jadval va ruxsatlarni cheklash ko'pincha yetarli.
- Alert har holatda ham odamni uyg'otmasligi kerak. Past xavfli hodisalar kunlik hisobotga, yuqori ishonchli hodisalar (honeytoken'ga murojaat) darhol ogohlantirishga boradi. Hamma alertni bir xil deb hisoblash odamlarni charchatadi.

## Stack'da: NestJS va Postgres

Hujjatga ko'ra `ConsoleLogger` `json: true` bilan yaratilsa, har yozuv bitta qatorda JSON bo'lib chiqadi (`level`, `pid`, `timestamp`, `message`, `context` maydonlari) va `JSON.stringify()` bilan seriyalanadi, ya'ni qiymatdagi yangi qator belgisi qochiriladi. Metadata (foydalanuvchi id, davomiylik) xabardan keyingi oddiy obyekt sifatida beriladi va JSON'da `params` kaliti ostiga tushadi (hujjatda bu imkoniyat NestJS v12 dan deb ko'rsatilgan). Cheklov: `maxStringLength` opsiyasi json rejimida (standart `colors` va `compact` bilan) e'tiborga olinmaydi, shuning uchun qiymat hajmini o'zingiz cheklaysiz; quyidagi `redact` shuni qiladi. Log darajalari `logger: ['error', 'warn']` kabi sozlanadi.

```ts
import { ConsoleLogger, Injectable, Module } from "@nestjs/common";

const SENSITIVE = /pass|token|secret|authorization|cookie/i;

function redact(meta: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (SENSITIVE.test(k)) continue; // maxfiy kalitli maydonlar umuman yozilmaydi
    out[k] = typeof v === "string" ? v.slice(0, 200) : v;
  }
  return out;
}

@Injectable()
export class SecurityLog {
  private readonly logger = new ConsoleLogger({ json: true });

  event(name: string, meta: Record<string, unknown>) {
    // structured: metadata alohida obyekt, matn qatoriga qo'shilmaydi (JSON'da `params`)
    this.logger.warn(name, redact(meta));
  }
}

@Module({ providers: [SecurityLog], exports: [SecurityLog] })
export class SecurityLogModule {}
```

`redact()` kalit nomiga qaraydi; qiymat ichidagi sirlarni (masalan, URL ichida parol) ushlamaydi, shuning uchun u to'liq himoya emas. Postgres tomonda audit jadvalini append-only qilishning bir usuli: ilova roliga faqat `GRANT INSERT, SELECT ON audit_events TO app_rw` berish va `UPDATE`, `DELETE`, `TRUNCATE` bermaslik (`TRUNCATE` alohida huquq, uni ham unutmang). Ikki shart bor. Birinchisi, jadval egasi ilovaning o'zi bo'lmasligi kerak: hujjatga ko'ra ega standart bo'yicha barcha huquqlarga ega, jadvalni o'zgartirish yoki o'chirish huquqi esa egaga xos bo'lib, berib ham, olib ham bo'lmaydi. Shuning uchun jadvalni migratsiya roli yaratadi va unga egalik qiladi, ilova roli faqat yuqoridagi ikki huquqni oladi. Ikkinchisi, jadvallarga PUBLIC orqali standart huquq berilmaydi, lekin qo'lda berilgan huquqlarni tekshirib turing. Cheat sheet ham logni bazaga yozishda faqat log yozish uchun ishlatiladigan, juda cheklangan huquqli alohida hisob ishlatishni tavsiya qiladi (huquqlar haqida 56 va 89-darslar).

## Xulosa

- Loglash va alert bir butun: A09 nomidagi "Alerting" shuni bildiradi. Loglar yig'ilsa-yu, chegara va javob jarayoni bo'lmasa, hujum aniqlanmaydi.
- Autentifikatsiya, avtorizatsiya va validatsiya xatolarini muvaffaqiyat bilan birga yozing; faqat muvaffaqiyatni yozish A09 belgisi. Har yozuvda qachon, qayerda, kim, nima va interaksiya identifikatori bo'lsin.
- Token, parol, sessiya qiymati, ulanish satri va kalitlarni logga yozmang: olib tashlang, maskalang yoki hash qiling.
- Log injection'dan structured (JSON) format, qiymat hajmini cheklash va maydonlar allowlist'i bilan himoyalaning; matn qatoriga foydalanuvchi qiymatini qo'shmang.
- Audit izi o'zgartirishdan himoyalangan bo'lsin: append-only, ruxsatlar, read-only nusxa, tamper detection; hash zanjirining oxirgi qiymatini tashqarida saqlang.
- Honeytoken kabi past shovqinli signallar va aniq playbook alertni foydali qiladi; chegaralarni normal faoliyatga qarab sozlang.
