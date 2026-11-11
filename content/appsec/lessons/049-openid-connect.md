---
n: 49
slug: openid-connect
title: "OpenID Connect va tashqi provayder orqali kirish"
summary: "OpenID Connect'ning OAuth 2.0 ustidagi vazifasi, ID token va access token farqi, ID token tekshiruvi (imzo, iss, aud, exp, nonce), foydalanuvchini (iss, sub) bo'yicha aniqlash, email bo'yicha akkaunt bog'lash xavfi va ko'p tenant'li SSO tuzoqlari."
duration: 50
sources:
  - id: oidc-core
    note: "ID Token tekshiruvi: klient aud claim'ida o'z client_id'si borligini tekshirishi va aks holda tokenni rad etishi (MUST); nonce claim'i klient sessiyasini ID token bilan bog'laydi va replay'ga qarshi, autentifikatsiya so'rovidagi qiymatga teng bo'lishi shart; sub - emitent ichida mahalliy noyob va hech qachon qayta berilmaydigan identifikator; email_verified: true bo'lsa OP e-mail egaligini tasdiqlash choralarini ko'rgan"
  - id: rfc9700
    note: "OAuth 2.0 xavfsizlik best practice'lari: redirect URI aniq solishtirish, PKCE, mix-up hujumi va iss parametri; OIDC oqimlariga ham tegishli"
  - id: cs-oauth2
    note: "OAuth2 Cheat Sheet: OAuth API himoyasi standarti va OIDC orqali federativ kirishning asosi; OIDC oqimlarida nonce CSRF himoyasini beradi; bir nechta authorization server bilan ishlaganda iss parametri mix-up'ga qarshi; code grant + PKCE."
  - id: cs-authn
    note: "Authentication Cheat Sheet (OIDC bo'limi): authentication/SSO uchun OIDC, API authorization uchun OAuth; RP'da ID token tekshiruvi (iss, aud, provayder JWK'lari bo'yicha imzo, exp); UserInfo qo'shimcha claim'lar uchun; federativ akkaunt bog'lash: (iss, sub) bilan aniqlash, email moslig'i bo'yicha avtomatik bog'lamaslik, qo'shish/olib tashlashdan oldin autentifikatsiyalangan sessiya, bildirishnoma"
  - id: asvs
    note: "ASVS 5.0.0 V10: 10.5.1 nonce'ni so'rovdagi qiymat bilan solishtirish (ID token replay), 10.5.2 foydalanuvchini sub bilan aniqlash, 10.5.3 AS metadata issuer'i oldindan sozlangan issuer'ga aniq teng bo'lishi, 10.5.4 aud client_id ga teng, 10.5.5 back-channel logout token tekshiruvi, 10.3.3 (iss, sub) juftligi, 10.3.4 acr/amr/auth_time, 10.6.1 response mode'lar, 10.7 rozilik (consent) boshqaruvi"
  - id: nist-63-4
    note: "NIST SP 800-63C-4: RP assertion'ni tekshiradi (imzo, emitent, vaqt, auditoriya, nonce, replay); subject identifier emitent nomlar maydonida ko'riladi, IdP'lar bo'yicha global noyob emas (SHALL NOT); account linking uchun autentifikatsiyalangan sessiya talab qilinadi (SHALL); yangi federativ identifikator qo'shilganda foydalanuvchiga xabar beriladi (SHALL); account resolution'da identifikator foydalanuvchiga tegishli bo'lmasligi kerak"
quiz:
  - q: "SPA backend'i foydalanuvchini 'tizimga kirgan' deb hisoblash uchun provayderdan olingan access token'ni tekshirdi: imzo to'g'ri, muddati o'tmagan. Nima yetishmayapti?"
    options:
      - "Hech narsa: access token ham identifikatsiya qiladi"
      - "Access token'ni ID token bilan almashtirish"
      - "Faqat HTTPS"
      - "Access token API uchun mo'ljallangan va kim kirganini klientga isbotlamaydi; autentifikatsiya uchun ID token (aud=klient, nonce) tekshirilishi kerak"
    answer: 3
    explain: "OAuth access token resurs serveriga murojaat huquqini beradi va uning formati klient uchun shaffof bo'lmasligi mumkin. OIDC ID token esa aynan klient uchun chiqarilgan autentifikatsiya natijasi: aud, nonce va iss orqali tekshiriladi. ASVS V10: OAuth o'zi foydalanuvchi autentifikatsiyasi uchun mo'ljallanmagan, OIDC unga identifikatsiya qatlamini qo'shadi."
  - q: "RP ID token'ning `aud` claim'ini tekshirmaydi. Hujumchi o'z ilovasida foydalanuvchini OIDC bilan kiritib, olingan ID token'ni sizning ilovangizga yuboradi. Nima bo'ladi?"
    options:
      - "Token boshqa ilova uchun chiqarilgan bo'lsa ham qabul qilinadi; foydalanuvchi sifatida kirib olinadi (token substitution)"
      - "Imzo tekshiruvi buni to'xtatadi"
      - "Brauzer rad etadi"
      - "Hech narsa: ID token faqat bir marta ishlaydi"
    answer: 0
    explain: "Imzo to'g'ri, chunki token haqiqiy provayderdan. Aynan aud tekshiruvi tokenning shu klient uchun ekanini aniqlaydi. OIDC Core aud'da klientning client_id'si bo'lmasa tokenni rad etishni talab qiladi (MUST)."
  - q: "Foydalanuvchini bazada qaysi kalit bilan topish to'g'ri?"
    options:
      - "Faqat email, chunki u foydalanuvchiga tanish"
      - "Faqat ism"
      - "`(iss, sub)` juftligi: sub emitent ichida noyob va qayta berilmaydi"
      - "Faqat `sub`, emitentni hisobga olmasdan"
    answer: 2
    explain: "sub faqat o'z emitenti ichida noyob; turli provayderlarda bir xil sub bo'lishi mumkin, shuning uchun juftlik kerak. Email o'zgarishi, qayta berilishi yoki tasdiqlanmagan bo'lishi mumkin, uni asosiy kalit qilish akkaunt egallashga olib keladi."
  - q: "Provayder `email: dispatcher@alfa.example`, `email_verified: false` bilan token berdi. Tizimda shu email'li mahalliy akkaunt bor. Eng xavfsiz xatti-harakat?"
    options:
      - "Avtomatik shu akkauntga kirgizish"
      - "Mavjud akkauntga avtomatik bog'lamaslik; bog'lash uchun foydalanuvchi avval mahalliy akkaunt bilan (parol/passkey) kirib, keyin provayderni qo'shsin"
      - "Akkauntni o'chirish"
      - "Tokenni jim e'tiborsiz qoldirish"
    answer: 1
    explain: "Tasdiqlanmagan email boshqa odamniki bo'lishi mumkin, hujumchi provayderda shu email bilan ro'yxatdan o'tgan bo'lishi mumkin. Hatto email_verified true bo'lsa ham avtomatik bog'lash provayderga to'liq ishonishni bildiradi. NIST 800-63C-4: bog'lash amallari uchun akkauntning autentifikatsiyalangan sessiyasi talab qilinadi (SHALL). Bog'lashni mahalliy akkauntga kirgan foydalanuvchi tasdiqlashi shu talabga mos."
  - q: "`nonce` nima uchun kerak?"
    options:
      - "Tokenni shifrlash uchun"
      - "Foydalanuvchi ismini yashirish uchun"
      - "Tokenning muddatini belgilash uchun"
      - "Klient sessiyasini ID token bilan bog'laydi: RP har so'rovda tasodifiy nonce yaratib, tokendagi qiymat bilan solishtiradi; boshqa sessiya uchun chiqarilgan yoki ushlangan token qabul qilinmaydi"
    answer: 3
    explain: "OIDC Core nonce'ni klient sessiyasini ID token bilan bog'lash va replay'ni kamaytirish uchun belgilaydi. Qiymat autentifikatsiya so'rovidan tokenga o'zgarishsiz o'tadi va klient uni sessiyada saqlangan bilan solishtirishi shart."
  - q: "Platforma bir nechta mijoz kompaniyaning korporativ provayderini (SSO) qo'llab-quvvatlaydi. `alfa` tenant'ining administratori o'z provayderida `admin@beta.example` email'li foydalanuvchi yaratib, shu orqali kiradi. Qanday himoya?"
    options:
      - "Provayderning har bir tenant'ga bog'lanishini va kirgan identifikator faqat shu tenant'ga tegishli ekanini majburlash; email domenini tenant'ga ro'yxatdan o'tgan domen bilan cheklash va (iss, sub) ni tenant ichida saqlash"
      - "Hamma provayderga to'liq ishonish"
      - "Email bo'yicha global akkaunt qidirish"
      - "Faqat HTTPS"
    answer: 0
    explain: "Har tenant o'z provayderini boshqaradi, demak u istalgan email'ni da'vo qila oladi. Tenant izolyatsiyasi buzilmasligi uchun identifikatsiya tenant doirasida bo'lishi va email domeni tekshirilishi kerak (55-dars)."
task:
  title: "ID token'dan foydalanuvchini aniqlash"
  prompt: |
    `resolveUser(claims, ctx)` imzosi allaqachon tekshirilgan ID token claim'laridan foydalanuvchini aniqlaydi. Hozir u faqat email bo'yicha qidiradi.

    Tuzating. Tartib va qaytariladigan qiymatlar:
    1. `claims.iss !== ctx.iss`: `"rejected:iss"`;
    2. `ctx.clientId` `claims.aud` da yo'q (aud satr yoki massiv): `"rejected:aud"`;
    3. `claims.exp <= ctx.now`: `"rejected:expired"`;
    4. `claims.nonce !== ctx.nonce`: `"rejected:nonce"`;
    5. `ctx.identities` da `iss|sub` kaliti bor: `"user:" + userId`;
    6. aks holda, `email_verified === true` va shu email'li mahalliy akkaunt bor: `"link_required"` (avtomatik bog'lanmaydi);
    7. aks holda: `"new_identity"`.

    Imzoni o'zgartirmang. Kutilgan chiqish: `user:u1`, `rejected:aud`, `rejected:nonce`, `new_identity`, `link_required`, `rejected:expired`.
  lang: ts
  starter: |
    const ISS = "https://idp.example";
    const CLIENT = "avtopark-web";

    type Claims = { iss: string; sub: string; aud: string | string[]; exp: number; nonce?: string; email?: string; email_verified?: boolean };
    type Ctx = {
      iss: string;
      clientId: string;
      nonce: string;
      now: number;
      identities: Map<string, string>;
      emailToUser: Map<string, string>;
    };

    function resolveUser(claims: Claims, ctx: Ctx): string {
      const u = claims.email ? ctx.emailToUser.get(claims.email) : undefined;
      return u ? "user:" + u : "new_identity";
    }

    const ctx: Ctx = {
      iss: ISS,
      clientId: CLIENT,
      nonce: "n-123",
      now: 1_700_000_000,
      identities: new Map([[`${ISS}|sub-1`, "u1"]]),
      emailToUser: new Map([["dispatcher@alfa.example", "u1"]]),
    };
    const base: Claims = { iss: ISS, sub: "sub-1", aud: CLIENT, exp: ctx.now + 300, nonce: "n-123", email: "dispatcher@alfa.example", email_verified: true };
    console.log(resolveUser(base, ctx));
    console.log(resolveUser({ ...base, aud: "malicious-app" }, ctx));
    console.log(resolveUser({ ...base, nonce: "other" }, ctx));
    console.log(resolveUser({ ...base, sub: "sub-attacker", email_verified: false }, ctx));
    console.log(resolveUser({ ...base, sub: "sub-new" }, ctx));
    console.log(resolveUser({ ...base, exp: ctx.now - 1 }, ctx));
  solution: |
    const ISS = "https://idp.example";
    const CLIENT = "avtopark-web";

    type Claims = { iss: string; sub: string; aud: string | string[]; exp: number; nonce?: string; email?: string; email_verified?: boolean };
    type Ctx = {
      iss: string;
      clientId: string;
      nonce: string;
      now: number;
      identities: Map<string, string>;
      emailToUser: Map<string, string>;
    };

    function resolveUser(claims: Claims, ctx: Ctx): string {
      if (claims.iss !== ctx.iss) return "rejected:iss";
      const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
      if (!auds.includes(ctx.clientId)) return "rejected:aud";
      if (typeof claims.exp !== "number" || claims.exp <= ctx.now) return "rejected:expired";
      if (claims.nonce !== ctx.nonce) return "rejected:nonce";
      const linked = ctx.identities.get(`${claims.iss}|${claims.sub}`);
      if (linked) return "user:" + linked;
      if (claims.email_verified === true && claims.email && ctx.emailToUser.has(claims.email)) return "link_required";
      return "new_identity";
    }

    const ctx: Ctx = {
      iss: ISS,
      clientId: CLIENT,
      nonce: "n-123",
      now: 1_700_000_000,
      identities: new Map([[`${ISS}|sub-1`, "u1"]]),
      emailToUser: new Map([["dispatcher@alfa.example", "u1"]]),
    };
    const base: Claims = { iss: ISS, sub: "sub-1", aud: CLIENT, exp: ctx.now + 300, nonce: "n-123", email: "dispatcher@alfa.example", email_verified: true };
    console.log(resolveUser(base, ctx));
    console.log(resolveUser({ ...base, aud: "malicious-app" }, ctx));
    console.log(resolveUser({ ...base, nonce: "other" }, ctx));
    console.log(resolveUser({ ...base, sub: "sub-attacker", email_verified: false }, ctx));
    console.log(resolveUser({ ...base, sub: "sub-new" }, ctx));
    console.log(resolveUser({ ...base, exp: ctx.now - 1 }, ctx));
  solutionNotes: |
    - Foydalanuvchi `iss|sub` kaliti bilan topiladi. Email faqat bog'lash taklifi uchun ishlatiladi, hech qachon avtomatik kirish kaliti emas.
    - `aud` massiv bo'lishi mumkin (OIDC Core): tekshiruv `clientId` borligini qidiradi.
    - `nonce` sessiyada saqlangan qiymat bilan solishtiriladi; boshqa sessiya uchun chiqarilgan token rad etiladi.
    - Tasdiqlanmagan email (`email_verified: false`) mavjud akkaunt bilan mos kelsa ham bog'lanmaydi: natija `new_identity`. Tasdiqlangan email ham to'g'ridan-to'g'ri kirish bermaydi: `link_required`, ya'ni foydalanuvchi avval mahalliy akkaunt bilan kiradi (muallif tavsiyasi).
    - Bu funksiya imzoni, `alg` ni va kalit tanlashni tekshirmaydi: ular claim'lar tahlilidan oldin bajarilishi kerak (47-dars). Ko'p tenant'li holatda `iss` tenant'ga bog'liq bo'lib, `identities` tenant ichida saqlanadi.
  checklist:
    - "Foydalanuvchi `iss|sub` bo'yicha topiladi, email bo'yicha emas"
    - "`aud`, `iss`, `exp`, `nonce` tekshiriladi"
    - "Tasdiqlanmagan email mavjud akkauntga bog'lamaydi"
    - "Tasdiqlangan email ham avtomatik bog'lamaydi"
    - "Tekshiruv tartibi va qaytariladigan qiymatlar shartga mos"
---

## Muammo

"Google bilan kirish" yoki korporativ SSO qo'shilganda ko'pchilik jamoa OAuth 2.0'ni (48-dars) autentifikatsiya sifatida ishlatadi: provayderdan access token oladi, uni bilan foydalanuvchi profilini so'raydi va "kirdi" deb belgilaydi. Bu ishlaydi, lekin xavfsiz emas: OAuth foydalanuvchi kimligini aniqlash uchun mo'ljallanmagan. Access token klientga "bu API'ga kirishing mumkin" deydi, "bu foydalanuvchi hozir bu yerda" demaydi. Boshqa ilovaga berilgan token'ni sizning ilovangizga yuborish (token substitution) tekshirilmasa, hujumchi boshqaning akkauntiga kirib oladi.

OpenID Connect (OIDC) shu bo'shliqni to'ldiruvchi qatlam: OAuth 2.0 ustida ishlaydi va autentifikatsiya natijasini ID token (imzolangan JWT) ko'rinishida beradi. ASVS V10 va OWASP Authentication Cheat Sheet qoidani shunday qisqa qiladi: OAuth o'zi foydalanuvchini autentifikatsiya qilish uchun mo'ljallanmagan, authentication/SSO uchun OIDC ishlatiladi, API authorization uchun OAuth. Biroq OIDC'ni ulash o'z-o'zidan xavfsizlik bermaydi. Amalda uchta xato eng ko'p uchraydi: ID token to'liq tekshirilmaydi (aud, nonce, iss); foydalanuvchi email bo'yicha topiladi va bog'lanadi; ko'p mijozli platformada har mijoz o'z provayderini ulaydi va bu tenant izolyatsiyasini buzadi.

Avtopark platformasida bu aniq stsenariy: kompaniyalar (alfa, beta) o'z korporativ provayderi orqali dispetcherlarni kiritmoqchi. Bu mijozlar uchun qulay, lekin har tenant o'z provayderini boshqaradi, demak o'sha provayder istalgan identifikatorni "tasdiqlay" oladi. Bu dars ID token tekshiruvi va identifikatsiya kaliti qanday tanlanishini mexanizm darajasida ko'rsatadi.

## Asosiy g'oya

### ID token va access token

Authorization code oqimi (48-dars, PKCE bilan) OIDC'da `scope=openid` qo'shilganda ID token ham qaytaradi. Ikki token turli maqsadli:

- ID token: klient (relying party, RP) uchun. Foydalanuvchi qachon va qanday autentifikatsiyalangani haqida da'vo (`iss`, `sub`, `aud`, `exp`, `iat`, `nonce`, ixtiyoriy profil claim'lari). Uni faqat RP tekshiradi, API'ga yuborilmaydi.
- Access token: resurs serveri (API) uchun. RP uchun u shaffof (opaque) bo'lishi mumkin.

Qo'shimcha profil ma'lumoti ID token'dan tashqari UserInfo endpoint orqali olinadi (Authentication Cheat Sheet: ID token'dan tashqari claim'lar kerak bo'lsa UserInfo'dan foydalaning). ASVS V10 token turlarini ham ajratadi: ID token'ni faqat authorization oqimini boshlagan klient iste'mol qiladi, refresh token'ni esa faqat uni bergan authorization server. Demak ID token'ni API'ga yoki boshqa servisga uzatmang.

### ID token tekshiruvi

OIDC Core ID token tekshiruvini sanaydi (3.1.3.7; bu bo'limning to'liq matnini o'qiy olmadik, quyidagi ro'yxat ASVS 10.5 va NIST 800-63C bilan mos). Authentication Cheat Sheet qisqa ro'yxat beradi: emitent (`iss`), auditoriya (`aud`), provayder JWK'lari bo'yicha imzo, muddat (`exp`). NIST 800-63C-4 RP assertion'ni tekshirganda yettita narsani sanaydi: imzo, emitent, vaqt oynasi, auditoriya, nonce, tranzaksiya shartlari (IAL/AAL/FAL) va assertion identifikatori (replay). Mohiyati:

1. Imzo emitentning ommaviy kalitlari (JWKS) bilan tekshiriladi; algoritm serverda belgilangan ro'yxatdan (47-dars). Kalit manbasi provayder metadata'sidan (discovery), ishonchli konfiguratsiyadan olinadi, token ichidagi URL'dan emas.
2. `iss` kutilgan emitentga aniq teng.
3. `aud` da klientning `client_id`'si bor; aks holda token rad etiladi (OIDC Core: MUST). `aud` massiv bo'lishi mumkin.
4. `exp` o'tmagan.
5. `nonce` autentifikatsiya so'rovida yuborilgan qiymatga teng.

`nonce` mexanikasi: RP har kirish urinishida tasodifiy qiymat yaratadi, uni foydalanuvchi sessiyasida saqlaydi va autentifikatsiya so'rovida yuboradi; provayder uni tokenga o'zgartirmay yozadi. OIDC Core bu qiymatni klient sessiyasini ID token bilan bog'lash va replay'ni kamaytirish uchun belgilaydi. Cheat sheet qo'shadi: OIDC oqimlarida nonce CSRF himoyasini beradi. ASVS 10.5.1 ham ID token replay'iga qarshi shu solishtirishni misol qiladi, 10.1.2 esa `code_verifier`, `state` va `nonce` oldindan topib bo'lmaydigan, tranzaksiyaga xos va klient hamda brauzer sessiyasiga bog'langan bo'lishini talab qiladi. Shuning uchun boshqa brauzer sessiyasi uchun chiqarilgan token qabul qilinmaydi. Eslatma: OIDC Core code oqimida nonce'ni ixtiyoriy deb belgilashini bilamiz (spetsifikatsiya matnini bu yerda o'qiy olmadik), shuning uchun nonce'ni yoqing va yuborgan bo'lsangiz uning tokenda borligini va tengligini tekshiring.

### Identifikatsiya kaliti: (iss, sub)

OIDC Core `sub` ni emitent ichida mahalliy noyob va hech qachon qayta berilmaydigan identifikator deb ta'riflaydi. Shuning uchun RP foydalanuvchini `(iss, sub)` juftligi bilan bog'laydi. Email bunday xossaga ega emas: o'zgarishi, kompaniya ichida qayta berilishi, tasdiqlanmagan bo'lishi mumkin. Spetsifikatsiya `email_verified: true` ni provayder email egaligini tasdiqlash choralarini ko'rgan ma'nosida belgilaydi, ya'ni bu provayderning da'vosi, sizning isbotingiz emas. NIST 800-63C-4 ham shu mantiqni qat'iy yozadi: subject identifier emitent nomlar maydonida ko'riladi va RP uni turli IdP'lar bo'yicha global noyob deb hisoblamasligi shart (SHALL NOT); shu sabab `(iss, sub)` juftligi kerak. ASVS 10.3.3 ham bir foydalanuvchini aniqlash uchun boshqa foydalanuvchiga qayta berib bo'lmaydigan claim'lar, odatda `iss` va `sub` kombinatsiyasi, ishlatilishini talab qiladi.

## Chuqurroq: bog'lash va ko'p tenant'li SSO

### Akkaunt bog'lash

Mahalliy akkaunt (email va parol) bor, foydalanuvchi endi "Google bilan kirish"ni bosdi. Ikki yo'l:

- Avtomatik bog'lash: token'dagi email mahalliy akkaunt email'iga teng bo'lsa, shu akkauntga kirgizish. Bu qulay, lekin provayderga to'liq ishonishni talab qiladi; `email_verified` false bo'lsa yoki provayder email tasdiqlashni qat'iy bajarmasa, hujumchi provayderda sizning email'ingiz bilan akkaunt ochib, sizning akkauntingizga kirib oladi (pre-hijacking turi).
- Aniq bog'lash: foydalanuvchi avval mahalliy akkaunti bilan (parol/passkey) kiradi, so'ng "Provayderni ulash" bosadi. Shundan keyingina `(iss, sub)` shu akkauntga bog'lanadi. Bu muallifning tavsiyasi: biroz noqulay, lekin takeover yo'lini yopadi. Authentication Cheat Sheet ham shuni aytadi: email, `preferred_username` kabi claim'lar mos kelgani uchun akkauntlarni avtomatik bog'lamang (ular noyob va barqaror kafolatlanmagan, OIDC Core 5.7), bog'lashdan oldin esa mavjud akkauntning autentifikatsiyalangan sessiyasini talab qiling, ulanayotgan identifikatorning ID token'ini tekshirib bog'lashdan oldin saqlang, uzilgan identifikator orqali kirishni yoping. NIST 800-63C-4 shu yo'nalishda: RP bir akkauntga bir nechta federativ identifikator bog'lashga ruxsat bersa, hamma bog'lash amallari uchun akkauntning autentifikatsiyalangan sessiyasini talab qilishi shart (SHALL), va bu sessiya mavjud federativ identifikatorlardan biri bilan autentifikatsiyani talab qilishi tavsiya etiladi (SHOULD). Email bo'yicha avtomatik moslashtirish esa NIST'ning account resolution qoidasiga zid kelishi mumkin: RP akkaunt ma'lumotini foydalanuvchiga tegishli bo'lmagan federativ identifikatorga bog'lamasligi shart (SHALL).

Ikkala holatda ham bog'langan identifikator yangi authenticator hisoblanadi: uni qo'shish yuqori xavfli harakat bo'lib, bildirishnoma va qayta autentifikatsiya talab qiladi (50-dars). NIST 800-63C-4 yangi federativ identifikator qo'shilganda yoki olib tashlanganda (akkaunt yopilmasa) foydalanuvchiga xabar berishni shart (SHALL) qiladi. Chekka holat ham bor: akkauntda hech qanday federativ identifikator, muqobil authenticator va tiklash yo'li qolmasa, NIST uni o'chirishni yoki yopishni tavsiya etadi (SHOULD), ya'ni provayderni uzgach foydalanuvchi qulflanib qolmasligi uchun muqobil kirish yo'lini oldindan rejalang.

### Ko'p tenant'li SSO

Platformada har mijoz kompaniya (tenant) o'z provayderini ulaydi (alfa, beta). Provayder tenant administratori nazoratida, demak u istalgan `sub`, `email` va hatto `email_verified: true` yarata oladi. Xavfli dizayn: global `email → akkaunt` qidiruvi. Alfa administratori o'z provayderida `admin@beta.example` yaratib, beta tenant'ining akkauntiga kirib oladi. Himoya qatlamlari (muallif tahlili):

- Provayder konfiguratsiyasi tenant'ga bog'liq: har `iss` faqat bitta tenant uchun.
- Identifikatsiya tenant doirasida: `(tenant, iss, sub)`; boshqa tenant'ning akkauntiga yetib bo'lmaydi (55-dars).
- Email domenini tenant'ga ro'yxatdan o'tgan va tasdiqlangan (DNS orqali) domenlar bilan cheklash.
- Tenant provayderi orqali kirgan foydalanuvchi faqat shu tenant doirasida rol oladi; rolni provayder claim'idan olishdan oldin xaritalashni serverda belgilang.

### Boshqa tuzoqlar

OAuth uchun aytilganlar (redirect URI aniq, PKCE, state, mix-up uchun `iss`; 48-dars) OIDC'da ham amal qiladi: ASVS 10.5 OIDC klientini OAuth klienti talablariga qo'shimcha sifatida beradi. Implicit va hybrid oqimlar o'rniga code + PKCE ishlating: ASVS 10.6.1 `code` ni afzal ko'radi, hybrid (`id_token code`) ni faqat istisno sifatida qoldiradi va `token` (implicit) ni taqiqlaydi.

Provayder metadata'si (discovery) ham ishonch chegarasi. ASVS 10.5.3: metadata'dagi issuer oldindan sozlangan issuer URL'ga aniq teng bo'lmasa, klient metadata'ni rad etishi kerak; aks holda zararli server boshqa serverni o'zidek ko'rsata oladi. `aud` uchun ASVS 10.5.4 `aud` qiymati klientning `client_id`'siga teng bo'lishini aytadi; massiv `aud` holati OIDC Core'dan keladi va bu darsdagi kod uni `includes` bilan qoplaydi.

Autentifikatsiya kuchi ham token ichida kelishi mumkin: ASVS 10.3.4 resurs serveri aniq kuch yoki yangilikni talab qilsa, `acr`, `amr` va `auth_time` claim'larini tekshirishni misol qiladi. Bu 41-darsdagi step-up bilan bevosita bog'liq: yuqori xavfli amal oldidan `auth_time` yangiligini tekshiring, provayder `amr` da nima aytganiga ishonish uchun uning siyosatini bilishingiz kerak.

Rozilik (consent) ham xavfsizlik qismi. ASVS 10.7: authorization server klientning kimligiga ishonch bo'lmasa har safar aniq rozilik so'rashi, nima uchun rozilik berilayotganini (scope, ilova, muddat) tushunarli ko'rsatishi va foydalanuvchi rozilikni ko'rib chiqa, o'zgartira va bekor qila olishi kerak. Bu 48-darsdagi consent phishing'ga qarshi asosiy choralardan biri. Chiqish (logout) ham alohida mavzu: provayderdagi sessiya va sizning sessiyangiz mustaqil; provayder sessiyasi tugasa sizniki o'zi tugamaydi. Sessiya muddatlari 46-darsdagi qoidalar bilan belgilanadi. Back-channel logout ishlatsangiz, ASVS 10.5.5 logout token'ni tekshirishni talab qiladi: turi `logout+jwt` bo'lishi, to'g'ri `events` claim'i bo'lishi va `nonce` claim'i bo'lmasligi shart (aks holda logout token oddiy ID token bilan aralashib ketadi), qisqa muddat (masalan 2 daqiqa) tavsiya etiladi. Provayder tomoni uchun ASVS 10.6.2 majburiy chiqarishdan DoS'ga qarshi aniq tasdiq yoki `id_token_hint` kabi parametrlarni tekshirishni aytadi.

## Misol: ID token bilan kirish

Quyidagi model halol provayder (ES256 bilan imzolaydi) va RP'ni ko'rsatadi. JWS ES256 imzosi `r||s` formatida, WebCrypto chiqishi bilan bir xil, shuning uchun modeldagi tekshiruv real formatga mos.

### Zaif kod

RP imzoni tekshiradi, lekin `aud`, `nonce` ni tekshirmaydi va foydalanuvchini email bo'yicha topadi.

```ts run
const enc = new TextEncoder();
const b64u = {
  enc: (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)),
};
const part = (o: unknown) => b64u.enc(enc.encode(JSON.stringify(o)));
const idp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);

async function issue(claims: object): Promise<string> {
  const data = `${part({ alg: "ES256", kid: "k1" })}.${part(claims)}`;
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, idp.privateKey, enc.encode(data)));
  return `${data}.${b64u.enc(sig)}`;
}
async function verifiedClaims(token: string): Promise<any | null> {
  const [h, p, s] = token.split(".");
  const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, idp.publicKey, b64u.dec(s), enc.encode(`${h}.${p}`));
  return ok ? JSON.parse(new TextDecoder().decode(b64u.dec(p))) : null;
}

const users = [{ id: "u1", email: "dispatcher@alfa.example" }];

// ZAIF: faqat imzo; aud/nonce/iss/exp yo'q; email bo'yicha qidiruv.
async function loginWeak(idToken: string): Promise<string | null> {
  const c = await verifiedClaims(idToken);
  if (!c) return null;
  return users.find((u) => u.email === c.email)?.id ?? null;
}

const legit = await issue({ iss: "https://idp.example", sub: "sub-1", aud: "avtopark-web", exp: 1_700_000_300, nonce: "n-1", email: "dispatcher@alfa.example", email_verified: true });
console.log("oddiy kirish:", await loginWeak(legit));
```

```text
oddiy kirish: u1
```

### Hujum

Ikki hujum. Birinchisi: foydalanuvchi hujumchining ilovasida (shu provayder orqali) kirgan va hujumchi olgan ID token (`aud` = hujumchi ilovasi) sizning RP'ga yuboriladi. Ikkinchisi: hujumchi provayderda `dispatcher@alfa.example` email bilan akkaunt ochgan, lekin email tasdiqlanmagan. Hujumlar faqat shu o'quv RP'siga qarshi.

```ts run
const enc = new TextEncoder();
const b64u = {
  enc: (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)),
};
const part = (o: unknown) => b64u.enc(enc.encode(JSON.stringify(o)));
const idp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
async function issue(claims: object): Promise<string> {
  const data = `${part({ alg: "ES256", kid: "k1" })}.${part(claims)}`;
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, idp.privateKey, enc.encode(data)));
  return `${data}.${b64u.enc(sig)}`;
}
async function verifiedClaims(token: string): Promise<any | null> {
  const [h, p, s] = token.split(".");
  const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, idp.publicKey, b64u.dec(s), enc.encode(`${h}.${p}`));
  return ok ? JSON.parse(new TextDecoder().decode(b64u.dec(p))) : null;
}
const users = [{ id: "u1", email: "dispatcher@alfa.example" }];
async function loginWeak(idToken: string): Promise<string | null> {
  const c = await verifiedClaims(idToken);
  if (!c) return null;
  return users.find((u) => u.email === c.email)?.id ?? null;
}

const otherApp = await issue({ iss: "https://idp.example", sub: "sub-1", aud: "attacker-app", exp: 1_700_000_300, nonce: "attacker-nonce", email: "dispatcher@alfa.example", email_verified: true });
console.log("boshqa ilova uchun token:", await loginWeak(otherApp));
const unverified = await issue({ iss: "https://idp.example", sub: "sub-attacker", aud: "avtopark-web", exp: 1_700_000_300, nonce: "n-2", email: "dispatcher@alfa.example", email_verified: false });
console.log("tasdiqlanmagan email:", await loginWeak(unverified));
```

```text
boshqa ilova uchun token: u1
tasdiqlanmagan email: u1
```

### Tuzatilgan kod

RP imzo, `alg`, `iss`, `aud`, `exp` va `nonce` ni tekshiradi, foydalanuvchini `(iss, sub)` bo'yicha topadi va email asosida avtomatik bog'lamaydi.

```ts run
const enc = new TextEncoder();
const b64u = {
  enc: (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)),
};
const part = (o: unknown) => b64u.enc(enc.encode(JSON.stringify(o)));
const idp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
async function issue(claims: object): Promise<string> {
  const data = `${part({ alg: "ES256", kid: "k1" })}.${part(claims)}`;
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, idp.privateKey, enc.encode(data)));
  return `${data}.${b64u.enc(sig)}`;
}

const ISS = "https://idp.example";
const CLIENT = "avtopark-web";
const NOW = 1_699_999_900;
const identities = new Map([[`${ISS}|sub-1`, "u1"]]);
const emailToUser = new Map([["dispatcher@alfa.example", "u1"]]);

async function loginStrong(idToken: string, expectedNonce: string): Promise<string> {
  const [h, p, s] = idToken.split(".");
  const header = JSON.parse(new TextDecoder().decode(b64u.dec(h)));
  if (header.alg !== "ES256" || header.kid !== "k1") return "rejected:alg";
  const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, idp.publicKey, b64u.dec(s), enc.encode(`${h}.${p}`));
  if (!ok) return "rejected:signature";
  const c = JSON.parse(new TextDecoder().decode(b64u.dec(p)));
  if (c.iss !== ISS) return "rejected:iss";
  const auds: string[] = Array.isArray(c.aud) ? c.aud : [c.aud];
  if (!auds.includes(CLIENT)) return "rejected:aud";
  if (typeof c.exp !== "number" || c.exp <= NOW) return "rejected:expired";
  if (c.nonce !== expectedNonce) return "rejected:nonce";
  const linked = identities.get(`${c.iss}|${c.sub}`);
  if (linked) return `user:${linked}`;
  if (c.email_verified === true && emailToUser.has(c.email)) return "link_required";
  return "new_identity";
}

const base = { iss: ISS, sub: "sub-1", aud: CLIENT, exp: 1_700_000_300, nonce: "n-1", email: "dispatcher@alfa.example", email_verified: true };
console.log("oddiy kirish:", await loginStrong(await issue(base), "n-1"));
console.log("boshqa ilova uchun token:", await loginStrong(await issue({ ...base, aud: "attacker-app" }), "n-1"));
console.log("tasdiqlanmagan email:", await loginStrong(await issue({ ...base, sub: "sub-attacker", email_verified: false }), "n-1"));
console.log("boshqa sessiyaning nonce'si:", await loginStrong(await issue(base), "n-boshqa"));
console.log("tasdiqlangan email, yangi sub:", await loginStrong(await issue({ ...base, sub: "sub-new" }), "n-1"));
```

```text
oddiy kirish: user:u1
boshqa ilova uchun token: rejected:aud
tasdiqlanmagan email: new_identity
boshqa sessiyaning nonce'si: rejected:nonce
tasdiqlangan email, yangi sub: link_required
```

Nima uchun yetarli: foydalanuvchi faqat provayder o'zi bergan va avval bog'langan `(iss, sub)` bilan topiladi, token aynan shu RP uchun va shu brauzer sessiyasi uchun. Yopilgan hujumlar: token substitution, tasdiqlanmagan email bilan takeover, boshqa sessiya tokenini qayta ishlatish. Yopilmagan: provayderning o'zi buzilsa yoki noto'g'ri `sub` bersa RP bilolmaydi; ko'p tenant'li holatda `identities` kaliti tenant bilan to'ldirilishi kerak; `link_required` oqimi (mahalliy kirish va bog'lash) bu kodda yo'q; kalitlar rotatsiyasi (JWKS yangilash) va logout ham ko'rsatilmagan.

## Qachon qo'llamaslik kerak

Faqat bitta tizim va o'z foydalanuvchilari bo'lsa, tashqi provayder qo'shish kompleksligi va yangi hujum yuzasini (bog'lash, provayderga ishonish) keltiradi: passkey bilan mahalliy kirish (45-dars) sodda bo'lishi mumkin. Provayder ishlamasa, kirishning o'zi to'xtaydi: provayder ishdan chiqishi sizning mavjudlik riskingiz (1-dars), shuning uchun kamida administrator uchun alohida tiklash yo'lini rejalang (50-dars). Ijtimoiy provayderlar (shaxsiy akkauntlar) korporativ platformada ma'lumot egasini kafolatlamaydi: ular ishdan ketgan xodim akkauntini yopmaydi. Korporativ SSO tenant admin tomonidan boshqariladi, shuning uchun u nafaqat xavfsizlik, balki tenant ishonchi masalasi: har mijozga shartnomada nimaga javobgar ekanini yozing. OIDC'ni o'zingiz yozmang: kutubxonadan foydalaning, lekin yuqoridagi tekshiruvlar yoqilganini testda ko'ring.

## Stack'da: NestJS va Next.js

NestJS'da `openid-client` kabi sertifikatlangan kutubxona orqali discovery, PKCE, state va nonce ni avtomatik boshqaring; ID token tekshiruvi kutubxonada, identifikatsiya (`iss`, `sub` bo'yicha qidiruv) sizning kodingizda. Jadval: `external_identities(tenant_id, iss, sub, user_id, unique(tenant_id, iss, sub))`. `nonce` va `state` ni `HttpOnly` cookie'dagi qisqa muddatli sessiyada saqlang va callback'da bir marta ishlating. Kirishdan keyin sessiya identifikatorini yangilang (46-dars). Next.js'da callback Route Handler'da (Node runtime) bajariladi; ID token brauzerga qaytarilmaydi, xotira yoki serverdagi sessiyada qoladi. Provayder sozlamalari (issuer URL, client secret, JWKS URL) muhit konfiguratsiyasidan olinadi, so'rovdan emas (69-dars). Tenant provayderlarini admin interfeysida qo'shishda issuer URL'ni validatsiya qiling: ichki manzillarga so'rov yuborilishi SSRF (27-dars) bo'lishi mumkin.

## Xulosa

- OIDC OAuth ustida autentifikatsiya beradi: ID token klient uchun, access token API uchun.
- ID token tekshiruvi: imzo (JWKS, algoritm allowlist), `iss`, `aud` (client_id bor), `exp`, `nonce`; `aud` tekshirilmasa token substitution mumkin.
- `nonce` token'ni brauzer sessiyasiga bog'laydi; PKCE va state bilan birga ishlating.
- Foydalanuvchini `(iss, sub)` bilan aniqlang, emailni emas; email `email_verified` bo'lsa ham provayderning da'vosi.
- Akkauntlarni email bo'yicha avtomatik bog'lamang: foydalanuvchi mahalliy akkaunti bilan kirib, provayderni ulasin.
- Ko'p tenant'li SSO'da identifikatsiya tenant doirasida bo'lsin; tenant provayderi boshqa tenant email'ini da'vo qila olmasin.
