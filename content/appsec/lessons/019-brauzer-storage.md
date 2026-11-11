---
n: 19
slug: brauzer-storage
title: "Brauzer storage: token qayerda saqlanadi"
summary: "localStorage, sessionStorage, cookie va xotiradagi (in-memory) saqlash xavflari, nima uchun XSS bo'lganda localStorage'dagi token o'g'irlanishi, HttpOnly cookie va BFF yondashuvi, hamda bu yechimlarning qoldiq riskleri."
duration: 40
sources:
  - id: fastify-cookie
    note: "@fastify/cookie README: maxAge soniyada"
  - id: express-res
    note: "Express 5.x res.cookie: maxAge millisekundda; @fastify/cookie da esa soniyada"
  - id: cs-session
    note: "Session Management Cheat Sheet: localStorage va sessionStorage'da autentifikatsiya token'larini saqlamaslik, HttpOnly cookie yoki BFF tavsiyasi, Web Workers bo'limi"
  - id: rfc10017
    note: "RFC 10017 (BCP 212) 8.3-bo'lim: refresh token'ni Web Worker'da ajratish mumkin, lekin hujumchi yangi Authorization Code oqimi bilan o'z token'ini olishiga bu to'sqinlik qilmaydi"
  - id: mdn-cookies
    note: "MDN Cookies: HttpOnly va Secure atributlari, cookie'ning brauzer tomonidan avtomatik yuborilishi"
  - id: mdn-sop
    note: "MDN Same-origin policy: Web Storage va IndexedDB origin bo'yicha ajratiladi, shu origin'dagi JavaScript ularni o'qiy oladi"
  - id: t10-a07
    note: "A07:2025 Authentication Failures: sessiya identifikatorlarini noto'g'ri boshqarish autentifikatsiya nuqsonlari qatorida"
quiz:
  - q: "SPA login'dan keyin JWT'ni `localStorage.setItem('token', jwt)` bilan saqlaydi va har so'rovga `Authorization: Bearer` qo'shadi. Saytda bitta stored XSS topildi. Hujumchi nimaga erishadi?"
    options:
      - "Hech narsaga: XSS localStorage'ni o'qiy olmaydi"
      - "Faqat sessionStorage'ga"
      - "Token'ni o'qib, o'z serveriga yuboradi va undan ixtiyoriy vaqtda, boshqa qurilmadan foydalanadi"
      - "Faqat shu tabdagi ma'lumotlarga"
    answer: 2
    explain: "localStorage same-origin'dagi har qanday skript uchun o'qiladi, XSS skripti esa shu origin'da ishlaydi. OWASP Session Management Cheat Sheet aynan shu sababli token va sessiya identifikatorlarini localStorage va sessionStorage'da saqlamaslikni aytadi: bitta XSS hamma token'ni ochadi."
  - q: "Token `HttpOnly; Secure; SameSite=Lax` cookie'da. Shu saytdagi XSS hujumchiga nimani qoldiradi?"
    options:
      - "Token'ni o'qish imkonini beradi, chunki XSS DOM'ga to'liq ega"
      - "Tokenni o'qishni to'sadi, lekin sahifa ochiq turganda foydalanuvchi nomidan so'rov yuborish mumkin"
      - "Hech narsani: HttpOnly XSS'ni to'liq to'xtatadi"
      - "Faqat GET so'rovlarni"
    answer: 1
    explain: "HttpOnly skriptdan cookie qiymatini o'qishni to'sadi, shuning uchun token oflayn ishlatish uchun o'g'irlanmaydi. Ammo XSS sahifa kontekstida so'rov yuboradi va brauzer cookie'ni avtomatik qo'shadi. Cheat sheet ham HttpOnly faqat cookie maxfiyligini himoya qilishini yozadi."
  - q: "sessionStorage localStorage'dan qaysi jihati bilan xavfsizroq va qaysi jihati bilan bir xil?"
    options:
      - "Tab yopilganda ma'lumot yo'qoladi va tablararo ulashilmaydi; lekin shu origin'dagi skript uchun baribir o'qiladi, shuning uchun XSS'dan himoya qilmaydi"
      - "Shifrlangan saqlanadi; XSS'dan to'liq himoya qiladi"
      - "Faqat HTTPS'da ishlaydi, shuning uchun xavfsiz"
      - "Hech qanday farqi yo'q"
    answer: 0
    explain: "Cheat sheet: sessionStorage oyna/tab kontekstiga bog'langan va brauzer sessiyasi tugagach yo'qoladi, lekin same-origin skriptlar uchun ochiq va diskda shifrlanishi standart talab emas. Shuning uchun u token saqlash uchun tavsiya etilmaydi."
  - q: "Backend-for-Frontend (BFF) yondashuvida refresh va access token'lar qayerda turadi?"
    options:
      - "Brauzerda localStorage'da, lekin shifrlangan"
      - "URL fragmentida"
      - "Brauzerning IndexedDB'sida"
      - "Serverda (BFF); brauzerga faqat HttpOnly sessiya cookie'si beriladi"
    answer: 3
    explain: "BFF'da OAuth token'larni server ushlaydi, brauzer BFF bilan oddiy cookie sessiyasida ishlaydi. Shu bilan brauzer kodi token'ni hech qachon ko'rmaydi. Cheat sheet buni HttpOnly cookie bilan birga tavsiya etilgan variant sifatida ko'rsatadi."
  - q: "Frontend Web Worker ichida tokenni xotirada saqlab, asosiy oynaga qaytarmaydi. Bu XSS'dan to'liq himoya qiladimi?"
    options:
      - "Ha: worker alohida jarayon, hujumchi unga yetmaydi"
      - "Ha, agar worker yagona faylda bo'lsa"
      - "Yo'q: zararli sahifa kodi worker interfeysi orqali token bilan amallarni so'rab, natijani o'qiy oladi; faqat to'g'ridan-to'g'ri o'g'irlashni qiyinlashtiradi"
      - "Yo'q: worker token'ni doim asosiy oynaga uzatadi"
    answer: 2
    explain: "Cheat sheet: worker mavjud sirga to'g'ridan-to'g'ri kirishni kamaytiradi, lekin XSS'dan himoya qilmaydi, chunki zararli kod worker orqali sirga bog'liq amallarni so'rashi mumkin. Brauzer sirni ishlatishi shart bo'lmasa, HttpOnly cookie yoki sirni ushlaydigan backend afzal."
  - q: "Logout paytida `localStorage.clear()` chaqiriladi, lekin server tokenni bekor qilmaydi. Muammo nima?"
    options:
      - "Muammo yo'q: token brauzerdan o'chdi"
      - "Brauzerdan o'chgan token o'g'irlangan nusxada hali amal qiladi; token serverda ham bekor qilinishi kerak (46-dars)"
      - "localStorage.clear cookie'ni o'chiradi"
      - "Logout faqat UI uchun"
    answer: 1
    explain: "Token allaqachon o'g'irlangan bo'lsa, mijozdagi tozalash nusxaga ta'sir qilmaydi. Server tomonda sessiyani bekor qilish yoki qisqa muddatli token zarur. Sessiyani bekor qilish 46-darsda."
task:
  title: "Login javobini xavfsiz saqlash"
  prompt: |
    SPA login javobini `storage` (localStorage o'rnida Map) ga saqlaydi. Hozir u tokenni ham saqlaydi. Autentifikatsiya server tomonidagi `HttpOnly` cookie orqali bo'lishi kerak.

    Kodni tuzating:

    1. `onLogin(res)` token'ni hech qayerda saqlamasin; faqat `user` (ism, tenant, tema) JSON sifatida `"user"` kaliti ostida saqlansin.
    2. `onLogout()` storage'ni to'liq tozalasin (`clear`), faqat `user` emas.
    3. Imzolarni o'zgartirmang. Oxirgi uchta `console.log` natijasi: `user`, `false`, `0`.
  lang: ts
  starter: |
    const storage = new Map<string, string>();

    type LoginResponse = { token: string; user: { name: string; tenant: string; theme: string } };

    function onLogin(res: LoginResponse): void {
      storage.set("token", res.token);
      storage.set("user", JSON.stringify(res.user));
    }

    function onLogout(): void {
      storage.delete("user");
    }

    onLogin({ token: "tok_9f3a1c", user: { name: "Dilnoza", tenant: "alfa", theme: "dark" } });
    console.log([...storage.keys()].join(","));
    console.log([...storage.values()].some((v) => v.includes("tok_9f3a1c")));
    onLogout();
    console.log(storage.size);
  solution: |
    const storage = new Map<string, string>();

    type LoginResponse = { token: string; user: { name: string; tenant: string; theme: string } };

    // Token serverdan HttpOnly cookie sifatida keladi; JS uni ko'rmaydi va saqlamaydi
    function onLogin(res: LoginResponse): void {
      storage.set("user", JSON.stringify(res.user));
    }

    function onLogout(): void {
      storage.clear();
    }

    onLogin({ token: "tok_9f3a1c", user: { name: "Dilnoza", tenant: "alfa", theme: "dark" } });
    console.log([...storage.keys()].join(","));
    console.log([...storage.values()].some((v) => v.includes("tok_9f3a1c")));
    onLogout();
    console.log(storage.size);
  solutionNotes: |
    - Token JS'ga umuman tushmaydi: server `Set-Cookie: __Host-sid=...; HttpOnly; Secure; SameSite=Lax; Path=/` beradi (13-dars). Shu sababli javob tanasida token bo'lmasligi ham kerak; bu mashqda uni ataylab qoldirdik, kod esa uni e'tiborsiz qoldiradi.
    - `user` obyektida sezgir ma'lumot yo'q (ism, tenant, tema); localStorage'ga maxfiy qiymat yozmang.
    - Logout storage'ni tozalaydi, lekin sessiyani serverda bekor qilish alohida kerak (46-dars).
    - Qoldiq risk: XSS bo'lsa, skript sahifa ochiq paytda cookie bilan so'rov yubora oladi; bu mashq XSS'ni tuzatmaydi (31-35-darslar).
    - SPA va API turli origin'da bo'lsa, cookie yuborilishi uchun CORS credentials va SameSite masalalari paydo bo'ladi (13, 14-darslar); eng sodda yo'l: bir origin yoki BFF.
  checklist:
    - "Token storage'ga yozilmaydi"
    - "Faqat sezgir bo'lmagan `user` profili saqlanadi"
    - "Logout storage'ni to'liq tozalaydi"
    - "Imzolar o'zgarmagan"
    - "Yechim XSS'ni to'xtatmasligini ayta olasiz"
---

## Muammo

Zamonaviy SPA yozayotgan dasturchi kamida bir marta shu savolga duch keladi: login'dan keyin olingan token (JWT yoki sessiya identifikatori) brauzerda qayerda saqlanadi? Internetdagi ko'p qo'llanma `localStorage.setItem("token", jwt)` ni ko'rsatadi, chunki u sodda: cookie atributlari, CORS credentials yoki CSRF haqida o'ylash shart emas, har so'rovga `Authorization` header'ini qo'shish yetadi. Muammo shuki, shu soddalik XSS bo'lganda butun autentifikatsiyani ochib tashlaydi.

Dasturchilar bu xavfni ko'pincha ikki yo'l bilan kamaytirishga urinadi: `sessionStorage` ga o'tish yoki tokenni "shifrlab" saqlash. Ikkalasi ham yordam bermaydi: skript uchun shifrni ochuvchi kalit ham sahifada. Ikkinchi yondashuv: tokenni faqat JavaScript o'zgaruvchisida (xotirada) tutish. U ancha yaxshi, lekin sahifa yangilanganda token yo'qoladi va XSS bo'lsa baribir o'qiladi.

Bu dars xotira va saqlash joylarini tizimli taqqoslaydi: nima uchun XSS shu tanlovni hal qiluvchi omil qiladi, qaysi variant nimani himoya qiladi va nimani qilmaydi. XSS'ning o'zi 31-35-darslarda, sessiyaning hayot sikli 46-darsda, JWT 47-darsda, OAuth uchun BFF 48-darsda ko'riladi.

## Asosiy g'oya

### Hujum modeli: XSS bo'lsa nima qiladi

Saqlash joyini tanlashda asosiy savol: sahifada hujumchi skripti ishlasa nima bo'ladi? 12-darsdagi SOP skriptni boshqa origin'dan himoya qiladi, lekin XSS skripti sizning origin'ingizda ishlaydi, ya'ni uning huquqlari sizning kodingiz bilan bir xil. U uch narsani qila oladi: sahifa ichidagi ma'lumotni o'qish (DOM, storage, `document.cookie`), foydalanuvchi nomidan so'rov yuborish (brauzer cookie'ni qo'shadi), va o'qilgan ma'lumotni o'z serveriga jo'natish.

OWASP Session Management Cheat Sheet bu haqda aniq: autentifikatsiya token'larini, sessiya identifikatorlarini, JWT va refresh token'larni va har qanday credential'ni `localStorage` yoki `sessionStorage` da saqlamang, chunki bu API'lar origin'dagi har qanday JavaScript uchun ochiq va bitta XSS zaifligi hamma token'ni oshkor qiladi. Tavsiya: `HttpOnly` cookie (afzal) yoki Backend-for-Frontend (BFF) yondashuvi.

### Saqlash joylari taqqoslanishi

| Joy | Skript o'qiy oladimi | Davomiylik | Avtomatik yuboriladimi | Izoh |
|---|---|---|---|---|
| `localStorage` | Ha (same-origin) | Brauzer sessiyalaridan keyin ham qoladi | Yo'q | Diskda shifrlanishi standart talab emas; tablar o'rtasida ulashiladi |
| `sessionStorage` | Ha (same-origin) | Tab/oyna sessiyasi bilan | Yo'q | Tab yopilganda yo'qoladi; tablararo ulashilmaydi |
| JS o'zgaruvchisi (xotira) | Ha (XSS ham o'qiydi) | Sahifa yangilangunga qadar | Yo'q | Yangilashda yo'qoladi; yangi token olish oqimi kerak |
| `HttpOnly` cookie | Yo'q | Cookie muddatiga qarab | Ha (brauzer qo'shadi) | CSRF himoyasi kerak (13, 36-darslar) |
| BFF (server tarafi) | Yo'q (brauzerda token yo'q) | Serverda | Brauzer BFF'ga cookie yuboradi | Qo'shimcha server qatlami |

Jadvaldagi `localStorage` va `sessionStorage` xususiyatlari (same-origin kirish, davomiylik, diskda shifrlanmasligi) Session Management Cheat Sheet'dagi tavsiflar bilan mos. Muhim tafsilot: bu API'lar cookie'dan farqli ravishda so'rovlarga avtomatik qo'shilmaydi; shu sababli ularda CSRF muammosi yo'q, lekin XSS muammosi og'irlashadi.

### HttpOnly cookie va uning chegarasi

`HttpOnly` skriptdan cookie qiymatini o'qishni to'sadi (13-dars). Token o'g'irlanmaydi, ya'ni hujumchi uni boshqa qurilmaga ko'chirib, keyinroq ishlata olmaydi. Lekin cheat sheet aniq yozadi: HttpOnly faqat cookie maxfiyligini himoya qiladi; XSS bor sahifada skript so'rov yubora oladi va brauzer cookie'ni qo'shadi. Ya'ni HttpOnly zararni "hujumchi doimiy kirish oladi" dan "hujumchi foydalanuvchi sahifada ekan harakat qiladi" ga tushiradi. Bu katta farq, lekin XSS tuzatilmaydi.

Cheat sheet afzal cookie shaklini `HttpOnly; Secure; SameSite=Strict` deb beradi, va sessiya cookie uchun `__Host-` prefiksli misol keltiradi: `Set-Cookie: __Host-SessionID=<value>; Secure; HttpOnly; SameSite=Strict; Path=/`. Prefiks cookie'ni faqat Secure, `Path=/` va `Domain`siz o'rnatishga majbur qiladi (13-dars). `Strict` boshqa saytdan kelgan havola bosilganda cookie'ni yubormaydi, shuning uchun foydalanuvchi sizning saytingizga tashqi havoladan kirganda dastlab tizimga kirmagandek ko'rinishi mumkin; bu holda `Lax` amaliy kelishuv, lekin CSRF himoyasini boshqa qatlamlar bilan to'ldirish kerak. Cheat sheet yana bir muhim ogohlantirish beradi: XSS CSRF bilan birga ishlatilsa ham, so'rovlar sessiya cookie'sini olib ketadi, chunki brauzer cookie'ni doim qo'shadi.

Cookie ishlatilganda CSRF himoyasi talab qilinadi: `SameSite` (13-dars), Fetch Metadata (17-dars) va token (36-dars). Bu `Authorization` header'li yondashuvda yo'q muammo, shuning uchun almashtirish bepul emas, lekin XSS'dan keyingi zararni kamaytirish uchun sinalgan kelishuv.

### BFF

Backend-for-Frontend: brauzer faqat BFF bilan HttpOnly cookie sessiyasida gaplashadi; OAuth/OIDC token'larni (access, refresh) BFF serveri ushlaydi va API chaqiruvlarida o'zi qo'shadi. Brauzer kodi token'ni umuman ko'rmaydi. Cheat sheet BFF'ni HttpOnly cookie bilan birga tavsiya etilgan variant sifatida keltiradi va OAuth brauzer ilovalari bo'yicha ko'rsatmaga havola beradi (batafsil 48-darsda). Qiymati: refresh token kabi uzoq muddatli sirlar brauzerdan butunlay chiqadi.

## Chuqurroq: nimani himoya qiladi, nimani yo'q

Quyidagi `run` bloki yuqoridagilarni o'quv brauzer modelida ko'rsatadi: ikki rejim (token localStorage'da va token HttpOnly cookie'da) va ikkala holatda XSS skripti. Bu real brauzer emas; maqsad ikki ta'sirni ajratish: tokenni o'g'irlash (exfiltration) va sahifa ochiq turganda so'rov yuborish.

```ts run
const SESSION = "tok_9f3a1c";

// Server: Bearer token yoki sid cookie bilan autentifikatsiya
function api(auth: { bearer?: string; cookie?: string }): string {
  const ok = auth.bearer === SESSION || auth.cookie === `sid=${SESSION}`;
  return ok ? '{"vehicles":42}' : "401";
}

// O'quv brauzeri: skript nimani ko'ra oladi va nimani qila oladi
function makeBrowser(mode: "weak" | "fixed") {
  const local = new Map<string, string>();
  if (mode === "weak") local.set("token", SESSION); // SPA tokenni localStorage'da saqlaydi
  const cookies = mode === "fixed" ? [{ name: "sid", value: SESSION, httpOnly: true }] : [];
  return {
    localStorage: { getItem: (k: string) => local.get(k) ?? null },
    documentCookie: () => cookies.filter((c) => !c.httpOnly).map((c) => `${c.name}=${c.value}`).join("; "),
    // Sahifaning o'z fetch'i: brauzer HttpOnly cookie'ni ham avtomatik qo'shadi
    fetchOwnApi: () => api({ bearer: local.get("token"), cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; ") }),
  };
}

// XSS orqali kiritilgan skript sahifa ichida ishlaydi
function xssScript(win: ReturnType<typeof makeBrowser>) {
  const stolen = win.localStorage.getItem("token") ?? (win.documentCookie().replace(/^sid=/, "") || null);
  const token = stolen;
  return { exfiltrated: token, whileOpen: win.fetchOwnApi() };
}

console.log("localStorage:", xssScript(makeBrowser("weak")));
console.log("HttpOnly cookie:", xssScript(makeBrowser("fixed")));
```

```text
localStorage: { exfiltrated: 'tok_9f3a1c', whileOpen: '{"vehicles":42}' }
HttpOnly cookie: { exfiltrated: null, whileOpen: '{"vehicles":42}' }
```

Birinchi rejimda skript tokenni o'qib oldi (`exfiltrated`) va hujumchi uni istalgan vaqt ishlatadi. Ikkinchi rejimda token o'qilmadi (`null`), lekin skript sahifa ochiq turganda API'ga murojaat qila oldi (`whileOpen`).

### Xotirada saqlash va Web Worker

Tokenni faqat JS o'zgaruvchisida tutish va sahifa yangilanganda qayta olish (masalan, cookie bilan refresh) yondashuvi bor. Cheat sheet Web Worker haqida alohida bo'lim beradi: worker sirni xotirada ushlab, asosiy oynaga qaytarmasa, mavjud sirga to'g'ridan-to'g'ri kirish kamayadi, lekin bu XSS'dan himoya qilmaydi, chunki zararli kod worker orqali sirga bog'liq amallarni so'rab, natijani o'qiy oladi. Brauzer kodiga sir kerak bo'lmasa, HttpOnly cookie yoki sirni backend ushlashi afzal.

Cheat sheet worker haqida yana bir cheklovni qayd etadi: refresh token'ni alohida ajratib qo'yish zararli kodning boshqa authorization oqimi orqali yangi token olishiga to'sqinlik qilmaydi (RFC 10017, "OAuth 2.0 for Browser-Based Applications", BCP 212, 8.3-bo'lim: refresh token'ni worker'da saqlash hujumchining yangi Authorization Code oqimini ishga tushirib o'z token'ini olishiga to'sqinlik qilmaydi). Worker faqat brauzer kodiga sirga bog'liq amallar haqiqatan kerak bo'lganda mantiqli; bunda xabar interfeysini tor qiling va ruxsatni serverda tekshiring. Worker sirni sahifa yangilanganda saqlamaydi, shuning uchun uni faqat qayta tiklanishi shart bo'lmagan sirlar uchun ishlating.

### Boshqa storage turlari

MDN Same-origin policy hujjatiga ko'ra Web Storage va IndexedDB origin bo'yicha ajratiladi: har bir origin'ning o'z saqlagichi bor va boshqa origin'dagi JavaScript uni o'qiy olmaydi. Lekin bu ajratish aynan origin darajasida: shu origin'da ishlayotgan har qanday skript, jumladan XSS orqali kiritilgani, IndexedDB'ni ham localStorage kabi o'qiydi. Shu sababli sezgir tokenni "murakkabroq" storage'ga ko'chirish himoya bermaydi. Brauzer hujumchi nazoratidagi kod ishlayotgan muhit sifatida qaralishi kerak.

### Storage'ning boshqa xususiyatlari

Cheat sheet storage'ning xavfsizlikka bevosita tegmaydigan, lekin tanlovga ta'sir qiladigan tomonlarini ham aytadi. `localStorage` brauzer sessiyalaridan keyin ham saqlanadi, shuning uchun ma'lumot boshqa tizim foydalanuvchilariga uzoqroq muddat ochiq qoladi, va standart diskda shifrlashni talab qilmaydi. Bir nechta oyna yoki thread bir vaqtda yozishi mumkin, shu sababli u lock'siz hisoblanadi va race condition xavfi bor. `sessionStorage` tab yopilganda yo'qoladi, lekin tab qayta ishlatilsa yoki ochiq qoldirilsa, bu kirishni to'xtatmaydi; ma'lumot garbage collection bo'lguncha xotirada ham qolishi mumkin. WHATWG `localStorage`ni oynalar va sessiyalar bo'ylab kerak bo'ladigan, hajmi katta ma'lumot uchun, `sessionStorage`ni esa bitta ish oqimiga tegishli ma'lumot uchun (masalan, bilet band qilish tafsilotlari) taklif qiladi. Ikkalasi ham sir uchun emas, tema, til va forma qoralamasi kabi ma'lumot uchun mos.

### Hayot sikli

Token saqlanadigan joy qanday bo'lmasin, logout paytida mijozda tozalash yetarli emas: token o'g'irlangan bo'lsa, nusxa ishlashda davom etadi. Serverda sessiyani bekor qilish yoki access token'ni qisqa muddatli qilish kerak (46-47-darslar).

## Misol: token localStorage'da

Hammasi o'quv modeli va hujum faqat unga qarshi.

### 1. Zaif kod

SPA tokenni localStorage'da saqlaydi va `Authorization` header bilan yuboradi:

```ts run
const SESSION = "tok_9f3a1c";

// Server: Bearer token yoki sid cookie bilan autentifikatsiya
function api(auth: { bearer?: string; cookie?: string }): string {
  const ok = auth.bearer === SESSION || auth.cookie === `sid=${SESSION}`;
  return ok ? '{"vehicles":42}' : "401";
}

// O'quv brauzeri: skript nimani ko'ra oladi va nimani qila oladi
function makeBrowser(mode: "weak" | "fixed") {
  const local = new Map<string, string>();
  if (mode === "weak") local.set("token", SESSION); // SPA tokenni localStorage'da saqlaydi
  const cookies = mode === "fixed" ? [{ name: "sid", value: SESSION, httpOnly: true }] : [];
  return {
    localStorage: { getItem: (k: string) => local.get(k) ?? null },
    documentCookie: () => cookies.filter((c) => !c.httpOnly).map((c) => `${c.name}=${c.value}`).join("; "),
    // Sahifaning o'z fetch'i: brauzer HttpOnly cookie'ni ham avtomatik qo'shadi
    fetchOwnApi: () => api({ bearer: local.get("token"), cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; ") }),
  };
}

// XSS orqali kiritilgan skript sahifa ichida ishlaydi
function xssScript(win: ReturnType<typeof makeBrowser>) {
  const stolen = win.localStorage.getItem("token") ?? (win.documentCookie().replace(/^sid=/, "") || null);
  const token = stolen;
  return { exfiltrated: token, whileOpen: win.fetchOwnApi() };
}

// ZAIF: token localStorage'da, JS uni o'qiy oladi
const win = makeBrowser("weak");
console.log("sahifaning o'z so'rovi:", win.fetchOwnApi());
console.log("localStorage'da token bor:", win.localStorage.getItem("token") !== null);
```

```text
sahifaning o'z so'rovi: {"vehicles":42}
localStorage'da token bor: true
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu XSS orqali tokenni o'g'irlash usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Saytda stored XSS bor. Kiritilgan skript localStorage'ni o'qiydi, tokenni hujumchi serveriga yuboradi (bu yerda faqat o'qilgan qiymatni ko'rsatamiz):

```ts run
const SESSION = "tok_9f3a1c";

// Server: Bearer token yoki sid cookie bilan autentifikatsiya
function api(auth: { bearer?: string; cookie?: string }): string {
  const ok = auth.bearer === SESSION || auth.cookie === `sid=${SESSION}`;
  return ok ? '{"vehicles":42}' : "401";
}

// O'quv brauzeri: skript nimani ko'ra oladi va nimani qila oladi
function makeBrowser(mode: "weak" | "fixed") {
  const local = new Map<string, string>();
  if (mode === "weak") local.set("token", SESSION); // SPA tokenni localStorage'da saqlaydi
  const cookies = mode === "fixed" ? [{ name: "sid", value: SESSION, httpOnly: true }] : [];
  return {
    localStorage: { getItem: (k: string) => local.get(k) ?? null },
    documentCookie: () => cookies.filter((c) => !c.httpOnly).map((c) => `${c.name}=${c.value}`).join("; "),
    // Sahifaning o'z fetch'i: brauzer HttpOnly cookie'ni ham avtomatik qo'shadi
    fetchOwnApi: () => api({ bearer: local.get("token"), cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; ") }),
  };
}

// XSS orqali kiritilgan skript sahifa ichida ishlaydi
function xssScript(win: ReturnType<typeof makeBrowser>) {
  const stolen = win.localStorage.getItem("token") ?? (win.documentCookie().replace(/^sid=/, "") || null);
  const token = stolen;
  return { exfiltrated: token, whileOpen: win.fetchOwnApi() };
}

const result = xssScript(makeBrowser("weak"));
console.log("o'g'irlangan token:", result.exfiltrated);
console.log("hujumchi keyinroq o'zi chaqiradi:", api({ bearer: result.exfiltrated ?? undefined }));
```

```text
o'g'irlangan token: tok_9f3a1c
hujumchi keyinroq o'zi chaqiradi: {"vehicles":42}
```

Hujumchi tokenni o'z kompyuteriga olib ketdi va sahifa yopilgandan keyin ham, boshqa qurilmadan ham API'ni chaqira oladi (token amal qilguncha).

### 3. Tuzatilgan kod

Token `HttpOnly` cookie'da, JS uni umuman ko'rmaydi:

```ts run
const SESSION = "tok_9f3a1c";

// Server: Bearer token yoki sid cookie bilan autentifikatsiya
function api(auth: { bearer?: string; cookie?: string }): string {
  const ok = auth.bearer === SESSION || auth.cookie === `sid=${SESSION}`;
  return ok ? '{"vehicles":42}' : "401";
}

// O'quv brauzeri: skript nimani ko'ra oladi va nimani qila oladi
function makeBrowser(mode: "weak" | "fixed") {
  const local = new Map<string, string>();
  if (mode === "weak") local.set("token", SESSION); // SPA tokenni localStorage'da saqlaydi
  const cookies = mode === "fixed" ? [{ name: "sid", value: SESSION, httpOnly: true }] : [];
  return {
    localStorage: { getItem: (k: string) => local.get(k) ?? null },
    documentCookie: () => cookies.filter((c) => !c.httpOnly).map((c) => `${c.name}=${c.value}`).join("; "),
    // Sahifaning o'z fetch'i: brauzer HttpOnly cookie'ni ham avtomatik qo'shadi
    fetchOwnApi: () => api({ bearer: local.get("token"), cookie: cookies.map((c) => `${c.name}=${c.value}`).join("; ") }),
  };
}

// XSS orqali kiritilgan skript sahifa ichida ishlaydi
function xssScript(win: ReturnType<typeof makeBrowser>) {
  const stolen = win.localStorage.getItem("token") ?? (win.documentCookie().replace(/^sid=/, "") || null);
  const token = stolen;
  return { exfiltrated: token, whileOpen: win.fetchOwnApi() };
}

const result = xssScript(makeBrowser("fixed"));
console.log("o'g'irlangan token:", result.exfiltrated);
console.log("hujumchi keyinroq o'zi chaqiradi:", api({ bearer: result.exfiltrated ?? undefined }));
console.log("sahifa ochiq paytda skript:", result.whileOpen);
```

```text
o'g'irlangan token: null
hujumchi keyinroq o'zi chaqiradi: 401
sahifa ochiq paytda skript: {"vehicles":42}
```

Tuzatish nima uchun yetarli. Invariant: token JavaScript uchun ko'rinmaydi, shuning uchun uni sahifadan tashqariga chiqarib, keyinroq ishlatib bo'lmaydi. Ko'rsatilgan hujum (tokenni o'qish va keyinroq ishlatish) yopildi: ikkinchi qatorda `401`.

Yopilmagani. Uchinchi qatorda ko'rinib turibdi: sahifa ochiq paytda XSS skripti o'sha cookie bilan so'rov yubora oladi, ya'ni harakatlar foydalanuvchi nomidan bajarilishi mumkin. Shuning uchun asosiy himoya XSS'ni oldini olish (31-35-darslar), CSP (15-dars) va xavfli amallar uchun qo'shimcha tasdiqlash (qayta autentifikatsiya, MFA). Cookie yondashuvi CSRF himoyasini ham talab qiladi.

## Qachon qo'llamaslik kerak

- Cookie yondashuvi har holatda mos emas. Mobil ilova yoki uchinchi tomon API mijozlari cookie bilan emas, token bilan ishlaydi; ular uchun `Authorization` header'li token to'g'ri tanlov, saqlash esa platforma xavfsiz saqlagichida (Keychain, Keystore) bo'ladi, brauzer storage'da emas.
- Brauzer kodi va API turli origin'da bo'lsa, cookie uchun CORS credentials va SameSite=None kerak, bu xavfsizlik va murakkablikni oshiradi (14-dars). Ko'pincha reverse proxy orqali bir origin'ga olib kelish yoki BFF eng sodda yechim.
- BFF qo'shimcha servis: kichik jamoa uchun operatsion yuk. Agar ilova faqat o'z backend'i bilan gaplashsa va bir origin'da bo'lsa, oddiy HttpOnly sessiya cookie'si yetarli; BFF uchinchi tomon OAuth token'lari bilan ishlaganda o'zini oqlaydi.
- Sensitive bo'lmagan ma'lumot (tema, til, UI holati) localStorage'ga yoziladi: bu normal. Qoida token va credential uchun.
- Qisqa muddatli access token'ni xotirada saqlash (refresh HttpOnly cookie orqali) amaliy kelishuv bo'lishi mumkin, lekin XSS'dan himoya qilmaydi; qaror risk va foydalanuvchi tajribasi o'rtasidagi tanlov.

## Stack'da: Next.js va NestJS

Next.js'da sessiya cookie'sini server tomonda o'rnatish (Route Handler yoki Server Action) eng sodda yo'l: brauzer kodi tokenni umuman ko'rmaydi. Next.js ma'lumotlar xavfsizligi hujjati sessiya va ruxsat tekshiruvini serverda bajarishni tavsiya qiladi (58-dars). NestJS'da login endpoint'i cookie'ni `res.cookie` bilan beradi. Quyidagi kod ishga tushirilmaydi (framework kerak), sintaksis tekshirilgan.

```ts
import { Body, Controller, Post, Res } from "@nestjs/common";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  @Post("login")
  async login(@Body() body: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
    const { sessionId, user } = await this.authenticate(body);

    // Token javob tanasida emas, faqat cookie'da
    res.cookie("__Host-sid", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, // millisekund
    });
    return { user }; // faqat sezgir bo'lmagan profil
  }

  private async authenticate(_b: { email: string; password: string }): Promise<{ sessionId: string; user: { name: string; tenant: string } }> {
    throw new Error("amalga oshirilmagan");
  }
}
```

Express `res.cookie` da `maxAge` millisekundda, Fastify `setCookie` da esa sekundda (13-dars): framework hujjatini tekshiring. Frontend tomonda `fetch` ga `credentials: "include"` (turli origin bo'lsa) yoki bir origin bo'lsa standart sozlama yetadi.

## Xulosa

- XSS bo'lganda hujumchi skripti sizning origin'ingizda ishlaydi: localStorage, sessionStorage va xotiradagi o'zgaruvchilarning hammasini o'qiy oladi.
- OWASP Session Management Cheat Sheet token, sessiya identifikatori, JWT va refresh token'ni localStorage va sessionStorage'da saqlamaslikni aytadi; tavsiya: `HttpOnly` cookie yoki BFF.
- `HttpOnly` tokenni o'g'irlanishdan himoya qiladi, lekin sahifa ochiq paytda XSS orqali so'rov yuborishni to'xtatmaydi; cookie bilan CSRF himoyasi ham kerak.
- Web Worker yoki "shifrlash" XSS'dan himoya qilmaydi, faqat to'g'ridan-to'g'ri o'qishni qiyinlashtiradi.
- BFF refresh va access token'larni brauzerdan butunlay chiqaradi; bu qo'shimcha servis hisobiga keladi.
- Logout serverda sessiyani bekor qilishi kerak; mijozdagi tozalash o'g'irlangan nusxaga ta'sir qilmaydi.
