---
n: 99
slug: go-vs-node
title: "Go va Node.js/TypeScript: qachon nimani tanlash"
summary: "Go va Node.js/TypeScript backend'ini ish yuki, xotira, concurrency, xatolar, tiplar, deployment va jamoa bo'yicha solishtirish: lokal o'lchangan misollar, GC sozlamalari va diagnostika asboblari, hamda muallifning tajribaviy bahosi ochiq belgilangan qaror jadvali."
duration: 40
sources:
  - id: go-faq
    note: "Go'ning dizayn qarorlari va tilning umumiy tavsifi; bu darsda undan faqat umumiy kontekst olingan, aniq raqam keltirilmagan"
  - id: gc-guide
    note: "Garbage collector qo'llanmasi: GOGC va xotira limiti sozlamalari, GC xarajati va xotira o'rtasidagi savdo"
  - id: diagnostics
    note: "Go diagnostika asboblari: profiling (pprof), tracing, debugging va runtime statistikasi"
quiz:
  - q: "Servis `{\"device_id\": 9007199254740993}` JSON'ini qabul qiladi. Node.js'da `JSON.parse` shu qiymatni nima deb o'qiydi, Go'da `int64` maydoniga `json.Unmarshal` nima beradi?"
    options:
      - "Ikkalasida ham 9007199254740993"
      - "Node.js 9007199254740992 (Number float64), Go 9007199254740993 (int64 maydon aniq saqlaydi)"
      - "Node.js xato beradi, Go 9007199254740992 qaytaradi"
      - "Ikkalasida ham 9007199254740992"
    answer: 1
    explain: "Node.js'da JSON raqami Number (float64) bo'ladi va 2^53 dan katta butun sonlar aniq ifodalanmaydi: lokal o'lchovda 9007199254740992 chiqdi. Go'da maydon turi int64 bo'lsa, dekoder raqamni to'g'ridan-to'g'ri int64 sifatida o'qiydi. Lekin `map[string]any` ga o'qilsa, Go ham float64 beradi."
  - q: "Quyidagilardan qaysi biri Go'ni Node.js o'rniga tanlash uchun eng kuchli dalil?"
    options:
      - "Jamoa Go'ni yoqtiradi"
      - "Servis I/O kutishdan emas, CPU ishidan (parse, kodlash, hisoblash) iborat va bir jarayonda barcha yadrolarni ishlatishi kerak"
      - "Servisda 50 ta route bor"
      - "Servis HTTP orqali JSON qaytaradi"
    answer: 1
    explain: "Go goroutine'lari runtime tomonidan barcha mavjud yadrolarga taqsimlanadi, Node.js'da esa JavaScript kodi bitta thread'da ishlaydi (parallellik uchun worker_threads yoki bir nechta jarayon kerak). Route soni va JSON qaytarish ikkala stackda ham muammo emas; 'yoqtiradi' esa texnik dalil emas."
  - q: "Kichik jamoa Nest.js'da ishlaydigan CRUD admin panel backend'ini Go'ga ko'chirishni o'ylayapti. Sabab: 'Go tezroq'. Servis yuki past, bottleneck Postgres so'rovlari. Eng mantiqiy qaror?"
    options:
      - "Ko'chirish: Go har doim tezroq"
      - "Avval profil qilib bottleneck'ni aniqlash; so'rovlar sekin bo'lsa, tilni almashtirish uni tuzatmaydi"
      - "Faqat controller'larni Go'da qayta yozish"
      - "Node.js'ni worker_threads'ga o'tkazish"
    answer: 1
    explain: "Bottleneck ma'lumotlar bazasida bo'lsa, til almashtirish kutish vaqtini kamaytirmaydi, lekin ko'chirish xarajati (qayta yozish, yangi ekosistema, jamoa o'rganishi) aniq. Qaror o'lchovga tayanishi kerak: diagnostika asboblari (pprof, trace) va SQL tahlili."
  - q: "Go servisi konteynerda xotira limitiga yaqin ishlaydi va vaqti-vaqti bilan OOM bilan o'ladi. gc-guide bo'yicha qaysi sozlama GC'ga umumiy xotira bo'yicha yumshoq yuqori chegara beradi?"
    options:
      - "GOMAXPROCS"
      - "GOGC=off"
      - "GOMEMLIMIT"
      - "GODEBUG"
    answer: 2
    explain: "GOMEMLIMIT (Go 1.19 dan) runtime'ga yumshoq xotira limiti beradi: limitga yaqinlashganda GC tez-tez ishlaydi. GOGC heap o'sish nisbatini boshqaradi, GOMAXPROCS yadrolar sonini. GOGC=off limitsiz o'sishga olib kelishi mumkin. Limit kafolat emas: jonli ma'lumotning o'zi limitdan katta bo'lsa, OOM baribir bo'ladi."
  - q: "Node.js'da `await` bilan chaqirilgan funksiya xato bersa, `throw` yuqoriga ko'tariladi. Go'da shu xatti-harakat nimaga mos keladi va yetishmasligi mumkin bo'lgan narsa nima?"
    options:
      - "Go'da ham throw bor, faqat nomi panic"
      - "Funksiya error qaytaradi va chaqiruvchi uni tekshiradi; tekshirishni unutish kompilyator xatosi emas, shuning uchun vet/linter va sinov kerak"
      - "Go xatoni avtomatik tarqatadi"
      - "Go'da xato yo'q, faqat nil qiymat"
    answer: 1
    explain: "Go'da xato oddiy qiymat va uni tarqatish aniq yoziladi (`if err != nil`). Natijani e'tiborsiz qoldirish kompilyatsiyaga to'sqinlik qilmaydi (92-dars), shuning uchun errcheck kabi linterlar ishlatiladi. panic kutilgan xatolar uchun emas, dastur xatolari uchun."
  - q: "Dars 'muallifning tajribaviy bahosi' deb belgilagan fikrlar o'quvchi uchun nimani anglatadi?"
    options:
      - "Ular rasmiy hujjatlardan olingan va isbotlangan"
      - "Ular lokal o'lchangan raqamlar"
      - "Ular muallifning amaliy fikri: o'z jamoangiz sharoitida tekshirib ko'rish kerak, qaror manbasi sifatida emas"
      - "Ular Node.js tarafdorlarining fikri"
    answer: 2
    explain: "Tilni tanlash ko'p jihatdan kontekstga bog'liq: jamoa, mavjud kod, talablar. Dars faktlarni (o'lchov, hujjat) va baholarni ajratib beradi, shunda o'quvchi qaysi biriga qanchalik tayanishini biladi."
task:
  title: "JSON'da katta identifikator: float64 tuzog'idan qochish"
  prompt: |
    `deviceID` funksiyasi JSON tanasidan `device_id` ni o'qiydi. Hozir u `map[string]any` ishlatadi, shuning uchun `9007199254740993` kabi katta identifikator float64 orqali o'tib, `9007199254740992` bo'lib qaytadi (xuddi Node.js'dagi `JSON.parse` kabi).

    Funksiyani qayta yozing:

    - `device_id` ni `int64` sifatida aniq o'qing (tipli struct bilan);
    - maydon yo'q bo'lsa `device_id yo'q` xatosini qaytaring (nol qiymat bilan farqlash uchun `*int64` ishlating);
    - noto'g'ri tur (`"device_id": "x"`) uchun `json.Unmarshal` xatosini o'zgartirmasdan qaytaring.

    Lokal tekshirish: `go run .` birinchi qatorda `9007199254740993 <nil>` chiqarishi kerak.
  lang: go
  starter: |
    package main

    import (
        "encoding/json"
        "fmt"
    )

    // deviceID JSON'dan "device_id" ni o'qiydi.
    func deviceID(body string) (int64, error) {
        var m map[string]any
        if err := json.Unmarshal([]byte(body), &m); err != nil {
            return 0, err
        }
        return int64(m["device_id"].(float64)), nil
    }

    func main() {
        id, err := deviceID(`{"device_id": 9007199254740993}`)
        fmt.Println(id, err)
    }
  solution: |
    package main

    import (
        "encoding/json"
        "errors"
        "fmt"
    )

    type reading struct {
        DeviceID *int64 `json:"device_id"`
    }

    // deviceID JSON'dan "device_id" ni int64 sifatida aniq o'qiydi.
    func deviceID(body string) (int64, error) {
        var r reading
        if err := json.Unmarshal([]byte(body), &r); err != nil {
            return 0, err
        }
        if r.DeviceID == nil {
            return 0, errors.New("device_id yo'q")
        }
        return *r.DeviceID, nil
    }

    func main() {
        id, err := deviceID(`{"device_id": 9007199254740993}`)
        fmt.Println(id, err)
        _, err = deviceID(`{}`)
        fmt.Println(err)
        _, err = deviceID(`{"device_id": "x"}`)
        fmt.Println(err)
    }
  solutionNotes: |
    - Tipli struct maydoni `int64` bo'lsa, dekoder raqam matnini to'g'ridan-to'g'ri butun songa aylantiradi, float64 oraliq bosqichi yo'q.
    - `*int64` "maydon yo'q" va "qiymat 0" holatlarini ajratadi (92-dars): yo'q maydon `nil` bo'lib qoladi.
    - Xato turi mos kelmasa, `json.Unmarshal` xatosi o'zgartirilmay qaytadi; matnda maydon nomi bor, shuning uchun chaqiruvchiga foydali.
    - Boshqa yo'l: `json.Decoder.UseNumber()` raqamni `json.Number` (matn) sifatida saqlaydi, lekin tipli struct odatda aniqroq.
    - Lokal tekshirilgan: starter `9007199254740992`, yechim `9007199254740993`, `go vet` ikkalasida ham toza.
  checklist:
    - "`device_id` tipli struct orqali `int64` sifatida o'qiladi, `map[string]any` ishlatilmaydi"
    - "`*int64` bilan maydon yo'qligi `device_id yo'q` xatosi bilan ajratiladi"
    - "Noto'g'ri tur uchun `json.Unmarshal` xatosi o'zgartirilmasdan qaytadi"
    - "`go run .` birinchi qatorda `9007199254740993 <nil>` chiqaradi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

"Go yoki Node.js?" savoli ko'pincha noto'g'ri qo'yiladi: til tezligi, "zamonaviylik" yoki jamoadagi odatlar haqida bahsga aylanadi. Natijada ikki xil yo'qotish bo'ladi. Birinchisi, ishlayotgan va yetarli darajada tez Node.js servisi "tezroq" bo'lgani uchun Go'ga qayta yoziladi, bottleneck esa ma'lumotlar bazasida qoladi. Ikkinchisi, CPU ishi og'ir, ko'p yadroli mashinada bitta jarayonga bog'langan servis Node.js'da qoladi va jamoa uni bir nechta jarayon bilan zo'rg'a tortadi.

Bu dars qaror qabul qilish uchun asos beradi. Uslub: tekshirilgan narsani (lokal o'lchov, rasmiy hujjat) va fikrni aniq ajratamiz. Fikrlar "muallifning tajribaviy bahosi" deb belgilanadi: ular qoida emas, o'z sharoitingizda tekshiriladigan gipoteza. Raqamlar faqat shu dars uchun o'zim o'lchaganlar va sharoiti yozilgan (Go 1.24.7, linux/amd64, 2 yadroli sandbox, Node.js v22). Bu mashinalar sizniki emas, shuning uchun absolyut qiymatlarni emas, hodisaning o'zini oling.

## Asosiy g'oya

Til tanlash bitta o'lchov bo'yicha emas, bir nechta o'qda qaror qilinadi. Pastda har o'q bo'yicha mexanizmning o'zi, keyin qaror jadvali.

### Ish yuki: I/O yoki CPU

Node.js'da JavaScript kodi bitta thread'da event loop ichida bajariladi; I/O ni libuv kutadi, shuning uchun minglab ulanishni kutish arzon. Muammo CPU ishi: uzoq hisoblash event loop'ni bloklaydi va boshqa so'rovlar kutadi. Yechimlar bor (`worker_threads`, bir nechta jarayon, klaster), lekin ular aniq arxitektura qarori va xotira/aloqa xarajati bilan keladi. Go'da concurrency til va runtime darajasida: goroutine'lar runtime scheduler orqali mavjud yadrolarga taqsimlanadi (GOMAXPROCS), kod "bitta jarayon, ko'p yadro" modelida yoziladi (93-dars). Muhim aniqlik: I/O-og'ir servisda (so'rov keladi, DB'ga boradi, javob qaytadi) bu farq kamroq seziladi, chunki ikkalasi ham asosan kutadi. Haqiqiy farq CPU-og'ir ishda (kodlash, parse, siqish, agregatsiya) va ish yukining bir jarayonga sig'ish-sig'masligida.

### Xotira va goroutine narxi

Goroutine yengil, lekin bepul emas. Lokal o'lchov: 100 000 ta bloklangan goroutine'dan keyin `runtime.MemStats.StackInuse` 199 968 KiB ga o'sdi, ya'ni bir goroutine boshiga ~2 KiB stack (kod va chiqish pastda). Bu "minglab goroutine ochaveraman" degani emas: har goroutine yana ishlayotgan ma'lumotni ushlab turadi va qachon tugashini bilishingiz kerak (goroutine oqishi, 93-dars). Xotirani boshqarish sozlamalari gc-guide'da: GOGC (heap o'sish nisbati) va GOMEMLIMIT (Go 1.19 dan yumshoq xotira limiti). Node.js'da V8 heap limiti va uning GC'si bor; sozlash usullari boshqa, lekin masala o'sha: GC xarajati va xotira o'rtasidagi savdo.

### Tiplar va chegaralar

TypeScript tiplari kompilyatsiya vaqtida yo'qoladi: runtime'da chegaradan kelgan JSON tekshirilmasa, `: Reading` annotatsiyasi hech narsani kafolatlamaydi (zod, class-validator kabi kutubxonalar shu uchun kerak). Go'da tip runtime'da ham haqiqiy: `json.Unmarshal` turi mos kelmasa xato qaytaradi. Ikkinchi nozik joy: raqamlar. JavaScript'da JSON raqami Number (float64), shuning uchun 2^53 dan katta butun sonlar aniq emas. Lokal o'lchov quyida: `9007199254740993` Node.js'da `9007199254740992` bo'lib o'qildi, Go'da `int64` maydon uni to'g'ri saqladi. Telemetriya yoki to'lov identifikatorlari 64 bitli bo'lsa, Node.js'da ularni string sifatida uzatish odat. Go'da bu muammo `any` ga o'qilganda qaytadi (float64), shuning uchun topshiriqdagi tipli struct.

### Xatolar

Node.js'da `throw`/`catch` va `async` zanjiri xatoni avtomatik yuqoriga uzatadi; ishlov berilmagan promise rejection esa jarayonni yiqitishi mumkin. Go'da xato qiymat: har chaqiruvda tekshiriladi, kontekst bilan o'raladi (`%w`, 92-dars). Kamchilik: ko'p `if err != nil`. Afzallik: xato yo'li kodda ko'rinadi va har qadamda qaror qilinadi. Natijani e'tiborsiz qoldirish mumkin va kompilyator to'xtatmaydi, shuning uchun linter kerak.

### Diagnostika

Go'da diagnostika asboblari ekosistemaning bir qismi (diagnostics hujjati): profiling (CPU, heap, goroutine, block, mutex), tracing, debugging va runtime statistikasi. Servisga `net/http/pprof` ulanadi va jonli jarayondan profil olinadi (100-dars: admin port). Node.js'da ham profiler va heap snapshot'lar bor, lekin amaliy ish usuli farq qiladi; bu darsda ularning ichki tafsilotlari tekshirilmagan.

### Deployment

Go kompilyatsiya natijasi odatda bitta ijro etiladigan fayl: bu darsdagi capstone servisi (100-dars) lokal `go build` bilan 9 745 702 bayt, `-ldflags="-s -w"` bilan 6 648 100 bayt (Go 1.24.7, linux/amd64). Node.js servisi runtime, `node_modules` va versiya muvofiqligini talab qiladi. Bu konteyner tasvirini va ishga tushish jarayonini soddalashtiradi, lekin muammoni hal qilmaydi: CGO yoki dinamik bog'liqlik ishlatilsa, "bitta fayl" shartli bo'ladi.

## Chuqurroq: o'lchovlar va ularning chegarasi

### Lokal misol

Quyidagi dastur ikki narsani o'lchaydi: JSON'dagi katta butun son va 100 000 bloklangan goroutine'ning stack hajmi.

```go
package main

import (
	"encoding/json"
	"fmt"
	"runtime"
	"sync"
	"time"
)

type Reading struct {
	DeviceID int64   `json:"device_id"`
	Fuel     float64 `json:"fuel"`
}

func main() {
	// 1. 9007199254740993 = 2^53 + 1
	var r Reading
	if err := json.Unmarshal([]byte(`{"device_id": 9007199254740993, "fuel": 41.5}`), &r); err != nil {
		panic(err)
	}
	fmt.Println("Go int64:", r.DeviceID)

	// 2. 100000 goroutine xotira
	var before, after runtime.MemStats
	runtime.GC()
	runtime.ReadMemStats(&before)
	var wg sync.WaitGroup
	stop := make(chan struct{})
	const n = 100000
	wg.Add(n)
	for i := 0; i < n; i++ {
		go func() {
			defer wg.Done()
			<-stop
		}()
	}
	time.Sleep(200 * time.Millisecond)
	runtime.ReadMemStats(&after)
	fmt.Printf("goroutine soni: %d, StackInuse o'sishi: %d KiB, bir goroutine ~ %d bayt\n",
		runtime.NumGoroutine()-1, (after.StackInuse-before.StackInuse)/1024,
		(after.StackInuse-before.StackInuse)/n)
	close(stop)
	wg.Wait()
}
```

Natija (Go 1.24.7, linux/amd64, 2 yadro; Node.js v22 bilan):

```text
Go int64: 9007199254740993
goroutine soni: 100000, StackInuse o'sishi: 199968 KiB, bir goroutine ~ 2047 bayt
--- Node.js v22:
Node Number: 9007199254740992
```

Nima o'lchandi va nima o'lchanmadi:

- Birinchi qator `int64` aniqligini ko'rsatadi; Node.js qatori float64 tufayli bir birlikka yo'qotilgan qiymatni. Bu til xatosi emas, raqam turi dizayni.
- Goroutine soni 100 000, stack o'sishi ~2 KiB/goroutine. Bu faqat stack: yopilmalar, kanallar va goroutine ushlab turgan ma'lumot qo'shimcha xotira. Raqam Go versiyasi va arxitekturaga qarab o'zgarishi mumkin (stack boshlang'ich hajmi runtime ichki detali).
- Men ataylab "Go N marta tezroq" kabi raqam keltirmayman. Bunday taqqoslash ish yukiga, kutubxonaga va kodning sifatiga bog'liq; lokal ikki dastur o'lchovi ommaviy xulosa bermaydi. O'z servisingiz uchun o'lchov: bir xil ish yuki, bir xil mashina, profil bilan.

### Jamoa va ekosistema

Bu o'qdagi hamma narsa muallifning tajribaviy bahosi, o'lchov emas:

- Jamoa Node.js/TypeScript'ni yaxshi biladigan bo'lsa, Go'ga o'tishning birinchi bosqichi sekin: til sodda, lekin idiomalar (error qiymatlari, interface'lar, concurrency naqshlari) boshqacha. Birinchi servis odatda keyingilaridan sekinroq chiqadi.
- Frontend va backend bir tilda (TypeScript) bo'lsa, tiplar va validatsiya sxemalarini ulashish mumkin. Go'da bunday ulashish yo'q; sxema generatsiyasi (98-dars) yoki OpenAPI orqali hal qilinadi.
- Ekosistema: Node.js'da kutubxonalar ko'p, Go'da standart kutubxona (`net/http`, `database/sql`, `encoding/json`, `log/slog`) ko'p ishni kutubxonasiz bajaradi. Bu dars boshidan shu uslubni ko'rsatdi.

## Misol: qaror jadvali

Quyida har vaziyat uchun muallifning tajribaviy bahosi. Jadval "to'g'ri javob" emas, boshlang'ich fikr.

| Vaziyat | Moyillik | Sabab |
|---|---|---|
| CRUD admin panel, yuk past, jamoa TypeScript'da kuchli | Node.js/TypeScript | Til almashtirish foyda bermaydi, ko'chirish xarajati aniq |
| Telemetriya qabul qilish: ko'p ulanish, partiyalash, backpressure (94-dars) | Go | Bir jarayonda ko'p yadro, aniq concurrency modeli |
| Gateway / reverse proxy (96-dars) | Go | Standart kutubxonada `httputil.ReverseProxy`, oddiy deployment |
| BFF (frontend uchun agregatsiya), frontend jamoasi egalik qiladi | Node.js/TypeScript | Umumiy tiplar, jamoa ko'nikmasi |
| CLI va ichki asboblar (98-dars) | Go | Bitta binary, cross-compile |
| ML/skriptlash, tezkor prototip | Boshqa til | Bu mavzu doirasidan tashqari |
| Ko'p yillik katta Node.js kodi, ishlayapti | Qoldirish | Qayta yozish xavfi ko'p, foydasi kam |

Qaror uchun savollar tartibi: (1) hozirgi bottleneck nima va u o'lchanganmi? (2) ish yuki CPU-og'irmi yoki kutishdan iboratmi? (3) jamoa qaysi tilda ishonchli ishlay oladi va ko'chirishga vaqti bormi? (4) servis alohida chegarali (kichik) bo'lib, Go'da qayta yozish xavfsizmi? Faqat shundan keyin til nomi keladi.

## Qachon qo'llamaslik kerak

- Go'ni tanlamang, agar sabab faqat "tezroq" bo'lsa va bottleneck o'lchanmagan. Tilni almashtirish sekin SQL, yetishmayotgan indeks yoki tarmoq kechikishini tuzatmaydi.
- Katta ishlayotgan tizimni "bir zarbada" qayta yozmang. Yaxshiroq yo'l: yangi yoki aniq chegaralangan komponentni (masalan, ingestion yoki gateway) Go'da yozib, qolganini saqlash.
- Node.js'ni tanlamang, agar servis CPU-og'ir, ko'p yadroli mashinada bir jarayonga mo'ljallangan va siz allaqachon `worker_threads` bilan kurashayotgan bo'lsangiz: Go bu masalani tilning o'zida hal qiladi.
- Go'da ham concurrency "bepul" emas: noto'g'ri qo'llangan goroutine'lar oqish, race va qiyin debug beradi (93-dars). Node.js'ning bitta thread modeli ko'p masalada soddaroq va xavfsizroq.
- Bu darsdagi hech narsa "til A yaxshiroq" degan umumiy da'vo emas: u faqat ko'rsatilgan o'lchov va mexanizmlar haqida.

## Stack'da: Node.js/NestJS'dan Go servisiga

Node.js/NestJS tajribasidan o'tayotgan dasturchi uchun xaritalash (mexanizm darajasida):

- Dependency injection konteyneri o'rniga konstruktor orqali oddiy bog'lash (91-dars). Dekoratorlar va metadata yo'q; qaramlik kodda ko'rinadi.
- `class-validator` o'rniga chegarada DTO va domen tipi ajratiladi (92-dars).
- `try/catch` o'rniga qaytariladigan `error`, `Promise.all` o'rniga goroutine va kanal/`errgroup`, NestJS interceptor'lari o'rniga `http.Handler` middleware (100-dars).
- npm skriptlari va `package.json` o'rniga `go.mod`, `go test`, `go vet`; generatsiya `go generate` (98-dars).
- Jest o'rniga standart `testing` paketi va jadvalli sinovlar.

Ko'chirishning amaliy yo'li: bitta servisni tanlang (kichik, aniq API, o'lchanadigan muammo), Go'da yozing, ikkala versiyani bir xil ish yuki bilan solishtiring va qarorni o'z raqamlaringizga tayanib chiqaring.

## Xulosa

- Til tanlash bitta o'qda emas: ish yuki (I/O yoki CPU), xotira, tiplar, xatolar, diagnostika, deployment, jamoa.
- Go'ning aniq ustunligi: bir jarayonda ko'p yadro (goroutine'lar), runtime'da haqiqiy tiplar, bitta binary. Node.js'ning ustunligi: ekosistema, frontend bilan umumiy til, jamoa ko'nikmasi.
- JavaScript'da JSON raqami float64: 64 bitli identifikatorlar Node.js'da string bo'lishi kerak. Go'da tipli maydon aniqlikni saqlaydi, `any` esa yo'q.
- Qarordan oldin o'lchang: profil (diagnostics, 100-dars) bottleneck'ni ko'rsatadi; ko'pincha u ma'lumotlar bazasida.
- Bu darsdagi raqamlar faqat shu mashinada o'lchangan; fikrlar muallifning tajribaviy bahosi deb belgilangan va o'z sharoitingizda tekshiriladi.
