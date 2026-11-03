---
n: 25
slug: generics-type-set
title: "Constraint chuqur: type set, core type va o'ziga murojaat qiluvchi constraint"
summary: "Interface'ning type set sifatidagi aniq ta'rifi: union, ~, kesishma va bo'sh to'plam; implements va satisfies farqi; core type tushunchasi va uning Go 1.25 da spetsifikatsiyadan olib tashlanishi; Go 1.26 dagi o'ziga murojaat qiluvchi constraint."
duration: 45
sources:
  - id: go-spec
    note: "Interface types bo'limi (General interfaces: type set ta'riflari, union/~ qoidalari, disjoint talabi), Implementing an interface, Satisfying a type constraint; go1.24 spetsifikatsiyasidagi Core types bo'limi bilan taqqoslangan"
  - id: go125
    note: "Changes to the language: core type tushunchasi spetsifikatsiyadan olib tashlangan, dasturlarga ta'sir qiluvchi o'zgarish yo'q"
  - id: go126
    note: "Changes to the language: generic tip o'zining type parameter ro'yxatida o'ziga murojaat qila olishi (Adder misoli)"
  - id: blog-intro-generics
    note: "Type sets bo'limi: interface'ni tiplar to'plami sifatida ko'rish, ~ belgisi, constraint'dagi interface faqat constraint sifatida ishlatilishi"
quiz:
  - q: "`type Liters float64`. `interface{ int | float64 }` va `interface{ ~int | ~float64 }` constraint'larining qaysi birini `Liters` qanoatlantiradi?"
    options:
      - "Ikkalasini ham, chunki asosiy tipi `float64`"
      - "Faqat ikkinchisini: `~float64` asosiy tipi `float64` bo'lgan barcha tiplarni qamraydi"
      - "Faqat birinchisini"
      - "Hech birini: `Liters` yangi tip"
    answer: 1
    explain: "`float64` termi faqat aynan `float64` tipini bildiradi, `~float64` esa asosiy tipi `float64` bo'lgan tiplar to'plamini. `Liters` birinchi constraint'ning type set'ida yo'q."
  - q: "`type A interface{ ~int }; type B interface{ ~string }; type AB interface{ A; B }` va `func F[T AB](x T)`. `F` ni qanday tip bilan instantiate qilish mumkin?"
    options:
      - "`int` bilan ham, `string` bilan ham"
      - "Faqat `int` bilan"
      - "Faqat `string` bilan"
      - "Hech qanday tip bilan: embed qilingan interface'larning type set'lari kesishadi, kesishma bo'sh"
    answer: 3
    explain: "Bo'sh bo'lmagan interface'ning type set'i uning elementlari type set'larining kesishmasi. `~int` va `~string` kesishmasi bo'sh, shuning uchun instantiation'da `cannot satisfy AB (empty type set)`. Union uchun `|` ishlatiladi."
  - q: "`type MyInt int` va `type Bad interface{ ~int | MyInt }`. Nima bo'ladi?"
    options:
      - "Kompilyatsiya xatosi: union'dagi non-interface term'larning type set'lari juft-juft kesishmasligi (disjoint) shart, `MyInt` esa `~int` ichida"
      - "Ishlaydi, `MyInt` ortiqcha, e'tiborsiz qoldiriladi"
      - "Ishlaydi, lekin `go vet` ogohlantiradi"
      - "Run-time'da instantiation paytida panic"
    answer: 0
    explain: "Spetsifikatsiya: union'dagi non-interface term'larning type set'lari disjoint bo'lishi kerak. Kompilyator xabari: `overlapping terms main.MyInt and ~int`. Takroriy term yozish ruxsat etilmaydi."
  - q: "Go 1.25 release notes core type haqida nima deydi?"
    options:
      - "Core type tushunchasi tilga qo'shildi va `range` endi faqat core type bilan ishlaydi"
      - "Core type o'rniga type parameter'lar uchun reflection ishlatiladi"
      - "Spetsifikatsiyadan core type tushunchasi olib tashlandi va maxsus bayonlar bilan almashtirildi; dasturlarga ta'sir qiluvchi til o'zgarishi yo'q"
      - "Core type bilan bog'liq cheklovlar olib tashlandi: endi har qanday union ustida `range` ishlaydi"
    answer: 2
    explain: "Release notes: Go 1.25 da dasturlarga ta'sir qiladigan til o'zgarishlari yo'q, lekin spetsifikatsiyada core type tushunchasi alohida bayonlar foydasiga olib tashlangan. Ya'ni bu hujjat o'zgarishi, xatti-harakat o'zgarishi emas; shuning uchun `~[]int | ~[]string` ustidan `range` hamon mumkin emas."
  - q: "`type Adder[A Adder[A]] interface{ Add(A) A }` qaysi versiyadan kompilyatsiya bo'ladi va Go 1.24 da nima beradi?"
    options:
      - "Go 1.18 dan; Go 1.24 da ham kompilyatsiya bo'ladi"
      - "Go 1.26 dan; Go 1.24 da `invalid recursive type: Adder refers to itself` xatosi"
      - "Go 1.27 dan; Go 1.24 da faqat ogohlantirish"
      - "Hech qachon: bunday e'lon taqiqlangan"
    answer: 1
    explain: "Go 1.26 release notes: generic tip o'zining type parameter ro'yxatida o'ziga murojaat qila olmasligi cheklovi olib tashlangan. Go 1.24.7 da e'lon `invalid recursive type: Adder refers to itself` xatosi bilan rad etiladi. Shu darsning Go 1.18 dan ishlaydigan muqobili: `Lesser[T any]` interface'i va `Min[T Lesser[T]]` funksiyasi."
  - q: "`func Eq[T comparable](a, b T) bool` va `Eq[any]([]int{1}, []int{1})`. Natija?"
    options:
      - "Kompilyatsiya xatosi: `any` comparable emas"
      - "`true`"
      - "`false`"
      - "Kompilyatsiya bo'ladi (Go 1.20 dan interface'lar `comparable`ni qanoatlantiradi), lekin run-time panic: `comparing uncomparable type []int`"
    answer: 3
    explain: "Go 1.20 dan taqqoslanadigan interface tiplari (masalan, `any`) `comparable` constraint'ini qanoatlantiradi, garchi uni implement qilmasa ham (strictly comparable emas). Shu sababli dynamic tip taqqoslanmaydigan bo'lsa, `==` run-time'da panic beradi."
task:
  title: "Takrorlanishni type set constraint bilan yo'qotish"
  prompt: |
    Quyidagi kodda har bir o'lchov birligi uchun (`Liters`, `Km`) alohida `Total` va `Report` funksiyalari yozilgan. Ikkala tipning asosiy tipi sonli (`float64`, `int`) va ikkalasida `String()` metodi bor.

    Vazifa:
    1. Ikkala tipni qamraydigan `Measure` constraint'ini yozing: `~float64 | ~int` union va `String() string` metodi birga (type set kesishmasi).
    2. Ikkita takroriy funksiyani bitta generic `Total[M Measure]` va `Report[M Measure]` bilan almashtiring.
    3. `main`da ikkala tipni sinang. Izohda tushuntiring: nima uchun `Report([]float64{1})` kompilyatsiya bo'lmaydi.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "strings"
    )

    type Liters float64
    type Km int

    func (l Liters) String() string { return fmt.Sprintf("%.1f l", float64(l)) }
    func (k Km) String() string     { return fmt.Sprintf("%d km", int(k)) }

    // Har bir o'lchov birligi uchun alohida nusxa: takrorlanish.
    func TotalLiters(xs []Liters) Liters {
        var t Liters
        for _, x := range xs {
            t += x
        }
        return t
    }

    func TotalKm(xs []Km) Km {
        var t Km
        for _, x := range xs {
            t += x
        }
        return t
    }

    func ReportLiters(xs []Liters) string {
        parts := make([]string, 0, len(xs))
        for _, x := range xs {
            parts = append(parts, x.String())
        }
        return strings.Join(parts, ", ") + " | jami " + TotalLiters(xs).String()
    }

    func ReportKm(xs []Km) string {
        parts := make([]string, 0, len(xs))
        for _, x := range xs {
            parts = append(parts, x.String())
        }
        return strings.Join(parts, ", ") + " | jami " + TotalKm(xs).String()
    }

    func main() {
        fmt.Println(ReportLiters([]Liters{10, 20.5}))
        fmt.Println(ReportKm([]Km{100, 250}))
    }
  solution: |
    package main

    import (
        "fmt"
        "strings"
    )

    type Liters float64
    type Km int

    func (l Liters) String() string { return fmt.Sprintf("%.1f l", float64(l)) }
    func (k Km) String() string     { return fmt.Sprintf("%d km", int(k)) }

    // Measure: asosiy tipi float64 yoki int bo'lgan va String() metodi bor tiplar.
    // Type set - sonli tiplar va String() metodi bor tiplarning kesishmasi.
    type Measure interface {
        ~float64 | ~int
        String() string
    }

    func Total[M Measure](xs []M) M {
        var t M
        for _, x := range xs {
            t += x
        }
        return t
    }

    func Report[M Measure](xs []M) string {
        parts := make([]string, 0, len(xs))
        for _, x := range xs {
            parts = append(parts, x.String())
        }
        return strings.Join(parts, ", ") + " | jami " + Total(xs).String()
    }

    func main() {
        fmt.Println(Report([]Liters{10, 20.5}))
        fmt.Println(Report([]Km{100, 250}))
        // Report([]float64{1}) kompilyatsiya bo'lmaydi: float64 da String() yo'q.
        // Report([]string{"a"}) ham: string type set'da yo'q.
    }
  solutionNotes: |
    - `Measure` ikki talabning kesishmasi: tip sonli asosiy tipga ega (`~float64 | ~int`) VA `String()` metodiga ega. Type set ikkala shartni qanoatlantiradigan tiplardan iborat: `Liters`, `Km`.
    - `Total` ichida `t += x` ruxsat etilgan, chunki `+` constraint'dagi barcha tiplar (`~float64` va `~int`) uchun ruxsat etilgan. `x.String()` esa constraint metod ro'yxatida bo'lgani uchun chaqiriladi.
    - `Report([]float64{1})` kompilyatsiya bo'lmaydi: `float64` da `String()` yo'q, shu sababli u type set'ga kirmaydi (`M (type float64) does not satisfy Measure (missing method String)`).
    - Type argument'lar yozilmadi: inference `[]Liters` dan `M=Liters` ni aniqladi.
    - Constraint'da `~` (tilde) zarur: domen tiplari nomli, shuning uchun `float64` o'rniga `~float64`.
  checklist:
    - "`Measure` constraint'i union (`~float64 | ~int`) va `String() string` metodini birlashtiradi"
    - "`TotalLiters`, `TotalKm`, `ReportLiters`, `ReportKm` o'rniga bitta generic `Total` va `Report`"
    - "Chiqish starter'dagi bilan bir xil"
    - "`float64` yoki `string` slice'i bilan chaqirish kompilyatsiya xatosi bo'lishi izohda tushuntirilgan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

24-darsda constraint'larni tayyor nomlar (`any`, `comparable`, `cmp.Ordered`) va oddiy `~T | ~U` shaklida ishlatdik. Real kodda ko'proq narsa kerak bo'ladi: sonli tip bo'lishi va bir vaqtda metodga ega bo'lishi, slice tipini saqlab qaytarish, `map` yoki `chan` tiplari bilan ishlash, yoki tip o'zi bilan bir turdagi boshqa qiymat bilan ishlashi (`Add`, `Less`, `Equal`). Bu darajada constraint'larni qo'lda to'g'ri yozish uchun interface'ning type set sifatidagi aniq ta'rifini bilish kerak. Aks holda uchta tipik muammo chiqadi: bo'sh type set (hech qanday tip mos kelmaydi), kesishuvchi term'lar (kompilyator rad etadi), va xato xabarlarini o'qiy olmaslik.

Tushunish uchun qo'shimcha sabab bor: eski hujjat va maqolalarda 'core type' atamasi ko'p uchraydi, Go 1.25 dan beri esa spetsifikatsiyada u yo'q. Bu dars atamaning nima ekanini va nima uchun olib tashlanganini aniq beradi. Va nihoyat, Go 1.26 constraint'ning o'ziga murojaat qilishiga ruxsat berdi, bu esa Go 1.18-1.25 da ishlatilgan bir necha chetlab o'tish usullarini keraksiz qiladi.

## Asosiy g'oya

### Interface = type set

Spetsifikatsiya interface tipini type set orqali belgilaydi. Qoidalar (Go 1.27 spetsifikatsiyasi, 'General interfaces' bo'limi):

- Bo'sh interface'ning type set'i barcha non-interface tiplar to'plami.
- Bo'sh bo'lmagan interface'ning type set'i uning interface elementlari type set'larining kesishmasi.
- Metod spetsifikatsiyasining type set'i method set'i shu metodni o'z ichiga olgan barcha non-interface tiplar.
- Non-interface tip termi `T` ning type set'i faqat `T` ning o'zi.
- `~T` termining type set'i asosiy tipi `T` bo'lgan barcha tiplar.
- Union `t1 | t2 | ... | tn` ning type set'i term'lar type set'larining birlashmasi.

Muhim aniqlik: 'barcha non-interface tiplar' dasturdagi tiplar emas, barcha mumkin dasturlardagi barcha mumkin tiplar, ya'ni cheksiz to'plam. Interface'ning type set'ida interface tip hech qachon bo'lmaydi.

Spetsifikatsiyadagi misollar fikrni aniqlashtiradi: `interface{ ~int; String() string }` asosiy tipi `int` bo'lib `String` metodiga ega tiplarni belgilaydi; `interface{ int; string }` esa bo'sh type set (hech bir tip bir vaqtda `int` va `string` bo'la olmaydi).

### Term qoidalari

- `~T` da `T` ning asosiy tipi o'zi bo'lishi kerak va `T` interface bo'lmasligi shart. `~MyInt` noto'g'ri (`MyInt`ning asosiy tipi `int`, o'zi emas), `~error` ham noto'g'ri (interface).
- `T` yoki `~T` termida `T` type parameter bo'la olmaydi.
- Union'dagi barcha non-interface term'larning type set'lari juft-juft kesishmasligi (disjoint) shart. `~int | MyInt` noto'g'ri, chunki `MyInt` allaqachon `~int` ichida.

### Implements va satisfies

Tip `T` interface `I` ni implement qiladi, agar `T` non-interface bo'lib `I` ning type set'ining elementi bo'lsa, yoki `T` interface bo'lib uning type set'i `I` ning type set'ining qismi bo'lsa. Constraint'ni qanoatlantirish (satisfies) odatda implements bilan bir xil, lekin bitta istisno bor: `comparable`. Spetsifikatsiya: taqqoslanadigan interface tiplari (masalan `any`) `comparable`ni implement qilmaydi (chunki ular strictly comparable emas), lekin uni qanoatlantiradi (Go 1.20 dan). Natijada `Eq[any]` instantiation to'g'ri, ammo dynamic tip taqqoslanmaydigan bo'lsa `==` run-time'da panic beradi.

## Chuqurroq: kesishma, core type va o'ziga murojaat

### Kesishma va bo'sh to'plam

Embedding union emas, kesishmani beradi. `A interface{ ~int }`, `B interface{ ~string }`, `AB interface{ A; B }` bo'lsa `AB` ning type set'i bo'sh, instantiation xatosi esa `cannot satisfy AB (empty type set)`. Bu xato odatda 'ikkita constraint'ni qo'shaman' deb o'ylab, aslida kesishtirganda chiqadi. Union kerak bo'lsa `|` bilan yozing. Kesishma esa foydali: `~float64 | ~int` va `String() string` ni birga yozish (misol va topshiriqdagi `Measure`) aynan kesishmadir. `SmallNumeric` misoli ham shu: `~int|~int64|~float64` bilan `~int|~int8|~int16` kesishmasi faqat `~int`ni qoldiradi, shuning uchun `int8` bunday constraint'ni qanoatlantirmaydi.

### Core type

Core type Go 1.24 va undan oldingi spetsifikatsiyada shunday ta'riflangan edi (go1.24 spetsifikatsiyasi lokal o'qildi): non-interface tipning core type'i uning asosiy tipi; interface uchun esa core type mavjud, agar type set'dagi barcha tiplarning bitta umumiy asosiy tipi `U` bo'lsa (core type `U`), yoki type set faqat bir xil element tipli kanallardan iborat bo'lib, yo'naltirilgan kanallarning yo'nalishi bir xil bo'lsa. Aks holda core type yo'q. Misollar: `interface{ ~[]*data; String() string }` core type'i `[]*data`; `interface{ Celsius | float64 }` esa core type'ga ega emas.

Core type bir qator operatsiyalar uchun ishlatilgan: type parameter ustida `range`, `make`, indekslash, slice ifodalari, `append`, `copy`, va kompozit literal. Operatsiya core type talab qilgan joyda core type bo'lmasa, Go 1.24 kompilyatori shunday xabar beradi:

```text
cannot range over x (variable of type T constrained by ~[]int | ~[]string): no core type
invalid argument: cannot make T: no core type
```

Ikkala xabar Go 1.24.7 dan. `~[]int | ~[]string` da ikkita asosiy tip bor, shuning uchun core type yo'q; `~[]int | ~[]int8` ustida `len` ishlaydi (Go 1.24.7 da tekshirildi), chunki Go 1.24 spetsifikatsiyasida `len(e)` type set'dagi har bir tip uchun to'g'ri bo'lishi kifoya, `range` esa core type talab qiladi.

Go 1.25 release notes: dasturlarga ta'sir qiladigan til o'zgarishi yo'q, lekin spetsifikatsiyada core type tushunchasi olib tashlangan va alohida bayonlar bilan almashtirilgan. Go 1.27 spetsifikatsiyasida 'core type' iborasi umuman uchramaydi. Ya'ni hujjatda soddalashtirish bo'lgan, til esa shu o'zgarishsiz qolgan: `for range x` uchun type parameter ustida range ruxsat etilishi qoidasi endi spetsifikatsiyada shunday ifodalangan: type set'dagi barcha tiplar bir xil asosiy tipga ega va range ifodasi shu tip uchun to'g'ri bo'lishi kerak (kanallar bundan istisno bo'lib, ularning element tiplari bir xil bo'lishi va qabul qilishga ruxsat berishi kerak). Xato xabarlarining matni versiyalar o'rtasida o'zgarishi mumkin, shuning uchun 'no core type' matniga tayanib kod yozmang. Eski maqolada 'core type' ni ko'rsangiz, bu tushuncha hozir ham bor qoidalarni tushuntiradi, faqat nomi spetsifikatsiyada qolmagan.

### O'ziga murojaat qiluvchi constraint

Muammo: 'o'zi kabi boshqa qiymat bilan ishlaydigan' tip uchun constraint (`Add(A) A`, `Less(A) bool`). Go 1.26 dan oldin generic tip o'zining type parameter ro'yxatida o'ziga murojaat qila olmasdi. Go 1.24.7 da:

```text
invalid recursive type: Adder refers to itself
```

Go 1.26 release notes shu cheklov olib tashlanganini yozadi va misol keltiradi:

```go
type Adder[A Adder[A]] interface {
    Add(A) A
}

func algo[A Adder[A]](x, y A) A {
    return x.Add(y)
}
```

Bu kod Go 1.26 dan kompilyatsiya bo'ladi. Bu parcha Go 1.26 talab qiladi: u release notes'dagi misol sifatida keltirildi va darsdagi boshqa kodlardan farqli o'laroq Go 1.24.7 da kompilyatsiya qilinmagan. Go 1.18 dan ishlaydigan muqobil: parametrli interface alohida e'lon qilinadi, va o'ziga murojaat funksiya type parameter ro'yxatida bo'ladi (`func Min[T Lesser[T]](...)`). Bu yozuv funksiya uchun hamisha ruxsat etilgan edi, cheklov faqat generic *tip* e'lonida bo'lgan.

## Misol: type set, kesishma va self-referential constraint

Dastur `Measure` (union + metod kesishmasi), `Half` uchun kesishma natijasida `~int`ga torayish, `Clone[S ~[]E, E any]` (slice tipini saqlab nusxalash) va `Lesser[T]` bilan o'ziga murojaat qiluvchi `Min`ni ko'rsatadi.

```go
package main

import (
	"fmt"
	"strings"
)

// Type set: ~float64 | ~int. Method bilan kesishma: String() ham bo'lishi shart.
type Measure interface {
	~float64 | ~int
	String() string
}

type Liters float64

func (l Liters) String() string { return fmt.Sprintf("%.1f l", float64(l)) }

type Km int

func (k Km) String() string { return fmt.Sprintf("%d km", int(k)) }

// Kesishma: ikki constraint embed qilinsa, type set ularning kesishmasi bo'ladi.
type Numeric interface{ ~float64 | ~int | ~int64 }
type Small interface{ ~int | ~int8 | ~int16 }
type SmallNumeric interface {
	Numeric
	Small
}

func Show[M Measure](ms []M) string {
	parts := make([]string, 0, len(ms))
	var total M
	for _, m := range ms {
		parts = append(parts, m.String())
		total += m
	}
	return strings.Join(parts, ", ") + " | jami " + total.String()
}

func Half[T SmallNumeric](x T) T { return x / 2 }

// S ~[]E: slice tipini saqlab qaytarish uchun klassik naqsh.
func Clone[S ~[]E, E any](s S) S {
	return append(S(nil), s...)
}

type Track []float64

func (t Track) Len() int { return len(t) }

// O'ziga murojaat: Go 1.18 dan beri ishlaydigan shakl (constraint generic interface, T o'zi argument).
type Lesser[T any] interface {
	Less(T) bool
}

func Min[T Lesser[T]](a, b T) T {
	if b.Less(a) {
		return b
	}
	return a
}

type Level struct{ Liters float64 }

func (l Level) Less(o Level) bool { return l.Liters < o.Liters }

func main() {
	fmt.Println(Show([]Liters{10, 20.5}))
	fmt.Println(Show([]Km{100, 250}))
	fmt.Println(Half(9), Half(Km(7)))

	t := Clone(Track{1, 2, 3})
	fmt.Printf("%T %d\n", t, t.Len())

	fmt.Println(Min(Level{40}, Level{12}))
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
10.0 l, 20.5 l | jami 30.5 l
100 km, 250 km | jami 350 km
4 3 km
main.Track 3
{12}
```

Tahlil:

- `Show([]Liters{...})` va `Show([]Km{...})`: `Measure` ikkala tipni qamraydi, `total += m` ishlaydi (union'dagi ikkala tip uchun `+` mumkin), `m.String()` esa metod talabi tufayli.
- `Half(9)` `4`, `Half(Km(7))` esa `3 km` beradi: `SmallNumeric` kesishmasi `~int`ni qoldirdi, `Km` unga kiradi, natija `Km` tipida (shu sababli `String()` ishlaydi). `Half(int8(7))` bu constraint bilan kompilyatsiya bo'lmaydi: `int8` `Numeric`da yo'q.  Kesishma natijasini har doim qo'lda chizib chiqing: bu yerda kompilyator xatoni ushlaydi, lekin constraint murakkablashgan sari uni o'qish qiyinlashadi.
- `Clone` natija tipini `Track` sifatida saqlaydi (`main.Track 3`): `S ~[]E` constraint'i bilan slice tipi va element tipi alohida type parameter'lar. `[]E` qaytarilsa, `Track`ning metodlari yo'qolardi.
- `Min[T Lesser[T]]` o'ziga murojaat funksiya ro'yxatida: `Level` tipi `Less(Level)`ga ega, `Min(Level{40}, Level{12})` `{12}` beradi. Bu Go 1.18 dan ishlaydi.

Constraint'ning xatolari ro'yxati (Go 1.24.7 xabarlari):

```text
cannot use type Num outside a type constraint: interface contains type constraints
MyInt does not satisfy Num (possibly missing ~ for int in Num)
cannot satisfy AB (empty type set)
overlapping terms main.MyInt and ~int
term cannot be a type parameter
```

Birinchisi type set'li interface'ni oddiy tip sifatida ishlatishda, ikkinchisi `~` unutilganda, uchinchisi bo'sh kesishmada, to'rtinchisi `~int | MyInt` kabi kesishuvchi term'larda, beshinchisi `interface{ ~int | T }` kabi type parameter term'ida chiqadi.

`comparable` istisnosi:

```go
package main

import "fmt"

func Eq[T comparable](a, b T) bool { return a == b }

func main() {
	fmt.Println(Eq[any](1, 1))
	defer func() { fmt.Println("recover:", recover()) }()
	fmt.Println(Eq[any]([]int{1}, []int{1}))
}
```

```text
true
recover: runtime error: comparing uncomparable type []int
```

`Eq[any]` kompilyatsiyadan o'tadi, chunki `any` `comparable`ni qanoatlantiradi, lekin ikkinchi chaqiruvda dynamic tip `[]int` taqqoslanmaydi va `==` panic beradi.

## Qachon qo'llamaslik kerak

- Faqat metodlarni talab qiladigan holatda union va `~` kerak emas: oddiy interface yetarli, hamda qabul qilishning o'zi uchun type parameter ham kerak emas (26-dars).
- Murakkab constraint kesishmalarini (uch-to'rt elementli) yozish o'rniga `cmp.Ordered` yoki o'zingiz bir marta e'lon qilgan bitta nomli constraint'dan foydalaning. Kesishmani xato chizish oson (yuqoridagi `int8` misoli).
- O'ziga murojaat qiluvchi constraint (`Adder[A Adder[A]]`) Go 1.26 dan: agar modulingiz eski toolchain'ni qo'llab-quvvatlashi kerak bo'lsa (go.mod'dagi `go` qatori, 2-dars), funksiya darajasidagi muqobil (`Min[T Lesser[T]]`) xavfsizroq. Constraint'ni iloji boricha oddiyroq ushlang: bu naqsh ko'pincha `Less(T) bool` metodi o'rniga taqqoslash funksiyasini parametr qilib berish bilan almashtiriladi.
- 'No core type' kabi xato matniga tayanib sharh yoki kod yozmang: versiyalar o'rtasida matn o'zgaradi.
- Constraint interface'ni oddiy o'zgaruvchi tipi sifatida ishlatmoqchi bo'lmang: u faqat constraint.

## Stack'da: TypeScript bilan farq

TypeScript'da `T extends A & B` kesishma, `T extends A | B` union: har ikkisi qiymat shakli (strukturaviy) bilan ishlaydi. Go'da bunga eng yaqin narsa: interface'dagi metodlar va type term'lar birga. Farqlar:

- TS'da `T extends { id: string }` constraint'i maydonga kirishga ruxsat beradi. Go'da maydonga type parameter orqali kirib bo'lmaydi (26-darsdagi `x.Fuel undefined` xabari): faqat metod yoki type set bo'yicha ruxsat etilgan operatsiyalar.
- TS'da recursive constraint (`T extends Comparable<T>`) hamisha yozilgan. Go'da bu naqsh funksiya darajasida Go 1.18 dan, generic tip darajasida Go 1.26 dan.
- TS'da 'branded' tiplar `string & { __brand: 'DeviceID' }` shaklida; Go'da `type DeviceID string` real nomli tip va `~string` bilan constraint'ga kiradi.
- Kodni versiyalar o'rtasida ko'chirishda toolchain'ni tekshiring: Go 1.26 xususiyati 1.25 da kompilyatsiya bo'lmaydi va go.mod'dagi `go` qatori buni oldindan bildiradi.

## Xulosa

- Interface type set'ni belgilaydi: metod, aniq tip, `~T` va union termlari, embedding esa type set'larning kesishmasini beradi.
- Union term'lari kesishmasligi shart, `~T` da `T` o'zining asosiy tipi bo'lishi kerak, term type parameter bo'la olmaydi; bo'sh type set instantiation'da xato beradi.
- `comparable` implements va satisfies farqiga misol: interface tiplar uni qanoatlantiradi, lekin dynamic tip taqqoslanmasa run-time'da panic.
- Core type Go 1.24 spetsifikatsiyasida `range`, `make`, indekslash kabi operatsiyalar uchun ishlatilgan; Go 1.25 da u spetsifikatsiyadan olib tashlangan (til o'zgarmagan).
- Go 1.26 dan generic tip o'z type parameter ro'yxatida o'ziga murojaat qila oladi; Go 1.25 va undan eskida funksiya darajasidagi `Min[T Lesser[T]]` shakli ishlaydi. Go 1.26 misoli kompilyatsiya qilinmagan.
