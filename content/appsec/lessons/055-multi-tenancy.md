---
n: 55
slug: multi-tenancy
title: "Multi-tenancy: tenant izolyatsiyasi"
summary: "Bir nechta mijoz kompaniyasi (tenant) bitta tizimdan foydalanganda izolyatsiya qanday buziladi: tenant kontekstining manbai, shared schema va alohida schema/baza modellari, kesh, fon vazifalari va havolalardagi yashirin chiqish yo'llari hamda tenant-scoped repository."
duration: 45
sources:
  - id: t10-a01
    note: "A01:2025 Broken Access Control: yozuv egaligini model darajasida majburlash, faqat ishonchli server kodida samaradorlik, metadata manipulation"
  - id: cs-authz
    note: "Authorization Cheat Sheet: ABAC multi-tenancy va cross-organizational so'rovlarga mos kelishi, RBAC'ning bunday holatda noqulayligi, har so'rovda tekshirish, defense in depth"
  - id: cs-multi-tenant
    note: "Multi-Tenant Application Security Cheat Sheet: Key Risks ro'yxati, tenant kontekstini server tomonida tekshirilgan identifikatsiya va a'zolikka bog'lash, izolyatsiya strategiyalari jadvali (alohida baza, alohida schema, shared tables, hybrid), kesh va session izolyatsiyasi, tenant-aware asinxron ish, fayl/blob izolyatsiyasi va tenant prefiksi chegarasi, onboarding/offboarding"
  - id: asvs
    note: "ASVS 5.0.0, V8.4.1: multi-tenant ilovalar tenant'lararo nazoratdan foydalanadi, shunda iste'molchi amali ruxsati bo'lmagan tenant'ga hech qachon ta'sir qilmaydi (2-daraja)"
  - id: prisma-ext-query
    note: "Prisma query extensions: query komponenti $allModels va $allOperations orqali hamma model operatsiyalarini o'zgartiradi; $queryRaw/$executeRaw alohida ushlanadi va raw so'rovda callback'ga model berilmaydi (undefined)"
  - id: prisma-undefined
    note: "Prisma 'Null and undefined': undefined qiymat so'rovga kiritilmaydi ('do nothing')"
  - id: pg-rls
    note: "PostgreSQL Row Security Policies: row security default-deny, referential integrity tekshiruvlari row security'ni chetlab o'tishi va covert channel ogohlantirishi; bu darsda RLS'ning o'zi emas, faqat shu ogohlantirish va kontekst uchun havola"
quiz:
  - q: "Platformada hamma jadvalda `tenant_id` ustuni bor va servis qatlami `where tenant_id = ?` qo'shadi. Yangi dasturchi hisobot endpoint'ida shu shartni unutdi. Bu qaysi modelning xos xavfi?"
    options:
      - "Database-per-tenant: har tenant'ga alohida baza"
      - "Shared schema (hamma tenant bitta jadvalda): izolyatsiya har so'rovdagi shartga bog'liq, bittasi unutilsa hamma ochiladi"
      - "Hech qaysi: `tenant_id` ustuni xavfsizlikni kafolatlaydi"
      - "Schema-per-tenant: schema nomi unutilgan"
    answer: 1
    explain: "Shared schema'da tenant chegarasi ma'lumotlar tarkibida emas, so'rov shartida yashaydi. Bittasi unutilsa kafolat yo'qoladi. Alohida baza modelida chegara fizik, lekin boshqa xarajatlar bor."
  - q: "Tenant ID'si qayerdan olinishi kerak?"
    options:
      - "`X-Tenant-Id` header'idan, chunki frontend uni yuboradi"
      - "URL query parametridan, shunda test qilish oson"
      - "Autentifikatsiya natijasidan (server tomonida tekshirilgan sessiya yoki token), mijoz yuborgan qiymatdan emas"
      - "So'rov tanasidagi `tenantId` maydonidan"
    answer: 2
    explain: "Mijoz yuborgan hamma narsani hujumchi o'zgartiradi. Tenant chegarasi autentifikatsiya natijasi bilan bog'liq ishonchli kontekstdan olinadi. Mijoz tenant tanlashi kerak bo'lsa (bir foydalanuvchi bir necha tenant'da), tanlov server tomonida a'zolik bilan tekshiriladi."
  - q: "Redis keshida hisobot `report:daily` kaliti bilan saqlanadi. Alfa so'rov yuboradi, keyin beta so'rov yuboradi. Nima bo'ladi?"
    options:
      - "Beta o'z hisobotini oladi, chunki kesh foydalanuvchini biladi"
      - "Kesh ishlamaydi va ikkalasi ham bazadan oladi"
      - "Redis kalitni tenant bo'yicha avtomatik ajratadi"
      - "Beta alfa hisobotini oladi: kalit tenant'ni o'z ichiga olmaydi"
    answer: 3
    explain: "Kesh kalit bo'yicha ishlaydi va kalit umumiy bo'lsa, birinchi to'ldirgan tenant ma'lumoti keyingilarga beriladi. Tenant kalitning ajralmas qismi bo'lishi kerak."
  - q: "Fon vazifasi (queue worker) 'kunlik hisobotni yubor' vazifasini oladi. Worker bazaga tenant filtri bo'lmagan umumiy ulanish bilan murojaat qiladi. Eng yaxshi tuzatish qaysi?"
    options:
      - "Vazifa payload'iga tenantId qo'yish va worker uni ishlov boshida tenant-scoped kontekstga o'rnatishi; kontekstsiz bazaga kirish rad etiladi"
      - "Worker'ni faqat tunda ishga tushirish"
      - "Payload'ga hamma tenant ID'larini yozish"
      - "Workerga superuser huquq berish"
    answer: 0
    explain: "HTTP so'rovdagi sessiya worker'da yo'q, shuning uchun tenant kontekstini vazifa bilan birga uzatish va ishlov boshida o'rnatish kerak. Multi-Tenant cheat sheet qo'shimcha shart qo'yadi: payload'dagi tenantId o'zi isbot emas, uni autentifikatsiyalangan producer bog'laydi, consumer esa kontekstni qayta o'rnatib amalni authorize qiladi. Superuser huquq izolyatsiyani butunlay olib tashlaydi; vaqt yoki 'hamma ID' yechim emas."
  - q: "Quyidagi sxemada qanday muammo bor?\n\n```sql\nCREATE TABLE alerts (\n  id int PRIMARY KEY,\n  tenant_id text NOT NULL,\n  vehicle_id int REFERENCES vehicles(id)\n);\n```"
    options:
      - "`id` ustuni PRIMARY KEY bo'lmasligi kerak"
      - "Tenant alert'i boshqa tenant'ning mashinasiga bog'lanishi mumkin, chunki FK faqat `id` ga tayanadi, tenant'ga emas"
      - "`tenant_id` NOT NULL bo'lishi xato"
      - "Muammo yo'q, FK hamma narsani tekshiradi"
    answer: 1
    explain: "FK mashina mavjudligini tekshiradi, lekin uning shu tenant'ga tegishliligini emas. Kompozit FK (tenant_id, vehicle_id) -> vehicles(tenant_id, id) tenant bir xilligini bazaning o'zi majburlaydi."
  - q: "Cheat sheet RBAC'ni multi-tenancy uchun qanday baholaydi?"
    options:
      - "Multi-tenancy uchun eng yaxshi model"
      - "Noqulay: turli tashkilotlar bir xil resurslardan foydalanganda har mijoz uchun alohida qoidalar to'plami sozlash kerak bo'ladi; ABAC atributlar izchil bo'lsa mos"
      - "Faqat bitta tenant bo'lsa ishlaydi"
      - "RBAC va ABAC bir xil"
    answer: 1
    explain: "Cheat sheet RBAC'ni turli tashkilot yoki mijozlar bir xil himoyalangan resurslarga kirishi kerak bo'lgan holat uchun noqulay deb baholaydi va ABAC'ni mos deb ko'rsatadi."
task:
  title: "Tenant kontekstiga bog'langan kesh"
  prompt: |
    `getReport(tenant, kind)` hisobotni hisoblaydi va keshlaydi. Hozir kesh kaliti faqat `kind`, shuning uchun birinchi so'ragan tenant natijasini keyingilar ham oladi.

    Tuzating:

    1. Kesh kaliti tenant va `kind` ni o'z ichiga oladi (`alfa:daily`).
    2. `tenant` faqat kichik lotin harflar, raqamlar va `-` dan iborat bo'lishi shart (`/^[a-z0-9-]+$/`), aks holda `Error` tashlansin. Shunda `tenant` ichiga `:` qo'yib kalitni ikkilantirib bo'lmaydi.
    3. `kind` ham xuddi shu qoidaga bo'ysunsin.
    4. Imzoni o'zgartirmang. Kutilgan chiqish: `120`, `45`, `true`, `120`.
  lang: ts
  starter: |
    const totals: Record<string, number> = { alfa: 120, beta: 45 };
    const cache = new Map<string, number>();

    function getReport(tenant: string, kind: string): number {
      const key = kind;
      if (cache.has(key)) return cache.get(key)!;
      const value = totals[tenant] ?? 0;
      cache.set(key, value);
      return value;
    }

    console.log(getReport("alfa", "daily"));
    console.log(getReport("beta", "daily"));
    let rejected = false;
    try {
      getReport("alfa:daily:x", "daily");
    } catch {
      rejected = true;
    }
    console.log(rejected);
    console.log(getReport("alfa", "daily"));
  solution: |
    const totals: Record<string, number> = { alfa: 120, beta: 45 };
    const cache = new Map<string, number>();
    const SAFE = /^[a-z0-9-]+$/;

    function getReport(tenant: string, kind: string): number {
      if (!SAFE.test(tenant) || !SAFE.test(kind)) throw new Error("noto'g'ri tenant yoki kind");
      const key = `${tenant}:${kind}`;
      if (cache.has(key)) return cache.get(key)!;
      const value = totals[tenant] ?? 0;
      cache.set(key, value);
      return value;
    }

    console.log(getReport("alfa", "daily"));
    console.log(getReport("beta", "daily"));
    let rejected = false;
    try {
      getReport("alfa:daily:x", "daily");
    } catch {
      rejected = true;
    }
    console.log(rejected);
    console.log(getReport("alfa", "daily"));
  solutionNotes: |
    - Tenant kalitning ajralmas qismi: `alfa:daily` va `beta:daily` turli yozuvlar. Boshlang'ich kodda birinchi so'rovchi natijasi hammaga berilgan.
    - Kalit qismlari tekshiriladi: ajratgich belgisi (`:`) tenant ichida bo'lsa, `alfa:daily` + `x` bilan `alfa` + `daily:x` kabi ikki xil juftlik bir xil kalit berishi mumkin edi. Allowlist regex bu noaniqlikni yo'qotadi.
    - Tenant qiymati ishonchli manbadan (sessiya) kelishi shart; bu funksiya manbani tekshirmaydi.
    - Kesh yozuvlariga muddat (TTL) va tenant bo'yicha tozalash kerak bo'ladi, bu yerda ko'rsatilmagan. Keshdagi ma'lumot ham tenant ma'lumoti: logout, tenant o'chirilishi va huquq o'zgarishida eskirgan natija qoladi.
    - Bu faqat kesh kalitini yopadi. Boshqa chiqish yo'llari (fon vazifalari, fayl yo'llari, qidiruv indeksi) alohida tekshiriladi.
  checklist:
    - "Kesh kaliti tenant va tur bilan birga tuziladi"
    - "Ajratgich belgisi bo'lgan tenant qiymati rad etiladi"
    - "Ikki tenant bir xil `kind` uchun turli natija oladi"
    - "Tuzatish qoplamaydigan chiqish yo'llarini ayta olasiz"
---

## Muammo

Platformaning har bir mijoz kompaniyasi (tenant) o'z mashinalari, haydovchilari va hisobotlarini ko'radi. Texnik jihatdan esa hammasi bitta ilova, bitta ma'lumotlar bazasi, bitta Redis. Multi-tenancy shu holatning nomi: bir kod bazasi va infratuzilma ko'p mijozga xizmat qiladi, har mijozga esa o'zini yagona foydalanuvchidek ko'rsatish kerak.

Izolyatsiya buzilganda zarar oddiy IDOR'dan katta. 52-darsdagi IDOR bitta obyektni ochadi; tenant chegarasi buzilsa, bir mijoz boshqa mijozning butun parkini, marshrutlarini va haydovchilarini ko'radi. Bu mijoz uchun biznes sirini oshkor qilish, sizning kompaniyangiz uchun esa shartnoma, obro' va huquqiy muammo. OWASP A01:2025 sahifasi shu kategoriyadagi tavsiyani beradi: model darajasida yozuv egaligi majburlanishi kerak, foydalanuvchi har yozuvni yarata, o'qiy, yangilay yoki o'chira olmasligi kerak. Tenant izolyatsiyasi shu egalikning eng yirik ko'rinishi. ASVS 5.0.0 da bu alohida talab: 8.4.1 (2-daraja) multi-tenant ilovalardan tenant'lararo nazoratni talab qiladi, shunda iste'molchi amallari u bilan ishlash huquqi bo'lmagan tenant'larga hech qachon ta'sir qilmaydi.

Asosiy qiyinchilik shundaki, tenant chegarasi bitta joyda emas. U HTTP so'rovda, SQL so'rovda, kesh kalitida, fon vazifasi payload'ida, fayl yo'lida, qidiruv indeksida, log va eksportda bo'lishi kerak. Bittasida unutilsa, chiqish yo'li ochiq qoladi. Bu dars chegara qayerlarda yashashini va uni bitta joyga qanday jamlashni ko'radi. Ma'lumotlar bazasi darajasidagi majburlash (PostgreSQL row-level security) 56-darsda.

## Asosiy g'oya

Tenant izolyatsiyasi uchta savolga javob beradi: tenant kimligi qayerdan olinadi, u qayerda saqlanadi va qayerda majburlanadi.

### Tenant kimligining manbai

Multi-Tenant Application Security Cheat Sheet shu qoidani aniq beradi: mijoz yuborgan tenant identifikatorini faqat tanlovchi (selector) deb qarang va autentifikatsiyalangan subyekt tanlangan tenant'da amal qilishga haqli ekanini tekshiring; tenant kontekstini serverda tekshirilgan identifikatsiya va joriy a'zolikka bog'lang, quyi komponentlar uni tekshirilmagan qiymat bilan almashtira olmasin. Tenant kontekstini ham erta, so'rov hayot siklining boshida (middleware yoki interceptor'da) o'rnating. Cheat sheet shuningdek tasodifiy (opaque) identifikatorlar sanab chiqishni qiyinlashtirsa ham authorization nazorati emasligini yozadi. Uning yomon misoli aynan `X-Tenant-ID` header'ini hech qanday a'zolik tekshiruvisiz tanlov sifatida ishlatadi; yaxshi misoli esa tasdiqlangan token da'vosidan tenant'ni oladi va `getActiveMembership(principal, tenant)` natijasi yo'q bo'lsa 403 qaytaradi. Shunday qilib, tenant ID autentifikatsiya natijasi bilan bog'liq, server tomonida tekshirilgan kontekstdan olinadi: sessiya yoki imzolangan token ichidagi a'zolik. Mijoz yuboradigan hamma narsa (header, query, body, hatto cookie'dagi oddiy qiymat) o'zgartiriladi. A01 sahifasi "metadata manipulation" ni, ya'ni cookie yoki yashirin maydonni o'zgartirib huquqni oshirishni, alohida zaiflik sifatida sanaydi, access control esa hujumchi tekshiruvni yoki metadata'ni o'zgartira olmaydigan ishonchli server kodida samarali ekanini aytadi. Agar foydalanuvchi bir necha tenant'da a'zo bo'lsa (masalan, auditor), "joriy tenant" tanlovi mijozdan keladi, lekin server uni a'zolik jadvali bilan tekshiradi va natijani sessiya kontekstiga yozadi.

### Qayerda majburlanadi

Defense in depth tamoyili (3-dars) bu yerda aynan qo'llanadi: Authorization Cheat Sheet hech bir freymvork yoki nazorat access control'ni majburlashning yagona vositasi bo'lib qolmasligi kerakligini aytadi. Odatda uch qatlam:

1. Ilova qatlami: har so'rov uchun tenant konteksti va tenant-scoped repository (pastda).
2. Ma'lumotlar bazasi qatlami: tenant sharti bazaning o'zida majburlanadi (row-level security, 56-dars; kompozit tashqi kalitlar, pastda).
3. Infratuzilma qatlami: juda sezgir mijozlar uchun alohida schema, alohida baza yoki alohida deployment.

### Rol yetarli emas

Cheat sheet multi-tenancy haqida aniq gapiradi: RBAC turli tashkilot yoki mijozlar bir xil himoyalangan resurslardan foydalanishi kerak bo'lgan holat uchun noqulay, chunki har mijoz uchun alohida qoidalar to'plamini sozlash kerak bo'ladi. ABAC esa atributlar izchil aniqlangan bo'lsa mos keladi. Amalda bu "dispetcher" roli ma'nosiz demak: u "alfa'ning dispetcheri" bo'lishi kerak, ya'ni qaror tenant atributi bilan to'ldiriladi (51-dars).

## Chuqurroq: modellar va chiqish yo'llari

### Uch ma'lumot modeli

Multi-Tenant Application Security Cheat Sheet to'rt strategiyani sanaydi: alohida bazalar, alohida schema'lar, umumiy jadvallar (row-level) va gibrid. Cheat sheet har birining chegarasi qanday sharoitda kuchli bo'lishini ko'rsatadi (masalan, alohida bazalar credential, tarmoq, administrativ yo'llar va backup'lar ham ajratilgan bo'lsagina kuchli). Quyidagi jadvaldagi tavsiflar kurs muallifining muhandislik baholashi:

| Model | Izolyatsiya | Qiyinchilik |
|---|---|---|
| Shared schema: hamma tenant bir jadvalda, `tenant_id` ustuni | Mantiqiy; har so'rovdagi shartga bog'liq | Eng arzon va eng oson o'sadi; eng ko'p inson xatosi xavfi |
| Schema-per-tenant: har tenant uchun alohida schema, bitta baza | Kuchliroq; noto'g'ri `search_path` xavfi | Migratsiyalar har schema'da bajariladi; schema soni ko'paysa boshqarish og'irlashadi |
| Database-per-tenant: har tenant uchun alohida baza | Eng kuchli, agar credential, tarmoq, administrativ yo'llar va backup'lar ham ajratilgan bo'lsa | Eng qimmat; ulanishlar va migratsiyalar murakkab |

Qaror xavfsizlik, narx va o'sish rejasi o'rtasida kompromiss. Shared schema ko'p mijozli SaaS'da odatiy, shuning uchun bu darsning qolgan qismi shu model ustida. Alohida baza modeli ham xatodan himoyalamaydi: ilova noto'g'ri tenant ulanishini tanlashi mumkin, shuning uchun tenant konteksti ishonchli manbadan olinishi barcha modellarda bir xil darajada muhim.

### Tenant-scoped repository

Har so'rovga qo'lda `where tenantId = ...` yozish insoniy xatoga ochiq. Yechim: tenant konteksti bir marta, ishonchli joyda o'rnatiladi va ma'lumotlar qatlami faqat shu kontekst bilan chaqiriladi. Repository tenant'ni konstruktor orqali oladi va undan tashqarida tenant sharti yozilmaydi. Natijada "tenant shartini unutish" tushunchasi kodda mavjud emas: funksiya imzosida shartni olib tashlashning o'zi imkonsiz.

### Kesh va fon vazifalari

Redis keshida kalit tenant'ni o'z ichiga olmasa, birinchi to'ldirgan tenant ma'lumotini keyingilar oladi. Eng oson to'g'rilanadigan, eng qimmatga tushadigan xato. Qoida: har kesh kaliti `tenant:resurs:identifikator` ko'rinishida, va tenant qiymati qat'iy tekshiriladi (kalitdagi ajratgichni ikkilantirish orqali boshqa tenant kalitiga tushishning oldini olish uchun).

Cheat sheet "Key Risks" ro'yxatida bu muammolarni alohida nomlaydi: cross-tenant data leakage, tenant impersonation (boshqa tenant kontekstini egallash), broken tenant isolation (baza, kesh, storage yoki compute qatlamida yetarli ajratish yo'qligi), tenant'ni ID orqali IDOR, privilege escalation across tenants (admin funksiyalar orqali boshqa tenant'ga kirish), tenant context injection, shared resource poisoning (kesh, queue, storage), noisy neighbor (bir tenant umumiy resursni tugatib, boshqalarga ta'sir qiladi, ya'ni mavjudlik muammosi, 73-dars), tenant'ni ulash va o'chirishdagi qoldiq huquqlar, hamda tenant bo'yicha audit yetishmasligi.

Kesh bo'limi cheat sheet'da aniqroq. Har keshlangan qiymat global, tenant-scoped yoki user-scoped deb tasniflanadi. Natija tenant'ga qarab o'zgaradigan har kalitga tenant identifikatori kiradi, shuningdek natijani o'zgartiradigan boshqa atributlar ham (foydalanuvchi, til, funksiyalar to'plami, permission versiyasi). Ataylab umumiy yozuvlar aniq global namespace'da turadi va nima uchun xavfsiz ekani hujjatlashtiriladi. Muhim ogohlantirish: himoyalangan keshlangan qiymatni o'qishdan oldin so'rov authorize qilinadi, chunki kalit ajratish authorization o'rnini bosmaydi.

Fon vazifalarida (queue, cron) HTTP sessiyasi yo'q. Vazifa payload'iga tenant ID yoziladi va worker ishlov boshida uni kontekstga o'rnatadi; kontekstsiz ma'lumotlar qatlami chaqiruvi rad etiladi. Lekin cheat sheet bir nozik joyni alohida ajratadi: navbatdagi xabardagi tenant identifikatori authorization isboti emas. Tenant kontekstini autentifikatsiyalangan producer'dan oling va uni xabarga ishonchli broker marshrutizatsiyasi, autentifikatsiyalangan metadata yoki yaxlitligi himoyalangan payload orqali bog'lang; consumer producer yo'lini autentifikatsiya qiladi, kontekstni qayta o'rnatadi va amal hamda maqsad resursni authorize qiladi. Vazifa kechiktirilib bajarilsa, a'zolik yoki ruxsat qayta tekshiriladi, chunki dastlabki qaror eskirgan bo'lishi mumkin. Idempotency va deduplication kalitlari, retry holati va dead-letter navbatiga kirish ham tenant bo'yicha ajratiladi. Hamma tenant'ga tegishli global vazifalar "yasama tenant" emas, aniq identifikator va doira bilan ishlaydi. Superuser ulanish bilan "hammasini ko'rish" qulay, lekin izolyatsiyani butunlay olib tashlaydi: bunday vazifalar alohida, ongli ro'yxatga olingan va audit qilingan bo'lishi kerak.

Shuningdek, fayl yo'llari (`/uploads/{tenant}/...`), qidiruv indeksi, ob'ekt storage prefikslari, email shablonlari va eksport fayllari ham tenant bilan belgilanadi. Authorization Cheat Sheet statik resurslarni ham access control siyosatiga kiritishni talab qiladi: ularni ham dinamik resurslar kabi himoyalash kerak, cloud storage sozlamalarini esa provayder hujjatiga qarab tekshirish lozim. Multi-Tenant cheat sheet blob izolyatsiyasi uchun aniqroq: tenant identifikatori allowlist'dagi kanonik formatga tekshiriladi, mutlaq yo'llar va `..` komponentlari rad etiladi (26-dars); obyekt nomi yoki prefiks o'zi authorization chegarasi emas, shuning uchun yuklash, yuklab olish, o'chirish va signed URL yaratishdan oldin aniq tenant, obyekt va amal authorize qilinadi. Tenant o'chirilganda aniq prefiks chegarasi ishlatiladi: `tenants/acme/`, `tenants/acme` emas, chunki ikkinchisi `tenants/acme-west/` ga ham mos keladi.

Tenant hayot siklining chetlari ham chiqish yo'li. Onboarding "hammasi yoki hech narsa" bo'lishi kerak: qadam muvaffaqiyatsiz bo'lsa, qisman yaratilgan resurslar olib tashlanadi. Offboarding'da tenant avval yangi amallarni rad etadigan holatga o'tkaziladi, keyin hamma faol sessiya, API kalit va tenant-scoped credential bekor qilinadi, saqlash siyosati ruxsat bergach faol ma'lumot, kesh va obyektlar o'chiriladi. Backup'dan bitta tenant'ni tiklashda umumiy snapshot jonli ma'lumot ustiga yozilmaydi.

### Ota-ona bilan bog'lanish: yashirin chiqish

Tenant ustuni bor jadvalda ham chegara buzilishi mumkin: bola yozuvi boshqa tenant'ning ota-onasiga bog'lansa. Misol: `alerts.vehicle_id` faqat `vehicles.id` ga tayanadi. Alfa foydalanuvchisi o'z signalini yaratayotib `vehicle_id` ga beta mashinasining ID'sini yuboradi. Bazaning FK tekshiruvi o'tadi (mashina mavjud), signal esa alfa'ga tegishli deb saqlanadi. Keyin signallar ro'yxati `JOIN vehicles` bilan beta mashinasining davlat raqamini alfa'ga ko'rsatadi.

```sql run
CREATE TABLE vehicles (id INTEGER PRIMARY KEY, tenant_id TEXT NOT NULL, plate TEXT NOT NULL);
CREATE TABLE alerts (id INTEGER PRIMARY KEY, tenant_id TEXT NOT NULL, vehicle_id INTEGER REFERENCES vehicles(id), kind TEXT);
INSERT INTO vehicles VALUES (1, 'alfa', '01 A 111 AA'), (2, 'beta', '10 B 222 BB');
-- alfa foydalanuvchisi o'z tenant'i uchun signal yaratadi, lekin vehicle_id beta'niki
INSERT INTO alerts VALUES (100, 'alfa', 2, 'low_fuel');
-- alfa signallar ro'yxati
SELECT a.id, a.kind, v.plate FROM alerts a JOIN vehicles v ON v.id = a.vehicle_id WHERE a.tenant_id = 'alfa';
```

```text
id | kind | plate
100 | low_fuel | 10 B 222 BB
(1 qator)
```

Tuzatish: bazaning o'zida tenant bir xilligini majburlash. Kompozit tashqi kalit (`FOREIGN KEY (tenant_id, vehicle_id) REFERENCES vehicles (tenant_id, id)`) uchun ota jadvalda `UNIQUE (tenant_id, id)` kerak. Shunda boshqa tenant mashinasiga bog'langan signal bazaning foreign key xatosi bilan rad etiladi, ilova xatosiga bog'liq bo'lmay. PostgreSQL hujjati shu mavzuda ogohlantirish beradi: referential integrity tekshiruvlari (unique va foreign key) har doim row security'ni chetlab o'tadi, shuning uchun sxema va siyosatlarni loyihalashda bu tekshiruvlar orqali yashirin ma'lumot oqishi (covert channel) ehtimoliga e'tibor berish kerak. Boshqacha aytganda, boshqa tenant'ning unique kaliti bilan to'qnashuv ("bunday email allaqachon bor") ham ma'lumot beradi. Shuning uchun global unique cheklovlar o'rniga `(tenant_id, email)` kabi tenant ichida unikal cheklovlar yaxshiroq.

## Misol: hisobot keshi

### 1. Zaif kod

```ts run
const totals: Record<string, number> = { alfa: 120, beta: 45 }; // tenant'ning bugungi yoqilg'i xarajati
const cache = new Map<string, number>();

// ZAIF: kesh kaliti tenant'ni o'z ichiga olmaydi
function getReportWeak(tenant: string, kind: string): number {
  const key = kind;
  if (cache.has(key)) return cache.get(key)!;
  const value = totals[tenant] ?? 0;
  cache.set(key, value);
  return value;
}

console.log("alfa:", getReportWeak("alfa", "daily"));
```

```text
alfa: 120
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu tenant izolyatsiyasining buzilishi namunasi faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi hech narsa qilmaydi: u shunchaki o'z hisobotini so'raydi. Kod o'zi chegarani buzadi, ikkinchi tenant keyingi navbatda keladi:

```ts run
const totals: Record<string, number> = { alfa: 120, beta: 45 };
const cache = new Map<string, number>();
function getReportWeak(tenant: string, kind: string): number {
  const key = kind;
  if (cache.has(key)) return cache.get(key)!;
  const value = totals[tenant] ?? 0;
  cache.set(key, value);
  return value;
}

console.log("alfa so'radi:", getReportWeak("alfa", "daily"));
console.log("beta so'radi (haqiqiy qiymat 45):", getReportWeak("beta", "daily"));
```

```text
alfa so'radi: 120
beta so'radi (haqiqiy qiymat 45): 120
```

Beta boshqa kompaniyaning xarajatini oldi va o'zinikini yo'qotdi. Bu hodisa hujumchi aralashuvini talab qilmaydi, lekin hujumchi uni ataylab chaqirishi mumkin: kesh to'lgan paytni kuzatib, o'sha so'rovni yuborish yetarli.

### 3. Tuzatilgan kod

```ts run
const totals: Record<string, number> = { alfa: 120, beta: 45 };
const cache = new Map<string, number>();
const SAFE = /^[a-z0-9-]+$/;

function getReport(tenant: string, kind: string): number {
  if (!SAFE.test(tenant) || !SAFE.test(kind)) throw new Error("noto'g'ri tenant yoki kind");
  const key = `${tenant}:${kind}`;
  if (cache.has(key)) return cache.get(key)!;
  const value = totals[tenant] ?? 0;
  cache.set(key, value);
  return value;
}

console.log("alfa:", getReport("alfa", "daily"));
console.log("beta:", getReport("beta", "daily"));
console.log("kesh kalitlari:", [...cache.keys()].join(", "));
try {
  getReport("alfa:daily", "x");
} catch (e) {
  console.log("rad etildi:", (e as Error).message);
}
```

```text
alfa: 120
beta: 45
kesh kalitlari: alfa:daily, beta:daily
rad etildi: noto'g'ri tenant yoki kind
```

### Tuzatish nima uchun yetarli

Kalit tenant va tur bo'yicha ikki qismdan iborat, qismlar qat'iy allowlist bilan tekshiriladi, shuning uchun ikki tenant bir kalitga tushmaydi va ajratgich orqali kalit buzib bo'lmaydi. Bu faqat ko'rsatilgan kesh chiqish yo'lini yopadi. Qoldiq risk: `tenant` qiymati ishonchli manbadan kelishi kerak, keshdagi yozuvlar TTL va tenant bo'yicha tozalanishi kerak, boshqa chiqish yo'llari (fon vazifalari, fayl yo'llari, bola yozuvlari) o'z-o'zidan yopilmaydi.

## Qachon qo'llamaslik kerak

- Alohida baza yoki deployment har mijoz uchun kichik ilovada ortiqcha. Agar tenant'lar soni o'nlab, har biri katta hajmli va qat'iy talablarga ega bo'lsa (shartnomaviy alohidalik), alohida baza oqlanadi. Minglab kichik tenant uchun u operatsion jihatdan og'ir.
- Tenant-scoped repository abstraktsiyasi kichik tizimda ortiqcha qatlam bo'lishi mumkin. Agar ilovada bitta tenant bo'lsa yoki tenant tushunchasi yo'q (ichki vosita), ma'nosiz. Xavfsizlik uchun kerak bo'lgan minimum - egalikni so'rovga kiritish (52-dars).
- Faqat ilova qatlamidagi filtrga tayanish. Bitta unutilgan shart hamma tenant'ni ochadi, shuning uchun jiddiy ma'lumot uchun ilovadan tashqari qatlam ham kerak (56-dars). Lekin RLS ham sehrli o'q emas: u ham to'g'ri o'rnatilgan kontekstga tayanadi.
- Kalitni tenant bilan prefikslash kesh urilishi (hit rate) ni kamaytiradi: umumiy ma'lumotni (masalan, ommaviy yo'l xaritasi) tenant'siz keshlash mumkin. Faqat haqiqatan umumiy bo'lgan ma'lumotni ajrating va uni tenant ma'lumotidan alohida kalit maydonida saqlang.
- Hamma tenant ma'lumotini bir kalit bilan shifrlash ham izolyatsiya emas: tenant'ga xos kalit kerak, bu 68-darsda.

## Stack'da: NestJS, Prisma va Kysely

NestJS'da tenant kontekstini so'rov doirasida saqlash uchun Node.js `AsyncLocalStorage` ishlatiladi: guard tenant'ni o'rnatadi, ma'lumotlar qatlami uni o'qiydi. Prisma'da `$extends` ning `query` komponenti `$allModels` va `$allOperations` orqali hamma model operatsiyalariga `tenantId` shartini qo'shadi. Raw so'rovlar (`$queryRaw`, `$executeRaw`) alohida operatsiya sifatida ushlanadi va callback'ga `model` berilmaydi, shuning uchun xom SQL'ga tenant shartini o'zingiz yozasiz. Eslatma: `tenantId` `undefined` bo'lsa Prisma shartni so'rovdan tushirib yuboradi (52-dars), shuning uchun kengaytma kontekst yo'q bo'lsa xato tashlashi kerak; Kysely'da repository `tenantId` ni konstruktorda oladi. Quyida Kysely repository, bu kod ishga tushirilmaydi (DB ulanishi kerak), faqat sintaksis tekshirilgan.

```ts
import { Kysely } from "kysely";

interface DB {
  vehicles: { id: number; tenant_id: string; plate: string };
}

export class VehicleRepo {
  // tenantId faqat konstruktorda: metodlar uni parametr sifatida olmaydi va o'zgartira olmaydi
  constructor(private readonly db: Kysely<DB>, private readonly tenantId: string) {}

  list() {
    return this.db.selectFrom("vehicles").selectAll().where("tenant_id", "=", this.tenantId).execute();
  }

  byId(id: number) {
    return this.db
      .selectFrom("vehicles")
      .selectAll()
      .where("tenant_id", "=", this.tenantId) // doim shart bilan birga
      .where("id", "=", id)
      .executeTakeFirst();
  }
}

// guard/middleware: tenantId autentifikatsiya natijasidan, so'rovdan emas
export const repoFor = (db: Kysely<DB>, session: { tenantId: string }) => new VehicleRepo(db, session.tenantId);
```

Prisma `$extends` va `AsyncLocalStorage` kombinatsiyasi ham mumkin, lekin kontekst yo'qolsa (fon vazifasi, `setTimeout` zanjiri) xato tashlashi kerak, jimgina filtrsiz ishlamasligi kerak: bu "fail closed" qoidasi (78-dars). Pool'li ulanishda sessiya o'zgaruvchilari bilan ishlash 56-darsda.

## Xulosa

- Multi-tenancy: bir ilova ko'p mijozga xizmat qiladi, izolyatsiya buzilishi bitta obyektdan ko'ra ancha katta zarar beradi.
- Tenant ID ishonchli manbadan (autentifikatsiya natijasi) olinadi, mijoz yuborgan header, query yoki body'dan emas.
- Shared schema arzon, lekin izolyatsiya har so'rovdagi shartga bog'liq; schema/baza ajratish kuchliroq va qimmatroq. Tanlov kompromiss.
- Chegara hamma joyda: SQL, kesh kaliti, fon vazifasi, fayl yo'li, ota-ona bog'lanishlari. Tenant-scoped repository va kompozit tashqi kalitlar bu ishni bitta joyga jamlaydi.
- RBAC bu holat uchun noqulay (cheat sheet), qaror tenant atributi bilan to'ldiriladi; bazaning o'zida majburlash (56-dars) ilova xatosidan qo'shimcha himoya beradi.
