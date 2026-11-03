---
n: 22
slug: embedding
title: "Embedding va kompozitsiya"
summary: "Struct va interface embedding qanday ishlaydi, metodlar qanday promote bo'ladi, nima uchun bu meros emas, ambiguous selector va method set qoidalari, va embedding API'ni ataylab oshkor qilib yuborgan tipik xatolar."
duration: 40
sources:
  - id: go-spec
    note: "Struct types bo'limi: embedded field va promoted field/method ta'rifi, method set qoidalari; Selectors bo'limi: depth va yagona eng sayoz selector qoidasi"
  - id: 100go
    note: "#10 Not being aware of the possible problems with type embedding: embedding faqat qulaylik uchun ishlatilmasligi va yashirilishi kerak narsani promote qilmasligi kerak"
  - id: go1compat
    note: "Expectations bo'limi: embedded tiplarga yangi metod qo'shilishi bilan bog'liq mumkin bo'lgan konfliktlar"
  - id: gopl
    note: "6-bob (Methods) ichidagi struct embedding mavzusi umumiy ma'noda; darsdagi aniq da'volar kitobdan emas, spetsifikatsiya va boshqa manbalardan tekshirilgan"
quiz:
  - q: "`GPSTracker` `Base`ni embed qiladi va `Label()`ni qayta yozadi. `Base.Describe()` ichida `b.Label()` chaqiriladi. `GPSTracker{Base: Base{ID: \"T-101\"}}` uchun `g.Describe()` nima qaytaradi (`Base.Label()` 'qurilma ID', `GPSTracker.Label()` 'GPS ID')?"
    options:
      - "`[GPS T-101]`, chunki eng tashqi tipning metodi chaqiriladi"
      - "`[qurilma T-101]`, chunki `Describe`ning receiver'i `Base`, tashqi tip haqida u bilmaydi"
      - "Kompilyatsiya xatosi: `Label` ikki marta e'lon qilingan"
      - "`[GPS T-101]` faqat receiver pointer bo'lsa"
    answer: 1
    explain: "Embedding delegatsiya, meros emas. Promote qilingan `Describe` ichida receiver embed qilingan `Base` qiymatining o'zi, shuning uchun `b.Label()` `Base.Label`ni chaqiradi. Virtual dispatch yo'q. `GPSTracker.Label` faqat `g.Label()` shaklida (eng sayoz depth) ko'rinadi. Pointer receiver bu qoidani o'zgartirmaydi."
  - q: "`type C struct{ A; B }`, ikkala `A` va `B`da `Name()` metodi bor. Nima to'g'ri?"
    options:
      - "`C` e'lon qilinishining o'zida kompilyatsiya xatosi chiqadi"
      - "`c.Name()` `A`ning metodini chaqiradi, chunki u birinchi e'lon qilingan"
      - "Ikkala metod ham chaqiriladi va natijalar birlashtiriladi"
      - "E'lon to'g'ri; `c.Name()` ambiguous selector xatosi beradi, `c.A.Name()` va `c.B.Name()` ishlaydi"
    answer: 3
    explain: "Spetsifikatsiya: selector eng sayoz depth'dagi yagona mos nomni belgilaydi; yagona bo'lmasa selector noto'g'ri. Xato faqat shu selector ishlatilganda chiqadi (`ambiguous selector c.Name`), tip e'loni esa to'g'ri. Birinchi e'lon qilinganlik qoidasi yo'q."
  - q: "`type Registry struct{ sync.Mutex; devices map[string]string }` kutubxona API'si sifatida chiqarilsa, asosiy muammo nima?"
    options:
      - "`Lock` va `Unlock` Registry'ning ochiq metodlari bo'lib qoladi: tashqi kod ularni chaqirishi va ichki qulf protokolini buzishi mumkin"
      - "Mutex nusxalanadi va har bir metod chaqiruvida yangi qulf yaratiladi"
      - "Embed qilingan `sync.Mutex` zero value'da ishlamaydi"
      - "Kompilyator `Lock` nomi bilan konflikt haqida xato beradi"
    answer: 0
    explain: "Embedding promote qilingan metodlarni tashqi tip API'siga qo'shadi. 100 Go Mistakes #10: embedding yashirilishi kerak bo'lgan xatti-harakatni (masalan, qulflash) oshkor qilmasligi kerak. Yechim: `mu sync.Mutex` nomli eksport qilinmagan maydon. Qolgan variantlar noto'g'ri: mutex zero value'da ishlaydi va nusxalash muammosi embedding'dan emas."
  - q: "`type loggingStore struct{ Store }` (Store - interface). `var ls loggingStore; ls.Save(\"T-1\")` nima qiladi, `Save` loggingStore'da qayta yozilmagan?"
    options:
      - "Kompilyatsiya xatosi, chunki `Store` qiymati berilmagan"
      - "`nil` qaytaradi, chunki zero interface 'hech narsa qilmaydi'"
      - "Nil interface'dagi metod chaqirilgani uchun run-time panic (nil pointer dereference)"
      - "Default implementatsiya avtomatik yaratiladi"
    answer: 2
    explain: "Embed qilingan interface maydonining zero value'i nil. Spetsifikatsiya: nil interface qiymatida metodni chaqirish run-time panic beradi. Shuning uchun dekorator konstruktori ichki Store'ni majburiy qabul qilishi va nil bo'lsa darhol xato berishi kerak."
  - q: "`type Base struct{}; func (*Base) Reset() {}; type Dev struct{ Base }`. Qaysi ifoda `Reset` metodiga ega method set'ni beradi?"
    options:
      - "`Dev` ham, `*Dev` ham"
      - "Hech biri: embed qilingan tip metodlari faqat maydon orqali (`d.Base.Reset()`) chaqiriladi"
      - "Faqat `Dev`"
      - "Faqat `*Dev`"
    answer: 3
    explain: "Spetsifikatsiya: S da embed qilingan T bo'lsa, S va *S method set'lariga T receiver'li metodlar, *S ga esa qo'shimcha ravishda *T receiver'li metodlar kiradi. `Reset` pointer receiver'li, demak faqat `*Dev` method set'ida. `d.Reset()` yozuvi `d` addressable bo'lganda ishlaydi, lekin `Dev` qiymati interface'ni qanoatlantirmaydi."
  - q: "`type Trip struct{ time.Time; DeviceID string }` qiymati `json.Marshal`ga berildi. Natija qanday va nima uchun?"
    options:
      - "`{\"Time\":\"...\",\"device_id\":\"T-1\"}`: embed qilingan tip nomi kalit bo'ladi"
      - "Faqat vaqt satri (`\"2026-11-03T08:00:00Z\"`): `Time`ning `MarshalJSON` metodi `Trip`ga promote bo'ladi va butun qiymatni kodlaydi"
      - "`{\"device_id\":\"T-1\"}`: embed qilingan maydonlar JSON'da ko'rinmaydi"
      - "Kompilyatsiya xatosi, chunki `time.Time` embed qilinmaydi"
    answer: 1
    explain: "`time.Time` `MarshalJSON` metodiga ega, embedding uni `Trip` method set'iga promote qiladi, shuning uchun `Trip` `json.Marshaler`ni implement qiladi va faqat vaqt kodlanadi, `device_id` yo'qoladi. Bu darsdagi misolda Go 1.24.7 da tekshirilgan. Yechim: maydonni nom bilan e'lon qilish (`At time.Time`)."
task:
  title: "Embed qilingan Mutex'ni yashirish"
  prompt: |
    `Counter` yo'l hisoblagichi `sync.Mutex`ni embed qilgan. Natijada `Lock` va `Unlock` `Counter`ning ochiq metodlari bo'lib qolgan: tashqi kod ularni o'zi chaqirib, ichki qulf protokolini buzishi mumkin. `main` oxirida buni tekshiruvchi qator bor: `Counter` `interface{ Lock() }`ni implement qiladimi.

    Vazifa: `Counter`ning ochiq xatti-harakatini (`Inc`, `Get`, `NewCounter`) o'zgartirmasdan mutex'ni yashiring, shunda `Lock` tashqariga ko'rinmasin va yakuniy tekshiruv `false` chiqarsin. Embedding'ni olib tashlash `Counter`ning method set'iga qanday ta'sir qilishini tushuntiring (yechim izohida).
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sync"
    )

    // Counter yo'l hisoblagichi. Muammo: sync.Mutex embed qilingan,
    // shuning uchun Lock/Unlock tashqi paketlarga ham ko'rinadi.
    type Counter struct {
        sync.Mutex
        byDevice map[string]int
    }

    func NewCounter() *Counter {
        return &Counter{byDevice: map[string]int{}}
    }

    func (c *Counter) Inc(id string) {
        c.Lock()
        defer c.Unlock()
        c.byDevice[id]++
    }

    func (c *Counter) Get(id string) int {
        c.Lock()
        defer c.Unlock()
        return c.byDevice[id]
    }

    func main() {
        c := NewCounter()
        c.Inc("T-1")
        c.Inc("T-1")
        fmt.Println(c.Get("T-1"))
        _, exposed := any(c).(interface{ Lock() })
        fmt.Println("Lock tashqariga ochiq:", exposed)
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
    )

    // Counter yo'l hisoblagichi. Mutex nomli, eksport qilinmagan maydon:
    // Lock/Unlock tashqi paketlarga ko'rinmaydi.
    type Counter struct {
        mu       sync.Mutex
        byDevice map[string]int
    }

    func NewCounter() *Counter {
        return &Counter{byDevice: map[string]int{}}
    }

    func (c *Counter) Inc(id string) {
        c.mu.Lock()
        defer c.mu.Unlock()
        c.byDevice[id]++
    }

    func (c *Counter) Get(id string) int {
        c.mu.Lock()
        defer c.mu.Unlock()
        return c.byDevice[id]
    }

    func main() {
        c := NewCounter()
        c.Inc("T-1")
        c.Inc("T-1")
        fmt.Println(c.Get("T-1"))
        _, exposed := any(c).(interface{ Lock() })
        fmt.Println("Lock tashqariga ochiq:", exposed)
    }
  solutionNotes: |
    - `sync.Mutex` embed o'rniga `mu sync.Mutex` nomli eksport qilinmagan maydon bo'ldi. Promote qilinadigan metod qolmadi, shuning uchun `Lock`/`Unlock` method set'dan chiqdi.
    - Barcha ichki chaqiruvlar `c.mu.Lock()` / `c.mu.Unlock()` ga o'zgartirildi. Tashqi API (`NewCounter`, `Inc`, `Get`) o'zgarmadi, ya'ni chaqiruvchilar kodi buzilmaydi.
    - Yakuniy tekshiruv `any(c).(interface{ Lock() })` type assertion bilan method set'ni ish vaqtida tekshiradi: starter'da `true`, yechimda `false`.
    - Mutex `Counter` ichida qiymat sifatida turibdi va `Counter` doim pointer orqali ishlatiladi (`NewCounter` pointer qaytaradi): mutex nusxalanmaydi. `go vet` nusxalash xatolarini (`copylocks`) ushlaydi.
  checklist:
    - "`Counter`da embed qilingan maydon yo'q, mutex nomli maydon"
    - "`Inc`, `Get` va `NewCounter` imzolari o'zgarmagan"
    - "Yakuniy chiqish: `Lock tashqariga ochiq: false`"
    - "Hisoblagich qiymati to'g'ri (`2`)"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Class-asosli tillardan kelgan dasturchi Go'da `extends` qidiradi va embedding'ni topadi. Sintaksis o'xshash tuyuladi: ichki tipni nomsiz yozasiz va uning metodlari tashqi tipda paydo bo'ladi. Shu o'xshashlik uchta tipik xatoga olib keladi.

Birinchisi: embedding'ni meros deb o'ylab, 'bazaviy sinf' metodlari tashqi tipdagi qayta yozilgan metodlarni chaqiradi deb kutish. Go'da bunday ishlamaydi va xato jimgina noto'g'ri natija beradi. Ikkinchisi: qulaylik uchun `sync.Mutex` yoki boshqa yordamchi tipni embed qilib, uning metodlarini tipning ochiq API'siga chiqarib yuborish. Uchinchisi: embed qilingan tipning metodi (masalan `MarshalJSON`) tashqi tipning xatti-harakatini o'zgartirib yuborishini sezmaslik. Bu darsda embedding'ning aniq semantikasi spetsifikatsiya darajasida ko'riladi, va qachon u to'g'ri vosita ekani, qachon oddiy nomli maydon yaxshiroq ekani aytiladi.

## Asosiy g'oya

### Embedded field

Spetsifikatsiya ta'rifi: nomsiz, faqat tip bilan e'lon qilingan struct maydoni embedded field deyiladi. Embedded field tip nomi `T` sifatida yoki interface bo'lmagan tip nomiga pointer `*T` sifatida yoziladi (`T` o'zi pointer yoki type parameter bo'la olmaydi), va tipning qualifikatsiyasiz nomi maydon nomi bo'ladi. Shuning uchun `T`, `*T` va `*P.T` bir struct'da birga bo'la olmaydi: maydon nomlari to'qnashadi.

Embedded maydonning maydon va metodlari tashqi struct'ga promote qilinadi, agar `x.f` legal selector bo'lib shu maydon yoki metodni bildirsa. Promote qilingan maydonlar oddiy maydonlar kabi ishlaydi. Go 1.24 spetsifikatsiyasida bir istisno bor edi: ular struct literal'da maydon nomi sifatida ishlatilmaydi (avval embed qilingan tip nomi bilan yoziladi). Go 1.27 release notes va spetsifikatsiyasida struct literal kaliti istalgan to'g'ri field selector bo'la oladi, shuning uchun bu istisno olib tashlangan.

### Method set qoidasi

Promote qilingan metodlar struct'ning method set'iga quyidagicha kiradi (spetsifikatsiya):

- S da embed qilingan maydon `T` bo'lsa: S va *S method set'lariga `T` receiver'li promote qilingan metodlar kiradi. *S ga qo'shimcha ravishda `*T` receiver'li metodlar ham kiradi.
- S da embed qilingan maydon `*T` bo'lsa: S va *S ikkalasiga `T` yoki `*T` receiver'li promote qilingan metodlar kiradi.

Bu qoida interface'ga mosligini belgilaydi (21-dars): `Dev struct{ Base }` va `func (*Base) Reset()` bo'lsa, `Dev{}` qiymati `Reset()` interface'iga mos kelmaydi, `&Dev{}` mos keladi.

### Selector va depth

Selector qoidasi: `x.f` tipda `f` mavjud eng sayoz depth'dagi nomni bildiradi. Depth - `f`ga yetish uchun o'tilgan embedded maydonlar soni (o'zi e'lon qilingan nomning depth'i nol, embedded maydondagi nomniki bir va hokazo). Eng sayoz depth'da bitta emas, bir nechta mos nom bo'lsa, selector noto'g'ri. Shuning uchun tashqi tip embed qilingan tipdagi nomni 'yopib qo'yishi' (shadowing) mumkin: tashqi tipning metodi depth nolda, embed qilingan metod depth birda, birinchisi g'olib. Bu qayta yozish emas, faqat nomni yopish: embed qilingan metod `c.Base.Label()` shaklida hamon bor.

## Chuqurroq: delegatsiya, ambiguity va yashirin xatti-harakat

### Receiver embed qilingan qiymatning o'zi

Promote qilingan metod chaqirilganda receiver sifatida embed qilingan maydon uzatiladi, tashqi struct emas. `g.Describe()` chaqirilsa, Go `g.Base.Describe()` chaqiradi va `Describe` ichida `b` bu `Base`. U tashqi `GPSTracker` borligini bilmaydi, shuning uchun `b.Label()` `Base.Label`ni chaqiradi, `GPSTracker.Label`ni emas. Bu Java yoki TypeScript'dagi virtual dispatch'dan tub farq: 'template method' naqshini embedding bilan qurib bo'lmaydi. Shu naqsh kerak bo'lsa, xatti-harakatni interface yoki funksiya maydoni sifatida uzating (21-dars).

### Ambiguity

Ikkita embed qilingan tipda bir xil nom bo'lsa, e'lon o'zi to'g'ri, lekin selector ishlatilgandagina xato chiqadi. `type C struct{ A; B }` va ikkala tipda `Name()` bo'lganda:

```text
./main.go:20:16: ambiguous selector c.Name
```

Chiqish Go 1.24.7 `go build` dan. Yechim: `c.A.Name()` yoki `c.B.Name()` yozing, yoki `C`da o'z `Name()` metodini e'lon qiling (depth nol). Muhim nozik joy: bu holat kutubxona yangilanganda paydo bo'lishi mumkin. Go 1 compatibility hujjati (1-dars) shuni istisno sifatida sanaydi: embed qilingan tipga yangi metod qo'shish, tashqi tipda boshqa embed qilingan tipning o'sha nomli metodi bilan konfliktga olib kelishi mumkin. Shu sababli begona paketning tipini embed qilish uning kelajakdagi o'zgarishlariga tegishli xavfni olib keladi.

### Embedded pointer va nil

`*T` embed qilinsa, `T` metodlari ham, `*T` metodlari ham promote bo'ladi, lekin maydon `nil` bo'lishi mumkin. Pointer receiver'li metod nil receiver bilan chaqirilib ishlashi mumkin (agar ichkarida maydonga kirilmasa), qiymat receiver'li metod esa nil'dan nusxa olishga urinib panic beradi. Embed qilingan interface uchun ham xuddi shunday: maydonning zero value'i nil, va nil interface qiymatidagi metodni chaqirish spetsifikatsiyaga ko'ra run-time panic. Misolda:

```go
type loggingStore struct{ Store }

var ls loggingStore
ls.Save("T-1") // Store nil
```

```text
recover: runtime error: invalid memory address or nil pointer dereference
```

Natija Go 1.24.7 da olingan. Dekorator (embed qilingan interface bilan bitta metodni o'rash) konstruktori ichki qiymatni majburiy qabul qilishi va nil bo'lsa xato berishi kerak.

### Interface embedding

Interface boshqa interface'larni embed qilishi ham mumkin (`io.ReadWriter` `Reader` va `Writer`ni embed qiladi). Bu struct embedding'dan farqli, faqat method to'plamini kompozitsiya qiladi: yangi interface'ning type set'i embed qilinganlarning kesishmasidir (spetsifikatsiya). Go 1.14 dan embed qilingan interface'larda bir xil metod bir necha marta uchrasa xato emas (spetsifikatsiyaning versiyalar ilovasida shunday yozilgan).

## Misol: dekorator, mutex va JSON tuzog'i

Birinchi dastur embedding'ning to'rt xatti-harakatini ko'rsatadi: shadowing, delegatsiya (virtual dispatch yo'qligi), ochiq qolgan `Lock`, va embed qilingan interface orqali dekorator.

```go
package main

import (
	"encoding/json"
	"fmt"
	"sync"
)

// Base barcha qurilmalar uchun umumiy maydon va metodlar.
type Base struct {
	ID string
}

func (b Base) Label() string    { return "qurilma " + b.ID }
func (b Base) Describe() string { return "[" + b.Label() + "]" }

// GPSTracker Base'ni embed qiladi va Label'ni qayta yozadi (shadowing).
type GPSTracker struct {
	Base
	Sats int
}

func (g GPSTracker) Label() string { return "GPS " + g.ID }

// Registry sync.Mutex'ni embed qilgan: Lock/Unlock tashqariga chiqib qoladi.
type Registry struct {
	sync.Mutex
	devices map[string]string
}

// SafeRegistry mutex'ni nomli maydon sifatida saqlaydi: API toza qoladi.
type SafeRegistry struct {
	mu      sync.Mutex
	devices map[string]string
}

func (r *SafeRegistry) Add(id, name string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.devices[id] = name
}

// Store interface'ini embed qilib, bitta metodni bezash (decorator).
type Store interface {
	Save(id string) error
	Load(id string) (string, error)
}

type memStore struct{ data map[string]string }

func (m *memStore) Save(id string) error { m.data[id] = "saved"; return nil }
func (m *memStore) Load(id string) (string, error) {
	return m.data[id], nil
}

type loggingStore struct {
	Store
}

func (l loggingStore) Save(id string) error {
	fmt.Println("log: Save", id)
	return l.Store.Save(id)
}

// JSON: embed qilingan struct maydonlari tashqi obyektga yoyiladi.
type Position struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

type Event struct {
	Position
	Kind string `json:"kind"`
}

func main() {
	g := GPSTracker{Base: Base{ID: "T-101"}, Sats: 9}
	fmt.Println(g.Label())
	fmt.Println(g.Base.Label())
	// Describe Base metodi: Base.Label chaqiriladi, virtual dispatch yo'q.
	fmt.Println(g.Describe())

	r := &Registry{devices: map[string]string{}}
	r.Lock() // tashqaridan ko'rinadi: bu API sirti
	r.devices["T-1"] = "GPS"
	r.Unlock()

	s := &SafeRegistry{devices: map[string]string{}}
	s.Add("T-2", "DUT")

	ls := loggingStore{Store: &memStore{data: map[string]string{}}}
	_ = ls.Save("T-3")
	v, _ := ls.Load("T-3")
	fmt.Println("Load:", v)

	b, _ := json.Marshal(Event{Position: Position{Lat: 41.31, Lon: 69.28}, Kind: "stop"})
	fmt.Println(string(b))
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
GPS T-101
qurilma T-101
[qurilma T-101]
log: Save T-3
Load: saved
{"lat":41.31,"lon":69.28,"kind":"stop"}
```

Tahlil:

- `g.Label()` `GPS T-101` beradi: `GPSTracker.Label` depth nolda, `Base.Label`ni yopadi. `g.Base.Label()` hamon `qurilma T-101`.
- `g.Describe()` `[qurilma T-101]` beradi, `[GPS T-101]` emas. `Describe` `Base`da e'lon qilingan, receiver `Base`, shuning uchun `Label` chaqiruvi `Base.Label`ga boradi. Bu eng ko'p uchraydigan 'meros' xatosi.
- `Registry`da `r.Lock()` tashqaridan ko'rinadi. `SafeRegistry` mutex'ni `mu` nomli maydon qilib saqlaydi va faqat `Add` metodini chiqaradi. Qulflash protokoli ichkarida qoladi.
- `loggingStore` `Save`ni qayta yozadi, `Load`ni esa embed qilingan `Store`dan oladi. Dekorator uchun bu ixcham yozuv: o'zgartirmoqchi bo'lgan metodni yozasiz, qolganlari avtomatik delegatsiya bo'ladi.
- JSON'da embed qilingan `Position` maydonlari tashqi obyektga yoyiladi (`lat`, `lon`, `kind`). `encoding/json` hujjati: embed qilingan struct maydonlari odatda ichki eksport qilingan maydonlari tashqi struct maydonlari kabi kodlanadi.

Ikkinchi dastur embedding'ning eng yashirin tuzog'ini ko'rsatadi: promote qilingan `MarshalJSON`.

```go
package main

import (
	"encoding/json"
	"fmt"
	"time"
)

type Trip struct {
	time.Time
	DeviceID string `json:"device_id"`
}

func main() {
	t := Trip{Time: time.Date(2026, 11, 3, 8, 0, 0, 0, time.UTC), DeviceID: "T-1"}
	b, err := json.Marshal(t)
	fmt.Println(string(b), err)
}
```

```text
"2026-11-03T08:00:00Z" <nil>
```

`device_id` yo'qoldi. `time.Time` `MarshalJSON` metodiga ega, embedding uni `Trip`ga promote qildi, `Trip` `json.Marshaler`ni implement qiladigan bo'lib qoldi va butun qiymat faqat vaqt sifatida kodlandi. Xato yo'q, ogohlantirish yo'q. Yechim: maydonni nom bilan e'lon qilish (`At time.Time` va `json:"at"` tegi). Umumiy qoida: promote qilingan metod tashqi tipning interface'larga mosligini jimgina o'zgartiradi. `String()` metodi bo'lgan tipni embed qilsangiz, `fmt` tashqi tipni ham shu metod bilan chiqaradi, va shu mexanizm `MarshalJSON` misolida ham ishlaydi.

## Qachon qo'llamaslik kerak

100 Go Mistakes #10 embedding uchun ikkita cheklov qo'yadi, ikkalasi ham amaliy:

- Embedding faqat `Foo.Bar.Baz()` o'rniga `Foo.Baz()` yozish uchun sintaktik shakar bo'lmasligi kerak. Maqsad faqat qisqa yozuv bo'lsa, oddiy nomli maydon ishlating.
- U yashirilishi kerak bo'lgan maydon yoki xatti-harakatni promote qilmasligi kerak. `sync.Mutex`, `*sql.DB`, `time.Time` kabi tiplar bu yerda xavfli: ularning metodlari sizning API'ngizga aylanadi va keyin undan qaytib bo'lmaydi (ochiq API'dan metod olib tashlash buzuvchi o'zgarish).

Qo'shimcha holatlar:

- Begona paket tipini embed qilish: u tipga yangi metod qo'shilsa, sizning tipingizda konflikt yoki kutilmagan promote paydo bo'lishi mumkin (Go 1 compatibility istisnosi).
- 'Bazaviy tip' orqali xatti-harakatni qayta ishlatish: delegatsiya virtual dispatch bermaydi, shuning uchun qayta yozilgan metod bazaviy tip ichidagi chaqiruvlarga ta'sir qilmaydi. Bunday dizaynni interface yoki funksiya maydoni bilan qiling.
- Embedding chuqurligi: ikki-uch pog'onali embedding'da `x.f` qaysi darajadan kelayotganini kodni o'qib topish qiyin. Muallifning bahosi: bir pog'onadan chuqur embedding kamdan-kam oqlanadi.

Embedding yaxshi ishlaydigan joylar: interface'ni embed qilib dekorator yozish (faqat bir-ikki metodni o'zgartirish), kichik interface'lardan kattasini yig'ish (`io.ReadWriter`), va promote qilinadigan metodlar ataylab ochiq API bo'lgan hollar (masalan, mutex'ni qasddan ochiq qilgan ichki yordamchi tip).

## Stack'da: TypeScript bilan farq

TypeScript'da `class B extends A` metodlarni meros qiladi, `super.method()` chaqiriladi, va asosiy sinf ichidagi `this.label()` chaqiruvi pastki sinfdagi qayta yozilgan `label()`ga boradi (virtual dispatch). Go'da bunday emas: embedding kompozitsiyaga sintaktik yengillik, xolos.

Amaliy tavsiyalar:

- NestJS'da `extends BaseService` bilan umumiy CRUD logikasi olinadi. Go'da bunga mos yo'l: umumiy logikani alohida tip yoki funksiya sifatida yozib, nomli maydon yoki parametr orqali ishlatish. Embedding faqat promote qilinadigan metodlar ataylab API bo'lsa.
- HTTP middleware, logging va metrika dekoratorlari uchun embedding yaxshi mos: `type instrumentedStore struct{ Store; hits *counter }` va faqat kerakli metodlarni qayta yozing.
- Embed qilingan tip metodlari yangilanishda o'zgarishi mumkin: begona tiplarni embed qilganda kutubxona yangilanishlarini release notes bilan kuzating. `go vet` va testlar ambiguous selector'ni darhol ushlaydi, lekin promote qilingan `MarshalJSON` kabi jim xatti-harakat o'zgarishini faqat testlar ushlaydi.
- Struct'da mutex bo'lsa, uni nomli eksport qilinmagan maydon qiling, va struct nusxalanmasligi uchun doim pointer orqali uzating.

## Xulosa

- Embedding delegatsiya va metod promote qilish; meros emas. Promote qilingan metodning receiver'i embed qilingan qiymatning o'zi, virtual dispatch yo'q.
- Selector eng sayoz depth'dagi yagona nomni bildiradi: tashqi tip nomni yopishi mumkin, bir xil depth'dagi ikki nom esa faqat ishlatilganda 'ambiguous selector' xatosi beradi.
- Method set qoidasi interface mosligini belgilaydi: embed qilingan `T` bo'lsa pointer receiver'li metodlar faqat `*S` method set'ida.
- Embedding promote qilgan metod API'ning bir qismiga aylanadi va tashqi tipning interface'larga mosligini jimgina o'zgartirishi mumkin (`MarshalJSON` misoli). Yashirilishi kerak narsani (mutex) embed qilmang.
- Embed qilingan interface maydoni nil bo'lsa, promote qilingan metod panic beradi: dekorator konstruktori ichki qiymatni tekshirsin.
