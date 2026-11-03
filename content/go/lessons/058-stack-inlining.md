---
n: 58
slug: stack-inlining
title: "Stack o'sishi, inlining va compiler optimizatsiyalari"
summary: "Goroutine stack'i 2 KiB dan qanday o'sadi va kichrayadi, cheksiz rekursiya nega fatal xato beradi, compiler qaysi funksiyalarni inline qiladi va -gcflags=-m chiqishini qanday o'qish kerak, Go 1.25 va 1.26 da slice backing store'ning stack'ga tushishi nima o'zgartiradi."
duration: 40
sources:
  - id: runtime-hacking
    note: "Stacks bo'limi: user stack kichik boshlanadi va dinamik o'sadi/kichrayadi; system stack (g0) o'smaydi; nosplit funksiyalar va morestack prologi"
  - id: diagnostics
    note: "Profiling bo'limi: pprof profil turlari (CPU, heap, goroutine); dars shu vositalar bilan stack va inlining ta'sirini topishni tavsiya qiladi"
  - id: go125
    note: "Compiler bo'limi, Faster slices: slice backing store stack'ga ko'proq holatlarda, noto'g'ri unsafe.Pointer ta'siri kuchayishi mumkinligi haqida ogohlantirish, bisect -compile=variablemake va -gcflags=all=-d=variablemakehash=n (birinchi marta shu yerda)"
  - id: go126
    note: "Compiler bo'limi: slice backing store'ni stack'ga joylashtirish ko'proq holatlarda; muammo bo'lsa bisect -compile=variablemake va -gcflags=all=-d=variablemakehash=n"
quiz:
  - q: "`go build -gcflags=-m=2` quyidagini chiqardi: `can inline clamp with cost 14` va `cannot inline summarize: function too complex: cost 161 exceeds budget 80`. Bundan nima kelib chiqadi?"
    options:
      - "`summarize` ni inline qilish uchun GOGC ni oshirish kerak"
      - "`clamp` chaqiruvlari chaqiruvchiga ko'chiriladi (chaqiruv narxi yo'qoladi), `summarize` esa har doim oddiy chaqiruv bo'lib qoladi, chunki narxi 80 byudjetdan katta"
      - "`summarize` ni `//go:inline` bilan majburlash mumkin"
      - "Narx 80 dan kichik bo'lgan funksiyalar doim inline qilinadi, istisnosiz"
    answer: 1
    explain: "Go 1.24.7 inl.go: asosiy byudjet 80. `go:inline` direktivasi yo'q (faqat `go:noinline` bor). Narxi byudjetdan kichik funksiya inline'ga nomzod, lekin qaror boshqa shartlarga ham bog'liq (masalan, 'big function' ichida chegara 20 gacha tushadi), shuning uchun 'istisnosiz' noto'g'ri."
  - q: "Servisda `depth(n *Node)` rekursiyasi sikl hosil qiluvchi kiritishda cheksiz chaqiriladi. Natija?"
    options:
      - "`recover()` panic'ni ushlaydi va servis ishlashda davom etadi"
      - "Faqat shu goroutine to'xtaydi, boshqalari ishlayveradi"
      - "Stack 1 GB gacha o'sadi, so'ng dastur bir necha soniya muzlab, keyin tiklanadi"
      - "Stack limitdan oshganda runtime `fatal error: stack overflow` bilan butun jarayonni to'xtatadi: bu panic emas, recover ushlamaydi"
    answer: 3
    explain: "stack.go: newsize limitdan oshsa 'goroutine stack exceeds ... limit' chop etiladi va `throw(\"stack overflow\")` chaqiriladi. throw qaytarib bo'lmaydigan xato, butun jarayon tugaydi (darsdagi tajribada chiqish kodi 2). Limit `debug.SetMaxStack` bilan o'zgartiriladi, standart 1 GB (64-bit)."
  - q: "10000 ta goroutine `<-stop` da bloklangan. Go 1.24.7 da ularning stack xotirasi qancha qo'shiladi?"
    options:
      - "20000 KiB atrofida: har goroutine boshlang'ich 2048 baytli stack oladi (darsdagi o'lchov)"
      - "80000 KiB: har goroutine 8 KiB oladi"
      - "Hech narsa: bloklangan goroutine'lar stack'siz saqlanadi"
      - "10000 KiB: har biriga 1 KiB"
    answer: 0
    explain: "O'lchov: +20000 KiB, ya'ni goroutine boshiga aniq 2048 bayt; `/gc/stack/starting-size:bytes` ham 2048. HACKING.md: user stack kichik (masalan 2K) boshlanadi. Bloklangan goroutine'ning stack'i saqlanadi, chunki uning chaqiruv zanjiri qayta tiklanishi kerak."
  - q: "`buf := make([]float64, n)` (n parametr) Go 1.24.7 da funksiya ichida faqat ishlatiladi. `-gcflags=-m=2` nima deydi va nima uchun?"
    options:
      - "Stack'da qoladi, chunki buf funksiyadan chiqmaydi"
      - "Heap'ga qochmaydi, chunki n kichik"
      - "`escapes to heap`: o'lchami (non-constant size) kompilyatsiya vaqtida noma'lum, shuning uchun backing store heap'dan ajratiladi"
      - "Xato beradi: o'zgaruvchan o'lchamli make taqiqlangan"
    answer: 2
    explain: "Darsdagi chiqish: `make([]float64, n) escapes to heap ... (non-constant size)`. Shu sababli n=32 da ham AllocsPerRun 1 chiqdi. Doimiy o'lchamli massivga o'tish (`var small [64]float64; small[:n]`) ajratishni yo'qotdi. Go 1.25 va 1.26 da compiler ko'proq holatlarda stack'ni ishlatadi, shuning uchun yangi versiyada natija boshqacha bo'lishi mumkin."
  - q: "Go 1.25 release notes compiler'ning slice backing store'ni stack'ga ko'proq joylashtirishi haqida qanday ogohlantiradi?"
    options:
      - "Hech qanday ogohlantirish yo'q, optimizatsiya xavfsiz"
      - "Noto'g'ri `unsafe.Pointer` ishlatilgan kodda xatolar kuchayishi mumkin; muammoni `bisect -compile=variablemake` bilan topish va `-gcflags=all=-d=variablemakehash=n` bilan o'chirish mumkin"
      - "Barcha slice'lar endi stack'da, heap ajratishlar yo'q"
      - "Faqat 32-bit platformalarda ishlaydi"
    answer: 1
    explain: "go125 notes (Faster slices): o'zgarish noto'g'ri unsafe.Pointer ishlatish ta'sirini kuchaytirishi mumkin; bisect va variablemakehash=n bayrog'i keltirilgan. go126 notes ham xuddi shu bayroqlarni eslatadi. Bu bayroqlarni biz lokal sinay olmadik (Go 1.24.7 da ularning ta'siri yo'q), shuning uchun manba da'vosi sifatida qabul qiling."
  - q: "Goroutine chuqur rekursiyadan keyin tinch holatga o'tdi va tirik qoldi (stack 16 MiB gacha o'sgan edi). GC bilan nima bo'lishi kutiladi?"
    options:
      - "Stack hech qachon kichraymaydi"
      - "Stack darhol 2 KiB gacha tushadi"
      - "Stack faqat goroutine tugaganda bo'shatiladi, GC bilan bog'liq emas"
      - "GC paytida goroutine stack'ining chorak qismidan kamini ishlatayotgan bo'lsa, stack yarmiga kichraytiriladi (takroriy sikllarda yana)"
    answer: 3
    explain: "stack.go shrinkstack: yangi o'lcham eski o'lchamning yarmi, va u faqat ishlatilayotgan qism joriy hajmning to'rtdan biridan kam bo'lsa bajariladi; minimaldan kichik bo'lmaydi. Darsdagi tajribada GC dan keyin stack xotirasi 17056 KiB dan 4672 KiB gacha tushdi (bu son boshqa bo'shagan stack'larni ham o'z ichiga olishi mumkin, shuning uchun u faqat yo'nalishni ko'rsatadi)."
task:
  title: "O'zgaruvchan o'lchamli buferdan heap ajratishni olib tashlash"
  prompt: |
    Telemetriya servisi har paketda `avgFuel(n)` ni chaqiradi. Funksiya vaqtinchalik `[]float64` buferiga o'qishlarni yozadi va o'rtachani hisoblaydi. Bufer faqat funksiya ichida ishlatiladi.

    Go 1.24.7 da `make([]float64, n)` n o'zgaruvchan bo'lgani uchun har chaqiruvda heap'dan ajratadi (`-gcflags=-m=2` buni `non-constant size` deb ko'rsatadi). Boshlang'ich kod n=32 uchun ham 1 ajratish beradi.

    `avgFuel` ni qayta yozing: n 64 yoki undan kichik bo'lsa bufer stack'dagi doimiy o'lchamli massivdan olinsin (ajratish 0), kattaroq n uchun esa avvalgidek `make`. Natija va imzo o'zgarmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "testing"
    )

    // avgFuel n ta datchik ko'rsatkichidan o'rtacha yoqilg'i darajasini hisoblaydi.
    // Ko'rsatkichlar vaqtinchalik buferga yoziladi va faqat shu funksiyada ishlatiladi.
    func avgFuel(n int) float64 {
        if n <= 0 {
            return 0
        }
        buf := make([]float64, n)
        for i := range buf {
            buf[i] = float64(100 - i%7)
        }
        var sum float64
        for _, v := range buf {
            sum += v
        }
        return sum / float64(n)
    }

    var sink float64

    func main() {
        small := testing.AllocsPerRun(100, func() { sink = avgFuel(32) })
        large := testing.AllocsPerRun(100, func() { sink = avgFuel(1000) })
        fmt.Println("n=32 ajratishlar:", small)
        fmt.Println("n=1000 ajratishlar:", large)
        fmt.Println("kichik n da ajratish yo'q:", small == 0)
        fmt.Println("katta n da bitta ajratish:", large == 1)
        fmt.Println("natija:", avgFuel(32) == avgFuel(32) && avgFuel(7) > 96 && avgFuel(0) == 0)
    }
  solution: |
    package main

    import (
        "fmt"
        "testing"
    )

    // avgFuel n ta datchik ko'rsatkichidan o'rtacha yoqilg'i darajasini hisoblaydi.
    // Ko'rsatkichlar vaqtinchalik buferga yoziladi va faqat shu funksiyada ishlatiladi.
    func avgFuel(n int) float64 {
        if n <= 0 {
            return 0
        }
        // Kichik n uchun bufer stack'dagi massivda; katta n uchun heap'dan.
        var small [64]float64
        var buf []float64
        if n <= len(small) {
            buf = small[:n]
        } else {
            buf = make([]float64, n)
        }
        for i := range buf {
            buf[i] = float64(100 - i%7)
        }
        var sum float64
        for _, v := range buf {
            sum += v
        }
        return sum / float64(n)
    }

    var sink float64

    func main() {
        small := testing.AllocsPerRun(100, func() { sink = avgFuel(32) })
        large := testing.AllocsPerRun(100, func() { sink = avgFuel(1000) })
        fmt.Println("n=32 ajratishlar:", small)
        fmt.Println("n=1000 ajratishlar:", large)
        fmt.Println("kichik n da ajratish yo'q:", small == 0)
        fmt.Println("katta n da bitta ajratish:", large == 1)
        fmt.Println("natija:", avgFuel(32) == avgFuel(32) && avgFuel(7) > 96 && avgFuel(0) == 0)
    }
  solutionNotes: |
    - `var small [64]float64` o'lchami doimiy, shuning uchun u stack'da. `small[:n]` shu massivning kesimi bo'lib, funksiyadan tashqariga chiqmasa heap'ga qochmaydi.
    - n > 64 bo'lganda `make` qoladi: Go 1.24.7 da bu 1 ajratish. Katta o'lcham uchun stack buferini kattalashtirish stack ramkasini oshiradi va stack o'sishini tezlashtiradi.
    - 64 chegarasi muallifning tanlovi (512 bayt). Stack ramkasi hajmi va stack o'sishi trade-off'dir: o'lchang, taxmin qilmang.
    - Go 1.25 va 1.26 da compiler slice backing store'ni stack'ga ko'proq holatlarda joylashtiradi (go125, go126 notes). Starter yangi versiyada boshqa natija berishi mumkin; biz buni tekshira olmadik.
    - Kutilgan chiqish (Go 1.24.7): `n=32 ajratishlar: 0`, `n=1000 ajratishlar: 1`, keyin uchta `true`.
  checklist:
    - "n=32 uchun `testing.AllocsPerRun` 0"
    - "n=1000 uchun `testing.AllocsPerRun` 1 (katta n uchun `make` saqlangan)"
    - "n <= 0 uchun 0 qaytadi, natija o'zgarmagan"
    - "Imzo `avgFuel(n int) float64` o'zgarmagan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Go'da "bir million goroutine" gapi og'zaki ibora emas, shu dizaynning natijasi. Linux'da oddiy thread'ga odatda megabayt tartibida stack ajratiladi; Go goroutine'i esa kichik stack bilan boshlanadi va kerak bo'lganda o'sadi. Shu mexanizm production'da uch xil ko'rinadi.

Birinchisi, xotira. Ko'p goroutine bloklangan servis (WebSocket ulanishlari, uzoq polling) stack'lar uchun sezilarli xotira ushlaydi. Ikkinchisi, kechikish: chuqur rekursiya yoki katta lokal massivlar stack'ni qayta-qayta o'stiradi, har o'sish stack nusxalanishini bildiradi. Uchinchisi, halokat: nazoratsiz rekursiya (masalan, sikl hosil qilgan grafni yurish) `fatal error: stack overflow` beradi, uni `recover` ushlay olmaydi.

Bunga yaqin ikkinchi mavzu compiler optimizatsiyalari: inlining va stack'ga joylashtirish (escape analysis natijasi). Ular ilova kodini o'zgartirmaydi, lekin chaqiruvlar narxini va heap ajratishlar sonini belgilaydi; `-gcflags=-m` chiqishini o'qiy olmasangiz, "nega bu funksiya sekin" savoliga javob topolmaysiz.

Bu darsdagi lokal o'lchovlar Go 1.24.7 da (linux/amd64, 2 vCPU) bajarildi. Compiler va runtime konstantalari (stack minimumi, inline byudjeti) implementatsiya tafsilotlari: ularni Go 1.24.7 manba kodidan tekshirdik, lekin ilova kodi ularga tayanmasligi kerak. Go 1.25 va 1.26 dagi compiler o'zgarishlari faqat release notes'ga tayanadi va lokal kompilyatsiya qilinmagan.

## Asosiy g'oya

### Goroutine stack'i: kichik boshlanadi, dinamik o'zgaradi

runtime HACKING.md hujjati user stack haqida aniq gapiradi: har tirik G'ning o'z user stack'i bor, u kichik (masalan, 2K) boshlanadi va dinamik o'sadi yoki kichrayadi. Go 1.24.7 manba kodida `stackMin = 2048`, va `runtime/metrics` dagi `/gc/stack/starting-size:bytes` metrikasi yangi goroutine stack hajmini beradi (bizning mashinada 2048).

Boshqa tomondan, har M'ning system stack'i (g0) va signal stack'i bor. HACKING.md ularni o'smaydigan, lekin runtime kodi uchun yetarli katta stack'lar deb ta'riflaydi; runtime vaqtinchalik system stack'ka o'tadi, qachonki ish to'xtatib bo'lmaydigan yoki user stack'ni o'stirib bo'lmaydigan bo'lsa (51-dars). GC system stack'larni skanerlamaydi.

### O'sish mexanizmi

Ko'pchilik funksiya prologida stack pointer'ni joriy G'ning stack chegarasi bilan solishtiradi va joy yetmasa `morestack` ni chaqiradi (HACKING.md). Go 1.24.7 manba kodida (`stack.go`) `newstack` yangi hajmni eskisining ikki baravari qilib oladi (`newsize := oldsize * 2`), yangi ramka sig'maguncha yana ikkilantiradi, yangi stack ajratadi va eski stack mazmunini unga ko'chiradi (copystack). Ko'chirish paytida stack ichidagi ko'rsatkichlar yangi manzillarga tuzatiladi. Shu sababli Go'da ko'rsatkich qiymatini faqat `unsafe` orqali manzil sifatida saqlab bo'lmaydi: stack'dagi manzillar o'zgarishi mumkin.

Stack hajmi cheklangan: `debug.SetMaxStack` hujjati bu limitni bitta goroutine stack'i uchun xotira chegarasi deb ataydi, standarti 64-bit tizimda 1 GB, 32-bit tizimda 250 MB. Limitdan oshganda dastur halokatga uchraydi. Funksiya asosan cheksiz rekursiyaning zararini cheklash uchun foydali deb tavsiflanadi.

### Kichrayish

Tirik goroutine'ning katta stack'i abadiy qolmaydi. `shrinkstack` (stack.go) GC paytida yangi hajmni joriy hajmning yarmi qilib belgilaydi, lekin faqat goroutine stack'ining to'rtdan biridan kamini ishlatayotgan bo'lsa, va minimal hajmdan pastga tushmaydi. Hammasi qadam-baqadam: 16 MiB stack to'g'ridan-to'g'ri 2 KiB ga emas, yarmiga, har GC siklida (agar yetarlicha bo'sh bo'lsa).

### Inlining: byudjet bilan

Inlining funksiya chaqiruvini uning tanasi bilan almashtirish. Chaqiruv narxi (argumentlarni uzatish, stack tekshiruvi, qaytish) yo'qoladi, va muhimi, compiler endi tana ichini chaqiruvchi kontekstida optimallashtira oladi (konstantalarni ko'chirish, ortiqcha tekshiruvlarni olib tashlash, hatto heap ajratishni stack'ka tushirish). Compiler har funksiyaga "narx" beradi va uni byudjetga solishtiradi. Go 1.24.7 `inl.go` da asosiy byudjet `inlineMaxBudget = 80`. Chaqiruvlar qimmat: boshqa funksiyani chaqirish narxga 57 qo'shadi. "Katta" funksiya (5000 tugundan ortiq) ichiga faqat narxi 20 gacha bo'lgan funksiyalar inline qilinadi. PGO (profilga asoslangan optimizatsiya) bilan issiq chaqiruv nuqtalari uchun byudjet 2000 gacha ko'tariladi (`inlineHotMaxBudget`). Bu konstantalar versiyadan versiyaga o'zgargan va o'zgaradi: hujjatlashtirilgan kafolat emas.

## Chuqurroq: nega bu muhim

### Inlining va escape analysis bog'liq

Funksiya inline qilinsa, compiler chaqiruvchi ichida qiymat funksiya chegarasidan chiqmasligini ko'ra oladi, va ba'zan ajratishni heap'dan stack'ka tushiradi. Teskarisi ham to'g'ri: funksiya inline qilinmasa, ichida yaratilgan va qaytarilgan qiymat heap'ga qochadi. Shuning uchun kichik yordamchi funksiyalar (konstruktorlar, getter'lar, `clamp` kabilar) tez-tez chaqiriladigan joyda foyda beradi, katta funksiyalar esa baribir chaqiruv bo'lib qoladi va bu normal: chaqiruv narxi ish hajmiga nisbatan kichik.

### Go 1.25 va 1.26: slice backing store stack'ga ko'proq tushadi

Go 1.25 release notes ("Faster slices") compiler slice backing store'ni stack'da ko'proq holatlarda ajratadigan bo'lganini yozadi va muhim ogohlantirish beradi: bu o'zgarish noto'g'ri `unsafe.Pointer` ishlatish ta'sirini kuchaytirishi mumkin. Muammoli ajratishni `bisect` vositasi `-compile=variablemake` bayrog'i bilan topadi, hamma shunday yangi stack ajratishlarni `-gcflags=all=-d=variablemakehash=n` o'chiradi. Go 1.26 notes yana shunday kengaytirishni e'lon qiladi va xuddi shu ikki bayroqni eslatadi, muammo bo'lsa issue ochishni so'raydi. Bu bayroqlar nomi bilan sizning loyihangizga ta'sir qilishi uchun Go 1.25+ kerak: Go 1.24.7 da biz ularni sinay olmadik, shuning uchun bu bo'lim faqat notes'ga tayanadi.

Amaliy ma'no: agar siz o'zgaruvchan o'lchamli `make` ni heap ajratishi deb bilgan bo'lsangiz va shunga qarab `AllocsPerRun` testlarini yozgan bo'lsangiz, yangi versiyada ular boshqa natija berishi mumkin. Bu yaxshilanish, lekin testlaringizni versiya bo'yicha qayta ko'ring.

## Misol: inlining, stack o'sishi va halokat

### 1. Inlining qarorlarini o'qish

Kichik dastur: ikkita kichik funksiya, bitta katta, bittasi `//go:noinline` bilan belgilangan.

```go
package main

import "fmt"

// Fix - yoqilg'i datchigi o'qishi.
type Fix struct {
	Lat, Lon float64
	Fuel     int
}

// litres kichik funksiya: inline qilinadi.
func litres(f Fix) float64 { return float64(f.Fuel) / 10 }

// clamp ham kichik.
func clamp(v, lo, hi float64) float64 {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}

// summarize katta: narxi inline byudjetidan oshadi.
func summarize(fs []Fix) (total float64, bad int) {
	for _, f := range fs {
		l := litres(f)
		if l < 0 {
			bad++
			continue
		}
		total += clamp(l, 0, 500)
		switch {
		case f.Lat > 90, f.Lat < -90:
			bad++
		case f.Lon > 180, f.Lon < -180:
			bad++
		}
		if f.Fuel == 0 {
			fmt.Println("nol yoqilg'i:", f)
		}
	}
	return total, bad
}

//go:noinline
func blocked(f Fix) float64 { return litres(f) }

func main() {
	fs := []Fix{{41.3, 69.2, 120}, {41.4, 69.3, 0}}
	t, b := summarize(fs)
	fmt.Println(t, b, blocked(fs[0]))
}
```

`go build -gcflags='-m=2'` chiqishidan inlining qatorlari (Go 1.24.7):

```text
main.go:12:6: can inline litres with cost 6 as: func(Fix) float64 { return float64(f.Fuel) / 10 }
main.go:15:6: can inline clamp with cost 14 as: func(float64, float64, float64) float64 { ... }
main.go:26:6: cannot inline summarize: function too complex: cost 161 exceeds budget 80
main.go:48:6: cannot inline blocked: marked go:noinline
main.go:50:6: cannot inline main: function too complex: cost 230 exceeds budget 80
```

`-gcflags=-m` (bitta `m`) esa chaqiruv nuqtalarini ko'rsatadi: `inlining call to litres` (28-qator) va `inlining call to clamp` (33-qator) `summarize` ichida, va `inlining call to litres` (48-qator) `blocked` ichida. Ikkinchi holat qiziq: `blocked` o'zi inline qilinmaydi (`noinline`), lekin ichidagi `litres` baribir inline qilinadi. `summarize` narxi 161: sikl, `switch`, `fmt.Println` chaqiruvi unga qo'shiladi (chaqiruv narxi 57 va boshqalar). Uni inline qilishni istasangiz, uni bo'lish kerak, lekin avval buning kerak ekanini profil bilan isbotlang (62-dars).

### 2. Stack xotirasi va o'sishi

Dastur ikki narsani o'lchaydi: 10000 ta bloklangan goroutine stack xotirasini, va bitta goroutine'ning 100000 darajali rekursiyasi uni qanchaga o'stirishini. O'lchov `/memory/classes/heap/stacks:bytes` metrikasi orqali. `deep` har kadamda 12 ta int (96 bayt) lokal massiv ushlaydi va `//go:noinline` bilan inline qilinmaydi.

```go
package main

import (
	"fmt"
	"runtime"
	"runtime/metrics"
	"sync"
)

func stacks() (inuse uint64, start uint64) {
	s := []metrics.Sample{
		{Name: "/memory/classes/heap/stacks:bytes"},
		{Name: "/gc/stack/starting-size:bytes"},
	}
	metrics.Read(s)
	return s[0].Value.Uint64(), s[1].Value.Uint64()
}

// deep rekursiya: har kadam ~128 baytlik ramka ushlaydi.
//
//go:noinline
func deep(n int) int {
	var pad [12]int
	pad[n%12] = n
	if n == 0 {
		return pad[0]
	}
	return deep(n-1) + pad[n%12]
}

func main() {
	base, start := stacks()
	fmt.Println("yangi goroutine stack boshlang'ich hajmi:", start, "bayt; dastur boshidagi stack xotirasi:", base>>10, "KiB")

	// 1) 10000 ta goroutine kutib turadi: har biri boshlang'ich stack bilan.
	var wg sync.WaitGroup
	stop := make(chan struct{})
	for i := 0; i < 10000; i++ {
		wg.Add(1)
		go func() { defer wg.Done(); <-stop }()
	}
	runtime.Gosched()
	s1, _ := stacks()
	fmt.Printf("10000 ta kutayotgan goroutine: stack xotirasi +%d KiB (bittasiga %d bayt)\n", (s1-base)>>10, (s1-base)/10000)
	close(stop)
	wg.Wait()
	runtime.GC() // chiqib ketgan goroutine stack'lari GC oxirida bo'shatiladi
	runtime.GC()

	// 2) Bitta goroutine chuqur rekursiya qiladi va tugaguncha stack kattalashadi.
	done := make(chan struct{})
	release := make(chan struct{})
	go func() {
		before, _ := stacks()
		deep(100000)
		after, _ := stacks()
		fmt.Printf("chuqur rekursiya (100000 kadam): stack xotirasi +%d KiB\n", (after-before)>>10)
		close(done)
		<-release
	}()
	<-done
	mid, _ := stacks()
	runtime.GC() // GC paytida bo'sh qolgan stack kichraytiriladi
	runtime.GC()
	end, _ := stacks()
	fmt.Printf("GC dan keyin (goroutine tirik, rekursiya tugagan): stack xotirasi %d KiB dan %d KiB gacha\n", mid>>10, end>>10)
	close(release)
}
```

Natija (Go 1.24.7, linux/amd64, 2 vCPU; ikki ishga tushirish deyarli bir xil, birinchisi):

```text
yangi goroutine stack boshlang'ich hajmi: 2048 bayt; dastur boshidagi stack xotirasi: 256 KiB
10000 ta kutayotgan goroutine: stack xotirasi +20000 KiB (bittasiga 2048 bayt)
chuqur rekursiya (100000 kadam): stack xotirasi +16448 KiB
GC dan keyin (goroutine tirik, rekursiya tugagan): stack xotirasi 17056 KiB dan 4672 KiB gacha
```

10000 goroutine aniq 2048 baytdan oldi: metrikada ko'ringan boshlang'ich hajm bilan mos. Bitta goroutine rekursiya vaqtida +16448 KiB (16 MiB va yana 64 KiB) oldi: o'sish ikkilantirish bilan bo'lgani uchun stack hajmi ikkining darajasi bo'ladi (kerak bo'lgan ~12 MiB uchun 16 MiB), eski kichik stack'lar esa ko'chirilgach bo'shatiladi. Rekursiya tugagach, goroutine tirik tursa ham, GC dan keyin stack xotirasi 17056 KiB dan 4672 KiB ga tushdi. Bu qiymat dastur boshidagi 256 KiB ga yetmadi; qolgan farqning sababini (boshqa bo'shagan stack'lar, GC siklida hali qaytarilmagan span'lar yoki to'liq kichrayish bo'lmagani) tekshirmadik, shuning uchun bu son kichrayish yo'nalishini ko'rsatadi, uning aniq miqdorini emas.

### 3. Cheksiz rekursiya

Daraxt tuguni o'ziga ishora qiluvchi sikl hosil qilgan bo'lsa, `depth` hech qachon tugamaydi. Demo uchun limit `debug.SetMaxStack(16 << 20)` bilan 16 MiB ga tushirilgan (standart 1 GB: xuddi shu xato, faqat uzoqroq kutiladi va ko'p xotira ishlatadi).

```go
package main

import (
	"fmt"
	"runtime/debug"
)

// Node daraxt tuguni; chuqurligi nazoratsiz bo'lgan kirish uchun rekursiya.
type Node struct {
	Children []*Node
}

func depth(n *Node) int {
	if n == nil {
		return 0
	}
	max := 0
	for _, c := range n.Children {
		if d := depth(c); d > max {
			max = d
		}
	}
	return max + 1
}

func main() {
	debug.SetMaxStack(16 << 20) // demo uchun 16 MiB; default 1 GB
	self := &Node{}
	self.Children = []*Node{self} // sikl: rekursiya tugamaydi
	fmt.Println("boshladik")
	fmt.Println(depth(self))
}
```

Natija (birinchi qatorlar, Go 1.24.7, chiqish kodi 2):

```text
boshladik
runtime: goroutine stack exceeds 16777216-byte limit
runtime: sp=0xc0010e0380 stack=[0xc0010e0000, 0xc0020e0000]
fatal error: stack overflow

runtime stack:
runtime.throw({0x4b54e0?, 0x200000008?})
	/usr/local/go1.24.7/src/runtime/panic.go:1101 +0x48 fp=0x7fff85c68bd0 sp=0x7fff85c68ba0 pc=0x467908
runtime.newstack()
	/usr/local/go1.24.7/src/runtime/stack.go:1107 +0x5bb fp=0x7fff85c68d08 sp=0x7fff85c68bd0 pc=0x45021b
runtime.morestack()
	/usr/local/go1.24.7/src/runtime/asm_amd64.s:621 +0x7a fp=0x7fff85c68d10 sp=0x7fff85c68d08 pc=0x46beba

goroutine 1 gp=0xc000002380 m=3 mp=0xc000061008 [running]:
main.depth(0xc00011e000?)
	main.go:13 +0x7f fp=0xc001160390 sp=0xc001160...
main.depth(0x0?)
	main.go:19 +0x45 fp=0xc0011603c8 sp=0xc001160...
```

Bu `panic` emas: `recover` hech narsani ushlamaydi, butun jarayon tugaydi, boshqa goroutine'lar ham. Chiqish: oldin stack chegarasi va manzillari (`stack=[lo, hi]` oralig'i aynan 16 MiB), keyin `runtime stack` (runtime nima ish qilgani) va nihoyat sizning goroutine'ingiz stack'i: takrorlanuvchi `main.depth` ramkalari rekursiyaning o'zi ekanini ko'rsatadi. Ketma-ket ramkalarning `fp` manzillari 0x38 (56 bayt) ga farq qiladi: shu o'lchamdagi ramka bilan 16 MiB limit yuz minglab chaqiruvga yetadi. Halokat tahlili haqida to'liq gap 60-darsda.

### Topshiriq: o'zgaruvchan `make` dan qutulish

`avgFuel(n)` o'zgaruvchan o'lchamli `make` ishlatgani uchun Go 1.24.7 da `-gcflags=-m=2` quyidagini chiqaradi:

```text
main.go:14:13: make([]float64, n) escapes to heap:
main.go:14:13:     from make([]float64, n) (non-constant size) at main.go:14:13
```

Yechim doimiy o'lchamli massivdan kesim olish (topshiriqda). Ikki yo'lning narxi: massiv har chaqiruvda stack ramkasini 512 baytga kattalashtiradi (n kichik bo'lsa ham), `make` esa har chaqiruvda ajratish va keyinroq GC ishi. Qaysi biri yaxshi ekani chaqiruvlar chastotasi va n taqsimotiga bog'liq: o'lchang (61-dars).

## Qachon qo'llamaslik kerak

Inlining'ni qo'lda boshqarishga urinmang. `//go:noinline` faqat test va benchmark'larda kerak (compiler chaqiruvni olib tashlamasligi uchun). Funksiyani "inline bo'lsin" deb bo'laverish kod sifatini buzadi, byudjet esa versiyadan versiyaga o'zgaradi. PGO (67-dars) bilan issiq nuqtalarni compiler profil asosida o'zi aniqlaydi.

Stack hajmini oldindan "sozlamang". Ko'p goroutine xotirasi sizni tashvishlantirsa, avval goroutine soni va ularning bloklanish sababini tekshiring (goroutine profili va `/sched/goroutines:goroutines`, 62 va 63-darslar): har 10000 goroutine yuqoridagi o'lchovda 20 MB boshlang'ich stack berdi; muammo odatda stack hajmida emas, goroutine'lar sonining nazoratsizligida.

`SetMaxStack` ni kamaytirish halokatni tezlashtiradi, lekin uni oldini olmaydi. Rekursiyaning o'zida chuqurlik limiti yoki iterativ variant qo'ying, ayniqsa tashqaridan kelgan kirish (JSON, graf, daraxt) bilan ishlasangiz.

Katta lokal massivlardan ehtiyot bo'ling: ular stack'ni o'stirishi va nusxalashga sabab bo'lishi mumkin, heap ajratishdan arzonroq yoki qimmatroq ekani o'lchovga bog'liq. `unsafe.Pointer` bilan stack manzillarini saqlamang (unsafe haqida 69-dars): stack o'sishida manzillar o'zgaradi va yangi compiler optimizatsiyalari (Go 1.25+) bunday kod xatolarini kuchaytirishi mumkin.

## Stack'da: Node.js bilan farq

Node.js'da chaqiruvlar stack'i yagona thread bilan bog'liq va cheklangan; chuqur rekursiya `RangeError: Maximum call stack size exceeded` beradi, uni `try/catch` ushlaydi. Go'da bunday emas: stack overflow `fatal error`, ushlab bo'lmaydi. Shuning uchun Go'da tashqi kirishni rekursiv yurishda chuqurlikni qo'lda cheklash kerak: o'z rekursiyangizda chuqurlik hisoblagichini o'zingiz yuritasiz.

Monitoringda stack'ga tegishli: `/memory/classes/heap/stacks:bytes` (stack xotirasi), `/sched/goroutines:goroutines` (goroutine soni), `/gc/stack/starting-size:bytes` (boshlang'ich hajm). Profilda `runtime.newstack`, `runtime.copystack` yoki `runtime.morestack` ko'p CPU olayotgan bo'lsa, stack o'sishi qimmat. Bu muallifning amaliy tavsiyasi, manbada ko'rsatilgan emas; shu belgi bo'lganda stack ramkasini kattalashtirayotgan lokal massivlarni yoki chuqur rekursiyani qidiring.

## Xulosa

- Goroutine stack'i kichik (Go 1.24.7 da 2048 bayt) boshlanadi, kerak bo'lsa ikki baravarga o'sadi (nusxalash bilan) va GC paytida bo'sh bo'lsa yarmiga kichrayadi. 10000 bloklangan goroutine +20000 KiB berdi.
- Stack limiti (standart 1 GB, 64-bit) oshsa `fatal error: stack overflow`: bu panic emas, `recover` ushlamaydi, jarayon tugaydi.
- Inlining byudjet bilan ishlaydi (Go 1.24.7 da 80). `-gcflags=-m=2` har funksiya uchun `can inline ... cost N` yoki `cannot inline` sababini ko'rsatadi.
- O'zgaruvchan o'lchamli `make` Go 1.24.7 da heap'ga qochadi (`non-constant size`); Go 1.25 va 1.26 compiler'i slice backing store'ni stack'ga ko'proq holatlarda joylashtiradi, noto'g'ri `unsafe.Pointer` kodini esa kuchaytirishi mumkin (release notes).
- Optimizatsiyadan oldin o'lchang: inlining, stack massivi va rekursiya trade-off'lari ish yuklamasiga bog'liq.
