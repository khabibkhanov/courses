---
n: 27
slug: ssrf
title: "SSRF: ichki tarmoq va cloud metadata"
summary: "SSRF - server foydalanuvchi bergan manzilga so'rov yuboradi va ichki tarmoq yoki cloud metadata'ga yetib boradi. Dars allow-list va deny-list farqini, URL parser kanonizatsiyasini, DNS rebinding va redirect holatlarini, IMDSv2'ning o'rnini mini tarmoq modelida ko'rsatadi."
duration: 50
sources:
  - id: cs-ssrf
    note: "SSRF Prevention Cheat Sheet: ikki holat (ishonchli ilovalar ro'yxati mumkin yoki yo'q), allow-list afzalligi, deny-list oxirgi chora, IP manzillarni kanonik shaklga keltirib solishtirish, DNS rebinding uchun tasdiqlangan IP'ga ulanish, redirect'ni o'chirish, IMDSv2"
  - id: t10-a01
    note: "OWASP Top 10:2025 A01 Broken Access Control: kategoriyada CWE-918 Server-Side Request Forgery (SSRF) ko'rsatilgan"
  - id: cwe-top25
    note: "2025 CWE Top 25 ro'yxati: CWE-918 Server-Side Request Forgery 22-o'rinda (2026-11-11 da cwe.mitre.org sahifasidan tekshirilgan)"
quiz:
  - q: "Webhook URL'ni tekshirish: `url.startsWith(\"http://10.\") || url.startsWith(\"http://192.168.\")` bo'lsa rad etiladi. Qaysi kiritish tekshiruvdan o'tib, ichki manzilga olib boradi?"
    options:
      - "`http://10.0.0.5/`"
      - "`http://192.168.1.1/`"
      - "`https://example.com/`"
      - "`http://2852039166/` (o'nlik yozuv, 169.254.169.254 ga teng) yoki ichki IP'ga ko'rsatuvchi domen nomi"
    answer: 3
    explain: "Satr tekshiruvi manzilning yozilish shakliga bog'liq, URL parser esa o'nlik, sakkizlik va IPv6 shakllarini bir xil manzilga keltiradi. Domen nomi ham ichki IP'ga resolve bo'lishi mumkin. Manzilni kanonik shaklga keltirib, so'ng tekshirish kerak."
  - q: "Ilova domen nomini resolve qilib, IP ommaviy ekanini tekshirdi, keyin HTTP klientga domen nomini berdi (u qayta resolve qiladi). Nima uchun bu yetmaydi?"
    options:
      - "Yetadi: DNS javobi doim bir xil"
      - "Yetmaydi: ikki DNS so'rov orasida javob o'zgarishi mumkin (DNS rebinding); tekshirilgan IP'ning o'ziga ulanish kerak"
      - "Yetmaydi: DNS faqat IPv6 uchun ishlaydi"
      - "Yetadi: HTTPS ishlatilgan"
    answer: 1
    explain: "Birinchi javob ommaviy, ikkinchisi ichki IP bo'lishi mumkin. Cheat sheet tekshirilgan IP'ga ulanishni, Host sarlavhasi, SNI va sertifikat tekshiruvini asl domen bilan saqlashni tavsiya qiladi."
  - q: "Sizning ilovangiz faqat uchta ma'lum hamkor servisga so'rov yuboradi. Qaysi yondashuv to'g'ri?"
    options:
      - "Allow-list: faqat shu uchta hostni qabul qilish; boshqasini rad etish"
      - "Deny-list: ichki diapazonlarni bloklash"
      - "Hech narsa tekshirmaslik, firewall yetadi"
      - "Faqat HTTPS sxemasini tekshirish"
    answer: 0
    explain: "Manzillar aniq ma'lum bo'lsa, allow-list ishlatiladi: cheat sheet shuni ustun qo'yadi, deny-list esa aylanib o'tishga moyil. Sxema tekshiruvi manzilni cheklamaydi."
  - q: "URL tekshiruvidan o'tdi (host ommaviy), lekin HTTP klient `302 Location: http://127.0.0.1:6379/` ga redirect'ni avtomatik kuzatdi. Qanday tuzatiladi?"
    options:
      - "Redirect'larni o'chirish yoki har redirect manzilini xuddi shu tekshiruvdan qayta o'tkazish"
      - "Faqat birinchi so'rovni tekshirish yetarli"
      - "Timeout qo'yish"
      - "Hujumchi redirect qila olmaydi"
    answer: 0
    explain: "Redirect tekshiruvni chetlab o'tish yo'li. Cheat sheet klientda redirect'ni o'chirishni aytadi. Kuzatish kerak bo'lsa, har yangi manzil to'liq tekshiruvdan o'tishi lozim."
  - q: "Cloud instansda ilova SSRF'ga zaif, lekin IMDSv2 yoqilgan va IMDSv1 o'chirilgan. Bu holat haqida qaysi gap to'g'ri?"
    options:
      - "SSRF endi mumkin emas"
      - "IMDS umuman o'chirilgan"
      - "IMDSv2 SSRF'ning hamma turini yopadi"
      - "IMDSv2 qo'shimcha qatlam (defense in depth): ba'zi SSRF holatlarini yumshatadi, lekin zaiflikning o'zini va ichki servislarga so'rov imkonini yopmaydi"
    answer: 3
    explain: "Cheat sheet IMDSv2'ni qo'shimcha himoya mexanizmi sifatida ta'riflaydi va ba'zi SSRF holatlarini yumshatishini aytadi. Ilovadagi SSRF baribir ichki servislarga yo'l ochib turadi."
  - q: "SSRF'ni faqat HTTP so'rovlari bilan bog'lash noto'g'ri bo'lishi mumkin. Nega?"
    options:
      - "Ilovaning o'zi ikkinchi so'rovni boshqa protokol yoki sxema (masalan `file://`, `gopher://`) bilan yuborishi mumkin, va XXE ham SSRF'ga olib kelishi mumkin"
      - "SSRF faqat DNS bilan bog'liq"
      - "SSRF faqat brauzerda ishlaydi"
      - "SSRF faqat IPv6 bilan"
    answer: 0
    explain: "Cheat sheet SSRF HTTP bilan cheklanmaganini, ikkinchi so'rovni ilova yuborsa boshqa protokol va sxemalar ishlatilishi mumkinligini va XXE orqali ham SSRF bo'lishini yozadi. Sxemani allow-list qiling."
task:
  title: "Tashqi URL tekshiruvi: kanonik manzil bo'yicha"
  prompt: |
    `isSafeTarget(raw)` foydalanuvchi bergan URL'ga ilova so'rov yuborishga ruxsat berish-bermasligini aytadi. Hozirgi versiya faqat satr boshini va `localhost` ni tekshiradi. `resolve` (DNS modeli) va `toV4` (IPv4-mapped IPv6 ni IPv4 ga keltiradi) berilgan.

    Tuzating: URL `new URL` bilan tahlil qilinsin (xato bo'lsa `false`), sxema faqat `http:` yoki `https:`, port bo'sh yoki 80/443, hostning barcha DNS javoblari `toV4` dan keyin ommaviy bo'lsin (0/8, 10/8, 127/8, 169.254/16, 172.16/12, 192.168/16, 224+ diapazonlar ommaviy emas; IPv4 shaklida bo'lmagan manzil ham ommaviy emas), javob bo'sh bo'lsa `false`. Imzoni o'zgartirmang. Kutilgan natija: faqat birinchi holat `true`.
  lang: ts
  starter: |
    function resolve(host: string): string[] {
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith("[")) return [host];
      const table: Record<string, string[]> = { "cdn.alfa.test": ["93.184.216.34"], "evil.test": ["10.0.0.5"] };
      return table[host] ?? [];
    }
    function toV4(ip: string): string {
      const m = /^\[::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})\]$/i.exec(ip);
      if (!m) return ip;
      const a = parseInt(m[1], 16), b = parseInt(m[2], 16);
      return [a >> 8, a & 255, b >> 8, b & 255].join(".");
    }

    function isSafeTarget(raw: string): boolean {
      return raw.startsWith("http") && !raw.includes("localhost");
    }

    const cases = [
      "https://cdn.alfa.test/logo.png",
      "http://169.254.169.254/latest/meta-data/",
      "http://2852039166/",
      "https://evil.test/",
      "http://[::ffff:a9fe:a9fe]/",
      "ftp://cdn.alfa.test/x",
      "https://cdn.alfa.test:6379/",
    ];
    for (const c of cases) console.log(isSafeTarget(c), c);
  solution: |
    function resolve(host: string): string[] {
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith("[")) return [host];
      const table: Record<string, string[]> = { "cdn.alfa.test": ["93.184.216.34"], "evil.test": ["10.0.0.5"] };
      return table[host] ?? [];
    }
    function toV4(ip: string): string {
      const m = /^\[::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})\]$/i.exec(ip);
      if (!m) return ip;
      const a = parseInt(m[1], 16), b = parseInt(m[2], 16);
      return [a >> 8, a & 255, b >> 8, b & 255].join(".");
    }

    function isPublicV4(ip: string): boolean {
      const p = ip.split(".").map(Number);
      if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
      const [a, b] = p;
      if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
      if (a === 169 && b === 254) return false;
      if (a === 172 && b >= 16 && b <= 31) return false;
      if (a === 192 && b === 168) return false;
      return true;
    }

    function isSafeTarget(raw: string): boolean {
      let u: URL;
      try { u = new URL(raw); } catch { return false; }
      if (u.protocol !== "http:" && u.protocol !== "https:") return false;
      if (u.port !== "" && u.port !== "80" && u.port !== "443") return false;
      const ips = resolve(u.hostname).map(toV4);
      return ips.length > 0 && ips.every(isPublicV4);
    }

    const cases = [
      "https://cdn.alfa.test/logo.png",
      "http://169.254.169.254/latest/meta-data/",
      "http://2852039166/",
      "https://evil.test/",
      "http://[::ffff:a9fe:a9fe]/",
      "ftp://cdn.alfa.test/x",
      "https://cdn.alfa.test:6379/",
    ];
    for (const c of cases) console.log(isSafeTarget(c), c);
  solutionNotes: |
    - Tekshiruv matn ustida emas, URL parser va DNS natijasi ustida bajariladi: `http://2852039166/` parser tomonidan `169.254.169.254` ga keltiriladi, IPv4-mapped IPv6 esa `toV4` bilan IPv4 ga. Cheat sheet ham solishtirishdan oldin manzilni kanonik shaklga keltirishni talab qiladi.
    - `every(isPublicV4)`: domen bir nechta IP'ga resolve bo'lsa, hammasi ommaviy bo'lishi kerak; bitta ichki javob yetarli rad etish uchun. IPv4 ko'rinishida bo'lmagan manzil (masalan, boshqa IPv6) default holatda rad etiladi: noma'lum narsa ruxsat etilmaydi (fail-safe default, 3-dars).
    - Bu funksiya faqat qaror beradi. Real kodda tekshirilgan IP'ning o'ziga ulanish kerak (DNS rebinding), redirect'lar o'chirilgan bo'lishi kerak va javob hajmi/vaqti cheklanishi kerak. Bu tuzatish ularni qoplamaydi.
    - Manzillar aniq ma'lum bo'lsa, bu funksiya o'rniga allow-list ishlating: u ancha ishonchli.
  checklist:
    - "URL `new URL` bilan tahlil qilinadi, xato bo'lsa `false`"
    - "Sxema va port cheklangan"
    - "Tekshiruv DNS javobi va kanonik IPv4 manzil ustida"
    - "Bitta ham ichki javob bo'lsa rad etiladi; bo'sh javob rad etiladi"
    - "Qoplanmaydigan narsalarni (rebinding, redirect, hajm) ayta olasiz"
---

## Muammo

Avtopark platformasi mijoz ko'rsatgan manzildan nimadir olib kelishi kerak bo'lgan funksiyalarga ega: kompaniya logotipini URL bo'yicha yuklash, webhook yuborish (bu server tomonda chaqiruv), tashqi GPS provayderidan telemetriya olish, hisobotni boshqa servisga uzatish. Har bunday joyda server foydalanuvchi bergan manzilga so'rov yuboradi. Foydalanuvchi esa server qaysi tarmoqda turganini biladi yoki taxmin qiladi: serverning ichki manzillariga, localhost'dagi servislarga, cloud metadata xizmatiga so'rov yuborishni so'raydi. Server bu manzillarga yetib bora oladi, hujumchi esa yetmaydi: so'rov server nomidan, server huquqi bilan ketadi.

Bu SSRF (Server-Side Request Forgery). OWASP Top 10:2025 da u alohida kategoriya emas: A01 Broken Access Control sahifasida CWE-918 SSRF sifatida ko'rsatilgan. Mantiq ravshan: ichki tarmoqning "tashqaridan kirib bo'lmaydi" himoyasi server orqali aylanib o'tiladi. MITRE'ning 2025 CWE Top 25 ro'yxatida CWE-918 22-o'rinda (CWE reytinglarini o'qish 7-darsda). SSRF'ning cloud muhitidagi og'ir oqibati metadata xizmatiga yetib borishdir: OWASP cheat sheet cloud muhitlarda SSRF ko'pincha metadata xizmatlaridan (AWS, Azure, GCP) credential va token olish uchun ishlatilishini yozadi. Real hodisa (Capital One) 97-darsda case study sifatida ko'riladi; bu darsda mexanizm va himoya.

Ikkinchi muammo: URL'ni tekshirish ko'rinadigandan qiyinroq. Manzil bir necha shaklda yoziladi (o'nlik, o'n oltilik, IPv6, IPv4-mapped), domen nomi ichki IP'ga resolve bo'lishi mumkin, DNS javobi ikki so'rov orasida o'zgarishi mumkin, redirect tekshirilgan manzildan boshqasiga olib boradi. Satr bilan tekshirish bularning hammasida buziladi.

## Asosiy g'oya

### Ikki holat

OWASP SSRF Prevention Cheat Sheet himoyani ikki holatga bo'ladi:

1. Ilova faqat aniq ma'lum, ishonchli servislarga so'rov yuboradi. Bu holatda allow-list ishlatiladi: ruxsat etilgan hostlar (yoki IP'lar) ro'yxati kodda yoki konfiguratsiyada turadi, kiritish shu ro'yxatdan tanlanadi.
2. Ilova har qanday tashqi IP yoki domenga so'rov yubora olishi kerak (masalan, foydalanuvchi o'z webhook manzilini kiritadi). Bu holatda allow-list yo'q, shuning uchun deny-list va qo'shimcha choralar qoladi; cheat sheet deny-listni "oxirgi chora" va aylanib o'tishga moyil deb ataydi.

Qaysi holatdaligingizni birinchi aniqlang. Ko'p funksiyalar aslida birinchi holatga mansub: logotip faqat sizning CDN'dan, hamkor servis esa shartnomadagi domenlardan. Ikkinchi holat (foydalanuvchi o'z webhook manzilini beradi) haqiqiy murakkablik.

### 21-darsdagi modelga bog'lash

Interpreter bu yerda server tomondagi HTTP klient (va uning URL parseri, DNS resolver'i, socket qatlami). Foydalanuvchi qiymati "manzil" bo'lishi kerak edi; u esa qaysi tarmoq segmenti, qaysi protokol, qaysi port ekanini ham belgilayapti. Himoya: manzilni kanonik shaklga keltirish va hal qiluvchi bosqichda (ulanish paytida) tekshirish.

## Chuqurroq: aylanib o'tish yo'llari

### Manzil shakllari

URL parseri (WHATWG `URL`) turli yozuvlarni bitta kanonik IPv4 ga keltiradi: `http://2852039166/` (o'nlik butun son) `169.254.169.254` bo'ladi. IPv6 ichida IPv4 ko'rinishi (`::ffff:169.254.169.254`, NAT64 `64:ff9b::...`) ham xuddi shu xostga olib borishi mumkin. Cheat sheet buni alohida ta'kidlaydi: manzilni solishtirishdan oldin tabiiy IPv4 shaklga keltiring, aks holda faqat IPv4 qatorlarini solishtiradigan tekshiruvdan o'tib ketadi. Shuning uchun tekshiruv matn ustida emas, tahlil qilingan va kanonik manzil ustida bajariladi. Cheat sheet IP formatini tekshiradigan kutubxonalarni (JavaScript uchun `ip-address`) o'nlik (dword), sakkizlik, o'n oltilik va aralash kodlashdagi aylanib o'tishlarga qarshi sinab chiqqanini yozadi, .NET'dagi `IPAddress.TryParse` esa bunday shakllarda aldanishini, shuning uchun allow-list bilan solishtirishda tekshiruvchi funksiyaning chiqish qiymatini ishlatish kerakligini ta'kidlaydi.

### Domen nomi ichki IP'ga ko'rsatishi

Hujumchi o'z domenini ichki IP'ga resolve qiladigan qilib sozlashi mumkin. Shuning uchun faqat host nomini tekshirish yetmaydi: DNS javobidagi barcha IP'lar (A va AAAA) ommaviy diapazonda ekanini tekshirish kerak. Cheat sheet bu yerda ikkinchi muammoni ham ko'rsatadi: DNS javobini alohida tekshirish DNS rebinding'dan himoyalamaydi.

### DNS rebinding

Tekshiruv paytida domen ommaviy IP beradi, HTTP klient keyin qayta resolve qilganda esa ichki IP. Cheat sheet tavsiyasi: tekshirilgan IP manzillarga, faqat ularga ulaning, va asl domen nomini `Host` sarlavhasi, TLS SNI va sertifikat tekshiruvi uchun saqlang. Qayta urinish (retry) va zaxira ulanishlar ham xuddi shu siyosatdan o'tishi kerak. Ya'ni "tekshir, keyin ishlat" orasidagi bo'shliq yopilishi kerak (TOCTOU, 60-dars).

### To'liq URL qabul qilmaslik va parser kelishmovchiligi

Cheat sheet'ning URL bo'limi eng qat'iy tavsiyani beradi: foydalanuvchidan to'liq URL qabul qilmang, chunki URL'ni tekshirish qiyin va parser turli texnologiyalarda aldanishi mumkin. Tarmoq ma'lumoti kerak bo'lsa, faqat tekshirilgan IP yoki domen nomini oling, uni allow-list bilan solishtiring va so'rovni o'zingiz quring: sxema, port va yo'lni ilovaning o'zi belgilaydi, foydalanuvchi URL'idan faqat host olinsa ham, uning yo'li va query qismi nusxalanmaydi. Ikkinchi qoida parser kelishmovchiligi haqida: `http://example.com\@evil.com` satrini WHATWG URL standartiga mos parser (backslash'ni maxsus sxemada yo'l ajratkichi deb biladi) host `example.com` deb o'qiydi, RFC 3986 grammatikasi esa userinfo ichida backslash'ni umuman ruxsat etmaydi va userinfo'ni oxirgi `@` gacha deb oladigan amalga oshirish hostni `evil.com` deb o'qiydi. Cheat sheet xulosasi: hostni barcha ishtirok etayotgan parser bir xil o'qimasa, URL rad etiladi, kelishmovchilikni "to'g'rilashga" urinilmaydi. Amaliy oqibat: URL bir servisda tekshirilib, satr sifatida boshqasiga uzatilib qayta tahlil qilinsa, tekshiruv bir hostni, ulanish boshqasini ko'rishi mumkin. Shuning uchun URL'ni bir marta tahlil qilib, keyin faqat tahlil natijasini (alohida host, port) uzating.

### Redirect

Birinchi manzil tekshiruvdan o'tadi, javob `302` bilan ichki manzilga yo'naltiradi. Cheat sheet tavsiyasi: veb klientda redirect'ni o'chirish. Kerak bo'lsa, har redirect manzili to'liq tekshiruvdan qayta o'tishi shart.

### Sxema va protokol

SSRF faqat HTTP emas. Cheat sheetga ko'ra, birinchi so'rov odatda HTTP, lekin ikkinchi so'rovni ilovaning o'zi yuborsa, boshqa protokol va sxemalar (`file://`, `gopher://` va boshqalar) ishlatilishi mumkin, XXE ham SSRF'ga olib kelishi mumkin. Shuning uchun sxema (`https:`, `http:`) va port allow-list bilan cheklanadi.

### Deny-list: oxirgi chora

Allow-list imkonsiz bo'lsa, deny-list qo'llanadi. Cheat sheet minimal bloklanadigan diapazonlar jadvalini beradi: cloud metadata manzillari (AWS IMDS `169.254.169.254`; GCP `metadata.google.internal`), localhost (`127.0.0.0/8`, `::1`), RFC1918 (`10/8`, `172.16/12`, `192.168/16`), link-local (`169.254.0.0/16`), IPv6 unique local va link-local, multicast, IPv4-mapped IPv6 va NAT64. Jadvalda yana ikki narsa bor: AWS IMDS'ning IPv6 manzili (`fd00:ec2::254`) va link-local diapazon ichidagi ECS vazifa credential'lari (`169.254.170.2`) hamda EKS Pod Identity (`169.254.170.23`) manzillari: `169.254.0.0/16` ni bloklash ularni ham qoplaydi, faqat `169.254.169.254` ni bloklash esa qoplamaydi. Cheat sheet yana bir qoidani qat'iy aytadi: manzilni diapazonlarga solishtirishdan oldin tabiiy IPv4 shaklga keltiring. `::ffff:169.254.169.254` IPv4 shakli bilan bir xil hostga yetadi, NAT64 manzili (`64:ff9b::a9fe:a9fe`) esa NAT64 shlyuzi bor tarmoqlarda; ikkalasi ham faqat IPv4 qatorlarini solishtiradigan tekshiruvdan o'tib ketadi. Ro'yxat to'liq emas va "aylanib o'tishga moyil" degan ogohlantirish bilan keladi.

### Cloud metadata va IMDSv2

Cheat sheet AWS uchun IMDSv2'ni qo'shimcha himoya mexanizmi (defense in depth) sifatida tasvirlaydi: u SSRF'ning ba'zi holatlarini yumshatadi; IMDSv2'ga o'tish va IMDSv1'ni o'chirish tavsiya etiladi. Bu ilovadagi zaiflikni yopmaydi, lekin metadata orqali credential olishni qiyinlashtiradi. Cloud IAM masalasi (minimal huquqli rol) 88-darsda.

### Javobni qayta ishlash va blind SSRF

Ba'zi funksiyalarda hujumchi javob matnini ko'rmaydi, faqat "muvaffaqiyatli" yoki "xato" holatini yoki javob vaqtini biladi (blind SSRF). Bu ham foydali: hujumchi ichki manzillarni qaysi biri ochiq ekani bo'yicha tekshirib chiqishi mumkin. Shuning uchun ichki manzillarga so'rov umuman yuborilmasligi kerak, xato xabarlari esa "ulanib bo'lmadi" kabi umumiy bo'lishi kerak (sabab tafsilotsiz). Javob qaytadigan holatda ham matn, sarlavhalar va statusni to'g'ridan-to'g'ri qaytarmang: faqat kerakli maydonni (masalan, rasm turini va hajmini) tekshirib, qayta ishlangan natijani bering.

### Webhook va ikkinchi holat

Webhook funksiyasi (75-dars) odatda ikkinchi holatga kiradi: foydalanuvchi o'z URL'ini beradi. Bu yerda amaliy yondashuv: URL'ni ro'yxatdan o'tkazishda va har yuborishda tekshirish (ro'yxatdan o'tgan ommaviy manzil keyin ichki IP'ga ko'rsatib qolishi mumkin, rebinding); chiqish uchun alohida tarmoq segmenti yoki proxy ishlatish; yuboriladigan ma'lumotni imzolash va javobni e'tiborsiz qoldirish. Proxy yondashuvida ichki tarmoqqa chiqish proxy darajasida taqiqlanadi va ilova kodidagi xato ichki servislarga yetmaydi. Cheat sheet ikkinchi holat uchun yana bir himoyani ham tasvirlaydi: qabul qiluvchi tomon so'rov qonuniy boshlanganini isbotlovchi tasodifiy token (masalan, 20 belgili) kutadi va faqat HTTP POST qabul qiladi. Shunda so'rovni ichki servisga qaratgan hujumchi ham tokenni bilmagani uchun amalni bajara olmaydi. Bu yondashuv qabul qiluvchi servislarni o'zgartirishni talab qiladi, shuning uchun ichki servislar uchun ham (oddiy GET orqali ishlaydigan ichki endpoint'lar bo'lmasligi uchun) foydali. Doimiy so'rov oqimi uchun cheat sheet validatsiya tartibini ham beradi: kiritishni formatga tekshirish, so'ng IP yoki domen ommaviy ekanini tekshirish (domen uchun barcha A va AAAA yozuvlari), protokolni `HTTP`/`HTTPS` ro'yxatiga solishtirish, so'rovni faqat tekshirilgan ma'lumotdan yig'ish va tekshirilgan IP'ga ulanish, redirect'ni o'chirish.

### Tarmoq darajasidagi chegara

Ilova tekshiruvi xato qilishi mumkin, shuning uchun chegara tarmoqda ham bo'lishi kerak. Cloud va Kubernetes muhitida chiquvchi (egress) trafik siyosati ilova podiga faqat kerakli manzillarga chiqishga ruxsat beradi. Metadata servisiga kirish xost yoki pod darajasida ham cheklanishi mumkin; cheat sheet shu qatlamdan AWS uchun IMDSv2 ga o'tish va IMDSv1 ni o'chirishni tavsiya qiladi. Bunday ikki qatlam hujumchining ishini qiyinlashtiradi: ilova xatosi alohida, tarmoq alohida to'siq.

## Misol: mini tarmoq modelida

Haqiqiy tarmoqqa tegmaslik uchun model: `resolve` DNS jadvali (bitta domen ikkinchi chaqiruvda ichki IP beradi: rebinding), `connect` esa IP bo'yicha xotiradagi servislar. Metadata javobi o'quv matni, haqiqiy credential emas.

### 1. Zaif kod

```ts run
let rebindCalls = 0;
function resolve(host: string): string[] {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith("[")) return [host];
  if (host === "rebind.test") return rebindCalls++ === 0 ? ["93.184.216.35"] : ["10.0.0.5"];
  const table: Record<string, string[]> = { "cdn.alfa.test": ["93.184.216.34"], "evil.test": ["10.0.0.5"] };
  return table[host] ?? [];
}
const SERVICES: Record<string, string> = {
  "93.184.216.34": "logo.png (200 OK)",
  "93.184.216.35": "logo.png (200 OK)",
  "10.0.0.5": "ichki admin paneli",
  "127.0.0.1": "localhost servisi",
  "169.254.169.254": "cloud metadata: vaqtinchalik kalitlar (model)",
};
function toV4(ip: string): string {
  const m = /^\[::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})\]$/i.exec(ip);
  if (!m) return ip;
  const a = parseInt(m[1], 16), b = parseInt(m[2], 16);
  return [a >> 8, a & 255, b >> 8, b & 255].join(".");
}
const connect = (ip: string) => SERVICES[toV4(ip)] ?? "ulanish xatosi";

// ZAIF: faqat sxema va "ichki" so'zi tekshiriladi, keyin hostga ulanadi
function importLogoWeak(raw: string): string {
  if (!/^https?:\/\//.test(raw) || /localhost|127\.0\.0\.1/.test(raw)) return "rad etildi";
  const u = new URL(raw);
  return connect(resolve(u.hostname)[0]);
}

console.log("oddiy:", importLogoWeak("https://cdn.alfa.test/logo.png"));
```

```text
oddiy: logo.png (200 OK)
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu SSRF usuli faqat shu darsning o'quv kodiga qarshi ko'rsatilgan; uni faqat o'z tizimingizda yoki yozma ruxsat bilan, kelishilgan doirada qo'llang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

"alfa" foydalanuvchisi logotip URL maydoniga CDN o'rniga to'rt xil manzil yuboradi. Faqat shu o'quv modeliga qarshi.

```ts run
let rebindCalls = 0;
function resolve(host: string): string[] {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith("[")) return [host];
  if (host === "rebind.test") return rebindCalls++ === 0 ? ["93.184.216.35"] : ["10.0.0.5"];
  const table: Record<string, string[]> = { "cdn.alfa.test": ["93.184.216.34"], "evil.test": ["10.0.0.5"] };
  return table[host] ?? [];
}
const SERVICES: Record<string, string> = {
  "93.184.216.34": "logo.png (200 OK)",
  "93.184.216.35": "logo.png (200 OK)",
  "10.0.0.5": "ichki admin paneli",
  "127.0.0.1": "localhost servisi",
  "169.254.169.254": "cloud metadata: vaqtinchalik kalitlar (model)",
};
function toV4(ip: string): string {
  const m = /^\[::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})\]$/i.exec(ip);
  if (!m) return ip;
  const a = parseInt(m[1], 16), b = parseInt(m[2], 16);
  return [a >> 8, a & 255, b >> 8, b & 255].join(".");
}
const connect = (ip: string) => SERVICES[toV4(ip)] ?? "ulanish xatosi";
function importLogoWeak(raw: string): string {
  if (!/^https?:\/\//.test(raw) || /localhost|127\.0\.0\.1/.test(raw)) return "rad etildi";
  const u = new URL(raw);
  return connect(resolve(u.hostname)[0]);
}

for (const url of [
  "http://169.254.169.254/latest/meta-data/",
  "http://2852039166/",
  "http://[::ffff:a9fe:a9fe]/",
  "http://evil.test/",
  "http://127.0.0.1/",
]) {
  console.log(url.padEnd(42), "->", importLogoWeak(url));
}
```

```text
http://169.254.169.254/latest/meta-data/   -> cloud metadata: vaqtinchalik kalitlar (model)
http://2852039166/                         -> cloud metadata: vaqtinchalik kalitlar (model)
http://[::ffff:a9fe:a9fe]/                 -> cloud metadata: vaqtinchalik kalitlar (model)
http://evil.test/                          -> ichki admin paneli
http://127.0.0.1/                          -> rad etildi
```

Birinchi so'rov metadata manzilini to'g'ridan-to'g'ri yozdi, va bu tekshiruvda ko'zda tutilmagan. Keyingi uch shakl (o'nlik, IPv4-mapped IPv6, ichki IP'ga resolve bo'ladigan domen) bir xil manzilga olib bordi. Oxirgi `127.0.0.1` filtrga tushdi: tekshiruv faqat o'sha satrni bilardi. Filtr bitta shaklni yopib, qolganlarini ochiq qoldirdi.

### 3. Tuzatilgan kod

Tuzatish: URL'ni parser bilan kanonik shaklga keltirish, sxema va portni cheklash, DNS javobining hammasi ommaviy ekanini tekshirish va tekshirilgan IP'ning o'ziga ulanish (pinning). Taqqoslash uchun "tekshir, so'ng qayta resolve qil" xatosi ham ko'rsatiladi.

```ts run
let rebindCalls = 0;
function resolve(host: string): string[] {
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith("[")) return [host];
  if (host === "rebind.test") return rebindCalls++ === 0 ? ["93.184.216.35"] : ["10.0.0.5"];
  const table: Record<string, string[]> = { "cdn.alfa.test": ["93.184.216.34"], "evil.test": ["10.0.0.5"] };
  return table[host] ?? [];
}
const SERVICES: Record<string, string> = {
  "93.184.216.34": "logo.png (200 OK)",
  "93.184.216.35": "logo.png (200 OK)",
  "10.0.0.5": "ichki admin paneli",
  "127.0.0.1": "localhost servisi",
  "169.254.169.254": "cloud metadata: vaqtinchalik kalitlar (model)",
};
function toV4(ip: string): string {
  const m = /^\[::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})\]$/i.exec(ip);
  if (!m) return ip;
  const a = parseInt(m[1], 16), b = parseInt(m[2], 16);
  return [a >> 8, a & 255, b >> 8, b & 255].join(".");
}
const connect = (ip: string) => SERVICES[toV4(ip)] ?? "ulanish xatosi";

function isPublicV4(ip: string): boolean {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false;
  const [a, b] = p;
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && b === 168) return false;
  return true;
}

// Tuzatilgan: tekshirilgan IP'ning o'ziga ulanadi
function importLogo(raw: string): string {
  let u: URL;
  try { u = new URL(raw); } catch { return "rad etildi: URL emas"; }
  if (u.protocol !== "http:" && u.protocol !== "https:") return "rad etildi: sxema";
  if (u.port !== "" && u.port !== "80" && u.port !== "443") return "rad etildi: port";
  const ips = resolve(u.hostname).map(toV4);
  if (ips.length === 0 || !ips.every(isPublicV4)) return "rad etildi: ichki manzil";
  return connect(ips[0]); // qayta resolve yo'q
}
// Xato variant: tekshiradi, keyin qayta resolve qiladi
function importLogoRebind(raw: string): string {
  const u = new URL(raw);
  if (!resolve(u.hostname).map(toV4).every(isPublicV4)) return "rad etildi: ichki manzil";
  return connect(resolve(u.hostname)[0]);
}

for (const url of ["https://cdn.alfa.test/logo.png", "http://169.254.169.254/latest/meta-data/", "http://2852039166/", "http://[::ffff:a9fe:a9fe]/", "http://evil.test/", "file:///etc/passwd", "https://cdn.alfa.test:6379/"]) {
  console.log(url.padEnd(42), "->", importLogo(url));
}
console.log("rebinding, tekshir-keyin-resolve:", importLogoRebind("http://rebind.test/"));
rebindCalls = 0;
console.log("rebinding, pinning bilan:        ", importLogo("http://rebind.test/"));
```

```text
https://cdn.alfa.test/logo.png             -> logo.png (200 OK)
http://169.254.169.254/latest/meta-data/   -> rad etildi: ichki manzil
http://2852039166/                         -> rad etildi: ichki manzil
http://[::ffff:a9fe:a9fe]/                 -> rad etildi: ichki manzil
http://evil.test/                          -> rad etildi: ichki manzil
file:///etc/passwd                         -> rad etildi: sxema
https://cdn.alfa.test:6379/                -> rad etildi: port
rebinding, tekshir-keyin-resolve: ichki admin paneli
rebinding, pinning bilan:         logo.png (200 OK)
```

Nima uchun yetarli: invariant "ulanish faqat tekshirilgan ommaviy IPv4 manzilga" parser, kanonizatsiya (`toV4`) va ulanishda bir xil manzildan foydalanish bilan ta'minlandi. O'nlik, IPv6-mapped va ichki IP'ga ko'rsatuvchi domen shakllari yopildi; `file:` sxemasi va noodatiy port rad etildi; rebinding'da `importLogoRebind` ichki servisga yetdi, `importLogo` esa tekshirilgan IP'ga ulangani uchun yetmadi. Yopilmagan: redirect (modelda klient redirect'ni kuzatmaydi, real HTTP klientda o'chirish yoki qayta tekshirish kerak), javob hajmi va vaqti cheklovi, IPv6 manzillarni to'liq qamrab olish (model boshqa IPv6 shakllarini rad etadi), allow-list bo'lsa yaxshiroq ekani. Modelda ayrim shartlarni soddalashtirdik: real DNS, TLS va SNI qo'llab-quvvatlash kod darajasida kutubxonaga bog'liq.

## Qachon qo'llamaslik kerak

- Manzillar aniq ma'lum bo'lsa, deny-list yozmang: allow-list sodda va ishonchli. Deny-list ro'yxati to'liq bo'lmaydi va yangi diapazonlar paydo bo'lishi bilan eskiradi.
- IP tekshiruvini ilova ichida yagona himoya qilmang. Tarmoq darajasidagi nazorat (egress firewall, security group, alohida tarmoq segmenti, proxy) ilova xatosi bo'lganda ham ishlaydi. SSRF uchun eng ishonchli sxema: ilova servisi faqat zarur manzillarga chiqa oladigan tarmoqda ishlaydi.
- IMDSv2'ga ishonib SSRF'ni ahamiyatsiz deb hisoblamang. U bitta maqsadni (metadata) qiyinlashtiradi, qolgan ichki servislar ochiq qoladi.
- Foydalanuvchi bergan URL'ni umuman olishdan voz kechish mumkinmi, deb so'rang. Logotip uchun URL o'rniga fayl yuklashni (74-dars) ishlatish SSRF yuzasini butunlay olib tashlaydi.
- Webhook (75-dars) kabi haqiqiy zarur ikkinchi holatda ham, URL'dan tashqari yuboriladigan ma'lumot va qaytariladigan javob (xato matni, hajm) hujumchiga ichki tarmoq haqida ma'lumot bermasligi kerak. "Blind" SSRF'da ham tarmoq xaritasi chiqarilishi mumkin.

## Stack'da: Node.js

Node.js'da tekshirilgan IP'ga ulanish uchun `http.request` / `https.request` ning `lookup` opsiyasini almashtirish mumkin: Node hujjati `lookup` ni "custom lookup function" (default `dns.lookup()`) deb ta'riflaydi va ulanish paytida shu funksiya chaqiriladi. Muhim nozik joy: `net.connect` da `autoSelectFamily` yoqilgan bo'lsa, `lookup` ga `all: true` beriladi va u manzillar massivini kutadi; `all: false` bo'lsa bitta manzil va oila. Shuning uchun maxsus `lookup` ikkala shaklni ham qo'llab-quvvatlashi kerak. Quyidagi kod ishga tushirilmaydi (`node:dns` va `node:https` brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi jihatidan tekshirilgan.

```ts
import { lookup } from "node:dns";
import { request } from "node:https";
import { isIP } from "node:net";

function isPublic(ip: string): boolean {
  // production'da tekshirilgan kutubxona (masalan, ip-address); bu yerda g'oya xolos
  return isIP(ip) === 4 && !/^(0|10|127)\.|^169\.254\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^2(2[4-9]|[3-5]\d)\./.test(ip);
}

type Cb = (err: Error | null, address: string | { address: string; family: number }[], family?: number) => void;

// Ulanish aynan shu tekshirilgan manzilga qilinadi: tekshiruv va ulanish orasida ikkinchi resolve yo'q
function pinnedLookup(hostname: string, options: { all?: boolean }, cb: Cb): void {
  lookup(hostname, { ...options, all: true }, (err, addrs) => {
    if (err) return cb(err, []);
    if (addrs.length === 0 || !addrs.every((a) => isPublic(a.address))) {
      return cb(new Error("ichki manzilga ruxsat yo'q"), []);
    }
    if (options.all) return cb(null, addrs);
    cb(null, addrs[0].address, addrs[0].family);
  });
}

const ALLOWED_HOSTS = new Set(["cdn.alfa.test"]);
const MAX_BYTES = 1_000_000;

export function importLogo(raw: string): Promise<Buffer> {
  const u = new URL(raw);
  if (u.protocol !== "https:" || !ALLOWED_HOSTS.has(u.hostname)) {
    return Promise.reject(new Error("manzil ruxsat etilmagan"));
  }
  return new Promise((resolve, reject) => {
    const req = request(u, { lookup: pinnedLookup, timeout: 5_000 }, (res) => {
      if ((res.statusCode ?? 0) >= 300 && (res.statusCode ?? 0) < 400) {
        res.resume();
        return reject(new Error("redirect kuzatilmaydi"));
      }
      const chunks: Buffer[] = [];
      let size = 0;
      res.on("data", (c: Buffer) => {
        size += c.length;
        if (size > MAX_BYTES) return req.destroy(new Error("hajm chegarasi"));
        chunks.push(c);
      });
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}
```

Bu yerda uch qatlam: allow-list (`ALLOWED_HOSTS`), ulanish paytidagi IP tekshiruvi (`pinnedLookup`) va resurs cheklovlari (vaqt, hajm). `http`/`https` moduli redirect'ni o'zi kuzatmaydi; kod 3xx javobni xato deb hisoblaydi, ya'ni cheat sheet tavsiya qilgan "redirect'ni o'chirish" shu yerda amalga oshgan. TLS sertifikat tekshiruvi va SNI asl host nomi bilan qoladi, chunki `lookup` faqat manzilni almashtiradi, `hostname` o'zgarmaydi. Foydalanuvchi o'zi manzil kiritadigan holatda (ikkinchi holat) allow-list olib tashlanadi, ulanish paytidagi IP tekshiruvi esa qoladi. Kubernetes yoki cloud'da bu qatlam tarmoq siyosati bilan (egress cheklovi, 87-dars) to'ldiriladi. `autoSelectFamily` yoqilganda (Node hujjatiga ko'ra bu opsiya default qiymati `net.getDefaultAutoSelectFamily()` dan olinadi) barcha manzillar tekshirilgani uchun bitta ichki manzil ham ulanishni to'xtatadi.

## Xulosa

- SSRF - server foydalanuvchi bergan manzilga o'z huquqi bilan so'rov yuborishi; OWASP Top 10:2025 da CWE-918 sifatida A01 Broken Access Control ichida.
- Avval qaysi holatdaligingizni aniqlang: ishonchli manzillar ro'yxati bor (allow-list) yoki yo'q (deny-list oxirgi chora sifatida).
- Tekshiruv matn ustida emas, tahlil qilingan va kanonik manzil ustida: o'nlik, IPv6 va IPv4-mapped shakllar bir xil manzilga keltiriladi; domenning hamma DNS javobi tekshiriladi.
- DNS rebinding va redirect tekshiruvni chetlab o'tadi: tekshirilgan IP'ga ulaning, redirect'ni o'chiring yoki har bosqichda qayta tekshiring.
- Sxema, port, hajm va vaqtni cheklang; IMDSv2 va egress tarmoq siyosati qo'shimcha qatlamlar, ilova tekshiruvining o'rnini bosmaydi.
- Eng ishonchli yechim - URL bo'yicha so'rov yuborishning o'zidan voz kechish yoki manzillarni aniq ro'yxat bilan cheklash.
