---
n: 6
slug: funksiyalar-closure
title: "Funksiyalar, closure, method value va variadic"
summary: "Funksiya qiymatlari va tiplari, closure o'zgaruvchilarni baham ko'rishi, variadic parametrning slice sifatida uzatilishi, method value'da receiver qachon nusxalanishi, method expression va nomli natijalar bilan defer o'zaro ta'siri."
duration: 40
sources:
  - id: go-spec
    note: "Function types, Function literals, Calls, Passing arguments to ... parameters, Method expressions, Method values va Return statements bo'limlari"
  - id: gopl
    note: "Kitobning funksiyalar, funksiya qiymatlari va method value'lar haqidagi boblari (umumiy tayanch; aniq qoidalar spetsifikatsiyadan olingan)"
  - id: 100go
    note: "#42 (receiver turi), #43 va #44 (nomli natija parametrlari), #1 (o'zgaruvchi shadowing'i): sarlavhalar saytdagi ro'yxatdan"
quiz:
  - q: "makeCounter() har chaqirilganda `n := 0` e'lon qilib, `inc` va `get` closure'larini qaytaradi. `inc1, get1 := makeCounter(); inc2, get2 := makeCounter(); inc1(); inc1(); inc2()`. get1() va get2() nechta?"
    options:
      - "3 va 3: n umumiy"
      - "2 va 1: har chaqiruv o'z n'ini yaratadi, juft closure esa uni baham ko'radi"
      - "0 va 0: closure qiymatni nusxalaydi"
      - "Kompilyatsiya xatosi: closure tashqi o'zgaruvchini o'zgartira olmaydi"
    answer: 1
    explain: "Function literal'lar o'rab turuvchi funksiya o'zgaruvchilariga murojaat qiladi va ular closure bilan birga yashaydi (spetsifikatsiya). Har makeCounter chaqiruvi yangi n yaratadi, bir chaqiruvdan qaytgan inc va get esa bitta n'ni ko'radi: 2 va 1."
  - q: "`func f(ids ...int)` ni `f()` deb chaqirdik. Funksiya ichida `ids == nil` nima beradi va len(ids)?"
    options:
      - "false va 0: bo'sh, lekin nil emas slice yaratiladi"
      - "Kompilyatsiya xatosi: variadic parametrga kamida bitta argument kerak"
      - "false va 1"
      - "true va 0"
    answer: 3
    explain: "Spetsifikatsiya: variadic parametrga argument berilmasa, unga nil uzatiladi. Shuning uchun ids == nil true, len(ids) 0. Argumentlar bor bo'lsa yangi slice yaratiladi."
  - q: "`func zero(ids ...int) { ids[0] = 0 }` va `s := []int{7,8,9}`. `zero(s...)` dan keyin s nima? `zero(7,8,9)` chaqirilsa-chi?"
    options:
      - "s = [0 8 9]: s... slice'ni o'zgarishsiz, bir xil backing array bilan uzatadi. zero(7,8,9) esa yangi slice yaratadi"
      - "s = [7 8 9]: variadic uzatishda doim nusxa olinadi"
      - "s = [0 0 0]: butun slice nollanadi"
      - "Ikkala chaqiruv ham tashqi qiymatlarga ta'sir qiladi"
    answer: 0
    explain: "Spetsifikatsiya: oxirgi argument ...T parametr uchun slice bo'lib `...` bilan kelsa, u o'zgarishsiz uzatiladi va yangi slice yaratilmaydi. Alohida argumentlarda esa yangi slice va yangi massiv yaratiladi."
  - q: "`o := Odometer{Km: 10}; f := o.Report; o.Km = 100; f()`. Report value receiver (o Odometer). f() nimani qaytaradi?"
    options:
      - "100 km: f o ga havola saqlaydi"
      - "Run-time panic: o o'zgartirilgan"
      - "10 km: method value ifoda baholanganda receiver nusxasi saqlanadi"
      - "Kompilyatsiya xatosi: method value'ni o'zgaruvchiga olib bo'lmaydi"
    answer: 2
    explain: "Spetsifikatsiya: x.M method value'da x baholanadi va saqlanadi, keyingi chaqiruvlar o'sha nusxani receiver qilib ishlatadi. Pointer receiver bo'lganda esa pointer saqlanadi va o'zgarish ko'rinadi."
  - q: "func tryTwice() (n int, err error) { defer func() { n *= 10 }(); return 4, errBusy } nimani qaytaradi?"
    options:
      - "4 va errBusy"
      - "0 va nil"
      - "40 va nil"
      - "40 va errBusy"
    answer: 3
    explain: "return natija parametrlarini defer ishga tushishidan oldin o'rnatadi (n=4, err=errBusy), keyin defer n ni 40 qiladi. err o'zgarmaydi. Shuning uchun qaytarilgan qiymat 40 va errBusy."
  - q: "func retry(n int, fn func() error) (err error) { for i := 0; i < n; i++ { if err := fn(); err == nil { return nil } }; return } da fn doim xato qaytarsa, retry nimani qaytaradi?"
    options:
      - "fn ning oxirgi xatosini"
      - "nil: ichki err tashqi (nomli natija) err ni yopib qo'ygan, tashqisi hech qachon to'ldirilmaydi"
      - "Kompilyatsiya xatosi: result parameter err not in scope at return"
      - "Run-time panic"
    answer: 1
    explain: "if ichidagi := yangi err yaratadi (shadowing). Oxirgi bare return tashqi (nomli natija) err ni qaytaradi, u esa nol qiymatda (nil). Kompilyator xato bermaydi: 'not in scope at return' xatosi faqat shadow qilingan nom scope'da bo'lgan joydagi bare return uchun chiqadi."
task:
  title: "retry, variadic nusxa va method value'ni tuzatish"
  prompt: |
    Servisda uchta kichik funksiya noto'g'ri ishlaydi:

    1. `retry` nomli natija `err`ni ichki blokdagi `err :=` bilan yopib qo'yadi, shuning uchun barcha urinishlar muvaffaqiyatsiz bo'lsa ham `nil` qaytaradi. Oxirgi xatoni `fmt.Errorf("%d urinishdan keyin: %w", n, err)` ko'rinishida o'rab qaytaring.
    2. `normalize(vals ...float64)` kiruvchi slice'ni o'zgartiradi (chaqiruvchi `raw...` bilan uzatadi va `raw` buziladi). Funksiya yangi slice qaytarsin, kiruvchi esa o'zgarmasin.
    3. `Odometer.Report` value receiver bo'lgani uchun `callbacks` ga qo'shilgan `o.Report` method value eski nusxani hisobot qiladi. Kod shunday o'zgartirilsinki, callback `o.Km = 50` dan keyingi qiymatni ko'rsatsin.

    Kutilgan chiqish: `3 urinish: <nil>`, `2 urinish: 2 urinishdan keyin: aloqa uzildi`, `[0.25 0.5 1] [5 10 20]`, `50 km`.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
    )

    // retry fn'ni muvaffaqiyatli bo'lguncha, ko'pi bilan n marta chaqiradi.
    // Barcha urinishlar muvaffaqiyatsiz bo'lsa, oxirgi xatoni qaytaradi.
    func retry(n int, fn func() error) (err error) {
        for i := 0; i < n; i++ {
            if err := fn(); err == nil {
                return nil
            }
        }
        return
    }

    // normalize qiymatlarni maksimumga bo'ladi (0..1 oralig'iga keltiradi).
    func normalize(vals ...float64) []float64 {
        max := 0.0
        for _, v := range vals {
            if v > max {
                max = v
            }
        }
        for i := range vals {
            vals[i] /= max
        }
        return vals
    }

    type Odometer struct{ Km float64 }

    func (o Odometer) Report() string { return fmt.Sprintf("%.0f km", o.Km) }

    func main() {
        calls := 0
        flaky := func() error {
            calls++
            if calls < 3 {
                return errors.New("aloqa uzildi")
            }
            return nil
        }
        fmt.Println("3 urinish:", retry(3, flaky))
        fmt.Println("2 urinish:", retry(2, func() error { return errors.New("aloqa uzildi") }))

        raw := []float64{5, 10, 20}
        fmt.Println(normalize(raw...), raw)

        o := Odometer{Km: 10}
        var callbacks []func() string
        callbacks = append(callbacks, o.Report)
        o.Km = 50
        for _, cb := range callbacks {
            fmt.Println(cb())
        }
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
    )

    // retry fn'ni muvaffaqiyatli bo'lguncha, ko'pi bilan n marta chaqiradi.
    // Barcha urinishlar muvaffaqiyatsiz bo'lsa, oxirgi xatoni qaytaradi.
    func retry(n int, fn func() error) (err error) {
        for i := 0; i < n; i++ {
            if err = fn(); err == nil {
                return nil
            }
        }
        return fmt.Errorf("%d urinishdan keyin: %w", n, err)
    }

    // normalize qiymatlarni maksimumga bo'ladi (0..1 oralig'iga keltiradi).
    // Kiruvchi slice o'zgarmaydi.
    func normalize(vals ...float64) []float64 {
        max := 0.0
        for _, v := range vals {
            if v > max {
                max = v
            }
        }
        out := make([]float64, len(vals))
        for i, v := range vals {
            out[i] = v / max
        }
        return out
    }

    type Odometer struct{ Km float64 }

    func (o *Odometer) Report() string { return fmt.Sprintf("%.0f km", o.Km) }

    func main() {
        calls := 0
        flaky := func() error {
            calls++
            if calls < 3 {
                return errors.New("aloqa uzildi")
            }
            return nil
        }
        fmt.Println("3 urinish:", retry(3, flaky))
        fmt.Println("2 urinish:", retry(2, func() error { return errors.New("aloqa uzildi") }))

        raw := []float64{5, 10, 20}
        fmt.Println(normalize(raw...), raw)

        o := Odometer{Km: 10}
        var callbacks []func() string
        callbacks = append(callbacks, o.Report)
        o.Km = 50
        for _, cb := range callbacks {
            fmt.Println(cb())
        }
    }
  solutionNotes: |
    - `if err := fn(); ...` yangi `err` yaratadi (100 Go Mistakes #1). Natija parametriga yozish uchun `err = fn()` ishlatiladi; so'ng oxirgi xato `%w` bilan o'raladi, chaqiruvchi `errors.Is` bilan asl xatoni topa oladi.
    - `normalize(raw...)` da `vals` va `raw` bitta backing array'ni ko'rsatadi (variadic parametr `s...` bilan o'zgarishsiz uzatiladi), shuning uchun `vals[i] /= max` chaqiruvchining ma'lumotini buzadi. Yangi slice yaratib, unga yozish bu muammoni yo'qotadi.
    - Method value `o.Report` ifoda baholanganda receiver nusxasini saqlaydi. `Report` ni pointer receiver (`*Odometer`) qilsak, `o.Report` `&o` ni bog'laydi va `o.Km` o'zgarishi ko'rinadi. Alternativ: `func() string { return o.Report() }` closure.
    - Receiver turini tanlash (pointer yoki value) haqida batafsil 9-darsda.
  checklist:
    - "`retry` barcha urinishlar muvaffaqiyatsiz bo'lganda `%w` bilan o'ralgan xato qaytaradi"
    - "`retry` muvaffaqiyatda `nil` qaytaradi va ichki `err :=` ishlatmaydi"
    - "`normalize` kiruvchi slice'ni o'zgartirmaydi"
    - "Callback `Km` ning joriy qiymatini (`50 km`) hisobot qiladi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go'da funksiya birinchi darajali qiymat: uni o'zgaruvchiga olish, qaytarish va struct maydonida saqlash mumkin. Backend kodi shu imkoniyatga tayanadi: middleware zanjirlari, retry yordamchilari, callback'lar, `sort.Slice` kabi API'lar. Muammo shundaki, ma'lum qoidalar (closure nimani ushlaydi, `s...` nimani uzatadi, method value receiver'ni qachon nusxalaydi, nomli natija bilan `defer` qanday ishlaydi) bilinmasa, kod kompilyatsiyadan o'tadi, lekin ma'lumot jimgina buziladi yoki xato yo'qoladi.

Node.js'dan o'tgan dasturchi uchun closure tanish: `this` yo'q, lekin funksiya o'rab turgan scope'ni ushlaydi. Go'da bu mexanizm o'xshash, farq aniq: tashqi o'zgaruvchilar **baham ko'riladi**, nusxalanmaydi; method bog'lash esa `bind` kabi receiver'ni qachon qotirishi aniq qoidaga ega. Bu darsda funksiyalarning semantikasini spetsifikatsiya bo'yicha ko'ramiz.

## Asosiy g'oya

### Funksiya tipi va funksiya literal

Funksiya tipi parametrlar va natijalar to'plami bilan aniqlanadi. Spetsifikatsiya: parametr nomlari hammasi bor yoki hammasi yo'q; bitta nomsiz natija qavssiz yozilishi mumkin; initsializatsiya qilinmagan funksiya o'zgaruvchisi `nil`. **Nil funksiyani chaqirish run-time panic beradi.** Funksiya tipi default parametr, overload yoki nomli argumentlarni qo'llamaydi: bu uchun Go'da functional options (37-dars) ishlatiladi.

Function literal (anonim funksiya) **closure**: u o'rab turuvchi funksiya o'zgaruvchilariga murojaat qiladi, bu o'zgaruvchilar esa literal bilan o'rab turuvchi funksiya orasida **baham ko'riladi** va ular erishib bo'ladigan ekan yashaydi. Ya'ni closure qiymatni emas, o'zgaruvchining o'zini ushlaydi. Bundan chiqadigan amaliy xulosa: ikkita closure bir xil o'zgaruvchini ko'rsa, birining yozuvi ikkinchisiga ko'rinadi; o'zgaruvchi funksiya qaytgandan keyin ham yashaydi, shuning uchun u stack'da emas, heap'da turishi mumkin (20-dars).

Funksiya tipiga metod qo'shish mumkin: `type HandlerFunc func(string) string` va `func (f HandlerFunc) Handle(...)` oddiy funksiyani interface'ga aylantiradi. `net/http` shu usulni ishlatadi (74-dars).

### Chaqiruv: argumentlar va natijalar

Chaqiruvda funksiya qiymati va argumentlar odatdagi tartibda baholanadi, keyin parametr va natijalar uchun yangi xotira ajratiladi va argumentlar parametrlarga assign qilinadi (ya'ni **qiymat bo'yicha uzatiladi**; slice va map uchun bu header nusxasi, 11-dars). Maxsus holat: `f(g())` da `g` ning natijalari soni va tiplari `f` ning parametrlariga mos bo'lsa, `g` natijalari to'g'ridan-to'g'ri uzatiladi. Spetsifikatsiya misoli: `Join(Split(value, len(value)/2))`.

### Variadic parametr

`func f(prefix string, ids ...int)` da `ids` ning tipi funksiya ichida `[]int`. Spetsifikatsiya qoidalari:

- argument berilmasa, `ids` **nil**;
- alohida argumentlar bilan chaqirilsa, yangi massivga ega yangi slice yaratiladi (uzunlik va sig'im argumentlar soniga teng);
- `f("x", s...)` da `s` o'zgarishsiz uzatiladi, **yangi slice yaratilmaydi** va `ids` bilan `s` bitta backing array'ni ko'rsatadi.

Oxirgi qoida tezlik uchun foydali (nusxa yo'q), lekin funksiya variadic slice'ni o'zgartirsa, chaqiruvchining ma'lumoti ham o'zgaradi (12-darsdagi aliasing bilan bog'liq).

## Chuqurroq: method value, method expression va nomli natijalar

### Method value

`x.M` ifodasi (x ning statik tipi T, M uning method set'ida) **method value**: chaqirilganda x.M(...) ga teng funksiya qiymati. Spetsifikatsiya: `x` ifoda **baholanadi va saqlanadi**, keyingi chaqiruvlarda saqlangan nusxa receiver bo'ladi. Natijalar:

- value receiver metod uchun (`func (o Odometer) Report()`) `o.Report` baholash paytidagi `o` ning nusxasini bog'laydi. Keyin `o.Km` o'zgarsa ham, method value eski qiymatni ko'radi.
- pointer receiver uchun (`func (o *Odometer) Add(...)`) `o.Add` `&o` ni bog'laydi (o addressable bo'lsa, `(&o).Add` ga teng): o'zgarishlar ko'rinadi.
- `makeT().Mp` kabi addressable bo'lmagan qiymatdan pointer receiver metod olish yaroqsiz.
- Interface qiymatidan ham method value olish mumkin.

Bu `callbacks = append(callbacks, o.Report)` kabi yozuvlarda tez-tez xatoga olib keladi: callback ro'yxatga olingan paytdagi holatni eslab qoladi.

### Method expression

`T.Method` yoki `(*T).Method` metodni oddiy funksiyaga aylantiradi, receiver birinchi argument bo'ladi: `Odometer.Report` ning tipi `func(Odometer) string`. `(*T).Mv` (value receiver metod) pointer olgan funksiya beradi, teskari holat (value tip uchun pointer receiver metod) esa yaroqsiz, chunki pointer receiver metod value tipining method set'ida emas. Spetsifikatsiya: "no distinct method type and there are no method literals", ya'ni metodning o'z tipi yo'q, u faqat funksiyaga aylantiriladi.

### Nomli natijalar, return va defer

Natija parametrlari nomlangan bo'lsa, ular funksiya boshida o'z tipining zero value'si bilan boshlanadi va oddiy lokal o'zgaruvchilar kabi ishlaydi; `return` argumentsiz ularni qaytaradi. Muhim qoida: **`return` natijalarni o'rnatadi, keyin deferred funksiyalar ishga tushadi**. Shuning uchun defer natija parametrini o'zgartira oladi. Bu `recover` bilan panic'ni `error`ga aylantirishning asosi (33-dars).

Nomli natijaning tuzog'i - shadowing. Spetsifikatsiya: kompilyator bare `return`da natija nomi boshqa entity bilan yopilgan bo'lsa buni taqiqlashi mumkin (`return  // invalid return statement: err is shadowed`). Ammo yopilgan nom scope'da bo'lmagan joyda bare `return` yaroqli, lekin tashqi o'zgaruvchini qaytaradi: bu eng xavfli holat (100 Go Mistakes #44 nomli natija yon ta'sirlari haqida, #43 ularni umuman ishlatmaslik haqida).

## Misol: closure, variadic, method value, defer

### 1. Closure, funksiya tipidagi metod va nil funksiya

```go
package main

import (
	"fmt"
	"strings"
)

// Handler va HandlerFunc: funksiya tipiga metod qo'shish.
type Handler interface {
	Handle(msg string) string
}

type HandlerFunc func(msg string) string

func (f HandlerFunc) Handle(msg string) string { return f(msg) }

func logging(prefix string, next Handler) Handler {
	return HandlerFunc(func(msg string) string {
		return prefix + next.Handle(msg)
	})
}

// makeCounter qaytargan ikki closure bitta n o'zgaruvchisini baham ko'radi.
func makeCounter() (inc func() int, get func() int) {
	n := 0
	inc = func() int { n++; return n }
	get = func() int { return n }
	return
}

func main() {
	inc, get := makeCounter()
	inc()
	inc()
	fmt.Println("get:", get())

	inc2, get2 := makeCounter() // alohida n
	inc2()
	fmt.Println("get2:", get2(), "get:", get())

	var h Handler = HandlerFunc(strings.ToUpper)
	h = logging("[gps] ", h)
	fmt.Println(h.Handle("nuqta qabul qilindi"))

	var f func()
	defer func() { fmt.Println("recover:", recover()) }()
	f()
}
```

```text
get: 2
get2: 1 get: 2
[gps] NUQTA QABUL QILINDI
recover: runtime error: invalid memory address or nil pointer dereference
```

Birinchi `makeCounter` juftligi bitta `n`ni baham ko'radi (`get: 2`), ikkinchi chaqiruv alohida `n` yaratadi (`get2: 1`, `get: 2`). `HandlerFunc` oddiy `strings.ToUpper` ni `Handler` interface'iga aylantirdi, `logging` esa uni o'raydi: middleware ning eng sodda shakli. `f()` nil funksiya chaqiruvi run-time panic berdi va `recover` uni ushladi. Go 1.24.7 (linux/amd64) chiqishi.

### 2. Variadic

```go
package main

import "fmt"

func describe(prefix string, ids ...int) {
	fmt.Printf("%s len=%d cap=%d nil=%t %v\n", prefix, len(ids), cap(ids), ids == nil, ids)
}

func zero(ids ...int) {
	if len(ids) > 0 {
		ids[0] = 0
	}
}

func split(n int) (int, int) { return n / 2, n - n/2 }

func sum(a, b int) int { return a + b }

func main() {
	describe("bo'sh:")
	describe("uchta:", 1, 2, 3)

	s := []int{7, 8, 9}
	describe("s...:", s...)
	zero(s...) // slice o'zgarishsiz uzatildi: backing array umumiy
	fmt.Println(s)

	zero(7, 8, 9) // har chaqiruvda yangi slice
	fmt.Println(sum(split(9)))

	args := []string{"a", "b"}
	// fmt.Println(args...) // xato: []string []any ga assignable emas
	anyArgs := make([]any, len(args))
	for i, a := range args {
		anyArgs[i] = a
	}
	fmt.Println(anyArgs...)
}
```

```text
bo'sh: len=0 cap=0 nil=true []
uchta: len=3 cap=3 nil=false [1 2 3]
s...: len=3 cap=3 nil=false [7 8 9]
[0 8 9]
9
a b
```

Argumentsiz chaqiruvda `nil=true`, `s...` bilan uzatilgan slice `zero` ichida o'zgargach `s` ham `[0 8 9]` bo'ldi, alohida argumentlar bilan chaqiruv esa hech narsaga tegmadi. Izohlangan `fmt.Println(args...)` (`[]string` ni `...any` ga) kompilyatsiya bo'lmaydi: `[]string` `[]any` ga assignable emas, shuning uchun qo'lda `[]any` yasaldi (4-dars qoidalari). `sum(split(9))` ko'p natijani to'g'ridan-to'g'ri uzatish: `4 + 5 = 9`.

### 3. Method value, method expression

```go
package main

import "fmt"

type Odometer struct {
	Km float64
}

func (o Odometer) Report() string { return fmt.Sprintf("%.1f km", o.Km) }

func (o *Odometer) Add(km float64) { o.Km += km }

func main() {
	o := Odometer{Km: 10}

	report := o.Report // receiver nusxasi shu yerda olinadi
	add := o.Add       // &o bog'lanadi
	o.Km = 100
	fmt.Println(report(), "|", o.Report())

	add(5)
	fmt.Println(o.Km)

	// method expression: receiver birinchi argument
	rep := Odometer.Report
	addExpr := (*Odometer).Add
	addExpr(&o, 1)
	fmt.Println(rep(o))

	fmt.Printf("%T | %T\n", report, rep)
}
```

```text
10.0 km | 100.0 km
105
106.0 km
func() string | func(main.Odometer) string
```

`report` `o` ni `Km: 10` paytida nusxalab oldi, shuning uchun `o.Km = 100` dan keyin ham `10.0 km` qaytardi. `add` esa `&o` ni bog'ladi: `add(5)` dan keyin `o.Km` 105 bo'ldi. `Odometer.Report` method expression tipi `func(main.Odometer) string`.

### 4. defer, nomli natija va shadowing

```go
package main

import (
	"errors"
	"fmt"
)

var errBusy = errors.New("db band")

// withRecovery nomli natija va defer yordamida panic'ni error'ga aylantiradi.
func withRecovery(fn func()) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	fn()
	return nil
}

func tryTwice() (n int, err error) {
	defer func() { n *= 10 }()
	return 4, errBusy // return natijalarni defer'dan oldin o'rnatadi
}

func main() {
	fmt.Println(withRecovery(func() { panic("sensor uzildi") }))
	fmt.Println(tryTwice())
}
```

```text
panic: sensor uzildi
40 db band
```

`withRecovery` panic'ni `err` ga yozdi. `tryTwice` da `return 4, errBusy` `n` va `err` ni o'rnatdi, defer esa `n` ni 40 qildi. Nomli natija yopilganda bare return shunday xato beradi (kompilyator, tashqi `err` scope'da ekan):

```text
err/main.go:9:4: result parameter err not in scope at return
	err/main.go:7:6: inner declaration of var err error
```

Bu xato faqat `return` yopilgan `err` bilan bir blokda bo'lganda chiqadi. Topshiriqdagi `retry`da bare `return` tsikldan tashqarida, ya'ni tashqi `err` scope'da: kompilyator jim, natija esa noto'g'ri.

## Qachon qo'llamaslik kerak

- Nomli natija parametrlarini hamma funksiyada ishlatmang. Ular qisqa funksiyada va defer natijani o'zgartirishi kerak bo'lganda foydali (`recover`, `Close` xatolari). Uzun funksiyada bare `return` o'qishni qiyinlashtiradi va shadowing xavfini oshiradi (100 Go Mistakes #43 va #44 ikki tomonni ko'rsatadi). Uzun funksiyalarda aniq `return x, err` ni afzal ko'ring: bu muallifning bahosi.
- Variadic parametrni "ixtiyoriy parametr" sifatida ishlatmang. `f(opts ...Option)` kabi pattern ishlaydi, lekin faqat bitta ixtiyoriy son uchun variadic yozish API'ni noaniq qiladi.
- Variadic parametrni funksiya ichida o'zgartirmang, chunki chaqiruvchi `s...` bilan uzatgan bo'lishi mumkin. O'zgartirish kerak bo'lsa, avval nusxa oling.
- Method value'ni uzoq yashovchi callback sifatida ro'yxatga olishdan oldin receiver turini tekshiring. Value receiver bo'lsa nusxa qotadi; ishonchsiz bo'lsa, aniq closure yozing (`func() string { return o.Report() }`).
- Tsiklda closure yaratganda Go 1.22 dan oldingi semantikani eslang (5-dars): go qatori eski bo'lsa, closure bitta o'zgaruvchini ushlaydi.
- Katta funksiya qiymatlari zanjirini (har bir bosqich closure) haddan tashqari uzaytirmang: stack trace va debug qiyinlashadi. Bu muallifning tajribaviy bahosi, o'lchangan raqam emas.

## Stack'da: Node.js/TypeScript bilan solishtirish

- JavaScript'da `this` metod chaqirilishiga bog'liq va `obj.method` ni ajratsangiz yo'qoladi (`bind` kerak). Go'da `o.Report` darhol receiver'ni bog'laydi: `bind` kerak emas, lekin bog'langan nusxa value receiver uchun qotib qoladi.
- Express middleware'lari `(req, res, next)` funksiyalar zanjiri. Go'da xuddi shu `func(http.Handler) http.Handler` va `HandlerFunc`, ya'ni funksiya tipi + metod. Bu 74-darsning asosi.
- TypeScript'da `...args: number[]` `Array` bo'ladi va spread har doim yangi massiv yaratadi. Go'da `s...` yangi slice yaratmaydi: aliasing mumkin. Bu JS dasturchilar uchun kutilmagan farq.
- TypeScript'da `try/finally` natijani o'zgartira olmaydi (return qiymati allaqachon hisoblangan); Go'da nomli natija va `defer` shuni qiladi. Panic/recover bilan `error` qaytarish uchun aynan shu ishlatiladi.
- Default parametrlar va overload yo'q: o'rniga variadic, functional options va alohida nomli funksiyalar.

## Xulosa

- Closure o'zgaruvchilarni baham ko'radi, nusxalamaydi; ular funksiya qaytgandan keyin ham yashaydi.
- Argumentlar qiymat bo'yicha uzatiladi; `f(g())` ko'p natijani to'g'ridan-to'g'ri uzatadi; nil funksiyani chaqirish panic beradi.
- Variadic parametr funksiya ichida `[]T`: argumentsiz bo'lsa nil, `s...` bilan bo'lsa o'sha slice (aliasing), alohida argumentlar bilan yangi slice.
- Method value `x.M` x ni baholab saqlaydi: value receiver uchun nusxa, pointer receiver uchun pointer. Method expression `T.M` receiver'ni birinchi argumentga aylantiradi.
- `return` nomli natijalarni defer'dan oldin o'rnatadi, defer ularni o'zgartira oladi.
- Nomli natija `err` ni ichki `:=` bilan yopmang: kompilyator har doim ushlamaydi, xato esa jimgina yo'qoladi.
