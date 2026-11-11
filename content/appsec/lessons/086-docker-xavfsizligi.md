---
n: 86
slug: docker-xavfsizligi
title: "Konteyner xavfsizligi: Docker"
summary: "Konteyner izolyatsiyasi qayerda tugaydi: root va capability'lar, docker.sock, non-root USER, read-only fayl tizimi, build vaqtidagi sirlar, base image'ni digest bilan qotirish va image supply chain."
duration: 50
sources:
  - id: docker-security
    note: "Docker Engine security: daemon root huquqini talab qiladi (rootless rejimdan tashqari), daemonni faqat ishonchli foydalanuvchilar boshqarishi kerak, default holatda cheklangan capability to'plami (allowlist), rootless rejim"
  - id: docker-build-practices
    note: "Docker build best practices: tag'lar o'zgaruvchan, digest bilan qotirish takrorlanuvchi build beradi; USER bilan non-root; multi-stage build"
  - id: docker-build-secrets
    note: "Docker build secrets: build argument va environment variable final image'da saqlanib qolgani uchun sir uchun yaramaydi; secret mount va SSH mount ishlatiladi"
  - id: cs-docker
    note: "OWASP Docker Security Cheat Sheet: docker.sock'ni ochmaslik, USER, --cap-drop all, no-new-privileges, --read-only, resurs cheklovlari, image skanerlash, supply chain (provenance, SBOM, imzo)"
  - id: cs-nodedocker
    note: "OWASP NodeJS Docker Cheat Sheet: deterministik base image tag'lari, npm ci --omit=dev, USER node va COPY --chown, build secrets bilan .npmrc"
  - id: t10-a02
    note: "A02:2025 Security Misconfiguration: keraksiz imkoniyatlar yoqilgan, default akkauntlar, takrorlanuvchi hardening jarayoni"
quiz:
  - q: "Ilovada RCE bor. Konteyner `-v /var/run/docker.sock:/var/run/docker.sock` bilan ishga tushirilgan. Nima uchun bu konteyner chegarasi emas?"
    options:
      - "Socket faqat o'qish uchun, hujumchi hech narsa qila olmaydi"
      - "Docker API socket orqali ochiq, uning yordamida hujumchi yangi konteynerlar yaratib host fayl tizimini ulashi va host darajasida boshqaruvga ega bo'ladi"
      - "Socket faqat log yozadi"
      - "Socket faqat tarmoq trafigini cheklaydi"
    answer: 1
    explain: "Socket Docker daemon'ning asosiy API kirish nuqtasi va daemon root huquqi bilan ishlaydi. OWASP cheat sheet unga kirishni host'ga cheklanmagan root kirishiga tenglashtiradi; socketni :ro qilish API'ni faqat o'qishga aylantirmaydi."
  - q: "Dockerfile'da `USER node` bor, lekin `COPY . /app` oddiy. Nima uchun ilova fayllarni yoza olmasligi yoki huquq muammosi bo'lishi mumkin va xavfsizlik uchun bu nimani anglatadi?"
    options:
      - "COPY fayllarni default root egaligida qo'yadi; to'g'ri ish: COPY --chown=node:node va fayllarni kerak darajada o'qish-yozish huquqi bilan berish"
      - "COPY hamma fayllarni node egaligida qoldiradi"
      - "USER faqat ENV bilan ishlaydi"
      - "USER buyrug'i ishlamaydi"
    answer: 0
    explain: "USER faqat jarayon egasini o'zgartiradi. Fayl egaligi COPY --chown bilan beriladi. Maqsad: jarayon minimal huquq bilan ishlasin, lekin ilova fayllari yozilishi mumkin bo'lmagan (read-only) holatda bo'lsin."
  - q: "Build vaqtida npm token kerak. Qaysi usul token'ni image'da qoldirmaydi?"
    options:
      - "`ARG NPM_TOKEN` va `RUN npm ci`"
      - "`ENV NPM_TOKEN=...` va keyin `RUN unset NPM_TOKEN`"
      - "Token'ni `.npmrc` ga yozib COPY qilish"
      - "BuildKit secret mount: `RUN --mount=type=secret,id=npmrc ...`"
    answer: 3
    explain: "Docker hujjati build argument va environment variable'lar final image'da saqlanishini aytadi, shuning uchun ular sir uchun mos emas. Secret mount sirni faqat shu RUN davomida fayl sifatida beradi. unset oldingi qatlamlardagi qiymatni olib tashlamaydi."
  - q: "`FROM node:22-alpine` ni `FROM node:22-alpine@sha256:...` ga almashtirish nima beradi?"
    options:
      - "Image kichikroq bo'ladi"
      - "Tag keyinchalik boshqa image'ga ko'chirilsa ham aynan o'sha image ishlatiladi: build takrorlanuvchi va auditga yaroqli"
      - "Image avtomatik yangilanadi"
      - "Image imzolanadi"
    answer: 1
    explain: "Tag'lar o'zgaruvchan; digest o'zgarmas. Narxi: qo'lda yoki avtomatik yangilash kerak, aks holda base image'dagi tuzatishlar kelmaydi. Digest o'zi image xavfsiz ekanini kafolatlamaydi."
  - q: "Konteyner `--privileged` bilan ishga tushirilgan. Cheat sheet buni nima deb baholaydi?"
    options:
      - "Kerak bo'lganda xavfsiz, chunki izolyatsiya saqlanadi"
      - "Faqat tarmoq huquqini beradi"
      - "Konteynerga barcha Linux capability'larini qo'shadi, shuning uchun uni ishlatmaslik tavsiya etiladi"
      - "Faqat Windows'da ta'sir qiladi"
    answer: 2
    explain: "OWASP Docker cheat sheet --privileged ALL capability qo'shishini va undan qochishni aytadi; eng xavfsiz sozlama: barcha capability'larni tashlab, faqat kerakligini qo'shish."
  - q: "`--read-only` fayl tizimi nima himoya qiladi va nima himoya qilmaydi?"
    options:
      - "RCE'ni to'liq yopadi"
      - "Sirlarni RAM'dan o'chiradi"
      - "Tarmoq kirishini bloklaydi"
      - "Hujumchi konteyner fayl tizimiga zararli fayl qoldirishini qiyinlashtiradi, lekin RCE'ning o'zini, xotiradagi kodni va tarmoq orqali chiqishni yopmaydi"
    answer: 3
    explain: "Read-only chuqurlikdagi himoya qatlami: yozishga ruxsat kerak bo'lsa tmpfs bilan cheklangan joyga beriladi. U zaiflikni tuzatmaydi."
task:
  title: "Dockerfile linter: to'rtta qoida"
  prompt: |
    `lintDockerfile(text)` Dockerfile matnini tekshirib topilmalar ro'yxatini qaytaradi. Hozir u faqat `FROM` digest bilan qotirilganini tekshiradi.

    Qo'shing:
    1. `FROM` da tag yo'q yoki `latest` bo'lsa: `"satr N: tag yo'q yoki latest (<image>)"` (digest topilmasidan keyin, bir satr uchun).
    2. `ARG` yoki `ENV` nomida `KEY`, `TOKEN`, `SECRET` yoki `PASSWORD` bo'lsa: `"satr N: sir ARG/ENV orqali: NOM (image'da qoladi)"`.
    3. Dockerfile'da `USER` buyrug'i umuman bo'lmasa, oxirida: `"USER yo'q: konteyner root bilan ishlaydi"`.

    Kutilgan natija: 4 ta topilma, `jami: 4`.
  lang: ts
  starter: |
    const dockerfile = `
    FROM node:latest
    ARG NPM_TOKEN
    WORKDIR /app
    COPY . .
    RUN npm ci
    CMD ["node", "server.js"]
    `;

    // Boshlang'ich: faqat bitta qoida - FROM digest bilan qotirilganmi
    function lintDockerfile(text: string): string[] {
      const out: string[] = [];
      text.split("\n").forEach((line, i) => {
        const from = line.match(/^FROM\s+(\S+)/);
        if (from && !from[1].includes("@sha256:")) out.push(`satr ${i}: FROM ${from[1]} digest bilan qotirilmagan`);
      });
      return out;
    }

    const found = lintDockerfile(dockerfile);
    for (const f of found) console.log(f);
    console.log("jami:", found.length);
  solution: |
    const dockerfile = `
    FROM node:latest
    ARG NPM_TOKEN
    WORKDIR /app
    COPY . .
    RUN npm ci
    CMD ["node", "server.js"]
    `;

    // Qoidalar: (1) FROM digest bilan qotirilgan, (2) tag "latest" yoki yo'q, (3) ARG/ENV da sir nomi, (4) USER yo'q
    function lintDockerfile(text: string): string[] {
      const out: string[] = [];
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        const from = line.match(/^FROM\s+(\S+)/);
        if (from) {
          if (!from[1].includes("@sha256:")) out.push(`satr ${i}: FROM ${from[1]} digest bilan qotirilmagan`);
          const tag = from[1].split("@")[0].split(":")[1];
          if (!tag || tag === "latest") out.push(`satr ${i}: tag yo'q yoki latest (${from[1]})`);
        }
        const secret = line.match(/^(?:ARG|ENV)\s+([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_]*)/);
        if (secret) out.push(`satr ${i}: sir ARG/ENV orqali: ${secret[1]} (image'da qoladi)`);
      });
      if (!lines.some((l) => /^USER\s+/.test(l))) out.push("USER yo'q: konteyner root bilan ishlaydi");
      return out;
    }

    const found = lintDockerfile(dockerfile);
    for (const f of found) console.log(f);
    console.log("jami:", found.length);
  solutionNotes: |
    - Qoidalar Docker hujjatiga mos: tag'lar o'zgaruvchan, digest pin takrorlanuvchi build beradi; ARG/ENV qiymatlari final image'da saqlanadi; USER bo'lmasa konteyner default root bilan ishlaydi (qo'shimcha: tashqi image `USER` ni o'zi o'rnatgan bo'lishi mumkin).
    - Linter satr naqshiga tayanadi: ko'p qatorli RUN, multi-stage'dagi bir nechta FROM, `USER root` dan keyin `USER node` kabi holatlar to'liq tahlil qilinmaydi. Real vosita Dockerfile'ni parse qiladi.
    - Nom bo'yicha sirni topish ham ehtimoliy: `ARG API_URL` ushlanmaydi, `ARG TOKEN_TTL` esa soxta ogohlantirish beradi.
    - Linter yo'q topilma image xavfsiz degani emas: image tarkibidagi paketlar skaner (cheat sheet: CI'da container scanning) vazifasi.
  checklist:
    - "FROM digest bilan qotirilmagan satr topiladi"
    - "latest yoki tag yo'q holat topiladi"
    - "ARG/ENV da sir nomi topiladi"
    - "USER yo'qligi oxirida bir marta xabar qilinadi"
    - "Linter nimani ko'rmasligini (parse qilinmagan holatlar) ayta olasiz"
---

## Muammo

Konteyner "kichik virtual mashina" emas: u host yadrosi ustida ishlaydigan, namespace va cgroup bilan ajratilgan jarayon. Docker hujjati yadro namespace'lari va control group'larni konteyner izolyatsiyasining asosi sifatida tavsiflaydi. Demak konteyner chegarasi sozlamalarga bog'liq, va ular noto'g'ri qo'yilsa, ilovadagi bitta zaiflik hostgacha yetadi. Production'da tez-tez uchraydigan tasvir: Dockerfile `FROM node` bilan boshlanadi, hech qanday `USER` yo'q, `ENV` ichida parol, `docker.sock` CI agentiga ulangan, konteyner `--privileged` bilan ishga tushgan, chunki "shunda ishlaydi".

A02:2025 Security Misconfiguration shu holatni tasvirlaydi: keraksiz imkoniyatlar yoqilgan, default sozlamalar o'zgartirilmagan, hardening takrorlanmaydi. A03 (81-dars) yana bir tomonni qo'shadi: image ichida nima borligi supply chain masalasi (base image, OS paketlari).

Bu dars Docker hujjatlari (Engine security va build) hamda OWASP Docker va NodeJS Docker cheat sheet'larga tayanadi. Kubernetes'dagi tegishli nazoratlar (Pod Security Standards) 87-darsda.

## Asosiy g'oya

Konteyner xavfsizligini uch savol bilan tuzish qulay.

1. Konteyner ichidagi jarayon kim sifatida va qanday huquqlar bilan ishlaydi? Bu USER, capability'lar, no-new-privileges.
2. U nimaga tegishi mumkin? Bu fayl tizimi (read-only), mount'lar (`docker.sock`, host papkalar), tarmoq, resurslar.
3. Image ichida nima bor va qanday yig'ilgan? Bu base image, paketlar, build sirlari, qatlamlar.

Docker hujjati birinchi savolning asosiy xabarini beradi: odatiy server ko'p jarayonni root sifatida ishga tushiradi (SSH, cron, loglar, tarmoq vositalari), konteynerda esa bu vazifalarning ko'pi atrofdagi infratuzilmaga o'tkaziladi, shuning uchun ko'p holatda konteynerlarga "haqiqiy" root huquqi umuman kerak emas. Docker default holatda cheklangan capability to'plamini beradi: hujjat buni allowlist yondashuvi deb ataydi, ya'ni ruxsat etilganlardan boshqa barcha capability tashlanadi. Hujjat bundan kelib chiqadigan imkoniyatlarni sanaydi: mount operatsiyalarini rad etish, raw socket'larni rad etish, yangi qurilma tugunlari yaratish yoki fayl egasini o'zgartirishni rad etish, modul yuklashni rad etish. Natija: hujumchi konteyner ichida root'ga chiqsa ham, jiddiy zarar yetkazish va hostga o'tish ancha qiyin.

OWASP Docker cheat sheet buni qoidalarga aylantiradi: `docker.sock`'ni konteynerga ochmaslik (rule 1), USER o'rnatish (rule 2), `--cap-drop all` bilan boshlab faqat kerakni qo'shish (rule 3), `--security-opt=no-new-privileges` (rule 4), resurslarni cheklash (rule 7), `--read-only` (rule 8), CI'da image skanerlash (rule 9), supply chain choralari (rule 13).

## Chuqurroq: daemon, build va image

### Daemon va socket

Docker hujjati daemon root huquqini talab qilishini (rootless rejimdan tashqari) va shu sababli faqat ishonchli foydalanuvchilar uni boshqarishi kerakligini aytadi. Sabab: Docker host papkani konteynerga cheklovsiz ulashga imkon beradi, masalan host `/` ni konteyner ichida `/host` qilib ulash va u yerdan host fayl tizimini o'zgartirish. Shuning uchun daemon API'ga kirishi bor kishi amalda host ustidan nazoratga ega. OWASP cheat sheet bundan xulosa qiladi: tcp daemon socket'ini yoqmaslik (autentifikatsiyasiz va shifrlanmagan kirish), va `/var/run/docker.sock`'ni konteynerlarga ulamaslik; u socket'ni faqat o'qish uchun ulash API'ni faqat o'qish qilmasligini ham alohida ta'kidlaydi. Docker Rootless rejimi daemon va konteynerlarni root bo'lmagan foydalanuvchi sifatida user namespace ichida ishga tushiradi va daemon yoki runtime zaifliklari ta'sirini kamaytirishga mo'ljallangan.

### Non-root: USER yetarli emas

NodeJS Docker cheat sheet rasmiy `node` image'da `node` nomli kam huquqli foydalanuvchi borligini va faqat `USER node` yozish yetarli emasligini ko'rsatadi: `COPY` fayllarni default root egaligida qo'yadi, shuning uchun `COPY --chown=node:node` ishlatiladi. U shuningdek `npm ci --omit=dev` bilan faqat production bog'liqliklarini o'rnatishni tavsiya qiladi (81-darsdagi `npm ci` ning davomi), chunki devDependencies keraksiz risk qo'shadi. Command injection yoki path traversal (25 va 26-darslar) ilova jarayonining foydalanuvchisi huquqi bilan bajariladi: non-root zararni cheklaydi, yo'q qilmaydi.

### Build vaqtidagi sirlar

Docker build hujjati: build argument va environment variable'lar final image'da saqlanib qoladi, shuning uchun ular sirni build'ga berish uchun mos emas. Buning o'rniga secret mount (sirni build klientidan oladi va faqat bitta build instruksiyasi davomida konteynerda vaqtincha fayl sifatida beradi) yoki SSH mount ishlatiladi. Sir `--secret id=...` bilan beriladi va `RUN --mount=type=secret,id=...` bilan ishlatiladi; default fayl yo'li `/run/secrets/<id>`. NodeJS Docker cheat sheet buni `.npmrc` misolida ko'rsatadi: private registry token multi-stage build'ning faqat build bosqichida kerak, production bosqichda bo'lmasligi kerak.

### Tag'lar o'zgaruvchan, digest o'zgarmas

Docker best practices hujjati image tag'lari o'zgaruvchan (mutable) ekanini yozadi: nashr qiluvchi tag'ni yangi image'ga ko'chira oladi. Masalan `alpine:3.21` bugun bir patch versiyaga, uch oydan keyin boshqasiga ishora qilishi mumkin. Bu odatiy ish jarayoni, lekin build takrorlanuvchi emas va qaysi image ishlatilgani bo'yicha audit izi yo'q. Supply chain yaxlitligi uchun image'ni digest bilan qotirish tavsiya etiladi: tag o'zgarsa ham aynan o'sha image ishlatiladi. Hujjat narxini ochiq aytadi: digestni har safar qo'lda topish zerikarli, va qotirish bilan siz avtomatik xavfsizlik tuzatishlarini olishdan voz kechasiz. Shuning uchun Docker Scout'ning "No outdated base images" siyosati qotirilgan digest hali to'g'ri versiyaga mos kelishini tekshiradi, GitHub Dependabot (`package-ecosystem: "docker"`) esa base image tag va digest'larini jadval bo'yicha pull request bilan yangilaydi. Hujjatga ko'ra bu tag avtomatik o'zgarishidan yaxshiroq: nazorat sizda va o'zgarish izi saqlanadi. NodeJS cheat sheet bu g'oyani npm lockfile bilan taqqoslaydi: `FROM node` har build'da boshqa image olib kelishi mumkin.

### Image supply chain

OWASP Docker cheat sheet 13-qoidada image'ning butun hayot siklini qamraydi: kelib chiqishi (provenance), har image uchun SBOM, image imzosi, imzolangan image'larni SBOM bilan birga qat'iy kirish nazoratiga ega registry'da saqlash, va deploy siyosatlari (image validatsiyasi, runtime xavfsizligi). Bu 82-dars g'oyalarining konteynerga qo'llanishi. Image SBOM'i OS paketlarini ham qamraydi, lockfile esa faqat npm'ni: shuning uchun image darajasida SBOM kerak.

### Resurslar va tarmoq

Mavjudlik (availability) ham konteyner sozlamasi. OWASP cheat sheet 7-qoidada xotira, CPU, fayl deskriptorlari, jarayonlar soni va qayta ishga tushirishlarni cheklashni DoS'dan himoyaning eng yaxshi usuli deb ataydi; Kubernetes'da buning o'xshashi resource request va limit'lar. 5-qoida konteynerlar orasidagi aloqaga ehtiyot bo'lishni, 5a esa port'larni host'ga ulashda UFW kabi firewall'lar bilan o'zaro ta'sirga e'tibor berishni aytadi. Bu 1-darsdagi CIA triadasining konteynerdagi aksi: root va socket maxfiylik va yaxlitlikka, resurs limiti mavjudlikka ta'sir qiladi.

Yana bir real masala: faqat "root emas" yetarli emas. Jarayon root bo'lmasa ham, agar fayl tizimi yoziladigan va capability'lar tashlanmagan bo'lsa, hujumchi huquqini oshirishga urinish uchun vositalar topadi. Shu sababli cheat sheet qatlamlarni birga tavsiya qiladi: USER, `--cap-drop all`, `no-new-privileges` (setuid va setgid binary'lar orqali yangi huquq olishni to'sadi), `--read-only`. Har qatlam alohida kuchsiz, birga esa hujumchining keyingi qadamini qimmatlashtiradi (defense in depth, 3-dars).

## Misol: RCE dan keyin konteyner nimani beradi

Quyidagi model "konteyner sozlamasi → RCE dan keyin hujumchi imkoniyatlari" bog'lanishini ko'rsatadi. Bu haqiqiy izolyatsiyani emas, yuqorida hujjatlardan olingan qoidalarni ifodalaydi. Ilovada RCE bor deb faraz qilamiz (zaiflikning o'zi bu darsda emas).

### 1. Zaif kod va 2. Hujum

> **Ta'lim maqsadida.** Bu konteynerdan chiqish imkoniyatlari namunasi faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Sozlama: root, `docker.sock` ulangan, capability'lar tashlanmagan, yoziladigan fayl tizimi, parol muhit o'zgaruvchisida. "Hujum" bu RCE dan keyingi imkoniyatlar ro'yxati:

```ts run
type Cfg = {
  user: string; privileged: boolean; mounts: string[]; capDrop: string[];
  readOnlyFs: boolean; noNewPrivileges: boolean; env: Record<string, string>;
};

// Model: ilovada RCE bor deb faraz qilamiz. Konteyner sozlamasiga qarab hujumchi nimaga ega bo'ladi?
function afterRce(c: Cfg): string[] {
  const out: string[] = [];
  if (c.privileged) out.push("privileged: barcha capability'lar, host qurilmalariga kirish");
  if (c.mounts.includes("/var/run/docker.sock")) out.push("docker.sock: Docker API orqali istalgan konteyner yaratish (host root'iga teng)");
  if (c.user === "root") out.push("konteyner ichida root");
  else if (!c.noNewPrivileges) out.push("setuid/setgid orqali huquq oshirish mumkin");
  if (!c.capDrop.includes("ALL")) out.push("capability to'plami toraytirilmagan");
  if (!c.readOnlyFs) out.push("fayl tizimiga yozish (zararli fayl qoldirish)");
  for (const k of Object.keys(c.env)) if (/KEY|TOKEN|SECRET|PASSWORD/.test(k)) out.push(`muhit o'zgaruvchisida sir: ${k}`);
  return out;
}

// ZAIF konfiguratsiya
const weak: Cfg = {
  user: "root", privileged: false, mounts: ["/var/run/docker.sock"], capDrop: [],
  readOnlyFs: false, noNewPrivileges: false, env: { DB_PASSWORD: "***", PORT: "3000" },
};
const found = afterRce(weak);
console.log("hujumchi imkoniyatlari:", found.length);
for (const f of found) console.log("-", f);
```

```text
hujumchi imkoniyatlari: 5
- docker.sock: Docker API orqali istalgan konteyner yaratish (host root'iga teng)
- konteyner ichida root
- capability to'plami toraytirilmagan
- fayl tizimiga yozish (zararli fayl qoldirish)
- muhit o'zgaruvchisida sir: DB_PASSWORD
```

Beshta imkoniyat. Ulardan eng og'iri `docker.sock`: OWASP cheat sheet unga kirishni host'ga cheklanmagan root kirishiga tenglashtiradi. Qolganlari hujumchiga joylashib olishga (yoziladigan FS, root) va boshqa tizimlarga o'tishga (muhitdagi parol) yordam beradi.

### 3. Tuzatilgan kod

Sozlama: `USER node`, socket yo'q, `--cap-drop ALL`, `--read-only`, `no-new-privileges`, sir muhitda emas (runtime'da secrets manager'dan, 69-dars).

```ts run
type Cfg = {
  user: string; privileged: boolean; mounts: string[]; capDrop: string[];
  readOnlyFs: boolean; noNewPrivileges: boolean; env: Record<string, string>;
};

function afterRce(c: Cfg): string[] {
  const out: string[] = [];
  if (c.privileged) out.push("privileged: barcha capability'lar, host qurilmalariga kirish");
  if (c.mounts.includes("/var/run/docker.sock")) out.push("docker.sock: Docker API orqali istalgan konteyner yaratish (host root'iga teng)");
  if (c.user === "root") out.push("konteyner ichida root");
  else if (!c.noNewPrivileges) out.push("setuid/setgid orqali huquq oshirish mumkin");
  if (!c.capDrop.includes("ALL")) out.push("capability to'plami toraytirilmagan");
  if (!c.readOnlyFs) out.push("fayl tizimiga yozish (zararli fayl qoldirish)");
  for (const k of Object.keys(c.env)) if (/KEY|TOKEN|SECRET|PASSWORD/.test(k)) out.push(`muhit o'zgaruvchisida sir: ${k}`);
  return out;
}

// TUZATILGAN konfiguratsiya: non-root, socket yo'q, capability'lar tashlangan, read-only FS, sir env'da emas
const fixed: Cfg = {
  user: "node", privileged: false, mounts: [], capDrop: ["ALL"],
  readOnlyFs: true, noNewPrivileges: true, env: { PORT: "3000" },
};
const found = afterRce(fixed);
console.log("hujumchi imkoniyatlari:", found.length);
for (const f of found) console.log("-", f);
console.log("qoldiq: ilovaning o'zidagi RCE, tarmoq kirishi va ilova ma'lumotlari bu model tashqarisida");
```

```text
hujumchi imkoniyatlari: 0
qoldiq: ilovaning o'zidagi RCE, tarmoq kirishi va ilova ma'lumotlari bu model tashqarisida
```

Nima yopildi: konteynerdan hostga o'tish yo'llari (socket, privileged), konteyner ichida huquq oshirish va fayl qoldirish. Nima yopilmadi: ilovadagi RCE'ning o'zi; hujumchi ilova huquqi bilan ilova ma'lumotlarini o'qiy oladi va tarmoq orqali chiqa oladi; yadro zaifliklari konteyner izolyatsiyasini baribir chetlab o'tishi mumkin. Shuning uchun "0 imkoniyat" model ichidagi natija, haqiqiy xavfsizlik isboti emas.

### Mustahkamlangan Dockerfile va ishga tushirish

Yuqoridagi qoidalar real Dockerfile'da shunday ko'rinadi. Bu ishga tushirilmaydigan namuna: `<digest>` o'rniga tanlagan base image'ingizning haqiqiy digest'ini qo'yasiz, `npmrc` esa build vaqtida `--secret id=npmrc,src=...` bilan beriladi.

```dockerfile
# syntax=docker/dockerfile:1
FROM node:22-alpine@sha256:<digest> AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
COPY . .
RUN npm run build

FROM node:22-alpine@sha256:<digest>
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev
COPY --chown=node:node --from=build /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]
```

Ishga tushirishda qolgan nazoratlar beriladi:

```bash
docker run --read-only --tmpfs /tmp \
  --cap-drop all \
  --security-opt=no-new-privileges \
  --memory 512m --cpus 1 \
  fleet-api:1.0.0
```

Nima uchun shunday: base image digest bilan qotirilgan (best practices hujjati); token faqat `RUN` davomida fayl sifatida mount qilinadi va qatlamga yozilmaydi, `ARG`/`ENV` esa final image'da qolardi; ikkinchi bosqich faqat build natijasi va production bog'liqliklarini oladi; fayllar `--chown=node:node` bilan, jarayon `USER node` bilan ishlaydi; `--read-only` yozishni `--tmpfs /tmp` bilan cheklaydi (cheat sheet misoli), `--cap-drop all` va `no-new-privileges` yuqorida ko'rilgan. Qoldiq risk: `npm ci` bu yerda install skriptlarini ishga tushiradi (81-darsdagi trade-off), digest yangilanmasa base image eskiradi, va image ichidagi paketlar skanerlanishi kerak.

### Dockerfile linter

Quyidagi kod Dockerfile uchun bir qoidani tekshiradi: FROM digest bilan qotirilganmi. Namuna Dockerfile'da ataylab uchta muammo bor: `node:latest`, `ARG NPM_TOKEN` va `USER` yo'qligi. Qolgan qoidalarni topshiriqda qo'shasiz.

```ts run
const dockerfile = `
FROM node:latest
ARG NPM_TOKEN
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]
`;

// Boshlang'ich: faqat bitta qoida - FROM digest bilan qotirilganmi
function lintDockerfile(text: string): string[] {
  const out: string[] = [];
  text.split("\n").forEach((line, i) => {
    const from = line.match(/^FROM\s+(\S+)/);
    if (from && !from[1].includes("@sha256:")) out.push(`satr ${i}: FROM ${from[1]} digest bilan qotirilmagan`);
  });
  return out;
}

const found = lintDockerfile(dockerfile);
for (const f of found) console.log(f);
console.log("jami:", found.length);
```

```text
satr 1: FROM node:latest digest bilan qotirilmagan
jami: 1
```

Yakuniy eslatma: bu nazoratlar bir-birini to'ldiradi va hech biri yagona himoya emas. Non-root foydalanuvchi, tashlangan capability'lar, `no-new-privileges` va faqat o'qish uchun fayl tizimi birgalikda RCE dan keyingi hujumchining qadamlarini birma-bir yopadi; ulardan birini olib tashlash qolganlarining qiymatini kamaytiradi. Shuning uchun Dockerfile va ishga tushirish sozlamalarini repoda saqlab, review qiling va CI'da linter bilan tekshiring.

## Qachon qo'llamaslik kerak

- `--read-only` ni sinovsiz hamma servisga yoqish. Ko'p ilova vaqtinchalik fayl yozadi (kesh, upload buferi); tmpfs bilan cheklangan yozish joyi bermasangiz, ilova ishlamaydi. Cheat sheet shu holat uchun `--tmpfs` ni ko'rsatadi.
- `--cap-drop all` ni kerakli capability'ni bilmasdan qo'yish. Ilova ishga tushmasa, jamoa `--privileged` ga qaytadi, bu eng yomon natija. To'g'ri yo'l: tashlab, xato ko'rinsa, aniq bitta capability qo'shish.
- Digest pin'ni yangilash jarayonisiz joriy qilish. Pin'langan eski base image tuzatilgan zaifliklarni olmaydi: A03 risk asosida o'z vaqtida yangilashni talab qiladi.
- Image skanerini yagona nazorat qilish. U ma'lum zaifliklarni topadi (NodeJS cheat sheet to'liq `node` image'da yuzlab zaiflik bo'lishi mumkinligini yozadi, shuning uchun kichikroq base image tanlash ham chora), lekin sozlama xatolarini (socket, privileged) ko'rmaydi.
- Rootless rejimni hamma joyda majburlash. U daemon xavfini kamaytiradi, lekin hujjat troubleshooting sahifasidagi "Known limitations" bo'limida qo'llab-quvvatlanmaydigan imkoniyatlarni sanaydi; avval o'z muhitingizda sinab ko'rib qaror qiling.

## Stack'da: Node.js/NestJS/Next.js image'i

- Multi-stage build: build bosqichida kompilyator va devDependencies, final bosqichda faqat build natijasi va `npm ci --omit=dev`. Final image kichik va sirsiz bo'ladi.
- `.npmrc` tokenini BuildKit secret mount bilan bering (yuqorida), `COPY .npmrc` va `ARG NPM_TOKEN` emas.
- `USER node` va `COPY --chown=node:node`; ilova yoziladigan papka bo'lsa, faqat o'shaniki.
- CI/CD'da `docker.sock`'ni mount qilmang; build uchun BuildKit yoki rootless builder (85-dars CI xavfsizligi bilan bog'liq).
- Orkestratorda (87-dars) xuddi shu qoidalar Pod `securityContext` bilan beriladi: `runAsNonRoot`, `capabilities.drop: ["ALL"]`, `allowPrivilegeEscalation: false`.
- Image SBOM, provenance va imzo (82-dars) release pipeline'ning qismi.

## Xulosa

- Konteyner chegarasi sozlamalarga bog'liq: root, capability'lar, mount'lar va privileged rejim uni yo'qqa chiqaradi.
- `docker.sock`'ni konteynerga ulash host'ga cheklanmagan root kirishiga teng; read-only mount buni o'zgartirmaydi.
- `USER` + `COPY --chown`, `--cap-drop all`, `no-new-privileges`, `--read-only`: har biri RCE dan keyingi zararni kamaytiradi, RCE'ning o'zini tuzatmaydi.
- Build argument va environment variable'lar final image'da qoladi: sirlar uchun secret mount.
- Tag o'zgaruvchan, digest o'zgarmas; qotirish yangilash jarayoni bilan birga bo'ladi.
- Image tarkibi supply chain masalasi: skanerlash, SBOM, provenance va imzo.
