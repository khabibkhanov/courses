---
n: 14
slug: map-ichi
title: "Map: semantika, iteratsiya tartibi va Swiss table"
summary: "Map spetsifikatsiyasi nimani kafolatlaydi (nil map, kalit turlari, iteratsiya paytida o'zgartirish, tartibsizlik), Go 1.24 dan beri map Swiss table asosida qanday qurilgani va nima uchun map xotirani qaytarmaydi."
duration: 40
sources:
  - id: go-spec
    note: "Map types, For statements with range clause (map uchun iteratsiya qoidalari), Deletion of map elements, Comparison operators bo'limlari"
  - id: blog-maps
    note: "Concurrency, Iteration order, Key types bo'limlari va nil map eslatmasi (Declaration and initialization bo'limida)"
  - id: blog-swisstable
    note: "Swiss Table dizayni (8 slotli guruhlar, control word, h1/h2), Go uchun moslashuv (1024 yozuvgacha jadvallar, extendible hashing) va Modification during iteration bo'limi"
quiz:
  - q: "Map ustida range qilinayotganda, hali yetib borilmagan kalit o'chirilsa nima bo'ladi?"
    options:
      - "Panic: map iteratsiya paytida o'zgartirilmaydi"
      - "O'chirilgan yozuv iteratsiyada berilmaydi"
      - "Yozuv baribir iteratsiyada beriladi, chunki iterator snapshot oladi"
      - "Xatti-harakat aniqlanmagan, data race bilan teng"
    answer: 1
    explain: "Spetsifikatsiya: hali yetib borilmagan yozuv o'chirilsa, unga mos qiymat berilmaydi. Yangi qo'shilgan yozuv esa berilishi ham, o'tkazib yuborilishi ham mumkin. Iteratsiya paytida bitta goroutine ichida o'zgartirish ruxsat etilgan; boshqa goroutine'dan o'zgartirish esa data race."
  - q: "type Stat struct{ N int }; m := map[string]Stat{\"a\": {1}}. m[\"a\"].N++ kompilyatsiya bo'lmaydi. Qaysi yechim to'g'ri?"
    options:
      - "m[\"a\"].N = m[\"a\"].N + 1 ga o'zgartirish"
      - "&m[\"a\"] orqali pointer olish"
      - "Map'ni sync.Map'ga almashtirish"
      - "Qiymatni olib (s := m[\"a\"]), o'zgartirib, qayta yozish (m[\"a\"] = s) yoki map[string]*Stat ishlatish"
    answer: 3
    explain: "Map elementi addresslanmaydi (spetsifikatsiyada map indeks ifodasi addressable emas), shuning uchun struct maydonini bevosita o'zgartirib bo'lmaydi. Birinchi va ikkinchi variant ham xuddi shu sababli kompilyatsiya bo'lmaydi. Nusxa-o'zgartir-qayta yoz yoki pointer qiymat ishlatiladi."
  - q: "var m map[string]int bo'lsin. Qaysi gap to'g'ri?"
    options:
      - "Ikkala amal ham panic beradi: m[\"x\"] va m[\"x\"] = 1"
      - "Ikkalasi ham ishlaydi: nil map avtomatik yaratiladi"
      - "m[\"x\"] 0 qaytaradi, m[\"x\"] = 1 esa panic beradi"
      - "m[\"x\"] compile xatosi, m[\"x\"] = 1 esa ishlaydi"
    answer: 2
    explain: "Nil map o'qish uchun bo'sh map kabi ishlaydi (zero value va ok=false, len 0, range 0 marta). Faqat yozish mumkin emas: 'assignment to entry in nil map' panic."
  - q: "Go 1.24 release notes map haqida nima deydi?"
    options:
      - "Map implementatsiyasi Swiss Table asosida yangilandi; uni GOEXPERIMENT=noswissmap bilan build vaqtida o'chirish mumkin"
      - "Map endi tartiblangan: iteratsiya kalit tartibida bo'ladi"
      - "Map concurrency-safe bo'ldi, mutex kerak emas"
      - "Map GODEBUG=swissmap=0 bilan ishga tushirishda o'chiriladi"
    answer: 0
    explain: "Release notes: runtime'dagi yaxshilanishlar qatorida Swiss Tables asosidagi yangi map implementatsiyasi bor, va GOEXPERIMENT=noswissmap build vaqtida uni o'chiradi. Iteratsiya tartibi va concurrency kafolatlari o'zgarmadi."
  - q: "Servis 1M yozuvli map'ni to'ldirib, keyin hamma yozuvni delete qildi. Heap o'lchovi o'zgarmadi. Xotirani qaytarish uchun nima qilish kerak?"
    options:
      - "runtime.GC() ni chaqirish kifoya"
      - "delete o'rniga clear(m) ishlatish xotirani qaytaradi"
      - "debug.FreeOSMemory() map'ni qisqartiradi"
      - "Yangi map yaratib, eskisiga havolani tashlash"
    answer: 3
    explain: "Map o'sadi, lekin qisqarmaydi (100 Go Mistakes #28). Biz o'lchaganimizda delete ham, clear ham heap'ni o'zgartirmadi (Go 1.24.7), yangi map ajratilgach esa eskisi GC ga berildi. GC o'zi tirik map ichidagi bo'sh joyni qaytara olmaydi."
  - q: "m := map[float64]int{}; m[math.NaN()] = 1; m[math.NaN()] = 2. len(m) va m[math.NaN()] ni qidirish natijasi?"
    options:
      - "len 1, qidirish topadi"
      - "len 2, qidirish topmaydi"
      - "len 1, qidirish topmaydi"
      - "Panic: NaN kalit bo'lolmaydi"
    answer: 1
    explain: "NaN o'ziga teng emas (NaN != NaN), shuning uchun har yozuv yangi kalit hosil qiladi va hech qaysisini qidirib topib bo'lmaydi. Bunday yozuvlarni faqat clear yoki iteratsiya orqali olib tashlash mumkin. Kalit sifatida float ishlatishdan saqlaning."
task:
  title: "Fleet: zero value ishlaydigan va barqaror hisobot beradigan map"
  prompt: |
    `Fleet` avtopark mashinalarining yurgan masofasini `map[string]float64` da saqlaydi. Boshlang'ich kodda ikki muammo bor:

    1. `Fleet` zero value'i ishlamaydi: `var f Fleet; f.Add(...)` nil map'ga yozadi va panic beradi.
    2. `Report` map ustida range qiladi, shuning uchun qatorlar tartibi har ishga tushirishda boshqacha. Hisobot testlarda va diff'da barqaror bo'lishi kerak.

    Vazifa: `Add` birinchi chaqiruvda map'ni yaratsin (konstruktorsiz ishlasin), `Report` esa qatorlarni mashina ID bo'yicha saralab qaytarsin. Imzolar o'zgarmasin. `main` ni o'zgartirmang: `f.km = map...` qatori olib tashlanishi kerak, chunki endi shart emas.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "strings"
    )

    // Fleet avtoparkdagi mashinalar bo'yicha yurgan masofani (km) yig'adi.
    type Fleet struct {
        km map[string]float64
    }

    // Add mashinaning masofasiga km qo'shadi.
    func (f *Fleet) Add(id string, km float64) {
        f.km[id] += km
    }

    // Report har mashina uchun "id: km" qatorini qaytaradi.
    func (f *Fleet) Report() []string {
        var lines []string
        for id, km := range f.km {
            lines = append(lines, fmt.Sprintf("%s: %.1f", id, km))
        }
        return lines
    }

    func main() {
        var f Fleet // zero value tayyor bo'lishi kerak
        func() {
            defer func() { fmt.Println("recover:", recover()) }()
            f.Add("T-1042", 12.5)
        }()

        f.km = map[string]float64{}
        for _, id := range []string{"T-3001", "T-1042", "T-2007", "T-1042"} {
            f.Add(id, 10)
        }
        fmt.Println(strings.Join(f.Report(), " | "))
    }
  solution: |
    package main

    import (
        "fmt"
        "maps"
        "slices"
        "strings"
    )

    // Fleet avtoparkdagi mashinalar bo'yicha yurgan masofani (km) yig'adi.
    // Zero value ishlatishga tayyor: xaritani Add birinchi chaqiruvda yaratadi.
    type Fleet struct {
        km map[string]float64
    }

    // Add mashinaning masofasiga km qo'shadi.
    func (f *Fleet) Add(id string, km float64) {
        if f.km == nil {
            f.km = make(map[string]float64)
        }
        f.km[id] += km
    }

    // Report har mashina uchun "id: km" qatorini ID bo'yicha saralangan holda qaytaradi.
    func (f *Fleet) Report() []string {
        lines := make([]string, 0, len(f.km))
        for _, id := range slices.Sorted(maps.Keys(f.km)) {
            lines = append(lines, fmt.Sprintf("%s: %.1f", id, f.km[id]))
        }
        return lines
    }

    func main() {
        var f Fleet // zero value tayyor bo'lishi kerak
        func() {
            defer func() { fmt.Println("recover:", recover()) }()
            f.Add("T-1042", 12.5)
        }()

        for _, id := range []string{"T-3001", "T-1042", "T-2007", "T-1042"} {
            f.Add(id, 10)
        }
        fmt.Println(strings.Join(f.Report(), " | "))
    }
  solutionNotes: |
    - `Add` ichida `if f.km == nil { f.km = make(...) }`: "foydali zero value" idiomasi (37-dars). `Fleet{}` va `var f Fleet` to'g'ridan-to'g'ri ishlatiladi, konstruktor majburiy emas. Pointer receiver kerak: map maydonini o'zgartirish uchun struct'ning o'zi o'zgarishi kerak.
    - `Report` kalitlarni `slices.Sorted(maps.Keys(f.km))` bilan yig'adi va saralaydi (Go 1.23 dan). Map iteratsiya tartibi spetsifikatsiyada kafolatlanmaydi, shuning uchun tartib kerak bo'lsa alohida struktura yoki saralangan kalitlar kerak.
    - Natija oldindan ma'lum uzunlikda (`make([]string, 0, len(f.km))`), shuning uchun `append` qayta ajratmaydi.
    - Kutilgan chiqish: avval `recover: <nil>` (birinchi `Add` endi panic bermaydi), keyin `T-1042: 32.5 | T-2007: 10.0 | T-3001: 10.0`.
    - `Report` nil map ustida ham xavfsiz: nil map ustidan `range` nol marta aylanadi, `Report` bo'sh slice qaytaradi.
  checklist:
    - "`var f Fleet; f.Add(...)` panic bermaydi"
    - "`Report` qatorlari ID bo'yicha o'sish tartibida, har ishga tushirishda bir xil"
    - "`f.km` ga tashqaridan qiymat berish endi kerak emas"
    - "Nil map'da `Report` panic bermaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Map - Go'dagi eng ko'p ishlatiladigan murakkab tip: qurilma ID bo'yicha oxirgi o'qish, foydalanuvchi bo'yicha sessiya, kalit bo'yicha kesh. Va eng ko'p production xatolarini ham shu beradi. Bir xil to'rt holat takrorlanadi.

Birinchisi: `map` maydoni bor struct zero value bilan yaratiladi va birinchi yozuvda `assignment to entry in nil map` panic'i chiqadi. Ikkinchisi: hisobot map ustidan aylanib tuziladi, tartib tasodifiy bo'ladi, testlar "ba'zan" qizaradi. Uchinchisi: ikki goroutine bir map'ga yozadi va runtime `fatal error: concurrent map writes` bilan butun jarayonni to'xtatadi. Biz buni Go 1.24.7 da to'rt goroutine bilan sinab ko'rdik: bu panic emas, goroutine ichidagi `recover` ham, `main` dagisi ham uni ushlamadi, jarayon darhol to'xtadi. To'rtinchisi: yirik map'dan hamma narsa o'chirilgan, lekin xotira bo'shamaydi.

Node.js'da `Map` va oddiy obyekt kalitlarni qo'shilish tartibida beradi va bitta oqimda ishlaydi, shuning uchun bu xatolar tanish emas. Go'da map spetsifikatsiya darajasida boshqa kafolatlarga ega va Go 1.24 dan boshlab ichki tuzilishi ham butunlay yangi. Dars ikkalasini ko'radi: nimaga ishonish mumkin, va nima implementatsiya tafsiloti.

## Asosiy g'oya

### Spetsifikatsiya kafolatlari

Map - kalit-qiymat juftliklarining tartibsiz to'plami; kalitlar bir-biridan farq qiladi. Kalit turi uchun `==` va `!=` to'liq aniqlangan bo'lishi kerak, shuning uchun kalit funksiya, map yoki slice bo'la olmaydi. Kalit interface tipida bo'lsa, taqqoslash dinamik qiymatlar uchun aniqlanmagan bo'lsa, ish vaqtida panic bo'ladi (19-dars). Go Blog'ning map maqolasi qisqa yig'adi: kalit turlari - mantiqiy, sonli, string, pointer, kanal, interface, va faqat shularni o'z ichiga olgan struct va massivlar.

Nil map bo'sh map kabi o'qiladi, lekin unga yozib bo'lmaydi. Spetsifikatsiya aniq: nil map bo'sh map bilan bir xil, faqat element qo'shib bo'lmaydi. Blog maqolasi yozuvda runtime panic'i bo'lishini ham aytadi. Boshqa muhim qoidalar:

- `v, ok := m[k]` yo'q kalit uchun element tipining zero value'sini va `false` ni qaytaradi (`comma ok idiom`).
- `delete(m, k)` yo'q kalit uchun hech narsa qilmaydi, nil map uchun ham.
- `len(m)` yozuvlar sonini beradi; `clear(m)` hammasini o'chiradi (Go 1.21 dan).
- Map qiymati nusxalanganda ichki jadval nusxalanmaydi: funksiyaga berilgan map ichidagi o'zgarish chaqiruvchida ko'rinadi (quyidagi misolda `fill`).

### Iteratsiya: tartib va o'zgartirish

Spetsifikatsiya: map ustida `range` tartibi aniqlanmagan va bir iteratsiyadan boshqasiga bir xil bo'lishi kafolatlanmagan. Go Blog'ning map maqolasi amaliy yechim beradi: barqaror tartib kerak bo'lsa, tartibni belgilovchi alohida struktura saqlang, masalan saralangan kalitlar slice'ini. Iteratsiya paytida o'zgartirish ham aniq belgilangan: hali yetib borilmagan yozuv o'chirilsa, u berilmaydi; yangi yozuv berilishi ham, o'tkazib yuborilishi ham mumkin, va tanlov har yozuv va har iteratsiya uchun farq qilishi mumkin; nil map uchun iteratsiyalar soni 0. Bu faqat bitta goroutine ichida amal qiladi. Go Blog yana yozadi: map concurrent foydalanish uchun xavfsiz emas, o'qish va yozish orasida sinxronizatsiya (masalan `sync.RWMutex`) kerak (44-dars).

## Chuqurroq: Go 1.24 dan Swiss table

Go 1.24 release notes runtime yaxshilanishlari qatorida Swiss Tables asosidagi yangi builtin map implementatsiyasini sanaydi; uni build vaqtida `GOEXPERIMENT=noswissmap` bilan o'chirish mumkin. Spetsifikatsiya o'zgarmadi: yuqoridagi barcha kafolatlar bir xil. Go Blog'ning "Faster Go maps with Swiss Tables" maqolasi (Michael Pratt, 2025-yil 26-fevral) dizaynni tushuntiradi.

### Open addressing va guruhlar

Swiss table - ochiq adreslashli (open addressing) hash jadval: hamma yozuvlar bitta massivda turadi, kalit tushadigan joy hash bilan aniqlanadi, band bo'lsa keyingi joy qidiriladi. Maqolada massiv 8 slotli guruhlarga bo'linadi va har guruhda 64 bitli control word bor: uning har bayti bitta slotga mos keladi va slot bo'shmi, o'chirilganmi yoki band ekanini, band bo'lsa kalit hash'ining quyi 7 bitini (h2) saqlaydi. Hash'ning yuqori 57 biti (h1) birinchi tekshiriladigan guruhni tanlaydi. Qidirishda guruhdagi barcha slot'lar bir amalda h2 bilan solishtiriladi va faqat mos kelganlarining kalitlari to'liq taqqoslanadi. Bo'sh slot topilsa, kalit jadvalda yo'q.

### Go uchun moslashuv: bir necha jadval

Maqolaga ko'ra, Go'ning map'i uchun jadval cheksiz kattalashmaydi: yirik map bir nechta mustaqil jadvallar to'plami, har birida ko'pi bilan 1024 yozuv. Kalit qaysi jadvalga tushishini hash'ning yuqori bitlari belgilaydi, bitlar soni jadvallar soni oshgani sari ko'payadi. Bu extendible hashing: jadval o'sganda faqat shu jadval ikkiga bo'linadi, qolganlari tegilmaydi. Natijada bitta yozuvning eng yomon latency'si 1024 elementli jadvalni ikkiga bo'lish bilan cheklangan.

Iteratsiya semantikasi dizaynni murakkablashtirgan: Go spetsifikatsiyasi o'zgartirishni ruxsat etgani uchun iterator o'sgan jadvalning eski nusxasini aylanish tartibi uchun saqlaydi, ammo yozuvning joriy holatini yangi jadvaldan tekshiradi. Shuning uchun o'chirilgan yozuv berilmaydi, yangilangan yozuv esa yangi qiymat bilan beriladi.

### Xotira: o'lchov

Quyidagi dastur 1M yozuvli `map[int64]int64` ni to'ldiradi, o'chiradi va heap'ni har qadamda o'lchaydi (`report` map'ni o'lchov davomida tirik ushlab turadi, aks holda kompilyator uni erta bo'shatadi):

```go
package main

import (
	"fmt"
	"runtime"
)

func heapKiB() uint64 {
	runtime.GC()
	var ms runtime.MemStats
	runtime.ReadMemStats(&ms)
	return ms.HeapAlloc >> 10
}

var base uint64

// report heap'ni o'lchaydi; m o'lchov davomida tirik turadi.
func report(label string, m map[int64]int64) {
	h := heapKiB() - base
	fmt.Printf("%-26s len=%-8d heap=%d KiB\n", label, len(m), h)
}

func main() {
	const n = 1 << 20
	base = heapKiB()

	m := make(map[int64]int64)
	for i := int64(0); i < n; i++ {
		m[i] = i
	}
	report("to'ldirilgandan keyin:", m)

	for i := int64(0); i < n; i++ {
		delete(m, i)
	}
	report("hammasi delete dan keyin:", m)

	clear(m)
	report("clear dan keyin:", m)

	m = make(map[int64]int64)
	report("yangi map dan keyin:", m)
}
```

Go 1.24.7, linux/amd64 da chiqish:

```text
to'ldirilgandan keyin:     len=1048576  heap=36946 KiB
hammasi delete dan keyin:  len=0        heap=36947 KiB
clear dan keyin:           len=0        heap=36947 KiB
yangi map dan keyin:       len=0        heap=1 KiB
```

Birinchi qator: 1M yozuv uchun ~37 MB, ya'ni yozuvga ~36 bayt (16 bayt kalit + qiymat va jadval overhead'i). Xuddi shu dasturni `GOEXPERIMENT=noswissmap` bilan ishga tushirsak, bizda 39217 KiB (~38 bayt) chiqdi; farq kichik, va bu bitta mashinadagi bitta o'lchov, umumlashtirmang. Muhimi keyingi uchta qator: `delete` ham, `clear` ham heap'ni kamaytirmadi. Map o'sadi, lekin hech qachon qisqarmaydi (100 Go Mistakes #28), va faqat eskisini tashlab yangi map yaratish xotirani GC ga qaytaradi. Bu o'lchov shuni ko'rsatadi: tirik map ichidagi bo'sh joyni GC qaytarmaydi, faqat butun map ob'ekti tashlanganda yig'iladi.

## Misol: map semantikasi bir dasturda

```go
package main

import (
	"fmt"
	"math"
)

type Stat struct {
	Count int
	Sum   float64
}

func tryWrite(m map[string]int) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("%v", r)
		}
	}()
	m["T-1042"] = 1
	return nil
}

func addReading(stats map[string]Stat, id string, v float64) {
	s := stats[id] // yo'q kalit uchun zero value
	s.Count++
	s.Sum += v
	stats[id] = s // struct qiymat nusxa: qayta yozish shart
}

func main() {
	var nilMap map[string]int
	v, ok := nilMap["T-1042"]
	fmt.Println("nil map o'qish:", v, ok, "len:", len(nilMap))
	fmt.Println("nil map yozish:", tryWrite(nilMap))

	stats := map[string]Stat{}
	addReading(stats, "T-1042", 40.5)
	addReading(stats, "T-1042", 39.5)
	fmt.Println("stats:", stats)

	// map header uzatiladi: funksiya ichidagi yozuv chaqiruvchida ko'rinadi
	fill := func(m map[string]int) { m["fuel"] = 41 }
	m := map[string]int{}
	fill(m)
	fmt.Println("fill dan keyin:", m)

	// NaN o'ziga teng emas: har yozuv yangi kalit
	nan := map[float64]int{}
	nan[math.NaN()] = 1
	nan[math.NaN()] = 2
	_, found := nan[math.NaN()]
	fmt.Println("NaN kalitlar soni:", len(nan), "| topiladimi:", found)

	// iteratsiya paytida o'chirish ruxsat etilgan
	m2 := map[int]bool{1: true, 2: true, 3: true, 4: true}
	for k := range m2 {
		delete(m2, k)
	}
	fmt.Println("hammasi o'chirildi, len:", len(m2))
}
```

Chiqish:

```text
nil map o'qish: 0 false len: 0
nil map yozish: assignment to entry in nil map
stats: map[T-1042:{2 80}]
fill dan keyin: map[fuel:41]
NaN kalitlar soni: 2 | topiladimi: false
hammasi o'chirildi, len: 0
```

Qatorlar: nil map'dan o'qish `0 false`, yozish esa panic. `addReading` `stats[id]` ni nusxa sifatida o'qib, o'zgartiradi va qayta yozadi: struct qiymatli map elementi addresslanmaydi, shuning uchun `stats[id].Count++` kompilyatsiya bo'lmaydi. `NaN` kalitlar o'ziga teng emas: ikki yozuv, qidirish topmaydi. Oxirgi qator iteratsiya paytida o'chirish ruxsat etilganini ko'rsatadi.

Tartib masalasi:

```go
package main

import (
	"fmt"
	"maps"
	"slices"
	"strings"
)

func main() {
	m := map[string]int{"a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8}

	orders := map[string]bool{}
	for range 1000 {
		var sb strings.Builder
		for k := range m {
			sb.WriteString(k)
		}
		orders[sb.String()] = true
	}
	fmt.Println("1000 aylanishda ko'rilgan turli tartiblar > 1:", len(orders) > 1)

	// barqaror tartib kerak bo'lsa kalitlarni o'zingiz saralaysiz
	keys := slices.Sorted(maps.Keys(m))
	fmt.Println("saralangan kalitlar:", keys)
}
```

```text
1000 aylanishda ko'rilgan turli tartiblar > 1: true
saralangan kalitlar: [a b c d e f g h]
```

8 kalitli map ustida 1000 marta aylanish bir necha xil tartib berdi; aniq tartib har ishga tushirishda farq qiladi, shuning uchun biz uni emas, tartiblarning mavjudligini chop etdik. Barqaror natija kerak bo'lsa, kalitlarni `slices.Sorted(maps.Keys(m))` bilan saralang (Go 1.23 dan; 29-dars).

## Qachon qo'llamaslik kerak

- Kalitlar kichik, qat'iy to'plam bo'lsa (masalan, 5 ta holat), map o'rniga massiv yoki `switch`: tezroq va tartiblangan.
- Tartib muhim bo'lsa, map yetarli emas. Slice + saralash yoki map + kalitlar slice'i. Map iteratsiya tartibiga tayanadigan kod spetsifikatsiya bo'yicha noto'g'ri, hatto "doim ishlasa ham".
- `float` kalitlardan saqlaning: NaN kalit o'ziga teng emas, bunday yozuvni qidirib topib bo'lmaydi.
- Bir nechta goroutine yozadigan map uchun mutex yoki `sync.Map` kerak (44-dars). Hatto "faqat o'qiyman" deb o'ylagan goroutine yozish bilan bir vaqtda o'qisa ham, bu xato.
- Katta, vaqt o'tishi bilan to'lib-bo'shaydigan map'ni abadiy ushlab turmang: o'lchovdagi kabi hajm qaytmaydi. Davriy ravishda yangi map'ga ko'chirish yoki pointer qiymatlar yordam beradi.
- Swiss table tafsilotlariga (guruh hajmi, 1024 chegarasi) dastur mantiqini bog'lamang: ular implementatsiya, release'lar orasida o'zgarishi mumkin.

## Stack'da: Node.js/TypeScript bilan solishtirish

JavaScript `Map` qo'shilish tartibini saqlaydi; Go map'i tartibni ataylab tasodifiy boshlaydi. Natija: Node.js'dan o'tgan jamoa hisobotlarni "o'zi tartiblangan" deb yozadi va testlar beqaror bo'ladi. Go'da JSON ga serializatsiya (`encoding/json`) map kalitlarini saralaydi, bu esa tartibni yashirib, muammoni kechiktiradi: aynan o'zingizning kodingizda iteratsiya qilsangiz, tartib tasodifiy.

Amaliy qoidalar:

- Struct maydonidagi map'ni `Add` metodida lazy yarating yoki konstruktorda `make`; zero value ishlashi qulay API beradi.
- Hisobot, log va test uchun natijani saralang; tartibga bog'liq test yozmang.
- Hajm oldindan ma'lum bo'lsa, `make(map[K]V, n)` bilan ajrating: 100 Go Mistakes #27 buni map o'sishidagi qayta ajratishni kamaytirish deb beradi (15-dars).
- Concurrent yozuvni race detector bilan tekshiring (43-dars): runtime har doim ham ushlamaydi.

## Xulosa

- Map tartibsiz; iteratsiya tartibi kafolatlanmagan. Barqaror natija uchun kalitlarni saralang.
- Nil map o'qiladi (zero value), yozilmaydi (panic); `delete` va `clear` xavfsiz.
- Iteratsiya paytida bitta goroutine ichida o'zgartirish ruxsat etilgan; o'chirilgan hali ko'rilmagan yozuv berilmaydi.
- Map elementi addresslanmaydi: struct maydonini o'zgartirish uchun nusxa-o'zgartir-yoz yoki pointer qiymat.
- Go 1.24 dan map Swiss table asosida (8 slotli guruhlar, control word, 1024 yozuvli jadvallar, extendible hashing); `GOEXPERIMENT=noswissmap` uni o'chiradi; spetsifikatsiya kafolatlari o'zgarmagan.
- Map qisqarmaydi: xotirani qaytarish uchun yangi map yarating; concurrent foydalanishda sinxronizatsiya shart.
