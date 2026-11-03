---
n: 20
slug: stack-heap-escape
title: "Stack va heap: escape analysis va -gcflags=-m"
summary: "Qiymat stack'da yoki heap'da yashashini kim hal qiladi, escape analysis nimani tekshiradi, -gcflags=-m chiqishini qanday o'qish kerak va allokatsiyani haqiqatan o'lchash uchun testing.AllocsPerRun."
duration: 40
sources:
  - id: gc-guide
    note: "Go qiymatlari qayerda yashashi (stack va heap), heap allokatsiyalarini kamaytirish g'oyasi"
  - id: go-faq
    note: "O'zgaruvchi heap'da yoki stack'da ekanini bilish kerakmi degan savol: joy semantikaga ta'sir qilmaydi, samaradorlikka ta'sir qiladi"
  - id: diagnostics
    note: "Profiling vositalari tavsifi (allokatsiya profili uchun kontekst)"
quiz:
  - q: "func newReading() *Reading { r := Reading{}; return &r }. -gcflags=-m bu funksiya haqida nima yozadi?"
    options:
      - "r does not escape"
      - "Kompilyatsiya xatosi: lokal o'zgaruvchi manzilini qaytarib bo'lmaydi"
      - "moved to heap: r"
      - "leaking param: r"
    answer: 2
    explain: "Funksiya qaytgandan keyin ham r ga havola yashaydi, shuning uchun kompilyator r ni heap'ga ko'chiradi (moved to heap: r). Go'da lokal o'zgaruvchi manzilini qaytarish xato emas: xotirani escape analysis xavfsiz boshqaradi."
  - q: "Kod ichida p := &x yozdingiz. Bu x ning albatta heap'da bo'lishini bildiradimi?"
    options:
      - "Yo'q: kompilyator pointer funksiyadan tashqariga chiqmasligini isbotlay olsa, x stack'da qoladi"
      - "Ha: & operatori doim heap'ga ko'chiradi"
      - "Ha, agar x struct bo'lsa"
      - "Faqat x 64 baytdan katta bo'lsa"
    answer: 0
    explain: "Manzil olish heap uchun nomzod qiladi, lekin hal qiluvchi narsa escape analysis natijasi. Bizning sum funksiyamizdagi new(float64) pointer faqat funksiya ichida ishlatilgani uchun 'does not escape' chiqdi va heap'ga bormadi."
  - q: "testing.AllocsPerRun(1000, f) uchun f() ichida var buf [16 << 20]byte e'lon qilinsa, natija nimani ko'rsatdi?"
    options:
      - "0: massiv hajmi stack'ga sig'adi"
      - "Panic: stack to'lib ketadi"
      - "Kompilyatsiya xatosi"
      - "1: juda katta lokal o'zgaruvchi heap'ga ko'chdi"
    answer: 3
    explain: "Biz o'lchaganimizda [64 KiB]byte lokal massiv uchun 0, [16 MiB]byte uchun 1 allokatsiya chiqdi. Kompilyator juda katta o'zgaruvchilarni stack'da saqlamaydi. Aniq chegara kompilyator tafsiloti va versiyaga qarab o'zgarishi mumkin; muhimi, o'z kodingizda -m va AllocsPerRun bilan tekshirish."
  - q: "fmt.Println(r.Value) chaqiruvida -m 'r.Value escapes to heap' deydi. Bu nimani bildiradi?"
    options:
      - "r o'zgaruvchisining o'zi heap'ga ko'chdi"
      - "float64 qiymati ...any argumentiga o'raladi (boxing) va o'sha o'ralgan nusxa heap'ga ketishi mumkin; r ning o'zi shu sababli heap'ga ko'chmaydi"
      - "Println xotirani sizdiradi"
      - "Kod xato"
    answer: 1
    explain: "Println ...any qabul qiladi, shuning uchun argument interface'ga o'raladi (17-dars). -m shu o'ralgan qiymat uchun 'escapes to heap' yozadi. Bu r ni heap'ga ko'chirish bilan bir xil emas: 'moved to heap: r' alohida xabar."
  - q: "Funksiya make([]byte, n) bilan n ni run-time'da oladi. Go 1.24.7 da o'lchov nima ko'rsatdi?"
    options:
      - "Doim 0 allokatsiya, chunki slice stack'da"
      - "Hajm kichik bo'lsa 0, katta bo'lsa 1"
      - "Faqat n > 1 MiB bo'lganda 1"
      - "n ning qiymatidan qat'i nazar 1 allokatsiya (n = 64 uchun ham)"
    answer: 3
    explain: "Kompilyator n ni kompilyatsiya vaqtida bilmaydi, shuning uchun bu versiyada u heap'ga ketdi: n=64 va n=1 MiB ikkalasida ham 1 allokatsiya. Konstanta hajmli make([]byte, 64) esa 0 allokatsiya berdi. Boshqa versiyalarda bu xatti-harakat o'zgarishi mumkin, shuning uchun o'z toolchain'ingizda o'lchang."
  - q: "Hottest(rs) funksiyasi eng katta o'qishni *Reading sifatida qaytaradi va har chaqiruvda 1 allokatsiya beradi. Eng sodda tuzatish qaysi?"
    options:
      - "Qiymatni (Reading, ok) sifatida qaytarish: kichik struct nusxasi stack'da/registrlarda ketadi"
      - "GOGC ni oshirish"
      - "sync.Pool qo'shish"
      - "Funksiyani goroutine'da ishga tushirish"
    answer: 0
    explain: "Allokatsiya manbasi pointer qaytarilishidir, GC sozlamasi uni yo'qotmaydi. Kichik struct'ni qiymat sifatida qaytarsangiz, escape bo'lmaydi. Biz o'lchaganimizda starter 1, qiymat qaytaradigan yechim 0 allokatsiya berdi."
task:
  title: "Heap'ga ketayotgan natijani qiymat sifatida qaytarish"
  prompt: |
    `Hottest` funksiyasi o'qishlar ro'yxatidan eng katta qiymatlisini topadi va uning nusxasiga pointer qaytaradi. Nusxa funksiya tugagandan keyin ham yashashi kerak, shuning uchun kompilyator uni heap'ga ko'chiradi (`moved to heap: best`) va har chaqiruv 1 allokatsiya qiladi. Issiq yo'lda bu keraksiz GC yuki.

    Vazifa: `Hottest` ni `(Reading, bool)` qaytaradigan qilib o'zgartiring: `Reading` qiymat sifatida, `bool` ro'yxat bo'sh emasligini bildiradi (starter'da bo'sh ro'yxat panic berardi). `main` ni mos ravishda yangilang. Kutilgan chiqish: `eng issiq: T-2 35.5` va `allokatsiyalar: 0`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "testing"
    )

    type Reading struct {
        Device string
        Value  float64
    }

    var sink *Reading

    // Hottest eng katta qiymatli o'qishni qaytaradi.
    // MUAMMO: nusxaga pointer qaytaradi, shuning uchun nusxa heap'ga chiqadi
    // va har chaqiruv allokatsiya qiladi.
    //
    //go:noinline
    func Hottest(rs []Reading) *Reading {
        best := rs[0]
        for _, r := range rs[1:] {
            if r.Value > best.Value {
                best = r
            }
        }
        return &best
    }

    func main() {
        rs := []Reading{{"T-1", 20}, {"T-2", 35.5}, {"T-3", 31}}
        h := Hottest(rs)
        fmt.Println("eng issiq:", h.Device, h.Value)

        allocs := testing.AllocsPerRun(1000, func() { sink = Hottest(rs) })
        fmt.Println("allokatsiyalar:", allocs)
    }
  solution: |
    package main

    import (
        "fmt"
        "testing"
    )

    type Reading struct {
        Device string
        Value  float64
    }

    var sink Reading

    // Hottest eng katta qiymatli o'qishni qiymat sifatida qaytaradi.
    // Bo'sh ro'yxatda ok false bo'ladi (starter'da bu holat panic berardi).
    //
    //go:noinline
    func Hottest(rs []Reading) (best Reading, ok bool) {
        if len(rs) == 0 {
            return Reading{}, false
        }
        best = rs[0]
        for _, r := range rs[1:] {
            if r.Value > best.Value {
                best = r
            }
        }
        return best, true
    }

    func main() {
        rs := []Reading{{"T-1", 20}, {"T-2", 35.5}, {"T-3", 31}}
        h, _ := Hottest(rs)
        fmt.Println("eng issiq:", h.Device, h.Value)

        allocs := testing.AllocsPerRun(1000, func() { sink, _ = Hottest(rs) })
        fmt.Println("allokatsiyalar:", allocs)
    }
  solutionNotes: |
    - Pointer qaytarish `best` ning funksiyadan keyin ham yashashini talab qiladi, shuning uchun `-gcflags=-m` `moved to heap: best` deydi. Qiymat qaytarilsa, nusxa chaqiruvchining frame'iga yoki registrga yoziladi va heap kerak bo'lmaydi.
    - `Reading` kichik (satr header'i va float64, 24 bayt). Bunday struct'ni qiymat sifatida qaytarish arzon. Struct ancha katta bo'lsa, nusxalash narxi va pointer narxini o'lchab solishtiring: har doim ham qiymat yutmaydi.
    - `(Reading, bool)` bo'sh ro'yxat holatini ochiq ifodalaydi; nil pointer o'rniga `ok` flagi (18-dars). Starter'da `rs[0]` bo'sh slice'da panic berardi.
    - `go:noinline` direktivasi faqat o'lchovni barqaror qilish uchun: inline qilinsa kompilyator ko'p holatda allokatsiyani o'zi yo'qotadi va misol hech narsani ko'rsatmay qoladi.
    - Natijani har doim o'lchang: `go build -gcflags=-m` sabab ko'rsatadi, `testing.AllocsPerRun` esa haqiqiy son beradi.
  checklist:
    - "`Hottest` `(Reading, bool)` qaytaradi"
    - "Bo'sh ro'yxatda panic yo'q, ok false"
    - "`allokatsiyalar: 0` chiqadi"
    - "`-gcflags=-m` chiqishida `moved to heap: best` yo'q"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Servisingiz ishlaydi, lekin tahlil qilsangiz GC vaqtining katta qismi bir xil qisqa muddatli obyektlarga ketayotganini ko'rasiz. Har so'rovda yuzlab kichik struct'lar yaratiladi, ularning hammasi `&Reading{...}` bilan qaytariladi, va profil allokatsiya soni minglab ekanini ko'rsatadi. Node.js'dan kelgan dasturchi odatda bu savolni bermaydi: V8 qiymatlar qayerda yashashini o'zi hal qiladi va dasturchi bilishi shart emas.

Go'da ham dasturchi qiymatning stack'da yoki heap'da ekanini yozmaydi: `new` va `&x` ikkalasi ham ikki joyda bo'lishi mumkin. Kompilyator hal qiladi. Lekin qaror natijalari sezilarli: stack'dagi qiymat funksiya tugashi bilan yo'qoladi, heap'dagisini garbage collector tozalashi kerak. Bu dars qaror qanday qabul qilinishini, uni `go build -gcflags=-m` bilan qanday ko'rish va `testing.AllocsPerRun` bilan qanday o'lchashni ko'rsatadi.

## Asosiy g'oya

### Joy semantikaga ta'sir qilmaydi

Go FAQ da shu savolga javob bor: o'zgaruvchi heap'da yoki stack'da ekanini bilish kerakmi. Javob mazmuni: to'g'rilik nuqtai nazaridan kerak emas, tanlangan joy tilning semantikasiga ta'sir qilmaydi, samaradorlikka esa ta'sir qiladi. Siz `&x` ni qaytarishingiz mumkin va dastur to'g'ri ishlaydi; farq faqat tezlikda.

GC qo'llanmasi ham shu g'oyani ishlatadi: heap'dagi qiymatlar uchun GC ishlashi kerak, shuning uchun allokatsiyalarni kamaytirish GC yukini kamaytiradi. Qo'llanmada bu mavzu uchun alohida bo'lim bor (Go qiymatlari qayerda yashashi) va heap allokatsiyalarini yo'qotish usullari tavsiflangan.

### Escape analysis

Kompilyator har o'zgaruvchi uchun savol beradi: bu qiymatga havola funksiya qaytgandan keyin ham yashashi mumkinmi. Agar yo'q deb isbotlay olsa, qiymat stack frame'da qoladi. Agar isbotlay olmasa yoki havola tashqariga chiqsa, qiymat heap'ga ko'chiriladi. Bu tahlil escape analysis deyiladi. U konservativ: shubha bo'lsa, heap tanlanadi.

Tahlil natijasini `go build -gcflags=-m` chiqaradi. Eng ko'p uchraydigan xabarlar:

- `moved to heap: x` - o'zgaruvchining o'zi heap'ga ko'chdi.
- `x escapes to heap` - qiymat (ko'pincha interface'ga o'ralgan nusxa) heap'ga ketadi.
- `x does not escape` - qiymat stack'da qoladi.
- `leaking param: p` - parametr funksiyadan tashqariga oqib chiqadi.

Inline qilish bilan bog'liq qatorlar (`can inline`, `inlining call to`) ham chiqadi; ular natijani chalg'itishi mumkin, chunki inline qilingan funksiyada tahlil chaqiruvchining ichida qayta bajariladi. Misol uchun biz kerakli funksiyalarni `//go:noinline` bilan belgilab, inline qatorlarini filtrlab tashladik.

## Chuqurroq: -m chiqishini o'qish va o'lchash

### Beshta klassik holat

Quyidagi dastur beshta tipik holatni ko'rsatadi: qiymat qaytarish, pointer qaytarish, funksiya ichidagi pointer, interface'ga o'rash va closure:

```go
package main

import "fmt"

type Reading struct {
	Device string
	Value  float64
}

// byValue: Reading stack'da qoladi, nusxa qaytariladi.
//
//go:noinline
func byValue(v float64) Reading {
	r := Reading{Device: "T-1", Value: v}
	return r
}

// byPointer: lokal o'zgaruvchiga pointer qaytadi, u heap'ga chiqishi shart.
//
//go:noinline
func byPointer(v float64) *Reading {
	r := Reading{Device: "T-1", Value: v}
	return &r
}

// sum: pointer faqat funksiya ichida ishlatiladi, heap kerak emas.
//
//go:noinline
func sum(vals []float64) float64 {
	acc := new(float64)
	for _, v := range vals {
		*acc += v
	}
	return *acc
}

// describe: qiymat interface'ga o'raladi va fmt.Println ga uzatiladi.
//
//go:noinline
func describe(r Reading) {
	fmt.Println(r.Device, r.Value)
}

// keep: closure lokal o'zgaruvchini ushlab turadi va tashqariga qaytadi.
//
//go:noinline
func keep() func() int {
	n := 0
	return func() int { n++; return n }
}

func main() {
	a := byValue(1)
	b := byPointer(2)
	describe(a)
	fmt.Println(b.Value, sum([]float64{1, 2, 3}))
	next := keep()
	next()
	fmt.Println(next())
}
```

Go 1.24.7 da `go build -gcflags=-m` chiqishi (inline qatorlari tashlab yuborilgan; qator raqamlari yuqoridagi fayl bilan mos):

```text
./main.go:22:2: moved to heap: r
./main.go:29:10: vals does not escape
./main.go:30:12: new(float64) does not escape
./main.go:40:15: leaking param: r
./main.go:41:13: ... argument does not escape
./main.go:41:15: r.Device escapes to heap
./main.go:41:25: r.Value escapes to heap
./main.go:48:2: moved to heap: n
./main.go:49:9: func literal escapes to heap
./main.go:56:13: ... argument does not escape
./main.go:56:15: b.Value escapes to heap
./main.go:56:26: sum([]float64{...}) escapes to heap
./main.go:56:36: []float64{...} does not escape
./main.go:59:13: ... argument does not escape
./main.go:59:18: next() escapes to heap
```

O'qilishi:

- `22:2 moved to heap: r` - `byPointer` ichidagi `r`. Uning manzili qaytariladi, shuning uchun heap'ga ko'chdi. `byValue` esa (nusxa qaytaradi) ro'yxatda yo'q: u stack'da.
- `30:12 new(float64) does not escape` - `sum` ichidagi `new` heap'ga bormadi: pointer faqat funksiya ichida ishlatiladi. `new` degani heap degani emas.
- `41:15 r.Device escapes to heap` va `41:25 r.Value escapes to heap` - `fmt.Println` `...any` oladi, shuning uchun argumentlar interface'ga o'raladi (17-dars). Bu `moved to heap: r` emas: r ning o'zi stack'da qoladi, `-m` o'ralgan nusxalarni belgilaydi.
- `48:2 moved to heap: n` va `49:9 func literal escapes to heap` - `keep` qaytargan closure `n` ni ushlab turadi, `n` funksiyadan keyin ham yashashi kerak.

### Haqiqiy son: AllocsPerRun

`-m` sababni ko'rsatadi, lekin haqiqatda nechta allokatsiya bo'lishini aytmaydi. Buning uchun `testing.AllocsPerRun(runs, f)` ishlatiladi: funksiyani ko'p marta chaqirib, o'rtacha allokatsiya sonini qaytaradi. Ushbu dastur bir nechta holatni o'lchaydi:

```go
package main

import (
	"fmt"
	"testing"
)

type Reading struct {
	Device string
	Value  float64
}

var sink *Reading
var sinkAny any
var sinkSlice []byte

//go:noinline
func byValue(v float64) Reading { return Reading{Device: "T-1", Value: v} }

//go:noinline
func byPointer(v float64) *Reading { return &Reading{Device: "T-1", Value: v} }

//go:noinline
func fixed() byte {
	buf := make([]byte, 64)
	buf[0] = 1
	return buf[0]
}

//go:noinline
func dynamic(n int) byte {
	buf := make([]byte, n)
	buf[0] = 1
	return buf[0]
}

func main() {
	fmt.Println("qiymat qaytarish:", testing.AllocsPerRun(1000, func() { _ = byValue(1) }))
	fmt.Println("pointer qaytarish:", testing.AllocsPerRun(1000, func() { sink = byPointer(1) }))
	fmt.Println("make([]byte, 64):", testing.AllocsPerRun(1000, func() { _ = fixed() }))
	n := 64
	fmt.Println("make([]byte, n), n=64:", testing.AllocsPerRun(1000, func() { _ = dynamic(n) }))
	n = 1 << 20
	fmt.Println("make([]byte, n), n=1 MiB:", testing.AllocsPerRun(10, func() { _ = dynamic(n) }))
	x := 12345
	fmt.Println("int -> any (katta qiymat):", testing.AllocsPerRun(1000, func() { sinkAny = x }))
	fmt.Println("int -> any (konstanta 7):", testing.AllocsPerRun(1000, func() { sinkAny = 7 }))
}
```

Chiqish:

```text
qiymat qaytarish: 0
pointer qaytarish: 1
make([]byte, 64): 0
make([]byte, n), n=64: 1
make([]byte, n), n=1 MiB: 1
int -> any (katta qiymat): 1
int -> any (konstanta 7): 0
```

Xulosalar: qiymat qaytarish 0, pointer qaytarish 1. Konstanta hajmli `make([]byte, 64)` 0, lekin run-time'da olingan `n` bilan `make([]byte, n)` 1 (n=64 bo'lganda ham): kompilyator hajmni bilmaydi va bu versiyada heap'ga ketadi. Katta `int` interface'ga o'ralganda 1 allokatsiya, `7` konstantasi bilan 0 (kompilyator uni statik ma'lumot sifatida saqlaydi). Bu natijalar Go 1.24.7 uchun; kompilyator yaxshilanib borgani sababli o'z versiyangizda qayta o'lchang.

### Hajm ham hal qiladi

Faqat havola chiqishi emas, hajm ham qaror qiladi. FAQ ham juda katta lokal o'zgaruvchi heap'da saqlanishi mumkinligini eslatadi. Quyidagi o'lchov buni ko'rsatadi:

```go
package main

import (
	"fmt"
	"testing"
)

//go:noinline
func small() byte {
	var buf [64 << 10]byte
	buf[0] = 1
	return buf[len(buf)-1]
}

//go:noinline
func large() byte {
	var buf [16 << 20]byte
	buf[0] = 1
	return buf[len(buf)-1]
}

//go:noinline
func makeSmall() byte {
	buf := make([]byte, 64<<10)
	buf[0] = 1
	return buf[len(buf)-1]
}

//go:noinline
func makeLarge() byte {
	buf := make([]byte, 128<<10)
	buf[0] = 1
	return buf[len(buf)-1]
}

func main() {
	fmt.Println("[64 KiB]byte o'zgaruvchi:", testing.AllocsPerRun(10, func() { small() }))
	fmt.Println("[16 MiB]byte o'zgaruvchi:", testing.AllocsPerRun(10, func() { large() }))
	fmt.Println("make([]byte, 64 KiB):", testing.AllocsPerRun(10, func() { makeSmall() }))
	fmt.Println("make([]byte, 128 KiB):", testing.AllocsPerRun(10, func() { makeLarge() }))
}
```

```text
[64 KiB]byte o'zgaruvchi: 0
[16 MiB]byte o'zgaruvchi: 1
make([]byte, 64 KiB): 0
make([]byte, 128 KiB): 1
```

64 KiB massiv va 64 KiB `make` 0, lekin 16 MiB massiv va 128 KiB `make` 1 allokatsiya berdi. Aniq chegaralar kompilyator tafsiloti: ularni yodlamang, o'lchang.

### Sababni chuqurroq ko'rish: -m=2

Bitta `-m` natijani beradi, lekin nima uchun degan savolga javob bermaydi. `-gcflags=-m=2` har qaror uchun oqim yo'lini (flow) ham yozadi: qiymat qaysi ifodalar orqali qayerga oqib borgani ko'rinadi. Masalan, yuqoridagi `r.Value escapes to heap` qatori uchun `-m=2` oqimni `r.Value` dan `...` argumentning slice elementigacha ko'rsatdi. Murakkab holatda, ya'ni qiymat bir necha funksiya orqali o'tganda, aynan shu oqim yo'li sizga havola qayerda tashqariga chiqqanini topishga yordam beradi. Natija juda uzun bo'lgani uchun uni bitta funksiya bilan (`go build -gcflags=-m=2 ./pkg 2>&1 | grep funksiya_nomi`) cheklash ma'qul.

Jarayon odatda quyidagicha: profil yoki `-benchmem` (`allocs/op`) ustuni muammoli funksiyani ko'rsatadi; `-m` bilan sababni topasiz; kodni o'zgartirasiz; `AllocsPerRun` yoki benchmark bilan sonning tushganini tekshirasiz. Oxirgi qadamni o'tkazib yuborish keng tarqalgan xato: kompilyator qarorini taxmin qilish oson, natijani tekshirmasdan ishonish esa xavfli.

### Pointer yoki qiymat

Hajm va o'zgaruvchanlik hal qiladi. Quyidagi jadval qarorni qisqa ifodalaydi:

| Holat | Tavsiya | Sabab |
|---|---|---|
| Kichik, o'zgarmas natija (o'qish, nuqta, vaqt oralig'i) | Qiymat qaytaring | Escape bo'lmaydi, nusxa arzon |
| Chaqiruvchi o'zgartirishi kerak bo'lgan obyekt | Pointer | Semantika shuni talab qiladi |
| Juda katta struct | O'lchang | Nusxalash narxi pointer narxidan oshishi mumkin |
| Ko'p marta ishlatiladigan bufer | Chaqiruvchidan oling yoki qayta ishlating | Har chaqiruvda yangi allokatsiya o'rniga |
| `nil` ma'noli "yo'q" qiymat | `(T, bool)` | Pointerga bog'liq bo'lmaydi (18-dars) |

Bu jadval qoida emas, boshlang'ich nuqta. Pointer qaytarish ko'pincha ma'noli: obyekt identifikatsiyasi, mutatsiya, nil. Faqat "tezroq bo'lsin" deb pointer qo'shish yoki olib tashlash noto'g'ri; o'lchov hal qiladi.

## Misol: issiq yo'ldagi allokatsiyani yo'qotish

Vazifadagi `Hottest` funksiyasi `best` nusxasiga pointer qaytaradi. `-m` `moved to heap: best` deydi, `AllocsPerRun` 1 ko'rsatadi. Qiymat qaytarilsa, 0. Bu odatiy tuzatish: kichik struct'larni qiymat sifatida qaytarish va qabul qilish. Uning natijasi dastur xatti-harakatini o'zgartirmaydi, faqat GC yukini kamaytiradi.

Boshqa tuzatishlar: konstanta hajmli buferlarni ishlatish, buferni chaqiruvchidan olish (`func Read(dst []byte)`), `strings.Builder` bilan satr yig'ish. Har birini o'lchamasdan qo'llamang: foyda faqat chindan issiq yo'lda bo'ladi.

## Qachon qo'llamaslik kerak

- Allokatsiyani kamaytirish uchun kodni buzmang. Soddalik va to'g'rilik avval; escape analysis faqat profil allokatsiya muammosini ko'rsatganda kerak.
- Kichik struct'lar uchun pointer ishlatish tezlik beradi deb o'ylamang. Nusxalash arzon; pointer qaytarish ko'pincha heap'ni talab qiladi, ya'ni sekinroq.
- `-gcflags=-m` chiqishini o'qib "to'g'ri" deb hukm qilmang. U sabab ko'rsatadi, lekin tezlik haqida hech narsa demaydi. Benchmark (`-benchmem`) va profil haqiqiy javob.
- Natijani boshqa Go versiyasiga ko'chirmang. Kompilyator tahlili versiyadan versiyaga yaxshilanadi; bir versiyadagi `escapes to heap` keyingisida yo'qolishi mumkin.
- `//go:noinline` ni production kodda qo'ymang. Bu o'lchov va o'quv misollari uchun. Odatda inline qilish allokatsiyani o'zi yo'qotadi.
- Pointer o'rniga qiymat qaytarishni katta struct uchun ko'r-ko'rona qo'llamang: nusxalash narxi oshadi. O'lchang.

## Stack'da: Node.js/TypeScript bilan solishtirish

JavaScript'da hamma obyekt heap'da va GC boshqaradi; V8 ba'zi kichik qiymatlarni ichki optimizatsiya qiladi, lekin dasturchi bunga ta'sir qilmaydi va uni ko'ra olmaydi. Go'da ham joy dasturchi tanlovi emas, lekin kompilyator qarorini ko'rish mumkin (`-gcflags=-m`) va o'lchash mumkin (`AllocsPerRun`, `-benchmem`). Evaziga siz kod shaklini o'zgartirib qarorga ta'sir qilishingiz mumkin: qiymat qaytarish, buferni tashqaridan berish.

Amaliy qoidalar:

- Avval o'lchang: profil yoki `-benchmem` allokatsiya muammosini ko'rsatsin, keyin `-gcflags=-m` ga qarang.
- Kichik struct'lar uchun qiymat semantikasini afzal ko'ring.
- Pointer qaytarishdan oldin sabab bor-yo'qligini so'rang: mutatsiya yoki katta hajm.
- `...any` va interface'ga o'rash allokatsiya manbai bo'lishi mumkin (17-dars).
- Natijalarni Go versiyasi bilan yozib qo'ying: tahlil o'zgaradi.

## Xulosa

- Qiymat stack'da yoki heap'da yashashini kompilyator escape analysis bilan hal qiladi; bu semantikaga emas, samaradorlikka ta'sir qiladi.
- `go build -gcflags=-m` sababni ko'rsatadi: `moved to heap`, `escapes to heap`, `does not escape`, `leaking param`.
- Pointer qaytarish, closure va interface'ga o'rash heap'ga olib kelishi mumkin; `new` va `&x` o'zi heap degani emas.
- Hajm ham muhim: juda katta lokal o'zgaruvchi yoki run-time'da berilgan hajmli `make` Go 1.24.7 da heap'ga ketdi.
- Haqiqiy allokatsiya sonini `testing.AllocsPerRun` yoki `-benchmem` beradi; `-m` chiqishi tezlik haqida gapirmaydi.
- Kichik struct'ni qiymat sifatida qaytarish eng sodda tuzatish; faqat issiq yo'lda va o'lchovdan keyin qo'llang.
