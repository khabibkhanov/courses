---
n: 40
slug: hujjat-lint-modernize
title: "Hujjat, gofmt, vet, linter va go fix modernizer'lari"
summary: "Doc comment qoidalari va go doc, gofmt doc izohlarni ham qayta formatlashi, go vet topadigan xatolar, Go 1.26 dagi go fix modernizer'lari va //go:fix inline, hamda Go 1.27 yangiliklari."
duration: 40
sources:
  - id: doc-comment
    note: "Packages, Types, Funcs, Doc links, Lists, Deprecations (Deprecated: paragraf), Directives, Common mistakes and pitfalls bo'limlari; gofmt doc izohlarni kanonik shaklga keltirishi"
  - id: go126
    note: "Tools, Go command: go fix qayta yozilgani, modernizer'lar, //go:fix inline, go mod init pastroq go versiya"
  - id: go127
    note: "Go command (go fix: yangi modernizer'lar, go test va stdversion), Gofmt (ustun tekislash o'zgarishi), Vet (printf %w ko'rsatkich)"
  - id: code-review-comments
    note: "Gofmt, Comment Sentences, Doc Comments, Error Strings, Indent Error Flow, Initialisms bo'limlari"
quiz:
  - q: "Paket izohining birinchi jumlasi doc comment qoidasiga ko'ra qanday boshlanishi kerak (paket nomi `meter`)?"
    options:
      - "`meter` nomi bilan, kichik harfda"
      - "`Package meter ...` bilan"
      - "Paket vazifasining tavsifi bilan, nom shart emas"
      - "`// Package: meter` sarlavhasi bilan"
    answer: 1
    explain: "Doc comment qoidasi: paket izohining birinchi jumlasi `Package ` bilan boshlanadi (buyruqlar uchun dastur nomi bilan). Darsdagi topshiriqdagi Lint aynan shuni tekshiradi."
  - q: "Doc izohda `*` belgisi bilan yozilgan ro'yxat bor va `gofmt -l` faylni ro'yxatga oldi. `gofmt -w` nima qiladi?"
    options:
      - "Hech narsa, gofmt izohlarga tegmaydi"
      - "Izohni o'chiradi"
      - "Ro'yxatni abzasga aylantiradi"
      - "Doc izohni kanonik shaklga keltiradi: ro'yxat belgisi `-` bo'ladi, chekinish me'yorlanadi"
    answer: 3
    explain: "gofmt doc izoh elementlarini (ro'yxat, kod bloki, sarlavha) kanonik formatga keltiradi. Darsda `//   * manfiy...` qatori `//   - manfiy...` ga o'zgardi (gofmt -d)."
  - q: "`func report(c Counter, ...)` bunda Counter ichida `sync.Mutex` bor. Kod kompilyatsiya bo'ladi. `go vet` nima deydi?"
    options:
      - "Hech narsa, vet faqat sintaksis tekshiradi"
      - "`report passes lock by value: ... contains sync.Mutex` va chaqiruv joyida `call of report copies lock value`"
      - "Faqat `unused parameter` ogohlantirishi"
      - "Data race topadi"
    answer: 1
    explain: "vet'ning copylocks tekshiruvi lock'ni qiymat bo'yicha uzatishni topadi. Darsdagi tajribada ikkala xabar ham chiqdi. Bu race detector emas: u statik tekshiruv, kompilyatsiya o'tgan kodning shubhali konstruksiyalarini topadi."
  - q: "Go 1.26 da `go fix -diff ./...` nima qiladi?"
    options:
      - "Barcha fayllarni darhol qayta yozadi"
      - "Yangi go versiyasini go.mod ga yozadi"
      - "Tuzatishlarni qo'llamaydi, unified diff sifatida chop etadi va diff bo'sh bo'lmasa noldan farqli kod bilan chiqadi"
      - "Faqat gofmt ishlatadi"
    answer: 2
    explain: "cmd/go hujjati: -diff bo'lsa har fix qo'llanmaydi, patch unified diff ko'rinishida chop etiladi va diff bo'sh bo'lmasa chiqish kodi noldan farqli. Bu CI'da 'kod zamonaviymi' tekshiruvi uchun qulay."
  - q: "`//go:fix inline` direktivasi nima uchun va qayerga yoziladi?"
    options:
      - "Funksiyani kompilyatorda inline qilishga majburlaydi (optimallashtirish)"
      - "Funksiyani testdan chiqaradi"
      - "Fayl yuklanishini tezlashtiradi"
      - "Eski funksiya e'lonining doc izohi oxiriga yoziladi; `go fix` shu funksiyaga har chaqiruvni tanasi bilan almashtirib, mijozlarning API'ni ko'chirishini avtomatlashtiradi"
    answer: 3
    explain: "Go 1.26 release notes: source-level inliner foydalanuvchilarga o'z API migratsiyalarini `//go:fix inline` direktivalari bilan avtomatlashtirish imkonini beradi. Bu kompilyator optimizatsiyasi emas, kod o'zgartirish vositasi. Misolni Go blogi ham shu tarzda ko'rsatadi."
  - q: "Go 1.26 toolchain bilan yangi modulda `go mod init` ishlatildi. go.mod da qaysi `go` qatori bo'ladi?"
    options:
      - "`go 1.25.0`: Go 1.N toolchain `go 1.(N-1).0` yozadi"
      - "`go 1.26.0`"
      - "`go 1.24.0`"
      - "Qator yozilmaydi"
    answer: 0
    explain: "Release notes: toolchain 1.N.X `go 1.(N-1).0` yozadi; Go 1.26 va uning minor relizlari `go 1.25.0` yozadi (nomzod relizlar `go 1.24.0`). Maqsad: hozirda qo'llab-quvvatlanadigan Go versiyalari bilan mos modullarni rag'batlantirish. Nazorat uchun `go get go@version`."
task:
  title: "Doc izoh qoidalari uchun mini-linter"
  prompt: |
    `Lint` kichik Go manba matnini `go/parser` bilan o'qib, eksport qilingan nomlar uchun doc izoh qoidalarini tekshiradi. Hozirgi variant faqat izohsiz funksiyalarni topadi.

    Kengaytiring (`parser.ParseComments` allaqachon yoqilgan):
    - Paket izohi bo'lmasa yoki `Package <nom>` bilan boshlanmasa: `paket: izoh "Package <nom>" bilan boshlanmaydi`.
    - Eksport qilingan funksiya va metodlar: izoh yo'q bo'lsa `<Nom>: doc yo'q`; izoh bor, lekin birinchi so'z nom bo'lmasa `<Nom>: izoh nom bilan boshlanmaydi`.
    - Eksport qilingan tiplar uchun xuddi shu (`ts.Doc` yo'q bo'lsa `GenDecl.Doc` ni ishlating). Birinchi so'z `A`, `An` yoki `The` bo'lsa, keyingi so'zni tekshiring.
    - Natija manba tartibida; eksport qilinmagan nomlar tekshirilmaydi. `main` va `sample`ni o'zgartirmang.
    - Kutilgan chiqish: `paket: izoh "Package fleet" bilan boshlanmaydi`, `Point: doc yo'q`, `Read: izoh nom bilan boshlanmaydi`, `Close: doc yo'q` (har biri alohida qatorda).
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "go/ast"
        "go/parser"
        "go/token"
    )

    const sample = `// Fleet monitoring helpers.
    package fleet

    type Point struct{}

    // A Reader reads points.
    type Reader struct{}

    // reads a point
    func (r *Reader) Read() {}

    func Close() {}

    // Total returns the sum.
    func Total() {}

    func helper() {}
    `

    // Lint eksport qilingan nomlar uchun doc izoh qoidalarini tekshiradi.
    func Lint(src string) ([]string, error) {
        fset := token.NewFileSet()
        f, err := parser.ParseFile(fset, "sample.go", src, parser.ParseComments)
        if err != nil {
            return nil, err
        }
        var out []string
        for _, d := range f.Decls {
            if fn, ok := d.(*ast.FuncDecl); ok && fn.Name.IsExported() && fn.Doc == nil {
                out = append(out, fn.Name.Name+": doc yo'q")
            }
        }
        return out, nil
    }

    func main() {
        issues, err := Lint(sample)
        if err != nil {
            fmt.Println("xato:", err)
            return
        }
        for _, s := range issues {
            fmt.Println(s)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "go/ast"
        "go/parser"
        "go/token"
        "strings"
    )

    const sample = `// Fleet monitoring helpers.
    package fleet

    type Point struct{}

    // A Reader reads points.
    type Reader struct{}

    // reads a point
    func (r *Reader) Read() {}

    func Close() {}

    // Total returns the sum.
    func Total() {}

    func helper() {}
    `

    func check(name string, doc *ast.CommentGroup) string {
        if doc == nil {
            return name + ": doc yo'q"
        }
        words := strings.Fields(doc.Text())
        if len(words) > 0 && (words[0] == "A" || words[0] == "An" || words[0] == "The") {
            words = words[1:]
        }
        if len(words) == 0 || words[0] != name {
            return name + ": izoh nom bilan boshlanmaydi"
        }
        return ""
    }

    // Lint eksport qilingan nomlar uchun doc izoh qoidalarini tekshiradi.
    func Lint(src string) ([]string, error) {
        fset := token.NewFileSet()
        f, err := parser.ParseFile(fset, "sample.go", src, parser.ParseComments)
        if err != nil {
            return nil, err
        }
        var out []string
        if f.Doc == nil || !strings.HasPrefix(f.Doc.Text(), "Package "+f.Name.Name) {
            out = append(out, fmt.Sprintf("paket: izoh \"Package %s\" bilan boshlanmaydi", f.Name.Name))
        }
        for _, d := range f.Decls {
            switch d := d.(type) {
            case *ast.FuncDecl:
                if d.Name.IsExported() {
                    if msg := check(d.Name.Name, d.Doc); msg != "" {
                        out = append(out, msg)
                    }
                }
            case *ast.GenDecl:
                if d.Tok != token.TYPE {
                    continue
                }
                for _, s := range d.Specs {
                    ts := s.(*ast.TypeSpec)
                    doc := ts.Doc
                    if doc == nil {
                        doc = d.Doc
                    }
                    if ts.Name.IsExported() {
                        if msg := check(ts.Name.Name, doc); msg != "" {
                            out = append(out, msg)
                        }
                    }
                }
            }
        }
        return out, nil
    }

    func main() {
        issues, err := Lint(sample)
        if err != nil {
            fmt.Println("xato:", err)
            return
        }
        for _, s := range issues {
            fmt.Println(s)
        }
    }
  solutionNotes: |
    - `go/parser` + `go/ast` bilan linter yozish `go vet` va `go fix` analyzer'lari ishlaydigan shu g'oyaning kichik ko'rinishi: AST'ni kezib, qoidani tekshirish. Haqiqiy analyzer'lar `golang.org/x/tools/go/analysis` ustida quriladi (bu yerda uchinchi tomon modul ishlatilmadi).
    - `doc.Text()` izohdagi `//` belgilarini olib tashlaydi, shuning uchun `strings.Fields` bilan birinchi so'zni olish oson.
    - Guruhlangan `type (...)` e'lonida har spec o'z `Doc` iga ega bo'lishi mumkin; yagona `type T ...` da izoh `GenDecl.Doc` da bo'ladi. Shu sababli `ts.Doc` yo'q bo'lsa `d.Doc` ga qaytiladi.
    - `A`, `An`, `The` bilan boshlanuvchi izohlar tip uchun qabul qilingan (doc-comment hujjatidagi `A Reader serves ...` misoli). Bu yerda soddalik uchun hamma nomga qo'llanadi.
    - Bu o'quv linteri: `const`/`var` va guruhlangan e'lonlar, `Deprecated:` abzaslari ko'rib chiqilmagan.
  checklist:
    - "Paket izohi `Package <nom>` bilan tekshiriladi"
    - "Funksiya, metod va tip uchun izoh yo'qligi va noto'g'ri boshlanishi ajratiladi"
    - "Tip izohida `A`, `An`, `The` artikllari hisobga olinadi"
    - "Natija manba tartibida, eksport qilinmagan nomlar o'tkazib yuboriladi"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Code review'ning yarmi mexanik narsalarga ketadi: chekinish, import tartibi, izoh yo'qligi, `Printf` formati noto'g'ri. Bu ishni odam qilmasligi kerak. Go bu yerda boshqa ekotizimlardan farq qiladi: formatlash, statik tekshiruv va hujjat vositalari tilning o'zi bilan keladi, ularning sozlamalari deyarli yo'q va natijasi hamma loyihada bir xil.

Uchta og'riq takrorlanadi. Birinchisi: eksport qilingan API'da izoh yo'q yoki noto'g'ri, `go doc` va pkg.go.dev bo'sh sahifa ko'rsatadi, mijoz kodni o'qishga majbur. Ikkinchisi: kompilyatsiya bo'ladigan, lekin xato kod: mutex qiymat bo'yicha uzatilgan, `Printf` argumenti turi mos emas, struct tegi buzuq. Uchinchisi: kod bir necha yillik, eski idiomalar bilan to'la (qo'lda yozilgan `for` o'rniga yangi standart funksiyalar), va kodni yangilash qo'lda bajariladigan zerikarli ish.

Node.js bilan farq: u yerda Prettier, ESLint, TypeScript, TSDoc, codemod'lar alohida o'rnatiladigan va sozlanadigan vositalar. Go'da `gofmt`, `go vet`, `go doc`, `go fix` toolchain ichida.

## Asosiy g'oya

**Doc comment.** Go hujjati izohlardan olinadi. Doc comment: top-level `package`, `const`, `func`, `type`, `var` e'lonidan oldin, orada bo'sh qator bo'lmagan izoh. Doc comment qoidalari hujjatda yozilgan:

- Har eksport qilingan nomda doc comment bo'lishi kerak. Code Review Comments ham buni takrorlaydi va qo'shadi: murakkab eksport qilinmagan tip yoki funksiyaga ham.
- Izoh to'liq gap bo'lib, tasvirlanayotgan narsa nomi bilan boshlanadi va nuqta bilan tugaydi.
- Paket izohi `Package <nom>` bilan boshlanadi; ko'p fayllik paketda faqat bitta faylda bo'ladi, aks holda izohlar birlashtiriladi. Buyruq (command) izohi dastur nomi bilan boshlanadi.
- Tip izohi har bir nusxa nimani ifodalashini tushuntiradi. Odatiy kutilma: tip bir vaqtda faqat bitta goroutine uchun xavfsiz; kuchliroq kafolat bo'lsa, izohda yozing. Go tiplari nol qiymati foydali bo'lishga intilishi kerak (37-dars).
- Funksiya izohi nima qaytarishini (yoki nima qilishini) aytadi. Parametr va natija nomlariga maxsus belgisiz to'g'ridan-to'g'ri murojaat qilinadi.
- `[Name]`, `[pkg.Name]` shaklidagi doc linklar boshqa identifikatorlarga havola yaratadi (`[io.EOF]`, `[*bytes.Buffer]`).
- Ro'yxat: chekinilgan qator, birinchisi `*`, `+`, `-` yoki `•` belgisi yoki raqam bilan boshlanadi. Chekinilgan qatorlar kod bloki hisoblanadi.
- Eskirgan identifikator uchun alohida abzas `Deprecated:` bilan boshlanadi. Ba'zi vositalar eskirgan nomni ishlatganda ogohlantiradi, pkg.go.dev esa hujjatni sukut bo'yicha yashiradi.

**gofmt.** Code Review Comments: gofmt mexanik uslub muammolarining ko'pini avtomatik tuzatadi va tashqaridagi deyarli hamma Go kodi uni ishlatadi. `go fmt` aslida `gofmt -l -w` ni ishga tushiradi (cmd/go hujjati). Doc comment hujjati qo'shadi: gofmt doc izohlarni ham kanonik shaklga keltiradi, ro'yxat, kod bloki va sarlavhalarni qayta formatlaydi, boshidagi va oxiridagi bo'sh qatorlarni olib tashlaydi. Bu `1+2 * 3` ni `1 + 2*3` ga aylantirishga o'xshash. Shuning uchun CI'da `gofmt -l` bo'sh bo'lishi shart qilib qo'yiladi.

**go vet.** Kompilyatsiya bo'ladigan, lekin shubhali konstruksiyalarni topuvchi statik tahlil to'plami. Quyidagi misolda vet printf formatlari, lock nusxalash, natijasi ishlatilmagan chaqiruvlar, o'z-o'ziga tayinlash va buzuq struct teglarini topdi (to'liq ro'yxat bu darsda keltirilmagan). `go vet` Go analysis frameworkida qurilgan: analyzer kodni tekshiradi va ba'zan tuzatish taklif qiladi.

**go fix va modernizer'lar.** Go 1.26 release notes: eski `go fix` butunlay qayta yozilgan va endi Go modernizer'larining uyi. U kodni oxirgi idioma va kutubxona API'lariga yangilashning ishonchli, bir tugmali usulini beradi. Boshlang'ich to'plamda o'nlab fixer bor (til va kutubxonaning zamonaviy imkoniyatlaridan foydalanish), va source-level inliner: foydalanuvchilar o'z API migratsiyalarini `//go:fix inline` direktivalari bilan avtomatlashtiradi. Fixer'lar dastur xulqini o'zgartirmasligi kerak, aks holda xato sifatida xabar qilinadi. Yangi `go fix` aynan `go vet` bilan bir xil analysis frameworkida qurilgan, ya'ni vet diagnostikalarini beradigan analyzer'lar tuzatishni ham taklif qilib qo'llay oladi. Eski, eskirgan fixer'lar olib tashlangan.

## Chuqurroq: go fix, 1.27 yangiliklari va linter

### go fix qanday ishlatiladi

cmd/go hujjati: `go fix [build flags] [-fixtool prog] [fix flags] [packages]` cmd/fix vositasini ishga tushirib, tavsiya etilgan tuzatishlarni qo'llaydi. `-diff` bayrog'i tuzatishni qo'llamasdan unified diff chop etadi va diff bo'sh bo'lmasa noldan farqli kod bilan chiqadi (CI uchun qulay). Mavjud fixer'lar ro'yxati `go tool fix help` bilan chiqadi. `-fixtool=prog` boshqa yoki qo'shimcha fixer'lar to'plamini tanlaydi. Quyidagi tavsiya mening amaliy fikrim: yangi Go versiyasiga o'tgandan keyin birinchi `go fix -diff ./...` ni ko'rib chiqing, keyin alohida commit qiling, shunda review'da o'zgarish va xulq farqi aralashmaydi.

`//go:fix inline`. Eskirgan funksiyani yangisi orqali ifodalab, doc izohdan keyin direktivani qo'ysangiz, `go fix` shu funksiyaga har chaqiruvni tanasi bilan almashtiradi: ya'ni "eski nomni yangi nomga ko'chirish" mijozlar tomonidan avtomatik bajariladi. Go blogi (10 mart 2026, "//go:fix inline and the source-level inliner") `ioutil.ReadFile` ni `os.ReadFile` ga o'tkazish misolida buni ko'rsatadi. Bu 37-darsdagi muammoning yechimi: eksport nomni o'chirib bo'lmaydi (mijozlar sinadi), lekin `Deprecated:` + `//go:fix inline` bilan migratsiyani engillashtirish mumkin.

### Go 1.27 yangiliklari

Go 1.27 release notes (2026-yil avgust): `go fix` yangi modernizer'lar oldi (`atomictypes`, `embedlit`, `slicesbackward`, `unsafefuncs`); `fmtappendf` analyzeri stilistik sabablarga ko'ra olib tashlandi; `waitgroup` nomi `waitgroupgo` ga o'zgartirildi. `go test` endi sukut bo'yicha `stdversion` vet tekshiruvini ishga tushiradi: standart kutubxonaning go.mod dagi `go` versiyasi uchun juda yangi simvollaridan foydalanishni topadi. `gofmt` ustun tekislash qarorini tuzatdi (avval CPU arxitekturasiga qarab biroz farq qilardi), shuning uchun Go 1.27 gofmt'i avval formatlangan kodda kichik bo'shliq o'zgarishlarini keltirishi mumkin: toolchain yangilanganda alohida "faqat format" commit'i rejalashtiring. Vet'ning printf tekshiruvi esa `fmt.Errorf("...: %w", p)` da `p` turi `*E` bo'lib, `E` o'zi error bo'lgan holatni xabar qiladi: bu ko'rsatkichni o'rash `errors.Is` va tur tekshiruvlarini aldaydi (31-dars).

### Go 1.26 da yangi modul go versiyasi

`go mod init` Go 1.N toolchain bilan `go 1.(N-1).0` yozadi. Go 1.26 va uning minor relizlari `go 1.25.0` yozadi (nomzod relizlar `go 1.24.0`). Maqsad qo'llab-quvvatlanadigan Go versiyalari bilan mos modullarni rag'batlantirish. Boshqa versiya kerak bo'lsa, `go mod init` dan keyin `go get go@version`.

### Linter

`go vet` ning ustiga ko'p jamoalar qo'shimcha linterlar (masalan, ko'p analyzer'li yig'ma vositalar) o'rnatadi. Ularning qaysi qoidalari yaxshi ekanini bu darsda tekshirmadik; umumiy tamoyil: CI'da `gofmt -l` bo'sh, `go vet ./...` toza, qo'shimcha linter sozlamasi repo ichida saqlansin va jamoa bilan kelishilgan bo'lsin. Linterni o'zingiz yozish ham mumkin: `go/parser` va `go/ast` bilan oddiy qoida yoki `golang.org/x/tools/go/analysis` bilan to'liq analyzer. Darsdagi topshiriq birinchi usulni ko'rsatadi.

## Misol: doc izoh, gofmt, go doc, go vet

Kichik `meter` paketi. Izohda atayin noto'g'ri ro'yxat belgisi (`*`) qoldirilgan: ikkinchi element birinchisiga o'xshash `-` emas. `gofmt -d` farqni ko'rsatadi:

```text
-//   * manfiy qiymatlar [ErrNegative] bilan rad etiladi.
+//   - manfiy qiymatlar [ErrNegative] bilan rad etiladi.
```

`gofmt -w` dan keyingi to'liq fayl:

```go
// Package meter yoqilg'i datchigi o'qishlarini litrga aylantiradi.
//
// Asosiy tip [Reading]. Bir nechta o'qishni [Total] yig'adi:
//
//   - kalibrovka koeffitsienti [Calibration] orqali beriladi;
//   - manfiy qiymatlar [ErrNegative] bilan rad etiladi.
//
// Reading nusxalash uchun xavfsiz; [Calibration] ning nol qiymati 1 koeffitsientni bildiradi.
package meter

import "errors"

// ErrNegative manfiy o'qish uchun qaytariladi.
var ErrNegative = errors.New("meter: manfiy o'qish")

// Reading bitta datchik o'qishi.
type Reading struct {
	Sensor string
	Raw    float64
}

// Calibration o'qishni litrga aylantirish koeffitsienti.
// Nol qiymat 1 koeffitsientga teng.
type Calibration struct {
	Factor float64
}

// Total o'qishlarning litr yig'indisini qaytaradi. Manfiy o'qish
// uchraganda [ErrNegative] qaytariladi.
func Total(rs []Reading, c Calibration) (float64, error) {
	f := c.Factor
	if f == 0 {
		f = 1
	}
	var sum float64
	for _, r := range rs {
		if r.Raw < 0 {
			return 0, ErrNegative
		}
		sum += r.Raw * f
	}
	return sum, nil
}

// Sum o'qishlar yig'indisini qaytaradi.
//
// Deprecated: [Total] dan foydalaning, u kalibrovkani qo'llaydi va xato qaytaradi.
func Sum(rs []Reading) float64 {
	var s float64
	for _, r := range rs {
		s += r.Raw
	}
	return s
}
```

`go doc ./meter` (Go 1.24.7) paket izohini render qiladi: doc linklar `Reading`, `Total` ga aylangan, ro'yxat belgilari bir xil:

```text
package meter // import "example.com/meter/meter"

Package meter yoqilg'i datchigi o'qishlarini litrga aylantiradi.

Asosiy tip Reading. Bir nechta o'qishni Total yig'adi:

  - kalibrovka koeffitsienti Calibration orqali beriladi;
  - manfiy qiymatlar ErrNegative bilan rad etiladi.

Reading nusxalash uchun xavfsiz; Calibration ning nol qiymati 1 koeffitsientni
bildiradi.

var ErrNegative = errors.New("meter: manfiy o'qish")
func Sum(rs []Reading) float64
func Total(rs []Reading, c Calibration) (float64, error)
type Calibration struct{ ... }
type Reading struct{ ... }
```

`go doc ./meter Sum` eskirgan funksiyani `Deprecated:` abzasi bilan ko'rsatadi:

```text
func Sum(rs []Reading) float64
    Sum o'qishlar yig'indisini qaytaradi.

    Deprecated: Total dan foydalaning, u kalibrovkani qo'llaydi va xato
    qaytaradi.
```

Endi kompilyatsiya bo'ladigan, lekin xato kod va `go vet`:

```go
package main

import (
	"fmt"
	"sync"
)

type Counter struct {
	mu sync.Mutex
	n  int
}

type Event struct {
	ID   int    `json:"id"`
	Name string `json:name`
}

func report(c Counter, id int, name string) {
	fmt.Printf("sensor %d: %s\n", name, id)
	fmt.Sprintf("done %s", name)
	id = id
	c.n++
}

func main() {
	var c Counter
	report(c, 7, "fuel-1")
	_ = Event{}
}
```

```text
./main.go:21:2: self-assignment of id to id
./main.go:18:15: report passes lock by value: m.Counter contains sync.Mutex
./main.go:27:9: call of report copies lock value: m.Counter contains sync.Mutex
./main.go:19:2: fmt.Printf format %d has arg name of wrong type string
./main.go:15:2: struct field tag `json:name` not compatible with reflect.StructTag.Get: bad syntax for struct tag value
./main.go:20:13: result of fmt.Sprintf call not used
```

Oltita topilma, kompilyator esa jim. `report` ichidagi `c.n++` nusxa ustida ishlaydi, shuning uchun `Counter`ning o'zgarishi chaqiruvchiga ko'rinmaydi: mutex nusxalash ham, mantiqiy xato ham.

Va `//go:fix inline` shakli. Quyidagi kod Go 1.24.7 da kompilyatsiya bo'ladi va ishlaydi (direktiva shunchaki izoh), lekin `go fix` ning uni qo'llashi bu darsda ishga tushirilmagan, chunki Go 1.26 toolchain sandbox'da yo'q:

```go
package main

import "fmt"

// Convert o'qishni litrga aylantiradi.
func Convert(raw, factor float64) float64 { return raw * factor }

// Liters o'qishni litrga aylantiradi.
//
// Deprecated: [Convert] dan foydalaning.
//
//go:fix inline
func Liters(raw float64) float64 {
	return Convert(raw, 1)
}

func main() {
	fmt.Println(Liters(12.5))
}
```

Direktivaning joylashuvi (doc izohning oxirida, funksiyadan oldin) Go blogidagi misolga mos; natijada Go 1.26 da `go fix -diff ./...` mijozlar kodidagi `Liters(x)` chaqiruvlarini `Convert(x, 1)` ga o'zgartirishni taklif qiladi (bu xulq blogga tayanadi, lokal tekshirilmagan).

## Qachon qo'llamaslik kerak

- Hamma narsaga doc comment yozish uchun "izoh generatori" ishlatmang: `// Sum summani hisoblaydi` kabi izohlar hech narsa qo'shmaydi. Izoh nom bilan boshlansin, lekin nima uchun va qanday shartlarda ishlashini aytsin (qaytish qiymati, xatolar, parallel xavfsizlik).
- `go fix` ni ko'r-ko'rona qo'llab commit qilmang: fixer'lar xulqni o'zgartirmasligi kerak, ammo yangi idioma sizning kodingizda o'qilishni yomonlashtirishi yoki yangi Go versiyasini talab qilishi mumkin. Avval `-diff`, keyin testlar.
- Format bo'yicha tortishuv ochmang: gofmt natijasi yagona haqiqat. Faqat Go 1.27 ga o'tganda gofmt ustun tekislashi o'zgargani sababli diff chiqsa, buni alohida commit qiling.
- Linter qoidalarini jamoa kelishmasdan yoqmang: bir yil davomida yuzlab ogohlantirish to'planib, hech kim e'tibor bermay qoladi. `go vet` ni majburiy, boshqalarini bosqichma-bosqich.
- `//go:fix inline` ni murakkab funksiyalarga qo'ymang: inliner funksiya chaqiruvini tanasi bilan almashtiradi, shuning uchun u oddiy "o'tkazuvchi" funksiyalar uchun mos (blogdagi misollar ham shunday).

## Stack'da: Node.js/TypeScript bilan solishtirish

- Prettier + ESLint o'rniga `gofmt` + `go vet`: sozlama deyarli yo'q, natija hamma loyihada bir xil. Bahs kam, review tezroq.
- TSDoc / JSDoc o'rniga doc comment: maxsus teglar (`@param`, `@returns`) yo'q, oddiy jumlalar, `[Name]` linklar, `Deprecated:` abzas.
- `jscodeshift` / codemod'lar o'rniga `go fix`: toolchain bilan keladi va analyzer framework asosida; `//go:fix inline` kutubxona muallifiga mijozlar kodini migratsiya qilish vositasini beradi, npm'da bunday standart yo'q.
- CI'da: `gofmt -l .` natijasi bo'sh bo'lishi, `go vet ./...` muvaffaqiyatli bo'lishi, Go 1.26 dan keyin esa `go fix -diff ./...` ni vaqti-vaqti bilan ishga tushirish (diff bo'lsa noldan farqli kod).
- Vet'ning `copylocks` tekshiruvi Go'ga xos: JS'da mutex nusxalash muammosi yo'q, lekin shu sababli Go'da sinxronizatsiya tiplarini ko'rsatkich bilan uzatish odat bo'lib qolgan (44-dars: mutex).

## Xulosa

- Har eksport qilingan nomga doc comment yozing: nom bilan boshlansin, paket izohi `Package <nom>` bilan, eskirgan narsa `Deprecated:` abzasi bilan.
- `gofmt` doc izohlarni ham kanonik qiladi; CI'da `gofmt -l` bo'sh bo'lsin, Go 1.27 ga o'tganda gofmt alignment o'zgarishini alohida commit qiling.
- `go vet ./...` ni CI'ning majburiy qismi qiling: kompilyator topmaydigan xatolar (lock nusxalash, format turi, struct teg) shu yerda ushlanadi.
- Go 1.26 dan `go fix` modernizer va `//go:fix inline` bilan kodni va API migratsiyasini avtomatlashtiradi; avval `go fix -diff`, keyin qo'llang.
- Go 1.27 da `go test` `stdversion` vet tekshiruvini sukut bo'yicha ishga tushiradi va `go fix` ga yangi modernizer'lar qo'shiladi.
