---
n: 11
slug: http-xavfsizlik
title: "HTTP xavfsizlik nuqtai nazaridan: request, header va parser farqlari"
summary: "HTTP so'rovining qaysi qismlari hujumchi nazoratida ekani, takrorlangan va noodatiy header'larni turli komponentlar turlicha o'qishi, Host va X-Forwarded-For'ga ishonish xatosi, header injection va ularning tuzatilgan varianti."
duration: 40
sources:
  - id: fastify-server
    note: "Fastify Server: trustProxy standart false; true hamma proxy'ga ishonadi; satr/massiv IP-CIDR; son (hop soni) o'chirilgan, chunki bevosita mijoz X-Forwarded-* ni soxtalashtira oladi; request.ip untrusted input sifatida ogohlantirilgan"
  - id: rfc9110
    note: "HTTP Semantics: header maydonlari nomining katta-kichik harfga bog'liq emasligi, 5.3-bo'lim: qabul qiluvchi bir nomli maydon qatorlarini (ro'yxat sintaksisli maydonlarda) tartibni saqlab vergul bilan birlashtirishi mumkin (MAY), proxy tartibni o'zgartirmaydi; Set-Cookie ro'yxat sintaksisidan foydalanmagani uchun alohida holat; Host maydoni"
  - id: rfc9112
    note: "HTTP/1.1 xabar sintaksisi: maydon nomi va ikki nuqta orasidagi bo'shliq: server 400 bilan rad etishi shart (MUST), proxy javobdan olib tashlaydi; 6.1 va 6.3: Transfer-Encoding Content-Length'dan ustun, ikkalasi birga bo'lsa server rad etishi yoki faqat Transfer-Encoding bo'yicha qayta ishlashi mumkin (MAY), har holda ulanishni yopishi shart (MUST); 11.2: request smuggling ta'rifi"
  - id: t10-a02
    note: "A02:2025 Security Misconfiguration kategoriyasi: tizim, ilova yoki cloud xizmati xavfsizlik nuqtai nazaridan noto'g'ri sozlanganda zaiflik paydo bo'lishi"
  - id: nestjs-rate-limit
    note: "Proxy ortida trust proxy / trustProxy sozlamasi: Express uchun hop soni, Fastify uchun manzil yoki diapazon; Fastify v5.12.1 va undan keyin raqam hech qaysi proxy'ni ishonchli deb hisoblamaydi"
quiz:
  - q: "Ilovangiz parol tiklash havolasini `https://${req.headers.host}/reset?token=...` ko'rinishida yig'adi. Hujumchi o'z qurilmasidan `Host: evil.example` yuborib, qurbon emailiga tiklash so'rovini boshlaydi. Nima bo'ladi?"
    options:
      - "Hech narsa: brauzer Host'ni o'zgartirishga ruxsat bermaydi"
      - "Qurbonga token'i bor, lekin hujumchi domeniga olib boruvchi havola boradi"
      - "Server 400 qaytaradi, chunki Host noto'g'ri"
      - "Havola to'g'ri domenga boradi, chunki token imzolangan"
    answer: 1
    explain: "Hujumchi brauzer emas, o'z mijoz dasturidan so'rov yuboradi va Host'ni xohlagancha yozadi. Ilova uni tekshirmasa, havola hujumchi domeniga ketadi. Token imzolangani domenni himoya qilmaydi. Yechim: bazaviy URL'ni konfiguratsiyadan olish."
  - q: "Yagona yuklama balanserdan keyin turgan Fastify ilovasi `X-Forwarded-For: 1.2.3.4, 203.0.113.7` oldi. Balanser mijozning haqiqiy manzilini ro'yxat oxiriga qo'shadi. Mijoz IP'si qaysi?"
    options:
      - "1.2.3.4, chunki u birinchi"
      - "Ikkalasi ham, chunki ro'yxat butun yo'lni ko'rsatadi"
      - "203.0.113.7, chunki ishonchli proxy qo'shgan qiymat oxirida"
      - "Aniqlab bo'lmaydi, shuning uchun har doim ulanish manzilini oling"
    answer: 2
    explain: "Mijoz o'zi X-Forwarded-For yuborishi mumkin, shuning uchun chapdagi qiymatlar hujumchi nazoratida. Ishonchli proxy qo'shgan yozuv o'ngdan sanaladi. To'g'ri javobdagi mantiq: ishonchli hop sonini bilish. Oxirgi variant faqat proxy bo'lmagan holatda to'g'ri."
  - q: "Ikki header: `Accept-Language: uz` va `Accept-Language: ru` bir so'rovda keldi. RFC 9110 bo'yicha umumiy qoida nima va u qaysi javob header'iga tatbiq etilmaydi?"
    options:
      - "Oxirgisi ustun, qolganlari tashlanadi; istisno yo'q"
      - "Birinchisi ustun, qolganlari tashlanadi; istisno Host"
      - "So'rov noto'g'ri, har doim 400"
      - "Ro'yxat sintaksisli maydonda qabul qiluvchi ularni tartibni saqlab vergul bilan bitta qatorga birlashtirishi mumkin; istisno Set-Cookie"
    answer: 3
    explain: "RFC 9110 5.3: qabul qiluvchi bir nomli maydon qatorlarini tartibni saqlab vergul bilan birlashtirishi mumkin (MAY), lekin bu ro'yxat sintaksisli maydonlar uchun; Set-Cookie ro'yxat sintaksisidan foydalanmaydi, shuning uchun uni birlashtirib bo'lmaydi va alohida qaraladi. Komponentlar bu qoidani turlicha qo'llasa (kimdir birinchisini, kimdir oxirgisini oladi), parser farqi hosil bo'ladi."
  - q: "Quyidagi kodda hujumchi `name` orqali javobga qo'shimcha header kiritishga urinadi. Qaysi gap to'g'ri?\n\n```ts\nres.setHeader(\"X-Vehicle\", req.query.name as string);\n```\nHujumchi `name=a%0d%0aSet-Cookie:%20x=1` yuboradi."
    options:
      - "Zamonaviy Node.js `setHeader` qiymatdagi CR va LF'ni rad etadi, lekin xom socket yoki qo'lda yig'ilgan javobda bu himoya yo'q"
      - "Node header nomining uzunligini tekshiradi, shuning uchun hujum har doim xato bilan to'xtaydi"
      - "TypeScript `as string` tufayli qiymat turini tekshiradi va CR/LF'ni olib tashlaydi"
      - "Header qiymati har qanday kontekstda xavfsiz, chunki u javob body'sida emas"
    answer: 0
    explain: "Header injection CR/LF orqali javobga qo'shimcha maydon yoki xabar kiritadi. Zamonaviy Node.js `setHeader` bunday belgilarni rad etadi, lekin xom socket, qo'lda yig'ilgan javob yoki boshqa tilda yozilgan proxy bo'lsa, nazorat sizning zimmangizda. TypeScript turlari ish vaqtida mavjud emas, header qiymati esa javob tuzilishining bir qismi."
  - q: "Qaysi tuzatish X-Forwarded-For spoofing'iga qarshi yetarli va nima qoldiradi?"
    options:
      - "Birinchi qiymatni olish; qoldiq yo'q"
      - "Ishonchli hop sonini sozlash va ro'yxatni o'ngdan sanash; ilova proxy'ni chetlab o'tib to'g'ridan-to'g'ri ochiq bo'lsa, ulanish manzili proxy emas va qoida buziladi"
      - "X-Forwarded-For'ni lowercase qilish; qoldiq yo'q"
      - "Ro'yxatning o'rtasini olish; qoldiq yo'q"
    answer: 1
    explain: "O'ngdan sanash faqat ulanayotgan tomon haqiqatan ishonchli proxy bo'lganda ishlaydi. Agar ilova ichki balanserni chetlab ham ochiq bo'lsa, hujumchi butun ro'yxatni o'zi yozadi. Shuning uchun tarmoq darajasida faqat proxy'dan ulanishga ruxsat berish ham kerak."
  - q: "Frontend proxy `Content-Type: application/json` ni ko'rib, so'rovni oddiy deb o'tkazdi, lekin ilova body'ni `Content-Type` e'tiborsiz parse qildi. Bu xavfni qaysi umumiy sinf nomlaydi?"
    options:
      - "Parser differential: ikki komponent bir xabarni turlicha talqin qiladi"
      - "Brute force: ko'p urinish"
      - "Replay: eski so'rovni qayta yuborish"
      - "Downgrade: protokol versiyasini pasaytirish"
    answer: 0
    explain: "Parser differential bir xabar ikki komponentda turli ma'no olishidir. Himoya bitta komponentda ishlab, ikkinchisi boshqacha o'qisa, tekshiruv aylanib o'tiladi. Qolgan atamalar boshqa hujum turlari."
task:
  title: "X-Forwarded-For: ishonchli hop bilan mijoz IP'sini aniqlash"
  prompt: |
    `clientIp(headers, socketIp, trustedHops)` mijoz IP'sini qaytaradi. Hozir u `X-Forwarded-For` ning birinchi qiymatini oladi: hujumchi o'zi yuborgan soxta qiymat rate limit va audit logga o'tadi.

    Funksiyani tuzating. `trustedHops` - ilova oldida turgan ishonchli proxy'lar soni (har biri o'z ko'rgan manzilni ro'yxat oxiriga qo'shadi). Qoidalar:

    1. `trustedHops` 0 bo'lsa, `X-Forwarded-For` e'tiborga olinmaydi, `socketIp` qaytadi.
    2. Aks holda ro'yxat vergul bo'yicha bo'linadi, bo'shliqlar qirqiladi va mijoz manzili o'ngdan `trustedHops` o'rindagi element bo'ladi (1 hop bo'lsa, oxirgi).
    3. Ro'yxat `trustedHops` dan qisqa bo'lsa yoki header yo'q bo'lsa, `socketIp` qaytadi.
    4. Imzoni o'zgartirmang. To'rt `console.log` kutilgan natijani chiqarsin: 203.0.113.7, 10.0.0.2, 10.0.0.2, 10.0.0.2.
  lang: ts
  starter: |
    type Headers = Record<string, string | undefined>;

    // trustedHops: ilova oldidagi ishonchli proxy'lar soni
    function clientIp(h: Headers, socketIp: string, trustedHops: number): string {
      const xff = h["x-forwarded-for"];
      if (!xff) return socketIp;
      return xff.split(",")[0].trim();
    }

    const forged = { "x-forwarded-for": "1.2.3.4, 203.0.113.7" };
    console.log("soxta ro'yxat, 1 hop:", clientIp(forged, "10.0.0.2", 1));
    console.log("proxy yo'q:", clientIp(forged, "10.0.0.2", 0));
    console.log("header yo'q:", clientIp({}, "10.0.0.2", 1));
    console.log("2 hop, qisqa ro'yxat:", clientIp({ "x-forwarded-for": "203.0.113.7" }, "10.0.0.2", 2));
  solution: |
    type Headers = Record<string, string | undefined>;

    // trustedHops: ilova oldidagi ishonchli proxy'lar soni
    function clientIp(h: Headers, socketIp: string, trustedHops: number): string {
      if (trustedHops <= 0) return socketIp;
      const xff = h["x-forwarded-for"];
      if (!xff) return socketIp;
      const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length < trustedHops) return socketIp;
      return parts[parts.length - trustedHops];
    }

    const forged = { "x-forwarded-for": "1.2.3.4, 203.0.113.7" };
    console.log("soxta ro'yxat, 1 hop:", clientIp(forged, "10.0.0.2", 1));
    console.log("proxy yo'q:", clientIp(forged, "10.0.0.2", 0));
    console.log("header yo'q:", clientIp({}, "10.0.0.2", 1));
    console.log("2 hop, qisqa ro'yxat:", clientIp({ "x-forwarded-for": "203.0.113.7" }, "10.0.0.2", 2));
  solutionNotes: |
    - Ro'yxat o'ngdan sanaladi: chapdagi qiymatlarni mijozning o'zi yozishi mumkin, o'ngdagisini esa faqat ishonchli proxy qo'shadi.
    - `trustedHops <= 0` bo'lsa header butunlay e'tiborsiz: proxy yo'q joyda `X-Forwarded-For` hujumchi yuborgan oddiy matn.
    - Ro'yxat kutilganidan qisqa bo'lsa, `socketIp` ga qaytiladi (fail-safe default): istalgan tomonga taxmin qilinmaydi.
    - Qoldiq risk: ilova proxy'ni chetlab ochiq bo'lsa, `socketIp` proxy emas va hamma qoida buziladi. Tarmoq darajasida faqat proxy'dan kirishga ruxsat bering.
    - IPv6 manzillar va portli yozuvlar (`1.2.3.4:5000`) bu yechimda normalizatsiya qilinmagan.
  checklist:
    - "Soxta chap qiymat natijaga ta'sir qilmaydi"
    - "`trustedHops` 0 bo'lsa `socketIp` qaytadi"
    - "Header yo'q yoki qisqa ro'yxatda `socketIp` qaytadi"
    - "Imzo o'zgarmagan"
    - "Qoldiq risk (proxy'ni chetlab o'tish) nima ekanini ayta olasiz"
---

## Muammo

Backend dasturchi HTTP'ni "so'rov keladi, JSON qaytadi" deb biladi. Xavfsizlik nuqtai nazaridan esa so'rov bu hujumchi to'liq yozadigan matn: metod, yo'l, har bir header, body, hatto bir xil nomli header'larning soni va tartibi ham. Brauzer ba'zi header'larni o'zi qo'yadi va o'zgartirishga yo'l qo'ymaydi, lekin hujumchi brauzer ishlatmaydi: `curl`, o'z skripti yoki xom socket orqali xohlagan baytlarni yuboradi. Shuning uchun "bu header'ni faqat brauzer yuboradi" degan taxmin har safar xavfsizlik nazorati sifatida noto'g'ri.

Production'da bu ikki xil og'riqqa olib keladi. Birinchisi, ilova so'rovdagi qiymatga ishonib, undan xavfsizlik qarori chiqaradi. Eng ko'p uchraydigan ikki holat: parol tiklash havolasini `Host` header'idan yig'ish va mijoz IP'sini `X-Forwarded-For` dan olib, rate limit yoki audit logda ishlatish. Ikkalasida ham kod "ishlaydi", testlar o'tadi, chunki oddiy foydalanuvchi to'g'ri qiymat yuboradi. Hujumchi esa shu maydonni almashtiradi.

Ikkinchisi, so'rov bir emas, bir necha komponentdan o'tadi: CDN, yuklama balanseri, reverse proxy, WAF, ilova serveri, framework. Har biri HTTP xabarini o'z parseri bilan o'qiydi. Ikki parser bir xabarga turli ma'no bersa, birinchisi tekshirgan narsa ikkinchisi bajargan narsadan farq qiladi. Bu parser differential deb ataladi va request smuggling (20-dars) hamda ko'p cache hujumlarining ildizi. OWASP Top 10:2025 da A02 Security Misconfiguration kategoriyasi aynan shunday qatlamlararo noto'g'ri sozlamalarni qamrab oladi.

Bu dars 2-modulning boshi: biz brauzer va HTTP xavfsizlik modelini quramiz. Avval so'rovning qaysi qismi kimning nazoratida ekanini aniqlaymiz, keyin parser farqlari qayerda tug'ilishini ko'ramiz.

## Asosiy g'oya

### So'rov hujumchi nazoratidagi matn

HTTP/1.1 xabari (RFC 9112) matn qatorlaridan iborat: start-line, header maydonlari, bo'sh qator, body. Semantika (metod, status kod, header ma'nolari) RFC 9110 da, xabarni baytlardan ajratish qoidalari RFC 9112 da bayon etilgan. Xavfsizlik uchun asosiy qoida oddiy: so'rovdagi hamma narsa kirish ma'lumoti (untrusted input), uni tasdiqlanmaguncha biror qaror asosi qilmang. Bu 21-darsdan boshlanadigan injection modulining ham asosi.

Quyidagi jadval avtopark platformasidagi odatiy so'rov qismlarini va ularga ishonish darajasini ko'rsatadi (bu kursning ishchi tasnifi):

| Qism | Kim yozadi | Xavfsizlik qarori uchun ishonchlimi |
|---|---|---|
| Metod, yo'l, query | Mijoz | Yo'q, tekshiriladi |
| `Host` | Mijoz | Yo'q, ruxsat etilgan ro'yxat bilan solishtiriladi |
| `X-Forwarded-For`, `X-Forwarded-Proto` | Mijoz yoki proxy | Faqat ishonchli proxy qo'shgan qismi |
| `Cookie`, `Authorization` | Mijoz | Qiymati tekshiriladi (autentifikatsiya) |
| `Origin`, `Referer` | Brauzer (to'g'ri mijozda) | Brauzerlar uchun signal, hujumchining o'z mijozida soxtalashtiriladi |
| `Sec-Fetch-*` | Brauzer | Brauzer o'zgartira olmaydigan header, lekin skript yuborganda yo'q (17-dars) |
| Ulanish manzili (socket) | Tarmoq | Ha, lekin proxy ortida u proxy manzili |

Oxirgi qator muhim: faqat TCP ulanishining manzili tarmoq darajasida bilinadi va soxtalashtirish qiyin. Qolgan hamma narsa matn.

### Header qoidalari va ularning xavfli joylari

RFC 9110 bo'yicha header maydon nomlari katta-kichik harfga bog'liq emas: `Host`, `host` va `HOST` bir xil. Node.js `req.headers` hamma nomni kichik harfga o'tkazadi, lekin boshqa til yoki proxy shunday qilmasa, matn bo'yicha solishtirish xatosi paydo bo'ladi.

Ikkinchi qoida: RFC 9110 (5.3-bo'lim) bo'yicha jo'natuvchi, ro'yxat sintaksisli maydonlardan tashqari, bir nomli bir necha maydon qatori yaratmasligi kerak, qabul qiluvchi esa shunday qatorlarni tartibni saqlab vergul bilan bitta qatorga birlashtirishi mumkin. Tartib ahamiyatli: proxy qiymatlar tartibini o'zgartirishi mumkin emas. Yagona ma'lum istisno `Set-Cookie`: u ro'yxat sintaksisidan foydalanmaydi va ko'pincha bir nechta qatorda keladi, shuning uchun qabul qiluvchi uni birlashtirmay, alohida holat sifatida qayta ishlashi kerak. Node.js buni qisman bajaradi: ko'p header'larni vergul bilan birlashtiradi, ba'zilarida (masalan `Host`, `Content-Type`) birinchisini oladi va qolganini tashlaydi. Bu xatti-harakat Node hujjatida bayon etilgan, lekin boshqa komponent (proxy, WAF) boshqacha tanlasa, farq paydo bo'ladi. Ya'ni "ikkita `Host` yuborilsa nima bo'ladi" savoliga javob komponentga bog'liq, va bu aniq hujum maydoni.

Uchinchi qoida: RFC 9112 server maydon nomi va ikki nuqta orasida bo'shliq bo'lgan xabarni 400 bilan rad etishi shartligini belgilaydi. Sababi shu: ba'zi parser `Transfer-Encoding : chunked` ni tan oladi, boshqasi tanimaydi, natijada xabar chegarasi haqida kelishmovchilik chiqadi. Qat'iy parser noaniq xabarni rad etadi, yumshoq parser "tuzatib" yuboradi, va "tuzatish" ning o'zi hujum vektoriga aylanadi.

Quyidagi `run` bloki shu uchta qoidani kichik, o'quv parserida ko'rsatadi: nomni kichik harfga o'tkazish, takrorlanganni birlashtirish va nomdan keyingi bo'shliqni rad etish. Bu haqiqiy server emas, mexanizmni ko'rsatadigan namuna.

```ts run
type Parsed = { ok: true; headers: Record<string, string> } | { ok: false; reason: string };

function parseHeaders(raw: string): Parsed {
  const headers: Record<string, string> = {};
  for (const line of raw.split("\r\n")) {
    const i = line.indexOf(":");
    if (i < 1) return { ok: false, reason: `ikki nuqta yo'q: ${JSON.stringify(line)}` };
    const name = line.slice(0, i);
    if (/\s/.test(name)) return { ok: false, reason: `nomda bo'shliq: ${JSON.stringify(name)}` };
    const key = name.toLowerCase();
    const value = line.slice(i + 1).trim();
    headers[key] = key in headers ? `${headers[key]}, ${value}` : value;
  }
  return { ok: true, headers };
}

console.log(parseHeaders("Host: fleet.example\r\nhost: evil.example"));
console.log(parseHeaders("Host: fleet.example\r\nX-Role : admin"));
```

```text
{
  "ok": true,
  "headers": {
    "host": "fleet.example, evil.example"
  }
}
{
  "ok": false,
  "reason": "nomda bo'shliq: \"X-Role \""
}
```

Birinchi natijada ikki `Host` bitta ro'yxatga aylandi: shu qiymatni `ALLOWED.has(host)` bilan solishtirsangiz u mos kelmaydi (yaxshi), lekin `host.startsWith("fleet.example")` bilan tekshirsangiz o'tib ketadi (yomon). Ikkinchi natijada qat'iy parser xabarni butunlay rad etdi.

## Chuqurroq: parser farqlari qayerdan keladi

### Xabar chegarasi

HTTP/1.1 da bir TCP ulanishida ketma-ket ko'p so'rov o'tishi mumkin, shuning uchun har so'rov qayerda tugashini parser aniq bilishi shart. Buning uchun `Content-Length` yoki `Transfer-Encoding: chunked` ishlatiladi. RFC 9112 11.2-bo'limi request smuggling'ni qabul qiluvchilar parsing'idagi farqdan foydalanish deb ta'riflaydi va xabar chegarasi qoidalarini (6.3) shu sababli qat'iylashtirganini yozadi. Ikkalasi bir xabarda kelsa, Transfer-Encoding Content-Length'dan ustun; RFC bunday xabarni smuggling urinishi bo'lishi mumkin va xato sifatida qayta ishlanishi kerak deydi (6.3). Server uni rad etishi (MAY) yoki faqat Transfer-Encoding bo'yicha qayta ishlashi mumkin, lekin har holda javobdan keyin ulanishni yopishi shart (6.1). Ikki komponent chegarani turlicha topsa, bir komponent "bitta so'rov" deb ko'rgan baytlarni ikkinchisi "ikkita so'rov" deb o'qiydi. Bu mexanizmni 20-darsda to'liq ko'ramiz; hozir faqat shuni yodda tuting: chegara qoidasi xavfsizlik qoidasi.

### Normalizatsiya tartibi

Ikkinchi manba: tekshirish va ishlatish orasida qiymat o'zgaradi. Misol: WAF `/admin` yo'lini bloklaydi, lekin ilova `//admin`, `/%61dmin` yoki `/admin/.` ni normalizatsiya qilib `/admin` ga keltiradi. Qoida: tekshirishni normalizatsiyadan keyin, ishlatiladigan shaklda bajaring, va bitta joyda. Bu 26-dars (path traversal) va 38-dars (open redirect) uchun ham asos.

### Proxy zanjiridagi ishonch

Proxy ortidagi ilova uchun TCP manzili har doim proxy manzili. Mijozning haqiqiy manzili, protokoli (`http` yoki `https`) va domeni proxy qo'shgan header'larda (`X-Forwarded-For`, `X-Forwarded-Proto`, `Host`) uzatiladi. `X-Forwarded-*` umumiy amaliyot; uni mijozning o'zi ham yuborishi mumkin, shuning uchun uning qaysi qismiga ishonish ilova konfiguratsiyasiga bog'liq. Odatiy qoida: ishonchli proxy soni sozlanadi, ro'yxat o'ngdan sanaladi. Fastify `trustProxy` opsiyasi, Express `trust proxy` sozlamasi aynan shu ishni bajaradi, lekin standart holatda o'chirilgan. Ikkalasi bir xil ishlamaydi: Express'da raqam hop sonini bildiradi, Fastify v5.12.1 va undan keyingi versiyalarda esa raqam hech qaysi proxy'ni ishonchli deb hisoblamaydi, shuning uchun u yerda proxy manzili yoki diapazoni beriladi (NestJS hujjatidagi ogohlantirishga ko'ra). Versiyani yangilaganingizda `req.ip` jim o'zgarishi mumkin: yangilashdan keyin `req.ip` ni sinovda tekshiring. Ularni "hamma proxy'ga ishon" (`true`) qilib qo'yish bu darsdagi xatoning o'zi.

### Header injection

Header qiymatiga CR (`\r`) va LF (`\n`) kirsa (bu hujum header injection deyiladi), javobning struktura chegarasi buziladi: hujumchi qo'shimcha header (masalan `Set-Cookie`) yoki butun javob qo'shishi mumkin. Zamonaviy Node.js `res.setHeader` bunday qiymatni xato bilan rad etadi, shuning uchun oddiy Express yoki Fastify kodida bu xavf kam. U qayerda qaytadi: xom `net` socket orqali javob yig'ilganda, shablon bilan matn formatida javob yaratilganda, redirect URL'ni qo'lda yig'ilgan `Location` ga yozilganda, yoki Node bo'lmagan komponentda (masalan, Lua yoki C proxy). Himoya: qiymatni header'ga yozishdan oldin CR/LF bo'lmasligini tekshirish va faqat standart kutubxonadan foydalanish.

## Misol: Host va X-Forwarded-For'ga ishonish

Quyidagi misol parol tiklash va IP aniqlash xatolarini sof funksiyalarda ko'rsatadi. HTTP qatlami olib tashlangan, chunki zaiflik header'dan kelgan qiymatga ishonishda, serverda emas. Hammasi o'quv kodi, real tizim yo'q.

### 1. Zaif kod

```ts run
type Headers = Record<string, string>;

// ZAIF: havola so'rovning Host header'idan quriladi
function resetLinkWeak(h: Headers, token: string): string {
  return `https://${h["host"]}/reset?token=${token}`;
}

// ZAIF: ro'yxatning birinchi qiymatiga ishonadi, uni mijozning o'zi yozadi
function clientIpWeak(h: Headers, socketIp: string): string {
  const xff = h["x-forwarded-for"];
  return xff ? xff.split(",")[0].trim() : socketIp;
}

console.log(resetLinkWeak({ host: "fleet.example" }, "T123"));
console.log(clientIpWeak({ "x-forwarded-for": "203.0.113.7" }, "10.0.0.2"));
```

```text
https://fleet.example/reset?token=T123
203.0.113.7
```

Oddiy foydalanuvchi uchun hamma narsa to'g'ri ishlaydi. Kod zaifligi uni oddiy sinovda ko'rinmaydi.

### 2. Hujum

> **Ta'lim maqsadida.** Bu Host header'ini soxtalashtirish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi o'z mijoz dasturidan (brauzer emas) qurbonning emailiga tiklash so'rovini boshlaydi, lekin `Host: evil.example` yuboradi. U ikkinchi hujumni ham sinaydi: yuklama balanseri ortidagi ilovaga `X-Forwarded-For: 1.2.3.4` yuboradi, balanser esa haqiqiy manzilni oxiriga qo'shadi.

```ts run
type Headers = Record<string, string>;

function resetLinkWeak(h: Headers, token: string): string {
  return `https://${h["host"]}/reset?token=${token}`;
}
function clientIpWeak(h: Headers, socketIp: string): string {
  const xff = h["x-forwarded-for"];
  return xff ? xff.split(",")[0].trim() : socketIp;
}

console.log("1)", resetLinkWeak({ host: "evil.example" }, "T123"));
console.log("2)", clientIpWeak({ "x-forwarded-for": "1.2.3.4, 203.0.113.7" }, "10.0.0.2"));
```

```text
1) https://evil.example/reset?token=T123
2) 1.2.3.4
```

Birinchi natijada qurbonga haqiqiy xizmatdan keladigan email ichida token hujumchi domeniga olib boruvchi havola bor. Qurbon bosganda token hujumchi serveriga tushadi (Host header attack yoki password reset poisoning). Ikkinchi natijada hujumchi o'z manzilini yashirdi: rate limit uni boshqa IP deb hisoblaydi, audit logda soxta manzil qoladi. Ikkala hujum ham faqat shu darsning o'quv funksiyalariga qarshi.

### 3. Tuzatilgan kod

```ts run
type Headers = Record<string, string>;

// Bazaviy URL konfiguratsiyadan olinadi, so'rovdan emas
const APP_ORIGIN = "https://fleet.example";

function resetLink(_h: Headers, token: string): string {
  return `${APP_ORIGIN}/reset?token=${encodeURIComponent(token)}`;
}

// trustedHops: ilova oldidagi ishonchli proxy'lar soni
function clientIp(h: Headers, socketIp: string, trustedHops: number): string {
  if (trustedHops <= 0) return socketIp;
  const xff = h["x-forwarded-for"];
  if (!xff) return socketIp;
  const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length < trustedHops) return socketIp;
  return parts[parts.length - trustedHops];
}

console.log("1)", resetLink({ host: "evil.example" }, "T123"));
console.log("2)", clientIp({ "x-forwarded-for": "1.2.3.4, 203.0.113.7" }, "10.0.0.2", 1));
console.log("3)", clientIp({ "x-forwarded-for": "1.2.3.4" }, "10.0.0.2", 0));
```

```text
1) https://fleet.example/reset?token=T123
2) 203.0.113.7
3) 10.0.0.2
```

Tuzatish nima uchun yetarli. Birinchi hujumda havola domeni endi hujumchi nazoratidan chiqdi: u ilova konfiguratsiyasida, shuning uchun `Host` qanday bo'lmasin, havola o'zgarmaydi. Invariant: xavfsizlik qaroriga ta'sir qiluvchi qiymat so'rovdan emas, ishonchli manbadan keladi. Ikkinchi hujumda mijoz yozgan `1.2.3.4` o'ngdan sanalganda tushib qoladi, chunki ishonchli proxy qo'shgan yozuv oxirida. Uchinchi holatda proxy yo'q: header butunlay e'tiborsiz.

Nima yopilmadi. Agar ilova yuklama balanserni chetlab, to'g'ridan-to'g'ri internetga ochiq bo'lsa, `socketIp` proxy emas va hujumchi butun ro'yxatni o'zi yozadi: tarmoq darajasida ilovaga faqat proxy'dan kirishga ruxsat bering. Ko'p domenli (har tenant uchun `alfa.fleet.example`) tizimlarda bazaviy URL tenant konfiguratsiyasidan olinadi, `Host` esa ruxsat etilgan ro'yxat bilan solishtiriladi. Tiklash tokenining o'zi uchun esa CSPRNG va qisqa muddat kerak (67-dars), bu yerda ko'rsatilmagan.

## Qachon qo'llamaslik kerak

- Qat'iy parser hamma joyda ham kerak emas. Ichki servislar orasidagi bir xil kutubxonali, ishonchli tarmoqdagi chaqiruvlarda parser farqi ehtimoli past; lekin bu servis tashqariga ochilganda yoki orada yangi proxy paydo bo'lganda farazni qayta ko'rib chiqing.
- `Host` ni ruxsat etilgan ro'yxat bilan tekshirish ko'p domenli (white-label) platformalarda murakkab. Ro'yxat dinamik bo'lsa (har mijoz o'z domenini qo'shadi), uni bazadan olish va domenga egalikni tasdiqlash (DNS orqali) kerak. Shunchaki `endsWith(".fleet.example")` bilan tekshirish `evilfleet.example` ni o'tkazib yuboradi, ya'ni tekshiruv o'zi yangi xato bo'ladi.
- `trustProxy` ni "to'g'ri" sozlash infratuzilmani bilishni talab qiladi. Hop sonini noto'g'ri qo'ysangiz (ko'p yoki kam), ilova yo soxta IP'ni qabul qiladi, yo proxy IP'sini mijoz deb hisoblab, hamma foydalanuvchini bitta rate limit chelagiga soladi. Bu ikkinchi xato ham real: bitta noto'g'ri sozlama butun tenant'ni bloklashi mumkin.
- Hamma noaniq so'rovni rad etish eski mijozlarni sindirishi mumkin. Rad etishdan oldin loglarda ularni kuzatib, qaysi mijoz noodatiy yuborishini bilib oling.
- Header validatsiyasi injection yoki kirish validatsiyasining o'rnini bosmaydi. U faqat HTTP qatlamidagi nazorat.

## Stack'da: Fastify va NestJS

Fastify'da ishonchli proxy `trustProxy` opsiyasi bilan sozlanadi; `true` har qanday proxy'ga ishonadi (shuning uchun xavfli), manzil yoki diapazon (`'loopback'`, `'10.0.0.0/8'`) aniq proxy'larni bildiradi. NestJS Express adapteridan foydalansa `app.set("trust proxy", 1)` (bu yerda raqam hop soni), Fastify adapteridan foydalansa `new FastifyAdapter({ trustProxy: '10.0.0.0/8' })` kabi manzil beriladi. Balanser ortida mijoz IP'sini o'qish uchun NestJS hujjati ham aynan shu sozlamani ko'rsatadi. Quyidagi kod ishga tushirilmaydi (server va tashqi modul kerak), faqat sintaksis jihatidan to'g'ri TypeScript.

```ts
import Fastify from "fastify";

const APP_ORIGIN = process.env.APP_ORIGIN ?? "https://fleet.example";

// Balanser ichki tarmoqdan (10.0.0.0/8) ulanadi: faqat shu diapazon ishonchli.
// Raqam (hop soni) yangi Fastify versiyalarida hech kimga ishonmaydi.
const app = Fastify({ trustProxy: "10.0.0.0/8" });

app.post("/auth/reset", async (req, reply) => {
  // req.ip endi trustProxy qoidasi bo'yicha hisoblangan manzil
  req.log.info({ ip: req.ip }, "reset requested");

  const { email } = req.body as { email: string };
  const token = await createResetToken(email); // 67-dars: CSPRNG, qisqa muddat
  const link = `${APP_ORIGIN}/reset?token=${encodeURIComponent(token)}`;
  await sendMail(email, link);

  // Email mavjud yoki yo'qligidan qat'i nazar bir xil javob
  return reply.code(202).send({ ok: true });
});

declare function createResetToken(email: string): Promise<string>;
declare function sendMail(to: string, link: string): Promise<void>;
```

`req.ip` ni ishlatsangiz, qaror faqat `trustProxy` sozlamasiga bog'liq (balanser manzili o'zgarsa, diapazon ham yangilanishi kerak): shuning uchun bu sozlama kod ko'rib chiqishda ham, infratuzilma o'zgarishida ham alohida tekshiriladigan nazorat. Reverse proxy darajasida (nginx, envoy va h.k.) esa sozlamalar sizning infratuzilmangizga bog'liq: ularni alohida tekshiring, bu dars ularning aniq direktivalarini yozmaydi.

## Xulosa

- HTTP so'rovi hujumchi nazoratidagi matn: header, metod, yo'l va hatto header'larning soni ham. Brauzer cheklovlariga tayanib nazorat qurmang.
- Xavfsizlik qaroriga ta'sir qiladigan qiymat (domen, mijoz IP, protokol) so'rovdan emas, konfiguratsiyadan yoki ishonchli proxy'dan olinadi.
- `X-Forwarded-For` ro'yxati o'ngdan, ishonchli hop soniga qarab sanaladi; proxy'ni chetlab o'tish yo'lini tarmoq darajasida yoping.
- Parser differential: bir xabarni ikki komponent turlicha o'qisa, birinchi tekshirgan narsa ikkinchi bajargan narsadan farq qiladi. Qat'iy parser noaniq xabarni rad etadi.
- Tekshirishni normalizatsiyadan keyin, bitta joyda va ishlatiladigan shaklda bajaring.
- Tuzatish nimani qoplamasligini yozib qo'ying: `trustProxy` noto'g'ri sozlansa, himoya jim buziladi.
