---
n: 76
slug: graphql-xavfsizligi
title: "GraphQL xavfsizligi"
summary: "GraphQL'ning bitta endpoint modeli xavfsizlikni qanday o'zgartiradi: chuqurlik, miqdor va narx limiti, alias va batching orqali brute force, resolver darajasidagi avtorizatsiya (node va edge), introspection va xatolar. So'rov daraxti ustida chuqurlik va narx tekshiruvi."
duration: 40
sources:
  - id: api-top10
    note: "API4:2023 References bo'limi: GraphQL Cheat Sheet'dagi 'DoS Prevention' va 'Mitigating Batching Attacks' bo'limlariga havola; API1 va API5 kategoriyalari obyekt va funksiya darajasidagi avtorizatsiya sifatida"
  - id: cs-authz
    note: "Authorization Cheat Sheet: ruxsat har so'rovda tekshirilishi, bitta o'tkazib yuborilgan tekshiruv ham yetarli bo'lishi va tekshiruv server tomonda bo'lishi (GraphQL Cheat Sheet Access Control bo'limi ham shu mavzuga tayanadi); GraphQL'ga xos aniq tavsiyalar cs-graphql manbasidan olingan"
  - id: cs-input
    note: "Input Validation Cheat Sheet: allowlist va tur bo'yicha validatsiya; GraphQL'da skalyar va enum turlari shu tamoyilga xizmat qiladi"
  - id: nestjs-graphql-other
    note: "NestJS GraphQL, Other features: guard'lar GraphQL'da GqlExecutionContext orqali ishlaydi; enhancer'lar standart holda faqat yuqori darajadagi @Query/@Mutation metodlarida ishlaydi, @ResolveField uchun fieldResolverEnhancers kerak va u unumdorlikni pasaytirishi mumkin"
  - id: nestjs-graphql-complexity
    note: "NestJS GraphQL, Complexity: graphql-query-complexity bilan ComplexityPlugin, fieldExtensionsEstimator va simpleEstimator, maydon narxi @Field({ complexity }) bilan, bob faqat code first yondashuvga tegishli"
  - id: nestjs-graphql-quickstart
    note: "NestJS GraphQL, Quick start: Apollo drayverida GraphiQL NODE_ENV production bo'lmaganda avtomatik yoqiladi, production'da standart bo'yicha o'chiq, graphiql opsiyasi bilan majburan boshqariladi"
  - id: cs-graphql
    note: "GraphQL Cheat Sheet: umumiy xavflar (injection, DoS, avtorizatsiya, batching, standart sozlamalar); DoS bo'limi (depth va amount limiti, pagination, timeout, query cost analysis, rate limiting); Access Control bo'limi (BOLA/BFLA, edges va nodes, resolver'lar, introspection va GraphiQL'ni production'da o'chirish, node/nodes maydonlari); Batching Attacks va ularni yumshatish; Secure Configurations (introspection, taklif qilinadigan maydon nomlari, xatolar, Apollo stack trace sozlamasi)"
quiz:
  - q: "Bitta HTTP so'rovda 100 ta alias bilan `vehicle(id: ...)` maydoni so'raldi. Rate limiter faqat HTTP so'rovlar sonini hisoblaydi. Nima bo'ladi?"
    options:
      - "Limiter 100 ta so'rov deb hisoblaydi"
      - "Limiter 1 ta so'rov deb hisoblaydi, hujumchi esa 100 ta obyektni bir martada tekshiradi; limit GraphQL darajasida (operatsiya, alias, narx) bo'lishi kerak"
      - "Server aliaslarni rad etadi, chunki ularga ruxsat yo'q"
      - "Alias faqat javob formatiga ta'sir qiladi, resolver bir marta ishlaydi"
    answer: 1
    explain: "Alias bir xil maydonni turli nom bilan bir necha marta so'rash imkonini beradi va har biri uchun resolver ishlaydi. GraphQL Cheat Sheet HTTP so'rovlar soni qimmat so'rovlarni va bitta so'rovdagi ko'p operatsiyani hisobga olmasligini yozadi."
  - q: "Cheat sheet 'enforce authorization checks on both edges and nodes' deganda nima nazarda tutilgan?"
    options:
      - "Faqat Query ildizida (root) tekshirish yetarli, ichki maydonlar ota obyektdan ruxsat oladi"
      - "Faqat mutation'larda tekshirish kerak"
      - "Obyektga boshqa yo'l (bog'langan maydon yoki node(id) orqali) bilan ham kirish mumkin, shuning uchun har maydon va obyektda alohida tekshirish bo'lishi kerak"
      - "Edges tekshiruvi nodes tekshiruvini almashtiradi"
    answer: 2
    explain: "GraphQL'da bitta obyektga ko'p yo'l bilan (ildiz maydoni, bog'langan maydon, node) kirish mumkin. Faqat bitta kirish nuqtasida tekshirish boshqa yo'llarni ochiq qoldiradi. Tekshiruv obyektni olayotgan joyda (resolver) bo'lishi kerak."
  - q: "Quyidagi qaysi tadbir GraphQL'da chuqur ichma-ich (vehicle -> driver -> vehicles -> driver -> ...) so'rovlarga qarshi to'g'ridan-to'g'ri mos?"
    options:
      - "Chuqurlik limiti va (ro'yxat maydonlari uchun) narx yoki miqdor limiti, pagination, timeout"
      - "Introspection'ni yoqish"
      - "Barcha maydonlarni String turiga o'zgartirish"
      - "JSON javobni siqish"
    answer: 0
    explain: "Cheat sheet chuqurlik va miqdor limiti, pagination, timeout va query cost analysis'ni tavsiya qiladi. Chuqurlik va miqdor GraphQL'da standart holda cheklanmagan bo'lishi mumkin va odatda kichik moslashtirilgan kod talab qiladi."
  - q: "Introspection production'da yoqilgan. Bu o'zi alohida zaiflikmi va nega o'chirish tavsiya qilinadi?"
    options:
      - "Ha, u masofadan kod bajarishga olib keladi"
      - "Yo'q, u butunlay zararsiz va doim yoqilishi kerak"
      - "Faqat mutation'larga ta'sir qiladi"
      - "Alohida zaiflik emas, lekin hujumchiga sxemani (turlar, maydonlar, argumentlar) to'liq ochib beradi va hujum sirtini o'rganishni osonlashtiradi; cheat sheet uni production'da o'chirishni aytadi. Sxema sir emas: himoya avtorizatsiyada"
    answer: 3
    explain: "Introspection sxemani so'rov orqali ochadi. O'chirish bilimni qiyinlashtiradi, lekin yashirin maydon xavfsiz degani emas: har maydon avtorizatsiyasi o'z o'rnida bo'lishi shart."
  - q: "`node(id: ...)` maydoni sxemada bor va u har turdagi obyektni ID bo'yicha qaytaradi. Qaysi xavf bor?"
    options:
      - "ID bo'yicha to'g'ridan-to'g'ri kirish mo'ljallanmagan obyektlarga ham ochiq yo'l paydo bo'ladi; agar bu maydon avtorizatsiyani chetlab o'tsa, BOLA yuzaga keladi. Kerak bo'lmasa olib tashlang, doim avtorizatsiya qo'shing"
      - "Xavf yo'q, chunki ID tasodifiy"
      - "Faqat sekinlashadi"
      - "Faqat introspection yoqilgan bo'lsa xavfli"
    answer: 0
    explain: "Cheat sheet node/nodes maydonlari ID bo'yicha to'g'ridan-to'g'ri kirishga imkon berishi va ularni olib tashlash bu imkoniyatni o'chirishi mumkinligini aytadi, ammo baribir har holda avtorizatsiya tekshiruvi kerak. Tasodifiy ID egalik tekshiruvini almashtirmaydi."
  - q: "Jamoa `depth <= 10` limit qo'ydi. Hujumchi chuqurligi 3, lekin har darajada `first: 10000` bo'lgan so'rov yubordi. Limit nima uchun yetmaydi?"
    options:
      - "Depth limiti faqat mutation'larga qo'llanadi"
      - "Chuqurlik so'rovning 'kengligini' emas, faqat ichma-ichligini cheklaydi; miqdor va narx limiti (pagination bilan) ham kerak"
      - "Depth limiti `first` argumentini o'zgartiradi"
      - "Yetadi: chuqurlik hamma narsani belgilaydi"
    answer: 1
    explain: "Cheat sheet chuqurlik (depth) va miqdor (amount) ni alohida ko'rsatadi: ikkalasi ham standart cheklanmagan bo'lishi mumkin. Katta `first` bilan sayoz so'rov ham katta resurs sarflaydi. Pagination yuqori chegarasi va narx tahlili bu bo'shliqni yopadi."
task:
  title: "GraphQL so'rov daraxtini tekshirish"
  prompt: |
    So'rov daraxti `Node = { name, alias?, select? }` ko'rinishida. `validateQuery(root, limits)` so'rov bajarilishidan oldin uni tekshirishi kerak.

    Qoidalar (tekshirish tartibi shu):
    1. Ildiz maydonlari soni (alias bilan) `maxRoot` dan oshsa `"rad: ildiz maydonlari"`.
    2. Daraxt chuqurligi (ildiz maydoni = 1) `maxDepth` dan oshsa `"rad: chuqurlik"`.
    3. Narx `maxCost` dan oshsa `"rad: narx"`. Narx: har maydon 1 + (ro'yxat maydoni, ya'ni nomi `vehicles` bo'lsa, bolalar narxini 10 ga ko'paytiradi).
    4. Aks holda `null`.

    Kutilgan natija: 4 ta so'rov uchun `null`, `rad: ildiz maydonlari`, `rad: chuqurlik`, `rad: narx`.
  lang: ts
  starter: |
    type Node = { name: string; alias?: string; select?: Node[] };
    type Limits = { maxRoot: number; maxDepth: number; maxCost: number };

    function validateQuery(root: Node[], limits: Limits): string | null {
      return null;
    }

    const n = (name: string, select?: Node[], alias?: string): Node => ({ name, select, alias });
    const limits: Limits = { maxRoot: 3, maxDepth: 4, maxCost: 30 };

    const ok = [n("vehicle", [n("plate"), n("driver", [n("name")])])];
    const aliases = [n("vehicle", [n("plate")], "a"), n("vehicle", [n("plate")], "b"), n("vehicle", [n("plate")], "c"), n("vehicle", [n("plate")], "d")];
    const deep = [n("vehicle", [n("driver", [n("vehicles", [n("driver", [n("name")])])])])];
    const wide = [n("vehicle", [n("driver", [n("vehicles", [n("plate"), n("id"), n("driver")])])])];

    console.log("ok:", validateQuery(ok, limits));
    console.log("aliaslar:", validateQuery(aliases, limits));
    console.log("chuqur:", validateQuery(deep, limits));
    console.log("keng:", validateQuery(wide, limits));
  solution: |
    type Node = { name: string; alias?: string; select?: Node[] };
    type Limits = { maxRoot: number; maxDepth: number; maxCost: number };

    const depth = (n: Node): number => 1 + Math.max(0, ...(n.select ?? []).map(depth));
    const cost = (n: Node): number => {
      const children = (n.select ?? []).reduce((s, c) => s + cost(c), 0);
      return 1 + (n.name === "vehicles" ? 10 : 1) * children;
    };

    function validateQuery(root: Node[], limits: Limits): string | null {
      if (root.length > limits.maxRoot) return "rad: ildiz maydonlari";
      if (Math.max(0, ...root.map(depth)) > limits.maxDepth) return "rad: chuqurlik";
      if (root.reduce((s, r) => s + cost(r), 0) > limits.maxCost) return "rad: narx";
      return null;
    }

    const n = (name: string, select?: Node[], alias?: string): Node => ({ name, select, alias });
    const limits: Limits = { maxRoot: 3, maxDepth: 4, maxCost: 30 };

    const ok = [n("vehicle", [n("plate"), n("driver", [n("name")])])];
    const aliases = [n("vehicle", [n("plate")], "a"), n("vehicle", [n("plate")], "b"), n("vehicle", [n("plate")], "c"), n("vehicle", [n("plate")], "d")];
    const deep = [n("vehicle", [n("driver", [n("vehicles", [n("driver", [n("name")])])])])];
    const wide = [n("vehicle", [n("driver", [n("vehicles", [n("plate"), n("id"), n("driver")])])])];

    console.log("ok:", validateQuery(ok, limits));
    console.log("aliaslar:", validateQuery(aliases, limits));
    console.log("chuqur:", validateQuery(deep, limits));
    console.log("keng:", validateQuery(wide, limits));
  solutionNotes: |
    - Ildiz maydonlari alias bilan sanaladi, chunki har alias alohida resolver chaqiruvi. Bu alias va batching orqali enumeration'ni cheklaydi.
    - Chuqurlik limiti ichma-ichlikni, narx limiti esa kenglikni (ro'yxat maydonlari) ushlaydi. Ikkalasi alohida kerak: sayoz, lekin keng so'rov ham og'ir.
    - `vehicles` uchun 10 ko'paytiruvchisi o'quv taxmini (standart sahifa o'lchami). Real tizimda `first` argumenti va pagination yuqori chegarasidan olinadi.
    - Tekshiruv so'rov bajarilishidan oldin, parse qilingan daraxt ustida. Bajarilish paytidagi timeout alohida va qo'shimcha himoya.
    - Bu tekshiruv avtorizatsiyani almashtirmaydi: ruxsat etilgan, arzon so'rov ham begona tenant ma'lumotini qaytarishi mumkin.
  checklist:
    - "To'g'ri so'rov `null` qaytaradi"
    - "4 ta alias `rad: ildiz maydonlari` beradi"
    - "Chuqur so'rov `rad: chuqurlik`, keng so'rov `rad: narx` beradi"
    - "Tekshirish tartibi (ildiz, chuqurlik, narx) saqlangan"
    - "Chuqurlik, narx va avtorizatsiya alohida nazorat ekanini ayta olasiz"
---

## Muammo

REST'da har resurs o'z URL'iga ega: `GET /vehicles/:id`, `GET /drivers/:id`. Har URL ga alohida avtorizatsiya, rate limit va monitoring qo'yiladi, WAF qoidalari yoziladi. GraphQL esa odatda bitta endpoint (`POST /graphql`): mijoz o'zi qaysi obyekt va qaysi maydonlar kerakligini so'rov matnida tasvirlaydi. Bu moslashuvchanlik mobil va veb frontend uchun qulay, lekin URL-ga asoslangan nazoratlar (marshrut avtorizatsiyasi, URL bo'yicha rate limit, har endpoint uchun alohida log) bu yerda ko'zga ko'rinmaydi: hammasi bitta URL va bitta POST.

GraphQL Cheat Sheet qisqa ro'yxatni beradi. Barcha kiruvchi ma'lumotni tekshiring; qimmat so'rovlar DoS ga olib keladi, shuning uchun ularni cheklang; avtorizatsiya tekshiruvlari bo'lsin; xavfli standart sozlamalarni (ortiqcha xatolar, introspection, GraphiQL) o'chiring. Va umumiy hujumlar ro'yxati: injection (SQL, NoSQL, OS buyruq, SSRF), DoS, avtorizatsiyani buzish (IDOR bilan birga), batching hujumlari (GraphQL'ga xos brute force turi) va standart sozlamalarni suiiste'mol qilish. OWASP API Security Top 10 (2023) ham API4 manbalarida shu cheat sheet'ning "DoS Prevention" va "Mitigating Batching Attacks" bo'limlariga havola beradi.

Avtopark platformasida GraphQL ko'pincha dashboard uchun tanlanadi: `vehicle { plate driver { name vehicles { ... } } }`. Ma'lumot grafi aylanma bog'lanishga ega (mashina -> haydovchi -> uning mashinalari -> ...), va bu tuzilmaning o'zi hujum uchun maydon bo'ladi. Bu dars uch masalani ko'radi: so'rov narxi va hajmi, avtorizatsiya nuqtasi (resolver) va GraphQL'ga xos brute force (alias va batching).

## Asosiy g'oya

### Mijoz so'rov shaklini boshqaradi

REST'da server har endpoint'ning javob shakli va narxini oldindan biladi. GraphQL'da shakl mijozda. Natijada uch alohida xavf paydo bo'ladi:

1. **Narx mijozda.** Chuqurlik (ichma-ich obyektlar) va miqdor (ro'yxatdan nechta element) so'rovda yoziladi. Cheat sheet ikkalasi standart holda cheklanmagan bo'lishi va DoS ga olib kelishini yozadi; cheklash GraphQL'da tayyor emas, odatda kichik moslashtirilgan kod talab qiladi.
2. **Obyektga ko'p yo'l.** Bitta obyektga ildiz maydoni, bog'langan maydon yoki `node(id)` kabi umumiy maydon orqali kirish mumkin. Avtorizatsiya faqat bir yo'lda bo'lsa, qolganlari ochiq.
3. **Bir so'rovda ko'p operatsiya.** Alias va massiv batching bitta HTTP so'rovda yuzlab operatsiyani yuboradi.

### DoS: chuqurlik, miqdor, narx, timeout

Cheat sheet'ning DoS bo'limi tadbirlarni sanaydi: kiruvchi so'rovlarga chuqurlik limiti, miqdor limiti, pagination, ilova yoki infratuzilma darajasida timeout, query cost analysis (maksimal ruxsat etilgan narx), foydalanuvchi yoki IP bo'yicha rate limit va server tomonda batching/caching (masalan, DataLoader). Chuqurlik misoli sifatida u `album -> songs -> album -> songs ...` kabi aylanma bog'lanishli so'rovni beradi; miqdor misoli `posts(first: 99999999)`. Bizning domen xuddi shu: `vehicle -> driver -> vehicles -> driver`.

Har tadbirning o'z chegarasi bor. Chuqurlik limiti sayoz, lekin keng so'rovni ushlamaydi. Miqdor limiti ichma-ich ko'paytirishni ushlamaydi. Query cost analysis eng to'liq, lekin cheat sheet uni amalga oshirish oson emasligini va har doim kerak bo'lmasligini ham yozadi; cheat sheet Apollo tavsiyasini keltiradi: narx tahlilini yozishga vaqt sarflashdan oldin staging'da yomon so'rov bilan API'ni sinab ko'ring, balki sizda bunday ichma-ich bog'lanishlar yo'qdir. Timeout oddiy usul, lekin cheat sheet uning kamchiligini ham aytadi: u zararli so'rov resursni allaqachon ko'p sarflaganidan keyin ishlashi mumkin, va ilova darajasidagi timeout (so'rov yoki resolver) infratuzilma timeout'idan samaraliroq, chunki so'rovni to'xtatishi mumkin.

Rate limiting haqida alohida eslatma: cheat sheet HTTP so'rovlar soni qimmat so'rovlarni va bitta so'rovdagi bir nechta operatsiyani hisobga olmasligini yozadi va GraphQL rate limitini biznes mantiq qatlamida, narx va batching limitlari bilan birga qo'llashni tavsiya qiladi. Ya'ni 73-darsdagi token bucket bu yerda `cost` bilan ishlatiladi: so'rovning hisoblangan narxi token sarfi bo'ladi.

### Avtorizatsiya: resolver'da, har obyektda

Cheat sheet'ning Access Control bo'limi: so'rovchi ma'lumotni ko'rish yoki o'zgartirishga ruxsati borligini har doim tekshiring; bu IDOR ni, jumladan BOLA va BFLA ni oldini oladi (52 va 53-darslar). Edges va nodes ikkalasida ham avtorizatsiya tekshiruvlarini bajaring; cheat sheet bug hisoboti misolini ham keltiradi, unda nodelarda tekshiruv yo'q, edgelarda esa bor edi. Query va Mutation resolver'lari avtorizatsiya validatsiyasi uchun joy bo'la oladi.

Bu bizning misolda shuni anglatadi: `Query.vehicle(id)` tenant filtrini qo'ysa ham, `Driver.vehicles` resolver'i qo'ymasa, hujumchi o'z mashinasidan haydovchiga, undan haydovchining boshqa tenant mashinalariga o'tishi mumkin (agar ma'lumotlarda bunday bog'lanish bo'lsa). Qoida: tekshiruv ma'lumotni olayotgan har joyda, "kirish eshigi"da emas.

Cheat sheet yana `node` va `nodes` maydonlari haqida ogohlantiradi: ular obyektni to'g'ridan-to'g'ri ID bo'yicha olish imkonini beradi, mo'ljallanmagan bo'lsa ham. Ularni sxemadan olib tashlash bu imkoniyatni yopishi mumkin, lekin baribir har holda so'rovchining obyektga ruxsati tekshirilishi kerak. Maydon darajasida ham farq bo'lishi mumkin: ba'zi iste'molchilarga ba'zi maydonlar ko'rinmasligi kerak (`driver.phone`); buning uchun maydon resolver'ida tekshiruv qo'shiladi. Mutation'lar uchun alohida nazorat: qaysi iste'molchi nimani o'zgartira oladi. Interfeys va union'lardan so'rovchi huquqiga qarab ko'proq yoki kamroq xossa qaytaradigan turlar qurishda foydalanish mumkin.

### Batching: alias va massiv

Cheat sheet batching hujumini shunday ta'riflaydi: GraphQL bitta tarmoq chaqiruvida bir nechta so'rov (massiv shaklida) yoki bir obyektning bir nechta nusxasini (alias bilan) so'rashga imkon beradi. Misol: `droid(id: "2000") { name } second: droid(id: "2001") { name } third: ...` bilan bir nechta obyektni bir martada enumeratsiya qilish mumkin, REST'da esa har ID uchun alohida so'rov kerak bo'lardi. Bu GraphQL'ga xos brute force: tezroq va kamroq sezilarli. Cheat sheet oqibatlar sifatida ilova darajasidagi DoS ni (ko'p so'rov yoki obyekt bitta chaqiruvda bazani band qilishi) va boshqalarni ko'rsatadi. Aliaslar bilan login yoki OTP tekshiruvini brute force qilish ham mumkin, shuning uchun sezgir mutation'larga alias soni va operatsiya soni limiti qo'yiladi.

Cheat sheet "Mitigating Batching Attacks" bo'limida uchta asosiy variant beradi, ularning hammasi kod darajasida: obyekt so'rovlari uchun kod ichidagi rate limit (backend chaqiruvchi nechta turli obyekt so'raganini sanaydi, shuning uchun ularni bitta tarmoq chaqiruvida batch qilsa ham bloklanadi); sezgir obyektlar (username, email, parol, OTP, session token) uchun batching'ni taqiqlash, shunda hujumchi REST kabi har obyekt uchun alohida so'rov yuborishga majbur bo'ladi (bu GraphQL'da tayyor emas, maxsus yechim kerak); bir vaqtda ishlaydigan operatsiyalar sonini cheklash (bu yolg'iz yetarli emas). Cheat sheet batching hujumi oqibatlari sifatida DoS, obyektlarni enumeratsiya qilish, parol va OTP brute force'i, shuningdek WAF, IDS/SIEM kabi vositalar uni bitta so'rov deb ko'rishi va nginx kabi proksilardagi rate limitlarni aylanib o'tishini sanaydi.

## Chuqurroq: injection, sozlama va xatolar

### Kiruvchi argumentlar

Cheat sheet GraphQL'ning asosiy dizaynini shunday tasvirlaydi: foydalanuvchi bir yoki bir necha identifikator beradi, backend esa shu identifikatorlar bilan HTTP, DB va boshqa chaqiruvlarni bajaradigan data fetcher'larga ega. Demak foydalanuvchi kiritgan qiymat so'rovlarga tushadi, bu injection va DoS uchun imkoniyat. Tavsiyalar: allowlist bilan tekshirish, maxsus GraphQL turlaridan (skalyar, enum) foydalanish, murakkab tekshiruvlar uchun maxsus validator va skalyarlar, mutation kirishi uchun sxema belgilash, belgilar ro'yxati uchun denylist emas, allowlist ishlatish va noto'g'ri kirishni rad etganda API ishlashi haqida ortiqcha ma'lumot oshkor qilmaslik. Resolver ichida SQL yoki buyruq qurilsa, 22-25-darslardagi parametrlash qoidalari o'zgarmaydi. Cheat sheet "process validation" haqida ham aytadi: foydalanuvchi bergan host'ga HTTP so'rov yubormang (SSRF, 27-dars), mutlaqo biznes zarurati bo'lmasa.

GraphQL turlari validatsiyaning bir qismi: `ID` o'rniga `VehicleId` kabi maxsus skalyar, `status: String` o'rniga `enum VehicleStatus` ishlatilsa, noto'g'ri qiymat resolver'ga yetmaydi. Lekin tur tizimi diapazon va egalikni tekshirmaydi (72 va 52-darslar).

### Introspection va GraphiQL

Cheat sheet Access Control bo'limida production yoki ommaga ochiq muhitlarda introspection so'rovlari va GraphiQL kabi sxema o'rganish vositalarini o'chirishni tavsiya qiladi. Secure Configurations bo'limi nuanslarni qo'shadi: introspection va GraphiQL ko'pincha standart holda yoqilgan va autentifikatsiya talab qilmaydi, shuning uchun iste'molchi sxemani, mutation'larni, eskirgan va ba'zan "yashirin" maydonlarni ham o'rganadi. Ommaviy iste'mol uchun mo'ljallangan API'da bu ataylab bo'lishi mumkin; unda autentifikatsiyasiz yoki ruxsatsiz foydalanuvchilar uchun o'chirishni ko'rib chiqish mumkin. Ichki API uchun eng oson yo'l uni butun tizim bo'yicha o'chirish. Cheat sheet "security by obscurity" tavsiya etilmasligini ham ochiq yozadi, shuning uchun bu chuqurlikdagi himoya qatlami, avtorizatsiya o'rnini bosmaydi. Introspection o'chirilsa ham hujumchi maydonlarni sinab topishi mumkin, va GraphQL noto'g'ri yozilgan maydon uchun o'xshash nomni taklif qiladi (`Did you mean "user?"`). Cheat sheet introspection o'chirilgan bo'lsa bu taklifni ham o'chirishni ko'rib chiqishni aytadi, lekin barcha implementatsiyalar buni qo'llab-quvvatlamaydi.

### Xatolar

Cheat sheet "Don't Return Excessive Errors" bo'limida production'dagi GraphQL API stack trace qaytarmasligi va debug rejimida bo'lmasligi kerakligini aytadi; xato javobini middleware bilan boshqarish mashhur yo'l. GraphQL xatolari javobning `errors` massivida keladi, ichida SQL xabari yoki ichki yo'l bo'lsa, u reconnaissance'ga yordam beradi. Mijozga umumiy xabar va xato kodi, tafsilotlar esa serverda log (78-dars).

## Misol: dashboard so'rovlari

GraphQL serverining o'rniga so'rov daraxti (`Node`) va qo'lda yozilgan mini-executor ishlatiladi. Bu GraphQL'ning to'liq amalga oshirilishi emas, faqat chuqurlik, alias va resolver darajasidagi avtorizatsiya mexanizmini ko'rsatadigan model. Ma'lumotda "alfa" tenant'ining bitta haydovchisi uch mashinaga biriktirilgan, "beta" tenant'ida alohida mashina.

### 1. Zaif kod

```ts run
type Node = { name: string; alias?: string; args?: Record<string, string>; select?: Node[] };
type Veh = { id: string; tenant: string; plate: string; driverId: string };
type Drv = { id: string; tenant: string; name: string };

const vehicles: Veh[] = [
  { id: "v1", tenant: "alfa", plate: "01 A 111 AA", driverId: "d1" },
  { id: "v2", tenant: "beta", plate: "10 B 222 BB", driverId: "d2" },
  { id: "v3", tenant: "alfa", plate: "01 A 333 AA", driverId: "d1" },
  { id: "v4", tenant: "alfa", plate: "01 A 444 AA", driverId: "d1" },
];
const drivers: Drv[] = [
  { id: "d1", tenant: "alfa", name: "Anvar" },
  { id: "d2", tenant: "beta", name: "Bobur" },
];

let resolverCalls = 0;
const key = (n: Node) => n.alias ?? n.name;

function resolveVehicle(n: Node, v: Veh): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of n.select ?? []) {
    resolverCalls++;
    if (c.name === "id") out[key(c)] = v.id;
    if (c.name === "plate") out[key(c)] = v.plate;
    if (c.name === "driver") out[key(c)] = resolveDriver(c, drivers.find((d) => d.id === v.driverId)!);
  }
  return out;
}
function resolveDriver(n: Node, d: Drv): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of n.select ?? []) {
    resolverCalls++;
    if (c.name === "name") out[key(c)] = d.name;
    if (c.name === "vehicles") out[key(c)] = vehicles.filter((v) => v.driverId === d.id).map((v) => resolveVehicle(c, v));
  }
  return out;
}

// ZAIF: chuqurlik/alias limiti yo'q, resolver'da tenant tekshiruvi yo'q
function execute(root: Node[]) {
  const data: Record<string, unknown> = {};
  for (const r of root) {
    resolverCalls++;
    const v = vehicles.find((x) => x.id === r.args?.id);
    data[key(r)] = v ? resolveVehicle(r, v) : null;
  }
  return data;
}

const n = (name: string, select?: Node[], alias?: string, args?: Record<string, string>): Node => ({ name, select, alias, args });

// "alfa" tenant foydalanuvchisi: alias bilan 4 ta ID ni bir so'rovda tekshiradi
const enumerate = ["v1", "v2", "v3", "v4"].map((id, i) => n("vehicle", [n("plate")], "a" + i, { id }));
console.log("1)", JSON.stringify(execute(enumerate)));

// aylanma bog'lanish: vehicle -> driver -> vehicles -> driver -> vehicles ...
let q: Node = n("id");
for (let i = 0; i < 6; i++) q = i % 2 === 0 ? n("vehicles", [q]) : n("driver", [q]);
resolverCalls = 0;
execute([n("vehicle", [q], undefined, { id: "v1" })]);
console.log("2) resolver chaqiruvlari:", resolverCalls);
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu GraphQL enumeration va chuqur so'rov usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) va 278-5-moddasi (Kompyuter sabotaji) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

"alfa" tenant foydalanuvchisi bitta so'rovda to'rtta alias bilan `v1..v4` ID'larini sinaydi (enumeration), keyin aylanma bog'lanishli chuqur so'rov yuboradi. Natija:

```text
1) {"a0":{"plate":"01 A 111 AA"},"a1":{"plate":"10 B 222 BB"},"a2":{"plate":"01 A 333 AA"},"a3":{"plate":"01 A 444 AA"}}
2) resolver chaqiruvlari: 54
```

Birinchi natijada `a1` alias "beta" tenant'iga tegishli mashinaning raqamini qaytardi: ildiz resolver'ida egalik tekshiruvi yo'q (BOLA), aliaslar esa buni bitta so'rovga siqdi. Ikkinchi natijada bitta HTTP so'rov uchun resolver chaqiruvlari soni katta bo'ldi, chunki har ro'yxat maydoni ichki daraxtni haydovchining mashinalari soniga ko'paytiradi (bu yerda uchtaga, real tizimda minglarga).

### 3. Tuzatilgan kod

Tekshiruv ikki qatlamli: bajarishdan oldin daraxt tekshiriladi (ildiz maydonlari, chuqurlik, narx), bajarish paytida har resolver tenant'ni tekshiradi.

```ts run
type Node = { name: string; alias?: string; args?: Record<string, string>; select?: Node[] };
type Veh = { id: string; tenant: string; plate: string; driverId: string };
type Drv = { id: string; tenant: string; name: string };
type Ctx = { tenant: string };

const vehicles: Veh[] = [
  { id: "v1", tenant: "alfa", plate: "01 A 111 AA", driverId: "d1" },
  { id: "v2", tenant: "beta", plate: "10 B 222 BB", driverId: "d2" },
  { id: "v3", tenant: "alfa", plate: "01 A 333 AA", driverId: "d1" },
  { id: "v4", tenant: "alfa", plate: "01 A 444 AA", driverId: "d1" },
];
const drivers: Drv[] = [
  { id: "d1", tenant: "alfa", name: "Anvar" },
  { id: "d2", tenant: "beta", name: "Bobur" },
];

const LIMITS = { maxRoot: 3, maxDepth: 4, maxCost: 200 };
const key = (n: Node) => n.alias ?? n.name;
const depth = (n: Node): number => 1 + Math.max(0, ...(n.select ?? []).map(depth));
const cost = (n: Node): number => 1 + (n.name === "vehicles" ? 10 : 1) * (n.select ?? []).reduce((s, c) => s + cost(c), 0);

function validate(root: Node[]): string | null {
  if (root.length > LIMITS.maxRoot) return "ildiz maydonlari soni";
  if (Math.max(0, ...root.map(depth)) > LIMITS.maxDepth) return "chuqurlik";
  if (root.reduce((s, r) => s + cost(r), 0) > LIMITS.maxCost) return "narx";
  return null;
}

function resolveVehicle(n: Node, v: Veh, ctx: Ctx): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of n.select ?? []) {
    if (c.name === "id") out[key(c)] = v.id;
    if (c.name === "plate") out[key(c)] = v.plate;
    if (c.name === "driver") {
      const d = drivers.find((x) => x.id === v.driverId);
      out[key(c)] = d && d.tenant === ctx.tenant ? resolveDriver(c, d, ctx) : null; // har resolver tekshiradi
    }
  }
  return out;
}
function resolveDriver(n: Node, d: Drv, ctx: Ctx): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of n.select ?? []) {
    if (c.name === "name") out[key(c)] = d.name;
    if (c.name === "vehicles")
      out[key(c)] = vehicles.filter((v) => v.driverId === d.id && v.tenant === ctx.tenant).map((v) => resolveVehicle(c, v, ctx));
  }
  return out;
}

function execute(root: Node[], ctx: Ctx) {
  const bad = validate(root);
  if (bad) return { error: "so'rov rad etildi: " + bad };
  const data: Record<string, unknown> = {};
  for (const r of root) {
    const v = vehicles.find((x) => x.id === r.args?.id);
    data[key(r)] = v && v.tenant === ctx.tenant ? resolveVehicle(r, v, ctx) : null; // begona = mavjud emas
  }
  return { data };
}

const n = (name: string, select?: Node[], alias?: string, args?: Record<string, string>): Node => ({ name, select, alias, args });
const alfa: Ctx = { tenant: "alfa" };

const enumerate = ["v1", "v2", "v3", "v4"].map((id, i) => n("vehicle", [n("plate")], "a" + i, { id }));
console.log("1)", JSON.stringify(execute(enumerate, alfa)));

const few = ["v1", "v2"].map((id, i) => n("vehicle", [n("plate")], "a" + i, { id }));
console.log("2)", JSON.stringify(execute(few, alfa)));

let q: Node = n("id");
for (let i = 0; i < 6; i++) q = i % 2 === 0 ? n("vehicles", [q]) : n("driver", [q]);
console.log("3)", JSON.stringify(execute([n("vehicle", [q], undefined, { id: "v1" })], alfa)));

const legit = n("vehicle", [n("plate"), n("driver", [n("name")])], undefined, { id: "v1" });
console.log("4)", JSON.stringify(execute([legit], alfa)));
```

```text
1) {"error":"so'rov rad etildi: ildiz maydonlari soni"}
2) {"data":{"a0":{"plate":"01 A 111 AA"},"a1":null}}
3) {"error":"so'rov rad etildi: chuqurlik"}
4) {"data":{"vehicle":{"plate":"01 A 111 AA","driver":{"name":"Anvar"}}}}
```

### Tuzatish nima uchun yetarli

Endi uch invariant. Birinchisi: bir so'rovdagi ildiz maydonlari soni (alias bilan) cheklangan, shuning uchun 4 ta alias bilan enumeration rad etiladi (1-natija). Ikkinchisi: chuqurlik va narx bajarishdan oldin, parse qilingan daraxt ustida tekshiriladi, aylanma bog'lanishdagi chuqur so'rov resolver ishga tushmasdan rad etiladi (3-natija). Uchinchisi: har resolver tenant'ni tekshiradi; ruxsat etilgan sondagi alias bilan ham begona mashina `null` beradi (2-natija: `a1` null), ya'ni mavjud emasday ko'rinadi.

Qoldiq risk: aliaslar sonini 3 ga cheklash bitta so'rovda enumeration'ni sekinlashtiradi, lekin hujumchi ko'p HTTP so'rov yuborishi mumkin, shuning uchun limit narx bilan hisoblangan rate limit (73-dars) va monitoring (79-dars) bilan birga ishlatilishi kerak. Narx modeli taxminiy: `vehicles` uchun 10 ko'paytiruvchisi real sahifa o'lchamiga bog'liq. Bajarish paytidagi timeout bu yerda ko'rsatilmagan. Tenant ichidagi foydalanuvchi huquqlari (haydovchi faqat o'z reysini ko'radi), maydon darajasidagi ruxsat (`driver.phone`) va mutation nazorati yo'q. Introspection o'chirilishi va xatolar javobi ham bu kodda ko'rilmagan.

## Qachon qo'llamaslik kerak

- GraphQL har loyiha uchun to'g'ri tanlov emas. Agar sizda 5-10 ta oddiy resurs bo'lsa va bitta frontend, REST yoki RPC xavfsizlikni tekshirishni soddalashtiradi: URL bo'yicha avtorizatsiya, rate limit va monitoring tayyor ishlaydi. GraphQL'ning moslashuvchanligi uchun siz yuqoridagi qo'shimcha nazoratlarni to'lashga tayyor bo'lishingiz kerak.
- Narx tahlili (query cost analysis) hamma API uchun kerak emas. Cheat sheet ham uni amalga oshirish oson emasligini aytadi; sodda API'da chuqurlik/miqdor limiti, pagination va timeout yetarli bo'lishi mumkin.
- Faqat ichki ishonchli mijoz ishlatadigan GraphQL (masalan, o'zingizning frontend'ingiz) uchun "persisted queries" (faqat oldindan ro'yxatdan o'tgan so'rovlarga ruxsat) eng kuchli himoya bo'la oladi, lekin ommaviy API uchun yaramaydi. Bu muallifning tavsiyasi, cheat sheet persisted query'ni tilga olmaydi.
- Introspection'ni o'chirish ommaviy API'da hujjatlashtirishni qiyinlashtiradi; cheat sheet ham ommaviy API'da u ataylab yoqilgan bo'lishi mumkinligini tan oladi. Bunday API'lar uchun sxemani alohida hujjat sifatida chiqarib, introspection'ni autentifikatsiyalangan foydalanuvchilar bilan cheklash mumkin.

## Stack'da: NestJS, Apollo va Prisma

NestJS'da GraphQL uchun `@nestjs/graphql` paketi (Apollo yoki Mercurius drayveri bilan) ishlatiladi. Chuqurlik va narx tekshiruvi odatda validation rule yoki plugin sifatida qo'shiladi; cheat sheet JavaScript uchun chuqurlik uchun `graphql-depth-limit`, miqdor uchun `graphql-input-number`, narx uchun `graphql-cost-analysis` va `graphql-validation-complexity` paketlarini nomlaydi. NestJS hujjati narx tahlili uchun `graphql-query-complexity` bilan integratsiyani tasvirlaydi: `ApolloServerPlugin` sifatida `ComplexityPlugin` yoziladi, `fieldExtensionsEstimator` va `simpleEstimator` bilan hisoblangan narx `maxComplexity` dan oshsa so'rov rad etiladi, maydon narxi esa `@Field({ complexity: 3 })` bilan beriladi (hujjat bu bobni faqat code first yondashuvga tegishli deydi). Avtorizatsiya uchun muhim nozik joy: NestJS hujjatiga ko'ra GraphQL kontekstida guard, interceptor va filter'lar standart holda maydon darajasida ishlamaydi, faqat yuqori darajadagi `@Query()` va `@Mutation()` metodida. `@ResolveField()` metodlarida ishlashi uchun `GraphQLModule.forRoot({ fieldResolverEnhancers: ['guards'] })` kerak, hujjat esa ko'p yozuv qaytganda bu unumdorlikni pasaytirishi mumkinligini ogohlantiradi. Shu sababli quyidagi misolda tenant filtri guard'ga emas, resolver ichidagi `where` shartiga qo'yilgan. Kontekstdan so'rovni olish uchun guard ichida `GqlExecutionContext.create(context)` ishlatiladi. Apollo drayverida GraphiQL `NODE_ENV` production bo'lmaganda avtomatik yoqiladi va production'da standart bo'yicha o'chiq; uni `graphiql: true` bilan majburan yoqish mumkin, shuning uchun bu sozlamani konfiguratsiyada tekshiring. Stack trace uchun cheat sheet Apollo Server'da `includeStacktraceInErrorResponses: false` ni aytadi; u berilmasa `NODE_ENV=production` yoki `test` stack trace'ni standart bo'yicha yashiradi, lekin xato xabarlarini alohida maskalash kerak.

Eslatma: Prisma ORM 7 hujjatiga ko'ra `PrismaClient` driver adapter talab qiladi va adapter'siz `new PrismaClient()` xato beradi; quyidagi namunada qisqalik uchun adapter ko'rsatilmagan, haqiqiy loyihada `new PrismaClient({ adapter })` yozing (masalan, PostgreSQL uchun `@prisma/adapter-pg`).

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Args, Context, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class GqlAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<{ req: { user?: { tenantId: string } } }>();
    return !!ctx.req.user;
  }
}

@Resolver("Driver")
export class DriverResolver {
  // har bog'langan maydon o'z tenant filtri bilan
  @ResolveField("vehicles")
  vehicles(@Parent() driver: { id: string }, @Context() ctx: { req: { user: { tenantId: string } } }) {
    return prisma.vehicle.findMany({
      where: { driverId: driver.id, tenantId: ctx.req.user.tenantId },
      take: 50, // pagination yuqori chegarasi
    });
  }
}

@Resolver("Vehicle")
export class VehicleResolver {
  @Query("vehicle")
  vehicle(@Args("id") id: string, @Context() ctx: { req: { user: { tenantId: string } } }) {
    return prisma.vehicle.findFirst({ where: { id, tenantId: ctx.req.user.tenantId } });
  }
}
```

Ikki narsaga e'tibor bering: tenant filtri har ikki resolver'da `where` ichida (obyektni olishning o'zida), va ro'yxat maydoni `take` bilan chegaralangan. Resolver'larda N+1 muammosi paydo bo'ladi; DataLoader (cheat sheet ham eslatadi) buni hal qiladi, lekin DataLoader keshi so'rov doirasida (har so'rovga yangi) bo'lishi shart, aks holda tenant'lar o'rtasida ma'lumot aralashadi.

## Xulosa

- GraphQL'da shakl va narxni mijoz belgilaydi: URL bo'yicha nazoratlar ishlamaydi, nazorat so'rov daraxti va resolver darajasiga ko'chadi.
- DoS uchun chuqurlik, miqdor, pagination, timeout va narx tahlilini birlashtiring: har biri o'z bo'shlig'ini qoldiradi.
- Avtorizatsiya har obyektni oladigan resolver'da bo'lsin (edges va nodes); `node(id)` kabi umumiy maydonlar alohida tekshiriladi yoki olib tashlanadi.
- Alias va massiv batching bitta HTTP so'rovda yuzlab operatsiyani siqadi: ildiz maydonlari, operatsiyalar soni va narx bo'yicha limit va rate limit narxi shu o'lchovlar bo'yicha.
- Production'da introspection, GraphiQL va batafsil xatolar o'chiriladi; bu chuqurlikdagi himoya, avtorizatsiya o'rnini bosmaydi.
- Argumentlar skalyar, enum va allowlist bilan tekshiriladi; resolver ichidagi SQL va buyruqlar parametrlanadi.
