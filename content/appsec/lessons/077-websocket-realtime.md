---
n: 77
slug: websocket-realtime
title: "WebSocket va real-time kanallar"
summary: "WebSocket'da autentifikatsiya va avtorizatsiya nega alohida masala: Cross-Site WebSocket Hijacking va Origin allowlist, token'ni birinchi xabarda yuborish, har xabar va har kanal obunasi uchun avtorizatsiya, xabarlarni sxema bilan tekshirish, ulanish va xabar limitlari, uzoq yashaydigan ulanishlarda sessiya tugashi."
duration: 40
sources:
  - id: cs-websocket
    note: "WebSocket Security Cheat Sheet: xavflar (CSWSH, autentifikatsiya yo'qligi, injection, DoS, monitoring bo'shliqlari); wss, permessage-deflate, Origin allowlist, cookie va SameSite, token'ni birinchi xabarda yuborish, sessiya tugashi va logout'da yopish, xabar darajasidagi avtorizatsiya, xabar sxemasi va hajm limiti, nonce/timestamp, ulanish va xabar limitlari, idle timeout, heartbeat, backpressure, monitoring va maxfiy ma'lumotni logga yozmaslik"
  - id: cs-authn
    note: "Authentication Cheat Sheet: umumiy autentifikatsiya tamoyillari; WebSocket cheat sheet autentifikatsiya va sessiya uchun shu cheat sheet'larga havola beradi"
  - id: api-top10
    note: "API4:2023 (cheklanmagan resurs sarfi) va API1/API5 (obyekt va funksiya darajasidagi avtorizatsiya): WebSocket kanallariga ham qo'llanadi"
  - id: nestjs-gateways
    note: "NestJS Gateways: handleConnection() to'siq emas, Nest uning async tugashini kutmaydi; xabarlargacha rad etish uchun socket.io'da server.use(), WsAdapter bilan @WebSocketGateway() opsiyalaridagi verifyClient; @WebSocketGateway ikkinchi argumenti server opsiyalarini uzatadi"
  - id: nestjs-ws-guards
    note: "NestJS WebSockets Guards: HTTP guard'lardan farqi faqat WsException; guard false qaytarsa 'Forbidden resource'; global guard'lar (useGlobalGuards, APP_GUARD) gateway'larga ham qo'llanadi"
  - id: nestjs-ws-filters
    note: "NestJS WebSockets Exception filters: global filter'lar (useGlobalFilters, APP_FILTER) gateway'larga qo'llanmaydi, @UseFilters() gateway yoki metod darajasida"
  - id: whatwg-html
    note: "Brauzerdagi WebSocket API shu spetsifikatsiyaning bir qismi; dars xavfsizlik qoidalarini spetsifikatsiyadan emas, WebSocket Security Cheat Sheet va NestJS hujjatiga tayanib beradi"
  - id: rfc6455
    note: "RFC 6455 4.1 (brauzer mijoz Origin yuborishi shart; versiya 13; mijoz 101 va to'g'ri Sec-WebSocket-Accept bo'lmasa ulanishni rad etadi), 4.2.1-4.2.2 (Origin'siz urinish brauzer deb hisoblanmaydi; server Origin bilan qaror qabul qilishi mumkin, rad etsa 403 kabi HTTP xato qaytaradi; muvaffaqiyatda 101 Switching Protocols), 10.1 (brauzer bo'lmagan mijoz Origin'ni soxtalashtirishi mumkin), 10.2 (server kutilgan Origin'ni tekshirishi kerak va 403 bilan rad etishi kerak), 10.5 (handshake'da autentifikatsiya usulini protokol belgilamaydi: cookie, HTTP auth, TLS auth)"

quiz:
  - q: "Foydalanuvchi ilovaga kirgan (session cookie bor). U boshqa saytni ochdi va u sayt `new WebSocket('wss://app.fleet.example/live')` ni ishga tushirdi. Server faqat cookie'ni tekshiradi. Nima bo'ladi?"
    options:
      - "Brauzer cookie yubormaydi, hujum ishlamaydi"
      - "Server ulanishni rad etadi, chunki WebSocket CORS bilan himoyalangan"
      - "Brauzer cookie'ni handshake bilan birga yuboradi va server ulanishni qabul qiladi; hujumchi sayti foydalanuvchi nomidan jonli ulanishga ega bo'ladi (CSWSH). Himoya: Origin allowlist"
      - "Hujum faqat ws:// bilan ishlaydi, wss:// bilan emas"
    answer: 2
    explain: "Cheat sheet'ga ko'ra brauzerlar cookie'larni WebSocket handshake'iga qo'shadi va aynan shu CSWSH imkonini beradi. wss:// shifrlaydi, lekin kim ulanayotganini tekshirmaydi. Origin sarlavhasini brauzer qo'yadi va zararli JavaScript uni o'zgartira olmaydi."
  - q: "Origin tekshiruvi `origin.includes('fleet.example')` bilan yozilgan. Qaysi origin o'tib ketadi?"
    options:
      - "`https://fleet.example.evil.test`: substring tekshiruvi uni qabul qiladi; to'g'ri usul: aniq allowlist bilan to'liq tenglik"
      - "Faqat `https://fleet.example`"
      - "Hech qaysi"
      - "Faqat `http://` bilan boshlanuvchilar"
    answer: 0
    explain: "Cheat sheet allowlist ishlatishni, wildcard yoki substring taqqoslashdan qochishni aytadi, chunki ular xatoga moyil. Aniq origin satrlarining to'plami (sxema, host, port) bilan to'liq tenglik tekshiriladi."
  - q: "Token handshake URL'iga query parametri sifatida qo'yilgan (`/live?token=...`). Cheat sheet bunga qanday qaraydi va nima tavsiya etadi?"
    options:
      - "Eng yaxshi usul, chunki oddiy"
      - "Faqat HTTP uchun xavfli"
      - "Xavfsiz, chunki wss URL'ni ham shifrlaydi va token hech qayerda ko'rinmaydi"
      - "Token'ni birinchi xabarda wss orqali yuborish; autentifikatsiya muvaffaqiyatli bo'lguncha faqat autentifikatsiya xabari qabul qilinadi, himoyalangan ma'lumot yuborilmaydi, xato yoki timeout'da ulanish yopiladi"
    answer: 3
    explain: "Cheat sheet tokenni URL query'da emas (u access log'larga tushishi mumkin), birinchi xabarda yuborishni, autentifikatsiyagacha faqat auth xabarini qabul qilishni va autentifikatsiyalanmagan ulanishlarni cheklashni aytadi. Token xabar loglariga ham tushmasligi kerak."
  - q: "Ulanish autentifikatsiyadan o'tgan. Mijoz `{\"type\":\"subscribe\",\"channel\":\"tenant:beta:vehicles\"}` yubordi, u esa 'alfa' tenant'iga tegishli. Qaysi javob to'g'ri?"
    options:
      - "Qabul qilish, chunki ulanish autentifikatsiyadan o'tgan"
      - "Obuna so'rovi xabar darajasida tekshiriladi: kanal shu tenant'ga tegishli bo'lmasa rad etiladi; ulanish ochiq bo'lishi cheksiz kirish degani emas"
      - "Ulanishni yopish va foydalanuvchini bloklash majburiy"
      - "Kanal nomini shifrlash yetarli"
    answer: 1
    explain: "Cheat sheet 'ulanish ochiq' ni 'cheksiz kirish' deb qabul qilmaslikni va har harakat uchun avtorizatsiyani tekshirishni aytadi. Bu API1 va API5 ning real-time ko'rinishi. Rad etish va (monitoring uchun) logga yozish yetarli, bloklash alohida qaror."
  - q: "Foydalanuvchi logout qildi, lekin uning WebSocket ulanishi ochiq qoldi va telemetriya oqib turibdi. Qaysi nazorat bu bo'shliqni yopadi?"
    options:
      - "Cookie'ni o'chirish"
      - "Faqat parolni almashtirish"
      - "Sessiya va ulanishlar xaritasini yuritish: logout yoki sessiya tugashida shu sessiyaning hamma WebSocket ulanishlarini yopish va ulanishlarda sessiyani davriy qayta tekshirish"
      - "Mijoz kodida ulanishni yopish"
    answer: 2
    explain: "WebSocket ulanishlari odatda oddiy sessiyadan uzoqroq yashaydi. Cheat sheet logout'da hamma ulanishni darhol yopishni, sessiya tugaganda yopishni va davriy qayta tekshirishni (30 daqiqa odatiy) aytadi. Mijoz tomondagi yopish hujumchiga ta'sir qilmaydi."
  - q: "Mijoz sekundiga 10 000 ta kichik xabar yuboradi. Bitta xabar hajmi cheklangan (64 KB). Qaysi qo'shimcha nazorat zarur?"
    options:
      - "Hech qaysi: hajm chegarasi hammasini hal qiladi"
      - "Foydalanuvchi bo'yicha xabar chastotasi limiti, ulanishlar soni limiti, idle timeout va backpressure; xabar hajmi bitta o'lchov xolos"
      - "Faqat HTTPS"
      - "Faqat xabarlarni siqish"
    answer: 1
    explain: "Cheat sheet hajm chegarasi bilan birga xabar chastotasi limiti (100 xabar/daqiqa odatiy boshlang'ich), ulanishlar sonini cheklash, idle timeout, heartbeat va backpressure ni tavsiya qiladi. Siqish (permessage-deflate) esa, kerak bo'lmasa, o'chirilishi aytilgan."
task:
  title: "WebSocket xabarini yo'naltirish va tekshirish"
  prompt: |
    `route(raw, ctx)` autentifikatsiyadan o'tgan ulanishdan kelgan xabarni qayta ishlaydi. Hozir u hamma JSON xabarni qabul qiladi va har qanday kanalga obuna beradi.

    Qoidalar (shu tartibda):
    1. `raw.length > 256` bo'lsa `"close:1009"` (xabar juda katta).
    2. JSON bo'lmasa `"err:json"`.
    3. `type !== "subscribe"` yoki `channel` satr bo'lmasa `"err:schema"`.
    4. Kanal nomi `^tenant:([a-z0-9-]{1,20}):(vehicles|alerts)$` ga mos kelmasa `"err:schema"`.
    5. Kanalning tenant qismi `ctx.tenant` ga teng bo'lmasa `"err:forbidden"`.
    6. Aks holda `"ok:subscribe <kanal>"`.

    Kutilgan natija: oltita holat va chiqish ketma-ketligi: `close:1009`, `err:json`, `err:schema`, `err:forbidden`, `ok:subscribe tenant:alfa:vehicles`, `err:schema`.
  lang: ts
  starter: |
    type Ctx = { tenant: string };

    function route(raw: string, ctx: Ctx): string {
      const m = JSON.parse(raw);
      return "ok:subscribe " + m.channel;
    }

    const ctx: Ctx = { tenant: "alfa" };
    const cases = [
      JSON.stringify({ type: "subscribe", channel: "tenant:alfa:vehicles", pad: "x".repeat(300) }),
      "{not json",
      JSON.stringify({ type: "ping" }),
      JSON.stringify({ type: "subscribe", channel: "tenant:beta:vehicles" }),
      JSON.stringify({ type: "subscribe", channel: "tenant:alfa:vehicles" }),
      JSON.stringify({ type: "subscribe", channel: "tenant:alfa:vehicles:../x" }),
    ];
    for (const c of cases) {
      try {
        console.log(route(c, ctx));
      } catch (e) {
        console.log("xato:", (e as Error).name);
      }
    }
  solution: |
    type Ctx = { tenant: string };

    const CHANNEL = /^tenant:([a-z0-9-]{1,20}):(vehicles|alerts)$/;

    function route(raw: string, ctx: Ctx): string {
      if (raw.length > 256) return "close:1009";
      let m: unknown;
      try {
        m = JSON.parse(raw);
      } catch {
        return "err:json";
      }
      const o = m as { type?: unknown; channel?: unknown } | null;
      if (typeof o !== "object" || o === null || o.type !== "subscribe" || typeof o.channel !== "string") return "err:schema";
      const match = CHANNEL.exec(o.channel);
      if (!match) return "err:schema";
      if (match[1] !== ctx.tenant) return "err:forbidden";
      return "ok:subscribe " + o.channel;
    }

    const ctx: Ctx = { tenant: "alfa" };
    const cases = [
      JSON.stringify({ type: "subscribe", channel: "tenant:alfa:vehicles", pad: "x".repeat(300) }),
      "{not json",
      JSON.stringify({ type: "ping" }),
      JSON.stringify({ type: "subscribe", channel: "tenant:beta:vehicles" }),
      JSON.stringify({ type: "subscribe", channel: "tenant:alfa:vehicles" }),
      JSON.stringify({ type: "subscribe", channel: "tenant:alfa:vehicles:../x" }),
    ];
    for (const c of cases) {
      try {
        console.log(route(c, ctx));
      } catch (e) {
        console.log("xato:", (e as Error).name);
      }
    }
  solutionNotes: |
    - Hajm tekshiruvi JSON parse'dan oldin: katta xabarni parse qilish uchun ham resurs sarflamaymiz. Real kutubxonada hajm chegarasi (`maxPayload` kabi) protokol darajasida, xabar to'liq xotiraga o'qilmasdan ishlaydi.
    - Kanal nomi qat'iy regex bilan tekshiriladi (allowlist), tenant qismi esa ulanish kontekstidan solishtiriladi. Kanal nomini oddiy `split(":")` bilan ajratib "tenant" qismini olish shu regex o'rnini bosmaydi: `tenant:alfa:vehicles:../x` kabi qo'shimcha bo'laklar o'tib ketadi.
    - "Begona tenant" va "noma'lum tur" uchun javoblar farqli (`err:forbidden`, `err:schema`). Real tizimda begona tenant kanali borligini oshkor qilmaslik uchun ikkalasiga ham bir xil xato qaytarish va ichki logga farqini yozish mumkin.
    - Ulanishning autentifikatsiyadan o'tgani va `ctx.tenant` ishonchli manbadan (token) olingani oldindan faraz qilingan.
    - Bu funksiya xabar chastotasini, ulanishlar sonini va xabarning replay'ini cheklamaydi; ular alohida nazorat.
  checklist:
    - "Katta xabar `close:1009` beradi va parse qilinmaydi"
    - "Begona tenant kanali `err:forbidden` beradi"
    - "Noto'g'ri formatdagi kanal nomi `err:schema` beradi"
    - "Faqat o'z tenant'ining kanaliga `ok:subscribe` qaytadi"
    - "Chastota, ulanishlar soni va replay himoyasi bu funksiyada yo'qligini ayta olasiz"
---

## Muammo

Avtopark platformasida dispetcher ekrani jonli: mashinalar xaritada harakatlanadi, yoqilg'i signali sekundlar ichida paydo bo'ladi. Buning uchun WebSocket ishlatiladi: brauzer serverga bir marta HTTP handshake yuboradi, so'ng ulanish ochiq qoladi va ikki tomon istalgan payt xabar almashadi. Xavfsizlik nuqtai nazaridan bu uch narsani o'zgartiradi.

Birinchisi, autentifikatsiya bir marta handshake'da bajariladi, keyin esa ulanish soatlab ochiq turadi. Foydalanuvchi logout qilsa yoki sessiyasi tugasa, ochiq ulanish davom etaveradi. Ikkinchisi, REST'da har so'rov marshrut bo'yicha avtorizatsiyadan o'tadi, WebSocket'da esa xabarlar ichki `type` maydoni bilan ajratiladi va "bu foydalanuvchi shu kanalga obuna bo'la oladimi?" savoli har xabarda qayta berilishi kerak. Uchinchisi, an'anaviy HTTP loglari faqat boshlang'ich upgrade so'rovini ko'radi, xabar trafigini emas.

WebSocket Security Cheat Sheet muammolarni shunday sanaydi: Cross-Site WebSocket Hijacking (CSWSH), autentifikatsiyani chetlab o'tish (o'rnatilgan autentifikatsiya yo'qligi tufayli kirish nazoratini unutish oson), xabarlar orqali injection (XSS, SQL injection va boshqa payload'lar), DoS (doimiy ulanishlar ulanishni tugatish kabi yangi vektorlarni ochadi) va monitoring bo'shliqlari. Cheat sheet haqiqiy hodisalarga ham ishora qiladi: Gitpod'dagi 2023 yilgi CSWSH (yetarli Origin tekshiruvi yo'qligi tufayli hisobni to'liq egallash) va 2018 yilgi Spring STOMP xabarlari orqali kod bajarish zaifligi (CVE-2018-1270). Ikkala hodisa cheat sheet'da advisory havolalari bilan keltirilgan.

Bu dars real-time kanalni uch qatlamda ko'radi: handshake (kim ulanadi va qayerdan), xabar (nima va ruxsat bormi) va resurs (qancha va qancha vaqt).

## Asosiy g'oya

### CSWSH: cookie va Origin

Brauzerlar WebSocket handshake'iga cookie'larni avtomatik qo'shadi. Cheat sheet hujum ssenariysini to'rt qadamda beradi: foydalanuvchi ilovangizga kiradi (session cookie o'rnatiladi); keyin zararli saytni ochadi; zararli sayt sizning ilovangizga WebSocket ochadi va brauzer cookie'larni yuboradi; server ulanishni qabul qiladi va hujumchi jonli, autentifikatsiyalangan WebSocket kirishiga ega bo'ladi. Bu CSRF (36-dars) ning real-time varianti: WebSocket handshake `Same-Origin Policy` ga bo'ysunmaydi (12-dars), shuning uchun CORS bu yerda himoya bermaydi, qarorni server o'zi qabul qiladi.

Asosiy himoya: har handshake'da `Origin` sarlavhasini tekshirish. Cheat sheet bu sarlavhani brauzer qo'yishini va zararli JavaScript uni bekor qila olmasligini aytadi, hamda aniq ishonchli origin'lar allowlist'ini ishlatishni, wildcard va substring bo'yicha taqqoslashdan (xatoga moyil) qochishni talab qiladi. Node.js'dagi `ws` kutubxonasi uchun cheat sheet Origin'ni HTTP serverning `upgrade` hodisasida, `handleUpgrade` chaqirilishidan oldin tekshirishni va `verifyClient` dan qochishni (kutubxona uni tavsiya etmaydi) aytadi. Yana bir qatlam: CSRF himoyasi bor ilovalarda CSRF token'ni handshake'ga qo'shish, shuningdek `SameSite=Lax` yoki `Strict` cookie'lar.

Origin tekshiruvi brauzer mijozlari uchun ishlaydi. RFC 6455 buni shunday belgilaydi: 4.1-bo'limga ko'ra so'rov brauzerdan kelsa, mijoz `Origin` yuborishi shart; 4.2.1 `Origin` sarlavhasi yo'q urinishni brauzerdan kelgan deb talqin qilmaslikni aytadi; 4.2.2 serverga Origin'dan qabul qarorida foydalanishga ruxsat beradi va rad etilganda 403 Forbidden kabi HTTP xato qaytarilishi shartligini yozadi; 10.2 esa faqat ma'lum saytlar uchun mo'ljallangan server kutilgan Origin'ni tekshirishi va yaroqsiz bo'lsa 403 bilan rad etishi kerakligini aytadi. 10.2 maqsadni ham cheklaydi: niyat brauzer bo'lmagan mijozlarning ulanishini to'sish emas, balki ishonchsiz brauzer skripti handshake'ni soxtalashtirishining oldini olish. 10.1-bo'lim sababni beradi: brauzer bo'lmagan host o'z nomidan ishlaydi va soxta `Origin` yuborib serverni aldashi mumkin, shuning uchun server kirishga ishonmasligi kerak. Xulosa: Origin tekshiruvi autentifikatsiyani almashtirmaydi, faqat brauzer orqali amalga oshadigan cross-site hujumni yopadi. Handshake'da autentifikatsiya usulini RFC belgilamaydi (10.5): har qanday HTTP autentifikatsiya mexanizmi, jumladan cookie, ishlatilishi mumkin, CSWSH aynan shu cookie uchun xavf.

### Autentifikatsiya: token birinchi xabarda

WebSocket'ning o'zida autentifikatsiya mexanizmi yo'q. Cheat sheet brauzer mijozlari token ishlatsa, tokenni birinchi xabarda wss orqali yuborishni tavsiya qiladi va URL query'dan qochishni aytadi, chunki query'dagi token access log'larga sizib chiqishi mumkin. Tafsilotlar: token tekshiruvi muvaffaqiyatli bo'lgunga qadar faqat autentifikatsiya xabari qabul qilinadi va himoyalangan ma'lumot yuborilmaydi; autentifikatsiya xatosi yoki timeout'da ulanish yopiladi; autentifikatsiyalanmagan ulanishlar soni cheklanadi. Token xabar loglariga ham tushmasligi kerak. Uzoq yashaydigan ulanishlarda tokenni aylantirish (refresh) hijack qilingan sessiya cheksiz davom etmasligi uchun tavsiya etiladi. Umumiy autentifikatsiya va sessiya qoidalari uchun cheat sheet Authentication va Session Management cheat sheet'larga havola beradi (41 va 46-darslar).

### Sessiya umri va ulanish

Cheat sheet WebSocket ulanishlari oddiy sessiyadan uzoq yashashini ta'kidlaydi. Tavsiyalar: sessiya tugaganda ulanishni yopish (server tomonda tekshirish), uzoq ulanishlarda sessiyani davriy qayta tekshirish (har 30 daqiqada odatiy), foydalanuvchi logout qilganda uning hamma ulanishini darhol yopish. Buning uchun server sessiya identifikatoridan faol ulanishlar ro'yxatiga xarita yuritishi kerak. Aks holda logout faqat yangi so'rovlarni to'xtatadi, ochiq ulanish esa davom etadi.

### Xabar darajasidagi avtorizatsiya

Cheat sheet qoidasi: WebSocket ulanishi cheksiz kirish degani emas, har harakat uchun avtorizatsiyani tekshiring. Avtopark platformasida bu aniq ko'rinishga ega: ulanish "alfa" tenant foydalanuvchisiga tegishli; `subscribe` xabari kanal nomini oladi; server kanalning shu tenant'ga tegishli ekanini va foydalanuvchi shu mashinalar guruhini ko'rishga haqli ekanini tekshiradi. Bu API1 (obyekt darajasi) va API5 (funksiya darajasi) ning real-time ko'rinishi (71, 52 va 53-darslar). Kanal nomi mijoz kiritgan ma'lumot: uni qat'iy format bilan tekshirib, so'ng tenant qismini ulanish kontekstidagi tenant bilan solishtiring.

## Chuqurroq: xabar, resurs va monitoring

### Xabar tuzilmasi va injection

Cheat sheet WebSocket xabarlarini ishonchsiz kirish deb hisoblashni aytadi: ular SQLi, XSS va buyruq injection payload'larini tashiy oladi. Tavsiya: tuzilma va mazmunni JSON sxemalari va allowlist bilan tekshirish (72-dars), xabar hajmiga chegara (odatda 64 KB yoki kamroq), binar ma'lumot uchun fayl turini content-type emas, magic bytes bilan aniqlash (74-dars). Replay'ga qarshi xabarlarga timestamp yoki nonce qo'shib, takrorlarni rad etish (75-dars). JSON uchun `JSON.parse()` ishlating, `eval()` emas. Xabar mazmuni sahifaga chiqarilsa, brauzer tomonda kontekstga mos kodlash kerak (32 va 33-darslar).

### DoS va resurs

Doimiy ulanishlar DoS xavfini oshiradi. Cheat sheet: umumiy ulanishlar sonini va foydalanuvchi bo'yicha (afzal) yoki IP bo'yicha ulanishlar sonini cheklash; xabar hajmi chegarasi (odatda 64 KB yoki kamroq) va xabar chastotasi limiti (minutiga 100 xabar odatiy boshlang'ich nuqta sifatida tilga olingan); idle timeout bilan faol bo'lmagan ulanishlarni yopish; ping/pong heartbeat bilan o'lik ulanishlarni tozalash; backpressure, ya'ni tez yuboruvchi xabarlar tez qayta ishlanmasa xotira to'lib ketishining oldini olish. `ws` uchun `maxPayload` kabi sozlamalar bor. Siqish uchun cheat sheet `permessage-deflate` ni, kerak bo'lmasa, o'chirishni aytadi, chunki siqish va maxfiy ma'lumot birga ishlatilganda CRIME/BREACH'ga o'xshash ma'lumot sizishi mumkin. NestJS Throttler hujjati WebSocket uchun `ThrottlerGuard` ni kengaytirib, `handleRequest()` ni qayta yozishni ko'rsatadi (73-dars). 73-darsdagi token bucket'ni xabar chastotasi uchun ham ishlating.

### Transport va infratuzilma

Faqat `wss://`: cheat sheet shifrlanmagan `ws://` ni production'da ishlatmaslikni va faqat RFC 6455 protokolini qo'llab-quvvatlashni (eski Hixie-76 va hybi-00 versiyalarida ma'lum zaifliklar bor) aytadi. Reverse proxy, load balancer va CDN WebSocket upgrade'ni to'g'ri uzatishi (HTTP/1.1 upgrade, `Upgrade` va `Connection` sarlavhalari, uzun o'qish timeout'lari) kerak; WAF handshake'dan keyingi xabarlarni tekshira olmasligi mumkin, shunda server tomonda tekshiruv va log asosiy qatlam bo'ladi.

### Monitoring

Cheat sheet loglanadigan hodisalarni sanaydi: ulanish o'rnatilishi va tugashi (foydalanuvchi, IP va origin bilan), handshake va xabar paytidagi autentifikatsiya va avtorizatsiya hodisalari, xavfsizlik buzilishlari (rate limit ishga tushishi, xabar validatsiyasi xatolari) va g'ayritabiiy uzilishlar. Shu bilan birga to'liq xabar mazmuni, tokenlar, sessiya identifikatorlari va shaxsiy ma'lumotlarni logga yozmaslik kerak (79-dars).

## Misol: dispetcher kanali

Misolda WebSocket serveri o'rniga handshake va xabarni qayta ishlovchi sof funksiyalar bor. Tarmoq yo'q; ulanish holati oddiy obyekt. Bu to'liq WebSocket amalga oshirilishi emas, faqat Origin, autentifikatsiya, avtorizatsiya va limitlar mexanizmini ko'rsatuvchi model.

### 1. Zaif kod

```ts run
type Conn = { user: string; tenant: string; subs: string[] };
const sessions: Record<string, Conn> = { sess_u1: { user: "u1", tenant: "alfa", subs: [] } };

// ZAIF: Origin tekshirilmaydi, cookie yetarli deb hisoblanadi
function handshakeWeak(_origin: string, cookie: string): Conn | null {
  return sessions[cookie] ?? null;
}

// ZAIF: har kanalga obuna beradi, hajm va chastota cheklanmagan
function onMessageWeak(c: Conn, raw: string): string {
  const m = JSON.parse(raw) as { type: string; channel: string };
  if (m.type === "subscribe") {
    c.subs.push(m.channel);
    return "obuna: " + m.channel;
  }
  return "noma'lum";
}

// Brauzer boshqa saytdan ulanayotganda ham cookie'ni yuboradi
const c = handshakeWeak("https://evil.example", "sess_u1");
console.log("1) begona origin:", c ? `qabul (user=${c.user}, tenant=${c.tenant})` : "rad");
console.log("2)", c ? onMessageWeak(c, JSON.stringify({ type: "subscribe", channel: "tenant:beta:vehicles" })) : "-");
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu cross-site WebSocket usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Foydalanuvchi `u1` ("alfa") ilovada kirgan. U `evil.example` sahifasini ochadi; sahifaning skripti ilova manziliga WebSocket ochadi va brauzer sessiya cookie'sini yuboradi. Keyin ulanish orqali "beta" tenant'ining kanaliga obuna so'raydi. Natija:

```text
1) begona origin: qabul (user=u1, tenant=alfa)
2) obuna: tenant:beta:vehicles
```

Handshake begona origin'dan qabul qilindi (CSWSH) va ulanish `u1` nomidan ishladi. Keyin autentifikatsiyadan o'tgan ulanish boshqa tenant'ning telemetriya kanaliga obuna bo'ldi: xabar darajasida avtorizatsiya yo'q.

### 3. Tuzatilgan kod

Origin allowlist, cookie'siz token birinchi xabarda, xabar darajasida avtorizatsiya, sxema, hajm va chastota limiti.

```ts run
type Conn = { state: "new" | "authed" | "closed"; tenant?: string; subs: string[]; count: number; closed?: number };

const ALLOWED_ORIGINS = new Set(["https://app.fleet.example"]); // aniq allowlist
const TOKENS: Record<string, { tenant: string }> = { tok_u1: { tenant: "alfa" } };
const MAX_BYTES = 256; // o'quv qiymati; real chegara talabga qarab
const MAX_MSGS = 5; // o'quv qiymati
const CHANNEL = /^tenant:([a-z0-9-]{1,20}):(vehicles|alerts)$/;

function handshake(origin: string): Conn | string {
  if (!ALLOWED_ORIGINS.has(origin)) return "rad: origin";
  return { state: "new", subs: [], count: 0 };
}

function close(c: Conn, code: number): string {
  c.state = "closed";
  c.closed = code;
  return `yopildi ${code}`;
}

function onMessage(c: Conn, raw: string): string {
  if (c.state === "closed") return "yopiq";
  if (raw.length > MAX_BYTES) return close(c, 1009);
  if (++c.count > MAX_MSGS) return close(c, 1008);
  let m: { type?: unknown; token?: unknown; channel?: unknown };
  try {
    m = JSON.parse(raw);
  } catch {
    return "xato: json";
  }
  if (c.state === "new") {
    if (m.type !== "auth") return close(c, 1008); // autentifikatsiyagacha faqat auth
    const t = typeof m.token === "string" ? TOKENS[m.token] : undefined;
    if (!t) return close(c, 1008);
    c.state = "authed";
    c.tenant = t.tenant;
    return "autentifikatsiya: ok";
  }
  if (m.type !== "subscribe" || typeof m.channel !== "string") return "xato: sxema";
  const match = CHANNEL.exec(m.channel);
  if (!match) return "xato: sxema";
  if (match[1] !== c.tenant) return "xato: ruxsat yo'q"; // xabar darajasida avtorizatsiya
  c.subs.push(m.channel);
  return "obuna: " + m.channel;
}

console.log("1) begona origin:", handshake("https://evil.example"));
console.log("2) app.fleet.example.evil.test:", handshake("https://app.fleet.example.evil.test"));

const early = handshake("https://app.fleet.example") as Conn;
console.log("3) auth'siz subscribe:", onMessage(early, JSON.stringify({ type: "subscribe", channel: "tenant:alfa:vehicles" })));

const c = handshake("https://app.fleet.example") as Conn;
console.log("4)", onMessage(c, JSON.stringify({ type: "auth", token: "tok_u1" })));
console.log("5)", onMessage(c, JSON.stringify({ type: "subscribe", channel: "tenant:beta:vehicles" })));
console.log("6)", onMessage(c, JSON.stringify({ type: "subscribe", channel: "tenant:alfa:vehicles" })));
console.log("7)", onMessage(c, "x".repeat(300)));
```

```text
1) begona origin: rad: origin
2) app.fleet.example.evil.test: rad: origin
3) auth'siz subscribe: yopildi 1008
4) autentifikatsiya: ok
5) xato: ruxsat yo'q
6) obuna: tenant:alfa:vehicles
7) yopildi 1009
```

### Tuzatish nima uchun yetarli

Invariantlar: begona origin'dan handshake qabul qilinmaydi, allowlist aniq tenglik bilan ishlaydi (`app.fleet.example.evil.test` ham rad etildi); autentifikatsiyagacha faqat `auth` xabari qabul qilinadi; har obuna kanal formatini va tenant tengligini tekshiradi; hajmdan katta xabar parse qilinmasdan ulanishni yopadi; xabarlar soni cheklangan. Natijada CSWSH, begona tenant kanali va oddiy flood yopildi.

Yopilmagan narsalar: tokenni aylantirish, sessiya tugashida ulanishni yopish (ulanishlar xaritasi) va logout bilan ulanishni uzish bu modelda yo'q. Origin tekshiruvi brauzerdan tashqari mijozlarni to'xtatmaydi (ular `Origin` ni o'zi yozadi); ular uchun token autentifikatsiyasi asosiy. Chastota limiti ulanish ichida sanaladi; ulanishlar sonini foydalanuvchi bo'yicha cheklash, idle timeout, heartbeat va backpressure kodda ko'rsatilmagan. `MAX_BYTES` va `MAX_MSGS` o'quv qiymatlari. Tenant ichida foydalanuvchi huquqlari (masalan, faqat o'z guruhi mashinalari) ham alohida.

## Qachon qo'llamaslik kerak

- Har real-time ehtiyoj WebSocket talab qilmaydi. Yangilanishlar tez-tez emas, bir tomonlama (server mijozga) bo'lsa, Server-Sent Events yoki oddiy polling soddaroq va mavjud HTTP nazoratlariga (marshrut avtorizatsiyasi, rate limit, log) mos tushadi. WebSocket'ni ikki tomonlama, past kechikishli aloqa kerak bo'lganda tanlang.
- Origin tekshiruvi va cookie asosidagi autentifikatsiya faqat brauzer mijozlari uchun ma'noli. Faqat mobil ilova yoki qurilmalar ulansa, Origin e'tiborga olinmaydi va asosiy nazorat token va mTLS (66-dars) bo'ladi.
- Har xabarda to'liq avtorizatsiya yuqori chastotali telemetriyada qimmat bo'lishi mumkin. Obuna paytida bir marta tekshirib, ulanishga kanallar ro'yxatini bog'lash va ruxsat o'zgarganda (rol o'zgarishi, tenant'dan chiqarilish) obunalarni qayta tekshirish yoki yopish samaraliroq. Bu kelishuv: tekshiruv kam, lekin ruxsatni bekor qilish mexanizmi kerak.
- Xabar sxemasi va hajm limiti juda qat'iy bo'lsa, legitim burst (masalan, mashina oflayndan keyin to'plangan yozuvlarni yuborishi) uziladi. Limitlarni o'lchangan yuklama bilan sozlang.

## Stack'da: NestJS va ws

NestJS'da WebSocket gateway'lari `@WebSocketGateway` bilan e'lon qilinadi, `@SubscribeMessage` metodlari xabar turiga bog'lanadi. Guard'lar gateway xabarlariga ham qo'llanadi (58-dars), lekin HTTP guard'idagi kabi kontekst boshqa: `context.switchToWs()`. NestJS hujjati bir nozik joyni aniq aytadi: `handleConnection()` to'siq emas. Nest uning async tugashini kutmaydi, shuning uchun ulanishni uzishdan oldin kelgan xabarlar baribir qayta ishlanadi. Har xabarni tekshirish uchun guard'larni xabar handler'lariga bog'lang (global guard'lar, ya'ni `app.useGlobalGuards()` yoki `APP_GUARD`, gateway'larga ham qo'llanadi; guard `false` qaytarsa Nest `'Forbidden resource'` xabarli `WsException` tashlaydi). Ulanishni birinchi xabargacha rad etish uchun hujjat connection-level middleware'ni ko'rsatadi: socket.io'da `afterInit()` ichida `server.use()`, `WsAdapter` bilan esa `@WebSocketGateway()` opsiyalaridagi `verifyClient`. Bunda cheat sheet bilan ziddiyat bor: u `ws` uchun Origin'ni HTTP serverning `upgrade` hodisasida, `handleUpgrade` dan oldin tekshirishni aytadi va kutubxona `verifyClient` ni tavsiya etmasligini eslatadi. Amalda Nest hujjatidagi yo'l ishlaydi, lekin uni Origin allowlist bilan birga ishlating va qaysi qatlam qarorni qabul qilishini testda tasdiqlang: begona origin'dan ulanib ko'ring. Yana bir fakt: global exception filter'lar (`useGlobalFilters()` yoki `APP_FILTER`) gateway'larga qo'llanmaydi, filter gateway yoki metod darajasida `@UseFilters()` bilan bog'lanadi, aks holda 78-darsdagi umumiy xato javobi bu kanalda ishlamaydi. Quyidagi parcha xabar darajasidagi tenant avtorizatsiyasini ko'rsatadi; u `WsAdapter` (`ws`) ishlatilgan deb faraz qiladi, shuning uchun `path` va `maxPayload` ws server opsiyalari sifatida beriladi.

```ts
import { SubscribeMessage, WebSocketGateway, ConnectedSocket, MessageBody } from "@nestjs/websockets";

type AuthedSocket = { tenantId?: string; subs?: Set<string>; close(code?: number, reason?: string): void };
const CHANNEL = /^tenant:([a-z0-9-]{1,20}):(vehicles|alerts)$/;

@WebSocketGateway({ path: "/live", maxPayload: 64 * 1024 })
export class LiveGateway {
  @SubscribeMessage("subscribe")
  subscribe(@ConnectedSocket() sock: AuthedSocket, @MessageBody() body: { channel?: unknown }) {
    if (!sock.tenantId) {
      sock.close(1008, "auth required"); // autentifikatsiyagacha faqat auth xabari
      return;
    }
    const m = typeof body.channel === "string" ? CHANNEL.exec(body.channel) : null;
    if (!m || m[1] !== sock.tenantId) return { error: "forbidden" };
    (sock.subs ??= new Set()).add(body.channel as string);
    return { ok: true };
  }
}
```

`maxPayload` ws server opsiyasi (cheat sheet ham `maxPayload: 64 * 1024` misolini beradi); socket.io adapterida esa boshqa opsiya nomi ishlatiladi. Kanal obunasi yozilgandan keyin xabar tarqatishda ham tenant tekshiruvi qayta bajariladi: obuna ro'yxati xotirada o'zgarmas deb hisoblanmasin. Ko'p instance bo'lsa, ulanishlar xaritasi va xabar tarqatish uchun Redis pub/sub ishlatiladi; Redis kanallari ham tenant prefiksi bilan ajratilishi va Redis'ning o'zi himoyalanishi kerak (89-dars).

## Xulosa

- WebSocket handshake cookie'ni avtomatik yuboradi: Origin allowlist (aniq tenglik) CSWSH'ga qarshi asosiy himoya; wildcard va substring tekshiruvlaridan qoching.
- Brauzer mijozlar uchun token birinchi xabarda wss orqali yuboriladi; URL query'da emas. Autentifikatsiyagacha faqat auth xabari qabul qilinadi.
- Ochiq ulanish cheksiz kirish emas: har xabar, ayniqsa kanal obunasi, tenant va huquq bo'yicha avtorizatsiyadan o'tadi.
- Xabarlar ishonchsiz kirish: sxema, hajm chegarasi, `JSON.parse` (eval emas), takrorga qarshi nonce yoki timestamp.
- Ulanishlar uzoq yashaydi: logout va sessiya tugashida ularni yopish, davriy qayta tekshirish va token aylantirish kerak.
- DoS uchun ulanishlar soni, xabar hajmi va chastotasi, idle timeout, heartbeat va backpressure; loglarda ulanish va xavfsizlik hodisalari bo'lsin, token va to'liq xabar mazmuni bo'lmasin.
