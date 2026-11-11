---
n: 9
slug: huquqiy-va-etik-chegaralar
title: "Huquqiy va etik chegaralar: O'zbekiston qonunchiligi va responsible disclosure"
summary: "Xavfsizlikni sinashda ruxsat va doira (scope) chegarasi, O'zbekistonning Kiberxavfsizlik va Shaxsga doir ma'lumotlar to'g'risidagi qonunlarining dasturchi uchun muhim qoidalari, responsible disclosure jarayoni; sinash vositasining doirasini to'g'ri tekshirish misoli."
duration: 40
sources:
  - id: lex-cyber
    note: "lex.uz O'RQ-764 (15.04.2022, kuchga kirishi 17.07.2022): 3-modda ta'riflar (zaiflik ta'rifi yo'q), 16-modda kiberxavfsizlik subyektlarining huquq va majburiyatlari, 22-24-moddalar kiberxavfsizlik hodisalari, 37-modda javobgarlik (kodekslarga havola qiladi)"
  - id: lex-pdp
    note: "lex.uz O'RQ-547 (02.07.2019) amaldagi tahriri (tahrirlar ro'yxatida oxirgisi 12.09.2026): 4-modda ta'riflar, 5-modda tamoyillar, 15-modda chegaradan tashqariga uzatish, 18-19 va 21-moddalar asos, maqsad va rozilik, 25-modda maxsus ma'lumotlar, 27-modda himoya kafolatlari, 27-1-modda saqlash shartlari (2026 yil 26 martdagi O'RQ-1125 tahririda)"
  - id: wstg
    note: "WSTG Bug Bounty Programs bo'limi: bug bounty va pentest farqi; dastur doirasi, rules of engagement, safe harbor (dastur shartlarida aniq berilishi) va oshkor qilish muddati"
  - id: cs-vuln-disclosure
    note: "Vulnerability Disclosure Cheat Sheet: tadqiqotchi va tashkilot uchun majburiyatlar, oshkor qilish modellari, security.txt, hisobot mazmuni"
quiz:
  - q: "Siz o'zingiz ishlaydigan kompaniya platformasining test muhitida zaiflik topdingiz va ishlab chiqarish (production) muhitida ham borligini tekshirmoqchisiz. Ruxsatingiz faqat test muhitiga berilgan. Nima to'g'ri?"
    options:
      - "Production'da faqat o'qish so'rovlari bilan tekshirish zararsiz"
      - "Tekshirish mumkin, chunki kompaniya sizniki"
      - "Production'ga tegmasdan, topilmani xavfsizlik jamoasiga yozma xabar qilish va production tekshiruviga ruxsat so'rash"
      - "Do'stingiz bilan birga tekshirish"
    answer: 2
    explain: "Ruxsat doirasi chegara: test muhitiga berilgan ruxsat production'ga tarqalmaydi. To'g'ri yo'l topilmani xabar qilish va keyingi qadam uchun ruxsat so'rash."
  - q: "OWASP Vulnerability Disclosure Cheat Sheet'ga ko'ra, bug bounty dasturi bo'lmagan tashkilotga zaiflik haqida xabar berishda nima qilmaslik kerak?"
    options:
      - "Tafsilotlarni to'lov talab qilib, shart sifatida qo'yish"
      - "Aloqa ma'lumotini topishga urinish"
      - "Hisobotga shaxsiy ma'lumotni olib tashlash"
      - "Reproduksiya uchun yetarli tafsilot berish"
    answer: 0
    explain: "Cheat sheet to'lovni tafsilot oshkor qilishdan oldin talab qilishni tavsiya etmaydi: bu firibgarlik ko'rinishida bo'lib, yomon holda tovlamachilik (extortion) bo'lishi mumkin. Qolgan uch xatti-harakat tavsiya etilgan."
  - q: "Quyidagilardan qaysi biri responsible (coordinated) disclosure'ni to'g'ri tavsiflaydi?"
    options:
      - "Tafsilotlar darhol hammaga e'lon qilinadi"
      - "Zaiflik hech qachon e'lon qilinmaydi"
      - "Faqat bug bounty platformasida e'lon qilinadi"
      - "Dastlabki hisobot maxfiy beriladi, to'liq tafsilotlar esa tuzatish tayyor bo'lgach (ko'pincha kelishilgan muddatdan keyin) e'lon qilinadi"
    answer: 3
    explain: "Responsible disclosure private disclosure va full disclosure o'rtasidagi o'rta yo'l: avval maxfiy xabar, tuzatishdan keyin yoki muddat o'tgach e'lon."
  - q: "Telemetriya eksporti haydovchi ismi bilan GPS izini o'z ichiga oladi. Shaxsga doir ma'lumotlar to'g'risidagi qonun nuqtai nazaridan eng to'g'ri yondashuv?"
    options:
      - "Telemetriya texnik ma'lumot, qonun tegishli emas"
      - "Bu shaxsni aniqlashga imkon beruvchi ma'lumot bo'lishi mumkin: qonunning ta'rifi, rozilik, maqsad va xavfsizlik talablarini yuristlar bilan tekshirish kerak"
      - "Faqat parollar shaxsga doir ma'lumot"
      - "Mijoz kompaniya javobgar, platforma emas"
    answer: 1
    explain: "Qonun shaxsga doir ma'lumotni muayyan jismoniy shaxs haqidagi yoki uni aniqlashga imkon beradigan ma'lumot sifatida ta'riflaydi. Haydovchi ismi bilan bog'langan GPS izi shunga tushishi mumkin; aniq huquqiy baho yuristning ishi."
  - q: "Sinash vositasi doirani `target.includes(\"lab.fleet.test\")` bilan tekshiradi. Qaysi manzil noto'g'ri ravishda doira ichida deb hisoblanadi?"
    options:
      - "https://lab.fleet.test/api"
      - "https://api.fleet.test/"
      - "https://example.org/"
      - "https://lab.fleet.test.evil.example/api"
    answer: 3
    explain: "`includes` matn ichidan qidiradi, shuning uchun `lab.fleet.test.evil.example` kabi boshqa domen ham mos keladi. To'g'ri tekshiruv URL'ni tahlil qilib, hostname'ni aniq solishtiradi."
  - q: "Kiberxavfsizlik to'g'risidagi qonunning 24-moddasiga ko'ra, zaifliklar haqidagi ma'lumotdan qanday foydalanish kerak?"
    options:
      - "Istalgan maqsadda, faqat uni sotmaslik sharti bilan"
      - "Maqola yozish uchun erkin"
      - "Faqat ularni bartaraf etish va noqonuniy harakatlarning oldini olish uchun; oshkor qilish esa subyekt ruxsati va himoya choralari ko'rilgandan keyin"
      - "Qonun bu haqda hech narsa demaydi"
    answer: 2
    explain: "lex.uz'dagi matnga ko'ra 24-modda tahdid va zaifliklar haqidagi ma'lumotni faqat ularni bartaraf etish va noqonuniy harakatlarning oldini olish uchun ishlatishni belgilaydi, oshkor qilish esa subyekt ruxsati bilan va himoya choralari ko'rilgandan keyin mumkin."
task:
  title: "Sinash doirasini (scope) aniq tekshirish"
  prompt: |
    O'quv skaneri faqat `lab.fleet.test` va uning subdomenlariga (`api.lab.fleet.test`) tegishi kerak, faqat `http` yoki `https` orqali. `inScope(target)` hozir `includes` bilan tekshiradi va `lab.fleet.test.evil.example`, `notlab.fleet.test` hamda `http://lab.fleet.test@evil.example/` kabi manzillarni noto'g'ri qabul qiladi.

    Funksiyani tuzating: URL'ni `new URL` bilan tahlil qiling (tahlil xato bersa, `false`), protokol `http:` yoki `https:` bo'lsin, hostname aniq `lab.fleet.test` yoki `.lab.fleet.test` bilan tugaydigan subdomen bo'lsin, URL ichida login yoki parol (userinfo) bo'lmasin. Imzoni o'zgartirmang. Kutilgan natija: `true, true, false, false, false, false, false`.
  lang: ts
  starter: |
    const SCOPE = "lab.fleet.test";

    function inScope(target: string): boolean {
      return target.includes(SCOPE);
    }

    const cases = [
      "https://lab.fleet.test/api/vehicles",
      "http://api.lab.fleet.test:8080/",
      "https://lab.fleet.test.evil.example/",
      "https://notlab.fleet.test/",
      "http://lab.fleet.test@evil.example/",
      "ftp://lab.fleet.test/",
      "lab.fleet.test",
    ];
    for (const c of cases) console.log(inScope(c));
  solution: |
    const SCOPE = "lab.fleet.test";

    function inScope(target: string): boolean {
      let u: URL;
      try {
        u = new URL(target);
      } catch {
        return false; // tahlil qilib bo'lmasa, doiradan tashqari
      }
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      if (u.username !== "" || u.password !== "") return false;
      return u.hostname === SCOPE || u.hostname.endsWith("." + SCOPE);
    }

    const cases = [
      "https://lab.fleet.test/api/vehicles",
      "http://api.lab.fleet.test:8080/",
      "https://lab.fleet.test.evil.example/",
      "https://notlab.fleet.test/",
      "http://lab.fleet.test@evil.example/",
      "ftp://lab.fleet.test/",
      "lab.fleet.test",
    ];
    for (const c of cases) console.log(inScope(c));
  solutionNotes: |
    - Hostname `new URL` tomonidan ajratiladi, shuning uchun `lab.fleet.test@evil.example` dagi haqiqiy host `evil.example` bo'ladi va rad etiladi (userinfo ham alohida rad etiladi).
    - `endsWith("." + SCOPE)` nuqta chegarasini talab qiladi: `notlab.fleet.test` mos kelmaydi.
    - Tahlil xatosi va noma'lum protokol doiradan tashqari deb olinadi (fail-safe default, 3-dars).
    - Bu faqat manzil matnini tekshiradi. DNS yoki redirect orqali boshqa hostga o'tishni (masalan, doira ichidagi domen tashqariga yo'naltirsa) yopmaydi: haqiqiy sinovda har so'rov oldidan ham, redirect'dan keyin ham tekshirish va yozma ruxsat kerak.
  checklist:
    - "URL `new URL` bilan tahlil qilinadi, tahlil xatosi rad etiladi"
    - "Hostname aniq yoki nuqta chegarali subdomen sifatida solishtiriladi"
    - "Userinfo bor manzillar rad etiladi"
    - "Faqat http va https ruxsat etiladi"
    - "Tekshiruv yozma ruxsat o'rnini bosmasligini ayta olasiz"
---

## Muammo

Xavfsizlik bilimi ikki tomonlama: himoyalanishni o'rgatadigan bilim hujum qilishni ham o'rgatadi. Bu kursda SQL injection, XSS va boshqa hujumlar ko'rsatiladi. Ularni faqat o'z tizimingizda, o'z laboratoriyangizda sinash mumkin. Boshqa birovning tizimida, ruxsatsiz sinash, hatto "yaxshi niyat bilan" bo'lsa ham, jinoiy javobgarlikka olib kelishi mumkin.

Muammo ikki yo'nalishda chiqadi. Birinchisi, dasturchi yoki talaba qiziqish bilan biror sayt yoki kompaniyaning tizimini "faqat tekshirib ko'rish" uchun sinaydi, topilmasini xabar qilmoqchi bo'ladi, lekin ruxsatsiz kirish allaqachon sodir bo'lgan. Ikkinchisi, kompaniya tashqaridan kelgan xabarga dushmanlik bilan javob beradi: tadqiqotchini yuristlar bilan qo'rqitadi, zaiflik esa yopilmay qoladi.

Bu darsning vazifasi huquqshunoslik kursi bo'lish emas. Dasturchi sifatida ikki narsani bilishingiz kerak: ruxsat va doira chegarasi qayerda, va zaiflik topilsa yoki sizga xabar kelsa, jarayon qanday bo'lishi kerak. Qonunlarni lex.uz saytidagi amaldagi matn bo'yicha ko'rib chiqamiz, lekin bu dars huquqiy maslahat emas: qaror qabul qilishdan oldin yurist bilan maslahatlashing.

## Asosiy g'oya

### Ruxsat va doira

Xavfsizlik sinovining asosiy chegarasi bitta: aniq, oldindan berilgan ruxsat va aniq belgilangan doira (scope). WSTG bug bounty dasturlari bo'limida shunday ta'riflanadi: tashkilot doirani (qaysi domen, ilova va API'lar sinashga ruxsat etilgan), rules of engagement'ni (qanday usullar mumkin) va oshkor qilish muddatini e'lon qiladi; tadqiqotchi faqat e'lon qilingan doira ichida ishlashi kerak. Shu sahifa yaxshi niyatdagi tadqiqotchiga qonuniy himoya (safe harbor) dastur shartlarida aniq berilishi kerakligini ham aytadi. Bu xulosa muhim: safe harbor avtomatik emas, u shartnoma yoki dastur shartlarida yozilgan bo'ladi.

OWASP Vulnerability Disclosure Cheat Sheet ham shu fikrni takrorlaydi: sinashdan oldin o'z yurisdiksiyangizdagi qonunlarni bilishingiz va tushunishingiz kerak; doira va dastur qoidalaridan chiqish jinoyat bo'lishi mumkin. Sahifa o'zi huquqiy maslahat emasligini ham ochiq yozadi. Tadqiqotchi uchun asosiy qoidalar: sinash qonuniy va ruxsat etilgan bo'lsin, boshqalarning maxfiyligini hurmat qiling, tashkilot xavfsizlik jamoasiga murojaat qilishga harakat qiling, tekshirish uchun yetarli tafsilot bering.

Dasturchi sifatida o'z kompaniyangiz tizimini sinashda ham ruxsat kerak. "Men bu tizimni yozganman" ruxsat degani emas: ish beruvchi ruxsat doirasini (qaysi muhit, qaysi vaqt, qanday usullar) yozma belgilab berishi kerak. Ayniqsa production'da: u yerda real mijoz ma'lumoti va real foydalanuvchilar bor.

### O'zbekiston qonunchiligi: Kiberxavfsizlik to'g'risida

"Kiberxavfsizlik to'g'risida"gi qonun (O'RQ-764, 15.04.2022) lex.uz saytida joylashgan. Qonun 40 ta moddadan iborat va 17.07.2022 da kuchga kirgan (40-modda: rasmiy e'lon qilingandan uch oy o'tgach). Quyida dasturchi uchun muhim qoidalar lex.uz'dagi matn bo'yicha qisqacha berilgan; bu bayon, to'liq matnni o'zingiz o'qing.

- 3-modda 13 ta tushunchani ta'riflaydi. Kiberxavfsizlik - shaxs, jamiyat va davlat manfaatlarining kibermakondagi tashqi va ichki tahdidlardan himoyalanganlik holati. Kiberxavfsizlik hodisasi - kibermakonda axborot tizimlari ishlashida uzilishlarga va (yoki) axborotning ochiqligi, yaxlitligi yoki undan erkin foydalanilishining buzilishiga olib kelgan hodisa. Kiberhujum - kibermakonda apparat, apparat-dasturiy va dasturiy vositalardan foydalangan holda qasddan amalga oshiriladigan, kiberxavfsizlikka tahdid soladigan harakat. Kibertahdid - kibermakonda shaxs, jamiyat va davlat manfaatlariga tahdid soluvchi shart-sharoitlar va omillar majmui. Ta'rifdagi yaxlitlik va foydalanish imkoniyati 1-darsdagi CIA xususiyatlariga mos keladi. Zaiflik (vulnerability) 3-moddada ta'riflanmagan; 23 va 24-moddalar bu so'zni ta'rifsiz ishlatadi, shuning uchun "zaiflik" nimaligini qonun emas, texnik standartlar (7-dars) belgilaydi.
- 16-modda kiberxavfsizlik subyektlarining huquq va majburiyatlarini beradi. Majburiyatlar: ma'lumotni noqonuniy tarqatish, o'g'irlash, o'zgartirish, bloklash, soxtalashtirish va ruxsatsiz kirishning oldini olish va bunday holat yuz berganda tezkor choralar ko'rish; ruxsatsiz kirish yoki o'zgartirishdan keyin tizimni tez tiklash; kiberxavfsizlik hodisalari va kiberjinoyatlar haqida vakolatli davlat organini xabardor qilish; tahlil uchun zarur raqamli izlar va ma'lumotni saqlash.
- 22-24-moddalar kiberxavfsizlik hodisalariga bag'ishlangan. 22-modda hodisalarni vakolatli organ mansabdor shaxslari tekshirishini, resurs egasida yetarli resurs va texnik imkoniyat bo'lsa u ham tekshira olishini, lekin natijani vakolatli organga bildirishini belgilaydi. 23-modda subyektlar choralari qatorida dastur va qurilmalardagi zaiflik va xatolarni bartaraf etishni, zararli dasturni cheklashni va kiberhujum manbalarini texnik jihatdan cheklashni nomlaydi. 24-modda axborot tizimlari va resurslarida aniqlangan zaifliklar, kibertahdidlar va kiberhujumlar haqidagi axborot kiberxavfsizlik subyektining ruxsati bilan va ularni himoya qilish choralari ko'rilgandan keyin oshkor qilinishi mumkinligini belgilaydi; aniqlangan kibertahdidlar va zaifliklar haqidagi axborotdan esa faqat ularni bartaraf etish hamda qonunga xilof harakatlarning oldini olish uchun foydalanish kerak.
- 37-modda javobgarlik haqida va bitta jumladan iborat: kiberxavfsizlik qonunchiligini buzganlikda aybdor shaxslar belgilangan tartibda javobgarlikka tortiladi. Jazo turlari qonunning o'zida yo'q; lex.uz izohi ma'muriy javobgarlik va jinoyat kodekslariga havola qiladi. Aniq moddalar va jazolarni o'sha kodekslarning amaldagi matnidan o'qing: bu dars ularni qamramaydi.

Amaliy xulosa. Qonun subyektlarga hodisa haqida xabar berish va tizimni tiklash majburiyatini yuklaydi, zaifliklar haqidagi axborotni esa tuzatish maqsadidan tashqarida ishlatishni cheklaydi. Moddalar ro'yxatida (1-40) mustaqil xavfsizlik tadqiqotchisiga ruxsatsiz sinash huquqini beradigan yoki uni alohida himoya qiladigan modda yo'q. Shuning uchun tadqiqotchi uchun himoya qonundan emas, tizim egasining yozma ruxsati va dastur shartlaridagi safe harbor'dan keladi.

### Shaxsga doir ma'lumotlar to'g'risida

"Shaxsga doir ma'lumotlar to'g'risida"gi qonun (O'RQ-547, 02.07.2019) 01.10.2019 da kuchga kirgan va keyin bir necha marta o'zgartirilgan: lex.uz tahrirlar ro'yxatida 2021 (15.01 va 21.04), 2023 (29.11) va 2026 yil tahrirlari bor, oxirgisi 12.09.2026. Quyidagi bayon amaldagi tahrirga tayanadi; dastlabki 2019 matnida, masalan, 27-1-modda yo'q edi. Vakolatli organ - Vazirlar Mahkamasi huzuridagi Davlat personalizatsiya markazi (8-modda). Asosiy qoidalar:

- 4-modda ta'riflar beradi: shaxsga doir ma'lumot - muayyan jismoniy shaxsga tegishli yoki uni identifikatsiya qilish imkonini beradigan, elektron, qog'oz yoki boshqa moddiy tashuvchidagi axborot. Subyekt - ma'lumot tegishli shaxs; operator ishlov berishni amalga oshiradi, mulkdor ma'lumotlar bazasiga egalik qiladi.
- 5-modda tamoyillarni sanaydi: konstitutsiyaviy huquqlarga rioya, ishlov berish maqsadi va usullarining qonuniyligi, ma'lumotning aniqligi va ishonchliligi, maxfiylik va himoya va boshqalar. 19-modda talablariga ko'ra ishlov berish maqsadi to'planish paytida e'lon qilingan maqsadga mos bo'lishi kerak, maqsad o'zgarsa subyektning yangi roziligi olinadi, ma'lumot aniq va kerak bo'lsa yangilangan bo'lishi, ishlov berish esa rozilik muddatidan oshmasligi kerak.
- 21-modda rozilik shakli haqida: rozilik uning olinganini tasdiqlash imkonini beradigan har qanday shaklda berilishi mumkin; shaxsga doir maxsus ma'lumotlar uchun yozma (elektron hujjat shaklida ham) rozilik kerak; rozilik qaytarib olinishi mumkin. 25-modda maxsus ma'lumotlar toifalarini sanaydi (jumladan sog'liq, shaxsiy hayot, jinoiy sudlanganlik, siyosiy va diniy qarashlar) va ularga ishlov berishni istisnolar bo'lmasa taqiqlaydi.
- 27-modda himoya kafolatlari: mulkdor, operator va uchinchi shaxs ma'lumotning yaxlitligi va to'liqligi, maxfiyligini ta'minlash va noqonuniy ishlov berishning oldini olish uchun huquqiy, tashkiliy va texnik choralar ko'rishi kerak.
- 15-modda ma'lumotni O'zbekiston hududidan tashqariga uzatishni tartibga soladi: umumiy qoida bo'yicha subyektlar huquqlari teng himoyalanishini ta'minlaydigan davlatlarga uzatish mumkin, boshqa hollarda faqat qonunda sanalgan sharoitlarda (masalan, subyekt roziligi bilan); xavfsizlik va mudofaa manfaatlari uchun uzatish taqiqlanishi yoki cheklanishi mumkin.
- 27-1-modda (2026 yil 26 martdagi O'RQ-1125 tahririda) saqlash joyiga oid maxsus shartlarni beradi. Ikkinchi qismiga ko'ra jismoniy shaxslarning biometrik va genetik ma'lumotlari hamda O'zbekistonda faoliyat yurituvchi telekommunikatsiya operatorlaridagi ma'lumotlar O'zbekiston hududida saqlanishi shart. Qolgan shaxsga doir ma'lumotlar chet elda saqlanishi va ishlov berilishi mumkin, agar uch shartdan biri bajarilsa: chet davlat ma'lumotlar teng himoyalanishini ta'minlovchi davlat deb tan olingan bo'lsa; operator vakolatli organ tasdiqlagan talablarga javob beradigan standart shartnoma shartlari yoki majburiy korporativ qoidalarni qabul qilib, ularga rioya qilsa; yoki operator vakolatli organ tasdiqlagan ro'yxatdagi xalqaro standartlarga amal qilsa. Teng himoya beruvchi davlatlar ro'yxatini Vazirlar Mahkamasi belgilaydi. 20-modda O'zbekistonda saqlanishi shart bo'lgan ma'lumotlar bazalarini davlat reyestrida ro'yxatdan o'tkazishni talab qiladi.

Avtopark platformasi uchun oqibat: haydovchining ismi, telefon raqami yoki davlat raqami bilan bog'langan GPS izi muayyan shaxsni aniqlashga imkon bersa, ehtimol bu qonun ta'rifiga tushadi (bu kursning talqini, yuridik xulosa emas). Agar platforma bunday ma'lumotni chet eldagi bulutda saqlasa, 15 va 27-1-moddalarni yurist bilan ko'rib chiqish kerak: telefon raqami va biometrik ma'lumot qaysi toifaga tushishi, qaysi shartlardan biri bajarilishi aniq baholanadi. Shuning uchun o'quv laboratoriyasida real haydovchi ma'lumotidan foydalanmang, hisobot va log ichiga real telefon raqamini yozmang va tadqiqot natijalarida shaxsga doir ma'lumotni yashiring. Platforma qatlamidagi talablar (maqsad, rozilik, saqlash muddati, xavfsizlik) 94-darsda ko'riladi.

## Chuqurroq: responsible disclosure

### Uch model

Vulnerability Disclosure Cheat Sheet oshkor qilishning uch modelini ajratadi. Private disclosure: zaiflik tashkilotga maxfiy xabar qilinadi, e'lon qilish tashkilot ixtiyorida; ko'pchilik bug bounty dasturlari shuni talab qiladi, kamchiligi tashkilot javob bermasa tafsilotlar hech qachon e'lon qilinmasligi mumkin. Full disclosure: tafsilotlar topilishi bilan hammaga e'lon qilinadi, ba'zan exploit kodi bilan; sahifa uni munozarali deb ataydi va faqat boshqa yo'llar ish bermaganda yoki exploit allaqachon ommaviy bo'lganda ko'rib chiqishni tavsiya qiladi. Responsible (coordinated) disclosure: dastlabki hisobot maxfiy, to'liq tafsilotlar esa tuzatish tayyor bo'lgach e'lon qilinadi; ko'pincha tadqiqotchi javob yoki tuzatish uchun muddat qo'yadi. Cheat sheet misol sifatida Google Project Zero siyosatini keltiradi: odatda tuzatish uchun 90 kun, tuzatishdan keyin 30 kun o'tgach texnik tafsilotlar e'lon qilinadi, ekspluatatsiya qilinayotgan zaifliklar uchun istisnolar bor.

### Bug bounty va pentest farqi

WSTG bug bounty dasturini an'anaviy penetration testdan farqlaydi. Pentest vaqt bilan cheklangan, bitta jamoa o'tkazadi, odatda white-box yoki gray-box (kod va arxitektura beriladi), doirasi shartnomada kelishiladi va rasmiy hisobot bilan tugaydi. Bug bounty uzluksiz, ko'p tadqiqotchi ishtirok etadi, black-box ishlaydi, doirani dastur egasi bir tomonlama belgilaydi va to'lov har topilma uchun. Bundan xulosa: bounty tadqiqotchisi faqat e'lon qilingan doira ichida ishlaydi, doira o'rtada o'zgarishi mumkin (uni muntazam qayta o'qing), doiradan tashqari topilma haqiqiy bo'lsa ham rad etiladi. WSTG oshkor qilish muddati uchun odatiy oraliq sifatida 30-90 kunni keltiradi.

### Tadqiqotchi sifatida

Zaiflik topganingizda (ruxsat doirasida yoki tasodifan), cheat sheet tavsiyalarining qisqa ro'yxati: aloqa uchun avval tashkilotning e'lon qilingan siyosati va `/.well-known/security.txt` faylini qidiring (RFC 9116 bo'yicha, kamida Contact va Expires maydonlari bor); topilmasa `security@` kabi manzil yoki kontakt sahifasi, kerak bo'lsa milliy CERT. Hisobotda nuqsonni tushunish va qayta ishlab chiqish uchun yetarli tafsilot, HTTP so'rov va javoblar, ta'siri bo'lishi kerak, lekin shaxsga doir ma'lumot olib tashlanadi. To'lov yoki mukofotni tafsilotlarni ochishdan oldin talab qilmang: bu tovlamachilik bo'lishi mumkin.

Quyidagi kod hisobotga tushadigan dalildan telefon raqami va davlat raqamini yashiradi. Naqsh o'quv uchun: real tizimda yashiriladigan maydonlar ro'yxati ma'lumot modelingizdan kelib chiqadi.

```ts run
// O'zbekiston telefon formati va davlat raqami formati bu yerda o'quv soddalashtirishi
const PHONE = /\+998[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g;
const PLATE = /\b\d{2}\s?[A-Z]\s?\d{3}\s?[A-Z]{2}\b/g;

function redact(evidence: string): string {
  return evidence.replace(PHONE, "[telefon]").replace(PLATE, "[davlat raqami]");
}

const response = '{"driver":"Test Haydovchi","phone":"+998 90 123 45 67","plate":"01 A 111 AA","fuel":62}';
console.log(redact(response));
```

```text
{"driver":"Test Haydovchi","phone":"[telefon]","plate":"[davlat raqami]","fuel":62}
```

Ro'yxat yetarli emas: ism ("Test Haydovchi") yashirilmadi, va regex'lar faqat ma'lum formatlarni topadi. Eng ishonchli yo'l real ma'lumotni dalilga umuman kiritmaslik, ya'ni sinovni sintetik ma'lumotli laboratoriyada o'tkazish (10-dars).

### Tashkilot sifatida

Tashqaridan hisobot keladigan tomon uchun cheat sheet ro'yxati: xabar yuborish uchun aniq yo'l bering, javob muddatini oqilona belgilang, tadqiqotchi bilan ochiq muloqot qiling, yuridik tahdid qilmang, kerak bo'lsa CVE so'rang, aniq advisory va changelog chiqaring, mukofot va e'tirof bering. Bug bounty dasturi bo'lsa, WSTG ko'rsatganidek, doira, safe harbor, ruxsat etilgan usullar va oshkor qilish muddati dastur shartlarida yozilgan bo'lishi kerak. Qonunning 16-moddasi esa hodisa haqida vakolatli organni xabardor qilish majburiyatini qo'yadi: hisobot tashqi tadqiqotchidan kelsa ham, uni hodisa jarayoniga ulash kerak (93-dars).

## Misol: sinash vositasining doirasi

Kod o'quv maqsadida: u faqat bizning `inScope` funksiyamizga qarshi, haqiqiy tizim yo'q. `.test` va `.example` domenlari faqat hujjat va sinov uchun ajratilgan, real tizimlarga tegishli emas. Misol sinash vositasi (masalan, o'zingiz yozgan skaner) ruxsatsiz hostga tegib ketishining oldini olish mexanizmini ko'rsatadi.

### 1. Zaif kod

```ts run
const SCOPE = "lab.fleet.test";

// ZAIF: doira matn ichidan qidiriladi
function inScopeWeak(target: string): boolean {
  return target.includes(SCOPE);
}

const targets = [
  "https://lab.fleet.test/api",
  "https://lab.fleet.test.evil.example/api",
  "https://notlab.fleet.test/",
  "http://lab.fleet.test@evil.example/",
];
for (const t of targets) console.log(inScopeWeak(t) ? "doira ichida " : "doiradan tashqari", t);
```

### 2. Hujum

"Hujumchi" bu yerda xato yoki ataylab o'zgartirilgan sinash ro'yxati: vosita doira tekshiruvidan o'tgan, lekin aslida boshqa hostga so'rov yuboradigan manzillar. Matn ichidan qidirish bularni ham o'tkazib yuboradi:

```text
doira ichida  https://lab.fleet.test/api
doira ichida  https://lab.fleet.test.evil.example/api
doira ichida  https://notlab.fleet.test/
doira ichida  http://lab.fleet.test@evil.example/
```

Birinchisidan boshqa uchalasi ham doiradan tashqarida. Oxirgisida haqiqiy host `evil.example`: `lab.fleet.test@` qismi login sifatida talqin qilinadi. Real sinovda bu ruxsatsiz hostga so'rov yuborish, ya'ni 1-qismdagi ruxsat chegarasini buzish bo'lardi.

### 3. Tuzatilgan kod

```ts run
const SCOPE = "lab.fleet.test";

function inScope(target: string): boolean {
  let u: URL;
  try {
    u = new URL(target);
  } catch {
    return false;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return false;
  if (u.username !== "" || u.password !== "") return false;
  return u.hostname === SCOPE || u.hostname.endsWith("." + SCOPE);
}

const targets = [
  "https://lab.fleet.test/api",
  "https://api.lab.fleet.test/",
  "https://lab.fleet.test.evil.example/api",
  "https://notlab.fleet.test/",
  "http://lab.fleet.test@evil.example/",
  "ftp://lab.fleet.test/",
];
for (const t of targets) console.log(inScope(t) ? "doira ichida " : "doiradan tashqari", t);
```

```text
doira ichida  https://lab.fleet.test/api
doira ichida  https://api.lab.fleet.test/
doiradan tashqari https://lab.fleet.test.evil.example/api
doiradan tashqari https://notlab.fleet.test/
doiradan tashqari http://lab.fleet.test@evil.example/
doiradan tashqari ftp://lab.fleet.test/
```

Endi tekshiruv URL'ni tahlil qiladi va hostname'ni aniq solishtiradi, shuning uchun ko'rsatilgan to'rt hiyla yopiladi. Qoldiq risk: tekshiruv faqat manzil matnini ko'radi. DNS ko'rsatmasi (doira ichidagi nom tashqi IP ga yo'naltirilgan bo'lishi) va redirect (javob boshqa hostga yo'naltirishi) bu tekshiruvdan o'tib ketadi; ularni har so'rovdan oldin ham, redirect'dan keyin ham qayta tekshirish kerak. Eng muhimi, kod yozma ruxsat o'rnini bosmaydi: u faqat xato bilan chegaradan chiqib ketishning oldini oladi.

## Qachon qo'llamaslik kerak

- Bu dars huquqiy maslahat emas. Qonun matni o'zgaradi (ayniqsa shaxsga doir ma'lumotlar to'g'risidagi qonun keyingi tahrirlarga ega), va jinoiy javobgarlik boshqa qonunlarda. Muhim qarorlarda (zaiflik haqida xabar berish, ma'lumot yig'ish, mijoz bilan shartnoma) yurist bilan ishlang.
- Doira tekshiruvi avtomatlashtirilgan vosita uchun himoya qatlami, ruxsat emas. Ruxsat yozma, aniq doira, muddat va kontakt bilan bo'lishi kerak.
- Responsible disclosure har vaziyatda ham ishlamaydi: tashkilot javob bermasa, cheat sheet muqobillarni (anonim e'lon qilish, regulyator yoki ma'lumotlarni himoya qilish organiga xabar berish, voz kechish) ro'yxatlaydi va ularning har birining xavfini ochiq yozadi. Eng yaxshi tanlov holatga bog'liq va ko'pincha yurist bilan maslahatlashishni talab qiladi.
- Kichik jamoaga to'liq bug bounty dasturi ortiqcha. Ko'pincha yetarli minimum: `security.txt`, xavfsizlik uchun alohida email va xabarlarni kuzatadigan mas'ul odam.

## Stack'da: security.txt va hisobot jarayoni

Zaiflik haqida xabar berishni osonlashtirish uchun veb-saytingizda `/.well-known/security.txt` faylini joylashtiring. Next.js loyihada u `public/.well-known/security.txt` yo'lida statik fayl bo'lishi mumkin. Cheat sheet kamida `Contact` va `Expires` maydonlarini talab qiladi; ixtiyoriy maydonlar (`Preferred-Languages`, `Canonical`, `Policy`, `Hiring`) yo'naltirishni yaxshilaydi. Misol (manzillar `.test` va `.example` hujjat domenlari):

```text
Contact: mailto:security@fleet.example
Expires: 2027-06-30T00:00:00.000Z
Preferred-Languages: uz, ru, en
Canonical: https://fleet.example/.well-known/security.txt
Policy: https://fleet.example/security-policy
```

`Expires` sanasi o'tib ketmasligini nazorat qiling: eskirgan fayl yomonroq ishlaydi, shuning uchun uni CI'da tekshiruvchi test qo'shish foydali:

```ts
import { readFileSync } from "node:fs";

// public/.well-known/security.txt dagi Expires o'tib ketmaganini tekshiradi (CI testi)
export function securityTxtIsFresh(path: string, now: Date): boolean {
  const text = readFileSync(path, "utf8");
  const contact = /^Contact:\s*\S+/m.test(text);
  const expires = /^Expires:\s*(\S+)/m.exec(text)?.[1];
  if (!contact || !expires) return false;
  const when = new Date(expires);
  return !Number.isNaN(when.getTime()) && when.getTime() > now.getTime();
}
```

Bu kod ishga tushirilmaydi (Node `fs` brauzer worker'ida yo'q). Ichki jarayon uchun: hisobot qabul qiladigan navbat, mas'ul odam, javob muddati, tuzatilgandan keyin tadqiqotchiga xabar berish va, kerak bo'lsa, advisory chiqarish.

## Xulosa

- Xavfsizlik sinovining chegarasi: aniq, oldindan berilgan yozma ruxsat va aniq doira. "Men yozganman" yoki "yaxshi niyat" ruxsat emas.
- Kiberxavfsizlik to'g'risidagi qonun (O'RQ-764, 15.04.2022) hodisa haqida xabar berish va zaifliklar haqidagi ma'lumotdan faqat tuzatish maqsadida foydalanishni belgilaydi; to'liq matn va jazolarni lex.uz'da va tegishli qonunlarda o'qing.
- Shaxsga doir ma'lumotlar to'g'risidagi qonun (O'RQ-547, 02.07.2019) ma'lumotni muayyan shaxsni aniqlash imkoniyati bilan ta'riflaydi; GPS izi haydovchi bilan bog'langanda shu toifaga tushishi mumkin. Laboratoriyada real ma'lumot ishlatmang.
- Responsible disclosure: maxfiy hisobot, tafsilotlarni tuzatishdan keyin e'lon qilish; to'lovni tafsilotdan oldin talab qilmang, dalildan shaxsga doir ma'lumotni olib tashlang.
- Tashkilot sifatida xabar yuborish yo'lini (security.txt, siyosat) bering, tadqiqotchini yuridik bosim bilan qo'rqitmang va hisobotni hodisa jarayoniga ulang.
- Bu dars huquqiy maslahat emas: muhim qarorlarda yurist bilan ishlang.
