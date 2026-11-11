---
n: 25
slug: command-injection
title: "Command injection va child_process"
summary: "OS command injection: `exec` buyruq matnini shell'ga beradi, shuning uchun foydalanuvchi qiymati qo'shimcha buyruq bo'la oladi. Dars shell va execFile farqini, argument injection'ni (`-` bilan boshlanuvchi qiymatlar), allow-list va `--` terminatorini mini shell modelida ko'rsatadi."
duration: 45
sources:
  - id: t10-a05
    note: "A05 Injection: OS command injection oilaga kiradi; sahifadagi uchinchi stsenariy buyruq satriga qo'shilgan domen orqali ixtiyoriy buyruq bajarilishini ko'rsatadi"
  - id: node-security
    note: "Node child_process hujjati va deprecations (DEP0190): exec shell ishga tushiradi va ishonchsiz kiritishni bermaslik ogohlantirishi, execFile va spawn default shell'siz, shell bilan args massivi escape qilinmay probel bilan ulanadi; timeout default 0, maxBuffer default 1 MiB, Windows'da .bat/.cmd. Node Security Best Practices umumiy manba"
  - id: cs-input
    note: "Input Validation Cheat Sheet: ijobiy (allow-list) validatsiya va rad etish g'oyasi"
  - id: asvs
    note: "ASVS 5.0.0 talab 1.2.5: ilova OS command injection'dan himoyalangan bo'lishi, OS chaqiruvlari parametrlangan yoki kontekstli kodlangan bo'lishi kerak (Level 1)"
quiz:
  - q: "`exec(`tar -czf out.tgz clips/${name}`)` kodida `name = \"a.mp4; id\"`. Nima uchun ikkinchi buyruq bajariladi?"
    options:
      - "`tar` o'zi `;` ni tushunadi"
      - "Node.js `;` ni ikkita chaqiruvga ajratadi"
      - "`exec` buyruq matnini shell'ga beradi va shell `;` ni buyruq ajratkichi sifatida o'qiydi"
      - "`name` juda uzun"
    answer: 2
    explain: "`exec` shell (masalan, /bin/sh) orqali ishlaydi; shell butun satrni tahlil qiladi va `;`, `&&`, `|`, `$()` kabi belgilarni sintaksis deb biladi. `tar` va Node bu belgilarni ko'rmaydi."
  - q: "`execFile(\"tar\", [\"-czf\", \"out.tgz\", name])` ga o'tilganda `name = \"a.mp4; id\"` bilan nima bo'ladi?"
    options:
      - "Shell bo'lmagani uchun `;` oddiy belgi: `tar` bitta argument olib, shu nomli fayl topilmasligi haqida xato beradi"
      - "Hujum baribir ishlaydi"
      - "Node xato tashlaydi"
      - "`tar` `;` dan keyingi qismni buyruq sifatida bajaradi"
    answer: 0
    explain: "`execFile` shell ishga tushirmaydi: argumentlar massivi to'g'ridan-to'g'ri jarayonga uzatiladi. `;` shell sintaksisi, `tar` uchun esa fayl nomidagi oddiy belgi."
  - q: "`execFile(\"grep\", [\"-c\", term, \"log.txt\"])`, `term = \"--file=/etc/hosts\"`. Shell yo'q. Nega bu hali ham muammo?"
    options:
      - "Muammo yo'q: shell yo'q"
      - "`grep` `-` bilan boshlanuvchi argumentni qiymat emas, opsiya deb o'qiydi (argument injection)"
      - "`grep` hech narsani o'qimaydi"
      - "Faqat Windows'da muammo"
    answer: 1
    explain: "Argument injection: kiritish shell sintaksisini emas, dasturning o'z opsiyalar sintaksisini boshqaradi. Yopish: opsiyani aniq qiymat bilan berish (`-e term`), `--` terminatori yoki `-` bilan boshlanadigan qiymatlarni rad etish."
  - q: "`exec(cmd)` o'rniga `spawn(cmd, args, { shell: true })` yozildi. Xavfsizlik uchun nimani anglatadi?"
    options:
      - "Xavfsizroq: spawn ishlatilgan"
      - "Xavfsizroq: args massivi bor"
      - "Faqat Linux'da xavfli"
      - "`shell: true` shell'ni qaytaradi: massiv shell qatoriga birlashtiriladi va injection yana mumkin"
    answer: 3
    explain: "`shell: true` bilan spawn ham shell orqali ishlaydi. Massiv ko'rinishi yolg'on xavfsizlik hissini beradi: bu holda argumentlar shell qatoriga yig'iladi. Xavfsiz shakl `shell: false` (default)."
  - q: "Fayl nomi sifatida `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` allow-list ishlatiladi va natija `execFile` ga uzatiladi. Qaysi hujum yopilmaydi?"
    options:
      - "`;` va `|` bilan buyruq qo'shish"
      - "`-x` kabi opsiya sifatida o'qilish"
      - "Boshqa foydalanuvchining fayli nomini berish (`b-secret.mp4`): ruxsat tekshiruvi hal qilinmagan"
      - "Bo'sh joy bilan argument ajratish"
    answer: 2
    explain: "Regex shell belgilari va `-` bilan boshlanishni yopadi, lekin nom boshqa tenant faylini ko'rsatsa, bu authorization (51-58-darslar) va fayl yo'li (26-dars) masalasi."
  - q: "Quyidagilardan qaysi biri command injection'ga eng ishonchli yechim?"
    options:
      - "Buyruq satridagi `;` va `&` belgilarini o'chirish"
      - "Kerakli ishni shell chaqirmaydigan kutubxona yoki API bilan bajarish; imkon bo'lmasa `execFile` + massiv + allow-list"
      - "Faqat kichik harflarga o'tkazish"
      - "Buyruqni `try/catch` ichiga olish"
    answer: 1
    explain: "Eng yaxshi yo'l - tashqi jarayonni umuman chaqirmaslik. Chaqirish kerak bo'lsa, shell'siz massiv bilan va kirishni toraytirib. Belgi o'chirish to'liq ro'yxatni talab qiladi (shell'da juda ko'p ajratkichlar bor), try/catch esa mexanizmga ta'sir qilmaydi."
task:
  title: "Arxivlash buyrug'i: shell'dan massivga o'tish"
  prompt: |
    Platforma mijoz so'rovi bilan klip arxivini yasaydi: `archiveCommand(name)` jarayonni ishga tushirish uchun `{ file, args }` qaytaradi (keyinchalik `execFile(file, args)` ga beriladi). Hozir u shell orqali `sh -c "tar czf out.tgz clips/<name>"` shaklini yasaydi.

    Tuzating: shell ishlatilmasin (`file` - `tar`, `args` massivida har qiymat alohida), `name` faqat `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$` ga mos bo'lsa qabul qilinsin (aks holda xato tashlansin), arxiv yo'li va `name` ni `--` terminatoridan keyin bering: `["-czf", "out.tgz", "--", "clips/" + name]`. Imzoni o'zgartirmang. Oxirgi chiqish: oddiy nom uchun JSON natija, `a.mp4; id` va `-x` uchun `rad etildi`.
  lang: ts
  starter: |
    type Spawn = { file: string; args: string[] };

    function archiveCommand(name: string): Spawn {
      return { file: "sh", args: ["-c", `tar czf out.tgz clips/${name}`] };
    }

    function show(name: string): string {
      try {
        const s = archiveCommand(name);
        return s.file === "sh" ? "SHELL: " + s.args[1] : JSON.stringify(s);
      } catch {
        return "rad etildi";
      }
    }

    console.log(show("a.mp4"));
    console.log(show("a.mp4; id"));
    console.log(show("-x"));
  solution: |
    type Spawn = { file: string; args: string[] };

    const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

    function archiveCommand(name: string): Spawn {
      if (!NAME.test(name)) throw new Error("noto'g'ri nom");
      return { file: "tar", args: ["-czf", "out.tgz", "--", "clips/" + name] };
    }

    function show(name: string): string {
      try {
        const s = archiveCommand(name);
        return s.file === "sh" ? "SHELL: " + s.args[1] : JSON.stringify(s);
      } catch {
        return "rad etildi";
      }
    }

    console.log(show("a.mp4"));
    console.log(show("a.mp4; id"));
    console.log(show("-x"));
  solutionNotes: |
    - Shell'ni olib tashlash `;`, `|`, `$()` kabi butun sinfni yopadi: argumentlar massivi jarayonga to'g'ridan-to'g'ri uzatiladi.
    - Allow-list regex `-` bilan boshlanuvchi nomlarni, bo'sh joyni, `/` va shell belgilarini rad etadi. Birinchi belgi harf yoki raqam bo'lgani uchun `..` ham mos kelmaydi; baribir fayl yo'llari bilan ishlash alohida mavzu (26-dars).
    - `--` terminatori qolgan argumentlarni opsiya sifatida o'qishni to'xtatadi. Bu ikkinchi qatlam: nom `-` bilan boshlanmasa ham foydali.
    - Qoplanmaydi: `name` boshqa tenant faylini ko'rsatishi (authorization), katta fayllar bilan resurs sarfi (timeout va maxBuffer sozlamalari), `tar` o'z xatolari.
  checklist:
    - "`file` shell emas, aniq dastur (`tar`)"
    - "Har argument alohida massiv elementi"
    - "Nom allow-list regex bilan tekshiriladi, mos kelmasa xato"
    - "`--` terminatori yo'l oldidan keladi"
    - "Tuzatish qoplamaydigan narsalarni (authorization, resurs) ayta olasiz"
---

## Muammo

Backend dasturchi ba'zan tashqi dastur chaqirishga majbur bo'ladi: video klipdan kadr olish (`ffmpeg`), arxivlash (`tar`), PDF yaratish, fayl turini aniqlash (`file`), Git buyrug'i. Node.js'da buning eng qisqa yo'li `exec("ffmpeg -i " + path + " out.jpg")`. U ishlaydi, kamida bitta test fayl bilan. Muammo shundaki, `exec` buyruq matnini shell'ga beradi, shell esa o'zining katta sintaksisiga ega: `;`, `&&`, `|`, `$()`, backtick, `>` va boshqalar. Yo'l yoki fayl nomida shulardan biri bo'lsa, ikkinchi buyruq bajariladi.

Command injection'ning oqibati boshqa injection turlaridan og'irroq: SQL injection bazadagi ma'lumotga, XSS brauzerga yetadi, buyruq injection esa serverning o'zida kod bajarilishiga olib keladi. Shu sabab OS command injection hujumi ko'pincha serverdagi hamma narsaga (muhit o'zgaruvchilari, secret'lar, boshqa tenant fayllari, ichki tarmoq) kirishga aylanadi. Ikkinchi muammo: ko'p dasturchi `exec` dan `spawn` yoki `execFile` ga o'tib, "xavfsiz bo'ldim" deb o'ylaydi, lekin argument injection va `shell: true` hali ham ochiq.

Dars shell'ning qanday buyruqlarni ajratishini kichik modelda ko'rsatadi (haqiqiy buyruq ishga tushirilmaydi: o'quv kodi faqat "nima ishga tushar edi" ro'yxatini chop etadi), keyin `execFile`, argument terminatori, allow-list va jarayon sozlamalarini ko'radi.

## Asosiy g'oya

### Shell ikkinchi interpreter

21-darsdagi modelga qaytsak: `exec(line)` da interpreter shell (`/bin/sh -c line`). Boshqaruv belgilari: buyruq ajratkichlari (`;`, `&&`, `||`, `|`, yangi qator), almashtirishlar (`$(...)`, backtick), qayta yo'naltirish (`>`, `<`), o'zgaruvchi kengaytirish (`$VAR`), glob (`*`, `?`) va qo'shtirnoq qoidalari. Foydalanuvchi qiymati shu satrga qo'shilsa, qiymat ichidagi har bir belgi ushbu sintaksisning ishtirokchisi.

Node.js `child_process` API'lari ikki guruhga bo'linadi:

| API | Shell | Argumentlar | Xavf |
|---|---|---|---|
| `exec`, `execSync` | Ha | Bitta buyruq matni | Yuqori: matn yig'ish injection beradi |
| `execFile`, `execFileSync` | Yo'q | Massiv | Past; argument injection qoladi |
| `spawn`, `spawnSync` | Default yo'q (`shell: false`) | Massiv | Past; `shell: true` bilan yuqori |
| `fork` | Yo'q | Massiv (Node skript) | Past; argumentlar skriptga boradi |

Bu jadval Node `child_process` hujjatiga mos: `exec` shell ishga tushiradi va hujjat unga ishonchsiz kiritishni hech qachon bermaslikni, shell metabelgilari ixtiyoriy buyruq bajartirishi mumkinligini aytadi; `execFile` va `spawn` default holda shell'siz. `fork` ham `shell` opsiyasini qo'llamaydi: u berilsa e'tiborga olinmaydi.

### Himoya ierarxiyasi

ASVS 5.0.0 ning 1.2.5 talabi (Level 1) ham shuni so'raydi: ilova OS command injection'dan himoyalangan, operatsion tizim chaqiruvlari parametrlangan yoki kontekstli kodlangan bo'lishi kerak.

1. Tashqi jarayonni umuman chaqirmang: ko'p ish uchun Node kutubxonasi bor (rasm uchun `sharp`, arxiv uchun `archiver`, fayl turini aniqlash uchun magic-bytes kutubxonasi). Kutubxona chaqirilsa, shell va opsiyalar sintaksisi yo'q.
2. Chaqirish kerak bo'lsa: `execFile`/`spawn`, `shell: false`, har argument alohida massiv elementi.
3. Argument injection'ni yoping: `-` bilan boshlanadigan qiymatlarni rad eting yoki opsiyani aniq berib (`-e pattern`) qiymatni unga bog'lang, hamda `--` terminatori ishlating.
4. Kirishni allow-list bilan toraytiring (nom uchun regex, enum, ro'yxat).
5. Jarayon muhitini cheklang: `cwd`, minimal `env` (butun `process.env` ni uzatmang: secret'lar bolaga o'tadi), `timeout`, `maxBuffer`, imkon bo'lsa alohida foydalanuvchi huquqi.

## Chuqurroq: nozik holatlar

### `shell: true` yashirin shell

`spawn(cmd, args, { shell: true })` shell orqali ishlaydi, shuning uchun massiv ko'rinishi himoya qilmaydi. Node deprecation ro'yxatidagi DEP0190 aynan shu holatni tasvirlaydi: `execFile` yoki `spawn` ga `args` massivi `{ shell: true }` (yoki shell yo'li) bilan berilsa, qiymatlar escape qilinmaydi, faqat probel bilan ulanadi va bu shell injection'ga olib kelishi mumkin. Node 24.0.0 dan bu runtime deprecation, ya'ni kod ishga tushganda ogohlantirish chiqadi. Node'da `shell` opsiyasi hujjatlangan; uni `true` qilish uchun yagona asos chindan shell xususiyatlari (pipe, glob) kerak bo'lishi, bunday hollarda esa har qiymat allow-list orqali o'tishi kerak. Oddiy qoida: `shell: true` ni code review'da to'xtatuvchi belgi deb qarang.

### Argument injection

Shell yo'q bo'lsa ham, dastur o'z argumentlarini tahlil qiladi va `-` bilan boshlanuvchi qiymatni opsiya deb o'qiydi. `grep -c ${term} log` da `term = "--file=/etc/hosts"` bo'lsa, `grep` kiritishni qidiruv so'zi sifatida emas, opsiya sifatida oladi. Ko'p dasturlarda bu mexanizm bor, shuning uchun har tashqi dastur uchun uning opsiyalar sintaksisi o'rganiladi. Yechimlar: `--` terminatori (GNU uslubidagi dasturlarda opsiyalar tugaydi), qiymatni opsiyaga bog'lash (`-e pattern`), `-` bilan boshlanadigan qiymatni rad etish.

### Blind va out-of-band

Buyruq natijasi javobda qaytmasa ham, injection ishlashi mumkin. Hujumchi vaqt kechikishi yoki tashqi so'rov (DNS, HTTP) orqali bajarilganini aniqlaydi (22-darsdagi blind turlarga o'xshash). Shuning uchun "javobda natija yo'q, demak xavf yo'q" xulosasi noto'g'ri.

### Muhit va yo'l

Foydalanuvchi muhit o'zgaruvchisini (`PATH`, `NODE_OPTIONS`, `LD_PRELOAD` kabi) belgilay olsa, jarayon boshqa dastur yoki kutubxona yuklaydi. Bolaga `env` ni qo'lda, ro'yxat bilan bering. Dastur nomini ham mutlaq yo'l bilan bering (`/usr/bin/tar`), shunda `PATH` orqali almashtirish ishlamaydi.

### Windows

Node hujjati "execFile shell'siz ishlaydi" qoidasi Windows'da o'zgarishini alohida yozadi: `.bat` va `.cmd` fayllar terminalsiz bajarilmaydi, shuning uchun ularni `execFile` bilan ishga tushirib bo'lmaydi. Ular `exec` bilan, `cmd.exe /c` ni to'g'ridan-to'g'ri `spawn` qilish bilan yoki `spawn` ga `shell` opsiyasini berish bilan ishga tushiriladi (oxirgisi DEP0190 sababli tavsiya etilmaydi). Ya'ni Windows'da skript chaqirish shell'ga tushib qolishi mumkin va allow-list talabi kuchayadi: bunday chaqiruvga foydalanuvchi qiymatini hech qachon bermang, skript nomi va argumentlari kodda qat'iy bo'lsin.

### Jarayonga resurs chegarasi

Hujjatga ko'ra `exec` va `execFile` uchun `timeout` default qiymati `0`, ya'ni chegara yo'q: `timeout` berilmasa osilib qolgan bolaga hech narsa tegmaydi. `timeout` noldan katta bo'lsa, ota jarayon vaqt tugagach `killSignal` (default `SIGTERM`) yuboradi. `maxBuffer` default 1 MiB: stdout yoki stderr undan oshsa bola jarayon to'xtatiladi va chiqish qirqiladi. Bu ikki sozlamani ochiq yozing, aks holda bitta og'ir so'rov (masalan, katta klipni arxivlash) mavjudlikni buzadi (rate limit va resurs chegaralari 73-darsda). `spawn` bilan ishlaganda stdout oqimini o'qimasangiz, hujjatga ko'ra quvur (pipe) to'lib, bola jarayon blokirovka bo'ladi; chiqish kerak bo'lmasa `{ stdio: 'ignore' }` ishlating. Yana bir nozik joy: `env` berilganda dastur nomi shu `env.PATH` bo'yicha qidiriladi, `env` PATH'siz berilsa Unix'da default qidiruv yo'li (`/usr/bin:/bin`) ishlatiladi. Shuning uchun mutlaq yo'l ham, `env` ham aniq berilgani ma'qul. `uid` opsiyasi bola jarayon foydalanuvchi identifikatorini o'zgartirish imkonini beradi: jarayon Node ilovasidan kamroq huquq bilan ishlaydi.

### Ma'lumotni argument o'rniga stdin orqali

Katta yoki erkin matnni (masalan, hisobot matni, JSON) tashqi dasturga argument sifatida emas, standart kirish (stdin) orqali uzatish argument injection va buyruq satri uzunligi cheklovlarini chetlab o'tadi. Dastur stdin'ni ma'lumot sifatida o'qiydi va unda opsiya sintaksisi yo'q. `execFile` bilan bu `child.stdin.end(data)` ko'rinishida bajariladi. Bu har dastur uchun mos emas (ba'zilari faqat argument qabul qiladi), lekin mumkin bo'lganda qulay va xavfsiz.

### Chiqishni qayta ishlash

Tashqi dasturning chiqishi ham ishonchsiz kirish bo'lishi mumkin: u fayl nomlarini yoki foydalanuvchi matnini o'z ichiga oladi (masalan, `git log` chiqishidagi commit xabarlari). Uni keyin HTML'ga, SQL'ga yoki boshqa buyruqqa qo'shsangiz, yana kontekstli kodlash kerak (ikkinchi tartibli injection, 21-dars). Chiqish hajmini `maxBuffer` bilan cheklang, aks holda katta chiqish xotirani to'ldiradi.

### Code review ro'yxati

Review'da quyidagilarni qidiring: `exec`, `execSync`, `spawn` bilan `shell: true`, `child_process` import'i bor har fayl, shablon satr ichidagi buyruq, `process.env` ni to'liq uzatish, vaqt cheklovi (`timeout`) yo'qligi, mutlaq yo'lsiz dastur nomi. Har topilma uchun ikki savol: buyruq nomi va argumentlar qaerdan keladi, va ular foydalanuvchi qo'lida emasmi? Bu qidiruvni SAST qoidasiga aylantirish mumkin (83-dars).

## Misol: mini shell modelida

O'quv kodi haqiqiy buyruq ishga tushirmaydi. U shell qanday ajratishini taqlid qiladi: satrni buyruqlarga bo'ladi (`;`, `&&`, `||`, `|` va `$(...)`, backtick ichidagi buyruqlar) va nima bajarilishini ro'yxat qiladi. Ikkinchi funksiya `execFile` modelini ko'rsatadi: bitta dastur va argumentlar ro'yxati.

### 1. Zaif kod

```ts run
// Soddalashtirilgan shell: qo'shtirnoqsiz matn, ';' '&&' '||' '|' ajratkichlari, $(...) va `...` ichidagi buyruqlar
function shellCommands(line: string): string[][] {
  const out: string[][] = [];
  const nested = [...line.matchAll(/\$\(([^)]*)\)|`([^`]*)`/g)];
  for (const m of nested) out.push(...shellCommands(m[1] ?? m[2]));
  const main = line.replace(/\$\([^)]*\)|`[^`]*`/g, "");
  for (const part of main.split(/;|&&|\|\||\|/)) {
    const words = part.trim().split(/\s+/).filter(Boolean);
    if (words.length) out.push(words);
  }
  return out;
}
const show = (cmds: string[][]) => cmds.map((c) => c.join(" ")).join("  ||  ");

// exec modeli: bitta matn shell'ga beriladi
function execModel(line: string) {
  return shellCommands(line);
}

// ZAIF: mijoz nomi buyruq matniga qo'shiladi
function archiveWeak(name: string) {
  return execModel(`tar -czf out.tgz clips/${name}`);
}

console.log("oddiy:", show(archiveWeak("a.mp4")));
```

```text
oddiy: tar -czf out.tgz clips/a.mp4
```

### 2. Hujum

Hujumchi "alfa" foydalanuvchisi, `name` maydoniga klip nomi o'rniga shell belgisi bilan qo'shimcha buyruq yuboradi. Bu yerda faqat model: u bajarilishi mumkin bo'lgan buyruqlarni chop etadi, hech narsa ishga tushmaydi.

```ts run
function shellCommands(line: string): string[][] {
  const out: string[][] = [];
  const nested = [...line.matchAll(/\$\(([^)]*)\)|`([^`]*)`/g)];
  for (const m of nested) out.push(...shellCommands(m[1] ?? m[2]));
  const main = line.replace(/\$\([^)]*\)|`[^`]*`/g, "");
  for (const part of main.split(/;|&&|\|\||\|/)) {
    const words = part.trim().split(/\s+/).filter(Boolean);
    if (words.length) out.push(words);
  }
  return out;
}
const show = (cmds: string[][]) => cmds.map((c) => c.join(" ")).join("  ||  ");
const archiveWeak = (name: string) => shellCommands(`tar -czf out.tgz clips/${name}`);

console.log("; bilan:   ", show(archiveWeak("a.mp4; id")));
console.log("&& bilan:  ", show(archiveWeak("a.mp4 && printenv")));
console.log("$() bilan: ", show(archiveWeak("$(whoami).mp4")));
```

```text
; bilan:    tar -czf out.tgz clips/a.mp4  ||  id
&& bilan:   tar -czf out.tgz clips/a.mp4  ||  printenv
$() bilan:  whoami  ||  tar -czf out.tgz clips/.mp4
```

Har holatda ro'yxatda dasturchi yozmagan buyruq (`id`, `printenv`, `whoami`) paydo bo'ldi: kiritilgan qiymat shell uchun sintaksis bo'lib chiqdi. Haqiqiy tizimda bu buyruqlar Node jarayoni huquqi bilan bajarilardi, ya'ni uning muhit o'zgaruvchilari va fayllariga ham kirish bo'lardi. Hujum faqat shu o'quv modeliga qarshi.

### 3. Tuzatilgan kod

Tuzatish ikki bosqichli. Birinchi: shell chaqirmaslik, dastur va argumentlar massivi. Ikkinchi: argument injection'ga qarshi opsiyalar tahlilchisi modeli (`-e` qiymat oladi, `--` dan keyin hammasi oddiy argument) va allow-list.

```ts run
type Spawn = { file: string; args: string[] };

// execFile modeli: shell yo'q, argumentlar ro'yxati to'g'ridan-to'g'ri dasturga boradi
function parseOptions(args: string[]) {
  const opts: string[] = [], rest: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--") { rest.push(...args.slice(i + 1)); break; }
    if (a === "-e") { rest.push(args[++i]); continue; } // -e qiymat oladi
    if (a.startsWith("-")) opts.push(a); else rest.push(a);
  }
  return { opts, rest };
}

const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;
function archive(name: string): Spawn {
  if (!NAME.test(name)) throw new Error("noto'g'ri nom");
  return { file: "tar", args: ["-czf", "out.tgz", "--", "clips/" + name] };
}
function searchLog(term: string): Spawn {
  return { file: "grep", args: ["-c", "-e", term, "--", "app.log"] };
}
const tryRun = (f: () => Spawn) => { try { return JSON.stringify(f()); } catch (e) { return "rad etildi: " + (e as Error).message; } };

console.log(tryRun(() => archive("a.mp4")));
console.log(tryRun(() => archive("a.mp4; id")));
console.log(tryRun(() => archive("$(whoami).mp4")));
const s = searchLog("--file=/etc/hosts");
console.log(JSON.stringify(parseOptions(s.args)));
```

```text
{"file":"tar","args":["-czf","out.tgz","--","clips/a.mp4"]}
rad etildi: noto'g'ri nom
rad etildi: noto'g'ri nom
{"opts":["-c"],"rest":["--file=/etc/hosts","app.log"]}
```

Nima uchun yetarli: invariant "foydalanuvchi qiymati hech qachon shell sintaksisi yoki dastur opsiyasi bo'la olmaydi" ikki mexanizm bilan ta'minlandi. `execFile` modeli shell'ni olib tashlaydi, shuning uchun `;`, `&&`, `$()` buyruq emas. `-e` va `--` qiymatni qidiruv naqshi sifatida bog'laydi: `parseOptions` natijasida `--file=/etc/hosts` opsiyalar (`opts`) ro'yxatiga emas, `rest` ro'yxatiga tushdi. Yopilmagan: nom boshqa tenant'ning faylini ko'rsatishi (authorization), katta natija yoki uzoq ishlash (timeout), tashqi dasturning o'z zaifliklari (masalan, parser xatolari: dependency yangilash), va `..` kabi yo'l ketma-ketligi (26-dars). `parseOptions` bu yerda GNU uslubidagi tahlilchining soddalashtirilgan modeli.

## Qachon qo'llamaslik kerak

- Shell kerak bo'lgan hollar bor (pipe, qo'shtirnoq bilan murakkab skript, glob), lekin bunda kirish yo'q bo'lishi kerak: shell skript statik, foydalanuvchi qiymati muhit o'zgaruvchisi sifatida beriladi (`"$FILE"` shaklida), matnga qo'shilmaydi. Shunda ham `shell: true` kodni review nuqtasi.
- Allow-list regex hamma narsani hal qilmaydi. Foydalanuvchi nomi, fayl nomi kabi qisqa tuzilmalar uchun yaxshi; erkin matn (izoh, qidiruv so'zi) uchun uni argumentga bog'lab (`-e term`) berish to'g'ri.
- Docker yoki sandbox ichida ishlatish tashqi dasturni xavfsiz qilmaydi. Konteyner izolyatsiyasi zararni cheklaydi (86-dars), lekin injection mexanizmini yopmaydi.
- Kutubxonaga o'tish doim ma'qul emas: kutubxona katta bog'liqlik daraxti olib kelishi mumkin (81-dars). Ko'p holda bitta aniq `execFile` chaqiruvi kutubxonadan sodda.

## Stack'da: NestJS va Node.js

NestJS servisida tashqi jarayon chaqirish alohida, kichik va sinaladigan funksiyaga ajratiladi. Quyidagi kod ishga tushirilmaydi (`child_process` brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi tekshirilgan.

```ts
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { BadRequestException, Injectable } from "@nestjs/common";

const run = promisify(execFile);
const NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/;

@Injectable()
export class ClipArchiveService {
  async archive(tenantId: string, name: string): Promise<void> {
    if (!NAME.test(name)) throw new BadRequestException("invalid clip name");
    // shell yo'q, mutlaq yo'l, minimal muhit, vaqt va hajm cheklovi
    await run("/usr/bin/tar", ["-czf", `/data/out/${tenantId}.tgz`, "-C", `/data/clips/${tenantId}`, "--", name], {
      env: { PATH: "/usr/bin" },
      timeout: 30_000,
      maxBuffer: 1024 * 1024,
      cwd: "/data",
    });
  }
}
```

Bu yerda `tenantId` sessiyadan keladi (foydalanuvchi qiymati emas), `-C` bilan arxiv ildizi tenant papkasiga qattiq bog'langan, `name` allow-list'dan o'tgan va `--` dan keyin turadi. `env` ro'yxat bilan berilgan, `process.env` bolaga o'tmaydi. Shu bilan birga, `name` ning o'zi `..` bo'la olmasligini yoki simvolik havolalarni ishlatmasligini 26-dars bilan birga tekshiring.

## Xulosa

- `exec` va `shell: true` buyruq matnini shell'ga beradi; qiymat ichidagi `;`, `&&`, `|`, `$()` yangi buyruq bo'ladi. Bu 21-darsdagi umumiy modelning aniq ko'rinishi.
- Eng yaxshi yechim - tashqi jarayonni chaqirmaslik. Kerak bo'lsa `execFile`/`spawn` + massiv + `shell: false`.
- Shell yo'q bo'lsa ham argument injection qoladi: `-` bilan boshlanadigan qiymat opsiya bo'lib o'qiladi. Yechim: `--`, qiymatni opsiyaga bog'lash, allow-list.
- Jarayon muhitini cheklang: minimal `env`, mutlaq yo'l, `timeout`, `maxBuffer`, `cwd`.
- Belgilarni o'chirish yoki qora ro'yxat ishonchli emas: shell'da ajratkichlar ko'p va kontekstga bog'liq.
- Tuzatish qoplamaydigan narsalarni yozing: authorization, yo'l ketma-ketliklari, resurs sarfi, tashqi dastur zaifliklari.
