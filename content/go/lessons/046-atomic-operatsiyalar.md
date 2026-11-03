---
n: 46
slug: atomic-operatsiyalar
title: "sync/atomic: typed atomic, CAS va lock-free chegaralari"
summary: "sync/atomic'ning tipli API'si (Int64, Bool, Pointer[T], Value), ketma-ket izchillik kafolati, compare-and-swap tsikli, o'zgarmas snapshot bilan konfiguratsiyani almashtirish, ABA va ko'p o'zgaruvchili invariantlar chegarasi."
duration: 40
sources:
  - id: pkg-atomic
    note: "Package overview (past darajali vosita ogohlantirishi, synchronizes-before va ketma-ket izchil tartib), funksiya hujjatlari (tipli atomic tavsiyasi, And/Or), Value tipi qoidalari va Bugs bo'limi (64-bit alignment eslatmasi)"
  - id: go-mem
    note: "Atomic Values bo'limi va data race ta'rifi: atomic amallar race hisoblanmaydi, ular synchronized-before munosabatini yaratadi"
  - id: 100go
    note: "Concurrency boblari: #57 (kanal yoki mutex tanlovi) va #58 (data race va race condition)"
quiz:
  - q: "Bitta goroutine `atomic.AddInt64(&n, 1)` chaqiradi, boshqasi sinxronlashsiz `fmt.Println(n)` bilan o'qiydi. Xotira modeli ma'nosida bu nima?"
    options:
      - "Xavfsiz: n int64, o'qish hamisha atomic"
      - "Xavfsiz, chunki yozuvchi atomic ishlatgan"
      - "Data race: race bo'lmasligi uchun barcha kirishlar atomic bo'lishi kerak"
      - "Faqat 32-bit platformada race"
    answer: 2
    explain: "Ta'rifga ko'ra atomic istisno faqat barcha ishtirokchi kirishlar atomic bo'lsagina ishlaydi. Bitta oddiy o'qish yetarli: u atomic yozuv bilan bir vaqtda sodir bo'ladi va race hisoblanadi."
  - q: "GPS nuqtasining `lat` va `lon` qiymatlari ikkita alohida atomic o'zgaruvchida (masalan, float bitlari sifatida `atomic.Uint64` larda) saqlanadi. Yozuvchi ularni ketma-ket yangilaydi. O'quvchi nimani ko'rishi mumkin?"
    options:
      - "Eski lat va yangi lon: har biri atomic, lekin juftlik atomic emas"
      - "Faqat to'liq eski yoki to'liq yangi juftlik"
      - "Yarim yozilgan lat qiymati"
      - "Atomic'lar avtomatik guruhlanadi, shuning uchun izchillik kafolatlanadi"
    answer: 0
    explain: "Har bir atomic amal alohida. Ikki o'zgaruvchi orasidagi izchillikni atomic bermaydi. Yechim: juftlikni bitta o'zgarmas struct'ga solib, atomic.Pointer bilan almashtirish, yoki mutex."
  - q: "CAS tsiklida `CompareAndSwap(old, next)` false qaytardi. To'g'ri keyingi qadam qaysi?"
    options:
      - "Xato deb qaytish"
      - "Tsiklni to'xtatib, Store(next) bilan majburan yozish"
      - "time.Sleep qilib o'sha CompareAndSwap'ni takrorlash"
      - "Joriy qiymatni qayta Load qilib, next ni yangidan hisoblab, qayta urinish"
    answer: 3
    explain: "false boshqa goroutine qiymatni o'zgartirganini bildiradi. Eski old bilan hisoblangan next yaroqsiz: yangi qiymatni o'qib, qayta hisoblash kerak. Store bilan majburlash boshqa yozuvchining yangilanishini yo'qotadi."
  - q: "Go atomic'lari qanday xotira tartibini beradi?"
    options:
      - "Relaxed, acquire va release rejimlarini tanlash mumkin"
      - "Faqat ketma-ket izchil (sequentially consistent) tartib: boshqa rejim yo'q"
      - "Faqat acquire/release"
      - "Tartib platformaga qarab o'zgaradi va hujjatlashtirilmagan"
    answer: 1
    explain: "Hujjat va xotira modeli: barcha atomic amallar ketma-ket izchil tartibda bajarilgandek. Bu C++ seq_cst va Java volatile bilan bir xil semantika. Zaifroq rejimlar yo'q, shuning uchun model sodda."
  - q: "Servisda konfiguratsiyani almashtiruvchi `Reload` metodi `old := p.Load(); next := ...; p.Store(next)` yozadi va uni ikki goroutine bir vaqtda chaqirishi mumkin. Muammo nima va to'g'ri yechim qaysi?"
    options:
      - "Muammo yo'q: Load va Store alohida atomic, shuning uchun ketma-ketlik ham atomic"
      - "Muammo: Store faqat bitta goroutine'dan ruxsat etiladi"
      - "Yangilanish yo'qolishi mumkin (lost update); CAS tsikli yoki mutex bilan yangilash kerak"
      - "Muammo: atomic.Pointer faqat o'zgarmas tiplarni saqlaydi"
    answer: 2
    explain: "Ikki Reload ham bir xil old ni o'qib, har biri o'z next ini yozadi: biri ikkinchisining ishini bosib ketadi. Load-hisobla-Store ketma-ketligi atomic emas. CAS tsikli eskirgan old ni aniqlaydi va qayta urinadi."
  - q: "Quyidagi holatlardan qaysi birida atomic emas, mutex tanlash to'g'riroq?"
    options:
      - "Alohida o'sib boruvchi so'rovlar hisoblagichi"
      - "Servis to'xtatilayotganini bildiruvchi bayroq"
      - "Konfiguratsiyaning to'liq snapshot'ini almashtirish"
      - "Bir nechta maydonning o'zaro izchilligi shart bo'lgan struct'ni o'qish va yangilash"
    answer: 3
    explain: "Hisoblagich va bayroq atomic'ning ideal ishlatilishi, snapshot almashtirish atomic.Pointer bilan mumkin. Bir necha maydonning invarianti birga o'zgarishi kerak bo'lsa va snapshot usuli noqulay bo'lsa, mutex sodda va ishonchli."
task:
  title: "Plain hisoblagich va pointer'ni atomic'ga o'tkazish"
  prompt: |
    `Gateway` telemetriya paketlarini qabul qiladi yoki rad etadi. U ikkita hisoblagich (`accepted`, `rejected`) va ish vaqtida almashtiriladigan chegara (`limits`, o'zgarmas struct'ga pointer) saqlaydi. 8 ta goroutine `Handle` ni parallel chaqiradi, `main` esa shu paytda `SetLimits` ni chaqiradi.

    Muammo: hisoblagichlar oddiy `int64`, `limits` esa oddiy pointer. `go run -race` bir nechta data race topadi (chiqish kodi 66) va hisoblagichlar yig'indisi 4000 dan kam chiqishi mumkin.

    `Gateway` ni tuzating: hisoblagichlar uchun tipli atomic, chegara uchun `atomic.Pointer[Limits]` ishlating. Mutex qo'shmang. `Handle`, `SetLimits` imzolari o'zgarmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "sync"
    )

    // Limits - so'rovlar chegarasi; yaratilgandan keyin o'zgartirilmaydi.
    type Limits struct {
        MaxBatch int
    }

    // Gateway telemetriya paketlarini qabul qiladi yoki rad etadi.
    type Gateway struct {
        limits   *Limits
        accepted int64
        rejected int64
    }

    // Handle batch hajmi chegaradan oshsa rad etadi.
    func (g *Gateway) Handle(batch int) {
        if batch > g.limits.MaxBatch {
            g.rejected++
            return
        }
        g.accepted++
    }

    // SetLimits chegarani ish vaqtida almashtiradi.
    func (g *Gateway) SetLimits(l *Limits) {
        g.limits = l
    }

    func main() {
        g := &Gateway{limits: &Limits{MaxBatch: 100}}

        var wg sync.WaitGroup
        for w := range 8 {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for i := range 500 {
                    g.Handle(50 + (w*7+i)%100)
                }
            }()
        }
        g.SetLimits(&Limits{MaxBatch: 80})
        wg.Wait()

        total := g.accepted + g.rejected
        fmt.Println("jami:", total, "kutilgan: 4000")
        if total != 4000 {
            os.Exit(1)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "os"
        "sync"
        "sync/atomic"
    )

    // Limits - so'rovlar chegarasi; yaratilgandan keyin o'zgartirilmaydi.
    type Limits struct {
        MaxBatch int
    }

    // Gateway telemetriya paketlarini qabul qiladi yoki rad etadi.
    type Gateway struct {
        limits   atomic.Pointer[Limits]
        accepted atomic.Int64
        rejected atomic.Int64
    }

    // Handle batch hajmi chegaradan oshsa rad etadi.
    func (g *Gateway) Handle(batch int) {
        if batch > g.limits.Load().MaxBatch {
            g.rejected.Add(1)
            return
        }
        g.accepted.Add(1)
    }

    // SetLimits chegarani ish vaqtida almashtiradi.
    func (g *Gateway) SetLimits(l *Limits) {
        g.limits.Store(l)
    }

    func main() {
        g := &Gateway{}
        g.SetLimits(&Limits{MaxBatch: 100})

        var wg sync.WaitGroup
        for w := range 8 {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for i := range 500 {
                    g.Handle(50 + (w*7+i)%100)
                }
            }()
        }
        g.SetLimits(&Limits{MaxBatch: 80})
        wg.Wait()

        total := g.accepted.Load() + g.rejected.Load()
        fmt.Println("jami:", total, "kutilgan: 4000")
        if total != 4000 {
            os.Exit(1)
        }
    }
  solutionNotes: |
    - `accepted` va `rejected` `atomic.Int64` ga aylandi: `Add(1)` va `Load()` bilan ishlanadi. Plain `++` o'qish-qo'shish-yozish uch bosqich va race.
    - `limits` `atomic.Pointer[Limits]`: o'quvchilar `Load()` bilan bitta snapshot oladi, `SetLimits` `Store` bilan yangisini almashtiradi. `Limits` yaratilgandan keyin o'zgartirilmaydi, shuning uchun o'quvchi ko'rgan maydonlar bir-biriga mos.
    - `Handle` ichida `g.limits.Load()` ni bir marta chaqirish ham mumkin edi (lokal o'zgaruvchiga): bu yerda bitta o'qish, ammo bir nechta maydon o'qiladigan kodda bitta snapshot ishlatish muhim.
    - Zero value `Gateway` da `limits.Load()` `nil` qaytaradi. Bu yechim `main` da `SetLimits` ni oldindan chaqiradi; kutubxona kodida konstruktor bilan boshlang'ich qiymatni berish yoki `nil` ni tekshirish kerak.
    - Bir nechta yozuvchi `SetLimits` ni almashtirsa va eski qiymatga bog'liq yangilash kerak bo'lsa, `Store` yetmaydi: CAS tsikli (dars misoli) kerak.
  checklist:
    - "`go run -race` da DATA RACE yo'q, chiqish kodi 0"
    - "Hisoblagichlar yig'indisi har gal 4000"
    - "Mutex qo'shilmagan, tipli atomic ishlatilgan"
    - "`limits` atomic.Pointer orqali almashtiriladi"
    - "`Handle` va `SetLimits` imzolari o'zgarmagan"
---

## Muammo

Mutex ishonchli, lekin har doim ham eng sodda emas. Telemetriya qabul qiluvchi servisning eng issiq yo'li bor: har paket uchun bitta hisoblagich oshiriladi va bitta bayroq o'qiladi. Ularni mutex ostiga solsak, minglab goroutine bitta lock atrofida navbatga turadi (44-dars). Boshqa tomondan, "mutexsiz tezroq bo'ladi" degan fikr bilan oddiy `int` ni parallel oshirib qo'ysak, bu data race (43-dars).

Ikkinchi odatiy vaziyat: konfiguratsiyani ish vaqtida almashtirish. Har so'rov uni o'qiydi, yozuv esa kamdan-kam. Har o'qishda `RLock` olish mumkin, lekin o'qishlar o'ta ko'p bo'lsa, lock shu yerda ham to'siq bo'ladi. Odatiy xato: konfiguratsiya maydonlarini bittadan alohida yangilash, shunda o'quvchi yangi va eski qiymatlar aralashmasini ko'radi.

`sync/atomic` shu ikki holat uchun. Lekin u past darajali vosita: paketning o'z hujjati ham maxsus past darajali holatlardan tashqari sinxronlashni kanal yoki `sync` bilan qilish yaxshiroq deydi. Bu darsda atomic nimani kafolatlashini, qaysi holatlarda to'g'ri tanlov ekanini va qaerda to'xtash kerakligini ko'ramiz.

## Asosiy g'oya

### Atomic nima beradi

Hujjatga ko'ra paket atomic xotira primitivlarini beradi. Operatsiyalar:

- **Load/Store**: qiymatni o'qish va yozish.
- **Swap**: yangi qiymatni yozib, eskisini qaytarish.
- **CompareAndSwap**: agar joriy qiymat `old` ga teng bo'lsa `new` ni yozish, natijada yozilgani haqida `bool` qaytarish. Ekvivalenti: `if *addr == old { *addr = new; return true }; return false`, lekin bo'linmas.
- **Add**: qiymatga qo'shish.
- **And/Or** (Go 1.23 dan): bit niqobi bilan bo'linmas amal, eski qiymatni qaytaradi.

Zamonaviy kod uchun tipli atomic'lar qulayroq: `atomic.Int32`, `atomic.Int64`, `atomic.Uint32`, `atomic.Uint64`, `atomic.Uintptr`, `atomic.Bool`, `atomic.Pointer[T]` va `atomic.Value`. Hujjat funksiyalar (`AddInt64(&x, 1)`) o'rniga ularni tavsiya qiladi ("more ergonomic and less error-prone"). Ikki sababi bor: tip xotiraning faqat atomic usulda ishlatilishini kodda majburlaydi (o'zgaruvchiga tasodifan oddiy `x++` yozish imkoni yo'q), va `Int64` hamda `Uint64` 64-bit alignment'ni avtomatik ta'minlaydi. Hujjat 32-bit platformalar uchun eslatadi: funksiya API'sida 64-bit so'zlarning hizalanishi chaqiruvchining mas'uliyati, tipli `Int64` va `Uint64` esa avtomatik hizalanadi.

### Xotira modeli bilan aloqasi

Data race ta'rifi (43-dars) atomic kirishlarni alohida istisno qiladi: barcha ishtirokchi kirishlar atomic bo'lsa, bu race emas. Lekin teskarisi ham muhim: bitta oddiy o'qish yoki yozish qolgan atomic kirishlarni yana race'ga aylantiradi. Atomic o'zgaruvchiga tegishning yagona yo'li atomic usul bo'lishi shart.

Ikki asosiy kafolat:

1. Agar atomic amal A ning ta'siri atomic amal B tomonidan kuzatilsa, A B dan oldin sodir bo'ladi (synchronized before). Ya'ni atomic bayroqni `Store(true)` qilishdan oldin yozilgan oddiy ma'lumot, bayroqni `Load()` qilib `true` ko'rgan goroutine uchun ko'rinadi. Atomic nafaqat qiymatning o'zini, balki ketidan keladigan ko'rinishni ham sinxronlaydi.
2. Barcha atomic amallar xuddi bir ketma-ket izchil tartibda bajarilgandek ishlaydi. Hujjat buni C++ ketma-ket izchil atomic'lari va Java `volatile` bilan bir xil semantika deb ataydi. Go'da relaxed yoki acquire/release rejimlari yo'q: bitta, eng kuchli model. Bu sodda va xatolarni kamaytiradi, ba'zi arxitekturalarda zaifroq rejimdan qimmatroq bo'lishi mumkin.

## Chuqurroq: patternlar va chegaralar

### CAS tsikli

Hisoblagich bilan sodda amal (`Add`) bor. Murakkabroq yangilanish, masalan "maksimumni yangilash" uchun CAS tsikli ishlatiladi: joriy qiymatni o'qing, yangisini hisoblang, `CompareAndSwap` bilan almashtiring, muvaffaqiyatsiz bo'lsa (boshqa goroutine oraga kirgan) boshidan takrorlang. Bu lock-free yondashuv: lock yo'q, hech bir goroutine boshqasini bloklamaydi va kamida bittasi doim oldinga siljiydi. Lekin alohida goroutine ko'p marta qayta urinishi mumkin va qizg'in raqobatda tsikl CPU'ni bo'sh sarflaydi. Lock-free "tezroq" degani emas: u "bloklanmaydi" degani, tezlik o'lchanadi.

### O'zgarmas snapshot va atomic.Pointer

Konfiguratsiya uchun eng foydali pattern: butun konfiguratsiyani o'zgarmas struct sifatida yarating, unga `atomic.Pointer[T]` orqali havola saqlang. O'quvchi `Load()` bilan bitta pointer oladi va uning orqali ko'rgan barcha maydonlar bir-biriga mos, chunki struct yaratilgandan keyin o'zgarmaydi. Yozuvchi yangi struct yaratib, `Store` bilan almashtiradi. Lock yo'q, o'quvchilar bir-birini kutmaydi. Eski snapshot'ni hali ishlatayotgan o'quvchilar tugagach GC uni yig'adi.

Muhim shart: snapshot haqiqatan o'zgarmas bo'lishi kerak. Struct ichida map yoki slice bo'lsa va kimdir uni keyin o'zgartirsa, atomic hech narsani himoya qilmaydi.

Bir nechta yozuvchi bo'lsa `Load` + `Store` yetmaydi: ikki yozuvchi bir xil `old` ni o'qib, biri ikkinchisini bosib ketadi (lost update). Yangilash eski qiymatga bog'liq bo'lsa, `CompareAndSwap` tsikli yoki mutex kerak.

### atomic.Value va atomic.Pointer

`atomic.Value` har qanday tipni saqlaydi (`any`), lekin hujjat qoidalari bor: birinchi `Store` dan keyin nusxalanmaydi, barcha `Store` va `CompareAndSwap` chaqiruvlari bir xil konkret tipdan foydalanishi kerak (aks holda panic), `CompareAndSwap(old, nil)` ham panic, `Store` ga `nil` bera olmaysiz. Tip kompilyatsiya vaqtida tekshiriladigan `atomic.Pointer[T]` bularni olib tashlaydi. Yangi kodda `Pointer[T]` ni tanlang.

### ABA muammosi

CAS qiymatni solishtiradi, tarixni emas. Agar qiymat A dan B ga va yana A ga o'tgan bo'lsa, `CompareAndSwap(A, X)` muvaffaqiyatli bo'ladi, holbuki oradagi o'zgarish muhim bo'lishi mumkin. Pointer CAS uchun Go'da klassik xavf (xotira manzili qayta ishlatilishi) kamaytirilgan: GC `old` pointer sizning qo'lingizda ekan, obyektni bo'shatmaydi va manzilni boshqa obyektga bermaydi. Lekin butun sonlar (masalan, holat kodlari) uchun mantiqiy ABA mavjud. Odatiy davo: qiymatga versiya hisoblagichini qo'shish.

### Ko'p o'zgaruvchili invariantlar

Ikki atomic o'zgaruvchi birga atomic emas. `lat` va `lon` ni ikkita atomic'da saqlab ketma-ket yangilasangiz, o'quvchi eski `lat` va yangi `lon` ni ko'rishi mumkin. Davo: juftlikni bitta o'zgarmas struct'ga solish va `atomic.Pointer` bilan almashtirish, yoki mutex. Mana shu chegarada atomic tugaydi: invariant bir nechta o'zgaruvchiga yoyilsa, mutex yoki snapshot kerak.

## Misol: metrikalar, konfiguratsiya va ko'p yozuvchili yangilash

Birinchi dastur lock'siz metrikalar: so'rovlar soni `Add` bilan, maksimal tezlik CAS tsikli bilan, to'xtash bayrog'i `atomic.Bool` bilan.

```go
package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// Metrics - yig'ma o'lchovlar; lock'siz yangilanadi.
type Metrics struct {
	received atomic.Int64
	maxSpeed atomic.Int64 // km/soat, butun son
	closed   atomic.Bool
}

// observeMax maksimumni CAS tsikli bilan yangilaydi.
func (m *Metrics) observeMax(v int64) {
	for {
		cur := m.maxSpeed.Load()
		if v <= cur {
			return
		}
		if m.maxSpeed.CompareAndSwap(cur, v) {
			return
		}
		// boshqa goroutine oraga kirdi: qayta urinamiz
	}
}

func main() {
	var m Metrics
	var wg sync.WaitGroup
	for i := range 100 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			m.received.Add(1)
			m.observeMax(int64(40 + i))
		}()
	}
	wg.Wait()
	m.closed.Store(true)

	fmt.Println("qabul qilingan:", m.received.Load())
	fmt.Println("maksimal tezlik:", m.maxSpeed.Load())
	fmt.Println("yopilgan:", m.closed.Load())
}
```

```text
qabul qilingan: 100
maksimal tezlik: 139
yopilgan: true
```

100 ta goroutine, tezliklar 40 dan 139 gacha, maksimum 139 va hisoblagich aniq 100. `observeMax` tsiklida `v <= cur` bo'lsa darhol qaytadi (yangilash kerak emas), `CompareAndSwap` muvaffaqiyatsiz bo'lsa qayta o'qiydi. Dastur `-race` ostida toza o'tdi.

Ikkinchi dastur `atomic.Pointer` bilan konfiguratsiyani almashtirish. Bir yozuvchi `Reload` chaqiradi, to'rt o'quvchi parallel o'qiydi va har safar bitta snapshot ichidagi maydonlar bir-biriga mosligini tekshiradi.

```go
package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

// Config o'zgarmas (immutable) snapshot: yaratilgandan keyin hech kim o'zgartirmaydi.
type Config struct {
	PollInterval time.Duration
	MaxSpeed     float64
	Version      int
}

type Service struct {
	cfg atomic.Pointer[Config]
}

func (s *Service) Config() *Config { return s.cfg.Load() }

// Reload yangi Config yaratadi va uni bitta atomic Store bilan almashtiradi.
func (s *Service) Reload(poll time.Duration, maxSpeed float64) {
	old := s.cfg.Load()
	next := &Config{PollInterval: poll, MaxSpeed: maxSpeed, Version: old.Version + 1}
	s.cfg.Store(next)
}

func main() {
	s := &Service{}
	s.cfg.Store(&Config{PollInterval: 5 * time.Second, MaxSpeed: 110})

	var wg sync.WaitGroup
	for range 4 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for range 1000 {
				c := s.Config() // bitta snapshot: ichidagi maydonlar bir-biriga mos
				if c.MaxSpeed != 110 && c.MaxSpeed != 90 {
					panic("buzilgan snapshot")
				}
			}
		}()
	}
	s.Reload(2*time.Second, 90) // yagona yozuvchi
	wg.Wait()

	c := s.Config()
	fmt.Println("versiya:", c.Version, "poll:", c.PollInterval, "maxSpeed:", c.MaxSpeed)
}
```

```text
versiya: 1 poll: 2s maxSpeed: 90
```

`Reload` komentariyada ko'rsatilganidek yagona yozuvchi uchun yozilgan. Ikkita `Reload` bir vaqtda chaqirilsa, `Version` hisobi yo'qolishi mumkin: ikkalasi ham `old.Version + 1` ni hisoblaydi. Bu holat uchun uchinchi dastur:

```go
package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// Limits o'zgarmas snapshot.
type Limits struct {
	MaxBatch int
	Version  int
}

type Gateway struct {
	limits atomic.Pointer[Limits]
}

// Update bir nechta yozuvchi bo'lganda ham yangilanishni yo'qotmaydi:
// eski snapshot o'zgarmagan bo'lsagina almashtiradi, aks holda qayta urinadi.
func (g *Gateway) Update(change func(Limits) Limits) {
	for {
		old := g.limits.Load()
		next := change(*old)
		next.Version = old.Version + 1
		if g.limits.CompareAndSwap(old, &next) {
			return
		}
	}
}

func main() {
	g := &Gateway{}
	g.limits.Store(&Limits{MaxBatch: 100})

	var wg sync.WaitGroup
	for range 50 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			g.Update(func(l Limits) Limits {
				l.MaxBatch++
				return l
			})
		}()
	}
	wg.Wait()

	l := g.limits.Load()
	fmt.Println("MaxBatch:", l.MaxBatch, "Version:", l.Version)
}
```

```text
MaxBatch: 150 Version: 50
```

50 goroutine har biri `MaxBatch` ni 1 ga oshiradi. Natija aniq: `100 + 50 = 150` va `Version == 50`: bitta yangilanish ham yo'qolmagan. `Update` ichida `CompareAndSwap(old, &next)` faqat `old` hali joriy bo'lsa o'tadi; aks holda boshqa goroutine oraga kirgan, tsikl `Load` dan qayta boshlaydi. `next` har urinishda yangidan yaratiladi, eski pointer'ga yozilmaydi. Natija har ishga tushirishda bir xil, garchi qayta urinishlar soni farq qilsa ham. Dastur `-race` bilan toza.

## Qachon qo'llamaslik kerak

- Bir nechta o'zgaruvchi birga o'zgarishi kerak bo'lgan invariant uchun atomic yetmaydi. Mutex yoki o'zgarmas snapshot ishlating.
- Murakkab mantiqni lock-free yozishga urinmang (o'z navbati, stack, ro'yxat). Bunday kodni to'g'ri yozish juda qiyin, testlash undan ham qiyin, foydasi esa ko'pincha o'lchanmagan. Standart kutubxona va yaxshi sinalgan paketlar ishlating.
- Spin-wait (`for !flag.Load() {}`) yomon: u CPU'ni yeydi. Kutish kerak bo'lsa kanal, `sync.Cond` yoki kontekst ishlating. Atomic bayroq "to'xtash so'raldi" kabi tekshiriladigan signal uchun yaxshi, kutish uchun emas.
- `atomic.Value` yoki oddiy pointer ichidagi o'zgaruvchan map/slice ni himoyalamaydi. Atomic faqat pointer yoki so'zning o'zini o'zgartirishni bo'linmas qiladi.
- Mutex 44-dars qoidalariga amal qilib kritik bo'limi qisqa bo'lsa va raqobat kam bo'lsa, atomic'ga o'tish ortiqcha murakkablik. Avval o'lchang.
- Atomic va oddiy kirishni aralashtirmang. Bitta o'zgaruvchi ham atomic, ham oddiy usulda o'qilsa/yozilsa data race. Tipli atomic'lar shu xatoni oldini oladi.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da atomic amallar `SharedArrayBuffer` ustida `Atomics.add`, `Atomics.compareExchange` kabi chaqiriladi va faqat worker'lar orasida umumiy xotira kerak bo'lganda ishlatiladi. Oddiy kodda bunga ehtiyoj yo'q, chunki bitta oqimli event loop hisoblagichni o'zi ketma-ket yangilaydi. Go'da esa umumiy xotira standart holat, shuning uchun `atomic.Int64` kundalik asbob.

Konfiguratsiyani almashtirish uchun Node.js'da oddiy o'zgaruvchiga yangi obyektni tayinlash kifoya (`config = newConfig`): o'qish va yozish bir oqimda. Go'da xuddi shu kod data race. `atomic.Pointer[Config]` aynan shu tayinlashning parallel xavfsiz varianti: "yangi obyekt yarat va havolani almashtir" g'oyasi bir xil, faqat havola atomic. Eski obyektni hali ishlatayotgan o'quvchilar uni GC yig'masdan oldin tugatishadi, bu Node.js'dagi kabi.

Ko'rib chiqish qoidasi: kodda `atomic` ni ko'rsangiz, savol bering: bu qiymat bitta mustaqil so'zmi yoki boshqa o'zgaruvchilar bilan invariantga bog'liqmi. Ikkinchisida atomic noto'g'ri tanlov.

## Xulosa

- `sync/atomic` bo'linmas Load, Store, Swap, CompareAndSwap, Add (va Go 1.23 dan And/Or) beradi; yangi kodda tipli `Int64`, `Bool`, `Pointer[T]` ni funksiya API'siga afzal ko'ring.
- Atomic kirishlar data race hisoblanmaydi, lekin faqat barcha kirishlar atomic bo'lsa; ular xotira modelida synchronized-before munosabatini yaratadi va ketma-ket izchil tartibda bajariladi.
- CAS tsikli (o'qi, hisobla, `CompareAndSwap`, muvaffaqiyatsiz bo'lsa qayta urin) lock-free yangilash beradi, lekin raqobatda CPU sarflaydi; lock-free tezlikni kafolatlamaydi.
- Konfiguratsiya uchun o'zgarmas snapshot + `atomic.Pointer[T]` pattern: o'quvchilar lock'siz izchil ko'rinish oladi; bir nechta yozuvchi bo'lsa CAS tsikli kerak.
- Bir nechta o'zgaruvchining izchilligi kerak bo'lsa yoki mantiq murakkab bo'lsa, atomic emas, mutex yoki snapshot tanlang.
