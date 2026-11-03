---
n: 39
slug: modullar-mvs
title: "Modullar: semver, MVS, replace, workspace va GOPROXY"
summary: "Minimal version selection qanday versiya tanlaydi, go.sum va GOPROXY/GOPRIVATE nima qiladi, replace faqat asosiy modulda ishlashi, /v2 major suffiks va go.work bilan lokal ko'p modulli ishlash."
duration: 45
sources:
  - id: go-mod-ref
    note: "Minimal version selection (MVS), Replacement, replace directive, Major version suffixes, Pseudo-versions, go.sum files, Checksum database, Private modules, Workspaces; GOPROXY standart qiymati"
  - id: mod-deps
    note: "Dependency boshqaruvi uchun umumiy manba (go get, go mod tidy); bu darsda sahifaning aniq bo'limlari tekshirilmagan, shuning uchun undan aniq da'vo olinmadi"
  - id: workspaces-tutorial
    note: "go work init, go work use, go.work faylidagi go va use direktivalari"
quiz:
  - q: "Asosiy modul A v1.2 va B v1.2 ni talab qiladi. A v1.2 C v1.3 ni, B v1.2 esa C v1.4 ni talab qiladi. C ning v1.9 versiyasi ham chiqarilgan. MVS qaysi C versiyasini tanlaydi?"
    options:
      - "C v1.9, eng yangisi"
      - "C v1.3, birinchi uchragani"
      - "C v1.4: talab qilinganlarning eng yuqorisi"
      - "Xato: versiyalar to'qnashadi"
    answer: 2
    explain: "MVS graf bo'ylab har modul uchun eng yuqori talab qilingan versiyani oladi, ya'ni minimal mos versiyani. Chiqarilgan v1.9 hech kim talab qilmagani uchun tanlanmaydi. Darsdagi demo: lib v1.3.0 mavjud edi, lekin go list -m all v1.2.0 ni ko'rsatdi."
  - q: "`example.com/lib` ning v1.3.0 versiyasi chiqdi. Hech narsa o'zgartirmasdan `go build` qilsangiz yangi versiya ishlatiladimi?"
    options:
      - "Ha, go build har safar eng yangisini oladi"
      - "Ha, lekin faqat go.sum yangilansa"
      - "Faqat GOPROXY o'zgarsa"
      - "Yo'q: build list talab qilingan minimal versiyalardan hisoblanadi va yangi chiqish uni o'zgartirmaydi; yangilash uchun `go get example.com/lib@latest`"
    answer: 3
    explain: "Reference: MVS deterministik, yangi versiya chiqishi build list'ni o'zgartirmaydi, shuning uchun lock fayl kerak emas. Darsda `go get example.com/lib@latest` lib ni v1.2.0 dan v1.3.0 ga ko'tardi va go.mod yangilandi."
  - q: "Kutubxonangiz `replace example.com/lib => ../libfork` yozgan va uni boshqa loyiha import qiladi. Boshqa loyiha buildida replace ishlaydimi?"
    options:
      - "Yo'q: replace direktivalari faqat asosiy modulning go.mod faylida (yoki go.work da) ishlaydi, boshqa modullarda e'tiborga olinmaydi"
      - "Ha, replace barcha iste'molchilarga o'tadi"
      - "Faqat lokal yo'l bo'lsa"
      - "Faqat go.sum da bo'lsa"
    answer: 0
    explain: "go.dev/ref/mod: replace faqat asosiy modul go.mod faylida qo'llanadi va boshqa modullarda e'tiborga olinmaydi. Shuning uchun kutubxonaga replace yozib uni 'tuzatib' bo'lmaydi; iste'molchi o'zining go.mod faylida yozishi kerak."
  - q: "Modul `example.com/bad` v2.0.0 tegi bilan chiqarilgan, lekin go.mod ichida `module example.com/bad` (suffiks yo'q). `go get example.com/bad@v2.0.0` natijasi?"
    options:
      - "Ishlaydi, versiya v2.0.0 bo'ladi"
      - "Xato: `invalid version: should be v0 or v1, not v2`; v2 dan boshlab modul yo'li /v2 bilan tugashi kerak"
      - "Ishlaydi, lekin ogohlantirish bilan"
      - "Avtomatik /v2 qo'shiladi"
    answer: 1
    explain: "Reference: v2 dan boshlab modul yo'llari mos major suffiksga ega bo'lishi kerak (import compatibility rule). Darsda sintetik proksida aynan shu xato chiqdi. To'g'ri yo'l: `module example.com/lib/v2`, import ham `example.com/lib/v2`; v1 va v2 bir buildda birga yashashi mumkin."
  - q: "Kompaniyaning ichki moduli `corp.example.com/billing` ni public proksi va checksum DB ko'rmasligi kerak. Eng to'g'ri sozlama?"
    options:
      - "GOFLAGS=-mod=vendor"
      - "GOSUMDB=off butun mashinada"
      - "GOPRIVATE=corp.example.com"
      - "GOPROXY=direct"
    answer: 2
    explain: "GOPRIVATE modul yo'li prefikslarini private deb belgilaydi va GONOPROXY hamda GONOSUMDB uchun standart bo'ladi. GOPROXY=direct faqat proksidan voz kechadi, checksum DB sozlamasi (GONOSUMDB) alohida qoladi; GOSUMDB=off esa public modullar uchun ham tekshiruvni o'chiradi."
  - q: "Ikkita modulni bir vaqtda o'zgartiryapsiz: `tool` va `libw` (hali nashr qilinmagan). Qanday ishlaysiz va nima uchun?"
    options:
      - "`replace` ni tool/go.mod ga yozib commit qilish: boshqalarga ham o'tadi"
      - "libw ni tool papkasiga ko'chirish"
      - "`go work init ./tool ./libw`: go.work ikkala modulni asosiy modullar qiladi, go.mod fayllarini o'zgartirmaydi"
      - "GOFLAGS=-mod=mod o'rnatish"
    answer: 2
    explain: "Darsdagi tajriba: workspace'siz tool `missing go.sum entry for module providing package example.com/libw` xatosi berdi (libw hali nashr qilinmagan), go.work bilan esa lokal nusxa ishladi. go.work lokal ishlab chiqish uchun, replace esa go.mod ga yoziladi va commit qilinsa shu modulni build qiladigan hamma uchun amal qiladi (lokal yo'l boshqa mashinada bo'lmasligi mumkin)."
task:
  title: "MVS build list'ini hisoblash"
  prompt: |
    `BuildList` modullar grafidan MVS natijasini hisoblashi kerak: har modul uchun graf bo'ylab uchragan eng yuqori talab qilingan versiya. Hozirgi variant modulni birinchi uchragan versiyasida qotiradi va keyingi talablarni e'tiborsiz qoldiradi, shuning uchun `C` uchun `v1.3` ni tanlaydi.

    Qayta yozing:
    - Graf bo'ylab ildizlardan boshlab yuring; har `(modul, versiya)` tugunini faqat bir marta tashrif buyuring (`seen`).
    - Har modul uchun uchragan eng yuqori versiyani saqlang. Past versiyaning talablari ham hisobga olinadi (C v1.3 D v1.5 ni talab qiladi, shuning uchun `D v1.5`).
    - Hech kim talab qilmagan tugun (`D v1.9`) natijaga kirmaydi.
    - `main`ni o'zgartirmang. Kutilgan chiqish: `A v1.2`, `B v1.2`, `C v1.4`, `D v1.5`.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "sort"
    )

    // Node: modul va uning minor versiyasi (v1.<Ver>).
    type Node struct {
        Mod string
        Ver int
    }

    // BuildList MVS natijasini qaytaradi: har modul uchun graf bo'ylab
    // uchragan eng yuqori talab qilingan versiya.
    func BuildList(reqs map[Node][]Node, roots []Node) []Node {
        picked := map[string]Node{}
        var visit func(n Node)
        visit = func(n Node) {
            if _, ok := picked[n.Mod]; ok {
                return // modul allaqachon tanlangan
            }
            picked[n.Mod] = n
            for _, r := range reqs[n] {
                visit(r)
            }
        }
        for _, r := range roots {
            visit(r)
        }
        out := make([]Node, 0, len(picked))
        for _, n := range picked {
            out = append(out, n)
        }
        sort.Slice(out, func(i, j int) bool { return out[i].Mod < out[j].Mod })
        return out
    }

    func main() {
        reqs := map[Node][]Node{
            {"A", 2}: {{"C", 3}},
            {"B", 2}: {{"C", 4}},
            {"C", 3}: {{"D", 5}},
            {"C", 4}: {{"D", 2}},
            {"D", 9}: nil, // mavjud, lekin hech kim talab qilmaydi
        }
        roots := []Node{{"A", 2}, {"B", 2}}
        for _, n := range BuildList(reqs, roots) {
            fmt.Printf("%s v1.%d\n", n.Mod, n.Ver)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "sort"
    )

    // Node: modul va uning minor versiyasi (v1.<Ver>).
    type Node struct {
        Mod string
        Ver int
    }

    // BuildList MVS natijasini qaytaradi: har modul uchun graf bo'ylab
    // uchragan eng yuqori talab qilingan versiya.
    func BuildList(reqs map[Node][]Node, roots []Node) []Node {
        highest := map[string]int{}
        seen := map[Node]bool{}
        var visit func(n Node)
        visit = func(n Node) {
            if seen[n] {
                return
            }
            seen[n] = true
            if n.Ver > highest[n.Mod] {
                highest[n.Mod] = n.Ver
            }
            for _, r := range reqs[n] {
                visit(r)
            }
        }
        for _, r := range roots {
            visit(r)
        }
        out := make([]Node, 0, len(highest))
        for mod, ver := range highest {
            out = append(out, Node{mod, ver})
        }
        sort.Slice(out, func(i, j int) bool { return out[i].Mod < out[j].Mod })
        return out
    }

    func main() {
        reqs := map[Node][]Node{
            {"A", 2}: {{"C", 3}},
            {"B", 2}: {{"C", 4}},
            {"C", 3}: {{"D", 5}},
            {"C", 4}: {{"D", 2}},
            {"D", 9}: nil, // mavjud, lekin hech kim talab qilmaydi
        }
        roots := []Node{{"A", 2}, {"B", 2}}
        for _, n := range BuildList(reqs, roots) {
            fmt.Printf("%s v1.%d\n", n.Mod, n.Ver)
        }
    }
  solutionNotes: |
    - MVS grafni kezib, har modul uchun uchragan eng yuqori talab qilingan versiyani oladi (reference: build list = traversal'da uchragan eng yuqori talablar). "Birinchi uchragani" yoki "eng yangisi" emas.
    - `seen` tugun darajasida (`Node`), modul darajasida emas: bir modulning turli versiyalari o'z talablarini olib keladi. `C v1.3` ning `D v1.5` talabi `C v1.4` tanlangandan keyin ham natijaga ta'sir qiladi.
    - `D v1.9` hech kim talab qilmagani uchun tanlanmaydi: MVS "minimal" shu ma'noda, yangi versiya chiqishi build list'ni o'zgartirmaydi.
    - Bu o'quv modeli: haqiqiy `go` buyrug'i go.mod fayllaridagi graf pruning va lazy loading qo'llaydi (Go 1.17 va undan keyingi go.mod fayllari uchun), ammo natija konsepsiya bilan mos.
    - Natija tartiblanadi (`sort.Slice`), map iteratsiyasi tartibi tasodifiy bo'lgani uchun (14-dars).
  checklist:
    - "Tugunlar `seen` bilan bir martadan tashrif qilinadi"
    - "Har modul uchun eng yuqori uchragan versiya saqlanadi"
    - "Past versiya talablari ham hisobga olinadi (`D v1.5`)"
    - "Hech kim talab qilmagan `D v1.9` natijada yo'q, natija tartiblangan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Node.js dunyosida dependency bilan bog'liq uchta og'riq tanish. Birinchisi: `npm install` bugun va ertaga turli versiyalarni olib keladi, shuning uchun `package-lock.json` kerak. Ikkinchisi: bir kutubxonaning ikki major versiyasi `node_modules` ichida jimgina yonma-yon yashaydi. Uchinchisi: lokal kutubxonani tuzatib sinash uchun `npm link` yoki `file:` bog'liqliklari bilan kurashish.

Go bu uch muammoga o'z javobini beradi. Versiya tanlash deterministik (MVS), lock fayli kerak emas. Major versiya import yo'lida ko'rinadi (`/v2`), shuning uchun v1 va v2 ni aralashtirib bo'lmaydi va ular yonma-yon yashashi ham ochiq bo'ladi. Lokal ishlab chiqish uchun `replace` va `go.work` bor. Lekin mexanizmlarni bilmasangiz, "nega bu versiya tanlandi", "nega `replace` ishlamayapti", "nega private modul 404 beryapti" savollari soatlab vaqt oladi.

Dars to'rt narsani tushuntiradi: MVS nima tanlaydi va nega, `go.sum` va proksi (`GOPROXY`, `GOPRIVATE`) nima qiladi, `replace` va workspace qachon ishlatiladi, major versiya suffiksi nima uchun kerak.

## Asosiy g'oya

**MVS.** Go modul grafida har tugun modul versiyasi, har qirra `require` direktivasidagi minimal talab qilingan versiya. MVS asosiy moduldan boshlab grafni kezadi va har modul uchun uchragan eng yuqori talab qilingan versiyani kuzatadi. Oxirida eng yuqori talablar build list'ni tashkil qiladi: ular barcha talablarni qondiradigan minimal versiyalar. Reference'dagi misol: asosiy modul A 1.2 va B 1.2 ni talab qiladi, ular mos ravishda C 1.3 va C 1.4 ni talab qiladi, ikkalasi D 1.2 ni talab qiladi. Natija: A 1.2, B 1.2, C 1.4, D 1.2. B va D ning yuqori versiyalari mavjud, lekin hech kim talab qilmagani uchun tanlanmaydi.

Asosiy oqibat reference'da aniq yozilgan: boshqa tizimlardan farqli, build list lock faylda saqlanmaydi. MVS deterministik va yangi versiyalar chiqishi build list'ni o'zgartirmaydi, shuning uchun u har module-aware buyruq boshida qayta hisoblanadi. Build list'ni `go list -m all` ko'rsatadi.

**go.sum.** Modul ildizidagi `go.sum` modul va uning go.mod faylining kriptografik xeshlarini saqlaydi. Go modul `.mod` yoki `.zip` faylini keshga yuklaganda xeshni hisoblab, asosiy modul `go.sum` idagi bilan solishtiradi. Qatorda uch maydon bor: modul yo'li, versiya (go.mod xeshi uchun `/go.mod` bilan tugaydi) va xesh (`h1:` SHA-256). `go.sum` da bir modulning bir necha versiyasi bo'lishi mumkin, chunki MVS uchun turli versiyalarning go.mod fayllari kerak bo'ladi; `go mod tidy` yetishmayotgan xeshlarni qo'shadi va keraksizlarini o'chiradi.

**Proksi va checksum DB.** `GOPROXY` standarti `https://proxy.golang.org,direct`: avval Google'ning modul mirrori, u modulni topmasa to'g'ridan-to'g'ri repozitoriya. Checksum database (sum.golang.org) global shaffof log bo'lib, proksi yoki origin noto'g'ri kodni sezdirmay bera olmasligini ta'minlaydi. Private modullar uchun reference to'rt o'zgaruvchini sanaydi: `GOPROXY`, `GOPRIVATE` (private modul yo'l prefikslarining glob ro'yxati; `GONOPROXY` va `GONOSUMDB` uchun standart), `GONOPROXY` (proksidan yuklamaslik) va `GONOSUMDB` (public checksum DB bilan tekshirmaslik). Odatda faqat `GOPRIVATE=corp.example.com` kifoya.

**replace.** Direktiva modulning ma'lum versiyasi yoki barcha versiyalari mazmunini boshqa joydagi bilan almashtiradi: boshqa modul yo'li va versiyasi yoki lokal yo'l (`./` yoki `../` bilan boshlanadi, u yerda go.mod bo'lishi shart). Muhim cheklov: `replace` faqat asosiy modulning go.mod (yoki go.work) faylida amal qiladi, boshqa modullarda e'tiborga olinmaydi. Alohida replace modulni grafga qo'shmaydi: unga mos `require` ham kerak.

**Major versiya.** v2 dan boshlab modul yo'li major versiya suffiksiga ega bo'lishi kerak (`example.com/mod/v2`). Sabab import compatibility rule: bir xil import yo'li bilan kelgan yangi paket eskisiga orqaga mos bo'lishi kerak; yangi major versiya mos emas, demak yangi yo'l kerak. Bu paketlarni qayta ishlatuvchilarga ham, MVS'ga ham aniq ko'rinadi.

**Workspace.** `go.work` fayli bir nechta lokal modulni asosiy modullar qilib belgilaydi: `go work init ./a ./b` va `go work use ./c`. `go` direktivasi go.mod dagiga o'xshaydi, `use` direktivasi modul katalogini ko'rsatadi.

## Chuqurroq: pseudo-version, minimal tanlov, readonly

### Pseudo-version

Tag yo'q revizyonlarga murojaat uchun `v0.0.0-20191109021931-daa7c04131f5` ko'rinishidagi pseudo-version ishlatiladi: bazaviy versiya prefiksi, UTC vaqt tamg'asi (`yyyymmddhhmmss`) va 12 belgili revizyon identifikatori. Reference ularni tag qo'yishdan oldin commitlarni sinash uchun mo'ljallangan deydi. Production'da imkon qadar tag'langan versiyaga o'ting.

### MVS "minimal" ekanining oqibatlari

- Yangi versiya o'zi kelmaydi. Xavfsizlik tuzatishi chiqdi, lekin `go get` qilmasangiz o'sha eski versiya qoladi. Yangilashni ongli bajaring: `go get example.com/lib@latest`, keyin `go mod tidy`.
- Yuqori talab hamma uchun yutadi. Bitta bog'liqlik `lib v1.2.0` talab qilsa, siz v1.1.0 da qolmaysiz. Downgrade qilmoqchi bo'lsangiz, uni talab qilgan modullar ham pasayishi kerak.
- Pastroq versiyaning talablari ham hisobga olinadi: A ning C 1.3 talabi C 1.4 tanlangandan keyin ham graf tarkibida. Darsdagi topshiriq aynan shu holatni modellashtiradi.

Eslatma: Go 1.17 dan boshlab go.mod fayllarida graf pruning va lazy loading bor; shu sababli real `go` buyrug'i butun grafni yuklamasligi mumkin, lekin natija MVS bilan mos. Bu darsda pruning ichki tafsilotlari tekshirilmagan.

### readonly standarti

Reference: Go 1.16 dan `go` buyrug'i `-mod=readonly` bo'lgandek ishlaydi: go.mod ni o'zgartirish kerak bo'lsa, xato beradi va tuzatishni taklif qiladi. go.mod ni `go get` yoki `go mod tidy` yangilaydi, build buyruqlari esa jimgina emas.

## Misol: MVS, upgrade, replace, v2 va workspace

Barcha misollar lokal fayl-proksi bilan bajarilgan (tarmoq yo'q): `GOPROXY=file://...`, `GOSUMDB=off` (checksum DB faqat demo uchun o'chirilgan; go.sum baribir yoziladi). Modullar sintetik: `example.com/lib` ning to'rt versiyasi (v1.0.0...v1.3.0), `example.com/a` lib v1.1.0 ni, `example.com/b` lib v1.2.0 ni talab qiladi. Ilova a va b ni talab qiladi.

```go
package main

import (
	"fmt"

	"example.com/a"
	libv2 "example.com/lib/v2"
)

func main() {
	fmt.Println(a.Info())
	fmt.Println("v2:", libv2.Version)
}
```

`go mod tidy` va `go run .`:

```text
go: downloading example.com/b v1.0.0
go: downloading example.com/a v1.0.0
go: downloading example.com/lib v1.2.0
a uses lib 1.2.0
b uses lib 1.2.0
```

Lib'ning mavjud versiyalari va build list:

```text
$ go list -m -versions example.com/lib
example.com/lib v1.0.0 v1.1.0 v1.2.0 v1.3.0
$ go list -m all
example.com/app
example.com/a v1.0.0
example.com/b v1.0.0
example.com/lib v1.2.0
```

v1.3.0 mavjud, lekin hech kim talab qilmagani uchun v1.2.0 (b ning talabi) tanlandi. `go mod tidy` go.mod ga `require example.com/lib v1.2.0 // indirect` qo'shdi, go.sum esa har modul uchun ikki qator yozdi (kod xeshi va `/go.mod` xeshi). `go mod why -m example.com/lib` import zanjirini ko'rsatadi: `example.com/app -> example.com/a -> example.com/lib`.

Yangilash:

```text
$ go get example.com/lib@latest
go: downloading example.com/lib v1.3.0
go: upgraded example.com/lib v1.2.0 => v1.3.0
$ go run .
a uses lib 1.3.0
b uses lib 1.3.0
```

go.mod dagi talab v1.3.0 ga ko'tarildi. Eski `go.sum` qatorlarini `go mod tidy` tozalaydi.

`replace` bilan lokal fork:

```text
replace example.com/lib => ../libfork

$ go run .
a uses lib 1.2.0-fork
b uses lib 1.2.0-fork
$ go list -m all
...
example.com/lib v1.2.0 => ../libfork
```

Replace hamma dependency (a va b) uchun ham amal qildi, chunki u asosiy modul go.mod faylida. Teskarisi emas: a ning o'z go.mod faylidagi replace asosiy moduldan ko'rinmaydi.

Major versiya. Tegi v2.0.0 bo'lgan, lekin yo'lida `/v2` bo'lmagan modul:

```text
$ go get example.com/bad@v2.0.0
go: downloading example.com/bad v2.0.0
...example.com/bad@v2.0.0: invalid version: should be v0 or v1, not v2
```

To'g'ri modul `module example.com/lib/v2` deb e'lon qilinadi va `import "example.com/lib/v2"` bilan olinadi. Natijada bitta buildda ikki major versiya yonma-yon yashaydi:

```text
$ go list -m all
example.com/app
example.com/a v1.0.0
example.com/lib v1.3.0
example.com/lib/v2 v2.0.0
```

Workspace. `tool` moduli hali nashr qilinmagan `libw` ni (v1.0.0) talab qiladi. go.work'siz:

```text
main.go:6:2: missing go.sum entry for module providing package example.com/libw (imported by example.com/tool); to add:
	go get example.com/tool
```

`go work init ./tool ./libw` shunday go.work yaratdi:

```text
go 1.24.7

use (
	./libw
	./tool
)
```

va `tool` ichida `go run .` lokal nusxani ishlatdi: `libw lokal nusxa`. go.mod fayllari o'zgarmagan.

## Qachon qo'llamaslik kerak

- `replace` ni doimiy yechim sifatida go.mod ga commit qilmang, ayniqsa lokal yo'l bilan (`../libfork` boshqa mashinada yo'q). Vaqtinchalik fork uchun modul yo'lli replace ishlatish mumkin, lekin uni tezroq upstream'ga qaytarish rejasi bo'lsin.
- `go.work` ni go.mod o'rniga ishlatmang. U lokal ishlab chiqish vositasi; commit qilinsinmi-yo'qmi jamoa qarori bo'lib, bu darsda manba bo'yicha tekshirilmagan.
- `GOSUMDB=off` ni global qo'ymang: bu public modullar uchun ham tekshiruvni o'chiradi. Private prefikslar uchun `GOPRIVATE`.
- Pseudo-version'larga production'da tayanmang: commit hash bo'yicha qotirish o'qilishi yomon va yangilash qiyin; tag qo'ying.
- Ortiqcha major versiya chiqarmang. Har `/v2` yangi import yo'li, demak mijozlar uchun migratsiya (37-dars: avval buzilmaydigan API dizayni).
- MVS o'zi xavfsizlik yangilanishlarini keltirmaydi; zaifliklarni alohida vosita bilan tekshirib turish va `go get` bilan ongli yangilash kerak.

## Stack'da: Node.js/TypeScript bilan solishtirish

- `package-lock.json` Node.js'da build'ni qotiradi; Go'da build list MVS orqali deterministik, shuning uchun lock fayl yo'q. `go.sum` esa lock emas, butunlik xeshlari.
- npm'da `^1.2.0` oraliqlari bor va yangi versiya o'zi kelishi mumkin; Go'da faqat minimal talab bor va yangilash `go get` bilan aniq.
- `npm link` / `file:` ning Go'dagi muqobillari: `replace` (go.mod ga yoziladi) va `go.work` (go.mod ga tegmaydi).
- `.npmrc` registry va token sozlamalari o'rniga `GOPROXY`, `GOPRIVATE`, `GONOSUMDB` o'zgaruvchilari. Korporativ proksi bo'lsa, odatda `GOPROXY=https://proxy.corp.example.com,https://proxy.golang.org,direct` kabi ro'yxat va private prefiks uchun `GONOSUMDB`.
- Monorepo (`pnpm workspaces`) ga eng yaqin narsa `go.work`; bir modulli monorepoda esa `cmd/` va `internal/` yetarli (38-dars).

## Xulosa

- MVS har modul uchun grafdagi eng yuqori talab qilingan versiyani oladi; yangi versiya chiqishi build list'ni o'zgartirmaydi, yangilash `go get` bilan ongli bajariladi.
- `go.sum` xeshlari butunlikni tekshiradi, `go mod tidy` uni to'g'rilaydi; `GOPROXY` standarti `https://proxy.golang.org,direct`, private modullar uchun `GOPRIVATE`.
- `replace` faqat asosiy modul go.mod (yoki go.work) faylida amal qiladi; lokal ishlash uchun `go.work`, doimiy emas.
- v2 dan boshlab modul yo'li `/v2` bilan tugaydi; `v1` va `v2` bir buildda birga bo'lishi mumkin.
- Pseudo-version tag yo'q revizyon uchun, production'da tag'langan versiyani afzal ko'ring.
