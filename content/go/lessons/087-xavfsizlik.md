---
n: 87
slug: xavfsizlik
title: "Xavfsizlik: govulncheck, supply chain va kirish tekshiruvi"
summary: "Go servis xavfsizligining uch qatlami: bog'liqliklar (govulncheck, go.sum, go mod verify), fayl tizimi (os.Root bilan path traversal) va tashqi kirish (hajm chegarasi, noma'lum maydonlar, diapazon, doimiy vaqtli solishtirish)."
duration: 45
sources:
  - id: vuln-mgmt
    note: "Go Vulnerability Management umumiy tavsifi: vulnerability database, govulncheck va ularning o'zaro munosabati. Aniq bo'limlar bu sessiyada qayta o'qilmagan"
  - id: govulncheck-tutorial
    note: "govulncheck qo'llanmasi: ishga tushirish va natijani o'qish. Sahifa bu sessiyada qayta o'qilmagan, buyruq shakllari qo'llanma tavsifiga tayanadi"
  - id: blog-osroot
    note: "os.Root va traversal-resistant fayl API'lari: maqsad va ishlatish. Cheklovlar ro'yxati bu sessiyada qayta o'qilmagan"
quiz:
  - q: "Loyihada zaif kutubxona bor, lekin govulncheck uni 'import qilingan, lekin kodingiz zaif funksiyani chaqirmaydi' deb alohida belgiladi. Bu nimani anglatadi?"
    options:
      - "Zaiflik mavjud emas, hech narsa qilish shart emas"
      - "Reachability tahlili: zaif funksiyaga chaqiruv yo'li topilmadi, shuning uchun xavf pastroq; lekin yangilash baribir tavsiya etiladi"
      - "Kutubxona versiyasini darhol almashtirish majburiy"
      - "govulncheck faqat go.mod ro'yxatiga qaraydi va chaqiruvlarni tahlil qilmaydi"
    answer: 1
    explain: "govulncheck'ning asosiy farqi shu: u call graph bo'yicha zaif funksiyaga haqiqatan yo'l bormi, shuni tekshiradi va shovqinni kamaytiradi. Lekin 'chaqirilmaydi' degani 'xavfsiz' degani emas (keyingi o'zgarishda yo'l paydo bo'lishi mumkin), shuning uchun yangilash rejaga qo'yiladi."
  - q: "`filepath.Join(base, name)` bilan foydalanuvchi bergan `name = \"../secret.txt\"` qo'shildi va `os.ReadFile` chaqirildi. Natija?"
    options:
      - "Xato: Join '..' ni rad etadi"
      - "Go runtime yo'lni base ichida deb hisoblaydi"
      - "Fayl base katalogidan tashqarida bo'lsa ham o'qiladi: Join '..' ni oddiy yo'l elementi sifatida hal qiladi"
      - "Faqat Windows'da o'qiladi"
    answer: 2
    explain: "Tekshirdik: naive variant '../secret.txt' va symlink orqali ham maxfiy fayl mazmunini qaytardi. os.OpenInRoot (Go 1.24) ikkala holatda 'path escapes from parent' xatosini berdi. Yo'lni stringlar bilan 'tozalash' (Clean, prefix tekshiruvi) symlink'larni hal qilmaydi."
  - q: "Nega `go.sum` fayli git'ga qo'shilishi kerak?"
    options:
      - "U modul versiyalarining kriptografik xeshlarini saqlaydi; yuklab olingan modul o'zgargan bo'lsa, build xato beradi"
      - "U kompilyatsiya tezligini oshiradi"
      - "U faqat go.mod ning nusxasi"
      - "U bog'liqliklarni vendor katalogga ko'chiradi"
    answer: 0
    explain: "go.sum har modul versiyasining xeshini yozadi. Keyingi yuklab olishda xesh mos kelmasa, Go build'ni to'xtatadi. Bu supply chain hujumida (versiya tegi boshqa kodga ko'chirilgan) himoya qiladi. Hamma jamoa a'zosi va CI bir xil xeshlarni ko'rishi uchun fayl repo'da bo'ladi."
  - q: "`json.NewDecoder(r.Body).Decode(&p)` oldidan `http.MaxBytesReader` qo'yishning maqsadi nima?"
    options:
      - "JSON'ni tezroq parse qilish"
      - "Content-Type sarlavhasini tekshirish"
      - "JSON maydonlarini tiplashtirish"
      - "Tana hajmini cheklash: juda katta tana xotirani to'ldirib yubormasligi uchun o'qish chegaradan oshganda xato qaytadi"
    answer: 3
    explain: "MaxBytesReader o'qishni berilgan baytdan keyin to'xtatadi va *http.MaxBytesError qaytaradi (misolda 413 javobi). Cheklovsiz tana serverni xotira bo'yicha ishdan chiqarishi mumkin. Content-Type tekshiruvi alohida qadam."
  - q: "Token solishtirishda `got == expected` o'rniga `subtle.ConstantTimeCompare` ishlatish nima uchun tavsiya qilinadi?"
    options:
      - "ConstantTimeCompare tokenni shifrlaydi"
      - "Oddiy == taqqoslash vaqti mos kelgan belgilar soniga bog'liq bo'lishi mumkin; doimiy vaqtli taqqoslash bu timing kanalini yopadi"
      - "== operatori string uchun ishlamaydi"
      - "ConstantTimeCompare tezroq ishlaydi"
    answer: 1
    explain: "Timing hujumida hujumchi javob vaqtidagi farqdan to'g'ri belgilarni topadi. ConstantTimeCompare uzunligi teng bo'lgan kirishlar uchun vaqtni qiymatga bog'lamaydi. Natija 1 yoki 0 (int), shuning uchun `== 1` bilan tekshiriladi."
  - q: "Diapazon tekshiruvi: `if lat < -90 || lat > 90 { reject }`. `ParseFloat(\"NaN\")` dan kelgan lat uchun nima bo'ladi va qanday tuzatiladi?"
    options:
      - "NaN rad etiladi, tekshiruv to'g'ri"
      - "Dastur panic bilan to'xtaydi"
      - "NaN tekshiruvdan o'tib ketadi (NaN bilan hamma taqqoslash false); shartni `!(lat >= -90 && lat <= 90)` shaklida yozish kerak"
      - "NaN avtomatik 0 ga aylanadi"
    answer: 2
    explain: "IEEE 754 da NaN har qanday taqqoslashda false beradi, shuning uchun `lat < -90 || lat > 90` NaN'ni ushlamaydi. 'Qabul qilinadigan diapazon' ni ijobiy shaklda yozish (`!(x >= a && x <= b)`) NaN va Inf'larni ham rad etadi. Bu 83-darsdagi fuzz topgan xato bilan bir xil."
task:
  title: "Fayl o'qishni os.Root bilan himoyalash"
  prompt: |
    `readReport` foydalanuvchi bergan nomni `filepath.Join` bilan `base` katalogiga qo'shib faylni o'qiydi. `../` va symlink orqali `base` dan tashqaridagi fayl o'qilishi mumkin. Starter test faqat oddiy faylni tekshiradi.

    Vazifa: faylni `reports_test.go` deb saqlang. `readReport` ni `os.OpenInRoot` (Go 1.24) yordamida qayta yozing. Table-driven test: oddiy fayl, ichki katalogdagi fayl, `../secret.txt`, `2026/../../secret.txt`, mutlaq yo'l, symlink orqali tashqi faylga yo'l va mavjud bo'lmagan fayl. Symlink yaratib bo'lmasa (ba'zi platformalarda), shu subtest `t.Skip` qilinsin.
  lang: go
  starter: |
    package reports

    import (
        "os"
        "path/filepath"
        "testing"
    )

    // readReport base katalogidagi hisobot faylini o'qiydi.
    func readReport(base, name string) ([]byte, error) {
        return os.ReadFile(filepath.Join(base, name))
    }

    func TestReadReport(t *testing.T) {
        base := t.TempDir()
        if err := os.WriteFile(filepath.Join(base, "may.txt"), []byte("may"), 0o600); err != nil {
            t.Fatal(err)
        }
        got, err := readReport(base, "may.txt")
        if err != nil || string(got) != "may" {
            t.Fatalf("readReport() = %q, %v", got, err)
        }
    }
  solution: |
    package reports

    import (
        "io"
        "os"
        "path/filepath"
        "testing"
    )

    // readReport base katalogidagi hisobot faylini o'qiydi; base'dan tashqariga chiqib bo'lmaydi.
    func readReport(base, name string) ([]byte, error) {
        f, err := os.OpenInRoot(base, name)
        if err != nil {
            return nil, err
        }
        defer f.Close()
        return io.ReadAll(f)
    }

    func TestReadReport(t *testing.T) {
        tmp := t.TempDir()
        base := filepath.Join(tmp, "reports")
        if err := os.MkdirAll(filepath.Join(base, "2026"), 0o755); err != nil {
            t.Fatal(err)
        }
        write := func(p, s string) {
            t.Helper()
            if err := os.WriteFile(p, []byte(s), 0o600); err != nil {
                t.Fatal(err)
            }
        }
        write(filepath.Join(base, "may.txt"), "may")
        write(filepath.Join(base, "2026", "iyun.txt"), "iyun")
        write(filepath.Join(tmp, "secret.txt"), "MAXFIY")

        linkOK := os.Symlink(filepath.Join(tmp, "secret.txt"), filepath.Join(base, "link.txt")) == nil

        tests := []struct {
            name    string
            file    string
            want    string
            wantErr bool
            needSym bool
        }{
            {name: "oddiy fayl", file: "may.txt", want: "may"},
            {name: "ichki katalog", file: "2026/iyun.txt", want: "iyun"},
            {name: "yuqoriga chiqish", file: "../secret.txt", wantErr: true},
            {name: "ichkaridan chiqish", file: "2026/../../secret.txt", wantErr: true},
            {name: "mutlaq yo'l", file: filepath.Join(tmp, "secret.txt"), wantErr: true},
            {name: "symlink orqali", file: "link.txt", wantErr: true, needSym: true},
            {name: "mavjud emas", file: "yoq.txt", wantErr: true},
        }
        for _, tt := range tests {
            t.Run(tt.name, func(t *testing.T) {
                if tt.needSym && !linkOK {
                    t.Skip("symlink yaratib bo'lmadi")
                }
                got, err := readReport(base, tt.file)
                if (err != nil) != tt.wantErr {
                    t.Fatalf("readReport(%q) xatosi = %v, xato kutilganmi: %v", tt.file, err, tt.wantErr)
                }
                if string(got) != tt.want {
                    t.Errorf("readReport(%q) = %q, kutilgan %q", tt.file, got, tt.want)
                }
            })
        }
    }
  solutionNotes: |
    - `os.OpenInRoot(base, name)` `name` ni `base` ildizi ichida hal qiladi va tashqariga chiqadigan yo'lni (shu jumladan symlink orqali) `path escapes from parent` xatosi bilan rad etadi. `filepath.Clean` yoki prefiks tekshiruvi symlink'larni hal qilmaydi.
    - Starter implementatsiyasi bilan yangi testlar `../secret.txt`, ichkaridan chiqish va symlink holatlarida yiqiladi: mexanizm testlar yordamida tasdiqlangan.
    - `t.TempDir()` bilan `base` ni alohida ichki katalogda (`tmp/reports`) yaratib, `secret.txt` ni tashqarida qo'yish uchun test o'z muhitini qo'lda qurgan.
    - Symlink yaratish ruxsatga bog'liq (Windows), shuning uchun `needSym` bilan o'tkazib yuboriladi.
    - `os.Root` hamma holatni hal qilmaydi (masalan, `base` ning o'zi foydalanuvchi nazoratida bo'lmasligi kerak); cheklovlar uchun `os.Root` hujjatiga qarang.
  checklist:
    - "`readReport` `os.OpenInRoot` ishlatadi va faylni yopadi"
    - "`../`, ichkaridan chiqish va symlink orqali o'qish xato qaytaradi"
    - "Oddiy va ichki katalogdagi fayllar o'qiladi"
    - "Table-driven test ettita holatni qamraydi, symlink uchun `t.Skip` bor"
    - "`go vet` va `go test -race` o'tadi"
---

## Muammo

Xavfsizlik odatda "keyinroq" qoladi, birinchi hodisaga qadar. Go servislari uchun xavf uch joydan keladi. Birinchisi: bog'liqliklar. Servis o'nlab kutubxonaga va yuzlab tranzitiv modulga tayanadi, ularning birida bo'lgan zaiflik sizning servisingizga ham tegishli bo'lishi mumkin. Ikkinchisi: Go standart kutubxonasi va toolchain'ning o'zi: u ham yangilanadi va xavfsizlik tuzatishlari yangi minor release'larda chiqadi (1-dars: qo'llab-quvvatlash siyosati). Uchinchisi: tashqaridan kelgan kirish: foydalanuvchi yoki qurilma yuboradigan bayt, nom va yo'l. Telemetriya qabul qiluvchi servis internetga ochiq, shuning uchun uchala qatlam ham muhim.

Bu dars har qatlam uchun amaliy minimumni beradi: bog'liqlik zaifliklarini `govulncheck` bilan topish, `go.sum` va `go mod verify` bilan yetkazib berish zanjirini himoyalash, fayl tizimidagi path traversal'ni `os.Root` bilan yopish va HTTP kirishini tekshirish. Local ishga tushirilgan misollar haqiqiy chiqishga ega. `govulncheck` tashqi vosita bo'lib, sandbox'da o'rnatilmadi va bu darsda kompilyatsiya yoki ishga tushirish natijasi berilmaydi: faqat uning tavsifi va buyruq shakllari. 

## Asosiy g'oya

### Bog'liqlik zaifliklari: govulncheck

Go jamoasi ma'lum zaifliklarni vulnerability database'da yuritadi. `govulncheck` shu bazaga qarshi loyihani tekshiradi. Uning asosiy farqi: u faqat go.mod ro'yxatiga emas, kodingiz zaif funksiyaga haqiqatan yetib boradimi, shuni call graph bo'yicha tahlil qiladi. Natija shovqinsizroq: "paket import qilingan, lekin zaif funksiya chaqirilmaydi" holatlari alohida ajratiladi. Ikki rejim bor: manba kodi bo'yicha (`govulncheck ./...`) va tayyor binary bo'yicha (`-mode=binary`). Binary rejimi mumkin, chunki Go binary ichiga qaysi modul versiyalari bilan qurilgani haqida ma'lumot yozadi (`go version -m <binary>` yoki `runtime/debug.ReadBuildInfo`, quyida misol).

```bash
# o'rnatish (tashqi modul, sandbox'da bajarilmadi)
go install golang.org/x/vuln/cmd/govulncheck@latest

# manba kodi bo'yicha: go.mod bog'liqliklari va chaqiriladigan funksiyalar
govulncheck ./...

# tayyor binary bo'yicha: binary ichidagi build info'dan modullar ro'yxatini oladi
govulncheck -mode=binary ./bin/ingest
```

Bu buyruq shakllari govulncheck tavsifiga tayanib yozilgan va tekshirilmagan: sandbox'da tashqi modul yuklab bo'lmaydi, qo'llanma sahifasi esa bu sessiyada qayta o'qilmagan. Bayroqlarni `govulncheck -h` bilan solishtiring. Standart kutubxonadagi zaifliklar Go versiyasi bilan bog'liq, shuning uchun ularni toolchain'ni yangilab bartaraf etasiz (1-dars: qo'llab-quvvatlash siyosati, 2-dars: toolchain).

### Yetkazib berish zanjiri: go.sum va checksum

- `go.sum` har modul versiyasi uchun kriptografik xeshni saqlaydi. Yuklangan modul xeshi mos kelmasa, build to'xtaydi. Fayl repo'da bo'lishi shart.
- `go mod verify` modul keshidagi fayllar yuklangandan beri o'zgarmaganini tekshiradi; hech narsa o'zgarmagan bo'lsa `all modules verified` deb javob beradi (bizning loyihada shunday chiqdi).
- Go modullari minimal versiya tanlash (MVS) bilan ishlaydi: yangi versiya paydo bo'lgani uchun bog'liqlik o'z-o'zidan yangilanmaydi, yangilashni siz boshlaysiz (`go get`, `go list -m -u all` yangilanishlarni ko'rsatadi). Bu qurilmaning takrorlanuvchanligini beradi, lekin zaiflik tuzatishlarini ham o'zingiz kiritishingiz kerak (shuning uchun govulncheck CI'da muntazam ishlashi kerak).
- Go modul proksi va checksum database'ga qanday ishlashi, `GOPRIVATE`, `GONOSUMDB` kabi sozlamalar Go Modules Reference'da tavsiflangan; ichki (private) modullar uchun ularni sozlash kerak, aks holda ichki modul nomlari ommaviy servislarga so'rov sifatida chiqib ketishi mumkin.

### Kirish: ishonmang, tekshiring

Tashqaridan kelgan har qiymat ishonchsiz: sarlavha, yo'l, tana, qurilma identifikatori. Minimal to'plam:

1. **Hajm chegarasi**: `http.MaxBytesReader` tana hajmini cheklaydi, `http.Server` esa sarlavha va o'qish timeout'lari bilan (72-dars) sekin mijozlardan himoya qiladi.
2. **Qat'iy parse**: `json.Decoder.DisallowUnknownFields` kutilmagan maydonlarni rad etadi.
3. **Semantik tekshiruv**: uzunlik, diapazon, ruxsat etilgan qiymatlar. Diapazonni ijobiy shaklda yozing (NaN uchun, 83-dars).
4. **Autentifikatsiya**: sirlarni `crypto/subtle.ConstantTimeCompare` bilan solishtiring, tokenlarni `crypto/rand` bilan yarating (`math/rand` emas).

## Chuqurroq: path traversal va os.Root

Foydalanuvchi bergan fayl nomini `filepath.Join(base, name)` bilan qo'shish klassik zaiflik: `name` `../` elementlariga ega bo'lsa, natija `base` dan tashqariga chiqadi. `filepath.Clean` va prefiks tekshiruvi (`strings.HasPrefix`) bu xatoni qisman yopadi, lekin symlink'lar (`base` ichidagi havola tashqaridagi faylga ishora qiladi) bu usullarni chetlab o'tadi, chunki matn darajasida yo'l ichkarida ko'rinadi. Go 1.24 da `os.Root` qo'shilgan (API ro'yxatida `os.OpenRoot` va `os.OpenInRoot` bor): u katalogni "ildiz" sifatida ochadi va undan keyingi barcha operatsiyalar shu ildiz ichida bajariladi; ildizdan chiqib ketadigan yo'l (`..` yoki symlink orqali) xato beradi. `blog-osroot` maqolasi shu dizaynni tushuntiradi. `os.OpenInRoot(dir, name)` bir martalik ochish uchun qisqartma. `os.Root` ning qaysi holatlarda himoya qilmasligi (platformaga xos cheklovlar) maqola va paket hujjatida yozilgan; ularni bu darsda tekshirmadik.

Quyidagi misol aynan shu xatti-harakatni ko'rsatadi: `base/reports` ichida `may.txt` oddiy fayl, tashqarida `secret.txt`, va `base/link.txt` symlink shu maxfiy faylga ishora qiladi.

```go
package main

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

// readNaive: foydalanuvchi nomini to'g'ridan-to'g'ri yo'lga qo'shadi.
func readNaive(base, name string) (string, error) {
	b, err := os.ReadFile(filepath.Join(base, name))
	return string(b), err
}

// readRooted: os.Root (Go 1.24) ildiz katalogdan chiqib ketishga yo'l qo'ymaydi.
func readRooted(base, name string) (string, error) {
	f, err := os.OpenInRoot(base, name)
	if err != nil {
		return "", err
	}
	defer f.Close()
	b, err := io.ReadAll(f)
	return string(b), err
}

func main() {
	tmp, err := os.MkdirTemp("", "trav")
	if err != nil {
		panic(err)
	}
	defer os.RemoveAll(tmp)

	base := filepath.Join(tmp, "reports")
	must(os.MkdirAll(base, 0o755))
	must(os.WriteFile(filepath.Join(base, "may.txt"), []byte("may hisoboti"), 0o644))
	must(os.WriteFile(filepath.Join(tmp, "secret.txt"), []byte("MAXFIY"), 0o644))
	must(os.Symlink(filepath.Join(tmp, "secret.txt"), filepath.Join(base, "link.txt")))

	for _, name := range []string{"may.txt", "../secret.txt", "link.txt"} {
		n, nerr := readNaive(base, name)
		r, rerr := readRooted(base, name)
		fmt.Printf("%-14s naive=%q (xato: %v)\n", name, n, nerr)
		fmt.Printf("%-14s rooted=%q (xato: %v)\n", "", r, clean(rerr, tmp))
	}
}

// clean vaqtinchalik katalog nomini chiqishdan olib tashlaydi (chiqish barqaror bo'lishi uchun).
func clean(err error, tmp string) any {
	if err == nil {
		return nil
	}
	return strings.ReplaceAll(err.Error(), tmp, "<tmp>")
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
```

Chiqish (Go 1.24.7, linux/amd64; vaqtinchalik katalog nomi `<tmp>` bilan almashtirilgan):

```text
may.txt        naive="may hisoboti" (xato: <nil>)
               rooted="may hisoboti" (xato: <nil>)
../secret.txt  naive="MAXFIY" (xato: <nil>)
               rooted="" (xato: openat ../secret.txt: path escapes from parent)
link.txt       naive="MAXFIY" (xato: <nil>)
               rooted="" (xato: openat link.txt: path escapes from parent)
```

Naive variant ikkala hujumda ham `MAXFIY` mazmunini qaytardi. `os.OpenInRoot` ikkalasini ham `path escapes from parent` xatosi bilan rad etdi, oddiy fayl esa o'qildi.

## Misol: ishonchsiz kirishni qabul qilish

Quyidagi handler yuqoridagi to'plamni birlashtiradi: token solishtirish, tana hajmi chegarasi, qat'iy JSON parse va diapazon tekshiruvi. Uni `httptest` bilan beshta holatda sinadik:

```go
package main

import (
	"crypto/subtle"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
)

type Point struct {
	Device string  `json:"device"`
	Lat    float64 `json:"lat"`
	Lon    float64 `json:"lon"`
}

func (p Point) validate() error {
	switch {
	case p.Device == "" || len(p.Device) > 32:
		return errors.New("device: 1-32 belgi bo'lishi kerak")
	case !(p.Lat >= -90 && p.Lat <= 90):
		return errors.New("lat: [-90, 90] oralig'ida bo'lishi kerak")
	case !(p.Lon >= -180 && p.Lon <= 180):
		return errors.New("lon: [-180, 180] oralig'ida bo'lishi kerak")
	}
	return nil
}

func handler(token string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		got := r.Header.Get("Authorization")
		// Doimiy vaqtli solishtirish: javob vaqti qaysi belgigacha mos kelganini oshkor qilmaydi.
		if subtle.ConstantTimeCompare([]byte(got), []byte("Bearer "+token)) != 1 {
			http.Error(w, "ruxsat yo'q", http.StatusUnauthorized)
			return
		}
		r.Body = http.MaxBytesReader(w, r.Body, 256) // tana hajmi cheklangan
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields() // noma'lum maydon xato
		var p Point
		if err := dec.Decode(&p); err != nil {
			var tooBig *http.MaxBytesError
			if errors.As(err, &tooBig) {
				http.Error(w, "tana juda katta", http.StatusRequestEntityTooLarge)
				return
			}
			http.Error(w, "noto'g'ri JSON: "+err.Error(), http.StatusBadRequest)
			return
		}
		if err := p.validate(); err != nil {
			http.Error(w, err.Error(), http.StatusUnprocessableEntity)
			return
		}
		w.WriteHeader(http.StatusCreated)
	})
}

func main() {
	h := handler("s3cret")
	cases := []struct{ name, auth, body string }{
		{"to'g'ri", "Bearer s3cret", `{"device":"T-104","lat":41.3,"lon":69.2}`},
		{"token xato", "Bearer xato", `{"device":"T-104"}`},
		{"noma'lum maydon", "Bearer s3cret", `{"device":"T-104","lat":1,"lon":1,"admin":true}`},
		{"diapazon", "Bearer s3cret", `{"device":"T-104","lat":123,"lon":1}`},
		{"katta tana", "Bearer s3cret", `{"device":"` + strings.Repeat("x", 400) + `"}`},
	}
	for _, c := range cases {
		req := httptest.NewRequest(http.MethodPost, "/points", strings.NewReader(c.body))
		req.Header.Set("Authorization", c.auth)
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, req)
		fmt.Printf("%-16s -> %d %s\n", c.name, rec.Code, strings.TrimSpace(rec.Body.String()))
	}
}
```

```text
to'g'ri          -> 201 
token xato       -> 401 ruxsat yo'q
noma'lum maydon  -> 400 noto'g'ri JSON: json: unknown field "admin"
diapazon         -> 422 lat: [-90, 90] oralig'ida bo'lishi kerak
katta tana       -> 413 tana juda katta
```

Qarorlar:

- Javob statuslari xatoning turini ajratadi: 401 (token), 400 (JSON shakli yoki noma'lum maydon), 413 (juda katta tana), 422 (semantik xato). Mijoz va monitoring uchun bu farq foydali.
- `*http.MaxBytesError` `errors.As` bilan ushlanadi , shunda hajm xatosi umumiy "JSON noto'g'ri" xatosidan ajraladi.
- Diapazon tekshiruvi `!(x >= a && x <= b)` shaklida: NaN va cheksizliklar rad etiladi.
- Xato matni kirishni aks ettirmaydi (parol yoki token qaytarilmaydi). `json: unknown field "admin"` kabi xabar mijozga ichki tuzilma haqida kam ma'lumot beradi, lekin umuman ommaviy API'da xabarni umumiyroq qilish mumkin.

### Build ma'lumotini ko'rish

Binary ichidagi build ma'lumotini `go version -m` ko'rsatadi:

```text
/tmp/bi_bin: go1.24.7
	path	lesson87/bi
	mod	lesson87	(devel)	
	build	-buildmode=exe
```

Bu ma'lumot govulncheck binary rejimi uchun asos. Loyihada tashqi bog'liqliklar bo'lsa, `dep` qatorlari ham ko'rinadi.

## Qachon qo'llamaslik kerak

- govulncheck natijasini "toza" deb mutlaq ishonch sifatida qabul qilish. U faqat ma'lum, bazaga kiritilgan zaifliklarni topadi. Yangi (hali e'lon qilinmagan) zaiflik yoki kodingizdagi mantiqiy xato uni chetlab o'tadi. U SAST yoki code review o'rnini bosmaydi.
- Har ogohlantirishda darhol hamma narsani yangilash: ba'zan major yangilash kod o'zgartirishni talab qiladi. Reachability natijasiga qarab ustuvorlik qo'ying, lekin muddatni belgilang.
- `os.Root` ni har yo'l uchun ishlatish: ichki, ishonchli yo'llar (konfiguratsiya fayli) uchun ortiqcha. Foydalanuvchi nazoratidagi nom paydo bo'lgan joylarda ishlating.
- Hamma maydonni qat'iy rad etish ichki, versiyalanadigan API'larda mijozlarni sindirishi mumkin: yangi maydon qo'shgan yangi mijoz eski serverga yuborsa, 400 oladi. `DisallowUnknownFields` odatda tashqi, ishonchsiz kirishlar va konfiguratsiyalar uchun mos, jumladan versiyalash strategiyasi bilan (76-dars).
- "Xavfsizlik" ni faqat kod darajasida hal qilish: konteyner, tarmoq va sirlar boshqaruvi ham muhim (89-dars).
- Validatsiyani faqat mijoz tomonda qoldirish: server har doim tekshiradi.

## Stack'da: npm audit bilan farq

Node.js'da `npm audit` package-lock.json bo'yicha zaif versiyalarni topadi. `npm` tranzitiv bog'liqliklar daraxti katta bo'lgani uchun ko'p "shovqin" beradi. Go'da govulncheck reachability tahlili bilan bu shovqinni kamaytirishga qaratilgan, Go loyihalarida bog'liqliklar odatda kamroq bo'ladi (bu muallifning tajribaviy bahosi, o'lchangan raqam emas). Node.js'da paketlar o'rnatish paytida skript (install script) ishga tushirishi mumkin. Go'da bog'liqlik yuklash va build jarayonlari alohida bosqichlar; build vositalari (`go generate`, cgo) esa alohida xavf yuzasi bo'lib qoladi.

Node.js'da `path.join(base, name)` bilan bir xil traversal xatosi bor, himoya esa odatda `path.resolve` + prefiks tekshiruvi; symlink uchun `fs.realpath`. Go 1.24 da `os.Root` bu tekshiruvni ilovadan chiqarib, standart kutubxonaga oladi. CI uchun minimal xavfsizlik qadamlari: `go vet ./...`, `govulncheck ./...`, `go mod verify`, va release binary'si uchun `govulncheck -mode=binary`.

## Xulosa

- Bog'liqlik zaifliklari uchun `govulncheck` (CI'da muntazam): reachability tahlili shovqinni kamaytiradi, lekin faqat ma'lum zaifliklarni topadi.
- `go.sum` repo'da bo'lsin, `go mod verify` ni CI'da ishlating; bog'liqliklar o'z-o'zidan yangilanmaydi, yangilanishni siz boshqarasiz.
- Foydalanuvchi nomidan fayl yo'li hosil qilinsa, `os.Root` / `os.OpenInRoot` (Go 1.24) ishlating: `filepath.Join` va matnli tekshiruv `..` va symlink'dan himoya qilmaydi (tekshirdik).
- HTTP kirishi: `MaxBytesReader`, `DisallowUnknownFields`, diapazonni ijobiy shaklda tekshirish (NaN!), xatolarni turlarga ajratish.
- Sirlarni `subtle.ConstantTimeCompare` bilan solishtiring va tokenlarni `crypto/rand` bilan yarating.
