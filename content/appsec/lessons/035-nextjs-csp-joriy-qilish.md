---
n: 35
slug: nextjs-csp-joriy-qilish
title: "CSP'ni Next.js ilovasida joriy qilish"
summary: "Nonce asosidagi strict CSP: nega host allowlist ishlamaydi, nonce va 'strict-dynamic' qanday ishlaydi, Next.js'da so'rov bo'yicha nonce yaratish, dinamik render narxi, Report-Only orqali bosqichma-bosqich joriy qilish va policy'ni lint qilish."
duration: 45
sources:
  - id: nextjs-csp
    note: "Next.js CSP qo'llanmasi: Proxy (proxy.ts) ichida har so'rovga nonce yaratish va x-nonce sarlavhasi, nonce uchun dinamik render talabi (ISR o'chadi, PPR mos emas, CDN keshi cheklanadi), dev'da 'unsafe-eval', nonce'siz variant va eksperimental SRI alternativasi"
  - id: csp3
    note: "CSP Level 3: nonce kamida 128 bit, har javobda yangi, CSPRNG'dan bo'lishi (Nonce Reuse); nonce-source mavjud bo'lsa 'unsafe-inline' inline uchun hisobga olinmasligi; 'strict-dynamic' host/'self'/'unsafe-inline'ni e'tiborsiz qoldirib, parser-inserted bo'lmagan skriptlarga ruxsat berishi; dangling markup orqali nonce'ni ko'chirish; report-uri deprecated"
  - id: cs-csp
    note: "OWASP CSP Cheat Sheet: Strict CSP (nonce yoki hash, ixtiyoriy strict-dynamic) allowlist'dan afzal, nonce-based va hash-based strict policy namunalari, Report-Only va meta tag cheklovlari, report-to/report-uri, inline handler'larni addEventListener bilan almashtirish"
quiz:
  - q: "Policy: `script-src 'self' https://cdn.example.com 'unsafe-inline'`. Sahifada reflected XSS bor, hujumchi `<script>alert(1)</script>` kiritdi. Nima bo'ladi?"
    options:
      - "CSP skriptni to'sadi, chunki u CDN'dan emas"
      - "Brauzer ogohlantiradi, lekin bajaradi"
      - "Faqat Report-Only rejimida ishlaydi"
      - "Skript ishlaydi: 'unsafe-inline' inline skriptlarni ruxsat etadi"
    answer: 3
    explain: "'unsafe-inline' mavjud bo'lsa va nonce yoki hash yo'q bo'lsa, inline skriptlar ruxsat etiladi: bu XSS'ga qarshi CSP'ning asosiy qiymatini yo'qotadi. Nonce yoki hash bilan 'unsafe-inline' e'tiborsiz qoldiriladi (qo'llab-quvvatlovchi brauzerlarda)."
  - q: "Nonce asosidagi CSP'da nonce nega har so'rovda yangi bo'lishi shart?"
    options:
      - "Keshlash tezroq ishlashi uchun"
      - "Nonce taxmin qilinsa yoki qayta ishlatilsa, hujumchi uni o'z skript tegiga qo'yadi va CSP aylanib o'tiladi"
      - "Brauzer bir nonce'ni ikki marta qabul qilmaydi"
      - "Nonce shifrlash kaliti uchun kerak"
    answer: 1
    explain: "Nonce sirli bir martalik qiymat: faqat server javobdagi ruxsat etilgan skriptlarga qo'yadi. Doimiy yoki oldindan ma'lum nonce bilan hujumchi kiritgan `<script nonce=...>` ham ishlaydi. Shuning uchun yetarli tasodifiylikdagi (CSPRNG, 67-dars) yangi qiymat har javobda."
  - q: "`'strict-dynamic'` nima qiladi?"
    options:
      - "Host allowlist'ni kuchaytiradi"
      - "Hamma inline skriptlarni ruxsat etadi"
      - "Nonce yoki hash bilan ishonchli deb belgilangan skript yuklagan boshqa skriptlarga ishonadi, host/'self' ro'yxatlari esa e'tiborsiz qoladi"
      - "Faqat eval'ni taqiqlaydi"
    answer: 2
    explain: "'strict-dynamic' ishonchni nonce/hash orqali kelgan skriptdan u dinamik yuklaydigan skriptlarga o'tkazadi, shu sababli har bir CDN domenini ro'yxatlash kerak bo'lmaydi. Bu host-asosli ro'yxatlarni kerak qilmaydi va ularni e'tiborsiz qoldiradi."
  - q: "Nonce asosidagi CSP'ni Next.js'da yoqqach qaysi oqibat kutiladi?"
    options:
      - "Sahifalar har so'rovda nonce bilan render qilinishi kerak: statik optimizatsiya va to'liq CDN keshlash cheklanadi"
      - "Hech narsa o'zgarmaydi"
      - "Sahifalar faqat klientda render qilinadi"
      - "Next.js skriptlari ishlamay qoladi"
    answer: 0
    explain: "Nonce har javobda yangi bo'lgani uchun HTML so'rovga bog'liq bo'ladi va oldindan render qilingan statik sahifa unga mos kelmaydi. Next.js qo'llanmasi dinamik render talabini eslatadi. Bu trade-off: nonce o'rniga hash/SRI kabi statikaga mos yondashuvlar bor, lekin ularning o'z cheklovlari bor."
  - q: "Jamoa CSP'ni birdaniga enforce qilmoqchi. Ko'proq xavf nima?"
    options:
      - "Xavf yo'q"
      - "Qonuniy skriptlar (analitika, chat vidjet, kutubxonalar) to'silib, funksiyalar buzilishi; avval Report-Only rejimida o'lchash kerak"
      - "Brauzerlar CSP'ni e'tiborsiz qoldiradi"
      - "Faqat reklamalar buziladi"
    answer: 1
    explain: "Production'da bir sahifada ko'p qonuniy skript bor va ular ro'yxatda yo'q bo'lsa, ishlamay qoladi. Content-Security-Policy-Report-Only to'sib qo'ymasdan violation hisobotlarini beradi: policy'ni shu hisobotlar asosida tuzatib, keyin enforce qilinadi."
  - q: "Hujumchi sahifaga HTML kiritdi: `<base href=\"https://evil.example/\">`, undan keyin sahifada `<script nonce=\"...\" src=\"/app.js\">` nisbiy manzil bor. Qaysi direktiva shu hujumni yopadi?"
    options:
      - "`object-src 'none'`"
      - "`frame-ancestors 'none'`"
      - "`base-uri 'none'` (yoki 'self')"
      - "`img-src 'self'`"
    answer: 2
    explain: "<base> nisbiy URL'lar asosini o'zgartiradi, shu sababli nonce'li skript hujumchi serveridan yuklanishi mumkin. base-uri <base> tegi qaysi manzillarni ko'rsatishi mumkinligini cheklaydi. Boshqa direktivalar boshqa vektorlarni yopadi."
task:
  title: "Nonce asosidagi CSP quruvchi va tekshiruvchi"
  prompt: |
    `buildCsp(nonce, dev)` hozir `default-src *` qaytaradi, bu CSP'ni amalda o'chiradi. Siz strict policy yozing.

    Talablar: `default-src 'self'`; `script-src 'nonce-<nonce>' 'strict-dynamic'` (dev rejimda qo'shimcha `'unsafe-eval'`); `style-src 'self' 'unsafe-inline'`; `img-src 'self' data:`; `object-src 'none'`; `base-uri 'none'`; `form-action 'self'`; `frame-ancestors 'none'`. Direktivalar `"; "` bilan ajratiladi.

    Keyin `lintCsp(policy)` yozing: u `script-src` ichida `'unsafe-inline'` (nonce bilan birga bo'lmasa), `*`, yoki `data:` bo'lsa, shuningdek `object-src` yoki `base-uri` yo'q bo'lsa muammo matnini ro'yxatga qo'shadi. Yaxshi policy uchun ro'yxat bo'sh bo'lishi kerak.
  lang: ts
  starter: |
    function buildCsp(nonce: string, dev: boolean): string {
      return "default-src *"; // TUZATING
    }

    function lintCsp(policy: string): string[] {
      return []; // TUZATING
    }

    const good = buildCsp("abc123", false);
    console.log(good);
    console.log("dev eval:", buildCsp("abc123", true).includes("'unsafe-eval'"), "prod eval:", good.includes("'unsafe-eval'"));
    console.log("yaxshi policy muammolari:", lintCsp(good).length);
    console.log("zaif policy:", lintCsp("default-src 'self'; script-src 'self' 'unsafe-inline' *").length > 0);
    console.log("base-uri yo'q:", lintCsp("script-src 'nonce-x' 'strict-dynamic'; object-src 'none'").some((m) => m.includes("base-uri")));
  solution: |
    function buildCsp(nonce: string, dev: boolean): string {
      const script = ["'nonce-" + nonce + "'", "'strict-dynamic'"];
      if (dev) script.push("'unsafe-eval'");
      return [
        "default-src 'self'",
        "script-src " + script.join(" "),
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'self'",
        "frame-ancestors 'none'",
      ].join("; ");
    }

    function directive(policy: string, name: string): string[] | null {
      for (const part of policy.split(";")) {
        const [n, ...vals] = part.trim().split(/\s+/);
        if (n === name) return vals;
      }
      return null;
    }

    function lintCsp(policy: string): string[] {
      const problems: string[] = [];
      const script = directive(policy, "script-src");
      if (script) {
        const hasNonce = script.some((v) => v.startsWith("'nonce-") || v.startsWith("'sha256-"));
        if (script.includes("'unsafe-inline'") && !hasNonce) problems.push("script-src: 'unsafe-inline' nonce siz");
        if (script.includes("*")) problems.push("script-src: * keng");
        if (script.includes("data:")) problems.push("script-src: data: ruxsat etilgan");
      }
      if (!directive(policy, "object-src")) problems.push("object-src yo'q");
      if (!directive(policy, "base-uri")) problems.push("base-uri yo'q");
      return problems;
    }

    const good = buildCsp("abc123", false);
    console.log(good);
    console.log("dev eval:", buildCsp("abc123", true).includes("'unsafe-eval'"), "prod eval:", good.includes("'unsafe-eval'"));
    console.log("yaxshi policy muammolari:", lintCsp(good).length);
    console.log("zaif policy:", lintCsp("default-src 'self'; script-src 'self' 'unsafe-inline' *").length > 0);
    console.log("base-uri yo'q:", lintCsp("script-src 'nonce-x' 'strict-dynamic'; object-src 'none'").some((m) => m.includes("base-uri")));
  solutionNotes: |
    - Policy bitta joyda yig'iladi (massivdan `join`), shuning uchun nonce har chaqiruvda yangi qiymat bilan almashtiriladi va qo'lda satr yopishtirish xatosi kamayadi.
    - `'unsafe-eval'` faqat dev rejimida: development bundler'lari uni talab qilishi mumkin; production policy'ga kirmasligi kerak (test shuni tekshiradi).
    - `object-src 'none'` va `base-uri 'none'` `script-src` yopmaydigan vektorlarni yopadi (plagin kontenti, `<base>` bilan nisbiy manzilni almashtirish). `frame-ancestors` clickjacking uchun (37-dars).
    - `style-src` da `'unsafe-inline'` qoldirilgan: bu trade-off, inline stil atributlari bilan ishlovchi UI kutubxonalari uchun. Stil injection xavfi skript injection'dan past, lekin nolga teng emas; imkon bo'lsa nonce yoki hash qo'llang.
    - `lintCsp` sodda tekshiruvchi: u policy to'g'riligini isbotlamaydi, faqat keng tarqalgan xatolarni ushlaydi. Haqiqiy brauzerda yoki CSP evaluator vositasida sinash kerak.
  checklist:
    - "`script-src` nonce va `'strict-dynamic'` ishlatadi, `'unsafe-inline'` yo'q"
    - "`'unsafe-eval'` faqat dev rejimida"
    - "`object-src 'none'`, `base-uri 'none'` va `frame-ancestors 'none'` bor"
    - "`lintCsp` zaif policy'da muammo, yaxshisida bo'sh ro'yxat qaytaradi"
    - "Style-src trade-off'ini tushuntira olasiz"
---

## Muammo

Jamoa XSS'ga qarshi "CSP qo'shamiz" deb qaror qiladi va internetdan nusxa ko'chirilgan policy qo'yadi: `script-src 'self' https://cdn.example.com https://www.googletagmanager.com 'unsafe-inline'`. Sahifa ishlaydi, hisobotda "CSP yoqilgan" belgisi turadi. Lekin policy deyarli hech narsa to'smaydi: `'unsafe-inline'` hujumchi kiritgan `<script>` ni ruxsat etadi, ro'yxatdagi CDN'larning birida JSONP yoki eski kutubxona topilsa, hujumchi o'sha domen orqali o'z kodini ishlatadi. Bu "CSP bor, himoya yo'q" holati.

Ikkinchi og'riq teskarisi: to'g'ri, qattiq policy yoqildi, lekin birinchi deploydan keyin analitika, chat vidjet va ichki skriptlar to'silib qoldi va policy bir soatdan keyin o'chirildi. Ikkala holat ham policy'ni noto'g'ri joriy qilishdan: mexanizmni bilmaslik va bosqichsiz yoqish.

Bu dars strict CSP'ni Next.js'da joriy qilish yo'l xaritasi: nonce asosidagi policy nima uchun host allowlist'dan kuchli, Next.js'da nonce qanday yaratiladi va uning narxi nima, hamda Report-Only orqali xavfsiz joylashtirish. 34-darsdagi Trusted Types shu sarlavha orqali yoqiladi.

## Asosiy g'oya

Content Security Policy (CSP) javob sarlavhasi bo'lib, brauzerga sahifa qaysi manbalardan skript, stil, rasm va boshqa resurslarni yuklashi mumkinligini aytadi. W3C CSP Level 3 spetsifikatsiyasi mexanizmni belgilaydi. CSP XSS'ni tuzatmaydi: u zaiflik mavjud bo'lganda ham zararni cheklaydigan ikkinchi qatlam (chuqur himoya, 3-dars).

### Host allowlist nima uchun yetarli emas

Eski yondashuv: `script-src` ga ishonchli domenlarni sanab chiqish. Kamchiliklar: (1) ro'yxat uzun va doimiy yangilanadi; (2) ro'yxatdagi domen ichida hujumchiga skript yuklashga yo'l beradigan joy bo'lishi mumkin (JSONP endpoint, ochiq CDN'da boshqaning kutubxonasi, eski Angular kabi shablon kutubxonalari); (3) `'unsafe-inline'` kerak bo'lib qoladi, chunki inline skriptlar ishlatiladi. OWASP CSP cheat sheet allowlist zaifliklari bo'yicha tadqiqotga havola beradi va hozirgi yetakchi amaliyot sifatida Strict CSP'ni ko'rsatadi: uni joriy qilish osonroq va aylanib o'tish ehtimoli kamroq. Strict CSP nonce yoki hash mexanizmlaridan biriga tayanadi, `'strict-dynamic'` esa ixtiyoriy yordamchi.

### Nonce va hash

Nonce asosida server har javob uchun yangi tasodifiy qiymat yaratadi, uni CSP sarlavhasiga (`script-src 'nonce-R4nd0m'`) va ruxsat etilgan har `<script nonce="R4nd0m">` tegiga qo'yadi. Brauzer faqat shu nonce'li skriptlarni bajaradi. Hujumchi javobni oldindan bilmaydi, shuning uchun kiritgan `<script>` da nonce yo'q va CSP uni to'sadi. Talablar: CSP3 nonce har javobda noyob bo'lishini talab qiladi (MUST), uzunligi kodlashdan oldin kamida 128 bit va qiymat kriptografik xavfsiz tasodifiy generatordan (CSPRNG, 67-dars) olinishini tavsiya qiladi (SHOULD). Sababi: nonce direktivadagi boshqa cheklovlarni bekor qiladi, ya'ni uni topgan hujumchi xohlagan skriptni ishga tushiradi. Hash varianti: `script-src 'sha256-...'` aniq skript matnining xeshini beradi va statik sahifalarda ishlaydi, lekin Cheat Sheet ogohlantiradi: tag ichidagi har qanday o'zgarish, hatto bo'shliq (masalan kod formatlanishi), xeshni o'zgartiradi va skript ishlamay qoladi.

### 'strict-dynamic'

Nonce qo'yilgan skript boshqa skriptlarni dinamik yuklaydi (kutubxona, chunk). Ularning har birini ro'yxatlash o'rniga `'strict-dynamic'` ishonchni nonce/hash bilan kelgan skriptdan u yuklagan skriptlarga o'tkazadi, host va `'self'` ro'yxatlari esa e'tiborsiz qoladi. Bu zamonaviy bundler (Next.js) uchun muhim: chunk fayllar soni katta va ular dinamik yuklanadi.

Spetsifikatsiya aniq ikki ta'sirni beradi. Birinchisi: host-source, scheme-source, `'self'` va `'unsafe-inline'` skript yuklashda e'tiborsiz qoladi, nonce va hash esa hisobga olinadi. Ikkinchisi: parser-inserted bo'lmagan `<script>` elementlari (masalan `document.createElement('script')`) so'rovlari ruxsat etiladi. Spetsifikatsiya misolida nonce'li `script.js` ichidan `createElement` bilan yaratilgan `dependency.js` yuklanadi, `document.write` bilan yozilgan `sadness.js` esa yuklanmaydi, chunki `document.write` parser-inserted element hosil qiladi. Birinchi ta'sirdan orqaga moslik trick'i kelib chiqadi: `'unsafe-inline' https: 'nonce-...' 'strict-dynamic'` CSP1 brauzerida `'unsafe-inline' https:` kabi, CSP3 brauzerida esa `'nonce-...' 'strict-dynamic'` kabi ishlaydi. Xavfi ham aytilgan: runtime'da yaratiladigan skriptga ruxsat berilgani uchun, skript manzilini hujumchi boshqara olsa, policy ixtiyoriy skriptni yuklashga yo'l beradi. Skript joyini runtime'da aniqlaydigan framework va kodlarni audit qilish kerak.

### Nonce'ni ko'chirish: dangling markup

CSP3 nonce'ni hujumchidan sir saqlash kifoya emasligini ko'rsatadi. Agar ineksiya nuqtasi nonce'li `<script>` dan oldin tursa, hujumchi ochiq qoldirilgan teg kiritishi mumkin: `<script src='https://evil.example/x.js' ` kiritilsa, brauzer keyingi `<script nonce=abc src=/good.js>` ning atributlarini shu yangi elementga biriktiradi va nonce hujumchi skriptiga o'tib ketadi. Brauzerlar `<script` yoki `<style` satrini atribut nomi yoki qiymatida topsa nonce'ni bekor qiladi, lekin spetsifikatsiya bu himoyaning o'zi ham to'liq emasligini (takrorlangan atributlar parser tomonidan olib tashlanishi) ochiq yozadi. Amaliy xulosa: nonce'li skriptdan oldingi joyda ham chiqish kodlash (32-dars) majburiy, CSP uni almashtirmaydi.

### Qo'shimcha direktivalar

Strict `script-src` skript ijrosini cheklaydi, lekin boshqa vektorlar qoladi. Minimal to'plam: `object-src 'none'` (plagin kontenti), `base-uri 'none'` yoki `'self'` (`<base>` bilan nisbiy manzillarni hujumchi serveriga yo'naltirishni to'sadi), `form-action 'self'` (formani boshqa joyga yuborishni cheklaydi), `frame-ancestors 'none'` yoki `'self'` (sahifani boshqa sayt frame ichiga olishini cheklaydi, 37-dars). `default-src 'self'` qolgan resurslar uchun asos.

## Chuqurroq: Next.js'da joriy qilish

### Nonce yaratish va uzatish

Next.js qo'llanmasi nonce'ni so'rov bosqichida yaratib, ikki joyga yozishni tavsiflaydi: javob CSP sarlavhasiga va so'rov sarlavhasiga (masalan `x-nonce`), shunda server komponentlari uni o'qiy oladi va Next.js o'z skriptlariga qo'yadi. Tavsiflangan naqsh: Proxy (`proxy.ts` fayli; Next.js hujjatidagi joriy nom, eski versiyalarda `middleware`) sahifa render qilinishidan oldin ishlaydi va tasodifiy nonce yaratadi, policy satrini nonce bilan yig'adi va sarlavhalarni o'rnatadi. Quyidagi kod ishga tushirilmaydi (Next.js muhiti kerak), faqat sintaksis jihatidan tekshirilgan:

```ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  // CSPRNG'dan 16 bayt, har so'rovda yangi
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = btoa(String.fromCharCode(...bytes));
  const dev = process.env.NODE_ENV === "development";

  const csp = [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}
```

Komponentda nonce kerak bo'lsa (masalan, inline skript yoki `next/script`), u `headers()` orqali `x-nonce` sarlavhasidan o'qiladi. Development rejimida `'unsafe-eval'` kerak bo'ladi, chunki hujjatga ko'ra React debugging uchun `eval` ishlatadi; production'da u talab qilinmaydi. Muhim: nonce'ni JSX orqali klientga log yoki analitikaga yuborish kerak emas, u faqat o'sha javob uchun.

### Dinamik render narxi

Nonce har javobda o'zgargani uchun HTML so'rovga bog'liq bo'ladi. Next.js qo'llanmasi buni aniq yozadi: nonce ishlatilganda hamma sahifa dinamik render qilinishi kerak, statik optimizatsiya va ISR o'chadi, Partial Prerendering nonce'li CSP bilan mos kelmaydi, CDN'da oddiy keshlash bo'lmaydi va server xarajati oshadi. Sababi: Next.js nonce'ni server-side render paytida so'rovdagi CSP sarlavhasidan oladi, statik sahifa esa build vaqtida, sarlavhasiz yaratiladi. Bu haqiqiy trade-off. Alternativ: Next.js hujjatida eksperimental SRI (Subresource Integrity, 40-dars) asosidagi hash variant tasvirlangan: build vaqtida skript xeshlari hisoblanib, statik generatsiya saqlanadi. U eksperimental ekanini hisobga oling. Tanlov: ilovangizda xavfsizlik talabi qanchalik yuqori va keshlash qanchalik muhim.

### Bosqichma-bosqich joriy qilish: Report-Only

`Content-Security-Policy-Report-Only` sarlavhasi policy'ni to'sib qo'ymasdan faqat buzilishlarni hisobotlaydi (CSP3 mexanizmi). Tavsiya etilgan jarayon:

1. Strict policy'ni Report-Only rejimida yoqing va hisobot qabul qiluvchi endpoint (yoki hisobot xizmati) ulang. CSP3 `report-uri` ni deprecated deb belgilaydi va `report-to` ni tavsiya qiladi; Cheat Sheet orqaga moslik uchun ikkalasini birga yozishni maslahat beradi: `report-to`ni qo'llaydigan brauzer `report-uri`ni e'tiborsiz qoldiradi, eski brauzer unga qaytadi.
2. Hisobotlarni bir necha kun o'qing: qaysi skriptlar nonce'siz ishlayapti (analitika, vidjetlar, ichki inline skriptlar)? Har birini nonce'ga o'tkazing yoki olib tashlang.
3. Violation soni past bo'lgach, policy'ni enforce qiling (`Content-Security-Policy`). Report-Only'ni parallel qoldirib, keyingi o'zgarishlarni ham sinash mumkin.
4. Trusted Types (34-dars) uchun `require-trusted-types-for 'script'` ni ham avval Report-Only'da yoqing.

Cheat Sheet yana bir tartibni ko'rsatadi: ikkala sarlavhani bir vaqtda ishlatish mumkin, shuning uchun qattiq policy'ni Report-Only'da ushlab turib (ko'p hisobot olish uchun), enforce qilinadigan yumshoqroq policy bilan qonuniy funksiyalarni buzmaslik mumkin. Inline kod ham ko'chiriladi: inline `<script>` bloki alohida `.js` faylga, `onclick="doSomething()"` kabi inline handler esa `addEventListener` chaqiruviga o'tkaziladi, chunki CSP inline voqea handler'larini ham to'sadi. Eslatma: nonce'ni ta'minlash uchun barcha `<script>` teglariga nonce qo'shadigan o'rta qatlam yozmang; Cheat Sheet buni qat'iy man etadi, chunki hujumchi kiritgan skriptlar ham nonce oladi. Nonce faqat sizning shabloningiz yozgan teglarga qo'yilishi kerak.

### Policy'ni tekshirish

Qo'lda yozilgan policy xato bo'lishi oson: bitta `'unsafe-inline'` yoki `*` hamma narsani bekor qiladi. Policy'ni avtomatik lint qiling (quyidagi misol soddalashtirilgan variant) va brauzerda DevTools konsolida violation xabarlarini ko'ring. Policy meta teg orqali ham berilishi mumkin (header'ga kira olmaydigan statik CDN hostingda), lekin Cheat Sheet bu holda `frame-ancestors`, `sandbox` va hisobot endpoint'i ishlamasligini aytadi, shuning uchun imkon bo'lsa sarlavhadan foydalaning. Qo'lda sinash va WSTG tekshiruvlari (92-dars) lint'ni to'ldiradi.

## Misol: zaif va strict policy

Misol brauzersiz, sodda model: CSP satrini tahlil qilib, sahifadagi skript teglari ruxsat etiladimi yoki yo'qligini qo'pol baholaydi. U real brauzer algoritmining soddalashtirilgani (faqat `nonce`, `'unsafe-inline'`, `'self'` va host qoidalari); maqsad mexanizmni ko'rsatish. Hujum faqat shu o'quv modeliga qarshi.

### 1. Zaif kod

Host allowlist va `'unsafe-inline'` bilan policy:

```ts run
type ScriptTag = { inline: boolean; nonce?: string; src?: string };

function directive(policy: string, name: string): string[] {
  for (const part of policy.split(";")) {
    const [n, ...vals] = part.trim().split(/\s+/);
    if (n === name) return vals;
  }
  return [];
}

// Soddalashtirilgan model: brauzer algoritmining kichik qismi
function allowed(policy: string, tag: ScriptTag, pageNonce?: string): boolean {
  const src = directive(policy, "script-src");
  const hasNonceOrHash = src.some((v) => v.startsWith("'nonce-") || v.startsWith("'sha256-"));
  if (tag.inline) {
    if (tag.nonce && src.includes(`'nonce-${tag.nonce}'`)) return true;
    return src.includes("'unsafe-inline'") && !hasNonceOrHash; // nonce bor bo'lsa unsafe-inline e'tiborsiz
  }
  if (tag.nonce && src.includes(`'nonce-${tag.nonce}'`)) return true;
  if (src.includes("'strict-dynamic'")) return false; // faqat ishonchli skript yuklagan skriptlar (bu modelda yo'q)
  return src.some((v) => tag.src!.startsWith(v) || (v === "'self'" && tag.src!.startsWith("/")));
}

// ZAIF: host allowlist + 'unsafe-inline'
const weak = "default-src 'self'; script-src 'self' https://cdn.example.com 'unsafe-inline'";

const legit: ScriptTag = { inline: false, src: "/app.js" };
const injected: ScriptTag = { inline: true }; // XSS orqali kiritilgan <script>alert(1)</script>

console.log("zaif policy, o'z skripti:", allowed(weak, legit));
console.log("zaif policy, kiritilgan inline skript:", allowed(weak, injected));
```

### 2. Hujum

Hujumchi sahifaga reflected XSS orqali `<script>alert(1)</script>` kiritdi (31-dars). Policy'da `'unsafe-inline'` bor, shuning uchun CSP uni to'smaydi:

```text
zaif policy, o'z skripti: true
zaif policy, kiritilgan inline skript: true
```

Ikkinchi qator muhim: "CSP yoqilgan", lekin kiritilgan skript ishlaydi. Host ro'yxati ham yordam bermaydi: ro'yxatdagi `cdn.example.com` da hujumchi ishlata oladigan skript endpoint bo'lsa, u orqali ham o'tadi (bu holat modelda ko'rsatilmagan).

### 3. Tuzatilgan kod

Nonce va `'strict-dynamic'`. Model bir xil, faqat policy va sahifa nonce'i boshqa:

```ts run
type ScriptTag = { inline: boolean; nonce?: string; src?: string };

function directive(policy: string, name: string): string[] {
  for (const part of policy.split(";")) {
    const [n, ...vals] = part.trim().split(/\s+/);
    if (n === name) return vals;
  }
  return [];
}

function allowed(policy: string, tag: ScriptTag): boolean {
  const src = directive(policy, "script-src");
  const hasNonceOrHash = src.some((v) => v.startsWith("'nonce-") || v.startsWith("'sha256-"));
  if (tag.nonce && src.includes(`'nonce-${tag.nonce}'`)) return true;
  if (tag.inline) return src.includes("'unsafe-inline'") && !hasNonceOrHash;
  if (src.includes("'strict-dynamic'")) return false;
  return src.some((v) => tag.src!.startsWith(v) || (v === "'self'" && tag.src!.startsWith("/")));
}

function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic'`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
}

const nonce = "R4nd0mPerRequest"; // haqiqiy tizimda har javobda CSPRNG'dan yangi qiymat
const strict = buildCsp(nonce);
console.log(strict);

console.log("nonce'li o'z skripti:", allowed(strict, { inline: false, src: "/app.js", nonce }));
console.log("nonce'li inline skript:", allowed(strict, { inline: true, nonce }));
console.log("kiritilgan inline skript:", allowed(strict, { inline: true }));
console.log("kiritilgan, o'ylab topilgan nonce:", allowed(strict, { inline: true, nonce: "taxmin" }));
console.log("kiritilgan tashqi skript:", allowed(strict, { inline: false, src: "https://cdn.example.com/x.js" }));
```

```text
default-src 'self'; script-src 'nonce-R4nd0mPerRequest' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'
nonce'li o'z skripti: true
nonce'li inline skript: true
kiritilgan inline skript: false
kiritilgan, o'ylab topilgan nonce: false
kiritilgan tashqi skript: false
```

### Tuzatish nima uchun yetarli

Invariant: faqat serverning joriy javobi nonce'ini olib yuradigan skript bajariladi. Hujumchi nonce'ni bilmaydi (har javobda yangi), shuning uchun kiritilgan inline va tashqi skriptlar to'siladi. `'unsafe-inline'` yo'q, host ro'yxatlari e'tiborsiz qoladi (`'strict-dynamic'`), `base-uri 'none'` esa nonce'li nisbiy skriptni boshqa serverga yo'naltirishni yopadi.

Yopilmagan narsalar: (1) nonce sizib chiqsa (log, keshlangan HTML, reflected nonce) himoya yo'qoladi, shuning uchun nonce'li javob umumiy keshga tushmasligi kerak; (2) nonce'li skript ichida DOM XSS bo'lsa (masalan `innerHTML` ga ishonchsiz satr) CSP uni to'liq to'smaydi: Trusted Types (34-dars) shu uchun; (3) CSP ma'lumot o'g'irlashning hamma yo'lini yopmaydi (masalan, formani yuborish yoki rasm so'rovi bilan ma'lumot chiqarish `form-action`/`img-src` sozlamasiga bog'liq); (4) stillar bo'yicha murosa qilingan (`style-src 'unsafe-inline'`); (5) model real brauzer algoritmini to'liq takrorlamaydi.

## Qachon qo'llamaslik kerak

- CSP kodlash va sanitization o'rnini bosmaydi. Policy'ga tayanib `innerHTML` ga ishonchsiz satr yozish noto'g'ri.
- Nonce asosidagi policy statik sahifalar va agressiv CDN keshlash bilan yaxshi kelishmaydi. Agar sahifangiz butunlay statik va uchinchi tomon skripti yo'q bo'lsa, hash-asosli yoki `'self'` policy soddaroq va yetarli bo'lishi mumkin.
- Ko'p uchinchi tomon skriptlari (reklama, A/B test, widget) bo'lgan marketing sahifalarida strict CSP ko'p ish talab qiladi. Admin panel va mijoz kabineti kabi xavfsizlik talabi yuqori sahifalarda foyda katta, marketing sayt uchun ehtimol kamroq. Tanlovni risk (1-dars) bilan asoslang.
- Report-Only'ni doimiy qoldirmang: u to'sib qo'ymaydi va faqat monitoring. Enforce rejimiga o'tish rejasi kerak.
- Policy'ni dev va production'da bir xil deb o'ylamang: dev bundler'lari ko'pincha `'unsafe-eval'` talab qiladi, production'ga u o'tmasligi kerak.
- `report-uri` xizmatiga yuborilgan hisobotlarda URL va foydalanuvchi ma'lumoti bo'lishi mumkin (maxfiylik, 79-dars); hisobot oqimini ham himoya qiling.

## Stack'da: Next.js, NestJS va Nginx

Next.js'da policy Proxy'da yoki `next.config` `headers()` ichida beriladi. Nonce kerak bo'lsa Proxy varianti ishlatiladi. Nonce'siz variant hujjatda `next.config` ichida `script-src 'self' 'unsafe-inline'` bilan beriladi, lekin bu inline skriptni ruxsat etgani uchun skript injection'ga qarshi kuchsiz; kuchli nonce'siz yo'l eksperimental SRI (`experimental.sri`) bilan `script-src 'self'`. Server komponentida nonce'ni olish:

```tsx
import { headers } from "next/headers";
import Script from "next/script";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="uz">
      <body>
        {children}
        <Script src="/analytics.js" strategy="afterInteractive" nonce={nonce} />
      </body>
    </html>
  );
}
```

Bu kod ishga tushirilmaydi, faqat sintaksis jihatidan tekshirilgan. Bu yerda `headers()` asinxron (`await`) ishlatilgan, hujjatdagi namunaga mos. API (NestJS/Fastify) JSON qaytarsa, unga ham `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` qo'yish mumkin: JSON javob brauzerda ochilsa, hech narsa yuklanmaydi. Nginx yoki CDN darajasida sarlavhani qo'yish mumkin, lekin nonce faqat ilova tomonidan yaratilishi kerak. Qolgan sarlavhalar (HSTS, nosniff, Referrer-Policy) 16-darsda.

## Xulosa

- CSP ikkinchi qatlam: u XSS'ni tuzatmaydi, zarar yetkazishni qiyinlashtiradi. Kodlash va sanitization asosiy.
- Host allowlist va `'unsafe-inline'` hujumchi uchun ochiq eshik qoldiradi; strict policy nonce (yoki hash) va `'strict-dynamic'` ga tayanadi.
- Nonce har javobda yangi, CSPRNG'dan va sirli bo'lishi shart; nonce'li javob umumiy keshga tushmasligi kerak.
- Next.js'da nonce so'rov bosqichida yaratiladi; narxi: dinamik render va cheklangan keshlash.
- `object-src 'none'`, `base-uri 'none'`, `form-action` va `frame-ancestors` skript bo'lmagan vektorlarni yopadi.
- Joriy qilish: Report-Only, hisobotlarni tuzatish, keyin enforce; policy'ni lint qiling va qoldiq risklarni (nonce sizishi, DOM XSS, stillar) yozib qo'ying.
