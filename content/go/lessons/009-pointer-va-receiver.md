---
n: 9
slug: pointer-va-receiver
title: "Pointer, addressability, method set va receiver tanlash"
summary: "Pointer semantikasi, qaysi ifodalar adreslanadi, method set qoidalari va interface'ga moslik, method value/expression, nil receiver hamda value yoki pointer receiver tanlash mezonlari."
duration: 40
sources:
  - id: go-spec
    note: "Address operators, Method sets, Calls, Method values, Method expressions va Method declarations bo'limlari"
  - id: code-review-comments
    note: "Receiver Type bo'limi: value yoki pointer receiver tanlash qoidalari"
  - id: 100go
    note: "Receiver turini tanlash va range tsiklida qiymat nusxasi bilan bog'liq xatolar (umumiy tayanch; aniq qoidalar spetsifikatsiyadan olingan)"
quiz:
  - q: "m := map[string]Trip{\"a\": {ID: \"a\"}} bo'lsa, m[\"a\"].ID = \"b\" nima qiladi?"
    options:
      - "Ishlaydi va map'dagi Trip yangilanadi"
      - "Run-time panic beradi"
      - "Kompilyatsiya xatosi: map elementi maydoniga yozib bo'lmaydi"
      - "Ishlaydi, lekin Trip nusxasi o'zgaradi, map'dagisi emas"
    answer: 2
    explain: "Map elementi adreslanmaydi (map o'sganda element ko'chishi mumkin), shuning uchun uning maydoniga yozish ham kompilyatsiya xatosi: cannot assign to struct field m[\"a\"].ID in map. Yechim: elementni o'zgaruvchiga olib, o'zgartirib, qayta yozish yoki map[string]*Trip ishlatish."
  - q: "type Vehicle struct{ km int } va func (v *Vehicle) Add(km int). m map[string]Vehicle, v := Vehicle{}. Qaysi ifoda kompilyatsiya bo'ladi?"
    options:
      - "v.Add(1)"
      - "Vehicle{}.Add(1)"
      - "m[\"k\"].Add(1)"
      - "var o interface{ Add(int) } = v"
    answer: 0
    explain: "v adreslanadigan o'zgaruvchi, shuning uchun v.Add(1) bu (&v).Add(1). Composite literal qiymati va map elementi adreslanmaydi, ularda pointer metod chaqirib bo'lmaydi. Vehicle qiymatining method to'plamida Add yo'q, shuning uchun interface'ga ham berib bo'lmaydi."
  - q: "fleet []Vehicle da for _, v := range fleet { v.Add(10) } (Add pointer receiver) tugagach fleet elementlarining km qiymati?"
    options:
      - "Hammasi 10"
      - "Hammasi 0: v har iteratsiyada element nusxasi, Add nusxani o'zgartiradi"
      - "Panic: range elementni o'zgartirishga ruxsat bermaydi"
      - "Kompilyatsiya xatosi"
    answer: 1
    explain: "range qiymat o'zgaruvchisi element nusxasi. v adreslanadigan lokal o'zgaruvchi bo'lgani uchun v.Add kompilyatsiya bo'ladi, lekin nusxani o'zgartiradi. fleet[i].Add(10) yoki []*Vehicle kerak. Biz buni sandbox'da sinadik."
  - q: "v := Vehicle{}; total := v.Total (value receiver); v.Add(7); total() nima qaytaradi?"
    options:
      - "7"
      - "10"
      - "Kompilyatsiya xatosi"
      - "0"
    answer: 3
    explain: "Method value bog'lanish paytida receiver'ni baholab saqlaydi; value receiver uchun bu nusxa. Keyingi v.Add(7) nusxaga ta'sir qilmaydi. v.Add (pointer receiver) esa &v ni bog'laydi va keyingi o'zgarishlarni ko'radi."
  - q: "var n *Node; var r Reader = n; r == nil nima beradi (Node ning Value metodi pointer receiver)?"
    options:
      - "true"
      - "Run-time panic"
      - "false: interface ichida tip (*Node) bor, qiymati nil"
      - "Kompilyatsiya xatosi"
    answer: 2
    explain: "Interface faqat tipi ham, qiymati ham nil bo'lsa nil. Bu yerda dinamik tip *Node, shuning uchun r != nil. r.Value() esa nil receiver bilan chaqiriladi va metod ichida n.Val ga murojaat panic beradi (18-dars)."
  - q: "Fleet struct'ida sync.Mutex maydoni bor, metodlari esa o'qish uchun. Qaysi receiver mos?"
    options:
      - "Value receiver: o'qish uchun nusxa xavfsiz"
      - "Pointer receiver: mutex nusxalanmasligi kerak, receiver turlari aralashmasin"
      - "Qaysi biri bo'lsa ham farqi yo'q"
      - "Faqat interface receiver"
    answer: 1
    explain: "Code Review Comments: sync.Mutex yoki shunga o'xshash maydonli struct uchun receiver pointer bo'lishi shart (nusxalangan mutex alohida, ajratilgan holat), shuningdek bitta tipning metodlarida receiver turlarini aralashtirmaslik tavsiya etiladi."
task:
  title: "Fleet: pointer receiver va map qiymatlari"
  prompt: |
    `Fleet` avtomobillar probegini yig'adi. Hozir `f.AddAll(10)` va `drive(f.vehicles["a"], 5)` dan keyin `Total()` `0` qaytaradi (kutilgan `25`). Sabablarni toping va tuzating:

    1. `AddKm` value receiver bilan yozilgan: nusxani o'zgartiradi.
    2. Fleet `map[string]Vehicle` saqlaydi: map elementini o'zgartirib bo'lmaydi, `range` esa nusxa beradi.
    3. `drive` interface qabul qiladi: pointer receiver'ga o'tgach `Vehicle` emas, `*Vehicle` uzatilishi kerak (kompilyator buni ushlaydi).

    `Vehicle`, `Fleet` va `Mover` nomlarini o'zgartirmang. Kutilgan chiqish: `25`.
  lang: go
  starter: |
    package main

    import "fmt"

    type Mover interface{ AddKm(km int) }

    type Vehicle struct {
        ID string
        Km int
    }

    func (v Vehicle) AddKm(km int) { v.Km += km }

    type Fleet struct {
        vehicles map[string]Vehicle
    }

    func NewFleet(ids ...string) *Fleet {
        f := &Fleet{vehicles: make(map[string]Vehicle, len(ids))}
        for _, id := range ids {
            f.vehicles[id] = Vehicle{ID: id}
        }
        return f
    }

    func (f *Fleet) AddAll(km int) {
        for _, v := range f.vehicles {
            v.AddKm(km)
        }
    }

    func (f *Fleet) Total() int {
        sum := 0
        for _, v := range f.vehicles {
            sum += v.Km
        }
        return sum
    }

    func drive(m Mover, km int) { m.AddKm(km) }

    func main() {
        f := NewFleet("a", "b")
        f.AddAll(10)
        drive(f.vehicles["a"], 5)
        fmt.Println(f.Total())
    }
  solution: |
    package main

    import "fmt"

    type Mover interface{ AddKm(km int) }

    type Vehicle struct {
        ID string
        Km int
    }

    func (v *Vehicle) AddKm(km int) { v.Km += km }

    type Fleet struct {
        vehicles map[string]*Vehicle
    }

    func NewFleet(ids ...string) *Fleet {
        f := &Fleet{vehicles: make(map[string]*Vehicle, len(ids))}
        for _, id := range ids {
            f.vehicles[id] = &Vehicle{ID: id}
        }
        return f
    }

    func (f *Fleet) AddAll(km int) {
        for _, v := range f.vehicles {
            v.AddKm(km)
        }
    }

    func (f *Fleet) Total() int {
        sum := 0
        for _, v := range f.vehicles {
            sum += v.Km
        }
        return sum
    }

    func drive(m Mover, km int) { m.AddKm(km) }

    func main() {
        f := NewFleet("a", "b")
        f.AddAll(10)
        drive(f.vehicles["a"], 5)
        fmt.Println(f.Total())
    }
  solutionNotes: |
    - `AddKm` ni `*Vehicle` receiver'ga o'tkazing: o'zgartiradigan metod pointer receiver bo'lishi shart (Code Review Comments).
    - Map qiymati `*Vehicle` bo'ladi. Map elementi adreslanmaydi, shuning uchun `map[string]Vehicle` da `m[id].Km += x` kompilyatsiya xatosi; pointer qiymatli map ichidagi obyektni o'zgartirishga imkon beradi (map'ning o'zi emas, ko'rsatilgan struct o'zgaradi).
    - `range` qiymat o'zgaruvchisi pointerning nusxasi, lekin ko'rsatilgan struct bitta, shuning uchun `v.AddKm(km)` ishlaydi.
    - `Vehicle` ning method to'plamida `AddKm` yo'q, `*Vehicle` ning bor. Shu sababli `drive(f.vehicles["a"], 5)` endi pointer qabul qiladi va `Mover` ga mos keladi.
    - Aralash receiver'larga yo'l qo'ymang: `Vehicle` ning barcha metodlari pointer receiver bo'lsin.
  checklist:
    - "`f.AddAll(10)` probegni haqiqatan o'zgartiradi"
    - "`drive` ga `*Vehicle` uzatiladi va `Mover` ga mos keladi"
    - "Chiqish `25`"
    - "`go vet` ogohlantirishsiz o'tadi"
    - "Map qiymati o'zgartirilayotgan joyda nusxa emas, pointer ishlatilgan"
---

## Muammo

Telemetriya servisida quyidagi kod yozilgan deylik: `for _, v := range fleet { v.AddKm(10) }`. Kompilyatsiya bo'ladi, testdan ham o'tadi (hech narsa tekshirilmagan bo'lsa), lekin probeg hech qachon o'zgarmaydi. Boshqa holat: `m[id].Km += 5` kompilyatsiya bo'lmaydi va dasturchi nima uchun ekanini tushunmaydi. Yana boshqasi: struct interface'ga berilganda "method has pointer receiver" xatosi chiqadi va "tuzatish" uchun hamma joyga `&` qo'yiladi.

Bularning hammasi bitta mavzudan: qiymat nusxalanadi, pointer manzilni uzatadi, manzil esa faqat *adreslanadigan* ifodadan olinadi. Node.js'da obyektlar doim reference, shuning uchun bu savol tug'ilmaydi. Go'da har bir tip uchun alohida qaror kerak: bu qiymatmi yoki identifikatorli obyektmi.

## Asosiy g'oya

### Pointer va address operatori

`&x` x tipi `T` bo'lsa `*T` tipidagi pointer beradi, `*p` pointer ko'rsatayotgan o'zgaruvchini. Pointer arifmetikasi yo'q. nil pointer'ni dereference qilish run-time panic. Spetsifikatsiya `&x` operandini **adreslanadigan (addressable)** bo'lishini talab qiladi: o'zgaruvchi, pointer indirection, slice indekslash, adreslanadigan struct'ning maydon selektori yoki adreslanadigan massivning elementi. Yagona istisno: composite literal, shuning uchun `&Point{2, 3}` mumkin.

Bundan kelib chiqadi: map elementi adreslanmaydi (map o'sganda elementlar ko'chadi, manzil yaroqsiz bo'lib qolardi), funksiya qaytargan qiymat va literal maydoni ham. Slice elementi adreslanadi, chunki slice massivga ko'rsatadi (11-dars).

Lokal o'zgaruvchining manzilini funksiyadan qaytarish xavfsiz: o'zgaruvchi qancha kerak bo'lsa shuncha yashaydi. Qaysi xotirada (stack yoki heap) turishi spetsifikatsiyada emas, kompilyatorning ishi (20-dars).

### Method set va receiver

Metod deklaratsiyasida receiver `T` yoki `*T`. Receiver base type pointer yoki interface bo'lmasligi va metod bilan bir paketda aniqlangan bo'lishi shart. Method to'plami qoidasi:

- `T` ning method to'plami faqat `T` receiver'li metodlarni o'z ichiga oladi.
- `*T` ning method to'plami `T` va `*T` receiver'li metodlarni o'z ichiga oladi.

Interface'ga moslik method to'plami bilan aniqlanadi. Shuning uchun pointer receiver'li metodi bor tip qiymat sifatida interface'ga berilmaydi, `*T` esa beriladi.

Qulaylik qoidasi: `x` adreslanadigan va `&x` ning method to'plamida `m` bo'lsa, `x.m()` bu `(&x).m()` ning qisqartmasi. Shuning uchun `v.Add(1)` ishlaydi (v o'zgaruvchi), `Vehicle{}.Add(1)` ishlamaydi (literal adreslanmaydi).

### Receiver tanlash

Code Review Comments qoidalari (Receiver Type bo'limi):

- Metod receiver'ni o'zgartirishi kerak bo'lsa, pointer.
- Struct'da `sync.Mutex` yoki shunga o'xshash maydon bo'lsa, pointer (nusxalanmasligi uchun).
- Katta struct yoki massiv uchun pointer. "Katta" mezoni: barcha elementlarni argument qilib uzatish qulaymi, yo'qmi.
- Receiver map, func yoki chan bo'lsa, ularga pointer ishlatmang. Slice uchun ham, agar metod uni reslice yoki qayta ajratmasa.
- `time.Time` kabi kichik, o'zgarmas, pointersiz tip yoki `int`/`string` kabi oddiy tip uchun value receiver mantiqli.
- Receiver turlarini aralashtirmang. Shubhada pointer.

Value receiver tanlashni "garbage kamayadi" deb asoslash mumkin, lekin manba buni profilsiz qilmaslikni aytadi: kompilyator har doim ham nusxani stack'da ushlab turolmaydi.

## Chuqurroq: nusxa qachon olinadi

### range va qiymat o'zgaruvchisi

`for _, v := range fleet` da `v` har iteratsiyada element nusxasi (5-dars). Pointer receiver'li metod `v` ning manzilini oladi, ya'ni nusxani o'zgartiradi. Kompilyator ogohlantirmaydi, chunki v adreslanadigan lokal o'zgaruvchi. Yechim: indeks bilan `fleet[i].Add(10)` yoki `[]*Vehicle`.

### Method value va method expression

`f := v.Total` bog'lash paytida receiver'ni baholab saqlaydi. Value receiver uchun bu nusxa: keyin `v` o'zgarsa, `f` ni ko'rmaydi. `g := v.Add` (pointer receiver) esa `&v` ni bog'laydi va o'zgarishlarni ko'radi. Method expression `Vehicle.Total` yoki `(*Vehicle).Add` receiver'ni birinchi argument qiladigan oddiy funksiya beradi. Closure bilan bog'liq vaqt (6-dars) bilan bir xil mantiq: nima va qachon baholanadi.

### Slice elementiga pointer va append

`&fleet[i]` massivdagi elementga ko'rsatadi. `append` sig'im yetmasa yangi massivga ko'chiradi, eski pointer'lar esa eski massivga ko'rsatib qoladi. Pointer orqali qilingan o'zgarish yangi slice'da ko'rinmaydi (12-dars).

### nil receiver va nil pointer interface

Pointer receiver'li metod nil receiver bilan chaqirilishi mumkin; metod ichida `n == nil` tekshirilsa, bu xavfsiz va ba'zan yaxshi dizayn (bog'langan ro'yxat uzunligi). Lekin nil `*Node` ni interface'ga berish nil interface hosil qilmaydi: dinamik tip bor, qiymat nil (17-18-darslar).

### Mutex va nusxalash: value receiver jim xato

`sync.Mutex` saqlaydigan struct uchun value receiver yozish xato: har chaqiruvda mutex holati bilan birga nusxalanadi va nusxadagi qulf asl qulfni himoya qilmaydi. Kompilyator buni to'xtatmaydi, lekin `go vet` ning `copylocks` tekshiruvi (cmd/vet ro'yxatida "check for locks erroneously passed by value" deb ta'riflangan) ushlaydi. Quyidagi kodda `Value` value receiver, `Inc` pointer receiver:

```go run
package main

import (
	"fmt"
	"sync"
)

type Counter struct {
	mu sync.Mutex
	n  int
}

func (c Counter) Value() int { // value receiver: Mutex nusxalanadi
	return c.n
}

func (c *Counter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n++
}

func main() {
	var c Counter
	c.Inc()
	fmt.Println(c.Value())
}
```

```text
# p2
./main.go:13:9: Value passes lock by value: p2.Counter contains sync.Mutex
```

Dastur o'zi `1` chiqaradi (Go 1.24.7), ya'ni xato ishlash vaqtida ko'rinmaydi: `Value` qulfni olmay o'qiydi va concurrent chaqiruvda data race bo'ladi. Shuning uchun Code Review Comments qoidasi (mutex bo'lsa pointer receiver) vet bilan mustahkamlanadi, vet'ni CI'ga qo'shing (40-dars), data race'ni esa 43-darsdagi xotira modeli bilan tushuning. Tekshiruv ichma-ich ham ishlaydi: `Outer` mutex'ni embedded `Inner` orqali saqlasa ham, `func (o Outer) N()` uchun vet `Outer contains Inner contains sync.Mutex` deb xabar berdi (Go 1.24.7).

### nil pointer va metod chaqiruvi: panic qachon bo'ladi

Spetsifikatsiyaga ko'ra value receiver'li metodga pointer orqali murojaat pointer'ni avtomatik dereference qiladi: `pt.Mv` bu `(*pt).Mv`. Method value esa receiver'ni baholash paytida saqlaydi. Demak `pt` nil bo'lsa va metod value receiver'li bo'lsa, panic metod chaqirilganda emas, **method value yaratilganda** yuz beradi, chunki `*pt` shu yerda baholanadi. Pointer receiver'li metod bilan esa nil bog'lash o'zi xatosiz (nil manzil saqlanadi; shu holatda `p.Km` bog'landi va tana nil'ni tekshirgani uchun `g()` panicsiz ishladi), panic faqat metod tanasi nil'ni dereference qilganda. Method expression `(*Vehicle).Total` nil pointer bilan chaqirilganda ham panic beradi, lekin matni boshqacha:

```go run
package main

import "fmt"

type Vehicle struct {
	ID string
	km int
}

func (v Vehicle) Total() int { return v.km }

func main() {
	var p *Vehicle // nil

	defer func() { fmt.Println("recover:", recover()) }()

	f := func() {
		defer func() { fmt.Println("method value baholanganda:", recover()) }()
		g := p.Total // value receiver: *p shu yerda baholanadi
		fmt.Println("bu qator chop etilmaydi", g != nil)
	}
	f()

	h := (*Vehicle).Total // method expression: hali chaqirilmagan
	fmt.Println("expression yaratildi")
	h(p) // panic chaqiruv paytida
}
```

```text
method value baholanganda: runtime error: invalid memory address or nil pointer dereference
expression yaratildi
recover: value method main.Vehicle.Total called using nil *Vehicle pointer
```

Amaliy ma'no: callback sifatida `handler.Process` uzatayotganda `handler` nil bo'lishi mumkin bo'lsa va `Process` value receiver'li bo'lsa, xato callback ro'yxatdan o'tkazilayotgan joyda chiqadi, keyinroq chaqirilganda emas. Bu aslida foydali: xato manbaga yaqin. Pointer receiver'li metodda esa xato chaqiruv paytiga kechikadi va stack trace ro'yxatdan o'tkazish joyini ko'rsatmaydi.

### Pointer va tsikl o'zgaruvchisi (Go 1.22 gacha va undan keyin)

7-darsdagi tsikl o'zgaruvchisi qoidasi pointer'larga ham tegishli. `for i := 0; i < 3; i++ { ptrs = append(ptrs, &i) }` Go 1.22 release notes'dagi o'zgarishdan oldin (go.mod'da `go 1.21`) uchala pointer bitta `i` ga ko'rsatadi, tsikl tugaganda esa `3`; `go 1.22` da har iteratsiya o'z `i`sini beradi. Bir xil manba kodi ikki go.mod bilan (Go 1.24.7) chiqardi:

```text
go 1.21: 3 3 3
go 1.22: 0 1 2
```

`for _, v := range items { out = append(out, &v) }` kabi "elementga pointer yig'ish" kodi shu sababli eski modullarda bir elementni N marta takrorlaydi. Yangi modulda bu ishlaydi, lekin baribir nusxa: `&v` ko'rsatayotgan o'zgaruvchi slice elementi emas, uning nusxasi, shuning uchun uning o'zgarishi `items` ga yozilmaydi. Asl elementga pointer kerak bo'lsa, `&items[i]` yozing.

### Massivga pointer

Spetsifikatsiya: pointer-to-array tipidagi `a` uchun `a[x]` bu `(*a)[x]` ning qisqartmasi. Shu sababli `*[N]T` bilan indekslash va `range` pointer'ni ochmasdan ishlaydi, lekin pointer arifmetikasi bo'lmagani kabi, `*[]T` (slice'ga pointer) bunday qisqartmaga ega emas: `(*s)[i]` deb yozish kerak. Slice'ga pointer faqat funksiya slice'ning o'zini (uzunlik, sig'imni) o'zgartirishi kerak bo'lganda mantiqli, bunday holatda odatda yangi slice qaytarish (`append` kabi) soddaroq (11-dars).

## Misol: adreslanish, method set va nusxa

### 1. Addressability va pointer

```go run
package main

import "fmt"

type Point struct{ Lat, Lon float64 }

type Trip struct {
	ID    string
	Start Point
}

func newTrip(id string) *Trip { return &Trip{ID: id} }

func main() {
	// Adreslanadigan: o'zgaruvchi, slice elementi, addressable struct maydoni.
	t := Trip{ID: "t-1"}
	p := &t.Start
	p.Lat = 41.31
	fmt.Println(t.Start)

	s := []Trip{{ID: "a"}, {ID: "b"}}
	q := &s[1]
	q.ID = "B"
	fmt.Println(s[1].ID)

	// Map elementi adreslanmaydi, lekin pointer qiymatli map orqali o'zgartirish mumkin.
	m := map[string]*Trip{"x": {ID: "x"}}
	m["x"].Start.Lon = 69.24
	fmt.Println(*m["x"])

	// Composite literal istisno: &T{} ruxsat.
	r := &Trip{ID: "lit"}
	fmt.Println(r.ID)

	// Lokal o'zgaruvchi manzili funksiyadan chiqishi mumkin.
	a, b := newTrip("n1"), newTrip("n2")
	fmt.Println(a != b, a.ID, b.ID)

	// Pointer solishtirish: bir xil o'zgaruvchi.
	x := 1
	px1, px2 := &x, &x
	fmt.Println(px1 == px2, px1 == &x)

	// Ikkita zero-size o'zgaruvchi pointeri teng yoki teng bo'lmasligi mumkin.
	// Spetsifikatsiya buni kafolatlamaydi, shuning uchun chiqarilmaydi.

	// nil pointer'ga murojaat panic beradi.
	defer func() { fmt.Println("recover:", recover()) }()
	var np *Trip
	fmt.Println(np.ID)
}
```

```text
{41.31 0}
B
{x {0 69.24}}
lit
true n1 n2
true true
recover: runtime error: invalid memory address or nil pointer dereference
```

`&t.Start` va `&s[1]` ishladi: ikkalasi adreslanadi. Map elementi o'zgarmadi, `map[string]*Trip` orqali `m["x"].Start.Lon` yozildi, chunki ko'rsatilgan struct o'zgaradi (map elementi emas). `a != b` `true`: `&Trip{}` har baholashda yangi o'zgaruvchi. Oxirida `np.ID` panic berdi va `recover` uni ushladi.

Map elementi, literal maydoni va pointer bo'lmagan qiymat uchun kompilyator xatolari (go build -gcflags=-e, Go 1.24.7):

```text
cannot assign to struct field m["a"].ID in map
invalid operation: cannot take address of m["a"] (map index expression of struct type Trip)
invalid operation: cannot take address of Trip{}.ID (value of type string)
```

### 2. Method set va interface

```go run
package main

import "fmt"

type Odometer interface {
	Add(km int)
	Total() int
}

type Vehicle struct{ km int }

func (v Vehicle) Total() int  { return v.km }
func (v *Vehicle) Add(km int) { v.km += km }

func report(o Odometer) { o.Add(5); fmt.Println(o.Total()) }

func main() {
	v := Vehicle{}
	v.Add(10) // adreslanadigan: (&v).Add(10)
	fmt.Println(v.Total())

	report(&v) // *Vehicle method to'plami ikkala metodni o'z ichiga oladi
	fmt.Println(v.Total())

	// Vehicle{} adreslanmaydi, lekin &Vehicle{} ishlaydi.
	(&Vehicle{km: 1}).Add(1)
}
```

```text
10
15
15
```

`v.Add(10)` o'zgaruvchi uchun `(&v).Add(10)` bo'ldi. `report(&v)` ishladi, chunki `*Vehicle` ikkala metodga ega: 10 ga 5 qo'shildi. `Vehicle{}` qiymatini interface'ga berish va literal bilan pointer metod chaqirish xato:

```text
cannot use Vehicle{} (value of struct type Vehicle) as Odometer value in variable declaration: Vehicle does not implement Odometer (method Add has pointer receiver)
cannot call pointer method Add on Vehicle
```

### 3. Nusxalar: range, method value, append

```go run
package main

import "fmt"

type Vehicle struct {
	ID string
	km int
}

func (v Vehicle) Total() int  { return v.km }
func (v *Vehicle) Add(km int) { v.km += km }

func main() {
	// 1. range qiymat nusxasi
	fleet := []Vehicle{{ID: "a"}, {ID: "b"}}
	for _, v := range fleet {
		v.Add(10)
	}
	fmt.Println("range nusxa:", fleet[0].km, fleet[1].km)
	for i := range fleet {
		fleet[i].Add(10)
	}
	fmt.Println("indeks bilan:", fleet[0].km, fleet[1].km)

	// 2. method value: qiymat receiver nusxalanadi bog'lash paytida
	v := Vehicle{ID: "c"}
	total := v.Total // v nusxasi hozir olinadi
	add := v.Add     // &v bog'lanadi
	add(7)
	fmt.Println("total:", total(), "haqiqiy:", v.Total())

	// 3. method expression
	f := Vehicle.Total
	g := (*Vehicle).Add
	g(&v, 3)
	fmt.Println(f(v))

	// 4. pointer receiver'li metodni slice elementida tsiklda saqlash
	var ptrs []*Vehicle
	for i := range fleet {
		ptrs = append(ptrs, &fleet[i])
	}
	fleet = append(fleet, Vehicle{ID: "d"}) // yangi massivga ko'chishi mumkin
	ptrs[0].Add(100)
	fmt.Println(fleet[0].km, ptrs[0].km)
}
```

```text
range nusxa: 0 0
indeks bilan: 10 10
total: 0 haqiqiy: 7
10
10 110
```

`range` bilan `v.Add(10)` hech narsani o'zgartirmadi (`0 0`); indeks bilan `10 10`. `total := v.Total` bog'lash paytidagi nusxani ushlab turdi: `total()` 0, haqiqiy qiymat 7. Method expression bilan `g(&v, 3)` dan keyin 10. Oxirgi qatorda `append` slice'ni yangi massivga ko'chirdi: `ptrs[0].Add(100)` eski massivga yozdi, `fleet[0].km` esa 10 da qoldi.

### 4. nil receiver

```go run
package main

import "fmt"

type Node struct {
	Val  int
	Next *Node
}

// nil receiver'ni qabul qiladigan metod.
func (n *Node) Len() int {
	if n == nil {
		return 0
	}
	return 1 + n.Next.Len()
}

func (n *Node) Value() int { return n.Val }

type Reader interface{ Value() int }

func main() {
	var list *Node
	fmt.Println(list.Len())
	list = &Node{1, &Node{2, nil}}
	fmt.Println(list.Len())

	// nil pointer interface ichida: interface nil emas.
	var n *Node
	var r Reader = n
	fmt.Println(r == nil, n == nil)
	defer func() { fmt.Println("recover:", recover()) }()
	fmt.Println(r.Value())
}
```

```text
0
2
false true
recover: runtime error: invalid memory address or nil pointer dereference
```

`Len` nil receiver'ni o'zi tekshiradi va 0 qaytaradi; `Value` tekshirmaydi. `Reader` ichiga solingan nil `*Node` bilan `r == nil` `false`, `n == nil` `true`. `r.Value()` metodga nil receiver bilan kirdi va `n.Val` o'qishda panic berdi.

## Qachon qo'llamaslik kerak

- Hamma narsaga pointer receiver qo'yish ham yechim emas. Kichik, o'zgarmas qiymat tiplari (`time.Time`, pul miqdori, koordinata) uchun value receiver o'qishni osonlashtiradi va nusxa tasodifan bo'lishini oldini oladi.
- Pointer'ni faqat "tezroq" deb ishlatmang. Nusxa qimmatligini o'lchamasdan aytib bo'lmaydi; pointer esa escape analysis va GC yukini oshirishi mumkin (20-dars). Manba ham profilsiz qaror qilishni tavsiya qilmaydi.
- Aralash receiver'lar (ba'zi metodlar value, ba'zilari pointer) method to'plamlarini chalkashtiradi: qiymat interface'ni qisman qondiradi. Bitta tip uchun bitta tur tanlang.
- Pointer maydonlarni "ixtiyoriy qiymat" belgisi sifatida hamma joyga qo'ymang. Har bir pointer nil tekshiruvini talab qiladi (18-dars). Zero value ishlaydigan qiymat ko'pincha soddaroq (8-dars).
- Map qiymatini `*T` qilish bilan `T` nusxa semantikasidan voz kechasiz: bir obyektni bir nechta joy o'zgartirishi mumkin. Concurrent kodda bunga alohida sinxronizatsiya kerak.

## Stack'da: Node.js/TypeScript bilan solishtirish

- JavaScript'da obyekt o'zgaruvchisi har doim reference: `a = b` ikkala nom bitta obyektni ko'rsatadi. Go'da struct nusxalanadi, reference semantikasi uchun pointer yozilishi kerak. Birinchi kunlarda `range` va `map` bilan xatolar shundan.
- TypeScript'da `this` metodni ajratib olganda yo'qoladi (`const f = obj.method`), `bind` kerak. Go'da method value receiver'ni bog'lash paytida o'zi ushlaydi, lekin nusxa olinadimi, pointer bog'lanadimi, receiver turiga bog'liq.
- NestJS servis klasslari odatda pointer receiver'ga mos (holat, bog'liqliklar bor). DTO va qiymat obyektlari (`Money`, `Coordinate`) value receiver'ga mos.
- JS'da `map.get(id).km += 5` ishlaydi, chunki qiymat reference. Go'da `map[string]Vehicle` bilan bu kompilyatsiya xatosi: elementni ol, o'zgartir, qayta yoz, yoki `map[string]*Vehicle`.
- TypeScript interface'lari struktura bo'yicha tekshiriladi, Go'da ham, lekin method to'plami qoidasi qo'shimcha: `Vehicle` va `*Vehicle` bir interface'ni har xil qondirishi mumkin.

## Xulosa

- `&x` faqat adreslanadigan ifoda uchun ishlaydi (o'zgaruvchi, slice elementi, adreslanadigan struct maydoni); map elementi va literal maydoni adreslanmaydi, composite literal istisno.
- `T` ning method to'plami faqat `T` receiver'li metodlar, `*T` niki ikkalasi; interface'ga moslik shu bilan aniqlanadi.
- `x.m()` adreslanadigan `x` uchun `(&x).m()` ga teng, shuning uchun `range` o'zgaruvchisi bilan pointer metod kompilyatsiya bo'ladi, lekin nusxani o'zgartiradi.
- Method value receiver'ni bog'lash paytida baholaydi: value receiver nusxa oladi, pointer receiver manzilni.
- Receiver'ni o'zgartirish, mutex yoki katta struct uchun pointer; kichik o'zgarmas tip uchun value; turlarni aralashtirmang.
- nil receiver pointer metod ichida tekshirilishi mumkin, lekin nil pointer interface ichida nil interface emas.
