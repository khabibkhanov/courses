---
n: 39
slug: postmessage-iframe
title: "postMessage va iframe orasidagi aloqa"
summary: "Cross-origin hujjatlar orasidagi yagona rasmiy aloqa kanali postMessage: targetOrigin, event.origin va event.source tekshiruvi, xabar ma'lumotini kod emas, ma'lumot sifatida qayta ishlash, sandbox iframe'larda origin 'null' bo'lishi va tuzoqlari."
duration: 40
sources:
  - id: whatwg-html
    note: "HTML Standard: cross-origin obyektlar va window.postMessage; bu dars aniq bo'lim raqamlarini keltirmaydi va xatti-harakatni lokal Chromium'da sinab ko'rishga tayanadi"
  - id: mdn-sop
    note: "MDN Same-origin policy: ikki origin hujjatlari orasida aloqa uchun window.postMessage ishlatilishi va cross-origin Window obyektiga cheklangan kirish"
  - id: cs-xss
    note: "XSS cheat sheet: DOM-based XSS manbalari va xavfsiz sink'lar haqida umumiy mazmun"
  - id: cs-html5
    note: "OWASP HTML5 Security Cheat Sheet: postMessage qoidalari (targetOrigin, origin tekshiruvi, data validatsiyasi, kod sifatida baholamaslik) va iframe sandbox atributi"
quiz:
  - q: "Sahifa iframe'ga maxfiy ma'lumot yuboradi: `frame.contentWindow.postMessage(token, '*')`. Nima uchun bu xavfli?"
    options:
      - "'*' xabarni sekinlashtiradi"
      - "Iframe navigatsiya qilib boshqa origin'ga o'tgan bo'lsa (redirect yoki almashtirish), xabar ham o'sha origin'ga yetadi"
      - "Brauzer '*' ni taqiqlaydi"
      - "Faqat HTTP sahifalarda xavfli"
    answer: 1
    explain: "targetOrigin xabar qaysi origin'dagi oynaga yetishi mumkinligini cheklaydi. '*' qabul qiluvchi origin'i o'zgarsa ham xabarni yuboraveradi. Cheat sheet kutilgan origin'ni aniq ko'rsatishni (va '*' ni ishlatmaslikni) tavsiya qiladi."
  - q: "Qabul qiluvchi: `if (e.origin.indexOf('.alfa.example') !== -1) handle(e.data)`. Qaysi origin bu tekshiruvdan o'tadi?"
    options:
      - "`https://portal.alfa.example.evil.com` ham"
      - "Faqat `https://portal.alfa.example`"
      - "Hech qaysi"
      - "Faqat `http://alfa.example`"
    answer: 0
    explain: "indexOf/includes matn qismini qidiradi, domen chegarasini emas: `portal.alfa.example.evil.com` ham shu qismni o'z ichiga oladi. OWASP cheat sheet aynan shunday namunani xavfli deb ko'rsatadi. To'g'risi: origin'ni kutilgan to'liq qiymatlar to'plami bilan aniq tenglik bo'yicha solishtirish."
  - q: "Handler: `panel.innerHTML = e.data.html` (origin to'g'ri tekshirilgan). Qo'shimcha nima kerak?"
    options:
      - "Hech narsa: origin tekshirilgan"
      - "Faqat HTTPS ishlatish"
      - "Ma'lumotni kod emas, matn sifatida ishlatish (`textContent`) va tuzilmasini tekshirish: jo'natuvchi sahifada XSS bo'lsa, hujumchi istalgan xabar yuboradi"
      - "Faqat xabarni JSON.stringify qilish"
    answer: 2
    explain: "Cheat sheet: jo'natuvchi sahifadagi bitta XSS hujumchiga istalgan formatdagi xabarni yuborish imkonini beradi, shuning uchun data ham tekshiriladi va faqat ma'lumot sifatida ishlatiladi; innerHTML o'rniga textContent. Origin tekshiruvi jo'natuvchi kimligini tasdiqlaydi, xabar mazmunini emas."
  - q: "`<iframe sandbox=\"allow-scripts\" ...>` ichidan kelgan xabarda `e.origin` qanday bo'ladi va qabul qiluvchi qanday tekshirishi kerak?"
    options:
      - "Iframe src'idagi origin; origin tekshirish yetarli"
      - "Bo'sh satr"
      - "Sandbox'li iframe xabar yubora olmaydi"
      - "`\"null\"` (noyob/opaque origin); `e.source === frame.contentWindow` bilan manbani tekshirish kerak, 'null' ni allowlist'ga qo'shish esa har qanday sandbox'li hujjatni qabul qiladi"
    answer: 3
    explain: "Sandbox atributi hujjatni noyob origin'ga o'tkazadi (cheat sheet: markup unique origin sifatida qaraladi); bu origin xabarda 'null' deb ko'rinadi, va barcha sandbox'li hujjatlar uchun bir xil. Shu sababli 'null' ga ishonib bo'lmaydi; e.source ni o'zingiz yaratgan iframe'ning contentWindow'iga solishtiring (mazkur xatti-harakat lokal Chromium'da sinab ko'rilgan)."
  - q: "Ishonchsiz kontent uchun iframe'ga `sandbox=\"allow-scripts allow-same-origin\"` berildi va iframe sizning origin'ingizdan yuklanadi. Nima uchun bu sandbox deyarli ma'nosiz?"
    options:
      - "Ikkala flag birga ishlamaydi"
      - "Iframe skripti o'z origin'idagi hujjat sifatida sahifa elementlariga va DOM'ga kirib, sandbox atributini olib tashlashi mumkin: ikkala ruxsat birgalikda cheklovni bekor qiladi"
      - "allow-scripts faqat HTML uchun"
      - "Brauzer bunday atributni e'tiborsiz qoldiradi"
    answer: 1
    explain: "Same-origin hujjat skripti ota sahifaga to'liq kira oladi, shu jumladan iframe elementining sandbox atributini o'zgartira oladi. Bu yaxshi ma'lum ogohlantirish (ushbu dars uni lokal korpusdagi manbalar bilan tasdiqlamagan, shuning uchun hujjatni o'zingiz o'qib chiqing). Ishonchsiz kontent alohida origin'da ham bo'lishi kerak."
  - q: "Qabul qiluvchi `e.data` ni `eval(e.data.code)` qiladi, lekin origin allowlist'ga tekshiradi. Bu nima?"
    options:
      - "Origin'ga ishonish zaiflikni yo'q qilmaydi: bu eval sink, jo'natuvchi buzilsa yoki tekshiruv xato bo'lsa to'g'ridan-to'g'ri kod bajariladi; xabar faqat ma'lumot (buyruq nomi allowlist'dan) bo'lishi kerak"
      - "Xavfsiz dizayn"
      - "Faqat Firefox'da ishlaydi"
      - "Faqat sandbox bo'lsa xavfli"
    answer: 0
    explain: "Cheat sheet: xabarni hech qachon kod sifatida baholamang (eval) yoki DOM'ga (innerHTML) qo'ymang. Protokol tuzilmasi aniq bo'lsin: ruxsat etilgan `type` qiymatlari va har biri uchun tekshiriladigan maydonlar."
task:
  title: "Xabarni qabul qilish: origin, tuzilma va ma'lumot"
  prompt: |
    Vidjet iframe'i `{ type: "mashina-nomi", name: "..." }` ko'rinishidagi xabar yuboradi, ota sahifa nomni panelda ko'rsatadi. `acceptMessage(evt, ctx)` hozir hamma xabarni qabul qiladi va nomni xom holda qaytaradi.

    Vazifa: funksiyani yozing. (1) `evt.origin` `ctx.allowedOrigins` ichida aniq bo'lishi kerak (`"null"` hech qachon ruxsat etilmaydi). (2) `evt.source === ctx.frameWindow` bo'lishi kerak. (3) `evt.data` oddiy obyekt, `type === "mashina-nomi"`, `name` satr va uzunligi 1..60. (4) Natija: HTML-escape qilingan nom (panelga `innerHTML` bilan qo'yilsa ham xavfsiz bo'lishi uchun) yoki `null`. Tekshiruvlardan birortasi bajarilmasa `null`.
  lang: ts
  starter: |
    type Evt = { origin: string; source: unknown; data: unknown };
    type Ctx = { allowedOrigins: Set<string>; frameWindow: unknown };

    function acceptMessage(evt: Evt, ctx: Ctx): string | null {
      return String((evt.data as any).name); // TUZATING
    }

    const frame = { id: "vidjet-oynasi" };
    const other = { id: "begona-oyna" };
    const ctx: Ctx = { allowedOrigins: new Set(["https://vidjet.alfa.example"]), frameWindow: frame };
    const ok = { type: "mashina-nomi", name: "KAMAZ <7>" };

    console.log("to'g'ri xabar:", acceptMessage({ origin: "https://vidjet.alfa.example", source: frame, data: ok }, ctx));
    console.log("begona origin:", acceptMessage({ origin: "https://vidjet.alfa.example.evil.com", source: frame, data: ok }, ctx));
    console.log("null origin:", acceptMessage({ origin: "null", source: frame, data: ok }, ctx));
    console.log("begona oyna:", acceptMessage({ origin: "https://vidjet.alfa.example", source: other, data: ok }, ctx));
    console.log("noto'g'ri tur:", acceptMessage({ origin: "https://vidjet.alfa.example", source: frame, data: { type: "eval", name: "x" } }, ctx));
    console.log("uzun nom:", acceptMessage({ origin: "https://vidjet.alfa.example", source: frame, data: { type: "mashina-nomi", name: "a".repeat(61) } }, ctx));
    console.log("satr emas:", acceptMessage({ origin: "https://vidjet.alfa.example", source: frame, data: "salom" }, ctx));
  solution: |
    type Evt = { origin: string; source: unknown; data: unknown };
    type Ctx = { allowedOrigins: Set<string>; frameWindow: unknown };

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

    function acceptMessage(evt: Evt, ctx: Ctx): string | null {
      if (evt.origin === "null" || !ctx.allowedOrigins.has(evt.origin)) return null;
      if (evt.source !== ctx.frameWindow) return null;
      const d = evt.data;
      if (typeof d !== "object" || d === null || Array.isArray(d)) return null;
      const m = d as Record<string, unknown>;
      if (m.type !== "mashina-nomi") return null;
      if (typeof m.name !== "string" || m.name.length < 1 || m.name.length > 60) return null;
      return esc(m.name);
    }

    const frame = { id: "vidjet-oynasi" };
    const other = { id: "begona-oyna" };
    const ctx: Ctx = { allowedOrigins: new Set(["https://vidjet.alfa.example"]), frameWindow: frame };
    const ok = { type: "mashina-nomi", name: "KAMAZ <7>" };

    console.log("to'g'ri xabar:", acceptMessage({ origin: "https://vidjet.alfa.example", source: frame, data: ok }, ctx));
    console.log("begona origin:", acceptMessage({ origin: "https://vidjet.alfa.example.evil.com", source: frame, data: ok }, ctx));
    console.log("null origin:", acceptMessage({ origin: "null", source: frame, data: ok }, ctx));
    console.log("begona oyna:", acceptMessage({ origin: "https://vidjet.alfa.example", source: other, data: ok }, ctx));
    console.log("noto'g'ri tur:", acceptMessage({ origin: "https://vidjet.alfa.example", source: frame, data: { type: "eval", name: "x" } }, ctx));
    console.log("uzun nom:", acceptMessage({ origin: "https://vidjet.alfa.example", source: frame, data: { type: "mashina-nomi", name: "a".repeat(61) } }, ctx));
    console.log("satr emas:", acceptMessage({ origin: "https://vidjet.alfa.example", source: frame, data: "salom" }, ctx));
  solutionNotes: |
    - Origin allowlist to'plamida aniq tenglik (`Set.has`), `indexOf` yoki `endsWith` emas; `"null"` alohida rad etiladi, chunki har qanday sandbox'li hujjat shu origin bilan keladi.
    - `source` tekshiruvi xabar aynan o'zimiz yaratgan iframe oynasidan kelganini tasdiqlaydi. Origin va source ikkalasi kerak: origin kimligini, source qaysi oyna ekanini aytadi.
    - Ma'lumot tuzilmasi allowlist bilan tekshiriladi (`type`, `name` turi va uzunligi). Noma'lum maydonlar e'tiborsiz qoladi, buyruq nomi ro'yxatdan bo'ladi.
    - Natija escape qilinadi, shuning uchun panelga `innerHTML` bilan qo'yilsa ham xavfsiz; yaxshisi baribir `textContent` ishlatish.
    - Bu funksiya qabul tomonini yopadi. Yuboruvchi tomonda `targetOrigin` aniq ko'rsatilishi alohida talab; handshake'dan keyin MessageChannel port'i orqali davom etish ham mumkin.
  checklist:
    - "Origin aniq tenglik bilan tekshiriladi, `\"null\"` ruxsat etilmaydi"
    - "`source` o'zimiz yaratgan iframe oynasi bilan solishtiriladi"
    - "Ma'lumot tuzilmasi va uzunligi tekshiriladi"
    - "Natija escape qilinadi (yoki textContent bilan ishlatiladi)"
    - "Origin tekshiruvi mazmun xavfsizligini kafolatlamasligini ayta olasiz"
---

## Muammo

Mijoz kabinetiga hamkor kompaniyaning vidjeti iframe sifatida o'rnatilgan: u mashina nomini tanlash menyusini ko'rsatadi, tanlov kabinetning ota sahifasiga xabar sifatida uzatiladi. Same-origin policy (12-dars) ikki origin hujjatlarining bir-biriga kirishini ataylab cheklaydi, shuning uchun `iframe.contentWindow.document` ga kirib bo'lmaydi. MDN same-origin policy sahifasi cross-origin hujjatlar orasida aloqa kerak bo'lsa `window.postMessage` ishlatilishini yozadi. Demak postMessage origin devorida ochilgan rasmiy teshik, va uning xavfsizligi butunlay ikki tomonning tekshiruvlariga bog'liq.

Odatiy xatolar: xabarni `"*"` targetOrigin bilan yuborish; qabul qiluvchi tomonda `event.origin` ni umuman tekshirmaslik yoki `indexOf` bilan tekshirish; kelgan ma'lumotni `innerHTML` ga yoki `eval` ga uzatish. Har biri o'zining zaifligini beradi: birinchisi ma'lumot oqishini, ikkinchisi begona sayt xabar yuborishini, uchinchisi DOM-based XSS (31-dars) ni. Xabar kanali kodlash va validatsiya qoidalarini bekor qilmaydi: ular hali ham ishonchsiz kirish.

Ikkinchi mavzu iframe'ning o'zi: ishonchsiz kontentni sahifaga joylashtirish kerak bo'lganda `sandbox` atributi qanday ishlaydi va nima uchun uni noto'g'ri sozlash uni ma'nosiz qiladi. Dars ikki mavzuni birlashtiradi, chunki real tizimlarda ular birga uchraydi.

## Asosiy g'oya

OWASP HTML5 Security Cheat Sheet postMessage bo'yicha aniq qoidalarni beradi. Yuboruvchi tomonda: xabarni jo'natishda kutilgan origin'ni ikkinchi argument sifatida aniq yozing, `*` emas; aks holda redirect yoki boshqa yo'l bilan oyna origin'i o'zgarsa, xabar noma'lum origin'ga ketadi. Qabul qiluvchi tomonda doim: (1) jo'natuvchi `origin` atributini tekshirib, ma'lumot kutilgan joydan kelayotganini tasdiqlash; (2) `data` atributi ustida kirish validatsiyasini bajarish, formati kutilganiga mosligini tekshirish.

Cheat sheet ikkita muhim eslatma qo'shadi. Birinchisi, `data` ustidan nazoratingiz bor deb o'ylamang: jo'natuvchi sahifadagi bitta XSS hujumchiga istalgan formatdagi xabarni yuborish imkonini beradi. Ikkinchisi, ikkala sahifa ham xabarlarni faqat ma'lumot sifatida qayta ishlashi kerak: ularni `eval()` bilan kod sifatida baholamang va `innerHTML` bilan DOM'ga qo'ymang, chunki bu DOM-based XSS yaratadi; `element.textContent = data` xavfsizroq variant. Origin tekshirishda FQDN'ni aniq moslashtirish kerak. Cheat sheet `message.origin.indexOf(".owasp.org") != -1` kodini juda xavfsiz emas deb ataydi, chunki `owasp.org.attacker.com` ham mos keladi.

Eslatma: bu dars cheat sheet va MDN SOP sahifasining lokal nusxalariga solishtirilgan. HTML Standard (postMessage algoritmi) lokal korpusda yo'q va undan to'g'ridan-to'g'ri da'vo olinmagan; `event.origin` va sandbox bilan bog'liq xatti-harakatlar esa lokal Chromium'da sinab ko'rildi.

## Chuqurroq: nozik holatlar

### event.origin, event.source va event.data

`event.origin` brauzer tomonidan qo'yiladi, jo'natuvchi sahifa uni soxtalashtira olmaydi: u xabar yuborgan hujjatning origin'ini aytadi. Lekin bu shu origin'ga ishonish mumkin degani emas. `event.source` xabar kelgan oynaning o'zi (WindowProxy): u origin tekshiruvini to'ldiradi, chunki bir origin'dan bir nechta oyna va iframe bo'lishi mumkin. `event.data` esa jo'natuvchi nazoratidagi qiymat, doim ishonchsiz. Shuning uchun uchta tekshiruv: origin allowlist, source kutilgan oyna, data tuzilma allowlist.

### Origin allowlist va xom solishtirish

Origin'ni to'plam bilan aniq tenglik orqali solishtiring: `ALLOWED.has(e.origin)`. `indexOf`, `includes`, `endsWith`, `startsWith` va regex'ni `.` ni escape qilmasdan ishlatish xato (38-darsdagi URL tekshiruvlari bilan bir xil sabab). Sxemani ham hisobga oling: `http://portal.alfa.example` va `https://portal.alfa.example` turli origin'lar. Wildcard subdomen (`*.alfa.example`) subdomen egallab olinganda hujumchiga yo'l ochadi.

### Sandbox iframe va origin "null"

Cheat sheet `sandbox` atributi yoqilganda hujjat noyob (unique) origin'dan deb hisoblanishini, formalar va skriptlar o'chirilishini, havolalar boshqa browsing context'larni nishonga ololmasligini, avtomatik ishga tushadigan xususiyatlar va plaginlar bloklanishini yozadi. `allow-scripts` kabi qiymatlar bilan alohida imkoniyatlarni qaytarish mumkin. Bu darsni yozishda Chromium'da sinab ko'rilgan: `sandbox="allow-scripts"` iframe'dan yuborilgan xabarda `event.origin` qiymati `"null"` satri bo'ladi, `event.source` esa iframe'ning `contentWindow` obyektiga teng. Natija ikki muhim qoidani beradi. Birinchi, sandbox'li hujjatni origin bo'yicha ajratib bo'lmaydi: `"null"` ni allowlist'ga qo'shsangiz, har qanday sandbox'li hujjat (hujumchining ham) qabul qilinadi. Ikkinchi, bunday iframe'dan xabarni `event.source === frame.contentWindow` bilan tekshirish kerak, chunki aynan siz yaratgan iframe ekanini manba tasdiqlaydi.

`allow-same-origin` ni `allow-scripts` bilan birga ishonchsiz kontent uchun bermang: iframe sizning origin'ingizdan yuklansa, uning skripti ota sahifaga kirib, o'z sandbox cheklovlarini olib tashlay oladi. Bu yaxshi ma'lum xavf, lekin lokal korpusdagi manbalarda aniq matn sifatida tasdiqlanmagan, shu sababli HTML Standard hujjatidagi `sandbox` atributi bo'limini o'zingiz o'qib chiqing. Cheat sheet qo'shimcha ogohlantirish beradi: `sandbox` eski brauzerlarda e'tiborsiz qoldiriladi, shuning uchun uni qo'shimcha himoya qatlami sifatida ishlating yoki brauzer qo'llab-quvvatlashini tekshirib, shundan keyingina ishonchsiz kontentni ko'rsating.

### Protokol dizayni

Xabarlar tuzilmasini oldindan belgilang: `type` maydoni ruxsat etilgan qiymatlardan biri, har tur uchun aniq maydonlar va chegaralar (uzunlik, diapazon). Handler `switch (data.type)` bilan faqat ma'lum turlarni qayta ishlasin, noma'lum turni jim rad etsin. Buyruq sifatida funksiya nomi yoki kod yubormang. Sezgir amallar (masalan, "mashinani bloklash") postMessage orqali kelsa, ularni ham serverda avtorizatsiya tekshiruvidan o'tkazing: ota sahifadagi handler UI qatlami, ruxsat tekshiruvi serverda (51-dars).

### MessageChannel va uzun suhbat

Ikki taraf ko'p xabar almashsa, handshake bosqichida `MessageChannel` yaratib, bitta port'ni yuborish mumkin: keyingi xabarlar faqat shu port orqali ketadi va umumiy `window.onmessage` kanali ochiq qolmaydi. Handshake xabarini baribir origin va source bilan tekshirish kerak. Bu texnika ixtiyoriy; oddiy holatda to'g'ri tekshirilgan `message` handler yetarli.

## Misol: vidjet va panel

Misol brauzer sandbox'ida ishlaydi (`html run`): "vidjet" bu o'quv sahifasining ichidagi `srcdoc` iframe va u ota panelga xabar yuboradi. Hammasi lokal; real tizim yo'q. Haqiqiy brauzerda sinash uchun vidjet `sandbox="allow-scripts"` ostida, shuning uchun origin `"null"` bo'ladi (yuqorida ta'riflangan xatti-harakat).

### 1. Zaif kod

Ota sahifa hech narsani tekshirmaydi va xabarni `innerHTML` ga yozadi. Vidjet (yoki unga aylangan hujumchi) panelga HTML yuboradi:

```html run
<div id="panel"></div>
<iframe id="vidjet" sandbox="allow-scripts" srcdoc="<script>
  parent.postMessage({ type: 'mashina-nomi', name: '<img src=x onerror=&quot;console.log(String.fromCharCode(80)+1)&quot;>' }, '*');
</script>"></iframe>
<script>
  // ZAIF: origin ham, source ham, tuzilma ham tekshirilmaydi; innerHTML sink
  window.addEventListener("message", (e) => {
    console.log("origin:", JSON.stringify(e.origin));
    document.getElementById("panel").innerHTML = e.data.name;
  });
</script>
```

```text
origin: "null"
P1
```

### 2. Hujum

Vidjet yuborgan "mashina nomi" aslida `<img onerror=...>`. Handler uni `innerHTML` ga yozdi va `onerror` kodi (`P1` ni konsolga yozuvchi zararsiz o'quv kodi) ota sahifa origin'ida ishladi. Haqiqiy hujumda bu joyda dispetcher sessiyasi nomidan so'rovlar bo'lardi. Handler origin'ni umuman tekshirmagani uchun xabarni istalgan oyna yuborishi mumkin edi: sahifani `window.open` bilan ochgan boshqa sayt ham, sahifaga joylashtirilgan boshqa iframe ham.

### 3. Tuzatilgan kod

Ikkita iframe: biri o'zimiz yaratgan vidjet, ikkinchisi begona (tasodifan yoki hujumchi tomonidan joylashtirilgan). Handler faqat birinchisining xabarini, faqat to'g'ri tuzilma bilan qabul qiladi va matn sifatida ko'rsatadi. Sandbox'li iframe origin'i `"null"` bo'lgani uchun asosiy tekshiruv `event.source`:

```html run
<div id="panel"></div>
<iframe id="vidjet" sandbox="allow-scripts" srcdoc="<script>
  parent.postMessage({ type: 'mashina-nomi', name: 'KAMAZ <7>' }, '*');
</script>"></iframe>
<iframe id="begona" sandbox="allow-scripts" srcdoc="<script>
  setTimeout(() => parent.postMessage({ type: 'mashina-nomi', name: '<img src=x onerror=&quot;console.log(String.fromCharCode(80)+1)&quot;>' }, '*'), 150);
</script>"></iframe>
<script>
  const vidjet = document.getElementById("vidjet");
  const panel = document.getElementById("panel");

  function accept(e) {
    if (e.source !== vidjet.contentWindow) return null;               // faqat o'zimiz yaratgan oyna
    const d = e.data;
    if (typeof d !== "object" || d === null || d.type !== "mashina-nomi") return null;
    if (typeof d.name !== "string" || d.name.length < 1 || d.name.length > 60) return null;
    return d.name;
  }

  window.addEventListener("message", (e) => {
    const name = accept(e);
    if (name === null) { console.log("rad etildi"); return; }
    panel.textContent = name;                                          // kod emas, matn
    console.log("qabul qilindi:", panel.textContent, "| img soni:", panel.querySelectorAll("img").length);
  });
</script>
```

```text
qabul qilindi: KAMAZ <7> | img soni: 0
rad etildi
```

### Tuzatish nima uchun yetarli

Invariant: panelga faqat o'zimiz yaratgan iframe'dan kelgan, tuzilmasi allowlist'ga mos xabar tushadi va u matn sifatida ko'rsatiladi. Ko'rsatilgan hujum ikki qatlam bilan yopildi: begona oynadan kelgan payload `source` tekshiruvidan o'tmadi ("rad etildi"), va hatto tekshiruvdan o'tgan holatda ham `textContent` HTML'ni tahlil qilmaydi (`<7>` matn bo'lib ko'rindi). Yuboruvchi tomonda `'*'` ishlatildi, chunki bu misolda xabarda maxfiy ma'lumot yo'q va sandbox'li qabul qiluvchi origin'i `"null"`; maxfiy ma'lumot yuboriladigan joyda aniq origin ko'rsatiladi.

Yopilmagan narsalar: (1) vidjetning o'zi buzilsa, `source` tekshiruvi o'tadi, shuning uchun mazmun validatsiyasi (uzunlik, tur) va textContent kerak edi; (2) mazmun xavfsiz bo'lsa ham mantiqiy ishonch masalasi qoladi: vidjet yolg'on mashina nomi yuborishi mumkin; (3) xabar orqali kelgan amal buyrug'ini serverda avtorizatsiya qilish kerak; (4) real sahifada origin allowlist (agar iframe sandbox'siz bo'lsa) ham qo'shiladi; (5) misol yagona brauzerda (Chromium) lokal sinab ko'rilgan.

## Qachon qo'llamaslik kerak

- Bir xil origin'dagi hujjatlar orasida postMessage ortiqcha bo'lishi mumkin: oddiy funksiya chaqiruvi yoki `BroadcastChannel` soddaroq. Lekin ular ham xabar mazmunini tekshirishdan ozod qilmaydi.
- Maxfiy ma'lumot (token, sessiya) postMessage orqali uzatish odatda yomon dizayn: iframe'ga token berish o'rniga qisqa muddatli, tor ruxsatli maxsus token yoki server tomonidagi tasdiq ishlating. Agar baribir kerak bo'lsa, `targetOrigin` ni aniq yozing.
- `sandbox` har kontent uchun mos emas: to'liq funksional uchinchi tomon vidjeti `allow-same-origin`, `allow-forms` va boshqalarni talab qilishi mumkin; shunda sandbox deyarli cheklovsiz bo'lib qoladi. Bunday vidjetni alohida origin'ga (boshqa domen) joylashtiring, sandbox'ga emas.
- Origin allowlist bilan `source` tekshiruvi ba'zan ortiqcha, ba'zan zarur. Bitta origin'dan faqat bitta iframe bo'lsa, origin tekshiruvi yetarli; sandbox'li (origin `"null"`) iframe uchun esa `source` yagona ishonchli belgi.
- postMessage himoyasi iframe'ni begona sayt frame qilishidan himoya qilmaydi: bu 37-darsdagi frame-ancestors masalasi.
- `window.opener` va `window.open` orqali ochilgan oynalar bilan aloqada ham xuddi shu qoidalar amal qiladi. Alohida `rel="noopener"` masalasi bu darsdan tashqarida.

## Stack'da: React va Next.js

React komponentida `message` listener'ini effect ichida qo'shib, tozalash funksiyasida olib tashlang. Origin allowlist'ni konfiguratsiyadan oling va holatni to'g'ridan-to'g'ri `useState` ga yozing (JSX matnni o'zi kodlaydi, 33-dars). Quyidagi kod ishga tushirilmaydi (React brauzer worker'ida yo'q), faqat sintaksis jihatidan tekshirilgan:

```tsx
import { useEffect, useRef, useState } from "react";

const ALLOWED_ORIGINS = new Set(["https://vidjet.alfa.example"]);

export function VehiclePicker() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== frameRef.current?.contentWindow) return;
      if (!ALLOWED_ORIGINS.has(e.origin)) return;
      const d = e.data as { type?: unknown; name?: unknown } | null;
      if (!d || d.type !== "mashina-nomi") return;
      if (typeof d.name !== "string" || d.name.length < 1 || d.name.length > 60) return;
      setName(d.name); // JSX matn sifatida chiqaradi
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div>
      <iframe ref={frameRef} src="https://vidjet.alfa.example/tanlash" title="Mashina tanlash" />
      <p>Tanlangan: {name ?? "-"}</p>
    </div>
  );
}
```

Bu yerda iframe sandbox'siz va alohida origin'dan yuklanadi, shuning uchun origin aniq tekshiriladi. Next.js'da bunday vidjet manbasi CSP `frame-src` va (vidjet tomonda) `frame-ancestors` bilan birga cheklanadi (35 va 37-darslar). Server Component ichida listener bo'lmaydi: bu faqat Client Component'da. Ishonchsiz HTML kontent ko'rsatish uchun `sandbox` ishlatilsa, `allow-scripts` bilan `allow-same-origin` ni birga bermang. iframe'ga `title` berish accessibility uchun kerak, xavfsizlik uchun emas.

## Xulosa

- postMessage cross-origin hujjatlar orasidagi rasmiy kanal; uning xavfsizligi yuboruvchi va qabul qiluvchining tekshiruvlariga bog'liq.
- Yuborishda `targetOrigin` ni aniq yozing (`*` emas); qabul qilishda `event.origin` ni to'plam bilan aniq tenglik bo'yicha va `event.source` ni kutilgan oyna bilan tekshiring.
- `indexOf`, `includes` va regex bilan origin tekshirish buziladi (`owasp.org.attacker.com` misoli).
- `event.data` doim ishonchsiz: tuzilma va chegaralarni tekshiring, `eval` va `innerHTML` ga bermang, `textContent` ishlating.
- `sandbox` iframe'da origin `"null"` bo'ladi: uni allowlist'ga qo'shmang, manbani `event.source` bilan tekshiring; `allow-scripts` va `allow-same-origin` birga ishonchsiz kontent uchun sandbox'ni ma'nosiz qiladi.
- Xabar orqali kelgan amalni serverda avtorizatsiya qiling va qoldiq risklarni (buzilgan vidjet, mantiqiy ishonch) yozib qo'ying.
