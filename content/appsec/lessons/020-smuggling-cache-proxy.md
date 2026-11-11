---
n: 20
slug: smuggling-cache-proxy
title: "Request smuggling, cache poisoning va proxy zanjiri"
summary: "Frontend proxy va backend so'rov chegarasini turlicha topganda yuzaga keladigan request smuggling (CL.TE, TE.CL), unkeyed input orqali cache poisoning, Vary va Cache-Control: private, hamda qat'iy parser bilan himoya."
duration: 45
sources:
  - id: rfc9112
    note: "HTTP/1.1: 5.1 (nom va ikki nuqta orasidagi bo'shliq: 400), 6.1 (CL va TE birga: server rad etishi mumkin, har holda ulanishni yopishi shart), 6.3 (chunked bilan tugamaydigan TE)"
  - id: rfc9110
    note: "HTTP Semantics: header maydonlari va Vary semantikasi (kesh qoidalari RFC 9111 da, bu darsda MDN orqali)"
  - id: mdn-http-caching
    note: "MDN HTTP caching: private va shared kesh, Cache-Control: private, Vary va uning narxi (User-Agent), heuristik keshlash, no-store'ning kamchiliklari"
  - id: node-cli
    note: "Node.js --insecure-http-parser: yoqilsa parser CL va TE birga kelgan xabarni, noto'g'ri header qiymatlarini va chunked'dan keyingi qo'shimcha kodlashlarni qabul qiladi"
  - id: t10-a02
    note: "A02:2025 Security Misconfiguration: qatlamlararo noto'g'ri sozlama sinfi"
  - id: wstg
    note: "WSTG-INJT-16 HTTP Request Smuggling: frontend va backend parser nomuvofiqligi, CL.TE va TE.CL variantlari, HTTP/2 downgrade vektorlari"
quiz:
  - q: "Frontend proxy so'rov chegarasini Content-Length bo'yicha, backend esa Transfer-Encoding: chunked bo'yicha aniqlaydi. So'rovda ikkala header ham bor. WSTG bu holatni qanday ataydi?"
    options:
      - "TE.CL"
      - "CL.CL"
      - "CL.TE: frontend CL ni, backend TE ni qo'llaydi"
      - "Response splitting"
    answer: 2
    explain: "WSTG: CL.TE'da frontend Content-Length'ni, backend esa Transfer-Encoding'ni hisobga oladi. Backend chunked body'ni erta tugatadi va qolgan baytlar keyingi so'rov deb o'qiladi. TE.CL teskarisi."
  - q: "Frontend proxy `/admin` yo'llarini bloklaydi. Smuggling orqali ichki so'rov backend'ga yetib bordi. Nima uchun frontend ACL ishlamadi?"
    options:
      - "Proxy faqat POST so'rovlarni tekshiradi"
      - "Proxy ichki so'rovni bitta tashqi so'rovning body'si deb ko'rdi va uni alohida so'rov sifatida tekshirmadi"
      - "Backend ACL ni o'chirib qo'ygan"
      - "ACL faqat HTTPS'da ishlaydi"
    answer: 1
    explain: "Parser nomuvofiqligi: proxy uchun smuggled bayt body, backend uchun alohida so'rov. Proxy tekshiruvi faqat u ko'rgan so'rovga tegishli, shuning uchun backend'ga yetgan ikkinchi so'rov tekshiruvdan o'tmaydi."
  - q: "Quyidagilardan qaysi biri smuggling'ga qarshi eng ishonchli tuzatish?"
    options:
      - "Proxy va backend ikkalasida ham noaniq xabarni (CL va TE birga, farqli takroriy CL, nom va ikki nuqta orasida bo'shliq) 400 bilan rad etish va ulanishni yopish; komponentlarni yangilab turish"
      - "Content-Length header'ini loglash"
      - "Faqat WAF qoidasi qo'shish"
      - "Backend'da keep-alive'ni yoqish"
    answer: 0
    explain: "Asosiy tuzatish: noaniq xabarni rad etish va chegarani ikkala tomon bir xil talqin qilishiga erishish. WAF qoidasi bitta payload shaklini ushlaydi, parser farqini yo'q qilmaydi; keep-alive esa aksincha, ulanishni qayta ishlatib oqibatni og'irlashtiradi."
  - q: "Cache kaliti metod + yo'l. Ilova havolani `X-Forwarded-Host` dan quradi, header cache kalitiga kirmaydi (unkeyed). Hujumchi bitta so'rov yuboradi. Natija?"
    options:
      - "Cache hujumchi so'rovi uchun saqlaydi, boshqa foydalanuvchilarga ta'sir qilmaydi"
      - "Cache so'rovni rad etadi"
      - "Hujumchining qiymati bilan yaratilgan javob cache'ga tushadi va keyingi foydalanuvchilarga beriladi"
      - "Brauzer javobni bloklaydi"
    answer: 2
    explain: "Unkeyed input javobni o'zgartiradi, lekin kalitni emas. Shuning uchun poisoned javob umumiy kalit ostida saqlanadi va barcha foydalanuvchilarga beriladi. Tuzatish: javob unkeyed ma'lumotga bog'liq bo'lmasin."
  - q: "Foydalanuvchiga xos sahifani (profil) umumiy CDN keshlamasligi uchun MDN nima tavsiya qiladi?"
    options:
      - "Vary: Cookie"
      - "Cache-Control: private"
      - "Vary: User-Agent"
      - "Cache-Control: public"
    answer: 1
    explain: "MDN: cookie bilan shaxsiy kontentni qayta ishlatmaslik uchun Vary'da cookie ko'rsatish o'rniga Cache-Control: private belgilang. `public` aksincha, umumiy keshlashga ruxsat beradi. Vary: User-Agent katta xilma-xillik tufayli kesh samaradorligini yo'qotadi."
  - q: "`Transfer-Encoding : chunked` (ikki nuqtadan oldin bo'shliq) header'i keldi. RFC 9112 bo'yicha server nima qilishi kerak?"
    options:
      - "Bo'shliqni olib tashlab, header'ni qabul qilish"
      - "Header'ni e'tiborsiz qoldirish"
      - "400 bilan rad etish"
      - "Faqat log yozish"
    answer: 2
    explain: "RFC 9112 maydon nomi va ikki nuqta orasidagi bo'shliqli xabarni 400 bilan rad etishni talab qiladi, chunki ba'zi parser uni tan oladi, boshqasi tanimaydi va chegara haqida kelishmovchilik paydo bo'ladi. Qabul qilish yoki e'tiborsiz qoldirish aynan o'sha nomuvofiqlikni yaratadi."
task:
  title: "Noaniq HTTP xabarni rad etish"
  prompt: |
    `checkHeaders(lines)` xom header qatorlari ro'yxatini oladi (har qator `Nom: qiymat` ko'rinishida) va `"ok"` yoki rad etish sababini qaytaradi. Hozir u hech narsani tekshirmaydi.

    Funksiyani tuzating. Quyidagi holatlarda `"rad"` qaytarsin:

    1. `Content-Length` va `Transfer-Encoding` birga.
    2. `Content-Length` bir necha marta va qiymatlari har xil.
    3. Header nomi va ikki nuqta orasida bo'shliq (yoki nom ichida bo'shliq).
    4. `Transfer-Encoding` qiymati kichik harfga o'tkazilganda aynan `chunked` emas (masalan, `xchunked`, `chunked, identity`).
    5. `Content-Length` qiymati faqat raqamlardan iborat bo'lmasa (`+5`, `5 5`, `-1`, bo'sh).
    6. Boshqa holatlarda `"ok"`. Nom katta-kichik harfga bog'liq emas.
    7. Imzoni o'zgartirmang. Oxirgi oltita `console.log` natijasi: `ok`, `rad`, `rad`, `rad`, `rad`, `ok`.
  lang: ts
  starter: |
    // ZAIF: hech narsani tekshirmaydi
    function checkHeaders(lines: string[]): string {
      return "ok";
    }

    console.log(checkHeaders(["Host: fleet.example", "Content-Length: 12"]));
    console.log(checkHeaders(["Content-Length: 12", "Transfer-Encoding: chunked"]));
    console.log(checkHeaders(["Content-Length: 12", "content-length: 13"]));
    console.log(checkHeaders(["Transfer-Encoding : chunked"]));
    console.log(checkHeaders(["Transfer-Encoding: xchunked"]));
    console.log(checkHeaders(["Host: fleet.example", "transfer-encoding: Chunked"]));
  solution: |
    function checkHeaders(lines: string[]): string {
      const cl: string[] = [];
      let te: string | undefined;
      for (const line of lines) {
        const i = line.indexOf(":");
        if (i < 1) return "rad";
        const rawName = line.slice(0, i);
        if (/\s/.test(rawName)) return "rad";
        const name = rawName.toLowerCase();
        const value = line.slice(i + 1).trim();
        if (name === "content-length") cl.push(value);
        if (name === "transfer-encoding") te = value;
      }
      if (cl.length > 0 && te !== undefined) return "rad";
      if (cl.some((v) => !/^[0-9]+$/.test(v))) return "rad";
      if (new Set(cl).size > 1) return "rad";
      if (te !== undefined && te.toLowerCase() !== "chunked") return "rad";
      return "ok";
    }

    console.log(checkHeaders(["Host: fleet.example", "Content-Length: 12"]));
    console.log(checkHeaders(["Content-Length: 12", "Transfer-Encoding: chunked"]));
    console.log(checkHeaders(["Content-Length: 12", "content-length: 13"]));
    console.log(checkHeaders(["Transfer-Encoding : chunked"]));
    console.log(checkHeaders(["Transfer-Encoding: xchunked"]));
    console.log(checkHeaders(["Host: fleet.example", "transfer-encoding: Chunked"]));
  solutionNotes: |
    - Qoida: noaniq xabar rad etiladi, "tuzatib" qabul qilinmaydi. Tuzatish ikki komponentda turlicha bo'lsa, parser nomuvofiqligi qaytadi.
    - Bir xil qiymatli takroriy `Content-Length` bu yerda ruxsat etilgan; ba'zi tizimlar uni ham rad etadi, qaror siyosatingizga bog'liq.
    - Bu faqat header tekshiruvi: body chegarasini hisoblash, HTTP/2 -> HTTP/1.1 tarjimasi va ulanishni yopish haqiqiy parserda bo'ladi. O'z parseringizni yozmang, sinalgan kutubxona va yangilangan proxy ishlating.
    - Qoldiq risk: faqat bitta komponentda qat'iylik yetmaydi; proxy ham, backend ham bir xil qoidani qo'llashi kerak.
    - HTTP/2 downgrade, H2C upgrade kabi vektorlar bu funksiya doirasidan tashqarida (WSTG ro'yxatida).
  checklist:
    - "CL+TE, farqli CL, nomdagi bo'shliq rad etiladi"
    - "Noto'g'ri Transfer-Encoding va raqamsiz Content-Length rad etiladi"
    - "Nom katta-kichik harfga bog'liq emas"
    - "To'g'ri xabar `ok` oladi"
    - "Qat'iylik ikkala komponentda ham kerakligini ayta olasiz"
---

## Muammo

Zamonaviy ilova oldida kamida bir-ikkita HTTP komponenti turadi: CDN, yuklama balanseri, reverse proxy, API gateway. Ularning har biri so'rovni baytlardan o'qiydi, qayerda bir so'rov tugab, keyingisi boshlanishini hal qiladi, va keyingi komponentga yuboradi. 11-darsda ko'rdik: ikki komponent bir xabarni turlicha o'qisa (parser differential), birinchisi tekshirgan narsa ikkinchisi bajargan narsadan farq qiladi. Bu darsda shu nomuvofiqlikning ikkita eng og'ir ko'rinishi: request smuggling va cache poisoning.

Request smuggling'da frontend (proxy) va backend so'rov qayerda tugashini turlicha aniqlaydi. Natijada hujumchi bitta ko'ringan so'rov ichiga ikkinchisini "yashirib" yuboradi: proxy uni body deb ko'radi, backend esa alohida so'rov deb qabul qiladi. Proxy darajasidagi nazoratlar (ACL, autentifikatsiya, WAF, rate limit) smuggled so'rovga qo'llanmaydi. OWASP WSTG (WSTG-INJT-16) bu sinfni shunday ta'riflaydi: frontend va backend komponentlarning HTTP so'rovni o'qishdagi nomuvofiqliklaridan kelib chiqadigan zaifliklar; ular doimiy desinxronizatsiya, cache poisoning, credential hijacking va access control bypass'ga olib kelishi mumkin.

Cache poisoning'da ildiz boshqacha, lekin g'oya o'xshash: cache va ilova "bu so'rov qaysi javobga mos" degan savolga turlicha javob beradi. Cache kalitga kirmaydigan (unkeyed) kiritma ilovaning javobini o'zgartirsa, hujumchi zararli javobni umumiy kalit ostida cache'ga joylab, boshqa foydalanuvchilarga yetkazadi. Ikkala holatda ham ilovaning o'z kodi "to'g'ri", muammo komponentlar orasidagi kelishuvda: OWASP Top 10:2025 da bu A02 Security Misconfiguration sinfi.

Dars hujum usullarini real tizimlarga qarshi qo'llash uchun emas; mexanizmni o'quv modelida, ikkita oddiy parser bilan ko'rsatadi, va asosiy fokus himoyada.

## Asosiy g'oya

### Xabar chegarasi

HTTP/1.1 da bir TCP ulanishida ketma-ket ko'p so'rov o'tishi mumkin. Parser har so'rovning body uzunligini ikki usuldan biri bilan biladi: `Content-Length` (aniq bayt soni) yoki `Transfer-Encoding: chunked` (bo'laklar ketma-ketligi, `0` bo'lagi bilan tugaydi). RFC 9112 (6.1-bo'lim) ikkalasi birga kelganda xavfsizlik xavfini alohida ta'kidlaydi: server bunday so'rovni rad etishi (`MAY`) yoki faqat `Transfer-Encoding` bo'yicha qayta ishlashi mumkin, lekin har holda javob bergach ulanishni yopishi shart (`MUST`). Ya'ni standart rad etishni ixtiyoriy qoldiradi, ulanishni yopishni esa majburiy qiladi. Shu sababli "ulanishni yopish" qadami muhim: u bo'lmasa, o'qilmay qolgan baytlar keyingi so'rov sifatida talqin qilinadi. Amalda eski yoki nostandart komponentlar bu qoidani turlicha qo'llaydi. Frontend `Content-Length`ni, backend `Transfer-Encoding`ni tanlasa, hammasi birga chegarani turli joyda ko'radi.

WSTG ikki klassik variantni sanaydi: **CL.TE** (frontend Content-Length, backend Transfer-Encoding) va **TE.CL** (aksincha). Zamonaviy arxitekturalarda qo'shimcha vektorlar ham bor: HTTP/2 dan HTTP/1.1 ga tarjima (downgrade), H2C upgrade, header normalizatsiyasi farqlari va ulanishlarni protokol chegarasi orqali qayta ishlatish. Qo'shimcha holat: nom va ikki nuqta orasidagi bo'shliq (`Transfer-Encoding : chunked`) kabi buzilgan header'ni bir parser tan oladi, boshqasi e'tiborsiz qoldiradi; RFC 9112 (5.1-bo'lim) bunday xabarni 400 bilan rad etishni talab qiladi (11-dars). `Transfer-Encoding` qiymati tanilmasa, server 501 bilan javob berishi kerak (`SHOULD`), `chunked` bilan tugamaydigan so'rov body'si esa 400 oladi (6.3-bo'lim), chunki uzunlikni aniqlab bo'lmaydi.

MDN yana ikki amaliy fakt beradi. `Transfer-Encoding` hop-by-hop header: ko'p tugunli ulanishning har bir qismi o'z qiymatini ishlatishi mumkin, shu sababli frontend va backend orasida u turlicha bo'lishi tabiiy. HTTP/2 esa bu header'ni butunlay taqiqlaydi, shuning uchun HTTP/2 dan HTTP/1.1 ga tarjima paytida proxy uni qayta yasamasligi yoki tashqaridan kelganini o'tkazib yubormasligi kerak. WSTG ham HTTP/2 downgrade o'zi zaiflik emasligini, xavf tarjima mantig'i RFC kutganidan chetga chiqqanda paydo bo'lishini yozadi.

### Nega bu og'ir

Smuggled so'rov backend'ga proxy'ning nazoratidan o'tmasdan yetadi: proxy uchun u oddiy so'rov body'si edi. Shuning uchun proxy darajasidagi `/admin` blokirovkasi, autentifikatsiya header'ini qo'shish, rate limit, WAF aylanib o'tiladi. Bundan tashqari, backend javobni noto'g'ri so'rov bilan juftlashi mumkin (desinxronizatsiya): keyingi foydalanuvchi boshqa so'rovning javobini oladi. Ulanish qayta ishlatilsa (keep-alive), zarar bir hujumchi so'rovdan oshib, boshqa foydalanuvchilarga o'tadi.

### Model: ikki framer

Quyidagi `run` bloki ikkita soddalashtirilgan framer'ni beradi: biri `Content-Length` ni, ikkinchisi `Transfer-Encoding` ni afzal ko'radi, uchinchisi qat'iy (noaniqlikni rad etadi). Bu to'liq HTTP parser emas; faqat chegara qoidasini ko'rsatadi. Hujum payload'i faqat shu o'quv kodi uchun tuzilgan.

```ts run
type Framed = { requests: string[]; error?: string };

// Ikki xil framer: bitta TCP oqimini so'rovlarga ajratadi (o'quv modeli, to'liq HTTP parser emas)
// prefer: "cl" - Content-Length ustun, "te" - Transfer-Encoding ustun, "strict" - noaniqlikni rad etadi
function frame(raw: string, prefer: "cl" | "te" | "strict"): Framed {
  const requests: string[] = [];
  let pos = 0;
  while (pos < raw.length) {
    const end = raw.indexOf("\r\n\r\n", pos);
    if (end < 0) return { requests, error: "to'liq emas" };
    const lines = raw.slice(pos, end).split("\r\n");
    const h = new Map<string, string>();
    for (const l of lines.slice(1)) {
      const i = l.indexOf(":");
      if (i < 1 || /\s/.test(l.slice(0, i))) return { requests, error: `noto'g'ri header: ${JSON.stringify(l)}` };
      h.set(l.slice(0, i).toLowerCase(), l.slice(i + 1).trim());
    }
    const cl = h.get("content-length"), te = h.get("transfer-encoding");
    if (cl && te && prefer === "strict") return { requests, error: "Content-Length va Transfer-Encoding birga: rad etildi" };
    requests.push(lines[0]);
    pos = end + 4;
    const useTe = te !== undefined && (prefer === "te" || (prefer === "strict" && !cl));
    if (useTe) {
      for (;;) { // chunked: "hajm\r\n" + ma'lumot + "\r\n", 0 bilan tugaydi
        const eol = raw.indexOf("\r\n", pos);
        if (eol < 0) return { requests, error: "chunk to'liq emas" };
        const size = parseInt(raw.slice(pos, eol), 16);
        pos = eol + 2 + size + 2;
        if (size === 0) break;
      }
    } else if (cl !== undefined) {
      pos += Number(cl);
    }
  }
  return { requests };
}

const ADMIN_BLOCK = (line: string) => line.split(" ")[1].startsWith("/admin");
const inner = "0\r\n\r\nGET /admin/export HTTP/1.1\r\nHost: fleet.example\r\n\r\n";
const stream =
  "POST /api/note HTTP/1.1\r\nHost: fleet.example\r\n" +
  `Content-Length: ${inner.length}\r\nTransfer-Encoding: chunked\r\n\r\n` + inner;

const f = frame(stream, "cl");   // frontend: Content-Length
const b = frame(stream, "te");   // backend: Transfer-Encoding
console.log("frontend ko'radi:", f.requests);
console.log("backend ko'radi: ", b.requests);
console.log("frontend /admin ni ko'rdimi:", f.requests.some(ADMIN_BLOCK));
console.log("backend /admin ni oldimi:", b.requests.some(ADMIN_BLOCK));
```

```text
frontend ko'radi: [ 'POST /api/note HTTP/1.1' ]
backend ko'radi:  [ 'POST /api/note HTTP/1.1', 'GET /admin/export HTTP/1.1' ]
frontend /admin ni ko'rdimi: false
backend /admin ni oldimi: true
```

Frontend bitta so'rov ko'rdi va `/admin` ACL'idan o'tkazdi; backend ikkita so'rov oldi, ikkinchisi ACL'dan o'tmagan `/admin/export`.

## Chuqurroq: cache poisoning va proxy zanjiri

### Cache kaliti

Umumiy (shared) cache javobni "kalit" bo'yicha saqlaydi; odatda kalit metod va URL (host va yo'l) dan iborat. Javob so'rovdagi boshqa header'ga bog'liq bo'lsa, server `Vary` bilan bu header'ni kalitga qo'shishni buyuradi (MDN HTTP caching: `Vary: Accept-Language` misolida, til bo'yicha alohida nusxa saqlanadi). Muammo: javobga ta'sir qiladi, lekin kalitga kirmaydi, ya'ni **unkeyed** kiritma. Tipik misol: ilova havolani `X-Forwarded-Host` dan quradi (11-dars xatosi). Quyidagi blok shuni ko'rsatadi.

```ts run
type Req = { path: string; headers: Record<string, string> };
const APP = "https://fleet.example";

// ZAIF origin: havolani unkeyed header'dan quradi
const originWeak = (r: Req) => {
  const host = r.headers["x-forwarded-host"];
  return `<script src="${host ? "https://" + host : APP}/app.js"></script>`;
};
// Tuzatilgan origin: bazaviy URL konfiguratsiyadan
const originFixed = (_r: Req) => `<script src="${APP}/app.js"></script>`;

// Umumiy (shared) cache: kalit faqat metod + yo'l
class Cache {
  store = new Map<string, string>();
  constructor(private origin: (r: Req) => string) {}
  handle(r: Req): string {
    const key = `GET ${r.path}`;
    const hit = this.store.get(key);
    if (hit !== undefined) return `HIT  ${hit}`;
    const body = this.origin(r);
    this.store.set(key, body);
    return `MISS ${body}`;
  }
}
for (const [name, origin] of [["zaif", originWeak], ["tuzatilgan", originFixed]] as const) {
  const cache = new Cache(origin);
  console.log(`-- ${name}`);
  console.log("hujumchi:", cache.handle({ path: "/", headers: { "x-forwarded-host": "evil.example" } }));
  console.log("qurbon:  ", cache.handle({ path: "/", headers: {} }));
}
```

```text
-- zaif
hujumchi: MISS <script src="https://evil.example/app.js"></script>
qurbon:   HIT  <script src="https://evil.example/app.js"></script>
-- tuzatilgan
hujumchi: MISS <script src="https://fleet.example/app.js"></script>
qurbon:   HIT  <script src="https://fleet.example/app.js"></script>
```

Zaif variantda hujumchi bitta so'rov bilan zararli javobni cache'ga joyladi, qurbon esa `HIT` bilan uni oldi. Tuzatilgan variantda javob `X-Forwarded-Host` ga bog'liq emas, shuning uchun keshdagi javob hammaga bir xil va xavfsiz.

### Himoya variantlari

1. **Javobni unkeyed kiritmaga bog'lamang.** Eng yaxshi yo'l: bazaviy URL kabi qiymatlar konfiguratsiyadan olinadi, so'rov header'idan emas.
2. **Bog'liqlik zarur bo'lsa, uni kalitga qo'shing**: `Vary` yoki CDN'ning kalit sozlamasi bilan. MDN ogohlantiradi: `Vary: User-Agent` kabi juda xilma-xil qiymat kesh samaradorligini yo'q qiladi.
3. **Shaxsiy kontentni umumiy cache'dan ajrating.** MDN: cookie bilan shaxsiy kontentni qayta ishlatishdan saqlanish uchun Vary'da cookie emas, `Cache-Control: private` ishlating. Autentifikatsiyalangan javoblarga `private` yoki `no-store` qo'ying.
4. **Cache-Control ni aniq yozing.** MDN: `Cache-Control` bo'lmasa ham javob saqlanib qayta ishlatilishi mumkin (heuristik keshlash, masalan, `Last-Modified` asosida taxmin qilingan muddat), va deyarli hamma javobga `Cache-Control` ni aniq yozish kerak. `private` shaxsiy javobni faqat brauzer keshida saqlashga ruxsat beradi, shared keshda emas. Faqat cookie borligi javobni shaxsiy qilmaydi: ilova nima shaxsiy ekanini o'zi bildirishi kerak.
5. **`no-store` ni ehtiyotkor ishlating.** U javob saqlanishini to'sadi, lekin shu URL uchun allaqachon saqlangan eski javobni o'chirmaydi. Uni hamma joyga qo'yish brauzerning back/forward cache kabi imkoniyatlarini ham yo'qotadi; MDN umumiy holda `no-cache` ni `private` bilan birga ishlatishni tavsiya qiladi.

### Smuggling'dan himoya

Asosiy qoida 11-darsdagi bilan bir: noaniq xabarni rad eting, "tuzatib" yubormang. Aniq choralar:

- Frontend va backend o'rtasida bir xil, yangilangan HTTP kutubxonasi/proxy ishlating; ularni muntazam yangilang (supply chain va patch ishlari, 81-dars).
- Noaniq xabarlarni (CL va TE birga, takrorlangan farqli CL, buzilgan header nomi, noto'g'ri TE qiymati) ikkala tomonda ham 400 bilan rad eting va ulanishni yoping.
- Imkon bo'lsa, proxy va backend o'rtasida HTTP/2 yoki ulanishni qayta ishlatmaslik (har so'rov uchun alohida ulanish) variantidan foydalaning; WSTG ro'yxati HTTP/2 downgrade va H2C vektorlarini ham sanaydi.
- WAF qoidasi parser farqini yo'qotmaydi, u faqat ma'lum payload shakllarini ushlaydi. Himoya darajasi sifatida qo'shing, birlamchi chora sifatida emas.

## Misol: bir so'rov ichidagi ikkinchi so'rov

Quyidagi misol yuqoridagi framer'larni qayta ishlatadi. Frontend ACL: `/admin` bilan boshlanadigan yo'llar bloklanadi. Hamma narsa o'quv modeli.

### 1. Zaif kod

Frontend `Content-Length`, backend `Transfer-Encoding` ni afzal ko'radi, noaniqlik rad etilmaydi:

```ts run
type Framed = { requests: string[]; error?: string };

// Ikki xil framer: bitta TCP oqimini so'rovlarga ajratadi (o'quv modeli, to'liq HTTP parser emas)
// prefer: "cl" - Content-Length ustun, "te" - Transfer-Encoding ustun, "strict" - noaniqlikni rad etadi
function frame(raw: string, prefer: "cl" | "te" | "strict"): Framed {
  const requests: string[] = [];
  let pos = 0;
  while (pos < raw.length) {
    const end = raw.indexOf("\r\n\r\n", pos);
    if (end < 0) return { requests, error: "to'liq emas" };
    const lines = raw.slice(pos, end).split("\r\n");
    const h = new Map<string, string>();
    for (const l of lines.slice(1)) {
      const i = l.indexOf(":");
      if (i < 1 || /\s/.test(l.slice(0, i))) return { requests, error: `noto'g'ri header: ${JSON.stringify(l)}` };
      h.set(l.slice(0, i).toLowerCase(), l.slice(i + 1).trim());
    }
    const cl = h.get("content-length"), te = h.get("transfer-encoding");
    if (cl && te && prefer === "strict") return { requests, error: "Content-Length va Transfer-Encoding birga: rad etildi" };
    requests.push(lines[0]);
    pos = end + 4;
    const useTe = te !== undefined && (prefer === "te" || (prefer === "strict" && !cl));
    if (useTe) {
      for (;;) { // chunked: "hajm\r\n" + ma'lumot + "\r\n", 0 bilan tugaydi
        const eol = raw.indexOf("\r\n", pos);
        if (eol < 0) return { requests, error: "chunk to'liq emas" };
        const size = parseInt(raw.slice(pos, eol), 16);
        pos = eol + 2 + size + 2;
        if (size === 0) break;
      }
    } else if (cl !== undefined) {
      pos += Number(cl);
    }
  }
  return { requests };
}

const ADMIN_BLOCK = (line: string) => line.split(" ")[1].startsWith("/admin");

// ZAIF: ikki komponent turlicha chegara tanlaydi
function frontendAllows(raw: string): boolean {
  return !frame(raw, "cl").requests.some(ADMIN_BLOCK);
}
function backendHandles(raw: string): string[] {
  return frame(raw, "te").requests;
}

const normal = "GET /api/vehicles HTTP/1.1\r\nHost: fleet.example\r\n\r\n";
console.log("oddiy so'rov:", frontendAllows(normal), backendHandles(normal));
const direct = "GET /admin/export HTTP/1.1\r\nHost: fleet.example\r\n\r\n";
console.log("to'g'ridan-to'g'ri /admin:", frontendAllows(direct));
```

```text
oddiy so'rov: true [ 'GET /api/vehicles HTTP/1.1' ]
to'g'ridan-to'g'ri /admin: false
```

### 2. Hujum

To'g'ridan-to'g'ri `/admin` so'rovi frontend ACL'idan o'tmaydi. Hujumchi esa uni ruxsat etilgan `POST /api/note` so'rovining body'siga o'rab yuboradi va ikkala header'ni qo'yadi:

```ts run
type Framed = { requests: string[]; error?: string };

// Ikki xil framer: bitta TCP oqimini so'rovlarga ajratadi (o'quv modeli, to'liq HTTP parser emas)
// prefer: "cl" - Content-Length ustun, "te" - Transfer-Encoding ustun, "strict" - noaniqlikni rad etadi
function frame(raw: string, prefer: "cl" | "te" | "strict"): Framed {
  const requests: string[] = [];
  let pos = 0;
  while (pos < raw.length) {
    const end = raw.indexOf("\r\n\r\n", pos);
    if (end < 0) return { requests, error: "to'liq emas" };
    const lines = raw.slice(pos, end).split("\r\n");
    const h = new Map<string, string>();
    for (const l of lines.slice(1)) {
      const i = l.indexOf(":");
      if (i < 1 || /\s/.test(l.slice(0, i))) return { requests, error: `noto'g'ri header: ${JSON.stringify(l)}` };
      h.set(l.slice(0, i).toLowerCase(), l.slice(i + 1).trim());
    }
    const cl = h.get("content-length"), te = h.get("transfer-encoding");
    if (cl && te && prefer === "strict") return { requests, error: "Content-Length va Transfer-Encoding birga: rad etildi" };
    requests.push(lines[0]);
    pos = end + 4;
    const useTe = te !== undefined && (prefer === "te" || (prefer === "strict" && !cl));
    if (useTe) {
      for (;;) { // chunked: "hajm\r\n" + ma'lumot + "\r\n", 0 bilan tugaydi
        const eol = raw.indexOf("\r\n", pos);
        if (eol < 0) return { requests, error: "chunk to'liq emas" };
        const size = parseInt(raw.slice(pos, eol), 16);
        pos = eol + 2 + size + 2;
        if (size === 0) break;
      }
    } else if (cl !== undefined) {
      pos += Number(cl);
    }
  }
  return { requests };
}

const ADMIN_BLOCK = (line: string) => line.split(" ")[1].startsWith("/admin");
const inner = "0\r\n\r\nGET /admin/export HTTP/1.1\r\nHost: fleet.example\r\n\r\n";
const stream =
  "POST /api/note HTTP/1.1\r\nHost: fleet.example\r\n" +
  `Content-Length: ${inner.length}\r\nTransfer-Encoding: chunked\r\n\r\n` + inner;

function frontendAllows(raw: string): boolean {
  return !frame(raw, "cl").requests.some(ADMIN_BLOCK);
}
function backendHandles(raw: string): string[] {
  return frame(raw, "te").requests;
}

console.log("frontend ruxsat berdi:", frontendAllows(stream));
console.log("backend bajaradi:", backendHandles(stream));
```

```text
frontend ruxsat berdi: true
backend bajaradi: [ 'POST /api/note HTTP/1.1', 'GET /admin/export HTTP/1.1' ]
```

Frontend `/admin` ni ko'rmadi, shuning uchun ruxsat berdi. Backend esa `GET /admin/export` ni alohida so'rov sifatida oldi. ACL aylanib o'tildi.

### 3. Tuzatilgan kod

Ikkala komponent ham noaniq xabarni rad etadi:

```ts run
type Framed = { requests: string[]; error?: string };

// Ikki xil framer: bitta TCP oqimini so'rovlarga ajratadi (o'quv modeli, to'liq HTTP parser emas)
// prefer: "cl" - Content-Length ustun, "te" - Transfer-Encoding ustun, "strict" - noaniqlikni rad etadi
function frame(raw: string, prefer: "cl" | "te" | "strict"): Framed {
  const requests: string[] = [];
  let pos = 0;
  while (pos < raw.length) {
    const end = raw.indexOf("\r\n\r\n", pos);
    if (end < 0) return { requests, error: "to'liq emas" };
    const lines = raw.slice(pos, end).split("\r\n");
    const h = new Map<string, string>();
    for (const l of lines.slice(1)) {
      const i = l.indexOf(":");
      if (i < 1 || /\s/.test(l.slice(0, i))) return { requests, error: `noto'g'ri header: ${JSON.stringify(l)}` };
      h.set(l.slice(0, i).toLowerCase(), l.slice(i + 1).trim());
    }
    const cl = h.get("content-length"), te = h.get("transfer-encoding");
    if (cl && te && prefer === "strict") return { requests, error: "Content-Length va Transfer-Encoding birga: rad etildi" };
    requests.push(lines[0]);
    pos = end + 4;
    const useTe = te !== undefined && (prefer === "te" || (prefer === "strict" && !cl));
    if (useTe) {
      for (;;) { // chunked: "hajm\r\n" + ma'lumot + "\r\n", 0 bilan tugaydi
        const eol = raw.indexOf("\r\n", pos);
        if (eol < 0) return { requests, error: "chunk to'liq emas" };
        const size = parseInt(raw.slice(pos, eol), 16);
        pos = eol + 2 + size + 2;
        if (size === 0) break;
      }
    } else if (cl !== undefined) {
      pos += Number(cl);
    }
  }
  return { requests };
}

const ADMIN_BLOCK = (line: string) => line.split(" ")[1].startsWith("/admin");
const inner = "0\r\n\r\nGET /admin/export HTTP/1.1\r\nHost: fleet.example\r\n\r\n";
const stream =
  "POST /api/note HTTP/1.1\r\nHost: fleet.example\r\n" +
  `Content-Length: ${inner.length}\r\nTransfer-Encoding: chunked\r\n\r\n` + inner;

function frontendAllows(raw: string): boolean {
  const r = frame(raw, "strict");
  return !r.error && !r.requests.some(ADMIN_BLOCK);
}
function backendHandles(raw: string): string[] | string {
  const r = frame(raw, "strict");
  return r.error ? `400: ${r.error}` : r.requests;
}

const normal = "GET /api/vehicles HTTP/1.1\r\nHost: fleet.example\r\n\r\n";
console.log("oddiy:", frontendAllows(normal), backendHandles(normal));
console.log("hujum:", frontendAllows(stream), backendHandles(stream));
```

```text
oddiy: true [ 'GET /api/vehicles HTTP/1.1' ]
hujum: false 400: Content-Length va Transfer-Encoding birga: rad etildi
```

Tuzatish nima uchun yetarli. Invariant: chegara haqida ikki talqin bo'lishi mumkin bo'lgan xabar hech bir komponentdan o'tmaydi. Ko'rsatilgan CL.TE hujumi ikkala tomonda rad etiladi, oddiy so'rov esa o'zgarishsiz o'tadi. Kerak bo'lsa ikkala komponent ulanishni ham yopadi, shuning uchun qolgan baytlar keyingi so'rov sifatida o'qilmaydi.

Yopilmagani. Birinchidan, bu faqat CL va TE birga kelgan holat va modeldagi header tekshiruvlari; real parser va proxy'da HTTP/2 tarjimasi, boshqa kodlashlar va chunk kengaytmalari kabi nozik holatlar bor. Ikkinchidan, qat'iylik ikkala komponentda bo'lishi kerak; faqat backend yoki faqat frontend yetarli emas, chunki biri noaniq xabarni qabul qilib, ikkinchisiga "tuzatib" uzatishi mumkin. Uchinchidan, parser xatolari tizimdagi dasturiy ta'minot zaifliklari sifatida paydo bo'ladi: ularni yangilash orqali yopasiz.

## Qachon qo'llamaslik kerak

- Hamma xabarni qat'iy rad etish eski mijoz yoki IoT qurilmalarini uzishi mumkin. Avtopark trekerlarining ba'zilari noodatiy HTTP yuboradi. Bunday qurilmalar uchun alohida endpoint va monitoring qo'ying; rad etilgan so'rovlar sonini kuzating.
- Agar ilovangiz oldida hech qanday proxy bo'lmasa (bitta server ulanishni o'zi qabul qilsa), smuggling vektori yo'q. Lekin odatda CDN yoki balanser keyinroq qo'shiladi, va bu farazni qayta ko'rib chiqish kerak.
- `Vary` ni ko'paytirish kesh samaradorligini tushiradi. Har header uchun Vary qo'shish o'rniga, javobni unkeyed kiritmaga bog'liq bo'lmaydigan qiling.
- `Cache-Control: no-store` hamma narsaga qo'yish ishlaydigan, lekin ortiqcha yechim: statik fayllarni ham keshlamaslik yuklamani oshiradi. Shaxsiy va ommaviy yo'llarni ajrating.
- Cache poisoning va smuggling tekshiruvlarini faqat o'z tizimingizda va ruxsat bilan qiling (9-dars). Real tizimlarga qarshi bu payload'larni ishlatish noqonuniy bo'lishi mumkin.

## Stack'da: Node.js, Fastify va reverse proxy

Node.js hujjatiga ko'ra `insecureHTTPParser` standart `false`, ya'ni qat'iy parser yoqilgan. `--insecure-http-parser` (yoki server/mijoz opsiyasi) uni bo'shatadi: parser `Transfer-Encoding` va `Content-Length` birga kelgan xabarni, noto'g'ri header qiymatlarini, `chunked` dan keyingi qo'shimcha kodlashlarni va `\r\n` o'rniga `\n` ajratgichni ham qabul qiladi. Hujjat o'zi "ishlatmaslik kerak" deydi; eski qurilmalar uchun kerak bo'lsa ham, uni faqat alohida, proxy orqasidagi izolyatsiyalangan servisda yoqing va Node.js ni yangilab turing. Ilova darajasida: `trustProxy` ni to'g'ri sozlang (11-dars), javobga `Cache-Control` va `Vary` ni aniq yozing, va bazaviy URL'ni konfiguratsiyadan oling. Quyidagi kod ishga tushirilmaydi (server kerak), sintaksis jihatidan to'g'ri TypeScript.

```ts
import Fastify from "fastify";

const app = Fastify({ trustProxy: "10.0.0.0/8" }); // proxy manzillari oralig'i (11-dars)

// Shaxsiy javoblar umumiy cache'ga tushmasin
app.addHook("onSend", async (req, reply) => {
  if (req.headers.authorization || req.headers.cookie) {
    reply.header("Cache-Control", "private, no-store");
  }
});

// Statik ommaviy fayl: aniq keshlash
app.get("/assets/version.json", async (_req, reply) => {
  reply.header("Cache-Control", "public, max-age=300");
  return { version: "1.0.0" };
});
```

Proxy darajasida (nginx, envoy, CDN) sozlamalar mahsulotga bog'liq: HTTP/1.1 dan HTTP/2 ga tarjima qilinadigan joyni, CL/TE bilan ishlash qoidasini va cache kalitini mahsulot hujjatidan tekshiring; bu dars ularning aniq direktivalarini keltirmaydi.

## Xulosa

- Request smuggling frontend va backend so'rov chegarasini turlicha topganda yuzaga keladi (CL.TE, TE.CL va HTTP/2 downgrade variantlari); smuggled so'rov proxy nazoratlarini aylanib o'tadi.
- Cache poisoning'ning ildizi: javobni o'zgartiradigan, lekin cache kalitiga kirmaydigan (unkeyed) kiritma. Javobni unkeyed ma'lumotga bog'lamang.
- Shaxsiy javoblar uchun `Cache-Control: private` (yoki `no-store`), `Vary` ni esa faqat kerakli header'larga qo'ying.
- Smuggling'ga qarshi: noaniq xabarni ikkala komponentda rad etish, bir xil va yangilangan parser, imkon bo'lsa alohida ulanish yoki HTTP/2.
- WAF qoidasi parser farqini yo'q qilmaydi, faqat qo'shimcha qatlam.
- Bu hujumlarni faqat o'z o'quv muhitingizda sinang; qat'iylik haqiqiy proxy va serverlarda yangilanish orqali ta'minlanadi.
