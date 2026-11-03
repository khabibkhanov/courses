---
n: 93
slug: concurrency-arxitektura
title: "Concurrency arxitekturasi: pipeline, supervisor va degradatsiya"
summary: "Goroutine'larni servis darajasida tashkil qilish: pipeline bosqichlari va kanal egaligi, bir guruh sifatida to'xtash (errgroup), qulagan komponentni backoff bilan qayta ishga tushiruvchi supervisor va yuk oshganda tizimni boshqariladigan tarzda yomonlashtirish."
duration: 45
sources:
  - id: blog-pipelines
    note: "Pipeline bosqichlari, fan-out/fan-in va done kanali orqali aniq bekor qilish"
  - id: x-errgroup
    note: "Group, WithContext, Go, SetLimit, TryGo va Wait: birinchi xatoda kontekst bekor qilinishi"
  - id: 100go
    note: "Goroutine qachon to'xtashini bilmay ishga tushirish va kontekstni noto'g'ri uzatish xatolari"
quiz:
  - q: "Pipeline'ning parse bosqichida 3 ta worker goroutine bitta `out` kanaliga yozadi. `out` ni kim yopishi kerak?"
    options:
      - "Har worker o'zi tugagach `close(out)` chaqiradi"
      - "Hamma workerlar tugaganini kutadigan alohida goroutine (WaitGroup.Wait dan keyin) bir marta yopadi"
      - "Qabul qiluvchi (keyingi bosqich), chunki u kanalni o'qiydi"
      - "Hech kim: kanalni yopish shart emas, garbage collector tozalaydi"
    answer: 1
    explain: "Kanalni yuboruvchi tomon yopadi va aynan bir marta. Bir nechta yuboruvchi bo'lsa, ularni sanab, hammasi tugagach yopadigan koordinator kerak. Har worker yopsa, ikkinchi `close` panic beradi. Qabul qiluvchi yopsa, yuboruvchi yopiq kanalga yozib panic qiladi. Yopilmagan kanal esa `range` qiladigan qabul qiluvchini abadiy bloklaydi."
  - q: "`errgroup.WithContext` qaytargan kontekst qachon bekor qilinadi?"
    options:
      - "Faqat Wait chaqirilmaguncha"
      - "Faqat tashqi (ota) kontekst bekor qilinganda"
      - "Har bir Go funksiyasi tugagach"
      - "Go ga berilgan funksiyalardan biri birinchi marta nil bo'lmagan xato qaytarganda yoki Wait birinchi marta qaytganda"
    answer: 3
    explain: "Shu mexanizm 'bittasi yiqilsa, qolganlar to'xtasin' xatti-harakatini beradi. Ota kontekst bekor qilinsa, hosila kontekst ham bekor bo'ladi, lekin bu yagona sabab emas. Oddiy muvaffaqiyatli tugash kontekstni bekor qilmaydi (Wait qaytguncha)."
  - q: "Supervisor xato bo'lgan komponentni kutishsiz va cheksiz qayta ishga tushiradi (`for { run() }`). Komponent har safar 1 ms ichida yiqiladi. Bu nimaga olib keladi?"
    options:
      - "CPU va log'ni to'ldiradigan crash loop: yiqilish sababi bartaraf bo'lmaguncha tizim resurslarini yeb qo'yadi va bog'liq xizmatlarni ham bo'g'adi"
      - "Hech qanday muammo: supervisor shunday ishlashi kerak"
      - "Goroutine'lar o'z-o'zidan to'xtaydi"
      - "Dastur tezroq tiklanadi va bu eng yaxshi strategiya"
    answer: 0
    explain: "Qayta ishga tushirish backoff (kutish vaqti oshib borishi), maksimal urinish soni yoki circuit holatisiz xavfli. Doimiy xato (noto'g'ri sozlama) qayta ishga tushirish bilan tuzalmaydi; supervisor oxirida taslim bo'lib xatoni yuqoriga berishi kerak."
  - q: "Quyidagi kod nima chiqaradi?\n\n```go\nq := make(chan int, 4)\naccepted := 0\nfor i := 0; i < 10; i++ {\n    select {\n    case q <- i:\n        accepted++\n    default:\n    }\n}\nfmt.Println(accepted, len(q))\n```"
    options:
      - "10 4"
      - "4 10"
      - "4 4"
      - "Dastur deadlock bo'ladi"
    answer: 2
    explain: "Buferi 4 bo'lgan kanalga hech kim o'qimasa, to'rtta yuborish muvaffaqiyatli, qolgan oltitasi `default` shoxiga tushadi va tashlanadi. accepted 4, len(q) 4. `default` bo'lmaganida to'rtinchidan keyingi yuborish bloklanib, deadlock bo'lardi. Bu load shedding'ning eng sodda ko'rinishi."
  - q: "Goroutine ichida panic bo'ldi, chaqiruvchi funksiyada `defer func() { recover() }()` bor. Panic ushlanadimi?"
    options:
      - "Yo'q: recover faqat o'z goroutine'idagi deferred funksiyada panic'ni ushlaydi; boshqa goroutine'dagi panic butun jarayonni yiqitadi"
      - "Ha, recover butun jarayondagi har qanday panic'ni ushlaydi"
      - "Ha, lekin faqat main goroutine'da"
      - "Yo'q, lekin jarayon yiqilmaydi, faqat goroutine to'xtaydi"
    answer: 0
    explain: "Panic goroutine'ning o'z stack'i bo'ylab ko'tariladi; boshqa goroutine'ning defer'lari unga ta'sir qilmaydi. Ushlanmagan panic butun dasturni to'xtatadi. Shuning uchun uzoq yashovchi goroutine chegarasida (runRecover kabi) o'z recover'i bo'lishi kerak."
  - q: "GPS nuqtalari oqimi to'lib ketdi. Qaysi qaror to'g'ri?"
    options:
      - "Navbatni cheksiz qilish, xotira yetguncha"
      - "To'lov tranzaksiyalari navbatida ham xuddi shunday eski xabarlarni jimgina tashlash"
      - "Hamma so'rovlarni qabul qilib, hech narsa qaytarmaslik"
      - "Telemetriya uchun yangi nuqta kelganda eskisini tashlash yoki 503 qaytarish mumkin; to'lovlar uchun esa tashlash mumkin emas, backpressure va aniq xato kerak"
    answer: 3
    explain: "Degradatsiya biznes ma'nosiga bog'liq: telemetriyada keyingi nuqta eskisini almashtiradi, to'lovda yo'qolgan xabar pul yo'qotishdir. Cheksiz navbat muammoni yashiradi va OOM bilan tugaydi. Jimgina tashlash esa hisoblagichsiz ko'rinmaydigan ma'lumot yo'qotishdir."
task:
  title: "Panic'ni ushlaydigan va qayta urinadigan Restart"
  prompt: |
    `Restart` funksiyasi `fn` ni xato bo'lsa `maxRestarts` martagacha qayta chaqirishi kerak. Hozir u panic'ni ushlamaydi: `fn` panic qilsa, butun jarayon yiqiladi.

    Funksiyani quyidagicha to'ldiring:

    - `fn` ning panic'i `error`ga aylantirilsin (`panic: <qiymat>`), va `Restart` urinishni davom ettirsin;
    - `ctx` bekor qilingan bo'lsa, yangi urinish boshlanmasin va `context.Cause(ctx)` qaytsin;
    - barcha urinishlar muvaffaqiyatsiz bo'lsa, `"N urinishdan keyin taslim: ..."` xatosi asl xatoni `%w` bilan o'rab qaytsin.

    Imzoni o'zgartirmang. Kutilgan chiqish: `<nil> 3`, keyin `2 urinishdan keyin taslim: doimiy`, keyin `context canceled`.
  lang: go
  starter: |
    package main

    import (
        "context"
        "errors"
        "fmt"
    )

    // Restart fn'ni xato bo'lsa maxRestarts martagacha qayta chaqirishi kerak.
    // Hozir panic'ni ushlamaydi: bitta panic butun jarayonni yiqitadi.
    func Restart(ctx context.Context, maxRestarts int, fn func(context.Context) error) error {
        var err error
        for attempt := 0; attempt <= maxRestarts; attempt++ {
            if err = fn(ctx); err == nil {
                return nil
            }
        }
        return fmt.Errorf("%d urinishdan keyin taslim: %w", maxRestarts+1, err)
    }

    func main() {
        calls := 0
        err := Restart(context.Background(), 3, func(context.Context) error {
            calls++
            if calls == 1 {
                return errors.New("broker uzildi")
            }
            if calls == 2 {
                panic("kutilmagan holat")
            }
            return nil
        })
        fmt.Println(err, calls)
    }
  solution: |
    package main

    import (
        "context"
        "errors"
        "fmt"
    )

    // call fn'ni chaqiradi va panic'ni error'ga aylantiradi.
    func call(ctx context.Context, fn func(context.Context) error) (err error) {
        defer func() {
            if r := recover(); r != nil {
                err = fmt.Errorf("panic: %v", r)
            }
        }()
        return fn(ctx)
    }

    // Restart fn'ni xato yoki panic bo'lsa maxRestarts martagacha qayta chaqiradi.
    // ctx bekor qilinsa darhol to'xtaydi.
    func Restart(ctx context.Context, maxRestarts int, fn func(context.Context) error) error {
        var err error
        for attempt := 0; attempt <= maxRestarts; attempt++ {
            if ctx.Err() != nil {
                return context.Cause(ctx)
            }
            if err = call(ctx, fn); err == nil {
                return nil
            }
        }
        return fmt.Errorf("%d urinishdan keyin taslim: %w", maxRestarts+1, err)
    }

    func main() {
        calls := 0
        err := Restart(context.Background(), 3, func(context.Context) error {
            calls++
            if calls == 1 {
                return errors.New("broker uzildi")
            }
            if calls == 2 {
                panic("kutilmagan holat")
            }
            return nil
        })
        fmt.Println(err, calls)

        err = Restart(context.Background(), 1, func(context.Context) error { return errors.New("doimiy") })
        fmt.Println(err)

        ctx, cancel := context.WithCancel(context.Background())
        cancel()
        fmt.Println(Restart(ctx, 5, func(context.Context) error { return errors.New("ishlamasligi kerak") }))
    }
  solutionNotes: |
    - `call` yordamchisi `defer` + `recover` bilan panic'ni nomlangan natija `err` ga yozadi. `recover` faqat to'g'ridan-to'g'ri deferred funksiyada ishlaydi, shuning uchun u alohida funksiyada turibdi.
    - `ctx.Err()` har urinishdan oldin tekshiriladi, shuning uchun bekor qilingan kontekst yangi urinishni boshlamaydi.
    - Taslim xatosi `%w` bilan asl xatoni o'raydi: chaqiruvchi `errors.Is/As` bilan sababni ko'ra oladi.
    - Haqiqiy supervisor urinishlar orasida backoff kutadi va kutish davomida `ctx.Done()` ni tinglaydi (dars namunasidagi `supervise`).
  checklist:
    - "Panic `error`ga aylanadi va keyingi urinish bajariladi"
    - "Bekor qilingan kontekstda `fn` umuman chaqirilmaydi"
    - "Taslim xatosi asl xatoni `%w` bilan o'raydi"
    - "Chiqish: `<nil> 3`, `2 urinishdan keyin taslim: doimiy`, `context canceled`"
    - "`go vet` va `go run -race` ogohlantirishsiz o'tadi"
---

## Muammo

Servis kichikligida goroutine'lar bir-ikki joyda ishga tushadi. Yuk va funksiyalar o'sgach, `go func()` har yerda paydo bo'ladi: qabul qiluvchi, parser, yozuvchi, metrika yuboruvchi, kesh yangilovchi. Shundan keyin umumiy muammolar chiqadi, va ular kodning bir joyida emas, tizim shaklida:

- Goroutine "jimgina o'ladi": xato qaytarilishi mumkin bo'lgan joy yo'q, shuning uchun u logsiz tugaydi, servis esa ishlayotgandek ko'rinadi, lekin navbatni hech kim o'qimaydi.
- Bitta goroutine'dagi `panic` butun jarayonni yiqitadi (33-dars), chunki boshqa goroutine'ning `recover`i uni ushlay olmaydi.
- Bitta sekin bog'liq xizmat (masalan geokodlash) hamma so'rovlarni kutdiradi, so'rovlar to'planadi, xotira to'ladi va servis cascading failure bilan yiqiladi.
- Navbat cheksiz, shuning uchun pik yuk OOM'ga aylanadi.

Node.js'da bu muammolarning ba'zilari boshqacha ko'rinadi: bitta jarayon, bitta event loop, yiqilgan jarayonni esa tashqi vosita (PM2, Kubernetes) qayta ishga tushiradi. Go'da jarayon ichida yuzlab mustaqil ijrochilar bor va "kim kimning egasi, kim kimni to'xtatadi, nima yiqilsa nima bo'ladi" savollariga javob dasturning o'zida bo'lishi kerak. Bu dars shu javobni uchta qatlamda beradi: pipeline tuzilmasi (47-dars), guruh sifatida hayot sikli (48-dars) va chidamlilik: supervisor hamda degradatsiya (49-dars).

## Asosiy g'oya

### Pipeline: bosqichlar va egalik

Go Blog'dagi "Pipelines and cancellation" maqolasi pipeline'ni kanallar bilan bog'langan bosqichlar zanjiri sifatida ta'riflaydi: har bosqich kirish kanalidan o'qiydi, ishlov beradi va chiqish kanaliga yozadi. Maqola ikki qoidani ta'kidlaydi: bosqich barcha yuborishlari tugagach chiqish kanalini yopadi; bosqich kirish kanali yopilguncha yoki yuboruvchilar to'sib qo'yilmaguncha o'qishda davom etadi. Uchinchi muhim fikr - aniq bekor qilish: yuqori oqimdagi bosqich to'xtasa yoki iste'molchi ketib qolsa, pastdagi goroutine'lar yopiq kanalga yoki hech kim o'qimaydigan kanalga bloklanib qolmasligi kerak. Bugun buning standart vositasi `context`: har yuborish `select` ichida `ctx.Done()` bilan birga turadi (34-dars).

Egalik qoidasi sodda: kanalni yuboruvchi yopadi, aynan bir marta. Bir nechta yuboruvchi bo'lganda (fan-out) ularni sanab, hammasi tugagach yopadigan koordinator goroutine kerak; namunadagi `go func() { wg.Wait(); close(out) }()` shu vazifani bajaradi.

### Guruh: bitta vazifa, bir hayot sikli

Pipeline'dagi goroutine'larni alohida `go` bilan tarqatib yuborish o'rniga bitta guruhga yig'amiz. `golang.org/x/sync/errgroup` hujjatiga ko'ra `Group` - bir umumiy vazifaning pastki vazifalarida ishlaydigan goroutine'lar to'plami. `WithContext` guruh va hosila kontekst qaytaradi; kontekst `Go` ga berilgan funksiyalardan biri birinchi marta xato qaytarganda yoki `Wait` birinchi marta qaytganda bekor qilinadi. `Wait` hamma funksiya qaytguncha kutadi va birinchi nil bo'lmagan xatoni beradi. `SetLimit` bir vaqtda ishlayotgan goroutine sonini cheklaydi, `TryGo` esa limit to'la bo'lsa bloklanmasdan `false` qaytaradi. Bu ikkalasi guruhni degradatsiya vositasiga ham aylantiradi.

Mexanizm shunchalik kichikki, uni standart kutubxona bilan to'liq ko'rsatish mumkin: `sync.WaitGroup`, birinchi xatoni saqlovchi `sync.Once` va `context.WithCancelCause`. Dars namunasidagi `Group` shu uchta qismdan iborat va x/sync'ning to'liq o'rnini bosmaydi, ammo g'oyani ochiq ko'rsatadi: birinchi xato `cancel(err)` bilan hammaga yetib boradi. Production'da tayyor `errgroup` ishlating:

```go
// Kompilyatsiya qilinmagan: golang.org/x/sync sandbox'da yuklanmaydi; API pkg.go.dev hujjatiga tayanadi.
g, ctx := errgroup.WithContext(ctx)
g.SetLimit(8)
for _, id := range vehicleIDs {
	g.Go(func() error { return syncVehicle(ctx, id) })
}
if err := g.Wait(); err != nil {
	return fmt.Errorf("sync: %w", err)
}
```

## Chuqurroq: supervisor va degradatsiya

### Supervisor: uzoq yashovchi komponentlar

Guruh "bitta vazifa, bitta natija" uchun. Servisda esa uzoq yashovchi komponentlar bor: broker iste'molchisi, kesh yangilovchi, fon hisoblagich. Ular vaqtinchalik sabab bilan yiqilishi mumkin (ulanish uzildi), va jarayonni to'liq qayta ishga tushirmasdan komponentni tiklash ma'qul. Supervisor shuni qiladi: komponentni chaqiradi, panic'ni `recover` bilan xatoga aylantiradi, xato bo'lsa kutib qayta ishga tushiradi. Namunadagi `supervise` to'rt qoidaga amal qiladi:

1. Panic xatoga aylanadi (`runRecover`), chunki ushlanmagan panic jarayonni yiqitadi.
2. Qayta urinishlar orasida backoff kutiladi (`base << attempt`, ya'ni har safar ikki baravar). Real tizimda tasodifiy tebranish (jitter) qo'shiladi, shunda ko'p nusxa bir vaqtda urinmaydi; namunada deterministik chiqish uchun u yo'q.
3. Urinishlar soni cheklangan; limit tugagach supervisor xatoni yuqoriga beradi. Doimiy xato (noto'g'ri sozlama) qayta ishga tushirish bilan tuzalmaydi va yuqori qatlam (oxir-oqibat orkestrator) qaror qilishi kerak.
4. Kontekst bekor qilinganda supervisor to'xtaydi, qayta ishga tushirmaydi va kutish davomida ham `ctx.Done()` ni tinglaydi.

Kamchilik: namunada urinish hisoblagichi hech qachon nolga qaytmaydi. Komponent bir soat barqaror ishlab, keyin yana yiqilsa, hammasi bitta "umumiy limit"ka tushadi. Real supervisor barqaror ishlash davridan keyin hisoblagichni tiklaydi. Bu qismni namunada qoldirdik, chunki u vaqt siyosatini talab qiladi va o'lchanmagan.

### Degradatsiya: boshqariladigan yomonlashuv

Yuk kuchayganda tizim ikki yo'ldan biriga ketadi: hammani sekin qabul qilib yiqiladi yoki bir qismini tez rad etib qolganini saqlaydi. Ikkinchisi load shedding deb ataladi va bir necha vositadan tuziladi:

- Chegaralangan navbat. Navbat sig'imi tizimning xotira va kechikish byudjetini belgilaydi. To'lganda `select` ichida `default` shoxi yuborishni rad etadi (namunadagi `TryPush`), va tashlangan elementlar hisoblagichda ko'rinadi.
- Timeout va fallback. Majburiy bo'lmagan bog'liq xizmatga qisqa deadline beriladi; vaqt tugasa, "noma'lum" kabi zaxira qiymat qaytariladi (`enrich`). Asosiy yo'l ishlashda davom etadi.
- Chekkada rad etish. So'rovni eng oxirgi bosqichda rad etgandan ko'ra darvozada rad etish arzon: u hali resurs sarflamagan (95-darsda 503 va `Retry-After`).

Bularning hammasi biznes ma'nosiga bog'liq. GPS nuqtasida keyingi nuqta eskisining o'rnini bosadi, shuning uchun eskisini tashlash mumkin. To'lov xabarini tashlash mumkin emas: u yerda backpressure (yuboruvchini kutdirish) yoki aniq xato va qayta urinish kerak (80-dars). Qaysi ma'lumot yo'qolsa bo'lishini texnik emas, mahsulot qarori belgilaydi, va bu qaror kodda ochiq yozilgan bo'lishi kerak.

## Misol: pipeline, supervisor va degradatsiya birgalikda

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

// --- 1. Group: errgroup'ning standart kutubxonadagi minimal ekvivalenti ---

type Group struct {
	wg     sync.WaitGroup
	once   sync.Once
	err    error
	cancel context.CancelCauseFunc
}

func NewGroup(ctx context.Context) (*Group, context.Context) {
	ctx, cancel := context.WithCancelCause(ctx)
	return &Group{cancel: cancel}, ctx
}

func (g *Group) Go(f func() error) {
	g.wg.Add(1)
	go func() {
		defer g.wg.Done()
		if err := f(); err != nil {
			g.once.Do(func() {
				g.err = err
				g.cancel(err)
			})
		}
	}()
}

func (g *Group) Wait() error {
	g.wg.Wait()
	g.cancel(nil)
	return g.err
}

// --- 2. Pipeline: generator -> parallel parse -> yig'ish ---

func generate(ctx context.Context, lines []string) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		for _, l := range lines {
			select {
			case out <- l:
			case <-ctx.Done():
				return
			}
		}
	}()
	return out
}

func parseStage(ctx context.Context, g *Group, in <-chan string, workers int) <-chan int {
	out := make(chan int)
	var wg sync.WaitGroup
	for range workers {
		wg.Add(1)
		g.Go(func() error {
			defer wg.Done()
			for l := range in {
				var v int
				if _, err := fmt.Sscanf(l, "%d", &v); err != nil {
					return fmt.Errorf("parse %q: %w", l, err)
				}
				select {
				case out <- v:
				case <-ctx.Done():
					return context.Cause(ctx)
				}
			}
			return nil
		})
	}
	go func() { wg.Wait(); close(out) }()
	return out
}

func sumPipeline(lines []string) (int, error) {
	g, ctx := NewGroup(context.Background())
	sum := 0
	done := make(chan struct{})
	vals := parseStage(ctx, g, generate(ctx, lines), 3)
	go func() {
		defer close(done)
		for v := range vals {
			sum += v
		}
	}()
	err := g.Wait()
	<-done
	return sum, err
}

// --- 3. Supervisor: qulagan komponentni backoff bilan qayta ishga tushirish ---

func supervise(ctx context.Context, name string, maxRestarts int, base time.Duration, fn func(context.Context) error) error {
	for attempt := 0; ; attempt++ {
		err := runRecover(ctx, fn)
		if err == nil || ctx.Err() != nil {
			return nil
		}
		if attempt >= maxRestarts {
			return fmt.Errorf("%s: %d marta qayta ishga tushirildi, taslim: %w", name, attempt, err)
		}
		fmt.Printf("%s: xato (%v), %d-qayta ishga tushirish\n", name, err, attempt+1)
		select {
		case <-time.After(base << attempt):
		case <-ctx.Done():
			return nil
		}
	}
}

func runRecover(ctx context.Context, fn func(context.Context) error) (err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	return fn(ctx)
}

// --- 4. Degradatsiya: chegaralangan navbat va fallback ---

type Queue struct {
	ch      chan int
	dropped atomic.Int64
}

func (q *Queue) TryPush(v int) bool {
	select {
	case q.ch <- v:
		return true
	default:
		q.dropped.Add(1)
		return false
	}
}

func enrich(ctx context.Context, slow time.Duration) string {
	ctx, cancel := context.WithTimeout(ctx, 50*time.Millisecond)
	defer cancel()
	res := make(chan string, 1)
	go func() {
		time.Sleep(slow)
		res <- "Toshkent, Chilonzor"
	}()
	select {
	case s := <-res:
		return s
	case <-ctx.Done():
		return "noma'lum (fallback)"
	}
}

func main() {
	sum, err := sumPipeline([]string{"10", "20", "30", "40", "50"})
	fmt.Println("yig'indi:", sum, err)

	_, err = sumPipeline([]string{"10", "x7", "30"})
	fmt.Println("xatoli pipeline:", err)

	calls := 0
	err = supervise(context.Background(), "consumer", 3, 5*time.Millisecond, func(ctx context.Context) error {
		calls++
		switch calls {
		case 1:
			return errors.New("broker uzildi")
		case 2:
			var m map[string]int
			m["x"] = 1
		}
		return nil
	})
	fmt.Println("supervisor natijasi:", err, "chaqiruvlar:", calls)

	err = supervise(context.Background(), "doimiy-xato", 2, time.Millisecond, func(context.Context) error {
		return errors.New("har doim yiqiladi")
	})
	fmt.Println(err)

	q := &Queue{ch: make(chan int, 4)}
	accepted := 0
	for i := 0; i < 10; i++ {
		if q.TryPush(i) {
			accepted++
		}
	}
	fmt.Println("qabul qilindi:", accepted, "tashlandi:", q.dropped.Load())

	fmt.Println("tez:", enrich(context.Background(), time.Millisecond))
	fmt.Println("sekin:", enrich(context.Background(), 300*time.Millisecond))

}
```

Go 1.24.7, linux/amd64, `go run -race .`:

```text
yig'indi: 150 <nil>
xatoli pipeline: parse "x7": expected integer
consumer: xato (broker uzildi), 1-qayta ishga tushirish
consumer: xato (panic: assignment to entry in nil map), 2-qayta ishga tushirish
supervisor natijasi: <nil> chaqiruvlar: 3
doimiy-xato: xato (har doim yiqiladi), 1-qayta ishga tushirish
doimiy-xato: xato (har doim yiqiladi), 2-qayta ishga tushirish
doimiy-xato: 2 marta qayta ishga tushirildi, taslim: har doim yiqiladi
qabul qilindi: 4 tashlandi: 6
tez: Toshkent, Chilonzor
sekin: noma'lum (fallback)
```

Nimaga e'tibor berish kerak:

- `sumPipeline` uch workerli parse bosqichini ishlatadi. Birinchi senariyda yig'indi 150. Ikkinchisida `x7` satri parse bo'lmaydi, worker xato qaytaradi, guruh kontekstni bekor qiladi va generator hamda qolgan workerlar `ctx.Done()` orqali to'xtaydi. `Wait` birinchi xatoni qaytaradi. Goroutine qolib ketmaydi.
- Supervisor birinchi chaqiruvda oddiy xatoni, ikkinchisida nil map'ga yozishdagi panic'ni ushladi va uchinchi urinishda muvaffaqiyat topdi (`chaqiruvlar: 3`). Doimiy xatoli komponent uchun esa uchinchi urinishdan keyin taslim bo'lib, asl xatoni o'rab qaytardi.
- 10 ta element 4 sig'imli navbatga: 4 qabul, 6 tashlandi. Hisoblagich tashlanganlarni ko'rsatadi, shuning uchun yo'qotish ko'rinadi.
- `enrich` 50 ms deadline bilan ishlaydi: tez bog'liq xizmat natija beradi, sekini (300 ms) uchun zaxira qiymat qaytadi. `enrich` goroutine'i buferli kanalga yozgani uchun deadline o'tgach ham bloklanmaydi, ya'ni leak bo'lmaydi (41-dars).

## Qachon qo'llamaslik kerak

- Har concurrency uchun pipeline yoki supervisor kerak emas. Oddiy "ikkita so'rovni parallel yubor va natijani kut" `errgroup` bilan hal bo'ladi. Ketma-ket kod yetarli bo'lsa, ketma-ket qoldiring: concurrency murakkablik qo'shadi (100 Go Mistakes: concurrency har doim tezroq emas).
- Supervisor xatoni yashiradigan qatlamga aylanmasin. Dastur qayta ishga tushirib bo'lmaydigan holatda (buzilgan ichki invariant, bo'shamagan resurs) bo'lsa, tez yiqilish va tashqi orkestrator (Kubernetes) qayta ishga tushirishi ma'qul. Panic'ni ushlab davom etish holatni noaniq qoldirishi mumkin.
- Degradatsiya jimgina bo'lmasin. Tashlangan, fallback bilan almashtirilgan yoki o'tkazib yuborilgan har holat metrika yoki logda ko'rinsin, aks holda "ishlayapti" va "ma'lumot yo'qolyapti" ajratilmaydi (85-dars).
- To'lov, buyurtma kabi yo'qolmasligi shart ma'lumotlarda load shedding kerak emas. U yerda navbatni tashqi, bardoshli saqlashga (97-dars) yoki outbox'ga (80-dars) olib chiqing.
- Standart kutubxonadagi mini `Group`ni production'ga ko'chirmang: `errgroup` sinovdan o'tgan, `SetLimit` va `TryGo` bor.

## Stack'da: Node.js bilan solishtirish

| Muammo | Node.js | Go |
|---|---|---|
| Parallel vazifalar | `Promise.all` birinchi rad etishda qaytadi, qolgan promise'lar ishlashda davom etadi | `errgroup` + kontekst: qolganlar bekor qilinadi, ular `ctx.Done()` ni tinglashi shart |
| Fon komponent yiqildi | `unhandledRejection`, jarayon yiqiladi; tiklash PM2/orkestratorda | Jarayon ichida supervisor yoki tashqi orkestrator |
| Panic / uncaught | `process.on('uncaughtException')` global | Faqat o'z goroutine'ida `recover`; global ushlagich yo'q |
| Navbat to'lishi | Promise zanjiri xotirada to'planadi | Chegaralangan kanal, to'lganda `select/default` |
| Bekor qilish | `AbortController`, qo'lda uzatiladi | `context.Context`, birinchi parametr |

Muhim farq - `Promise.all`: u birinchi xatoda natijani qaytaradi, lekin boshqa promise'larni to'xtatmaydi. `errgroup` ham o'zi hech narsani to'xtatmaydi; u faqat kontekstni bekor qiladi, qolganlar uni tinglamasa, ishlashda davom etadi. Shuning uchun har uzoq operatsiya kontekstni qabul qilishi shart.

## Xulosa

- Pipeline bosqichlari kanallar bilan bog'lanadi; kanalni yuboruvchi yopadi, bir marta; ko'p yuboruvchida koordinator yopadi.
- Goroutine'larni guruhga yig'ing: birinchi xato kontekstni bekor qiladi, `Wait` hammasini kutadi (`errgroup`, `SetLimit`).
- Uzoq yashovchi komponentni supervisor ostiga qo'ying: panic'ni xatoga aylantiring, backoff va urinish limiti qo'ying, kontekstda to'xtang.
- Navbatni chegaralang va to'lganda nima bo'lishini (tashlash, rad etish, kutdirish) mahsulot ma'nosiga qarab tanlang.
- Majburiy bo'lmagan bog'liqlikka deadline va fallback bering; har tashlash va fallback'ni hisoblang.
- Boshqa goroutine'dagi panic'ni `recover` ushlamaydi: har uzoq yashovchi goroutine chegarasida o'z `recover`i bo'lsin.
