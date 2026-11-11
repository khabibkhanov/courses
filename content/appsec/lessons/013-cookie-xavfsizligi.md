---
n: 13
slug: cookie-xavfsizligi
title: "Cookie: Secure, HttpOnly, SameSite va prefikslar"
summary: "Cookie qanday saqlanadi va yuboriladi, Secure, HttpOnly, SameSite, Domain va Path atributlari nimani himoya qiladi va nimani qilmaydi, __Host- va __Secure- prefikslari, subdomen orqali cookie tossing hujumi va uning tuzatilishi."
duration: 45
sources:
  - id: rfc6265
    note: "HTTP State Management Mechanism: Set-Cookie va Cookie header'lari, Domain, Path, Secure, HttpOnly atributlari va xavfsizlik mulohazalari"
  - id: rfc6265bis
    note: "RFC 6265 ning yangilanayotgan qoralamasi (draft): SameSite atributi va __Secure-, __Host- prefikslari"
  - id: mdn-cookies
    note: "MDN Cookies bo'yicha qo'llanma: atributlar, SameSite qiymatlari va prefikslar amaliyoti"
  - id: cs-session
    note: "OWASP Session Management Cheat Sheet: session cookie atributlari bo'yicha tavsiyalar"
quiz:
  - q: "Session cookie'da `HttpOnly` bor, `Secure` va `SameSite` yo'q. Saytda XSS topildi. Hujumchi nimaga erisha olmaydi?"
    options:
      - "Foydalanuvchi nomidan saytga so'rov yuborishga"
      - "`document.cookie` orqali session identifikatorini o'qishga"
      - "Sahifa kontentini o'zgartirishga"
      - "Formadagi parolni o'qishga"
    answer: 1
    explain: "HttpOnly skriptdan cookie qiymatini o'qishni to'sadi. Lekin XSS bor sahifada skript so'rovni sizning origin'ingizdan yuboradi, cookie brauzer tomonidan avtomatik qo'shiladi. Shuning uchun HttpOnly XSS oqibatini kamaytiradi (token o'g'irlanmaydi), XSS'ni bartaraf etmaydi."
  - q: "`Set-Cookie: sid=abc; Domain=fleet.example` app.fleet.example dan o'rnatildi. Cookie qayerga yuboriladi?"
    options:
      - "Faqat app.fleet.example ga"
      - "Faqat fleet.example ga, subdomenlarga emas"
      - "fleet.example va uning hamma subdomenlariga (HTTPS yoki HTTP)"
      - "Hech qayerga: Domain atributi bor cookie rad etiladi"
    answer: 2
    explain: "Domain atributi berilsa cookie shu domen va uning subdomenlariga yuboriladi. Atribut berilmasa cookie 'host-only' bo'ladi: faqat o'rnatgan host'ga. Secure bo'lmagani uchun HTTP so'rovda ham ketadi. Shu sababli sessiya cookie'siga Domain bermang."
  - q: "Cookie prefiksi `__Host-` talab qiladigan to'liq shart qaysi?"
    options:
      - "Secure, Domain atributi yo'q, Path=/ va xavfsiz (HTTPS) kontekstdan o'rnatilishi"
      - "Faqat HttpOnly va SameSite=Strict"
      - "Secure va Domain=fleet.example"
      - "Faqat Path=/ va Max-Age"
    answer: 0
    explain: "__Host- cookie'ni host-only qilib bog'laydi: Secure bo'lishi, HTTPS'dan o'rnatilishi, Domain bermaslik va Path=/ shart. Shuning uchun subdomen uni Domain bilan ustidan yoza olmaydi. Boshqa variantlar prefiks shartini noto'g'ri sanaydi."
  - q: "SameSite=Lax cookie qaysi holatda cross-site so'rovga qo'shiladi?"
    options:
      - "Hech qachon"
      - "Har qanday cross-site POST formada"
      - "Cross-site `<img>` va `fetch` so'rovlarida"
      - "Yuqori darajali navigatsiyada xavfsiz metod (masalan, havola bosilganda GET) bo'lsa"
    answer: 3
    explain: "Lax: cross-site subresurs va POST formalarda cookie yuborilmaydi, lekin foydalanuvchi havolani bosib o'tganda (top-level navigatsiya, GET) yuboriladi. Strict esa hatto shunda ham yubormaydi. Lax shuning uchun CSRF'ning asosiy qismini yopadi, lekin GET'dagi yon ta'sirlarni emas."
  - q: "`SameSite=None` ni brauzer qabul qilishi uchun yana nima kerak va nega?"
    options:
      - "Secure atributi: cross-site yuboriladigan cookie shifrlangan kanaldan o'tishi kerak"
      - "HttpOnly atributi: skript o'qimasligi kerak"
      - "Domain atributi: aniq domen ko'rsatilishi kerak"
      - "Hech narsa: None hammasiga ruxsat"
    answer: 0
    explain: "SameSite=None cookie'ni cross-site kontekstda yuborishga ruxsat beradi, brauzerlar buni Secure bilan talab qiladi. Maqsad: cross-site ketadigan cookie ochiq HTTP orqali oqib ketmasin. HttpOnly va Domain bunga aloqasiz."
  - q: "Sessiya cookie'sini xavfsiz sozlashda qaysi kombinatsiya eng to'g'ri boshlang'ich nuqta?"
    options:
      - "`sid=...; Domain=fleet.example; SameSite=None`"
      - "`__Host-sid=...; Secure; HttpOnly; SameSite=Lax; Path=/`"
      - "`sid=...; HttpOnly`"
      - "`__Secure-sid=...; Domain=fleet.example; Max-Age=999999999`"
    answer: 1
    explain: "Prefiks, Secure, HttpOnly, SameSite=Lax va Path=/ birgalikda eng ko'p hujumni yopadi (cookie tossing, o'g'irlash, CSRF qismi). Domain'li variantlar subdomenlarga ochiq. Oxirgisi ham Domain bilan va cheksiz uzoq muddat bilan xavfliroq."
task:
  title: "Set-Cookie header'ini xavfsiz yig'ish"
  prompt: |
    `buildSessionCookie(sessionId)` sessiya cookie'sini `Set-Cookie` qatori sifatida qaytaradi. Hozir u faqat `sid=<qiymat>` ni qaytaradi, atributlar yo'q.

    Funksiyani tuzating:

    1. Nom `__Host-sid` bo'lsin.
    2. Atributlar: `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, `Max-Age=3600`. `Domain` bo'lmasin.
    3. `sessionId` faqat `[A-Za-z0-9_-]{16,}` ga mos kelsa qabul qilinadi; aks holda `Error` tashlansin (`;`, bo'shliq yoki CR/LF bilan header yasash hujumi oldini olinadi).
    4. Imzoni o'zgartirmang. Oxirgi `console.log` natijalari kutilgan: to'g'ri qiymat uchun to'liq qator, ikkala yomon qiymat uchun `xato`.
  lang: ts
  starter: |
    // ZAIF: atributlar yo'q, qiymat tekshirilmaydi
    function buildSessionCookie(sessionId: string): string {
      return `sid=${sessionId}`;
    }

    function tryBuild(v: string): string {
      try { return buildSessionCookie(v); } catch { return "xato"; }
    }

    console.log(tryBuild("Qk3p9sT1xYw_a8Zb2"));
    console.log(tryBuild("abc; Domain=fleet.example"));
    console.log(tryBuild("short"));
  solution: |
    const ID_RE = /^[A-Za-z0-9_-]{16,}$/;

    function buildSessionCookie(sessionId: string): string {
      if (!ID_RE.test(sessionId)) throw new Error("noto'g'ri session id");
      return `__Host-sid=${sessionId}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`;
    }

    function tryBuild(v: string): string {
      try { return buildSessionCookie(v); } catch { return "xato"; }
    }

    console.log(tryBuild("Qk3p9sT1xYw_a8Zb2"));
    console.log(tryBuild("abc; Domain=fleet.example"));
    console.log(tryBuild("short"));
  solutionNotes: |
    - `__Host-` prefiksi uchun uchta shart bajariladi: `Secure`, `Path=/` va `Domain` yo'q. Shu bilan subdomen cookie'ni `Domain` bilan ustidan yoza olmaydi.
    - Qiymat qat'iy alifbo bilan cheklanadi: `;`, bo'shliq va CR/LF o'tmaydi, shuning uchun hujumchi qo'shimcha atribut yoki header qo'sha olmaydi.
    - `HttpOnly` XSS'dan tokenni o'g'irlashni qiyinlashtiradi, lekin XSS'ning o'zini to'xtatmaydi. `SameSite=Lax` CSRF'ning bir qismini yopadi; GET orqali yon ta'sir va same-site hujumlar qoladi (36-dars).
    - `Max-Age` qiymati modelimizning tanlovi; real muddat va bekor qilish 46-darsda ko'riladi.
    - Cookie'ning o'zi autentifikatsiya emas: server tomonda sessiyani tekshirish shart.
  checklist:
    - "Nom `__Host-` prefiksi bilan, `Domain` yo'q"
    - "Secure, HttpOnly, SameSite=Lax, Path=/ va Max-Age bor"
    - "Noto'g'ri session id (`;` yoki qisqa) xato tashlaydi"
    - "Imzo o'zgarmagan"
    - "Tuzatish nimani yopmasligini ayta olasiz (XSS, same-site hujumlar)"
---

## Muammo

HTTP holatsiz (stateless) protokol, shuning uchun login qilgan foydalanuvchini keyingi so'rovda taniy olish uchun cookie ishlatiladi: server `Set-Cookie` bilan qiymat beradi, brauzer uni har keyingi so'rovda `Cookie` header'ida qaytaradi. Cookie xavfsizlik uchun alohida e'tibor talab qiladi, chunki u ikki xossaga ega: brauzer uni avtomatik yuboradi (hujumchi sahifasidan boshlangan so'rovda ham) va u ko'pincha eng qimmat sirni, ya'ni sessiya identifikatorini olib yuradi.

Production'da uchraydigan xatolar: sessiya cookie'si `HttpOnly`siz berilgani uchun kichik XSS sessiya o'g'irlashga aylanadi; `Secure`siz berilgani uchun foydalanuvchi ochiq Wi-Fi'da HTTP sahifaga kirganda cookie ochiq ketadi; `SameSite` e'tiborsiz qoldirilgani uchun boshqa saytdagi forma foydalanuvchi nomidan amal bajaradi (CSRF); `Domain=fleet.example` qo'yilgani uchun bitta xavfsiz bo'lmagan subdomen butun platformaning sessiyasiga ta'sir qiladi. Bu xatolarning hammasi bir qatorlik konfiguratsiya, lekin oqibati butun hisobni egallash.

Bu dars cookie atributlarini mexanizm darajasida ko'radi: har atribut aynan qaysi hujumni yopadi va qaysilarini yopmaydi. Oxirida subdomen orqali cookie tossing hujumini o'quv modelida ko'rib, `__Host-` prefiksi bilan tuzatamiz. Sessiya identifikatorining muddati, bekor qilinishi va rotatsiyasi alohida mavzu (46-dars), brauzer storage bilan solishtirish esa 19-darsda.

## Asosiy g'oya

### Cookie qanday ishlaydi

Server `Set-Cookie: nom=qiymat; atribut; atribut` yuboradi. Brauzer uni saqlab, shartlarga mos har so'rovda `Cookie: nom=qiymat` qaytaradi. Asosiy hujjat RFC 6265; uning yangilanayotgan qoralamasi (rfc6265bis, `SameSite` va prefikslar shunda bayon qilingan) hozirgi brauzer xatti-harakatini aks ettiradi. Muhim xossalar:

- Server brauzerning faqat `nom=qiymat` juftini ko'radi, atributlarni (Secure, Path, Domain) emas. Shu sababli server cookie qayerdan o'rnatilganini bila olmaydi.
- Cookie origin emas, host (va Domain bo'lsa, uning subdomenlari) bilan bog'lanadi. RFC 6265 cookie'lar port va sxema bo'yicha izolyatsiya qilinmasligini o'zining xavfsizlik mulohazalarida yozadi: `http://app.fleet.example` va `https://app.fleet.example` bir cookie'ni ulashishi mumkin (Secure bo'lmasa).
- Bir nomdagi cookie turli Domain/Path bilan bir vaqtda bir nechta bo'lishi mumkin; brauzer hammasini yuboradi, tartib kafolatlanmaydi.

Bu cookie'larni origin chegarasiga tayanadigan SOP (12-dars) dan farqli qiladi. Cookie modeli tarixan oldin paydo bo'lgan va shuning uchun sxema, port va subdomen bo'yicha "yumshoq". Hozirgi atributlar shu bo'shliqlarni to'ldirishga urinadi.

### Atributlar

| Atribut | Nimani yopadi | Nimani yopmaydi |
|---|---|---|
| `Secure` | Cookie faqat HTTPS orqali yuboriladi: ochiq tarmoqdagi tinglovchi ko'rmaydi | XSS, CSRF |
| `HttpOnly` | `document.cookie` orqali o'qishni to'sadi: XSS bilan token o'g'irlanmaydi | XSS orqali foydalanuvchi nomidan so'rov yuborish |
| `SameSite` | Cross-site so'rovda cookie yuborilishini cheklaydi: CSRF qismi yopiladi | Same-site hujumlar (subdomen), XSS |
| `Domain` | Aksincha kengaytiradi: subdomenlarga ham yuboradi | Xavfsizlik atributi emas, doirani kengaytiradi |
| `Path` | Yo'l bo'yicha doirani toraytiradi | Xavfsizlik chegarasi emas (iframe orqali o'qiladi) |
| `Max-Age`, `Expires` | Cookie yashash muddatini cheklaydi | Muddatdan oldin o'g'irlanishni |

`Path` haqida alohida ogohlantirish: RFC 6265 va MDN uni xavfsizlik chegarasi sifatida tavsiflamaydi. Bir origin'dagi boshqa yo'ldagi sahifa (masalan, iframe orqali) skript bilan cookie'ni baribir o'qiy oladi. Origin darajasidagi chegara faqat SOP beradi.

### SameSite

`SameSite` uchta qiymat oladi:

- `Strict`: cookie faqat same-site kontekstdagi so'rovlarda yuboriladi. Hatto tashqi saytdan havola orqali o'tganda ham birinchi so'rovda yuborilmaydi (foydalanuvchi "chiqib ketgandek" ko'rinadi).
- `Lax`: cross-site so'rovlarda yuborilmaydi, lekin yuqori darajali navigatsiyada va xavfsiz metodlarda (masalan, havola bosilganda GET) yuboriladi.
- `None`: cross-site so'rovlarda ham yuboriladi; brauzerlar buni `Secure` bilan talab qiladi.

MDN bo'yicha ba'zi brauzerlar atribut yozilmaganda `Lax` ni standart qiladi, lekin bu yumshoqroq variant: cookie o'rnatilganiga ikki daqiqadan oshmagan bo'lsa, cross-site `POST` so'rovlarga ham qo'shiladi. Bu brauzerga bog'liq xatti-harakat, unga tayanmang: `SameSite` ni har doim aniq yozing. Yana bir muhim narsa: "site" tushunchasi (12-dars) subdomenlarni ichiga oladi. `SameSite=Strict` cookie `blog.fleet.example` dan boshlangan so'rovda ham yuboriladi, chunki ular same-site. SameSite faqat boshqa saytlardan himoya qiladi, kompaniya ichidagi bo'lgan subdomenlardan emas.

### Prefikslar

Cookie nomining boshiga `__Secure-` yoki `__Host-` qo'yilsa, brauzer nom bo'yicha qo'shimcha talab qo'yadi:

- `__Secure-`: cookie `Secure` atributi bilan va xavfsiz (HTTPS) sahifadan o'rnatilgan bo'lishi shart.
- `__Host-`: yuqoridagi shartlarga qo'shimcha, `Domain` atributi bo'lmasligi va `Path=/` bo'lishi shart. Natijada cookie qat'iy host-only bo'ladi.

Nima uchun bu muhim: prefiksli cookie'ni subdomen yoki HTTP sahifa o'rnata olmaydi. Hujumchi nomni bilsa ham, brauzer uning `Set-Cookie`ini rad etadi. Bu keyingi bo'limdagi hujumni yopadi.

## Chuqurroq: cookie tossing va qoldiq risklar

### Cookie tossing

Faraz qiling, `blog.fleet.example` da kichik XSS yoki tashlab ketilgan subdomen bor. Hujumchi u yerdan `Set-Cookie: sid=attacker; Domain=fleet.example` yoza oladi. Brauzer buni qabul qiladi, chunki subdomen o'z ota-domeni uchun cookie yoza oladi. Endi `app.fleet.example` ga ketadigan so'rovda ikki `sid` cookie bo'ladi. Server qaysi birini o'qishi framework'ga bog'liq. Hujumchi session fixation (46-dars) yoki CSRF token almashtirish uchun foydalanishi mumkin: foydalanuvchi hujumchi bergan sessiyaga kirib qoladi. Bunday hujumni SameSite to'xtatmaydi, chunki so'rov same-site. `__Host-` prefiksi esa to'xtatadi: u uchun Domain atributi taqiqlangan, ya'ni subdomen ota-domen ostida bunday cookie yoza olmaydi.

### Xavfsiz sozlama ham yetarli emas

Atributlar to'g'ri bo'lsa ham:

- HttpOnly bo'lsa ham, XSS foydalanuvchi nomidan so'rov yuboradi. XSS himoyasi alohida (31-35-darslar).
- SameSite=Lax bo'lsa ham, GET orqali yon ta'sirli endpoint (`GET /vehicles/1/delete`) cross-site havola bilan ishga tushishi mumkin. Yon ta'sir faqat POST/PUT/DELETE'da bo'lsin.
- Cookie qiymatini server tomonda tekshirish shart. Cookie'ning o'zi autentifikatsiya emas, u faqat tashuvchi.
- Brauzerlar cookie hajmi va sonini cheklaydi; katta ma'lumotni cookie'da tashimang (aniq chegaralarni bu darsda keltirmaymiz).

## Misol: cookie tossing o'quv modelida

Quyidagi kod brauzerning cookie qoidalarining kichik qismini modellaydi: Domain tekshiruvi, Secure, prefikslar, HttpOnly va jo'natish. Bu real brauzer emas va `SameSite` ni modellamaydi (u bu misolning ahamiyatli qismi emas); maqsad Domain va prefiks qoidalarining mexanizmini ko'rsatish. Hujum faqat shu o'quv modeliga qarshi.

### 1. Zaif kod

Server session cookie'ni atributlarsiz beradi:

```ts run
type Cookie = { name: string; value: string; domain: string; hostOnly: boolean; path: string; secure: boolean; httpOnly: boolean };
type Ctx = { host: string; secure: boolean };

// O'quv modeli: brauzerning cookie qoidalarining kichik qismi
class Jar {
  cookies: Cookie[] = [];
  set(header: string, ctx: Ctx): boolean {
    const [pair, ...attrs] = header.split(";").map((s) => s.trim());
    const eq = pair.indexOf("=");
    const name = pair.slice(0, eq), value = pair.slice(eq + 1);
    const a = new Map(attrs.map((s) => { const i = s.indexOf("="); return i < 0 ? [s.toLowerCase(), ""] : [s.slice(0, i).toLowerCase(), s.slice(i + 1)]; }));
    const domain = a.get("domain")?.toLowerCase();
    if (domain && ctx.host !== domain && !ctx.host.endsWith("." + domain)) return false;
    if (a.has("secure") && !ctx.secure) return false;
    if ((name.startsWith("__Secure-") || name.startsWith("__Host-")) && !(a.has("secure") && ctx.secure)) return false;
    if (name.startsWith("__Host-") && (domain || a.get("path") !== "/")) return false;
    const c: Cookie = { name, value, domain: domain ?? ctx.host, hostOnly: !domain, path: a.get("path") ?? "/", secure: a.has("secure"), httpOnly: a.has("httponly") };
    this.cookies = this.cookies.filter((o) => !(o.name === c.name && o.domain === c.domain && o.path === c.path));
    this.cookies.push(c);
    return true;
  }
  private match(c: Cookie, ctx: Ctx): boolean {
    const hostOk = c.hostOnly ? ctx.host === c.domain : ctx.host === c.domain || ctx.host.endsWith("." + c.domain);
    return hostOk && (!c.secure || ctx.secure);
  }
  // Serverga ketadigan Cookie header'i
  header(ctx: Ctx): string {
    return this.cookies.filter((c) => this.match(c, ctx)).map((c) => `${c.name}=${c.value}`).join("; ");
  }
  // Sahifa skripti ko'radigan document.cookie (HttpOnly yashiriladi)
  documentCookie(ctx: Ctx): string {
    return this.cookies.filter((c) => this.match(c, ctx) && !c.httpOnly).map((c) => `${c.name}=${c.value}`).join("; ");
  }
}

const app: Ctx = { host: "app.fleet.example", secure: true };
const jar = new Jar();

// ZAIF: HttpOnly, Secure, prefiks, SameSite yo'q
jar.set("sid=real-session-1; Path=/", app);
console.log("server ko'radi:", jar.header(app));
```

```text
server ko'radi: sid=real-session-1
```

### 2. Hujum

Hujumchi ikki narsani sinaydi: XSS orqali `document.cookie` ni o'qish va ishdan chiqqan `blog.fleet.example` subdomenidan ota-domen uchun cookie yozish.

```ts run
type Cookie = { name: string; value: string; domain: string; hostOnly: boolean; path: string; secure: boolean; httpOnly: boolean };
type Ctx = { host: string; secure: boolean };

// O'quv modeli: brauzerning cookie qoidalarining kichik qismi
class Jar {
  cookies: Cookie[] = [];
  set(header: string, ctx: Ctx): boolean {
    const [pair, ...attrs] = header.split(";").map((s) => s.trim());
    const eq = pair.indexOf("=");
    const name = pair.slice(0, eq), value = pair.slice(eq + 1);
    const a = new Map(attrs.map((s) => { const i = s.indexOf("="); return i < 0 ? [s.toLowerCase(), ""] : [s.slice(0, i).toLowerCase(), s.slice(i + 1)]; }));
    const domain = a.get("domain")?.toLowerCase();
    if (domain && ctx.host !== domain && !ctx.host.endsWith("." + domain)) return false;
    if (a.has("secure") && !ctx.secure) return false;
    if ((name.startsWith("__Secure-") || name.startsWith("__Host-")) && !(a.has("secure") && ctx.secure)) return false;
    if (name.startsWith("__Host-") && (domain || a.get("path") !== "/")) return false;
    const c: Cookie = { name, value, domain: domain ?? ctx.host, hostOnly: !domain, path: a.get("path") ?? "/", secure: a.has("secure"), httpOnly: a.has("httponly") };
    this.cookies = this.cookies.filter((o) => !(o.name === c.name && o.domain === c.domain && o.path === c.path));
    this.cookies.push(c);
    return true;
  }
  private match(c: Cookie, ctx: Ctx): boolean {
    const hostOk = c.hostOnly ? ctx.host === c.domain : ctx.host === c.domain || ctx.host.endsWith("." + c.domain);
    return hostOk && (!c.secure || ctx.secure);
  }
  // Serverga ketadigan Cookie header'i
  header(ctx: Ctx): string {
    return this.cookies.filter((c) => this.match(c, ctx)).map((c) => `${c.name}=${c.value}`).join("; ");
  }
  // Sahifa skripti ko'radigan document.cookie (HttpOnly yashiriladi)
  documentCookie(ctx: Ctx): string {
    return this.cookies.filter((c) => this.match(c, ctx) && !c.httpOnly).map((c) => `${c.name}=${c.value}`).join("; ");
  }
}

const app: Ctx = { host: "app.fleet.example", secure: true };
const blog: Ctx = { host: "blog.fleet.example", secure: true };
const jar = new Jar();
jar.set("sid=real-session-1; Path=/", app);

console.log("1) XSS document.cookie:", jar.documentCookie(app));
console.log("2) subdomen yozdimi:", jar.set("sid=attacker-session; Domain=fleet.example; Path=/", blog));
console.log("   server ko'radi:", jar.header(app));
```

```text
1) XSS document.cookie: sid=real-session-1
2) subdomen yozdimi: true
   server ko'radi: sid=real-session-1; sid=attacker-session
```

Birinchi qatorda XSS skripti sessiya identifikatorini o'qidi (HttpOnly yo'q). Ikkinchisida subdomen cookie yozdi va endi serverga ikkita `sid` keladi: ilova qaysi birini olishi framework'ning tartibiga bog'liq, hujumchi esa o'z sessiyasini foydalanuvchiga yopishtirishi mumkin.

### 3. Tuzatilgan kod

```ts run
type Cookie = { name: string; value: string; domain: string; hostOnly: boolean; path: string; secure: boolean; httpOnly: boolean };
type Ctx = { host: string; secure: boolean };

// O'quv modeli: brauzerning cookie qoidalarining kichik qismi
class Jar {
  cookies: Cookie[] = [];
  set(header: string, ctx: Ctx): boolean {
    const [pair, ...attrs] = header.split(";").map((s) => s.trim());
    const eq = pair.indexOf("=");
    const name = pair.slice(0, eq), value = pair.slice(eq + 1);
    const a = new Map(attrs.map((s) => { const i = s.indexOf("="); return i < 0 ? [s.toLowerCase(), ""] : [s.slice(0, i).toLowerCase(), s.slice(i + 1)]; }));
    const domain = a.get("domain")?.toLowerCase();
    if (domain && ctx.host !== domain && !ctx.host.endsWith("." + domain)) return false;
    if (a.has("secure") && !ctx.secure) return false;
    if ((name.startsWith("__Secure-") || name.startsWith("__Host-")) && !(a.has("secure") && ctx.secure)) return false;
    if (name.startsWith("__Host-") && (domain || a.get("path") !== "/")) return false;
    const c: Cookie = { name, value, domain: domain ?? ctx.host, hostOnly: !domain, path: a.get("path") ?? "/", secure: a.has("secure"), httpOnly: a.has("httponly") };
    this.cookies = this.cookies.filter((o) => !(o.name === c.name && o.domain === c.domain && o.path === c.path));
    this.cookies.push(c);
    return true;
  }
  private match(c: Cookie, ctx: Ctx): boolean {
    const hostOk = c.hostOnly ? ctx.host === c.domain : ctx.host === c.domain || ctx.host.endsWith("." + c.domain);
    return hostOk && (!c.secure || ctx.secure);
  }
  // Serverga ketadigan Cookie header'i
  header(ctx: Ctx): string {
    return this.cookies.filter((c) => this.match(c, ctx)).map((c) => `${c.name}=${c.value}`).join("; ");
  }
  // Sahifa skripti ko'radigan document.cookie (HttpOnly yashiriladi)
  documentCookie(ctx: Ctx): string {
    return this.cookies.filter((c) => this.match(c, ctx) && !c.httpOnly).map((c) => `${c.name}=${c.value}`).join("; ");
  }
}

const app: Ctx = { host: "app.fleet.example", secure: true };
const blog: Ctx = { host: "blog.fleet.example", secure: true };
const jar = new Jar();
jar.set("__Host-sid=real-session-1; Secure; HttpOnly; SameSite=Lax; Path=/", app);

console.log("1) XSS document.cookie:", JSON.stringify(jar.documentCookie(app)));
console.log("2) subdomen Domain bilan:", jar.set("__Host-sid=attacker; Domain=fleet.example; Secure; Path=/", blog));
console.log("   subdomen o'z hostiga:", jar.set("__Host-sid=attacker; Secure; Path=/", blog));
console.log("   server ko'radi:", jar.header(app));
console.log("3) HTTP kontekstdan:", jar.set("__Host-sid=x; Secure; Path=/", { host: app.host, secure: false }));
```

```text
1) XSS document.cookie: ""
2) subdomen Domain bilan: false
   subdomen o'z hostiga: true
   server ko'radi: __Host-sid=real-session-1
3) HTTP kontekstdan: false
```

Tuzatish nima uchun yetarli. Invariant: sessiya cookie'si faqat `app.fleet.example` ning o'z HTTPS sahifasi tomonidan yozilishi mumkin. Birinchi hujum (XSS orqali o'qish): `HttpOnly` skriptdan cookie'ni yashirdi. Ikkinchi hujum (subdomen yozishi): `Domain` bilan prefiksli cookie rad etildi; subdomen faqat o'z host-only cookie'sini yozdi, u `app` ga yuborilmaydi. Uchinchi hujum (HTTP kontekst): `Secure` cookie ochiq kontekstdan o'rnatilmaydi.

Yopilmagani: XSS'ning o'zi (hujumchi sahifadan so'rov yubora oladi), `SameSite` ning haqiqiy brauzer xatti-harakati (model uni ko'rsatmaydi), va cookie qiymatining kuchsizligi. Prefiks faqat brauzer qo'llab-quvvatlaganda ishlaydi; qo'llamaydigan eski mijozda u oddiy nom bo'lib qoladi, va sizning serveringiz buni bilmaydi.

## Qachon qo'llamaslik kerak

- `__Host-` prefiksi bir nechta subdomen o'rtasida bitta sessiyani ulashadigan arxitekturaga to'g'ri kelmaydi (`app.` va `admin.` bitta cookie'ni ishlatsa). Ularni alohida host-only cookie'larga ajrating yoki markaziy auth domenidan token almashinuvini ishlating (48-49 darslar). Domain'li cookie bilan davom etsangiz, barcha subdomenlar ishonchli doiraga kiradi va hisobga olinishi kerak.
- `SameSite=Strict` foydalanuvchi tajribasini yomonlashtirishi mumkin: tashqi havola (email, messenger) orqali ochilgan sahifa foydalanuvchini tizimga kirmagandek ko'rsatadi. Ko'p ilova uchun `Lax` yaxshi kelishuv; `Strict` ni sezgir amallar (moliyaviy sozlamalar) uchun alohida cookie'da ishlating.
- `SameSite=None` kerak bo'lgan holatlar mavjud (uchinchi tomon iframe, widget, cross-site SSO). Bunda CSRF himoyasi faqat cookie'ga tayanolmaydi: token yoki Fetch Metadata kerak (17, 36-darslar).
- Mobil ilova yoki server-server integratsiyasida cookie o'rniga `Authorization` header ishlatiladi; cookie atributlari u yerda ma'noga ega emas.
- `HttpOnly` ni o'chirish kerak bo'lgan holat kam: frontend o'qishi kerak bo'lgan qiymat (til tanlovi, tema) uchun alohida, sezgir bo'lmagan cookie ishlating, sessiyani emas.

## Stack'da: Fastify, NestJS va Next.js

Fastify'da `@fastify/cookie`, Next.js'da `cookies()` API (`next/headers`) cookie atributlarini beradi. Qoida bitta: sessiya cookie'sini bitta joyda yig'ing va atributlarni konfiguratsiyaga chiqarmang (atribut qo'shishni unutish qiyin bo'lishi uchun). Quyidagi parcha ishga tushirilmaydi (framework kerak); faqat sintaksis jihatidan tekshirilgan.

```ts
import Fastify from "fastify";
import cookie from "@fastify/cookie";

const app = Fastify();
await app.register(cookie);

const SESSION_COOKIE = "__Host-sid";

app.post("/auth/login", async (req, reply) => {
  const sessionId = await createSession(req.body as { email: string; password: string });
  reply.setCookie(SESSION_COOKIE, sessionId, {
    path: "/",          // __Host- uchun shart
    secure: true,       // __Host- uchun shart
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60,    // sekundlarda
    // domain: ko'rsatilmaydi
  });
  return { ok: true };
});

declare function createSession(input: { email: string; password: string }): Promise<string>;
```

`@fastify/cookie` opsiyalarining aniq nomlari va qiymatlari versiyaga qarab o'zgarishi mumkin: o'rnatilgan versiya hujjatini tekshiring. Express'dagi `cookie-session` va `express-session` paketlari ham xuddi shu atributlarni oladi, lekin standart qiymatlari turlicha, shuning uchun hamma atributni aniq yozing.

## Xulosa

- Cookie brauzer tomonidan avtomatik yuboriladi va origin emas, host/Domain bo'yicha bog'lanadi. Port va sxema bo'yicha izolyatsiya yo'q.
- `Secure` ochiq tarmoqdan, `HttpOnly` skriptdan o'qishdan, `SameSite` cross-site yuborishdan himoya qiladi; ularning hech biri XSS'ning o'zini to'xtatmaydi.
- `Domain` ni faqat kerak bo'lganda bering: u cookie doirasini hamma subdomenlarga kengaytiradi. `Path` xavfsizlik chegarasi emas.
- Sessiya cookie'si uchun boshlang'ich nuqta: `__Host-` prefiksi, `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, `Domain` yo'q.
- `SameSite` ni aniq yozing, brauzer standartiga tayanmang. Lax GET orqali yon ta'sirni yopmaydi.
- Cookie tashuvchi, autentifikatsiya emas: qiymat server tomonda tekshiriladi.
