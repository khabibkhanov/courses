# Dars yozish qoidalari (Clean Code kursi)

Bu fayl har bir darsni yozish uchun yagona standart. Namuna: `lessons/001-clean-code-nima.md`.

## Fayl

- Yo'l: `content/clean-code/lessons/NNN-slug.md` (NNN - uch xonali raqam, slug - `course.yaml`dagi bilan bir xil).
- Frontmatter sxemasi: `src/lib/content/schema.ts` (`lessonFrontmatterSchema`).
- Tekshiruv: `npx tsx scripts/validate-content.ts --partial --from N --to M`. Xatosiz o'tishi shart.

## Til va uslub

- O'zbek tili, lotin yozuvi. Apostrof oddiy `'` (o', g', ma'no).
- Texnik terminlar inglizcha qoladi: refactoring, coupling, dependency injection, side effect, code smell. Birinchi uchraganda qisqa o'zbekcha izoh berish mumkin.
- **Em-dash (—) va en-dash (–) taqiqlangan.** Faqat oddiy defis `-`. Validator buni tekshiradi.
- Emoji yo'q. Maqtov, "ajoyib", "kuchli" kabi bo'sh so'zlar yo'q. To'g'ridan-to'g'ri, aniq.
- O'quvchi: 5 yillik tajribali full-stack dasturchi (Node.js/NestJS, React/Next.js, TypeScript, PostgreSQL). Boshlang'ich narsalarni tushuntirmang, lekin har bir mavzuni chuqur bering.

## Aniqlik va manbalar

- Har bir dars `course.yaml`dagi manbalarga tayanadi. Qo'shimcha manba kerak bo'lsa, faqat `sources.yaml`da bor id'lardan foydalaning.
- Manbaga biror fikrni nisbat bersangiz, u haqiqatan o'sha manbada bo'lishi shart. Bob raqami yoki nomini aniq bilmasangiz, uni yozmang (`note` maydonida umumiyroq yozing, masalan "funksiyalar haqidagi bob").
- Web manbalardagi (martinfowler.com, refactoring.com, docs) aniq da'volarni WebFetch bilan tekshiring.
- Taxmin yoki munozarali fikr bo'lsa, buni ochiq ayting ("bu muallifning tajribaviy bahosi", "bu borada fikrlar turlicha").
- Mualliflar o'rtasida kelishmovchilik bo'lsa (Martin va Ousterhout, TDD tarafdorlari va tanqidchilari), ikkala tomonni adolatli bering.
- Mualliflik huquqi: kitoblardan uzun iqtibos keltirmang. Bitta manbadan ko'pi bilan bitta, 15 so'zdan qisqa iqtibos. Qolgani o'z so'zlaringiz bilan.

## Tuzilma (majburiy `##` bo'limlar, shu tartibda)

1. `## Muammo` - bu mavzu qanday real og'riqni hal qiladi.
2. `## Asosiy g'oya` - qoidaning o'zi, manbalarga tayangan holda.
3. `## Chuqurroq: ...` - mexanika, nozik holatlar, turli mualliflar qarashi. Kerak bo'lsa `###` kichik bo'limlar.
4. `## Misol: ...` - yomon va yaxshi kod, TypeScript. Har o'zgarish nega qilinganini tushuntiring.
5. `## Qachon qo'llamaslik kerak` - qoida zarar qiladigan holatlar, trade-off'lar. Halol va aniq.
6. `## Stack'da: ...` (tavsiya etiladi) - TS/Node/NestJS/React/Next.js'dagi aniq qo'llanilishi.
7. `## Xulosa` - 4-6 ta qisqa band.

- Matn hajmi: kamida 1100 so'z (kod bloklarisiz), maqsad 1400-2000.
- Kamida bitta ` ```ts ` yoki ` ```tsx ` blok. Kod real, kompilyatsiya bo'ladigan, `any`siz (agar `any` o'zi yomon misol bo'lmasa).
- Misollar domeni real bo'lsin: buyurtmalar, to'lovlar, transport parki (GPS, yoqilg'i), foydalanuvchilar, ijara. Foo/bar yo'q.
- Boshqa darslarga havola: "(23-dars)" ko'rinishida, faqat `course.yaml`dagi raqam va mavzuga mos.

## Mashqlar

- `quiz`: 5-6 savol. Faktni yodlash emas, tushunishni tekshirsin (vaziyat, kod parchasi, "qaysi holatda..."). Noto'g'ri variantlar ishonarli bo'lsin. `answer` - 0 dan boshlanadigan indeks. **To'g'ri javob o'rnini aralashtiring** (0, 1, 2, 3 hammasi uchrasin). `explain` nega to'g'ri va nega boshqalari noto'g'ri ekanini aytadi.
- `task`: amaliy topshiriq. `starter` - muammoli, lekin ishlaydigan kod (real hajmda, 15-50 qator). `solution` - to'liq yechim. `solutionNotes` - markdown ro'yxat, nima va nega. `checklist` - 3-6 ta tekshiriladigan band. `lang`: odatda `ts` yoki `tsx`.

## YAML ehtiyotkorligi

- `: ` yoki `#` bor, yoki `"`/`'`/`[`/`{`/`-` bilan boshlanadigan qiymatlarni qo'shtirnoqqa oling.
- Qo'shtirnoq ichida `"` bo'lsa `\"` qiling.
- Kod va ko'p qatorli matn uchun `|` block scalar, bir xil chekinish bilan.

## Ishga tushiriladigan kod (playground)

Kod blokiga `run` belgisi qo'shilsa, u darsda tahrirlanadigan va brauzerda ishga tushiriladigan blokka aylanadi:

````
```python run
print("salom")
```
````

- Tillar: `python`, `sql` (SQLite), `js`, `ts`. Boshqa til bilan `run` - validator xatosi.
- Blok o'zi yetarli bo'lishi kerak: SQL'da jadvallarni yaratish va ma'lumot qo'shish shu blok ichida; JS/TS'da natija `console.log` bilan chiqariladi. `import` ishlamaydi.
- Kod yozishdan oldin lokal ishga tushirib, natijasini tekshiring. Matnda natijaga tayanilsa, u haqiqiy natija bilan bir xil bo'lsin.
- Hamma blokni `run` qilmang: faqat o'quvchi o'zgartirib ko'rishidan foyda bo'ladigan, natija chiqaradigan misollar uchun.
- Vaqt chegarasi: Python 15 soniya, qolganlari 5 soniya.

### Testli mashq (`test` bloki)

`run` blokidan darhol keyin shu tildagi ```` ```<til> test ```` bloki qo'yilsa, u o'quvchiga ko'rinmaydi va blok mashqqa aylanadi: "Tekshirish" tugmasi testlarni o'quvchi kodidan keyin ishga tushiradi va "5 / 7 test o'tdi" ko'rinishida natija chiqaradi. O'quvchining kodi va natijasi brauzerda shu dars progressida saqlanadi.

````
```python run
def lower_bound(a, x):
    # Yechimingizni shu yerga yozing
    return -1
```

```python test
check("bo'sh ro'yxat", lambda: lower_bound([], 5) == 0)
check("takrorlar", lambda: lower_bound([2, 2, 2, 2], 2) == 0)
```
````

- Tillar: `python`, `js`, `ts` (`sql` uchun test yo'q). JS/TS'da: `check("nom", () => shart)`, shart `async` bo'lishi mumkin.
- `check` ichidagi xato yoki `false` - test o'tmadi; xato matni o'quvchiga ko'rsatiladi. Test nomi o'quvchi nimani tuzatishi kerakligini aytsin.
- Ikki blok orasida matn bo'lmasin, tillar bir xil bo'lsin - aks holda validator xatosi.
- Boshlang'ich kod testlardan o'tmasligi, namunaviy yechim esa hammasidan o'tishi kerak. Ikkalasini `python3 scripts/run-blocks.py <fayl>` bilan tekshiring (u test bloklarini ham ishga tushiradi; boshlang'ich kodda `TEST XATO` kutilgan natija).
- Faqat to'g'ri javobni emas, kerak bo'lsa usulni ham tekshiring (masalan, binary search o'rniga chiziqli qidiruv o'tmasligi uchun o'qishlar sonini sanash).

## Atamalar lug'ati

Dars yangi texnik atamani tushuntirsa, uni `content/glossary/` dagi YAML faylga qo'shing:

```yaml
- term: cache-aside
  aliases: [lazy loading]
  uz: "Ilova avval cache'dan o'qiydi, topilmasa bazadan olib cache'ga yozadi."
  course: system-design
  lesson: 23
```

- `term` va `aliases` - darslar matnida aynan shu ko'rinishda uchraydigan shakllar. Matnda atama birinchi uchragan joy avtomatik lug'atga bog'lanadi (kod, havola va sarlavhalardan tashqari; atama tushuntirilgan darsning o'zida bog'lanmaydi). Atama faqat o'z kursi darslarida bog'lanadi. Katta harfli qisqartmalar (SRP, DRY) faqat katta harf bilan topiladi.
- `uz` - 1-2 gap, oddiy matn. `lesson` - atama batafsil tushuntirilgan dars.
- Umumiy so'zlarni (data, server, test, class) qo'shmang: ular har darsda ortiqcha havolaga aylanadi.
- Validator tekshiradi: takror yo'q, atama o'z darsida va darslar matnida uchraydi, dars yozilgan.
