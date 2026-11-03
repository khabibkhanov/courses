---
n: 44
slug: mutex-rwmutex
title: "Mutex, RWMutex va contention"
summary: "sync.Mutex va sync.RWMutex semantikasi, nusxalash va rekursiv RLock tuzoqlari, kritik bo'lim chegarasini to'g'ri tanlash, contention sabablari va sharding hamda boshqa yechimlar, TryLock va sync.Map'ning o'rni."
duration: 40
sources:
  - id: pkg-sync
    note: "Mutex, RWMutex, Map va TryLock hujjatlari: nusxalamaslik, Unlock qoidasi, rekursiv read-lock taqiqi, synchronizes-before qoidalari"
  - id: 100go
    note: "Concurrency boblari: mutex'larni slice va map bilan noaniq ishlatish, sync turlarini nusxalash mavzulari"
  - id: gopl
    note: "Concurrency with Shared Variables bobi: mutual exclusion va read/write mutex"
quiz:
  - q: "Quyidagi metodni `go vet` nega ogohlantiradi? `func (c Counter) Value() int { c.mu.Lock(); defer c.mu.Unlock(); return c.n }` (Counter ichida sync.Mutex bor)"
    options:
      - "Defer Unlock mutex'ni ikki marta ochadi"
      - "Value receiver bo'lgani uchun metod faqat o'qiy olmaydi"
      - "Value receiver Counter'ni, demak mutex'ni ham nusxalaydi: lock asl obyektni himoyalamaydi"
      - "Mutex'ni faqat pointer receiver'dan chaqirish mumkin"
    answer: 2
    explain: "Har chaqiruvda Counter nusxasi yaratiladi, lock esa nusxaning mutex'ini oladi. Asl obyektga parallel yozuvchi esa boshqa mutex'ni ko'radi, shuning uchun himoya yo'q. vet bu holatni 'passes lock by value' deb belgilaydi. Mutex'ni birinchi ishlatilgandan keyin nusxalash taqiqlangan."
  - q: "Goroutine A `mu.RLock()` oldi. Goroutine B `mu.Lock()` ni chaqirib, navbatda kutmoqda. Endi A yana `mu.RLock()` chaqiradi. Nima bo'ladi?"
    options:
      - "A bloklanadi: kutayotgan yozuvchi yangi reader'larni to'xtatadi, A esa birinchi RLock'ni qo'yib yuborolmaydi, ya'ni deadlock"
      - "A ikkinchi RLock'ni darhol oladi, chunki reader'lar bir-biriga xalaqit bermaydi"
      - "B Lock'ni oladi va A ning RLock'i bekor qilinadi"
      - "Run-time xato: rekursiv RLock kompilyatsiya vaqtida rad etiladi"
    answer: 0
    explain: "Hujjat: yozuvchi Lock chaqirgandan keyin yangi RLock'lar yozuvchi lock'ni olib qaytarguncha bloklanadi, shuning uchun rekursiv read-locking taqiqlangan. Dars misolida aynan shu holat 'all goroutines are asleep - deadlock!' bilan tugaydi."
  - q: "sync.Mutex haqida qaysi gap hujjatga mos?"
    options:
      - "Unlock faqat Lock qilgan goroutine'dan chaqirilishi mumkin"
      - "Qulflanmagan mutex'ni Unlock qilish no-op"
      - "Mutex reentrant: bir goroutine ikki marta Lock qila oladi"
      - "Qulflangan Mutex muayyan goroutine bilan bog'lanmagan: Lock'ni bir goroutine, Unlock'ni boshqasi qila oladi"
    answer: 3
    explain: "Hujjat shunday yozadi va qulflanmagan mutex'ni Unlock qilish run-time xato deb belgilanadi. Reentrant emas: bir goroutine ikkinchi Lock'da o'zini bloklaydi. Bu xususiyatni ongli ishlatish kamdan-kam kerak."
  - q: "Kesh `Lookup` metodi sekin tashqi chaqiruvni lock ushlagan holda bajaradi. Chaqiruvni lock tashqarisiga chiqargandan keyin qanday yangi xatti-harakat paydo bo'lishi mumkin?"
    options:
      - "Kesh umuman ishlamay qoladi"
      - "Bitta kalit uchun bir vaqtda bir nechta goroutine tashqi chaqiruvni bajarishi mumkin (takroriy ish)"
      - "Map'ga yozish data race bo'ladi"
      - "Deadlock paydo bo'ladi"
    answer: 1
    explain: "Lock ochilgach, ikki goroutine bir kalit uchun keshdan miss olib, ikkalasi ham tashqi chaqiruvni bajarishi mumkin. Map'ga yozish baribir lock ostida, shuning uchun race ham deadlock yo'q. Takroriy ishni singleflight kamaytiradi (48-dars)."
  - q: "Jamoa 'o'qishlar ko'p, demak RWMutex har doim Mutex'dan tez' degan qaror qabul qildi. Dars ma'lumotlariga ko'ra eng to'g'ri baho qaysi?"
    options:
      - "Qaror to'g'ri emas: kritik bo'lim juda qisqa bo'lsa, RWMutex Mutex'dan tezroq bo'lmasligi mumkin; tezlik o'lchab ko'rilishi kerak"
      - "Qaror to'g'ri, RWMutex har doim tezroq"
      - "RWMutex faqat yozuv ko'p bo'lganda tezroq"
      - "RWMutex va Mutex orasida hech qanday farq yo'q"
    answer: 0
    explain: "Dars o'lchovida ikki yadroli mashinada qisqa o'qish bo'limlarida ikkala variant ham bir xil tartibdagi ns/op berdi. RWMutex uzun o'qish bo'limlarida va ko'p yadroda foyda berishi mumkin, lekin buni o'lchamasdan faraz qilmang."
  - q: "Bitta umumiy map va bitta mutex 64 ta goroutine uchun to'siq bo'ldi, goroutine'lar asosan turli kalitlar bilan ishlaydi. Qaysi o'zgarish eng to'g'ri?"
    options:
      - "Mutex'ni RWMutex ga almashtirish, har doim"
      - "Kalitlarni hash bo'yicha bir nechta shard'ga bo'lib, har biriga alohida mutex berish"
      - "Hamma goroutine'ni bitta goroutine'ga birlashtirish"
      - "Mutex'ni sync.Map ga almashtirishni har doim birinchi qadam qilish"
    answer: 1
    explain: "Turli kalitlar odatda turli shard'larga tushadi va lock'lar bo'linadi. Bitta 'issiq' kalit bo'lsa sharding yordam bermaydi. sync.Map esa hujjatga ko'ra ikki aniq holat uchun optimallashtirilgan va ko'p kodda oddiy map + lock afzal."
task:
  title: "Sekin chaqiruvni lock tashqarisiga chiqarish"
  prompt: |
    `Enricher.Lookup` qurilma identifikatori bo'yicha manzilni keshdan oladi, kesh bo'sh bo'lsa sekin geokodlash chaqiruvini (`slowGeocode`, 20 ms) bajaradi. Hozirgi kod butun metod davomida mutex'ni ushlab turadi, shuning uchun turli kalitlar uchun 8 ta parallel `Lookup` ketma-ket bajariladi (jami 160 ms ga yaqin).

    `Lookup` ni qayta yozing: kesh o'qish va yozish lock ostida, sekin chaqiruv esa lock tashqarisida bo'lsin. `main` jami vaqt 100 ms dan kam bo'lishini kutadi. `go run -race` ogohlantirishsiz o'tsin.

    Eslatma: lock tashqarisida bir kalit uchun ikkita goroutine bir vaqtda chaqiruv qilishi mumkin. Bu qabul qilinadi (48-darsda uni singleflight bilan kamaytiramiz), lekin natija noto'g'ri bo'lmasligi shart.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "sync"
        "time"
    )

    // slowGeocode koordinatani manzilga aylantiruvchi sekin tashqi chaqiruvni simulyatsiya qiladi.
    func slowGeocode(id string) string {
        time.Sleep(20 * time.Millisecond)
        return "manzil:" + id
    }

    // Enricher natijalarni keshlaydi.
    type Enricher struct {
        mu    sync.Mutex
        cache map[string]string
    }

    func NewEnricher() *Enricher {
        return &Enricher{cache: make(map[string]string)}
    }

    func (e *Enricher) Lookup(id string) string {
        e.mu.Lock()
        defer e.mu.Unlock()
        if v, ok := e.cache[id]; ok {
            return v
        }
        v := slowGeocode(id)
        e.cache[id] = v
        return v
    }

    func main() {
        e := NewEnricher()
        ids := []string{"a", "b", "c", "d", "e", "f", "g", "h"}

        start := time.Now()
        var wg sync.WaitGroup
        results := make([]string, len(ids))
        for i, id := range ids {
            wg.Add(1)
            go func() {
                defer wg.Done()
                results[i] = e.Lookup(id)
            }()
        }
        wg.Wait()
        elapsed := time.Since(start)

        fmt.Println("natijalar:", results)
        fast := elapsed < 100*time.Millisecond
        fmt.Println("100ms dan tez:", fast)
        if !fast {
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

    // slowGeocode koordinatani manzilga aylantiruvchi sekin tashqi chaqiruvni simulyatsiya qiladi.
    func slowGeocode(id string) string {
        time.Sleep(20 * time.Millisecond)
        return "manzil:" + id
    }

    // Enricher natijalarni keshlaydi.
    type Enricher struct {
        mu    sync.Mutex
        cache map[string]string
    }

    func NewEnricher() *Enricher {
        return &Enricher{cache: make(map[string]string)}
    }

    func (e *Enricher) Lookup(id string) string {
        e.mu.Lock()
        v, ok := e.cache[id]
        e.mu.Unlock()
        if ok {
            return v
        }

        // Sekin chaqiruv lock'siz bajariladi.
        v = slowGeocode(id)

        e.mu.Lock()
        e.cache[id] = v
        e.mu.Unlock()
        return v
    }

    func main() {
        e := NewEnricher()
        ids := []string{"a", "b", "c", "d", "e", "f", "g", "h"}

        start := time.Now()
        var wg sync.WaitGroup
        results := make([]string, len(ids))
        for i, id := range ids {
            wg.Add(1)
            go func() {
                defer wg.Done()
                results[i] = e.Lookup(id)
            }()
        }
        wg.Wait()
        elapsed := time.Since(start)

        fmt.Println("natijalar:", results)
        fast := elapsed < 100*time.Millisecond
        fmt.Println("100ms dan tez:", fast)
        if !fast {
            os.Exit(1)
        }
    }
  solutionNotes: |
    - Avval keshni qisqa kritik bo'limda tekshiramiz va lock'ni ochamiz. Sekin `slowGeocode` lock'siz bajariladi, natija esa yana qisqa lock ostida keshga yoziladi.
    - Natija ketma-ket variant 8 x 20 ms = 160 ms o'rniga 20 ms ga yaqin (parallel). `main` 100 ms chegarani tekshiradi.
    - Bu yechimning bahosi: bir kalit uchun bir vaqtda ikki goroutine chaqiruv qilishi mumkin ("check-then-act" oralig'i lock tashqarisida). Natija to'g'ri, ishning bir qismi takrorlanadi. Takrorlanishni yo'qotish kerak bo'lsa singleflight (48-dars) ishlatiladi.
    - `defer Unlock` ni bu yerda ishlatmaymiz: kritik bo'limlar metodning butun uzunligi emas, ikkita alohida qisqa blok. Har blokdan keyin darhol `Unlock`.
    - Kesh yozuvida `cache[id] = v` ikki goroutine bir xil qiymat yozsa ham xavfsiz: ikkalasi lock ostida.
  checklist:
    - "Sekin chaqiruv `mu.Lock()` ushlangan paytda bajarilmaydi"
    - "Kesh o'qish va yozish lock ostida: `go run -race` ogohlantirishsiz o'tadi"
    - "`main` ning 100 ms chegarasi bajariladi"
    - "Natijalar to'g'ri (`manzil:a` ... `manzil:h`)"
    - "Lock tashqarisida takroriy chaqiruv imkoniyati nima uchun qabul qilinganini izohlay olasiz"
---

## Muammo

Telemetriya servisida har bir qurilmaning oxirgi holati umumiy `map` da turadi: HTTP handler'lar uni o'qiydi, qabul qiluvchi goroutine'lar yangilaydi. Shu map'ga mutex qo'yilgan va hammasi to'g'ri ishlaydi. Keyin yuk oshadi va latency grafigida kutilmagan narsa ko'rinadi: CPU 30% da, lekin so'rovlar navbatda turibdi. Sabab: biror kimsa mutex ichiga "faqat bir marta" geokodlash chaqiruvini qo'ygan, shuning uchun butun servis shu bitta lock atrofida ketma-ket ishlamoqda.

Ikkinchi odatiy holat: kod `Counter` struct'ini qiymat bo'yicha uzatadi, mutex nusxalanadi va himoya jimgina yo'qoladi. Uchinchisi: o'qishlar ko'p ekan deb mutex `RWMutex` ga almashtiriladi, bir joyda rekursiv `RLock` paydo bo'ladi va servis yuk ostida qotadi.

Bu darsda `sync.Mutex` va `sync.RWMutex` semantikasini hujjatga ko'ra, xotira modeli bilan bog'lab ko'ramiz. Keyin contention (lock uchun raqobat) nimaligini va uni qanday kamaytirishni, `RWMutex` qachon foyda bermasligini o'lchov bilan ko'rsatamiz.

## Asosiy g'oya

### Mutex

`sync.Mutex` o'zaro istisno (mutual exclusion) qulfi. Hujjatga ko'ra uning zero value'si qulflanmagan holat, shuning uchun alohida konstruktor kerak emas. Asosiy qoidalar:

- `Lock` qulf band bo'lsa goroutine'ni bloklaydi, `Unlock` qulfni ochadi. Qulflanmagan mutex'ni `Unlock` qilish run-time xato.
- Mutex birinchi ishlatilgandan keyin nusxalanmasligi kerak. Struct'da mutex bo'lsa, struct'ni pointer bilan uzating va metodlarni pointer receiver bilan yozing (9-dars).
- Qulflangan mutex aniq goroutine bilan bog'lanmagan: bir goroutine `Lock`, boshqasi `Unlock` qilishi mumkin. Bu ruxsat etilgan, lekin kamdan-kam kerak.
- Mutex reentrant emas. Ikkinchi `Lock` chaqiruvi o'zini bloklaydi. Metodlar bir-birini chaqirsa, tashqi metod lock oladi, ichki metod lock olmaydi va nomida buni ko'rsatish odat (`getLocked`).
- Xotira modeli bilan bog'lanish: `n`-chi `Unlock` har qanday `m`-chi `Lock` dan oldin sodir bo'ladi (`n < m`). Ya'ni kritik bo'limda yozilgan hamma narsa keyingi kritik bo'limda ko'rinadi (43-dars).

Konvensiya sifatida mutex himoya qiladigan maydonlar bilan bir struct'da, ularning ustida turadi va izohda nimani himoya qilishi yoziladi. Shunda o'quvchi "qaysi lock nimani qulflaydi" degan savolga javobni kodning o'zidan oladi.

### RWMutex

`sync.RWMutex` ixtiyoriy sonli reader yoki bitta writer ushlay oladigan qulf. Hujjatning muhim qoidalari:

- Writer `Lock` ni chaqirib, qulfni hozircha reader'lar ushlab turgan bo'lsa, shu paytdan yangi `RLock` chaqiruvlari writer qulfni olib qaytarguncha bloklanadi. Maqsad: writer abadiy ochlikda qolmasligi.
- Shu sababli rekursiv read-locking taqiqlangan: ikkinchi `RLock` kutayotgan writer tufayli bloklanishi mumkin, birinchi `RLock` esa ikkinchi `RLock` tugashini kutib qo'yib yuborilmaydi.
- `RLock` ni `Lock` ga ko'tarib bo'lmaydi, `Lock` ni `RLock` ga tushirib ham bo'lmaydi.

Quyidagi dastur rekursiv `RLock` dan deadlock hosil qiladi. Bu kod deadlock'ga tushadi:

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

// Bu dastur deadlock'ga tushadi.
func main() {
	var mu sync.RWMutex

	mu.RLock()
	fmt.Println("birinchi RLock olindi")

	go func() {
		mu.Lock() // RLock tugashini kutadi va yangi reader'larni to'xtatadi
	}()
	time.Sleep(50 * time.Millisecond)

	mu.RLock() // ikkinchi RLock: yozuvchi navbatda, shuning uchun bloklanadi
	fmt.Println("bu qatorga yetilmaydi")
}
```

Go 1.24.7 da chiqish (stack trace qisqartirilgan):

```text
birinchi RLock olindi
fatal error: all goroutines are asleep - deadlock!

goroutine 1 [sync.RWMutex.RLock]:
...
goroutine 18 [sync.RWMutex.Lock]:
...
```

Ikkala goroutine ham bloklangan: asosiy `RLock` da, yordamchi `Lock` da. Runtime hamma goroutine uxlayotganini ko'rib, "deadlock" fatal xatosi bilan to'xtatadi. Bu faqat dastur ichidagi barcha goroutine'lar bloklanganda ishlaydi: server kabi boshqa goroutine'lar ishlayotgan dasturda deadlock jim qoladi, ikkita goroutine shunchaki abadiy qotadi. Shu sababli ularni goroutine profilidan qidirish kerak (41-dars).

## Chuqurroq: kritik bo'lim chegarasi va contention

### Nima kritik bo'limga kiradi

Kritik bo'lim iloji boricha qisqa bo'lishi kerak, lekin faqat shunday: umumiy holatni o'qish va yozishdan iborat ketma-ketlik bitta lock ostida qolsin. Ikki xil xato uchraydi:

1. **Kritik bo'lim juda uzun.** Lock ostida tarmoq chaqiruvi, disk I/O, kanalga yuborish yoki boshqa lock olish. Bu contention'ning asosiy sababi: bitta sekin amal hamma kutuvchilarni ushlab turadi. Yechim: kerakli ma'lumotni lock ostida nusxalab oling yoki qiymatni qaytaring, sekin ishni lock tashqarisida bajaring.
2. **Kritik bo'lim juda kalta.** "O'qi, tekshir, yoz" ketma-ketligini ikki alohida lock bilan yozish: data race yo'q, lekin mantiqiy race condition bor (43-dars). Ketma-ketlik bitta lock ostida bo'lishi shart, yoki qiymatni qayta tekshirish kerak.

Dars topshirig'i birinchi xatoning tuzatilishi. Tuzatishning narxi bor: lock tashqarisiga chiqarilgan "tekshir-keyin-bajar" oralig'ida boshqa goroutine ham xuddi shu kalitni keshdan topolmay, ikkinchi marta chaqiruv qiladi. Natija to'g'ri qoladi, ish takrorlanadi. Takrorlanishni yo'qotish usuli 48-darsda.

### Lock ostida nima qilish mumkin emas

- Noma'lum kodni chaqirish (callback, interface metodi): u o'sha lock'ni qayta olishga urinishi mumkin.
- Kanalga yuborish yoki kanaldan qabul qilish: qabul qiluvchi kechiksa lock ham ushlanib qoladi.
- Ikkinchi lock olish: faqat butun dastur uchun yagona tartib (lock ordering) bo'lsagina. Ikki goroutine A va B lock'larini turli tartibda olsa, deadlock bo'ladi.

### Contention nima va uni qanday kamaytirish

Contention: bir nechta goroutine bir lock'ni olishga urinib, ko'pi kutadigan holat. Belgilari: yuk oshganda throughput o'smaydi, CPU to'liq band emas, goroutine profilida ko'p goroutine `sync.Mutex.Lock` yoki shunga o'xshash kutish holatida. Aniq o'lchash uchun mutex profili bor (63-dars): u kutuvchilar lock'ni ushlab turgan kodni ko'rsatadi.

Kamaytirish yo'llari, samarasi kamayish tartibida emas, qo'llanish ketma-ketligida:

1. Kritik bo'limni qisqartiring (yuqorida).
2. Umumiy holatdan voz keching: har goroutine o'z hisoblagichini yuritadi, oxirida birlashtiriladi.
3. Holatni bo'ling (sharding): kalitlarni hash bo'yicha `N` ta shard'ga ajratib, har biriga alohida mutex bering. Turli kalitlar odatda turli lock'larni oladi.
4. Bitta o'zgaruvchi uchun `sync/atomic` (46-dars).
5. Faqat shundan keyin lock turini (RWMutex, `sync.Map`) o'ylab ko'ring.

Sharding'ning chegarasi: bitta "issiq" kalit hamma so'rovni baribir bitta shard'ga yuboradi. Bundan tashqari, butun holatni o'qish (`Total` kabi) hamma shard'larni ketma-ket qulflaydi va bir lahzali izchil rasm bermaydi.

### RWMutex qachon foyda beradi

Intuitiv javob: "o'qishlar ko'p bo'lsa RWMutex". Haqiqat murakkabroq: `RLock` va `RUnlock` ham (implementatsiyada) umumiy hisoblagichni yangilaydi, shuning uchun juda qisqa o'qish bo'limlarida ular oddiy `Mutex` dan ustun kelmasligi mumkin. Biz buni o'lchadik: ikki yadroli linux/amd64 sandbox'da, Go 1.24.7, `go test -bench -cpu 2` bilan `RunParallel` ichida map'dan bitta kalitni o'qish. Natija bir xil tartibda:

```text
BenchmarkMutexRead-2     ~17-26 ns/op
BenchmarkRWMutexRead-2   ~17-19 ns/op
```

Bu raqamlar bir mashina va bitta mikro-benchmark uchun, takroriy o'lchovlar orasida ham farqlanadi (`-count 3`), shuning uchun natija "RWMutex sezilarli tezlashtirmadi" deb o'qilishi kerak, aniq nisbat sifatida emas. Ko'p yadroli mashinada yoki uzunroq o'qish bo'limlarida natija boshqacha bo'lishi mumkin, biz bunday sharoitda o'lchamadik. Qoida: `RWMutex` ni faqat o'qishlar ham uzoq davom etsa va o'lchov foyda ko'rsatsa tanlang.

### TryLock

`Mutex.TryLock` (Go 1.18 dan) qulfni kutmasdan olishga urinadi. Hujjat ochiq aytadi: to'g'ri qo'llanishlar mavjud, lekin ular kamdan-kam va `TryLock` ko'pincha mutex'dan noto'g'ri foydalanishning belgisi. Misol: "agar band bo'lsa, ishni o'tkazib yubor" (masalan, davriy tozalash). Oddiy holatda ishlatmang.

### sync.Map

`sync.Map` hujjatga ko'ra ixtisoslashgan tur va ko'p kodda tipli xavfsizlik uchun oddiy `map` ni alohida lock bilan ishlatish yaxshiroq. U ikki holat uchun optimallashtirilgan: (1) kalit bir marta yoziladi, ko'p o'qiladi (faqat o'sadigan keshlar), (2) goroutine'lar bir-biriga kesishmaydigan kalit to'plamlari bilan ishlaydi. Uchinchi holat uchun oddiy map va lock afzal.

## Misol: Fleet, copylocks va sharding

Birinchi dastur avtopark xaritasi: `Update` yozadi, `Get` o'qiydi, `Snapshot` map nusxasini qaytaradi, shunda chaqiruvchi lock'siz o'qiy oladi.

```go
package main

import (
	"fmt"
	"maps"
	"slices"
	"sync"
)

// Point - transport vositasining oxirgi GPS nuqtasi.
type Point struct {
	Lat, Lon float64
}

// Fleet - avtoparkdagi mashinalarning oxirgi joylashuvi.
type Fleet struct {
	mu  sync.RWMutex
	pos map[string]Point
}

func NewFleet() *Fleet {
	return &Fleet{pos: make(map[string]Point)}
}

func (f *Fleet) Update(id string, p Point) {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.pos[id] = p
}

func (f *Fleet) Get(id string) (Point, bool) {
	f.mu.RLock()
	defer f.mu.RUnlock()
	p, ok := f.pos[id]
	return p, ok
}

// Snapshot map'ning nusxasini qaytaradi: chaqiruvchi lock'siz o'qiy oladi.
func (f *Fleet) Snapshot() map[string]Point {
	f.mu.RLock()
	defer f.mu.RUnlock()
	return maps.Clone(f.pos)
}

func main() {
	f := NewFleet()
	var wg sync.WaitGroup
	for i := range 50 {
		wg.Add(2)
		id := fmt.Sprintf("truck-%02d", i%5)
		go func() {
			defer wg.Done()
			f.Update(id, Point{41.30 + float64(i)/1000, 69.27})
		}()
		go func() {
			defer wg.Done()
			f.Get(id)
		}()
	}
	wg.Wait()

	snap := f.Snapshot()
	ids := slices.Sorted(maps.Keys(snap))
	fmt.Println("mashinalar:", ids)
}
```

```text
mashinalar: [truck-00 truck-01 truck-02 truck-03 truck-04]
```

Dastur `go run -race` bilan ogohlantirishsiz o'tdi. Uchta qaror: mutex ustida himoyalangan maydonlar turibdi (`pos`); `Snapshot` ichki map'ni emas, nusxasini qaytaradi, chunki ichki map'ni qaytarsak chaqiruvchi uni lock'siz o'qiydi va bu race; `defer` kritik bo'limlar butun metod bo'lgani uchun qulay va xavfsiz (panic bo'lsa ham `Unlock` bajariladi).

Ikkinchi dastur value receiver tuzog'i. Bu kod noto'g'ri:

```go
package main

import (
	"fmt"
	"sync"
)

type Counter struct {
	mu sync.Mutex
	n  int
}

// Value receiver: Counter nusxalanadi, mutex ham nusxalanadi.
func (c Counter) Value() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.n
}

func main() {
	var c Counter
	fmt.Println(c.Value())
}
```

`go vet` buni darhol ushlaydi (Go 1.24.7):

```text
l44b/main.go:14:9: Value passes lock by value: g/l44b.Counter contains sync.Mutex
```

Metod har chaqiruvda `Counter` nusxasini oladi va nusxaning mutex'ini qulflaydi: asl obyekt esa himoyasiz. Tuzatish: pointer receiver. `go vet` ni CI'da majburiy qiling: bu tekshiruv `copylocks` nomli analizatordan keladi.

Uchinchi dastur sharding. 16 ta shard, har birida o'z mutex'i va map'i:

```go
package main

import (
	"fmt"
	"hash/maphash"
	"sync"
)

const shardCount = 16

type shard struct {
	mu sync.Mutex
	n  map[string]int
}

// Counter kalit bo'yicha hisoblagich: kalitlar shard'larga bo'linadi,
// shuning uchun turli kalitlar odatda turli lock'larni oladi.
type Counter struct {
	seed   maphash.Seed
	shards [shardCount]shard
}

func NewCounter() *Counter {
	c := &Counter{seed: maphash.MakeSeed()}
	for i := range c.shards {
		c.shards[i].n = make(map[string]int)
	}
	return c
}

func (c *Counter) shardFor(key string) *shard {
	return &c.shards[maphash.String(c.seed, key)%shardCount]
}

func (c *Counter) Inc(key string) {
	s := c.shardFor(key)
	s.mu.Lock()
	s.n[key]++
	s.mu.Unlock()
}

func (c *Counter) Total() int {
	total := 0
	for i := range c.shards {
		s := &c.shards[i]
		s.mu.Lock()
		for _, v := range s.n {
			total += v
		}
		s.mu.Unlock()
	}
	return total
}

func main() {
	c := NewCounter()
	var wg sync.WaitGroup
	for w := range 8 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := range 1000 {
				c.Inc(fmt.Sprintf("truck-%02d", (w+i)%20))
			}
		}()
	}
	wg.Wait()
	fmt.Println("jami:", c.Total())
}
```

```text
jami: 8000
```

Natija deterministik: 8 goroutine x 1000 ta oshirish. `hash/maphash` har jarayon uchun tasodifiy seed bilan hash beradi, shuning uchun kalit qaysi shard'ga tushishi ishga tushirishlar orasida farq qiladi, lekin jami bir xil. `-race` bilan toza o'tdi. Shard soni o'lchov bilan tanlanadi; 16 bu misolda ixtiyoriy.

## Qachon qo'llamaslik kerak

- Bitta oddiy hisoblagich uchun mutex o'rniga `atomic.Int64` sodda va tezroq (46-dars). Mutex bir nechta o'zgaruvchining izchilligi kerak bo'lganda to'g'ri.
- `RWMutex` ni "ehtiyot shart" ishlatmang. Ko'p kodda oddiy `Mutex` yetarli va ko'p xatoni oldini oladi (rekursiv `RLock`). Uni o'lchov bilan asoslang.
- Lock ostida I/O qilmang. Agar kod tuzilishi buni majbur qilsa, mutex o'rniga boshqa dizayn (kanal, alohida egasi goroutine) o'ylang.
- Sharding har kalitning teng ehtimolli ishlatilishini faraz qiladi. Bitta kalit hukmron bo'lsa foyda yo'q va kod murakkablashadi.
- Hamma narsani bitta global mutex bilan himoyalash tez ishlab chiqish uchun yaxshi boshlanish, lekin kritik bo'lim ustida o'lchovsiz optimizatsiya qilmang: avval mutex profilini oling.
- `TryLock` va "qulfni boshqa goroutine'da ochish" kabi ruxsat etilgan, lekin g'ayrioddiy usullar oddiy kod uchun emas.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da bitta oqim bo'lgani uchun oddiy obyektga ikki callback bir vaqtda tegmaydi va mutex kerak emas. Lekin `await` chegaralari ichida mantiqiy race condition mavjud: ikkita so'rov bir vaqtda "tekshir, `await` bilan tashqi chaqiruv qil, yoz" bajarsa, ikkalasi ham tekshiruvdan o'tadi. Odatiy yechim: promise'ni map'da saqlash (in-flight deduplikatsiya) yoki `async-mutex` kabi kutubxona.

Go'da muammo bir daraja chuqurroq: xotiraga kirish ham parallel. Shuning uchun Go kodi ikkita qatlamni talab qiladi: (1) xotira darajasida lock yoki atomic, (2) mantiq darajasida kritik bo'limni to'g'ri chegaralash. `Enricher` misolida lock ostida sekin chaqiruv bo'lganda butun servis ketma-ket ishlaydi. Node.js'da xuddi shu xato `await` ni bir-biriga ketma-ket zanjirlash ko'rinishida chiqardi. Ko'rib chiqishda tekshiriladigan qoida: `Lock()` va `Unlock()` orasida chaqiriladigan har bir funksiya qisqa, lokal va I/O'siz ekanini ko'rib chiqing.

## Xulosa

- `sync.Mutex` ning zero value'si qulflanmagan; uni birinchi ishlatilgandan keyin nusxalab bo'lmaydi (`go vet` copylocks ushlaydi), u reentrant emas va qulflangan holda muayyan goroutine'ga bog'lanmagan.
- `RWMutex` kutayotgan writer bo'lsa yangi reader'larni to'xtatadi, shu sababli rekursiv `RLock` deadlock beradi; `RLock` ni `Lock` ga ko'tarib bo'lmaydi.
- Kritik bo'lim qisqa va faqat umumiy holatga tegadigan bo'lishi kerak; sekin chaqiruvni lock tashqarisiga chiqarish takroriy ish xavfi bilan keladi, uni singleflight (48-dars) kamaytiradi.
- Contention'ni kritik bo'limni qisqartirish, holatni bo'lish (sharding), atomic va faqat keyin lock turini o'zgartirish bilan kamaytiring; avval o'lchang.
- `RWMutex` har doim tezroq emas: ikki yadroli sandbox'da qisqa o'qishlarda Mutex bilan bir xil tartibdagi vaqt chiqdi; qarorni o'z yukingizdagi o'lchov bilan asoslang.
