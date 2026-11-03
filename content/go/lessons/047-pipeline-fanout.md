---
n: 47
slug: pipeline-fanout
title: "Pipeline, fan-out/fan-in va bekor qilish"
summary: "Kanallar bilan bog'langan bosqichlardan iborat pipeline, fan-out va fan-in, qabul qiluvchi erta ketganda goroutine leak va uni context bilan bekor qilish, tartib, xato va parallellik darajasi qarorlari."
duration: 45
sources:
  - id: blog-pipelines
    note: "Pipelines va cancellation maqolasi: Squaring numbers, Fan-out fan-in, Stopping short (leak muammosi va buferli kanal yechimi), Explicit cancellation (done kanali orqali bekor qilish)"
  - id: blog-context
    note: "Context maqolasi: done kanali g'oyasining context.Context ga umumlashtirilishi"
  - id: gopl
    note: "8-bob (Goroutines and Channels): pipeline va bekor qilishga oid bo'limlar (bo'lim nomlari va raqamlari tekshirilmagan)"
quiz:
  - q: "Stage ichida 3 ta worker bitta chiqish kanaliga yozadi. Chiqish kanalini kim va qachon yopishi kerak?"
    options:
      - "Har worker o'zi tugaganda"
      - "Birinchi tugagan worker"
      - "Iste'molchi, hamma qiymatni o'qib bo'lgach"
      - "Alohida goroutine: u WaitGroup orqali hamma worker tugashini kutib, keyin yopadi"
    answer: 3
    explain: "Bir nechta yuboruvchi bo'lsa ularning biri yopishi qolganlarida 'send on closed channel' panic'ini keltiradi. Hamma worker tugashini kutib yopuvchi yagona goroutine xavfsiz. Dars misolidagi stage aynan shunday yozilgan."
  - q: "Pipeline iste'molchisi dastlabki 3 natijani olib `break` qildi, kontekst yoki done kanali yo'q. Yuqoridagi bosqichlar bilan nima bo'ladi?"
    options:
      - "Ular goroutine'lari bilan birga GC qilinadi"
      - "Ular keyingi yuborishda abadiy bloklanadi: butun pipeline'da goroutine leak"
      - "Ular panic qiladi"
      - "Ular o'zlari ishni to'xtatib normal tugaydi"
    answer: 1
    explain: "Iste'molchi ketdi, kanalni hech kim o'qimaydi, yuboruvchilar `out <-` da qotadi. Goroutine'lar GC qilinmaydi. Dars topshirig'ida 20 chaqiruvdan keyin 40 ta goroutine qolgani ko'rsatilgan."
  - q: "Fan-out qilingan stage (3 worker) 1,2,3,4,5 ni qayta ishlab natija kanaliga yozadi. Natija tartibi haqida nima deyish to'g'ri?"
    options:
      - "Kirish tartibi saqlanadi, chunki kanal FIFO"
      - "Tartib worker soniga bog'liq: 3 worker bo'lsa 1,2,3 birinchi chiqadi"
      - "Tartib nodeterministik: workerlar turli tezlikda ishlaydi, natijalar tayyor bo'lish tartibida chiqadi"
      - "Tartib doim teskari"
    answer: 2
    explain: "Kanal o'zi FIFO, lekin bir nechta worker parallel ishlab, tayyor bo'lgan natijani yozadi. Tartib kerak bo'lsa elementlarga indeks qo'shib natijalarni qayta tartiblash yoki ketma-ket bosqich ishlatish kerak."
  - q: "Nega `send` yordamchisi oddiy `out <- v` o'rniga `select { case out <- v: ... case <-ctx.Done(): ... }` ishlatadi?"
    options:
      - "Tezroq ishlashi uchun"
      - "Kanal sig'imini oshirish uchun"
      - "Iste'molchi ketgan bo'lsa, yuborish bloklanib qolmasdan kontekst bekor qilinganda goroutine chiqib ketishi uchun"
      - "Chunki oddiy yuborish panic qiladi"
    answer: 2
    explain: "Oddiy `out <- v` qabul qiluvchi ketsa abadiy bloklanadi. select kontekst bekor qilinishini ham kutadi, shuning uchun goroutine tugay oladi. Bu leak'ning oldini olishning markaziy usuli."
  - q: "Blog maqolasi 'chiqish kanallarini buferli qilish' usulini ko'rsatadi. Bu usul qachon yetarli bo'lmaydi?"
    options:
      - "Yuboriladigan qiymatlar soni oldindan noma'lum yoki iste'molchi qancha o'qishini bilmasak"
      - "Kanal tipi struct bo'lsa"
      - "Pipeline ikki bosqichdan ko'p bo'lsa"
      - "Ish CPU'ga bog'liq bo'lsa"
    answer: 0
    explain: "Bufer yuboruvchilarning bloklanmasligini faqat qiymatlar soni oldindan ma'lum bo'lsa kafolatlaydi. Soni noma'lum bo'lsa, bufer to'lgach yuborish yana bloklanadi. Shuning uchun aniq bekor qilish signali (done yoki ctx) kerak."
  - q: "Stage goroutine'i kontekst bekor qilinganda `return` qiladi va `defer close(out)` bajariladi. Quyi bosqichdagi `for v := range out` ga bu qanday ta'sir qiladi?"
    options:
      - "Quyi bosqich abadiy kutadi"
      - "Quyi bosqichning range tsikli yopilgan kanalni ko'rib tugaydi va u ham o'z chiqishini yopadi: bekor qilish zanjir bo'ylab tarqaladi"
      - "Quyi bosqich panic qiladi"
      - "Quyi bosqich nol qiymatlarni cheksiz o'qiydi"
    answer: 1
    explain: "range yopilgan va bo'shagan kanalda tugaydi. Har bosqich o'z chiqishini defer bilan yopgani uchun yopilish zanjir bo'ylab tarqaladi va hamma goroutine tugaydi. Yopiq kanal va range semantikasi 42-darsda."
task:
  title: "Erta to'xtaganda pipeline leak'ini yo'qotish"
  prompt: |
    `gen` va `square` ikki bosqichli pipeline, `firstN` esa undan dastlabki `n` ta natijani olib `break` qiladi. Dastur `firstN(3)` ni 20 marta chaqiradi va oxirida sizib chiqqan goroutine'lar sonini tekshiradi.

    Muammo: iste'molchi ketgach `gen` va `square` goroutine'lari `out <-` da qotib qoladi. Har chaqiruvda 2 ta, jami 40 ta goroutine sizib chiqadi va `main` 1 kod bilan chiqadi.

    Pipeline'ni context bilan bekor qilinadigan qiling: bosqichlar `ctx` qabul qilsin, yuborish `select` bilan `ctx.Done()` ni ham kutsin, `firstN` esa `defer cancel()` bilan chiqsin. `firstN(3)` natijasi `[1 4 9]` bo'lib qolsin. `go run -race` ogohlantirishsiz o'tsin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "runtime"
        "time"
    )

    // gen 1 dan n gacha sonlarni chiqaradi.
    func gen(n int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for i := 1; i <= n; i++ {
                out <- i
            }
        }()
        return out
    }

    // square har bir sonning kvadratini chiqaradi.
    func square(in <-chan int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for v := range in {
                out <- v * v
            }
        }()
        return out
    }

    // firstN pipeline'dan dastlabki n ta natijani oladi.
    func firstN(n int) []int {
        var res []int
        for v := range square(gen(1000)) {
            res = append(res, v)
            if len(res) == n {
                break
            }
        }
        return res
    }

    func main() {
        base := runtime.NumGoroutine()
        var res []int
        for range 20 {
            res = firstN(3)
        }
        time.Sleep(100 * time.Millisecond)

        leaked := runtime.NumGoroutine() - base
        fmt.Println("natija:", res, "sizib chiqqan:", leaked)
        if leaked != 0 {
            os.Exit(1)
        }
    }
  solution: |
    package main

    import (
        "context"
        "fmt"
        "os"
        "runtime"
        "time"
    )

    // send qiymatni yuboradi yoki ctx bekor qilinsa false qaytaradi.
    func send(ctx context.Context, out chan<- int, v int) bool {
        select {
        case out <- v:
            return true
        case <-ctx.Done():
            return false
        }
    }

    // gen 1 dan n gacha sonlarni chiqaradi.
    func gen(ctx context.Context, n int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for i := 1; i <= n; i++ {
                if !send(ctx, out, i) {
                    return
                }
            }
        }()
        return out
    }

    // square har bir sonning kvadratini chiqaradi.
    func square(ctx context.Context, in <-chan int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for v := range in {
                if !send(ctx, out, v*v) {
                    return
                }
            }
        }()
        return out
    }

    // firstN pipeline'dan dastlabki n ta natijani oladi.
    func firstN(n int) []int {
        ctx, cancel := context.WithCancel(context.Background())
        defer cancel()

        var res []int
        for v := range square(ctx, gen(ctx, 1000)) {
            res = append(res, v)
            if len(res) == n {
                break
            }
        }
        return res
    }

    func main() {
        base := runtime.NumGoroutine()
        var res []int
        for range 20 {
            res = firstN(3)
        }
        time.Sleep(100 * time.Millisecond)

        leaked := runtime.NumGoroutine() - base
        fmt.Println("natija:", res, "sizib chiqqan:", leaked)
        if leaked != 0 {
            os.Exit(1)
        }
    }
  solutionNotes: |
    - `send` yordamchisi qiymatni yuboradi yoki kontekst bekor qilinsa `false` qaytaradi. Ikkala bosqich ham shuni ishlatadi, shuning uchun hech biri `out <-` da abadiy qolmaydi.
    - `defer cancel()` `firstN` dan har qanday yo'l bilan chiqishda ishlaydi, shu jumladan `break` dan keyin. Kontekst bekor bo'lgach `gen` `send` dan `false` olib `return` qiladi, `defer close(out)` kanalni yopadi.
    - `square` ning `range in` tsikli `gen` chiqishi yopilgach tugaydi, yoki `send` `false` qaytarsa `return` qiladi. Bekor qilish zanjir bo'ylab tarqaladi.
    - Bufer bilan yechish (sig'im 1000) noto'g'ri: sonlar soni ma'lum chegaralangan emas va bufer xotirani behuda ushlaydi.
    - `main` da 100 ms uyqu goroutine'lar tugashiga vaqt beradi; sinov kodida bu o'rniga `sync.WaitGroup` yoki 50-darsdagi `synctest` ishlatiladi.
  checklist:
    - "`firstN(3)` natijasi `[1 4 9]`"
    - "Sizib chiqqan goroutine'lar soni 0"
    - "Har bosqich `ctx` qabul qiladi va yuborishda `ctx.Done()` ni kutadi"
    - "`firstN` `defer cancel()` bilan bekor qiladi"
    - "`go run -race` va `go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Telemetriya paketlarini qayta ishlash odatda bir necha bosqichdan iborat: xom satrni o'qish, uni tahlil qilish (parse), tekshirish (validate), boyitish (geokodlash) va bazaga yozish. Bosqichlarni bitta katta funksiyaga solsangiz, har biri ketma-ket ishlaydi va eng sekin qadam hammani to'xtatadi. Har bosqichni alohida goroutine'ga ajratib, kanallar bilan bog'lasangiz, bosqichlar bir vaqtda ishlaydi, sekin bosqichga ko'proq worker berish mumkin.

Bu g'oya soddadek ko'rinadi, lekin ikki joyda xato qilish oson. Birinchisi: iste'molchi (masalan, HTTP handler) so'rov bekor qilingani uchun yoki yetarli natija olgani uchun ketib qoladi, yuqoridagi bosqichlar esa kanalga yuborishda qotib, hamma goroutine leak bo'ladi (41-dars). Ikkinchisi: kanalni yopish tartibi buzilib, panic yoki abadiy kutish paydo bo'ladi (42-dars).

Go Blog'dagi "Pipelines and cancellation" maqolasi bu pattern'ning klassik tavsifi, undagi qoidalar bugun ham o'zgarmagan. Bu darsda ularni zamonaviy `context` va generics bilan ko'ramiz.

## Asosiy g'oya

### Pipeline nima

Maqola ochiq aytadi: Go'da pipeline'ning rasmiy ta'rifi yo'q, bu shunchaki bir turdagi concurrent dastur. Norasmiy ta'rif: kanallar bilan bog'langan bosqichlar qatori, har bosqich bir xil funksiyani bajaruvchi goroutine'lar guruhi. Har bosqich:

- kiruvchi kanallardan qiymat oladi,
- ularga biror ishlov beradi, odatda yangi qiymat hosil qiladi,
- natijani chiquvchi kanalga yuboradi.

Birinchi bosqich (source yoki producer) faqat chiquvchi, oxirgisi (sink yoki consumer) faqat kiruvchi kanalga ega. Maqola ikki qoida aytadi: bosqich o'zining chiquvchi kanalini barcha yuborishlar tugagach yopadi, va kiruvchi kanallar yopilguncha (yoki yuboruvchilar to'xtatilguncha) o'qishda davom etadi. Birinchi qoida `range` bilan o'qiydigan keyingi bosqich tugashining sharti (42-dars).

### Fan-out va fan-in

Maqola ikki atamani shunday ta'riflaydi:

- **Fan-out**: bir nechta funksiya bir kanaldan yopilguncha o'qiydi. Ish worker'lar guruhi o'rtasida taqsimlanadi, bu CPU va I/O'dan samarali foydalanish usuli.
- **Fan-in**: funksiya bir nechta kiruvchi kanaldan o'qib, hammasi yopilgandagina yopiladigan bitta kanalga multiplekslaydi.

Amalda ikkalasi bir bosqichda birlashadi: bir kiruvchi kanaldan `N` worker o'qiydi, natijalarni bir chiquvchi kanalga yozadi va chiquvchi kanalni alohida goroutine hamma worker tugagach yopadi. Bu darsdagi `stage` aynan shunday.

### Bekor qilish muammosi

Maqolaning markaziy qismi: iste'molchi barcha qiymatlarni olmasa nima bo'ladi. Goroutine'lar xotira va runtime resursini sarflaydi, stack'idagi havolalar ma'lumotni GC dan saqlaydi, goroutine'lar GC qilinmaydi va o'zlari chiqishlari kerak. Shuning uchun yuqori bosqichlar pastki bosqich ketsa ham tugashni bilishi kerak.

Maqola ikki yechimni ketma-ket ko'rsatadi:

1. **Buferli chiquvchi kanal.** Qiymatlar soni oldindan ma'lum bo'lsa, bufer sig'imini shunga tenglab, yuboruvchilar bloklanmaydi. Cheklov: son oldindan ma'lum bo'lishi va iste'molchi ketishi hisobga olinishi kerak; kod o'zgarsa, bufer o'lchami bilan mos tushmay qolishi osonlashadi.
2. **Aniq bekor qilish signali.** Hamma bosqichlarga `done` kanali beriladi. Iste'molchi ketayotganda uni yopadi (`defer close(done)`), yopilish esa barcha bosqichlarga broadcast bo'ladi. Har bosqich yuborishni `select` ichida `done` bilan birga kutadi.

Keyingi `context` maqolasi done kanalini `context.Context` ga umumlashtirdi: `ctx.Done()` kanali bekor qilishda yopiladi, `ctx.Err()` sababni beradi, va kontekst daraxt bo'ylab ota-bola munosabati bilan tarqaladi (34-dars). Zamonaviy kodda `done` kanali o'rniga `ctx` uzatiladi.

## Chuqurroq: dizayn qarorlari

### Yagona qoida: har yuborish va qabul qilish bekor qilinadigan bo'lsin

Bosqich goroutine'i ikki joyda bloklanishi mumkin: kiruvchi kanaldan o'qishda va chiquvchi kanalga yuborishda. Kiruvchi kanaldan o'qish `range in` bilan: kanal yopilganda tugaydi. Agar yuqori bosqich ham bekor qilinishda o'z chiqishini yopsa, bu avtomatik ishlaydi. Chiquvchi kanalga yuborish esa `select` bilan `ctx.Done()` ni ham kutishi shart, chunki qabul qiluvchi ketgan bo'lishi mumkin.

Shu sababli yagona yordamchi funksiya yetarli:

```go
func send[T any](ctx context.Context, out chan<- T, v T) bool {
	select {
	case out <- v:
		return true
	case <-ctx.Done():
		return false
	}
}
```

Bosqich `send` `false` qaytarsa `return` qiladi, `defer close(out)` esa zanjirdagi keyingi bosqichga yopilish signalini yetkazadi. Bekor qilish shu tarzda yuqoridan pastga ham, pastdan yuqoriga ham tarqaladi: iste'molchi `cancel()` chaqiradi, hamma `send` qaytadi.

### Tartib

Bitta worker bilan bosqich kirish tartibini saqlaydi. Fan-out bilan saqlamaydi: workerlar turli tezlikda ishlaydi va natija tayyor bo'lganda yoziladi. Tartib kerak bo'lsa:

- elementga indeks qo'shib (`struct{i int; v T}`), oxirida iste'molchi indeks bo'yicha tartiblaydi (xotira: butun natija kerak);
- yoki fan-out'dan voz kechib, bosqichni ketma-ket qoldirish.

Telemetriyada ko'pincha tartib qurilma ichida muhim (bir qurilmaning nuqtalari), qurilmalar orasida emas. Unda qurilma identifikatori bo'yicha kanalni shard'lash (bitta qurilma doim bitta worker'ga) tartibni saqlaydi.

### Xatolar

Pipeline orqali xato o'tkazishning ikki yo'li bor:

- qiymat bilan birga: `type Result struct { Val T; Err error }` kanal elementi sifatida; har bosqich xatoni o'zgartirmay o'tkazadi yoki o'zi qaror qiladi;
- yoki umumiy kanal: birinchi xato `cancel` ni chaqiradi, xato alohida saqlanadi. Bu `errgroup` ning ishi (48-dars).

Darsdagi `stage` noto'g'ri elementni jimgina tashlaydi (`ok == false`). Haqiqiy tizimda tashlangan elementlarni sanash (metrika) yoki "dead letter" ga yo'naltirish kerak.

### Worker soni

- CPU'ga bog'liq bosqich uchun worker soni odatda mavjud yadrolar soni atrofida; oshirish foyda bermaydi.
- I/O'ga bog'liq bosqich (tarmoq chaqiruvi) uchun ko'proq, lekin quyi tizim chidaydigan chegara bilan. Chegarasiz fan-out quyi servisni yiqitishi mumkin.
- Aniq son o'lchov bilan tanlanadi; ko'pi bilan worker sonini sozlanadigan parametr qiling.

### Backpressure

Bosqichlar buferlanmagan kanal bilan bog'langanda sekin bosqich yuqoridagilarni o'z tezligiga tushiradi: yuborish bloklanadi. Bu pipeline'ning tabiiy xususiyati va ko'p holda yaxshi. Bufer qo'shish bosqichlar orasidagi tebranishni yumshatadi, lekin xotirani o'stiradi va muammoni kechiktiradi (49-dars).

## Misol: generic stage va ctx bilan bekor qilish

Quyidagi dastur uch bosqichli pipeline: `source` satrlarni chiqaradi, `stage` fan-out/fan-in bilan `parse` va `valid` ni 3 workerda bajaradi. Ikkinchi qismda 1000 elementli oqimdan faqat 2 tasi olinib, kontekst bekor qilinadi va goroutine'lar soni tekshiriladi.

```go
package main

import (
	"context"
	"fmt"
	"runtime"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Reading struct {
	Device string
	Speed  float64
}

// send qiymatni yuboradi yoki ctx bekor qilinsa false qaytaradi.
func send[T any](ctx context.Context, out chan<- T, v T) bool {
	select {
	case out <- v:
		return true
	case <-ctx.Done():
		return false
	}
}

// source satrlarni kanalga chiqaradi.
func source(ctx context.Context, lines []string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		for _, l := range lines {
			if !send(ctx, out, l) {
				return
			}
		}
	}()
	return out
}

// stage fn'ni workers ta goroutine'da parallel bajaradi (fan-out)
// va natijalarni bitta kanalga yig'adi (fan-in). Tartib saqlanmaydi.
func stage[In, Out any](ctx context.Context, in <-chan In, workers int, fn func(In) (Out, bool)) <-chan Out {
	out := make(chan Out)
	var wg sync.WaitGroup
	for range workers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for v := range in {
				r, ok := fn(v)
				if !ok {
					continue
				}
				if !send(ctx, out, r) {
					return
				}
			}
		}()
	}
	go func() {
		wg.Wait()
		close(out)
	}()
	return out
}

func parse(line string) (Reading, bool) {
	dev, sp, ok := strings.Cut(line, ",")
	if !ok {
		return Reading{}, false
	}
	v, err := strconv.ParseFloat(sp, 64)
	if err != nil {
		return Reading{}, false
	}
	return Reading{dev, v}, true
}

func valid(r Reading) (Reading, bool) { return r, r.Speed >= 0 && r.Speed <= 200 }

func main() {
	lines := []string{"t1,60", "t2,x", "t3,85.5", "t4,-1", "t5,120", "bad", "t6,300", "t7,40"}

	ctx := context.Background()
	parsed := stage(ctx, source(ctx, lines), 3, parse)
	checked := stage(ctx, parsed, 3, valid)

	var devices []string
	for r := range checked {
		devices = append(devices, r.Device)
	}
	slices.Sort(devices)
	fmt.Println("yaroqli:", devices)

	// Erta to'xtash: faqat 2 ta natija olamiz, keyin ctx'ni bekor qilamiz.
	base := runtime.NumGoroutine()
	long := make([]string, 1000)
	for i := range long {
		long[i] = "t" + strconv.Itoa(i) + ",50"
	}
	ctx2, cancel := context.WithCancel(context.Background())
	out := stage(ctx2, stage(ctx2, source(ctx2, long), 3, parse), 3, valid)
	<-out
	<-out
	cancel()
	time.Sleep(50 * time.Millisecond)
	fmt.Println("qolgan goroutine'lar:", runtime.NumGoroutine()-base)
}
```

Natija (Go 1.24.7, linux/amd64, `go run -race`):

```text
yaroqli: [t1 t3 t5 t7]
qolgan goroutine'lar: 0
```

Birinchi qatordagi ro'yxat tartiblangan: fan-out sababli natijalar kelish tartibi har ishga tushirishda farq qilishi mumkin, shuning uchun biz `slices.Sort` bilan tartibladik. Yaroqli qurilmalar `t1`, `t3`, `t5`, `t7`: `t2` (tezlik `x`) va `bad` (vergulsiz) parse'da, `t4` (-1) va `t6` (300) validate'da tashlandi.

Ikkinchi qator muhim: iste'molchi faqat ikki qiymat o'qib, `cancel()` chaqirgach 50 ms ichida hech bir goroutine qolmadi. `base` pipeline ishga tushishidan oldingi goroutine soni. 50 ms uyqu goroutine'lar tugashiga vaqt beradi, shuning uchun bu o'lchov vaqtga bog'liq; ishonchli sinash usuli 50-darsda.

Kodni o'qish tartibi:

- `send` bekor qilinadigan yuborish. Hamma bosqichlar faqat u orqali yozadi.
- `source` o'z chiqishini `defer close(out)` bilan yopadi va `send` `false` qaytarsa to'xtaydi.
- `stage[In, Out]` generic: `fn` `(Out, bool)` qaytaradi, `false` elementni tashlashni bildiradi. Worker'lar `for v := range in` bilan o'qiydi. `sync.WaitGroup` hamma worker tugashini kutadi, shundan keyingina alohida goroutine `out` ni yopadi: bir nechta yuboruvchi bo'lganda kanalni yopishning to'g'ri usuli (42-dars).
- Pipeline `stage(ctx, stage(ctx, source(...), 3, parse), 3, valid)` ko'rinishida quriladi: bosqichlar bir-biriga kanal orqali ulanadi.

Natija topshiriq kodi bilan solishtiriladi: xuddi shu g'oya, lekin kontekstsiz variant 40 goroutine'ni sizdirdi, kontekstli variant 0.

## Qachon qo'llamaslik kerak

Pipeline har doim ham javob emas:

- Bosqichlar juda yengil bo'lsa (masalan, ikkita arifmetik amal), goroutine va kanal orqali o'tkazish xarajati ishning o'zidan oshadi. Bir funksiyada ketma-ket bajarish tezroq va sodda.
- Ish hajmi kichik va chegaralangan bo'lsa, `errgroup` bilan oddiy parallel `for` (48-dars) o'qishga osonroq.
- Tartib qat'iy kerak va fan-out zarur bo'lsa, indeks va qayta tartiblash kodni murakkablashtiradi: avval ketma-ket variantni o'lchang.
- Chegarasiz fan-out (har element uchun goroutine) quyi tizimni yiqitadi. Worker soni doim cheklangan bo'lsin.
- Pipeline xatolarini jimgina yutmang. Tashlangan elementlar soni metrikada ko'rinishi kerak.
- Bekor qilishsiz pipeline ishlab chiqarishga chiqarilmasin: iste'molchi ketsa leak bo'ladi (41-dars).

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da bunday pipeline'lar `stream.pipeline`, `Transform` stream'lar yoki async generator'lar bilan quriladi. `for await (const x of source)` zanjiri Go'dagi `range ch` zanjiriga o'xshaydi. Muhim farqlar:

| Node.js | Go |
|---|---|
| `stream.pipeline` xato va yopilishni avtomatik tarqatadi | Siz o'zingiz `ctx` va `defer close` bilan quraysiz |
| Backpressure `highWaterMark` va `drain` orqali | Backpressure kanal yuborishning bloklanishi |
| Fan-out uchun worker thread yoki cluster | Fan-out: bir nechta goroutine bir kanaldan o'qiydi |
| `AbortSignal` | `context.Context` |
| Generator'dan `break` zanjirni yopadi (`return()` chaqiriladi) | `break` hech narsani yopmaydi: `cancel()` shart |

Oxirgi qator eng muhim. JavaScript'da `for await` ichidan `break` qilinsa, generator avtomatik tozalanadi (`finally` bajariladi). Go'da kanal ustida `range` dan chiqish yuboruvchi goroutine'ga hech narsa aytmaydi. Bekor qilish signalini siz yuborasiz, odatda `defer cancel()` bilan. Shuning uchun Go'da pipeline qaytaradigan har funksiya iste'molchiga bekor qilish yo'lini ham berishi kerak: `ctx` parametri yoki qaytariladigan `cancel`.

## Xulosa

- Pipeline: kanallar bilan bog'langan bosqichlar; har bosqich o'z chiquvchi kanalini yuborishlar tugagach yopadi va kiruvchi kanal yopilguncha o'qiydi.
- Fan-out: bir kanaldan bir nechta worker o'qiydi; fan-in: bir nechta kanal bitta kanalga birlashadi; bir nechta yuboruvchi bo'lsa kanalni alohida goroutine `WaitGroup` orqali kutib yopadi.
- Iste'molchi erta ketsa, bekor qilishsiz yuqori bosqichlar yuborishda qotib leak bo'ladi; bufer faqat qiymatlar soni oldindan ma'lum bo'lsa yordam beradi.
- Har yuborish `select` ichida `ctx.Done()` bilan kutilsin, iste'molchi esa `defer cancel()` chaqirsin; bekor qilish `defer close(out)` orqali zanjir bo'ylab tarqaladi.
- Fan-out tartibni saqlamaydi, worker sonini o'lchov bilan cheklang va tashlangan elementlarni hisoblang.
