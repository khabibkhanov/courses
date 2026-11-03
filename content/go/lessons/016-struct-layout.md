---
n: 16
slug: struct-layout
title: "Struct xotira joylashuvi: alignment, padding va maydonlar tartibi"
summary: "Struct maydonlari xotirada qanday joylashadi, alignment qoidasi nega padding hosil qiladi, maydonlar tartibi hajmni qanday o'zgartiradi, unsafe.Sizeof/Alignof/Offsetof bilan o'lchash va 32-bitli platformalardagi farqlar."
duration: 40
sources:
  - id: go-spec
    note: "Size and alignment guarantees bo'limi: sonli tiplar hajmi, struct va massiv alignment qoidasi, nol o'lchamli tiplar"
  - id: pkg-unsafe
    note: "Sizeof, Alignof va Offsetof funksiyalari hujjati (struct hajmi padding'ni o'z ichiga oladi)"
  - id: 100go
    note: "#94 (data alignment): maydonlarni kattadan kichikka tartiblash ixchamroq struct beradi"
quiz:
  - q: "amd64 da type T struct { A bool; B int64; C bool } ning hajmi (unsafe.Sizeof) necha bayt?"
    options:
      - "24"
      - "16"
      - "10"
      - "12"
    answer: 0
    explain: "A 0-ofsetda (1 bayt), B 8 baytga tekislanadi: 7 bayt padding, ofset 8. C ofset 16 da. Struct hajmi eng katta alignment (8) ga karrali bo'lishi kerak, shuning uchun 17 dan 24 gacha yaxlitlanadi. Maydonlar yig'indisi 10 bayt, lekin 14 bayt padding."
  - q: "Spetsifikatsiya (Size and alignment guarantees) quyidagilardan qaysi birini kafolatlaydi?"
    options:
      - "int tipi 8 bayt, chunki zamonaviy mashinalar 64-bitli"
      - "Struct hajmi maydonlar hajmlari yig'indisiga teng"
      - "uint32 va float32 4 bayt, float64 8 bayt; struct alignment'i maydonlar alignment'larining eng kattasi (kamida 1)"
      - "string header 16 bayt"
    answer: 2
    explain: "Spetsifikatsiya faqat aniq o'lchamli sonli tiplar hajmini va minimal alignment qoidalarini kafolatlaydi. int, uintptr, string va slice hajmi platformaga bog'liq (biz 386 da string 8, slice 12 bayt oldik) va struct hajmi padding tufayli yig'indidan katta bo'lishi mumkin."
  - q: "type U struct { A uint8; B int64; C uint8; D int32 } amd64 da 24 bayt. Maydonlarni qayta tartiblab erishish mumkin bo'lgan eng kichik hajm qancha?"
    options:
      - "14"
      - "16"
      - "18"
      - "24, tartib hajmga ta'sir qilmaydi"
    answer: 1
    explain: "Maydonlar yig'indisi 1 + 8 + 1 + 4 = 14 bayt. Struct hajmi 8 ga karrali bo'lishi kerak (alignment 8), shuning uchun eng kichigi 16. Tartib B, D, A, C: B@0, D@8, A@12, C@13, oxirida 2 bayt padding."
  - q: "Go 1.24.7 / amd64 da type M struct { ID uint64; _ struct{} } hajmi 16 chiqdi, M{} ning boshiga qo'yilsa 8. Nima uchun?"
    options:
      - "Bo'sh struct har doim 8 bayt egallaydi"
      - "Blank maydon (_) har doim 8 bayt padding qo'shadi"
      - "Spetsifikatsiya shunday talab qiladi"
      - "Kompilyator oxirgi nol o'lchamli maydon manzili struct chegarasidan tashqariga chiqmasligi uchun padding qo'shadi (gc implementatsiyasi); boshiga qo'yilsa kerak emas"
    answer: 3
    explain: "Spetsifikatsiya nol o'lchamli maydonlarning joylashuvi haqida bunday qoida bermaydi; bu gc toolchain'ning implementatsiya tafsiloti, shuning uchun bunga dastur mantiqini bog'lamang. Amalda esa nol o'lchamli maydonni struct oxiriga qo'ymang."
  - q: "GOARCH=386 da quyidagi struct bor: type C struct { Flag bool; Hits int64; Total atomic.Int64 }. Atomic operatsiyalar haqida qaysi gap to'g'ri?"
    options:
      - "atomic.Int64 tipi 64-bit alignment'ni o'zi ta'minlaydi; Hits ga atomic.AddInt64 qo'llash esa chaqiruvchining alignment javobgarligida"
      - "Ikkalasi ham avtomatik moslanadi, chunki Go struct'ni to'g'ri tekislaydi"
      - "386 da 64-bitli atomic operatsiyalar umuman mavjud emas"
      - "Hits ham, Total ham xavfsiz, faqat Flag bool bo'lgani uchun muammo"
    answer: 0
    explain: "sync/atomic hujjati: ARM, 386 va 32-bitli MIPS da oddiy 64-bitli so'zlarni primitive funksiyalar bilan atomik ishlatishda alignment'ni chaqiruvchi ta'minlashi kerak; Int64 va Uint64 tiplari avtomatik moslanadi. Biz 386 da Hits ofseti 4 (align 4), Total ofseti 16 (align 8) ekanini ko'rdik."
  - q: "Jamoa tarmoq protokoli uchun struct'ni unsafe.Pointer orqali baytlarga o'girib yubormoqchi. Asosiy xavf nima?"
    options:
      - "unsafe struct'ni o'qiy olmaydi"
      - "Struct qiymat bo'lgani uchun nusxalanadi"
      - "Joylashuv (padding, alignment, maydon hajmlari, endianness) platforma va toolchain'ga bog'liq va Go 1 kafolati doirasidan tashqarida; protokol uchun encoding/binary yoki aniq kodlash kerak"
      - "Padding baytlari har doim nol bo'lmasligi mumkin, lekin boshqa muammo yo'q"
    answer: 2
    explain: "Joylashuv implementatsiya va platformaga bog'liq (386 va amd64 da bir xil struct turli hajmda), unsafe esa compatibility kafolatidan tashqarida (1-dars). Padding baytlarida ham ixtiyoriy qiymat bo'lishi mumkin. Tashqi format uchun maydonlarni aniq kodlang."
task:
  title: "Reading struct'ini ixchamlashtirish"
  prompt: |
    Servis har bir datchikdan kelgan o'qishni `Reading` struct'ida saqlaydi va millionlab nusxani xotirada ushlab turadi. Boshlang'ich `Reading` amd64 da 56 bayt, maydonlar yig'indisi esa atigi 33 bayt: qolgani padding.

    Vazifa: maydonlarni qayta tartiblab hajmni imkon qadar kamaytiring. Maydon nomlari va tiplarini o'zgartirmang, faqat tartibini. Natijaviy hajm 40 bayt bo'lishi kerak. Qo'shimcha sifatida hajm 40 baytdan oshsa kompilyatsiya xato beradigan konstanta qo'riqchisini qo'shing.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "unsafe"
    )

    // Reading - GPS va yoqilg'i datchigidan kelgan bitta o'qish.
    // Millionlab nusxa xotirada turadi, shuning uchun hajmi muhim.
    type Reading struct {
        Valid bool
        Time  int64
        Sats  uint8
        Lat   float64
        Fuel  uint16
        Lon   float64
        Flags uint8
        Speed float32
    }

    func main() {
        var r Reading
        fmt.Println("hajm:", unsafe.Sizeof(r), "bayt")
        fmt.Println("1 000 000 ta o'qish:", uintptr(1_000_000)*unsafe.Sizeof(r)/1e6, "MB")
    }
  solution: |
    package main

    import (
        "fmt"
        "unsafe"
    )

    // Reading - GPS va yoqilg'i datchigidan kelgan bitta o'qish.
    // Maydonlar alignment bo'yicha kamayish tartibida: padding minimal.
    // Mantiqiy guruhlash izohlarda saqlangan.
    type Reading struct {
        // 8 baytli maydonlar
        Time int64
        Lat  float64
        Lon  float64
        // 4 va 2 baytli
        Speed float32
        Fuel  uint16
        // 1 baytli
        Valid bool
        Sats  uint8
        Flags uint8
    }

    // Kompilyatsiya vaqtidagi qo'riqchi: hajm 40 baytdan oshsa build xato beradi.
    const _ = 40 - unsafe.Sizeof(Reading{})

    func main() {
        var r Reading
        fmt.Println("hajm:", unsafe.Sizeof(r), "bayt")
        fmt.Println("1 000 000 ta o'qish:", uintptr(1_000_000)*unsafe.Sizeof(r)/1e6, "MB")
    }
  solutionNotes: |
    - Qoida: maydonlarni alignment bo'yicha kamayish tartibida joylashtiring. 8 baytli (`int64`, `float64`) hammasi boshida, keyin 4 baytli (`float32`), 2 baytli (`uint16`), 1 baytli (`bool`, `uint8`). Har maydon o'z alignment'iga karrali ofsetga tushadi, shuning uchun oralarida bo'shliq (padding) paydo bo'lmaydi.
    - Hisob: 8+8+8 = 24, +4 = 28, +2 = 30, +3 baytli maydonlar = 33. Struct alignment'i 8 bo'lgani uchun 33 dan 40 gacha yaxlitlanadi: faqat oxirida 7 bayt padding. 40 - bundan kichik bo'la olmaydi.
    - `const _ = 40 - unsafe.Sizeof(Reading{})` kompilyatsiya vaqtidagi qo'riqchi: `Sizeof` konstanta, `uintptr` ayirmasi manfiy bo'lsa konstanta overflow xatosi chiqadi. Kimdir keyinroq maydon qo'shib hajmni oshirsa, build to'xtaydi.
    - Maydonlar mantiqiy guruhlanishi (vaqt, koordinata, holat) izohlar bilan saqlandi. Bu o'qilishni buzmaslik uchun: har doim ham hajm o'qilishdan muhim emas (qarang "Qachon qo'llamaslik kerak").
    - 32-bitli platformada (`GOARCH=386`) bu struct boshqa hajm beradi; qo'riqchi 64-bitli platformalarga mo'ljallangan.
  checklist:
    - "`unsafe.Sizeof(Reading{})` aynan 40 bayt (amd64)"
    - "Barcha maydon nomlari va tiplari o'zgarishsiz saqlangan"
    - "Padding faqat struct oxirida: ichida bo'shliq yo'q"
    - "Hajm 40 dan oshsa build xato beradigan konstanta qo'riqchisi bor"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Telemetriya servisi har soniya o'n minglab o'qishni qabul qiladi va oxirgi daqiqalarni xotirada ushlab turadi. Har o'qish struct: vaqt, koordinata, tezlik, yoqilg'i, bir nechta bayroq. Kimdir maydonlarni mantiqiy tartibda yozadi (`Valid` birinchi, `Time` keyin) va hisob-kitob qilmaydi. Million o'qish 56 MB bo'lib chiqadi, aslida esa 40 MB yetarli edi: farq - struct ichidagi bo'sh joy. Bu 16 MB kichik ko'rinadi, ammo bunday struct'lar slice'larda, kesh va kanallarda ko'p nusxada yashaydi, va har bir cache line'ga kamroq element sig'adi.

Ikkinchi, nozikroq holat: 64-bitli hisoblagich atomik yangilanadi. 64-bitli mashinada hammasi ishlaydi, CI esa faqat shu platformada. Keyin xuddi shu kod 32-bitli ARM'ga (qurilma ichidagi agent) yig'iladi va 64-bitli so'z tekislanmagan bo'lib qoladi: `sync/atomic` hujjati bunday holat uchun alignment'ni ta'minlash chaqiruvchining vazifasi ekanini ochiq yozadi. Ikkala holatning ildizi bitta: struct maydonlari xotirada qanday joylashishini bilmaslik.

## Asosiy g'oya

### Alignment qoidasi

Protsessor ma'lumotni o'z hajmiga karrali manzillardan eng samarali (ba'zi arxitekturalarda faqat shunday) o'qiydi. Shuning uchun kompilyator har tipga alignment beradi: o'zgaruvchi manzili shu songa bo'linishi shart. Spetsifikatsiyaning "Size and alignment guarantees" bo'limi quyidagini kafolatlaydi:

- Sonli tiplar hajmi aniq: `byte`/`uint8`/`int8` - 1; `uint16`/`int16` - 2; `uint32`/`int32`/`float32` - 4; `uint64`/`int64`/`float64`/`complex64` - 8; `complex128` - 16.
- Har qanday o'zgaruvchi uchun `unsafe.Alignof` kamida 1.
- Struct uchun `Alignof` - maydonlari `Alignof` larining eng kattasi (kamida 1).
- Massiv uchun `Alignof` - element tipiniki bilan bir xil.
- Maydonsiz (yoki hajmi nol bo'lgan elementli) struct va massiv hajmi nol; ikki nol o'lchamli o'zgaruvchi bir manzilga ega bo'lishi mumkin.

Spetsifikatsiya shu bilan cheklanadi. `int`, `uintptr`, pointer, string va slice hajmi, shuningdek tipning aniq alignment'i platformaga bog'liq. gc kompilyatori struct maydonlarini e'lon qilingan tartibda joylashtiradi (quyidagi o'lchovlarda ofsetlar shuni ko'rsatadi), har maydon o'z alignment'iga karrali birinchi ofsetga qo'yiladi, orada paydo bo'lgan bo'shliq padding deyiladi. `unsafe.Sizeof` hujjati ham aytadi: struct hajmi alignment tufayli kiritilgan padding'ni o'z ichiga oladi. Struct hajmi esa o'zining alignment'iga karrali qilib yaxlitlanadi, shunda massivdagi har element to'g'ri tekislangan bo'ladi.

### O'lchash vositalari

`unsafe` paketi uch funksiya beradi: `Sizeof(x)` - hajm, `Alignof(x)` - alignment, `Offsetof(s.f)` - maydon ofseti. Hajmi o'zgaruvchan bo'lmagan tiplar uchun ularning natijasi konstanta (type parameter yoki o'zgaruvchan elementli massiv va struct bundan mustasno), shuning uchun ularni kompilyatsiya vaqtidagi tekshiruvlarda ishlatish mumkin. 100 Go Mistakes #94 oddiy qoida beradi: maydonlarni hajmi bo'yicha kamayish tartibida joylashtirish ixchamroq struct beradi.

## Chuqurroq: tartib, 32-bit va nol o'lchamli maydonlar

### Tartib hajmni o'zgartiradi

Bir xil to'rt-besh maydonni ikki xil tartibda yozamiz va o'lchaymiz:

```go run
package main

import (
	"fmt"
	"runtime"
	"unsafe"
)

// Sparse - maydonlar ehtiyotsiz tartibda.
type Sparse struct {
	Active bool
	Lat    float64
	Fuel   uint16
	Sats   uint8
	TS     int64
}

// Packed - xuddi shu maydonlar, kattadan kichikka.
type Packed struct {
	Lat    float64
	TS     int64
	Fuel   uint16
	Active bool
	Sats   uint8
}

func main() {
	fmt.Println("GOARCH:", runtime.GOARCH)
	fmt.Printf("bool=%d uint16=%d int64=%d string=%d slice=%d interface=%d\n",
		unsafe.Sizeof(true), unsafe.Sizeof(uint16(0)), unsafe.Sizeof(int64(0)),
		unsafe.Sizeof(""), unsafe.Sizeof([]int(nil)), unsafe.Sizeof(any(nil)))

	var s Sparse
	fmt.Printf("Sparse: size=%d align=%d\n", unsafe.Sizeof(s), unsafe.Alignof(s))
	fmt.Printf("  Active@%d Lat@%d Fuel@%d Sats@%d TS@%d\n",
		unsafe.Offsetof(s.Active), unsafe.Offsetof(s.Lat), unsafe.Offsetof(s.Fuel),
		unsafe.Offsetof(s.Sats), unsafe.Offsetof(s.TS))

	var p Packed
	fmt.Printf("Packed: size=%d align=%d\n", unsafe.Sizeof(p), unsafe.Alignof(p))
	fmt.Printf("  Lat@%d TS@%d Fuel@%d Active@%d Sats@%d\n",
		unsafe.Offsetof(p.Lat), unsafe.Offsetof(p.TS), unsafe.Offsetof(p.Fuel),
		unsafe.Offsetof(p.Active), unsafe.Offsetof(p.Sats))

	const n = 1_000_000
	fmt.Printf("%d ta element: Sparse %d MB, Packed %d MB\n",
		n, uintptr(n)*unsafe.Sizeof(s)/1e6, uintptr(n)*unsafe.Sizeof(p)/1e6)
}
```

Go 1.24.7, linux/amd64 da chiqish:

```text
GOARCH: amd64
bool=1 uint16=2 int64=8 string=16 slice=24 interface=16
Sparse: size=32 align=8
  Active@0 Lat@8 Fuel@16 Sats@18 TS@24
Packed: size=24 align=8
  Lat@0 TS@8 Fuel@16 Active@18 Sats@19
1000000 ta element: Sparse 32 MB, Packed 24 MB
```

`Sparse` da `Active bool` 0-ofsetda, undan keyin `Lat float64` 8 ga tekislanishi uchun 7 bayt padding; `Fuel` va `Sats` 16 va 18 da; `TS` yana 8 ga tekislanib 24 ga tushadi: jami 32. `Packed` da 8 baytlilar avval, keyin `uint16` va ikki bir baytli: 20 bayt ma'lumot, oxirida 4 bayt padding, jami 24. Maydonlar to'plami bir xil, 25% farq. Birinchi qatordagi o'lchamlar ham eslatma: `string` 16, `slice` 24, `interface` 16 bayt (amd64), bu uchlik ham alignment 8 ga ega.

### 32-bitli platformada boshqa natija

Xuddi shu dasturni `GOARCH=386` bilan ishga tushirdik (sandbox'da 32-bitli binary ishladi):

```text
GOARCH: 386
bool=1 uint16=2 int64=8 string=8 slice=12 interface=8
Sparse: size=24 align=4
  Active@0 Lat@4 Fuel@12 Sats@14 TS@16
Packed: size=20 align=4
  Lat@0 TS@8 Fuel@16 Active@18 Sats@19
1000000 ta element: Sparse 24 MB, Packed 20 MB
```

386 da `int64`/`float64` alignment'i 4: `Lat` ofseti 4, struct alignment'i 4. Pointer 4 bayt bo'lgani uchun `string` 8, `slice` 12, `interface` 8. Bu tafovut atomik operatsiyalarda muhim: `sync/atomic` hujjati ARM, 386 va 32-bitli MIPS da oddiy 64-bitli so'zni primitiv funksiyalar (`atomic.AddInt64`) bilan atomik ishlatsangiz, alignment'ni o'zingiz ta'minlashingiz kerakligini yozadi; `atomic.Int64` va `atomic.Uint64` tiplari esa avtomatik moslanadi. Tekshirdik:

```go run
package main

import (
	"fmt"
	"sync/atomic"
	"unsafe"
)

type Counters struct {
	Flag  bool
	Hits  int64        // oddiy int64
	Total atomic.Int64 // 64 bitli atomic: tip o'zi moslashuvni ta'minlaydi
}

func main() {
	var c Counters
	fmt.Println("GOARCH uchun int64 align:", unsafe.Alignof(c.Hits), "| atomic.Int64 align:", unsafe.Alignof(c.Total))
	fmt.Println("Hits offset:", unsafe.Offsetof(c.Hits), "| Total offset:", unsafe.Offsetof(c.Total))
	c.Total.Add(5)
	fmt.Println(c.Total.Load())
}
```

```text
GOARCH uchun int64 align: 8 | atomic.Int64 align: 8
Hits offset: 8 | Total offset: 16
5
```

amd64 da hammasi 8. Xuddi shu kod `GOARCH=386` da: `Hits` align 4 (ofset 4, ya'ni 8 ga karrali emas), `Total` esa align 8 va ofset 16: tip o'zi moslashadi va kompilyator oldiga padding qo'yadi. Xulosa: 64-bitli hisoblagich uchun doimo `atomic.Int64`/`atomic.Uint64` tiplarini ishlating (46-dars).

### Nol o'lchamli maydon oxirida

Spetsifikatsiya nol o'lchamli maydonlar uchun faqat "hajm nol" deydi. Quyidagi tajriba toolchain'ning aniq xatti-harakatini ko'rsatadi:

```go run
package main

import (
	"fmt"
	"unsafe"
)

type Marker struct {
	ID uint64
	_  struct{} // oxirgi nol o'lchamli maydon
}

type MarkerFirst struct {
	_  struct{}
	ID uint64
}

func main() {
	fmt.Println("struct{}:", unsafe.Sizeof(struct{}{}))
	fmt.Println("oxirida struct{} bor:", unsafe.Sizeof(Marker{}))
	fmt.Println("boshida struct{} bor:", unsafe.Sizeof(MarkerFirst{}))
	fmt.Println("[0]int64:", unsafe.Sizeof([0]int64{}))
}
```

```text
struct{}: 0
oxirida struct{} bor: 16
boshida struct{} bor: 8
[0]int64: 0
```

`Marker` oxirida `_ struct{}` bor va hajmi 16: oxirgi maydon ofseti struct hajmiga teng bo'lmasligi uchun gc kompilyatori padding qo'shadi (bu implementatsiya tafsiloti, spetsifikatsiyada yo'q). Boshida bo'lsa 8. `struct{}` ni "bepul" deb oxirga qo'ymang. 386 da xuddi shu tajriba 12 va 8 berdi.

### Ichma-ich struct va massiv: padding ichkarida qoladi

Struct maydoni sifatida boshqa struct kelsa, ichki struct o'zining hajmi va alignment'ini saqlaydi: kompilyator uni "yoyib" tashqi struct maydonlari bilan qayta aralashtirmaydi. Ichki struct'dagi padding tashqi struct'ga o'tadi va u yerda bo'sh joy sifatida qoladi. Bir xil to'rt maydon (`int64`, uchta `bool`) ichma-ich yozilsa 32 bayt, yassi yozilsa 16 bayt chiqadi: farq `Outer` ichidagi `Inner` ning 7 baytli padding'i va uning ikki tomonidagi `bool` larning o'z padding'idan keladi. Massivda esa element qadami aynan `Sizeof` ga teng: `[3]Reading40` 120 bayt, ikkinchi element birinchisidan 40 bayt narida. Demak, struct hajmidagi har bir ortiqcha bayt slice va massivdagi har elementga ko'payib boradi.

### Sizeof sayoz, new esa size class bo'yicha ajratadi

`unsafe.Sizeof` hujjati aniq aytadi: hajmga `x` ishora qilayotgan xotira kirmaydi. Slice uchun slice descriptor hajmi, interface uchun interface qiymatining o'zi qaytadi. Bu tipik xatoga olib keladi: "`[]byte` 24 bayt ekan" yoki "`string` 16 bayt ekan" degan xulosa ma'lumot hajmi haqida emas, faqat header hajmi haqida. Struct ichidagi `string` va slice maydonlari uchun ham shunday: ular `Sizeof` da 16 va 24 bayt (amd64), ma'lumotning o'zi alohida heap bloki.

Ikkinchi nozik joy: bitta-bitta heap'ga ajratilgan obyektlar (`new(T)`, `&T{}` natijasi escape qilsa, 20-dars) aynan `Sizeof` bayt egallamaydi. Quyidagi o'lchovda `runtime.MemStats.TotalAlloc` farqi har obyektga qancha bayt ajratilganini ko'rsatdi. Dastur 56 baytli va 40 baytli variantni, ichma-ich struct'ni, massiv qadamini va `Sizeof` sayozligini birga tekshiradi:

```go run
package main

import (
	"fmt"
	"runtime"
	"unsafe"
)

// Reading56 - topshiriqdagi boshlang'ich tartib (56 bayt).
type Reading56 struct {
	Valid bool
	Time  int64
	Sats  uint8
	Lat   float64
	Fuel  uint16
	Lon   float64
	Flags uint8
	Speed float32
}

// Reading40 - kamayish tartibida (40 bayt).
type Reading40 struct {
	Time  int64
	Lat   float64
	Lon   float64
	Speed float32
	Fuel  uint16
	Valid bool
	Sats  uint8
	Flags uint8
}

type Inner struct {
	A int64
	B bool
}

type Outer struct {
	X  bool
	In Inner
	Y  bool
}

type Flat struct {
	A int64
	B bool
	X bool
	Y bool
}

var sink56 []*Reading56
var sink40 []*Reading40

func heapPerObject[T any](n int, keep func(*T)) float64 {
	runtime.GC()
	var a, b runtime.MemStats
	runtime.ReadMemStats(&a)
	for i := 0; i < n; i++ {
		keep(new(T))
	}
	runtime.ReadMemStats(&b)
	return float64(b.TotalAlloc-a.TotalAlloc) / float64(n)
}

func main() {
	fmt.Println("Reading56:", unsafe.Sizeof(Reading56{}), "Reading40:", unsafe.Sizeof(Reading40{}))
	var o Outer
	fmt.Println("Inner:", unsafe.Sizeof(Inner{}), "Outer:", unsafe.Sizeof(o), "Flat:", unsafe.Sizeof(Flat{}))
	fmt.Println("Outer offsets: X", unsafe.Offsetof(o.X), "In", unsafe.Offsetof(o.In), "Y", unsafe.Offsetof(o.Y))

	// massiv: har element Sizeof qadamida
	var arr [3]Reading40
	fmt.Println("[3]Reading40:", unsafe.Sizeof(arr), "elem 1 offset:", uintptr(unsafe.Pointer(&arr[1]))-uintptr(unsafe.Pointer(&arr[0])))

	// Sizeof sayoz: satr va slice ichidagi ma'lumotni hisoblamaydi
	long := string(make([]byte, 1000))
	fmt.Println("Sizeof(\"\"):", unsafe.Sizeof(""), "Sizeof(1000 baytli string):", unsafe.Sizeof(long), "Sizeof(slice 1000):", unsafe.Sizeof(make([]byte, 1000)))

	// Alohida heap'ga ajratilgan obyektlar: haqiqiy ajratilgan bayt
	const n = 100000
	p56 := heapPerObject[Reading56](n, func(p *Reading56) { sink56 = append(sink56[:0], p) })
	p40 := heapPerObject[Reading40](n, func(p *Reading40) { sink40 = append(sink40[:0], p) })
	fmt.Printf("new(Reading56): %.0f bayt/obyekt, new(Reading40): %.0f bayt/obyekt\n", p56, p40)
}
```

Go 1.24.7, linux/amd64 da chiqish:

```text
Reading56: 56 Reading40: 40
Inner: 16 Outer: 32 Flat: 16
Outer offsets: X 0 In 8 Y 24
[3]Reading40: 120 elem 1 offset: 40
Sizeof(""): 16 Sizeof(1000 baytli string): 16 Sizeof(slice 1000): 24
new(Reading56): 64 bayt/obyekt, new(Reading40): 48 bayt/obyekt
```

56 baytli struct uchun obyekt boshiga 64 bayt, 40 baytli uchun 48 bayt ajratildi. Ya'ni heap'dagi alohida obyektlar uchun hajm allocator qabul qiladigan sinflarga yaxlitlanadi; biz aniq jadvalni manbadan tekshirmadik va faqat shu ikki o'lchovga tayanamiz. Amaliy xulosa ikki yo'nalishli. Birinchidan, million pointer'li obyekt saqlasangiz, `Sizeof` ko'paytmasi haqiqiy sarfni kam ko'rsatadi; haqiqiy sarfni `runtime.MemStats` yoki heap profil bilan o'lchang (63-dars). Ikkinchidan, tartibni o'zgartirish foydasi slice ichidagi qiymatlarda aniq (`[]Reading`: 56 dan 40 gacha), pointer'larda esa yaxlitlash tufayli kichikroq yoki bir xil bo'lishi mumkin. Shu sababli 386 da bu ikki struct (44 va 36 bayt) ham bir xil, 48 bayt ajratilishini ko'rdik.

### Tipik xatolar

- `Sizeof(x)` ni ma'lumot hajmi deb o'qish: satr, slice, map va interface uchun u faqat header hajmi.
- Hajmni qo'lda yig'indi bilan hisoblash: padding va oxirgi yaxlitlash unutiladi.
- Ichki struct'ni "yoyilgan" deb o'ylash: ichki padding qoladi, ixchamlik uchun maydonlarni tashqi struct'ga ko'chirish yoki ichki struct'ning o'zini ham tartiblash kerak.
- Tartibni o'zgartirib, tashqi formatga (fayl, tarmoq, `unsafe` orqali baytlar) bog'liq kodni buzish. Bunday kodda joylashuvga umuman tayanmaslik kerak.
- Faqat bitta platformada o'lchash: yuqorida 386 da ham natija farq qildi, shuning uchun hajm qo'riqchisi (`const _ = N - unsafe.Sizeof(T{})`) qaysi `GOARCH` uchun yozilganini izohda ko'rsating.

## Misol: Reading struct'i va konstanta qo'riqchi

Topshiriqdagi `Reading` 56 bayt edi, maydonlar yig'indisi 33. Kamayish tartibi (8, 4, 2, 1 baytlilar) bilan 40 bayt chiqadi: faqat oxirida 7 bayt padding, 33 ni 8 ga yaxlitlash natijasi. Tartibni saqlab qolish uchun kompilyatsiya vaqtidagi qo'riqchi yoziladi:

```go
const _ = 40 - unsafe.Sizeof(Reading{})
```

`unsafe.Sizeof` konstanta, ayirma `uintptr` tipida. Struct 40 baytdan oshsa, ayirma manfiy bo'ladi va kompilyator `40 - unsafe.Sizeof(Reading{}) (constant -24 of type uintptr) overflows uintptr` ko'rinishidagi xatoni beradi. Biz buni maydon qo'shib tekshirdik (Go 1.24.7): build to'xtadi. Shunday qilib, hajm kodning bir qismi: tartibni buzgan o'zgarish review'ga qadar yo'l topmaydi.

## Qachon qo'llamaslik kerak

- Har struct'ni tartiblash kerak emas. Hajm muhim bo'lgan joy: katta slice'lar, kesh, bir million ob'ekt. Bir necha nusxali konfiguratsiya struct'ida padding ahamiyatsiz, o'qilish muhimroq.
- Mantiqiy guruhlash ham qiymat: `Lat` va `Lon` yonma-yon, `Time` yonida holat bayroqlari. Hajm tejalishi sezilarli bo'lmasa, o'qilishni tanlang; yuqoridagi yechimdagi kabi izoh bilan guruhlang.
- Hajm cache'ga ham ta'sir qiladi, lekin faqat ixchamlik emas: bir vaqtda ishlatiladigan maydonlarni yonma-yon qo'yish va ikki goroutine yozadigan maydonlarni bir cache line'dan ajratish (false sharing) boshqa masala (66-dars).
- Struct maydon tartibini tashqi formatga bog'lamang. Xotira joylashuvi tarmoq yoki fayl formati emas: `encoding/binary` yoki protobuf kabi aniq kodlashdan foydalaning. `unsafe` bilan struct'ni baytlarga o'girish Go 1 compatibility doirasidan tashqarida (1-dars) va platformaga bog'liq.
- Maydon tartibini avtomatik tekshiruvchi tahlilchi (`fieldalignment`) haqida eshitgan bo'lishingiz mumkin: u Go 1.24.7 `go vet` tahlilchilari ro'yxatida yo'q (`go tool vet help` da topilmadi) va biz uni bu darsda sinab ko'rmadik. Qo'lda hisob va `unsafe.Sizeof` o'lchovi yetarli.

## Stack'da: Node.js/TypeScript bilan solishtirish

JavaScript obyektlarida maydon joylashuvi dasturchiga ko'rinmaydi va boshqarilmaydi: V8 o'zi hal qiladi. Binar ma'lumot uchun `ArrayBuffer` va `DataView` ishlatiladi, ofsetlarni siz aniq yozasiz. Go'da struct ham oddiy tip, ham xotira shakli: maydonlar kompilyator tartibida ketma-ket joylashadi, siz tartibni boshqarasiz, ofsetlarni esa kompilyator hisoblaydi.

Amaliy qoidalar:

- Ko'p nusxali tiplarda (slice elementi, map qiymati, kanal elementi) maydonlarni alignment bo'yicha kamayish tartibida yozing va `Sizeof` ni o'lchang.
- Muhim struct hajmiga `const _ = N - unsafe.Sizeof(T{})` qo'riqchisini qo'ying.
- 64-bitli atomik hisoblagichlar uchun `atomic.Int64`; plain `int64` + `atomic.AddInt64` ni 32-bitli platformalarda ishlatmang.
- Tashqi formatlar uchun struct joylashuviga emas, `encoding/binary`, protobuf yoki JSON'ga tayaning.
- Hajm farqi muhim ekanini heap profil (63-dars) ko'rsatganda optimallashtiring, oldindan emas.

## Xulosa

- Struct maydonlari (gc toolchain'da) e'lon qilingan tartibda joylashadi; har maydon o'z alignment'iga karrali ofsetga tushadi, orada padding qoladi.
- Struct hajmi alignment'iga karrali yaxlitlanadi va padding'ni o'z ichiga oladi; maydonlarni kamayish tartibida yozish odatda eng ixchamini beradi.
- Spetsifikatsiya faqat sonli tiplar hajmi va alignment qoidalarini kafolatlaydi; `int`, pointer, string, slice hajmi va nol o'lchamli maydon padding'i platforma yoki toolchain tafsiloti.
- `unsafe.Sizeof/Alignof/Offsetof` bilan o'lchang; `const _ = N - unsafe.Sizeof(T{})` hajmni build vaqtida qo'riqlaydi.
- 32-bitli platformalarda 64-bitli maydonlar alignment'i boshqacha: atomik hisoblagichlar uchun `atomic.Int64` ishlating.
- Joylashuv tashqi format emas; o'qilish va hajm orasida tanlov qiling, hajmni faqat ko'p nusxali tiplarda kamaytiring.
