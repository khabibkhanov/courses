---
n: 89
slug: postgresql-redis-mustahkamlash
title: "PostgreSQL va Redis'ni mustahkamlash"
summary: "PostgreSQL'da pg_hba.conf tartibi (birinchi mos yozuv hal qiladi), trust va scram-sha-256, hostssl, reject; Redis'da ishonchli muhit modeli, protected mode, ACL, requirepass va CONFIG xavfi; DB hisoblari va tarmoq izolyatsiyasi."
duration: 50
sources:
  - id: pg-auth
    note: "PostgreSQL Client Authentication: pg_hba.conf'da birinchi mos yozuv ishlatiladi, fall-through yo'q, mos yozuv bo'lmasa kirish rad etiladi; trust, reject, scram-sha-256, hostssl, hostnossl"
  - id: redis-security
    note: "Redis security: ishonchli klientlar va ishonchli muhit modeli, bind, protected mode (3.2.0 dan), ACL (Redis 6), requirepass, TLS, rename-command eskirgan, CONFIG va RDB yozish xavfi, unprivileged foydalanuvchi"
  - id: cs-db
    note: "OWASP Database Security Cheat Sheet: tarmoq izolyatsiyasi, TLS, har servisga alohida hisob, minimal huquq, default hisoblarni olib tashlash, credential saqlash"
  - id: t10-a02
    note: "A02:2025: default akkauntlar va parollar o'zgartirilmagan, hardening yetishmasligi, takrorlanuvchi jarayon"
quiz:
  - q: "pg_hba.conf'da birinchi yozuv `host all all 10.0.0.0/8 trust`, ikkinchisi `hostssl all all 0.0.0.0/0 scram-sha-256`. 10.x manzildan SSL bilan, noto'g'ri parol bilan ulanish natijasi?"
    options:
      - "Rad etiladi, chunki ikkinchi yozuv parol so'raydi"
      - "Birinchi yozuv mos kelgani uchun trust ishlaydi va parol tekshirilmaydi"
      - "Ikkala yozuv ham tekshiriladi, parol xato bo'lgani uchun rad"
      - "Server xato beradi"
    answer: 1
    explain: "Hujjat: birinchi mos yozuv ishlatiladi, fall-through yoki zaxira yo'q. Birinchi yozuv mos kelsa va u trust bo'lsa, keyingisiga o'tilmaydi, parol so'ralmaydi."
  - q: "Hech bir pg_hba.conf yozuvi ulanishga mos kelmasa nima bo'ladi?"
    options:
      - "Kirish rad etiladi"
      - "Default trust ishlaydi"
      - "scram-sha-256 so'raladi"
      - "Faqat localhost'ga ruxsat"
    answer: 0
    explain: "PostgreSQL hujjati aniq: agar hech bir yozuv mos kelmasa, kirish rad etiladi. Bu deny by default."
  - q: "PostgreSQL hujjatiga ko'ra `scram-sha-256` haqida qaysi gap to'g'ri?"
    options:
      - "Parol ochiq matnda yuboriladi"
      - "Eng zaif usul"
      - "Faqat local ulanishlar uchun"
      - "Mavjud usullarning eng xavfsizi, parol sniffing'ning oldini oluvchi challenge-response sxemasi; lekin eski klient kutubxonalari qo'llamasligi mumkin"
    answer: 3
    explain: "Hujjat: SCRAM-SHA-256 challenge-response, untrusted ulanishlarda parol sniffing'ning oldini oladi, parolni serverda xeshlangan holda saqlaydi, va eski klient kutubxonalari uni qo'llamaydi."
  - q: "Redis protected mode nima qiladi?"
    options:
      - "Barcha buyruqlarni shifrlaydi"
      - "Default konfiguratsiyada (barcha interfeys, parolsiz) ishga tushganda faqat loopback'dan kelgan so'rovlarga javob beradi, qolganlarga xato qaytaradi"
      - "FLUSHALL'ni o'chiradi"
      - "Faqat Redis 6 da mavjud"
    answer: 1
    explain: "Hujjat: 3.2.0 versiyasidan boshlab, default konfiguratsiya (barcha interfeysga bog'langan) va parolsiz holatda Redis protected mode'ga o'tadi va faqat loopback'dan javob beradi. Administrator uni o'chirishi ham mumkin."
  - q: "Redis hujjatiga ko'ra autentifikatsiyaning tavsiya etilgan usuli qaysi?"
    options:
      - "Hamma klientlar uchun bitta requirepass"
      - "rename-command"
      - "Access Control Lists (Redis 6 dan): nomli foydalanuvchilar va nozik huquqlar"
      - "Parolsiz, faqat firewall"
    answer: 2
    explain: "Hujjat ACL'ni tavsiya etilgan usul deydi; requirepass eski usul va bitta parol hamma klientga umumiy. rename-command esa eskirgan va ACL qoidalari bilan almashtirilishi tavsiya etiladi."
  - q: "Redis'da klient CONFIG buyrug'ini ishlata olsa, hujjat qanday xavfni ko'rsatadi?"
    options:
      - "Klient ishchi katalog va dump fayl nomini o'zgartirib, RDB fayllarni ixtiyoriy yo'lga yozishi mumkin, bu tizimni buzishga olib kelishi mumkin"
      - "Hech qanday xavf yo'q"
      - "Faqat xotira ko'payadi"
      - "Faqat log yoziladi"
    answer: 0
    explain: "Hujjat: CONFIG orqali ishchi katalog va dump fayl nomini o'zgartirish RDB'ni ixtiyoriy yo'llarga yozishga imkon beradi va Redis foydalanuvchisi nomidan kod bajarilishiga olib kelishi mumkin. Shuning uchun Redis root bo'lmagan foydalanuvchida ishlashi va CONFIG ACL bilan yopilishi kerak."
task:
  title: "pg_hba.conf mantiqi"
  prompt: |
    `authenticate(rules, conn)` PostgreSQL pg_hba.conf mantiqini modellashtiradi, lekin hozir xato: mos kelgan yozuvlarni birma-bir ko'rib chiqadi va birortasi o'tkazsa kiritadi (zaxira), `reject` yozuvini ham o'tkazib yuboradi.

    PostgreSQL hujjatiga mos tuzating:
    1. Birinchi mos yozuv hal qiladi, keyingilariga o'tilmaydi.
    2. Mos yozuv bo'lmasa kirish rad etiladi.
    3. `reject` yozuvi kirishni rad etadi.
    4. `trust` kiritadi, `scram-sha-256` esa parolni tekshiradi.

    Kutilgan natija: to'rtta holatning hammasi to'g'ri, oxirgi qatorda `OK`.
  lang: ts
  starter: |
    type Rule = { type: "host" | "hostssl" | "hostnossl"; user: string; net: string; method: "trust" | "scram-sha-256" | "reject" };
    type Conn = { ssl: boolean; user: string; ip: string; password?: string };
    const PASSWORDS: Record<string, string> = { app: "pw1" };

    function matches(r: Rule, c: Conn): boolean {
      const typeOk = r.type === "host" || (r.type === "hostssl" ? c.ssl : !c.ssl);
      return typeOk && (r.user === "all" || r.user === c.user) && (r.net === "*" || c.ip.startsWith(r.net));
    }

    // Xato: yozuvlar bo'ylab yuradi va birortasi o'tkazsa kiritadi (zaxira)
    function authenticate(rules: Rule[], c: Conn): boolean {
      for (const r of rules) {
        if (!matches(r, c)) continue;
        if (r.method === "trust") return true;
        if (r.method === "scram-sha-256" && PASSWORDS[c.user] === c.password) return true;
      }
      return false;
    }

    const rules: Rule[] = [
      { type: "host", user: "all", net: "10.0.9.", method: "reject" },
      { type: "hostssl", user: "app", net: "10.", method: "scram-sha-256" },
      { type: "host", user: "all", net: "10.", method: "trust" },
    ];

    const cases: [string, Conn, boolean][] = [
      ["rad etilgan tarmoq", { ssl: true, user: "app", ip: "10.0.9.5", password: "pw1" }, false],
      ["to'g'ri parol", { ssl: true, user: "app", ip: "10.0.1.5", password: "pw1" }, true],
      ["xato parol, keyingi trust ga tushmasin", { ssl: true, user: "app", ip: "10.0.1.5", password: "bad" }, false],
      ["mos yozuv yo'q", { ssl: true, user: "app", ip: "192.168.0.1", password: "pw1" }, false],
    ];
    let bad = 0;
    for (const [name, c, want] of cases) {
      const got = authenticate(rules, c);
      if (got !== want) bad++;
      console.log(name + ": " + (got ? "KIRDI" : "RAD") + (got === want ? "" : "  <- xato"));
    }
    console.log(bad === 0 ? "OK" : bad + " ta holat noto'g'ri");
  solution: |
    type Rule = { type: "host" | "hostssl" | "hostnossl"; user: string; net: string; method: "trust" | "scram-sha-256" | "reject" };
    type Conn = { ssl: boolean; user: string; ip: string; password?: string };
    const PASSWORDS: Record<string, string> = { app: "pw1" };

    function matches(r: Rule, c: Conn): boolean {
      const typeOk = r.type === "host" || (r.type === "hostssl" ? c.ssl : !c.ssl);
      return typeOk && (r.user === "all" || r.user === c.user) && (r.net === "*" || c.ip.startsWith(r.net));
    }

    // Birinchi mos yozuv hal qiladi: zaxira yo'q, mos yozuv bo'lmasa rad
    function authenticate(rules: Rule[], c: Conn): boolean {
      const r = rules.find((x) => matches(x, c));
      if (!r || r.method === "reject") return false;
      if (r.method === "trust") return true;
      return PASSWORDS[c.user] === c.password;
    }

    const rules: Rule[] = [
      { type: "host", user: "all", net: "10.0.9.", method: "reject" },
      { type: "hostssl", user: "app", net: "10.", method: "scram-sha-256" },
      { type: "host", user: "all", net: "10.", method: "trust" },
    ];

    const cases: [string, Conn, boolean][] = [
      ["rad etilgan tarmoq", { ssl: true, user: "app", ip: "10.0.9.5", password: "pw1" }, false],
      ["to'g'ri parol", { ssl: true, user: "app", ip: "10.0.1.5", password: "pw1" }, true],
      ["xato parol, keyingi trust ga tushmasin", { ssl: true, user: "app", ip: "10.0.1.5", password: "bad" }, false],
      ["mos yozuv yo'q", { ssl: true, user: "app", ip: "192.168.0.1", password: "pw1" }, false],
    ];
    let bad = 0;
    for (const [name, c, want] of cases) {
      const got = authenticate(rules, c);
      if (got !== want) bad++;
      console.log(name + ": " + (got ? "KIRDI" : "RAD") + (got === want ? "" : "  <- xato"));
    }
    console.log(bad === 0 ? "OK" : bad + " ta holat noto'g'ri");
  solutionNotes: |
    - `Array.find` birinchi mos yozuvni qaytaradi: bu pg_hba.conf semantikasi (fall-through yo'q).
    - Model soddalashtirilgan: haqiqiy pg_hba.conf'da CIDR maskalar, ma'lum ma'lumotlar bazasi va rol nomlari, ko'p autentifikatsiya usullari va opsiyalar bor. `net` bu yerda oddiy prefiks.
    - `trust` haqiqiy hayotda ham shunday ishlaydi: hujjatga ko'ra faqat operatsion tizim darajasida yetarli himoya bo'lsagina ishlatiladi.
    - Parol tekshiruvi modelda ochiq matn bilan; haqiqiy SCRAM challenge-response va xeshlangan saqlashni qamramaydi.
  checklist:
    - "Birinchi mos yozuv hal qiladi, zaxira yo'q"
    - "Mos yozuv yo'q: rad"
    - "reject va trust to'g'ri ishlaydi"
    - "Modelning soddalashtirilgan joylarini ayta olasiz"
---

## Muammo

Ma'lumotlar bazasi va kesh ilovaning eng qimmatli qismi, ayni paytda ularning default sozlamalari ko'pincha qulaylik uchun yozilgan, xavfsizlik uchun emas. OWASP A02:2025 Security Misconfiguration xavf belgilari ro'yxatida default akkauntlar va ularning parollari yoqilgan va o'zgartirilmagan holati, hamda stekning istalgan qismida yetarli hardening yo'qligi turadi. Dars ikki aniq tizim bo'yicha shu muammoni ko'radi: PostgreSQL (client authentication, `pg_hba.conf`) va Redis (security model, ACL). Ikkalasi uchun ham asosiy manba rasmiy hujjat.

Amaliy kuzatish: ichki tarmoqdagi servislar bir-biriga ishonadi, deb ko'p konfiguratsiyalar yoziladi. "Ichkarida hamma o'zimizniki" degan faraz ilovadagi bitta RCE yoki SSRF dan keyin buziladi: hujumchi ichki tarmoqdagi bitta pod'da bo'ladi, va unga qarshi turuvchi yagona narsa ma'lumotlar bazasining o'z autentifikatsiyasi. Agar u `trust` yoki parolsiz Redis bo'lsa, qarshilik yo'q. OWASP Database Security Cheat Sheet shu sababli tarmoq izolyatsiyasi bilan birga bazaning o'z himoyasini ham talab qiladi.

Bu dars konkret bulut yoki boshqariladigan xizmat (managed PostgreSQL yoki Redis) sozlamalarini qamramaydi: ular provayder konsolida boshqariladi va farq qiladi. Quyida self-hosted yoki Kubernetes ichidagi PostgreSQL va Redis uchun hujjatlardagi tamoyillar keltiriladi.

## Asosiy g'oya

### PostgreSQL: pg_hba.conf va birinchi mos yozuv

PostgreSQL klient autentifikatsiyasini `pg_hba.conf` boshqaradi. Har yozuv ulanish turi, klient IP manzil oralig'i (kerak bo'lsa), ma'lumotlar bazasi nomi, foydalanuvchi nomi va autentifikatsiya usulini belgilaydi. Hujjatning eng muhim qoidasi: ulanish turi, klient manzili, so'ralgan baza va foydalanuvchi nomi bo'yicha birinchi mos yozuv autentifikatsiya uchun ishlatiladi. Fall-through yoki zaxira yo'q: bitta yozuv tanlangan bo'lsa va autentifikatsiya muvaffaqiyatsiz bo'lsa, keyingi yozuvlar ko'rilmaydi. Hech bir yozuv mos kelmasa kirish rad etiladi.

Bu ikki oqibat beradi. Birinchisi, yozuvlar tartibi xavfsizlik qarori: tor `reject` yoki `scram-sha-256` yozuvini keng `trust` yozuvidan keyin qo'ysangiz, u hech qachon ishlamaydi. Ikkinchisi, mos yozuv bo'lmasa rad etish default holat, ya'ni deny by default (88-dars): ruxsat aniq yoziladi.

### trust va scram-sha-256

`trust` usuli ulanishni so'zsiz qabul qiladi. Hujjat: server bilan bog'lana oladigan har kim, parolsiz yoki boshqa autentifikatsiyasiz, o'zi xohlagan PostgreSQL foydalanuvchisi sifatida kira oladi, superuser nomlari ham bundan mustasno emas. Hujjat bu usulni faqat operatsion tizim darajasida ulanishlar yetarlicha himoyalangan bo'lsagina ishlatishni aytadi: bitta foydalanuvchili ish stansiyasidagi lokal ulanish uchun qulay, ko'p foydalanuvchili mashinada odatda o'zi yetarli emas. Unix-domain socket fayliga ruxsatlar (`unix_socket_permissions`, `unix_socket_group`, `unix_socket_directories`) bilan cheklash mumkin, lekin fayl tizimi ruxsatlari faqat Unix-socket ulanishlariga yordam beradi, lokal TCP/IP ulanishlariga emas. TCP/IP ulanishlari uchun `trust` faqat shu yozuv ruxsat bergan har bir mashinadagi har bir foydalanuvchiga ishonsangiz mos keladi, va hujjat localhost (127.0.0.1) dan boshqasi uchun uni kamdan-kam asosli deb hisoblaydi.

`scram-sha-256` usuli esa RFC 7677 da tavsiflangan SCRAM-SHA-256 autentifikatsiyasini bajaradi. Hujjat uni challenge-response sxemasi deydi: ishonchsiz ulanishlarda parol sniffing'ni oldini oladi va parolni serverda kriptografik xeshlangan holda saqlashni qo'llaydi. Hujjatga ko'ra bu hozirgi mavjud usullarning eng xavfsizi, lekin eski klient kutubxonalari uni qo'llamasligi mumkin. Eski parol xeshlaridan o'tish: `password_encryption = 'scram-sha-256'` o'rnatiladi, parollar qayta o'rnatiladi, keyin `pg_hba.conf` dagi usul `scram-sha-256` ga o'zgartiriladi (hujjatdagi tartib).

## Chuqurroq: SSL, reject, Redis modeli

### Ulanish turlari va reject

`hostssl` yozuvi TCP/IP orqali, faqat SSL shifrlash bilan qilingan ulanishlarga mos keladi; `hostnossl` aksincha. `hostssl` ishlashi uchun server SSL qo'llab-quvvatlash bilan qurilgan va `ssl` parametri yoqilgan bo'lishi kerak; aks holda `hostssl` yozuvi e'tiborga olinmaydi va faqat u hech qaysi ulanishga mos kela olmasligi haqida ogohlantirish yoziladi. Ya'ni "hostssl yozdim, xavfsiz" degan taxmin SSL aslida yoqilmagan bo'lsa yolg'on. Bu yerdan qoida: konfiguratsiyani o'qish yetarli emas, uning haqiqatda ishlashini sinab ko'rish kerak.

`reject` usuli ulanishni so'zsiz rad etadi. Hujjat uni guruhdan ma'lum hostlarni "ajratib olish" uchun tavsiflaydi: bitta `reject` qatori aniq hostni bloklaydi, undan keyingi qator esa tarmoqning qolgan hostlariga kirishga ruxsat beradi. Birinchi mos yozuv qoidasi tufayli reject yozuvlari ruxsat beruvchi yozuvlardan oldin turishi kerak.

OWASP Database Security Cheat Sheet bu bilan mos tavsiyalar beradi: bazaga tarmoq kirishini cheklash (faqat localhost'ga bog'lanish yoki lokal socket, firewall bilan kerakli hostlargagina ruxsat, ilova serveridan izolyatsiyalangan ichki segment); faqat shifrlangan ulanishlarga ruxsat berish va klientda sertifikatni tekshirish (TLS 1.2+); web boshqaruv vositalarini (masalan pgAdmin) autentifikatsiya, HTTPS va tarmoq cheklovlari bilan himoyalash.

### Hisoblar, huquqlar va credential

Cheat sheet hisoblar bo'yicha: har servis uchun alohida hisob, kuchli va noyob parol, minimal huquq. Huquqlarda: o'rnatilgan `root`, `sa`, `SYS` hisoblarini ishlatmaslik; ilova hisobiga instansga ma'muriy huquq bermaslik; hisob faqat ruxsat etilgan hostlardan (odatda localhost yoki ilova serveri manzili) ulana olishi; faqat kerakli bazalarga kirishi, Development, UAT va Production uchun alohida baza va hisoblar; ko'p ilovalarga faqat `SELECT`, `UPDATE`, `DELETE` kifoya va hisob bazaning egasi bo'lmasligi kerak, chunki bu huquq oshirish zaifliklariga olib keladi. Ilovaning bazaga ulanish credential'i veb-ildizdan tashqarida, faqat kerakli foydalanuvchilar o'qiy oladigan ruxsatlar bilan va source repoga kiritilmagan holda saqlanadi (83-dars).

Bu oldingi modullarda ko'rgan SQL injection bilan bog'liq: injection topilgan taqdirda hujumchi ilova hisobining huquqi bilan ishlaydi. Hisob torroq bo'lsa, zarar kichikroq. Shuning uchun migratsiya (DDL) va ish vaqti (DML) uchun alohida hisoblarni ajratish foydali amaliyot: ilova ish vaqtida jadval o'chira olmasligi kerak.

### Redis: ishonchli muhit modeli

Redis hujjati modelni ochiq aytadi: Redis ishonchli muhitdagi ishonchli klientlar uchun mo'ljallangan. Uni to'g'ridan-to'g'ri internetga yoki ishonchsiz klientlar TCP port yoki UNIX socket'ga bevosita kira oladigan muhitga ochish odatda yaxshi fikr emas. Ishonchsiz klientlarning kirishi doimo ACL qo'llaydigan, kiritmani tekshiradigan va Redis'ga qanday amallar bajarilishini hal qiladigan qatlam orqali o'tishi kerak. Web ilovada web qismi shu vositachi.

Tarmoq xavfsizligi: Redis portiga ishonchli klientlardan boshqa hamma uchun kirish yopiq bo'lishi kerak. Hujjat firewall'ni va `bind 127.0.0.1` kabi bitta interfeysga bog'lashni tavsiya qiladi, va ochiq Redis'ning ta'sirini ko'rsatadi: bitta `FLUSHALL` buyrug'i tashqi hujumchiga butun ma'lumotlar to'plamini o'chirishga yetadi.

Protected mode: Redis 3.2.0 versiyasidan boshlab, default konfiguratsiyada (barcha interfeysga bog'langan) va kirish uchun parolsiz ishga tushganda Redis maxsus protected mode'ga o'tadi. Bu rejimda faqat loopback interfeyslardan kelgan so'rovlarga javob beradi, boshqa manzillardan ulanganlarga muammo va to'g'ri sozlash yo'lini tushuntiruvchi xato qaytaradi. Hujjat shuni qo'shadi: administrator xatoga e'tibor bermasdan protected mode'ni o'chirishi yoki barcha interfeysni qo'lda bog'lashi mumkin; ya'ni bu to'siq, kafolat emas.

### Redis autentifikatsiyasi va buyruqlar

Redis ikki autentifikatsiya usulini beradi. Tavsiya etilgani Redis 6 da kiritilgan Access Control Lists: nomli foydalanuvchilar yaratib, ularga nozik huquqlar beriladi. Eski usul `redis.conf` dagi `requirepass`: shu parol hamma klientlar uchun umumiy. Hujjat parol tez-tez sinab ko'rilishi mumkinligi va u `redis.conf` hamda klient konfiguratsiyasida saqlanishi sababli uzun bo'lishi kerakligini aytadi; autentifikatsiya qatlamining maqsadi esa firewall yoki boshqa himoya buzilgan taqdirda qo'shimcha qatlam berish. Shuningdek, `AUTH` buyrug'i ham boshqalar kabi shifrlanmagan yuboriladi, shu sababli tarmoqda tinglay oladigan hujumchidan himoya qilmaydi; Redis barcha kanallarda, ya'ni klient ulanishlari, replikatsiya va klaster shinasida, ixtiyoriy TLS qo'llab-quvvatlaydi.

ACL haqida hujjat: default foydalanuvchi `on nopass ~* &* +@all` holatida, ya'ni yoqilgan, parolsiz, barcha kalit va kanallar va barcha buyruqlarga ruxsati bor. Bu holda yangi ulanishlar `AUTH`siz ham default foydalanuvchi sifatida avtomatik autentifikatsiya qilinadi. Shuning uchun amaliy yo'l: default foydalanuvchini o'chirish yoki cheklash, ilova uchun alohida foydalanuvchi yaratish, unga faqat kerakli kalit andozasi (`~session:*`) va buyruq kategoriyalari (`+@read`, `+@write` yoki alohida buyruqlar) berish. Modelimizdagi toy ACL shu mantiqni ifodalaydi.

Eski `rename-command` usuli (masalan, `CONFIG` ni topib bo'lmaydigan nomga o'zgartirish yoki bo'sh satrga almashtirish) hujjatda eskirgan deb belgilangan va kelajakdagi versiyalarda olib tashlanishi mumkin; uning o'rniga ACL qoidalari tavsiya etiladi.

### CONFIG, RDB va root'siz ishlash

Kod xavfsizligi bo'limida hujjat jiddiy nuqtani aytadi: Redis'ga kirish tizimni boshqarishga olib kelmasligi kerak, ammo `CONFIG` buyrug'i klientga dasturning ishchi katalogini va dump fayl nomini o'zgartirishga imkon beradi. Bu klientlarga RDB fayllarni ixtiyoriy yo'llarga yozish imkonini beradi va hujjat buni Redis ishlayotgan foydalanuvchi huquqi bilan tizimni buzish yoki ishonchsiz kodni bajarishga olib kelishi mumkin bo'lgan xavfsizlik muammosi deb ataydi. Hujjat tavsiyasi: Redis root huquqlarini talab qilmaydi, uni faqat shu maqsadga mo'ljallangan root bo'lmagan `redis` foydalanuvchisi ostida ishga tushiring. 86-darsdagi non-root konteyner qoidasining aynan o'zi.

Injection haqida: Redis protokoli string escaping tushunchasiga ega emas; prefiks uzunlikli satrlar binary safe, shuning uchun oddiy klient kutubxonasi orqali injection oddiy sharoitda mumkin emas. Lua skriptlari (`EVAL`) ham shu qoidalarga amal qiladi. Istisno: skript matnini ishonchsiz manbadan olingan satrlardan yig'ishdan saqlaning.

## Misol: ishonchli tarmoq va ochiq Redis

Model ikki qismdan: `pg_hba.conf` mantiqi (birinchi mos yozuv, zaxirasiz, mos yozuv yo'q bo'lsa rad) va Redis ACL (foydalanuvchi, parol, kalit andozasi, buyruq ro'yxati). Kod faqat shu darsning o'quv modeli; haqiqiy PostgreSQL yoki Redis'ga hech narsa qilinmaydi.

### 1. Zaif kod va 2. Hujum

> **Ta'lim maqsadida.** Bu buzilgan pod'dan bazaga ulanish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

"Ichki tarmoq ishonchli" deb `10.` manzillar uchun `trust` yozilgan, undan keyin `hostssl` + `scram-sha-256`. Hujumchi buzilgan pod'dan (`10.0.9.9`) superuser sifatida ulanadi. Redis esa default foydalanuvchi bilan, parolsiz.

```ts run
// PostgreSQL: pg_hba.conf mantiqining kichik modeli
type Rule = { type: "host" | "hostssl" | "hostnossl"; user: string; net: string; method: "trust" | "scram-sha-256" | "reject" };
type Conn = { ssl: boolean; user: string; ip: string; password?: string };
const PASSWORDS: Record<string, string> = { app: "s3cret-app", postgres: "s3cret-root" };

function typeOk(r: Rule, c: Conn): boolean {
  return r.type === "host" || (r.type === "hostssl" ? c.ssl : !c.ssl);
}
function matches(r: Rule, c: Conn): boolean {
  const userOk = r.user === "all" || r.user === c.user;
  const netOk = r.net === "*" || c.ip.startsWith(r.net);
  return typeOk(r, c) && userOk && netOk;
}

// Birinchi mos yozuv hal qiladi, zaxira yo'q; mos yozuv bo'lmasa rad
function authenticate(rules: Rule[], c: Conn): string {
  const r = rules.find((x) => matches(x, c));
  if (!r) return "RAD (mos yozuv yo'q)";
  if (r.method === "reject") return "RAD (reject)";
  if (r.method === "trust") return "KIRDI (trust, parolsiz)";
  return PASSWORDS[c.user] !== undefined && PASSWORDS[c.user] === c.password ? "KIRDI (parol)" : "RAD (parol xato)";
}

// "Ichki tarmoq ishonchli" deb yozilgan
const rules: Rule[] = [
  { type: "host", user: "all", net: "10.", method: "trust" },
  { type: "hostssl", user: "all", net: "*", method: "scram-sha-256" },
];

// Bitta buzilgan pod ichki tarmoqdan superuser sifatida ulanadi
console.log("ichki, parolsiz, postgres: " + authenticate(rules, { ssl: false, user: "postgres", ip: "10.0.9.9" }));
console.log("ichki, noto'g'ri parol, postgres: " + authenticate(rules, { ssl: true, user: "postgres", ip: "10.0.9.9", password: "x" }));

// Redis: default user "nopass ~* +@all"
type RUser = { enabled: boolean; nopass: boolean; password?: string; keys: string; cmds: string[] };
const users: Record<string, RUser> = { default: { enabled: true, nopass: true, keys: "*", cmds: ["*"] } };
function redisCan(user: string, cmd: string, key: string, pw?: string): boolean {
  const u = users[user];
  if (!u || !u.enabled) return false;
  if (!u.nopass && u.password !== pw) return false;
  const keyOk = u.keys === "*" || key.startsWith(u.keys.replace("*", ""));
  return keyOk && (u.cmds.includes("*") || u.cmds.includes(cmd));
}
const tries: [string, string][] = [["GET", "session:42"], ["FLUSHALL", ""], ["CONFIG", ""]];
console.log("redis default, hujumchi: " + tries.filter(([c, k]) => redisCan("default", c, k)).length + "/" + tries.length + " buyruq ishladi");
```

```text
ichki, parolsiz, postgres: KIRDI (trust, parolsiz)
ichki, noto'g'ri parol, postgres: KIRDI (trust, parolsiz)
redis default, hujumchi: 3/3 buyruq ishladi
```

Ikkinchi so'rov ikki sababli diqqatga sazovor: u SSL va parol bilan keldi, lekin baribir kirdi, chunki birinchi yozuv mos keldi va u `trust`. `scram-sha-256` yozuvi hech qachon ko'rilmadi (fall-through yo'q). Redis'da esa o'qish, `FLUSHALL` va `CONFIG` uchalasi ham ishladi.

### 3. Tuzatilgan kod

Superuser uchun `reject` birinchi turadi, SSLsiz barcha ulanishlar rad etiladi, ilova hisobi esa faqat o'z subnet'idan, SSL bilan, parol orqali (`scram-sha-256`) kiradi. Redis'da default foydalanuvchi o'chirilgan, ilova uchun alohida ACL foydalanuvchi, parol bilan va faqat `session:*` kalitlari hamda `GET`, `SET`, `DEL` buyruqlari:

```ts run
type Rule = { type: "host" | "hostssl" | "hostnossl"; user: string; net: string; method: "trust" | "scram-sha-256" | "reject" };
type Conn = { ssl: boolean; user: string; ip: string; password?: string };
const PASSWORDS: Record<string, string> = { app: "s3cret-app", postgres: "s3cret-root" };

function typeOk(r: Rule, c: Conn): boolean {
  return r.type === "host" || (r.type === "hostssl" ? c.ssl : !c.ssl);
}
function matches(r: Rule, c: Conn): boolean {
  const userOk = r.user === "all" || r.user === c.user;
  const netOk = r.net === "*" || c.ip.startsWith(r.net);
  return typeOk(r, c) && userOk && netOk;
}
function authenticate(rules: Rule[], c: Conn): string {
  const r = rules.find((x) => matches(x, c));
  if (!r) return "RAD (mos yozuv yo'q)";
  if (r.method === "reject") return "RAD (reject)";
  if (r.method === "trust") return "KIRDI (trust, parolsiz)";
  return PASSWORDS[c.user] !== undefined && PASSWORDS[c.user] === c.password ? "KIRDI (parol)" : "RAD (parol xato)";
}

// Tuzatilgan: superuser tashqaridan umuman kirmaydi, qolganlar SSL + scram
const rules: Rule[] = [
  { type: "host", user: "postgres", net: "*", method: "reject" },
  { type: "hostnossl", user: "all", net: "*", method: "reject" },
  { type: "hostssl", user: "app", net: "10.0.1.", method: "scram-sha-256" },
];

console.log("ichki, parolsiz, postgres: " + authenticate(rules, { ssl: false, user: "postgres", ip: "10.0.9.9" }));
console.log("ichki, noto'g'ri parol, postgres: " + authenticate(rules, { ssl: true, user: "postgres", ip: "10.0.9.9", password: "x" }));
console.log("app, SSL, to'g'ri parol, 10.0.1.5: " + authenticate(rules, { ssl: true, user: "app", ip: "10.0.1.5", password: "s3cret-app" }));
console.log("app, SSLsiz, 10.0.1.5: " + authenticate(rules, { ssl: false, user: "app", ip: "10.0.1.5", password: "s3cret-app" }));
console.log("app, SSL, boshqa tarmoq 10.0.9.9: " + authenticate(rules, { ssl: true, user: "app", ip: "10.0.9.9", password: "s3cret-app" }));

type RUser = { enabled: boolean; nopass: boolean; password?: string; keys: string; cmds: string[] };
const users: Record<string, RUser> = {
  default: { enabled: false, nopass: false, keys: "", cmds: [] },
  app: { enabled: true, nopass: false, password: "long-random-redis-pw", keys: "session:*", cmds: ["GET", "SET", "DEL"] },
};
function redisCan(user: string, cmd: string, key: string, pw?: string): boolean {
  const u = users[user];
  if (!u || !u.enabled) return false;
  if (!u.nopass && u.password !== pw) return false;
  const keyOk = u.keys === "*" || key.startsWith(u.keys.replace("*", ""));
  return keyOk && (u.cmds.includes("*") || u.cmds.includes(cmd));
}
const tries: [string, string][] = [["GET", "session:42"], ["FLUSHALL", ""], ["CONFIG", ""]];
console.log("redis default, hujumchi: " + tries.filter(([c, k]) => redisCan("default", c, k)).length + "/" + tries.length + " buyruq ishladi");
console.log("redis app, parolsiz: " + tries.filter(([c, k]) => redisCan("app", c, k)).length + "/" + tries.length);
console.log("redis app, parol bilan: " + tries.filter(([c, k]) => redisCan("app", c, k, "long-random-redis-pw")).length + "/" + tries.length);
```

```text
ichki, parolsiz, postgres: RAD (reject)
ichki, noto'g'ri parol, postgres: RAD (reject)
app, SSL, to'g'ri parol, 10.0.1.5: KIRDI (parol)
app, SSLsiz, 10.0.1.5: RAD (reject)
app, SSL, boshqa tarmoq 10.0.9.9: RAD (mos yozuv yo'q)
redis default, hujumchi: 0/3 buyruq ishladi
redis app, parolsiz: 0/3
redis app, parol bilan: 1/3
```

Nima yopildi: hujumchi superuser sifatida kira olmaydi (hech bir holatda), SSLsiz kirish yo'q, boshqa subnet'dan kirish yo'q (mos yozuv yo'q), Redis'da `FLUSHALL` va `CONFIG` ACL bilan yopiq. Nima yopilmadi: ilova hisobining parolini bilgan hujumchi (masalan, ilova ichida RCE orqali parolni o'qigan) shu hisob doirasidagi ishni qiladi; shuning uchun hisob huquqlari torligi va credential saqlash (83-dars) muhim. Modelda haqiqiy TLS, SCRAM va CIDR yo'q.

### Haqiqiy konfiguratsiya

Model o'rniga real fayl va buyruqlar. Birinchisi `pg_hba.conf`: ustunlar ketma-ketligi hujjatdagi (turi, baza, foydalanuvchi, manzil, usul), superuser va SSLsiz ulanishlar ruxsat yozuvlaridan oldin rad etiladi, ilova hisobi esa faqat o'z subnet'idan SSL bilan kiradi. Subnet va hisob nomlari shartli.

```text
# TYPE      DATABASE  USER            ADDRESS         METHOD
host        all       postgres        0.0.0.0/0       reject
host        all       postgres        ::/0            reject
hostnossl   all       all             0.0.0.0/0       reject
hostssl     fleet     fleet_app       10.0.1.0/24     scram-sha-256
hostssl     fleet     fleet_migrator  10.0.2.10/32    scram-sha-256
```

`postgresql.conf` da `ssl = on` va `password_encryption = 'scram-sha-256'` bo'lishi shart (aks holda `hostssl` yozuvlari ishlamaydi, yuqorida ko'rdik). Mos yozuvi bo'lmagan hamma narsa, masalan boshqa subnet yoki IPv6, oxirida rad etiladi. Redis tomonida `redis-cli` orqali beriladigan ACL buyruqlari (sintaksis Redis ACL hujjatidagi `ACL SETUSER` misollariga mos):

```text
ACL SETUSER default off
ACL SETUSER fleet-app on >long-random-redis-pw ~session:* +get +set +del
ACL GETUSER fleet-app
```

`default off` parolsiz default foydalanuvchini o'chiradi (hujjat: u bo'lmasa yangi ulanish autentifikatsiyasiz boshlanadi va hech narsa qila olmaydi). Yangi foydalanuvchi `~session:*` kalitlari va uchta buyruq bilan cheklangan; Redis 7.0 dan Pub/Sub kanallari default holatda yopiq. Qoldiq risk: parol `redis-cli` tarixiga va klient konfiguratsiyasiga tushadi, ACL'ni qayta ishga tushirishdan keyin saqlash uchun `aclfile` yoki konfiguratsiyaga yozish kerak, va ulanish TLS siz bo'lsa parol tarmoqda ochiq ketadi.

### Mashq: Redis ACL tekshiruvi

Quyidagi `allowed` Redis ACL qoidasini modellashtiradi, lekin ikkita xatosi bor: kalit andozasini `includes` bilan tekshiradi (prefiks emas), va buyruq ro'yxatini umuman ko'rmaydi. "Tekshirish" tugmasi bilan qaysi testlar o'tmayotganini ko'ring va tuzating. Qoidalar: foydalanuvchi `on` bo'lishi shart; kalit `session:*` kabi andozaning prefiksiga mos kelishi kerak; buyruq ro'yxatda bo'lishi kerak (buyruq nomi katta-kichik harfga befarq).

```ts run
type AclUser = { on: boolean; keys: string[]; cmds: string[] };

// Redis ACL: foydalanuvchi yoqilgan, kalit andozaga mos va buyruq ruxsat etilgan bo'lsa true
function allowed(u: AclUser, cmd: string, key: string): boolean {
  if (!u.on) return false;
  return u.keys.some((p) => key.includes(p.replace("*", "")));
}
```

```ts test
const app: AclUser = { on: true, keys: ["session:*"], cmds: ["get", "set", "del"] };
check("session:42 GET ruxsat etiladi", () => allowed(app, "GET", "session:42") === true);
check("FLUSHALL ro'yxatda yo'q: rad", () => allowed(app, "FLUSHALL", "session:42") === false);
check("boshqa prefiks (user:1) rad", () => allowed(app, "GET", "user:1") === false);
check("andoza o'rtada bo'lsa rad (x:session:1)", () => allowed(app, "GET", "x:session:1") === false);
check("o'chirilgan foydalanuvchi hech narsa qila olmaydi", () => allowed({ ...app, on: false }, "GET", "session:42") === false);
check("buyruq nomi katta-kichik harfga befarq", () => allowed(app, "get", "session:42") === true);
```

### Topshiriq mantig'i

Topshiriqdagi `authenticate` boshlang'ich holatda zaxira mantig'i bilan yozilgan: yozuvlarni birma-bir ko'radi va birortasi ruxsat bersa kiritadi. Bu `reject` yozuvini va birinchi mos yozuv qoidasini buzadi. Quyida uni ishga tushiring va xato holatlarni ko'ring:

```ts run
type Rule = { type: "host" | "hostssl" | "hostnossl"; user: string; net: string; method: "trust" | "scram-sha-256" | "reject" };
type Conn = { ssl: boolean; user: string; ip: string; password?: string };
const PASSWORDS: Record<string, string> = { app: "pw1" };

function matches(r: Rule, c: Conn): boolean {
  const typeOk = r.type === "host" || (r.type === "hostssl" ? c.ssl : !c.ssl);
  return typeOk && (r.user === "all" || r.user === c.user) && (r.net === "*" || c.ip.startsWith(r.net));
}

// Xato: yozuvlar bo'ylab yuradi va birortasi o'tkazsa kiritadi (zaxira)
function authenticate(rules: Rule[], c: Conn): boolean {
  for (const r of rules) {
    if (!matches(r, c)) continue;
    if (r.method === "trust") return true;
    if (r.method === "scram-sha-256" && PASSWORDS[c.user] === c.password) return true;
  }
  return false;
}

const rules: Rule[] = [
  { type: "host", user: "all", net: "10.0.9.", method: "reject" },
  { type: "hostssl", user: "app", net: "10.", method: "scram-sha-256" },
  { type: "host", user: "all", net: "10.", method: "trust" },
];

const cases: [string, Conn, boolean][] = [
  ["rad etilgan tarmoq", { ssl: true, user: "app", ip: "10.0.9.5", password: "pw1" }, false],
  ["to'g'ri parol", { ssl: true, user: "app", ip: "10.0.1.5", password: "pw1" }, true],
  ["xato parol, keyingi trust ga tushmasin", { ssl: true, user: "app", ip: "10.0.1.5", password: "bad" }, false],
  ["mos yozuv yo'q", { ssl: true, user: "app", ip: "192.168.0.1", password: "pw1" }, false],
];
let bad = 0;
for (const [name, c, want] of cases) {
  const got = authenticate(rules, c);
  if (got !== want) bad++;
  console.log(name + ": " + (got ? "KIRDI" : "RAD") + (got === want ? "" : "  <- xato"));
}
console.log(bad === 0 ? "OK" : bad + " ta holat noto'g'ri");
```

```text
rad etilgan tarmoq: KIRDI  <- xato
to'g'ri parol: KIRDI
xato parol, keyingi trust ga tushmasin: KIRDI  <- xato
mos yozuv yo'q: RAD
2 ta holat noto'g'ri
```

## Qachon qo'llamaslik kerak

- `trust` ni lokal ish stansiyasidagi dasturlash bazasi uchun ishlatish mumkin (hujjat shuni qulay deb ataydi), lekin staging yoki production TCP/IP ulanishlari uchun emas. Dasturlash konfiguratsiyasi production'ga nusxalanib ketmasligini CI'da tekshiring.
- Redis'ni internetga ochib, faqat `requirepass` ga tayanish. Hujjat parol qatlamini firewall buzilsa ishlaydigan qo'shimcha qatlam deb ataydi, asosiy himoya sifatida emas, va `AUTH` shifrlanmagan yuboriladi.
- `rename-command` ga yangi tizimda tayanish. U hujjatda eskirgan; ACL ishlating.
- ACL va ilova hisobini "kerak bo'ladi" deb keng yozish. `+@all` va `~*` default foydalanuvchining o'zi kabi keng.
- Managed servislarda ushbu konfiguratsiya fayllarini tahrirlashga urinish. U yerda provayder boshqaradigan sozlamalar bor va bu dars ularni qamramaydi.
- `pg_hba.conf` ni faqat o'qib "tekshirildi" deb hisoblash. Masalan, SSL yoqilmagan bo'lsa `hostssl` yozuvlari ishlamaydi.

## Stack'da: NestJS/Next.js + PostgreSQL + Redis

- Ilova (Prisma yoki Kysely) uchun alohida PostgreSQL hisobi: bazaning egasi emas, faqat kerakli jadvallarda `SELECT`, `INSERT`, `UPDATE`, `DELETE` huquqi. Migratsiyalar uchun alohida hisob, faqat CI/CD'da ishlatiladi (85-dars).
- Connection string'da SSL majburiy qiling (klient kutubxonasi sozlamasi sertifikatni tekshirsin) va serverda `hostssl` + `scram-sha-256` yozuvlarini qo'llang; `trust` yo'q.
- `pg_hba.conf` ni repoda saqlang va tartibini review qiling: reject yozuvlari ruxsat yozuvlaridan oldin, oxirida mos kelmaslik rad etadi.
- Kubernetes'da (87-dars): PostgreSQL va Redis uchun NetworkPolicy faqat ilova pod'lariga ruxsat beradi; Secret'lardagi parollar etcd'da shifrlangan va kamida RBAC bilan cheklangan.
- Redis'ni session yoki kesh sifatida ishlatsangiz (NestJS cache, session store): ACL foydalanuvchi, kalit andozasi (`~session:*`), cheklangan buyruqlar, default foydalanuvchi o'chirilgan, `CONFIG` yopiq; root bo'lmagan konteyner (86-dars).
- Redis'dagi sessiya va token qiymatlari sezgir: kalitga TTL qo'ying va Redis'ni internet tarmog'idan ajratilgan segmentda ushlang.
- Parollarni `.env` fayliga qo'yib repoga yuborish 83-dars muammosining o'zi: secrets manager yoki platforma Secret'idan foydalaning.

## Xulosa

- `pg_hba.conf`: birinchi mos yozuv hal qiladi, zaxira yo'q, mos yozuv yo'q bo'lsa rad; tartib xavfsizlik qaroridir.
- `trust` har kimga istalgan foydalanuvchi sifatida kirish beradi (superuser ham); faqat OS darajasida himoya bo'lgandagina, TCP/IP uchun deyarli hech qachon.
- `scram-sha-256` mavjud usullarning eng xavfsizi; `hostssl` ishlashi uchun SSL haqiqatan yoqilgan bo'lishi kerak; `reject` ruxsat yozuvlaridan oldin turadi.
- Redis ishonchli muhit uchun: internetga ochmang, bind va firewall qo'llang; protected mode (3.2.0) to'siq, kafolat emas.
- Redis 6 ACL tavsiya etilgan usul; default foydalanuvchi parolsiz va hamma narsaga ruxsatli, shuning uchun uni o'chiring va alohida cheklangan foydalanuvchi yarating; requirepass eski, rename-command eskirgan.
- CONFIG orqali RDB'ni ixtiyoriy yo'lga yozish xavfi bor: CONFIG'ni ACL bilan yoping va Redis'ni root bo'lmagan foydalanuvchida ishga tushiring.
- Har servisga alohida, minimal huquqli hisob; credential repoga kirmaydi.
