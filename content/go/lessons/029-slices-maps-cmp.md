---
n: 29
slug: slices-maps-cmp
title: "slices, maps va cmp paketlari chuqur"
summary: "slices, maps va cmp standart paketlari: saralash va qidirish, in-place o'zgartiruvchi funksiyalarning semantikasi (Compact, Delete, Insert), NaN bilan taqqoslash, cmp.Or bilan ko'p kalitli saralash va iterator qaytaradigan maps/slices funksiyalari."
duration: 45
sources:
  - id: pkg-slices
    note: "Package slices hujjati: Sort, SortFunc, SortStableFunc, BinarySearch, Compact, Delete, Insert, Clone, Max, Chunk, Collect, Sorted funksiyalarining shartnomalari"
  - id: pkg-maps
    note: "Package maps hujjati: Keys, Values, All, Collect, Clone, Copy, DeleteFunc, Equal"
  - id: pkg-cmp
    note: "Package cmp hujjati: Ordered, Compare, Less, Or ta'riflari, NaN va -0.0 qoidalari"
quiz:
  - q: "`slices.SortFunc(rs, func(a, b Reading) int { if a.Fuel <= b.Fuel { return -1 }; return 1 })`. Bu taqqoslash funksiyasi bilan nima noto'g'ri?"
    options:
      - "Hech narsa: `-1` va `1` yetarli"
      - "Teng elementlar uchun ham `-1` qaytaradi: `cmp` strict weak ordering bo'lishi va teng/solishtirib bo'lmaydigan elementlar uchun `0` qaytarishi kerak; aks holda natija noto'g'ri bo'lishi mumkin"
      - "`int` qaytarish mumkin emas, `bool` kerak"
      - "`SortFunc` faqat `cmp.Ordered` tiplar bilan ishlaydi"
    answer: 1
    explain: "Hujjat: `cmp(a, b)` a < b bo'lsa manfiy, a > b bo'lsa musbat, a == b yoki taqqoslanmaydigan bo'lsa nol qaytarishi va strict weak ordering bo'lishi kerak. `<=` bilan `-1` qaytarish `a == b` holatida ham `cmp(a,b) < 0` va `cmp(b,a) < 0` beradi, ya'ni tartib shartlari buziladi."
  - q: "`raw := []string{\"a\",\"a\",\"b\",\"a\",\"a\"}; c := slices.Compact(raw)`. `c` va `raw` nima bo'ladi (Go 1.24.7)?"
    options:
      - "`c = [a b a]`, `raw` o'zgarmaydi"
      - "`c = [a b]`, `raw` o'zgarmaydi"
      - "`c = [a b]`, `raw = [a b]`"
      - "`c = [a b a]`; `raw` ham o'zgaradi: `[a b a \"\" \"\"]` (oxirgi elementlar nolga tenglanadi)"
    answer: 3
    explain: "`Compact` faqat yonma-yon takrorlarni olib tashlaydi (uchinchi `a` birinchi `a` bilan yonma-yon emas) va asl slice'ni o'zgartiradi; hujjat: yangi uzunlik va asl uzunlik oralig'idagi elementlar nolga tenglanadi. Asl ma'lumot kerak bo'lsa avval `slices.Clone`."
  - q: "`cmp.Compare(math.NaN(), 1)` va `cmp.Compare(math.NaN(), math.NaN())` natijasi?"
    options:
      - "`-1` va `0`: NaN har qanday NaN bo'lmagan qiymatdan kichik hisoblanadi va NaN'ga teng"
      - "`0` va `0`"
      - "`1` va `1`"
      - "Panic: NaN solishtirib bo'lmaydi"
    answer: 0
    explain: "`cmp` hujjati: floating-point uchun NaN har qanday NaN bo'lmagan qiymatdan kichik, NaN NaN'ga teng, -0.0 esa 0.0'ga teng. Shu sababli `slices.Sort` NaN'larni boshiga qo'yadi. Oddiy `<` operatori esa NaN bilan doim `false` beradi."
  - q: "`slices.Max([]float64{1, math.NaN(), 3})` nima qaytaradi?"
    options:
      - "`3`"
      - "`1`"
      - "`NaN`: floating-point uchun `Max` NaN'ni tarqatadi (har qanday NaN natijani NaN qiladi)"
      - "Panic"
    answer: 2
    explain: "Hujjat: `Max` bo'sh slice'da panic beradi, floating-point uchun esa NaN'larni propagate qiladi: xohlagan NaN natijani NaN qiladi. Oddiy sikl `if x > max` NaN'ni jimgina o'tkazib yuborar edi, shuning uchun bu xatti-harakat farqini bilish kerak."
  - q: "Go 1.24 da `keys := maps.Keys(m); sort.Strings(keys)` yozildi. Natija?"
    options:
      - "Ishlaydi: `maps.Keys` kalitlar slice'ini qaytaradi"
      - "Ishlaydi, lekin tartib kafolatlanmaydi"
      - "Kompilyatsiya xatosi: `maps.Keys` Go 1.23 dan `iter.Seq[K]` qaytaradi, `[]string` emas; `slices.Sorted(maps.Keys(m))` kerak"
      - "Run-time panic"
    answer: 2
    explain: "Standart `maps.Keys` Go 1.23 da iterator qaytaradigan qilib kiritilgan (api/go1.23.txt). `sort.Strings` `[]string` kutadi. To'g'ri yozuv: `slices.Sorted(maps.Keys(m))`. Eski `golang.org/x/exp/maps` versiyasi slice qaytarar edi, shuning uchun eski kod ko'chirilganda shu xato uchraydi."
  - q: "`ids := []string{\"T-1\",\"T-2\",\"T-5\",\"T-9\"}`. `slices.BinarySearch(ids, \"T-4\")` nima qaytaradi?"
    options:
      - "`-1, false`"
      - "`0, false`"
      - "`2, false`: topilmadi, lekin saralash tartibida `T-4` turishi kerak bo'lgan pozitsiya"
      - "`2, true`"
    answer: 2
    explain: "Hujjat: `BinarySearch` target topilgan eng kichik indeksni yoki saralash tartibida turishi kerak bo'lgan pozitsiyani qaytaradi, va topildi-topilmadi `bool`i bilan. `-1` qaytarmaydi. Slice o'sish tartibida saralangan bo'lishi shart; saralanmagan slice'da natija ma'nosiz."
task:
  title: "Qo'lda yozilgan saralash va kalit yig'ishni slices/maps/cmp bilan almashtirish"
  prompt: |
    Hisobot kodi qurilmalar bo'yicha o'lchovlarni guruhlaydi, kalitlarni qo'lda yig'ib `sort.Strings` bilan saralaydi, har bir guruhni `sort.Slice` bilan indekslar va ichma-ich `if` orqali saralaydi va `[:2]` uchun uzunlikni qo'lda tekshiradi.

    Vazifa (chiqish bir xil qolsin):
    1. Kalitlar ro'yxatini `slices.Sorted(maps.Keys(...))` bilan oling.
    2. Guruh ichidagi saralashni `slices.SortFunc` va `cmp.Or` + `cmp.Compare` bilan yozing (yoqilg'i kamayish, so'ng soat o'sish bo'yicha).
    3. `[:2]` ni `min(2, len(list))` bilan almashtiring.
    4. Eski `sort` paketi importi kerak bo'lmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sort"
    )

    type Reading struct {
        Device string
        Fuel   float64
        Hour   int
    }

    func main() {
        rs := []Reading{
            {"T-3", 40, 9}, {"T-1", 75, 8}, {"T-2", 40, 7}, {"T-1", 60, 9}, {"T-1", 75, 6}, {"T-2", 55, 8},
        }

        byDevice := map[string][]Reading{}
        for _, r := range rs {
            byDevice[r.Device] = append(byDevice[r.Device], r)
        }

        // Qo'lda: kalitlarni yig'ib saralash.
        var devices []string
        for d := range byDevice {
            devices = append(devices, d)
        }
        sort.Strings(devices)

        for _, d := range devices {
            list := byDevice[d]
            // Qo'lda ko'p kalitli taqqoslash: yoqilg'i kamayish, soat o'sish bo'yicha.
            sort.Slice(list, func(i, j int) bool {
                if list[i].Fuel != list[j].Fuel {
                    return list[i].Fuel > list[j].Fuel
                }
                return list[i].Hour < list[j].Hour
            })
            // Qo'lda: eng ko'pi bilan 2 ta.
            if len(list) > 2 {
                list = list[:2]
            }
            fmt.Println(d, list)
        }
    }
  solution: |
    package main

    import (
        "cmp"
        "fmt"
        "maps"
        "slices"
    )

    type Reading struct {
        Device string
        Fuel   float64
        Hour   int
    }

    func main() {
        rs := []Reading{
            {"T-3", 40, 9}, {"T-1", 75, 8}, {"T-2", 40, 7}, {"T-1", 60, 9}, {"T-1", 75, 6}, {"T-2", 55, 8},
        }

        byDevice := map[string][]Reading{}
        for _, r := range rs {
            byDevice[r.Device] = append(byDevice[r.Device], r)
        }

        for _, d := range slices.Sorted(maps.Keys(byDevice)) {
            list := byDevice[d]
            // Yoqilg'i kamayish, so'ng soat o'sish bo'yicha: cmp.Or zanjiri.
            slices.SortFunc(list, func(a, b Reading) int {
                return cmp.Or(cmp.Compare(b.Fuel, a.Fuel), cmp.Compare(a.Hour, b.Hour))
            })
            fmt.Println(d, list[:min(2, len(list))])
        }
    }
  solutionNotes: |
    - `slices.Sorted(maps.Keys(byDevice))` ikki qadamni (kalit yig'ish va saralash) bitta ifodada bajaradi. `maps.Keys` iterator qaytaradi (Go 1.23), `Sorted` uni yig'ib saralaydi.
    - `cmp.Or(cmp.Compare(b.Fuel, a.Fuel), cmp.Compare(a.Hour, b.Hour))` birinchi nol bo'lmagan natijani qaytaradi: yoqilg'i teng bo'lganda soat bo'yicha solishtiradi. Argumentlar tartibi (`b, a`) kamayish tartibini beradi.
    - `slices.SortFunc` `int` qaytaradigan funksiya oladi va elementlarni to'g'ridan-to'g'ri (indekssiz) uzatadi: `sort.Slice`dagi `list[i]`/`list[j]` xatolari yo'q.
    - `min(2, len(list))` Go 1.21 dan o'rnatilgan `min` funksiyasi: ichma-ich `if len(list) > 2` kerak emas.
    - `SortFunc` stable emas; yoqilg'i va soat teng bo'lgan elementlar bo'lsa, tartib kafolatlanmaydi. Bu topshiriqda bunday juftlik yo'q; bo'lsa `SortStableFunc` yoki uchinchi kalit qo'shiladi.
  checklist:
    - "Kalitlar `slices.Sorted(maps.Keys(...))` bilan olingan"
    - "Guruhni saralash `slices.SortFunc` + `cmp.Or`/`cmp.Compare` bilan"
    - "`min(2, len(list))` ishlatilgan, `sort` importi olib tashlangan"
    - "Chiqish starter'dagi bilan bir xil"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go 1.21 gacha eng oddiy operatsiyalar uchun ham o'z siklingizni yozish kerak edi: slice'da element qidirish, slice nusxalash, map kalitlarini yig'ish, struct'larni ikki maydon bo'yicha saralash. Standart `sort` paketi esa `sort.Slice(x any, less func(i, j int) bool)` kabi interface/reflection asosidagi API berardi: tip xavfsiz emas, indekslar orqali ishlaydi va xato qilish oson (`less` ichida noto'g'ri slice'ga murojaat). Natijada har bir jamoa o'z `Contains`, `Keys`, `Max` yordamchilarini yozar va ular turlicha xatolarga ega bo'lardi (NaN bilan ishlamaslik, bo'sh slice'da noto'g'ri nol qiymat).

Go 1.21 `slices`, `maps` va `cmp` paketlarini standart kutubxonaga qo'shdi, Go 1.23 ularga iterator API'larini berdi. Bu paketlar generics (24-dars) va iterator'lar (28-dars) ustiga qurilgan va dasturchi har kuni ishlatadigan funksiyalar to'plami. Lekin ular oddiy ko'rinishi bilan bir qatorda aniq shartnomalarga ega: qaysi funksiya asl slice'ni o'zgartiradi, NaN qanday taqqoslanadi, qaysi funksiya saralangan kirishni talab qiladi. Bu dars shu shartnomalarni hujjatdan o'qib, Go 1.24.7 da tekshiradi.

## Asosiy g'oya

### Paketlar va versiyalar

Go distributividagi `api/go1.NN.txt` fayllari qaysi funksiya qaysi versiyada paydo bo'lganini ko'rsatadi. Bu dars uchun asosiylari:

- Go 1.21: `cmp` (`Ordered`, `Compare`, `Less`), `slices` (`Sort`, `SortFunc`, `BinarySearch`, `Insert`, `Delete`, `Max` va boshqalar) va `maps` (`Clone`, `Copy`, `DeleteFunc`, `Equal`).
- Go 1.22: `cmp.Or`.
- Go 1.23: iterator'lar: `maps.Keys`, `maps.Values`, `maps.All`, `maps.Collect`, `slices.All`, `slices.Values`, `slices.Collect`, `slices.Sorted`, `slices.Chunk`, `slices.Repeat`.

Ya'ni `maps.Keys` standart kutubxonada boshidan slice emas, iterator qaytaradi. Eski `golang.org/x/exp/maps` kodini ko'chirganda bu farq kompilyatsiya xatosi bilan chiqadi.

### cmp: taqqoslash

`cmp.Ordered` - tartiblanadigan tiplar constraint'i (24-dars). `cmp.Compare(x, y)` -1, 0 yoki +1 qaytaradi. `cmp.Less(x, y)` `bool` qaytaradi. Floating-point uchun hujjat qoidasi: NaN har qanday NaN bo'lmagan qiymatdan kichik, NaN NaN'ga teng, `-0.0` esa `0.0`ga teng. Shu sababli `cmp.Compare` to'liq tartib beradi, oddiy `<` operatori esa NaN bilan doim `false`.

`cmp.Or(vals...)` birinchi nol qiymatga teng bo'lmagan argumentni qaytaradi (hammasi nol bo'lsa nol qiymatni). Taqqoslash funksiyalarida bu ko'p kalitli saralashning ixcham yozuvi: `cmp.Or(cmp.Compare(a.X, b.X), cmp.Compare(a.Y, b.Y))` - birinchi kalit teng bo'lsa (natija 0) ikkinchisiga o'tadi.

### slices: saralash va qidirish

- `Sort(x)` - `cmp.Ordered` tiplar uchun o'sish tartibida; hujjat: floating-point'da NaN'lar boshqa qiymatlardan oldin turadi. `IsSorted(x)` tekshiradi.
- `SortFunc(x, cmp)` - ixtiyoriy tip uchun `cmp func(a, b E) int`. Hujjat: bu saralash stable emas; `cmp` manfiy (a < b), musbat (a > b) yoki nol (a == b yoki solishtirib bo'lmaydi) qaytarishi va strict weak ordering bo'lishi shart. `SortStableFunc` teng elementlarning asl tartibini saqlaydi.
- `BinarySearch(x, target)` - `(index, found)`: topilgan eng kichik indeks yoki target saralash tartibida turishi kerak bo'lgan pozitsiya. Slice o'sish tartibida saralangan bo'lishi shart.
- `Index`, `Contains`, `IndexFunc`, `Equal`, `Max`, `Min` (va `MaxFunc`, `MinFunc`). `Max`/`Min` bo'sh slice'da panic beradi, floating-point'da NaN'ni tarqatadi.

### slices: o'zgartirish

- `Insert(s, i, v...)` - `i` pozitsiyaga qiymatlarni qo'shib, o'zgargan slice'ni qaytaradi; `i > len(s)` bo'lsa panic.
- `Delete(s, i, j)` - `s[i:j]` ni olib tashlaydi; hujjat: oxirgi `j-i` ta element nolga tenglanadi.
- `Compact(s)` - yonma-yon takrorlarni birga kamaytiradi (Unix `uniq` kabi); oxirgi elementlarni nolga tenglaydi.
- `Clone(s)` - sayoz nusxa (elementlar tayinlash bilan ko'chiriladi).
- `Chunk(s, n)` - `n` uzunlikli ketma-ket sub-slice'lar iteratori; hujjat: har bir sub-slice sig'imi uzunlikdan oshmaydi (clipped), ya'ni biriga `append` qilish keyingisini buzmaydi. `n < 1` bo'lsa panic.

### maps

`Keys`, `Values`, `All` iterator qaytaradi (tartib aniqlanmagan, chaqiruvdan chaqiruvga farq qilishi mumkin). `Collect(seq2)` iteratordan map yig'adi. `Clone(m)` sayoz nusxa. `Copy(dst, src)` kalitlarni nusxalaydi va mavjud kalitni ustiga yozadi. `DeleteFunc(m, del)` shart bo'yicha o'chiradi. `Equal` ikki map'ni kalit va qiymat bo'yicha taqqoslaydi.

## Chuqurroq: in-place semantika va NaN

### O'zgartiruvchi funksiyalar asl slice'ga ta'sir qiladi

`Insert`, `Delete`, `Compact` slice'ni joyida o'zgartiradi va yangi slice header qaytaradi. Natijani doim qaytarilgan qiymatdan oling (`s = slices.Delete(s, 0, 2)`). Asl `s` o'zgargan, uzunligi esa eski. Bu 12-darsdagi aliasing bilan bevosita bog'liq: ikki o'zgaruvchi bitta massivga qarasa, birining `Delete`i ikkinchisini o'zgartiradi. Asl ma'lumot kerak bo'lsa avval `slices.Clone`. Misolda:

```go
raw := []string{"a", "a", "b", "a", "a"}
compact := slices.Compact(raw)
fmt.Printf("%q %q\n", compact, raw)
```

```text
["a" "b" "a"] ["a" "b" "a" "" ""]
```

Chiqish Go 1.24.7 dan. `Compact` uchinchi `a`ni olib tashlamadi, chunki u birinchi `a` bilan yonma-yon emas; shuningdek asl `raw`ning oxirgi ikki elementi nolga tenglandi. Nolga tenglash xotira uchun foydali: pointer saqlovchi slice'larda eski pointer'lar GC'dan yashirin ushlanib qolmaydi (12-dars). Shuning uchun `Delete` hujjati elementlar nolga tenglanishini alohida ta'kidlaydi.

### Taqqoslash funksiyasi to'g'ri bo'lishi shart

`SortFunc` qoidasi qattiq: `cmp` strict weak ordering bo'lishi kerak. Tipik xato: `if a.Fuel <= b.Fuel { return -1 }; return 1` (teng elementlar uchun ham `-1`) - hujjat talabini buzadi. Ikkinchi xato: float maydonlarni `a.Fuel - b.Fuel` ayirmasi bilan solishtirish: NaN va overflow bilan noto'g'ri. To'g'ri yozuv `cmp.Compare(a.Fuel, b.Fuel)`.

### NaN

`slices.Max` va `Min` NaN'ni tarqatadi (xohlagan NaN natijani NaN qiladi). Oddiy sikl `if x > max` NaN'ni jimgina tashlab ketadi. Telemetriya (GPS, datchiklar) NaN ishlab chiqarishi mumkin, shuning uchun bu farq muhim: kerakli xatti-harakatni tanlang va ma'lumotni oldindan tozalang.

### Iteratorlar bilan kompozitsiya

`slices.Sorted(maps.Keys(m))`, `maps.Collect(slices.All(xs))`, `slices.Collect(...)` iterator va slice/map o'rtasidagi ko'prik. Cheksiz iteratorga `Collect` berilsa dastur tugamaydi (28-dars), shuning uchun avval uzunlikni cheklang.

### Go 1.22 o'zgarishlari va ular nimani o'zgartirdi

`Delete`, `DeleteFunc`, `Compact`, `CompactFunc` va `Replace` slice'ni qisqartiradi. Go 1.22 release notes ("slices" bo'limi): bu funksiyalar endi yangi uzunlik bilan eski uzunlik orasidagi elementlarni nolga tenglaydi. Go 1.21 da bu qadam yo'q edi, shuning uchun pointer saqlovchi slice'dan element o'chirilganda chiqib ketgan pointer massivda qolib, GC'dan obyektni ushlab turishi mumkin edi (bu mantiqiy oqibat, notes'da yozilmagan). Bu darsdagi "oxirgi elementlar nolga tenglanadi" qoidasi Go 1.22 va undan keyingi toolchain uchun to'g'ri. Shu release'da yana ikki o'zgarish: `slices.Concat` qo'shildi (bir nechta slice'ni yangi slice'ga birlashtiradi) va `Insert` endi `i` chegaradan tashqarida bo'lsa har doim panic beradi (oldin qo'shiladigan element bo'lmasa panic bermasdi). Bizning tajribada `slices.Insert([]int{1, 2}, 5)` `slice bounds out of range [5:2]` panic'ini berdi.

### Natijani tashlab yuborish

Eng keng tarqalgan xato: `slices.Delete(s, 1, 2)` ni yozib, qaytgan slice'ni `s` ga tayinlamaslik. `s` ning uzunligi eskicha qoladi, oxirida esa nol qiymat paydo bo'ladi, chunki elementlar siljigan va oxirgi katak nolga tenglangan. Go 1.24.7 da bu kod kompilyatsiya bo'lib ishlaydi va `[10 30 40 0]` chiqaradi, `go vet` esa uni ushlaydi:

```text
# e029v
# [e029v]
./main.go:10:15: result of slices.Delete call not used
```

Shu sababli CI da `go vet` majburiy bo'lishi kerak (40-dars). Telemetriya ma'lumotida bu xato ayniqsa xavfli: oxiridagi `0` yoqilg'i darajasi sifatida o'qilib, jimgina noto'g'ri statistika beradi. Xuddi shu qoida `Insert`, `Compact`, `Replace` va boshqa slice qaytaruvchi funksiyalarga tegishli.

### Nomlangan tip, nil va NaN

Funksiya imzolari `func Clone[S ~[]E, E any](s S) S` shaklida, ya'ni natija tipi argument tipi bilan bir xil: `type Route []Point` ni `Clone` qilsangiz `Route` qaytadi, `[]Point` emas. Shuning uchun nomlangan slice tipi o'z metodlarini yo'qotmaydi. Quyidagi dastur bundan tashqari bir nechta kam ma'lum nozikliklarni tekshiradi:

```go
package main

import (
	"cmp"
	"fmt"
	"maps"
	"math"
	"slices"
)

type Point struct {
	Lat, Lon float64
}

// Route nomlangan slice tipi: Clone, Insert va boshqalar tipni saqlaydi.
type Route []Point

type Device struct {
	ID   string
	Fuel float64
}

func main() {
	// 1. Natijani tashlab yuborish: asl slice'da nol qiymat qoladi
	s := []int{10, 20, 30, 40}
	_ = slices.Delete(s, 1, 2) // natija bilan nima qilinishini ko'rsatish uchun tashlanadi
	fmt.Println("natija tashlangan:", s, "| len:", len(s))
	s = []int{10, 20, 30, 40}
	s = slices.Delete(s, 1, 2)
	fmt.Println("natija olingan:   ", s, "| len:", len(s))

	// 2. Nomlangan tip saqlanadi
	r := Route{{41.3, 69.2}, {41.4, 69.3}}
	c := slices.Clone(r)
	fmt.Printf("Clone tipi: %T | Insert tipi: %T\n", c, slices.Insert(r, 0, Point{}))

	// 3. nil va bo'sh slice/map
	var ns []int
	fmt.Println("Clone(nil) == nil:", slices.Clone(ns) == nil, "| Clone(bo'sh) == nil:", slices.Clone([]int{}) == nil)
	var nm map[string]int
	fmt.Println("maps.Clone(nil) == nil:", maps.Clone(nm) == nil)

	// 4. Equal va NaN
	nan := math.NaN()
	fmt.Println("slices.Equal NaN:", slices.Equal([]float64{nan}, []float64{nan}), "| Compare:", slices.Compare([]float64{nan}, []float64{nan}))

	// 5. BinarySearchFunc: struct slice'da kalit bo'yicha qidirish
	ds := []Device{{"T-1", 54.5}, {"T-3", 12}, {"T-5", 80}}
	i, ok := slices.BinarySearchFunc(ds, "T-3", func(d Device, id string) int { return cmp.Compare(d.ID, id) })
	j, ok2 := slices.BinarySearchFunc(ds, "T-4", func(d Device, id string) int { return cmp.Compare(d.ID, id) })
	fmt.Println(i, ok, j, ok2)

	// 6. Concat, Grow, Clip
	all := slices.Concat([]int{1, 2}, nil, []int{3})
	fmt.Println(all, len(all), cap(all))
	g := slices.Grow([]int{1}, 10)
	fmt.Println("Grow:", len(g), cap(g) >= 11)
	cl := slices.Clip(g)
	fmt.Println("Clip:", len(cl), cap(cl))

	// 7. SortStableFunc: teng kalitlarda asl tartib saqlanadi
	byFuel := []Device{{"A", 40}, {"B", 40}, {"C", 10}, {"D", 40}}
	slices.SortStableFunc(byFuel, func(a, b Device) int { return cmp.Compare(a.Fuel, b.Fuel) })
	fmt.Println(byFuel)

	// 8. MaxFunc / MinFunc
	top := slices.MaxFunc(ds, func(a, b Device) int { return cmp.Compare(a.Fuel, b.Fuel) })
	fmt.Println("eng ko'p yoqilg'i:", top.ID)

	// 9. Insert panic
	func() {
		defer func() { fmt.Println("Insert recover:", recover()) }()
		_ = slices.Insert([]int{1, 2}, 5)
	}()
}
```

Go 1.24.7 da chiqish:

```text
natija tashlangan: [10 30 40 0] | len: 4
natija olingan:    [10 30 40] | len: 3
Clone tipi: main.Route | Insert tipi: main.Route
Clone(nil) == nil: true | Clone(bo'sh) == nil: false
maps.Clone(nil) == nil: true
slices.Equal NaN: false | Compare: 0
1 true 2 false
[1 2 3] 3 3
Grow: 1 true
Clip: 1 1
[{C 10} {A 40} {B 40} {D 40}]
eng ko'p yoqilg'i: T-5
Insert recover: runtime error: slice bounds out of range [5:2]
```

Kuzatuvlar. `Clone(nil)` nil, `Clone([]int{})` esa nil emas: nil'lik saqlanadi. JSON'ga chiqarishda bu muhim (18-dars), shuning uchun nusxalash ma'noni o'zgartirmaydi. `maps.Clone(nil)` ham nil. `slices.Equal` elementlarni `==` bilan solishtiradi, NaN o'ziga teng emas, shuning uchun `Equal([]float64{NaN}, []float64{NaN})` `false` berdi; `slices.Compare` esa `cmp.Compare` qoidasi bilan `0` qaytardi (NaN NaN'ga teng). Ikki funksiya NaN'ni turlicha ko'radi, bu kuzatuv va telemetriya ma'lumotini solishtirishda ahamiyatli: NaN'ni oldindan tozalang yoki `EqualFunc` bilan aniq qoidani yozing.

`BinarySearchFunc` imzosi `(x S, target T, cmp func(E, T) int)`: elementlar tipi `E` va qidirilayotgan kalit tipi `T` har xil bo'lishi mumkin. Shu sababli struct slice'ida butun struct yasamasdan, faqat kalit bilan qidirish mumkin (`1 true` va `2 false` natijalari: `T-3` indeks 1 da topildi, `T-4` indeks 2 da turishi kerak). `cmp` funksiyasi slice saralangan tartib bilan mos bo'lishi shart. `SortStableFunc` teng kalitli (`40`) elementlar tartibini saqladi: `A`, `B`, `D`. `Grow` sig'imni oldindan oshiradi (biz aniq sig'imni emas, faqat `cap(g) >= 11` ni tekshirdik), `Clip` esa sig'imni uzunlikka tenglaydi, shunda unga `append` qilish asl massivni yozmaydi (12-dars). `Concat` nil argumentni e'tiborsiz qoldirdi va `[1 2 3]` yasadi. `Insert` chegaradan tashqari indeksda panic beradi, shuning uchun foydalanuvchi kiritgan indeksni oldindan tekshiring.

## Misol: ko'p kalitli saralash, qidirish, nusxalash, map'lar

```go
package main

import (
	"cmp"
	"fmt"
	"maps"
	"math"
	"slices"
	"strings"
)

type Reading struct {
	Device string
	Fuel   float64
	Hour   int
}

func main() {
	rs := []Reading{
		{"T-3", 40, 9}, {"T-1", 75, 8}, {"T-2", 40, 7}, {"T-1", 60, 9},
	}

	// Ko'p kalitli saralash: cmp.Or birinchi nol bo'lmagan natijani qaytaradi.
	slices.SortFunc(rs, func(a, b Reading) int {
		return cmp.Or(
			cmp.Compare(b.Fuel, a.Fuel), // yoqilg'i kamayish tartibida
			strings.Compare(a.Device, b.Device),
			cmp.Compare(a.Hour, b.Hour),
		)
	})
	fmt.Println(rs)

	// Binary search faqat saralangan ma'lumotda.
	ids := []string{"T-1", "T-2", "T-5", "T-9"}
	i, found := slices.BinarySearch(ids, "T-5")
	j, found2 := slices.BinarySearch(ids, "T-4")
	fmt.Println(i, found, j, found2)

	// Compact faqat yonma-yon takrorlarni olib tashlaydi va asl slice'ni o'zgartiradi.
	raw := []string{"a", "a", "b", "a", "a"}
	compact := slices.Compact(raw)
	fmt.Printf("%q %q\n", compact, raw)

	// Insert / Delete / Index / Contains
	s := []int{10, 20, 30, 40}
	s = slices.Insert(s, 1, 15)
	fmt.Println(s, slices.Index(s, 30), slices.Contains(s, 99))
	s = slices.Delete(s, 0, 2)
	fmt.Println(s)

	// Delete oxirgi elementlarni nolga tenglaydi (kuzatuv).
	big := []*int{new(int), new(int), new(int)}
	view := big[:]
	kept := slices.Delete(view, 0, 1)
	fmt.Println(len(kept), cap(kept), big[2] == nil)

	// Min/Max, NaN holati.
	fmt.Println(slices.Max([]float64{1.5, 3, 2}), slices.Min([]int{4, 2, 9}))
	fmt.Println(slices.Max([]float64{1, math.NaN(), 3}))
	fmt.Println(cmp.Compare(math.NaN(), 1), cmp.Compare(math.NaN(), math.NaN()), cmp.Less(math.NaN(), 1))

	// Chunk: iterator, har bir bo'lak asl slice'ning ko'rinishi.
	for c := range slices.Chunk([]int{1, 2, 3, 4, 5}, 2) {
		fmt.Print(c, " ")
	}
	fmt.Println()

	// maps: Keys iterator qaytaradi.
	byDev := map[string]float64{"T-2": 12, "T-1": 54.5, "T-3": 80}
	keys := slices.Sorted(maps.Keys(byDev))
	fmt.Println(keys)

	cp := maps.Clone(byDev)
	maps.DeleteFunc(cp, func(_ string, v float64) bool { return v < 50 })
	fmt.Println(cp, maps.Equal(byDev, cp))

	maps.Copy(cp, map[string]float64{"T-9": 1})
	fmt.Println(len(cp))

	// Collect: iterator'dan map.
	m := maps.Collect(slices.All([]string{"gps", "dut"}))
	fmt.Println(m)
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
[{T-1 75 8} {T-1 60 9} {T-2 40 7} {T-3 40 9}]
2 true 2 false
["a" "b" "a"] ["a" "b" "a" "" ""]
[10 15 20 30 40] 3 false
[20 30 40]
2 3 true
3 2
NaN
-1 0 true
[1 2] [3 4] [5] 
[T-1 T-2 T-3]
map[T-1:54.5 T-3:80] false
3
map[0:gps 1:dut]
```

Tahlil:

- Ko'p kalitli saralash: yoqilg'i kamayish (`cmp.Compare(b.Fuel, a.Fuel)`), keyin qurilma nomi, keyin soat. `T-1` ikki yozuvida yoqilg'i 75 va 60, ular `T-2` (40, soat 7) va `T-3` (40, soat 9) dan oldin; 40 teng bo'lgan ikkitasi qurilma nomi bo'yicha ajraladi.
- `BinarySearch(ids, "T-5")` `2 true`, `"T-4"` esa `2 false`: topilmadi, `T-4` indeks 2 da turishi kerak.
- `Insert` va `Delete`: `[10 15 20 30 40]`, so'ng `Delete(s, 0, 2)` birinchi ikki elementni olib `[20 30 40]` beradi.
- `Delete`ning oxirgi elementlarni nolga tenglashi kuzatuvda: `*int` slice'ida `Delete(view, 0, 1)` dan keyin `len=2, cap=3` va `big[2] == nil` (`true`).
- `slices.Max([]float64{1.5, 3, 2})` `3`, `slices.Min([]int{4, 2, 9})` `2`. NaN bilan `Max` `NaN` beradi. `cmp.Compare(NaN, 1)` `-1`, `Compare(NaN, NaN)` `0`, `cmp.Less(NaN, 1)` `true`.
- `Chunk` `[1 2] [3 4] [5]` beradi: oxirgisi to'liq bo'lmasa ham qaytariladi.
- `maps.DeleteFunc` 50 dan past yoqilg'ili qurilmalarni o'chiradi (`T-2`). `maps.Equal(byDev, cp)` endi `false`. `maps.Copy` bitta kalit qo'shgach uzunlik 3.
- `maps.Collect(slices.All(...))` indeks bo'yicha map yig'adi: `map[0:gps 1:dut]`.

## Qachon qo'llamaslik kerak

- `SortFunc` stable emas. Teng kalitli elementlar tartibi muhim bo'lsa `SortStableFunc` yoki to'liq kalit (unique tie-breaker) ishlating.
- `BinarySearch` va `slices.Sorted*` natijalari faqat saralangan kirishda ma'noli; saralanmagan slice'ni binar qidirish xato natija beradi. Kichik slice (o'nlab element) uchun oddiy `slices.Index` ko'pincha yetarli va soddaroq; bu muallifning bahosi, o'lchov bilan tasdiqlanmagan.
- Katta ma'lumotda har bir so'rovda `slices.Sorted(maps.Keys(m))` - har safar yangi slice va saralash. Tartibli yurish tez-tez kerak bo'lsa, tartiblangan kalitlarni keshlang yoki boshqa ma'lumot tuzilmasi tanlang.
- `slices.Contains` O(n). Qayta-qayta tekshiriladigan to'plam uchun `map[T]struct{}` (15-dars) mos.
- `Delete`/`Insert`/`Compact` aliasing xavfini yaratadi: ikkinchi o'zgaruvchi bir xil massivga qarasa. Ma'lumot ulashilgan joyda `Clone` qiling.
- `reflect.DeepEqual` o'rniga `slices.Equal`/`maps.Equal` tezroq va aniqroq, lekin ular faqat elementlari `comparable` bo'lgan slice/map uchun; ichma-ich slice'lar uchun `EqualFunc` kerak.

## Stack'da: Node.js/TypeScript bilan farq

- JS `Array.prototype.sort()` standart bo'yicha elementlarni satrga aylantirib solishtiradi (raqamlar uchun noto'g'ri tartib): `[10, 2, 1].sort()` `[1, 10, 2]` beradi. Go'da `slices.Sort` tipga mos tartibni ishlatadi, NaN uchun ham aniq qoida bor.
- JS `sort`ning stable ekanligi spetsifikatsiyada talab qilinadi; Go'da `slices.SortFunc` stable emas, stable uchun alohida `SortStableFunc`.
- JS `arr.map/filter/reduce` yangi massiv qaytaradi. Go'da `slices.Delete/Insert/Compact` joyida o'zgartiradi: JS'dagi `splice` ga o'xshaydi, `slice`/spread ga emas. Nusxa uchun `slices.Clone`.
- `Object.keys(obj).sort()` o'rniga `slices.Sorted(maps.Keys(m))`. JS obyektlarida kalit tartibi aniq qoidaga ega, Go map'ida esa tartib aniqlanmagan.
- Lodash `_.sortBy(arr, ['fuel','hour'])` o'rniga `cmp.Or` zanjiri: maydon nomlari satr emas, kompilyator tekshiradi.
- TS'da `Math.max(...arr)` bo'sh massivda `-Infinity` beradi; Go'da `slices.Max` panic: bo'sh slice holatini oldindan tekshiring.

## Xulosa

- `slices`, `maps`, `cmp` Go 1.21 dan standart; iterator API'lari (`maps.Keys`, `slices.Sorted`, `slices.Chunk`) Go 1.23 dan, `cmp.Or` Go 1.22 dan.
- `cmp.Compare` NaN'ni har qanday sondan kichik va NaN'ga teng deb hisoblaydi; `slices.Max`/`Min` NaN'ni tarqatadi, oddiy `<`/`>` esa uni e'tiborsiz qoldiradi.
- `SortFunc`ning `cmp`i strict weak ordering bo'lishi, teng elementlar uchun `0` qaytarishi shart; stable kerak bo'lsa `SortStableFunc`.
- `Insert`, `Delete`, `Compact` asl slice'ni joyida o'zgartiradi va natijani qaytaradi; oxirgi elementlarni nolga tenglaydi. Ulashilgan ma'lumotda avval `Clone`.
- `BinarySearch` faqat saralangan slice'da; `maps.Keys` tartib kafolatlamaydi, tartib kerak bo'lsa `slices.Sorted`.
