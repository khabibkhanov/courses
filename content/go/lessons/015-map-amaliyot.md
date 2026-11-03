---
n: 15
slug: map-amaliyot
title: "Map amaliyotda: kalit tanlash, set, maps paketi"
summary: "Map kaliti sifatida nimani tanlash (struct, massiv, string), set va group-by naqshlari, maps paketi funksiyalari va ularning sayoz nusxa tuzog'i, boshlang'ich hajm (hint) bilan allokatsiyani kamaytirish."
duration: 40
sources:
  - id: pkg-maps
    note: "Clone (sayoz nusxa), Copy, DeleteFunc, Equal, Keys/Values/All/Insert/Collect (iterator'lar) funksiyalari hujjati"
  - id: blog-maps
    note: "Key types bo'limi (struct kalitlar va ko'p o'lchovli guruhlash), nil map eslatmasi Declaration and initialization bo'limida; ichma-ich map o'rniga struct kalit Key types bo'limida"
  - id: 100go
    note: "#27 (map'ni hajm bilan yaratish), #28 (map va xotira sizishi), #29 (qiymatlarni taqqoslash)"
quiz:
  - q: "seen := map[string]bool{}; seen[\"T-1\"] = false. Qaysi ifoda \"T-1\" kalit map'da bor-yo'qligini to'g'ri aniqlaydi?"
    options:
      - "seen[\"T-1\"]"
      - "len(seen[\"T-1\"]) > 0"
      - "_, ok := seen[\"T-1\"]; ok"
      - "seen[\"T-1\"] != nil"
    answer: 2
    explain: "Yo'q kalit uchun ham qiymat zero value (false) bo'ladi, shuning uchun bool qiymatining o'zi 'bor' ni bildirmaydi. Faqat ikkinchi qaytarilgan qiymat (ok) kalit mavjudligini aytadi. Oxirgi ikki variant kompilyatsiya ham bo'lmaydi."
  - q: "orig := map[string][]int{\"T-1\": {1, 2}}; cl := maps.Clone(orig); cl[\"T-1\"][0] = 99. orig[\"T-1\"][0] nechaga teng?"
    options:
      - "1, chunki Clone mustaqil nusxa beradi"
      - "99, chunki Clone sayoz: slice qiymatlari (header) nusxalanadi, massiv umumiy"
      - "Panic: Clone slice qiymatlarni qo'llab-quvvatlamaydi"
      - "0, chunki Clone qiymatlarni nollaydi"
    answer: 1
    explain: "pkg.go.dev hujjati: Clone sayoz nusxa, yangi kalit va qiymatlar oddiy assignment bilan o'rnatiladi. Slice header nusxalanadi, lekin massiv umumiy. Bu 12-darsdagi aliasing, faqat map ichida."
  - q: "make(map[int]int, 1000) ifodasidagi 1000 nimani anglatadi?"
    options:
      - "Taxminiy boshlang'ich hajm: kamida shuncha yozuv uchun joy oldindan ajratiladi, len(m) esa 0 bo'ladi; 1000 dan ko'p yozish mumkin"
      - "Map'ning maksimal hajmi: 1001-yozuv panic beradi"
      - "Map 1000 ta zero yozuv bilan boshlanadi, len(m) = 1000"
      - "GC uchun ustuvorlik darajasi"
    answer: 0
    explain: "Spetsifikatsiya bu argumentni 'capacity hint' deb ataydi: map hajm bilan cheklanmaydi va len 0 dan boshlanadi. Hint o'sishdagi qayta ajratishlarni kamaytiradi. Biz o'lchaganda 1000 yozuv uchun allokatsiyalar 22 dan 6 ga tushdi (Go 1.24.7)."
  - q: "Qaysi tip map kaliti bo'la olmaydi?"
    options:
      - "[2]string"
      - "struct{ ID int; Tags []string }"
      - "struct{ A int; B string }"
      - "*Trip"
    answer: 1
    explain: "Kalit turi taqqoslanuvchi bo'lishi kerak. Struct faqat barcha maydonlari taqqoslanuvchi bo'lsa taqqoslanadi; slice maydoni uni taqqoslab bo'lmaydigan qiladi. Massiv, oddiy struct va pointer kalit bo'la oladi (pointer manzil bo'yicha taqqoslanadi)."
  - q: "Go 1.24 da maps.Keys(m) nimani qaytaradi?"
    options:
      - "Saralangan []K"
      - "Tartibsiz []K slice"
      - "map[K]struct{}"
      - "iter.Seq[K] iteratori; tartibi aniqlanmagan, slice kerak bo'lsa slices.Sorted yoki slices.Collect"
    answer: 3
    explain: "Go 1.23 dan maps.Keys iterator qaytaradi, slice emas. Iteratsiya tartibi map kabi aniqlanmagan, saralangan slice uchun slices.Sorted(maps.Keys(m)) ishlatiladi."
  - q: "Nega to'plam (set) uchun map[string]struct{} ba'zan map[string]bool dan afzal?"
    options:
      - "Qiymat xotira egallamaydi (struct{} o'lchami 0) va 'bor-yo'q' faqat kalit bilan ifodalanadi, false qiymat bilan adashish yo'q"
      - "struct{} map'ni tezroq saralaydi"
      - "bool qiymatli map concurrent-safe emas, struct{} esa concurrent-safe"
      - "bool kalit sifatida ishlamaydi"
    answer: 0
    explain: "unsafe.Sizeof(struct{}{}) 0 ni beradi (biz o'lchadik). Bu kichik tejash, asosiy foyda semantikada: qiymat yo'q, faqat kalit bor. Concurrency xavfsizligiga ta'sir qilmaydi, saralashga ham aloqasi yo'q."
task:
  title: "Registry: takrorsiz ogohlantirishlar va haqiqiy nusxa"
  prompt: |
    `Registry` har bir mashina uchun ogohlantirishlarni `map[string][]string` da yig'adi. Ikki xato bor:

    1. `Add` ogohlantirishni takroran qo'shadi: `fuel-low` ikki marta kelsa, ikki marta saqlanadi.
    2. `Snapshot` `maps.Clone` ni ishlatadi, lekin u sayoz: chaqiruvchi `snap["T-1"][0] = "X"` desa, reestrning o'zi buziladi.

    Vazifa: har bir mashina uchun ogohlantirishlarni to'plam (`set`) sifatida saqlang (`map[string]map[string]struct{}`), `Snapshot` esa har safar mustaqil, saralangan `map[string][]string` qaytarsin. Metod imzolari o'zgarmasin. Kutilgan chiqish: `T-1: [fuel-low overspeed]` va reestr o'zgarmaganini ko'rsatuvchi xuddi shu qator.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "maps"
    )

    // Registry har bir mashina uchun ogohlantirishlarni yig'adi.
    type Registry struct {
        alerts map[string][]string
    }

    func NewRegistry() *Registry {
        return &Registry{alerts: map[string][]string{}}
    }

    // Add mashinaga ogohlantirish qo'shadi.
    func (r *Registry) Add(vehicle, alert string) {
        r.alerts[vehicle] = append(r.alerts[vehicle], alert)
    }

    // Snapshot hozirgi holatning nusxasini qaytaradi.
    func (r *Registry) Snapshot() map[string][]string {
        return maps.Clone(r.alerts)
    }

    func main() {
        r := NewRegistry()
        r.Add("T-1", "overspeed")
        r.Add("T-1", "fuel-low")
        r.Add("T-1", "fuel-low")
        r.Add("T-2", "geofence")

        snap := r.Snapshot()
        fmt.Println("T-1:", snap["T-1"])

        snap["T-1"][0] = "X" // chaqiruvchi o'z nusxasini o'zgartiryapti
        fmt.Println("reestr o'zgardimi:", r.Snapshot()["T-1"])
    }
  solution: |
    package main

    import (
        "fmt"
        "maps"
        "slices"
    )

    // Registry har bir mashina uchun takrorsiz ogohlantirishlarni yig'adi.
    type Registry struct {
        alerts map[string]map[string]struct{}
    }

    func NewRegistry() *Registry {
        return &Registry{alerts: map[string]map[string]struct{}{}}
    }

    // Add mashinaga ogohlantirish qo'shadi; takror chaqiruv hech narsani o'zgartirmaydi.
    func (r *Registry) Add(vehicle, alert string) {
        set, ok := r.alerts[vehicle]
        if !ok {
            set = map[string]struct{}{}
            r.alerts[vehicle] = set
        }
        set[alert] = struct{}{}
    }

    // Snapshot har safar yangi, saralangan slice'lardan iborat nusxa qaytaradi:
    // chaqiruvchi uni o'zgartirsa, reestrga ta'sir qilmaydi.
    func (r *Registry) Snapshot() map[string][]string {
        out := make(map[string][]string, len(r.alerts))
        for vehicle, set := range r.alerts {
            out[vehicle] = slices.Sorted(maps.Keys(set))
        }
        return out
    }

    func main() {
        r := NewRegistry()
        r.Add("T-1", "overspeed")
        r.Add("T-1", "fuel-low")
        r.Add("T-1", "fuel-low")
        r.Add("T-2", "geofence")

        snap := r.Snapshot()
        fmt.Println("T-1:", snap["T-1"])

        snap["T-1"][0] = "X" // chaqiruvchi o'z nusxasini o'zgartiryapti
        fmt.Println("reestr o'zgardimi:", r.Snapshot()["T-1"])
    }
  solutionNotes: |
    - Ichki tuzilma `map[string]map[string]struct{}`: tashqi map mashina bo'yicha, ichki map - ogohlantirishlar to'plami. Takror `Add` bir xil kalitni qayta yozadi, shuning uchun dublikat paydo bo'lmaydi.
    - Ichki map'ni lazy yaratamiz: `r.alerts[vehicle]` yo'q bo'lsa `nil` map qaytadi va unga yozib bo'lmaydi, shuning uchun avval yaratib, tashqi map'ga qayta yozamiz.
    - `Snapshot` yangi slice'larni `slices.Sorted(maps.Keys(set))` bilan quradi: har chaqiruvda yangi massiv, saralangan tartib (map tartibi kafolatlanmaydi). Tashqi map oldindan `len(r.alerts)` hajmi bilan yaratiladi.
    - `maps.Clone` o'rniga o'zimiz nusxa qurdik, chunki Clone qiymatlar (slice header) ni sayoz ko'chiradi va massivni umumiy qoldiradi.
    - Cheklov: `Snapshot` har chaqiruvda saralaydi, O(n log n). Tez-tez chaqiriladigan joyda saralangan slice'ni keshlash yoki o'zgarishda yangilash kerak bo'lishi mumkin.
  checklist:
    - "Takroriy `Add` natijani o'zgartirmaydi (`fuel-low` bir marta)"
    - "`Snapshot` qiymatlari saralangan: `[fuel-low overspeed]`"
    - "Snapshot'ni o'zgartirish reestrga ta'sir qilmaydi"
    - "`Snapshot` har safar yangi map va yangi slice'lar qaytaradi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

14-darsda map'ning kafolatlarini va ichki tuzilishini ko'rdik. Amalda esa savollar boshqacha: kalit sifatida nimani tanlash kerak? To'plam (set) kerak bo'lsa, Go'da u yo'q, nima qilamiz? Ikki o'lchov bo'yicha jami hisoblash (hudud va kun) uchun map'ni qanday qurish kerak? `maps.Clone` "nusxa" desa, nima uchun hanuz alias bor?

Telemetriya servisida bu savollar kundalik: har bir paket uchun qurilma ID bo'yicha oxirgi holat, hudud va kun bo'yicha yurgan masofa, mashina bo'yicha takrorsiz ogohlantirishlar, ikki ro'yxatning kesishmasi (online va ogohlantirish bergan mashinalar). Har birining noto'g'ri varianti ishlaydi, lekin yoki xotira sarflaydi, yoki alias orqali jimgina buziladi, yoki testlarda tartib sababli beqaror bo'ladi. Bu dars kichik naqshlar to'plamini beradi va ularning chegaralarini ko'rsatadi.

## Asosiy g'oya

### Kalit tanlash

Kalit turi taqqoslanuvchi bo'lishi kerak (14-dars). Amaliy tanlov uch toifaga bo'linadi.

**Oddiy kalitlar:** `string`, `int`, `[16]byte` kabi massivlar. String eng ko'p ishlatiladi. Esda tuting: string kalit boshqa kattaroq satrning bo'lagi bo'lsa, map shu kalit orqali butun satrni xotirada ushlab turadi (13-dars). Katta log qatoridan olingan ID ni map'ga kalit qilishdan oldin `strings.Clone` ni ko'rib chiqing.

**Struct kalitlar:** bir nechta o'lchov bo'yicha guruhlash uchun. Go Blog'ning map maqolasi aynan shuni ko'rsatadi: ichma-ich map (`map[string]map[string]int`) o'rniga struct kalitli bitta map. Ichma-ich map'da har tashqi kalit uchun ichki map borligini tekshirib, yaratish kerak; struct kalitda esa `m[Key{a, b}]++` yetarli. Struct tipi qo'shimcha afzallik beradi: maydonlar nomli va tipli, `"Toshkent:1"` kabi string birlashtirish esa ajratkich bilan to'qnashuvga (hudud nomida `:` bo'lsa) va ortiqcha allokatsiyaga olib keladi.

**Boshqa kalitlar:** pointer kalit manzil bo'yicha taqqoslanadi (qiymat bo'yicha emas), interface kalit esa dinamik tipi taqqoslanmasa panic beradi, `float` kalit NaN bilan muammo tug'diradi. Bularni istisno holatlarda ishlating.

UUID kabi 16 baytli identifikatorni 36 belgili matn o'rniga `[16]byte` massiv sifatida saqlash mumkin: massiv taqqoslanuvchi va qiymat semantikasiga ega, va map kaliti sifatida o'lchami qat'iy 16 bayt (satr esa header va matn baytlaridan iborat). Evaziga matn ko'rinishiga o'tkazish (log, API) uchun alohida kod kerak, shuning uchun bunday almashtirish ko'p millionli kalitlar yoki qat'iy ichki format bor joyda foydali, oddiy servisda esa string yetarli.

### Set naqshi

Go'da to'plam tipi yo'q. Standart usul: `map[T]struct{}`. Bo'sh struct nol bayt egallaydi (quyida o'lchaymiz), shuning uchun qiymat saqlanmaydi, faqat kalit. `map[T]bool` ham ishlaydi, lekin ikkita holat paydo bo'ladi: kalit yo'q va kalit bor-lekin `false`. Mavjudlikni har doim `_, ok := m[k]` bilan tekshiring. Qiymatda `false` bo'lmasligi kerakligiga kelishilgan bo'lsa, `bool` ham ma'qul: `if seen[k]` qisqaroq o'qiladi. `struct{}` varianti tipni `Set` deb nomlab, `Add` va `Has` metodlarini berishga qulay.

### maps paketi

`maps` paketi Go 1.21 da qo'shilgan (`Clone`, `Copy`, `DeleteFunc`, `Equal`, `EqualFunc`), iterator funksiyalari (`All`, `Keys`, `Values`, `Insert`, `Collect`) Go 1.23 da (versiyalar `$GOROOT/api` fayllaridan tekshirildi). Hujjat qoidalari:

- `Clone(m)` sayoz nusxa qaytaradi: kalit va qiymatlar oddiy assignment bilan o'rnatiladi.
- `Copy(dst, src)` src dagi hamma juftlikni dst ga yozadi, mavjud kalitlarning qiymati ustidan yoziladi.
- `DeleteFunc(m, del)` predikat rost bo'lgan juftliklarni o'chiradi.
- `Equal(m1, m2)` kalit va qiymatlar teng bo'lsa `true` (qiymat tipi `comparable` bo'lishi shart).
- `Keys`/`Values`/`All` iterator qaytaradi; iteratsiya tartibi map kabi aniqlanmagan. `Collect` iteratorni map'ga yig'adi. Saralangan slice uchun `slices.Sorted(maps.Keys(m))`.

## Chuqurroq: sayoz nusxa, hint va qiymat tanlovi

### Sayoz nusxa

`maps.Clone` map'ning o'zini ajratadi, lekin qiymatlarni "oddiy assignment" bilan ko'chiradi. Qiymat slice, map yoki pointer bo'lsa, nusxa va asl bir ichki ma'lumotni ko'radi. Quyidagi dastur buni ko'rsatadi:

```go run
package main

import (
	"fmt"
	"maps"
	"slices"
)

func main() {
	orig := map[string][]int{"T-1": {1, 2}, "T-2": {3}}

	cl := maps.Clone(orig)
	cl["T-1"][0] = 99 // slice qiymatlari umumiy
	cl["T-3"] = []int{7}
	fmt.Println("orig:", orig)
	fmt.Println("clone:", cl)

	m := map[string]int{"a": 1, "b": 2, "c": 3, "d": 4}
	maps.DeleteFunc(m, func(_ string, v int) bool { return v%2 == 0 })
	fmt.Println("toq qiymatlar:", m)

	dst := map[string]int{"a": 100, "z": 26}
	maps.Copy(dst, m)
	fmt.Println("Copy dan keyin:", dst)

	fmt.Println("Equal:", maps.Equal(m, map[string]int{"a": 1, "c": 3}))

	inv := maps.Collect(func(yield func(int, string) bool) {
		for k, v := range m {
			if !yield(v, k) {
				return
			}
		}
	})
	fmt.Println("teskari:", inv, slices.Sorted(maps.Keys(inv)))
}
```

Chiqish (Go 1.24.7; `fmt` map'larni kalitlar tartibida chop etadi):

```text
orig: map[T-1:[99 2] T-2:[3]]
clone: map[T-1:[99 2] T-2:[3] T-3:[7]]
toq qiymatlar: map[a:1 c:3]
Copy dan keyin: map[a:1 c:3 z:26]
Equal: true
teskari: map[1:a 3:c] [1 3]
```

`cl["T-1"][0] = 99` `orig` da ham ko'rindi, chunki `T-1` qiymati slice header nusxasi edi va massiv umumiy. `cl["T-3"]` qo'shilishi esa `orig` ga ta'sir qilmadi: map'lar mustaqil. Chuqur nusxa kerak bo'lsa, qiymatlarni o'zingiz nusxalaysiz (`slices.Clone`) yoki 12-darsdagi qoidaga amal qilib, ichki ma'lumotni tashqariga bermaysiz. `fmt` ning kalit tartibi faqat chop etish qulayligi uchun; `range` tartibiga aloqasi yo'q.

### Boshlang'ich hajm

`make(map[K]V, n)` spetsifikatsiyada hajm maslahati: map `n` bilan cheklanmaydi, `len` 0 dan boshlanadi. 100 Go Mistakes #27: yozuvlar soni oldindan ma'lum bo'lsa, hajm berish map o'sishida qayta ajratish va qayta joylashtirishni kamaytiradi. Biz buni o'lchadik:

```go
package main

import (
	"fmt"
	"testing"
)

const n = 1000

var sink map[int]int

func without() {
	m := map[int]int{}
	for i := 0; i < n; i++ {
		m[i] = i
	}
	sink = m
}

func with() {
	m := make(map[int]int, n)
	for i := 0; i < n; i++ {
		m[i] = i
	}
	sink = m
}

func main() {
	fmt.Println("hint siz, ajratishlar:", testing.AllocsPerRun(50, without))
	fmt.Println("hint bilan, ajratishlar:", testing.AllocsPerRun(50, with))
}
```

```text
hint siz, ajratishlar: 22
hint bilan, ajratishlar: 6
```

1000 ta `int` yozuv: hint siz 22 ta, hint bilan 6 ta allokatsiya (Go 1.24.7, linux/amd64, `testing.AllocsPerRun`). `GOEXPERIMENT=noswissmap` bilan xuddi shu dastur 66 va 7 berdi, ya'ni eski implementatsiyada farq yanada katta edi. Raqamlar versiya va elementlar soniga bog'liq; xulosa esa barqaror: hajm ma'lum bo'lsa, bering. Hajm noma'lum bo'lsa, taxmin qilib kattaroq bermang: map qisqarmaydi (14-dars), ortiqcha joy abadiy qoladi.

### Qiymat: struct, pointer yoki slice

- `map[K]V` (struct V): o'qish nusxa qaytaradi, maydonni bevosita o'zgartirib bo'lmaydi (olish-o'zgartir-yoz). Kichik, o'zgarmas qiymatlar uchun yaxshi.
- `map[K]*V`: qiymatni joyida o'zgartirish mumkin (`m[k].Count++`), lekin har yozuv alohida heap ob'ekt (GC yuki, cache yomonlashadi: 66-dars) va nil pointer xavfi bor.
- `map[K][]V`: guruhlash uchun qulay: yo'q kalit uchun `nil` slice, unga `append` ishlaydi (`m[k] = append(m[k], v)`). Slice'larni tashqariga bermang (12-dars).

### Vaqt kalit sifatida: time.Time tuzog'i

Telemetriyada "vaqt bo'yicha oxirgi pozitsiya" kabi map tabiiy ko'rinadi: `map[time.Time]Position`. `time.Time` taqqoslanuvchi struct, shuning uchun kompilyator ruxsat beradi, lekin pkg.go.dev/time hujjati ogohlantiradi: `==` operatori vaqt lahzasidan tashqari `Location` va monotonic soat ko'rsatkichini ham taqqoslaydi, shu sababli `Time` qiymatlarini map yoki ma'lumotlar bazasi kaliti qilishdan oldin hamma qiymatda bir xil `Location` o'rnatilgani (`UTC` yoki `Local` metodi bilan) va monotonic ko'rsatkich `t = t.Round(0)` bilan olib tashlangani kafolatlanishi kerak. Bir lahzaning ikki yozuvi:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	// Bir xil lahza, ikki xil Location.
	utc := time.Date(2026, 11, 3, 7, 0, 0, 0, time.UTC)
	tashkent := utc.In(time.FixedZone("UZT", 5*3600))

	fmt.Println("Equal:", utc.Equal(tashkent), "| ==:", utc == tashkent)

	m := map[time.Time]string{utc: "pozitsiya-1"}
	_, found := m[tashkent]
	fmt.Println("map'da topildimi:", found)

	// Monotonic reading ham == natijasiga ta'sir qiladi.
	now := time.Now()
	stripped := now.Round(0)
	fmt.Println("now == now.Round(0):", now == stripped, "| Equal:", now.Equal(stripped))

	// Xavfsiz kalit: UTC va monotonic'siz.
	key := func(t time.Time) time.Time { return t.UTC().Round(0) }
	m2 := map[time.Time]string{key(utc): "pozitsiya-1"}
	_, found = m2[key(tashkent)]
	fmt.Println("normallashtirilgan kalit topildimi:", found)

	// Unix nanosekund (int64) kalit sifatida: eng sodda.
	m3 := map[int64]string{utc.UnixNano(): "pozitsiya-1"}
	_, found = m3[tashkent.UnixNano()]
	fmt.Println("UnixNano kalit topildimi:", found)
}
```

```text
Equal: true | ==: false
map'da topildimi: false
now == now.Round(0): false | Equal: true
normallashtirilgan kalit topildimi: true
UnixNano kalit topildimi: true
```

Xato jimgina: `Equal` rost, lekin map yozuvni topmaydi, va test faqat UTC qiymatlar bilan o'tgani uchun noto'g'ri xotirjamlik beradi. Ikki to'g'ri yo'l bor: `t.UTC().Round(0)` bilan normallashtirilgan `time.Time` yoki `UnixNano()` (int64). Ikkinchisi sodda, lekin `UnixNano` hujjatiga ko'ra natija int64 ga sig'maydigan sanalar (1678 yildan oldin yoki 2262 yildan keyin) uchun aniqlanmagan, va nol `Time` uchun ham aniqlanmagan; natija `Location` ga bog'liq emas. Telemetriya vaqtlari uchun bu diapazon yetarli, lekin kiruvchi ma'lumotdagi nol yoki bo'sh vaqtni avval tekshiring. Misol Go 1.24.7 da ishga tushirildi.

### Uzun satr kalitlar: unique.Handle

Kalit uzun satr bo'lsa (masalan, to'liq marshrut tavsifi), har qidirishda hash va tenglik tekshiruvi butun satr bo'yicha ishlaydi, va bir xil satrning ko'p nusxasi xotirada turadi. Go 1.23 release notes yangi `unique` paketini qo'shgan: `unique.Make(value)` har qanday taqqoslanuvchi qiymatning kanonik nusxasiga `Handle[T]` beradi. pkg.go.dev hujjatiga ko'ra ikki handle faqat va faqat ular yaratilgan qiymatlar teng bo'lsa teng, handle'larni taqqoslash esa qiymatlarni taqqoslashdan odatda ancha samarali. Ya'ni handle'ni map kaliti qilib, satrni bir marta intern qilsangiz, keyingi qidirishlar qisqa taqqoslashga tayanadi:

```go run
package main

import (
	"fmt"
	"strings"
	"unique"
)

func main() {
	a := unique.Make(strings.Repeat("T-1042/", 100))
	b := unique.Make(strings.Repeat("T-1042/", 100))
	c := unique.Make("T-9")
	fmt.Println("a == b:", a == b, "| a == c:", a == c)

	last := map[unique.Handle[string]]float64{}
	last[a] = 41.5
	last[b] = 40.9 // bir xil kalit: ustidan yozilgan
	fmt.Println("map uzunligi:", len(last), "| qiymat:", last[a])
	fmt.Println("qiymat satri uzunligi:", len(a.Value()))
}
```

```text
a == b: true | a == c: false
map uzunligi: 1 | qiymat: 40.9
qiymat satri uzunligi: 700
```

Ikki alohida yaratilgan 700 baytli satr bitta handle'ga aylandi va map'da bitta kalit bo'ldi. `Make` har chaqiruvda qiymat uchun kanonik nusxani topishi kerak, shuning uchun handle'ni bir marta yarating va saqlang (masalan, qurilmani ro'yxatdan o'tkazishda), har so'rovda qayta yaratmang. Bir martalik qidiruv uchun oddiy satr kaliti yetarli. Tezlik haqida raqam bermaymiz: biz uni o'lchamadik, o'z yukingizda o'lchang (61-dars).

## Misol: struct kalit, set va guruhlash

Birinchi dastur ikki o'lchov bo'yicha jami, massiv kalit va guruhlashni ko'rsatadi:

```go run
package main

import "fmt"

// Bucket - hisobot kaliti: hudud va kun bo'yicha guruhlash.
type Bucket struct {
	Region string
	Day    int
}

type Trip struct {
	Region string
	Day    int
	Km     float64
}

func main() {
	trips := []Trip{
		{"Toshkent", 1, 120}, {"Samarqand", 1, 80},
		{"Toshkent", 1, 60}, {"Toshkent", 2, 45},
	}

	// struct kalit: ikki o'lchov bo'yicha jami
	total := map[Bucket]float64{}
	for _, t := range trips {
		total[Bucket{t.Region, t.Day}] += t.Km
	}
	fmt.Println("jami:", total[Bucket{"Toshkent", 1}], total[Bucket{"Samarqand", 1}])

	// massiv kalit: [2]int taqqoslanadi, slice emas
	visits := map[[2]int]int{}
	visits[[2]int{41, 69}]++
	visits[[2]int{41, 69}]++
	fmt.Println("katak tashriflari:", visits)

	// map[string][]T: yo'q kalit uchun qiymat nil slice, unga append ishlaydi
	byRegion := map[string][]Trip{}
	for _, t := range trips {
		byRegion[t.Region] = append(byRegion[t.Region], t)
	}
	fmt.Println("Toshkent safarlari:", len(byRegion["Toshkent"]), "| Samarqand:", len(byRegion["Samarqand"]))
}
```

```text
jami: 180 80
katak tashriflari: map[[41 69]:2]
Toshkent safarlari: 3 | Samarqand: 1
```

`Bucket{"Toshkent", 1}` ikki safarning masofasini (120 + 60) jamladi. `[2]int` massiv kalit sifatida ishlaydi, chunki massiv taqqoslanuvchi (slice esa yo'q). `byRegion` har hududni o'zining slice'iga yig'adi: yo'q kalit uchun `nil` slice'ga `append` birinchi elementni qo'shadi.

Ikkinchi dastur to'plam naqshi va kesishma:

```go run
package main

import (
	"fmt"
	"maps"
	"slices"
	"unsafe"
)

// Set - qurilma ID'lari to'plami.
type Set map[string]struct{}

func (s Set) Add(id string)      { s[id] = struct{}{} }
func (s Set) Has(id string) bool { _, ok := s[id]; return ok }

func intersect(a, b Set) Set {
	out := Set{}
	for id := range a {
		if b.Has(id) {
			out.Add(id)
		}
	}
	return out
}

func main() {
	fmt.Println("struct{} o'lchami:", unsafe.Sizeof(struct{}{}), "bayt")

	online, alerting := Set{}, Set{}
	for _, id := range []string{"T-1", "T-2", "T-3", "T-2"} {
		online.Add(id)
	}
	for _, id := range []string{"T-3", "T-9", "T-1"} {
		alerting.Add(id)
	}
	fmt.Println("online soni (takrorsiz):", len(online))
	both := slices.Sorted(maps.Keys(intersect(online, alerting)))
	fmt.Println("ikkalasida:", both)
}
```

```text
struct{} o'lchami: 0 bayt
online soni (takrorsiz): 3
ikkalasida: [T-1 T-3]
```

`struct{}` o'lchami 0 bayt. `online.Add("T-2")` ikki marta chaqirildi, to'plamda esa bitta: takrorsiz 3 ta mashina. `intersect` kichik to'plamni aylanib, kattasida `Has` bilan tekshiradi; `Has` O(1). Natija map bo'lgani uchun tartibsiz, shu sababli `slices.Sorted(maps.Keys(...))` bilan chop etdik.

## Qachon qo'llamaslik kerak

- Kalitlar soni juda kichik va qat'iy bo'lsa, map o'rniga massiv yoki `switch` yaxshiroq: tartiblangan va tezroq.
- Set operatsiyalari (birlashma, kesishma, ayirma) ko'p bo'lsa, map-set bilan qo'lda yozish takrorlanuvchi kodga aylanadi; bunda kichik `Set` tipi yoki generics asosidagi kutubxona (24-dars) mantiqliroq.
- Tartib muhim bo'lsa, map bilan faqat saralashga tayanmang: har chaqiruvda saralash qimmat. Saralangan slice yoki daraxtni alohida saqlang.
- `maps.Clone` ni "mustaqil nusxa" deb ishlatmang, agar qiymatlar slice, map yoki pointer bo'lsa.
- `map[K]*V` ni "qulay" deb tanlayverish ortiqcha allokatsiya beradi: qiymat kichik bo'lsa, `map[K]V` bilan olish-o'zgartir-yoz tezroq bo'lishi mumkin (o'lchang, 70-dars).
- `time.Time` ni normallashtirmasdan kalit qilmang: `==` `Location` va monotonic ko'rsatkichni ham taqqoslaydi, shu sababli bir lahzaning ikki yozuvi turli kalit bo'ladi. Vaqt kerak bo'lmasa, int64 (`UnixNano`) yoki sana satri kalit bo'lsin.
- `unique.Handle` ni har kalitga qo'llamang: u uzun, ko'p takrorlanadigan va uzoq yashaydigan kalitlar uchun; qisqa ID satrida intern qilishning o'zi ortiqcha murakkablik.
- Kalitni string birlashtirish bilan yasamang (`region + ":" + day`): har so'rovda allokatsiya va to'qnashuv xavfi. Struct kalit tipli va allokatsiyasiz.

## Stack'da: Node.js/TypeScript bilan solishtirish

JavaScript'da kalit sifatida obyektni ishlatish uchun `Map` kerak, oddiy obyekt esa kalitni stringga aylantiradi. Ko'p o'lchovli kalit uchun odatda `JSON.stringify([a, b])` yoki `${a}:${b}` ishlatiladi. Go'da buning tipli o'rni bor: struct yoki massiv kalit, kompilyator taqqoslashni va hash'ni o'zi bajaradi. `Set` ham tilda bor (`new Set()`), Go'da esa `map[T]struct{}` naqshi.

Amaliy qoidalar:

- Ko'p o'lchovli kalit uchun nomli struct yarating; string birlashtirishdan qoching.
- Set kerak bo'lsa: `type Set map[string]struct{}` va `Add`/`Has`; natijani chiqarishda `slices.Sorted(maps.Keys(s))`.
- Hajm ma'lum bo'lsa `make(map[K]V, n)`; noma'lum bo'lsa taxmin qilmang.
- Ichki map'li strukturalarda nusxa olishda har darajani alohida nusxalang.
- Testda map chiqishini saralangan shaklda taqqoslang yoki `maps.Equal` ishlating.

## Xulosa

- Kalit uchun struct yoki massiv ichma-ich map'dan va string birlashtirishdan yaxshi: tipli, allokatsiyasiz, taqqoslash avtomatik.
- Set - `map[T]struct{}`: bo'sh struct 0 bayt; mavjudlik `_, ok := m[k]` bilan tekshiriladi.
- `maps.Clone` va `maps.Copy` sayoz: slice, map va pointer qiymatlar umumiy qoladi.
- `maps.Keys/Values/All` Go 1.23 dan iterator qaytaradi; saralangan natija uchun `slices.Sorted`.
- `make(map[K]V, n)` hajm maslahati: o'lchovimizda 1000 yozuv uchun allokatsiyalar 22 dan 6 ga tushdi, lekin map qisqarmaydi.
- Qiymat tanlovi (`V`, `*V`, `[]V`) o'zgartirish qulayligi, allokatsiya va alias xavfini belgilaydi.
