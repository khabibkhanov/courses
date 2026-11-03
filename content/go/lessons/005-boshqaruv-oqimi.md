---
n: 5
slug: boshqaruv-oqimi
title: "for, switch, label va loop o'zgaruvchisi semantikasi"
summary: "for'ning uch shakli va range ifodasi qanday baholanishi, Go 1.22 dagi per-iteration o'zgaruvchilar (va ularning go.mod'ga bog'liqligi), range elementni nusxalashi, switch'da fallthrough va break, label bilan chiqish."
duration: 40
sources:
  - id: go-spec
    note: "For statements (for clause va range clause, Go 1.22 va 1.23 o'zgarishlari), Switch statements, Break, Continue, Goto, Fallthrough, Labeled statements va Appendix: Language versions bo'limlari"
  - id: gopl
    note: "Kitobning boshqaruv oqimi (for, switch) va closure'lar haqidagi boblari (umumiy tayanch; aniq qoidalar spetsifikatsiyadan olingan)"
  - id: 100go
    note: "#30 (range elementlarni nusxalaydi), #31 (range ifodasi qanday baholanadi), #32 (range'da pointer elementlar), #34 (break qanday ishlaydi), #35 (tsiklda defer), #63 (goroutine va loop o'zgaruvchisi): sarlavhalar saytdagi ro'yxatdan"
quiz:
  - q: "Go 1.24 toolchain, lekin go.mod'da `go 1.21` yozilgan. Kod: `for i := 0; i < 3; i++ { fs = append(fs, func() int { return i }) }`, keyin hamma fs[k]() chaqiriladi. Natija?"
    options:
      - "0 1 2, chunki toolchain 1.24"
      - "Kompilyatsiya xatosi: closure tsikl o'zgaruvchisini ushlay olmaydi"
      - "Natija tasodifiy, chunki goroutine yo'q"
      - "3 3 3, chunki per-iteration semantikasi go.mod'dagi language version 1.22 yoki undan yuqori bo'lgandagina yoqiladi"
    answer: 3
    explain: "Per-iteration o'zgaruvchilar Go 1.22 da language version darajasida kiritilgan, shuning uchun modulning go qatori hal qiladi (2-dars). Sandbox'dagi Go 1.24.7 toolchain'i `go 1.21` yozilgan modulda shu mantiq bo'yicha umumiy o'zgaruvchini ko'rsatdi (misol: `fuel-3 fuel-3 fuel-3`)."
  - q: "arr := [3]int{1,2,3}. `for i, v := range arr { if i == 0 { arr[2] = 100 }; print(v) }` nimani chop etadi? Slice ([]int) bilan-chi?"
    options:
      - "Massiv: 1 2 3, slice: 1 2 100"
      - "Massiv: 1 2 100, slice: 1 2 3"
      - "Ikkalasi ham 1 2 100"
      - "Ikkalasi ham 1 2 3"
    answer: 0
    explain: "Range ifodasi tsikl boshlanishidan oldin bir marta baholanadi. Massiv qiymat sifatida nusxalanadi, shuning uchun tsikl ichidagi o'zgarish ko'rinmaydi. Slice esa header nusxalanadi, backing array umumiy, o'zgarish ko'rinadi."
  - q: "`for _, r := range readings { switch { case r < 0: break; case r > 100: log() } }` ichidagi `break` nimani to'xtatadi?"
    options:
      - "Butun for tsiklini"
      - "Funksiyani"
      - "Faqat switch'ni, for keyingi elementga o'tadi"
      - "Hech narsani: break switch ichida ruxsat etilmagan"
    answer: 2
    explain: "Spetsifikatsiya: break eng ichki for, switch yoki select ni tugatadi. Tsiklni to'xtatish uchun for'ga label qo'yib `break label` yoziladi."
  - q: "`var n int64 = 5; for i := range n { _ = i }` da i qanday tipda?"
    options:
      - "int, chunki range integer uchun doim int beradi"
      - "int64, chunki n integer tipida bo'lsa, iteratsiya qiymatlari shu tipda bo'ladi"
      - "uint, chunki indeks manfiy bo'lmaydi"
      - "Kompilyatsiya xatosi: range faqat konstanta bilan ishlaydi"
    answer: 1
    explain: "Spetsifikatsiya: n integer tipida bo'lsa, iteratsiya qiymatlari ham shu tipda. Faqat untyped konstanta (range 3) uchun default type (int) ishlatiladi."
  - q: "`s := []int{1,2,3}; for i := range s { s = append(s, i) }` tugagach len(s) nechta?"
    options:
      - "Cheksiz tsikl"
      - "4"
      - "5"
      - "6"
    answer: 3
    explain: "Range ifodasi bir marta baholanadi va uzunlik tsikl boshida qotadi: 3 iteratsiya, har birida bitta element qo'shiladi. 3 + 3 = 6. Cheksiz tsikl bo'lmaydi."
  - q: "x == 1 bo'lganda quyidagi switch nimani bajaradi? `switch x { case 1: A(); fallthrough; case 2: B(); default: C() }`"
    options:
      - "Faqat A"
      - "A, B va C"
      - "A va B"
      - "Kompilyatsiya xatosi: fallthrough default'dan oldin turishi mumkin emas"
    answer: 2
    explain: "fallthrough keyingi case'ning tanasiga shartni tekshirmasdan o'tadi, shuning uchun A va B bajariladi. B da fallthrough yo'q, default'ga tushmaydi. Xato bo'lmaydi: fallthrough oxirgi clause'dan boshqa har qanday expression switch clause'ining oxirgi statement'i bo'la oladi."
task:
  title: "Range nusxasi, break va label xatolarini tuzatish"
  prompt: |
    Avtopark monitoring platformasi uchun yordamchi funksiyalarda uchta xato bor:

    1. `calibrate` har bir o'qishdan 1.5 daraja ayirishi va `Calibrated` ni `true` qilishi kerak, lekin ro'yxat o'zgarmaydi (range elementni nusxalaydi).
    2. `firstAlarm` birinchi alarm indeksini qaytarishi kerak, lekin `break` faqat `switch`dan chiqadi va funksiya oxirgi alarm indeksini qaytaradi.
    3. `vehiclesWithAlarm` kamida bitta alarm o'qishi bor avtomobillar sonini qaytarishi kerak, lekin alarm o'qishlarining o'zini sanaydi.

    Imzolarni o'zgartirmang. `main` dagi kutilgan chiqish: kalibrlangan ro'yxat (`83.5`, `89.5`, `93.5`, hammasi `true`), keyin `1`, keyin `2`.
  lang: go
  starter: |
    package main

    import "fmt"

    type Reading struct {
        Sensor     string
        Temp       float64
        Calibrated bool
    }

    const alarmTemp = 90.0

    // calibrate har bir o'qishdan 1.5 daraja ayiradi va Calibrated ni true qiladi.
    func calibrate(rs []Reading) {
        for _, r := range rs {
            r.Temp -= 1.5
            r.Calibrated = true
        }
    }

    // firstAlarm birinchi alarm o'qishining indeksini qaytaradi (yo'q bo'lsa -1).
    func firstAlarm(rs []Reading) int {
        idx := -1
        for i, r := range rs {
            switch {
            case r.Temp > alarmTemp:
                idx = i
                break
            }
        }
        return idx
    }

    // vehiclesWithAlarm kamida bitta alarm o'qishi bor avtomobillar sonini qaytaradi.
    func vehiclesWithAlarm(vehicles [][]Reading) int {
        count := 0
        for _, rs := range vehicles {
            for _, r := range rs {
                if r.Temp > alarmTemp {
                    count++
                }
            }
        }
        return count
    }

    func main() {
        rs := []Reading{{"t1", 85, false}, {"t2", 91, false}, {"t3", 95, false}}
        calibrate(rs)
        fmt.Println(rs)
        fmt.Println(firstAlarm([]Reading{{"x1", 70, false}, {"x2", 91, false}, {"x3", 95, false}}))
        fmt.Println(vehiclesWithAlarm([][]Reading{
            {{"a1", 91, false}, {"a2", 99, false}},
            {{"b1", 50, false}},
            {{"c1", 92, false}},
        }))
    }
  solution: |
    package main

    import "fmt"

    type Reading struct {
        Sensor     string
        Temp       float64
        Calibrated bool
    }

    const alarmTemp = 90.0

    // calibrate har bir o'qishdan 1.5 daraja ayiradi va Calibrated ni true qiladi.
    func calibrate(rs []Reading) {
        for i := range rs {
            rs[i].Temp -= 1.5
            rs[i].Calibrated = true
        }
    }

    // firstAlarm birinchi alarm o'qishining indeksini qaytaradi (yo'q bo'lsa -1).
    func firstAlarm(rs []Reading) int {
        idx := -1
    loop:
        for i, r := range rs {
            switch {
            case r.Temp > alarmTemp:
                idx = i
                break loop
            }
        }
        return idx
    }

    // vehiclesWithAlarm kamida bitta alarm o'qishi bor avtomobillar sonini qaytaradi.
    func vehiclesWithAlarm(vehicles [][]Reading) int {
        count := 0
    vehicle:
        for _, rs := range vehicles {
            for _, r := range rs {
                if r.Temp > alarmTemp {
                    count++
                    continue vehicle
                }
            }
        }
        return count
    }

    func main() {
        rs := []Reading{{"t1", 85, false}, {"t2", 91, false}, {"t3", 95, false}}
        calibrate(rs)
        fmt.Println(rs)
        fmt.Println(firstAlarm([]Reading{{"x1", 70, false}, {"x2", 91, false}, {"x3", 95, false}}))
        fmt.Println(vehiclesWithAlarm([][]Reading{
            {{"a1", 91, false}, {"a2", 99, false}},
            {{"b1", 50, false}},
            {{"c1", 92, false}},
        }))
    }
  solutionNotes: |
    - `for _, r := range rs` da `r` har iteratsiyada element nusxasi; unga yozish slice'ga tegmaydi (100 Go Mistakes #30). Indeks bilan `rs[i].Temp` ga yozish yoki `for i := range rs` ishlatiladi.
    - `break` eng ichki `for`, `switch` yoki `select` ni tugatadi. Tashqi tsikl uchun `loop:` label qo'yib, `break loop` yoziladi (alternativ: `return i`, bu eng oddiy yo'l; label esa mexanizmni ko'rsatish uchun tanlandi).
    - `continue vehicle` ichki tsiklni tashlab, tashqi tsiklning keyingi elementiga o'tadi: har avtomobil ko'pi bilan bir marta sanaladi.
    - Label'dan keyin darhol `for` kelishi shart: label faqat uni o'rab turgan `for`/`switch`/`select` uchun `break`/`continue` nishoni bo'ladi.
  checklist:
    - "`calibrate` chaqiruvidan keyin ro'yxat elementlari o'zgargan: Temp 83.5, 89.5, 93.5 va Calibrated true"
    - "`firstAlarm` birinchi alarm indeksini (1) qaytaradi, oxirgisini emas"
    - "`vehiclesWithAlarm` avtomobillarni sanaydi (2), o'qishlarni emas"
    - "Label'li `break`/`continue` yoki aniq `return` ishlatilgan, imzolar o'zgarmagan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Boshqaruv oqimida Go oddiy ko'rinadi: bitta `for` kalit so'zi, `while` yo'q, `switch`da avtomatik `break`. Aynan shu soddalik tuzoq yashiradi. Besh yil Node.js yozgan dasturchi uchun `for (const x of xs)` elementni "beradi", mutatsiya esa obyekt reference'i orqali ishlaydi. Go'da `for _, x := range xs` struct elementini **nusxalaydi**, uni o'zgartirsangiz slice o'zgarmaydi. `switch` ichidagi `break` tsiklni emas, faqat `switch`ni to'xtatadi. Tsikl o'zgaruvchisini closure'ga olib, goroutine'da ishlatgan kod esa Go 1.22 gacha hamma goroutine uchun bir xil qiymat ko'rardi.

Bu xatolar kompilyatsiyadan o'tadi va ko'pincha testda ko'rinmaydi: kichik ma'lumotda natija tasodifan to'g'ri chiqadi. Bu darsda `for` va `switch` semantikasini spetsifikatsiya darajasida, versiyalar farqi bilan ko'rib chiqamiz.

## Asosiy g'oya

### for: uch shakl

Spetsifikatsiya `for` ning uch shaklini beradi: faqat shart (`for a < b`), `ForClause` (init; shart; post) va `range` clause. `for { }` shartsiz shakl `for true { }` bilan teng. `ForClause`da init qismida qisqa e'lon (`i := 0`) bo'lishi mumkin, post qismida esa bo'lmaydi.

### Go 1.22: har iteratsiya o'z o'zgaruvchisiga ega

Spetsifikatsiya [Go 1.22] belgisi bilan aytadi: har iteratsiyada o'zining alohida e'lon qilingan o'zgaruvchi(lar)i bor. Birinchi iteratsiyadagi o'zgaruvchi init qismida e'lon qilinadi, keyingilari esa post statement'dan oldin yashirin e'lon qilinib, oldingi iteratsiya o'zgaruvchisining shu paytdagi qiymati bilan boshlanadi. Spetsifikatsiyadagi misol: `i++` ni tsikl tanasida ham chaqiruvchi tsikl closure'lar orqali `1 3 5` chiqaradi; Go 1.22 dan oldin esa `6 6 6`. Biz bu misolni ikkala rejimda ishga tushirdik (quyida).

`range` clause'ida ham xuddi shunday: `:=` bilan e'lon qilingan o'zgaruvchilarning scope'i `for` bloki, va har iteratsiya yangi o'zgaruvchilarga ega [Go 1.22]. Muhim: bu til versiyasi darajasidagi o'zgarish. Modul `go` qatori bilan belgilangan language version qaysi semantika ishlashini hal qiladi (2-dars), toolchain versiyasi emas.

### range: nima, qanday tartibda

Spetsifikatsiya jadvali:

| Range ifodasi | 1-qiymat | 2-qiymat |
|---|---|---|
| array, array pointer, slice | indeks `int` | `a[i]` elementi |
| string | baytdagi indeks | `rune` (code point) |
| map | kalit | qiymat |
| channel | element | yo'q |
| integer [Go 1.22] | 0 dan n-1 gacha | yo'q |
| function [Go 1.23] | yield argumentlari | yield argumentlari |

Muhim qoidalar:

- **Range ifodasi tsikl boshlanishidan oldin bir marta baholanadi** (istisno: bitta o'zgaruvchi bor va ifoda yoki uning `len`i konstanta bo'lsa, ifoda baholanmaydi).
- Map tartibi aniqlanmagan va har safar farq qilishi mumkin. Iteratsiya paytida o'chirilgan hali yetib kelinmagan yozuv ishlab chiqarilmaydi; yaratilgan yozuv chiqarilishi ham, o'tkazib yuborilishi ham mumkin (14-dars).
- Integer range'da n integer tipda bo'lsa, iteratsiya qiymatlari ham shu tipda. Untyped konstanta uchun tip o'zgaruvchi e'lon qilingan bo'lsa default type, mavjud o'zgaruvchiga yozilsa o'sha tip. `n <= 0` bo'lsa tsikl bajarilmaydi.
- String bo'yicha range code point'lar ustida yuradi; noto'g'ri UTF-8 ketma-ketlikda ikkinchi qiymat `0xFFFD` bo'ladi va indeks bir baytga siljiydi (13-dars).
- `nil` channel bo'yicha range abadiy bloklanadi.
- Funksiya range (Go 1.23) iterator va `yield` orqali ishlaydi (28-dars).

## Chuqurroq: break, label, switch, fallthrough

### break, continue va label

`break` **eng ichki** `for`, `switch` yoki `select` ni tugatadi. `continue` esa eng ichki `for` ning keyingi iteratsiyasiga o'tadi. Label bo'lsa, u o'rab turuvchi `for`, `switch` yoki `select` (continue uchun faqat `for`) bo'lishi shart. Spetsifikatsiya misoli `OuterLoop:` label bilan ichki `switch`dan tashqi tsiklni to'xtatadi. Kimdir `switch` ichida `break` yozib, tsikl to'xtaydi deb o'ylaydi: bu 100 Go Mistakes #34 mavzusi.

`goto` ham bor: u o'sha funksiya ichidagi label'ga o'tadi, lekin o'tish paytida scope'ga yangi o'zgaruvchilar kirmasligi va blok ichiga sakramasligi shart. Kundalik kodda deyarli ishlatilmaydi.

### switch

Expression switch'da case ifodalari konstanta bo'lishi shart emas, chapdan o'ngga va yuqoridan pastga baholanadi; birinchi mos kelgani bajariladi, qolganlari o'tkazib yuboriladi. `default` istalgan joyda turishi mumkin. Switch ifodasi tushirib qoldirilsa, `true` deb olinadi, ya'ni `switch { case x < y: ... }` if-else zanjiri bo'lib ishlaydi. Switch'dan oldin oddiy statement kelishi mumkin (`switch x := f(); { ... }`). Switch ifodasining tipi comparable bo'lishi shart. `nil` switch ifodasi bo'la olmaydi. Implementatsiya cheklovi: kompilyator bir xil konstantali ikkita case'ni taqiqlashi mumkin, va gc shunday qiladi (quyida misol).

`fallthrough` keyingi case'ning birinchi statement'iga o'tadi, shartni tekshirmasdan. U clause'ning oxirgi bo'sh bo'lmagan statement'i bo'lishi shart va oxirgi clause'da kelmaydi. Odatdagidek oqim switch oxiriga tushadi: C dagi kabi avtomatik fallthrough yo'q.

### Tsiklda defer

`defer` funksiya tugaganda ishlaydi, tsikl iteratsiyasi oxirida emas. Tsikl ichida fayl ochib `defer f.Close()` yozsangiz, hamma fayl funksiya oxirigacha ochiq turadi (100 Go Mistakes #35). Yechim: tanani alohida funksiyaga ajratish (7-dars defer'ni batafsil ko'radi, 35-dars resurslarni).

## Misol: closure, range nusxasi va break

### 1. Per-iteration o'zgaruvchi va go.mod

```go
package main

import "fmt"

type Sensor struct {
	ID   string
	Fuel float64
}

func main() {
	sensors := []Sensor{{"fuel-1", 40.5}, {"fuel-2", 12.0}, {"fuel-3", 77.3}}

	var printers []func() string
	var ptrs []*Sensor
	for _, s := range sensors {
		printers = append(printers, func() string { return s.ID })
		ptrs = append(ptrs, &s)
	}
	for _, p := range printers {
		fmt.Print(p(), " ")
	}
	fmt.Println()
	for _, p := range ptrs {
		fmt.Print(p.ID, " ")
	}
	fmt.Println()
	fmt.Println(ptrs[0] == ptrs[1])

	// range elementni nusxalaydi: s ni o'zgartirish slice'ga ta'sir qilmaydi
	for _, s := range sensors {
		s.Fuel = 0
	}
	fmt.Println(sensors[0].Fuel)
	for i := range sensors {
		sensors[i].Fuel = 0
	}
	fmt.Println(sensors[0].Fuel)
}
```

`go.mod`da `go 1.24` bo'lganda (Go 1.24.7, linux/amd64):

```text
fuel-1 fuel-2 fuel-3 
fuel-1 fuel-2 fuel-3 
false
40.5
0
```

Xuddi shu fayl `go 1.21` yozilgan boshqa modulda (toolchain o'sha Go 1.24.7):

```text
fuel-3 fuel-3 fuel-3 
fuel-3 fuel-3 fuel-3 
true
40.5
0
```

Ya'ni toolchain bir xil, natija go qatoriga bog'liq. Eski semantikada `&s` har safar bir xil manzil bo'lib, `ptrs[0] == ptrs[1]` `true` chiqdi. Kodning qolgan qismi range elementi nusxa ekanini ko'rsatadi: `s.Fuel = 0` slice'dagi `40.5` ni o'zgartirmadi, indeks orqali yozish esa o'zgartirdi. Spetsifikatsiyaning `1 3 5` misolini ham ikki rejimda sinadik:

```go
package main

import "fmt"

func main() {
	var prints []func()
	for i := 0; i < 5; i++ {
		prints = append(prints, func() { fmt.Println(i) })
		i++
	}
	for _, p := range prints {
		p()
	}
}
```

`go 1.24` modulda `1 3 5`, `go 1.21` modulda `6 6 6` chiqdi. Go qatorini ko'tarishdan oldin tsikl o'zgaruvchisini closure yoki goroutine ichida ushlagan joylarni ko'rib chiqing, chunki xatti-harakat o'zgaradi (100 Go Mistakes #63).

### 2. Range ifodasi, integer va string

```go
package main

import "fmt"

func main() {
	arr := [3]int{1, 2, 3}
	for i, v := range arr {
		if i == 0 {
			arr[2] = 100
		}
		fmt.Print(v, " ")
	}
	fmt.Println(arr)

	sl := []int{1, 2, 3}
	for i, v := range sl {
		if i == 0 {
			sl[2] = 100
		}
		fmt.Print(v, " ")
	}
	fmt.Println(sl)

	grow := []int{1, 2, 3}
	for i := range grow {
		grow = append(grow, i)
	}
	fmt.Println(len(grow))

	for i := range 3 {
		fmt.Printf("%d:%T ", i, i)
	}
	for i := range uint8(2) {
		fmt.Printf("%d:%T ", i, i)
	}
	fmt.Println()

	ch := make(chan string, 3)
	ch <- "a"
	ch <- "b"
	close(ch)
	for msg := range ch {
		fmt.Print(msg, " ")
	}
	fmt.Println()

	for i, r := range "yo'l\xffz" {
		fmt.Printf("%d:%q ", i, r)
	}
	fmt.Println()
}
```

```text
1 2 3 [1 2 100]
1 2 100 [1 2 100]
6
0:int 1:int 2:int 0:uint8 1:uint8 
a b 
0:'y' 1:'o' 2:'\'' 3:'l' 4:'�' 5:'z' 
```

Massiv uchun `v` uchinchi iteratsiyada `3` (nusxadan), slice uchun `100`. `grow` uchun uzunlik 3 da qotgani sababli 3 iteratsiya bo'ldi, uzunlik 6 ga yetdi. `range 3` va `range uint8(2)` iteratsiya qiymatlarining tipi `int` va `uint8`. Satrda `\xff` noto'g'ri bayt `U+FFFD` bo'ldi va indeks bir baytga siljidi (4 va 5).

### 3. break, label va fallthrough

```go
package main

import "fmt"

func classify(readings []int) {
	for _, r := range readings {
		switch {
		case r < 0:
			fmt.Println("xato qiymat, tsikl to'xtamaydi:", r)
			break // faqat switch'dan chiqadi
		case r > 100:
			fmt.Println("limitdan oshdi:", r)
		}
	}
}

func classifyLabeled(readings []int) {
loop:
	for _, r := range readings {
		switch {
		case r < 0:
			fmt.Println("xato qiymat, tsikl to'xtadi:", r)
			break loop
		case r > 100:
			fmt.Println("limitdan oshdi:", r)
		}
	}
}

func grade(n int) string {
	switch {
	case n >= 90:
		return "A"
	case n >= 50:
		return "B"
	}
	return "C"
}

func main() {
	data := []int{10, -1, 150}
	classify(data)
	classifyLabeled(data)

	switch x := 2; x {
	case 1, 2:
		fmt.Println("bir yoki ikki")
		fallthrough
	case 3:
		fmt.Println("fallthrough: uch ham bajarildi")
	case 4:
		fmt.Println("to'rt")
	default:
		fmt.Println("default")
	}
	fmt.Println(grade(95), grade(60), grade(10))
}
```

```text
xato qiymat, tsikl to'xtamaydi: -1
limitdan oshdi: 150
xato qiymat, tsikl to'xtadi: -1
bir yoki ikki
fallthrough: uch ham bajarildi
A B C
```

Birinchi funksiya `-1` ni topgach tsiklni to'xtatmadi va `150` ni ham ko'rdi. Label'li variantda `break loop` tsiklni to'xtatdi. `grade` funksiyasida shart bo'sh `switch` if-else zanjiri o'rnini bosadi. Va dublikat konstantali case:

```text
duplicate case 1 (constant of type int) in expression switch
```

(`switch x { case 1: case 2, 1: }` uchun `go vet` chiqishi.)

## Qachon qo'llamaslik kerak

- Label va `goto` oddiy `if`/`return`dan o'qilishi qiyin. Faqat ichma-ich tsikldan chiqish kerak bo'lganda va tanani funksiyaga ajratish yomonroq bo'lganda ishlating; ko'p hollarda `return` yoki yordamchi funksiya aniqroq.
- `fallthrough`ni deyarli ishlatmang. Bir nechta qiymat bitta tanani bo'lishsa, `case 1, 2, 3:` yozing. `fallthrough` shartsiz o'tishni yashirin qiladi va o'qishni qiyinlashtiradi (bu muallifning tajribaviy bahosi).
- Per-iteration semantikasiga tayanib go qatorini bilmaslik xavfli: eski moduldan olingan nusxa kodni yangi servisga ko'chirsangiz xatti-harakat o'zgaradi. Go 1.22 dan keyingi modulda `s := s` kabi nusxa olish keraksiz bo'lib qolgan, lekin zarar qilmaydi.
- Range'da katta struct elementlarini qiymat bilan olish nusxa xarajatiga ega: struct yirik bo'lsa indeks yoki pointer slice ishlating, lekin avval o'lchang (61-dars). Kichik elementlarda nusxa arzon.
- `for i := range n` ni tsiklda `n` o'zgarishini kutib yozmang: ifoda bir marta baholanadi. Dinamik shart kerak bo'lsa `for cond` shakli.
- Bu darsda `goto` va `select` ichidagi `break`ni sinab ko'rmadik; ular haqidagi gaplar spetsifikatsiyaga tayanadi.

## Stack'da: Node.js/TypeScript bilan solishtirish

- `for (const x of xs)` ichidagi `x` JavaScript'da har iteratsiyada yangi `const` binding, shuning uchun closure muammosi `let` bilan `for(;;)`da ham hal qilingan (ES6 per-iteration binding). Go 1.22 shu yo'lga keldi. Eski Go kodini o'qiyotganda `x := x` qatorini ko'rsangiz, sababi shu.
- JS'da `forEach` ichida `return` faqat callback'dan chiqadi, Go'da `return` funksiyadan chiqadi, `break` esa faqat eng ichki konstruksiyadan. `switch` ichidagi `break` JS'dan farqli ravishda ko'pincha ortiqcha, chunki avtomatik `break` bor.
- Node.js'da `for await` oqimni o'qiydi; Go'da channel bo'yicha `for v := range ch` shuni qiladi va channel yopilguncha bloklanadi (42-dars).
- Struct elementlari bilan ishlaganda JS obyekti reference bo'lgani uchun `for (const s of sensors) s.fuel = 0` massivni o'zgartiradi. Go'da bunday yozuv jimgina hech narsa qilmaydi: bu eng ko'p uchraydigan o'tish xatolaridan biri.

## Xulosa

- Per-iteration o'zgaruvchilar (Go 1.22) go.mod'dagi language version bilan boshqariladi, toolchain versiyasi bilan emas; eski modulda closure va `&v` bitta o'zgaruvchini ushlab turadi.
- `range` ifodasi tsikldan oldin bir marta baholanadi; massiv nusxalanadi, slice header nusxalanadi, elementlar esa har iteratsiyada nusxa.
- Range qiymat o'zgaruvchisiga yozish slice'ni o'zgartirmaydi: indeks orqali yoki pointer elementlar bilan yozing.
- `break` eng ichki `for`/`switch`/`select`ni to'xtatadi; tashqi tsikl uchun label yoki `return`.
- `switch`da avtomatik `break` bor, `fallthrough` shartni tekshirmay keyingi tanaga o'tadi; shartsiz `switch` if-else zanjiri.
- `range n` (Go 1.22) iteratsiya tipini `n` dan oladi; funksiya range (Go 1.23) iterator'lar uchun.
