---
n: 10
slug: xavfsiz-laboratoriya
title: "Xavfsiz laboratoriya muhiti va kurs bo'ylab ishlatiladigan zaif ilova"
summary: "Zaif ilovalar bilan xavfsiz ishlash qoidalari: izolyatsiya, loopback'ga bog'lash, sintetik ma'lumot, qayta tiklash; kursdagi uch laboratoriya turi (brauzerdagi run bloklari, o'quv in-memory modeli, mahalliy OWASP Juice Shop) va laboratoriya konfiguratsiyasini tekshirish misoli."
duration: 35
sources:
  - id: juice-shop
    note: "OWASP Juice Shop loyiha sahifasi: Node.js, Express va Angular'da yozilgan ataylab zaif ilova; o'qitish, xabardorlik demolari, CTF va xavfsizlik vositalari uchun nishon; MIT litsenziya"
  - id: wstg
    note: "WSTG Suggested Reading: ataylab zaif veb-ilovalar ro'yxati (Juice Shop, WebGoat, DVWA va boshqalar)"
  - id: node-security
    note: "Node.js Security Best Practices: tahdidlar ro'yxati va --permission bayrog'i orqali ishlash vaqti cheklovlari"
  - id: docker-security
    note: "Docker Engine Security: daemon attack surface (faqat ishonchli foydalanuvchilar boshqarishi kerak, host katalogini konteynerga ulash mumkin) va konteyner izolyatsiyasi to'liq bo'lmasligi mumkinligi"
quiz:
  - q: "Ataylab zaif ilovani Docker'da ishga tushirdingiz va `ports: [\"3000:3000\"]` yozdingiz. Bu ilovaga kim kira oladi?"
    options:
      - "Faqat sizning mashinangizdagi brauzer"
      - "Mashinaning tarmoq interfeyslari orqali yetib boradigan har kim (xuddi shu Wi-Fi tarmog'idagi qurilmalar ham)"
      - "Hech kim: Docker tarmog'i yopiq"
      - "Faqat Docker konteynerlari"
    answer: 1
    explain: "Host manzili ko'rsatilmasa, Docker port'ni standart bo'yicha barcha interfeyslarda ochadi. Zaif ilovani loopback'ga bog'lash uchun `127.0.0.1:3000:3000` yoziladi (Docker'ning standart xatti-harakati; hujjat bu sessiyada ochilmagan)."
  - q: "Laboratoriyada real mijoz bazasining nusxasi bilan ishlash nima uchun yomon g'oya?"
    options:
      - "Baza hajmi katta bo'ladi"
      - "Sinovlar sekin ishlaydi"
      - "Docker real ma'lumotni qo'llab-quvvatlamaydi"
      - "Zaif yoki sinov muhitidan ma'lumot sizishi shaxsga doir ma'lumot muammosiga aylanadi va hisobotlarga tushib qoladi"
    answer: 3
    explain: "Laboratoriya ataylab zaif yoki sinovga ochiq. Real shaxsga doir ma'lumot u yerda sizishi mumkin (9-dars); sintetik, takrorlanadigan ma'lumot bu xavfni yo'q qiladi."
  - q: "Docker konteyneri laboratoriya uchun qanday izolyatsiya beradi?"
    options:
      - "Foydali, lekin to'liq emas: standart capability va mount'lar nuqsonli izolyatsiyaga olib kelishi mumkin; privileged yoki host katalogini ulash uni yanada zaiflashtiradi"
      - "Standart sozlamalarda ham hostdan to'liq izolyatsiya"
      - "Hech qanday izolyatsiya bermaydi"
      - "Virtual mashinadan kuchliroq"
    answer: 0
    explain: "Docker hujjati standart capability va mount'lar to'liq bo'lmagan izolyatsiya berishi mumkinligini va bind mount orqali host fayl tizimini o'zgartirish mumkinligini yozadi. Konteyner foydali qatlam, lekin mutlaq chegara emas."
  - q: "Kursdagi `ts run` bloki nimani qila olmaydi?"
    options:
      - "`console.log` bilan natija chiqarish"
      - "WebCrypto (`crypto.subtle`) dan foydalanish"
      - "Real serverga tarmoq so'rovi yuborish yoki Node `fs`/`child_process` ishlatish"
      - "Top-level `await` ishlatish"
    answer: 2
    explain: "Brauzer Worker'ida tarmoq va Node API'lar yo'q, shuning uchun run bloklari xavfsiz sandbox: hujum faqat darsning o'z kodiga qarshi bo'ladi. WebCrypto, top-level await va console.log ishlaydi."
  - q: "Juice Shop'ni mahalliy ishga tushirgach, uni internetdagi boshqa saytga sinash uchun ishlatish mumkinmi?"
    options:
      - "Ha, ruxsat shart emas"
      - "Ha, agar sayt kichik bo'lsa"
      - "Ha, agar VPN ishlatilsa"
      - "Yo'q: Juice Shop faqat o'zining nishoni. Boshqa tizimni sinash uchun alohida yozma ruxsat va doira kerak (9-dars)"
    answer: 3
    explain: "Laboratoriya ruxsati faqat laboratoriyaga tegishli. Boshqa tizim uchun ruxsat va doira kerak; VPN yoki sayt hajmi buni o'zgartirmaydi."
  - q: "Node.js `--permission` bayrog'i laboratoriya skriptlari uchun qanday qatlam hisoblanadi?"
    options:
      - "Zararli kodga qarshi mutlaq sandbox"
      - "Ishonchli kodni tasodifiy xatolardan (masalan, noto'g'ri fayllarga yozishdan) saqlaydigan qo'shimcha cheklov; zararli kodni to'xtatadigan chegara emas"
      - "Faqat tarmoqni yopadi"
      - "Production uchun majburiy"
    answer: 1
    explain: "Node.js hujjati permission modelini 'seat belt' yondashuvi deb ataydi: u ishonchli kodni tasodifan ruxsatsiz resurslarni o'zgartirishdan saqlaydi, lekin zararli kod uni chetlab o'tishi mumkin. Shuning uchun u izolyatsiyaning o'rnini bosmaydi."
task:
  title: "Laboratoriya konfiguratsiyasini tekshirish (audit)"
  prompt: |
    `auditLab(config)` laboratoriya konteynerlari konfiguratsiyasini tekshirib, muammolar ro'yxatini qaytarishi kerak. Hozir faqat `ports` ichida `127.0.0.1` so'zi borligini qidiradi va boshqa muammolarni ko'rmaydi.

    Funksiyani tuzating. Har muammo `"<servis>: <sabab>"` ko'rinishida bo'lsin. Qoidalar: (1) har `ports` yozuvi uch qismli `host:hostPort:containerPort` shaklda bo'lsin va host qismi `127.0.0.1` yoki `[::1]` bo'lsin, aks holda sabab `port loopback'ga bog'lanmagan: <yozuv>`; (2) `privileged: true` bo'lsa sabab `privileged rejim`; (3) `volumes` ichida `/` ga yoki `/var/run/docker.sock` ga ulanish bo'lsa (host yo'li `:` dan oldin turadi) sabab `xavfli mount: <yozuv>`. Servislar kalit tartibida, har servis ichida ports, privileged, volumes tartibida. Imzoni o'zgartirmang.
  lang: ts
  starter: |
    type Service = { ports?: string[]; privileged?: boolean; volumes?: string[] };
    type Config = { services: Record<string, Service> };

    function auditLab(config: Config): string[] {
      const problems: string[] = [];
      for (const [name, svc] of Object.entries(config.services)) {
        for (const p of svc.ports ?? []) {
          if (!p.includes("127.0.0.1")) problems.push(`${name}: port loopback'ga bog'lanmagan: ${p}`);
        }
      }
      return problems;
    }

    const config: Config = {
      services: {
        api: { ports: ["3000:3000"], privileged: true, volumes: ["./data:/data", "/var/run/docker.sock:/var/run/docker.sock"] },
        juice: { ports: ["127.0.0.1:3001:3000"] },
        web: { ports: ["0.0.0.0:8080:80", "[::1]:8081:80"], volumes: ["/:/host"] },
      },
    };
    console.log(auditLab(config).join("\n"));
  solution: |
    type Service = { ports?: string[]; privileged?: boolean; volumes?: string[] };
    type Config = { services: Record<string, Service> };

    const LOOPBACK = new Set(["127.0.0.1", "[::1]"]);
    const DANGEROUS_HOST_PATHS = new Set(["/", "/var/run/docker.sock"]);

    function auditLab(config: Config): string[] {
      const problems: string[] = [];
      for (const name of Object.keys(config.services).sort()) {
        const svc = config.services[name];
        for (const p of svc.ports ?? []) {
          const parts = p.split(":");
          // IPv6 manzil ichida ":" bo'lgani uchun "[::1]" ni birlashtirib olamiz
          const host = p.startsWith("[") ? p.slice(0, p.indexOf("]") + 1) : parts[0];
          const rest = p.startsWith("[") ? p.slice(p.indexOf("]") + 1).split(":").filter(Boolean) : parts.slice(1);
          const threePart = rest.length === 2;
          if (!threePart || !LOOPBACK.has(host)) problems.push(`${name}: port loopback'ga bog'lanmagan: ${p}`);
        }
        if (svc.privileged === true) problems.push(`${name}: privileged rejim`);
        for (const v of svc.volumes ?? []) {
          const hostPath = v.split(":")[0];
          if (DANGEROUS_HOST_PATHS.has(hostPath)) problems.push(`${name}: xavfli mount: ${v}`);
        }
      }
      return problems;
    }

    const config: Config = {
      services: {
        api: { ports: ["3000:3000"], privileged: true, volumes: ["./data:/data", "/var/run/docker.sock:/var/run/docker.sock"] },
        juice: { ports: ["127.0.0.1:3001:3000"] },
        web: { ports: ["0.0.0.0:8080:80", "[::1]:8081:80"], volumes: ["/:/host"] },
      },
    };
    console.log(auditLab(config).join("\n"));
  solutionNotes: |
    - Port yozuvi tahlil qilinadi: ikki qismli `3000:3000` shakli host manzilini ko'rsatmaydi va barcha interfeyslarda ochiladi (Docker'ning standart xatti-harakati), shuning uchun u rad etiladi. `includes("127.0.0.1")` esa masalan `0.0.0.0:3000:3000 # 127.0.0.1` kabi yozuvga aldanadi.
    - IPv6 loopback `[::1]` alohida ishlanadi, chunki manzil ichida `:` bor va oddiy `split(":")` uni buzadi.
    - `/` va docker socket'ni ulash host'ni konteyner ichidan boshqarishga yo'l ochadi: Docker hujjati ham host katalogini cheklovsiz ulash va daemon'ni faqat ishonchli foydalanuvchilar boshqarishi kerakligini yozadi.
    - Bu faqat konfiguratsiya matnini tekshiradi. Haqiqiy ishlayotgan konteynerning sozlamalari (masalan `docker inspect`) alohida tekshiriladi, va boshqa xavfli sozlamalar (qo'shimcha capability, host network) bu ro'yxatda yo'q.
  checklist:
    - "Ikki qismli port (`3000:3000`) rad etiladi"
    - "`0.0.0.0` va boshqa loopback bo'lmagan host rad etiladi, `[::1]` ruxsat etiladi"
    - "`privileged: true` va xavfli mount'lar topiladi"
    - "Servislar tartibi barqaror (kalit tartibida)"
    - "Tekshiruv nimani qamramasligini ayta olasiz"
---

## Muammo

Bu kursda siz hujumlarni o'zingiz sinab ko'rasiz: injection, XSS, buzilgan avtorizatsiya. Buning uchun zaif tizim kerak. Ikki xavfli yo'l bor. Birinchisi, o'quv hujumlarini real tizimda sinash (9-darsda ko'rdik: ruxsatsiz sinash jinoiy javobgarlikka olib kelishi mumkin). Ikkinchisi, zaif ilovani noto'g'ri ishga tushirish: ataylab zaif ilova tarmoqqa ochiq qolsa, uni kimdir sizning mashinangizdan foydalanish uchun ishlatishi mumkin.

Uchinchi muammo kamroq ko'rinadi: laboratoriya takrorlanmasa, o'rganish ham uziladi. Bir darsda ma'lumotni buzdingiz, keyingi darsda natija boshqacha chiqadi, nima uchun ekanini bilmaysiz. Takrorlanadigan, tozalanadigan laboratoriya o'rganishning o'zi uchun muhim.

Bu dars kursning ishchi muhitini belgilaydi: qaysi laboratoriya turlaridan foydalanamiz, ularni qanday xavfsiz ishlatamiz va nima qilmaslik kerak.

## Asosiy g'oya

### Kursdagi uch laboratoriya turi

1. Brauzerdagi `run` bloklari. Dars ichidagi `ts run` (va `js run`, `python run`, `sql run`, `html run`) bloklari brauzer sandbox'ida ishlaydi. TypeScript va JavaScript Web Worker ichida bajariladi: tarmoq, `import` va Node API'lar (`fs`, `child_process`) yo'q, vaqt chegarasi 5 soniya. Shuning uchun bu bloklardagi hujumlar faqat darsning o'z kodiga qarshi: ular tashqariga chiqa olmaydi. Bu kursning asosiy laboratoriyasi, va ko'p darslar uchun yetarli.
2. O'quv in-memory modeli. Darslarda misollar bitta neytral avtopark platformasi atrofida (tenant `alfa` va `beta`, mashinalar, telemetriya) qurilgan va ma'lumot kod ichida massiv yoki `Map` ko'rinishida. Server, baza va HTTP qatlami ataylab olib tashlangan, chunki mexanizm ularga bog'liq emas. Ma'lumot sintetik va deterministik: har ishga tushirishda bir xil natija.
3. Mahalliy zaif ilova: OWASP Juice Shop. Server, baza va brauzer bilan to'liq ilovada mashq qilish uchun ataylab zaif ilova kerak. Juice Shop proyekt sahifasiga ko'ra Node.js, Express va Angular'da yozilgan, o'qitish, xabardorlik demolari, CTF va xavfsizlik vositalarini sinash uchun mo'ljallangan ataylab zaif ilova; litsenziyasi MIT. WSTG tavsiya etilgan o'qish ro'yxatida uni boshqa ataylab zaif veb-ilovalar (WebGoat, DVWA va boshqalar) qatorida keltiradi.

Boshqa `run` tillari ham shu sandbox g'oyasiga tayanadi. Python bloklari brauzerda Pyodide ichida ishlaydi (mahalliy python o'rnatish shart emas), SQL bloklari brauzerdagi SQLite'da, HTML demolari esa sandbox qilingan iframe ichida bajariladi, shuning uchun XSS, CSP va DOM misollari asosiy sahifaga tegmaydi. Bu qulaylik bitta qoida bilan birga keladi: run blokidagi kodni o'zgartirib sinash mumkin, lekin boshqa joydan (forum, chat, noma'lum manba) nusxalangan kodni ishga tushirmang. Brauzer sandbox'i mustahkam to'siq, lekin siz unga nima kiritishni nazorat qilasiz; shu sababli noma'lum kod bu yerda ham noma'lum kod.

Juice Shop ixtiyoriy qo'shimcha: kursning hamma topshirig'i `run` bloklari bilan bajariladi. Uni 91-92 darslarda (kod ko'rib chiqish va o'z ilovani sinash metodikasi) qo'shimcha mashq maydoni sifatida ishlatish mumkin. Ishga tushirish buyrug'i va portini loyihaning GitHub sahifasi va hujjatidan oling: loyiha sahifasida ular berilmagan. Stack'da bo'limida namunaviy konfiguratsiya keltirilgan, lekin u tekshirilmagan umumiy bilimga tayanadi.

### Laboratoriya qoidalari

Zaif ilova bilan ishlashning barcha qoidalari bir tamoyilga qaytadi: ilova ataylab zaif, shuning uchun uning atrofi qattiq bo'lishi kerak.

- Izolyatsiya. Zaif ilovani o'zingizning ish mashinangizda emas, virtual mashina yoki alohida muhitda ishga tushiring. Konteyner foydali qatlam, lekin mutlaq chegara emas: Docker hujjati standart capability va mount'lar to'liq bo'lmagan izolyatsiya berishi mumkinligini, daemon'ni faqat ishonchli foydalanuvchilar boshqarishi kerakligini va host katalogini cheklovsiz konteynerga ulash mumkinligini yozadi.
- Loopback'ga bog'lash. Zaif ilova portini faqat `127.0.0.1` da oching. Host manzilsiz `3000:3000` yozuvi odatda barcha interfeyslarda ochadi, ya'ni umumiy Wi-Fi tarmog'idagi boshqa qurilma ham ulana oladi (Docker'ning standart xatti-harakati; hujjat bu sessiyada ochilmagan).
- Sintetik ma'lumot. Laboratoriyaga real mijoz, haydovchi yoki parolni qo'ymang. Sabab 9-darsda: sizib chiqqan real ma'lumot shaxsga doir ma'lumot muammosiga aylanadi. Deterministik boshlang'ich ma'lumot (seed) laboratoriyani takrorlanadigan qiladi.
- Qayta tiklash. Laboratoriya bir buyruq bilan boshlang'ich holatga qaytishi kerak (konteynerni o'chirib qayta yaratish yoki VM snapshot'i).
- Doira. Laboratoriya ruxsati faqat laboratoriyaga tegishli. Uni boshqa tizimni sinash uchun ishlatish yoki laboratoriya skriptini tashqi manzillarga yo'naltirish 9-dars chegarasini buzadi.
- Sirlar. Laboratoriyada real kalit, token yoki production parolini ishlatmang va ularni zaif ilova bilan bir muhitda saqlamang.

## Chuqurroq: izolyatsiya qatlamlari

### Konteyner, VM va ish vaqti cheklovlari

Izolyatsiya qatlamlari kuchi bo'yicha farq qiladi. Eng zaif: oddiy foydalanuvchi sifatida mahalliy jarayon. Undan kuchliroq: konteyner (kernel namespaces va cgroups ustida), keyin virtual mashina (alohida kernel). Docker hujjati konteyner xavfsizligi kernel imkoniyatlariga, daemon'ning attack surface'iga va kernel "hardening" xususiyatlariga bog'liq ekanini yozadi, va standart capability va mount'lar kernel zaifliklari bilan birga to'liq bo'lmagan izolyatsiyaga olib kelishi mumkinligini ogohlantiradi. Ya'ni zaif ilovaning shubhali kodi uchun VM ishonchliroq tanlov, konteyner esa qulay va yetarli bo'lishi mumkin, agar sozlamalar tejamli bo'lsa (`privileged` yo'q, host katalogi ulanmagan, docker socket ulanmagan).

Node.js tomonda `--permission` bayrog'i ishlash vaqtida fayl tizimi, tarmoq, child process va native addon'larga kirishni cheklaydi. Node.js hujjati buni "seat belt" yondashuvi deb ataydi: u ishonchli kodni tasodifan ruxsatsiz resurslarni o'zgartirishdan saqlaydi, lekin zararli kod uni chetlab o'tishi mumkin. Shuning uchun uni laboratoriya skriptlari uchun qo'shimcha xatolardan himoya qatlami deb qarang, izolyatsiya o'rnini bosuvchi chegara deb emas. Node.js xavfsizlik amaliyotlari sahifasi yana bir mavzuni eslatadi: bog'liqliklar ishonchli deb hisoblanadi va zararli paketlar tarmoq, fayl tizimi va muhit o'zgaruvchilariga kirish oladi. Laboratoriyaga qo'shiladigan har bir paket ham shu xavfni olib keladi (81-dars).

### Versiyalarni qotirish va tashqi aloqa

Laboratoriya natijasi takrorlanishi uchun uning komponentlari ham qotirilishi kerak. Zaif ilova rasmi uchun `latest` emas, aniq versiya yorlig'ini (yoki rasm digest'ini) yozing: aks holda ertaga boshqa kod ishga tushadi va dars qadamlari mos kelmaydi. Bu yana bir xavfsizlik sabab: rasmni qayerdan olayotganingizni bilish 81-82 darslardagi supply chain mavzusiga bevosita bog'liq. Laboratoriya konteyneridan tashqariga chiqish yo'lini imkon qadar yoping (masalan, firewall qoidasi bilan); shunda zaif ilova yoki unga yuborilgan hujum kodi hisobingizdagi boshqa tizimlarga yetib bormaydi. Bu tavsiya kursning amaliy xulosasi, aniq buyruq esa muhitga bog'liq va bu sessiyada tekshirilmagan.

### Laboratoriya daftari

Har mashqni bir xil tuzilmada yozib borish o'rganishni tezlashtiradi va ish haqidagi hisobot madaniyatini hosil qiladi. Tavsiya etilgan qatorlar: maqsad (qaysi zaiflikni o'rganyapsiz), sharoit (ilova versiyasi, holat, seed barmoq izi), qadamlar (kiritish va kutilgan natija), kuzatuv (aslida nima bo'ldi), sabab (nima uchun ishlaydi), tuzatish va qoldiq risk (tuzatish nimani yopmadi). Oxirgi ikki qator darslardagi "Misol" bo'limining uch qismiga mos: zaif kod, hujum va tuzatilgan kod, hamda tuzatish nima uchun yetarli ekani. Daftarda haqiqiy sir, token yoki shaxsga doir ma'lumot bo'lmasin: laboratoriya sintetik bo'lgani uchun bunday dalil kerak ham emas.

### Takrorlanadigan ma'lumot

Laboratoriya natijasi takrorlanishi uchun boshlang'ich ma'lumot deterministik bo'lishi kerak. Quyidagi kod sintetik avtopark ma'lumotini tuzadi va undan SHA-256 barmoq izi (fingerprint) chiqaradi: ma'lumot o'zgargan bo'lsa, izi o'zgaradi va laboratoriya "tozalanmaganini" bilasiz.

```ts run
type Seed = { id: string; tenant: string; plate: string; fuel: number };

function seedFleet(): Seed[] {
  const rows: Seed[] = [];
  for (let i = 1; i <= 6; i++) {
    rows.push({ id: `v${i}`, tenant: i % 2 === 0 ? "beta" : "alfa", plate: `00 T ${String(100 + i)} TT`, fuel: 40 + i * 3 });
  }
  return rows;
}

async function fingerprint(rows: Seed[]): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(rows));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

const clean = seedFleet();
const dirty = seedFleet();
dirty[0].fuel = -500; // darsda ma'lumot buzilgan
console.log("toza:", await fingerprint(clean));
console.log("buzilgan:", await fingerprint(dirty));
console.log("qayta tiklangan:", await fingerprint(seedFleet()));
```

```text
toza: 9d61b3be3a730ae4
buzilgan: 0cf902ae37eb6549
qayta tiklangan: 9d61b3be3a730ae4
```

## Misol: noto'g'ri bog'langan zaif ilova

Bu misolda "hujumchi" ham, ma'lumot ham sintetik. Kod faqat bizning `exposure` va `portBinding` funksiyalarimizga qarshi ishlaydi, hech qanday haqiqiy servis yoki tarmoq yo'q.

### 1. Zaif kod

Laboratoriya tekshiruvi port ochiq ekanini faqat `localhost` so'zi bo'yicha aniqlaydi:

```ts run
// ZAIF: yozuv ichida "127.0.0.1" so'zi bormi, shuni qidiradi va host qismini tahlil qilmaydi
function isLoopbackOnlyWeak(mapping: string): boolean {
  return mapping.includes("127.0.0.1") || !mapping.includes("0.0.0.0");
}

const mappings = [
  "127.0.0.1:3000:3000", // to'g'ri
  "3000:3000",           // host ko'rsatilmagan
  "0.0.0.0:3000:3000",   // barcha interfeyslar
  "10.0.0.5:3000:3000",  // lokal tarmoq manzili
];
for (const m of mappings) console.log(m.padEnd(22), isLoopbackOnlyWeak(m) ? "xavfsiz deb hisoblandi" : "rad etildi");
```

### 2. Hujum

Bu holda hujumchi laboratoriya egasi emas, balki bir tarmoqdagi boshqa qurilma (masalan, umumiy Wi-Fi'da). Agar port barcha interfeyslarda yoki lokal tarmoq manzilida ochilsa, ataylab zaif ilova unga ham ochiq. Zaif tekshiruv faqat "0.0.0.0" so'zini rad etadi, shuning uchun host ko'rsatilmagan `3000:3000` va lokal manzil `10.0.0.5` yozuvlari "xavfsiz" deb hisoblanadi:

```text
127.0.0.1:3000:3000    xavfsiz deb hisoblandi
3000:3000              xavfsiz deb hisoblandi
0.0.0.0:3000:3000      rad etildi
10.0.0.5:3000:3000     xavfsiz deb hisoblandi
```

Ikkinchi va to'rtinchi qatorlar noto'g'ri: `3000:3000` host ko'rsatilmagani uchun odatda barcha interfeyslarda, `10.0.0.5` esa lokal tarmoqda ochiq. Laboratoriya egasi "hamma narsa tekshirildi" deb o'ylaydi, zaif ilova esa tarmoqqa ochiq.

### 3. Tuzatilgan kod

```ts run
type Binding = { ok: boolean; reason: string };

// Yozuv uch qismli bo'lishi va host qismi loopback bo'lishi kerak
function portBinding(mapping: string): Binding {
  let host: string;
  let rest: string[];
  if (mapping.startsWith("[")) {
    const end = mapping.indexOf("]");
    if (end === -1) return { ok: false, reason: "noto'g'ri format" };
    host = mapping.slice(0, end + 1);
    rest = mapping.slice(end + 1).split(":").filter(Boolean);
  } else {
    const parts = mapping.split(":");
    host = parts[0];
    rest = parts.slice(1);
  }
  if (rest.length !== 2) return { ok: false, reason: "host manzili ko'rsatilmagan" };
  if (host !== "127.0.0.1" && host !== "[::1]") return { ok: false, reason: "loopback emas" };
  return { ok: true, reason: "loopback" };
}

const mappings = ["127.0.0.1:3000:3000", "[::1]:3000:3000", "3000:3000", "0.0.0.0:3000:3000", "10.0.0.5:3000:3000"];
for (const m of mappings) {
  const r = portBinding(m);
  console.log(m.padEnd(22), r.ok ? "ruxsat" : "rad", "-", r.reason);
}
```

```text
127.0.0.1:3000:3000    ruxsat - loopback
[::1]:3000:3000        ruxsat - loopback
3000:3000              rad - host manzili ko'rsatilmagan
0.0.0.0:3000:3000      rad - loopback emas
10.0.0.5:3000:3000     rad - loopback emas
```

Endi invariant: faqat host qismi aniq `127.0.0.1` yoki `[::1]` bo'lgan uch qismli yozuv o'tadi; host ko'rsatilmagan yoki boshqa manzil rad etiladi. Bu ko'rsatilgan to'rt noto'g'ri yozuvni yopadi. Qoldiq risk: tekshiruv faqat konfiguratsiya matnini ko'radi, ishlayotgan konteynerning haqiqiy bog'lanishini emas (uni ishga tushirgandan keyin tekshirish kerak), va port bog'lash laboratoriyani to'liq xavfsiz qilmaydi: `privileged` rejim va host katalogi ulanishi (mashqda tekshiramiz) alohida xavflar.

## Qachon qo'llamaslik kerak

- Hamma darsda to'liq laboratoriya muhitini ko'tarish shart emas. Mexanizmni tushunish uchun `run` bloki yetarli bo'lsa, Docker'ga o'tmang: har qo'shimcha qatlam o'z xatolarini olib keladi.
- Juice Shop kabi to'liq ilova mexanizmni o'rganish uchun emas, ilovani bir butun sinash mashqi uchun. Boshlang'ichda unga to'g'ridan-to'g'ri kirish, hujum usullarini yodlash va "flag" yig'ishga aylanishi mumkin. Maqsad tushunish: har topilma uchun nima uchun ishlashini va qanday tuzatilishini yozing.
- Laboratoriyada "hamma narsa ruxsat" tamoyili real loyihaga ko'chib o'tmasligi kerak. Laboratoriya konfiguratsiyasi (zaif sozlamalar, ochiq portlar) production shablonlariga tushib qolmasin.
- Izolyatsiyaning o'zi ruxsat emas. Laboratoriya ichida ishlash qonuniy ekanligi tashqi tizimni sinash huquqini bermaydi (9-dars).
- Tekshiruv skripti (masalan quyidagi mashq) konfiguratsiya matnini ko'radi. Uni "laboratoriya xavfsiz" kafolati deb qabul qilmang.

## Stack'da: Docker Compose va Node.js

Laboratoriyani Docker Compose bilan ko'targanda, portlarni loopback'ga bog'lash, `privileged` rejimdan voz kechish va host katalogini ulamaslik asosiy qoidalar. Quyida Juice Shop uchun namunaviy `compose.yaml` ko'rsatilgan; rasm nomi va port loyiha hujjatidan tekshiriladi (loyiha sahifasida ular berilmagan, shuning uchun quyidagi qiymatlar muallifning umumiy bilimiga tayanadi va bu sessiyada tekshirilmagan):

```yaml
services:
  juice-shop:
    image: bkimminich/juice-shop
    ports:
      - "127.0.0.1:3000:3000"
    read_only: false
    restart: "no"
```

Node.js skriptlari uchun (laboratoriya yordamchilari, seed generatorlari) `--permission` bayrog'i bilan faqat zarur ruxsatlarni berish tavsiya etiladi. Quyida laboratoriya konfiguratsiyasini tekshiruvchi CI testi (ishga tushirilmaydi: Node `fs` brauzer worker'ida yo'q):

```ts
import { readFileSync } from "node:fs";

// compose.yaml da "ports:" ostidagi har yozuv loopback'ga bog'langanini tekshiradi (sodda matn tahlili)
export function lanExposedPorts(path: string): string[] {
  const text = readFileSync(path, "utf8");
  const found: string[] = [];
  for (const m of text.matchAll(/^\s*-\s*"?([0-9.\[\]:a-f]+:\d+:\d+)"?\s*$/gm)) {
    const mapping = m[1];
    if (!mapping.startsWith("127.0.0.1:") && !mapping.startsWith("[::1]:")) found.push(mapping);
  }
  return found;
}
```

Bu tekshiruv faqat matnni qidiradi va YAML'ni to'liq tahlil qilmaydi; real loyihada YAML parser ishlating. 85 va 86-darslarda CI/CD va Docker konfiguratsiyasini chuqurroq ko'ramiz.

## Xulosa

- Kursda uch laboratoriya turi: brauzerdagi `run` bloklari (sandbox, tarmoqsiz), o'quv in-memory modeli (sintetik, deterministik) va ixtiyoriy mahalliy OWASP Juice Shop.
- Zaif ilova bilan ishlash qoidalari: izolyatsiya, loopback'ga bog'lash, sintetik ma'lumot, qayta tiklash, doira va sirlarni alohida saqlash.
- Konteyner foydali, lekin mutlaq izolyatsiya emas; Node.js `--permission` ham "seat belt", sandbox emas.
- Host manzilsiz port yozuvi odatda barcha interfeyslarda ochadi: laboratoriya konfiguratsiyasini matn bo'yicha emas, tahlil qilib tekshiring.
- Laboratoriya ruxsati faqat laboratoriyaga tegishli; boshqa tizimni sinash alohida yozma ruxsat talab qiladi (9-dars).
