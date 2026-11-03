---
n: 84
slug: slog-logging
title: "Structured logging: log/slog"
summary: "log/slog arxitekturasi: Logger va Handler, daraja va LevelVar, With/WithGroup, LogValuer bilan maxfiy ma'lumotni yashirish, context orqali request_id, go vet tekshiruvi va log yozuvlarini testlash."
duration: 40
sources:
  - id: pkg-slog
    note: "Logger, Handler, HandlerOptions (Level, ReplaceAttr), LevelVar, LogValuer, SetDefault va DiscardHandler tavsifi"
  - id: blog-slog
    note: "slog dizayn sabablari: structured logging, Handler interface va standart kutubxonaga kiritilishi"
quiz:
  - q: "`log.Info(\"saqlandi\", \"device\", \"T-104\", \"rows\")` (oxirgi kalit qiymatsiz) chaqirilsa, runtime va go vet nima qiladi?"
    options:
      - "Panic beradi"
      - "Oxirgi kalit tashlab yuboriladi"
      - "Log yozuvida `!BADKEY` kaliti paydo bo'ladi, go vet esa `missing a final value` deb ogohlantiradi"
      - "Kompilyatsiya xatosi"
    answer: 2
    explain: "Tekshirdik: juftlik to'liq bo'lmasa, yolg'iz element `!BADKEY` kaliti bilan yoziladi, ya'ni log buzuq chiqadi, lekin dastur ishlayveradi. Xatoni go vet topadi (call to slog.Logger.Info missing a final value), shuning uchun vet'ni CI'da majburiy qiling. Tip xavfsizligi kerak bo'lsa slog.String/slog.Int Attr'laridan foydalaning."
  - q: "Handler `Level: &level` bilan yaratilgan, bu yerda `var level slog.LevelVar`. Production'da qayta ishga tushirmasdan darajani Debug'ga o'zgartirish uchun nima qilinadi?"
    options:
      - "`level.Set(slog.LevelDebug)`: LevelVar goroutine'lar uchun xavfsiz, handler har yozuvda joriy darajani o'qiydi"
      - "Handler'ni qayta yaratib, slog.SetDefault bilan almashtirish kerak, boshqa yo'l yo'q"
      - "Environment o'zgaruvchisini o'zgartirish yetarli, Go uni o'zi qayta o'qiydi"
      - "`slog.Level` ning o'zini global o'zgaruvchi sifatida yozish kerak"
    answer: 0
    explain: "HandlerOptions.Level har yozuvda tekshiriladi; LevelVar esa dinamik o'zgartirish uchun mo'ljallangan va bir nechta goroutine'dan xavfsiz. Odatda darajani admin endpoint yoki signal orqali o'zgartirishadi. Nol qiymatdagi LevelVar Info darajasiga teng."
  - q: "`type Token string` uchun `func (Token) LogValue() slog.Value { return slog.StringValue(\"[YASHIRIN]\") }` yozildi. Bu nimaga xizmat qiladi?"
    options:
      - "Token log'ga umuman yozilmaydi va kalit ham yo'qoladi"
      - "Token qiymatini shifrlaydi"
      - "Faqat JSONHandler'da ishlaydi, TextHandler'da ishlamaydi"
      - "Token tipi log'ga atribut sifatida berilganda handler uning qiymatini LogValue natijasiga almashtiradi, shuning uchun maxfiy qiymat chiqmaydi"
    answer: 3
    explain: "slog.LogValuer interface'ini implement qilgan qiymatlar handler tomonidan resolve qilinadi. Kalit saqlanadi, qiymat esa almashtiriladi (chiqishda `\"token\":\"[YASHIRIN]\"`). Bu har qanday handler'da ishlaydi. Usul yagona himoya emas: qiymat boshqa tipga o'tkazib yuborilsa (masalan string(tok)), yashirish ishlamaydi."
  - q: "Custom handler `Handle(ctx, r)` ichida `ctx.Value(...)` dan request_id olmoqchi. Qaysi chaqiruv bu context'ni handler'ga yetkazadi?"
    options:
      - "`log.Info(\"...\")`: u avtomatik joriy goroutine'ning context'ini oladi"
      - "`log.InfoContext(ctx, \"...\")`: faqat Context variantlari ctx'ni uzatadi, oddiy Info context.Background() beradi"
      - "Ikkalasi ham bir xil"
      - "`slog.SetDefault(ctx)` bilan"
    answer: 1
    explain: "Oddiy Info/Warn/Error context'ni uzatmaydi (handler context.Background() ko'radi). Context'dagi qiymatlarni logga qo'shish uchun InfoContext, ErrorContext va h.k. ishlatilishi shart. Kompilyator buni tekshirmaydi, shuning uchun jamoa qoidasi yoki linter kerak."
  - q: "`db := log.WithGroup(\"db\"); db.Info(\"so'rov\", \"table\", \"points\", \"rows\", 128)` JSON chiqishida qanday ko'rinadi?"
    options:
      - "`{\"msg\":\"so'rov\",\"db.table\":\"points\",\"db.rows\":128}`"
      - "`{\"db\":\"so'rov\",\"table\":\"points\",\"rows\":128}`"
      - "`{\"msg\":\"so'rov\",\"db\":{\"table\":\"points\",\"rows\":128}}`"
      - "Atributlar guruhga kirmaydi, faqat msg o'zgaradi"
    answer: 2
    explain: "WithGroup shundan keyin qo'shiladigan atributlarni guruh ichiga joylaydi. JSONHandler guruhni ichma-ich obyekt qilib yozadi (misolimizda `\"db\":{\"table\":\"points\",\"rows\":128}`), TextHandler esa `db.table=points` ko'rinishida nuqta bilan. Guruhdan oldin log.With bilan qo'shilgan atributlar guruhdan tashqarida qoladi."
  - q: "Test bir funksiyaning log chiqarishini tekshirishi kerak. Eng sodda ishonchli usul?"
    options:
      - "Funksiyaga *slog.Logger berish; testda `slog.NewJSONHandler(&buf, nil)` bilan buferga yozdirib, JSON'ni dekod qilish"
      - "slog'ni test paytida butunlay o'chirish va log yozuvlarini tekshirmaslik"
      - "Funksiya ichida `os.Stdout`ni almashtirib, chiqishni o'qish"
      - "log yozuvlari uchun fake time.Now yozish"
    answer: 0
    explain: "Logger'ni parametr sifatida berish testni oson qiladi: buferga yozilgan JSON'ni dekod qilib maydonlarni tekshirasiz (matn formatiga bog'lanmaysiz). Log tekshirilmasa, slog.New(slog.DiscardHandler) (Go 1.24 dan) ishlatiladi. Global slog.Default() ni testda almashtirish parallel testlarni buzishi mumkin."
task:
  title: "log.Printf'dan structured slog'ga o'tish"
  prompt: |
    Quyidagi `handleLogin` eski `log.Printf` ishlatadi: parol logga ochiq yoziladi, request id matn ichiga qo'lda qo'yilgan va xatoni qidirish uchun regex kerak.

    Vazifa: `log/slog` ga o'ting. JSON handler ishlating (vaqt atributi ReplaceAttr bilan olib tashlansin, chiqish barqaror bo'lishi uchun). Parol `slog.LogValuer` bilan yashirilsin. `request_id` va `user` har chaqiruvda `log.With` bilan bir marta qo'shilsin. Muvaffaqiyatsiz login `Error` darajasida, `err` atributi bilan yozilsin. `go vet` toza o'tsin.
  lang: go
  starter: |
    package main

    import (
        "errors"
        "log"
    )

    type Credentials struct {
        User     string
        Password string
    }

    var errBadPassword = errors.New("parol noto'g'ri")

    func login(c Credentials) error {
        if c.Password != "s3cret" {
            return errBadPassword
        }
        return nil
    }

    func handleLogin(requestID string, c Credentials) {
        log.Printf("[%s] login urinishi: user=%s password=%s", requestID, c.User, c.Password)
        if err := login(c); err != nil {
            log.Printf("[%s] login xatosi: %v", requestID, err)
            return
        }
        log.Printf("[%s] login muvaffaqiyatli: user=%s", requestID, c.User)
    }

    func main() {
        handleLogin("req-1", Credentials{User: "dispatcher", Password: "s3cret"})
        handleLogin("req-2", Credentials{User: "dispatcher", Password: "xato"})
    }
  solution: |
    package main

    import (
        "errors"
        "log/slog"
        "os"
    )

    type Credentials struct {
        User     string
        Password Secret
    }

    // Secret log'ga chiqarilganda qiymatini yashiradi.
    type Secret string

    func (Secret) LogValue() slog.Value { return slog.StringValue("[YASHIRIN]") }

    var errBadPassword = errors.New("parol noto'g'ri")

    func login(c Credentials) error {
        if c.Password != "s3cret" {
            return errBadPassword
        }
        return nil
    }

    func handleLogin(log *slog.Logger, requestID string, c Credentials) {
        log = log.With("request_id", requestID, "user", c.User)
        log.Info("login urinishi", "password", c.Password)
        if err := login(c); err != nil {
            log.Error("login xatosi", "err", err)
            return
        }
        log.Info("login muvaffaqiyatli")
    }

    func main() {
        log := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
            ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
                if a.Key == slog.TimeKey && len(groups) == 0 {
                    return slog.Attr{}
                }
                return a
            },
        }))
        handleLogin(log, "req-1", Credentials{User: "dispatcher", Password: "s3cret"})
        handleLogin(log, "req-2", Credentials{User: "dispatcher", Password: "xato"})
    }
  solutionNotes: |
    - `Secret` tipi `LogValue()` metodi bilan parolni handler darajasida yashiradi: qiymatni log chaqiruvidan oldin qo'lda niqoblash esdan chiqishi mumkin, tip esa har joyda ishlaydi.
    - `log.With("request_id", ..., "user", ...)` yangi Logger qaytaradi; shu Logger'dan keyingi barcha yozuvlarga atributlar qo'shiladi, matn ichiga qo'lda yozish kerak emas.
    - Daraja semantikasi: urinish `Info`, muvaffaqiyatsizlik `Error`. Xato `err` kaliti ostida qo'yilgan, shunda log agregatori shu kalit bo'yicha qidiradi.
    - `ReplaceAttr` vaqtni olib tashlaydi: bu faqat misol chiqishi barqaror bo'lishi uchun. Production'da vaqt kerak.
    - Logger global emas, parametr sifatida beriladi: testda `bytes.Buffer` ga yozdirib, JSON'ni tekshirish mumkin.
  checklist:
    - "`log/slog` ishlatiladi, `log.Printf` qolmagan"
    - "Parol chiqishda `[YASHIRIN]` ko'rinishida, ochiq qiymat yo'q"
    - "`request_id` va `user` `log.With` orqali bir marta qo'shilgan"
    - "Muvaffaqiyatsiz login `Error` darajasida va `err` atributi bor"
    - "`go vet` ogohlantirishsiz o'tadi, chiqish JSON qatorlaridan iborat"
---

## Muammo

Production'da logni odam ham, mashina ham o'qiydi. Odam o'qiganda `fmt.Sprintf` bilan yig'ilgan matn yetarli ko'rinadi. Lekin log agregatori (Loki, Elasticsearch, CloudWatch) uchun "login xatosi user=dispatcher request=req-2" matni oddiy satr: unda user bo'yicha filtr qilish uchun regex yozish kerak, format esa har dasturchida boshqacha. Ikkinchi muammo: ochiq matnga qo'shilgan qiymat hamma narsani chiqarib yuboradi, shu jumladan parol, token va shaxsiy ma'lumotni. Uchinchisi: har log qatoriga request id ni qo'lda qo'shishni bir joyda unutish kifoya, shu so'rovning izi uziladi.

Node.js'da bu uchun `pino` yoki `winston` kabi tashqi kutubxona ishlatilgan. Go 1.21 dan standart kutubxonada `log/slog` bor: structured logging, daraja, guruhlar va almashtiriladigan backend (`Handler`). Bu dars slog'ning tuzilishini, uning aniq xatti-harakatlarini (sinab ko'rilgan chiqishlar bilan) va production uchun qaror qoidalarini beradi. Metrikalar va tracing keyingi ikki darsda (85, 86), `request_id` esa 86-darsda trace id bilan to'ldiriladi.

## Asosiy g'oya

### Uch qatlam

- **Logger**: dastur kodi chaqiradigan tomon (`Info`, `Warn`, `Error`, `Debug` va ularning `...Context` variantlari). Logger o'zi hech narsa yozmaydi.
- **Record**: bitta log hodisasi: vaqt, daraja, xabar, atributlar, chaqirilgan joy.
- **Handler**: yozuvni qanday formatlash va qayerga yozishni hal qiladi. Standart kutubxonada ikkita: `TextHandler` (`key=value`) va `JSONHandler`.

Bu bo'linish asosiy g'oya: kod faqat Logger bilan gaplashadi, format va yo'nalish esa Handler orqali almashtiriladi. Elasticsearch'ga yozish, sampling, maxfiylikni tozalash kabi narsalar o'z Handler'ini yozish bilan qo'shiladi (`blog-slog` maqolasi shu dizayn qarorini tushuntiradi).

### Atributlar

Atribut - `key=value` juftligi. Ikki yozuv shakli bor: erkin (`"device", "T-104"`) va tipli (`slog.String("device", "T-104")`). Erkin shakl qulay, lekin juftlik tashlab ketilsa, tip tekshiruvi yo'q: yolg'iz element `!BADKEY` kaliti bilan yoziladi. Buni `go vet` topadi:

```text
level=INFO msg="noto'g'ri juftlik" device=T-104 !BADKEY=yolgiz
level=INFO msg=to'g'ri device=T-104 n=3
```

`go vet` bu chaqiruvga `call to slog.Logger.Info missing a final value` deb ogohlantiradi, lekin dastur baribir ishlaydi va yuqoridagi kabi `!BADKEY=yolgiz` yozadi (TextHandler chiqishi, vaqt atributi olib tashlangan). Natija: vet CI'da majburiy bo'lishi kerak. Tipli `Attr` shakli (`slog.String`, `slog.Int`) bu xatoni kompilyatsiya vaqtida bartaraf etadi.

### Darajalar

`slog.Level` oddiy `int`: Debug -4, Info 0, Warn 4, Error 8 (tekshirdik). Oraliq qiymatlar mumkin: `slog.Level(2)` `INFO+2` deb chiqadi. `HandlerOptions.Level` minimal darajani belgilaydi; nil bo'lsa Info. Dinamik o'zgartirish uchun `slog.LevelVar` ishlatiladi: u goroutine'lar uchun xavfsiz va nol qiymati Info.

## Chuqurroq: production uchun muhim mexanikalar

### With va WithGroup

`log.With("service", "ingest")` yangi Logger qaytaradi, har keyingi yozuvga atribut qo'shiladi. Handler bu atributlarni oldindan tayyorlab qo'yishi mumkin (Handler interface'idagi `WithAttrs` aynan shu uchun), shuning uchun har chaqiruvda qaytadan uzatishdan ko'ra qulayroq. `WithGroup("db")` esa shundan keyin keladigan atributlarni guruhga joylaydi: JSON'da ichma-ich obyekt, Text'da `db.table=...`. Qoida: o'zgarmas, ko'p ishlatiladigan atributlar (servis, versiya) `With` bilan bir marta; so'rovga xos atributlar so'rov boshida yaratilgan Logger'ga.

### Context va request_id

Oddiy `Info` context'ni uzatmaydi: handler `context.Background()` ko'radi. Context'dagi qiymatlar (masalan request id) logga tushishi uchun `InfoContext(ctx, ...)` chaqirilishi va handler `Handle(ctx, r)` ichida `ctx.Value(...)` dan o'qishi kerak. Misolda `ctxHandler` shunday qiladi; `Handler` interface'ini to'liq yozmaslik uchun bazaviy handler embed qilingan, `WithAttrs` va `WithGroup` esa o'rovni saqlab qolish uchun qayta yozilgan (aks holda `With` natijasida o'rov yo'qoladi). Bu eng ko'p uchraydigan xato.

### LogValuer: maxfiylik

`LogValue() slog.Value` metodiga ega tip handler tomonidan resolve qilinadi, ya'ni log chaqiruvi emas, handler yozayotganda almashtiriladi. Parol, token va karta raqami uchun alohida tip kiritish ishonchli: tip imzosi o'zi hujjat. Kamchilik: qiymat oddiy `string` ga aylantirib yuborilsa, himoya yo'qoladi. Ikkinchi qatlam sifatida `ReplaceAttr` orqali kalit nomi bo'yicha (`password`, `authorization`) tozalash mumkin.

### Narx va Enabled

Log chaqiruvining argumentlari daraja o'chirilgan bo'lsa ham hisoblanadi. `Debug("...", "payload", expensive())` da `expensive()` har safar chaqiriladi. Qimmat argumentlarda `if log.Enabled(ctx, slog.LevelDebug) {...}` ishlating. `Logger.LogAttrs` hujjatga ko'ra `Log`ning samaraliroq varianti va faqat `Attr` qabul qiladi; issiq yo'llarda foydali. Aniq ns/op raqamlarini bu darsda o'lchamadik: o'z mashinangizda benchmark qiling (61-dars).

### Eski log paketi bilan ko'prik

`slog.SetDefault(l)` ikki ish qiladi: yuqori darajali `slog.Info` funksiyalari shu logger'ga yozadi, va eski `log.Print` chaqiruvlari ham shu logger'ning handler'i orqali o'tadi (daraja `SetLogLoggerLevel` bilan boshqariladi, standart Info). Bu kutubxonalar ichidagi `log.Printf` chiqishini ham structured log oqimiga olib kiradi.

## Misol: ingest servis logi

Quyidagi dastur yuqoridagilarni birlashtiradi: context orqali `request_id`, `LevelVar` bilan dinamik daraja, `LogValuer` bilan yashirilgan token, guruh va eski `log` paketi ko'prigi.

```go
package main

import (
	"context"
	"errors"
	stdlog "log"
	"log/slog"
	"os"
)

type ctxKey struct{}

// WithRequestID request identifikatorini context'ga qo'yadi.
func WithRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, ctxKey{}, id)
}

// ctxHandler har yozuvga context'dagi request_id ni qo'shadi.
type ctxHandler struct{ slog.Handler }

func (h ctxHandler) Handle(ctx context.Context, r slog.Record) error {
	if id, ok := ctx.Value(ctxKey{}).(string); ok {
		r.AddAttrs(slog.String("request_id", id))
	}
	return h.Handler.Handle(ctx, r)
}

func (h ctxHandler) WithAttrs(a []slog.Attr) slog.Handler { return ctxHandler{h.Handler.WithAttrs(a)} }
func (h ctxHandler) WithGroup(n string) slog.Handler      { return ctxHandler{h.Handler.WithGroup(n)} }

// Token log'ga chiqarilganda yashirinadi.
type Token string

func (Token) LogValue() slog.Value { return slog.StringValue("[YASHIRIN]") }

func main() {
	var level slog.LevelVar // default: Info
	opts := &slog.HandlerOptions{
		Level: &level,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey && len(groups) == 0 {
				return slog.Attr{} // misol chiqishi barqaror bo'lishi uchun vaqtni olib tashlaymiz
			}
			return a
		},
	}
	base := slog.New(ctxHandler{slog.NewJSONHandler(os.Stdout, opts)})
	slog.SetDefault(base)

	log := slog.Default().With("service", "ingest")
	ctx := WithRequestID(context.Background(), "req-7f3a")

	log.InfoContext(ctx, "nuqta qabul qilindi", "device", "T-104", "lat", 41.31, "lon", 69.27)
	log.Debug("bu chiqmaydi: daraja Info")

	level.Set(slog.LevelDebug)
	log.Debug("endi chiqadi", slog.Group("gps", slog.Float64("lat", 41.31), slog.Float64("lon", 69.27)))

	log.WarnContext(ctx, "auth", "token", Token("abc123"))
	log.ErrorContext(ctx, "saqlab bo'lmadi", "err", errors.New("connection refused"), "attempt", 3)

	db := log.WithGroup("db")
	db.Info("so'rov", "table", "points", "rows", 128)

	// Eski log paketi ham xuddi shu handler orqali chiqadi (Info darajasida).
	stdlog.Println("eski log.Println chaqiruvi")
}
```

Chiqish (Go 1.24.7; vaqt atributi ReplaceAttr bilan olib tashlangan, aks holda har qatorda `time` bo'ladi):

```text
{"level":"INFO","msg":"nuqta qabul qilindi","service":"ingest","device":"T-104","lat":41.31,"lon":69.27,"request_id":"req-7f3a"}
{"level":"DEBUG","msg":"endi chiqadi","service":"ingest","gps":{"lat":41.31,"lon":69.27}}
{"level":"WARN","msg":"auth","service":"ingest","token":"[YASHIRIN]","request_id":"req-7f3a"}
{"level":"ERROR","msg":"saqlab bo'lmadi","service":"ingest","err":"connection refused","attempt":3,"request_id":"req-7f3a"}
{"level":"INFO","msg":"so'rov","service":"ingest","db":{"table":"points","rows":128}}
{"level":"INFO","msg":"eski log.Println chaqiruvi"}
```

Chiqishdan o'qiladigan narsalar:

- Birinchi qator: `request_id` atributlar oxirida qo'shildi, chunki handler uni `Handle` ichida record'ga qo'shdi. Atributlar tartibi: `With` atributlari, chaqiruv atributlari, keyin handler qo'shganlar.
- `Debug` qatori ikki marta chaqirilgan, lekin faqat `level.Set(slog.LevelDebug)` dan keyingisi chiqdi.
- `slog.Group("gps", ...)` JSON'da `"gps":{...}` obyekti bo'ldi.
- Token `[YASHIRIN]` bo'ldi.
- `err` kaliti ostidagi xato `error.Error()` matni sifatida yozildi.
- `db.Info` guruhdagi atributlarni `"db":{...}` ichiga joyladi, lekin `service` (guruhdan oldin qo'shilgan) tashqarida qoldi. Bu qatorda `request_id` yo'q, chunki `db.Info` context'siz variant.
- Oxirgi qator: `log.Println` chaqiruvi `slog` handler orqali Info darajasida chiqdi.

### Log yozuvini testlash

Logger'ni parametr qilib bering va testda buferga yozdiring. Matn formatiga emas, JSON maydonlariga tayaning:

```go
package tl

import (
	"bytes"
	"encoding/json"
	"log/slog"
	"testing"
)

func process(log *slog.Logger, n int) {
	log.Info("batch saqlandi", "rows", n)
}

func TestProcessLogs(t *testing.T) {
	var buf bytes.Buffer
	log := slog.New(slog.NewJSONHandler(&buf, nil))

	process(log, 42)

	var rec map[string]any
	if err := json.Unmarshal(buf.Bytes(), &rec); err != nil {
		t.Fatalf("log JSON emas: %v: %s", err, buf.String())
	}
	if rec["msg"] != "batch saqlandi" || rec["rows"] != float64(42) {
		t.Errorf("log yozuvi = %v", rec)
	}
}

func TestProcessQuiet(t *testing.T) {
	process(slog.New(slog.DiscardHandler), 1) // Go 1.24 dan DiscardHandler
}
```

`slog.DiscardHandler` Go 1.24 dan mavjud (`go1.24.txt` API ro'yxatida bor). Chiqarishni tekshirmaydigan testlarda shuni bering.

## Qachon qo'llamaslik kerak

- Hamma narsani logga yozish xarajat. Issiq yo'lda (har telemetriya nuqtasi) har nuqtaga `Info` yozish log hajmini va CPU'ni oshiradi. Bu yerda metrika (85-dars) yoki sampling mos.
- Log metrika o'rnini bosmaydi: "necha so'rov xato berdi" kabi savol uchun log qatorlarini sanash qimmat va sekin.
- Maxfiy ma'lumotni log'ga umuman yozmaslik yaxshiroq. `LogValuer` ikkinchi qatlam, birinchisi - maxfiy qiymatni log chaqiruviga uzatmaslik.
- `slog.Default()` ni global holda hamma joyda ishlatish testlarni murakkablashtiradi. Logger'ni konstruktor orqali bering (91-dars).
- Custom Handler yozish oson ko'rinadi, lekin `WithAttrs`/`WithGroup` semantikasini to'g'ri bajarish nozik. Standart kutubxonadagi `testing/slogtest` paketi handler'ni tekshiradi (Go 1.21 dan `TestHandler`, 1.22 dan `Run`). Tayyor handler'ni o'rash (embed) yo'li xavfsizroq.
- Log darajalarini aralashtirish: xato holati `Error` ga, kutilgan biznes rad etishlar (masalan, noto'g'ri parol) esa jamoa kelishuviga ko'ra `Info`/`Warn` ga tushishi kerak, aks holda alert shovqin beradi.

## Stack'da: pino va winston bilan farq

`pino` JSON qatorlar yozadi va child logger (`logger.child({requestId})`) beradi: bu `log.With` ga mos. Node.js'da request kontekstini odatda `AsyncLocalStorage` orqali yashirin uzatishadi, Go'da esa context aniq uzatiladi (`InfoContext(ctx, ...)`), yashirin kontekst yo'q. Shuning uchun Go servisida qoida: har funksiya `ctx` oladi, logger yoki context orqali yoki konstruktor orqali keladi. Log aggregator tomonida (Loki, Elasticsearch) JSON qatorlari to'g'ridan-to'g'ri maydonlarga ajraladi; maydon nomlarini jamoa bo'yicha kelishib oling (`request_id`, `device_id`, `err`), aks holda har servis o'z nomini ishlatadi va qidiruv sinadi.

Servisni ishga tushirish joyida (main) bir marta handler quriladi: production'da JSON, lokal ishlab chiqishda Text. Daraja `LevelVar` orqali, admin endpoint yoki signal bilan o'zgartiriladi (88-dars). 86-darsda trace id va span id ham xuddi `request_id` kabi handler orqali yozuvga qo'shiladi.

## Xulosa

- slog: Logger (chaqiruv), Record (hodisa), Handler (format va yo'nalish). Format almashtirilsa kod o'zgarmaydi.
- Erkin juftlik shakli tip xavfsiz emas: `!BADKEY` xatosini `go vet` topadi, shuning uchun vet majburiy; xavfsizroq yo'l - `slog.String` kabi Attr.
- Dinamik daraja uchun `slog.LevelVar`; `With` o'zgarmas atributlar uchun, `WithGroup` guruhlash uchun.
- Context qiymatlari faqat `InfoContext` kabi variantlar va `Handle(ctx, r)` ichidagi o'qish orqali logga tushadi; o'rovchi handler `WithAttrs`/`WithGroup` ni ham o'rashi shart.
- Maxfiy qiymatlar uchun `LogValuer` tipi; qimmat argumentlarda `Enabled`; log metrika o'rnini bosmaydi.
