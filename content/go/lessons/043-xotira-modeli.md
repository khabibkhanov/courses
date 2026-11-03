---
n: 43
slug: xotira-modeli
title: "Go xotira modeli: happens-before va data race"
summary: "Go xotira modeli nimani kafolatlaydi: data race ta'rifi, happens-before va synchronized-before munosabatlari, kanal, mutex, Once, atomic qoidalari, noto'g'ri sinxronlash idiomalari va -race detektori bilan ishlash."
duration: 45
sources:
  - id: go-mem
    note: "Introduction, Advice, Informal Overview, Memory Model, Synchronization (Goroutine creation/destruction, Channel communication, Locks, Once, Atomic Values) va Incorrect synchronization bo'limlari"
  - id: race-detector
    note: "Usage, Requirements, Options (GORACE), Runtime Overhead va Typical Data Races bo'limlari"
  - id: 100go
    note: "Concurrency boblari: data race va race condition farqi mavzusi"
quiz:
  - q: "Quyidagilardan qaysi biri Go xotira modeli ma'nosidagi data race?"
    options:
      - "Ikki goroutine bitta o'zgaruvchini faqat o'qiydi"
      - "Bitta goroutine o'zgaruvchiga yozadi, ikkinchisi sinxronlashsiz o'qiydi"
      - "Ikki goroutine bitta hisoblagichga atomic.AddInt64 bilan qo'shadi"
      - "Ikki goroutine bitta map'ga bitta mutex ostida yozadi"
    answer: 1
    explain: "Data race: bir xil joyga yozish boshqa o'qish yoki yozish bilan bir vaqtda sodir bo'lishi (sinxronlashsiz). Faqat o'qish race emas, atomic amallar ham istisno, mutex esa tartibni ta'minlaydi."
  - q: "Racy hisoblagich dasturi `-race`siz ishga tushirilganda har gal 1000 chiqardi. Bundan nima xulosa qilish to'g'ri?"
    options:
      - "Kod xavfsiz, chunki natija to'g'ri"
      - "Kod xavfsiz, chunki hisoblagich int, int esa atomic"
      - "Race bor, natija shunchaki tasodifan to'g'ri chiqdi; -race bilan tekshirish shart"
      - "Race yo'q, ammo -race noto'g'ri ogohlantiradi"
    answer: 2
    explain: "Xotira modeli race'li dastur uchun natijani kafolatlamaydi. To'g'ri chiqish tasodif: jadval, yadrolar soni, kompilyator versiyasi o'zgarsa boshqacha bo'lishi mumkin. Dars misolida aynan shu holat ko'rsatilgan."
  - q: "`var done bool` ni boshqa goroutine `true` qiladi, asosiy goroutine esa `for !done {}` bilan kutadi. Xotira modeli bu haqda nima deydi?"
    options:
      - "Yozuv albatta ko'rinadi, faqat kechikish bo'lishi mumkin"
      - "Tsikl tugasa ham, done dan oldin yozilgan boshqa o'zgaruvchilar ko'rinishi kafolatlanadi"
      - "Faqat done int bo'lsa kafolat bor"
      - "Yozuvning ko'rinishi ham, tsiklning tugashi ham kafolatlanmagan"
    answer: 3
    explain: "Orada sinxronlash hodisasi yo'q, shuning uchun done ning yangilanishi umuman ko'rinmasligi mumkin va tsikl tugamasligi mumkin. Tugasa ham, oldingi yozuvlar ko'rinishi kafolatlanmaydi. Yechim: kanal, mutex yoki atomic."
  - q: "Quyidagi holatlardan qaysi biri happens-before munosabatini YARATMAYDI?"
    options:
      - "Goroutine funksiyasining qaytishi (tugashi) o'zi"
      - "Kanalni yopish va undan yopilgani sababli zero value olgan qabul qilish"
      - "wg.Done() va u ochgan wg.Wait() ning qaytishi"
      - "go statement va yangi goroutine bajarilishining boshlanishi"
    answer: 0
    explain: "Xotira modeli: goroutine'ning chiqishi o'zi hech qaysi hodisadan oldin sodir bo'lishi kafolatlanmaydi; natijani ko'rish uchun kanal, lock yoki WaitGroup kerak. Qolgan uchtasi modelda aniq yozilgan sinxronlash qoidalari."
  - q: "Race detector haqida qaysi gap to'g'ri?"
    options:
      - "U kodni statik tahlil qilib, barcha mumkin bo'lgan race'larni topadi"
      - "U faqat go test bilan ishlaydi, go run bilan emas"
      - "U faqat bajarilgan kod yo'llaridagi race'larni topadi, shuning uchun testlar qamrovi muhim"
      - "U race topsa dasturni to'xtatmaydi va chiqish kodi 0 bo'ladi"
    answer: 2
    explain: "Hujjat: detektor faqat run-time'da sodir bo'lgan race'larni topadi, bajarilmagan yo'llarni ko'rmaydi. -race go run, go test, go build va go install da ishlaydi; race topilsa default chiqish kodi 66 (GORACE exitcode bilan o'zgaradi)."
  - q: "Jamoa performance uchun production binary'ni ham -race bilan qurishni taklif qildi. Hujjat ma'lumotiga ko'ra bu qaror haqida nima deyish to'g'ri?"
    options:
      - "Yaxshi fikr: -race hech qanday qo'shimcha xarajat qo'shmaydi"
      - "Odatdagi dasturda xotira 5-10 baravar, bajarilish vaqti 2-20 baravar oshishi mumkin; production uchun odatda mos emas"
      - "Faqat CPU 2 baravar oshadi, xotiraga ta'sir yo'q"
      - "Faqat Windows'da sekin"
    answer: 1
    explain: "Race detector hujjati odatdagi dastur uchun xotira 5-10x va vaqt 2-20x oshishini yozadi. Shuning uchun u testlarda, CI'da va ba'zan sinov muhitida yoqiladi, production'da kamdan-kam."
task:
  title: "Parallel statistika yig'uvchisidagi data race'ni yo'qotish"
  prompt: |
    `collect` har bir tezlik o'lchovini alohida goroutine'da qayta ishlaydi va umumiy `Stats` struct'iga yozadi: o'lchovlar sonini oshiradi va maksimal tezlikni yangilaydi. Bu kod data race'ga ega: `go run -race` bir nechta WARNING: DATA RACE chiqaradi va chiqish kodi 66 bo'ladi.

    `collect` ni tuzating, shunda `-race` bilan hech qanday ogohlantirish chiqmasin, natija esa `soni: 200 maksimal tezlik: 129` bo'lsin. `Stats` va `collect` imzolarini o'zgartirmang. Goroutine sonini kamaytirmang: har o'lchov uchun alohida goroutine qolsin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sync"
    )

    // Stats telemetriya nuqtalari bo'yicha yig'ma statistika.
    type Stats struct {
        Count    int
        MaxSpeed float64
    }

    // collect har bir tezlik o'lchovini alohida goroutine'da qayta ishlaydi.
    func collect(speeds []float64) Stats {
        var st Stats
        var wg sync.WaitGroup
        for _, s := range speeds {
            wg.Add(1)
            go func() {
                defer wg.Done()
                st.Count++
                if s > st.MaxSpeed {
                    st.MaxSpeed = s
                }
            }()
        }
        wg.Wait()
        return st
    }

    func main() {
        speeds := make([]float64, 200)
        for i := range speeds {
            speeds[i] = float64(40 + i%90)
        }
        st := collect(speeds)
        fmt.Println("soni:", st.Count, "maksimal tezlik:", st.MaxSpeed)
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
    )

    // Stats telemetriya nuqtalari bo'yicha yig'ma statistika.
    type Stats struct {
        Count    int
        MaxSpeed float64
    }

    // collect har bir tezlik o'lchovini alohida goroutine'da qayta ishlaydi.
    func collect(speeds []float64) Stats {
        var (
            st Stats
            mu sync.Mutex
            wg sync.WaitGroup
        )
        for _, s := range speeds {
            wg.Add(1)
            go func() {
                defer wg.Done()
                mu.Lock()
                defer mu.Unlock()
                st.Count++
                if s > st.MaxSpeed {
                    st.MaxSpeed = s
                }
            }()
        }
        wg.Wait()
        return st
    }

    func main() {
        speeds := make([]float64, 200)
        for i := range speeds {
            speeds[i] = float64(40 + i%90)
        }
        st := collect(speeds)
        fmt.Println("soni:", st.Count, "maksimal tezlik:", st.MaxSpeed)
    }
  solutionNotes: |
    - `Count++` va `MaxSpeed` ni tekshirib-yozish yagona mutex ostida bajariladi. Tekshirish va yozish bitta kritik bo'limda bo'lishi shart: ularni ikki alohida lock bilan himoyalasangiz, "o'qi-solishtir-yoz" ketma-ketligi hali ham poygaga ochiq qoladi.
    - `wg.Wait()` dan keyin `st` ni o'qish xavfsiz: `Done` va `Wait` orasidagi sinxronlash tufayli barcha yozuvlar `Wait` qaytishidan oldin sodir bo'lgan.
    - Alternativa: har goroutine natijani kanalga yuboradi va bitta yig'uvchi goroutine `Stats`ni yangilaydi. Kod kattaroq, lekin umumiy o'zgaruvchiga faqat bitta goroutine tegadi.
    - `Count` uchun atomic ishlatish mumkin, lekin `MaxSpeed` bilan birga ikki o'zgaruvchining mosligi kerak bo'lsa, ularni bitta lock ostida saqlash oddiyroq (46-dars).
    - Tuzatishdan keyin ham `go run -race` ni bir necha marta ishga tushiring: detektor faqat sodir bo'lgan race'ni ko'radi.
  checklist:
    - "`go run -race` da `DATA RACE` ogohlantirishi yo'q va chiqish kodi 0"
    - "Natija `soni: 200 maksimal tezlik: 129`"
    - "Har o'lchov uchun alohida goroutine saqlangan"
    - "Tekshirish va yangilash bitta kritik bo'limda"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Quyidagi gap ko'p jamoalarda bir necha marta aytilgan: "bu kod bizda ikki yildan beri ishlayapti, hech qachon muammo bo'lmagan". Keyin yangi toolchain'ga o'tiladi, servis boshqa turdagi mashinaga ko'chiriladi yoki yuk oshadi va hisoblagich qiymatlari ba'zan noto'g'ri chiqa boshlaydi, ba'zan esa servis map'ga bir vaqtda yozish tufayli "fatal error" bilan o'ladi. Debug qilish deyarli mumkin emas: xato har gal takrorlanmaydi, log'da iz yo'q, mahalliy mashinada hech qachon chiqmaydi.

Bu data race. Uning xavfi shundaki, race'li kod ko'pincha "ishlaydi". Kompilyator va protsessor operatsiyalar tartibini o'zgartirishi mumkin, qiymat yadro keshida qolib ketishi mumkin, va bularning hech biri xatoga olib kelmasdan tegishli shart yig'ilmaguncha o'tadi. Xotira modeli aynan shu savolga javob beradi: bir goroutine'da yozilgan qiymat boshqasida qachon kafolatli ko'rinadi.

Node.js dasturchisi uchun bu yangi mavzu bo'lishi mumkin: JavaScript kodi bitta oqimda bajariladi, ikki callback bir vaqtda o'zgaruvchiga tegmaydi (`SharedArrayBuffer` va worker'lardan tashqari). Go'da esa goroutine'lar haqiqiy parallel ishlaydi, shu sabab sinxronlash dasturchining mas'uliyati.

## Asosiy g'oya

### Hujjat o'zi nima deydi

Go xotira modeli hujjati o'z maqsadini shunday belgilaydi: bir goroutine'da o'zgaruvchiga yozilgan qiymatni boshqa goroutine'da o'qish qaysi shartlarda kafolatlanadi. Hujjatning "Advice" bo'limi qisqa va aniq: bir vaqtda bir nechta goroutine tegadigan ma'lumotga kirish ketma-ket bo'lishi kerak va buni kanal yoki sync va sync/atomic paketlaridagi primitivlar bilan ta'minlash lozim. Shuningdek hujjat ogohlantiradi: dasturingiz xatti-harakatini tushunish uchun hujjatning qolgan qismini o'qishga majbur bo'lsangiz, siz haddan tashqari "aqlli" yozgansiz, bunday qilmang.

Shu maslahatni jiddiy oling. Quyidagi nazariya sizga ixtiyoriy sinxronlashni bo'shatish uchun emas, uni tanlash va aniqlash uchun kerak.

### Data race ta'rifi

Hujjat data race'ni shunday ta'riflaydi: xotiradagi joyga yozish shu joyga boshqa o'qish yoki yozish bilan bir vaqtda sodir bo'ladi, faqat ikkala tomon ham `sync/atomic` paketining atomic amallari bo'lsa bu race emas. Muhim nuqtalar:

- Faqat o'qish hech qachon race emas. Kamida bitta yozuv kerak.
- Atomic amallar race hisoblanmaydi. Oddiy `x++` esa atomic emas: u o'qish, qo'shish va yozishdan iborat uch bosqich.
- "Bir vaqtda" soat bilan emas, tartib bilan aniqlanadi: ikki amal orasida happens-before munosabati bo'lmasa, ular bir vaqtdagi hisoblanadi.

### DRF-SC kafolati va uning chegarasi

Hujjatdagi asosiy va'da: data race'siz dasturlar xuddi barcha goroutine'lar bitta protsessorda ketma-ket bajarilgandek ishlaydi. Bu xususiyat DRF-SC (data-race-free programs execute in a sequentially consistent manner) deb ataladi. Sizning vazifangiz dasturni race'siz yozish, qolgan hamma narsani, jumladan kompilyator optimizatsiyalarini, Go hal qiladi.

Race bo'lsa-chi? Go bu holatda C va C++ dagidek "undefined behavior" bermaydi, lekin kafolat zaif. Hujjat: implementatsiya race'ni aniqlab, dasturni to'xtatishi mumkin. Aks holda bitta mashina so'zi (yoki undan kichik) o'lchamidagi joyni o'qish haqiqatan yozilgan va hali ustidan yozilmagan qiymatni ko'rishi kerak. Ya'ni oddiy `int` yoki `bool` o'qishda "yarim yozilgan" qiymat ko'rinmaydi. Bu faqat bitta so'zli joylar uchun va'da qilingan. Ko'p so'zli qiymatlar (interface, slice, string sarlavhasi) bilan bunday kafolat yo'q, shu sabab ular bilan race'lar xotirani buzishga olib kelishi mumkin. Race detector hujjatining o'zi bir vaqtda map'ga yozishni "crash va xotira buzilishiga olib kelishi mumkin" misol sifatida keltiradi.

### Happens-before

Xotira modelining yadrosi uchta munosabat:

- **Sequenced before**: bitta goroutine ichidagi dastur tartibi. Oddiy ketma-ket bajarilish.
- **Synchronized before**: turli goroutine'lar orasidagi sinxronlash hodisalari. Masalan, kanalga yuborish tegishli qabul qilishning tugashidan oldin sodir bo'ladi.
- **Happens before**: sequenced before va synchronized before birlashmasining tranzitiv yopilishi.

O'qish `r` yozish `w` ni ko'radi, agar `w` happens-before `r` bo'lsa va ular orasida `r` dan oldin yana boshqa yozuv bo'lmasa. Happens-before bo'lmasa, o'qish bir vaqtda sodir bo'layotgan yozuvlardan istalganini ko'rishi mumkin: bu race.

## Chuqurroq: sinxronlash qoidalari va noto'g'ri idiomalar

Hujjat aniq sinxronlash qoidalarini sanaydi. Quyida amaliyotda eng ko'p kerak bo'ladiganlari, manbalar bilan:

| Mexanizm | Qoida |
|---|---|
| `go` statement | `go` ifodasi yangi goroutine bajarilishining boshlanishidan oldin sodir bo'ladi |
| Goroutine tugashi | Chiqish hech qaysi hodisadan oldin bo'lishi kafolatlanmagan; natija kerak bo'lsa kanal, lock yoki WaitGroup ishlating |
| Kanal | Yuborish tegishli qabul qilish tugashidan oldin sodir bo'ladi |
| Kanalni yopish | `close` yopilgani sababli zero value qaytargan qabul qilishdan oldin sodir bo'ladi |
| Buferlanmagan kanal | Qabul qilish tegishli yuborishning tugashidan oldin sodir bo'ladi |
| Sig'imi C kanal | `k`-qabul qilish `k+C`-yuborishning tugashidan oldin sodir bo'ladi (semafor modeli) |
| `sync.Mutex`, `sync.RWMutex` | `n`-`Unlock` `m`-`Lock` dan oldin sodir bo'ladi, `n < m` |
| `sync.Once` | `f` ning qaytishi har qanday `once.Do(f)` ning qaytishidan oldin sodir bo'ladi |
| `sync.WaitGroup` | `Done` o'zi ochgan `Wait` ning qaytishidan oldin sodir bo'ladi |
| `sync/atomic` | Atomic amal A ning ta'siri B tomonidan ko'rilsa, A B dan oldin sodir bo'ladi; barcha atomic amallar ketma-ket tartibda bajarilgandek |

Jadvaldagi mutex, Once va WaitGroup qatorlari `sync` paketi hujjatida shu so'zlar bilan yozilgan. Atomic uchun hujjat C++ ketma-ket izchil (sequentially consistent) atomic'lari va Java `volatile` bilan bir xil semantikani va'da qiladi. Go'da kuchsizroq tartiblash rejimlari yo'q (46-dars).

### Noto'g'ri sinxronlash: xotira modeli aniq ko'rsatgan tuzoqlar

Hujjatning "Incorrect synchronization" bo'limi "ishlaydigandek" ko'rinadigan idiomalarni rad etadi. Muhimlari:

- **Double-checked locking**: `if !done { once.Do(setup) }` kabi tekshiruv. `done` ni ko'rish `a` ni (setup natijasini) ko'rishni kafolatlamaydi, natijada bo'sh satr chiqishi mumkin.
- **Busy waiting**: `for !done {}` tsikli. Birinchidan, `done` yozuvi umuman ko'rinmasligi mumkin, ya'ni tsikl tugamasligi mumkin. Ikkinchidan, tugasa ham, oldingi yozuvlar (masalan, `a`) ko'rinishi kafolatlanmaydi.
- **Pointer orqali nashr etish**: `g = t` dan keyin `g != nil` ni ko'rgan goroutine `g.msg` ning boshlang'ich qiymatini ko'rishi kafolatlanmagan.
- Hujjatning o'z misoli: `f` da `a = 1; b = 2`, `g` da `print(b); print(a)`. Natija `2` va `0` bo'lishi mumkin. Ya'ni yozuvlar boshqa goroutine'ga yozilgan tartibda ko'rinishi shart emas.

Barcha holatda yechim bir xil: aniq sinxronlash. Pastdagi misol shu to'rtta idiomadan ikkitasini sinab ko'radi.

### Data race va race condition bir narsa emas

Data race xotira darajasidagi aniq ta'rifli hodisa va uni asboblar topa oladi. Race condition esa mantiq darajasidagi xato: natija hodisalar tartibiga bog'liq, hatto har bir xotira kirishi sinxronlashgan bo'lsa ham. Misol: ikkita goroutine "balansni o'qi, tekshir, yoz" ketma-ketligini har bir qadamida alohida lock olib bajaradi. Data race yo'q, lekin ikki to'lov bir vaqtda o'tib ketadi. 100 Go Mistakes kitobi bu farqni concurrency bobining alohida mavzusi qiladi. Race detector faqat birinchisini topadi; ikkinchisini loyihalash bilan oldini olasiz (kritik bo'limni to'g'ri chegaralash, tranzaksiya, idempotentlik).

## Misol: race, uni ko'rish va tuzatish

Birinchi dastur: 1000 goroutine umumiy hisoblagichni `counter++` bilan oshiradi. Bu kod data race'ga ega.

```go
package main

import (
	"fmt"
	"sync"
)

// Bu kod data race'ga ega.
func main() {
	var counter int
	var wg sync.WaitGroup
	for range 1000 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			counter++
		}()
	}
	wg.Wait()
	fmt.Println("hisoblagich:", counter)
}
```

`go run` bilan (Go 1.24.7, linux/amd64, ikki yadroli mashina) natija:

```text
hisoblagich: 1000
```

To'g'ri chiqdi, lekin bu tasodif. Xuddi shu dastur `-race` bilan boshqa gapni aytadi. Quyida hisobotning boshi keltirilgan (manzillar, goroutine raqamlari va yo'llar har ishga tushirishda farq qiladi, ularni qisqartirdik):

```text
==================
WARNING: DATA RACE
Read at 0x00c000012178 by goroutine 10:
  main.main.func1()
      .../l43a/main.go:16 +0x84

Previous write at 0x00c000012178 by goroutine 8:
  main.main.func1()
      .../l43a/main.go:16 +0x96

Goroutine 10 (running) created at:
  main.main()
      .../l43a/main.go:14 +0x78
...
Found N data race(s)
exit status 66
```

Hisobot uch narsani beradi: qaysi manzilga ikki kirish bo'lgan (o'qish va oldingi yozish), ikkala kirishning stack'i va ikkala goroutine qayerda yaratilgani. `main.go:16` ikkala kirishda bir xil qator: `counter++`. Oxirgi qator: race topilganda `go run` chiqish kodi 66 (hujjat bo'yicha `GORACE` ning `exitcode` sozlamasi default qiymati). Race'lar soni (`Found N data race(s)`) har ishga tushirishda farq qiladi.

Ikkinchi dastur busy waiting o'rniga `time.Sleep` bilan tekshiruv qiladi. Bu kod ham data race'ga ega: `ready` va `msg` uchun happens-before yo'q.

```go
package main

import (
	"fmt"
	"time"
)

// Bu kod data race'ga ega: ready va msg uchun happens-before yo'q.
func main() {
	var msg string
	ready := false

	go func() {
		msg = "GPS nuqta qabul qilindi"
		ready = true
	}()

	for !ready {
		time.Sleep(time.Millisecond)
	}
	fmt.Println(msg)
}
```

```text
GPS nuqta qabul qilindi
```

`go run` oddiy rejimda to'g'ri matn chiqardi. `-race` bilan esa detektor `ready` ga yozuv va o'qishni, hamda `msg` ni ham race sifatida belgiladi (`Found 2 data race(s)`). Uyqu bu yerda sinxronlash emas: u faqat kutish uchun vaqt beradi, ammo yozuvni ko'rish kafolatini bermaydi.

Uchinchi dastur uchta to'g'ri usulni ko'rsatadi: kanalni yopish, mutex va atomic.

```go
package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	// 1. Channel close: yozish close'dan oldin, o'qish <-done'dan keyin.
	var msg string
	done := make(chan struct{})
	go func() {
		msg = "GPS nuqta qabul qilindi"
		close(done)
	}()
	<-done
	fmt.Println(msg)

	// 2. Mutex bilan hisoblagich.
	var mu sync.Mutex
	var counter int
	var wg sync.WaitGroup
	for range 1000 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			mu.Lock()
			counter++
			mu.Unlock()
		}()
	}
	wg.Wait()
	fmt.Println("mutex:", counter)

	// 3. Atomic bilan hisoblagich.
	var n atomic.Int64
	for range 1000 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			n.Add(1)
		}()
	}
	wg.Wait()
	fmt.Println("atomic:", n.Load())
}
```

```text
GPS nuqta qabul qilindi
mutex: 1000
atomic: 1000
```

Birinchi usul xotira modelining `close` qoidasiga tayanadi: `msg` yozuvi `close(done)` dan oldin, o'qish esa `<-done` qaytgandan keyin. Shu sababli happens-before zanjiri to'liq. `-race` bilan dastur hech narsa ogohlantirmaydi va 0 kod bilan chiqadi.

Oxirgi misol: race'ni test ichida ushlash. `Collect` funksiyasi (yuqoridagi hisoblagich g'oyasi bo'yicha) umumiy `count` va `max` o'zgaruvchilarga bir nechta goroutine'dan yozadi. Bu kod data race'ga ega:

```go
package stats

import "sync"

// Collect tezliklar sonini va maksimumini parallel hisoblaydi.
// Bu kod data race'ga ega.
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

Oddiy `go test` bu paketda `ok` chiqardi, `go test -race` esa quyidagi bilan tugadi (Go 1.24.7):

```text
    testing.go:1490: race detected during execution of test
FAIL
FAIL	stats	0.014s
FAIL
```

Test o'tib ketgan, chunki natija to'g'ri chiqqan. Ammo `-race` testni muvaffaqiyatsiz deb belgilaydi. Shu sabab CI'da `go test -race ./...` majburiy qadam bo'lishi kerak (50-dars).

## Race detector bilan ishlash qoidalari

Hujjatga ko'ra:

- `-race` bayrog'i `go test`, `go run`, `go build` va `go install` da ishlaydi.
- Detektor cgo yoqilgan bo'lishini talab qiladi, Darwin'dan tashqari tizimlarda esa C kompilyatori o'rnatilgan bo'lishi kerak. Qo'llab-quvvatlanadigan platformalar ro'yxati hujjatda berilgan: linux/amd64, linux/arm64, darwin/arm64, windows/amd64 va boshqalar.
- U faqat run-time'da sodir bo'lgan race'larni topadi. Bajarilmagan kod yo'llaridagi race'ni ko'rmaydi, shuning uchun testlar qamrovi to'liq bo'lmasa, realistik yuk ostida `-race` bilan qurilgan binary'ni ishga tushirish ham foydali.
- Xarajat: odatdagi dastur uchun xotira 5-10 baravar, bajarilish vaqti 2-20 baravar oshishi mumkin.
- `GORACE` o'zgaruvchisi sozlamalarni beradi: `log_path`, `exitcode` (default 66), `halt_on_error`, `history_size` va boshqalar.

## Qachon qo'llamaslik kerak

- "Faqat bitta goroutine yozadi, qolganlari o'qiydi, shuning uchun xavfsiz" degan fikr noto'g'ri. Bitta yozuvchi va ko'p o'quvchi ham sinxronlashsiz data race. Poyga o'qish va yozish orasida.
- Faqat `bool` yoki `int` bo'lgani uchun "yirtilmaydi, demak xavfsiz" deb hisoblash xato. Qiymat yirtilmasligi bilan ko'rinish kafolatlanishi bir narsa emas (busy waiting misoli).
- `-race` ni ishlab chiqarish binary'sida doimiy qoldirmang: xarajat katta. Uni testlarda, CI'da va kerak bo'lsa canary muhitida yoqing.
- `-race` jim bo'lishi dastur to'g'ri degani emas. U faqat kuzatilgan bajarilishdagi race'larni topadi va race condition (mantiq xatolari) ni umuman ko'rmaydi.
- Hamma narsani kanal bilan yozish uchun xotira modelini bahona qilmang. Oddiy umumiy holat uchun mutex yoki atomic aniqroq (44 va 46-darslar).
- `unsafe` yoki cgo orqali xotiraga tegsangiz, modelning kafolatlari tegishli qoidalar orqali emas, sizning mas'uliyatingizda.

## Stack'da: Node.js/TypeScript bilan solishtirish

| Node.js | Go |
|---|---|
| Bir oqimli event loop: ikki callback bir vaqtda o'zgaruvchiga tegmaydi | Goroutine'lar parallel: sinxronlash dasturchi ishi |
| `SharedArrayBuffer` va `Atomics` faqat worker'lar orasida | `sync/atomic` va umumiy xotira oddiy holat |
| Race tasodifan kamdan-kam ko'rinadi (async mantiq xatolari) | Data race xotira darajasida, `-race` bilan topiladi |
| Await orasida holat o'zgarishi (mantiqiy race condition) | Xuddi shu muammo Go'da ham: lock'lar buni hal qilmaydi |

Amaliy xulosalar:

- Servisni Go'ga o'tkazganda "bitta so'rov handler'i boshqasi bilan bir vaqtda ishlamaydi" farazini yo'qoting. HTTP handler'lar parallel chaqiriladi, umumiy `map`, `slice` va struct maydonlari har bir so'rovdan ko'rinadi.
- Qoida: umumiy o'zgaruvchiga yozish bor bo'lsa, sinxronlash vositasini kod ichida ko'rsating: kim himoyalaydi, nima bilan.
- CI'da `go test -race ./...` va muhim integratsion testlarda `-race` bilan qurilgan binary.

## Xulosa

- Data race: sinxronlashsiz bir vaqtda sodir bo'ladigan va kamida bittasi yozuv bo'lgan ikki kirish (atomic amallar bundan mustasno).
- Race'siz dasturlar ketma-ket izchil (DRF-SC) ishlaydi; race'li dasturda bitta so'zlik o'qish haqiqiy yozilgan qiymatni ko'radi, ko'p so'zli qiymatlar uchun bunday kafolat yo'q.
- Happens-before zanjirini kanal, `close`, mutex, `Once`, `WaitGroup`, `go` statement va atomic'lar quradi; goroutine'ning tugashi o'zi hech narsani sinxronlamaydi.
- Busy waiting, double-checked locking va pointer orqali nashr etish sinxronlashsiz noto'g'ri; race'li kod to'g'ri natija berishi uni to'g'ri qilmaydi.
- `-race` detektori faqat bajarilgan yo'llardagi data race'larni topadi (xotira 5-10x, vaqt 2-20x qimmat), race condition'ni topmaydi; uni CI'da majburiy qiling.
