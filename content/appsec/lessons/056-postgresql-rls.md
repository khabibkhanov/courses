---
n: 56
slug: postgresql-rls
title: "PostgreSQL row-level security"
summary: "PostgreSQL row security policy'lari: ENABLE va FORCE, USING va WITH CHECK, permissive va restrictive policy'larning birikishi, bypass qiladigan rollar, view'lar, tenant kontekstini tranzaksiya doirasida uzatish (SET LOCAL) va connection pool'dagi tuzoq."
duration: 50
sources:
  - id: pg-rls
    note: "PostgreSQL 5.9 Row Security Policies: default-deny, owner va BYPASSRLS, FORCE, USING/WITH CHECK, permissive OR/restrictive AND, leakproof, referential integrity bypass, row_security parametri, sub-SELECT'dagi race condition"
  - id: pg-set
    note: "SET hujjati: SET LOCAL ta'siri joriy tranzaksiya oxirigacha, commit yoki rollback bo'lishidan qat'i nazar; tranzaksiya blokidan tashqarida SET LOCAL ogohlantirish beradi va ta'sir qilmaydi; rollback qilingan SET yo'qoladi, commit qilingani sessiya oxirigacha qoladi; set_config() ekvivalent funksiya"
  - id: pg-create-policy
    note: "CREATE POLICY: AS PERMISSIVE | RESTRICTIVE sintaksisi; faqat restrictive policy'lar bo'lsa hech qaysi qator ko'rinmaydi, restrictive'lar permissive'lar ruxsatini toraytiradi"
  - id: pg-create-view
    note: "CREATE VIEW: asosiy jadvalda RLS yoqilgan bo'lsa sukut bo'yicha view egasining policy'lari qo'llanadi; security_invoker = true bo'lsa chaqiruvchining policy va huquqlari"
  - id: cs-multi-tenant
    note: "Multi-Tenant Application Security Cheat Sheet: RLS-bypass qiladigan rolni tenant-scoped so'rov yo'lida ishlatmaslik, tenant kontekstini tranzaksiya doirasida (SET LOCAL yoki set_config(..., true)) o'rnatish, current_setting'ni missing_ok'siz yozish (fail closed), izolyatsiyani tekshirish (relrowsecurity/relforcerowsecurity, pg_policies, ulanishni qayta ishlatish sinovi)"
  - id: asvs
    note: "ASVS 5.0.0, V8.4.1: multi-tenant ilovalarda tenant'lararo nazorat (2-daraja); RLS bu talabni ma'lumotlar bazasi qatlamida majburlaydigan mexanizmlardan biri"
  - id: pg-auth
    note: "Client Authentication bobi: rol va ulanish orqali kirish; bu darsda RLS'ni qo'llaydigan rolni ilova ulanishi uchun alohida ajratish kontekstida eslatiladi"
  - id: t10-a01
    note: "A01:2025 Broken Access Control: yozuv egaligini model darajasida majburlash, deny by default"
quiz:
  - q: "Jadvalda `ENABLE ROW LEVEL SECURITY` bajarilgan, lekin hali birorta policy yaratilmagan. Oddiy (owner bo'lmagan) rol `SELECT` qilsa nima bo'ladi?"
    options:
      - "Hamma qator ko'rinadi, chunki policy yo'q"
      - "Bitta qator ko'rinadi"
      - "Hech qaysi qator ko'rinmaydi: policy bo'lmasa default-deny qo'llanadi"
      - "PostgreSQL xato bilan to'xtaydi"
    answer: 2
    explain: "Hujjatga ko'ra row security yoqilgach, jadvalga oddiy kirish policy ruxsat bergan qatorlarga cheklanadi; policy bo'lmasa default-deny siyosati ishlaydi: qator ko'rinmaydi ham, o'zgartirib ham bo'lmaydi. Xato chiqmaydi, natija bo'sh bo'ladi."
  - q: "Ilova jadval egasi (owner) roli bilan ulanadi. Jadvalda RLS yoqilgan va policy yozilgan, lekin `FORCE ROW LEVEL SECURITY` berilmagan. Tenant izolyatsiyasi ishlaydimi?"
    options:
      - "Ha, policy hammaga qo'llanadi"
      - "Yo'q: jadval egasi odatda row security'ni chetlab o'tadi; FORCE bilan esa egaga ham qo'llanadi (superuser va BYPASSRLS rollar baribir chetlab o'tadi)"
      - "Faqat INSERT uchun ishlaydi"
      - "Faqat SELECT uchun ishlaydi"
    answer: 1
    explain: "Hujjat: jadval egasi odatda row security'ga bo'ysunmaydi, FORCE bilan bo'ysunadi; superuser va BYPASSRLS atributli rollar har doim chetlab o'tadi. Eng yaxshi yo'l: ilova uchun egalik huquqisiz va BYPASSRLS'siz alohida rol."
  - q: "Ikkita permissive policy bitta jadvalga qo'llanadi: biri `tenant_id = current_tenant`, ikkinchisi `is_public = true`. Qaror qanday birikadi va bu tenant izolyatsiyasiga nima qiladi?"
    options:
      - "AND bilan: ikkala shart ham bajarilishi kerak"
      - "OR bilan: qator ikkalasidan biri to'g'ri bo'lsa ko'rinadi, shuning uchun izolyatsiyani majburlash uchun restrictive policy yaxshiroq"
      - "Faqat birinchi policy ishlaydi"
      - "Policy'lar bir-birini bekor qiladi"
    answer: 1
    explain: "Permissive policy'lar OR bilan, restrictive'lar AND bilan birikadi. Tenant sharti 'hech qachon buzilmasligi kerak' bo'lsa, uni restrictive qilish xavfsizroq: boshqa permissive policy qo'shilsa ham tenant sharti bajarilishi shart."
  - q: "Ilova tenant ID'ni `SET app.tenant_id = 'alfa'` bilan (SET LOCAL'siz) o'rnatadi va ulanish pool'ga qaytadi. Keyingi so'rov autentifikatsiyada xato bo'lib, tenant'ni o'rnatmasdan so'rov yuboradi. Nima bo'lishi mumkin?"
    options:
      - "Policy xato beradi, chunki sozlama yo'q"
      - "Hech narsa, har so'rov yangi ulanish oladi"
      - "Sessiya darajasidagi qiymat ulanish bilan qoladi: keyingi so'rov alfa ma'lumotini ko'rishi mumkin"
      - "SET faqat tranzaksiya ichida ishlaydi"
    answer: 2
    explain: "SET sessiya qiymatini o'rnatadi va u ulanish yopilgunicha qoladi, pool esa ulanishni qayta ishlatadi. SET LOCAL qiymati tranzaksiya oxirida yo'qoladi. Birinchi variant faqat sozlama umuman hech qachon o'rnatilmagan ulanishda to'g'ri."
  - q: "Policy ichida `USING (group_id <= (SELECT group_id FROM users WHERE user_name = current_user))` kabi sub-SELECT bor. Hujjat qanday xavf haqida ogohlantiradi?"
    options:
      - "Sub-SELECT ishlamaydi"
      - "Policy faqat SELECT uchun yoziladi"
      - "Sub-SELECT har doim sekin"
      - "Boshqa jadvaldagi huquq o'zgarishi bilan parallel tranzaksiyalar orasida race condition paydo bo'lib, ma'lumot sizishi mumkin"
    answer: 3
    explain: "Hujjat READ COMMITTED rejimida, `FOR UPDATE` bilan o'qiyotgan parallel tranzaksiya yangilangan qatorni ko'rishi, lekin sub-SELECT'ni eski snapshot bilan baholashi mumkinligini ko'rsatadi. Shuning uchun imkon bo'lsa policy faqat shu qatorning o'z qiymatlariga tayansin (60-dars)."
  - q: "`ALTER TABLE alerts ENABLE ROW LEVEL SECURITY` bajarilgan va policy yozilgan, lekin ilova `v_alerts` view'si orqali o'qiydi. View egasi `app_owner`. Qaysi policy'lar qo'llanadi?"
    options:
      - "Odatda view egasining policy'lari qo'llanadi; `security_invoker = true` bo'lsa chaqiruvchi foydalanuvchining policy'lari"
      - "View'larga RLS umuman qo'llanmaydi"
      - "Hamma vaqt chaqiruvchi foydalanuvchining policy'lari"
      - "Policy'lar view'da ikki marta qo'llanadi"
    answer: 0
    explain: "CREATE VIEW hujjati: asosiy jadvalda RLS yoqilgan bo'lsa, sukut bo'yicha view egasining policy'lari qo'llanadi; `security_invoker` true bo'lsa chaqiruvchining policy va huquqlari ishlatiladi. Demak view orqali o'qish tenant chegarasini egaga bog'lab qo'yishi mumkin."
task:
  title: "Tenant kontekstini tranzaksiya doirasida o'rnatish"
  prompt: |
    `withTenant(conn, tenant, fn)` tenant kontekstini o'rnatib `fn` ni bajaradi. Hozir u `set` bilan sessiya darajasida yozadi va hech qachon tozalamaydi, natijada ulanish pool'da qayta ishlatilganda tenant qiymati qoladi.

    Tuzating:

    1. `conn.begin()` bilan boshlang, tenant'ni `conn.setLocal` bilan o'rnating.
    2. `fn` xato tashlasa ham `conn.end()` chaqirilsin (`try/finally`).
    3. `fn` ning natijasi qaytsin.
    4. Imzoni o'zgartirmang. Kutilgan chiqish: `alfa: 2`, `qoladimi: yo'q`, `xatodan keyin: undefined`, `beta: 1`.
  lang: ts
  starter: |
    type Row = { tenant: string; plate: string };

    class Conn {
      rows: Row[] = [
        { tenant: "alfa", plate: "01 A 111 AA" },
        { tenant: "alfa", plate: "01 A 222 AA" },
        { tenant: "beta", plate: "10 B 333 BB" },
      ];
      private session = new Map<string, string>();
      private local = new Map<string, string>();
      private tx = false;
      set(k: string, v: string) { this.session.set(k, v); }
      begin() { this.tx = true; }
      setLocal(k: string, v: string) {
        if (!this.tx) throw new Error("SET LOCAL tranzaksiyadan tashqarida");
        this.local.set(k, v);
      }
      end() { this.tx = false; this.local.clear(); }
      setting(k: string) { return this.local.get(k) ?? this.session.get(k); }
      // policy: tenant = current_setting('app.tenant_id'); sozlama yo'q bo'lsa xato (fail closed)
      select(): Row[] {
        const t = this.setting("app.tenant_id");
        if (t === undefined) throw new Error("app.tenant_id o'rnatilmagan");
        return this.rows.filter((r) => r.tenant === t);
      }
    }

    function withTenant<T>(conn: Conn, tenant: string, fn: () => T): T {
      conn.set("app.tenant_id", tenant);
      return fn();
    }

    const conn = new Conn();
    console.log("alfa:", withTenant(conn, "alfa", () => conn.select().length));
    let qoldi = "yo'q";
    try { conn.select(); qoldi = "ha"; } catch { qoldi = "yo'q"; }
    console.log("qoladimi:", qoldi);
    try { withTenant(conn, "beta", () => { throw new Error("so'rov xatosi"); }); } catch { /* kutilgan */ }
    console.log("xatodan keyin:", conn.setting("app.tenant_id"));
    console.log("beta:", withTenant(conn, "beta", () => conn.select().length));
  solution: |
    type Row = { tenant: string; plate: string };

    class Conn {
      rows: Row[] = [
        { tenant: "alfa", plate: "01 A 111 AA" },
        { tenant: "alfa", plate: "01 A 222 AA" },
        { tenant: "beta", plate: "10 B 333 BB" },
      ];
      private session = new Map<string, string>();
      private local = new Map<string, string>();
      private tx = false;
      set(k: string, v: string) { this.session.set(k, v); }
      begin() { this.tx = true; }
      setLocal(k: string, v: string) {
        if (!this.tx) throw new Error("SET LOCAL tranzaksiyadan tashqarida");
        this.local.set(k, v);
      }
      end() { this.tx = false; this.local.clear(); }
      setting(k: string) { return this.local.get(k) ?? this.session.get(k); }
      // policy: tenant = current_setting('app.tenant_id'); sozlama yo'q bo'lsa xato (fail closed)
      select(): Row[] {
        const t = this.setting("app.tenant_id");
        if (t === undefined) throw new Error("app.tenant_id o'rnatilmagan");
        return this.rows.filter((r) => r.tenant === t);
      }
    }

    function withTenant<T>(conn: Conn, tenant: string, fn: () => T): T {
      conn.begin();
      try {
        conn.setLocal("app.tenant_id", tenant);
        return fn();
      } finally {
        conn.end();
      }
    }

    const conn = new Conn();
    console.log("alfa:", withTenant(conn, "alfa", () => conn.select().length));
    let qoldi = "yo'q";
    try { conn.select(); qoldi = "ha"; } catch { qoldi = "yo'q"; }
    console.log("qoladimi:", qoldi);
    try { withTenant(conn, "beta", () => { throw new Error("so'rov xatosi"); }); } catch { /* kutilgan */ }
    console.log("xatodan keyin:", conn.setting("app.tenant_id"));
    console.log("beta:", withTenant(conn, "beta", () => conn.select().length));
  solutionNotes: |
    - Kontekst `setLocal` bilan tranzaksiya doirasida o'rnatiladi va `finally` ichida `end()` har holda tozalaydi. PostgreSQL'da bu `SET LOCAL` yoki `set_config(..., true)` ga to'g'ri keladi: qiymat tranzaksiya tugagach yo'qoladi.
    - Sozlama yo'q ulanishda `select()` xato beradi, jimgina hamma qatorni qaytarmaydi (fail closed). Policy ichida `current_setting('app.tenant_id')` ni `missing_ok` argumentisiz yozish xuddi shu xatti-harakatni beradi.
    - Xato bo'lganda ham kontekst tozalanadi, shuning uchun pool'dagi ulanish keyingi so'rovga eski tenant bilan qolmaydi.
    - Bu simulyatsiya: haqiqiy PostgreSQL xatti-harakatini staging bazada o'zingiz qo'llaydigan rol va pool rejimida sinang. Ilova roli superuser yoki BYPASSRLS bo'lsa, bu kod ham himoya bermaydi.
    - Qoplanmagan: policy'ning o'zi to'g'riligi (USING/WITH CHECK), view'lar va migratsiya rollari.
  checklist:
    - "Tenant kontekstini faqat tranzaksiya ichida (`setLocal`) o'rnating"
    - "`finally` ichida kontekst har holda tozalanadi"
    - "Kontekst yo'q bo'lsa so'rov xato beradi, hamma qatorni qaytarmaydi"
    - "Tuzatish ilova roli BYPASSRLS emasligiga bog'liqligini ayta olasiz"
---

## Muammo

55-darsda tenant chegarasini ilova qatlamida majburladik: repository har so'rovga `tenant_id` shartini qo'shadi. Bu ishlaydi, lekin kafolat emas. Bitta unutilgan `where`, qo'lda yozilgan raw so'rov, hisobot skripti yoki yangi dasturchining tezkor tuzatishi hamma tenant ma'lumotini ochishi mumkin. A01:2025 sahifasi aytganidek, yozuv egaligi model darajasida majburlanishi kerak. Savol: shu majburlashni ilovadan pastga, ma'lumotlar bazasining o'ziga tushirib bo'ladimi.

PostgreSQL buni row-level security (RLS) bilan beradi. Hujjat tavsifiga ko'ra, SQL standartidagi `GRANT` huquqlaridan tashqari jadvalda row security policy'lari bo'lishi mumkin: ular har foydalanuvchi uchun oddiy so'rovlar qaytara oladigan qatorlarni va ma'lumotni o'zgartiruvchi buyruqlar kiritishi, yangilashi yoki o'chirishi mumkin bo'lgan qatorlarni cheklaydi. Ya'ni siz `SELECT * FROM vehicles` yozsangiz ham, baza policy shartiga mos kelmaydigan qatorlarni natijaga qo'shmaydi.

RLS sehrli o'q emas. Ko'p jamoa uni yoqadi va izolyatsiya ishlayapti deb o'ylaydi, lekin ilova jadval egasi bilan ulangan bo'lsa, policy umuman qo'llanmaydi. Yoki tenant kontekstini sessiyaga yozib, connection pool uni keyingi so'rovga qoldiradi. Bu dars policy'ning o'zini, uni chetlab o'tadigan yo'llarni va ilovadan kontekstni to'g'ri uzatishni ko'radi.

## Asosiy g'oya

PostgreSQL hujjatining asosiy qoidalari quyidagicha.

**Default-deny.** Jadvalda sukut bo'yicha policy yo'q, shuning uchun `GRANT` bilan jadvalga kirish huquqi bor foydalanuvchi hamma qatorni ko'radi va o'zgartiradi. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` bajarilgach, jadvalga oddiy kirish policy ruxsat berishi kerak. Policy yo'q bo'lsa default-deny qo'llanadi: hech qaysi qator ko'rinmaydi va o'zgartirib bo'lmaydi. Jadvalning umumiy amallari (`TRUNCATE`, `REFERENCES`) row security'ga bo'ysunmaydi.

**Policy tuzilishi.** Policy ma'lum buyruqlarga (`ALL`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`), ma'lum rollarga yoki ikkalasiga tegishli bo'lishi mumkin. Qaysi qatorlar ko'rinishini `USING` ifodasi belgilaydi (Boolean natija qaytarishi kerak), qaysi qatorlar yozilishi mumkinligini `WITH CHECK` ifodasi. Hujjatdagi muhim nuqta: `USING` ifodasi foydalanuvchi so'rovidagi shart va funksiyalardan oldin har qator uchun baholanadi (yagona istisno: ma'lumot sizdirmasligi kafolatlangan leakproof funksiyalar, ularni optimizer policy tekshiruvidan oldin qo'llashi mumkin). `WITH CHECK` ko'rsatilmasa, `USING` ifodasi yozish uchun ham ishlatiladi. Shuning uchun `FOR ALL USING (tenant_id = ...)` yozilgan policy boshqa tenant uchun qator kiritishni ham, o'zgartirib tenant'ni almashtirishni ham to'sadi.

**Birikish qoidasi.** Bitta jadvalga bir necha policy qo'llansa, permissive policy'lar (sukut bo'yicha) OR bilan birikadi, restrictive policy'lar esa AND bilan. Hujjat shuni ham maslahat beradi: permissive policy'lar faqat mo'ljallangan holatlarga ruxsat beradigan qilib yozilishi mumkin, lekin ularni restrictive policy'lar bilan birlashtirish ko'pincha sodda. Tenant izolyatsiyasi uchun bu muhim: tenant sharti restrictive bo'lsa, keyinchalik kimdir boshqa maqsadda permissive policy qo'shsa ham, tenant sharti bajarilishi shart bo'lib qoladi.

**Kimlar bo'ysunmaydi.** Hujjat: superuser va `BYPASSRLS` atributli rollar jadvalga kirishda row security'ni har doim chetlab o'tadi. Jadval egasi ham odatda chetlab o'tadi, lekin `ALTER TABLE ... FORCE ROW LEVEL SECURITY` bilan ega ham policy'ga bo'ysunadigan bo'ladi. Row security'ni yoqish, o'chirish va policy qo'shish faqat jadval egasining huquqi. OWASP Multi-Tenant Application Security Cheat Sheet bundan amaliy xulosa chiqaradi: ilovaning oddiy so'rov yo'li superuser ham, `BYPASSRLS` ham bo'lmagan minimal huquqli rol bilan ulansin, imtiyozli ulanishlar esa migratsiyalar va aniq vakolatli administrativ vazifalar uchun ajratilsin. Joriy rolning haqiqiy atributlarini `pg_roles` dagi `rolsuper` va `rolbypassrls` orqali tekshirish mumkin.

## Chuqurroq: nozik joylar

### Policy birikishi ishlashda

Quyidagi kod permissive (OR) va restrictive (AND) birikishining mantiqiy modeli. Bu PostgreSQL emas, hujjat qoidasining TypeScript'dagi modeli:

```ts run
type Row = { tenant: string; isPublic: boolean };
type Policy = { kind: "permissive" | "restrictive"; check: (r: Row, ctx: { tenant: string }) => boolean };

// Hujjat qoidasi: permissive'lar OR bilan, restrictive'lar AND bilan birikadi; policy yo'q bo'lsa rad
function visible(policies: Policy[], r: Row, ctx: { tenant: string }): boolean {
  const perm = policies.filter((p) => p.kind === "permissive");
  const restr = policies.filter((p) => p.kind === "restrictive");
  if (perm.length === 0) return false;
  return perm.some((p) => p.check(r, ctx)) && restr.every((p) => p.check(r, ctx));
}

const rows: Row[] = [
  { tenant: "alfa", isPublic: false },
  { tenant: "beta", isPublic: false },
  { tenant: "beta", isPublic: true },
];
const own: Policy = { kind: "permissive", check: (r, c) => r.tenant === c.tenant };
const pub: Policy = { kind: "permissive", check: (r) => r.isPublic };
const tenantOnly: Policy = { kind: "restrictive", check: (r, c) => r.tenant === c.tenant };

const ctx = { tenant: "alfa" };
console.log("policy yo'q:", rows.filter((r) => visible([], r, ctx)).length);
console.log("faqat own:", rows.filter((r) => visible([own], r, ctx)).length);
console.log("own + public (OR):", rows.filter((r) => visible([own, pub], r, ctx)).length);
console.log("own + public + restrictive tenant:", rows.filter((r) => visible([own, pub, tenantOnly], r, ctx)).length);
```

```text
policy yo'q: 0
faqat own: 1
own + public (OR): 2
own + public + restrictive tenant: 1
```

Uchinchi qatorda ikkinchi permissive policy beta'ning ommaviy qatorini alfa'ga ochdi. To'rtinchi qatorda restrictive tenant sharti uni yana yopdi. Real tizimda "ommaviy" qator kerak bo'lsa, buni ongli qaror bilan qiling; tenant chegarasi restrictive bo'lishi yaxshiroq himoya.

### Bypass yo'llari ro'yxati

Izolyatsiya ishlayapti deyishdan oldin quyidagilarni tekshiring:

- Ilova roli superuser, jadval egasi (FORCE'siz) yoki `BYPASSRLS` emasmi.
- Ilova qaysi rol bilan va qaysi usulda ulanadi. Client Authentication bobi (`pg_hba.conf`) qaysi rol qaysi manzildan qaysi autentifikatsiya usuli bilan ulanishini belgilaydi: ilova uchun alohida rol yarating va ulanishga faqat shu rol bilan ruxsat bering, migratsiya rolini ilova sirlari ichida saqlamang.
- Barcha tenant jadvallarida RLS yoqilganmi. Cheat sheet kataloglarni (`pg_class.relrowsecurity` va `relforcerowsecurity`) tenant jadvallari inventari bilan solishtirishni tavsiya qiladi: yangi jadval qo'shilganda RLS'ni yoqishni unutish tipik xato.
- View'lar. CREATE VIEW hujjatiga ko'ra asosiy jadvalda RLS yoqilgan bo'lsa, sukut bo'yicha view egasining policy'lari qo'llanadi, va policy'lar ishlatadigan qo'shimcha jadvallarga kirish ham view egasi huquqlari bilan aniqlanadi. `security_invoker = true` bo'lsa, chaqiruvchining policy va huquqlari ishlatiladi. Demak view orqali o'qish tenant chegarasini egaga bog'lab qo'yishi mumkin.
- Referential integrity. Unique va tashqi kalit tekshiruvlari doim row security'ni chetlab o'tadi. Hujjat shu sabab "covert channel" orqali ma'lumot oqishi ehtimoliga e'tibor berishni so'raydi (masalan, boshqa tenant'ning unique qiymati bilan to'qnashuv xatosi) (55-dars).
- Zaxira nusxa. Backup paytida row security jimgina ba'zi qatorlarni tashlab yuborsa halokatli. Hujjat bunday vaziyat uchun `row_security` parametrini `off` qilishni aytadi: bu xavfsizlikni o'chirmaydi, balki policy filtrlaydigan so'rovda xato beradi.

### Sub-SELECT va race condition

Policy boshqa jadvalga tayansa (`group_id <= (SELECT group_id FROM users ...)`), hujjat race condition ogohlantirishini beradi. READ COMMITTED rejimida `FOR UPDATE` bilan o'qiyotgan parallel tranzaksiya yangilangan qatorni oladi, lekin policy ichidagi sub-SELECT'ni eski snapshot bilan baholaydi, shuning uchun huquqi yangi olib tashlangan foydalanuvchi yangi qiymatni ko'rishi mumkin. Hujjat bir necha yo'lni beradi: sub-SELECT'da `FOR SHARE` (lekin u UPDATE huquqini talab qiladi va yuklama ortishi mumkin), huquqlar jadvalini yangilashda `ACCESS EXCLUSIVE` lock, yoki yangilashdan keyin parallel tranzaksiyalar tugashini kutish. Eng sodda yo'l: policy faqat shu qatorning o'z qiymatlariga tayansin (hujjat uni eng oddiy va eng tez variant deb ataydi). Tenant policy'si `tenant_id = current_setting(...)` aynan shunday. Bu mavzuning umumiy tomoni 60-darsda.

### Tenant konteksti qanday uzatiladi

Policy tenant ID'ni biror joydan oladi. Keng tarqalgan usul: maxsus sozlama, ya'ni `current_setting('app.tenant_id')`. Cheat sheet misolida policy shu sozlamani o'qiydi va `missing_ok` argumenti berilmagani uchun, sozlama mavjud bo'lmasa, PostgreSQL `NULL` qaytarmasdan xato beradi; cheat sheet buni ataylab fail-closed tanlov deb ataydi. Qiymatni o'rnatish usuli hal qiluvchi. `SET` sessiya darajasida ishlaydi: tranzaksiya commit bo'lgach ham sessiya tugagunicha saqlanadi. SET hujjatiga ko'ra `SET LOCAL` ta'siri esa faqat joriy tranzaksiya oxirigacha. Pool ulanishni qayta tiklamasdan qayta ishlatsa, sessiya darajasidagi tenant keyingi so'rovga qoladi. Ikki nozik joy PostgreSQL hujjatida yozilgan. Birinchisi: `SET LOCAL` tranzaksiya blokidan tashqarida chaqirilsa xato bermaydi, faqat ogohlantirish chiqaradi va hech qanday ta'sir qilmaydi. Ya'ni autocommit rejimida `SET LOCAL app.tenant_id = ...` jimgina tenant'ni o'rnatmaydi (quyidagi misoldagi simulyatsiya buni qat'iyroq, xato bilan ko'rsatadi). Ikkinchisi: oddiy `SET` tranzaksiya ichida bo'lsa ham, tranzaksiya rollback bo'lsa yo'qoladi, commit bo'lsa sessiya oxirigacha qoladi. Shuning uchun `SET` ni "tranzaksiyaga bog'langan" deb o'ylash xato.

`SET` utility buyruq bo'lgani uchun tayyorlangan so'rovda `$1` parametrini qabul qilmaydi (PostgreSQL 16.15 da `PREPARE p(text) AS SET LOCAL app.x = $1` sintaksis xatosi berdi), `set_config(name, value, is_local)` esa oddiy funksiya, qiymati bind parametr bo'lishi mumkin. Shu sabab ilova kodida `set_config` qulayroq va tenant ID'ni SQL matniga qo'shib qo'yish xavfidan saqlaydi (21-22-darslar). Hujjatda yana bir mayda tafsilot: `set_config` ga `NULL` berilsa, u sozlamani standart qiymatiga qaytarish so'rovi deb talqin qilinadi, ya'ni tenant'ni "o'chirish" uchun `NULL` yuborish uni sozlamasiz holatga emas, standart (bo'sh) qiymatga qaytaradi.

Cheat sheet tavsiyasi: tranzaksiya boshlang, tenant kontekstini `SET LOCAL` yoki `set_config('app.tenant_id', tenant, true)` bilan o'rnating (uchinchi argument `true` qiymatni tranzaksiyaga bog'laydi), so'rovlarni shu tranzaksiyada bajaring, har tranzaksiyada kontekstni qayta o'rnating, kontekst yo'q bo'lsa filtrsiz so'rovga o'tmang va ulanishni pool'ga qaytarishdan oldin commit yoki rollback qiling. Cheat sheet pool'dagi sessiya sozlamasiga tayanishni ishonchli qayta tiklash va ulanishni qayta ishlatish sinovlarisiz noto'g'ri amaliyotlar qatoriga qo'yadi.

## Misol: pool va tenant sozlamasi

Quyidagi model bitta ulanish va policy'ni simulyatsiya qiladi. Policy sozlama bo'yicha filtrlaydi, sozlama yo'q bo'lsa xato beradi.

### 1. Zaif kod

```ts run
type Row = { tenant: string; plate: string };

class Conn {
  rows: Row[] = [
    { tenant: "alfa", plate: "01 A 111 AA" },
    { tenant: "alfa", plate: "01 A 222 AA" },
    { tenant: "beta", plate: "10 B 333 BB" },
  ];
  settings = new Map<string, string>(); // sessiya darajasi (SET)
  select(): Row[] {
    const t = this.settings.get("app.tenant_id");
    if (t === undefined) throw new Error("app.tenant_id o'rnatilmagan");
    return this.rows.filter((r) => r.tenant === t);
  }
}

const pool = new Conn(); // bitta ulanish qayta ishlatiladi

// ZAIF: SET sessiyaga yoziladi va hech qachon tozalanmaydi
function handleWeak(tenant: string | null): string {
  if (tenant) pool.settings.set("app.tenant_id", tenant);
  try {
    return pool.select().map((r) => r.plate).join(", ");
  } catch (e) {
    return "xato: " + (e as Error).message;
  }
}

console.log("1-so'rov (alfa):", handleWeak("alfa"));
```

```text
1-so'rov (alfa): 01 A 111 AA, 01 A 222 AA
```

### 2. Hujum

> **Ta'lim maqsadida.** Bu RLS kontekstining qolib ketishidan foydalanish namunasi faqat shu darsning o'quv kodida ko'rsatiladi; uni o'z tizimingizda yoki yozma ruxsat va kelishilgan doira bilan sinang. Ruxsatsiz qo'llash Jinoyat kodeksining 278-2-moddasi (Kompyuter axborotidan ruxsatsiz foydalanish) doirasiga tushishi mumkin (kurs talqini). Batafsil: 9-dars.

Hujumchi hech narsa yubormaydi: u kirmagan (yoki autentifikatsiya xato bergan) so'rovni yuboradi, kod esa tenant'ni o'rnatmasdan so'rovni davom ettiradi. Oldingi so'rovdan qolgan qiymat pool'dagi ulanishda turibdi:

```ts run
type Row = { tenant: string; plate: string };
class Conn {
  rows: Row[] = [
    { tenant: "alfa", plate: "01 A 111 AA" },
    { tenant: "alfa", plate: "01 A 222 AA" },
    { tenant: "beta", plate: "10 B 333 BB" },
  ];
  settings = new Map<string, string>();
  select(): Row[] {
    const t = this.settings.get("app.tenant_id");
    if (t === undefined) throw new Error("app.tenant_id o'rnatilmagan");
    return this.rows.filter((r) => r.tenant === t);
  }
}
const pool = new Conn();
function handleWeak(tenant: string | null): string {
  if (tenant) pool.settings.set("app.tenant_id", tenant);
  try {
    return pool.select().map((r) => r.plate).join(", ");
  } catch (e) {
    return "xato: " + (e as Error).message;
  }
}

console.log("alfa so'rovi:", handleWeak("alfa"));
console.log("tenant'siz so'rov:", handleWeak(null));
```

```text
alfa so'rovi: 01 A 111 AA, 01 A 222 AA
tenant'siz so'rov: 01 A 111 AA, 01 A 222 AA
```

Tenant'siz so'rov xato o'rniga alfa'ning ma'lumotini oldi. Policy ishlayapti, lekin ichiga noto'g'ri kontekst tushgan. Bu o'quv modelidagi mexanizm; real pool'da (masalan, tranzaksiya rejimida ishlaydigan pooler) xatti-harakat konfiguratsiyaga bog'liq, shuning uchun uni o'zingiz sinab ko'ring.

### 3. Tuzatilgan kod

```ts run
type Row = { tenant: string; plate: string };

class Conn {
  rows: Row[] = [
    { tenant: "alfa", plate: "01 A 111 AA" },
    { tenant: "alfa", plate: "01 A 222 AA" },
    { tenant: "beta", plate: "10 B 333 BB" },
  ];
  private local = new Map<string, string>();
  private tx = false;
  begin() { this.tx = true; }
  setLocal(k: string, v: string) {
    if (!this.tx) throw new Error("SET LOCAL tranzaksiyadan tashqarida");
    this.local.set(k, v);
  }
  end() { this.tx = false; this.local.clear(); } // tranzaksiya tugashi: qiymat yo'qoladi
  select(): Row[] {
    const t = this.local.get("app.tenant_id");
    if (t === undefined) throw new Error("app.tenant_id o'rnatilmagan"); // fail closed
    return this.rows.filter((r) => r.tenant === t);
  }
}

const pool = new Conn();

function handle(tenant: string | null): string {
  pool.begin();
  try {
    if (tenant) pool.setLocal("app.tenant_id", tenant);
    return pool.select().map((r) => r.plate).join(", ");
  } catch (e) {
    return "xato: " + (e as Error).message;
  } finally {
    pool.end();
  }
}

console.log("alfa so'rovi:", handle("alfa"));
console.log("tenant'siz so'rov:", handle(null));
console.log("beta so'rovi:", handle("beta"));
```

```text
alfa so'rovi: 01 A 111 AA, 01 A 222 AA
tenant'siz so'rov: xato: app.tenant_id o'rnatilmagan
beta so'rovi: 10 B 333 BB
```

### Tuzatish nima uchun yetarli

Kontekst tranzaksiyaga bog'langan va `finally` ichida har holda yo'qoladi, shuning uchun bir so'rov qiymati keyingisiga o'tmaydi. Sozlama yo'q bo'lsa, so'rov xato bilan to'xtaydi, hamma qatorni qaytarmaydi. Bu faqat ko'rsatilgan pool-qoldiq hujumini yopadi. Haqiqiy PostgreSQL'da yana uch shart bajarilishi kerak: ilova roli superuser, jadval egasi (FORCE'siz) yoki BYPASSRLS bo'lmasligi, hamma tenant jadvallarida RLS yoqilib policy yozilgan bo'lishi, view'lar `security_invoker` bilan yoki policy bilan mos tuzilgan bo'lishi. Bu modelning o'zi PostgreSQL xatti-harakatining isboti emas; ishlayotgan baza va aynan sizning pool rejimingizda sinov yozing.

## Qachon qo'llamaslik kerak

- RLS o'rniga ilova filtri yetarli bo'lgan hollar: bitta tenant, ichki vosita yoki juda sodda parkli tizim. RLS qo'shimcha murakkablik, sozlash va sinov xarajati.
- RLS ilova roli to'g'ri sozlanmaganda yolg'on xavfsizlik hissi beradi. Ilova superuser yoki egasi bilan ulanayotgan bo'lsa, policy'lar qo'llanmaydi, lekin hamma narsa "ishlaydi" ko'rinadi.
- Murakkab policy'lar (boshqa jadvalga sub-SELECT, funksiyalar) sekin ishlashi va race condition sababi bo'lishi mumkin. Policy ifodasi har so'rov uchun baholanadi, hujjat esa policy faqat joriy qatorning qiymatlariga tayansa eng sodda va tez bo'lishini aytadi. Indeks tenant_id bilan boshlanishi kerak, aks holda tenant filtri skanerlashga olib keladi (bu muallif tajribasi, o'lchab tekshiring).
- Ko'p tenant'li analitika, hisobot va migratsiyalar ko'pincha butun jadvalni ko'rishi kerak. Ular uchun alohida imtiyozli rol va ongli ro'yxat kerak; ularni oddiy so'rov yo'li bilan aralashtirmang.
- RLS faqat PostgreSQL'ga bog'liq. Boshqa bazaga o'tish rejasi bo'lsa, ilova qatlami nazorati baribir kerak. RLS ilova nazoratini almashtirmaydi, uni to'ldiradi (defense in depth, 3-dars).
- Tenant'ga alohida baza yoki schema berish kerak bo'lgan mijozlar uchun (shartnomaviy talab) RLS yetarli bo'lmasligi mumkin; bu 55-darsdagi modellar tanlovi.

## Stack'da: PostgreSQL, Prisma va Kysely

Quyidagi SQL brauzerda ishga tushmaydi (SQLite RLS'ni bilmaydi), shuning uchun u oddiy `sql` bloki. Dars tekshiruvida u haqiqiy PostgreSQL 16.15 serverida, toza bazada, avval jadval egasi (superuser) sifatida, so'ng `SET ROLE app_user` bilan sinalgan; natija blokdan keyin. Ilova uchun alohida, huquqi cheklangan rol:

```sql
-- migratsiya roli (jadval egasi) bilan:
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plate text NOT NULL
);
CREATE ROLE app_user LOGIN NOSUPERUSER NOBYPASSRLS;
GRANT SELECT, INSERT, UPDATE, DELETE ON vehicles TO app_user;

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles FORCE ROW LEVEL SECURITY;

-- tenant sharti restrictive: boshqa policy qo'shilsa ham majburiy bo'lib qoladi
CREATE POLICY tenant_guard ON vehicles AS RESTRICTIVE
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
-- restrictive policy yolg'iz ishlamaydi: kamida bitta permissive policy ham kerak
CREATE POLICY vehicles_all ON vehicles AS PERMISSIVE
  USING (true);
```

Restrictive policy'ni permissive policy bilan birga yozish sababi hujjatda: so'rov o'tishi uchun kamida bitta permissive policy ruxsat berishi kerak, restrictive'lar esa uni toraytiradi. CREATE POLICY hujjati buni tasdiqlaydi: faqat restrictive policy'lar bo'lsa, hech qaysi qator ko'rinmaydi (sinovda `vehicles_all` o'chirilganda `app_user` 0 qator oldi). Ikki tenant bilan sinov:

```sql
-- superuser: ikki tenant uchun bittadan qator (superuser RLS'ni chetlab o'tadi)
INSERT INTO vehicles (tenant_id, plate) VALUES
  ('11111111-1111-1111-1111-111111111111', '01 A 111 AA'),
  ('22222222-2222-2222-2222-222222222222', '10 B 333 BB');

SET ROLE app_user;
SELECT plate FROM vehicles;          -- sozlama yo'q

BEGIN;
SELECT set_config('app.tenant_id', '11111111-1111-1111-1111-111111111111', true);
SELECT plate FROM vehicles;          -- faqat o'z tenant'i
INSERT INTO vehicles (tenant_id, plate)
  VALUES ('22222222-2222-2222-2222-222222222222', 'X');   -- begona tenant'ga yozish
ROLLBACK;

SELECT plate FROM vehicles;          -- tranzaksiyadan keyin, o'sha sessiyada
```

```text
ERROR:  unrecognized configuration parameter "app.tenant_id"
    plate    
-------------
 01 A 111 AA
(1 row)

ERROR:  new row violates row-level security policy "tenant_guard" for table "vehicles"
ERROR:  invalid input syntax for type uuid: ""
```

Natijada `set_config` va psql sarlavhalari qisqartirilgan. U darsdagi qoidalarni isbotlaydi. Sozlama umuman o'rnatilmagan sessiyada so'rov "unrecognized configuration parameter" xatosi bilan to'xtaydi (fail closed). Tenant o'rnatilgach faqat o'z qatori ko'rinadi, boshqa tenant uchun `INSERT` esa `WITH CHECK` o'rnini bosuvchi implicit shart tufayli rad etiladi. Eng muhim kuzatuv oxirgi qatorda: `set_config(..., true)` ishlatilgan tranzaksiyadan keyin sozlama o'sha sessiyada "yo'q" emas, bo'sh satr (`''`) sifatida aniqlangan holda qoladi. `::uuid` cast bo'sh satrda xato beradi, shuning uchun policy shu holatda ham yopiq turadi, lekin `text` ustun bilan `tenant_id = current_setting(...)` taqqoslash xatosiz bo'sh natija beradi. Bu xatti-harakat PostgreSQL 16.15 da kuzatilgan va hujjatda alohida yozilmagan; shuning uchun o'z versiyangizda ulanishni qayta ishlatish sinovini (ikki tenant, bitta ulanish) albatta yozing.

Kysely bilan har so'rovni tranzaksiyaga o'rab, sozlamani `set_config(..., true)` bilan o'rnatish (bu kod ishga tushirilmaydi, ulanish kerak):

```ts
import { Kysely, sql } from "kysely";

interface DB {
  vehicles: { id: string; tenant_id: string; plate: string };
}

export async function withTenant<T>(db: Kysely<DB>, tenantId: string, fn: (trx: Kysely<DB>) => Promise<T>): Promise<T> {
  return db.transaction().execute(async (trx) => {
    // uchinchi argument true: qiymat faqat shu tranzaksiya uchun
    await sql`select set_config('app.tenant_id', ${tenantId}, true)`.execute(trx);
    return fn(trx);
  });
}

// foydalanish: tenant sharti kodda yo'q, uni baza policy'si qo'shadi
// const rows = await withTenant(db, session.tenantId, (trx) => trx.selectFrom("vehicles").selectAll().execute());
```

Prisma'da ham xuddi shu: interaktiv tranzaksiya (`prisma.$transaction(async (tx) => { await tx.$executeRaw\`select set_config('app.tenant_id', ${tenantId}, true)\`; ... })`). Muhim: pooler (masalan, PgBouncer) transaction-pooling rejimida bo'lsa, sessiya darajasidagi sozlamalar ishonchsiz, shuning uchun aynan tranzaksiya-lokal usul kerak. Ilova qatlamidagi tenant sharti (55-dars) qolsin: RLS uni almashtirmaydi, unutilganda ushlaydi.

## Xulosa

- RLS yoqilganda jadvalga kirish policy orqali o'tadi; policy bo'lmasa default-deny. `USING` ko'rinadigan qatorlarni, `WITH CHECK` yoziladiganlarini belgilaydi (ko'rsatilmasa `USING` ishlatiladi).
- Permissive policy'lar OR bilan, restrictive'lar AND bilan birikadi: tenant chegarasini restrictive qilish xavfsizroq.
- Superuser va BYPASSRLS rollar doim, jadval egasi FORCE bo'lmasa chetlab o'tadi: ilova oddiy, huquqi cheklangan rol bilan ulansin.
- Tenant kontekstini faqat tranzaksiya doirasida (`SET LOCAL` yoki `set_config(..., true)`) uzating; sozlama yo'q bo'lsa so'rov xato bersin (fail closed). Pool sessiya qiymatini keyingi so'rovga qoldirishi mumkin.
- View'lar, referential integrity (covert channel), zaxira nusxa va sub-SELECT'li policy'lar RLS'ning nozik joylari. RLS ilova nazoratini almashtirmaydi, uni to'ldiradi.
