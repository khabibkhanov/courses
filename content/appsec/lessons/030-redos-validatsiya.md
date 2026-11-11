---
n: 30
slug: redos-validatsiya
title: "ReDoS va kirish validatsiyasi strategiyasi"
summary: "ReDoS: backtracking regex dvigateli maxsus kiritishda eksponensial ishlaydi va Node.js event loop'ni band qiladi. Dars regex xavfini va kirish validatsiyasining umumiy strategiyasini (sintaksis va semantika, allow-list, server tomonda, rad etish, sxema, o'lcham cheklovlari) mini-modelda ko'rsatadi va modul xulosasini beradi."
duration: 50
sources:
  - id: zod-api
    note: "Zod: z.strictObject noma'lum kalit topilsa xato tashlaydi (oddiy z.object ularni olib tashlaydi); .strict() Zod 4 da eski (legacy) usul; z.string().max() va .regex()"
  - id: fastify-server
    note: "Fastify Server: bodyLimit baytlarda, standart 1048576 (1 MiB); standart body reader chegaradan oshganda FST_ERR_CTP_BODY_TOO_LARGE bilan javob beradi"
  - id: cs-input
    note: "Input Validation Cheat Sheet: sintaksis va semantika, allow-list va denylist, xavfsiz parse qilish (o'lcham va chuqurlik cheklovlari), JSON sxema (required va additional properties), regex bo'limi (to'liq moslik, uzunlikni oldindan cheklash, ortiqcha backtracking'dan qochish, timeout), keng tarqalgan xatolar"
  - id: mdn-input-validation
    note: "MDN Input validation: allow-list denylist'dan ishonchliroq (default holatda rad etadi), sintaktik va semantik validatsiya, murakkab regex'lar DoS xavfini tug'dirishi mumkin va yaxshi tanilgan validatsiya kutubxonasi (validator.js) afzalroq"
  - id: nestjs-validation
    note: "NestJS Validation: ValidationPipe'ning whitelist (ruxsat etilmagan xususiyatlarni olib tashlash) va forbidNonWhitelisted (istisno tashlash) sozlamalari"
  - id: v8-regexp
    note: "V8 blogi: Irregexp backtracking dvigatel, eksponensial vaqt xavfi; tajribaviy non-backtracking dvigatel (--enable-experimental-regexp-engine, l flagi) va uning cheklovlari (backreference, lookaround)"
  - id: re2
    note: "RE2 README: moslash vaqti kiritish uzunligiga chiziqli, ishonchsiz regex'lar uchun xavfsiz, backreference va look-around yo'q"
  - id: python-re
    note: "Python re hujjati: $ satr oxirida yoki oxirgi yangi qatordan oldin mos keladi; fullmatch butun satrni tekshiradi"
  - id: asvs
    note: "ASVS 5.0.0: 1.3.12 (regex'lar eksponensial backtracking'siz bo'lishi, Level 3), 2.2.1 (allow-list/struktura bilan validatsiya), 2.2.2 (validatsiya ishonchli servis qatlamida; klient tekshiruvi xavfsizlik nazorati emas, Level 1), 2.1.1 (validatsiya qoidalari hujjatlashtirilishi)"
  - id: cs-nodejs
    note: "OWASP Node.js Security Cheat Sheet: 'Do not block the event loop' (bitta oqimli arxitektura, CPU-ni band qiladigan ish loop'ni bloklaydi), 'Stay away from evil regexes' (takrorlanish bilan guruhlash va kesishuvchi alternation, misol pattern), 'Monitor the event loop' (toobusy-js va 503)"
quiz:
  - q: "Quyidagi qaysi regex eksponensial backtracking xavfiga eng ko'p moyil?"
    options:
      - "`^[A-Z0-9]{3,10}$`"
      - "`^([A-Z0-9]+-?)+$`"
      - "`^\\d{4}-\\d{2}$`"
      - "`^[a-z]+$`"
    answer: 1
    explain: "Ichma-ich takrorlanish (`(...+...)+`) va ixtiyoriy ajratkich (`-?`) bir xil qatorni ko'p usulda bo'lish imkonini beradi; mos kelmaydigan oxirgi belgi bo'lsa, dvigatel barcha bo'linishlarni sinaydi. Qolgan uchtasida takrorlanishlar bir-biriga kirmaydi."
  - q: "ReDoS'ga qarshi qaysi tartib to'g'ri?"
    options:
      - "Regex ishga tushadi, keyin uzunlik tekshiriladi"
      - "Hech narsa: V8 regex'ni doim tez bajaradi"
      - "Faqat regex'ni murakkablashtirish"
      - "Avval kiritish uzunligi cheklanadi, keyin bir ma'noli (kesishmaydigan takrorlanishli) regex yoki non-backtracking dvigatel/timeout ishlatiladi"
    answer: 3
    explain: "Cheat sheet regex'dan oldin uzunlikni cheklash, ortiqcha backtracking'dan qochish va mavjud bo'lsa non-backtracking dvigatel yoki timeout ishlatishni tavsiya qiladi. Uzunlik cheklovi eng arzon birinchi chora."
  - q: "Bitta ReDoS so'rovi Node.js'da butun serverga nima uchun ta'sir qiladi?"
    options:
      - "Har so'rov alohida jarayonda ishlaydi"
      - "Regex asinxron bajariladi"
      - "Regex sinxron bajariladi va event loop'ni bloklaydi; bloklanish davomida jarayon boshqa so'rovlarga javob bera olmaydi"
      - "Faqat bitta foydalanuvchi ta'sirlanadi"
    answer: 2
    explain: "Node.js bitta oqimli event loop'ga tayanadi: CPU-ni band qiladigan sinxron ish tugamaguncha loop kutadi. Shuning uchun uzoq regex butun jarayon uchun mavjudlik muammosi."
  - q: "Validator `if (code.includes(\"'\") || code.includes(\"--\")) reject`. Nima uchun bu strategiya noto'g'ri?"
    options:
      - "Denylist: kutilmagan shakllar o'tadi, haqiqiy qiymatlar (O'Brien) rad etiladi; qaysi qiymatlar qabul qilinishini aniqlaydigan allow-list kerak"
      - "To'g'ri strategiya, hamma narsani qoplaydi"
      - "Faqat sekin ishlaydi"
      - "Faqat JSON uchun mos emas"
    answer: 0
    explain: "Cheat sheet va MDN ikkalasi ham allow-list'ni afzal ko'radi: allow-list ko'zda tutilmagan qiymatni rad etadi, denylist esa qabul qiladi. Apostrofni bloklash qonuniy ismlarni buzadi va so'rovni xavfsiz qilmaydi."
  - q: "Frontend formada validatsiya bor, backend uni takrorlamaydi. ASVS 5.0.0 nima deydi?"
    options:
      - "Yetarli: frontend validatsiyasi xavfsizlik nazorati"
      - "Faqat ma'lumotlar bazasida tekshirish yetarli"
      - "Validatsiya shart emas"
      - "Validatsiya ishonchli servis qatlamida bajarilishi kerak; klient tekshiruvi qulaylik uchun, lekin xavfsizlik nazorati sifatida unga tayanib bo'lmaydi (2.2.2)"
    answer: 3
    explain: "ASVS 2.2.2 serverda validatsiyani talab qiladi. Hujumchi brauzerni chetlab o'tib to'g'ridan-to'g'ri API'ga so'rov yuboradi."
  - q: "JavaScript'da `/^[A-Z]+$/.test(\"AB\\n\")` natijasi?"
    options:
      - "`true`: `$` yangi qatordan oldin ham mos keladi"
      - "Xato tashlanadi"
      - "`false`: `m` flagi yo'q bo'lsa `$` faqat qatorning oxirida mos keladi, shuning uchun yakunlovchi yangi qator rad etiladi"
      - "`undefined`"
    answer: 2
    explain: "JavaScript'da `m` flagisiz `$` faqat kiritishning oxirida mos keladi (Python'dagi `$` dan farq qiladi, u yakunlovchi yangi qatordan oldin ham mos keladi). Cheat sheet dvigatellarning yangi qator xatti-harakatini farq qilishini eslatadi: o'z dvigatelingizda sinab ko'ring."
task:
  title: "Transport kodi validatori: uzunlik va bir ma'noli pattern"
  prompt: |
    `validateCode(code)` mashina kodini tekshiradi (masalan `A12-B7-C3`: bosh harf yoki raqamli guruhlar, `-` bilan ajratilgan). Hozirgi pattern `^([A-Z0-9]+-?)+$` ichma-ich takrorlanishga ega. Modelda `nestedMatch` uning qadamlarini sanaydi (eksponensial), `linearMatch` esa `^[A-Z0-9]+(-[A-Z0-9]+)*$` pattern'ini bir marta o'tib tekshiradi.

    Tuzating: `code` satr bo'lmasa yoki uzunligi 24 dan oshsa darhol rad etilsin (`{ ok: false, steps: 0 }`), aks holda `linearMatch` ishlatilsin. Imzoni o'zgartirmang. Kutilgan natija: to'g'ri kod `ok: true`, hujum satri va katta massiv rad etiladi, qadamlar soni 100 dan kam.
  lang: ts
  starter: |
    let steps = 0;

    // ^([A-Z0-9]+-?)+$ ning backtracking modeli: qadamlar sanaladi
    function nestedMatch(s: string, i = 0, count = 0): boolean {
      steps++;
      if (i === s.length) return count > 0;
      let j = i;
      while (j < s.length && /[A-Z0-9]/.test(s[j])) j++;
      for (let end = j; end > i; end--) {
        const next = s[end] === "-" ? end + 1 : end;
        if (nestedMatch(s, next, count + 1)) return true;
      }
      return false;
    }

    // ^[A-Z0-9]+(-[A-Z0-9]+)*$ : har belgi bitta usulda moslanadi
    function linearMatch(s: string): boolean {
      let prevDash = true;
      for (const ch of s) {
        steps++;
        if (ch === "-") { if (prevDash) return false; prevDash = true; }
        else if (/[A-Z0-9]/.test(ch)) prevDash = false;
        else return false;
      }
      return !prevDash;
    }

    function validateCode(code: unknown): { ok: boolean; steps: number } {
      steps = 0;
      const ok = nestedMatch(String(code));
      return { ok, steps };
    }

    const attack = "A".repeat(20) + "!";
    const r1 = validateCode("A12-B7-C3");
    const r2 = validateCode(attack);
    const r3 = validateCode("A".repeat(5000));
    const r4 = validateCode({ toString: () => "A12" });
    console.log("to'g'ri kod:", r1.ok, r1.steps < 100);
    console.log("hujum satri:", r2.ok, r2.steps < 100);
    console.log("uzun satr:", r3.ok, r3.steps < 100);
    console.log("satr bo'lmagan:", r4.ok, r4.steps < 100);
  solution: |
    let steps = 0;

    // ^([A-Z0-9]+-?)+$ ning backtracking modeli: qadamlar sanaladi
    function nestedMatch(s: string, i = 0, count = 0): boolean {
      steps++;
      if (i === s.length) return count > 0;
      let j = i;
      while (j < s.length && /[A-Z0-9]/.test(s[j])) j++;
      for (let end = j; end > i; end--) {
        const next = s[end] === "-" ? end + 1 : end;
        if (nestedMatch(s, next, count + 1)) return true;
      }
      return false;
    }

    // ^[A-Z0-9]+(-[A-Z0-9]+)*$ : har belgi bitta usulda moslanadi
    function linearMatch(s: string): boolean {
      let prevDash = true;
      for (const ch of s) {
        steps++;
        if (ch === "-") { if (prevDash) return false; prevDash = true; }
        else if (/[A-Z0-9]/.test(ch)) prevDash = false;
        else return false;
      }
      return !prevDash;
    }

    const MAX_LEN = 24;

    function validateCode(code: unknown): { ok: boolean; steps: number } {
      steps = 0;
      if (typeof code !== "string" || code.length > MAX_LEN) return { ok: false, steps: 0 };
      const ok = linearMatch(code);
      return { ok, steps };
    }

    const attack = "A".repeat(20) + "!";
    const r1 = validateCode("A12-B7-C3");
    const r2 = validateCode(attack);
    const r3 = validateCode("A".repeat(5000));
    const r4 = validateCode({ toString: () => "A12" });
    console.log("to'g'ri kod:", r1.ok, r1.steps < 100);
    console.log("hujum satri:", r2.ok, r2.steps < 100);
    console.log("uzun satr:", r3.ok, r3.steps < 100);
    console.log("satr bo'lmagan:", r4.ok, r4.steps < 100);
  solutionNotes: |
    - Tur va uzunlik tekshiruvi regex'dan oldin keladi: `String(code)` kabi majburiy aylantirish obyektni satrga aylantirib o'tkazib yuborardi; hozir faqat haqiqiy `string` qabul qilinadi (21-24-darslardagi tur tekshiruvi qoidasi).
    - Uzunlik cheklovi (24) eng arzon va eng ishonchli birinchi chora: eng yomon holat ham kichik kiritish bilan chegaralanadi, hatto pattern keyinchalik o'zgarib ketsa ham.
    - Yangi pattern bir ma'noli: har belgi faqat bitta usulda moslanadi, shuning uchun backtracking yo'q. Ichma-ich takrorlanish va ixtiyoriy ajratkich bir qatorni ko'p usulda bo'lishi eksponensial xavf manbai edi.
    - Qoplanmaydi: boshqa regex'lar (har biri alohida tekshiriladi, ASVS 1.3.12), semantik validatsiya (kod haqiqatan mavjudmi), umumiy so'rov hajmi va tezlik cheklovi (73-dars). Bu model qadamlarni sanaydi, haqiqiy dvigatel vaqtini o'lchamaydi.
  checklist:
    - "Tur va uzunlik regex'dan oldin tekshiriladi"
    - "Pattern bir ma'noli, ichma-ich takrorlanishsiz"
    - "Hujum satri va juda uzun satr kam qadamda rad etiladi"
    - "Satr bo'lmagan kiritish rad etiladi"
    - "Model qadam sanashi haqiqiy vaqt o'lchovi emasligini aytib bera olasiz"
---

## Muammo

Regular expression eng keng tarqalgan validatsiya vositasi: elektron pochta, telefon, davlat raqami, mashina kodi, slug. U qisqa, hamma joyda ishlaydi va "bir qator bilan" tekshiradi. Lekin ko'p dasturlash tillarida, shu jumladan JavaScript'da (V8), regex dvigateli backtracking asosida ishlaydi: variantlardan birini sinab, muvaffaqiyatsiz bo'lsa orqaga qaytib boshqasini sinaydi. Pattern ko'p usulda moslanishi mumkin bo'lsa va kiritish oxirida mos kelmasa, dvigatel hamma usulni sinab chiqadi, ularning soni kiritish uzunligi bilan eksponensial o'sishi mumkin. Bu ReDoS (Regular expression Denial of Service).

Node.js'da muammo kuchaytiriladi: JavaScript bitta oqimda ishlaydi va OWASP Node.js Security Cheat Sheet event loop'ni bloklamaslik kerakligini alohida tavsiya qiladi: CPU-ni band qiladigan sinxron amal tugamaguncha event loop boshqa hech narsani bajarmaydi. Demak bitta noto'g'ri pattern va bitta uzun satr butun jarayonni (hamma tenant'larni) bir necha soniya, daqiqa yoki undan uzoqqa to'xtatishi mumkin. Bu mavjudlik buzilishi (1-dars) va xavfsizlik nuqtai nazaridan qimmatli hujum yuzasi: hujumchiga autentifikatsiya ham kerak bo'lmasligi mumkin, agar regex ro'yxatdan o'tishdan oldingi maydonda turgan bo'lsa.

Ikkinchi muammo kengroq: validatsiya strategiyasi yo'qligi. Ba'zi maydon regex bilan, ba'zisi `if` bilan, ba'zisi umuman tekshirilmaydi; tekshiruv bir joyda klientda, boshqasida serverda; xato topilganda "tozalash" bilan davom etiladi. Bu 21-30 darslarda ko'rilgan hamma injection turlarining umumiy fonidir: kirish chegarasi aniq bo'lmasa, har interpreter oldida alohida himoyaga tayanish kerak bo'ladi. Dars ReDoS mexanizmini ko'rsatadi va modul oxirida validatsiya strategiyasining umumiy ko'rinishini beradi: u injection'dan himoyaning o'rnini bosmaydi, lekin hujum yuzasini toraytiradi va mantiqiy xatolarni ushlaydi.

## Asosiy g'oya

### ReDoS mexanizmi

OWASP Node.js Security Cheat Sheet ReDoS ni shunday tasvirlaydi: ko'pchilik regex dvigatellari ekstremal holatlarga tushishi mumkin, bunda ishlash vaqti kiritish hajmiga nisbatan juda tez o'sadi (eksponensial). Hujumchi bunday holatni maxsus kiritish bilan chaqiradi va dastur uzoq muddatga to'xtaydi. Cheat sheet "evil regex" belgilarini ham ko'rsatadi: takrorlanish bilan guruhlash va o'zaro kesishadigan alternation; misol sifatida Java sinf nomlari uchun `^(([a-z])+.)+[A-Z]([a-z])+$` pattern'ini va uni sekinlashtiruvchi "aaaa...aaaaAaaaa" ko'rinishdagi uzun satrni keltiradi.

Umumiy shakl: ichma-ich takrorlanish (`(a+)+`, `(a|aa)+`, `(a*)*`) yoki qo'shni qismlar bir xil belgilarni qamrab olishi (`\d+\d*`, `.*.*`). Bunday patternlarda belgilar qatori ko'p usulda bo'linadi, dvigatel esa mos kelmaslik aniqlangunicha hammasini sinaydi.

### Validatsiya strategiyasi: OWASP va ASVS

OWASP Input Validation Cheat Sheet tavsiyalarini qisqa jamlaymiz:

- Sintaksis va semantika. Sintaksis: kutilgan tur va format. Semantika: qiymat amalga mos keladimi (sanalar tartibi, diapazon). MDN ham xuddi shu ikki turni ajratadi (syntactic va semantic).
- Allow-list. Qabul qilinadiganni belgilab, undan tashqarini rad eting; "har zararli qatorni tanishga" urinmang. Cheat sheet misol keltiradi: apostrofni bloklash qonuniy ismlarni rad etadi, lekin so'rovni xavfsiz qilmaydi. Erkin matn uchun allow-list keng Unicode'ni ruxsat etib, uzunlikni cheklashi mumkin.
- Parse qilishdan oldin o'lchamni cheklang. So'rov hajmi cheklovlari buferlashdan oldin qo'llanadi; parser cheklovlari (maksimal ichma-ich chuqurlik) sozlanadi. Parse bo'lib bo'lgan resurslarni sxema tekshiruvi himoya qila olmaydi.
- Sxema bilan tekshirish. JSON uchun required va additional properties'ni aniq sozlash kerak: faqat xususiyatni sanab o'tish uni majburiy qilmaydi va noma'lum maydonlarni rad etmaydi. Ichma-ich obyektlar, massiv uzunligi va har element tekshiriladi.
- Rad eting, tozalamang. Noto'g'ri so'rov aniq xato bilan rad etiladi; qisman tekshirilgan ma'lumot bilan davom etilmaydi. "Shubhali belgilarni olib tashlash" ma'noni o'zgartirishi mumkin va parametrlash yoki output encoding o'rnini bosmaydi.
- Tartib. Protokol bo'yicha dekodlang, keyin qoidalarni tekshiring, keyingi bosqichda qayta dekodlamang (kanonizatsiya, 21-26-darslar).
- Validatsiya autorizatsiya emas. Haqiqiy akkaunt ID'si chaqiruvchining unga huquqi borligini bildirmaydi (cheat sheet shunday ajratadi; 51-58-darslar).
- Ishonch chegarasi. Ichki API, navbat va saqlangan yozuvlar ham chegarani kesib o'tsa tekshirilishi kerak (ikkinchi tartibli injection, 21-dars).

ASVS 5.0.0 bu g'oyalarni talablarga aylantiradi: 2.1.1 validatsiya qoidalari hujjatlashtirilishi kerak; 2.2.1 kiritish allow-list yoki kutilgan struktura va mantiqiy chegaralarga solishtirilishi kerak (L1 uchun xavfsizlik qarorlariga ta'sir qiladigan kiritish, L2 va yuqorida hamma kiritish); 2.2.2 validatsiya ishonchli servis qatlamida bajarilishi kerak va klient tekshiruviga xavfsizlik nazorati sifatida tayanib bo'lmaydi. Regex bo'yicha 1.3.12: regex'lar eksponensial backtracking elementlaridan xoli bo'lishi va ishonchsiz kiritish ReDoS'ga qarshi tozalanishi kerak (Level 3).

## Chuqurroq: regex'ni xavfsiz ishlatish

### Cheat sheet'ning regex bo'limi

Input Validation Cheat Sheet quyidagilarni tavsiya qiladi: regex'ni sodda, tuzilmali maydonlar uchun ishlating; butun qiymat moslashini talab qiling (`fullmatch` kabi API yoki `^...$`); dvigatelning belgi sinflari va yangi qator xatti-harakatini tekshiring, hamma tilda bir xil deb o'ylamang; moslashdan oldin kiritish uzunligini cheklang; ortiqcha backtracking'dan qoching va imkon bo'lsa non-backtracking dvigatel yoki moslash timeout'ini ishlating; to'g'ri, noto'g'ri va "deyarli mos" qiymatlar bilan sinab ko'ring; timeout'ni validatsiya muvaffaqiyatsizligi deb hisoblang.

JavaScript'da `$` `m` flagisiz faqat satr oxirida mos keladi, `m` flagi bilan esa qator oxirida (shu bilan Python'dan farq qiladi). Misol: `/^[A-Z]+$/.test("AB\n")` `false`, `m` flagi bilan `true`. Shuning uchun yangi qator bilan kelgan qiymat dvigatelga qarab turlicha o'tadi. Python hujjatiga ko'ra `re` da `$` satr oxirida yoki oxirgi yangi qatordan oldin mos keladi (`fullmatch` butun satr mosligini talab qiladi); shuning uchun "AB\n" Python'da `$` bilan mos keladi, JavaScript'da esa yo'q.

### Node.js'da amaliy chora

- Uzunlikni oldindan cheklash (eng arzon).
- Bir ma'noli pattern yozish: ichma-ich takrorlanish yo'q, qo'shni qismlar bir xil belgilarni qamramaydi.
- Mavjud kutubxona validatorlaridan foydalanish: MDN murakkab regex'larni to'g'ri yozish qiyin ekanini, ba'zilari denial of service hujumiga yo'l ochishini va shuning uchun odatda yaxshi tanilgan validatsiya kutubxonasini ishlatish ma'qul ekanini yozadi (misol: validator.js). Kutubxona versiyasini yangilab turing.
- Non-backtracking dvigatel (masalan, RE2 asosidagi kutubxona) yoki regex'ni alohida worker thread'da ishga tushirib, vaqt chegarasidan oshsa to'xtatish. Cheat sheet ikkalasini ham "qo'llab-quvvatlansa" shartida tavsiya qiladi. JavaScript tomonida: MDN `RegExp` sahifasi konstruktorga faqat pattern va flags beriladi deb yozadi va match vaqt chegarasini tilga olmaydi, V8 blogi esa standart dvigatel Irregexp'ni backtracking dvigatel deb ataydi, uning vaqti kiritish hajmiga eksponensial o'sishi mumkinligini yozadi. Shuning uchun timeout kerak bo'lsa, regex'ni worker thread'da ishga tushirib to'xtatish yoki tashqi dvigatel kerak. RE2 README'siga ko'ra RE2 moslik vaqti kiritish uzunligiga chiziqli ekanini kafolatlaydi, ishonchsiz foydalanuvchi regex'lari bilan xavfsiz ishlash uchun yozilgan, lekin backreference va look-around qo'llamaydi. V8 ning tajribaviy `--enable-experimental-regexp-engine` bayrog'i chiziqli vaqtli `l` flagini yoqadi; u standart emas va hammasini qo'llamaydi.
- Foydalanuvchi regex'ni o'zi kiritadigan funksiyalar (qidiruv "regex rejimi") alohida xavf: bunday imkoniyatni bermang yoki non-backtracking dvigatelda bajaring.
- Event loop monitoringi. Cheat sheet event loop kechikishini kuzatuvchi `toobusy-js` modulini tilga oladi: kechikish chegaradan oshganda `503` qaytarish. U himoyaning o'rnini bosmaydi, lekin ta'sirni cheklaydi.

### Resurs cheklovlari kontekstda

ReDoS validatsiya va rate limiting (73-dars) chorrahasi. So'rov hajmi, JSON chuqurligi, massiv uzunligi, ko'p qismli yuklash hajmi va regex uzunligi cheklovlari birga ishlaydi. Cheat sheet "implementation limits on size, depth, and numbers" (JSON uchun) haqida yozadi: parser limitlari validatsiyadan oldin kerak.

## Misol: ReDoS mini-modelda

Haqiqiy regex vaqtini print qilish deterministik emas. Shuning uchun mexanizmni `^([A-Z0-9]+-?)+$` pattern'ining backtracking modeli bilan ko'rsatamiz: model qadamlarni sanaydi (bu muallifning o'z o'lchovi, haqiqiy dvigatel vaqti emas). Pattern mashina kodlari uchun yozilgan: bosh harf yoki raqam guruhlari, `-` bilan ajratilgan.

### 1. Zaif kod

```ts run
let steps = 0;

// ZAIF: ^([A-Z0-9]+-?)+$ ning backtracking modeli. Qadamlar sanaladi.
function nestedMatch(s: string, i = 0, count = 0): boolean {
  steps++;
  if (i === s.length) return count > 0;
  let j = i;
  while (j < s.length && /[A-Z0-9]/.test(s[j])) j++;
  for (let end = j; end > i; end--) {
    const next = s[end] === "-" ? end + 1 : end;
    if (nestedMatch(s, next, count + 1)) return true;
  }
  return false;
}

// ZAIF: tur va uzunlik tekshirilmaydi
function validateCodeWeak(code: unknown): { ok: boolean; steps: number } {
  steps = 0;
  const ok = nestedMatch(String(code));
  return { ok, steps };
}

console.log("A12-B7-C3:", JSON.stringify(validateCodeWeak("A12-B7-C3")));
console.log("A12:", JSON.stringify(validateCodeWeak("A12")));
```

```text
A12-B7-C3: {"ok":true,"steps":4}
A12: {"ok":true,"steps":2}
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu ReDoS usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-5-moddasi (Kompyuter sabotaji) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi kodni "to'g'ri ko'rinadigan, lekin oxirida mos kelmaydigan belgi bor" satr bilan yuboradi. Eng yomon holat uchun belgilar sonini oshiramiz va qadamlarni kuzatamiz. Faqat shu model.

```ts run
let steps = 0;
function nestedMatch(s: string, i = 0, count = 0): boolean {
  steps++;
  if (i === s.length) return count > 0;
  let j = i;
  while (j < s.length && /[A-Z0-9]/.test(s[j])) j++;
  for (let end = j; end > i; end--) {
    const next = s[end] === "-" ? end + 1 : end;
    if (nestedMatch(s, next, count + 1)) return true;
  }
  return false;
}

for (const n of [8, 12, 16, 20]) {
  steps = 0;
  const ok = nestedMatch("A".repeat(n) + "!");
  console.log(`n=${String(n).padStart(2)} ok=${ok} qadamlar=${steps}`);
}
```

```text
n= 8 ok=false qadamlar=256
n=12 ok=false qadamlar=4096
n=16 ok=false qadamlar=65536
n=20 ok=false qadamlar=1048576
```

Har 4 belgi qo'shilganda qadamlar 16 barobar oshdi: belgi qo'shilishi bilan qadamlar ikki barobar ko'payadi. 20 belgi 1 048 576 qadam beradi. Bu modeldagi o'sish qonuni; haqiqiy dvigatelda optimallashtirishlar farq qilishi mumkin.

### 3. Tuzatilgan kod

Tuzatish uch qatlamli: tur va uzunlik tekshiruvi, bir ma'noli pattern, hamda umumiy DTO validatori (allow-list, sintaksis va semantika, rad etish).

```ts run
type Dto = { code: string; fuel: number; tenant: string };

const MAX_LEN = 24;
// ^[A-Z0-9]+(-[A-Z0-9]+)*$ : har belgi bitta usulda moslanadi
const CODE = /^[A-Z0-9]+(-[A-Z0-9]+)*$/;

function validateDto(input: unknown): { ok: true; value: Dto } | { ok: false; error: string } {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return { ok: false, error: "obyekt kutilgan" };
  const o = input as Record<string, unknown>;
  const extra = Object.keys(o).filter((k) => !["code", "fuel", "tenant"].includes(k));
  if (extra.length) return { ok: false, error: "noma'lum maydon: " + extra.join(",") };

  const { code, fuel, tenant } = o;
  if (typeof code !== "string" || code.length > MAX_LEN || !CODE.test(code)) return { ok: false, error: "code noto'g'ri" };
  if (typeof fuel !== "number" || !Number.isFinite(fuel) || fuel < 0 || fuel > 100) return { ok: false, error: "fuel diapazondan tashqari" };
  if (typeof tenant !== "string" || !["alfa", "beta"].includes(tenant)) return { ok: false, error: "tenant noto'g'ri" };
  return { ok: true, value: { code, fuel, tenant } };
}

const show = (x: unknown) => console.log(JSON.stringify(validateDto(x)));
show({ code: "A12-B7-C3", fuel: 55, tenant: "alfa" });
show({ code: "A".repeat(20) + "!", fuel: 55, tenant: "alfa" });
show({ code: "A".repeat(5000), fuel: 55, tenant: "alfa" });
show({ code: "A12", fuel: "55", tenant: "alfa" });
show({ code: "A12", fuel: 55, tenant: "alfa", role: "admin" });
console.log(/^[A-Z]+$/.test("AB\n"), /^[A-Z]+$/m.test("AB\n"));
```

```text
{"ok":true,"value":{"code":"A12-B7-C3","fuel":55,"tenant":"alfa"}}
{"ok":false,"error":"code noto'g'ri"}
{"ok":false,"error":"code noto'g'ri"}
{"ok":false,"error":"fuel diapazondan tashqari"}
{"ok":false,"error":"noma'lum maydon: role"}
false true
```

Nima uchun yetarli: invariant "regex hech qachon uzun yoki noto'g'ri turdagi kirishga qo'llanmaydi, qo'llanganda esa chiziqli vaqtda ishlaydi". Uzunlik va tur regex'dan oldin tekshirildi (5000 belgili satr regex'ga yetmadi). Pattern bir ma'noli, shuning uchun `A...A!` kabi satr chiziqli vaqtda rad etiladi. Validator allow-list asosida (noma'lum maydon rad etiladi, `tenant` ro'yxatdan, `fuel` diapazondan) va xato bo'lsa davom etmaydi. Oxirgi qator JavaScript'da `$` ning `m` flagisiz xatti-harakatini ko'rsatadi. Yopilmagan: boshqa regex'lar (har biri alohida tekshiriladi, ASVS 1.3.12), kod haqiqatan mavjudligini semantik tekshirish (bazada), umumiy so'rov hajmi va tezlik (73-dars), tenant qiymatining sessiyadan olinishi (55-dars; bu yerda allow-list faqat misol uchun) hamda validatsiyaning injection himoyasi emasligi: parametrlash va output encoding hamon kerak.

### 4. Mashq: pattern'ni mahkamlash

Quyidagi `isSlug` funksiyasi URL slug'ni tekshirishi kerak: faqat kichik lotin harflari va raqamlar, so'zlar bitta `-` bilan ajratilgan, uzunligi 64 dan oshmaydi. Hozirgi pattern bog'lanmagan (`^` va `$` yo'q), shuning uchun satrning faqat bir qismi mos kelsa ham `true` qaytaradi, tur tekshiruvi esa yo'q. Tuzating: avval tur va uzunlik, so'ng butun qiymatga mos, bir ma'noli pattern (ichma-ich takrorlanishsiz).

```ts run
// Starter: bog'lanmagan pattern, tur va uzunlik tekshirilmaydi.
function isSlug(s: unknown): boolean {
  return /[a-z0-9]+(-[a-z0-9]+)*/.test(String(s));
}
```

```ts test
check("oddiy slug", () => isSlug("video-2026") === true);
check("bitta so'z", () => isSlug("alfa") === true);
check("boshida begona belgi rad", () => isSlug("<b>alfa") === false);
check("oxirida yangi qator rad", () => isSlug("alfa\n") === false);
check("ikkita defis rad", () => isSlug("a--b") === false);
check("bosh harf rad", () => isSlug("Alfa") === false);
check("juda uzun satr rad", () => isSlug("a".repeat(65)) === false);
check("64 belgi qabul", () => isSlug("a".repeat(64)) === true);
check("satr bo'lmagan qiymat rad", () => isSlug({ toString: () => "alfa" }) === false);
```

## Qachon qo'llamaslik kerak

- Regex'ni har maydon uchun ishlatish shart emas. Aniq enum, UUID, sana yoki raqam uchun tilning tur tekshiruvlari va sxema kutubxonasi regex'dan ishonchli. Regex qisqa tuzilmali maydonlar uchun.
- Pattern'ni "o'ta qat'iy" qilish ham zarar qilishi mumkin. Ismlar va manzillar uchun qat'iy ASCII pattern haqiqiy foydalanuvchilarni rad etadi. Erkin matnda uzunlik va kodlash tekshiruvi yetarli, qolgan himoya chiqish kontekstida (output encoding, parametrlash).
- Validatsiya injection himoyasi o'rnini bosmaydi. Cheat sheet uni parametrlangan so'rovlar va kontekstli encoding'dan ajratadi. "Tozalangan" qiymatga ishonib konkatenatsiya qilmang.
- Vaqt chegarasi bilan o'ralgan har regex'ni "xavfsiz" deb hisoblamang: timeout CPU sarfini cheklaydi, lekin pattern xatosini tuzatmaydi. Cheat sheet timeout'ni validatsiya muvaffaqiyatsizligi deb hisoblashni aytadi: kiritish rad etiladi.
- Eski kodda barcha regex'larni birdaniga qayta yozishga urinmang. Avval kirishi foydalanuvchidan keladigan va autentifikatsiyadan oldingi maydonlarni (ro'yxatdan o'tish, login, qidiruv) tekshiring.

## Stack'da: NestJS, Fastify, zod

Validatsiya bir joyda, so'rov chegarasida bajariladi: NestJS'da `ValidationPipe` (class-validator) yoki zod sxemasi, Fastify'da route JSON Schema (`schema.body`). Quyidagi kod ishga tushirilmaydi (zod va Fastify brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi tekshirilgan.

```ts
import Fastify from "fastify";
import { z } from "zod";

const app = Fastify({
  bodyLimit: 100 * 1024, // parse'dan oldin hajm cheklovi
});

// z.strictObject: noma'lum kalit topilsa xato (oddiy z.object ularni jimgina tashlab yuboradi)
const VehicleUpdate = z.strictObject({
  code: z.string().max(24).regex(/^[A-Z0-9]+(-[A-Z0-9]+)*$/),
  fuel: z.number().min(0).max(100),
});

app.put("/vehicles/:id", async (req, reply) => {
  const parsed = VehicleUpdate.safeParse(req.body);
  if (!parsed.success) return reply.code(400).send({ error: "invalid_request" }); // tafsilotsiz, tozalamasdan rad
  // tenant sessiyadan, id esa yo'l parametridan: parametrlangan so'rov bilan
  return { ok: true };
});
```

`bodyLimit` Fastify'ning qabul qilinadigan eng katta tana hajmini baytlarda cheklaydigan server sozlamasi (standart 1048576, ya'ni 1 MiB); Fastify hujjatiga ko'ra standart body reader hajm chegaradan oshsa `FST_ERR_CTP_BODY_TOO_LARGE` xatosi bilan javob beradi (`preParsing` hook bo'lsa, chegara hook qaytargan oqim hajmiga qo'llanadi). Zod'da `max(24)` regex'dan oldin tekshiriladi, shuning uchun uzun satr regex'ga yetmaydi. NestJS'da bir xil g'oya `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` bilan: `whitelist` ruxsat etilmagan xususiyatlarni DTO'dan olib tashlaydi, `forbidNonWhitelisted` esa ularni olib tashlash o'rniga istisno tashlaydi. Rad etish tozalashdan afzal bo'lgani uchun ikkinchisini yoqing. Hamma xatolarni umumiy `400` bilan qaytaring va tafsilotni logga yozing (78-79-darslar).

## Xulosa

- ReDoS - backtracking dvigatelda mos kelmaydigan kiritishda eksponensial ish. Node.js'da sinxron regex event loop'ni bloklaydi va butun jarayonga ta'sir qiladi.
- Xavfli shakllar: ichma-ich takrorlanish va bir xil belgilarni qamraydigan qo'shni qismlar. Himoya: avval tur va uzunlik, so'ng bir ma'noli pattern, non-backtracking dvigatel yoki timeout; ASVS 1.3.12.
- Validatsiya strategiyasi: sintaksis va semantika, allow-list, server tomonda (ASVS 2.2.2), parse'dan oldin hajm va chuqurlik cheklovlari, sxema (required va additional properties), rad etish tozalash o'rniga.
- Validatsiya injection himoyasi emas va avtorizatsiya emas: parametrlash, kontekstli encoding va ruxsat tekshiruvi alohida qatlam.
- 21-30 darslar umumiy g'oyani takrorladi: interpreter chegarasida ma'lumotni kod sifatida o'qitmang. SQL (22-23), NoSQL va Redis (24), shell (25), fayl yo'li (26), URL (27), template (28), obyekt tiklash (29) va regex (30) uchun himoya turlicha, mantiq bir.
- Har tuzatishning chegarasini yozing: boshqa pattern'lar, semantika, hajm cheklovlari va keyingi himoya qatlamlari.
