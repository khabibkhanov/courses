---
n: 11
slug: slice-header-append
title: "Slice: header, len/cap va append mexanikasi"
summary: "Slice qiymati aslida nima (pointer, len, cap), nega u massivning bir bo'lagiga ko'rinish bo'ladi, reslice nima uchun nusxa olmaydi va append qachon yangi massiv ajratadi."
duration: 40
sources:
  - id: go-spec
    note: "Slice types, Slice expressions, Appending to and copying slices, Length and capacity bo'limlari"
  - id: blog-slices-intro
    note: "Slice internals va Growing slices (the copy and append functions) bo'limlari"
  - id: blog-slices
    note: "Passing slices to functions va Nil bo'limlari"
quiz:
  - q: "Quyidagi kod nima chiqaradi?\n\na := make([]int, 3, 5)\nb := append(a, 1)\nc := append(a, 2)\nfmt.Println(b[3], c[3])"
    options:
      - "1 2"
      - "2 2"
      - "1 1"
      - "Panic: index out of range"
    answer: 1
    explain: "len(a)=3, cap(a)=5, shuning uchun ikkala append ham yangi massiv ajratmaydi va a ning massivida 3-indeksga yozadi. Ikkinchi append birinchisining qiymatini ustidan yozadi, b va c esa bir xil massivga qaraydi. Natija: 2 2."
  - q: "Chaqiruvchida s := make([]int, 1, 1). Quyidagi funksiya chaqirilgandan keyin chaqiruvchida s[0] nimaga teng?\n\nfunc f(s []int) {\n    s = append(s, 1)\n    s[0] = 9\n}"
    options:
      - "9, chunki slice reference tipi"
      - "9, va len(s) ham 2 bo'ladi"
      - "0: append yangi massiv ajratdi, s[0] = 9 shu yangi massivga yozildi"
      - "Panic, chunki cap yetmaydi"
    answer: 2
    explain: "Funksiya slice header'ning nusxasini oladi. cap=1 bo'lgani uchun append yangi massiv ajratadi va lokal s endi o'sha massivga qaraydi. s[0] = 9 yangi massivni o'zgartiradi, chaqiruvchining massivi va header'i (len=1) o'zgarishsiz qoladi."
  - q: "var a []int va b := []int{} haqida qaysi gap to'g'ri?"
    options:
      - "len ikkalasida 0, append ikkalasida ishlaydi, lekin faqat a == nil rost"
      - "b nil, a esa bo'sh slice"
      - "a ga append qilib bo'lmaydi, chunki massivi yo'q"
      - "len(a) panic beradi"
    answer: 0
    explain: "Nil slice - header'ning zero value'si (pointer nil, len=0, cap=0). Unga append qilish to'liq ishlaydi: append yangi massiv ajratadi. Bo'sh slice nil emas, lekin len va cap ikkalasida 0 bo'lishi mumkin."
  - q: "Telemetriya servisida bir kishi append orqali cap o'sishini o'lchadi: Go 1.24 / amd64 da 512 dan keyin 848 chiqdi. U 'append har doim 1.25x o'stiradi' deb qoida yozmoqchi. Nima noto'g'ri?"
    options:
      - "Hech narsa, 848 / 512 = 1.65, demak qoida 1.65x"
      - "Spetsifikatsiya 2x o'sishni kafolatlaydi"
      - "append hech qachon cap'ni o'zgartirmaydi"
      - "Spetsifikatsiya faqat 'yetarlicha katta yangi massiv' deydi; o'sish qoidasi va yaxlitlash implementatsiya tafsiloti bo'lib, versiyalar orasida o'zgarishi mumkin"
    answer: 3
    explain: "Spetsifikatsiya o'sish koeffitsiyentini belgilamaydi. Kuzatilgan cap'ga qurilgan mantiq (masalan, 'ikki marta oshganda realloc bo'ladi') toolchain yangilanganda buzilishi mumkin. Aniq cap kerak bo'lsa, make yoki slices.Grow bilan o'zingiz belgilang."
  - q: "s := []int{1, 2, 3, 4, 5}; t := s[1:3]. len(t) va cap(t) nechta?"
    options:
      - "2 va 2"
      - "2 va 4"
      - "3 va 4"
      - "2 va 5"
    answer: 1
    explain: "t ning pointer'i s[1] ga qaraydi. len = 3-1 = 2. cap = massivning t boshidan oxirigacha bo'lgan qismi = 5-1 = 4. Shuning uchun t[:4] ruxsat etiladi va s[1:5] ni ko'rsatadi."
  - q: "Window.Push value receiver bilan yozilgan va ichida w.vals = append(w.vals, v) bor. Push chaqirilgandan keyin oyna bo'sh qolmoqda. Sababi nima?"
    options:
      - "append doim yangi slice qaytaradi va uni e'tiborsiz qoldirish kerak"
      - "Go struct maydonlariga append qilishni taqiqlaydi"
      - "Value receiver Window nusxasini oladi; nusxadagi vals header'i o'zgaradi, original esa o'zgarishsiz"
      - "limit maydoni 0 bo'lgani uchun append ishlamaydi"
    answer: 2
    explain: "Receiver ham oddiy parametr: struct nusxalanadi, ichidagi slice header ham nusxalanadi. append header'ni (yangi len, ehtimol yangi pointer) o'zgartiradi va bu o'zgarish nusxada qoladi. Pointer receiver kerak."
task:
  title: "Window: header nusxalanishi va ichki massivni sizdirmaslik"
  prompt: |
    Avtopark monitoring platformasi har bir datchikdan so'nggi `limit` ta o'qishni `Window` strukturasida saqlaydi. Boshlang'ich kodda ikkita xato bor:

    1. `Push` value receiver bilan yozilgan: `append` natijasi nusxada qoladi va oyna doim bo'sh.
    2. `Snapshot` ichki slice'ni to'g'ridan-to'g'ri qaytaradi: chaqiruvchi `snap[0] = -1` desa, oynaning ichki massivi buziladi.

    Vazifa: `Window`ni to'g'rilang. `NewWindow(limit)` capacity'ni `limit` ga oldindan ajratsin (oyna to'lganda qayta ajratish bo'lmasin), `Push` pointer receiver bilan ishlasin va limitdan oshganda eng eski o'qishni tashlasin, `Snapshot` esa nusxa qaytarsin. `main` imzosi va chiqishi mantiqi saqlansin.
  lang: go
  starter: |
    package main

    import "fmt"

    // Window - datchikdan kelgan so'nggi o'qishlar oynasi.
    type Window struct {
        limit int
        vals  []float64
    }

    // Push yangi o'qishni qo'shadi va oynani limit bilan cheklaydi.
    func (w Window) Push(v float64) {
        w.vals = append(w.vals, v)
        if len(w.vals) > w.limit {
            w.vals = w.vals[len(w.vals)-w.limit:]
        }
    }

    // Snapshot oynadagi qiymatlarni qaytaradi.
    func (w Window) Snapshot() []float64 {
        return w.vals
    }

    func main() {
        w := Window{limit: 3}
        for _, v := range []float64{10, 11, 12, 13, 14} {
            w.Push(v)
        }
        snap := w.Snapshot()
        fmt.Println("oyna:", snap)
        if len(snap) > 0 {
            snap[0] = -1
        }
        fmt.Println("qayta o'qish:", w.Snapshot())
    }
  solution: |
    package main

    import "fmt"

    // Window - datchikdan kelgan so'nggi o'qishlar oynasi.
    type Window struct {
        limit int
        vals  []float64
    }

    // NewWindow limit uchun capacity oldindan ajratadi.
    func NewWindow(limit int) *Window {
        return &Window{limit: limit, vals: make([]float64, 0, limit)}
    }

    // Push yangi o'qishni qo'shadi; oyna limitdan oshsa eng eskisini tashlaydi.
    func (w *Window) Push(v float64) {
        if w.limit == 0 {
            return
        }
        if len(w.vals) == w.limit {
            copy(w.vals, w.vals[1:])
            w.vals = w.vals[:w.limit-1]
        }
        w.vals = append(w.vals, v)
    }

    // Snapshot oynaning nusxasini qaytaradi: chaqiruvchi ichki massivga tegolmaydi.
    func (w *Window) Snapshot() []float64 {
        out := make([]float64, len(w.vals))
        copy(out, w.vals)
        return out
    }

    func main() {
        w := NewWindow(3)
        for _, v := range []float64{10, 11, 12, 13, 14} {
            w.Push(v)
        }
        snap := w.Snapshot()
        fmt.Println("oyna:", snap)
        snap[0] = -1
        fmt.Println("qayta o'qish:", w.Snapshot())
    }
  solutionNotes: |
    - `Push` pointer receiver oldi: `w.vals` header'i endi haqiqiy `Window`da yangilanadi. Value receiver'da header nusxalanadi va o'zgarish yo'qoladi.
    - `make([]float64, 0, limit)` capacity'ni bir marta ajratadi. `Push` to'lgan oynada `copy` bilan qiymatlarni bir joyga suradi va len'ni kamaytirib, keyin `append` qiladi, shuning uchun cap hech qachon oshmaydi va qayta ajratish bo'lmaydi.
    - `Snapshot` yangi slice ajratib, `copy` qiladi. Chaqiruvchi nusxani o'zgartirsa, oynaning massivi tegilmaydi.
    - Kutilgan chiqish: `oyna: [12 13 14]` va `qayta o'qish: [12 13 14]`.
    - Eski elementni `w.vals[1:]` bilan tashlash o'rniga `copy` ishlatilgani uchun massivning boshi bo'sh joy bo'lib qolmaydi va cap kamaymaydi.
  checklist:
    - "`Push` pointer receiver bilan, o'qishlar haqiqatan saqlanadi"
    - "Oyna limitdan oshganda eng eski qiymat tashlanadi: besh o'qishdan keyin [12 13 14]"
    - "`NewWindow` capacity'ni limit ga ajratadi, Push tufayli cap o'zgarmaydi"
    - "`Snapshot` nusxa qaytaradi: snap[0] = -1 oynaga ta'sir qilmaydi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Telemetriya servisida tez-tez shunday kod uchraydi: sensor o'qishlarini slice'ga yig'ish, uni funksiyalarga uzatish, qismini (`readings[10:20]`) boshqa goroutine'ga berish. Kod ishlaydi, testlar o'tadi, keyin production'da bitta o'qish boshqa sensor ma'lumotini buzadi yoki xotira sababsiz o'sadi. Sabab deyarli har doim bitta: dasturchi slice'ni "dinamik massiv" yoki "reference tipi" deb o'ylaydi, aslida u uchinchi narsa.

Node.js'da `Array` obyekt: uni funksiyaga bersangiz, funksiya shu obyektning o'zini oladi, `push` uni o'zgartiradi. TypeScript'da `arr.slice(2, 4)` har doim nusxa qaytaradi. Go'da ikkala taxmin ham noto'g'ri. Slice qiymat bo'lib, uch maydonli kichik struct; `s[2:4]` nusxa olmaydi; `append` ba'zan yangi massiv ajratadi, ba'zan yo'q. Bu darsda slice'ning aniq tuzilishini va `append` qoidasini o'rganamiz. Keyingi dars (12-dars) shu bilimga qurilgan tuzoqlarni ko'radi.

## Asosiy g'oya

### Slice - massivning bo'lagiga ko'rinish

Spetsifikatsiya slice'ni shunday tavsiflaydi: u asosidagi massivning ketma-ket bo'lagiga ishora qiladi va shu massivning boshqa slice'lari bilan xotirani bo'lishadi. Go Blog'ning "Go Slices: usage and internals" maqolasi buni aniqroq aytadi: slice massiv segmentining deskriptori bo'lib, massivga pointer, segment uzunligi va sig'im (capacity) dan iborat.

Shu uch maydonni slice header deb ataymiz. Header'ning o'zi qiymat, ya'ni o'zgaruvchiga tayinlaganda yoki funksiyaga berganda nusxalanadi. Header ko'rsatayotgan massiv (backing array) esa nusxalanmaydi. Blog maqolasi buni aniq yozadi: slice pointer emas, pointer va uzunlikni ushlab turuvchi struct qiymati. Bundan kelib chiqadigan natijalar:

- Elementni o'zgartirish (`s[i] = x`) massivni o'zgartiradi va uni ko'rayotgan hamma slice'da ko'rinadi.
- `s = append(s, x)` yoki `s = s[1:]` esa faqat o'zgaruvchi `s` dagi header'ni o'zgartiradi. Funksiyaga berilgan nusxa bunday o'zgarishni chaqiruvchiga yetkazmaydi.

### len va cap

`len(s)` - slice ko'rsatayotgan elementlar soni. `cap(s)` - header'dagi pointer boshlangan joydan massiv oxirigacha bo'lgan elementlar soni. Spetsifikatsiya munosabatni yozadi: `0 <= len(s) <= cap(s)`, nil slice uchun ikkalasi 0. Capacity slice uzunligidan tashqaridagi, lekin shu massivga tegishli joyni o'lchaydi: uzunligi cap gacha bo'lgan yangi slice'ni `s[:k]` bilan olish mumkin.

Nil slice - header'ning zero value'si: pointer `nil`, len 0, cap 0. Go Blog'ning "Arrays, slices (and strings): The mechanics of 'append'" maqolasi muhim farqni ko'rsatadi: `array[0:0]` ham uzunligi nol slice beradi, lekin pointer'i `nil` emas, shuning uchun u nil slice emas. Amalda sizga ikkita fakt kerak: nil slice bilan `len`, `cap`, `range` va `append` ishlaydi; `s == nil` esa faqat header pointer'i nil bo'lgandagina rost.

### Reslice va append

Slice ifodasi `s[low:high]` yangi header yaratadi: pointer `s` ning `low`-elementiga siljiydi, len `high-low`, cap esa `cap(s)-low` bo'ladi. Ma'lumot nusxalanmaydi, shuning uchun amal O(1). Spetsifikatsiya `append` qoidasini shunday beradi: agar `s` ning sig'imi yangi qiymatlarni sig'dirishga yetmasa, `append` hamma mavjud elementlarni va yangilarini sig'diradigan yangi massiv ajratadi; aks holda mavjud massivdan qayta foydalanadi. Natija har holda yangi header, shuning uchun `s = append(s, x)` shaklini yodlash kerak.

Bu qoida ikki tomonlama xavf tug'diradi: `append` yangi massiv ajratganida eski va yangi slice'lar bir-biridan ajraladi, ajratmaganda esa bir xil massivni ko'rishda davom etadi. Ikkala holat ham to'g'ri, lekin kod qaysi biriga tayanishi ma'lum bo'lmasa, xatti-harakat cap qiymatiga bog'liq bo'lib qoladi.

## Chuqurroq: o'sish va uni kuzatish

### Spetsifikatsiya nimani aytmaydi

Spetsifikatsiya o'sish koeffitsiyentini belgilamaydi: faqat "yetarlicha katta yangi massiv" deydi. Go Blog'dagi "Growing slices" bo'limi o'sish g'oyasini ikkilanish (`(cap+1)*2`) bilan ko'rsatadi, lekin bu o'quv misoli: real `append` bunday ishlamaydi, buni quyidagi o'lchov ko'rsatadi. Real o'sish toolchain'ga bog'liq va release'lar orasida o'zgargan. Quyidagi o'lchov faqat Go 1.24.7, linux/amd64 uchun:

```go
package main

import "fmt"

func main() {
	var s []int
	last := -1
	for i := 0; i < 2000; i++ {
		s = append(s, i)
		if cap(s) != last {
			fmt.Printf("len=%-5d cap=%d\n", len(s), cap(s))
			last = cap(s)
		}
	}
}
```

```text
len=1     cap=1
len=2     cap=2
len=3     cap=4
len=5     cap=8
len=9     cap=16
len=17    cap=32
len=33    cap=64
len=65    cap=128
len=129   cap=256
len=257   cap=512
len=513   cap=848
len=849   cap=1280
len=1281  cap=1792
len=1793  cap=2560
```

Kichik hajmda cap ikki baravar oshadi (1, 2, 4, 8, ... 512). 512 dan keyin o'sish sekinlashadi: 848, 1280, 1792, 2560. Bizning kuzatuvimizcha, 848, 1280, 1792 va 2560 qiymatlari runtime ajratadigan xotira o'lchamlariga yaxlitlangan (`[]int` uchun element 8 bayt); bu rasmiy hujjat bilan tasdiqlanmagan. Shuning uchun boshqa element tipida yoki boshqa versiyada ketma-ketlik farq qilishi mumkin. Xulosa: cap qiymatiga tayanib mantiq qurmang, kerak bo'lsa o'zingiz boshqaring.

### O'sishni o'zingiz boshqarish

Uzunlik oldindan ma'lum bo'lsa, `make([]T, 0, n)` bilan capacity ajrating: bu yo'lda `append` hech qachon qayta ajratmaydi. 100 Go Mistakes kitobi (#21) buni "inefficient slice initialization" xatosi sifatida beradi: oldindan ajratmaslik ko'p nusxalash va GC uchun vaqtinchalik massivlar degani. Mavjud slice'ga yana `n` ta element sig'ishini kafolatlash uchun `slices.Grow(s, n)` bor: paket hujjatiga ko'ra, undan keyin kamida `n` ta element qayta ajratmasdan qo'shiladi. `slices.Clip(s)` esa ortiqcha capacity'ni kesadi va `s[:len(s):len(s)]` ni qaytaradi.

### Slice header'ni o'tkazish

Funksiyaga slice berish header'ni nusxalaydi (24 bayt, 64-bitli platformada: pointer, len, cap uch so'z). Bu arzon, shuning uchun slice'ni pointer bilan o'tkazish kamdan-kam kerak. Lekin header nusxasi ma'nosini yodda tuting:

- Funksiya ichida `s[i] = x` chaqiruvchi ko'radigan massivni o'zgartiradi.
- Funksiya ichida `s = append(s, x)` chaqiruvchining `s` header'ini o'zgartirmaydi, hatto massiv umumiy bo'lsa ham: chaqiruvchining len'i eski qiymatda qoladi.
- Slice'ni o'zgartiradigan funksiya yangi slice'ni qaytarishi kerak (`s = f(s)`, standart `append` va `slices.Insert` shunday) yoki slice'ga pointer olishi kerak.

## Misol: header, umumiy massiv va append

Birinchi dastur header, nil va bo'sh slice hamda reslice orqali massivning bo'lishilishini ko'rsatadi:

```go
package main

import (
	"fmt"
	"unsafe"
)

func describe(name string, s []float64) {
	fmt.Printf("%-8s len=%d cap=%d nil=%t\n", name, len(s), cap(s), s == nil)
}

func main() {
	fmt.Println("slice header o'lchami:", unsafe.Sizeof([]float64(nil)), "bayt")

	var nilSlice []float64
	empty := []float64{}
	describe("nil", nilSlice)
	describe("bo'sh", empty)

	fuel := []float64{41.5, 40.9, 40.2, 39.8, 39.1}
	describe("fuel", fuel)
	tail := fuel[2:4]
	describe("tail", tail)

	fmt.Println("tail[0] va fuel[2] bir xil manzilmi:", &tail[0] == &fuel[2])
	tail[0] = 0
	fmt.Println("fuel[2] =", fuel[2], "(tail[0] orqali o'zgardi)")

	// tail capacity'si fuel oxirigacha cho'ziladi
	more := tail[:3]
	fmt.Println("tail[:3] =", more, "(len=2 dan ortiq, cap ichida)")
}
```

Go 1.24.7, linux/amd64 da chiqish:

```text
slice header o'lchami: 24 bayt
nil      len=0 cap=0 nil=true
bo'sh    len=0 cap=0 nil=false
fuel     len=5 cap=5 nil=false
tail     len=2 cap=3 nil=false
tail[0] va fuel[2] bir xil manzilmi: true
fuel[2] = 0 (tail[0] orqali o'zgardi)
tail[:3] = [0 39.8 39.1] (len=2 dan ortiq, cap ichida)
```

`tail` ning cap'i 3: `fuel[2:4]` boshlanishi `fuel[2]` da, massiv oxirigacha uchta element bor. Shuning uchun `tail[:3]` ruxsat etiladi va len=2 chegarasidan tashqaridagi `fuel[4]` ni ko'rsatadi. Bu "cap ichida" qoidasi: indekslash `len` bilan cheklanadi, reslice esa `cap` bilan.

Ikkinchi dastur `append` qachon massivni bo'lishishini ko'rsatadi:

```go
package main

import "fmt"

func main() {
	base := make([]string, 3, 4)
	copy(base, []string{"A", "B", "C"})

	x := append(base, "X") // cap yetarli: ikkalasi bitta massivni ishlatadi
	y := append(base, "Y") // x[3] ni ustidan yozadi

	fmt.Println("x:", x, "len/cap:", len(x), cap(x))
	fmt.Println("y:", y, "len/cap:", len(y), cap(y))

	z := append(base, "Z1", "Z2") // cap yetmaydi: yangi massiv
	z[0] = "o'zgargan"
	fmt.Println("base:", base)
	fmt.Println("z:", z)
}
```

```text
x: [A B C Y] len/cap: 4 4
y: [A B C Y] len/cap: 4 4
base: [A B C]
z: [o'zgargan B C Z1 Z2]
```

`base` ning cap'i 4, len'i 3. `x := append(base, "X")` yangi massiv ajratmaydi: 3-indeksga "X" yozadi. `y := append(base, "Y")` esa xuddi shu joyga "Y" yozadi va `x` ning oxirgi elementi ham "Y" ga aylanadi. Ikkala natija ham bir massivni ko'rsatgani uchun `x` va `y` bir xil. `z` esa ikki element qo'shgani uchun (cap 4 ga sig'maydi) yangi massiv oladi, va `z[0]` ni o'zgartirish `base` ga ta'sir qilmaydi. Ya'ni bitta `append` chaqiruvi cap'ga qarab ikki xil xatti-harakat ko'rsatadi, va bu 12-darsdagi xatolarning manbai.

## Qachon qo'llamaslik kerak

- Slice'ni "qisqa muddatli ko'rinish" sifatida ishlating, uzoq yashaydigan qiymat sifatida emas. Katta massivning kichik bo'lagini struct'ga saqlasangiz, butun massiv xotirada qoladi. Go Blog'ning "A possible gotcha" bo'limi aynan shu holatni ko'rsatadi; yechim - kerakli qismni nusxalash (12-dars).
- Doimiy uzunlikdagi, tipning bir qismi bo'lishi kerak bo'lgan ma'lumot uchun massiv (`[16]byte`, `[3]float64`) slice'dan yaxshiroq: u qiymat semantikasiga ega, taqqoslanadi va map kaliti bo'la oladi.
- `cap` qiymatini jamoalararo shartnoma qilmang. "API 8 elementgacha qayta ajratmaydi" kabi va'dalar kod o'zgarmasa ham toolchain yangilanishi bilan buzilishi mumkin; shartnoma kerak bo'lsa, `make` bilan o'zingiz ajrating.
- Ichki holatni qaytarayotgan metodda (`Snapshot`) slice'ning o'zini berish, chaqiruvchiga massivga yozish huquqini berish demak. Ishonchsiz iste'molchilar uchun nusxa qaytaring yoki `slices.Clone` ishlating.
- Slice'ni funksiyaga "o'zgartirsin" deb berish o'rniga qiymat qaytaring. Aks holda `append` natijasi yo'qoladi, yuqoridagi `Window` xatosi shu.

## Stack'da: Node.js/TypeScript bilan solishtirish

TypeScript'da massiv ro'yxat sifatida ishlaydi: `arr.push(x)` obyektning o'zini o'zgartiradi va barcha havolalar uni ko'radi. `slice` metodi esa ma'lumotni nusxalaydi. Go'da bu ikkisi teskari: elementga yozish hamma slice'larda ko'rinadi (massiv umumiy), `append` natijasi esa faqat qaytarilgan header'da. Eng ko'p uchraydigan holat: Node.js'dan kelgan dasturchi `func add(list []Reading)` yozib, ichida `list = append(list, r)` qiladi va chaqiruvchi o'zgarishni ko'rmaydi.

Telemetriya misolida qoida oddiy: yig'uvchi struct pointer receiver bilan ishlasin, oldindan `make([]T, 0, n)` bilan ajrating, tashqariga ichki massivni emas, nusxani bering. Uzun yashaydigan holat (oxirgi nuqtalar keshi, oyna) uchun sig'imni cheklab qo'ying, o'sishga qo'yib yubormang.

## Xulosa

- Slice - massivga pointer, len va cap dan iborat kichik qiymat; header nusxalanadi, massiv emas.
- Reslice `s[i:j]` nusxa olmaydi, O(1) va massivni bo'lishadi; cap yangi boshlanishdan massiv oxirigacha hisoblanadi.
- `append` cap yetsa mavjud massivga yozadi, yetmasa yangi massiv ajratadi; natijani doim qabul qiling (`s = append(s, x)`).
- O'sish koeffitsiyenti spetsifikatsiyada yo'q; o'lchangan qiymatlar (Go 1.24.7, amd64) implementatsiya tafsiloti, ularga tayanmang.
- Nil slice bilan `len`, `range`, `append` ishlaydi; funksiya slice'ni o'zgartirsa, yangisini qaytarsin yoki pointer olsin.
- Ichki massivni tashqariga bermang: nusxa qaytaring, capacity'ni `make` bilan oldindan belgilang.
