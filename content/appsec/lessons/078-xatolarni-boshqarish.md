---
n: 78
slug: xatolarni-boshqarish
title: "Xatolarni boshqarish va fail-safe xatti-harakat"
summary: "Xato nega xavfsizlik masalasi: xato xabari orqali razvedka, tekshiruv xato bergan paytda ruxsat berib yuborish (fail open), yarim bajarilgan tranzaksiya. Qaror: xatoni yuz bergan joyda ushlash, mijozga umumiy javob va korrelyatsiya identifikatori, tafsilotni faqat serverga loglash, global handler, fail closed va rollback."
duration: 40
sources:
  - id: t10-a10
    note: "A10:2025 Mishandling of Exceptional Conditions: yangi kategoriya (24 CWE); uch xato (oldini olmaslik, aniqlamaslik, noto'g'ri javob berish); xatoni yuz bergan joyda ushlash, global exception handler, markazlashgan boshqaruv, tranzaksiyani to'liq rollback qilish (failing closed); uchta hujum ssenariysi"
  - id: cs-error-handling
    note: "Error Handling Cheat Sheet: umumiy javob qaytarib, tafsilotni serverda loglash; global error handler; 5xx javobda ichki ma'lumot bo'lmasligi; dev va production farqi; Spring ProblemDetail eslatmasi"
  - id: cs-logging
    note: "Logging Cheat Sheet: qaysi hodisalarni loglash (ilova xatolari, avtorizatsiya xatolari), interaksiya identifikatori (korrelyatsiya), loglanmaydigan ma'lumotlar (token, parol, ulanish satri)"
  - id: saltzer
    note: "Saltzer va Schroeder maqolasi: fail-safe defaults tamoyili. Kirish qarorlari ruxsatga asoslanadi (istisnoga emas), default holat kirish yo'q; ruxsat asosidagi mexanizmdagi xato odatda rad etish tomonga yiqiladi"
  - id: nestjs-exception-filters
    note: "NestJS Exception filters: o'rnatilgan global filter HttpException'ni qayta ishlaydi, notanish xatoga `{statusCode: 500, message: Internal server error}` qaytaradi; HttpException'ga berilgan Error serializatsiya qilinmaydi, `cause` log uchun; HttpException logga yozilmaydi; `@Catch()`, `APP_FILTER`, middleware xatolari faqat global filterga tushadi"
  - id: nestjs-ws-filters
    note: "NestJS WebSocket exception filters: `useGlobalFilters()` va `APP_FILTER` global filterlari gateway'larga qo'llanmaydi, filter gateway yoki metod darajasida `@UseFilters()` bilan bog'lanadi"
  - id: prisma-error-reference
    note: "Prisma xato kodlari: Prisma Client ma'lum so'rov xatosida `PrismaClientKnownRequestError` tashlaydi; P2002 unique constraint buzilishi, P2003 foreign key buzilishi, P2025 kerakli yozuv topilmagani"
quiz:
  - q: "Policy xizmati javob bermay qoldi va kod `try { allowed = policy(r) } catch {}` bilan yozilgan, `allowed` boshida `true`. Nima bo'ladi?"
    options:
      - "Xizmat qaytguncha so'rovlar rad etiladi"
      - "Hamma so'rov 500 oladi"
      - "Hech narsa: try/catch xavfsiz"
      - "Xato yutiladi va `allowed` true bo'lib qoladi: tekshiruv ishlamay qolgan payt hamma so'rov ruxsat oladi (fail open). Default `false` bo'lishi va xato rad etishga olib kelishi kerak"
    answer: 3
    explain: "A10:2025 va CWE-636 aynan shu holatni 'failing open' deb ataydi. Tekshiruvchi mexanizm xato bersa, tizim ruxsat bermaslik tomonga yiqilishi kerak (fail-safe defaults)."
  - q: "Production'da 500 javob tanasida `connect ECONNREFUSED 10.0.3.7:8181` va SQL matni qaytyapti. Asosiy xavf nima?"
    options:
      - "Faqat foydalanuvchi tajribasi yomonlashadi"
      - "Hujumchiga razvedka: ichki manzillar, jadval nomlari va texnologiya versiyalari ma'lum bo'ladi, bu keyingi hujumni aniqlashtiradi"
      - "Hech qanday xavf yo'q, chunki manzil ichki"
      - "Faqat log hajmi oshadi"
    answer: 1
    explain: "Error Handling Cheat Sheet hujum razvedka bosqichidan boshlanishini va ochilgan xato tafsilotlari shu bosqichga yordam berishini aytadi. A10 ssenariy 2: xato matni keyingi SQL injection uchun razvedka bo'ladi."
  - q: "Mijozga qaytariladigan umumiy xato javobida server logidagi yozuv bilan bog'lash uchun nima bo'lishi kerak?"
    options:
      - "Stack trace'ning birinchi qatori"
      - "Foydalanuvchi ismi"
      - "Tasodifiy, ma'noga ega bo'lmagan korrelyatsiya identifikatori (masalan `e-1042`): mijoz uni qo'llab-quvvatlashga aytadi, siz logdan topasiz"
      - "Ichki xato kodi va xato sinfi nomi"
    answer: 2
    explain: "Umumiy javob debug'ni qiyinlashtirmasligi uchun interaksiya identifikatori ishlatiladi (Logging Cheat Sheet 'interaction identifier'). Identifikator ichki tafsilotni ochmaydi, lekin logdagi to'liq yozuvga olib boradi."
  - q: "Tranzaksiya o'rtasida xato yuz berdi: kvota kamaytirilgan, xabar esa yuborilmagan. A10:2025 nima deydi?"
    options:
      - "Tranzaksiyaning hamma qismini rollback qilib, boshidan boshlash (failing closed); yarim yo'lda tiklashga urinish ko'pincha tuzatib bo'lmaydigan xatolarga olib keladi"
      - "Davom ettirib, qolgan qadamlarni qayta urinish"
      - "Xatoni e'tiborsiz qoldirish"
      - "Faqat xatoni yozib qo'yish"
    answer: 0
    explain: "A10:2025 yarim yo'lda tiklashga urinish ko'pincha tuzatib bo'lmaydigan xatolarni keltirib chiqarishini va to'liq rollback kerakligini aytadi. Biz misolda kvotani qaytaramiz."
  - q: "Global exception filter bor. Nega xatolarni yuz bergan joyda ham ushlash kerak?"
    options:
      - "Global filter yetarli, joyda ushlash ortiqcha"
      - "Joyda ushlash tezroq ishlaydi"
      - "Global handler faqat development uchun"
      - "Joyda ushlangan xato mazmunli qayta ishlanadi (rollback, resursni bo'shatish, aniq javob). Global handler esa o'tkazib yuborilgan holatlar uchun oxirgi chora (last resort)"
    answer: 3
    explain: "A10:2025 har bir tizim xatosini yuz bergan joyda ushlashni va global handler'ni o'tkazib yuborilgan holatlar uchun saqlashni aytadi. ASVS 16.5.4 ham 'last resort' handler talab qiladi."
  - q: "Quyidagilardan qaysi biri fail closed qarori bo'lishi mumkin emas?"
    options:
      - "Avtorizatsiya xizmati ishlamasa so'rovni rad etish (503)"
      - "Validatsiya xato bersa tranzaksiyani bajarmaslik"
      - "Rate limit uchun Redis ishlamasa hamma so'rovni o'tkazish, chunki 'foydalanuvchi to'xtamasin'"
      - "Tekshirish tugallanmasa buyruqni navbatga qo'ymaslik"
    answer: 2
    explain: "Bu fail open: himoya mexanizmi ishlamay qolganda u o'chirilgan bo'ladi. Ba'zan bu ongli tanlov (73-dars), lekin u aniq qaror, hodisa sifatida loglanishi va ogohlantirish berishi kerak, 'tasodifan' emas."
task:
  title: "Xatoni xavfsiz javobga aylantirish"
  prompt: |
    `toResponse(e, id, log)` ushlangan xatoni mijozga qaytariladigan javobga aylantiradi. Hozir u xato xabarini to'g'ridan-to'g'ri mijozga qaytaradi va hech narsani loglamaydi.

    Qoidalar:
    1. `AppError` (mijozga ko'rsatish uchun mo'ljallangan xato, `status` va `publicMessage` bor) bo'lsa: javob `{ status: e.status, body: { error: e.publicMessage, id } }`.
    2. Boshqa har qanday qiymat (`Error`, satr, `null`) uchun: `{ status: 500, body: { error: "internal_error", id } }`.
    3. Ikkala holatda ham `log` massiviga bitta satr qo'shiladi: `` `${id} ${tafsilot}` ``, bunda tafsilot `Error` bo'lsa `e.name + ": " + e.message`, aks holda `String(e)`.
    4. Ichki xabar (masalan `ECONNREFUSED`) hech qachon javob tanasiga tushmasin.

    Kutilgan chiqish: 404 topilmadi, 500 internal_error (uchta holat), va oxirida log satrlari soni 4 hamda "javobda ichki tafsilot: false".
  lang: ts
  starter: |
    class AppError extends Error {
      constructor(public status: number, public publicMessage: string, detail?: string) {
        super(detail ?? publicMessage);
        this.name = "AppError";
      }
    }

    type Res = { status: number; body: { error: string; id: string } };

    function toResponse(e: unknown, id: string, log: string[]): Res {
      return { status: 500, body: { error: (e as Error).message, id } };
    }

    const log: string[] = [];
    const cases: unknown[] = [
      new AppError(404, "topilmadi", "vehicle v9 not found in tenant alfa"),
      new Error("connect ECONNREFUSED 10.0.3.7:8181"),
      "qatordagi xato",
      null,
    ];
    const results = cases.map((c, i) => toResponse(c, `e-${i + 1}`, log));
    for (const r of results) console.log(r.status, r.body.error, r.body.id);
    console.log("log satrlari:", log.length);
    console.log("javobda ichki tafsilot:", JSON.stringify(results).includes("ECONNREFUSED"));
  solution: |
    class AppError extends Error {
      constructor(public status: number, public publicMessage: string, detail?: string) {
        super(detail ?? publicMessage);
        this.name = "AppError";
      }
    }

    type Res = { status: number; body: { error: string; id: string } };

    function toResponse(e: unknown, id: string, log: string[]): Res {
      const detail = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
      log.push(`${id} ${detail}`);
      if (e instanceof AppError) {
        return { status: e.status, body: { error: e.publicMessage, id } };
      }
      return { status: 500, body: { error: "internal_error", id } };
    }

    const log: string[] = [];
    const cases: unknown[] = [
      new AppError(404, "topilmadi", "vehicle v9 not found in tenant alfa"),
      new Error("connect ECONNREFUSED 10.0.3.7:8181"),
      "qatordagi xato",
      null,
    ];
    const results = cases.map((c, i) => toResponse(c, `e-${i + 1}`, log));
    for (const r of results) console.log(r.status, r.body.error, r.body.id);
    console.log("log satrlari:", log.length);
    console.log("javobda ichki tafsilot:", JSON.stringify(results).includes("ECONNREFUSED"));
  solutionNotes: |
    - `AppError` ham to'liq tafsilot bilan loglanadi (`vehicle v9 not found in tenant alfa`), mijozga esa faqat `publicMessage` boradi. Shu ajratish asosiy g'oya.
    - Noma'lum qiymatlar (satr, `null`) ham ushlanadi: JavaScript'da istalgan qiymatni `throw` qilish mumkin, shuning uchun `e instanceof Error` tekshiruvisiz `e.message` ga tegish yangi xato keltirib chiqaradi.
    - Haqiqiy tizimda `publicMessage` ham ichki ma'lumot bo'lmasligi kerak. Uni dasturchi yozadi, tashqaridan kelgan matn bo'lishi mumkin emas.
    - Log satrida foydalanuvchi kiritgan qiymatlar bo'lsa, ularni tozalash kerak (log injection, 79-dars). Bu yerda log satri faqat o'quv uchun.
    - Funksiya xatoning o'zini yutmaydi: u faqat javobni quradi. Rollback va resurslarni bo'shatish xato yuz bergan joyda bajariladi.
  checklist:
    - "AppError mijozga faqat publicMessage va id beradi"
    - "Noma'lum xato 500 internal_error beradi, ichki xabar javobda yo'q"
    - "Har xato id bilan logga yoziladi"
    - "Error bo'lmagan qiymatlar (satr, null) ham xavfsiz ushlanadi"
    - "Tafsilot logda, umumiy javob mijozda ajralib turishini tushuntira olasiz"
---

## Muammo

Avtopark platformasida dispetcher mashinaga buyruq yuboradi: "dvigatelni sekinlashtir", "marshrutni yangila". Buyruq oddiy ko'rinadi, lekin uning yo'lida bir nechta tashqi qism bor: policy xizmati (kim qaysi mashinaga buyruq bera oladi), xabarlar navbati (broker) va ma'lumotlar bazasi. Har biri istalgan payt ishdan chiqishi mumkin. Savol: ular ishdan chiqqanda tizim nima qiladi?

OWASP Top 10:2025 shu savolga alohida kategoriya ajratgan: A10 Mishandling of Exceptional Conditions. Matnda aytilishicha, bu 2025 yil uchun yangi kategoriya, unga 24 ta CWE kiradi va u noto'g'ri xato boshqaruvi, mantiqiy xatolar va fail open (ruxsat berib yuborish) holatlariga qaratilgan. Kategoriya uchta muvaffaqiyatsizlikni sanaydi: ilova g'ayrioddiy holatning yuz berishini oldini olmaydi, uni yuz berayotganda aniqlamaydi va/yoki undan keyin yomon javob beradi yoki umuman javob bermaydi.

Amaliyotda bu uch xil ko'rinadi.

Birinchisi, xato xabari orqali razvedka. Error Handling Cheat Sheet hujum odatda razvedkadan boshlanishini aytadi: hujumchi texnologiya nomlari va versiyalarini yig'adi, ishlov berilmagan xatolar esa bu bosqichga yordam beradi. Mijozga qaytgan `ECONNREFUSED 10.0.3.7:8181` ichki tarmoq manzilini, SQL xatosi jadval nomini ochadi. A10 ssenariy 2 shuni tasvirlaydi: hujumchi ataylab xato chiqaradi va olingan ma'lumotdan yaxshiroq SQL injection tuzadi.

Ikkinchisi, fail open. Tekshiruvchi mexanizmning o'zi xato berganda tizim "xato bo'ldi, demak ehtimol hammasi joyida" deb davom etadi. Ruxsat tekshiruvi ishlamay qolganda hamma o'tib ketadi. CWE-636 aynan shuni "Not Failing Securely (Failing Open)" deb ataydi va A10 ro'yxatida alohida ko'rsatilgan.

Uchinchisi, yarim bajarilgan holat. Tranzaksiya o'rtasida xato yuz beradi, avvalgi qadamlar esa qaytarilmaydi. A10 ssenariy 3 moliyaviy misol keltiradi: hisobdan yechish, qabul qiluvchiga o'tkazish, yozib qo'yish tartibida ish ketma-ket bajarilsa va o'rtasida uzilish bo'lsa, to'liq rollback qilinmagan tizim buzilgan holatda qoladi.

## Asosiy g'oya

### Uch qoida

**Birinchi qoida: xato tafsiloti serverda qoladi.** Cheat sheet maqsadni shunday ifodalaydi: kutilmagan xato yuz berganda ilova umumiy javob qaytaradi, xato tafsilotlari esa server tomonda tekshiruv uchun loglanadi va mijozga qaytarilmaydi. Mijoz ko'radigan narsa: holat kodi, qisqa umumiy xabar va korrelyatsiya identifikatori. Server loglarida esa o'sha identifikator bilan to'liq tafsilot turadi. Logging Cheat Sheet bu g'oyani "interaction identifier" deb ataydi: bitta foydalanuvchi harakati bilan bog'liq hamma hodisani bog'laydigan belgi. Identifikator tasodifiy bo'lsin va ichki ma'noga ega bo'lmasin, aks holda u o'zi ma'lumot sizdiradi.

**Ikkinchi qoida: xatoda default rad etish.** Saltzer va Schroederning klassik dizayn tamoyillaridan biri fail-safe defaults: kirish qarori ruxsatga emas, rad etishga asoslanadi, ya'ni default holat "kirish yo'q", ruxsat esa aniq berilishi kerak. Maqolada bu "ruxsat asosidagi" qaror deb ifodalanadi: default holat kirish yo'q, loyiha esa ruxsat berish uchun sabablardan boshlanadi, chunki ruxsat asosidagi mexanizmdagi xato odatda rad etish bilan tugaydi (3-dars). Xatoga tatbiq etilganda: tekshiruv natijasini aniqlay olmasak, natija "rad". Kodda bu `let allowed = false` bilan boshlash va faqat tekshiruv aniq `true` qaytarganda uni o'zgartirish degani.

**Uchinchi qoida: yarim holatni qoldirmaslik.** A10 matni: tranzaksiya o'rtasida bo'lsangiz, uning hamma qismini rollback qilib, boshidan boshlash juda muhim (bu ham failing closed deb ataladi); yarim yo'lda tiklashga urinish ko'pincha tuzatib bo'lmaydigan xatolarni yaratadi. Ya'ni "qolgan qadamni qayta urinib ko'raylik" emas, balki "boshlangan hamma narsani bekor qilaylik".

### Qayerda ushlash

A10 ikki qatlamni birga talab qiladi. Birinchisi, har bir mumkin bo'lgan tizim xatosini yuz bergan joyda ushlab, mazmunli ishlov berish: foydalanuvchiga tushunarli xabar, hodisani loglash, kerak bo'lsa ogohlantirish. Ikkinchisi, o'tkazib yuborilgan holatlar uchun global exception handler. Bundan tashqari matn markazlashgan yondashuvni ta'kidlaydi: bitta ilovada xatoni boshqaradigan bir nechta turli funksiya bo'lmasligi kerak, bu har safar bir xil joyda, bir xil usulda bajarilishi lozim; tashkilot bo'yicha ham bir xil bo'lsa, kodni ko'rib chiqish va audit osonlashadi.

ASVS 5.0.0 bu talablarni bo'limga ajratgan (V16.5). 16.5.1 talabi: kutilmagan yoki xavfsizlikka oid xato bo'lganda iste'molchiga umumiy xabar qaytariladi va stack trace, so'rovlar, maxfiy kalitlar, token'lar kabi ichki tizim ma'lumotlari ochilmaydi. 16.5.3: ilova xavfsiz tarzda yiqiladi, jumladan validatsiya mantiqidagi xato tufayli tranzaksiyani baribir qayta ishlash kabi fail-open holatlarning oldi olinadi. 16.5.4 (3-daraja): "oxirgi chora" handler butun ilova jarayonini yiqitmaslik va xato tafsilotlari loglardan yo'qolmasligi uchun belgilanadi. ASVS 16.5.2 esa tashqi resursga kirish muvaffaqiyatsiz bo'lganda ilova xavfsiz ishlashda davom etishini (circuit breaker yoki graceful degradation kabi) talab qiladi.

## Chuqurroq: xato turlari va oqibatlari

### Kutilgan va kutilmagan xatolar

Hamma xatoni bir xil ko'rish kerak emas. "Mashina topilmadi" yoki "ruxsat yo'q" kutilgan xatolar: ularning mijozga ko'rsatiladigan matni dasturchi tomonidan oldindan yozilgan va xavfsiz. Ularni maxsus sinf (bizning misolda `AppError`) bilan ajratamiz. Boshqa hamma narsa, ya'ni ma'lumotlar bazasi uzilishi, noma'lum `TypeError`, tashqi xizmat timeout'i, kutilmagan xato: mijozga faqat "ichki xato" va identifikator qaytadi. Muhim nuqta: ajratish "dasturchi qasddan yozgan matn" bilan "tizim o'zi hosil qilgan matn" o'rtasida bo'ladi. Ikkinchisi hech qachon mijozga bormaydi.

Holat kodlari ham xabar beradi. Cheat sheet 5xx'ni "so'rovni bajara olmadim" holatlari uchun ishlatishni, ichki sabablarni esa javobga qo'shmaslikni aytadi. Misollarida u ba'zan 4xx kodlari mosroq bo'lishini ham qayd etadi: mijoz noto'g'ri so'rov yuborganda. Xato tanasi uchun cheat sheet "Problem Details for HTTP APIs" formatiga havola qiladi (RFC 7807, havolalar ro'yxatida RFC 9457) va Spring misolida `application/problem+json` content-type tilga olinadi. Format JSON tanada `type`, `title`, `status`, `detail` kabi standart maydonlarni belgilaydi; ularga ichki ma'lumot yozmang.

### Xabar orqali enumeration

Xato xabarlarining farqi o'zi ma'lumot bo'lishi mumkin. "Foydalanuvchi topilmadi" va "parol noto'g'ri" xabarlari kirish oynasida hisob mavjudligini bildiradi (43-dars). Xuddi shunday, "bu mashina boshqa tenant'ga tegishli" va "bu mashina yo'q" ikki xil javobi tenant chegarasidan tashqaridagi obyektlar haqida ma'lumot beradi (52-dars). Qoida: tashqaridan ko'rinadigan javoblar farqi bo'lmasligi kerak joyda farq bo'lmasin, ichki farqni logda saqlang.

### Resurs oqishi va xatoni yutish

A10 ssenariy 1 fayl yuklash paytida xato ushlanib, resurslar bo'shatilmaydigan holatni keltiradi: har bir yangi xato resursni band qoldiradi, oxiri hamma resurs tugaydi va DoS paydo bo'ladi. Shuning uchun xato yo'lida ham resurslar (ulanish, fayl, qulf) `finally` bloki yoki ekvivalenti bilan bo'shatiladi. Ikkinchi tomoni: bo'sh `catch {}` bloki xatoni yo'q qiladi va monitoring ko'rmaydi (79-dars). A10 ro'yxatidagi CWE'lar orasida "Detection of Error Condition Without Action" (CWE-390) va "Unchecked Error Condition" (CWE-391) ham bor.

### Takroriy xatolar va shovqin

A10 bir xil xatolar belgilangan chastotadan oshib takrorlansa, ularni alohida yozuv emas, "qancha marta va qaysi vaqt oralig'ida" statistikasi sifatida chiqarishni o'ylab ko'rishni tavsiya qiladi. Bu ma'lumot asl xabarga qo'shiladi, avtomatik logging va monitoring buzilmasligi uchun. Bu loglarni to'ldirib yuborish orqali DoS'ning oldini oladi.

### Dev va production

Cheat sheet ASP.NET misolida dasturchi xato sahifasi faqat development muhitida yoqilishini va boshqa muhitlarda global handler ishlashini ko'rsatadi. Umumiy qoida: debug rejimi, batafsil xato sahifalari va stack trace production'da o'chiq. Bu konfiguratsiya xatosi sifatida ham xavf (API8 va A02, 71-dars).

## Misol: dispetcher buyrug'i

Quyidagi kod mashinaga buyruq yuborishni modellaydi. Tashqi qismlar (policy xizmati, broker) o'zgaruvchilar bilan almashtirilgan, shunda ularni "ishdan chiqarish" mumkin. Ulanish satridagi login va parol uydirma.

### 1. Zaif kod

```ts run
type Req = { tenant: string; vehicleId: string };
const owner: Record<string, string> = { v1: "alfa", v2: "beta" };
const env = { policyUp: true, brokerUp: true };
const quota: Record<string, number> = { alfa: 3, beta: 3 };

function policy(r: Req): boolean {
  if (!env.policyUp) throw new Error("connect ECONNREFUSED 10.0.3.7:8181");
  return owner[r.vehicleId] === r.tenant;
}
function publish(r: Req): void {
  if (!env.brokerUp) throw new Error(`broker timeout amqp://svc_cmd:hunter2@10.0.3.9/commands (vehicle ${r.vehicleId})`);
}

// ZAIF: tekshiruv xatosi yutiladi, kvota oldin kamayadi, xato matni mijozga qaytadi
function handleWeak(r: Req): { status: number; body: unknown } {
  let allowed = true;
  try {
    allowed = policy(r);
  } catch {
    // xato yutildi
  }
  if (!allowed) return { status: 403, body: { error: "forbidden" } };
  quota[r.tenant]--;
  try {
    publish(r);
    return { status: 200, body: { sent: true } };
  } catch (e) {
    return { status: 500, body: { error: (e as Error).message } };
  }
}

env.policyUp = false;
console.log("1) policy ishlamayapti, beta -> alfa mashinasi:", JSON.stringify(handleWeak({ tenant: "beta", vehicleId: "v1" })));

env.policyUp = true;
env.brokerUp = false;
console.log("2) broker ishlamayapti:", JSON.stringify(handleWeak({ tenant: "alfa", vehicleId: "v1" })));
handleWeak({ tenant: "alfa", vehicleId: "v1" });
handleWeak({ tenant: "alfa", vehicleId: "v1" });
console.log("3) alfa kvotasi:", quota.alfa);
```

### 2. Hujum

Hujumchi hech narsani buzmaydi, faqat xatolar paydo bo'lishini kutadi (yoki ularni qo'zg'atadi). Policy xizmati ishlamagan paytda "beta" tenant foydalanuvchisi "alfa"ning mashinasiga buyruq yuboradi. Keyin broker uzilganda mijoz xato javobini o'qiydi va kvota yo'qola boshlaydi.

```text
1) policy ishlamayapti, beta -> alfa mashinasi: {"status":200,"body":{"sent":true}}
2) broker ishlamayapti: {"status":500,"body":{"error":"broker timeout amqp://svc_cmd:hunter2@10.0.3.9/commands (vehicle v1)"}}
3) alfa kvotasi: 0
```

Birinchi so'rovda tekshiruv xatosi yutildi va begona tenant buyrug'i yuborildi. Ikkinchisida mijozga ichki broker manzili, login va parol qaytdi. Uchinchisida kvota yuborilmagan buyruqlar uchun kamaydi (3 dan 0 ga): har muvaffaqiyatsiz urinish kvotani yeydi.

### 3. Tuzatilgan kod

Tekshiruv natijasi uch holatli (`allow`, `deny`, `unavailable`), xatoda default rad; kvota rollback qilinadi; barcha tafsilot logga, mijozga esa umumiy javob va identifikator ketadi.

```ts run
type Req = { tenant: string; vehicleId: string };
type Res = { status: number; body: { error?: string; sent?: boolean; id?: string } };
const owner: Record<string, string> = { v1: "alfa", v2: "beta" };
const env = { policyUp: true, brokerUp: true };
const quota: Record<string, number> = { alfa: 3, beta: 3 };
const logs: string[] = [];
let seq = 0;

function policy(r: Req): boolean {
  if (!env.policyUp) throw new Error("connect ECONNREFUSED 10.0.3.7:8181");
  return owner[r.vehicleId] === r.tenant;
}
function publish(r: Req): void {
  if (!env.brokerUp) throw new Error(`broker timeout amqp://svc_cmd:hunter2@10.0.3.9/commands (vehicle ${r.vehicleId})`);
}

function authorize(r: Req, id: string): "allow" | "deny" | "unavailable" {
  try {
    return policy(r) ? "allow" : "deny";
  } catch (e) {
    logs.push(`${id} policy xatosi: ${(e as Error).message}`);
    return "unavailable"; // fail closed: ruxsat berilmaydi
  }
}

function handle(r: Req): Res {
  const id = `e-${++seq}`;
  try {
    const decision = authorize(r, id);
    if (decision === "deny") return { status: 403, body: { error: "forbidden", id } };
    if (decision === "unavailable") return { status: 503, body: { error: "try_later", id } };
    if (quota[r.tenant] <= 0) return { status: 429, body: { error: "quota", id } };
    quota[r.tenant]--;
    try {
      publish(r);
    } catch (e) {
      quota[r.tenant]++; // rollback: yarim holat qoldirmaymiz
      throw e;
    }
    return { status: 200, body: { sent: true } };
  } catch (e) {
    logs.push(`${id} ${(e as Error).message}`);
    return { status: 500, body: { error: "internal_error", id } };
  }
}

env.policyUp = false;
console.log("1)", JSON.stringify(handle({ tenant: "beta", vehicleId: "v1" })));

env.policyUp = true;
env.brokerUp = false;
console.log("2)", JSON.stringify(handle({ tenant: "alfa", vehicleId: "v1" })));
handle({ tenant: "alfa", vehicleId: "v1" });
handle({ tenant: "alfa", vehicleId: "v1" });
console.log("3) alfa kvotasi:", quota.alfa);

env.brokerUp = true;
console.log("4)", JSON.stringify(handle({ tenant: "alfa", vehicleId: "v1" })));
console.log("5) log yozuvlari soni:", logs.length, "| birinchisi:", logs[0]);
```

```text
1) {"status":503,"body":{"error":"try_later","id":"e-1"}}
2) {"status":500,"body":{"error":"internal_error","id":"e-2"}}
3) alfa kvotasi: 3
4) {"status":200,"body":{"sent":true}}
5) log yozuvlari soni: 4 | birinchisi: e-1 policy xatosi: connect ECONNREFUSED 10.0.3.7:8181
```

### Tuzatish nima uchun yetarli

Invariantlar: tekshiruv xizmati xato bergan paytda hech qanday buyruq yuborilmaydi (1-qator: 503); mijozga ichki manzil va parol qaytmaydi, faqat `internal_error` va identifikator; muvaffaqiyatsiz urinish kvotani kamaytirmaydi (kvota 3 da qoladi); har xato identifikator bilan logga tushadi, shu sababli qo'llab-quvvatlash xizmati mijoz aytgan `e-2` bo'yicha sababni topadi.

Yopilmagan narsalar: log yozuvida broker ulanish satri (parol bilan) turibdi. Logging Cheat Sheet ulanish satrlari va boshqa maxfiy ma'lumotlarni to'g'ridan-to'g'ri yozmaslikni, ularni olib tashlash, maskalash yoki hash qilishni aytadi (79-dars); xato xabarlarini loglashdan oldin tozalash alohida qadam bo'lishi kerak. Kvota va navbatga yuborish haqiqiy tizimda bitta atomar operatsiya yoki idempotent qayta urinish bilan yechilishi kerak (60 va 75-darslar): bu yerdagi rollback faqat bitta jarayon ichida ishlaydi. Policy xizmati uzoq vaqt ishlamasa, circuit breaker va ogohlantirish kerak (ASVS 16.5.2).

## Qachon qo'llamaslik kerak

- Fail closed hamma joyda to'g'ri emas. Xavfsizlik nazorati (avtorizatsiya, validatsiya, imzo tekshiruvi) uchun xatoda rad etish kerak. Xavfsizlikka aloqasi bo'lmagan qo'shimcha funksiya uchun (masalan, xaritadagi qo'shimcha qatlam yoki statistika) xato bo'lganda funksiyani o'chirib, qolgan tizimni ishlatish to'g'ri: bu graceful degradation (ASVS 16.5.2). Farqni aniq ajrating.
- Insoniy xavfsizlik (safety) va axborot xavfsizligi (security) ba'zan qarama-qarshi. Masalan, "mashinani favqulodda to'xtatish" buyrug'i uchun policy xizmati ishlamasa, hammasini rad etish xavfli bo'lishi mumkin. Bunday qaror oldindan, ongli ravishda qabul qilinadi: istisno holatda ruxsat beriladi, lekin alohida audit yozuvi va ogohlantirish bilan. Muhimi, bu tasodifan `catch {}` natijasi emas, hujjatlashtirilgan qaror bo'lishi.
- Juda umumiy xato javoblari debug'ni qiyinlashtiradi. Yechim ma'lumotni mijozga ochish emas, identifikator va yaxshi log. Ichki xizmatlar orasidagi aloqada ham stack trace va maxfiy ma'lumot almashinmaydi; ularning orasida batafsilroq, lekin hamon xavfsiz xato kodlari mumkin.
- Hamma xatoni bir joyda ushlash "markazlashtirish" emas. Agar global handler hamma narsani 500 ga aylantirsa, mijozga qaytadigan 4xx (validatsiya, ruxsat yo'q) yo'qoladi. Kutilgan xatolar o'z holat kodi bilan chiqishi kerak.

## Stack'da: NestJS exception filter

NestJS'da o'rnatilgan exceptions layer ishlov berilmagan barcha xatolarni ushlaydi. Hujjatga ko'ra, o'rnatilgan global filter `HttpException` va uning subclass'larini qayta ishlaydi; tanib bo'lmaydigan xato uchun u `{ statusCode: 500, message: "Internal server error" }` javobini qaytaradi. Ya'ni standart xatti-harakat allaqachon xavfsizroq, ammo uni o'zimizning identifikator va loglash bilan to'ldiramiz. Yana bir nuqta: o'rnatilgan filter `HttpException` va uning subclass'larini loglamaydi (ular oddiy oqim deb hisoblanadi), shuning uchun ularni xavfsizlik nuqtai nazaridan kuzatish kerak bo'lsa (masalan, ko'p 403) o'z filteringizda yozing.

Hujjatning yana ikki muhim eslatmasi bor. Birinchisi, `HttpException`'ga `Error` obyektini `response` sifatida berish uni mijozga serializatsiya qilmaydi, asl xatoni log uchun `cause` sifatida uzating. Ikkinchisi, global filterlar (`useGlobalFilters()` yoki `APP_FILTER`) WebSocket gateway'larga qo'llanmaydi, ular uchun filter gateway yoki metod darajasida `@UseFilters()` bilan bog'lanadi (77-dars). Middleware ichidan tashlangan xatolarga faqat global filterlar ta'sir qiladi.

Quyidagi filter global bo'lib ro'yxatdan o'tadi va `@Catch()` bilan hamma xatoni ushlaydi.

```ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { randomUUID } from "node:crypto";

type Res = { status(code: number): { json(body: unknown): void } };

@Catch()
export class SafeExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Res>();
    const id = randomUUID();
    const detail = exception instanceof Error ? `${exception.name}: ${exception.message}` : String(exception);
    console.error(JSON.stringify({ id, detail })); // haqiqiy tizimda: logger + maskalash (79-dars)

    if (exception instanceof HttpException) {
      // dasturchi qasddan tashlagan xato: status saqlanadi, tana umumiy
      res.status(exception.getStatus()).json({ error: exception.message, id });
      return;
    }
    res.status(500).json({ error: "internal_error", id });
  }
}

@Module({ providers: [{ provide: APP_FILTER, useClass: SafeExceptionFilter }] })
export class ErrorsModule {}
```

Bu yerda `HttpException` xabari dasturchi yozgan deb faraz qilinadi. Agar u tashqi matnni o'z ichiga olsa, mijozga qaytarishdan oldin tekshiring. Kutubxona xatolarini (masalan, unique constraint) alohida holat kodiga o'girish mumkin, lekin kutubxona xabarini mijozga uzatmang. Prisma hujjatiga ko'ra Prisma Client ma'lum so'rov xatosida `PrismaClientKnownRequestError` tashlaydi va `code` maydoni beriladi: `P2002` unique constraint buzilishi, `P2025` kerakli yozuv topilmagani. Birinchisini 409 ga, ikkinchisini 404 ga o'girish mumkin, xato xabari (`message`) esa faqat logga ketadi.

## Xulosa

- Mijozga xato tafsiloti bermang: holat kodi, qisqa umumiy xabar va korrelyatsiya identifikatori yetarli. Tafsilot faqat server logida (Error Handling Cheat Sheet, ASVS 16.5.1).
- Xavfsizlik tekshiruvi xato bersa, natija rad: `allowed` default `false`, xato "ruxsat" bo'lib qolmasin (fail-safe defaults, A10, CWE-636).
- Tranzaksiya o'rtasidagi xatoda hamma narsani rollback qiling; yarim yo'lda tiklashga urinmang. Resurslarni xato yo'lida ham bo'shating.
- Xatoni yuz bergan joyda mazmunli ushlang, o'tib ketganlar uchun global handler (last resort) qo'ying, hammasi bir joyda va bir xil usulda.
- Kutilgan xatolarni (`AppError`) kutilmaganlardan ajrating; kutilmagan xato hech qachon o'z matni bilan mijozga bormasin.
- Fail open faqat hujjatlashtirilgan, loglanadigan va ogohlantirish beradigan ongli qaror bo'lsin, tasodifiy bo'sh `catch` natijasi emas.
