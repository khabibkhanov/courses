---
n: 8
slug: zero-value-struct
title: "Zero value, struct, composite literal va struct tag"
summary: "Zero value qoidasi va 'foydali zero value' dizayni, nil map/slice farqlari, struct'ning nusxalanishi va taqqoslanishi, composite literal qoidalari (keyed/unkeyed, element tipini tushirish, indeks kalitlari) hamda struct tag'larning haqiqiy roli."
duration: 40
sources:
  - id: go-spec
    note: "The zero value, Composite literals (struct, array, slice, map literallari va element tipini tushirish), Struct types (tag'lar) va Comparison operators bo'limlari"
  - id: gopl
    note: "Kitobning struct'lar va composite tiplar haqidagi boblari (umumiy tayanch; aniq qoidalar spetsifikatsiyadan olingan)"
  - id: code-review-comments
    note: "Declaring Empty Slices va Copying bo'limlari (nil slice afzalligi, JSON istisnosi, struct nusxalash ogohlantirishi)"
quiz:
  - q: "var v Vehicle (Meta map[string]string maydoni bor) uchun qaysi gap to'g'ri?"
    options:
      - "v.Meta[\"x\"] ham o'qishda, ham yozishda panic beradi"
      - "v.Meta[\"x\"] = \"y\" ishlaydi: map yozishda avtomatik yaratiladi"
      - "v.Meta[\"x\"] o'qish nol qiymat qaytaradi, v.Meta[\"x\"] = \"y\" esa panic beradi"
      - "Kompilyatsiya xatosi: map initsializatsiya qilinmagan"
    answer: 2
    explain: "Map'ning zero value'si nil. nil map'dan o'qish, len va range xavfsiz (nol qiymat), yozish esa run-time panic: assignment to entry in nil map. Shu sababli map'li struct zero value'ni foydali qilish uchun yozishdan oldin lazy init kerak."
  - q: "var tags []string; tags = append(tags, \"a\") qanday ishlaydi?"
    options:
      - "Ishlaydi: append nil slice bilan ham to'g'ri ishlaydi va yangi massiv ajratadi"
      - "Panic: nil slice'ga append qilib bo'lmaydi"
      - "Kompilyatsiya xatosi: avval make kerak"
      - "Ishlaydi, lekin faqat sig'im 0 dan katta bo'lganda"
    answer: 0
    explain: "Nil slice - uzunligi va sig'imi 0 bo'lgan to'g'ri slice qiymati. Sig'im yetmasa append yangi massiv ajratadi. Shuning uchun slice maydonlarni konstruktorda to'ldirish shart emas."
  - q: "days := [...]string{2: \"chor\", 4: \"juma\"} bo'lsa, len(days) nechta?"
    options:
      - "2"
      - "4"
      - "6"
      - "5"
    answer: 3
    explain: "[...] massiv uzunligini eng katta indeks + 1 qilib belgilaydi: 4 + 1 = 5. Qolgan elementlar zero value (bo'sh string)."
  - q: "p1 := &[]int{}; p2 := new([]int). *p1 == nil va *p2 == nil nima beradi?"
    options:
      - "true va true"
      - "false va true"
      - "false va false"
      - "true va false"
    answer: 1
    explain: "&[]int{} bo'sh, lekin initsializatsiya qilingan slice (nil emas) ga pointer beradi. new([]int) esa slice tipi zero value'sini (nil) ajratadi. Spetsifikatsiyaning o'z misoli."
  - q: "type V struct{ Tags []string `json:\"tags\"` }. json.Marshal(V{}) va json.Marshal(V{Tags: []string{}}) natijalari?"
    options:
      - "Ikkalasi ham {\"tags\":[]}"
      - "Ikkalasi ham {\"tags\":null}"
      - "{\"tags\":null} va {\"tags\":[]}"
      - "{} va {\"tags\":[]}"
    answer: 2
    explain: "Nil slice JSON'da null, bo'sh (nil bo'lmagan) slice [] bo'ladi. Code Review Comments'da bu JSON istisnosi alohida eslatilgan: odatda nil slice afzal, lekin JSON'da farq muhim bo'lsa bo'sh slice yarating. Biz buni sandbox'da sinadik."
  - q: "type Bad struct{ ID string; Tags []string }. Bad{} == Bad{} nima qiladi?"
    options:
      - "Kompilyatsiya xatosi: slice maydonli struct taqqoslanmaydi"
      - "true: ikkala zero value teng"
      - "Run-time panic"
      - "false: slice'lar hech qachon teng emas"
    answer: 0
    explain: "Struct faqat barcha maydonlari taqqoslanadigan bo'lsa taqqoslanadi. Slice, map va function taqqoslanmaydi, shuning uchun bunday struct == ni kompilyatsiya qilmaydi va map kaliti ham bo'la olmaydi."
task:
  title: "Zero value tayyor Registry va to'g'ri JSON tag'lar"
  prompt: |
    `Registry` avtomobillar ro'yxatini saqlaydi. Servis uni `var reg Registry` ko'rinishida e'lon qiladi, shuning uchun zero value ishlashi kerak. Hozir esa:

    1. `Add` nil map'ga yozadi va panic beradi (`assignment to entry in nil map`).
    2. `Vehicle.ID` tag'siz, JSON'da `"ID"` chiqadi; boshqa maydonlar `snake_case`/kichik harf bilan.
    3. `Odometer` ga `omitempty` qo'yilgan: yangi avtomobilning 0 km ko'rsatkichi JSON'dan tushib qoladi, holbuki 0 haqiqiy qiymat.
    4. `Tags` nil bo'lsa JSON'da `null` chiqadi, mijozlar esa `[]` kutadi.

    Tuzating, `Registry` va `Vehicle` imzolarini (maydon nomlarini) o'zgartirmang. Kutilgan chiqish: `true {"id":"v-1","name":"Isuzu","odometer":0,"tags":[]}`.
  lang: go
  starter: |
    package main

    import (
        "encoding/json"
        "fmt"
        "sync"
    )

    type Vehicle struct {
        ID       string
        Name     string   `json:"name"`
        Odometer float64  `json:"odometer,omitempty"`
        Tags     []string `json:"tags"`
    }

    // Registry avtomobillar ro'yxatini saqlaydi. Zero value tayyor bo'lishi kerak.
    type Registry struct {
        mu       sync.Mutex
        vehicles map[string]Vehicle
    }

    func (r *Registry) Add(v Vehicle) {
        r.mu.Lock()
        defer r.mu.Unlock()
        r.vehicles[v.ID] = v
    }

    func (r *Registry) Get(id string) (Vehicle, bool) {
        r.mu.Lock()
        defer r.mu.Unlock()
        v, ok := r.vehicles[id]
        return v, ok
    }

    func try(f func()) {
        defer func() {
            if r := recover(); r != nil {
                fmt.Println("panic:", r)
            }
        }()
        f()
    }

    func main() {
        var reg Registry
        try(func() { reg.Add(Vehicle{ID: "v-1", Name: "Isuzu", Odometer: 0}) })

        v, ok := reg.Get("v-1")
        out, _ := json.Marshal(v)
        fmt.Println(ok, string(out))
    }
  solution: |
    package main

    import (
        "encoding/json"
        "fmt"
        "sync"
    )

    type Vehicle struct {
        ID       string   `json:"id"`
        Name     string   `json:"name"`
        Odometer float64  `json:"odometer"`
        Tags     []string `json:"tags"`
    }

    // Registry avtomobillar ro'yxatini saqlaydi. Zero value tayyor bo'lishi kerak.
    type Registry struct {
        mu       sync.Mutex
        vehicles map[string]Vehicle
    }

    func (r *Registry) Add(v Vehicle) {
        r.mu.Lock()
        defer r.mu.Unlock()
        if r.vehicles == nil {
            r.vehicles = make(map[string]Vehicle)
        }
        if v.Tags == nil {
            v.Tags = []string{}
        }
        r.vehicles[v.ID] = v
    }

    func (r *Registry) Get(id string) (Vehicle, bool) {
        r.mu.Lock()
        defer r.mu.Unlock()
        v, ok := r.vehicles[id]
        return v, ok
    }

    func try(f func()) {
        defer func() {
            if r := recover(); r != nil {
                fmt.Println("panic:", r)
            }
        }()
        f()
    }

    func main() {
        var reg Registry
        try(func() { reg.Add(Vehicle{ID: "v-1", Name: "Isuzu", Odometer: 0}) })

        v, ok := reg.Get("v-1")
        out, _ := json.Marshal(v)
        fmt.Println(ok, string(out))
    }
  solutionNotes: |
    - Zero value tayyor bo'lishi uchun nil map'ga yozishdan oldin lazy init: `if r.vehicles == nil { r.vehicles = make(...) }`. `sync.Mutex` zero value'si o'zi ochiq mutex, shuning uchun konstruktor kerak emas.
    - `omitempty` ni 0 haqiqiy qiymat bo'lgan maydonlardan olib tashlang: u zero value'ni (0, "", nil, false) kodlamaydi, "yo'q" va "nol" farqlanmay qoladi. Farq kerak bo'lsa pointer maydon (`*float64`) ishlatiladi.
    - Nil slice JSON'da `null`. `Add` ichida `v.Tags == nil` bo'lsa `[]string{}` qo'yiladi. Bu qiymat `Vehicle` nusxasida (value) o'zgaradi va map'ga shu yoziladi.
    - Tag sintaksisi buzilsa (masalan `json: "name"`), `go vet` structtag tekshiruvi ogohlantiradi; shu uchun `go vet` ni har doim ishga tushiring.
  checklist:
    - "`var reg Registry` `Add` chaqirganda panic bermaydi"
    - "JSON'da kalit `id` (kichik harf)"
    - "`odometer: 0` JSON'da saqlanadi"
    - "Tags nil bo'lsa `[]` chiqadi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go'da konstruktor tilning qismi emas. Har bir o'zgaruvchi, har bir struct maydoni, yangi massiv elementi e'lon qilinganda avtomatik **zero value** oladi. Bu qoida soddaligi bilan ham kuchli (deyarli hech qachon "initsializatsiya qilinmagan xotira" yo'q), ham xavfli (nol qiymat va "qiymat berilmagan" farqlanmaydi, nil map'ga yozish panic beradi). Node.js'dan o'tgan dasturchi `undefined` va `null` farqiga o'rgangan; Go'da bunday ikkilik yo'q: `0`, `""`, `nil`, `false`.

Ikkinchi muammo: struct qiymati nusxalanadi, composite literal'lar ikki xil yoziladi (keyed va unkeyed), struct tag'lar esa JSON, DB va validatsiya uchun ishlatiladi, lekin kompilyator ularni tekshirmaydi. Bu darsda spetsifikatsiya qoidalari va ular real kodda keltiradigan xatolar ko'rib chiqiladi.

## Asosiy g'oya

### Zero value

Spetsifikatsiya: xotira ajratilganda (deklaratsiya, `new`, composite literal yoki `make`) va aniq boshlang'ich qiymat berilmasa, qiymat zero value oladi: `false` bool uchun, `0` sonlar uchun, `""` string uchun, `nil` pointer, function, interface, slice, channel va map uchun. Initsializatsiya rekursiv: struct maydonlari, massiv elementlari ham nollanadi. `var i int` va `var i int = 0` teng.

Bundan Go'ning mashhur dizayn tamoyili kelib chiqadi: **zero value foydali bo'lsin**. `sync.Mutex` zero value'si ochiq mutex, `bytes.Buffer` zero value'si bo'sh buffer, nil slice'ga `append` ishlaydi. Shu tamoyilga mos tip konstruktorsiz ishlatiladi (`var c Counter`), shu tufayli u boshqa struct'larga ham embed qilinadi va ro'yxatlarda ishlatiladi.

### nil: har tip uchun har xil oqibat

Nil qiymatlar bir xil emas:

- **nil slice**: `len` 0, `cap` 0, `append` ishlaydi, range tsikli 0 iteratsiya. Code Review Comments bo'sh slice e'lon qilganda `var t []string` ni `t := []string{}` dan afzal ko'radi: ikkalasi `len` va `cap` bo'yicha teng, lekin birinchisi nil. Istisno: JSON'da nil slice `null`, bo'sh slice `[]` bo'ladi. API dizaynida nil va bo'sh slice o'rtasida farq qo'ymaslik tavsiya etiladi.
- **nil map**: o'qish, `len`, `range`, `delete` xavfsiz; yozish panic (`assignment to entry in nil map`).
- **nil pointer**: dereference panic; lekin nil pointer receiver'li metodlar chaqirilishi mumkin (9-dars).
- **nil interface, func, channel**: har birining o'z xatti-harakati bor (17-18, 42-darslar).

### Struct: maydonlar, nusxa, taqqoslash

Struct - nomlangan maydonlar ketma-ketligi. Maydon nomlari bo'sh bo'lmasa noyob bo'lishi shart; `_` nomli maydon (padding) mumkin. Struct qiymati assignment va argument uzatishda **to'liq nusxalanadi**. Code Review Comments ogohlantiradi: boshqa paketdagi struct'ni nusxalashda ehtiyot bo'ling, masalan `bytes.Buffer` ichidagi slice nusxada asl massivga alias bo'lib qoladi; umuman, metodlari `*T` bilan bog'langan `T` qiymatini nusxalamang.

Struct taqqoslanadi (`==`), agar barcha maydonlari taqqoslanadigan bo'lsa (19-dars). Slice, map yoki function maydoni bo'lgan struct `==` ni kompilyatsiya qilmaydi va map kaliti bo'la olmaydi. Taqqoslanadigan struct map kaliti bo'lishi mumkin: `map[Point]struct{}` - set.

### Struct tag

Maydon deklaratsiyasidan keyin ixtiyoriy string literal tag turishi mumkin. Spetsifikatsiya: tag'lar reflection orqali ko'rinadi va struct tiplarining identity'sida ishtirok etadi, lekin boshqacha e'tiborsiz qoldiriladi. Ya'ni kompilyator tag mazmunini tekshirmaydi; `encoding/json`, ORM va validator kutubxonalari uni `reflect` orqali o'qiydi. Konvensiya: `key:"value"` juftliklari, bo'sh joy bilan ajratilgan. Tag buzilgan bo'lsa (`json: "name"` yoki yopilmagan qo'shtirnoq), `go vet` structtag tekshiruvi buni ogohlantiradi.

## Chuqurroq: composite literal'lar

Composite literal struct, massiv, slice va map uchun yangi qiymat yaratadi (har safar baholanganda yangi). Qoidalar:

- **Struct**: unkeyed shaklda hamma maydon, deklaratsiya tartibida, berilishi shart. Keyed shaklda har element kalitli, tushirilgan maydonlar zero value oladi. Bir maydonni ikki marta berish xato. Eksport qilinadigan struct uchun unkeyed shakl maydon qo'shilganda kompilyatsiyadan chiqadi (1-dars). Spetsifikatsiyaning 1.27 versiyasida kalit promoted maydon uchun ham yozilishi mumkin ([Go 1.27]); bu xususiyatni biz kompilyatsiya qilib ko'rmadik (sandbox Go 1.24.7).
- **Massiv va slice**: elementlar indeks bilan; kalit manfiy bo'lmagan konstanta. Kalitsiz element oldingisi + 1 indeksga ega. Slice literal butun massivni tasvirlaydi: uzunlik va sig'im = maksimal indeks + 1. `[...]T{}` massiv uzunligini avtomatik aniqlaydi.
- **Map**: har element kalitli; takroriy konstanta kalit xato.
- **Element tipini tushirish**: massiv, slice yoki map ichidagi composite literal element tipi bilan bir xil bo'lsa, tipni yozmaslik mumkin; element tipi `*T` bo'lsa `&T` ham tushiriladi: `[]*Point{{1, 1}, {}}`.
- **Pointer**: `&T{...}` noyob o'zgaruvchiga pointer yaratadi. `&[]int{}` initsializatsiya qilingan bo'sh slice'ga pointer beradi, `new([]int)` esa nil slice'ga.
- `if`, `for`, `switch` sarlavhasida tip nomli literal'ni qavssiz yozsangiz parser adashadi: `if x == (T{a, b}) { }` shaklida qavs kerak.

## Misol: zero value, literal va tag

### 1. Zero value foydali bo'lganda va nil map

```go
package main

import (
	"bytes"
	"fmt"
	"sync"
)

// Counter zero value'si ishlatishga tayyor: konstruktor kerak emas.
type Counter struct {
	mu     sync.Mutex
	counts map[string]int
}

func (c *Counter) Inc(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.counts == nil { // lazy init
		c.counts = make(map[string]int)
	}
	c.counts[key]++
}

func (c *Counter) Get(key string) int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.counts[key] // nil map'dan o'qish xavfsiz
}

type Vehicle struct {
	ID       string
	Odometer float64
	Tags     []string
	Last     *Position
	Meta     map[string]string
}

type Position struct{ Lat, Lon float64 }

func main() {
	var c Counter
	c.Inc("gps")
	c.Inc("gps")
	fmt.Println(c.Get("gps"), c.Get("fuel"))

	var v Vehicle
	fmt.Printf("%+v\n", v)
	v.Tags = append(v.Tags, "refrigerated") // nil slice'ga append ishlaydi
	fmt.Println(v.Tags, v.Meta["x"] == "", len(v.Meta))

	var buf bytes.Buffer // zero value tayyor
	buf.WriteString("nuqta ")
	fmt.Println(buf.String())

	defer func() { fmt.Println("recover:", recover()) }()
	v.Meta["region"] = "tashkent" // nil map'ga yozish panic
}
```

```text
2 0
{ID: Odometer:0 Tags:[] Last:<nil> Meta:map[]}
[refrigerated] true 0
nuqta 
recover: assignment to entry in nil map
```

`Counter` konstruktorsiz ishlaydi: `sync.Mutex` zero value'si tayyor, `counts` esa birinchi `Inc`da lazy yaratiladi. `Get("fuel")` yo'q kalit uchun `0` qaytardi, nil map'dan o'qish xavfsiz bo'lgani uchun. `Vehicle` zero value'sida `Tags` va `Meta` nil, `Last` nil pointer; `append` ishladi, `v.Meta["region"] = ...` esa panic berdi. Go 1.24.7 (linux/amd64) chiqishi.

### 2. Composite literal qoidalari

```go
package main

import "fmt"

type Point struct{ Lat, Lon float64 }

type Stop struct {
	Name string
	At   Point
	Eta  int
}

func main() {
	// keyed: tushirib qoldirilgan maydonlar zero value
	s1 := Stop{Name: "ombor", At: Point{Lat: 41.3}}
	// unkeyed: barcha maydonlar tartib bilan
	s2 := Stop{"depo", Point{41.2, 69.2}, 15}
	fmt.Printf("%+v\n%+v\n", s1, s2)

	// element tipini tushirish
	route := []Stop{{"A", Point{1, 2}, 5}, {Name: "B"}}
	byName := map[string]Point{"orig": {0, 0}, "end": {41.3, 69.3}}
	ptrs := []*Point{{1, 1}, {}}
	fmt.Println(len(route), len(byName), *ptrs[0], *ptrs[1])

	// indeks kalitlari va [...]
	days := [...]string{2: "chor", 4: "juma"}
	fmt.Println(len(days), days)
	sl := []int{5: 1}
	fmt.Println(len(sl), cap(sl), sl)

	// &[]int{} va new([]int) farqi
	p1 := &[]int{}
	p2 := new([]int)
	fmt.Println(*p1 == nil, *p2 == nil)

	// har baholashda yangi qiymat
	mk := func() *Point { return &Point{1, 2} }
	fmt.Println(mk() == mk())
}
```

```text
{Name:ombor At:{Lat:41.3 Lon:0} Eta:0}
{Name:depo At:{Lat:41.2 Lon:69.2} Eta:15}
2 2 {1 1} {0 0}
5 [  chor  juma]
6 6 [0 0 0 0 0 1]
false true
false
```

`days := [...]string{2: "chor", 4: "juma"}` uzunligi 5, ikki element bo'sh. `[]int{5: 1}` uzunlik va sig'im 6. `*p1 == nil` `false`, `*p2 == nil` `true`: spetsifikatsiya misoli sinovdan o'tdi. `mk() == mk()` `false`: har baholash yangi o'zgaruvchi yaratadi.

### 3. Tag'lar va JSON

```go
package main

import (
	"encoding/json"
	"fmt"
	"reflect"
)

type Vehicle struct {
	ID       string   `json:"id"`
	Name     string   `json:"name,omitempty"`
	Odometer float64  `json:"odometer,omitempty"`
	Tags     []string `json:"tags"`
	Internal string   `json:"-"`
	secret   string
}

func main() {
	v := Vehicle{ID: "v-1", Internal: "x", secret: "y"}
	out, _ := json.Marshal(v)
	fmt.Println(string(out))

	v.Tags = []string{}
	v.Odometer = 0
	out, _ = json.Marshal(v)
	fmt.Println(string(out))

	field, _ := reflect.TypeOf(v).FieldByName("Odometer")
	tag := field.Tag.Get("json")
	val, ok := field.Tag.Lookup("db")
	fmt.Printf("json=%q db=%q ok=%t\n", tag, val, ok)
}
```

```text
{"id":"v-1","tags":null}
{"id":"v-1","tags":[]}
json="odometer,omitempty" db="" ok=false
```

Birinchi JSON'da `tags` `null`, ikkinchisida `[]`; `Name` va `Odometer` `omitempty` tufayli tushib qoldi (nol qiymat bo'lgani uchun, shu jumladan haqiqiy `0` km). `Internal` (`json:"-"`) va `secret` (eksport qilinmagan) umuman kodlanmadi. `reflect` tag qiymatini o'qiydi: `Get` bo'lmagan kalit uchun bo'sh string qaytaradi, `Lookup` esa kalit yo'qligini `false` bilan aytadi.

Buzilgan tag'larni `go vet` ushlaydi. `Name string \`json: "name"\`` va yopilmagan qo'shtirnoq uchun:

```text
struct field tag `json: "name"` not compatible with reflect.StructTag.Get: bad syntax for struct tag value
struct field tag `json:"km` not compatible with reflect.StructTag.Get: bad syntax for struct tag value
```

### 4. Taqqoslash va zero-size struct

```go
package main

import (
	"fmt"
	"unsafe"
)

type Point struct{ Lat, Lon float64 }

type Bad struct {
	ID   string
	Tags []string
}

func main() {
	a, b := Point{1, 2}, Point{1, 2}
	fmt.Println(a == b, a != Point{})

	visited := map[Point]struct{}{}
	visited[a] = struct{}{}
	_, seen := visited[b]
	fmt.Println(seen, unsafe.Sizeof(struct{}{}))

	// Bad{} == Bad{}  // xato: struct containing []string cannot be compared
	var x, y any = a, b
	fmt.Println(x == y)
}
```

```text
true true
true 0
true
```

`Point` taqqoslanadi va map kaliti bo'ldi. `map[Point]struct{}` set sifatida ishlatildi, `struct{}{}` o'lchami amd64'da 0 bayt (`unsafe.Sizeof`). Izohda turgan `Bad{} == Bad{}` kompilyatsiya xatosi beradi:

```text
invalid operation: Bad{} == Bad{} (struct containing []string cannot be compared)
```

## Qachon qo'llamaslik kerak

- Hamma tipni "foydali zero value" qilishga urinmang. Ba'zi tiplar majburiy sozlamasiz (DB manzili, timeout) ma'noga ega emas. Bunday tip uchun konstruktor yozing va hujjatda zero value yaroqsizligini ayting (37-dars).
- `omitempty` ni zero value ma'noli bo'lgan maydonlarga qo'ymang: 0 km, `false` bayroq, bo'sh string. "Yo'q" va "nol" farqi kerak bo'lsa, pointer maydon (`*float64`) yoki maxsus tip ishlating.
- Zero value va "belgilanmagan"ni aralashtirmang. `Status` enum'ida `0` ni `Unknown` qilish (3-dars) buni aniq belgilaydi; aks holda yangi yozuv jimgina "birinchi holat"da bo'ladi.
- Unkeyed literal'ni faqat o'z paketingizdagi kichik, barqaror struct'lar uchun ishlating (masalan `Point{1, 2}`). Boshqa paket tipi uchun keyed yozing (1-dars).
- Struct tag'ga biznes qoidalarini ortiqcha yuklamang. Tag'lar string va kompilyator ularni tekshirmaydi: bir struct'ga `json`, `db`, `validate`, `xml` tag'lari to'planib ketsa, transport modeli va domen modeli aralashadi (92-dars). Chegaralar uchun alohida DTO struct'lari afzalroq: ular orasida konversiyada tag'lar e'tiborga olinmaydi (4-dars).
- Katta struct'ni qiymat bilan uzatmang: har chaqiruv to'liq nusxa. Aniq chegara spetsifikatsiyada yo'q; Code Review Comments uni "barcha elementlarni argument qilib uzatish" bilan solishtirishni tavsiya qiladi (9-dars).

## Stack'da: Node.js/TypeScript bilan solishtirish

- TypeScript'da `interface User { name?: string }` ixtiyoriy maydon `undefined` bo'lishi mumkin. Go'da bunday holat yo'q: maydon har doim bor, qiymati nol. "Yo'q"ni ifodalash uchun pointer yoki `ok` bayroq.
- `JSON.stringify` `undefined` maydonni tashlab ketadi, `null`ni yozadi. Go'da `omitempty` zero value'ni tashlaydi (nolni ham), nil pointer/slice/map esa `null` bo'ladi. Frontend `0` va yo'q qiymatni farqlashi kerak bo'lsa, pointer maydon ishlating.
- `class` konstruktori o'rniga Go'da `NewX(...)` oddiy funksiya, lekin yaxshi tiplar uni talab qilmaydi. TypeScript'dagi `new Map()` talabi nil map yozish panic'iga mos keladi: Go'da map `make` yoki literal bilan yaratilishi shart.
- Obyektlar JavaScript'da reference. Go'da struct qiymat bo'lib nusxalanadi: `a := b` ikki mustaqil struct. Pointer ishlatilsa reference semantika qaytadi (9-dars).
- NestJS DTO'larida `class-validator` dekoratorlari. Go'da tag'lar (`validate:"required"`) shu rolni bajaradi, lekin tekshiruvni uchinchi tomon kutubxonasi `reflect` orqali bajaradi, kompilyator emas.

## Xulosa

- Har qiymat zero value bilan boshlanadi (`0`, `""`, `false`, `nil`), rekursiv struct va massivlar ichida ham; yaxshi Go tiplari zero value'ni foydali qiladi.
- Nil slice `append`, `len`, `range` uchun xavfsiz, nil map o'qish uchun xavfsiz, lekin yozishda panic; JSON'da nil slice `null`, bo'sh slice `[]`.
- Struct to'liq nusxalanadi va faqat barcha maydonlari taqqoslanadigan bo'lsa `==` bilan solishtiriladi; shunday struct map kaliti bo'la oladi.
- Composite literal'da keyed shakl tushirilgan maydonlarni nollaydi; element tipini tushirish, `[...]` va indeks kalitlari qisqartma beradi; `&[]int{}` va `new([]int)` bir xil emas.
- Struct tag'lar faqat `reflect` orqali ko'rinadi, kompilyator tekshirmaydi: sintaksis xatolarini `go vet` ushlaydi, mazmun xatolarini testlar ushlaydi.
- `omitempty` zero value'ni, shu jumladan ma'noli nolni ham yo'qotadi: pointer maydon yoki ochiq tip bilan farqlang.
