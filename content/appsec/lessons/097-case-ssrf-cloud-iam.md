---
n: 97
slug: case-ssrf-cloud-iam
title: "Case study: SSRF va cloud IAM orqali ma'lumot sizishi"
summary: "OCC hujjatlarida tasdiqlangan narsa (cloud'ga o'tishdagi risk baholash va nazorat kamchiliklari) va tasdiqlanmagan narsa; SSRF, metadata xizmati va ortiqcha huquqli rol zanjiri o'quv modelida; har bo'g'inni alohida yopish."
duration: 45
sources:
  - id: occ-capital-one
    note: "OCC news release 2020-101 (2020-08-06): Capital One, N.A. va Capital One Bank (USA), N.A. ga 80 million dollarlik civil money penalty; sabab: public cloud'ga muhim IT operatsiyalarni ko'chirishdan oldin samarali risk baholash jarayonlari o'rnatilmagani va kamchiliklar o'z vaqtida tuzatilmagani; 12 C.F.R. Part 30, Appendix B bilan nomuvofiqlik; OCC mijozlarni xabardor qilish va tuzatish harakatlarini ijobiy hisobga olgan"
  - id: occ-capital-one-order
    note: "Consent Order PDF (OCC vakili 2020-yil 5-avgustda imzolagan, direktorlar kengashi imzolari 30-iyuldan 1-avgustgacha; sarlavhada AA-EC-20-51): II modda Comptroller's Findings - cloud'ga o'tishdan oldin samarali risk baholash jarayonlari o'rnatilmagani; network security, data loss prevention va alertlarni qayta ishlash (dispositioning) bo'yicha risk boshqaruvi yetarli emasligi; internal audit ko'plab nazorat kamchiliklarini aniqlamagani va audit qo'mitasiga samarali yetkazmagani; kengash ayrim internal audit xavotirlari bo'yicha rahbariyatni javobgar qilmagani; bank 'neither admits nor denies'; III modda - civil money penalty; matnda SSRF, IAM, 2019-yilgi hodisa tafsilotlari yoki ta'sirlangan mijozlar soni yo'q"
  - id: cs-ssrf
    note: "SSRF Prevention Cheat Sheet: SSRF ilovani ichki/tashqi tarmoq yoki mashinaning o'ziga murojaat qilish uchun suiiste'mol qilish vektori; SSRF HTTP bilan cheklanmaydi (ikkinchi so'rov boshqa protokol va sxemalarda bo'lishi mumkin); ikki holat: ishonchli ichki ilovalarga so'rov (allowlist) va ixtiyoriy tashqi manzilga so'rov (deny-list so'nggi chora); domen allowlist'i DNS rebinding'ni to'xtatmaydi, ulanish tekshirilgan IP'ga bog'lanishi kerak; redirect'ni o'chirish; IMDSv2 qo'shimcha defense-in-depth (ayrim holatlarni yumshatadi); IPv4-mapped IPv6 normalizatsiya; metadata va private diapazonlar jadvali; application va network qatlamlarida himoya"
quiz:
  - q: "Bu dars manbalaridan (OCC news release va consent order) kelib chiqib, qaysi gap tasdiqlangan?"
    options:
      - "Hodisa SSRF orqali, IAM rolining ortiqcha huquqi tufayli sodir bo'lgan"
      - "Hodisada ma'lum miqdordagi mijoz ma'lumoti sizgan"
      - "OCC risk baholash jarayonlari cloud'ga o'tishdan oldin samarali o'rnatilmagani va kamchiliklar o'z vaqtida tuzatilmagani uchun 80 million dollar jarima qo'ygan"
      - "Jarima hodisani yashirgani uchun qo'yilgan"
    answer: 2
    explain: "Release aynan shu sababni yozadi. SSRF, IAM roli va mijozlar soni OCC manbalarida yo'q, shuning uchun ularni bu manbalarga nisbat berib bo'lmaydi. Hodisani yashirish haqida ham gap yo'q: OCC mijozlarni xabardor qilish va tuzatish harakatlarini ijobiy hisobga olgan."
  - q: "Cloud muhitida SSRF nima uchun alohida xavfli?"
    options:
      - "SSRF faqat cloud'da ishlaydi"
      - "Server mashinasining ichki metadata xizmatiga (masalan 169.254.169.254) murojaat qila oladi va u yerdan mashinaga biriktirilgan rolning vaqtinchalik credential'larini olish mumkin"
      - "Cloud'da HTTP ishlamaydi"
      - "SSRF foydalanuvchi brauzerini boshqaradi"
    answer: 1
    explain: "SSRF Cheat Sheet cloud'da SSRF ko'pincha metadata xizmatlaridan credential va token olish uchun ishlatilishini yozadi. Serverning o'zi hujumchi nomidan so'rov yuboradi va ichki manzilga yetadi. Brauzer bu zanjirda emas."
  - q: "Ilova URL'ning hostname satrini '169.254' bilan boshlanishiga tekshiradi. Hujumchi `http://2852039166/` yubordi. Nima bo'ladi?"
    options:
      - "Tekshiruv uni to'xtatadi"
      - "Faqat IPv6 manzillar muammo"
      - "URL noto'g'ri, so'rov bajarilmaydi"
      - "Hostname normalizatsiyadan keyin `169.254.169.254` bo'ladi; satr tekshiruvi normalizatsiyadan oldin bajarilsa, o'tib ketadi. Tekshirish ajratilgan (parse va resolve qilingan) IP ustida bo'lishi kerak"
    answer: 3
    explain: "WHATWG URL parser o'nlik shakldagi IPv4 hostni nuqtali shaklga o'tkazadi. Normalizatsiyadan oldingi matn bo'yicha tekshiruv aylanib o'tiladi. Bundan tashqari domen nomi ichki IP'ga resolve bo'lishi mumkin, shuning uchun resolve qilingan IP tekshiriladi."
  - q: "Servis roliga faqat o'z prefiksidagi obyektlarni o'qish huquqi berilgan. SSRF orqali uning credential'lari o'g'irlandi. Least privilege bu holatda nimani beradi?"
    options:
      - "Zarar rolning huquqi bilan cheklanadi: hujumchi faqat o'sha prefiksni o'qiy oladi, boshqa tenant ma'lumotiga yetmaydi"
      - "Hech narsa: credential o'g'irlangan bo'lsa, hammasi ochiq"
      - "Credential'lar avtomatik bekor bo'ladi"
      - "SSRF endi ishlamaydi"
    answer: 0
    explain: "Least privilege SSRF'ni to'xtatmaydi, lekin uning oqibatini (blast radius) kamaytiradi. Bu defense in depth: har qatlam alohida, boshqasi yiqilganda ham zararni cheklaydi."
  - q: "Deny-list: ilova `169.254.169.254` va `localhost` hostname'larini bloklaydi. Nima uchun bu yetarli emas?"
    options:
      - "Yetarli"
      - "Faqat HTTPS'da ishlamaydi"
      - "Boshqa shakllar (o'nlik/oltilik IP, ichki IP'ga resolve bo'ladigan domen, redirect) ro'yxatdan chetlab o'tadi; SSRF Cheat Sheet deny-list'ni so'nggi chora deb ataydi va allowlist'ni afzal ko'radi"
      - "Deny-list tezlikni sekinlashtiradi, xolos"
    answer: 2
    explain: "Cheat sheet 'deny-lists are bypass-prone, prefer allow-lists' deydi. Ro'yxat ham ishlaydigan bo'lsa, resolve qilingan IP ustida ishlashi, redirect'ni o'chirishi va tarmoq darajasida ham to'sishi kerak."
  - q: "Case study yozayotganda faqat birlamchi manbada tasdiqlanmagan texnik tafsilotni (masalan, aniq hujum zanjirini) darsga kiritish kerakmi?"
    options:
      - "Yo'q: manbada yo'q narsani shu manbaga nisbat bermang; umumiy mexanizmni alohida o'quv modeli sifatida ko'rsating va nima tasdiqlanganini ajrating"
      - "Ha: hamma biladi, shuning uchun yozish mumkin"
      - "Ha, agar ehtimol bo'lsa"
      - "Faqat sarlavhada yozish mumkin"
    answer: 0
    explain: "Kurs qoidasi: haqiqiy hodisa haqida faqat birlamchi manbada tasdiqlangan narsa yoziladi. Mexanizm sifatida SSRF va rol zanjiri mustaqil o'quv modelida ko'rsatiladi, hodisaning tafsiloti sifatida emas."
task:
  title: "SSRF himoyasi: resolve qilingan IP bo'yicha tekshiruv"
  prompt: |
    `isBlockedTarget(url, dns)` URL'ni so'rovga ruxsat berishdan oldin tekshiradi. Hozirgi versiya hostname satriga qaraydi va aylanib o'tiladi. Tuzating: URL'ni `new URL` bilan parse qiling, hostname'ni `dns` jadvali bo'yicha IP'ga aylantiring (jadvalda yo'q bo'lsa, hostname o'zi IP deb olinadi), so'ng IP quyidagilardan biriga tegishli bo'lsa `true` (bloklansin) qaytaring: `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `0.0.0.0/8`. Faqat `http:` va `https:` sxemalarga ruxsat; boshqa sxema, parse bo'lmaydigan URL va nuqtali IPv4 bo'lmagan (IPv6 kabi) hostname uchun ham `true` (ruxsat berilmagan deb hisoblang). Imzoni o'zgartirmang. Oxirgi qatorlar kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    function isBlockedTarget(url: string, dns: Record<string, string>): boolean {
      const host = url.replace(/^https?:\/\//, "").split("/")[0];
      return host.startsWith("169.254.") || host === "localhost" || host.startsWith("127.");
    }

    const dns = { "cdn.example": "198.51.100.10", "rebind.example": "10.0.0.5" };
    const cases = [
      "https://cdn.example/logo.png",
      "http://169.254.169.254/latest/meta-data",
      "http://2852039166/",
      "http://rebind.example/admin",
      "http://172.20.1.1/",
      "file:///etc/passwd",
      "http://[::1]/",
      "not a url",
    ];
    for (const c of cases) console.log(String(isBlockedTarget(c, dns)).padEnd(5), c);
  solution: |
    function isBlockedTarget(url: string, dns: Record<string, string>): boolean {
      let u: URL;
      try {
        u = new URL(url);
      } catch {
        return true;
      }
      if (u.protocol !== "http:" && u.protocol !== "https:") return true;
      const ip = dns[u.hostname] ?? u.hostname;
      const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
      if (!m) return true;
      const [a, b] = [Number(m[1]), Number(m[2])];
      if (a === 127 || a === 10 || a === 0) return true;
      if (a === 172 && b >= 16 && b <= 31) return true;
      if (a === 192 && b === 168) return true;
      if (a === 169 && b === 254) return true;
      return false;
    }

    const dns = { "cdn.example": "198.51.100.10", "rebind.example": "10.0.0.5" };
    const cases = [
      "https://cdn.example/logo.png",
      "http://169.254.169.254/latest/meta-data",
      "http://2852039166/",
      "http://rebind.example/admin",
      "http://172.20.1.1/",
      "file:///etc/passwd",
      "http://[::1]/",
      "not a url",
    ];
    for (const c of cases) console.log(String(isBlockedTarget(c, dns)).padEnd(5), c);
  solutionNotes: |
    - `new URL` hostname'ni normalizatsiya qiladi: `2852039166` o'nlik IPv4 `169.254.169.254` ga aylanadi. Tekshiruv normalizatsiyadan keyin, resolve qilingan IP ustida bajariladi.
    - `rebind.example` kabi domen ichki IP'ga resolve bo'ladi: satr tekshiruvi buni ko'rmaydi, IP tekshiruvi ko'radi.
    - Tushunarsiz holatlarda (IPv6, nuqtali IPv4 bo'lmagan hostname, boshqa sxema, parse xatosi) bloklanadi: fail-safe default (3-dars).
    - Qoldiq risk: bu tekshiruv va haqiqiy so'rov orasida DNS javobi o'zgarishi mumkin (DNS rebinding), shuning uchun real kodda so'rov aynan tekshirilgan IP'ga yuboriladi; redirect'lar o'chiriladi; tarmoq qatlami (egress filtri) va metadata xizmati sozlamalari ham kerak (27-dars).
  checklist:
    - "O'nlik shakldagi `2852039166` bloklanadi"
    - "Ichki IP'ga resolve bo'ladigan domen bloklanadi"
    - "`file:` sxemasi, IPv6 va parse bo'lmaydigan URL bloklanadi"
    - "Tashqi manzil (`cdn.example`) ruxsat oladi"
    - "Qoldiq risklarni (DNS rebinding, redirect, tarmoq qatlami) ayta olasiz"
---

## Muammo

Cloud'ga ko'chgan jamoa ko'pincha ikki narsani aralashtiradi. Birinchisi: "ilovada zaiflik yo'q, demak xavfsizmiz". Ikkinchisi: "cloud provayder xavfsizlikni o'zi hal qiladi". Haqiqatda cloud'da yangi sirt paydo bo'ladi: instance metadata xizmati, rollar va ruxsat siyosatlari, ob'ekt saqlash. Ilovadagi bitta URL parametri (masalan "rasm manzili" yoki "webhook URL") serverni ichki tarmoqqa va shu xizmatlarga eltuvchi eshikka aylanadi, ortiqcha huquqli rol esa eshik ortidagi hamma narsani ochib beradi.

Bu darsda ikki xil material bor va ularni aralashtirmaslik muhim. Birinchisi, regulyator OCC hujjatlarida tasdiqlangan narsa: cloud'ga o'tishdagi risk baholash va nazorat kamchiliklari uchun qo'yilgan jarima. Ikkinchisi, SSRF + metadata + IAM zanjirining o'quv modeli: u umumiy mexanizm, OCC hujjatlari tasdiqlagan hodisa tafsiloti emas. Bu farqni ochiq aytish case study'ning halolligi.

## Asosiy g'oya

### OCC hujjatlarida nima tasdiqlangan

OCC news release 2020-101 (2020-yil 6-avgust) sarlavhasi: OCC Capital One'ga 80 million dollarlik civil money penalty qo'ydi. Release'ga ko'ra OCC Capital One, N.A. va Capital One Bank (USA), N.A. ga qarshi bu choralarni bankning muhim axborot texnologiyalari operatsiyalarini public cloud muhitiga ko'chirishdan oldin samarali risk baholash jarayonlarini o'rnatmagani va kamchiliklarni o'z vaqtida tuzatmagani sababli ko'rgan. OCC bu kamchiliklarni xavfli yoki nosog'lom amaliyot (unsafe or unsound practices) deb baholagan va 12 C.F.R. Part 30, Appendix B ("Interagency Guidelines Establishing Information Security Standards") ga rioya qilinmaganini aytgan. Shuningdek OCC jarimani belgilashda bankning mijozlarni xabardor qilish va tuzatish harakatlarini ijobiy hisobga olgani yozilgan.

Consent order (2020-yil 5-avgustda imzolangan) bankning ayblarni tan olmasligi va rad etmasligini ("neither admits nor denies") qayd etadi. Order II moddasida (Comptroller's Findings) quyidagilar sanalgan: bank cloud'ga o'tishdan oldin samarali risk baholash jarayonlarini o'rnatmagan; cloud muhitida risk boshqaruvi, jumladan network security nazoratlari, data loss prevention nazoratlari va alertlarni qayta ishlash (dispositioning of alerts) yetarli bo'lmagan; internal audit ko'plab nazorat kamchiliklarini aniqlamagan va ularni audit qo'mitasiga samarali yetkazmagan; kengash ayrim internal audit xavotirlari bo'yicha rahbariyatni javobgar qilish uchun samarali choralar ko'rmagan. III modda jarimani belgilaydi. Order'da SSRF, IAM roli, 2019-yilgi hodisaning texnik tafsilotlari yoki ta'sirlangan mijozlar soni qayd etilmagan. Shuning uchun bu darsda hodisaning texnik sababi haqida hech narsa da'vo qilinmaydi.

Dasturchi uchun xulosa: regulyator nuqtai nazaridan asosiy gap bitta zaiflik emas, jarayon: cloud'ga o'tishdan oldin riskni baholash, nazoratlarning dizayni, alertlarning haqiqatan ko'rib chiqilishi va mustaqil auditning kamchiliklarni aniqlashi. Bu to'rt narsani kurs amaliyotlariga bog'lash mumkin (bu bizning talqinimiz, OCC matni emas): cloud'ga o'tishdan oldingi risk baholash threat modeling'ga (4-dars) to'g'ri keladi, alertlarni qayta ishlash incident response va security logging'ga (93 va 79-darslar), mustaqil nazorat esa kodni ko'rish va sinashga (91 va 92-darslar). Shuni ham ta'kidlash kerakki, order jarayon nuqsonlarini sanaydi; hodisaning texnik sababi bu hujjatlarda yo'q.

### Mexanizm: zanjir va uning bo'g'inlari

Quyidagi zanjir umumiy sinf; u OCC hujjatlarida tasdiqlanmagan, mexanizm sifatida SSRF cheat sheet'ga tayanadi. Cheat sheet SSRF ni ilovani ichki yoki tashqi tarmoq yoki mashinaning o'zi bilan o'zaro aloqaga majburlash vektori deb ta'riflaydi va cloud muhitida SSRF ko'pincha metadata xizmatlaridan (AWS, Azure, GCP) credential va access token olish uchun ishlatilishini yozadi. Zanjirning bo'g'inlari:

1. Kirish: ilova foydalanuvchi bergan URL'ga server nomidan so'rov yuboradi (27-dars).
2. Ichki xizmatga yetish: so'rov metadata xizmatiga yoki ichki API'ga boradi, chunki server ichki tarmoqda.
3. Credential: metadata xizmati mashinaga biriktirilgan rolning vaqtinchalik credential'larini beradi.
4. Huquq: rol qancha ko'p huquqli bo'lsa, o'g'irlangan credential shuncha ko'p narsani ochadi (88-dars).
5. Ma'lumot: ob'ekt saqlash yoki baza ma'lumotni qaytaradi; bu yerda ham ichki so'rovlar log'ga yoziladi va alert beradi (79-dars).

Har bo'g'in alohida yopiladi va birining yiqilishi qolganlarini bekor qilmaydi. Bu defense in depth (3-dars).

## Chuqurroq: har bo'g'inda nima yordam beradi

### Ilova qatlami

Cheat sheet allowlist'ni afzal ko'radi: ilova qaysi ichki ilovalarga murojaat qilishi aniq bo'lsa, faqat shularga ruxsat. Ilova ixtiyoriy tashqi URL'ga so'rov yuborishi kerak bo'lsa (masalan, webhook), allowlist ishlamaydi va deny-list so'nggi chora bo'ladi; cheat sheet deny-list'larning bypass'ga moyil ekanini aniq yozadi. Minimal bloklanadigan diapazonlar sifatida metadata manzillari (`169.254.169.254` va AWS uchun IPv6 `fd00:ec2::254`), localhost (`127.0.0.0/8`), RFC1918 xususiy tarmoqlar (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) va link-local (`169.254.0.0/16`) ko'rsatilgan. Tekshiruv hostname satrida emas, URL parse qilinib resolve qilingan IP ustida bo'lishi, so'rov esa aynan tekshirilgan IP'ga yuborilishi va redirect'lar o'chirilishi kerak (cheat sheet misolidagi oxirgi qadam redirect'ni o'chirishni eslatadi).

URL parser normalizatsiyasi ham tuzoq: WHATWG URL `http://2852039166/` ni `169.254.169.254` hostiga aylantiradi (quyidagi misolda ko'rasiz), shuning uchun satr bo'yicha tekshiruv normalizatsiyadan oldin bajarilsa o'tkazib yuboradi. IPv4-mapped IPv6 shakli esa boshqa ko'rinishga (`[::ffff:a9fe:a9fe]`) keladi; shu sababli IPv6 manzillarni umuman rad etish yoki to'liq ishlashni yozish kerak.

### SSRF'ning ikki holati va qo'shimcha tuzoqlar

SSRF Prevention Cheat Sheet SSRF'ni ikki holatga ajratadi, chunki himoya shunga bog'liq. Birinchi holat: ilova faqat aniq ma'lum va ishonchli ichki ilovalarga so'rov yuboradi. Bunda allowlist ishlaydi: domen yoki IP aniq ro'yxat bilan qat'iy (registrga sezgir) taqqoslanadi. Ikkinchi holat: ilova ixtiyoriy tashqi IP yoki domenga so'rov yuborishi kerak (webhook, rasm manzili). Bunda allowlist mumkin emas va deny-list so'nggi chora bo'ladi; cheat sheet uning ilovada nega qiyin ekanini yozadi: ilova xususiy tarmoq diapazonlari, localhost va IPv4/IPv6 link-local manzillarni kodda aniqlashi kerak, har SDK buni qilmaydi, ichki domen nomlari uchun esa markazlashgan xizmat kerak.

Cheat sheet'ning uchta kamroq esga olinadigan nuqtasi bor. Birinchisi: SSRF faqat HTTP emas. Birinchi so'rov odatda HTTP bo'ladi, lekin ikkinchi so'rovni ilovaning o'zi yuborsa, u boshqa protokol va sxemalarda (FTP, SMB, SMTP, `file://`, `gopher://` va h.k.) bo'lishi mumkin; shuning uchun sxema ham allowlist qilinadi (bizning kodimizda faqat `http:` va `https:`). Ikkinchisi: domen allowlist'i yagona o'zi DNS rebinding'dan himoya qilmaydi. Cheat sheet tekshirishdan keyin ikkinchi, tekshirilmagan DNS so'rovi himoyani chetlab o'tishi mumkinligini aytadi va yechimni beradi: HTTP klient faqat tekshirilgan IP'ga ulanadi, shu bilan birga asl hostname `Host` header'i, TLS SNI va sertifikat tekshiruvi uchun saqlanadi; xuddi shu siyosat qayta urinishlar va fallback ulanishlarga ham qo'llanadi. Uchinchisi: IPv4-mapped IPv6 manzil (`::ffff:169.254.169.254`) o'sha xostga yetadi, shuning uchun manzil diapazonlar bilan solishtirishdan oldin o'zining asl IPv4 shakliga keltiriladi (normalizatsiya).

Cheat sheet qabul qiluvchi tomondan ham himoya g'oyasini beradi: so'rovni qabul qiluvchi ichki ilova tasodifiy token (masalan 20 belgili) yaratadi va chaqiruvchi uni so'rovda yuborishi kerak, endpoint esa faqat POST qabul qiladi. Shunda ilova ichki xizmatga uning "legitimligini isbotlamasdan" murojaat qila olmaydi. Bizning o'quv modelimizdagi `x-metadata-token` sarlavhasi shu g'oyaning soddalashtirilgan ko'rinishi, IMDSv2 ning ham asosida o'xshash fikr bor.

### Metadata xizmati

Cheat sheet AWS uchun IMDSv2 ni qo'shimcha defense-in-depth sifatida tavsiya qiladi: u SSRF ning ayrim holatlarini yumshatadi, IMDSv2 ga o'tib eski IMDSv1 ni o'chirish kerak. Muhim: bu yengillashtirish, kafolat emas, cheat sheet "mitigates some of the instances" deydi. AWS hujjatiga ko'ra IMDSv2 da token `PUT` so'rovi bilan olinadi va keyingi `GET` so'rovlarida sarlavhada yuboriladi, `PUT` javobining standart hop limit'i 1 (88-dars). Shu sababli faqat `GET` yubora oladigan oddiy SSRF tokenni ololmaydi, lekin `PUT` va sarlavha yubora oladigan SSRF uchun bu to'siq emas.

### Rol huquqi

Least privilege (3-dars) bu zanjirda oqibatni kamaytiradigan eng ishonchli bo'g'in: servis roliga faqat kerakli resurs va amal beriladi. "Hamma ob'ektni o'qiy olish" huquqi bir servis uchun qulay, lekin bitta SSRF uni butun tenant bazasiga aylantiradi (55-dars). Rol siyosatlari kodga o'xshab ko'rib chiqiladi va policy-as-code bilan tekshiriladi (57-dars).

### Alert va audit

Regulyator hujjatida alertlarni qayta ishlash va internal audit kamchiliklari qayd etilganini ko'rdik. Texnik tomondan: ichki metadata manziliga chiqish urinishlari, bir rolning g'ayrioddiy ko'p ob'ekt o'qishi, ilova serveridan kelmagan manbadan rol credential'laridan foydalanilishi alert beradigan signallar. Alert beradigan, lekin hech kim ko'rmaydigan tizim nazorat emas (79 va 93-darslar).

## Misol: SSRF, metadata va ortiqcha huquqli rol

Hamma narsa xotiradagi o'quv modelida: `metadata`, `dns`, `storage` oddiy obyektlar, hech qaysi real servis yoki cloud yo'q. Manzillar hujjatlar uchun ajratilgan va 169.254.169.254 kabi link-local manzillar faqat modeldagi lug'at kaliti sifatida ishlatiladi.

### 1. Zaif kod

```ts run
const metadata: Record<string, string> = {
  "169.254.169.254/creds": JSON.stringify({ role: "import-role", key: "TEMP-KEY-1" }),
};
const dns: Record<string, string> = { "cdn.example": "198.51.100.10", "rebind.example": "169.254.169.254" };
const storage: Record<string, string> = {
  "alfa/imports/a.csv": "alfa import",
  "beta/reports/q3.csv": "beta hisobot",
  "secrets/db.txt": "db-parol",
};
// ZAIF (3): rol hamma narsani o'qiy oladi
const roles: Record<string, string[]> = { "import-role": [""] }; // prefikslar; "" = hammasi

function rawGet(ip: string, path: string): string {
  if (ip === "198.51.100.10") return "<rasm>";
  return metadata[ip + path] ?? "404";
}
// ZAIF (1): foydalanuvchi bergan URL tekshirilmaydi; ZAIF (2): metadata xizmati so'rovga javob beradi
function importFromUrl(url: string): string {
  const u = new URL(url);
  const ip = dns[u.hostname] ?? u.hostname;
  return rawGet(ip, u.pathname); // javob foydalanuvchiga qaytariladi
}
function read(key: string, object: string): string {
  const role = Object.keys(roles)[0];
  return roles[role].some((p) => object.startsWith(p)) && key === "TEMP-KEY-1" ? storage[object] ?? "yo'q" : "RAD ETILDI";
}

const leaked = importFromUrl("http://2852039166/creds"); // o'nlik shakl
console.log("1) import javobi:", leaked);
const { key } = JSON.parse(leaked);
console.log("2) boshqa tenant:", read(key, "beta/reports/q3.csv"));
console.log("3) sirlar:", read(key, "secrets/db.txt"));
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu SSRF orqali metadata'dan credential olish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi tizimga kirgan oddiy foydalanuvchi: u faqat "URL bo'yicha import" maydoniga qiymat kiritadi. Birinchi URL o'nlik IP shaklida (parse qilingandan keyin metadata manzili), natijada import javobi sifatida credential qaytadi, keyin shu credential bilan boshqa obyektlar o'qiladi:

```text
1) import javobi: {"role":"import-role","key":"TEMP-KEY-1"}
2) boshqa tenant: beta hisobot
3) sirlar: db-parol
```

Uch bo'g'in birga ishladi: tekshirilmagan URL, so'rovga javob beruvchi metadata xizmati va hamma narsani o'qiy oladigan rol. Bu o'quv modeli; haqiqiy muhitda credential formati, metadata yo'li va huquqlar provayderga bog'liq.

### 3. Tuzatilgan kod

```ts run
const metadata: Record<string, string> = {
  "169.254.169.254/creds": JSON.stringify({ role: "import-role", key: "TEMP-KEY-1" }),
};
const dns: Record<string, string> = { "cdn.example": "198.51.100.10", "rebind.example": "169.254.169.254" };
const storage: Record<string, string> = {
  "alfa/imports/a.csv": "alfa import",
  "beta/reports/q3.csv": "beta hisobot",
  "secrets/db.txt": "db-parol",
};
// Tuzatish 3: rol faqat o'z import prefiksiga ega
const roles: Record<string, string[]> = { "import-role": ["alfa/imports/"] };

// Tuzatish 1: resolve qilingan IP ustida tekshiruv, faqat http/https
function isBlocked(ip: string): boolean {
  const m = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(ip);
  if (!m) return true;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return a === 127 || a === 10 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254);
}
// Tuzatish 2: metadata xizmati maxsus sarlavhasiz so'rovga javob bermaydi (IMDSv2 g'oyasi, o'quv modeli)
function rawGet(ip: string, path: string, headers: Record<string, string> = {}): string {
  if (ip === "198.51.100.10") return "<rasm>";
  if (ip === "169.254.169.254" && headers["x-metadata-token"] !== "ichki-token") return "401";
  return metadata[ip + path] ?? "404";
}
function importFromUrl(url: string): string {
  let u: URL;
  try { u = new URL(url); } catch { return "RAD ETILDI"; }
  if (u.protocol !== "http:" && u.protocol !== "https:") return "RAD ETILDI";
  const ip = dns[u.hostname] ?? u.hostname;
  if (isBlocked(ip)) return "RAD ETILDI";
  return rawGet(ip, u.pathname); // foydalanuvchi sarlavha yubora olmaydi
}
function read(key: string, object: string): string {
  const role = Object.keys(roles)[0];
  return roles[role].some((p) => object.startsWith(p)) && key === "TEMP-KEY-1" ? storage[object] ?? "yo'q" : "RAD ETILDI";
}

console.log("1) o'nlik IP:", importFromUrl("http://2852039166/creds"));
console.log("2) rebind domen:", importFromUrl("http://rebind.example/creds"));
console.log("3) oddiy CDN:", importFromUrl("https://cdn.example/logo.png"));
// Aytaylik, 1-2 qatlam yiqildi va credential o'g'irlandi: 3-qatlam zararni cheklaydi
console.log("4) o'g'irlangan key, boshqa tenant:", read("TEMP-KEY-1", "beta/reports/q3.csv"));
console.log("5) o'g'irlangan key, sirlar:", read("TEMP-KEY-1", "secrets/db.txt"));
console.log("6) o'z import prefiksi:", read("TEMP-KEY-1", "alfa/imports/a.csv"));
```

```text
1) o'nlik IP: RAD ETILDI
2) rebind domen: RAD ETILDI
3) oddiy CDN: <rasm>
4) o'g'irlangan key, boshqa tenant: RAD ETILDI
5) o'g'irlangan key, sirlar: RAD ETILDI
6) o'z import prefiksi: alfa import
```

Tuzatish nima uchun yetarli: har bo'g'in o'z invariantini saqlaydi. URL resolve qilingan IP bo'yicha tekshiriladi (1-3 qatorlar), metadata xizmati foydalanuvchi yubora olmaydigan sarlavhasiz javob bermaydi, rol faqat kerakli prefiksga ega (4-6 qatorlar: credential o'g'irlangan taqdirda ham boshqa tenant va sirlar yopiq). Yopilmagan narsa: tekshiruv va haqiqiy so'rov orasida DNS javobi o'zgarishi mumkin (real kodda so'rov tekshirilgan IP'ga yuborilishi kerak), redirect'lar bu modelda yo'q, o'z prefiksidagi ma'lumot hanuz o'qiladi (alert va audit kerak), IMDSv2 g'oyasi o'quv modeli sifatida soddalashtirilgan.

### URL parser tuzog'i

```ts run
for (const u of ["http://2852039166/a", "http://0xa9fea9fe/", "http://0251.0376.0251.0376/", "http://169.254.169.254.example/"]) {
  console.log(u.padEnd(34), "->", new URL(u).hostname);
}
```

```text
http://2852039166/a                -> 169.254.169.254
http://0xa9fea9fe/                 -> 169.254.169.254
http://0251.0376.0251.0376/        -> 169.254.169.254
http://169.254.169.254.example/    -> 169.254.169.254.example
```

Uchinchi shakl sakkizlik raqamlar, ikkinchisi oltilik. Parser ularni nuqtali IPv4 ga keltiradi; oxirgi misol esa nuqtali shakl, lekin domen nomi: u resolve qilinganda nima chiqishi DNS'ga bog'liq, shuning uchun hostname satri bo'yicha qaror qabul qilib bo'lmaydi. Natija lokal Node.js `URL` bilan olingan.

## Qachon qo'llamaslik kerak

Bu zanjirning har bo'g'ini har ilovada ham mavjud emas. Agar ilova foydalanuvchi URL'iga umuman so'rov yubormasa, SSRF himoyasi kodining katta qismi keraksiz; uning o'rniga ilovada qaysi joylarda server tomonida tashqi so'rov borligini (webhook, import, rasm preview, PDF generatsiya, OAuth callback) ro'yxatga oling va faqat o'sha joylarni himoya qiling.

Application qatlamidagi IP tekshiruvi tarmoq qatlamining o'rnini bosmaydi: egress filtri, ilova serverlarining ichki xizmatlarga ulanishini cheklovchi tarmoq siyosatlari va metadata xizmati sozlamalari alohida qatlamlar. Faqat bitta qatlamga tayanish aynan case study'dagi kamchilikka olib keladi.

Regulyator hujjatidan dasturchi texnik retsept olmasligi kerak. OCC hujjatlari jarayon va nazorat darajasida gapiradi; ularda SSRF zanjirining qadamma-qadam tavsifi yo'q va shuning uchun bu darsdagi zanjir hodisaning rekonstruksiyasi emas, umumiy sinf modeli. Boshqa jamoaning hodisasini "bizda ham shunday bo'lgan bo'lishi mumkin" deb talqin qilish o'rniga, manbada nima aytilganini ajrating.

## Stack'da: Node.js va cloud

Node.js servisida tashqi so'rov yuboradigan har joy uchun yagona `safeFetch` funksiyasi yozing: URL parse qilish, sxema allowlist'i, DNS resolve va IP tekshiruvi, tekshirilgan IP'ga ulanish, redirect'larni o'chirish, javob hajmi va vaqt chegarasi. Ichki xizmatlar uchun allowlist: aniq hostname'lar ro'yxati. Cloud tomonda: servis rolini aniq resurslar va amallar bilan cheklash, metadata xizmatiga kirishni konteyner darajasida cheklash va provayderning xavfsizroq metadata versiyasini yoqish (88-dars), egress filtri. Quyidagi parcha `safeFetch` shaklini ko'rsatadi (ishga tushirilmaydi: `node:dns` va `fetch` tarmoq talab qiladi; sintaksis tekshirilgan):

```ts
import { lookup } from "node:dns/promises";

declare function isBlockedIp(ip: string): boolean;

export async function safeFetch(rawUrl: string): Promise<Response> {
  const url = new URL(rawUrl);
  if (url.protocol !== "https:") throw new Error("faqat https");
  const { address } = await lookup(url.hostname);
  if (isBlockedIp(address)) throw new Error("ruxsat berilmagan manzil");
  // Real kodda ulanish aynan `address` ga yo'naltiriladi (DNS rebinding'ga qarshi) va
  // redirect qo'lda boshqariladi:
  return fetch(url, { redirect: "manual", signal: AbortSignal.timeout(5000) });
}
```

## Xulosa

- OCC hujjatlarida tasdiqlangan: 2020-08-06 dagi 80 million dollarlik jarima cloud'ga o'tishdagi risk baholash va nazoratlardagi kamchiliklar uchun; hodisaning texnik tafsiloti (SSRF, IAM, mijozlar soni) bu manbalarda yo'q.
- SSRF + metadata + ortiqcha huquqli rol zanjiri umumiy mexanizm sifatida modellashtirildi; cheat sheet cloud'da SSRF metadata'dan credential olish uchun ishlatilishini tasdiqlaydi.
- Himoya qatlamlari: ilovada allowlist yoki resolve qilingan IP bo'yicha tekshiruv, metadata xizmatini mustahkamlash (IMDSv2 g'oyasi), least privilege va alert.
- URL'ni normalizatsiyadan keyin va resolve qilingan IP ustida tekshiring; satr tekshiruvi va deny-list bypass'ga moyil.
- Least privilege SSRF'ni to'xtatmaydi, oqibatni cheklaydi; har qatlam alohida invariantni saqlashi kerak.
- Case study'da manbada tasdiqlangan narsani tasdiqlanmagan narsadan ajrating.
