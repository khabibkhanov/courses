---
n: 22
slug: sql-injection
title: "SQL injection: turlari va parametrlangan so'rovlar"
summary: "SQL injection turlari (in-band, blind, out-of-band, ikkinchi tartibli), nega parametrlangan so'rov ishlaydi, uning chegaralari (identifikatorlar, LIKE, IN ro'yxati), minimal huquq va PostgreSQL bilan ishlaydigan Node.js kodi. Zaif kod, hujum va tuzatish Python sqlite3 da ishga tushiriladi."
duration: 50
sources:
  - id: cs-sqli
    note: "SQL Injection Prevention Cheat Sheet: Primary Defenses (parametrlangan so'rov, tuzilma qismlari uchun qat'iy allow-list), qo'lda escape qilish qat'iy tavsiya etilmaydi, Least Privilege bo'limi, saqlangan protsedura ichidagi SQL injection"
  - id: t10-a05
    note: "A05 Injection: SQL injection kategoriya tavsifida; parametrlangan bo'lsa ham saqlangan protsedura ichida konkatenatsiya zaiflik beradi; jadval va ustun nomlarini escape qilib bo'lmaydi"
  - id: pg-auth
    note: "PostgreSQL hujjati, Client Authentication bobi: pg_hba.conf orqali qaysi host, baza va rol qaysi autentifikatsiya usuli bilan ulana olishini belgilash; ilova uchun alohida rol bilan ulanish shu sozlamaga tayanadi"
  - id: asvs
    note: "ASVS 5.0.0 talab 1.2.4: ma'lumotlar bazasi so'rovlari (SQL, HQL, NoSQL, Cypher) parametrlangan so'rovlar, ORM yoki boshqa himoya bilan yozilishi kerak (Level 1)"
quiz:
  - q: "Hujumchi so'rov natijasini ko'ra olmaydi, faqat sahifa \"topildi\" yoki \"topilmadi\" deb javob beradi. U `AND (SELECT substr(key,1,1) FROM api WHERE id=1)='a'` qo'shib, javobning o'zgarishiga qarab ma'lumotni belgilab-belgilab o'qiyapti. Bu qaysi tur?"
    options:
      - "In-band UNION injection"
      - "Boolean-based blind injection"
      - "Out-of-band injection"
      - "Ikkinchi tartibli injection"
    answer: 1
    explain: "Natija to'g'ridan-to'g'ri qaytmaydi, ma'lumot ikki holatli javob (topildi yoki yo'q) orqali bitma-bit chiqariladi: bu boolean-based blind. UNION natijani javobga qo'shadi; out-of-band boshqa kanal (masalan, DNS) ishlatadi; ikkinchi tartibli hujum saqlangan qiymat orqali keyinroq ishga tushadi."
  - q: "`pool.query('SELECT * FROM vehicles WHERE plate = $1', [plate])` nega `plate = \"x' OR '1'='1\"` bilan ishlamaydi?"
    options:
      - "Drayver apostrofni o'chirib tashlaydi"
      - "Qiymat so'rov matnidan alohida uzatiladi va faqat qiymat sifatida ishlatiladi, SQL sintaksisi sifatida o'qilmaydi"
      - "PostgreSQL `OR` kalit so'zini bloklaydi"
      - "Drayver qiymatni hash'laydi"
    answer: 1
    explain: "So'rov matni (struktura) va qiymatlar alohida kanalda boradi. Server strukturani avval tahlil qiladi, qiymat esa tayyor tuzilmaga faqat ma'lumot sifatida joylashadi. Drayver apostrofni o'chirmaydi va hash qilmaydi; kalit so'zlar bloklanmaydi."
  - q: "Mijoz `sort=lastSeen` yuboradi va kod `ORDER BY ${sort}` yasaydi. Qaysi tuzatish yetarli?"
    options:
      - "`ORDER BY $1` va `[sort]` parametri"
      - "`sort` ichidagi `'` belgilarini olib tashlash"
      - "`sort` ni ruxsat etilgan nomlar xaritasi orqali ustun nomiga aylantirish, noma'lum qiymat uchun standart ustun"
      - "`sort` ni `toLowerCase()` qilish"
    answer: 2
    explain: "Ustun nomi parametr bo'la olmaydi: `ORDER BY $1` doimiy qiymat bo'yicha tartiblaydi yoki xato beradi. Apostrofni olib tashlash va lowercase identifikator kontekstida hech narsani yopmaydi. Allow-list nomni kodda yozilgan qiymatlardan tanlaydi."
  - q: "Saqlangan protsedura (stored procedure) ichida `EXECUTE 'SELECT ... WHERE name = ''' || p_name || ''''` yozilgan. Ilova protseduraga parametr bilan murojaat qiladi. Xavfsizmi?"
    options:
      - "Xavfsiz: ilova parametr ishlatyapti"
      - "Xavfsiz: saqlangan protsedura har doim xavfsiz"
      - "Xavfsiz emas: protsedura ichida SQL yana matn qo'shish bilan yig'ilgan, injection bazaning ichida yuz beradi"
      - "Faqat hujumchi bazaga to'g'ridan-to'g'ri ulansa xavfli"
    answer: 2
    explain: "Chegara protsedura ichida: dinamik SQL matni parametr qiymati bilan yig'ilgan. Ilovadagi parametr faqat protseduraga qiymat uzatadi, protsedura ichidagi konkatenatsiyani tuzatmaydi. Protsedura ichida ham parametrlangan dinamik SQL (`USING`) ishlatilishi kerak."
  - q: "Foydalanuvchi ism sifatida `a%` kiritdi va qidiruv `LIKE $1 || '%'` bilan parametrlangan. Natija ko'p ma'lumot qaytardi. Bu SQL injection'mi?"
    options:
      - "Ha: parametr ishlamadi"
      - "Yo'q va muammo ham yo'q: LIKE to'g'ri ishlaydi"
      - "Yo'q: bu SQL sintaksisini o'zgartirmaydi, lekin LIKE wildcard'lari qiymatda ma'noga ega; maqsadga qarab `%` va `_` ni escape qilish kerak"
      - "Ha: `%` SQL kalit so'zi"
    answer: 2
    explain: "Parametr SQL strukturasini himoya qildi, lekin LIKE operatori qiymat ichidagi `%` va `_` ni o'zi talqin qiladi. Bu injection emas, ammo kutilmagan keng qidiruv va resurs sarfiga olib kelishi mumkin. Kerak bo'lsa wildcard'lar escape qilinadi."
  - q: "Ilova bazaga DDL huquqli (CREATE/DROP) rol bilan ulanadi. Parametrlangan so'rovlar bor, faqat bitta eski endpoint'da konkatenatsiya qolgan. Minimal huquq bu yerda nima beradi?"
    options:
      - "Hujum o'tgan taqdirda zararni cheklaydi (jadvalni o'chirish yoki sxemani o'zgartirish imkoni bo'lmaydi), lekin ma'lumotni o'qishni to'xtatmaydi"
      - "Konkatenatsiyani to'liq xavfsiz qiladi"
      - "Hujumni to'xtatadi"
      - "Hech narsa: huquq SQL injection'ga ta'sir qilmaydi"
    answer: 0
    explain: "Minimal huquq zarar kattaligini kamaytiradi: oddiy rol DROP qila olmaydi. Lekin SELECT huquqi bo'lsa, injection orqali ma'lumot baribir o'qiladi. Asosiy chora konkatenatsiyani bartaraf etish."
task:
  title: "So'rov quruvchi: parametr va allow-list"
  prompt: |
    `buildVehicleQuery(tenantId, filters)` mashinalar ro'yxati uchun `{ text, values }` qaytaradi (node-postgres formati: `$1`, `$2` va qiymatlar massivi). Hozir u `status` va `sort` ni to'g'ridan-to'g'ri matnga qo'shadi.

    Tuzating: `tenantId` va `status` (agar berilgan bo'lsa) hamda `minFuel` (agar berilgan bo'lsa) qiymatlar sifatida `values` ga tushsin va matnda `$1`, `$2`, ... bo'lsin. `sort` faqat `plate` yoki `lastSeen` bo'lishi mumkin: `plate` -> `plate`, `lastSeen` -> `last_seen_at`; boshqa har qanday qiymat uchun `plate`. `minFuel` raqam bo'lmasa, shart qo'shilmasin. Tenant sharti har doim bo'lsin. Imzoni o'zgartirmang. Oxirgi chiqishlarda hujum qiymatlari matnga tushmaganini va `values` da turganini ko'rasiz.
  lang: ts
  starter: |
    type Filters = { status?: string; minFuel?: unknown; sort?: string };

    function buildVehicleQuery(tenantId: string, f: Filters): { text: string; values: unknown[] } {
      let text = `SELECT id, plate FROM vehicles WHERE tenant_id = '${tenantId}'`;
      if (f.status) text += ` AND status = '${f.status}'`;
      if (f.minFuel !== undefined) text += ` AND fuel >= ${f.minFuel}`;
      text += ` ORDER BY ${f.sort ?? "plate"}`;
      return { text, values: [] };
    }

    const a = buildVehicleQuery("alfa", { status: "active", minFuel: 20, sort: "lastSeen" });
    console.log(a.text);
    console.log(a.values);

    const b = buildVehicleQuery("alfa", { status: "x' OR '1'='1", minFuel: "0; DROP TABLE vehicles", sort: "plate; DROP TABLE vehicles" });
    console.log(b.text);
    console.log(b.values);
    console.log("matnda hujum izi bormi:", /DROP|OR '1'/.test(b.text));
  solution: |
    type Filters = { status?: string; minFuel?: unknown; sort?: string };

    const SORT: Record<string, string> = { plate: "plate", lastSeen: "last_seen_at" };

    function buildVehicleQuery(tenantId: string, f: Filters): { text: string; values: unknown[] } {
      const values: unknown[] = [tenantId];
      let text = "SELECT id, plate FROM vehicles WHERE tenant_id = $1";
      if (f.status) {
        values.push(f.status);
        text += ` AND status = $${values.length}`;
      }
      const fuel = Number(f.minFuel);
      if (f.minFuel !== undefined && f.minFuel !== "" && Number.isFinite(fuel)) {
        values.push(fuel);
        text += ` AND fuel >= $${values.length}`;
      }
      const col = f.sort !== undefined && Object.hasOwn(SORT, f.sort) ? SORT[f.sort] : SORT.plate;
      text += ` ORDER BY ${col}`;
      return { text, values };
    }

    const a = buildVehicleQuery("alfa", { status: "active", minFuel: 20, sort: "lastSeen" });
    console.log(a.text);
    console.log(a.values);

    const b = buildVehicleQuery("alfa", { status: "x' OR '1'='1", minFuel: "0; DROP TABLE vehicles", sort: "plate; DROP TABLE vehicles" });
    console.log(b.text);
    console.log(b.values);
    console.log("matnda hujum izi bormi:", /DROP|OR '1'/.test(b.text));
  solutionNotes: |
    - Qiymatlar (`tenantId`, `status`, `minFuel`) faqat `values` ga tushadi; matnda faqat `$n` tartib raqamlari bor. Matnga qo'shiladigan yagona o'zgaruvchi qism - `col`, u esa kodda yozilgan ikki qiymatdan biri.
    - `Object.hasOwn(SORT, ...)` ishlatiladi: oddiy `SORT[f.sort]` `"constructor"` yoki `"__proto__"` kabi kalitlarda prototip qiymatini qaytarardi (29-dars).
    - `minFuel` raqamga aylantirilib `Number.isFinite` bilan tekshiriladi. `"0; DROP ..."` raqam emas, shart tushib qoladi. Bo'sh satr `Number("") === 0` bo'lgani uchun alohida rad etilgan.
    - Bu tuzatish ma'no jihatidan tekshirmaydi: `status` qiymati haqiqiy status ekanini enum bilan tekshirish alohida validatsiya (72-dars). `tenantId` serverdagi sessiyadan olinishi kerak (55-dars).
  checklist:
    - "Matnda foydalanuvchi qiymati yo'q, faqat `$n` va allow-list ustun nomi"
    - "`values` massivi tartibi `$n` raqamlariga mos"
    - "Noma'lum `sort` qiymati `plate` ga tushadi"
    - "Raqam bo'lmagan `minFuel` sharti qo'shilmaydi"
    - "Tenant sharti har doim bor"
---

## Muammo

SQL injection eng eski va eng yaxshi o'rganilgan zaifliklardan biri, lekin hamon uchraydi (CWE reytinglari va ularning tartibi 7-darsda). Sabab texnik emas, odatiy: SQL matn qo'shish bilan yig'ish oson, parametr bilan yig'ish esa bir oz ko'proq kod talab qiladi. Prototip bosqichida yozilgan `SELECT ... WHERE name = '${name}'` production'ga o'tib ketadi, chunki u ishlaydi, test ma'lumotlari bilan o'tadi, code review'da esa "ichki endpoint" deb e'tiborsiz qoladi.

Ikkinchi muammo: dasturchilar SQL injection'ni bitta hiyla deb o'ylaydi (`' OR 1=1 --`). Aslida u bir necha tur: natijani to'g'ridan-to'g'ri qaytaradigan, faqat "ha yoki yo'q" javobi beradigan, vaqt farqi orqali ma'lumot chiqaradigan, saqlangan ma'lumot orqali keyinroq ishga tushadigan. Turini bilmasangiz, "bizda xato xabari yashirilgan, demak xavfsiz" degan xulosaga kelasiz: bu faqat bir turni qiyinlashtiradi.

Bu darsda mexanizm 21-darsdagi modelga qaytariladi, lekin real ma'lumotlar bazasi (SQLite, Python orqali) bilan ishlaymiz. Keyin parametrlangan so'rov nima uchun ishlashini, uning o'zi qaysi joylarda yetmasligini (identifikatorlar, `LIKE`, `IN` ro'yxati) va Node.js'da PostgreSQL bilan to'g'ri qo'llanishini ko'rsatamiz.

## Asosiy g'oya

### Injection mexanizmi SQL'da

SQL so'rovi bazaga matn bo'lib boradi. Baza uni tahlil qiladi (parse), reja tuzadi va bajaradi. Agar so'rov matnining ichiga foydalanuvchi qiymati qo'shilgan bo'lsa, tahlil bosqichi qiymatni ham ko'radi va uning ichidagi apostrof satr literalini yopadi, qolgan matn esa SQL sifatida o'qiladi. Natijada hujumchi `WHERE` shartini kengaytirishi, boshqa jadvaldan `UNION` bilan ma'lumot qo'shishi yoki so'rov oxirini izohga aylantirishi mumkin. Bu 21-darsda ko'rgan "kanal birlashishi" ning aynan o'zi.

### Parametrlangan so'rov: struktura va qiymat alohida

Parametrlangan (prepared) so'rovda matn faqat strukturani o'z ichiga oladi (`WHERE plate = $1`), qiymat esa alohida uzatiladi. Tahlil strukturada bajariladi, qiymat unga tayyor tuzilmaning bo'sh joyiga ma'lumot sifatida qo'yiladi va qayta tahlil qilinmaydi. Shuning uchun qiymat ichidagi apostrof, `--` yoki `OR` hech qanday ma'noga ega emas. Parametrlash SQL'da qiymat o'rnini himoya qiladi. OWASP SQL Injection Prevention Cheat Sheet'ning Primary Defenses bo'limi ham shuni aytadi: qiymatlar uchun parametrlangan so'rovlar, parametrlab bo'lmaydigan tuzilma qismlari (jadval, ustun nomlari, saralash yo'nalishi) uchun ilovaga tegishli qat'iy qiymatlar ro'yxati (allow-list); qo'lda escape qilish esa xatoga moyil va qat'iy tavsiya etilmaydi. Minimal huquq alohida bo'lim.

ASVS 5.0.0 ham (talab 1.2.4, Level 1) ma'lumotlar bazasi so'rovlari parametrlangan so'rovlar yoki ORM bilan yozilishini talab qiladi.

Node.js'da `pg` (node-postgres) kutubxonasida `client.query(text, values)` qiymatlarni `$1`, `$2` bilan bog'laydi. Prisma'ning `findMany`, `create` kabi metodlari va Kysely'ning `where("plate", "=", value)` qurilmasi ham qiymatlarni parametr sifatida yuboradi. Xavf raw so'rov API'larida paydo bo'ladi (23-dars).

## Chuqurroq: turlar va nozik holatlar

### SQL injection turlari

| Tur | Hujumchi nimani ko'radi | Xususiyat |
|---|---|---|
| In-band (UNION, error-based) | Natija yoki xato xabari to'g'ridan-to'g'ri javobda | Eng oson; xato xabarini yashirish faqat error-based'ni qiyinlashtiradi |
| Blind SQL injection (boolean) | Faqat javob farqi (topildi yoki yo'q) | Ma'lumot bitma-bit chiqariladi; ko'p so'rov kerak |
| Blind SQL injection (time-based) | Faqat javob vaqti | Hujum ko'rinadigan farq bermaydigan joyda ishlaydi |
| Out-of-band | Boshqa kanal (masalan, DNS so'rovi) | Bazaning tashqi so'rov yuborishiga bog'liq |
| Ikkinchi tartibli | Saqlangan qiymat keyinroq ishlatilganda | Kiritish joyida hech narsa sezilmaydi |

Blind SQL injection ikki holatli signalga tayanadi: sahifa mazmuni yoki javob vaqti. Hujumchi har so'rovda bitta mantiqiy savol beradi ("kalitning birinchi belgisi `k`mi?") va javobdan bitta bit oladi. Shuning uchun kalitni to'liq chiqarish uchun ko'p so'rov kerak, lekin bu avtomatlashtiriladi va rate limit (73-dars) bo'lmasa to'sqinlik qilmaydi. Mexanizmning sababi esa in-band turdagi bilan bir xil: qiymat so'rov strukturasiga aralashgan.

Muhim xulosa: xato xabarlarini yashirish, WAF, "ichki endpoint" bu tuzatish emas. Blind turlar xatosiz ham ishlaydi, shuning uchun sabab (konkatenatsiya) yopilishi kerak.

### Parametr nimani yopmaydi

1. Identifikatorlar. Ustun, jadval, `ORDER BY` yo'nalishi (`ASC`/`DESC`) parametr bo'la olmaydi. Ular uchun kodda yozilgan xarita: `{ plate: "plate", lastSeen: "last_seen_at" }`. Kiritish xaritaning kaliti sifatida tanlanadi, qiymati so'rovga qo'shiladi. Xaritadan qidirishda `Object.hasOwn` ishlating (29-dars).
2. `LIKE` wildcard'lari. Parametrlangan `LIKE $1` da qiymatdagi `%` va `_` baribir wildcard. Bu injection emas, lekin foydalanuvchi butun jadvalni skanerlatishi mumkin. Kerak bo'lsa wildcard'larni escape qiling (`ESCAPE` bilan) va natija sonini cheklang.
3. `IN` ro'yxati. O'zgaruvchan uzunlikdagi ro'yxatni `IN (${ids.join(",")})` bilan qo'shmang. PostgreSQL'da `= ANY($1)` va massiv parametri bor; boshqa bazalarda `?` soni ro'yxat uzunligiga qarab yig'iladi (qiymatlar baribir parametr).
4. Saqlangan protsedura ichidagi dinamik SQL. Protsedura ilovadan parametr olishi uni xavfsiz qilmaydi: ichkarida SQL matn qo'shish bilan yig'ilsa, injection bazaning o'zida bo'ladi. Dinamik SQL ham parametrli bo'lishi kerak (PL/pgSQL'da `EXECUTE ... USING`).
5. Ikkinchi tartibli injection. Qiymat bir marta parametr bilan saqlanadi, keyin boshqa joyda matn bilan so'rovga qo'shiladi. Har so'rov o'z chegarasida parametrlanishi kerak.

### Qo'shimcha qatlamlar

- Minimal huquq. Ilova DDL huquqiga ega rol bilan ishlamasligi kerak. Migratsiya uchun alohida rol, ilova uchun faqat kerakli jadvallarga `SELECT/INSERT/UPDATE/DELETE` beradigan rol. PostgreSQL'da kim qaysi rol bilan ulana olishini client authentication sozlamalari belgilaydi (pg-auth manbasi, 89-darsda chuqurroq). Minimal huquq hujumni to'xtatmaydi, faqat `DROP TABLE` kabi oqibatlarni qiyinlashtiradi.
- Xato xabarlari. Mijozga xom DB xatosi qaytmasin (78-dars); bu error-based turni qiyinlashtiradi, lekin tuzatish emas.
- Multi-tenancy. Har so'rovda tenant sharti bo'lishi uchun PostgreSQL row-level security bor (56-dars): injection bo'lsa ham RLS qatlami boshqa tenant satrlarini yashirishi mumkin, lekin bu ham yagona himoya emas.

### Minimal huquq: nimani aniq cheklash kerak

Cheat Sheet'ning Least Privilege bo'limi huquqlarni "nimani olib tashlash" emas, "nima kerak" nuqtai nazaridan, ya'ni noldan boshlab berishni tavsiya qiladi va ilova hisobiga DBA yoki admin darajasidagi huquq bermaslikni ta'kidlaydi. Sababi shu bo'limda yozilgan: hujumchi qonuniy qiymatni ruxsatsiz qiymatga almashtirishi ham mumkin, ilovaning o'zi esa unga ruxsat etilgan ma'lumotga yeta oladi. Ya'ni huquq faqat SQL injection uchun emas, oddiy buzilgan so'rovlar uchun ham chegara. Amalda ilovaning ish roli faqat o'z jadvallariga DML huquqiga ega bo'ladi, migratsiyalar esa alohida rol bilan, deploy vaqtida ishlaydi. Bu ikki rol ajratilsa, ilova ichidagi injection `DROP TABLE` yoki sxema o'zgartirishga yetmaydi (quiz'dagi oxirgi savol aynan shu holat). Cheat Sheet saqlangan protseduralarni alohida ko'rsatadi: protseduradan boshqa narsaga ruxsat bermaslik mumkin, lekin protseduraning ichki SQL'i o'zi tekshirilishi kerak.

### Code review ro'yxati

SQL injection'ni review'da ushlash uchun to'rtta savol yetarli. Birinchi: so'rov matni qayerda yasaladi va unda `${}` yoki `+` bilan qo'shilgan qiymat bormi? Ikkinchi: har dinamik bo'lak qiymatmi yoki identifikatormi; identifikator bo'lsa, u allow-list xaritasidan keladimi? Uchinchi: `LIMIT` va `OFFSET` qiymatlari raqamga aylantirilib, yuqori chegara bilan cheklanganmi (cheklanmagan `limit` mavjudlik muammosi, 1-dars)? To'rtinchi: so'rov natijasi qaytayotgan ma'lumotda boshqa tenant satrlari aralashib qolmasligi tenant sharti yoki RLS bilan ta'minlanganmi? Bu savollar SAST qoidalari (83-dars) uchun ham asos: matn qo'shish va raw API chaqiruvlari qidiriladi.

### Ikkinchi tartibli misol

Haydovchi ismi ro'yxatdan o'tishda parametr bilan xavfsiz saqlandi. Kechasi ishlaydigan hisobot skripti ismlarni bazadan o'qiydi va ularni boshqa so'rovga matn qo'shish bilan joylaydi: `WHERE driver = '${name}'`. Ism `O'Brien` bo'lsa, hisobot xato beradi (zararsiz kiritish); ism hujumchi tomonidan tuzilgan bo'lsa, hisobot skripti ko'rsatmasi o'zgaradi. Kiritish joyida hech narsa sezilmaydi, shuning uchun bunday xatoni faqat har so'rovni alohida tekshirish ushlaydi. Qoida oddiy: bazadan o'qilgan qiymat ham ishonchsiz kirish, parametr bilan uzatiladi.

### Xato xabarlari va oqibat

Mijozga xom baza xatosini (jadval nomi, ustun nomi, so'rov matni) qaytarish error-based hujumga yordam beradi va ichki tuzilmani oshkor qiladi. Xatoni logga yozing va mijozga umumiy kod qaytaring (78-dars). Lekin xatoni yashirish zaiflikni yopmaydi: blind turlar xatosiz ishlaydi, shuning uchun bu faqat kichik qo'shimcha qatlam.

## Misol: avtopark bazasiga qarshi

Quyida SQLite (Python `sqlite3`) da real baza bilan ishlaymiz. Mexanizm PostgreSQL'dagi bilan bir xil: struktura va qiymatni birlashtirish. Faqat SQLite'ga xos sintaksis (izoh `--`) ishlatamiz.

### 1. Zaif kod

```python run
import sqlite3

db = sqlite3.connect(":memory:")
db.executescript("""
create table vehicles(id integer primary key, tenant text, plate text);
create table api_keys(tenant text, secret text);
insert into vehicles values (1,'alfa','01 A 111 AA'),(2,'alfa','01 A 222 AA'),(3,'beta','10 B 333 BB');
insert into api_keys values ('alfa','key-alfa-001'),('beta','key-beta-002');
""")

# ZAIF: tenant serverdan keladi, plate foydalanuvchidan; ikkalasi ham matnga qo'shiladi
def search_weak(tenant, plate):
    sql = f"SELECT plate, tenant FROM vehicles WHERE tenant = '{tenant}' AND plate LIKE '{plate}%'"
    return db.execute(sql).fetchall()

print("oddiy:", search_weak("alfa", "01 A 1"))
```

```text
oddiy: [('01 A 111 AA', 'alfa')]
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu SQL injection usuli faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

"alfa" foydalanuvchisi qidiruv maydoniga ikki xil kiritish yuboradi. Birinchisi (UNION) `api_keys` jadvalidagi sirni qidiruv natijasiga qo'shadi. Ikkinchisi (boolean blind) natijani ko'rmaydi, faqat "natija bor yoki yo'q" farqidan bitta belgini taxmin qiladi: shartning to'g'ri-noto'g'riligi javobni o'zgartiradi. Ikkalasi ham faqat shu o'quv bazasiga qarshi.

```python run
import sqlite3

db = sqlite3.connect(":memory:")
db.executescript("""
create table vehicles(id integer primary key, tenant text, plate text);
create table api_keys(tenant text, secret text);
insert into vehicles values (1,'alfa','01 A 111 AA'),(2,'alfa','01 A 222 AA'),(3,'beta','10 B 333 BB');
insert into api_keys values ('alfa','key-alfa-001'),('beta','key-beta-002');
""")

def search_weak(tenant, plate):
    sql = f"SELECT plate, tenant FROM vehicles WHERE tenant = '{tenant}' AND plate LIKE '{plate}%'"
    return db.execute(sql).fetchall()

# 1) UNION: boshqa jadval ustunlari natijaga qo'shiladi
union = "zzz' UNION SELECT secret, tenant FROM api_keys --"
print("UNION:", search_weak("alfa", union))

# 2) Boolean blind: hujumchi faqat "natija bor/yo'q" ni ko'radi
def has_result(payload):
    return len(search_weak("alfa", payload)) > 0

for guess in ["a", "b", "k"]:
    p = f"zzz' OR (SELECT substr(secret,1,1) FROM api_keys WHERE tenant='beta')='{guess}' --"
    print(f"birinchi belgi '{guess}' ?", has_result(p))
```

```text
UNION: [('key-alfa-001', 'alfa'), ('key-beta-002', 'beta')]
birinchi belgi 'a' ? False
birinchi belgi 'b' ? False
birinchi belgi 'k' ? True
```

UNION qatori ikkala tenant'ning API kalitini ochib berdi: so'rov natijasining ustunlari soni va turi mos kelgani uchun baza ikkala SELECT natijasini birlashtirdi. Blind variantda hujumchi hech qanday kalitni ko'rmaydi, lekin uchta taxmindan bittasida javob o'zgardi va shu bilan birinchi belgi `k` ekani ma'lum bo'ldi. Shu tarzda kalit belgima-belgi chiqariladi. Bunday hujumda sahifada xato xabari bo'lmasligi yetarli emas. Real PostgreSQL'da izoh va funksiyalar sintaksisi biroz farq qilishi mumkin, mexanizm esa bir xil.

### 3. Tuzatilgan kod

```python run
import sqlite3

db = sqlite3.connect(":memory:")
db.executescript("""
create table vehicles(id integer primary key, tenant text, plate text);
create table api_keys(tenant text, secret text);
insert into vehicles values (1,'alfa','01 A 111 AA'),(2,'alfa','01 A 222 AA'),(3,'beta','10 B 333 BB'),(4,'alfa','50%_X');
insert into api_keys values ('alfa','key-alfa-001'),('beta','key-beta-002');
""")

def like_escape(s):
    return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")

SORT = {"plate": "plate", "id": "id"}

def search(tenant, plate, sort="plate"):
    col = SORT.get(sort, "plate")  # identifikator: allow-list
    sql = f"SELECT plate, tenant FROM vehicles WHERE tenant = ? AND plate LIKE ? ESCAPE '\\' ORDER BY {col}"
    return db.execute(sql, (tenant, like_escape(plate) + "%")).fetchall()

print("UNION hujumi:", search("alfa", "zzz' UNION SELECT secret, tenant FROM api_keys --"))
print("blind hujumi:", search("alfa", "zzz' OR (SELECT 1) --"))
print("oddiy:       ", search("alfa", "01 A 1"))
print("wildcard:    ", search("alfa", "%"), "|", search("alfa", "50%"))
print("sort hujumi: ", search("alfa", "01", "plate; DROP TABLE vehicles"))
```

```text
UNION hujumi: []
blind hujumi: []
oddiy:        [('01 A 111 AA', 'alfa')]
wildcard:     [] | [('50%_X', 'alfa')]
sort hujumi:  [('01 A 111 AA', 'alfa'), ('01 A 222 AA', 'alfa')]
```

Nima uchun yetarli: invariant "foydalanuvchi qiymati so'rov strukturasiga hech qachon aralashmaydi". Qiymatlar `?` orqali bog'langan, shuning uchun UNION va blind payload'lar oddiy (mos kelmaydigan) matn bo'lib qoldi. Yagona o'zgaruvchan matn qismi `col`, u allow-list'dan keladi (noma'lum `sort` `plate` ga tushadi). `LIKE` wildcard'lari escape qilindi, shuning uchun `%` hamma narsaga mos kelmaydi, `50%` esa haqiqiy belgi sifatida qidiriladi. Nima yopilmadi: tenant qiymati to'g'ri sessiyadan kelishi (authorization, 51-58-darslar), qidiruv natijasi soni cheklovi (`LIMIT`, 73-dars) va ulanish rolining huquqlari.

## Qachon qo'llamaslik kerak

- Parametr bilan qurish mumkin bo'lmagan so'rov bo'laklari (jadval nomi, dinamik ustun ro'yxati, murakkab filtr daraxti) uchun matn yig'ish kerak bo'lsa, uni alohida, kichik funksiyada izolyatsiya qiling va faqat kodda yozilgan bo'laklardan yig'ing. Query builder (Kysely) bu holatlarda xavfsizroq: u identifikatorlarni alohida API orqali qo'shadi (23-dars).
- Saqlangan protsedurani "xavfsizlik chorasi" deb joriy qilmang. Protsedura ichidagi dinamik SQL xuddi shu zaiflikni ichkariga ko'chiradi. Protsedura kerak bo'lsa, biznes sababi bilan joriy qiling.
- Tayyor ORM'ga ishonib raw so'rovni "faqat bir marta" yozish odati xavfli. Raw so'rovning har biri alohida code review talab qiladi.
- Escape qilishga o'tib ketmang. Qiymatni qo'lda escape qilish dialektga, kodlashga (encoding) va sozlamalarga bog'liq va xatoga moyil. Kutubxona parametr API'si bor joyda escape qo'llash ortiqcha xavf. Escape faqat parametr API'si umuman bo'lmagan interpreter'larda oxirgi chora.
- WAF va xato filtri bilan chegaralanmang. WAF yordamchi qatlam, lekin konkatenatsiya qolgan bo'lsa, zaiflik mavjud.

## Stack'da: PostgreSQL va Node.js

PostgreSQL bilan `pg` ishlatilganda tipik xavfsiz shakl quyidagicha. Kod ishga tushirilmaydi (`pg` brauzer worker'ida mavjud emas), faqat TypeScript sintaksisi tekshirilgan.

```ts
import { Pool } from "pg";

const pool = new Pool(); // ulanish rolining huquqlari: faqat kerakli jadvallarga DML

const SORT = { plate: "plate", lastSeen: "last_seen_at" } as const;

export async function searchVehicles(
  tenantId: string,
  q: string,
  ids: string[],
  sort: string,
) {
  const col = Object.hasOwn(SORT, sort) ? SORT[sort as keyof typeof SORT] : SORT.plate;
  const likeSafe = q.replace(/[\\%_]/g, (m) => "\\" + m);
  const { rows } = await pool.query(
    `SELECT id, plate FROM vehicles
      WHERE tenant_id = $1
        AND plate ILIKE $2 || '%'
        AND id = ANY($3::uuid[])
      ORDER BY ${col}
      LIMIT 100`,
    [tenantId, likeSafe, ids],
  );
  return rows;
}
```

Bu yerda qiymatlar (`tenantId`, `likeSafe`, `ids`) parametr, `ids` ro'yxati `= ANY($3::uuid[])` bilan massiv sifatida uzatilgan (PostgreSQL massiv parametri), `ORDER BY` allow-list'dan, natija soni `LIMIT` bilan cheklangan. PostgreSQL'ning default `LIKE` escape belgisi teskari slesh, shuning uchun `likeSafe` shu belgi bilan escape qilingan. Prisma'da xuddi shu so'rov `findMany({ where: ... })` bilan yoziladi va qiymatlar o'zi parametrlanadi; raw API'ga o'tishda esa 23-darsdagi qoidalar kuchga kiradi.

## Xulosa

- SQL injection - SQL matnining ichida foydalanuvchi qiymati sintaksis sifatida o'qilishi. Turlari (in-band, blind, out-of-band, ikkinchi tartibli) ko'rinishida farq qiladi, sababi bitta: konkatenatsiya.
- Asosiy himoya - parametrlangan so'rov: struktura va qiymat alohida kanalda. Xato xabarini yashirish va WAF bu o'rinni bosmaydi.
- Parametr qiymatni yopadi, identifikatorni emas: ustun va jadval nomlari uchun allow-list ishlating. `LIKE` wildcard'lari va `IN` ro'yxatlari alohida e'tibor talab qiladi.
- Saqlangan protsedura ichidagi dinamik SQL xuddi shu zaiflikni takrorlaydi; `EXECUTE ... USING` kabi parametrlangan shakl kerak.
- Minimal huquqli ulanish roli zararni cheklaydi, lekin ma'lumotni o'qishni to'xtatmaydi.
- Har tuzatishni ko'rsatilgan hujumlar bilan tekshiring va nimani qoplamasligini yozib qo'ying (tenant manbai, natija hajmi, rol huquqlari).
