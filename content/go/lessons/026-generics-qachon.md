---
n: 26
slug: generics-qachon
title: "Generics qachon kerak va qachon zarar"
summary: "Go jamoasi generics ishlatish bo'yicha ko'rsatmasi: qaysi hollarda type parameter foydali (container funksiyalar, umumiy ma'lumot tuzilmalari, bir xil metod), qachon interface yoki reflection to'g'ri; performance haqidagi tushuncha va o'lchov, field kirish cheklovi va API murakkabligi."
duration: 40
sources:
  - id: blog-when-generics
    note: "Butun maqola: Write code; When are type parameters useful?; Don't replace interface types with type parameters; Don't use type parameters if method implementations differ; Use reflection where appropriate; One simple guideline"
  - id: 100go
    note: "#9 Being confused about when to use generics: type parameter'lar kerak bo'lganda ishlatiladi, muddatidan oldin emas; #5 Interface pollution bilan bir xil mantiq"
  - id: code-review-comments
    note: "Interfaces bo'limi: interface'ni ishlatilishidan oldin e'lon qilmaslik qoidasi; shu mantiq generics uchun ham qo'llanadi (muallifning xulosasi)"
quiz:
  - q: "`func ReadSome(r io.Reader) ([]byte, error)` ni `func ReadSome[T io.Reader](r T) ([]byte, error)` ga o'zgartirish haqida Go jamoasining maqolasi nima deydi?"
    options:
      - "O'zgartirish kerak: generics tezroq ishlaydi"
      - "O'zgartirish kerak, chunki bu tip xavfsizlikni oshiradi"
      - "O'zgartirmang: qiymat ustida faqat metod chaqirilsa interface tipi yetarli, yozish va o'qish osonroq, bajarilish vaqti esa ehtimol bir xil"
      - "Faqat `T` `io.ReadCloser` bo'lsa o'zgartirish kerak"
    answer: 2
    explain: "Maqola: agar qiymat bilan qiladigan yagona ish metod chaqirish bo'lsa, interface tipi ishlating, type parameter emas. Go 1.18 implementatsiyasi type parameter qiymatlarini ko'p hollarda interface qiymatlariga o'xshash ko'rgani uchun tezlik sababli almashtirish ma'nosiz."
  - q: "Quyidagilardan qaysi biri generic funksiya uchun eng yaxshi nomzod?"
    options:
      - "Har qanday map'dan kalitlar slice'ini qaytaruvchi funksiya"
      - "Fayldan ham, tasodifiy sonlar generatoridan ham `Read` qiladigan funksiya, har birining implementatsiyasi boshqa"
      - "`encoding/json` kabi har bir tip uchun boshqacha kodlanadigan funksiya"
      - "Qiymatning faqat `String()` metodini chaqiradigan funksiya"
    answer: 0
    explain: "Map kalitlarini yig'ish kodi key va value tiplariga umuman bog'liq emas va bir xil: shu sababli type parameter mos. Ikkinchi variantda implementatsiyalar farq qiladi (interface), uchinchisida har bir tip uchun kodlash boshqacha va metodsiz tiplar ham kerak (reflection), to'rtinchisida faqat metod chaqiriladi (interface)."
  - q: "`Tree[T]` uchun taqqoslashni elementning `Compare` metodini talab qiladigan constraint orqali emas, konstruktorga berilgan `cmp func(T, T) int` orqali qilish tavsiya qilinadi. Sabab?"
    options:
      - "Metod orqali taqqoslash sekinroq"
      - "Constraint'li metod `int` kabi oddiy tiplar uchun foydalanuvchini o'z tipini yozishga majbur qiladi; metodni funksiyaga aylantirish oson, tipga metod qo'shish esa qiyin"
      - "Funksiya parametri `go vet` bilan tekshiriladi"
      - "Constraint'da metod yozib bo'lmaydi"
    answer: 1
    explain: "Maqola: `int` uchun metod yo'q, shuning uchun metod talab qilinsa foydalanuvchi o'z tipini e'lon qilib metod yozishi kerak. Funksiya berilsa, istalgan tip uchun yozish oson, va metod bor tipda `ElementType.Compare` metod ifodasi funksiya vazifasini bajaradi."
  - q: "Darsdagi o'lchovda (Go 1.24.7, linux/amd64, 2 vCPU Xeon 2.1 GHz) `[]Sizer` bilan `TotalGeneric[T Sizer]` chaqirilishi `TotalIface(xs []Sizer)` ga nisbatan qanday chiqdi va bu nimani anglatadi?"
    options:
      - "Generic versiya ikki baravar tez; shuning uchun hamma joyda ishlatish kerak"
      - "Farq yo'q; ikkalasi aynan bir xil"
      - "Generic versiya 1.6-1.9 baravar sekin (3.0-3.2 mikrosekundga qarshi 1.8 mikrosekund atrofida); type parameter tezlik uchun kafolat emas"
      - "Generic versiya xotira ajratadi"
    answer: 2
    explain: "Chiqishda `BenchmarkGenericIface` 3026-3245 ns/op, `BenchmarkIface` 1755-1898 ns/op, ajratmalar ikkalasida ham 0 B/op. Bu faqat shu mashinada, shu Go versiyasida, shu mikrobenchmark uchun; maqola ham type parameter odatda interface'dan tezroq emasligini aytadi. Tezlik uchun almashtirmang, o'lchang."
  - q: "`func Names(xs []Namer) []string` mavjud, chaqiruvchida esa `gs []Gps`. `Names(gs)` nima beradi va qanday generic yechim bor?"
    options:
      - "Kompilyatsiya bo'ladi, chunki `Gps` `Namer`ni implement qiladi"
      - "Run-time panic"
      - "Kompilyatsiya bo'ladi, lekin slice nusxalanadi"
      - "Kompilyatsiya xatosi (`[]Gps` ni `[]Namer` deb uzatib bo'lmaydi); `Names[T Namer](xs []T)` bu konversiya siklini kerak qilmaydi"
    answer: 3
    explain: "Slice tiplari invariant: `[]Gps` va `[]Namer` har xil tip va xotira tuzilishi ham farq qiladi. Bu yerda type parameter haqiqiy ish bajaradi, shuning uchun maqolaning 'interface bilan almashtir' qoidasi yakka qiymat uchun, slice uchun esa generic ko'pincha qulayroq."
  - q: "`func Total[T Reading](xs []T) float64 { ... x.Fuel ... }` (Reading - maydonlari bor struct tiplar uchun constraint) kompilyatsiya xatosi beradi. Eng to'g'ri yechim qaysi?"
    options:
      - "Constraint'ga struct maydonini yozish: `interface{ Fuel float64 }`"
      - "`T` ni `any` qilish va `x.Fuel`ni `reflect` bilan olish"
      - "Maydon o'rniga constraint'ga `FuelLevel() float64` metodi qo'shish yoki funksiya parametri sifatida accessor (`func(T) float64`) berish"
      - "Hech qanday yechim yo'q: generics bunday holatni qo'llab-quvvatlamaydi"
    answer: 2
    explain: "Type parameter orqali struct maydoniga kirish mumkin emas (`x.Fuel undefined (type T has no field or method Fuel)`), constraint'ga maydon yozib bo'lmaydi. Metod yoki accessor funksiya aniq, tip xavfsiz va reflection'siz yechim. Reflection (30-dars) ortiqcha murakkab va sekin."
  - q: "Jamoa har bir entity uchun `Repository[T any]` generic interface va uning `GenericRepository[T]` implementatsiyasini yozdi; bitta entity uchun SQL boshqacha, qolganlari uchun bir xil. Qaysi baho mos?"
    options:
      - "To'g'ri: bir xil kod yagona generic bo'lishi kerak, farq esa ichida `switch any(x).(type)` bilan hal qilinadi"
      - "Abstraksiya muddatidan oldin yaratilgan: generic faqat haqiqatan bir xil kod bo'lgan qismga (masalan, `scan`/`Keys` kabi yordamchilar) qo'llanadi, farqli xatti-harakat esa iste'molchi tomonidagi kichik interface orqali beriladi"
      - "To'g'ri, lekin interface'ni nomsiz qilish kerak"
      - "Generic repository doim yomon, hech qachon ishlatmaslik kerak"
    answer: 1
    explain: "Maqola: metod implementatsiyalari farq qilsa interface ishlating, type parameter emas; bir xil kodni ko'p marta yozish zaruratini sezmaguningizcha type parameter'dan qochish tavsiyasi. 100 Go Mistakes #9 ham muddatidan oldin type parameter ishlatmaslikni aytadi. Mutlaq taqiq ham noto'g'ri: yordamchilar uchun generics foydali."
task:
  title: "Ortiqcha type parameter'larni olib tashlash va haqiqiy takrorlanishni generic qilish"
  prompt: |
    Quyidagi kodda generics ikki yo'nalishda noto'g'ri ishlatilgan:
    - `Describe[T Namer]` faqat `Name()` chaqiradi, lekin type parameter oladi.
    - `KeysFloat` va `KeysInt` bir xil kodning ikki nusxasi, faqat map qiymat tipi farq qiladi.

    Vazifa:
    1. `Describe` ni type parameter'siz, `Namer` interface'ini qabul qiladigan oddiy funksiyaga aylantiring.
    2. `KeysFloat` va `KeysInt` ni bitta generic `Keys` bilan almashtiring (kalit tartiblanadigan, qiymat istalgan tip).
    3. `Names` slice qabul qiladi (`[]Gps`). Uni generic qoldiring va nega bu yerda interface (`[]Namer`) mos kelmasligini izohda tushuntiring.
    4. Chiqish o'zgarmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sort"
    )

    type Namer interface{ Name() string }

    type Gps struct{ id string }
    type Dut struct{ id string }

    func (g Gps) Name() string { return "gps-" + g.id }
    func (d Dut) Name() string { return "dut-" + d.id }

    // Describe faqat Name() chaqiradi, lekin keraksiz type parameter oladi.
    func Describe[T Namer](x T) string {
        return "qurilma: " + x.Name()
    }

    // Names slice qabul qiladi: []Gps ni []Namer ga o'tkazib bo'lmaydi.
    func Names[T Namer](xs []T) []string {
        out := make([]string, 0, len(xs))
        for _, x := range xs {
            out = append(out, x.Name())
        }
        return out
    }

    // Bir xil kod ikki marta, faqat tip farq qiladi.
    func KeysFloat(m map[string]float64) []string {
        out := make([]string, 0, len(m))
        for k := range m {
            out = append(out, k)
        }
        sort.Strings(out)
        return out
    }

    func KeysInt(m map[string]int) []string {
        out := make([]string, 0, len(m))
        for k := range m {
            out = append(out, k)
        }
        sort.Strings(out)
        return out
    }

    func main() {
        fmt.Println(Describe(Gps{"1"}), Describe(Dut{"9"}))
        fmt.Println(Names([]Gps{{"1"}, {"2"}}))
        fmt.Println(KeysFloat(map[string]float64{"b": 1, "a": 2}))
        fmt.Println(KeysInt(map[string]int{"y": 1, "x": 2}))
    }
  solution: |
    package main

    import (
        "cmp"
        "fmt"
        "sort"
    )

    type Namer interface{ Name() string }

    type Gps struct{ id string }
    type Dut struct{ id string }

    func (g Gps) Name() string { return "gps-" + g.id }
    func (d Dut) Name() string { return "dut-" + d.id }

    // Describe faqat metod chaqiradi: oddiy interface yetarli, type parameter keraksiz.
    func Describe(x Namer) string {
        return "qurilma: " + x.Name()
    }

    // Names generic qoldi: []Gps ni []Namer ga o'tkazib bo'lmagani uchun type parameter
    // chaqiruvchini konversiya siklidan qutqaradi.
    func Names[T Namer](xs []T) []string {
        out := make([]string, 0, len(xs))
        for _, x := range xs {
            out = append(out, x.Name())
        }
        return out
    }

    // Keys: bir xil algoritm turli tiplar uchun, shuning uchun type parameter o'rinli.
    func Keys[K cmp.Ordered, V any](m map[K]V) []K {
        out := make([]K, 0, len(m))
        for k := range m {
            out = append(out, k)
        }
        sort.Slice(out, func(i, j int) bool { return out[i] < out[j] })
        return out
    }

    func main() {
        fmt.Println(Describe(Gps{"1"}), Describe(Dut{"9"}))
        fmt.Println(Names([]Gps{{"1"}, {"2"}}))
        fmt.Println(Keys(map[string]float64{"b": 1, "a": 2}))
        fmt.Println(Keys(map[string]int{"y": 1, "x": 2}))
    }
  solutionNotes: |
    - `Describe(x Namer)` faqat metod chaqiradi, shuning uchun interface tipi yetarli (maqola: 'faqat metod chaqirilsa, interface ishlating'). Chaqiruvlar o'zgarmadi: `Describe(Gps{"1"})` interface'ga avtomatik o'tadi.
    - `Keys[K cmp.Ordered, V any]` takrorlanishni yo'qotdi: kod key va value tiplariga bog'liq emas, bu maqoladagi `MapKeys` misoli bilan bir xil holat. Kalit `cmp.Ordered` bo'lgani uchun `<` bilan saralanadi.
    - `Names` generic qoldi: `[]Gps` ni `[]Namer` ga o'tkazib bo'lmaydi (xotira tuzilishi har xil, kompilyator `cannot use gs (variable of type []Gps) as []Namer`), shuning uchun type parameter chaqiruvchini konversiya siklidan qutqaradi.
    - Chiqish bir xil: starter va yechim to'rt qatorli bir xil natija beradi. Refaktoringdan oldin va keyin chiqishni solishtirish xatti-harakat saqlanganini tasdiqlaydi.
  checklist:
    - "`Describe` type parameter'siz, `Namer` qabul qiladi"
    - "`KeysFloat` va `KeysInt` o'rniga bitta generic `Keys`"
    - "`Names` generic qoldirilgan va sababi izohda tushuntirilgan"
    - "Chiqish starter bilan bir xil"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Generics Go'ga 2022-yilda keldi va birinchi yillardayoq ikki qarama-qarshi xato tarqaldi. Birinchisi: TypeScript va Java tajribasidan kelganlar hamma narsani generic qiladi: `Repository[T]`, `Service[T]`, `Handler[Req, Resp]`, har bir yordamchi funksiyada type parameter. Natijada oddiy interface bilan hal bo'ladigan joyda murakkab imzolar paydo bo'ladi, kod o'qilmay qoladi, va tezlik umidi ko'pincha o'zini oqlamaydi. Ikkinchisi: generics'ni butunlay inkor qilib, bir xil algoritmni `int`, `float64`, `string` uchun uch marta yozish yoki `any` + type switch'ga qaytish (23-dars).

Go jamoasidan Ian Lance Taylor maqolasi ('When To Use Generics', 2022) bu savolga umumiy yo'l-yo'riq beradi: qat'iy qoidalar emas, tavsiyalar. Bu dars shu tavsiyalarni 100 Go Mistakes #9 bilan birga o'qiydi, ularni o'z o'lchovimiz bilan tekshiradi va Go 1.24 dagi aniq cheklovlarni ko'rsatadi.

## Asosiy g'oya

### Avval kod yozing

Maqolaning birinchi tavsiyasi: Go dasturlarini tiplarni aniqlash bilan emas, kod yozish bilan boshlang. Dasturni type parameter constraint'larini yozishdan boshlasangiz, yo'ldan adashgansiz. Funksiyalarni yozing; type parameter qo'shish keyinroq, foydasi aniq bo'lganda oson. 100 Go Mistakes #9 xuddi shuni aytadi: type parameter'larni muddatidan oldin emas, aniq ehtiyoj ko'ringanda ishlating. Bu 21-darsdagi #5 'abstraksiya kashf qilinadi' qoidasining generics uchun varianti, va Code Review Comments'dagi 'interface'ni ishlatilishidan oldin e'lon qilmang' bilan bir xil mantiq (bu bog'lanish muallifning xulosasi).

### Type parameter foydali bo'lgan uch holat

Maqola uch holatni sanaydi:

1. **Til ichidagi container tiplar bilan ishlaydigan funksiyalar** (slice, map, channel), agar funksiya element tiplari haqida hech narsa faraz qilmasa. Misol: har qanday map'ning kalitlari slice'ini qaytaruvchi `MapKeys[Key comparable, Val any]`. Muqobili reflection bo'lardi: noqulay, build vaqtida tekshirilmaydi va ko'pincha sekinroq.
2. **Umumiy maqsadli ma'lumot tuzilmalari**: bog'langan ro'yxat, binar daraxt. Ilgari ular yoki aniq element tipi bilan yoki interface tipi bilan yozilar edi. Type parameter bilan qiymatlar interface'ga o'ralmay tugunlarda to'g'ridan-to'g'ri saqlanadi, type assertion kerak emas, va hammasi build vaqtida tekshiriladi.
3. **Hamma tiplar uchun bir xil ko'rinadigan umumiy metod**. Maqolaning misoli: `sort.Interface` talab qiladigan `Len` va `Swap` har qanday slice uchun aynan bir xil, shuning uchun `SliceFn[T]` bir marta yoziladi.

### Funksiya metoddan afzal

Maqola `Tree[T]` misolida muhim tavsiya beradi: taqqoslash kerak bo'lsa, constraint orqali elementdan `Compare` metodini talab qilish o'rniga konstruktorga funksiya bering. Metodni talab qilsangiz `int` kabi oddiy tiplardan foydalanuvchi o'z tipini e'lon qilib metod yozishi kerak. Funksiya yozish esa har qanday tip uchun oson, va tipda metod allaqachon bor bo'lsa `ElementType.Compare` metod ifodasi funksiya vazifasini bajaradi. Maqola xulosasi: metodni funksiyaga aylantirish tipga metod qo'shishdan ancha osonroq. Standart kutubxonadagi `slices.SortFunc` (29-dars) ham taqqoslash funksiyasi bilan ishlaydi.

### Type parameter foydasiz bo'lgan uch holat

1. **Interface tipini type parameter bilan almashtirmang.** Qiymat ustida faqat metod chaqirsangiz, interface tipi ishlating. `ReadSome(r io.Reader)` ni `ReadSome[T io.Reader](r T)` ga o'zgartirmang: yozish va o'qish osonroq, bajarilish vaqti esa ehtimol bir xil. Maqola ochiq aytadi: Go 1.18 implementatsiyasi ko'p hollarda type parameter tipidagi qiymatlarni interface tipidagilarga o'xshash ko'radi, shuning uchun type parameter odatda interface'dan tezroq emas va tezlik uchun o'zgartirmaslik kerak. Implementatsiyalar vaqt o'tishi bilan o'zgarishi mumkinligi ham qayd etilgan.
2. **Metod implementatsiyalari farq qilsa** interface ishlating. Fayldan `Read` va tasodifiy son generatoridan `Read` bir-biriga o'xshamaydi, shuning uchun ikkita alohida metod va `io.Reader`.
3. **Operatsiya har tip uchun farq qilsa va metodsiz tiplar ham kerak bo'lsa** reflection to'g'ri vosita. Maqola `encoding/json`ni misol qiladi: har bir tipdan `MarshalJSON`ni talab qilib bo'lmaydi (interface ishlamaydi), struct kodlash esa string kodlashga o'xshamaydi (type parameter ishlamaydi). Reflection kodi murakkab, lekin ishlaydi (30-dars).

### Bitta oddiy qoida

Maqola oxiri: bir xil kodni ko'p marta yozayotganingizni, nusxalar orasida faqat tiplar farq qilishini sezsangiz, type parameter haqida o'ylang. Boshqacha aytganda, type parameter'ni bir xil kodni ko'p marta yozish zaruratigacha ishlatmang.

## Chuqurroq: performance, field cheklovi va API

### Performance: o'lchang

Maqolaning performance bahosi tavsiya, kafolat emas. Bizning mashinada o'lchab ko'ramiz. Benchmark uch variantni solishtiradi: (1) `TotalIface(xs []Sizer)`: interface slice'i, (2) `TotalGeneric(xs []Gps)`: generic funksiya konkret struct slice'i bilan, (3) `TotalGeneric(xs []Sizer)`: xuddi shu generic funksiya, lekin `T` o'zi interface (`Sizer`) sifatida instantiate qilingan. Har birida 1000 ta element, `Size()` metodi chaqiriladi.

```go
package b26

import "testing"

type Sizer interface{ Size() int }
type Gps struct{ n int }

func (g Gps) Size() int { return g.n }

func TotalIface(xs []Sizer) int {
	t := 0
	for _, x := range xs {
		t += x.Size()
	}
	return t
}

func TotalGeneric[T Sizer](xs []T) int {
	t := 0
	for _, x := range xs {
		t += x.Size()
	}
	return t
}

var sink int

func BenchmarkIface(b *testing.B) {
	xs := make([]Sizer, 1000)
	for i := range xs {
		xs[i] = Gps{i}
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sink = TotalIface(xs)
	}
}

func BenchmarkGenericStruct(b *testing.B) {
	xs := make([]Gps, 1000)
	for i := range xs {
		xs[i] = Gps{i}
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sink = TotalGeneric(xs)
	}
}

func BenchmarkGenericIface(b *testing.B) {
	xs := make([]Sizer, 1000)
	for i := range xs {
		xs[i] = Gps{i}
	}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		sink = TotalGeneric(xs)
	}
}
```

Natija (Go 1.24.7, linux/amd64, Intel Xeon 2.1 GHz virtual mashina, 2 vCPU, `-count 3`):

```text
goos: linux
goarch: amd64
cpu: Intel(R) Xeon(R) Processor @ 2.10GHz
BenchmarkIface-2           	  674502	      1755 ns/op	       0 B/op	       0 allocs/op
BenchmarkIface-2           	  673266	      1804 ns/op	       0 B/op	       0 allocs/op
BenchmarkIface-2           	  696681	      1898 ns/op	       0 B/op	       0 allocs/op
BenchmarkGenericStruct-2   	  570110	      1781 ns/op	       0 B/op	       0 allocs/op
BenchmarkGenericStruct-2   	  761078	      1666 ns/op	       0 B/op	       0 allocs/op
BenchmarkGenericStruct-2   	  696882	      1581 ns/op	       0 B/op	       0 allocs/op
BenchmarkGenericIface-2    	  402302	      3137 ns/op	       0 B/op	       0 allocs/op
BenchmarkGenericIface-2    	  389007	      3026 ns/op	       0 B/op	       0 allocs/op
BenchmarkGenericIface-2    	  386989	      3245 ns/op	       0 B/op	       0 allocs/op
```

Kuzatuv: interface slice'i (1755-1898 ns/op) va generic funksiya konkret struct slice'i bilan (1581-1781 ns/op) bir-biriga yaqin, farq shovqin darajasida (bu virtual mashinada takroriy o'lchovlar orasidagi tebranish ham shu qadar). Generic funksiyaning o'zi interface slice'i bilan instantiate qilinganda (3026-3245 ns/op) 1.6-1.9 baravar sekinroq. Mexanizmni tushuntirish bu kursning manbalarida yo'q, shu sabab sababni da'vo qilmaymiz, faqat natijani qayd etamiz: type parameter tezlik uchun kafolat emas. Bu mikrobenchmark, ya'ni bitta mashina, bitta Go versiyasi va oddiy metod; boshqa Go versiyalarida natija o'zgarishi mumkin (Go 1 compatibility hujjati release'lar orasida tezlik kafolatlanmasligini aytadi, 1-dars). Qaror qabul qilishdan oldin o'z kodingizda o'lchang (61-dars).

### Type parameter orqali maydonga kirib bo'lmaydi

TypeScript'dan keladigan dasturchi `T extends { fuel: number }` yozib `x.fuel` ga kirishga o'rgangan. Go'da constraint maydon talab qila olmaydi va type parameter orqali maydonga kirish mumkin emas. Go 1.24.7 da:

```go
type P struct{ Fuel float64 }

func Total[T P](xs []T) float64 {
	var t float64
	for _, x := range xs {
		t += x.Fuel
	}
	return t
}
```

```text
x.Fuel undefined (type T has no field or method Fuel)
```

Yechimlar: constraint'ga metod qo'shish (`FuelLevel() float64`), yoki accessor funksiya berish (`func(T) float64`, 'metod emas, funksiya' tavsiyasiga mos), yoki funksiyani generic qilmasdan konkret tip uchun yozish.

### Metodning o'z type parameter'i yo'q (Go 1.24)

Generic tipga `Map[U any]` kabi metod qo'shib bo'lmaydi (Go 1.24 da `method must have no type parameters`). Natijada zanjirli (`list.Filter(...).Map(...)`) generic API TypeScript'dagidek ko'rinmaydi; 27-darsda Go 1.27 bu cheklovni qanday olib tashlagani va qanday qoldirgani ko'riladi. Hozircha qoida: Go 1.24 da bunday operatsiyalar paket darajasidagi funksiya bo'ladi.

### API'ning moslashuvchanligi

Generic funksiya imzosi uning API'si. Constraint'ni keyinroq qattiqlashtirish (masalan, `any` dan `comparable`ga) mavjud chaqiruvchilarni buzishi mumkin. Shu sababli ommaviy kutubxona API'sida constraint'ni imkon qadar keng tanlang va ichki kodda tajriba o'tkazing. Bu mulohaza qat'iy qoida emas, mantiqiy xulosa: manbalarda aniq bayon qilinmagan.

## Misol: kesh, interface va saralash

Dastur uch holatni ko'rsatadi: `Cache[K, V]` umumiy ma'lumot tuzilmasi sifatida generics uchun yaxshi nomzod; `JoinGeneric[T Namer]` va `Join([]Namer)`: faqat metod chaqiriladigan joyda generic hech narsa qo'shmaydi; heterogen ro'yxat faqat interface bilan tabiiy; `sort.Slice` va `slices.SortFunc` taqqoslash.

```go
package main

import (
	"fmt"
	"slices"
	"sort"
	"strings"
)

// 1) Yaxshi holat: bir xil algoritm turli tiplar uchun - generics.
type Cache[K comparable, V any] struct {
	data  map[K]V
	order []K
	cap   int
}

func NewCache[K comparable, V any](capacity int) *Cache[K, V] {
	return &Cache[K, V]{data: make(map[K]V), cap: capacity}
}

func (c *Cache[K, V]) Put(k K, v V) {
	if _, ok := c.data[k]; !ok {
		if len(c.order) == c.cap {
			oldest := c.order[0]
			c.order = c.order[1:]
			delete(c.data, oldest)
		}
		c.order = append(c.order, k)
	}
	c.data[k] = v
}

func (c *Cache[K, V]) Get(k K) (V, bool) {
	v, ok := c.data[k]
	return v, ok
}

// 2) Yomon holat: faqat metod chaqiriladi, generics keraksiz - interface yetarli.
type Namer interface{ Name() string }

type Gps struct{ id string }
type Dut struct{ id string }

func (g Gps) Name() string { return "gps-" + g.id }
func (d Dut) Name() string { return "dut-" + d.id }

// Generic versiya hech narsa qo'shmaydi:
func JoinGeneric[T Namer](xs []T) string {
	var parts []string
	for _, x := range xs {
		parts = append(parts, x.Name())
	}
	return strings.Join(parts, ",")
}

// Interface versiya sodda va heterogen ro'yxatni ham qabul qiladi:
func Join(xs []Namer) string {
	var parts []string
	for _, x := range xs {
		parts = append(parts, x.Name())
	}
	return strings.Join(parts, ",")
}

// 3) Saralash: sort.Slice (reflect-asosli swapper) va slices.SortFunc.
type Reading struct {
	ID   string
	Fuel float64
}

func main() {
	c := NewCache[string, float64](2)
	c.Put("T-1", 40)
	c.Put("T-2", 12)
	c.Put("T-3", 77)
	_, ok1 := c.Get("T-1")
	v3, ok3 := c.Get("T-3")
	fmt.Println(ok1, v3, ok3)

	fmt.Println(JoinGeneric([]Gps{{"1"}, {"2"}}))
	fmt.Println(Join([]Namer{Gps{"1"}, Dut{"9"}}))
	// JoinGeneric([]Namer{Gps{"1"}, Dut{"9"}}) ham ishlaydi: Namer o'zi Namer'ni qanoatlantiradi.
	fmt.Println(JoinGeneric([]Namer{Gps{"1"}, Dut{"9"}}))

	rs := []Reading{{"a", 30}, {"b", 10}, {"c", 20}}
	sort.Slice(rs, func(i, j int) bool { return rs[i].Fuel < rs[j].Fuel })
	fmt.Println(rs)
	slices.SortFunc(rs, func(x, y Reading) int { return strings.Compare(y.ID, x.ID) })
	fmt.Println(rs)
}
```

Chiqish (Go 1.24.7, linux/amd64):

```text
false 77 true
gps-1,gps-2
gps-1,dut-9
gps-1,dut-9
[{b 10} {c 20} {a 30}]
[{c 20} {b 10} {a 30}]
```

Tahlil:

- `Cache` sig'imi 2: uchinchi `Put` eng eskisini (`T-1`) chiqarib yuboradi, shuning uchun `Get("T-1")` `false`, `Get("T-3")` `77 true`. Ma'lumot tuzilmasi `K` va `V` ga bog'liq emas va qiymatlar interface'ga o'ralmagan: maqoladagi 2-holat.
- `JoinGeneric([]Gps{...})` va `Join([]Namer{...})` bir natija beradi, generic versiya esa hech narsa qo'shmaydi. Qiziq nuqta: `JoinGeneric([]Namer{...})` ham ishlaydi, chunki `Namer` interface'ining o'zi `Namer` constraint'ini qanoatlantiradi (interface tipi o'zining metodlarini implement qiladi). Biroq `[]Gps` va `[]Dut`ni bir ro'yxatga aralashtirish faqat `[]Namer` bilan mumkin.
- Oxirgi ikki qator: `sort.Slice` indekslar bilan ishlaydigan `less` oladi (tip xavfsizligi yo'q: `x any` qabul qiladi), `slices.SortFunc` esa elementlarni oladi va `cmp` natijasini qaytaradi. Natija: yoqilg'i bo'yicha o'sish va ID bo'yicha kamayish.

## Qachon qo'llamaslik kerak

Bu darsning o'zi 'qachon generics ishlatmaslik' haqida, shuning uchun qisqa jamlama:

- Qiymat ustida faqat metod chaqirilsa: interface.
- Har tip uchun implementatsiya farq qilsa: interface (yoki qiymatlar uchun reflection).
- Hali bir xil kod ikki-uch marta yozilmagan bo'lsa: konkret tip bilan boshlang, type parameter keyin.
- Generic API murakkablashib ketsa (3+ type parameter, ichma-ich constraint, imzo bir qatordan uzun): dizaynni soddalashtiring.
- Tezlik uchun: o'lchamasdan generics'ga o'tmang; maqola va bizning o'lchovimiz tezlik kafolatlamaydi.
- Generic `Repository[T]` kabi 'hammasi uchun bitta' abstraksiya: har bir entity uchun SQL, indeks va xatolar farq qiladi. Bunday joyda qisqa interface iste'molchi tomonida (21-dars) va faqat haqiqatan bir xil qismlar uchun generic yordamchilar to'g'riroq.

Teskari tomoni ham bor: haqiqatan bir xil kodni uch tip uchun yozib qo'yish ham yomon. `slices`, `maps` kabi standart paketlar shu sababli generic. Slice'lar uchun interface qulay emas: `[]Gps` ni `[]Namer`ga o'tkazib bo'lmaydi.

```text
cannot use gs (variable of type []Gps) as []Namer value in argument to Names
```

Shu holatda `Names[T Namer](xs []T)` chaqiruvchini konversiya siklidan qutqaradi. Maqola qoidasi yakka qiymat haqida; slice uchun generic ko'pincha qulaylik sababli oqlanadi (bu muallifning bahosi).

## Stack'da: TypeScript bilan farq

TypeScript'da generics hamma joyda: `Repository<T>`, `Promise<T>`, `Array<T>`, va tip ma'lumoti o'chiriladi (erased), shuning uchun ularning bajarilishga ta'siri yo'q. Go'da generics kamroq ishlatiladi:

- Muallifning kuzatuvi: Go loyihalarida DI konteyner va `Repository<T>` uslubi kam uchraydi. Qatlamlar iste'molchi tomonidagi kichik interface'lar bilan bog'lanadi (21-dars). Generic repository o'rniga har bir entity uchun oddiy konkret repository va unga 1-2 metodli interface.
- TS'da `Array.map<U>` zanjirlari odatiy. Go'da `slices` va `maps` paketlari generic funksiyalar to'plami; zanjirli metodlar Go 1.24 da yo'q (27-dars), `for` sikli va iterator'lar (28-dars) o'rnini bosadi.
- TS'da conditional type va mapped type bilan murakkab tip dasturlash mumkin; Go'da bunday vosita yo'q, va bu ataylab: constraint soddaligi saqlanadi.
- Kod ko'rib chiqishda ikki savol bering: 'bu yerda type parameter nima beradi, interface bermaydigan?' va 'bir xil kod necha marta yozilgan?'.

## Xulosa

- Avval konkret kod yozing; type parameter'ni bir xil kod takrorlanganda kiriting. Bu 100 Go Mistakes #9 va Go jamoasi maqolasining umumiy xulosasi.
- Generics mos: container tiplar ustidagi funksiyalar (`MapKeys`), umumiy ma'lumot tuzilmalari (daraxt, kesh) va barcha tiplar uchun bir xil metodlar.
- Interface mos: faqat metod chaqirilganda va implementatsiya tipga qarab farq qilganda. Reflection mos: har tip uchun farqli va metodsiz tiplar ham kerak bo'lganda.
- Taqqoslash kabi xatti-harakatni constraint metodi emas, funksiya parametri sifatida bering.
- Type parameter tezlik kafolatlamaydi: bizning o'lchovimizda interface bilan instantiate qilingan generic funksiya sekinroq chiqdi; o'z kodingizda o'lchang.
