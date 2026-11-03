---
n: 13
slug: string-rune-utf8
title: "string, byte, rune va UTF-8"
summary: "string o'zgarmas bayt ketma-ketligi ekani, len nimani o'lchashi, range va indekslash baytlar bilan rune'lar orasida qanday farq qilishi, konvertatsiyalar narxi va substring orqali xotira ushlab turish."
duration: 40
sources:
  - id: go-spec
    note: "String types, For statements with range clause (string uchun), Conversions to and from a string type bo'limlari"
  - id: gopl
    note: "3-bob (Basic Data Types): satrlar, UTF-8 va rune'lar qismi"
  - id: 100go
    note: "#36 (rune tushunchasi), #37 (satr iteratsiyasi), #38 (trim funksiyalari), #39 (satr birlashtirish), #40 (ortiqcha konvertatsiya), #41 (substring va xotira sizishi)"
quiz:
  - q: "s := \"hêllo\" bo'lsa, len(s) nechaga teng? ('ê' harfi UTF-8 da 2 bayt egallaydi)"
    options:
      - "5, chunki besh belgi bor"
      - "6, chunki len baytlarni sanaydi"
      - "10, chunki har belgi 2 bayt"
      - "Kompilyatsiya xatosi: len string uchun ishlamaydi"
    answer: 1
    explain: "len(string) baytlar sonini qaytaradi. 'h', 'l', 'l', 'o' bittadan, 'ê' ikki bayt: jami 6. Rune sonini utf8.RuneCountInString(s) beradi (5)."
  - q: "for i, r := range \"aÿb\" { ... } ('ÿ' - U+00FF, 2 bayt) sikli qaysi indekslarni beradi?"
    options:
      - "0, 1, 2"
      - "0, 2, 3"
      - "0, 1, 2, 3"
      - "0, 1, 3"
    answer: 3
    explain: "range string bo'yicha rune'larni aylanadi va indeks sifatida rune boshlangan bayt o'rnini beradi: 'a' 0-da, 'ÿ' 1-da (2 bayt egallaydi), 'b' 3-da. 2-indeks rune ichida, shuning uchun uni sikl bermaydi."
  - q: "strings.TrimRight(\"123oxo\", \"xo\") natijasi nima?"
    options:
      - "123"
      - "123o"
      - "123ox"
      - "123oxo, chunki \"xo\" oxirida emas"
    answer: 0
    explain: "TrimRight ikkinchi argumentni to'plam sifatida oladi va oxiridan 'x' yoki 'o' bo'lgan hamma rune'larni olib tashlaydi. Aniq suffix'ni olib tashlash uchun TrimSuffix kerak (u \"123o\" qaytaradi). Bu 100 Go Mistakes #38."
  - q: "Servis 1 MiB li log qatorlaridan device := line[28:34] bo'lagini olib, global map'ga kalit qilib yozadi. Xotira nega o'sadi va qanday tuzatiladi?"
    options:
      - "Bo'lak string emas, []byte; uni string(...) ga o'tkazish kerak"
      - "map har doim kalit nusxasini saqlaydi, xotira o'sishi map'ning o'zidan"
      - "Substring asl satrning baytlariga ishora qiladi va butun 1 MiB ni tirik ushlab turadi; strings.Clone(device) kerak"
      - "len(device) kichik bo'lgani uchun GC uni tezda yig'adi"
    answer: 2
    explain: "string header (pointer + len) asl satr baytlariga qaraydi, nusxa olmaydi. Bo'lak saqlanguncha butun satr xotirada. strings.Clone yangi allokatsiya qiladi va kichik nusxa asl satrdan mustaqil bo'ladi (100 Go Mistakes #41)."
  - q: "n := 65 bo'lsin. Qaysi ifoda \"65\" satrini beradi?"
    options:
      - "string(n)"
      - "strconv.Itoa(n)"
      - "string(rune(n))"
      - "string(byte(n))"
    answer: 1
    explain: "string(n) va string(rune(n)) ham, string(byte(n)) ham 65 kodli belgini, ya'ni \"A\" ni beradi. Raqamli ko'rinish uchun strconv.Itoa(n) yoki fmt.Sprint(n). go vet string(n) uchun 'conversion from int to string yields a string of one rune' deb ogohlantiradi."
  - q: "Nima uchun 100 ta qismni s += part bilan birlashtirish strings.Builder ga qaraganda ancha ko'p allokatsiya qiladi?"
    options:
      - "Builder kompilyator tomonidan stack'da ajratiladi"
      - "+= operatori Go 1.24 dan beri taqiqlangan"
      - "Builder string'ni mutatsiya qiladi, shuning uchun xotira umuman ajratilmaydi"
      - "string o'zgarmas: har += yangi satr ajratadi va eskisini nusxalaydi; Builder bitta bufer to'ldiradi"
    answer: 3
    explain: "Satrlar o'zgarmas, shuning uchun har += yangi massiv ajratib, eski baytlarni nusxalaydi. Builder ichki []byte ga yozadi va oxirida uni nusxasiz string qiladi. Biz o'lchaganda (Go 1.24.7) 100 qism uchun += 99 ta, Builder+Grow 1 ta allokatsiya berdi."
task:
  title: "Marshrut nomini UTF-8 buzmasdan qisqartirish va teskari qilish"
  prompt: |
    Dispetcher panelida marshrut nomlari ekranga sig'adigan uzunlikka qisqartiriladi. Nomlar lotin va kirill alifbosida (`Қашқадарё`, `Ўзбекистон`) bo'ladi. Boshlang'ich kod baytlar bo'yicha ishlaydi va ikki joyda UTF-8 ni buzadi:

    1. `shorten(name, max)` `name[:max-1]` bilan baytlarni kesadi: kirill nomlarda rune o'rtasidan kesilib, `\xd2` kabi yaroqsiz bayt chiqadi.
    2. `reverse` baytlar tartibini almashtiradi va natija yaroqsiz UTF-8 bo'ladi.

    Vazifa: `shorten` `max` ni rune'larda hisoblasin (natija `max` ta rune dan oshmasin, oxiri `…` belgisi bilan), `reverse` esa rune'lar bo'yicha ishlasin. Imzolar o'zgarmasin. Kutilgan natija: barcha chiqish `valid=true`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "unicode/utf8"
    )

    // shorten marshrut nomini ekranga sig'adigan uzunlikka (max ta belgi) keltiradi.
    func shorten(name string, max int) string {
        if len(name) <= max {
            return name
        }
        return name[:max-1] + "…"
    }

    // reverse nomni teskari tartibda qaytaradi.
    func reverse(s string) string {
        b := []byte(s)
        for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
            b[i], b[j] = b[j], b[i]
        }
        return string(b)
    }

    func main() {
        routes := []string{"Toshkent-Samarqand", "Қашқадарё", "Ўзбекистон"}
        for _, r := range routes {
            short := shorten(r, 8)
            fmt.Printf("%q valid=%t\n", short, utf8.ValidString(short))
        }
        fmt.Printf("%q valid=%t\n", reverse("Қашқадарё"), utf8.ValidString(reverse("Қашқадарё")))
    }
  solution: |
    package main

    import (
        "fmt"
        "unicode/utf8"
    )

    // shorten marshrut nomini ekranga sig'adigan uzunlikka (max ta belgi) keltiradi.
    // max rune'larda hisoblanadi; uchta nuqta o'rniga bitta U+2026 belgisi ishlatiladi.
    func shorten(name string, max int) string {
        if max < 1 || utf8.RuneCountInString(name) <= max {
            return name
        }
        runes := []rune(name)
        return string(runes[:max-1]) + "…"
    }

    // reverse nomni rune'lar bo'yicha teskari tartibda qaytaradi.
    func reverse(s string) string {
        r := []rune(s)
        for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
            r[i], r[j] = r[j], r[i]
        }
        return string(r)
    }

    func main() {
        routes := []string{"Toshkent-Samarqand", "Қашқадарё", "Ўзбекистон"}
        for _, r := range routes {
            short := shorten(r, 8)
            fmt.Printf("%q valid=%t\n", short, utf8.ValidString(short))
        }
        fmt.Printf("%q valid=%t\n", reverse("Қашқадарё"), utf8.ValidString(reverse("Қашқадарё")))
    }
  solutionNotes: |
    - `utf8.RuneCountInString` rune sonini O(n) da sanaydi va `max` bilan solishtiradi: baytlar soni emas, ko'rinadigan belgi soni muhim.
    - `[]rune(name)` satrni code point'larga ajratadi; `runes[:max-1]` rune chegarasida kesadi, `string(...)` esa yana to'g'ri UTF-8 qiladi. Natija `max` ta rune: `max-1` ta harf va `…`.
    - `reverse` ham `[]rune` ustida ishlaydi. Baytlarni almashtirish ko'p baytli rune ichidagi tartibni buzgan edi.
    - Cheklov: bu kod code point'larni almashtiradi, grafema klasterlarini (harf + birlashtiruvchi belgi, ba'zi emoji ketma-ketliklari) emas. Bunday matn uchun maxsus kutubxona kerak; telemetriya nomlarida odatda yetarli.
    - `max < 1` himoyasi `runes[:max-1]` dagi panic'ning oldini oladi.
  checklist:
    - "`shorten` va `reverse` natijalari har doim `utf8.ValidString` dan o'tadi"
    - "`shorten(\"Қашқадарё\", 8)` aynan 8 ta rune qaytaradi (`Қашқада…`)"
    - "Qisqa nom (max dan kam rune) o'zgarmay qaytariladi"
    - "`max < 1` panic bermaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Telemetriya servisi turli manbalardan matn oladi: qurilma nomlari, marshrut nomlari, haydovchi izohlari. O'zbekiston bozorida bu matn lotin va kirill alifbosida, ba'zan emoji bilan keladi. Node.js'dan kelgan dasturchi `str.length` va `str[i]` ga o'rganib qolgan va ular UTF-16 kod birliklari ustida ishlaydi; Go'da esa xuddi shu ifodalar boshqacha ma'noga ega. `len("Қашқадарё")` 9 emas, 18 qaytaradi; `s[:3]` kirill harfni o'rtasidan kesadi.

Natijada production'da uchta muammo uchraydi. Birinchisi: ekran uchun nomni `name[:20]` bilan qisqartirish yaroqsiz UTF-8 beradi, `encoding/json` yaroqsiz baytlarni jimgina U+FFFD ga almashtiradi (`json.Marshal` hujjati), ya'ni nom buziladi va xato ham chiqmaydi; UTF-8 kodlashdagi PostgreSQL esa bunday ketma-ketlikni rad etadi. Ikkinchisi: katta satrdan olingan kichik bo'lak butun satrni xotirada ushlab turadi. Uchinchisi: `+=` bilan satr yig'ish ming marta nusxalash degani. Bu darsda satrning tilda va xotirada tuzilishini ko'ramiz.

## Asosiy g'oya

### string - o'zgarmas baytlar ketma-ketligi

Spetsifikatsiya aniq yozadi: string qiymati (bo'sh bo'lishi mumkin) baytlar ketma-ketligi, uzunligi baytlar soni, va satrlar o'zgarmas: yaratilgandan keyin tarkibini o'zgartirib bo'lmaydi. Satr baytlariga indeks bilan murojaat qilish mumkin (`s[i]` - `byte`), lekin ularning manzilini olish mumkin emas: `&s[i]` noto'g'ri. Satr UTF-8 bo'lishi shart emas: u ixtiyoriy baytlar to'plami bo'lishi mumkin, UTF-8 esa satr literallari va ba'zi amallarning (`range`, konvertatsiyalar) kodlash qoidasi.

Shuning uchun uch tushuncha aralashmasligi kerak:

- `byte` (`uint8`'ning alias'i) - bitta bayt.
- `rune` (`int32`'ning alias'i) - bitta Unicode code point qiymati.
- `string` - baytlar ketma-ketligi; unda rune'lar UTF-8 kodlash bilan joylashgan, bitta rune 1 dan 4 baytgacha egallaydi (100 Go Mistakes #36).

### range va indekslash

`len(s)` va `s[i]` baytlar bilan ishlaydi. `for i, r := range s` esa spetsifikatsiyaga ko'ra code point'lar bo'yicha aylanadi: `i` - rune'ning birinchi baytining indeksi, `r` - `rune` tipidagi qiymat. Agar yaroqsiz UTF-8 ketma-ketlik uchrasa, `r` qiymati U+FFFD (replacement character) bo'ladi va sikl keyingi baytga bir qadam siljiydi. 100 Go Mistakes #37 shu farqni aralashtirishni alohida xato deb sanaydi: `range` indeksi rune tartib raqami emas, bayt o'rni.

`[]rune(s)` konvertatsiyasi satrni code point'lar slice'iga ochadi (o'zgartirish va rune bo'yicha indekslash uchun), `string(runes)` esa teskarisini qiladi. Spetsifikatsiya konvertatsiyalarni ham beradi: `[]byte(s)` baytlar slice'ini, `string(bytes)` esa baytlardan satrni yaratadi. Natija sig'imi implementatsiyaga bog'liq.

### Satr header'i va substring

Slice kabi satr ham kichik header: baytlarga pointer va uzunlik. Bu 16 bayt (64-bitli platformada), slice'dan 8 bayt kam, chunki sig'im yo'q: o'zgarmas satr o'sa olmaydi. Substring `s[i:j]` yangi header yaratadi va nusxalamaydi: bo'lak asl satr baytlariga qaraydi. Bu arzon, lekin xotira uchun xavfli: kichik bo'lak butun asl satrni tirik ushlab turadi (100 Go Mistakes #41; yechim `strings.Clone`).

## Chuqurroq: baytlar, rune'lar va narxlar

### Birliklarni ko'rish

Quyidagi dastur bitta kirill so'z ustida har bir birlikni ko'rsatadi:

```go
package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	s := "Қашқадарё"
	fmt.Println("len (bayt):      ", len(s))
	fmt.Println("rune soni:       ", utf8.RuneCountInString(s))

	for i, r := range s {
		fmt.Printf("%d:%c(%d bayt) ", i, r, utf8.RuneLen(r))
	}
	fmt.Println()

	// bayt indeksi bilan kesish rune ichidan o'tishi mumkin
	cut := s[:3]
	fmt.Printf("s[:3] = %q, to'g'rimi: %t\n", cut, utf8.ValidString(cut))

	// noto'g'ri UTF-8 ketma-ketligi range da U+FFFD beradi
	bad := "ok\xffok"
	for i, r := range bad {
		fmt.Printf("%d:%U ", i, r)
	}
	fmt.Println()

	runes := []rune(s)
	fmt.Println("[]rune uzunligi:", len(runes), "| 3-rune:", string(runes[2]))
}
```

Go 1.24.7 da chiqish:

```text
len (bayt):       18
rune soni:        9
0:Қ(2 bayt) 2:а(2 bayt) 4:ш(2 bayt) 6:қ(2 bayt) 8:а(2 bayt) 10:д(2 bayt) 12:а(2 bayt) 14:р(2 bayt) 16:ё(2 bayt) 
s[:3] = "Қ\xd0", to'g'rimi: false
0:U+006F 1:U+006B 2:U+FFFD 3:U+006F 4:U+006B 
[]rune uzunligi: 9 | 3-rune: ш
```

Olti kuzatuv: (1) 9 harfli so'z 18 bayt, har kirill harfi ikki bayt; (2) `range` indekslari 0, 2, 4 va hokazo, har qadam rune uzunligiga teng; (3) `s[:3]` rune ichidan kesadi va natija yaroqsiz UTF-8, `%q` bunday baytni `\xd0` ko'rinishida ko'rsatadi; (4) yaroqsiz bayt `\xff` `range` da U+FFFD beradi va indeks bir qadam siljiydi; (5) `[]rune` uzunligi rune soniga teng; (6) `utf8.ValidString` bu holatni aniqlaydi.

### Konvertatsiyalar nusxa oladi

`[]byte(s)` va `string(b)` konvertatsiyalari alohida qiymat hosil qiladi: konvertatsiya orqali olingan `[]byte`ni o'zgartirish asl satrni o'zgartirmaydi (quyida tekshiramiz), chunki satr o'zgarmas bo'lib qolishi kerak. Katta hajmli oqimda bunday konvertatsiyalar GC yukiga aylanadi. 100 Go Mistakes #40 maslahati: `bytes` paketida `strings` paketining deyarli har bir funksiyasi bor, shuning uchun baytlar bilan ishlayotgan bo'lsangiz, satrga o'tkazmasdan `bytes.Split`, `bytes.Contains` va shu kabilarni ishlating. Konvertatsiyalarning aniq qachon nusxa olmasligi kompilyator optimizatsiyasi, uni dastur mantig'iga bog'lamang.

### Integer dan string

`string(65)` oddiy xato: u 65 kodli rune'ni ("A") beradi, "65" ni emas. `go vet` bu shaklga ogohlantirish beradi (Go 1.24.7 da tekshirildi: `conversion from int to string yields a string of one rune, not a string of digits`). Raqam matnini `strconv.Itoa` yoki `fmt.Sprint` bilan oling.

### Satr birlashtirish va Trim

Satr o'zgarmasligi birlashtirishga ta'sir qiladi: `s += part` har safar yangi satr ajratadi. 100 Go Mistakes #39 sikl ichida `strings.Builder` ishlatishni tavsiya qiladi, `Grow` bilan oldindan sig'im berilsa, yana yaxshi. Quyida o'lchov:

```go
package main

import (
	"fmt"
	"strings"
	"testing"
)

var parts = func() []string {
	p := make([]string, 100)
	for i := range p {
		p[i] = "x"
	}
	return p
}()

var sink string

func plus() {
	s := ""
	for _, p := range parts {
		s += p
	}
	sink = s
}

func builder() {
	var b strings.Builder
	b.Grow(len(parts))
	for _, p := range parts {
		b.WriteString(p)
	}
	sink = b.String()
}

func main() {
	fmt.Println("+= bilan, ajratishlar:   ", testing.AllocsPerRun(100, plus))
	fmt.Println("Builder+Grow, ajratishlar:", testing.AllocsPerRun(100, builder))
}
```

```text
+= bilan, ajratishlar:    99
Builder+Grow, ajratishlar: 1
```

100 qismni `+=` bilan yig'ish 99 ta, `Builder` bilan 1 ta allokatsiya berdi (`testing.AllocsPerRun`, Go 1.24.7, linux/amd64). Kichik sonli qismlar uchun farq sezilmaydi; allokatsiyalar soni qismlar soniga chiziqli o'sadi.

`strings.TrimLeft/TrimRight` ikkinchi argumentni belgilar to'plami sifatida oladi, prefiks/suffix sifatida emas (100 Go Mistakes #38). `strings.TrimSuffix("123oxo", "xo")` `"123o"`, `TrimRight("123oxo", "xo")` esa `"123"` qaytaradi: bu xato ham bilinmay, faqat kirishda `x` yoki `o` bilan tugaydigan qiymat kelganda chiqadi.

## Misol: substring xotirani ushlab turadi

Substring nusxalanmasligini manzillar orqali tekshiramiz. `unsafe.StringData` satrning birinchi baytiga pointer beradi (Go 1.20 dan):

```go
package main

import (
	"fmt"
	"strings"
	"unsafe"
)

func main() {
	fmt.Println("string header o'lchami:", unsafe.Sizeof(""), "bayt")

	log := "2026-11-03T07:17:46Z device=T-1042 fuel=41.5"
	id := log[28:34] // qurilma raqami: yangi string, lekin nusxa emas
	fmt.Printf("bo'lak: %q\n", id)

	base := unsafe.Pointer(unsafe.StringData(log))
	sub := unsafe.Pointer(unsafe.StringData(id))
	fmt.Println("bo'lak asl string ichida:", unsafe.Add(base, 28) == sub)

	cp := strings.Clone(id)
	fmt.Println("Clone dan keyin ham ichida:", unsafe.Add(base, 28) == unsafe.Pointer(unsafe.StringData(cp)))
}
```

Go 1.24.7, linux/amd64 da chiqish:

```text
string header o'lchami: 16 bayt
bo'lak: "T-1042"
bo'lak asl string ichida: true
Clone dan keyin ham ichida: false
```

`id` pointer'i asl `log` boshidan 28 bayt narida, ya'ni bir xil xotira. `strings.Clone` esa yangi allokatsiya qiladi va nusxa asl satr ichida emas. Ikkinchi o'lchov: satr va byte slice konvertatsiyasi qanday xatti-harakat qiladi:

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	s := "A1"
	b := []byte(s)
	b[0] = 'B'
	fmt.Println("s:", s, "| b:", string(b), "(konvertatsiya nusxa oladi)")

	fmt.Println("string(rune(65)):", string(rune(65)))
	fmt.Println("strconv.Itoa(65):", strconv.Itoa(65))

	n := 1042
	fmt.Println("T-" + strconv.Itoa(n))
}
```

```text
s: A1 | b: B1 (konvertatsiya nusxa oladi)
string(rune(65)): A
strconv.Itoa(65): 65
T-1042
```

Birinchi qatorda `b` o'zgargan, `s` yo'q: konvertatsiya nusxa. `string(rune(65))` "A", `strconv.Itoa(65)` "65". Bu xatolarning hammasi xotira va to'g'rilik darajasida, lekin ularni topish uchun aynan satr modelini bilish kerak.

## Qachon qo'llamaslik kerak

- `[]rune` ga konvertatsiya har qanday satr uchun to'g'ri javob emas. U 4 baytli element ajratadi (4 baravar xotira), shuning uchun faqat rune bo'yicha indeks yoki almashtirish kerak bo'lganda ishlating. Faqat sanash kerak bo'lsa `utf8.RuneCountInString`, faqat aylanish kerak bo'lsa `range`.
- Rune "foydalanuvchi ko'radigan belgi" emas. Harf va birlashtiruvchi diakritik belgi, yoki ba'zi emoji ketma-ketliklari bir nechta rune. Teskari qilish yoki qisqartish rune chegarasida to'g'ri, lekin grafema chegarasida emas. Bunday matn uchun maxsus kutubxona kerak.
- `strings.Clone` ni har satrga qo'llamang. Hujjatiga ko'ra u kam hollarda, profil kerak ekanini ko'rsatganda ishlatiladi. Qisqa yashaydigan bo'lak uchun nusxa foydasiz.
- Bayt ma'lumotini (hash, shifrlangan matn, protokol kadri) `string` ga solmang: string UTF-8 bo'lishi shart emas, lekin ko'p kutubxona (JSON, SQL drayverlar) uni UTF-8 deb kutadi. Ikkilik uchun `[]byte`.
- `unsafe.String`/`unsafe.StringData` bilan nusxasiz konvertatsiya qilishdan oldin o'ylang: hujjat `unsafe.String` ga berilgan baytlar satr yashaguncha o'zgarmasligi kerakligini aytadi. Bu ichki optimizatsiya, ommaviy API emas (69-dars).

## Stack'da: Node.js/TypeScript bilan solishtirish

JavaScript satri UTF-16 kod birliklarining ketma-ketligi: `"😀".length` 2, `str.length` esa belgi sonini bermaydi. Go satri UTF-8 baytlari: `len("😀")` 4. Ikkala muhitda ham "belgi" ni sanash uchun alohida amal kerak, faqat birliklar boshqa: Go'da `utf8.RuneCountInString`, JavaScript'da `[...str].length`.

Amaliy qoidalar:

- Foydalanuvchi matnini uzunlikka cheklashda (maydon limitlari, ekran uchun qisqartirish) `utf8.RuneCountInString` va rune bo'yicha kesishdan foydalaning. API chegarasida bayt limiti (masalan, "255 bayt") aniq yozilgan bo'lsa, baytlar bilan, lekin rune chegarasida kesing.
- Tashqaridan kelgan matnni qabul qilishda `utf8.ValidString` bilan tekshiring: yaroqsiz bayt keyinroq JSON'da jimgina U+FFFD ga aylanadi yoki saqlash bosqichida rad etiladi.
- Log qatori va protokol parserida bo'lakni uzoq saqlasangiz `strings.Clone`, baytlar uchun `bytes.Clone` ishlating.
- Satr yig'ish kerak bo'lganda `strings.Builder` va `Grow`; yo'q bo'lsa 2-3 ta qismni `+` bilan qo'shish yetarli.

## Xulosa

- `string` - o'zgarmas baytlar ketma-ketligi (pointer + uzunlik, 16 bayt); `len` va `s[i]` baytlar bilan ishlaydi.
- `rune` - code point (`int32`); UTF-8 da bir rune 1 dan 4 baytgacha.
- `range` satrni rune'lar bo'yicha aylanadi: indeks - bayt o'rni, yaroqsiz bayt U+FFFD beradi.
- `[]byte(s)` va `string(b)` konvertatsiyalari nusxa oladi; `string(n)` raqam matnini bermaydi, `strconv.Itoa` beradi.
- Substring asl satrni xotirada ushlab turadi; uzoq saqlanadigan bo'lak uchun `strings.Clone`.
- Sikl ichida satr yig'ish uchun `strings.Builder`; qisqartish va teskarilash rune chegarasida bajariladi, tashqi matn esa `utf8.ValidString` bilan tekshiriladi.
