---
n: 41
slug: authentication-modeli
title: "Authentication modeli: faktorlar va ishonch darajalari"
summary: "Identification, authentication va authorization farqi, uch faktor toifasi, NIST SP 800-63-4 dagi authentication assurance level'lar, phishing resistance, sessiya va qayta autentifikatsiya hamda mijoz yuborgan identifikatorga ishonish xatosi."
duration: 40
sources:
  - id: nist-63-4
    note: "SP 800-63B-4: AAL1-3 ta'riflari (AAL2 da ikki alohida faktor va kamida bitta phishing-resistant variant taklif qilinishi, AAL3 da eksport qilinmaydigan kalit), replay resistance, authentication intent, PSTN orqali out-of-band cheklangan authenticator ekani, syncable authenticator'lar AAL3 da taqiqlanishi, KBA'ni taklif qilmaslik va qayta autentifikatsiya muddatlari (AAL1 da 30 kun, AAL2 da 24 soat va harakatsizlik 1 soat, AAL3 da 12 soat va 15 daqiqa)"
  - id: t10-a07
    note: "OWASP Top 10:2025 A07 Authentication Failures: kategoriya nimani o'z ichiga olishi (credential stuffing, MFA yo'qligi yoki samarasizligi, knowledge-based answers, sessiya identifikatorini noto'g'ri boshqarish, credential ko'lami va auditoriyasini tekshirmaslik) va JWT uchun aud, iss va scope tekshiruvi"
  - id: cs-authn
    note: "Authentication Cheat Sheet: kirish, parolni tiklash va ro'yxatdan o'tishda bir xil umumiy xato javobi; nozik amallar va xavfli hodisalardan keyin qayta autentifikatsiya; qayta autentifikatsiyada xavfsizlik savollarini ishlatmaslik"
quiz:
  - q: "Avtopark platformasida foydalanuvchi parol va unga qo'shimcha 'maxfiy savol' javobini kiritadi. Bu tizim nechta faktor toifasini tekshiradi?"
    options:
      - "Ikkita: parol va savol alohida narsa"
      - "Bitta: ikkalasi ham 'bilganingiz' toifasiga kiradi"
      - "Uchta: parol, savol va kiritish qurilmasi"
      - "Nol: maxfiy savol autentifikatsiya emas, identifikatsiya"
    answer: 1
    explain: "Faktor sanalganda mexanizm soni emas, toifa soni hisoblanadi. Parol ham, maxfiy savol javobi ham bilim toifasiga kiradi, ya'ni bu bitta faktor. Ikkinchi faktor boshqa toifadan bo'lishi kerak: egalik (qurilma, kalit) yoki o'ziga xoslik."
  - q: "Backend har so'rovda 'x-user-id' sarlavhasidan foydalanuvchini aniqlaydi. Qaysi holatda bu xavfsiz bo'ladi?"
    options:
      - "Hech qachon: sarlavha ishonchli bo'lishi mumkin emas"
      - "Agar sarlavha nomi uzun va tasodifiy bo'lsa"
      - "Faqat sarlavhani ilovaga kelishidan oldin ishonchli proxy qo'ysa va mijozdan kelgan nusxasini o'chirsa, ilovaga to'g'ridan-to'g'ri kirish yopiq bo'lsa"
      - "Agar sarlavha HTTPS orqali kelsa"
    answer: 2
    explain: "Sarlavha ishonchli bo'lishi uchun uni faqat tekshirilgan komponent qo'yishi, mijozdan kelgan nusxasi o'chirilishi va ilovaga proxy'ni aylanib o'tib kirish yo'li yopiq bo'lishi shart. To'g'ri javob (uchinchi variant) shu uch shartni birga aytadi. 'Hech qachon' varianti haddan tashqari qat'iy: gateway modelida bu qonuniy dizayn. Nom uzunligi sirni almashtirmaydi, HTTPS esa sarlavhani kim qo'yganini hal qilmaydi."
  - q: "Ilova AAL2 darajasini maqsad qilgan. Qaysi yechim NIST SP 800-63-4 talabiga mos kelmaydi?"
    options:
      - "Parol va TOTP ilovasi"
      - "Parol va qurilmadagi passkey"
      - "Faqat parol, lekin 20 belgi uzunlikda"
      - "Foydalanuvchi qurilmasidagi passkey, lokal biometrik tasdiq bilan"
    answer: 2
    explain: "AAL2 da ikki alohida faktorning isboti talab qilinadi. Uzun parol ham bitta faktor (bilim). Parol va TOTP ikki toifa; passkey esa kriptografik kalitga egalikni lokal tasdiq bilan birlashtiradi."
  - q: "Foydalanuvchi sessiyasi ochiq turibdi. Admin 'barcha haydovchilar ro'yxatini CSV'ga eksport qilish' tugmasini bosdi. Qaysi dizayn authentication modeliga eng mos?"
    options:
      - "Sessiya mavjud bo'lsa ruxsat berish, chunki foydalanuvchi allaqachon kirgan"
      - "Har bosishda parolni qayta so'rash"
      - "Eksportni umuman o'chirib qo'yish"
      - "Sessiyadagi AAL va autentifikatsiya vaqtini tekshirish, yetarli bo'lmasa qayta (step-up) tasdiqlashni so'rash"
    answer: 3
    explain: "Step-up: nozik amal uchun sessiya ichidagi ishonch darajasi va yangiligi tekshiriladi. Har amalda parol so'rash foydalanuvchini charchatadi va xavfsizlikni oshirmaydi, sessiyaning o'zigagina ishonish esa o'g'irlangan sessiyaga bevosita yo'l ochadi."
  - q: "Kirish formasi mavjud bo'lmagan email uchun 'Foydalanuvchi topilmadi', noto'g'ri parol uchun 'Parol xato' deydi. Bu qaysi muammo?"
    options:
      - "Foydalanuvchilar ro'yxatini aniqlash (enumeration): hujumchi qaysi email'lar ro'yxatdan o'tganini biladi"
      - "SQL injection"
      - "CSRF"
      - "Hech qanday: aniq xabar foydalanuvchiga qulay"
    answer: 0
    explain: "Ikki xil javob akkaunt mavjudligini oshkor qiladi. Cheat sheet kirish, parolni tiklash va ro'yxatdan o'tishda bir xil umumiy javob (matn va HTTP javobi) qaytarishni talab qiladi. Qulaylik uchun xavfsizlikni yo'qotish kerak emas."
  - q: "Ikki xodim bir xil telefon raqamiga SMS qabul qiladi va ikkalasi ham parol kiritadi. Tizim buni 'ikki faktorli' deb hisoblaydi. Bu da'vo nimaga zid?"
    options:
      - "SMS kodi hech qachon faktor emas"
      - "Parol bilimga, SMS qurilmaga egalikka tegishli ekani to'g'ri; muammo faktor sonida emas, balki faktorni egasiga bog'lashda: umumiy telefon egalik isbotini yo'qqa chiqaradi"
      - "Ikkita faktor yetarli emas, uchta kerak"
      - "Telefon raqami bilim toifasiga kiradi"
    answer: 1
    explain: "Toifalar bo'yicha sanash to'g'ri, lekin faktor akkauntga yakka egalik qilganda ma'noga ega. Umumiy qabul qiluvchi telefon egalik faktorini yo'q qiladi. Birinchi variant noto'g'ri: NIST SP 800-63-4 da PSTN orqali out-of-band yetkazish (SMS, ovozli qo'ng'iroq) cheklangan (restricted) authenticator, lekin egalik faktori sifatida taqiqlanmagan. Uchinchi variant ham asossiz: AAL2 uchun ikki alohida faktor yetarli. Telefon raqami esa bilim emas, egalik kanali."
task:
  title: "Faktorlarni toifa bo'yicha sanash va step-up tekshiruvi"
  prompt: |
    `isMultiFactor(methods)` kirishda ishlatilgan usullar ro'yxatiga qarab, ular kamida ikki xil faktor toifasidan bo'lsa `true` qaytarishi kerak. Hozir u usullarning sonini sanaydi, shuning uchun `password + pin` (ikkalasi ham bilim) noto'g'ri tarzda ko'p faktorli hisoblanadi.

    `allowSensitive(session, now)` nozik amalga ruxsat beradi. U ham ko'p faktorli sessiyani, ham autentifikatsiya 15 daqiqadan eski emasligini talab qilishi kerak. Hozir faqat birinchisini tekshiradi (aslida u ham xato).

    Tuzating: toifalarni sanang (nomalum usul hisobga olinmaydi), step-up muddatini tekshiring. Imzolarni o'zgartirmang. Kutilgan chiqish: `false`, `true`, `false`, `false`.
  lang: ts
  starter: |
    type Category = "knowledge" | "possession" | "inherence";
    const CATEGORY: Record<string, Category> = {
      password: "knowledge",
      pin: "knowledge",
      totp: "possession",
      passkey: "possession",
      fingerprint: "inherence",
    };

    type Session = { methods: string[]; authAt: number };
    const STEP_UP_MS = 15 * 60 * 1000;

    function isMultiFactor(methods: string[]): boolean {
      return methods.length >= 2;
    }

    function allowSensitive(session: Session, now: number): boolean {
      return isMultiFactor(session.methods);
    }

    const t0 = 1_700_000_000_000;
    console.log(isMultiFactor(["password", "pin"]));
    console.log(isMultiFactor(["password", "totp"]));
    console.log(allowSensitive({ methods: ["password", "totp"], authAt: t0 }, t0 + 20 * 60 * 1000));
    console.log(allowSensitive({ methods: ["password", "unknown"], authAt: t0 }, t0 + 1000));
  solution: |
    type Category = "knowledge" | "possession" | "inherence";
    const CATEGORY: Record<string, Category> = {
      password: "knowledge",
      pin: "knowledge",
      totp: "possession",
      passkey: "possession",
      fingerprint: "inherence",
    };

    type Session = { methods: string[]; authAt: number };
    const STEP_UP_MS = 15 * 60 * 1000;

    function isMultiFactor(methods: string[]): boolean {
      const cats = new Set<Category>();
      for (const m of methods) {
        const c = CATEGORY[m];
        if (c) cats.add(c);
      }
      return cats.size >= 2;
    }

    function allowSensitive(session: Session, now: number): boolean {
      const fresh = now - session.authAt <= STEP_UP_MS;
      return fresh && isMultiFactor(session.methods);
    }

    const t0 = 1_700_000_000_000;
    console.log(isMultiFactor(["password", "pin"]));
    console.log(isMultiFactor(["password", "totp"]));
    console.log(allowSensitive({ methods: ["password", "totp"], authAt: t0 }, t0 + 20 * 60 * 1000));
    console.log(allowSensitive({ methods: ["password", "unknown"], authAt: t0 }, t0 + 1000));
  solutionNotes: |
    - `Set<Category>` faktor sonini toifa bo'yicha sanaydi: `password + pin` bitta toifa (bilim) beradi, shuning uchun `false`.
    - Nomalum usul `CATEGORY` da yo'q, shuning uchun hisobga olinmaydi (fail-safe default): `["password", "unknown"]` bitta toifa va `false`.
    - `allowSensitive` endi ikkita shartni birlashtiradi: autentifikatsiya yangiligi va faktor toifalari. Eski, lekin ko'p faktorli sessiya step-up'dan o'tmaydi.
    - 15 daqiqa bu yerda modelning tanlovi, NIST raqami emas. Real qiymatni amal xavfiga qarab siz belgilaysiz.
    - Bu kod faktor to'g'ri tekshirilganini isbotlamaydi: `methods` ro'yxatini faqat server tekshirgan natijadan to'ldirish kerak (46-dars).
  checklist:
    - "`password + pin` ko'p faktorli hisoblanmaydi"
    - "Nomalum usul hisobga olinmaydi"
    - "20 daqiqa oldingi autentifikatsiya nozik amalga ruxsat bermaydi"
    - "Imzolar o'zgarmagan"
---

## Muammo

Backend dasturchi "login" deganda odatda bitta narsani tushunadi: email va parolni olib, bazadagi hash bilan solishtirish. Production'da esa authentication bundan keng. OWASP Top 10:2025 da A07 Authentication Failures kategoriyasi bu kengligini ro'yxat bilan ko'rsatadi: credential stuffing kabi avtomatlashtirilgan hujumlarga yo'l qo'yish, MFA yo'q yoki samarasiz bo'lishi, MFA bo'lmaganda kuchsiz zaxira yo'llar, sessiya identifikatorini URL yoki boshqa xavfli joyda oshkor qilish, kirishdan keyin identifikatorni almashtirmaslik, chiqishda sessiyani bekor qilmaslik. Bu ro'yxatning birortasi ham "parolni noto'g'ri solishtirish" emas. Ya'ni tizim kirish formasi to'g'ri yozilgan bo'lsa ham authentication darajasida buzilishi mumkin.

Ikkinchi og'riq: terminlar aralashadi. "Login qilindi" degan gap uchta turli savolga javob beradi, ular alohida kodda hal qilinishi kerak. Kim bu? Qanchalik ishonchli isbotladi? Unga bu amalga ruxsat bormi? Birinchi ikkitasi authentication, uchinchisi authorization (51-dars). Jamoa ularni aralashtirsa, "foydalanuvchi kirgan, demak bu eksportni qila oladi" kabi xatolar paydo bo'ladi.

Uchinchi og'riq: "MFA qo'ydik" deb yozish osonligi. Parol va maxfiy savol MFA emas. SMS kodi ikkinchi faktor bo'la oladi, lekin NIST PSTN orqali out-of-band yetkazishni cheklangan (restricted) authenticator deb ataydi: uni qabul qilgan tashkilot xavfni baholab, ongli ravishda qabul qilishi kerak. Passkey ham MFA, ammo mexanizmi butunlay boshqa. Bu modulning birinchi darsida biz authentication'ni qanday o'ylash kerakligini beramiz: faktor toifalari, ishonch darajalari va sessiya haqidagi asosiy qoidalar. Keyingi darslar (42-50) shu modelni bo'laklab chuqurlashtiradi.

## Asosiy g'oya

### Identification, authentication, authorization

Uch savol:

1. Identification: "Siz o'zingizni kim deb ataysiz?" Email, login yoki foydalanuvchi identifikatori. Bu da'vo, hali isbot emas.
2. Authentication: "Bu da'vo to'g'riligini isbotlang." Parol, kod, kalit bilan.
3. Authorization: "Shu identifikatsiya qilingan va isbotlangan shaxs bu amalni qila oladimi?"

Authentication faqat ikkinchi savolga javob beradi va natijasi tor: "shu so'rov ma'lum subject nomidan keldi, ishonch darajasi shunday". Undan keyingi hamma narsa shu natijaga tayanadi, shuning uchun natija mijoz tomonidan o'zgartirib bo'lmaydigan joyda (server xotirasi, imzolangan ma'lumot) saqlanishi kerak.

### Uch faktor toifasi

Faktor sanash qoidasi: mexanizm soni emas, toifa soni hisoblanadi. An'anaviy toifalar:

- Bilim (something you know): parol, PIN, maxfiy savol javobi.
- Egalik (something you have): telefon, hardware kalit, passkey saqlangan qurilma.
- O'ziga xoslik (something you are): barmoq izi, yuz.

Parol va PIN ikkalasi bilim, shuning uchun ularning juftligi bitta faktor. Ko'p faktorli autentifikatsiya kamida ikki turli toifadan isbot talab qiladi. Bu bejiz emas: hujumchi bitta toifani o'g'irlash usulini topsa (masalan, phishing orqali bilimni), boshqa toifani ham bir vaqtda o'g'irlashi ancha qimmat.

### Ishonch darajalari: AAL

NIST SP 800-63-4 authentication'ni uch authentication assurance level (AAL) bilan tavsiflaydi. Quyidagi ma'nolar standart matniga tayanadi:

- AAL1: autentifikatsiya qiluvchi tomon subject o'ziga bog'langan authenticator'ni boshqarishiga asosiy ishonch oladi. Faqat bitta faktor yetarli, lekin ko'p faktorli variantlarni taklif qilish tavsiya etiladi.
- AAL2: yuqori ishonch. Ikkita alohida autentifikatsiya faktorining egaligi va nazorati isbotlanadi. AAL2 darajasida baholanadigan ilovalar phishing-resistant variantni taklif qilishi shart.
- AAL3: juda yuqori ishonch. Kriptografik protokol orqali kalitga egalik isboti, eksport qilib bo'lmaydigan maxfiy kalit va phishing resistance talab qilinadi.

Phishing resistance, standartdagi ma'nosi bilan, autentifikatsiya protokolining sirlarni va yaroqli authenticator chiqishlarini soxta tekshiruvchiga oshkor qilmaslik qobiliyati. Parol va TOTP kodini foydalanuvchi soxta saytga o'zi kiritishi mumkin; passkey'da esa brauzer kalitni faqat o'z origin'iga mos sayt uchun ishlatadi (45-dars).

Qaysi daraja kerakligini xavf belgilaydi, standart har tizimga AAL2 ni majburlamaydi. Avtopark platformasida haydovchining o'z marshruti ro'yxatini ko'rish bilan butun kompaniya GPS tarixini eksport qilish turli xavf, shuning uchun turli daraja.

## Chuqurroq: sessiya va qayta autentifikatsiya

Authentication bir marta bajarilmaydi: u sessiyaga aylanadi, sessiya esa tokenga tayanadi. Hujumchi parolni emas, sessiya tokenini o'g'irlasa, authentication butunlay chetlab o'tiladi. Shuning uchun NIST qayta autentifikatsiya muddatlarini belgilaydi: umumiy (overall) timeout AAL1 da 30 kundan oshmasligi, AAL2 da 24 soatdan oshmasligi tavsiya etiladi (SHOULD), AAL2 da harakatsizlik timeout'i bir soatdan oshmasligi tavsiya etiladi. Muddatlarning mexanikasi 46-darsda.

### AAL jadvali: faktordan tashqari nimalar farq qiladi

AAL faqat "nechta faktor" emas. NIST 800-63B-4 ning umumiy jadvalida har daraja uchun yana uchta xususiyat alohida ko'rsatilgan. Replay resistance (ushlangan authenticator chiqishini qayta ishlatib bo'lmasligi) AAL1 da talab qilinmaydi, AAL2 va AAL3 da talab qilinadi; AAL2 da kamida bitta authenticator replay-resistant bo'lishi yetarli. Authentication intent (foydalanuvchi ataylab tasdiqlagani, masalan tugmani bosishi) AAL1 da talab qilinmaydi, AAL2 da tavsiya etiladi (SHOULD), AAL3 da majburiy. Kalit eksport qilinishi AAL1 va AAL2 da mumkin, AAL3 da taqiqlangan. Amaliy natija: bulutga sinxronlanadigan (syncable) passkey'ning private key'i eksport qilinadigan bo'lgani uchun standart uni AAL3 da ishlatishni taqiqlaydi, AAL2 da esa qo'shimcha talablar bajarilsa qo'llanishi mumkin (sinxronlash tizimiga kirish ham AAL2 ga teng MFA bilan himoyalanishi kerak). Ya'ni "passkey ishlatdik" degan gap darajani o'zi aytib bermaydi: qaysi turdagi passkey ekanini bilish kerak (45-dars).

AAL2 ning o'zida ham ikki yo'l bor. Birinchisi, bitta ko'p faktorli authenticator (masalan, biometrik tasdiq bilan ochiladigan kriptografik kalit). Ikkinchisi, ikkita alohida bir faktorli authenticator kombinatsiyasi, bunda kamida bittasi jismoniy authenticator ("egalik") bo'lib, yoniga parol yoki biometrik taqqoslash qo'shiladi. Standart biometrik xususiyatni o'z-o'zicha authenticator deb tan olmaydi: yuz yoki barmoq izi har doim jismoniy authenticator bilan birga keladi. Shuning uchun "faqat barmoq izi bilan kirish" AAL da hisoblanmaydi.

### Nima authenticator emas

Parolni unutganda javob beriladigan "birinchi uy hayvoningiz kimligi" kabi savollar bilimga asoslangan autentifikatsiya (KBA) deyiladi. NIST verifier'lar va credential xizmat provayderlari (CSP) parol tanlayotganda foydalanuvchini KBA yoki security question ishlatishga undamasligi kerakligini yozadi (SHALL NOT), OWASP Top 10:2025 A07 esa "knowledge-based answers" ni xavfsiz qilib bo'lmaydigan zaif tiklash yo'li sifatida sanaydi. Authentication Cheat Sheet ham qayta autentifikatsiyada xavfsizlik savollarini ishlatmaslikni, akkauntga allaqachon bog'langan authenticator (joriy parol yoki passkey) so'rashni tavsiya qiladi. Sababi oddiy: bunday javoblarni ijtimoiy tarmoqdan topish yoki taxmin qilish mumkin va ular parol kabi tasodifiy emas.

### Qayta autentifikatsiya qachon kerak

NIST muddatni belgilaydi, OWASP esa hodisalarni sanaydi. Authentication Cheat Sheet qayta autentifikatsiyani parol yoki email kabi nozik ma'lumot o'zgartirilishidan oldin, akkauntni tiklash yoki parol reset'idan keyin, shubhali faollikda (IP o'zgarishi, yangi qurilma) va to'lov ma'lumotlari yoki yangi ishonchli qurilma qo'shish kabi yuqori xavfli amallar oldidan talab qiladi. Sabab ham yozilgan: bunday talab bo'lmasa, CSRF yoki XSS orqali hujumchi foydalanuvchining joriy parolini bilmasdan ham nozik amalni bajara oladi, o'g'irlangan sessiya identifikatori bilan esa to'liq nazoratni oladi. Qayta autentifikatsiyadan keyin sessiya identifikatori almashtirilishi kerak (46-dars).

### Credential kim uchun berilgan

A07 ro'yxatidagi so'nggi band ko'pincha unutiladi: credential'ning ko'lami va auditoriyasini (scope, audience) tekshirmaslik. Tashqi token olgan servis uni kim uchun berilganini tekshirmasa, boshqa servis uchun berilgan token ham o'tib ketadi. OWASP JWT uchun `aud`, `iss` da'volari va scope'larni tekshirishni aniq yozadi (47 va 49-darslar). Bu authentication modelining bir qismi: "kim" degan savol "kim uchun va qaysi servisga" degan savol bilan to'ldiriladi.

### Toifa bo'yicha sanash kodda

```ts run
type Category = "knowledge" | "possession" | "inherence";
const CATEGORY: Record<string, Category> = {
  password: "knowledge",
  pin: "knowledge",
  totp: "possession",
  hardwareKey: "possession",
  fingerprint: "inherence",
};

function categories(methods: string[]): Category[] {
  const set = new Set<Category>();
  for (const m of methods) {
    const c = CATEGORY[m];
    if (c) set.add(c);
  }
  return [...set];
}

for (const methods of [["password", "pin"], ["password", "totp"], ["hardwareKey", "fingerprint"], ["password"]]) {
  const c = categories(methods);
  console.log(methods.join(" + ").padEnd(24), c.length >= 2 ? "ko'p faktorli" : "bitta faktor", c.join(","));
}
```

```text
password + pin           bitta faktor knowledge
password + totp          ko'p faktorli knowledge,possession
hardwareKey + fingerprint ko'p faktorli possession,inherence
password                 bitta faktor knowledge
```

Jadvalga qarang: `password + pin` ikkita mexanizm, lekin bitta toifa. Kod nomalum usulni e'tiborsiz qoldiradi, ya'ni noma'lum narsa faktor sifatida sanalmaydi.

### Authenticator'ni akkauntga bog'lash

Faktor faqat bir shaxsga yakka bog'langanda ma'noga ega. Umumiy telefon, bir nechta xodim ishlatadigan umumiy email yoki hamma biladigan "kompaniya PIN'i" faktor deb sanalmaydi. Ro'yxatdan o'tish va qayta tiklash (50-dars) shu bog'lanishni yaratadi yoki buzadi. Eng zaif yo'l butun tizim ishonchini belgilaydi: parol bilan birga kuchli MFA bor, lekin "parolni unutdim" faqat emailga kod yuborsa, hujumchi MFA'ni chetlab o'tadi.

## Misol: foydalanuvchini mijoz sarlavhasidan aniqlash

Platforma keyinchalik API gateway orqasiga ko'chirilgan. Eski kod foydalanuvchi aniqlashni gateway qo'ygan `x-user-id` sarlavhasiga tayanadi. Gateway orqasida tekshirilgan sarlavha bu qabul qilinishi mumkin, ammo kod buni hech qayerda majburlamaydi.

### Zaif kod

```ts run
type Req = { headers: Record<string, string> };
type User = { id: string; tenant: string; role: string };

const users = new Map<string, User>([
  ["u1", { id: "u1", tenant: "alfa", role: "dispatcher" }],
  ["u9", { id: "u9", tenant: "beta", role: "admin" }],
]);

// ZAIF: foydalanuvchi mijoz yuborgan sarlavhadan olinadi. Tekshiruv yo'q.
function whoAmI(req: Req): User | null {
  const id = req.headers["x-user-id"];
  return id ? users.get(id) ?? null : null;
}

console.log(whoAmI({ headers: { "x-user-id": "u1" } }));
```

```text
{ id: 'u1', tenant: 'alfa', role: 'dispatcher' }
```

### Hujum

> **Ta'lim maqsadida.** Bu autentifikatsiyani aylanib o'tish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi "alfa" kompaniyasining oddiy dispetcheri. Ilovaga gateway'ni aylanib o'tib yoki gateway sarlavhani o'chirmasa, shunchaki sarlavhani o'zi qo'yadi. Bu faqat shu o'quv kodiga qarshi:

```ts run
type Req = { headers: Record<string, string> };
const users = new Map([["u9", { id: "u9", tenant: "beta", role: "admin" }]]);
function whoAmI(req: Req) {
  const id = req.headers["x-user-id"];
  return id ? users.get(id) ?? null : null;
}

// Hujumchi parolni bilmaydi, faqat boshqa foydalanuvchi identifikatorini taxmin qiladi:
console.log(whoAmI({ headers: { "x-user-id": "u9" } }));
```

```text
{ id: 'u9', tenant: 'beta', role: 'admin' }
```

Hujumchi boshqa tenant'ning administratori sifatida tanildi. Authentication umuman bo'lmadi: identifikatsiya da'vosi isbotsiz qabul qilindi. Bu OWASP ta'rifidagi holat: tizim noto'g'ri foydalanuvchini qonuniy deb tan oldi.

### Tuzatilgan kod

Tuzatishda identifikator mijozdan emas, serverda yaratilgan va faqat serverda saqlanadigan sessiyadan olinadi. Sessiya authentication natijasini (qaysi faktorlar, qachon) saqlaydi, nozik amal esa step-up tekshiruvidan o'tadi.

```ts run
type User = { id: string; tenant: string; role: string };
type Session = { userId: string; categories: number; authAt: number };

const users = new Map<string, User>([["u1", { id: "u1", tenant: "alfa", role: "dispatcher" }]]);
const sessions = new Map<string, Session>();
const STEP_UP_MS = 15 * 60 * 1000;

function newSessionId(): string {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Faqat server tekshirgan faktor toifalari soni yoziladi.
function createSession(userId: string, categories: number, now: number): string {
  const sid = newSessionId();
  sessions.set(sid, { userId, categories, authAt: now });
  return sid;
}

function whoAmI(cookieSid: string | undefined): User | null {
  const s = cookieSid ? sessions.get(cookieSid) : undefined;
  return s ? users.get(s.userId) ?? null : null;
}

function allowExport(sid: string, now: number): boolean {
  const s = sessions.get(sid);
  return !!s && s.categories >= 2 && now - s.authAt <= STEP_UP_MS;
}

const t0 = 1_700_000_000_000;
const weak = createSession("u1", 1, t0);
const strong = createSession("u1", 2, t0);
console.log("soxta sarlavha ishlamaydi:", whoAmI(undefined));
console.log("sessiya bilan:", whoAmI(weak)?.id);
console.log("bitta faktor, eksport:", allowExport(weak, t0 + 1000));
console.log("ikki faktor, eksport:", allowExport(strong, t0 + 1000));
console.log("ikki faktor, 20 daqiqadan keyin:", allowExport(strong, t0 + 20 * 60 * 1000));
```

```text
soxta sarlavha ishlamaydi: null
sessiya bilan: u1
bitta faktor, eksport: false
ikki faktor, eksport: true
ikki faktor, 20 daqiqadan keyin: false
```

Nima uchun yetarli: invariant endi shunday: subject faqat serverda yaratilgan 256-bit tasodifiy identifikator orqali topiladi, uni mijoz o'ylab topa olmaydi (tasodifiylik haqida 67-dars), faktor sonini esa server o'zi yozadi. Yopilgan hujum: sarlavhani soxtalashtirish. Yopilmagan: sessiya tokenini o'g'irlash (cookie bayroqlari 13-dars, sessiya muddati va bekor qilish 46-dars), parolni phishing qilish (45-dars). Step-up faqat sessiya tokenini o'g'irlagan, lekin ikkinchi faktorga ega bo'lmagan hujumchiga to'siq bo'ladi, agar faktor yangiligi alohida yangilansa; bu kodda ko'rsatilgan soddalashtirish.

## Qachon qo'llamaslik kerak

AAL3 yoki har amalda qayta autentifikatsiya hamma tizim uchun noto'g'ri. Ichki ma'lumot ko'rsatadigan, hech narsa o'zgartirmaydigan sahifa uchun har 15 daqiqada ikkinchi faktor so'rash foydalanuvchini parolni "eslab qolish" ga yoki mexanizmni chetlab o'tishga undaydi. NIST ham qayta autentifikatsiya muddatlarini SHOULD deb beradi, ya'ni xavf asosida sozlanadigan qiymat. Ikkinchi holat: B2B API integratsiyalari (mashinadan mashinaga) uchun faktor toifalari ma'nosiz; ularga alohida credential (API kalit, mTLS) kerak (66-dars). Uchinchisi: haddan tashqari murakkab step-up mantig'i o'zi xato manbai. Sodda qoida bilan boshlang: ro'yxatdagi besh-oltita eng nozik amal uchun yangi autentifikatsiya talab qiling, qolganini sessiya hal qilsin.

## Stack'da: NestJS va Next.js

NestJS'da authentication natijasi `request.user` ga faqat guard ichida, sessiya yoki tekshirilgan token asosida yoziladi. Controller `req.headers["x-user-id"]` ni hech qachon o'qimasligi kerak. Agar gateway sarlavha qo'ysa, ilova ichida uni bitta joyda (middleware) qabul qiling va ilovaga proxy'ni aylanib o'tib kirishni tarmoq darajasida yoping. Next.js'da identifikatsiya Server Component va Route Handler'da cookie'dan serverda hal qilinadi; mijoz komponentidagi "isLoggedIn" holati faqat interfeys uchun. Step-up tekshiruvini alohida funksiya (`requireRecentAuth(maxAgeMs)`) sifatida yozing va faqat nozik amallarda chaqiring. Authorization guard'lari 58-darsda.

## Xulosa

- Authentication identifikatsiya da'vosini isbotlaydi; "kim" va "nima qila oladi" turli savollar, birinchisi authentication, ikkinchisi authorization.
- Faktor toifa bo'yicha sanaladi: bilim, egalik, o'ziga xoslik. Parol va PIN bitta faktor.
- NIST SP 800-63-4 AAL1, AAL2, AAL3 ni belgilaydi; AAL2 da ikki faktor va phishing-resistant variant, AAL3 da eksport qilinmaydigan kalit talab qilinadi.
- Authentication natijasi serverda saqlanadi; mijoz yuborgan sarlavha, cookie qiymati yoki body'dagi "userId" ishonchsiz.
- Nozik amallar uchun sessiyadagi ishonch darajasi va yangiligi tekshiriladi (step-up), qayta autentifikatsiya muddatlari xavfga qarab belgilanadi.
- Eng zaif tiklash yo'li butun tizim ishonchini belgilaydi (50-dars).
