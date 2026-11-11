---
n: 9
slug: huquqiy-va-etik-chegaralar
title: "Huquqiy va etik chegaralar: O'zbekiston qonunchiligi va responsible disclosure"
summary: "Xavfsizlikni sinashda ruxsat va doira (scope) chegarasi; Kiberxavfsizlik to'g'risidagi qonun (O'RQ-764) va Jinoyat kodeksining XX1 bobi (278-1 - 278-7-moddalar) matni bo'yicha tadqiqotchi va tashkilot majburiyatlari; pentest shartnomasi, bug bounty va responsible disclosure; sinash vositasining doirasini to'g'ri tekshirish misoli."
duration: 40
sources:
  - id: lex-cyber
    note: "lex.uz O'RQ-764 (15.04.2022, kuchga kirishi 17.07.2022), 40 modda, hammasi o'qilgan; sahifada o'zgartirish kiritgan qonunlar ko'rsatilmagan. 3-modda ta'riflar (zaiflik ta'rifi yo'q), 11-12 vakolatli organ (Davlat xavfsizlik xizmati), 15 zaxira nusxalar, 16 kiberxavfsizlik subyektlarining majburiyatlari, 18-21 ekspertiza, sertifikatlash, attestatsiya, baholash, 22-24 hodisalar va ma'lumotni oshkor qilish, 26-31 muhim axborot infratuzilmasi, 37 javobgarlik (bir jumla)"
  - id: lex-criminal-code
    note: "lex.uz Jinoyat kodeksi, joriy tahrir (sahifadagi oxirgi o'zgartirish 04.11.2026, 03/26/1186/1095-son): XX1 bob 'Axborot texnologiyalari sohasidagi jinoyatlar', 278-1 (axborotlashtirish qoidalarini buzish), 278-2 (kompyuter axborotidan ruxsatsiz foydalanish), 278-3 (maxsus vositalarni tayyorlash va tarqatish), 278-4 (modifikatsiyalashtirish), 278-5 (kompyuter sabotaji), 278-6 (zarar keltiruvchi dasturlar), 278-7 (telekommunikatsiya tarmog'idan ruxsatsiz foydalanish) to'liq o'qilgan; 141-2 (shaxsga doir ma'lumotlar to'g'risidagi qonunchilikni buzish) 94-darsda"
  - id: lex-admin-code
    note: "lex.uz Ma'muriy javobgarlik to'g'risidagi kodeks, joriy tahrir (oxirgi o'zgartirish 04.11.2026): 155-1 (kompyuter tizimidan foydalanish qoidalarini buzish), 155-2 (telekommunikatsiya tarmog'idan ruxsatsiz foydalanish) o'qilgan; 46-2 94-darsda"
  - id: lex-pdp
    note: "lex.uz O'RQ-547 (02.07.2019) joriy tahrir, to'liq o'qilgan: tahrirlar 15.01.2021, 21.04.2021 (O'RQ-683), 29.11.2023 (O'RQ-880), 27.03.2026 (O'RQ-1125), 14.07.2026 (O'RQ-1158), 12.09.2026 (O'RQ-1174). Bu darsda faqat 4-modda (shaxsga doir ma'lumot ta'rifi) va 94-darsga havola"
  - id: wstg
    note: "WSTG Bug Bounty Programs bo'limi: bug bounty va pentest farqi; dastur doirasi, rules of engagement, safe harbor (dastur shartlarida aniq berilishi) va oshkor qilish muddati"
  - id: cs-vuln-disclosure
    note: "Vulnerability Disclosure Cheat Sheet: tadqiqotchi va tashkilot uchun majburiyatlar, oshkor qilish modellari, security.txt, hisobot mazmuni"
quiz:
- q: Siz o'zingiz ishlaydigan kompaniya platformasining test muhitida zaiflik topdingiz va ishlab chiqarish (production) muhitida ham borligini tekshirmoqchisiz. Ruxsatingiz faqat test muhitiga berilgan. Nima to'g'ri?
  options:
  - Production'da faqat o'qish so'rovlari bilan tekshirish zararsiz
  - Tekshirish mumkin, chunki kompaniya sizniki
  - Production'ga tegmasdan, topilmani xavfsizlik jamoasiga yozma xabar qilish va production tekshiruviga ruxsat so'rash
  - Do'stingiz bilan birga tekshirish
  answer: 2
  explain: 'Ruxsat doirasi chegara: test muhitiga berilgan ruxsat production''ga tarqalmaydi. To''g''ri yo''l topilmani xabar qilish va keyingi qadam uchun ruxsat so''rash.'
- q: Siz bug bounty dasturi bo'lmagan kompaniyaning ilovasida zaiflik topdingiz va unga xat yozmoqchisiz. Xat qanday bo'lsa to'g'ri?
  options:
  - Qayta ishlab chiqish uchun yetarli tafsilot va ta'sir bor, shaxsga doir ma'lumot olib tashlangan, to'lov talab qilinmaydi
  - Tafsilotlar faqat to'lov kelishilgandan keyin ochiladi
  - Avval ijtimoiy tarmoqda e'lon qilinadi, keyin kompaniyaga yoziladi
  - Dalil sifatida haqiqiy mijoz yozuvlari ilova qilinadi
  answer: 0
  explain: 'Cheat sheet to''lovni tafsilot oshkor qilishdan oldin talab qilishni tavsiya etmaydi: bu tovlamachilik (extortion) ko''rinishida bo''lishi mumkin. Hisobotda shaxsga doir ma''lumot bo''lmasin, real yozuvni ilova qilish esa 278-2 dagi nusxa ko''chirish oqibatiga olib kelishi mumkin. Avval e''lon qilish 24-moddaga zid.'
- q: Siz topgan zaiflikni kompaniya tuzatdi. Siz texnik tafsilot bilan maqola yozmoqchisiz, lekin kompaniya e'longa ruxsat bermagan. O'RQ-764 24-moddasi nuqtai nazaridan nima to'g'ri?
  options:
  - Tuzatish tugagani uchun ruxsat shart emas
  - Kelishilgan muddat tugasa, ruxsatsiz ham e'lon qilish mumkin
  - Faqat ijtimoiy tarmoqda qisqa e'lon qilish mumkin
  - Axborot himoya choralari ko'rilgandan keyin va kiberxavfsizlik subyektining ruxsati bilan oshkor qilinishi mumkin; ruxsat bo'lmasa, avval ruxsat so'rash kerak
  answer: 3
  explain: '24-modda ikki shartni qo''yadi: himoya choralari ko''rilgan bo''lsin va subyektning ruxsati bo''lsin. Faqat tuzatish yetarli emas. ''Muddat tugadi - e''lon qilaman'' yondashuvi ruxsat bo''lmasa matnga zid kelishi mumkin (muallifning o''qishi). Kanal (ijtimoiy tarmoq yoki maqola) ruxsat o''rnini bosmaydi.'
- q: Shartnoma bo'yicha sizga faqat staging muhitini sinash ruxsat etilgan. SQL injection topdingiz va 'ta'sirni isbotlash uchun' production bazasidan 500 qator mijoz yozuvini ko'chirib oldingiz. Jinoyat kodeksining 278-2-moddasi nuqtai nazaridan nima to'g'ri?
  options:
  - Ruxsat bor, chunki shartnoma imzolangan
  - Production ruxsat doirasida emas va nusxa ko'chirish 278-2 matnidagi oqibatlardan biri; to'g'ri yo'l - ko'chirmasdan to'xtash va topilmani xabar qilish
  - Faqat o'chirish yoki o'zgartirish jinoyat, o'qish va nusxalash emas
  - Zaiflik topilgani uchun javobgarlik bo'lmaydi
  answer: 1
  explain: '278-2: ruxsatsiz foydalanish, agar u axborotdan nusxa ko''chirilishi yoki uning qo''lga kiritilishiga (yo''q qilish, to''sish, modifikatsiyalash bilan bir qatorda) sabab bo''lsa. Production doiradan tashqarida, ya''ni ruxsatsiz, nusxalash esa o''zi oqibat. Ta''sirni isbotlash uchun real yozuvni ko''chirish shart emas: so''rov natijasining shakli yoki sanog''i yetadi.'
- q: Siz o'quv skaneriga doira tekshiruvini `target.includes("lab.fleet.test")` bilan yozdingiz. Qaysi manzil noto'g'ri ravishda doira ichida deb hisoblanadi?
  options:
  - https://lab.fleet.test/api
  - https://api.fleet.test/
  - https://example.org/
  - https://lab.fleet.test.evil.example/api
  answer: 3
  explain: '`includes` matn ichidan qidiradi, shuning uchun `lab.fleet.test.evil.example` kabi boshqa domen ham mos keladi. To''g''ri tekshiruv URL''ni tahlil qilib, hostname''ni aniq solishtiradi.'
- q: Sizning kompaniyangiz muhim axborot infratuzilmasi (MAI) obyekti bo'lgan bank. Rahbariyat tashqi firmaga tizim xavfsizligini baholatmoqchi va shartnomani tezda imzolamoqchi. 31-modda bo'yicha nima qilish kerak?
  options:
  - Shartnoma yetarli, boshqa ruxsat kerak emas
  - Faqat hosting provayderdan ruxsat olish yetadi
  - 'Baholash vakolatli organ ruxsati bilan, ixtisoslashtirilgan tashkilotlar jalb etilgan holda o''tadi: shartnomadan oldin shu yo''lni aniqlash kerak'
  - Baholashni yashirincha o'tkazib, natijani keyin xabar qilish
  answer: 2
  explain: 31-modda MAI obyektlarining kiberxavfsizligini baholashni vakolatli organning ruxsati bilan, ixtisoslashtirilgan tashkilotlar jalb etilgan holda o'tkazishni belgilaydi. Shartnomaning o'zi bu ruxsat o'rnini bosmaydi; hosting egasining ruxsati alohida masala, yashirincha baholash esa ruxsatsiz harakat.
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

Xavfsizlik bilimi ikki tomonlama: himoyalanishni o'rgatadigan bilim hujum qilishni ham o'rgatadi. Bu kursdagi hujumlarni faqat o'z laboratoriyangizda sinang. Dasturchi amalda uchta vaziyatga duch keladi.

Birinchisi: staging'da zaiflik topdingiz va production'da ham borligini bilmoqchisiz. Skaner tayyor, lekin ruxsat faqat staging uchun berilgan, yozma hujjat esa yo'q. Production'ga ketgan har so'rov "ruxsatsiz" bo'lib qoladi, Jinoyat kodeksining 278-2-moddasida esa shu so'z markaziy belgi.

Ikkinchisi: SQL injection topdingiz va "ta'sirni isbotlash uchun" production bazasidan mijoz yozuvlarini nusxalab oldingiz. Hisobot uchun bu yaxshi dalil, qonun uchun esa nusxa ko'chirishning o'zi oqibat.

Uchinchisi: boshqa kompaniyaning ilovasida bug ko'rdingiz va u haqda maqola yozmoqchisiz. Kompaniya hali bilmaydi. Nima qilish mumkinligini O'RQ-764 ning 24-moddasi belgilaydi.

Teskari holat ham bor: kompaniya tashqaridan kelgan xabarga dushmanlik bilan javob beradi, zaiflik esa yopilmay qoladi. O'z platformangiz ham qonun obyekti: 278-1-modda himoya choralarini ko'rmasdan axborot tizimlarini yaratish va ishlatishni ham jinoyat deb belgilaydi. Matnlar lex.uz'dagi joriy tahrirdan o'qilgan.

## Asosiy g'oya

Hammasi oltita qoidaga tushadi. Har birida: qoida, nega (qonun yoki manba), amalda nima qilasiz.

**1. Sinashdan oldin yozma ruxsat va aniq doira (scope) bo'lsin.** Nega: 278-2, 278-3 va 278-7-moddalarida "ruxsatsiz" markaziy belgi, ruxsatni esa tizim egasi beradi; 278-1 - 278-7 matnida yaxshi niyatli tadqiqotchi uchun istisno yoki himoya yo'q. WSTG bug bounty bo'limiga ko'ra tashkilot doirani (qaysi domen, ilova va API), rules of engagement'ni (qanday usullar) va oshkor qilish muddatini e'lon qiladi, tadqiqotchi faqat shu doirada ishlaydi. Safe harbor avtomatik emas: u dastur shartlarida yozilgan bo'lishi kerak. OWASP Vulnerability Disclosure Cheat Sheet qo'shadi: doiradan chiqish jinoyat bo'lishi mumkin. Amalda: ish beruvchidan muhit, vaqt va usullarni yozma oling, production uchun alohida ruxsat so'rang, vositaga doira tekshiruvini kiriting (Misol bo'limi). "Men bu tizimni yozganman" ruxsat degani emas.

**2. Ta'sirni real ma'lumotni ko'chirmasdan isbotlang.** Nega: 278-2 bo'yicha ruxsatsiz foydalanish axborotning yo'q qilinishi, to'sib qo'yilishi, modifikatsiyalanishi, undan nusxa ko'chirilishi yoki qo'lga kiritilishiga sabab bo'lsa jinoyat; demak "isbot uchun" nusxalash o'zi oqibat bo'lishi mumkin. Amalda: so'rov natijasining shakli yoki sanog'ini ko'rsating, hisobotdagi shaxsga doir ma'lumotni yashiring (Chuqurroq bo'limidagi kod), imkon bo'lsa sintetik ma'lumotli laboratoriyada sinang (10-dars).

**3. Vositani yozishdan oldin uning maqsadini va tarqatish kanalini o'ylang.** Nega: 278-3 va 278-6 harakat uchun ham, vosita uchun ham javobgarlik belgilaydi. Muallifning talqini: boshqalarning tizimiga mo'ljallangan, ruxsatsiz foydalanishga xizmat qiladigan vositani o'tkazish maqsadida tayyorlash yoki tarqatish va zararli dastur yaratish jinoyat bo'lishi mumkin. Amalda: tayyor exploit'ni ochiq joyga qo'ymasdan oldin kimga va nima uchun ekanini aniqlang.

**4. Topilmani avval egasiga xabar qiling, e'lonni esa uning ruxsati bilan qiling.** Nega: 24-modda zaiflik haqidagi axborotni himoya choralari ko'rilgandan keyin va kiberxavfsizlik subyektining ruxsati bilan oshkor qilishga ruxsat beradi; shu axborotdan faqat zaiflikni bartaraf etish va qonunga xilof harakatlarning oldini olish uchun foydalanish kerak. Muallifning o'qishi: tashkilot ruxsat bermasa, "muddat tugadi - e'lon qilaman" yondashuvi matnga zid kelishi mumkin. Amalda: oshkor qilish tartibi va muddatini oldindan yozma kelishing, e'longa yozma ruxsat oling.

**5. O'z tizimingizda himoya choralarini ko'ring.** Nega: 278-1 tizim egasi va dasturchiga qaratilgan: belgilangan himoya choralarisiz tizim yaratish va ishlatish, ko'p miqdorda zarar bo'lsa, jinoyat. Amalda: himoya choralari talabi loyiha talablariga kirsin, hujjatlashtirilsin.

**6. Tashkilot sifatida xabar yo'lini bering va hodisani qonundagi jarayonga ulang.** Nega: 16-modda subyektlarni hodisa haqida vakolatli organni xabardor qilishga va raqamli izlarni saqlashga majbur qiladi. Amalda: `security.txt`, mas'ul odam, tashqi hisobotni hodisa jarayoniga ulash (93-dars).

### Vaziyatlar jadvali

| Vaziyat | Mumkinmi | Asos (modda) | Nima qilish kerak |
|---|---|---|---|
| Ruxsat faqat staging'ga berilgan, production'da ham tekshirmoqchisiz | Yo'q | 278-2 ("ruxsatsiz") | Production'ga tegmang, topilmani yozma xabar qiling va production uchun ruxsat so'rang |
| SQL injection topdingiz, isbot uchun production'dan 500 qator mijoz yozuvini ko'chirdingiz | Yo'q | 278-2 (nusxa ko'chirish oqibat) | To'xtang, ko'chirmang; so'rov shakli yoki sanog'ini ko'rsating |
| Bug bounty dasturining e'lon qilingan doirasi ichidagi domenni sinaysiz | Ha, doira va qoidalar ichida | WSTG; dastur shartlari ruxsat (muallifning o'qishi) | Doirani muntazam qayta o'qing, safe harbor shartlarda yozilganini tekshiring |
| Bounty dasturida ko'rsatilmagan domenga ham so'rov yubormoqchisiz | Yo'q | 278-2; doiradan tashqarida shartlar himoya bermaydi (muallifning o'qishi) | Egasiga xabar yozing va ruxsat so'rang |
| Zaiflik tuzatilgan, siz blogda tafsilot e'lon qilmoqchisiz, kompaniya ruxsat bermagan | Yo'q | 24 | Oldindan kelishilgan tartibga qayting, yozma ruxsat oling |
| Tayyor exploit'ni ochiq repozitoriyga qo'ymoqchisiz | Maqsad va kanalga bog'liq | 278-3, 278-6 (muallifning talqini) | Kimga mo'ljallangani va kanalni baholang, ruxsatsiz foydalanishga xizmat qiladigan vositani tarqatmang |
| Bank (MAI) tizimini baholatmoqchisiz | Faqat vakolatli organ ruxsati bilan, ixtisoslashtirilgan tashkilot orqali | 31 | Shartnomadan oldin shu yo'lni aniqlang |
| Himoya choralarisiz axborot tizimini ishga tushirdingiz | Yo'q, agar ko'p miqdorda zarar yoki jiddiy ziyon yetsa | 278-1 | Himoya choralarini loyiha talabiga kiriting |
| Kompaniyangizda hodisa aniqlandi (siz kiberxavfsizlik subyektisiz) | Xabar qilish kerak | 16 | Vakolatli organni xabardor qiling, raqamli izlarni saqlang; muddat matnda ko'rsatilmagan |

### Moddalar jadvali

O'RQ-764 15.04.2022 da imzolangan, 8 bob va 40 moddadan iborat, 17.07.2022 da kuchga kirgan (40-modda: e'londan uch oy o'tgach). Qonunning o'zida jazo turlari yo'q, 37-modda bitta jumlada aybdorlar belgilangan tartibda javobgarlikka tortilishini aytadi; jazolar Jinoyat va Ma'muriy kodekslarda. Jarimalar "bazaviy hisoblash miqdori" (BHM) bilan o'lchanadi; BHM qiymati kodeksda emas. Jinoyat kodeksining XX1 bobi 278-1 dan 278-9 gacha; 278-8 va 278-9 kripto-aktivlarga oid, ular bu yerda yo'q.

| Modda | Nima haqida | Kimga tegishli | Sanksiya |
|---|---|---|---|
| Jinoyat kodeksi 278-1 | Axborotlashtirish qoidalarini buzish: belgilangan himoya choralarini ko'rmasdan axborot tizimlari, ma'lumotlar bazalari va banklarini yaratish, joriy etish va ulardan foydalanish, shuningdek tizimdan ruxsat bilan foydalanishda qoidani buzish, agar fuqarolar, davlat yoki jamoat manfaatlariga ko'p miqdorda zarar yoki jiddiy ziyon yetkazilsa | Tizim egasi va dasturchi | 1-qism: 50 BHM gacha jarima yoki 1 yilgacha axloq tuzatish ishlari; 2-qism (juda ko'p miqdorda zarar): 50-100 BHM jarima yoki 1-2 yil axloq tuzatish ishlari |
| Jinoyat kodeksi 278-2 | Kompyuter axborotidan qonunga xilof (ruxsatsiz) foydalanish, agar u axborotning yo'q qilinishi, to'sib qo'yilishi, modifikatsiyalanishi, undan nusxa ko'chirilishi yoki uning qo'lga kiritilishiga, yoki EHM, ularning tizimi yoki tarmog'i ishining buzilishiga sabab bo'lsa | Har kim, shu jumladan tadqiqotchi | 1-qism: 100 BHM gacha jarima yoki 3 yilgacha muayyan huquqdan mahrum qilish yoxud 1 yilgacha axloq tuzatish ishlari; 2-qism (guruh, takroran, xizmat mavqeyidan foydalanib, uyushgan guruh): 100-300 BHM jarima yoki 1-2 yil axloq tuzatish ishlari yoki 1-3 yil ozodlikni cheklash yoxud 3 yilgacha ozodlikdan mahrum qilish |
| Jinoyat kodeksi 278-3 | Maxsus vositalarni tayyorlash va tarqatish: himoyalangan kompyuter tizimi yoki telekommunikatsiya tarmog'idan ruxsatsiz foydalanish uchun maxsus dasturiy yoki apparat vositalarini o'tkazish maqsadini ko'zlab tayyorlash yoxud o'tkazish va tarqatish | Vosita yaratuvchi va tarqatuvchi | 1-qism: 200 BHM gacha jarima yoki 1 yilgacha axloq tuzatish ishlari; 2-qism: 200-300 BHM jarima yoki 1-3 yil axloq tuzatish ishlari |
| Jinoyat kodeksi 278-4 | Kompyuter axborotini modifikatsiyalashtirish: kompyuter tizimidagi axborotni qonunga xilof o'zgartirish, unga shikast yetkazish, o'chirish, bila turib yolg'on axborot kiritish, agar ko'p miqdorda zarar yoki jiddiy ziyon yetkazilsa | Har kim | 1-qism: 100 BHM gacha jarima yoki 2 yilgacha axloq tuzatish, ozodlikni cheklash yoki ozodlikdan mahrum qilish; 2-qism: 1-3 yil shu jazolardan biri |
| Jinoyat kodeksi 278-5 | Kompyuter sabotaji: o'zganing yoki xizmatda foydalaniladigan kompyuter uskunasini qasddan ishdan chiqarish, kompyuter tizimini buzish | Har kim | 1-qism: 3 yilgacha huquqdan mahrum qilib 300-400 BHM jarima yoki 2 yilgacha ozodlikni cheklash yoxud ozodlikdan mahrum qilish; 2-qism (guruh, takroran): 2-3 yil axloq tuzatish, ozodlikni cheklash yoki ozodlikdan mahrum qilish |
| Jinoyat kodeksi 278-6 | Zarar keltiruvchi dasturlar: kompyuter tizimidagi axborotni ruxsatsiz yo'q qilish, to'sish, modifikatsiyalash, nusxalash yoki qo'lga kiritish maqsadida dastur yaratish yoki mavjud dasturga o'zgartirish kiritish, maxsus virus dasturlarini ishlab chiqish, ulardan qasddan foydalanish yoki tarqatish | Dastur yaratuvchi va tarqatuvchi | 1-qism: 100-300 BHM jarima yoki 2 yilgacha ozodlikni cheklash yoxud 2 yilgacha ozodlikdan mahrum qilish; 2-qism: 2-3 yil ozodlikni cheklash yoki ozodlikdan mahrum qilish |
| Jinoyat kodeksi 278-7 | Telekommunikatsiya tarmog'idan ruxsatsiz foydalanish: himoya tizimlarini chetlab o'tib, xalqaro trafik o'tkazish maqsadida tarmoqdan foydalanish va shu maqsadli vositalarni ruxsatsiz saqlash | Har kim | 1-qism: 100-300 BHM jarima yoki 1-3 yil ozodlikni cheklash yoxud 3 yilgacha ozodlikdan mahrum qilish; 2-qism: 300-600 BHM jarima yoki 3-5 yil ozodlikni cheklash yoki ozodlikdan mahrum qilish |
| Ma'muriy kodeks 155-1 | Kompyuter tizimiga ruxsati bor shaxsning foydalanish qoidalarini buzishi, agar bu axborotning yo'q qilinishi, to'sib qo'yilishi, modifikatsiyalanishi yoki uskuna ishining buzilishiga sabab bo'lsa | Tizimga ruxsati bor shaxs | Fuqarolarga 5-7 BHM, mansabdor shaxslarga 7-10 BHM jarima; konfidensial axborotli tizimda (2-qism) 7-10 va 10-15 BHM |
| Ma'muriy kodeks 155-2 | Jinoyat belgilarisiz telekommunikatsiya tarmog'idan ruxsatsiz foydalanish | Har kim | Vosita musodarasi bilan fuqarolarga 10-20, mansabdorlarga 20-50 BHM jarima |
| O'RQ-764, 1-3 | Maqsad (1), qonunchilik tarkibi (2), 13 ta tushuncha (3): kiberxavfsizlik hodisasi - axborot tizimlari ishlashida uzilishlarga va (yoki) axborotning ochiqligi, yaxlitligi yoki undan erkin foydalanilishining buzilishiga olib kelgan hodisa (CIA, 1-dars); kiberxavfsizlik subyekti - milliy axborot resurslariga ega bo'lgan, ulardan foydalanadigan va tasarruf etadigan yoki ulardan foydalanish bo'yicha elektron axborot xizmatlari ko'rsatadigan yuridik shaxs yoki yakka tartibdagi tadbirkor, shu jumladan MAI subyektlari. Zaiflik 3-moddada ta'riflanmagan, lekin 11, 14, 16, 23 va 24-moddalar bu so'zni ishlatadi; mazmunini texnik standartlar beradi (7-dars) | Hamma | Jazo yo'q |
| O'RQ-764, 11 | Vakolatli organ - Davlat xavfsizlik xizmati. Vakolatlari: qonun ijrosi ustidan nazorat; kiberxavfsizlik hodisalari bo'yicha tezkor-qidiruv tadbirlari va tergov harakatlari; MAI obyektlarining yagona reyestrini yuritish va talablarini belgilash; axborot tizimlari vositalarini sertifikatlashtirish va obyektlarni attestatsiyadan o'tkazish tartibini belgilash; kriptografik himoya vositalari faoliyatini litsenziyalash; "kiberxavfsizlik bo'linmalarining, mustaqil ekspertlar xizmatlari va guruhlarining faoliyatini tartibga solish" (oxirgi band mustaqil tadqiqotchilar uchun muhim, lekin tartibi qonunda yo'q). Qonuniy ko'rsatmalarni bajarish majburiy | Subyektlar | Jazo yo'q |
| O'RQ-764, 15 | Ma'lumot zaxira nusxalarining saqlanish muddati kamida oxirgi uch oy | Davlat organlari va MAI obyektlari | Jazo yo'q |
| O'RQ-764, 16 | Subyektlar: ma'lumotning qonunga xilof tarqalishi, o'g'irlanishi, yo'qolishi, yaxlitligining buzilishi, bloklanishi, soxtalashtirilishi va ruxsatsiz kirishning oldini oladi va aniqlanganda o'z vaqtida choralar ko'radi; ruxsatsiz kirish yoki o'zgartirishdan keyin tizimni tezkor tiklaydi; hodisalar va kiberjinoyatlar haqida vakolatli organni xabardor qiladi, raqamli izlar yo'qolishiga yo'l qo'ymaydi va tahlil uchun ma'lumotlarni doimiy saqlaydi; vakolatli organ talablariga rioya etadi; hodisalarga javob mexanizmlari va kiberxavfsizlik bo'linmalari ishlashini ta'minlaydi, ular bo'lmasa vakolatli organ ruxsati bilan autsorsing xizmatlaridan foydalanadi; monitoring tizimlariga kirish huquqini vakolatli organga beradi. Hodisa haqida xabar berish muddati matnda ko'rsatilmagan | Kiberxavfsizlik subyektlari | Jazo yo'q |
| O'RQ-764, 18, 19 | 18: MAI toifasidagi va davlat organlarining tizimlari muvofiqlik ekspertizasidan majburiy o'tadi. 19: himoya vositalari majburiy sertifikatlanadi | MAI va davlat organlari | Jazo yo'q |
| O'RQ-764, 22, 23 | 22: hodisalarni vakolatli organ yoki ishchi organ mansabdorlari tekshiradi; resurs egasi imkoniyati bo'lsa o'zi ham tekshiradi va natijani vakolatli organga bildiradi. 23: choralar shakllari - zaifliklarni bartaraf etish, zararli dasturlarni yo'q qilish, obyektlarni ajratish, huquqni muhofaza organlariga ma'lumot berish | Resurs egalari | Jazo yo'q |
| O'RQ-764, 24 | Aniqlangan zaifliklar, kibertahdidlar va kiberhujumlar haqidagi axborot himoya choralari ko'rilgandan keyin subyektning ruxsati bilan oshkor qilinishi mumkin; bu axborotdan faqat ularni bartaraf etish va qonunga xilof harakatlarning oldini olish uchun foydalanish kerak | Tadqiqotchi va tashkilot | Jazo yo'q |
| O'RQ-764, 26-28, 30, 31 | MAI: 3-moddaga ko'ra davlat boshqaruvi, mudofaa, yoqilg'i-energetika, bank-moliya tizimi, transport, sog'liqni saqlash, axborot-kommunikatsiya texnologiyalari va boshqa sohalardagi axborotlashtirish tizimlari. 26: yuqori, o'rta va past toifalar; 27: yagona reyestr; 28: uzluksiz ishlash, hodisalar haqidagi axborotni vakolatli organga yetkazish, sabablarni aniqlashda ko'maklashish, monitoring tizimlarini o'rnatish va unga kirish huquqini berish, ko'rsatmalarini bajarish, reyestrdagi ma'lumot o'zgarganda xabar berish; 30: MAI hodisalari haqidagi axborot cheklangan; 31: MAI obyektlarining kiberxavfsizligini baholash vakolatli organ ruxsati bilan, ixtisoslashtirilgan tashkilotlar jalb etilgan holda | MAI subyektlari | Jazo yo'q |
| O'RQ-764, 37 | Qonunchilikni buzganlikda aybdor shaxslar belgilangan tartibda javobgarlikka tortiladi | Hamma | Turlari qonunda yo'q; yuqoridagi kodekslarda |

Shaxsga doir ma'lumotlar bo'yicha javobgarlik 94-darsda (Jinoyat kodeksi 141-2, Ma'muriy kodeks 46-2).

## Chuqurroq: pentest shartnomasi, bug bounty va responsible disclosure

### Qonun shartnomaga qanday ta'sir qiladi

Quyidagi ro'yxat qonun matnidan va bu darsdagi talqindan kelib chiqadi (talqin muallifniki, yuridik xulosa emas). Pentest shartnomasi yoki dastur shartlari kamida shularni yozsin:

- ruxsat beruvchi tizim egasi ekani (hosting va bulut egalarining ruxsati alohida bo'lishi mumkin);
- doira (domen, IP, muhit), vaqt oynasi va usullar;
- ma'lumot qoidasi: 278-2 bo'yicha nusxalash oqibat, shuning uchun real yozuvni ko'chirmaslik, minimal dalil;
- zararli kod va maxsus vositalarni (278-3, 278-6) tashqariga chiqarmaslik;
- hodisa aniqlansa kim kimni xabardor qilishi (16-modda);
- oshkor qilish tartibi (24-modda).

MAI obyektlarini baholash 31-moddaga ko'ra vakolatli organ ruxsati bilan ixtisoslashtirilgan tashkilot orqali o'tadi, shuning uchun shartnomadan oldin bu yo'lni aniqlang. 16-modda tashkilotda kiberxavfsizlik bo'linmasi bo'lmasa, vakolatli organ ruxsati bilan autsorsingdan foydalanishni nazarda tutadi; tashqi pentest firmasi shu bandga tushishi mumkin.

### Bug bounty va pentest

WSTG bug bounty'ni pentestdan farqlaydi. Pentest vaqt bilan cheklangan, bitta jamoa o'tkazadi, odatda white-box yoki gray-box, doirasi shartnomada kelishiladi, rasmiy hisobot bilan tugaydi. Bug bounty uzluksiz, ko'p tadqiqotchili, black-box, doirani dastur egasi bir tomonlama belgilaydi, to'lov har topilma uchun. Xulosa: bounty tadqiqotchisi faqat e'lon qilingan doirada ishlaydi va doirani muntazam qayta o'qiydi. Dastur shartlari tizim egasining ruxsati; ruxsat doirasida harakat "ruxsatsiz" bo'lmaydi, doiradan tashqarida esa shartlar himoya bermaydi (bu muallifning o'qishi). Dastur shartlarining sud amaliyotidagi kuchi bu darsda tekshirilmagan.

### Uch oshkor qilish modeli va 24-modda

Cheat sheet uch modelni ajratadi. Private disclosure: maxfiy xabar, e'lon qilish tashkilot ixtiyorida. Full disclosure: tafsilotlar topilishi bilan hammaga e'lon qilinadi (sahifa uni munozarali deydi). Responsible (coordinated) disclosure: hisobot maxfiy, tafsilotlar tuzatish tayyor bo'lgach e'lon qilinadi; misol - Google Project Zero siyosati (tuzatishga odatda 90 kun, undan keyin 30 kun). WSTG 30-90 kunni misol qiladi.

O'RQ-764 24-moddasi bu modellarga cheklov qo'yadi: e'lon himoya choralari ko'rilgandan keyin va subyekt ruxsati bilan. Shuning uchun responsible disclosure'ni qo'llasangiz, muddatni ham, e'lon ruxsatini ham xabar bilan birga yozma kelishing.

### Tadqiqotchi sifatida

Avval tashkilotning e'lon qilingan siyosati va `/.well-known/security.txt` faylini qidiring (RFC 9116, kamida Contact va Expires); topilmasa `security@` manzili. Hisobotda qayta ishlab chiqish uchun yetarli tafsilot, so'rov-javoblar va ta'sir bo'lsin, shaxsga doir ma'lumot olib tashlansin. To'lovni tafsilotlardan oldin talab qilmang: bu tovlamachilik bo'lishi mumkin. Quyidagi kod dalildan telefon va davlat raqamini yashiradi (o'quv naqshi).

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

Ro'yxat yetarli emas: ism ("Test Haydovchi") yashirilmadi, regex'lar faqat ma'lum formatlarni topadi. Eng ishonchli yo'l real ma'lumotni dalilga umuman kiritmaslik, ya'ni sintetik ma'lumotli laboratoriyada sinash (10-dars).

### Tashkilot sifatida

Cheat sheet: xabar yo'lini bering, javob muddatini oqilona belgilang, tadqiqotchi bilan ochiq muloqot qiling, yuridik tahdid qilmang, advisory chiqaring, e'tirof bering. Kiberxavfsizlik subyekti sifatida 16-modda bo'yicha hodisani xabar qilishingiz kerak bo'lgani uchun tashqi hisobotni hodisa jarayoniga ulang (93-dars).

## Misol: sinash vositasining doirasi

Kod faqat bizning `inScope` funksiyamizga qarshi; `.test` va `.example` domenlari hujjat va sinov uchun ajratilgan. Misol skaner ruxsatsiz hostga tegib ketishining oldini oladi: xato bilan doiradan chiqish 278-2 dagi "ruxsatsiz" belgisini keltirib chiqarishi mumkin.

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

Birinchisidan boshqa uchalasi ham doiradan tashqarida. Oxirgisida haqiqiy host `evil.example`: `lab.fleet.test@` qismi login sifatida talqin qilinadi. Real sinovda bu ruxsatsiz hostga so'rov yuborish, ya'ni ruxsat chegarasini buzish bo'lardi.

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

Endi tekshiruv URL'ni tahlil qiladi va hostname'ni aniq solishtiradi, shuning uchun ko'rsatilgan to'rt hiyla yopiladi. Qoldiq risk: tekshiruv faqat manzil matnini ko'radi; DNS va redirect orqali tashqi hostga o'tish bundan o'tib ketadi, shuning uchun ularni har so'rovdan oldin va redirect'dan keyin qayta tekshiring. Kod yozma ruxsat o'rnini bosmaydi.

## Qachon qo'llamaslik kerak

- Doira tekshiruvi avtomatlashtirilgan vosita uchun himoya qatlami, ruxsat emas. Ruxsat yozma, aniq doira, muddat va kontakt bilan bo'lishi kerak.
- Responsible disclosure har vaziyatda ishlamaydi: tashkilot javob bermasa, cheat sheet muqobillarni (anonim e'lon qilish, regulyatorga xabar berish, voz kechish) va ularning xavfini ro'yxatlaydi; 24-modda bilan birga tanlov tor.
- Kichik jamoaga to'liq bug bounty ortiqcha: `security.txt`, alohida email va mas'ul odam ko'pincha yetadi.
- Vazirlar Mahkamasi qarorlari, vakolatli organning quyi hujjatlari va sud amaliyoti o'qilmagan.

## Stack'da: security.txt va hisobot jarayoni

Next.js loyihada `public/.well-known/security.txt` statik fayl bo'lishi mumkin; kamida `Contact` va `Expires` kerak. Misol (hujjat domenlari):

```text
Contact: mailto:security@fleet.example
Expires: 2027-06-30T00:00:00.000Z
Preferred-Languages: uz, ru, en
Canonical: https://fleet.example/.well-known/security.txt
Policy: https://fleet.example/security-policy
```

`Expires` sanasi o'tib ketmasligini CI'da tekshiring: eskirgan fayl yomonroq ishlaydi.

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

Bu kod ishga tushirilmaydi (Node `fs` brauzer worker'ida yo'q).

## Xulosa

- Qaror qoidasi: yozma ruxsat va aniq doira bo'lmasa, tegmang. Jinoyat kodeksining 278-2, 278-3 va 278-7-moddalarida "ruxsatsiz" markaziy belgi; XX1 bobda yaxshi niyatli tadqiqotchi uchun istisno yo'q.
- Isbotni real ma'lumotni ko'chirmasdan bering: 278-2 oqibat talab qiladi, nusxalash ham oqibat; 278-3 va 278-6 vosita yaratish va tarqatishni ham jazolaydi.
- 24-modda: zaifliklar haqidagi axborot himoya choralari ko'rilgach va subyekt ruxsati bilan oshkor qilinadi; oshkor qilish muddatini oldindan yozma kelishing.
- Shartnoma va bug bounty shartlari ruxsat egasi, doira, usullar, ma'lumot qoidasi va oshkor qilish tartibini yozsin; MAI baholashi vakolatli organ ruxsati bilan (31-modda).
- Tashkilot sifatida xabar yo'lini (security.txt) bering; vakolatli organ - Davlat xavfsizlik xizmati (11-modda), subyektlar hodisa haqida uni xabardor qiladi va raqamli izlarni saqlaydi (16), MAI subyektlari qo'shimcha majburiyatlarga ega (26-31).
