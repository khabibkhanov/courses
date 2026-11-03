---
n: 2
slug: toolchain-va-go-mod
title: "Toolchain: go command, GOTOOLCHAIN va go.mod'dagi go/toolchain qatorlari"
summary: "Go 1.21 dan beri go buyrug'i toolchain'ni o'zi tanlaydi: go qatori minimal talab, toolchain qatori tavsiya, GOTOOLCHAIN esa ularni bekor qila oladi. Versiyalar qanday taqqoslanadi, qachon yangi toolchain yuklanadi va language version fayl darajasida qanday o'zgaradi."
duration: 35
sources:
  - id: toolchain-doc
    note: "Introduction, Go versions, Module and workspace configuration, The GOTOOLCHAIN setting, Go toolchain selection, Go toolchain switches, Downloading toolchains va go get bilan boshqarish bo'limlari"
  - id: gomod-ref
    note: "go direktivasi: minimal versiya, Go 1.21 gacha advisory bo'lgani, til xususiyatlariga ta'siri"
  - id: go-mod-ref
    note: "go direktivasi bo'limi: yaroqli versiya yozuvlari (1.14, 1.21rc1, 1.23.0) va toolchain tanlashga ta'siri"
quiz:
  - q: "Mashinada Go 1.24.7 o'rnatilgan, go.mod'da `go 1.25.0` yozilgan, `GOTOOLCHAIN=local`. `go build` nima qiladi?"
    options:
      - "Go 1.25.0 ni yuklaydi va ishga tushiradi"
      - "Eski kompilyator bilan kompilyatsiya qilib, yangi xususiyatlar uchun ogohlantirish beradi"
      - "go.mod'dagi go qatorini 1.24.7 ga tushirib qo'yadi"
      - "Xato bilan to'xtaydi: go.mod requires go >= 1.25.0"
    answer: 3
    explain: "Go 1.21 dan go qatori majburiy minimal talab. local rejimida boshqa toolchain'ga o'tish taqiqlangan, shuning uchun go buyrug'i ishlashni rad etadi. Ogohlantirish bilan davom etish Go 1.21 gacha bo'lgan advisory xatti-harakat edi."
  - q: "go.mod'da `go 1.23.0` bor, `toolchain` qatori yo'q. Bu faylga go buyrug'i qanday qaraydi?"
    options:
      - "toolchain qatori yo'q bo'lsa toolchain tanlash faqat GOTOOLCHAIN'ga qaraydi"
      - "Go qatoridagi V uchun `toolchain goV` qatori yozilgandek"
      - "toolchain qatori yo'q bo'lsa ham toolchain latest deb olinadi"
      - "Faylni yaroqsiz deb rad etadi"
    answer: 1
    explain: "Hujjat: toolchain qatori tushirib qoldirilsa, go qatoridagi V versiyasi bilan yozilgan implicit `toolchain goV` qatori bor deb hisoblanadi. latest hech qachon avtomatik tanlanmaydi."
  - q: "Quyidagi qaysi go.mod yaroqsiz?"
    options:
      - "go 1.21.3 yozilgan modul go 1.22.0 talab qiladigan dependency'ga require qilgan"
      - "go 1.24.0 va toolchain go1.24.7 qatorlari birga turgan modul"
      - "go qatori umuman yo'q modul (implicit go 1.16)"
      - "go 1.21rc1 yozilgan modul"
    answer: 0
    explain: "Modulning go qatori har bir require qilingan modulning go qatoridan kichik bo'lmasligi shart. Shu sababli go get va go mod tidy go qatorini ko'taradi. Qolgan uchta yozuv hujjatda ruxsat etilgan shakllar."
  - q: "`GOTOOLCHAIN=go1.24.7+auto` va go.mod'da `go 1.26.0` bo'lsa (mashinada Go 1.25.1 bor), qaysi toolchain ishlaydi?"
    options:
      - "go1.24.7 chunki u aniq nomlangan"
      - "go1.25.1 chunki u mashinaning bundled toolchain'i"
      - "go1.26.0, chunki +auto shakli default'dan keyin ham yangiroq go qatoriga o'tishga ruxsat beradi"
      - "Xato: ikki xil talab ziddiyatda"
    answer: 2
    explain: "`<name>+auto` default sifatida name'ni oladi, lekin go/toolchain qatori undan yangi bo'lsa, o'sha yangi versiyaga o'tadi. Bundled toolchain'ning o'zi bu holatda qaror qabul qilmaydi."
  - q: "Quyidagi fayl `go 1.21` yozilgan modulda. Natija nima?\n\n//go:build go1.22\npackage main\n...\nfor i := range 3 { fmt.Println(i) }"
    options:
      - "Kompilyatsiya xatosi: range over int faqat go.mod'da 1.22 bo'lganda ishlaydi"
      - "Ishlaydi: build constraint fayl uchun language version'ni 1.22 ga ko'taradi"
      - "Ishlaydi, lekin faqat GOEXPERIMENT=rangefunc bilan"
      - "Fayl e'tiborsiz qoldiriladi, chunki go.mod eski"
    answer: 1
    explain: "Hujjat: build constraint go1.21 yoki undan yuqori minimalni bildirsa, fayl uchun language version shu minimal bo'ladi. Fayl 1.22 dan eski toolchain'da umuman kompilyatsiya qilinmaydi (constraint sabab), 1.22+ da esa range over int ishlaydi."
  - q: "Jamoa sortlashda `\"go1.21.9\" < \"go1.21.10\"` qiyosini oddiy string taqqoslash bilan qildi. Bu qaysi holatda noto'g'ri javob beradi?"
    options:
      - "Hech qachon, versiyalar har doim bir xil uzunlikda"
      - "Faqat release candidate'larda"
      - "Patch raqami bir va ikki xonali bo'lganda: string taqqoslashda \"9\" > \"1\" chiqadi, ya'ni go1.21.9 > go1.21.10"
      - "Faqat 1.9 dan eski versiyalarda"
    answer: 2
    explain: "String taqqoslash belgi-belgi ishlaydi: \"go1.21.9\" va \"go1.21.10\" da oxirgi qismlarda '9' va '1' solishtiriladi. To'g'ri yo'l - go/version.Compare, u 1.N.P tuzilmasini, rc va language version tartibini biladi."
task:
  title: "Toolchain tanlash qoidasini to'g'ri hisoblash"
  prompt: |
    Jamoa ichki vosita yozyapti: u go.mod'dagi `go` va `toolchain` qatorlari hamda GOTOOLCHAIN rejimiga qarab go buyrug'i qaysi toolchain'ni ishga tushirishini oldindan hisoblaydi. Qoidalar toolchain hujjatidagi bilan bir xil:

    - `mode == "auto"` va toolchain qatori `default` emas bo'lsa: toolchain qatori mahalliy (local) toolchain'dan yangi bo'lsa, o'sha tanlanadi; aks holda go qatori mahalliydan yangi bo'lsa, go qatori tanlanadi.
    - Aks holda go qatori mahalliydan yangi bo'lsa, xato qaytariladi (toolchain'ga o'tish taqiqlangan).
    - Hech biri bo'lmasa mahalliy toolchain qoladi.

    Hozirgi `decide` versiyalarni oddiy string sifatida taqqoslaydi va `go1.24.10` kabi ikki xonali patch raqamlarida noto'g'ri javob beradi. Funksiyani tuzating (imzoni o'zgartirmang), `main` dagi barcha 6 holat `OK` chiqishi kerak.
  lang: go
  starter: |
    package main

    import (
        "fmt"
    )

    // decide go buyrug'i qaysi toolchain'ni ishga tushirishini hisoblaydi.
    // local - o'rnatilgan toolchain (masalan "go1.24.7"), goLine va toolchainLine -
    // go.mod'dagi qiymatlar ("go" prefiksi bilan), mode - "local" yoki "auto".
    func decide(local, goLine, toolchainLine, mode string) (string, error) {
        if mode == "auto" && toolchainLine != "default" {
            if toolchainLine != "" && toolchainLine > local {
                return toolchainLine, nil
            }
            if goLine > local {
                return goLine, nil
            }
        }
        if goLine > local {
            return "", fmt.Errorf("go.mod requires go >= %s (running %s; GOTOOLCHAIN=local)", goLine, local)
        }
        return local, nil
    }

    func main() {
        cases := []struct {
            local, goLine, tc, mode string
            want                    string
        }{
            {"go1.24.7", "go1.21.0", "", "auto", "go1.24.7"},
            {"go1.24.7", "go1.25.0", "", "auto", "go1.25.0"},
            {"go1.24.7", "go1.24.0", "go1.24.10", "auto", "go1.24.10"},
            {"go1.24.10", "go1.24.0", "go1.24.9", "auto", "go1.24.10"},
            {"go1.24.7", "go1.25.0", "", "local", "error"},
            {"go1.24.7", "go1.25.0", "default", "auto", "error"},
        }
        for _, c := range cases {
            got, err := decide(c.local, c.goLine, c.tc, c.mode)
            if err != nil {
                got = "error"
            }
            status := "OK  "
            if got != c.want {
                status = "FAIL"
            }
            fmt.Printf("%s local=%s go=%s toolchain=%q mode=%s -> %s (kutilgan %s)\n", status, c.local, c.goLine, c.tc, c.mode, got, c.want)
        }
    }
  solution: |
    package main

    import (
        "fmt"
        "go/version"
    )

    // decide go buyrug'i qaysi toolchain'ni ishga tushirishini hisoblaydi.
    // local - o'rnatilgan toolchain (masalan "go1.24.7"), goLine va toolchainLine -
    // go.mod'dagi qiymatlar ("go" prefiksi bilan), mode - "local" yoki "auto".
    func decide(local, goLine, toolchainLine, mode string) (string, error) {
        if mode == "auto" && toolchainLine != "default" {
            if toolchainLine != "" && version.Compare(toolchainLine, local) > 0 {
                return toolchainLine, nil
            }
            if version.Compare(goLine, local) > 0 {
                return goLine, nil
            }
        }
        if version.Compare(goLine, local) > 0 {
            return "", fmt.Errorf("go.mod requires go >= %s (running %s; GOTOOLCHAIN=local)", goLine, local)
        }
        return local, nil
    }

    func main() {
        cases := []struct {
            local, goLine, tc, mode string
            want                    string
        }{
            {"go1.24.7", "go1.21.0", "", "auto", "go1.24.7"},
            {"go1.24.7", "go1.25.0", "", "auto", "go1.25.0"},
            {"go1.24.7", "go1.24.0", "go1.24.10", "auto", "go1.24.10"},
            {"go1.24.10", "go1.24.0", "go1.24.9", "auto", "go1.24.10"},
            {"go1.24.7", "go1.25.0", "", "local", "error"},
            {"go1.24.7", "go1.25.0", "default", "auto", "error"},
        }
        for _, c := range cases {
            got, err := decide(c.local, c.goLine, c.tc, c.mode)
            if err != nil {
                got = "error"
            }
            status := "OK  "
            if got != c.want {
                status = "FAIL"
            }
            fmt.Printf("%s local=%s go=%s toolchain=%q mode=%s -> %s (kutilgan %s)\n", status, c.local, c.goLine, c.tc, c.mode, got, c.want)
        }
    }
  solutionNotes: |
    - `go/version` paketi (Go 1.22 dan) `go1.21.10` kabi qiymatlarni 1.N.P tuzilmasi bo'yicha taqqoslaydi; `version.Compare` -1, 0 yoki +1 qaytaradi. String taqqoslashda esa `go1.24.9 > go1.24.10` chiqadi.
    - Funksiya faqat `go` prefiksli, to'liq (uch qismli) toolchain nomlari bilan ishlaydi. `go1.22` language version, uni toolchain nomi deb ishlatib bo'lmaydi (hujjat: toolchain nomlari `go1.22.0` ko'rinishida).
    - `toolchain default` qatori yangilanishni o'chiradi, shuning uchun go qatori mahalliydan yangi bo'lsa xato qaytadi.
    - Tuzatishdan keyin to'rtinchi holat ham to'g'ri: mahalliy go1.24.10 toolchain qatoridagi go1.24.9 dan yangi, shuning uchun o'zida qoladi.
  checklist:
    - "Barcha 6 holat `OK` chiqadi"
    - "Taqqoslash `go/version.Compare` orqali, string operatorlarisiz"
    - "`toolchain default` va `mode == \"local\"` holatlarida xato qaytadi"
    - "Funksiya imzosi o'zgarmagan"
    - "`go vet` ogohlantirishsiz o'tadi"
---

## Muammo

Jamoada ikki dasturchi: biri Go 1.22 bilan, ikkinchisi 1.24 bilan ishlaydi. CI esa Docker image'dagi Go 1.23 da quradi. Kod `for i := range 3` ni ishlatadi. Birinchi dasturchida hammasi o'tadi, CI'da build yiqiladi, ikkinchisida lokal ishlaydi. Node.js dunyosida bunga `.nvmrc` yoki `engines` maydoni javob beradi, lekin ular odatda ogohlantirish darajasida qoladi va runtime'ni o'zi almashtirmaydi.

Go 1.21 dan boshlab bu muammoga til darajasida javob berilgan: modul qaysi Go versiyasini talab qilishini `go.mod` ichida yozadi, `go` buyrug'ining o'zi esa kerak bo'lsa boshqa toolchain'ni topadi yoki yuklaydi. Lekin mexanizmning o'z qoidalari bor: qaysi qator minimal talab, qaysi biri faqat tavsiya, qachon tarmoqdan nimadir yuklanadi va qachon go buyrug'i ishlashdan bosh tortadi. Bu qoidalarni bilmagan jamoa kutilmagan toolchain almashinuvlariga, CI'da sirli yuklashlarga va "mening mashinamda ishlaydi" holatlariga duch keladi.

## Asosiy g'oya

### Toolchain nima

Toolchain hujjati Go 1.21 dan boshlab Go distributivi `go` buyrug'idan va bundled toolchain'dan iborat ekanini yozadi. Toolchain bu standart kutubxona, compiler, assembler va boshqa vositalar. `go` buyrug'i o'zining bundled toolchain'ini ham, PATH'dagi yoki kerak bo'lganda yuklab olingan boshqa versiyalarni ham ishlata oladi. Qaysi toolchain ishlashi uch narsaga bog'liq: `GOTOOLCHAIN` environment sozlamasi, asosiy modulning `go.mod` faylidagi `go` va `toolchain` qatorlari (yoki workspace'dagi `go.work`).

### go va toolchain qatorlari

Ikki qatorning ma'nosi har xil:

- `go 1.24.0` qatori **minimal talab**. Hujjat: bu modul yoki workspace'dan foydalanish uchun zarur bo'lgan eng kichik Go versiyasi. Go 1.21 gacha bu qator advisory edi: build o'tsa toolchain hammasi joyida deb hisoblardi, o'tmasa versiya nomuvofiqligi haqida eslatma chiqarardi. Go 1.21 uni majburiy talabga aylantirdi. Backport ham qilingan: Go 1.19.13 va undan keyingi 1.19 release'lari hamda Go 1.20.8 va undan keyingi 1.20 release'lari Go 1.22 yoki undan yuqori versiyani e'lon qilgan modulni yuklashni rad etadi.
- `toolchain go1.24.7` qatori **tavsiya etilgan toolchain**. U `go` qatoridan yuqori bo'lishi mumkin. Misol: kutubxona Go 1.21 bilan ham ishlay oladi (`go 1.21.0`), lekin uning mualliflari o'zi bilan ishlaganda 1.24.7 ni afzal ko'radi. Qator tushirib qoldirilsa, hujjatga ko'ra `go` qatoridagi V uchun `toolchain goV` yozilgandek qaraladi. Go qatori ham yo'q bo'lsa, `go.mod` uchun implicit `go 1.16`, `go.work` uchun implicit `go 1.18` olinadi.

Versiya yozuvlari: `1.14`, `1.21rc1`, `1.23.0` kabi shakllar yaroqli. `1.N` shakli **language version** deyiladi: u butun 1.N oilasini bildiradi. `1.21`, `1.21rc2` va `1.21.3` bir xil language version (1.21) ni amalga oshiradi. Muhim nozik joy: 1.21 dan boshlab birinchi release `1.21.0`, 1.21 ning o'zi esa release emas, shuning uchun toolchain nomi sifatida `go1.21` yaroqsiz (lekin `go1.20` yaroqli, chunki eski sxema).

Versiya tartibi hujjatda aniq berilgan: language version'lar farq qilsa, shu hal qiladi (`1.21.9 < 1.22`). Bir language version ichida: language version'ning o'zi, undan keyin release candidate'lar (R bo'yicha), undan keyin release'lar (P bo'yicha). Ya'ni `1.21 < 1.21rc1 < 1.21rc2 < 1.21.0 < 1.21.1`.

### GOTOOLCHAIN

`GOTOOLCHAIN` sozlamasi `<name>`, `<name>+auto` yoki `<name>+path` shaklida bo'ladi. Qiymat standart qoidalar bilan topiladi: process environment, so'ng `go env -w` bilan yozilgan fayl, so'ng `$GOROOT/go.env`. Standart toolchain'larda `go.env` `GOTOOLCHAIN=auto` qiymatini beradi. `auto` qisqartmasi `local+auto`, `path` esa `local+path`.

- `local`: har doim bundled toolchain.
- `go1.21.0` kabi aniq nom: har doim shu toolchain; PATH'da bo'lsa o'shani, bo'lmasa yuklab olib tekshirilganini ishlatadi.
- `<name>+auto` yoki `+path`: avval default (`local` yoki name), keyin `go.mod`/`go.work`dagi `toolchain` va `go` qatorlariga qarab, kerak bo'lsa yangiroq toolchain'ga o'tadi. `+path` yuklab olishni o'chiradi: faqat PATH qidiriladi.

## Chuqurroq: tanlash va o'tish algoritmi

### Startda tanlash

`+auto`/`+path` rejimida go buyrug'i `go.work` (bo'lmasa `go.mod`) ni o'qiydi. Agar fayldagi `toolchain <tname>` qatori default toolchain'dan yangi bo'lsa, `tname` ishlaydi. `toolchain default` qatori bo'lsa, default toolchain qoladi va yangilash urinishi o'chiriladi. Aks holda `go <version>` qatori default'dan yangi bo'lsa, `go<version>` ishlaydi. Agar toolchain o'tishi mumkin bo'lmasa (masalan `local`), go buyrug'i xato bilan chiqadi, chunki go qatori minimal talab.

Tanlangan toolchain PATH'da `go1.21.3` nomli dastur sifatida qidiriladi; topilmasa yuklanadi. Yuklash alohida mexanizm: toolchain `golang.org/toolchain` moduli sifatida, `v0.0.1-goVERSION.GOOS-GOARCH` versiyasi bilan olinadi, ya'ni GOPROXY va checksum database orqali. Shu sababli `GOSUMDB=off` bo'lsa toolchain yuklash tasdiqlash yo'qligidan yiqiladi, `GOPRIVATE` va `GONOSUMDB` esa toolchain yuklashga ta'sir qilmaydi. Go 1.24 dan `GODEBUG=toolchaintrace=1` tanlash jarayonini kuzatishga imkon beradi.

### Qaysi yangi versiyaga o'tadi

`go get` yoki `go install pkg@version` kabi buyruq yangi dependency qo'shganda, dependency'ning go qatori hozirgi toolchain'dan yuqori bo'lib chiqishi mumkin. Shunda go buyrug'i qo'llab-quvvatlanayotgan release'lar orasidan eng eskisini tanlaydi, u talabni qondirsa (minimal version selection ruhida). Hujjatning o'z misoli: so'nggi patch'lar 1.28.3 va 1.27.9 bo'lib, talab 1.24rc1 bo'lsa, 1.27.9 tanlanadi. O'tish haqida `go: module ... requires go >= ...; switching to go ...` xabari chiqadi.

### Fayllarni yangilash

`go get go@1.22.1 toolchain@go1.24rc1` kabi buyruq `go` va `toolchain` qatorlarini bitta dependency kabi boshqaradi. Toolchain go qatoridan eski bo'la olmaydi: `go get toolchain@go1.21.3` go qatori 1.22.1 bo'lganda go qatorini ham 1.21.3 ga tushiradi. `toolchain@none` toolchain qatorini o'chiradi. Workspace uchun `go work edit -toolchain=none`.

Go 1.25 release notes: go buyrug'i go qatorini yangilaganda endi o'zining versiyasi bilan `toolchain` qatori qo'shmaydi. Bu o'zgarishni Go 1.26 yana bir qadam davom ettirdi: `go mod init` endi yangi `go.mod` ga joriy versiyadan bir minor past qiymat yozadi (Go 1.26 `go 1.25.0` yozadi), release candidate'lar esa ikki minor past.

### Language version fayl darajasida

`go` qatori kompilyator qabul qiladigan til xususiyatlarini ham belgilaydi: modul ichidagi paketlar o'sha versiyadan keyin qo'shilgan xususiyatni ishlata olmaydi. Fayl darajasida build constraint buni o'zgartira oladi: `//go:build go1.22` fayl uchun language version'ni kamida 1.22 qiladi (constraint 1.21 yoki undan yuqori minimalni bildirsa) va 1.22 dan eski toolchain'lar faylni umuman kompilyatsiya qilmaydi.

## Misol: o'zingiz ko'ring

### 1. Versiya tartibi

String taqqoslash va `go/version` farqini ko'ring:

```go
package main

import (
	"fmt"
	"go/version"
	"sort"
)

func main() {
	vs := []string{"go1.21.10", "go1.21.9", "go1.21", "go1.21rc2", "go1.22", "go1.21.0", "go1.21rc1", "go1.9"}
	sort.Slice(vs, func(i, j int) bool { return version.Compare(vs[i], vs[j]) < 0 })
	fmt.Println("version.Compare:", vs)

	byString := append([]string(nil), vs...)
	sort.Strings(byString)
	fmt.Println("sort.Strings:   ", byString)

	fmt.Println("Lang(go1.21.3):", version.Lang("go1.21.3"))
	fmt.Println("IsValid(1.21.3):", version.IsValid("1.21.3"))
	fmt.Println("IsValid(go1.21.3):", version.IsValid("go1.21.3"))
}
```

Go 1.24.7 (linux/amd64) da chiqish:

```text
version.Compare: [go1.9 go1.21 go1.21rc1 go1.21rc2 go1.21.0 go1.21.9 go1.21.10 go1.22]
sort.Strings:    [go1.21 go1.21.0 go1.21.10 go1.21.9 go1.21rc1 go1.21rc2 go1.22 go1.9]
Lang(go1.21.3): go1.21
IsValid(1.21.3): false
IsValid(go1.21.3): true
```

`go/version` faqat `go` prefiksli qiymatlarni qabul qiladi, `go.mod`dagi `1.21.3` ni "go" qo'shib bering. String tartibi esa `go1.9` ni eng oxiriga qo'yadi va `go1.21.10` ni `go1.21.9` dan oldin keltiradi.

### 2. Talab bajarilmasa

Sandbox'dagi Go 1.24.7 da `go.mod` ichida `go 1.99` yozib, `GOTOOLCHAIN=local go run .` ishga tushirdik:

```text
go: go.mod requires go >= 1.99 (running go 1.24.7; GOTOOLCHAIN=local)
```

Sozlama `auto` (default) bo'lganda go buyrug'i yangi toolchain'ni yuklashga urinadi. Sandbox'da tarmoq yopiq, shuning uchun xabar quyidagicha tugadi (yuklash manzili GOPROXY edi):

```text
go: upgrading toolchain to go1.99.0 (required by go line in go.mod; upgrade allowed by GOTOOLCHAIN=auto)
go: downloading go1.99.0 (linux/amd64)
go: download go1.99.0: golang.org/toolchain@v0.0.1-go1.99.0.linux-amd64: Get "https://proxy.golang.org/...": dial tcp: lookup proxy.golang.org on 8.8.8.8:53: no such host
```

Ya'ni `auto` rejimida go qatori talabi tarmoq so'rovi bo'lib chiqadi. Tarmog'i cheklangan CI'da shu yerda yiqilasiz.

### 3. Language version

`go 1.21` yozilgan modulda `for i := range 3` bor (Go 1.22 xususiyati). `go vet` va `go build`:

```text
./main.go:9:17: cannot range over 3 (untyped int constant): requires go1.22 or later (-lang was set to go1.21; check go.mod)
```

Fayl boshiga `//go:build go1.22` qo'shilsa, aynan shu kod ishlaydi va `0 1 2` chiqaradi. `go.mod`da `go 1.21` qolgan bo'lsa ham.

### 4. go.mod o'zi yangilanadi

`go 1.21` yozilgan modul `go 1.24.0` talab qiladigan lokal dependency'ga `replace` bilan bog'langan. Oddiy `go build` `go: updates to go.mod needed; to update it: go mod tidy` deb to'xtaydi. `-mod=mod` bilan esa go buyrug'i faylni o'zi tuzatdi:

```text
go 1.24.0

toolchain go1.24.7
```

Bu Go 1.24.7 xatti-harakati: u go qatorini ko'targanda `toolchain` qatorini ham qo'shdi. Yuqorida yozganimizdek, Go 1.25 dan bu qator qo'shilmaydi. Ikki xatti-harakat ham o'z versiyasida to'g'ri, shuning uchun `go.mod` diff'ida kutilmagan `toolchain` qatorini ko'rsangiz, jamoada toolchain versiyalari aralash ekanini bildirishi mumkin.

## Qachon qo'llamaslik kerak

- Avtomatik toolchain o'tishi hamma joyda foydali emas. Air-gapped yoki cheklangan tarmoqdagi CI'da `GOTOOLCHAIN=local` qo'ying: go buyrug'i yuklashga urinmaydi, versiya yetmasa tushunarli xato bilan to'xtaydi.
- Kutubxonaning `go` qatorini keraksiz ko'tarmang. Iste'molchi uchun muhim bo'lgani aynan shu qator (minimal talab): uni ko'tarish hamma iste'molchini ham ko'tarishga majbur qiladi, chunki modulning go qatori dependency'larnikidan kichik bo'la olmaydi.
- `go` qatorini faqat "yangi versiya chiqdi" uchun ko'tarmang. U language version'ni va GODEBUG default'larini ham o'zgartiradi (1-dars), shuning uchun ko'tarishdan keyin testlarni ishga tushiring.
- Go qatorini `GOFLAGS=-mod=mod` yoki qo'lda tahrir bilan "jimgina" o'zgartirmang: bu `go.mod` ni build jarayonida yangilab qo'yadi va qaysi o'zgarish qachon bo'lgani izsiz qoladi. Yangilashni `go get go@...` bilan aniq qiling.
- Bu darsdagi sinovlar Go 1.24.7 ichida o'tkazildi: `local` rejimi va tarmoqsiz `auto` urinishi tekshirildi, boshqa toolchain'ga haqiqiy o'tish (yuklab olish bilan) tekshirilmadi, u haqdagi gaplar hujjatga tayanadi.

## Stack'da: Node.js/TypeScript bilan solishtirish

Node.js'da runtime versiyasi tashqarida: `nvm`, `.nvmrc`, Docker image tegi, `package.json`dagi `engines`. Odatda hech biri o'zi runtime'ni almashtirmaydi; `engines` ko'p holatda ogohlantirish beradi. Go'da talab va uni bajaruvchi mexanizm bitta joyda: `go.mod`. Amaliy qoidalar:

- Servis repozitoriysida `go` qatorini jamoa haqiqatan sinagan eng past versiyaga qo'ying, `toolchain` qatorini esa Docker image bilan bir xil patch versiyaga (masalan CI'da `golang:1.24.7` image va `toolchain go1.24.7`).
- CI'da `GOTOOLCHAIN=local` va image tegini bitta joydan boshqaring. Shunda "CI jimgina boshqa toolchain yuklab oldi" holati bo'lmaydi.
- Monorepo'da `go.work` ishlatilsa, uning `go` qatori `use` ro'yxatidagi har bir modulnikidan kichik bo'lmasligi kerak; `go work use` va `go work sync` buni tuzatadi.
- Toolchain yangilashni `go get go@latest` bilan emas, `go get go@1.24 toolchain@go1.24.7` kabi aniq buyruq bilan alohida pull request qiling (1-dars: yangilashdan keyin test va benchmark).

Bu mavzu 39-darsdagi modullar va MVS bilan bevosita bog'langan: `go` va `toolchain` qatorlari ham versiyalangan dependency sifatida boshqariladi.

## Xulosa

- `go` qatori Go 1.21 dan majburiy minimal talab; `toolchain` qatori faqat tavsiya, tushirib qoldirilsa `toolchain goV` implicit.
- `GOTOOLCHAIN` default'i `auto`: go buyrug'i kerak bo'lsa yangi toolchain'ni PATH'dan topadi yoki `golang.org/toolchain` moduli orqali yuklaydi. `local` bu o'tishni o'chiradi.
- Versiyalarni faqat `go/version` bilan taqqoslang: string tartibi `go1.21.10` va `go1.9` da noto'g'ri.
- `go` qatori language version'ni belgilaydi, fayl darajasida `//go:build go1.N` uni ko'taradi.
- `go get go@... toolchain@...` ikkala qatorni izchil yangilaydi; Go 1.25 dan go buyrug'i o'zi `toolchain` qatorini qo'shmaydi, Go 1.26 dan `go mod init` bir minor past `go` qiymatini yozadi.
- Cheklangan tarmoqli CI'da `GOTOOLCHAIN=local` qo'ying va image versiyasini `go.mod` bilan moslang.
