---
n: 94
slug: shaxsiy-malumotlar
title: "Shaxsiy ma'lumotlar: O'zbekiston qonunchiligi va privacy by design"
summary: "O'RQ-547 (Shaxsga doir ma'lumotlar to'g'risida) va O'RQ-764 (Kiberxavfsizlik to'g'risida) qonunlarining dasturchi uchun ahamiyatli moddalari lex.uz matni bo'yicha: ma'lumot turlari, maqsad va rozilik, saqlash joyi, operator majburiyatlari, hodisa haqida xabar berish; privacy by design kodda: maydonlarni tasniflash, maqsad bo'yicha proyeksiya, anonimlashtirish."
duration: 50
sources:
  - id: lex-pdp
    note: "O'RQ-547 (02.07.2019) lex.uz'dagi joriy tahrir, 2026-11-11 da o'qilgan: 4-modda (asosiy tushunchalar), 5 (prinsiplar), 15 (transchegaraviy uzatish), 16 (egasizlantirish), 19 (ishlov berish talablari), 21 (rozilik), 27 (himoya kafolatlari), 27-1 (saqlash va ishlov berishning alohida shartlari), 31 (mulkdor va operator majburiyatlari), 33 (javobgarlik); 20-moddaning birinchi qismi O'RQ-1125 (26.03.2026) tahririda"
  - id: lex-cyber
    note: "O'RQ-764 (15.04.2022) lex.uz'dagi joriy matn, 2026-11-11 da o'qilgan: 3-modda (kiberxavfsizlik hodisasi ta'rifi), 16 (kiberxavfsizlik subyektlarining huquq va majburiyatlari, hodisa haqida vakolatli organni xabardor qilish va raqamli izlarni saqlash), 23-24 (hodisalar bo'yicha choralar va axborotni oshkor qilish), 37 (javobgarlik)"
  - id: nist-ssdf
    note: "Umumiy ramka: xavfsiz dasturiy ta'minot yaratish amaliyotlari. Bu dars SSDF'dan aniq amaliyot raqamlarini keltirmaydi (bu qism tekshirilmagan)"
quiz:
  - q: "Platformada haydovchining ismi, telefon raqami va uning boshqargan mashinasining GPS izi saqlanadi. O'RQ-547 4-moddasidagi ta'rifga ko'ra bu 'shaxsga doir ma'lumotlar'mi?"
    options:
      - "Yo'q: GPS izi mashinaga tegishli, odamga emas"
      - "Ha, agar ma'lumot muayyan jismoniy shaxsga taalluqli bo'lsa yoki uni identifikatsiya qilish imkonini bersa; haydovchiga bog'langan iz shunday bo'lishi mumkin (yuridik baho uchun yurist kerak)"
      - "Faqat pasport raqami shaxsga doir ma'lumot"
      - "Faqat qog'ozdagi ma'lumot"
    answer: 1
    explain: "Ta'rif keng: muayyan jismoniy shaxsga taalluqli yoki uni identifikatsiya qilish imkonini beradigan axborot, elektron, qog'oz yoki boshqa moddiy jismda qayd etilgan. Haydovchiga bog'langan GPS izi shu ta'rifga tushishi mumkin. Aniq yuridik xulosa yurist ishi."
  - q: "Foydalanuvchi ma'lumotlarini 'xizmatni ko'rsatish' maqsadida yig'ib, keyin marketing uchun ishlatishga qaror qildingiz. O'RQ-547 19-moddasiga ko'ra nima kerak?"
    options:
      - "Hech narsa, ma'lumot allaqachon sizda"
      - "Ishlov berish maqsadi o'zgargan taqdirda subyektning o'zgargan maqsadga muvofiq roziligini olish kerak"
      - "Faqat saytga e'lon qo'yish"
      - "Faqat ma'lumotni shifrlash"
    answer: 1
    explain: "19-modda: maqsad yig'ish chog'ida bildirilgan maqsadlarga mos bo'lishi kerak va maqsad o'zgarsa, o'zgargan maqsad uchun rozilik olinadi. Shifrlash maqsad cheklovini almashtirmaydi."
  - q: "Dasturchi sifatida 'maqsadga muvofiq proyeksiya' (purpose-based projection) qanday ishlaydi?"
    options:
      - "Hamma maydonni qaytarib, frontend ko'rsatmaydigan qilish"
      - "Har maqsad (hisobot, support, billing) uchun ruxsat etilgan maydonlar ro'yxati oldindan belgilanadi va faqat shular qaytariladi; ro'yxatda yo'q maydon default holatda qaytmaydi"
      - "Maydonlarni base64 bilan yozish"
      - "Faqat adminlarga hamma narsani ko'rsatish"
    answer: 1
    explain: "Allowlist yondashuv default-deny: yangi maydon qo'shilganda u avtomatik hech qaysi maqsadga kirmaydi. Frontend'da yashirish ma'lumotni API javobidan olib tashlamaydi, base64 esa shifrlash emas."
  - q: "O'RQ-547 27-1-moddasi (joriy matn) biometrik ma'lumotlar haqida nimani belgilaydi?"
    options:
      - "Ular istalgan mamlakatda saqlanishi mumkin"
      - "Jismoniy shaxslarning biometrik va genetik ma'lumotlari O'zbekiston hududida saqlanishi shart (shuningdek telekommunikatsiya operatorlaridagi foydalanuvchi ma'lumotlari)"
      - "Biometrik ma'lumot yig'ish butunlay taqiqlangan"
      - "Faqat davlat organlari saqlay oladi"
    answer: 1
    explain: "Moddaning ikkinchi qismi shu uch toifani O'zbekiston hududida saqlanishi shartligini aytadi. Qolgan ma'lumotlar uchun chet elda saqlash alohida shartlardan biri bajarilganda mumkin. Bu dars yuridik maslahat emas: loyihangizga tatbiq etish uchun yurist kerak."
  - q: "Saqlash muddati tugagan GPS yozuvlarini 'anonimlashtirish' deganda nimani tushunamiz, O'RQ-547 16-moddasi ruhida?"
    options:
      - "Haydovchi ismini 'X' ga o'zgartirish, lekin ID qoldirish"
      - "Ma'lumotning muayyan subyektga tegishliligini aniqlash imkoni qolmaydigan harakatlar; ID yoki boshqa bog'lovchi maydonlar ham olib tashlanishi yoki qaytarilmas qilib o'zgartirilishi kerak"
      - "Yozuvni arxivga ko'chirish"
      - "Faqat jadval nomini o'zgartirish"
    answer: 1
    explain: "16-moddaga ko'ra egasizlantirish harakatlari natijasida ma'lumotning muayyan subyektga tegishliligini aniqlash imkoni qolmaydi. Ism almashtirilib ID qolsa, ID orqali shaxs tiklanadi (re-identification)."
  - q: "O'RQ-764 16-moddasiga ko'ra kiberxavfsizlik subyektlari hodisa sodir bo'lganda, boshqa narsalar qatori, nima qilishlari kerak?"
    options:
      - "Hodisa haqida hech kimga bildirmaslik"
      - "Hodisa va kiberjinoyatlar haqida vakolatli davlat organini xabardor qilish, tegishli raqamli izlar yo'qolishiga yo'l qo'ymaslik va tahlil uchun zarur ma'lumotlar saqlanishini ta'minlash"
      - "Faqat mijozlarga xat yuborish"
      - "Barcha loglarni o'chirish"
    answer: 1
    explain: "16-modda aynan shuni sanaydi: vakolatli organni xabardor qilish, raqamli izlarni saqlash va ma'lumotlarning doimiy saqlanishini ta'minlash. Kompaniyangiz 'kiberxavfsizlik subyekti' ta'rifiga kirishini aniqlash yurist ishi; 93-darsdagi dalilni saqlash tamoyili shu bilan mos."
task:
  title: "Maqsad bo'yicha proyeksiya: ortiqcha shaxsiy ma'lumotni qaytarmaslik"
  prompt: |
    `project(row, purpose)` haydovchi yozuvidan faqat berilgan maqsad uchun zarur maydonlarni qaytaradi. Hozirgi versiya hamma maydonni qaytaradi, shuning uchun dispetcherlik hisoboti pasport raqami va uy manzilini ham oladi.

    Maqsadlar va ruxsat etilgan maydonlar: `report` - `id`, `name`, `trips`; `support` - `id`, `name`, `phone`; `billing` - `id`, `name`, `plan`. Noma'lum maqsad uchun bo'sh obyekt qaytsin (default-deny). Yozuvda bo'lmagan maydon natijaga qo'shilmasin (`undefined` qiymatli kalit ham bo'lmasin). Asl yozuv o'zgarmasin. Imzoni o'zgartirmang. Oxirgi qatorlar kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    type Row = {
      id: string;
      name: string;
      phone: string;
      passport: string;
      address: string;
      plan: string;
      trips: number;
    };

    function project(row: Row, purpose: string): Record<string, unknown> {
      return { ...row };
    }

    const row: Row = {
      id: "d1",
      name: "Aziz K.",
      phone: "+998900000001",
      passport: "AA0000000",
      address: "Toshkent, namunaviy ko'cha 1",
      plan: "pro",
      trips: 42,
    };
    console.log("report:", Object.keys(project(row, "report")).join(","));
    console.log("support:", Object.keys(project(row, "support")).join(","));
    console.log("billing:", Object.keys(project(row, "billing")).join(","));
    console.log("noma'lum:", Object.keys(project(row, "marketing")).length);
    console.log("asl o'zgardimi:", Object.keys(row).length);
  solution: |
    type Row = {
      id: string;
      name: string;
      phone: string;
      passport: string;
      address: string;
      plan: string;
      trips: number;
    };

    const ALLOWED: Record<string, (keyof Row)[]> = {
      report: ["id", "name", "trips"],
      support: ["id", "name", "phone"],
      billing: ["id", "name", "plan"],
    };

    function project(row: Row, purpose: string): Record<string, unknown> {
      const fields = Object.hasOwn(ALLOWED, purpose) ? ALLOWED[purpose] : [];
      const out: Record<string, unknown> = {};
      for (const f of fields) if (row[f] !== undefined) out[f] = row[f];
      return out;
    }

    const row: Row = {
      id: "d1",
      name: "Aziz K.",
      phone: "+998900000001",
      passport: "AA0000000",
      address: "Toshkent, namunaviy ko'cha 1",
      plan: "pro",
      trips: 42,
    };
    console.log("report:", Object.keys(project(row, "report")).join(","));
    console.log("support:", Object.keys(project(row, "support")).join(","));
    console.log("billing:", Object.keys(project(row, "billing")).join(","));
    console.log("noma'lum:", Object.keys(project(row, "marketing")).length);
    console.log("asl o'zgardimi:", Object.keys(row).length);
  solutionNotes: |
    - Maqsad bo'yicha allowlist: har maqsad uchun maydonlar ro'yxati oldindan yozilgan. Yangi maydon (masalan `birthDate`) qo'shilsa, u hech qaysi maqsadga avtomatik kirmaydi (default-deny).
    - `Object.hasOwn(ALLOWED, purpose)` tekshiruvi `"constructor"` kabi prototip kalitlarini noma'lum maqsad deb hisoblaydi (91-darsdagi allowlist tuzog'i).
    - Natija yangi obyekt: asl yozuv o'zgarmaydi va xotirada qaytariladigan obyektga `passport` ni tasodifan qo'shib bo'lmaydi.
    - Bu faqat javob shaklini cheklaydi. Qaysi rol qaysi maqsadni so'ray olishi (avtorizatsiya, 51-58-darslar), saqlash muddati va rozilik alohida nazoratlar.
  checklist:
    - "`report`, `support`, `billing` faqat o'z maydonlarini qaytaradi"
    - "Noma'lum maqsad (shu jumladan `constructor`) bo'sh obyekt beradi"
    - "Asl yozuv o'zgarmaydi"
    - "Pasport va manzil hech qaysi tavsiflangan maqsadga kirmaydi"
    - "Proyeksiya avtorizatsiyani almashtirmasligini ayta olasiz"
---

## Muammo

Platformada haydovchining ismi, telefon raqami, guvohnomasi, mashina GPS izi, video yozuv va yoqilg'i hisoboti saqlanadi. Dasturchi uchun bular "ustunlar", qonun uchun esa shaxsga doir ma'lumotlar bo'lishi mumkin. Odatiy xatolar: hamma maydonni har hisobotga qo'shish ("kerak bo'lib qolar"), logga telefon raqamini yozish, saqlash muddatini belgilamaslik, foydalanuvchi so'rasa ma'lumotini topib chiqarib berish yoki o'chirish imkoniyatini oldindan qurmaslik. Bularning har biri texnik nuqson sifatida ham (maxfiylik buzilishi, 1-dars), huquqiy nuqson sifatida ham (talablarga mos kelmaslik) oqibat beradi.

Ikkinchi muammo: dasturchilar qonun matnini o'qimaydi, yuristlar esa kod qanday ishlashini bilmaydi. Natijada "qonun talab qiladi" degan gap texnik talabga aylanmaydi. Bu dars qonunning dasturchi uchun muhim joylarini lex.uz'dagi joriy matn bo'yicha qisqa keltiradi va ularni kod darajasidagi amaliyotga (privacy by design) bog'laydi.

Bu dars yuridik maslahat emas. Qonunlar o'zgaradi (quyida ko'rasiz, 2026-yil tahrirlari mavjud), ularning kompaniyangizga tatbiqi (siz mulkdormi yoki operatormi, qaysi toifadagi ma'lumot, qaysi hudud) yurist ishi.

## Asosiy g'oya

### O'RQ-547: asosiy tushunchalar

"Shaxsga doir ma'lumotlar to'g'risida" O'zbekiston Respublikasining Qonuni (02.07.2019, O'RQ-547) lex.uz'da bir necha marta o'zgartirilgan tahrirda turibdi. 4-moddaga ko'ra shaxsga doir ma'lumotlar muayyan jismoniy shaxsga taalluqli bo'lgan yoki uni identifikatsiya qilish imkonini beradigan, elektron tarzda, qog'ozda yoki boshqa moddiy jismda qayd etilgan axborot. Subyekt shu ma'lumot taalluqli bo'lgan jismoniy shaxs. Ishlov berish ma'lumotni yig'ish, tizimlashtirish, saqlash, o'zgartirish, to'ldirish, ulardan foydalanish, berish, tarqatish, uzatish, egasizlantirish va yo'q qilish bo'yicha bir harakat yoki harakatlar majmuasi. Mulkdor ma'lumotlar bazasiga egalik qilish, foydalanish va tasarruf etish huquqiga ega, operator esa ishlov berishni amalga oshiruvchi tomon.

Dasturchi uchun xulosa: "ishlov berish" so'zi juda keng. Faqat bazaga yozish emas, log'ga yozish, hisobotga qo'shish, boshqa servisga yuborish va o'chirish ham ishlov berish. Haydovchiga bog'langan GPS izi muayyan odamni identifikatsiya qilishga imkon bersa, ta'rifga tushishi mumkin (bu bizning talqinimiz).

### Prinsiplar, maqsad va rozilik

5-modda prinsiplar qatoriga ishlov berish maqsadlari va usullarining qonuniyligi, ma'lumotlarning aniqligi va ishonchliligi, maxfiyligi va himoya qilinganligini kiritadi. 19-modda talablarini texnik tilga o'girsak: maqsad hujjatlarda belgilanadi va qonunga mos bo'ladi; maqsad yig'ish chog'ida bildirilgan maqsadga mos bo'lishi kerak, maqsad o'zgarsa o'zgargan maqsad uchun subyektdan rozilik olinadi; ma'lumotlar aniq va ishonchli bo'lishi, zarur bo'lsa o'zgartirilishi va to'ldirilishi kerak; ishlov beriladigan ma'lumotlarning hajmi va xususiyati maqsad va usullarga mos bo'lishi kerak.

21-modda bo'yicha subyekt rozilikni uning olinganligi faktini tasdiqlash imkonini beradigan har qanday shaklda beradi; maxsus shaxsga doir ma'lumotlar uchun yozma shakldagi (elektron hujjat tarzida ham) rozilik talab etiladi; muomalaga layoqatsiz yoki cheklangan, shuningdek voyaga yetmagan subyektlar uchun qonuniy vakillar (ota-ona, vasiy, homiy) yozma rozilik beradi. Texnik oqibat: rozilik faktini isbotlash mumkin bo'lishi kerak, ya'ni kim, qachon, qaysi matn versiyasi va qaysi maqsad uchun rozilik bergani saqlanadi (31-modda ham mulkdor va operator rozilik olinganligi dalilini taqdim etishi kerak bo'lgan hollarni nazarda tutadi).

### Saqlash joyi va transchegaraviy uzatish

27-1-moddaning joriy matniga ko'ra O'zbekiston fuqarolarining shaxsga doir ma'lumotlari qonunning asosiy prinsiplari ta'minlangan holda saqlanishi lozim. Jismoniy shaxslarning biometrik ma'lumotlari, genetik ma'lumotlari va O'zbekistonda faoliyat yurituvchi telekommunikatsiya operatorlaridagi ularning xizmatlaridan foydalanuvchi jismoniy shaxslar ma'lumotlari O'zbekiston hududida saqlanishi shart. Boshqa shaxsga doir ma'lumotlar chet elda saqlanishi va ishlov berilishi mumkin, agar quyidagilardan biri bajarilsa: chet davlat ma'lumotlarni bir xil himoya qiluvchi davlat sifatida tan olingan bo'lsa; operator vakolatli organ tasdiqlagan talablarga javob beruvchi standart shartnomaviy shartlar yoki majburiy korporativ qoidalarni qabul qilib, ularga rioya etsa; yoki operator vakolatli organ tasdiqlagan ro'yxatdagi xalqaro standartlarga rioya etsa. Bir xil himoya qiluvchi davlatlar ro'yxatini Vazirlar Mahkamasi belgilaydi. 15-modda esa transchegaraviy uzatishni umumiy tartibga soladi. 20-moddaning birinchi qismi esa (O'RQ-1125 (26.03.2026) tahririda) 27-1-moddaning ikkinchi qismi bo'yicha O'zbekistonda saqlanishi shart bo'lgan ma'lumotlar bazalari shaxsga doir ma'lumotlar bazalari davlat reyestrida ro'yxatdan o'tkazilishi lozimligini aytadi.

Misol: avtopark platformasi haydovchi yuzini tanish (biometrik ma'lumot bo'lishi mumkin) yoki video ma'lumotlarni chet eldagi cloud'da saqlasa, bu 27-1 bo'yicha alohida huquqiy savol. Qaror qabul qilishdan oldin yurist bilan aniqlang. Dasturchi vazifasi: ma'lumot turi bo'yicha saqlash joyini konfiguratsiyada ifodalash va kodda tekshirish.

### Operator majburiyatlari

31-moddaga ko'ra mulkdor va operator, boshqa narsalar qatori: qonunchilikka rioya etadi; subyekt murojaati bo'yicha uning ma'lumotlariga ishlov berish haqida axborot beradi; o'z vazifalarini bajarish uchun zarur va yetarli ma'lumotlar tarkibini tasdiqlaydi; ishlov berish maqsadiga erishilganda yoki qonunda belgilangan boshqa hollarda ma'lumotlarni yo'q qilish choralarini ko'radi; zarur hollarda rozilik olinganligi dalilini taqdim etadi; ishonchli hujjatlar bilan tasdiqlansa, ma'lumotlarni o'zgartiradi yoki to'ldiradi, imkoni bo'lmasa yo'q qiladi; ishlov berish shartlari buzilganligi haqida axborot bo'lsa, ishlov berishni vaqtincha to'xtatadi yoki ma'lumotlarni yo'q qiladi. 27-modda mulkdor, operator va uchinchi shaxs ma'lumotlarni himoya qilish bo'yicha huquqiy, tashkiliy va texnik choralar ko'rishini, shu jumladan ma'lumotlarning yaxlitligi, maxfiyligi va qonunga xilof ishlov berilishining oldini olish kafolatlanishini yozadi. Bu aynan CIA triadasi (1-dars) tili.

33-modda qonunchilikni buzganlik uchun belgilangan tartibda javobgarlikni nazarda tutadi; lex.uz sharhi Ma'muriy javobgarlik to'g'risidagi kodeksning 46-2-moddasi va Jinoyat kodeksining 141-2-moddasiga havola beradi (bu darsda ularning mazmuni o'qilmagan).

### O'RQ-764: kiberxavfsizlik hodisalari

"Kiberxavfsizlik to'g'risida"gi Qonun (15.04.2022, O'RQ-764) 3-moddasida kiberxavfsizlik hodisasini kibermakonda axborot tizimlari ishlashida uzilishlarga va (yoki) ulardagi axborotning ochiqligi, yaxlitligi va undan erkin foydalanilishining buzilishiga olib kelgan hodisa deb ta'riflaydi (ya'ni CIA bilan mos). 16-modda kiberxavfsizlik subyektlarining majburiyatlarini sanaydi: ma'lumotning qonunga xilof tarqalishi, o'g'irlanishi, yo'qolishi, yaxlitligi buzilishi, bloklanishi va soxtalashtirilishining oldini olish va aniqlanganda o'z vaqtida choralar ko'rish; salbiy oqibatlarni kamaytirish uchun tizimlarni tezkor tiklash choralari; sodir bo'lgan kiberxavfsizlik hodisalari va kiberjinoyatlar haqida vakolatli davlat organini xabardor qilish, hodisani fosh etish uchun tegishli raqamli izlar yo'qolishiga yo'l qo'ymaslik va tahlil uchun zarur ma'lumotlarning doimiy saqlanishini ta'minlash. 23-modda hodisalar bo'yicha choralar shakllarini (zaifliklarni bartaraf etish, zararli dasturlarni yo'q qilish, obyektlarni ajratib qo'yish, huquqni muhofaza qiluvchi organlarga ma'lumot berish) sanaydi; 24-modda zaifliklar va hujumlar haqidagi axborot himoya choralari ko'rilgandan keyin kiberxavfsizlik subyektining ruxsati bilan oshkor qilinishi mumkinligini va aniqlangan zaifliklar haqidagi axborot faqat ularni bartaraf etish va qonunga xilof harakatlarning oldini olish uchun ishlatilishini yozadi (9-dars bilan bog'liq).

Qaysi kompaniya "kiberxavfsizlik subyekti" ta'rifiga kirishi (3-moddadagi ta'rif milliy axborot resurslariga egalik qilish yoki elektron axborot xizmatlarini ko'rsatish kabi belgilarga tayanadi) va qanday muddat hamda shaklda xabar berilishi bu darsda aniqlanmagan; ularni yurist bilan aniqlang. Dasturchi uchun amaliy xulosa: raqamli izlar (loglar) hodisadan keyin ham saqlanishi kerak, shuning uchun 93-darsdagi "o'chirmaymiz, belgilaymiz" tamoyili va qonun talabi mos tushadi.

## Chuqurroq: privacy by design kodda

Privacy by design bu kod darajasidagi bir necha odat:

- Maydonlarni tasniflash. Har maydon uchun toifa (oddiy, shaxsga doir, maxsus/biometrik) va maqsad yoziladi. Tasniflanmagan maydon qo'shib bo'lmaydi (CI qoidasi).
- Maqsad bo'yicha proyeksiya. Har maqsad uchun ruxsat etilgan maydonlar ro'yxati (default-deny). Bu 19-moddadagi hajm va maqsad mosligining kod ifodasi.
- Saqlash muddati va anonimlashtirish. Maqsadga erishilganda ma'lumotni yo'q qilish yoki egasizlantirish (16-modda: ma'lumotning muayyan subyektga tegishliligini aniqlash imkoni qolmaydi). Ism almashtirib ID qoldirish egasizlantirish emas.
- Subyekt so'rovi. Muayyan odam haqida saqlanayotgan hamma narsani topish va eksport qilish (31-modda: axborot berish), tuzatish va o'chirish funksiyalari baza dizaynida oldindan nazarda tutiladi.
- Log va xato xabarlarida shaxsiy ma'lumot yo'q (79 va 93-darslar).
- Ma'lumot turi bo'yicha saqlash joyi konfiguratsiyada va kodda tekshiriladi.

## Misol: haydovchi hisoboti

Misol faqat o'quv modelimizga qarshi: xotiradagi yozuvlar va shartli sanalar. Hamma ismlar va raqamlar o'ylab topilgan.

### 1. Zaif kod

```ts run
type Driver = { id: string; name: string; phone: string; passport: string; address: string; trips: number; role?: string };
const drivers: Driver[] = [
  { id: "d1", name: "Aziz K.", phone: "+998900000001", passport: "AA0000001", address: "Toshkent, namunaviy 1", trips: 42 },
  { id: "d2", name: "Bahrom T.", phone: "+998900000002", passport: "AA0000002", address: "Toshkent, namunaviy 2", trips: 17 },
];

// ZAIF: hisobot hamma maydonni qaytaradi; kim so'raganidan qat'i nazar
function monthlyReportWeak(_requesterRole: string): Driver[] {
  return drivers;
}
const rep = monthlyReportWeak("dispatcher");
console.log("dispetcher hisoboti maydonlari:", Object.keys(rep[0]).join(","));
console.log("pasport ko'rinadi:", rep.every((r) => r.passport.length > 0));
```

### 2. Hujum

Bu yerda "hujum" ichki foydalanuvchining oddiy harakati: dispetcher faqat oylik hisobotni ochadi. Hisobot uchun ism va safar soni yetarli edi, lekin API javobida hamma narsa bor: pasport raqami va manzil ham. Frontend ularni ko'rsatmasa ham, brauzer tarmoq oynasi yoki skript ularni o'qiydi. Natija:

```text
dispetcher hisoboti maydonlari: id,name,phone,passport,address,trips
pasport ko'rinadi: true
```

Ortiqcha ma'lumot oshkor bo'lish yuzasini kengaytiradi: dispetcher akkaunti buzilsa yoki ma'lumot log'ga tushsa, pasport raqamlari ham sizadi. Bu 19-modda talab qilgan hajm va maqsad moslik prinsipiga zid.

### 3. Tuzatilgan kod

```ts run
type Driver = { id: string; name: string; phone: string; passport: string; address: string; trips: number; lastSeen: string };
const drivers: Driver[] = [
  { id: "d1", name: "Aziz K.", phone: "+998900000001", passport: "AA0000001", address: "Toshkent, namunaviy 1", trips: 42, lastSeen: "2026-01-10" },
  { id: "d2", name: "Bahrom T.", phone: "+998900000002", passport: "AA0000002", address: "Toshkent, namunaviy 2", trips: 17, lastSeen: "2025-02-01" },
];

// 1) Maqsad bo'yicha proyeksiya (default-deny)
const PURPOSES: Record<string, (keyof Driver)[]> = {
  report: ["id", "name", "trips"],
  support: ["id", "name", "phone"],
};
function project(d: Driver, purpose: string): Partial<Driver> {
  const out: Partial<Driver> = {};
  for (const f of Object.hasOwn(PURPOSES, purpose) ? PURPOSES[purpose] : []) (out as Record<string, unknown>)[f] = d[f];
  return out;
}

// 2) Saqlash muddati: muddati o'tganlar egasizlantiriladi (shaxsni bog'lovchi maydonlar olib tashlanadi)
const RETENTION_DAYS = 365;
function anonymize(list: Driver[], today: string) {
  const limit = Date.parse(today) - RETENTION_DAYS * 86400000;
  return list.map((d) =>
    Date.parse(d.lastSeen) < limit ? { trips: d.trips, region: "Toshkent" } : d,
  );
}

// 3) Subyekt so'rovi: bitta odam haqida hamma narsa
const exportFor = (id: string) => drivers.filter((d) => d.id === id);

console.log("report:", JSON.stringify(drivers.map((d) => project(d, "report"))));
console.log("noma'lum maqsad:", JSON.stringify(project(drivers[0], "constructor")));
console.log("anonimlashtirish:", JSON.stringify(anonymize(drivers, "2026-11-11")));
console.log("subyekt eksporti maydonlari:", Object.keys(exportFor("d1")[0]).join(","));
```

```text
report: [{"id":"d1","name":"Aziz K.","trips":42},{"id":"d2","name":"Bahrom T.","trips":17}]
noma'lum maqsad: {}
anonimlashtirish: [{"id":"d1","name":"Aziz K.","phone":"+998900000001","passport":"AA0000001","address":"Toshkent, namunaviy 1","trips":42,"lastSeen":"2026-01-10"},{"trips":17,"region":"Toshkent"}]
subyekt eksporti maydonlari: id,name,phone,passport,address,trips,lastSeen
```

Tuzatish nima uchun yetarli: hisobot faqat zarur maydonlarni qaytaradi (default-deny, shu jumladan prototip kalitlariga qarshi); saqlash muddati o'tgan yozuvdan shaxsni bog'lovchi maydonlar (`id`, `name`, `phone`, `passport`, `address`, `lastSeen`) olib tashlanadi, faqat umumiy statistikaga yaroqli qiymatlar qoladi. Yopilmagan narsa: bu yerda `trips` + `region` birga kichik guruhda yana shaxsni aniqlashi mumkin (re-identification), real anonimlashtirish uchun guruhlash va statistik tekshiruv kerak; proyeksiya avtorizatsiyani almashtirmaydi (kim `report` ni so'ray oladi, 51-58-darslar); rozilik saqlash, huquqiy asos va saqlash joyi bu kodda yo'q; muddat (365 kun) modelning o'ylab topilgan qiymati, qonundan olinmagan.

### Saqlash joyi kodda

27-1-moddadagi toifa bo'yicha qoidani konfiguratsiyada ifodalash va tekshirish mumkin. Quyidagi funksiya qonunning matnini emas, jamoa belgilagan siyosatni ifodalaydi: u yurist tasdiqlagan qoidalar bilan to'ldirilishi kerak.

```ts run
type Category = "oddiy" | "biometrik" | "genetik" | "telekom";
type Place = { country: string; basis?: "standart-shartnoma" | "tan-olingan-davlat" | "xalqaro-standart" };

// Siyosat (jamoa/yurist belgilaydi): bu kod faqat siyosatni qo'llaydi
const MUST_STAY = new Set<Category>(["biometrik", "genetik", "telekom"]);
function storageAllowed(cat: Category, place: Place): { ok: boolean; why: string } {
  if (place.country === "UZ") return { ok: true, why: "O'zbekiston hududida" };
  if (MUST_STAY.has(cat)) return { ok: false, why: "bu toifa O'zbekistonda saqlanishi shart" };
  if (!place.basis) return { ok: false, why: "chet elda saqlash uchun asos ko'rsatilmagan" };
  return { ok: true, why: `asos: ${place.basis}` };
}

console.log(storageAllowed("biometrik", { country: "XX" }));
console.log(storageAllowed("oddiy", { country: "XX" }));
console.log(storageAllowed("oddiy", { country: "XX", basis: "standart-shartnoma" }));
console.log(storageAllowed("telekom", { country: "UZ" }));
```

```text
{ ok: false, why: "bu toifa O'zbekistonda saqlanishi shart" }
{ ok: false, why: "chet elda saqlash uchun asos ko'rsatilmagan" }
{ ok: true, why: 'asos: standart-shartnoma' }
{ ok: true, why: "O'zbekiston hududida" }
```

Bu funksiya hukm chiqarmaydi: asos (`basis`) ning haqiqatan mavjudligini, davlat ro'yxatini yoki shartnoma tasdiqlanganini tekshirmaydi. U faqat xato konfiguratsiyani erta (CI yoki deploy vaqtida) ushlaydi.

## Qachon qo'llamaslik kerak

Hamma maydonni majburan shifrlash yoki hamma ma'lumotni chekka holatgacha cheklash ish jarayonini buzishi mumkin: support xodimi telefon raqamsiz mijozga yordam bera olmaydi. Maqsad yo'qlik emas, mutanosiblik: har maqsad uchun zarur va yetarli ma'lumot.

Anonimlashtirish ba'zan ish uchun mumkin emas: moliyaviy yoki huquqiy talab ma'lum muddat identifikatsiya qilinadigan yozuvni saqlashni talab qilsa, o'chirish qonunga zid bo'lishi mumkin. Bunday ziddiyatlarni dasturchi o'zi hal qilmaydi: yurist va ma'lumotlar mas'uli bilan saqlash jadvali kelishiladi.

Texnik nazorat qonuniy muvofiqlikni kafolatlamaydi. Rozilik matni, huquqiy asos, davlat reyestrida ro'yxatdan o'tish va xabar berish majburiyatlari yurist bilan hal etiladi. Bu darsda qonunning faqat yuqorida keltirilgan moddalari o'qildi; qolgan moddalar (masalan 30-modda: subyektning huquq va majburiyatlari, 17-modda: yo'q qilish) va ularga bog'liq qarorlar o'qilmagan.

Qonunlar o'zgaradi. Bu darsdagi matn 2026-11-11 da lex.uz'dan o'qilgan va unda 2026-yil tahrirlari borligi ko'rindi (masalan, 20-moddaning birinchi qismi O'RQ-1125 (26.03.2026) tahririda). Loyihada qonun matnini hujjat sifatida emas, havola va o'qilgan sana bilan yozing va davriy qayta tekshiring.

## Stack'da: Prisma, PostgreSQL va NestJS

Maydon tasnifi uchun schema'da izoh yoki alohida metadata jadvali (`column_classification`) ishlatiladi va CI testi yangi ustun tasniflanmaganini topadi. Proyeksiya Prisma'da `select` bilan so'rov darajasida bajariladi (ma'lumot xotiraga ham kelmaydi), NestJS'da esa har maqsad uchun alohida DTO/serializer: serializatsiyada `@Exclude()` faqat belgilangan maydonni olib tashlaydi (default-allow, yangi maydon sizib chiqishi mumkin), `@Expose()` va `@SerializeOptions({ excludeExtraneousValues: true })` esa faqat e'lon qilingan maydonlarni qaytaradi (NestJS serialization hujjatidagi ogohlantirishga ko'ra). Saqlash muddati uchun jadval darajasida `retention` job (cron) va anonimlashtirish SQL'da `UPDATE` bilan (identifikatorlarni NULL qilish). PostgreSQL'da shaxsiy maydonlarni alohida jadvalga ajratib, rol huquqini cheklash va tenant izolyatsiyasi uchun RLS (56-dars) ishlatish mumkin. Quyidagi parcha Prisma `select` yondashuvini ko'rsatadi (ishga tushirilmaydi: Prisma mijozi bazaga ulanishni talab qiladi; sintaksis tekshirilgan):

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// "report" maqsadi: pasport va manzil so'rovning o'zida tanlanmaydi
export function driversForReport(tenantId: string) {
  return prisma.driver.findMany({
    where: { tenantId },
    select: { id: true, name: true, tripCount: true },
  });
}
```

## Xulosa

- Shaxsga doir ma'lumot ta'rifi keng (O'RQ-547, 4-modda): muayyan odamga taalluqli yoki uni identifikatsiya qilish imkonini beruvchi axborot; "ishlov berish" log, hisobot va o'chirishni ham qamraydi.
- Maqsad yig'ish chog'ida belgilanadi va o'zgarsa yangi rozilik talab qilinadi (19-modda); rozilik faktini isbotlash mumkin bo'lishi kerak (21 va 31-moddalar).
- 27-1-moddaning joriy matniga ko'ra biometrik, genetik va telekommunikatsiya operatorlaridagi foydalanuvchi ma'lumotlari O'zbekistonda saqlanishi shart; boshqalar uchun chet elda saqlash alohida shartlar bilan. Tatbiq etish yurist ishi.
- O'RQ-764 16-moddasi kiberxavfsizlik subyektlaridan hodisa haqida vakolatli organni xabardor qilish va raqamli izlarni saqlashni talab qiladi; kompaniyangiz subyekt ekanini yurist aniqlaydi.
- Privacy by design kodda: maydon tasnifi, maqsad bo'yicha default-deny proyeksiya, saqlash muddati va haqiqiy anonimlashtirish, subyekt so'rovi funksiyalari.
- Bu dars yuridik maslahat emas; qonun matnini o'qilgan sana bilan yozing va davriy qayta tekshiring.
