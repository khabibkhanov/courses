---
n: 79
slug: redis-cache
title: "Redis, cache va cache stampede"
summary: "Redis bilan cache-aside, TTL va kalit dizayni, RESP protokoli (haqiqiy Redis'ga mini mijoz bilan), cache stampede va singleflight, TTL jitter, negative caching va keshni noto'g'ri ishlatish xavflari; go-redis API."
duration: 50
sources:
  - id: go-redis
    note: "go-redis v9.23.0: redis.NewClient, Get/Set/SetNX, redis.Nil (kalit yo'q), context bilan chaqiruvlar"
  - id: x-singleflight
    note: "golang.org/x/sync/singleflight: Group.Do bir xil kalit uchun bir vaqtdagi chaqiruvlarni birlashtiradi"
  - id: pkg-context
    note: "context.Context: deadline va bekor qilish, Redis chaqiruvlari va yuklash funksiyasiga uzatiladi"
quiz:
  - q: "Cache-aside (lazy loading) naqshida o'qish qanday ishlaydi?"
    options:
      - "Avval bazaga yoziladi, keyin kesh avtomatik yangilanadi"
      - "Ilova keshdan o'qiydi; topilmasa (miss) bazadan yuklaydi va keshga yozadi; kesh o'zi bazaga bormaydi"
      - "Kesh barcha so'rovlarni bazaga proksi qiladi"
      - "Ilova faqat keshga yozadi, bazaga hech qachon bormaydi"
    answer: 1
    explain: "Cache-aside'da kesh va baza orasidagi mantiq ilovada. Miss bo'lganda ilova o'zi yuklaydi va keshga qo'yadi. Lokal sinovlarda aynan shu oqim ishlatildi: get -> miss -> loader -> set."
  - q: "50 goroutine bir vaqtda bir xil kalitni so'radi, kesh bo'sh. Himoyasiz kesh `Get` da loader necha marta chaqiriladi (lokal sinov)?"
    options:
      - "Bir marta, chunki Mutex hammasini ketma-ketlashtiradi"
      - "Ikki marta"
      - "Taxminan 10 marta"
      - "50 marta: har goroutine miss ko'rdi va yuklashga o'zi ketdi (cache stampede)"
    answer: 3
    explain: "Mutex faqat map'ni himoya qiladi, yuklashni emas: tekshirish va yuklash orasida boshqalar ham miss ko'radi. Lokal sinovda 50 ta loader chaqiruvi bo'ldi; singleflight bilan esa 1 ta. 200 so'rovli versiyada ham 200 va 1."
  - q: "`singleflight.Group.Do(key, fn)` ni ishlatganda nimani unutmaslik kerak?"
    options:
      - "Natija faqat birinchi chaqiruvchiga qaytadi, qolganlari xato oladi"
      - "Kutayotgan chaqiruvchilar birinchisining natijasini (xatosini ham) oladi; birinchining context'i bekor bo'lsa hammasi xato oladi. Shuning uchun yuklashga umumiy, alohida muddatli context berish yoki DoChan bilan kutishni cheklash kerak"
      - "Do keshga yozishni o'zi bajaradi"
      - "Do kalit bo'yicha doimiy kesh yaratadi"
    answer: 1
    explain: "singleflight faqat BIR VAQTDAGI chaqiruvlarni birlashtiradi, natijani saqlamaydi (keshga yozish sizning ishingiz) va xatoni ham ulashadi. Birinchi chaqiruvchining so'rov context'iga bog'liq yuklash hammaga ta'sir qiladi."
  - q: "Ko'p kalitlar bir vaqtda (masalan, ertalab ishga tushganda) 60 soniyalik TTL bilan yozildi. Bir daqiqa o'tgach nima xavf tug'iladi va jitter nima qiladi?"
    options:
      - "Kalitlar bir vaqtda tugab, bazaga ommaviy miss to'lqini keladi (stampede); jitter TTL'ni tasodifiy tarqatib (masalan +-20%) tugash vaqtlarini yoyadi"
      - "Kalitlar hech qachon tugamaydi; jitter ularni o'chiradi"
      - "Redis xotirasi to'ladi; jitter xotirani kamaytiradi"
      - "Hech qanday xavf yo'q"
    answer: 0
    explain: "Bir xil TTL bir xil tugashni beradi. Jitter TTL'ni base +-20% ga tarqatadi (lokal sinovda 60 soniya uchun 48s..72s oralig'i tasdiqlandi), shunda yangilashlar vaqt bo'yicha yoyiladi."
  - q: "go-redis da `val, err := rdb.Get(ctx, key).Result()` `redis.Nil` qaytardi. Bu nima va qanday ishlanadi?"
    options:
      - "Redis ulanishi uzildi; qayta ulanish kerak"
      - "Kalit mavjud emas (yoki muddati o'tgan): bu odatdagi miss, `errors.Is(err, redis.Nil)` bilan ajratib bazaga boriladi; boshqa xatolar infratuzilma muammosi"
      - "Qiymat bo'sh satr"
      - "Dastur panic qilishi kerak"
    answer: 1
    explain: "redis.Nil xato emas, 'kalit yo'q' signali. Lokal RESP mijozida ham GET mavjud bo'lmagan kalitga `$-1` (nil bulk string) qaytardi va bizning ErrNil'ga aylandi. Nil'ni boshqa xatolar bilan aralashtirish keshdagi nosozlikni 'topilmadi' deb yashiradi."
  - q: "`SET lock:vehicle:7 worker-1 NX PX 5000` qanday ishlaydi va nega bunday qulf kafolatsiz?"
    options:
      - "NX: faqat kalit yo'q bo'lsa yozadi, PX: 5000 ms dan keyin o'chadi. Lekin ish 5 soniyadan uzoq cho'zilsa qulf o'zi tugab, ikkinchi ishchi ham oladi; shuning uchun yagona haqiqat manbai sifatida ishonib bo'lmaydi"
      - "Qulf hech qachon tugamaydi"
      - "Ikkinchi SET ham muvaffaqiyatli bo'ladi"
      - "NX kalitni o'chiradi"
    answer: 0
    explain: "Lokal Redis 7.0.15 da birinchi SET NX 'OK', ikkinchisi nil oldi. TTL tufayli qulf ushlab turuvchi ishchi sekinlashsa muddati tugaydi. Ma'lumot yaxlitligi kerak bo'lsa DB darajasidagi cheklov yoki fencing token ishlating."
task:
  title: "Cache stampede'ni to'xtatish"
  prompt: |
    `Cache.Get` keshda yo'q kalitni `load` bilan yuklaydi. 50 goroutine bir vaqtda bir xil kalitni so'raganda `load` 50 marta chaqiriladi.

    `Cache` ni o'zgartiring, shunda bir kalit uchun bir vaqtda faqat bitta yuklash ketsin, qolganlar uning natijasini kutsin va olsin:
    - kutayotganlar xatoni ham olishi kerak, xato keshga yozilmasin;
    - yuklash tugagach kalit "davom etmoqda" ro'yxatidan o'chirilsin;
    - kutilgan natija: `loader chaqiruvlari: 1`, so'ng keshdan o'qish `loader: 1`. `go run -race` bilan ham toza ishlasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sync"
        "sync/atomic"
        "time"
    )

    // Cache kalit bo'yicha qiymatni keshdan oladi, yo'q bo'lsa load bilan yuklaydi.
    type Cache struct {
        mu   sync.Mutex
        data map[string]string
        load func(key string) (string, error)
    }

    func NewCache(load func(string) (string, error)) *Cache {
        return &Cache{data: map[string]string{}, load: load}
    }

    func (c *Cache) Get(key string) (string, error) {
        c.mu.Lock()
        v, ok := c.data[key]
        c.mu.Unlock()
        if ok {
            return v, nil
        }
        v, err := c.load(key) // keshda yo'q: bazaga boramiz
        if err != nil {
            return "", err
        }
        c.mu.Lock()
        c.data[key] = v
        c.mu.Unlock()
        return v, nil
    }

    func main() {
        var loads atomic.Int32
        c := NewCache(func(key string) (string, error) {
            loads.Add(1)
            time.Sleep(50 * time.Millisecond)
            return "yoqilg'i hisoboti: " + key, nil
        })

        var wg sync.WaitGroup
        for i := 0; i < 50; i++ {
            wg.Add(1)
            go func() {
                defer wg.Done()
                if _, err := c.Get("vehicle:7:daily"); err != nil {
                    fmt.Println("xato:", err)
                }
            }()
        }
        wg.Wait()
        fmt.Println("loader chaqiruvlari:", loads.Load())

        v, _ := c.Get("vehicle:7:daily")
        fmt.Println("keyingi o'qish keshdan:", v, "| loader:", loads.Load())
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
        "sync/atomic"
        "time"
    )

    // Cache kalit bo'yicha qiymatni keshdan oladi, yo'q bo'lsa load bilan yuklaydi.
    type Cache struct {
        mu       sync.Mutex
        data     map[string]string
        inflight map[string]*flight
        load     func(key string) (string, error)
    }

    // flight bitta kalit uchun davom etayotgan yuklashni ifodalaydi.
    type flight struct {
        done chan struct{}
        val  string
        err  error
    }

    func NewCache(load func(string) (string, error)) *Cache {
        return &Cache{data: map[string]string{}, inflight: map[string]*flight{}, load: load}
    }

    func (c *Cache) Get(key string) (string, error) {
        c.mu.Lock()
        if v, ok := c.data[key]; ok {
            c.mu.Unlock()
            return v, nil
        }
        if f, ok := c.inflight[key]; ok { // boshqa goroutine yuklayapti: kutamiz
            c.mu.Unlock()
            <-f.done
            return f.val, f.err
        }
        f := &flight{done: make(chan struct{})}
        c.inflight[key] = f
        c.mu.Unlock()

        f.val, f.err = c.load(key) // faqat birinchi goroutine bazaga boradi

        c.mu.Lock()
        if f.err == nil {
            c.data[key] = f.val
        }
        delete(c.inflight, key)
        c.mu.Unlock()
        close(f.done)
        return f.val, f.err
    }

    func main() {
        var loads atomic.Int32
        c := NewCache(func(key string) (string, error) {
            loads.Add(1)
            time.Sleep(50 * time.Millisecond)
            return "yoqilg'i hisoboti: " + key, nil
        })

        var wg sync.WaitGroup
        for i := 0; i < 50; i++ {
            wg.Add(1)
            go func() {
                defer wg.Done()
                if _, err := c.Get("vehicle:7:daily"); err != nil {
                    fmt.Println("xato:", err)
                }
            }()
        }
        wg.Wait()
        fmt.Println("loader chaqiruvlari:", loads.Load())

        v, _ := c.Get("vehicle:7:daily")
        fmt.Println("keyingi o'qish keshdan:", v, "| loader:", loads.Load())
    }
  solutionNotes: |
    - `inflight` map har kalit uchun davom etayotgan yuklashni saqlaydi. Birinchi goroutine `flight` yaratib `Mutex`ni qo'yib yuboradi va yuklaydi; qolganlar `<-f.done` da kutadi.
    - Tekshirish (data, inflight) va inflight'ga yozish bitta `Lock` ichida, shuning uchun ikki goroutine bir vaqtda "birinchi" bo'la olmaydi.
    - Xato keshga yozilmaydi (`f.err == nil` sharti), kutayotganlar esa xatoni oladi. `close(f.done)` kutayotganlarning hammasini uyg'otadi.
    - Lokal tekshiruv: starter 50 loader chaqiruvi, yechim 1 (`-race` bilan). Amalda shu mexanikani `golang.org/x/sync/singleflight` beradi; u bu yerda sandbox'da yuklanmagani uchun qo'lda yozildi.
  checklist:
    - "Bir kalit uchun bir vaqtda bitta yuklash ketadi (loader chaqiruvlari: 1)"
    - "Tekshirish va inflight'ga yozish bitta Lock ichida"
    - "Xato keshga yozilmaydi, kutayotganlar xatoni oladi"
    - "Yuklash tugagach inflight yozuvi o'chiriladi"
    - "`go run -race` hisobotsiz o'tadi"
---

## Muammo

Servis ortidagi baza sekin va qimmat; eng ko'p so'raladigan ma'lumot esa deyarli o'zgarmaydi: avtoparkning oxirgi pozitsiyasi, foydalanuvchi profili, katalog. Kesh bu ma'lumotni tez xotirada ushlaydi. Redis bunda eng keng tarqalgan tanlov: tarmoq orqali ulanadigan, TTL'li kalit-qiymat ombori, ko'p instance orasida umumiy.

Lekin kesh qo'shish bitta xatoni hal qilib, uchtasini keltiradi: eskirgan ma'lumot, xotira o'sishi va eng xavflisi **cache stampede**. Mashhur kalit muddati tugagan lahzada yuzlab so'rov bir vaqtda miss ko'radi, hammasi bazaga boradi va baza, aynan keshdan himoya qilinishi kerak bo'lgan baza, yiqiladi. Bu darsda mexanizmni Go'da ko'ramiz: cache-aside, Redis protokoli (haqiqiy `redis-server` bilan), stampede va uning davosi (`singleflight`, TTL jitter), va keshning cheklovlari.

Node.js'dan kelgan o'quvchi uchun: `ioredis` yoki `node-redis` bilan shu naqsh bir xil; farq shuki, Node'da bitta event loop miss'larni ko'p hollarda `Promise` keshlashi bilan birlashtirishi mumkin, Go'da esa har goroutine mustaqil va birlashtirish aniq yozilishi kerak.

## Asosiy g'oya

### Cache-aside

Eng keng tarqalgan naqsh: ilova keshni va bazani o'zi boshqaradi.

1. Keshdan o'qi. Topilsa (hit), qaytar.
2. Topilmasa (miss), bazadan yukla.
3. Natijani TTL bilan keshga yoz va qaytar.
4. Yozishda: bazani yangila, keshdagi kalitni o'chir (yoki yangila).

Kesh ilova ichida mantiqiy qatlam bo'ladi, baza yagona haqiqat manbai. Kesh yo'qolsa (restart, eviction), tizim sekinlashadi, lekin noto'g'ri ishlamaydi. Aksincha bo'lsa, ya'ni keshga sig'inib qolinsa, tizim keshsiz yashay olmaydi.

### Kalit dizayni va TTL

Kalit tuzilishi aniq bo'lishi kerak: `vehicle:7:last`, `user:42:profile`. Prefiks (domen), identifikator, ixtiyoriy versiya. Format o'zgarsa (JSON maydonlari), kalitga versiya qo'shing (`v2:vehicle:7:last`), shunda eski va yangi kod bir-biriga tegmaydi. TTL ikki ish qiladi: xotirani cheklaydi va eskirgan ma'lumotning umrini chegaralaydi. TTL qanchalik uzun bo'lsa, eskirgan qiymat shunchalik uzoq ko'rinadi. Qiymat qancha tez-tez o'zgarishi va foydalanuvchi eskirgan ma'lumotga qancha chidashiga qarab tanlanadi.

### Redis protokoli: haqiqiy sinov

Redis RESP protokoli matn-binar: buyruq massiv sifatida yuboriladi (`*3\r\n$3\r\nSET\r\n...`), javob bitta turdagi qiymat (`+OK`, `-ERR ...`, `:1`, `$5\r\nhello`, nil uchun `$-1`). go-redis ham xuddi shuni qiladi, shunchaki ko'p narsani avtomatlashtirgan holda. Quyidagi mini mijoz `net` va `bufio` bilan yozilgan va lokal `redis-server` 7.0.15 ga ulandi (sandbox'da o'zimiz ishga tushirdik, tashqi paket kerak emas):

```go
package main

import (
	"bufio"
	"context"
	"errors"
	"fmt"
	"io"
	"net"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Mini RESP mijozi: Redis protokolini net va bufio bilan ko'rsatish uchun.
type Client struct {
	mu   sync.Mutex
	conn net.Conn
	r    *bufio.Reader
}

var ErrNil = errors.New("redis: nil")

func Dial(addr string) (*Client, error) {
	c, err := net.DialTimeout("tcp", addr, time.Second)
	if err != nil {
		return nil, err
	}
	return &Client{conn: c, r: bufio.NewReader(c)}, nil
}

// Do buyruqni RESP massivi sifatida yuboradi va bitta javobni o'qiydi.
func (c *Client) Do(ctx context.Context, args ...string) (any, error) {
	c.mu.Lock()
	defer c.mu.Unlock()
	dl, ok := ctx.Deadline()
	if !ok {
		dl = time.Now().Add(time.Second)
	}
	c.conn.SetDeadline(dl)

	var sb strings.Builder
	fmt.Fprintf(&sb, "*%d\r\n", len(args))
	for _, a := range args {
		fmt.Fprintf(&sb, "$%d\r\n%s\r\n", len(a), a)
	}
	if _, err := io.WriteString(c.conn, sb.String()); err != nil {
		return nil, err
	}
	return c.read()
}

func (c *Client) read() (any, error) {
	line, err := c.r.ReadString('\n')
	if err != nil {
		return nil, err
	}
	line = strings.TrimSuffix(line, "\r\n")
	switch line[0] {
	case '+':
		return line[1:], nil
	case '-':
		return nil, errors.New(line[1:])
	case ':':
		return strconv.ParseInt(line[1:], 10, 64)
	case '$':
		n, _ := strconv.Atoi(line[1:])
		if n < 0 {
			return nil, ErrNil
		}
		buf := make([]byte, n+2)
		if _, err := io.ReadFull(c.r, buf); err != nil {
			return nil, err
		}
		return string(buf[:n]), nil
	}
	return nil, fmt.Errorf("noma'lum javob: %q", line)
}

func main() {
	ctx := context.Background()
	c, err := Dial("127.0.0.1:6390")
	if err != nil {
		fmt.Println("redis yo'q:", err)
		return
	}
	defer c.conn.Close()

	c.Do(ctx, "DEL", "vehicle:7:last", "lock:vehicle:7")
	fmt.Println(c.Do(ctx, "SET", "vehicle:7:last", `{"lat":41.31,"lon":69.28}`, "EX", "30"))
	fmt.Println(c.Do(ctx, "GET", "vehicle:7:last"))
	ttl, _ := c.Do(ctx, "TTL", "vehicle:7:last")
	fmt.Println("TTL (soniya):", ttl)

	_, err = c.Do(ctx, "GET", "vehicle:999:last")
	fmt.Println("mavjud emas kalit:", err, "| ErrNil:", errors.Is(err, ErrNil))

	// SET NX PX: oddiy qulf. Birinchisi oladi, ikkinchisi ErrNil oladi.
	fmt.Println(c.Do(ctx, "SET", "lock:vehicle:7", "worker-1", "NX", "PX", "5000"))
	_, err = c.Do(ctx, "SET", "lock:vehicle:7", "worker-2", "NX", "PX", "5000")
	fmt.Println("ikkinchi qulf:", err)
	fmt.Println(c.Do(ctx, "DEL", "lock:vehicle:7"))
}
```

```text
OK <nil>
{"lat":41.31,"lon":69.28} <nil>
TTL (soniya): 30
mavjud emas kalit: redis: nil | ErrNil: true
OK <nil>
ikkinchi qulf: redis: nil
1 <nil>
```

Chiqishdan:

- `SET key value EX 30` TTL'ni bir buyruqda o'rnatadi; `TTL` keyin 30 soniyani ko'rsatdi.
- Mavjud bo'lmagan kalitga `GET` nil javob berdi (`$-1`). Bu xato emas: mijoz uni `ErrNil` ga aylantirdi. go-redis da shu rol `redis.Nil` ga tegishli.
- `SET key value NX PX 5000` birinchi chaqiruvda `OK` qaytardi, ikkinchisida nil: kalit allaqachon bor. Shu bilan oddiy muddatli qulf quriladi.
- Mijoz `net.Conn.SetDeadline` ni `context` deadline'iga bog'ladi: shuning uchun Redis sekinlashsa, chaqiruv osilib qolmaydi (71-darsdagi deadline tamoyili).

## Chuqurroq: stampede, singleflight va jitter

### Stampede

Quyidagi himoyasiz kesh klassik xatoni takrorlaydi: tekshirish va yuklash orasida `Mutex` ushlanmaydi, shuning uchun miss ko'rgan hamma goroutine yuklashga ketadi:

```go
package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

// Cache kalit bo'yicha qiymatni keshdan oladi, yo'q bo'lsa load bilan yuklaydi.
type Cache struct {
	mu   sync.Mutex
	data map[string]string
	load func(key string) (string, error)
}

func NewCache(load func(string) (string, error)) *Cache {
	return &Cache{data: map[string]string{}, load: load}
}

func (c *Cache) Get(key string) (string, error) {
	c.mu.Lock()
	v, ok := c.data[key]
	c.mu.Unlock()
	if ok {
		return v, nil
	}
	v, err := c.load(key) // keshda yo'q: bazaga boramiz
	if err != nil {
		return "", err
	}
	c.mu.Lock()
	c.data[key] = v
	c.mu.Unlock()
	return v, nil
}

func main() {
	var loads atomic.Int32
	c := NewCache(func(key string) (string, error) {
		loads.Add(1)
		time.Sleep(50 * time.Millisecond)
		return "yoqilg'i hisoboti: " + key, nil
	})

	var wg sync.WaitGroup
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if _, err := c.Get("vehicle:7:daily"); err != nil {
				fmt.Println("xato:", err)
			}
		}()
	}
	wg.Wait()
	fmt.Println("loader chaqiruvlari:", loads.Load())

	v, _ := c.Get("vehicle:7:daily")
	fmt.Println("keyingi o'qish keshdan:", v, "| loader:", loads.Load())
}
```

Chiqishi:

```text
loader chaqiruvlari: 50
keyingi o'qish keshdan: yoqilg'i hisoboti: vehicle:7:daily | loader: 50
```

50 ta goroutine, 50 ta bazaga so'rov. Haqiqiy tizimda bu 5000 so'rov bo'lishi mumkin va "sekin so'rov" 50 ms emas, soniyalar davom etishi mumkin, shu orada yangi miss'lar yig'iladi va baza o'z-o'zini bo'g'ib qo'yadi.

### singleflight

G'oya: bir kalit uchun bir vaqtda faqat bitta yuklash ketadi, qolganlar uning natijasini kutadi. `golang.org/x/sync/singleflight` shuni `Group.Do(key, fn)` bilan beradi. Quyidagi sinov uning minimal ko'rinishini (stdlib bilan yozilgan) 200 bir vaqtdagi so'rov ostida solishtiradi va jitterni tekshiradi:

```go
package main

import (
	"fmt"
	"math/rand/v2"
	"sync"
	"sync/atomic"
	"time"
)

// cache: TTL'li oddiy xotira keshi (Redis o'rnida).
type cache struct {
	mu sync.Mutex
	m  map[string]entry
}

type entry struct {
	val     string
	expires time.Time
}

func (c *cache) get(k string) (string, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	e, ok := c.m[k]
	if !ok || time.Now().After(e.expires) {
		return "", false
	}
	return e.val, true
}

func (c *cache) set(k, v string, ttl time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.m[k] = entry{v, time.Now().Add(ttl)}
}

// group: singleflight'ning minimal ko'rinishi (golang.org/x/sync/singleflight g'oyasi).
type group struct {
	mu    sync.Mutex
	calls map[string]*call
}

type call struct {
	wg  sync.WaitGroup
	val string
	err error
}

func (g *group) do(key string, fn func() (string, error)) (string, error) {
	g.mu.Lock()
	if c, ok := g.calls[key]; ok {
		g.mu.Unlock()
		c.wg.Wait()
		return c.val, c.err
	}
	c := new(call)
	c.wg.Add(1)
	g.calls[key] = c
	g.mu.Unlock()

	c.val, c.err = fn()
	c.wg.Done()

	g.mu.Lock()
	delete(g.calls, key)
	g.mu.Unlock()
	return c.val, c.err
}

// jitterTTL: bir vaqtda yaratilgan kalitlar bir vaqtda tugamasligi uchun +-20% tarqatadi.
func jitterTTL(base time.Duration) time.Duration {
	spread := int64(base) / 5
	return base - time.Duration(spread) + time.Duration(rand.Int64N(2*spread+1))
}

func run(useGroup bool) int32 {
	var loads atomic.Int32
	loader := func() (string, error) {
		loads.Add(1)
		time.Sleep(50 * time.Millisecond) // sekin PostgreSQL so'rovi
		return "position-of-truck-7", nil
	}
	c := &cache{m: map[string]entry{}}
	g := &group{calls: map[string]*call{}}

	get := func(key string) string {
		if v, ok := c.get(key); ok {
			return v
		}
		load := func() (string, error) {
			v, err := loader()
			if err == nil {
				c.set(key, v, jitterTTL(time.Minute))
			}
			return v, err
		}
		var v string
		if useGroup {
			v, _ = g.do(key, load)
		} else {
			v, _ = load()
		}
		return v
	}

	var wg sync.WaitGroup
	for i := 0; i < 200; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			get("vehicle:7:position")
		}()
	}
	wg.Wait()
	return loads.Load()
}

func main() {
	fmt.Println("singleflight'siz, 200 bir vaqtdagi so'rov, loader chaqiruvlari:", run(false))
	fmt.Println("singleflight bilan, 200 bir vaqtdagi so'rov, loader chaqiruvlari:", run(true))
	lo, hi := time.Hour, time.Duration(0)
	for i := 0; i < 10000; i++ {
		d := jitterTTL(time.Minute)
		lo, hi = min(lo, d), max(hi, d)
	}
	fmt.Println("jitter oralig'i ichida (48s..72s):", lo >= 48*time.Second && hi <= 72*time.Second)
}
```

```text
singleflight'siz, 200 bir vaqtdagi so'rov, loader chaqiruvlari: 200
singleflight bilan, 200 bir vaqtdagi so'rov, loader chaqiruvlari: 1
jitter oralig'i ichida (48s..72s): true
```

200 so'rov -> 200 loader chaqiruvi; singleflight bilan -> 1. Yechimimiz (topshiriqdagi `Cache`) ham shu g'oyaning boshqacha yozilishi, chiqishi:

```text
loader chaqiruvlari: 1
keyingi o'qish keshdan: yoqilg'i hisoboti: vehicle:7:daily | loader: 1
```

Haqiqiy `x/sync/singleflight` ishlatilganda (kompilyatsiya qilinmagan, hujjatga tayanib):

```go
// golang.org/x/sync/singleflight (kompilyatsiya qilinmagan)
var group singleflight.Group

func getVehicle(ctx context.Context, rdb *redis.Client, id string) (string, error) {
	key := "vehicle:" + id + ":last"
	val, err := rdb.Get(ctx, key).Result()
	if err == nil {
		return val, nil // hit
	}
	if !errors.Is(err, redis.Nil) {
		return "", err // Redis ishlamayapti: bazaga qaytish yoki xatoni ko'rsatish haqida qaror
	}
	v, err, _ := group.Do(key, func() (any, error) {
		v, err := loadFromDB(context.WithoutCancel(ctx), id) // birinchi so'rovning bekor qilinishi hammaga ta'sir qilmasin
		if err != nil {
			return nil, err
		}
		rdb.Set(ctx, key, v, jitterTTL(time.Minute))
		return v, nil
	})
	if err != nil {
		return "", err
	}
	return v.(string), nil
}
```

`singleflight` ning ikkita nozik nuqtasi bor. Birinchi: u faqat **bir vaqtdagi** chaqiruvlarni birlashtiradi, natijani saqlamaydi, shuning uchun keshga yozishni o'zingiz qilasiz. Ikkinchi: kutayotganlar birinchi chaqiruvchining natijasini (xatosini ham) oladi. Agar yuklash birinchi so'rovning `context`iga bog'langan bo'lsa va u bekor bo'lsa, hamma xato oladi. Yuqoridagi kodda shuning uchun `context.WithoutCancel(ctx)` ishlatilgan va yuklashga alohida muddat qo'yish tavsiya etiladi (pkg-context hujjati bo'yicha `WithoutCancel` ota-ona bekor qilinishidan ajratadi, lekin qiymatlarni saqlaydi).

### Jitter

Ko'p kalit bir vaqtda yozilsa (ishga tushirish, ommaviy yuklash) va hammasida bir xil TTL bo'lsa, ular bir vaqtda tugaydi va bazaga ommaviy miss to'lqini keladi. `jitterTTL` TTL'ni tasodifiy ±20% ga tarqatadi: 60 soniyalik TTL 48 dan 72 soniyagacha bo'ladi (sinovda 10000 chaqiruvda diapazon ichida qoldi). Tugashlar vaqt bo'yicha yoyiladi.

### Negative caching va boshqa naqshlar

Mavjud bo'lmagan kalitlarni ko'p so'rash (xato ID, hujum) har safar bazaga boradi. Davo: "topilmadi" natijasini ham qisqa TTL (masalan 30 soniya) bilan keshlash. Boshqa usullar: keshni oldindan isitish, "stale-while-revalidate" (eski qiymatni berib, fonda yangilash) va Bloom filtri. Har biri murakkablik qo'shadi; avval oddiy singleflight + jitter ko'pincha yetadi.

## Misol: go-redis bilan o'qish va yozish

Quyidagi snippet go-redis v9 hujjatiga tayanadi va **kompilyatsiya qilinmagan**:

```go
// go-redis v9 (kompilyatsiya qilinmagan)
rdb := redis.NewClient(&redis.Options{
	Addr:        "localhost:6379",
	DialTimeout: 2 * time.Second,
	ReadTimeout: 500 * time.Millisecond,
})
defer rdb.Close()

ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()

if err := rdb.Set(ctx, "vehicle:7:last", payload, 30*time.Second).Err(); err != nil {
	return err
}
val, err := rdb.Get(ctx, "vehicle:7:last").Result()
switch {
case errors.Is(err, redis.Nil):
	// kalit yo'q: miss
case err != nil:
	return err // infratuzilma xatosi
default:
	_ = val
}
ok, err := rdb.SetNX(ctx, "lock:vehicle:7", "worker-1", 5*time.Second).Result()
```

Eslatmalar: har chaqiruv `ctx` oladi, shuning uchun muddat har chaqiruvda belgilanadi; `redis.Nil` ni `errors.Is` bilan ajrating; `Options` dagi vaqt chegaralarini (`DialTimeout`, `ReadTimeout`, `WriteTimeout`, `PoolSize`) aniq qo'ying, default qiymatlarga ishonmang (ularni bu darsda tekshirmadik).

## Qachon qo'llamaslik kerak

- **Yagona haqiqat manbai sifatida**: Redis ko'p konfiguratsiyada kalitlarni yo'qotishi mumkin (restart, eviction, failover). Yo'qolsa tiklab bo'lmaydigan ma'lumotni faqat keshda saqlamang.
- **Qulf sifatida (`SET NX PX`)**: oddiy muddatli qulf ishchi sekinlashganda tugab qoladi va ikki ishchi bir vaqtda ishlaydi. Yaxlitlik kerak bo'lsa bazadagi cheklov (unique indeks) yoki fencing token ishlating; qulf faqat samaradorlik uchun (takroriy ishni kamaytirish) yaxshi.
- **Tez-tez o'zgaradigan va aniq bo'lishi shart ma'lumot** (balans, ombor qoldig'i): kesh eskirgan qiymatni ko'rsatadi. Bunday joyda keshlamang yoki invalidatsiyani yozish bilan bir tranzaksiyaga bog'lang.
- **Kichik, tez so'rovlar**: indekslangan primary-key so'rovi 1 ms bo'lsa, Redis'ga tarmoq chaqiruvi foyda bermaydi, faqat murakkablik qo'shadi.
- **Katta qiymatlar va ko'p kalit**: bir megabaytlik qiymatlar tarmoq va serializatsiyani bo'g'adi; kalit soni cheksiz o'sishi (TTL'siz) xotirani to'ldiradi.
- **Redis uzilganda hamma narsa to'xtashi**: Redis xatosida bazaga qaytish (fail-open) bazani stampede'ga duchor qiladi, xatoni ko'rsatish (fail-closed) servisni to'xtatadi. Strategiyani oldindan tanlang va circuit breaker bilan himoyalang.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da `ioredis` auto-pipelining va bitta ulanishni beradi; go-redis esa ichida ulanishlar havzasini saqlaydi (78-dars). Node'da `Promise` ni map'da saqlab bir xil kalit uchun yuklashni birlashtirish odatiy bo'lib, aslida bu singleflight bilan bir xil g'oya. Go'da farq shuki, birlashtirish goroutine'lar orasida bo'ladi, shuning uchun uni `Mutex` yoki tayyor `singleflight` bilan himoyalash va `-race` bilan sinash shart.

Servis uchun andoza:

- Cache-aside: Redis -> miss -> singleflight(yuklash) -> keshga yozish.
- Kalitlarda prefiks va versiya; TTL har doim bor (TTL'siz kalit yo'q).
- `jitterTTL` bilan TTL tarqatish; negative caching qisqa TTL bilan.
- Har Redis chaqiruvida `context` va aniq timeout; `redis.Nil` va haqiqiy xatolar ajratilgan.
- Redis uzilishi uchun strategiya (fail-open/closed) va metrikalar: hit nisbati, miss, yuklash vaqti.
- Singleflight yuklashi alohida (bekor qilinmaydigan yoki o'z muddatli) context bilan.

## Xulosa

- Cache-aside: o'qi, miss bo'lsa yukla va yoz; kesh yo'qolsa tizim sekinlashadi, lekin noto'g'ri ishlamaydi. Baza haqiqat manbai bo'lib qoladi.
- Redis protokoli oddiy: lokal `redis-server` 7.0.15 ga yozilgan mini mijoz `SET EX`, `GET`, `TTL`, nil javob va `SET NX PX` ni ko'rsatdi. go-redis da kalit yo'qligi `redis.Nil`.
- Cache stampede: himoyasiz kesh 50 (va 200) bir vaqtdagi so'rovda 50 (va 200) bazaga chaqiruv qildi; singleflight g'oyasi bilan 1 ta.
- Jitter TTL'larni tarqatib, ommaviy bir vaqtda tugashni oldini oladi; negative caching mavjud bo'lmagan kalitlardan himoyalaydi.
- Kesh yagona haqiqat manbai ham, ishonchli qulf ham emas. go-redis va `x/sync/singleflight` snippet'lari bu darsda kompilyatsiya qilinmagan.
