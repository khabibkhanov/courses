---
n: 78
slug: database-sql-pgx
title: "database/sql va pgx: pooling, tranzaksiya va context"
summary: "database/sql connection pool qanday ishlaydi va nega yopilmagan Rows havzani bo'g'adi, context bilan so'rov muddati, tranzaksiya yordamchisi (commit/rollback, asl xatoni saqlash), pgx/pgxpool sozlamalari va Postgres xato kodlari."
duration: 50
sources:
  - id: pkg-database-sql
    note: "sql.DB havza, SetMaxOpenConns/SetMaxIdleConns, Rows.Close va Rows.Err, ErrNoRows, BeginTx va TxOptions"
  - id: pgx
    note: "pgx v5.12.0: pgxpool.Config (MaxConns, MaxConnLifetime, MaxConnIdleTime), BeginTxFunc, CollectRows va RowToStructByName"
  - id: 100go
    note: "#78 \"Common SQL mistakes\" va #79 \"Not closing transient resources\" (sql.Rows ham)"
quiz:
  - q: "`sql.DB` nima?"
    options:
      - "Bitta ma'lumotlar bazasi ulanishi; goroutine'lar uni navbat bilan ishlatadi"
      - "Ulanishlar havzasi (pool) uchun xavfsiz bir vaqtda ishlatiladigan tutqich; odatda jarayon bo'yicha bitta yaratiladi va umr bo'yi qayta ishlatiladi"
      - "Har so'rovda yangi ulanish ochadigan yordamchi"
      - "Faqat tranzaksiyalar uchun mo'ljallangan obyekt"
    answer: 1
    explain: "sql.DB ko'p goroutine'dan bir vaqtda ishlatilishi uchun yozilgan va ichida ulanishlar havzasini boshqaradi. Har so'rovda sql.Open/Close qilish havzani yo'qqa chiqaradi. Lokal sinovda ikki so'rov ikki real ulanish ochdi va qayta ishlatdi."
  - q: "`MaxOpenConns=2` bilan ikki `Rows` yopilmay qoldi. Uchinchi `QueryContext(ctx100ms, ...)` nima beradi?"
    options:
      - "Yangi (uchinchi) ulanish ochib, so'rovni bajaradi"
      - "Darhol `sql.ErrConnDone` xatosini qaytaradi"
      - "Bo'sh ulanish kutadi va 100 ms dan keyin `context deadline exceeded` bilan tugaydi; Stats da WaitCount oshadi"
      - "Eng eski Rows'ni majburan yopadi"
    answer: 2
    explain: "Havza to'lganda chaqiruv bo'sh ulanishni kutadi, context tugasa kutish bekor bo'ladi. Lokal chiqish: 'context deadline exceeded', open=2 inUse=2, waitCount=1. Sabab: Rows.Close chaqirilmagan."
  - q: "`for rows.Next() { ... }` tugagach nega `rows.Err()` tekshiriladi?"
    options:
      - "Chunki Next() false qaytarishi ikki sababdan bo'lishi mumkin: qatorlar tugadi yoki o'qishda xato bo'ldi; farqni faqat Err() ko'rsatadi"
      - "Chunki Err() ulanishni havzaga qaytaradi"
      - "Chunki Err() Close() o'rniga ishlaydi"
      - "Tekshirish shart emas: Next() xatoda panic qiladi"
    answer: 0
    explain: "Next false qaytargach, iteratsiya normal tugaganmi yoki yarim yo'lda uzilganmi, Rows.Err() ga qarab bilinadi. Tekshirilmasa, qisman natija to'liq deb qabul qilinadi. Rows.Close esa alohida: ulanishni havzaga qaytarish uchun kerak (defer bilan)."
  - q: "Tranzaksiya yordamchisida `fn` xato qaytardi, so'ng `tx.Rollback()` ham xato berdi. Qaysi xatoni qaytarish to'g'ri?"
    options:
      - "Faqat rollback xatosi, chunki u keyin bo'lgan"
      - "Hech qaysini: xatolarni yutib yuborish kerak"
      - "Ikkalasini ham saqlash: `errors.Join(err, rbErr)`; shunda asl sabab `errors.Is` bilan topiladi"
      - "Faqat commit xatosi"
    answer: 2
    explain: "Asl xato (masalan 'omborda yetarli emas') chaqiruvchiga kerak, rollback xatosi esa qo'shimcha ma'lumot. errors.Join ikkalasini saqlaydi; lokal sinovda errors.Is(err, errStock) true bo'ldi."
  - q: "pgxpool da `MaxConns` ni ko'rsatmadingiz. Hujjatga ko'ra default nima?"
    options:
      - "Cheksiz"
      - "1"
      - "max(4, runtime.NumCPU())"
      - "100"
    answer: 2
    explain: "pgx v5 pgxpool.Config hujjati: MaxConns default max(4, runtime.NumCPU()); MaxConnLifetime 1 soat, MaxConnIdleTime 30 daqiqa. Pool kattaligini Postgres'ning max_connections ga va jami instance soniga qarab belgilang."
  - q: "`db.QueryRowContext(ctx, q).Scan(&id)` qator topmadi va `sql.ErrNoRows` qaytdi. Bu xatoni qanday ishlash to'g'ri?"
    options:
      - "Har doim 500 Internal Server Error"
      - "`errors.Is(err, sql.ErrNoRows)` bilan ajratib, 'topilmadi' (masalan 404) yoki bo'sh natija deb qayta ishlash; boshqa xatolar tizim xatosi"
      - "Xatoni e'tiborsiz qoldirish"
      - "So'rovni cheksiz qayta urinish"
    answer: 1
    explain: "ErrNoRows normal biznes holat (yozuv yo'q), infratuzilma xatosi emas. Uni errors.Is bilan tekshirib, domen xatosiga o'tkazing; chunki boshqa xatolarni (ulanish, timeout) 'topilmadi' deb yashirmaslik kerak."
task:
  title: "Rows oqishini to'g'rilash"
  prompt: |
    `firstOver` funksiyasi `sensors` jadvalidan birinchi `limit` dan katta ko'rsatkichni qaytaradi, lekin `Rows` ni yopmaydi va `rows.Err()` ni tekshirmaydi. `MaxOpenConns=2` bo'lgani uchun uchinchi chaqiruvdan keyin so'rovlar `context deadline exceeded` bilan to'xtaydi.

    Funksiyani to'g'rilang:
    - `defer rows.Close()` qo'shing;
    - sikl tugagach `rows.Err()` ni tekshiring;
    - kutilgan natija: to'rtala chaqiruv ham `qiymat=30 xato=<nil>`, oxirida `band ulanishlar: 0`.
  lang: go
  starter: |
    package main

    import (
        "context"
        "database/sql"
        "database/sql/driver"
        "errors"
        "fmt"
        "io"
        "time"
    )

    // Soxta driver: har so'rov 5 qator qaytaradi (1..5).
    type drv struct{}

    func (drv) Open(string) (driver.Conn, error)               { return conn{}, nil }
    func (d drv) Connect(context.Context) (driver.Conn, error) { return conn{}, nil }
    func (d drv) Driver() driver.Driver                        { return d }

    type conn struct{}

    func (conn) Prepare(string) (driver.Stmt, error) { return nil, errors.New("yo'q") }
    func (conn) Close() error                        { return nil }
    func (conn) Begin() (driver.Tx, error)           { return nil, errors.New("yo'q") }
    func (conn) QueryContext(context.Context, string, []driver.NamedValue) (driver.Rows, error) {
        return &rows{}, nil
    }

    type rows struct{ i int }

    func (*rows) Columns() []string { return []string{"fuel"} }
    func (*rows) Close() error      { return nil }
    func (r *rows) Next(dst []driver.Value) error {
        if r.i == 5 {
            return io.EOF
        }
        r.i++
        dst[0] = int64(r.i * 10)
        return nil
    }

    // firstOver birinchi `limit` dan katta datchik ko'rsatkichini qaytaradi.
    func firstOver(ctx context.Context, db *sql.DB, limit int) (int, error) {
        rows, err := db.QueryContext(ctx, "select fuel from sensors")
        if err != nil {
            return 0, err
        }
        for rows.Next() {
            var fuel int
            if err := rows.Scan(&fuel); err != nil {
                return 0, err
            }
            if fuel > limit {
                return fuel, nil
            }
        }
        return 0, sql.ErrNoRows
    }

    func main() {
        db := sql.OpenDB(drv{})
        defer db.Close()
        db.SetMaxOpenConns(2)

        for i := 1; i <= 4; i++ {
            // Dastlabki ikki chaqiruvda ctx bekor qilinmaydi; keyingilarida 100ms muddat bor.
            ctx, cancel := context.Background(), func() {}
            if i > 2 {
                ctx, cancel = context.WithTimeout(ctx, 100*time.Millisecond)
            }
            v, err := firstOver(ctx, db, 25)
            cancel()
            fmt.Printf("chaqiruv %d: qiymat=%d xato=%v\n", i, v, err)
        }
        fmt.Println("band ulanishlar:", db.Stats().InUse)
    }
  solution: |
    package main

    import (
        "context"
        "database/sql"
        "database/sql/driver"
        "errors"
        "fmt"
        "io"
        "time"
    )

    // Soxta driver: har so'rov 5 qator qaytaradi (1..5).
    type drv struct{}

    func (drv) Open(string) (driver.Conn, error)               { return conn{}, nil }
    func (d drv) Connect(context.Context) (driver.Conn, error) { return conn{}, nil }
    func (d drv) Driver() driver.Driver                        { return d }

    type conn struct{}

    func (conn) Prepare(string) (driver.Stmt, error) { return nil, errors.New("yo'q") }
    func (conn) Close() error                        { return nil }
    func (conn) Begin() (driver.Tx, error)           { return nil, errors.New("yo'q") }
    func (conn) QueryContext(context.Context, string, []driver.NamedValue) (driver.Rows, error) {
        return &rows{}, nil
    }

    type rows struct{ i int }

    func (*rows) Columns() []string { return []string{"fuel"} }
    func (*rows) Close() error      { return nil }
    func (r *rows) Next(dst []driver.Value) error {
        if r.i == 5 {
            return io.EOF
        }
        r.i++
        dst[0] = int64(r.i * 10)
        return nil
    }

    // firstOver birinchi `limit` dan katta datchik ko'rsatkichini qaytaradi.
    func firstOver(ctx context.Context, db *sql.DB, limit int) (int, error) {
        rows, err := db.QueryContext(ctx, "select fuel from sensors")
        if err != nil {
            return 0, err
        }
        defer rows.Close()
        for rows.Next() {
            var fuel int
            if err := rows.Scan(&fuel); err != nil {
                return 0, err
            }
            if fuel > limit {
                return fuel, nil
            }
        }
        if err := rows.Err(); err != nil {
            return 0, err
        }
        return 0, sql.ErrNoRows
    }

    func main() {
        db := sql.OpenDB(drv{})
        defer db.Close()
        db.SetMaxOpenConns(2)

        for i := 1; i <= 4; i++ {
            // Dastlabki ikki chaqiruvda ctx bekor qilinmaydi; keyingilarida 100ms muddat bor.
            ctx, cancel := context.Background(), func() {}
            if i > 2 {
                ctx, cancel = context.WithTimeout(ctx, 100*time.Millisecond)
            }
            v, err := firstOver(ctx, db, 25)
            cancel()
            fmt.Printf("chaqiruv %d: qiymat=%d xato=%v\n", i, v, err)
        }
        fmt.Println("band ulanishlar:", db.Stats().InUse)
    }
  solutionNotes: |
    - Funksiya ichida erta `return` bor: `rows` ochiq qolgan, ulanish havzaga qaytmaydi. `defer rows.Close()` har chiqish yo'lini yopadi.
    - Dastlabki ikki chaqiruvda `context.Background()` ishlatildi, shuning uchun ctx bekor qilinishi Rows'ni yopib qo'ymadi va oqish ko'rinib qoldi. Bekor qilinadigan context ko'pincha oqishni yashiradi, lekin havzani vaqtincha bo'g'adi.
    - `rows.Err()` Next() false qaytgandan keyin chaqiriladi: iteratsiya xato bilan uzilgan bo'lishi mumkin.
    - Lokal tekshiruv: starter 3 va 4 chaqiruvda `context deadline exceeded` va InUse=2 berdi; yechimda hammasi muvaffaqiyatli, InUse=0. Soxta driver ishlatildi, haqiqiy Postgres emas.
  checklist:
    - "`defer rows.Close()` so'rovdan keyin darhol qo'yilgan"
    - "`rows.Err()` sikldan keyin tekshiriladi"
    - "To'rtala chaqiruv muvaffaqiyatli, `InUse` oxirida 0"
    - "Funksiyadagi barcha chiqish yo'llari ulanishni qaytaradi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Ma'lumotlar bazasiga ulanish "bir qator kod" bo'lib ko'rinadi, lekin ishlab chiqarishdagi eng ko'p uchraydigan to'xtashlarning manbai shu. Odatiy holat: yuk oshgach servis sekinlashadi, so'ng hamma so'rov osilib qoladi. Baza sog'lom, CPU bo'sh, lekin ilova ichidagi havzada bo'sh ulanish yo'q: kimdir `Rows` ni yopmagan, kimdir tranzaksiyani commit/rollback qilmagan, kimdir `context` bermagan. 100 Go Mistakes kitobida bu #78 (SQL ning umumiy xatolari) va #79 (vaqtinchalik resurslarni yopmaslik, `sql.Rows` ham shu qatorda) sifatida keladi.

Node.js'da `pg` kutubxonasi `Pool` beradi va `client.release()` ni unutish xuddi shu natijani beradi. Go'da farq shuki, `database/sql` havzani standart qiladi va uni ko'rinmas boshqaradi: `*sql.DB` bitta ulanish emas, ulanishlar havzasi. Bu darsda havzaning xatti-harakatini real sonlar bilan ko'ramiz, tranzaksiya yordamchisini yozamiz va `pgx`ning farqlarini ko'rib chiqamiz.

Sandbox'da Postgres yo'q, shuning uchun mexanizm `database/sql/driver` interfeysi bilan yozilgan soxta driver ustida ko'rsatiladi: u haqiqiy `database/sql` havzasi bilan ishlaydi, faqat ma'lumotlar soxta. pgx kodi esa hujjatdagi API'ga tayanadi va kompilyatsiya qilinmagan.

## Asosiy g'oya

### sql.DB: havza, ulanish emas

Connection pool (ulanishlar havzasi) tayyor ulanishlarni saqlab, har so'rovda yangi ulanish ochish xarajatidan qutqaradi: so'rov bo'sh ulanishni oladi va tugagach qaytaradi.

`sql.Open` ulanish ochmaydi; u havzani yaratadi. Ulanishlar kerak bo'lganda ochiladi. `*sql.DB` ko'p goroutine'dan xavfsiz ishlatiladi va umr bo'yi bitta yaratiladi. Havza to'rtta sozlama bilan boshqariladi:

- `SetMaxOpenConns(n)`: bir vaqtda ochiq ulanishlar chegarasi (default cheksiz);
- `SetMaxIdleConns(n)`: bo'sh turgan ulanishlar soni (default 2);
- `SetConnMaxLifetime(d)`: ulanishning umr bo'yi chegarasi (balansirovshchik va failover uchun);
- `SetConnMaxIdleTime(d)`: bo'sh turgan ulanish qancha yashashi.

`MaxOpenConns` bo'lmasa, yuk ostida havza bazaning `max_connections` chegarasigacha ulanish ochadi va baza o'zi yiqiladi. Uni bazaning sig'imiga va instance'lar soniga qarab belgilang.

### Havzani kuzatish: db.Stats

`db.Stats()` havzaning holatini beradi: `OpenConnections`, `InUse`, `Idle`, `WaitCount` (ulanish kutgan chaqiruvlar soni) va `WaitDuration` (jami kutish vaqti). Bu to'rtta son havza muammosini ilovadagi muammodan ajratadi: `InUse` doim chegaraga teng va `WaitCount` o'sib borsa, havza bo'g'ilgan; bu holatda bazani emas, ilovadagi oqishni (yopilmagan `Rows`, tugallanmagan tranzaksiya) yoki chegarani tekshiring. Ularni metrikaga chiqarish ishlab chiqarishdagi eng arzon himoya. `PingContext` esa ulanish borligini tekshiradi; `sql.Open` xato bermagani bazaga ulanish mumkinligini anglatmaydi, shuning uchun ishga tushganda bir marta ping qilib, readiness tekshiruviga ulash foydali.

`SetConnMaxLifetime` ning ma'nosi: balansirovshchik yoki failover ortida uzoq yashovchi ulanish eski serverga yopishib qolishi mumkin, umr chegarasi esa ulanishlarni vaqti-vaqti bilan yangilab turadi. Juda qisqa qiymat esa doimiy qayta ulanish xarajatini beradi; odatda daqiqalar o'lchovida qo'yiladi.

### Oqish: yopilmagan Rows havzani bo'g'adi

`QueryContext` `*sql.Rows` qaytaradi va ulanishni **ushlab turadi**, `Rows` yopilgunga (yoki sikl oxirigacha o'qilib, Next false qaytarmaguncha) qadar. Quyidagi dastur `MaxOpenConns=2` qilib, ikki `Rows` ni ochiq qoldiradi va uchinchi so'rovni 100 ms muddat bilan yuboradi:

```go
package main

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"errors"
	"fmt"
	"io"
	"sync/atomic"
	"time"
)

// fakeDriver faqat pool xatti-harakatini ko'rsatish uchun: ulanishlarni sanaydi.
type fakeDriver struct{ opened, closed atomic.Int32 }

func (d *fakeDriver) Open(string) (driver.Conn, error) {
	d.opened.Add(1)
	return &fakeConn{d: d}, nil
}

type fakeConn struct{ d *fakeDriver }

func (c *fakeConn) Prepare(string) (driver.Stmt, error) { return nil, errors.New("qo'llanmaydi") }
func (c *fakeConn) Close() error                        { c.d.closed.Add(1); return nil }
func (c *fakeConn) Begin() (driver.Tx, error)           { return nil, errors.New("qo'llanmaydi") }

func (c *fakeConn) QueryContext(ctx context.Context, q string, _ []driver.NamedValue) (driver.Rows, error) {
	if q == "bo'sh" {
		return &fakeRows{n: 0}, nil
	}
	return &fakeRows{n: 3}, nil
}

type fakeRows struct{ n, i int }

func (r *fakeRows) Columns() []string { return []string{"vehicle_id"} }
func (r *fakeRows) Close() error      { return nil }
func (r *fakeRows) Next(dest []driver.Value) error {
	if r.i >= r.n {
		return io.EOF
	}
	r.i++
	dest[0] = int64(r.i)
	return nil
}

func stats(label string, db *sql.DB) {
	s := db.Stats()
	fmt.Printf("%-34s open=%d inUse=%d idle=%d waitCount=%d\n", label, s.OpenConnections, s.InUse, s.Idle, s.WaitCount)
}

func main() {
	drv := &fakeDriver{}
	db := sql.OpenDB(dbConnector{drv})
	defer db.Close()
	db.SetMaxOpenConns(2)
	db.SetMaxIdleConns(2)

	ctx := context.Background()
	// Ikkita Rows ochiq qoladi (Close chaqirilmaydi): har biri bitta ulanishni ushlab turadi.
	leak1, _ := db.QueryContext(ctx, "select id from vehicles")
	leak2, _ := db.QueryContext(ctx, "select id from vehicles")
	stats("ikki Rows ochiq:", db)

	short, cancel := context.WithTimeout(ctx, 100*time.Millisecond)
	defer cancel()
	_, err := db.QueryContext(short, "select id from vehicles")
	fmt.Println("uchinchi so'rov:", err)
	stats("kutish tugagach:", db)

	leak1.Close()
	rows, err := db.QueryContext(ctx, "select id from vehicles")
	fmt.Println("Rows yopilgach: xato =", err)
	for rows.Next() {
		var id int
		rows.Scan(&id)
	}
	rows.Close()
	leak2.Close()
	stats("hammasi yopilgach:", db)
	fmt.Println("haqiqiy ulanishlar ochildi:", drv.opened.Load())

	var id int
	err = db.QueryRowContext(ctx, "bo'sh").Scan(&id)
	fmt.Println("QueryRow, qator yo'q:", err, "| ErrNoRows:", errors.Is(err, sql.ErrNoRows))
}

type dbConnector struct{ d *fakeDriver }

func (c dbConnector) Connect(context.Context) (driver.Conn, error) { return c.d.Open("") }
func (c dbConnector) Driver() driver.Driver                        { return c.d }
```

```text
ikki Rows ochiq:                   open=2 inUse=2 idle=0 waitCount=0
uchinchi so'rov: context deadline exceeded
kutish tugagach:                   open=2 inUse=2 idle=0 waitCount=1
Rows yopilgach: xato = <nil>
hammasi yopilgach:                 open=2 inUse=0 idle=2 waitCount=1
haqiqiy ulanishlar ochildi: 2
QueryRow, qator yo'q: sql: no rows in result set | ErrNoRows: true
```

Natijadan:

- Ikki ochiq `Rows` -> `inUse=2`, bo'sh ulanish yo'q.
- Uchinchi so'rov yangi ulanish ochmadi (chegara 2), kutdi va `context deadline exceeded` oldi; `waitCount=1`.
- Birinchi `Rows` yopilgach, keyingi so'rov muvaffaqiyatli bo'ldi, ya'ni ulanish havzaga qaytdi va qayta ishlatildi.
- Butun vaqt davomida faqat **2** haqiqiy ulanish ochildi.
- `QueryRowContext(...).Scan` qator topmaganda `sql.ErrNoRows` qaytardi va `errors.Is` bilan ajratildi.

Qoidalar: `QueryContext` dan keyin darhol `defer rows.Close()`; sikl tugagach `rows.Err()` tekshiriladi (Next false qaytishi qatorlar tugaganini ham, o'qish xatosini ham bildiradi); bir qator kerak bo'lsa `QueryRowContext` (u o'zi yopadi); natijani kerak emas bo'lsa `ExecContext`.

### Context: har chaqiruvda

Hamma metodning `Context` varianti bor (`QueryContext`, `ExecContext`, `BeginTx`, `PingContext`). Context muddati ikki narsani bekor qiladi: bazadagi so'rovni (driver qo'llab-quvvatlasa) va havzadagi **kutishni** (yuqoridagi misol). Qoidalar: so'rov kontekstini HTTP so'rovdan oling (`r.Context()`), shunda mijoz ketsa so'rov to'xtaydi; har chaqiruvga o'z muddatini qo'ying; fon ishlari uchun alohida kontekst. Kontekstsiz variantlar (`Query`, `Exec`) faqat tez skriptlar uchun.

### Tranzaksiya yordamchisi

Qo'lda `Begin` / `Commit` / `Rollback` ko'p yo'l hosil qiladi va biri unutilsa ulanish tranzaksiyada qotib qoladi. Odat: bitta yordamchi funksiya. Quyidagisi `sql.DB` ustida yozilgan, jurnal yozuvchi soxta driver bilan sinalgan:

```go
package main

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"errors"
	"fmt"
)

// Tx amallarini jurnalga yozadigan soxta driver.
type logDriver struct{ journal *[]string }

func (d logDriver) Open(string) (driver.Conn, error) { return &logConn{d.journal}, nil }
func (d logDriver) Connect(context.Context) (driver.Conn, error) {
	return &logConn{d.journal}, nil
}
func (d logDriver) Driver() driver.Driver { return d }

type logConn struct{ j *[]string }

func (c *logConn) Prepare(string) (driver.Stmt, error) { return nil, errors.New("qo'llanmaydi") }
func (c *logConn) Close() error                        { return nil }
func (c *logConn) Begin() (driver.Tx, error) {
	return c.BeginTx(context.Background(), driver.TxOptions{})
}
func (c *logConn) BeginTx(_ context.Context, o driver.TxOptions) (driver.Tx, error) {
	*c.j = append(*c.j, fmt.Sprintf("BEGIN (isolation=%d)", o.Isolation))
	return &logTx{c.j}, nil
}
func (c *logConn) ExecContext(_ context.Context, q string, _ []driver.NamedValue) (driver.Result, error) {
	*c.j = append(*c.j, "EXEC "+q)
	return driver.RowsAffected(1), nil
}

type logTx struct{ j *[]string }

func (t *logTx) Commit() error   { *t.j = append(*t.j, "COMMIT"); return nil }
func (t *logTx) Rollback() error { *t.j = append(*t.j, "ROLLBACK"); return nil }

// withTx: fn xato qaytarsa yoki panic qilsa rollback, aks holda commit.
func withTx(ctx context.Context, db *sql.DB, opts *sql.TxOptions, fn func(*sql.Tx) error) (err error) {
	tx, err := db.BeginTx(ctx, opts)
	if err != nil {
		return err
	}
	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback()
			panic(p)
		}
		if err != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				err = errors.Join(err, rbErr)
			}
		}
	}()
	if err = fn(tx); err != nil {
		return err
	}
	return tx.Commit()
}

func main() {
	var journal []string
	db := sql.OpenDB(logDriver{&journal})
	defer db.Close()
	ctx := context.Background()

	show := func(title string, err error) {
		fmt.Printf("%s: xato=%v\n", title, err)
		for _, l := range journal {
			fmt.Println("   ", l)
		}
		journal = journal[:0]
	}

	err := withTx(ctx, db, nil, func(tx *sql.Tx) error {
		_, err := tx.ExecContext(ctx, "insert order")
		return err
	})
	show("muvaffaqiyatli", err)

	errStock := errors.New("omborda yetarli emas")
	err = withTx(ctx, db, &sql.TxOptions{Isolation: sql.LevelSerializable}, func(tx *sql.Tx) error {
		tx.ExecContext(ctx, "insert order")
		return errStock
	})
	show("xato bilan", err)
	fmt.Println("asl xato saqlangan:", errors.Is(err, errStock))
}
```

```text
muvaffaqiyatli: xato=<nil>
    BEGIN (isolation=0)
    EXEC insert order
    COMMIT
xato bilan: xato=omborda yetarli emas
    BEGIN (isolation=6)
    EXEC insert order
    ROLLBACK
asl xato saqlangan: true
```

Mexanika:

- `fn` xato qaytarsa yoki panic qilsa `Rollback`; aks holda `Commit`.
- Rollback xatosi bo'lsa `errors.Join` bilan asl xatoga biriktiriladi: `errors.Is(err, errStock)` hamon true (lokal chiqishda "asl xato saqlangan: true").
- Panic qayta tashlanadi (yutilmaydi).
- `sql.TxOptions{Isolation: sql.LevelSerializable}` driverga izolyatsiya darajasini uzatadi (soxta driver `isolation=6` yozdi).
- Tranzaksiya ichida **faqat `tx`** ishlatiladi, `db` emas: `db` boshqa ulanishdan ishlaydi va tranzaksiya doirasidan chiqib ketadi.

## Chuqurroq: pgx va pgxpool

`database/sql` umumiy interfeys, pgx esa Postgres'ga xos tabiiy driver: Postgres turlari (massiv, jsonb, UUID), `COPY`, `LISTEN/NOTIFY` va batch'larni qo'llab-quvvatlaydi. `pgxpool` o'zining havzasi. Quyidagi kod pgx v5 hujjatiga tayanadi va sandbox'da **kompilyatsiya qilinmagan** (modul yuklanmaydi):

```go
// pgx v5 (kompilyatsiya qilinmagan)
cfg, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URL"))
if err != nil {
	return err
}
cfg.MaxConns = 20
cfg.MaxConnLifetime = 30 * time.Minute
cfg.MaxConnIdleTime = 5 * time.Minute

pool, err := pgxpool.NewWithConfig(ctx, cfg)
if err != nil {
	return err
}
defer pool.Close()

type Vehicle struct {
	ID   int64  `db:"id"`
	Name string `db:"name"`
}

rows, err := pool.Query(ctx, "select id, name from vehicles where fleet_id = $1", fleetID)
if err != nil {
	return err
}
vs, err := pgx.CollectRows(rows, pgx.RowToStructByName[Vehicle]) // Close va Err ichida
if err != nil {
	return err
}

err = pgx.BeginTxFunc(ctx, pool, pgx.TxOptions{IsoLevel: pgx.Serializable}, func(tx pgx.Tx) error {
	_, err := tx.Exec(ctx, "update stock set qty = qty - $1 where sku = $2", n, sku)
	return err
})
```

Eslatmalar (pgx hujjati bo'yicha):

- `pgxpool.Config` da `MaxConns` default `max(4, runtime.NumCPU())`, `MaxConnLifetime` 1 soat, `MaxConnIdleTime` 30 daqiqa. Default'larga ishonmang, o'zingiz belgilang.
- `pgx.CollectRows` + `RowToStructByName` qatorlarni struct'ga yig'ib, `Rows` ni o'zi yopadi va `Err()` ni qaytaradi; qo'lda `Next/Scan` siklining ikkita odatiy xatosini yo'q qiladi. Bir qator uchun `CollectOneRow`.
- `pgx.BeginTxFunc` yordamchimizning analogi: funksiya xato bersa rollback, aks holda commit.
- Postgres xatolari `*pgconn.PgError` bo'lib keladi: `errors.As` bilan ochiladi, `Code` maydoni SQLSTATE: `23505` (unique_violation, takror kalit), `40001` (serialization_failure, tranzaksiyani qayta urinish kerak). `40001` da butun tranzaksiyani qayta bajarish to'g'ri, faqat oxirgi so'rovni emas.
- Statement keshlash va PgBouncer: transaction pooling rejimida prepared statement'lar muammo tug'dirishi mumkin; pgx hujjatidagi `QueryExecMode` sozlamasiga qarang.

## Misol: qayta urinadigan tranzaksiya

Serializable izolyatsiyada konflikt normal holat. Yordamchini o'rab, `40001` da cheklangan marta qayta urinish mumkin (psevdokod asosan 73-darsdagi retry g'oyasi):

```go
// kompilyatsiya qilinmagan: pgconn ga bog'liq
func withRetry(ctx context.Context, attempts int, fn func() error) error {
	var err error
	for i := 0; i < attempts; i++ {
		if err = fn(); err == nil {
			return nil
		}
		var pg *pgconn.PgError
		if !errors.As(err, &pg) || pg.Code != "40001" {
			return err // boshqa xato: qayta urinmaymiz
		}
		select {
		case <-time.After(time.Duration(i+1) * 20 * time.Millisecond):
		case <-ctx.Done():
			return ctx.Err()
		}
	}
	return err
}
```

Qoida: faqat idempotent yoki to'liq rollback bo'lgan tranzaksiyani qayta urining; tashqi dunyoga ta'sir qilgan (email, HTTP) amalni tranzaksiya ichida bajarmang, chunki qayta urinish uni ikki marta bajaradi (80-darsdagi outbox shu muammoni hal qiladi).

Topshiriqdagi funksiya ham shu darsning asosiy xatosini ko'rsatadi: boshlang'ich versiya:

```text
chaqiruv 1: qiymat=30 xato=<nil>
chaqiruv 2: qiymat=30 xato=<nil>
chaqiruv 3: qiymat=0 xato=context deadline exceeded
chaqiruv 4: qiymat=0 xato=context deadline exceeded
band ulanishlar: 2
```

To'g'rilangan versiya:

```text
chaqiruv 1: qiymat=30 xato=<nil>
chaqiruv 2: qiymat=30 xato=<nil>
chaqiruv 3: qiymat=30 xato=<nil>
chaqiruv 4: qiymat=30 xato=<nil>
band ulanishlar: 0
```

## Qachon qo'llamaslik kerak

- **ORM har doim kerak deb o'ylamang**: oddiy CRUD uchun `database/sql` yoki pgx + qo'lda SQL aniq va tez. ORM (yoki `sqlc` kabi generator) katta sxema va ko'p so'rov bo'lganda ma'noli; kod generatori qo'lda yozilgan Scan xatolarini kamaytiradi.
- **Katta `MaxOpenConns`**: "ko'proq ulanish tezroq" emas. Postgres uchun ulanish og'ir (jarayon), ortiqcha ulanish kontekst almashinuvini oshiradi. 20 instance x 50 ulanish = 1000 ulanish bazani bo'g'adi; PgBouncer yoki kichik havza ko'pincha yaxshiroq.
- **Uzoq tranzaksiyalar**: tranzaksiya ichida tarmoq chaqiruvi yoki foydalanuvchi kutishi qulflarni uzoq ushlaydi va havzani bo'g'adi. Tranzaksiya qisqa va faqat ma'lumotlar bilan ishlasin.
- **`SELECT *` va `Scan` tartibiga tayanish**: ustunlar o'zgarsa sinadi; ustunlarni aniq yozing yoki `RowToStructByName` kabi nom bo'yicha moslashdan foydalaning.
- **Kontekstsiz chaqiruvlar**: yuqori yuklangan servisda cheksiz kutish zanjirli to'xtashga olib keladi.
- **Havzani sinov uchun yangidan yaratish**: har testda ulanish ochish sekin; umumiy havza yoki tranzaksiya ichida rollback qiluvchi test yordamchisi ishlating.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da `pg.Pool` va `pool.query()` o'zi ulanishni qaytaradi, lekin `pool.connect()` bilan olingan `client.release()` ni unutish xuddi Go'dagi `Rows.Close` unutilishiga teng. Node'da so'rov bekor qilish (`AbortController`) ko'pincha qo'lda; Go'da `context` har metodda bor. Go'da qo'shimcha xavf: `*sql.DB` ni qiymat sifatida nusxalash yoki har so'rovda `sql.Open` chaqirish; havza umr bo'yi bitta bo'lishi kerak.

Servis uchun andoza:

- Bitta `*sql.DB` yoki `*pgxpool.Pool`, `main` da yaratilib, bog'liqlik sifatida uzatiladi.
- `MaxOpenConns`, `ConnMaxLifetime`, `ConnMaxIdleTime` aniq belgilangan; qiymatlar `max_connections` dan hisoblangan.
- `QueryContext` dan keyin `defer rows.Close()`, sikldan keyin `rows.Err()`; yoki `pgx.CollectRows`.
- Tranzaksiya faqat yordamchi orqali; ichida faqat `tx`.
- `sql.ErrNoRows` va `PgError` kodlari domen xatolariga bitta joyda o'tkaziladi.
- Metrika: `db.Stats()` dagi `InUse`, `WaitCount`, `WaitDuration` monitoringga chiqariladi; `WaitCount` o'sishi havza bo'g'ilayotganining birinchi belgisi.

## Xulosa

- `*sql.DB` ulanishlar havzasi: bir marta yaratiladi, ko'p goroutine'dan ishlatiladi; sozlamalar (`MaxOpenConns`, idle, lifetime) aniq belgilanadi.
- Yopilmagan `Rows` ulanishni ushlab turadi. Lokal sinovda ikki ochiq `Rows` havzani to'ldirdi va uchinchi so'rov `context deadline exceeded` oldi. Davo: `defer rows.Close()` va `rows.Err()`.
- Har chaqiruvga `Context`; muddat ham so'rovni, ham havzadagi kutishni bekor qiladi.
- Tranzaksiya yordamchisi: xato/panic -> rollback, asl xato `errors.Join` bilan saqlanadi, ichida faqat `tx`.
- pgx/pgxpool: default `MaxConns = max(4, NumCPU)`, `CollectRows` va `BeginTxFunc` oqishlarni kamaytiradi, `PgError` kodlari (`23505`, `40001`) bo'yicha ishlang. pgx kodi bu darsda kompilyatsiya qilinmagan.
