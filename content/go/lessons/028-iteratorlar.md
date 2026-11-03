---
n: 28
slug: iteratorlar
title: "Iterator'lar: iter.Seq va range-over-func"
summary: "Go 1.23 dagi range-over-func: iter.Seq va iter.Seq2 tiplari, yield funksiyasi shartnomasi, iterator'ni to'xtatish va tozalash, adapterlar, iter.Pull va standart kutubxonadagi iterator API'lari."
duration: 45
sources:
  - id: pkg-iter
    note: "Package overview: Seq/Seq2 ta'riflari, nomlash konvensiyalari, Single-Use Iterators, Pulling Values va iter.Pull hujjati, Standard Library Usage, Mutation"
  - id: blog-range-functions
    note: "Why? bo'limi (Push va Pull yondashuvlari), Pull iterators bo'limi; range-over-func Go 1.23 xususiyati ekani"
  - id: go-spec
    note: "For statements with range clause: funksiya diapazoni uchun jadval qatorlari va 'synthesized yield function' semantikasi; Language versions ilovasi (Go 1.22 range over int, Go 1.23 range-over-func)"
quiz:
  - q: "`for v := range seq { if v > 10 { break } }` da `seq` iterator funksiyasi uchun `break` nimani anglatadi?"
    options:
      - "Iterator ichidagi `yield(v)` chaqiruvi `false` qaytaradi va iterator boshqa `yield` chaqirmasdan tugashi kerak"
      - "Iterator funksiyasi panic bilan to'xtatiladi"
      - "`yield` `true` qaytaradi, `break` esa faqat tashqi sikl uchun"
      - "Iterator o'zi davom etadi, `break` faqat qiymatlarni e'tiborsiz qoldiradi"
    answer: 0
    explain: "Spetsifikatsiya: sikl tanasi to'xtasa (masalan, `break`), `yield` `false` qaytaradi va uni boshqa chaqirmaslik kerak. Iterator `false`ni ko'rib return qilishi shart."
  - q: "`Lines(text)` iteratori ichida `defer fmt.Println(\"yopildi\")` bor, iste'molchi birinchi qiymatdan keyin `break` qildi. `yopildi` qachon chiqadi?"
    options:
      - "Hech qachon: `break` iterator funksiyasini abort qiladi"
      - "Faqat sikl to'liq tugasa"
      - "Dastur tugaganda"
      - "Darhol `break`dan keyin: `yield` `false` qaytaradi, iterator funksiyasi return qiladi va uning `defer`i ishlaydi"
    answer: 3
    explain: "`break` iteratorni abort qilmaydi, `yield` `false` qaytaradi, iterator return qiladi va oddiy funksiya kabi `defer`lar ishlaydi. Darsdagi misolda `[Lines yopildi]` `break` holatida ham chiqadi. Shu sabab resurs tozalash iterator ichida `defer` bilan yoziladi."
  - q: "Iterator `yield(1)` `false` qaytargandan keyin ham `yield(2)`ni chaqirdi. Nima bo'ladi (Go 1.24.7)?"
    options:
      - "`yield(2)` jimgina e'tiborsiz qoldiriladi"
      - "Iste'molchi sikli `2` ni oladi"
      - "Run-time panic: `range function continued iteration after function for loop body returned false`"
      - "Kompilyatsiya xatosi"
    answer: 2
    explain: "Spetsifikatsiya yield `false` qaytargandan keyin uni chaqirmaslikni talab qiladi, ish vaqti esa buni tekshiradi va panic beradi. Kompilyator iterator tanasini tahlil qilmaydi."
  - q: "`next, stop := iter.Pull(seq)` bilan faqat ikkita qiymat o'qib to'xtadingiz. Nima qilish kerak?"
    options:
      - "Hech narsa: iterator garbage collector bilan o'zi to'xtaydi"
      - "`stop()` ni chaqirish kerak (odatda `defer stop()`): u iterator funksiyasiga tugash imkonini beradi"
      - "`next()` ni `false` qaytarguncha chaqirish kerak"
      - "Pull iterator'ni ikkinchi goroutine'da yopish kerak"
    answer: 1
    explain: "Hujjat: `stop` iteratorni tugatish uchun, agar `next` hali ketma-ketlik tugaganini bildirmagan bo'lsa chaqirilishi shart; odatda `defer stop()`. `next` yoki `stop`ni bir vaqtda bir necha goroutine'dan chaqirish xato."
  - q: "`maps.Keys(m)` va `slices.Sorted(maps.Keys(m))` haqida qaysi gap to'g'ri?"
    options:
      - "`maps.Keys` `iter.Seq[K]` qaytaradi, tartib kafolatlanmagan; `slices.Sorted` iterator'ni yig'ib saralangan slice qaytaradi"
      - "`maps.Keys` saralangan `[]K` qaytaradi"
      - "`maps.Keys` har doim qo'shilish tartibida qaytaradi"
      - "`slices.Sorted` faqat `[]string` bilan ishlaydi"
    answer: 0
    explain: "Hujjat: `maps.Keys` kalitlar iteratorini qaytaradi, tartib aniqlanmagan va chaqiruvdan chaqiruvga farq qilishi mumkin. Deterministik tartib uchun `slices.Sorted(maps.Keys(m))` (kalit tipi `cmp.Ordered` bo'lishi shart)."
  - q: "Hujjatga ko'ra 'single-use iterator' nima va nega hujjat izohida belgilanishi kerak?"
    options:
      - "Faqat bitta qiymat qaytaradigan iterator"
      - "Faqat bitta goroutine'dan chaqiriladigan iterator"
      - "Faqat `iter.Pull` bilan ishlatiladigan iterator"
      - "Ketma-ketlikni faqat bir marta aylanib chiqa oladigan iterator (masalan, oqimdan o'qish): to'xtatilgandan keyin qayta chaqirish oqimni davom ettirishi, tugagandan keyin esa hech narsa bermasligi mumkin"
    answer: 3
    explain: "`iter` hujjati: ko'p iterator qayta chaqirilganda ketma-ketlikni yana boshdan o'tadi, single-use iterator esa oqimga o'xshash ma'lumotni qaytaradi (qayta o'ralmaydi). Chaqiruvchi shuni bilishi uchun bu hujjat izohida aytilishi kerak."
task:
  title: "Slice qaytaruvchi funksiyani iterator'ga aylantirish"
  prompt: |
    `loadReadings` barcha o'lchovlarni slice'ga yig'adi, `firstLow` esa faqat birinchi past yoqilg'ili o'lchovni qidiradi. `produced` hisoblagichi nechta o'lchov ishlab chiqarilganini ko'rsatadi: starter'da u hamma narsa tayyorlanganini (1000) ko'rsatadi, garchi kerak bo'lgani faqat yettitasi bo'lsa ham.

    Vazifa:
    1. `loadReadings` o'rniga `readings(n int) iter.Seq[Reading]` yozing: o'lchovlarni bittadan `yield` qiladi va `yield` `false` qaytarsa to'xtaydi.
    2. `firstLow`ni `for ... range readings(n)` bilan qayta yozing; topilganda return qilsin.
    3. Natija o'zgarmasin (`{T-6 40} true`), lekin `produced` 1000 emas, faqat kerakli miqdorda bo'lsin.
  lang: go
  starter: |
    package main

    import "fmt"

    type Reading struct {
        DeviceID string
        Fuel     float64
    }

    // produced nechta o'lchov generatsiya qilinganini sanaydi.
    var produced int

    // loadReadings barcha o'lchovlarni xotiraga yig'adi.
    // Muammo: birinchi past yoqilg'i topilsa ham, hammasi tayyorlanadi.
    func loadReadings(n int) []Reading {
        out := make([]Reading, 0, n)
        for i := 0; i < n; i++ {
            produced++
            out = append(out, Reading{DeviceID: fmt.Sprintf("T-%d", i), Fuel: float64(100 - i*10)})
        }
        return out
    }

    func firstLow(n int, limit float64) (Reading, bool) {
        for _, r := range loadReadings(n) {
            if r.Fuel < limit {
                return r, true
            }
        }
        return Reading{}, false
    }

    func main() {
        r, ok := firstLow(1000, 50)
        fmt.Println(r, ok, "tayyorlandi:", produced)
    }
  solution: |
    package main

    import (
        "fmt"
        "iter"
    )

    type Reading struct {
        DeviceID string
        Fuel     float64
    }

    // produced nechta o'lchov generatsiya qilinganini sanaydi.
    var produced int

    // readings o'lchovlarni bittadan beradi; iste'molchi to'xtatsa, ishlab chiqarish ham to'xtaydi.
    func readings(n int) iter.Seq[Reading] {
        return func(yield func(Reading) bool) {
            for i := 0; i < n; i++ {
                produced++
                r := Reading{DeviceID: fmt.Sprintf("T-%d", i), Fuel: float64(100 - i*10)}
                if !yield(r) {
                    return
                }
            }
        }
    }

    func firstLow(n int, limit float64) (Reading, bool) {
        for r := range readings(n) {
            if r.Fuel < limit {
                return r, true
            }
        }
        return Reading{}, false
    }

    func main() {
        r, ok := firstLow(1000, 50)
        fmt.Println(r, ok, "tayyorlandi:", produced)
    }
  solutionNotes: |
    - `readings` `iter.Seq[Reading]` qaytaradi: bu `func(yield func(Reading) bool)` uchun nom. Har bir o'lchov tayyorlanishi bilan `yield` chaqiriladi, `produced` hisoblagichi oshadi.
    - `firstLow` ichidagi `return` sikl tanasini to'xtatadi: `yield` `false` qaytaradi, `readings` ichidagi `if !yield(r) { return }` ishlab chiqarishni to'xtatadi. Shuning uchun `produced` 7: o'lchovlar 0 dan 6 gacha (6-chisi `Fuel=40 < 50`).
    - Slice varianti oraliq xotira ajratgan (1000 elementli slice) va barcha qiymatlarni hisoblagan; iterator varianti qiymatni talab qilinganda tayyorlaydi (lazy).
    - Natija `{T-6 40} true` o'zgarmadi: iterator xatti-harakat o'zgartirmadi, faqat ishlab chiqarish hajmini.
  checklist:
    - "`readings` `iter.Seq[Reading]` qaytaradi va `yield`ning `false` natijasini tekshiradi"
    - "`firstLow` `for ... range readings(n)` ishlatadi"
    - "Chiqish `{T-6 40} true` saqlanadi"
    - "`produced` 1000 dan ancha kam (yechimda 7)"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Ketma-ketlikni tashqariga berish Go'da uzoq vaqt noqulay edi. Go 1.23 dan oldin collection tipi o'z elementlarini uch yo'ldan biri bilan berar edi. Birinchisi: slice qaytarish. Oddiy, lekin hamma narsa darhol xotiraga yuklanadi va iste'molchi faqat birinchi elementni xohlasa ham ish hajmi o'zgarmaydi. Ikkinchisi: callback qabul qilish (`Range(func(v T) bool)`), ya'ni push. Standart kutubxonada `sync.Map.Range`, `flag.Visit`, `filepath.Walk` shu uslubda (blog ularning aniq shartnomasi farq qilishini ta'kidlaydi), lekin `for` sikli, `break`, `return` bilan birga ishlamaydi. Uchinchisi: channel qaytarish va goroutine ishga tushirish: iste'molchi sikldan chiqib ketsa goroutine channel'da osilib qoladi (goroutine leak, 41-dars).

Go 1.23 shu uch yondashuvni bitta mexanizm bilan birlashtirdi: funksiya tiplari ustidan `range`. Node.js tajribasida bunga eng yaqin narsa `for...of` + generator (sync) yoki `for await...of` (async), lekin farqlar katta: Go iteratori oddiy funksiya, generator ob'ekti emas, boshqaruv o'zgarmaydi, va hech qanday goroutine yoki promise talab qilinmaydi. Bu dars iteratorning shartnomasini, tozalash qoidalarini va `iter.Pull`ni beradi.

## Asosiy g'oya

### iter.Seq va iter.Seq2

`iter` paketi (Go 1.23) ikkita tipni aniqlaydi:

```go
type Seq[V any] func(yield func(V) bool)
type Seq2[K, V any] func(yield func(K, V) bool)
```

Iterator ketma-ket elementlarni `yield` callback'iga uzatadigan funksiya. Funksiya ketma-ketlik tugaganda yoki `yield` `false` qaytarganda to'xtaydi. `Seq` bir qiymat, `Seq2` ikkita qiymat (odatda kalit-qiymat yoki indeks-qiymat) uzatadi. `yield` `true` qaytarsa davom etish kerak, `false` qaytarsa to'xtash kerak.

### range-over-func

Spetsifikatsiya ilovasiga ko'ra funksiya ustidan `range` Go 1.23 da qo'shilgan (Go 1.22 da integer ustidan range qo'shilgan edi: `for i := range 3`). Qoida jadvali: `func(yield func() bool)` nol qiymat, `func(yield func(V) bool)` bir qiymat, `func(yield func(K, V) bool)` ikki qiymat beradi, `yield` variadic bo'la olmaydi.

Semantika (spetsifikatsiya): funksiya uchun iteratsiya shunday ishlaydi: `f` yangi, sintezlangan (synthesized) `yield` funksiyasi bilan chaqiriladi. `yield` `f` qaytishidan oldin chaqirilsa, argumentlari iteratsiya qiymatlari bo'ladi va sikl tanasi bir marta bajariladi. Har bir sikl iteratsiyasidan keyin `yield` `true` qaytaradi va yana chaqirilishi mumkin. Sikl tanasi tugasa (masalan, `break`), `yield` `false` qaytaradi va uni boshqa chaqirmaslik kerak. Ya'ni sikl tanasi kompilyator tomonidan `yield` funksiyasiga aylantiriladi va iterator uni chaqiradi.

### Nomlash konvensiyasi

`iter` paketi hujjati: kolleksiya tipidagi iterator metodi `All` deb nomlanadi (`func (s *Set[V]) All() iter.Seq[V]`). Bir nechta ketma-ketlik bo'lsa nom ketma-ketlikni bildiradi (`Cities`, `Languages`), tartib bir nechta bo'lsa nom tartibni ko'rsatadi (`All` va `Backward`). Qo'shimcha sozlama kerak bo'lsa konstruktor funksiya argument oladi (`Scan(min, max)`).

### Standart kutubxona

`maps` va `slices` paketlari iterator API'lariga ega: `maps.Keys`, `maps.Values`, `maps.All`, `slices.All`, `slices.Values`, `slices.Backward`, `slices.Collect`, `slices.Sorted`, `slices.Chunk` (Go 1.23). Go 1.24 `strings` va `bytes` paketlariga `Lines`, `SplitSeq`, `FieldsSeq` qo'shdi (versiyalar Go distributividagi `api/go1.23.txt` va `api/go1.24.txt` fayllaridan). Hujjat misoli: tartiblangan kalitlar bo'yicha yurish uchun `slices.Sorted(maps.Keys(m))`.

## Chuqurroq: shartnoma, tozalash va Pull

### Tozalash: defer ishlaydi

Iterator oddiy funksiya, shuning uchun uning `defer`i funksiya qaytishida ishlaydi. Sikl `break` bilan to'xtasa, `yield` `false` qaytaradi, iterator `return` qiladi va `defer` bajariladi. Shu sababli fayl, ulanish, kursor kabi resurslar iterator ichida `defer` bilan yopiladi va iste'molchi tomonidan `break`, `return`, hatto panic ham xavfsiz. Bu channel+goroutine yondashuvidagi leak muammosining to'g'ridan-to'g'ri yechimi.

### yield false'dan keyin chaqirilmaydi

Iterator `false`ni e'tiborsiz qoldirib davom etsa, ish vaqti panic beradi. Go 1.24.7 da:

```go
package main

import (
	"fmt"
	"iter"
)

func bad() iter.Seq[int] {
	return func(yield func(int) bool) {
		yield(1)
		yield(2) // yield false qaytargandan keyin yana chaqirilmoqda
	}
}

func main() {
	defer func() { fmt.Println("recover:", recover()) }()
	for v := range bad() {
		fmt.Println(v)
		break
	}
}
```

```text
1
recover: runtime error: range function continued iteration after function for loop body returned false
```

Bu xato kompilyatsiya vaqtida ushlanmaydi: iterator tanasi oddiy funksiya, kompilyator `yield` natijasi ishlatilganini nazorat qilmaydi. Shuning uchun har bir iteratorda `if !yield(...) { return }` yozilishi shart va kod ko'rib chiqishda tekshiriladigan nuqta.

### Single-use iterator

`iter` hujjati ikki turni ajratadi. Ko'p iterator to'liq ketma-ketlikni aylanib chiqadi va qayta chaqirilsa yana boshdan o'tadi. Ba'zilari oqimdan o'qiydi (masalan, `Reader.Lines`) va faqat bir marta o'tishi mumkin: to'xtatilgandan keyin qayta chaqirish oqimni davom ettirishi, tugagandan keyin esa hech qiymat bermasligi mumkin. Hujjat bunday iteratorlarning doc comment'ida single-use ekani yozilishini talab qiladi.

### Xatolar

`Seq[V]` imzosida xato uchun joy yo'q. Amaliy yo'l: `iter.Seq2[V, error]` (har bir elementda xato bilan), yoki iterator yonida `Err() error` metodi bo'lgan struct. Bu muallifning tavsiyasi, manbalarda bunday konvensiya belgilanmagan; 21-darsdagi `Next() (T, bool)` xatosini takrorlamaslik uchun xato yo'lini imzoga qo'shing.

### iter.Pull

Push iterator (`Seq`) o'zi `yield` chaqiradi. Ba'zan qiymatlarni qo'lda, bittadan olish kerak (masalan, ikki ketma-ketlikni parallel aylanish). Blog uni pull iterator deb ataydi, `iter.Pull(seq)` esa `next` va `stop` funksiyalarini qaytaradi:

- `next()` keyingi qiymatni va u haqiqiyligini bildiruvchi `bool`ni qaytaradi; ketma-ketlik tugagach nol qiymat va `false`. Tugagandan yoki `stop`dan keyin ham `next`ni chaqirish xavfsiz.
- `stop()` iteratsiyani tugatadi. `next` hali tugaganini bildirmagan bo'lsa, `stop`ni chaqirish shart; ko'p marta chaqirish xavfsiz; odatda `defer stop()`.
- `next` yoki `stop`ni bir vaqtda bir nechta goroutine'dan chaqirish xato. Iterator `next`/`stop` paytida panic qilsa, `next`/`stop` ham shu qiymat bilan panic qiladi.

Hujjat misoli `Pairs` adapterida `defer stop()` ishlatadi. Pull faqat kerak bo'lganda, aks holda `range` yetarli.

### Sikl tanasi, panic va defer: kim qachon ishlaydi

Spetsifikatsiya sikl tanasini iterator ichidan chaqiriladigan `yield` funksiyasi deb tushuntiradi, ammo `panic`, `return` va `defer` bilan o'zaro ta'sirini alohida jadvalda sanamaydi. Quyidagi dastur Go 1.24.7 dagi xatti-harakatni ko'rsatadi; bu bo'lim kuzatuv, spetsifikatsiya kafolati emas, shuning uchun nozik tartibga dastur mantiqini bog'lamang.

Uchta kuzatuv. Birinchisi: sikl tanasida panic bo'lsa, u iterator funksiyasi orqali yuqoriga ko'tariladi va iteratorning `defer`i tashqi `recover` dan oldin ishlaydi (`[iterator defer]` qatori `recover (tashqi)` dan oldin chiqdi). Ya'ni bu tajribada iterator ichidagi resurs tozalash panic holatida ham bajarildi. Ikkinchisi: sikl tanasidagi `defer` iteratsiya yoki iterator tugaganda emas, tanani o'z ichiga olgan funksiya qaytganda ishlaydi, `for` sikli ichidagi oddiy `defer` kabi: `deferInBody` da avval `[iterator defer]`, keyin `sikldan keyin`, keyin tanadagi ikkala `defer` teskari tartibda (1, so'ng 0), oxirida funksiyaning o'z `defer`i. Shu sababli ko'p iteratsiyali siklning tanasiga `defer` qo'ysangiz, ular funksiya tugaguncha to'planadi. Uchinchisi: tanadan `return` qilish `yield` ga `false` qaytaradi, iterator `defer`ni bajarib tugaydi va qiymat tashqi funksiyadan qaytadi (`return: 100`).

Ikkita tuzoq run-time panic bilan ushlanadi, kompilyator esa ularni ko'rmaydi. Agar iterator `yield` ni saqlab qo'ysa va sikl tugagandan keyin chaqirsa, Go 1.24.7 `range function continued iteration after whole loop exit` panic'ini berdi (oldingi bo'limdagi `after function for loop body returned false` xatosining qo'shnisi; spetsifikatsiya iterator `f` qaytgandan keyin `yield` chaqirilishini alohida aytmaydi, xabar run-time'dan olindi). Nil iterator ustidan `range` esa nil pointer dereference panic'i bilan tugadi; spetsifikatsiyaning range bo'limi nil funksiya haqida alohida gapirmaydi, bu kuzatuv.

### Ikki ketma-ketlikni parallel aylanish: Zip

Ikki ketma-ketlikni juftlab o'tish `range` bilan yozilmaydi: ikkalasi ham push, biri o'z siklini boshqaradi, ikkinchisini qo'lda olish kerak. Aynan shu joyda `iter.Pull` kerak. `iter` hujjatida `Pull2` ham bor (`Seq2[K, V]` uchun, `next` uchta qiymat qaytaradi: `K`, `V`, `bool`). `Zip` adapteri bitta ketma-ketlikni `range` bilan, ikkinchisini `Pull` bilan aylanadi, `defer stop()` ikkinchi iteratorni har qanday chiqishda yopadi. Quyidagi to'liq dastur yuqoridagi barcha holatlarni va `Zip` ni ishlatadi (uzunroq `Count(3)` va qisqa ikkinchi ketma-ketlik: `Zip` qisqasi tugagach to'xtaydi, `Count` ning `defer`i esa baribir ishlaydi):

```go
package main

import (
	"fmt"
	"iter"
)

func Count(n int) iter.Seq[int] {
	return func(yield func(int) bool) {
		defer fmt.Println("  [iterator defer]")
		for i := 0; i < n; i++ {
			if !yield(i) {
				return
			}
		}
	}
}

// Pairs: ikki ketma-ketlikni parallel aylanish uchun iter.Pull2 emas, Pull ishlatadi.
func Zip[A, B any](a iter.Seq[A], b iter.Seq[B]) iter.Seq2[A, B] {
	return func(yield func(A, B) bool) {
		nb, stop := iter.Pull(b)
		defer stop()
		for x := range a {
			y, ok := nb()
			if !ok || !yield(x, y) {
				return
			}
		}
	}
}

func bodyPanic() {
	defer func() { fmt.Println("recover (tashqi):", recover()) }()
	for i := range Count(3) {
		fmt.Println("tana:", i)
		panic("tanada xato")
	}
}

func deferInBody() {
	defer fmt.Println("funksiya defer'i")
	for i := range Count(2) {
		defer fmt.Println("tanadagi defer", i)
		fmt.Println("tana:", i)
	}
	fmt.Println("sikldan keyin")
}

func returnFromBody() int {
	for i := range Count(5) {
		if i == 1 {
			return i * 100
		}
	}
	return -1
}

var saved func(int) bool

func Leaky() iter.Seq[int] {
	return func(yield func(int) bool) {
		saved = yield
		yield(1)
	}
}

func main() {
	bodyPanic()
	fmt.Println("---")
	deferInBody()
	fmt.Println("---")
	fmt.Println("return:", returnFromBody())
	fmt.Println("---")

	for a, b := range Zip(Count(3), func(yield func(string) bool) {
		for _, s := range []string{"x", "y"} {
			if !yield(s) {
				return
			}
		}
	}) {
		fmt.Println(a, b)
	}
	fmt.Println("---")

	func() {
		defer func() { fmt.Println("recover:", recover()) }()
		for range Leaky() {
		}
		saved(2) // sikl tugagandan keyin yield chaqiriladi
	}()

	func() {
		defer func() { fmt.Println("recover nil:", recover()) }()
		var s iter.Seq[int]
		for range s {
		}
	}()
}
```

Go 1.24.7 da chiqish:

```text
tana: 0
  [iterator defer]
recover (tashqi): tanada xato
---
tana: 0
tana: 1
  [iterator defer]
sikldan keyin
tanadagi defer 1
tanadagi defer 0
funksiya defer'i
---
  [iterator defer]
return: 100
---
0 x
1 y
  [iterator defer]
---
recover: runtime error: range function continued iteration after whole loop exit
recover nil: runtime error: invalid memory address or nil pointer dereference
```

`Zip` natijasi `0 x`, `1 y`, so'ng ikkinchi ketma-ketlik tugagani uchun uchinchi element uchun `nb()` `false` qaytaradi, `Zip` `return` qiladi va `Count` ning `[iterator defer]` qatori chiqadi. `Pull` ning narxi haqida bu darsda son bermaymiz: o'lchamadik. Pull faqat ikki ketma-ketlikni bir vaqtda boshqarish kabi `range` bilan ifodalab bo'lmaydigan joyda kerak.

## Misol: GPS trek, adapterlar va resurs tozalash

Dastur `Track` iteratorini, `Filter` va `Take` adapterlarini, `Seq2` ko'rinishidagi `Enumerate`ni, tozalash bilan `Lines` iteratorini va `iter.Pull`ni ko'rsatadi.

```go
package main

import (
	"fmt"
	"iter"
	"maps"
	"slices"
	"strings"
)

type Point struct {
	Lat, Lon float64
	Speed    int
}

// Track iter.Seq[Point] qaytaradi: yield false qaytarsa to'xtaymiz.
func Track(points []Point) iter.Seq[Point] {
	return func(yield func(Point) bool) {
		for _, p := range points {
			if !yield(p) {
				return
			}
		}
	}
}

// Filter va Take iterator adapterlari.
func Filter[T any](seq iter.Seq[T], keep func(T) bool) iter.Seq[T] {
	return func(yield func(T) bool) {
		for v := range seq {
			if keep(v) && !yield(v) {
				return
			}
		}
	}
}

func Take[T any](seq iter.Seq[T], n int) iter.Seq[T] {
	return func(yield func(T) bool) {
		if n <= 0 {
			return
		}
		i := 0
		for v := range seq {
			if !yield(v) {
				return
			}
			i++
			if i == n {
				return
			}
		}
	}
}

// Seq2: indeks/qiymat yoki kalit/qiymat.
func Enumerate[T any](seq iter.Seq[T]) iter.Seq2[int, T] {
	return func(yield func(int, T) bool) {
		i := 0
		for v := range seq {
			if !yield(i, v) {
				return
			}
			i++
		}
	}
}

// Resurs bilan iterator: defer ham break'da, ham oxirigacha ishlaydi.
func Lines(text string) iter.Seq[string] {
	return func(yield func(string) bool) {
		defer fmt.Println("  [Lines yopildi]")
		for _, l := range strings.Split(text, "\n") {
			if !yield(l) {
				return
			}
		}
	}
}

func main() {
	pts := []Point{{41.30, 69.20, 60}, {41.31, 69.21, 95}, {41.32, 69.22, 40}, {41.33, 69.23, 110}}

	fast := Filter(Track(pts), func(p Point) bool { return p.Speed > 90 })
	for i, p := range Enumerate(fast) {
		fmt.Println(i, p)
	}

	for p := range Take(Track(pts), 2) {
		fmt.Println("take:", p.Speed)
	}

	fmt.Println("lines (to'liq):")
	for l := range Lines("a\nb") {
		fmt.Println(" ", l)
	}
	fmt.Println("lines (break):")
	for l := range Lines("a\nb\nc") {
		fmt.Println(" ", l)
		break
	}

	// Pull: iterator'ni qo'lda boshqarish.
	next, stop := iter.Pull(Track(pts))
	defer stop()
	a, ok1 := next()
	b, ok2 := next()
	fmt.Println(a.Speed, ok1, b.Speed, ok2)

	// Standart kutubxona: slices.Values, slices.Collect, maps.Keys, slices.Sorted.
	speeds := slices.Collect(func(yield func(int) bool) {
		for p := range Track(pts) {
			if !yield(p.Speed) {
				return
			}
		}
	})
	fmt.Println(speeds)

	byDev := map[string]int{"T-3": 1, "T-1": 2, "T-2": 3}
	fmt.Println(slices.Sorted(maps.Keys(byDev)))

	// Range over int (Go 1.22) va funksiya.
	for i := range 3 {
		fmt.Print(i, " ")
	}
	fmt.Println()
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
0 {41.31 69.21 95}
1 {41.33 69.23 110}
take: 60
take: 95
lines (to'liq):
  a
  b
  [Lines yopildi]
lines (break):
  a
  [Lines yopildi]
60 true 95 true
[60 95 40 110]
[T-1 T-2 T-3]
0 1 2 
```

Tahlil:

- `Filter(Track(pts), ...)` lazy: tezligi 90 dan yuqori ikkita nuqta (95 va 110) `Enumerate` orqali indeks bilan chiqadi. Hech qaysi adapter oraliq slice yaratmaydi.
- `Take(Track(pts), 2)` ikkita elementdan keyin to'xtaydi (`60`, `95`). Adapter ichidagi `if !yield(v) { return }` va hisoblagich zanjir bo'ylab to'xtashni uzatadi: `Take` return qilgach, ichki `range seq` sikli yopiladi va `Track` ning `yield`i ham `false` oladi.
- `Lines` ikki holat: to'liq aylanish (`a`, `b`, keyin `[Lines yopildi]`) va `break` (`a`, keyin `[Lines yopildi]`). Ikkala holatda `defer` ishladi.
- `iter.Pull` ikkita qiymatni qo'lda oladi (`60 true 95 true`), `defer stop()` esa main tugaganda iteratorni to'xtatadi.
- `slices.Collect` iteratorni slice'ga yig'adi (`[60 95 40 110]`), `slices.Sorted(maps.Keys(byDev))` kalitlarni tartibda beradi, `for i := range 3` esa `0 1 2`.

## Qachon qo'llamaslik kerak

- Ketma-ketlik kichik va allaqachon xotirada bo'lsa, slice qaytarish soddaroq va aniqroq. Iterator qo'shimcha funksiya chaqiruvlari va murakkab nazorat oqimini kiritadi. Real foyda: katta yoki cheksiz ma'lumot, qimmat ishlab chiqarish, erta to'xtatish.
- Ketma-ketlikni bir necha marta aylanish kerak bo'lsa, iterator single-use emasligini hujjatlang yoki natijani `slices.Collect` bilan slice'ga yig'ing.
- Concurrent iteratsiya uchun iterator mos emas: `iter.Pull`ning `next`/`stop`si bir vaqtda bir nechta goroutine'dan chaqirilishi xato. Goroutine'lar o'rtasida ma'lumot almashish uchun channel (42-dars) mos.
- Ketma-ketlikni o'zgartirish iterator vazifasi emas: hujjat 'Mutation' bo'limida bunday zarurat bo'lsa pozitsiya tipi va pozitsiyalar iteratorini tavsiya qiladi.
- Chuqur adapter zanjirlari (`Filter(Map(Take(...)))`) o'qilishi qiyin va har bir qatlam funksiya chaqiruvi qo'shadi. Go 1.24 da generic metodlar yo'q (27-dars), shuning uchun zanjir `a.Filter().Map()` shaklida emas, ichma-ich funksiya chaqiruvlari shaklida bo'ladi; bu oddiy `for` sikli bilan almashtirilishi mumkin.
- Mikrooptimizatsiya sifatida qo'llamang: iterator funksiya chaqiruvlarini qo'shadi. Tezlik muhim joyda o'lchang (61-dars); bu darsda iterator xarajati o'lchanmadi.

## Stack'da: Node.js/TypeScript bilan farq

- Generator (`function*`, `yield`) pull modeliga mos: iste'molchi `next()` chaqiradi. Go'dagi `iter.Seq` push modeli: iterator o'zi `yield` chaqiradi, siklni `range` boshqaradi. Pull kerak bo'lsa `iter.Pull` bor.
- TS'da `for...of` + `break` generatorning `return()` metodini chaqiradi va `finally` ishlaydi. Go'da bunga quyidagi zanjir mos keladi: `break` bo'lsa `yield` `false` qaytaradi, iterator `return` qiladi va `defer` ishlaydi.
- Go'da alohida `async` iterator turi yo'q: I/O ga bog'liq ketma-ketlikda iterator ichidagi I/O chaqiruvi oddiy bloklovchi chaqiruv. Bekor qilish uchun iterator konstruktoriga `ctx` parametri beriladi (34-dars); bu muallifning tavsiyasi, `iter` hujjatida kontekst haqida konvensiya yo'q.
- Node.js stream'lari backpressure bilan ishlaydi; Go iteratori backpressure'ni tabiiy beradi, chunki iste'molchi `yield` ichida band bo'lsa iterator kutadi.
- TS'dagi `Array.prototype.map/filter` zanjiri o'rniga Go'da `slices.Collect(Filter(...))` kabi funksiya kompozitsiyasi yoki oddiy `for` sikli ishlatiladi.

## Xulosa

- `iter.Seq[V]` va `iter.Seq2[K, V]`: `yield` callback'ini chaqiradigan funksiya tiplari; Go 1.23 dan `for ... range` ularni to'g'ridan-to'g'ri qabul qiladi.
- `yield` `false` qaytarsa iterator darhol to'xtashi va boshqa `yield` chaqirmasligi shart; buzilsa run-time panic, kompilyator buni ushlamaydi.
- Resurs tozalash iterator ichida `defer` bilan yoziladi: `break` va `return` holatlarida ham ishlaydi.
- `iter.Pull` pull iterator beradi; `stop`ni chaqirish (odatda `defer stop()`) majburiy, va u bir goroutine uchun.
- Iterator katta yoki cheksiz ketma-ketlik va erta to'xtatish uchun foydali; kichik, xotiradagi ma'lumot uchun slice soddaroq.
