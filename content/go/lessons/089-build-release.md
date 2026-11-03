---
n: 89
slug: build-release
title: "Build va release: cross-compile, ldflags, embed va Docker"
summary: "Go binary'ni production uchun tayyorlash: GOOS/GOARCH bilan cross-compile, CGO_ENABLED va statik binary, -ldflags -X bilan versiya, -trimpath va takrorlanuvchi build, embed bilan fayllarni binary ichiga olish, build info va multi-stage Docker."
duration: 40
sources:
  - id: pkg-embed
    note: "//go:embed direktivasi, embed.FS, string va []byte o'zgaruvchilari, all: prefiksi va '.'/'_' bilan boshlanuvchi fayllar qoidasi"
  - id: toolchain-doc
    note: "GOTOOLCHAIN va go.mod'dagi toolchain qatori: build muhitida Go versiyasi qanday tanlanadi"
  - id: go-mod-ref
    note: "go.mod/go.sum va modul yuklash; build'ning takrorlanuvchanligi uchun module kontekst. Aniq bo'limlar bu sessiyada qayta o'qilmagan"
quiz:
  - q: "Macdan Linux serveri uchun Go binary kerak. Eng to'g'ri buyruq?"
    options:
      - "`GOOS=linux GOARCH=amd64 go build -o ingest .`: Go o'zi cross-compile qiladi, qo'shimcha toolchain kerak emas (cgo ishlatilmasa)"
      - "Linux virtual mashinada qayta build qilish, boshqa yo'li yo'q"
      - "`go build --target=linux`"
      - "Binary Mac'da qurilgan bo'lsa Linux'da ham ishlaydi, alohida ish kerak emas"
    answer: 0
    explain: "Go kompilyatori target OS/arch ni muhit o'zgaruvchilaridan oladi. Sinab ko'rdik: linux/arm64, windows/amd64 va darwin/arm64 uchun binary'lar bitta mashinada qurildi (file buyrug'i ELF, PE32+ va Mach-O ko'rsatdi). Cgo ishlatilsa, target uchun C kompilyator kerak bo'ladi."
  - q: "Servis `net/http` ishlatadi. `CGO_ENABLED=1` bilan qurilgan binary `FROM scratch` image'ida ishga tushmadi. Sabab?"
    options:
      - "scratch image Go binary'larni qo'llamaydi"
      - "Binary juda katta"
      - "net/http faqat Alpine bilan ishlaydi"
      - "Cgo yoqilgan binary libc ga dinamik bog'langan (tekshirdik: ldd libc.so.6 ko'rsatdi), scratch'da libc yo'q; CGO_ENABLED=0 statik binary beradi"
    answer: 3
    explain: "Standart net paketi cgo yoqilganda tizim resolver'i uchun libc'dan foydalanishi mumkin, shuning uchun binary dinamik bo'ladi. CGO_ENABLED=0 sof Go realizatsiyasini tanlaydi va statik binary beradi. Cgo kerak bo'lgan kutubxona bo'lsa, libc mavjud base image (masalan distroless/base) tanlanadi."
  - q: "`-ldflags \"-X main.version=1.4.0\"` ishlashi uchun `version` qanday e'lon qilingan bo'lishi kerak?"
    options:
      - "`const version = \"dev\"`"
      - "`var version = \"dev\"`: paket darajasidagi string o'zgaruvchi (const bo'lmaydi)"
      - "`func version() string`"
      - "Har qanday tipdagi o'zgaruvchi"
    answer: 1
    explain: "Linker -X bayrog'i paket darajasidagi string o'zgaruvchining boshlang'ich qiymatini almashtiradi. Konstanta kompilyatsiya vaqtida tarqatib yuboriladi, shuning uchun uni linker o'zgartira olmaydi. Starter dasturida shu sababli const o'rniga var ishlatildi."
  - q: "Bir xil manba kodidan ikkita turli katalogda `go build` qildik. Natija binary'lari xeshi qachon bir xil bo'ldi (bizning tajribada)?"
    options:
      - "Hech qachon, build har safar vaqt belgisini qo'shadi"
      - "Faqat `-s -w` ishlatilganda"
      - "`-trimpath` bilan: fayl yo'llari binary'ga yozilmagani uchun katalog nomi farq qilmadi; usiz xeshlar farq qildi"
      - "Faqat cgo yoqilganda"
    answer: 2
    explain: "-trimpath binary'dagi absolyut fayl tizimi yo'llarini olib tashlaydi. Tajribamizda -trimpath bilan ikki katalogdagi xesh bir xil, usiz farqli chiqdi. Bu takrorlanuvchan build'ning bir sharti: toolchain versiyasi, muhit va manba ham bir xil bo'lishi kerak."
  - q: "`//go:embed web` bilan katalog embed qilindi. Ichida `web/.env.example` va `web/_draft.html` bor. Ular embed.FS ga tushadimi?"
    options:
      - "Yo'q, '.' yoki '_' bilan boshlanuvchi fayllar katalog embed qilinganda chiqarib tashlanadi; `all:web` prefiksi ularni qo'shadi"
      - "Ha, hamma fayl tushadi"
      - "Faqat .html fayllar tushadi"
      - "Kompilyatsiya xato beradi"
    answer: 0
    explain: "embed hujjati: katalog embed qilinganda '.' yoki '_' bilan boshlanadigan fayllar chiqarib tashlanadi; `all:` prefiksi bu qoidani o'zgartiradi. Nomi bilan aniq ko'rsatilgan fayl esa baribir qo'shiladi. Bu xususiyat tasodifan maxfiy faylni binary'ga qo'shib yuborishdan ham saqlaydi."
  - q: "Docker build ichida `.git` katalogi kontekstga kirmaydi. Binary'da commit hash'ni qanday saqlaysiz?"
    options:
      - "Go o'zi avtomatik topadi"
      - "runtime.Version() commit'ni qaytaradi"
      - "Commit hash'ni kodga qo'lda yozing"
      - "Build argumenti orqali commit'ni uzating va `-ldflags \"-X main.commit=...\"` bilan o'rnating (VCS stamping .git bo'lmaganda ishlamaydi)"
    answer: 3
    explain: "VCS ma'lumoti faqat build vaqtida repo mavjud bo'lsa binary'ga yoziladi (go build -buildvcs hujjati). Docker kontekstida .git bo'lmasa, ARG va -ldflags -X ishonchli. runtime.Version() Go toolchain versiyasini beradi, sizning commit'ingizni emas."
task:
  title: "Versiya va faylni binary ichiga joylash"
  prompt: |
    Quyidagi dastur versiyani konstanta qilib yozgan (har release'da qo'lda o'zgartiriladi) va `welcome.txt` ni ishchi katalogdan o'qiydi: binary boshqa katalogga ko'chirilsa, `no such file or directory` xatosi chiqadi.

    Vazifa: `welcome.txt` (istalgan matn) yarating. Dasturni shunday o'zgartiringki: `version` `var` bo'lsin va `go build -ldflags "-X main.version=2.1.0"` bilan o'rnatilsin (qiymat bermasa `dev`); `welcome.txt` `//go:embed` bilan binary ichiga olinsin. Binary'ni boshqa katalogga ko'chirib ishga tushiring: `ingest 2.1.0` va matn chiqishi kerak.
  lang: go
  starter: |
    package main

    import (
        "fmt"
        "os"
    )

    const version = "1.0.0" // har release'da qo'lda o'zgartiriladi

    func main() {
        // Muammo: fayl ishchi katalogga nisbatan o'qiladi, binary ko'chirilsa topilmaydi.
        b, err := os.ReadFile("welcome.txt")
        if err != nil {
            fmt.Println("xato:", err)
            os.Exit(1)
        }
        fmt.Printf("ingest %s\n%s", version, b)
    }
  solution: |
    package main

    import (
        _ "embed"
        "fmt"
    )

    // version build vaqtida beriladi: go build -ldflags "-X main.version=2.1.0".
    var version = "dev"

    //go:embed welcome.txt
    var welcome string

    func main() {
        fmt.Printf("ingest %s\n%s", version, welcome)
    }
  solutionNotes: |
    - `-X` faqat paket darajasidagi `string` **o'zgaruvchi** (`var`) uchun ishlaydi; `const` linker tomonidan almashtirilmaydi.
    - `import _ "embed"` va `//go:embed welcome.txt` oldidan turgan `var welcome string` fayl mazmunini kompilyatsiya vaqtida binary ichiga joylaydi: ishchi katalog va ko'chirish ahamiyatsiz.
    - Direktiva va o'zgaruvchi orasida bo'sh qator bo'lmasligi kerak.
    - Qiymat berilmasa `dev`: lokal `go run` va test paytida versiya aniq "release emas" deb ko'rinadi.
    - Starter binary'si boshqa katalogda `open welcome.txt: no such file or directory` xatosini berdi; yechim binary'si ikki joyda ham ishladi (tekshirdik).
  checklist:
    - "`version` `var` sifatida e'lon qilingan, `-X main.version=...` bilan o'zgaradi"
    - "`welcome.txt` `//go:embed` bilan o'qiladi, `os.ReadFile` yo'q"
    - "Binary boshqa katalogdan ishga tushganda matn chiqadi"
    - "Qiymatsiz build `dev` ni chiqaradi"
    - "`go vet` o'tadi"
---

## Muammo

"Menda ishlayapti" servis uchun yetarli emas. Production'ga boradigan artefakt takrorlanuvchan, kichik, o'zi nima ekanini biladigan (versiya, commit) va ishga tushishi uchun tashqi fayl yoki dinamik kutubxonalarga bog'liq bo'lmagan bo'lishi kerak. Node.js'da deploy `node_modules` bilan birga ko'chiriladi, Node.js versiyasi hamda `npm install` natijasi muhitga bog'liq. Go'da imkoniyat boshqacha: bitta statik binary. Lekin bu o'z-o'zidan bo'lmaydi: cgo tasodifan dinamik bog'lanish keltiradi, fayl yo'llari binary ichiga yoziladi, versiya qo'lda o'zgartiriladi va ularsiz "qaysi versiya ishlayapti?" savoliga javob topish qiyin.

Bu dars build va yetkazib berish zanjirini lokal tekshiriladigan tajribalar bilan ko'rsatadi: cross-compile, statik va dinamik bog'lanish, `-ldflags -X` bilan versiya, `-trimpath` va xesh takrorlanuvchanligi, `embed` bilan fayllarni binary ichiga joylash, binary ichidagi build ma'lumoti. Oxirida multi-stage Dockerfile: unda Docker daemon sandbox'da ishlamagani uchun Dockerfile tekshirilmagan, buni ochiq belgilaymiz. 2-darsda toolchain va `go.mod` ko'rilgan, 87-darsda binary ichidagi build ma'lumoti govulncheck uchun asos bo'lgani aytilgan edi.

## Asosiy g'oya

### Cross-compile

Go kompilyatori target platformani `GOOS` va `GOARCH` muhit o'zgaruvchilaridan oladi. Qo'shimcha kompilyator o'rnatish kerak emas (cgo ishlatilmasa):

```text
linux/arm64   ELF 64-bit LSB executable, ARM aarch64, statically linked
windows/amd64 PE32+ executable (console) x86-64, for MS Windows
darwin/arm64  Mach-O 64-bit arm64 executable
```

Bu `file` buyrug'i natijalari qisqartirilgan holda (bitta mashinada, Go 1.24.7, linux/amd64 host). Uch target uchun ham binary shu mashinada qurildi. Muhim cheklov: boshqa arxitektura uchun qurilgan binary'ni shu mashinada ishga tushirib sinay olmaysiz; CI'da target platformada smoke-test kerak.

### Statik va dinamik bog'lanish: CGO_ENABLED

Cgo yoqilgan bo'lsa (Linux'da C kompilyator mavjud bo'lsa u standart holat), ba'zi standart paketlar (masalan `net`) tizim kutubxonalariga bog'lanishi mumkin. Tekshiruv uchun `net.LookupHost` ishlatadigan kichik dastur qurdik:

```text
CGO_ENABLED=1: libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6   (dinamik)
CGO_ENABLED=0: not a dynamic executable                         (statik)
```

`CGO_ENABLED=0` sof Go realizatsiyalarini tanlaydi va statik binary beradi: u `FROM scratch` yoki distroless static image'da ishlaydi. Cgo yoqilgan binary esa libc talab qiladi. Qoida: cgo kerak bo'lmasa, release build'da `CGO_ENABLED=0` ni aniq yozing, tasodifiy dinamik bog'lanishdan saqlanasiz. Cgo haqiqatan kerak bo'lsa (masalan, C kutubxona), base image buni hisobga olishi shart (69-dars).

### Versiyani binary'ga yozish: -ldflags -X

`-ldflags "-X main.version=1.4.0"` linker'ga paket darajasidagi `string` o'zgaruvchining boshlang'ich qiymatini almashtirishni buyuradi. O'zgaruvchi `var` bo'lishi kerak (konstanta emas), standart qiymati esa `dev` kabi "release emas" belgisi. Commit hash ham shunday uzatiladi. Qiymat shell'da hisoblanadi (`$(git rev-parse --short HEAD)`).

## Chuqurroq: o'lcham, takrorlanuvchanlik, embed

### Binary o'lchami

`-ldflags "-s -w"` simvol jadvali va debug ma'lumotini olib tashlaydi. Bizning kichik dasturda (CGO_ENABLED=0, Go 1.24.7, linux/amd64):

```text
oddiy build:                         2488084 bayt
-ldflags "-s -w":                    1618104 bayt
-trimpath -ldflags "-s -w":          1614008 bayt
```

Kamayish ~35%. Bu raqam shu kichik dastur uchun; haqiqiy servisda ulush boshqacha bo'ladi, o'z binary'ingizda o'lchang. Narxi: debug ma'lumoti yo'q, shuning uchun debugger bilan ishlash imkoniyati cheklanadi. Panic stack trace'i esa saqlanadi: `-s -w` bilan qurilgan binary'da nil map yozish panic'i funksiya nomlari va satr raqamlari bilan chiqdi (tekshirdik). Production'da `-s -w` odatiy, lekin simvolli binary'ni artefaktlarda saqlash foydali bo'lishi mumkin (90-dars).

### -trimpath va takrorlanuvchan build

Build qilingan binary'da manba fayllarining absolyut yo'llari bo'ladi (panic xabarlari, build info). Demak, bir xil manba boshqa katalogda boshqa binary beradi. `-trimpath` shu yo'llarni olib tashlaydi. Tajriba: bir xil manba ikki katalogda qurildi:

```text
-trimpath, ikki xil katalog:   3314be5ef8e8f4ba  3314be5ef8e8f4ba   (bir xil)
-trimpath yo'q, ikki katalog:  06eb1d03c8064068  579c07535c041cfd   (farq qiladi)
```

-trimpath bilan xesh bir xil, usiz farqli. Bu takrorlanuvchan build'ning bir sharti, boshqalari: bir xil Go versiyasi, bir xil `GOOS/GOARCH/CGO_ENABLED`, bir xil bog'liqliklar (`go.sum`) va bir xil ldflags. Xesh bir xil bo'lsa, ikki mustaqil build'ni solishtirib supply chain'ga ishonchni oshirish mumkin (87-dars).

### Build info

Go 1.18 dan binary ichiga qurish ma'lumoti yoziladi: Go versiyasi, modul, bog'liqliklar, bayroqlar va (repo ichida qurilsa) VCS ma'lumoti. `go version -m <binary>` yoki `runtime/debug.ReadBuildInfo()` uni o'qiydi. Git repo ichida qurilgan binary'ning haqiqiy chiqishi:

```text
	mod	ingest	v0.0.0-20261103074207-e946dbbb31cb	
	build	-buildmode=exe
	build	-trimpath=true
	build	vcs=git
	build	vcs.revision=e946dbbb31cbfbe0b24f35eb4d8c8d6dd617e8fc
	build	vcs.time=2026-11-03T07:42:07Z
	build	vcs.modified=false
```

`vcs.revision` aniq commit, `vcs.modified=false` ish daraxti toza bo'lganini bildiradi (`true` bo'lsa, build commit qilinmagan o'zgarishlar bilan olingan). Go 1.24 dan `go build` main modul versiyasini VCS tegi va/yoki commit'dan qo'yadi (Go 1.24 release notes), commit qilinmagan o'zgarish bo'lsa `+dirty` qo'shiladi; bizda teg yo'q edi, shuning uchun vaqt va commit'dan pseudo-versiya chiqdi. Kuzatuv: bu build `-trimpath` bilan qurilgan va `-ldflags` (shu jumladan `-X`) build info'da ko'rinmadi. Qayta sinadik (Go 1.24.7): `-trimpath` siz qurilganda `build -ldflags="..."` qatori bor, `-trimpath` bilan esa yo'q. Shuning uchun `-trimpath` ishlatilganda versiyani build info'dan emas, o'zingiz kiritgan `version` o'zgaruvchisidan o'qing. VCS stamping `.git` bo'lmasa ishlamaydi (`-buildvcs=false` yoki Docker konteksti), shuning uchun u erda commit'ni ldflags bilan uzating.

### embed

`//go:embed` direktivasi fayl yoki katalog mazmunini kompilyatsiya vaqtida binary ichiga joylaydi. Qoidalar (embed paketi hujjati):

- Direktiva paket darajasidagi `string`, `[]byte` yoki `embed.FS` o'zgaruvchisi oldida turadi (`embed` paketi import qilinadi, string/[]byte uchun bo'sh import `_ "embed"` yetadi).
- Katalog embed qilinganda `.` yoki `_` bilan boshlanadigan fayllar chiqarib tashlanadi; `all:` prefiksi bu qoidani o'zgartiradi.
- `embed.FS` faqat o'qish uchun va `io/fs.FS` interface'ini implement qiladi: `http.FS`, `fs.ReadDir`, `template.ParseFS` bilan ishlaydi.

Natija: migratsiya SQL fayllari, HTML shablonlar, statik sahifa binary ichida bo'ladi va yo'l yoki ishchi katalog bilan bog'liq xatolar yo'qoladi.

## Misol: versiya, embed va build info birgalikda

Quyidagi dastur versiya va commit'ni ldflags orqali oladi, `migrations/*.sql` va `web/` ni embed qiladi va build info'dan ba'zi sozlamalarni chiqaradi.

```go
package main

import (
	"embed"
	"fmt"
	"io/fs"
	"runtime"
	"runtime/debug"
)

// Bu o'zgaruvchilar build vaqtida -ldflags "-X main.version=..." bilan to'ldiriladi.
var (
	version = "dev"
	commit  = "noma'lum"
)

//go:embed migrations/*.sql
var migrations embed.FS

//go:embed web
var web embed.FS

func main() {
	fmt.Println("versiya:", version, "commit:", commit)
	fmt.Println("platforma:", runtime.GOOS+"/"+runtime.GOARCH)

	entries, _ := fs.ReadDir(migrations, "migrations")
	for _, e := range entries {
		b, _ := migrations.ReadFile("migrations/" + e.Name())
		fmt.Printf("migratsiya %s (%d bayt)\n", e.Name(), len(b))
	}
	page, _ := web.ReadFile("web/index.html")
	fmt.Printf("web/index.html: %s", page)

	if info, ok := debug.ReadBuildInfo(); ok {
		for _, s := range info.Settings {
			switch s.Key {
			case "vcs", "vcs.modified", "-trimpath", "CGO_ENABLED", "-ldflags":
				fmt.Printf("build %s=%s\n", s.Key, s.Value)
			}
		}
	}
}
```

Git repo ichida `go build -trimpath -ldflags "-X main.version=1.4.0 -X main.commit=$(git rev-parse --short HEAD)"` bilan qurib ishga tushirdik (commit hash sizning repo'ingizda boshqa bo'ladi):

```text
versiya: 1.4.0 commit: e946dbb
platforma: linux/amd64
migratsiya 001_points.sql (33 bayt)
migratsiya 002_idx.sql (29 bayt)
web/index.html: <h1>ingest</h1>
build -trimpath=true
build CGO_ENABLED=1
build vcs=git
build vcs.modified=false
```

Nimalar ko'rinadi: versiya va commit ldflags orqali o'rnatildi; `go run` bilan (ldflags'siz) `dev` va `noma'lum` chiqadi; migratsiya fayllari binary ichidan o'qildi (diskdan emas); build info `-trimpath=true`, `CGO_ENABLED` va VCS holatini ko'rsatdi.

### Docker: multi-stage build

Konteyner uchun uch maqsad: kichik image, ildiz bo'lmagan foydalanuvchi va keshlanadigan qatlamlar. Docker daemon sandbox'da ishga tushmadi (socket yo'q), shuning uchun quyidagi Dockerfile **ishga tushirilmagan va tekshirilmagan**; image nomlari va teglarini o'z reestringizdan tasdiqlang. Distroless README'da (2026-11-03) `static-debian13` va `nonroot` tegi ko'rsatilgan; `golang:1.24` tegi esa tekshirilmadi. U yuqoridagi tajribalardan olingan qarorlarga tayanadi:

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:1.24 AS build
WORKDIR /src

# Avval faqat modul fayllari: bog'liqliklar qatlami keshdan foydalanadi.
COPY go.mod go.sum ./
RUN go mod download

COPY . .
ARG VERSION=dev
ARG COMMIT=unknown
# .git konteyner kontekstiga kirmasligi mumkin, shuning uchun versiya ldflags bilan beriladi.
RUN CGO_ENABLED=0 go build -trimpath -buildvcs=false \
    -ldflags "-s -w -X main.version=${VERSION} -X main.commit=${COMMIT}" \
    -o /out/ingest ./cmd/ingest

FROM gcr.io/distroless/static-debian13:nonroot
COPY --from=build /out/ingest /ingest
USER nonroot:nonroot
ENTRYPOINT ["/ingest"]
```

Qarorlar: (1) `go.mod` va `go.sum` alohida nusxalanadi, shunda `go mod download` qatlami kod o'zgarganda qayta ishlamaydi; (2) `CGO_ENABLED=0` statik binary beradi (yuqorida ldd bilan tekshirilgan mexanizm), shuning uchun runtime image'da libc yo'q; (3) `-trimpath` va `-s -w`; (4) `.git` kontekstga kirmasa, `-buildvcs=false` bilan commit `ARG` orqali uzatiladi; (5) `nonroot` foydalanuvchi: servis ildiz huquqisiz ishlaydi; (6) builder'da Go versiyasi teg bilan qotiriladi. Toolchain-doc'ga ko'ra `go` buyrug'i `go.mod` dagi `go` yoki `toolchain` qatori o'zining toolchain'idan yangiroq bo'lsa, yangi toolchain'ni yuklab ishlatadi; build ichida shunday yuklanish kerak bo'lmasa, `GOTOOLCHAIN=local` bilan faqat o'rnatilgan toolchain ishlatiladi (hujjat: `GOTOOLCHAIN=local` bo'lsa `go` doim o'rnatilgan toolchain'ni ishlatadi; Dockerfile'da sinalmagan).

## Qachon qo'llamaslik kerak

- `-s -w` ni debug qilinadigan staging'da yoqish: profil va debugger imkoniyatini kamaytiradi. Ularni faqat release build'ga qo'ying.
- Katta statik fayllarni (yuzlab MB video, katta modellar) `embed` qilish: binary va xotira o'sadi, deploy sekinlashadi. embed kichik, o'zgarmas aktivlar uchun.
- Maxfiy ma'lumot (kalit, parol) ni `embed` yoki `-X` bilan binary ichiga joylash: u `strings` bilan o'qiladi va artefakt bilan birga tarqaladi. Sirlar muhit yoki secret manager orqali beriladi.
- `FROM scratch` ni hamma narsa uchun ishlatish: unda CA sertifikatlari, vaqt zonasi bazasi va shell yo'q. HTTPS client kerak bo'lsa CA to'plami kerak; muammo bo'lsa distroless yoki `embed`/`time/tzdata` bilan hal qilinadi. Debugging uchun shell yo'qligi ham narx.
- Cgo kerak bo'lgan loyihada `CGO_ENABLED=0` ni majburan qo'yish: build ishlamaydi yoki xatti-harakat o'zgaradi. Avval cgo ehtiyojini tekshiring.
- Takrorlanuvchan build'ni majburiy talab qilish: bu qo'shimcha intizom (versiya qotirish, CI muhiti). Kichik jamoa uchun ortiqcha bo'lishi mumkin; ammo xavfsizlik talabi bo'lsa kerak.

## Stack'da: Node.js bilan farq

Node.js servisini deploy qilish: manba, `package.json`, `npm ci`, ko'pincha `node_modules` va Node.js ishga tushirish muhiti image ichida. Image katta, install bosqichida tarmoq kerak, `devDependencies` ajratilmasa image shishadi. Go'da builder bosqichida compile, runtime bosqichida faqat binary: image o'nlab MB, ishga tushish tezligi yuqori, tarmoq faqat build paytida. Muhit farqlari (Node.js versiyasi, native modul ABI) ham yo'q.

Telemetriya servisi uchun amaliy chek-list: statik binary (`CGO_ENABLED=0`), `-trimpath`, versiya va commit ldflags bilan, `/version` endpoint yoki startup log'ida (84-dars) chiqariladi, migratsiyalar `embed` bilan binary ichida (servis o'zi sxema versiyasini tekshiradi), multi-stage Docker va ildiz bo'lmagan foydalanuvchi, CI'da `govulncheck -mode=binary` (87-dars) tayyor artefaktga qarshi.

## Xulosa

- Go cross-compile `GOOS`/`GOARCH` bilan bitta mashinada ishlaydi (cgo ishlatilmasa); boshqa arxitektura binary'sini target muhitda smoke-test qiling.
- `CGO_ENABLED=0` statik binary beradi; cgo yoqilgan `net` binary'si libc'ga bog'lanadi (ldd bilan tekshirdik) va scratch/distroless static'da ishlamaydi.
- Versiya va commit `var` o'zgaruvchilarga `-ldflags "-X pkg.name=value"` bilan yoziladi; `.git` bo'lmagan muhitda VCS stamping o'rniga shu ishlatiladi.
- `-trimpath` bilan bir xil manba turli katalogda bir xil xesh berdi; `-s -w` o'lchamni qisqartiradi (bizning kichik dasturda ~35%), lekin debugni cheklaydi.
- `//go:embed` fayllarni binary ichiga joylaydi (`.`/`_` bilan boshlanuvchilar `all:` siz tushmaydi); sirlarni embed qilmang; Dockerfile multi-stage, `nonroot`, statik binary bilan quriladi.
