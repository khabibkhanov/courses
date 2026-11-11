---
n: 43
slug: credential-stuffing-brute-force
title: "Parol siyosati, credential stuffing va brute force himoyasi"
summary: "NIST SP 800-63-4 parol siyosati (uzunlik, blocklist, murakkablik qoidalarining yo'qligi), brute force, credential stuffing va password spraying farqi, akkaunt bo'yicha throttling va lockout dilemmasi, buzilgan parollarni aniqlash va umumiy xato javoblari."
duration: 45
sources:
  - id: nist-63-4
    note: "SP 800-63B-4 parol talablari: yagona faktor uchun kamida 15, MFA qismi bo'lsa kamida 8 belgi; kamida 64 belgigacha ruxsat; boshqa murakkablik qoidalari qo'yilmaydi; davriy almashtirish talab qilinmaydi, lekin buzilish dalili bo'lsa majburiy; blocklist (butun parol, rad etish sababi); NFC normalizatsiyasi; rate limiting: ketma-ket muvaffaqiyatsiz urinishlar 100 dan oshmasligi va oshib boruvchi kutish kabi qo'shimcha usullar; parol menejerlari va paste"
  - id: cs-authn
    note: "Authentication Cheat Sheet: kirish, parolni tiklash va ro'yxatdan o'tishda akkaunt mavjudligidan qat'i nazar bir xil umumiy javob (matn va HTTP javobi); brute force, credential stuffing va password spraying ta'riflari; akkaunt bo'yicha lockout (chegara, oyna, davomiylik, eksponensial variant); CAPTCHA defense in depth sifatida"
  - id: cs-credential-stuffing
    note: "Credential Stuffing Prevention Cheat Sheet: MFA'ni shubhali holatda so'rash, IP va qurilma signallari, oldindan aytib bo'lmaydigan username, degradation, metrikalar va foydalanuvchini xabardor qilish"
  - id: t10-a07
    note: "OWASP Top 10:2025 A07: credential stuffing va undan kengaytirilgan 'hybrid' hujum (sizgan parollarning variantlarini sinash) tavsifi; MFA yo'qligi yoki samarasizligi"
quiz:
  - q: "Kirish endpoint'i har IP'dan daqiqada 5 urinish qabul qiladi. Hujumchi 2000 ta turli IP'ga ega botnet'dan, har akkauntga bittadan sizgan parolni sinaydi. IP limiti nima qiladi?"
    options:
      - "Hujumni to'liq to'xtatadi"
      - "Hujumchini 5 urinishdan keyin ham qo'yib yuboradi, chunki har IP limitga yetmaydi"
      - "Hujumni faqat akkaunt bo'yicha limit bilan birga to'xtatadi"
      - "Faqat parolni uzaytiradi"
    answer: 1
    explain: "Credential stuffing taqsimlangan: har IP'dan juda kam urinish bo'ladi, shuning uchun IP limiti hech qachon ishga tushmaydi. Akkaunt bo'yicha limit ham yordam bermaydi, chunki har akkauntga atigi bitta urinish keladi. Bunday hujumga qarshi buzilgan parolni aniqlash va MFA kerak."
  - q: "Parol siyosati: 'kamida 8 belgi, bosh harf, raqam va belgi, har 90 kunda almashtirish'. NIST SP 800-63-4 bu haqda nima deydi?"
    options:
      - "Barcha qoidalar to'g'ri"
      - "Murakkablik qoidalari va davriy almashtirish talab qilinmasligi kerak (SHALL NOT); buzilish dalili bo'lsa almashtirish majburiy"
      - "Faqat 90 kunlik almashtirish noto'g'ri"
      - "Faqat bosh harf talabi noto'g'ri"
    answer: 1
    explain: "Standart boshqa murakkablik qoidalarini (belgi turlari aralashmasi) ham, subscriber'ni davriy almashtirishga majburlashni ham taqiqlaydi. Parol buzilgani ma'lum bo'lsa esa almashtirishni majburlash shart. Qo'shimcha: yagona faktor parol uchun minimal uzunlik 15."
  - q: "Akkaunt 5 noto'g'ri urinishdan keyin 24 soatga bloklanadi. Bu qaysi yangi risk yaratadi?"
    options:
      - "Hujumchi boshqa odamning akkauntini ataylab bloklab, uni ishdan chiqarishi mumkin (mavjudlikka zarar)"
      - "Parol xeshi sizib chiqadi"
      - "Sessiya fixation"
      - "Hech qanday risk yo'q"
    answer: 0
    explain: "Qattiq lockout hujumchiga qurbonning akkauntini mavjud bo'lmagan holatga tushirish imkonini beradi: faqat noto'g'ri parolni yuborish yetarli. Oshib boruvchi kechikish (throttling), qo'shimcha tekshiruv va tegishli kanal orqali ochish bu riskni kamaytiradi."
  - q: "Kirish formasi mavjud bo'lmagan email uchun darhol 'Email yoki parol noto'g'ri' qaytaradi, mavjud email uchun parol hash'ini hisoblagandan keyin shu xabarni qaytaradi (javob 300 ms sekinroq). Matn bir xil. Nima qolgan?"
    options:
      - "Hech narsa: matn bir xil"
      - "Parol siyosati"
      - "Vaqt farqi orqali akkaunt mavjudligi aniqlanadi (timing enumeration)"
      - "CSRF"
    answer: 2
    explain: "Cheat sheet javob matni va HTTP javobi bir xil bo'lishini aytadi; vaqt kanali ham shu javobning bir qismi. Hash hisoblashni mavjud bo'lmagan akkaunt uchun ham bajarish (soxta hash bilan) yoki bir xil minimal kechikish bu kanalni yopadi."
  - q: "Ro'yxatdan o'tishda parol blocklist bilan tekshiriladi. Nima uchun NIST blocklist'ni birinchi navbatda onlayn hujumga qarshi chora deb ataydi va uni haddan tashqari katta qilishni foydasiz deydi?"
    options:
      - "Blocklist oflayn hujumdan himoya qiladi"
      - "Kattaroq ro'yxat tezroq ishlaydi"
      - "Onlayn hujum rate limit bilan cheklanadi, shuning uchun hujumchi sinab ulgurishi mumkin bo'lgan parollarni (eng ko'p uchraydiganlarini) yopish yetarli"
      - "Blocklist faqat uzun parollarga tegishli"
    answer: 2
    explain: "Throttling urinishlar sonini cheklaydi, shuning uchun hujumchi faqat eng ehtimolli nomzodlarni sinay oladi: shularni blocklist'ga kiritish kifoya. Oflayn hujumdan hash funksiyasi (42-dars) himoya qiladi."
  - q: "Sizgan parollar bazasida 'qwerty123456' bor. Akkaunt egasi shu parol bilan kirdi. Eng yaxshi javob?"
    options:
      - "Kirishni ruxsat etib, hech narsa qilmaslik"
      - "Akkauntni doimiy o'chirish"
      - "Parolni jim qayta hash qilish"
      - "Parol to'g'ri bo'lsa ham to'liq sessiya bermasdan, qo'shimcha faktor yoki parolni almashtirishni talab qilish"
    answer: 3
    explain: "Parol to'g'ri, lekin ommaviy ma'lum: shu parol bilan kirayotgan odam egasi ham, hujumchi ham bo'lishi mumkin. Qo'shimcha faktor yoki majburiy almashtirish ikkalasini ajratadi. Hech narsa qilmaslik stuffing'ga eshik ochadi, o'chirish esa egaga zarar."
task:
  title: "NIST uslubidagi parol tekshiruvi"
  prompt: |
    `checkPassword(password, hasMfa, blocklist)` eski siyosat bilan yozilgan: kamida 8 belgi, bosh harf, raqam va belgi, eng ko'pi 20 belgi. Uni NIST SP 800-63-4 yo'nalishida qayta yozing:

    - minimal uzunlik: `hasMfa` bo'lsa 8, bo'lmasa 15 (xato kodi `"short"`);
    - maksimal uzunlik 128 (xato kodi `"long"`), bo'shliq va Unicode belgilar ruxsat;
    - murakkablik (belgi turlari) qoidalari yo'q;
    - parol `blocklist` da bo'lsa (kichik harfga o'tkazib solishtiring) `"blocklisted"`.

    Funksiya xato kodlari massivini qaytaradi; bo'sh massiv - parol qabul qilindi. Imzoni o'zgartirmang. Kutilgan chiqish: `[]`, `["short"]`, `[]`, `["blocklisted"]`, `[]`.
  lang: ts
  starter: |
    const blocklist = new Set(["qwerty123456789", "password1234567", "avtopark123456"]);

    function checkPassword(password: string, hasMfa: boolean, list: Set<string>): string[] {
      const errors: string[] = [];
      if (password.length < 8) errors.push("short");
      if (password.length > 20) errors.push("long");
      if (!/[A-Z]/.test(password)) errors.push("upper");
      if (!/[0-9]/.test(password)) errors.push("digit");
      if (!/[^A-Za-z0-9]/.test(password)) errors.push("symbol");
      return errors;
    }

    console.log(JSON.stringify(checkPassword("Fleet1!ab", true, blocklist)));
    console.log(JSON.stringify(checkPassword("ozbekiston", false, blocklist)));
    console.log(JSON.stringify(checkPassword("correct horse battery staple", false, blocklist)));
    console.log(JSON.stringify(checkPassword("QWERTY123456789", false, blocklist)));
    console.log(JSON.stringify(checkPassword("a".repeat(70), false, blocklist)));
  solution: |
    const blocklist = new Set(["qwerty123456789", "password1234567", "avtopark123456"]);

    function checkPassword(password: string, hasMfa: boolean, list: Set<string>): string[] {
      const errors: string[] = [];
      const len = [...password].length; // har Unicode code point bitta belgi
      const min = hasMfa ? 8 : 15;
      if (len < min) errors.push("short");
      if (len > 128) errors.push("long");
      if (list.has(password.toLowerCase())) errors.push("blocklisted");
      return errors;
    }

    console.log(JSON.stringify(checkPassword("Fleet1!ab", true, blocklist)));
    console.log(JSON.stringify(checkPassword("ozbekiston", false, blocklist)));
    console.log(JSON.stringify(checkPassword("correct horse battery staple", false, blocklist)));
    console.log(JSON.stringify(checkPassword("QWERTY123456789", false, blocklist)));
    console.log(JSON.stringify(checkPassword("a".repeat(70), false, blocklist)));
  solutionNotes: |
    - Minimal uzunlik faktor soniga bog'liq: MFA bor akkauntda 8, parol yagona faktor bo'lsa 15. Bu NIST SP 800-63-4 dagi qiymatlar.
    - Murakkablik qoidalari olib tashlandi: ular odamni `Parol1!` kabi bashorat qilinadigan shakllarga undaydi, NIST bunday qoidalarni qo'yishni taqiqlaydi.
    - Maksimal uzunlik 128: NIST kamida 64 belgigacha ruxsat berishni tavsiya etadi; chegara baribir kerak, aks holda hash funksiyasiga cheksiz kirish yuboriladi (mavjudlik, 42-dars). 128 bu yerda modelning tanlovi.
    - `[...password].length` Unicode code point'larni sanaydi, NIST har code point bitta belgi hisoblanishini aytadi.
    - Blocklist kichik harfga o'tkazib solishtiriladi. Bu to'liq himoya emas: ro'yxatdan tashqari bashorat qilinadigan parollar va kontekstli so'zlar (kompaniya nomi) alohida ishlanadi. Throttling ham alohida mexanizm.
  checklist:
    - "MFA bor/yo'qligiga qarab minimal uzunlik 8 yoki 15"
    - "Belgi turlari bo'yicha qoidalar yo'q"
    - "Bo'shliqli uzun parol qabul qilinadi"
    - "Blocklist'dagi parol (katta-kichik harfdan qat'i nazar) rad etiladi"
    - "Juda uzun kirish rad etilmaydi 128 gacha, undan oshsa `long`"
---

## Muammo

Parol bazasi himoyalangan bo'lsa ham (42-dars), hujumchining boshqa yo'li bor: kirish formasining o'zi. Avtopark platformasining `/login` endpoint'i internetda ochiq turadi va har kim unga parol yuborishi mumkin. Real hujumlar uch xil ko'rinishda.

Birinchisi brute force: bitta akkauntga ko'p parolni ketma-ket sinash. Ikkinchisi password spraying: ko'p akkauntga bitta yoki bir nechta keng tarqalgan parolni sinash, shuning uchun har akkauntda urinishlar kam. Uchinchisi credential stuffing: boshqa servislardan sizgan (email, parol) juftliklarini sizning formangizga yuborish. OWASP Top 10:2025 A07 shu hujumni misol sifatida keltiradi va uning kengaytmasini ham qayd etadi: sizgan parollarning variantlarini (oxiriga raqam qo'shish, yilni oshirish) sinash. Bu hujumlarning umumiy xususiyati shuki, ularning har bir so'rovi alohida qaraganda oddiy foydalanuvchi so'roviga o'xshaydi.

Ikkinchi og'riq: jamoalar odatda reaksiya sifatida noto'g'ri choralarni tanlaydi. "Parol murakkab bo'lsin, har 90 kunda almashtirilsin", "5 urinishdan keyin akkauntni bloklaymiz", "IP bo'yicha limit qo'ydik". Bularning har biri ma'lum vaziyatda foyda keltiradi, lekin yolg'iz o'zi yetarli emas va ba'zilari zarar beradi. Bu darsda NIST SP 800-63-4 ning parol talablarini mexanizm darajasida tushuntiramiz va hujumning har turiga qaysi nazorat mos kelishini ajratamiz.

## Asosiy g'oya

### Nima uchun parol siyosati o'zgardi

NIST SP 800-63-4 parol talablari (3.1.1 bo'limi) quyidagicha. Mazmuni standart matniga tayanadi, lekin biz uni qisqartirib beramiz:

- Parol yagona faktor sifatida ishlatilsa, kamida 15 belgi talab qilinadi (SHALL). Faqat ko'p faktorli jarayonning bir qismi bo'lsa, qisqaroq bo'lishi mumkin, lekin kamida 8 belgi.
- Maksimal uzunlik kamida 64 belgigacha ruxsat berilishi kerak (SHOULD). Bosma ASCII belgilari, bo'shliq va (SHOULD) Unicode qabul qilinadi; har code point bitta belgi hisoblanadi.
- Boshqa murakkablik qoidalari (belgi turlari aralashmasi) qo'yilmaydi (SHALL NOT).
- Subscriber parolni davriy almashtirishga majburlanmaydi (SHALL NOT). Biroq autentifikator buzilgani haqida dalil bo'lsa, almashtirishni majburlash shart (SHALL).
- Tanlangan parol keng tarqalgan, kutilgan yoki buzilgan qiymatlar blocklist'ida bo'lsa, rad etiladi va sabab ko'rsatiladi.
- Parol menejerlari va autofill ruxsat etiladi (SHALL), paste imkoni tavsiya etiladi (SHOULD).

Mexanizm: murakkablik qoidalari odamni `Parol1!` kabi taxmin qilinadigan shakllarga undaydi, hujumchining lug'atlari esa aynan shu shakllarni o'z ichiga oladi. Majburiy almashtirish `Parol1!` ni `Parol2!` ga aylantiradi. Uzunlik va blocklist esa hujumchining qidiruv maydonini haqiqatan kengaytiradi yoki eng ehtimolli nuqtalarni yopadi.

Standart yana bir muhim fikrni beradi: blocklist onlayn hujumga qarshi mo'ljallangan, chunki onlayn urinishlar throttling bilan cheklangan; shuning uchun blocklist hujumchi o'sha cheklov ichida sinab ulgura oladigan parollarni qamrab olishi yetarli, haddan tashqari katta ro'yxatning qo'shimcha foydasi kam. Verifier muvaffaqiyatsiz urinishlar sonini samarali cheklaydigan rate-limiting mexanizmini amalga oshirishi shart (SHALL).

### Standart nimani aniq aytadi: blocklist, normalizatsiya va 100 ta urinish

Blocklist haqidagi talablar bir nechta nozik joyga ega. Parol blocklist bilan butunligicha solishtiriladi, ichidagi so'z yoki substring bilan emas (shu sababli bizning kodimizdagi `list.has(password.toLowerCase())` to'liq moslikni tekshiradi). Ro'yxat sizgan parollar, lug'at so'zlari va kontekstga xos so'zlarni (xizmat nomi, username va ularning hosilalari) o'z ichiga olishi mumkin. Parol rad etilsa, foydalanuvchi boshqa parol tanlashi va rad etish sababini ko'rishi kerak (SHALL), verifier esa kuchli parol tanlashga yordam beradigan ko'rsatma berishi kerak, chunki ro'yxatdagi parolning arzimas o'zgartirishlarini (`Parol1` dan `Parol2` ga) to'sish uchun aynan shu muhim. Unicode qabul qilinsa, standart parolni hash qilishdan oldin NFC normalizatsiyasini qo'llashni tavsiya etadi (SHOULD): bir xil ko'rinadigan belgi turli qurilmada turlicha kodlanishi mumkin, normalizatsiyasiz foydalanuvchi boshqa qurilmadan kira olmay qolishi mumkin. Parol maslahati (hint) saqlash va xavfsizlik savollariga asoslangan tanlov taqiqlangan (SHALL NOT). Verifier parolni to'liq so'rashi va to'liq tekshirishi kerak, uni qirqmasligi shart. Yozishda xatoga ozgina yon berish mumkin (MAY): masalan, boshidagi va oxiridagi bo'shliqlarni olib tashlash, agar parol minimal uzunlikdan qisqarmasa.

Throttling bo'yicha NIST aniq raqam beradi, va u ko'pchilik kutganidan ancha katta: bitta akkauntdagi ma'lum authenticator bo'yicha ketma-ket muvaffaqiyatsiz urinishlar soni 100 dan oshmasligi kerak, limit oshganda authenticator o'chiriladi va undan qayta foydalanish uchun akkauntga qayta bog'lash (rebind) talab qilinadi. 100 yuqori chegara; tashkilot pastroq limit qo'yishi mumkin. Standart tanlov sababini ham aytadi: olti xonali OTP uchun 100 ta urinish bilan to'g'ri taxmin ehtimoli va limit oshganda akkauntni tiklash zarurati o'rtasida muvozanat. Qurbonni bloklash xavfini kamaytirish uchun qo'shimcha usullar ruxsat etilgan (MAY): bot aniqlash challenge'i, muvaffaqiyatsiz urinishlar maksimumga yaqinlashgani sari oshib boruvchi kutish (30 soniyadan bir soatgacha misol sifatida) va xavfga asoslangan signallar (IP, geolokatsiya, so'rovlar ritmi, brauzer metadata'si). Muvaffaqiyatli kirishdan keyin oldingi muvaffaqiyatsiz urinishlar hisobini nolga tushirish tavsiya etiladi (SHOULD). Ya'ni "5 xato, blok" standartdan kelib chiqmaydi: bu mahalliy tanlov, uning narxi esa yuqorida aytilgan mavjudlik riski.

## Chuqurroq: har hujum o'z nazoratini talab qiladi

| Hujum | Qanday ko'rinadi | Samarali nazorat |
|---|---|---|
| Brute force | Bitta akkauntga ko'p urinish | Akkaunt bo'yicha throttling |
| Password spraying | Ko'p akkauntga bitta parol | Blocklist, anomaliya aniqlash, MFA |
| Credential stuffing | Ko'p akkauntga bittadan to'g'ri-ko'rinishli juftlik | Buzilgan parolni aniqlash, MFA, qurilma/xatti-harakat signallari |

Eng muhim kuzatuv: IP bo'yicha limit tarqoq hujumni ko'rmaydi. Akkaunt bo'yicha limit ham stuffing'ni ko'rmaydi, chunki har akkauntga bitta urinish keladi. Stuffing'ni to'xtatadigan narsa: parol allaqachon ommaviy ekanini bilish va ikkinchi faktor.

### Throttling va lockout

Qattiq lockout ("5 xato, 24 soat blok") hujumchiga yangi qurol beradi: istalgan odamning akkauntini noto'g'ri parol yuborib bloklash mumkin. Bu mavjudlikka hujum (1-dars). Muqobil: oshib boruvchi kechikish (throttling). Uchinchi xatodan keyin keyingi urinish oldidan kutish vaqti ikki barobar oshadi. To'g'ri egasi biroz kutadi, hujumchining brute force tezligi esa keskin tushadi. Kechikishni akkaunt kaliti bo'yicha hisoblang, mavjud bo'lmagan email uchun ham xuddi shunday holat yuritilsin, aks holda throttling o'zi mavjudlik haqida ma'lumot beradi. Bu mulohaza muallifning dizayn tahlili, standartning aniq raqami emas.

### Lockout parametrlari va qo'shimcha qatlamlar

Authentication Cheat Sheet lockout hisoblagichini IP bilan emas, akkauntning o'zi bilan bog'lashni aytadi, aks holda hujumchi ko'p IP'dan urinadi. Siyosat uchta o'zgaruvchidan iborat: lockout chegarasi (nechta xato), kuzatuv oynasi (shu xatolar qaysi vaqt ichida sanaladi) va lockout davomiyligi. Qat'iy davomiylik o'rniga eksponensial variant tavsiya etiladi: davomiylik juda qisqa (masalan bir soniya) boshlanib, har xatodan keyin ikki barobar oshadi. Lockout orqali boshqa odamni to'sish xavfiga qarshi cheat sheet bir yo'lni ko'rsatadi: bloklangan akkauntga ham "parolni unutdim" oqimi orqali kirishga ruxsat berish (50-dars). CAPTCHA'ni esa oldini oluvchi emas, defense in depth qatlami deb baholaydi: ko'p realizatsiyalarni avtomatik yoki tashqi xizmat orqali yechish mumkin, shuning uchun uni faqat bir necha xatodan keyin so'rash qulayroq.

Credential Stuffing Prevention Cheat Sheet MFA'ni eng yaxshi himoya deb ataydi va uni to'liq majburlash qiyin bo'lsa, faqat shubhali holatda so'rashni tavsiya qiladi: yangi brauzer yoki qurilma, g'ayrioddiy mamlakat, proxy yoki anonimlashtiruvchi xizmat IP'si, bir nechta akkauntga kirishga urinayotgan IP, skriptga o'xshash xatti-harakat. Admin kabi rollarga MFA'ni majburlash mumkin, oddiy foydalanuvchilarga esa yo'q bo'lsa, rolga qarab farqlash ham to'g'ri. Qolgan qatlamlar bir-birini to'ldiradi: IP razvedkasi (turar-joy IP'si va hosting IP'sini farqlash, qisqa va uzun vaqt oynalarini hisobga olish, chunki distribyutsiyalangan hujum har IP'dan kam so'rov yuboradi), qurilma va ulanish fingerprint'i (mijozdan kelgani uchun soxtalashtirilishi mumkin, shuning uchun yagona himoya emas), oldindan aytib bo'lmaydigan username (email ro'yxatlari keng tarqalgan), ko'p bosqichli kirish (lekin u enumeration'ni osonlashtirmasligi kerak) va "degradation" (hujumni sekinlashtirish). Muhim qoida: har bir qatlam o'z metrikasini (aniqlangan va to'silgan hajm) chiqarsin, chunki mudofaa buzilganini faqat metrikadan bilasiz. Foydalanuvchiga ham signal beriladi: to'g'ri parol bilan kirib, keyin MFA'dan o'ta olmagan urinish haqida xabar yuborish, oxirgi kirish vaqti va joyini ko'rsatish, faol sessiyalar ro'yxatini berish. Noto'g'ri parol bilan urinish haqida esa xabar yubormang: foydalanuvchini keraksiz bildirishnomalar bilan charchatadi.

### Bir xil javob

Authentication Cheat Sheet kirish, parolni tiklash va ro'yxatdan o'tishda akkaunt mavjudligidan qat'i nazar bir xil umumiy javob (matn va HTTP javobi) qaytarishni talab qiladi, aks holda hujumchi qaysi email'lar ro'yxatdan o'tganini bilib oladi (enumeration). Javob vaqti ham javobning bir qismi: mavjud akkaunt uchun parol hash'i hisoblansa-yu, mavjud bo'lmagan uchun hisoblanmasa, 300 ms farq yetarli signal.

### Parol siyosatini kod bilan ifodalash

```ts run
const blocklist = new Set(["qwerty123456789", "password1234567", "avtopark123456"]);

function check(pw: string, hasMfa: boolean): string[] {
  const errors: string[] = [];
  const len = [...pw].length;
  if (len < (hasMfa ? 8 : 15)) errors.push("short");
  if (len > 128) errors.push("long");
  if (blocklist.has(pw.toLowerCase())) errors.push("blocklisted");
  return errors;
}

const samples: [string, boolean][] = [
  ["Fleet1!ab", true],
  ["Fleet1!ab", false],
  ["mening mashinam sakkiz tonna", false],
  ["Qwerty123456789", false],
];
for (const [pw, mfa] of samples) {
  console.log(pw.padEnd(30), mfa ? "MFA" : "yagona", JSON.stringify(check(pw, mfa)));
}
```

```text
Fleet1!ab                      MFA []
Fleet1!ab                      yagona ["short"]
mening mashinam sakkiz tonna   yagona []
Qwerty123456789                yagona ["blocklisted"]
```

Birinchi va ikkinchi qator bir xil parol: MFA bilan 8 belgi yetadi, yagona faktor sifatida yetmaydi. Uchinchi qatorda murakkablik qoidalari yo'q, bo'shliqli ibora qabul qilinadi.

## Misol: taqsimlangan hujum va akkaunt bo'yicha himoya

### Zaif kod

Birinchi versiya faqat IP bo'yicha limit qo'yadi va xato xabarlarini ajratadi. Parollar o'quv soddaligi uchun ochiq matnda (haqiqiy tizimda hash, 42-dars).

```ts run
type User = { email: string; password: string };
const users = new Map<string, User>([
  ["dispatcher@alfa.example", { email: "dispatcher@alfa.example", password: "qwerty123456" }],
  ["driver1@alfa.example", { email: "driver1@alfa.example", password: "autopark2024" }],
  ["admin@beta.example", { email: "admin@beta.example", password: "Gv7-kd29xQpL" }],
]);

const failsByIp = new Map<string, number>();

// ZAIF: faqat IP bo'yicha limit; xabarlar akkaunt mavjudligini oshkor qiladi.
function login(ip: string, email: string, password: string): string {
  if ((failsByIp.get(ip) ?? 0) >= 5) return "429";
  const fail = (msg: string) => {
    failsByIp.set(ip, (failsByIp.get(ip) ?? 0) + 1);
    return msg;
  };
  const u = users.get(email);
  if (!u) return fail("Foydalanuvchi topilmadi");
  if (u.password !== password) return fail("Parol xato");
  return "OK";
}

console.log(login("10.0.0.1", "dispatcher@alfa.example", "qwerty123456"));
console.log(login("10.0.0.1", "nomalum@alfa.example", "x"));
console.log(login("10.0.0.1", "admin@beta.example", "x"));
```

```text
OK
Foydalanuvchi topilmadi
Parol xato
```

### Hujum

Hujumchi boshqa servisdan sizgan juftliklar ro'yxatiga ega (faqat shu o'quv kodining foydalanuvchilari uchun) va har juftlikni boshqa IP'dan yuboradi. Ikkinchi senariy: bitta akkauntga o'nta taxmin, har biri yangi IP'dan.

```ts run
type User = { email: string; password: string };
const users = new Map<string, User>([
  ["dispatcher@alfa.example", { email: "dispatcher@alfa.example", password: "qwerty123456" }],
  ["driver1@alfa.example", { email: "driver1@alfa.example", password: "autopark2024" }],
  ["admin@beta.example", { email: "admin@beta.example", password: "Gv7-kd29xQpL" }],
]);
const failsByIp = new Map<string, number>();
function login(ip: string, email: string, password: string): string {
  if ((failsByIp.get(ip) ?? 0) >= 5) return "429";
  const fail = (msg: string) => {
    failsByIp.set(ip, (failsByIp.get(ip) ?? 0) + 1);
    return msg;
  };
  const u = users.get(email);
  if (!u) return fail("Foydalanuvchi topilmadi");
  if (u.password !== password) return fail("Parol xato");
  return "OK";
}

const leaked = [
  ["dispatcher@alfa.example", "qwerty123456"],
  ["driver1@alfa.example", "autopark2024"],
  ["admin@beta.example", "boshqa-parol"],
];
let ok = 0;
leaked.forEach(([e, p], i) => {
  if (login(`203.0.113.${i + 1}`, e, p) === "OK") ok++;
});
console.log("stuffing: muvaffaqiyatli kirishlar =", ok);

const guesses = ["111", "222", "333", "444", "555", "666", "777", "888", "Gv7-kd29xQpL", "999"];
let cracked = "";
guesses.forEach((g, i) => {
  if (!cracked && login(`198.51.100.${i + 1}`, "admin@beta.example", g) === "OK") cracked = g;
});
console.log("brute force, topilgan parol:", cracked);
```

```text
stuffing: muvaffaqiyatli kirishlar = 2
brute force, topilgan parol: Gv7-kd29xQpL
```

IP limiti ikkala hujumda ham ishga tushmadi: har IP'dan atigi bitta urinish bo'ldi.

### Tuzatilgan kod

Tuzatish uch qismli: (1) akkaunt kaliti bo'yicha oshib boruvchi kechikish, mavjud bo'lmagan email uchun ham; (2) bitta umumiy xato javobi; (3) ommaviy ma'lum parol bilan kirilganda to'liq sessiya o'rniga step-up talab qilinadi. `compromised` ro'yxati real tizimda buzilgan parollar bazasidan keladi.

```ts run
type User = { email: string; password: string };
const users = new Map<string, User>([
  ["dispatcher@alfa.example", { email: "dispatcher@alfa.example", password: "qwerty123456" }],
  ["driver1@alfa.example", { email: "driver1@alfa.example", password: "autopark2024" }],
  ["admin@beta.example", { email: "admin@beta.example", password: "Gv7-kd29xQpL" }],
]);
const compromised = new Set(["qwerty123456", "autopark2024"]);

type State = { fails: number; until: number };
const state = new Map<string, State>();

function login(email: string, password: string, now: number): string {
  const key = email.toLowerCase();
  const st = state.get(key) ?? { fails: 0, until: 0 };
  state.set(key, st);
  if (now < st.until) return "429";
  const u = users.get(key);
  if (!u || u.password !== password) {
    st.fails++;
    if (st.fails >= 3) st.until = now + Math.min(2 ** (st.fails - 3) * 1000, 15 * 60 * 1000);
    return "401 Email yoki parol noto'g'ri";
  }
  st.fails = 0;
  return compromised.has(password) ? "STEP_UP" : "OK";
}

let ok = 0;
let stepUp = 0;
const leaked = [
  ["dispatcher@alfa.example", "qwerty123456"],
  ["driver1@alfa.example", "autopark2024"],
  ["admin@beta.example", "boshqa-parol"],
];
leaked.forEach(([e, p]) => {
  const r = login(e, p, 0);
  if (r === "OK") ok++;
  if (r === "STEP_UP") stepUp++;
});
console.log("stuffing: to'liq kirish =", ok, ", step-up =", stepUp);

const guesses = ["111", "222", "333", "444", "555", "666", "777", "888", "Gv7-kd29xQpL", "999"];
const results = guesses.map((g) => login("admin@beta.example", g, 0));
console.log("brute force:", results.slice(0, 4).join(" | "));
console.log("topildimi:", results.includes("OK"));
console.log("mavjud bo'lmagan email:", login("yoq@alfa.example", "x", 0));
console.log("5 soniyadan keyin to'g'ri parol:", login("admin@beta.example", "Gv7-kd29xQpL", 5000));
```

```text
stuffing: to'liq kirish = 0 , step-up = 2
brute force: 401 Email yoki parol noto'g'ri | 401 Email yoki parol noto'g'ri | 429 | 429
topildimi: false
mavjud bo'lmagan email: 401 Email yoki parol noto'g'ri
5 soniyadan keyin to'g'ri parol: OK
```

Nima uchun yetarli: brute force'da uchinchi xatodan keyin akkaunt kalitiga kechikish qo'yildi, shuning uchun 10 ta taxmin ichida to'g'ri parol navbatga yetmadi. Stuffing'da esa ikkala sizgan parol ham ommaviy ma'lum ekani bois to'liq sessiya o'rniga step-up natijasi qaytdi, uchinchisi shunchaki rad etildi. Javob hamma holatda bir xil matn, mavjud bo'lmagan email uchun ham holat yuritiladi. Yopilmagan: sizmagan, lekin keng tarqalgan bo'lmagan parol bilan egasi ham hujumchi ham xuddi shu parolni bilsa (shaxsiy sizish) ro'yxat ularni ajratmaydi; kechikish egasini ham vaqtincha to'sadi (hujumchi qurbonning kirishini sekinlashtirishi mumkin, to'liq bloklay olmaydi); IP/qurilma signallari va CAPTCHA bu kodda yo'q.

## Qachon qo'llamaslik kerak

Hamma foydalanuvchiga step-up va CAPTCHA yoqish qulaylikka zarar qiladi. Asosiy yo'l: risk signaliga ko'ra (yangi qurilma, ommaviy parol, keskin ko'p urinish) qo'shimcha tekshiruv. Qattiq lockout ayrim tartibga solingan muhitlarda (masalan, compliance talabi) kerak bo'lishi mumkin: bunda mavjudlik riskini bilib qabul qilasiz va ochish kanalini ishonchli qiling. Akkaunt bo'yicha throttling mashinadan mashinaga integratsiyalar (servis akkauntlari) uchun mos emas: ular tezkor va ko'p so'rov yuboradi, ularga API kalit yoki mTLS bering. Buzilgan parollar bazasiga so'rov yuborganda parolning o'zini uchinchi tomonga bermang: faqat qisman hash (k-anonymity) usullarini qo'llovchi xizmatlardan foydalaning yoki ro'yxatni o'z serveringizda saqlang. Bu yerda biror xizmat nomini tavsiya qilmaymiz, chunki manbalar ro'yxatida u tekshirilmagan.

## Stack'da: NestJS, Redis va Fastify

NestJS'da `@nestjs/throttler` (73-darsda ko'ramiz) IP/route bo'yicha limit beradi, bu foydali, lekin akkaunt bo'yicha throttling uchun kalit sifatida email'ni o'zingiz berishingiz kerak. Throttling holati bir nechta instance orasida umumiy bo'lishi uchun Redis'ga yoziladi: kalit `login:{sha256(email)}` shaklida, TTL kechikish muddati bilan; email'ni kalitda ochiq saqlamang. Hisoblagich oshirish `INCR` yoki Lua skripti bilan atomik bo'lsin, aks holda parallel so'rovlar limitni aylanib o'tadi (60-dars, race condition). Mavjud bo'lmagan email uchun ham xuddi shu yo'l: foydalanuvchini topib bo'lmasa soxta hash bilan hisoblang, shunda vaqt farqi qolmaydi. Fastify'da `onRequest` hook'ida umumiy IP limiti, route handler ichida akkaunt limiti. Hamma holatda 401 va 429 javoblari muvaffaqiyatsiz kirishlarni log'ga yozsin (79-dars), chunki stuffing'ni aniqlash log'dan boshlanadi.

## Xulosa

- Brute force, password spraying va credential stuffing turli hujum; har biriga o'z nazorati kerak.
- IP bo'yicha limit tarqoq hujumni ko'rmaydi; akkaunt bo'yicha limit stuffing'ni ko'rmaydi.
- NIST SP 800-63-4: yagona faktor uchun kamida 15, MFA qismi uchun kamida 8 belgi, kamida 64 belgigacha ruxsat, murakkablik qoidalari va davriy almashtirish yo'q, blocklist bor.
- Qattiq lockout mavjudlikka hujum imkonini beradi; oshib boruvchi kechikish (throttling) yaxshiroq kelishuv.
- Buzilgan parol bilan kirishda qo'shimcha faktor yoki almashtirishni talab qiling; MFA stuffing'ga qarshi asosiy to'siq.
- Javob matni va vaqti akkaunt mavjudligini oshkor qilmasin.
