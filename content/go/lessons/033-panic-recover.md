---
n: 33
slug: panic-recover
title: "panic va recover: qachon va qayerda"
summary: "panic'ning spetsifikatsiyadagi semantikasi, recover qachon nil qaytarishi, goroutine chegarasi, run-time panic va fatal error farqi, panic(nil) (Go 1.21), net/http server'ning panic'ga munosabati va panic'ni faqat paket ichida ishlatib, chegarada error'ga aylantirish."
duration: 40
sources:
  - id: blog-defer-panic
    note: "Panic va recover tavsifi; json paketidagi ichki panic/recover namunasi va 'tashqi API error qaytaradi' konvensiyasi"
  - id: go-spec
    note: "Handling panics va Run-time panics bo'limlari: recover'ning nil qaytarish shartlari, runtime.Error"
  - id: 100go
    note: "#48 (Panicking): panic faqat dasturchi xatosi va majburiy dependency yaratilmaganda; #54"
  - id: pkg-net-http
    note: "Handler.ServeHTTP hujjati: server panic'ni recover qiladi; ErrAbortHandler"
  - id: code-review-comments
    note: "Don't Panic va Handle Errors bo'limlari: oddiy xato boshqaruvi uchun panic ishlatmaslik"
  - id: go125
    note: "Change to unhandled panic output bo'limi: [recovered, repanicked] formati"
quiz:
  - q: "Quyidagi kodda `logRecover` ichida `recover()` chaqiriladi. `defer func() { logRecover() }()` bilan panic nima bo'ladi?"
    options:
      - "Panic ushlanadi, chunki recover deferred funksiya ichida chaqirilgan"
      - "Kompilyatsiya xatosi: recover faqat anonim funksiyada ishlaydi"
      - "Panic ushlanadi, lekin recover() qiymati nil bo'ladi"
      - "recover() nil qaytaradi va panic davom etadi: recover deferred funksiyaning o'zi tomonidan to'g'ridan-to'g'ri chaqirilishi shart"
    answer: 3
    explain: "Spetsifikatsiya: recover'ning qaytargan qiymati goroutine panic qilmayotgan bo'lsa yoki recover to'g'ridan-to'g'ri deferred funksiya tomonidan chaqirilmagan bo'lsa nil. Bu yerda deferred funksiya anonim funksiya, recover esa u chaqirgan logRecover ichida, shuning uchun hisobga olinmaydi. `defer logRecover()` esa ishlaydi."
  - q: "`main` boshida `defer func() { recover() }()` yozilgan. Boshqa goroutine'da nil map'ga yozilib panic bo'ldi. Nima bo'ladi?"
    options:
      - "main'dagi recover panic'ni ushlaydi, dastur davom etadi"
      - "Butun dastur to'xtaydi: recover faqat o'z goroutine'idagi panic'ni ushlay oladi"
      - "Faqat o'sha goroutine to'xtaydi, qolganlari ishlayveradi"
      - "Panic main'ga uzatiladi va main yangi panic bilan to'xtaydi"
    answer: 1
    explain: "Spetsifikatsiya panic jarayonini goroutine bo'yicha tasvirlaydi: deferred funksiyalar o'sha goroutine'ning chaqiruv stekida ishlaydi va stek tugagach dastur to'xtaydi. Boshqa goroutine'dagi defer'ni ko'ra olmaydi. Shuning uchun har goroutine o'z ichida recover qilishi kerak."
  - q: "HTTP handler ichida ushlanmagan panic bo'ldi (alohida recover middleware yo'q). `net/http` server'ning hujjatlashtirilgan xatti-harakati qanday?"
    options:
      - "Server panic'ni recover qiladi, stack trace'ni error log'ga yozadi va ulanishni yopadi yoki HTTP/2 da RST_STREAM yuboradi; jarayon yiqilmaydi"
      - "Butun jarayon to'xtaydi, chunki handler boshqa goroutine'da"
      - "Server panic'ni jimgina yutadi va mijozga 500 qaytaradi"
      - "Server qayta ishga tushadi"
    answer: 0
    explain: "Handler hujjati: server panic'ning ta'siri faqat shu so'rovga tegishli deb hisoblaydi, uni recover qiladi, stack trace'ni yozadi va ulanishni yopadi yoki RST_STREAM yuboradi. Mijoz 500 ni emas, uzilgan ulanishni ko'rishi mumkin. Shu sabab ko'p jamoalar o'z recover middleware'ida log, metrika va aniq 500 javob beradi."
  - q: "go.mod'da `go 1.24`, GODEBUG o'zgartirilmagan. `defer func() { r := recover(); fmt.Println(r == nil) }(); panic(nil)` nima chiqaradi? (1-darsga qarang)"
    options:
      - "true, chunki panic(nil) qiymati nil"
      - "Kompilyatsiya xatosi: panic(nil) taqiqlangan"
      - "Hech narsa, recover panic(nil) ni ushlamaydi"
      - "false: recover *runtime.PanicNilError qaytaradi"
    answer: 3
    explain: "Go 1.21 dan default panicnil=0: panic(nil) run-time panic'ga aylanadi va recover() *runtime.PanicNilError qaytaradi. Spetsifikatsiyaning 'panicking goroutine'da recover nil bo'lmaydi' kafolati shunga tayanadi. Faqat eski go.mod (go 1.20) yoki panicnil=1 bilan recover() nil qaytaradi."
  - q: "Parser paketi ichida chuqur rekursiyada xato topilsa panic ishlatadi. Tashqi API'ni qanday loyihalash to'g'ri?"
    options:
      - "Panic tashqariga chiqsin, chaqiruvchi recover qilsin"
      - "Ochiq funksiya ichida recover qilib, faqat paketning o'z yopiq panic tipini error'ga aylantirish; boshqa panic'larni qayta uloqtirish"
      - "Har qanday panic'ni error'ga aylantirib yutib yuborish"
      - "Panic o'rniga os.Exit chaqirish"
    answer: 1
    explain: "Go blogi json paketining shu naqshini ko'rsatadi va konvensiyani aytadi: ichkarida panic ishlatilsa ham, tashqi API aniq error qaytaradi. Faqat o'zingizning tipingizni ushlab, begona panic'ni (nil map, indeks xatosi kabi dastur xatolarini) qayta uloqtirmasangiz, haqiqiy bug'lar yashirinadi."
  - q: "Quyidagilardan qaysi birini recover ushlay OLMAYDI?"
    options:
      - "Indeks chegarasidan tashqari chiqish"
      - "nil map'ga yozish"
      - "`all goroutines are asleep - deadlock!` fatal error"
      - "Nolga butun sonli bo'lish"
    answer: 2
    explain: "Birinchi, ikkinchi va to'rtinchisi run-time panic: runtime.Error sifatida recover bilan ushlanadi (darsdagi misolda hammasi tekshirilgan). Deadlock esa panic emas, fatal error: dastur recover'ni chaqirmay to'xtaydi (darsda Go 1.24.7 da tekshirilgan, `recover:` qatori chop etilmagan)."
task:
  title: "Goroutine ichida to'g'ri recover"
  prompt: |
    Ingest servisi telemetriya paketlarini goroutine'larda qayta ishlaydi. `recoverJob` panic'ni natija qatoriga aylantirishi kerak, lekin hozir butun dastur yiqilmoqda: `recover` deferred funksiya orqali emas, uning ichidagi yordamchi chaqiruv orqali ishlatilgan.

    Tuzating:
    - Panic bitta job'ni yiqitsin, qolganlari natija bersin. Yiqilgan job uchun natija qatori yozilsin.
    - Run-time panic (indeks, nil map va h.k.) `job N: panic: <matn>` ko'rinishida, oddiy `error` bilan panic esa `job N: error: <matn>` ko'rinishida chiqsin.
    - Panic bo'lmagan job'lar uchun natija o'zgarmasin.
    - `main`ni o'zgartirmang. Kutilgan chiqish: 1-job `30`, 2- va 4-job run-time panic, 3-job `60`, 5-job `error: manfiy qiymat`.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "fmt"
        "sort"
        "sync"
    )

    // Job - bitta qayta ishlanadigan telemetriya paketi.
    type Job struct {
        ID      int
        Payload []int
    }

    // errNegative - manfiy qiymat kelganda ishlatiladigan xato.
    var errNegative = errors.New("manfiy qiymat")

    // process payload'ning uchinchi qiymatini qaytaradi.
    func process(j Job) int {
        if len(j.Payload) > 0 && j.Payload[0] < 0 {
            panic(errNegative)
        }
        return j.Payload[2]
    }

    // recoverJob panic'ni natija qatoriga aylantiradi.
    func recoverJob(j Job, results chan<- string) {
        if r := recover(); r != nil {
            results <- fmt.Sprintf("job %d: panic: %v", j.ID, r)
        }
    }

    func runAll(jobs []Job) []string {
        results := make(chan string, len(jobs))
        var wg sync.WaitGroup
        for _, j := range jobs {
            wg.Add(1)
            go func() {
                defer wg.Done()
                defer func() { recoverJob(j, results) }()
                results <- fmt.Sprintf("job %d: %d", j.ID, process(j))
            }()
        }
        wg.Wait()
        close(results)

        var out []string
        for s := range results {
            out = append(out, s)
        }
        sort.Strings(out)
        return out
    }

    func main() {
        jobs := []Job{
            {ID: 1, Payload: []int{10, 20, 30}},
            {ID: 2, Payload: []int{5}},
            {ID: 3, Payload: []int{1, 2, 60}},
            {ID: 4},
            {ID: 5, Payload: []int{-1, 0, 0}},
        }
        for _, line := range runAll(jobs) {
            fmt.Println(line)
        }
    }
  solution: |
    package main

    import (
        "errors"
        "fmt"
        "runtime"
        "sort"
        "sync"
    )

    // Job - bitta qayta ishlanadigan telemetriya paketi.
    type Job struct {
        ID      int
        Payload []int
    }

    // errNegative - manfiy qiymat kelganda ishlatiladigan xato.
    var errNegative = errors.New("manfiy qiymat")

    // process payload'ning uchinchi qiymatini qaytaradi.
    func process(j Job) int {
        if len(j.Payload) > 0 && j.Payload[0] < 0 {
            panic(errNegative)
        }
        return j.Payload[2]
    }

    // recoverJob panic'ni natija qatoriga aylantiradi: run-time panic va oddiy xato farqlanadi.
    func recoverJob(j Job, results chan<- string) {
        r := recover()
        if r == nil {
            return
        }
        switch v := r.(type) {
        case runtime.Error:
            results <- fmt.Sprintf("job %d: panic: %v", j.ID, v)
        case error:
            results <- fmt.Sprintf("job %d: error: %v", j.ID, v)
        default:
            results <- fmt.Sprintf("job %d: panic: %v", j.ID, v)
        }
    }

    func runAll(jobs []Job) []string {
        results := make(chan string, len(jobs))
        var wg sync.WaitGroup
        for _, j := range jobs {
            wg.Add(1)
            go func() {
                defer wg.Done()
                defer recoverJob(j, results)
                results <- fmt.Sprintf("job %d: %d", j.ID, process(j))
            }()
        }
        wg.Wait()
        close(results)

        var out []string
        for s := range results {
            out = append(out, s)
        }
        sort.Strings(out)
        return out
    }

    func main() {
        jobs := []Job{
            {ID: 1, Payload: []int{10, 20, 30}},
            {ID: 2, Payload: []int{5}},
            {ID: 3, Payload: []int{1, 2, 60}},
            {ID: 4},
            {ID: 5, Payload: []int{-1, 0, 0}},
        }
        for _, line := range runAll(jobs) {
            fmt.Println(line)
        }
    }
  solutionNotes: |
    - `defer func() { recoverJob(j, results) }()` da `recover()` ni chaqiruvchi funksiya deferred funksiyaning o'zi emas, ichki chaqiruv. Spetsifikatsiyaga ko'ra bunda `recover()` nil qaytaradi va panic davom etadi. `defer recoverJob(j, results)` da `recoverJob` o'zi deferred funksiya, shuning uchun `recover` to'g'ridan-to'g'ri chaqirilgan hisoblanadi.
    - `j` defer'ning argumenti sifatida defer ifodasi bajarilganda baholanadi (7-dars), shuning uchun har job o'z ma'lumotini ko'radi.
    - `runtime.Error` tipi bo'yicha switch run-time panic'larni (`index out of range`) dasturchi tashlagan `error`dan ajratadi. Tartib muhim: `runtime.Error` ham `error`, shuning uchun u `case error` dan oldin turadi.
    - `defer wg.Done()` `recoverJob` dan oldin e'lon qilingan, ya'ni keyin ishlaydi (LIFO). Natija kanali yopilishidan oldin hamma yozuv tugaydi.
  checklist:
    - "Dastur yiqilmaydi, besh job uchun besh qator chiqadi"
    - "`recover()` deferred funksiyaning o'zida chaqiriladi, ichki funksiya orqali emas"
    - "Run-time panic `panic:`, oddiy xato `error:` prefiksi bilan chiqadi"
    - "`runtime.Error` case'i `error` case'idan oldin turadi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Node.js'da yakunlanmagan exception butun jarayonni yiqitishi mumkin, shuning uchun jamoalar `process.on('uncaughtException')` yoki Express error middleware'ga ishonadi. Go'da muammo boshqacha ko'rinadi, lekin shu darajada og'riqli. Birinchi variant: panic'dan qo'rqib, har joyga `defer recover()` yozish; natijada haqiqiy bug'lar (nil map, indeks xatosi) jimgina yutiladi va servis buzilgan holatda ishlashda davom etadi. Ikkinchi variant: panic'ni exception kabi ishlatish, ya'ni oddiy xatolarni `panic` bilan tashlash va "yuqorida" ushlash; bunda Go'ning asosiy afzalligi, ya'ni xato imzoda ko'rinishi yo'qoladi.

Uchinchi og'riq: goroutine. Bir job ichidagi nil map yozuvi butun servisni, minglab boshqa so'rovlarni yiqitadi, chunki goroutine'dagi panic'ni boshqa goroutine ushlay olmaydi. Production'da bu "bitta buzuq sensor paketi butun ingest servisini o'chirdi" ko'rinishida uchraydi.

Bu darsning vazifasi panic va recover'ning aniq semantikasini (qachon recover nil qaytaradi, nimani ushlay oladi va nimani ushlay olmaydi) tushuntirish va qayerda ishlatish, qayerda ishlatmaslik chegarasini belgilashdir.

## Asosiy g'oya

Spetsifikatsiya (Handling panics) panic'ni shunday tasvirlaydi: funksiya `F` ichida `panic` chaqirilsa yoki run-time panic yuz bersa, `F` ning bajarilishi to'xtaydi. `F` defer qilgan funksiyalar odatdagidek ishlaydi, keyin `F`ni chaqirgan funksiyaning defer'lari va hokazo, goroutine'ning eng yuqori funksiyasigacha. Shundan keyin dastur to'xtaydi va panic qiymati xabar qilinadi. Bu jarayon panicking deb ataladi.

`recover` shu jarayonni to'xtata oladi. Spetsifikatsiyadagi aniq shart: funksiya `G` `D`ni defer qilgan, `D` ichida `recover` chaqirilgan va panic `G` bajarilayotgan goroutine'da yuz bergan bo'lsa, `D` `recover` chaqirgan paytda `recover` panic'ga berilgan qiymatni qaytaradi. `D` yangi panic boshlamasdan normal qaytsa, panic to'xtaydi: `G` bilan panic orasidagi funksiyalarning holati tashlab yuboriladi, normal bajarilish tiklanadi, `G` dan oldin defer qilingan funksiyalar ishlaydi va `G` o'z chaqiruvchisiga qaytadi. Shu sabab nomlangan natija (named result) bilan `defer` ichida `err = ...` yozish panic'ni xatoga aylantirishning standart usuli.

Ikkita muhim kafolat bor:

- `recover` `nil` qaytaradi, agar goroutine panic qilmayotgan bo'lsa **yoki `recover` deferred funksiya tomonidan to'g'ridan-to'g'ri chaqirilmagan bo'lsa**.
- Aksincha, goroutine panic qilayotgan va `recover` deferred funksiya tomonidan to'g'ridan-to'g'ri chaqirilgan bo'lsa, qaytgan qiymat `nil` bo'lmasligi kafolatlanadi. Buni ta'minlash uchun `panic(nil)` run-time panic'ga aylantirilgan. Bu 1-darsdagi `panicnil` GODEBUG sozlamasi va `*runtime.PanicNilError` bilan bog'liq (Go 1.21 dan).

Run-time panic'lar (indeks chegarasidan chiqish, nol bo'lish, nil map'ga yozish) `runtime.Error` interface'ini amalga oshiruvchi qiymat bilan panic chaqirishga teng. Aniq xato qiymatlari spetsifikatsiyada belgilanmagan, shuning uchun matnga emas, tipga tayaning.

### Go blogi: faqat paket ichida

Go blogi (Defer, Panic, and Recover) real misol keltiradi: `encoding/json` paketi interface'ni rekursiv funksiyalar bilan kodlaydi; qiymatni aylanishda xato chiqsa, stekni eng yuqori funksiyagacha ochish uchun `panic` chaqiriladi, u yerda `recover` qilinib, mos `error` qaytariladi. Blog konvensiyani aniq aytadi: kutubxonalarda paket ichida panic ishlatilsa ham, tashqi API aniq error qiymatlarini qaytaradi.

### 100 Go Mistakes: qachon panic

100 Go Mistakes #48 (Panicking) ikkita holatni sanaydi: dasturchi xatosini bildirish (misol: `sql.Register` driver `nil` yoki allaqachon ro'yxatdan o'tgan bo'lsa panic qiladi) va majburiy dependency yaratilmaganda. Qolgan hamma holatda oxirgi qaytarish qiymati sifatida `error` qaytariladi. Code Review Comments ham shuni takrorlaydi: oddiy xato boshqaruvi uchun `panic` ishlatmang.

## Chuqurroq: chegaralar va nozik joylar

### Goroutine chegarasi

Panic jarayoni bitta goroutine'ning chaqiruv stekida yuradi. Boshqa goroutine'dagi `defer` ko'rinmaydi. `go func() { ... }()` ichidagi panic uchun `main`dagi `recover` yordam bermaydi: spetsifikatsiya bo'yicha goroutine'ning eng yuqori funksiyasiga yetgach, dastur to'xtaydi. Shuning uchun fon ishlarini boshlaydigan har bir joyda recover o'z goroutine ichida turishi kerak (quyidagi `Go` yordamchisi).

### net/http server

`http.Handler.ServeHTTP` hujjati: handler panic qilsa, server panic ta'siri faqat shu so'rovga tegishli deb hisoblaydi, uni recover qiladi, stack trace'ni server error log'iga yozadi va ulanishni yopadi yoki (HTTP/2 da) `RST_STREAM` yuboradi. Ya'ni jarayon yiqilmaydi, lekin mijoz aniq 500 emas, uzilgan ulanishni ko'rishi mumkin. Shu sabab ko'p servislar o'z recover middleware'ini yozadi: log, metrika, aniq 500. Hujjatdagi `http.ErrAbortHandler` sentinel panic qiymati handler'ni ataylab to'xtatish uchun: server unda stack trace yozmaydi. Shuning uchun middleware uni qayta panic qilishi mantiqli (quyidagi misolda).

### Qayta panic va chop etish formati

Ushlangan panic'ni qayta uloqtirish (`panic(r)`) begona panic'ni yashirmaslikning standart usuli. Unhandled panic chiqishi versiyalar o'rtasida farq qiladi. Go 1.25 release notes'ga ko'ra, `panic("PANIC")` ni ushlab, asl qiymat bilan qayta panic qilgan dastur ilgari `panic: PANIC [recovered]` va keyingi qatorda `panic: PANIC` chop etardi; Go 1.25 dan boshlab `panic: PANIC [recovered, repanicked]`. Lokal Go 1.24.7 da eski format chiqdi:

```text
panic: PANIC [recovered]
	panic: PANIC
```

Bu faqat diagnostika matni; log tahlilchi regex'laringiz bo'lsa, toolchain yangilanishidan keyin ularni tekshiring.

### Recover ushlay olmaydigan narsalar

`recover` faqat panic'ni ushlaydi. Deadlock (`fatal error: all goroutines are asleep - deadlock!`) panic emas, fatal error: dastur to'xtaydi va `recover` chaqirilmaydi (quyida Go 1.24.7 da tekshirilgan). Boshqa fatal error turlari bu darsda tekshirilmagan, shuning uchun faqat deadlock isbotlangan. Xulosa: recover "hamma narsadan himoya" emas.

## Misol: panic'ni error'ga aylantirish va chegaralash

Birinchi dastur har xil panic manbalarini `runtime.Error` va oddiy `error`dan ajratadi (Go 1.24.7, `go vet`dan o'tgan):

```go
package main

import (
	"errors"
	"fmt"
	"runtime"
)

// protect g ichidagi panic'ni error'ga aylantiradi.
func protect(g func()) (err error) {
	defer func() {
		r := recover()
		if r == nil {
			return
		}
		switch v := r.(type) {
		case runtime.Error:
			err = fmt.Errorf("run-time panic: %w", v)
		case error:
			err = fmt.Errorf("error bilan panic: %w", v)
		default:
			err = fmt.Errorf("panic: %v", v)
		}
	}()
	g()
	return nil
}

func main() {
	var points []int
	var cache map[string]int
	zero := 0

	cases := []struct {
		name string
		fn   func()
	}{
		{"indeks chegarasidan tashqari", func() { _ = points[3] }},
		{"nil map'ga yozish", func() { cache["dut-7"] = 1 }},
		{"nolga bo'lish", func() { _ = 10 / zero }},
		{"matn bilan panic", func() { panic("sensor jadvali buzilgan") }},
		{"error bilan panic", func() { panic(errors.New("migratsiya yakunlanmagan")) }},
		{"panic(nil)", func() { panic(nil) }},
		{"panic yo'q", func() {}},
	}
	for _, c := range cases {
		err := protect(c.fn)
		var re runtime.Error
		fmt.Printf("%-30s -> %v | runtime.Error: %v\n", c.name, err, errors.As(err, &re))
	}
}
```

```text
indeks chegarasidan tashqari   -> run-time panic: runtime error: index out of range [3] with length 0 | runtime.Error: true
nil map'ga yozish              -> run-time panic: assignment to entry in nil map | runtime.Error: true
nolga bo'lish                  -> run-time panic: runtime error: integer divide by zero | runtime.Error: true
matn bilan panic               -> panic: sensor jadvali buzilgan | runtime.Error: false
error bilan panic              -> error bilan panic: migratsiya yakunlanmagan | runtime.Error: false
panic(nil)                     -> run-time panic: panic called with nil argument | runtime.Error: true
panic yo'q                     -> <nil> | runtime.Error: false
```

Kuzatuvlar: indeks, nil map va nolga bo'lish `runtime.Error`; `panic(nil)` ham `runtime.Error` (u `*runtime.PanicNilError`); matn bilan panic oddiy qiymat. `protect` nomlangan natija `err` ga yozadi, shuning uchun funksiya panic'dan keyin ham oddiy qiymat qaytaradi. `case runtime.Error` `case error` dan oldin turgan, aks holda birinchisi hech qachon ishlamas edi.

Endi `recover` to'g'ridan-to'g'ri chaqirilishi sharti:

```go
package main

import "fmt"

// logRecover to'g'ridan-to'g'ri defer qilingan funksiya sifatida recover'ni chaqiradi.
func logRecover(tag string) {
	r := recover()
	fmt.Printf("%s: recover() = %v\n", tag, r)
}

func direct() {
	defer logRecover("direct")
	panic("direct panic")
}

func nested() {
	defer func() {
		// recover bu yerda deferred funksiyaning o'zi tomonidan emas, ichki funksiya orqali chaqiriladi.
		logRecover("nested")
	}()
	panic("nested panic")
}

func main() {
	direct()
	fmt.Println("direct tugadi, dastur davom etmoqda")

	defer func() {
		fmt.Println("main: tashqi recover =", recover())
	}()
	nested()
	fmt.Println("bu qator bajarilmaydi")
}
```

```text
direct: recover() = direct panic
direct tugadi, dastur davom etmoqda
nested: recover() = <nil>
main: tashqi recover = nested panic
```

`direct`: `defer logRecover("direct")` da `logRecover` o'zi deferred funksiya, shuning uchun panic ushlanadi. `nested`: `recover()` anonim deferred funksiya chaqirgan `logRecover` ichida, shuning uchun `nil` qaytadi, panic davom etadi va faqat `main`dagi tashqi `recover` uni ushlaydi. Bu klassik tuzoq: "recover'ni yordamchiga chiqarib qo'ydim" va panic ushlanmay qoladi.

Fon ishlari uchun yordamchi: panic faqat o'sha ishni yiqitadi.

```go
package main

import (
	"fmt"
	"runtime/debug"
	"sync"
)

// Go fn'ni alohida goroutine'da ishga tushiradi; panic bo'lsa, jarayonni emas, faqat shu ishni yiqitadi.
func Go(wg *sync.WaitGroup, fn func(), onPanic func(v any, stack []byte)) {
	wg.Add(1)
	go func() {
		defer wg.Done()
		defer func() {
			if v := recover(); v != nil {
				onPanic(v, debug.Stack())
			}
		}()
		fn()
	}()
}

func main() {
	var wg sync.WaitGroup
	var mu sync.Mutex
	failed := map[string]any{}

	for _, id := range []string{"dut-1", "dut-2", "dut-3"} {
		Go(&wg, func() {
			if id == "dut-2" {
				var m map[string]int
				m[id] = 1 // nil map'ga yozish
			}
		}, func(v any, stack []byte) {
			mu.Lock()
			defer mu.Unlock()
			failed[id] = v
			fmt.Printf("%s: %v (stack uzunligi > 0: %v)\n", id, v, len(stack) > 0)
		})
	}
	wg.Wait()
	fmt.Println("yiqilgan ishlar:", len(failed))
}
```

```text
dut-2: assignment to entry in nil map (stack uzunligi > 0: true)
yiqilgan ishlar: 1
```

`dut-2` nil map'ga yozdi, qolgan ikki job muammosiz tugadi. Callback'ga stek ham beriladi (`debug.Stack`): `recover` faqat panic qiymatini qaytaradi, stek kerak bo'lsa uni deferred funksiya ichida olish kerak. Unutmang: bunday yordamchi ishni jim yutmasligi kerak, `onPanic` log va metrika yuborishi lozim.

HTTP middleware (`ErrAbortHandler`ni qayta panic qiladi):

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
)

// Recover handler ichidagi panic'ni 500 javobga aylantiradi.
func Recover(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if v := recover(); v != nil {
				if v == http.ErrAbortHandler {
					panic(v) // server buni o'zi tinch qayta ishlaydi
				}
				log.Printf("panic %s %s: %v", r.Method, r.URL.Path, v)
				http.Error(w, "internal error", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func main() {
	log.SetFlags(0)
	log.SetOutput(os.Stdout)

	mux := http.NewServeMux()
	mux.HandleFunc("/ok", func(w http.ResponseWriter, r *http.Request) { fmt.Fprintln(w, "ok") })
	mux.HandleFunc("/boom", func(w http.ResponseWriter, r *http.Request) {
		var vehicles map[int]string
		vehicles[1] = "truck"
	})

	h := Recover(mux)
	for _, path := range []string{"/ok", "/boom"} {
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, path, nil))
		fmt.Printf("%s -> %d\n", path, rec.Code)
	}
}
```

```text
/ok -> 200
panic GET /boom: assignment to entry in nil map
/boom -> 500
```

Ichki panic'ni parser ichida ishlatib, tashqarida error qaytarish (Go blogidagi json naqshi):

```go
package main

import (
	"fmt"
	"strconv"
	"strings"
)

// Point - GPS nuqtasi.
type Point struct{ Lat, Lon float64 }

// parseError ichki panic uchun yopiq tip: paket tashqarisiga chiqmaydi.
type parseError struct{ err error }

func must(f float64, err error) float64 {
	if err != nil {
		panic(parseError{err})
	}
	return f
}

func parsePoint(s string) Point {
	parts := strings.Split(s, ",")
	if len(parts) != 2 {
		panic(parseError{fmt.Errorf("kutilgan 'lat,lon', olindi %q", s)})
	}
	return Point{
		Lat: must(strconv.ParseFloat(strings.TrimSpace(parts[0]), 64)),
		Lon: must(strconv.ParseFloat(strings.TrimSpace(parts[1]), 64)),
	}
}

// ParsePoint tashqi API: panic ishlatadi, lekin faqat error qaytaradi.
func ParsePoint(s string) (p Point, err error) {
	defer func() {
		if r := recover(); r != nil {
			pe, ok := r.(parseError)
			if !ok {
				panic(r) // o'zimiznikiga o'xshamagan panic'ni yashirmaymiz
			}
			err = pe.err
		}
	}()
	return parsePoint(s), nil
}

func main() {
	for _, in := range []string{"41.3111, 69.2797", "41.31", "41.3x, 69.2"} {
		p, err := ParsePoint(in)
		fmt.Printf("%-18q -> %+v, err: %v\n", in, p, err)
	}
}
```

```text
"41.3111, 69.2797" -> {Lat:41.3111 Lon:69.2797}, err: <nil>
"41.31"            -> {Lat:0 Lon:0}, err: kutilgan 'lat,lon', olindi "41.31"
"41.3x, 69.2"      -> {Lat:0 Lon:0}, err: strconv.ParseFloat: parsing "41.3x": invalid syntax
```

`parseError` yopiq tip, shuning uchun `ParsePoint` faqat o'zining panic'ini error'ga aylantiradi. Begona panic (masalan, kodga kiritilgan bug) `panic(r)` bilan qayta uloqtiriladi va yashirinmaydi.

Deadlock'ni `recover` ushlay olmasligi (kod):

```go
package main

import "fmt"

func main() {
	defer func() {
		fmt.Println("recover:", recover())
	}()
	ch := make(chan int)
	<-ch // hech kim yubormaydi
}
```

```text
fatal error: all goroutines are asleep - deadlock!

goroutine 1 [chan receive]:
main.main()
```

Go 1.24.7 da `recover:` qatori umuman chop etilmadi; dastur 2 bilan tugadi. Stek yo'li qisqartirilgan.

## Qachon qo'llamaslik kerak

- Oddiy xato holati uchun panic ishlatmang: noto'g'ri kiritish, topilmagan yozuv, vaqtinchalik tarmoq nosozligi `error` qaytaradi (31-32 darslar).
- Kutubxona ichida chegarasiz recover qilmang. Har bir ochiq funksiyada `defer func() { recover() }()` bug'larni yashiradi. Faqat o'zingizning yopiq panic tipingizni ushlang, qolganini qayta uloqtiring.
- Buzilgan holatdan davom etmang. Spetsifikatsiya recover'dan keyin panic va `G` orasidagi funksiyalar holati tashlab yuborilishini aytadi; lekin umumiy ob'ektlar (cache, mutex bilan himoyalangan struct) yarim yangilangan bo'lishi mumkin. Bu muallifning amaliy bahosi: invariantni tiklay olmasangiz, jarayonni yiqitib, supervisor (Kubernetes, systemd) qayta ishga tushirgani yaxshiroq.
- Panic'ni boshqaruv oqimi sifatida paketlar o'rtasida ishlatmang: chaqiruvchi funksiya imzosidan xato bo'lishini bilmaydi.
- `recover`ni test kodida muvaffaqiyatni yashirish uchun ishlatmang. Panic kutiladigan holatni testda aniq tekshiring.
- `Must` funksiyalaridan faqat ishga tushishda foydalaning (`regexp.MustCompile` bilan doimiy ifodalar). Foydalanuvchi kiritgan ifoda uchun `Compile` va error.

## Stack'da: Node.js/TypeScript bilan solishtirish

- JS'da exception boshqaruv oqimi uchun keng ishlatiladi (`throw new NotFoundError()`), Go'da shu rolni `error` qiymati bajaradi. Panic JS'dagi "dastur xatosi" (TypeError, RangeError) ga yaqinroq: undefined'dan o'qish, indeks xatosi.
- `process.on('uncaughtException')` global tutqich edi; Go'da bunday global hook yo'q. Chegaralarni o'zingiz qo'yasiz: HTTP middleware, worker tsikli, `Go` yordamchisi.
- Express/Nest filter'larida bitta so'rov xatosi boshqalarga tegmaydi; Go'da buni `net/http` server o'zi ta'minlaydi (handler panic'i izolyatsiya qilinadi), lekin handler boshlagan o'z goroutine'laringiz uchun bu kafolat yo'q.
- Kubernetes sharoitida "yiqilib qayta ishga tushish" ko'pincha buzilgan holatda ishlashdan yaxshiroq, ayniqsa yozish operatsiyalarida; lekin bu har servis uchun alohida baholanadigan arxitektura qarori.

## Xulosa

- Panic goroutine stekini ochadi, defer'larni ishga tushiradi va recover qilinmasa dasturni to'xtatadi; recover faqat shu goroutine'dagi panic'ni, faqat deferred funksiya o'zi to'g'ridan-to'g'ri chaqirganda ushlaydi.
- Run-time panic'lar `runtime.Error`; `panic(nil)` Go 1.21 dan `*runtime.PanicNilError`ga aylangan va recover endi nil qaytarmaydi (go.mod `go 1.20` yoki `panicnil=1` bundan mustasno).
- Har goroutine o'z ichida recover qilsin; `net/http` handler panic'ini o'zi izolyatsiya qiladi, lekin o'z middleware'ingiz log, metrika va aniq 500 beradi.
- Panic'ni faqat dasturchi xatosi va majburiy dependency uchun ishlating; paket ichida ishlatilsa ham, tashqi API `error` qaytarsin va faqat o'z yopiq panic tipini ushlasin.
- Deadlock kabi fatal error'lar recover bilan ushlanmaydi.
- Qayta panic chop etish formati Go 1.25 da o'zgargan (`[recovered, repanicked]`); log tahlilingizni toolchain yangilanishida tekshiring.
