---
n: 49
slug: worker-backpressure
title: "Worker pool, backpressure va rate limiting"
summary: "Chegaralangan worker pool, navbat o'lchami qarori, backpressure (producer'ni sekinlashtirish) va load shedding (ortiqcha ishni rad etish), token bucket asosidagi rate limiting va graceful shutdown tartibi."
duration: 45
sources:
  - id: 100go
    note: "Concurrency boblari: umumiy kontekst - #62 (goroutine qachon to'xtashi), #67 (kanal sig'imi), #73 (Not using errgroup). Dars matnida kitobdan aniq da'vo keltirilmagan"
  - id: blog-pipelines
    note: "Pipelines maqolasi: kanal bilan bog'langan bosqichlar, bekor qilish va goroutine'larning o'zi chiqishi kerakligi"
  - id: pkg-context
    note: "context paketi: bekor qilish signali va Done kanali, Err sababi"
quiz:
  - q: "Worker pool'ga navbat sig'imi 0 (buferlanmagan kanal) berildi. Producer `Submit` chaqirganda nima bo'ladi?"
    options:
      - "Ish darhol navbatga tushadi va producer davom etadi"
      - "Producer biror worker bo'shab ishni olguncha kutadi: bu backpressure"
      - "Ish tashlab yuboriladi"
      - "Panic bo'ladi"
    answer: 1
    explain: "Buferlanmagan kanalga yuborish qabul qiluvchi tayyor bo'lguncha bloklanadi. Hamma worker band bo'lsa producer kutadi, ya'ni tezlik avtomatik moslashadi."
  - q: "Nega `for _, it := range items { go handle(it) }` worker pool emas?"
    options:
      - "Chunki `go` kalit so'zi faqat bir marta ishlatiladi"
      - "Chunki `handle` qaytarish qiymatiga ega emas"
      - "Chunki range tsikli goroutine'ni kutmaydi"
      - "Chunki goroutine soni elementlar soniga teng va hech narsa bir vaqtdagi ishni cheklamaydi"
    answer: 3
    explain: "Bu chegarasiz fan-out: har element uchun goroutine. Dars topshirig'ida 200 elementda bir vaqtdagi ishlar soni cheklanmagan: qayta tekshirganda bu qiymat har ishga tushirishda boshqacha chiqdi (0 dan 179 gacha). Pool ishchilar sonini oldindan belgilaydi."
  - q: "Navbat to'la bo'lganda `TrySubmit` `ErrFull` qaytaradi va ishni rad etadi. Bu qaysi strategiya?"
    options:
      - "Load shedding: ortiqcha ishni rad etib, tizimni himoya qilish"
      - "Backpressure: producer'ni kutdirish"
      - "Graceful shutdown"
      - "Fan-in"
    answer: 0
    explain: "Kutdirish o'rniga ishni darhol rad etish load shedding deyiladi. Chaqiruvchi buni 429 yoki 503 kabi javobga aylantirishi yoki keyinroq qayta urinishi mumkin."
  - q: "Pool'ni to'xtatishda `close(p.jobs)` chaqirilgach boshqa goroutine `Submit` qilsa nima bo'ladi?"
    options:
      - "Ish jimgina e'tiborsiz qoladi"
      - "Ish navbatning oxiriga tushadi"
      - "Yopilgan kanalga yuborish panic keltiradi"
      - "Submit false qaytaradi"
    answer: 2
    explain: "Go spetsifikatsiyasiga ko'ra yopilgan kanalga yuborish panic qiladi (42-dars). Shuning uchun Shutdown faqat barcha submit qiluvchilar tugagandan keyin chaqiriladi."
  - q: "Token bucket'da burst=2 va interval=20ms. Limiter hozirgina yaratildi. 6 ta `Wait` chaqirig'i kamida qancha vaqt oladi?"
    options:
      - "Deyarli nol vaqt: hamma chaqiruv darhol o'tadi"
      - "Kamida 120 ms: har chaqiruv uchun interval"
      - "Aynan 20 ms"
      - "Kamida 80 ms: dastlabki 2 token tayyor, qolgan 4 tasi uchun 4 interval"
    answer: 3
    explain: "Chelak burst bilan to'la boshlanadi, shuning uchun birinchi ikkita chaqiruv kutmaydi. Qolgan to'rttasi har 20 ms da bitta token oladi. Dars misolida aynan shu 80 ms chegarasi tekshirilgan."
  - q: "Rate limiter'da `Wait(ctx)` nega `ctx` qabul qiladi?"
    options:
      - "Token'lar sonini ctx belgilaydi"
      - "Kutayotgan chaqiruvchi so'rov bekor bo'lganda yoki muddat tugaganda token kutishni to'xtata olishi uchun"
      - "Tezroq ishlashi uchun"
      - "Ctx limiter'ni to'xtatadi"
    answer: 1
    explain: "Token kutish bloklovchi amal. Ctx bo'lmasa mijoz uzilgan so'rov ham token kutib turadi va goroutine band qoladi. select ichida ctx.Done() ni kutish uni bekor qilinadigan qiladi."
task:
  title: "Chegarasiz goroutine'lardan worker pool'ga"
  prompt: |
    `processAll` 200 ta paketni `handle` bilan qayta ishlaydi. Hozir u har paket uchun goroutine ishga tushiradi va `workers` parametrini e'tiborsiz qoldiradi. Natijada `processAll` qaytganda hali hech narsa qayta ishlanmagan bo'lishi mumkin va bir vaqtdagi ishlar soni cheklanmagan.

    Starter: `qayta ishlandi: 0` va eng ko'p parallel qiymat 4 dan ancha katta (qiymat har ishga tushirishda boshqacha: shu sandbox'da 0 dan 179 gacha ko'rindi), shuning uchun `main` 1 kod bilan chiqadi.

    `processAll` ni tuzating: aynan `workers` ta goroutine'li pool yarating, elementlarni buferlanmagan kanal orqali bering, `processAll` hamma ish tugagandan keyingina qaytsin. Natija: `qayta ishlandi: 200 eng ko'p parallel: 4`. `go run -race` ogohlantirishsiz o'tsin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "sync/atomic"
        "time"
    )

    var (
        running   atomic.Int32
        peak      atomic.Int32
        processed atomic.Int32
    )

    // handle bitta telemetriya paketini qayta ishlaydi (masalan, bazaga yozadi).
    func handle(item int) {
        cur := running.Add(1)
        for {
            p := peak.Load()
            if cur <= p || peak.CompareAndSwap(p, cur) {
                break
            }
        }
        time.Sleep(5 * time.Millisecond)
        running.Add(-1)
        processed.Add(1)
    }

    // processAll barcha paketlarni qayta ishlaydi.
    // workers - bir vaqtda ishlaydigan goroutine'lar soni chegarasi.
    func processAll(items []int, workers int) {
        for _, it := range items {
            go handle(it)
        }
    }

    func main() {
        items := make([]int, 200)
        for i := range items {
            items[i] = i
        }
        processAll(items, 4)

        fmt.Println("qayta ishlandi:", processed.Load(), "eng ko'p parallel:", peak.Load())
        if processed.Load() != 200 || peak.Load() > 4 {
            os.Exit(1)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "os"
        "sync"
        "sync/atomic"
        "time"
    )

    var (
        running   atomic.Int32
        peak      atomic.Int32
        processed atomic.Int32
    )

    // handle bitta telemetriya paketini qayta ishlaydi (masalan, bazaga yozadi).
    func handle(item int) {
        cur := running.Add(1)
        for {
            p := peak.Load()
            if cur <= p || peak.CompareAndSwap(p, cur) {
                break
            }
        }
        time.Sleep(5 * time.Millisecond)
        running.Add(-1)
        processed.Add(1)
    }

    // processAll barcha paketlarni qayta ishlaydi.
    // workers - bir vaqtda ishlaydigan goroutine'lar soni chegarasi.
    func processAll(items []int, workers int) {
        jobs := make(chan int) // buferlanmagan: producer worker bo'shaguncha kutadi
        var wg sync.WaitGroup
        for range workers {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for it := range jobs {
                    handle(it)
                }
            }()
        }
        for _, it := range items {
            jobs <- it
        }
        close(jobs)
        wg.Wait()
    }

    func main() {
        items := make([]int, 200)
        for i := range items {
            items[i] = i
        }
        processAll(items, 4)

        fmt.Println("qayta ishlandi:", processed.Load(), "eng ko'p parallel:", peak.Load())
        if processed.Load() != 200 || peak.Load() > 4 {
            os.Exit(1)
        }
    }
  solutionNotes: |
    - Kanal buferlanmagan, shuning uchun producer (`processAll` tsikli) worker bo'shaguncha bloklanadi. Bu backpressure: navbat o'smaydi, xotira sarflanmaydi.
    - Ishchilar `for it := range jobs` bilan o'qiydi. `close(jobs)` ishchilarga "ish tugadi" signali beradi (42-dars).
    - `wg.Wait()` hamma ishchi o'z tsiklidan chiqquncha kutadi, shuning uchun `processAll` qaytganda `processed` to'liq. `Done` `Wait` qaytishidan oldin sinxronlanadi (43-dars).
    - Kafolat `eng ko'p parallel <= 4`. Sinovda 2 yadroli mashinada ham 4 chiqdi, chunki `Sleep` paytida ishchilar bir-birini kutmaydi.
    - Navbat bufer bilan ham ishlaydi (`make(chan int, 16)`), lekin bufer backpressure'ni kechiktiradi va xotirani oshiradi. Buferni faqat tebranishni yumshatish uchun, o'lchov bilan tanlang.
  checklist:
    - "`processAll` qaytganda 200 ta paket qayta ishlangan"
    - "Eng ko'p parallel ishlar soni 4 dan oshmaydi"
    - "Goroutine'lar soni `workers` bilan cheklangan"
    - "`go run -race` va `go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Telemetriya servisi sekundiga bir necha ming paket oladi, har birini bazaga yozish kerak. Eng sodda yo'l: har paket uchun `go handle(p)`. Goroutine arzon, shuning uchun bu ishlaydi, to'g'rirog'i, yuk oshguncha ishlaydi. Keyin quyidagilar sodir bo'ladi:

- baza bir vaqtda 50 ulanishni ko'taradi, goroutine'lar esa 5000 ta, qolganlari ulanish kutib turadi;
- har goroutine stack, paket ma'lumoti va kontekstni ushlab turadi, xotira o'sadi;
- baza sekinlashsa, goroutine'lar to'planib, sekinlik yanada kuchayadi;
- qabul qilingan paket qayta ishlanishi kafolatlanmagan: dastur to'xtasa, uchib yurgan ishlar yo'qoladi.

Muammoning ildizi: ish kirish tezligi qayta ishlash tezligidan oshganda ortiqcha ish biror joyda to'planadi. Savol faqat qayerda va nima bo'lishida: xotirada, kanalda, yoki mijoz tomonda. Bu dars uchta javobni ko'radi: worker pool bilan parallellikni cheklash, backpressure bilan producer'ni sekinlashtirish, rate limiting bilan kirish tezligini boshqarish.

## Asosiy g'oya

### Worker pool

Worker pool: oldindan belgilangan sondagi goroutine (ishchilar) umumiy kanaldan ish oladi. Pipeline maqolasi fan-out ni shunday ta'riflaydi: bir nechta funksiya bir kanaldan yopilguncha o'qiydi. Pool shu g'oyaning cheklangan va uzoq yashovchi varianti.

Uch qism bor:

1. **Ish kanali** (`jobs`). Producer'lar unga yozadi, ishchilar o'qiydi.
2. **Ishchilar**. `for j := range jobs` tsiklidagi `N` ta goroutine. Kanal yopilib bo'shaganda tugaydi.
3. **Hayot sikli**. Boshlash (`NewPool`) va to'xtatish (`Shutdown`): kanalni yopish, ishchilarni `WaitGroup` bilan kutish.

Pool parallellikni `N` bilan cheklaydi. Goroutine soni ish hajmiga bog'liq emas, doimiy.

### Navbat o'lchami va backpressure

Kanal sig'imi (navbat uzunligi) pool xatti-harakatini belgilaydi:

- **Sig'im 0** (buferlanmagan): producer ishchi bo'shaguncha bloklanadi. Eng qat'iy backpressure, hech qanday ish navbatda kutmaydi.
- **Kichik sig'im**: tebranishni yumshatadi. Yuk to'satdan oshsa, `N + sig'im` ish qabul qilinadi, keyingisi bloklanadi.
- **Katta sig'im**: backpressure kechikadi, xotira o'sadi, ishning navbatda kutish vaqti (latency) ortadi. Ish kutib turganda uni so'ragan mijoz allaqachon ketgan bo'lishi mumkin.

Backpressure so'zi: pastdagi (iste'molchi) sekinlik yuqoridagiga (producer) bosim sifatida uzatiladi. Go'da u kanalga yuborishning bloklanishi bilan bepul keladi. Ammo bu faqat bir joyda hal qilinsa ishlaydi: agar producer HTTP handler bo'lsa, bloklanish so'rovni kutdiradi va mijoz timeout oladi. Shuning uchun `Submit` har doim `ctx` ni kuzatishi kerak: so'rov bekor bo'lsa, navbatda kutish ham to'xtaydi (pkg-context: `Done` kanali bekor qilishda yopiladi).

### Load shedding

Ba'zan kutish o'rniga rad etish to'g'ri. Navbat to'lgan va ish darhol bajarilmasa, `select` ning `default` shoxi bilan bloklanmasdan sinaymiz:

```go
select {
case p.jobs <- j:
	return nil
default:
	return ErrFull
}
```

Bu load shedding: tizim ortiqcha yukni qabul qilmaydi, qabul qilganini esa o'z vaqtida bajaradi. HTTP'da bu 429 yoki 503 javob. Telemetriyada ba'zan eski o'lchovni tashlab, yangisini saqlash ma'qul. Muhimi, rad etishni sanash va ko'rinadigan qilish (metrika), aks holda yo'qotilgan ma'lumot sezilmay qoladi.

### Rate limiting

Backpressure va shedding tizimning ichki sig'imiga bog'liq. Rate limiting esa tashqi shartnomani qo'llaydi: "sekundiga 100 so'rovdan ortiq emas". Ko'p ishlatiladigan model token bucket:

- chelak `burst` ta tokenga sig'adi;
- har `interval` da bitta token qo'shiladi (chelak to'la bo'lsa yo'qoladi);
- har amal bitta token oladi, token bo'lmasa kutadi (yoki rad etiladi).

`burst` qisqa muddatli ko'tarilishga ruxsat beradi, o'rtacha tezlik esa `1/interval` bilan cheklanadi. Standart kutubxonada tayyor limiter yo'q. Sub-repository'da `golang.org/x/time/rate` paketi mavjud, lekin u bu kursning manbalar ro'yxatida emas, shuning uchun uning API'si bu darsda ko'rib chiqilmaydi va tekshirilmagan. Mexanizmni o'zimiz yozamiz.

## Chuqurroq: dizayn qarorlari

### Pool hayot sikli va yopish tartibi

Pool'ni to'xtatishning to'g'ri tartibi ketma-ketlikka bog'liq:

1. Yangi ish qabul qilishni to'xtating (producer'lar to'xtaydi).
2. Hamma producer tugaganini kuting.
3. `close(jobs)` ni chaqiring.
4. `wg.Wait()` bilan ishchilar navbatni tugatishini kuting.

Bu tartibni buzish panic keltiradi: yopilgan kanalga yuborish run-time panic (42-dars). Namunadagi `Shutdown` faqat submit qiluvchilar tugagandan keyin chaqirilishi kerakligi kod izohida yozilgan. Ichidagi `atomic.Bool` faqat `Shutdown` ni ikki marta chaqirganda ikki marta `close` bo'lmasligi uchun. U `Submit` ni yopilgandan keyin himoya qilmaydi: bunday himoya uchun kanal yopilishi va yuborish o'rtasida sinxronlash (masalan, `RWMutex` yoki alohida `done` kanali) kerak.

### Ishchi ichidagi xatolar va panic

Ishchi `handle(j)` panic qilsa, butun dastur yiqiladi (41-dars). Uzoq yashovchi pool'da ishchi ichida `recover` qo'yib, xatoni qayd qilish va ishchini davom ettirish yoki aniq qaror (yiqilish) qabul qilish kerak. Xatolar uchun odatda natija kanali yoki callback ishlatiladi. Jimgina tashlash bilan ish yo'qoladi.

### Ishchilar soni

- CPU'ga bog'liq ish: yadrolar soni atrofida.
- I/O'ga bog'liq ish (baza, tarmoq): quyi tizim chidaydigan chegara bilan belgilanadi, masalan, bazadagi ulanishlar soni (78-dars).
- Doim o'lchang. Sonni konfiguratsiyaga chiqaring.
- Pool bitta joyda bo'lsin: har so'rovda yangi pool yaratish chegarani buzadi, bir vaqtda ishlaydigan goroutine soni so'rovlar soniga ko'payadi.

### Rate limiter qanday ishlaydi

Token bucket bitta kanal bilan quriladi: kanal sig'imi `burst`, ichidagi element token. Fon goroutine'i har `interval` da kanalga token yuboradi (to'lgan bo'lsa `default` bilan tashlaydi). `Wait` kanaldan o'qiydi. Natija ham bekor qilinadigan: `Wait(ctx)` `select` da `ctx.Done()` ni ham kutadi.

Bu soddalashtirilgan variant. Uning cheklovlari bor: fon goroutine va ticker (`Close` shart, aks holda leak), token bir butun birlik (kasr tezlik uchun noqulay) va vaqt tiklanishi ticker aniqligiga bog'liq. Ishlab chiqarish uchun sinalgan kutubxona yaxshiroq (yuqorida eslatilgan paket, lekin u bu kursning manbalarida yo'q, shuning uchun foydalanishdan oldin hujjatini o'qing).

## Misol: pool, load shedding va limiter

Birinchi dastur: 2 ishchi va 3 o'rinli navbatli pool. Ishchilar `gate` yopilmaguncha band, shuning uchun natija deterministik. Avval 2 ishni `Submit` bilan berib, ishchilar ularni olishini kutamiz, keyin 8 ta ishni `TrySubmit` bilan yuboramiz.

```go run
package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"sync/atomic"
)

var ErrFull = errors.New("navbat to'la")

type Job struct{ ID int }

// Pool - cheklangan navbatli worker pool.
type Pool struct {
	jobs   chan Job
	wg     sync.WaitGroup
	closed atomic.Bool
}

func NewPool(workers, queue int, handle func(Job)) *Pool {
	p := &Pool{jobs: make(chan Job, queue)}
	for range workers {
		p.wg.Add(1)
		go func() {
			defer p.wg.Done()
			for j := range p.jobs {
				handle(j)
			}
		}()
	}
	return p
}

// Submit navbat to'lsa kutadi: producer sekinlashadi (backpressure).
func (p *Pool) Submit(ctx context.Context, j Job) error {
	select {
	case p.jobs <- j:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

// TrySubmit kutmaydi: navbat to'la bo'lsa ErrFull qaytaradi (load shedding).
func (p *Pool) TrySubmit(j Job) error {
	select {
	case p.jobs <- j:
		return nil
	default:
		return ErrFull
	}
}

// Shutdown yangi ish qabul qilishni to'xtatadi va navbatni tugatadi.
// Faqat submit qiluvchilar tugagandan keyin chaqiriladi.
func (p *Pool) Shutdown() {
	if p.closed.CompareAndSwap(false, true) {
		close(p.jobs)
	}
	p.wg.Wait()
}

func main() {
	gate := make(chan struct{})
	started := make(chan int, 10)
	var done atomic.Int32

	p := NewPool(2, 3, func(j Job) {
		started <- j.ID
		<-gate // ish "tugamaguncha" worker band
		done.Add(1)
	})

	ctx := context.Background()
	p.Submit(ctx, Job{1})
	p.Submit(ctx, Job{2})
	<-started // ikkala worker ham ish boshladi
	<-started

	accepted, rejected := 2, 0
	for id := 3; id <= 10; id++ {
		if err := p.TrySubmit(Job{id}); err != nil {
			rejected++
		} else {
			accepted++
		}
	}
	fmt.Println("qabul qilindi:", accepted, "rad etildi:", rejected)

	close(gate)
	p.Shutdown()
	fmt.Println("bajarildi:", done.Load())
}
```

Natija (Go 1.24.7, `go run -race`):

```text
qabul qilindi: 5 rad etildi: 5
bajarildi: 5
```

Hisob: 2 ish ishchilarda, 3 ish navbatda, jami 5. Qolgan 5 tasi `ErrFull` oldi. `started` kanali ishchilar ishni haqiqatan boshlaganini kutish uchun: busiz birinchi ikki ish hali navbatda bo'lib, qabul qilinganlar soni boshqacha chiqardi. `gate` yopilgach `Shutdown` navbatni tugatadi, hamma 5 ish bajariladi.

Ikkinchi dastur: token bucket. Burst 2, interval 20 ms, 6 ta `Wait`.

```go
package main

import (
	"context"
	"fmt"
	"time"
)

// Limiter - token bucket: sig'imi burst, har interval'da bitta token qo'shiladi.
type Limiter struct {
	tokens chan struct{}
	stop   chan struct{}
}

func NewLimiter(interval time.Duration, burst int) *Limiter {
	l := &Limiter{tokens: make(chan struct{}, burst), stop: make(chan struct{})}
	for range burst {
		l.tokens <- struct{}{}
	}
	go func() {
		t := time.NewTicker(interval)
		defer t.Stop()
		for {
			select {
			case <-t.C:
				select {
				case l.tokens <- struct{}{}:
				default: // chelak to'la
				}
			case <-l.stop:
				return
			}
		}
	}()
	return l
}

func (l *Limiter) Wait(ctx context.Context) error {
	select {
	case <-l.tokens:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func (l *Limiter) Close() { close(l.stop) }

func main() {
	l := NewLimiter(20*time.Millisecond, 2)
	defer l.Close()

	start := time.Now()
	for range 6 {
		if err := l.Wait(context.Background()); err != nil {
			fmt.Println("xato:", err)
			return
		}
	}
	elapsed := time.Since(start)
	// Dastlabki 2 token tayyor, qolgan 4 tasi uchun kamida 4 interval kerak.
	fmt.Println("kamida 80ms ketdi:", elapsed >= 80*time.Millisecond)
}
```

Natija:

```text
kamida 80ms ketdi: true
```

Dastlabki 2 ta token tayyor turadi, qolgan 4 tasi uchun kamida 4 interval, ya'ni 80 ms kerak. Biz aniq vaqtni emas, pastki chegarani tekshirdik: haqiqiy vaqt ticker va scheduler kechikishiga bog'liq va har ishga tushirishda farq qiladi. Aniq vaqtni sinash uchun soatni fake qilish kerak (50-dars).

## Qachon qo'llamaslik kerak

- Ish kam va chegaralangan bo'lsa (masalan, 10 ta so'rov), pool ortiqcha. `errgroup` bilan `SetLimit` (48-dars) yetarli.
- Ishlar bir-biriga bog'liq bo'lsa (bir ish natijasi boshqasini kutadi) va pool to'lib ketsa, deadlock bo'lishi mumkin: ishchilar hammasi bog'liq ishlarni kutib qoladi. Bunday ishlarni bitta pool'ga solmang.
- Navbat uchun katta bufer bilan "ishonchlilik" sotib olmang. Buferdagi ish jarayon yiqilsa yo'qoladi. Yo'qotib bo'lmaydigan ish uchun saqlovchi navbat (baza, broker) kerak (80-dars).
- Rate limiter taqsimlangan tizimda bir nusxa uchun ishlaydi, xolos. Bir nechta nusxa bo'lsa har biri o'z chegarasini qo'llaydi va umumiy tezlik `N` baravar oshadi.
- Limiter va pool yetarli bo'lmagan joyda (masalan, yomon quyi tizim) circuit breaker yoki adaptiv cheklov kerak. Bu kurs doirasidan tashqari.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da bir jarayon bitta event loop'da ishlaydi, shuning uchun "parallellik" asosan I/O tugashi kutilayotgan va'dalar soni. Cheklov kerak bo'lsa, `p-limit`, `p-queue` yoki BullMQ navbatlari ishlatiladi. Farqlar:

| Node.js | Go |
|---|---|
| `p-limit(10)` parallel va'dalarni cheklaydi | Pool yoki semafor goroutine/resurs sonini cheklaydi |
| Stream `highWaterMark` va `drain` hodisasi | Kanal sig'imi va bloklanuvchi yuborish |
| CPU'ga bog'liq ish event loop'ni to'xtatadi, worker thread kerak | CPU'ga bog'liq ish ham goroutine'larda yadrolar bo'ylab taqsimlanadi |
| Backpressure'ni qo'lda boshqarasiz (`pause`, `resume`) | Backpressure kanal semantikasidan bepul keladi |
| `bottleneck`, `rate-limiter-flexible` | Token bucket o'zingiz yoki sub-repository paketi |

Eng muhim farq: Node.js'da navbatni unutish oson (va'dalar to'planadi, xotira o'sadi), Go'da esa kanal bufersiz bo'lsa to'planish imkonsiz, bloklanish bor. Lekin Go'da teskari xavf ham bor: bloklanish yashirin bo'lib, butun handler'ni to'xtatadi. Shuning uchun `Submit` da `ctx` va timeout bo'lishi shart.

## Xulosa

- Chegarasiz `go handle(x)` xotira va quyi tizim uchun xavfli. Worker pool parallellikni oldindan belgilangan `N` bilan cheklaydi.
- Navbat sig'imi qaror: 0 qat'iy backpressure beradi, kichik bufer tebranishni yumshatadi, katta bufer muammoni yashiradi.
- Backpressure producer'ni kutdiradi (`Submit` + `ctx`), load shedding ortiqcha ishni rad etadi (`TrySubmit` + `ErrFull`). Rad etilganlarni sanang.
- To'xtatish tartibi: producer'lar to'xtaydi, kanal yopiladi, ishchilar `WaitGroup` bilan kutiladi. Yopilgan kanalga yuborish panic.
- Rate limiting token bucket: `burst` qisqa ko'tarilishga, `interval` o'rtacha tezlikka javob beradi. `Wait` doim `ctx` qabul qilsin. Vaqtga bog'liq natijalar nodeterministik, shuning uchun pastki chegara tekshiriladi.
