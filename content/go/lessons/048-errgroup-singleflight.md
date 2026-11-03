---
n: 48
slug: errgroup-singleflight
title: "errgroup, semaphore va singleflight"
summary: "golang.org/x/sync paketlaridagi errgroup (guruh, birinchi xato, SetLimit), semaphore (vaznli cheklov) va singleflight (bir xil so'rovlarni birlashtirish) mexanizmlari, ularning standart kutubxona bilan ekvivalenti va xavfli joylari."
duration: 45
sources:
  - id: x-errgroup
    note: "errgroup paketi: WithContext, Go, SetLimit, TryGo, Wait; birinchi xato kontekstni bekor qiladi"
  - id: x-semaphore
    note: "semaphore paketi: NewWeighted, Acquire(ctx, n), TryAcquire, Release"
  - id: x-singleflight
    note: "singleflight paketi: Do, DoChan, Forget; bir kalit uchun bitta ijro"
quiz:
  - q: "`errgroup.WithContext` qaytargan kontekst qachon bekor qilinadi?"
    options:
      - "Faqat `Wait` qaytganda"
      - "Faqat har bir goroutine tugaganda"
      - "Go ga berilgan funksiya birinchi marta nil bo'lmagan xato qaytarganda yoki `Wait` birinchi marta qaytganda"
      - "Faqat parent kontekst bekor bo'lganda"
    answer: 2
    explain: "Paket hujjati ikkala holatni ko'rsatadi: birinchi xato kontekstni bekor qiladi, shuningdek Wait qaytgach ham u bekor bo'ladi. Shuning uchun Wait dan keyin bu kontekstni boshqa ishda ishlatmang."
  - q: "`g.SetLimit(3)` o'rnatilgan, 10 ta `g.Go(f)` ketma-ket chaqiriladi. To'rtinchi `Go` chaqiruvida nima bo'ladi?"
    options:
      - "Chaqiruvchi goroutine bo'sh joy chiqquncha bloklanadi"
      - "Funksiya jimgina tashlab yuboriladi"
      - "Panic bo'ladi"
      - "To'rtinchi goroutine ishga tushadi, limit faqat tavsiya"
    answer: 0
    explain: "Go limit to'lganda chaqiruvchini bloklaydi. Bloklamasdan sinash kerak bo'lsa TryGo ishlatiladi: u false qaytaradi. Dars misolidagi mini-Group ham shu tarzda semafor kanali bilan yozilgan."
  - q: "Singleflight bilan 10 ta bir vaqtdagi so'rov bir kalit uchun `Do` ni chaqirdi. Birinchisi 2 soniya ishlaydi va xato bilan tugadi. Qolgan 9 tasi nimani oladi?"
    options:
      - "Har biri o'z funksiyasini qayta ishga tushiradi"
      - "Hech narsa, ular abadiy kutadi"
      - "Faqat nil natija"
      - "Birinchisining aynan o'sha natijasi va xatosi, shared=true bilan"
    answer: 3
    explain: "Takroriy chaqiruvchilar asl chaqiruv tugashini kutadi va bir xil (qiymat, xato) ni oladi. Xato ham ulashiladi. Shuning uchun asl chaqiruvning muvaffaqiyatsizligi kutib turgan hammaga ta'sir qiladi."
  - q: "Singleflight ichida birinchi chaqiruvchi o'z `ctx` sini funksiyaga berdi va keyin mijoz ulanishni uzdi (ctx bekor). Boshqa kutayotgan chaqiruvchilarga nima bo'lishi mumkin?"
    options:
      - "Hech narsa: ular alohida ctx bilan ishlaydi"
      - "Ular ham bekor qilingan ctx dan kelgan xatoni oladi, chunki funksiya bitta"
      - "Singleflight avtomatik yangi ctx yaratadi"
      - "Panic bo'ladi"
    answer: 1
    explain: "Funksiya faqat bir marta, birinchi chaqiruvchining ctx si bilan ishlaydi. U bekor bo'lsa natija xato bo'ladi va hamma kutuvchiga tarqaladi. Yechim: ulashiladigan ishda mustaqil ctx (masalan, vaqt chegarasi bilan) ishlatish. Bu muallif xulosasi, hujjatdagi qoida emas."
  - q: "Nega weighted semaphore oddiy `chan struct{}` dan afzal bo'lishi mumkin?"
    options:
      - "U tezroq ishlaydi"
      - "U goroutine leak'ni oldini oladi"
      - "Har vazifa turli og'irlikdagi resurs (masalan, 1 yoki 4 birlik) talab qila oladi va Acquire ctx bilan bekor qilinadi"
      - "U data race'ni yo'q qiladi"
    answer: 2
    explain: "Semaphore NewWeighted(n) umumiy sig'imni n birlik qilib, har Acquire(ctx, k) k birlik oladi. Oddiy kanal faqat teng og'irlikdagi slotlarni beradi. Acquire ctx ni qabul qilgani uchun kutish bekor qilinadi."
  - q: "`errgroup` ning `Wait` metodi bir nechta goroutine xato qaytarganda nimani qaytaradi?"
    options:
      - "Birinchi nil bo'lmagan xatoni"
      - "Hamma xatolarning birlashmasini"
      - "Oxirgi xatoni"
      - "Har doim nil"
    answer: 0
    explain: "Hujjatga ko'ra Wait barcha chaqiruvlar tugashini kutadi va ularning birinchi nil bo'lmagan xatosini qaytaradi. Hamma xatolar kerak bo'lsa, ularni o'zingiz yig'asiz (masalan, errors.Join bilan)."
task:
  title: "Parallellik chegarasi va birinchi xatoda bekor qilish"
  prompt: |
    `fetchAll` 20 ta qurilma uchun `fetchPosition` ni chaqiradi. Hozir u har id uchun goroutine ishga tushiradi, `limit` parametrini e'tiborsiz qoldiradi va xatolarni yo'qotadi.

    Starter: bir vaqtda 20 ta chaqiruv ishlaydi (eng ko'p parallel: 20) va xato `nil` qaytadi, shuning uchun `main` 1 kod bilan chiqadi.

    `fetchAll` ni tuzating: bir vaqtda ko'pi bilan `limit` ta chaqiruv ishlasin, birinchi xato qolganlarini `ctx` orqali bekor qilsin va `fetchAll` shu birinchi xatoni qaytarsin. x/sync ishlatmang: bu yerda standart kutubxona bilan yoziladi (mexanizm errgroup ning o'zi). Qurilma 7 xato beradi, shuning uchun natija `qurilma 7: javob yo'q` bo'lishi va eng ko'p parallel 4 dan oshmasligi kerak. `go run -race` ogohlantirishsiz o'tsin.
  lang: go
  starter: |
    package main

    import (
        "context"
        "errors"
        "fmt"
        "os"
        "sync"
        "sync/atomic"
        "time"
    )

    var (
        running atomic.Int32
        peak    atomic.Int32
    )

    // fetchPosition qurilma joylashuvini tashqi servisdan oladi (simulyatsiya).
    func fetchPosition(ctx context.Context, id int) error {
        cur := running.Add(1)
        defer running.Add(-1)
        for {
            p := peak.Load()
            if cur <= p || peak.CompareAndSwap(p, cur) {
                break
            }
        }
        select {
        case <-time.After(10 * time.Millisecond):
        case <-ctx.Done():
            return ctx.Err()
        }
        if id == 7 {
            return errors.New("qurilma 7: javob yo'q")
        }
        return nil
    }

    // fetchAll barcha id'lar uchun fetchPosition chaqiradi.
    func fetchAll(ctx context.Context, ids []int, limit int) error {
        var wg sync.WaitGroup
        for _, id := range ids {
            wg.Add(1)
            go func() {
                defer wg.Done()
                fetchPosition(ctx, id)
            }()
        }
        wg.Wait()
        return nil
    }

    func main() {
        ids := make([]int, 20)
        for i := range ids {
            ids[i] = i + 1
        }
        err := fetchAll(context.Background(), ids, 4)
        fmt.Println("xato:", err)
        fmt.Println("eng ko'p parallel:", peak.Load())
        if err == nil || peak.Load() > 4 {
            os.Exit(1)
        }
    }
  solution: |
    package main

    import (
        "context"
        "errors"
        "fmt"
        "os"
        "sync"
        "sync/atomic"
        "time"
    )

    var (
        running atomic.Int32
        peak    atomic.Int32
    )

    // fetchPosition qurilma joylashuvini tashqi servisdan oladi (simulyatsiya).
    func fetchPosition(ctx context.Context, id int) error {
        cur := running.Add(1)
        defer running.Add(-1)
        for {
            p := peak.Load()
            if cur <= p || peak.CompareAndSwap(p, cur) {
                break
            }
        }
        select {
        case <-time.After(10 * time.Millisecond):
        case <-ctx.Done():
            return ctx.Err()
        }
        if id == 7 {
            return errors.New("qurilma 7: javob yo'q")
        }
        return nil
    }

    // fetchAll barcha id'lar uchun fetchPosition chaqiradi: bir vaqtda ko'pi bilan
    // limit ta, birinchi xatoda qolganlari bekor qilinadi.
    func fetchAll(ctx context.Context, ids []int, limit int) error {
        ctx, cancel := context.WithCancel(ctx)
        defer cancel()

        var (
            wg      sync.WaitGroup
            errOnce sync.Once
            first   error
        )
        sem := make(chan struct{}, limit)

    loop:
        for _, id := range ids {
            select {
            case sem <- struct{}{}:
            case <-ctx.Done():
                break loop
            }
            wg.Add(1)
            go func() {
                defer func() {
                    <-sem
                    wg.Done()
                }()
                if err := fetchPosition(ctx, id); err != nil {
                    errOnce.Do(func() {
                        first = err
                        cancel()
                    })
                }
            }()
        }
        wg.Wait()
        return first
    }

    func main() {
        ids := make([]int, 20)
        for i := range ids {
            ids[i] = i + 1
        }
        err := fetchAll(context.Background(), ids, 4)
        fmt.Println("xato:", err)
        fmt.Println("eng ko'p parallel:", peak.Load())
        if err == nil || peak.Load() > 4 {
            os.Exit(1)
        }
    }
  solutionNotes: |
    - `sem` kanali sig'imi `limit` bo'lgan semafor. Goroutine ishga tushirishdan oldin slot olinadi, shuning uchun bir vaqtda `limit` tadan ko'p goroutine bo'lmaydi. Xuddi shu usul `errgroup.SetLimit` ichida ishlaydi.
    - Slot olish `select` ichida `ctx.Done()` bilan kutiladi. Birinchi xatodan keyin yangi goroutine ishga tushirilmaydi va tsikl `break loop` bilan tugaydi.
    - `sync.Once` birinchi xatoni saqlaydi va `cancel()` ni chaqiradi. Keyingi xatolar (odatda `context.Canceled`) e'tiborsiz qoladi.
    - `wg.Wait()` dan keyin `first` ni o'qish xavfsiz: `Done` `Wait` qaytishidan oldin sinxronlanadi (43-dars).
    - x/sync mavjud bo'lgan loyihada shu kod `g, ctx := errgroup.WithContext(ctx); g.SetLimit(limit); g.Go(...); return g.Wait()` ko'rinishiga keladi. Bu variant sandbox'da kompilyatsiya qilinmagan.
  checklist:
    - "Eng ko'p parallel chaqiruv 4 dan oshmaydi"
    - "Qaytgan xato `qurilma 7: javob yo'q`"
    - "Birinchi xatodan keyin yangi goroutine ishga tushmaydi"
    - "`go run -race` va `go vet` ogohlantirishsiz o'tadi"
---

## Muammo

47-darsda pipeline'ni qo'lda qurdik: `WaitGroup`, `sync.Once`, `select` va kontekst. Shu qismlar qayta-qayta uchraydi, shuning uchun Go jamoasi ularni `golang.org/x/sync` modulida tayyor paketlarga aylantirgan. Uchta paket deyarli har bir backend loyihada bor:

- **errgroup**: bir guruh goroutine, birinchi xato va umumiy bekor qilish, ixtiyoriy parallellik chegarasi.
- **semaphore**: vaznli semafor, ya'ni resursning cheklangan miqdorini ulashish.
- **singleflight**: bir xil kalit uchun bir vaqtdagi chaqiruvlarni bittaga birlashtirish.

Telemetriya servisida bu uchala holat ham uchraydi. 200 qurilma joylashuvini tashqi servisdan olish kerak, lekin servis bir vaqtda 10 tadan ortiq so'rovni ko'tarmaydi (cheklov). Birinchi xatoda qolgan so'rovlar befoyda (bekor qilish). Va bir qurilma uchun bir xil ma'lumotni 50 ta handler bir vaqtda so'rasa, tashqi servisga bitta so'rov yetadi (birlashtirish).

Muhim eslatma: bu paketlar standart kutubxonada emas, sub-repository ichida. Ularni `go get golang.org/x/sync` bilan qo'shasiz. Sandbox'imizda x/sync yuklanmaydi, shuning uchun bu darsda x/sync kodi kompilyatsiya qilinmagan deb belgilangan, mexanizmning o'zi esa standart kutubxonadagi mini-analoglar bilan ko'rsatilgan va `-race` bilan tekshirilgan.

## Asosiy g'oya

### errgroup

Paket hujjati uni shunday ta'riflaydi: umumiy vazifaning qism-vazifalarini bajaruvchi goroutine'lar guruhi uchun sinxronlash, xatoni tarqatish va kontekstni bekor qilish. Interfeys kichik:

- `errgroup.WithContext(ctx)` guruh va undan hosil bo'lgan yangi kontekst qaytaradi. Bu kontekst `Go` ga berilgan funksiya birinchi marta nil bo'lmagan xato qaytarganda yoki `Wait` birinchi marta qaytganda bekor qilinadi.
- `g.Go(f)` `f func() error` ni yangi goroutine'da ishga tushiradi.
- `g.Wait()` hamma chaqiruv tugashini kutadi va birinchi nil bo'lmagan xatoni qaytaradi.
- `g.SetLimit(n)` faol goroutine'lar sonini `n` bilan cheklaydi. Limit to'lganda `Go` chaqiruvchini bloklaydi. Manfiy limit chegarani olib tashlaydi. `SetLimit` faol goroutine'lar bor paytda chaqirilmasligi kerak.
- `g.TryGo(f)` shunday, lekin bloklanmaydi: limit to'la bo'lsa `false` qaytaradi va funksiyani ishga tushirmaydi.

Usulning ikkita xususiyatini darhol eslab qoling. Birinchisi: xato yagona, ya'ni birinchisi. Qolganlari yo'qoladi, odatda `context.Canceled` bo'lgani uchun bu mantiqiy. Ikkinchisi: guruhdagi goroutine'lar o'zlari `ctx` ni kuzatishi kerak. errgroup goroutine'ni majburan to'xtata olmaydi, u faqat `ctx.Done()` ni yopadi (41-dars).

Tipik foydalanish (kompilyatsiya qilinmagan, x/sync talab qilinadi):

```go
func fetchAll(ctx context.Context, ids []int) error {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(10)
	for _, id := range ids {
		g.Go(func() error {
			return fetchPosition(ctx, id)
		})
	}
	return g.Wait()
}
```

`id` har iteratsiyada o'z nusxasiga ega (Go 1.22 dan beri har iteratsiyada yangi o'zgaruvchi), shuning uchun closure xavfsiz. `ctx` ni qayta e'lon qilish (`g, ctx :=`) ichki funksiyalar guruh kontekstini ko'rishini ta'minlaydi.

### semaphore

`golang.org/x/sync/semaphore` vaznli semafor beradi. `semaphore.NewWeighted(n)` umumiy sig'imi `n` bo'lgan semafor yaratadi. `Acquire(ctx, k)` `k` birlik oladi va bo'sh joy chiqquncha yoki `ctx` bekor bo'lguncha bloklanadi (xato qaytaradi). `TryAcquire(k)` bloklanmaydi. `Release(k)` birlikni qaytaradi.

Oddiy `chan struct{}` ham semafor vazifasini bajaradi va go memory model aynan shu idiomani hujjatlaydi: sig'imi `C` bo'lgan kanalda `k`-chi qabul `k+C`-chi yuborishdan oldin sodir bo'ladi, ya'ni bir vaqtda `C` tadan ko'p yuborish ochiq turmaydi (43-dars). Vaznli semafor kerak bo'lganda ma'noli: bir vazifa 1 birlik, boshqasi (masalan, katta fayl) 4 birlik talab qilganda.

Kompilyatsiya qilinmagan namuna:

```go
func resize(ctx context.Context, sem *semaphore.Weighted, size int64) error {
	if err := sem.Acquire(ctx, size); err != nil {
		return err
	}
	defer sem.Release(size)
	return doResize(ctx, size)
}
```

`Acquire` xato qaytarsa, birlik olinmagan: `Release` chaqirmang.

### singleflight

`golang.org/x/sync/singleflight` bir kalit uchun bir vaqtda faqat bitta ijroni kafolatlaydi. `Group.Do(key, fn)` `(v, err, shared)` qaytaradi: agar shu kalit uchun chaqiruv allaqachon ketayotgan bo'lsa, yangi chaqiruvchi kutadi va asl chaqiruvning natijasini oladi. `shared` natija bir nechta chaqiruvchiga berilganini bildiradi. `DoChan` shuning kanal varianti, `Forget(key)` esa kalitni "unutadi", keyingi chaqiruv yangi ijro boshlaydi.

Muhim chegara: singleflight keshlash emas. U faqat bir vaqtda ketayotgan chaqiruvlarni birlashtiradi. Chaqiruv tugagach kalit o'chadi va keyingi so'rov yana haqiqiy ish qiladi. Kesh bilan birga ishlatilganda esa (79-dars) u cache stampede'ni to'xtatadi.

Kompilyatsiya qilinmagan namuna:

```go
var flight singleflight.Group

func position(ctx context.Context, id string) (string, error) {
	v, err, _ := flight.Do(id, func() (any, error) {
		return lookupPosition(ctx, id)
	})
	if err != nil {
		return "", err
	}
	return v.(string), nil
}
```

## Chuqurroq: ichki mexanizm va tuzoqlar

### Birinchi xato va context xatosi

errgroup bilan tez uchraydigan chalkashlik: birinchi xato qaytgach, qolgan goroutine'lar `ctx.Err()` (`context.Canceled`) qaytaradi. `Wait` esa aynan birinchi xatoni beradi, shuning uchun sababni ko'rasiz. Lekin agar sizning funksiyangiz `ctx` ni tekshirmasa, u ishini davom ettiradi va `Wait` uning tugashini kutadi. Bekor qilish ixtiyoriy hamkorlik: har uzoq funksiya `ctx` ni kuzatishi shart.

### Singleflight va birinchi chaqiruvchining ctx si

Bu eng muhim tuzoq. `Do` ga berilgan funksiya bir marta, birinchi chaqiruvchining `ctx` si bilan ishlaydi. Agar o'sha chaqiruvchi bekor qilinsa (mijoz uzildi) va funksiya shu `ctx` ni ishlatsa, u xato bilan tugaydi va bir xil xato 9 ta kutuvchiga tarqaladi, garchi ularning so'rovlari hali tirik bo'lsa ham. Bu muallifning xulosasi (hujjatdagi qoida emas), lekin mexanizmdan to'g'ridan-to'g'ri kelib chiqadi. Amaliy choralar:

- ulashiladigan funksiyada chaqiruvchining `ctx` sini emas, mustaqil kontekstni ishlating (masalan, o'z vaqt chegarasi bilan);
- yoki kutuvchi tomonda `DoChan` va `select` bilan o'z `ctx` sini kuting, shunda har kim o'zi bekor qila oladi;
- xatoni keshlamang: bekor qilish xatosi muvaffaqiyatsizlik emas, tasodif.

Yana bir nuqta: `shared` bayrog'i natija bir nechta chaqiruvchida ulashilganini bildiradi. Natija pointer yoki slice bo'lsa, hamma kutuvchi bitta obyektni oladi. Birortasi uni o'zgartirsa, boshqalar uchun data race bo'ladi (43-dars). O'zgarmas qiymat qaytaring yoki nusxa oling.

### Semaphore tuzoqlari

- Har `Acquire` uchun aynan bitta mos `Release`, xuddi shu `size` bilan. `defer` shu uchun.
- Semafor goroutine sonini emas, ishlatilayotgan resurs birligini cheklaydi. Goroutine'lar baribir yaratiladi, ular faqat kutadi. Million vazifa uchun million kutayotgan goroutine kerak bo'lmasin desangiz, `errgroup.SetLimit` yoki worker pool (49-dars) ishlating.

## Misol: mini-errgroup va mini-singleflight

Mexanizmni tushunish uchun ularni o'zimiz yozamiz. Quyidagi dastur errgroup va singleflight ning soddalashtirilgan analoglarini o'z ichiga oladi (haqiqiy paketlardan farqi: kamroq xususiyat, panic tarqatmasligi va `DoChan` yo'qligi) va uchta stsenariy bilan ishlatadi.

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

// ---- errgroup'ning soddalashtirilgan analogi ----

type Group struct {
	cancel  context.CancelFunc
	wg      sync.WaitGroup
	sem     chan struct{} // nil bo'lsa, limit yo'q
	errOnce sync.Once
	err     error
}

func WithContext(ctx context.Context) (*Group, context.Context) {
	ctx, cancel := context.WithCancel(ctx)
	return &Group{cancel: cancel}, ctx
}

func (g *Group) SetLimit(n int) { g.sem = make(chan struct{}, n) }

// Go limit to'lgan bo'lsa bloklanadi (x/sync/errgroup ham shunday).
func (g *Group) Go(f func() error) {
	if g.sem != nil {
		g.sem <- struct{}{}
	}
	g.wg.Add(1)
	go func() {
		defer func() {
			if g.sem != nil {
				<-g.sem
			}
			g.wg.Done()
		}()
		if err := f(); err != nil {
			g.errOnce.Do(func() {
				g.err = err
				g.cancel()
			})
		}
	}()
}

func (g *Group) Wait() error {
	g.wg.Wait()
	g.cancel()
	return g.err
}

// ---- singleflight'ning soddalashtirilgan analogi ----

type call struct {
	wg  sync.WaitGroup
	val string
	err error
}

type Flight struct {
	mu sync.Mutex
	m  map[string]*call
}

func (f *Flight) Do(key string, fn func() (string, error)) (string, error, bool) {
	f.mu.Lock()
	if f.m == nil {
		f.m = make(map[string]*call)
	}
	if c, ok := f.m[key]; ok {
		f.mu.Unlock()
		c.wg.Wait()
		return c.val, c.err, true
	}
	c := new(call)
	c.wg.Add(1)
	f.m[key] = c
	f.mu.Unlock()

	c.val, c.err = fn()
	c.wg.Done()

	f.mu.Lock()
	delete(f.m, key)
	f.mu.Unlock()
	return c.val, c.err, false
}

func main() {
	// 1. Cheklangan parallellik: 10 ta vazifa, bir vaqtda ko'pi bilan 3 ta.
	g, ctx := WithContext(context.Background())
	g.SetLimit(3)
	var running, peak atomic.Int32
	for range 10 {
		g.Go(func() error {
			cur := running.Add(1)
			defer running.Add(-1)
			for {
				p := peak.Load()
				if cur <= p || peak.CompareAndSwap(p, cur) {
					break
				}
			}
			select {
			case <-time.After(10 * time.Millisecond):
				return nil
			case <-ctx.Done():
				return ctx.Err()
			}
		})
	}
	fmt.Println("xato:", g.Wait(), "| eng ko'p parallel:", peak.Load())

	// 2. Birinchi xato qolganlarini bekor qiladi.
	g2, ctx2 := WithContext(context.Background())
	var cancelled atomic.Int32
	g2.Go(func() error { return errors.New("sensor 7 javob bermadi") })
	for range 3 {
		g2.Go(func() error {
			<-ctx2.Done()
			cancelled.Add(1)
			return ctx2.Err()
		})
	}
	fmt.Println("Wait:", g2.Wait(), "| bekor qilinganlar:", cancelled.Load())

	// 3. Singleflight: 10 ta bir vaqtdagi so'rov, bitta haqiqiy chaqiruv.
	var f Flight
	var calls atomic.Int32
	var wg sync.WaitGroup
	var shared atomic.Int32
	for range 10 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			_, _, sh := f.Do("device:42", func() (string, error) {
				calls.Add(1)
				time.Sleep(50 * time.Millisecond) // boshqa chaqiruvchilar qo'shilishi uchun
				return "Toshkent, Amir Temur ko'chasi", nil
			})
			if sh {
				shared.Add(1)
			}
		}()
	}
	wg.Wait()
	fmt.Println("haqiqiy chaqiruvlar:", calls.Load(), "| kutib qolganlar:", shared.Load())
}
```

Natija (Go 1.24.7, linux/amd64, `go run -race`; son va xabarlar aniq, tartibga bog'liq emas):

```text
xato: <nil> | eng ko'p parallel: 3
Wait: sensor 7 javob bermadi | bekor qilinganlar: 3
haqiqiy chaqiruvlar: 1 | kutib qolganlar: 9
```

Birinchi qator: 10 ta vazifa, limit 3, ko'rilgan eng yuqori parallellik 3. Ikkinchi: bitta vazifa xato qaytardi, `errOnce` uni saqladi va `cancel()` chaqirdi, kontekstni kutayotgan 3 ta vazifa tugadi, `Wait` birinchi xatoni qaytardi. Uchinchi: 10 ta goroutine `Do` ni chaqirdi, funksiya bir marta ishladi, 9 tasi natijani kutib oldi. Oxirgi son vaqtga bog'liq: funksiya ichidagi 50 ms uyqu boshqa chaqiruvchilar kelib qo'shilishi uchun vaqt beradi. Uyqusiz, juda tez goroutine'lar ketma-ket kelsa, bir nechta haqiqiy chaqiruv bo'lishi mumkin.

Kodda ko'rinadigan muhim qarorlar:

- `Group.Go` semafor kanalini `Add` dan oldin to'ldiradi. Shuning uchun limit to'lganda chaqiruvchi bloklanadi, goroutine ishga tushirilmaydi.
- `Wait` oxirida `cancel()` ni chaqiradi: kontekst resursi oqib ketmasligi uchun (hujjatdagi "Wait qaytganda bekor bo'ladi" qoidasi shu).
- `Flight.Do` ro'yxatdagi `call` yozuvini `Mutex` himoyasida tekshiradi. Takroriy chaqiruvchi `c.wg.Wait()` da kutadi, asl chaqiruvchi esa natijani yozib `Done` chaqiradi. `Done` `Wait` qaytishidan oldin sinxronlanadi, shuning uchun `c.val` va `c.err` ni qo'shimcha qulfsiz o'qish xavfsiz (43-dars).

## Qachon qo'llamaslik kerak

- Ikki-uch goroutine'ni kutish uchun `WaitGroup` yetarli. errgroup xato va bekor qilish kerak bo'lganda ma'noli.
- errgroup barcha xatolarni yig'maydi. Hamma xato kerak bo'lsa (masalan, har qurilma uchun hisobot) natijalarni o'zingiz massivga yig'ing (har goroutine o'z indeksiga yozadi) va `errors.Join` ishlating.
- `SetLimit` har so'rovda yangi guruh yaratsa, global chegara bermaydi. Butun jarayon bo'yicha chegara kerak bo'lsa, umumiy semafor yoki worker pool ishlating.
- Singleflight yozishni (write) birlashtirish uchun emas. Idempotent bo'lmagan amalni "birlashtirib" yuborish foydalanuvchi niyatini yo'qotadi. U o'qishlar uchun.
- Natijasi har chaqiruvchiga shaxsiy bo'lgan ishda (ruxsat, til, tenant) kalitga hammasini kiritmasangiz, begona ma'lumot sizib chiqadi. Kalit natijani to'liq aniqlashi kerak.
- Standart kutubxona yetarli joyda x/sync ni qo'shish shart emas: mini-versiyalar 30 qator. Lekin sinalgan, hujjatlangan paket odatda yaxshiroq tanlov, ayniqsa panic va chegara holatlari uchun.

## Stack'da: Node.js/TypeScript bilan solishtirish

- `errgroup` ≈ `Promise.all`: birinchi rad etilgan promise butun natijani rad etadi. Farq: `Promise.all` qolgan promise'larni bekor qilmaydi, ular fonda ishlayveradi. errgroup esa `ctx` orqali bekor qilishni tarqatadi (lekin majburlamaydi).
- `SetLimit` ≈ `p-limit` yoki `p-queue` kutubxonalari: parallellik chegarasi. Go'da u 10 qator.
- `semaphore` ≈ `async-mutex` ning `Semaphore` klassi.
- `singleflight` ≈ uchib yurgan promise'ni xaritada saqlash: `inflight.get(key) ?? inflight.set(key, fetch()).get(key)`. Node.js'da bitta ish zanjiri bo'lgani uchun bu muammosiz ishlaydi. Go'da esa `map` ga parallel kirish data race, shuning uchun singleflight qulf va `WaitGroup` ishlatadi.
- Muhim farq: JavaScript promise'ni tashqaridan bekor qilib bo'lmaydi, `AbortSignal` ni esa o'zingiz uzatasiz. Go'da ham `ctx` ni o'zingiz uzatasiz, lekin u tilning umumiy konvensiyasi.

## Xulosa

- errgroup: guruh, birinchi xato, `WithContext` bilan bekor qilish va `SetLimit`/`TryGo` bilan chegara. Goroutine'lar `ctx` ni o'zlari kuzatadi.
- semaphore: vaznli resurs cheklovi, `Acquire(ctx, n)` bekor qilinadi, har `Acquire` ga bitta `Release`.
- singleflight: bir vaqtdagi bir xil chaqiruvlarni birlashtiradi, kesh emas; birinchi chaqiruvchining `ctx` si va ulashiladigan natija ehtiyot talab qiladi.
- Uchala mexanizm ham `WaitGroup`, `Mutex`, `Once` va kanaldan quriladi. Mini-versiyalar `-race` bilan tekshirildi, x/sync namunalari kompilyatsiya qilinmagan.
- Butun jarayon bo'yicha chegara uchun umumiy semafor yoki worker pool (49-dars) kerak.
