---
n: 58
slug: nestjs-nextjs-authz
title: "NestJS va Next.js'da authorization: guard, middleware, server action"
summary: "Authorization'ni freymvork qatlamlariga to'g'ri taqsimlash: NestJS guard'ning o'rni va hujjatdagi fail-open namunasi, global guard va metadata, Next.js'da Proxy (avvalgi middleware), page, layout, route handler va server action'lar alohida kirish nuqtalari ekani, Data Access Layer va DTO."
duration: 50
sources:
  - id: nestjs-guards
    note: "NestJS Guards: guard'lar barcha middleware'dan keyin, interceptor va pipe'dan oldin ishlaydi; middleware kontekstga ko'r, guard ExecutionContext orqali keyingi handler'ni biladi; canActivate boolean; false bo'lsa ForbiddenException; useGlobalGuards va APP_GUARD; Reflector metadata; hujjat namunasida metadata yo'q bo'lsa true qaytariladi"
  - id: nextjs-data-security
    note: "How to think about data security in Next.js: Data Access Layer, DTO, Server Actions to'g'ridan-to'g'ri POST bilan chaqirilishi, action ID'lari va ularning cheklovi, har action ichida authentication va authorization (egalik tekshiruvi bilan), qaytarish qiymatlarini cheklash, yopilma (closure) shifrlash, Origin va Host solishtirish, taint API, server-only, audit ro'yxati"
  - id: nextjs-authentication
    note: "Next.js Authentication guide: optimistic va secure tekshiruvlar, Proxy (middleware nomi o'zgargan) yagona himoya bo'lmasligi, layout'da tekshiruv tuzog'i, UI cheklovi yetarli emasligi, statik route'larni DAL emas Proxy himoya qilishi, cache() Server Action va Route Handler'larda takroriy chaqiruvlarni qisqartirmasligi"
  - id: cs-authz
    note: "Authorization Cheat Sheet: har so'rovda tekshirish, global konfiguratsiya, mijoz tomoni tekshiruviga tayanmaslik, xavfsiz chiqish"
  - id: nestjs-authorization
    note: "NestJS Authorization (@nestjs/authorization): siyosat sinflari, global AuthorizationGuard standart rad qiladi (faqat literal true ruxsat), @Can va @Public deklaratsiyasi, global guard'lar tartibi, 401 va 403 farqi"
  - id: nestjs-exception-filters
    note: "NestJS Exception filters: HttpException bo'lmagan (tanilmagan) istisno standart filtrda 500 Internal server error javobini beradi"
  - id: asvs
    note: "ASVS 5.0.0 V8 Authorization: 8.2.1 (funksiya darajasi), 8.2.2 (ma'lumot darajasi, IDOR va BOLA), 8.3.1 (ishonchli servis qatlamida majburlash, mijoz JavaScript'iga tayanmaslik), 8.3.3 (obyektga kirish dastlabki subyekt huquqiga asoslanadi)"
quiz:
  - q: "NestJS hujjatidagi `RolesGuard` namunasida `const roles = ...; if (!roles) return true;` yozilgan. Bu qator xavfsizlik nuqtai nazaridan nimani anglatadi va nimani o'zgartirasiz?"
    options:
      - "Xavfsiz: rol belgilanmagan route hammaga ochiq bo'lishi kerak. O'zgartirish shart emas"
      - "Fail-open: metadata yozilmagan route ochiq qoladi. Production'da siyosati yo'q route rad etilishi, ochiq route esa aniq belgilanishi kerak (masalan @Public)"
      - "Guard ishlamaydi, interceptor kerak"
      - "Faqat GraphQL'da muammo bo'ladi"
    answer: 1
    explain: "Hujjat namunasi ta'limiy: guard qanday ishlashini ko'rsatadi. Yangi controller'da dekoratorni unutish route'ni ochiq qoldiradi. Cheat sheet deny-by-default'ni talab qiladi: standart rad, ochiqlik aniq belgilanadi."
  - q: "Next.js sahifasi `if (!session?.user?.isAdmin) redirect('/login')` bilan himoyalangan va ichida `'use server'` action bor. Hujumchi sahifani ochmasdan action'ga POST yuboradi. Hujjatga ko'ra nima kerak?"
    options:
      - "Hech narsa: sahifa tekshiruvi action'ni ham qoplaydi"
      - "Faqat Proxy'da tekshirish"
      - "Action'ni boshqa fayldan import qilish"
      - "Har bir server action ichida authentication va authorization qayta tekshiriladi, chunki action alohida kirish nuqtasi"
    answer: 3
    explain: "Hujjat: sahifa darajasidagi tekshiruv ichidagi Server Action'larga tarqalmaydi, action to'g'ridan-to'g'ri POST bilan chaqirilishi mumkin va o'zi chaqiruvchini tekshirishi kerak."
  - q: "Jamoa Next.js Proxy (avvalgi middleware) ichida har route uchun DB'dan to'liq ruxsatlarni tekshiradi, boshqa joyda tekshiruv yo'q. Hujjat nimani tavsiya qiladi?"
    options:
      - "Proxy'da faqat cookie'dagi sessiyaga asoslangan optimistic tekshiruvlar; asosiy xavfsizlik tekshiruvlari ma'lumot manbaiga iloji boricha yaqin (DAL) bajariladi"
      - "Hammasini Proxy'da qoldirish, chunki u har route'da ishlaydi"
      - "Proxy'ni butunlay o'chirish"
      - "Tekshiruvni faqat layout'da qilish"
    answer: 0
    explain: "Hujjat Proxy faqat cookie'dan sessiyani o'qishi (prefetch'langan route'lar ham Proxy'dan o'tadi) va u yagona himoya chizig'i bo'lmasligi kerakligini aytadi; ko'pchilik tekshiruvlar ma'lumot manbaiga yaqin bo'lishi kerak."
  - q: "Layout ichida `if (!user) return null` yozilgan va tekshiruv shu yerda. Nega bu yetarli emas?"
    options:
      - "Layout server tomonda ishlamaydi"
      - "Layout navigatsiyada qayta render bo'lmaydi va u ichki segment va server action'larning ishlashini to'xtatmaydi"
      - "`null` qaytarish xato beradi"
      - "Layout faqat statik sahifalarda bor"
    answer: 1
    explain: "Hujjat: partial rendering sababli layout har navigatsiyada qayta tekshirilmaydi; layout qolgan route segmentlarni va parallel slot'larni to'xtatmaydi, ular RSC payload'da ham bo'lishi mumkin. Tekshiruv ma'lumot manbaiga yoki shartli renderlanadigan komponentga yaqin bo'lishi kerak."
  - q: "NestJS'da `app.useGlobalGuards(new PolicyGuard())` yozildi, guard esa `Reflector` kerak. Nima muammo bo'ladi?"
    options:
      - "Hech narsa, hammasi ishlaydi"
      - "Guard faqat controller darajasida ishlaydi"
      - "Modul tashqarisida ro'yxatdan o'tgan global guard dependency injection ishlata olmaydi; `APP_GUARD` provider bilan ro'yxatdan o'tkazish kerak"
      - "Guard ikki marta ishlaydi"
    answer: 2
    explain: "Hujjat: `useGlobalGuards()` modul kontekstidan tashqarida ro'yxatdan o'tgani uchun dependency inject qila olmaydi; `APP_GUARD` bilan modul ichida ro'yxatdan o'tgan guard esa modul qayerda bo'lishidan qat'i nazar global bo'ladi."
  - q: "Server Component ma'lumotni `SELECT *` bilan oladi va butun obyektni Client Component'ga props sifatida beradi. Hujjat bu yerda nima tavsiya qiladi?"
    options:
      - "Hech narsa: props xavfsiz"
      - "Mijozga faqat kerakli maydonlarni, Data Access Layer'dagi DTO orqali berish (taint API qo'shimcha qatlam)"
      - "Client Component'da maydonlarni yashirish"
      - "Ma'lumotni cookie'ga yozish"
    answer: 1
    explain: "Hujjat Client Component propsiga butun obyektni berishni xato namuna sifatida ko'rsatadi; DAL xavfsiz, minimal DTO qaytarishi kerak. Taint API qo'shimcha qatlam, DAL'dagi filtrlash o'rnini bosmaydi."
task:
  title: "Global guard: standart rad va ochiq route'lar"
  prompt: |
    `guard(user, meta)` NestJS guard'ining mantiqiy yadrosi. U hujjat namunasidagidek metadata bo'lmasa ruxsat beradi va `user` bo'lmaganda xato tashlaydi.

    Tuzating:

    1. `meta.public === true` bo'lsa `user` bo'lmasa ham ruxsat.
    2. `meta.roles` yo'q yoki bo'sh bo'lsa rad (deny by default).
    3. `user` yo'q bo'lsa rad (xato tashlamasdan), rol ro'yxatda bo'lsa ruxsat.
    4. Imzoni o'zgartirmang. Kutilgan natijalar: `true`, `false`, `true`, `false`, `false`.
  lang: ts
  starter: |
    type User = { id: string; tenant: string; role: string } | null;
    type Meta = { roles?: string[]; public?: boolean };

    function guard(user: User, meta: Meta): boolean {
      if (!meta.roles) return true;
      return meta.roles.includes(user!.role);
    }

    const safe = (fn: () => boolean) => {
      try { return fn(); } catch { return "xato"; }
    };
    const driver: User = { id: "u1", tenant: "alfa", role: "driver" };

    console.log("1 rol mos:", safe(() => guard(driver, { roles: ["driver"] })));
    console.log("2 metadata yo'q:", safe(() => guard(driver, {})));
    console.log("3 ochiq route, mehmon:", safe(() => guard(null, { public: true })));
    console.log("4 rol kerak, mehmon:", safe(() => guard(null, { roles: ["driver"] })));
    console.log("5 rol mos emas:", safe(() => guard(driver, { roles: ["admin"] })));
  solution: |
    type User = { id: string; tenant: string; role: string } | null;
    type Meta = { roles?: string[]; public?: boolean };

    function guard(user: User, meta: Meta): boolean {
      if (meta.public === true) return true;
      if (!meta.roles || meta.roles.length === 0) return false;
      return !!user && meta.roles.includes(user.role);
    }

    const safe = (fn: () => boolean) => {
      try { return fn(); } catch { return "xato"; }
    };
    const driver: User = { id: "u1", tenant: "alfa", role: "driver" };

    console.log("1 rol mos:", safe(() => guard(driver, { roles: ["driver"] })));
    console.log("2 metadata yo'q:", safe(() => guard(driver, {})));
    console.log("3 ochiq route, mehmon:", safe(() => guard(null, { public: true })));
    console.log("4 rol kerak, mehmon:", safe(() => guard(null, { roles: ["driver"] })));
    console.log("5 rol mos emas:", safe(() => guard(driver, { roles: ["admin"] })));
  solutionNotes: |
    - Ochiqlik `public === true` bilan aniq belgilanadi; metadata'ning yo'qligi ochiqlik emas, rad.
    - `!meta.roles || meta.roles.length === 0` sharti bo'sh ro'yxatni ham rad qiladi: `@Roles()` argumentsiz yozilsa, tasodifan hamma o'tmaydi.
    - `!!user &&` sharti `null` foydalanuvchi uchun xato tashlamaydi va rad qaytaradi. Guard ichida oddiy `Error` tashlash NestJS'da tanilmagan istisno sifatida 500 beradi; rad etish esa aniq 403 yoki 401 bo'ladi.
    - Bu guard faqat funksiya darajasini (53-dars) hal qiladi. Obyekt egaligi (52-dars) va maydonlar (54-dars) servis qatlamida alohida tekshiriladi.
    - Real NestJS'da `meta` ni `Reflector.getAllAndOverride` bilan handler va class darajasidan o'qiysiz; shuning uchun handler metadata'si class metadata'sini ustun qiladi, va ular qanday birlashishini sinab ko'ring.
  checklist:
    - "Metadata'siz route rad etiladi"
    - "Ochiq route `public === true` bilan aniq belgilanadi"
    - "Mehmon foydalanuvchi uchun guard xato tashlamaydi"
    - "Bo'sh `roles` ro'yxati ham rad etadi"
---

## Muammo

Authorization qoidalarini bilish bilan ularni to'g'ri joyga qo'yish boshqa narsa. NestJS va Next.js har biri request hayot tsiklida bir nechta qatlam beradi: middleware, guard, pipe, interceptor, controller; Proxy, layout, page, server component, route handler, server action. Har qatlamda "bu yerda tekshirsam yetadi" degan vasvasa bor. Natijada tekshiruv ko'pincha noto'g'ri qatlamda turadi yoki bir yo'lda bor, boshqasida yo'q.

Ikki tipik xato. NestJS'da dasturchi yangi controller yozadi va `@Roles('dispatcher')` dekoratorini yozishni unutadi; guard metadata topmasa `true` qaytaradi (hujjatdagi namunadek) va endpoint hamma uchun ochiq bo'lib qoladi. Next.js'da sahifa `redirect('/login')` bilan himoyalangan, ichida server action bor; dasturchi sahifa himoyalangan, demak action ham himoyalangan deb hisoblaydi, hujumchi esa action'ga to'g'ridan-to'g'ri POST yuboradi.

Bu darsning maqsadi: har freymvorkda qaysi qatlam nimani kafolatlashini, qaysi biri yagona himoya bo'la olmasligini va standart xatti-harakatni (deny by default) qanday o'rnatishni ko'rsatish. 53-darsdagi funksiya darajasi, 52-darsdagi obyekt darajasi va 54-darsdagi xossa darajasi shu qatlamlarda amalga oshadi.

## Asosiy g'oya

Authorization Cheat Sheet'ning to'rt talabi ikkala freymvorkka tegadi: ruxsat har so'rovda tekshiriladi; tekshiruv texnologiyasi global konfiguratsiyaga imkon beradi; mijoz tomonidagi tekshiruv hal qiluvchi bo'lmaydi; tekshiruv rad etilganda ilova beqaror holatga tushmaydi. Freymvorklarda bu quyidagi tamoyillarga aylanadi.

1. **Qaror aniq kirish nuqtasida.** Har kirish nuqtasi (controller metodi, route handler, server action) o'z authorization'ini oladi yoki global qatlam orqali oladi. Bitta kirish nuqtasi himoyalanganidan boshqasi himoyalanmaydi.
2. **Standart rad.** Siyosat belgilanmagan kirish nuqtasi yopiq.
3. **Qaror ma'lumot manbaiga yaqin.** Ruxsat ma'lumot olinayotgan joyda yana tekshiriladi (servis yoki DAL). Yuqori qatlam (guard, Proxy) tez rad etish uchun foydali, lekin yagona himoya emas.

## Chuqurroq: NestJS

### Guard hayot tsiklidagi o'rni

Hujjat guard'ni middleware'dan farqlaydi. Guard'ning yagona vazifasi: runtime'dagi shartlar (ruxsatlar, rollar, ACL) asosida so'rovni route handler qayta ishlashi yoki ishlamasligini hal qilish. Middleware autentifikatsiya uchun yaxshi (token tekshirish va `request` ga xususiyat biriktirish route kontekstiga bog'liq emas), lekin kontekstga ko'r: `next()` dan keyin qaysi handler bajarilishini bilmaydi. Guard esa `ExecutionContext` orqali aynan nima bajarilishini biladi, shuning uchun authorization uchun mos. ASVS 5.0.0 8.3.1 (1-daraja) ham shuni talab qiladi: authorization qoidalari ishonchli servis qatlamida majburlanadi va ishonchsiz iste'molchi o'zgartira oladigan nazoratlarga, masalan mijoz JavaScript'iga, tayanmaydi.

NestJS hujjatiga ko'ra guard'lar barcha middleware'dan keyin, lekin har qanday interceptor yoki pipe'dan oldin bajariladi. Guard `CanActivate` interfeysini amalga oshiradi, `canActivate()` metodi joriy so'rov ruxsat etilganligini bildiruvchi boolean qaytaradi (sinxron yoki Promise/Observable orqali). `true` bo'lsa so'rov qayta ishlanadi, `false` bo'lsa Nest uni rad etadi. Hujjat: guard `false` qaytarganda framework `ForbiddenException` tashlaydi va standart javob 403 `Forbidden resource` bo'ladi; boshqa javob kerak bo'lsa o'z istisnongizni tashlaysiz (masalan `UnauthorizedException`). Guard'da tashlangan istisno exceptions layer'da qayta ishlanadi. Exception filters hujjati yana bir nozik joyni ko'rsatadi: `HttpException` yoki uning avlodi bo'lmagan (tanilmagan) istisno standart filtrda `Internal server error` javobini beradi. Shuning uchun guard ichida oddiy `Error` tashlash rad etishni 500 ga aylantiradi, 403 yoki 401 ga emas; rad etish uchun `false` qaytaring yoki `ForbiddenException`/`UnauthorizedException` tashlang.

Pipe guard'dan keyin ishlagani uchun, guard so'rov tanasi validatsiya va transformatsiyadan o'tmagan holatda ishlaydi. Natija: guard foydalanuvchi, rol va route metadata'siga qarab funksiya darajasida qaror qiladi; so'rov tanasidagi obyekt ID yoki maydonlarga bog'liq qarorlar (52, 54-darslar) odatda servis qatlamida qabul qilinadi.

### Global guard

Hujjatga ko'ra global guard har controller va har route handler'ga qo'llanadi. Ikki usul bor, va farq muhim:

- `app.useGlobalGuards(new RolesGuard())`: bu modul tashqarisida ro'yxatdan o'tadi, shuning uchun dependency inject qila olmaydi. Hujjat gibrid ilovada `useGlobalGuards()` ulangan microservice'lar uchun sukut bo'yicha guard o'rnatmasligini ham ogohlantiradi (standart, gibrid bo'lmagan microservice ilovada esa global o'rnatadi).
- `APP_GUARD` provider: guard modul ichida `{ provide: APP_GUARD, useClass: RolesGuard }` bilan ro'yxatdan o'tadi, dependency injection ishlaydi va guard qaysi modulda ro'yxatdan o'tganidan qat'i nazar global bo'ladi. `APP_GUARD` ni bir necha marta ro'yxatdan o'tkazish mumkin, har bir guard ro'yxatdan o'tish tartibida ishlaydi.

Deny-by-default uchun global guard kerak: har controller'ga `@UseGuards` yozishda bitta unutish ochiq endpoint beradi.

### Metadata va hujjatdagi fail-open namuna

Rol ro'yxatini handler'ga biriktirish uchun hujjat custom metadata'ni (`Reflector.createDecorator()` yoki `@SetMetadata()`) ko'rsatadi. Hujjatdagi `RolesGuard` namunasi esa metadata yo'q bo'lsa quyidagicha harakat qiladi: `if (!roles) { return true; }`. Namuna ta'limiy (hujjat `matchRoles()` ni ham o'zi taqdim etmasligini ogohlantiradi), lekin uni production'ga ko'chirish metadata unutilgan route'ni ochiq qoldiradi. 53-darsdagi guard va pastdagi Stack bo'limidagi PolicyGuard buni teskari qiladi: metadata yo'q bo'lsa rad, ochiq route esa aniq `@Public()` bilan.

### Tayyor deny-by-default: @nestjs/authorization

NestJS hujjatidagi alohida Authorization bobi (`@nestjs/authorization`) aynan shu darsning tamoyilini paketga aylantirgan. Modul global `AuthorizationGuard` ni ro'yxatdan o'tkazadi va u standart bo'yicha rad etadi: handler faqat tekshiruv e'lon qilgandagina ishlaydi, ya'ni `@Can()`, `@Can.Anyone()` yoki `@nestjs/authentication`dagi `@Public()` (u `@Can.Anyone()` ga teng) bilan. Hech narsa e'lon qilinmagan handler uchun javob: foydalanuvchiga 403, mehmonga 401, va startup logida shu handler nomi chiqadi. Siyosat sinfidagi qobiliyat (ability) faqat literal `true` qaytarsa ruxsat beradi, boshqa har qanday qiymat, hatto truthy bo'lsa ham, rad. Yozuv kerak bo'lgan tekshiruv route'da emas, servisda `authorize()` bilan bajariladi, chunki guard'da yozuv yo'q (52-dars); faqat URL parametriga bog'liq tekshiruv route'da qolishi mumkin.

Ikki ehtiyotkorlik. Birinchisi: global guard'lar Nest modullarni skanerlagan tartibda ishlaydi, shuning uchun `AuthenticationModule` birinchi turishi kerak; teskari tartibda authorization guard `request.user` o'rnatilishidan oldin ishlaydi va har tekshiruv foydalanuvchini mehmon deb ko'radi. `AuthorizationModule` startup'da buni tekshiradi va noto'g'ri tartibda ilova ishga tushmaydi; lekin Passport `AuthGuard()` avlodi kabi belgisiz guard'larda tekshiruv faqat sinf nomiga qaraydi, shuning uchun bunday guard'ni `app.useGlobalGuards()` emas, `APP_GUARD` bilan ro'yxatdan o'tkazing (hujjat: `useGlobalGuards()` bilan qo'shilganlar barcha `APP_GUARD`dan keyin ishlaydi). Ikkinchisi: Nest global guard ishlatmaydigan joyda (masalan, `fieldResolverEnhancers` ichida `'guards'` bo'lmagan GraphQL field resolver'lar) hech narsa rad etilmaydi.

### Authentication guard va authorization guard

Hujjat shuni eslatadi: Node.js ilovalarda autentifikatsiya qilingan foydalanuvchini `request` obyektiga biriktirish odatiy, va bu odatda alohida authentication guard'da amalga oshadi. Authorization guard o'sha `request.user` ga tayanadi. Tartib muhim: authorization guard authentication guard'dan keyin ishlashi kerak, aks holda `request.user` yo'q bo'ladi (pastdagi kod buni `!!user &&` bilan rad qiladi).

## Chuqurroq: Next.js

### Entry point'lar ko'p

Next.js ilovasida ma'lumotga bir nechta yo'l bilan kelinadi: page va layout render, Server Component, route handler (API), server action. Authentication guide Next.js ilovalarida bir nechta kirish nuqtalari borligini, `return null` bilan top-level komponentdan chiqish ichki route segmentlari va Server Action'larga kirishni to'xtatmasligini aytadi. Shuning uchun tekshiruv yo'l boshida emas, ma'lumot yoki harakat bor joyda turadi.

### Server action: alohida endpoint

Data security hujjati aniq yozadi: eksport qilingan Server Action sukut bo'yicha to'g'ridan-to'g'ri POST so'rovi bilan chaqirilishi mumkin, faqat ilova UI orqali emas. Action'ga ichki shifrlangan, deterministik bo'lmagan ID beriladi va ishlatilmaydigan action'lar klient bundle'idan olib tashlanadi, lekin hujjat shu yerning o'zida tushuntiradi: bu xavfni kamaytiradi, ammo Server Action'larga baribir to'g'ridan-to'g'ri POST bilan murojaat mumkin deb qarab, har birining ichida authentication va authorization tekshirish kerak. Hujjat misoli: sahifadagi `redirect` qaysi UI ko'rinishini boshqaradi, lekin action alohida kirish nuqtasi va chaqiruvchini o'zi tekshirishi kerak. Authentication emas, authorization ham: hujjat `deletePost(postId)` misolida postning muallifi sessiyadagi foydalanuvchi ekanini tekshirishni ko'rsatadi va bu IDOR'ning oldini oladi (52-dars).

Hujjat action ID'lari haqida sanab o'tadi: ular kompilyatsiya paytida yaratiladi va ko'pi bilan 14 kun keshlanadi, yangi build yoki yaroqsiz kesh bilan qayta yaratiladi. Action return qiymati serializatsiya qilinib mijozga yuboriladi, shuning uchun to'liq DB yozuvini qaytarmang, faqat UI kerak bo'lganini (`{ success: true }`). Hujjatning audit ro'yxati action uchun beshta savol beradi: argumentlar tekshirilganmi, foydalanuvchi action ichida qayta authorize qilinadimi, resurs egaligi tekshirilganmi (authentication emas, authorization), return qiymatlari filtrlanganmi, DB kirishi `server-only` DAL'ga topshirilganmi. Action komponent ichida yopilma (closure) bilan e'lon qilinsa, yopilgan o'zgaruvchilar mijozga yuborilib qaytadi; Next.js ularni shifrlaydi va har build uchun yangi kalit yaratadi, lekin hujjat sezgir qiymatlarni faqat shifrlashga tayanib oshkor qilishni tavsiya etmaydi. Origin sarlavhasi Host (yoki `X-Forwarded-Host`) bilan solishtiriladi va mos kelmasa so'rov to'xtatiladi; reverse proxy ortidagi ilovalar uchun `serverActions.allowedOrigins` ishlatiladi (CSRF haqida 36-dars).

Mijoz kiritishi ham ishonchsiz: hujjat `searchParams.isAdmin === 'true'` kabi qiymatlarga tayanishni zaif namuna sifatida ko'rsatadi va har safar sessiyani qayta tekshirishni tavsiya qiladi.

### Proxy (avvalgi middleware)

Joriy hujjatda `middleware` fayl konvensiyasi eskirgan va `proxy` deb qayta nomlangan. Authentication guide ikki turdagi tekshiruvni ajratadi: optimistic (cookie'dagi sessiya ma'lumotiga asoslangan, tez, UI elementlarini ko'rsatish yoki yo'naltirish uchun) va secure (ma'lumotlar bazasidagi sessiyaga asoslangan, sezgir ma'lumot yoki amallar uchun). Proxy har route'da, jumladan prefetch qilingan route'larda ishlagani uchun hujjat unda faqat cookie'dan sessiyani o'qishni (optimistic) va ma'lumotlar bazasi tekshiruvlaridan qochishni aytadi va qo'shimcha qiladi: Proxy boshlang'ich tekshiruvlar uchun foydali, lekin ma'lumotlaringizni himoya qilishda yagona himoya chizig'i bo'lmasligi kerak, ko'pchilik xavfsizlik tekshiruvlari ma'lumot manbaiga iloji boricha yaqin bajarilishi kerak.

### Layout tuzog'i

Hujjat: partial rendering tufayli layout navigatsiyada qayta render bo'lmaydi, shuning uchun foydalanuvchi sessiyasi har route o'zgarishida tekshirilmaydi. Layout qolgan route segmentlari va parallel slot'larning renderlanishini boshqarmaydi, ular layout ularni yashirganda ham ishlashi va RSC payload'ida bo'lishi mumkin. Tavsiya: tekshiruvni ma'lumot manbaida (DAL) yoki shartli renderlanadigan komponentda qiling.

### Statik route'lar va cache() chegaralari

Authentication guide ikkita chegarani alohida qayd etadi. Birinchisi: DAL so'rov vaqtida olinadigan ma'lumotni himoya qiladi, lekin foydalanuvchilar o'rtasida umumiy ma'lumotli statik route'larda ma'lumot so'rov vaqtida emas, build vaqtida olinadi; bunday statik route'larni himoyalash uchun Proxy ishlatiladi. Demak, statik sahifada DAL tekshiruvi har so'rovda ishlamaydi. Ikkinchisi: React `cache()` bitta render o'tishi ichida takroriy chaqiruvlarni qisqartiradi, lekin Server Action va Route Handler render o'tishining qismi emas, shuning uchun u yerda `cache()` o'ram hech narsa qilmaydi va funksiya har safar ishlaydi. Natija: `requireAdmin` kabi DAL funksiyasi action ichida har chaqiruvda sessiyani qayta tekshiradi va bu to'g'ri, ortiqcha emas. Data security hujjati audit ro'yxatida `proxy.ts` va `route.ts` fayllarini "katta kuchga ega" deb ataydi va ularni an'anaviy usullar bilan, jumladan penetratsion test va zaiflik skanerlari bilan alohida diqqat bilan tekshirishni tavsiya qiladi.

### Data Access Layer va DTO

Data security hujjati yangi loyihalar uchun Data Access Layer (DAL) ni tavsiya qiladi: faqat serverda ishlaydigan ichki kutubxona, authorization tekshiruvlarini bajaradi va xavfsiz, minimal DTO qaytaradi. Hujjat afzalligini aytadi: ma'lumot kirishi bir joyda markazlashadi va authorization xatolari xavfi kamayadi. Muhim: hujjat misolida `canSeePhoneNumber(viewer, team)` kabi funksiyalar DTO ichida maydon darajasida qaror qiladi (54-dars). Client Component'ga butun obyektni props sifatida berish hujjatda xato namuna sifatida ko'rsatilgan. Taint API (`experimental_taintObjectReference`, `experimental_taintUniqueValue`) qo'shimcha qatlam: hujjat o'zi DAL'da filtrlash o'rnini bosmasligini yozadi. `server-only` paketi esa server modullari klient muhitiga import qilinsa build xatosi beradi.

## Misol: sahifa himoyalangan, action ochiq

Quyidagi model sahifa tekshiruvi va server action'ni ikki alohida funksiya sifatida ko'rsatadi.

### 1. Zaif kod

```ts run
type Session = { userId: string; tenant: string; isAdmin: boolean } | null;
const records = [
  { id: "r1", tenant: "alfa" },
  { id: "r2", tenant: "beta" },
];

// Sahifa: UI darajasida tekshiradi
function renderAdminPage(s: Session): string {
  if (!s?.isAdmin) return "redirect /login";
  return "Admin panel: [Barcha yozuvlarni o'chirish]";
}

// ZAIF: action alohida kirish nuqtasi, lekin ichida tekshiruv yo'q (sahifaga ishonadi)
function deleteRecordAction(_s: Session, id: string): string {
  const i = records.findIndex((r) => r.id === id);
  if (i < 0) return "topilmadi";
  records.splice(i, 1);
  return `o'chirildi: ${id}`;
}

const driver: Session = { userId: "u2", tenant: "alfa", isAdmin: false };
console.log("haydovchi sahifani ochadi:", renderAdminPage(driver));
```

```text
haydovchi sahifani ochadi: redirect /login
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu server action'ni to'g'ridan-to'g'ri chaqirish usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-4-moddasi (Kompyuter axborotini modifikatsiyalashtirish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Haydovchi sahifani ochmaydi. U action'ga to'g'ridan-to'g'ri POST yuboradi (modelda: funksiyani chaqiradi), va u hatto boshqa tenant'ning yozuvini ham o'chiradi:

```ts run
type Session = { userId: string; tenant: string; isAdmin: boolean } | null;
const records = [
  { id: "r1", tenant: "alfa" },
  { id: "r2", tenant: "beta" },
];
function deleteRecordAction(_s: Session, id: string): string {
  const i = records.findIndex((r) => r.id === id);
  if (i < 0) return "topilmadi";
  records.splice(i, 1);
  return `o'chirildi: ${id}`;
}

const driver: Session = { userId: "u2", tenant: "alfa", isAdmin: false };
console.log("haydovchi action'ni chaqiradi:", deleteRecordAction(driver, "r2"));
console.log("qolgan yozuvlar:", records.map((r) => r.id).join(", "));
```

```text
haydovchi action'ni chaqiradi: o'chirildi: r2
qolgan yozuvlar: r1
```

Admin bo'lmagan foydalanuvchi begona tenant yozuvini o'chirdi. Sahifa tekshiruvi to'g'ri edi, lekin action boshqa kirish nuqtasi. Payload darslik namunasi, faqat shu model kodiga qarshi.

### 3. Tuzatilgan kod

Action o'zi sessiyani, rolni va obyekt egaligini tekshiradi. Tekshiruvlar bitta DAL funksiyasiga jamlangan:

```ts run
type Session = { userId: string; tenant: string; isAdmin: boolean } | null;
type Rec = { id: string; tenant: string };
const records: Rec[] = [
  { id: "r1", tenant: "alfa" },
  { id: "r2", tenant: "beta" },
];

// DAL: authentication + authorization + obyekt egaligi bir joyda
function requireAdminRecord(s: Session, id: string): Rec {
  if (!s) throw new Error("Unauthorized");
  if (!s.isAdmin) throw new Error("Forbidden");
  const rec = records.find((r) => r.id === id && r.tenant === s.tenant); // egalik so'rovda
  if (!rec) throw new Error("Not found"); // begona va yo'q: bir xil
  return rec;
}

function deleteRecordAction(s: Session, id: string): string {
  try {
    const rec = requireAdminRecord(s, id);
    records.splice(records.indexOf(rec), 1);
    return `o'chirildi: ${id}`;
  } catch (e) {
    return (e as Error).message;
  }
}

const driver: Session = { userId: "u2", tenant: "alfa", isAdmin: false };
const adminAlfa: Session = { userId: "u1", tenant: "alfa", isAdmin: true };
console.log("haydovchi r2:", deleteRecordAction(driver, "r2"));
console.log("mehmon r1:", deleteRecordAction(null, "r1"));
console.log("alfa admini beta yozuvi r2:", deleteRecordAction(adminAlfa, "r2"));
console.log("alfa admini o'z yozuvi r1:", deleteRecordAction(adminAlfa, "r1"));
console.log("qolgan:", records.map((r) => r.id).join(", "));
```

```text
haydovchi r2: Forbidden
mehmon r1: Unauthorized
alfa admini beta yozuvi r2: Not found
alfa admini o'z yozuvi r1: o'chirildi: r1
qolgan: r2
```

### Tuzatish nima uchun yetarli

Endi action kimdan kelishidan qat'i nazar o'zini tekshiradi: mehmon, admin bo'lmagan va begona tenant admini rad etiladi, begona yozuv "topilmadi" bilan bir xil javob oladi. Hamma tekshiruv bitta funksiyada, shuning uchun yangi action yozganda ham shuni chaqirish yetarli. Bu faqat ko'rsatilgan hujumni yopadi. Qoldiq risk: `Session` ishonchli manbadan (cookie'ni server tomonda tekshirish) olinishi kerak; har yangi action `requireAdminRecord` ni chaqirishi dasturchi intizomiga bog'liq (lint qoidasi yoki test bilan majburlash mumkin); CSRF va kiritish validatsiyasi alohida (36, 72-darslar).

## Qachon qo'llamaslik kerak

- Har bir qatlamda to'liq tekshiruv takrorlash ortiqcha. Proxy yoki guard'da qimmat DB tekshiruvlarini qilish kechikish qo'shadi; Next.js hujjati Proxy uchun buni aniq tavsiya etmaydi: u prefetch qilingan route'larda ham ishlagani uchun faqat cookie'dan sessiyani o'qish tavsiya qilinadi. Tez rad etish uchun yengil tekshiruv, qaror uchun esa ma'lumot yaqinidagi tekshiruv.
- Global guard + `@Public()` modeli kichik ilovada ortiqcha ko'rinishi mumkin, lekin u bitta unutishni jiddiy ochiq endpoint qilmasligini ta'minlaydi. Ochiq route'lar sezilarli ko'p bo'lgan ilovada (ommaviy API) teskari modelni (har controller o'z guard'i) tanlash mumkin; shunda sinov va lint qoidasi unutishni ushlashi shart.
- DAL bilan DTO katta qatlam qo'shadi. Prototip uchun hujjat o'zi component-level data access'ni tavsiya qiladi, lekin uni tasodifan ma'lumot oshkor qilish xavfi bilan bog'laydi. Production uchun DAL tavsiya etiladi, va bir yondashuvni tanlash (aralashtirmaslik) hujjatda alohida maslahat qilingan.
- Client-side tekshiruvlar (tugmani yashirish) foydali UX, lekin xavfsizlik nazorati emas. Ularni olib tashlash shart emas, faqat ularga tayanmang.
- Eksperimental xususiyatlarga tayanib himoya qurmang: korpusdagi hujjatda `forbidden.js` va `unauthorized.js` fayl konvensiyalari `version: experimental` deb belgilangan, taint API esa `experimental.taint` opsiyasini yoqishni talab qiladi va hujjat uni DAL filtrlash o'rnini bosmaydigan qo'shimcha qatlam deydi. Authentication guide'da Proxy nomi `middleware` o'rniga ishlatiladi; ularning kodini nusxalamay, mexanizmni (tekshiruv ma'lumotga yaqin, standart rad) qo'llang.

## Stack'da: NestJS va Next.js kodi

Quyidagi NestJS kodi 53-darsdagi guard'ning sinov uchun ishlatiladigan to'liq ko'rinishi. U ishga tushirilmaydi (NestJS moduli brauzer worker'ida yo'q), faqat sintaksis tekshirilgan:

```ts
import { CanActivate, ExecutionContext, Injectable, Module } from "@nestjs/common";
import { APP_GUARD, Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<string[]>();
export const Public = Reflector.createDecorator<boolean>();

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride(Public, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic === true) return true;

    const roles = this.reflector.getAllAndOverride(Roles, [ctx.getHandler(), ctx.getClass()]);
    if (!roles || roles.length === 0) return false; // metadata yo'q: rad (hujjat namunasidan farqi)

    const user = ctx.switchToHttp().getRequest().user as { role: string } | undefined;
    return !!user && roles.includes(user.role);
  }
}

@Module({
  providers: [{ provide: APP_GUARD, useClass: AuthzGuard }], // global va dependency injection bilan
})
export class AuthzModule {}
```

`Reflector.createDecorator<string[]>()` va `getAllAndOverride(Roles, [handler, class])` shakllari NestJS hujjatida shu ko'rinishda keltirilgan; `getAllAndOverride` birinchi aniqlangan qiymatni qaytaradi, `getAllAndMerge` esa ikkala daraja massivlarini birlashtiradi. Obyekt egaligi (52-dars) guard'da emas, servis qatlamida: guard tanasi hali pipe'dan o'tmagan.

Next.js'da DAL va server action:

```ts
// app/lib/dal.ts
import "server-only";
import { cache } from "react";

type Session = { userId: string; tenantId: string; isAdmin: boolean };
declare function getSession(): Promise<Session | null>; // cookie'ni server tomonda tekshiradi
declare const db: { vehicle: { deleteMany(args: { where: { id: string; tenantId: string } }): Promise<{ count: number }> } };

export const requireAdmin = cache(async (): Promise<Session> => {
  const s = await getSession();
  if (!s) throw new Error("Unauthorized");
  if (!s.isAdmin) throw new Error("Forbidden");
  return s;
});

// app/actions.ts ("use server")
export async function deleteVehicleAction(id: string) {
  const s = await requireAdmin(); // har action ichida qayta tekshiriladi
  const res = await db.vehicle.deleteMany({ where: { id, tenantId: s.tenantId } }); // egalik so'rovda
  if (res.count === 0) throw new Error("Not found");
}
```

## Xulosa

- Har kirish nuqtasi (controller metodi, route handler, server action) o'zining authorization'ini oladi yoki global qatlam orqali oladi; sahifa yoki layout tekshiruvi action'larni qoplamaydi.
- NestJS guard middleware'dan keyin va pipe'dan oldin ishlaydi; global guard `APP_GUARD` bilan ro'yxatdan o'tkaziladi; hujjat namunasidagi "metadata yo'q bo'lsa `true`" production uchun fail-open: standart rad bo'lsin.
- Next.js'da Server Action to'g'ridan-to'g'ri POST bilan chaqirilishi mumkin: har birining ichida authentication va authorization tekshiriladi, obyekt egaligi ham.
- Proxy (avvalgi middleware) faqat optimistic, cookie'ga asoslangan yengil tekshiruv uchun; ko'pchilik tekshiruvlar ma'lumot manbaiga yaqin (Data Access Layer) bajariladi. Layout'dagi tekshiruv navigatsiyada qayta ishlamaydi.
- DAL xavfsiz, minimal DTO qaytaradi; Client Component'ga butun obyekt props sifatida berilmaydi.
