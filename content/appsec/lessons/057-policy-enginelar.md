---
n: 57
slug: policy-enginelar
title: "Policy engine'lar va markazlashgan authorization"
summary: "Authorization qarorini (PDP) va uni majburlashni (PEP) ajratish, siyosatni kod ichida yoki alohida boshqarish, OPA kabi policy engine'lar, siyosat va ma'lumotni yangi saqlash muammosi, to'plamlarni filtrlash usullari va PDP ishlamay qolganda rad etish qoidasi."
duration: 50
sources:
  - id: cs-authz
    note: "Authorization Cheat Sheet: ABAC siyosat boshqaruvini majburlashdan ajratishga imkon beradi; deny by default; har so'rovda tekshirish"
  - id: asvs
    note: "ASVS 5.0.0 V8 Authorization: 8.1.1-8.1.2 (authorization hujjatida funksiya, ma'lumot va maydon darajasidagi qoidalar), 8.1.3-8.1.4 va 8.2.4 (muhit va kontekst atributlari), 8.2.1-8.2.3, 8.3.1 (ishonchli servis qatlamida majburlash), 8.3.2 (authorization qaroriga ta'sir qiluvchi qiymat o'zgarishi darhol qo'llanishi), 8.3.3 (obyektga kirish dastlabki subyekt huquqiga asoslanishi)"
  - id: t10-a06
    note: "A06:2025 Insecure Design: yo'qolgan yoki samarasiz nazorat dizayni, dizayn va amalga oshirish nuqsonlarining farqi"
  - id: opa-docs
    note: "OPA Introduction: OPA umumiy maqsadli policy engine, siyosat kod sifatida deklarativ tilda yoziladi, qaror qabul qilish majburlashdan ajratiladi, CNCF graduated loyiha"
  - id: cs-authz-patterns
    note: "Authorization Patterns Cheat Sheet: PEP/PDP/PAP/PIP, service-level va gateway enforcement, PDP deployment variantlari, PDP xato va timeout'larida rad etish"
  - id: cs-authz-data
    note: "Authorization Policy and Data Distribution Cheat Sheet: siyosat va atributlarning egasi va yangilik talablari, ma'lumot yetkazish usullari, revocation kechikishi"
  - id: cs-authz-decisions
    note: "Authorization Decisions and Output Handling Cheat Sheet: bitta va batch qarorlar, to'plamlarni majburlash usullari, fail closed va keshlash qoidalari"
  - id: cs-authz-regression
    note: "Authorization Regression Testing Cheat Sheet: Actor-Resource-Action matritsasi mashina o'qiy oladigan formatda, gorizontal (Multi-User Replay), vertikal (Role Demotion Check) va tenant izolyatsiyasi (Cross-Tenant Boundary Test) regressiya namunalari, authorization testlari CI'da PR'ni to'sadigan majburiy tekshiruv"
  - id: cs-authz-testing
    note: "Authorization Testing Automation Cheat Sheet: authorization matritsasi Feature x Logical Role (ba'zan Data) o'lchovlari, matritsani avtomatik testga aylantirish yondashuvi"
quiz:
  - q: "Servis har so'rovda PDP'ga HTTP chaqiruv yuboradi. PDP vaqtincha javob bermay qoldi (timeout). Cheat sheet tavsiyasiga ko'ra PEP nima qilishi kerak?"
    options:
      - "Himoyalangan operatsiyani rad etishi: PDP xato va timeout'lari rad etishga sozlanadi"
      - "Foydalanuvchi tajribasini saqlash uchun ruxsat berishi"
      - "Oxirgi muvaffaqiyatli qarorni abadiy keshdan ishlatishi"
      - "Faqat log yozib, so'rovni o'tkazib yuborishi"
    answer: 0
    explain: "Cheat sheet PDP xato va timeout'larini himoyalangan operatsiyani rad etishga sozlashni, xatoda ruxsat berish esa nazoratni chetlab o'tish ekanini aytadi. Cheksiz kesh revocation'ni buzadi; log yozib o'tkazish fail-open."
  - q: "Jamoa 'authorization endi OPA'da, servislar uni chaqiradi, shuning uchun servislarda tekshiruv kerak emas' dedi. Bu fikr nimada xato?"
    options:
      - "OPA faqat Kubernetes uchun ishlaydi"
      - "Qarorni PDP hisoblaydi, lekin uni majburlash (PEP) har servisning mas'uliyati bo'lib qoladi; qaror olinmasa yoki yaroqsiz bo'lsa rad etilishi kerak"
      - "Siyosat kod sifatida yozilmaydi"
      - "OPA har qaror uchun yangi tenant yaratadi"
    answer: 1
    explain: "Cheat sheet: baholashni majburlashdan ajratish PEP'ning natijani majburlash mas'uliyatini boshqa joyga o'tkazmaydi. Servis qarorni resurs ochilishidan oldin qo'llashi shart."
  - q: "Revocation misoli: foydalanuvchi tenant a'zoligidan chiqarildi, lekin policy qarori mahalliy PDP'dagi eski ma'lumotga tayanib ruxsat berdi. Qaysi dizayn qarori bu xavfni ko'paytirgan?"
    options:
      - "Siyosat Rego tilida yozilgani"
      - "Qarorlar JSON'da qaytgani"
      - "Atributlarni PDP'ga replikatsiya qilingan, yangilanish kechikishi chegaralanmagan va o'lchanmagan holatda saqlash"
      - "PDP bir nechta servisga xizmat qilgani"
    answer: 2
    explain: "Cheat sheet replikatsiya qilingan ma'lumot revocation kechikishini yaratishini va lokal mavjudlik yangilikni kafolatlamasligini aytadi. Favqulodda cheklov uchun kechikish chegarasi o'lchanishi va bajarilmasa operatsiya rad etilishi kerak."
  - q: "Ro'yxat endpoint'ida 10 000 ta safar bor, foydalanuvchi ulardan 40 tasini ko'rishi mumkin. Qaysi usul cheat sheet'dagi variantlardan emas?"
    options:
      - "Cheklangan nomzodlar to'plamini olib, har birini PDP'da tekshirish"
      - "PDP'dan ruxsat etilgan identifikatorlar ro'yxatini olib, so'rovni shu bilan cheklash"
      - "PDP'dan filtr yoki query plan olib, ma'lumotlar qatlamida qo'llash"
      - "Hamma 10 000 ta safarni mijozga yuborib, frontendda filtrlash"
    answer: 3
    explain: "Birinchi uchtasi cheat sheet'dagi usullar. Frontendda filtrlash ma'lumotni mijozga yuboradi, ya'ni ruxsatsiz oshkor qilish: mijoz tomoni nazorat emas."
  - q: "PEP batch so'rovida 3 ta tekshiruv yubordi, PDP faqat 2 tasiga javob qaytardi. Uchinchisi uchun nima qilinadi?"
    options:
      - "Birinchi ikkitasining natijasi uchinchisiga ham tatbiq qilinadi"
      - "Ruxsat beriladi, chunki rad javobi kelmadi"
      - "Rad etiladi: javobi yo'q, yaroqsiz yoki xato element rad etiladi, bir elementning ruxsati butun batchga o'tkazilmaydi"
      - "So'rov takrorlanadi va birinchi javob olinguncha ruxsat beriladi"
    answer: 2
    explain: "Cheat sheet batch javoblarni so'rovlar bilan moslashtirishni, javobi yo'q, yaroqsiz yoki xatoli elementni rad etishni va bitta element ruxsatini butun batchga tatbiq qilmaslikni aytadi."
  - q: "ASVS 5.0.0 8.1.2 talabi authorization hujjatida nimani talab qiladi?"
    options:
      - "Maydon darajasidagi (o'qish va yozish) cheklov qoidalarini consumer ruxsatlari va resurs atributlari bo'yicha"
      - "Faqat parol siyosatini"
      - "Faqat tarmoq diagrammasini"
      - "Faqat rol ro'yxatini"
    answer: 0
    explain: "ASVS 8.1.2: authorization hujjati maydon darajasidagi (o'qish va yozish) cheklash qoidalarini consumer ruxsatlari va resurs atributlari asosida belgilashi kerak; bu qoidalar obyektning holatiga ham bog'liq bo'lishi mumkin."
task:
  title: "PEP: batch qarorini xavfsiz qo'llash"
  prompt: |
    `enforce(reqs, resps)` PDP'ning batch javobini (`resps`) so'rovlar (`reqs`) bilan moslashtirib, har so'rov uchun ruxsat (`true`) yoki rad (`false`) qaytaradi. Hozir javobi yo'q so'rov, `null` javob va yaroqsiz qiymat ruxsat bo'lib ketadi.

    Tuzating:

    1. Faqat shu so'rov `id` si uchun aynan bitta javob bo'lsa va `allow === true` bo'lsa ruxsat.
    2. Javob yo'q, ikkita (qarama-qarshi bo'lishi mumkin) javob bor, `allow` maydoni yo'q yoki `true` emas (masalan satr) bo'lsa rad.
    3. `resps` `null` (PDP xatosi yoki timeout) bo'lsa hamma so'rov rad.
    4. Imzoni o'zgartirmang. Kutilgan natijalar: `{"a":true,"b":false}`, `{"a":true,"b":false}`, `{"a":false,"b":false}`, `{"a":true,"b":false}`, `{"a":false,"b":false}`.
  lang: ts
  starter: |
    type Req = { id: string; action: string; resource: string };
    type Resp = { id: string; allow?: boolean };

    function enforce(reqs: Req[], resps: Resp[] | null): Record<string, boolean> {
      const out: Record<string, boolean> = {};
      for (const r of reqs) {
        const m = resps?.find((x) => x.id === r.id);
        out[r.id] = m ? m.allow !== false : true;
      }
      return out;
    }

    const reqs: Req[] = [
      { id: "a", action: "read", resource: "v1" },
      { id: "b", action: "delete", resource: "v1" },
    ];
    console.log("1", JSON.stringify(enforce(reqs, [{ id: "a", allow: true }, { id: "b", allow: false }])));
    console.log("2", JSON.stringify(enforce(reqs, [{ id: "a", allow: true }])));
    console.log("3", JSON.stringify(enforce(reqs, null)));
    console.log("4", JSON.stringify(enforce(reqs, [{ id: "a", allow: true }, { id: "b", allow: true }, { id: "b", allow: false }])));
    console.log("5", JSON.stringify(enforce(reqs, [{ id: "a", allow: "true" as unknown as boolean }, { id: "b" }])));
  solution: |
    type Req = { id: string; action: string; resource: string };
    type Resp = { id: string; allow?: boolean };

    function enforce(reqs: Req[], resps: Resp[] | null): Record<string, boolean> {
      const out: Record<string, boolean> = {};
      for (const r of reqs) {
        const ms = (resps ?? []).filter((x) => x.id === r.id);
        out[r.id] = ms.length === 1 && ms[0].allow === true;
      }
      return out;
    }

    const reqs: Req[] = [
      { id: "a", action: "read", resource: "v1" },
      { id: "b", action: "delete", resource: "v1" },
    ];
    console.log("1", JSON.stringify(enforce(reqs, [{ id: "a", allow: true }, { id: "b", allow: false }])));
    console.log("2", JSON.stringify(enforce(reqs, [{ id: "a", allow: true }])));
    console.log("3", JSON.stringify(enforce(reqs, null)));
    console.log("4", JSON.stringify(enforce(reqs, [{ id: "a", allow: true }, { id: "b", allow: true }, { id: "b", allow: false }])));
    console.log("5", JSON.stringify(enforce(reqs, [{ id: "a", allow: "true" as unknown as boolean }, { id: "b" }])));
  solutionNotes: |
    - Ruxsat faqat aniq `allow === true` va yagona javob bilan beriladi. Javob yo'q (2-holat), PDP xatosi (3-holat), noaniq ikki javob (4-holat) va yaroqsiz tur (5-holat) hammasi rad bo'ladi: fail closed.
    - Boshlang'ich kodda `allow !== false` sharti "rad javobi kelmadi, demak ruxsat" degan mantiq edi: bu fail-open.
    - Element bo'yicha moslashtirish `id` orqali: bir elementning ruxsati butun batchga o'tmaydi.
    - Qoplanmagan: PDP javobining yaxlitligi va PEP'ni PDP'ga autentifikatsiya qilish (kanal himoyasi), siyosatning to'g'riligi va atribut ma'lumotining yangiligi.
  checklist:
    - "Faqat yagona va aniq `allow === true` javob ruxsat beradi"
    - "Javobi yo'q, xato va noaniq elementlar rad etiladi"
    - "PDP xatosi (`null`) hamma so'rovni rad etadi"
    - "Tuzatish siyosat to'g'riligini va ma'lumot yangiligini kafolatlamasligini ayta olasiz"
---

## Muammo

51-56 darslarda authorization qarorini bir necha joyda qo'lda yozdik: `decide()` funksiyasi, route jadvali, repository, RLS policy. Platforma o'sib, servislar soni oshgach, uchta muammo paydo bo'ladi. Birinchisi, qoida har servisda boshqacha yozilgan: "dispetcher mashinani o'qiydi" qoidasi billing servisida boshqa, hisobot servisida boshqa. Ikkinchisi, qoidani o'zgartirish deploy talab qiladi: tenant a'zoligidan chiqarilgan foydalanuvchiga ruxsatni tezda yopish kerak, lekin siyosat kod ichida bo'lsa, har servisni qayta chiqarish kerak. Uchinchisi, audit: "kim nima qila oladi" savoliga javob berish uchun o'nlab repo'ni o'qish kerak.

ASVS 5.0.0 V8 bobi aynan shu yo'nalishda talab qo'yadi. 8.1.1 talabi authorization hujjati funksiya darajasidagi va ma'lumotga xos kirishni cheklash qoidalarini consumer ruxsatlari va resurs atributlari bo'yicha belgilashini talab qiladi; 8.1.2 maydon darajasidagi (o'qish va yozish) qoidalarni, 8.2.1-8.2.3 esa funksiya, ma'lumot va maydon darajasidagi kirish aniq ruxsatlar bilan cheklanishini. Qoidalar hujjatlashtirilgan va tekshiriladigan bo'lishi kerak, bu esa ularning bir joyda yashashini osonlashtiradi.

Policy engine bu yo'lning bir varianti: qarorni qabul qilish ilova kodidan ajratiladi va alohida, ma'lumot sifatida boshqariladigan siyosat bilan bajariladi. Lekin bu yechim ham o'z muammolarini olib keladi: yangi ishonch chegarasi, tarmoq bog'liqligi, ma'lumotning eskirishi, xatoda nima qilish. Bu dars shularni ko'radi.

## Asosiy g'oya

### PDP, PEP, PAP, PIP

Authorization Patterns Cheat Sheet to'rt rolni ajratadi. Policy Enforcement Point (PEP) amalni himoyalaydi, Policy Decision Point (PDP) amaldagi siyosatni baholaydi. Policy Administration Point (PAP) qoidalarni boshqaradi, Policy Information Point (PIP) esa baholash uchun atributlarni beradi. Cheat sheet OpenID AuthZEN spetsifikatsiyasini bu komponentlar orasidagi interfeys sifatida eslatadi (uning matnini bu darsda ochib tekshirmadik, shu sababli aniq bo'limlariga tayanmaymiz).

Asosiy xavfsizlik fikri: baholashni majburlashdan ajratish PEP'ning natijani majburlash mas'uliyatini PDP'ga o'tkazmaydi. Servis qarorni resursga murojaatdan oldin qo'llashi, PDP qarori mavjud bo'lmasa esa operatsiyani rad etishi shart. Authorization Cheat Sheet ham ABAC afzalligi sifatida siyosatni boshqarish va majburlashni, shuningdek identifikatorlarni ta'minlashni ajratishga undashini yozadi.

### Qayerda yashaydi

Cheat sheet ikki variantni ajratadi:

- Siyosat ilova kodida: servis qaror va majburlashni o'zi bajaradi. Cheat sheet buni kichik ilova va cheklangan siyosat uchun mos deydi, lekin ogohlantiradi: tarqoq shartli tekshiruvlarda tushib qolgan yoki mos kelmaydigan qoidalarni topish qiyin, qoidani o'zgartirish esa ilovani qayta deploy qilishni talab qiladi. Kodda yozilgan siyosat o'z-o'zidan zaif emas, lekin markazlashtirilgan authorization qatlami va har himoyalangan kirish nuqtasi uchun test kerak.
- Alohida boshqariladigan siyosat: servis PEP bo'lib qoladi va biznes koddan mustaqil boshqariladigan siyosatni baholashni PDP'dan so'raydi. PDP ilovaga kiritilgan, lokal yoki masofaviy bo'lishi mumkin. Bu variant bir necha servis izchil qoidalar va umumiy ko'rib chiqish jarayoniga muhtoj bo'lganda mos. Markaziy siyosat egaligi bitta markaziy runtime degani emas.

### OPA

Open Policy Agent (OPA) hujjatiga ko'ra ochiq kodli, umumiy maqsadli policy engine: siyosat kod sifatida yuqori darajali deklarativ tilda (Rego) yoziladi, dasturlar qaror qabul qilishni OPA'ga topshirish uchun oddiy API'dan foydalanadi. OPA qaror qabul qilishni majburlashdan ajratadi: dastur OPA'ga so'rov yuboradi va tuzilgan ma'lumot (masalan JSON) bilan kirish beradi, OPA kirishni siyosat va ma'lumotga qarshi baholab qaror chiqaradi. Hujjat OPA CNCF graduated loyiha ekanini va uni mikroservislar, Kubernetes, CI/CD va API gateway'larda ishlatish mumkinligini aytadi. Cheat sheet qo'shimcha eslatadi: OPA HTTP, kutubxona va WebAssembly integratsiyasini qo'llaydi, mahsulot nomi bitta deployment rejimini bildirmaydi. Authorization Patterns Cheat Sheet uchta deployment variantini ajratadi: embedded kutubxona (masofaviy PDP ulanishisiz baholash davom etadi, lekin siyosat va ma'lumot yangi bo'lishi va har kirish nuqtasida majburlash tekshirilishi kerak), lokal sidecar yoki daemon (umumiy qaror amalga oshirilishi servis yaqinida, lekin API'si cheklanadi va jarayon xatosi boshqariladi; lokal joylashuv o'zi ishonch yaratmaydi) va masofaviy servis (umumiy baholash va markazlashgan boshqaruv, lekin PEP'lar autentifikatsiya va authorize qilinadi, javoblar himoyalanadi, yaroqli qaror bo'lmasa rad etiladi). Qaror va uning majburlanishi qaysi siyosat versiyasi bilan chiqqanini tekshirish uchun yetarli kontekst bilan log qilinadi, sezgir atributlarni oshkor qilmasdan. Tanlov access control modelidan (RBAC, ABAC, ReBAC) mustaqil: OPA ham, boshqa PDP ham model emas, uni ifodalash vositasi.

Quyida bizning avtopark qoidasi Rego'da qanday ko'rinishi mumkin. Bu kod bu darsda ishga tushirilmagan (OPA bu muhitda yo'q), faqat shaklni ko'rsatadi:

```rego
package fleet.authz

import rego.v1

default allow := false

allow if {
	input.action == "read"
	input.user.role in {"dispatcher", "admin"}
	input.user.tenant == input.resource.tenant
}
```

`default allow := false` qatori deny by default'ning o'zi: boshqa qoida mos kelmasa, javob rad. Lekin qoida to'g'ri yozilgani siyosat to'g'riligini kafolatlamaydi, uni test qilish kerak (pastda).

ASVS 5.0.0 V8.3 bo'limidagi ikki talab policy engine dizayniga bevosita tegadi. 8.3.2 (3-daraja): authorization qarori tayanadigan qiymatlar o'zgarsa, o'zgarish darhol qo'llanishi kerak; darhol qo'llab bo'lmaydigan joyda (masalan, o'zi-o'zini tasdiqlovchi tokenlardagi ma'lumot) iste'molchi endi huquqsiz bo'lib qolgan amalni bajarganda ogohlantiradigan va o'zgarishni qaytaradigan kompensatsion nazorat bo'lishi kerak; ASVS bu muqobil ma'lumot sizishini yopmasligini ham eslatadi. 8.3.3 (3-daraja): obyektga kirish dastlabki subyektning huquqlariga asoslanadi, oraliq servis huquqlariga emas. Misol: iste'molchi token bilan bir servisni chaqirsa va u ikkinchi servisdan ma'lumot so'rasa, ikkinchi servis birinchisining mashina-mashina tokenini emas, iste'molchining tokenini qaror uchun ishlatadi. Bu PDP'ga beriladigan `user` atributlari qayerdan kelishi masalasining ASVS shakli: servislar zanjirida PEP har bo'g'inda dastlabki subyektni uzatishi kerak.

## Chuqurroq: siyosat, ma'lumot va qarorlar

### Qarorni qaysi ma'lumotga bog'lash

Cheat sheet har qarorni autentifikatsiyalangan subyektga, amalga, resursga, tenant'ga va tegishli kontekstga bog'lashni aytadi. Muhim ogohlantirish: PEP PDP'ga rol, tenant a'zoligi yoki egalik kabi qiymatlarni yuborsa, ularni ishonchli manbadan olishi kerak; mijoz so'rovidan ko'chirilgan qiymat ishonchli bo'lib qolmaydi. Boshqacha aytganda, PDP'ni autentifikatsiyalash yetarli emas, unga beriladigan atributlar manbasi ham tekshiriladi. Resurs identifikatorlari ham haqiqiy maqsad obyektga qarshi tekshirilishi kerak (52-dars).

### Siyosat va ma'lumot yangiligi

Authorization Policy and Data Distribution Cheat Sheet: authorization qarori siyosat va kirish ma'lumoti qanchalik ishonchli bo'lsa, shunchalik ishonchli. Har siyosat va atribut uchun kim o'zgartira olishi, qaysi servis ishonchli manba ekani va o'zgarish qarorlarga ta'sir qilishi uchun maksimal kechikish yozib qo'yiladi. Siyosat o'zgarishi (yangi cheklov) va ma'lumot o'zgarishi (foydalanuvchi a'zoligini bekor qilish) farqlanadi. Cheat sheet jadvali:

| Talab | Boshlang'ich yechim | Xavfsizlik sharti |
|---|---|---|
| Favqulodda cheklov yoki revocation | Dinamik yangilash yoki ishonchli manbadan tekshirish | Tarqalish chegarasini o'lchash, bajarilmasa tegishli operatsiyalarni rad etish |
| Rejali, barqaror qoidalar | Versiyalangan deploy yoki dinamik tarqatish | Talab qilingan versiyani muddatdan oldin faollashtirish |
| Tez o'zgaradigan resurs yoki munosabat ma'lumoti | Ishonchli manbadan sinxronlash yoki tekshirish | Replikatsiya kechikishi va keshlangan qarorlarni hisobga olish |
| So'rovga xos atributlar | PEP uzatadigan tekshirilgan kontekst | PEP o'zi autentifikatsiya qilinadi va har bir xavfsizlik uchun muhim qiymatning manbai aniq bo'ladi |

Cheat sheet OPA bundle'larini eventual consistency misoli sifatida keltiradi: nashr muvaffaqiyatli bo'lgani har PDP yangilanishni faollashtirganini isbotlamaydi. Replikatsiya qilingan ma'lumot PIP'ni so'rov yo'lidan olib tashlaydi, lekin revocation kechikishini yaratadi; lokal mavjudlikni yangilik kafolati deb atamaslik kerak. O'zgaruvchan hisob holati yoki revocation ma'lumotini tez yangilanmaydigan release ichiga joylash esa tavsiya etilmaydi.

Cheat sheet tarqatish kanalining o'zini ham himoya obyekti deb hisoblaydi. Tarmoqqa ochiq qaror API'lari va siyosat hamda ma'lumotni o'qiydigan yoki o'zgartiradigan API'lar himoyalanadi; PEP'lar va administratorlar autentifikatsiya qilinadi va faqat kerakli tenant va amallar bilan cheklanadi; servis jamoalari tashkilot miqyosidagi cheklovlarni almashtira olmasligi kerak. Bundle'lar uchun ishonchli nashr qiluvchining imzosi talab qilinadi va qamrab olingan hamma fayl tekshiriladi; imzo manba va yaxlitlikni isbotlaydi, siyosat to'g'ri yoki yangi ekanini emas. Joriy qilingan siyosat va sxema versiyalari qayd etiladi va kutilmagan yoki eskirgan revizyon rad etiladi. Jarayon ishga tushganda kerakli siyosat va ma'lumot mavjud va yaroqli bo'lgunicha himoyalangan operatsiyalar xizmat ko'rsatmaydi. Taqsimot xizmati yo'qolishi bilan qaror chiqarish imkoniyatining yo'qolishi farqlanadi: OPA yangi bundle imzo tekshiruvidan o'tmasa mavjud bundle'ni saqlab qoladi, bu mavjudlikni asraydi, lekin eski bundle hali yetarlicha yangi ekanini isbotlamaydi. Aniq chegara: kerakli kirish ma'lumoti yo'q, yaroqsiz yoki ruxsat etilgan muddatdan eski bo'lsa, ta'sirlangan operatsiyalar rad etiladi.

### To'plamlar: ro'yxat, qidiruv, eksport

Bitta amalni tekshirish oson, "foydalanuvchi ko'ra oladigan hamma safarlar" so'rovi qiyin. Decisions and Output Handling Cheat Sheet uchta yondashuvni beradi:

1. Cheklangan nomzodlar to'plamini olib, har birini (alohida yoki batch) tekshirish. Kichik to'plamlar uchun; rad etilgan va aniqlanmagan elementlar chiqarib tashlanadi, hisoblar (count) va eksportlar ham xuddi shunday cheklanadi.
2. PDP ruxsat etilgan identifikatorlar ro'yxatini qaytaradi, ilova ma'lumot olishni shu identifikatorlar va o'z tenant'i hamda biznes shartlari bilan cheklaydi. Natija faqat API to'liqligini kafolatlagandagina to'liq deb qaraladi (cheat sheet ListObjects'da cheklovlar borligini eslatadi).
3. PDP predikat yoki query plan qaytaradi, ma'lumotlar qatlami uni ma'lumot olish paytida qo'llaydi. Aniq PDP va ma'lumotlar ombori uchun yaxshi qo'llab-quvvatlanadigan adapter kerak.

Umumiy xavfsizlik qoidalari: har ma'lumot yo'lini (ro'yxat, qidiruv, eksport, count, aggregate, to'g'ridan-to'g'ri o'qish) qoplash, authorization cheklovlarini tenant va biznes shartlari bilan AND bilan kesishtirish, qo'llab-quvvatlanmaydigan operatorni jimgina tashlab yubormaslik, filtr qiymatlarini parametr sifatida bog'lash, PDP xatosida rad etish va keshni faqat bir xil subyekt, amal, resurs doirasi, tenant va siyosat holati uchun ishlatish.

### Xatoda nima qilish

Bu darsning markaziy qoidasi, va misol uni ko'rsatadi: PDP xatolari va timeout'lari himoyalangan operatsiyani rad etishga sozlanadi. Cheat sheet Envoy'ning failure-mode sozlamasiga ishora qiladi: avtorizatsiya muvaffaqiyatsiz bo'lganda so'rovlarga ruxsat berish nazoratni chetlab o'tish demak. Qaror qabul qilinmasa, rad etiladi. Kerak bo'lsa, ilgari yuklangan siyosat lokal baholanishi mumkin, lekin yuqoridagi yangilik masalasi bilan.

### Siyosat testlari

Siyosat kodga o'xshash yozuv, uni ham testlash kerak. Authorization Regression Testing Cheat Sheet "Day 2" muammosini nomlaydi: boshlang'ich xavfsizlik sinovi ruxsatlarni ishga tushirish paytida tekshiradi, keyin esa yangi endpoint, ma'lumotlar qatlamini refaktoring va servislarni ajratish mavjud mantiqni buzishi mumkin. Tavsiya: Actor-Resource-Action matritsasini jadvalda emas, mashina o'qiy oladigan fayl (YAML yoki JSON) sifatida saqlash, shunda test runner test holatlarini matritsadan generatsiya qiladi. Uch regressiya namunasi: "Multi-User Replay" (A foydalanuvchi resurs yaratadi, aynan shu rolga ega B foydalanuvchi uni o'qish, yangilash va o'chirishga urinadi; kutilgani 403 yoki 404, hech qachon 200 emas), "Role Demotion Check" (admin endpoint'lariga barcha admin bo'lmagan rollar va kirmagan foydalanuvchi bilan urinish) va "Cross-Tenant Boundary Test" (ikki tenant yaratib, birining ma'lumotini ikkinchisi sifatida keng so'rovlar bilan o'qishga urinish; bitta sizib chiqqan yozuv ham jiddiy nosozlik). Authorization testlari CI'da PR'ni to'sadigan majburiy tekshiruv bo'lishi va alohida teg bilan (`authz`) guruhlanib, lokal tez ishga tushirilishi kerak. Authorization Testing Automation Cheat Sheet matritsaning asosiy o'lchovlarini nomlaydi: Feature va Logical Role, ba'zan Data (biznes ma'lumoti darajasida filtrlash uchun) o'lchovi. Bu darsdagi siyosat uchun: har qoidaga musbat va manfiy test, va PDP uchun alohida "PDP o'chiq" testi. Decisions cheat sheet adapter tekshiruvini aniq beradi: filtr tanlagan resurslarni vakillik qiluvchi siyosat holatlari uchun yakka qarorlar bilan solishtiring. 8.1.3 va 8.1.4 talablari kontekstli atributlar (vaqt, joy, IP, qurilma) qarorlarda qanday qo'llanishi ham hujjatlanishini talab qiladi.

## Misol: PDP ishlamay qolganda

Quyida kichik PDP va PEP. PEP har so'rovda PDP'dan qaror so'raydi.

### 1. Zaif kod

```ts run
type Input = { user: { tenant: string; role: string }; action: string; resource: { tenant: string } };
type Decision = { allow: boolean };

let pdpUp = true; // PDP holati (timeout simulyatsiyasi uchun)

async function pdp(input: Input): Promise<Decision> {
  if (!pdpUp) throw new Error("PDP timeout");
  const ok =
    input.action === "read" &&
    ["dispatcher", "admin"].includes(input.user.role) &&
    input.user.tenant === input.resource.tenant;
  return { allow: ok };
}

// ZAIF: PDP xatosida PEP ruxsat beradi (fail-open)
async function enforceWeak(input: Input): Promise<boolean> {
  const d = await pdp(input).catch(() => ({ allow: true }));
  return d.allow;
}

const own: Input = { user: { tenant: "alfa", role: "dispatcher" }, action: "read", resource: { tenant: "alfa" } };
const foreign: Input = { user: { tenant: "alfa", role: "dispatcher" }, action: "read", resource: { tenant: "beta" } };
console.log("PDP ishlayapti, o'z:", await enforceWeak(own));
console.log("PDP ishlayapti, begona:", await enforceWeak(foreign));
```

```text
PDP ishlayapti, o'z: true
PDP ishlayapti, begona: false
```

### 2. Hujum

Hujumchi PDP'ni ishdan chiqara olsa (masalan, uni ko'p so'rov bilan band qilib, yoki PDP'ning tarmoq yo'liga ta'sir qilib) yoki shunchaki PDP muammosi paytini kutsa, PEP hamma narsaga ruxsat beradi:

```ts run
type Input = { user: { tenant: string; role: string }; action: string; resource: { tenant: string } };
let pdpUp = false; // PDP javob bermayapti
async function pdp(_input: Input): Promise<{ allow: boolean }> {
  if (!pdpUp) throw new Error("PDP timeout");
  return { allow: false };
}
async function enforceWeak(input: Input): Promise<boolean> {
  const d = await pdp(input).catch(() => ({ allow: true }));
  return d.allow;
}

const foreign: Input = { user: { tenant: "alfa", role: "driver" }, action: "delete", resource: { tenant: "beta" } };
console.log("PDP ishlamayapti, begona tenant, delete:", await enforceWeak(foreign));
```

```text
PDP ishlamayapti, begona tenant, delete: true
```

Begona tenant'ning resursini o'chirishga ruxsat berildi. Siyosat to'g'ri edi, lekin uni majburlovchi tomon xatoni ruxsat deb talqin qildi. Bu faqat shu o'quv modelidagi mexanizm; real tizimda ham xuddi shu xato (xatoda ruxsat) keng tarqalgan.

### 3. Tuzatilgan kod

```ts run
type Input = { user: { tenant: string; role: string }; action: string; resource: { tenant: string } };
let pdpUp = true;

async function pdp(input: Input): Promise<unknown> {
  if (!pdpUp) throw new Error("PDP timeout");
  const ok =
    input.action === "read" &&
    ["dispatcher", "admin"].includes(input.user.role) &&
    input.user.tenant === input.resource.tenant;
  return { allow: ok };
}

// Aniq `allow === true` bo'lgandagina ruxsat; xato, timeout, yaroqsiz shakl: rad
async function enforce(input: Input): Promise<boolean> {
  try {
    const d = (await pdp(input)) as { allow?: unknown } | null;
    return d?.allow === true;
  } catch {
    return false;
  }
}

const own: Input = { user: { tenant: "alfa", role: "dispatcher" }, action: "read", resource: { tenant: "alfa" } };
const foreign: Input = { user: { tenant: "alfa", role: "driver" }, action: "delete", resource: { tenant: "beta" } };
console.log("PDP ishlayapti, o'z:", await enforce(own));
console.log("PDP ishlayapti, begona:", await enforce(foreign));
pdpUp = false;
console.log("PDP ishlamayapti, o'z:", await enforce(own));
console.log("PDP ishlamayapti, begona:", await enforce(foreign));
```

```text
PDP ishlayapti, o'z: true
PDP ishlayapti, begona: false
PDP ishlamayapti, o'z: false
PDP ishlamayapti, begona: false
```

### Tuzatish nima uchun yetarli

PEP endi faqat PDP aniq `allow: true` qaytargandagina ruxsat beradi; xato, timeout yoki kutilmagan shakl rad bo'ladi. Narxi ham ko'rinadi: PDP ishlamaganda qonuniy foydalanuvchi ham rad etiladi (mavjudlik zarar ko'radi). Bu ongli tanlov: himoyalangan operatsiyalar uchun xavfsizlik mavjudlikdan ustun. Qoldiq risk: PDP javobi kanal orqali o'zgartirilmasligi (PEP va PDP orasidagi autentifikatsiya va yaxlitlik), siyosat to'g'riligi, atributlar yangiligi va keshlangan qarorlarning muddati bu tuzatish bilan hal bo'lmaydi.

## Qachon qo'llamaslik kerak

- Bitta servis va bir necha qoida uchun alohida PDP ortiqcha. Cheat sheet o'zi kichik ilova va cheklangan siyosat uchun kod ichidagi siyosatni mos deydi, faqat uni markazlashtirish va har kirish nuqtasini sinashni talab qiladi.
- Tarmoq chaqiruvi kechikish va mavjudlik xavfini qo'shadi. Har so'rovda masofaviy PDP chaqiruvi tez-tez o'qiladigan yo'llarda sezilarli narx bo'lishi mumkin. Kechikishni o'zingiz o'lchang (bu darsda o'lchov berilmagan); ko'p jamoalar embedded kutubxona yoki sidecar tanlaydi, bunda esa yangilik muammosi paydo bo'ladi.
- Siyosat tili va infratuzilma o'rganish xarajati. Rego yoki boshqa til jamoaga yangi bo'lsa, siyosat xatolari ko'payishi mumkin. Siyosat kodidan kimdir foydalana olmasa, markazlashtirish xavfsizlikni oshirmaydi.
- Gateway'da yagona enforcement yetarli emas. Cheat sheet gateway to'liq trafik qoplamini avtomatik xususiyat emas, deployment talabi deb ataydi; obyekt darajasidagi va biznesga xos tekshiruvlar kontekst bo'lmasa servisda qolishi kerak.
- Markazlashtirish xatolarni ham markazlashtiradi: noto'g'ri yozilgan bitta qoida hamma servisga ta'sir qiladi. Siyosat o'zgarishlari kod review va bosqichma-bosqich chiqarish talab qiladi.
- Policy engine dizayn xatosini tuzatmaydi. A06:2025 sahifasi dizayn nuqsoni mukammal amalga oshirish bilan tuzalmasligini aytadi: kerakli nazorat umuman yaratilmagan bo'lsa, uni qaysi dvigatelda yozish farq qilmaydi. Avval "kim nimaga kira oladi" savoliga javob (51-dars) bo'lishi kerak.

## Stack'da: NestJS va Next.js

NestJS'da PEP guard sifatida yoziladi, PDP chaqiruvi esa servis orqali. Guard `canActivate()` boolean qaytaradi va Nest `false` bo'lsa so'rovni rad etadi (hujjat); shuning uchun xatoda `false` qaytarish tabiiy. Bu kod ishga tushirilmaydi (NestJS moduli va tarmoq chaqiruvi kerak), faqat sintaksis tekshirilgan:

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

type Decision = { allow?: unknown };

@Injectable()
export class PdpGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const input = {
      user: { id: req.user?.id, tenant: req.user?.tenantId, role: req.user?.role }, // sessiyadan, so'rovdan emas
      action: `${req.method} ${req.route?.path}`,
      resource: { id: req.params?.id },
    };
    try {
      const res = await fetch(process.env.PDP_URL ?? "http://localhost:8181/v1/data/fleet/authz", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input }),
        signal: AbortSignal.timeout(300), // timeout: javob kelmasa rad
      });
      if (!res.ok) return false;
      const body = (await res.json()) as { result?: Decision | boolean };
      return body.result === true || (typeof body.result === "object" && body.result?.allow === true);
    } catch {
      return false; // PDP xatosi: rad (fail closed)
    }
  }
}
```

Bu yerda `resource.tenant` PDP o'zi ishonchli ma'lumot manbasidan oladigan yoki PEP resurs yozuvidan o'qib beradigan qiymat bo'lishi kerak, mijozdan emas (cheat sheet talabi). Next.js'da server action va route handler'larda ham xuddi shu: har biri PEP bo'lib, natijani qo'llashdan oldin resursni ochmaydi (58-dars).

## Xulosa

- Policy engine qarorni (PDP) majburlashdan (PEP) ajratadi; ajratish PEP'ning qarorni majburlash mas'uliyatini olib tashlamaydi.
- Siyosat kod ichida (kichik ilova) yoki alohida boshqariladigan bo'lishi mumkin (ko'p servis, izchil qoidalar); OPA kabi umumiy maqsadli engine access control modelining o'zi emas, uni ifodalash vositasi.
- Atributlar ishonchli manbadan olinadi; ma'lumot va siyosatning yangiligi (ayniqsa revocation) o'lchanishi va chegaralanishi kerak.
- To'plamlar uchun nomzodlarni tekshirish, ruxsat etilgan ID'lar ro'yxati yoki filtr/query plan; har yo'lda (ro'yxat, qidiruv, eksport, count) bir xil cheklov va tenant sharti bilan AND.
- PDP xatosi, timeout'i, yaroqsiz yoki yo'q javobi rad etish bilan tugaydi (fail closed). Narx: PDP ishlamaganda mavjudlik pasayadi, bu ongli kompromiss.
