---
n: 50
slug: concurrency-test
title: "Concurrent kodni sinash: race detector va testing/synctest"
summary: "Concurrent kodni ishonchli sinash: go test -race, tez-tez uchraydigan flaky test sabablari, time.Sleep o'rniga testing/synctest va soxta soat, soatni inyeksiya qilish va goroutine leak tekshiruvi."
duration: 50
sources:
  - id: race-detector
    note: "Race detector hujjati: -race bayrog'i, ish vaqti xarajati, faqat bajarilgan race'larni topishi, GORACE sozlamalari"
  - id: blog-synctest
    note: "Go blogidagi testing/synctest maqolasi (2025-02-19): Go 1.24 eksperimental API, bubble va soxta vaqt g'oyasi"
  - id: pkg-synctest
    note: "testing/synctest paketi: Test va Wait, bubble, soxta vaqt (2000-01-01 UTC), durably blocked ta'rifi"
quiz:
  - q: "Test `go test` bilan o'tadi, `go test -race` bilan yiqiladi. Bu nimani anglatadi?"
    options:
      - "Race detector xato qildi, kod to'g'ri"
      - "Kodda data race bor: oddiy ishga tushirishda natija tasodifan to'g'ri chiqqan"
      - "Test juda sekin"
      - "Faqat testning o'zi noto'g'ri yozilgan"
    answer: 1
    explain: "Data race natijani har doim buzmaydi, shuning uchun oddiy testlar o'tib ketishi mumkin. Race detector xotiraga kirishlarning sinxronlanishini kuzatadi va happens-before bo'lmagan juftlarni topadi (43-dars)."
  - q: "Race detector toza o'tdi. Bundan nima xulosa to'g'ri?"
    options:
      - "Kodda data race yo'q"
      - "Ishga tushirish paytida bajarilgan kod yo'llarida race topilmadi; bajarilmagan yo'llar haqida hech narsa deyilmaydi"
      - "Deadlock ham yo'q"
      - "Goroutine leak ham yo'q"
    answer: 1
    explain: "Hujjat ochiq aytadi: detektor faqat run time'da sodir bo'lgan race'larni topadi. Shuning uchun testlar parallel yo'llarni haqiqatan bajarishi, kerak bo'lsa -count bilan takrorlanishi lozim."
  - q: "`synctest.Test` bubble ichida `time.Sleep(time.Hour)` chaqirildi. Test qancha real vaqt oladi?"
    options:
      - "Bir soat"
      - "Bir daqiqa"
      - "Deyarli nol: bubble ichidagi hamma goroutine durably blocked bo'lganda soxta soat oldinga suriladi"
      - "Test panic qiladi, chunki Sleep taqiqlangan"
    answer: 2
    explain: "Bubble'dagi soat soxta. Hamma goroutine faqat bubble ichidan uyg'ota oladigan holatda bloklanganda, soat keyingi uyg'otish momentigacha sakraydi. Dars misolidagi test 1 soniyalik interval uchun 0.00s oldi."
  - q: "Quyidagilardan qaysi biri bubble'da 'durably blocked' hisoblanadi?"
    options:
      - "`sync.Mutex.Lock` da kutish"
      - "Tarmoq soketidan o'qish"
      - "Faqat `runtime.Gosched()`"
      - "Bubble ichida yaratilgan kanaldan qabul qilish"
    answer: 3
    explain: "Bubble ichida yaratilgan kanal operatsiyalari, select (hamma holat bubble kanallari bo'lsa), sync.Cond.Wait, time.Sleep durably blocked. Mutex va tarmoq I/O bunday emas, chunki ularni bubble'dan tashqari narsa ham uyg'ota oladi."
  - q: "TTL keshini sinash uchun `time.Now` ni to'g'ridan-to'g'ri chaqirish o'rniga `now func() time.Time` maydonini kiritdik. Asosiy foyda?"
    options:
      - "Test `Sleep` siz, tez va deterministik bo'ladi: soat qo'lda suriladi"
      - "Kesh tezroq ishlaydi"
      - "Data race yo'qoladi"
      - "Kod qisqaroq bo'ladi"
    answer: 0
    explain: "Soatni qaram sifatida berish testga vaqtni boshqarish imkonini beradi, shu jumladan chegara holatlarini (aynan TTL) tekshirish. Bu synctest bo'lmagan versiyalarda ham ishlaydi."
  - q: "`synctest.Test` (Go 1.25) bilan `synctest.Run` (Go 1.24 eksperimental) o'rtasidagi asosiy farq?"
    options:
      - "Farq yo'q, faqat nomi o'zgargan"
      - "Test GOEXPERIMENT talab qiladi, Run talab qilmaydi"
      - "Test `*testing.T` ni qabul qiladi va bubble'ni testga bog'laydi; GA bo'lgani uchun eksperiment bayrog'i kerak emas"
      - "Run Go 1.25 da ham asosiy API"
    answer: 2
    explain: "Release notes: Go 1.25 da synctest GA, Test va Wait mavjud. Go 1.24 da u GOEXPERIMENT=synctest ostidagi eksperimental paket edi (Run bilan); eski API 1.25 da eksperiment ostida qoladi va 1.26 da olib tashlanishi aytilgan."
task:
  title: "Sekin va flaky TTL keshini soxta soat bilan sinash"
  prompt: |
    `Cache` qurilma manzilini TTL bilan saqlaydi. `main` ichidagi sinov `time.Sleep(1100 * time.Millisecond)` bilan TTL tugashini kutadi: bu sekin (bir soniyadan ortiq) va tizim yuki katta bo'lganda flaky bo'lishi mumkin. Starter `200ms dan tez: false` chiqarib 1 kod bilan tugaydi.

    `Cache` ga `now func() time.Time` maydonini kiriting (`NewCache` `time.Now` ni beradi), kesh ichida hamma joyda `time.Now()` o'rniga shuni ishlating. Qo'lda suriladigan `fakeClock` yozing va sinovni `Sleep` siz o'tkazing: TTL ichida, aynan TTL chegarasida (hali yaroqli) va undan 1 nanosoniya o'tgach (yaroqsiz) tekshiring. Oxirida 8 goroutine parallel `Set`/`Get` chaqirsin, `fakeClock` esa qulf bilan himoyalangan bo'lsin. `go run -race` ogohlantirishsiz o'tsin va umumiy vaqt 200 ms dan oshmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "sync"
        "time"
    )

    type entry struct {
        val     string
        expires time.Time
    }

    // Cache - TTL'li kesh (masalan, qurilmaning oxirgi manzili).
    type Cache struct {
        mu    sync.Mutex
        ttl   time.Duration
        items map[string]entry
    }

    func NewCache(ttl time.Duration) *Cache {
        return &Cache{ttl: ttl, items: make(map[string]entry)}
    }

    func (c *Cache) Set(key, val string) {
        c.mu.Lock()
        defer c.mu.Unlock()
        c.items[key] = entry{val, time.Now().Add(c.ttl)}
    }

    func (c *Cache) Get(key string) (string, bool) {
        c.mu.Lock()
        defer c.mu.Unlock()
        e, ok := c.items[key]
        if !ok || time.Now().After(e.expires) {
            delete(c.items, key)
            return "", false
        }
        return e.val, true
    }

    func main() {
        start := time.Now()
        failed := false
        check := func(name string, got, want bool) {
            if got != want {
                fmt.Printf("XATO: %s: got %v, want %v\n", name, got, want)
                failed = true
            }
        }

        c := NewCache(time.Second)
        c.Set("truck-01", "Chilonzor")
        _, ok := c.Get("truck-01")
        check("TTL ichida", ok, true)

        time.Sleep(1100 * time.Millisecond) // sekin va flaky
        _, ok = c.Get("truck-01")
        check("TTL o'tgach", ok, false)

        elapsed := time.Since(start)
        fast := elapsed < 200*time.Millisecond
        fmt.Println("200ms dan tez:", fast)
        if !fast || failed {
            os.Exit(1)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "os"
        "sync"
        "time"
    )

    type entry struct {
        val     string
        expires time.Time
    }

    // Cache - TTL'li kesh (masalan, qurilmaning oxirgi manzili).
    type Cache struct {
        mu    sync.Mutex
        ttl   time.Duration
        now   func() time.Time // test uchun almashtiriladi
        items map[string]entry
    }

    func NewCache(ttl time.Duration) *Cache {
        return newCache(ttl, time.Now)
    }

    func newCache(ttl time.Duration, now func() time.Time) *Cache {
        return &Cache{ttl: ttl, now: now, items: make(map[string]entry)}
    }

    func (c *Cache) Set(key, val string) {
        c.mu.Lock()
        defer c.mu.Unlock()
        c.items[key] = entry{val, c.now().Add(c.ttl)}
    }

    func (c *Cache) Get(key string) (string, bool) {
        c.mu.Lock()
        defer c.mu.Unlock()
        e, ok := c.items[key]
        if !ok || c.now().After(e.expires) {
            delete(c.items, key)
            return "", false
        }
        return e.val, true
    }

    // fakeClock qo'lda suriladigan soat.
    type fakeClock struct {
        mu sync.Mutex
        t  time.Time
    }

    func (f *fakeClock) Now() time.Time {
        f.mu.Lock()
        defer f.mu.Unlock()
        return f.t
    }

    func (f *fakeClock) Advance(d time.Duration) {
        f.mu.Lock()
        defer f.mu.Unlock()
        f.t = f.t.Add(d)
    }

    func main() {
        start := time.Now()
        failed := false
        check := func(name string, got, want bool) {
            if got != want {
                fmt.Printf("XATO: %s: got %v, want %v\n", name, got, want)
                failed = true
            }
        }

        clock := &fakeClock{t: time.Date(2026, 11, 3, 9, 0, 0, 0, time.UTC)}
        c := newCache(time.Second, clock.Now)
        c.Set("truck-01", "Chilonzor")

        _, ok := c.Get("truck-01")
        check("TTL ichida", ok, true)

        clock.Advance(time.Second) // aynan TTL: hali yaroqli
        _, ok = c.Get("truck-01")
        check("TTL chegarasida", ok, true)

        clock.Advance(time.Nanosecond)
        _, ok = c.Get("truck-01")
        check("TTL o'tgach", ok, false)

        // Parallel foydalanish ham -race ostida tekshiriladi.
        var wg sync.WaitGroup
        for i := range 8 {
            wg.Add(1)
            go func() {
                defer wg.Done()
                key := fmt.Sprintf("truck-%02d", i)
                c.Set(key, "Yunusobod")
                c.Get(key)
                clock.Advance(time.Millisecond)
            }()
        }
        wg.Wait()

        elapsed := time.Since(start)
        fast := elapsed < 200*time.Millisecond
        fmt.Println("200ms dan tez:", fast)
        if !fast || failed {
            os.Exit(1)
        }
    }
  solutionNotes: |
    - `Cache` soatni qaram sifatida oladi (`now func() time.Time`). Ishlab chiqarishda `time.Now`, testda `fakeClock.Now`. Kesh o'zining ichki mantiqini o'zgartirmaydi.
    - `Get` da shart `After(e.expires)`: aynan TTL chegarasida yozuv hali yaroqli, 1 ns o'tgach yaroqsiz. Sleep bilan bunday chegarani tekshirib bo'lmaydi.
    - `fakeClock` ham `Mutex` bilan himoyalangan, chunki parallel goroutine'lar `Advance` va `Now` ni chaqiradi. Himoyasiz u o'zi data race manbai bo'lardi (`-race` buni topadi).
    - Kesh va `fakeClock` har birining o'z qulfi bor. `Get` ichida kesh qulfi ushlab turilgan holda `now()` chaqiriladi, `now()` esa soat qulfini oladi. Teskari tartib yo'q, shuning uchun deadlock xavfi yo'q.
    - Go 1.25 da bubble ichida `time.Now` va `time.Sleep` o'zi soxta bo'ladi. Shunda `fakeClock` shart emas: testni `synctest.Test` ichida yozib `time.Sleep(ttl)` chaqirish yetadi. Bu variant sandbox'da (Go 1.24) kompilyatsiya qilinmagan.
  checklist:
    - "Kesh ichida `time.Now()` to'g'ridan-to'g'ri chaqirilmaydi, `now` maydoni ishlatiladi"
    - "Sinov `Sleep` siz o'tadi va 200 ms dan tez"
    - "TTL chegarasi (aynan TTL va TTL + 1 ns) tekshiriladi"
    - "`fakeClock` parallel foydalanishga chidamli"
    - "`go run -race` va `go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Concurrent kodni yozish yarmi, yarmi uni ishonchli sinash. Odatiy zanjir shunday: kod yozildi, test yozildi, test o'tdi, ishlab chiqarishga chiqdi, haftasiga bir marta tasodifiy yiqiladi. Ikki tipik sabab bor:

1. **Data race**, ya'ni sinxronlanmagan parallel kirish (43-dars). U natijani har doim buzmaydi, shuning uchun oddiy test o'tib ketadi.
2. **Vaqtga bog'liqlik**. Test goroutine'ni ishga tushiradi va `time.Sleep(100 * time.Millisecond)` bilan "yetarlicha" kutadi. CI mashinasi yuklangan kuni 100 ms yetmaydi. Vaqtni uzaytirsangiz, test suite sekin bo'ladi.

Bu darsda ikki asbobni ko'ramiz. **Race detector** birinchi muammoni topadi. **testing/synctest** va soatni qaram sifatida berish ikkinchisini yo'qotadi. Oxirida goroutine leak'ni testda qanday qo'lga olishni ko'rib chiqamiz.

## Asosiy g'oya

### Race detector

Race detector `-race` bayrog'i bilan yoqiladi: `go test -race`, `go run -race`, `go build -race`. Hujjat uning cheklovlarini ochiq aytadi:

- **Faqat bajarilgan race'larni topadi.** Dastur ishlash paytida sodir bo'lgan kirishlarni kuzatadi, bajarilmagan yo'llar haqida hech narsa demaydi.
- **Xarajat.** Hujjatga ko'ra xotira 5-10 baravar, ish vaqti 2-20 baravar oshishi mumkin. Shuning uchun u odatda CI va tegishli testlarda yoqiladi, ishlab chiqarishda emas.
- **Talablar.** Detektor cgo talab qiladi va faqat hujjatda sanalgan platformalarda ishlaydi.
- **Sozlash.** `GORACE` muhit o'zgaruvchisi bilan: `halt_on_error`, `exitcode` (standart 66), `history_size`, `log_path`.

Muhim xulosa: toza o'tgan `-race` "race yo'q" degani emas, "ishga tushirilgan yo'llarda topilmadi" degani. Shuning uchun parallel yo'llar testda haqiqatan bajarilishi kerak: bir nechta goroutine, haqiqiy raqobat. Yuk ostida ishlatib ko'rish uchun `go test -race -count=100` kabi takrorlash foydali.

### Flaky testning odatiy sabablari

Flaky test: kod o'zgarmasa ham ba'zan o'tadi, ba'zan yiqiladi. Concurrent kodda sabablar tanish:

- `time.Sleep` bilan "kutish": hodisa sodir bo'lishiga ishonch yo'q.
- Goroutine tugashini kutmasdan natijani tekshirish. Sinxronlash (`WaitGroup`, kanal) kerak.
- Yagona global holatga tayanish (testlar bir-biriga ta'sir qiladi, ayniqsa `t.Parallel` bilan).
- Haqiqiy soat, tarmoq yoki fayl tizimiga bog'liqlik.
- Race: natija planlovchi qarorlariga bog'liq.

Davolash: sleep o'rniga sinxronlash, vaqt o'rniga boshqariladigan soat, tashqi dunyo o'rniga fake.

### testing/synctest

`testing/synctest` paketi vaqtga bog'liq concurrent kodni deterministik va tez sinash uchun yaratilgan. Versiyalar tarixi muhim:

- **Go 1.24**: eksperimental, `GOEXPERIMENT=synctest` bilan, API `synctest.Run` va `synctest.Wait`. Go blogidagi maqola (2025-02-19) shu API'ni tasvirlaydi.
- **Go 1.25**: GA. API `synctest.Test` va `synctest.Wait`. Release notes'ga ko'ra eski API eksperiment ostida qoladi va 1.26 da olib tashlanadi.

G'oya shunday. Test funksiyasi **bubble** ichida ishga tushadi: bubble ichida yaratilgan goroutine'lar bubble'ga tegishli. Bubble o'z **soxta soatiga** ega, uning boshlang'ich qiymati 2000-01-01 00:00 UTC. Qoida bitta: bubble'dagi hamma goroutine **durably blocked** bo'lganda, ya'ni faqat bubble ichidagi boshqa goroutine uyg'ota oladigan holatda bloklanganda, soxta soat keyingi uyg'otish momentiga sakraydi. Real vaqt o'tmaydi.

Paket hujjati durably blocked holatlarini sanaydi:

- bubble ichida yaratilgan kanalda yuborish va qabul qilish;
- hamma holati bubble kanallari bo'lgan `select`;
- `sync.Cond.Wait`;
- `sync.WaitGroup.Wait` (agar `Add` bubble ichida chaqirilgan bo'lsa);
- `time.Sleep`.

Durably blocked **emas**: `sync.Mutex` qulfi va I/O (masalan, tarmoq). Ularni bubble'dan tashqaridagi narsa uyg'ota oladi.

`synctest.Wait()` hamma goroutine durably blocked bo'lguncha kutadi. Bu "goroutine'lar bor ishini qilib bo'ldi" nuqtasi, ya'ni sleep o'rniga ishonchli sinxronlash. Agar hamma goroutine durably blocked bo'lsa-yu, soatni oldinga siljitadigan hech narsa bo'lmasa, `Test` deadlock haqida panic qiladi. Bu foydali: sinaluvchi kod to'xtab qolgan bo'lsa, test osilib qolmaydi, aniq yiqiladi.

### Soatni qaram sifatida berish

synctest bo'lmagan holatda ham vaqtni boshqarish mumkin: soatni kodga tashqaridan bering. Eng sodda yo'l `now func() time.Time` maydoni. Ishlab chiqarishda `time.Now`, testda qo'lda suriladigan soat. Bu usul Go 1.24 da ham, undan oldin ham ishlaydi va aniq chegara holatlarini (aynan TTL) tekshirishga imkon beradi. Topshiriq shu usulni mashq qiladi.

## Chuqurroq: misollar va tuzoqlar

### Race detector testda

Bitta aniq misol. `stats.Collect` tezliklar sonini va maksimumini parallel hisoblaydi, lekin `count` va `max` ni sinxronlashsiz o'zgartiradi (bu race ataylab qoldirilgan, 43-darsdagi `Stats` misoliga o'xshash):

```go
func Collect(speeds []float64) (count int, max float64) {
	var wg sync.WaitGroup
	for _, s := range speeds {
		wg.Add(1)
		go func() {
			defer wg.Done()
			count++
			if s > max {
				max = s
			}
		}()
	}
	wg.Wait()
	return count, max
}
```

Test oddiy:

```go
func TestCollect(t *testing.T) {
	count, max := Collect([]float64{60, 85, 120, 40})
	if count != 4 || max != 120 {
		t.Fatalf("count=%d max=%v", count, max)
	}
}
```

`go test` bilan (Go 1.24.7, 2 vCPU):

```text
ok  	stats	0.003s
```

`go test -race` bilan test yiqiladi:

```text
==================
WARNING: DATA RACE
Read at 0x00c000012328 by goroutine 8:
  stats.Collect.func1()
      .../stats/stats.go:13 +0x96

Previous write at 0x00c000012328 by goroutine 10:
  stats.Collect.func1()
      .../stats/stats.go:13 +0xa8
...
--- FAIL: TestCollect (0.00s)
    testing.go:1490: race detected during execution of test
FAIL
FAIL	stats	0.014s
```

Yuqoridagi chiqish qisqartirilgan: manzillar, goroutine raqamlari va "created at" qismlari har ishga tushirishda farq qiladi, shuning uchun faqat tuzilmani ko'rsatdik. Muhim jihat: oddiy test o'tdi, chunki shu ishga tushirishda natija tasodifan to'g'ri chiqdi. Detektor esa kirishlar o'rtasida happens-before munosabati yo'qligini topdi. Hisobot ikki tomonni ko'rsatadi: qaysi satr o'qidi/yozdi va ikkala goroutine qayerda yaratilgan. Tuzatish 43- va 44-darslardagi usullar: mutex, atomic yoki natijani kanal orqali yig'ish.

Detektor topgan har race testni yiqitadi, shuning uchun CI'da `-race` o'tmasa, build ham yiqilishi kerak.

### synctest bilan batcher'ni sinash

`Batcher` kanaldan qiymat yig'adi va `size` ta bo'lganda yoki har `every` vaqtda `flush` chaqiradi:

```go
func Run(ctx context.Context, in <-chan int, size int, every time.Duration, flush func([]int)) {
	t := time.NewTicker(every)
	defer t.Stop()

	var buf []int
	emit := func() {
		if len(buf) > 0 {
			flush(buf)
			buf = nil
		}
	}
	for {
		select {
		case v, ok := <-in:
			if !ok {
				emit()
				return
			}
			buf = append(buf, v)
			if len(buf) >= size {
				emit()
			}
		case <-t.C:
			emit()
		case <-ctx.Done():
			emit()
			return
		}
	}
}
```

Sleep bilan test shunday bo'lardi: qiymat yuborish, 1 soniya kutish, natijani tekshirish. Sekin va chegara holati noaniq. synctest bilan:

```go
func TestFlushOnInterval(t *testing.T) {
	synctest.Run(func() {
		in := make(chan int)
		out := make(chan []int, 10) // flush natijalari
		ctx, cancel := context.WithCancel(context.Background())
		go Run(ctx, in, 100, time.Second, func(b []int) { out <- b })

		in <- 1
		in <- 2
		synctest.Wait()
		select {
		case b := <-out:
			t.Fatalf("interval tugamasdan flush bo'ldi: %v", b)
		default:
		}

		time.Sleep(time.Second) // soxta soat: haqiqiy kutish yo'q
		synctest.Wait()
		select {
		case b := <-out:
			if want := []int{1, 2}; !reflect.DeepEqual(b, want) {
				t.Fatalf("got %v, want %v", b, want)
			}
		default:
			t.Fatal("interval o'tdi, lekin flush bo'lmadi")
		}

		cancel()
		synctest.Wait()
	})
}
```

Bu Go 1.24 eksperimental API'si bilan yozilgan va `GOEXPERIMENT=synctest go test -race -count=30` bilan sinab chiqilgan. Natija:

```text
--- PASS: TestFlushOnInterval (0.00s)
--- PASS: TestFlushOnSize (0.00s)
```

Bir soniyalik interval soxta soatda 0.00 soniya oldi. Go 1.25 da shu test `synctest.Run(func() { ... })` o'rniga `synctest.Test(t, func(t *testing.T) { ... })` shaklida yoziladi (ichki tana o'zgarmaydi). Bu shakl sandbox'dagi Go 1.24 da kompilyatsiya qilinmaydi, u hujjatdagi namunaga tayanadi:

```go
func TestFlushOnInterval(t *testing.T) {
	synctest.Test(t, func(t *testing.T) {
		// tana yuqoridagi bilan bir xil
	})
}
```

Hujjat namunasida bubble ichida kontekst uchun `t.Context()` ham ishlatiladi.

### Natijani oddiy o'zgaruvchi orqali olish tuzog'i

Birinchi yozgan versiyamizda `flush` natijani tashqi `[]int` o'zgaruvchiga yozardi, test esa `Wait()` dan keyin uni o'qirdi. Go 1.24 eksperimental synctest va `-race` bilan bu data race hisobotini berdi, hatto `Wait()` dan keyin ham. Ya'ni, mahalliy kuzatuvimiz shunday: eksperimental API'da `Wait` boshqa goroutine yozuvlarini race detector ko'ziga ko'ra sinxronlamagan. Bu Go 1.25 da boshqacha bo'lishi mumkin, uni biz tekshirmadik. Uslub qoidasi baribir foydali: bubble ichida natijalarni sinxronlash primitivi (bu yerda buferli kanal `out`) orqali yig'ing, umumiy o'zgaruvchi orqali emas. Yuqoridagi test shunday yozilgan.

### Goroutine leak'ni testda qo'lga olish

41-darsda leak'ni ko'rdik. Testda uni ushlashning bir necha yo'li bor:

- **Soni bo'yicha.** Sinovdan oldin va keyin `runtime.NumGoroutine()` ni solishtirish. Sodda, lekin goroutine tugashi uchun vaqt kerak: `Sleep` yoki takroriy tekshiruv. Bu flaky bo'lish xavfi.
- **synctest bilan.** Hamma goroutine durably blocked bo'lib, soatni siljitadigan narsa qolmasa, `Test` deadlock haqida panic qiladi. Bu bloklangan goroutine'ni sinovda ko'rinadigan qiladi, hujjatdagi deadlock qoidasiga tayanadi.
- **goroutineleak profili.** Go 1.26 release notes: `GOEXPERIMENT=goroutineleakprofile` ostida eksperimental profil, Go 1.27 release notes: GA, `runtime/pprof` va `/debug/pprof/goroutineleak` endpoint'ida. U GC yetib bo'lmaydigan primitivda bloklangan goroutine'larni topadi. Cheklov: global o'zgaruvchilar yoki ishlab turgan goroutine'ning lokal o'zgaruvchilari orqali yetish mumkin bo'lgan primitivlarni o'tkazib yuborishi mumkin. Bu kod sandbox'da (Go 1.24) kompilyatsiya qilinmagan.

## Misol: soxta soat bilan TTL kesh

Topshiriqdagi kesh `time.Now` ga qattiq bog'langan. Starter sinovi `Sleep(1100ms)` ga muhtoj va `200ms dan tez: false` chiqaradi. Yechim `now func() time.Time` maydoni va `fakeClock`. Mohiyat quyidagicha:

```go
type Cache struct {
	mu    sync.Mutex
	ttl   time.Duration
	now   func() time.Time // test uchun almashtiriladi
	items map[string]entry
}

func (c *Cache) Get(key string) (string, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	e, ok := c.items[key]
	if !ok || c.now().After(e.expires) {
		delete(c.items, key)
		return "", false
	}
	return e.val, true
}
```

Soxta soat:

```go
type fakeClock struct {
	mu sync.Mutex
	t  time.Time
}

func (f *fakeClock) Now() time.Time {
	f.mu.Lock()
	defer f.mu.Unlock()
	return f.t
}

func (f *fakeClock) Advance(d time.Duration) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.t = f.t.Add(d)
}
```

Yechim `go run -race` bilan chiqarganda:

```text
200ms dan tez: true
```

Bu qator tekshiriladigan chegara: soat qo'lda surilgani uchun test bir soniya kutmaydi. Aniq vaqt qiymati mashinaga bog'liq, biz faqat 200 ms pastki bahoni tekshiramiz.

Yana bir foyda: `Sleep(1100ms)` TTL chegarasini tekshirmaydi. Soxta soat bilan aynan TTL (hali yaroqli) va TTL + 1 ns (yaroqsiz) tekshiriladi.

## Qachon qo'llamaslik kerak

- `-race` ishlab chiqarish binary'sida odatda yoqilmaydi: xarajat katta. U CI va staging uchun.
- synctest I/O ga bog'liq kodda foydasiz: tarmoq va fayl operatsiyalari durably blocked emas. Bunday kod uchun integratsion testlar (82-dars) yoki fake'lar.
- Soxta soat haqiqiy muammolarni yashirishi mumkin: real tizimda soat monoton emas, sleep aniq emas. Hech bo'lmaganda bitta test haqiqiy vaqt bilan ham ishlasin.
- Goroutine sonini solishtirish bilan leak'ni qidirish nozik: boshqa kutubxonalar goroutine ochishi mumkin. Imkon bo'lsa synctest yoki aniq sinxronlashni afzal ko'ring.
- Testda har qanday `time.Sleep(...)` qizil bayroq. Avval sinxronlash (kanal, `WaitGroup`, `synctest.Wait`) mumkinmi, deb o'ylang.
- Go 1.24 da `synctest` eksperimental: loyihada `GOEXPERIMENT` ni yoqish, API 1.25 da o'zgarishini hisobga olish kerak. Barqaror yo'l kerak bo'lsa, soatni inyeksiya qilish.

## Stack'da: Node.js/TypeScript bilan solishtirish

Jest va Vitest'da soxta taymerlar bor: `jest.useFakeTimers()`, `vi.useFakeTimers()` va `advanceTimersByTime`. Bu synctest'ning yaqin qarindoshi, lekin farqlar muhim:

| Node.js | Go |
|---|---|
| Fake taymerlar global `setTimeout` ni almashtiradi | synctest `time` paketining o'zini bubble ichida soxtalashtiradi, kodni o'zgartirish shart emas |
| Soatni qo'lda suradi: `advanceTimersByTime(1000)` | Soat avtomatik suriladi, hamma durably blocked bo'lganda |
| Data race yo'q (bitta thread) | Data race asosiy xavf, `-race` kerak |
| Race detector yo'q | `go test -race` ichki vosita |

Ikkinchi qator ayniqsa muhim: Jest'da soatni o'zingiz surasiz, Go'da synctest uni "hech narsa qilolmayotganda" suradi. Bu ishonchli, chunki test hamma goroutine'lar o'z ishini tugatganini biladi.

## Xulosa

- `go test -race` data race'larni topadi, lekin faqat bajarilgan yo'llarda. Toza natija race yo'q degani emas. CI'da doim yoqing, xarajat 5-10x xotira va 2-20x vaqtgacha.
- Oddiy test o'tib, `-race` yiqilishi odatiy hol: race natijani har doim buzmaydi.
- `time.Sleep` bilan kutish flaky testning asosiy sababi. Sinxronlash yoki boshqariladigan soat bilan almashtiring.
- `testing/synctest`: bubble, soxta soat (2000-01-01 UTC dan), durably blocked bo'lganda soat sakraydi, `Wait` goroutine'lar to'xtashini kutadi. Go 1.24 da eksperimental (`Run`), Go 1.25 da GA (`Test`).
- Soatni qaram sifatida berish (`now func() time.Time`) har versiyada ishlaydi va aniq chegarani sinashga imkon beradi.
- Leak'ni testda qo'lga olish: goroutine soni, synctest yoki (kelajakda) goroutineleak profili. Go 1.25 va 1.26+ shakllari sandbox'da kompilyatsiya qilinmagan.
