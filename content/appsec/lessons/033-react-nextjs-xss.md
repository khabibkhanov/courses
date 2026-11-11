---
n: 33
slug: react-nextjs-xss
title: "React va Next.js'da XSS tuzoqlari"
summary: "React avtomatik kodlash nimani qoplaydi va nimani qoplamaydi: dangerouslySetInnerHTML, foydalanuvchi obyektini props sifatida yoyish, URL atributlari, ref orqali innerHTML, script ichiga ma'lumot joylash va Next.js server/klient chegarasi."
duration: 45
sources:
  - id: cs-xss
    note: "Umumiy mazmun: framework avtomatik kodlashi va undan chetga chiqadigan 'escape hatch' API'lar xavfi; bo'lim raqamlari keltirilmaydi"
  - id: nextjs-data-security
    note: "Next.js ma'lumot xavfsizligi qo'llanmasi: server va klient chegarasi, Server Action'lar va ma'lumotni klientga uzatishda ehtiyot bo'lish haqida umumiy mazmun"
  - id: nextjs-csp
    note: "Next.js CSP qo'llanmasi: CSP chuqur himoya qatlami sifatida (batafsil 35-darsda)"
quiz:
  - q: "React komponentida `<p>{comment.text}</p>` yozilgan, `comment.text` = `<img src=x onerror=alert(1)>`. Nima bo'ladi?"
    options:
      - "Rasm yaratiladi va onerror ishlaydi"
      - "React xato tashlaydi"
      - "React JSX ichidagi matn ifodasini kodlaydi: qiymat matn sifatida ko'rinadi, tag yaratilmaydi"
      - "Faqat server-render qilinganda xavfsiz"
    answer: 2
    explain: "JSX ifodasi matn tuguni sifatida qo'yiladi (server-renderda esa escape qilinadi), shuning uchun markup tahlil qilinmaydi. Xavf React'ning shu himoyasidan chetga chiqiladigan joylarda: dangerouslySetInnerHTML, ref orqali innerHTML, URL atributlari va boshqalar."
  - q: "Quyidagi komponent API'dan kelgan obyektni to'g'ridan-to'g'ri yoyadi. Hujumchi profilga `{\"dangerouslySetInnerHTML\": {\"__html\": \"<img src=x onerror=alert(1)>\"}}` yozdi. Nima uchun xavfli?\n\n```tsx\nfunction Badge({ attrs }: { attrs: Record<string, unknown> }) {\n  return <div {...attrs}>belgi</div>;\n}\n```"
    options:
      - "Yoyilgan props orasida dangerouslySetInnerHTML bo'lishi mumkin, u bolalar o'rniga xom HTML qo'yadi"
      - "Props yoyish React'da taqiqlangan"
      - "Faqat `onClick` kabi funksiya xavfli, obyekt emas"
      - "Hech narsa: React hamma props'ni kodlaydi"
    answer: 0
    explain: "Props nomlari ham ma'lumot bo'lsa, hujumchi xavfli prop'ni o'zi tanlaydi. React props qiymatlarini atribut sifatida kodlaydi, lekin dangerouslySetInnerHTML maxsus prop: u kodlashni ataylab o'chiradi. Tuzatish: faqat ruxsat etilgan prop nomlarini ro'yxatdan olish."
  - q: "Markdown'dan HTML'ga o'tkazgich foydalanuvchi izohida xom HTML teglarini o'tkazib yuboradi. Natija `dangerouslySetInnerHTML` ga beriladi. Qaysi tuzatish to'g'ri yo'nalish?"
    options:
      - "`<script>` so'zini regex bilan o'chirish"
      - "Faqat izohni bazaga yozishda escape qilish"
      - "Xavfsiz, chunki Markdown HTML emas"
      - "Chiqishdan oldin ishonchli sanitizer (cheklangan allowlist) bilan tozalash yoki o'tkazgichda xom HTML'ni o'chirish"
    answer: 3
    explain: "Markdown ko'p implementatsiyada xom HTML'ni o'tkazib yuboradi, shuning uchun natija ishonchsiz HTML. Regex-filtr ishonchsiz (31-dars), bazaga yozishdagi escape esa boshqa kontekstlarni buzadi. Allowlist asosidagi sanitizer (34-dars) yoki xom HTML o'chirilgan renderer to'g'ri yo'nalish."
  - q: "Next.js sahifasida `<a href={user.website}>` yozilgan. Qaysi kiritish xavfli bo'lib qoladi?"
    options:
      - "`https://example.com`"
      - "`javascript:alert(1)`"
      - "`/mashinalar/7`"
      - "`mailto:info@example.com`"
    answer: 1
    explain: "JSX atribut qiymatini kodlaydi, lekin sxemani tekshirmaydi: javascript: URL'da kodlanadigan belgi yo'q. Sxema allowlist bilan tekshirilishi kerak (32-dars). Boshqa uch qiymat odatiy va xavfsiz."
  - q: "Server Component foydalanuvchi obyektini (parol hash maydoni bilan) to'liq Client Component'ga props sifatida uzatdi. Bu XSS'ga qanday aloqador?"
    options:
      - "Aloqasi yo'q: props kodlanadi"
      - "Faqat parol hash maxfiylik muammosi, XSS bilan bog'liq emas"
      - "Klientga uzatilgan hamma narsa sahifaga serializatsiya qilinadi va brauzerda ishlayotgan har qanday skript (XSS bilan ham) o'qiy oladi"
      - "Server Component'lar klientga hech narsa yubormaydi"
    answer: 2
    explain: "Client Component'ga uzatilgan props brauzerga yetib boradi (sahifa ma'lumotlari ichida). Ortiqcha maydon maxfiylik oqishi, XSS bo'lsa esa hujumchiga tayyor ma'lumot. Qoida: klientga faqat kerakli maydonlarni uzating (nextjs-data-security qo'llanmasi shu yo'nalishda)."
  - q: "`useEffect` ichida `ref.current.innerHTML = comment.html` yozilgan. Nega bu kod review'da `dangerouslySetInnerHTML` bilan bir xil darajada ko'rilishi kerak?"
    options:
      - "Ular bir xil sink: xom HTML'ni DOM'ga yozadi, React kodlashi aylanib o'tiladi"
      - "ref ishlatish React'da taqiqlangan"
      - "innerHTML faqat server tomonida xavfli"
      - "useEffect HTML'ni avtomatik tozalaydi"
    answer: 0
    explain: "ref orqali innerHTML React'ning virtual DOM va kodlash qatlamini chetlab o'tadi, natijada xuddi dangerouslySetInnerHTML kabi ishonchsiz HTML sink bo'ladi. Qidiruv uchun ikkalasini ham grep qilish va review'da belgilash kerak."
task:
  title: "Ishonchsiz props va URL uchun allowlist"
  prompt: |
    Mini renderer React'ning xatti-harakatini soddalashtirib modellashtiradi: matn va atribut qiymatlarini kodlaydi, lekin `dangerouslySetInnerHTML` prop'ini xom HTML sifatida qo'yadi. `Badge` komponenti API'dan kelgan `attrs` obyektini to'g'ridan-to'g'ri props qilib yoyadi.

    Vazifa: `pickSafeProps(attrs)` funksiyasini yozing. U faqat `id`, `title`, `className`, `href` kalitlarini qabul qiladi (boshqa hamma kalit, shu jumladan `dangerouslySetInnerHTML` va `on...` voqea prop'lari tashlanadi). Qiymat satr bo'lmasa kalit tashlanadi, `href` esa faqat `http:`, `https:`, `mailto:` sxemalarida o'tadi (aks holda tashlanadi). `Badge` shu funksiyadan foydalansin. Natija: hujum payload'lari bilan render qilingan chiqishda `<img` va `javascript:` bo'lmasligi kerak.
  lang: ts
  starter: |
    type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] };

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    // React'ning soddalashtirilgan modeli
    function render(n: Node | string): string {
      if (typeof n === "string") return esc(n);
      const { dangerouslySetInnerHTML, ...rest } = n.props as { dangerouslySetInnerHTML?: { __html: string } } & Record<string, unknown>;
      const attrs = Object.entries(rest)
        .map(([k, v]) => ` ${k}="${esc(String(v))}"`)
        .join("");
      const inner = dangerouslySetInnerHTML ? dangerouslySetInnerHTML.__html : n.children.map(render).join("");
      return `<${n.type}${attrs}>${inner}</${n.type}>`;
    }

    function pickSafeProps(attrs: Record<string, unknown>): Record<string, unknown> {
      return attrs; // TUZATING
    }

    function Badge(attrs: Record<string, unknown>): Node {
      return { type: "a", props: pickSafeProps(attrs), children: ["profil"] };
    }

    const attack1 = { href: "javascript:alert(1)", title: "x" };
    const attack2 = { dangerouslySetInnerHTML: { __html: "<img src=x onerror=alert(1)>" } };
    const attack3 = { onclick: "alert(1)", id: "b1" };

    console.log(render(Badge({ href: "https://example.com", title: "sayt" })));
    console.log(render(Badge(attack1)));
    console.log(render(Badge(attack2)));
    console.log(render(Badge(attack3)));
  solution: |
    type Node = { type: string; props: Record<string, unknown>; children: (Node | string)[] };

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    // React'ning soddalashtirilgan modeli
    function render(n: Node | string): string {
      if (typeof n === "string") return esc(n);
      const { dangerouslySetInnerHTML, ...rest } = n.props as { dangerouslySetInnerHTML?: { __html: string } } & Record<string, unknown>;
      const attrs = Object.entries(rest)
        .map(([k, v]) => ` ${k}="${esc(String(v))}"`)
        .join("");
      const inner = dangerouslySetInnerHTML ? dangerouslySetInnerHTML.__html : n.children.map(render).join("");
      return `<${n.type}${attrs}>${inner}</${n.type}>`;
    }

    const ALLOWED_KEYS = ["id", "title", "className", "href"];
    const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

    function safeUrl(s: string): boolean {
      try {
        return ALLOWED_PROTOCOLS.has(new URL(s, "https://platforma.example").protocol);
      } catch {
        return false;
      }
    }

    function pickSafeProps(attrs: Record<string, unknown>): Record<string, unknown> {
      const out: Record<string, unknown> = {};
      for (const key of ALLOWED_KEYS) {
        const v = attrs[key];
        if (typeof v !== "string") continue;
        if (key === "href" && !safeUrl(v)) continue;
        out[key] = v;
      }
      return out;
    }

    function Badge(attrs: Record<string, unknown>): Node {
      return { type: "a", props: pickSafeProps(attrs), children: ["profil"] };
    }

    const attack1 = { href: "javascript:alert(1)", title: "x" };
    const attack2 = { dangerouslySetInnerHTML: { __html: "<img src=x onerror=alert(1)>" } };
    const attack3 = { onclick: "alert(1)", id: "b1" };

    console.log(render(Badge({ href: "https://example.com", title: "sayt" })));
    console.log(render(Badge(attack1)));
    console.log(render(Badge(attack2)));
    console.log(render(Badge(attack3)));
  solutionNotes: |
    - Kalitlar ro'yxatdan olinadi (`ALLOWED_KEYS`), obyektdan "xavflilarini o'chirish" emas: noma'lum prop nomi avtomatik tashlanadi. Qora ro'yxat (`dangerouslySetInnerHTML` ni o'chirish) `onclick`, `srcdoc` va kelajakdagi prop'larni o'tkazib yuboradi.
    - Qiymat turi tekshiriladi: obyekt yoki funksiya qiymatli kalit tashlanadi.
    - `href` uchun sxema tekshiruvi URL parser bilan allowlist asosida (32-dars).
    - Bu model React'ning soddalashtirilgani. Haqiqiy React voqea prop'larini funksiya sifatida qabul qiladi va satrli `onclick` ni boshqacha ishlaydi; asosiy dars bir xil: props nomlari ham ishonchsiz ma'lumot.
    - Tuzatish props yoyishni yopadi. U `dangerouslySetInnerHTML` ga boshqa yo'l bilan (masalan Markdown natijasi) tushadigan HTML'ni sanitizatsiya qilmaydi (34-dars).
  checklist:
    - "Faqat `id`, `title`, `className`, `href` kalitlari o'tadi"
    - "`dangerouslySetInnerHTML` va `onclick` kabi kalitlar tashlanadi"
    - "Satr bo'lmagan qiymatlar tashlanadi"
    - "`javascript:` href tashlanadi, `https:` href o'tadi"
    - "Allowlist qora ro'yxatdan nega ishonchliroq ekanini tushuntira olasiz"
---

## Muammo

"React XSS'dan himoyalangan" jumlasi yarim to'g'ri va shu yarim to'g'rilik xavfli. To'g'ri qismi: JSX ichidagi `{value}` ifodasi matn sifatida qo'yiladi, brauzer DOM'iga matn tuguni yoziladi, server-renderda esa qiymat escape qilinadi. 31-darsdagi oddiy `innerHTML` xatosini React'da qilish qiyin. Noto'g'ri qismi: React boshqa hamma joyda dasturchi bergan narsaga ishonadi. Komponentga `dangerouslySetInnerHTML` yozsangiz, React xom HTML qo'yadi. Atribut sifatida `javascript:` URL bersangiz, React uni yetkazadi. Ref orqali DOM tuguniga o'zingiz `innerHTML` yozsangiz, React aralashmaydi.

Shu sababli React/Next.js loyihalarida XSS "yo'q bo'lmaydi", u siqilib ma'lum nuqtalarga ko'chadi. Nuqtalar kam, lekin ko'rinmas: markdown renderer natijasi, API'dan kelgan obyektni props qilib yoyish, CMS'dan kelgan HTML, `href={user.link}`, analitika skripti uchun inline kod. Jamoa "framework himoya qiladi" deb ishonib, bu nuqtalarni review'dan o'tkazmaydi.

Bu dars shu nuqtalar xaritasi. Qoida ikki yarmidan iborat: framework nimani avtomatik qiladi (matn va atribut qiymatini kodlash), va undan qaerda chetga chiqiladi. Chetga chiqish nuqtalarini topish va ularga 32-darsdagi kontekst qoidalarini qo'lda qo'llash dasturchi vazifasi. Next.js'da bunga server va klient chegarasi qo'shiladi: nima brauzerga yetib borishi ham xavfsizlik savoli.

## Asosiy g'oya

React DOM matn va atribut qiymatlarini kodlashi framework tuzilishidan keladigan xususiyat: virtual DOM obyektlari, matn alohida, tag alohida. Shuning uchun "ma'lumot va kod chegarasi" (21-dars) bu yerda dizayn bilan saqlanadi. XSS faqat chegara ataylab o'chiriladigan yoki framework ko'rmaydigan joylarda paydo bo'ladi. Eslatma: Next.js haqidagi da'volar lokal hujjat nusxasiga solishtirilgan (klientga uzatiladigan props'ni cheklash, taint API, Server Action'ga to'g'ridan-to'g'ri POST bilan murojaat). React'ning ichki xatti-harakatlari (masalan, `javascript:` URL'lar uchun ogohlantirish yoki bloklash) versiyaga qarab o'zgargan va bu dars ularni kafolat deb qabul qilmaydi; sizning React versiyangiz xatti-harakatini o'zingiz tekshiring.

Ro'yxat qisqa va yodlanadigan: React/Next.js'da XSS quyidagi eshiklardan kiradi.

1. `dangerouslySetInnerHTML`: nomi ataylab qo'rqituvchi. Sink xom HTML.
2. Props yoyish: `{...obj}` da `obj` ichidagi kalitlar (jumladan `dangerouslySetInnerHTML`) ham ma'lumot.
3. URL atributlari: `href`, `src`, `action`, `formAction`. Kodlash sxemani tekshirmaydi.
4. `ref` orqali DOM'ga to'g'ridan-to'g'ri yozish: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`.
5. Dinamik element turi: `React.createElement(userType, ...)` yoki `const Tag = data.tag; <Tag />`. Tur ham ma'lumot bo'lmasligi kerak.
6. Uchinchi tomon komponentlari: markdown, boy matn muharriri, "HTML renderer" kutubxonalar ichida xom HTML sink bor.
7. `<script>` ichiga ma'lumot joylash: SSR'da boshlang'ich holatni qo'lda serializatsiya qilish (32-dars).
8. Eval-tipidagi sink'lar: `eval`, `new Function`, satr bilan `setTimeout`, `import()` ga foydalanuvchi manzili.

## Chuqurroq: har eshik qanday ishlaydi

### dangerouslySetInnerHTML va uning manbalari

Prop ichidagi `__html` qiymati kodlashsiz DOM'ga yoziladi. Xavf `dangerouslySetInnerHTML` yozilgan satrda emas, `__html` qiymati qayerdan kelganida: Markdown'dan o'tkazilgan HTML, CMS maydoni, boshqa servis javobi, bazadagi eski yozuv. Markdown ko'p kutubxonada xom HTML'ni o'tkazib yuboradi (sozlamaga bog'liq), shuning uchun Markdown "xavfsiz format" emas: natija ishonchsiz HTML deb qaralishi kerak. Qoida: `__html` ga faqat (a) o'zingiz yozgan konstanta, yoki (b) ishonchli sanitizer (34-dars) dan o'tgan qiymat tushishi mumkin. Boshqa hamma holda tasdiqlash kerak, va bu har bir ishlatilishda code review'da to'xtash nuqtasi.

### Props yoyish

`<div {...attrs}>` da `attrs` tashqi manbadan kelsa (API javobi, URL parametrlaridan tuzilgan obyekt, CMS bloki), hujumchi prop nomini o'zi tanlaydi. React qiymatlarni atribut sifatida kodlaydi, shuning uchun `title` yoki `className` zararsiz. Lekin kalit `dangerouslySetInnerHTML` bo'lsa, qiymati `{__html: "..."}` obyekt va natija xom HTML. Voqea prop'lari (`onClick`) JSON'da funksiya bo'la olmaydi, lekin atribut sifatida satr berilsa, ayrim muhit va kutubxonalarda xavf paydo bo'ladi. Qora ro'yxat yetarli emas, chunki React va brauzer atributlari soni katta (masalan, `srcDoc` iframe uchun, `formAction` tugma uchun). Qoida: ma'lumotdan faqat nomi aniq ro'yxatda bo'lgan prop'lar olinadi (allowlist), qiymat turi va URL sxemasi tekshiriladi.

### URL atributlari

JSX `href={url}` qiymatni kodlaydi (tirnoqdan chiqib ketmaydi), lekin `javascript:alert(1)` da maxsus belgi yo'q. Brauzer havola bosilganda sxemani bajaradi. Bu bir xil ravishda `<a href>`, `<iframe src>`, `<form action>`, `<button formAction>`, `<object data>` uchun amal qiladi. Himoya: URL'ni parser bilan tahlil qilish va sxemani allowlist bilan tekshirish (32-dars). Next.js'ning `<Link href={...}>` komponenti ham foydalanuvchi bergan qiymatni to'g'ridan-to'g'ri `href` ga olib boradi; uni ham tekshiring. Tashqi havolalarga `rel="noopener noreferrer"` qo'shish alohida masala (`window.opener` va referrer), XSS himoyasi emas.

### ref va to'g'ridan-to'g'ri DOM

Komponent `useEffect` ichida `ref.current.innerHTML = html` yozsa, bu `dangerouslySetInnerHTML` bilan bir xil sink, faqat kod qidiruvida kam ko'rinadi. Kutubxona integratsiyalari (grafik, xarita, editor) ham shunday qiladi: ularga uzatiladigan matnlar (tooltip, belgi nomi, popup HTML) ham ishonchsiz bo'lishi mumkin. Avtopark xaritasida mashina nomi popup'da `innerHTML` bilan ko'rsatilsa, mashina nomi (tenant ma'muri kiritgan) XSS'ga yo'l bo'ladi. Kod bazasida `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` va `dangerouslySetInnerHTML` ni qidirish oddiy, lekin foydali birinchi qadam.

### Server va klient chegarasi (Next.js)

Next.js App Router'da Server Component serverda ishlaydi va natija sifatida HTML hamda klient komponentlari uchun serializatsiya qilingan ma'lumot yuboradi. Client Component'ga uzatilgan props brauzerga yetib boradi, ya'ni sahifa manbasida ko'rinadi. Next.js ma'lumot xavfsizligi qo'llanmasi shu yo'nalishda: klientga faqat kerakli maydonlarni uzating, serverga mansub ma'lumotlarni ajrating. Bu to'g'ridan-to'g'ri XSS emas, lekin ta'siri XSS bilan bog'liq: hujumchi skripti brauzerda sahifada bor hamma narsani o'qiy oladi. Parol hash, ichki identifikatorlar, boshqa tenant belgilari klientga uzatilmagan bo'lsa, XSS orqali ularni olib bo'lmaydi. Server Action'lar ham oddiy HTTP endpoint ekanini unutmang: ularda autentifikatsiya va avtorizatsiya alohida tekshiriladi (58-dars).

### Content Security Policy

React/Next.js'da CSP ikkinchi qatlam: kodlashdagi bitta unutilgan joyni to'sib qolishi mumkin. Next.js hujjatlari nonce asosidagi CSP'ni tavsiflaydi va u har so'rovda dinamik render talab qiladi (statik optimizatsiya buziladi). Batafsil joriy qilish 35-darsda.

## Misol: Badge komponenti va API'dan kelgan atributlar

Misol React'ning soddalashtirilgan modeli: u matn va atribut qiymatlarini kodlaydi, `dangerouslySetInnerHTML` ni esa xom HTML sifatida qo'yadi (haqiqiy React'ga o'xshash). Model brauzersiz ishlaydi va faqat o'quv kodiga qarshi.

### 1. Zaif kod

`Badge` tashqi `attrs` obyektini to'g'ridan-to'g'ri yoyadi. Bunday komponent, masalan, CMS'dan yoki tenant sozlamalaridan kelgan "havola belgisi" ma'lumotini ko'rsatishi mumkin.

```ts run
type VNode = { type: string; props: Record<string, unknown>; children: (VNode | string)[] };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// React'ning soddalashtirilgan modeli: matn va atribut qiymati kodlanadi, dangerouslySetInnerHTML - yo'q
function render(n: VNode | string): string {
  if (typeof n === "string") return esc(n);
  const { dangerouslySetInnerHTML, ...rest } = n.props as { dangerouslySetInnerHTML?: { __html: string } } & Record<string, unknown>;
  const attrs = Object.entries(rest).map(([k, v]) => ` ${k}="${esc(String(v))}"`).join("");
  const inner = dangerouslySetInnerHTML ? dangerouslySetInnerHTML.__html : n.children.map(render).join("");
  return `<${n.type}${attrs}>${inner}</${n.type}>`;
}

// ZAIF: attrs tashqi ma'lumot, kalit nomlari ham, qiymatlari ham ishonchsiz
function BadgeWeak(attrs: Record<string, unknown>): VNode {
  return { type: "a", props: { ...attrs }, children: ["profil"] };
}

// JSX ifodasi: {comment.text} - matn sifatida kodlanadi
const comment = { text: "<img src=x onerror=alert(1)>" };
console.log(render({ type: "p", props: {}, children: [comment.text] }));

console.log(render(BadgeWeak({ href: "https://example.com", title: "sayt" })));
console.log(render(BadgeWeak({ href: "javascript:alert(1)" })));
console.log(render(BadgeWeak({ dangerouslySetInnerHTML: { __html: "<img src=x onerror=alert(1)>" } })));
```

```text
<p>&lt;img src=x onerror=alert(1)&gt;</p>
<a href="https://example.com" title="sayt">profil</a>
<a href="javascript:alert(1)">profil</a>
<a><img src=x onerror=alert(1)></a>
```

### 2. Hujum

Birinchi qatorda React'ning asosiy himoyasi ishlayapti: izoh matni kodlandi. Qolgan ikki holatda hujumchi komponentning o'ziga emas, unga beriladigan ma'lumotga ta'sir qiladi. Uchinchi qatordagi `javascript:` havolasi foydalanuvchi bosganda bajariladi. To'rtinchi qatorda hujumchi prop nomini ham tanladi: `dangerouslySetInnerHTML` kaliti "belgi" ma'lumotiga qo'shildi va komponent ichiga xom `<img onerror=...>` tushdi. Bunday zaiflik haqiqiy React loyihalarida API'dan kelgan sozlama obyektini `{...config}` qilib yoyishda uchraydi.

### 3. Tuzatilgan kod

Props allowlist asosida olinadi, qiymat turi va URL sxemasi tekshiriladi:

```ts run
type VNode = { type: string; props: Record<string, unknown>; children: (VNode | string)[] };

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(n: VNode | string): string {
  if (typeof n === "string") return esc(n);
  const { dangerouslySetInnerHTML, ...rest } = n.props as { dangerouslySetInnerHTML?: { __html: string } } & Record<string, unknown>;
  const attrs = Object.entries(rest).map(([k, v]) => ` ${k}="${esc(String(v))}"`).join("");
  const inner = dangerouslySetInnerHTML ? dangerouslySetInnerHTML.__html : n.children.map(render).join("");
  return `<${n.type}${attrs}>${inner}</${n.type}>`;
}

const ALLOWED_KEYS = ["id", "title", "className", "href"];
const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function urlOk(s: string): boolean {
  try {
    return ALLOWED_PROTOCOLS.has(new URL(s, "https://platforma.example").protocol);
  } catch {
    return false;
  }
}

function pickSafeProps(attrs: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ALLOWED_KEYS) {
    const v = attrs[key];
    if (typeof v !== "string") continue;
    if (key === "href" && !urlOk(v)) continue;
    out[key] = v;
  }
  return out;
}

function Badge(attrs: Record<string, unknown>): VNode {
  return { type: "a", props: pickSafeProps(attrs), children: ["profil"] };
}

console.log(render(Badge({ href: "https://example.com", title: "sayt" })));
console.log(render(Badge({ href: "javascript:alert(1)" })));
console.log(render(Badge({ dangerouslySetInnerHTML: { __html: "<img src=x onerror=alert(1)>" } })));
console.log(render(Badge({ onclick: "alert(1)", id: "b1", title: { toString: () => "x" } })));
```

```text
<a title="sayt" href="https://example.com">profil</a>
<a>profil</a>
<a>profil</a>
<a id="b1">profil</a>
```

### Tuzatish nima uchun yetarli

Invariant: komponentga faqat to'rt aniq nomli prop yetib boradi, ularning qiymati satr, `href` esa ruxsat etilgan sxemada. Shuning uchun uchala hujum (`javascript:` havolasi, `dangerouslySetInnerHTML` kaliti, `onclick` va obyekt qiymati) tashlandi. Allowlist qora ro'yxatdan ishonchli: yangi xavfli prop nomi paydo bo'lsa ham u ro'yxatda yo'q. Yopilmagan narsalar: tuzatish faqat props yoyish eshigini yopadi. `dangerouslySetInnerHTML` ga boshqa yo'l bilan HTML tushsa (Markdown natijasi), uni sanitizatsiya kerak (34-dars); `href` allowlist'ga mos zararli `https://` manzilga yo'naltirish esa open redirect/phishing masalasi (38-dars). Bu model React'ning o'zi emas: haqiqiy React bilan natijani o'z versiyangizda tekshiring.

## Qachon qo'llamaslik kerak

- `dangerouslySetInnerHTML` ni butunlay taqiqlash ba'zi jamoalarda ortiqcha. U kerak bo'lgan joylar bor (CMS'dagi boy kontent, juda ko'p SSR optimizatsiya). To'g'ri qoida: har ishlatilishga sabab va sanitizer yoki ishonchli manba yozilgan bo'lsin, lint qoidasi ularni belgilab ko'rsatsin.
- Props allowlist faqat props ishonchsiz ma'lumotdan tuzilgan joyda kerak. Ichki komponentlar o'rtasida o'tkaziladigan o'z props'laringizga bunday filtr qo'ymang: bu ortiqcha murakkablik (YAGNI), ishonch chegarasi shu yerda emas.
- "React xavfsiz" degan taxmin ham, "React xavfli" degan taxmin ham noto'g'ri. Eng yaxshi natija: chetga chiqish eshiklarini ro'yxatga olish va ularni kod review hamda lint orqali nazorat qilish.
- CSP yoki Trusted Types (34-dars) kodlash o'rnini bosmaydi. Ular kodlashdagi xatolarni ushlaydigan ikkinchi qatlam.
- Klientga uzatiladigan ma'lumotni kamaytirish XSS'ning o'zini to'xtatmaydi, faqat oqibatini kamaytiradi. U va kodlash alohida choralar.

## Stack'da: Next.js App Router

Quyida App Router'dagi odatiy xavfsiz va xavfli joylar. Kod ishga tushirilmaydi (Next.js va React brauzer worker'ida yo'q), faqat sintaksis jihatidan tekshirilgan.

```tsx
import "server-only";
import { sanitizeComment } from "@/lib/sanitize"; // 34-dars: allowlist sanitizer
import { getVehicle } from "@/lib/vehicles";

type Props = { params: Promise<{ id: string }> };

export default async function VehiclePage({ params }: Props) {
  const { id } = await params;
  const v = await getVehicle(id); // tenant tekshiruvi ichkarida (52-dars)

  // Klientga faqat kerakli maydonlar
  const view = { name: v.name, plate: v.plate };

  return (
    <article>
      <h1>{view.name}</h1> {/* kodlanadi */}
      <a href={safeHref(v.website)}>sayt</a> {/* sxema tekshiriladi (32-dars) */}
      {/* ISHONCHSIZ HTML sink: faqat sanitizer'dan keyin */}
      <div dangerouslySetInnerHTML={{ __html: sanitizeComment(v.noteHtml) }} />
    </article>
  );
}

function safeHref(url: string): string {
  try {
    const u = new URL(url, "https://platforma.example");
    return ["http:", "https:", "mailto:"].includes(u.protocol) ? u.href : "#";
  } catch {
    return "#";
  }
}
```

Amaliy tavsiyalar: `eslint-plugin-react`'ning `react/no-danger` qoidasi `dangerouslySetInnerHTML` ishlatilgan har joyni belgilaydi; `react/jsx-no-script-url` qoidasi `javascript:` URL'larni tutadi (qoidalar mavjudligini o'z loyihangiz konfiguratsiyasida tekshiring). `ref.current.innerHTML` va `insertAdjacentHTML` uchun alohida qidiruv (grep yoki lint) qo'shing. `next.config` va middleware'da CSP sozlash 35-darsda. Server Action va Route Handler'larda kirishni sxema bilan tekshirish (72-dars) hamda har chaqiruvda avtorizatsiya (58-dars) kerak.

## Xulosa

- React JSX matn va atribut qiymatlarini kodlaydi, shuning uchun oddiy XSS qiyin. Xavf framework chetlab o'tiladigan joylarda.
- Eshiklar: `dangerouslySetInnerHTML`, props yoyish, URL atributlari, ref orqali `innerHTML`, dinamik element turi, uchinchi tomon renderer'lar, script ichiga ma'lumot.
- Props ham ma'lumot: ishonchsiz obyektdan prop'larni faqat nomi ro'yxatda bo'lganlarini oling (allowlist), URL sxemasini tekshiring.
- Markdown natijasi ishonchsiz HTML: `__html` ga faqat sanitizer'dan o'tgan yoki o'zingiz yozgan qiymat tushsin.
- Next.js'da klientga uzatilgan hamma narsa brauzerda XSS uchun ochiq: props'ni kamaytiring; CSP va Trusted Types esa kodlashni almashtirmaydigan qo'shimcha qatlam.
