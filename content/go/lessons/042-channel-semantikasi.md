---
n: 42
slug: channel-semantikasi
title: "Channel: buferli/buferlanmagan, close, nil channel va select"
summary: "Channel operatsiyalarining aniq semantikasi: buferli va buferlanmagan kanal, nil va yopiq kanal ustidagi amallar, close qoidalari, select tanlovi va nil kanal bilan shoxni o'chirish usuli."
duration: 40
sources:
  - id: go-spec
    note: "Send statements, Receive operator, Select statements, For statements (range over channel), Channel types va Making slices, maps and channels bo'limlari"
  - id: gopl
    note: "8-bob (Goroutines and Channels): umumiy tushunchalar"
  - id: 100go
    note: "Concurrency boblari: #57 (kanal yoki mutex), #65 (Not using notification channels), #66 (Not using nil channels), #67 (Being puzzled about channel size)"
  - id: go-mem
    note: "Channel communication bo'limi: yuborish, yopish va qabul qilish orasidagi happens-before qoidalari"
quiz:
  - q: "Quyidagi kod nima chiqaradi? `ch := make(chan int, 2); ch <- 1; ch <- 2; close(ch); fmt.Println(<-ch, <-ch, <-ch)`"
    options:
      - "Panic: yopiq kanaldan o'qib bo'lmaydi"
      - "1 2 0"
      - "1 2 va uchinchi o'qishda abadiy blok"
      - "0 0 0, chunki close buferni tozalaydi"
    answer: 1
    explain: "Yopiq kanalda buferdagi qiymatlar avval to'liq o'qiladi, buferdan keyin qabul qilish darhol element tipining zero value'sini qaytaradi. Spetsifikatsiya shunday yozadi: yopiq va bo'sh kanalda qabul qilish har doim davom eta oladi."
  - q: "Quyidagi amallardan qaysi biri panic qilmaydi?"
    options:
      - "Yopilgan kanalga qiymat yuborish"
      - "nil kanalni close qilish"
      - "Allaqachon yopilgan kanalni yana close qilish"
      - "Yopilgan va bo'shagan kanaldan qabul qilish"
    answer: 3
    explain: "Yopiq kanaldan qabul qilish xavfsiz: zero value va ok=false. Qolgan uchtasi run-time panic: send on closed channel, close of nil channel, close of closed channel. Bu xabarlarni dars misolida ko'rsatdik."
  - q: "select ichida ikkala kanalda ham qiymat tayyor. Qaysi shox bajariladi?"
    options:
      - "Tayyor shoxlar orasidan bir xil ehtimol bilan psevdo-tasodifiy tanlanadi"
      - "Manba kodda birinchi yozilgani"
      - "Oxirgi yozilgani"
      - "Qaysi kanal oldin yaratilgan bo'lsa, o'sha"
    answer: 0
    explain: "Spetsifikatsiya: bir nechta aloqa davom eta olsa, bittasi bir tekis psevdo-tasodifiy tanlanadi. Tartibga tayanadigan kod noto'g'ri. Tartib kerak bo'lsa, ustuvor kanalni alohida select'da avval tekshiring."
  - q: "select tsiklida `a = nil` qilib qo'yilsa nima o'zgaradi?"
    options:
      - "select panic qiladi, chunki nil kanal yaroqsiz"
      - "Shu shox default sifatida ishlaydi"
      - "a ga yuborish yoki undan qabul qilish hech qachon davom eta olmaydi, shuning uchun select bu shoxni tanlamaydi"
      - "select butun tsiklni to'xtatadi"
    answer: 2
    explain: "nil kanalda aloqa hech qachon tayyor bo'lmaydi, shu sabab shox amalda o'chadi. Bu usul yopilgan kanalni qayta-qayta o'qib CPU yeyishning oldini oladi. Panic emas, default ham emas."
  - q: "Yozuvchi goroutine `a = \"hello\"` deb yozib, keyin `<-c` bajaradi. Asosiy goroutine `c <- 0` qiladi va keyin a ni o'qiydi. Kanal qaysi holatda a ning ko'rinishini kafolatlaydi?"
    options:
      - "Kanal buferlanmagan bo'lsa ham, buferi 1 bo'lsa ham"
      - "Faqat kanal buferlanmagan bo'lsa"
      - "Hech qachon, kanal sinxronlashtirmaydi"
      - "Faqat buferi 1 bo'lsa"
    answer: 1
    explain: "Xotira modeli: buferlanmagan kanalda qabul qilish tegishli yuborishning tugashidan oldin sodir bo'ladi. Buferi 1 bo'lsa bu kafolat yo'q: yuborish qabul qilinishini kutmasdan tugaydi va o'qish eski qiymatni ko'rishi mumkin."
  - q: "Uchta producer goroutine bitta kanalga yozadi, bitta consumer `range` bilan o'qiydi. Kanalni kim yopishi kerak?"
    options:
      - "Har bir producer o'zi tugaganda"
      - "Consumer, hammasini o'qib bo'lgach"
      - "Alohida goroutine: u WaitGroup orqali barcha producer'lar tugashini kutib, keyin close qiladi"
      - "Birinchi tugagan producer"
    answer: 2
    explain: "Kanalni yuboruvchi tomon yopadi va faqat bir marta. Bir nechta producer bo'lsa ularning birortasi yopsa, qolganlari yopiq kanalga yuborib panic qiladi. Shu sabab tugashni kutib yopuvchi alohida goroutine qo'yiladi."
task:
  title: "Ikki kanalni qiymat yo'qotmasdan birlashtirish"
  prompt: |
    `merge(a, b)` ikki kanaldagi barcha qiymatlarni bitta kanalga uzatishi va ikkalasi ham yopilgandan keyingina natija kanalini yopishi kerak.

    Muammo: hozirgi `merge` birinchi yopilgan kanalni ko'rishi bilan `return` qiladi, natijada ikkinchi kanaldagi qolgan qiymatlar yo'qoladi va ikkinchi producer yuborishda qotib qoladi (bu ham leak). `main` 8 ta qiymat va 75 yig'indi kutadi, aks holda 1 kod bilan chiqadi.

    `merge` ni nil kanal usuli bilan qayta yozing: yopilgan kanalni `nil` ga tenglab, qolgan kanalni oxirigacha o'qing. Imzo va `gen` o'zgarmasin.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
    )

    func gen(vals ...int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for _, v := range vals {
                out <- v
            }
        }()
        return out
    }

    // merge ikki kanaldagi barcha qiymatlarni bitta kanalga uzatadi.
    func merge(a, b <-chan int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for {
                select {
                case v, ok := <-a:
                    if !ok {
                        return
                    }
                    out <- v
                case v, ok := <-b:
                    if !ok {
                        return
                    }
                    out <- v
                }
            }
        }()
        return out
    }

    func main() {
        count, sum := 0, 0
        for v := range merge(gen(1, 2, 3, 4, 5), gen(10, 20, 30)) {
            count++
            sum += v
        }
        fmt.Println("soni:", count, "yig'indi:", sum)
        if count != 8 || sum != 75 {
            fmt.Println("XATO: qiymatlar yo'qolgan (kutilgan: 8 va 75)")
            os.Exit(1)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "os"
    )

    func gen(vals ...int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for _, v := range vals {
                out <- v
            }
        }()
        return out
    }

    // merge ikki kanaldagi barcha qiymatlarni bitta kanalga uzatadi.
    func merge(a, b <-chan int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for a != nil || b != nil {
                select {
                case v, ok := <-a:
                    if !ok {
                        a = nil
                        continue
                    }
                    out <- v
                case v, ok := <-b:
                    if !ok {
                        b = nil
                        continue
                    }
                    out <- v
                }
            }
        }()
        return out
    }

    func main() {
        count, sum := 0, 0
        for v := range merge(gen(1, 2, 3, 4, 5), gen(10, 20, 30)) {
            count++
            sum += v
        }
        fmt.Println("soni:", count, "yig'indi:", sum)
        if count != 8 || sum != 75 {
            fmt.Println("XATO: qiymatlar yo'qolgan (kutilgan: 8 va 75)")
            os.Exit(1)
        }
    }
  solutionNotes: |
    - `for a != nil || b != nil` tsikli ikkala kanal ham yopilgunicha davom etadi. Yopilgan kanal `nil` ga tenglanadi va `select` uni boshqa tanlamaydi.
    - `continue` kerak: yopiq kanaldan kelgan zero value natijaga yuborilmasligi shart. Shuni `ok` tekshiruvi ta'minlaydi.
    - `defer close(out)` natija kanalini faqat tsikl tugagach yopadi. Yopuvchi bitta goroutine bo'lgani uchun ikki marta close xavfi yo'q.
    - Boshlang'ich kod nodeterministik: qaysi kanal oldin yopilishiga qarab turli yig'indi chiqadi. Tuzatilgan kod har gal `soni: 8 yig'indi: 75` beradi. Xato kam uchraydi: Go 1.24.7, linux/amd64 da 200 ta ishga tushirishning 10 tasida boshlang'ich kod noto'g'ri natija berdi (qolgani 8 va 75), shuning uchun bir martalik muvaffaqiyatli ishga tushirish kodni to'g'ri deb isbotlamaydi.
    - Cheklov: `out <- v` iste'molchi to'xtasa qotib qoladi. Haqiqiy kodda bu yuborishni `ctx.Done()` bilan `select`ga o'rang (47-dars).
  checklist:
    - "Natija har gal `soni: 8 yig'indi: 75`"
    - "Yopiq kanaldan kelgan zero value natijaga tushmaydi"
    - "`merge` ikkala kanal yopilgandan keyingina natija kanalini yopadi"
    - "`go run -race` va `go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Kanal xatolari ikki turda uchraydi: jim va shovqinli. Shovqinlisi panic: "send on closed channel" servisni production'da yiqitadi. Jimi yomonroq. Yopilgan kanaldan `for { select { case v := <-ch: ... } }` ichida o'qiydigan tsikl har safar zero value oladi va 100% CPU yeb ishlaydi. Ikki producer'li kod birinchisi tugagach to'xtab, ikkinchisining qiymatlarini yo'qotadi. Buferi "kattaroq" qilib qo'yilgan kanal yuk ostida navbatni cheksiz kattalashtiradi va xotira tugaguncha hech narsa sezilmaydi.

Bularning hammasi kanal semantikasini noaniq bilishdan: nil, yopiq va ochiq kanalda har bir amal boshqacha ishlaydi, `select` esa tartib bo'yicha emas, tasodifiy tanlaydi. Bu darsda qoidalarni spetsifikatsiyadan o'qiymiz va har birini kichik dastur bilan tekshiramiz.

Node.js'dan kelganlar uchun eslatma: kanal Promise'ga o'xshamaydi. Promise bir marta hal bo'ladi va qiymatini istalgancha o'quvchiga beradi. Kanal esa qiymatlar oqimi bo'lib, har qiymatni bitta qabul qiluvchi oladi va yuborish bilan qabul qilish bir-birini sinxronlashtiradi.

## Asosiy g'oya

### Kanal turi va sig'im

`make(chan T, n)` T tipidagi qiymatlar uchun kanal yaratadi. Sig'im `n` buferning o'lchami. Spetsifikatsiya ikki holatni farqlaydi:

- Sig'im nol yoki berilmagan: kanal buferlanmagan. Aloqa faqat yuboruvchi ham, qabul qiluvchi ham tayyor bo'lganda amalga oshadi.
- Sig'im musbat: kanal buferli. Yuborish bufer to'lmagan bo'lsa, qabul qilish bufer bo'sh bo'lmasa bloklanmaydi.

Shuning uchun buferlanmagan kanal sinxronlashtiruvchi, buferli kanal esa (cheklangan) navbat. Bu farq xotira modelida ham aks etadi: buferlanmagan kanalda qabul qilish tegishli yuborish tugashidan oldin sodir bo'ladi, buferli kanalda esa umumiy qoida boshqacha. Bu darsning pastki qismida va 43-darsda ko'ramiz.

Kanalning yo'nalishi turga kiradi: `chan<- T` faqat yuborish, `<-chan T` faqat qabul qilish. Ikki tomonli kanal ikkala turga implicit o'tadi, teskarisi yo'q. Funksiya imzosida yo'nalish yozish kompilyatordan yordam beradi: `<-chan` oluvchi funksiya kanalni yopa olmaydi (yopish yuboruvchi tomon ishi).

### Amallar jadvali

Spetsifikatsiya nil, yopiq va ochiq kanal uchun har bir amalni aniq belgilaydi:

| Amal | nil kanal | yopiq kanal | ochiq kanal |
|---|---|---|---|
| `ch <- v` | abadiy bloklanadi | panic | tayyor bo'lguncha bloklanadi |
| `<-ch` | abadiy bloklanadi | buferdan o'qiydi, bo'shagach zero value va `ok == false` | tayyor bo'lguncha bloklanadi |
| `close(ch)` | panic | panic | yopadi |
| `range ch` | abadiy bloklanadi | buferni o'qib tugaydi | yopilguncha davom etadi |

Bu jadvalni yodlang: kanal xatolarining katta qismi shu to'rt qatorning biriga to'g'ri keladi. Ikki qiymatli qabul qilish `v, ok := <-ch` da `ok` qiymati kanalga haqiqatan yuborilgan qiymat olinsa `true`, kanal yopilgan va bo'sh bo'lgani uchun zero value berilsa `false`.

### select

`select` bir necha aloqa amalidan davom eta oladiganini tanlaydi. Spetsifikatsiya tartibni aniq beradi:

1. `select`ga kirishda barcha kanal ifodalari va yuboriladigan qiymatlar tartib bo'yicha bir marta baholanadi.
2. Bir nechta aloqa davom eta olsa, bittasi bir tekis psevdo-tasodifiy tanlanadi.
3. Hech biri davom eta olmasa va `default` bo'lsa, `default` bajariladi.
4. `default` yo'q bo'lsa, `select` kamida bittasi tayyor bo'lguncha bloklanadi.

Bundan ikki amaliy xulosa chiqadi. Birinchisi, `select` manbada yozilgan tartibga ustuvorlik bermaydi: "birinchi kanal muhimroq" degan farazga tayanib bo'lmaydi. Ikkinchisi, faqat nil kanallardan iborat va `default`siz `select` abadiy bloklanadi; `select {}` esa ataylab shunday yozilgan, hech qachon tugamaydigan blok.

## Chuqurroq: close, nil shoxlar va sig'im tanlash

### Kim yopadi

`close` kanalga "boshqa qiymat kelmaydi" degan signal beradi. Qoidalar:

- Yopish ixtiyoriy. Kanalni faqat qabul qiluvchilarga tugash haqida xabar berish kerak bo'lganda yoping (masalan, `range` tugashi uchun). Kanal GC tomonidan yopilmagan holda ham yig'iladi.
- Yopuvchi yuboruvchi tomon. Qabul qiluvchi yopsa, yuboruvchi keyingi yuborishda panic oladi.
- Yopish aynan bir marta. Ikkinchi `close` panic.
- Bir nechta yuboruvchi bo'lsa, ularning hech biri yopmaydi. Alohida goroutine barchasining tugashini `sync.WaitGroup` bilan kutib, keyin yopadi. Bu darsdagi `merge` va 47-darsdagi `stage` shu usulda ishlaydi.

`close` ayni vaqtda eng arzon broadcast: yopiq kanaldan qabul qilish barcha kutayotgan goroutine'larni bir vaqtda uyg'otadi. Shu sabab `done` yoki `quit` kanali pattern'i `close(done)` bilan ishlaydi. `context.Context` ichida ham `Done()` kanali aynan shunday ishlaydi (34-dars).

### Notification channel: `chan struct{}`

Faqat signal kerak bo'lganda, qiymat kerak bo'lmaganda `chan struct{}` ishlatiladi. `struct{}` hech qancha xotira olmaydi va o'quvchiga "bu yerda ma'lumot yo'q, faqat hodisa" deb aytadi. 100 Go Mistakes kitobi buni alohida mavzu qiladi (#65, "Not using notification channels"): `chan bool` da `false` nimani bildirishi noaniq, qiymat tashimaydigan signal uchun esa idiomatik tur `chan struct{}`.

### nil kanal bilan shoxni o'chirish

`select` tsiklida kanal yopilganda uni o'qishda davom etish xato: yopiq kanal doimo tayyor va tsikl zero value'larni yeb ishlaydi. Yechim: yopilganini `ok` bilan aniqlab, o'zgaruvchini `nil` ga tenglash. nil kanalda aloqa hech qachon tayyor bo'lmaydi, shuning uchun `select` shoxni tanlamaydi. Misol bo'limidagi `merge` shu usulda ikki kanal oqimini qiymat yo'qotmasdan birlashtiradi.

### Sig'im tanlash

- 0: sinxron o'tkazish kerak (qabul qilish yuborishni kutadi), yoki tugash signali.
- 1: yuboruvchi qabul qiluvchi tayyor bo'lmasa ham bitta qiymat qoldirib ketishi kerak (masalan, "natija kanali" va yuboruvchi leak bo'lmasligi uchun).
- n: yuboruvchilar soni ma'lum va ularning hammasi bloklanmasligi kerak (41-darsdagi `firstResponse`), yoki ongli ravishda cheklangan navbat (49-dars).
- "Katta, har ehtimolga qarshi": odatda xato. Bufer sekin consumer'ni yashiradi va backpressure'ni olib tashlaydi.

Xotira modelidagi qoida buferli kanalni semafor sifatida ishlatish imkonini beradi: kanalning `k`-qabul qilinishi sig'imi `C` bo'lgan kanalda `k+C`-yuborishning tugashidan oldin sodir bo'ladi. Shu sababli sig'imi `C` kanalga yuborish "slot olish", qabul qilish esa "slot qaytarish" bo'lib, bir vaqtda ko'pi bilan `C` ta faol foydalanishni ta'minlaydi. 48-darsda buni amalda ishlatamiz.

### len va cap

`len(ch)` buferdagi hozirgi elementlar sonini, `cap(ch)` sig'imni qaytaradi. `len` qiymati o'qigan zahoti eskirgan bo'ladi, shuning uchun uni mantiqiy qaror uchun ishlatish race condition manbai. Monitoring uchun (navbat chuqurligi metrikasi) foydali.

## Misol: semantikani dasturda tekshirish

Birinchi dastur jadvaldagi yopiq va nil kanal qatorlarini, bufer va panic xabarlarini ko'rsatadi:

```go
package main

import "fmt"

func try(name string, f func()) {
	defer func() { fmt.Printf("%-22s -> %v\n", name, recover()) }()
	f()
}

func main() {
	ch := make(chan int, 2)
	ch <- 10
	ch <- 20
	fmt.Println("len/cap:", len(ch), cap(ch))
	close(ch)

	for v := range ch {
		fmt.Println("range:", v)
	}
	v, ok := <-ch
	fmt.Println("yopiq kanaldan:", v, ok)

	try("yopiq kanalga yuborish", func() { ch <- 30 })
	try("ikkinchi close", func() { close(ch) })
	var nilCh chan int
	try("nil kanalni close", func() { close(nilCh) })
}
```

Natija (Go 1.24.7, linux/amd64):

```text
len/cap: 2 2
range: 10
range: 20
yopiq kanaldan: 0 false
yopiq kanalga yuborish -> send on closed channel
ikkinchi close         -> close of closed channel
nil kanalni close      -> close of nil channel
```

`range` buferdagi ikki qiymatni o'qib tugadi, keyingi `<-ch` esa `0 false` berdi. Uchta panic ham `recover` bilan ushlangan, xabarlar spetsifikatsiyadagi qoidaga mos. Bu dastur panic'larni faqat namoyish uchun ushlaydi; production kodida bunday panic dastur xatosi hisoblanadi (33-dars).

Ikkinchi dastur nil kanal usulini ko'rsatadi:

```go
package main

import (
	"fmt"
	"sort"
)

func gen(vals ...int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for _, v := range vals {
			out <- v
		}
	}()
	return out
}

// merge ikkala kanal yopilguncha qiymatlarni uzatadi.
func merge(a, b <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		defer close(out)
		for a != nil || b != nil {
			select {
			case v, ok := <-a:
				if !ok {
					a = nil // select bu shoxni endi tanlamaydi
					continue
				}
				out <- v
			case v, ok := <-b:
				if !ok {
					b = nil
					continue
				}
				out <- v
			}
		}
	}()
	return out
}

func main() {
	var got []int
	for v := range merge(gen(1, 2, 3), gen(10, 20)) {
		got = append(got, v)
	}
	sort.Ints(got)
	fmt.Println(got)
}
```

```text
[1 2 3 10 20]
```

Natija tartiblanib chiqarilgan: `select` tartibi nodeterministik, shuning uchun qiymatlarning kelish tartibi har ishga tushirishda farq qilishi mumkin. Muhimi, hech qiymat yo'qolmagan va natija kanali ikkala kirish yopilgandan keyin yopilgan. Agar `a = nil` o'rniga shunchaki `continue` yozilsa, yopiq kanal doimo tayyor bo'lib, tsikl CPU'ni yeb bo'sh aylanardi.

Uchinchi dastur `select` tanlovi, `default` va timeout'ni ko'rsatadi:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	a := make(chan int, 1000)
	b := make(chan int, 1000)
	for range 1000 {
		a <- 1
		b <- 1
	}
	var na, nb int
	for range 1000 {
		select {
		case <-a:
			na++
		case <-b:
			nb++
		}
	}
	fmt.Println("ikkala shox ham tanlandi:", na > 0 && nb > 0, "jami:", na+nb)

	// default: bloklanmaydigan urinish
	empty := make(chan int)
	select {
	case v := <-empty:
		fmt.Println("keldi", v)
	default:
		fmt.Println("hozircha qiymat yo'q")
	}

	// timeout
	select {
	case v := <-empty:
		fmt.Println("keldi", v)
	case <-time.After(20 * time.Millisecond):
		fmt.Println("timeout")
	}
}
```

```text
ikkala shox ham tanlandi: true jami: 1000
hozircha qiymat yo'q
timeout
```

Birinchi qatordagi `true` ikkala kanalda ham 1000 ta tayyor qiymat bo'lgan sharoitda ikkala shox ham kamida bir marta tanlanganini bildiradi. Aniq taqsimot (masalan, 512/488) har ishga tushirishda boshqacha, shuning uchun uni chiqarmadik. `time.After` har chaqiruvda yangi timer yaratadi: tez tsiklda uni har iteratsiyada chaqirish o'rniga bitta `time.NewTimer` ni qayta ishlatish va `Stop` qilish to'g'riroq.

## Qachon qo'llamaslik kerak

Kanal har bir muammoning yechimi emas:

- Umumiy holatni himoyalash (hisoblagich, kesh, map) uchun mutex (44-dars) ko'pincha sodda va tezroq. "Share memory by communicating" shiori hamma joyda kanal ishlatishni talab qilmaydi: 100 Go Mistakes kitobi kanal va mutex tanlovini alohida mavzu qiladi (#57).
- Bir vaqtning o'zida ko'p goroutine'ga signal yuborish uchun kanal ishlatsangiz, `close` bir martalik. Qayta-qayta uyg'otish kerak bo'lsa `sync.Cond` yoki alohida kanallar ro'yxati kerak (45-dars).
- Ketma-ket "so'rov-javob" uchun kanallarga kanal yuborish (`chan chan T`) tezda o'qib bo'lmaydigan kodga aylanadi. Oddiy funksiya chaqiruvi yoki natija struct'li kanal aniqroq.
- `len(ch)` bo'yicha qaror qabul qilmang: tekshirish bilan keyingi amal orasida holat o'zgaradi.
- Bufer sig'imini "kutilgan yuk"ka qarab o'ylab topish o'rniga, uni yuboruvchilar soni yoki aniq navbat chegarasi bilan asoslang. Aks holda sekin consumer faqat xotirada yashirinadi.
- Kanalni yopish bilan "xato" signalini berish yomon: yopilish sababini yo'qotadi. Xato kerak bo'lsa, natija bilan birga yuboring yoki kontekst `Cause` dan foydalaning.

## Stack'da: Node.js/TypeScript bilan solishtirish

| Node.js | Go |
|---|---|
| `EventEmitter.emit` navbatsiz, sinxron chaqiradi | Kanal yuborish qabul qiluvchini kutadi (buferlanmagan) |
| `for await (const x of stream)` | `for x := range ch` |
| Stream `end` hodisasi | `close(ch)` |
| `Promise.race` | `select` bilan bir nechta kanal |
| `AbortSignal` | `<-ctx.Done()` shoxi |
| `highWaterMark` va `drain` | Bufer sig'imi va bloklanuvchi yuborish |

Katta farq: Node.js'da producer sekin consumer'ni bosib tashlashi mumkin, chunki `emit` bloklanmaydi va navbat xotirada o'sadi (backpressure uchun stream API'ni qo'lda to'g'ri ishlatish kerak). Go'da kanalga yuborish tabiiy ravishda bloklanadi, shuning uchun backpressure standart xatti-harakat. Bu yaxshi, lekin yuboruvchi qotib qolishi mumkinligini ham anglatadi: har `ch <-` yonida "bu yerda qotsa nima bo'ladi" degan savol turishi kerak. Javob odatda `select` bilan `ctx.Done()` shoxi.

## Xulosa

- Kanal turi sig'imi bilan ikkiga bo'linadi: buferlanmagan kanal yuboruvchi va qabul qiluvchini uchrashtiradi, buferli kanal cheklangan navbat.
- nil kanalda yuborish va qabul qilish abadiy bloklanadi, yopiq kanalga yuborish panic, yopiq kanaldan qabul qilish bufer tugagach zero value va `ok == false` beradi; nil yoki yopiq kanalni `close` qilish panic.
- Kanalni yuboruvchi tomon yopadi, aynan bir marta; bir nechta yuboruvchi bo'lsa, ularning tugashini kutuvchi alohida goroutine yopadi.
- `select` tayyor shoxlar orasidan psevdo-tasodifiy tanlaydi, `default` bloklanmaslikni, nil kanal esa shoxni o'chirishni ta'minlaydi.
- Kanal sig'imini yuboruvchilar soni yoki navbatning aniq chegarasi bilan asoslang; `len(ch)` mantiqiy qaror uchun yaroqsiz.
