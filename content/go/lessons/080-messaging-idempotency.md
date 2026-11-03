---
n: 80
slug: messaging-idempotency
title: "Messaging: at-least-once, idempotency va outbox"
summary: "Xabar yetkazish kafolatlari (at-most-once, at-least-once), nega ack yo'qolsa ta'sir ikki marta bo'ladi, idempotent iste'molchi va idempotency key, transactional outbox, errgroup bilan iste'molchi ishchilari va graceful shutdown."
duration: 50
sources:
  - id: 100go
    note: "#61 \"Propagating an inappropriate context\" va #62 \"Starting a goroutine without knowing when to stop it\": iste'molchi goroutine'lari va context"
  - id: pkg-context
    note: "context.Context: bekor qilish va muddat iste'molchi sikli hamda handler'ga uzatiladi"
  - id: x-errgroup
    note: "golang.org/x/sync/errgroup: Group, WithContext, Go, Wait, SetLimit"
quiz:
  - q: "Broker xabarni iste'molchiga berdi, iste'molchi uni qayta ishladi, lekin ack yuborishdan oldin yiqildi. At-least-once broker nima qiladi va oqibati nima?"
    options:
      - "Xabarni yo'qotadi, chunki ack kelmadi"
      - "Ack kelmadi deb hisoblab xabarni qayta yetkazadi; handler idempotent bo'lmasa ta'sir ikki marta bo'ladi (lokal modelda balans 100 o'rniga 200)"
      - "Xabarni darhol o'chiradi va ikkinchi marta yubormaydi"
      - "Iste'molchini avtomatik tiklaydi va ta'sirni bekor qiladi"
    answer: 1
    explain: "At-least-once: xabar kamida bir marta yetkaziladi, ack kelmasa qayta yuboriladi. Lokal modelda oddiy iste'molchi balansi 200 bo'ldi (100 ikki marta qo'llandi), xabar ID'si bo'yicha idempotent iste'molchi esa 100 saqladi."
  - q: "Quyidagilardan qaysi biri xabar iste'molchisini idempotent qiladi?"
    options:
      - "Handler'ni tezroq ishlaydigan qilish"
      - "Ack'ni qayta ishlashdan oldin yuborish"
      - "Xabarning noyob ID'sini saqlab, allaqachon qo'llangan bo'lsa ta'sirni takrorlamaslik; ID tekshiruvi va ta'sir bitta tranzaksiyada bo'lishi kerak"
      - "Xabarlarni faqat bitta goroutine'da qayta ishlash"
    answer: 2
    explain: "Idempotentlik: bir xil xabar ikki marta kelsa ham natija bir marta qo'llangandek. Tekshiruv (processed[ID]) va ta'sir (balans) bitta atomik bosqichda bo'lmasa, orada yiqilish yoki parallel qayta yetkazish yana ikki marta qo'llaydi."
  - q: "Buyurtma bazaga yozildi, keyin `broker.Publish(event)` chaqirilishidan oldin servis yiqildi. Bu qaysi muammo va transactional outbox uni qanday hal qiladi?"
    options:
      - "Bu muammo emas, broker o'zi xabarni tiklaydi"
      - "Dual write: baza va broker ikki alohida tizim, ularga atomik yozib bo'lmaydi. Outbox hodisani buyurtma bilan BIR tranzaksiyada bazaga yozadi; alohida relay uni brokerga yuboradi"
      - "Outbox faqat brokerning tezligini oshiradi"
      - "Outbox bazani almashtirib, faqat brokerga yozadi"
    answer: 1
    explain: "Baza va brokerga ketma-ket yozish dual write: biri o'tib, ikkinchisi o'tmasligi mumkin. Outbox hodisani buyurtma bilan bir tranzaksiyada saqlaydi, shuning uchun ikkalasi birga bor yoki birga yo'q; relay keyin yuboradi."
  - q: "Outbox relay xabarni brokerga yubordi, lekin `Sent` belgisini qo'yishdan oldin yiqildi. Qayta ishga tushgach nima bo'ladi (lokal model)?"
    options:
      - "Xabar yo'qoladi"
      - "Relay xabarni yana yuboradi: brokerda 2 nusxa; shuning uchun iste'molchi idempotent bo'lishi shart (modelda ta'sir 250 bir marta qo'llandi)"
      - "Broker ikkinchi nusxani avtomatik rad etadi"
      - "Buyurtma bekor qilinadi"
    answer: 1
    explain: "Outbox yetkazishni at-least-once qiladi: yo'qotish yo'q, lekin takror mumkin. Lokal modelda brokerda 2 nusxa bo'ldi, idempotent iste'molchi ta'sirni (250) bir marta qo'lladi. Outbox + idempotent iste'molchi birgalikda 'effectively once' beradi."
  - q: "Mijoz to'lov so'rovini tarmoq xatosidan keyin 20 marta qayta yubordi. Idempotency key'siz server nima qiladi va key bilan nima o'zgaradi (topshiriq)?"
    options:
      - "Key'siz 20 marta yechadi (5100 ni ko'rdik); key bilan birinchi natija saqlanadi va takrorlarga o'sha kvitansiya qaytariladi, yechish bir marta"
      - "Key'siz ham bir marta yechadi, chunki Mutex bor"
      - "Key bilan server har bir so'rovni rad etadi"
      - "Key faqat log uchun"
    answer: 0
    explain: "Topshiriq starter'ida 20 ta qayta urinish 20 ta kvitansiya va ortiqcha yechish berdi (5100). Yechimda key bo'yicha natija saqlandi: 1 ta kvitansiya, jami 350. Mutex faqat ma'lumot poygasini oldini oladi, mantiqiy takrorni emas."
  - q: "Iste'molchi sikli `for { msg := receive(); handle(msg) }` ko'rinishida. Graceful shutdown uchun 100 Go Mistakes #62 dan nimani qo'llaymiz?"
    options:
      - "Goroutine'ni `go` bilan ishga tushirib, unutib yuborish"
      - "`os.Exit` ni chaqirish"
      - "Sikl `context` ni kuzatadi (ctx.Done()), `errgroup.Wait()` goroutine'larni kutadi: ketayotgan xabar tugagach to'xtaymiz, yarim qoldirmaymiz"
      - "Sikl ichida `time.Sleep` qo'yish"
    answer: 2
    explain: "#62: goroutine qachon to'xtashini bilmay ishga tushirmang. Sikl ctx.Done() ni tekshiradi, errgroup.Wait() hamma ishchi tugashini kutadi. Shunda deploy paytida xabar yarim ishlanib qolmaydi va ack yuboriladi."
task:
  title: "Idempotency key bilan to'lov"
  prompt: |
    `Payments.Charge` mijoz qayta yuborgan so'rovlarni ham yangi to'lov deb hisoblaydi: bir xil `key` bilan 20 marta chaqirilsa, 20 marta yechadi va 20 ta kvitansiya qaytaradi.

    `Charge` ni idempotent qiling:
    - bir xil `key` bilan takror chaqiruv birinchi chaqiruvdagi kvitansiyani qaytarsin va yangi yechish bo'lmasin;
    - boshqa `key` alohida yechilsin;
    - tekshiruv va yozish bitta `Lock` ichida bo'lsin (`go run -race` toza).

    Kutilgan natija: `yechilgan jami: 350`, `A buyurtma uchun turli kvitansiyalar: 1`, `boshqa kalit alohida yechildi: true`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sync"
    )

    // Payments to'lovlarni qabul qiladi. Mijoz tarmoq xatosidan keyin so'rovni
    // qayta yuboradi, shuning uchun bir xil Charge bir necha marta kelishi mumkin.
    type Payments struct {
        mu      sync.Mutex
        charged int // jami yechilgan summa
        seq     int
    }

    // Charge idempotency kaliti bo'yicha bir marta yechadi; takror chaqiruv
    // birinchi chaqiruvdagi kvitansiyani qaytaradi.
    func (p *Payments) Charge(key string, amount int) string {
        p.mu.Lock()
        defer p.mu.Unlock()
        p.seq++
        p.charged += amount
        return fmt.Sprintf("rcpt-%d", p.seq)
    }

    func main() {
        p := &Payments{}

        var wg sync.WaitGroup
        receipts := make([]string, 20)
        for i := range receipts {
            wg.Add(1)
            go func() {
                defer wg.Done()
                receipts[i] = p.Charge("order-A-1001", 250) // bir xil kalit, 20 ta qayta urinish
            }()
        }
        wg.Wait()

        other := p.Charge("order-B-2002", 100)
        distinct := map[string]bool{}
        for _, r := range receipts {
            distinct[r] = true
        }
        fmt.Println("yechilgan jami:", p.charged)
        fmt.Println("A buyurtma uchun turli kvitansiyalar:", len(distinct))
        fmt.Println("boshqa kalit alohida yechildi:", other != receipts[0])
    }
  solution: |
    package main

    import (
        "fmt"
        "sync"
    )

    // Payments to'lovlarni qabul qiladi. Mijoz tarmoq xatosidan keyin so'rovni
    // qayta yuboradi, shuning uchun bir xil Charge bir necha marta kelishi mumkin.
    type Payments struct {
        mu      sync.Mutex
        charged int // jami yechilgan summa
        seq     int
        done    map[string]string // kalit -> kvitansiya
    }

    // Charge idempotency kaliti bo'yicha bir marta yechadi; takror chaqiruv
    // birinchi chaqiruvdagi kvitansiyani qaytaradi.
    func (p *Payments) Charge(key string, amount int) string {
        p.mu.Lock()
        defer p.mu.Unlock()
        if r, ok := p.done[key]; ok {
            return r // takror so'rov: avvalgi natijani qaytaramiz
        }
        if p.done == nil {
            p.done = map[string]string{}
        }
        p.seq++
        p.charged += amount
        receipt := fmt.Sprintf("rcpt-%d", p.seq)
        p.done[key] = receipt
        return receipt
    }

    func main() {
        p := &Payments{}

        var wg sync.WaitGroup
        receipts := make([]string, 20)
        for i := range receipts {
            wg.Add(1)
            go func() {
                defer wg.Done()
                receipts[i] = p.Charge("order-A-1001", 250) // bir xil kalit, 20 ta qayta urinish
            }()
        }
        wg.Wait()

        other := p.Charge("order-B-2002", 100)
        distinct := map[string]bool{}
        for _, r := range receipts {
            distinct[r] = true
        }
        fmt.Println("yechilgan jami:", p.charged)
        fmt.Println("A buyurtma uchun turli kvitansiyalar:", len(distinct))
        fmt.Println("boshqa kalit alohida yechildi:", other != receipts[0])
    }
  solutionNotes: |
    - `done` xaritasi `key -> kvitansiya` saqlaydi. `Charge` boshida kalit tekshiriladi: bor bo'lsa, o'sha kvitansiya qaytariladi va `charged` o'zgarmaydi.
    - Tekshiruv va yozish bitta `Mutex` ichida: ikki goroutine bir kalit uchun bir vaqtda "birinchi" bo'la olmaydi.
    - Lokal tekshiruv (`-race` bilan): starter 5100 yechdi va 20 ta kvitansiya berdi; yechim 350 va 1.
    - Bu xotiradagi model. Haqiqiy tizimda `done` jadvali bazada bo'ladi (kalit uchun UNIQUE indeks), tekshiruv va yechish bir tranzaksiyada; kalitga muddat (TTL) qo'yiladi.
  checklist:
    - "Bir xil key bilan takror chaqiruv yangi yechish qilmaydi"
    - "Takror chaqiruv birinchi kvitansiyani qaytaradi"
    - "Tekshiruv va yozish bitta Lock ichida"
    - "Boshqa key alohida yechiladi"
    - "`go run -race` hisobotsiz o'tadi"
---

## Muammo

Servislar bir-biriga to'g'ridan-to'g'ri HTTP/gRPC bilan emas, xabar brokeri (Kafka, NATS, RabbitMQ va boshqalar) orqali ham gaplashadi: buyurtma yaratildi, "OrderPlaced" hodisasi yuboriladi, omborxona, to'lov va bildirishnoma servislari o'z vaqtida o'qiydi. Bu bog'liqlikni kamaytiradi va yuk to'lqinini tekislaydi. Lekin broker tarmoq orqali ishlaydi, tarmoq va jarayonlar esa yiqiladi. Savol: yiqilish paytida xabar yo'qoladimi, ikki marta keladimi, yoki bir marta?

Hech qanday tarmoq tizimi "aynan bir marta" yetkazishni sehrli tarzda kafolatlamaydi. Odatda tanlov ikki xil: yo'qotishga ruxsat berish (at-most-once) yoki takrorga ruxsat berish (at-least-once). Ishlab chiqarishda deyarli har doim ikkinchisi tanlanadi va takror bilan yashash uchun iste'molchi **idempotent** qilinadi. Bu darsning o'zagi shu.

Bu yerda Kafka yoki NATS kutubxonalari ishga tushirilmaydi (sandbox'da tashqi modul yuklanmaydi va broker yo'q). O'rniga kafolatlar mexanikasini stdlib bilan yozilgan deterministik model ustida ko'ramiz: u real broker xatti-harakatini soddalashtiradi, lekin takror, ack va outbox muammolari aynan shunday paydo bo'ladi. Aniq broker API'lariga kirmaymiz; ularning xususiyatlari uchun o'z hujjatiga qarang.

## Asosiy g'oya

### Yetkazish kafolatlari

- **At-most-once**: xabar ko'pi bilan bir marta yetkaziladi. Ack avval yuboriladi, keyin ishlanadi: ishlash paytida yiqilsa, xabar yo'qoladi. Yo'qotish zararsiz bo'lganda (masalan, jonli telemetriyaning oxirgi qiymati) mos.
- **At-least-once**: xabar kamida bir marta yetkaziladi. Avval ishlanadi, keyin ack: ack yetib bormasa, broker xabarni qayta yuboradi. Takror bo'lishi mumkin.
- **Exactly-once**: "aynan bir marta" ta'sirga erishish uchun tizimning bir qismi (masalan, broker ichidagi tranzaksiyalar) kafolat bersa ham, tashqi dunyoga ta'sir qiladigan (baza, email, to'lov) handler uchun baribir iste'molchi tomonda idempotentlik kerak. Amaliy formula: at-least-once + idempotent iste'molchi = effectively once.

### Ack yo'qolsa nima bo'ladi

Quyidagi model broker (`Receive`, `ExpireInflight` ack kelmagan xabarni navbatga qaytaradi) va hisob (`Ledger`) ni stdlib bilan yozadi. `drain` birinchi xabarda ack yuborishdan OLDIN yiqilishni taqlid qiladi:

```go
package main

import (
	"fmt"
	"sync"
)

type Message struct {
	ID     string
	Amount int
}

// Broker at-least-once yetkazishni modellaydi: Ack kelmagan xabar qayta yetkaziladi.
type Broker struct {
	mu       sync.Mutex
	queue    []Message
	inflight []Message
}

func NewBroker() *Broker { return &Broker{} }

func (b *Broker) Publish(m Message) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.queue = append(b.queue, m)
}

func (b *Broker) Receive() (Message, bool) {
	b.mu.Lock()
	defer b.mu.Unlock()
	if len(b.queue) == 0 {
		return Message{}, false
	}
	m := b.queue[0]
	b.queue = b.queue[1:]
	b.inflight = append(b.inflight, m)
	return m, true
}

// ExpireInflight: ack muddati tugadi, ack olinmagan xabarlar navbatga qaytadi.
func (b *Broker) ExpireInflight() {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.queue = append(b.queue, b.inflight...)
	b.inflight = nil
}

func (b *Broker) AckAll() {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.inflight = nil
}

// Ledger: hisob va qayta ishlangan xabar ID'lari bitta "tranzaksiya" (mutex) ichida o'zgaradi.
type Ledger struct {
	mu        sync.Mutex
	balance   int
	processed map[string]bool
}

func NewLedger() *Ledger { return &Ledger{processed: map[string]bool{}} }

func (l *Ledger) ApplyNaive(m Message) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.balance += m.Amount
}

func (l *Ledger) ApplyIdempotent(m Message) {
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.processed[m.ID] {
		return // bu xabar allaqachon qo'llangan
	}
	l.balance += m.Amount
	l.processed[m.ID] = true
}

// drain: xabarni oladi, qo'llaydi, lekin birinchi urinishda ack'dan oldin "yiqiladi".
func drain(b *Broker, apply func(Message), crashFirst bool) {
	crashed := !crashFirst
	for {
		m, ok := b.Receive()
		if !ok {
			return
		}
		apply(m)
		if !crashed {
			crashed = true
			b.ExpireInflight() // ack yuborilmadi: broker xabarni qaytaradi
			continue
		}
		b.AckAll()
	}
}

// Outbox: buyurtma va chiquvchi hodisa bitta tranzaksiyada saqlanadi.
type Store struct {
	mu     sync.Mutex
	orders []string
	outbox []outboxRow
}

type outboxRow struct {
	Msg  Message
	Sent bool
}

func (s *Store) PlaceOrder(id string, amount int) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.orders = append(s.orders, id)
	s.outbox = append(s.outbox, outboxRow{Msg: Message{ID: "evt-" + id, Amount: amount}})
}

// Relay: yuborilmagan qatorlarni publish qiladi, keyin belgilaydi. crashAfterPublish bo'lsa, belgilashga yetmaydi.
func (s *Store) Relay(b *Broker, crashAfterPublish bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for i := range s.outbox {
		if s.outbox[i].Sent {
			continue
		}
		b.Publish(s.outbox[i].Msg)
		if crashAfterPublish {
			return
		}
		s.outbox[i].Sent = true
	}
}

func main() {
	// 1. IdempotentlikSIZ iste'molchi: ack yo'qolsa, ta'sir ikki marta.
	b, l := NewBroker(), NewLedger()
	b.Publish(Message{"pay-1", 100})
	drain(b, l.ApplyNaive, true)
	fmt.Println("1. oddiy iste'molchi, balans:", l.balance)

	// 2. Xabar ID'si bo'yicha idempotent iste'molchi.
	b, l = NewBroker(), NewLedger()
	b.Publish(Message{"pay-1", 100})
	drain(b, l.ApplyIdempotent, true)
	fmt.Println("2. idempotent iste'molchi, balans:", l.balance)

	// 3. Outbox: relay publish'dan keyin yiqiladi, qayta ishga tushganda yana yuboradi.
	b, l = NewBroker(), NewLedger()
	s := &Store{}
	s.PlaceOrder("A-1001", 250)
	s.Relay(b, true)  // publish bo'ldi, Sent belgisi qo'yilmadi
	s.Relay(b, false) // qayta ishga tushgan relay yana yuboradi
	fmt.Println("3. brokerdagi nusxalar:", len(b.queue))
	drain(b, l.ApplyIdempotent, false)
	fmt.Println("   buyurtmalar:", len(s.orders), "| hisob ta'siri:", l.balance)
}
```

```text
1. oddiy iste'molchi, balans: 200
2. idempotent iste'molchi, balans: 100
3. brokerdagi nusxalar: 2
   buyurtmalar: 1 | hisob ta'siri: 250
```

Natijalar:

1. **Oddiy iste'molchi**: 100 so'mlik to'lov ikki marta qo'llandi, balans 200. Xabar yo'qolmadi, lekin ta'siri takrorlandi.
2. **Idempotent iste'molchi**: xabar ID'si `processed` da saqlandi, ikkinchi marta kelganda o'tkazib yuborildi, balans 100.
3. **Outbox** (pastda): relay brokerga yubordi, `Sent` belgisini qo'yishdan oldin yiqildi va qayta ishga tushgach yana yubordi: brokerda 2 nusxa, lekin idempotent iste'molchi ta'sirni (250) bir marta qo'lladi.

### Idempotentlik qoidalari

Bir xil xabarni ikki marta ishlash ta'sirni o'zgartirmasa, handler idempotent. Usullar:

- **Tabiiy idempotentlik**: "holatni X ga o'rnat" (`SET status = 'paid'`) takrorlansa o'zgarmaydi, "balansga 100 qo'sh" esa o'zgaradi. Iloji bo'lsa buyruqni "o'rnat" shaklida yozing.
- **Xabar/idempotency kaliti**: har xabar (yoki mijoz so'rovi) noyob ID bilan keladi; iste'molchi qayta ishlangan ID'larni saqlaydi. Muhim: ID tekshiruvi va ta'sir **bitta tranzaksiyada** (bazada `processed_messages` jadvali, ID ustida UNIQUE indeks). Aks holda tekshiruvdan keyin, yozishdan oldin yiqilish yoki parallel ikki yetkazish yana takrorni o'tkazadi.
- **Kalitga muddat**: processed jadvali cheksiz o'smasligi uchun yozuvlar TTL bilan tozalanadi; TTL broker qayta yetkazish oynasidan uzun bo'lsin.

Mijoz so'rovlari uchun ham xuddi shu: mijoz tarmoq xatosidan keyin POST'ni qayta yuboradi (73-darsdagi retry), server esa `Idempotency-Key` sarlavhasi bilan takrorni tanib, birinchi natijani qaytaradi (topshiriqdagi `Payments.Charge`).

## Chuqurroq: dual write va transactional outbox

### Dual write muammosi

Odatiy kod: `INSERT order` -> `broker.Publish(OrderPlaced)`. Ikki alohida tizimga ketma-ket yozish atomik emas: bazaga yozildi, publish'dan oldin yiqildi, buyurtma bor lekin hodisa yo'q; yoki aksincha, publish o'tdi, baza commit'i yiqildi, hodisa bor lekin buyurtma yo'q. Retry bilan hal bo'lmaydi: retry ham yiqilishi mumkin.

### Transactional outbox

Yechim: hodisa ham **bazaga**, buyurtma bilan **bir tranzaksiyada** yoziladi (`outbox` jadvali). Shunda ikkalasi birga mavjud yoki birga yo'q. Alohida jarayon (relay) outbox'dagi yuborilmagan qatorlarni brokerga yuboradi va `Sent` deb belgilaydi. Relay publish'dan keyin, belgilashdan oldin yiqilsa, qayta ishga tushganda yana yuboradi: yetkazish at-least-once bo'ladi (yuqoridagi 3-stsenariyda brokerda 2 nusxa). Shuning uchun iste'molchi idempotent bo'lishi shart. Outbox yo'qotishni yo'q qiladi, takrorni iste'molchi hal qiladi.

Amalda outbox qatorlari quyidagicha ko'rinadi (tranzaksiya yordamchisi 78-darsdan):

```go
// kompilyatsiya qilinmagan: sxema va yordamchi taxminiy
err := withTx(ctx, db, nil, func(tx *sql.Tx) error {
	if _, err := tx.ExecContext(ctx,
		`insert into orders (id, amount) values ($1, $2)`, id, amount); err != nil {
		return err
	}
	_, err := tx.ExecContext(ctx,
		`insert into outbox (event_id, topic, payload) values ($1, $2, $3)`,
		"evt-"+id, "orders.placed", payload)
	return err
})
```

Relay'ni ishlatish usullari: davriy so'rov (polling, `select ... where sent_at is null order by id limit 100 for update skip locked`), yoki bazaning o'zgarishlar oqimi (CDC). Polling oddiy va ko'p hollarda yetarli; kechikish polling oralig'iga teng. Tartib faqat bitta relay yoki kalit bo'yicha bo'linishda saqlanadi, buni ongli loyihalang.

## Misol: iste'molchi ishchilari va graceful shutdown

Iste'molchi ko'pincha bir nechta ishchi goroutine'dan iborat. Ularni `errgroup` bilan boshqarish va `context` bilan to'xtatish qulay. Quyidagi snippet `x/sync/errgroup` hujjatiga tayanadi va **kompilyatsiya qilinmagan** (broker mijozi ham taxminiy interfeys):

```go
// kompilyatsiya qilinmagan
type Consumer interface {
	Receive(ctx context.Context) (Message, error) // ctx bekor bo'lsa xato qaytaradi
	Ack(ctx context.Context, m Message) error
}

func run(ctx context.Context, c Consumer, handle func(context.Context, Message) error, workers int) error {
	g, ctx := errgroup.WithContext(ctx)
	g.SetLimit(workers)
	for i := 0; i < workers; i++ {
		g.Go(func() error {
			for {
				m, err := c.Receive(ctx)
				if err != nil {
					if ctx.Err() != nil {
						return nil // to'xtatish signali: normal chiqish
					}
					return err
				}
				// handler'ga ALOHIDA muddatli context: to'xtatish signali yarim ishni uzmasin
				hctx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 30*time.Second)
				err = handle(hctx, m)
				cancel()
				if err != nil {
					continue // ack yo'q: broker qayta yetkazadi (idempotent handler)
				}
				if err := c.Ack(context.WithoutCancel(ctx), m); err != nil {
					return err
				}
			}
		})
	}
	return g.Wait() // hamma ishchi tugaguncha kutadi
}
```

Muhim qarorlar:

- **Context**: `errgroup.WithContext` ichki context'i birinchi xato bilan bekor qilinadi, shu orqali qolgan ishchilar to'xtaydi (100 Go Mistakes #62: goroutine qachon to'xtashini bilib ishga tushiring).
- **Handler konteksti**: to'xtatish signali yarim ishlangan xabarni uzmasligi uchun handler'ga `WithoutCancel` + alohida muddat beriladi (#61: noto'g'ri contextni uzatmaslik: so'rov konteksti fon ishini bekor qilib qo'ymasin va aksincha).
- **Ack faqat muvaffaqiyatdan keyin**: handler xato bersa ack yuborilmaydi, broker xabarni qayta yetkazadi (shuning uchun handler idempotent).
- **Zaharli xabar (poison message)**: doim xato beradigan xabar cheksiz qayta yetkazilib navbatni to'sadi. Urinishlar sonini cheklab, dead-letter navbatiga o'tkazing.
- **Backoff**: handler vaqtincha xato bersa, darhol qayta urinish o'rniga kutish bilan qayta urining (73-dars).
- **`g.Wait()`** hamma ishchi tugaguncha qaytmaydi, shuning uchun jarayon SIGTERM'da avval `ctx` ni bekor qiladi, keyin `Wait` ni kutadi (72-darsdagi graceful shutdown g'oyasi).

## Qachon qo'llamaslik kerak

- **Sinxron javob kerak bo'lganda**: foydalanuvchi natijani kutayotgan bo'lsa (to'lovni tasdiqlash), xabar navbati o'rniga to'g'ridan-to'g'ri so'rov-javob mos; navbat kechikish va murakkablik qo'shadi.
- **Kichik tizim, bitta baza**: bitta servis va bitta baza bo'lsa, xabar brokeri ortiqcha infratuzilma. Bazaning o'zida oddiy ishlar jadvali (job table) ko'pincha yetarli.
- **Idempotent bo'lmagan tashqi ta'sirlar**: handler ichida email yoki to'lov chaqirilsa va idempotent qilib bo'lmasa, at-least-once xavfli. Tashqi tizimning idempotency key'idan foydalaning yoki ta'sirni outbox orqali bitta joyga to'plang.
- **Tartib muhim, parallellik yuqori**: ko'p ishchi tartibni buzadi. Tartib kerak bo'lsa kalit bo'yicha bo'ling (bir kalit bir ishchiga) va parallellikdan voz keching.
- **Outbox'ni har joyga qo'llash**: har hodisa uchun outbox qo'shimcha jadval, relay va monitoring talab qiladi. Yo'qotish zararsiz bo'lsa (loglar, jonli koordinatalar) oddiy publish yetadi.
- **"Exactly-once" va'dasiga ko'r-ko'rona ishonish**: broker kafolati faqat o'z chegarasida amal qiladi; baza yoki tashqi API'ga ta'sir uchun baribir idempotentlik kerak.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da BullMQ, KafkaJS yoki amqplib bilan xuddi shu qoidalar amal qiladi: ack handler'dan keyin, takror bo'ladi, idempotentlik sizning ishingiz. Go'da farqlar: iste'molchi ishchilari haqiqiy parallel goroutine'lar (shuning uchun idempotentlik tekshiruvi ma'lumot poygasidan ham himoyalanishi kerak, `-race` bilan sinang), `context` bekor qilish va muddatlarni birlashtiradi, `errgroup` esa ishchilarni xato bilan birga boshqaradi.

Servis uchun andoza:

- Hodisa va ta'sir: yozuvchi tomonda outbox (bir tranzaksiya), o'quvchi tomonda idempotent handler.
- Har xabarda noyob ID (`event_id`); iste'molchi `processed` jadvali (UNIQUE) bilan tekshiradi, tekshiruv va ta'sir bir tranzaksiyada.
- Ack faqat handler muvaffaqiyatidan keyin; xato bo'lsa ack yo'q va chekli urinishdan keyin dead-letter.
- Ishchilar `errgroup` + `context` bilan; SIGTERM'da to'xtatish va `Wait`.
- Handler muddati alohida; fon ishi so'rov contextiga bog'lanmaydi.
- Metrikalar: navbat uzunligi, qayta yetkazish soni, dead-letter hajmi, outbox kechikishi.

## Xulosa

- Tarmoq orqali "aynan bir marta" yetkazishga tayanmang: amalda at-least-once tanlanadi va iste'molchi idempotent qilinadi. Lokal modelda ack yo'qolganda oddiy iste'molchi balansi 200, idempotent esa 100 bo'ldi.
- Idempotentlik: tabiiy (holatni o'rnatish) yoki ID/idempotency key bilan; tekshiruv va ta'sir bitta atomik bosqichda, kalitga muddat bilan. Topshiriqda 20 qayta urinish key bilan bir marta yechildi (5100 -> 350).
- Dual write atomik emas; transactional outbox hodisani buyurtma bilan bir tranzaksiyada saqlaydi, relay yuboradi. Relay yiqilsa takror bo'ladi (modelda brokerda 2 nusxa), shuning uchun iste'molchi idempotent.
- Iste'molchi ishchilari `errgroup` + `context` bilan; ack faqat muvaffaqiyatdan keyin, zaharli xabar uchun dead-letter, graceful shutdown (#61, #62).
- Kafka/NATS kabi brokerlar va errgroup snippet'i bu darsda kompilyatsiya qilinmagan; mexanika stdlib modelida ko'rsatildi.
