---
n: 31
slug: xss-turlari
title: "XSS turlari: reflected, stored va DOM-based"
summary: "Cross-site scripting mexanizmi: foydalanuvchi kiritgan matn brauzerda kod sifatida talqin qilinishi, uch tur (reflected, stored, DOM-based), har birining manbasi va sink'i, hamda tuzatish nega kontekstga bog'liq."
duration: 45
sources:
  - id: cs-xss
    note: "Umumiy mazmun: XSS turlari va himoya kontekstga mos chiqish kodlashiga tayanishi; bo'lim raqamlari keltirilmaydi"
  - id: t10-a05
    note: "XSS OWASP Top 10:2025 da Injection (A05) oilasi ichida ko'riladi"
  - id: cwe-top25
    note: "CWE ro'yxatidagi XSS weakness turi (aniq o'rin dars matnida berilmaydi)"
quiz:
  - q: "Qidiruv sahifasi `?q=` qiymatini javob HTML'iga kodlamasdan qo'yadi. Hujumchi yuborgan havolani ochgan boshqa foydalanuvchi akkauntida skript ishlaydi. Bu qaysi tur?"
    options:
      - "Stored XSS: payload bazada saqlanadi"
      - "Reflected XSS: payload so'rovdan to'g'ridan-to'g'ri javobga qaytadi"
      - "DOM-based XSS: server umuman qatnashmaydi"
      - "CSRF: so'rov foydalanuvchi nomidan yuboriladi"
    answer: 1
    explain: "Payload so'rov parametrida keladi va server uni shu javobning o'zida qaytaradi: bu reflected. Stored bo'lsa, payload avval saqlanib, keyin boshqalarga ko'rsatiladi. DOM-based'da zaiflik klient kodida, CSRF esa umuman boshqa hujum."
  - q: "Dispetcher haydovchi izohlarini ko'radi. Haydovchi izohga `<img src=x onerror=...>` yozdi, u bazada saqlandi va dispetcher sahifasini ochganda ishladi. Nima uchun bu odatda reflected'dan xavfliroq?"
    options:
      - "Payload har safar yangi havola yuborishni talab qiladi"
      - "Stored payload faqat hujumchining o'z brauzerida ishlaydi"
      - "Qurbon hujumchi havolasini bosishi shart emas: oddiy sahifani ochishning o'zi yetadi"
      - "Stored XSS CSP bilan to'sib bo'lmaydi"
    answer: 2
    explain: "Stored'da qurbon maxsus havolani bosmaydi, shunchaki zararlangan ma'lumot ko'rsatilgan sahifani ochadi va ko'pincha yuqori huquqli (dispetcher, admin) foydalanuvchi bo'ladi. Boshqa variantlar noto'g'ri: payload bir marta yoziladi, qurbonlarning brauzerida ishlaydi va CSP chuqur himoya sifatida stored'ga ham qo'llanadi."
  - q: "Klient kodi: `el.innerHTML = new URLSearchParams(location.search).get('name')`. Server javobida payload hech qayerda ko'rinmaydi. Zaiflik turi va sink nima?"
    options:
      - "Reflected; sink - server shabloni"
      - "Stored; sink - URLSearchParams"
      - "Bu zaiflik emas, chunki server javobi toza"
      - "DOM-based; source - location.search, sink - innerHTML"
    answer: 3
    explain: "Ma'lumot brauzer ichida URL'dan (source) o'qilib, to'g'ridan-to'g'ri HTML sifatida talqin qiluvchi sink'ga (innerHTML) yoziladi. Server javobini tekshirish bu zaiflikni topmaydi, chunki payload hech qachon serverga HTML sifatida yetmaydi."
  - q: "Jamoa XSS'ni `<script>` so'zini kirishdan o'chirib tuzatmoqchi. Qaysi hujum bunday filtrni baribir o'tadi?"
    options:
      - "`<img src=x onerror=...>`: skript tegisiz ham kod bajaradi"
      - "Faqat katta-kichik harf aralash `<ScRiPt>` (boshqasi yo'q)"
      - "Hech qaysi: `<script>` yo'q bo'lsa kod ishlamaydi"
      - "Faqat `javascript:` sxemasi, tag emas"
    answer: 0
    explain: "HTML'da kod bajaruvchi joylar ko'p: voqea atributlari (onerror, onload), javascript: URL'lar va boshqalar. Qora ro'yxat bir shaklni o'chiradi, boshqasi qoladi. Himoya kiritishni emas, chiqishni kontekst bo'yicha kodlashda."
  - q: "Reflected XSS tuzatishi sifatida kirish maydonida `<` va `>` belgilari rad etildi (validatsiya). Nega bu yetarli emas?"
    options:
      - "Validatsiya umuman ishlamaydi"
      - "Brauzer `<` belgisini baribir qabul qiladi"
      - "Qiymat atribut ichida (`value=\"...\"`) chiqsa, `<` va `>` siz ham tirnoqdan chiqib `onfocus=` qo'shish mumkin"
      - "Faqat POST so'rovlar xavfli"
    answer: 2
    explain: "Xavfli belgilar to'plami chiqish kontekstiga bog'liq: atribut ichida tirnoq yetarli. Kirish validatsiyasi foydali qo'shimcha qatlam, lekin asosiy tuzatish chiqish nuqtasida kontekstga mos kodlash (32-dars)."
  - q: "Platformada haydovchi ismi HTML sahifaga, JSON API javobiga va Excel eksportiga chiqadi. Qaysi yondashuv to'g'ri?"
    options:
      - "Har chiqish joyida o'sha kontekstga mos kodlash"
      - "Ismni bazaga yozishdan oldin bir marta HTML-escape qilish"
      - "Ismni faqat harflarga cheklash va kodlashni unutish"
      - "Faqat klientda kodlash, serverda hech narsa qilmaslik"
    answer: 0
    explain: "Bir marta saqlashdan oldingi escape ma'lumotni buzadi (JSON va eksportda `&lt;` ko'rinadi) va boshqa kontekstlar uchun yetarli emas. Kodlash ma'lumot ishlatiladigan joyda, o'sha kontekst qoidasi bilan bajariladi."
task:
  title: "Qidiruv va izoh sahifasi: reflected va stored XSS'ni yoping"
  prompt: |
    Dispetcher paneli ikki joyda satrni HTML'ga qo'shadi: `renderSearch(q)` qidiruv natijasi sarlavhasi va `renderComment(author, text)` mashina izohi. Ikkalasi ham kiritishni kodlamasdan qo'yadi.

    Vazifa: `escapeHtml` funksiyasini yozing (`&`, `<`, `>`, `"`, `'` belgilarini mos HTML entity'lariga almashtiradi) va ikkala render funksiyasida foydalaning. `&` birinchi almashtirilishi kerak, aks holda ikki marta kodlash yuz beradi. Dastlabki uch `console.log` quyidagini chiqarsin: oddiy qidiruv o'zgarishsiz, ikkala hujum payload'i esa `<` belgisiz (kodlangan) holda chiqsin.
  lang: ts
  starter: |
    function escapeHtml(s: string): string {
      return s; // TUZATING
    }

    function renderSearch(q: string): string {
      return `<h2>Natijalar: ${q}</h2>`;
    }

    function renderComment(author: string, text: string): string {
      return `<li><b>${author}</b>: ${text}</li>`;
    }

    const attack1 = `<script>alert(1)</script>`;
    const attack2 = `x" onfocus="alert(1)`;

    console.log(renderSearch("MAN-123"));
    console.log(renderSearch(attack1));
    console.log(renderComment(attack2, attack1));
    console.log("hujum belgisi qoldi:", renderSearch(attack1).includes("<script>"));
  solution: |
    function escapeHtml(s: string): string {
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function renderSearch(q: string): string {
      return `<h2>Natijalar: ${escapeHtml(q)}</h2>`;
    }

    function renderComment(author: string, text: string): string {
      return `<li><b>${escapeHtml(author)}</b>: ${escapeHtml(text)}</li>`;
    }

    const attack1 = `<script>alert(1)</script>`;
    const attack2 = `x" onfocus="alert(1)`;

    console.log(renderSearch("MAN-123"));
    console.log(renderSearch(attack1));
    console.log(renderComment(attack2, attack1));
    console.log("hujum belgisi qoldi:", renderSearch(attack1).includes("<script>"));
  solutionNotes: |
    - `&` birinchi almashtiriladi: keyin qo'shiladigan `&lt;` dagi `&` qayta kodlanmaydi. Tartib teskari bo'lsa, `<` avval `&lt;` ga, keyin `&amp;lt;` ga aylanadi va foydalanuvchi buzuq matn ko'radi.
    - Tirnoqlar ham kodlanadi, shuning uchun funksiya atribut qiymati ichida ham ishlaydi (`attack2` shuni tekshiradi).
    - Bu funksiya faqat HTML matn va tirnoqli atribut konteksti uchun. `<script>` ichi, URL atributlari (`href`) va CSS uchun boshqa qoida kerak (32-dars).
    - Tuzatish chiqish nuqtasida bajariladi; ma'lumot bazada o'zgarmay saqlanadi, shuning uchun JSON yoki eksportga chiqarishda boshqa kodlash ishlatish mumkin.
    - Bu qatlam yagona himoya emas: CSP (35-dars) va Trusted Types (34-dars) xatoga qarshi qo'shimcha to'siq.
  checklist:
    - "`escapeHtml` besh belgini almashtiradi va `&` birinchi turadi"
    - "Ikkala render funksiyasi kiritishni escape qiladi"
    - "Oddiy qidiruv matni o'zgarmay chiqadi"
    - "Ikkala payload'da xom `<script>` va tirnoqdan chiqish yo'q"
    - "Funksiya qaysi kontekstlar uchun yetarli emasligini ayta olasiz"
---

## Muammo

Dispetcher paneli haydovchining izohini ko'rsatadi: "yo'lda tiqilinch, 20 daqiqa kechikaman". Boshqa kuni haydovchi izoh maydoniga HTML tegi yozadi va dispetcher sahifani ochgach, uning brauzerida haydovchi yozgan kod ishlaydi. Kod dispetcher sessiyasi nomidan har qanday so'rov yubora oladi: boshqa mashinalar joylashuvini o'qiydi, hisobotni o'zgartiradi, yangi foydalanuvchi qo'shadi. Haydovchi tizimga hech qachon kirmagan "admin" huquqiga bu yo'l bilan erishdi.

Bu cross-site scripting (XSS). Sabab oddiy: ilova foydalanuvchi bergan matnni HTML sahifaga qo'yadi, brauzer esa matn bilan markupni farqlay olmaydi. Brauzer uchun sahifa bitta uzun satr, `<` belgisidan keyin tag boshlanadi. Server "bu ma'lumot" deb o'ylagan qism brauzerda "bu kod" bo'lib chiqadi. Bu 21-darsda ko'rgan ma'lumot va kod chegarasining buzilishi, faqat tarjimon sifatida SQL emas, brauzerning HTML parser'i va JavaScript engine'i turibdi.

XSS xavfliligining sababi, skript sahifa origin'ida ishlashida (12-dars). Same-origin policy skriptni sahifa bilan bir xil huquqlar bilan ishlatadi: DOM'ni o'qiydi va o'zgartiradi, cookie'ning `HttpOnly` bo'lmagan qismini ko'radi, foydalanuvchi nomidan `fetch` qiladi. `HttpOnly` cookie'ni o'qib bo'lmasligi sessiyani o'g'irlashni qiyinlashtiradi, lekin hujumchi o'g'irlamasdan ham sessiya ichida harakat qila oladi. Shuning uchun "cookie'm HttpOnly" XSS'ga javob emas.

## Asosiy g'oya

OWASP Top 10:2025 XSS'ni A05 Injection toifasi ichida ko'radi, chunki mexanizm bir xil: ishonchsiz kirish interpreter'ga kod sifatida yetib boradi. Toifa tavsifida XSS "yuqori chastota, past ta'sir" deb belgilangan va CWE-79 (Improper Neutralization of Input During Web Page Generation) bo'yicha 30 mingdan ortiq CVE sanalgan; aynan shu ko'plik toifaning o'rtacha og'irlashtirilgan ta'sirini pasaytiradi. Ya'ni XSS tez-tez uchraydi, lekin har bir alohida holat SQL injection kabi butun bazani ochmasligi mumkin. CWE ro'yxatida ham XSS alohida weakness turi.

Har XSS ikki nuqtadan iborat: source (ishonchsiz ma'lumot kirib keladigan joy) va sink (ma'lumot kod sifatida talqin qilinadigan joy). Source: so'rov parametri, URL fragment, form maydoni, bazadagi maydon, uchinchi tomon API javobi, `postMessage` xabari. Sink: HTML shablon ichiga qo'yish, `innerHTML`, `document.write`, voqea atributi, `eval`, `javascript:` URL. Zaiflik source'dan sink'ka kodlamasdan yoki tozalamasdan yetib boradigan yo'lda yotadi. Uch tur shu yo'lning qayerdan o'tishiga qarab ajratiladi.

### Reflected XSS

Payload so'rovda keladi va server uni shu javobning o'zida qaytaradi. Qidiruv, xato sahifasi, "siz kiritdingiz: ..." matni klassik joylar. Hujumchi qurbonga payload ichiga joylangan havolani yuboradi (xat, messenger, boshqa saytdagi havola). Qurbon bosadi, server payload'ni sahifaga qo'shadi, brauzer bajaradi. Payload hujumchida emas, havola ichida yashaydi, shuning uchun har qurbonga alohida havola kerak va hujum qurbonning harakatiga bog'liq.

### Stored XSS

Payload avval saqlanadi (baza, fayl, kesh), keyin boshqa foydalanuvchilarga ko'rsatiladi. Izoh, mashina nomi, haydovchi ismi, qo'llab-quvvatlash chati, import qilingan CSV qatori, hatto telemetriya qurilmasi yuborgan matnli maydon ham manba bo'lishi mumkin. Stored odatda xavfliroq, chunki qurbon hech narsa bosmaydi: oddiy sahifani ochish yetadi, qurbon esa ko'pincha yuqori huquqli foydalanuvchi (dispetcher, admin). Bir yozuv ko'p kishiga zarar qiladi va hujumchi qurbon bilan umuman aloqa qilmaydi.

### DOM-based XSS

Zaiflik server kodida emas, klient JavaScript'ida. Source ham, sink ham brauzer ichida: masalan `location.hash` o'qilib `innerHTML` ga yoziladi. Server hech qachon payload'ni HTML sifatida ko'rmaydi, ayniqsa payload URL fragment (`#...`) ichida bo'lsa, u serverga umuman yuborilmaydi. Shuning uchun server tomonidagi test, WAF yoki javob skaneri uni topmaydi. Single-page ilovalar bu turga ko'proq moyil, chunki ular ma'lumotni ko'p manipulyatsiya qiladi. Reflected va stored DOM-based bo'lishi ham mumkin: server payload'ni JSON'da qaytaradi, klient uni `innerHTML` bilan qo'yadi. Tur ma'lumot qayerdan kelganini emas, qaysi qatlam uni kod qilib yuborganini bildiradi.

## Chuqurroq: nima uchun filtrlash ishlamaydi

### HTML'da kod bajaradigan joylar ko'p

"`<script>` so'zini o'chiramiz" degan tuzatish bir shaklni yopadi. Sahifada `<img src=x onerror=...>`, `<svg onload=...>`, `<a href="javascript:...">`, `<input onfocus=... autofocus>` va boshqa ko'plab shakllar bor. Parser xatolarni kechiradi: noto'g'ri yopilgan tag, tirnoqsiz atribut, qo'shimcha bo'shliq hammasi baribir tahlil qilinadi. Qora ro'yxat (taqiqlangan so'zlar) hujumchining ixtiyoridagi tillar qatoriga yetmaydi. Ishonchli yo'l: nimalar xavfli ekanini sanash o'rniga, ma'lumot hech qachon markup sifatida talqin qilinmasligini ta'minlash. Ya'ni kontekstga mos chiqish kodlashi.

### Kontekst hal qiladi

Bir xil qiymat sahifaning turli joyiga chiqadi va har joyda turli belgilar xavfli:

| Chiqish joyi | Nima xavfli | Misol |
|---|---|---|
| HTML matn | `<`, `&` | `<h2>${x}</h2>` |
| Tirnoqli atribut qiymati | tirnoq belgisi | `<input value="${x}">` |
| Tirnoqsiz atribut | bo'shliq va boshqa belgilar | `<input value=${x}>` |
| `<script>` ichi | satrdan chiqish, `</script>` | `var a = '${x}'` |
| URL atributi | `javascript:` sxemasi | `<a href="${x}">` |

`<` va `>` ni rad etuvchi validatsiya atribut kontekstida yordam bermaydi: `x" onfocus="alert(1)` da bu belgilar yo'q, lekin tirnoq bor. Aksincha, tirnoqni kodlovchi funksiya `<script>` ichidagi satr kontekstida yetarli bo'lmasligi mumkin. Shuning uchun kodlash kontekst bo'yicha tanlanadi, bu keyingi dars (32-dars) mavzusi.

### Saqlashdan oldin emas, chiqishda

Keng tarqalgan xato: ma'lumotni bazaga yozishdan oldin bir marta HTML-escape qilish. Muammolar bir nechta. Ma'lumot boshqa kontekstga chiqsa (JSON API, PDF, Excel eksporti, bildirishnoma), `&lt;` kabi chiqindi ko'rinadi yoki, undan yomoni, kontekst boshqa bo'lgani uchun himoya ishlamaydi. Ma'lumot ikki marta kodlanishi mumkin. Va eng muhimi: bazaga boshqa yo'l bilan (import, boshqa servis, eski ma'lumot) tushgan qiymat escape qilinmagan bo'ladi. Shuning uchun ma'lumot asl holida saqlanadi, kodlash esa har chiqish nuqtasida o'sha kontekst qoidasi bilan bajariladi.

### Xavfsizlik chegarasi sink'da

Himoyani source'da emas, sink'da quring. Source ko'p (har maydon, har API, har integratsiya) va ro'yxati doim o'zgaradi, sink esa nisbatan oz va nazorat qilish mumkin. Amaliy qoida: sink'ning "xavfsiz" varianti bor joyda uni ishlating (`textContent`, `setAttribute` bilan atribut, framework'ning avtomatik kodlashi), "xavfli" variantlar (`innerHTML`, `dangerouslySetInnerHTML`, `document.write`, `eval`) esa kod review'da alohida e'tibor oladi (33-dars).

### Qamrov: bitta unutilgan joy yetadi

Cheat Sheet XSS himoyasining asosiy xususiyatini qamrov deb ataydi: ilova 99 joyni himoya qilib, bittasini o'tkazib yuborsa, baribir zaif. Shuning uchun u "qaysi ma'lumot ishonchsiz" degan savolga to'g'ri javob berishga tayanmaydi. Ko'p framework har bir qiymatni, ishonchli yoki ishonchsiz bo'lishidan qat'i nazar, standart bo'yicha escape qiladi va bu yondashuv tavsiya etiladi, chunki "bu qiymat toza" degan qarorni dasturchi emas, mexanizm qabul qiladi. Aksincha, qo'lda yig'ilgan shablon satri har joyda qarorni dasturchidan kutadi. Avtopark platformasida bu aniq ko'rinadi: mashina nomi bir sahifada tozalanadi, xarita popup'ida, eksport sahifasida va email shablonida esa unutiladi. Hujumchiga yagona unutilgan joy kifoya.

Xuddi shu sabab bilan framework escape hatch'lari alohida nazoratda turadi: React'ning `dangerouslySetInnerHTML`, Angular'ning `bypassSecurityTrustAs*` funksiyalari, Lit'ning `unsafeHTML`. Avtomatik kodlash faqat standart yo'lni qoplaydi; escape hatch ishlatilgan joyda himoya yana dasturchi qo'liga o'tadi.

### Xavfsiz va xavfli sink'lar

Cheat Sheet matn sifatida qaraladigan sink'larni sanaydi: `textContent`, `insertAdjacentText`, `className`, `setAttribute` (nomi qat'iy belgilangan bo'lsa), form maydonining `value` xossasi va `document.createTextNode`. Ular qiymatni hech qachon bajarmaydi. Ikki nozik joy bor. Birinchisi: `textContent` qiymatni HTML-kodlamaydi, u shunchaki matn tuguni yaratadi, shuning uchun unga oldindan `escapeHtml` qilingan satrni bersangiz, foydalanuvchi `&lt;` ni ko'radi. Ikkinchisi: `setAttribute` atribut nomi hujumchi qo'lida bo'lsa xavfli, chunki `onerror` kabi voqea atributlari yoki `srcdoc` qiymatni kod yoki HTML sifatida talqin qiladi. `document.createElement` esa matn sink'i emas: uning argumenti element nomini tanlaydi, shuning uchun konstanta yoki allowlist kerak. Va `script` elementi keyin to'ldirilib hujjatga qo'shilsa, bajarilishi mumkin.

### Nima yetarli emas

Cheat Sheet'ning o'zi bitta texnika XSS'ni hal qilmasligini yozadi. Cookie atributlari (`HttpOnly`) ta'sirni cheklaydi, lekin kodning bajarilishiga to'sqinlik qilmaydi va sababni tuzatmaydi. CSP allowlist sifatida xato qilish oson bo'lgani uchun asosiy himoya emas, qo'shimcha qatlam bo'lishi kerak. WAF barcha XSS'ni ishonchli to'smaydi va brauzer ichida to'liq sodir bo'ladigan DOM-based hujumni umuman ko'rmasligi mumkin. Input validation kutilgan formatni majburlay oladi, lekin kodlash va xavfsiz API'ning o'rnini bosmaydi. Qatlamlar tartibi shunday: avval xavfsiz API va avtomatik kodlash, kerak bo'lsa kontekstga mos kodlash, boy matn uchun sanitizer, shundan keyingina CSP, Trusted Types va cookie atributlari qo'shimcha to'siq sifatida.

## Misol: qidiruv sarlavhasi va DOM sink

Misol faqat shu darsning o'quv kodiga qarshi: shablon satr qaytaradigan sodda render funksiyasi va brauzer sandbox'idagi kichik sahifa. Real tizimga hech narsa yuborilmaydi.

### 1. Zaif kod

Server tomonidagi funksiya satrni kodlamasdan shablonga qo'yadi:

```ts run
// ZAIF: q va izoh matni HTML'ga xom holda qo'shilyapti
function renderSearchWeak(q: string): string {
  return `<h2>Natijalar: ${q}</h2>`;
}
function renderCommentWeak(author: string, text: string): string {
  return `<li class="c"><b>${author}</b>: ${text}</li>`;
}

console.log(renderSearchWeak("MAN-123"));
console.log(renderSearchWeak("<img src=x onerror=alert(1)>"));
console.log(renderCommentWeak("haydovchi7", "<svg onload=alert(1)>"));
```

Klient tomonida DOM-based variant ham shunday. Pastdagi sahifa URL fragmentini (bu yerda o'zgaruvchi bilan almashtirilgan) `innerHTML` ga yozadi. `alert` o'rniga konsolga yozuv chiqaramiz, shunda ishlash isbotlanadi:

```html run
<div id="salom"></div>
<script>
  // Haqiqiy sahifada bu qiymat location.hash dan olinadi
  const fakeHash = "#<img src=x onerror=\"console.log('DOM XSS: payload bajarildi')\">";
  // ZAIF: source (hash) to'g'ridan-to'g'ri sink'ga (innerHTML) yetadi
  document.getElementById("salom").innerHTML = "Salom, " + fakeHash.slice(1);
</script>
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu XSS namunasi faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Birinchi blokda hujumchi `q` ga `<img src=x onerror=alert(1)>` yuboradi, ikkinchisida izoh matniga `<svg onload=alert(1)>`. Render funksiyasi bularni tag sifatida qaytaradi:

```text
<h2>Natijalar: MAN-123</h2>
<h2>Natijalar: <img src=x onerror=alert(1)></h2>
<li class="c"><b>haydovchi7</b>: <svg onload=alert(1)></li>
```

Ikkinchi qatorda `<img>` tegi haqiqiy tag: `src=x` yuklanmaydi, `onerror` ishga tushadi. Sahifa bloki natijasi:

```text
DOM XSS: payload bajarildi
```

Rasm manbasi mavjud emas, brauzer xatoni voqea sifatida ishga tushiradi va payload kodi bajariladi. Hujum uchun skript tegi shart emas edi.

### 3. Tuzatilgan kod

HTML matn va tirnoqli atribut konteksti uchun `escapeHtml` yetarli. DOM sink uchun esa `innerHTML` o'rniga `textContent`:

```ts run
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSearch(q: string): string {
  return `<h2>Natijalar: ${escapeHtml(q)}</h2>`;
}
function renderComment(author: string, text: string): string {
  return `<li class="c"><b>${escapeHtml(author)}</b>: ${escapeHtml(text)}</li>`;
}

console.log(renderSearch("MAN-123"));
console.log(renderSearch("<img src=x onerror=alert(1)>"));
console.log(renderComment("haydovchi7", "<svg onload=alert(1)>"));
console.log(renderComment('x" onfocus="alert(1)', "salom & xayr"));
```

```text
<h2>Natijalar: MAN-123</h2>
<h2>Natijalar: &lt;img src=x onerror=alert(1)&gt;</h2>
<li class="c"><b>haydovchi7</b>: &lt;svg onload=alert(1)&gt;</li>
<li class="c"><b>x&quot; onfocus=&quot;alert(1)</b>: salom &amp; xayr</li>
```

Klient tomonida:

```html run
<div id="salom"></div>
<script>
  const fakeHash = "#<img src=x onerror=\"console.log('DOM XSS: payload bajarildi')\">";
  // TUZATILGAN: textContent matnni markup sifatida tahlil qilmaydi
  document.getElementById("salom").textContent = "Salom, " + fakeHash.slice(1);
  console.log("ko'rsatilgan matn:", document.getElementById("salom").textContent);
  console.log("yaratilgan <img> soni:", document.querySelectorAll("img").length);
</script>
```

```text
ko'rsatilgan matn: Salom, <img src=x onerror="console.log('DOM XSS: payload bajarildi')">
yaratilgan <img> soni: 0
```

### Tuzatish nima uchun yetarli

Invariant: kiritilgan satr hech qachon markup sifatida tahlil qilinmaydi. `escapeHtml` `<`, `>`, `&` va tirnoqlarni entity'ga aylantiradi, parser ularni tag yoki atribut chegarasi emas, oddiy belgi deb o'qiydi. Qidiruv va izoh misollaridagi to'rt payload yopildi, shu jumladan atributdan tirnoq bilan chiqish. DOM varianti `textContent` bilan yopildi: ikkinchi chiqishda `<img>` tugunlari yaratilmagani ko'rinadi.

Yopilmagan narsalar: bu funksiya faqat HTML matn va tirnoqli atribut konteksti uchun to'g'ri. Qiymat `<script>` ichiga, `href` ga yoki `style` ga tushsa, boshqa qoida kerak (32-dars). Foydalanuvchi HTML kiritishi shart bo'lgan joylarda (boy matn muharriri) kodlash ishlamaydi va sanitization kerak (34-dars). Bundan tashqari, bitta chiqish joyida unutilgan escape zaiflikni qaytaradi, shuning uchun CSP (35-dars) qo'shimcha qatlam bo'lib turadi.

## Qachon qo'llamaslik kerak

`escapeHtml` va `textContent` oddiy matnni ko'rsatish uchun to'g'ri, lekin har holatda emas.

- Foydalanuvchi formatlangan matn kiritishi kerak bo'lsa (izohda qalin shrift, havola, ro'yxat), hamma narsani kodlash formatni o'chiradi. Bunday joyda ishonchli sanitizer yoki cheklangan markup tili (masalan, Markdown, keyin xavfsiz render) ishlatiladi (34-dars). O'zingiz regex bilan teglarni o'chirishga urinmang.
- Kodlashni bazaga yozishdan oldin qilish yaxshi g'oya emas (yuqorida ko'rdik). Istisno yo'q: ma'lumot asl holida saqlanadi.
- Kirish validatsiyasi (uzunlik, format, ruxsat etilgan belgilar) foydali, lekin XSS uchun asosiy himoya emas. Ism maydonidagi `O'Brien` yoki `<`, `&` ishlatadigan kompaniya nomi qonuniy kiritish bo'lishi mumkin. Validatsiya hujum yuzasini kamaytiradi, chiqish kodlash esa to'g'rilikni ta'minlaydi.
- Kodlash faqat HTML talqin qiluvchi sink uchun. Matnni JSON javobga qo'yayotgan bo'lsangiz, HTML-escape kerak emas (JSON serializer o'zi hal qiladi), uni klient `textContent` bilan ko'rsatsa yetarli.
- XSS bilan CSRF (36-dars) ni aralashtirmang: CSRF qurbon brauzeridan boshqa saytga so'rov yuboradi va hujumchi javobni ko'rmaydi, XSS esa hujumchi kodini sizning origin'ingizda ishlatadi.

## Stack'da: Express, React va Next.js

Node.js'da eng ko'p uchraydigan manba: shablon satrlari bilan HTML yig'ish. Express'da `res.send` ichiga `req.query.q` ni shablon satri bilan qo'yish klassik reflected XSS. Tuzatish: kodlashni avtomatik bajaradigan shablon engine (masalan EJS'da `<%= %>` kodlaydi, `<%- %>` esa xom chiqaradi, unga ehtiyot bo'ling) yoki React kabi avtomatik kodlovchi UI kutubxona.

```ts
import express from "express";

const app = express();

// ZAIF: qidiruv matni xom holda HTML'ga tushadi
app.get("/qidiruv", (req, res) => {
  res.send(`<h2>Natijalar: ${req.query.q}</h2>`);
});

// Yaxshiroq: Content-Type aniq va qiymat kodlanadi
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
app.get("/qidiruv2", (req, res) => {
  res.type("html").send(`<h2>Natijalar: ${esc(String(req.query.q ?? ""))}</h2>`);
});
```

Bu kod ishga tushirilmaydi (Express brauzer worker'ida yo'q), faqat sintaksis jihatidan to'g'ri. Eslatma: Express'ning standart query parser'i `?q[a]=1` kabi so'rovni obyektga aylantiradi, ya'ni `req.query.q` har doim satr emas, shuning uchun `String(...)` bilan turi aniqlanadi. React'da `{value}` ifodasi matn sifatida kodlanadi, shuning uchun xavf boshqa joyda: `dangerouslySetInnerHTML`, `href={userUrl}`, `ref` orqali `innerHTML`, server-render qilingan sahifaga `JSON.stringify` bilan ma'lumot joylash. Bular 33-darsda, Trusted Types 34-darsda, CSP 35-darsda ko'riladi.

## Xulosa

- XSS: ishonchsiz ma'lumot brauzerda kod sifatida talqin qilinadi. Skript sahifa origin'ida ishlagani uchun `HttpOnly` cookie ham to'liq himoya emas.
- Uch tur: reflected (payload so'rovdan javobga), stored (saqlanib, keyin boshqalarga) va DOM-based (source va sink brauzer ichida, server ko'rmaydi).
- Har XSS source'dan sink'ga boradigan yo'l: himoyani sink'da quring, xavfsiz sink variantlarini (`textContent`, avtomatik kodlash) afzal ko'ring.
- Qora ro'yxat filtri (`<script>` ni o'chirish) ishlamaydi; kodlash kontekstga bog'liq va ma'lumotni saqlashda emas, chiqarishda bajariladi.
- Tuzatishning nimani qoplashini yozib qo'ying: `escapeHtml` HTML matn va tirnoqli atribut uchun, skript, URL va CSS konteksti uchun alohida qoidalar kerak (32-dars).
