---
n: 51
slug: access-control-modellari
title: "Access control modellari: RBAC, ABAC, ReBAC"
summary: "Authorization va authentication farqi, deny by default va least privilege, uchta asosiy access control modeli (RBAC, ABAC, ReBAC), ularning kuchli va zaif tomonlari hamda avtopark platformasida rol, atribut va munosabatni birga ishlatuvchi qaror funksiyasi."
duration: 45
sources:
  - id: cs-authz
    note: "Authorization Cheat Sheet: authorization ta'rifi, least privilege, deny by default, har so'rovda tekshirish, RBAC/ABAC/ReBAC taqqoslash va role explosion haqidagi bo'limlar"
  - id: t10-a01
    note: "A01:2025 Broken Access Control: access control ta'rifi, deny by default, yozuv egaligini model darajasida majburlash, faqat ishonchli server kodida samarali ekani"
  - id: asvs
    note: "ASVS 5.0.0, V8 Authorization: 8.1.1 va 8.1.2 (authorization qoidalarini hujjatlashtirish), 8.2.1-8.2.3 (function, data va field darajasidagi cheklov), 8.1.3 va 8.2.4 (muhit va kontekst atributlari), 8.3.1 (qarorni ishonchli server qatlamida majburlash), 8.4.1 (tenant'lararo nazorat)"
quiz:
  - q: "Platformada `dispatcher` roli `vehicle:read` huquqiga ega. Alfa kompaniyasi dispetcheri beta kompaniyasining mashinasini ochishga uringanda kod faqat rolni tekshiradi va ruxsat beradi. Muammo nimada?"
    options:
      - "Rol noto'g'ri nomlangan, `dispatcher` o'rniga `admin` ishlatish kerak"
      - "RBAC umuman ishlamaydi, uni ABAC bilan almashtirish shart"
      - "Qaror faqat subyekt atributiga (rol) tayanadi, obyekt atributi (tenant) va munosabat hisobga olinmagan"
      - "Rol tokenda saqlangani uchun xavfli, sessiyaga o'tkazish yetarli"
    answer: 2
    explain: "Rol huquq turini beradi, lekin qaysi obyektga ekanini aytmaydi. Tenant chegarasi obyektning atributi, uni qarorga qo'shish kerak. Rolni 'admin'ga o'zgartirish muammoni kuchaytiradi; RBAC'ni butunlay tashlash ham shart emas, u qarorning bir qismi bo'lib qoladi; tokenda yoki sessiyada saqlash tekshiruv mantig'idagi bo'shliqni yopmaydi."
  - q: "Cheat sheet'ga ko'ra 'deny by default' nimani anglatadi?"
    options:
      - "Hech qaysi foydalanuvchiga hech narsa ruxsat berilmaydi"
      - "Hech bir qoida mos kelmasa ham ilova qaror chiqarishi va bu qaror rad etish bo'lishi kerak"
      - "Xato bo'lganda 500 qaytariladi"
      - "Faqat admin rolidagilarga ruxsat beriladi"
    answer: 1
    explain: "Ilova betaraf qola olmaydi: har so'rovga ruxsat yoki rad javobi kerak, va qoida topilmasa javob rad bo'ladi. Birinchi variant haddan tashqari keng, uchinchisi boshqa mavzu (xato kodi), to'rtinchisi esa bitta rolni istisno qilib qo'yadi."
  - q: "Rollar soni o'sib, har mijoz uchun `dispatcher-alfa`, `dispatcher-beta` kabi yangi rollar ochila boshladi. Bu holat va uning yechimi qaysi?"
    options:
      - "Role explosion; tenant va mashina kabi atribut/munosabatlarni qarorga kiritish (ABAC/ReBAC)"
      - "Privilege creep; rollarni vaqti-vaqti bilan tekshirib turish"
      - "Horizontal escalation; sessiyani yangilash"
      - "Race condition; tranzaksiya ishlatish"
    answer: 0
    explain: "Cheat sheet role explosion'ni 'juda ko'p rol aniqlanishi' deb tasvirlaydi va multi-tenant holatda RBAC noqulay ekanini yozadi. Privilege creep boshqa hodisa: foydalanuvchi huquqi loyihadagidan oshib ketishi. Qolgan ikkitasi bu vaziyatga aloqasiz."
  - q: "Haydovchi faqat o'ziga biriktirilgan mashinani ko'ra olishi kerak. Bu qoidani eng tabiiy ifodalaydigan model qaysi?"
    options:
      - "RBAC: har mashina uchun alohida rol yaratish"
      - "ReBAC: foydalanuvchi va obyekt orasidagi munosabat (biriktirilgan) asosida"
      - "Hech qaysi model: bu qoidani faqat frontendda yashirish kerak"
      - "ABAC faqat vaqt atributi bilan"
    answer: 1
    explain: "'Foydalanuvchi bu obyektga biriktirilgan' munosabatdir, ReBAC aynan shuni ifodalaydi (cheat sheet misoli: postni yaratgan odam uni tahrirlaydi). Mashina uchun alohida rol rol sonini portlatadi. Frontendda yashirish xavfsizlik nazorati emas, vaqt atributi esa masalaga aloqasiz."
  - q: "Quyidagi qaror funksiyasida qanday xato bor?\n\n```ts\nfunction can(u: User, action: string): boolean {\n  if (u.roles.includes('admin')) return true;\n  if (action === 'export') return u.roles.includes('analyst');\n  return true;\n}\n```"
    options:
      - "Admin tekshiruvi eng boshda turgani xato"
      - "`analyst` roli noto'g'ri yozilgan"
      - "Funksiya sinxron bo'lgani uchun xavfli"
      - "Oxirgi `return true` noma'lum action'larni ham ruxsat etadi, ya'ni fail-open"
    answer: 3
    explain: "Qoidalar mos kelmasa funksiya ruxsat beradi: yangi qo'shilgan action avtomatik hamma uchun ochiq bo'ladi. To'g'ri standart rad etish. Admin tekshiruvi tartibi o'z-o'zidan xato emas, sinxronlik esa xavfsizlikka aloqasiz."
  - q: "ABAC'ning RBAC'dan afzalligi haqida qaysi gap cheat sheet bilan mos?"
    options:
      - "ABAC doim tezroq ishlaydi va sozlash osonroq"
      - "ABAC rolni inkor etadi, rol atribut bo'la olmaydi"
      - "ABAC faqat tashqi provayder bilan ishlaydi"
      - "ABAC qarorga ko'p turdagi atribut (rol, vaqt, qurilma, obyekt xususiyati) kiritishga imkon beradi, rol esa atributlardan biri bo'lib qoladi"
    answer: 3
    explain: "Cheat sheet ABAC'da rol ham atribut bo'lishi mumkinligini va qarorga vaqt, qurilma, joylashuv kabi dinamik atributlar kirishini yozadi. Boshlang'ich sozlash RBAC'da odatda osonroq ekani ham aytiladi, shuning uchun 'doim osonroq' noto'g'ri."
task:
  title: "Mashina ma'lumotini ko'rish qarori: rol, tenant va munosabat"
  prompt: |
    `can(user, vehicle, action)` funksiyasi foydalanuvchi mashina bilan nima qila olishini hal qiladi. Hozir u faqat rolga qaraydi: `dispatcher` ham, `driver` ham hamma mashinani o'qiy oladi, hatto boshqa tenant'ning mashinasini ham. Funksiyani tuzating:

    1. `dispatcher` faqat o'z tenant'ining mashinasini `read` va `update` qila oladi.
    2. `driver` faqat o'z tenant'ining ham, o'ziga biriktirilgan (`assigned`) mashinasini `read` qila oladi, `update` qila olmaydi.
    3. Noma'lum rol yoki noma'lum action uchun javob `false` bo'lsin (deny by default).

    Imzoni o'zgartirmang. Oxirgi `console.log`lar kutilgan javoblarni chiqarsin: true, false, true, false, false, false.
  lang: ts
  starter: |
    type User = { id: string; tenant: string; role: string; assigned: string[] };
    type Vehicle = { id: string; tenant: string };

    function can(user: User, vehicle: Vehicle, action: string): boolean {
      if (user.role === "dispatcher") return true;
      if (user.role === "driver") return action === "read";
      return true;
    }

    const d = { id: "u1", tenant: "alfa", role: "dispatcher", assigned: [] };
    const drv = { id: "u2", tenant: "alfa", role: "driver", assigned: ["v1"] };
    const v1 = { id: "v1", tenant: "alfa" };
    const v2 = { id: "v2", tenant: "alfa" };
    const v3 = { id: "v3", tenant: "beta" };

    console.log("dispetcher o'z tenant'i, update:", can(d, v1, "update"));
    console.log("dispetcher begona tenant:", can(d, v3, "read"));
    console.log("haydovchi biriktirilgan, read:", can(drv, v1, "read"));
    console.log("haydovchi biriktirilmagan:", can(drv, v2, "read"));
    console.log("haydovchi update:", can(drv, v1, "update"));
    console.log("noma'lum rol:", can({ ...d, role: "guest" }, v1, "read"));
  solution: |
    type User = { id: string; tenant: string; role: string; assigned: string[] };
    type Vehicle = { id: string; tenant: string };

    function can(user: User, vehicle: Vehicle, action: string): boolean {
      if (user.tenant !== vehicle.tenant) return false;
      if (user.role === "dispatcher") return action === "read" || action === "update";
      if (user.role === "driver") return action === "read" && user.assigned.includes(vehicle.id);
      return false;
    }

    const d = { id: "u1", tenant: "alfa", role: "dispatcher", assigned: [] };
    const drv = { id: "u2", tenant: "alfa", role: "driver", assigned: ["v1"] };
    const v1 = { id: "v1", tenant: "alfa" };
    const v2 = { id: "v2", tenant: "alfa" };
    const v3 = { id: "v3", tenant: "beta" };

    console.log("dispetcher o'z tenant'i, update:", can(d, v1, "update"));
    console.log("dispetcher begona tenant:", can(d, v3, "read"));
    console.log("haydovchi biriktirilgan, read:", can(drv, v1, "read"));
    console.log("haydovchi biriktirilmagan:", can(drv, v2, "read"));
    console.log("haydovchi update:", can(drv, v1, "update"));
    console.log("noma'lum rol:", can({ ...d, role: "guest" }, v1, "read"));
  solutionNotes: |
    - Tenant tengligi eng birinchi tekshiriladi va hamma rol uchun majburiy: rol huquq turini beradi, tenant esa obyekt chegarasini belgilaydi (ABAC elementi).
    - Haydovchi uchun `assigned.includes(vehicle.id)` munosabat sharti (ReBAC elementi): rol yetarli emas, obyekt bilan bog'liqlik ham kerak.
    - Funksiya oxiri `return false`: noma'lum rol va noma'lum action rad etiladi (deny by default). Yangi rol qo'shilsa, u ochiq qolmaydi.
    - Bu funksiya faqat qarorni hisoblaydi. Uni har so'rovda, har obyekt uchun chaqirishni ta'minlash alohida masala (52-58-darslar).
    - Tuzatish qoplamaydigan narsa: kim ekanligi (authentication) to'g'ri aniqlanganmi, `user.tenant` ishonchli manbadan (token yoki sessiya) olinyaptimi. Agar `user` mijoz yuborgan ma'lumotdan yig'ilsa, hamma tekshiruv ma'nosiz.
  checklist:
    - "Begona tenant mashinasiga hech qaysi rol kira olmaydi"
    - "Haydovchi faqat biriktirilgan mashinani o'qiydi va tahrirlay olmaydi"
    - "Noma'lum rol va noma'lum action `false` beradi"
    - "Funksiya oxirida `return false` turibdi, `return true` emas"
---

## Muammo

Authentication savoliga "bu kim" deb javob beradi. Authorization esa boshqa savolga: bu kim ushbu obyekt ustida ushbu amalni bajarishga haqlimi. OWASP Authorization Cheat Sheet buni shunday ajratadi: authentication bo'lgan foydalanuvchi ko'p hollarda tizim texnik imkon beradigan hamma resurs va amalga huquqli emas. Oddiy foydalanuvchi va admin ikkalasi ham kirgan, lekin ular bajara oladigan ishlar turlicha. Aksincha, login talab qilinmaydigan ommaviy resurslar ham bor.

Production'da bu ajratish tez yo'qoladi. Birinchi versiyada `if (!user) return 401` yozasiz va shu bilan "xavfsizlik" tugadi deb o'ylaysiz. Keyin `role === 'admin'` tekshiruvlari qo'shiladi. Mijoz soni oshadi, kimdir "dispetcher o'z kompaniyasining mashinalarini ko'rsin" deb talab qiladi, keyin "haydovchi faqat o'z mashinasini ko'rsin", keyin "analitik eksport qila olsin, lekin tahrirlay olmasin". Har talab alohida `if` bo'lib tarqaladi. Bitta endpoint'da `if` unutilsa, ya'ni bitta tekshiruv "o'tkazib yuborilsa", hujumchiga boshqa hech narsa kerak emas: cheat sheet aytganidek, hujumchiga faqat bitta yo'l kifoya.

Bu muammoning ko'lami katta. OWASP Top 10:2025 da A01 Broken Access Control birinchi o'rinda turadi va sahifada sinalgan ilovalarning 100 foizida access control'ning qandaydir ko'rinishdagi buzilishi topilgani yozilgan. Shuning uchun bu modul (51-60-darslar) butunlay authorization'ga bag'ishlangan. Birinchi dars modellar haqida: qaror qanday ifodalanadi. Keyingi darslar o'sha qarorni kodning qayerida, qanday majburlashni ko'radi.

## Asosiy g'oya

A01 sahifasi access control'ni quyidagicha ta'riflaydi: u siyosatni shunday amalga oshiradiki, foydalanuvchilar o'zlariga mo'ljallangan ruxsatlardan tashqariga chiqa olmaydi. Buzilganda odatiy oqibat: ma'lumotni ruxsatsiz ko'rish, o'zgartirish yoki yo'q qilish, yoki foydalanuvchi chegarasidan tashqaridagi biznes funksiyani bajarish. Sahifa va cheat sheet bir nechta tamoyilni takrorlaydi, ularni bu moduldagi har darsda ishlatamiz.

- **Least privilege.** Foydalanuvchiga ishi uchun kerak bo'lgan eng kam huquq beriladi. Cheat sheet buni gorizontal va vertikal qo'llashni talab qiladi: buxgalter va sotuv vakili ierarxiyada bir darajada bo'lishi mumkin, lekin ikkalasi turli resursga muhtoj. Tizim ishga tushgandan keyin ham huquqlar vaqti-vaqti bilan ko'rib chiqiladi, aks holda privilege creep yuz beradi: foydalanuvchining haqiqiy huquqi loyihadagidan oshib ketadi. Cheat sheet bir narsani alohida ta'kidlaydi: huquq qo'shish oson, olib tashlash qiyin.
- **Deny by default.** Ilova qoida mos kelmaganda ham qaror chiqarishi kerak, va u qaror rad etish bo'lishi kerak. Cheat sheet yana bir nozik fikr beradi: freymvork yoki kutubxona standart qiymati bo'yicha deny-by-default bo'lsa ham, aniq konfiguratsiya afzal, chunki uchinchi tomon kodining standartlari bilmagan holda o'zgarishi mumkin.
- **Har so'rovda tekshirish.** Ruxsat har so'rovda tekshirilishi kerak, so'rov AJAX'dan, server tomonidan yoki boshqa manbadan kelganidan qat'i nazar. Tekshiruv texnologiyasi global, ilova bo'yicha sozlanishi kerak, har metod va klassga alohida qo'llanadigan bo'lmasligi kerak. Sabab oddiy: majburlash qancha tarqoq bo'lsa, bittasi unutilishi ehtimoli shuncha yuqori.
- **Faqat ishonchli server kodida.** A01 sahifasiga ko'ra access control hujumchi tekshiruvni yoki metadata'ni o'zgartira olmaydigan ishonchli server kodida samarali. Frontend'dagi yashirilgan tugma yoki JavaScript tekshiruvi foydalanuvchi qulayligi uchun, nazorat emas: sahifadagi uchinchi stsenariyda butun access control frontendda bo'lgan ilovaga buyruq qatoridan `curl` bilan to'g'ridan-to'g'ri so'rov yuborish ko'rsatilgan.

### ASVS 5.0.0 V8 talablari

Cheat sheet tamoyillari ASVS 5.0.0 ning V8 Authorization bo'limida tekshiriladigan talablarga aylangan. Bo'lim maqsadi ikki gap: authorization qoidalari qaror omillari va muhit konteksti bilan hujjatlashtirilsin, va iste'molchi faqat o'z huquqlari ruxsat bergan resurslarga kira olsin. Bu modul uchun muhim talablar:

- **8.1.1** (1-daraja): hujjat funksiya darajasidagi va ma'lumotga xos kirishni iste'molchi ruxsatlari hamda resurs atributlari bo'yicha cheklash qoidalarini belgilaydi. Ya'ni "kim nima qila oladi" jadvali yozma bo'lishi kerak; cheat sheet'ning dizayn bosqichidagi "foydalanuvchi turi x resurs x amal" xaritasi aynan shu.
- **8.1.2** (2-daraja): maydon darajasidagi o'qish va yozish cheklovlari ham hujjatda bo'ladi. Qoidalar obyektning boshqa atributlariga, masalan holat (state) yoki status'ga bog'liq bo'lishi mumkin.
- **8.2.1, 8.2.2, 8.2.3**: funksiya darajasidagi, ma'lumotga xos (IDOR va BOLA'ni yopish uchun) va maydon darajasidagi (BOPLA uchun, 2-daraja) kirish faqat aniq ruxsati bor iste'molchilarga cheklanadi. Bu uch talab keyingi uch darsning o'qi: 52-dars (ma'lumotga xos), 53-dars (funksiya) va 54-dars (maydon).
- **8.3.1** (1-daraja): authorization qoidalari ishonchli servis qatlamida majburlanadi va mijoz tomonidagi JavaScript kabi o'zgartirish mumkin bo'lgan nazoratga tayanmaydi. Bu A01 sahifasidagi "faqat ishonchli server kodida" qoidasining ASVS shakli.
- **8.1.3, 8.1.4 va 8.2.4** (3-daraja): vaqt, joylashuv, IP yoki qurilma kabi muhit atributlari qarorda ishlatilsa, ular hujjatlashtiriladi va yangi sessiya boshlanganda ham, mavjud sessiya davomida ham qo'llanadi. Bu ABAC'ning "muhit sharoiti" qismiga to'g'ri keladi.
- **8.4.1** (2-daraja): multi-tenant ilovalar tenant'lararo nazoratdan foydalanadi, shunda iste'molchi amali u bilan ishlash huquqi bo'lmagan tenant'ga hech qachon ta'sir qilmaydi (55-56-darslar).

Daraja raqami talab qaysi tekshiruv chuqurligida majburiy ekanini bildiradi. Hujjatlashtirish talablari (8.1.x) kodda ko'rinmaydi, lekin auditda ularsiz "nega bu odamga ruxsat berildi" savoliga javob topilmaydi.

## Chuqurroq: uchta model

Cheat sheet access control'ning asosiy ko'rinishlarini uchta nom bilan beradi. Ular bir-birini istisno qilmaydi, amalda aralashtiriladi.

### RBAC

Role-Based Access Control'da ruxsat foydalanuvchiga emas, rolga biriktiriladi; foydalanuvchi rol orqali huquq oladi. Foydalanuvchi va rol orasidagi bog'lanish odatda many-to-many, rollar ierarxik bo'lishi mumkin. RBAC'ning kuchi: tushunish oson, audit uchun "kim qaysi rolda" ro'yxati bor, boshlang'ich sozlash sodda. Cheat sheet bu boshlang'ich soddalik tizim o'sishi bilan yo'qolishini aytadi. Aslida u buni ABAC/ReBAC'ning RBAC'dan afzalliklari ro'yxati sifatida beradi; teskari o'qilsa, bu RBAC'ning beshta zaif tomoni:

- Mantiq soddaligi. Qaror rolning bor-yo'qligiga tayanadi, shuning uchun obyekt darajasidagi (gorizontal) qarorlar va bir necha omilni talab qiladigan qarorlar uchun yaroqsiz.
- Mustahkamlik. Rollar ko'p bo'lganda tekshiruv ketma-ketligini noto'g'ri yozish oson (`hasAnyRole("SUPERUSER", "ADMIN", "ACCT_MANAGER")` kabi zanjirlar), natijada ham ortiqcha, ham yetishmaydigan ruxsat paydo bo'ladi.
- Tezlik. Role explosion: rollar haddan ko'p aniqlanadi. Agar rollar HTTP header orqali uzatilsa, header hajmi cheklangan; yechim faqat foydalanuvchi ID'sini yuborish va rollarni ilovada olish, bu esa har so'rovga kechikish qo'shadi.
- Multi-tenancy. RBAC turli tashkilotlar bir xil himoyalangan resurslardan foydalanadigan holat uchun noqulay: har mijozga alohida qoidalar to'plamini sozlash kerak bo'ladi.
- Boshqarish osonligi. RBAC'ning boshlang'ich sozlashi odatda sodda, lekin bu ustunlik tizim kattalashgani sari yo'qoladi: "User" va "Admin" kabi ikki rol production'da uzoq yetmaydi, rollar ko'payganda testlash va audit qiyinlashadi. ABAC va ReBAC esa siyosatni boshqarishni majburlash va identifikatorlarni berishdan ajratishni rag'batlantiradi.

### ABAC

Attribute-Based Access Control'da subyektning obyekt ustidagi amali subyekt atributlari, obyekt atributlari, muhit sharoiti va shu atributlar tilida yozilgan siyosatlar asosida ruxsat etiladi yoki rad etiladi (cheat sheet NIST SP 800-162 ta'rifini keltiradi). Atribut - nom-qiymat jufti: lavozim, loyiha nomi, kun vaqti, yaratilgan sana. Rol ham atributlardan biri bo'lishi mumkin, lekin yagona emas. Shuning uchun ABAC "ish vaqtida ichki tarmoqdan, lekin yarim tunda uydan emas" kabi qoidalarni ifodalaydi; cheat sheet shuning uchun ABAC least privilege'ni RBAC'dan yaxshiroq qo'llaydi, deydi. Multi-tenancy uchun ham mos: atributlar izchil aniqlangan bo'lsa, qarorlar turli infratuzilmada bajarilishi va boshqarilishi mumkin. Avtopark platformasida `vehicle.tenant == user.tenant` aynan shunday qoida.

### ReBAC

Relationship-Based Access Control resurslar orasidagi munosabatga asoslanadi: cheat sheet misoli - postni faqat uni yaratgan foydalanuvchi tahrirlay oladi. Munosabat rol emas: "bu haydovchi shu mashinaga biriktirilgan", "bu dispetcher shu filialga tegishli". Ba'zi tizimlar AND va NOT operatorlarini ham qo'llab, "X munosabati bor, Y munosabati yo'q" kabi siyosat yozishga imkon beradi. ReBAC foydalanuvchining o'z ma'lumotini boshqalardan ajratadigan har ilova uchun tabiiy: egalik, a'zolik, biriktirish.

Cheat sheet yakuniy tavsiyasi: ABAC va ReBAC odatda RBAC'dan afzal ko'riladi, chunki ular murakkab Boolean mantiqni va ko'p omilli qarorlarni qo'llaydi. Bu tavsiyani mexanik qabul qilmang. Quyida "Qachon qo'llamaslik kerak" bo'limida RBAC yetarli bo'ladigan holatlar ko'rsatilgan. Qaysi model tanlanishi esa cheat sheet'ga ko'ra SDLC'ning butun jarayoniga ta'sir qiladi, shuning uchun uni imkon qadar erta hal qilish kerak.

Dizayn bosqichi uchun cheat sheet aniq tartib beradi: ishonch chegaralarini belgilang, tizimga kiradigan foydalanuvchi turlarini, ochiq resurslarni va ular ustidagi amallarni (read, write, update) sanab chiqing, har juftlik uchun qaysi amal ruxsat etilishini rol va/yoki atributlar bo'yicha hal qiling, so'ng shu xaritani majburlovchi testlar yozing. Bu tartib 4-5-darslardagi threat modeling bilan bog'lanadi.

## Misol: uch model bitta mashinada

Quyidagi kod bitta so'rovlar to'plamini uch xil qoida bilan baholaydi. Alfa dispetcheri o'z kompaniyasining va beta kompaniyasining mashinasini, haydovchi esa o'ziga biriktirilgan va biriktirilmagan mashinani o'qimoqchi.

```ts run
type User = { id: string; tenant: string; role: "dispatcher" | "driver"; assigned: string[] };
type Vehicle = { id: string; tenant: string };

const dispatcher: User = { id: "u1", tenant: "alfa", role: "dispatcher", assigned: [] };
const driver: User = { id: "u2", tenant: "alfa", role: "driver", assigned: ["v1"] };
const vehicles: Vehicle[] = [
  { id: "v1", tenant: "alfa" },
  { id: "v2", tenant: "alfa" },
  { id: "v3", tenant: "beta" },
];

// RBAC: faqat rol
const rbac = (u: User) => u.role === "dispatcher";
// ABAC: rol + obyekt atributi (tenant)
const abac = (u: User, v: Vehicle) => u.role === "dispatcher" && u.tenant === v.tenant;
// ReBAC: biriktirish munosabati
const rebac = (u: User, v: Vehicle) => u.assigned.includes(v.id);

for (const u of [dispatcher, driver]) {
  for (const v of vehicles) {
    const row = [rbac(u), abac(u, v), rebac(u, v)].map((x) => (x ? "ha " : "yo'q"));
    console.log(`${u.role.padEnd(10)} -> ${v.id} (${v.tenant}): RBAC=${row[0]} ABAC=${row[1]} ReBAC=${row[2]}`);
  }
}
```

```text
dispatcher -> v1 (alfa): RBAC=ha  ABAC=ha  ReBAC=yo'q
dispatcher -> v2 (alfa): RBAC=ha  ABAC=ha  ReBAC=yo'q
dispatcher -> v3 (beta): RBAC=ha  ABAC=yo'q ReBAC=yo'q
driver     -> v1 (alfa): RBAC=yo'q ABAC=yo'q ReBAC=ha 
driver     -> v2 (alfa): RBAC=yo'q ABAC=yo'q ReBAC=yo'q
driver     -> v3 (beta): RBAC=yo'q ABAC=yo'q ReBAC=yo'q
```

Jadvaldan ko'rinadi: RBAC dispetcherga beta mashinasini ham ochadi (`v3` qatori), chunki rolning tenant haqida ma'lumoti yo'q. ABAC buni to'g'ri yopadi, lekin haydovchini umuman rad etadi, chunki unda rol `dispatcher` emas. ReBAC haydovchiga faqat `v1` ni beradi, lekin u o'z holicha tenant chegarasini tekshirmaydi (biriktirish yozuvi xato bo'lsa, chegara buziladi). Real qaror uchala signalni birlashtiradi. Quyida bu birlashma zaif va tuzatilgan ko'rinishda.

### 1. Zaif kod

Hozirgi tizim `vehicle:read` huquqini rolga bog'lagan va shu bilan cheklangan:

```ts run
type User = { id: string; tenant: string; role: string };
type Vehicle = { id: string; tenant: string; plate: string };

const permissions: Record<string, string[]> = {
  dispatcher: ["vehicle:read", "vehicle:update"],
  driver: ["vehicle:read"],
};
const db = new Map<string, Vehicle>([
  ["v1", { id: "v1", tenant: "alfa", plate: "01 A 111 AA" }],
  ["v3", { id: "v3", tenant: "beta", plate: "10 B 222 BB" }],
]);

// ZAIF: rol huquqni beradi, lekin obyekt qaysi tenant'ga tegishli ekani tekshirilmaydi
function readVehicleWeak(user: User, id: string): Vehicle | null {
  if (!(permissions[user.role] ?? []).includes("vehicle:read")) return null;
  return db.get(id) ?? null;
}

const alfaDispatcher: User = { id: "u1", tenant: "alfa", role: "dispatcher" };
console.log("o'z mashinasi:", readVehicleWeak(alfaDispatcher, "v1")?.plate);
console.log("begona mashina:", readVehicleWeak(alfaDispatcher, "v3")?.plate);
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu identifikatorni almashtirish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi alfa kompaniyasining oddiy dispetcheri. U brauzerda yoki `curl` bilan mashina identifikatorini `v1` dan `v3` ga almashtiradi. Hech qanday maxsus asbob kerak emas:

```text
o'z mashinasi: 01 A 111 AA
begona mashina: 10 B 222 BB
```

Rol tekshiruvi o'tdi (`dispatcher` ning `vehicle:read` huquqi bor), shuning uchun beta kompaniyasi mashinasining davlat raqami qaytdi. Bu A01'dagi "boshqa birovning yozuvini identifikator orqali ko'rish" holatining sof ko'rinishi; uning chuqur tahlili 52-darsda.

### 3. Tuzatilgan kod

Qaror rol, obyekt atributi va munosabatni birga ko'radi, hamma yo'l oxirida esa rad etish turadi:

```ts run
type User = { id: string; tenant: string; role: string; assigned: string[] };
type Vehicle = { id: string; tenant: string; plate: string };

const permissions: Record<string, string[]> = {
  dispatcher: ["vehicle:read", "vehicle:update"],
  driver: ["vehicle:read"],
};
const db = new Map<string, Vehicle>([
  ["v1", { id: "v1", tenant: "alfa", plate: "01 A 111 AA" }],
  ["v2", { id: "v2", tenant: "alfa", plate: "01 A 222 AA" }],
  ["v3", { id: "v3", tenant: "beta", plate: "10 B 222 BB" }],
]);

function decide(user: User, action: string, v: Vehicle): boolean {
  if (!(permissions[user.role] ?? []).includes(action)) return false; // rol: amal turiga huquq
  if (user.tenant !== v.tenant) return false; // ABAC: tenant chegarasi
  if (user.role === "driver") return user.assigned.includes(v.id); // ReBAC: faqat biriktirilgani
  return user.role === "dispatcher"; // ma'lum rol, boshqa hammasi rad
}

function readVehicle(user: User, id: string): Vehicle | null {
  const v = db.get(id);
  return v && decide(user, "vehicle:read", v) ? v : null; // yo'q va ruxsatsiz bir xil javob
}

const dispatcher: User = { id: "u1", tenant: "alfa", role: "dispatcher", assigned: [] };
const driver: User = { id: "u2", tenant: "alfa", role: "driver", assigned: ["v1"] };
console.log("dispetcher, o'z:", readVehicle(dispatcher, "v1")?.plate);
console.log("dispetcher, begona:", readVehicle(dispatcher, "v3")?.plate ?? "topilmadi");
console.log("haydovchi, biriktirilgan:", readVehicle(driver, "v1")?.plate);
console.log("haydovchi, biriktirilmagan:", readVehicle(driver, "v2")?.plate ?? "topilmadi");
console.log("noma'lum rol:", readVehicle({ ...driver, role: "guest" }, "v1")?.plate ?? "topilmadi");
```

```text
dispetcher, o'z: 01 A 111 AA
dispetcher, begona: topilmadi
haydovchi, biriktirilgan: 01 A 111 AA
haydovchi, biriktirilmagan: topilmadi
noma'lum rol: topilmadi
```

### Tuzatish nima uchun yetarli

Endi uchta invariant saqlanadi: amal turi roldan keladi, tenant chegarasi har rol uchun majburiy, haydovchi uchun biriktirish ham shart, va qaror funksiyasining oxiri `false`. Begona tenant dispetcheri va biriktirilmagan haydovchi rad etiladi, yangi (noma'lum) rol ham rad etiladi. Bu faqat ko'rsatilgan hujum uchun to'g'ri: tuzatish `decide` funksiyasi har so'rovda va har obyekt uchun chaqirilishini ta'minlamaydi (ro'yxat, ichma-ich obyekt va ommaviy so'rovlar 52-darsda), `user.tenant` va `user.assigned` qiymatlarining ishonchli manbadan olinishini ham kafolatlamaydi.

## Qachon qo'llamaslik kerak

Cheat sheet ABAC va ReBAC'ni afzal ko'radi, lekin ular bepul emas.

- Kichik, barqaror tizimda RBAC yetarli. Agar tizimda ikki-uch rol bo'lsa, hammasi bitta tenant ichida, obyekt darajasidagi farq yo'q (masalan, ichki admin panel), atribut dvigateli qurish ortiqcha murakkablik. Cheat sheet o'zi ham boshlang'ich sozlash RBAC'da osonroq ekanini tan oladi.
- ABAC siyosatlari kod kabi tekshirilishi kerak. Siyosat atributlarda yozilgan va ularni sinash qiyinroq: "nega bu odamga ruxsat berildi" degan savolga javob berish uchun hamma atribut qiymatini bilish kerak. Test va audit imkoniyati bo'lmasa, ABAC ko'rinmas xatolar manbaiga aylanadi.
- ReBAC munosabatlar ma'lumotiga bog'liq. Biriktirish yozuvi noto'g'ri bo'lsa, qaror noto'g'ri bo'ladi. Munosabatlar katta grafga aylanganda (guruhlar ichida guruhlar) tekshiruv narxi o'sadi, buni o'lchash kerak.
- Atribut manbai ishonchli bo'lishi shart. Atribut foydalanuvchi tomonidan o'zgartirilishi mumkin bo'lgan joydan (so'rov tanasi, o'zgartiriladigan profil maydoni) kelsa, ABAC faqat tashqi ko'rinishda mustahkam.
- Modelni almashtirish xavfsizlikni o'zi tuzatmaydi. Cheat sheet freymvork va kutubxonalarning tayyor mantig'i yetarli bo'lmasligi mumkinligini va talablar avval aniqlanib, keyin kutubxonaga moslanishi kerakligini yozadi.

## Stack'da: NestJS va Prisma

NestJS'da qaror funksiyasini bitta servisga joylashtirib, har controller undan foydalanadi (guard bilan majburlash 58-darsda). Prisma bilan ABAC tenant sharti so'rovning o'ziga `where` ichida kiradi, ReBAC sharti esa munosabat jadvali orqali. Bu kod ishga tushirilmaydi (NestJS va Prisma mijozi brauzer worker'ida yo'q), faqat sintaksis tekshirilgan.

```ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

type Actor = { id: string; tenantId: string; role: "dispatcher" | "driver" };

@Injectable()
export class VehicleAccess {
  constructor(private readonly prisma: PrismaClient) {}

  // ABAC (tenantId) va ReBAC (driver uchun assignment) shartlari so'rovning o'zida
  async getReadable(actor: Actor, vehicleId: string) {
    const where =
      actor.role === "driver"
        ? { id: vehicleId, tenantId: actor.tenantId, assignments: { some: { userId: actor.id } } }
        : actor.role === "dispatcher"
          ? { id: vehicleId, tenantId: actor.tenantId }
          : null; // noma'lum rol: so'rov ham yuborilmaydi

    const vehicle = where ? await this.prisma.vehicle.findFirst({ where }) : null;
    if (!vehicle) throw new NotFoundException();
    return vehicle;
  }
}
```

Bu yerda shart "avval ol, keyin tekshir" emas, so'rovga kiritilgan, shuning uchun begona obyekt xotiraga ham tushmaydi. Eng chuqur qatlam sifatida bu qoidani PostgreSQL darajasida ham majburlash mumkin (55-56-darslar).

## Xulosa

- Authentication kimligingizni, authorization nimaga haqligingizni aniqlaydi. Login qilgan foydalanuvchi hamma narsaga ruxsatli degani emas.
- Tamoyillar: least privilege, deny by default (qoida topilmasa rad), har so'rovda tekshirish va faqat ishonchli server kodida majburlash.
- RBAC rol bo'yicha, ABAC atribut bo'yicha, ReBAC munosabat bo'yicha qaror qiladi. Cheat sheet RBAC'ning role explosion va multi-tenancy zaifliklarini ko'rsatadi va ABAC/ReBAC'ni odatda afzal ko'radi.
- Amalda qaror aralash bo'ladi: rol amal turini, obyekt atributi (tenant) chegarani, munosabat (biriktirish) egalikni beradi, oxirida esa rad etish turadi.
- Qaror funksiyasi to'g'ri bo'lishi yetarli emas: uni hamma yo'lda majburlash va atribut manbai ishonchli ekanini ta'minlash keyingi darslar mavzusi.
