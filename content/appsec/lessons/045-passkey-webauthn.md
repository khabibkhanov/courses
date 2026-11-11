---
n: 45
slug: passkey-webauthn
title: "Passkey va WebAuthn"
summary: "Public-key credential va uning relying party'ga bog'lanishi, registration va authentication ceremony'lari, challenge, origin, rpIdHash va flag tekshiruvlari, phishing resistance mexanikasi, signature counter, sinxronlanadigan passkey va qurilmaga bog'liq kalit farqi hamda server tekshiruvining zaif va to'g'ri varianti."
duration: 50
sources:
  - id: webauthn
    note: "Abstract va 1.2 bo'limi: relying party'ga bog'langan (scoped) public key credential'lar; multi-device (sinxronlanadigan) credential'lar va phishing-resistant kirish; Authenticator Data tuzilishi (rpIdHash 32 bayt, flags: UP va UV); Verifying an Authentication Assertion tartibi; 6.1.1 Signature Counter Considerations (authenticator'lar hisoblagichni amalga oshirishi SHOULD); challenge kamida 16 bayt (SHOULD); userVerification standart qiymati preferred"
  - id: nist-63-4
    note: "AAL2: ikki faktor va phishing-resistant variantni taklif qilish; AAL3: kriptografik protokol, eksport qilinmaydigan maxfiy kalit va phishing resistance; phishing resistance ta'rifi (sirlarni va yaroqli authenticator chiqishlarini soxta tekshiruvchiga oshkor qilmaslik)"
  - id: t10-a07
    note: "OWASP Top 10:2025 A07 Authentication Failures: samarasiz MFA va kuchsiz zaxira yo'llar zaiflik sifatida"
quiz:
  - q: "Passkey nima uchun parol va TOTP'dan farqli ravishda phishing-resistant hisoblanadi?"
    options:
      - "Passkey kodi uzunroq bo'lgani uchun"
      - "Kalit relying party'ga (rpId) bog'langan va brauzer imzolanayotgan ma'lumotga haqiqiy origin'ni o'zi yozadi; foydalanuvchi sirni soxta saytga 'kiritib' yubora olmaydi"
      - "Passkey faqat bir marta ishlaydi"
      - "Passkey SMS orqali yetkaziladi"
    answer: 1
    explain: "Ikkita mexanizm ishlaydi: credential faqat o'z RP ID'si uchun ishlatiladi va brauzer clientData ichiga sahifaning haqiqiy origin'ini yozadi. Hujumchining sahifasi foydalanuvchidan nusxalash mumkin bo'lgan sir olmaydi. Bir martalik bo'lish yoki uzunlik bu xususiyatni bermaydi."
  - q: "Server assertion'ni faqat imzo to'g'riligi va rpIdHash bo'yicha tekshiradi. Hujumchi `https://old-promo.alfa-fleet.example` (tashkilotning unutilgan subdomeni, hujumchi egallagan) sahifasidan assertion oladi. Nima bo'ladi va qanday to'siladi?"
    options:
      - "Brauzer rad etadi, chunki subdomen rpId bo'la olmaydi"
      - "Server rad etadi, chunki imzo noto'g'ri"
      - "Hech narsa bo'lmaydi: passkey subdomenlarda ishlamaydi"
      - "Brauzer rpId=alfa-fleet.example uchun ruxsat beradi, assertion yaroqli imzoli bo'ladi va server qabul qiladi; server clientData.origin'ni kutilgan aniq origin bilan solishtirishi kerak"
    answer: 3
    explain: "RP ID domen bo'lib, sahifa origin'ining domen qismi unga teng yoki uning subdomeni bo'lsa brauzer ruxsat beradi. Shuning uchun imzo yaroqli. Aniq origin tekshiruvi serverning qo'shimcha chegarasi: usiz subdomen egallash passkey himoyasini chetlab o'tadi."
  - q: "Challenge uchun qaysi yondashuv to'g'ri?"
    options:
      - "Server har ceremony uchun kamida 16 bayt tasodifiy qiymat yaratadi, sessiyaga bog'laydi va bir marta ishlatib o'chiradi"
      - "Foydalanuvchi ID'sini challenge sifatida ishlatish"
      - "Bitta doimiy challenge hammaga"
      - "Mijoz yaratgan challenge'ni qabul qilish"
    answer: 0
    explain: "Challenge replay'ni to'sadi, shuning uchun kutilmagan, tasodifiy va bir martalik bo'lishi kerak. Spetsifikatsiya yetarli entropiya uchun kamida 16 bayt tavsiya qiladi. Doimiy yoki mijoz yaratgan challenge replay'ga yo'l ochadi."
  - q: "Authenticator signature counter qaytaradi. Server uni qanday ishlatishi mumkin?"
    options:
      - "Counter foydalanuvchi parolini tekshiradi"
      - "Counter vaqtni ko'rsatadi, shuning uchun TOTP o'rniga ishlatiladi"
      - "Saqlangan qiymatdan katta bo'lmasa, kalit nusxalangan bo'lishi mumkin degan signal sifatida; lekin ba'zi authenticator'lar doim 0 qaytaradi, shunda tekshiruv ma'noga ega emas"
      - "Counter challenge o'rnini bosadi"
    answer: 2
    explain: "Spetsifikatsiya authenticator'larga hisoblagichni amalga oshirishni tavsiya qiladi (SHOULD): bu klonlashni aniqlashga yordam beradi. Hisoblagich qo'llanmasa, qiymat doim nol bo'ladi va uni signal sifatida ishlatib bo'lmaydi."
  - q: "Platforma admin akkauntlarida passkey majburlaydi, lekin 'kalitni yo'qotdim' tugmasi emailga bir martalik havola yuboradi va yangi passkey qo'shishga ruxsat beradi. Asosiy muammo?"
    options:
      - "Passkey faqat emailga bog'liq bo'lishi kerak emas"
      - "Tiklash yo'li eng zaif bo'g'in: hujumchi passkey'ni emas, emailni egallaydi va MFA butunlay chetlab o'tiladi"
      - "Email havolasi juda tez ishlaydi"
      - "Hech qanday muammo yo'q"
    answer: 1
    explain: "Tizimning ishonchi eng zaif kirish yo'li bilan belgilanadi (41-dars). Phishing-resistant authenticator tiklash zaif bo'lsa foydasiz; yangi authenticator qo'shish ham yuqori xavfli harakat bo'lib qayta autentifikatsiya va bildirishnoma talab qiladi (50-dars)."
  - q: "NIST SP 800-63-4 AAL3 uchun eksport qilib bo'lmaydigan maxfiy kalitli kriptografik authenticator talab qiladi. Bu haqda passkey tanlashda nima deyish to'g'ri?"
    options:
      - "Har qanday passkey AAL3'ni qondiradi"
      - "Passkey AAL darajasiga umuman bog'liq emas"
      - "AAL3 faqat parol bilan erishiladi"
      - "AAL3 maqsad qilingan bo'lsa, kalit eksport qilinmaydigan, qurilmaga bog'liq authenticator bo'lishi kerak; buluta nusxalanadigan (sinxronlanadigan) credential'lar uchun bu shartni alohida baholash kerak"
    answer: 3
    explain: "Standart AAL3 da eksport qilinmaydigan kalit va phishing resistance talab qiladi. Sinxronlanadigan passkey qulay va AAL2 maqsadlari uchun kuchli, lekin kalit qurilmadan tashqariga nusxalanishi AAL3 sharti bilan qanday muvofiqligini xavf baholash bilan hal qilish kerak (bu muallifning xulosasi)."
  - q: "Passkey ro'yxatdan o'tkazishda `userVerification` ni 'discouraged' qoldirdingiz va server UV flagini tekshirmaydi. Admin amalini faqat shu passkey tasdiqlaydi. Nima yetishmayapti?"
    options:
      - "Hech narsa: kalitga egalik yetarli"
      - "Faqat challenge uzunligi"
      - "Faqat rpId"
      - "Foydalanuvchini lokal tasdiqlash (PIN/biometrik) talab qilinmagani uchun kalitga jismoniy egalik qilgan istalgan odam kirishi mumkin; nozik amallarda UV talab qilib, flagni tekshirish kerak"
    answer: 3
    explain: "UP flagi foydalanuvchi shunchaki mavjudligini, UV esa lokal tasdiqlangan bo'lganini bildiradi. Admin kabi nozik rol uchun UV'ni talab qiling va serverda flag tekshiring; faqat egalik faktori bitta faktor."
task:
  title: "Assertion metama'lumotlarini tekshirish"
  prompt: |
    `verifyAssertionMeta` WebAuthn assertion'ning imzodan tashqari qismlarini tekshiradi (imzo tekshiruvi alohida). Hozir u faqat `rpIdHashOk` ni qaraydi.

    Tuzating. Qabul qilish uchun hamma shart bajarilishi kerak:
    - `clientData.type` `"webauthn.get"` bo'lsin;
    - `clientData.origin` aniq `EXPECTED_ORIGIN` ga teng bo'lsin;
    - `clientData.challenge` server bergan va hali ishlatilmagan challenge bo'lsin; muvaffaqiyatli tekshiruvdan keyin u o'chirilsin (qayta ishlatib bo'lmasin);
    - `rpIdHashOk` bo'lsin, `flags.up` va `flags.uv` ikkalasi `true` bo'lsin;
    - `counter` agar nolga teng bo'lmasa, saqlangan qiymatdan qat'iy katta bo'lsin va muvaffaqiyatdan keyin saqlansin (nol qiymat counter qo'llanmaganini bildiradi, tekshirilmaydi).

    Imzolarni o'zgartirmang. Kutilgan chiqish: `true`, `false`, `false`, `false`, `false`.
  lang: ts
  starter: |
    const EXPECTED_ORIGIN = "https://app.alfa-fleet.example";

    type Assertion = {
      credentialId: string;
      clientData: { type: string; challenge: string; origin: string };
      rpIdHashOk: boolean;
      flags: { up: boolean; uv: boolean };
      counter: number;
    };
    type State = { challenges: Set<string>; counters: Map<string, number> };

    function verifyAssertionMeta(state: State, a: Assertion): boolean {
      return a.rpIdHashOk;
    }

    const state: State = { challenges: new Set(["c1", "c2", "c3", "c4", "c5"]), counters: new Map([["cred1", 10]]) };
    const base: Assertion = {
      credentialId: "cred1",
      clientData: { type: "webauthn.get", challenge: "c1", origin: EXPECTED_ORIGIN },
      rpIdHashOk: true,
      flags: { up: true, uv: true },
      counter: 11,
    };

    console.log(verifyAssertionMeta(state, base));
    console.log(verifyAssertionMeta(state, { ...base, clientData: { ...base.clientData, challenge: "c2", origin: "https://old-promo.alfa-fleet.example" } }));
    console.log(verifyAssertionMeta(state, base));
    console.log(verifyAssertionMeta(state, { ...base, clientData: { ...base.clientData, challenge: "c3" }, flags: { up: true, uv: false } }));
    console.log(verifyAssertionMeta(state, { ...base, clientData: { ...base.clientData, challenge: "c4" }, counter: 11 }));
  solution: |
    const EXPECTED_ORIGIN = "https://app.alfa-fleet.example";

    type Assertion = {
      credentialId: string;
      clientData: { type: string; challenge: string; origin: string };
      rpIdHashOk: boolean;
      flags: { up: boolean; uv: boolean };
      counter: number;
    };
    type State = { challenges: Set<string>; counters: Map<string, number> };

    function verifyAssertionMeta(state: State, a: Assertion): boolean {
      const c = a.clientData;
      if (c.type !== "webauthn.get") return false;
      if (c.origin !== EXPECTED_ORIGIN) return false;
      if (!state.challenges.has(c.challenge)) return false;
      if (!a.rpIdHashOk || !a.flags.up || !a.flags.uv) return false;
      const last = state.counters.get(a.credentialId) ?? 0;
      if (a.counter !== 0 && a.counter <= last) return false;
      state.challenges.delete(c.challenge);
      if (a.counter !== 0) state.counters.set(a.credentialId, a.counter);
      return true;
    }

    const state: State = { challenges: new Set(["c1", "c2", "c3", "c4", "c5"]), counters: new Map([["cred1", 10]]) };
    const base: Assertion = {
      credentialId: "cred1",
      clientData: { type: "webauthn.get", challenge: "c1", origin: EXPECTED_ORIGIN },
      rpIdHashOk: true,
      flags: { up: true, uv: true },
      counter: 11,
    };

    console.log(verifyAssertionMeta(state, base));
    console.log(verifyAssertionMeta(state, { ...base, clientData: { ...base.clientData, challenge: "c2", origin: "https://old-promo.alfa-fleet.example" } }));
    console.log(verifyAssertionMeta(state, base));
    console.log(verifyAssertionMeta(state, { ...base, clientData: { ...base.clientData, challenge: "c3" }, flags: { up: true, uv: false } }));
    console.log(verifyAssertionMeta(state, { ...base, clientData: { ...base.clientData, challenge: "c4" }, counter: 11 }));
  solutionNotes: |
    - Origin aniq qator bilan solishtiriladi (`!==`). Subdomen yoki prefiks bilan mos kelish (`endsWith`, `startsWith`) hujumchi egallagan sibling origin'ni o'tkazib yuboradi.
    - Challenge `Set` dan topiladi va faqat hamma shart bajarilgandan keyin o'chiriladi. Shu sababli bir assertion ikkinchi marta o'tmaydi (uchinchi chiqish `false`: `c1` ishlatilgan).
    - Muvaffaqiyatsiz urinish challenge'ni sarflamaydi. Haqiqiy tizimda challenge'ga muddat ham qo'ying (masalan, bir necha daqiqa; bu qiymat sizning tanlovingiz) va uni sessiyaga bog'lang.
    - UV flagi tekshiriladi: lokal tasdiqlanmagan assertion nozik amal uchun yetarli emas.
    - Counter nol bo'lsa tekshirilmaydi, chunki ba'zi authenticator'lar hisoblagichni qo'llamaydi. Bu klonlashga qarshi signal, to'liq himoya emas. Imzoning o'zi, credential egaligi va akkauntga bog'lash bu funksiyada tekshirilmaydi.
  checklist:
    - "Origin aniq tenglik bilan tekshiriladi"
    - "Challenge bir marta ishlatiladi va o'chiriladi"
    - "UP va UV flaglari talab qilinadi"
    - "Counter nol bo'lmasa o'sishi shart"
    - "Muvaffaqiyatsiz tekshiruv holatni o'zgartirmaydi"
---

## Muammo

Parol, hatto yaxshi hash qilinsa ham (42-dars) va TOTP bilan to'ldirilsa ham (44-dars), foydalanuvchi qo'lida o'qib, boshqasiga ko'chirib bera oladigan sirdir. Phishing shu xususiyatdan foydalanadi: foydalanuvchi soxta sahifaga parol va TOTP kodini yozadi, hujumchi ularni real vaqtda haqiqiy saytga uzatadi. NIST SP 800-63-4 phishing resistance'ni protokolning autentifikatsiya sirlarini va yaroqli authenticator chiqishlarini soxta tekshiruvchiga oshkor qilmaslik qobiliyati deb ta'riflaydi va parolni phishing-resistant emas deb belgilaydi. AAL2 darajasida baholanadigan ilovalar phishing-resistant variantni taklif qilishi shart.

Bu qiyinchilikning amaliy yechimi WebAuthn, ya'ni W3C'ning Web Authentication API'si. Kundalik tilda "passkey" deganda WebAuthn credential'ga asoslangan, foydalanuvchiga parol o'rniga ko'rinadigan kirish usuli tushuniladi. Lekin WebAuthn yaxshi implementatsiya talab qiladi. Eng ko'p uchraydigan xato: server faqat imzoning to'g'riligini tekshiradi va clientData, origin, challenge, flaglarni e'tiborsiz qoldiradi. Natijada phishing-resistant mexanizm sezilarli yengillashadi (subdomen egallash, replay).

Bu darsda mexanizmni oxirigacha ochamiz: nima imzolanadi, brauzer qaysi qismini kafolatlaydi, serverning qaysi tekshiruvlari majburiy. Misolda ECDSA P-256 bilan authenticator va server modelini yozamiz.

## Asosiy g'oya

### Public-key credential va relying party

WebAuthn spetsifikatsiyasi aytadi: veb-ilovalar kuchli, attestatsiyalanishi mumkin, relying party'ga bog'langan public-key credential'lardan foydalanishi mumkin. Authenticator har ro'yxatdan o'tkazishda yangi kalit juftligini yaratadi; maxfiy kalit authenticator ichida qoladi, server esa ochiq kalitni saqlaydi. Credential faqat o'zi yaratilgan relying party (RP) uchun ishlaydi. RP ID odatda domen (masalan, `alfa-fleet.example`). Foydalanuvchi parol o'ylab topmaydi va serverda tekshiriladigan umumiy sir yo'q: server sizsa, hujumchi faqat ochiq kalitlarni oladi.

Ikki ceremony bor:

1. Registration: server challenge beradi, authenticator kalit juftligi yaratadi, ochiq kalit va credential identifikatorini qaytaradi, server ularni saqlaydi.
2. Authentication: server yangi challenge beradi, authenticator uni (va kontekstni) shaxsiy kalit bilan imzolaydi, server ochiq kalit bilan tekshiradi.

### Nima imzolanadi

Authentication assertion uch qismdan iborat: `clientDataJSON` (brauzer tuzadi: `type`, `challenge`, `origin`), `authenticatorData` va imzo. Authenticator data kamida 37 bayt: 32 baytli `rpIdHash` (RP ID'ning SHA-256 hash'i), bir baytli flag'lar (User Present, User Verified va boshqalar) va hisoblagich. Imzo authenticator data va clientDataJSON hash'i birlashmasi ustida hisoblanadi. Shuning uchun:

- challenge server bergan qiymat ekani imzoga kiradi: replay'ni to'sadi;
- origin brauzer tomonidan yoziladi: sahifa o'z origin'ini soxtalashtira olmaydi;
- `rpIdHash` credential qaysi RP uchun ekanini bog'laydi.

### Phishing resistance mexanikasi

Foydalanuvchi soxta `alfa-fleet.example.evil.test` saytiga o'tsa, brauzer bu sahifaga `alfa-fleet.example` RP ID bilan ishlashga ruxsat bermaydi, chunki sahifa domeni RP ID'ga teng ham, uning subdomeni ham emas. Hujumchi o'z RP ID'sini ko'rsatsa, authenticator'da u uchun credential yo'q. Foydalanuvchi hech narsa "ko'chirib" bera olmaydi. Bu xossa foydalanuvchining ehtiyotkorligiga emas, protokolga tayanadi.

## Chuqurroq: server nimani tekshirishi kerak

W3C "Verifying an Authentication Assertion" tartibi relying party uchun ketma-ket tekshiruvlar beradi. Qisqartirilgan mohiyati:

1. `clientDataJSON.type` `webauthn.get`, `challenge` server bergan qiymat, `origin` relying party kutgan origin.
2. `authData` ichidagi `rpIdHash` kutilgan RP ID'ning SHA-256'iga teng.
3. UP flagi o'rnatilgan (shartli mediation holatidan tashqari), kerak bo'lsa UV flagi ham.
4. Imzo ochiq kalit bilan authenticator data va clientDataJSON hash'i birlashmasi ustida tekshiriladi.
5. Signature counter tekshiruvi (agar qo'llansa).

Challenge uchun spetsifikatsiya replay'ni to'sish uchun yetarli entropiya talab qiladi va kamida 16 bayt uzunlikni tavsiya qiladi (SHOULD). Challenge sessiyaga bog'lanadi va bir marta ishlatiladi.

### Aniq origin tekshiruvi

RP ID domen bo'lgani uchun uning har subdomenidagi sahifa ham brauzerdan assertion ola oladi. Tashkilotning unutilgan subdomeni (`old-promo`), XSS bor ichki ilova yoki egallangan subdomen yaroqli imzoli assertion hosil qilishi mumkin. rpIdHash buni ushlamaydi, chunki RP ID bir xil. Faqat `clientData.origin` aniq kutilgan origin'ga tengligi tekshirilsa, bunday sahifadan olingan assertion rad etiladi. Bu OWASP A07 dagi "MFA samarasiz" holatining zamonaviy ko'rinishi: texnologiya to'g'ri, tekshiruv to'liq emas.

### Signature counter va sinxronlanadigan passkey

Authenticator'lar signature counter amalga oshirishi tavsiya etiladi (SHOULD): har muvaffaqiyatli assertion'da qiymat oshadi. Server saqlangan qiymatdan kichik yoki teng qiymatni ko'rsa, kalit nusxalangan bo'lishi mumkin. Lekin hisoblagich majburiy emas: qo'llamaydigan authenticator doim nol qaytaradi, shunda tekshiruv ma'noga ega emas.

Spetsifikatsiya multi-device credential'larni (sinxronlanadigan passkey) tasvirlaydi: kalit foydalanuvchining bir nechta qurilmasi orasida tiklanadi va telefon yo'qolsa ham kirish saqlanadi. Bu qulaylik, lekin kalit endi bitta qurilmaga bog'langan emas. Spetsifikatsiya authenticator data ichida credential'ning zaxiraga olinishi holatini bildiruvchi flag'lar ham bo'lishini nazarda tutadi (6.1.3 Credential Backup State), shuning uchun server bunday credential'larni ajrata oladi. NIST AAL3 uchun eksport qilib bo'lmaydigan maxfiy kalit talab qiladi, shuning uchun AAL3 maqsad qilinganda qurilmaga bog'liq kalit mantiqiy tanlov; sinxronlanadigan credential bilan muvofiqlikni xavf baholash bilan hal qilish kerak (bu muallifning xulosasi).

### Registratsiya parametrlari

Brauzer tomonida registratsiya so'rovi ana shunday ko'rinadi (DOM API, darsda ishga tushirilmaydi):

```ts
// Server /webauthn/register/options dan olingan qiymatlar bilan.
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: base64urlToBytes(options.challenge), // server bergan, kamida 16 bayt
    rp: { id: "alfa-fleet.example", name: "Avtopark platformasi" },
    user: { id: base64urlToBytes(options.userHandle), name: options.email, displayName: options.name },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
    authenticatorSelection: { residentKey: "required", userVerification: "required" },
    timeout: 300000,
  },
});
```

`userVerification` standart qiymati `preferred`. Nozik rollar (admin) uchun `required` qo'yib, serverda UV flagini ham tekshirish kerak. `residentKey: "required"` parolsiz, foydalanuvchi nomini kiritmasdan kirish (discoverable credential) imkonini beradi.

## Misol: assertion tekshiruvi

Quyidagi model authenticator va brauzerning muhim qoidalarini aks ettiradi. Soddalashtirish: haqiqiy WebAuthn imzosi DER formatida va CBOR/COSE kodlashda, WebCrypto esa `r||s` formatida imzo beradi; mexanizm esa bir xil.

### Zaif kod

Server faqat `rpIdHash` va imzoni tekshiradi:

```ts
// ZAIF: type, origin, challenge, flag va counter tekshirilmaydi.
async function verifyWeak(a: Assertion, publicKey: CryptoKey): Promise<boolean> {
  const expected = hex(await sha256(enc.encode(RP_ID)));
  if (hex(a.authData.slice(0, 32)) !== expected) return false;
  const signed = cat(a.authData, await sha256(enc.encode(a.clientDataJSON)));
  return crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, publicKey, a.signature, signed);
}
```

### Hujum

Ikkita hujum. Birinchisi: tashkilotning unutilgan subdomenini hujumchi egallagan (`old-promo`), foydalanuvchi o'sha sahifada passkey'ni ishlatadi, hujumchi olingan assertion'ni asosiy saytga yuboradi. Ikkinchisi: oldin ushlangan assertion'ni qayta yuborish (replay). Ikkala hujum faqat shu o'quv modeliga qarshi.

```ts run
const enc = new TextEncoder();
const sha256 = async (d: Uint8Array) => new Uint8Array(await crypto.subtle.digest("SHA-256", d));
const cat = (...a: Uint8Array[]) => {
  const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0));
  let p = 0;
  for (const x of a) { o.set(x, p); p += x.length; }
  return o;
};
const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

type Assertion = { clientDataJSON: string; authData: Uint8Array; signature: Uint8Array };
const RP_ID = "alfa-fleet.example";
const keys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
let counter = 0;

// Authenticator + brauzer modeli.
async function getAssertion(pageOrigin: string, rpId: string, challenge: string): Promise<Assertion | null> {
  const host = new URL(pageOrigin).hostname;
  if (!(host === rpId || host.endsWith("." + rpId))) return null; // brauzer qoidasi
  const clientDataJSON = JSON.stringify({ type: "webauthn.get", challenge, origin: pageOrigin });
  const ctr = new Uint8Array(4);
  new DataView(ctr.buffer).setUint32(0, ++counter);
  const authData = cat(await sha256(enc.encode(rpId)), new Uint8Array([0x05]), ctr); // UP|UV
  const signed = cat(authData, await sha256(enc.encode(clientDataJSON)));
  const signature = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keys.privateKey, signed));
  return { clientDataJSON, authData, signature };
}

// ZAIF server: faqat rpIdHash va imzo.
async function verifyWeak(a: Assertion): Promise<boolean> {
  if (hex(a.authData.slice(0, 32)) !== hex(await sha256(enc.encode(RP_ID)))) return false;
  const signed = cat(a.authData, await sha256(enc.encode(a.clientDataJSON)));
  return crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, keys.publicKey, a.signature, signed);
}

const legit = (await getAssertion("https://app.alfa-fleet.example", RP_ID, "ch-1"))!;
console.log("haqiqiy sahifa:", await verifyWeak(legit));
console.log("phishing domeni, brauzer assertion beradimi:", await getAssertion("https://alfa-fleet.example.evil.test", RP_ID, "ch-2"));
const sibling = (await getAssertion("https://old-promo.alfa-fleet.example", RP_ID, "ch-3"))!;
console.log("egallangan subdomen assertion'i qabul qilindi:", await verifyWeak(sibling));
console.log("replay (qayta yuborish):", await verifyWeak(legit));
```

```text
haqiqiy sahifa: true
phishing domeni, brauzer assertion beradimi: null
egallangan subdomen assertion'i qabul qilindi: true
replay (qayta yuborish): true
```

Phishing domeni brauzer darajasida to'xtadi (`null`), lekin egallangan subdomen yaroqli assertion oldi va zaif server uni qabul qildi; replay ham o'tdi.

### Tuzatilgan kod

Server `type`, aniq `origin`, bir martalik challenge, `rpIdHash`, UP va UV flaglari, hisoblagich va imzoni tekshiradi.

```ts run
const enc = new TextEncoder();
const sha256 = async (d: Uint8Array) => new Uint8Array(await crypto.subtle.digest("SHA-256", d));
const cat = (...a: Uint8Array[]) => {
  const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0));
  let p = 0;
  for (const x of a) { o.set(x, p); p += x.length; }
  return o;
};
const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");

type Assertion = { clientDataJSON: string; authData: Uint8Array; signature: Uint8Array };
const RP_ID = "alfa-fleet.example";
const EXPECTED_ORIGIN = "https://app.alfa-fleet.example";
const keys = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
let counter = 0;

async function getAssertion(pageOrigin: string, rpId: string, challenge: string): Promise<Assertion | null> {
  const host = new URL(pageOrigin).hostname;
  if (!(host === rpId || host.endsWith("." + rpId))) return null;
  const clientDataJSON = JSON.stringify({ type: "webauthn.get", challenge, origin: pageOrigin });
  const ctr = new Uint8Array(4);
  new DataView(ctr.buffer).setUint32(0, ++counter);
  const authData = cat(await sha256(enc.encode(rpId)), new Uint8Array([0x05]), ctr);
  const signed = cat(authData, await sha256(enc.encode(clientDataJSON)));
  const signature = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, keys.privateKey, signed));
  return { clientDataJSON, authData, signature };
}

const pending = new Set<string>(); // server bergan, ishlatilmagan challenge'lar
let lastCounter = 0;
function issueChallenge(id: string) { pending.add(id); return id; }

async function verifyStrong(a: Assertion): Promise<boolean> {
  const c = JSON.parse(a.clientDataJSON) as { type: string; challenge: string; origin: string };
  if (c.type !== "webauthn.get" || c.origin !== EXPECTED_ORIGIN || !pending.has(c.challenge)) return false;
  if (hex(a.authData.slice(0, 32)) !== hex(await sha256(enc.encode(RP_ID)))) return false;
  const flags = a.authData[32];
  if (!(flags & 0x01) || !(flags & 0x04)) return false; // UP va UV
  const ctr = new DataView(a.authData.buffer, a.authData.byteOffset + 33, 4).getUint32(0);
  if (ctr !== 0 && ctr <= lastCounter) return false;
  const signed = cat(a.authData, await sha256(enc.encode(a.clientDataJSON)));
  const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, keys.publicKey, a.signature, signed);
  if (!ok) return false;
  pending.delete(c.challenge); // bir martalik
  if (ctr !== 0) lastCounter = ctr;
  return true;
}

const ch1 = issueChallenge("ch-1");
const legit = (await getAssertion("https://app.alfa-fleet.example", RP_ID, ch1))!;
console.log("haqiqiy sahifa:", await verifyStrong(legit));
console.log("replay:", await verifyStrong(legit));
const ch2 = issueChallenge("ch-2");
const sibling = (await getAssertion("https://old-promo.alfa-fleet.example", RP_ID, ch2))!;
console.log("egallangan subdomen:", await verifyStrong(sibling));
const forged = (await getAssertion("https://app.alfa-fleet.example", RP_ID, "server-bermagan"))!;
console.log("noma'lum challenge:", await verifyStrong(forged));
```

```text
haqiqiy sahifa: true
replay: false
egallangan subdomen: false
noma'lum challenge: false
```

Nima uchun yetarli: har assertion server bergan, hali sarflanmagan challenge'ga, aniq origin'ga va lokal tasdiqlangan (UV) imzoga bog'langan. Yopilgan hujumlar: replay, egallangan sibling subdomen, challenge'siz imzo. Qoldiq risklar: kalit olingan qurilmaga egalik va lokal PIN/biometrikani buzish, tiklash yo'lining zaifligi (50-dars), ceremony oqimida XSS bo'lsa sessiyani o'g'irlash (31-dars), va bu modelning imzo formati soddalashtirilgani. Production'da DER/COSE tahlili va attestatsiya qarorlari uchun sinalgan kutubxona ishlating, o'zingiz yozmang.

## Qachon qo'llamaslik kerak

Passkey'ni yagona kirish usuli qilib, tiklash yo'lini o'ylamay yoqish foydalanuvchini qulflab qo'yadi. Eski qurilma va brauzer, umumiy kompyuter yoki ishlab chiqarish stantsiyalari (haydovchilar umumiy planshetda ishlaydigan avtopark) kabi muhitlarda authenticator qo'llab-quvvatlanishini oldindan tekshiring; kerak bo'lsa parol va TOTP zaxira sifatida qolsin, lekin zaxira yo'lining o'zi eng zaif bo'g'in bo'lib qolmasin. Attestatsiya (authenticator modelini cheklash) kerak bo'lgan holatlar kam: u konfidensiallik va moslik muammolarini keltiradi, shuning uchun muayyan talab bo'lmasa o'chirib qo'ying. Mashinadan mashinaga chaqiruvlarda passkey ma'nosiz; ular uchun API kalit yoki mTLS (66-dars). Va nihoyat, sinxronlanadigan passkey'lar akkaunt xavfsizligini foydalanuvchi platforma akkauntiga bog'laydi: korporativ muhitda bu siyosatga zid bo'lishi mumkin.

## Stack'da: NestJS va PostgreSQL

NestJS'da `webauthn` modulini alohida servisga ajrating: `/register/options`, `/register/verify`, `/login/options`, `/login/verify` endpoint'lari. Challenge'ni sessiyada yoki Redis'da `webauthn:chal:{sessionId}` kalitida qisqa TTL bilan saqlang va tekshiruvda `GETDEL` kabi atomik operatsiya bilan o'qib o'chiring: ikki parallel so'rov bir challenge'ni ishlata olmasin (60-dars). PostgreSQL'da `credentials(id bytea primary key, user_id, public_key bytea, counter bigint, transports text[], backup_eligible bool, created_at)` jadvalini yuriting; `counter` ni `UPDATE ... WHERE counter < $1` bilan oshiring. Ro'yxatdan o'tkazish uchun kutubxona sifatida, masalan, SimpleWebAuthn mavjud; bu darsda uning API'si tekshirilmagan, shuning uchun hujjatidan foydalaning. `EXPECTED_ORIGIN` va `RP_ID` ni sozlamadan oling, so'rov `Host` sarlavhasidan emas. Next.js'da `navigator.credentials` chaqiruvlari faqat Client Component ichida bo'ladi, tekshiruv esa Route Handler'da (Node runtime). Muvaffaqiyatli kirishdan keyin sessiya identifikatorini yangilang (46-dars).

## Xulosa

- WebAuthn public-key credential'ni relying party'ga bog'laydi; server sizsa ham faqat ochiq kalitlar oshkor bo'ladi.
- Phishing resistance protokol darajasida: credential faqat o'z RP ID uchun ishlaydi va brauzer clientData'ga haqiqiy origin'ni yozadi.
- Server majburiy tekshiradi: `type`, aniq `origin`, bir martalik tasodifiy `challenge` (kamida 16 bayt), `rpIdHash`, UP/UV flaglari, hisoblagich va imzo.
- RP ID subdomenlarga ham amal qilgani uchun aniq origin tekshiruvi sibling subdomen hujumini to'sadi.
- Signature counter klonlash signali, lekin ko'p authenticator doim nol qaytaradi.
- Sinxronlanadigan passkey qulay, AAL3 esa eksport qilinmaydigan kalit talab qiladi; tiklash yo'li butun tizimning eng zaif bo'g'ini bo'lib qolmasin (50-dars).
