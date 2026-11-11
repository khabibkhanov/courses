---
n: 96
slug: case-log4shell
title: "Case study: Log4Shell"
summary: "CVE-2021-44228 ning mexanizmi: log xabari ichidagi ma'lumot kod sifatida talqin qilingani, Apache va CISA yozuvlaridagi ketma-ket tuzatishlar (2.15.0 dan 2.17.0 gacha), inventarizatsiya va dasturchi uchun saboqlar."
duration: 40
sources:
  - id: log4j-apache
    note: "Apache Logging Services security sahifasi: CVE-2021-44228 (CVSS 3.1: 10.0 CRITICAL), JNDI lookup orqali LDAP serverdan yuklangan kod bajarilishi, faqat log4j-core ta'sirlangan, 2.15.0/2.12.2/2.3.1 da tuzatilgan, kashf etuvchi Chen Zhaojun (Alibaba Cloud Security Team); CVE-2021-45046 (2.16.0 da tuzatilgan, 2.15.0 dagi tuzatish to'liq emas) va CVE-2021-45105 (2.17.0 da tuzatilgan, rekursiv lookup orqali DoS); CVE-2021-44832 (6.6 MEDIUM, JDBC Appender va JNDI data source, hujumchi logging konfiguratsiyasiga yoza olishi kerak); Log4j 1 uchun JMSAppender auditi. Sahifada sanalar ko'rsatilmagan"
  - id: cisa-log4shell
    note: "CISA AA21-356A (2021-12-22): Log4j 2.0-beta9 dan 2.14.1 gacha ta'sirlangan; ommaviy xabarlarga ko'ra ekspluatatsiya 2021-yil 1-dekabr atrofida boshlangan; CVE-2021-44228 ochilgan sana 2021-12-10, CVE-2021-45046 2021-12-13, CVE-2021-45105 2021-12-16; Java 8+ uchun 2.17.0 (2021-12-17), Java 7 uchun 2.12.3 (2021-12-21); inventarizatsiya maydonlari; ta'sirlangan va gumon qilingan aktivlarni kompromet qilingan deb hisoblash va izolyatsiya; threat hunting; faqat Java emas, Log4j kutubxonasining o'zini yangilash; workaround'lar vaqtinchalik. Advisory 2021-12-22 da chiqqan, 2021-12-23 da havola yangilangan"
quiz:
  - q: "Log4Shell mexanizmini umumiy model tilida qanday tasvirlash to'g'ri?"
    options:
      - "Buffer overflow: log xabari xotira chegarasidan oshadi"
      - "Injection: mijoz nazorat qiladigan ma'lumot log xabari ichida ifoda sifatida talqin qilinib, lookup orqali tashqi manzildan kod yuklanishiga olib keladi"
      - "Parol brute force: log fayli parolni oshkor qiladi"
      - "CSRF: brauzer foydalanuvchi nomidan so'rov yuboradi"
    answer: 1
    explain: "Apache yozuvi: log xabari yoki parametrlaridagi JNDI lookup attacker nazorat qiladigan LDAP va boshqa endpoint'larga qarshi himoyalanmagan. Bu ma'lumot va kod chegarasining buzilishi, ya'ni injection (21-dars). Xotira buzilishi yoki CSRF bilan aloqasi yo'q."
  - q: "Tizimingizda log4j-api bor, log4j-core yo'q. Apache yozuviga ko'ra CVE-2021-44228 ga munosabat qanday?"
    options:
      - "Ta'sirlangan: api ham zaif"
      - "Aniqlab bo'lmaydi"
      - "Faqat Java 6 da ta'sirlangan"
      - "Ta'sirlanmagan: yozuvda faqat log4j-core JAR ta'sirlangani aytilgan"
    answer: 3
    explain: "Apache yozuvi faqat log4j-core JAR ta'sirlangan, log4j-api'ni alohida ishlatgan ilovalar ta'sirlanmaganini aniq aytadi. Lekin buni tasdiqlash uchun transitiv bog'liqliklar ham tekshirilishi kerak (82-dars)."
  - q: "2.15.0 versiyasiga o'tgan jamoa 'tugadi' deb hisobladi. Keyin nima bo'ldi va saboq nima?"
    options:
      - "Apache yozuviga ko'ra 2.15.0 dagi tuzatish ayrim nodefault konfiguratsiyalarda to'liq emas edi (CVE-2021-45046, 2.16.0 da tuzatilgan), keyin yana CVE-2021-45105 (2.17.0). Birinchi tuzatishga to'xtab qolmay, advisory'ni kuzatib borish kerak"
      - "Hech narsa: 2.15.0 yakuniy tuzatish"
      - "2.15.0 yangi zaiflik qo'shgan, shuning uchun eski versiyaga qaytish kerak"
      - "Tuzatishlar faqat Java 6 uchun"
    answer: 0
    explain: "Birinchi tuzatish to'liq bo'lmagan; CVE-2021-45046 va CVE-2021-45105 ketma-ket paydo bo'ldi. Incident response'da 'patch qo'lladik' tugal holat emas: advisory yangilanishlari kuzatiladi."
  - q: "CISA tavsiyalariga ko'ra ta'sirlangan aktivlarga qanday munosabat qilish kerak?"
    options:
      - "Faqat patch qo'llash yetarli, boshqa narsa kerak emas"
      - "Aktivlarni inventarizatsiya qilish shart emas"
      - "Ma'lum va gumon qilingan zaif aktivlarni kompromet qilingan deb hisoblash, mitigation va tekshiruv tugaguncha ajratib qo'yish, threat hunting boshlash"
      - "Hamma serverlarni o'chirib, qayta o'rnatish"
    answer: 2
    explain: "CISA advisory'si ta'sirlangan va gumon qilingan aktivlarni kompromet qilingan deb hisoblash va mitigatsiya tasdiqlangunga qadar izolyatsiya qilishni tavsiya etadi; inventarizatsiya birinchi qadam. Faqat patch ekspluatatsiya allaqachon bo'lib o'tganini aniqlamaydi."
  - q: "Versiya tekshiruvi: `\"2.9.0\" < \"2.15.0\"` JavaScript'da (satr solishtirish) nima beradi va nima uchun xavfli?"
    options:
      - "false: satrlar belgima-belgi solishtiriladi ('9' > '1'), shuning uchun 2.9.0 yangiroq deb qaraladi va zaif versiya inventarizatsiyadan tushib qolishi mumkin"
      - "true: to'g'ri natija"
      - "Xato tashlaydi"
      - "undefined"
    answer: 0
    explain: "Satr solishtirishda '2.9.0' va '2.15.0' birinchi farqli belgida ('9' va '1') hal bo'ladi, natija false. Versiyani raqamli qismlarga ajratib solishtirish kerak."
  - q: "Quyidagi chaqiruv orqali foydalanuvchi nomi log'ga yoziladi: `logger.info(\"failed login: \" + username)`. Log kutubxonasi xabar ichidagi `${...}` ni ifoda sifatida kengaytiradi. Eng mustahkam tuzatish qaysi?"
    options:
      - "`username` ni kichik harfga o'tkazish"
      - "Faqat firewall"
      - "`${` ni qidirib, o'chirib tashlovchi regex yozish"
      - "Xabar shablonini o'zgarmas qilib, ma'lumotni alohida parametr sifatida uzatish va kutubxonada lookup'larni o'chirish yoki allowlist qilish, shuningdek kutubxonani yangilash"
    answer: 3
    explain: "Ma'lumotni xabar shabloniga biriktirmaslik chegarani to'g'ri tiklaydi; lookup'larni cheklash va kutubxonani yangilash ikkinchi qatlam. Regex bilan 'yomon belgi' qidirish aylanib o'tiladigan yo'l, bu qoidaga tayanmang."
task:
  title: "Log4j inventarizatsiyasi: versiya solishtirish xatosini tuzatish"
  prompt: |
    `needsPatch(version)` Apache yozuvidagi CVE-2021-44228 ta'sir doirasiga (Log4j 2, log4j-core) kirishini tekshiradi: `[2.0, 2.3.1) U [2.4, 2.12.2) U [2.13.0, 2.15.0)`. Hozirgi versiya versiyalarni satr sifatida solishtiradi va xato natija beradi (masalan `"2.9.0"` uchun). Tuzating: versiyani raqamli qismlarga ajratib solishtiring.

    Qoidalar: versiya `X.Y.Z` yoki `X.Y` ko'rinishida (etishmaydigan qism 0), boshqa shakl (masalan `2.0-beta9`, bo'sh yoki harf bor) uchun `"noma'lum"` qaytsin (qo'lda ko'rish kerak). Qolgan hollarda `true` yoki `false`. Imzoni o'zgartirmang. Oxirgi qatorlar kutilgan natijani chiqarsin.
  lang: ts
  starter: |
    // Apache yozuviga ko'ra CVE-2021-44228 ta'sir doirasi (log4j-core):
    // [2.0, 2.3.1) U [2.4, 2.12.2) U [2.13.0, 2.15.0)
    function needsPatch(version: string): boolean | "noma'lum" {
      const inRange = (v: string, from: string, to: string) => v >= from && v < to;
      return (
        inRange(version, "2.0", "2.3.1") ||
        inRange(version, "2.4", "2.12.2") ||
        inRange(version, "2.13.0", "2.15.0")
      );
    }

    const inventory: [string, string][] = [
      ["telemetry-ingest", "2.9.0"],
      ["report-service", "2.14.1"],
      ["legacy-gateway", "2.12.3"],
      ["billing", "2.17.0"],
      ["old-batch", "2.0-beta9"],
      ["fleet-etl", "2.3.1"],
    ];
    for (const [svc, v] of inventory) console.log(svc, v, "->", needsPatch(v));
  solution: |
    // Apache yozuviga ko'ra CVE-2021-44228 ta'sir doirasi (log4j-core):
    // [2.0, 2.3.1) U [2.4, 2.12.2) U [2.13.0, 2.15.0)
    function parse(version: string): [number, number, number] | null {
      const m = /^(\d+)\.(\d+)(?:\.(\d+))?$/.exec(version.trim());
      return m ? [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)] : null;
    }
    function cmp(a: [number, number, number], b: [number, number, number]): number {
      for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
      return 0;
    }
    function needsPatch(version: string): boolean | "noma'lum" {
      const v = parse(version);
      if (!v) return "noma'lum";
      const inRange = (from: [number, number, number], to: [number, number, number]) =>
        cmp(v, from) >= 0 && cmp(v, to) < 0;
      return (
        inRange([2, 0, 0], [2, 3, 1]) ||
        inRange([2, 4, 0], [2, 12, 2]) ||
        inRange([2, 13, 0], [2, 15, 0])
      );
    }

    const inventory: [string, string][] = [
      ["telemetry-ingest", "2.9.0"],
      ["report-service", "2.14.1"],
      ["legacy-gateway", "2.12.3"],
      ["billing", "2.17.0"],
      ["old-batch", "2.0-beta9"],
      ["fleet-etl", "2.3.1"],
    ];
    for (const [svc, v] of inventory) console.log(svc, v, "->", needsPatch(v));
  solutionNotes: |
    - Versiya `[major, minor, patch]` songa ajratiladi va qismma-qism solishtiriladi. Satr solishtirish `"2.9.0" < "2.15.0"` ni `false` qiladi, shuning uchun zaif servis ro'yxatdan tushib qolardi.
    - `2.0-beta9` kabi shakl uchun javob `"noma'lum"`: bunday versiyani ro'yxatdan jim o'tkazib yuborish (false) xavfli, qo'lda ko'rishga yuboriladi.
    - Oraliqlar Apache yozuvidagi ta'sir doirasi (2021-12 holati). Bu faqat CVE-2021-44228 uchun; CVE-2021-45046 va CVE-2021-45105 ning doirasi boshqa, shuning uchun `2.12.2` yoki `2.15.0` CVE-2021-44228 dan tuzatilgan bo'lsa ham keyingi tuzatishlarni talab qiladi.
    - Bu funksiya faqat versiyaga qaraydi. Transitiv bog'liqlik (shaded JAR) ichidagi Log4j ni topish uchun SBOM va qadoqni skanerlash kerak (82-dars).
  checklist:
    - "`2.9.0` zaif doirada deb topiladi (`true`)"
    - "`2.15.0` dan yuqori va `2.12.2`..`2.13.0` orasidagi versiyalar uchun `false`"
    - "`2.0-beta9` uchun `\"noma'lum\"` qaytadi"
    - "Imzo o'zgarmagan"
    - "Funksiya faqat CVE-2021-44228 doirasini tekshirishini ayta olasiz"
---

## Muammo

2021-yil dekabrida Apache Log4j 2 kutubxonasidagi CVE-2021-44228 ("Log4Shell") ochildi. Apache o'z security sahifasida uni CVSS 3.1 bo'yicha 10.0 CRITICAL deb baholagan, ta'rifi esa qisqa: JNDI lookup tashqi LDAP serverdan yuklangan kodni bajarishga olib kelishi mumkin. CISA va hamkor agentliklarning AA21-356A advisory'si (2021-12-22) CVE-2021-44228 ning 2021-12-10 da ochilganini, u Log4j 2.0-beta9 dan 2.14.1 gacha versiyalarga tegishli ekanini yozadi va ommaviy xabarlarga ko'ra ekspluatatsiya 2021-yil 1-dekabr atrofida boshlanganini aytadi.

Dasturchi uchun bu hodisa to'rt savol qo'yadi. Birinchisi: oddiy log yozish qatori qanday qilib kod bajarishga aylandi? Ikkinchisi: kutubxonani yangilab chiqish nega bir marta yetmadi? Uchinchisi: qaysi servisingizda bu kutubxona borligini bilasizmi? To'rtinchisi: Node.js dasturchisi bu Java hodisasidan nimani oladi, agar o'zida Log4j bo'lmasa? Bu dars bu savollarga faqat ikkita birlamchi manbaga tayanib javob beradi: Apache security sahifasi va CISA advisory'si. Ular yozmagan narsa (masalan, kimlar hujum qilgani, qancha zarar ko'rilgani) bu yerda yo'q.

## Asosiy g'oya

### Mexanizm: log ichidagi ma'lumot ifoda bo'lib qoldi

Apache yozuvidagi ta'rif: Log4j'da konfiguratsiya, log xabarlari va parametrlarda ishlatiladigan JNDI funksiyalari attacker boshqaradigan LDAP va boshqa JNDI endpoint'lariga qarshi himoyalanmagan. Log xabari yoki uning parametrlarini nazorat qila oladigan hujumchi LDAP serverlardan yuklangan kodni bajarishi mumkin. Faqat `log4j-core` JAR ta'sirlangan; faqat `log4j-api` ishlatadigan ilovalar zaiflikka ega emas.

Umumiy modelda bu 21-darsdagi injection: ma'lumot (foydalanuvchi nomi, User-Agent, boshqa header) log xabariga yozilganda, kutubxona uni oddiy matn emas, kengaytiriladigan ifoda sifatida ko'rdi. Ifodaning bir turi tashqi manzilga murojaat qilib, qaytgan narsani ishlatishga olib keldi. Ma'lumot va kod chegarasi log qatlamida buzildi, xuddi SQL injection'da ma'lumot SQL matniga qo'shilganidek (22-dars). Eng zararli jihati: dasturchi log qatorini "xavfsiz, faqat matn" deb bilgan, shuning uchun u yerga hamma kirishni ehtiyotsiz uzatgan.

### Ketma-ket tuzatishlar

Birinchi tuzatish: Apache yozuviga ko'ra CVE-2021-44228 Log4j 2.15.0 (Java 8 va undan yuqori), 2.12.2 (Java 7) va 2.3.1 (Java 6) da tuzatilgan. Biroq 2.15.0 dagi tuzatish ayrim nodefault konfiguratsiyalarda to'liq emasligi aniqlandi: Thread Context Lookup (masalan `${ctx:loginId}`) bilan ishlatiladigan nodefault Pattern Layout'da MDC ustidan nazorati bor hujumchi ma'lumot sizishiga va ayrim muhitlarda kod bajarishga erishishi mumkin edi. Bu CVE-2021-45046; Apache uni 2.16.0 (Java 8), 2.12.3 (Java 7) va 2.3.1 da tuzatdi. CISA advisory'siga ko'ra u 2021-12-13 da e'lon qilingan.

Keyingi: CVE-2021-45105 (2021-12-16 e'lon qilingan, CISA yozuvi): nodefault Pattern Layout va Context Lookup bilan, MDC ustidan nazorati bor hujumchi o'ziga ishora qiluvchi (rekursiv) lookup yuborib StackOverflowError chaqirishi va jarayonni to'xtatishi mumkin edi, ya'ni mavjudlikka hujum. Apache buni 2.17.0 (Java 8) da tuzatdi. CISA tavsiyasi: Java 8 va undan yuqori muhitda 2.17.0 (2021-12-17 da chiqqan) yoki undan yangi, Java 7 da 2.12.3 (2021-12-21 da chiqqan) ga o'tish.

Saboq: patch bitta voqea emas. Birinchi tuzatish to'liq emas bo'lishi mumkin va advisory yangilanishlarini kuzatish incident response'ning davomi (93-dars).

## Chuqurroq: javob jarayoni nimani talab qildi

### Voqealar ketma-ketligi

Quyidagi jadval faqat Apache va CISA yozuvlaridagi sanalarni jamlaydi (Apache sahifasi sana ko'rsatmaydi, sanalar CISA advisory'sidan):

| Sana | Voqea |
|---|---|
| 2021-12-01 atrofida | Ommaviy xabarlarga ko'ra CVE-2021-44228 ekspluatatsiyasi boshlangan (CISA) |
| 2021-12-10 | CVE-2021-44228 (Log4Shell) ochilgan; tuzatish 2.15.0 (Java 8+) |
| 2021-12-13 | CVE-2021-45046 ochilgan; tuzatish 2.16.0 (Java 8) |
| 2021-12-16 | CVE-2021-45105 ochilgan; tuzatish 2.17.0 (Java 8) |
| 2021-12-17 | Log4j 2.17.0 (Java 8) chiqqan |
| 2021-12-21 | Log4j 2.12.3 (Java 7) chiqqan |
| 2021-12-22 | CISA va hamkorlarning AA21-356A advisory'si; 2021-12-23 da bir havola yangilangan |

Jadvaldan ikki xulosa. Birinchisi: ommaviy xabarlarga ko'ra ekspluatatsiya zaiflik rasman ochilishidan oldin boshlangan, ya'ni jamoalar "patch bor, qo'llaymiz" holatiga emas, "zaif, himoya yo'q" holatiga tushgan. Ikkinchisi: Java 8+ uchun uchta versiya (2.15.0, 2.16.0, 2.17.0) zaiflik ochilgandan keyingi bir hafta ichida kerak bo'lgan; "yangilab qo'ydik" degan jamoa o'sha haftalarda ikki marta yana yangilashi kerak bo'lgan. Shuning uchun yangilash jarayoni bir martalik emas, takrorlanadigan va tez bo'lishi shart.

Apache sahifasida yana bir CVE bor: CVE-2021-44832 (6.6 MEDIUM). U boshqa sinf: logging konfiguratsiyasiga yoza oladigan hujumchi JDBC Appender'ning data source'ini JNDI manziliga yo'naltirib kod bajartira oladi; tuzatish JNDI data source nomlarini bitta protokol bilan cheklaydi. Bu nom kam esga olinadi, chunki bahosi past: hujumchiga konfiguratsiyaga yozish huquqi kerak. Saboq shuki, baho (CVSS) shartlarga bog'liq, ammo xuddi shu mexanizm (JNDI) turli yo'llar bilan qayta-qayta paydo bo'lgan. Log4j 1 uchun Apache boshqacha maslahat beradi: Log4j 1 da lookup'lar yo'q, u faqat konfiguratsiyadagi JNDI orqali ta'sirlanadi va `JMSAppender` sozlanmaganligini tekshirish kerak (bu alohida CVE).


### Inventarizatsiya birinchi qadam

CISA tavsiyasidagi birinchi qadam: Log4j kutubxonasidan foydalanadigan barcha aktivlarni ro'yxatga olish. Advisory ro'yxat hamma aktivni (cloud ham) o'z ichiga olishi va har biri uchun dastur versiyalari, oxirgi yangilangan vaqt va kim yangilagani, foydalanuvchi akkauntlari va huquqlari, tarmoqdagi joyi yozilishini aytadi. Jamoalarning ko'pi uchun muammo patch emas, "bizda Log4j bormi" savoliga javob bermaslik edi. Kutubxona to'g'ridan-to'g'ri bog'liqlik bo'lmasligi, boshqa kutubxona ichida (transitiv) yoki qadoqlangan JAR ichida (shaded) yashashi mumkin. SBOM (82-dars) shu savolga javob berish uchun kerak.

### Patch bilan tugamaydi

CISA advisory'si ma'lum va gumon qilingan zaif aktivlarni kompromet qilingan deb hisoblash va mitigatsiya hamda tekshiruv tugaguncha izolyatsiya qilishni tavsiya etadi, hamda threat hunting o'tkazishni (ekspluatatsiya izlarini qidirish) aytadi. Sabab: ekspluatatsiya patch'dan oldin boshlangan va tizim patch'dan keyin ham allaqachon buzilgan bo'lishi mumkin. Ya'ni patch faqat kelajakdagi ekspluatatsiyani yopadi, o'tmishdagisini emas. Loglar, tarmoq trafigi va yangi jarayonlar tahlili kerak bo'ladi (93-dars). Advisory izolyatsiya variantlarini ham sanaydi: aktivni uzib qo'yish, monitoring qilinadigan alohida VLAN'ga ("jail VLAN") ko'chirish, tarmoq darajasida bloklash, qat'iy port nazoratli firewall yoki aloqani cheklash. Threat hunting uchun Log4j ishlatadigan aktivlar shubhali deb qaraladi, ularga bog'langan akkauntlar ko'riladi va 2021-yil 1-dekabrdan beri qilingan konfiguratsiya o'zgarishlari niyatli bo'lganini tekshirish tavsiya etiladi. Yana bir amaliy nuqta: yangilanishi kerak bo'lgan narsa Java emas, Log4j kutubxonasining o'zi. Vaqtincha yechimlar (workaround) faqat darhol yangilab bo'lmaganda va vaqtinchalik chora sifatida ishlatiladi.

### Node.js dasturchisi uchun saboq

Sizda Log4j bo'lmasligi mumkin, lekin tuzilma bir xil: ma'lumotni kengaytiradigan har qatlam (log formatlash, template engine (28-dars), deserializatsiya (29-dars), lokalizatsiya kutubxonasi, "o'zgaruvchilarni almashtirish" xususiyati) injection sinfiga kiradi. Shuningdek siz o'zingiz yozmagan infratuzilma komponentlari (Java asosidagi xizmatlar, qidiruv va log yig'uvchi tizimlar) ham ta'sirlangan bo'lishi mumkin; qaysilari ekanini bu dars isbotlamaydi, shuning uchun o'z stack'ingizni SBOM bilan tekshiring.

### Dizayn saboqlari

Mexanizmdan uchta dizayn qoidasi chiqadi. Birinchisi: ma'lumot va shablon alohida kanal. Log chaqiruvida xabar matni dasturchi yozgan o'zgarmas shablon, foydalanuvchi qiymati esa alohida parametr bo'lishi kerak va kutubxona parametrni hech qachon ifoda sifatida o'qimasligi lozim. Ikkinchisi: xavfli imkoniyat default holatda yoqilmagan bo'lishi kerak. Log qatlamida tashqi manzilga murojaat qiluvchi lookup oddiy log yozuvchi dasturchi kutmagan imkoniyat edi; zaiflik shu imkoniyat hamma ma'lumotga qo'llanishida yotadi. Uchinchisi: har imkoniyat uchun allowlist (qaysi lookup turlari, qaysi protokollar), qora ro'yxat emas. CVE-2021-44832 tuzatishi aynan shunday: JNDI data source nomlari bitta protokol bilan cheklanadi. Bu qoidalar o'zingiz yozadigan har bir "qulay" kengaytirish xususiyatiga tegishli: konfiguratsiya fayllaridagi `${VAR}` almashtirishi, xabar shablonlari, email shablonlari, webhook payload'idagi o'zgaruvchilar.

## Misol: o'quv modelida lookup injection

Quyida Log4Shell'ning mexanizmini minimal o'quv modelida ko'rsatamiz. Bu haqiqiy kutubxona yoki real tizim emas: xotiradagi `directory` "tashqi server" rolini o'ynaydi, "bajariladigan kod" esa zararsiz funksiya. Namespace nomlari ataylab o'quv uchun (`dir`, `env`).

### 1. Zaif kod

```ts run
type Entry = { kind: "data"; value: string } | { kind: "code"; run: () => string };
// "Tashqi server" katalogi: hujumchi o'z yozuvini shu yerga qo'ygan deb tasavvur qiling
const directory = new Map<string, Entry>([
  ["svc/banner", { kind: "data", value: "xush kelibsiz" }],
  ["attacker/payload", { kind: "code", run: () => "[o'quv] KOD BAJARILDI" }],
]);
const env: Record<string, string> = { REGION: "tashkent" };

// ZAIF: xabar ichidagi ${ns:arg} ifodalari kengaytiriladi, kengaytirish "code" turini ham bajaradi
function expand(message: string): string {
  return message.replace(/\$\{(\w+):([^}]*)\}/g, (_m, ns: string, arg: string) => {
    if (ns === "env") return env[arg] ?? "";
    if (ns === "dir") {
      const e = directory.get(arg);
      if (!e) return "";
      return e.kind === "code" ? e.run() : e.value;
    }
    return "";
  });
}
const out: string[] = [];
const logWeak = (msg: string) => out.push(expand(msg));

function onLoginFailed(username: string) {
  logWeak("login xatosi: " + username); // ZAIF: username shablonga birikkan
}
onLoginFailed("aziz");
onLoginFailed("${dir:attacker/payload}");
onLoginFailed("${env:REGION}");
out.forEach((l) => console.log(l));
```

### 2. Hujum

Hujumchi faqat foydalanuvchi nomi maydonini to'ldiradi. Ikkinchi chaqiruvda ifoda "tashqi katalogdan" kodni oladi va bajaradi, uchinchisida esa muhit o'zgaruvchisi qiymati log'ga sizadi (Apache yozuvidagi CVE-2021-45046 tavsifida ham boshqa lookup'larning maxfiy ma'lumotni log orqali oshkor qilishi mumkinligi aytilgan). Natija:

```text
login xatosi: aziz
login xatosi: [o'quv] KOD BAJARILDI
login xatosi: tashkent
```

Foydalanuvchi nomi oddiy matn bo'lishi kerak edi, lekin log qatlami uni ifoda deb o'qidi.

### 3. Tuzatilgan kod

```ts run
type Entry = { kind: "data"; value: string } | { kind: "code"; run: () => string };
const directory = new Map<string, Entry>([
  ["attacker/payload", { kind: "code", run: () => "[o'quv] KOD BAJARILDI" }],
]);
const env: Record<string, string> = { REGION: "tashkent" };

// Tuzatish 1: shablon va ma'lumot ajratilgan. Faqat shablon kengaytiriladi, parametrlar hech qachon.
// Tuzatish 2: lookup'lar allowlist: faqat "env" va faqat oldindan belgilangan kalitlar, "dir" yo'q.
const ALLOWED_ENV = new Set(["REGION"]);
function render(template: string, params: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_m, name: string) => params[name] ?? "");
}
function expandTemplate(template: string): string {
  return template.replace(/\$\{env:(\w+)\}/g, (_m, k: string) => (ALLOWED_ENV.has(k) ? env[k] : ""));
}
const out: string[] = [];
function logSafe(template: string, params: Record<string, string>) {
  out.push(render(expandTemplate(template), params)); // params expand qilinmaydi
}

logSafe("[{region}] login xatosi: {user}", { region: env.REGION, user: "aziz" });
logSafe("login xatosi: {user}", { user: "${dir:attacker/payload}" });
logSafe("login xatosi: {user}", { user: "${env:REGION}" });
out.forEach((l) => console.log(l));
console.log("directory ishlatildimi:", directory.size > 0 ? "mavjud, lekin chaqirilmadi" : "yo'q");
```

```text
[tashkent] login xatosi: aziz
login xatosi: ${dir:attacker/payload}
login xatosi: ${env:REGION}
directory ishlatildimi: mavjud, lekin chaqirilmadi
```

Tuzatish nima uchun yetarli: ma'lumot hech qachon kengaytirish bosqichiga kirmaydi (`params` faqat `render` da o'rniga qo'yiladi va natija qayta ishlanmaydi), shuning uchun hujumchi satri matn bo'lib qoladi. Kengaytirish ham faqat shablon (dasturchi yozgan matn) uchun va allowlist bilan cheklangan: kod bajaruvchi tur umuman yo'q. Yopilmagan narsa: bu o'quv modeli. Haqiqiy Log4j holatida asosiy tuzatish kutubxonani yangilash (2.17.0 yoki undan yangi); modeldagi dizayn saboqlari esa o'zingiz yozadigan kodga tegishli. Regex bilan `${` ni olib tashlash tuzatish emas, chunki kodlash va ko'p qatlamli talqin bilan aylanib o'tiladi; chegarani to'g'ri tiklash kerak.

### Inventarizatsiya: versiya diapazoni

Birinchi qadam "qayerda zaif versiya bor"ni topish. Oraliqlar Apache yozuvidan (CVE-2021-44228 uchun `[2.0-beta9, 2.3.1) U [2.4, 2.12.2) U [2.13.0, 2.15.0)`). Mana raqamli solishtirishli tekshiruv:

```ts run
type V = [number, number, number];
function parse(version: string): V | null {
  const m = /^(\d+)\.(\d+)(?:\.(\d+))?$/.exec(version.trim());
  return m ? [Number(m[1]), Number(m[2]), Number(m[3] ?? 0)] : null;
}
function cmp(a: V, b: V): number {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  return 0;
}
function affected44228(version: string): boolean | "noma'lum" {
  const v = parse(version);
  if (!v) return "noma'lum";
  const inR = (f: V, t: V) => cmp(v, f) >= 0 && cmp(v, t) < 0;
  return inR([2, 0, 0], [2, 3, 1]) || inR([2, 4, 0], [2, 12, 2]) || inR([2, 13, 0], [2, 15, 0]);
}

console.log('satr bilan: "2.9.0" < "2.15.0" =', "2.9.0" < "2.15.0");
for (const v of ["2.9.0", "2.14.1", "2.15.0", "2.12.3", "2.17.0", "2.0-beta9"]) {
  console.log(v.padEnd(10), affected44228(v));
}
```

```text
satr bilan: "2.9.0" < "2.15.0" = false
2.9.0      true
2.14.1     true
2.15.0     false
2.12.3     false
2.17.0     false
2.0-beta9  noma'lum
```

Birinchi qator satr solishtirish tuzog'ini ko'rsatadi: `"2.9.0"` `"2.15.0"` dan kichik emas deb chiqadi. Oxirgi qatorlarda `2.15.0` va `2.12.3` CVE-2021-44228 doirasidan tashqarida (`false`), lekin `2.15.0` dagi tuzatish CVE-2021-45046 bo'yicha to'liq emas edi va u CVE-2021-45105 dan ham tuzatilmagan (Apache yozuvi: 2.16.0 dan oldin 45046, 2.17.0 dan oldin 45105). Java 8 va undan yuqori uchun CISA 2.17.0 yoki yangisini tavsiya qiladi. Ya'ni bitta CVE bo'yicha `false` butun xavfsizlik degani emas.

## Qachon qo'llamaslik kerak

Bu case study'ni noto'g'ri o'qish mumkin bo'lgan holatlar bor. Birinchisi: "log'ga hech narsa yozmaymiz" xulosasi. A09 kategoriyasi aksincha, yetarli loglash yo'qligi ham muammo ekanini aytadi; yechim loglash emas, ma'lumot va kod chegarasini saqlash.

Ikkinchisi: har kutubxonaga shubha bilan qarab hammasini o'zingiz yozish. Bu ko'proq xatolarga olib keladi; Log4Shell'dan olinadigan xulosa bog'liqliklarni inventarizatsiya qilish va tez yangilash qobiliyati, ularni rad etish emas (81-82-darslar).

Uchinchisi: bitta CVE uchun versiya tekshiruvi (yuqoridagi `affected44228`) butun risk baholash emas. U boshqa CVE'lar, konfiguratsiya (lookup'lar yoqilganmi) va ekspozitsiyani (zaif servis internetdan ko'rinadimi) hisobga olmaydi.

To'rtinchisi: bu dars ekspluatatsiyaning real tarixi, zarar yoki hujumchilar haqida da'vo qilmaydi. Faqat Apache va CISA yozuvlaridagi mexanizm, versiyalar va tavsiyalar keltirildi.

## Stack'da: Node.js va umumiy amaliyot

Node.js loyihasida Log4Shell'ning to'g'ridan-to'g'ri analogi emas, lekin amaliy ishlar ro'yxati bir xil. `npm ls` va lockfile (82-dars) bilan qaysi paket qaysi versiyada ekanini bilish; log chaqiruvlarida shablon va ma'lumotni ajratish (Pino/Winston'da `logger.info({ user }, "login failed")` shakli, matn biriktirish emas); log xabarini template engine yoki `eval` kabi qatlamga uzatmaslik; dependency yangilash jarayonini oldindan sinab ko'rish (Renovate/Dependabot + CI testlari), shunda "kritik patch" kunida jamoa tayyor bo'ladi. Infratuzilmada Java asosidagi xizmatlar bo'lsa, ularning versiyasi va konfiguratsiyasi inventarizatsiyaga kiritiladi. Quyidagi parcha xavfsiz log chaqiruvining shaklini ko'rsatadi (ishga tushirilmaydi: Pino brauzer worker'ida yo'q; sintaksis tekshirilgan):

```ts
import pino from "pino";
const logger = pino();

export function onLoginFailed(username: string, ip: string) {
  // ma'lumot alohida maydon: xabar shabloniga biriktirilmaydi
  logger.warn({ event: "login_failed", username, ip }, "login failed");
}
```

## Xulosa

- Log4Shell (CVE-2021-44228) injection sinfidagi zaiflik: log xabari ichidagi ma'lumot ifoda sifatida kengaytirilib, JNDI lookup orqali tashqi serverdan kod yuklanishiga olib kelgan. Faqat log4j-core ta'sirlangan.
- Tuzatishlar ketma-ket bo'ldi: 2.15.0, so'ng CVE-2021-45046 uchun 2.16.0, CVE-2021-45105 uchun 2.17.0. Birinchi patch'ga to'xtamang, advisory'ni kuzating.
- CISA tavsiyasi: avval inventarizatsiya, ta'sirlangan va gumon qilingan aktivlarni kompromet qilingan deb hisoblash, threat hunting.
- Versiyani raqamli qismlar bo'yicha solishtiring; satr solishtirish zaif versiyalarni yashiradi. Noma'lum shaklni jim "xavfsiz" deb o'tkazmang.
- Dasturchi saboqi: ma'lumotni hech qachon kengaytiriladigan shablonga biriktirmang; qatlamlardagi "qulay" kengaytirish xususiyatlarini o'chiring yoki cheklang.
- Bog'liqliklar ro'yxatini (SBOM) va yangilash jarayonini hodisadan oldin tayyorlang.
