---
n: 97
slug: case-job-queue
title: "Case study: Postgres asosidagi job queue"
summary: "Postgres jadvalida job queue: holatlar, SKIP LOCKED bilan atomik claim, lease (visibility timeout), urinishlar soni bilan fencing, backoff bilan qayta urinish, dead holat va tartibli to'xtaydigan worker; mexanizm database/sql orqali, xotiradagi realizatsiya bilan lokal tekshirilgan."
duration: 55
sources:
  - id: pgx
    note: "Postgres drayveri: pgx database/sql (stdlib) ulagichi bilan yoki to'g'ridan-to'g'ri ishlatiladi; bu darsda drayver kodi kompilyatsiya qilinmagan"
  - id: pkg-database-sql
    note: "QueryRowContext, ExecContext, Result.RowsAffected, sql.ErrNoRows va DB'ning bir nechta goroutine uchun xavfsizligi"
  - id: 100go
    note: "100go.co bo'yicha tekshirilgan bandlar: #61 kontekstni noto'g'ri uzatish, #62 goroutine hayoti (worker'ning to'xtashi va natijani yozish)"
quiz:
  - q: "Nega claim bitta `UPDATE jobs SET ... WHERE id = (SELECT id ... FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING ...` bilan qilinadi, `SELECT` va keyin alohida `UPDATE` bilan emas?"
    options:
      - "Ikki so'rov Go'da qo'llab-quvvatlanmaydi"
      - "Bitta so'rov tezroq tarmoqdan o'tadi, boshqa farqi yo'q"
      - "RETURNING faqat UPDATE bilan ishlaydi"
      - "SELECT va UPDATE orasida boshqa worker xuddi shu jobni tanlab olishi mumkin; bitta so'rov tanlash, qulflash va band qilishni atomik qiladi, SKIP LOCKED esa qulflangan qatorlarni o'tkazib yuboradi"
    answer: 3
    explain: "Ikki bosqichli claim poyga beradi (bu darsdagi topshiriqning muammosi). SKIP LOCKED qulflangan qatorlarni kutmasdan o'tkazib yuboradi, shuning uchun ko'p worker bir-birini kutdirmaydi. PostgreSQL hujjati SKIP LOCKED queue-ga o'xshash jadvallarda iste'molchilar o'rtasidagi qulf kurashidan qochish uchun ishlatilishini aytadi."
  - q: "Worker jobni claim qildi va lease muddati (30 s) davomida qulab tushdi. Keyin nima bo'ladi?"
    options:
      - "Job abadiy 'running' holatida qoladi"
      - "Job avtomatik 'done' bo'ladi"
      - "Lease tugagach job boshqa worker tomonidan qayta claim qilinadi (attempts oshadi); shuning uchun handler idempotent bo'lishi kerak"
      - "Job o'chiriladi"
    answer: 2
    explain: "Lease (visibility timeout) qulagan worker'ning jobini qaytarib beradi. Bu at-least-once kafolati: job bir martadan ko'p bajarilishi mumkin (qulagan worker oldin yarim ish qilgan bo'lishi mumkin), shuning uchun handler takroriy chaqiruvga chidamli (idempotent) yozilishi kerak (80-dars)."
  - q: "A worker lease tugagandan keyin ham ishlashda davom etdi; ayni paytda B worker jobni qayta claim qildi (attempts=2). A kech `Complete(job{attempts: 1})` chaqirdi. Nima bo'ladi?"
    options:
      - "A ning Complete'i B ning natijasini bosib ketadi"
      - "Complete `WHERE id = $1 AND status = 'running' AND attempts = $2` sharti tufayli 0 qatorni o'zgartiradi va xato qaytaradi: eski urinish fencing token bilan rad etiladi"
      - "Ikkala Complete ham o'tadi"
      - "Baza deadlock beradi"
    answer: 1
    explain: "attempts har claim'da oshadi va fencing token vazifasini bajaradi: faqat jobning joriy egasi uni tugatishi mumkin. Namunada `A kech tugatmoqchi: job 1: lease boshqaga o'tgan` chiqishi shuni ko'rsatadi. Fencing handler'ning yon ta'sirlarini (tashqi API chaqiruvi) bekor qilmaydi, faqat holatni himoyalaydi."
  - q: "`process` funksiyasida natijani yozish uchun `context.WithoutCancel(ctx)` ishlatilgan. Nega?"
    options:
      - "Shutdown paytida asosiy kontekst bekor qilinadi; bajarilgan jobning natijasi (Complete/Fail) baribir yozilishi kerak, aks holda job lease tugaguncha 'running' bo'lib qoladi va qayta bajariladi"
      - "WithoutCancel kontekstni tezlashtiradi"
      - "Handler kontekstni ishlatmasligi uchun"
      - "Shutdown tez tugashi uchun"
    answer: 0
    explain: "WithoutCancel ota kontekstning qiymatlarini saqlaydi, lekin bekor qilinishini ota-ona bilan bog'lamaydi (Go 1.21). Natijani yozish uchun alohida timeout qo'yiladi. Aks holda to'xtatish paytida bajarilgan ish natijasi yo'qoladi va job ikkinchi marta bajariladi."
  - q: "`max_attempts = 4`, job har safar xato qaytaradi. 4-urinishdan keyin nima bo'ladi va nima uchun bu muhim?"
    options:
      - "Job 'queued' holatiga qaytib, cheksiz qayta uriniladi"
      - "Job 'dead' holatiga o'tadi: zaharli job navbatni to'ldirib, boshqalarning resursini yeb qo'ymaydi va odam ko'rib chiqishi uchun saqlanadi"
      - "Job jimgina o'chiriladi"
      - "Worker to'xtaydi"
    answer: 1
    explain: "Cheksiz qayta urinish doimiy xatoli jobni abadiy aylantiradi. 'dead' holat tahlil qilish va qo'lda qayta ishga tushirish imkonini beradi. Namunadagi `#5 poison dead urinish=4` shuni ko'rsatadi."
  - q: "Postgres asosidagi navbatning Redis/Kafka'ga nisbatan eng kuchli afzalligi qaysi?"
    options:
      - "Throughput har doim yuqoriroq"
      - "Job biznes ma'lumoti bilan bitta tranzaksiyada yoziladi: buyurtma saqlandi, demak job ham bor; ikkalasi birga commit yoki birga rollback"
      - "Jadvalni VACUUM qilish shart emas"
      - "Polling kerak emas"
    answer: 1
    explain: "Tranzaksion enqueue (outbox g'oyasi) tashqi brokerda alohida kafolatlash qiyin: buyurtma saqlanib, xabar yuborilmay qolishi yoki aksi mumkin. Throughput odatda tashqi brokerda yuqori; Postgres'da UPDATE'lar ko'p bo'lgani uchun jadval texnik xizmatga muhtoj, va worker'lar polling qiladi."
task:
  title: "Atomik claim: tekshirish va olishni bitta kritik bo'limga olish"
  prompt: |
    `Queue.Next` tayyor jobni oladi. Hozir u tayyorlar ro'yxatining boshini o'qiydi, mutexni qo'yib yuboradi va alohida kritik bo'limda ro'yxatdan olib tashlaydi. Shu orada boshqa worker xuddi shu jobni oladi: bir job bir necha marta claim qilinadi.

    `Next`ni qayta yozing: tekshirish, olib tashlash va `claims` hisoblagichini oshirish bitta kritik bo'limda bajarilsin. Bu bazadagi `UPDATE ... WHERE id = (SELECT ... FOR UPDATE SKIP LOCKED)` ning xotiradagi ekvivalenti.

    Kutilgan natija: 200 job, 8 worker, `takror olingan joblar: 0 jami olishlar: 200` har ishga tushirishda. Starter versiyasi natijasi har safar farq qiladi va takrorlarni ko'rsatadi.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "runtime"
        "sync"
    )

    type Queue struct {
        mu     sync.Mutex
        ready  []int
        claims map[int]int
    }

    // Next tayyor jobni oladi. Muammo: tekshirish va olib tashlash alohida kritik bo'limlarda,
    // shuning uchun ikki worker bir jobni olishi mumkin.
    func (q *Queue) Next() (int, bool) {
        q.mu.Lock()
        if len(q.ready) == 0 {
            q.mu.Unlock()
            return 0, false
        }
        id := q.ready[0]
        q.mu.Unlock()

        runtime.Gosched()

        q.mu.Lock()
        if len(q.ready) > 0 {
            q.ready = q.ready[1:]
        }
        q.claims[id]++
        q.mu.Unlock()
        return id, true
    }

    func main() {
        q := &Queue{claims: map[int]int{}}
        for i := 1; i <= 200; i++ {
            q.ready = append(q.ready, i)
        }
        var wg sync.WaitGroup
        for range 8 {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for {
                    if _, ok := q.Next(); !ok {
                        return
                    }
                }
            }()
        }
        wg.Wait()
        dup, total := 0, 0
        for _, n := range q.claims {
            total += n
            if n > 1 {
                dup++
            }
        }
        fmt.Println("takror olingan joblar:", dup, "jami olishlar:", total)
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
    )

    type Queue struct {
        mu     sync.Mutex
        ready  []int
        claims map[int]int
    }

    // Next tekshirish va olib tashlashni bitta kritik bo'limda bajaradi: claim atomik.
    func (q *Queue) Next() (int, bool) {
        q.mu.Lock()
        defer q.mu.Unlock()
        if len(q.ready) == 0 {
            return 0, false
        }
        id := q.ready[0]
        q.ready = q.ready[1:]
        q.claims[id]++
        return id, true
    }

    func main() {
        q := &Queue{claims: map[int]int{}}
        for i := 1; i <= 200; i++ {
            q.ready = append(q.ready, i)
        }
        var wg sync.WaitGroup
        for range 8 {
            wg.Add(1)
            go func() {
                defer wg.Done()
                for {
                    if _, ok := q.Next(); !ok {
                        return
                    }
                }
            }()
        }
        wg.Wait()
        dup, total := 0, 0
        for _, n := range q.claims {
            total += n
            if n > 1 {
                dup++
            }
        }
        fmt.Println("takror olingan joblar:", dup, "jami olishlar:", total)
    }
  solutionNotes: |
    - Muammo check-then-act: `ready[0]` o'qilgandan keyin mutex qo'yib yuboriladi, ikkinchi worker xuddi shu qiymatni o'qiydi. Ikkalasi ham `claims[id]++` qiladi.
    - Yechim: butun `Next` bitta `Lock/defer Unlock` ichida. Qulf ichida bloklanadigan ishlar (tarmoq, disk) yo'q, shuning uchun qulf qisqa.
    - Bazada bu bitta `UPDATE ... RETURNING` bilan, qulflangan qatorlarni esa `SKIP LOCKED` bilan o'tkazib yuborish orqali amalga oshadi.
    - `-race` bu starter'da data race ko'rsatmasligi mumkin (barcha kirishlar mutex ichida), lekin mantiqiy poyga bor: poyga ma'lumotga emas, qarorlar ketma-ketligiga tegishli.
  checklist:
    - "`Next` ichida o'qish, olib tashlash va hisoblagich bitta kritik bo'limda"
    - "Mutex bitta `Lock` va `defer Unlock` bilan boshqariladi"
    - "Takror olingan joblar soni har ishga tushirishda 0"
    - "Jami olishlar aniq 200"
    - "`go vet` va `go run -race` ogohlantirishsiz o'tadi"
---

## Muammo

Servisda fon ishlari kerak bo'ladi: hisobot yaratish, xabar yuborish, qayta hisoblash, tashqi API'ga eksport. Ular so'rov ichida bajarilmaydi: sekin, xato qilishi mumkin va qayta urinishni talab qiladi. Odatiy javob - navbat. Node.js dunyosida bu ko'pincha Redis va BullMQ; boshqa jamoalar Kafka yoki bulut navbati qo'yadi. Ular ishlaydi, lekin yangi infratuzilma, yangi monitoring va eng muhimi yangi nosozlik turini olib keladi: buyurtma bazaga yozildi, lekin navbatga xabar tushmadi (yoki aksi). Ikki tizim orasida tranzaksiya yo'q.

Servis allaqachon Postgres ishlatsa va fon ish hajmi o'rtacha bo'lsa, navbatni shu bazaning jadvali sifatida qurish mantiqli: job biznes ma'lumoti bilan bitta tranzaksiyada yoziladi, qo'shimcha komponent yo'q, holatni oddiy SQL bilan ko'rish mumkin. Lekin oddiy ko'rinadigan bu g'oya aniq xatolarga ochiq: ikki worker bir jobni oladi; worker qulaydi va job "running" holatida abadiy qoladi; xato qiladigan job milliard marta qayta uriniladi; worker to'xtayotganda bajarilgan ish natijasi yo'qoladi. Bu dars shu to'rt xatoning har biriga mexanizm beradi va mexanizmni lokal ishlaydigan kodda ko'rsatadi.

## Asosiy g'oya

### Job holatlari

Job to'rt holatdan o'tadi:

| Holat | Ma'nosi | Keyingi |
|---|---|---|
| `queued` | `run_at` vaqtidan boshlab bajarishga tayyor | `running` |
| `running` | worker lease bilan ushlab turibdi (`locked_until`) | `done`, `queued` (xato, qayta urinish), `dead` |
| `done` | muvaffaqiyatli tugagan | - |
| `dead` | urinishlar tugagan, qo'lda ko'rish kerak | - |

Jadvalda `kind`, `payload`, `attempts`, `max_attempts`, `run_at`, `locked_until` va `last_error` maydonlari bor; tayyor joblar uchun qisman indeks (`WHERE status IN ('queued','running')`) skanerlashni arzon qiladi. To'liq sxema namunada keltirilgan.

### Atomik claim: SKIP LOCKED

Eng muhim qism - jobni olish. Ikki bosqichli yondashuv (avval `SELECT`, keyin `UPDATE`) poyga beradi: ikkita worker bir qatorni tanlaydi. `SELECT ... FOR UPDATE` qatorni qulflaydi, lekin ikkinchi worker uni kutadi va hamma navbat bilan yurishga majbur bo'ladi. PostgreSQL SELECT hujjatidagi locking clause bo'limi `SKIP LOCKED` ni aynan shu holat uchun tasvirlaydi: hozir qulflab bo'lmaydigan qatorlar o'tkazib yuboriladi. Hujjat shuningdek, bu ko'rinish nomuvofiq ma'lumot beradi va umumiy maqsadlar uchun mos emas, lekin queue-ga o'xshash jadvalga bir nechta iste'molchi kirganda qulf kurashidan qochish uchun ishlatilishi mumkinligini ham aytadi.

Natijada claim bitta so'rov bo'ladi:

```sql
UPDATE jobs SET status = 'running', attempts = attempts + 1, locked_until = $2
WHERE id = (
  SELECT id FROM jobs
  WHERE (status = 'queued' AND run_at <= $1) OR (status = 'running' AND locked_until <= $1)
  ORDER BY run_at, id
  FOR UPDATE SKIP LOCKED
  LIMIT 1)
RETURNING id, kind, payload, attempts, max_attempts
```

Ichki `SELECT` eng eski tayyor jobni topadi va uni qulflaydi, tashqi `UPDATE` esa uni band qiladi va ma'lumotni qaytaradi. Hammasi bitta (autocommit) bayonotda atomik bajariladi. Tayyor job bo'lmasa so'rov qator qaytarmaydi va `database/sql` `sql.ErrNoRows` beradi; namunada u `ErrNoJob` ga o'giriladi.

### Lease: qulagan worker'dan himoya

Jobni olgan worker qulashi mumkin. Agar job shunchaki "running" bo'lib qolsa, uni hech kim qaytarib olmaydi. Shuning uchun claim `locked_until = now + lease` yozadi, va claim so'rovidagi ikkinchi shart `status = 'running' AND locked_until <= $1` lease tugagan jobni yana tayyor deb hisoblaydi. Bu usul visibility timeout deb ataladi. Bahosi: job bir martadan ko'p bajarilishi mumkin (qulagan worker yarim ish qilgan bo'lishi mumkin), ya'ni kafolat at-least-once. Exactly-once yo'q: handler idempotent yozilishi shart (80-dars).

### Fencing: eski urinish yangisini bosmasin

Lease tugadi, B jobni qayta oldi, ammo A (sekin, qulamagan) hali ishlayapti va tugatdi deb xabar beradi. Agar `Complete` faqat `id` bo'yicha ishlasa, A B'ning holatini bosib ketadi. `attempts` har claim'da oshgani uchun u fencing token vazifasini bajaradi: `Complete` va `Fail` `WHERE id = $1 AND status = 'running' AND attempts = $2` sharti bilan yoziladi va `RowsAffected()` bir bo'lmasa, urinish eskirgan deb xato qaytaradi. Namunadagi `leaseDemo` aynan shuni ko'rsatadi.

Muhim cheklov: fencing faqat jadvaldagi holatni himoya qiladi. A allaqachon tashqi API'ni chaqirgan bo'lsa (xat yuborgan), buni ortga qaytarib bo'lmaydi. Shu sababli idempotency kaliti (job id) tashqi chaqiruvlarga ham uzatilishi kerak.

### Qayta urinish va dead

Xatoda job `queued` ga qaytadi, `run_at = now + backoff(attempts)`. `attempts >= max_attempts` bo'lsa, job `dead` ga o'tadi va `last_error` saqlanadi. Cheksiz qayta urinish doimiy xatoli ("zaharli") jobni abadiy aylantiradi va worker vaqtini yeydi. `dead` holat esa tahlil va qo'lda qayta ishga tushirish imkonini beradi.

## Chuqurroq: store shartnomasi, worker va to'xtatish

### Bitta interface, ikkita realizatsiya

Navbat mantig'i `Store` interface'iga (Enqueue, Claim, Complete, Fail) tayanadi, bu 91-dars qoidasi. Xotiradagi `MemStore` va PostgreSQL uchun `SQLStore` bir xil shartnomani bajaradi. `MemStore` lokal ishlaydi va xatti-harakatni sinash imkonini beradi: lease, fencing, retry, dead. `SQLStore` ayni semantikani SQL bilan beradi, lekin bu kitobda u kompilyatsiya va `go vet` dan o'tgan, Postgres bo'lmagani uchun ishga tushirilmagan. Haqiqiy loyihada bir xil shartnoma sinovlari ikkala realizatsiyaga qarshi ishga tushiriladi (contract tests); `SQLStore` uchun ular integratsiya testi bo'ladi (82-dars).

### Worker va kontekst

`Run` `Workers` ta goroutine ishga tushiradi. Har biri tsiklda claim qiladi; job bo'lmasa `Poll` intervalida uxlaydi (kutish `ctx.Done()` bilan uziladi). Job bajarilganda `Timeout` kontekst bilan chaqiriladi, u lease'dan kichik bo'lishi kerak: aks holda handler hali ishlayotganda lease tugab, job ikkinchi worker'ga ketadi. Uzoq ishlar uchun lease'ni davriy yangilash (heartbeat) kerak; namunada u yo'q.

Natijani yozish (`Complete`/`Fail`) `context.WithoutCancel` bilan o'ralgan alohida timeout'li kontekstda bajariladi (Go 1.21). Sabab: to'xtatish paytida asosiy kontekst bekor bo'ladi, bajarilgan ish natijasi esa yozilishi kerak, aks holda job "running" holatida qoladi va lease tugagach qayta bajariladi. Bu 94-dars flush qoidasining davomi va 100 Go Mistakes'dagi kontekstni noto'g'ri uzatish xatosining teskari tomoni: bu yerda bekor qilishni ataylab uzamiz.

### To'xtatish

Kontekst bekor bo'lganda worker yangi job claim qilmaydi (`for ctx.Err() == nil`), lekin hozir bajarilayotgan jobni tugatib, natijasini yozadi; `Run` hamma worker'lar chiqqunga qadar kutadi. Qayta ishga tushirish xavfsiz: tugatilmagan joblar lease tugagach qaytadi.

### Soat manbai

Namunada `SQLStore` vaqtni ilova soatidan oladi (`s.Now()`), shuning uchun nusxalar soati bir-biridan farq qilsa, lease muddatlari buziladi. Mustahkamroq variant - vaqtni bazaning o'z soatidan olish (`now()` SQL ichida) va hamma nusxalar uchun yagona vaqt manbasiga ega bo'lish. Namunada ilova soati tanlandi, chunki shunda xotira realizatsiyasi bilan test qilinadi; bu murosa ochiq aytilishi kerak.

## Misol: navbat, worker va SQL adapteri

Shartnoma va xotiradagi realizatsiya (lease, fencing, retry va dead semantikasi):

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"sort"
	"sync"
	"time"
)

var ErrNoJob = errors.New("tayyor job yo'q")

type Job struct {
	ID          int64
	Kind        string
	Payload     []byte
	Attempts    int // Claim'dan keyin: shu urinish raqami (fencing token vazifasini ham bajaradi)
	MaxAttempts int
}

// Store - queue saqlash qatlami. Xotira va SQL realizatsiyalari bir xil shartnomani bajaradi.
type Store interface {
	Enqueue(ctx context.Context, kind string, payload []byte, maxAttempts int) (int64, error)
	// Claim tayyor jobni lease bilan band qiladi. Tayyor job bo'lmasa ErrNoJob.
	Claim(ctx context.Context, lease time.Duration) (Job, error)
	// Complete faqat jobni hozir ushlab turgan urinish (j.Attempts) uchun ishlaydi.
	Complete(ctx context.Context, j Job) error
	// Fail jobni retryAfter dan keyin qayta navbatga qo'yadi yoki urinishlar tugagan bo'lsa dead qiladi.
	Fail(ctx context.Context, j Job, cause error, retryAfter time.Duration) error
}

// --- xotiradagi realizatsiya ---

type row struct {
	Job
	status      string // queued, running, done, dead
	runAt       time.Time
	lockedUntil time.Time
	lastErr     string
}

type MemStore struct {
	mu   sync.Mutex
	now  func() time.Time
	next int64
	rows map[int64]*row
}

func NewMemStore(now func() time.Time) *MemStore {
	return &MemStore{now: now, rows: map[int64]*row{}}
}

func (m *MemStore) Enqueue(_ context.Context, kind string, payload []byte, maxAttempts int) (int64, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.next++
	m.rows[m.next] = &row{Job: Job{ID: m.next, Kind: kind, Payload: payload, MaxAttempts: maxAttempts}, status: "queued", runAt: m.now()}
	return m.next, nil
}

func (m *MemStore) Claim(_ context.Context, lease time.Duration) (Job, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	now := m.now()
	var best *row
	for _, r := range m.rows {
		ready := (r.status == "queued" && !r.runAt.After(now)) || (r.status == "running" && !r.lockedUntil.After(now))
		if ready && (best == nil || r.runAt.Before(best.runAt) || (r.runAt.Equal(best.runAt) && r.ID < best.ID)) {
			best = r
		}
	}
	if best == nil {
		return Job{}, ErrNoJob
	}
	best.status, best.lockedUntil = "running", now.Add(lease)
	best.Attempts++
	return best.Job, nil
}

func (m *MemStore) Complete(_ context.Context, j Job) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	r := m.rows[j.ID]
	if r == nil || r.status != "running" || r.Attempts != j.Attempts {
		return fmt.Errorf("job %d: lease boshqaga o'tgan", j.ID)
	}
	r.status = "done"
	return nil
}

func (m *MemStore) Fail(_ context.Context, j Job, cause error, retryAfter time.Duration) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	r := m.rows[j.ID]
	if r == nil || r.status != "running" || r.Attempts != j.Attempts {
		return fmt.Errorf("job %d: lease boshqaga o'tgan", j.ID)
	}
	r.lastErr = cause.Error()
	if r.Attempts >= r.MaxAttempts {
		r.status = "dead"
		return nil
	}
	r.status, r.runAt = "queued", m.now().Add(retryAfter)
	return nil
}

// Snapshot sinov va demo uchun: id bo'yicha tartiblangan holatlar.
func (m *MemStore) Snapshot() []string {
	m.mu.Lock()
	defer m.mu.Unlock()
	ids := make([]int64, 0, len(m.rows))
	for id := range m.rows {
		ids = append(ids, id)
	}
	sort.Slice(ids, func(i, j int) bool { return ids[i] < ids[j] })
	out := make([]string, 0, len(ids))
	for _, id := range ids {
		r := m.rows[id]
		out = append(out, fmt.Sprintf("#%d %-6s %-5s urinish=%d", r.ID, r.Kind, r.status, r.Attempts))
	}
	return out
}
```

Worker: claim, bajarish, natijani yozish:

```go
package main

import (
	"context"
	"errors"
	"sync"
	"time"
)

type Handler func(ctx context.Context, j Job) error

type Config struct {
	Workers int
	Poll    time.Duration
	Lease   time.Duration
	Timeout time.Duration // bitta job uchun; Lease'dan kichik bo'lishi kerak
	Backoff func(attempt int) time.Duration
}

// Run ctx bekor qilinguncha ishlaydi. Bekor qilinganda ishlayotgan joblar tugaguncha kutadi.
func Run(ctx context.Context, st Store, h Handler, cfg Config) {
	var wg sync.WaitGroup
	for range cfg.Workers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for ctx.Err() == nil {
				j, err := st.Claim(ctx, cfg.Lease)
				if errors.Is(err, ErrNoJob) {
					select {
					case <-time.After(cfg.Poll):
					case <-ctx.Done():
					}
					continue
				}
				if err != nil {
					time.Sleep(cfg.Poll) // DB xatosi: tezkor aylanib ketmaslik uchun
					continue
				}
				process(ctx, st, h, cfg, j)
			}
		}()
	}
	wg.Wait()
}

func process(ctx context.Context, st Store, h Handler, cfg Config, j Job) {
	jctx, cancel := context.WithTimeout(ctx, cfg.Timeout)
	err := h(jctx, j)
	cancel()
	// Natijani yozish ctx bekor bo'lgan bo'lsa ham bajarilishi kerak: WithoutCancel.
	wctx, wcancel := context.WithTimeout(context.WithoutCancel(ctx), 5*time.Second)
	defer wcancel()
	if err == nil {
		st.Complete(wctx, j)
		return
	}
	st.Fail(wctx, j, err, cfg.Backoff(j.Attempts))
}
```

PostgreSQL adapteri. U ayni shartnomani SQL bilan bajaradi. Fayl kompilyatsiya va vet'dan o'tgan, lekin ishga tushirilmagan; drayver import qilinmagan (`database/sql` drayverini, masalan pgx'ning stdlib ulagichini, ilova import qiladi va u sandbox'da yuklanmaydi):

```go
package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

// SQLStore PostgreSQL uchun. Bu fayl kompilyatsiya va vet'dan o'tgan, lekin Postgres bo'lmagani uchun ishga tushirilmagan.
type SQLStore struct {
	DB  *sql.DB
	Now func() time.Time
}

const schema = `
CREATE TABLE jobs (
  id           BIGSERIAL PRIMARY KEY,
  kind         TEXT        NOT NULL,
  payload      JSONB       NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'queued', -- queued | running | done | dead
  attempts     INT         NOT NULL DEFAULT 0,
  max_attempts INT         NOT NULL,
  run_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_until TIMESTAMPTZ,
  last_error   TEXT
);
CREATE INDEX jobs_ready ON jobs (run_at, id) WHERE status IN ('queued', 'running');`

const claimSQL = `
UPDATE jobs SET status = 'running', attempts = attempts + 1, locked_until = $2
WHERE id = (
  SELECT id FROM jobs
  WHERE (status = 'queued' AND run_at <= $1) OR (status = 'running' AND locked_until <= $1)
  ORDER BY run_at, id
  FOR UPDATE SKIP LOCKED
  LIMIT 1)
RETURNING id, kind, payload, attempts, max_attempts`

func (s SQLStore) Enqueue(ctx context.Context, kind string, payload []byte, maxAttempts int) (int64, error) {
	var id int64
	err := s.DB.QueryRowContext(ctx,
		`INSERT INTO jobs (kind, payload, max_attempts, run_at) VALUES ($1, $2, $3, $4) RETURNING id`,
		kind, payload, maxAttempts, s.Now()).Scan(&id)
	return id, err
}

func (s SQLStore) Claim(ctx context.Context, lease time.Duration) (Job, error) {
	now := s.Now()
	var j Job
	err := s.DB.QueryRowContext(ctx, claimSQL, now, now.Add(lease)).
		Scan(&j.ID, &j.Kind, &j.Payload, &j.Attempts, &j.MaxAttempts)
	if errors.Is(err, sql.ErrNoRows) {
		return Job{}, ErrNoJob
	}
	return j, err
}

func (s SQLStore) Complete(ctx context.Context, j Job) error {
	return s.expectOne(ctx, j.ID,
		`UPDATE jobs SET status = 'done', locked_until = NULL WHERE id = $1 AND status = 'running' AND attempts = $2`,
		j.ID, j.Attempts)
}

func (s SQLStore) Fail(ctx context.Context, j Job, cause error, retryAfter time.Duration) error {
	return s.expectOne(ctx, j.ID, `
UPDATE jobs SET
  status = CASE WHEN attempts >= max_attempts THEN 'dead' ELSE 'queued' END,
  run_at = $3, locked_until = NULL, last_error = $4
WHERE id = $1 AND status = 'running' AND attempts = $2`,
		j.ID, j.Attempts, s.Now().Add(retryAfter), cause.Error())
}

// expectOne so'rovni bajaradi va aynan bitta qator o'zgarganini tekshiradi:
// 0 qator - lease boshqa workerga o'tgan (yoki job yo'q).
func (s SQLStore) expectOne(ctx context.Context, id int64, q string, args ...any) error {
	res, err := s.DB.ExecContext(ctx, q, args...)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n != 1 {
		return fmt.Errorf("job %d: lease boshqaga o'tgan", id)
	}
	return nil
}
```

Demo: avval soxta soat bilan lease va fencing, keyin haqiqiy worker'lar:

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"
)

func main() {
	leaseDemo()
	workerDemo()
}

// leaseDemo: qulagan worker joblari lease tugagach boshqa workerga o'tadi (soxta soat bilan, deterministik).
func leaseDemo() {
	var mu sync.Mutex
	clock := time.Unix(1_700_000_000, 0)
	now := func() time.Time { mu.Lock(); defer mu.Unlock(); return clock }
	advance := func(d time.Duration) { mu.Lock(); clock = clock.Add(d); mu.Unlock() }

	ctx := context.Background()
	st := NewMemStore(now)
	st.Enqueue(ctx, "report", nil, 3)

	a, _ := st.Claim(ctx, 30*time.Second)
	fmt.Println("A oldi: urinish =", a.Attempts)
	_, err := st.Claim(ctx, 30*time.Second)
	fmt.Println("B darhol:", err)

	advance(31 * time.Second) // A qulab tushdi, lease tugadi
	b, _ := st.Claim(ctx, 30*time.Second)
	fmt.Println("B lease tugagach oldi: urinish =", b.Attempts)

	fmt.Println("A kech tugatmoqchi:", st.Complete(ctx, a))
	fmt.Println("B tugatdi:", st.Complete(ctx, b))
}

func workerDemo() {
	st := NewMemStore(time.Now)
	ctx, cancel := context.WithCancel(context.Background())
	for _, k := range []string{"ok", "ok", "flaky", "ok", "poison", "ok"} {
		st.Enqueue(ctx, k, nil, 4)
	}
	handler := func(ctx context.Context, j Job) error {
		switch j.Kind {
		case "flaky":
			if j.Attempts < 3 {
				return fmt.Errorf("vaqtincha xato (%d-urinish)", j.Attempts)
			}
		case "poison":
			return errors.New("doimiy xato")
		}
		return nil
	}
	done := make(chan struct{})
	go func() {
		Run(ctx, st, handler, Config{
			Workers: 3, Poll: 5 * time.Millisecond, Lease: time.Second, Timeout: 500 * time.Millisecond,
			Backoff: func(a int) time.Duration { return time.Duration(a) * 10 * time.Millisecond },
		})
		close(done)
	}()
	time.Sleep(400 * time.Millisecond)
	cancel()
	<-done
	for _, line := range st.Snapshot() {
		fmt.Println(line)
	}
}
```

Go 1.24.7, linux/amd64, `go run -race .`:

```text
A oldi: urinish = 1
B darhol: tayyor job yo'q
B lease tugagach oldi: urinish = 2
A kech tugatmoqchi: job 1: lease boshqaga o'tgan
B tugatdi: <nil>
#1 ok     done  urinish=1
#2 ok     done  urinish=1
#3 flaky  done  urinish=3
#4 ok     done  urinish=1
#5 poison dead  urinish=4
#6 ok     done  urinish=1
```

Qatorma-qator:

- `A oldi: urinish = 1`. B darhol claim qilsa `tayyor job yo'q`: lease hali amal qilmoqda.
- 31 soniya "o'tgach" B claim qildi va `urinish = 2`. A kech `Complete` chaqirsa, fencing xato beradi: `lease boshqaga o'tgan`. B tugatganda muvaffaqiyat.
- Worker demosida 6 job, 3 worker. `flaky` job 1 va 2 urinishda xato berib, 3-urinishda muvaffaqiyatli (`urinish=3`). `poison` job `max_attempts=4` ga yetib `dead` bo'ldi. Qolgan joblar birinchi urinishda `done`. Natija id bo'yicha saralanadi, shuning uchun worker'lar tartibidan qat'i nazar chiqish bir xil; dastur 6 marta ishga tushirilganda chiqish bir xil bo'ldi.

## Qachon qo'llamaslik kerak

- Yuqori hajmda (kuchli oqim, sekundiga minglab job) Postgres jadvali tez eskiradi: har job bir necha marta yangilanadi, bu jadvalda o'lik qatorlar va VACUUM yukini oshiradi (PostgreSQL hujjatiga ko'ra yangilangan yoki o'chirilgan qatorlarning eski versiyalarini VACUUM tozalaydi: Routine Vacuuming; ta'sir miqdorini o'z yukingizda o'lchang). Bunday hajm uchun maxsus broker (Kafka, NATS, Redis stream) ma'qul.
- Pub/sub va fan-out (bir voqea ko'p iste'molchiga) navbat jadvali uchun noqulay: u har job uchun bitta iste'molchi modeliga mo'ljallangan.
- Uzoq, ko'p bosqichli workflow'lar uchun (kutish, shartli tarmoqlanish, taymerlar) holat mashinasi yoki workflow dvigateli kerak; oddiy navbat bunga qurilmagan.
- Exactly-once kafolati yo'q. Handler idempotent bo'lmasa (to'lov, xat), takroriy bajarish zarar qiladi.
- Polling kechikish qo'shadi: job `Poll` intervali bilan topiladi. Bildirishnoma mexanizmlari (masalan, Postgres'ning LISTEN/NOTIFY: NOTIFY LISTEN qilgan klientlarga kanal bo'yicha xabar yuboradi, PostgreSQL hujjati) kechikishni kamaytirishi mumkin, lekin bu darsda ko'rilmagan va sinalmagan; kafolat va cheklovlarini hujjatdan o'qing.
- Worker'lar bazaga ulanishlarni ishlatadi. Ko'p worker va qisqa polling intervali ulanishlar pulini (78-dars) va bazani yuklaydi.

## Stack'da: Node.js bilan solishtirish

Node.js'da navbat odatda Redis va BullMQ bilan quriladi; Postgres asosidagi navbat kutubxonalari ham mavjud. G'oya bir xil: lease, qayta urinish, dead. Go'ning o'ziga xosligi - worker'lar jarayon ichidagi goroutine'lar, kontekst orqali tartibli to'xtash va bitta binary. Node'da worker odatda alohida jarayon va uni nazorat qilish tashqi vositaga tayanadi. Tranzaksion enqueue ikkala stekda ham bir xil ishlaydi: ORM/driver tranzaksiyasi ichida `INSERT INTO jobs` qilsangiz, job va biznes ma'lumoti birga commit bo'ladi. Go'da bu `tx.ExecContext` bilan bir qator: `Store.Enqueue` ga `*sql.Tx` qabul qiladigan variant qo'shish yetarli (namunada soddalik uchun `DB` ishlatilgan).

## Xulosa

- Postgres navbati tranzaksion enqueue beradi: job va biznes ma'lumoti birga commit yoki birga rollback bo'ladi; throughput uchun maxsus broker kuchliroq.
- Claim bitta atomik `UPDATE ... (SELECT ... FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING` bo'lsin; ikki bosqichli claim poyga beradi.
- Lease (visibility timeout) qulagan worker'dan himoya qiladi va kafolatni at-least-once qiladi; handler idempotent bo'lishi shart.
- `attempts` fencing token: `Complete/Fail` faqat joriy urinish uchun ishlaydi; `RowsAffected` bir bo'lmasa, urinish eskirgan.
- Qayta urinish `run_at` va backoff bilan, urinishlar tugagach `dead`; cheksiz qayta urinish yo'q.
- Natijani `context.WithoutCancel` bilan yozing va worker'ni kontekst bilan tartibli to'xtating; `SQLStore` bu kitobda ishga tushirilmagan, shartnoma sinovlarini haqiqiy Postgres'da bajaring.
