---
n: 37
slug: api-dizayn
title: "API dizayni: functional options, foydali zero value va buzilmaydigan API"
summary: "Eksport qilingan API'ni buzmasdan o'stirish: functional options, foydali zero value, konkret tip qaytarish, interfeysni iste'molchi tomonda e'lon qilish va go1compat istisnolari (keyed literal, yangi metod)."
duration: 40
sources:
  - id: 100go
    note: "#11 (Not using the functional options pattern): yopiq options struct, Option funksiya tipi, builder bilan taqqoslash"
  - id: code-review-comments
    note: "Interfaces (interfeys iste'molchi paketda, implementatsiya konkret tip qaytaradi), Contexts (ctx birinchi parametr, struct maydoni emas), Package Names (util, common kabi ma'nosiz nomlardan qoching)"
  - id: go1compat
    note: "Expectations bo'limidagi 'Struct literals' va 'Methods' bandlari: keyed literal, eksport struct'ga maydon qo'shish, embedding bilan metod to'qnashuvi"
  - id: go-spec
    note: "Comparison operators: struct tiplari barcha maydonlari taqqoslanadigan bo'lsa taqqoslanadi; slice, map va funksiya tiplari taqqoslanmaydi"
  - id: go-faq
    note: "Why is my nil error value not equal to nil? bo'limi: interface ikki qismdan (tip va qiymat) iborat, ikkalasi nil bo'lsagina nil"
  - id: doc-comment
    note: "Deprecated: bilan boshlanadigan paragraf eskirish belgisi, vositalar ogohlantiradi, pkg.go.dev hujjatni yashiradi"
quiz:
  - q: "Kutubxona v1 da `type Point struct{ Lat, Lon float64 }` e'lon qildi. Mijoz kodi `lib.Point{55.75, 37.61}` yozgan. Kutubxona v1.1 da `Alt float64` maydonini qo'shsa nima bo'ladi?"
    options:
      - "Hech narsa, maydon qo'shish doim mos"
      - "Mijoz kodi kompilyatsiya bo'lmaydi: `too few values in struct literal`. `lib.Point{Lat: 1, Lon: 2}` esa kompilyatsiya bo'lishda davom etadi"
      - "Mijoz kodi ishlaydi, Alt tasodifiy qiymat oladi"
      - "Faqat go vet ogohlantiradi, kompilyator jim"
    answer: 1
    explain: "go1compat: unkeyed literal'lar eksport struct'ga maydon qo'shilganda kompilyatsiyadan chiqadi, keyed literal'lar davom etadi. Darsdagi tajribada aynan shu xato chiqdi. Shuning uchun boshqa paket tiplarida keyed notatsiya tavsiya etiladi (go vet ham unkeyed uchun ogohlantiradi)."
  - q: "`func NewServer(addr string, opts ...Option)` ga yangi `WithMaxConns(n)` option qo'shildi. Eski chaqiruvlar `NewServer(\"a\", WithTimeout(d))` nima bo'ladi?"
    options:
      - "Kompilyatsiya xatosi: imzo o'zgardi"
      - "Runtime'da panic"
      - "Ishlashda davom etadi: variadic parametr ro'yxati va qaytish turi o'zgarmadi, yangi option faqat yangi chaqiruvlarda ishlatiladi"
      - "Ishlaydi, lekin yangi option har doim majburiy bo'ladi"
    answer: 2
    explain: "Functional options'ning asosiy foydasi: yangi sozlama qo'shish imzoni o'zgartirmaydi. Positional parametr qo'shish (masalan `NewServer(addr, timeout, retries, maxConns)`) esa barcha chaqiruvchilarni sindiradi."
  - q: "Paket `type Store interface { Get(id string) (Point, bool) }` ni eksport qilgan va mijozlar o'z tiplarini yozgan. Paketga `Delete(id string)` metodi qo'shilsa?"
    options:
      - "Mijoz tiplari avtomatik Delete oladi"
      - "Faqat yangi mijozlar ta'sirlanadi"
      - "Hech qanday ta'sir yo'q, interfeys faqat tavsif"
      - "Mijozning o'z tipi `Store` sifatida ishlatilgan har joyda kompilyatsiya xatosi: `missing method Delete`"
    answer: 3
    explain: "Interfeysga metod qo'shish uni amalga oshiruvchi tashqi tiplarni sindiradi. Shuning uchun paket implementatsiya sifatida konkret tip qaytaradi (yangi metod qo'shish xavfsiz), interfeysni esa iste'molchi o'zi kerakli metodlar bilan e'lon qiladi (Code Review Comments: Interfaces)."
  - q: "`var c Collector; c.Inc(\"x\")` ishlashi uchun `Collector` ichidagi `map` qanday bo'lishi kerak (zero value foydali)?"
    options:
      - "`Inc` ichida `if c.counts == nil { c.counts = make(...) }`, mutex bilan himoyalangan"
      - "map e'lon qilinganda avtomatik yaratiladi"
      - "Konstruktor `NewCollector` majburiy, aks holda panic bo'lishi normal"
      - "map o'rniga global o'zgaruvchi ishlatish"
    answer: 0
    explain: "nil map'ga yozish panic beradi (`assignment to entry in nil map`), o'qish esa ishlaydi. Zero value foydali bo'lishi uchun birinchi yozishda map ni lazy yaratamiz. `sync.Mutex` ham shu g'oya: zero value ochiq holatdagi mutex."
  - q: "Quyidagilardan qaysi biri eksport qilingan API'ni buzmaydi (v1 -> v1.1)?"
    options:
      - "Mavjud funksiyaga yangi majburiy parametr qo'shish"
      - "Eksport qilingan metod nomini o'zgartirish"
      - "`Config` struct'ining nomini o'zgartirish"
      - "Yangi eksport funksiya yoki yangi Option qo'shish"
    answer: 3
    explain: "Yangi nom qo'shish mavjud kodni sindirmaydi (istisno: dot import va embedding bilan nom to'qnashuvi, go1compat bu holatlarga kafolat bermaydi). Mavjud nomning imzosi, nomi yoki xulqini o'zgartirish buzuvchi o'zgarish va v2 (39-dars) talab qiladi."
  - q: "`type Server struct { ctx context.Context; ... }` va `func (s *Server) Handle(req Request)` dizayni haqida Code Review Comments nima deydi?"
    options:
      - "To'g'ri: ctx struct'da saqlansa qulay"
      - "Context struct maydoni bo'lmasin; kerak bo'lgan har metod `ctx context.Context` ni birinchi parametr sifatida olsin (standart kutubxona interfeysiga mos kelishi shart bo'lgan metodlar bundan mustasno)"
      - "Context faqat global o'zgaruvchida bo'lsin"
      - "Context faqat goroutine'lar uchun kerak"
    answer: 1
    explain: "Code Review Comments (Contexts): struct tipiga Context a'zosi qo'shmang, har metodga ctx parametr qo'shing. Struct'dagi ctx so'rov umri bilan server umrini aralashtiradi (34-dars)."
task:
  title: "Client uchun functional options va Registry uchun foydali zero value"
  prompt: |
    `Client` hozir faqat `addr` oladi; sozlamalar (timeout, retries, secure) yo'q. `Option`, `WithTimeout`, `WithRetries`, `WithSecure` va `NewClient` stub holatda. Bundan tashqari `Registry` zero value holatida `Add` chaqirilsa nil map sababli panic qiladi.

    Bajaring:
    - `NewClient` standart qiymatlar bilan yaratsin: timeout 5 soniya, retries 3, secure false; `opts` ni ketma-ket qo'llasin, birinchi xatoda `nil, err` qaytarsin.
    - `WithTimeout(d)`: `d <= 0` bo'lsa xato, `WithRetries(n)`: `n < 0` bo'lsa xato. Ikkalasi ham `ErrInvalidOption` ni `%w` bilan o'rasin. `WithSecure()` xatosiz `secure = true` qo'ysin.
    - `Registry.Add` zero value holatida ishlasin (map ni birinchi yozishda yarating, mutex ichida).
    - `main`ni o'zgartirmang. Kutilgan chiqish: `standart: 5s 3 false <nil>`, `sozlangan: 2s 3 true <nil>`, `xato: true true`, `registry: 1`.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
        "sync"
        "time"
    )

    var ErrInvalidOption = errors.New("noto'g'ri option")

    type Client struct {
        addr    string
        timeout time.Duration
        retries int
        secure  bool
    }

    type Option func(*Client) error

    // TODO: quyidagi uchta option va NewClient to'liq yozilsin.
    func WithTimeout(d time.Duration) Option { return nil }
    func WithRetries(n int) Option           { return nil }
    func WithSecure() Option                 { return nil }

    func NewClient(addr string, opts ...Option) (*Client, error) {
        return &Client{addr: addr}, nil
    }

    type Registry struct {
        mu      sync.Mutex
        devices map[string]string
    }

    func (r *Registry) Add(id, name string) {
        r.mu.Lock()
        defer r.mu.Unlock()
        r.devices[id] = name
    }

    func (r *Registry) Len() int {
        r.mu.Lock()
        defer r.mu.Unlock()
        return len(r.devices)
    }

    func main() {
        c, err := NewClient("api.local")
        fmt.Println("standart:", c.timeout, c.retries, c.secure, err)
        c, err = NewClient("api.local", WithTimeout(2*time.Second), WithSecure())
        fmt.Println("sozlangan:", c.timeout, c.retries, c.secure, err)
        _, err = NewClient("api.local", WithRetries(-1))
        fmt.Println("xato:", err != nil, errors.Is(err, ErrInvalidOption))

        var r Registry
        r.Add("d1", "truck-1")
        fmt.Println("registry:", r.Len())
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
        "sync"
        "time"
    )

    var ErrInvalidOption = errors.New("noto'g'ri option")

    type Client struct {
        addr    string
        timeout time.Duration
        retries int
        secure  bool
    }

    type Option func(*Client) error

    func WithTimeout(d time.Duration) Option {
        return func(c *Client) error {
            if d <= 0 {
                return fmt.Errorf("%w: timeout %v", ErrInvalidOption, d)
            }
            c.timeout = d
            return nil
        }
    }

    func WithRetries(n int) Option {
        return func(c *Client) error {
            if n < 0 {
                return fmt.Errorf("%w: retries %d", ErrInvalidOption, n)
            }
            c.retries = n
            return nil
        }
    }

    func WithSecure() Option {
        return func(c *Client) error {
            c.secure = true
            return nil
        }
    }

    func NewClient(addr string, opts ...Option) (*Client, error) {
        c := &Client{addr: addr, timeout: 5 * time.Second, retries: 3}
        for _, opt := range opts {
            if err := opt(c); err != nil {
                return nil, err
            }
        }
        return c, nil
    }

    type Registry struct {
        mu      sync.Mutex
        devices map[string]string
    }

    func (r *Registry) Add(id, name string) {
        r.mu.Lock()
        defer r.mu.Unlock()
        if r.devices == nil {
            r.devices = make(map[string]string)
        }
        r.devices[id] = name
    }

    func (r *Registry) Len() int {
        r.mu.Lock()
        defer r.mu.Unlock()
        return len(r.devices)
    }

    func main() {
        c, err := NewClient("api.local")
        fmt.Println("standart:", c.timeout, c.retries, c.secure, err)
        c, err = NewClient("api.local", WithTimeout(2*time.Second), WithSecure())
        fmt.Println("sozlangan:", c.timeout, c.retries, c.secure, err)
        _, err = NewClient("api.local", WithRetries(-1))
        fmt.Println("xato:", err != nil, errors.Is(err, ErrInvalidOption))

        var r Registry
        r.Add("d1", "truck-1")
        fmt.Println("registry:", r.Len())
    }
  solutionNotes: |
    - Option `func(*Client) error` ko'rinishida: validatsiya konstruktor ichida bajariladi va birinchi xatoda to'xtaydi. Standart qiymatlar `NewClient` ichida bir joyda, shuning uchun yangi option qo'shish imzoni o'zgartirmaydi.
    - Xatolar `fmt.Errorf("%w: ...", ErrInvalidOption)` bilan o'raladi: chaqiruvchi `errors.Is` bilan ajratadi (31-dars).
    - `Client` maydonlari yopiq (kichik harf): sozlama faqat Option orqali o'zgaradi, shuning uchun keyin maydon qo'shish ham xavfsiz.
    - `Registry`da map `Add` ichida mutex ostida yaratiladi: `var r Registry` darhol tayyor, konstruktor kerak emas. `Len` nil map uchun ham to'g'ri ishlaydi (nil map'dan o'qish va `len` xavfsiz).
    - Real kutubxonada nol qiymat va "o'rnatilmagan" farq qilishi kerak bo'lsa (masalan retries 0 ruxsat etilgan), `*int` yoki alohida bayroq kerak; 100 Go Mistakes #11 misoli shu sababli `*int` ishlatadi.
  checklist:
    - "`NewClient` standart qiymatlar bilan yaratadi va option'larni qo'llaydi"
    - "Noto'g'ri qiymatlar `ErrInvalidOption` ni o'rab qaytariladi (`errors.Is` true)"
    - "`Registry` zero value holatida panic qilmaydi"
    - "`main` o'zgarmagan, chiqish kutilgan to'rt qatorga mos"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Ichki servisda API o'zgartirish oson: bir repo, bir PR, kompilyator hamma chaqiruvchini ko'rsatadi. Eksport qilingan API boshqacha. Boshqa jamoa yoki boshqa repo sizning paketingizdan foydalansa, har o'zgarish uning kodini sindirishi mumkin. Telemetriya platformasida `fleet` kutubxonasini o'nlab servislar import qiladi: `NewClient(addr, timeout, retries, secure)` ga beshinchi parametr qo'shsangiz, hammasi bir vaqtda kompilyatsiyadan chiqadi.

Bu muammoning ikki yuzi bor. Birinchisi: o'sishga tayyor bo'lmagan API. Positional parametrlar, `bool` bayroqlar (`NewClient(addr, 0, 0, true)`: nima bu `true`?), konstruktor chaqirilmasa panic qiladigan tiplar. Ikkinchisi: tasodifiy buzuvchi o'zgarishlar. Struct'ga maydon qo'shish, interfeysga metod qo'shish, qaytish turini o'zgartirish ko'rinishida zararsiz tuyuladi, lekin mijoz kodini sindiradi.

Node.js bilan farq: TypeScript'da ixtiyoriy parametrlar `{ timeout?: number }` ob'ekti bilan beriladi va yangi maydon qo'shish mos keladi. Go'da ixtiyoriy nomli parametr yo'q, funksiya overload yo'q, shuning uchun jamoa bir necha naqsh ishlab chiqqan.

## Asosiy g'oya

Dizayn qoidalari to'rtta savolga qaytadi: yangi imkoniyatni imzoni o'zgartirmasdan qo'shsam bo'ladimi, nol qiymat ishlaydimi, mijoz nimaga bog'lanib qoladi, qaysi o'zgarish buzuvchi.

**Functional options.** 100 Go Mistakes #11 naqshni shunday tasvirlaydi: yopiq (eksport qilinmagan) `options` struct sozlamalarni ushlaydi, har bir option shu struct'ni o'zgartiradigan funksiya, konstruktor esa variadic `opts ...Option` oladi. Kitob builder naqshi ham ishlashini, lekin kichik kamchiliklari bor deydi: bo'sh bo'lishi mumkin bo'lgan config struct'ni uzatish kerak va xatolarni boshqarish noqulayroq. Shu sababli Go'da bu muammo uchun functional options idiomatik hisoblanadi. Darsda biz bir oz soddalashtirilgan variantni ishlatamiz: option to'g'ridan-to'g'ri eksport qilinmagan maydonlari bor tipni o'zgartiradi va xato qaytarishi mumkin.

Asosiy foyda: yangi `WithMaxConns(n)` qo'shish `NewServer` imzosini o'zgartirmaydi, shuning uchun eski chaqiruvlar ishlashda davom etadi. Standart qiymatlar bir joyda (konstruktorda), validatsiya ham.

**Foydali zero value.** Go'da har tip nol qiymat bilan boshlanadi. Tip shunday yozilsa, `var c Collector` darhol ishlaydi, konstruktor, `Init()` va "avval chaqiring" qoidalari kerak bo'lmaydi. `sync.Mutex` shunday: nol qiymati ochiq mutex. Mijoz uchun bu API sirtini kichraytiradi, siz uchun esa xato manbasini yo'qotadi (konstruktorni unutish).

**Konkret tip qaytaring, interfeysni iste'molchi e'lon qilsin.** Code Review Comments (Interfaces bo'limi): interfeyslar odatda ularni ishlatadigan paketga tegishli, amalga oshiruvchi paket esa konkret (ko'pincha pointer yoki struct) tip qaytaradi, shunda implementatsiyaga yangi metodlar kengaytirilgan refaktoringsiz qo'shiladi. Shuningdek "mocking uchun" implementator tomonda interfeys e'lon qilmang va interfeysni ishlatilishidan oldin e'lon qilmang. Shu qoida API evolyutsiyasining ham asosi: konkret tipga metod qo'shish xavfsiz, eksport qilingan interfeysga metod qo'shish esa tashqi implementatorlarni sindiradi.

**Context birinchi parametr.** Code Review Comments (Contexts): `ctx context.Context` odatda birinchi parametr, struct maydoni emas, istisno faqat standart yoki uchinchi tomon interfeysiga imzo mos kelishi shart bo'lgan metodlar. Context haqida batafsil 34-darsda.

**Paket va nom.** Code Review Comments (Package Names) paket nomiga qaramasdan o'qiladigan nomlarni so'raydi (`chubby.File`, `chubby.ChubbyFile` emas) va `util`, `common`, `misc`, `api`, `types`, `interfaces` kabi ma'nosiz paket nomlaridan qochishni tavsiya qiladi.

## Chuqurroq: nima buzadi, nima buzmaydi

Rasmiy kafolat go1compat hujjatida: Go 1 dasturlari keyingi Go 1.x versiyalarida kompilyatsiya bo'lib ishlashda davom etadi, lekin hujjat aniq istisnolarni sanaydi. Ikkitasi to'g'ridan-to'g'ri sizning kutubxonangiz dizayniga tegishli (hujjat standart kutubxona haqida, lekin mantiq har eksport qilinadigan paketga mos keladi):

- **Struct literal'lar.** Eksport qilingan struct'ga maydon qo'shilishi mumkin. Boshqa paket tipidan `pkg.T{3, "x"}` (unkeyed) yozgan kod bundan keyin kompilyatsiya bo'lmaydi, keyed `pkg.T{A: 3, B: "x"}` ishlashda davom etadi. Hujjat boshqa paket tipidagi composite literal'lar uchun keyed notatsiyani tavsiya qiladi. Kutubxona egasi sifatida siz mijozlarni majbur qila olmaysiz, shuning uchun struct'ni unkeyed ishlatish imkonini bermaslik uchun ichiga yopiq maydon qo'shish yoki umuman yopiq struct + konstruktor/option beriladi (bu mening tavsiyam, hujjatda yozilmagan).
- **Metodlar.** Konkret tipga metod qo'shish odatda xavfsiz. Istisno: tip boshqa tip bilan birga embedding qilingan bo'lsa, yangi metod o'sha tipning metodi bilan to'qnashib, struct'ni sindirishi mumkin. Hujjat bu kam uchraydigan holatga kafolat bermasligini aytadi.

Interfeysga metod qo'shish go1compat'da alohida sanalmagan, lekin natijasini aniq ko'rish mumkin. Quyidagi tajribada kutubxona v1 va v2 ko'rinishlari va bitta mijoz bor.

```go
package lib

// Point v1: ikki maydon.
type Point struct {
	Lat, Lon float64
}

// Store v1: bitta metod.
type Store interface {
	Get(id string) (Point, bool)
}
```

```go
package lib

// Point v2: Alt maydoni qo'shildi.
type Point struct {
	Lat, Lon float64
	Alt      float64
}

// Store v2: Delete qo'shildi.
type Store interface {
	Get(id string) (Point, bool)
	Delete(id string)
}
```

Mijoz kodi:

```go
package main

import (
	"fmt"

	"m/lib"
)

type memStore map[string]lib.Point

func (m memStore) Get(id string) (lib.Point, bool) { p, ok := m[id]; return p, ok }

func main() {
	var s lib.Store = memStore{"t1": lib.Point{55.75, 37.61}}
	p, _ := s.Get("t1")
	keyed := lib.Point{Lat: 1, Lon: 2}
	fmt.Println(p, keyed)
}
```

v1 bilan mijoz ishlaydi (Go 1.24.7):

```text
{55.75 37.61} {1 2}
```

Lekin `go vet` unkeyed literal haqida ogohlantiradi: `m/lib.Point struct literal uses unkeyed fields`. Kutubxona v2 ga almashtirilsa, `go build` ikki xato beradi:

```text
./main.go:14:20: cannot use memStore{…} (value of map type memStore) as lib.Store value in variable declaration: memStore does not implement lib.Store (missing method Delete)
./main.go:14:57: too few values in struct literal of type lib.Point
```

Ikkala o'zgarish ham (maydon va metod qo'shish) kutubxona ichida "faqat qo'shish" edi, lekin mijoz uchun buzuvchi. Aynan shu sababli konkret tip qaytarish va interfeysni iste'molchi tomonda e'lon qilish tavsiya etiladi: mijoz o'z interfeysini kerakli metodlar bilan yozadi (`Get` xolos), sizning yangi `Delete` metodingiz uni sindirmaydi.

### Buzmaydigan va buzadigan o'zgarishlar

Odatda xavfsiz: yangi eksport funksiya, tip, o'zgaruvchi qo'shish; yangi Option qo'shish; konkret tipga yangi metod qo'shish (embedding istisnosi bilan); xatolarga yangi tafsilot qo'shish (yangi sentinel).

Buzuvchi: mavjud eksport nomni o'chirish yoki o'zgartirish; funksiya imzosiga parametr qo'shish yoki qaytish turini o'zgartirish; eksport qilingan interfeysga metod qo'shish; xulqni o'zgartirish (masalan, avval `nil` qaytargan joyda xato qaytarish: mijoz `err == nil` ga tayangan bo'lishi mumkin). Buzuvchi o'zgarish kerak bo'lsa, major versiya (`/v2` yo'li) kerak, bu 39-darsda.

### Ko'rinmas buzilishlar: taqqoslanuvchanlik va generic parametr

Yuqoridagi ro'yxatda yo'q, lekin mijozni sindiradigan ikki o'zgarish bor, ikkalasi ham spetsifikatsiyadan chiqadi. Birinchisi: struct faqat barcha maydon tiplari taqqoslanadigan bo'lsa taqqoslanadi (slice, map va funksiya tiplari taqqoslanmaydi). v1 da `Point{Lat, Lon float64}` taqqoslanadi, mijoz uni `==` bilan solishtiradi va map kaliti qiladi. v2 da unga `Tags []string` qo'shsangiz, struct taqqoslanmaydigan bo'ladi. Mijozning bitta qatorini ham o'zgartirmagan "faqat maydon qo'shish" kompilyatsiyadan chiqadi. Ikkinchisi: mavjud tipga tip parametri qo'shish (`Box` o'rniga `Box[T any]`) har bir eski ishlatilishni sindiradi, chunki generic tip instansiyalashsiz ishlatilmaydi. Yuqoridagi `lib` paketini shunday o'zgartirib, mijozni Go 1.24.7 da kompilyatsiya qilganda uchta xato chiqdi:

```text
cmd/main.go:10:14: invalid map key type lib.Point
cmd/main.go:13:14: invalid operation: a == lib.Point{…} (struct containing []string cannot be compared)
cmd/main.go:14:8: cannot use generic type lib.Box[T any] without instantiation
```

Qaysi tipning taqqoslanuvchanligi kafolat ekanini avvaldan hal qiling. Agar tip taqqoslanishini va map kaliti bo'lishini va'da qilmasangiz, buni dastlabdan to'sib qo'yish mumkin: struct'ga `_ [0]func()` kabi nolinchi o'lchamli taqqoslanmaydigan maydon qo'shiladi, shunda `a == b` birinchi kundan kompilyatsiya bo'lmaydi va keyinchalik slice qo'shish hech kimni sindirmaydi.

```go
package main

import "fmt"

// Config uzoq muddatli kutubxona tipi: taqqoslash va'dasi berilmagan.
type Config struct {
	_    [0]func() // struct'ni taqqoslanmaydigan qiladi
	Addr string
}

func main() {
	a := Config{Addr: "x"}
	b := Config{Addr: "x"}
	fmt.Println(a.Addr == b.Addr)
	fmt.Println(a == b)
}
```

```text
./main.go:15:14: invalid operation: a == b (struct containing [0]func() cannot be compared)
```

Bu mening tavsiyam, rasmiy qoida emas, va narxi bor: mijoz bunday tipni `==` bilan solishtira olmaydi (testda `reflect.DeepEqual` yoki maydonma-maydon solishtirish kerak), maydon solishtirishi esa ishlayveradi (misolda birinchi `Println` shuni ko'rsatadi). Faqat chindan ham "qiymat identifikatori" bo'lmagan, sozlamaga o'xshash tiplarda ishlating. `Point` kabi qiymat tiplari uchun taqqoslanuvchanlik odatda foydali xususiyat va uni saqlash kerak.

### Qaytariladigan xato tipi va nil interface

Konkret tip qaytarish qoidasining bitta muhim istisnosi bor: xato. Funksiya `*ValidationError` kabi konkret pointer tipini `error` interface sifatida qaytarsa, "xato yo'q" holatini ham nil pointer sifatida qaytarish xavfi tug'iladi. Go FAQ'ning "Why is my nil error value not equal to nil?" bo'limi sababini aytadi: interface qiymati ikki qismdan iborat, tip `T` va qiymat `V`, va interface faqat ikkalasi ham nil bo'lganda nil bo'ladi. Nil `*ValidationError` ni `error` ga o'rasangiz, tip `T=*ValidationError`, qiymat `V=nil`, ya'ni interface nil emas, va mijozning `if err != nil` tekshiruvi yolg'on xato topadi.

```go
package main

import (
	"errors"
	"fmt"
)

// ValidationError eksport qilingan konkret xato tipi.
type ValidationError struct{ Field string }

func (e *ValidationError) Error() string { return "noto'g'ri maydon: " + e.Field }

// validateBad konkret pointer tipini qaytaradi va uni error sifatida e'lon qiladi.
func validateBad(fuel float64) error {
	var err *ValidationError
	if fuel < 0 {
		err = &ValidationError{Field: "fuel"}
	}
	return err // nil pointer, lekin nil bo'lmagan interface
}

// validateGood faqat aniq nil yoki aniq xatoni qaytaradi.
func validateGood(fuel float64) error {
	if fuel < 0 {
		return &ValidationError{Field: "fuel"}
	}
	return nil
}

func main() {
	err := validateBad(10)
	fmt.Println("validateBad(10) == nil:", err == nil)
	fmt.Printf("%T %v\n", err, err == (*ValidationError)(nil))
	var ve *ValidationError
	fmt.Println("errors.As:", errors.As(err, &ve), ve == nil)

	err = validateGood(10)
	fmt.Println("validateGood(10) == nil:", err == nil)
}
```

```text
validateBad(10) == nil: false
*main.ValidationError true
errors.As: true true
validateGood(10) == nil: true
```

`validateBad(10)` xato yo'q holatda ham nil bo'lmagan `error` qaytardi: dinamik tipi `*main.ValidationError`, qiymati nil pointer (ikkinchi qator). `errors.As` ham `true` qaytardi va `ve == nil`: mijoz kodi `err.Error()` ni chaqirsa, bu misolda metod `e.Field` ga murojaat qiladi va nil pointer dereference panic'i bo'ladi (alohida testda tasdiqlandi). API qoidasi: xato qaytaradigan eksport funksiyalar imzosida `error` bo'lsin (konkret xato tipi emas), "xato yo'q" yo'li esa literal `return nil` bo'lsin, o'zgaruvchi orqali emas. Konkret xato tipini mijoz `errors.As` bilan oladi (31-dars). Bu `go vet` ushlamaydigan xato: `go vet` bu faylda ogohlantirish bermadi.

### Eskirtirish: buzmasdan olib tashlash

Nomni darhol o'chirish buzuvchi o'zgarish, shuning uchun yo'l ikki bosqichli: avval eskirgan deb belgilash, keyin major versiyada olib tashlash. Go doc comment qo'llanmasi (Go Doc Comments) `Deprecated:` bilan boshlanadigan paragrafni eskirish belgisi deb hisoblaydi: ba'zi vositalar eskirgan identifikator ishlatilganda ogohlantiradi, pkg.go.dev esa eskirgan nomlarning hujjatini sukut bo'yicha yashiradi. Belgidan keyin nega eskirgani va nima ishlatish kerakligi yoziladi; paragraf doc comment'ning oxirgisi bo'lishi shart emas. Amaliy qoida: yangi `WithTimeout` option'ini qo'shgach, eski `NewServerWithTimeout(addr, timeout)` konstruktorini o'chirmay, uning doc comment'iga `Deprecated: WithTimeout option'li NewServer ishlating.` qatorini qo'shing va eski funksiyani yangisi orqali amalga oshiring. Eskirtirilgan nom 39-darsda ko'riladigan `/v2` da olib tashlanadi.

### Zero value va lazy init

`nil` map'ga yozish panic beradi (`assignment to entry in nil map`), o'qish va `len` esa ishlaydi. Zero value foydali bo'lishi uchun tip birinchi yozishda map'ni yaratadi. Bu goroutine'lar bir vaqtda chaqirishi mumkin bo'lgan tipda mutex ostida bo'lishi kerak: tekshiruv va yaratish bir kritik bo'limda. Tip nusxalanmasligi kerak (`sync.Mutex` ni o'z ichiga olgan struct'ni qiymat bo'yicha uzatmang, `go vet` copylocks bunga ogohlantiradi); bu `go vet` ning mavjud tekshiruvi.

Agar nol qiymat foydali bo'la olmasa (masalan, bog'lanish manzili majburiy), buni hujjatda yozing va konstruktor ichida validatsiya qiling. Foydali zero value qoida, qonun emas.

### Option dizaynining nozik joylari

- Nol qiymat va "o'rnatilmagan" farqi: `WithRetries(0)` retry o'chirishni bildirsa, `int` maydon yetmaydi. 100 Go Mistakes #11 misoli shu sababli `*int` ishlatadi.
- Option tartibi: ketma-ket qo'llanadi, oxirgisi yutadi. Bog'liq option'lar (masalan, `WithSecure` va `WithCertFile`) o'zaro tekshiruvni option'larning o'zida emas, konstruktorda, hammasi qo'llangandan keyin bajarishi kerak.
- Xato qaytaradigan option: `Option func(*T) error` validatsiyani bir joyga yig'adi, `NewServer` birinchi xatoda to'xtaydi. Xatoni sentinel bilan o'rang, chaqiruvchi ajratsin (31-dars).

## Misol: options, foydali zero value va validatsiya

```go
package main

import (
	"errors"
	"fmt"
	"sort"
	"sync"
	"time"
)

// Collector: zero value tayyor. Konstruktor ham, Init ham kerak emas.
type Collector struct {
	mu     sync.Mutex
	counts map[string]int
}

func (c *Collector) Inc(sensor string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if c.counts == nil {
		c.counts = make(map[string]int)
	}
	c.counts[sensor]++
}

func (c *Collector) Snapshot() map[string]int {
	c.mu.Lock()
	defer c.mu.Unlock()
	out := make(map[string]int, len(c.counts))
	for k, v := range c.counts {
		out[k] = v
	}
	return out
}

var ErrInvalidOption = errors.New("noto'g'ri option")

// Server sozlamalari yopiq: tashqaridan faqat Option orqali o'zgaradi.
type Server struct {
	addr    string
	timeout time.Duration
	retries int
}

type Option func(*Server) error

func WithTimeout(d time.Duration) Option {
	return func(s *Server) error {
		if d <= 0 {
			return fmt.Errorf("%w: timeout %v", ErrInvalidOption, d)
		}
		s.timeout = d
		return nil
	}
}

func WithRetries(n int) Option {
	return func(s *Server) error {
		if n < 0 {
			return fmt.Errorf("%w: retries %d", ErrInvalidOption, n)
		}
		s.retries = n
		return nil
	}
}

func NewServer(addr string, opts ...Option) (*Server, error) {
	s := &Server{addr: addr, timeout: 5 * time.Second, retries: 3}
	for _, opt := range opts {
		if err := opt(s); err != nil {
			return nil, err
		}
	}
	return s, nil
}

func main() {
	var c Collector // konstruktorsiz ishlaydi
	c.Inc("fuel-1")
	c.Inc("fuel-1")
	c.Inc("gps-7")
	snap := c.Snapshot()
	keys := make([]string, 0, len(snap))
	for k := range snap {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	for _, k := range keys {
		fmt.Println(k, snap[k])
	}

	s, err := NewServer("api.local")
	fmt.Println(s.timeout, s.retries, err)
	s, err = NewServer("api.local", WithTimeout(2*time.Second), WithRetries(0))
	fmt.Println(s.timeout, s.retries, err)
	_, err = NewServer("api.local", WithTimeout(-time.Second))
	fmt.Println(err, errors.Is(err, ErrInvalidOption))
}
```

```text
fuel-1 2
gps-7 1
5s 3 <nil>
2s 0 <nil>
noto'g'ri option: timeout -1s true
```

`Collector` konstruktorsiz ishlaydi: `Inc` ichida map birinchi chaqiruvda yaratiladi, `Snapshot` esa ichki map'ni emas, nusxasini qaytaradi (ichki holat tashqariga chiqmaydi). `Server` maydonlari yopiq, standart qiymatlar `NewServer` da. `WithTimeout(-time.Second)` xatosi `ErrInvalidOption` ni o'raydi, `errors.Is` uni topadi.

## Qachon qo'llamaslik kerak

- Ikki-uch sozlama va ichki paket uchun functional options ortiqcha. Oddiy `Config` struct (keyed literal bilan) o'qish uchun osonroq va IDE'da maydonlar ko'rinadi. Option'lar esa har chaqiruvda closure ajratadi va hujjatda alohida funksiyalar sifatida tarqoq turadi.
- Barcha sozlamalar majburiy bo'lsa, option emas, oddiy parametrlar. Option'lar ixtiyoriy sozlamalar uchun.
- Zero value'ni foydali qilish uchun tipni murakkablashtirmang: ulanish, fayl, goroutine boshqaruvchi tiplar ko'pincha konstruktor talab qiladi. Bunday tip uchun `New...` va `Close` aniq shartnoma.
- Hamma narsa uchun interfeys e'lon qilmang. Faqat iste'molchi tomonda, haqiqiy foydalanish bo'lganda.
- API'ni "ehtiyot shart" ortiqcha eksport qilmang: eksport qilingan har nom keyinchalik kafolat. Ichki yordamchilar uchun `internal` katalogi (38-dars).

## Stack'da: Node.js/TypeScript bilan solishtirish

- TypeScript `{ timeout?: number, retries?: number }` ob'ekti Go'da keyed literal bilan `Config` struct'iga to'g'ri keladi. Ob'ektda o'rnatilmagan maydon `undefined`, Go'da esa nol qiymat: `0`, `""`, `false`. Shuning uchun "0 ham haqiqiy qiymat" bo'lsa, pointer yoki option kerak.
- TypeScript'da interfeysga ixtiyoriy maydon qo'shish mos keladi; Go'da eksport qilingan interfeysga metod qo'shish implementatorlarni sindiradi. Shu sababli Go jamoalari kichik interfeyslar (1-3 metod) yozadi va ularni iste'molchi tomonda e'lon qiladi.
- NestJS'da DI konteyner konstruktorni to'ldiradi; Go'da `New...(deps, opts...)` ni `main` qo'lda chaqiradi. Bog'liqliklar majburiy parametrlar, sozlamalar esa option'lar.
- `semver` Node.js'da ham, Go'da ham qo'llanadi, lekin Go'da major versiya import yo'lida ko'rinadi (`/v2`), shuning uchun buzuvchi o'zgarish yashirin qolmaydi (39-dars).

## Xulosa

- Ixtiyoriy sozlamalar uchun functional options (yoki keyed config struct) ishlating: yangi sozlama imzoni o'zgartirmaydi (100 Go Mistakes #11).
- Tipning nol qiymati ishlaydigan qilib yozing (lazy init, mutex ostida); bo'lmasa, konstruktor shartnomasini hujjatlang.
- Paket konkret tip qaytarsin, interfeysni iste'molchi o'zi kerakli metodlari bilan e'lon qilsin (Code Review Comments: Interfaces).
- Eksport struct'ga maydon qo'shish unkeyed literal'larni, eksport interfeysga metod qo'shish tashqi implementatorlarni sindiradi: bu o'zgarishlarni buzuvchi deb hisoblang.
- `ctx` birinchi parametr, struct maydoni emas; bool bayroq o'rniga nomlangan option.
- Taqqoslanuvchanlik va tip parametri ham API'ning bir qismi: struct'ga slice qo'shish `==` va map kalitini, tipga `[T any]` qo'shish esa eski ishlatilishlarni sindiradi. Xato qaytarganda `error` interface va literal `return nil` ishlating, olib tashlanadigan nomni avval `Deprecated:` bilan belgilang.
