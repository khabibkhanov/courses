---
n: 45
slug: sync-primitivlar
title: "WaitGroup (WaitGroup.Go), Once, Cond va Pool"
summary: "sync paketining to'rtta primitivi: WaitGroup qoidalari va Go 1.25 dagi WaitGroup.Go hamda waitgroup vet tekshiruvi, Once va OnceValue(s) bilan xatoni keshlash, Cond bilan holat kutish, Pool'ning ishonchsiz kafolatlari."
duration: 40
sources:
  - id: pkg-sync
    note: "WaitGroup (Add, Done, Go, Wait), Once, OnceFunc/OnceValue/OnceValues, Cond va Pool hujjatlari"
  - id: go125
    note: "Standard library > sync: yangi WaitGroup.Go metodi; Vet: waitgroup analyzer"
  - id: 100go
    note: "Concurrency boblari: sync.WaitGroup noto'g'ri ishlatilishi va sync.Cond mavzulari"
quiz:
  - q: "Quyidagi kodda `wg.Add(1)` goroutine ichida chaqirilgan. Asosiy xavf nima? `go func() { wg.Add(1); defer wg.Done(); work() }()` va keyin `wg.Wait()`."
    options:
      - "Kompilyator xato beradi"
      - "Wait hisoblagich hali nol bo'lgan paytda qaytib ketishi mumkin, ya'ni goroutine'larni kutmasdan"
      - "Done manfiy hisoblagich panic'ini beradi"
      - "Hech qanday xavf yo'q, Add istalgan joyda chaqirilishi mumkin"
    answer: 1
    explain: "Hujjat: hisoblagich nol bo'lganda musbat delta bilan Add chaqiruvi Wait dan oldin sodir bo'lishi kerak. Goroutine ichidagi Add hali bajarilmagan bo'lsa, Wait hisoblagichni nol ko'rib darhol qaytadi. Dars misolida natija 0, 1 yoki 2 bo'lib o'zgardi."
  - q: "`WaitGroup.Go(f)` haqida qaysi gap to'g'ri?"
    options:
      - "Go 1.21 dan beri bor; f xatoni qaytarsa Wait uni qaytaradi"
      - "Go 1.25 dan; u panic'ni avtomatik ushlaydi"
      - "Go 1.24 dan; u goroutine'larni avtomatik cheklaydi"
      - "Go 1.25 dan; u f ni yangi goroutine'da ishga tushiradi va vazifani hisoblagichga qo'shadi; f panic qilmasligi kerak"
    answer: 3
    explain: "Go 1.25 release notes WaitGroup.Go ni yangi metod deb yozadi. Hujjat: Go f ni yangi goroutine'da chaqiradi va vazifani qo'shadi, f panic qilmasligi kerak. Xato qaytarish yoki parallellik limiti yo'q: buning uchun errgroup (48-dars)."
  - q: "Nima uchun `sync.Cond.Wait` ni `if` emas, `for !condition() { c.Wait() }` tsiklida chaqirish kerak?"
    options:
      - "Wait qaytganda shart hali bajarilmagan bo'lishi mumkin, chunki c.L Wait ichida qulflanmagan edi va boshqa goroutine holatni o'zgartirgan bo'lishi mumkin"
      - "Kompilyator tsiklsiz Wait'ni rad etadi"
      - "Wait faqat tsikl ichida Broadcast'ni kuta oladi"
      - "if bilan Wait qulfni qaytarmaydi"
    answer: 0
    explain: "Hujjat: Wait ishlayotgan paytda c.L qulflanmagan, shuning uchun qaytganda shart to'g'ri deb faraz qilib bo'lmaydi; shartni tsiklda qayta tekshiring. Qulf Wait qaytishidan oldin qayta olinadi, shuning uchun if bilan ham qulf qaytadi."
  - q: "`get := sync.OnceValues(loadConfig)` ning birinchi chaqiruvi xato qaytardi. Ikkinchi `get()` chaqiruvi nima qiladi?"
    options:
      - "loadConfig ni qayta ishga tushiradi"
      - "Panic qiladi"
      - "Birinchi natijani, ya'ni o'sha xatoni qaytaradi; loadConfig qayta chaqirilmaydi"
      - "Faqat zero value qaytaradi va xatoni yutadi"
    answer: 2
    explain: "OnceValues funksiyani bir marta chaqiradi va ikkala natijani (qiymat va xato) eslab qoladi. Dars misolida uch chaqiruvda ham bir xil xato chiqdi, loadConfig 1 marta chaqirildi. Xato bo'lganda qayta urinish kerak bo'lsa, o'z mutex mantiqingiz kerak."
  - q: "sync.Pool haqida qaysi xulosa hujjatga mos?"
    options:
      - "Pool'ga Put qilingan obyekt albatta saqlanadi va keyingi Get uni qaytaradi"
      - "Pool'dagi har qanday obyekt istalgan paytda ogohlantirishsiz olib tashlanishi mumkin, shuning uchun u faqat vaqtinchalik obyektlar keshi"
      - "Pool qiymatlarni GC dan himoyalaydi"
      - "Pool qisqa umrli obyektning ichki free list'i uchun eng yaxshi tanlov"
    answer: 1
    explain: "Hujjat: Pool dagi obyekt istalgan paytda avtomatik olib tashlanishi mumkin. Pool yuklama ostida o'sadigan va tinchlanganda qisqaradigan umumiy bufer to'plami uchun mos (fmt misoli); qisqa umrli obyektning ichidagi free list uchun mos emas."
  - q: "Go 1.25 da `go vet` ga qaysi yangi tekshiruv qo'shildi va u nimani ushlaydi?"
    options:
      - "copylocks: WaitGroup'ni nusxalashni"
      - "lostcancel: bekor qilinmagan kontekstni"
      - "waitgroup: sync.WaitGroup.Add ning noto'g'ri joyda chaqirilishini"
      - "loopclosure: tsikl o'zgaruvchisini closure'da ushlashni"
    answer: 2
    explain: "Go 1.25 release notes: go vet ga waitgroup analyzer qo'shildi, u sync.WaitGroup.Add ning o'rinsiz chaqiruvlarini bildiradi. Biz sandbox'dagi Go 1.24.7 bilan bu tekshiruvni sinay olmadik: dars misolidagi goroutine ichidagi Add 1.24 vet'dan jim o'tdi."
task:
  title: "WaitGroup.Add ni to'g'ri joyga ko'chirish"
  prompt: |
    `countValid` tezliklar ro'yxatidagi yaroqli o'lchovlarni (0 dan 200 gacha) parallel sanaydi. Har bir o'lchov uchun alohida goroutine ishga tushadi, `WaitGroup` ularni kutadi.

    Muammo: `wg.Add(1)` goroutine ichida chaqirilgan. `wg.Wait()` hisoblagich hali nol bo'lgan paytda qaytishi mumkin, natijada `countValid` goroutine'lar tugamasdan javob qaytaradi, va `main` kutilgan `6` o'rniga kam son oladi (ba'zan 0). Bundan tashqari, `-race` ostida bu kod ba'zan data race ogohlantirishini ham beradi.

    `countValid` ni tuzating: Add chaqiruvini to'g'ri joyga qo'ying. Imzoni o'zgartirmang. Go 1.25+ da `wg.Go` ishlatish mumkin edi, lekin bu topshiriq Go 1.24 bilan tekshiriladi, shuning uchun `Add`/`Done` bilan yozing.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
        "sync"
    )

    // validate GPS nuqtasi tezligi mantiqiy oraliqda ekanini tekshiradi.
    func validate(speed float64) bool {
        return speed >= 0 && speed <= 200
    }

    // countValid tezliklarning nechtasi yaroqli ekanini parallel sanaydi.
    func countValid(speeds []float64) int {
        var (
            wg    sync.WaitGroup
            mu    sync.Mutex
            valid int
        )
        for _, s := range speeds {
            go func() {
                wg.Add(1)
                defer wg.Done()
                if validate(s) {
                    mu.Lock()
                    valid++
                    mu.Unlock()
                }
            }()
        }
        wg.Wait()

        mu.Lock()
        defer mu.Unlock()
        return valid
    }

    func main() {
        speeds := []float64{60, 85.5, -3, 120, 250, 0, 199.9, 40}
        got := countValid(speeds)
        fmt.Println("yaroqli:", got, "kutilgan: 6")
        if got != 6 {
            os.Exit(1)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "os"
        "sync"
    )

    // validate GPS nuqtasi tezligi mantiqiy oraliqda ekanini tekshiradi.
    func validate(speed float64) bool {
        return speed >= 0 && speed <= 200
    }

    // countValid tezliklarning nechtasi yaroqli ekanini parallel sanaydi.
    func countValid(speeds []float64) int {
        var (
            wg    sync.WaitGroup
            mu    sync.Mutex
            valid int
        )
        for _, s := range speeds {
            wg.Add(1)
            go func() {
                defer wg.Done()
                if validate(s) {
                    mu.Lock()
                    valid++
                    mu.Unlock()
                }
            }()
        }
        wg.Wait()

        mu.Lock()
        defer mu.Unlock()
        return valid
    }

    func main() {
        speeds := []float64{60, 85.5, -3, 120, 250, 0, 199.9, 40}
        got := countValid(speeds)
        fmt.Println("yaroqli:", got, "kutilgan: 6")
        if got != 6 {
            os.Exit(1)
        }
    }
  solutionNotes: |
    - `wg.Add(1)` `go` statement'dan oldin, chaqiruvchi goroutine'da bajariladi. Shunda `Wait` chaqirilganda hisoblagich hamma ishga tushirilgan goroutine'lar sonini allaqachon ko'rsatadi.
    - `defer wg.Done()` goroutine ichida qoladi: panic bo'lmagan oddiy chiqishda ham, erta `return` da ham hisoblagich kamayadi.
    - Natijani o'qishdagi `mu.Lock()` ham kerak: `Wait` qaytganidan keyin barcha yozuvlar ko'rinadi (Done synchronizes-before Wait), lekin lock `go vet` va o'quvchi uchun himoya qoidasini aniq qiladi. Faqat WaitGroup'ga tayanib lock'ni olib tashlash ham to'g'ri bo'lardi.
    - Go 1.25+ da shu tsikl `wg.Go(func() { ... })` bilan yoziladi va `Add`/`Done` juftligi yo'qoladi. Bu variant lokal kompilyatsiya qilinmagan.
    - Ko'p ishga tushirishda boshlang'ich kod har gal boshqacha son beradi; tuzatilgan kod har gal `yaroqli: 6`.
  checklist:
    - "`wg.Add(1)` `go` statement'dan oldin, tsikl tanasida chaqiriladi"
    - "Natija har gal `yaroqli: 6 kutilgan: 6`"
    - "`go run -race` ogohlantirishsiz o'tadi"
    - "`Done` `defer` bilan chaqiriladi"
    - "Funksiya imzosi o'zgarmagan"
---

## Muammo

`sync` paketining primitivlari kichik, lekin ularni noto'g'ri ishlatishning oqibatlari katta. Misollar:

- Servis ishga tushganda `WaitGroup` bilan hamma worker'larni kutadi. Bitta kod yo'lida `Add` goroutine ichida chaqirilgan. Ba'zan `Wait` erta qaytadi va servis ishlarni tugatmay chiqib ketadi. Test hech qachon buni ko'rmaydi: sekin CI mashinasida yoki yuk ostida faqat ba'zi ishga tushirishlarda chiqadi.
- Konfiguratsiyani birinchi so'rovda yuklaydigan `Once` birinchi urinishda xato oladi va keyingi barcha so'rovlar o'sha xatoni qaytaradi, servis qayta ishga tushirilmaguncha.
- Kod `sync.Pool` dagi buferni qaytarishdan oldin tozalamaydi va keyingi so'rov oldingi so'rovning ma'lumotini ko'radi.
- Kutish uchun `sync.Cond` ishlatiladi, lekin shart `if` bilan tekshiriladi: `Wait` uyg'otilgandan qaytguncha boshqa goroutine holatni o'zgartirib ulgurgan bo'lishi mumkin, kod esa shart hali to'g'ri deb noto'g'ri holatda davom etadi (Go'da `Cond.Wait` hujjatga ko'ra `Signal` yoki `Broadcast`siz qaytmaydi, ya'ni "spurious wakeup" yo'q).

Bu darsda to'rtala primitivni hujjat qoidalariga ko'ra, Go 1.25 dagi yangiliklar bilan (WaitGroup.Go va go vet ga qo'shilgan tekshiruv) ko'rib chiqamiz. Har biri uchun "qachon kerak emas" savoliga ham javob beramiz: sync primitivlarining ko'pi kanal yoki errgroup (48-dars) bilan yaxshiroq ifodalanadi.

## Asosiy g'oya

### WaitGroup: vazifalarni sanash

`sync.WaitGroup` vazifalar hisoblagichi. Hujjatga ko'ra u "bir guruh goroutine yoki vazifalar tugashini kutish" uchun semafor-hisoblagich. Qoidalar:

- `Add(delta)` hisoblagichga delta qo'shadi, `Done()` bir ayiradi (`Add(-1)` bilan teng), `Wait()` hisoblagich nolga tushguncha bloklaydi.
- Hisoblagich manfiy bo'lsa `Add` panic qiladi (`sync: negative WaitGroup counter`). Ortiqcha `Done` shunday topiladi.
- Hisoblagich nol bo'lgan paytda musbat delta bilan `Add` chaqiruvi `Wait` dan oldin sodir bo'lishi kerak. Amalda: `Add` ni `go` statement'dan oldin, chaqiruvchida chaqiring.
- `WaitGroup` bir nechta mustaqil guruhni kutish uchun qayta ishlatilsa, yangi `Add` chaqiruvlari oldingi barcha `Wait` qaytgandan keyin bo'lishi shart.
- Birinchi ishlatilgandan keyin nusxalanmaydi.
- Xotira modeli: `Done` o'zi ochgan `Wait` ning qaytishidan oldin sodir bo'ladi, shuning uchun goroutine'lar yozgan natijalar `Wait` dan keyin ko'rinadi (43-dars).

`WaitGroup` faqat sanaydi. U xatolarni yig'maydi, bekor qilishni bilmaydi va goroutine sonini cheklamaydi. Bular kerak bo'lsa `errgroup` (48-dars).

## Chuqurroq: WaitGroup.Go, Once, Cond va Pool

### WaitGroup.Go (Go 1.25)

Go 1.25 release notes `sync` bo'limida yangi `WaitGroup.Go` metodini e'lon qiladi: goroutine yaratish va hisoblash umumiy sxemasini qulaylashtiradi. Hujjat (`pkg.go.dev/sync`) uni shunday ta'riflaydi: `Go` funksiya `f` ni yangi goroutine'da chaqiradi va vazifani guruhga qo'shadi; `f` qaytganda vazifa guruhdan olib tashlanadi. Shartlar:

- `f` panic qilmasligi kerak.
- Guruh bo'sh bo'lsa, `Go` chaqiruvi `Wait` dan oldin sodir bo'lishi kerak. Guruh bo'sh bo'lmasa, `Go` istalgan vaqtda chaqirilishi mumkin: ya'ni `Go` orqali ishga tushgan goroutine o'zi ham `Go` chaqira oladi.
- Hujjatda `Add` va `Done` uchun "afzalroq `WaitGroup.Go`" degan tavsiya yozilgan: eski juftlik "Go'dan oldingi kodda keng tarqalgan" deb qayd etilgan.

`WaitGroup.Go` ning asosiy foydasi: `Add` ni noto'g'ri joyga qo'yish yoki `Done` ni unutish imkoniyatini yo'qotadi. Yana, Go 1.25 `go vet` ga yangi `waitgroup` analyzer qo'shdi: u `sync.WaitGroup.Add` ning noto'g'ri joylashgan chaqiruvlarini (masalan, goroutine ichida) xabar qiladi.

Lokal sharoit haqida: sandbox'da Go 1.24.7 bor. Go 1.24.7 da `wg.Go` mavjud emas: `go vet` `wg.Go undefined (type "sync".WaitGroup has no field or method Go)` xatosini berdi. Ya'ni quyidagi kod faqat Go 1.25 va yangi toolchain bilan kompilyatsiya bo'ladi va biz uni lokal ishga tushira olmadik. Mantiqiy ekvivalentini (`Add`/`Done` bilan) 1.24 da `-race` bilan tekshirdik va u `yaroqli: 3` chiqardi; ikkala variantning semantikasi hujjatga ko'ra bir xil.

```go
package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var wg sync.WaitGroup
	var valid atomic.Int32
	speeds := []float64{60, 85.5, -3, 120, 250}
	for _, s := range speeds {
		wg.Go(func() {
			if s >= 0 && s <= 200 {
				valid.Add(1)
			}
		})
	}
	wg.Wait()
	fmt.Println("yaroqli:", valid.Load())
}
```

### Once: bir martalik amal

`sync.Once.Do(f)` hujjatga ko'ra `f` ni faqat shu `Once` nusxasi uchun birinchi chaqiruvdagina bajaradi; keyingi chaqiruvlar boshqa `f` bilan bo'lsa ham chaqirilmaydi. Xotira modeli: `f` ning qaytishi har qanday `once.Do(f)` ning qaytishidan oldin sodir bo'ladi. Ya'ni parallel chaqiruvchilar `Do` dan qaytganda `f` ning natijasini ko'radi.

Go 1.21 dan `OnceFunc`, `OnceValue` va `OnceValues` bor: ular funksiyani o'rab, birinchi chaqiruvda bajaradi va natijani eslab qoladi. `OnceFunc` haqida hujjat: `f` panic qilsa, qaytarilgan funksiya har chaqiruvda xuddi shu qiymat bilan panic qiladi.

Ikkita tuzoq:

- **Xato keshlanadi.** `OnceValues(loadConfig)` birinchi natijani, shu jumladan xatoni, abadiy eslab qoladi. Vaqtinchalik xato (tarmoq) doimiy xatoga aylanadi. Qayta urinish kerak bo'lsa, mutex va "muvaffaqiyatli bo'ldimi" bayrog'i bilan o'zingiz yozasiz.
- **Ichma-ich `Do`.** Shu `Once` ning `Do` metodini `f` ichidan chaqirish deadlock. Biz buni 1.24.7 da sinadik: dastur `fatal error: all goroutines are asleep - deadlock!` bilan tugadi.

### Cond: holat o'zgarishini kutish

`sync.Cond` shart o'zgarishini kutish uchun "uchrashuv nuqtasi". Unga `Locker` (odatda `*Mutex`) bog'lanadi. Qoidalar hujjatdan:

- Shartni o'zgartirganda va `Wait` ni chaqirganda `c.L` qulflangan bo'lishi kerak.
- `Wait` atomik ravishda `c.L` ni ochadi va goroutine'ni to'xtatadi; uyg'ongach qaytishdan oldin `c.L` ni qayta qulflaydi.
- `Wait` faqat `Signal` yoki `Broadcast` bilan uyg'onadi, lekin qaytganda shart bajarilganiga ishonib bo'lmaydi: `Wait` ni tsiklda chaqiring (`for !condition() { c.Wait() }`).
- `Signal` bitta kutuvchini, `Broadcast` barchasini uyg'otadi.
- Xotira modeli: `Broadcast` yoki `Signal` u uyg'otgan `Wait` dan oldin sodir bo'ladi.

Hujjat o'zi ham eslatadi: ko'p oddiy holatlarda kanal yaxshiroq. `Broadcast` kanalni yopishga, `Signal` esa kanalga yuborishga mos keladi. `Cond` ayniqsa bir xil shartga bog'liq ko'p kutuvchi bo'lib, shart murakkab holatga bog'liq bo'lganda (masalan, chegaralangan navbat: "to'la emas" va "bo'sh emas") qulay.

### Pool: vaqtinchalik obyektlar to'plami

`sync.Pool` hujjatga ko'ra vaqtinchalik obyektlar to'plami: ularni alohida saqlab, qayta olish mumkin. Eng muhim jumla: Pool dagi har qanday element istalgan paytda ogohlantirishsiz olib tashlanishi mumkin; Pool elementga yagona havola bo'lsa, u GC tomonidan bo'shatilishi mumkin. Shu sabab Pool "keshlangan qiymatlar ombori" emas, GC bosimini kamaytirish vositasi.

Hujjat qo'llanish chegarasini aytadi:

- Mos: bir-biriga bog'liq bo'lmagan ko'p mijoz o'rtasida jimgina bo'lishiladigan vaqtinchalik elementlar. Hujjat misoli: `fmt` paketi chiqish buferlari to'plamini yuritadi; yuk ostida o'sadi, tinchlanganda qisqaradi.
- Mos emas: qisqa umrli obyekt ichidagi free list. Bunday holatda xarajat o'zini oqlamaydi va obyektning o'z free list'i samaraliroq.

`New` maydoni Pool bo'sh bo'lganda yangi element yaratadi. `Put(x)` xotira modeli bo'yicha shu `x` ni qaytargan `Get` dan oldin sodir bo'ladi. Pool ham birinchi ishlatilgandan keyin nusxalanmaydi.

Amaliy qoidalar (hujjatdan keyingi mantiqiy xulosa): Pool'dan olingan obyektni ishlatishdan oldin holatini tozalang (`Reset`), qaytarishdan keyin unga tegmang va Pool'ning ichida yo'q bo'lib qolishiga tayyor turing. Pool ichiga sig'imi katta o'sgan obyektlarni qaytarish xotirani ushlab turadi: juda katta buferlarni Pool'ga qaytarmaslik mantiqli.

## Misol: to'rtala primitiv amalda

Birinchi dastur WaitGroup'ning klassik xatosi. Bu kod noto'g'ri: `wg.Add` goroutine ichida.

```go run
package main

import (
	"fmt"
	"sync"
)

// Bu kod noto'g'ri: wg.Add goroutine ichida chaqirilgan.
func main() {
	var wg sync.WaitGroup
	var mu sync.Mutex
	done := 0

	for range 5 {
		go func() {
			wg.Add(1) // Wait'dan keyin bajarilishi mumkin
			defer wg.Done()
			mu.Lock()
			done++
			mu.Unlock()
		}()
	}
	wg.Wait()

	mu.Lock()
	fmt.Println("tugagan goroutine'lar:", done)
	mu.Unlock()
}
```

Natija har ishga tushirishda farq qiladi. Biz Go 1.24.7 da `0` va `2` ni ko'rdik; tekshiruv uchun qayta ishga tushirganda 20 ta ishga tushirishning 19 tasida `0`, bittasida `1` chiqdi:

```text
tugagan goroutine'lar: 0
```

Besh goroutine ishga tushgan, lekin `Wait` hisoblagich hali nolligi sababli darhol qaytdi. Go 1.24.7 `go vet` bu kodni ogohlantirmadi, Go 1.25 `waitgroup` analyzer'i ushlashi kerak (release notes bo'yicha), lekin biz buni lokal tekshira olmadik. Ortiqcha `Done` esa aniq panic beradi:

```go
package main

import "sync"

func main() {
	var wg sync.WaitGroup
	wg.Add(1)
	wg.Done()
	wg.Done() // hisoblagich manfiy bo'ladi
}
```

```text
panic: sync: negative WaitGroup counter
```

Ikkinchi dastur `OnceValues` ning xato keshlashi va `Cond` bilan chegaralangan navbatni ko'rsatadi. Navbat sig'imi 2, ishlab chiqaruvchi 10 ta qiymat yuboradi, iste'molchi o'qiydi. `Put` to'la navbatda `notFull` ni, `Get` bo'sh navbatda `notEmpty` ni kutadi, ikkalasi ham `for` tsiklida.

```go run
package main

import (
	"errors"
	"fmt"
	"sync"
)

var attempts int

func loadConfig() (string, error) {
	attempts++
	if attempts == 1 {
		return "", errors.New("konfiguratsiya serveri javob bermadi")
	}
	return "poll=5s", nil
}

type Queue struct {
	mu       sync.Mutex
	notEmpty *sync.Cond
	notFull  *sync.Cond
	items    []int
	cap      int
}

func NewQueue(n int) *Queue {
	q := &Queue{cap: n}
	q.notEmpty = sync.NewCond(&q.mu)
	q.notFull = sync.NewCond(&q.mu)
	return q
}

func (q *Queue) Put(v int) {
	q.mu.Lock()
	defer q.mu.Unlock()
	for len(q.items) == q.cap {
		q.notFull.Wait()
	}
	q.items = append(q.items, v)
	q.notEmpty.Signal()
}

func (q *Queue) Get() int {
	q.mu.Lock()
	defer q.mu.Unlock()
	for len(q.items) == 0 {
		q.notEmpty.Wait()
	}
	v := q.items[0]
	q.items = q.items[1:]
	q.notFull.Signal()
	return v
}

func main() {
	// OnceValues xatoni ham keshlaydi.
	get := sync.OnceValues(loadConfig)
	for range 3 {
		v, err := get()
		fmt.Printf("qiymat=%q xato=%v\n", v, err)
	}
	fmt.Println("loadConfig chaqirilgan:", attempts, "marta")

	// Cond bilan chegaralangan navbat.
	q := NewQueue(2)
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		defer wg.Done()
		for i := 1; i <= 10; i++ {
			q.Put(i)
		}
	}()
	sum := 0
	for range 10 {
		sum += q.Get()
	}
	wg.Wait()
	fmt.Println("yig'indi:", sum)
}
```

```text
qiymat="" xato=konfiguratsiya serveri javob bermadi
qiymat="" xato=konfiguratsiya serveri javob bermadi
qiymat="" xato=konfiguratsiya serveri javob bermadi
loadConfig chaqirilgan: 1 marta
yig'indi: 55
```

`loadConfig` bir marta chaqirildi va uchala `get()` bir xil xatoni berdi: bu `OnceValues` ning aniq xatti-harakati. Yig'indi 1 dan 10 gacha sonlar yig'indisi 55 va u deterministik, chunki navbat tartibni saqlaydi.

Uchinchi dastur Pool ning ta'sirini `testing.AllocsPerRun` bilan o'lchaydi. Bir xil buferga yozishni Pool bilan va Pool'siz solishtiramiz:

```go
package main

import (
	"bytes"
	"fmt"
	"sync"
	"testing"
)

var pool = sync.Pool{
	New: func() any { return new(bytes.Buffer) },
}

func encodeWithPool(id string, lat, lon float64) int {
	buf := pool.Get().(*bytes.Buffer)
	buf.Reset() // oldingi egasining ma'lumoti qolgan bo'lishi mumkin
	defer pool.Put(buf)
	fmt.Fprintf(buf, "%s,%.5f,%.5f\n", id, lat, lon)
	return buf.Len()
}

func encodeNoPool(id string, lat, lon float64) int {
	buf := new(bytes.Buffer)
	fmt.Fprintf(buf, "%s,%.5f,%.5f\n", id, lat, lon)
	return buf.Len()
}

func main() {
	fmt.Println("pool bilan:", testing.AllocsPerRun(1000, func() { encodeWithPool("truck-01", 41.31, 69.27) }))
	fmt.Println("pool'siz:", testing.AllocsPerRun(1000, func() { encodeNoPool("truck-01", 41.31, 69.27) }))
}
```

```text
pool bilan: 3
pool'siz: 5
```

Natija: Go 1.24.7, linux/amd64, `-race`siz ishga tushirilgan. Pool ikkita allokatsiyani tejadi. Ehtimol bular yangi `bytes.Buffer` obyekti va uning ichki massivi, lekin buni alohida tekshirmadik. Qolgan allokatsiyalar Pool'ga bog'liq emas va ularning manbasini ham tekshirmadik. Raqamlar Go versiyasi va arxitekturaga bog'liq; aniq xarajatni o'z yukingizda benchmark bilan o'lchang (65-dars). `-race` bilan bu o'lchovni olishga urinmadik: Pool'ning poyga rejimidagi xatti-harakati hujjatda yozilmagan.

## Qachon qo'llamaslik kerak

- `WaitGroup` kerakli joyda xato yoki bekor qilish kerak bo'lsa, `errgroup` (48-dars) ishlating. `WaitGroup` + o'zgaruvchiga yozish + mutex birikmasi `errgroup` ni qo'lda qayta yozishdir.
- `WaitGroup.Go` ni Go 1.25 dan eski toolchain'da ishlatib bo'lmaydi. Kutubxona yozayotgan bo'lsangiz, `go.mod` dagi `go` qatori va qo'llab-quvvatlanadigan versiyalarni hisobga oling (2-dars). `WaitGroup.Go` ichidagi `f` panic qilmasligi shart.
- Xato bo'lishi mumkin bo'lgan initsializatsiyada `Once` / `OnceValues` ni ehtiyotkorlik bilan ishlating: xato abadiy keshlanadi.
- `Cond` ni kanal bilan oson ifodalab bo'ladigan holatda ishlatmang. Ko'p yangi kod `Cond` ga umuman muhtoj emas.
- `Pool` ni xotirani tejash uchun avtomatik ishlatmang: dastlab o'lchang, so'ng qo'shing (65-dars). Katta obyektlarni Pool ichida ushlab turish xotira sarfini oshiradi. Holati toza bo'lmagan obyektni qaytarish ma'lumot oqishiga olib keladi.
- Global `Once` bilan initsializatsiya qilingan singleton'lar testlarni qiyinlashtiradi: holat testlar orasida qoladi. Bog'liqlikni konstruktor orqali bering.

## Stack'da: Node.js/TypeScript bilan solishtirish

| Node.js | Go |
|---|---|
| `Promise.all(tasks)` natijalar va birinchi xatoni qaytaradi | `WaitGroup` faqat sanaydi; natija va xato uchun kanal yoki `errgroup` |
| Modul darajasidagi `const x = load()` bir marta bajariladi | `sync.Once` / `OnceValue` kerak (parallel chaqiruvlar uchun) |
| `x ??= await init()` lazy initsializatsiya (bitta oqim, race yo'q) | Go'da parallel chaqiruvlar: `Once` yoki lock shart |
| Maxsus buffer pool kamdan-kam yoziladi | `sync.Pool` standart kutubxonada (`fmt` ishlatadi) |
| `EventEmitter.once` | Boshqa tushuncha: `sync.Once` hodisa emas, bir martalik bajarish |

Asosiy farq: Node.js'da lazy initsializatsiya oddiy `if (!x) x = ...` bilan ishlaydi, chunki ikki callback bir vaqtda bajarilmaydi (`await` chegarasi tashqari). Go'da bu kod data race (43-dars). `Once` yoki `OnceValue` shu muammoning standart yechimi.

## Xulosa

- `WaitGroup.Add` `go` statement'dan oldin chaqiriladi; manfiy hisoblagich panic, goroutine ichidagi `Add` esa `Wait` ni erta qaytaradi.
- `WaitGroup.Go` Go 1.25 dan; u `Add`/`Done` juftligini bitta chaqiruvga o'rab xatoni oldini oladi, `f` panic qilmasligi kerak; Go 1.25 `go vet` da `waitgroup` analyzer'i joylashuv xatolarini ushlaydi.
- `Once` / `OnceValue(s)` funksiyani bir marta bajaradi va natijani, shu jumladan xatoni, eslab qoladi; ichma-ich `Do` deadlock.
- `Cond.Wait` ni tsiklda chaqiring, chunki qaytganda shart bajarilganiga kafolat yo'q; oddiy holatlarda kanal yaxshiroq.
- `Pool` elementlari istalgan paytda yo'qolishi mumkin: uni GC bosimini kamaytirish vositasi sifatida, obyektni qayta ishlatishdan oldin tozalab, o'lchov bilan asoslab ishlating.
