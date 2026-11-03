---
n: 94
slug: batching-ingestion
title: "Batching va ingestion pipeline'lari"
summary: "Yuqori hajmli yozuvlarni hajm, vaqt va yopilish triggerlari bilan batch qilish; flush kontekstini, tranzaksiyani, qisman xatoni va idempotent qayta urinishni to'g'ri qurish; database/sql orqali ko'p qatorli INSERT va COPY bilan farq."
duration: 45
sources:
  - id: 100go
    note: "100go.co bo'yicha tekshirilgan bandlar: #61 kontekstni noto'g'ri uzatish, #62 goroutine hayoti, #78 SQL bilan ishlashdagi keng tarqalgan xatolar"
  - id: pkg-database-sql
    note: "DB (ulanishlar puli, bir nechta goroutine uchun xavfsiz), BeginTx, Tx.Rollback va ErrTxDone, SetMaxOpenConns"
  - id: blog-pipelines
    note: "Bosqichlar orasidagi kanallar va bekor qilish: batcher pipeline bosqichi sifatida"
quiz:
  - q: "Batcher faqat hajm triggeriga ega (100 ta yig'ilganda yozadi). Kechasi oqim sekinlashib, soatiga 10 ta nuqta keladi. Nima bo'ladi?"
    options:
      - "Batcher avtomatik ravishda hajmni kamaytiradi"
      - "Nuqtalar darhol yoziladi, chunki Go buferni o'zi flush qiladi"
      - "Nuqtalar buferda soatlab turadi: vaqt triggeri bo'lmasa yozuv kechikishi chegarasiz va jarayon yiqilsa ular yo'qoladi"
      - "Dastur panic qiladi, chunki bufer to'lmadi"
    answer: 2
    explain: "Hajm triggeri yuqori oqimda, vaqt triggeri sekin oqimda kechikishni chegaralaydi. Ikkalasi birga ishlaganda eng katta kechikish interval bilan cheklanadi. Uchinchi trigger - yopilish: Close qolgan elementlarni yozishi kerak."
  - q: "Batcher fon goroutine'da flush qilganda uni birinchi element kelgan HTTP so'rovining konteksti bilan chaqirdi. Qanday xavf bor?"
    options:
      - "Hech qanday xavf yo'q, kontekst baribir bir xil"
      - "So'rov tugashi bilan kontekst bekor bo'ladi va boshqa so'rovlar elementlari ham bor batch yozilmay qoladi; flush o'z deadline'iga ega mustaqil kontekstda ishlashi kerak"
      - "Kontekst faqat qiymat olib yuradi, bekor qilinmaydi"
      - "Faqat sinovlarda muammo bo'ladi"
    answer: 1
    explain: "Batch ko'p so'rovlar elementlarini birlashtiradi, shuning uchun bitta so'rovning hayot sikliga bog'lanmasligi kerak (100 Go Mistakes: kontekstni noto'g'ri uzatish). Namunada flush `context.WithTimeout(context.Background(), ...)` bilan ishlaydi, yopilishda ham yoziladi."
  - q: "Funksiya `defer tx.Rollback()` yozgan va oxirida `return tx.Commit()` qiladi. Commit muvaffaqiyatli bo'lsa, deferred Rollback nima qiladi?"
    options:
      - "Commit qilingan o'zgarishlarni bekor qiladi"
      - "Panic beradi"
      - "Ulanishni yopadi"
      - "sql.ErrTxDone qaytaradi va hech narsani o'zgartirmaydi; xato e'tiborsiz qoldiriladi"
    answer: 3
    explain: "Commit yoki Rollback'dan keyin tranzaksiya tugagan hisoblanadi, keyingi amallar ErrTxDone qaytaradi. Shu sababli `defer tx.Rollback()` xavfsizlik to'ri: har qanday erta return yoki panic'da tranzaksiya yopiladi, muvaffaqiyatda esa zarari yo'q."
  - q: "Nega `insertPoints` bitta INSERT'ga hamma qatorni emas, ko'pi bilan `maxRows` (1000) qatorni qo'yadi?"
    options:
      - "Bitta so'rovdagi parametrlar soni cheklangan (PostgreSQL protokolida bu chegara 65535 deb ma'lum); juda katta batch xato beradi, shuning uchun bo'laklarga bo'linadi"
      - "Go bitta so'rovga 1000 dan ortiq argument bera olmaydi"
      - "Tranzaksiya faqat 1000 qatordan keyin commit qilinadi"
      - "Qatorlar saralanishi uchun"
    answer: 0
    explain: "Parametr limiti baza protokolining xususiyati: Bind xabari parametrlar sonini `Int16` bilan uzatadi (PostgreSQL protokol hujjati), shuning uchun amalda 65535; boshqa baza uchun o'z hujjatini tekshiring. Bo'laklash bitta tranzaksiya ichida qoladi, shuning uchun butun batch atomik."
  - q: "`Batcher.Close()` chaqirilganda boshqa goroutine hali `Add` qilmoqda. Nima bo'lishi mumkin?"
    options:
      - "Add xatosiz davom etadi, element yo'qoladi"
      - "Yopiq kanalga yuborish panic beradi (send on closed channel); Close'dan oldin barcha yuboruvchilar to'xtatilgan bo'lishi kerak"
      - "Close Add tugaguncha kutadi"
      - "Add context.Canceled qaytaradi"
    answer: 1
    explain: "Yopilgan kanalga yuborish panic. Shuning uchun to'xtatish tartibi: avval ishlab chiqaruvchilar (HTTP server Shutdown), keyin Close, keyin DB. Pipeline.Close (95-dars) yuborishni RWMutex bilan himoyalab, bu xavfni kamaytiradi."
  - q: "Batch INSERT `ON CONFLICT (vehicle_id, at) DO NOTHING` bilan yoziladi. Bu nima uchun kerak?"
    options:
      - "INSERT tezroq ishlashi uchun"
      - "Qatorlarni tartiblash uchun"
      - "Commit javobi yo'qolsa yoki mijoz qayta yuborsa, bir xil nuqta ikkinchi marta yozilganda xato bermasdan o'tkazib yuboriladi, ya'ni yozuv idempotent bo'ladi"
      - "Tranzaksiya kerak bo'lmasligi uchun"
    answer: 2
    explain: "At-least-once yetkazishda takrorlar muqarrar: commit muvaffaqiyatli, lekin javob yo'qolgan batch qayta yuboriladi. Tabiiy kalit bo'yicha UNIQUE cheklov va DO NOTHING takrorni zararsiz qiladi (80-dars). Tezlik yoki tartib uchun emas."
task:
  title: "Hajm, vaqt va yopilish triggerli yig'uvchi"
  prompt: |
    `collect` funksiyasi `in` kanalidan o'qiydi va `size` ta element yig'ilganda `flush` ni chaqiradi. Ikkita kamchilik bor: `in` yopilganda qolgan elementlar yo'qoladi, oqim sekin bo'lsa hech qachon flush bo'lmaydi.

    `collect` imzosini `collect(in <-chan int, size int, every time.Duration, flush func([]int))` ga o'zgartirib, uni quyidagicha to'ldiring:

    - `size` ta yig'ilganda flush;
    - `every` o'tganda, bufer bo'sh bo'lmasa, flush;
    - `in` yopilganda qolgan elementlarni flush qilib, qaytish;
    - bo'sh buferda `flush` chaqirilmasin.

    `main`ni ham mos ravishda yangilang. Kutilgan chiqish: `yopilgandan keyin: [3 3 1]` va `yopishdan oldin: [2]`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sync"
        "time"
    )

    // collect in'dan o'qiydi va size ta yig'ilganda flush chaqiradi.
    // Muammo: in yopilganda qolgan elementlar yo'qoladi, kam kelgan oqimda esa hech qachon flush bo'lmaydi.
    func collect(in <-chan int, size int, flush func([]int)) {
        var buf []int
        for v := range in {
            buf = append(buf, v)
            if len(buf) == size {
                flush(buf)
                buf = nil
            }
        }
    }

    func main() {
        var mu sync.Mutex
        var sizes []int
        flush := func(b []int) {
            mu.Lock()
            sizes = append(sizes, len(b))
            mu.Unlock()
        }

        in := make(chan int)
        done := make(chan struct{})
        go func() { collect(in, 3, flush); close(done) }()
        for i := 0; i < 7; i++ {
            in <- i
        }
        close(in)
        <-done
        time.Sleep(10 * time.Millisecond)
        mu.Lock()
        fmt.Println("flush hajmlari:", sizes)
        mu.Unlock()
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
        "time"
    )

    // collect size ta yig'ilganda, every o'tganda yoki in yopilganda flush chaqiradi.
    func collect(in <-chan int, size int, every time.Duration, flush func([]int)) {
        var buf []int
        ticker := time.NewTicker(every)
        defer ticker.Stop()
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
                if len(buf) == size {
                    emit()
                    ticker.Reset(every)
                }
            case <-ticker.C:
                emit()
            }
        }
    }

    func main() {
        var mu sync.Mutex
        var sizes []int
        flush := func(b []int) {
            mu.Lock()
            sizes = append(sizes, len(b))
            mu.Unlock()
        }
        snapshot := func() []int {
            mu.Lock()
            defer mu.Unlock()
            return append([]int(nil), sizes...)
        }

        // 1. in yopilganda qoldiq flush bo'ladi
        in := make(chan int)
        done := make(chan struct{})
        go func() { collect(in, 3, time.Hour, flush); close(done) }()
        for i := 0; i < 7; i++ {
            in <- i
        }
        close(in)
        <-done
        fmt.Println("yopilgandan keyin:", snapshot())

        // 2. oqim sekin: yopishdan oldin ham vaqt bo'yicha flush bo'ladi
        mu.Lock()
        sizes = nil
        mu.Unlock()
        in = make(chan int)
        done = make(chan struct{})
        go func() { collect(in, 100, 20*time.Millisecond, flush); close(done) }()
        in <- 1
        in <- 2
        time.Sleep(100 * time.Millisecond)
        fmt.Println("yopishdan oldin:", snapshot())
        close(in)
        <-done
    }
  solutionNotes: |
    - `select` uch hodisani tinglaydi: element, timer va (kanal yopilishi orqali) yopilish. Yopilish `v, ok := <-in` dagi `ok == false`.
    - Hajm bo'yicha flush'dan keyin `ticker.Reset(every)` qilinadi, shuning uchun yangi batch to'liq interval oladi.
    - `emit` bo'sh buferda flush qilmaydi, shuning uchun bo'sh timer tiki keraksiz yozuv yaratmaydi.
    - `flush(buf)` dan keyin `buf = nil`: flush'ga berilgan slice'ni keyingi `append` bilan buzib yubormaslik uchun yangi bufer boshlanadi (12-dars: slice aliasing).
  checklist:
    - "7 ta element va size=3 bo'lsa flush hajmlari `[3 3 1]`"
    - "Sekin oqimda (2 element) yopishdan oldin vaqt bo'yicha `[2]` flush bo'ladi"
    - "Bo'sh buferda flush chaqirilmaydi"
    - "`in` yopilganda qoldiq yoziladi va funksiya qaytadi"
    - "`go vet` va `go run -race` ogohlantirishsiz o'tadi"
---

## Muammo

Telemetriya servisida har soniyada minglab nuqta keladi. Eng sodda yozish usuli - har nuqta uchun alohida `INSERT`. U ishlaydi, lekin har nuqta alohida tarmoq aylanishi (round trip), alohida bazadagi tranzaksiya va alohida ulanish olishni talab qiladi. Ulanishlar puli (database/sql `DB` bir nechta goroutine uchun xavfsiz va o'z pulini boshqaradi) cheklangan, shuning uchun pik vaqtda so'rovlar ulanish kutib to'planadi, handler kechikadi, mijoz retry qiladi, yuk yana oshadi.

Batching bu og'riqni qisqartiradi: ko'p elementni bitta chaqiruvga yig'adi. Lekin u yangi savollarni ochadi: qachon yozish (hajm yoki vaqt), yig'ilgan, hali yozilmagan elementlar jarayon yiqilsa nima bo'ladi, batchning bitta qatori xato bo'lsa butun batch nima bo'ladi, flush qaysi kontekstda ishlaydi, yopilishda buferdagi narsa nima bo'ladi. Node.js'dan kelgan dasturchi bu kodni `setTimeout` va massiv bilan yozishga o'rgangan; Go'da bir xil g'oya kanal, timer va aniq hayot sikli bilan ifodalanadi (93-darsdagi pipeline tamoyillari).

Muhim: batching latency va durability'ni throughput evaziga almashtiradi. Uchalasi orasidagi tanlov texnik emas, mahsulot qarori.

## Asosiy g'oya

### Uch trigger

Batcher bufer yig'adi va uni uch holatdan birida yozadi:

1. Hajm: bufer `size` ga yetdi. Yuqori oqimda yozish tezligini batch hajmi belgilaydi.
2. Vaqt: oxirgi flush'dan `every` o'tdi. Sekin oqimda element buferda cheksiz yotib qolmaydi; eng katta qo'shimcha kechikish `every` bilan chegaralanadi.
3. Yopilish: kirish kanali yopildi. Qolgan elementlar yoziladi va batcher to'xtaydi.

Faqat hajm triggeri bo'lsa, tungi sekin oqimda nuqtalar soatlab buferda turadi va jarayon yiqilsa yo'qoladi. Faqat vaqt triggeri bo'lsa, yuqori oqimda bufer cheksiz o'sadi. Uchinchisi bo'lmasa, deploy paytida har safar oxirgi qism yo'qoladi.

### Uch o'lchov

| O'lchov | Batch kattalashsa | Batch kichraysa |
|---|---|---|
| Throughput | oshadi (kamroq aylanish) | kamayadi |
| Latency | oshadi (elementlar kutadi) | kamayadi |
| Durability | yomonlashadi (yiqilsa ko'proq yo'qoladi) | yaxshilanadi |

Buferdagi element hali saqlanmagan. Agar mijozga allaqachon "qabul qilindi" (202) javobi qaytgan bo'lsa, yiqilish ma'lumot yo'qotishga teng. Telemetriyada bir necha soniyalik yo'qotish ba'zan qabul qilinadi; to'lovlarda esa yo'q, u yerda yozuv avval bardoshli saqlashga tushishi kerak (97 va 80-darslar).

### Qisman xato va qayta urinish

Batch bitta tranzaksiyada yozilsa, u butunlay muvaffaqiyatli yoki butunlay muvaffaqiyatsiz. Vaqtinchalik xatoda (ulanish uzildi) batch backoff bilan qayta uriniladi. Ammo "commit muvaffaqiyatli, javob yo'qoldi" holati mavjud: mijoz xato ko'radi, batch esa yozilgan. Qayta urinish takror yozuv beradi. Shuning uchun yozuv idempotent bo'lishi kerak: tabiiy kalit (`vehicle_id`, `at`) bo'yicha UNIQUE cheklov va `ON CONFLICT ... DO NOTHING`. Doimiy xatoda (bitta qator cheklovni buzadi) qayta urinish foyda bermaydi: batchni bo'lib (yarmiga bo'lish yoki qatorma-qator) "zaharli" qatorni ajratish va uni alohida joyga (dead-letter) olib qo'yish kerak. Bu darsning namunasi qayta urinish va izolyatsiyani ko'rsatmaydi; 95-darsdagi pipeline qayta urinishni, 97-dars esa dead holatni qo'shadi.

## Chuqurroq: flush konteksti, timer va SQL strategiyalari

### Flush qaysi kontekstda

Elementlar turli so'rovlardan keladi, batch esa ularning birlashmasi. Flush'ni birinchi elementning so'rov konteksti bilan chaqirish xato: so'rov tugashi bilan kontekst bekor bo'ladi va boshqa so'rovlarning elementlari ham yozilmay qoladi. 100 Go Mistakes kontekstni noto'g'ri uzatishni alohida xato sifatida sanaydi. To'g'ri yo'l: flush o'z deadline'iga ega mustaqil kontekstda ishlaydi (`context.WithTimeout(context.Background(), 5*time.Second)`). Yopilishda ham aynan shu kontekst ishlatiladi: jarayon to'xtayotganda asosiy kontekst allaqachon bekor qilingan va u bilan oxirgi batchni yozib bo'lmaydi.

### Timer va qayta o'rnatish

Namunada `time.Timer` ishlatilgan. Hajm bo'yicha flush'dan keyin vaqt triggerini qayta boshlash kerak, aks holda yangi batch to'lmasdan oldingi intervaldan qolgan vaqtda yoziladi. Timer'ni qayta o'rnatishning ehtiyotkor shakli: avval `Stop()`, agar u `false` qaytarsa kanaldan bo'shatish, keyin `Reset()`. Namuna shu shaklni ishlatadi, shuning uchun u Go versiyasidagi timer semantikasidan qat'i nazar to'g'ri.

### Go 1.23 dan oldin va keyin: Reset va eskirgan qiymat

Go 1.23 release notes'i timer kanalining semantikasi o'zgarganini yozadi: `Timer` va `Ticker` kanali endi bufersiz (sig'imi 0), va Go har `Reset` yoki `Stop` chaqiruvidan keyin, chaqiruvdan oldin tayyorlangan eskirgan qiymat yuborilmasligi yoki qabul qilinmasligini kafolatlaydi. Oldingi versiyalarda kanal bir elementli buferga ega edi va shu sabab `Reset` ni to'g'ri ishlatish qiyin edi. Muhim shart: yangi xatti-harakat faqat `go.mod` dagi `go` qatori 1.23.0 yoki yuqori bo'lgan modulda yoqiladi; `GODEBUG=asynctimerchan=1` eski xatti-harakatni qaytaradi. Batcher uchun bu real xavf: taymer ishlab ketgan, lekin batcher shu paytda hajm bo'yicha flush qilayotgan bo'lsa, buferda bitta eskirgan "vaqt keldi" signali qolib, yangi, hali to'lmagan batchni darhol yozdirib yuborishi mumkin. Uch konfiguratsiyada sinadik (Go 1.24.7): taymer ishlaydi, kanaldan o'qilmaydi, keyin `Reset(time.Hour)` chaqiriladi va kanalda qiymat bor-yo'qligi tekshiriladi.

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	t := time.NewTimer(10 * time.Millisecond)
	time.Sleep(30 * time.Millisecond) // taymer ishladi, hech kim kanaldan o'qimadi

	t.Reset(time.Hour) // oldin bo'shatmasdan qayta o'rnatamiz

	select {
	case <-t.C:
		fmt.Println("eskirgan qiymat keldi: flush darhol ishlaydi")
	default:
		fmt.Println("kanal bo'sh: eskirgan qiymat yo'q")
	}
}
```

```text
[go.mod go 1.24]
kanal bo'sh: eskirgan qiymat yo'q
[GODEBUG=asynctimerchan=1]
eskirgan qiymat keldi: flush darhol ishlaydi
[go.mod go 1.22]
eskirgan qiymat keldi: flush darhol ishlaydi
```

Xulosa: kurs namunasidagi `Stop()` + bo'shatish + `Reset()` shakli hamma konfiguratsiyada to'g'ri, oddiy `Reset` esa faqat go.mod 1.23+ bo'lganda xavfsiz. Kutubxona kodida (siz go.mod ni boshqarmaydigan paketda) ehtiyotkor shaklni saqlang. Jamoada go.mod `go` qatorini ko'tarish `GODEBUG` default'larini ham o'zgartirishini eslang (1-dars).

### Yopish tartibi

Batcher'ning `Close()` kanalni yopadi, shuning uchun u chaqirilganda hech kim `Add` qilmayotgan bo'lishi shart; yopiq kanalga yuborish panic beradi. To'xtatish tartibi doim bir xil: avval ishlab chiqaruvchilarni to'xtatish (HTTP server `Shutdown`), keyin `Close`, keyin bazani yopish (88-dars). 95-dars pipeline'i buni `RWMutex` bilan himoyalaydi.

### SQL strategiyalari

Batchni bazaga yozishning uch asosiy yo'li bor:

1. Ko'p qatorli `INSERT ... VALUES (...), (...), ...`. Standart `database/sql` bilan ishlaydi, tranzaksiyaga o'raladi. Cheklov: bitta so'rovdagi parametrlar soni chegaralangan (PostgreSQL protokolida Bind xabari parametrlar sonini 16 bitli butun (`Int16`) bilan uzatadi, shuning uchun amalda chegara 65535: postgresql.org/docs/current/protocol-message-formats.html; qatorlar soni x ustunlar soni shundan oshmasligi kerak). Shuning uchun katta batch bo'laklanadi.
2. `COPY`. PostgreSQL'ning ommaviy yuklash buyrug'i; pgx uni `Conn.CopyFrom(ctx, tableName, columnNames, rowSrc)` bilan, `pgx.CopyFromRows` manba sifatida beradi. Ko'p qatorli INSERT'dan tezroq bo'lishi mumkin (o'lchash kerak), lekin `COPY` o'zi `ON CONFLICT` ni qo'llamaydi (PostgreSQL `COPY` sintaksisida `ON CONFLICT` bandi yo'q: postgresql.org/docs/current/sql-copy.html): konfliktli qatorlar uchun avval vaqtinchalik jadvalga yozib, so'ng `INSERT ... SELECT ... ON CONFLICT` qilinadi. Tezlik farqi sizning ma'lumotingiz va bazangizga bog'liq: o'lchang (61-dars).
3. pgx `Batch` / `SendBatch`: bir nechta turli so'rovni bitta tarmoq aylanishida yuboradi. Bir turdagi ko'p qator uchun odatda ko'p qatorli INSERT yoki COPY ma'quldir.

```go
// Kompilyatsiya qilinmagan: pgx sandbox'da yuklanmaydi; imzolar pkg.go.dev hujjatiga tayanadi.
rows := make([][]any, 0, len(pts))
for _, p := range pts {
	rows = append(rows, []any{p.Vehicle, p.Lat, p.Lon, p.At})
}
n, err := conn.CopyFrom(ctx,
	pgx.Identifier{"points_staging"},
	[]string{"vehicle_id", "lat", "lon", "at"},
	pgx.CopyFromRows(rows),
)
// so'ng: INSERT INTO points SELECT * FROM points_staging ON CONFLICT (vehicle_id, at) DO NOTHING
```

### ON CONFLICT: bitta batch ichidagi takrorlar va qaytgan son

PostgreSQL hujjati (sql-insert) ikkita nozikni aniq yozadi. Birinchisi: `ON CONFLICT DO UPDATE` "deterministik" buyruq, ya'ni u bitta mavjud qatorga bir buyruq ichida ikki marta ta'sir qila olmaydi, bunday holda cardinality violation xatosi ko'tariladi; hujjatning o'zi taklif qilinayotgan qatorlar arbiter indeks bo'yicha bir-birini takrorlamasligi kerakligini aytadi. Telemetriyada qurilma bir xil `(vehicle_id, at)` bilan ikki marta yuborsa va ikkalasi bitta batchga tushsa, `DO UPDATE` varianti butun batchni yiqitishi mumkin. Davo: batchni yozishdan oldin kalit bo'yicha deduplikatsiya qilish (oxirgi qiymatni qoldirish) yoki `DO NOTHING` dan foydalanish. Bu darsda hujjat `DO NOTHING` ning batch ichidagi takrorlardagi xatti-harakatini alohida aytmaydi, shuning uchun uni o'z bazangizda sinab ko'ring. Ikkinchisi: `INSERT` buyrug'i qaytaradigan `count` "kiritilgan yoki yangilangan qatorlar soni". `ExecContext` natijasidagi `RowsAffected` driverga bog'liq, lekin pgx/PostgreSQL bilan bu son shu command tag'dan keladi (bu muallifning xulosasi, drayver hujjatida tekshirilmagan). Amaliy ma'no: 100 qator yuborib 97 qaytsa, 3 tasi takror edi. Bu ko'rsatkichni metrikaga chiqarish dublikat darajasini ko'rsatadi (85-dars).

Jami, batchni yozish kodi uch narsani bilishi kerak: parametr limiti bo'yicha bo'laklash, kalit bo'yicha dedup va takrorlar sonini hisoblash.

## Misol: Batcher va database/sql

Namuna generik `Batcher[T]` va `database/sql`ning ko'p qatorli INSERT'ini ko'rsatadi. Postgres o'rniga sinov uchun yozilgan minimal `database/sql/driver` realizatsiyasi ishlatiladi: u nechta so'rov va qator kelganini sanaydi. Shuning uchun natija chaqiruvlar sonini ko'rsatadi, vaqtni emas.

```go
package main

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"errors"
	"fmt"
	"strings"
	"sync/atomic"
	"time"
)

// --- Batcher: hajm yoki vaqt bo'yicha flush ---

type Batcher[T any] struct {
	in    chan T
	size  int
	every time.Duration
	flush func(context.Context, []T) error
	onErr func([]T, error)
	done  chan struct{}
}

func NewBatcher[T any](size int, every time.Duration, flush func(context.Context, []T) error, onErr func([]T, error)) *Batcher[T] {
	b := &Batcher[T]{in: make(chan T), size: size, every: every, flush: flush, onErr: onErr, done: make(chan struct{})}
	go b.run()
	return b
}

// Add qiymat qabul qilinguncha yoki ctx tugaguncha kutadi (backpressure).
func (b *Batcher[T]) Add(ctx context.Context, v T) error {
	select {
	case b.in <- v:
		return nil
	case <-ctx.Done():
		return context.Cause(ctx)
	}
}

// Close qolgan elementlarni flush qiladi. Close'dan oldin barcha Add chaqiruvlari tugagan bo'lishi shart.
func (b *Batcher[T]) Close() {
	close(b.in)
	<-b.done
}

func (b *Batcher[T]) run() {
	defer close(b.done)
	buf := make([]T, 0, b.size)
	timer := time.NewTimer(b.every)
	defer timer.Stop()

	flush := func() {
		if len(buf) == 0 {
			return
		}
		// Flush so'rov ctx'iga emas, o'z deadline'iga ega: yopilishda ham yozilishi kerak.
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := b.flush(ctx, buf); err != nil {
			b.onErr(buf, err)
		}
		buf = make([]T, 0, b.size)
	}
	reset := func() {
		if !timer.Stop() {
			select {
			case <-timer.C:
			default:
			}
		}
		timer.Reset(b.every)
	}
	for {
		select {
		case v, ok := <-b.in:
			if !ok {
				flush()
				return
			}
			buf = append(buf, v)
			if len(buf) >= b.size {
				flush()
				reset()
			}
		case <-timer.C:
			flush()
			timer.Reset(b.every)
		}
	}
}

// --- database/sql orqali ko'p qatorli INSERT ---

type Point struct {
	Vehicle  string
	Lat, Lon float64
	At       int64
}

func insertPoints(ctx context.Context, db *sql.DB, pts []Point) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin: %w", err)
	}
	defer tx.Rollback() // Commit'dan keyin zararsiz (sql.ErrTxDone)

	const cols = 4
	var sb strings.Builder
	sb.WriteString("INSERT INTO points (vehicle_id, lat, lon, at) VALUES ")
	args := make([]any, 0, len(pts)*cols)
	for i, p := range pts {
		if i > 0 {
			sb.WriteByte(',')
		}
		n := i * cols
		fmt.Fprintf(&sb, "($%d,$%d,$%d,$%d)", n+1, n+2, n+3, n+4)
		args = append(args, p.Vehicle, p.Lat, p.Lon, p.At)
	}
	if _, err := tx.ExecContext(ctx, sb.String(), args...); err != nil {
		return fmt.Errorf("insert %d ta nuqta: %w", len(pts), err)
	}
	return tx.Commit()
}

// --- sinov uchun minimal database/sql drayveri ---

var execs, rows, commits atomic.Int64

type fakeDriver struct{}
type fakeConn struct{}
type fakeTx struct{}

func (fakeDriver) Open(string) (driver.Conn, error)  { return fakeConn{}, nil }
func (fakeConn) Prepare(string) (driver.Stmt, error) { return nil, errors.New("prepare qo'llanmaydi") }
func (fakeConn) Close() error                        { return nil }
func (fakeConn) Begin() (driver.Tx, error)           { return fakeTx{}, nil }
func (fakeConn) ExecContext(_ context.Context, q string, args []driver.NamedValue) (driver.Result, error) {
	execs.Add(1)
	rows.Add(int64(len(args) / 4))
	return driver.RowsAffected(len(args) / 4), nil
}
func (fakeTx) Commit() error   { commits.Add(1); return nil }
func (fakeTx) Rollback() error { return nil }

func main() {
	sql.Register("fake", fakeDriver{})
	db, _ := sql.Open("fake", "")
	defer db.Close()

	flush := func(ctx context.Context, pts []Point) error { return insertPoints(ctx, db, pts) }
	onErr := func(pts []Point, err error) { fmt.Println("flush xatosi:", err, len(pts)) }

	// 1. hajm bo'yicha: 1000 nuqta, batch 100
	b := NewBatcher(100, time.Hour, flush, onErr)
	for i := 0; i < 1000; i++ {
		b.Add(context.Background(), Point{Vehicle: "truck-7", Lat: 41.3, Lon: 69.2, At: int64(i)})
	}
	b.Close()
	fmt.Println("hajm bo'yicha: exec =", execs.Load(), "qator =", rows.Load(), "commit =", commits.Load())

	// 2. vaqt bo'yicha: 5 nuqta, batch 100, interval 20ms
	execs.Store(0)
	rows.Store(0)
	b = NewBatcher(100, 20*time.Millisecond, flush, onErr)
	for i := 0; i < 5; i++ {
		b.Add(context.Background(), Point{Vehicle: "truck-9", At: int64(i)})
	}
	time.Sleep(100 * time.Millisecond)
	fmt.Println("vaqt bo'yicha (Close'dan oldin): exec =", execs.Load(), "qator =", rows.Load())
	b.Close()

	// 3. yopilishda qolgan elementlar
	execs.Store(0)
	rows.Store(0)
	b = NewBatcher(100, time.Hour, flush, onErr)
	for i := 0; i < 7; i++ {
		b.Add(context.Background(), Point{Vehicle: "truck-3", At: int64(i)})
	}
	b.Close()
	fmt.Println("yopilishda: exec =", execs.Load(), "qator =", rows.Load())
}
```

Go 1.24.7, linux/amd64, `go run -race .`:

```text
hajm bo'yicha: exec = 10 qator = 1000 commit = 10
vaqt bo'yicha (Close'dan oldin): exec = 1 qator = 5
yopilishda: exec = 1 qator = 7
```

Nimaga e'tibor berish kerak:

- 1000 nuqta 100 hajmli batchlar bilan 10 ta `ExecContext` va 10 ta commit bo'ldi, qatorma-qator yozishda esa 1000 ta chaqiruv kerak bo'lardi. Vaqt farqini bu namuna ko'rsatmaydi: real bazada o'lchang.
- Ikkinchi senariyda 5 nuqta hajmga yetmaydi, lekin 20 ms interval o'tgach yoziladi: `Close` chaqirilmasdan oldin `exec = 1`.
- Uchinchi senariyda 7 nuqta faqat `Close` bilan yoziladi (soatlik interval hech qachon ishlamagan). Yopilish triggeri shuni ta'minlaydi.
- `Add` kanalga yuboradi va `ctx.Done()` bilan birga kutadi: bufer to'lib flush sekin bo'lsa, yuboruvchi bloklanadi. Bu backpressure (49-dars); alternativ - `select/default` bilan tashlash (93-dars).
- `flush` ichidagi `buf = make(...)`: `onErr` buferni saqlab qolishi mumkin, shuning uchun uni qayta ishlatmaymiz.
- `insertPoints` tranzaksiyada va `defer tx.Rollback()` bilan yoziladi; muvaffaqiyatli `Commit` dan keyin `Rollback` `sql.ErrTxDone` qaytaradi va zararsiz.

## Qachon qo'llamaslik kerak

- Oqim past bo'lsa (sekundiga bir necha yozuv), batching murakkablik qo'shadi va foyda bermaydi. Oddiy `INSERT` yetarli.
- Har yozuvdan keyin darhol o'qish kerak bo'lsa (read-your-writes), buferdagi element hali ko'rinmaydi. Mijozga "yozildi" deb javob berish kerak bo'lgan oqimlarda buferga qo'yib 202 qaytarish halol emas.
- Har element uchun alohida natija (muvaffaqiyat/xato) kerak bo'lsa, batch buni murakkablashtiradi: butun batch xatosi qaysi element aybdorligini yashiradi.
- Yo'qolmasligi shart ma'lumot uchun jarayon xotirasidagi bufer yetarli emas. Bardoshli navbat yoki outbox kerak (80 va 97-darslar).
- Hali o'lchamagan bo'lsangiz, avval o'lchang. Batching ko'pincha sezilarli yutuq beradi, lekin bu sizning bazangiz, tarmog'ingiz va qator hajmiga bog'liq; raqamni manbadan emas, o'z benchmark'ingizdan oling (61 va 70-darslar).

## Stack'da: Node.js bilan solishtirish

Node.js'da batcher odatda massiv va `setTimeout`/`setInterval` bilan yoziladi, bir oqimli bo'lgani uchun data race muammosi yo'q. Go'da ko'p goroutine bir batcher'ga yozadi, shuning uchun sinxronizatsiya (kanal yoki mutex) kerak; foyda esa parallel flush'lar va yagona hayot sikli (kontekst, Close). Ommaviy yozish uchun ORM va so'rov quruvchilarda tayyor vositalar bor (masalan Prisma `createMany`, Kysely'da ko'p qatorli `values`); Go'da `database/sql` bilan ko'p qatorli INSERT'ni o'zingiz qurasiz (`$1, $2...` o'rin egalari) yoki pgx `CopyFrom` ishlatasiz. Farq yana bir joyda: Go'da bir tranzaksiya bitta ulanishga bog'lanadi (`Tx` bir ulanishni egallaydi), shuning uchun katta, uzoq tranzaksiyalar pulni quritishi mumkin: batch hajmi va `SetMaxOpenConns` birga o'ylanadi.

## Xulosa

- Batcher uch trigger bilan ishlaydi: hajm, vaqt, yopilish. Birortasi yetishmasa, kechikish yoki yo'qotish paydo bo'ladi.
- Batching throughput'ni latency va durability evaziga oshiradi; buferdagi element hali saqlanmagan.
- Flush o'z deadline'iga ega mustaqil kontekstda ishlaydi, so'rov kontekstida emas; yopilishda ham yoziladi.
- Yozuv idempotent bo'lsin (UNIQUE + `ON CONFLICT DO NOTHING`), chunki qayta urinish takror beradi.
- Tranzaksiyada `defer tx.Rollback()`; katta batch bo'laklarga bo'linadi (parametr limiti), `COPY` ko'proq yuk uchun variant.
- To'xtatish tartibi: ishlab chiqaruvchilar, keyin `Close`, keyin baza; foyda raqamini o'z muhitingizda o'lchang.
