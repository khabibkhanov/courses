---
n: 53
slug: funksiya-darajasi-authz
title: "Funksiya darajasidagi authorization va admin funksiyalari"
summary: "Broken Function Level Authorization: admin va oddiy funksiyalar orasidagi chegara, force browsing, HTTP metodlari bo'yicha tekshiruv, URL qatoriga tayangan guard'ning chetlab o'tilishi va routing bilan birga ro'yxatdan o'tadigan, standarti rad bo'lgan siyosat jadvali."
duration: 45
sources:
  - id: api-top10
    note: "API5:2023 Broken Function Level Authorization: tahdid sxemasi (Exploitability Easy, Prevalence Common, Detectability Easy, Technical Severe), 'Is the API Vulnerable' savollari (admin endpoint, GET'dan DELETE'ga almashtirish, URL'ni taxmin qilish), admin endpoint'ni URL yo'liga qarab ajratmaslik, 'How To Prevent' bandlari (yagona authorization moduli, deny all by default, admin abstract controller)"
  - id: cs-authz
    note: "Authorization Cheat Sheet: har so'rovda tekshirish, global konfiguratsiya, deny by default, client-side tekshiruvga tayanmaslik, xato holatini xavfsiz boshqarish"
  - id: asvs
    note: "ASVS 5.0.0 V8: 8.2.1 (funksiya darajasidagi kirish faqat aniq ruxsati bor iste'molchilarga, 1-daraja), 8.3.1 (ishonchli servis qatlamida majburlash), 8.4.2 (administrativ interfeys uchun ko'p qatlamli himoya, tarmoq joylashuvi yagona omil emas, 3-daraja)"
  - id: nestjs-guards
    note: "NestJS Guards: guard middleware'dan keyin, interceptor va pipe'dan oldin ishlaydi; canActivate() true bo'lsa so'rov qayta ishlanadi, false bo'lsa Nest rad etadi (ForbiddenException, 403); useGlobalGuards() va APP_GUARD; metadata uchun Reflector va @SetMetadata(); getAllAndOverride()"
  - id: t10-a01
    note: "A01:2025 Broken Access Control: force browsing, POST/PUT/DELETE uchun nazorat yo'qligi, 2- va 3-stsenariylar (admin sahifa va faqat frontendda access control)"
quiz:
  - q: "Oddiy foydalanuvchi `GET /api/users` ni ishlata oladi. U so'rov metodini `DELETE` ga o'zgartirib `/api/users/17` ni yuboradi va foydalanuvchi o'chadi. Bu qaysi zaiflik?"
    options:
      - "Broken Object Level Authorization: ID almashtirilgan"
      - "Broken Function Level Authorization: foydalanuvchi o'z rolida ruxsatsiz funksiyani chaqirdi"
      - "Mass assignment: tanada ortiqcha maydon"
      - "CSRF: so'rov boshqa saytdan yuborilgan"
    answer: 1
    explain: "Muammo ID'da emas, funksiyada: o'chirish amali o'qish amalidan alohida funksiya va uning uchun rol tekshiruvi yo'q. A01 sahifasi POST, PUT va DELETE uchun nazorat yo'q API'larni alohida ko'rsatadi. ID almashtirish BOLA bo'lardi, CSRF va mass assignment boshqa mexanizm."
  - q: "Admin sahifa `/admin/...` prefiksi bilan boshlansa, middleware `req.url.startsWith('/admin')` bo'lsa admin rolini talab qiladi. Router esa yo'lni kichik harfga o'tkazib moslaydi. Hujumchi nima qiladi?"
    options:
      - "`/Admin/users` yuboradi: middleware prefiksga mos kelmaydi, router esa admin handler'ni topadi"
      - "Hech narsa qila olmaydi, prefiks tekshiruvi yetarli"
      - "Faqat HTTPS'dan HTTP'ga o'tadi"
      - "Faqat cookie'ni o'chiradi"
    answer: 0
    explain: "Guard xom satrga qaraydi, router esa normalizatsiya qilingan yo'lni ishlatadi, ikki komponent bir yo'lni turlicha tushunadi. Tuzatish: siyosatni xom satrga emas, router topgan route'ga bog'lash."
  - q: "A01:2025 sahifasining 3-stsenariysi nimani ko'rsatadi?"
    options:
      - "Parol bazada ochiq saqlanishi"
      - "Admin sahifasi havolasi frontenddagi JavaScript bilan yashirilgan, lekin server tekshirmaydi, shuning uchun `curl` bilan to'g'ridan-to'g'ri ochiladi"
      - "SQL parametri tekshirilmaydi"
      - "CORS sozlamasi hamma originga ochiq"
    answer: 1
    explain: "Stsenariy aynan shu: butun access control frontendda bo'lsa, hujumchi brauzerni chetlab, buyruq qatoridan so'rov yuboradi. Qolgan variantlar boshqa kategoriyalar yoki A01'ning boshqa bandlari."
  - q: "Yangi controller qo'shilganda dasturchi guard dekoratorini yozishni unutdi. Qaysi dizayn bu xatoni eng yaxshi to'sadi?"
    options:
      - "Kod review'da diqqat bilan qarash"
      - "Har controller'ga alohida guard yozish"
      - "Admin route'lariga murakkab nom qo'yish"
      - "Hamma controller'lar uchun global guard, u siyosat bo'lmagan route'ni rad etadi (deny by default); ochiq route esa aniq belgilanadi"
    answer: 3
    explain: "Cheat sheet tekshiruv global, ilova bo'yicha sozlanishini va deny-by-default'ni talab qiladi. Inson diqqati yoki nomlarni murakkablashtirish nazorat emas; har controller'ga alohida yozish aynan unutish xavfini saqlaydi."
  - q: "API5 sahifasiga ko'ra funksiya darajasidagi authorization xatolari nega ko'p uchraydi?"
    options:
      - "Kriptografiya noto'g'ri ishlatilgani uchun"
      - "Ma'lumotlar bazasi noto'g'ri indeksalangani uchun"
      - "Murakkab siyosat, rol/guruh ierarxiyasi va admin hamda oddiy funksiyalar orasidagi noaniq chegara tufayli"
      - "HTTP metodlari kam bo'lgani uchun"
    answer: 2
    explain: "Sahifa aynan shu sababni keltiradi: murakkab access control siyosatlari, ierarxiyalar, guruhlar va rollar hamda administrativ va oddiy funksiyalar orasidagi noaniq ajratish. Boshqa variantlar sahifada sabab sifatida berilmagan."
task:
  title: "Siyosat jadvali: deny by default va metod bo'yicha rol"
  prompt: |
    `authorize(user, method, path)` ruxsat berilsa `true` qaytaradi. Hozirgi versiyada ikkita nuqson bor: jadvalda siyosati yozilmagan (yoki umuman topilmagan) route ochiq qoladi, va yo'l normalizatsiyasi tekshiruvda emas (`/Admin/users` pastki harfli va qo'shaloq slash bilan chetlab o'tiladi).

    Tuzating:

    1. Yo'l avval normalizatsiya qilinadi (kichik harf, ketma-ket `/` bitta `/`, oxirgi `/` olib tashlanadi).
    2. Jadvalda route topilmasa yoki `roles` yo'q bo'lsa `false`.
    3. `roles` ro'yxatda foydalanuvchi roli bo'lsa `true`, aks holda `false`. Foydalanuvchi `null` (kirmagan) bo'lsa faqat `"public"` route'ga ruxsat.
    4. Imzoni o'zgartirmang. Oxirgi `console.log`lar kutilgan natijani chiqarsin: true, false, false, false, true, false.
  lang: ts
  starter: |
    type User = { role: "driver" | "dispatcher" | "admin" } | null;
    type Route = { method: string; path: string; roles?: string[] | "public" };

    const routes: Route[] = [
      { method: "GET", path: "/vehicles", roles: ["driver", "dispatcher", "admin"] },
      { method: "DELETE", path: "/vehicles/42", roles: ["dispatcher", "admin"] },
      { method: "GET", path: "/admin/users", roles: ["admin"] },
      { method: "GET", path: "/health", roles: "public" },
      { method: "POST", path: "/reports/export" }, // siyosat yozish unutilgan
    ];

    function authorize(user: User, method: string, path: string): boolean {
      if (path.startsWith("/admin") && user?.role !== "admin") return false;
      const route = routes.find((r) => r.method === method && r.path === path);
      if (!route) return true;
      if (!route.roles) return true;
      if (route.roles === "public") return true;
      return !!user && route.roles.includes(user.role);
    }

    const driver: User = { role: "driver" };
    console.log("haydovchi GET /vehicles:", authorize(driver, "GET", "/vehicles"));
    console.log("haydovchi DELETE /vehicles/42:", authorize(driver, "DELETE", "/vehicles/42"));
    console.log("haydovchi /Admin//users:", authorize(driver, "GET", "/Admin//users"));
    console.log("haydovchi POST /reports/export:", authorize(driver, "POST", "/reports/export"));
    console.log("mehmon GET /health:", authorize(null, "GET", "/health"));
    console.log("mehmon GET /vehicles:", authorize(null, "GET", "/vehicles"));
  solution: |
    type User = { role: "driver" | "dispatcher" | "admin" } | null;
    type Route = { method: string; path: string; roles?: string[] | "public" };

    const routes: Route[] = [
      { method: "GET", path: "/vehicles", roles: ["driver", "dispatcher", "admin"] },
      { method: "DELETE", path: "/vehicles/42", roles: ["dispatcher", "admin"] },
      { method: "GET", path: "/admin/users", roles: ["admin"] },
      { method: "GET", path: "/health", roles: "public" },
      { method: "POST", path: "/reports/export" }, // siyosat yozish unutilgan
    ];

    const normalize = (p: string) => p.toLowerCase().replace(/\/+/g, "/").replace(/(.)\/$/, "$1");

    function authorize(user: User, method: string, path: string): boolean {
      const clean = normalize(path);
      const route = routes.find((r) => r.method === method && normalize(r.path) === clean);
      if (!route || !route.roles) return false; // standart: rad
      if (route.roles === "public") return true;
      return !!user && route.roles.includes(user.role);
    }

    const driver: User = { role: "driver" };
    console.log("haydovchi GET /vehicles:", authorize(driver, "GET", "/vehicles"));
    console.log("haydovchi DELETE /vehicles/42:", authorize(driver, "DELETE", "/vehicles/42"));
    console.log("haydovchi /Admin//users:", authorize(driver, "GET", "/Admin//users"));
    console.log("haydovchi POST /reports/export:", authorize(driver, "POST", "/reports/export"));
    console.log("mehmon GET /health:", authorize(null, "GET", "/health"));
    console.log("mehmon GET /vehicles:", authorize(null, "GET", "/vehicles"));
  solutionNotes: |
    - Siyosat prefiks satriga emas, normalizatsiya qilingan yo'l bilan topilgan route'ga bog'langan: guard va router bir yo'lni bir xil tushunadi.
    - `!route || !route.roles` sharti `false` qaytaradi: siyosati yo'q route yopiq (fail-safe default). Unutilgan `POST /reports/export` endi hech kimga ochiq emas.
    - Metod jadvalning kalitida: `GET /vehicles/42` va `DELETE /vehicles/42` alohida siyosat oladi.
    - Bu faqat route jadvalidagi yo'llarni qoplaydi. Parametrli yo'llar (`/vehicles/:id`) uchun shablon moslash kerak va obyekt darajasidagi egalik (52-dars) alohida.
    - Haqiqiy dasturda normalizatsiya router bilan bir manbadan olinishi kerak: ikkita alohida normalizatsiya funksiyasi yana farq berishi mumkin.
  checklist:
    - "Normalizatsiya qilinmagan yo'l (`/Admin//users`) chetlab o'tmaydi"
    - "Siyosati yo'q yoki topilmagan route rad etiladi"
    - "Metod bo'yicha farq saqlanadi (GET ruxsat, DELETE rad)"
    - "Kirmagan foydalanuvchi faqat `public` route'ga kira oladi"
---

## Muammo

52-darsda biz obyektni ID bo'yicha himoyaladik: "bu mashina sizniki". Boshqa savol: foydalanuvchi umuman shu **funksiyani** chaqirishga haqlimi. Haydovchi o'z mashinasini ko'ra oladi, lekin mijoz kompaniyasining barcha foydalanuvchilari ro'yxatini ko'rishi, rollarni o'zgartirishi yoki hisobotni eksport qilishi kerak emas. Bu funksiyalar ko'pincha alohida endpoint: `/admin/users`, `/reports/export`, `/vehicles/:id/firmware`.

API Security Top 10 (2023) buni API5:2023 Broken Function Level Authorization deb nomlaydi. Sahifa sababni aniq yozadi: murakkab access control siyosatlari, ierarxiyalar, guruhlar va rollar hamda administrativ va oddiy funksiyalar orasidagi noaniq ajratish authorization xatolariga olib keladi. Bunday xatolardan foydalanib hujumchi boshqa foydalanuvchilar resurslariga yoki administrativ funksiyalarga ega bo'ladi. Hujum uchun maxsus texnika kerak emas: sahifaga ko'ra hujumchi ruxsat etilmagan endpoint'ga qonuniy API chaqiruvi yuboradi. Administrativ funksiyalar bunday hujumning asosiy nishoni, oqibatda ma'lumot ochilishi, yo'qolishi yoki buzilishi va xizmat uzilishi mumkin. Sahifa API'larni topish osonligini ham ta'kidlaydi: ular tuzilgan va funksiyalarga murojaat oldindan taxmin qilinadigan bo'ladi. Uch baho: exploitability Easy, prevalence Common (API1'dagi Widespread emas), detectability Easy; texnik oqibat Severe.

ASVS 5.0.0 da bu 8.2.1 talabi (1-daraja): ilova funksiya darajasidagi kirishni aniq ruxsati bor iste'molchilarga cheklashi kerak. 8.2.2 (52-dars) ma'lumotning o'ziga, 8.2.3 (54-dars) maydonlarga tegishli, 8.2.1 esa "bu amalni chaqirish mumkinmi" savoliga.

A01:2025 sahifasidagi ikkinchi stsenariy xuddi shu hodisani oddiy tilda beradi: admin huquqi talab qilinadigan sahifa bor (`.../admin_getappInfo`), va agar autentifikatsiyasiz foydalanuvchi yoki admin bo'lmagan foydalanuvchi unga kira olsa, bu zaiflik. Sahifa bunday hujumni force browsing, ya'ni URL'larni taxmin qilib ochish deb ataydi.

## Asosiy g'oya

Funksiya darajasidagi authorization uchta savolga javob beradi: bu funksiya mavjudmi (foydalanuvchi uni topa oladimi), unga kim kira oladi, va har metod uchun (GET, POST, PUT, DELETE) bu qoida alohida belgilanganmi. Uch tamoyil bu moduldagi boshqa darslar bilan umumiy.

**Har so'rovda, global tekshiruv.** Authorization Cheat Sheet ruxsat har so'rovda tekshirilishi kerakligini va bu tekshiruv texnologiyasi global, ilova bo'yicha konfiguratsiyaga imkon berishi, har metod yoki klassga alohida qo'llanishi shart bo'lmasligi kerakligini yozadi. Sabab ham aytilgan: hujumchiga faqat bitta tekshiruv "o'tkazib yuborilgan" joy kerak. Ko'pchilik tekshiruv bor, bittasi yo'q holat xavfsizlik uchun yo'qlik bilan teng.

**Deny by default.** Yangi funksiya qo'shilganda unga siyosat yozilishi unutilsa, u ochiq qolmasligi kerak. Cheat sheet yangi funksionallik qo'shilganda ham deny-by-default mentalitetini saqlashni va har ruxsat berilgan huquqni asoslay olishni talab qiladi.

**Frontend nazorat emas.** A01 sahifasining 3-stsenariysida butun access control frontendda: admin sahifasiga havola JavaScript bilan yashirilgan. Hujumchi buyruq qatoridan `curl` bilan o'sha manzilni to'g'ridan-to'g'ri ochadi va yashirilgan tugma ahamiyatsiz bo'ladi. Cheat sheet ham mijoz tomonidagi tekshiruvlar foydalanuvchi qulayligi uchun ruxsat etilishi mumkin, lekin ruxsat berish yoki rad etishning hal qiluvchi omili bo'lmasligi kerakligini yozadi.

### API5 sahifasi nimani so'raydi

API5 sahifasi zaiflikni topish uchun uchta savol beradi. Oddiy foydalanuvchi administrativ endpoint'ga kira oladimi? Foydalanuvchi shunchaki HTTP metodini o'zgartirib (`GET` dan `DELETE` ga) o'zi huquqsiz sezgir amalni (yaratish, o'zgartirish, o'chirish) bajara oladimi? X guruhi foydalanuvchisi faqat Y guruhiga mo'ljallangan funksiyani endpoint manzilini taxmin qilib (sahifa misoli `/api/v1/users/export_all`) chaqira oladimi? Uchala savol ham kodga emas, matritsaga javob so'raydi: rol x funksiya x metod.

Sahifadagi birinchi stsenariy ko'rgazmali. Ilova faqat taklif etilganlarni ro'yxatdan o'tkazadi; mobil klient `GET /api/invites/{invite_guid}` ni chaqiradi va javobda taklif tafsilotlari (rol, email) bor. Hujumchi so'rovni nusxalab, metod va yo'lni `POST /api/invites/new` ga o'zgartiradi: bu endpoint faqat admin konsoli uchun mo'ljallangan, lekin funksiya darajasidagi tekshiruv yo'q. U `role: admin` bilan taklif yaratadi va keyin shu taklif orqali admin akkaunt ochadi. Bu hujumda ID almashtirilmagan, bitta obyekt ham "begona" emas: muammo faqat funksiya mavjudligida va unga hech kim chegara qo'ymaganida.

## Chuqurroq: funksiyalar chegarasi qayerda buziladi

### Metod bo'yicha tekshiruv

`GET /vehicles/42` va `DELETE /vehicles/42` bitta yo'l, ikkita funksiya. A01 sahifasi POST, PUT va DELETE uchun access control yo'q API'ni alohida sanaydi, chunki dasturchi ko'pincha "ko'rish" sahifasini himoyalab, o'zgartirish endpoint'ini unutadi. Siyosat jadvalining kaliti (metod, yo'l) juftligi bo'lishi kerak, yo'l emas. Shuningdek `HEAD`, `OPTIONS` va metodni almashtiruvchi header'lar (`X-HTTP-Method-Override` kabi) qo'llab-quvvatlansa, ular ham siyosatdan o'tishi shart. Bu so'nggi nuqtani muallif tajribasidan keltiryapman: standartda aniq bo'lim yo'q, lekin umumiy qoida (har so'rovda tekshirish) uni qamrab oladi.

### Guard va router bir yo'lni turlicha tushunadi

Funksiya darajasidagi xatolarning eng nozik turi: tekshiruv yo'lning bir ko'rinishiga, ish bajaruvchi router boshqa ko'rinishiga tayanadi. Misol: guard `req.url.startsWith("/admin")` ni qidiradi, router esa yo'lni kichik harfga o'tkazib, ortiqcha slash'larni olib tashlab, admin handler'ini topadi. `/Admin/users` guard'dan o'tadi, lekin router uchun `/admin/users`. Xuddi shunday muammo URL-encoding (`%2e`), nuqta segmentlari (`/./`), oxirgi slash va parametr ajratgichlarda ham bo'lishi mumkin. Yechim: siyosatni xom satrga emas, routing tomonidan tanlangan route yozuviga bog'lash. Ya'ni "qaysi handler ishga tushadi" aniqlangandan keyin "unga kim kiradi" savoli beriladi. Routing komponentlari orasidagi bunday farqlar 11-darsda (HTTP parser farqlari) ham uchraydi.

### Admin endpoint'ni URL'ga qarab tanimang

API5 sahifasi aniq ogohlantiradi: endpoint oddiymi yoki administrativmi, buni URL yo'liga qarab taxmin qilmang. Dasturchilar ko'pincha administrativ endpoint'larning ko'pini `/api/admins` kabi alohida nisbiy yo'l ostiga qo'yadi, lekin ularni oddiy endpoint'lar bilan birga, masalan `/api/users` ostida topish juda keng tarqalgan. Natija ikkita xato: admin funksiyaga "yo'li admin emas" deb tekshiruv qo'yilmaydi (masalan `/api/users/export_all`), va aksincha, tekshiruv `/admin/*` prefiksiga bog'lanib, prefiksdan tashqaridagi admin funksiya himoyasiz qoladi. Shuning uchun siyosat funksiyaning o'ziga biriktiriladi, uning manziliga emas.

### Admin funksiyalari uchun qo'shimcha qatlam

Admin endpoint'i ishonchsiz foydalanuvchiga ko'rinmasligi bilan emas, uni chaqirishga haqi borligi bilan himoyalanadi. API5 sahifasi ikki aniq tavsiya beradi: barcha administrativ controller'lar guruh/rolga qarab tekshiruv bajaradigan administrativ abstract controller'dan meros olsin, va oddiy controller ichidagi administrativ funksiyalar ham foydalanuvchi guruhi va roliga qarab tekshiruv qilsin. Ikkinchi band birinchisiga qo'shimcha, chunki admin funksiya hamma vaqt alohida controller'da turmaydi. ASVS 8.4.2 (3-daraja) esa administrativ interfeysga kirish ko'p qatlamli bo'lishini talab qiladi: davomli identifikatsiya tekshiruvi, qurilma holati va kontekstual risk tahlili, va tarmoq joylashuvi yoki "ishonchli" endpoint yagona omil bo'lmasligi kerak, garchi ular ehtimolni kamaytirsa ham. Ya'ni "faqat ichki tarmoqdan ochiq" admin panel uchun yetarli himoya emas. Qo'shimcha qatlamlar mantiqiy: admin API'ni alohida servisga yoki alohida ichki tarmoqqa chiqarish, kuchli autentifikatsiya talab qilish (44-45-darslar), har admin amalini audit logga yozish (79-dars). Cheat sheet loglash haqida alohida eslatadi: access control bilan bog'liq logging to'g'ri sozlanmasa, authorization buzilishlari sezilmay qolishi yoki aniq shaxsga bog'lanmay qolishi mumkin.

### Rollar murakkablashganda

API5 sahifasi sababi sifatida murakkab rol va guruh ierarxiyalarini aytadi. Misol: "dispetcher", "katta dispetcher", "filial menejeri", "analitik" va ularning uyg'unligi. Har funksiya uchun ruxsat etilgan rollarni kod ichida `if (role === 'a' || role === 'b' || ...)` ko'rinishida yozish ishonchsiz (51-dars: role explosion va mustahkamlik). Siyosat jadvali ma'lumot sifatida, bir joyda turishi kerak: shunda "kim nimaga kira oladi" savoliga kodni o'qimay javob berish va test yozish mumkin. API5 sahifasining "How To Prevent" qismi ham xuddi shuni aytadi: authorization moduli izchil va tahlil qilishga oson bo'lsin, barcha biznes funksiyalardan chaqirilsin; ko'pincha bunday himoyani ilovadan tashqaridagi komponentlar beradi; ijro mexanizmi standart bo'yicha hammasini rad etsin va har funksiya uchun muayyan rollarga aniq ruxsat talab qilsin. Bu 57-darsdagi markazlashgan policy qatlamining asosi.

### Xato holatlari

Cheat sheet "xavfsiz chiqish" talabini beradi: authorization tekshiruvining rad etilishi normal hodisa va uni rejalashtirish kerak. Rad etish holati markazlashtirilishi, istisnolar ushlanishi va ilovani beqaror holatga tushirmasligi kerak. Rad javobi ichki ma'lumot (stack trace, siyosat nomi) bermasligi kerak. Natijada xato bo'lganda ham javob rad etish, ruxsat berish emas (fail-safe, 78-dars).

## Misol: admin ro'yxati va prefiks tekshiruvi

Quyida kichik router va unga ulangan guard. Ikki versiya bitta route jadvalini ishlatadi.

### 1. Zaif kod

```ts run
type User = { name: string; role: "driver" | "admin" } | null;
type Route = { method: string; path: string; run: () => string };

const routes: Route[] = [
  { method: "GET", path: "/vehicles", run: () => "mashinalar ro'yxati" },
  { method: "GET", path: "/admin/users", run: () => "BARCHA FOYDALANUVCHILAR: aziz, bobur, dilshod" },
];

// Router yo'lni normalizatsiya qiladi: kichik harf, ketma-ket slash bitta
const normalize = (p: string) => p.toLowerCase().replace(/\/+/g, "/");

// ZAIF: guard xom satr prefiksiga qaraydi, router esa normalizatsiya qilingan yo'lni ishlatadi
function handleWeak(user: User, method: string, rawPath: string): string {
  if (rawPath.startsWith("/admin") && user?.role !== "admin") return "403";
  const route = routes.find((r) => r.method === method && r.path === normalize(rawPath));
  return route ? route.run() : "404";
}

const driver: User = { name: "haydovchi", role: "driver" };
console.log("/vehicles:", handleWeak(driver, "GET", "/vehicles"));
console.log("/admin/users:", handleWeak(driver, "GET", "/admin/users"));
```

```text
/vehicles: mashinalar ro'yxati
/admin/users: 403
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu admin yo'lini aylanib o'tish usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Haydovchi `/admin/users` da 403 oladi. U yo'lning harf registrini o'zgartiradi yoki slash qo'shadi:

```ts run
type User = { name: string; role: "driver" | "admin" } | null;
type Route = { method: string; path: string; run: () => string };
const routes: Route[] = [
  { method: "GET", path: "/vehicles", run: () => "mashinalar ro'yxati" },
  { method: "GET", path: "/admin/users", run: () => "BARCHA FOYDALANUVCHILAR: aziz, bobur, dilshod" },
];
const normalize = (p: string) => p.toLowerCase().replace(/\/+/g, "/");
function handleWeak(user: User, method: string, rawPath: string): string {
  if (rawPath.startsWith("/admin") && user?.role !== "admin") return "403";
  const route = routes.find((r) => r.method === method && r.path === normalize(rawPath));
  return route ? route.run() : "404";
}

const driver: User = { name: "haydovchi", role: "driver" };
for (const p of ["/admin/users", "/Admin/users", "//admin/users"]) {
  console.log(p.padEnd(15), "->", handleWeak(driver, "GET", p));
}
```

```text
/admin/users    -> 403
/Admin/users    -> BARCHA FOYDALANUVCHILAR: aziz, bobur, dilshod
//admin/users   -> BARCHA FOYDALANUVCHILAR: aziz, bobur, dilshod
```

Birinchi so'rov rad etildi, qolgan ikkitasi o'tdi: guard `startsWith("/admin")` ni xom satrda qidirgani uchun `/Admin` va `//admin` unga mos kelmadi, router esa ularni `/admin/users` ga keltirdi. Mexanizm universal, payload esa darslik namunasi, faqat shu o'quv kodiga qarshi.

### 3. Tuzatilgan kod

Siyosat route yozuvining o'zida turadi, guard routing natijasiga qaraydi, va roli yozilmagan route ro'yxatdan o'tmaydi:

```ts run
type Role = "driver" | "admin";
type User = { name: string; role: Role } | null;
type Route = { method: string; path: string; roles: Role[] | "public"; run: () => string };

const routes: Route[] = [];
function register(r: Partial<Route> & { method: string; path: string; run: () => string }) {
  if (!r.roles) throw new Error(`siyosat yo'q: ${r.method} ${r.path}`); // deny by default: ro'yxatdan o'tmaydi
  routes.push(r as Route);
}

register({ method: "GET", path: "/vehicles", roles: ["driver", "admin"], run: () => "mashinalar ro'yxati" });
register({ method: "GET", path: "/admin/users", roles: ["admin"], run: () => "BARCHA FOYDALANUVCHILAR" });
try {
  register({ method: "POST", path: "/reports/export", run: () => "eksport" });
} catch (e) {
  console.log("registratsiya rad etildi:", (e as Error).message);
}

const normalize = (p: string) => p.toLowerCase().replace(/\/+/g, "/");

function handle(user: User, method: string, rawPath: string): string {
  const route = routes.find((r) => r.method === method && r.path === normalize(rawPath));
  if (!route) return "404";
  const allowed = route.roles === "public" || (user !== null && route.roles.includes(user.role));
  return allowed ? route.run() : "403"; // siyosat route'ga bog'liq, yo'lning xom ko'rinishiga emas
}

const driver: User = { name: "haydovchi", role: "driver" };
for (const p of ["/admin/users", "/Admin/users", "//admin/users", "/vehicles"]) {
  console.log(p.padEnd(15), "->", handle(driver, "GET", p));
}
```

```text
registratsiya rad etildi: siyosat yo'q: POST /reports/export
/admin/users    -> 403
/Admin/users    -> 403
//admin/users   -> 403
/vehicles       -> mashinalar ro'yxati
```

### Tuzatish nima uchun yetarli

Endi guard va router orasida farq qiladigan ikki ko'rinish yo'q: avval route topiladi (bir marta, normalizatsiya qilingan yo'l bo'yicha), keyin aynan shu route yozuvidagi `roles` tekshiriladi. Roli yozilmagan route umuman ro'yxatdan o'tmaydi, shuning uchun yangi funksiya unutilgan holda ochiq bo'lmaydi. Bu faqat ko'rsatilgan registr va normalizatsiya hujumlarini yopadi. Qoldiq risk: normalizatsiya funksiyasi real routerning normalizatsiyasi bilan bir xil bo'lishi kerak (real freymvorkda siyosatni freymvorkning o'zi topgan route metadata'siga bog'lang, o'zingiz qayta normalizatsiya qilmang), parametrli yo'llar uchun shablon moslash kerak va obyekt egaligi (52-dars) alohida tekshiriladi.

## Qachon qo'llamaslik kerak

- Markazlashgan siyosat jadvali kichik ilovada ortiqcha bo'lishi mumkin. Ikki endpoint'li ichki servisda dekorator yoki bitta middleware yetadi. Muhimi: standart rad bo'lsin va tekshiruv global.
- Rol tekshiruvi funksiya darajasini hal qiladi, obyekt darajasini emas. `roles: ["dispatcher"]` dispetcherga hamma tenant'ning mashinasini ochmaydi, faqat funksiyani chaqirishga ruxsat beradi. Shuning uchun u 52-dars tekshiruvini almashtirmaydi. Ikkalasi birga kerak.
- Faqat URL prefiksi bo'yicha qamrab olish ("`/admin/*` hammasi admin") qulay, lekin ishonchsiz: prefiks tashqarisiga qo'yilgan admin funksiya (masalan, `/reports/delete-all`) himoyasiz qoladi. Prefiks siyosati ko'rsatilgan route siyosati bilan birga ishlatilsa foydali, yagona nazorat sifatida emas.
- Admin API'ni yashirish (obscurity) nazorat emas. Ichki yo'l nomi bilan "yashirish" A01'dagi force browsing hujumini to'xtatmaydi.
- Ortiqcha tekshiruv foydalanuvchi tajribasiga ham ta'sir qilishi mumkin: ochiq (`public`) route'lar (health check, login sahifasi) ro'yxatda aniq belgilangan bo'lishi kerak, aks holda deny-by-default ularni ham yopadi. Bu kamchilik emas, aniqlikka majbur qiladi.

## Stack'da: NestJS va Next.js

NestJS'da bu g'oya global guard bilan amalga oshadi. Rasmiy hujjatga ko'ra guard barcha middleware'dan keyin, lekin har qanday interceptor yoki pipe'dan oldin ishga tushadi, `canActivate()` boolean qaytaradi: `true` bo'lsa so'rov qayta ishlanadi, `false` bo'lsa Nest uni rad etadi. Guard controller, metod yoki global darajada bog'lanishi mumkin. Deny-by-default uchun global guard barcha route'larga qo'llanadi va ochiq route'lar maxsus metadata bilan belgilanadi (58-darsda to'liq). Ikkita nozik joy bor. Birinchisi: hujjatdagi `RolesGuard` namunasi `roles` metadata'si bo'lmasa `true` qaytaradi, ya'ni siyosati yozilmagan route ochiq qoladi. Bu namuna guard mexanikasini ko'rsatish uchun yozilgan; production'da aynan shu satr fail-open bo'ladi, quyidagi guard esa uni `false` ga almashtiradi. Ikkinchisi: `false` qaytarilganda freymvork `ForbiddenException` tashlaydi va standart javob 403 `Forbidden resource` bo'ladi; boshqa javob kerak bo'lsa guard o'z exception'ini tashlaydi. Metadata controller va metod darajasida berilishi mumkin, `getAllAndOverride()` esa targetlarni berilgan tartibda tekshirib birinchi aniqlangan qiymatni qaytaradi, shuning uchun metod belgisi controller belgisini bosib o'tadi. Bu kod ishga tushirilmaydi (NestJS moduli brauzer worker'ida yo'q), faqat sintaksis tekshirilgan:

```ts
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
export const Public = () => SetMetadata("public", true);

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const targets = [ctx.getHandler(), ctx.getClass()];
    if (this.reflector.getAllAndOverride<boolean>("public", targets)) return true;

    const roles = this.reflector.getAllAndOverride<string[] | undefined>("roles", targets);
    if (!roles || roles.length === 0) return false; // siyosat yo'q: rad (deny by default)

    const user = ctx.switchToHttp().getRequest().user as { role: string } | undefined;
    return !!user && roles.includes(user.role);
  }
}
```

Global ro'yxatdan o'tkazish (`APP_GUARD` provider yoki `app.useGlobalGuards`) tufayli har yangi controller shu guard'dan o'tadi; `@Roles(...)` yoki `@Public()` yozilmagan metod rad etiladi. Next.js'da server action ichidagi tekshiruv uchun 58-darsga qarang.

## Xulosa

- Funksiya darajasidagi authorization "foydalanuvchi shu amalni chaqirishga haqlimi" savoliga javob beradi va obyekt egaligidan alohida tekshiriladi. OWASP uni API5:2023 deb nomlaydi.
- Admin funksiyalar asosiy nishon: force browsing va metod almashtirish (GET o'rniga DELETE) hujumlari uchun tekshiruv har metod uchun alohida kerak.
- Frontend'da yashirish nazorat emas: server har so'rovda o'zi tekshiradi.
- Guard va router yo'lni bir xil tushunishi shart; siyosatni xom satr prefiksiga emas, routing tanlagan route yozuviga bog'lang.
- Tekshiruv global bo'lsin va standart rad bo'lsin: siyosati yozilmagan funksiya ochiq qolmasligi kerak.
