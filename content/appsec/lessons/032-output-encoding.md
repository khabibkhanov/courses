---
n: 32
slug: output-encoding
title: "Output encoding: HTML, atribut, JavaScript va URL kontekstlari"
summary: "Chiqish kodlashi nima uchun kontekstga bog'liq: HTML matn, atribut, script ichidagi ma'lumot va URL atributlari uchun alohida qoidalar, JSON'ni script ichiga xavfsiz joylash, URL sxemasini allowlist bilan tekshirish."
duration: 45
sources:
  - id: cs-xss
    note: "Kontekstlar bo'yicha chiqish kodlashi (HTML, atribut, JavaScript, CSS, URL), URL uchun kodlashdan keyin atribut kodlash tartibi, xavfli kontekstlar va xavfsiz sink'lar ro'yxati"
  - id: whatwg-html
    note: "HTML Standard: brauzer parser'i script elementi tarkibini JavaScript sifatida emas, xom matn sifatida o'qishi va uni `</script` ketma-ketligida tugatishi"
  - id: asvs
    note: "ASVS 5.0.0 V1: 1.1.2 (kodlash interpreter'dan oldingi oxirgi qadam), 1.2.1 (kontekstga mos HTML/atribut/CSS kodlash), 1.2.2 (URL kodlash va xavfsiz protokollar), 1.2.3 (JavaScript va JSON qurishda kodlash)"
quiz:
  - q: "Foydalanuvchi ismi `<a href=\"/u?name=${ism}\">` ichiga tushadi. Ism qiymatini qaysi usul bilan kodlash to'g'ri?"
    options:
      - "HTML-escape yetarli, chunki u atribut ichida"
      - "Avval URL komponent sifatida kodlash (encodeURIComponent), keyin atribut uchun HTML-escape"
      - "Faqat encodeURIComponent, atribut kodlash kerak emas"
      - "Hech narsa: `/u?name=` oldin turgani uchun xavfsiz"
    answer: 1
    explain: "Qiymat ikki kontekstga ketma-ket tushadi: avval URL so'rov qismi, keyin HTML atribut. Kodlash ichkaridan tashqariga: avval URL, keyin atribut. encodeURIComponent `\"` ni %22 ga aylantiradi, lekin bu atribut kodlashining o'rnini bosmaydi: ikki kontekst qoidasi alohida va ikkalasi ham bajariladi."
  - q: "Server `<script>var state = ${JSON.stringify(state)};</script>` yozadi. state ichidagi bitta matn `</script><img src=x onerror=alert(1)>`. Nima bo'ladi?"
    options:
      - "JSON.stringify tirnoqlarni escape qiladi, shuning uchun xavfsiz"
      - "Brauzer satr ichidagi `</script>` ni e'tiborsiz qoldiradi"
      - "Faqat eski brauzerlarda ishlaydi"
      - "HTML parser `</script>` ni uchratib script elementini tugatadi, qolgani oddiy HTML sifatida tahlil qilinadi"
    answer: 3
    explain: "HTML parser script elementini JavaScript satrlarini tahlil qilmasdan, birinchi `</script` ga qarab tugatadi. JSON to'g'ri bo'lsa ham `<` belgisi qoladi. Tuzatish: `<`ni `\\u003c` ga almashtirish yoki JSON'ni script emas, `type=\"application/json\"` blokiga yoki data-atributga joylash."
  - q: "Ilova profil havolasini `<a href=\"${user.website}\">` qilib chiqaradi va qiymatni HTML-escape qiladi. Hujumchi website sifatida `javascript:alert(1)` kiritdi. Nima bo'ladi?"
    options:
      - "Havola bosilganda kod ishlaydi: HTML-escape bu belgilarni o'zgartirmaydi"
      - "HTML-escape `javascript:` ni to'sadi"
      - "Brauzer javascript: URL'larni hech qachon bajarmaydi"
      - "Faqat `<script>` bo'lsa xavfli"
    answer: 0
    explain: "`javascript:alert(1)` da escape qilinadigan belgilar yo'q, shuning uchun u o'zgarmaydi. Xavf kodlashda emas, URL sxemasida: sxema allowlist bilan (http, https, mailto) tekshirilishi kerak."
  - q: "Qaysi joyga ishonchsiz ma'lumotni kodlash bilan ham qo'ymaslik kerak?"
    options:
      - "Tirnoqli atribut qiymati"
      - "HTML element matni"
      - "Tag nomi yoki atribut nomi o'rnida, shuningdek HTML izoh ichida"
      - "URL so'rov parametri qiymati"
    answer: 2
    explain: "Tag nomi, atribut nomi va izoh ichiga ishonchsiz ma'lumot qo'yish uchun xavfsiz kodlash yo'q: ro'yxatdan (allowlist) tanlanadigan qiymat ishlatiladi. Qolgan uch joy mos kodlash bilan xavfsiz."
  - q: "Quyidagi funksiya ma'lumotni `<script>` ichidagi JS satriga qo'yishga mo'ljallangan. Nega `escapeHtml` bu yerda yetarli emas?\n\n```ts\nconst s = `<script>var name = '${escapeHtml(x)}';</script>`;\n```"
    options:
      - "escapeHtml tirnoqni kodlamaydi"
      - "Script ichida HTML entity'lar dekodlanmaydi: `&#39;` literal matn bo'lib qoladi va ma'lumot buziladi, JS kontekstining o'z qoidasi (`\\x27`, `\\u003c`) kerak"
      - "escapeHtml faqat 5 belgini almashtiradi"
      - "Script ichida kodlash umuman kerak emas"
    answer: 1
    explain: "script elementi ichi HTML entity'larni dekodlamaydi, shuning uchun HTML kodlash noto'g'ri natija beradi (ma'lumot buziladi) va xavfni ham to'liq yopmaydi. Har kontekst o'z kodlash qoidasini talab qiladi."
  - q: "`safeHref` funksiyasi `url.trim().toLowerCase().startsWith('javascript:')` ni rad etadi. Qaysi kiritish uni aylanib o'tadi?"
    options:
      - "`JAVASCRIPT:alert(1)`"
      - "`  javascript:alert(1)` (oldida bo'shliq)"
      - "`java\\tscript:alert(1)` (ichida tab belgisi)"
      - "`https://example.com`"
    answer: 2
    explain: "URL parser kiritishdan tab va yangi qator belgilarini olib tashlaydi, shuning uchun brauzer uni javascript: deb tahlil qiladi, matn bo'yicha tekshiruv esa ko'rmaydi. Ishonchli yo'l: kiritishni URL parser bilan tahlil qilib, hosil bo'lgan protocol'ni allowlist bilan solishtirish. Katta harf toLowerCase bilan, bosh bo'shliq trim bilan ushlanadi, lekin ichki tab emas."
task:
  title: "URL sxemasini allowlist bilan tekshirish"
  prompt: |
    Profil sahifasi `<a href="...">` ichiga foydalanuvchi kiritgan veb-sayt manzilini qo'yadi. `safeHref(url)` hozir manzilni o'zgartirmay qaytaradi, shuning uchun `javascript:` havolalari o'tib ketadi.

    Vazifa: `safeHref` ni URL parser (`new URL(url, BASE)`) yordamida yozing. Faqat `http:`, `https:` va `mailto:` sxemalari ruxsat etiladi; tahlil xato bersa yoki sxema ruxsat etilmagan bo'lsa, funksiya `"#"` qaytaradi. Ruxsat etilgan manzil uchun parser hosil qilgan `href` qaytariladi. Kiritishdagi bosh bo'shliq, katta harf va ichki tab belgisi bilan yashirilgan `javascript:` ham rad etilishi kerak. Natija: 4 ta `true`.
  lang: ts
  starter: |
    const BASE = "https://platforma.example";

    function safeHref(url: string): string {
      return url; // TUZATING
    }

    const attacks = [
      "javascript:alert(1)",
      "  JaVaScRiPt:alert(1)",
      "java\tscript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
    ];

    console.log("hujumlar rad etildi:", attacks.every((u) => safeHref(u) === "#"));
    console.log("https o'tadi:", safeHref("https://example.com/a") === "https://example.com/a");
    console.log("mailto o'tadi:", safeHref("mailto:dispetcher@example.com").startsWith("mailto:"));
    console.log("nisbiy yo'l o'tadi:", safeHref("/mashinalar/7") === "https://platforma.example/mashinalar/7");
  solution: |
    const BASE = "https://platforma.example";
    const ALLOWED = new Set(["http:", "https:", "mailto:"]);

    function safeHref(url: string): string {
      let u: URL;
      try {
        u = new URL(url, BASE);
      } catch {
        return "#";
      }
      return ALLOWED.has(u.protocol) ? u.href : "#";
    }

    const attacks = [
      "javascript:alert(1)",
      "  JaVaScRiPt:alert(1)",
      "java\tscript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
    ];

    console.log("hujumlar rad etildi:", attacks.every((u) => safeHref(u) === "#"));
    console.log("https o'tadi:", safeHref("https://example.com/a") === "https://example.com/a");
    console.log("mailto o'tadi:", safeHref("mailto:dispetcher@example.com").startsWith("mailto:"));
    console.log("nisbiy yo'l o'tadi:", safeHref("/mashinalar/7") === "https://platforma.example/mashinalar/7");
  solutionNotes: |
    - Tekshiruv brauzer ishlatadigan URL parser bilan bajariladi: bosh bo'shliq, katta harf va tab kabi hiylalar parser tomonidan normallashtiriladi, shuning uchun qo'lda `startsWith` yozishdan ko'ra ishonchli.
    - Allowlist ishlatilgan (ruxsat etilgan sxemalar ro'yxati), qora ro'yxat emas: `data:`, `vbscript:` va hali ixtiro qilinmagan sxemalar avtomatik rad etiladi.
    - Natija sifatida kiritish emas, parser hosil qilgan `u.href` qaytariladi: tekshirilgan qiymat bilan atributga tushadigan qiymat bir xil.
    - `new URL(url, BASE)` nisbiy yo'llarni ham qabul qiladi. Agar faqat nisbiy yo'l ruxsat etilishi kerak bo'lsa, `u.origin === BASE` tekshiruvi qo'shiladi (open redirect, 38-dars).
    - Bu funksiya URL sxemasini yopadi. Atribut qiymatini HTML-escape qilish baribir kerak, chunki ular alohida kontekst qatlamlari.
  checklist:
    - "Barcha to'rt yashirilgan `javascript:` va `data:` manzillari `#` bo'ladi"
    - "Sxema allowlist (`http:`, `https:`, `mailto:`) bilan tekshiriladi"
    - "Tekshirish `new URL` natijasiga asoslanadi, qo'lda matn qidirishga emas"
    - "Ruxsat etilgan manzil uchun parser `href` qaytadi"
    - "URL kodlash va atribut kodlash alohida qatlamlar ekanini tushuntira olasiz"
---

## Muammo

31-darsda `escapeHtml` bilan oddiy XSS'ni yopdik va bu "hamma joyda shu funksiyani chaqiraman" degan xulosaga olib borishi mumkin. Haqiqatda ilovada bitta qiymat sahifaning bir necha turli joyiga tushadi: element matniga, atribut ichiga, `<script>` ichidagi JS o'zgaruvchiga, havolaga. Har joyda brauzerning boshqa parser'i ishlaydi va boshqa belgilar "maxsus" bo'ladi. HTML-escape bir joyda to'g'ri, boshqasida foydasiz, uchinchisida ma'lumotni buzadi.

Misol bilan: dispetcher sahifasida haydovchi profili. Ism matn sifatida chiqadi, ism `title` atributiga ham yoziladi, "veb-sayt" maydoni `href` ga tushadi, sahifa boshlang'ich ma'lumotni `<script>` ichiga JSON qilib joylaydi. Dasturchi hamma qiymatni `escapeHtml` dan o'tkazdi. Natija: `href` da `javascript:` ishlaydi (belgilar escape qilinmaydigan), `<script>` ichida `</script>` baribir blokni tugatadi, ism esa `&#39;` bilan buzuq ko'rinadi. Bitta "xavfsiz funksiya" yondashuvi shu yerda sinadi.

Bu dars chiqish kodlashining kontekst xaritasi: har joy uchun nima qilinadi, nima uchun aynan shu va qayerda kodlashning o'zi yetmaydi (URL sxemasi tekshiruvi). 31-darsdagi sink va source fikri shu yerda amaliy qoidaga aylanadi.

## Asosiy g'oya

Chiqish kodlashining (output encoding) mohiyati: ma'lumotni tarjimon (parser) kutayotgan kontekst qoidalariga mos ravishda o'zgartirish, shunda tarjimon uni ma'lumot sifatida o'qiydi, sintaksis sifatida emas. OWASP XSS Prevention Cheat Sheet'ning markaziy g'oyasi ham shu: himoya kontekstga mos kodlashga tayanadi va har kontekst o'z qoidasiga ega. ASVS 5.0.0 bu g'oyani V1 bo'limida talabga aylantirgan: 1.2.1 HTML, atribut, izoh, CSS va HTTP sarlavhasi uchun kontekstga mos kodlashni, 1.2.2 URL qurishda kodlash va faqat xavfsiz protokollarga ruxsatni (`javascript:`, `data:` taqiqlanadi), 1.2.3 JavaScript va JSON qurishda kodlashni talab qiladi, uchalasi ham 1-daraja. 1.1.2 esa kodlash interpreter'dan oldingi oxirgi qadam bo'lishini yoki interpreter o'zi bajarishini aytadi.

Asosiy qoidalar:

1. Ma'lumot faqat ruxsat etilgan joylarga qo'yiladi. Tag nomi, atribut nomi, HTML izoh ichi, `<style>` va `<script>` ichidagi erkin joy ishonchsiz qiymat uchun taqiqlangan zonalar: u yerga xavfsiz kodlash yo'q, qiymat ro'yxatdan (allowlist) tanlanadi.
2. Ruxsat etilgan joyda kontekstga mos kodlash ishlatiladi: HTML matn, tirnoqli atribut, JS ma'lumot qiymati, URL komponenti, CSS qiymati.
3. Kontekstlar ichma-ich tushishi mumkin (URL atribut ichida). Kodlash ichkaridan tashqariga qarab ketma-ket bajariladi: avval URL qoidasi, keyin atribut qoidasi.
4. Kodlashni qo'lda emas, tekshirilgan kutubxona yoki framework mexanizmi bilan bajaring; "faqat shu bir joy" uchun yozilgan funksiya keyingi kontekstda unutiladi.

## Chuqurroq: har kontekstda nima o'zgaradi

### HTML element matni

Parser matn rejimida faqat `<` (tag boshlanishi) va `&` (entity boshlanishi) maxsus. Ikki belgini kodlash yetarli, lekin amalda `>` va tirnoqlar ham kodlanadi, chunki shu funksiya atribut kontekstida ham ishlatilishi mumkin. 31-darsdagi `escapeHtml` aynan shu uchun.

### Atribut qiymati

Tirnoqli atributda qiymatni tirnoq belgisi tugatadi, shuning uchun tirnoq (`"` va `'`) kodlanadi. Eng muhim amaliy qoida: atribut qiymatini doim tirnoq ichida yozing. Tirnoqsiz atributda bo'shliq, `=`, `>` va boshqa belgilar qiymatni tugatadi va yangi atribut (`onfocus=...`) qo'shishga yo'l ochadi; shu sababli tirnoqsiz atributlar uchun kodlash qoidasi ancha kengroq va unutish oson. Voqea atributlari (`onclick`, `onerror`) va `style` atributi alohida zona: ularning qiymati HTML atribut sifatida ham, keyin JS yoki CSS sifatida ham tahlil qilinadi, shu sababli ishonchsiz qiymatni u yerga qo'ymang.

### `<script>` ichidagi ma'lumot

Dastlab ikki holat bor. Birinchisi, ishonchsiz qiymat JavaScript kodining erkin joyiga tushadi: bu taqiqlangan zona. Ikkinchisi, qiymat JSON ma'lumot sifatida satr yoki obyekt ichiga tushadi. Bu ruxsat etilgan, lekin shart bilan. HTML parser `<script>` elementining tarkibini JavaScript sifatida tushunmaydi: u faqat `</script` ketma-ketligini qidiradi va birinchi uchragan joyda elementni tugatadi (HTML Standard parsing qoidalari). Demak satr tirnoqlari ichidagi `</script>` ham blokni tugatadi. JSON.stringify tirnoqlarni to'g'ri escape qiladi, lekin `<` ga tegmaydi. Tuzatish: JSON'dagi `<`, `>`, `&` va satr ajratgichlari U+2028, U+2029 ni `\uXXXX` ko'rinishiga almashtirish. Next.js hujjatidagi JSON-LD namunasi ham shu yo'ldan boradi: `JSON.stringify` HTML tegini tozalamasligi aytilib, `<` belgisi `\u003c` ga almashtiriladi. JSON bu escape'larni tabiiy tushunadi, qiymat o'zgarmaydi. Boshqa yo'l: ma'lumotni `<script type="application/json">` blokiga yoki `data-` atributga joylab, klient kodida `JSON.parse` qilish. Birinchi usulda ham `<` almashtirish kerak (JSON bloki ham `</script` bilan tugaydi).

Muhim: HTML-escape bu kontekstda ishlamaydi. script ichi HTML entity'larni dekodlamaydi (u "xom matn" elementi), shuning uchun `&lt;` literal `&lt;` bo'lib JS'ga yetadi. Shuning uchun script ichida HTML kodlash na xavfni yopadi, na ma'lumotni saqlaydi.

### URL kontekstlari

URL kontekstida ikki alohida masala bor.

Birinchisi, qiymat URL yo'li yoki so'rov parametri bo'lib tushadi: bunda `encodeURIComponent` ishlatiladi (bitta komponent uchun; `encodeURI` butun URL uchun va `/`, `?`, `&` ni tegmaydi). Parametr qiymatini `encodeURI` bilan kodlash klassik xato: `&` qolib, parametr chegarasi buziladi.

Ikkinchisi, butun URL ishonchsiz bo'ladi (`href`, `src`, `action`, yo'naltirish manzili). Bunda kodlash yetmaydi, chunki `javascript:alert(1)` da kodlanadigan belgi yo'q. Xavf sxemada. Ishlaydigan yondashuv: URL'ni parser bilan tahlil qilish va `protocol` ni allowlist (`http:`, `https:`, `mailto:`) bilan solishtirish. Qo'lda `startsWith("javascript:")` tekshiruvi ishonchsiz: URL parser kiritishdan tab va yangi qator belgilarini olib tashlaydi va boshidagi bo'shliqlarni kesadi, shuning uchun `java\tscript:` brauzerda baribir `javascript:` bo'ladi. Qora ro'yxat shu tufayli ishlamaydi, allowlist esa noma'lum sxemalarni ham to'sadi (`data:`, `vbscript:`). Shundan keyin URL atribut ichiga tushgani uchun HTML atribut kodlashi alohida qatlam sifatida baribir bajariladi.

### CSS va boshqa kontekstlar

CSS qiymatiga ishonchsiz ma'lumot qo'yish qiyin va ko'pincha keraksiz. Rang yoki o'lchamni kiritish bo'lsa, uni ro'yxatdan tanlang yoki qat'iy formatda tekshiring (`/^#[0-9a-f]{6}$/i`). Erkin CSS matnini qabul qilish alohida xavf. Boshqa kontekstlar (JSON javob, SQL, shell, log) o'z darslarida: kodlash qoidasi har interpreter uchun alohida.

### Kodlash qayerda va qachon bajariladi

ASVS 1.1.2 kodlashni ma'lumot interpreter'ga yetishidan oldingi oxirgi qadam deb belgilaydi. Bu ikki amaliy oqibat beradi. Birinchisi: kodlangan qiymatni keyin yana o'zgartirmang (qo'shmang, kesmang, boshqa funksiyaga bermang), chunki kesish `&amp;` ni `&am` ga aylantirib entity'ni buzadi. Ikkinchisi: ASVS 1.1.1 kiritish kanonik shaklga faqat bir marta dekodlanishini talab qiladi va bu validatsiya yoki sanitizatsiyadan oldin bajarilishi kerak. Ya'ni oldin dekodlab, keyin tekshirsangiz, tekshiruv hujumchi ko'rmoqchi bo'lgan shaklni ko'radi; tekshirgandan keyin qayta dekodlasangiz, tekshiruvdan o'tgan qiymat boshqa narsaga aylanadi.

### Atribut kodlash voqea handler'ini himoya qilmaydi

`onclick="faol('${ism}')"` kabi shablon xavfli ko'rinadi va haqiqatan shunday: HTML parser atribut qiymatidagi belgi havolalarini (`&#39;` kabi) JavaScript o'qishdan oldin dekodlaydi. Ya'ni HTML-escape qilingan `&#39;` handler ichida baribir `'` bo'lib JS'ga yetadi va satrdan chiqarib yuboradi. Ko'proq belgini entity qilish bu ikkinchi kontekstni yo'qotmaydi. Cheat Sheet tavsiyasi: handler'ni `addEventListener()` bilan ro'yxatdan o'tkazing, qiymatni esa `data-` atributi orqali ma'lumot sifatida uzating. Avtopark panelida "mashinani xaritada ko'rsat" tugmasi `data-vehicle-id` olib, handler uni `dataset` dan o'qisa, hech qanday JS satri yig'ilmaydi.

### DOM API'lar o'zi kodlamaydi

Ikki keng tarqalgan noto'g'ri tushuncha. `element.textContent = x` qiymatni HTML-kodlamaydi: u HTML tahlil qilmaydigan matn tuguni yaratadi, shuning uchun unga oldindan `escapeHtml` berish `&lt;` ni foydalanuvchiga ko'rsatadi. `element.setAttribute("title", x)` ham qiymatni to'g'ridan-to'g'ri o'rnatadi, uni oldindan kodlash shart emas. Shu bilan birga `setAttribute` ning birinchi argumenti qat'iy bo'lishi kerak: `onerror` yoki `srcdoc` nomi hujumchidan kelsa, qiymat kod yoki HTML sifatida talqin qilinadi. CSS uchun ham shunday: ishonchsiz qiymatni stil matniga qo'shmang, `element.style.setProperty()` ga qat'iy xossa nomi va o'sha xossaga mos allowlist'dan o'tgan qiymat bering; `background-image` kabi resurs yuklaydigan xossalar uchun URL alohida tekshiriladi.

### JSON javob va Content-Type

Kodlash HTML sahifa bilan cheklanmaydi. Server JSON qaytarganda `Content-Type: application/json` bo'lishi shart: Cheat Sheet JSON `text/html` sifatida jo'natilsa XSS'ga yo'l ochishini ta'kidlaydi, chunki brauzer uni HTML sifatida tahlil qilishi mumkin. Fastify va Express'da `reply.send(obj)` va `res.json(obj)` sarlavhani o'zi qo'yadi, lekin qo'lda `res.send(JSON.stringify(x))` yozganda ehtiyot bo'ling.

### Framework ichida

Zamonaviy UI kutubxonalar (React, Vue, Angular) matn va atribut qiymatlarini avtomatik kodlaydi, shu tufayli oddiy kodlashni unutish xavfi kamayadi. Lekin ular URL sxemasini, `dangerouslySetInnerHTML` kabi chiqish eshiklarini va script ichiga ma'lumot joylashni o'zi yopmaydi. Bu xavfli joylar 33-darsda ko'riladi.

## Misol: bitta sahifa, to'rt kontekst

Misol sahifa qismlarini satr sifatida yig'adigan o'quv funksiyasi. Hammasi mahalliy, tarmoq yo'q; "hujum" payload'lari shu funksiyaning kiritishlari.

### 1. Zaif kod

Dasturchi hamma qiymatni bir xil `escapeHtml` dan o'tkazgan, lekin `href` va `<script>` kontekstlari uchun boshqa choralar yo'q:

```ts run
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

type Profile = { name: string; website: string; note: string };

// ZAIF: URL sxemasi tekshirilmaydi; script ichida JSON.stringify'dan keyin '<' qoladi
function renderProfileWeak(p: Profile): string {
  return [
    `<h2>${escapeHtml(p.name)}</h2>`,
    `<a href="${escapeHtml(p.website)}">veb-sayt</a>`,
    `<script>var profile = ${JSON.stringify(p)};</script>`,
  ].join("\n");
}

const attack: Profile = {
  name: "Anvar",
  website: "javascript:alert(1)",
  note: "</script><img src=x onerror=alert(1)>",
};
const html = renderProfileWeak(attack);
console.log(html);

// HTML parser script elementini birinchi "</script" da tugatadi
const start = html.indexOf("<script>") + "<script>".length;
const end = html.indexOf("</script", start);
console.log("script ichi tugaydi:", JSON.stringify(html.slice(start, end)));
console.log("script'dan keyin HTML qoldi:", html.slice(end).startsWith("</script><img"));
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu kontekstga mos kodlash xatosidan foydalanish usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi profilni tahrirlashi mumkin bo'lgan foydalanuvchi (masalan, haydovchi). U ikki maydonni to'ldirdi: veb-sayt sifatida `javascript:alert(1)`, izoh sifatida `</script><img src=x onerror=alert(1)>`. Natija:

```text
<h2>Anvar</h2>
<a href="javascript:alert(1)">veb-sayt</a>
<script>var profile = {"name":"Anvar","website":"javascript:alert(1)","note":"</script><img src=x onerror=alert(1)>"};</script>
script ichi tugaydi: "var profile = {\"name\":\"Anvar\",\"website\":\"javascript:alert(1)\",\"note\":\""
script'dan keyin HTML qoldi: true
```

Ikki alohida nuqson ko'rinadi. `href` qiymatida escape qilinadigan belgi yo'q, shuning uchun `javascript:alert(1)` o'zgarmay atributga tushdi va havola bosilganda bajariladi. JSON satri ichidagi `</script>` parser uchun blok oxiri: skript buzuq JS bo'lib qoladi, undan keyingi `<img ... onerror=...>` esa oddiy tag sifatida tahlil qilinadi va ishlaydi.

### 3. Tuzatilgan kod

Har kontekst o'z qoidasi bilan: URL sxemasi allowlist bilan, JSON esa `<` almashtirib joylanadi.

```ts run
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const ALLOWED = new Set(["http:", "https:", "mailto:"]);
function safeHref(url: string): string {
  try {
    const u = new URL(url, "https://platforma.example");
    return ALLOWED.has(u.protocol) ? u.href : "#";
  } catch {
    return "#";
  }
}

// JSON'ni <script> ichiga joylash uchun: < > & va satr ajratgichlari \uXXXX bo'ladi
function jsonForScript(value: unknown): string {
  const esc = (c: string) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
  return JSON.stringify(value)
    .replace(/[<>&]/g, esc)
    .split(String.fromCharCode(0x2028)).join("\\u2028") // satr ajratgichlari
    .split(String.fromCharCode(0x2029)).join("\\u2029");
}

type Profile = { name: string; website: string; note: string };

function renderProfile(p: Profile): string {
  return [
    `<h2>${escapeHtml(p.name)}</h2>`,
    `<a href="${escapeHtml(safeHref(p.website))}">veb-sayt</a>`,
    `<script>var profile = ${jsonForScript(p)};</script>`,
  ].join("\n");
}

const attack: Profile = {
  name: "Anvar",
  website: "javascript:alert(1)",
  note: "</script><img src=x onerror=alert(1)>",
};
const html = renderProfile(attack);
console.log(html);
console.log("'</script' soni:", html.split("</script").length - 1);

// JSON qiymati o'zgarmaganini tekshiramiz
const m = html.match(/var profile = (.*);<\/script>/);
console.log("qiymat saqlandi:", JSON.parse(m![1]).note === attack.note);
```

```text
<h2>Anvar</h2>
<a href="#">veb-sayt</a>
<script>var profile = {"name":"Anvar","website":"javascript:alert(1)","note":"\u003c/script\u003e\u003cimg src=x onerror=alert(1)\u003e"};</script>
'</script' soni: 1
qiymat saqlandi: true
```

### Tuzatish nima uchun yetarli

`safeHref` kirishni brauzer ishlatadigan URL parser bilan tahlil qiladi va sxemani allowlist bilan solishtiradi, shuning uchun `javascript:` havolasi `#` ga aylandi. `jsonForScript` `<` ni `\u003c` ga almashtiradi: JSON parser uchun bu aynan o'sha belgi (qiymat saqlandi), HTML parser uchun esa `</script` ketma-ketligi yo'q, shuning uchun bloklar soni bitta, ya'ni faqat o'zimiz yozgan yopuvchi teg. Yopilgan hujumlar: ushbu ikki payload. Yopilmagan narsalar: tuzatish kodni boshqa kontekstlarga (CSS, voqea atributi) avtomatik kengaytirmaydi, `safeHref` esa `https://` ga ishora qiluvchi zararli saytning o'ziga qarshi hech narsa qilmaydi (bu open redirect bilan bog'liq, 38-dars). Va, har doimgidek, bu to'siqlar bir-biriga qo'shimcha: CSP (35-dars) bu yerda ikkinchi qatlam.

### Mashq: havola yasash, ikki qatlam

Quyidagi funksiya haydovchi ismini ham havola manziliga, ham havola matniga qo'yadi. Hozir hech narsa kodlanmaydi. Ism URL parametri sifatida kodlanishi (avval) va atribut ichiga tushgani uchun HTML-escape qilinishi (keyin), matn sifatida esa faqat HTML-escape qilinishi kerak. Testlar atributdan chiqish, `&` va `=` ni saqlash hamda matn kontekstini tekshiradi.

```ts run
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function driverLink(name: string): string {
  // TUZATING: manzil uchun URL kodlash, keyin atribut kodlash; matn uchun HTML kodlash
  return `<a href="/u?name=${name}">${name}</a>`;
}

console.log(driverLink("Anvar"));
console.log(driverLink('x" onmouseover="alert(1)'));
```

```ts test
const unescape = (s: string) =>
  s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const hrefOf = (html: string) => unescape(/href="([^"]*)"/.exec(html)![1]);

check("oddiy ism o'zgarmaydi", () => driverLink("Anvar") === '<a href="/u?name=Anvar">Anvar</a>');
check("tirnoq atributdan chiqarib yubormaydi", () => (driverLink('x" onmouseover="alert(1)').match(/"/g) || []).length === 2);
check("& va = parametr chegarasini buzmaydi", () => new URL(hrefOf(driverLink("a&b=c")), "https://platforma.example").searchParams.get("name") === "a&b=c");
check("matn kontekstida xom < qolmaydi", () => !driverLink("<i>x</i>").slice(driverLink("<i>x</i>").indexOf(">") + 1).includes("<i>"));
```

Yechim g'oyasi: `const q = encodeURIComponent(name)`, so'ng `href="/u?name=${escapeHtml(q)}"` va matn uchun `${escapeHtml(name)}`. `encodeURIComponent` natijasida `<`, `>` va `"` qolmaydi, lekin `'` qolishi mumkin, shuning uchun atribut kodlashi baribir bajariladi.

## Qachon qo'llamaslik kerak

Chiqish kodlashi to'g'ri asbob, lekin quyidagi hollarda ishlamaydi yoki yetarli emas.

- Foydalanuvchi HTML formatini kiritishi kerak bo'lsa, kodlash formatni o'chiradi. Bunday joyda sanitization (34-dars) ishlatiladi.
- Taqiqlangan zonalarga (tag nomi, atribut nomi, erkin `<script>` kodi, voqea atributi) qiymat "kodlab" qo'yilmaydi. Variantni ro'yxatdan tanlash yoki dizaynni o'zgartirish kerak.
- Kodlash faqat chiqish uchun. Ma'lumot bazaga yozilganda kodlanmaydi (31-dars). Kutubxona ichida allaqachon kodlanadigan joyga (JSX matni, EJS `<%= %>`) qo'shimcha kodlash ikki marta kodlashga olib keladi.
- Kodlash mantiqiy zaifliklarni (autorizatsiya, 51-dars) hal qilmaydi: begona mashina ma'lumotini mukammal kodlangan holda ko'rsatish ham baribir ma'lumot oshkor bo'lishi.
- Kontekstni tayinlay olmasangiz, kodlash tanlab bo'lmaydi. Bunday holat kodni qayta loyihalash belgisi: bitta qiymat qayerga tushishini bilmaydigan shablon qatlami xavfsiz emas.

## Stack'da: shablonlar, Next.js va JSON ma'lumot

Amaliy tavsiya: kodlashni qo'lda yozmang, framework mexanizmidan foydalaning va faqat u yopmaydigan joylarni qo'lda tekshiring. React/Next.js'da JSX matni va atribut qiymatlari kodlanadi, lekin URL va script ichi sizning mas'uliyatingizda.

```tsx
type Profile = { name: string; website: string };

const ALLOWED = new Set(["http:", "https:", "mailto:"]);
function safeHref(url: string): string {
  try {
    const u = new URL(url, "https://platforma.example");
    return ALLOWED.has(u.protocol) ? u.href : "#";
  } catch {
    return "#";
  }
}

// Boshlang'ich ma'lumotni script ichiga joylash kerak bo'lsa: '<' ni almashtiring
const jsonForScript = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");

export function ProfileCard({ p }: { p: Profile }) {
  return (
    <section>
      <h2>{p.name}</h2>
      <a href={safeHref(p.website)} rel="noopener noreferrer">veb-sayt</a>
      <script
        type="application/json"
        id="profile-data"
        dangerouslySetInnerHTML={{ __html: jsonForScript(p) }}
      />
    </section>
  );
}
```

Bu kod ishga tushirilmaydi (React brauzer worker'ida yo'q), faqat sintaksis jihatidan tekshirilgan. Nuqtalar: `{p.name}` avtomatik kodlanadi; `href` uchun sxema tekshiruvi qo'lda; ma'lumot `type="application/json"` blokida va `<` almashtirilgan, klient kodi uni `JSON.parse(document.getElementById("profile-data").textContent)` bilan o'qiydi. Bu yerda `dangerouslySetInnerHTML` ishlatilgani sababli bu qator code review'da alohida ko'rinishi kerak (33-dars). Server tomonida (Fastify, Express) shablon engine tanlashda avtomatik kodlash yoqilgan va xom chiqarish alohida sintaksis bilan berilganini ("raw" belgisi) tekshiring.

## Xulosa

- Kodlash kontekstga bog'liq: HTML matn, tirnoqli atribut, script ichidagi JSON, URL komponenti va butun URL har biri o'z qoidasiga ega.
- Atributni doim tirnoq ichida yozing; tag nomi, atribut nomi, izoh va erkin script kodi taqiqlangan zonalar.
- `<script>` ichida HTML parser `</script` da to'xtaydi va entity'larni dekodlamaydi: JSON'dagi `<`, `>`, `&`, U+2028 va U+2029 ni `\uXXXX` ga almashtiring.
- URL uchun kodlash yetarli emas: URL'ni parser bilan tahlil qiling va sxemani allowlist bilan tekshiring.
- Kontekstlar ichma-ich bo'lsa, kodlash ichkaridan tashqariga bajariladi; qo'lda yozilgan "universal" funksiyadan ko'ra framework mexanizmi afzal.
