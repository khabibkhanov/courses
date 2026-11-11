---
n: 3
slug: secure-design-tamoyillari
title: "Secure design tamoyillari: least privilege, defense in depth, fail-safe defaults"
summary: "Saltzer va Schroeder tamoyillari (fail-safe defaults, least privilege, complete mediation va boshqalar), defense in depth va ularning avtopark platformasidagi qo'llanilishi; fail-open ruxsat tekshiruvining zaif va tuzatilgan versiyasi."
duration: 40
sources:
  - id: saltzer
    note: "Saltzer va Schroeder maqolasi: axborotni himoya qiluvchi tizimlar dizayni uchun sakkiz tamoyil (economy of mechanism, fail-safe defaults, complete mediation, open design, separation of privilege, least privilege, least common mechanism, psychological acceptability)"
  - id: t10-a06
    note: "A06:2025 Insecure Design: dizayn nuqsonlari va implementatsiya nuqsonlari turli narsalar; secure design naqshlari va threat modeling kerakligi"
  - id: cs-secure-design
    note: "Secure Product Design Cheat Sheet: secure defaults, attack surface'ni kamaytirish va xavfsiz holatga qaytish (fail securely) boshlang'ich qoidalar; tamoyillar: least privilege, defense-in-depth, zero trust, security-in-the-open"
  - id: nist-ssdf
    note: "NIST SP 800-218 SSDF: xavfsiz dasturiy ta'minot ishlab chiqish amaliyotlari; Threat Modeling Cheat Sheet qabul qilingan mitigation qarorlarini tizim o'zgargan sari yangilab turishni SSDF PW.1.2 amaliyotiga bog'laydi"
quiz:
  - q: "Ruxsat tekshiruvi funksiyasi `try { return policy[role].includes(action) } catch { return true }` ko'rinishida. Qaysi tamoyil buzilgan?"
    options:
      - "Fail-safe defaults: xato yuz berganda ruxsat beriladi"
      - "Open design: kod ochiq"
      - "Economy of mechanism: kod juda qisqa"
      - "Least common mechanism: ikkita funksiya bor"
    answer: 0
    explain: "Ruxsat bermaslik default bo'lishi kerak; xato, noma'lum rol yoki policy'ning ishlamay qolishi rad etishga olib kelishi shart. Fail-open tekshiruv xatoni hujumga aylantiradi."
  - q: "Hisobot servisi bazadan faqat o'qiydi, lekin unga `DELETE` huquqi ham berilgan. Bu qaysi tamoyilga zid va nega xavfli?"
    options:
      - "Complete mediation; chunki tekshiruv kech bajariladi"
      - "Least privilege; servis egallansa yoki xato qilsa, keraksiz huquq ham ishlatiladi"
      - "Separation of privilege; chunki ikkita kalit kerak"
      - "Open design; chunki huquqlar hujjatlangan"
    answer: 1
    explain: "Least privilege: har bir komponent faqat vazifasi uchun kerakli huquqqa ega bo'lsin. Ortiqcha huquq xatoni yoki egallangan servisni katta zararga aylantiradi."
  - q: "Defense in depth haqida qaysi gap to'g'ri?"
    options:
      - "Bitta kuchli nazorat yetarli, qolganlari ortiqcha"
      - "Bir nechta mustaqil nazorat qatlami: bittasi buzilsa ham boshqasi ushlab qoladi"
      - "Bu Saltzer va Schroeder ro'yxatidagi sakkizinchi tamoyil"
      - "Hamma qatlam bir xil kod va bir xil kalitdan foydalanishi kerak"
    answer: 1
    explain: "Defense in depth qatlamlar mustaqil bo'lgandagina ishlaydi; bir xil kalitga yoki bir kod yo'liga tayangan qatlamlar bitta nuqtada birga yiqiladi. Bu atama Saltzer va Schroeder ro'yxatida emas, umumiy muhandislik tamoyili."
  - q: "Endpoint'lar tekshiruvni har biri o'zicha yozadi; ba'zilari unutilgan. Qaysi tamoyil tuzatishni ko'rsatadi?"
    options:
      - "Psychological acceptability"
      - "Economy of mechanism"
      - "Complete mediation: har bir kirish markaziy tekshiruvdan o'tishi kerak"
      - "Work factor"
    answer: 2
    explain: "Complete mediation har ob'ektga har murojaat tekshirilishini talab qiladi; buni ta'minlashning amaliy yo'li - tekshiruvni bitta markaziy joyga (guard, middleware) qo'yish, har endpoint'ga qo'lda emas."
  - q: "Parol tiklash oqimi shunchalik murakkab bo'lib ketdiki, support xodimlari uni chetlab o'tadigan yo'l ochishdi. Bu qaysi tamoyil buzilishining natijasi?"
    options:
      - "Fail-safe defaults"
      - "Least privilege"
      - "Open design"
      - "Psychological acceptability: ishlatish qiyin nazorat odamlar tomonidan aylanib o'tiladi"
    answer: 3
    explain: "Xavfsizlik mexanizmi foydalanuvchi va operator uchun qulay bo'lmasa, ular uni aylanib o'tadilar. Bu tamoyil xavfsizlikni qulaylikka qurbon qilmaydi, balki nazorat ishlatiladigan darajada sodda bo'lishini talab qiladi."
  - q: "\"Tuzatish yetarli\" deganda eng to'g'ri xulosa qaysi? Default-deny `authorize` funksiyasi joriy qilindi."
    options:
      - "Endi hamma avtorizatsiya muammolari yopilgan"
      - "Noma'lum rol va tekshiruv xatosi bo'yicha ruxsat berish yopildi; to'g'ri rol-huquq jadvali alohida masala"
      - "Endi tenant izolyatsiyasi kafolatlangan"
      - "Autentifikatsiya endi kerak emas"
    answer: 1
    explain: "Default-deny faqat ko'rsatilgan fail-open holatni yopadi. Jadvalning to'g'riligi, tenant izolyatsiyasi va autentifikatsiya alohida nazoratlar."
task:
  title: "Fail-open ruxsat tekshiruvini default-deny ga o'tkazish"
  prompt: |
    `authorize(role, action)` funksiyasi tekshiruvda xato bo'lsa ruxsat beradi va noma'lum rolni ham o'tkazadi. Uni tuzating.

    Talablar: noma'lum rol yoki noma'lum action rad etilsin; rol-huquq jadvalida aniq yozilgan action'ning o'zigina ruxsat etilsin; kiritish string bo'lmasa (`null`, son) rad etilsin; funksiya hech qachon xato tashlamasin. Imzoni o'zgartirmang. Kutilgan natija: `true, false, false, false, false`.
  lang: ts
  starter: |
    const permissions: Record<string, string[]> = {
      viewer: ["read"],
      manager: ["read", "export"],
      admin: ["read", "export", "delete"],
    };

    function authorize(role: unknown, action: unknown): boolean {
      try {
        return permissions[role as string].includes(action as string);
      } catch {
        return true; // jadvalda xato bo'lsa, ishni to'xtatmaymiz
      }
    }

    console.log(authorize("manager", "export"));
    console.log(authorize("manager", "delete"));
    console.log(authorize("superuser", "delete"));
    console.log(authorize(null, "read"));
    console.log(authorize("__proto__", "toString"));
  solution: |
    const permissions: Map<string, ReadonlySet<string>> = new Map([
      ["viewer", new Set(["read"])],
      ["manager", new Set(["read", "export"])],
      ["admin", new Set(["read", "export", "delete"])],
    ]);

    function authorize(role: unknown, action: unknown): boolean {
      if (typeof role !== "string" || typeof action !== "string") return false;
      const allowed = permissions.get(role);
      if (!allowed) return false; // noma'lum rol: rad
      return allowed.has(action); // aniq yozilgan action: ruxsat
    }

    console.log(authorize("manager", "export"));
    console.log(authorize("manager", "delete"));
    console.log(authorize("superuser", "delete"));
    console.log(authorize(null, "read"));
    console.log(authorize("__proto__", "toString"));
  solutionNotes: |
    - `Map` va `Set` ishlatilgan, shuning uchun `__proto__` yoki `toString` kabi kalitlar prototip zanjiridan "ruxsat" olib kelmaydi. Oddiy obyektda `permissions["__proto__"]` mavjud qiymat qaytaradi.
    - Natija faqat aniq yozilgan juftlik uchun `true`: default holat rad etish (fail-safe default).
    - `try/catch` kerak emas: kirish turi avval tekshiriladi va funksiya tashlamaydi. Agar baribir xato yuz bersa, uni ushlab `false` qaytarish kerak, `true` emas.
    - Bu faqat shu funksiya ichidagi fail-open holatni yopadi. Rol-huquq jadvalining to'g'riligi, tenant tekshiruvi va autentifikatsiya alohida nazoratlar.
  checklist:
    - "Noma'lum rol va action rad etiladi"
    - "String bo'lmagan kirish rad etiladi"
    - "Funksiya xato tashlamaydi va xatoda `true` qaytarmaydi"
    - "`__proto__` kabi kalitlar ruxsat bermaydi"
    - "Tuzatish qaysi holatni yopishini va nimani yopmasligini ayta olasiz"
---

## Muammo

Funksiyalar bir-biriga ulanadi, jamoa kattalashadi, talablar o'zgaradi. Xavfsizlik xususiyatlarini har kod satrida o'ylab topish mumkin emas: dasturchi charchaydi, yangi odam keladi, sprint tugaydi. Shuning uchun xavfsizlikning bir qismi dizayn darajasida hal qilinadi, ya'ni kod yozilishidan oldin qanday tuzilma xatoni arzon va xavfsiz qiladi.

Xavfli holat: jamoa xavfsizlikni "xato topilganda tuzatamiz" deb biladi. Dizayn nuqsonini esa bunday tuzatib bo'lmaydi. OWASP Top 10:2025 da A06 Insecure Design alohida kategoriya: sahifaga ko'ra, dizayn nuqsoni va implementatsiya nuqsoni ildizi, paydo bo'lish vaqti va tuzatilishi bilan farq qiladi, va noto'g'ri dizaynni mukammal implementatsiya tuzata olmaydi, chunki kerakli nazoratlar dizaynda umuman yaratilmagan. A06 threat modeling, secure design naqshlari va reference architecture'larni ko'proq ishlatishga chaqiradi. Misol: "xato bo'lsa davom ettiramiz" degan qaror har bir tekshiruvni xato orqali chetlab o'tish mumkin bo'lgan joyga aylantiradi, va bu qaror tuzatilishi kerak bo'lgan bitta satr emas, butun kod bo'ylab tarqalgan naqsh.

OWASP Secure Product Design Cheat Sheet ham shu yo'nalishda boshlanadi: xavfsiz default qiymatlar o'rnatish, attack surface'ni kamaytirish va nosozlikda shu aniq belgilangan xavfsiz holatga qaytish. Cheat sheet tamoyillar sifatida least privilege va separation of duties, defense-in-depth, zero trust va security-in-the-open'ni sanaydi. Bu darsda eng ko'p ishlatiladigan dizayn tamoyillarini mexanizm darajasida ko'ramiz. Ular 1975 yilda Saltzer va Schroeder yozgan ro'yxatga borib taqaladi va bugungi backend'da ham to'g'ri keladi, chunki ular texnologiyaga emas, xatoning tabiatiga qaratilgan.

## Asosiy g'oya

### Saltzer va Schroeder tamoyillari

"The Protection of Information in Computer Systems" maqolasi axborotni himoya qiladigan tizimlar dizayni uchun sakkiz tamoyil beradi. Ularni qisqa va amaliy ko'rinishda keltiramiz:

| Tamoyil | Ma'nosi | Avtopark platformasidagi misol |
|---|---|---|
| Economy of mechanism | Mexanizm sodda va kichik bo'lsin: sodda narsani tekshirish osonroq | Avtorizatsiya bitta kichik funksiyada, 20 joyga tarqalgan `if` zanjirida emas |
| Fail-safe defaults | Default holat ruxsat bermaslik; ruxsat aniq berilishi kerak | Yangi rol hech narsaga kira olmaydi, huquq qo'shiladi |
| Complete mediation | Ob'ektga har murojaat huquqni tekshirishdan o'tsin | Har endpoint markaziy guard'dan o'tadi, kesh ham huquqni qayta tekshiradi |
| Open design | Xavfsizlik dizaynning maxfiyligiga tayanmasin | Kalit maxfiy, algoritm ochiq; endpoint yo'lini yashirish himoya emas |
| Separation of privilege | Muhim amal bir nechta mustaqil shartni talab qilsin | Tenant o'chirish: admin roli va qo'shimcha tasdiq |
| Least privilege | Har bir komponent faqat vazifasi uchun kerakli huquqqa ega | Hisobot servisi bazadan faqat o'qiydi |
| Least common mechanism | Foydalanuvchilar o'rtasida umumiy mexanizm kam bo'lsin | Tenant'lar uchun umumiy kesh kaliti emas, tenant bo'yicha ajratilgan kalit |
| Psychological acceptability | Xavfsizlik mexanizmi qulay bo'lsin, aks holda uni aylanib o'tadilar | Qiyin tiklash oqimi support'da "yo'l" paydo qiladi |

Maqolada yana ikki fikr bor: work factor (hujumchining sarfi himoya xarajatiga nisbatan) va compromise recording (buzilishni yashirib bo'lmasligi). Ikkinchisi bugungi audit logning (79-dars) ildizi.

Defense in depth bu ro'yxatda yo'q. Bu umumiy muhandislik tamoyili: bir nechta mustaqil nazorat qatlami, bittasi buzilsa boshqasi ushlab qoladi. Mustaqillik muhim: ikki qatlam bir xil kalitga, bir xil kod yo'liga yoki bir xil xato bilan buzilsa, ular bitta qatlamdan farq qilmaydi.

### Least privilege va fail-safe defaults amalda

Least privilege huquqlar yig'indisini kamaytirib, xato yoki egallanishning zararini cheklaydi. Yagona egalik qiluvchi huquq: servis akkaunti, API token, baza roli, fayl tizimi, bulut IAM roli. Qoida: huquq vazifa uchun kerak bo'lgan minimum, muddati cheklangan, va ishlatilmasa olib tashlanadi.

Fail-safe defaults esa xato holatidagi xatti-harakatni belgilaydi. Uchta holatni alohida ko'ring: noma'lum kirish (rol yoki action jadvalda yo'q), tekshiruv servisi ishlamay qolishi, kutilmagan istisno. Uchalasida ham javob "rad etish". Faqat shu tamoyilni kodda joriy qilish ko'p fail-open xatolarni yo'q qiladi; 78-darsda xatolarni boshqarishni chuqurroq ko'ramiz.

## Chuqurroq: dizayn qarori sifatida tamoyillar

### Cheat sheet nuqtai nazari: kontekst, komponent, ulanish

Secure Product Design Cheat Sheet tamoyillardan tashqari dizaynni to'rt savolga ajratadi: kontekst, komponentlar, ulanishlar va kod. Kontekst savoli ilova tashkilot ekotizimida qayerda turishi, qaysi ma'lumotni saqlashi va shundan kelib chiqadigan risk profilini so'raydi. Sahifa muhim ogohlantirish beradi: xavfsizlik bo'yicha ortiqcha qurish ham, kam qurish ham qimmatga tushadi, ortiqcha qurish xarajati masshtab yoki tezlik bo'yicha ortiqcha qurishdan ham katta bo'lishi mumkin. Shuning uchun tamoyilni qo'llash darajasi mahsulotning xavfsizlik darajasiga bog'liq: tenant ma'lumotini saqlaydigan servis va ichki yordamchi skript bir xil qatlam talab qilmaydi. Komponentlar savoli kutubxona va tashqi servislarni tanlashni dizayn qarori deb qaraydi, ularni tayyor xavfsiz naqshlar kutubxonasi ("Golden Path" yoki "Paved Road" hujjatlari) orqali tanlash va threat modeling bilan tahlil qilishni tavsiya qiladi. Ulanishlar savoli ma'lumot qayerda saqlanishi va unga qanday kirilishini, shuningdek tier'larni va kerak bo'lsa turli tenant'lar uchun ma'lumot yoki butun muhitni ajratishni so'raydi. Bu least common mechanism tamoyilining zamonaviy ifodasi.

Sahifa Zero Trust'ni ham tamoyil sifatida sanaydi: foydalanuvchi, qurilma va tarmoq, hatto tashkilot ichida bo'lsa ham, ishonchsiz deb qaraladi va har so'rov autentifikatsiya hamda avtorizatsiyadan o'tadi. Complete mediation bilan farqi ko'proq urg'uda: Saltzer va Schroeder tamoyili har murojaatni tekshirishni talab qiladi, Zero Trust esa tarmoq joylashuvini ishonch asosi qilmaslikni aytadi. Kod bo'limida sahifa har tier'da (frontenddan backendgacha) plausibility tekshiruvlari bo'lishini va threat modeling'da topilgan har tahdid kamaytirilganini unit va integration testlar bilan tasdiqlashni tavsiya qiladi. Ya'ni dizayn qarori testga aylanadi: "begona tenant ma'lumotini ololmaydi" degan qoida faqat hujjatda qolmaydi, u sinovdan o'tadi. Qabul qilingan qarorlarni tizim o'zgargan sari yangilab turish NIST SSDF ning PW.1.2 amaliyotiga bog'lanadi (Threat Modeling Cheat Sheet shunday ko'rsatadi): dizayn qarori bir marta yozilib, keyin eskirib qolmasligi kerak.


### Complete mediation va keshlar

Complete mediation oddiy ko'ringani bilan keshlanadigan joylarda buziladi. Agar foydalanuvchining huquqi session boshida bir marta o'qilib, so'ng 8 soat keshlansa, uning huquqi olib tashlanganda ham u ishlashda davom etadi. Bu tekshirish "bor" bo'lib ko'rinsa ham, o'zgarishni hisobga olmaydi. Yechim: huquq o'zgarsa keshni bekor qilish yoki qisqa muddatli kesh. Bu savolni 46 va 60-darslarda (session bekor qilish, TOCTOU) davom ettiramiz.

### Defense in depth: qatlam mustaqilligi

Avtopark platformasida bir tenant ma'lumotiga kirishni uchta qatlam himoya qilishi mumkin: servis qatlami (so'rovchi tenant bilan solishtirish), so'rov qatlami (`WHERE tenant_id = $1`) va ma'lumotlar bazasi qatlami (PostgreSQL row-level security, 56-dars). Har biri boshqa mexanizmda ishlaydi. Servis kodida tekshiruv unutilsa, baza qatlami ushlab qoladi. Qatlam qo'shish xarajat: murakkablik, ish tezligi va ba'zan yolg'on xotirjamlik. Shuning uchun qatlamlar nima uchun kerakligini yozib qo'yish va ularni alohida sinash kerak.

```ts run
type Row = { id: string; tenant: string };
const db: Row[] = [
  { id: "v1", tenant: "alfa" },
  { id: "v2", tenant: "beta" },
];

// 1-qatlam: servis tekshiruvi (ba'zan unutiladi)
function serviceLayer(tenant: string, row: Row | undefined, enabled: boolean): Row | undefined {
  if (!enabled) return row; // xato: tekshiruv o'chirib qo'yilgan
  return row && row.tenant === tenant ? row : undefined;
}
// 2-qatlam: so'rov filtri (WHERE tenant = ...) mustaqil ishlaydi
function queryLayer(tenant: string, id: string): Row | undefined {
  return db.find((r) => r.id === id && r.tenant === tenant);
}

function getVehicle(tenant: string, id: string, serviceCheck: boolean) {
  const row = queryLayer(tenant, id);
  return serviceLayer(tenant, row, serviceCheck);
}

console.log("servis tekshiruvi yoqiq:", getVehicle("alfa", "v2", true));
console.log("servis tekshiruvi unutilgan:", getVehicle("alfa", "v2", false));
console.log("o'z mashinasi:", getVehicle("alfa", "v1", false)?.id);
```

```text
servis tekshiruvi yoqiq: undefined
servis tekshiruvi unutilgan: undefined
o'z mashinasi: v1
```

Servis qatlamidagi nuqson tufayli natija sizib chiqmadi, chunki so'rov qatlami mustaqil filtrlaydi. Agar ikkala qatlam bitta `tenantId` o'zgaruvchisiga tayanib, u noto'g'ri olinsa, ikkalasi ham birga yiqiladi: qatlamlar faqat mustaqil bo'lganda himoya qiladi.

## Misol: fail-open ruxsat tekshiruvi

Kod to'liq o'quv maqsadida; u faqat shu darsdagi in-memory jadvalga qarshi.

### 1. Zaif kod

```ts run
const permissions: Record<string, string[]> = {
  viewer: ["read"],
  manager: ["read", "export"],
  admin: ["read", "export", "delete"],
};

// ZAIF: xato bo'lsa ruxsat beriladi (fail-open); noma'lum rol xatoga olib keladi
function authorizeWeak(role: string, action: string): boolean {
  try {
    return permissions[role].includes(action);
  } catch {
    return true;
  }
}

console.log("manager export:", authorizeWeak("manager", "export"));
console.log("manager delete:", authorizeWeak("manager", "delete"));
console.log("superuser delete:", authorizeWeak("superuser", "delete"));
console.log("__proto__ toString:", authorizeWeak("__proto__", "toString"));
```

### 2. Hujum

Hujumchi tizimga kirgan foydalanuvchi bo'lib, o'z rolini bilmagan yoki sozlamadagi xato tufayli noma'lum rol bilan kirgan (masalan, yangi rol qo'shilgan, lekin jadvalga kiritilmagan). Rol jadvalida yo'q bo'lgani uchun `permissions[role]` `undefined` qaytaradi, `.includes` xato tashlaydi, `catch` esa `true` qaytaradi:

```text
manager export: true
manager delete: false
superuser delete: true
__proto__ toString: true
```

Jadvalda bo'lmagan "superuser" o'chirish huquqini oldi. `__proto__` kaliti esa `Object.prototype` ni qaytaradi; unda `includes` metodi yo'q, shuning uchun `TypeError` tashlanadi va `catch` yana `true` beradi. Zaiflik bitta `catch { return true }` satrida, lekin asl sabab dizayn qarori: xatoni ruxsat deb talqin qilish.

### 3. Tuzatilgan kod

```ts run
const permissions: Map<string, ReadonlySet<string>> = new Map([
  ["viewer", new Set(["read"])],
  ["manager", new Set(["read", "export"])],
  ["admin", new Set(["read", "export", "delete"])],
]);

function authorize(role: unknown, action: unknown): boolean {
  if (typeof role !== "string" || typeof action !== "string") return false;
  const allowed = permissions.get(role);
  if (!allowed) return false; // noma'lum rol: rad
  return allowed.has(action); // faqat aniq yozilgan action
}

console.log("manager export:", authorize("manager", "export"));
console.log("manager delete:", authorize("manager", "delete"));
console.log("superuser delete:", authorize("superuser", "delete"));
console.log("__proto__ toString:", authorize("__proto__", "toString"));
console.log("null:", authorize(null, "read"));
```

```text
manager export: true
manager delete: false
superuser delete: false
__proto__ toString: false
null: false
```

Endi invariant: faqat jadvalda aniq yozilgan (rol, action) juftligi `true` beradi, boshqa hamma holat rad. `Map` prototip zanjiridan kalit olib kelmaydi, tur tekshiruvi `null` va sonlarni rad etadi, `try/catch` yo'q. Bu ko'rsatilgan uch hujum (noma'lum rol, prototip kaliti, noto'g'ri tur) uchun yetarli. Yopilmagan qoldiq risk: jadvalning o'zi to'g'ri ekani, rolning foydalanuvchiga to'g'ri berilgani va tenant tekshiruvi alohida masala.

## Qachon qo'llamaslik kerak

- Fail-safe defaults har joyda ham to'g'ri emas. Agar monitoring yoki log yozish ishlamay qolsa, hamma servisni to'xtatish mavjudlikka zarar qiladi. Qaror oqibatga bog'liq: ruxsat tekshiruvi xatoda rad etadi, lekin log yozish xatosi asosiy oqimni to'xtatmasligi (va alohida alert berishi) kerak bo'lishi mumkin. Bu qarorni ongli qiling va yozing.
- Least privilege kichik jamoada operatsion og'irlikka aylanishi mumkin: har servis uchun alohida baza roli va token boshqaruvi vaqt oladi. Eng yuqori ta'sirli joylardan (production baza, deploy kalitlari, mijoz ma'lumotlari) boshlang, hamma narsani birdan bo'lakka ajratmang.
- Defense in depth qatlamlar sonini ko'paytirish emas. Ko'p qatlam murakkablik va noto'g'ri xotirjamlik beradi; har qatlam aniq hujum turiga qarshi bo'lishi va alohida sinalishi kerak.
- Open design "hamma narsani oshkor qiling" degani emas: kalit va parol maxfiy qoladi; tamoyil faqat himoya mexanizmning sirliligiga tayanmasligi kerakligini aytadi.
- Tamoyillar o'zaro to'qnashadi. Economy of mechanism (kam kod) va defense in depth (ko'p qatlam) bir-biriga qarama-qarshi tortadi; ularni muvozanatlash muhandislik qarori va uni threat model (4-dars) asoslaydi.

## Stack'da: NestJS, Prisma va PostgreSQL

NestJS'da complete mediation va fail-safe defaults global guard bilan ta'minlanadi: `APP_GUARD` sifatida ro'yxatdan o'tgan guard hamma endpoint uchun ishlaydi, ochiq yo'llar esa aniq belgilanadi (2-darsdagi `@Public()`). Quyidagi parcha ruxsat tekshiruvini bitta markaziy joyda, default-deny bilan ko'rsatadi (ishga tushirilmaydi, chunki NestJS brauzer worker'ida yo'q):

```ts
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const RequireAction = (action: string) => SetMetadata("action", action);

const PERMISSIONS = new Map<string, ReadonlySet<string>>([
  ["viewer", new Set(["read"])],
  ["manager", new Set(["read", "export"])],
]);

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const action = this.reflector.get<string | undefined>("action", ctx.getHandler());
    if (!action) return false; // action belgilanmagan endpoint: default rad
    const req = ctx.switchToHttp().getRequest<{ user?: { role?: unknown } }>();
    const role = req.user?.role;
    return typeof role === "string" && PERMISSIONS.get(role)?.has(action) === true;
  }
}
```

Least privilege bazada: ilova uchun alohida PostgreSQL roli yarating, unga faqat kerakli jadvallarga `SELECT/INSERT/UPDATE` bering; migratsiyalar uchun alohida, kuchliroq rol ishlating. Prisma `DATABASE_URL` da ilova roli ishlatiladi, migratsiya esa CI'da boshqa rol bilan bajariladi. Hisobot servisi uchun faqat `SELECT` huquqli rol. 55 va 56-darslarda tenant izolyatsiyasi shu bazaga tayanadi.

## Xulosa

- Dizayn nuqsonini kod darajasida "tuzatib" bo'lmaydi; shuning uchun dizayn tamoyillari kod yozishdan oldin qo'llanadi (A06 Insecure Design).
- Saltzer va Schroeder tamoyillari bugun ham amalda: fail-safe defaults, least privilege, complete mediation, economy of mechanism va boshqalar.
- Fail-safe default: noma'lum kirish, tekshiruv xatosi va istisno holatida rad etish. Fail-open `catch` zaiflik manbai.
- Defense in depth faqat qatlamlar mustaqil bo'lganda ishlaydi; bir xil nuqtaga tayangan qatlamlar birga yiqiladi.
- Tamoyil har joyda ham mutlaq emas: log yozish kabi joylarda mavjudlik bilan muvozanat kerak, va bu qarorni yozib qo'ying.
