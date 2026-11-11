---
n: 34
slug: sanitization-trusted-types
title: "Sanitization va Trusted Types"
summary: "Foydalanuvchi HTML kiritishi kerak bo'lganda kodlash o'rniga allowlist asosidagi sanitization: nega regex ishlamaydi, mutation XSS nima, DOM tuguni bilan ishlash, va Trusted Types brauzer darajasida xavfli sink'larga satr yozishni qanday to'xtatadi."
duration: 45
sources:
  - id: trusted-types
    note: "W3C Trusted Types: TrustedHTML/TrustedScript/TrustedScriptURL turlari va policy mexanizmi; spetsifikatsiya umumiy mazmuni, bo'lim raqamlari keltirilmaydi"
  - id: cs-xss
    note: "Umumiy mazmun: HTML kiritish kerak bo'lganda ishonchli kutubxona bilan sanitization tavsiyasi; bo'lim raqamlari keltirilmaydi"
  - id: csp3
    note: "CSP Level 3: require-trusted-types-for va trusted-types direktivalari CSP orqali beriladi (aniq sintaksis 35-darsda ko'riladi)"
quiz:
  - q: "Jamoa izohlardagi xavfli teglarni `html.replace(/<script.*?>.*?<\\/script>/gi, '')` bilan o'chirishga qaror qildi. Eng aniq tanqid qaysi?"
    options:
      - "Regex sekin ishlaydi"
      - "Kod bajaradigan shakllar `<script>` bilan cheklanmaydi (voqea atributlari, URL sxemalari) va HTML parser regex ko'rmaydigan shakllarni ham tahlil qiladi"
      - "`/gi` bayroqlari noto'g'ri"
      - "Regex faqat server tomonida ishlamaydi"
    answer: 1
    explain: "Muammo regex tezligida emas: HTML noldan qoidaga ega parser tomonidan tahlil qilinadi va xatolarni kechiradi. Regex bu xatti-harakatni to'liq modellay olmaydi, shuning uchun sanitizer ham brauzer bilan bir xil parser asosida ishlashi kerak."
  - q: "Mutation XSS (mXSS) nima?"
    options:
      - "Sanitizer toza deb topgan satr keyingi serializatsiya va qayta tahlilda boshqa tuzilishga o'tib, kod bajaradigan holga keladi"
      - "Payload bazada vaqt o'tishi bilan o'zgaradi"
      - "Foydalanuvchi bir nechta payload yuboradi"
      - "Skript DOM'ni o'zgartiradi"
    answer: 0
    explain: "HTML parser va serializer bir-birining aniq teskarisi emas. Sanitizer ko'rgan tuzilma bilan satrni keyin qayta tahlil qilgan brauzer ko'radigan tuzilma farq qilsa, 'toza' satr xavfli bo'lib chiqadi. Himoya: ishonchli kutubxona, minimal allowlist, iloji bo'lsa satrga qayta aylantirmasdan DOM tugunlarini qo'yish."
  - q: "`require-trusted-types-for 'script'` yoqilgan sahifada `el.innerHTML = userString` yozildi. Nima bo'ladi?"
    options:
      - "Satr avtomatik tozalanadi"
      - "Hech narsa: qoida faqat eval uchun"
      - "Sahifa to'liq o'chadi"
      - "Brauzer yozishni rad etadi (TypeError), chunki sink TrustedHTML talab qiladi"
    answer: 3
    explain: "Yoqilgan holatda DOM XSS sink'lari satr o'rniga Trusted Types qiymatini talab qiladi; oddiy satr TypeError bilan rad etiladi. Tozalashni brauzer qilmaydi: u siz yozgan policy ichida bajarilishi kerak."
  - q: "Policy: `trustedTypes.createPolicy('x', { createHTML: (s) => s })`. U qanday baholanadi?"
    options:
      - "Xavfsiz: policy bor, demak himoya ishlaydi"
      - "Brauzer bunday policy yaratilishiga yo'l qo'ymaydi"
      - "Himoyani rasmiylashtiradi, lekin amalda hech narsa tekshirmaydi: istalgan satr TrustedHTML'ga aylanadi"
      - "Faqat `eval` uchun foydali"
    answer: 2
    explain: "Trusted Types xavfsiz kodni kafolatlamaydi, xavfli sink'larga kirish nuqtalarini kamaytiradi va auditni policy kodiga siqadi. Policy hech narsa tekshirmasa, bu qatlam formal bo'lib qoladi."
  - q: "Haydovchi ismi sahifada oddiy matn sifatida ko'rsatiladi. Qaysi yondashuv to'g'ri?"
    options:
      - "DOMPurify bilan tozalab innerHTML ga yozish"
      - "Matn sifatida chiqarish (textContent yoki framework kodlashi): sanitization kerak emas"
      - "Trusted Types policy yaratish"
      - "Ismni regex bilan tozalash"
    answer: 1
    explain: "Foydalanuvchi HTML kiritishi kerak bo'lmagan joyda kodlash eng sodda va ishonchli. Sanitization va Trusted Types HTML kiritish shart bo'lgan, murakkabroq holatlar uchun."
  - q: "Sanitizer sozlamasi: barcha teglarni, shu jumladan `style`, `iframe`, `form` ni ruxsat etib, faqat `script` ni taqiqlaydi. Bu nega yomon dizayn?"
    options:
      - "Qora ro'yxat: ruxsat etilgan teglar soni katta va xavfli shakllar (iframe, form, kelajakdagi yangi elementlar) o'tadi; allowlist minimal bo'lishi kerak"
      - "Sanitizer kamida bitta tegni taqiqlashi shart emas"
      - "Sanitizer faqat `script` ni taniydi"
      - "Hech qanday muammo yo'q"
    answer: 0
    explain: "Allowlist yondashuv: faqat kerakli teglar va atributlar ruxsat etiladi, qolgani olib tashlanadi. Qora ro'yxat noma'lum va yangi shakllarni o'tkazib yuboradi."
task:
  title: "TrustedHtml: escape qilib, faqat aniq teglarni qaytarish"
  prompt: |
    Izohlarda faqat `<b>`, `</b>`, `<i>`, `</i>` va `<br>` teglariga ruxsat beramiz (atributsiz). Qolgan hamma narsa matn bo'lishi kerak.

    Vazifa: `toTrustedHtml(input)` ni yozing: avval hamma narsani HTML-escape qiling, so'ng escape qilingan shakldan faqat shu besh teg aniq mos kelganda qaytaring (masalan, `&lt;b&gt;` -> `<b>`). Atributli teglar (`<b onclick=...>`) va boshqa teglar escape bo'lib qolishi kerak. `showComment` faqat `TrustedHtml` turini qabul qiladi (brend turi): oddiy satrni unga berish kompilyatsiya xatosi bo'lardi, bu Trusted Types g'oyasining TypeScript modeli.
  lang: ts
  starter: |
    type TrustedHtml = string & { readonly __brand: "TrustedHtml" };

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

    // TUZATING: faqat <b> </b> <i> </i> <br> teglari qaytsin, qolgan hamma narsa escape qilinsin
    function toTrustedHtml(input: string): TrustedHtml {
      return input as TrustedHtml;
    }

    function showComment(html: TrustedHtml): string {
      return `<div class="komment">${html}</div>`;
    }

    console.log(showComment(toTrustedHtml("<b>Muhim</b>: ertaga <i>erta</i> chiqing<br>rahmat")));
    console.log(showComment(toTrustedHtml("<img src=x onerror=alert(1)>")));
    console.log(showComment(toTrustedHtml('<b onclick="alert(1)">bos</b>')));
    console.log(showComment(toTrustedHtml("<script>alert(1)</script>")));
  solution: |
    type TrustedHtml = string & { readonly __brand: "TrustedHtml" };

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

    const ALLOWED_TAGS = /&lt;(\/?(?:b|i)|br)&gt;/g;

    function toTrustedHtml(input: string): TrustedHtml {
      const escaped = esc(input);
      return escaped.replace(ALLOWED_TAGS, "<$1>") as TrustedHtml;
    }

    function showComment(html: TrustedHtml): string {
      return `<div class="komment">${html}</div>`;
    }

    console.log(showComment(toTrustedHtml("<b>Muhim</b>: ertaga <i>erta</i> chiqing<br>rahmat")));
    console.log(showComment(toTrustedHtml("<img src=x onerror=alert(1)>")));
    console.log(showComment(toTrustedHtml('<b onclick="alert(1)">bos</b>')));
    console.log(showComment(toTrustedHtml("<script>alert(1)</script>")));
  solutionNotes: |
    - Tartib muhim: avval hamma narsa escape qilinadi, keyin faqat aniq shakldagi besh tegga qaytariladi. Escape qilingan matnda `<` yo'q, shuning uchun hujumchi yangi teg yarata olmaydi; qaytarilgan teglar esa to'g'ridan-to'g'ri o'zimiz yozgan literal.
    - Atributli teg (`<b onclick=...>`) regex'ga mos kelmaydi (`&lt;b ` dan keyin `&gt;` emas, bo'shliq), shuning uchun escape bo'lib qoladi.
    - Bu "ruxsat berilgan tuzilma literal" yondashuvi faqat juda tor to'plam uchun to'g'ri. Teglar soni oshsa yoki atribut kerak bo'lsa, o'zingiz yozgan regex o'rniga DOM asosidagi ishonchli sanitizer ishlating.
    - Yopilmagan `<b>` yoki noto'g'ri ketma-ketlik hujum emas, lekin sahifa dizaynini buzishi mumkin (izoh konteyneri ichida). Konteynerni stil bilan izolyatsiya qiling.
    - Brend tur (TrustedHtml) faqat kompilyatsiya vaqtida ishlaydi; brauzerdagi Trusted Types esa runtime'da majburlaydi. Ikkalasi bir g'oyaning ikki darajasi.
  checklist:
    - "Matn avval to'liq escape qilinadi"
    - "Faqat `<b>`, `</b>`, `<i>`, `</i>`, `<br>` qaytariladi"
    - "Atributli teg va `<script>` escape bo'lib qoladi"
    - "Xavfli sink faqat `TrustedHtml` turini qabul qiladi"
    - "Nega bunday literal yondashuv keng allowlist uchun yaramasligini tushuntira olasiz"
---

## Muammo

31 va 32-darslarda ma'lumotni matn sifatida chiqarish va kontekstga mos kodlashni ko'rdik. Bu hal qilmaydigan holat: foydalanuvchi HTML'ning o'zini kiritishi kerak. Dispetcher izohida qalin shrift va ro'yxat, qo'llab-quvvatlash chatida havola, hisobot shablonida boy matn muharriri. Hamma narsani kodlasangiz formatlash yo'qoladi, kodlamasangiz XSS.

Odatiy "tuzatish" regex: `<script>` ni va `on...=` atributlarini o'chirish. Bu ish bermaydi, chunki HTML parser regex qoidalaridan ancha murakkab: noto'g'ri yopilgan teglarni tuzatadi, atribut chegaralarini turli yo'l bilan topadi, ichma-ich kontekstlar (`svg`, `math`, `template`) uchun alohida qoidalarga ega. Regex-filtr bilan brauzer bir satrni turlicha "ko'radi" va hujumchi aynan shu farqdan foydalanadi. Ishonchli yo'l: brauzer bilan bir xil parser asosida satrni DOM'ga aylantirish, tuzilmani allowlist bilan tozalash va faqat tozalangan natijani ishlatish. Bu sanitization.

Ikkinchi qatlam muammosi tashkiliy: katta kod bazasida `innerHTML` yozilgan yuzlab joy bor va hammasi to'g'ri sanitize qilinganini kafolatlash qiyin. Trusted Types shu muammoga javob: brauzer darajasida xavfli sink'larga oddiy satr yozishni taqiqlaydi va faqat siz yozgan policy'dan o'tgan qiymatlarni qabul qiladi. Bu bilan audit ko'p yuzlab joydan bir nechta policy funksiyasiga qisqaradi.

## Asosiy g'oya

### Sanitization nima

Sanitization: ishonchsiz HTML'ni qabul qilib, undan xavfli qismlarni olib tashlab, xavfsiz HTML qaytarish. Kodlashdan farqi: kodlash hamma narsani matnga aylantiradi, sanitization esa ruxsat etilgan markup'ni saqlaydi. OWASP XSS cheat sheet'ning umumiy tavsiyasi: HTML kiritish kerak bo'lsa, o'zingiz sanitizer yozmasdan, ishonchli va doimiy yangilanadigan kutubxona (masalan DOMPurify) ishlating. Eslatma: DOMPurify tavsiyasi, uni muntazam yangilash zarurligi va Trusted Types haqidagi da'volar OWASP XSS Prevention Cheat Sheet'ning lokal nusxasiga solishtirilgan; brauzer qo'llab-quvvatlash jadvallari tekshirilmagan va keltirilmaydi.

Sanitizer ishining tuzilmasi:

1. Satr xavfsiz (inert) kontekstda DOM'ga tahlil qilinadi (masalan `<template>` yoki `DOMParser`): shunda rasm yuklanmaydi va hodisalar ishlamaydi.
2. DOM daraxti aylanib chiqiladi: har element va atribut allowlist bilan solishtiriladi. Ruxsat etilmagan elementlar olib tashlanadi yoki matn bilan almashtiriladi, atributlar o'chiriladi, URL atributlari sxema allowlist'i bilan tekshiriladi (32-dars).
3. Natija qaytariladi.

Allowlist asosiy tamoyil: faqat kerakli teglar (`b`, `i`, `p`, `ul`, `li`, `a`) va faqat kerakli atributlar (`a` uchun `href`) ruxsat etiladi. Qora ro'yxat ("script, iframe ni taqiqlaymiz") yangi va noma'lum shakllarni o'tkazib yuboradi.

## Chuqurroq: mXSS, Trusted Types va platforma API

### Mutation XSS

Sanitizer satrni DOM'ga aylantiradi, tozalaydi, so'ng yana satrga aylantiradi (serialization) va natija `innerHTML` orqali sahifada qayta tahlil qilinadi. HTML parser va serializer bir-birining aniq teskarisi emas: ba'zi tuzilmalar serializatsiya va qayta tahlilda boshqacha daraxtga aylanadi (ayniqsa `svg`, `math`, `noscript`, `style` kabi maxsus kontekstlar va tag nomlari). Sanitizer ko'rgan daraxt toza bo'lsa-yu, qayta tahlilda boshqa daraxt chiqsa va unda kod bajaradigan atribut paydo bo'lsa, bu mutation XSS (mXSS). Bunday hujumlar tufayli yirik sanitizer kutubxonalarida vaqti-vaqti bilan zaifliklar topilgan va tuzatilgan; shu sababli kutubxonani yangilab turish kerak.

Mudofaa tamoyillari: (1) o'zingiz sanitizer yozmang; (2) imkon bo'lsa tozalangan natijani satrga qaytarmasdan, DOM tuguni (`DocumentFragment`) sifatida qo'ying, shunda qayta tahlil bosqichi bo'lmaydi; (3) allowlist'ni minimal saqlang, murakkab kontekstlar (`svg`, `math`) kerak bo'lmasa ruxsat bermang; (4) tozalangan natijani CSP (35-dars) va Trusted Types ikkinchi qatlami bilan himoyalang.

### Trusted Types

Trusted Types brauzer xususiyati (W3C spetsifikatsiyasi) bo'lib, DOM XSS sink'larini qulflaydi. U uchta tur kiritadi: `TrustedHTML` (`innerHTML`, `insertAdjacentHTML`, `document.write` uchun), `TrustedScript` (`eval`, `script.text` uchun) va `TrustedScriptURL` (skript manzillari uchun). Yoqilganda (CSP orqali) bu sink'larga oddiy satr yozish rad etiladi va faqat policy yaratgan turlangan qiymat qabul qilinadi.

Yoqish uchun CSP sarlavhasida (batafsil 35-darsda) ikki direktiva ishlatiladi: `require-trusted-types-for 'script'` sink'larda majburlashni yoqadi, `trusted-types nom1 nom2` esa qaysi nomlar bilan policy yaratish mumkinligini cheklaydi. Policy kodda yaratiladi:

```ts
// Brauzerda (Trusted Types qo'llab-quvvatlanganda) ishlaydi; bu yerda ishga tushirilmaydi
declare const sanitize: (dirty: string) => string; // masalan, DOMPurify yoki o'zingizning tekshirilgan funksiyangiz

const policy = (window as any).trustedTypes?.createPolicy("komment-sanitizer", {
  createHTML: (dirty: string) => sanitize(dirty),
});

// Endi sink'ga faqat policy orqali:
// el.innerHTML = policy.createHTML(userHtml);
```

Tekshirilgan xatti-harakat (ushbu darsni yozishda Chromium'da sinab ko'rilgan): sahifada `require-trusted-types-for 'script'` bo'lsa, `el.innerHTML = "<b>salom</b>"` yozuvi `TypeError` bilan rad etiladi ("This document requires 'TrustedHTML' assignment"), `trusted-types` ro'yxatida bo'lmagan nom bilan `createPolicy` ham `TypeError` beradi. Policy ichidagi funksiya esa sizniki: u nimani qaytarsa, sink shuni qabul qiladi.

Muhim cheklov: Trusted Types xavfsiz kodni kafolatlamaydi. U sink'larga "kirish eshiklarini" bir necha policy'ga qisqartiradi, audit sirtini kamaytiradi va yangi koddagi tasodifiy `innerHTML = string` ni to'xtatadi. Policy `createHTML: (s) => s` bo'lsa, qatlam shakldan iborat, himoya yo'q. Brauzer qo'llab-quvvatlashi bir xil emas: qo'llab-quvvatlamaydigan brauzerda `trustedTypes` obyekti bo'lmaydi va kodingiz uni tekshirishi kerak (yuqoridagi `?.`). Joriy qo'llab-quvvatlash jadvalini MDN yoki caniuse'dan o'zingiz tekshiring.

Joriy qilish tartibi: avval faqat hisobot rejimida (`Content-Security-Policy-Report-Only`) yoqing, violation hisobotlaridan qaysi kod `innerHTML` ga satr yozayotganini toping, ularni tuzating yoki policy'dan o'tkazing va keyin majburlashga o'ting. Uchinchi tomon kutubxonalari (grafik, xarita, editor) ko'pincha shu bosqichda to'siq bo'ladi; ba'zilari Trusted Types'ni qo'llab-quvvatlaydi, ba'zilari yo'q va ularga alohida default policy yoki almashtirish kerak.

### Platforma API: setHTML

Brauzerlar xavfsiz HTML kiritish uchun o'rnatilgan Sanitizer API ustida ishlamoqda (`Element.setHTML()`). Uning qo'llab-quvvatlash holati va sintaksisi tez o'zgargan, ushbu darsda u tekshirilmagan, shuning uchun u haqida da'vo yozilmaydi; ishlatishdan oldin MDN va brauzer hujjatlarida joriy holatni tekshiring. Hozircha production uchun tekshirilgan kutubxona + Trusted Types yo'nalishi kafolatliroq.

## Misol: izoh sanitizeri

Misol brauzer sandbox'ida ishlaydi (`html run`) va faqat shu darsning o'quv sahifasiga qarshi. Maqsad sanitizer ichki tuzilishini ko'rsatish; production'da shu o'rniga tekshirilgan kutubxona ishlatiladi.

### 1. Zaif kod

Izoh HTML kodlanmay, to'g'ridan-to'g'ri `innerHTML` ga yoziladi. Dispetcherning formatlash imkoni saqlangan, lekin hamma narsa ham ishlaydi:

```html run
<div id="out"></div>
<script>
  const dirty = '<b>muhim</b> <img src=x onerror="console.log(\'payload bajarildi\')"> <a href="javascript:alert(1)" onclick="alert(2)">havola</a>';
  // ZAIF: ishonchsiz HTML to'g'ridan-to'g'ri sink'ga
  document.getElementById("out").innerHTML = dirty;
  console.log(document.getElementById("out").innerHTML);
</script>
```

```text
<b>muhim</b> <img src="x" onerror="console.log('payload bajarildi')"> <a href="javascript:alert(1)" onclick="alert(2)">havola</a>
payload bajarildi
```

### 2. Hujum

Izoh maydoniga ruxsat etilgan `<b>` bilan birga ikkita yashirin element kiritildi: `<img onerror>` (rasm yuklanmaganda kod ishlaydi) va `javascript:` havolasi `onclick` bilan. Natijada konsolda "payload bajarildi" chiqdi: izoh muallifi kodi dispetcher brauzerida ishladi. Hujumchi `<script>` ishlatmadi, shuning uchun `<script>` ni o'chiradigan har qanday filtr ham o'tkazib yuborar edi.

### 3. Tuzatilgan kod

`<template>` ichida satr inert tahlil qilinadi (rasm yuklanmaydi, hodisa ishlamaydi). Daraxt allowlist bilan aylanib chiqiladi va natija satrga qaytarilmasdan, DOM fragment sifatida qo'yiladi:

```html run
<div id="out"></div>
<script>
  const ALLOWED = new Set(["B", "I", "EM", "STRONG", "P", "BR", "UL", "OL", "LI", "A"]);
  const URL_OK = new Set(["http:", "https:", "mailto:"]);

  function urlOk(v) {
    try { return URL_OK.has(new URL(v, "https://platforma.example").protocol); } catch { return false; }
  }

  function sanitizeNode(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType !== Node.ELEMENT_NODE || !ALLOWED.has(child.tagName)) {
        child.replaceWith(document.createTextNode(child.textContent ?? "")); // ruxsatsiz element: faqat matn qoladi
        continue;
      }
      for (const attr of [...child.attributes]) {
        const keep = child.tagName === "A" && attr.name === "href" && urlOk(attr.value);
        if (!keep) child.removeAttribute(attr.name);
      }
      sanitizeNode(child);
    }
  }

  function sanitizeToFragment(dirty) {
    const t = document.createElement("template"); // inert: resurs yuklanmaydi, hodisa ishlamaydi
    t.innerHTML = dirty;
    sanitizeNode(t.content);
    return t.content;
  }

  const dirty = '<b>muhim</b> <img src=x onerror="console.log(\'payload bajarildi\')"> <a href="javascript:alert(1)" onclick="alert(2)">havola</a><script>alert(3)<\/script>';
  const out = document.getElementById("out");
  out.replaceChildren(sanitizeToFragment(dirty));
  console.log(out.innerHTML);
  console.log("img:", out.querySelectorAll("img").length, "script:", out.querySelectorAll("script").length);
</script>
```

```text
<b>muhim</b>  <a>havola</a>alert(3)
img: 0 script: 0
```

### Tuzatish nima uchun yetarli

Invariant: sahifaga faqat allowlist'dagi sakkiz element va `a` uchun tekshirilgan `href` tushadi. Ko'rsatilgan hujumlar yopildi: `<img onerror>` olib tashlandi (rasm elementi ruxsat etilmagan), `javascript:` href va `onclick` o'chirildi (havola matni qoldi), `<script>` matnga aylandi (`alert(3)` endi oddiy matn). Daraxt satrga qaytarilmasdan to'g'ridan-to'g'ri qo'yilgani uchun serializatsiya va qayta tahlil bosqichi yo'q, mXSS shu yo'l bilan kamayadi.

Yopilmagan narsalar: bu kod o'quv namunasi. U brauzer parser xususiyatlari (namespace aralashmalari, murakkab ichma-ich tuzilmalar) bo'yicha test qilinmagan va production uchun yetarli deb hisoblanmasin. Production'da DOMPurify kabi doimiy tekshiriladigan va yangilanadigan kutubxona ishlatiladi. Natija ikkinchi qatlam bilan (CSP, Trusted Types) birga himoyalansin. Stil va `<a>` havolalari bilan bog'liq masalalar (phishing, `rel`) ham alohida e'tibor talab qiladi.

## Qachon qo'llamaslik kerak

- Foydalanuvchi HTML kiritishi shart bo'lmasa, sanitization kerak emas: matnni kodlang (32-dars). Sanitizer murakkab komponent va doimiy yangilanish yukini qo'shadi (KISS).
- Markdown kerak bo'lsa, ko'pincha xavfsizroq yo'l: xom HTML o'chirilgan Markdown renderer, undan keyin ham sanitizer. Bu ikki qatlam bir-birini almashtirmaydi.
- Trusted Types kichik, bir-ikki sink'li ilovada ortiqcha bo'lishi mumkin: ko'p uchinchi tomon kodi bor loyihada esa u katta ish. Qo'shimcha: majburlashni yoqishdan oldin hisobot rejimida o'lchang, aks holda ishlayotgan funksiyalar buzilishi mumkin.
- Bitta kuchli sanitizer sozlamasi hamma kontekst uchun mos emas. Elektron pochta HTML'i, hisobot PDF'i va chat xabari uchun allowlist turlicha.
- Sanitizer bazaga yozishdan oldin emas, ko'rsatishdan oldin chaqiriladi, shunda sanitizer yangilanganda eski yozuvlar ham yangi qoidalar bilan tozalanadi. Faqat yozishdan oldin tozalash eski bypass'lardan himoya qilmaydi.
- Policy ichida sanitizer o'rniga `createHTML: (s) => s` yozmang; bu Trusted Types'ni formal qiladi, himoya bermaydi.

## Stack'da: DOMPurify, React va Next.js

React/Next.js'da HTML kiritish `dangerouslySetInnerHTML` orqali bo'ladi (33-dars). Ikki qatlam: sanitizer va Trusted Types policy. Quyidagi kod ishga tushirilmaydi (React va DOMPurify brauzer worker'ida yo'q), faqat sintaksis jihatidan tekshirilgan.

```tsx
import DOMPurify from "dompurify";

// Minimal allowlist: kerakli teglar va atributlar
const CONFIG = {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a"],
  ALLOWED_ATTR: ["href"],
};

export function sanitizeComment(dirty: string): string {
  return DOMPurify.sanitize(dirty, CONFIG);
}

export function Comment({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: sanitizeComment(html) }} />;
}
```

Server-renderda DOMPurify uchun DOM muhiti kerak (Node'da jsdom kabi qatlam); ko'p loyihalar sanitizeni klient tomonida yoki alohida paket orqali bajaradi. Sozlamani va ishlatilish usulini kutubxona hujjatidan tekshiring. Trusted Types uchun Next.js'da CSP sarlavhasi `require-trusted-types-for 'script'` bilan sozlanadi (35-dars), policy nomlari esa klient kodingizda bir joyda ro'yxatga olinadi. DOMPurify Trusted Types bilan ishlash opsiyalariga ega ekanini hujjatdan tekshiring (bu dars uni tekshirmagan).

Amaliy tavsiyalar: sanitizerni ko'rsatish joyida chaqiring; sozlamani bitta fayldagi bitta funksiyada saqlang (DRY); lint qoidasi bilan `dangerouslySetInnerHTML` faqat shu funksiyadan keladigan qiymatlar bilan ishlatilishini tekshiring; kutubxona yangilanishini `npm audit` va dependabot (81-dars) bilan kuzating.

## Xulosa

- HTML kiritish kerak bo'lganda kodlash formatni o'chiradi, regex xavfsiz emas: ishonchli sanitizer (allowlist, brauzer parseri asosida) ishlatiladi.
- Mutation XSS: sanitizer ko'rgan daraxt bilan qayta tahlil qilingan daraxt farq qilishi mumkin; kutubxonani yangilab turing va iloji bo'lsa natijani satrsiz DOM sifatida qo'ying.
- Trusted Types xavfli sink'larga satr yozishni brauzer darajasida taqiqlaydi va auditni policy funksiyalariga qisqartiradi; xavfsiz kodni kafolatlamaydi va `(s) => s` policy bo'sh qatlam.
- Joriy qilish: avval hisobot rejimida (Report-Only), keyin majburlash; qo'llab-quvvatlash va uchinchi tomon kutubxonalarini hisobga oling.
- Oddiy matn uchun sanitization kerak emas; sanitizerni ko'rsatish joyida chaqiring va allowlist'ni minimal saqlang.
