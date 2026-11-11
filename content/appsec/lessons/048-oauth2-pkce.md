---
n: 48
slug: oauth2-pkce
title: "OAuth 2.0: oqimlar, PKCE va security best practice"
summary: "OAuth 2.0 rollari va authorization code grant, redirect URI'ni aniq solishtirish, PKCE (S256) mexanikasi va downgrade himoyasi, state va mix-up, implicit va password grant'larning nega tavsiya etilmasligi, token audience va zaif hamda to'g'ri authorization server."
duration: 50
sources:
  - id: rfc6749
    note: "OAuth 2.0 rollari (resource owner, client, authorization server, resource server) va authorization code grant oqimi; redirect URI va state parametrlari"
  - id: rfc7636
    note: "PKCE: code_verifier, code_challenge, S256 = BASE64URL(SHA256(ASCII(code_verifier))); klient S256 ni qo'llay olsa, S256 ishlatishi shart; plain faqat S256 ni qo'llay olmaydigan klient uchun"
  - id: rfc9700
    note: "Best Current Practice: redirect URI'ni aniq qator solishtirish bilan tekshirish (MUST, localhost portidan tashqari); public klientlar PKCE ishlatishi shart (MUST), confidential klientlar uchun tavsiya; implicit grant (response type token) ishlatilmasligi (SHOULD NOT) va code grant ishlatilishi"
  - id: cs-oauth2
    note: "OAuth2 Cheat Sheet: authorization code grant + PKCE hamma klient turlari uchun; implicit grant eskirgan; resource owner password credentials grant ishlatilmaydi; PKCE downgrade'ga qarshi code_verifier faqat code_challenge bo'lganda qabul qilinishi; access token auditoriyasi (audience) cheklanishi; open redirector'lar; iss orqali mix-up'ga qarshi"
quiz:
  - q: "Authorization server `redirect_uri.startsWith(\"https://app.avtopark.example\")` bilan tekshiradi. Hujumchi qaysi qiymat bilan authorization code'ni o'ziga yo'naltira oladi?"
    options:
      - "`https://app.avtopark.example/callback`"
      - "`https://app.avtopark.example.evil.test/cb`"
      - "`http://localhost`"
      - "Hech qaysi: prefiks tekshiruvi xavfsiz"
    answer: 1
    explain: "Prefiks tekshiruvi boshqa domenga ham mos keladi (`.evil.test` qo'shimchasi). RFC 9700 kayd etilgan URI'larga aniq qator solishtirishni talab qiladi (localhost portidan tashqari). Birinchi qiymat qonuniy URI."
  - q: "PKCE authorization code'ni ushlab olgan hujumchiga nima uchun foyda bermaydi?"
    options:
      - "Code shifrlangan bo'ladi"
      - "Code bir daqiqada tugaydi"
      - "Hujumchi client_secret bilan almashtiradi"
      - "Token so'rovida klient boshlang'ich `code_verifier`ni ko'rsatishi shart; hujumchi faqat code ni biladi, verifier klientda qoladi va challenge'dan uni tiklab bo'lmaydi"
    answer: 3
    explain: "Authorization so'rovida faqat verifier'ning hash'i (S256 challenge) yuboriladi. Code ushlangan bo'lsa ham, token endpoint verifier'ni talab qiladi va uni hujumchi bilmaydi. Muddat va client_secret public klientlar uchun yechim emas."
  - q: "SPA uchun Implicit grant (`response_type=token`) ishlatilmoqda. Tavsiya?"
    options:
      - "Authorization code grant + PKCE'ga o'tish: RFC 9700 klientlar implicit grantdan foydalanmasligi kerakligini aytadi (SHOULD NOT)"
      - "Qoldirish: SPA uchun yagona variant"
      - "Faqat HTTPS qo'shish"
      - "Password grant'ga o'tish"
    answer: 0
    explain: "Implicit grant access token'ni authorization javobida (URL fragmentida) qaytaradi: brauzer tarixi va sahifadagi skriptlar uchun ochiq. Cheat sheet hamma klient turi, shu jumladan SPA uchun, code grant + PKCE ni talab qiladi."
  - q: "Mijoz ilovasi foydalanuvchi login va parolini to'g'ridan-to'g'ri qabul qilib, authorization server'ning token endpoint'iga yuboradi (password grant). Asosiy muammo?"
    options:
      - "Sekin ishlaydi"
      - "Token ishlamaydi"
      - "Klient foydalanuvchi parolini ko'radi va saqlashi mumkin; MFA/passkey kabi ikkinchi faktor ishlatish ham qiyinlashadi"
      - "Faqat SPA'larga tegishli"
    answer: 2
    explain: "OAuth'ning asosiy g'oyasi klientga parol bermaslik. Password grant buni buzadi: klient credential'ni ko'radi, hujum yuzasi kengayadi. Cheat sheet bu grantni ishlatmaslikni aytadi."
  - q: "PKCE downgrade hujumi: hujumchi authorization so'rovidan `code_challenge` ni olib tashlaydi, keyin ushlangan code'ni token endpoint'ga `code_verifier`siz yuboradi. Server qanday himoyalanadi?"
    options:
      - "Server challenge yo'q bo'lsa ham code'ni qabul qiladi"
      - "Server hamma code'ni 10 soniyaga cheklaydi"
      - "Server PKCE'ni butunlay o'chiradi"
      - "Server public klient uchun challenge'siz authorization so'rovini rad etadi va challenge bo'lgan holda verifier'ni majburiy talab qiladi; verifier faqat challenge bo'lsa qabul qilinadi"
    answer: 3
    explain: "Himoya ikki tomonlama: PKCE talab qilinadigan klientlar uchun challenge'siz so'rov rad etiladi, challenge bo'lsa token so'rovida verifier majburiy. Cheat sheet ham verifier faqat authorization so'rovida challenge bo'lsa qabul qilinishini aytadi."
  - q: "Confidential klient (backend) uchun PKCE kerakmi?"
    options:
      - "Yo'q, client_secret hamma narsani hal qiladi"
      - "Ha: public klientlar uchun majburiy, confidential klientlar uchun ham tavsiya etiladi (qo'shimcha himoya va CSRF/code injection'ga qarshi)"
      - "Yo'q, PKCE faqat mobil ilovalarga mo'ljallangan"
      - "Faqat test muhitida"
    answer: 1
    explain: "RFC 9700: public klientlar PKCE ishlatishi shart, confidential klientlar uchun ham tavsiya etiladi. PKCE faqat native ilovalar uchun yaratilgan edi, lekin keyin umumiy himoyaga aylangan. Hozirgi tavsiya: hamma klient turi uchun code + PKCE."
task:
  title: "Authorization so'rovini tekshirish"
  prompt: |
    `validateAuthorizeRequest(req)` authorization endpoint'ga kelgan so'rovni tekshiradi. Hozir redirect URI prefiks bilan tekshiriladi va boshqa tekshiruvlar yo'q.

    Tuzating. Tekshiruv tartibi va xato kodlari:
    1. `client_id` ro'yxatda yo'q: `"invalid_client"`;
    2. `redirect_uri` klientning kayd etilgan URI'laridan biriga aniq teng bo'lmasa: `"invalid_redirect_uri"`;
    3. `response_type` `"code"` bo'lmasa: `"unsupported_response_type"`;
    4. `code_challenge` yo'q yoki `code_challenge_method` `"S256"` bo'lmasa: `"pkce_required"`.

    Hammasi to'g'ri bo'lsa `"ok"`. Imzoni o'zgartirmang. Kutilgan chiqish: `ok`, `invalid_redirect_uri`, `unsupported_response_type`, `pkce_required`, `pkce_required`, `invalid_client`.
  lang: ts
  starter: |
    type Req = {
      client_id: string;
      redirect_uri: string;
      response_type: string;
      code_challenge?: string;
      code_challenge_method?: string;
    };

    const clients: Record<string, { redirectUris: string[] }> = {
      "fleet-web": { redirectUris: ["https://app.avtopark.example/callback"] },
    };

    function validateAuthorizeRequest(req: Req): string {
      const c = clients[req.client_id];
      if (!c) return "invalid_client";
      if (!req.redirect_uri.startsWith("https://app.avtopark.example")) return "invalid_redirect_uri";
      return "ok";
    }

    const base: Req = {
      client_id: "fleet-web",
      redirect_uri: "https://app.avtopark.example/callback",
      response_type: "code",
      code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
      code_challenge_method: "S256",
    };
    console.log(validateAuthorizeRequest(base));
    console.log(validateAuthorizeRequest({ ...base, redirect_uri: "https://app.avtopark.example.evil.test/cb" }));
    console.log(validateAuthorizeRequest({ ...base, response_type: "token" }));
    console.log(validateAuthorizeRequest({ ...base, code_challenge: undefined }));
    console.log(validateAuthorizeRequest({ ...base, code_challenge_method: "plain" }));
    console.log(validateAuthorizeRequest({ ...base, client_id: "unknown" }));
  solution: |
    type Req = {
      client_id: string;
      redirect_uri: string;
      response_type: string;
      code_challenge?: string;
      code_challenge_method?: string;
    };

    const clients: Record<string, { redirectUris: string[] }> = {
      "fleet-web": { redirectUris: ["https://app.avtopark.example/callback"] },
    };

    function validateAuthorizeRequest(req: Req): string {
      const c = Object.hasOwn(clients, req.client_id) ? clients[req.client_id] : undefined;
      if (!c) return "invalid_client";
      if (!c.redirectUris.includes(req.redirect_uri)) return "invalid_redirect_uri";
      if (req.response_type !== "code") return "unsupported_response_type";
      if (!req.code_challenge || req.code_challenge_method !== "S256") return "pkce_required";
      return "ok";
    }

    const base: Req = {
      client_id: "fleet-web",
      redirect_uri: "https://app.avtopark.example/callback",
      response_type: "code",
      code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
      code_challenge_method: "S256",
    };
    console.log(validateAuthorizeRequest(base));
    console.log(validateAuthorizeRequest({ ...base, redirect_uri: "https://app.avtopark.example.evil.test/cb" }));
    console.log(validateAuthorizeRequest({ ...base, response_type: "token" }));
    console.log(validateAuthorizeRequest({ ...base, code_challenge: undefined }));
    console.log(validateAuthorizeRequest({ ...base, code_challenge_method: "plain" }));
    console.log(validateAuthorizeRequest({ ...base, client_id: "unknown" }));
  solutionNotes: |
    - `includes` massivda aniq qator tengligini tekshiradi: prefiks, subdomen yoki yo'l qo'shimchasi bilan o'tib bo'lmaydi (RFC 9700: aniq qator solishtirish).
    - `Object.hasOwn` `clients["__proto__"]` yoki `constructor` kabi kalitlar orqali prototip xususiyatlariga tushib qolishning oldini oladi (29-dars).
    - `response_type=token` (implicit) rad etiladi: access token front channel orqali berilmaydi.
    - PKCE hamma klient uchun talab qilinadi va faqat `S256`: `plain` verifier'ni authorization so'rovida oshkor qiladi (cheat sheet shunday usullardan qochishni aytadi).
    - Tekshiruv tartibi muhim: avval klient va redirect URI'ni tekshirmasdan xato bilan redirect qilish mumkin emas (xato foydalanuvchiga ko'rsatiladi). Bu funksiya token endpoint tekshiruvini (verifier, bir martalik code) qoplamaydi.
  checklist:
    - "Redirect URI aniq qator bilan solishtiriladi"
    - "Implicit (`response_type=token`) rad etiladi"
    - "PKCE (S256) majburiy"
    - "Noma'lum klient `invalid_client` oladi"
    - "Tekshiruv tartibi shartga mos"
---

## Muammo

"Google bilan kirish", "korporativ SSO", mobil ilovaning backend API'ga kirishi, uchinchi tomon integratsiyasi: hammasida OAuth 2.0 ishlaydi. Dasturchi ko'pincha OAuth'ni kutubxona orqali "ulaydi", lekin uning xavfsizligi aynan sozlama detallarida: qaysi redirect URI ruxsat etilgan, qaysi oqim tanlangan, token kimga mo'ljallangan. Shu detallarda xato bo'lsa, authorization code yoki access token hujumchiga o'tadi.

Avtopark platformasida bu aniq: kompaniya fleet-boshqaruv veb-ilovasi (SPA), haydovchi mobil ilovasi, hamda hamkor logistika tizimi platforma API'siga foydalanuvchi nomidan kirishi kerak. Har biri uchun foydalanuvchi parolini hamkorga berish yoki doimiy API kalit tarqatish o'rniga OAuth ishlatiladi: foydalanuvchi authorization server'da kirib, klientga cheklangan ruxsat beradi.

Uch xil muammo uchraydi. Birinchisi, redirect URI tekshiruvi sust: prefiks yoki domen qismi bilan solishtiriladi va authorization code hujumchi sahifasiga yo'naltiriladi. Ikkinchisi, public klient (SPA, mobil) uchun client secret yo'q, shuning uchun ushlab olingan code token'ga aylanadi. Uchinchisi, eskirgan oqimlar (implicit, password grant) hamon "tezroq ishlaydi" degan sababga ko'ra qoladi. Bu dars OAuth 2.0'ning xavfsiz minimal to'plamini beradi: RFC 9700 (Best Current Practice), PKCE (RFC 7636) va OWASP OAuth2 Cheat Sheet'ga tayanib.

## Asosiy g'oya

### Rollar va authorization code grant

RFC 6749 to'rt rolni belgilaydi: resource owner (foydalanuvchi), client (ilova), authorization server (token beradi), resource server (himoyalangan API). Asosiy oqim authorization code grant:

1. Klient foydalanuvchini brauzer orqali authorization server'ga yo'naltiradi (`client_id`, `redirect_uri`, `response_type=code`, `scope`, `state`).
2. Foydalanuvchi serverda kiradi va ruxsat beradi.
3. Server brauzerni `redirect_uri` ga qaytaradi, URL'da qisqa muddatli `code` bor.
4. Klient code'ni token endpoint'ga yuborib, access token oladi.

Muhim ayirma: OAuth 2.0 authorization protokoli (klientga resursga kirish huquqi berish). Foydalanuvchi kimligini aniqlash uchun u o'z-o'zidan yaratilmagan: shu uchun OpenID Connect qo'shimchasi (49-dars).

### Redirect URI: aniq solishtirish

Authorization code redirect URI orqali qaytadi, shuning uchun bu URI ustidan nazorat butun xavfsizlikning boshi. RFC 9700 talab qiladi: oldindan kayd etilgan URI'lar bilan solishtirishda authorization server aniq qator solishtirishni ishlatishi shart (MUST); istisno faqat native ilovalarning localhost redirect'idagi port raqami. Prefiks, `endsWith`, regex, wildcard va domen bo'yicha solishtirish hujumchiga o'z domenini "mos" qilish imkonini beradi. Cheat sheet yana bir qoidani qo'shadi: klient va authorization server ixtiyoriy URL'ga yo'naltiradigan open redirector'larni ochmasligi kerak (38-dars), chunki u orqali code yoki token chiqib ketadi.

### PKCE

PKCE (Proof Key for Code Exchange, RFC 7636) authorization code'ni ushlab olish va boshqa klientga o'tkazish (injection) hujumiga qarshi. Mexanika:

1. Klient tasodifiy `code_verifier` yaratadi.
2. Authorization so'rovida `code_challenge = BASE64URL(SHA256(ASCII(code_verifier)))` va `code_challenge_method=S256` yuboradi.
3. Server code bilan challenge'ni bog'lab saqlaydi.
4. Token so'rovida klient `code_verifier` ni yuboradi; server uning hash'i challenge'ga tengligini tekshiradi.

Code'ni ushlagan hujumchi verifier'ni bilmaydi va challenge'dan uni tiklab bo'lmaydi (hash). RFC 7636: klient S256 ni qo'llay olsa, S256 ishlatishi shart; `plain` faqat S256 ni qo'llay olmaydigan klient uchun. RFC 9700: public klientlar PKCE ishlatishi shart (MUST), confidential klientlar uchun tavsiya etiladi. Cheat sheet esa amaliy qoida beradi: barcha klient turlari uchun authorization code grant va PKCE.

Test vektori bilan tekshiramiz. RFC 7636 ilovasidagi verifier va challenge juftligini o'z kodimiz bilan hisoblaymiz (vektor RFC matnidan; qiymat kodning chiqishiga mos kelishi kerak):

```ts run
const b64u = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function s256(verifier: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return b64u(new Uint8Array(d));
}

const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
const challenge = await s256(verifier);
console.log("challenge:", challenge);
console.log("RFC 7636 vektori bilan mos:", challenge === "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
console.log("boshqa verifier boshqa challenge:", (await s256(verifier + "x")) !== challenge);
```

```text
challenge: E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
RFC 7636 vektori bilan mos: true
boshqa verifier boshqa challenge: true
```

## Chuqurroq: qolgan tuzoqlar

### State, nonce va mix-up

Authorization javobi brauzer orqali qaytgani uchun hujumchi o'z code'ini qurbonning klient sessiyasiga "tiqishtirishi" mumkin (login CSRF). Cheat sheet: PKCE'ni qo'llaydigan klientlar PKCE bergan CSRF himoyasiga tayanishi mumkin; OpenID Connect oqimlarida `nonce` shunday himoya beradi; aks holda foydalanuvchi agentiga xavfsiz bog'langan bir martalik `state` qiymati ishlatiladi. Amalda `state` ni ham yuboring: u sessiyaga bog'liq tasodifiy qiymat bo'lsin (36-dars CSRF mantiqi). Klient bir nechta authorization server bilan ishlasa, javobdagi `iss` parametri (yoki ID token'dagi `iss`) yordamida mix-up hujumidan himoyalaning: hujumchi klientni noto'g'ri server code'ini noto'g'ri token endpoint'ga yuborishga undaydi.

### Eskirgan grant'lar

- Implicit grant (`response_type=token`): access token to'g'ridan-to'g'ri authorization javobida (URL fragmentida) keladi. RFC 9700 klientlar uni ishlatmasligi kerakligini aytadi (SHOULD NOT) va code grant'ni tavsiya qiladi. Cheat sheet uni eskirgan deb belgilaydi va barcha klient turlari, shu jumladan SPA, uchun code + PKCE'ni talab qiladi.
- Resource owner password credentials grant: klient foydalanuvchi parolini ko'radi. Cheat sheet buni ishlatmaslikni aytadi. MFA va passkey (44-45-darslar) bilan ham mos kelmaydi.
- Client credentials grant: foydalanuvchisiz, mashina-mashina. Bu yerda client secret serverda saqlanadi (69-dars) va token'ning huquqlari servis akkauntiga mos minimal bo'lishi kerak.

### Token'ni cheklash

Access token'ning huquqlari minimal bo'lishi (scope), faqat bitta resource server'ga mo'ljallangani (audience) va har resource server har so'rovda bu auditoriyani tekshirishi cheat sheet tavsiyalari qatorida. Bu 47-darsdagi `aud` tekshiruvining aynan o'zi. Refresh token'lar uzoq yashaydi, shuning uchun RFC 9700 public klientlarda ularning qayta ishlatilishini aniqlash choralarini (sender-constrained token yoki har ishlatishda almashtirish, rotation) talab qiladi (bu bo'limni RFC matnidan tekshirmadik; hujjatning "Refresh Tokens" qismini o'qing).

## Misol: authorization server

Quyidagi o'quv serveri soddalashtirilgan: code'lar ketma-ket (production'da CSPRNG, 67-dars), saqlash xotirada, foydalanuvchi allaqachon kirgan deb faraz qilinadi. Maqsad redirect URI va PKCE mexanikasini ko'rsatish.

### Zaif kod

Server redirect URI'ni prefiks bilan tekshiradi, PKCE yo'q va code qayta ishlatilishi mumkin.

```ts run
type Grant = { userId: string; redirectUri: string };
const REGISTERED = "https://app.avtopark.example";
const codes = new Map<string, Grant>();
let seq = 0;

// ZAIF: prefiks tekshiruvi, PKCE yo'q, code bir martalik emas.
function authorizeWeak(redirectUri: string, userId: string): string {
  if (!redirectUri.startsWith(REGISTERED)) throw new Error("invalid_redirect_uri");
  const code = `code-${++seq}`;
  codes.set(code, { userId, redirectUri });
  return `${redirectUri}?code=${code}`;
}
function tokenWeak(code: string): string | null {
  const g = codes.get(code);
  return g ? `access-token-${g.userId}` : null;
}

const url = authorizeWeak("https://app.avtopark.example/callback", "u1");
const code = new URL(url).searchParams.get("code")!;
console.log("redirect:", new URL(url).host);
console.log("token:", tokenWeak(code));
```

```text
redirect: app.avtopark.example
token: access-token-u1
```

### Hujum

Hujumchi foydalanuvchiga tayyorlangan authorization havolasini yuboradi, unda `redirect_uri` hujumchi domenida (prefiks qo'shimchasi bilan). Foydalanuvchi ruxsat beradi, code hujumchining serveriga keladi, hujumchi uni almashtiradi. Bu faqat shu o'quv serveriga qarshi.

```ts run
type Grant = { userId: string; redirectUri: string };
const REGISTERED = "https://app.avtopark.example";
const codes = new Map<string, Grant>();
let seq = 0;
function authorizeWeak(redirectUri: string, userId: string): string {
  if (!redirectUri.startsWith(REGISTERED)) throw new Error("invalid_redirect_uri");
  const code = `code-${++seq}`;
  codes.set(code, { userId, redirectUri });
  return `${redirectUri}?code=${code}`;
}
function tokenWeak(code: string): string | null {
  const g = codes.get(code);
  return g ? `access-token-${g.userId}` : null;
}

const crafted = "https://app.avtopark.example.evil.test/cb";
const url = authorizeWeak(crafted, "u1"); // foydalanuvchi "Ruxsat berish" ni bosdi
const u = new URL(url);
console.log("code ketgan manzil:", u.host);
const stolen = u.searchParams.get("code")!;
console.log("hujumchi token oldi:", tokenWeak(stolen));
console.log("code qayta ishlatildi:", tokenWeak(stolen));
```

```text
code ketgan manzil: app.avtopark.example.evil.test
hujumchi token oldi: access-token-u1
code qayta ishlatildi: access-token-u1
```

### Tuzatilgan kod

Aniq redirect URI, majburiy S256 PKCE, bir martalik code (muvaffaqiyatsiz urinishda ham o'chiriladi), redirect URI token so'rovida qayta tekshiriladi.

```ts run
type Grant = { userId: string; redirectUri: string; challenge: string };
const REDIRECT_URIS = ["https://app.avtopark.example/callback"];
const codes = new Map<string, Grant>();
let seq = 0;
const b64u = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const s256 = async (v: string) => b64u(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v))));

function authorize(redirectUri: string, userId: string, challenge?: string, method?: string): string {
  if (!REDIRECT_URIS.includes(redirectUri)) throw new Error("invalid_redirect_uri");
  if (!challenge || method !== "S256") throw new Error("pkce_required");
  const code = `code-${++seq}`;
  codes.set(code, { userId, redirectUri, challenge });
  return `${redirectUri}?code=${code}`;
}
async function token(code: string, redirectUri: string, verifier?: string): Promise<string | null> {
  const g = codes.get(code);
  codes.delete(code); // bir martalik: har urinishdan keyin o'chadi
  if (!g || g.redirectUri !== redirectUri || !verifier) return null;
  return (await s256(verifier)) === g.challenge ? `access-token-${g.userId}` : null;
}

const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
const challenge = await s256(verifier);
const cb = REDIRECT_URIS[0];

try { authorize("https://app.avtopark.example.evil.test/cb", "u1", challenge, "S256"); } catch (e) { console.log("soxta redirect:", (e as Error).message); }
try { authorize(cb, "u1"); } catch (e) { console.log("challenge'siz so'rov:", (e as Error).message); }

const c1 = new URL(authorize(cb, "u1", challenge, "S256")).searchParams.get("code")!;
console.log("ushlangan code, verifier'siz:", await token(c1, cb));
const c2 = new URL(authorize(cb, "u1", challenge, "S256")).searchParams.get("code")!;
console.log("ushlangan code, noto'g'ri verifier:", await token(c2, cb, "x".repeat(43)));
const c3 = new URL(authorize(cb, "u1", challenge, "S256")).searchParams.get("code")!;
console.log("haqiqiy klient:", await token(c3, cb, verifier));
console.log("code'ni qayta ishlatish:", await token(c3, cb, verifier));
```

```text
soxta redirect: invalid_redirect_uri
challenge'siz so'rov: pkce_required
ushlangan code, verifier'siz: null
ushlangan code, noto'g'ri verifier: null
haqiqiy klient: access-token-u1
code'ni qayta ishlatish: null
```

Nima uchun yetarli: code faqat kayd etilgan aniq URI'ga boradi, shuning uchun hujumchi domeniga yetmaydi. Code ushlansa ham, verifier'siz token olinmaydi, bir marta ishlatilgach o'chadi. Yopilgan hujumlar: redirect URI manipulyatsiyasi, code injection/interception, code replay. Yopilmagan: kayd etilgan URI'dagi sahifada open redirect yoki XSS bo'lsa code/token chiqib ketadi (31- va 38-darslar); foydalanuvchini hujumchi so'rovi bilan ruxsat berishga aldash (consent phishing) kod bilan emas, scope va klient ro'yxatdan o'tkazish siyosati bilan hal qilinadi; access token o'g'irlansa, u egasi sifatida ishlaydi (sender-constrained token bu darsdan tashqari). Verifier uchun real klient `crypto.getRandomValues` bilan kamida 32 bayt oladi.

## Qachon qo'llamaslik kerak

Hamma integratsiya uchun OAuth kerak emas. Bitta organizatsiya ichidagi veb-ilova va uning backend'i uchun sessiya (46-dars) kifoya; OAuth server, klient ro'yxatdan o'tkazish, scope va refresh token siyosati o'zi katta hajm. Faqat server-server aloqada, foydalanuvchisiz, client credentials grant yoki mTLS yetarli bo'lishi mumkin (66-dars). O'zingizning authorization server'ingizni yozmang: sinalgan ochiq manbali yechim yoki bulutli identity provider ishlatish xavfsizroq (bu yerda mahsulot tavsiya qilmaymiz, tanlov talablaringizga bog'liq). Va "OAuth bilan kirish" ni authentication deb talqin qilmang: access token foydalanuvchi kimligini isbotlamaydi, buning uchun ID token va OIDC kerak (49-dars).

## Stack'da: NestJS va Next.js

NestJS'da OAuth klient tomonini odatda `passport-oauth2`/OIDC strategiyalari yoki provayder SDK'si bilan yozasiz; sozlamada `redirect_uri` ni qattiq (konfiguratsiyadan) bering, so'rovdan olmang, `state` ni sessiyaga bog'lang va PKCE'ni yoqing (strategiya `pkce: true` kabi opsiyani qo'llab-quvvatlaydi; versiyangiz hujjatini tekshiring, bu yerda API tekshirilmagan). Resource server sifatida NestJS guard'ida access token'ni tekshiring: imzo, `iss`, `aud`, `exp`, `scope` (47-dars). Next.js'da authorization code almashinuvi serverda (Route Handler) bajariladi, token brauzerga emas, `HttpOnly` cookie'ga yoki serverdagi sessiyaga tushadi (19-dars); mijoz kodida `client_secret` bo'lmasin. Redirect URI'lar muhitlar bo'yicha (dev, staging, prod) alohida ro'yxatdan o'tkaziladi va wildcard ishlatilmaydi.

## Xulosa

- OAuth 2.0 authorization protokoli; xavfsiz minimum: authorization code grant + PKCE (S256) hamma klient uchun.
- Redirect URI'ni kayd etilgan ro'yxat bilan aniq qator solishtirish bilan tekshiring (RFC 9700); prefiks, regex va wildcard ishlatilmaydi.
- PKCE code'ni ushlagan hujumchini to'xtatadi, chunki token so'rovi verifier talab qiladi; challenge'siz so'rovni rad eting (downgrade himoyasi).
- Implicit va password grant'lardan foydalanmang; code bir martalik va qisqa muddatli bo'lsin.
- `state`/`nonce` login CSRF'dan, `iss` mix-up'dan, `aud` va scope token almashtirishdan himoya qiladi.
- OAuth foydalanuvchini autentifikatsiya qilmaydi: bu OpenID Connect ishi (49-dars).
