---
n: 26
slug: path-traversal
title: "Path traversal va fayl yo'llari"
summary: "Path traversal: foydalanuvchi qiymati fayl yo'liga qo'shilib, ruxsat etilgan papkadan chiqib ketadi. Dars `path.join` va `path.resolve` farqini, qora ro'yxat filtrlarining nega buzilishini, prefiks tekshiruvidagi klassik xatoni, symlink va arxiv ochishdagi holatlarni mini fayl tizimi modelida ko'rsatadi."
duration: 45
sources:
  - id: t10-a01
    note: "A01 Broken Access Control: kategoriyaga CWE-22 (Path Traversal), CWE-23 (Relative Path Traversal) va CWE-36 (Absolute Path Traversal) kiritilgan; CWE-918 SSRF ham shu kategoriyada"
  - id: node-security
    note: "Node.js path hujjati: path.join segmentlarni birlashtirib normallashtiradi, path.resolve o'ngdan chapga mutlaq yo'l hosil bo'lguncha ishlaydi (mutlaq segment oldingilarini tashlaydi), path.normalize `..` ni hisobga oladi va bu tizim yo'lni boshqacha hal qilishini o'zgartirishi mumkinligini yozadi, path.relative, Windows va POSIX farqi; fs.realpath hujjati. Node Security Best Practices umumiy manba"
  - id: cs-input
    note: "Input Validation Cheat Sheet: ijobiy validatsiya va noto'g'ri kiritishni rad etish"
quiz:
  - q: "`path.join(\"/srv/clips/alfa\", name)` va `name = \"../beta/a.mp4\"`. Natija nima va nega xavfli?"
    options:
      - "`/srv/clips/alfa/../beta/a.mp4` normallashib `/srv/clips/beta/a.mp4` bo'ladi: join `..` ni qo'llaydi, papkadan chiqishni tekshirmaydi"
      - "Xato tashlanadi"
      - "`/srv/clips/alfa/beta/a.mp4`"
      - "`/srv/clips/alfa` o'zgarishsiz qoladi"
    answer: 0
    explain: "`path.join` yo'llarni birlashtirib normallashtiradi, ya'ni `..` ni hisobga oladi. U natija ildizdan chiqib ketganini tekshirmaydi. Tekshiruv alohida qadam: natijani ildiz bilan solishtirish."
  - q: "Himoya sifatida `name.replace(\"../\", \"\")` qo'yildi. Qaysi kiritish uni chetlab o'tadi?"
    options:
      - "`../`"
      - "`..%2f`"
      - "`....//`: bitta `../` o'chirilgach qolgan belgilar yana `../` hosil qiladi"
      - "Hech qaysi"
    answer: 2
    explain: "Bir martalik almashtirish (`....//` dan o'rtadagi `../` ni o'chirsa `../` qoladi) o'zi yangi hujum shaklini hosil qiladi. Qora ro'yxat mexanizmni yopmaydi: natijaviy yo'lni ildizga nisbatan tekshirish kerak."
  - q: "Ildiz `/srv/clips/alfa`, tekshiruv `resolved.startsWith(root)`. Qaysi yo'l tekshiruvdan o'tib ketadi?"
    options:
      - "`/etc/passwd`"
      - "`/srv/clips/beta/a.mp4`"
      - "`/srv/clips`"
      - "`/srv/clips/alfa-evil/a.mp4` (qo'shni papka, ildiz nomi bilan boshlanadi)"
    answer: 3
    explain: "`startsWith(root)` qo'shni `alfa-evil` papkasini ham o'tkazadi, chunki satr prefiksi mos. To'g'ri tekshiruv `root + sep` bilan solishtirish yoki natijani ildizga nisbiy yo'l sifatida hisoblab `..` bilan boshlanmasligini tekshirish."
  - q: "Yo'l tekshiruvi `path.resolve` bilan to'g'ri bajarilgan, lekin papka ichida hujumchi tomonidan yuklangan symlink bor (`clips/alfa/link -> /etc`). Tekshiruv nima uchun yetmaydi?"
    options:
      - "Symlink yo'q: Node ularni o'qimaydi"
      - "`resolve` faqat satrni normallashtiradi va fayl tizimiga qaramaydi; yo'l ildiz ichida ko'rinadi, lekin symlink orqali tashqariga olib chiqadi. Kerak: `fs.realpath` bilan haqiqiy yo'lni tekshirish yoki symlink'larni yaratishga yo'l qo'ymaslik"
      - "`resolve` symlink'larni ochadi"
      - "Faqat Windows'da muammo"
    answer: 1
    explain: "`path.resolve` sof satr operatsiyasi. Symlink fayl tizimida mavjud bo'lgani uchun faqat `realpath` (yoki symlink yaratishni taqiqlash) uni hisobga oladi. Ammo tekshiruv va ochish orasida vaqt oralig'i (TOCTOU, 60-dars) ham bor."
  - q: "Foydalanuvchi yuklagan ZIP arxiv ochilmoqda va yozish yo'li `path.join(dest, entry.name)` bilan yasaladi. Entry nomi `../../app/config.js`. Bu qaysi zaiflik?"
    options:
      - "Zip slip: arxiv ichidagi yo'l ildizdan chiqib, ixtiyoriy joyga yozishga olib keladi; ochishdan oldin natijaviy yo'l ildiz ichida ekani tekshirilishi kerak"
      - "SQL injection"
      - "XSS"
      - "Hech qanday zaiflik: arxiv ishonchli"
    answer: 0
    explain: "Arxiv yozuv nomlari ham tashqi kirish. `join` uni normallashtiradi va ildizdan chiqarib yuboradi. Har yozuv uchun resolve + ildiz tekshiruvi (va symlink yozuvlarini rad etish) kerak."
  - q: "Quyidagilardan qaysi biri ildiz papkadan chiqishni eng ishonchli to'sadi?"
    options:
      - "Kiritishni lowercase qilish"
      - "Kengaytmani (.mp4) tekshirish"
      - "Foydalanuvchi kiritgan yo'lni ishlatmaslik: ID bo'yicha bazadan fayl yo'lini olish, diskdagi nomni server o'zi tanlaydi"
      - "Uzunlikni 255 belgi bilan cheklash"
    answer: 2
    explain: "Yo'l foydalanuvchi qo'lida bo'lmasa, traversal mexanizmi ham yo'q. Shundan keyin ildizga nisbatan tekshiruv ikkinchi qatlam. Kengaytma, lowercase va uzunlik yo'lning ildizdan chiqishiga ta'sir qilmaydi."
task:
  title: "safeJoin: ildizdan chiqmaydigan yo'l"
  prompt: |
    `safeJoin(root, name)` ildiz papka ichidagi fayl yo'lini qaytaradi yoki ildizdan chiqib ketsa `null` qaytaradi. Hozirgi versiya faqat `join` qiladi va `startsWith(root)` bilan tekshiradi. Bu `../`, absolut yo'l (`/etc/hosts`), qo'shni papka (`/srv/clips/alfa-evil`) va NUL belgi (`\0`) holatlarida noto'g'ri.

    Tuzating: `name` satr bo'lsin va `\0` hamda teskari slesh (`\\`) bo'lmasin; absolut yo'l (`/` bilan boshlanadigan) rad etilsin; natija normallashtirilib, `root + "/"` bilan boshlanishi shart (`root` ning o'zi ham qabul qilinmaydi). Imzoni o'zgartirmang. `normalize` funksiyasi berilgan va to'g'ri. Kutilgan natija: oddiy nom uchun yo'l, boshqa 5 holat uchun `null`.
  lang: ts
  starter: |
    function normalize(p: string): string {
      const out: string[] = [];
      for (const seg of p.split("/")) {
        if (seg === "" || seg === ".") continue;
        if (seg === "..") out.pop();
        else out.push(seg);
      }
      return "/" + out.join("/");
    }

    function safeJoin(root: string, name: string): string | null {
      const full = normalize(root + "/" + name);
      return full.startsWith(root) ? full : null;
    }

    const root = "/srv/clips/alfa";
    for (const n of ["a.mp4", "../beta/a.mp4", "/etc/hosts", "../alfa-evil/a.mp4", "a\0.mp4", "..\\..\\x"]) {
      console.log(JSON.stringify(n), "->", safeJoin(root, n));
    }
  solution: |
    function normalize(p: string): string {
      const out: string[] = [];
      for (const seg of p.split("/")) {
        if (seg === "" || seg === ".") continue;
        if (seg === "..") out.pop();
        else out.push(seg);
      }
      return "/" + out.join("/");
    }

    function safeJoin(root: string, name: string): string | null {
      if (typeof name !== "string" || name === "" || name.includes("\0") || name.includes("\\")) return null;
      if (name.startsWith("/")) return null;
      const base = normalize(root);
      const full = normalize(base + "/" + name);
      return full.startsWith(base + "/") ? full : null;
    }

    const root = "/srv/clips/alfa";
    for (const n of ["a.mp4", "../beta/a.mp4", "/etc/hosts", "../alfa-evil/a.mp4", "a\0.mp4", "..\\..\\x"]) {
      console.log(JSON.stringify(n), "->", safeJoin(root, n));
    }
  solutionNotes: |
    - Tekshiruv natijaviy normallashtirilgan yo'lda bajariladi, kiritishda emas. Shu sabab `....//` kabi qora ro'yxatni aldaydigan shakllar bu yerda ham, boshqa kodlashlarda ham bir xil qoida bilan to'xtaydi.
    - Prefiks `base + "/"` bilan solishtiriladi: `/srv/clips/alfa-evil` `/srv/clips/alfa/` bilan boshlanmaydi.
    - NUL va teskari slesh rad etiladi: ular platformaga qarab yo'lni boshqacha talqin qiladi; ildiz papkaning o'zi (`""` yoki `.`) fayl emas.
    - Qoplanmaydi: symlink (haqiqiy yo'l uchun `fs.realpath`), tekshiruv va ochish orasidagi vaqt oralig'i (60-dars), URL-kodlangan kiritishni ikki marta dekodlash (kiritishni bir marta dekodlab, keyin tekshiring), tenant bo'yicha ruxsat.
  checklist:
    - "Natijaviy yo'l ildiz + `/` prefiksi bilan tekshiriladi"
    - "Absolut yo'l, `..` ketma-ketligi va qo'shni papka rad etiladi"
    - "NUL va teskari slesh rad etiladi"
    - "Tekshiruv normallashtirishdan keyin bajariladi"
    - "Symlink va TOCTOU qoplanmasligini ayta olasiz"
---

## Muammo

Fayl yo'li ham interpreter kirishi: `/srv/clips/alfa/a.mp4` kabi satr fayl tizimiga "qaysi faylni och" deydi, `..` belgilari esa "bir daraja yuqoriga" ma'nosini beradi. Ilova `GET /clips/:name` yo'li uchun `path.join(CLIPS_DIR, name)` yozsa va `name` foydalanuvchidan kelsa, `../` ketma-ketligi yo'lni ruxsat etilgan papkadan chiqarib yuboradi. 21-darsdagi modelga mos: foydalanuvchi qiymati ma'lumot (fayl nomi) bo'lishi kerak edi, lekin yo'l sintaksisining boshqaruv belgilarini (`..`, `/`) olib kirdi.

Zaiflik oqibati odatda maxfiylik: konfiguratsiya fayllari, `.env`, boshqa tenant videolari, kalit fayllari o'qiladi. Yozish yo'lida (yuklash, arxiv ochish) ixtiyoriy joyga yozishga, ya'ni kodni almashtirishga olib kelishi mumkin. Shu sabab path traversal ko'pincha kirish nazorati muammosi sifatida qaraladi (OWASP Top 10:2025 A01 Broken Access Control kategoriyasiga CWE-22 Path Traversal, CWE-23 va CWE-36 kiritilgan).

Ikkinchi muammo: dasturchilar filtr yozadi (`replace("../", "")`) va unga ishonadi. Bunday filtrlarning aksari bir qadamda buziladi: ikki marta kodlash, boshqa slesh turi, qo'shni papka, symlink. Dars shu xatolarni ketma-ket ko'rsatadi va ularning hammasi bitta qoidaga olib kelishini aytadi: natijaviy kanonik yo'lni ildizga nisbatan tekshiring.

## Asosiy g'oya

### Ikki xil operatsiya: birlashtirish va cheklash

`path.join(a, b)` yo'llarni birlashtirib normallashtiradi: `..` va `.` ni hisobga oladi. U natija `a` ichida qolishini tekshirmaydi. `path.resolve(a, b)` mutlaq yo'l hosil qiladi, va `b` o'zi mutlaq yo'l bo'lsa (`/etc/hosts`), `a` ni tashlab yuboradi. Ikkala holatda ham ilova kutgan "ildiz ichida" xususiyati o'z-o'zidan bajarilmaydi. Bu Node.js `path` modulining hujjatlangan xatti-harakati; quyidagi modelimiz uni soddalashtirib ko'rsatadi.

Himoya formulasi: (1) kiritishni bir marta dekodlab kanonik shaklga keltirish; (2) ildiz bilan birlashtirib to'liq yo'lni normallashtirish; (3) natija ildiz + ajratkich bilan boshlanishini tekshirish; (4) ochishda haqiqiy yo'lni (symlink ochilgan) yana tekshirish. 1-3 satrlar bilan, 4 fayl tizimi bilan ishlaydi.

### Kiritish formalari

| Shakl | Misol | Nima uchun xavfli |
|---|---|---|
| Nisbiy chiqish | `../../secrets/keys.env` | `join` uni normallashtirib ildizdan chiqaradi |
| Absolut yo'l | `/srv/secrets/keys.env` | `path.resolve` ildizni tashlab yuboradi |
| Kodlangan | `%2e%2e%2f` | Framework dekodlagandan keyin `../` bo'ladi; ikki marta dekodlansa yana |
| Almashtirishni aldaydigan | `....//` | Bir marta `../` o'chirilsa `../` qoladi |
| Qo'shni papka | `../alfa-evil/a` | `startsWith(root)` tekshiruvidan o'tadi |
| Platformaga xos | `..\x`, `C:\x`, NUL | Windows'da `\` ajratkich, POSIX'da oddiy belgi; NUL: C tilidagi fayl API'lari satrni NUL'da tugatadi, tekshiruv va tizim ko'rgan yo'l farq qilishi mumkin |
| Symlink | `link -> /etc` | Satr tekshiruvi fayl tizimini ko'rmaydi |

## Chuqurroq: nozik holatlar

### Node `path` modulining hujjatlangan xatti-harakati

Himoya yo'l funksiyalari aynan nima qilishiga tayanadi, shuning uchun hujjatdagi qoidalarni bilish kerak:

- `path.join` segmentlarni platformaga xos ajratkich bilan birlashtirib, natijani normallashtiradi; uzunligi nol segmentlar e'tiborga olinmaydi. Hujjat misoli: `path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')` natijasi `/foo/bar/baz/asdf`, ya'ni oxirgi `..` bir daraja ortga qaytardi. Segmentlardan biri satr bo'lmasa `TypeError` tashlanadi: `name` satr ekani oldindan tekshirilmasa, JSON'dan kelgan obyekt 500 xato beradi.
- `path.resolve` segmentlarni o'ngdan chapga qayta ishlaydi va mutlaq yo'l hosil bo'lguncha oldingi segmentlarni qo'shib boradi. Hujjat misoli: `path.resolve('/foo', '/bar', 'baz')` natijasi `/bar/baz`. Demak mutlaq `name` ildizni butunlay tashlab yuboradi: `path.resolve(ROOT, "/etc/hosts")` `/etc/hosts` beradi. Mutlaq yo'lni oldindan rad etish (yoki `path.isAbsolute` bilan tekshirish) shu sababdan kerak.
- `path.normalize` `.` va `..` segmentlarini hal qiladi va ketma-ket ajratkichlarni bittaga keltiradi. Hujjat yana bir narsani ta'kidlaydi: `..` segmentlarini olib tashlash tizimning yo'lni hal qilish usulini o'zgartirishi mumkin. Bu symlink bilan bog'liq: satr darajasida `link/..` papkaning ota papkasiga teng, fayl tizimida esa `link` ko'rsatgan joyning ota papkasiga olib borishi mumkin. Shuning uchun normalizatsiya natijasi haqiqiy diskdagi yo'l emas, faqat satr.
- `path.relative(from, to)` ikkala yo'lni `resolve` qilib, nisbiy yo'lni qaytaradi. Bu ildiz tekshiruvining prefiksdan ishonchli varianti: natija `..` bilan boshlanmasa va `path.isAbsolute` bo'lmasa, `to` ildiz ichida. Ikkala yo'l ham mutlaq bo'lgani ma'qul: nisbiy yo'l joriy ishchi papkaga nisbatan hal qilinadi.
- `node:path` operatsion tizimga qarab Windows yoki POSIX qoidalarini tanlaydi. POSIX'da `\` oddiy fayl nomi belgisi, Windows'da esa ajratkich. Windows'da yozilgan va sinalgan tekshiruv Linux'da boshqacha ishlashi mumkin va aksincha. Tekshiruv o'zi ishlaydigan platformaga mos bo'lsin yoki kiritishdagi teskari slesh umuman rad etilsin (topshiriqdagi yechim shunday qiladi); aniq platformani tanlash kerak bo'lsa `path.posix` yoki `path.win32` ishlatiladi.
- `fs.realpath` symlink'larni hal qilib, kanonik mutlaq yo'lni beradi; yo'l mavjud bo'lmasa `ENOENT` xatosi qaytadi. Shuning uchun u mavjud bo'lmagan fayl yaratish (yozish) oldidan to'g'ridan-to'g'ri ishlamaydi: bunda mavjud ota papkaga `realpath` qo'llanadi, fayl nomi esa alohida segment sifatida tekshiriladi.

### Qora ro'yxat nega buziladi

`replace("../", "")` bitta o'tishda ishlaydi, shuning uchun almashtirishdan keyin hosil bo'lgan yangi ketma-ketlikni ko'rmaydi. Takroriy almashtirish (loop) bu hujumni yopadi, lekin `..\`, URL-kodlangan va Unicode variantlarni ham hisobga olish kerak bo'ladi. Ro'yxat har yangi shaklda kengayishi kerak, ildizga nisbatan tekshiruv esa shakldan qat'i nazar bitta. Shuning uchun natijaviy yo'lni tekshirish ustun.

### Prefiks xatosi

`full.startsWith(root)` klassik xato: `/srv/clips/alfa-evil/x` satri `/srv/clips/alfa` bilan boshlanadi. To'g'ri variant: `full.startsWith(root + "/")` yoki `path.relative(root, full)` natijasi `..` bilan boshlanmasligi va mutlaq bo'lmasligi. Ildizning o'zi (`full === root`) fayl emas, papka: u alohida holat.

### Kodlash tartibi

Express, Fastify va Next.js yo'l parametrlarini odatda dekodlaydi (`%2e%2e%2f` -> `../`). Agar siz kiritishni qo'shimcha dekodlasangiz (masalan, `decodeURIComponent` ni yana chaqirsangiz), `%252e%252e%252f` birinchi dekodlashdan keyin `%2e%2e%2f`, ikkinchisidan keyin `../` bo'ladi. Qoida: kiritishni aniq bir marta dekodlang, keyin tekshiring, so'ng ishlating (21-dars, kanonizatsiya).

### Symlink va tekshiruv/ochish oralig'i

`path.resolve` fayl tizimiga qaramaydi. Ildiz ichida hujumchi yaratgan symlink (masalan, arxiv orqali) tashqariga olib chiqishi mumkin. `fs.realpath` symlink'larni ochib haqiqiy yo'lni beradi, uni ildiz (u ham `realpath` bilan olingan) bilan solishtirish kerak. Tekshiruv va ochish orasida fayl almashtirilishi mumkin (TOCTOU, 60-dars); eng ishonchli yo'l - ochilgan file descriptor ustida ishlash yoki symlink yaratishga yo'l qo'ymaslik.

### Arxiv ochish (zip slip)

ZIP yoki TAR arxivdagi yozuv nomi ham tashqi kiritish. `join(dest, entry.name)` `../../app/x.js` yozuvida `dest` dan chiqadi. Har yozuv uchun yo'l yuqoridagi tekshiruvdan o'tishi, symlink va qattiq havola (hardlink) yozuvlari esa odatda rad etilishi kerak. Fayl yuklash umumiy xavfsizligi 74-darsda.

### Eng yaxshi yechim: yo'lni foydalanuvchiga bermaslik

Foydalanuvchi diskdagi nomni tanlamasa, traversal yo'q. Mantiqiy ID (`clipId`) bazadagi yozuvga olib boradi, yozuvda serverning o'zi hosil qilgan fayl nomi (UUID) turadi. Bunda ildizga nisbatan tekshiruv ikkinchi qatlam bo'lib qoladi.

### Fayl nomini saqlash qoidalari

Yuklangan fayllarni diskka saqlashda foydalanuvchi bergan nomni ishlatmang. Nomni server yaratadi (UUID yoki kontent xeshi), asl nom esa bazada metama'lumot sifatida saqlanadi. Mijozga yuklab olishda asl nom `Content-Disposition` sarlavhasi orqali beriladi; bu sarlavhaga qiymat qo'yishda ham kodlash kerak (HTTP sarlavhasida yangi qator va qo'shtirnoq maxsus belgilar, 11-dars). Bu ikki qaror fayl yo'li va sarlavha injection'ini bir vaqtda yopadi; yuklash xavfsizligi umumiy holda 74-darsda.

### Ruxsat tekshiruvi ikki bosqichli

Yo'lni ildiz ichida ushlash faqat bitta qatlam. Ikkinchi qatlam: fayl kimga tegishli ekanini bazadan tekshirish. Ildiz ichida bo'lgan har fayl so'rovchiga tegishli degani emas, ayniqsa ildiz papka tenant'lar uchun umumiy bo'lsa. Shuning uchun xavfsiz sxema: so'rov `clipId` ni oladi, kod bazadan `clipId` va `tenantId` bo'yicha yozuvni topadi (topilmasa 404), yozuvdagi serverda hosil qilingan fayl nomini ildiz bilan birlashtiradi va faqat undan keyin ochadi. Bu holda traversal ham, IDOR ham (52-dars) bir joyda yopiladi.

### Test qilish

Yo'l tekshiruvi funksiyasi uchun birlik testi yozing va unga hujum shakllarini kiriting: `../`, ketma-ket `../..`, mutlaq yo'l, nuqta bilan boshlanadigan nomlar, NUL belgi, teskari slesh, qo'shni papka nomi, juda uzun nom. Har holat uchun kutilgan natija aniq (qabul yoki rad), shuning uchun regressiya tez ushlanadi. Bu darsdagi `safeJoin` topshirig'i shu testlarning kichik namunasi.

## Misol: mini fayl tizimida

Haqiqiy diskka tegmaslik uchun xotiradagi fayl tizimi modeli: `fs` xarita, `normalize` esa POSIX `path.normalize` ga o'xshash sof funksiya.

### 1. Zaif kod

```ts run
function normalize(p: string): string {
  const out: string[] = [];
  for (const seg of p.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return "/" + out.join("/");
}
const join = (...parts: string[]) => normalize(parts.join("/"));

const fs = new Map<string, string>([
  ["/srv/clips/alfa/a.txt", "alfa klip metama'lumoti"],
  ["/srv/clips/alfa-evil/x.txt", "qo'shni papka"],
  ["/srv/clips/beta/b.txt", "beta mijoz klipi"],
  ["/srv/secrets/keys.env", "KEY=supersecret"],
]);
const ROOT = "/srv/clips/alfa";

// ZAIF 1: join natija ildizda qolishini tekshirmaydi
function readWeak(name: string): string {
  return fs.get(join(ROOT, name)) ?? "topilmadi";
}
// ZAIF 2: "tuzatish": bir marta ../ o'chirish
function readFiltered(name: string): string {
  return fs.get(join(ROOT, name.replace("../", ""))) ?? "topilmadi";
}
// ZAIF 3: prefiks tekshiruvi ajratkichsiz
function readPrefix(name: string): string {
  const full = join(ROOT, name);
  return full.startsWith(ROOT) ? fs.get(full) ?? "topilmadi" : "rad etildi";
}

console.log("oddiy:", readWeak("a.txt"));
```

```text
oddiy: alfa klip metama'lumoti
```

### 2. Hujum

"alfa" foydalanuvchisi `name` parametrini o'zgartiradi. Uchta holat uchta zaif funksiyaga qarshi, faqat shu o'quv fayl tizimida.

```ts run
function normalize(p: string): string {
  const out: string[] = [];
  for (const seg of p.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return "/" + out.join("/");
}
const join = (...parts: string[]) => normalize(parts.join("/"));
const fs = new Map<string, string>([
  ["/srv/clips/alfa/a.txt", "alfa klip metama'lumoti"],
  ["/srv/clips/alfa-evil/x.txt", "qo'shni papka"],
  ["/srv/clips/beta/b.txt", "beta mijoz klipi"],
  ["/srv/secrets/keys.env", "KEY=supersecret"],
]);
const ROOT = "/srv/clips/alfa";
const readWeak = (name: string) => fs.get(join(ROOT, name)) ?? "topilmadi";
const readFiltered = (name: string) => fs.get(join(ROOT, name.replace("../", ""))) ?? "topilmadi";
const readPrefix = (name: string) => {
  const full = join(ROOT, name);
  return full.startsWith(ROOT) ? fs.get(full) ?? "topilmadi" : "rad etildi";
};

console.log("1) ../:        ", readWeak("../../secrets/keys.env"));
console.log("2) filtr:      ", readFiltered("....//....//secrets/keys.env"));
console.log("3) qo'shni:    ", readPrefix("../alfa-evil/x.txt"));
console.log("   beta bilan: ", readPrefix("../beta/b.txt"));
```

```text
1) ../:         KEY=supersecret
2) filtr:       topilmadi
3) qo'shni:     qo'shni papka
   beta bilan:  rad etildi
```

Birinchi hujumda `join` ikki daraja yuqoriga chiqib maxfiy fayl qiymatini qaytardi. Ikkinchisida `....//` dan bir marta `../` o'chirilgach `../` qoldi va filtr aldandi. Uchinchisida `startsWith(ROOT)` qo'shni `alfa-evil` papkasini ildiz ichida deb hisobladi; boshqa tenant (`beta`) esa to'g'ri rad etildi, chunki prefiks mos kelmadi. Haqiqiy loyihada `alfa-evil` o'rniga tenant ID'si ba'zan boshqasining prefiksi bo'lishi mumkin (`acme` va `acme2`).

### 3. Tuzatilgan kod

```ts run
function normalize(p: string): string {
  const out: string[] = [];
  for (const seg of p.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return "/" + out.join("/");
}
const fs = new Map<string, string>([
  ["/srv/clips/alfa/a.txt", "alfa klip metama'lumoti"],
  ["/srv/clips/alfa-evil/x.txt", "qo'shni papka"],
  ["/srv/clips/beta/b.txt", "beta mijoz klipi"],
  ["/srv/secrets/keys.env", "KEY=supersecret"],
]);

function safeJoin(root: string, name: string): string | null {
  if (typeof name !== "string" || name === "" || name.includes("\0") || name.includes("\\")) return null;
  if (name.startsWith("/")) return null;
  const base = normalize(root);
  const full = normalize(base + "/" + name);
  return full.startsWith(base + "/") ? full : null;
}
function read(root: string, name: string): string {
  const p = safeJoin(root, name);
  return p === null ? "rad etildi" : fs.get(p) ?? "topilmadi";
}

const ROOT = "/srv/clips/alfa";
for (const n of ["a.txt", "../../secrets/keys.env", "....//....//secrets/keys.env", "../alfa-evil/x.txt", "/srv/secrets/keys.env", "a\0.txt"]) {
  console.log(JSON.stringify(n).padEnd(34), read(ROOT, n));
}
```

```text
"a.txt"                            alfa klip metama'lumoti
"../../secrets/keys.env"           rad etildi
"....//....//secrets/keys.env"     topilmadi
"../alfa-evil/x.txt"               rad etildi
"/srv/secrets/keys.env"            rad etildi
"a\u0000.txt"                      rad etildi
```

Nima uchun yetarli: invariant "ochiladigan yo'l normallashtirilgan holda ildiz + `/` bilan boshlanadi" hisoblangan natijaga nisbatan tekshirildi, shuning uchun hujum qanday shaklda yozilganidan qat'i nazar (`../`, `....//` oxirida `..` ga aylanadigan variantlar) hisoblangan yo'l ildizdan chiqsa rad etiladi. Qo'shni papka prefiks `/` bilan to'xtatildi. Absolut yo'l, NUL va teskari slesh alohida rad etiladi. `....//` kiritishi hech qanday maxsus ishlov talab qilmadi: normalizatsiya uni oddiy nom segmenti `....` deb o'qidi (u fayl nomi sifatida bor-yo'q bo'lishi mumkin, lekin ildiz ichida qoladi). Yopilmagan: symlink (haqiqiy yo'l), tekshiruv/ochish vaqt oralig'i (60-dars), kiritishni oldin ikki marta dekodlash, tenant bo'yicha ruxsat tekshiruvi (51-58-darslar) va Windows xususiyatlari (drayv harflari, zahiralangan nomlar) bu modelda yo'q.

### Mashq: ildiz ichidami?

Quyidagi `isInside(root, full)` ikkala yo'l allaqachon normallashtirilgan mutlaq yo'l deb faraz qiladi va `full` ildiz papka ichidagi fayl yo'limi, shuni aytadi. Hozir u klassik prefiks xatosini takrorlaydi. Tuzating: qo'shni papka, ildizning o'zi va ildiz oxiridagi ortiqcha `/` to'g'ri hal qilinsin. "Run" tugmasi testlarni ishga tushiradi.

```ts run
// root va full - normallashtirilgan mutlaq yo'llar (".." yo'q).
// full root papkasining ICHIDAGI yo'l bo'lsagina true. root'ning o'zi ichida emas.
function isInside(root: string, full: string): boolean {
  return full.startsWith(root);
}
```

```ts test
check("ildiz ichidagi fayl", () => isInside("/srv/clips/alfa", "/srv/clips/alfa/a.mp4") === true);
check("chuqur ichki fayl", () => isInside("/srv/clips/alfa", "/srv/clips/alfa/2026/a.mp4") === true);
check("qo'shni papka (alfa-evil) ichida emas", () => isInside("/srv/clips/alfa", "/srv/clips/alfa-evil/x.mp4") === false);
check("ildizning o'zi ichida emas", () => isInside("/srv/clips/alfa", "/srv/clips/alfa") === false);
check("ota papka ichida emas", () => isInside("/srv/clips/alfa", "/srv/clips") === false);
check("ildiz oxirida / bo'lsa ham ishlaydi", () => isInside("/srv/clips/alfa/", "/srv/clips/alfa/a.mp4") === true);
check("ildiz oxirida / bo'lsa qo'shni papka baribir rad", () => isInside("/srv/clips/alfa/", "/srv/clips/alfa-evil/x.mp4") === false);
```

## Qachon qo'llamaslik kerak

- Allow-list nomlar yetarli bo'lsa, yo'l tekshiruvi ortiqcha. Agar fayl nomlari bazadan olingan UUID'lar bo'lsa, `UUID` regexi bilan tekshirish yo'l tekshiruvidan oddiyroq.
- Satr bo'yicha tekshiruvga to'liq ishonmang, agar ildiz ichida foydalanuvchi symlink yarata olsa. Bunday muhitda (umumiy papka, arxiv ochish) `realpath` va symlink'ni taqiqlash kerak. Faqat satr tekshiruvi yetarli deb hisoblash noto'g'ri.
- Statik fayllar uchun yo'lni qo'lda tekshirmang: Express `express.static`, `res.sendFile(name, { root })` va Fastify static plagini bunday tekshiruvni o'zi bajaradi (ular yo'lni ildizga nisbatan hal qiladi va undan chiqib ketadigan so'rovni rad etadi). O'z tekshiruvingiz faqat ularning o'rniga yozilganda kerak.
- Qora ro'yxat filtrini ikkinchi qatlam sifatida ham yozmang. U noto'g'ri ishonch beradi va yo'lga qarab xato ishlaydi.

## Stack'da: Express, Fastify, Next.js

Node.js'da ikki holatda yo'l qo'lda tekshiriladi: o'z fayl endpoint'ingiz va arxiv ochish. Quyidagi kod ishga tushirilmaydi (`fs` va `path` brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi tekshirilgan.

```ts
import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";

const CLIPS = "/srv/clips";

export async function openClip(tenantId: string, name: string) {
  if (name.includes("\0") || path.isAbsolute(name)) return null;

  const root = await realpath(path.join(CLIPS, tenantId)); // tenantId sessiyadan
  const candidate = path.resolve(root, name);
  if (!candidate.startsWith(root + path.sep)) return null;

  const real = await realpath(candidate).catch(() => null); // symlink ochiladi
  if (!real || !real.startsWith(root + path.sep)) return null;

  const info = await stat(real);
  if (!info.isFile()) return null;
  return createReadStream(real);
}
```

Bu yerda `tenantId` serverdagi sessiyadan keladi, ildiz va nomzod yo'l `realpath` bilan solishtiriladi, prefiks `path.sep` bilan tekshiriladi. `realpath` va `createReadStream` orasida fayl almashtirilishi mumkin (TOCTOU); yuqori xavfli joylarda faylni avval `open` qilib, file descriptor ustida `fstat` va o'qish bilan ishlang. Next.js route handler'larida ham xuddi shu funksiya ishlatiladi; dinamik segment `[...path]` massiv beradi, uni `join` ga bermang, alohida tekshiring.

## Xulosa

- Path traversal - foydalanuvchi qiymatidagi yo'l boshqaruv belgilari (`..`, `/`) ildizdan chiqarib yuborishi. `path.join` va `path.resolve` buni o'zi to'xtatmaydi.
- Qora ro'yxat filtrlar (`replace("../", "")`) bir qadamda buziladi. Tekshiruv natijaviy normallashtirilgan yo'lda bajariladi.
- Prefiks tekshiruvi `root + sep` bilan, aks holda qo'shni papka o'tib ketadi.
- Kiritishni bir marta dekodlab kanonik shaklga keltiring; NUL, teskari slesh va absolut yo'llarni rad eting.
- Symlink va zip slip holatlarida satr tekshiruvi yetmaydi: `realpath`, symlink'ni rad etish va har arxiv yozuvini tekshirish kerak.
- Eng ishonchli yechim - foydalanuvchiga yo'l bermaslik: ID bo'yicha bazadan serverda yaratilgan nomni olish.
