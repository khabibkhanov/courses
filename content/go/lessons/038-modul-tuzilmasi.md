---
n: 38
slug: modul-tuzilmasi
title: "Modul va paket tuzilmasi: internal, cmd, pkg"
summary: "Modul ichida paketlarni tashkil qilish: ildiz paketi, internal qoidasi (oxirgi internal elementi), cmd/ bilan bir nechta dastur, import cycle va nega rasmiy qo'llanma pkg/ ni tavsiya qilmaydi."
duration: 40
sources:
  - id: mod-layout
    note: "Hujjatning hamma bo'limlari: Basic package, Basic command, supporting packages (internal), Multiple packages, Multiple commands, Packages and commands in the same repository, Server project"
  - id: code-review-comments
    note: "Package Names bo'limi: ma'nosiz paket nomlaridan (util, common, misc, api, types, interfaces) qochish"
  - id: 100go
    note: "#12 (Project misorganization): kontekst yoki qatlam bo'yicha guruhlash, nano paketlar va ulkan paketlar, eksportni minimallashtirish; #13 (Creating utility packages)"
  - id: go-mod-ref
    note: "go.mod ichidagi module direktivasi modul yo'lini belgilaydi; modul zip fayli ichki modullarni (go.mod bor ichki kataloglarni) o'z ichiga olmaydi"
  - id: pkg-cmd-go
    note: "go help packages: '.' va '_' bilan boshlanadigan hamda testdata kataloglari e'tiborsiz; go help build: binary nomi oxirgi major-versiya bo'lmagan komponentdan; go help test: _test qo'shimchali paket alohida kompilyatsiya qilinadi"
quiz:
  - q: "`example.com/consumer` moduli `example.com/fleet/internal/store` ni import qilmoqchi (replace orqali lokal yo'l). `go build` nima beradi?"
    options:
      - "Ishlaydi, chunki modul replace qilingan"
      - "Faqat go vet ogohlantiradi"
      - "`use of internal package example.com/fleet/internal/store not allowed`"
      - "Ishlaydi, agar `internal` papkasi `go.mod` bilan bir darajada bo'lsa"
    answer: 2
    explain: "internal qoidasi modul chegarasida emas, import yo'li bo'yicha tekshiriladi: import faqat `example.com/fleet` yo'li bilan boshlanadigan paketlarda bo'lishi mumkin. Darsdagi tajribada aynan shu xato chiqdi, replace buni o'zgartirmadi."
  - q: "`x.com/m/a/internal/d` paketi `x.com/m/a/internal/b/internal/c` ni import qilmoqchi. Natija?"
    options:
      - "Ruxsat yo'q: oxirgi `internal` ning ota yo'li `x.com/m/a/internal/b`, d esa uning daraxtida emas"
      - "Ruxsat bor: d ham `a/internal` ichida"
      - "Ruxsat bor, chunki ikkalasi bir modulda"
      - "Kompilyator faqat birinchi `internal` ni tekshiradi, shuning uchun ruxsat bor"
    answer: 0
    explain: "Tajriba: `use of internal package ... not allowed`. Qoida oxirgi `internal` elementiga qarab ishlaydi: importer ota yo'l (`x.com/m/a/internal/b`) daraxtida bo'lishi kerak. Birinchi `internal` ga qarab yozilgan oddiy `strings.Index` tekshiruvi shu holatda noto'g'ri `true` beradi."
  - q: "Repo ham kutubxona paketini, ham ikkita bajariladigan dasturni beradi. Rasmiy qo'llanma dasturlarni qayerga qo'yishni tavsiya qiladi?"
    options:
      - "Ildiz papkaga, barcha `main.go` birgalikda"
      - "`pkg/` papkasiga"
      - "`internal/` ichiga, shunda ular import qilinmaydi"
      - "`cmd/` ichiga, har dastur o'z katalogida (`cmd/prog1`, `cmd/prog2`); o'rnatish: `go install .../cmd/prog1@latest`"
    answer: 3
    explain: "Qo'llanma: aralash repoda (paket + dastur) barcha buyruqlarni `cmd` ostiga qo'yish juda foydali. Bir katalogda bitta `package main`, shuning uchun har dastur o'z katalogida bo'ladi. `pkg/` qo'llanmada tilga olinmaydi."
  - q: "Boshqa modul `import _ \"example.com/fleet/cmd/fleetd\"` yozdi (fleetd `package main`). Natija?"
    options:
      - "Ishlaydi, `main` funksiyasi chaqirilmaydi"
      - "`import ... is a program, not an importable package`"
      - "Faqat `init` funksiyalari ishlaydi"
      - "internal xatosi"
    answer: 1
    explain: "`package main` import qilinmaydi: kompilyator `is a program, not an importable package` beradi (tajriba). Shuning uchun qayta ishlatiladigan kod `main` ga emas, alohida paketga chiqariladi, `cmd/*` esa yupqa qoladi."
  - q: "Loyihada `pkg/` papkasi ochish haqida qaysi gap aniq va tekshirilgan?"
    options:
      - "Rasmiy qo'llanma har loyihada `pkg/` ni majburiy deydi"
      - "Qo'llanmaning tavsiya etilgan tuzilmalarida `pkg/` yo'q: eksport qilinadigan paketlar ildizda yoki oddiy nomli katalogda, ichki kod `internal/` da. `pkg/` ixtiyoriy jamoa konvensiyasi"
      - "Go kompilyatori `pkg/` ni maxsus qayta ishlaydi"
      - "`pkg/` ichidagi paketlar avtomatik internal bo'ladi"
    answer: 1
    explain: "go.dev/doc/modules/layout tuzilmalarida `internal/` va `cmd/` bor, `pkg/` yo'q. GOPATH davridagi `pkg/` esa o'rnatilgan paket obyektlari katalogi edi, loyiha ichidagi `pkg/` bilan aloqasi yo'q. Loyihada `pkg/` ishlatish qarori jamoa konvensiyasi."
  - q: "`orders` paketi `payments` ni, `payments` esa `orders` ni import qiladi. Nima bo'ladi va to'g'ri chora?"
    options:
      - "Ishlaydi, Go sikllarni qo'llab-quvvatlaydi"
      - "Faqat test paytida xato"
      - "`import cycle not allowed`: umumiy qismni uchinchi paketga ajrating yoki bog'liqlikni interfeys orqali teskari qiling"
      - "Runtime'da deadlock"
    answer: 2
    explain: "Go import sikliga kompilyatsiya vaqtida ruxsat bermaydi (tajriba: `import cycle not allowed`). Chora: umumiy tiplarni alohida paketga chiqarish yoki iste'molchi tomonda kichik interfeys e'lon qilib bog'liqlik yo'nalishini o'zgartirish (37-dars)."
task:
  title: "internal qoidasini kodda tekshirish"
  prompt: |
    `Allowed(importer, imported)` import yo'llari bo'yicha `internal` qoidasini tekshirishi kerak: `internal` elementi bor paketni faqat oxirgi `internal` ning ota yo'li daraxtidagi paketlar import qila oladi. Hozirgi variant birinchi `internal` qismini qidiradi va oddiy prefiks tekshiradi, shuning uchun ikki holatda noto'g'ri javob beradi.

    Qayta yozing:
    - Yo'lni `/` bo'yicha elementlarga ajrating; `internal` elementi yo'q bo'lsa `true`.
    - Oxirgi `internal` elementini toping; ota yo'l shundan oldingi elementlar.
    - `importer` ota yo'lning o'ziga teng yoki `ota + "/"` bilan boshlansa `true` (`storex` kabi o'xshash nomlar o'tmasin).
    - `main` va holatlar jadvalini o'zgartirmang. Kutilgan chiqish: `mos kelmaslik: 0`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "strings"
    )

    // Allowed: imported paketni importer paketi import qila oladimi?
    // Qoida: "internal" katalogi ichidagi paketni faqat internal'ning
    // ota katalogi daraxtidagi paketlar import qila oladi.
    func Allowed(importer, imported string) bool {
        i := strings.Index(imported, "internal")
        if i < 0 {
            return true
        }
        return strings.HasPrefix(importer, imported[:i])
    }

    type tc struct {
        importer, imported string
        want               bool
    }

    func main() {
        cases := []tc{
            {"example.com/fleet/cmd/fleetd", "example.com/fleet/internal/store", true},
            {"example.com/consumer", "example.com/fleet/internal/store", false},
            {"example.com/fleet/store", "example.com/fleet/store/internal/sqlbuild", true},
            {"example.com/fleet", "example.com/fleet/store/internal/sqlbuild", false},
            {"example.com/fleet/storex", "example.com/fleet/store/internal/sqlbuild", false},
            {"x.com/m/a/internal/d", "x.com/m/a/internal/b/internal/c", false},
            {"x.com/m/a/internal/b/ok1", "x.com/m/a/internal/b/internal/c", true},
            {"x.com/m/ax", "x.com/m/a/internal", false},
            {"example.com/consumer", "example.com/fleet/store", true},
        }
        bad := 0
        for i, c := range cases {
            if got := Allowed(c.importer, c.imported); got != c.want {
                bad++
                fmt.Printf("holat %d: %s -> %s: %v, kutilgan %v\n", i+1, c.importer, c.imported, got, c.want)
            }
        }
        fmt.Println("mos kelmaslik:", bad)
    }
  solution: |
    package main

    import (
        "fmt"
        "strings"
    )

    // Allowed: imported paketni importer paketi import qila oladimi?
    // Qoida: "internal" katalogi ichidagi paketni faqat internal'ning
    // ota katalogi daraxtidagi paketlar import qila oladi.
    func Allowed(importer, imported string) bool {
        elems := strings.Split(imported, "/")
        last := -1
        for i, e := range elems {
            if e == "internal" {
                last = i
            }
        }
        if last < 0 {
            return true
        }
        parent := strings.Join(elems[:last], "/")
        return importer == parent || strings.HasPrefix(importer, parent+"/")
    }

    type tc struct {
        importer, imported string
        want               bool
    }

    func main() {
        cases := []tc{
            {"example.com/fleet/cmd/fleetd", "example.com/fleet/internal/store", true},
            {"example.com/consumer", "example.com/fleet/internal/store", false},
            {"example.com/fleet/store", "example.com/fleet/store/internal/sqlbuild", true},
            {"example.com/fleet", "example.com/fleet/store/internal/sqlbuild", false},
            {"example.com/fleet/storex", "example.com/fleet/store/internal/sqlbuild", false},
            {"x.com/m/a/internal/d", "x.com/m/a/internal/b/internal/c", false},
            {"x.com/m/a/internal/b/ok1", "x.com/m/a/internal/b/internal/c", true},
            {"x.com/m/ax", "x.com/m/a/internal", false},
            {"example.com/consumer", "example.com/fleet/store", true},
        }
        bad := 0
        for i, c := range cases {
            if got := Allowed(c.importer, c.imported); got != c.want {
                bad++
                fmt.Printf("holat %d: %s -> %s: %v, kutilgan %v\n", i+1, c.importer, c.imported, got, c.want)
            }
        }
        fmt.Println("mos kelmaslik:", bad)
    }
  solutionNotes: |
    - Yo'lni elementlarga ajratish `strings.Contains("internal")` xatosini yo'qotadi: `internalize` kabi nomlar `internal` elementi emas.
    - Qoida oxirgi `internal` bo'yicha ishlaydi (lokal `go build` bilan tekshirilgan): `x.com/m/a/internal/b/internal/c` ni `x.com/m/a/internal/b` daraxtidagi paket import qila oladi, `x.com/m/a/internal/d` esa yo'q.
    - Ota yo'lni `importer == parent || HasPrefix(importer, parent+"/")` bilan solishtirish element chegarasini hurmat qiladi: `example.com/fleet/storex` `example.com/fleet/store` daraxtida emas.
    - `internal` paketning o'zi (`x.com/m/a/internal`) ham cheklangan, ota yo'li `x.com/m/a`.
    - Bu faqat o'quv modeli. Haqiqiy tekshiruvni `go build` bajaradi; yo'l boshida turgan `internal` (masalan standart kutubxona) bu yerda ko'rib chiqilmagan.
  checklist:
    - "Yo'l `/` bo'yicha elementlarga ajratiladi va `internal` elementi qidiriladi"
    - "Oxirgi `internal` elementi ishlatiladi"
    - "Solishtirish element chegarasida (`parent + \"/\"`)"
    - "`main` o'zgarmagan, chiqish `mos kelmaslik: 0`"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Loyiha o'sadi va bir kuni `utils`, `common`, `models`, `helpers` papkalari paydo bo'ladi. Hamma hamma narsani import qiladi, bitta o'zgarish o'nlab paketni sindiradi, ichki yordamchi funksiyani boshqa jamoa import qilib qo'yadi va endi uni o'zgartirib bo'lmaydi. Eng yomoni, `import cycle not allowed` xatosi: ikki paket bir-birini import qila boshlaydi va refaktoring bir kunlik ishga aylanadi.

Node.js'da bunga o'rganilgan: `src/` ichida istalgan fayl istalgan faylni nisbiy yo'l bilan import qiladi, `package.json` ning `exports` maydoni esa paketning ommaviy sirtini belgilaydi, lekin ko'p loyiha uni sozlamaydi. Go'da paket tizimi qattiqroq: bitta katalog bitta paket, import sikliga kompilyator ruxsat bermaydi, ichki kodni tilning o'zi yashiradi (`internal`). Shuning uchun tuzilma qarorlari Go'da ko'proq oqibat keltiradi, lekin vositalar ham yaxshiroq.

Bu darsning manbasi Go jamoasining modul tuzilmasi qo'llanmasi (Organizing a Go module). Unda `pkg/` yo'q. Bu keng tarqalgan "standart" tuzilmalar bilan farq qiladi va dars buni ochiq aytadi.

## Asosiy g'oya

Qo'llanma tuzilmani loyiha turi bo'yicha beradi:

- **Oddiy paket:** hamma kod modul ildizida, paket nomi modul yo'lining oxirgi komponentiga teng. `go.mod`dagi `module github.com/someuser/modname` import yo'li bo'ladi.
- **Oddiy dastur:** ildizda `package main` fayllari. O'rnatish: `go install github.com/someuser/modname@latest`.
- **Yordamchi paketlar bilan paket yoki dastur:** yordamchilarni boshida `internal/` ichiga qo'ying. Qo'llanmaning izohi: boshqa modullar ular bog'liq bo'lishini istamagan paketlarga bog'lana olmaydi, shuning uchun siz API'ni tashqi foydalanuvchini sindirmasdan o'zgartira olasiz.
- **Bir nechta paket:** har paket o'z katalogida, ierarxik bo'lishi mumkin. Qo'llanma: paketlarni imkon qadar `internal` da saqlash tavsiya etiladi.
- **Bir nechta dastur:** har biri o'z katalogida (`prog1/main.go`, `prog2/main.go`), umumiy kod ildizdagi `internal/` da.
- **Paket va dastur bir repoda:** dasturlar `cmd/` ostida (`cmd/prog1`, `cmd/prog2`), o'rnatish `go install .../cmd/prog1@latest`. Qo'llanma `cmd/` aralash repoda juda foydali ekanini aytadi.
- **Server loyihasi:** server odatda eksport qilinadigan paket bermaydi, shuning uchun uning mantiqiy paketlari `internal/` da, dasturlar `cmd/` da, Go bo'lmagan fayllar (skriptlar, frontend, Docker) boshqa kataloglarda bo'ladi.

Shu ro'yxatdan bitta xulosa: qo'llanmada `pkg/` yo'q. `pkg/` ko'p loyihada uchraydi, lekin bu jamoa konvensiyasi; qo'llanma uni tilga olmaydi. Eksport qilinadigan paketlar ildizda yoki oddiy nomli kataloglarda turadi (`auth/`, `hash/`).

100 Go Mistakes #12 shu fikrni qo'shadi: kontekst bo'yicha (customer, contract) ham, qatlam bo'yicha (hexagonal) ham guruhlash mumkin, asosiysi izchillik. Muddatidan oldin paketlarga bo'lmang, o'nlab "nano" paketlar (1-2 fayl) ham, ulkan paketlar ham yomon; paketni nima tarkibida borligi bo'yicha emas, nima taqdim etishi bo'yicha nomlang; eksportni minimallashtiring, shubha bo'lsa eksport qilmang. #13 esa `common`, `util`, `shared` paketlari o'quvchiga foyda bermasligini, ularni ma'noli nomli paketlarga ajratishni tavsiya qiladi. Code Review Comments (Package Names) ham `util`, `common`, `misc`, `api`, `types`, `interfaces` kabi ma'nosiz nomlardan qochishni aytadi.

## Chuqurroq: internal qoidasi va cmd

### internal qanday ishlaydi

`go` buyrug'i hujjatiga ko'ra `internal` nomli katalog ichidagi (yoki tagidagi) kodni faqat internal'ning ota yo'li bilan bir xil import yo'li prefiksiga ega kod import qila oladi. Masalan, `example.com/m/orders/internal/baz` faqat `example.com/m/orders` prefiksli paketlarda import qilinadi (hujjatdagi misolning o'zimizga moslangan shakli). Tekshiruv import yo'li bo'yicha, fayl tizimi bo'yicha emas, shuning uchun `replace` bilan lokal yo'ldan ulangan modul ham cheklanadi.

Lokal tajribada (Go 1.24.7) aniqlangan nozik joylar (shu qoidalar darsdagi topshiriqda modellashtirilgan):

- Bir yo'lda bir nechta `internal` bo'lsa, oxirgisi hisobga olinadi: `x.com/m/a/internal/b/internal/c` ni `x.com/m/a/internal/b` daraxtidagi paket import qila oladi, `x.com/m/a/y` yoki `x.com/m/a/internal/d` esa yo'q.
- `internal` paketning o'zi ham cheklangan: `x.com/m/a/internal` ni `x.com/m/ax` import qila olmaydi, `x.com/m/a` esa oladi.
- Solishtirish element chegarasida: `x.com/m/ax` paketi `x.com/m/a` daraxtiga kirmaydi.

Muhim oqibat: `internal` ni birinchi kundan ishlating. Ommaviy API'ga o'tkazish oson (paketni `internal/` dan chiqarasiz), teskarisi esa mijozlarni sindiradi.

### Modul yo'li va import yo'li

Paketning import yo'li modul yo'li (`go.mod`dagi `module` direktivasi) va paket katalogining modul ildiziga nisbatan yo'lidan tuziladi. Shuning uchun katalogni ko'chirish import yo'lini o'zgartiradi va barcha mijozlarni sindiradi. Eksport qilinadigan kataloglar nomini va chuqurligini ehtiyotkorlik bilan tanlang; ichki kataloglarni esa `internal` ostida bemalol ko'chirish mumkin, chunki ularning mijozlari faqat sizning modulingiz.

Amaliy qaror ketma-ketligi, qo'llanma va 100 Go Mistakes #12 asosida:

- Yangi kod qayerga tushadi? Mijozlar import qilishi kerak bo'lsa ildiz yoki oddiy nomli katalog, aks holda `internal/`.
- Yangi katalog ochishdan oldin: ikkita fayl uchun paket kerakmi yoki mavjud paketga kiradimi? Ikki fayllik "nano" paketlar o'qishni qiyinlashtiradi.
- Paket nomi nima taqdim etishini aytadimi (`auth`, `store`) yoki nima saqlashini (`models`, `utils`)?
- Bu paket yana boshqasini import qiladimi va teskarisi bo'lishi mumkinmi? Bo'lsa, hozir ajrating, sikl keyin og'riqliroq.

### cmd va package main

Bitta katalogda bitta paket bo'ladi, `package main` bo'lsa u bitta dasturni bildiradi. Shuning uchun bir nechta dastur uchun har biriga alohida katalog kerak. `package main` import qilinmaydi: kompilyator `import "..." is a program, not an importable package` deydi (tajribada tasdiqlangan). Natijada qayta ishlatiladigan mantiq `main` paketida emas, alohida paketda turadi, `cmd/*/main.go` esa yupqa: bayroqlar, konfiguratsiya, bog'liqliklarni ulash, `Run()` chaqirish.

### Siklar

Go'da import sikliga kompilyatsiya vaqtida ruxsat yo'q. Tajribada ikki paket bir-birini import qilganda: `import cycle not allowed`. Sikl odatda dizayn signali: ikki paket aslida bitta, yoki umumiy qismni uchinchi paketga chiqarish kerak, yoki bog'liqlik yo'nalishi noto'g'ri. Ko'pincha iste'molchi tomonda kichik interfeys e'lon qilish yo'nalishni to'g'rilaydi (37-dars).

### Go vositasi ko'rmaydigan kataloglar

Hamma katalog ham paket emas. `go help packages` hujjati: nomi `.` yoki `_` bilan boshlanadigan katalog va fayllarni, shuningdek `testdata` nomli kataloglarni `go` vositasi e'tiborsiz qoldiradi. Bu `./...` andozasiga ham tegishli. Lokal tajriba (Go 1.24.7): modul ildizida `testdata/fixtures`, `_scratch` va `.hidden` kataloglarida `.go` fayllar bor, `tools/` ichida esa o'z `go.mod` fayli bor. `go list ./...` faqat uchta paketni qaytardi:

```text
example.com/fleet/cmd/fleetd
example.com/fleet/orders
example.com/fleet/store
```

`testdata`, `_scratch`, `.hidden` ro'yxatda yo'q (ularda `.go` fayllar bor edi). `tools/gen` ham yo'q, chunki o'z `go.mod` fayli bo'lgan katalog alohida modul: u ota modulning paketlar daraxtiga kirmaydi. `go.dev/ref/mod` ham shuni tasdiqlaydi: modul zip fayli ichki modullarni (`go.mod` bor ichki kataloglarni) o'z ichiga olmaydi. Amaliy oqibatlar: test ma'lumotlari va namuna fayllarni `testdata` ga qo'ying (ular `go build ./...` va `go vet ./...` ga tushmaydi); generator yoki yordamchi vositani alohida modul qilsangiz, uning bog'liqliklari asosiy modul `go.mod` ni ifloslantirmaydi, lekin uni `go test ./...` ham ko'rmaydi va alohida yurgizish kerak (bir nechta modulni birga ishlatish uchun 39-darsdagi workspace bor).

### Test paketi va import sikli

Import sikli testda ham taqiqlangan, va bu tuzoq tez-tez uchraydi. `store` paketining testi `orders` ni import qilsa, `orders` esa o'z navbatida `store` ni import qilsa, `package store` ichidagi test tsikl hosil qiladi. Yuqoridagi modulda aynan shunday test yozilganda:

```text
# example.com/fleet/store
package example.com/fleet/store
	imports example.com/fleet/orders from store_test.go
	imports example.com/fleet/store from orders.go: import cycle not allowed in test
FAIL	example.com/fleet/store [setup failed]
```

`go test` hujjatiga ko'ra `_test` qo'shimchali paket nomini e'lon qilgan test fayllar alohida paket sifatida kompilyatsiya qilinadi. Test faylining birinchi qatorini `package store_test` ga o'zgartirib, `store` ni oddiy import qilsak, xato yo'qoldi (`ok  	example.com/fleet/store	0.002s`). Bunday "tashqi test" paketi `store` ga faqat eksport qilingan API orqali qaraydi, ya'ni u mijoz ko'zi bilan yozilgan test. Ikki oqibat: eksport qilinmagan nomlarni sinash kerak bo'lsa, ichki test (`package store`) kerak, va sikl hosil bo'lsa, odatda ham testni, ham dizaynni qayta ko'rish kerak (yuqoridagi "Siklar" bo'limi).

### Binary nomi

`go build ./cmd/fleetd` natijasi `fleetd` nomli fayl bo'ladi. Hujjat (`go help build`): bitta `main` paket kompilyatsiya qilinganda binary paket import yo'lining oxirgi major-versiya bo'lmagan komponenti nomi bilan yoziladi, ya'ni `example.com/foo/v2` uchun `foo`, `v2` emas. Shuning uchun `cmd/` ostidagi katalog nomi binary nomini belgilaydi va uni mayda-chuyda emas, dastur nomi sifatida tanlang (`cmd/fleetd`, `cmd/main` emas). Lokal tajribada `GOBIN=... go install ./cmd/fleetd` ham `fleetd` nomli fayl qoldirdi (bu hujjatda alohida yozilmagan, faqat kuzatuv).

## Misol: fleet moduli

Telemetriya kutubxonasi va dasturi bir repoda. Ommaviy API ildizda (`fleet`), ichki ombor va normallashtirish `internal/` da, `store` ommaviy paketi o'z ichki `sqlbuild` yordamchisiga ega, dastur `cmd/fleetd` da. Fayllar:

```text
go.mod                              (module example.com/fleet)
fleet.go                            (package fleet - ommaviy API)
internal/store/store.go             (faqat example.com/fleet daraxti)
internal/telemetry/ids.go
store/store.go                      (ommaviy paket)
store/internal/sqlbuild/sqlbuild.go (faqat example.com/fleet/store daraxti)
cmd/fleetd/main.go                  (package main)
```

Ommaviy API:

```go
// Package fleet avtopark telemetriyasi uchun ommaviy API.
package fleet

import (
	"example.com/fleet/internal/store"
	"example.com/fleet/internal/telemetry"
)

// Service sensor o'qishlarini qabul qiladi va saqlaydi.
type Service struct {
	store *store.Memory
}

// New bo'sh Service yaratadi.
func New() *Service {
	return &Service{store: store.NewMemory()}
}

// Record bitta o'qishni saqlaydi va uni normallashtiradi.
func (s *Service) Record(sensor string, liters float64) {
	s.store.Put(telemetry.NormalizeID(sensor), liters)
}

// Total barcha saqlangan o'qishlar yig'indisini qaytaradi.
func (s *Service) Total() float64 {
	return s.store.Sum()
}
```

Dastur ommaviy paketlarni ulaydi:

```go
package main

import (
	"fmt"

	"example.com/fleet"
	"example.com/fleet/store"
)

func main() {
	svc := fleet.New()
	svc.Record(" FUEL-1 ", 12.5)
	svc.Record("fuel-1", 7.5)
	svc.Record("fuel-2", 3)
	fmt.Printf("jami: %.1f\n", svc.Total())
	fmt.Println(store.InsertSQL("readings"))
}
```

`go run ./cmd/fleetd`:

```text
jami: 23.0
INSERT INTO readings (sensor, liters) VALUES ($1, $2)
```

`go list ./...` modul ichidagi barcha paketlarni ko'rsatadi:

```text
example.com/fleet
example.com/fleet/cmd/fleetd
example.com/fleet/internal/store
example.com/fleet/internal/telemetry
example.com/fleet/store
example.com/fleet/store/internal/sqlbuild
```

Endi boshqa modul (`example.com/consumer`, `replace example.com/fleet => ../fleet`) ichki paketni import qilsa:

```text
package example.com/consumer
	main.go:7:2: use of internal package example.com/fleet/internal/store not allowed
```

Dasturning `package main` paketini import qilsa:

```text
main.go:7:2: import "example.com/fleet/cmd/fleetd" is a program, not an importable package
```

Ikki xato ham kompilyatsiya vaqtida. Mijoz faqat `example.com/fleet` va `example.com/fleet/store` ga bog'lana oladi; `internal/store` ni keyinchalik butunlay o'zgartirish xavfsiz.

## Qachon qo'llamaslik kerak

- Bitta fayllik yoki kichik dastur uchun `cmd/`, `internal/` kerak emas. Qo'llanmaning o'zi eng oddiy shakldan boshlaydi (ildizda `main.go`). Muddatidan oldin paketlarga bo'lish loyihani murakkablashtiradi (100 Go Mistakes #12).
- `internal/` ichiga hamma narsani yashirmang, agar kutubxona sifatida foydalanilishi kerak bo'lsa. Aks holda mijozlar kodni ko'chirishga yoki fork qilishga majbur bo'ladi.
- Qatlam bo'yicha papkalar (`controllers/`, `services/`, `models/`, `repositories/`) har tur loyihada ham yaxshi emas: bitta funksiya uchun beshta paketda o'zgartirish kerak bo'ladi va tez siklga olib keladi. Qatlamli guruhlash ham, kontekst bo'yicha ham to'g'ri bo'lishi mumkin, muhimi izchillik (#12). Qaysi biri sizning jamoangiz uchun yaxshiroq ekani bu darsda o'lchanmagan, bu tajribaviy qaror.
- `pkg/` papkasini avtomatik ravishda qo'shmang: qo'llanma uni tavsiya qilmaydi, u qo'shimcha chuqurlik va uzun import yo'llari qo'shadi. Agar jamoada konvensiya bo'lsa, izchil qoling (bu muallifning bahosi, hujjatda `pkg/` haqida gap yo'q).
- Generik nomlar (`utils`, `common`) bilan paket yaratmang: ularni funksiya nima qilishi bo'yicha nomlang (`strutil` emas, aniq vazifa).

## Stack'da: Node.js/TypeScript bilan solishtirish

- `package.json` `exports` maydoni Node.js'da ommaviy sirtni belgilaydi; Go'da shu vazifani `internal/` va eksport qilingan (bosh harfli) nomlar bajaradi, va tekshiruvni kompilyator qiladi.
- Monorepo (`apps/api`, `packages/shared`) Go'da odatda bitta modul ichida `cmd/` va `internal/` yoki bir nechta modul + `go.work` (39-dars).
- NestJS modul tizimi (`@Module`) bog'liqliklarni runtime'da ulaydi; Go'da bog'liqlik import yo'li va `main`dagi qo'lda ulash bilan belgilanadi, shuning uchun sikl yo'qligi kompilyator tomonidan kafolatlanadi.
- Barrel fayllar (`index.ts`) Go'da yo'q: paket o'zi eksport sirti. Bir katalog bir paket, papka chuqurligi ma'no beradi.

## Xulosa

- Eng oddiy shakldan boshlang (ildizda paket yoki `main.go`), `internal/` ni yordamchi kod paydo bo'lishi bilan qo'shing.
- `internal` qoidasi import yo'li bo'yicha, oxirgi `internal` elementi va element chegarasida tekshiriladi; qo'llanma imkon qadar paketlarni `internal` da saqlashni tavsiya qiladi.
- Bir nechta dastur yoki paket + dastur aralash repoda dasturlar `cmd/<nom>/` ostida; `package main` import qilinmaydi, mantiqni alohida paketga chiqaring.
- Qo'llanmada `pkg/` yo'q: bu jamoa konvensiyasi, majburiyat emas. `util`/`common` kabi ma'nosiz paket nomlaridan qoching.
- Import sikli kompilyator xatosi va dizayn signali: umumiy qismni ajrating yoki bog'liqlik yo'nalishini interfeys bilan teskari qiling.
- Go vositasi `.` va `_` bilan boshlanadigan hamda `testdata` kataloglarini, ichida `go.mod` bor kataloglar esa ota modul paketlaridan chetda qoladi. Sikl testda ham xato: `package x_test` tashqi test paketi uni sindiradi, binary nomi esa `cmd/<nom>` katalogidan olinadi.
