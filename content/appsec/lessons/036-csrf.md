---
n: 36
slug: csrf
title: "CSRF: mexanizm va himoya usullari"
summary: "Cross-site request forgery mexanizmi: brauzer cookie'ni avtomatik yuboradi, shuning uchun boshqa saytdan yuborilgan so'rov foydalanuvchi huquqi bilan bajariladi. SameSite, CSRF token, Origin va Fetch Metadata tekshiruvi, har birining chegarasi."
duration: 45
sources:
  - id: cs-csrf
    note: "OWASP CSRF Prevention Cheat Sheet: synchronizer token va imzolangan double-submit cookie (oddiy variant tavsiya etilmaydi), Fetch Metadata siyosati va fallback, Origin tekshiruvi, SameSite cheklovlari, custom header, client-side CSRF, XSS hamma CSRF himoyasini yengishi"
  - id: rfc6265bis
    note: "Cookie qoralamasi: SameSite atributi (Strict, Lax, None) shu hujjatda ta'riflangan. Matn lokal korpusda yo'q, shuning uchun Lax xatti-harakati va cross-site POST'da Lax-allowing-unsafe oynasi haqidagi da'volar OWASP cheat sheet'ning shu qoralamaga havolalariga tayanadi"
  - id: fetch-metadata
    note: "W3C Fetch Metadata: Sec-Fetch-Site, Sec-Fetch-Mode, Sec-Fetch-Dest sarlavhalari va ularning qiymatlari"
quiz:
  - q: "Mijoz kabineti `sessionid` cookie bilan ishlaydi. Foydalanuvchi kirgan holda boshqa saytni ochdi va u saytdagi yashirin forma kabinetning `POST /api/limit` manziliga yuborildi. Nima uchun so'rov foydalanuvchi nomidan bajarilishi mumkin?"
    options:
      - "Brauzer cookie'ni manzil egasiga qarab avtomatik qo'shadi, so'rov qaysi sahifadan boshlangani cookie qo'shishda muhim emas (SameSite bo'lmasa)"
      - "Hujumchi sessiya cookie'sini o'qiydi"
      - "Boshqa sayt kabinet serverini buzadi"
      - "Forma yuborish HTTPS'ni o'chiradi"
    answer: 0
    explain: "CSRF hujumchi cookie'ni ko'rmasdan ishlaydi: brauzer manzilga tegishli cookie'ni so'rovga o'zi qo'shadi. Shuning uchun cookie asosidagi autentifikatsiya, qo'shimcha niyat tasdig'i (token, Origin tekshiruvi) bo'lmasa, cross-site so'rovlarga zaif."
  - q: "API faqat `Authorization: Bearer <token>` sarlavhasi bilan ishlaydi va token localStorage'da. Klassik CSRF bu yerda qanday baholanadi?"
    options:
      - "Xavfli, chunki token avtomatik yuboriladi"
      - "Xavfsiz, hech qanday xavf yo'q"
      - "CSRF faqat GET uchun"
      - "Klassik CSRF qo'llanmaydi, chunki brauzer sarlavhani o'zi qo'shmaydi; lekin token XSS'ga ochiq bo'ladi (19-dars)"
    answer: 3
    explain: "Autentifikatsiya brauzer avtomatik qo'shmaydigan sarlavhada bo'lsa, boshqa sayt shu sarlavhani qo'sha olmaydi. Trade-off: token JavaScript'ga ko'rinadigan joyda turadi va XSS uni o'g'irlashi mumkin. 'Hech qanday xavf yo'q' degani noto'g'ri."
  - q: "Cookie `SameSite=Lax`. Hujumchi sahifasidagi `<form method=\"POST\" action=\"https://app.example/api/limit\">` yuborilganda nima bo'ladi?"
    options:
      - "Cookie yuboriladi"
      - "Cookie yuborilmaydi: Lax faqat cross-site GET navigatsiyani (xavfsiz metod) o'tkazadi, POST'ni emas"
      - "So'rov umuman yuborilmaydi"
      - "Cookie faqat HTTP'da yuboriladi"
    answer: 1
    explain: "Lax cross-site ichki resurs so'rovlari va POST'da cookie yubormaydi, lekin top-level GET navigatsiyada yuboradi. Shu sabab GET orqali holat o'zgartirsangiz Lax himoya qilmaydi. So'rov yuboriladi, faqat cookie'siz keladi (autentifikatsiz)."
  - q: "Server `Sec-Fetch-Site` sarlavhasi bilan CSRF tekshiradi. `same-origin` va `none` ruxsat etilgan, qolganlari rad etiladi. Sarlavha umuman yo'q bo'lgan so'rov (eski brauzer) uchun qaysi yondashuv to'g'ri?"
    options:
      - "Ruxsat berish, chunki sarlavha yo'q"
      - "Origin (va kerak bo'lsa token) bilan zaxira tekshiruv; hech biri bo'lmasa rad etish"
      - "Hech narsa qilmaslik"
      - "Faqat Referer'ga tayanish"
    answer: 1
    explain: "Brauzer-tomon sarlavhalar bo'lmasa, tekshiruv fail-open bo'lmasligi kerak (3-dars). Zaxira: Origin sarlavhasi (POST'da odatda yuboriladi) yoki token. Referer Origin yo'q bo'lganda zaxira bo'lishi mumkin, lekin yolg'iz unga tayanish yetarli emas: sarlavhalar yo'q yoki `Origin: null` bo'lsa, bu same-origin dalili emas."
  - q: "Ilovada CSRF token to'g'ri joriy qilingan, lekin saytda stored XSS bor. Hujumchi CSRF tokenni qanday aylanib o'tadi?"
    options:
      - "O'tolmaydi: token kriptografik himoya"
      - "Faqat brauzerni o'zgartirish bilan"
      - "XSS skripti sahifaning o'zida ishlaydi (same-origin): tokenni sahifadan o'qib, so'rovga qo'shadi"
      - "Token faqat GET'da ishlaydi"
    answer: 2
    explain: "XSS kodi ilova origin'ida ishlaydi va same-origin siyosati unga sahifa va token'ni o'qishga ruxsat beradi. Shu sababli XSS CSRF himoyalarining hammasini yengadi: avval XSS yopiladi (31-35 darslar)."
  - q: "Ilovada `GET /api/vehicle/7/block` mashinani bloklaydi. Nima uchun bu dizayn xavfli?"
    options:
      - "GET xavfsiz metod hisoblanadi: uni cross-site havola, `<img>` va navigatsiya yuboradi, Lax cookie esa top-level GET navigatsiyada qo'shiladi, shuning uchun GET holat o'zgartirmasligi kerak"
      - "GET sekin"
      - "GET'da body yo'q"
      - "Bloklash uchun POST ishlatish shart emas"
    answer: 0
    explain: "HTTP'da GET xavfsiz metod bo'lishi kerak (11-dars). Cross-site `<a>`, `<img>` va navigatsiyalar GET yuboradi, Lax cookie esa top-level GET navigatsiyada qo'shiladi. Cheat Sheet buni SameSite himoyasi amalda eng ko'p buziladigan joy deb ataydi. Holatni o'zgartiruvchi amal POST/PUT/DELETE bo'lib, CSRF himoyasi ostida bo'lishi kerak."
task:
  title: "Origin va Fetch Metadata asosidagi CSRF tekshiruvi"
  prompt: |
    `checkCsrf(req)` funksiyasi holatni o'zgartiruvchi so'rovlarni cross-site manbadan himoya qilishi kerak. Hozir u hamma so'rovni o'tkazadi.

    Qoidalar: GET, HEAD va OPTIONS har doim ruxsat. Boshqa metodlar uchun: agar `sec-fetch-site` sarlavhasi bor bo'lsa, faqat `same-origin` yoki `none` ruxsat etiladi (`same-site` va `cross-site` rad etiladi). Agar u yo'q bo'lsa, `origin` sarlavhasi `APP_ORIGIN` ga to'liq teng bo'lishi kerak. Ikkalasi ham yo'q bo'lsa rad etiladi (fail closed). Sarlavha nomlari kichik harfda keladi.
  lang: ts
  starter: |
    const APP_ORIGIN = "https://app.example";

    type Req = { method: string; headers: Record<string, string | undefined> };

    function checkCsrf(req: Req): boolean {
      return true; // TUZATING
    }

    const post = (headers: Req["headers"]): Req => ({ method: "POST", headers });

    console.log("o'z sahifasidan POST:", checkCsrf(post({ "sec-fetch-site": "same-origin" })) === true);
    console.log("boshqa saytdan POST:", checkCsrf(post({ "sec-fetch-site": "cross-site" })) === false);
    console.log("subdomen POST:", checkCsrf(post({ "sec-fetch-site": "same-site" })) === false);
    console.log("eski brauzer, o'z origin:", checkCsrf(post({ origin: APP_ORIGIN })) === true);
    console.log("eski brauzer, begona origin:", checkCsrf(post({ origin: "https://evil.example" })) === false);
    console.log("sarlavhasiz POST:", checkCsrf(post({})) === false);
    console.log("GET ruxsat:", checkCsrf({ method: "GET", headers: { "sec-fetch-site": "cross-site" } }) === true);
  solution: |
    const APP_ORIGIN = "https://app.example";

    type Req = { method: string; headers: Record<string, string | undefined> };

    const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

    function checkCsrf(req: Req): boolean {
      if (SAFE.has(req.method.toUpperCase())) return true;
      const site = req.headers["sec-fetch-site"];
      if (site !== undefined) return site === "same-origin" || site === "none";
      const origin = req.headers["origin"];
      if (origin !== undefined) return origin === APP_ORIGIN;
      return false;
    }

    const post = (headers: Req["headers"]): Req => ({ method: "POST", headers });

    console.log("o'z sahifasidan POST:", checkCsrf(post({ "sec-fetch-site": "same-origin" })) === true);
    console.log("boshqa saytdan POST:", checkCsrf(post({ "sec-fetch-site": "cross-site" })) === false);
    console.log("subdomen POST:", checkCsrf(post({ "sec-fetch-site": "same-site" })) === false);
    console.log("eski brauzer, o'z origin:", checkCsrf(post({ origin: APP_ORIGIN })) === true);
    console.log("eski brauzer, begona origin:", checkCsrf(post({ origin: "https://evil.example" })) === false);
    console.log("sarlavhasiz POST:", checkCsrf(post({})) === false);
    console.log("GET ruxsat:", checkCsrf({ method: "GET", headers: { "sec-fetch-site": "cross-site" } }) === true);
  solutionNotes: |
    - `sec-fetch-site` brauzer tomonidan qo'yiladigan sarlavha: sahifa JavaScript'i uni o'zgartira olmaydi. Shu sababli unga tayanish mumkin, lekin faqat brauzer so'rovlari uchun (hujumchi curl bilan istalgan sarlavha yuborishi mumkin, ammo bu CSRF emas: u o'z cookie'si bilan o'z nomidan ishlaydi).
    - `same-site` rad etiladi: sibling subdomen ham `same-site`. Agar ichki subdomenlardan so'rov kerak bo'lsa, ularni aniq allowlist qiling.
    - `none` foydalanuvchi manzil satriga yozgan yoki xatcho'pdan ochgan navigatsiya; holatni o'zgartiruvchi so'rovda kam uchraydi, lekin soxta emas.
    - Sarlavha yo'q bo'lsa `Origin` ga o'tiladi, ikkalasi yo'q bo'lsa fail closed. Bu server-to-server chaqiruvlarni ham rad etadi: ularga alohida autentifikatsiya (token, mTLS) va alohida yo'l kerak.
    - Bu tekshiruv CSRF token o'rnini bosishi mumkin, lekin XSS'dan himoya qilmaydi: same-origin so'rovlar baribir o'tadi.
  checklist:
    - "GET, HEAD, OPTIONS so'rovlar tekshirilmaydi"
    - "`sec-fetch-site` bo'lsa, faqat `same-origin` va `none` o'tadi"
    - "Sarlavha yo'q bo'lsa `Origin` aniq tenglik bilan solishtiriladi"
    - "Ikkala sarlavha ham yo'q bo'lsa so'rov rad etiladi"
    - "Bu himoya XSS'ni qoplamasligini ayta olasiz"
---

## Muammo

Dispetcher "Mijoz kabineti"ga kirgan va brauzerida `sessionid` cookie bor. U boshqa tabda "ishga ariza" sahifasini ochadi va unda yashirin forma o'zi yuboriladi: `POST https://kabinet.example/api/vehicle/7/limit`. Brauzer manzil `kabinet.example` ekanini ko'rib, shu domenga tegishli cookie'ni so'rovga o'zi qo'shadi. Server so'rovda to'g'ri sessiya cookie'sini ko'radi va yoqilg'i limitini o'zgartiradi. Dispetcher hech narsa bosmadi va hujumchi cookie'ni hech qachon ko'rmadi.

Bu cross-site request forgery (CSRF). Uning ildizi: cookie asosidagi autentifikatsiya "kim" ekanini isbotlaydi, lekin "bu so'rovni foydalanuvchi o'zi niyat qildimi" ni isbotlamaydi. Brauzer so'rov qaysi sahifadan boshlanganidan qat'i nazar, manzilga tegishli cookie'ni qo'shadi (SameSite cheklovi bo'lmasa). Shuning uchun hujum faqat oddiy ikki shartga tayanadi: foydalanuvchi tizimga kirgan va so'rovning hamma parametrlari hujumchiga oldindan ma'lum (yoki taxmin qilinadigan).

Oqibat doirasi: hujumchi javobni o'qiy olmaydi (same-origin policy, 12-dars), shuning uchun CSRF "ma'lumot o'qish" emas, "amal bajarish" hujumi: parolni o'zgartirish, limit yoki bildirishnoma manzilini almashtirish, mashinani bloklash, yangi foydalanuvchi qo'shish. XSS bilan farqi shu: XSS hujumchi kodini sizning origin'ingizda ishlatadi va javobni ham o'qiydi; CSRF faqat blind so'rov yuboradi.

## Asosiy g'oya

OWASP CSRF Prevention Cheat Sheet CSRF himoyasini bir necha mustaqil qatlam sifatida beradi. Uning ketma-ketligi: avval framework'ning o'z CSRF himoyasi bor-yo'qligini tekshiring va undan foydalaning; yo'q bo'lsa holat o'zgartiruvchi har so'rovga token qo'ying; faqat zamonaviy brauzerlar nishonda bo'lsa Fetch Metadata va fallback bilan to'sish mumkin; shundan tashqari kamida bitta chuqur himoya (defense in depth) qatlamini qo'shing. Go 1.25 dan standart kutubxonada `CrossOriginProtection` turi bor, u ham aynan Fetch Metadata asosidagi himoyani amalga oshiradi.

Himoyaning mohiyati: server so'rovning foydalanuvchi niyatidan kelganini tasdiqlovchi, hujumchi bilmaydigan yoki soxtalashtira olmaydigan belgi talab qiladi. Variantlar:

1. **SameSite cookie.** Cookie'ni cross-site so'rovlarga qo'shmaslik. `Strict`: faqat same-site so'rovlarda. `Lax`: bundan tashqari top-level navigatsiya bilan kelgan xavfsiz metodlar (GET) ham. `None`: har doim (va `Secure` talab qilinadi). Bu eng sodda va birinchi qatlam.
2. **CSRF token.** Server sessiyaga bog'liq tasodifiy qiymat beradi, forma yoki sarlavha orqali qaytib kelishini talab qiladi. Hujumchi boshqa saytdan bu qiymatni bilmaydi va o'qiy olmaydi.
3. **Origin / Referer tekshiruvi.** Brauzer POST'da `Origin` sarlavhasini qo'shadi; server uni o'z origin'i bilan solishtiradi.
4. **Fetch Metadata.** `Sec-Fetch-Site` sarlavhasi brauzer tomonidan qo'yiladi va so'rov same-origin, same-site, cross-site yoki foydalanuvchi navigatsiyasi (`none`) ekanini aytadi. Sahifa JavaScript'i uni o'zgartira olmaydi.
5. **Custom sarlavha.** API faqat maxsus sarlavha (masalan `X-Requested-With`) bilan kelgan so'rovni qabul qiladi; cross-origin sarlavha qo'shish preflight talab qiladi (14-dars). Bu yordamchi qatlam, birlamchi emas.

Hammasi uchun ikki qoida: holatni o'zgartiruvchi amal GET bo'lmaydi (HTTP'da GET xavfsiz metod, 11-dars), va himoya hujumchi nazorat qila olmaydigan belgi (brauzer qo'yadigan sarlavha, sessiyaga bog'liq sir) ustiga quriladi.

## Chuqurroq: har usulning chegarasi

### SameSite va "site" tushunchasi

SameSite cookie'ning cross-site so'rovlarga qo'shilishini boshqaradi, lekin "site" origin'dan kengroq (12-dars): `app.example` va `eski.app.example` bitta site. Sibling subdomen yoki sizning domeningizdagi boshqa ilovada XSS bo'lsa, undan yuborilgan so'rov same-site hisoblanadi va cookie qo'shiladi. Shuning uchun SameSite kuchli, lekin yagona himoya emas. Ikkinchi nozik joy: `Lax` top-level GET navigatsiyada cookie'ni qo'shadi, shu sababli GET orqali holat o'zgartiradigan endpoint hujumga ochiq. Uchinchisi: cheat sheet'ga ko'ra Chromium asosidagi brauzerlar `SameSite` ko'rsatilmagan cookie'ni `Lax` deb oladi, Firefox va Safari esa yo'q, eski va o'rnatilgan klientlar atributni umuman e'tiborsiz qoldirishi mumkin; `Lax` default bo'lgan brauzerlar cookie o'rnatilgandan keyin qariyb ikki daqiqa cross-site top-level POST'da ham yuborishi mumkin (cheat sheet shunday yozadi). Atributni har doim aniq yozing (13-dars).

### CSRF token

Synchronizer token: server sessiya ichida tasodifiy qiymat saqlaydi va HTML formaga (yoki sahifa meta-teg orqali JS'ga) beradi; keyingi so'rovda kelgan qiymatni solishtiradi. Stateless variant: "double submit cookie": token cookie va so'rov tanasida/sarlavhasida yuboriladi, server ikkisini solishtiradi. Oddiy double-submit cookie subdomen hujumiga ochiq (sibling subdomen cookie qo'yishi mumkin), shuning uchun cheat sheet imzolangan variantni (token HMAC bilan sessiyaga bog'langan) tavsiya qiladi. Talablar: token CSPRNG'dan (67-dars), sessiyaga bog'liq yoki imzolangan, URL'da emas (log va Referer orqali sizadi), solishtirish doimiy vaqtda.

### Origin va Fetch Metadata

Brauzer cross-origin POST'da `Origin` yuboradi. Server uni `APP_ORIGIN` bilan aniq tenglik bilan solishtiradi (`startsWith` yoki `includes` emas: `https://app.example.evil.com` ham shunday boshlanadi). `Sec-Fetch-Site` qiymatlari: `same-origin`, `same-site`, `cross-site`, `none`. Server holat o'zgartiruvchi so'rovlarda faqat `same-origin` (va kerak bo'lsa `none`) ni qabul qiladi. Bu tekshiruv token holatini saqlamaydi (stateless), lekin faqat zamonaviy brauzerlarda mavjud. Sarlavhalar yo'q bo'lsa, Origin yoki token zaxira, hech biri bo'lmasa rad etish (fail closed).

### Fetch Metadata siyosati: aniq qoidalar va joriy qilish

Cheat Sheet `Sec-Fetch-Site` ni asosiy signal deb ataydi va siyosatni shunday beradi: sarlavha bor bo'lsa, `cross-site` bilan kelgan xavfsiz bo'lmagan metodlar (POST, PUT, PATCH, DELETE) rad etiladi; `same-origin` ruxsat; `same-site` faqat sibling subdomenlarga ishonsangiz ruxsat, aks holda ehtiyotkor ishlov; `none` foydalanuvchi o'zi boshlagan top-level navigatsiya (xatcho'p, yozilgan URL). Sarlavha umuman yo'q bo'lsa, ikki yo'l: fail-safe (nozik endpoint'lar uchun tavsiya, so'rovni bloklash) yoki fail-open (moslik birinchi o'rinda bo'lsa, Origin tekshiruvi va token bilan zaxira). Spetsifikatsiyada ro'yxatda yo'q qiymat kelsa, oldinga moslik uchun sarlavhani e'tiborsiz qoldirish tavsiya etiladi. Qo'shimcha: cross-site GET navigatsiyani (`Sec-Fetch-Mode: navigate`, `Sec-Fetch-Dest` `object` yoki `embed` emas) o'tkazish kerak, aks holda sizga tashqi havola ishlamay qoladi, va ataylab cross-origin ishlaydigan endpoint'lar (CORS JSON API, webhook) global rad etishdan alohida istisno qilinib, o'z autentifikatsiyasi bilan himoyalanadi.

Joriy qilish shartlari ham bor. Fetch Metadata sarlavhalari faqat potentially trustworthy URL'larga (https, wss, localhost) yuboriladi, shuning uchun butun ilova HTTPS bo'lishi va HSTS yoqilgan bo'lishi kerak. Cheat Sheet Safari 16.4+ ni qo'shib, zamonaviy brauzerlarda 98% dan ortiq qamrovni yozadi, lekin proksi va gateway'lar `Origin` yoki `Sec-*` sarlavhalarini olib tashlashi mumkin, shu sababli fallback majburiy. Prerender va prefetch kabi speculative navigatsiya sarlavhalari yakuniy navigatsiyaga mos kelmasligi ham mumkin. Javob sarlavhalar bo'yicha o'zgarsa, `Vary: Sec-Fetch-Site, Origin` qo'yiladi, bu himoya emas, kesh to'g'riligi uchun. Va avval "log only" rejimida ishga tushiring: bloklanadigan so'rovlarni yozib, noto'g'ri ijobiylarni ko'rib chiqing, keyin enforce qiling.

### Soddalarni taqiqlash va custom header

HTML `<form>` brauzer preflight qilmaydigan "oddiy" so'rov yuboradi, uning content type'i `application/x-www-form-urlencoded`, `multipart/form-data` yoki `text/plain`. Shuning uchun JSON API `text/plain` ni ham qabul qilsa, CSRF'ga ochiq qoladi; oddiy tuzatish: server shu uch turni rad etadi. Custom sarlavhali yondashuvda (`X-CSRF-Token`) API sarlavha borligini tekshiradi; brauzerlar custom sarlavhali so'rovni preflight qiladi, demak sarlavha bor so'rov preflight'dan o'tgan. Bu faqat CORS to'g'ri sozlangan bo'lsa ishlaydi: credentials bilan faqat o'zingiz nazorat qiladigan aniq origin'lar ruxsat etilishi kerak, `*.example.com` kabi regex subdomen egallansa bypass bo'ladi. Cheat Sheet ogohlantiradi: brauzer xatosi tufayli preflight majburlanmasa, bu himoya buziladi, shuning uchun token qo'shimcha qatlam beradi.

### Token amaliyoti: nimani qilmaslik kerak

Cheat Sheet synchronizer token'ni sessiya ichida saqlashni, formada yashirin maydon yoki custom sarlavha orqali qaytarishni tavsiflaydi va tokenni cookie ichida uzatmaslikni aytadi (cookie validatsiya xavfsiz emas: brauzer cookie'ni cross-site so'rovda o'zi qo'shadi). Sarlavha orqali yuborilgan token yashirin form maydonidan xavfsizroq, chunki custom sarlavhali so'rovlar same-origin siyosatiga bo'ysunadi. Oddiy (naive) double-submit cookie bypass qilinadi: sibling subdomen, DNS takeover yoki oddiy HTTP orqali cookie yozishi mumkin bo'lgan hujumchi mos cookie qo'yib, soxta so'rov yasaydi; cheat sheet uni tavsiya etmaydi. Imzolangan variantda HMAC-SHA-256 sessiyaga bog'liq qiymat (server sessiya ID, lekin uni tokenda ochiq qoldirmasdan) va anti-collision tasodifiy qiymat ustida hisoblanadi; solishtirish doimiy vaqtli funksiya bilan. Ikki keng tarqalgan noto'g'ri tushuncha ham sanalgan: token ichiga vaqt tamg'asi qo'yib muddat berish (CSRF token access token emas, yangi sessiya yangi token beradi) va tokenni har so'rovda almashtirish (xavfsizlikni sezilarli oshirmaydi, "Back" tugmasi kabi foydalanish tajribasini buzadi). Quyidagi misoldagi token soddalashtirilgan: u faqat sessiyaga bog'liq HMAC, anti-collision qiymatsiz.

### Client-side CSRF

Cheat Sheet alohida ta'kidlaydigan yangi variant: hujumchi kodni emas, sizning klient JavaScript'ingizni boshqaradi. Agar sahifa skripti URL hash'idan, window name'dan, `document.referrer`dan yoki `postMessage` dan request manzili va metodini o'qib `fetch` qilsa, hujumchi tayyorlagan havola sahifaning o'z kodini hujum so'rovini yuborishga majburlaydi. Bu so'rov same-origin, tokenni sahifa o'zi qo'shadi, cookie ham same-site sifatida ketadi, shu sababli token ham, SameSite ham himoya bermaydi. Server nuqtai nazaridan so'rov "niyatli" ko'rinadi. Tuzatish klientda: so'rov manzili va metodini hech qachon tashqi kirishdan olmang, imkon bo'lmasa format va qiymatni qat'iy tekshiring (masalan faqat GET va oldindan belgilangan prefiks), yoki JavaScript ichida oldindan belgilangan xavfsiz so'rovlar ro'yxatidan indeks bo'yicha tanlang. Bu 31-darsdagi DOM XSS bilan bir xil ildiz: ishonchsiz source xavfli sink'ga (bu yerda `fetch`) kodlash yoki tekshiruvsiz yetadi.

### Login CSRF va boshqa yon holatlar

Login CSRF: hujumchi qurbonni o'z akkauntiga kirgizadi (hujumchi hisobiga kirish formasini yuboradi), keyin qurbon kiritgan ma'lumot hujumchi akkauntida qoladi. Login formasi ham CSRF tokenga muhtoj. Boshqa holatlar: CORS ruxsatlari (14-dars) noto'g'ri bo'lsa, boshqa origin javobni o'qiy oladi va token ham o'g'irlanadi; cross-origin JSON so'rovlari preflight talab qilgani uchun himoya qiladi, lekin `Content-Type` ni faqat `text/plain`/forma turlariga tushirib server JSON sifatida qabul qilsa, bu yordam yo'qoladi (kontent turini qat'iy tekshiring); WebSocket handshake (77-dars) cookie bilan keladi va `Origin` tekshiruvini talab qiladi.

### XSS hammasini yengadi

Tokenlar, Origin va Fetch Metadata hamma so'rovning same-origin ekanini tekshiradi. XSS kodi sahifa origin'ida ishlagani uchun same-origin so'rov yuboradi, tokenni sahifadan o'qiydi va hamma CSRF himoyasi o'tadi. OWASP cheat sheet bu haqda ochiq ogohlantiradi. Shu sababli 31-35 darslardagi XSS himoyasi CSRF himoyasining shartidir.

## Misol: yoqilg'i limitini o'zgartirish

Misol brauzer va server xatti-harakatining soddalashtirilgan modeli: cookie qo'shish qoidasi (SameSite) va server tekshiruvi sof funksiyalar. Hujum faqat shu model ichidagi o'quv kodiga qarshi.

### 1. Zaif kod

Server faqat cookie'ga qaraydi. Brauzer modeli cookie'ni so'rov kelib chiqishiga va SameSite atributiga qarab qo'shadi:

```ts run
type SameSite = "None" | "Lax" | "Strict" | undefined;
type Browser = { pageSite: string; targetSite: string; method: string; topLevelNav: boolean };

// Brauzer modeli: cookie qachon qo'shiladi (soddalashtirilgan)
function cookieSent(sameSite: SameSite, b: Browser): boolean {
  const crossSite = b.pageSite !== b.targetSite;
  if (!crossSite) return true;
  if (sameSite === "None") return true;
  if (sameSite === "Lax") return b.topLevelNav && (b.method === "GET" || b.method === "HEAD");
  return false; // Strict yoki ko'rsatilmagan model sifatida qat'iy
}

const sessions = new Map([["S-1", { user: "dispetcher-1", tenant: "alfa" }]]);
const limits = new Map([["v7", 40]]);

// ZAIF: faqat cookie'ga qaraydi
function setLimitWeak(cookie: string | undefined, vehicleId: string, value: number): string {
  const s = cookie ? sessions.get(cookie) : undefined;
  if (!s) return "401 kirish talab qilinadi";
  limits.set(vehicleId, value);
  return `200 limit ${value} (${s.user})`;
}

// Foydalanuvchi kirgan; cookie SameSite=None (yoki himoyasiz eski sozlama)
const attackBrowser: Browser = { pageSite: "evil.example", targetSite: "app.example", method: "POST", topLevelNav: false };
const cookie = cookieSent("None", attackBrowser) ? "S-1" : undefined;
console.log("cookie yuborildi:", cookie !== undefined);
console.log(setLimitWeak(cookie, "v7", 0));
console.log("v7 limiti:", limits.get("v7"));
```

### 2. Hujum

Hujumchi sahifasi (`evil.example`) foydalanuvchi brauzeridan `app.example` ga forma yuboradi. Modelda cookie `SameSite=None`, shuning uchun cross-site POST'da ham qo'shiladi:

```text
cookie yuborildi: true
200 limit 0 (dispetcher-1)
v7 limiti: 0
```

Server so'rovni haqiqiy foydalanuvchi deb bajardi. Hujumchi javobni ko'rmadi, lekin amalga erishdi: mashina yoqilg'i limiti 0 ga tushdi.

### 3. Tuzatilgan kod

Ikki qatlam: cookie `SameSite=Lax` (cross-site POST'da yuborilmaydi) va server tomonida Fetch Metadata/Origin tekshiruvi hamda token. Token sessiyaga HMAC bilan bog'lanadi:

```ts run
type SameSite = "None" | "Lax" | "Strict";
type Browser = { pageSite: string; targetSite: string; method: string; topLevelNav: boolean };

function cookieSent(sameSite: SameSite, b: Browser): boolean {
  const crossSite = b.pageSite !== b.targetSite;
  if (!crossSite) return true;
  if (sameSite === "None") return true;
  if (sameSite === "Lax") return b.topLevelNav && (b.method === "GET" || b.method === "HEAD");
  return false;
}

const enc = new TextEncoder();
async function hmac(key: string, msg: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
  return [...sig].map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 16);
}
const SERVER_SECRET = "o'quv-maxfiy-kalit"; // haqiqiy tizimda secrets manager'dan

const sessions = new Map([["S-1", { user: "dispetcher-1" }]]);
const limits = new Map([["v7", 40]]);

type Req = { cookie?: string; csrfToken?: string; secFetchSite?: string; origin?: string };

async function setLimit(req: Req, vehicleId: string, value: number): Promise<string> {
  const s = req.cookie ? sessions.get(req.cookie) : undefined;
  if (!s) return "401 kirish talab qilinadi";
  const site = req.secFetchSite;
  const originOk = site !== undefined ? site === "same-origin" : req.origin === "https://app.example";
  if (!originOk) return "403 cross-site so'rov rad etildi";
  const expected = await hmac(SERVER_SECRET, req.cookie!);
  if (req.csrfToken !== expected) return "403 CSRF token noto'g'ri";
  limits.set(vehicleId, value);
  return `200 limit ${value} (${s.user})`;
}

// 1) Hujum: cross-site POST. SameSite=Lax bo'lgani uchun cookie umuman yuborilmaydi
const attack: Browser = { pageSite: "evil.example", targetSite: "app.example", method: "POST", topLevelNav: false };
console.log("hujum, cookie yuborildi:", cookieSent("Lax", attack));
console.log(await setLimit({ cookie: undefined }, "v7", 0));

// 2) Cookie qandaydir yo'l bilan yetgan (masalan sibling subdomen), lekin token yo'q
console.log(await setLimit({ cookie: "S-1", secFetchSite: "same-site", origin: "https://eski.app.example" }, "v7", 0));
console.log(await setLimit({ cookie: "S-1", secFetchSite: "same-origin" }, "v7", 0));

// 3) Haqiqiy foydalanuvchi: o'z sahifasidan, tokenni sahifadan olgan
const token = await hmac(SERVER_SECRET, "S-1");
console.log(await setLimit({ cookie: "S-1", secFetchSite: "same-origin", csrfToken: token }, "v7", 55));
console.log("v7 limiti:", limits.get("v7"));
```

```text
hujum, cookie yuborildi: false
401 kirish talab qilinadi
403 cross-site so'rov rad etildi
403 CSRF token noto'g'ri
200 limit 55 (dispetcher-1)
v7 limiti: 55
```

### Tuzatish nima uchun yetarli

Uch mustaqil to'siq. `SameSite=Lax` cross-site POST'da cookie'ni yubormaydi, shuning uchun hujum sessiyasiz keladi (401). Cookie qandaydir yo'l bilan yetsa ham (sibling subdomen, SameSite qo'llab-quvvatlamaydigan brauzer), Fetch Metadata `same-site` va `cross-site` ni rad etadi. Ularni ham o'tkazib yuborgan taqdirda (same-origin), hujumchi sessiyaga bog'liq tokenni bila olmaydi (HMAC maxfiy kalit bilan).

Qoldiq risklar: (1) XSS bo'lsa, same-origin so'rov va token o'qish mumkin, hamma qatlam o'tadi; (2) token imzolash kaliti sizsa, tokenlar soxtalashadi; (3) o'quv modeli real brauzerni to'liq takrorlamaydi (masalan, Lax'ning ayrim brauzerlardagi qo'shimcha oynasi); (4) token solishtirishi doimiy vaqtli emas: produksiyada `timingSafeEqual` kerak (62-dars); (5) GET orqali holat o'zgartiruvchi endpoint bo'lsa, Lax uni himoya qilmaydi.

## Qachon qo'llamaslik kerak

- Autentifikatsiya brauzer avtomatik qo'shmaydigan `Authorization` sarlavhasida bo'lgan sof API (mobil ilova, server-to-server) uchun klassik CSRF token kerak emas. Ammo bunday tokenni brauzerda saqlash XSS xavfini o'zgartiradi (19-dars).
- Cookie asosida ishlaydigan, lekin faqat o'qish (GET, xavfsiz) endpoint'larga CSRF token qo'yish ortiqcha. Muhimi, GET ichida holat o'zgartirmaslik.
- Token + SameSite + Fetch Metadata + Origin hammasini birdan qo'yish ortiqcha murakkablik bo'lishi mumkin. Zamonaviy brauzer auditoriyasi bilan ishlaganda `SameSite=Lax` va Fetch Metadata tekshiruvi ko'pincha yetarli; eski brauzerlar yoki sibling subdomenlar xavfi bo'lsa token qo'shiladi. Tanlovni threat model (4-dars) asosida qiling.
- `SameSite=None` kerak bo'lgan integratsiyalarda (boshqa saytga o'rnatiladigan vidjet) SameSite himoya bermaydi; token va Origin tekshiruvi majburiy bo'ladi.
- CORS ochish (`Access-Control-Allow-Origin` + credentials) CSRF himoyasini sustlashtiradi: boshqa origin javobni o'qiy oladi (14-dars).
- CSRF himoyasi XSS yoki to'g'ri avtorizatsiya o'rnini bosmaydi: tokenli so'rov ham o'z huquqi chegarasidan oshmasligi kerak (51-dars).

## Stack'da: NestJS, Fastify va Next.js

Cheat sheet imzolangan double-submit cookie'ni tavsiya qiladi va Fetch Metadata tekshiruvini sodda, mustaqil usul sifatida ko'rsatadi, shuning uchun tayyor paket tanlashdan oldin uning holatini o'zingiz tekshiring (81-dars) yoki Fetch Metadata tekshiruvini o'zingiz yozing. Quyida bu tekshiruv umumiy hook sifatida. Kod ishga tushirilmaydi (Fastify muhiti kerak), faqat sintaksis jihatidan tekshirilgan:

```ts
import Fastify from "fastify";

const APP_ORIGIN = "https://app.example";
const SAFE = new Set(["GET", "HEAD", "OPTIONS"]);

const app = Fastify();

app.addHook("onRequest", async (req, reply) => {
  if (SAFE.has(req.method)) return;
  const site = req.headers["sec-fetch-site"];
  if (typeof site === "string") {
    if (site === "same-origin" || site === "none") return;
    return reply.code(403).send({ error: "cross-site so'rov rad etildi" });
  }
  if (req.headers.origin === APP_ORIGIN) return; // eski brauzer zaxirasi
  return reply.code(403).send({ error: "manba aniqlanmadi" });
});

app.post("/api/vehicle/:id/limit", async (req) => {
  // sessiya cookie: HttpOnly; Secure; SameSite=Lax (13-dars)
  return { ok: true };
});
```

Next.js hujjatiga ko'ra Server Action'lar faqat POST bilan chaqiriladi va `Origin` sarlavhasi `Host` (yoki `X-Forwarded-Host`) bilan solishtiriladi, mos kelmasa rad etiladi; reverse proxy yoki CDN domenlari uchun `experimental.serverActions.allowedOrigins` ro'yxati sozlanadi. Sozlama hujjati yana bir nozik joyni aytadi: umuman `Origin` sarlavhasi yo'q so'rov rad etilmaydi, ogohlantirish bilan o'tkaziladi, ya'ni Cheat Sheet'dagi fail-closed qoidasidan farq qiladi. Bu tekshiruv hujjatda Server Action'lar uchun tasvirlangan; Route Handler'lar uchun unga tayanmang va handler boshida Fetch Metadata yoki token tekshiruvini umumiy funksiyaga chiqaring. NestJS'da bu global guard yoki interceptor sifatida joylashadi (58-dars). Cookie atributlarini (`HttpOnly`, `Secure`, `SameSite`, `__Host-` prefiksi) 13-darsdagi tartibda sozlang.

## Xulosa

- CSRF: brauzer cookie'ni so'rov qaysi sahifadan boshlanganidan qat'iy nazar qo'shadi; server niyatni tasdiqlamasa, cross-site so'rov foydalanuvchi nomidan bajariladi. Hujumchi javobni ko'rmaydi, lekin amal bajaradi.
- Qatlamlar: `SameSite` cookie, CSRF token (sessiyaga bog'liq/imzolangan), Origin va Fetch Metadata tekshiruvi. Biri ham yolg'iz mukammal emas.
- SameSite 'site' darajasida ishlaydi: sibling subdomen va GET orqali holat o'zgartirish uni aylanib o'tadi. Holat o'zgartiruvchi amal hech qachon GET bo'lmasin.
- Tekshiruv fail closed bo'lsin: brauzer sarlavhalari ham, Origin ham, token ham bo'lmasa rad eting; `Origin` ni aniq tenglik bilan solishtiring.
- XSS barcha CSRF himoyalarini yengadi: 31-35 darslardagi himoya CSRF'ning ham sharti.
