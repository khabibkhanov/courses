---
n: 24
slug: generics-asoslari
title: "Generics: type parameter, constraint va type inference"
summary: "Go generics'ning asosi: type parameter ro'yxati, constraint sifatida interface, any/comparable/cmp.Ordered, ~ belgisi, generic tiplar va ularning metodlari, instantiation ikki bosqichi va type inference qoidalari."
duration: 45
sources:
  - id: go-spec
    note: "Type parameter declarations, Instantiations va Type inference bo'limlari; ilovadagi 'Language versions' (Go 1.18, 1.20, 1.21 qatorlari)"
  - id: blog-intro-generics
    note: "Type Parameters, Type sets va Type inference bo'limlari: constraint interface bo'lishi, instantiation ikki qadami, ~ belgisi, any"
  - id: pkg-cmp
    note: "cmp.Ordered, cmp.Compare va cmp.Less ta'riflari"
  - id: go127
    note: "Changes to the language: funksiya tipi inference'i barcha tayinlash kontekstlarida qo'llanishi (Go 1.27)"
quiz:
  - q: "`func Zero[T any]() T { var z T; return z }` va chaqiruv `x := Zero()`. Natija?"
    options:
      - "`nil` qaytadi"
      - "Kompilyatsiya xatosi: `T` ni argumentlardan ham, natija tipidan ham aniqlab bo'lmaydi (`cannot infer T`)"
      - "Kompilyator `any` tanlaydi va `x` nil interface bo'ladi"
      - "Run-time panic"
    answer: 1
    explain: "Type inference funksiya argumentlari (va constraint) asosida ishlaydi; qaytish qiymatining tipi (`x := ...`) inference manbai emas. Argumentsiz funksiyada `T` aniqlanmaydi, chaqiruv `Zero[int]()` bo'lishi kerak."
  - q: "`type Number interface{ int | float64 }`, `type Liters float64`, `func Sum[T Number](xs []T) T`. `Sum([]Liters{1, 2})` nima beradi?"
    options:
      - "Ishlaydi: `Liters` ning asosiy tipi `float64`"
      - "Run-time panic"
      - "Ishlaydi, lekin natija `float64`ga o'tadi"
      - "Kompilyatsiya xatosi: `Liters does not satisfy Number (possibly missing ~ for float64 in Number)`; `~float64` yozish kerak"
    answer: 3
    explain: "Constraint'dagi `float64` faqat aynan `float64` tipini bildiradi. Asosiy (underlying) tipi `float64` bo'lgan barcha nomli tiplarni qabul qilish uchun `~float64` yoziladi. Kompilyator xabarida 'possibly missing ~' maslahati chiqadi."
  - q: "Generic funksiya `func Index[K comparable, V any](xs []V, key func(V) K) map[K]V`. Qaysi chaqiruv kompilyatsiya xatosi beradi?"
    options:
      - "`Index(users, func(u User) []string { return u.Tags })`"
      - "`Index(users, func(u User) string { return u.ID })`"
      - "`Index(users, func(u User) int { return u.Age })`"
      - "`Index(users, func(u User) UserID { return u.ID })` (UserID - `type UserID string`)"
    answer: 0
    explain: "Slice taqqoslanadigan (comparable) tip emas, shuning uchun `[]string` `K` ning constraint'ini qanoatlantirmaydi (`[]string does not satisfy comparable`). Qolgan kalit tiplari (string, int va asosiy tipi string bo'lgan `UserID`) taqqoslanadigan."
  - q: "`type Stack[T any] struct{ items []T }`. `var s Stack` nima beradi?"
    options:
      - "`Stack[any]` ga teng nol qiymat"
      - "Kompilyatsiya xatosi: generic tipni instantiation'siz ishlatib bo'lmaydi"
      - "Kompilyator `T` ni keyingi `Push` chaqiruvidan aniqlaydi"
      - "Ishlaydi, lekin `Push` chaqirib bo'lmaydi"
    answer: 1
    explain: "Generic tip ishlatilishi uchun type argument bilan instantiate qilinadi (`Stack[int]`). Tip uchun inference faqat ayrim kontekstlarda funksiya chaqiruvi orqali ishlaydi, o'zgaruvchi e'lonida emas. Xato: `cannot use generic type Stack[T any] without instantiation`."
  - q: "`func Max[T cmp.Ordered](a, b T) T` va chaqiruv `Max(3, 2.5)`. Natija?"
    options:
      - "Kompilyatsiya xatosi: `int` va `float64` aralash"
      - "Ikkala argument `float64` deb olinadi, natija `3` (`float64` tipida)"
      - "Natija `3` va tipi `int`"
      - "Run-time panic: `3` va `2.5` solishtirib bo'lmaydi"
    answer: 1
    explain: "Ikkala argument ham tipsiz (untyped) konstanta. Spetsifikatsiya: har xil turdagi tipsiz konstantalar aralashsa, natija ro'yxatdagi (int, rune, float, complex) keyingi tur bo'yicha olinadi, ya'ni `float64`. Aralash tipsiz konstanta `int` va `string` (`Max(1, \"a\")`) esa mos kelmaydi va xato beradi. Bu xatti-harakat Go 1.21 inference yaxshilanishlariga tegishli."
  - q: "`func (s *Stack[T]) Map[U any](f func(T) U) []U` Go 1.24 da qanday natija beradi?"
    options:
      - "Ishlaydi, `U` metod ichida yangi type parameter bo'ladi"
      - "Kompilyatsiya xatosi: metod type parameter e'lon qila olmaydi (`method must have no type parameters`)"
      - "Faqat `go vet` ogohlantiradi"
      - "Ishlaydi, agar `U` `any` bo'lsa"
    answer: 1
    explain: "Go 1.24 da metod faqat receiver'dan kelgan type parameter'larni ishlata oladi, o'zining type parameter'ini e'lon qila olmaydi. Bu cheklov Go 1.27 da olib tashlangan (27-dars); shu darsda tekshirilgan 1.24 kompilyatori sintaksis xatosi beradi."
task:
  title: "any va type assertion'ni generic funksiyaga almashtirish"
  prompt: |
    Quyidagi kodda `Max` va `Sum` `any` bilan yozilgan: tiplar run-time'da `switch` orqali tekshiriladi, qo'llab-quvvatlanmaydigan tip esa panic beradi. Bundan tashqari `Liters` kabi nomli tiplar umuman ishlamaydi.

    Vazifa:
    1. `Max` ni `cmp.Ordered` constraint bilan generic funksiyaga aylantiring.
    2. `Sum` uchun `~int | ~int64 | ~float64` constraint'li generic funksiya yozing (`Number` interface'i).
    3. `Liters` (asosiy tipi `float64`) ham `Sum`ga o'tishini ko'rsating, va `main`da `Max("gps", "dut")` kabi satr chaqiruvini qo'shing.
    4. Panic va run-time `switch` butunlay yo'qolsin: noto'g'ri tip kompilyatsiya vaqtida ushlansin.
  lang: go
  starter: |
    package main

    import "fmt"

    // Liters nomli tip: asosiy tipi float64.
    type Liters float64

    // Max any qabul qiladi va run-time'da tipni tekshiradi.
    func Max(a, b any) any {
        switch x := a.(type) {
        case int:
            if x > b.(int) {
                return a
            }
            return b
        case float64:
            if x > b.(float64) {
                return a
            }
            return b
        }
        panic(fmt.Sprintf("qo'llab-quvvatlanmaydigan tip: %T", a))
    }

    // Sum slice'ni any sifatida oladi.
    func Sum(xs []any) any {
        var total float64
        for _, x := range xs {
            switch v := x.(type) {
            case int:
                total += float64(v)
            case float64:
                total += v
            default:
                panic(fmt.Sprintf("qo'llab-quvvatlanmaydigan tip: %T", x))
            }
        }
        return total
    }

    func main() {
        fmt.Println(Max(3, 7), Max(2.5, 1.0))
        fmt.Println(Sum([]any{1, 2.5}))
        defer func() { fmt.Println("recover:", recover()) }()
        fmt.Println(Sum([]any{Liters(10), 5}))
    }
  solution: |
    package main

    import (
        "cmp"
        "fmt"
    )

    // Liters nomli tip: asosiy tipi float64.
    type Liters float64

    // Number asosiy tipi int, int64 yoki float64 bo'lgan barcha tiplarni qamraydi.
    type Number interface {
        ~int | ~int64 | ~float64
    }

    // Max har qanday tartiblanadigan tip uchun ishlaydi.
    func Max[T cmp.Ordered](a, b T) T {
        if a > b {
            return a
        }
        return b
    }

    // Sum sonli slice yig'indisini T tipida qaytaradi.
    func Sum[T Number](xs []T) T {
        var total T
        for _, x := range xs {
            total += x
        }
        return total
    }

    func main() {
        fmt.Println(Max(3, 7), Max(2.5, 1.0), Max("gps", "dut"))
        fmt.Println(Sum([]float64{1, 2.5}), Sum([]int{1, 2, 3}))
        fmt.Println(Sum([]Liters{10, 5.5}))
        // Sum([]string{"a"}) endi kompilyatsiya xatosi: string does not satisfy Number
    }
  solutionNotes: |
    - `Max[T cmp.Ordered]` barcha tartiblanadigan tiplar (butun sonlar, float'lar, string va ularning nomli hosilalari) uchun `>` ishlatishga imkon beradi. Run-time `switch` va `default` panic'i kerak emas.
    - `Number` constraint'ida `~` bor, shuning uchun `Liters` (asosiy tipi `float64`) mos keladi. `~`siz u `Sum`ga o'tmas edi.
    - `var total T` T ning nol qiymatini beradi: sum uchun to'g'ri boshlang'ich qiymat, `+=` esa constraint'dagi barcha tiplar uchun ruxsat etilgan operatsiya.
    - Noto'g'ri tip (masalan, `Sum([]string{...})`) endi kompilyatsiya xatosi: `string does not satisfy Number`. Run-time panic yo'qoldi.
    - `Max(3, 7)` va `Max("gps", "dut")` uchun type argument yozilmadi: inference argument tiplaridan `T` ni aniqladi.
  checklist:
    - "`Max` `cmp.Ordered` constraint'li generic funksiya"
    - "`Sum` `~int | ~int64 | ~float64` constraint'li, `Liters` o'tadi"
    - "Run-time `switch` va `panic` olib tashlangan"
    - "`Max` ham sonlar, ham satrlar bilan chaqirilgan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go 1.18 ga qadar bir xil algoritmni turli tiplar uchun yozish uch yo'ldan biriga olib kelardi. Birinchisi: har bir tip uchun alohida funksiya (`MaxInt`, `MaxFloat64`, `MaxString`): takrorlanish va nomlar ko'payishi. Ikkinchisi: `interface{}` qabul qilib, ichkarida type switch bilan ishlash (23-dars): tip xavfsizligi yo'qoladi va xato run-time panic bo'lib chiqadi. Uchinchisi: kod generatsiyasi va `reflect`: murakkab va statik tekshirilmaydi. Standart kutubxonaning o'zida `sort.Slice` kabi funksiyalar `any` qabul qilar edi.

TypeScript tajribasi bu yerda chalg'itadi: TS generics'i kompilyatsiyadan keyin o'chib ketadigan tip ma'lumoti, constraint esa `T extends Foo` bilan strukturaviy tekshiriladi, va `T` qiymati ustida constraint'dagi har qanday xususiyatni ishlatish mumkin. Go'da constraint interface, ruxsat etilgan operatsiyalar esa constraint'dagi **barcha** tiplar uchun mumkin bo'lganlar bilan chegaralanadi. Bu dars asosiy mexanikani beradi: type parameter ro'yxati, constraint'lar, instantiation va type inference. Qachon generics ishlatish kerakligi 26-darsda, constraint'ning chuqur nazariyasi 25-darsda.

## Asosiy g'oya

### Type parameter va instantiation

Generics uchta yangilik olib keldi (Go blogi): funksiya va tiplar uchun type parameter'lar, tiplar to'plami sifatida interface'lar, va type inference. Type parameter ro'yxati oddiy parametr ro'yxatiga o'xshaydi, lekin kvadrat qavsda yoziladi. Spetsifikatsiya ilovasi shu xususiyat Go 1.18 da qo'shilganini ko'rsatadi.

`func Max[T cmp.Ordered](a, b T) T` da `T` type parameter, `cmp.Ordered` uning constraint'i. Funksiyani aniq type argument bilan chaqirish instantiation deyiladi: `Max[int](2, 3)`. Blog instantiation ikki qadamni tasvirlaydi: avval kompilyator type argument'larni generic funksiya yoki tip bo'ylab type parameter'lar o'rniga qo'yadi, keyin har bir type argument tegishli constraint'ni qanoatlantirishini tekshiradi. Ikkinchi qadam muvaffaqiyatsiz bo'lsa, instantiation va demak dastur ham noto'g'ri.

### Constraint - interface

Go'da constraint har doim interface. Interface endi faqat metodlar to'plami emas, tiplar to'plamini (type set) belgilaydi: metodlar ro'yxati, yoki `int | string | bool` kabi union, yoki `~string` (asosiy tipi `string` bo'lgan barcha tiplar). Bu darsda kerak bo'ladigan constraint'lar:

- `any`: bo'sh interface uchun alias (Go 1.18 da kiritilgan). Har qanday tip mos, lekin `T` qiymati ustida deyarli hech narsa qilib bo'lmaydi (tayinlash, uzatish, `var zero T`).
- `comparable`: `==` va `!=` ishlatsa bo'ladigan tiplar; map kaliti uchun zarur. Go 1.20 dan taqqoslanadigan interface tiplari ham `comparable`ni qanoatlantiradi (spetsifikatsiya ilovasi), lekin dynamic tip taqqoslanmaydigan bo'lsa run-time'da panic bo'lishi mumkin (19-dars).
- `cmp.Ordered`: `<`, `<=`, `>`, `>=` ishlaydigan tiplar: barcha butun va float tiplar va string, hamda ularning `~` hosilalari. `cmp` paketi Go 1.21 da qo'shilgan (Go distributividagi `api/go1.21.txt`).

Funksiya tanasida type parameter qiymati ustida operatsiya faqat constraint type set'idagi barcha tiplar uchun ruxsat etilgan bo'lsa mumkin. `any` constraint'li `T` uchun `a > b` yozilsa:

```text
invalid operation: a > b (type parameter T cannot use operator >)
```

Xabar Go 1.24.7 kompilyatoridan.

### Generic tip va uning metodlari

Tiplar ham type parameter oladi: `type Stack[T any] struct{ items []T }`. Generic tip ishlatilishi uchun instantiate qilinadi (`Stack[int]`); o'zgaruvchi e'lonida `var s Stack` kompilyatsiya xatosi (`cannot use generic type Stack[T any] without instantiation`). Metod receiver'ida type parameter'lar qayta e'lon qilinadi: `func (s *Stack[T]) Push(x T)`. Spetsifikatsiya: receiver tip parametrlarining constraint'lari tip e'lonidan implicit olinadi, nomlari esa farq qilishi mumkin. Go 1.24 da metod o'zining type parameter'ini e'lon qila olmaydi (27-darsda bu Go 1.27 da o'zgargani ko'riladi).

## Chuqurroq: ~, inference va nol qiymat

### Tilda ~ nima uchun kerak

`type Liters float64` yangi nomli tip, uning asosiy (underlying) tipi `float64`. Constraint'da `float64` yozilgan bo'lsa, faqat aynan `float64` mos keladi. `~float64` esa asosiy tipi `float64` bo'lgan barcha tipni qamraydi. Kompilyator bunday xatoda yo'l ko'rsatadi:

```text
MyInt does not satisfy Num (possibly missing ~ for int in Num)
```

Domen tiplari (`Liters`, `DeviceID`, `Km`) odatda nomli tiplar bo'lgani uchun, sonli constraint'larni `~` bilan yozish amaliy qoida.

### Type inference

Type argument'larni ko'p hollarda yozish shart emas: kompilyator ularni chaqiruvdagi argumentlardan aniqlaydi (function argument type inference). `Map(fuels, func(f float64) string {...})` da `T=float64` ikkinchi argumentdan va birinchi argumentdan mos kelishi, `U=string` esa funksiya natija tipidan chiqadi. Qoidalar:

- Inference argument tiplariga tayanadi, natija qiymati tayinlanadigan o'zgaruvchi tipiga emas. Shu sababli `Zero()` kabi argumentsiz chaqiruv uchun type argument aniq yoziladi: `Zero[int]()`. Aks holda `cannot infer T`.
- Spetsifikatsiya ilovasiga ko'ra Go 1.21 da inference interface metodlari tiplarini ham ishlatadigan bo'ldi va generic funksiyani o'zgaruvchiga tayinlash yoki boshqa funksiyaga argument qilib berishda ham type argument'larni aniqlay oladi.
- Tipsiz konstantalar: ikkala argument ham tipsiz konstanta bo'lsa va turlari har xil bo'lsa, natija (int, rune, float, complex) ro'yxatdagi keyingisi bo'yicha. `Max(3, 2.5)` da `T=float64`. `Max(1, "a")` esa tur mos kelmagani uchun xato: `mismatched types untyped int and untyped string (cannot infer T)`.
- Go 1.27 da funksiya tipi inference'i funksiya tayinlanadigan barcha kontekstlarga kengaytirilgan (go127 release notes); bu darsdagi kod buni ishlatmaydi.

### Nol qiymat

Type parameter'li tip uchun nol qiymat `var zero T` bilan olinadi. Bu `Pop` kabi funksiyalarda "topilmadi" holatida `zero` va xato qaytarishning standart usuli. `nil` qaytarish `T` ixtiyoriy tip bo'lsa ishlamaydi.

### Constraint interface'ni oddiy tip sifatida ishlatib bo'lmaydi

Type set elementlari bor interface faqat constraint sifatida ishlatiladi (blog: yangi sintaksis shakllaridagi interface'lar hozircha faqat constraint bo'la oladi). `var n Num` yoki `comparable` o'zgaruvchi tipi sifatida:

```text
cannot use type Num outside a type constraint: interface contains type constraints
cannot use type comparable outside a type constraint: interface is (or embeds) comparable
```

Ikkala xabar Go 1.24.7 dan. `[]int` kabi taqqoslanmaydigan tip `comparable` talab qilinganda: `[]int does not satisfy comparable`.

## Misol: yordamchi funksiyalar, Stack va indekslash

Dastur oddiy funksional yordamchilarni (`Map`, `Filter`), constraint'li `Max` va `Sum`ni, generic `Stack`ni va `comparable` kalitli `Index`ni ko'rsatadi. `Liters` nomli tip bo'lgani uchun `Number`da `~` kerak.

```go run
package main

import (
	"cmp"
	"errors"
	"fmt"
	"strconv"
)

// Map, Filter, Reduce: type parameter'lar kvadrat qavsda.
func Map[T, U any](xs []T, f func(T) U) []U {
	out := make([]U, 0, len(xs))
	for _, x := range xs {
		out = append(out, f(x))
	}
	return out
}

func Filter[T any](xs []T, keep func(T) bool) []T {
	var out []T
	for _, x := range xs {
		if keep(x) {
			out = append(out, x)
		}
	}
	return out
}

// Max cmp.Ordered constraint bilan: <, > ishlaydi.
func Max[T cmp.Ordered](a, b T) T {
	if a > b {
		return a
	}
	return b
}

// Number ~ bilan: asosiy tipi int yoki float64 bo'lgan nomli tiplar ham mos.
type Number interface {
	~int | ~int64 | ~float64
}

func Sum[T Number](xs []T) T {
	var total T
	for _, x := range xs {
		total += x
	}
	return total
}

// Liters nomli tip: asosiy tipi float64.
type Liters float64

// Generic tip: Stack va uning metodlari.
type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(x T) { s.items = append(s.items, x) }

func (s *Stack[T]) Pop() (T, error) {
	var zero T
	if len(s.items) == 0 {
		return zero, errors.New("stack bo'sh")
	}
	x := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return x, nil
}

// Keys comparable: map kaliti bo'lishi mumkin bo'lgan tiplar.
func Index[K comparable, V any](xs []V, key func(V) K) map[K]V {
	m := make(map[K]V, len(xs))
	for _, x := range xs {
		m[key(x)] = x
	}
	return m
}

type Device struct {
	ID   string
	Fuel Liters
}

func main() {
	fuels := []float64{54.5, 12, 80.5}
	// Inference: T=float64, U=string.
	labels := Map(fuels, func(f float64) string { return strconv.FormatFloat(f, 'f', 1, 64) + " l" })
	fmt.Println(labels)

	low := Filter(fuels, func(f float64) bool { return f < 50 })
	fmt.Println(low)

	fmt.Println(Max(3, 7), Max("gps", "dut"), Max(2.5, 1.0))
	fmt.Println(Sum([]Liters{10, 20.5}), Sum([]int{1, 2, 3}))

	var s Stack[Device]
	s.Push(Device{"T-1", 40})
	d, err := s.Pop()
	fmt.Println(d, err)
	_, err = s.Pop()
	fmt.Println(err)

	byID := Index([]Device{{"T-1", 40}, {"T-2", 5}}, func(d Device) string { return d.ID })
	fmt.Println(byID["T-2"].Fuel)

	// Aniq instansiatsiya: inference yetmaganda.
	parse := Map[string, int]
	n := parse([]string{"1", "22"}, func(s string) int { v, _ := strconv.Atoi(s); return v })
	fmt.Println(n)
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
[54.5 l 12.0 l 80.5 l]
[12]
7 gps 2.5
30.5 6
{T-1 40} <nil>
stack bo'sh
5
[1 22]
```

Tahlil:

- `Map(fuels, ...)` type argument'siz chaqirildi: `T=float64` va `U=string` inference orqali topildi. `Max(3, 7)`, `Max("gps", "dut")` va `Max(2.5, 1.0)` bir funksiyaning uch xil instansiyasi.
- `Sum([]Liters{10, 20.5})` `30.5`, `Sum([]int{1, 2, 3})` `6` beradi: `Number`dagi `~float64` va `~int` sababli ikkala tip mos.
- `Stack[Device].Pop` bo'sh stack'da `var zero T` va xato qaytaradi, chaqiruvchi `T` uchun nol `Device{}` oladi. Chiqishdagi `{T-1 40} <nil>`: struct qiymati va nil xato.
- `Index` uchun `K comparable`: `string` kalit bilan `map[string]Device` hosil bo'ldi. `K` o'rniga `[]string` berish kompilyatsiya xatosi bo'lardi.
- `parse := Map[string, int]` generic funksiyani aniq instantiate qilib qiymatga aylantiradi. Instantiate qilingan funksiya oddiy funksiya, uni o'zgaruvchiga saqlash mumkin.

Instantiation xatolarining yana ikki ko'rinishi:

```go
func Eq[T comparable](a, b T) bool { return a == b }

var _ = Eq([]int{1}, []int{1}) // xato
```

```text
[]int does not satisfy comparable
```

## Qachon qo'llamaslik kerak

Generics tilning imkoniyati, har qanday takrorlanishga dori emas. Bu darsga tegishli cheklovlar:

- Constraint ochiq bo'lgan `any` bilan faqat tayinlash, uzatish va saqlash mumkin. Agar funksiya tanasida `T` ustida metod chaqirish kerak bo'lsa, oddiy interface qabul qilish ko'pincha soddaroq (26-dars).
- Constraint ichiga murakkab union'lar yozish (`int | int8 | ...` ro'yxatini qo'lda) o'rniga `cmp.Ordered` kabi tayyor constraint'dan foydalaning. Qo'lda yozilgan ro'yxat yangi tiplarni (masalan, nomli hosilalar) qamramaydi.
- Generic funksiya imzosi o'qilmay qolsa (uch-to'rt type parameter, ichma-ich constraint'lar), bu dizayn belgisi: ko'pincha konkret tip yoki interface yaxshiroq.
- Type argument'larni tushunarlilik uchun aniq yozish ayb emas: `Zero[int]()` yoki `Map[string, int]` inference ishlamaydigan joylarda zarur.
- Reflection yoki code generation bilan taqqoslanganda generics tip xavfsiz, lekin ayrim dinamik vazifalarda (struct maydonlari bo'yicha yurish) generics yordam bermaydi: 30-dars.

## Stack'da: TypeScript bilan farq

TypeScript: `function max<T extends number | string>(a: T, b: T): T { return a > b ? a : b }`. Go: `func Max[T cmp.Ordered](a, b T) T`. Asosiy farqlar:

- Go'da generic funksiya instantiation'da tekshiriladi: har bir type argument constraint'ni qanoatlantirishi kerak va tanada ruxsat etilgan operatsiyalar type set bilan belgilanadi. TS'da constraint tanadagi xususiyatlarga kirishni belgilaydi, run-time'da esa tip yo'q.
- Go'da `T` run-time qiymatlarga ta'sir qiladi: `var zero T` nol qiymatni beradi, har xil type argument'lar boshqa tiplar. TS'da `T` kompilyatsiyadan keyin yo'qoladi.
- TS'da `any` tip tekshiruvini o'chiradi; Go'da `any` constraint sifatida faqat 'har qanday tip', lekin tanada kam operatsiya ruxsat etilgan, ya'ni xavfsizroq.
- Domen tiplari (`type DeviceID string`) uchun Go'da constraint'ni `~string` bilan yozish odat; aks holda nomli tip constraint'dan chetda qoladi.

## Xulosa

- Type parameter'lar kvadrat qavsda e'lon qilinadi; constraint har doim interface, instantiation esa substitution va constraint tekshiruvi ikki qadamidan iborat.
- `any`, `comparable` va `cmp.Ordered` asosiy constraint'lar; `~T` asosiy tipi `T` bo'lgan nomli tiplarni ham qamraydi, domen tiplari uchun odatda kerak.
- Funksiya tanasida type parameter ustida faqat constraint'dagi barcha tiplar uchun ruxsat etilgan operatsiyalar mumkin.
- Type inference argument tiplariga tayanadi: argumentsiz yoki natija tipi orqali aniqlanadigan chaqiruvlarda type argument aniq yoziladi.
- Generic tip instantiate qilinadi (`Stack[int]`); Go 1.24 da metod o'z type parameter'ini e'lon qila olmaydi, bu cheklov Go 1.27 da olib tashlangan (27-dars).
