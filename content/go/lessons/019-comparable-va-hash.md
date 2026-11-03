---
n: 19
slug: comparable-va-hash
title: "Taqqoslash, comparable, hash/maphash va unique"
summary: "Qaysi tiplar == bilan taqqoslanadi va nima uchun interface orqali taqqoslash panic berishi mumkin, comparable cheklovi va strictly comparable farqi, hash/maphash bilan shard tanlash, unique.Handle bilan takrorlanuvchi qiymatlarni interning qilish."
duration: 40
sources:
  - id: go-spec
    note: "Comparison operators, Map types (kalit tipi), Type constraints (comparable va strictly comparable) bo'limlari"
  - id: pkg-unique
    note: "unique.Make va unique.Handle hujjati: handle'lar teng bo'lishi faqat qiymatlar teng bo'lganda, taqqoslash arzonligi"
  - id: blog-unique
    note: "Interning g'oyasi va unique paketining maqsadi"
  - id: pkg-maphash
    note: "Comparable va Seed"
quiz:
  - q: "type Reading struct{ Device string; Samples []float64 }. r1 == r2 yozilsa nima bo'ladi?"
    options:
      - "Samples elementlari bo'yicha taqqoslanadi"
      - "Kompilyatsiya xatosi: slice maydonli struct comparable emas"
      - "Run-time panic: slice taqqoslanmaydi"
      - "Faqat Device taqqoslanadi, Samples e'tiborga olinmaydi"
    answer: 1
    explain: "Struct faqat barcha maydonlari comparable bo'lsa comparable. Slice, map va funksiya tiplari faqat nil bilan taqqoslanadi, shuning uchun bunday struct'ni == bilan taqqoslash kompilyatsiya vaqtida rad etiladi. Panic faqat interface orqali, tip kompilyatsiyada noma'lum bo'lganda chiqadi."
  - q: "var a, b any = []int{1}, []int{1}; a == b ifodasi qanday natija beradi?"
    options:
      - "true, chunki elementlar teng"
      - "false, chunki slice'lar turli massivlarga qaraydi"
      - "Kompilyatsiya xatosi"
      - "Run-time panic: bir xil dinamik tip, lekin bu tip comparable emas"
    answer: 3
    explain: "Interface qiymatlari dinamik tiplari bir xil bo'lib, bu tip comparable bo'lmasa, taqqoslash run-time panic beradi (biz o'lchaganimizda: comparing uncomparable type []int). Dinamik tiplar turlicha bo'lsa panic yo'q, natija false."
  - q: "func Index[T comparable](s []T, v T) int. Index([]any{1, \"x\"}, \"x\") va Index([]any{[]int{1}}, []int{1}) chaqiruvlari haqida qaysi gap to'g'ri?"
    options:
      - "Ikkalasi ham kompilyatsiya bo'lmaydi: any comparable emas"
      - "Ikkalasi ham kompilyatsiya bo'ladi; birinchisi ishlaydi, ikkinchisi run-time'da panic beradi"
      - "Ikkalasi ham kompilyatsiya bo'ladi va false/-1 qaytaradi"
      - "Faqat birinchisi kompilyatsiya bo'ladi"
    answer: 1
    explain: "Interface tiplari comparable cheklovini qanoatlantiradi (spetsifikatsiya: ular strictly comparable emas, lekin satisfy qiladi), lekin taqqoslash panic berishi mumkin. Biz o'lchaganimizda birinchi chaqiruv 1 qaytardi, ikkinchisi panic berdi. Strictly comparable tip bilan bu xavf yo'q."
  - q: "maphash.Comparable(seed, v) ni ikkita turli jarayonda bir xil v uchun chaqirsak, hash qiymatlari qanday bo'ladi?"
    options:
      - "Har doim bir xil, chunki funksiya deterministik"
      - "Seed har jarayonda tasodifiy MakeSeed bilan olinadi va jarayondan tashqariga chiqmaydi, shuning uchun qiymatlar mos kelishi shart emas"
      - "Faqat mashinaning protsessoriga bog'liq"
      - "Har doim turlicha, hatto bir jarayon ichida ham"
    answer: 1
    explain: "Hujjat: Seed tasodifiy qiymat, bir jarayon bilan chegaralangan va boshqa jarayonda qayta yaratib bo'lmaydi. Bir seed va teng qiymatlar uchun hash teng. Shu sababli maphash hash'ni diskka yoki tarmoqqa saqlash uchun yaroqsiz."
  - q: "Telemetriyada 200 ming yozuvning har birida bir xil uzun model matni saqlanadi. unique.Handle[string] bu yerda nimani beradi?"
    options:
      - "Matn kompilyatsiya vaqtida konstantaga aylanadi"
      - "Har yozuv matn nusxasini saqlaydi, lekin GC ularni birlashtiradi"
      - "Yozuvlar bitta kanonik nusxaga ishora qiluvchi handle saqlaydi; handle'larni taqqoslash pointer taqqoslashiga o'xshash arzon"
      - "Matn sha256 bilan qisqartiriladi"
    answer: 2
    explain: "unique.Make teng qiymatlar uchun bir xil handle qaytaradi; handle ichida kanonik qiymatga pointer bor. Bizning o'lchovimizda 200 ming yozuv uchun oddiy string maydonlari taxminan 12.5 MiB, handle'lar esa taxminan 1.5 MiB egalladi. Handle'lar teng bo'lishi qiymatlar teng bo'lishiga ekvivalent."
  - q: "NaN kalit sifatida map'ga qo'yilsa va keyin xuddi shu NaN bilan o'qilsa nima bo'ladi?"
    options:
      - "Qiymat topiladi, chunki bit ko'rinishi bir xil"
      - "Panic"
      - "Topilmaydi: NaN != NaN, shuning uchun har bir qo'yish yangi yozuv yaratadi va uni o'qib bo'lmaydi"
      - "Kompilyatsiya xatosi: float kalit bo'la olmaydi"
    answer: 2
    explain: "Float tipi comparable, lekin NaN o'ziga teng emas. Shuning uchun NaN kalitli yozuvni qayta topib bo'lmaydi va har insert yangi yozuv beradi. maphash.Comparable hujjati ham v != v bo'lsa hash tasodifiy taqsimlanishini aytadi. Kalit sifatida float ishlatsangiz, NaN'ni oldindan rad eting."
task:
  title: "Shard tanlash: uzunlik o'rniga maphash"
  prompt: |
    Telemetriya hisoblagichi kalitlarni (`Key{Device, Day}`) 8 ta shard'ga taqsimlaydi. Hozirgi `Shard` funksiyasi kalit matnining uzunligini shard soniga bo'ladi. `T-1000`...`T-1999` kalitlarining hammasi bir xil uzunlikda, shuning uchun barcha yuk bitta shard'ga tushadi.

    Vazifa: `Shard` ni `hash/maphash` bilan qayta yozing. Imzo (`Shard[K comparable](seed maphash.Seed, k K, n int) int`) o'zgarmasin va u har qanday comparable kalit bilan ishlasin. Bir xil kalit bir xil seed bilan doim bir xil shard'ni berishi kerak. Kutilgan chiqish: `shard'lar ishlatildi: 8 / 8`, ikki `true`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "hash/maphash"
    )

    type Key struct {
        Device string
        Day    int
    }

    // Shard kalitni n ta shard'dan biriga biriktiradi.
    // MUAMMO: matn uzunligi bo'yicha taqsimlash. "T-1000"..."T-1999"
    // kalitlarining hammasi bir xil uzunlikda, shuning uchun bitta shard to'ladi.
    func Shard[K comparable](seed maphash.Seed, k K, n int) int {
        _ = seed
        return len(fmt.Sprint(k)) % n
    }

    func main() {
        const n = 8
        seed := maphash.MakeSeed()

        var load [n]int
        for i := 0; i < 1000; i++ {
            k := Key{Device: fmt.Sprintf("T-%d", 1000+i)}
            load[Shard(seed, k, n)]++
        }

        used, most := 0, 0
        for _, c := range load {
            if c > 0 {
                used++
            }
            most = max(most, c)
        }
        k := Key{"T-1500", 2}
        fmt.Printf("shard'lar ishlatildi: %d / %d\n", used, n)
        fmt.Println("bir xil kalit - bir xil shard:", Shard(seed, k, n) == Shard(seed, Key{"T-1500", 2}, n))
        fmt.Println("eng yuklangan shard o'rtachadan 2x kam:", most < 2*(1000/n))
    }
  solution: |
    package main

    import (
        "fmt"
        "hash/maphash"
    )

    type Key struct {
        Device string
        Day    int
    }

    // Shard kalitni n ta shard'dan biriga biriktiradi. Hash seed bilan
    // hisoblanadi: bir jarayon ichida barqaror, taqsimlanishi tekis.
    func Shard[K comparable](seed maphash.Seed, k K, n int) int {
        return int(maphash.Comparable(seed, k) % uint64(n))
    }

    func main() {
        const n = 8
        seed := maphash.MakeSeed()

        var load [n]int
        for i := 0; i < 1000; i++ {
            k := Key{Device: fmt.Sprintf("T-%d", 1000+i)}
            load[Shard(seed, k, n)]++
        }

        used, most := 0, 0
        for _, c := range load {
            if c > 0 {
                used++
            }
            most = max(most, c)
        }
        k := Key{"T-1500", 2}
        fmt.Printf("shard'lar ishlatildi: %d / %d\n", used, n)
        fmt.Println("bir xil kalit - bir xil shard:", Shard(seed, k, n) == Shard(seed, Key{"T-1500", 2}, n))
        fmt.Println("eng yuklangan shard o'rtachadan 2x kam:", most < 2*(1000/n))
    }
  solutionNotes: |
    - `maphash.Comparable(seed, k)` har qanday comparable qiymat uchun 64 bitli hash beradi (Go 1.24 dan). Teng qiymatlar bir xil seed bilan teng hash beradi, shuning uchun bir xil kalit doim bir xil shard'ga tushadi.
    - `% uint64(n)` natijani `[0, n)` oralig'iga keltiradi. Hash'ni `int` ga o'tkazishdan oldin modul olish manfiy qiymatlardan saqlaydi.
    - Seed jarayon ichida bir marta yaratiladi (`maphash.MakeSeed`) va saqlanadi. Har chaqiruvda yangi seed olinsa, bir xil kalit har safar boshqa shard'ga tushadi.
    - Seed jarayondan tashqariga chiqmaydi: shard raqamini diskka yoki boshqa servisga uzatib, "o'sha shard" deb ishonib bo'lmaydi. Barqaror taqsimlash kerak bo'lsa, o'zingiz tanlagan algoritm (masalan, kalitni baytlarga o'tkazib, qat'iy hash) kerak.
  checklist:
    - "Barcha 8 shard ishlatiladi"
    - "Bir xil kalit va seed bilan Shard doim bir xil natija beradi"
    - "Eng yuklangan shard o'rtachadan 2 baravardan kam"
    - "Imzo o'zgarmagan, Shard har qanday comparable kalit bilan ishlaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Telemetriya servisida uch joyda bir xil savol paydo bo'ladi: ikki qiymat tengmi? Qurilma ma'lumotlari `map` kaliti sifatida ishlatiladi. Hisoblagichlar bir nechta shard'ga bo'linadi va har kalit qaysi shard'ga tushishi kerak. Har yozuvda takrorlanadigan uzun model matni xotirani isrof qiladi. Bu uch savol bitta mavzuga bog'langan: Go qiymatlarni qanday taqqoslaydi va shu taqqoslash asosida nima qurish mumkin.

Production'da bu mavzu odatda uch xil og'riq bilan chiqadi. Birinchisi: kodingiz yillar davomida ishlaydi, keyin kimdir `map[any]int` ga slice qo'yadi va jarayon `hash of unhashable type` bilan qulaydi. Ikkinchisi: kalitni uzunligi yoki oxirgi belgisi bo'yicha shard'larga bo'lasiz, natijada bitta shard 100% yuk oladi. Uchinchisi: 200 ming yozuvning har biri bir xil `"Isuzu NPR 75L diesel..."` matnining o'z nusxasini saqlaydi. Bu dars uchala holat uchun spetsifikatsiya qoidasini, standart kutubxona vositasini (`hash/maphash`, `unique`) va o'lchangan natijani beradi.

## Asosiy g'oya

### Qaysi tiplar taqqoslanadi

Spetsifikatsiyaning "Comparison operators" bo'limi qoidalarni tip bo'yicha sanaydi. Mantiqiy, butun, suzuvchi nuqtali, kompleks, satr, pointer va kanal tiplari comparable. Struct comparable, agar barcha maydonlari comparable bo'lsa; ikki struct teng, agar mos bo'sh bo'lmagan (non-blank) maydonlari teng bo'lsa. Massiv comparable, agar element tipi comparable bo'lsa. Slice, map va funksiya qiymatlari comparable emas: ularni faqat `nil` bilan taqqoslash mumkin.

Bundan amaliy xulosa chiqadi: ichida bitta slice maydoni bor struct `==` bilan taqqoslanmaydi va map kaliti bo'la olmaydi. Bu kompilyatsiya vaqtida rad etiladi, ya'ni xavfsiz tomon. Xavfli tomon interface orqali ochiladi.

### Interface va panic

Interface qiymatlari doim comparable. Spetsifikatsiya: ikki interface qiymati teng, agar dinamik tiplari bir xil va dinamik qiymatlari teng bo'lsa (17-dars). Agar dinamik tiplar bir xil bo'lsa-yu, bu tip comparable bo'lmasa, taqqoslash run-time panic beradi. Kompilyator `any` ichida nima borligini bilmaydi, shuning uchun xatoni faqat ishga tushganda ushlaydi. Map kalitlari uchun ham xuddi shunday: kalit tipi interface bo'lsa, dinamik kalit qiymatlarida taqqoslash aniqlangan bo'lishi kerak, aks holda run-time panic (14-dars).

Kichik dastur bu qoidalarni bir joyda ko'rsatadi:

```go run
package main

import (
	"fmt"
	"math"
)

type Point struct {
	Lat, Lon float64
}

type Event struct {
	Device string
	_      int // blank maydon taqqoslashda e'tiborga olinmaydi
	At     [2]int
}

// Index - comparable cheklovi: T ning == operatori bor.
func Index[T comparable](s []T, v T) int {
	for i := range s {
		if s[i] == v {
			return i
		}
	}
	return -1
}

func tryIndex(s []any, v any) (res string) {
	defer func() {
		if r := recover(); r != nil {
			res = fmt.Sprint("panic: ", r)
		}
	}()
	return fmt.Sprint(Index(s, v))
}

func tryMap(key any) (res string) {
	defer func() {
		if r := recover(); r != nil {
			res = fmt.Sprint("panic: ", r)
		}
	}()
	m := map[any]int{}
	m[key] = 1
	return fmt.Sprint("ok, len=", len(m))
}

func main() {
	fmt.Println("struct:", Point{1, 2} == Point{1, 2})
	fmt.Println("massiv:", [3]int{1, 2, 3} == [3]int{1, 2, 3})
	fmt.Println("blank maydon:", Event{Device: "T-1", At: [2]int{1, 2}} == Event{Device: "T-1", At: [2]int{1, 2}})

	nan := math.NaN()
	fmt.Println("NaN == NaN:", nan == nan, "| Point{NaN,0} teng:", Point{nan, 0} == Point{nan, 0})
	fmt.Println("+0 == -0:", 0.0 == math.Copysign(0, -1))

	fmt.Println("Index[string]:", Index([]string{"a", "b"}, "b"))
	// any kabi interface tipi comparable cheklovini qanoatlantiradi, lekin panic bo'lishi mumkin
	fmt.Println("Index[any] (sonlar):", tryIndex([]any{1, "x"}, "x"))
	fmt.Println("Index[any] (slice):", tryIndex([]any{[]int{1}}, []int{1}))
	fmt.Println("map[any] kalit 42:", tryMap(42))
	fmt.Println("map[any] kalit slice:", tryMap([]int{1}))
}
```

Go 1.24.7 da chiqish:

```text
struct: true
massiv: true
blank maydon: true
NaN == NaN: false | Point{NaN,0} teng: false
+0 == -0: true
Index[string]: 1
Index[any] (sonlar): 1
Index[any] (slice): panic: runtime error: comparing uncomparable type []int
map[any] kalit 42: ok, len=1
map[any] kalit slice: panic: runtime error: hash of unhashable type []int
```

E'tibor bering: struct va massiv to'g'ri taqqoslanadi; blank (`_`) maydon natijaga ta'sir qilmaydi; `NaN` o'ziga teng emas, `+0` va `-0` esa teng. Slice `any` ichiga o'ralganda panic xabari `comparing uncomparable type []int`, map kaliti sifatida esa `hash of unhashable type []int`.

### comparable cheklovi va strictly comparable

Generik kodda `==` ni ishlatish uchun tip parametri `comparable` cheklovi bilan e'lon qilinadi (24-dars). Spetsifikatsiya `comparable` ni barcha strictly comparable tiplar to'plami deb ta'riflaydi. Strictly comparable tip: taqqoslash hech qachon panic bermaydigan tip, ya'ni interface'siz va ichida interface maydoni bo'lmagan comparable tip. Interface tiplari strictly comparable emas, lekin spetsifikatsiya aytadi: ular `comparable` ni implement qilmaydi, ammo uni `satisfy` qiladi. Shu sababli `Index[any]` kompilyatsiya bo'ladi, lekin ichida slice bo'lsa panic beradi. Yuqoridagi chiqishda bu ko'rinadi: `Index[string]` va `Index[any]` (sonlar bilan) ishlaydi, slice bilan esa panic.

Xulosa: `comparable` cheklovi "kompilyator tekshirdi, panic yo'q" degani emas. Faqat siz bergan tip strictly comparable bo'lsa, kafolat to'liq.

## Chuqurroq: hash va interning

### hash/maphash: kalitdan raqamga

Custom hash table, shard tanlash yoki Bloom filter qurishda kalitdan `uint64` kerak bo'ladi. `hash/maphash` paketi shu uchun mo'ljallangan: hujjatiga ko'ra hash funksiyalari baytlar ketma-ketligini yoki comparable qiymatlarni 64 bitli sonlarning tekis taqsimotiga o'tkazadi, har bir hash tuzilma o'z `Seed` iga ega bo'lishi kerak va funksiyalar kriptografik emas.

Go 1.24 dan `maphash.Comparable(seed, v)` va `maphash.WriteComparable` bor (API fayllari bilan tasdiqlandi: `go1.24.txt`). Kafolat: `v1 == v2` bo'lsa, `Comparable(s, v1) == Comparable(s, v2)`. `v != v` (masalan, NaN) bo'lsa, hash tasodifiy taqsimlanadi. Seed haqida hujjat: Seed tasodifiy qiymat, bir jarayonga xos va boshqa jarayonda qayta yaratib bo'lmaydi. Natijalar:

```go run
package main

import (
	"fmt"
	"hash/maphash"
	"math"
)

type Key struct {
	Device string
	Day    int
}

func main() {
	seed := maphash.MakeSeed()
	k := Key{"T-1042", 3}

	h1 := maphash.Comparable(seed, k)
	h2 := maphash.Comparable(seed, Key{"T-1042", 3})
	fmt.Println("bir xil seed va qiymat:", h1 == h2)
	fmt.Println("boshqa seed:", h1 == maphash.Comparable(maphash.MakeSeed(), k))
	fmt.Println("boshqa qiymat:", h1 == maphash.Comparable(seed, Key{"T-1042", 4}))

	// NaN o'ziga teng emas: hash tasodifiy taqsimlanadi (hujjatdagi qoida)
	nan := math.NaN()
	fmt.Println("NaN hash'lari bir xil:", maphash.Comparable(seed, nan) == maphash.Comparable(seed, nan))

	// 8 ta shard bo'yicha taqsimlash
	const shards = 8
	var counts [shards]int
	for d := 0; d < 100_000; d++ {
		id := fmt.Sprintf("T-%d", d)
		counts[maphash.String(seed, id)%shards]++
	}
	lo, hi := counts[0], counts[0]
	for _, c := range counts {
		lo, hi = min(lo, c), max(hi, c)
	}
	fmt.Println("shard'lar bo'sh emas:", lo > 0, "| eng katta/eng kichik < 1.1:", float64(hi)/float64(lo) < 1.1)
}
```

Chiqish:

```text
bir xil seed va qiymat: true
boshqa seed: false
boshqa qiymat: false
NaN hash'lari bir xil: false
shard'lar bo'sh emas: true | eng katta/eng kichik < 1.1: true
```

Bir seed va teng qiymat: hash teng. Boshqa seed yoki boshqa qiymat: turlicha (juda katta ehtimol bilan; hujjat "very likely" deydi). NaN: har chaqiruvda boshqa hash. Oxirgi qator 100 ming qurilma ID sini 8 shard'ga `maphash.String` bilan taqsimladi: hech bir shard bo'sh emas, eng yuklangani eng yengilidan 10% dan kam farq qiladi. Taqsimot qat'iy kafolat emas, bu bizning bir o'lchovimiz.

Shu paketdan nimani kutish mumkin emas: hash qiymatlarini saqlab qo'yish. Seed jarayondan tashqariga chiqmaydi, demak diskka yozilgan yoki boshqa servisga yuborilgan hash'ning ma'nosi yo'q. Barqaror (qayta ishga tushganda ham o'zgarmaydigan) taqsimot kerak bo'lsa, kalitni aniq baytlarga o'tkazib, o'zingiz tanlagan hash ishlatiladi.

### unique: interning

Interning: teng qiymatlarning bitta kanonik nusxasini saqlash va qolganlarni unga ishora qildirish. Go 1.23 dan standart kutubxonada `unique` paketi bor (API fayllari: `go1.23.txt`). Hujjat: `unique.Make[T comparable](v T) Handle[T]` qiymat uchun global yagona handle beradi; ikki handle teng bo'lishi faqat va faqat ularni hosil qilgan qiymatlar teng bo'lganda. Handle'larni taqqoslash oddiy va odatda qiymatlarni o'zini taqqoslashdan ancha samarali. `Handle[T].Value()` qiymatning nusxasini qaytaradi. `Make` bir nechta goroutine'dan xavfsiz chaqiriladi.

Mexanizm kodda ko'rinadi: Go 1.24.7 manba kodida `Handle[T]` ichida bitta `*T` pointer bor. Shuning uchun handle 8 bayt, taqqoslash esa pointer taqqoslashi. Standart kutubxonaning o'zi ham shundan foydalanadi: `net/netip.Addr` IPv6 zona nomini `unique.Handle[addrDetail]` sifatida saqlaydi.

Telemetriyada bu quyidagicha ko'rinadi:

```go run
package main

import (
	"fmt"
	"runtime"
	"strings"
	"unique"
)

type Plain struct {
	Model string
}

type Interned struct {
	Model unique.Handle[string]
}

func heapKiB() uint64 {
	runtime.GC()
	var ms runtime.MemStats
	runtime.ReadMemStats(&ms)
	return ms.HeapAlloc >> 10
}

const n = 200_000

var (
	plain    []Plain
	interned []Interned
)

func main() {
	base := "Isuzu NPR 75L diesel 4x2 (tent, 2021)"

	a, b := unique.Make("Isuzu NPR"), unique.Make(strings.Clone("Isuzu NPR"))
	fmt.Println("Handle'lar teng:", a == b, "| Value:", a.Value())

	h0 := heapKiB()
	plain = make([]Plain, n)
	for i := range plain {
		plain[i].Model = strings.Clone(base) // har biri alohida nusxa
	}
	h1 := heapKiB()
	fmt.Printf("oddiy string: %d KiB\n", h1-h0)

	interned = make([]Interned, n)
	for i := range interned {
		interned[i].Model = unique.Make(strings.Clone(base))
	}
	h2 := heapKiB()
	fmt.Printf("unique.Handle: %d KiB\n", h2-h1)

	fmt.Println("qiymat o'zgarmadi:", interned[0].Model.Value() == plain[0].Model, len(plain), len(interned))
}
```

Taxminiy chiqish (xotira qiymatlari har ishga tushirishda biroz o'zgaradi):

```text
Handle'lar teng: true | Value: Isuzu NPR
oddiy string: 12502 KiB
unique.Handle: 1568 KiB
qiymat o'zgarmadi: true 200000 200000
```

200 ming yozuvdan iborat zanjir: oddiy `string` maydonlari uchun taxminan 12.5 MiB (16 baytli string header va 48 baytli ajratilgan matn har yozuvga), `unique.Handle` bilan taxminan 1.5 MiB (har yozuvga 8 bayt handle). Eksperimentda matn `strings.Clone` bilan har safar yangi nusxa qilingan, ya'ni haqiqiy tizimda ma'lumot JSON yoki tarmoqdan har safar yangi satr bo'lib kelishini taqlid qiladi.

## Misol: shard tanlash va model interning

Telemetriya hisoblagichini ikkita qaror bilan qurish mumkin. Birinchisi: `Key{Device, Day}` struct'i comparable, demak u bevosita `map[Key]int` kaliti bo'ladi (14-dars) va `maphash.Comparable` ga ham beriladi. Struct kalit kompilyatsiya vaqtida tekshiriladi: unga slice maydon qo'shsangiz, kod kompilyatsiyadan o'tmaydi. Bu `map[string]int` ga `Device + ":" + strconv.Itoa(day)` kabi qo'lda kalit yasashdan xavfsizroq: kalit tarkibi tipda ko'rinadi.

Ikkinchisi: shard raqami `maphash.Comparable(seed, key) % shards`. Vazifadagi kod aynan shuni so'raydi: hozirgi `len(key)`-ga asoslangan yechim bitta shard'ni to'ldiradi, hash tekis taqsimlaydi.

Model nomlari kabi kam xilma-xil, lekin ko'p takrorlanadigan satrlar uchun `unique.Handle[string]` maydoni ishlatiladi: yozuv kichrayadi, ikki yozuvning modeli tengligi esa `a.Model == b.Model` (pointer taqqoslash) bilan tekshiriladi. Kerak bo'lganda `Model.Value()` matnni qaytaradi.

## Qachon qo'llamaslik kerak

- `map[any]` yoki `any` bilan `==` ni tashqaridan kelgan qiymatlar uchun ishlatmang. Bir noto'g'ri tip jarayonni qulatadi. Kalit tipini aniq (struct yoki string) qiling, `any` kerak bo'lsa `reflect.Value.Comparable` bilan oldindan tekshiring (17-dars).
- Float kalitlardan qoching. `NaN` kalitni qayta topib bo'lmaydi, `+0` va `-0` esa bitta kalit. Telemetriya qiymatini kalit qilish o'rniga uni yaxlitlang yoki butun songa o'tkazing.
- `maphash` natijasini saqlamang, tarmoqqa yubormang va kriptografiya yoki xavfsizlikda ishlatmang: u kriptografik emas, seed jarayonga xos.
- `maphash` bilan o'z hash table'ingizni yozishdan avval haqiqatan kerakligini o'ylang. Odatda `map` yoki `sync.Map` yetarli; maphash shard tanlash va maxsus tuzilmalar uchun.
- `unique` ni har qanday satr uchun ishlatmang. Qiymatlar noyob bo'lsa (UUID, vaqt belgisi), interning faqat qo'shimcha ish: `Make` global jadvalga murojaat qiladi. Foyda kam xilma-xil, ko'p takrorlanadigan qiymatlarda (model nomi, status, zona).
- Interning oldidan o'lchang. Biz 200 ming yozuvli sintetik misolda foyda ko'rdik; sizning ma'lumotingizda takrorlanish darajasi boshqa bo'lishi mumkin va `Value()` chaqiruvi qo'shimcha indirection beradi.

## Stack'da: Node.js/TypeScript bilan solishtirish

JavaScript'da `===` primitiv qiymatlarni qiymat bo'yicha, obyektlarni identifikatsiya bo'yicha taqqoslaydi; `Map` kaliti sifatida obyekt faqat o'sha obyektning o'zi bilan topiladi, shuning uchun murakkab kalit uchun `JSON.stringify` yoki `a:b` kabi satr kaliti yasash odatiy. Go'da struct va massiv qiymat bo'yicha taqqoslanadi va to'g'ridan-to'g'ri kalit bo'la oladi, bu satr yasash ishini yo'qotadi. Evaziga interface orqali yashirin panic xavfi va NaN kabi istisnolar bor.

Amaliy qoidalar:

- Map kaliti uchun comparable struct ishlating; slice kerak bo'lsa, uni string yoki massivga aylantiring.
- `comparable` cheklovini berayotgan funksiyada argument `any` bo'lishi mumkinligini unutmang.
- Shard va hash uchun `maphash` ishlating, har kalitda yangi seed emas, jarayon uchun bitta seed.
- Kam xilma-xil satrlarni `unique.Handle` bilan saqlang, lekin avval o'lchang.

## Xulosa

- Struct va massiv qiymat bo'yicha taqqoslanadi (barcha maydonlar comparable bo'lsa); slice, map va funksiya faqat `nil` bilan.
- Interface qiymatlarini taqqoslash dinamik tiplar bir xil va comparable bo'lmasa run-time panic beradi; `map[any]` kaliti uchun ham shunday.
- `comparable` cheklovini interface tiplari ham qanoatlantiradi, lekin faqat strictly comparable tiplar panic bermaydi. `NaN` o'ziga teng emas.
- `hash/maphash` (`Comparable` Go 1.24 dan) comparable qiymatdan seed bilan `uint64` beradi; seed tasodifiy va jarayonga xos, shuning uchun natija saqlash uchun yaroqsiz.
- `unique.Make` (Go 1.23 dan) teng qiymatlar uchun bir xil `Handle` beradi; handle taqqoslash pointer taqqoslashi kabi arzon va 200 ming yozuvli o'lchovda xotirani taxminan 8 baravar kamaytirdi.
- Interning faqat kam xilma-xil, ko'p takrorlanadigan qiymatlarda foydali; avval o'lchang.
