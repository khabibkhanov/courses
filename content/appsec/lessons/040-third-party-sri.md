---
n: 40
slug: third-party-sri
title: "Uchinchi tomon skriptlari va Subresource Integrity"
summary: "Uchinchi tomon JavaScript'i sahifa origin'ida to'liq huquq bilan ishlaydi. Uch xavf (nazoratni yo'qotish, ixtiyoriy kod, ma'lumot oqishi), Subresource Integrity (integrity, crossorigin, CORS, eng kuchli algoritm qoidasi), tag manager muammosi va SRI chegaralari."
duration: 40
sources:
  - id: sri
    note: "W3C Subresource Integrity: integrity metadata (sha256, sha384, sha512), eng kuchli algoritm tanlanishi, bo'sh metadata'da resurs o'tishi"
  - id: t10-a08
    note: "A08:2025: CDN va ishonchsiz manbalardan olingan kod yaxlitligini tekshirmaslik; CWE-829 (ishonchsiz boshqaruv doirasidan funksionallik kiritish) shu kategoriyada sanalgan"
  - id: t10-a03
    note: "A03:2025 Software Supply Chain Failures: client-side komponentlarni ham hisobga olish va versiyalarini kuzatish"
  - id: cs-thirdparty-js
    note: "OWASP Third Party JavaScript Management Cheat Sheet: uch xavf, deployment arxitekturalari, SRI, iframe izolyatsiyasi, tag manager muammolari"
  - id: mdn-sri
    note: "MDN SRI: integrity atributi, qaysi elementlarda ishlashi, CORS va crossorigin talabi, bir nechta hash bilan ishlash qoidasi"
quiz:
  - q: "Sahifa `<script src=\"https://cdn.vendor.example/lib.js\" integrity=\"sha384-...\" crossorigin=\"anonymous\">` yuklaydi. CDN buzilib, lib.js mazmuni o'zgartirildi. Brauzer nima qiladi?"
    options:
      - "O'zgargan faylni baribir bajaradi"
      - "Fayl xeshi integrity qiymatiga mos kelmaydi: brauzer skriptni bajarmaydi va tarmoq xatosi bilan rad etadi"
      - "Faqat ogohlantirish chiqaradi"
      - "Faylni qayta yuklab, eski nusxani qaytaradi"
    answer: 1
    explain: "SRI brauzerga yuklangan resurs xeshini kutilgan qiymat bilan solishtirishni buyuradi; mos kelmasa resurs yuklanmaydi (MDN: tarmoq xatosi qaytariladi). Brauzer eski nusxani o'zi topib bermaydi: sahifa shu skriptsiz qoladi."
  - q: "Dasturchi cross-origin CDN skripti uchun `integrity` qo'shdi, lekin `crossorigin` atributini va CDN'dagi CORS sarlavhasini qo'shmadi. Natija?"
    options:
      - "Hammasi ishlaydi"
      - "SRI ishlamaydi, lekin skript yuklanadi"
      - "Skript bloklanadi: cross-origin resurs SRI bilan CORS orqali (crossorigin va Access-Control-Allow-Origin) so'ralishi kerak"
      - "Faqat bitta brauzerda bloklanadi"
    answer: 2
    explain: "MDN: SRI bilan cross-origin so'rovlar CORS protokolini ishlatishi shart, aks holda no-cors rejimida SRI'ga ruxsat berilmaydi va so'rov muvaffaqiyatsiz bo'ladi. Cheat sheet ham vendor host'da CORS yoqilgan bo'lishi kerakligini yozadi."
  - q: "`integrity=\"sha256-A sha384-B\"`. Skript mazmunining sha256 xeshi A ga teng, sha384 xeshi B ga teng emas. Brauzer qarori?"
    options:
      - "Yuklamaydi: brauzer eng kuchli algoritm (sha384) xeshlarini tanlaydi va zaifrog'ini e'tiborsiz qoldiradi"
      - "Yuklaydi, chunki sha256 mos"
      - "Yuklaydi, chunki hech bo'lmasa bittasi mos"
      - "Xato tashlaydi, atribut yaroqsiz"
    answer: 0
    explain: "MDN va SRI spetsifikatsiyasi: bir nechta algoritm bo'lsa faqat eng kuchlisi ishlatiladi (sha256 < sha384 < sha512), qolganlari e'tiborsiz. Bir xil algoritmning bir nechta xeshi esa 'har qaysi biriga mos kelsa' qoidasi bilan ishlaydi (alternativ versiyalar uchun)."
  - q: "Sahifa tag manager skriptini yuklaydi; marketing jamoasi tag manager panelida tag qo'shadi va ularning kodi mijoz brauzerida ishlaydi. SRI shu yerda nima beradi?"
    options:
      - "Panelda qo'shilgan har qanday tag'ni tekshiradi"
      - "Hamma xavfni yo'q qiladi"
      - "Hech qanday ahamiyati yo'q, CSP kifoya"
      - "Tag manager'ning container fayli tez-tez o'zgaradi, shuning uchun SRI unga amaliy emas; panel orqali kiritilgan kod ham SRI doirasidan tashqari, shu sababli publishing ruxsatlari cheklanadi va o'zgarishlar ilova kodi kabi ko'rib chiqiladi"
    answer: 3
    explain: "Cheat sheet tag manager orqali kelgan kod har safar sahifa yuklanganda yangilanishini, remote boshqariladigan event handler'lar sahifa kodi ishonch chegarasining bir qismi bo'lib qolishini yozadi (data layer sandbox emas), va SRI'ni buning uchun faqat boshqaruvlardan biri sifatida tilga oladi. Tavsiya: publishing kirishini cheklash, o'zgarishlarni ilova kodi kabi ko'rib chiqish, imkon bo'lsa server tomonidagi integratsiyalarni afzal ko'rish."
  - q: "Vendor o'z skriptining yangi versiyasini o'sha URL'da chiqardi. Sizning sahifada eski integrity qiymati qolgan. Nima bo'ladi va bu nimani ko'rsatadi?"
    options:
      - "Yangi versiya avtomatik ishlaydi"
      - "Skript xesh mos kelmagani uchun bloklanadi: xavfsiz, lekin ishlamaydigan sahifa; vendor skriptlarini monitoring qilish va hash yangilash jarayoni (yoki versiyalangan, o'zgarmas URL) kerak"
      - "SRI yangilanishlarni qo'llab-quvvatlamaydi"
      - "Brauzer yangi xeshni o'zi hisoblaydi"
    answer: 1
    explain: "Cheat sheet 'xavfsiz, lekin ishlamaydigan' uchinchi tomon kodi holatini ogohlantiradi va vendor skriptini muntazam monitoring qilishni tavsiya qiladi. Operatsion jarayon (MarSecOps) hash yangilanishini ham qamrab oladi."
  - q: "SRI qaysi xavfni YOPMAYDI?"
    options:
      - "CDN buzilishi natijasida skript mazmuni almashtirilishi"
      - "Tranzitda skriptning o'zgartirilishi"
      - "Vendor domeni egalik huquqi o'tgach yangi skript yuklanishi"
      - "Siz tekshirib chiqqan vendor skriptining o'zi yig'adigan va vendorga yuboradigan foydalanuvchi ma'lumotlari (referrer, cookie, DOM ma'lumoti)"
    answer: 3
    explain: "SRI faqat yaxlitlikni (kutilgan kod bajarilishini) ta'minlaydi. Cheat sheet 3-xavf sifatida ma'lumot oqishini alohida sanaydi: tekshirilgan skript ham sahifadagi ma'lumotni vendorga yuborishi mumkin. Qolgan uch senariyda mazmun o'zgaradi, xesh mos kelmaydi va resurs to'siladi."
task:
  title: "SRI tekshiruvchisi: eng kuchli algoritm qoidasi"
  prompt: |
    Brauzerning SRI qarorini modellashtiring. `verifyIntegrity(content, integrity)` resurs mazmuni va `integrity` atribut qiymatini oladi. Qoidalar: qiymat bo'shliq bilan ajratilgan `alg-base64` tokenlar. Yaroqli algoritmlar: `sha256`, `sha384`, `sha512` (zaifdan kuchliga). Yaroqli token bo'lmasa (bo'sh atribut yoki hammasi noma'lum) resurs o'tadi (spetsifikatsiyadagi qoida). Aks holda faqat eng kuchli algoritmning tokenlari olinadi; resurs mazmunining shu algoritm bilan xeshi (base64) shu tokenlardan biriga teng bo'lsa `true`, aks holda `false`.

    `sha256`, `sha384`, `sha512` xeshini WebCrypto (`crypto.subtle.digest`) bilan hisoblang. Natija: oltita `true`.
  lang: ts
  starter: |
    const ALGS = ["sha256", "sha384", "sha512"]; // zaifdan kuchliga
    const NAMES: Record<string, string> = { sha256: "SHA-256", sha384: "SHA-384", sha512: "SHA-512" };

    async function digest(alg: string, content: string): Promise<string> {
      const buf = await crypto.subtle.digest(NAMES[alg], new TextEncoder().encode(content));
      return btoa(String.fromCharCode(...new Uint8Array(buf)));
    }

    async function verifyIntegrity(content: string, integrity: string): Promise<boolean> {
      return true; // TUZATING
    }

    const good = "console.log('salom');";
    const tampered = "console.log('salom');fetch('https://evil.example');";

    const h384 = await digest("sha384", good);
    const h256 = await digest("sha256", good);

    console.log("mos:", (await verifyIntegrity(good, `sha384-${h384}`)) === true);
    console.log("o'zgargan:", (await verifyIntegrity(tampered, `sha384-${h384}`)) === false);
    console.log("bo'sh atribut:", (await verifyIntegrity(tampered, "")) === true);
    console.log("kuchlisi mos emas:", (await verifyIntegrity(good, `sha256-${h256} sha384-AAAA`)) === false);
    console.log("kuchli mos, zaifi noto'g'ri:", (await verifyIntegrity(good, `sha256-AAAA sha384-${h384}`)) === true);
    console.log("ikki alternativ:", (await verifyIntegrity(good, `sha384-AAAA sha384-${h384}`)) === true);
  solution: |
    const ALGS = ["sha256", "sha384", "sha512"]; // zaifdan kuchliga
    const NAMES: Record<string, string> = { sha256: "SHA-256", sha384: "SHA-384", sha512: "SHA-512" };

    async function digest(alg: string, content: string): Promise<string> {
      const buf = await crypto.subtle.digest(NAMES[alg], new TextEncoder().encode(content));
      return btoa(String.fromCharCode(...new Uint8Array(buf)));
    }

    async function verifyIntegrity(content: string, integrity: string): Promise<boolean> {
      const tokens = integrity
        .split(/\s+/)
        .filter(Boolean)
        .map((t) => {
          const i = t.indexOf("-");
          return { alg: (i < 0 ? t : t.slice(0, i)).toLowerCase(), hash: i < 0 ? "" : t.slice(i + 1) };
        })
        .filter((t) => ALGS.includes(t.alg));
      if (tokens.length === 0) return true; // yaroqli metadata yo'q: SRI qo'llanmaydi
      const strongest = tokens.reduce((a, b) => (ALGS.indexOf(b.alg) > ALGS.indexOf(a.alg) ? b : a)).alg;
      const actual = await digest(strongest, content);
      return tokens.filter((t) => t.alg === strongest).some((t) => t.hash === actual);
    }

    const good = "console.log('salom');";
    const tampered = "console.log('salom');fetch('https://evil.example');";

    const h384 = await digest("sha384", good);
    const h256 = await digest("sha256", good);

    console.log("mos:", (await verifyIntegrity(good, `sha384-${h384}`)) === true);
    console.log("o'zgargan:", (await verifyIntegrity(tampered, `sha384-${h384}`)) === false);
    console.log("bo'sh atribut:", (await verifyIntegrity(tampered, "")) === true);
    console.log("kuchlisi mos emas:", (await verifyIntegrity(good, `sha256-${h256} sha384-AAAA`)) === false);
    console.log("kuchli mos, zaifi noto'g'ri:", (await verifyIntegrity(good, `sha256-AAAA sha384-${h384}`)) === true);
    console.log("ikki alternativ:", (await verifyIntegrity(good, `sha384-AAAA sha384-${h384}`)) === true);
  solutionNotes: |
    - Faqat eng kuchli algoritmning tokenlari hisobga olinadi (MDN va SRI spetsifikatsiyasi). Zaif algoritm xeshi mos kelishi sha384 mos kelmasa yordam bermaydi: shuning uchun "kuchlisi mos emas" holati `false`.
    - Bir xil algoritmning bir nechta tokeni "har qaysi biriga mos kelsa" qoidasi bilan ishlaydi: vendor ikki versiyani bir vaqtda tarqatsa, ikkala xeshni berish mumkin.
    - Yaroqli token bo'lmasa resurs o'tadi (spetsifikatsiyada bo'sh metadata uchun shunday). Bu atribut xato yozilganda himoya jim yo'qolishini ham ko'rsatadi: integrity qiymatini build vaqtida avtomatik hosil qiling va testda tekshiring.
    - Haqiqiy brauzerda bu tekshiruv yuklab olingan baytlar ustida bajariladi va cross-origin uchun CORS talab qilinadi; bu model faqat xesh qarorini ko'rsatadi.
    - SRI faqat yaxlitlikni ta'minlaydi: tekshirilgan skript ham ma'lumotni vendorga yuborishi mumkin.
  checklist:
    - "Faqat eng kuchli algoritmning tokenlari solishtiriladi"
    - "Bir xil algoritmning bir nechta tokenidan biri mos kelsa o'tadi"
    - "O'zgargan mazmun `false` beradi"
    - "Yaroqli token yo'q bo'lsa natija `true` va bu nimani anglatishini tushuntira olasiz"
    - "SRI nimani yopmasligini ayta olasiz"
---

## Muammo

Mijoz kabinetiga uchta uchinchi tomon skripti qo'shilgan: analitika, chat vidjet va xarita kutubxonasi. Har birining `<script src="https://...">` tegi bor. Brauzer bu skriptlarni sizning sahifangizning origin'ida bajaradi (12-dars), ya'ni ular sizning o'z kodingiz bilan bir xil huquqga ega: DOM'ni o'qiydi, formalardagi maydonlarni ko'radi, foydalanuvchi nomidan so'rov yuboradi. 31-35 darslardagi XSS himoyasi bu holatda yordam bermaydi: bu XSS emas, siz o'zingiz tashqi kodni sahifaga kiritdingiz.

OWASP Third Party JavaScript Management Cheat Sheet bu xavfni uch qismga ajratadi: (1) mijoz ilovasidagi o'zgarishlar ustidan nazoratni yo'qotish (vendor kodni istalgan vaqt o'zgartirishi mumkin va test qilingan narsa bilan ishlayotgani farq qiladi); (2) mijoz tizimlarida ixtiyoriy kodning bajarilishi (kod kamdan-kam tekshiriladi va unga foydalanuvchining huquqi beriladi); (3) maxfiy ma'lumotning uchinchi tomonga oqishi (brauzer vendor serveriga bevosita murojaat qiladi: IP, referrer, vendor cookie'lari). Cheat sheet eng katta xavfni vendor serverining buzilishi va asl skriptga zararli kod kiritilishi deb ataydi, va vendor domeni muddati tugab, boshqa kishi qayta ro'yxatdan o'tkazib zararli kod joylashi mumkin bo'lgan holatni ham eslatadi. OWASP Top 10:2025 A08 kategoriyasida ishonchsiz manbalar va CDN'lardan olingan kod yaxlitligini tekshirmaslik misol qilingan; shu kategoriyadagi CWE'lar orasida CWE-829 (ishonchsiz boshqaruv doirasidan funksionallik kiritish) bor. A03 Software Supply Chain Failures esa client-side komponentlarni ham inventarizatsiya va versiya kuzatuvi bilan qamrab olishni talab qiladi.

Bu darsning markaziy vositasi Subresource Integrity (SRI): sahifa yuklanayotgan skriptning kutilgan xeshini e'lon qiladi va brauzer mos kelmaydigan faylni bajarmaydi. Shuningdek SRI nimani hal qilmasligini va tag manager kabi dinamik holatlarda nima qilishni ko'ramiz.

## Asosiy g'oya

### SRI qanday ishlaydi

MDN ta'rifi: Subresource Integrity brauzer yuklaydigan fayllar aynan siz kutgan mazmunga ega ekanini ta'minlaydi. Siz elementga `integrity` atributini qo'shasiz; qiymat bo'shliq bilan ajratilgan kriptografik xeshlar ro'yxati, har biri algoritm prefiksi, tire va base64 xesh ko'rinishida. Ruxsat etilgan prefikslar: `sha256`, `sha384`, `sha512`. SRI `script` elementlarida va `rel` qiymati `stylesheet`, `preload` yoki `modulepreload` bo'lgan `link` elementlarida ishlaydi.

```html
<script src="https://cdn.vendor.example/xarita.js"
        integrity="sha384-..."
        crossorigin="anonymous"></script>
```

Brauzer skriptni bajarishdan (yoki stilni qo'llashdan) oldin yuklangan baytlar xeshini hisoblab, atributdagi qiymatlar bilan solishtiradi. Mos kelmasa, resurs yuklanmaydi va tarmoq xatosi qaytariladi. Shu bilan CDN buzilishi, tranzitda o'zgartirish yoki vendor tomonidagi o'zgarish sahifangizga ta'sir qila olmaydi: kutilgan mazmun bo'lmasa, kod bajarilmaydi.

### Bir nechta xesh qoidalari

SRI spetsifikatsiyasi va MDN bir xil qoidani beradi. Algoritmlar zaifdan kuchliga: SHA-256, SHA-384, SHA-512. Atributda bir nechta algoritm bo'lsa, brauzer faqat eng kuchli algoritmning xeshlarini tanlaydi va qolganlarini e'tiborsiz qoldiradi. Bir xil algoritmning bir nechta xeshi bo'lsa, ularning birortasiga mos kelishi yetarli: bu resursning muqobil versiyalarini ruxsat etish uchun. Spetsifikatsiya bu agility (algoritm almashtirish imkoni) deb ataydi. Yaroqli metadata bo'lmasa (bo'sh atribut) resurs tekshiruvsiz o'tadi: demak xato yozilgan `integrity` himoyani jim o'chiradi.

### CORS va crossorigin

MDN: SRI bilan cross-origin so'rovlar CORS protokolini ishlatishi shart; manba server `Access-Control-Allow-Origin` sarlavhasini yuborishi kerak (CDN'lar ko'pincha `*` beradi). Shuning uchun markupda `crossorigin="anonymous"` kerak. Sabab: HTML orqali yuklangan resurs odatda `no-cors` rejimida olinadi va sahifa uni ishlata oladi, lekin o'qiy olmaydi; SRI esa hujumchiga mazmun haqida ma'lumot chiqarishga imkon berishi mumkin edi, shuning uchun brauzerlar `no-cors` so'rovlarda SRI'ga ruxsat bermaydi va bunday so'rov doim muvaffaqiyatsiz bo'ladi. Cheat sheet ham vendor host'da CORS yoqilgan bo'lishi kerakligini yozadi. Amaliy xulosa: vendor CORS sarlavhasini bermasa, SRI ishlatib bo'lmaydi va skriptni o'z serveringizga ko'chirish (mirroring) kerak.

## Chuqurroq: SRI chegaralari va boshqa choralar

### Nimani yopadi va nimani yopmaydi

SRI yopadi: CDN yoki vendor serveri buzilib fayl almashtirilishi, tranzitda o'zgartirish, vendor domeni egaligi o'zgargach yangi mazmun yuklanishi (xesh mos kelmaydi). SRI yopmaydi: (1) siz tekshirgan skriptning o'zi zararli yoki ma'lumot yig'ishi (cheat sheet 3-xavf: skript brauzer orqali sahifa ma'lumotini vendorga yuboradi); (2) dinamik mazmun: skript ichidan yuklanadigan boshqa skriptlar, tag manager konteyneri va unga panel orqali qo'shiladigan tag'lar; (3) vendor xeshni tasdiqlamasdan yangilasa ishdan chiqishi (xavfsiz, lekin ishlamaydigan sahifa); (4) siz olgan xeshning o'zi allaqachon zararli versiyaniki bo'lgan holat: xeshni birinchi marta qaerdan olganingiz muhim.

### Tag manager muammosi

Cheat sheet uch xil joylashtirish arxitekturasini tasvirlaydi: vendor skripti sahifada, vendor serveridan so'rash, va tag manager orqali bilvosita so'rash. Uchinchisida marketing xodimlari panelda tag'larni o'zgartiradi va o'zgarish darhol barcha mijozlarga yetadi; kod ko'pincha obfuskatsiya qilingan. SRI bunday konteynerga mos kelmaydi, chunki mazmun atayin tez-tez o'zgaradi. Cheat sheet tavsiyalari: tag manager sayti xavfsizlik amaliyotini va panelga kirishni (masalan, ikki faktorli autentifikatsiya) tekshirish; ruxsat etilgan tag turlarini cheklash (maxsus HTML va JavaScript tag'larni o'chirish); host tomonidan yaratilgan data layer orqali uzatiladigan ma'lumotni cheklash, lekin data layer sandbox emasligini unutmaslik. Cheat sheet: remote boshqariladigan event handler'lar sahifa kodi ishonch chegarasining qismi, shuning uchun publishing ruxsatini cheklang va o'zgarishlarni ilova kodi kabi ko'rib chiqing. Brauzer ijrosini kerak qilmaydigan analitika uchun server tomonidagi kollektor va server-side vendor integratsiyalarini afzal ko'rish tavsiya qilinadi.

### Integrity-Policy: integrity yo'qligini ushlash

SRI'ning zaif joyi: atribut yozilmasa yoki yaroqsiz bo'lsa, hech narsa ogohlantirmaydi. MDN bunga qarshi `Integrity-Policy` va `Integrity-Policy-Report-Only` sarlavhalarini tasvirlaydi. Ular sahifadan yuklanadigan skript va stil resurslarida `integrity` atributini majburiy qilishga imkon beradi. `Integrity-Policy` bo'lsa brauzer `no-cors` rejimidagi yoki `integrity` atributisiz so'rovlarni bloklaydi va, agar reporting endpoint berilgan bo'lsa, `integrity-violation` hisobotini yuboradi. Sarlavha qiymati structured field dictionary: `blocked-destinations` (faqat `script` va `style`), ixtiyoriy `sources` va `endpoints` (endpoint nomi `Reporting-Endpoints` sarlavhasida e'lon qilinadi). MDN joriy qilish tartibini ham beradi: avval `Integrity-Policy-Report-Only` bilan hisobotlarni to'plang, buzilish kelmay qo'ygach bloklovchi sarlavhaga o'ting. Bu siyosat integrity qiymati to'g'riligini tekshirmaydi: u faqat atribut borligini talab qiladi. Qiymat to'g'riligi esa build vaqtidagi avtomatik hosil qilish va testning vazifasi.

### Boshqa qatlamlar

- **Mirroring.** Skriptni o'z serveringizga (yoki o'z CDN'ingizga) ko'chirib, versiyalab joylashtirish: vendor o'zgarishi sizga o'zingiz yangilaganingizda yetadi, vendorga oqadigan so'rovlar kamayadi (cheat sheet 1 va 3-xavf uchun tilga oladi). Narxi: yangilanishlarni o'zingiz kuzatasiz (A03).
- **iframe izolyatsiyasi.** Vendor skriptini boshqa domendagi iframe'ga joylab, `postMessage` bilan aloqa qilish (39-dars): skript ota sahifaning DOM'i va cookie'siga to'g'ridan-to'g'ri kira olmaydi. Cheat sheet yuqori xavfli ilovalar uchun iframe sandbox va CSP birgalikda ishlatishni tavsiya qiladi. Iframe boshqa domen bo'lgani uchun `allow-same-origin` shu frame'ga uning o'z origin'ini beradi, ota sahifani emas (39-dars ogohlantirishi o'z origin'idan yuklanadigan iframe uchun).
- **CSP.** `script-src` (35-dars) qaysi manbalar skript yuklashini cheklaydi. Nonce va `'strict-dynamic'` bilan CSP "kim yuklay oladi" masalasini hal qiladi, SRI esa "yuklangan narsa kutilgan mazmunmi" masalasini: ikkalasi bir-birini to'ldiradi. Next.js hujjati nonce o'rniga SRI asosidagi (eksperimental) hash yondashuvini tasvirlaydi, bu 35-darsda eslatilgan.
- **Shartnoma va operatsiya.** Cheat sheet vendor shartnomalarida kod xavfsizligi va yaxlitligi monitoringi dalilini talab qilishni, hamda SRI xeshi yangilanishi va sahifalardagi o'zgarishlarni qamrab oluvchi operatsion jarayonni (MarSecOps) tilga oladi. U yana shuni ochiq aytadi: marketing o'zgarishlari tezligida bu choralarni amalga oshirish qiyin bo'lishi mumkin, ayrim hollarda data layer va SRI amaliy emas.
- **Versiyalash va yangilab turish.** Kutubxonalarni (jQuery, xarita, grafik) eskirgan versiyalarda qoldirmang: ularning ma'lum zaifliklari XSS'ga olib kelishi mumkin (cheat sheet A03 ga havola qiladi).

## Misol: CDN skripti va integrity

Misol brauzersiz model: "brauzer" yuklangan baytlar xeshini integrity qiymati bilan solishtiradi. Real brauzer buni CORS va yuklash jarayoni ichida qiladi; maqsad qarorni ko'rsatish. Hujum faqat shu o'quv modeli ichida: "CDN" bu oddiy o'zgaruvchi.

### 1. Zaif kod

Sahifa vendor skriptini integrity'siz yuklaydi. "Brauzer" xeshni tekshirmaydi, nima kelsa bajaradi:

```ts run
// Model: "CDN" - nom bo'yicha mazmun beradigan lug'at
const cdn = new Map<string, string>([["https://cdn.vendor.example/xarita.js", "render('xarita');"]]);

// ZAIF: integrity yo'q, brauzer nima kelsa shuni bajaradi
function loadWeak(url: string): string {
  return cdn.get(url)!; // "bajariladi"
}

console.log("normal:", loadWeak("https://cdn.vendor.example/xarita.js"));

// HUJUM: CDN buzildi, fayl almashtirildi
cdn.set("https://cdn.vendor.example/xarita.js", "render('xarita');sendToEvil(document.forms);");
console.log("CDN buzilgandan keyin:", loadWeak("https://cdn.vendor.example/xarita.js"));
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu uchinchi tomon skriptini o'zgartirish usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-4-moddasi (Kompyuter axborotini modifikatsiyalashtirish) va 278-6-moddasi (Zarar keltiruvchi dasturlar) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi CDN'ga yoki vendor akkauntiga kirib, `xarita.js` oxiriga forma ma'lumotlarini yuboruvchi qator qo'shdi. Sizning sahifangizda hech narsa o'zgarmagan, lekin brauzer yangi mazmunni bajaradi:

```text
normal: render('xarita');
CDN buzilgandan keyin: render('xarita');sendToEvil(document.forms);
```

Hujum sizning kodingizdagi zaiflikdan emas, ishonch zanjiridagi bo'g'indan o'tdi. Cheat sheet tilga olgan Magecart turidagi kampaniyalar ham shu tamoyilga tayanadi (to'lov ma'lumotlarini injected JavaScript orqali o'g'irlash).

### 3. Tuzatilgan kod

Sahifa tekshirilgan mazmunning SHA-384 xeshini e'lon qiladi. "Brauzer" yuklangan baytlar xeshini hisoblaydi va mos kelmasa bajarmaydi (SRI qoidasi: yaroqli token bo'lmasa o'tadi, aks holda eng kuchli algoritm):

```ts run
const ALGS = ["sha256", "sha384", "sha512"];
const NAMES: Record<string, string> = { sha256: "SHA-256", sha384: "SHA-384", sha512: "SHA-512" };

async function digest(alg: string, content: string): Promise<string> {
  const buf = await crypto.subtle.digest(NAMES[alg], new TextEncoder().encode(content));
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

async function verifyIntegrity(content: string, integrity: string): Promise<boolean> {
  const tokens = integrity.split(/\s+/).filter(Boolean).map((t) => {
    const i = t.indexOf("-");
    return { alg: (i < 0 ? t : t.slice(0, i)).toLowerCase(), hash: i < 0 ? "" : t.slice(i + 1) };
  }).filter((t) => ALGS.includes(t.alg));
  if (tokens.length === 0) return true;
  const strongest = tokens.reduce((a, b) => (ALGS.indexOf(b.alg) > ALGS.indexOf(a.alg) ? b : a)).alg;
  const actual = await digest(strongest, content);
  return tokens.filter((t) => t.alg === strongest).some((t) => t.hash === actual);
}

const cdn = new Map<string, string>([["https://cdn.vendor.example/xarita.js", "render('xarita');"]]);

// Build vaqtida, mazmunni tekshirib chiqqandan keyin hisoblangan qiymat
const integrity = "sha384-" + (await digest("sha384", cdn.get("https://cdn.vendor.example/xarita.js")!));
console.log("integrity:", integrity.slice(0, 20) + "...");

async function load(url: string): Promise<string> {
  const body = cdn.get(url)!;
  return (await verifyIntegrity(body, integrity)) ? body : "(bloklandi: integrity mos kelmadi)";
}

console.log("normal:", await load("https://cdn.vendor.example/xarita.js"));
cdn.set("https://cdn.vendor.example/xarita.js", "render('xarita');sendToEvil(document.forms);");
console.log("CDN buzilgandan keyin:", await load("https://cdn.vendor.example/xarita.js"));
console.log("noto'g'ri yozilgan atribut:", await verifyIntegrity("istalgan narsa", "sha348-xxxx"));
```

```text
integrity: sha384-NcqSLZDXkcY+S...
normal: render('xarita');
CDN buzilgandan keyin: (bloklandi: integrity mos kelmadi)
noto'g'ri yozilgan atribut: true
```

### Tuzatish nima uchun yetarli

Invariant: brauzer faqat xeshi e'lon qilingan mazmunga mos keladigan skriptni bajaradi. CDN almashtirgan fayl boshqa xeshga ega, shuning uchun bloklanadi: hujumchi "tekshirilgan" xeshni soxtalashtira olmaydi (ikkilamchi preimage qarshiligi, 62-dars), va u sahifa HTML'ini o'zgartira olmasa, integrity qiymatini ham almashtira olmaydi. Hujum faqat sahifaning o'zi (integrity atributi) ham buzilganda o'tadi.

Yopilmagan narsalar: (1) oxirgi qator muhim dars: xato yozilgan algoritm nomi (`sha348`) yaroqli token emas va resurs tekshiruvsiz o'tadi, ya'ni himoya jim o'chadi; integrity qiymatini qo'lda emas, build vaqtida avtomatik hosil qiling; (2) tekshirilgan skript ham sahifa ma'lumotini vendorga yuborishi mumkin (SRI faqat yaxlitlik); (3) birinchi xeshni olganingizda skript allaqachon zararli bo'lsa, SRI uni muhrlaydi; (4) skript ichidan dinamik yuklanadigan resurslar va tag manager kontenti SRI doirasidan tashqarida; (5) model brauzerning CORS va yuklash tafsilotlarini o'z ichiga olmaydi.

## Qachon qo'llamaslik kerak

- Tez-tez o'zgaradigan vendor skriptlari (tag manager konteynerlari, reklama va A/B test skriptlari, "doim eng so'nggi versiya" URL'lari) uchun SRI amaliy emas: har o'zgarishda sahifa ishlamay qoladi. Bunday joyda boshqa choralar: o'z serveringizga versiyalab ko'chirish, iframe izolyatsiyasi, publishing nazorati, mazmunni monitoring qilish.
- Vendor CORS sarlavhasini bermasa, `crossorigin` bilan SRI ishlamaydi. Majburlab ishlatishga urinish skriptni bloklaydi.
- Faqat o'z origin'ingizdan xizmat qilinadigan, build artefaktlari (hash'li nom bilan) uchun SRI foydasi cheklangan: ular zanjirda siz nazorat qiladigan qismda. Ammo CDN orqasidagi o'z fayllaringiz uchun ishlatish mumkin.
- SRI CSP, kodlash va sanitization o'rnini bosmaydi: u faqat yuklanayotgan fayl yaxlitligi uchun.
- Uchinchi tomon skriptlarining soni o'zi xavf: har bir skript ishonch chegarasini kengaytiradi. Eng arzon himoya keraksiz skriptni olib tashlash (YAGNI). Marketing talabi bor-yo'qligini har chorakda ko'rib chiqing.
- Hashlarni qo'lda yangilash jamoada "SRI'ni o'chirib qo'yaylik" qarorini keltirib chiqarishi mumkin. Jarayonni avtomatlashtirmasdan SRI'ni majburlash teskari natija beradi.

## Stack'da: Next.js, CI va monitoring

Next.js o'z build'idagi skriptlar uchun SRI'ni eksperimental sifatida beradi: `next.config.js` ichida `experimental.sri.algorithm` (`sha256`, `sha384` yoki `sha512`), hujjat jadvaliga ko'ra v14.0.0 dan. Build vaqtida JavaScript fayllarining xeshi hisoblanib, script teglariga `integrity` sifatida yoziladi; shu tufayli nonce'siz, statik generatsiyani saqlaydigan CSP mumkin bo'ladi (35-dars). Cheklovlar hujjatda aytilgan: eksperimental (o'zgarishi yoki olib tashlanishi mumkin), faqat App Router, faqat build vaqtida (dinamik hosil qilingan skriptlarga yaramaydi). Bu mexanizm sizning o'z bundle'ingizni qamraydi, vendor skriptlarini emas. Next.js hujjatidagi `<Script>` komponenti tavsifi `integrity` haqida hech narsa aytmaydi, shuning uchun bu darsda unga tayanilmaydi: vendor skripti uchun xeshni build bosqichida o'zingiz hisoblang. Vendor faylini yuklab, tekshirib, xeshini oling va qo'lda yozmang. Quyidagi kod ishga tushirilmaydi (Node muhiti, tarmoq kerak), faqat sintaksis jihatidan tekshirilgan:

```ts
import { createHash } from "node:crypto";

// CI'da: vendor skriptini yuklab, xeshini hisoblash va oldingi qiymat bilan solishtirish
export async function sriFor(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`yuklab bo'lmadi: ${res.status}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  return "sha384-" + createHash("sha384").update(bytes).digest("base64");
}

// vendors.lock.json ichida saqlangan qiymat bilan solishtirish: farq bo'lsa build yiqiladi
export function assertUnchanged(expected: string, actual: string, url: string): void {
  if (expected !== actual) {
    throw new Error(`${url}: integrity o'zgardi. Yangi versiyani ko'rib chiqing va qiymatni yangilang.`);
  }
}
```

Jarayon: vendor versiyalangan (o'zgarmas) URL beradi; PR'da skript mazmuni ko'rib chiqiladi; xesh `vendors.lock.json` ga yoziladi; CI har kecha vendor URL'ini qayta yuklab, xesh o'zgarganini aniqlasa, kanal signal beradi (79-dars). Uchinchi tomon skriptlari ro'yxatini `package.json` dagi bog'liqliklar bilan birga SBOM'ga qo'shing (82-dars). CSP `script-src` va `connect-src` vendorga qaysi manzillar bilan ruxsat berilganini cheklaydi, `connect-src` esa skript ma'lumotni qayerga yubora olishini toraytiradi (SRI buni qilmaydi).

## Xulosa

- Uchinchi tomon skripti sizning origin'ingizda to'liq huquq bilan ishlaydi; xavf uch xil: nazoratni yo'qotish, ixtiyoriy kod bajarilishi va ma'lumot oqishi.
- SRI: `integrity` atributi (sha256/sha384/sha512) kutilgan mazmun xeshini beradi, mos kelmasa brauzer resursni bloklaydi. Cross-origin uchun `crossorigin` va CORS sarlavhasi shart.
- Bir nechta algoritmdan eng kuchlisi ishlatiladi; bir xil algoritmning bir nechta xeshi alternativlar sifatida ishlaydi; yaroqli token yo'q bo'lsa tekshiruv jim o'tadi, shuning uchun xeshni avtomatik hosil qiling.
- SRI faqat yaxlitlikni ta'minlaydi: tag manager kabi dinamik mazmun, tekshirilgan skriptning o'zi yig'adigan ma'lumot va xeshning birinchi olinishi uning chegarasi.
- Qatlamlar: keraksiz skriptni olib tashlash, mirroring, iframe izolyatsiyasi, CSP, publishing nazorati va xesh yangilash jarayoni.
