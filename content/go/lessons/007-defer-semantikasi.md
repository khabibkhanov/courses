---
n: 7
slug: defer-semantikasi
title: "defer: baholash tartibi, xarajat va tuzoqlar"
summary: "defer'da argument va receiver qachon baholanadi, deferred funksiyalar qanday tartibda va natija parametrlariga qanday ta'sir qilib ishlaydi, recover qayerda ishlaydi, tsiklda defer va Close xatolarini yo'qotish tuzoqlari hamda defer xarajati."
duration: 40
sources:
  - id: go-spec
    note: "Defer statements, Return statements va Handling panics bo'limlari"
  - id: blog-defer-panic
    note: "Defer'ning uch qoidasi: argumentlar defer ifodasi baholanganda, LIFO tartibi, nomli natijalarni o'zgartirish"
  - id: 100go
    note: "#35 (tsiklda defer), #47 (defer argument va receiver'lari qanday baholanadi), #54 (defer xatolarini qayta ishlamaslik): sarlavhalar saytdagi ro'yxatdan"
  - id: pkg-os
    note: "Exit: defer'lar ishlamaydi"
quiz:
  - q: "func a() { i := 0; defer fmt.Println(i); i++ } nimani chop etadi?"
    options:
      - "1"
      - "Hech narsa: defer funksiya tugamasdan ishlamaydi"
      - "0"
      - "Kompilyatsiya xatosi"
    answer: 2
    explain: "Deferred chaqiruvning argumentlari defer statement bajarilganda baholanadi va saqlanadi. i o'sha paytda 0 edi. Funksiya tugaganda saqlangan 0 chop etiladi."
  - q: "for i := 0; i <= 3; i++ { defer fmt.Print(i) } tsikli ishlagandan keyin funksiya tugaganda nima chop etiladi?"
    options:
      - "0123"
      - "3210"
      - "3333"
      - "Tsikl har iteratsiyada defer'ni ishga tushiradi: 0123 tsikl davomida chop etiladi"
    answer: 1
    explain: "Deferred chaqiruvlar funksiya tugaganda, qaytarilgan tartibda (LIFO) bajariladi. Argument defer paytida baholanadi, shuning uchun har biri o'z qiymatini saqlaydi: 3 2 1 0."
  - q: "func f() (result int) { defer func() { result *= 7 }(); return 6 } nimani qaytaradi?"
    options:
      - "6"
      - "13"
      - "42"
      - "0"
    answer: 2
    explain: "return avval result ni 6 ga o'rnatadi, keyin deferred funksiya ishlaydi va result ni 42 ga ko'paytiradi. Spetsifikatsiyaning o'z misoli: f 42 qaytaradi."
  - q: "t := Trip{Km: 10}; defer t.Summary() (value receiver); defer t.SummaryPtr() (pointer receiver); t.Km = 250. Funksiya tugaganda Summary va SummaryPtr nimani ko'rsatadi?"
    options:
      - "Ikkalasi ham 250"
      - "Ikkalasi ham 10"
      - "Summary 250, SummaryPtr 10"
      - "Summary 10 (receiver nusxasi defer paytida olingan), SummaryPtr 250 (pointer defer paytida olingan, qiymat keyin o'qiladi)"
    answer: 3
    explain: "Deferred chaqiruvda receiver ham argument kabi defer paytida baholanadi. Value receiver uchun bu t ning nusxasi (Km=10), pointer receiver uchun &t, uning orqali o'qiyotganda esa joriy qiymat (250) ko'rinadi. Bu 100 Go Mistakes #47 mavzusi."
  - q: "Deferred funksiya ichida `r := helper()` yozilgan, helper esa `return recover()`. Panic paytida r nima bo'ladi?"
    options:
      - "Panic qiymati, chunki recover deferred funksiya doirasida chaqirilgan"
      - "nil: recover deferred funksiyaning o'zi tomonidan to'g'ridan-to'g'ri chaqirilmagan, panic davom etadi"
      - "Run-time panic: recover faqat main'da ishlaydi"
      - "Kompilyatsiya xatosi: recover'ni boshqa funksiyaga o'tkazib bo'lmaydi"
    answer: 1
    explain: "Spetsifikatsiya: recover natijasi nil, agar u deferred funksiya tomonidan to'g'ridan-to'g'ri chaqirilmagan bo'lsa. helper() ichidagi recover deferred funksiyaning o'zi emas. Biz sandbox'da shuni sinadik: panic tashqi recover'gacha davom etdi."
  - q: "processAll tsikl ichida `c := open(id); defer c.Close()` yozadi, 1000 ta id bor. Eng aniq muammo?"
    options:
      - "Hamma ulanish funksiya oxirigacha ochiq qoladi: Close tsikl iteratsiyasi oxirida emas, funksiya tugaganda chaqiriladi"
      - "Close hech qachon chaqirilmaydi"
      - "Faqat oxirgi ulanish yopiladi"
      - "Kompilyatsiya xatosi: defer tsikl ichida taqiqlangan"
    answer: 0
    explain: "defer funksiya tugaganda ishlaydi, iteratsiya oxirida emas. 1000 ta ulanish bir vaqtda ochiq turadi, hammasi LIFO tartibida oxirida yopiladi. Yechim: tanani alohida funksiyaga chiqarish (100 Go Mistakes #35)."
task:
  title: "Tsiklda defer va Close xatosini yo'qotmaslik"
  prompt: |
    `ProcessAll` har bir id uchun `Pool`dan ulanish oladi, ma'lumot yuboradi va ulanishni yopadi. Hozirgi kod ikki xatoga ega:

    1. `defer c.Close()` tsikl ichida turibdi: barcha ulanish funksiya oxirigacha ochiq qoladi (`maxOpen` 5 bo'lib chiqadi).
    2. `Close` xatosi (juft id'li ulanishlar Close'da xato qaytaradi) hech qayerda tekshirilmaydi.

    Tuzating: bir vaqtda faqat bitta ulanish ochiq bo'lsin (`maxOpen == 1`), Close xatolari yo'qolmasin va barcha xatolar `errors.Join` bilan birlashtirilib qaytarilsin, `errors.Is(err, errClose)` `true` bo'lsin. `Pool`, `Conn` tiplarini va `ProcessAll` imzosini o'zgartirmang.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
    )

    var errClose = errors.New("close xatosi")

    // Pool ochiq ulanishlar sonini va ularning eng yuqori qiymatini sanaydi.
    type Pool struct {
        open, maxOpen int
    }

    type Conn struct {
        id   int
        pool *Pool
    }

    func (p *Pool) Acquire(id int) *Conn {
        p.open++
        if p.open > p.maxOpen {
            p.maxOpen = p.open
        }
        return &Conn{id: id, pool: p}
    }

    // Close ulanishni qaytaradi; juft id'li ulanishlar Close xatosini beradi.
    func (c *Conn) Close() error {
        c.pool.open--
        if c.id%2 == 0 {
            return fmt.Errorf("conn %d: %w", c.id, errClose)
        }
        return nil
    }

    func (c *Conn) Send(batch int) error { return nil }

    // ProcessAll har bir id uchun ulanish ochib, ma'lumot yuboradi.
    // Bir vaqtning o'zida bitta ulanish ochiq bo'lishi va Close xatolari qaytarilishi kerak.
    func ProcessAll(p *Pool, ids []int) error {
        for _, id := range ids {
            c := p.Acquire(id)
            defer c.Close()
            if err := c.Send(id); err != nil {
                return err
            }
        }
        return nil
    }

    func main() {
        p := &Pool{}
        err := ProcessAll(p, []int{1, 2, 3, 4, 5})
        fmt.Println("maxOpen:", p.maxOpen, "open:", p.open)
        fmt.Println("xato:", err)
        fmt.Println("errors.Is:", errors.Is(err, errClose))
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
    )

    var errClose = errors.New("close xatosi")

    // Pool ochiq ulanishlar sonini va ularning eng yuqori qiymatini sanaydi.
    type Pool struct {
        open, maxOpen int
    }

    type Conn struct {
        id   int
        pool *Pool
    }

    func (p *Pool) Acquire(id int) *Conn {
        p.open++
        if p.open > p.maxOpen {
            p.maxOpen = p.open
        }
        return &Conn{id: id, pool: p}
    }

    // Close ulanishni qaytaradi; juft id'li ulanishlar Close xatosini beradi.
    func (c *Conn) Close() error {
        c.pool.open--
        if c.id%2 == 0 {
            return fmt.Errorf("conn %d: %w", c.id, errClose)
        }
        return nil
    }

    func (c *Conn) Send(batch int) error { return nil }

    // processOne bitta ulanishni ochadi, ishlatadi va yopadi.
    // Close xatosi asosiy xatoga qo'shiladi.
    func processOne(p *Pool, id int) (err error) {
        c := p.Acquire(id)
        defer func() {
            err = errors.Join(err, c.Close())
        }()
        return c.Send(id)
    }

    // ProcessAll har bir id uchun ulanish ochib, ma'lumot yuboradi.
    // Bir vaqtning o'zida bitta ulanish ochiq bo'lishi va Close xatolari qaytarilishi kerak.
    func ProcessAll(p *Pool, ids []int) error {
        var errs []error
        for _, id := range ids {
            if err := processOne(p, id); err != nil {
                errs = append(errs, err)
            }
        }
        return errors.Join(errs...)
    }

    func main() {
        p := &Pool{}
        err := ProcessAll(p, []int{1, 2, 3, 4, 5})
        fmt.Println("maxOpen:", p.maxOpen, "open:", p.open)
        fmt.Println("xato:", err)
        fmt.Println("errors.Is:", errors.Is(err, errClose))
    }
  solutionNotes: |
    - Tanani `processOne` funksiyasiga ajratish `defer`ni funksiya darajasiga qaytaradi: har iteratsiyada ulanish shu funksiya tugaganda yopiladi (100 Go Mistakes #35). Nomli natija `err` defer ichidan o'zgartirilishi mumkin.
    - `errors.Join(err, c.Close())` asosiy xato bilan Close xatosini birlashtiradi; ikkalasi `nil` bo'lsa `nil` qaytadi. `processOne` ichida `err` ni natijaga yozish defer ishga tushishidan oldin `return` bilan o'rnatiladi (spetsifikatsiya), shuning uchun defer uni ko'radi.
    - `ProcessAll` iteratsiyalar xatolarini yig'ib `errors.Join(errs...)` qaytaradi; `errors.Is(err, errClose)` birlashtirilgan xato daraxtini kezib chiqadi (31-dars).
    - Alternativ: ulanishni tsikl ichida qo'lda yopish, lekin `Send` xatosi paytida Close chaqirilmay qolish xavfi bor. `defer` bu xavfni yo'q qiladi.
  checklist:
    - "`maxOpen` 1 ga teng, tugagach `open` 0"
    - "Close xatolari yo'qolmaydi: chiqishda `conn 2` va `conn 4` xatolari bor"
    - "`errors.Is(err, errClose)` `true`"
    - "`defer` tsikl ichida emas, alohida funksiyada"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

`defer` Go'ning eng ko'p ishlatiladigan va eng ko'p noto'g'ri tushuniladigan konstruksiyalaridan biri. U resurslarni tozalashning standart yo'li: `defer mu.Unlock()`, `defer rows.Close()`, `defer cancel()`. Lekin uning semantikasi uchta mustaqil qoidaga tayanadi (argumentlar qachon baholanadi, qaysi tartibda ishlaydi, natija parametrlariga qanday ta'sir qiladi) va ularni bilmasdan yozilgan kod kompilyatsiyadan o'tadi, ammo production'da ulanishlar tugab qoladi, xatolar yo'qoladi yoki panic qayta ishlanmaydi.

Node.js'da bunga `try/finally` javob beradi: `finally` bloki funksiya oxirida ishlaydi va uning argumentlari yo'q. Go'da `defer` argumentlarni **hozir** baholab, chaqiruvni **keyinga** qoldiradi. Shu ikkala jihat bu darsning markazi.

## Asosiy g'oya

### Uch qoida

Go Blog "Defer, Panic, and Recover" defer xatti-harakatini uch oddiy qoida sifatida beradi:

1. Deferred funksiyaning argumentlari defer statement baholanganda baholanadi.
2. Deferred chaqiruvlar Last In First Out tartibida, surrounding funksiya qaytgandan keyin (aniqrog'i, qaytishdan oldin) ishga tushadi.
3. Deferred funksiyalar qaytaruvchi funksiyaning nomli natijalarini o'qiy va o'zgartira oladi.

Spetsifikatsiya ularni aniqroq aytadi. Har safar `defer` statement bajarilganda funksiya qiymati va parametrlar odatdagidek baholanadi va saqlanadi, lekin funksiya chaqirilmaydi. Deferred funksiyalar surrounding funksiya qaytishidan oldin, defer qilingan tartibning teskarisida chaqiriladi. Agar surrounding funksiya aniq `return` bilan qaytsa, deferred funksiyalar `return` natija parametrlarini o'rnatganidan **keyin**, lekin funksiya chaqiruvchiga qaytishidan **oldin** bajariladi. Deferred funksiya qiymati `nil` bo'lsa, panic `defer` statement bajarilganda emas, funksiya **chaqirilganda** yuz beradi. Deferred funksiya biror qiymat qaytarsa, u tashlab yuboriladi.

Spetsifikatsiya ikkita misol beradi: `defer unlock(l)` va tsiklda `defer fmt.Print(i)` (natija `3 2 1 0`), hamda `f() (result int)` funksiyasi (u 42 qaytaradi, quyida sinaymiz).

### Argumentlar vs closure

Ikki shakl bor va ular bir xil emas:

- `defer fmt.Println(x)`: `x` darhol baholanadi va saqlanadi.
- `defer func() { fmt.Println(x) }()`: funksiya literal'ning o'zi baholanadi, uning ichidagi `x` esa closure orqali o'zgaruvchining o'zini ushlaydi (6-dars) va funksiya tugaganda **oxirgi** qiymatni ko'radi.

Method chaqiruvlarida receiver ham argument qatori baholanadi (100 Go Mistakes #47). `defer t.Summary()` value receiver bo'lsa `t` nusxasini oladi; pointer receiver bo'lsa `&t` ni oladi va qiymat keyinroq, pointer orqali o'qiladi.

## Chuqurroq: panic, recover va xarajat

### recover faqat to'g'ridan-to'g'ri chaqirilganda ishlaydi

Spetsifikatsiya: `recover` ning qiymati `nil`, agar goroutine panic qilmayotgan bo'lsa **yoki `recover` deferred funksiya tomonidan to'g'ridan-to'g'ri chaqirilmagan bo'lsa**. Aksincha, goroutine panic qilayotgan va recover deferred funksiyada to'g'ridan-to'g'ri chaqirilgan bo'lsa, qaytgan qiymat `nil` bo'lmasligi kafolatlangan; shu uchun `panic(nil)` run-time panic bo'lgan (1-dars `PanicNilError`ni yodga oling). Deferred funksiya normal tugasa, panic to'xtaydi: G va panic joyi orasida chaqirilgan funksiyalarning holati tashlanadi, G dan oldin defer qilingan funksiyalar ishlaydi va G o'z chaqiruvchisiga normal qaytadi.

Amaliy ma'no: `recover()` ni deferred funksiyaning o'zi chaqirishi kerak. `defer logPanic()` ishlaydi (`logPanic` o'zi deferred funksiya va `recover`ni to'g'ridan-to'g'ri chaqiradi), `defer func() { logPanic() }()` esa ishlamaydi: `recover` deferred funksiya chaqirgan boshqa funksiya ichida qoladi (quyida sinab ko'ramiz). Qachon panic ishlatish va ushlash kerakligi 33-darsda.

### Panic faqat o'z goroutine'ini yechadi

Spetsifikatsiya: panic F ning deferred funksiyalarini, so'ng chaqiruvchisiniki va hokazo, goroutine'ning eng yuqori funksiyasigacha ishga tushiradi, shundan keyin dastur to'xtaydi. Boshqa goroutine'dagi `recover` bunga aralasha olmaydi. Quyidagi dasturda `main` o'zining `defer`ida `recover` yozgan, lekin panic alohida goroutine'da yuz beradi:

```go
package main

import (
	"fmt"
	"time"
)

func logPanic() {
	if r := recover(); r != nil {
		fmt.Println("logPanic ushladi:", r)
	}
}

func direct() {
	defer logPanic() // logPanic deferred funksiyaning o'zi
	panic("direct")
}

func wrapped() {
	defer func() { logPanic() }() // recover logPanic ichida: to'g'ridan-to'g'ri emas
	panic("wrapped")
}

func main() {
	direct()
	func() {
		defer func() { fmt.Println("tashqarida:", recover()) }()
		wrapped()
	}()

	defer func() { fmt.Println("main recover:", recover()) }()
	go func() { panic("boom") }()
	time.Sleep(100 * time.Millisecond)
	fmt.Println("bu qator chop etilmaydi")
}
```

Go 1.24.7 da chiqishning boshi va chiqish kodi:

```text
logPanic ushladi: direct
tashqarida: wrapped
panic: boom

goroutine 6 [running]:
```

Dastur chiqish kodi 2 bilan tugadi, `main recover:` qatori va oxirgi `Println` chop etilmadi. Birinchi ikki qator esa `recover` qoidasini ko'rsatadi: `defer logPanic()` ushladi, `defer func() { logPanic() }()` esa ushlay olmadi va panic tashqi funksiyagacha davom etdi. Xulosa: goroutine boshlayotgan har bir joyda panic himoyasi (kerak bo'lsa) shu goroutine ichida o'rnatiladi (41-dars).

### Tsiklda defer

`defer` funksiya darajasida ishlaydi, blok darajasida emas. Tsiklda `defer` yozilsa, har iteratsiya navbatga yangi chaqiruv qo'shadi va ular funksiya tugaguncha ishlamaydi. Natijada resurslar (fayl, ulanish, mutex) to'planadi (100 Go Mistakes #35). Yechim: tsikl tanasini alohida funksiyaga chiqarish yoki aniq yopish (lekin aniq yopishda xato yo'llari uchun ehtiyot bo'ling).

### Go 1.22 va tsikl o'zgaruvchisi: closure shakli o'zgargan joy

Yuqoridagi "closure oxirgi qiymatni ko'radi" qoidasi tsikl o'zgaruvchisiga qo'llanganda versiyaga bog'liq. Go 1.22 release notes'iga ko'ra, 1.22 gacha `for` tsiklida e'lon qilingan o'zgaruvchilar bir marta yaratilib, har iteratsiyada yangilangan; 1.22 dan boshlab har iteratsiya yangi o'zgaruvchilar yaratadi. Qaysi qoida amal qilishi go.mod'dagi `go` qatoriga bog'liq (1-dars), shuning uchun eski modulda yangi toolchain bilan ham eski xatti-harakat saqlanadi. Bir xil manba kodini ikki xil go.mod bilan ishga tushirdik (Go 1.24.7, linux/amd64):

```go run
package main

import "fmt"

func main() {
	for i := 0; i < 3; i++ {
		defer func() { fmt.Println("closure i =", i) }()
	}
	for i := 0; i < 3; i++ {
		defer fmt.Println("argument i =", i)
	}
}
```

```text
go.mod: go 1.21                    go.mod: go 1.22
argument i = 2                     argument i = 2
argument i = 1                     argument i = 1
argument i = 0                     argument i = 0
closure i = 3                      closure i = 2
closure i = 3                      closure i = 1
closure i = 3                      closure i = 0
```

Argumentli shakl ikkala holatda bir xil: qiymat defer paytida saqlanadi. Closure shakli esa `go 1.21` da uchala chaqiruvda ham `3` ni ko'rsatdi (tsikl tugagandan keyingi qiymat), `go 1.22` da har iteratsiyaning o'z `i`sini. `go vet` `go 1.21` fayli uchun `loop variable i captured by func literal` ogohlantirishini berdi; Go 1.22 release notes'ga ko'ra vet go.mod yoki fayl darajasida Go 1.22 talab qiladigan kodda bunday havolalar haqida endi xabar bermaydi. Amaliy xulosa: eski go.mod'li kodni o'qiyotganda closure ichidagi tsikl o'zgaruvchisiga shubha bilan qarang; yangi kodda bu xato klassi yo'q, lekin tsiklda `defer`ning resurs to'plash muammosi (yuqorida) o'zgarmaydi.

### runtime.Goexit: panic emas, lekin defer ishlaydi

`runtime.Goexit` chaqirgan goroutine'ni tugatadi. pkg.go.dev/runtime hujjatiga ko'ra u tugatishdan oldin barcha deferred chaqiruvlarni bajaradi, lekin Goexit panic emas, shuning uchun o'sha deferred funksiyalardagi `recover` `nil` qaytaradi. Ya'ni "recover() nil bo'lsa, panic bo'lmagan" degan xulosa noto'g'ri: goroutine Goexit bilan chiqayotgan bo'lishi ham mumkin. Test kutubxonalari (`t.FailNow` va `t.Fatal` shu mexanizmdan foydalanadi) shunga tayanadi. Natija sifatida `wg.Done()` kabi tozalash defer'da yozilgan bo'lsa, Goexit'da ham ishlaydi:

```go run
package main

import (
	"fmt"
	"runtime"
	"sync"
)

func worker(wg *sync.WaitGroup) {
	defer wg.Done()
	defer func() { fmt.Println("recover:", recover()) }()
	defer fmt.Println("deferred ishladi")
	runtime.Goexit()
	fmt.Println("bu qator chop etilmaydi")
}

func main() {
	var wg sync.WaitGroup
	wg.Add(1)
	go worker(&wg)
	wg.Wait()
	fmt.Println("main davom etdi")
}
```

```text
deferred ishladi
recover: <nil>
main davom etdi
```

### Panic ichida panic va qayta panic

Deferred funksiya o'zi panic qilsa, yangi panic oldingisini almashtiradi: keyingi `recover` faqat oxirgi panic qiymatini qaytaradi, birinchisi yo'qoladi. Misolda `defer func() { panic("ikkinchi") }()` `"birinchi"` ni bosib ketdi va tashqi deferred funksiya `recover()` dan `ikkinchi` oldi. Shu sababli deferred tozalash kodi panic qilmasligi kerak: u asl sababni yashiradi.

Ikkinchi holat: `recover` qilib, qiymatni `panic(r)` bilan qayta uzatish (masalan, log yozib, keyin tashlash). Go 1.24.7 da `main` oxirida shunday qilsak, chiqish quyidagicha boshlanadi:

```text
panic: asl panic [recovered]
	panic: asl panic
```

Go 1.25 release notes'ga ko'ra bu xabar o'zgargan: qayta panic qilingan va asl qiymat bilan bir xil bo'lsa, matn takrorlanmaydi va `panic: asl panic [recovered, repanicked]` chiqadi. Bu o'zgarish faqat chiqish matniga tegishli (log parser yozgan bo'lsangiz, bu qatorga tayanmang); biz 1.25 ni lokal ishga tushira olmadik, shuning uchun yangi format release notes'dan olingan. Go 1.23 dan boshlab panic xabarining ikkinchi va undan keyingi qatorlari bitta tab bilan suriladi, shunda ular birinchi goroutine stack trace'idan aniq ajraladi.

### Close xatolarini yo'qotmaslik

`defer f.Close()` Close qaytargan xatoni tashlab yuboradi. Yozuv operatsiyasi uchun bu xavfli: ko'p tizimlarda ma'lumot Close paytida diskka flush qilinadi va xato shu yerda chiqadi (100 Go Mistakes #54 defer xatolarini qayta ishlamaslik haqida). Pattern: nomli natija va defer ichida `errors.Join(err, c.Close())` yoki birinchi xatoni saqlab qolish.

### defer xarajati

Defer'ning xarajati bor, lekin u tsikl bo'lmaganda kichik. Biz Go 1.24.7 (linux/amd64, Intel Xeon 2.1 GHz, 2 yadro) da `go test -bench` ishga tushirdik. Mashina boshqa jarayonlar bilan baham ishlatilgani uchun natijalar shovqinli, raqamlar faqat tartibni ko'rsatadi:

```text
BenchmarkDirect-2        ~17-20 ns/op    (Lock, counter++, Unlock)
BenchmarkDefer-2         ~17-18 ns/op    (xuddi shu, Unlock defer bilan)
BenchmarkLoopDefer100-2  ~2200 ns/op     (tsiklda 100 ta defer noop())
BenchmarkLoopDirect100-2 ~70-85 ns/op    (tsiklda 100 ta noop() to'g'ridan-to'g'ri)
```

Ya'ni funksiya boshida bitta `defer mu.Unlock()` bu o'lchovda to'g'ridan-to'g'ri chaqiruvdan farq qilmadi, tsiklda yig'ilgan `defer`lar esa har biri taxminan 20 ns qimmatga tushdi (2200 ns / 100). Bu raqamlarni boshqa protsessor yoki Go versiyasiga ko'chirmang: o'zingiz o'lchang (61-dars). Bu o'lchovlar defer ichki mexanizmi haqida xulosa qilmaydi, faqat shu mikrobenchmark natijasi. Versiya tarixi uchun: Go 1.14 release notes'ga ko'ra shu versiyada defer'ning ko'p ishlatilishlari deyarli nol qo'shimcha xarajat bilan bajariladigan bo'ldi, shuning uchun eski maqolalardagi "defer sekin" maslahati Go 1.14 dan oldingi davrga tegishli. "Ko'p" so'zi muhim: release notes istisnolarni sanamaydi, tsikldagi defer'ning yuqoridagi o'lchovi esa baribir qimmat chiqdi.

## Misol: baholash, recover va resurslar

### 1. Argument, closure, tartib, receiver

```go run
package main

import "fmt"

type Trip struct {
	Vehicle string
	Km      float64
}

func (t Trip) Summary() { fmt.Printf("  [value receiver] %s: %.0f km\n", t.Vehicle, t.Km) }

func (t *Trip) SummaryPtr() { fmt.Printf("  [pointer receiver] %s: %.0f km\n", t.Vehicle, t.Km) }

func arguments() {
	fmt.Println("argumentlar:")
	x := 1
	defer fmt.Println("  defer argumenti defer paytida baholandi: x =", x)
	defer func() { fmt.Println("  closure oxirgi qiymatni ko'radi: x =", x) }()
	x = 2
	fmt.Println("  funksiya tanasi tugadi, x =", x)
}

func order() {
	fmt.Println("tartib (LIFO):")
	for i := 1; i <= 3; i++ {
		defer fmt.Println("  defer", i)
	}
}

func receivers() {
	fmt.Println("receiver:")
	t := Trip{"truck-7", 10}
	defer t.Summary()    // t nusxasi hozir olinadi
	defer t.SummaryPtr() // &t hozir olinadi, qiymat keyin o'qiladi
	t.Km = 250
}

func main() {
	arguments()
	order()
	receivers()
}
```

```text
argumentlar:
  funksiya tanasi tugadi, x = 2
  closure oxirgi qiymatni ko'radi: x = 2
  defer argumenti defer paytida baholandi: x = 1
tartib (LIFO):
  defer 3
  defer 2
  defer 1
receiver:
  [pointer receiver] truck-7: 250 km
  [value receiver] truck-7: 10 km
```

Chiqishda ko'rinadi: `defer fmt.Println(..., x)` `x = 1` ni saqladi, closure esa oxirgi `x = 2` ni ko'rdi. Ikki defer LIFO tartibida: avval closure (keyin e'lon qilingan), keyin argumentli `Println`. Tsikldagi defer'lar `3 2 1`. Receiver misolida pointer receiver `250 km`, value receiver `10 km` ko'rsatdi.

### 2. recover chegaralari, nil defer, os.Exit

```go run
package main

import (
	"fmt"
	"os"
)

func helper() any { return recover() }

func directRecover() (res string) {
	defer func() {
		if r := recover(); r != nil {
			res = fmt.Sprint("ushlandi: ", r)
		}
	}()
	panic("direct")
}

// helperRecover'da recover deferred funksiyaning o'zi tomonidan emas,
// u chaqirgan helper orqali chaqiriladi: nil qaytadi, panic davom etadi.
func helperRecover() (res string) {
	defer func() {
		r := helper()
		res = fmt.Sprint("helper qaytardi: ", r)
	}()
	panic("helper")
}

func nilDefer() {
	defer func() { fmt.Println("recover:", recover()) }()
	var f func()
	defer f() // defer paytida xato yo'q, funksiya tugaganda nil chaqiriladi
	fmt.Println("nilDefer tanasi tugadi")
}

func main() {
	fmt.Println(directRecover())

	func() {
		defer func() { fmt.Println("tashqarida ushlandi:", recover()) }()
		fmt.Println(helperRecover())
	}()

	nilDefer()

	defer fmt.Println("bu qator chop etilmaydi")
	os.Exit(0)
}
```

```text
ushlandi: direct
tashqarida ushlandi: helper
nilDefer tanasi tugadi
recover: runtime error: invalid memory address or nil pointer dereference
```

`directRecover` panic'ni ushladi. `helperRecover` da recover yordamchi orqali chaqirildi: nil qaytdi va panic tashqi funksiyagacha yetib bordi (u yerda ushlandi). `nilDefer`da `defer f()` (f nil) statement bajarilganda panic bermadi: tana tugadi, keyin chaqirilganda panic bo'ldi, shu bilan spetsifikatsiya tasdiqlandi. Oxirgi `os.Exit(0)` dan keyin `bu qator chop etilmaydi` qatori ham chiqmadi: dastur deferred funksiyalarni ishga tushirmasdan tugadi. `os.Exit` paketi hujjati (pkg.go.dev/os) ham buni aytadi: dastur darhol tugaydi, deferred funksiyalar ishga tushmaydi. Bu hujjat kursning manbalar ro'yxatida yo'q, shuning uchun dars frontmatter'iga kiritilmagan.

### 3. Mutex va natija o'zgartirish

```go run
package main

import (
	"fmt"
	"sync"
)

type Store struct {
	mu    sync.Mutex
	count map[string]int
}

// Inc defer bilan Unlock'ni har qanday chiqish yo'li uchun kafolatlaydi.
func (s *Store) Inc(key string) (n int, err error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if key == "" {
		return 0, fmt.Errorf("bo'sh kalit")
	}
	s.count[key]++
	return s.count[key], nil
}

func f() (result int) {
	defer func() {
		// result return tomonidan 6 qilib o'rnatilgandan keyin o'qiladi
		result *= 7
	}()
	return 6
}

func main() {
	s := &Store{count: map[string]int{}}
	fmt.Println(s.Inc("fuel-1"))
	fmt.Println(s.Inc(""))
	fmt.Println(s.Inc("fuel-1"))
	fmt.Println(f())
}
```

```text
1 <nil>
0 bo'sh kalit
2 <nil>
42
```

`Inc` da `defer s.mu.Unlock()` xato qaytarilganda ham mutex'ni ochadi; `f` spetsifikatsiya misoli: 42.

### 4. Close xatosi

```go run
package main

import (
	"errors"
	"fmt"
)

type Conn struct {
	ID   int
	open *int
}

var errClose = errors.New("close xatosi")

func (c *Conn) Close() error {
	*c.open--
	if c.ID%2 == 0 {
		return fmt.Errorf("conn %d: %w", c.ID, errClose)
	}
	return nil
}

// leaky: Close xatosi e'tiborsiz qoladi.
func leaky(open *int) error {
	c := &Conn{ID: 2, open: open}
	*open++
	defer c.Close()
	return nil
}

// careful: Close xatosi asosiy xato yo'q bo'lsa qaytariladi.
func careful(open *int) (err error) {
	c := &Conn{ID: 2, open: open}
	*open++
	defer func() {
		if cerr := c.Close(); cerr != nil {
			err = errors.Join(err, cerr)
		}
	}()
	return nil
}

func main() {
	open := 0
	fmt.Println("leaky:", leaky(&open), "ochiq:", open)
	fmt.Println("careful:", careful(&open), "ochiq:", open)
}
```

```text
leaky: <nil> ochiq: 0
careful: conn 2: close xatosi ochiq: 0
```

`leaky` `defer c.Close()` bilan xatoni tashlab yubordi (`<nil>`), `careful` esa nomli natija va `errors.Join` bilan `conn 2: close xatosi` ni qaytardi. Ikkala holatda ulanish yopildi (`ochiq: 0`).

## Qachon qo'llamaslik kerak

- Tsikl ichida resurs ochib `defer` yozmang. Tanani funksiyaga ajrating. Bu kichik tsikl uchun ham to'g'ri odat, chunki iteratsiyalar soni keyin o'sadi.
- Juda issiq (hot) yo'lda, bir sekundda millionlab chaqiriladigan kichik funksiyada defer xarajatini o'lchang. Bizning mikrobenchmark'da bitta defer farq qilmadi, lekin o'z kodingizda o'lchamasdan "defer sekin" deb yozmang (61-dars).
- `os.Exit` va `log.Fatal` oldidan deferred tozalash ishlamaydi: `os.Exit` bu darsda sinaldi va uning hujjati ham buni yozadi; `log.Fatal` hujjatga ko'ra `Print` va `os.Exit(1)` chaqiruviga teng. Tozalash kerak bo'lsa, `main` ichida natijani qaytaruvchi funksiyani chaqiring va faqat `main` oxirida chiqing (88-dars).
- `recover`ni umumiy xato ushlagich sifatida ishlatmang. Panic dasturiy xato yoki tiklab bo'lmaydigan holat belgisi; ushlash faqat chegarada (server handler, goroutine ildizi) mantiqli (33-dars).
- Deferred funksiya qiymat qaytarsa, u tashlanadi: `defer f.Close()` xatosi yo'qoladi. Kod ahamiyatli ma'lumotni yozayotgan bo'lsa, Close xatosini tekshiring (topshiriq).

## Stack'da: Node.js/TypeScript bilan solishtirish

- `try { ... } finally { cleanup() }` o'rnini Go'da `defer cleanup()` bosadi, lekin farqlar bor: `defer` ro'yxatdan o'tgan joyda yoziladi (resurs olingandan keyin darhol), `finally` esa blok oxirida. Shu sabab Go'da "ochdim - darhol defer" odati ishlaydi.
- JavaScript'da `finally` ichidagi `return` asl natijani bosib ketadi. Go'da deferred funksiya natijani faqat **nomli** natija parametri orqali o'zgartira oladi.
- Node.js'da `finally` ichida `await` qilish mumkin; Go'da ham deferred funksiya oddiy kod bajara oladi (jumladan bloklovchi chaqiruvlarni), lekin funksiyaning qaytishi shu kod tugaguncha kechikadi. Shuning uchun deferred funksiya ichida uzoq ish qilmang.
- Express handler'larda xatolarni `next(err)` bilan uzatasiz. Go'da panic'dan himoya `defer`+`recover` middleware'ida bo'ladi (74-dars), oddiy xatolar esa qiymat sifatida qaytadi.

## Xulosa

- `defer` argumentlarni (va method receiver'ni) darhol baholaydi, funksiyani esa qaytishdan oldin chaqiradi.
- Deferred chaqiruvlar LIFO tartibida ishlaydi; `return` natijalarni o'rnatadi, keyin deferred funksiyalar ularni (nomli natija bo'lsa) o'zgartira oladi.
- Closure shakli (`defer func() { ... }()`) o'zgaruvchining oxirgi qiymatini ko'radi, argument shakli esa defer paytidagi qiymatni.
- `recover` faqat deferred funksiyaning o'zi chaqirganda ishlaydi; yordamchi funksiya ichida nil qaytaradi.
- Tsiklda `defer` resurslarni funksiya oxirigacha ushlab turadi: tanani alohida funksiyaga ajrating.
- `defer f.Close()` xatoni yo'qotadi; ahamiyatli yozuvlarda nomli natija va `errors.Join` bilan xatoni qaytaring, `os.Exit` esa deferred funksiyalarni o'tkazib yuboradi.
