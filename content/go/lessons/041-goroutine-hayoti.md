---
n: 41
slug: goroutine-hayoti
title: "Goroutine hayoti va leak: goroutineleak profili"
summary: "go statement spetsifikatsiya bo'yicha nima qiladi, goroutine qachon tugaydi, goroutine leak qanday paydo bo'ladi va uni pprof hamda Go 1.26-1.27 dagi goroutineleak profili bilan qanday topish mumkin."
duration: 40
sources:
  - id: go-spec
    note: "Go statements va Program execution bo'limlari: go ifodasi, argumentlarning baholanishi, main tugaganda dastur chiqishi"
  - id: go127
    note: "Runtime bo'limidagi Goroutine leak profile: goroutineleak profili, GC asosidagi aniqlash, chegaralari"
  - id: 100go
    note: "Concurrency boblari: goroutine qachon to'xtashini bilmay ishga tushirish xatosi"
  - id: blog-pipelines
    note: "Cleaning up / leak qismi: goroutine'lar GC qilinmaydi, stack'dagi havolalar ma'lumotni ushlab turadi"
quiz:
  - q: "firstResponse(3) buferlanmagan kanal bilan uchta goroutine ishga tushiradi, chaqiruvchi esa bitta qiymat o'qiydi. Har chaqiruvdan keyin nechta goroutine abadiy bloklanib qoladi?"
    options:
      - "Hech biri: goroutine tugagach runtime uni o'zi tozalaydi"
      - "Bitta: faqat eng sekin goroutine"
      - "Ikkita: qiymati o'qilmagan har bir yuboruvchi `ch <-` da qotib qoladi"
      - "Uchtasi ham, chunki kanal yopilmagan"
    answer: 2
    explain: "Bitta qiymat o'qiladi, qolgan ikki goroutine yuborishga urinadi va qabul qiluvchi hech qachon kelmaydi. Runtime bloklangan goroutine'ni o'zi tugatmaydi. Birinchi variant noto'g'ri: goroutine'lar GC qilinmaydi."
  - q: "main funksiyasi tugadi, lekin beshta goroutine hali ishlayapti. Spetsifikatsiyaga ko'ra nima bo'ladi?"
    options:
      - "Dastur chiqadi va boshqa goroutine'larni kutmaydi"
      - "Dastur barcha goroutine'lar tugaguncha kutadi"
      - "Dastur defer'lari bajarilguncha kutadi, so'ng goroutine'larni to'xtatadi"
      - "Natija GOMAXPROCS qiymatiga bog'liq"
    answer: 0
    explain: "Program execution bo'limi: main qaytganda dastur chiqadi va main bo'lmagan goroutine'larning tugashini kutmaydi. Shu sabab goroutine'ning natijasi kerak bo'lsa, uni WaitGroup yoki kanal bilan kutish shart."
  - q: "Go 1.27 da goroutineleak profili qaysi turdagi leak'ni topa olmasligi mumkin?"
    options:
      - "Buferlanmagan kanalda yuborishda bloklangan goroutine"
      - "sync.Mutex da bloklangan goroutine"
      - "sync.Cond.Wait da bloklangan goroutine"
      - "Global o'zgaruvchi orqali yetib borish mumkin bo'lgan kanalda bloklangan goroutine"
    answer: 3
    explain: "Aniqlash GC'dagi yetib borish tahliliga asoslangan: kanal global o'zgaruvchidan yoki ishlayotgan goroutine'ning lokal o'zgaruvchisidan yetib borsa, runtime uni 'hali ochilishi mumkin' deb hisoblaydi. Kanal, Mutex va Cond kutishlarini release notes aniq sanaydi."
  - q: "Quyidagi tuzatishlardan qaysi biri `firstResponse` dagi leak'ni to'liq yo'qotadi (n ta yuboruvchi, bitta qabul qiluvchi)?"
    options:
      - "Kanal sig'imini 1 qilish"
      - "Kanal sig'imini n qilish"
      - "Yuboruvchi goroutine ichida recover() chaqirish"
      - "firstResponse oxirida runtime.GC() chaqirish"
    answer: 1
    explain: "Sig'im n bo'lsa har bir yuboruvchi qiymatini buferga qo'yib chiqib ketadi. Sig'im 1 bo'lsa n=3 da hali bitta yuboruvchi qotadi. recover() bloklanishga ta'sir qilmaydi, runtime.GC() esa bloklangan goroutine'ni tugatmaydi. Yaxshiroq yechim: kontekst bilan bekor qilishni ham qo'shish."
  - q: "Go 1.26 va Go 1.27 dagi goroutineleak profili haqida qaysi gap to'g'ri?"
    options:
      - "Ikkalasida ham default yoqilgan"
      - "1.26 da GOEXPERIMENT=goroutineleakprofile bilan tajriba sifatida, 1.27 da umumiy foydalanishga chiqqan"
      - "1.26 da umumiy foydalanishga chiqqan, 1.27 da olib tashlangan"
      - "Faqat net/http/pprof orqali ishlaydi, runtime/pprof da yo'q"
    answer: 1
    explain: "1.26 release notes uni eksperiment deydi va GOEXPERIMENT=goroutineleakprofile talab qilinadi. 1.27 notes: profil umumiy foydalanishga chiqqan, goroutineleakprofile GOEXPERIMENT sozlamasi o'chirilgan. Profil runtime/pprof paketida ham, net/http/pprof endpoint sifatida ham mavjud."
  - q: "Servisda goroutine soni doimiy yuk ostida bir necha soat ichida sekin o'sib bormoqda. Birinchi qadam nima bo'lishi kerak?"
    options:
      - "GOMAXPROCS ni oshirish"
      - "Kanal sig'imlarini hamma joyda 1000 qilish"
      - "Goroutine profilini olib, bir xil stack'li guruhlardan qaysi birining soni o'sayotganini ko'rish"
      - "Servisni har soatda qayta ishga tushirishni rejalashtirish"
    answer: 2
    explain: "pprof goroutine profili bir xil stack'dagi goroutine'larni guruhlaydi: o'sayotgan guruh leak joyini ko'rsatadi. GOMAXPROCS parallellikka ta'sir qiladi, leak'ga emas. Katta bufer muammoni yashiradi, qayta ishga tushirish esa sababni ochmaydi."
task:
  title: "firstResponse dagi goroutine leak'ni tuzatish"
  prompt: |
    `firstResponse(n)` n ta replikaga parallel so'rov yuboradi va eng tez javobni qaytaradi. Dastur 50 marta chaqiradi va oxirida sizib chiqqan goroutine'lar sonini hisoblaydi.

    Muammo: kanal buferlanmagan, shuning uchun har chaqiruvdan keyin `n-1` ta goroutine `ch <-` da abadiy qotib qoladi. `main` oxirida sizib chiqqan goroutine'lar soni 0 bo'lmasa, dastur 1 kod bilan chiqadi.

    `firstResponse`ni tuzating: funksiya imzosini va `fetchReplica` ni o'zgartirmang, natija hamon `replika-1` bo'lsin. `go run -race` bilan ham tekshiring.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "runtime"
        "time"
    )

    // fetchReplica replikadan javob oladi: id katta bo'lsa sekinroq.
    func fetchReplica(id int) string {
        time.Sleep(time.Duration(id) * 5 * time.Millisecond)
        return fmt.Sprintf("replika-%d", id)
    }

    // firstResponse n ta replikaga so'rov yuboradi va eng tez javobni qaytaradi.
    func firstResponse(n int) string {
        ch := make(chan string)
        for i := 1; i <= n; i++ {
            go func() { ch <- fetchReplica(i) }()
        }
        return <-ch
    }

    func main() {
        base := runtime.NumGoroutine()
        var got string
        for range 50 {
            got = firstResponse(4)
        }
        time.Sleep(150 * time.Millisecond)

        leaked := runtime.NumGoroutine() - base
        fmt.Println("javob:", got, "| sizib chiqqan goroutine:", leaked)
        if got != "replika-1" || leaked != 0 {
            os.Exit(1)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "os"
        "runtime"
        "time"
    )

    // fetchReplica replikadan javob oladi: id katta bo'lsa sekinroq.
    func fetchReplica(id int) string {
        time.Sleep(time.Duration(id) * 5 * time.Millisecond)
        return fmt.Sprintf("replika-%d", id)
    }

    // firstResponse n ta replikaga so'rov yuboradi va eng tez javobni qaytaradi.
    func firstResponse(n int) string {
        ch := make(chan string, n) // sig'im = yuboruvchilar soni
        for i := 1; i <= n; i++ {
            go func() { ch <- fetchReplica(i) }()
        }
        return <-ch
    }

    func main() {
        base := runtime.NumGoroutine()
        var got string
        for range 50 {
            got = firstResponse(4)
        }
        time.Sleep(150 * time.Millisecond)

        leaked := runtime.NumGoroutine() - base
        fmt.Println("javob:", got, "| sizib chiqqan goroutine:", leaked)
        if got != "replika-1" || leaked != 0 {
            os.Exit(1)
        }
    }
  solutionNotes: |
    - Kanal sig'imi yuboruvchilar soniga (`n`) teng: har bir goroutine natijasini buferga qo'yib, kutmasdan tugaydi. Qabul qiluvchi faqat birinchisini oladi, qolganlari buferda qoladi va kanal bilan birga GC qilinadi.
    - Sig'im `n` qanday topiladi: har bir yuboruvchi aynan bitta qiymat yuboradi, demak jami yuborishlar soni oldindan ma'lum. Yuborishlar soni noma'lum bo'lsa, bu yechim ishlamaydi va kontekst bilan bekor qilish kerak.
    - Sekin replikalar tugamaguncha ishlashda davom etadi (bu yechimda ularni bekor qilmaymiz). Ularni ham to'xtatish uchun `context.WithCancel` qo'shing va `fetchReplica` ga kontekst bering, lesson misolidagi `firstResponse` kabi.
    - Tekshiruv usuli: `runtime.NumGoroutine()` farqi. Bu usul testda qulay, lekin production'da sanash uchun goroutine profili ishonchliroq.
  checklist:
    - "`go run -race` ogohlantirishsiz o'tadi va chiqish kodi 0"
    - "Natija `replika-1` bo'lib qoladi"
    - "Sizib chiqqan goroutine'lar soni 0"
    - "Funksiya imzosi va `fetchReplica` o'zgarmagan"
    - "Nega sig'im aynan `n` ekanini izohlay olasiz"
---

## Muammo

Telemetriya qabul qiluvchi servisni tasavvur qiling. Har kelgan GPS paketi uchun bir nechta goroutine ishga tushadi: biri geokodlash servisiga so'rov yuboradi, biri bazaga yozadi, biri xabarni kuzatuvchilarga uzatadi. Yuk sinovida hammasi yaxshi. Production'da esa uch kundan keyin servisning xotirasi sekin o'sa boshlaydi, bir haftadan keyin OOM bilan o'ladi. CPU grafigida hech narsa yo'q, xatolar logida ham. Sababi: har kuni yuz minglab goroutine bironta kanalda, mutex'da yoki WaitGroup'da qotib qoladi va hech qachon tugamaydi.

Bu goroutine leak. Node.js'dan kelgan dasturchi uchun u noodatiy tuyuladi. JavaScript'da hech qachon hal bo'lmaydigan Promise unga hech kim havola saqlamasa, boshqa obyektlar kabi GC tomonidan yig'ib olinadi. Go'da goroutine GC uchun "ildiz" (root) hisoblanadi: u tugamaguncha uning stack'i va stack'dagi havolalar bilan ushlangan barcha ma'lumot xotirada turadi. Go Blog'dagi pipeline maqolasi buni to'g'ridan-to'g'ri aytadi: goroutine'lar GC qilinmaydi, ular o'zlari chiqib ketishi kerak.

Bu darsda go statement spetsifikatsiyada nimani va'da qilishini, goroutine qachon tugashini, leak qanday paydo bo'lishini va uni topish vositalarini ko'ramiz. Oxirgisiga Go 1.26 da eksperiment sifatida kirgan va Go 1.27 da umumiy foydalanishga chiqqan `goroutineleak` profili ham kiradi.

## Asosiy g'oya

### go statement nimani kafolatlaydi

Spetsifikatsiya `go` ifodasini shunday ta'riflaydi: u funksiya chaqiruvini mustaqil boshqaruv oqimi, ya'ni goroutine sifatida ishga tushiradi. Uch muhim detal bor:

- Funksiya qiymati va argumentlar odatdagidek, chaqiruvchi goroutine'da baholanadi. Faqat funksiyaning tanasi yangi goroutine'da bajariladi. Shu sabab `go log(time.Now())` da vaqt ishga tushirilgan lahzada olinadi, goroutine boshlangan lahzada emas.
- Funksiya tugaganda goroutine ham tugaydi. Funksiya qiymat qaytarsa, u tashlab yuboriladi: goroutine'dan natija olishning yagona yo'li kanal, umumiy xotira yoki WaitGroup bilan birga yozilgan o'zgaruvchi.
- Goroutine'ga havola, ID yoki "join" operatsiyasi yo'q. Uni tashqaridan to'xtatib bo'lmaydi. To'xtatishning yagona yo'li: goroutine o'zi to'xtash sharti haqida xabar oladi (kontekst, yopilgan kanal, flag).

Ikkinchi qoida "Program execution" bo'limida: dastur `main` qaytganda chiqadi va boshqa goroutine'larning tugashini kutmaydi. Demak, `go f()` yozib, natijani kutmaslik "ishlab ketadi" degani emas: `main` tugasa f ham yo'qoladi, hatto yarim yo'lda bo'lsa ham.

Uchinchisi spetsifikatsiyada alohida bo'lim emas, lekin amalda muhim: goroutine ichidagi ushlanmagan panic butun dasturni tushiradi. Quyidagi kichik dasturda (`nil` map'ga yozish) goroutine'ning o'z `defer`i bajariladi, so'ng dastur panic bilan tugaydi, `main`ning `defer`i esa ishlamaydi. Shu mashinada (Go 1.24.7) dastur chiqish kodi 2 bilan tugadi. Shuning uchun uzoq yashaydigan goroutine'larda `recover` strategiyasi kerak (33-dars).

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	defer fmt.Println("main defer: bajarilmaydi")
	go func() {
		defer fmt.Println("goroutine defer: bajariladi")
		var m map[string]int
		m["x"] = 1 // nil map'ga yozish: panic
	}()
	time.Sleep(100 * time.Millisecond)
	fmt.Println("bu qatorga yetilmaydi")
}
```

```text
goroutine defer: bajariladi
panic: assignment to entry in nil map
...
```

Matndagi `...` o'rnida stack trace chiqadi; yo'llar va manzillar mashinaga bog'liq.

### Goroutine qachon tugamaydi

Goroutine uch holatda tugaydi: funksiya qaytadi, `runtime.Goexit` chaqiriladi yoki dastur tugaydi. Leak: funksiya hech qachon qaytmaydigan goroutine. Ko'pincha u quyidagi kutishlardan birida qotadi:

| Kutish joyi | Odatiy sabab |
|---|---|
| `ch <- v` | Qabul qiluvchi ketib qolgan (erta `return`, timeout, xato) |
| `<-ch` yoki `range ch` | Yuboruvchi kanalni yopmasdan chiqib ketgan |
| `wg.Wait()` | `Add` va `Done` soni mos kelmaydi |
| `mu.Lock()` | Kimdir `Unlock` qilmagan (masalan, `defer` unutilgan) |
| `cond.Wait()` | Signal yuboradigan goroutine yo'q |
| Cheksiz `for { select {...} }` | `ctx.Done()` yoki `quit` shoxi yo'q |

Birinchi qator eng ko'p uchraydi. 100 Go Mistakes kitobining concurrency bobi aynan shu xatoni alohida qayd etadi: goroutine ishga tushirishdan oldin "u qachon to'xtaydi?" degan savolga javob bo'lishi kerak. Bu darsning amaliy qoidasi ham shu.

### Leak nimaga olib keladi

Qotib qolgan goroutine faqat o'z stack'ini egallamaydi. Uning stack'idagi havolalar (so'rov obyekti, buferlar, ulanishlar) ham GC'dan himoyalangan bo'ladi. Pipeline maqolasi buni alohida ta'kidlaydi: goroutine stack'idagi heap havolalari ma'lumotni yig'ishdan to'sadi. Shu sabab leak odatda sekin xotira o'sishi sifatida seziladi va ko'pincha katta so'rov obyektlari bilan birga tarqaladi.

## Chuqurroq: leak'ni topish va oldini olish

### Eng oddiy signal: goroutine soni

`runtime.NumGoroutine()` joriy goroutine'lar sonini qaytaradi. Testda "funksiya chaqirilishidan oldin va keyin son bir xil" tekshiruvi sodda va ishonchli. Production'da bu son foydali metrika, lekin faqat o'sish tendensiyasini ko'rsatadi, joyini emas.

### pprof goroutine profili

`runtime/pprof` ning `goroutine` profili barcha goroutine'larning stack'ini beradi. `debug=1` bir xil stack'larni guruhlaydi va sonini yozadi, `debug=2` har goroutine'ni holati bilan (`[chan send]`, `[select]`, `[sync.RWMutex.RLock]`) alohida chiqaradi. Leak qidirishda bu holat belgisi eng foydali maslahat: minglab goroutine'ning hammasi bir xil `chan send` stack'ida turgan bo'lsa, sabab o'sha kod qatorida. Misol keyingi bo'limda.

### goroutineleak profili (Go 1.26 eksperiment, Go 1.27 umumiy)

Release notes bu profilni shunday tavsiflaydi. Leak qilgan goroutine: kanal, `sync.Mutex`, `sync.Cond` kabi concurrency primitivida bloklangan va shu primitiv hech qachon ochilmasligi aniq bo'lgan goroutine. Runtime buni garbage collector yordamida aniqlaydi: goroutine G primitiv P da bloklangan, P esa ishlayotgan goroutine'lardan va ularning ochishi mumkin bo'lgan goroutine'lardan yetib bo'lmaydigan bo'lsa, G hech qachon uyg'onmaydi.

Versiyalar:

- Go 1.26: `runtime/pprof` paketida `goroutineleak` nomli yangi profil turi, faqat build vaqtida `GOEXPERIMENT=goroutineleakprofile` bilan yoqiladi. Shunda `net/http/pprof` da `/debug/pprof/goroutineleak` endpoint'i ham paydo bo'ladi. Notes ta'kidlaydi: implementatsiya production'ga tayyor, tajriba maqomi faqat API (yangi profil turi sifatida) bo'yicha fikr yig'ish uchun, va profil faol ishlatilmaguncha qo'shimcha overhead bermaydi.
- Go 1.27: profil umumiy foydalanishga chiqqan, `goroutineleakprofile` GOEXPERIMENT sozlamasi o'chirilgan. Endpoint `/debug/pprof/goroutineleak` saqlangan.

Chegaralari ham notes'da yozilgan. Yetib borish tahliliga asoslangani uchun hamma leak topilmaydi. Global o'zgaruvchi orqali yetib boriladigan primitivda yoki ishlayotgan goroutine'ning lokal o'zgaruvchisida bloklanish aniqlanmay qolishi mumkin. Boshqacha aytganda, profil "leak yo'q" deb kafolat bermaydi: topilgan leak haqiqiy, topilmagani ishonch emas.

Quyidagi kod uslubi 1.27 hujjatiga tayanadi va lokal kompilyatsiya qilinmagan (sandbox'da Go 1.24.7 bor, bu profil esa yangi). Natijani bu yerda ko'rsatmaymiz: chiqish formati sizning toolchain'ingiz bilan farq qilishi mumkin va biz uni tekshira olmadik.

```go
package main

import (
	"os"
	"runtime/pprof"
)

// dumpLeaks Go 1.27+ da sizib chiqqan goroutine'larni stdout'ga yozadi.
// Go 1.26 da shu kod GOEXPERIMENT=goroutineleakprofile bilan qurilganda ishlaydi.
func dumpLeaks() error {
	return pprof.Lookup("goroutineleak").WriteTo(os.Stdout, 1)
}

func main() {
	_ = dumpLeaks()
}
```

Release notes keltirgan real leak misoli bizning `firstResponse` ga o'xshaydi: ishchi goroutine'lar natijani buferlanmagan kanalga yozadi, chaqiruvchi esa birinchi xatoda erta qaytadi. Kanalga boshqa hech kim yeta olmaydi, shuning uchun runtime qolgan goroutine'larni leak deb belgilaydi.

## Misol: first response leak'i va uning tuzatilishi

Birinchi dastur bitta xatoga ega: kanal buferlanmagan. Eng tez javobni qaytaradigan funksiya `n` ta replikaga so'rov yuboradi. Birinchi javob olingach funksiya qaytadi, qolgan ikkita goroutine esa yuborishda qotadi. Bu kod goroutine leak'ga ega.

```go
package main

import (
	"fmt"
	"runtime"
	"time"
)

// queryReplica replika javobini simulyatsiya qiladi: id katta bo'lsa sekinroq.
func queryReplica(id int) string {
	time.Sleep(time.Duration(id) * 10 * time.Millisecond)
	return fmt.Sprintf("replika-%d", id)
}

// firstResponse eng tez javobni qaytaradi. Kanal buferlanmagan:
// sekin goroutine'lar yuborishda abadiy bloklanadi.
func firstResponse(n int) string {
	ch := make(chan string)
	for i := 1; i <= n; i++ {
		go func() { ch <- queryReplica(i) }()
	}
	return <-ch
}

func main() {
	before := runtime.NumGoroutine()
	for range 100 {
		firstResponse(3)
	}
	time.Sleep(200 * time.Millisecond)
	fmt.Println("boshida:", before)
	fmt.Println("oxirida:", runtime.NumGoroutine())
}
```

Natija (Go 1.24.7, linux/amd64, `go run -race`):

```text
boshida: 1
oxirida: 201
```

100 chaqiruv, har birida 2 ta leak: 200 ta qotib qolgan goroutine. `time.Sleep` sekin replikalar yuborishga urinishi uchun vaqt beradi; raqam deterministik, chunki har bir sekin goroutine albatta bloklanadi. Goroutine profilini `debug=2` bilan olsak, holat aniq ko'rinadi:

```go
package main

import (
	"os"
	"runtime/pprof"
	"time"
)

func main() {
	ch := make(chan string)
	for range 3 {
		go func() { ch <- "javob" }()
	}
	time.Sleep(50 * time.Millisecond)
	pprof.Lookup("goroutine").WriteTo(os.Stdout, 2)
}
```

```text
goroutine 6 [chan send]:
main.main.func1()
	.../l41c/main.go:12 +0x1e
created by main.main in goroutine 1
```

Stack'da `[chan send]` va aynan yuborish qatori turibdi: qaysi kanal va qaysi qator ekanini darrov bilamiz. Manzillar va fayl yo'li sizning mashinangizda boshqacha bo'ladi.

Tuzatilgan variant ikkita ish qiladi. Birinchisi, kanal sig'imi `n`: yuboruvchilar hech qachon bloklanmaydi. Ikkinchisi, kontekst: birinchi javob kelgach funksiya `defer cancel()` bilan qolgan so'rovlarni to'xtatadi, ya'ni keraksiz ishni ham tugatadi. Kontekst (34-dars) bekor qilish signalini goroutine'ga yetkazishning standart yo'li.

```go
package main

import (
	"context"
	"fmt"
	"runtime"
	"time"
)

func queryReplica(ctx context.Context, id int) (string, error) {
	select {
	case <-time.After(time.Duration(id) * 10 * time.Millisecond):
		return fmt.Sprintf("replika-%d", id), nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}

type result struct {
	val string
	err error
}

// firstResponse: kanal sig'imi n, shuning uchun yuboruvchi hech qachon bloklanmaydi,
// ctx esa sekin so'rovlarni bekor qiladi.
func firstResponse(ctx context.Context, n int) (string, error) {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	ch := make(chan result, n)
	for i := 1; i <= n; i++ {
		go func() {
			v, err := queryReplica(ctx, i)
			ch <- result{v, err}
		}()
	}
	r := <-ch
	return r.val, r.err
}

func main() {
	before := runtime.NumGoroutine()
	for range 100 {
		if _, err := firstResponse(context.Background(), 3); err != nil {
			fmt.Println("xato:", err)
		}
	}
	time.Sleep(200 * time.Millisecond)
	fmt.Println("boshida:", before)
	fmt.Println("oxirida:", runtime.NumGoroutine())
}
```

```text
boshida: 1
oxirida: 1
```

Tuzatishning ikki qismi bir-biridan mustaqil. Buferli kanal faqat leak'ni yo'qotadi, lekin sekin so'rovlar tugaguncha resurs yeb turadi. Faqat kontekstli versiya, lekin buferlanmagan kanal bilan, `queryReplica` bekor qilingach ham `ch <-` da qotib qolgan bo'lardi: `ctx.Done()` yuborishga ta'sir qilmaydi. Shu sabab ikkalasi birga qo'llangan.

## Qachon qo'llamaslik kerak

Goroutine har doim javob emas va leak'ni topish vositalari ham cheklangan:

- Oddiy ketma-ket ishni goroutine bilan o'rash xarajat va murakkablik qo'shadi, foyda bermaydi. Bitta qisqa funksiya uchun goroutine ishga tushirib, darhol kutish ma'nosiz.
- Bufer sig'imini "kattaroq qilib qo'yaman" yo'li bilan leak'dan qutulishga urinmang. Sig'im 1000 qilingan kanal leak'ni 1001-chi yuborishgacha yashiradi. Sig'imni aniq hisoblanadigan holatda (yuboruvchilar soni ma'lum) ishlating.
- `runtime.NumGoroutine()` ni qat'iy test sharti qilishda ehtiyot bo'ling. Boshqa kutubxonalar fon goroutine'lari ishga tushirishi mumkin, shuning uchun absolyut son emas, farq tekshiriladi va fon goroutine'lar tugashiga bir oz vaqt beriladi. Bu testlar vaqtga bog'liq bo'ladi: tizimli yechim 50-darsda.
- `goroutineleak` profiliga "leak yo'q" kafolati sifatida tayanmang. Notes uning chegaralarini ochiq yozgan. Go 1.25 va undan eski toolchain'larda profil umuman yo'q: u 1.26 da GOEXPERIMENT bilan, 1.27 da default mavjud.
- Qotib qolgan goroutine har doim leak emas. Doimiy ishlashi kerak bo'lgan worker `for range jobs` da kutib turishi normal; muammo faqat uni to'xtatish yo'li yo'q bo'lganda.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da bitta event loop bor, "fon ish" esa Promise va callback bilan ifodalanadi. Hal bo'lmaydigan Promise va unga havola yo'q holatda hamma narsa GC qilinadi. Shuning uchun Node.js'da leak odatda boshqacha ko'rinadi: ochiq socket, tugamagan `setInterval`, o'sib borayotgan Map. Go'da esa goroutine'ning o'zi leak manbai.

Taqqoslash jadvali:

| Node.js | Go |
|---|---|
| `AbortController` va `signal` | `context.Context` va `ctx.Done()` |
| `Promise.race([...])` qolganlarini to'xtatmaydi | `firstResponse` ham qolganlarini o'zi to'xtatmaydi: kontekst kerak |
| `process.exit()` kutilayotgan ishni tashlab ketadi | `main` qaytishi goroutine'larni kutmaydi |

`Promise.race` bilan taqqoslash ayniqsa foydali: ikkalasida ham yutqazganlar ishini davom ettiradi, farqi shundaki Go'da ularning natijasini yuborishga urinish goroutine'ni qotirib qo'yishi mumkin. Kodni ko'rib chiqishda har bir `go` qatori uchun uchta savol bering: bu goroutine qachon tugaydi, kim uni to'xtata oladi va natija yuborilsa kim qabul qiladi.

## Xulosa

- `go` ifodasi argumentlarni chaqiruvchida baholaydi va funksiyani yangi goroutine'da ishga tushiradi; goroutine'ga havola yo'q, `main` qaytganda dastur boshqa goroutine'larni kutmasdan chiqadi.
- Goroutine GC qilinmaydi: qotib qolgan goroutine o'z stack'i va u ushlagan ma'lumotni xotirada saqlaydi. Leak odatda kanalda yuborish yoki qabul qilishda qotishdan paydo bo'ladi.
- Har bir `go` qatori uchun "qachon va nima bilan tugaydi" degan javob kod ichida ko'rinib turishi kerak: kontekst, yopiladigan kanal, aniq sig'imli bufer.
- Topish vositalari: `runtime.NumGoroutine()` farqi testda, pprof `goroutine` profili (`debug=1` guruhlaydi, `debug=2` holatni ko'rsatadi) production'da.
- `goroutineleak` profili Go 1.26 da `GOEXPERIMENT=goroutineleakprofile` bilan eksperiment edi, Go 1.27 da umumiy. U GC yetib borish tahliliga asoslanadi, shuning uchun global yoki ishlayotgan goroutine lokallari orqali yetib boriladigan primitivlardagi leak'ni topmasligi mumkin.
