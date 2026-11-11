---
n: 99
slug: case-avtopark-audit
title: "Case study: avtopark platformasining to'liq xavfsizlik auditi"
summary: "Kurs bo'ylab ishlatilgan neytral avtopark platformasining auditi uchun metodika: qamrov va ASVS darajasini tanlash, gibrid (hujjat va kod bilan) tekshiruv, probe majmuasi, topilmalarni ustuvorlash, hisobot tuzilishi va qayta tekshiruv. Barcha topilmalar o'quv modelida; real hodisa emas."
duration: 50
sources:
  - id: asvs
    note: "ASVS 5.0.0, 'Assessment and Certification' bo'limi: OWASP hech kimni sertifikatlamaydi; hisobot qamrov, tekshirilgan talablar, istisnolar va ularni hal qilish bo'yicha yo'riqnomani o'z ichiga olishi kerak; qo'llanilmaydigan talablar belgilanadi; avtomat asboblar murakkab talablarni (biznes mantiq, access control) to'liq tekshira olmaydi, 'testable using automation != running an off-the-shelf tool'; hujjat va kodga asoslangan gibrid tekshiruv tavsiya etiladi; L1 talablarning qariyb 20%, L2 qariyb 50% (L1+L2 qariyb 70%)"
  - id: wstg
    note: "WSTG: sinov toifalari (Authentication, Authorization, Session Management, Error Handling, Business Logic va h.k.) va Testing Framework bo'limida kod ko'rish, dinamik sinov va CI'dagi sinov faoliyatlari"
  - id: t10-risks
    note: "OWASP Top 10:2025 'What are Application Security Risks?': risk zanjiri threat agent, attack vector, exploitability, nazorat yetishmasligi ehtimoli, texnik va biznes ta'siri"
quiz:
  - q: "Auditorga 'faqat tashqi tomondan, hujjat va kodsiz' kirish berildi (black box). ASVS 5.0.0 'Assessment and Certification' bo'limiga ko'ra bu yondashuv haqida nima deyish to'g'ri?"
    options:
      - "Eng samarali usul"
      - "Faqat L3 uchun ishlatiladi"
      - "Qo'shimcha ma'lumotsiz sinash samarasiz: manba, tahdidlar va yetishmagan nazoratlarni ko'rish imkoni yo'qoladi; hujjat yoki kodga asoslangan gibrid tekshiruv tavsiya etiladi"
      - "ASVS testlashni umuman nazarda tutmaydi"
    answer: 2
    explain: "ASVS matni qo'shimcha axborotsiz sinashni samarasiz deb ataydi va dasturchilar hamda hujjatlarga to'liq kirish bilan gibrid tekshiruvni afzal ko'radi. L2 va L3 talablarini tekshirish uchun manba, konfiguratsiya va odamlar bilan suhbat kerak bo'ladi."
  - q: "Audit hisobotida faqat topilgan nuqsonlar ro'yxati bor. ASVS bo'yicha hisobotga yana nima kirishi kerak?"
    options:
      - "Qamrov, tekshirilgan talablar xulosasi, istisnolar va ularni hal qilish bo'yicha yo'riqnoma; qo'llanilmaydigan talablar belgilangan holda"
      - "Hech narsa: ro'yxat yetarli"
      - "Faqat auditor ismi"
      - "Faqat CVSS ballar"
    answer: 0
    explain: "ASVS an'anaviy pentest hisobotlarini 'faqat istisnolarni ko'rsatadi' deb ta'riflaydi va ASVS hisoboti qamrov, tekshirilgan talablar, istisnolar va tuzatish yo'riqnomasini o'z ichiga olishi kerakligini yozadi. Shu orqali o'quvchi nima tekshirilmaganini ham biladi."
  - q: "Probe majmuasi 7 tadan 7 tasi o'tdi. Xulosa qaysi biri to'g'ri?"
    options:
      - "Platforma xavfsiz"
      - "Audit tugadi, hisobotni yozmasa ham bo'ladi"
      - "Probe'lar noto'g'ri yozilgan"
      - "Faqat shu 7 ta xatti-harakat kutilganidek ishlaydi; qamrovdan tashqarisi, biznes mantiq va yangi turdagi nuqsonlar haqida bu natija hech narsa demaydi"
    answer: 3
    explain: "Avtomat probe'lar aniq belgilangan xatti-harakatni tekshiradi. ASVS matnidagi gap: avtomatlashtirilgan test degani tayyor asbobni ishga tushirish emas, ilovaga xos tekshiruvlar yozish; lekin ular ham qamrov bilan cheklangan."
  - q: "Topilmalar: A (ta'siri yuqori, ekspluatatsiyasi oson, tuzatish 1 soat), B (ta'siri yuqori, ekspluatatsiyasi qiyin, tuzatish 3 hafta), C (ta'siri past, oson, 10 daqiqa). Ustuvorlash tartibi qaysi?"
    options:
      - "C, B, A"
      - "A birinchi: yuqori ta'sir, oson ekspluatatsiya va arzon tuzatish; keyin C (arzon) va B (qimmat) qaror bilan"
      - "B birinchi: eng og'ir ko'rinadi"
      - "Alifbo tartibida"
    answer: 1
    explain: "OWASP riski ekspluatatsiya osonligi, nazorat yetishmasligi va ta'sirdan tuziladi; amalda tuzatish narxi ham hisobga olinadi. A uchala mezonda ustun. B alohida reja va vaqtincha kompensatsiya nazorati talab qilishi mumkin."
  - q: "Mass assignment topilmasi tuzatildi: `PATCH /me` endi `role` ni e'tiborsiz qoldiradi. Qayta tekshiruvda (retest) nimani tekshirish kerak?"
    options:
      - "Faqat `role` yuborilgan so'rovni"
      - "Hech narsa: dasturchi tuzatdi"
      - "Asl hujum kirishini (`role: admin`), shuningdek ruxsat etilgan maydonlar hanuz o'zgarishini va `tenant`, `id` kabi boshqa himoyalangan maydonlarni"
      - "Faqat kodni o'qish"
    answer: 2
    explain: "Retest asl hujumni takrorlaydi, regressiyani (ruxsat etilgan amal ishlashda qolishi) va yondosh holatlarni (boshqa himoyalangan maydonlar) tekshiradi. Aks holda bir maydonni yopib, boshqasi ochiq qoladi."
  - q: "Audit natijasi bo'yicha 'platformamiz ASVS L2 sertifikatiga ega' deb marketingda yozish mumkinmi?"
    options:
      - "Ha, agar auditor aytsa"
      - "Ha, OWASP sertifikat beradi"
      - "Faqat L1 uchun"
      - "Ehtiyot bo'ling: ASVS matniga ko'ra OWASP hech kimni sertifikatlamaydi va ASVS muvofiqligini da'vo qiluvchi uchinchi tomon belgilari OWASP tomonidan rasman tasdiqlanmagan; aniq qamrov va daraja bilan 'ASVS bo'yicha tekshirildi' deb yozish to'g'riroq"
    answer: 3
    explain: "Bu ASVS 'Assessment and Certification' bo'limidagi aniq pozitsiya. Marketing da'volari qamrov va metodika bilan bog'liq bo'lishi kerak."
task:
  title: "Topilmalarni ustuvorlash: ta'sir, osonlik va tuzatish narxi"
  prompt: |
    `rank(findings)` audit topilmalarini tuzatish tartibida qaytaradi. Hozirgi versiya faqat `impact` bo'yicha saralaydi.

    Har topilmada `exploitability`, `missingControl`, `impact` (har biri 1..3) va `effortHours` bor. Ustuvorlik balli: `(exploitability * missingControl * impact) / effortHours`. Katta ball birinchi. Ballar teng bo'lsa `id` alifbo tartibida. `effortHours <= 0` yoki 1..3 oralig'idan tashqari qiymatli topilma `RangeError` bilan rad etiladi. Natija id'lar massivi. Asl massiv o'zgarmasin. Imzoni o'zgartirmang. Oxirgi qatorlar kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    type Finding = { id: string; exploitability: number; missingControl: number; impact: number; effortHours: number };

    function rank(findings: Finding[]): string[] {
      return findings.sort((a, b) => b.impact - a.impact).map((f) => f.id);
    }

    const list: Finding[] = [
      { id: "F-idor", exploitability: 3, missingControl: 3, impact: 3, effortHours: 3 },
      { id: "F-token", exploitability: 3, missingControl: 2, impact: 3, effortHours: 6 },
      { id: "F-error", exploitability: 2, missingControl: 2, impact: 1, effortHours: 1 },
      { id: "F-lockout", exploitability: 3, missingControl: 3, impact: 2, effortHours: 3 },
      { id: "F-rls", exploitability: 1, missingControl: 2, impact: 3, effortHours: 80 },
    ];
    console.log("tartib:", rank(list).join(" > "));
    console.log("asl o'zgardimi:", list.map((f) => f.id).join(","));
    try {
      rank([{ id: "x", exploitability: 5, missingControl: 1, impact: 1, effortHours: 1 }]);
      console.log("noto'g'ri qiymat: qabul qilindi");
    } catch (e) {
      console.log("noto'g'ri qiymat:", (e as Error).name);
    }
  solution: |
    type Finding = { id: string; exploitability: number; missingControl: number; impact: number; effortHours: number };

    function rank(findings: Finding[]): string[] {
      const inScale = (n: number) => Number.isInteger(n) && n >= 1 && n <= 3;
      const scored = findings.map((f) => {
        if (!inScale(f.exploitability) || !inScale(f.missingControl) || !inScale(f.impact) || !(f.effortHours > 0)) {
          throw new RangeError(`noto'g'ri qiymat: ${f.id}`);
        }
        return { id: f.id, score: (f.exploitability * f.missingControl * f.impact) / f.effortHours };
      });
      scored.sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
      return scored.map((s) => s.id);
    }

    const list: Finding[] = [
      { id: "F-idor", exploitability: 3, missingControl: 3, impact: 3, effortHours: 3 },
      { id: "F-token", exploitability: 3, missingControl: 2, impact: 3, effortHours: 6 },
      { id: "F-error", exploitability: 2, missingControl: 2, impact: 1, effortHours: 1 },
      { id: "F-lockout", exploitability: 3, missingControl: 3, impact: 2, effortHours: 3 },
      { id: "F-rls", exploitability: 1, missingControl: 2, impact: 3, effortHours: 80 },
    ];
    console.log("tartib:", rank(list).join(" > "));
    console.log("asl o'zgardimi:", list.map((f) => f.id).join(","));
    try {
      rank([{ id: "x", exploitability: 5, missingControl: 1, impact: 1, effortHours: 1 }]);
      console.log("noto'g'ri qiymat: qabul qilindi");
    } catch (e) {
      console.log("noto'g'ri qiymat:", (e as Error).name);
    }
  solutionNotes: |
    - Ball OWASP risk zanjiridagi uch o'lchamni (ekspluatatsiya osonligi, nazorat yetishmasligi, ta'sir) tuzatish narxiga bo'ladi. Bu kursning ishchi formulasi, standart formulasi emas: maqsad tartib berish, aniq qiymat emas (1-dars: ballni solishtirish uchun emas, tartiblash uchun ishlating).
    - `sort` asl massivni o'zgartiradi; yechim avval `map` bilan yangi massiv yaratadi, shuning uchun kiruvchi ro'yxat o'zgarmaydi.
    - Teng ballda id bo'yicha tartiblash natijani takrorlanuvchi qiladi (hisobotlar orasida tartib sakramaydi).
    - Qoldiq risk: bo'luvchi sifatida narx kichik tuzatmalarni ko'tarib, katta, lekin muhim ishni (masalan RLS) pastga tushiradi. Shuning uchun yuqori ta'sirli, qimmat topilma uchun alohida reja va vaqtinchalik nazorat belgilanadi.
  checklist:
    - "Natija ball bo'yicha kamayish tartibida, teng ballda id bo'yicha"
    - "Kiruvchi massiv o'zgarmaydi"
    - "Shkaladan tashqari yoki nol narxli topilma `RangeError` beradi"
    - "Imzo o'zgarmagan"
    - "Formulaning cheklovini (qimmat, lekin muhim topilma) ayta olasiz"
---

## Muammo

Kursning oldingi 98 darsida biz xavfsizlikni bo'laklarga ajratib o'rgandik: injection, authorization, kriptografiya, supply chain. Haqiqiy ish esa bo'laklarda emas, butun tizimda boshlanadi. Audit buyurtma qilgan menejer "xavfsizmi?" deb so'raydi. Javob "ha" yoki "yo'q" emas, balki qamrov, metodika, topilmalar va ularning ustuvorligi. Ko'p jamoalarda audit xususiy rasm: skaner ishga tushiriladi, 80 betlik PDF chiqadi, hech kim uni o'qimaydi, topilmalarning yarmi "false positive", yarmi esa qaysi biri birinchi tuzatilishi noma'lum.

Bu dars to'liq auditning bitta ishlangan misolini beradi, kursda ishlatilgan neytral avtopark platformasi uchun. Hamma topilmalar o'quv modelida, real hodisa yoki real tizim emas; maqsad metodikani ko'rsatish: qamrovni belgilash, tekshirish, topilmalarni yozish, ustuvorlash, tuzatish va qayta tekshirish.

## Asosiy g'oya

### Qamrov va daraja

ASVS 5.0.0 ning "Assessment and Certification" bo'limi verifikatsiyani qanday yozish kerakligini ko'rsatadi: verifier qamrovni aniq belgilashi, qaysi darajaga (Level) intilish va qaysi talablar kiritilganini yozishi kerak, hamda kiritilmagan talablar uchun asosni bayon qilishi kerak. Darajalar: L1 talablarning qariyb 20 foizi, L2 qariyb 50 foizi (L2 ga muvofiqlik L1 va L2 ni, ya'ni qariyb 70 foizni bajarishni talab qiladi), L3 qolgan qismi; tashkilot o'z riskidan kelib chiqib darajani tanlaydi. Bizning platforma uchun maqsad ASVS L2 (mijoz tenant ma'lumoti va GPS izi bor), qamrov: web API, autentifikatsiya va session, avtorizatsiya, kirish validatsiyasi, xatolar va logging. Qamrovdan tashqarida: mobil ilova, ofis tarmog'i, uchinchi tomon cloud provayderi infratuzilmasi (ularning o'zi alohida audit).

### Metodika: gibrid tekshiruv

ASVS matni qo'shimcha ma'lumotsiz (hujjat va manbasiz) sinashni samarasiz mexanizm deb ataydi va dasturchilar hamda hujjatlarga to'liq kirish bilan hujjat yoki kodga asoslangan (gibrid) tekshiruvni tavsiya qiladi. Bizning audit shu bo'yicha: threat model (4-5-darslar), kod ko'rish (91-dars), konfiguratsiya ko'rish, dinamik sinov (92-dars). Avtomat asboblar haqida ASVS aniq: DAST va SAST to'g'ri sozlangan holda ayrim soddaroq talablarni (masalan output encoding) qoplashi mumkin, lekin biznes mantiq va access control bilan bog'liq murakkab talablarni to'liq tekshira olmaydi; murakkab talablar uchun ilovaga xos testlar yozish kerak, ya'ni avtomatlashtirilgan tekshirish degani tayyor asbobni ishga tushirish emas.

### Hisobot tuzilishi

ASVS an'anaviy pentest hisobotlari faqat nuqsonlarni (istisnolarni) ko'rsatishini, ASVS hisoboti esa qamrov, tekshirilgan barcha talablarning xulosasi, istisnolar va ularni hal qilish bo'yicha yo'riqnomani o'z ichiga olishi kerakligini yozadi; qo'llanilmaydigan talablar (masalan stateless API uchun session boshqaruvi) hisobotda ko'rsatiladi. Shu asosda hisobot skeleti: (1) qamrov va daraja, (2) metodika va foydalanilgan manbalar (WSTG versiyasi, ASVS 5.0.0), (3) topilmalar, har biri uchun: id, tavsif, qayta ishlab chiqarish, ta'sir, tuzatish, (4) tekshirilgan, lekin muammo topilmagan sohalar, (5) qo'llanilmaydigan talablar va asos, (6) qayta tekshiruv natijasi. Bundan tashqari ASVS: OWASP hech kimni, hech qanday dasturiy ta'minotni sertifikatlamaydi va ASVS muvofiqligini da'vo qiluvchi uchinchi tomon belgilari OWASP tomonidan rasman tasdiqlanmagan; shuning uchun marketing da'volarida qamrov va metodikani aniq yozish kerak.

## Chuqurroq: topilmalar va ustuvorlash

### Topilma qanday yoziladi

91-darsdagi qoida o'zgarmaydi: fayl va qator yoki endpoint, source -> sink, buzilgan xususiyat (CIA, 1-dars), WSTG toifasi, tuzatish va qoldiq risk. Qo'shimcha: dalil (so'rov va javob, hech qanday real sir yoki shaxsiy ma'lumotsiz) va qayta ishlab chiqarish qadamlari, shunda dasturchi topilmani o'zi takrorlay oladi.

### Ustuvorlash

OWASP Top 10:2025 risk sahifasi zanjirni ko'rsatadi: threat agent, attack vector, ekspluatatsiya osonligi (exploitability), nazorat yetishmasligi ehtimoli, texnik va biznes ta'siri. Ustuvorlash uchun shu o'lchamlarni ishlatamiz va tuzatish narxini qo'shamiz (kursning ishchi formulasi, mashqda ko'rasiz). Ikki ogohlantirish: ball tartib uchun, aniq qiymat uchun emas; va juda qimmat, lekin yuqori ta'sirli topilma (masalan DB darajasidagi izolyatsiya) ball bo'yicha pastga tushadi, uni formula emas, odam alohida rejaga qo'yadi.

OWASP risk sahifasi yana bir ogohlantirishni qo'shadi: reyting "universal" parametrlarga (ekspluatatsiya osonligi, nazorat yetishmasligining o'rtacha ehtimoli, texnik ta'sir) tayanadi, lekin har tashkilot noyob. Bir xil CMS jamoat axboroti uchun ham, sog'liq yozuvlari uchun ham ishlatilishi mumkin va tahdid agentlari bilan biznes ta'siri butunlay boshqacha bo'ladi. Shuning uchun bizning jadvaldagi `i` (ta'sir) bahosi umumiy qoida emas, platformaning o'z biznes ta'siri: tenant ma'lumoti va GPS izi bor avtoparkda IDOR yuqori ball oladi, ichki demo muhitida esa boshqacha bo'lardi.

### Dalil, takrorlanuvchanlik va ishonch

ASVS verifikatsiyani isbotlanadigan qilishni talab qiladi: har talab "verifiably tested" bo'lishi kerak, shuning uchun tayyor asbobni shunchaki ishga tushirish sertifikatsiya uchun yetarli emas. Dalil sifatida work paper'lar, skrinshotlar, skriptlar va test loglari saqlanadi, usullar hisobotda ochiq yoziladi va ideal holda takrorlanadi. Bizning probe majmuasi shu talabning tabiiy shakli: har topilma bitta ishga tushiriladigan tekshiruv bo'ladi, shuning uchun "tuzatildi" iborasi gap emas, qayta ishga tushirilgan natija bilan tasdiqlanadi. ASVS hisobotning maqsadini ham aytadi: o'quvchi tekshiruv kontekstini tushunib, ilovaga qancha ishonish mumkinligi haqida xabardor qaror qabul qila olishi kerak. Shuning uchun ham "nima kiritilgan" aniq yoziladi, "nima kiritilmagan" esa asos bilan.

### Qayta tekshiruv (retest) va yopish mezoni

Topilma "tuzatildi" holatiga o'tgani uni yopmaydi. Yopish mezoni uchta qismdan iborat. Birinchisi, asl hujum kirishi (masalan `role: admin` yuborilgan so'rov) endi rad etiladi. Ikkinchisi, regressiya: ruxsat etilgan xatti-harakat (o'z mashinasini ochish, `name` ni o'zgartirish) ishlashda davom etadi, aks holda tuzatish biznesni buzgan bo'ladi va ertaga orqaga qaytariladi. Uchinchisi, yondosh holatlar: bitta maydon yopilgan bo'lsa, boshqa himoyalangan maydonlar (`tenant`, `id`) ham tekshiriladi, chunki xato odatda bitta joyda emas, bir naqshda yashaydi. Tuzatish kodi ko'rib chiqilgandan keyin probe majmuasiga yangi probe qo'shiladi va u CI'da doimiy ishlaydi. Shunda topilma "bir marta tuzatildi" holatidan "qaytib kelsa darhol ko'rinadi" holatiga o'tadi.

### Odamlar va jarayon

Audit faqat texnik mashq emas. Hisobotni o'qiydigan odamlar uch xil: dasturchi (nima va qayerda), menejer (nima uchun va qachongacha) va mijoz yoki regulyator (nima tekshirildi va qanday asosda). Bitta hujjat uchalasiga xizmat qilishi uchun hisobot yuqorida qisqa xulosa, pastda texnik tafsilot beradi. Topilmaga egasi (owner) va muddat biriktirilmasa, u ro'yxatda abadiy qoladi. Qabul qilingan risk (accepted risk) ham shu tartibda rasmiylashtiriladi: kim qabul qildi, qachongacha, qanday vaqtinchalik nazorat bilan. Bu 95-darsdagi muddatli istisno bilan bir xil g'oya.

### Hisobotdagi qoldiq risk

Yaxshi hisobot oxirida nima tekshirilmaganini va qaysi taxminlarga tayanganini ochiq yozadi: probe'lar faqat o'quv modelida ishladi, haqiqiy muhitda tarmoq, ma'lumotlar bazasi va uchinchi tomon xizmatlari qamrovdan tashqarida, token generatsiyasi o'quv soddalashtirmasi. Bunday gaplar hisobotni zaiflashtirmaydi, aksincha, uni ishonchli qiladi: o'quvchi qaysi xulosaga qancha tayanishi mumkinligini biladi.

## Misol: platformani tekshirish

Platforma bu yerda xotiradagi sodda model: bitta `app(req)` funksiyasi. Probe majmuasi 92-darsdagi usulda yoziladi, lekin bu yerda butun platformaning asosiy sohalarini qamraydi. Hech qaysi real tizimga murojaat yo'q.

### 1. Zaif kod

```ts run
type Req = { method: string; path: string; token?: string; body?: Record<string, any> };
type Res = { status: number; body?: any };
type U = { id: string; tenant: string; role: string; pw: string };

function makeWeak() {
  const users = new Map<string, U>([
    ["u1", { id: "u1", tenant: "alfa", role: "user", pw: "pw1" }],
    ["u2", { id: "u2", tenant: "beta", role: "user", pw: "pw2" }],
    ["u3", { id: "u3", tenant: "alfa", role: "admin", pw: "pw3" }],
  ]);
  const vehicles = [{ id: "v1", tenant: "alfa" }, { id: "v2", tenant: "beta" }];
  return (req: Req): Res => {
    try {
      if (req.path === "/login") {
        const u = users.get(req.body?.user);
        // ZAIF: urinishlar cheklanmagan; token oldindan taxmin qilinadi ("t-" + id)
        return u && u.pw === req.body?.pw ? { status: 200, body: { token: "t-" + u.id } } : { status: 401 };
      }
      const me = req.token?.startsWith("t-") ? users.get(req.token.slice(2)) : undefined;
      if (!me) return { status: 401 };
      if (req.path === "/logout") return { status: 204 }; // ZAIF: token bekor qilinmaydi
      const m = req.path.match(/^\/vehicles\/(\w+)$/);
      if (m) { // ZAIF: tenant tekshirilmaydi
        const v = vehicles.find((x) => x.id === m[1]);
        return v ? { status: 200, body: v } : { status: 404 };
      }
      if (req.path === "/admin/users") return { status: 200, body: [...users.keys()] }; // ZAIF: rol tekshirilmaydi
      if (req.path === "/me" && req.method === "PATCH") {
        Object.assign(me, req.body); // ZAIF: mass assignment
        return { status: 200, body: { id: me.id, role: me.role } };
      }
      if (req.path === "/boom") throw new Error("pg: password authentication failed for user app_rw");
      return { status: 404 };
    } catch (e) {
      return { status: 500, body: { error: (e as Error).message } }; // ZAIF: ichki matn
    }
  };
}

type Probe = { id: string; name: string; run: (app: (r: Req) => Res) => boolean };
const probes: Probe[] = [
  { id: "P1", name: "login: 12 xato urinishdan keyin to'g'ri parol rad etiladi", run: (a) => {
      for (let i = 0; i < 12; i++) a({ method: "POST", path: "/login", body: { user: "u1", pw: "x" + i } });
      return a({ method: "POST", path: "/login", body: { user: "u1", pw: "pw1" } }).status !== 200; } },
  { id: "P2", name: "taxmin qilingan token (t-u3) qabul qilinmaydi", run: (a) => a({ method: "GET", path: "/admin/users", token: "t-u3" }).status === 401 },
  { id: "P3", name: "begona tenant mashinasi 404", run: (a) => a({ method: "GET", path: "/vehicles/v2", token: login(a, "u1", "pw1") }).status === 404 },
  { id: "P4", name: "oddiy user admin yo'liga 403 oladi", run: (a) => a({ method: "GET", path: "/admin/users", token: login(a, "u1", "pw1") }).status === 403 },
  { id: "P5", name: "PATCH /me rolni o'zgartirmaydi", run: (a) => a({ method: "PATCH", path: "/me", token: login(a, "u2", "pw2"), body: { role: "admin" } }).body?.role === "user" },
  { id: "P6", name: "xato javobida ichki matn yo'q", run: (a) => !JSON.stringify(a({ method: "GET", path: "/boom", token: login(a, "u1", "pw1") }).body ?? "").includes("password") },
  { id: "P7", name: "logoutdan keyin token yaroqsiz", run: (a) => { const t = login(a, "u3", "pw3"); a({ method: "POST", path: "/logout", token: t }); return a({ method: "GET", path: "/admin/users", token: t }).status === 401; } },
];
function login(a: (r: Req) => Res, user: string, pw: string): string {
  return a({ method: "POST", path: "/login", body: { user, pw } }).body?.token;
}
// Har probe uchun yangi platforma nusxasi: sinovlar bir-biriga ta'sir qilmaydi
for (const p of probes) console.log(`${p.run(makeWeak()) ? "PASS" : "FAIL"} ${p.id} ${p.name}`);
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu probe majmuasi faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Probe majmuasi hujumchi ko'zi bilan ettita oddiy so'rov ketma-ketligini bajaradi (login urinishlari, taxmin qilingan token, begona identifikator, admin yo'li, `role` maydoni, xatoni chaqirish, logoutdan keyin qayta foydalanish). Zaif platformada natija:

```text
FAIL P1 login: 12 xato urinishdan keyin to'g'ri parol rad etiladi
FAIL P2 taxmin qilingan token (t-u3) qabul qilinmaydi
FAIL P3 begona tenant mashinasi 404
FAIL P4 oddiy user admin yo'liga 403 oladi
FAIL P5 PATCH /me rolni o'zgartirmaydi
FAIL P6 xato javobida ichki matn yo'q
FAIL P7 logoutdan keyin token yaroqsiz
```

Ettalasi ham yiqildi. Har qator o'z darsiga bog'lanadi: P1 43-dars (brute force), P2 46 va 67-darslar (session va token generatsiyasi), P3 52 va 55-darslar (IDOR va tenant), P4 53-dars, P5 54-dars, P6 78-dars, P7 46-dars (sessiyani bekor qilish). Bu ro'yxat bo'sh joyni ko'rsatadi: o'zini yaxshi his qilgan jamoada ham bir vaqtning o'zida ettita bo'shliq bo'lishi mumkin va ular odatda alohida modullarda yashaydi.

### 3. Tuzatilgan kod

```ts run
type Req = { method: string; path: string; token?: string; body?: Record<string, any> };
type Res = { status: number; body?: any };
type U = { id: string; tenant: string; role: string; pw: string; name?: string };

function makeFixed() {
  const users = new Map<string, U>([
    ["u1", { id: "u1", tenant: "alfa", role: "user", pw: "pw1" }],
    ["u2", { id: "u2", tenant: "beta", role: "user", pw: "pw2" }],
    ["u3", { id: "u3", tenant: "alfa", role: "admin", pw: "pw3" }],
  ]);
  const vehicles = [{ id: "v1", tenant: "alfa" }, { id: "v2", tenant: "beta" }];
  const sessions = new Map<string, string>(); // opaque token -> userId
  const failures = new Map<string, number>();
  let counter = 0; // o'quv modeli: real kodda CSPRNG (67-dars)
  const newToken = () => "tk-" + ((++counter * 7919) % 65521).toString(16);
  const MAX_FAIL = 5;
  return (req: Req): Res => {
    try {
      if (req.path === "/login") {
        const id = String(req.body?.user);
        if ((failures.get(id) ?? 0) >= MAX_FAIL) return { status: 429 }; // to'g'ri parol ham rad etiladi
        const u = users.get(id);
        if (u && u.pw === req.body?.pw) {
          failures.delete(id);
          const t = newToken();
          sessions.set(t, u.id);
          return { status: 200, body: { token: t } };
        }
        failures.set(id, (failures.get(id) ?? 0) + 1);
        return { status: 401 };
      }
      const me = users.get(sessions.get(req.token ?? "") ?? "");
      if (!me) return { status: 401 };
      if (req.path === "/logout") { sessions.delete(req.token!); return { status: 204 }; }
      const m = req.path.match(/^\/vehicles\/(\w+)$/);
      if (m) {
        const v = vehicles.find((x) => x.id === m[1] && x.tenant === me.tenant);
        return v ? { status: 200, body: v } : { status: 404 };
      }
      if (req.path === "/admin/users") {
        if (me.role !== "admin") return { status: 403 };
        return { status: 200, body: [...users.values()].filter((u) => u.tenant === me.tenant).map((u) => u.id) };
      }
      if (req.path === "/me" && req.method === "PATCH") {
        if (typeof req.body?.name === "string") me.name = req.body.name; // allowlist: faqat name
        return { status: 200, body: { id: me.id, role: me.role } };
      }
      if (req.path === "/boom") throw new Error("pg: password authentication failed for user app_rw");
      return { status: 404 };
    } catch {
      return { status: 500, body: { error: "internal_error" } };
    }
  };
}

type Probe = { id: string; name: string; run: (app: (r: Req) => Res) => boolean };
function login(a: (r: Req) => Res, user: string, pw: string): string {
  return a({ method: "POST", path: "/login", body: { user, pw } }).body?.token;
}
const probes: Probe[] = [
  { id: "P1", name: "login: 12 xato urinishdan keyin to'g'ri parol rad etiladi", run: (a) => {
      for (let i = 0; i < 12; i++) a({ method: "POST", path: "/login", body: { user: "u1", pw: "x" + i } });
      return a({ method: "POST", path: "/login", body: { user: "u1", pw: "pw1" } }).status !== 200; } },
  { id: "P2", name: "taxmin qilingan token (t-u3) qabul qilinmaydi", run: (a) => a({ method: "GET", path: "/admin/users", token: "t-u3" }).status === 401 },
  { id: "P3", name: "begona tenant mashinasi 404", run: (a) => a({ method: "GET", path: "/vehicles/v2", token: login(a, "u1", "pw1") }).status === 404 },
  { id: "P4", name: "oddiy user admin yo'liga 403 oladi", run: (a) => a({ method: "GET", path: "/admin/users", token: login(a, "u1", "pw1") }).status === 403 },
  { id: "P5", name: "PATCH /me rolni o'zgartirmaydi", run: (a) => a({ method: "PATCH", path: "/me", token: login(a, "u2", "pw2"), body: { role: "admin" } }).body?.role === "user" },
  { id: "P6", name: "xato javobida ichki matn yo'q", run: (a) => !JSON.stringify(a({ method: "GET", path: "/boom", token: login(a, "u1", "pw1") }).body ?? "").includes("password") },
  { id: "P7", name: "logoutdan keyin token yaroqsiz", run: (a) => { const t = login(a, "u3", "pw3"); a({ method: "POST", path: "/logout", token: t }); return a({ method: "GET", path: "/admin/users", token: t }).status === 401; } },
  { id: "R1", name: "regressiya: o'z mashinasi ochiladi", run: (a) => a({ method: "GET", path: "/vehicles/v1", token: login(a, "u1", "pw1") }).status === 200 },
  { id: "R2", name: "regressiya: admin o'z tenant'ini ko'radi", run: (a) => JSON.stringify(a({ method: "GET", path: "/admin/users", token: login(a, "u3", "pw3") }).body) === '["u1","u3"]' },
  { id: "R3", name: "regressiya: ruxsat etilgan maydon o'zgaradi", run: (a) => a({ method: "PATCH", path: "/me", token: login(a, "u1", "pw1"), body: { name: "Aziz" } }).status === 200 },
];
for (const p of probes) console.log(`${p.run(makeFixed()) ? "PASS" : "FAIL"} ${p.id} ${p.name}`);
```

```text
PASS P1 login: 12 xato urinishdan keyin to'g'ri parol rad etiladi
PASS P2 taxmin qilingan token (t-u3) qabul qilinmaydi
PASS P3 begona tenant mashinasi 404
PASS P4 oddiy user admin yo'liga 403 oladi
PASS P5 PATCH /me rolni o'zgartirmaydi
PASS P6 xato javobida ichki matn yo'q
PASS P7 logoutdan keyin token yaroqsiz
PASS R1 regressiya: o'z mashinasi ochiladi
PASS R2 regressiya: admin o'z tenant'ini ko'radi
PASS R3 regressiya: ruxsat etilgan maydon o'zgaradi
```

Tuzatish nima uchun yetarli, ko'rsatilgan yettita xatti-harakat uchun: login urinishlari soni chegaralangan (to'g'ri parol ham 429 oladi), token ro'yxatda turgan opaque qiymat va logout uni o'chiradi, tenant sharti obyekt qidiruvida, rol sharti admin yo'lida, `PATCH /me` faqat allowlist'dagi maydonni yozadi, xato javobi umumiy. Uchta regressiya probe'i ruxsat etilgan amallar buzilmaganini tekshiradi. Yopilmagan narsa: `newToken` o'quv modelida taxmin qilib bo'ladigan ketma-ketlik (real kodda CSPRNG, 67-dars), lockout bu modelda vaqt bo'yicha tiklanmaydi va hisobni qulflash hujumchi uchun vosita bo'lishi mumkin (43-dars), probe'lar rate limitni, parol saqlashni, kriptografiyani va biznes mantiqni tekshirmaydi, qamrovdan tashqarisi bu natijada ko'rinmaydi.

### Ustuvorlash

Yetti topilma uchun tuzatish tartibini tuzamiz. Ballar bu o'quv misolidagi baholash (mualliflik), standart qiymati emas.

```ts run
type F = { id: string; name: string; e: number; m: number; i: number; hours: number };
const findings: F[] = [
  { id: "P1", name: "brute force himoyasi yo'q", e: 3, m: 3, i: 2, hours: 3 },
  { id: "P2", name: "taxmin qilinadigan token", e: 3, m: 3, i: 3, hours: 4 },
  { id: "P3", name: "tenant tekshiruvi yo'q (IDOR)", e: 3, m: 3, i: 3, hours: 3 },
  { id: "P4", name: "admin yo'lida rol tekshiruvi yo'q", e: 3, m: 3, i: 3, hours: 1 },
  { id: "P5", name: "mass assignment", e: 3, m: 2, i: 3, hours: 2 },
  { id: "P6", name: "xato matni oshkor", e: 2, m: 2, i: 1, hours: 1 },
  { id: "P7", name: "logout tokenni bekor qilmaydi", e: 2, m: 2, i: 2, hours: 3 },
];
const scored = findings
  .map((f) => ({ ...f, score: (f.e * f.m * f.i) / f.hours }))
  .sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1));
for (const f of scored) console.log(`${f.score.toFixed(1).padStart(5)}  ${f.id}  ${f.name}`);
```

```text
27.0  P4  admin yo'lida rol tekshiruvi yo'q
  9.0  P3  tenant tekshiruvi yo'q (IDOR)
  9.0  P5  mass assignment
  6.8  P2  taxmin qilinadigan token
  6.0  P1  brute force himoyasi yo'q
  4.0  P6  xato matni oshkor
  2.7  P7  logout tokenni bekor qilmaydi
```

Tartib mantiqli: arzon va og'ir topilmalar (P4, P3, P5) birinchi. Lekin ball bilan birga insoniy qaror kerak: P2 va P3 ballda yaqin, ammo ikkalasi ham mijoz ma'lumotiga to'g'ridan-to'g'ri yetadi, shuning uchun bir sprintda yopiladi. Bu jadval kelishuv uchun asos, buyruq emas.

### Mashq: ustuvorlash

Quyidagi funksiya topilmalarni faqat ta'sir bo'yicha saralaydi. Formulani qo'shing.

```ts run
type Finding = { id: string; exploitability: number; missingControl: number; impact: number; effortHours: number };

function rank(findings: Finding[]): string[] {
  return findings.sort((a, b) => b.impact - a.impact).map((f) => f.id);
}
```

```ts test
const mk = (id: string, e: number, m: number, i: number, h: number) => ({ id, exploitability: e, missingControl: m, impact: i, effortHours: h });
check("arzon va og'ir topilma birinchi", () => rank([mk("slow", 3, 3, 3, 30), mk("quick", 3, 3, 3, 3)]).join() === "quick,slow");
check("ball teng bo'lsa id bo'yicha", () => rank([mk("b", 2, 2, 2, 4), mk("a", 2, 2, 2, 4)]).join() === "a,b");
check("kiruvchi massiv o'zgarmaydi", () => { const l = [mk("x", 1, 1, 1, 1), mk("y", 3, 3, 3, 1)]; rank(l); return l[0].id === "x"; });
check("narx 0 bo'lsa RangeError", () => { try { rank([mk("z", 1, 1, 1, 0)]); return false; } catch (e) { return e instanceof RangeError; } });
check("shkaladan tashqari qiymat RangeError", () => { try { rank([mk("z", 4, 1, 1, 1)]); return false; } catch (e) { return e instanceof RangeError; } });
check("yuqori ta'sirli, lekin qimmat topilma pastroq", () => rank([mk("rls", 1, 2, 3, 80), mk("err", 2, 2, 1, 1)]).join() === "err,rls");
```

## Qachon qo'llamaslik kerak

Bu metodika kichik loyiha uchun ortiqcha bo'lishi mumkin. Uch endpoint'li ichki servisda qamrov, daraja va hisobot bir sahifaga sig'adi; to'liq ASVS L2 auditi unga o'z narxiga arzimaydi. Daraja riskka qarab tanlanadi: ASVS o'zi ham, erta bosqichdagi startap L1 ga e'tibor qaratishi mumkin, deb yozadi.

Probe majmuasi auditning o'zi emas. Ettita xatti-harakatni tekshiradigan kod ettita xatti-harakat haqida gapiradi. Biznes mantiq (59-dars), race condition (60-dars), kriptografiyani to'g'ri qo'llash va infratuzilma konfiguratsiyasi qo'lda va kod bilan ko'rishni talab qiladi.

Ball bo'yicha ustuvorlash hamma narsani hal qilmaydi: mijoz shartnomasi, regulyator talabi (94-dars) yoki hodisa (93-dars) ball formulasini bekor qiladi. Va nihoyat, ichki audit mustaqil audit emas: o'z kodini o'zi tekshirgan odam yuqori ishonch bermaydi. Mijozga ishonch kerak bo'lsa, tashqi tomon ham kerak (95-dars).

Yana bir holat: tez o'zgaradigan prototip. Har hafta arxitekturasi o'zgaradigan mahsulotda to'liq audit hisoboti eskirib qoladi; u yerda kichik, tez-tez takrorlanadigan tekshiruv (CI'dagi probe'lar, har relizdan oldin qisqa kod ko'rish) kamdan-kam o'tkaziladigan katta auditdan foydaliroq. To'liq audit esa barqaror bosqichda, yirik reliz yoki shartnoma oldidan mantiqli.

## Stack'da: auditni CI'ga qo'yish

Probe majmuasi NestJS'da `supertest` bilan e2e test sifatida, Next.js'da Playwright bilan yoziladi (92-dars) va har PR'da CI'da ishlaydi; topilma tuzatilgach, asl hujum kirishi shu testlarga qo'shiladi. Konfiguratsiya tekshiruvlari (rol huquqlari, TLS, secret'lar) 95-darsdagi kabi predikatlar bilan, kod ko'rish checklist'i (91-dars) PR shablonida. Har audit hisoboti saqlanadi va keyingi audit unga nisbatan o'lchanadi: nechta topilma yopilgan, nechta qaytib kelgan, qaysi toifada ko'p. Quyidagi parcha topilma holati modelini ko'rsatadi (ishga tushirilmaydi: tashqi saqlash yo'q; sintaksis tekshirilgan):

```ts
export type FindingStatus = "ochiq" | "tuzatilgan" | "qayta-tekshirilgan" | "qabul-qilingan-risk";

export interface AuditFinding {
  id: string;
  title: string;
  wstgCategory: string;       // masalan "Authorization"
  asvsChapter: string;        // masalan "V8 Authorization"
  status: FindingStatus;
  retestedAt?: string;        // ISO sana; "tuzatilgan" -> "qayta-tekshirilgan" o'tishi uchun shart
  acceptedRisk?: { owner: string; until: string; compensating: string };
}
```

## Xulosa

- Audit qamrov va darajadan boshlanadi: qaysi ASVS darajasi, qaysi talablar, nima qamrovdan tashqarida va nega. Qo'llanilmaydigan talablar hisobotda belgilanadi.
- ASVS gibrid tekshiruvni (hujjat, kod, konfiguratsiya, odamlar) tavsiya qiladi; avtomat asboblar murakkab access control va biznes mantiqni to'liq qoplamaydi, shuning uchun ilovaga xos testlar yoziladi.
- Probe majmuasi aniq kutilgan natijani tekshiradi va regressiya probe'larini ham o'z ichiga oladi; hammasi o'tishi qamrov ichida va faqat shu xatti-harakatlar uchun ma'no beradi.
- Topilmalar ekspluatatsiya osonligi, nazorat yetishmasligi, ta'sir va tuzatish narxi bilan tartiblanadi; ball tartib uchun, qaror odamniki.
- Qayta tekshiruv asl hujumni, regressiyani va yondosh holatlarni tekshiradi.
- OWASP ASVS sertifikat bermaydi: hisobot va marketingda qamrov, daraja va metodikani aniq yozing.
